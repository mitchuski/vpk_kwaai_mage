# PATHWAY

The plan. Read `FINDINGS.md` first -- every design decision below points at a finding.

Boot order for an agent picking this up: `README.md` -> `FINDINGS.md` -> here ->
`STAR-CHART.md` -> `CONNECTIONS.md`. Evidence for every source claim, with the commands that
produced it, is in `evidence/VERIFY.md`.

---

## 1. The shape

Five layers on one box plus the mesh. The Pi is **Bob**.

    L0  BOB BOX (Pi 4, musl build)     keys, embedder, mapping table, plaintext store, ledger
    L1  COMPRESSION (ingest-time)      fedwiki corpus -> invariant core + N tellings
    L2  ADDRESS (kappa)                kappa(core) is the invariant; kappa(telling_i) each telling
    L3  GATE (trust graph)             peer tier -> highest-fidelity telling that peer may receive
    L4  RECEIPT (bilateral)            both sides sign what was released, or no epoch advance
    ---------------------------------- trust boundary ---------------------------------------
    L5  MESH                           stronger nodes do the inference on the released telling

What crosses the boundary is never a document. It is a telling, chosen by tier, addressed by
kappa, receipted by both parties.

## 2. The disclosure ladder

Built with the `understanding-compression` skill: one invariant core, many tellings, each
provably compressing back to the same core. The skill already proves the fold; this lane adds
the tier semantics and the wire.

| Tier | Telling | Content | Crosses to |
|---|---|---|---|
| **D0** | RAW | the chunk as ingested | nobody. Bob only. |
| **D1** | ACTIONS | what to do, entities reduced to roles | Trusted (>=0.70) |
| **D2** | PRINCIPLES | the governing rule, no procedural specifics | Verified (>=0.40) |
| **D3** | MATHS | structure only -- relations, types, quantities, no domain nouns | Known (>=0.10) |
| **D4** | ADDRESS | `kappa(core)` + score. No content at all. | Unknown |

Tier names above mean the **credential** ladder (`kwaai-trust::TrustScore`), not the
reputation ladder that currently orders peers -- see F3, they are different numbers with the
same labels.

D4 is the inference-side analogue of VPK's `SearchByIndex`: **no content crosses the wire, only
an address and a rank.** A peer holding D4 cannot generate an answer -- which is the correct
outcome. An `Unknown` peer is not entitled to serve your private query, and the gate says so by
having nothing to give it.

The ladder degrades gracefully instead of failing binary. That is the whole product.

## 3. The gate

Two patches to KwaaiNet, both small, both pointed at F3:

1. **Filter, not sort -- and bind the right ladder.** Chain selection tie-breaks on a
   *reputation* score (availability/throughput/latency), not on the credential trust graph --
   see F3, this is the correction that matters most for the patch. Add a hard minimum-tier
   filter over the **credential** ladder (`kwaai-trust::TrustScore`), keep reputation as the
   tie-break it already is, and refuse to build a chain when no peer set satisfies the floor.
   Failing closed is the feature.
2. **Substitute before tokenize.** In `shard_api.rs`, between prompt assembly (`:190
   build_prompt`) and tokenization (`:218`), swap each retrieved chunk for the telling at the
   tier that the *weakest peer in the pinned path* is entitled to. Position 1 sees token IDs
   (F1), so position 1 sets the tier for the whole chain.

Optional top rung: **ceremony**. The Gatehouse two-token rite (sigil + canon proverb) admits a
peer to D0 within a known set. Understanding as key -- the door opens on demonstrated shared
canon, not on a credential alone. This is the third position in Kwaai's contracts-vs-mathematics
debate, and it is already built and running in our federation.

## 4. The receipt

`DisclosureReceipt` -- the fix to F7, and the same defect the UOR run-02 refuters found upstream.

Fields, in the kappa `IdentityAssertion` shape (asserter / subject / facet / value / basis /
validity window):

- `facet` = the disclosure gate id
- `value` = `kappa(telling)` -- what was actually released, addressed not disclosed
- `basis` = the rung that admitted it (self-asserted / peer-verified / threshold-attested /
  ceremony)
- plus `kappa(core)`, tier `D`, peer anchor, purpose, validity window, delegation depth

Rules, written as the corrections run 02 demanded:

- **Both signatures verified in-function.** Not recorded -- verified.
- **Reciprocity enforced.** A release without the receiver's countersignature does not exist.
- **One epoch advance, both namespaces.** Not `ns_a` only.
- **Delegation depth strictly decreasing** on re-disclosure -- the onward-use limit that the
  whitepaper says mathematics cannot reach. It reaches part of it.

An auditor can then verify *exactly what was released to whom, when, at what fidelity, under
whose signature* -- without seeing a single document. That is Aim 3's requirement, stated as a
data structure.

