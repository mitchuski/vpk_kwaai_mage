# Two trust ladders, and the one that orders your peers is not the one carrying the credentials

Status: draft v1, 2026-08-20. Source-verified against Kwaai-AI-Lab/KwaaiNet at
`main` commit `50558c6` (workspace version 0.5.5). Claim tiers: VERIFIED (read
in the cited source at the cited commit), REPORTED (from a project document,
not independently executed), OPEN (a question this note does not settle).
Commands in `evidence/VERIFY.md`. Companion to note 01, which establishes what
the first peer in a chain receives.

## 1. The observation

KwaaiNet contains two independent trust scores that share one vocabulary of
tiers. Peer selection for inference uses the **behavioural** one. The
**credential** one - the verifiable-credential trust graph that the README, the
whitepaper, and the Decentralized Trust Graph framing are all built on - does
not participate in peer selection at all.

Neither score gates anything. Both are, at most, sort keys.

## 2. The two ladders

**Credential-derived**, `kwaai-trust/src/trust_score.rs` [VERIFIED]:
`TrustScore::from_credentials` sums a weight per recognised credential type,
each multiplied by a time decay from its issuance date, capped at 1.0. Tiers at
`:85-91`: `>= 0.70 Trusted`, `>= 0.40 Verified`, `>= 0.10 Known`, else
`Unknown`. This is the ladder that carries `FiduciaryPledgeVC`,
`VerifiedNodeVC` and the rest.

`peer_endorsement_contribution` is hard-coded to `0.0`, with a doc comment
stating that full EigenTrust propagation over the endorsement graph "arrives in
Phase 4" [VERIFIED]. So the graph part of the trust graph is not yet computed.

**Behaviour-derived**, `kwaai-cli/src/reputation.rs:275-285` [VERIFIED]:

    let score = 0.5 * s_availability + 0.3 * s_throughput + 0.2 * s_latency;
    let tier = if n < 5 { Unknown }
               else if score < 0.40 { Known }
               else if score < 0.70 { Verified }
               else { Trusted };

Availability, observed-versus-claimed throughput, and latency. A peer is
`Unknown` until it has been sampled five times.

**The two disagree on what the words mean.** `Known` is `>= 0.10` on the
credential ladder and `n >= 5 && score < 0.40` on the behavioural one. Same
label, different predicate, different underlying quantity.

## 3. Which one selects peers

`shard_cmd.rs:1155-1162` [VERIFIED]:

    // Load reputation store and enrich chain entries with local trust scores.
    let store = ReputationStore::load();
    for entry in &mut enriched {
        let score = store.score(&peer_b58);
        entry.trust_score = Some(score.score);
    }

`ReputationStore` is the behavioural ladder. The credential ladder is never
consulted on this path.

Two consequences worth naming:

- The whole enrichment is behind `cfg.reputation.enabled` [VERIFIED]. With
  reputation disabled, `trust_score` stays `None` and the tie-break degenerates
  entirely.
- A peer holding no credentials at all, but with good uptime, scores well.

## 4. It is a sort key, not a gate

`shard_cmd.rs:2884-2900` [VERIFIED]. Candidates covering a block position are
filtered on exactly two things - block coverage, and whether the peer already
failed with a protocol error this session. Then:

    candidates.sort_by(|a, b| b.end_block.cmp(&a.end_block)          // widest coverage
        .then_with(|| b.trust_score.partial_cmp(&a.trust_score)...)  // then trust
        .then_with(|| ...self...));                                  // then prefer self

Trust is the **second** sort key, after coverage width.

The negative claim, stated as such: a grep across all thirteen crates for
`min_trust`, `minimum_trust`, `required_tier`, `min_tier` or `trust_threshold`
returns nothing outside the two scoring functions [VERIFIED]. **There is no
minimum-tier filter anywhere in the workspace.**

The README describes intent-based routing on criteria including "minimum trust
tier Verified" [REPORTED]. That describes the destination. The code sorts.

## 5. Read together with note 01

Note 01 establishes that the peer at position 1 of an inference chain receives
the prompt as token IDs, and that recovering it needs only a tokenizer. This
note establishes that position 1 is assigned by block coverage first and by an
uptime-derived number second.

Combined: **the peer best placed to serve a wide block range, with good uptime
and no credentials whatsoever, receives your prompt in clear.** Neither finding
is alarming alone. The composition is the thing worth knowing before building
on top.

## 6. A neighbouring observation about the storage layer

`kwaai-storage/src/lib.rs:3` [VERIFIED] describes a node as "holding
**encrypted** vectors". A search of that crate, plus `kwaai-cli/src/storage.rs`
and `kwaai-rag/`, for `encrypt|aes|cipher|phe|homomorph` returns that comment
and no implementation [VERIFIED].

The project says the same thing in its own roadmap: PHE integration "replacing
the current transport-only encryption" is the next engineering phase
[REPORTED]. So this is a comment that ran ahead of the roadmap, not a
contradiction - but a reader running `rag connect-eve` today may take it
literally and upload embeddings expecting encryption at rest.

This is the smallest and friendliest thing in the series, and the natural first
pull request.

## 7. Open

- **Is the split intended?** [OPEN] There are good reasons to order peers by
  observed performance. The question is whether the credential ladder is meant
  to *gate* and has not been wired yet, or whether ordering is the intended
  mechanism.
- **Should the two ladders share a vocabulary?** [OPEN] Two `TrustTier` scales
  with different thresholds will be read as one by anyone consuming logs.
- **What does EigenTrust change?** [OPEN] Aim 3 of the VPK research programme
  commits to designing and validating EigenTrust-based propagation. If that
  lands on the credential ladder, the question of which ladder selects peers
  becomes considerably more consequential.

## 8. Consequence for anyone building on top

A gate built by adding a filter to the existing `trust_score` field would gate
on **uptime**, not on credentials, while appearing to gate on trust. Any
disclosure control intended to respect a credential-based trust graph must bind
`kwaai_trust::TrustScore` explicitly and say which ladder it means.

That is the single design fact this note exists to fix in place.
