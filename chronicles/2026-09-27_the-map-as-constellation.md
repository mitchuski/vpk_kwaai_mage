# The map as constellation — chronicle, 2026-09-27

**Lane:** `~/vpk_kwaai/map` · **Status at close:** BUILT, LOCAL ONLY, uncommitted, nothing sent upstream.
**Voice:** working record for the kwaai mage project. Claim tiers as in the vpk lane: VERIFIED (read in cited source), OBSERVED (seen on a wire or a render), THESIS (a construction on the canon, offered to be argued with).

## 1. What was asked, in order

1. Build upon the KwaaiNetMap visualisation with more information per node, in the style of the guide star chart and the star, locally, for review and edit.
2. Integrate the Star Key: customise the globe to create your own key.
3. A simpler menu; keep the panel system, move it to the left.
4. A guide page for the map. Connect to the other Kwaai node admin pages; check the links.
5. Use the Privacy-Is-Value geometry so nodes interact according to their information.
6. Observe the circuit and record it as a proof of presence; the block coverage bar as a bit circuit recording an observation of the network.
7. Assign the KwaaiNet node state to the star, encoding the network on the holographic boundary so the same κ information space is reached from any view.
8. Replace the globe with the star: each node at its vertex of the 64, as a trust presentation of the Star Key — a third transform, globe → chain → star.

## 2. What exists now

