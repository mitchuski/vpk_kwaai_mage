# ISSUE_DRAFT

Draft for `Kwaai-AI-Lab/KwaaiNet`. **Not posted.** Posting is a door.

Written to the lesson a previous lane paid for: arrive grounded in shipped code, ask rather than
assert, and lead with something small and useful rather than a pile of patches.

Everything below is checkable against `main` at `50558c6`. Commands in `evidence/VERIFY.md`.

---

## Title

Three questions about the inference-side trust boundary, and one doc fix

## Body

Hello -- I have been reading KwaaiNet closely for a couple of weeks, from the angle of running a
node as a data owner on small hardware. The VPK whitepaper is the clearest statement of the
storage-side problem I have read, and the `EncryptionLayer` trait being pluggable is the right
call. What follows is three things I could not resolve from the source, plus one small fix I am
happy to open as a PR.

I may have misread any of these. All line references are `main` at `50558c6` (workspace 0.5.5).

### 1. The doc fix (happy to PR this today)

`core/crates/kwaai-storage/src/lib.rs:3` says a node "can act as an Eve (storage host), holding
**encrypted** vectors". As far as I can find, nothing in `kwaai-storage`, `kwaai-rag` or
`kwaai-cli/src/storage.rs` encrypts anything -- a grep for `encrypt|aes|cipher|phe|homomorph`
across those trees returns only that comment.

The whitepaper is straightforward that PHE integration "replacing the current transport-only
encryption" is the next engineering phase, so I read this as the comment running ahead of the
roadmap rather than anything being wrong. But a reader running `rag connect-eve` today may take
it literally and ship embeddings to a peer expecting them to be encrypted at rest. Would you
take a PR that either softens the comment or adds a one-line note to the RAG section of the
README?

### 2. Which trust does chain selection use?

There appear to be two trust ladders:

- `kwaai-trust/src/trust_score.rs` -- credential-derived, VC weights with time decay, tiers at
  0.70 / 0.40 / 0.10.
- `kwaai-cli/src/reputation.rs:277-285` -- behaviour-derived,
  `0.5*availability + 0.3*throughput + 0.2*latency`, `n < 5` meaning Unknown.

`shard_cmd.rs:1155-1162` enriches chain entries from the `ReputationStore`, so peer ordering
appears to use the second. Is that intended? Reading the README's intent-routing description
("model X, minimum trust tier Verified, max latency Y") I had expected the credential ladder to
be the one gating who serves a request.

Related: at `shard_cmd.rs:2884-2900` candidates are filtered on block coverage and previously
failed peers, and trust enters only as a secondary sort key. A grep for
`min_trust|minimum_trust|required_tier|min_tier|trust_threshold` across the crates finds
nothing. Is a minimum-tier filter planned, or is ordering the intended mechanism?

### 3. Is the first-peer prompt exposure a known accepted trade-off?

`block_rpc.rs:48-56` defines `PayloadType::TokenIds` as "first node only", and `shard_api.rs`
tokenizes locally (`:218`) then sends token IDs to position 1 (`:260`). Since
`model.embed_tokens.*` is downloaded by the first block server only (`hf.rs:334`, `:557`), I
take it this is structural -- the coordinator has no embedder, so peer 1 must receive tokens.

The consequence is that the first peer in a chain receives the entire prompt in a form that
detokenizes trivially, while peers 2..N see only hidden states. Combined with question 2, an
`Unknown`-by-credential peer with good uptime can hold position 1.

This matters most in combination with the RAG pipeline: `spawn_inference`
(`shard_api.rs:428-441`) only takes the local llama.cpp path under `#[cfg(feature =
"llama-cpp")]`, which is not a default feature, so on a Linux ARM64 release build `rag chat`
retrieves private chunks locally and then sends them to the mesh. I checked the published
`aarch64-unknown-linux-gnu` binary and found no `llama_backend_init` / `ggml_backend` symbols,
which is consistent with that reading.

I ran this rather than only reading it. Standing in as a block server on the local bypass port,
a 29-token prompt arrived as `payload_type: token_ids`, `shape [29]`, 116 bytes of `u32-LE`, 203
bytes total -- and detokenized back to the exact prompt using nothing but a `tokenizer.json`. I
have not exercised the libp2p path to a remote peer; both paths build the same
`InferenceRequest` through the same `token_ids_to_bytes` call, which is why I think the payload
observation carries, but I would rather say what I did and did not run.

Is this a known and accepted trade-off for the current phase, with the answer being "run
inference locally if your prompt is sensitive"? If so it might be worth a line in the RAG
section, since the surrounding text emphasises that the knowledge base needs no network.

### 4. A smaller one: role names

The whitepaper uses Bob / Alice / **SaM** for owner / querier / storage host. The code and README
use **Eve** for the storage host. Since sMCP is heading for a ToIP Standard Specification where
role names become normative, and since "Eve" conventionally denotes the eavesdropper rather than
a party you voluntarily hand data to, it may be worth aligning them before the spec text
settles.

### What I am working on, in case it is useful

I have been designing a disclosure layer for the inference side: rather than sending retrieved
chunks, send a compressed re-expression whose fidelity is chosen by the receiving peer's trust
tier, content-addressed so an auditor can verify afterwards exactly what was released without
seeing it. It is explicitly **not** homomorphic inference and it is not a cryptographic
guarantee -- it bounds disclosure and makes the bound provable, which is a weaker claim.

Two things about it might interest the VPK working group specifically. First, it fits Aim 1's
shape: you are defining compliance criteria for what may sit in an encryption tier, and this is
the same exercise on a disclosure axis. Second, Aim 3 asks whether audit trails carry enough
signal for oversight -- a bilaterally-signed, content-addressed release ledger is a stronger
substrate for that experiment than a self-authored log, because the counterparty signs too.

I have not built it yet and I am not asking you to adopt anything. If there is an existing
thread where this belongs, I would rather bring it there than open a new one.

Thanks for publishing the whitepaper with the open questions stated as openly as they are. That
is rarer than it should be.

---

## Notes to self before posting

- Re-run `evidence/VERIFY.md` against whatever `main` is on the day. Line numbers move.
- Check whether an issue or discussion already covers any of these. Do not duplicate.
- Offer the doc PR **first** and let it land before raising 2 and 3, if the maintainers seem
  busy. One useful small thing beats four questions.
- Do not attach the ladder design unless asked. The last three paragraphs are the whole pitch.
- If a maintainer engages, the natural next artefact is a note, not a patch.
