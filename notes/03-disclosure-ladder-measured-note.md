# The disclosure ladder, measured: it is a partial order, and it can assert the opposite of its source

Status: draft v2, 2026-08-24 (v1 2026-08-20). This note reports a **negative
result** from the first real run of a mechanism this lane proposes, measured on
the lane's own corpus — and, as of v2, the second run that tested whether model
scale removes the failure. It does not (section 9). Claim tiers: MEASURED
(produced by a run described here, with the reproduction command), VERIFIED
(read in cited source), OPEN. The run artefacts are `MEASUREMENTS.md` in this
lane and the ladder store written by `~/vpk/pathways/ladder.js`.

## 1. The observation

Two results, both against the design as previously stated:

1. **The ladder is not a chain.** D2 and D3 are siblings, not successive
   compressions. D3 is longer than D2 on half the corpus.
2. **A telling can invert its source.** On one of the two pages that mattered
   most, the D2 telling stated the opposite of the finding it was compressing -
   fluently, and with no signal that anything was wrong.

The second is the more important, and it identifies a failure mode that
encryption does not have.

## 2. The run

Corpus: twelve pages, the research lane of this series written as a federated
wiki so that the mechanism could be exercised on the argument that proposes it.
Model: `gemma3:4b`, the smallest thing consistent with the design's claim that
a small always-on machine can precompute tellings overnight. Tiers D1, D2, D3
(D0 is the page; D4 carries no page content).

    node ~/vpk_kwaai/build-site.js
    node ~/vpk/pathways/ladder.js --sites=kwaai --model=gemma3:4b

Twelve of twelve pages produced D1 and D2. Eleven produced D3.

## 3. Result one: the ladder is a partial order

| Tier | mean ratio | n | worst |
|---|---|---|---|
| D1 ACTIONS | 0.293 | 12 | 0.363 |
| D2 PRINCIPLES | 0.151 | 12 | 0.233 |
| D3 MATHS | **0.169** | 11 | 0.242 |

[MEASURED] Nothing grew - an earlier run on a different corpus had produced a
D1 telling **1.44x longer than its source**, and the guard added in response
held here.

But D3 is on average longer than D2, and **6 of 12 pages have D3 longer than
the tier above it** [MEASURED]. That is not sampling noise; it is half the
corpus.

Reading the tellings shows why. D2 abstracts:

> "The governing rule dictates a structure of abstraction, progressing from raw
> data to a governing rule, then to mathematical relationships, and finally to
> an address with a score."

D3 enumerates:

> "Five tiers exist. D0 crosses to nobody. D1 reduces entities to roles. D2
> defines a rule. D3 contains relations, types, and quantities. D4 is an
> address and a score."

These are **two different projections of one source**, neither contained in the
other. The prior model - a filtration where each rung is a subset of the one
above - is arithmetically coherent and empirically false.

**The correction fits the substrate better than the error did.** A tier is
naturally a bitmask over disclosure axes, and a bitmask lattice is already a
partial order; incomparable elements are the ordinary case. A total order was
the special case, assumed without checking.

**Design consequence.** A gate must map a counterparty's trust position to a
*specific* tier, not to "this rung and everything below it", because *below* is
not always defined. Any policy expressed as `tier <= D2` is ill-formed.

## 4. Result two: a telling inverted its source

The corpus was chosen so that the quality question would have a **knowable
right answer**: we know what conclusion a reader should reach from each page,
so a telling can be marked rather than argued about.

**Pass.** The page on the inference wire produced this D2 [MEASURED]:

> "The entire inference process relies on a single peer receiving the raw token
> IDs of the prompt. This peer alone possesses the embedding table and
> therefore sees the complete prompt."

Correct, in thirty words, and arguably sharper than the source.

**Failure.** The page on the two trust ladders produced this D2 [MEASURED]:

> "Chain selection prioritizes behaviour-derived trust, while credential-derived
> trust is used solely as a secondary sorting factor."

The truth (note 02, VERIFIED against source): behaviour-derived trust **is** the
secondary sort key, and credential-derived trust is not used in selection at
all. The telling has swapped which ladder occupies which role. A reader at D2
would conclude that credentials participate in peer selection - precisely what
the finding establishes to be false.

**One of two, on the two findings that mattered most.**

## 5. Why this is a failure mode encryption does not have

A ciphertext is either decryptable or it is not. Whatever else it does, it
cannot quietly assert the negation of what it protects.

A telling can. It is a *generated* artefact standing in for a source, and its
failure mode is not disclosure but **misrepresentation** - delivered fluently,
at the tier that a lower-trust counterparty receives, with no signal attached.

This has three consequences worth stating before anyone builds on the idea:

- **Compression ratio is not a quality metric.** Both the passing and the
  failing telling had unremarkable ratios (0.144 and 0.155). The guard that
  catches growth cannot catch inversion.
- **The verification target is entailment, not provenance.** A proof that a
  telling came from a given source, or hashes to a given address, says nothing
  about whether it is *true of* that source. If a zero-knowledge fold proof is
  to be worth building, it has to be about entailment.