## 5. Gates

Each gate has a deliverable and a door. Doors are deliberately manual acts. Prices are
session-scale estimates. **The deliverable filenames below do not exist yet** -- they are what
each gate is expected to produce, not files you are missing.

| Gate | Work | Deliverable | Price | Door |
|---|---|---|---|---|
| **G0** | Observe the wire. Two-node mesh (Pi + workstation), capture the payload peer 1 receives, detokenize it, confirm F1/F2 end-to-end. | `OBSERVATION.md` | 1 | none -- local |
| **G1** | Ladder spec: D0-D4 definitions, fold-proof format, tier mapping, question-side handling. Then a refuter fleet over it. | `DISCLOSURE-LADDER.md` + run report | 1-2 | none -- local |
| **G2** | Build one real corpus: a fedwiki area -> cores + tellings + kappa addresses. Measure token cost per tier and answer-quality delta. | corpus + `MEASUREMENTS.md` | 2 | none -- local |
| **G3** | Fork KwaaiNet, land the two patches of section 3, run them on the live mesh. | branch + diff | 2 | fork |
| **G4** | `DisclosureReceipt` spec + reference implementation against the kappa assertion shape. | spec + impl | 2 | none -- local |
| **G5** | Oversight-validity note: can an auditor detect misaligned retrieval from receipts alone? Design the experiment. Do not claim the result. | note for the VPK WG | 1-2 | none -- local |
| **G6** | Route it out. | issues, PRs, WG applications | -- | all Mitch |

Two one-line fixes come **before G1**, because section 3 of `STAR-CHART.md` reads their values:
S1 (rename the star chart's `bit` field to `seat`) and S2 (bake `latticeAxisVertex` into
`labs.json`). See `STAR-CHART.md` section 6.

G0 before anything else. Until the wire is observed, F1 and F2 are read-from-source and a
reviewer is entitled to doubt them.

**G1 and G2 have a testbed.** The pathway-grants build (plan unpublished)
runs this ladder against a real corpus on the tailnet, where the peer is authenticated before the
first byte and a fork already serves as the countersignature G4 needs. Measure OQ-3 there rather
than speculating -- then carry the numbers, and the caveat that the tailnet is the easy case,
into the Kwaai conversation.

## 6. Where each piece goes at G6

| Destination | What | Why there |
|---|---|---|
| `Kwaai-AI-Lab/KwaaiNet` issue | F1 + F3 + F4 as **questions**, not accusations. The `kwaai-storage` doc comment fix as the courtesy first PR. | Ground the relationship in shipped code. Same lesson as kappa PR #7. |
| VPK WG / Kwaai | The ladder as a **fourth compliance axis** alongside their three PHE tiers: they tier the *encryption*, we tier the *disclosure*. Their compliance criteria list is the template. | Aim 1 is explicitly a criteria-definition exercise. |
| sMCP WG (ToIP) | The residual: sMCP's guarantee is conditioned on "Alice's model runs locally or in a trusted enclave". On a mesh it does not. The ladder is what you do when the condition fails. | Charter is fresh; this is a named gap in their own text. |
| LF DTGWG | `DisclosureReceipt` as a credential type; the tier ladder as the consumer of EigenTrust output that Aim 3 is building. | Mitch co-chairs the ZKP TF. Types route via DTGWG, not via KwaaiNet. |
| `UOR-Foundation/kappa-registry` | Bilateral mint with verification -- a menu row, since run 02 established it is shipped on **neither** side. | "Neither of us built it" is already the ISSUE_DRAFT frame. |
| IEEE P7012 / MyTerms | The tier mapping as a machine-readable terms record: Bob publishes his ladder, Alice's agent reads it. | The whitepaper names P7012 as the opposing camp. This makes the two camps compose instead of argue. |

## 7. Why Kwaai should want this

Mapped onto their own three research aims:

- **Aim 1 (compliance spec).** They are defining criteria for what may sit in a tier. We supply a
  second axis with the same shape. Costs them nothing structurally -- `EncryptionLayer` is
  already a pluggable trait; a `DisclosureLayer` sits beside it.
- **Aim 2 (scale).** Untouched. The ladder is orthogonal to HNSW behaviour at 10M vectors.
- **Aim 3 (oversight validity).** This is the real fit. Their open question is whether audit
  trails alone carry enough signal to detect misalignment. A self-authored log (F7) is weak
  evidence. A bilaterally-signed, kappa-addressed disclosure ledger is strong evidence, and it
  is content-free by construction. We hand them a better substrate for the experiment they have
  already committed to running.

## 8. What this is not

Say all of it, first, in any approach:

