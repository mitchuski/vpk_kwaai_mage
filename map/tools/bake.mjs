// vpk_kwaai_mage/map/tools/bake.mjs -- freeze what the page needs into site/data/.
//
//   node tools/bake.mjs            # snapshot + land outlines
//   node tools/bake.mjs --land     # land outlines only (offline)
//   node tools/bake.mjs --state    # snapshot only
//
// The page reads /api/v1/state live when it can (serve.mjs proxies it); the
// baked snapshot is the fallback so the instrument opens with a real network
// even when map.kwaai.ai is unreachable. The land outlines are the
// world-atlas 110m country mesh decoded here once, so the page carries no
// topojson dependency and works offline.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const DATA = join(ROOT, 'site', 'data');
const STATE_URL = process.env.MAP_STATE_URL || 'https://map.kwaai.ai/api/v1/state';
const ATLAS = join(HERE, 'countries-110m.json');
const args = new Set(process.argv.slice(2));
const wantLand = args.size === 0 || args.has('--land');
const wantState = args.size === 0 || args.has('--state');

mkdirSync(DATA, { recursive: true });

// ---- land: topojson -> polylines ------------------------------------------
// A topology's arcs are delta-encoded quantised coordinates; every border and
// coastline is one arc, shared between the countries either side. Emitting the
// arcs themselves is exactly topojson.mesh(): no seam is drawn twice.
function decodeArcs(topo) {
  const { scale, translate } = topo.transform;
  return topo.arcs.map(arc => {
    let x = 0, y = 0;
    const out = [];
    for (const [dx, dy] of arc) {
      x += dx; y += dy;
      out.push([+(x * scale[0] + translate[0]).toFixed(2), +(y * scale[1] + translate[1]).toFixed(2)]);
    }
    return out;
  });
}

if (wantLand) {
  const topo = JSON.parse(readFileSync(ATLAS, 'utf8'));
  const arcs = decodeArcs(topo);
  const land = { source: 'world-atlas@2 countries-110m (Natural Earth, public domain)', baked: new Date().toISOString(), arcs };
  writeFileSync(join(DATA, 'land.json'), JSON.stringify(land));
  const pts = arcs.reduce((n, a) => n + a.length, 0);
  console.log(`land.json  ${arcs.length} arcs · ${pts} points`);
}

// ---- state: the live contract, frozen -------------------------------------
if (wantState) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 25_000);
    const r = await fetch(STATE_URL, { signal: ctl.signal, headers: { accept: 'application/json' } });
    clearTimeout(t);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const s = await r.json();
    s._baked = { at: new Date().toISOString(), from: STATE_URL };
    writeFileSync(join(DATA, 'state.json'), JSON.stringify(s));
    console.log(`state.json ${s.peers?.length ?? 0} peers · ${s.model_reports?.length ?? 0} models · last_updated ${s.last_updated}`);
  } catch (e) {
    console.error(`state fetch failed (${e.message}); the previous site/data/state.json is kept`);
    process.exitCode = 1;
  }
}
