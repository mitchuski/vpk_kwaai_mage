# MEASUREMENTS

The self-referential test: the lane's own argument, laddered by the mechanism the lane
proposes. 12 pages of `kwaai.localhost`.

- **Run 1** — `gemma3:4b`, 2026-08-20. Headline: the ladder is not a chain, and D2 got a
  load-bearing finding backwards.
- **Run 2** — `gemma3:27b` + entailment audit by `gemma3:12b`, 2026-08-24 (section 7).
  Headline: scale fixed one inversion and NOT the other; the F3 page is an inversion
  attractor that survives a 6.75x model-size jump. And the entailment audit found a SECOND
  run-1 inversion (F4) that hand-review had missed.

Run-1 records (with entailment verdicts added retroactively) are archived at
`evidence/ladder-run1-gemma3-4b/`; the live store holds run 2.

---

## Run 1 — gemma3:4b, 2026-08-20

---

## 1. Ratios

| Tier | mean ratio | n | worst |
|---|---|---|---|
| D1 ACTIONS | 0.293 | 12 | 0.363 |
| D2 PRINCIPLES | 0.151 | 12 | 0.233 |
| D3 MATHS | **0.169** | 11 | 0.242 |

Nothing grew. The earlier 1.44x failure did not recur, so the guard plus the model change
holds on this corpus.

But **D3 is on average longer than D2**, and 6 of 12 pages have D3 longer than the tier above
it. That is not noise; it is half the corpus.

## 2. The ladder is a partial order, not a chain

`STAR-CHART.md` section 3 modelled the ladder as bit-clearing: D0 supset D1 supset D2 supset D3,
each rung a subset of the one above. The arithmetic held. **The content does not.**

Read what D2 and D3 actually are:

- **D2** abstracts. "The governing rule dictates a structure of abstraction, progressing from raw
  data to a governing rule, then to mathematical relationships, and finally to an address."
- **D3** enumerates. "Five tiers exist. D0 crosses to nobody. D1 reduces entities to roles. D2
  defines a rule. D3 contains relations, types, and quantities. D4 is an address and a score."

These are **siblings, not parent and child** -- two different projections of the same source,
neither contained in the other. Forcing a total order onto them was my error.

The correction strengthens the star-chart binding rather than weakening it. A bitmask lattice is
*already* a partial order; incomparable masks are the normal case, and a chain was the special
case I assumed without checking. **The gate must therefore map a peer's trust tier to a specific
mask, not to "this rung and everything below it"** -- because "below" is not always defined.

That is a design change, and it came from a measurement rather than an argument.

## 3. The conclusion test: one pass, one failure

The question with a knowable right answer -- does a reader at D2 reach the same conclusion as a
reader at D0?

**PASS -- The Inference Seam.** D2 reads: *"The entire inference process relies on a single peer
receiving the raw token IDs of the prompt. This peer alone possesses the embedding table and
therefore sees the complete prompt."* That is F1, correctly, in thirty words. Arguably sharper
than the source.

**FAIL -- Two Trust Ladders.** D2 reads: *"Chain selection prioritizes behaviour-derived trust,
while credential-derived trust is used solely as a secondary sorting factor."*

The truth is the other way round. Behaviour-derived trust **is** the secondary sort key;
credential-derived trust is not used in selection **at all**. The telling has swapped which
ladder is the secondary factor, and in doing so it destroys the finding -- a reader at D2 would
conclude that credentials participate in peer selection, which is exactly what F3 establishes is
false.

**One of two sampled, on the two findings that matter most.** That is the honest state of OQ-3
and it is not a good number.

## 4. The guard fires in the wild

`the-pi-is-bob` has **no D3**. The guard rejected every candidate, so a D3 grant against that
page returns a refusal rather than a page.

Fail-closed observed rather than designed. This is the single most reassuring result in the run:
the failure mode the whole mechanism exists to prevent -- serving D0 while claiming D2 -- did not
happen even when the ladder had nothing to serve.

## 5. What this means for the upstream conversation

Report these numbers, including section 3. A proposal that arrives with its own negative result
is worth more than one that arrives with a design.

The specific thing to say: **semantic minimization has an integrity failure mode that encryption
does not.** A ciphertext is either decryptable or not; it cannot quietly assert the opposite of
what it protects. A telling can, and on this corpus it did, once in two attempts on the findings
that mattered. Any tier that carries a claim needs verification of the claim, not only of the
compression ratio -- which is an argument for the zero-knowledge fold proof being about
*entailment*, not merely about provenance.

## 6. What to do next

- **Re-run at a larger model.** `gemma3:4b` is the smallest thing that fits the "overnight on a
  small machine" story. If `gemma3:27b` fixes the inversion, the constraint is model size and
  OQ-1 gets harder, because the small box cannot host it. **Done — section 7.**
- **Add an entailment check to the guard.** A telling that contradicts its source should be
  discarded like one that grows. Cheap version: ask a second model whether the telling and the
  source can both be true. **Done — `ladder.js --verify=<model>` at generation time,
  `--entail=<model> [--fix]` as a disk audit.**
- **Re-mark the conclusion test** after both, with all 12 pages rather than 2 sampled.
  **Done — section 7.3.**
- **Correct `STAR-CHART.md` section 3** from a chain to a partial order. Done.

---

## Run 2 — gemma3:27b + gemma3:12b entailment audit, 2026-08-24

