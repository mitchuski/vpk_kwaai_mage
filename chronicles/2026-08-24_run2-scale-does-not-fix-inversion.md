# Run 2: scale does not fix inversion

2026-08-24. The three open items from MEASUREMENTS section 6 were executed in one
sitting: the entailment guard was built, the corpus was regenerated at
`gemma3:27b`, and every telling of both runs was audited by a second model.

## What was built

`~/vpk/pathways/ladder.js` gained an entailment layer: `--verify=<model>`
checks each telling against its source before writing (contradiction = reject,
like growth), and `--entail=<model> [--fix]` audits what is already on disk,
recording a verdict into each record. The verifier is deliberately a different
model from the generator. Smoke test before trusting it: pointed at the known
run-1 F3 inversion, it caught it exactly — "credential trust graph touches peer
selection" is precisely the false claim.

## What was measured

Run-1 audit (35 tellings, `gemma3:12b`): 26 flagged. Two were real. One was the
known F3 inversion, caught at all three tiers. The other was **new**: the
storage page's D2 claimed vectors "protected in transit and at rest" against a
source saying transport-only — four days old, read by the author, never
noticed. The honest run-1 score became two of three load-bearing findings
inverted, not one.

Run 2 (`gemma3:27b --force`, 36/36 tellings, zero guard failures): the
partial-order effect nearly vanished (D3 > D2 on 1 of 12, was 6 of 12) and the
storage-page inversion was fixed. **The two-trust-ladders page inverted
again** — credentials as "the tie-break" (D1), "serving only as a secondary
sorting factor" (D2), against a source that says the credential graph never
touches selection at all. Softer wording than run 1, wrong in the same
direction. D3, stripped of domain nouns, got it right in both runs.

## What it means

- The inversion failure mode is structural, not a small-model artefact. A page
  whose content is two confusable mechanisms — one load-bearing, one not — is
  an inversion attractor at 4b and at 27b. That shape of fact (which of two
  similar things actually gates) is what security review exists to establish.
- The entailment guard is therefore part of the mechanism, not scaffolding.
- The guard's own precision is poor (61–74% flag rate, recall good), with three
  enumerable false-positive classes, including fabricated rationales: **the
  verifier has the compressor's failure mode.** Verification needs
  verification — majority vote or diverse lenses before anything gates a live
  grant path.
- OQ-1 hardened: if trustworthy tellings need a 27b-class generator plus
  adjudicated judging, a Pi-class box serves tellings; it does not mint them.

## Where things are

MEASUREMENTS.md section 7 (numbers), notes/03 v2 section 9 (the sceptic-facing
telling), `evidence/ladder-run1-gemma3-4b/` (archived run-1 records carrying
their verdicts), `evidence/entail-audit-run{1,2}-gemma3-12b.log`,
`evidence/ladder-run2-gemma3-27b.log`. The live ladder store holds run 2.

One deliberate non-step: `kwaai.localhost` was not rebuilt to tell run 2's
story, because changing page sources would mark the fresh run-2 tellings stale.
Site refresh + re-ladder is one move, taken together or not at all.

Doors unchanged: fork, issue, PR, WG contact, any push = Mitch.
