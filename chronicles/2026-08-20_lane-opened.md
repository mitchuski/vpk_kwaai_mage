# 2026-08-20 -- vpk_kwaai lane opened

**Verdict first.** VPK closes the storage side. KwaaiNet's inference side ships the prompt to
peer 1 as raw token IDs, and the trust score that ought to stop it is a sort key. The lane
exists to close that seam by semantic minimization -- compressed tellings, kappa-addressed,
trust-tier gated, bilaterally receipted -- and to route the pieces to the five bodies that own
them.

## What happened

Started as a hardware question -- can KwaaiNet run on a Pi 4 -- and the answer turned into a
role assignment. Yes for Bob (storage, RAG, relay, keys), no for inference: the released ARM64
gnu binary is built with `+fp16,+fullfp16` and emits ARMv8.2 half-precision instructions that a
Cortex-A72 cannot execute. The musl build is clean. Pi 5 is fine either way.

Then the second question, which was the real one: run local storage, compress with the fedwiki
and the harness, share with stronger inference nodes, and let the trust graph decide how much
goes out.

Reading the shipping code to answer it produced F1 -- `PayloadType::TokenIds`, "first node
only", because the embedding table lives on the first block server and the coordinator has no
embedder. So the peer at position 1 receives the whole prompt, including every private chunk
local RAG just retrieved. Then F3: chain selection sorts by trust and filters by nothing.

Then the whitepaper, which is better than expected and states its own condition honestly --
sMCP's guarantee holds "for deployments where Alice's AI model runs locally or in a trusted
enclave." On a heterogeneous mesh it does not hold. That sentence is the gap, written by them.

## What was decided

- The proposal is **not** homomorphic inference and must never be pitched as such. It is
  bounded, auditable disclosure: weaker than PHE, stronger than a promise, applicable where PHE
  cannot go.
- The ladder is precomputed at ingest (F9). If that assumption fails, the Pi story fails with
  it, so it is OQ-1 and it gets attacked first.
- Lead with findings as questions. The kappa lane already paid for that lesson -- ground notes
  in shipped code, and do not arrive with a PR pile.
- Bilateral mint is shipped on neither side. Kwaai's audit log is self-authored; kappa's
  `assert_double_entry` verifies nothing and has zero callers. "Neither of us built it" holds
  here too.

## What is not done

No live mesh. G0 is unrun, so F1 and F2 are read-from-source and a reviewer is entitled to say
so. No corpus, no measurements, no quality delta -- which means OQ-3 (does a two-rung-down
answer stay useful) is completely open and is the question that decides whether any of this has
users.

Nothing pushed. Nothing posted. Doors are Mitch's.

---

## Addendum, same day -- the star chart, and two self-corrections

**The integration needed no new geometry.** game42 `AXIOMS.md` A5 already fixes a cross-system
seam -- `{seal, kappa, axisBitmask, packets}`, "no integration may read a game's interior" --
which is the same discipline VPK applies to `SearchByIndex`, written months earlier for a
different reason. `src/citykey.js` already implements the projection. The six strands already
carry the six layers. Cores are already page-stars; only the release edge is new. Written up in
`STAR-CHART.md` with a thesis for the fleet: the ladder is bit-clearing, D4 = vertex 32, and
`neg`'s fixed points {0, 32} are exactly the two non-disclosing states. Arithmetic checks out
(filtration holds, fixed points are exactly two); the axis assignment per rung does not, yet,
and the D3-to-D4 step clears two bits where every other clears one.

**Correction 1 -- provenance.** `FINDINGS.md` said "verified against v0.5.4". The clone is
`main` at `50558c6`, workspace version **0.5.5**; only the *binaries* are v0.5.4. Two different
pins stated as one. Fixed, and the clone is now vendored at `~/KwaaiNet-main` so the pin cannot
drift silently.

**Correction 2 -- F3 was conflating two ladders.** There are two: credential-derived
(`kwaai-trust`, VC weights and time decay, the DTG story) and behaviour-derived
(`kwaai-cli/reputation.rs`, `0.5*availability + 0.3*throughput + 0.2*latency`). Chain selection
enriches from the **reputation** store. So the number ordering inference peers is a performance
metric wearing trust vocabulary, and the credential trust graph never touches peer selection at
all. This sharpens the finding rather than weakening it, and it changes the patch: the gate has
to bind the credential ladder deliberately, not filter on the field that is already there.

**S1 found while grounding the chart.** `labs.json`'s `bit` field is a torus seating index whose
numbering does not match A1's lattice bits -- roughly inverted, but not an exact reversal, so no
arithmetic recovers one from the other. Harmless today because nothing computes a vertex from
it; it is precisely the trap A1's "never `1 << axisIndex`" was written to prevent, waiting for
the next integrator. Rename to `seat`, do not renumber, bake the real vertex values alongside.

Evidence for every source claim now lives in `evidence/VERIFY.md`, re-runnable, with a
"not verified" section that names what is still only predicted: the wire (G0) and the SIGILL.