Three instruments this time: regeneration of all 36 tellings at 27b (`--force`), a
second-model entailment audit of BOTH runs (`--entail=gemma3:12b`), and hand-adjudication of
the three load-bearing pages against their sources. The verifier is deliberately a different
model from the generator; a model marking its own work rediscovers its own blind spot.

### 7.1 Ratios and ordering

| Tier | run 1 (4b) | run 2 (27b) | n | worst (27b) |
|---|---|---|---|---|
| D1 ACTIONS | 0.293 | 0.299 | 12 | 0.404 |
| D2 PRINCIPLES | 0.151 | 0.200 | 12 | 0.323 |
| D3 MATHS | 0.169 | **0.140** | 12 | 0.212 |

- **D3 longer than D2 on 1 of 12 pages** (run 1: 6 of 12). The partial-order effect is
  largely model-capability-dependent: the bigger model can actually do "structure only" in
  fewer words than "the rule". The design correction stands — a bitmask lattice is still a
  partial order and the gate still maps tier -> specific mask — but the empirical pressure
  came mostly from the small model.
- **Zero guard failures.** 36/36 tellings written (run 1: 35, with `the-pi-is-bob` D3
  refused every candidate). The refusal-in-the-wild result from run 1 was a 4b artifact.

### 7.2 The entailment audit, both runs

| | run 1 (4b) | run 2 (27b) |
|---|---|---|
| tellings checked | 35 | 36 |
| flagged CONTRADICTS by 12b | 26 (74%) | 22 (61%) |

The raw flag rate is far above the true inversion rate — the verifier is high-recall,
low-precision. What the flags contained, after hand-adjudication of the ones that matter:

- **TRUE: the known F3 inversion (run 1), caught at all three tiers.** The check works on
  the case it was built for.
- **TRUE and NEW: run 1 D2 of `what-the-store-holds` inverted F4** — "vectors...protected in
  transit and at rest" against a source stating transport-only encryption. Hand review had
  missed this; the audit found it. So the honest run-1 score is **two of the lane's three
  load-bearing findings inverted by D2**, not one.
- **FALSE-POSITIVE CLASSES, now enumerable:** (a) paraphrase hair-splitting ("a fork *is* a
  countersignature" vs "*already* a working countersignature"); (b) penalizing D1's MANDATED
  role-substitution (flagged "gate" because the source says "first node" — but reducing names
  to roles is D1's prompt); (c) **fabricated or inverted rationales** — run 1
  `semantic-minimization` flagged for "homomorphic inference is deployable", a claim appearing
  nowhere in the telling; run 2 `what-the-store-holds` D2 flagged as claiming "encrypted at
  rest" when the telling says the opposite. **The verifier has the same integrity failure
  mode as the compressor.** One narrow judge is necessary but not sufficient; the verdict
  layer needs the same scepticism as the telling layer.

### 7.3 The conclusion test at 27b, all three load-bearing pages

- **F1 `the-inference-seam` — PASS at every tier.** D2: "A chain's privacy extends to a
  single peer; that peer receives the complete, initial prompt as raw token IDs." Correct,
  and it kept the enclave condition.
- **F4 `what-the-store-holds` — FIXED by scale.** D2 now reads "encrypted only during
  transmission, not while at rest... a future phase will implement encryption for stored
  vectors." Exactly the source's claim.
- **F3 `two-trust-ladders` — INVERTED AGAIN.** Source: "the credential trust graph never
  touches peer selection at all." 27b D1: credential-derived trust is "the tie-break".
  27b D2: credentials "serv[e] only as a secondary sorting factor". Softer wording than run
  1, wrong in the same direction. **D3 — structure only, no domain nouns — is the one tier
  that gets it right**: "Chain selection uses the second... The second is a tie-break after
  two filters. No minimum exists."

### 7.4 What run 2 establishes

1. **Scale is not a fix for inversion.** It repaired the simple-fact inversion (F4) and left
   the confusable-pair inversion (F3) standing. A page whose content is *two similar
   mechanisms, one load-bearing and one not* is an inversion attractor — and "which of two
   similar things actually gates" is precisely the shape of fact a security review exists to
   establish. The failure mode is structural, not a small-model artifact, so **the entailment
   guard is a permanent part of the mechanism, not scaffolding**.
2. **The audit pays for itself.** It found a real inversion (F4, run 1) that human review of
   the same corpus had missed four days earlier.
3. **Verification needs verification.** The cheap judge catches real inversions (recall
   good) but flags 61-74% of tellings and sometimes fabricates its rationale. Before any of
   this gates a live grant path: majority-vote or diverse-lens judging, and the F3-class
   pages need a judge prompted with the specific confusable pair.
4. **OQ-1 hardens.** If tellings need a 27b-class generator plus a judge to be trustworthy,
   the Pi-class box cannot mint its own ladder; it can only SERVE tellings minted elsewhere.
   The kit story (PATHWAY section 10.6) inherits this constraint.

## Reproduce

    node ~/vpk_kwaai/build-site.js
    node ~/vpk/pathways/ladder.js --sites=kwaai --model=gemma3:27b --force
    node ~/vpk/pathways/ladder.js --entail=gemma3:12b --sites=kwaai
    node ~/vpk/pathways/ladder.js --show=kwaai/two-trust-ladders

Run-1 archive: `evidence/ladder-run1-gemma3-4b/` (records carry their 12b verdicts).
Audit transcripts: `evidence/entail-audit-run{1,2}-gemma3-12b.log`,
generation log `evidence/ladder-run2-gemma3-27b.log`.
