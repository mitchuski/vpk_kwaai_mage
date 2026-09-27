# the map lane — the KwaaiNet map as a constellation

The second lane of [vpk_kwaai_mage](../README.md). It builds on the first lane's findings (F1 · F3 · F4), its receipt
(PATHWAY §4–5), its star-chart binding and its convergence with the Privacy Is Value model; the root README's
*What builds on what* draws the lineage. Nothing in the first lane was changed to make this one.

A local, reviewable rebuild of the [KwaaiNetMap](https://github.com/Kwaai-AI-Lab/KwaaiNetMap) page that reads the
**same `/api/v1/state` document** the deployed map, every node's health monitor and `kwaai-cli` read, and renders it
in the idiom of the guide star chart: one three.js scene, **three seatings on one dial** (globe · chain · star),
a card per node that says everything the contract says, a lens for the inference seam the
[vpk_kwaai lane](https://github.com/mitchuski/vpk_kwaai_mage) named, and — new here — the Privacy Is Value model's
lattice laid over the live network: a reading of each peer's vertex, the moves between them, the strata, the network
term, betweenness, and a **boundary key** whose root names the network's shape from any view.

Opened 2026-09-27. **Local only; on the branch `map-constellation` until merged; nothing sent upstream.** Built for review and edit.

## Run it

```bash
cd map
node serve.mjs                 # http://localhost:8796/   (PORT=… to move it; MAP_STATE_URL=… to point at another map-server)
node tools/bake.mjs            # refresh site/data/state.json from map.kwaai.ai + re-decode the land outlines
node tools/shoot.mjs           # headless render of every view → tools/shots/*.png + console errors (ignored by git)
node tools/reload-check.mjs    # reload as a browser that remembered folds, tabs, palette, my node — catches errors a fresh render never sees
```

`serve.mjs` serves `site/` and proxies `/api/v1/*` to `https://map.kwaai.ai` (state cached 15 s; `is_reachable`
passed straight through). If the upstream does not answer, the baked snapshot is served with `x-map-source: baked`.
`?src=data/state-v1.json` reviews the v1 document shape (no `peers` array); `?node=<peer id>` opens on one peer.
Node 22+; no npm install; three.js vendored from the guide star chart.

## What is in it

```
site/index.html       the instrument — one file, no build step
site/guide.html       the guide — eleven sections: what it reads · three seatings · a peer · the seam · the lattice reading ·
                      the key · observing · doors · 96 over 64 · the star as a trust picture · what it is not
site/reader.html      the reader for the VPK working group — what was built and why each connection was made, against Aims 1–3
site/reader/          the figures the reader uses (copies of tools/shots)
site/vendor/          three.module.min.js · OrbitControls.js
site/data/            state.json (bake) · state-v1.json (v1 shape) · land.json (world-atlas 110m, decoded)
site/assets/          kwaai-logo.png
serve.mjs             static + live seam proxy
tools/bake.mjs        snapshot + land bake        tools/shoot.mjs   headless review renderer (CDP, no puppeteer)
../chronicles/        2026-09-27_the-map-as-constellation.md — the work to date, the ideas, what is open
                      2026-09-27_how-a-node-is-assigned-to-the-lattice.md — the serious account of the reading
                      (the repository's one chronicle directory, shared with the first lane)
```

Vendored: `three.module.min.js` and `OrbitControls.js` (three.js, MIT) as carried by the guide star chart; the land
outlines are world-atlas 110m (Natural Earth, public domain) decoded by `tools/bake.mjs`; the Kwaai logo is Kwaai's,
used to point at Kwaai. The repository's `LICENSE.md` covers the rest: CC BY 4.0 documents, MIT code.

The project is also drafted as a **proposed Tome XI — The Constellation** in the City of Mages
(`~/cityofmages/tomes/proposed/tome-xi-the-constellation/`, README + three acts, unbound).

## The instrument

**A vertical column of named tabs at the top right, one panel beside it.** legend · view · find · peers · seam · key · observe · model · doors · guide.
**The card** opens on the left under the title when you click a star. **Coverage bar** bottom centre, with the bit recorder under it.
**The bottom bar** holds 🛰️ card and 🧱 coverage (show/hide, remembered), ◌ focus and 📷 keepsake.

**Three seatings, one dial** (view tab, or the globe/chain/star buttons):
- *globe* — geoip pins, unplaced peers on an outer ring, bootstraps as octahedra at the relays' pins, blocks ringing the globe.
- *chain* — the block axis of the largest model; each peer's range as a bar in a lane; chain threads where one range can follow another.
- *star* — the 64 vertices in three dimensions, placed as `/star` places them (six icosahedral generators, vertex = Σ (bit−½)·gen), with ∂M over them (the succ cycle + 32 half-turn chords = 96 edges); each peer at its vertex, peers sharing a vertex stepping outward; the blocks ring the equator; it turns and orbits. Hover a vertex for its bits, stratum and the peers there; click to isolate. An imported key's manifold and cores surround it.

**Colour by** state · reach · tier · seam · stratum. **Layers** land · graticule · blocks · chain · relays · lattice (one-flip pairs) · key · labels · drift · glow. **Palette wells** are the City Key carrier canon; they recolour the globe and travel in your key.

**The node card**: identity (copy), version, announced name; serving (model, range with chain position, throughput, dtype, cache, rps); reach (the map-server's verdict vs the node's self-report, relay, location, addresses, kad, announced); **on the lattice** (vertex, bits, stratum, the peers at neg/bnot/succ, one-flip neighbours, chain moves with f, betweenness); machine (read from the name); trust (attestations, the F3 caveat); the seam (F1); storage (F4); record. Buttons: walk it · fly to it · light its blocks · **probe reach** (live `/api/v1/is_reachable/<id>`) · copy deep link.

## The lattice reading (THESIS) — `AXES` in `site/index.html`

| axis | bit | set when | field |
|---|---|---|---|
| 🛡️ protection | 32 | attestations ≥ 1 | `trust_attestations` |
| 🤝 delegation | 16 | first block server (Serving, `span.start == 0`) — holds the delegated prompt | `state`, `span` |
| 📜 memory | 8 | offers VPK storage | `vpk` |
| 🔗 connection | 4 | named by a DHT record (and speaks kad when known) | `announced`, `kad` |
| ⚡ computation | 2 | Serving with throughput > 0 | `state`, `throughput` |
| 💎 value | 1 | in `top_contributors` | `top_contributors` |

Everything downstream is the model's: operators `neg`/`bnot`/`succ` (A2), moves named in the star chart's order,
T(π) = 1 + β Σ f(e)·g(nₑ) with f = 0.25·flips + 0.75·|Δstratum|, g = 1/√n, β = 1 (display registers), the network term
(1 + Σ wᵢnᵢ/N₀)^k with Pascal's row and k on a slider, Brandes betweenness on the chain graph. Full account, worked
examples and attack lines: `chronicles/2026-09-27_how-a-node-is-assigned-to-the-lattice.md`.

## The key lane

- **walk** peers (shift+click, or ✦ on the card) → T(π) on the corner card → **export** a version-1 City Key
  (name · palette · `lit` vertices · `packets` · `source` peers/moves · `witness` · κ by the soulbis rule, A3) →
  **keepsake** PNG carries the key in a `tEXt cityKey` chunk (A7; opens in `/lattice`, `/star`, `/skye`).
- **import** JSON or PNG: κ re-derived and checked; the key arrives as **its own layer** in its own palette
  (the manifold around the globe, the dual cores at the centre, the 64 inside with ∂M, lit vertices burning);
  the globe keeps its colours; peers on lit vertices are ringed.
- **the whole network as a star key**: every peer at its vertex; `packets.root` = κ of `{vertices: counts, edges: realised pairs}`
  only — seating, palette, names and highlights excluded, so the same crawl reads the same root from any view (the holographic
  bound, applied). `my node` names your own peer as `self`.

## The observer

▶ run / ⏭ step / ↻ direction / speed / route (walk · serving chain · all peers in succ order · by stratum). Each visit adds one
to that vertex in the **witness** (`/lattice`'s `spent` shape); a lap is a pass; a card rises as the light crosses a peer.
● **rec** writes one row of coverage bits per crawl into a local strip (export as JSON). Both ride in an exported key.
Records of attention, not proofs — the page says so.

## Doors (checked 2026-09-27)

The network (map, state, metrics, probe) · your node's local pages (API :11435, shard :8080, RAG :9090, dashboard :5173/:3456,
VPK console :7432, Ollama :11434 — probed from the page) · source and docs (KwaaiNet, KwaaiNetMap, KwaaiNetGUI, KwaaiNetDashboard,
getting started, API quickstart, map visibility debugging, dashboard plan, kwaai.ai/kwaainet, ToIP, GliaNet pledge at
`glianetalliance.org/#pledge`) · the star side (vpk_kwaai_mage, star-key, soulbis /guide /lattice /star /skye, the guide star chart,
mages.city). KwaaiNetOps is not public and is not linked.

## Review notes · where to edit

- **The six rules**: `AXES` at the top of the module script — one line each.
- **Weights**: `moveOf` (f), `walkValue` (g), `netTerm` (k default, `W_STRATUM`). **Tier bands**: `tierOf`.
- **Chain edge rule**: the `DATA.edges` loop in `ingest()`. **Seatings**: `layout()` (globe), `bx`/lanes (chain), `starPos`/`R_STAR` (star).
- **Palette**: `CANON` + `PAL`. **Key layer look**: `buildKeyLayer()` (manifold ε·m·n, cores, lattice scale).
- **Observer**: `runner` defaults; `circuitNodes()` routes. **Recorder**: `recordObservation()` (cap 512 rows).
- **Deploy posture**: drop `site/` beside `kwaainet.html`; it reads `api/v1/state` relative, like v1. A proposal to discuss, not a PR (the vpk lane's ADDRESS.md posture).

## Known limits

- One block axis; multiple models share the largest model's axis. Bootstrap pins depend on a relayed peer's "Via relay" location.
- The `/star` manifold's full effect controls (ε · m · n · core · spin) are not mirrored in the view tab; the key layer uses a key's `geometry` if it carries one, else the defaults.
- Labels are canvas sprites; ~25 peers is comfortable, hundreds would want culling.
- Headless renders use SwiftShader; glow reads a little flatter than in a browser.