- **Not homomorphic inference.** Nobody has that. The ladder reduces what is exposed; it does
  not encrypt what is exposed.
- **Not a cryptographic guarantee.** A D2 telling leaks whatever a D2 telling says. The claim is
  bounded and auditable disclosure, not secrecy. Weaker than PHE, stronger than a promise, and
  it applies where PHE cannot.
- **Not a replacement for VPK.** It is the missing half. VPK covers storage; this covers
  inference. Both are needed on the same node.
- **Not a fork-first move.** Lead with the findings as questions.

## 9. Open questions

- **OQ-1** -- F9. Can tellings be precomputed at ingest, or does the ladder need the live query?
  If the latter, Bob needs a strong model and the Pi story collapses. **Attack this first.**
- **OQ-2** -- The question side. The user's live query is not precomputable and leaks by itself.
  A generalizer must run on the Bob box (small local model, or templates, or explicit operator
  choice). This is the hardest unsolved piece.
- **OQ-3** -- Quality. Does a D2 answer stay useful? If quality collapses two rungs down, the
  ladder is elegant and unused. G2 measures this before anything is claimed.
- **OQ-4** -- Correlation. N tiered tellings released over time may reconstruct D0. VPK gives
  shard-level frequency analysis this treatment; disclosure needs the same. Likely needs a
  per-core release budget.
- **OQ-5** -- Who signs for an agent? sMCP credentials the AI agent, not the human. The receipt
  needs an answer for what an agent's countersignature means and who is accountable for it.

---

## 10. Publication, the wiki space, and eating our own cooking

### 10.1 Correction: the runtime is no longer a plan

Written 2026-08-20, after the fact. `~/vpk/pathways/` **ships**, and the tailnet proxy enforces
it: D1-D3 tellings precomputed overnight by the small machine, served in place of the page, and
a **404 when the ladder has not reached a page at the requested tier** -- never a fallback to the
page, because a fallback would misreport the tier and leak D0 under a D2 grant. Grants are scoped
to a pathway, expire, resolve the peer through `tailscale status` at approve time, and append to
an audit log. Per-grant **hostnames** rather than ports, so a hardened tailnet does not run out
of open holes at the fourth grant. Anywhere earlier documents in this lane say "nothing is
built", they mean the KwaaiNet side.

The first measurement is already in and it went **against us**: a D1 telling came out **1.44x
longer than its source**. A compression that grows is not a compression, and the ladder now
carries a guard that rejects them. This is exactly why OQ-3 was written as the question that
decides whether any of this has users -- and why measuring before proposing was the right order.
Report that number upstream when the time comes. It is more persuasive than the design.

### 10.2 Publishing: two artefacts, two different bars

| Artefact | Contents | Bar it must clear |
|---|---|---|
| `~/vpk` | the runtime: code, its own docs, sealed example runtimes. State lives at `~/.wiki/.vpk` and never travels. | It has to work and be readable. It stands alone -- useful to anyone with a private wiki, whether or not they care about Kwaai. |
| `~/vpk_kwaai` | this research lane | Higher. It names another organisation's code and quotes their whitepaper. Every claim needs its command, every unobserved claim needs its label. |

**Recommendation: two repositories, not one.** The runtime should not need the Kwaai argument to
justify itself, and the research lane should not drag a codebase through a review that is really
about a few paragraphs of prose. They cross-reference; they do not merge. `~/vpk/README.md`
already frames them as two lanes of one idea, which is the right relationship.

Excluded from publication in either case: `LOCAL-POINTERS.md`, the whitepaper extract, and
everything under `~/.wiki/.vpk` -- keys, live grants, the audit log.

### 10.3 The research as a federated wiki space

`vpk.localhost` already exists: eleven pages in which the pathway lane explains itself. The
research lane has no such space. Mint one -- **`kwaai.localhost`** -- built the same way
`build-site.js` builds the other, seated on the **protection** strand of the star chart.

Why a wiki and not only a repository:

- **A fork is an act with provenance.** In this federation, forking a page is the nearest thing
  we have to a countersignature -- which is precisely the primitive the `DisclosureReceipt`
  needs and which is shipped on neither side of the KwaaiNet/kappa comparison.
- **It becomes grantable.** A repository is all-or-nothing. A wiki space in this farm can be
  released at a tier, to a named peer, with an expiry and an audit trail. The research about
  tiered disclosure becomes something we can tier.
- **It joins the chart.** Pages are stars; the corpus draws itself; the release edges of
  `STAR-CHART.md` section 4 have somewhere to land.

### 10.4 Eating our own cooking: this lane as its own first corpus

The test that costs nothing and proves the most: **release this research through the mechanism
this research proposes.**

