# CONNECTIONS

Where existing agentprivacy work and the UOR/kappa lane already fit the VPK problem.

**Governing disclaimer.** This maps the *total addressable* convergence space and is wider by
design. It is a survey, not a commitment. Selection and honing come after G2, when the
measurements exist. Nothing here is a claim that Kwaai needs any of it.

---

## 1. understanding-compression -> the disclosure ladder

The skill already does the load-bearing work: one invariant semantic core, many re-expressions,
each *proven* to compress back to the same core. Compressions (maths / principles / actions) map
onto D3 / D2 / D1 directly; expansions (markets / plurality / intents) are the audience axis we
do not need here.

What is new in this lane: the tier semantics (which telling for which counterparty) and the wire
(substitution before tokenization). The compression itself is shipped and used.

## 2. Census folds -> the credibility exhibit

The fleet has already run invariant-preserving compression over real specifications: DTG spec
980->863, soulbae 1248->1072, soulbis 1397->1154, adjudicated **12 VALIDATED / 0 MIRAGE**.

That is the answer to the first question any reviewer will ask -- "does your compression
preserve meaning, or do you just believe it does?" We have a method, a verdict vocabulary, and a
run where nothing survived unchallenged that should not have.

## 3. Gatehouse -> the ceremony rung

Two-token rite (emoji sigil + canon proverb) -> PBKDF2 -> AES-GCM, decrypted client-side, over
documents hidden inside a public static site. Understanding as key: the door opens on
demonstrated shared canon.

This is a **third position** in the whitepaper's contracts-vs-mathematics debate, and it is the
only rung that can responsibly admit a peer to D0. It is also already deployed, which matters
more than that it is clever.

## 4. DTG ZKP Task Force -> the fold proof

Aim 3 names the LF Decentralized Trust Graph WG and EigenTrust propagation. Mitch co-chairs the
DTG **ZKP** Task Force, which points at the sharpest technical piece in the ladder:

**Prove that a telling folds back to `kappa(core)` without revealing the telling.**

A zero-knowledge fold proof turns "trust my compression" into "verify my compression". It makes
the disclosure ledger checkable by an auditor who is entitled to see neither the core nor the
telling -- exactly the oversight-without-visibility property Aim 3 is chasing. The zk-kit
tooling evaluation already done in the TF lane applies here.

Route: types and proofs via DTGWG. Not via the KwaaiNet repo.

## 5. MyTerms / IEEE P7012 -> making the two camps compose

The whitepaper names P7012 as the legal camp and treats the debate as unresolved. Our MyTerms
federation site is the artefact that dissolves the framing: **Bob publishes his disclosure
ladder as a machine-readable terms record; Alice's agent reads it before querying.**

The contract states the tier policy. The gate enforces it. The receipt evidences it. Nobody has
to win the argument.

## 6. UOR kappa-registry -> the naming and receipt substrate

Verified in the survey (upstream at `2af8656`):

| kappa primitive | Use here |
|---|---|
| `kappa_from_value(dCBOR{...})` content address | `kappa(core)` = the invariant identity; `kappa(telling_i)` = each telling. Identity of meaning, independent of wording. |
| `IdentityAssertion` (asserter/subject/facet/value + validity) | The `DisclosureReceipt` shape. `facet` = gate id, `value` = `kappa(telling)`. |
| basis ladder (self-asserted / peer-verified / threshold-attested, FROST) | The rungs that admit a tier. Ceremony sits above. |
| `DelegationScope`, enforced decreasing depth | Onward-disclosure limit. The part of purpose limitation that mathematics does reach. |
| `assert_double_entry` | **Refuted by run 02**: verifies neither input signature, no reciprocity, `ns_a` epoch only, zero callers. The bilateral mint is shipped on neither side -- shared surface, not a borrow. |
| F14 blob-layer address coincidence | The bridge is partly free. |

## 7. Dual-agent harness -> the rule already written

The VRC edge rule -- **only the counterparty's signature mints the edge** -- is precisely the
receipt rule in section 4 of `PATHWAY.md`. Ours is spec-only; kappa has the recording shape
without the gate; KwaaiNet has neither. Three parties one implementation short of the same
thing.

## 8. Embassy posture -> the Bob box, already designed

The HH Embassy Network already encodes the topology: **embassies (Pis) host, personal machines
visit; Pi write = 403 by design; fork = countersign.** That is Bob's trusted zone, the
asymmetry of custody, and the bilateral receipt -- in social form, running, on the same hardware
class this plan calls for. Tailnet hardening (default-deny, explicit holes) is the network
posture for the box.

## 9. fedwiki federation -> the corpus and its provenance

Fifteen hubs of forkable, provenance-carrying pages. Cores and tellings are pages; the kappa
address is page metadata; a fork *is* the disclosure event. The federation is already a
multi-Bob network -- which makes it the natural G2 corpus, and a live testbed rather than a
synthetic one.

Ruling that constrains this: the guide federation carries **work, not research**. Research
follows the Programme path. The G2 corpus must respect that split.

## 10. wiki-to-pdf and the Programme -> the core/telling shape, shipped

The "In-brief" layer of the timeline briefs and the combined dossier is already core-and-telling
in production: many documents, one unified summary layer, built to compress back. The 13 LaTeX
academic PDFs are the register the VPK WG expects a submission to be written in.

## 11. Refuter fleets -> how the ladder gets validated

Run 02's discipline (10 refuters plus judge, verdicts SURVIVES / NARROWED / COVERED, theses
defeated and folded rather than defended) is the method for G1. The ladder must face refuters
before it faces Kwaai. "Tier D_k does not leak D_{k-1}" is a thesis, and it should be attacked
by us first.

## 12. Trust tasks -> the gate ceremonies

The trust-tasks lane already has agent-admission specs (six, KY-A) and understanding specs
(four) green. The tier gate is an admission ceremony by another name, and KY-A/Gatehouse is a
worked admission flow with an audited assertion count behind it. The gate does not need
inventing; it needs porting.

## 13. Star chart and the lattice canon -> the read side

The whole rendering question has its own document: `STAR-CHART.md`. Short version -- game42
`AXIOMS.md` **A5** already fixes a cross-system seam (`{seal, kappa, axisBitmask, packets}`,
"no integration may read a game's interior"), `src/citykey.js` already implements the
projection, and the six strands already carry the six layers of the design. Nothing new is
needed on the instrument side; the Bob box emits `releases.json` and the existing chart draws
it. Two one-line canon fixes (S1, S2) go in first.
