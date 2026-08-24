# What crosses the wire: the first peer in a KwaaiNet inference chain sees the whole prompt

Status: draft v1, 2026-08-20. Source-verified against Kwaai-AI-Lab/KwaaiNet at
`main` commit `50558c6` (workspace version 0.5.5) and against the published
`v0.5.4` release binaries - two different pins, named separately wherever it
matters. Every load-bearing claim carries a file citation and a tier: VERIFIED
(read in the cited source at the cited commit, or observed in the cited
binary), REPORTED (from a project document, not independently executed), or
OPEN (a question this note does not settle). Commands for every VERIFIED claim
are in `evidence/VERIFY.md` of this lane.

## 1. The observation

A KwaaiNet distributed inference request tokenizes its prompt on the
coordinator and sends **raw token IDs** to the first peer of the chain. Peers
in later positions receive floating-point hidden states. The privacy boundary
of a chain is therefore not the chain - it is **one peer**, and that peer
receives the prompt in a form that reverses with a single tokenizer call.

This is structural rather than an oversight, and the note says so plainly in
section 3. It is written because the consequence interacts badly with the
retrieval pipeline shipped alongside it.

## 2. What the wire carries

`core/crates/kwaai-cli/src/block_rpc.rs:48-56` [VERIFIED] defines the payload
discriminant:

    pub enum PayloadType {
        /// Raw token IDs (first node only).  Each element is a `u32` LE.
        TokenIds,
        /// Floating-point hidden states.  Each element is an `f16` LE.
        HiddenStates,
    }

The comment is the project's own. `shard_api.rs:218` [VERIFIED] encodes the
prompt with the local tokenizer; `:260` [VERIFIED] calls
`token_ids_to_bytes(&current_ids)` and dispatches the result to position 1.

Positions 2..N receive `HiddenStates`. Inverting hidden states back to text is
a materially harder problem than detokenizing token IDs, and this note makes no
claim about its difficulty [OPEN].

## 3. Why it is structural

`hf.rs:334` and `hf.rs:557` [VERIFIED] gate tensor download by chain position:
`model.embed_tokens.*` is fetched by the **first** node only;
`model.norm.*` and `lm_head.*` by the last.

The coordinator therefore holds no embedding table and cannot produce hidden
states itself. Something has to perform the embedding lookup, and the only
party holding the table is peer 1. Sending tokens is not a shortcut; it is the
only thing the architecture permits.

Stating this matters for tone. There is no defect here to report. There is a
boundary to be aware of, and a design consequence for anyone building on top.

## 4. Why it interacts badly with RAG

`shard_api.rs:428-441` [VERIFIED] - `spawn_inference` takes the local
llama.cpp path **only** under `#[cfg(feature = "llama-cpp")]` with a model
loaded; otherwise every request falls through to `run_inference`, the
distributed path.

`llama-cpp` is not a default feature: `kwaai-cli/Cargo.toml:126` [VERIFIED]
gives `default = ["storage", "rag"]`.

Confirmed against the shipped artefact rather than inferred: the published
`kwaainet-aarch64-unknown-linux-gnu` binary contains zero occurrences of
`llama_backend_init`, `ggml_backend`, `llama-cpp-2` or `llama_model_load`
[VERIFIED, v0.5.4].

So on a Linux ARM64 release build there is no in-process inference path at all.
A `rag chat` session retrieves private chunks from the local knowledge base,
assembles them into a prompt, and sends that prompt to the mesh - where peer 1
receives it as token IDs.

The RAG documentation states the knowledge base "runs entirely on your local
node - no network, no Eve node required" [REPORTED]. That is accurate about
**retrieval** and does not describe **generation**.

## 5. The gap the project already names

The VPK whitepaper conditions its sMCP guarantee explicitly [REPORTED]:

> "For deployments where Alice's AI model runs locally or in a trusted enclave,
> the model provider never sees the underlying documents."

On a heterogeneous inference mesh that condition does not hold. The residual is
the plaintext context window on a machine belonging to someone else. This note
claims no more than that the condition is stated by the project and is not
satisfied by the default distributed path.

## 6. What this note does not establish [OPEN]

- **The wire has not been observed.** Every claim above is read from source and
  from a binary. No two-node mesh has been run, no payload captured, no
  detokenization performed. A maintainer is entitled to treat this as a reading
  until that is done.
- **Whether the exposure is accepted.** It may well be a known trade-off for
  the current phase, with "run inference locally when the prompt is sensitive"
  as the intended answer. This note does not assume otherwise.
- **Hidden-state inversion.** Nothing here quantifies what positions 2..N can
  recover.

## 7. Consequence for anyone building on top

If a design assumes that sharding an inference request distributes the *trust*
requirement across the chain, it is mistaken: the trust requirement is
concentrated at position 1 and the remaining positions inherit a weaker one.
Any gate intended to protect prompt content must therefore bind the peer in
position 1 specifically, and must run **before** tokenization - between prompt
assembly (`shard_api.rs:190`) and encoding (`:218`).

That placement is the single design fact this note exists to fix in place.