- D0 -- the full lane. Nobody but the keeper.
- D1 -- to a named collaborator who has earned it, by ceremony.
- D2 -- to a working group. Principles without procedure.
- D4 -- the public shape: the walk, the addresses, no bodies.

The measurable question has a **knowable right answer**, which is rare: does a reader at D2 reach
the same conclusion about F1 and F3 as a reader at D0? We know what the conclusion should be, so
for once OQ-3 can be marked rather than argued. If the ladder cannot carry its own argument two
rungs down, it has no business carrying anyone's clinical corpus, and we will have found that out
on ourselves rather than on a hospital.

### 10.5 The corpus that earns it: working group documents

The strongest real use case, and the one nearest to hand.

Working groups run on documents with a genuine confidentiality gradient -- drafts, member-only
material, and published output -- and their membership boundaries are already trust tiers that
exist as social facts before any software touches them. The recurring pain is exactly the one
this lane addresses: **synthesising across several groups without leaking any of them.** Someone
sitting in a standards body, a foundation working group and a task force cannot today ask a
question across all three corpora without either flattening the boundaries or doing it by hand.

A tiered knowledge node answers that. The synthesis happens inside the trusted zone; what leaves
is a telling at the tier the recipient's membership entitles them to; and the receipt records
what crossed, which is the thing a chair actually needs when someone asks whether a draft leaked.

**The rule that comes with it, and it is not negotiable:** ingesting a group's documents into a
knowledge base and re-sharing tellings of them is a *permissions* question before it is a
technical one. Ask the chair before ingesting anything that is not already public. The mechanism
being able to enforce a boundary is not the same as being entitled to it. Write the consent
down; it belongs in the grant.

### 10.6 The kit -- hardware and software together

A local private knowledge node someone can be handed: a small machine, the musl build, the wiki
farm, the tailnet, the ladder, and the Gatehouse rite for the top rung. A Bob box in a tin.

Genuinely attractive: the whole argument of this lane is that the trusted zone should be small,
cheap and yours, and that is a thing you can put in someone's hands rather than a thing you ask
them to configure.

Four constraints to settle before anyone is handed one:

1. **Key custody.** The keeper's key is generated **on the device**, never shipped with it. A kit
   that arrives with a key is a kit whose maker is inside the trust boundary.
2. **The compression needs a model the kit cannot run.** This is OQ-1 wearing a hardware costume.
   Either the kit is a *node* and tellings are computed elsewhere and delivered, or it ships with
   a companion step on a real machine, or the ladder becomes a service. **Unresolved -- and it is
   the decision that shapes the product.**
3. **A kit is a maintenance promise.** Firmware, the musl pin, the glibc floor, a moving upstream.
   Do not hand out hardware you are not prepared to keep alive.
4. **Whoever distributes the kit becomes an authority in the network.** That is a governance fact,
   not a logistics one, and it should be stated openly rather than discovered later.

### 10.7 `kwaai_mage` -- the future harness instance

Following the house convention, a `~/kwaai_mage` harness instance with three jobs:

- **Setup** -- install the right build for the board (musl on a Pi 4, and say why), identity,
  calibration, joining, and the RAG pipeline, with the gotchas of F8 encoded so nobody
  rediscovers them.
- **Visualisation** -- the star chart pointed at the node's own state: blocks served, peers in the
  pinned path and their tier, grants outstanding, receipts minted. The instruments already read
  the City Key shape; `STAR-CHART.md` is the contract.
- **The local knowledge node** -- the wiki farm, the ladder, the grants, and the disclosure ledger
  running as one thing.

**Gate it.** Do not build a mage for a system whose wire we have not watched. G0 first, the kit
decision second, `kwaai_mage` third. A setup harness that encodes a wrong assumption is worse
than no harness, because it propagates.

### 10.8 Order, priced

| # | Move | Price | Depends on |
|---|---|---|---|
| 1 | Mint `kwaai.localhost` from this lane | 1 | nothing |
| 2 | Ladder this lane's own pages; measure D2 against the known-right conclusion | 1 | 1, and the D1-longer-than-source guard |
| 3 | Grant a real peer a real slice; keep the receipt | 1 | 2 |
| 4 | G0 -- observe the KwaaiNet wire | 1 | nothing; independent of all the above |
| 5 | Publish `~/vpk`, then `~/vpk_kwaai` | 1 | a licence ruling |
| 6 | WG corpus, with consent recorded in the grant | 2 | 3, and a chair's yes |
| 7 | The kit -- resolve constraint 2 first | -- | 3, 4 |
| 8 | `kwaai_mage` | -- | 4, 7 |

Moves 1-3 are the self-referential loop and cost three sessions. They are also the only thing
here that turns the argument from a proposal into a demonstration, which is why they come before
publication and before anything is said upstream.
