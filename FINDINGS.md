# FINDINGS

Verified 2026-08-20 against `Kwaai-AI-Lab/KwaaiNet` **`main` at commit `50558c6`**
(committed 2026-08-20, workspace version **0.5.5**) and the **v0.5.4** published release
binaries -- the two are not the same thing, and source claims must be re-checked if the clone
moves. Vendored clone: `~/KwaaiNet-main`, never edited. Paths are repo-relative. Method is
stated for each finding so a reviewer can re-run it.

Verdict key: **VERIFIED** = read in the source or observed in a binary. **REPORTED** = stated
by Kwaai's own documents, not independently checked. **OPEN** = needs a live mesh (gate G0).

---

## F1 -- The inference wire carries raw token IDs. **OBSERVED** (G0, 2026-08-20)

`core/crates/kwaai-cli/src/block_rpc.rs:48-56`

    pub enum PayloadType {
        /// Raw token IDs (first node only).  Each element is a `u32` LE.
        TokenIds,
        /// Floating-point hidden states.  Each element is an `f16` LE.
        HiddenStates,
    }

`shard_api.rs:218` tokenizes the prompt locally; `:260` calls `token_ids_to_bytes(&current_ids)`
and ships them. The embedding table lives on the **first block server**, not the coordinator --
`hf.rs:334` and `:557`, `model.embed_tokens.*` is downloaded "first node only". So position 1
in the chain must receive token IDs to do the embedding lookup at all. This is structural, not
an oversight: the coordinator has no embedder.

**OBSERVED.** A stand-in block server captured a live dispatch: `payload_type 'token_ids'`,
`shape [29]`, 116 bytes of `u32-LE`, 203 bytes total on the wire -- detokenized back to the
exact prompt with nothing but a vocabulary file. See `OBSERVATION.md`; the transport observed
was the local bypass, and the same struct is built by both paths.

**Implication.** In a distributed chain, peer 1 receives the entire prompt in a
trivially-reversible encoding. Peers 2..N receive `f16` hidden states, which are a much harder
(though not impossible) inversion target. The privacy boundary of a KwaaiNet inference chain is
therefore **one peer**, and that peer sees everything.

## F2 -- RAG chat rides that wire by default on Linux ARM64. VERIFIED

README: "RAG-augmented chat (streams from your shard API)". `shard_api.rs:428-441`
(`spawn_inference`) takes the local llama.cpp path **only** under `#[cfg(feature = "llama-cpp")]`
with a loaded model; otherwise every request falls through to `run_inference` -- the distributed
path.

`llama-cpp` is **not** a default feature (`kwaai-cli/Cargo.toml:126`, defaults are
`["storage","rag"]`). Confirmed against the shipped binary: zero `llama_backend_init`,
`ggml_backend`, or `llama_model_load` symbols in `kwaainet-aarch64-unknown-linux-gnu`.

**Implication.** On a Raspberry Pi or any Linux ARM64 box running the official release, `rag
chat` retrieves your private chunks locally, stuffs them into a prompt, and sends that prompt to
the mesh. The RAG section's promise -- "runs entirely on your local node, no network required" --
is true of *retrieval* and false of *generation*.

## F3 -- Trust is a sort key, not a gate -- and it is the wrong trust. VERIFIED

Two independent ladders exist in the workspace, sharing one label vocabulary:

| | `kwaai-trust/src/trust_score.rs` | `kwaai-cli/src/reputation.rs` |
|---|---|---|
| derived from | verifiable credentials, weight x time decay, capped 1.0 | `0.5*availability + 0.3*throughput + 0.2*latency` |
| tiers | `>=0.70 / >=0.40 / >=0.10 / else Unknown` (`:85-91`) | `n<5 -> Unknown`, `<0.40 Known`, `<0.70 Verified`, `>=0.70 Trusted` (`:277-285`) |
| carries | FiduciaryPledgeVC, VerifiedNodeVC -- the DTG story | observed performance |
| EigenTrust | `peer_endorsement_contribution` hard-coded `0.0`, "Phase 4" | n/a |

**Chain selection uses the second one.** `shard_cmd.rs:1155-1162` loads `ReputationStore` and
writes `entry.trust_score = Some(score.score)`. The credential ladder -- the entire verifiable
-credential trust graph the README and whitepaper are built on -- **never touches peer
selection**.

And even that is only a tie-break. `shard_cmd.rs:2884-2896`: candidates are filtered on block
coverage and `failed_peers`, then sorted widest-coverage first, trust second, self third. A
broader grep for `min_trust|minimum_trust|required_tier|min_tier|trust_threshold` across all 13
crates returns nothing outside the two scoring functions. There is no gate.

Two further wrinkles: the whole enrichment is behind `cfg.reputation.enabled`, so with
reputation off `trust_score` stays `None` and the tie-break degenerates; and the two ladders
disagree on what `Known` means (`>=0.10` credential-derived vs `n>=5` and `<0.40`
behaviour-derived).

