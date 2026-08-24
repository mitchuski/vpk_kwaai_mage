# STAR-CHART -- how the VPK lane integrates with the constellation instruments

**Verdict.** The chart needs no new geometry. The six strands already are the six layers of
`PATHWAY.md`, the corpus is already drawn (cores are page-stars), and there is a published
cross-system contract -- game42 `AXIOMS.md` A5 -- that a `DisclosureReceipt` can bind to
without inventing anything. The integration is: **emit City Key objects, light the same
vertices.** One new edge kind, one new toggle.

Sources read 2026-08-20: `~/game42/AXIOMS.md`, `~/game42/game-of-42.json`,
`~/game42/src/citykey.js`, `~/agentprivacy.guide/tools/star-chart.mjs`,
`~/agentprivacy.guide/site/star-chart/{index.html,data/labs.json}`,
`~/agentprivacy_master/src/app/star-chart/page.tsx`.

---

## 1. The seam we bind to

`AXIOMS.md` A5, verbatim: cross-system overlap binds to **only** these four fields of a sealed
game -- `{ seal, kappa, axisBitmask, packets }`. "Everything interior ... stays game-side."
**No integration may read a game's interior.**

That is the contract, and it fits the lane's thesis exactly. A disclosure receipt should expose
an address, a bitmask, and a proof root -- and nothing about the content. The instrument that
renders it is entitled to see no more than the untrusted inference peer is.

`src/citykey.js` shows the projection already implemented for a sealed game:

    let axisBitmask = 0;
    for (a of axes) if (locked) { const v = AXIS_VERTEX[a]; lit.push(v); axisBitmask |= v; }
    packets: { root: seal, count: game.sealedCount() },

A `DisclosureReceipt` projects the same way:

| City Key field | Disclosure meaning |
|---|---|
| `kappa` | `kappaCity(receipt)` -- soulbis parameterisation, sha256 prefix, excludes only `kappa` |
| `axisBitmask` | which sovereignty axes the released telling engaged (section 3) |
| `packets` | `{ root: kappa(core), count: releases_to_date }` -- the proof root, carried untouched by `/star`, charged by `/city` |
| `seal` | the ledger epoch root once both signatures verify (section 5 of `PATHWAY.md`) |

`/star`, `/lattice`, `/sigil` already import this shape. A receipt would rise as a star in
`/skye` the same way a sealed board does, with no instrument changes.

## 2. The six strands are the six layers

Not an analogy -- a match, strand by strand. Strand themes quoted from
`site/star-chart/data/labs.json`; `zkDimension` and vertex values from `game-of-42.json`.

| Strand | Vertex | zkDimension | Its theme, quoted | The layer it carries |
|---|---|---|---|---|
| **protection** ⚔️ | 32 | privacy | "the boundary layer -- trust graphs, zero-knowledge predicates, the KYRA checkpoint" | **L3 the gate.** Tier filter, ladder, ZK fold proof. |
| **delegation** 🧙 | 16 | agency | "the forkable skill library -- what the agents carry" | **onward disclosure.** `DelegationScope`, strictly decreasing depth. |
| **memory** 📚 | 8 | continuity | "the knowledge graph and the spellbooks -- the archive that carries lineage" | **L1/L2 cores.** The invariant, its kappa address, its lineage. |
| **connection** 🏛 | 4 | connection | "the forkable wiki commons -- every site a sister" | **the multi-Bob federation.** Who may query whom. |
| **compute** ⊥ | 2 | learning | "a validated result proposes an edge, **only a signature mints it**" | **L5 the mesh + the receipt rule**, already written as the strand's own theme. |
| **value** 🏛 | 1 | compliance | "MyTerms, the Lexon grammar, the City's economy" | **the terms record.** IEEE P7012 tier policy; `/city` charges the packets. |

(The strand emoji and the `⊥` in the compute row are quoted from our own canon: the tack
marks the two harness agents as deliberately independent.)

The compute strand's theme is the receipt rule verbatim. That is not a coincidence to celebrate;
it is evidence the lane is re-deriving something the canon already settled, which is the
cheapest kind of integration.

## 3. THESIS -- the ladder is bit-clearing, and D4 is a fixed point

Offered as a thesis for the G1 refuter fleet, **not** as a finding. It is my construction on
their canon.

Read a release as the set of axes its telling still engages. Descending the ladder clears bits:

| Tier | Telling | Axes engaged | Vertex |
|---|---|---|---|
| D0 | raw chunk | all six | 63 |
| D1 | actions | drop value | 62 |
| D2 | principles | drop value, connection | 58 |
| D3 | maths | protection + delegation + memory | 56 |
| D4 | address only | protection alone | **32** |
| -- | no release | none | **0** |

`AXIOMS.md` A2: `neg(x) = (64 - x) % 64` is the Swordsman's reflection, "fixed points 0, 32".

**The two fixed points of Protect are exactly the two non-disclosing states.** Release nothing
(0) or release only an address (32) and the Swordsman's operator returns you where you stood.
Every other rung moves under reflection -- which is what it means to have given something away.

If this survives refutation it is the neatest available statement of the whole design, and it is
checkable rather than poetic: run `neg` over the ladder and see which rungs are stationary.

**MEASURED AND CORRECTED 2026-08-20 -- it is a partial order, not a chain.** The first real run
(`MEASUREMENTS.md`) shows D2 and D3 are *siblings*: different projections of the same source,
neither containing the other, with D3 longer than D2 on 6 of 12 pages. The filtration below is
arithmetically sound and empirically wrong. A bitmask lattice is already a partial order, so the
correction fits the canon better than the chain did -- but the gate must map a trust tier to a
*specific mask*, not to "this rung and everything below", because below is not always defined.

Arithmetic checks (these do hold): the chain is a proper filtration, 63 > 62 > 58 > 56 > 32 with
each a bit-subset of the last; and `neg(x) = x` iff `2x = 0 mod 64`, so the fixed points are
exactly {0, 32}, no others.

Attack lines the fleet should take: the bit assignments per rung are asserted, not derived; "the
telling engages axis X" needs an operational test; D1/D2/D3 vertex choices are the weakest link;
and the ladder is **not uniform** -- D3 to D4 clears two bits (delegation and memory) where every
other step clears one, which either means a rung is missing between them or the axis assignment
is wrong.

## 4. Cores are already stars. Receipts are the new edges.

`tools/star-chart.mjs` bakes each site's sitemap as `{slug, title, date, links}` and the page
renders the **Promise Graph** "straight from the sitemaps (each page carries its links)".

So the corpus is drawn already. Our fedwiki cores *are* page-stars today. What is missing is a
second edge kind:

- **link edge** (exists): page A references page B. A promise inside the federation.
- **release edge** (new): core K was disclosed to peer P at tier D, both signed. A promise
  across the boundary.

Render rules that fall out with no new vocabulary:

- edge hue = the strand of the highest axis still lit at that tier (D4 releases draw in
  protection gold, which reads correctly at a glance -- gold means nothing left the box)
- edge weight = tier depth, so a corpus that mostly emits D3/D4 looks thin and disciplined
- star brightness = release count from `packets.count`
- a receipt without its countersignature **does not draw**. Failing closed is the feature, and
  the chart should show it the same way the gate does.

New toggle `tReleases`, seated beside the existing `tLinks` / `tPages` / `tSteps` / `tCrystals`
switches in `index.html`.

## 5. What the Bob box emits

One file, appended at each release, read by the chart the way sitemaps are read:

    site/star-chart/data/releases.json
    {
      "note": "disclosure ledger projection -- addresses and bitmasks only, no content",
      "receipts": [
        { "kappa": "sha256:...",        // kappaCity(receipt)
          "core":  "sha256:...",        // kappa(core) -- the invariant, not the telling
          "tier":  "D3",
          "axisBitmask": 56,
          "peer":  "did:peer:...",      // or an anchor kappa, per DTGWG typing
          "basis": "peer-verified",
          "countersigned": true,
          "packets": { "root": "sha256:...", "count": 4 },
          "at": "2026-08-20T00:00:00Z" }
      ]
    }

Note what is absent: no telling, no chunk, no query, no title. The ledger is renderable by
anyone and readable by no one -- the same property VPK gives `SearchByIndex`, applied to the
audit trail. This is the artefact to put in front of the VPK WG for Aim 3, because it is a
picture of oversight-without-visibility rather than an argument for it.

## 6. Findings