- `site/index.html` — one file, three.js vendored from the guide chart. **Three seatings on one dial:** the globe (geoip pins, unplaced peers on an outer ring, bootstraps at the relays' pins), the chain (the block axis of the largest model, spans as bars in lanes), the star (the 64 vertices in three dimensions, placed as `/star` places them from six icosahedral generators, with ∂M over them — the succ cycle plus the 32 half-turn chords, 96 edges — each peer seated at its vertex, peers sharing a vertex stepping outward; first drawn as a flat ring, made three-dimensional the same afternoon at Mitch's ask, so an imported key's manifold and cores surround it).
- **The node card** carries every field of `/api/v1/state` with its source, the v1 page's own state and reach rules verbatim, a platform reading of the operator's label, the tier caveat (F3), the seam row (F1), the VPK row (F4), a live reachability probe through the map-server, and a lattice group: vertex, bits, stratum, the three operator partners present in the network, one-flip neighbours, chain moves with their f, betweenness.
- **The lattice reading (THESIS):** six yes/no rules → a vertex. protection 32 = attested · delegation 16 = holds the delegated prompt (first block server) · memory 8 = offers VPK storage · connection 4 = named in the DHT · computation 2 = serving with throughput · value 1 = a top contributor. A1's bit values, never `1 << index`.
- **The model layer, from the skills:** moves named succ/neg/bnot/flip/jump; T(π) = 1 + β Σ f(e) g(nₑ) with f = 0.25·flips + 0.75·|Δstratum|, g = 1/√nₑ, β = 1 — a display register, uncalibrated by the model's own account; the network term (1 + Σ wᵢnᵢ/N₀)^k with Pascal's row as wᵢ, N₀ = peers, k on a slider; Brandes betweenness on the chain graph ("the value lives where the most paths cross", V5.4 §10.2).
- **The key lane:** shift+click walks peers; T(π) accumulates; four palette wells are the carrier canon (A6) and recolour the globe, the land, the threads, the boundary; export writes a version-1 City Key (name · palette · lit vertices · packets · source · witness · κ by the soulbis rule, A3); import reads JSON or a PNG's `tEXt cityKey` chunk (A7 — the same reader as `/lattice`), verifies κ, applies the palette, relights the walk; the keepsake PNG carries the key in that chunk, so it opens in `/lattice`, `/star`, `/skye`.
- **The observer:** ▶ observe runs a light around the walk (or the serving chain) and counts each visit into `witness.spent` by vertex — `/lattice`'s witness shape, presence recorded as a count, not claimed as a proof. ● rec on the coverage bar writes one row of bits per crawl into a local strip; the last rows ride in the key under `source.observed`.
- **The boundary key:** every peer at its vertex, the realised edges (chain threads, one-flip pairs) as vertex pairs; `packets.root` = κ of `{vertices, edges}` with seating, palette and names excluded, so the same crawl reads the same root on the globe, the chain, the star, or in another instrument. `self` names the operator's own node when found.
- **Doors:** the network (map, state, metrics, probe), the local node pages (API :11435, shard :8080, RAG :9090, dashboard :5173/:3456, VPK console :7432, Ollama :11434 — probed from the page), source and docs, the star side. Every external link answered on 2026-09-27 except the GliaNet `/pledge` path (now a section of the home page) and KwaaiNetOps (not public).
- `site/guide.html`, `serve.mjs` (static + `/api/v1/*` proxy with baked fallback), `tools/bake.mjs`, `tools/shoot.mjs` (headless review renders).

## 3. The ideas worth keeping, stated plainly

- **Three transforms of one network.** Where a peer is, what it serves, what it is on the lattice: the same objects, three seatings, one dial. Nothing is re-derived when the dial moves; only positions lerp.
- **The star as a trust presentation.** Seating each peer at its vertex of the 64 turns the network into a picture the Star Key already knows how to read. A key's `lit` set is a subset of the same 64; a network and a key can be laid on the same boundary and compared for overlap, the way `/skye` compares keys.
- **The boundary encodes the bulk (C9, applied).** The boundary key's root depends only on vertices and realised edges. Two people looking at the same crawl through different palettes, seatings and highlights arrive at the same root. That is the "same κ information space" the ask named, and it falls out of the holographic bound rather than being bolted on.
- **Presence as witness, not proof.** The observer counts visits; the recorder counts crawls. Both are honest records of attention that a later ceremony could attest. Neither is a proof, and the page says so.
- **The reading is the arguable part.** The six rules are the THESIS. The operators, the strata, the weights, ∂M's construction and the κ rule are the canon's. Anyone who disagrees with a rule can change one line and re-export; the κ will differ, as it should.

- **The offering (Mitch's framing, 2026-09-27).** This is one of the first readings of a live decentralised trust graph for private knowledge sharing through the Privacy Is Value Model. Per crawl it yields a reproducible dataset — vertex occupancy, strata, the network term, the named moves on the chain graph, betweenness, the boundary root — that anyone with the same document can re-derive. That makes the model a **unique way of assessing a network**: not a score of its peers but a reading of its shape on the sovereignty lattice, with every line labelled canon, thesis or open. Bound as the proposed Tome XI (`cityofmages/tomes/proposed/tome-xi-the-constellation/`).

## 4. What is not done, and what needs Mitch

- Not pushed, not committed, not sent to Kwaai. The vpk lane's `ADDRESS.md` posture applies: offered, not pushed.
- The reading's six rules have not been refuted by the fleet. They should go to the G1 refuter posture before the boundary key is shown to anyone as more than a sketch.
- The `/star` manifold's richer effect controls (ε · m · n · core · spin) are not mirrored; the view tab has the fold, colour, layers and palette only.
- T(π) weights, k, and the stratum weights are uncalibrated (the model says so). The page shows them as display registers.
- Endorsement edges and per-node history are absent from the contract; none are drawn.

## 5. Provenance

Read this session: `KwaaiNet-main` (README, docs, `systems/node-dashboard`), `KwaaiNetMap` (`kwaainet.html`, `map-server/src/snapshot.rs`, `V2.md`, `MAP_SERVER_V2_REQUIREMENTS.md`), `vpk_kwaai` (README, FINDINGS, STAR-CHART, CONNECTIONS, notes/06), `agentprivacy.guide/site/star-chart/index.html`, `star/lattice/index.html`, `star lattice/star-tetrahedron-manifold.html`, `star-key` (README, STAR_PILOT), `game42/AXIOMS.md` A1–A8 and `src/citykey.js`, and the skills agentprivacy-dragon, -edge-value, -network-topology, -holographic-bound. Live: `https://map.kwaai.ai/api/v1/state`, 22 peers, one model of 32 blocks, both bootstraps online.