**Implication.** The number ordering your inference peers is a **performance** metric wearing
trust vocabulary. An `Unknown`-by-credential peer with good uptime sorts *first* and receives
F1's token IDs. So the lane's gate cannot simply add a filter to the existing field -- it must
bind deliberately to the credential ladder, and say which ladder it means. This is still the
highest-leverage patch, and it is still small.

## F4 -- The VPK store holds plaintext vectors today. VERIFIED + REPORTED

`kwaai-storage/src/lib.rs:3` says each node "can act as an Eve (storage host), holding
**encrypted** vectors". Grep for `encrypt|aes|cipher|phe|homomorph` across
`kwaai-storage/src/` returns exactly that one doc comment and no implementation. Same grep
across `kwaai-cli/src/storage.rs` and `kwaai-rag/src/`: nothing.

Kwaai says so themselves. The whitepaper: "PHE algorithm integration into the VPK storage layer
-- **replacing the current transport-only encryption** -- is the next engineering phase."

**Implication.** `kwaainet rag connect-eve <PEER>` today ships your embeddings to a peer who
stores them in the clear, protected in transit by libp2p noise and at rest by nothing. Embedding
inversion is a live attack literature; those vectors are the corpus. The doc comment overstating
this is a courteous first-PR candidate (either fix the comment or land the crypto).

## F5 -- Roles have drifted between the whitepaper and the code. VERIFIED

Whitepaper: **Bob** = data owner, **Alice** = entitled querier, **SaM** ("Service and Malice") =
storage host. Code and README: "Eve nodes serve multi-tenant vector storage; **Bob** nodes
discover Eves by PeerId via DHT" -- so `Eve` is the storage host, and the classical-crypto Eve
is the eavesdropper, i.e. the opposite connotation of a role you voluntarily hand data to.

**Implication.** Cosmetic, but it will bite the sMCP specification work, where role names become
normative. Worth one line in an issue.

## F6 -- kwaai-compression compresses tensors, not meaning. VERIFIED

`core/crates/kwaai-compression/` = blockwise 8-bit quantization, top-K sparse gradients, delta
encoding. It is a bandwidth crate for gradient and activation transfer.

**Implication.** The name is taken but the layer this lane proposes is empty. There is no
semantic compression anywhere in KwaaiNet. That is the hole our harness fits.

## F7 -- Bob's audit log is self-authored. VERIFIED (by absence) + REPORTED

The whitepaper leans hard on the audit log: "an oversight body can verify the complete history
of who accessed what knowledge base ... without ever seeing the underlying documents" (Aim 3
rests on this). But the log is written by Bob, about Bob's own disclosures, with no counterparty
signature. Nothing in the shipping code emits a receipt the *receiver* signs.

**Implication.** A self-authored log is evidence of intent, not of event. This is the exact
shape the UOR kappa lane already surveyed and refuted upstream: `assert_double_entry` has the
bilateral form (A-about-B + B-about-A, one epoch advance) but verifies neither input signature,
enforces no reciprocity, and has zero callers -- run 02 verdict, "recording shape without gate".
**Bilateral mint is shipped on neither side.** That makes it a shared contribution surface
rather than a borrow.

## F8 -- Pi 4 specifics (hardware for the Bob box). VERIFIED

- Prebuilt `aarch64-unknown-linux-gnu` and `-musl` tarballs both bundle `kwaainet` + `p2pd`.
  64-bit OS required; no armv7 target exists (`core/Cargo.toml:237-245`).
- The **gnu** build is compiled with `-C target-feature=+fp16,+fullfp16`
  (`core/.cargo/config.toml:2`). Disassembly confirms emitted ARMv8.2 FEAT_FP16 instructions
  (`fmla v1.8h`, `fmul h2`) inside `gemm_f16::microkernel::neonfp16::*` and
  `half::binary16::arch::aarch64::multiply_f16_fp16`. Cortex-A72 (Pi 4) is ARMv8.0 -- those
  instructions are illegal, so expect SIGILL when an f16 matmul runs. Cortex-A76 (Pi 5) is fine.
- The **musl** build has **zero** such instructions (same disassembly grep, count 0). Use it on
  a Pi 4. The official installer picks gnu when glibc is present, so install musl by hand.
- gnu build needs glibc >= 2.34 (Bookworm 2.36 OK, Bullseye 2.31 not).

**Implication.** The Pi is the right hardware for **Bob** -- keys, embedder, mapping table,
plaintext store, ledger -- and the wrong hardware for inference. That is not a limitation of the
plan; it is the plan. Bob's work is I/O-bound; inference is what we deliberately delegate.

## F9 -- Compression must be precomputed at ingest. OPEN (design ruling, not a defect)

The agentprivacy compression layer is agent work: a strong model produces the invariant core and
its tellings. A Pi cannot run that model. Therefore the ladder is built **at ingest time on a
workstation or via the harness**, stored beside the chunk, and at query time the Bob box only
*selects* a precomputed telling. Selection is a table lookup and a tier comparison -- cheap
enough for a Pi 4.

If this ruling fails (tellings too corpus-specific to precompute, ladder needs the live query to
be built), the design degrades to "Bob needs a big model", which defeats the point.
**This is the assumption to attack first.**