**S1 -- `labs.json` `bit` is a seating index, not a lattice bit. Landmine.**
`index.html:383` uses it purely for torus geometry: `const stride = 1 << (s.bit % 3), onU =
s.bit < 3` -- it decides which strands sit on the U ring and which on V. But `labs.json` numbers
protection 0, delegation 1, compute 2, memory 3, connection 4, value 5, while `AXIOMS.md` A1
fixes protection **5 (HIGH, vertex 32)**, delegation 4, memory 3, connection 2, compute 1, value
**0 (LOW, vertex 1)**. It is *roughly* inverted but **not an exact reversal** -- compute, memory
and connection are permuted differently -- so no arithmetic recovers one from the other. Only
memory (3) coincides, by accident. A1 warns in as many words: "**never `1 << axisIndex`** (that wrongly assigns
protection to 8)". Nothing computes a vertex from `labs.json` today, so this is not a live bug
-- it is the exact trap A1 was written to prevent, waiting for the next integrator.
**Fix:** rename the field to `seat` -- **do not renumber it**, the torus seating depends on
those exact values -- and add `latticeAxisVertex` alongside for anyone who needs the real thing.
This lane reads `AXIS_VERTEX` from `game42/src/canon.js` only, never from `labs.json`.

**S2 -- the meta line overclaims.** `labs.json` meta says "game42 `data/game-of-42.json` axis
colours; six stratum-1 roots of the 64-vertex sovereignty lattice". The colours do match all six
(checked). The *roots* do not travel with them -- no `latticeAxisVertex` is baked into the star
chart data at all. Add the vertex values to `labs.json` and the claim becomes true and useful,
since section 3 then has canon values to read instead of a hand-built table.

**S4 -- two meanings of kappa are now loose in this lane. Fix before either travels.**
game42 `AXIOMS.md` **A3** is explicit and MODEL-locked, with a production conformance vector:
"kappa -- the identity hash ... SHA-256 over a canonical form" (written with the
Greek letter in the source). That is the meaning used by
`kappa_from_value` upstream at UOR, by `kappaCity` in `src/citykey.js`, by the 42 VRC kappa-labels
in the group seal, and by every `kappa(core)` / `kappa(telling)` in this lane's documents.

The pathway-grants build plan (unpublished, kept alongside this lane) uses the same letter for
something else: "Measure kappa = words(compression) / words(pathway corpus)". That is a compression
**ratio**, and a sealed runtime will carry both quantities at once -- an address and a ratio --
so the collision is not hypothetical.

**RESOLVED 2026-08-20, and not by us.** The shipped `~/vpk/pathways/compress.js` already gets it
right: `kappa()` is the content address, and the compression ratio is called `ratio`
(`compress.js:125,134`). The collision existed only in the planning document and the chronicle
written from it -- it never reached the implementation. Corrected in the chronicle; recorded here
because a finding that dissolves on contact with the code is worth writing down as such.

**S3 -- the chart is a static bake, which is exactly right here.** `star-chart.mjs` freezes
sitemaps into `data/` and rewires click-throughs; the live engine reads the local farm. A
disclosure ledger must be a bake too -- never a live read of the Bob box -- or the instrument
becomes a side channel into the trusted zone. Emit `releases.json` from the Pi on a schedule,
bake it, publish it. Same posture as the embassy: hosts publish, visitors read.

## 7. Where this attaches

| PATHWAY gate | Star chart work |
|---|---|
| G1 ladder spec | Section 3 goes to the refuter fleet as a thesis. S1/S2 fixed first, so the fleet argues over canon values. |
| G2 corpus | The fedwiki area chosen for the corpus is already seated on a strand. Cores get kappa addresses; page-stars gain `core`. |
| G4 receipt | `releases.json` emitter on the Bob box + `kappaCity(receipt)` reusing `src/citykey.js` unchanged. |
| G5 oversight note | The rendered ledger *is* the exhibit. Screenshot the constellation, not the schema. |

Order: **S1/S2 before G1.** They are one-line fixes and everything downstream reads those values.

## 8. Open questions

- **SQ-1** -- Does a release edge belong on the guide star chart (public, 17 sites) or only on
  the tailnet instruments? A public ledger of "who received what fidelity when" is metadata, and
  metadata is the attack surface VPK's multi-shard section is careful about. Default to
  tailnet-only until OQ-4 (correlation) has an answer.
- **SQ-2** -- `/city` "charges the packets". If a disclosure carries a proof root through the
  same path as a sealed game, does a release become chargeable? That is either the cleanest
  economic model in the whole lane or a category error. Not to be decided by me.
- **SQ-3** -- One receipt per release, or one sealed board per session? A1's 42-slot structure
  suggests a session could seal like a game (42 releases -> group seal). Tempting; unforced.