- **The least-trusted party receives the least reliable statement.** Lower
  tiers are shorter, more abstract, and further from the text - so they are
  where fabrication is most likely and least checkable. That is an integrity
  gradient running opposite to the trust gradient.

## 6. What did work

`the-pi-is-bob` produced **no D3 at all** - every candidate was rejected by the
guard [MEASURED]. A D3 grant against that page therefore returns a refusal
rather than the underlying page.

This is the fail-closed property observed rather than designed, and it is the
most reassuring result in the run: the failure the whole mechanism exists to
prevent - serving D0 while claiming D2 - did not occur even when the ladder had
nothing to serve.

## 7. Open, and what to do next

- **Model size.** [CLOSED — section 9] A larger model removed one inversion and
  not the other. The constraint is not model capacity alone.
- **An entailment check in the guard.** [CLOSED — section 9] Built:
  `ladder.js --verify=<model>` at generation time, `--entail=<model>` as a disk
  audit. It caught the known inversion and found one nobody had noticed.
- **Re-mark the full corpus.** [CLOSED — section 9] All tellings of both runs
  audited by a second model; the three load-bearing pages hand-adjudicated.
- **Correct the lattice model** from a chain to a partial order. Done in this
  lane's star-chart note.

## 8. Why publish a negative result

Because it is the strongest available evidence that the mechanism was measured
rather than argued, and because the failure it identifies is one a reader would
otherwise have to discover in production, on a corpus that mattered.

A proposal that arrives with its own counter-example is worth more than one
that arrives with a design.

## 9. Run 2 (2026-08-24): scale does not fix inversion, and the guard earns its keep

The full corpus was regenerated at `gemma3:27b` (6.75x the parameters), every
telling of both runs was audited for entailment by a second model
(`gemma3:12b`), and the three load-bearing pages were hand-adjudicated against
their sources. Four results:

1. **The partial-order effect was mostly a small-model artefact** [MEASURED].
   At 27b, D3 is longer than D2 on 1 of 12 pages (was 6 of 12), tier ratios
   order correctly (D1 0.299 / D2 0.200 / D3 0.140), and the guard rejected
   nothing — 36 of 36 tellings written, including the page 4b could not ladder.
   The design correction stands (a bitmask lattice is a partial order and a
   gate must name a specific mask), but the empirical pressure came from
   capacity.

2. **Scale fixed one inversion and not the other** [MEASURED]. The storage
   page, whose run-1 D2 claimed vectors were "protected in transit and at
   rest" against a source saying transport-only, is now correct at every tier.
   The two-trust-ladders page **inverted again**: the source says "the
   credential trust graph never touches peer selection at all"; the 27b D1
   calls credential trust "the tie-break" and the D2 has it "serving only as a
   secondary sorting factor". Softer wording than run 1, wrong in the same
   direction. A page whose content is *two confusable mechanisms, one
   load-bearing and one not* appears to be an inversion attractor — and "which
   of two similar things actually gates" is exactly the shape of fact a
   security review exists to establish. The failure mode is structural. The
   entailment guard is part of the mechanism, not scaffolding.
   (Curiously, D3 — stripped of domain nouns — states F3 correctly in both
   runs' spot-checks: naming the two ladders seems to be what triggers the
   swap.)

3. **The audit found an inversion hand-review had missed** [MEASURED]. The
   run-1 storage-page inversion above was four days old and had been read by
   the author without being noticed. The honest run-1 score is therefore two
   of three load-bearing findings inverted, not one. Section 4's "one of two"
   undercounted — which is itself evidence for mechanical checking.

4. **The verifier has the compressor's failure mode** [MEASURED]. The cheap
   judge flagged 74% of run-1 and 61% of run-2 tellings; hand-adjudication
   shows recall is good (3/3 tiers of the known inversion; both real
   inversions found) but precision is poor, with three enumerable
   false-positive classes: paraphrase hair-splitting; penalizing D1's mandated
   role-substitution; and **fabricated or inverted rationales** — one flag
   cited a claim appearing nowhere in the telling, another attributed to a
   telling the exact opposite of what it says. A single narrow judge is
   necessary but not sufficient; before this gates a live grant path it needs
   majority-vote or diverse-lens judging, and confusable-pair pages need a
   judge told what the pair is.

Consequence for the small-box premise: if trustworthy tellings need a
27b-class generator *and* adjudicated judging, the Pi-class box cannot mint
its own ladder; it can only serve tellings minted elsewhere. [OPEN] whether a
tuned small judge closes that gap.

Reproduce:

    node ~/vpk/pathways/ladder.js --sites=kwaai --model=gemma3:27b --force
    node ~/vpk/pathways/ladder.js --entail=gemma3:12b --sites=kwaai

Artefacts: `MEASUREMENTS.md` section 7; `evidence/ladder-run1-gemma3-4b/`
(run-1 records with verdicts); `evidence/entail-audit-run{1,2}-gemma3-12b.log`.
