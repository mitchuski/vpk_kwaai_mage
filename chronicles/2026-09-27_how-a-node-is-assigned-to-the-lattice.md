# How a node is assigned to the lattice — chronicle, 2026-09-27

**Lane:** `~/vpk_kwaai/map` · **Companion:** `2026-09-27_the-map-as-constellation.md` · **Status:** the reading is a THESIS; the machinery it feeds is the model's.

This is the serious account. It says exactly what the map computes from a KwaaiNet peer, in what order, with which parts taken from the canon and which parts asserted here so that they can be refuted. Claim tiers: **CANON** (from `game42/AXIOMS.md`, the PVM skills, or `/star`'s code), **THESIS** (asserted in this lane), **MEASURED** (read off the live crawl of 2026-09-27, 13:0xZ, 22 peers), **OPEN**.

## 1. The space

The sovereignty lattice is ℒ = ℤ/64ℤ = {0,1}⁶: a vertex is a 6-bit address. The bit order is fixed and is not positional (CANON, A1). Protection is the high bit; value is the low bit.

| dim | axis | glyph | bit | vertex value |
|---|---|---|---|---|
| d₁ | protection | 🛡️ | 5 | 32 |
| d₂ | delegation | 🤝 | 4 | 16 |
| d₃ | memory | 📜 | 3 | 8 |
| d₄ | connection | 🔗 | 2 | 4 |
| d₅ | computation | ⚡ | 1 | 2 |
| d₆ | value | 💎 | 0 | 1 |

A vertex's **stratum** is its popcount, 0…6. The strata hold 1, 6, 15, 20, 15, 6, 1 vertices — Pascal's row — and the model uses that row as the stratum weight (CANON, network-topology skill). The map never computes a vertex as `1 << index`; it ORs the vertex values above (A1's warning, kept).

## 2. The reading: six questions the contract can answer

A peer is one row of `/api/v1/state`. The map asks six yes/no questions of that row and sets the axis bit when the answer is yes. This table is the THESIS. Everything after it is canon applied to its output.

| axis | bit set when | contract fields read | why this axis |
|---|---|---|---|
| protection 32 | `trust_attestations ≥ 1` | `trust_attestations` | the credential ladder is the one the whitepaper builds trust on; an attested peer has entered the gate. Today every peer reads 0 (MEASURED), so no peer holds protection. |
| delegation 16 | it is a **first block server**: Serving, with `span.start == 0` | `state`, `span` | the coordinator delegates its prompt to the first block server, which receives it as raw token IDs (vpk lane F1). Holding the delegated prompt is the delegation act on this network. |
| memory 8 | it announces a VPK capability | `vpk` | it offers to hold others' knowledge (an Eve). |
| connection 4 | it is named by a DHT record, and, when the document says so, identified over kad | `announced`, `kad` | it is a member of the commons the DHT is. |
| computation 2 | it is Serving with `throughput > 0` | `state`, `throughput` | it computes for others now. |
| value 1 | it appears in `top_contributors` | `top_contributors` | the network itself names it as carrying an unusual share of announced throughput. |

The vertex is the OR of the set bits. Two readings are deliberately not what one might first reach for: *delegation* is not "reachable to be delegated to" (that is connection's business) and *value* is not throughput (that is computation's); each axis reads a different field so that no two bits are set by the same fact.

**Worked example (MEASURED).** `professor_reza` at that crawl: Serving, throughput 36.2 tok/s, no block range, Direct, 0 attestations, no VPK, announced, not a top contributor. Bits: connection 4 + computation 2 = **V6 = 000110**, stratum 2, holding 🔗⚡. `darrenw-linux-aarch64`: Serving 16–24, top contributor → 4 + 2 + 1 = **V7 = 000111**, stratum 3. `darren-metro`: Serving 0–16, so a first block server, not a top contributor → 16 + 4 + 2 = **V22 = 010110**, stratum 3, and it is the peer the seam lens paints sword-red.

**Distribution (MEASURED, 22 peers):** strata 0…6 held 7 · 6 · 6 · 2 · 1 · 0 · 0 peers. Nobody above stratum 4; nobody holds protection.

## 3. What the canon does with a vertex

Once a peer has a vertex, nothing further is asserted; the model's own machinery runs.

**Operators (CANON, A2).** `neg(x) = (64 − x) mod 64` is the Swordsman's reflection (fixed points 0 and 32); `bnot(x) = 63 − x` is the Mage's antipode (no fixed point); `succ(x) = x + 1 mod 64` is the wheel, and `succ = neg ∘ bnot`. For every peer the card lists the peers, if any, standing at its neg, its bnot and its succ. On this crawl a peer at V6 has its reflection at V58, its antipode at V57, its successor at V7 — and V7 is occupied.

**Moves.** Between two vertices a and b the map names the move in this order: stay; succ; neg; bnot; a single flip (Hamming distance 1, named by the axis that changed); otherwise a jump of h bits. A single flip is always vertical (the stratum changes by one). A move with h ≥ 2 and no stratum change is lateral. This ordering is the guide star chart's `moveName`, kept verbatim.

**Edge value (CANON in form, THESIS in the weights).** T(π) = 1 + β Σₑ f(e)·g(nₑ) over the edges of a walk. The model states the form and leaves f, g and β open. The map sets, and says on the page that it sets:

- f(e) = 0.25·h + 0.75·|Δstratum| — so one flip is 1.0, a lateral two-flip 0.5, a three-bit jump that climbs one stratum 1.5. Vertical moves outweigh lateral, as the model asks; the constants are the lane's.
- g(nₑ) = 1/√nₑ — diminishing returns to re-walking an edge, one of the three options the model leaves open.
- β = 1.

**Network term (CANON in form; k THESIS).** (1 + Σᵢ wᵢ nᵢ / N₀)^k with wᵢ = (1, 6, 15, 20, 15, 6, 1), nᵢ the peers at stratum i, N₀ the peer count, and k on a slider defaulting to 1. MEASURED: Σ wᵢnᵢ = 1·7 + 6·6 + 15·6 + 20·2 + 15·1 = 188; 188/22 = 8.545; the term reads **9.545** at k = 1. The model conjectures k > 1 and says it is uncalibrated; the page shows the number and the slider, and claims nothing from it.

**Betweenness (CANON, V5.4 §10.2).** On the chain graph — peers as nodes, an undirected edge where one serving peer's range lets it follow another's — Brandes' C_B(v) = Σ σ_st(v)/σ_st, normalised. "The value lives where the most paths cross." With three serving ranges tiling the model at that crawl, exactly one peer had non-zero betweenness.

**The boundary (CANON, /star).** ∂M is drawn with 96 edges: the succ cycle (64) plus the half-turn chords x ↔ x + 32 (32), a 3-regular graph. The map's star seating is that ring; the **lattice** layer draws, over any seating, every pair of peers one flip apart — the ∂M-adjacent pairs the live network happens to realise.

## 3a. Where a vertex sits in space (the star seating)

The star seating is `/star`'s own embedding of the 6-cube, kept verbatim so the picture matches (CANON in the sense of "the Star's construction", not a term of the model). Six unit generators along icosahedral axes, indexed by **bit** b = 0…5:

| b | axis (A1) | generator, before normalising |
|---|---|---|
| 0 | value 💎 | (0, 1, φ) |
| 1 | computation ⚡ | (0, 1, −φ) |
| 2 | connection 🔗 | (1, φ, 0) |
| 3 | memory 📜 | (1, −φ, 0) |
| 4 | delegation 🤝 | (φ, 0, 1) |
| 5 | protection 🛡️ | (φ, 0, −1) |

with φ the golden ratio. The position of vertex x is

    p(x) = s · Σ_b (bit_b(x) − ½) · ĝ_b,

s chosen so the farthest vertex sits at the star's radius R_STAR (1.62 in the page's units; `/star` uses 0.80 in its own). What follows from the formula, and is therefore true of every peer's placement:

- **Antipodes.** p(63 − x) = −p(x): the Mage's `bnot` is the point reflection through the centre, and V0, V63 are the two poles.
- **Flips are translations.** p(x ⊕ 2^b) − p(x) = ±s·ĝ_b: every Hamming-1 edge is one fixed step along its dimension's axis, so the six "one flip apart" neighbours of any vertex form the same six-pointed figure everywhere.
- **Stratum reads as height.** Along the V0→V63 axis d = Σ ĝ_b, a held bit adds ĝ_b·d; the generators are not orthogonal, so the height is not exactly proportional to the stratum, but more held dimensions means nearer the V63 pole. That is what colouring by stratum shows in three dimensions.
- **`neg` is not a symmetry here.** neg(x) = (64 − x) mod 64 is the additive inverse of the ring, not a bit-wise map, so it is a lattice operator with no simple geometric image in this embedding. The card lists the peer at neg(x); the picture does not draw it as a reflection.
- **∂M** is drawn between the p(x): the 64 succ segments and the 32 chords x ↔ x + 32.

Display conventions on top of the formula, which are *not* lattice facts: the k-th peer sharing a vertex steps outward along p(x)'s own direction by 9 % per k with a small sideways offset (so co-located peers form a short spur, the first at the true vertex); the model's blocks ring the equator at 0.95; the bootstraps sit at ±2.2 on the vertical axis. An imported key's inner 64 use the same p(x) at 0.62 inside the globe and grow to R_STAR as the dial folds, so at the star a key's lit vertices and the peers' vertices are the same points; the manifold r(θ,φ) = R + ε·sin(mφ)·cos(nθ) around it is `/star`'s field and places nothing.

## 4. The two keys

**A walked key.** `lit` = the vertices of the walked peers (plus 63 when their union holds all six bits). `packets = { root: κ of the sorted walked peer ids, count }`. `source` carries the peers, their vertices, the named moves and T(π). `witness.spent` counts the observer's visits per vertex, `/lattice`'s shape. `kappa` is the soulbis rule: SHA-256 over the canonical form (keys sorted, no whitespace), excluding only `kappa`, labelled `sha256:` (CANON, A3). A key evolved from an imported one carries `prior`.

**The boundary key.** `lit` = every occupied vertex. `packets.root` = κ of `{ vertices: { v: count }, edges: [[a, b, kind]…] }` with kind ∈ {chain, flip}, sorted. Seating, palette, names, highlights and the observer are all outside that root. So (THESIS, from the holographic bound's C9): two people looking at one crawl through different views and colours produce the same root, because the root names the network's boundary and not its picture.

## 5. What can be attacked, and how

1. **Each of the six rules.** They are one line each in `AXES` in `site/index.html`. Replace a rule, reload, re-export; the κ changes.
2. **Delegation.** Reading "holds the delegated prompt" as delegation is the least obvious choice. The alternative, "reachable so that work can be delegated to it", collides with connection. A third reading, "relays for others", would set delegation on the bootstraps, which the contract does not list as peers.
3. **Value.** `top_contributors` is the network's own naming, but it is a throughput ranking with five slots; a network of six serving peers puts five of them in it. A better value reading may exist once the contract carries anything economic.
4. **Protection is empty.** Until attestations appear on the wire, no peer can hold the high bit, so the top two strata are unreachable and the network term is bounded by stratum 4. That is a fact about the network, not the reading, and it is the point the vpk lane's F3 makes from the other side.
5. **The weights.** f, g, β and k are display registers. Anyone proposing calibrated values should replace the three constants in `moveOf` and `netTerm` and say why.
6. **The boundary root** hashes counts and pairs; it does not hash which peer stands where. Two crawls with different peers but the same occupancy and the same realised edges read the same root. That is intended — it is what "the boundary encodes the bulk" means here — and it is worth stating so nobody reads the root as an identity of peers.

## 6. Provenance

`game42/AXIOMS.md` A1–A3, A6, A7; `game42/src/canon.js` `AXIS_VERTEX`; `star lattice/star-tetrahedron-manifold.html` (E_HOLO, VERTS, the cores); `star/lattice/index.html` (`kappaLabel`, `buildWitness`, `pngExtractKey`); skills `agentprivacy-dragon`, `agentprivacy-edge-value`, `agentprivacy-network-topology`, `agentprivacy-holographic-bound`; `KwaaiNetMap/map-server/src/snapshot.rs` for the fields; `vpk_kwaai/FINDINGS.md` F1 and F3 for the seam and the two ladders.
