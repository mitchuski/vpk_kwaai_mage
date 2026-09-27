// vpk_kwaai_mage/map/serve.mjs -- the instrument, served locally with a live seam.
//
//   node serve.mjs            # http://localhost:8796/
//   PORT=9000 node serve.mjs
//
// Static files come from site/. `/api/v1/state` is proxied to map.kwaai.ai so
// the page reads the same relative path it would read deployed beside the
// map-server's nginx (docker/map-nginx.conf proxies /api/ the same way). When
// the upstream is unreachable the baked snapshot is served instead, marked with
// an `x-map-source: baked` header so the page can say so.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, 'site');
const PORT = Number(process.env.PORT || 8796);
const UPSTREAM = process.env.MAP_STATE_URL || 'https://map.kwaai.ai/api/v1/state';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

let cache = { at: 0, body: null };
async function liveState() {
  if (Date.now() - cache.at < 15_000 && cache.body) return { body: cache.body, source: 'live-cached' };
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20_000);
  try {
    const r = await fetch(UPSTREAM, { signal: ctl.signal, headers: { accept: 'application/json' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const body = await r.text();
    cache = { at: Date.now(), body };
    return { body, source: 'live' };
  } finally { clearTimeout(t); }
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  // any other /api/v1/* call (is_reachable/<peer>) passes straight through to the upstream host
  if (url.pathname.startsWith('/api/v1/') && url.pathname !== '/api/v1/state') {
    try {
      const up = new URL(UPSTREAM); up.pathname = url.pathname; up.search = url.search;
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 30_000);
      const r = await fetch(up, { signal: ctl.signal, headers: { accept: 'application/json' } }); clearTimeout(t);
      res.writeHead(r.status, { 'content-type': r.headers.get('content-type') || 'application/json', 'cache-control': 'no-store' });
      return res.end(Buffer.from(await r.arrayBuffer()));
    } catch (e) { res.writeHead(502, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ error: String(e.message) })); }
  }
  if (url.pathname === '/api/v1/state') {
    try {
      const { body, source } = await liveState();
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'x-map-source': source, 'cache-control': 'no-store' });
      return res.end(body);
    } catch (e) {
      try {
        const body = await readFile(join(SITE, 'data', 'state.json'));
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'x-map-source': 'baked', 'x-map-error': String(e.message).slice(0, 120), 'cache-control': 'no-store' });
        return res.end(body);
      } catch { res.writeHead(502); return res.end('no upstream, no bake'); }
    }
  }
  const SEP = [ '/', String.fromCharCode(92) ];   // slash and backslash, spelled without escapes
  let p = normalize(decodeURIComponent(url.pathname));
  while (SEP.includes(p[0])) p = p.slice(1);
  if (p === '' || SEP.includes(p[p.length - 1])) p += 'index.html';
  const file = join(SITE, p);
  if (!file.startsWith(SITE)) { res.writeHead(403); return res.end(); }
  try {
    const st = await stat(file);
    const target = st.isDirectory() ? join(file, 'index.html') : file;
    const body = await readFile(target);
    res.writeHead(200, { 'content-type': MIME[extname(target)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('not found: ' + p); }
}).listen(PORT, () => {
  console.log(`kwaai map instrument  http://localhost:${PORT}/`);
  console.log(`state seam            /api/v1/state -> ${UPSTREAM} (falls back to site/data/state.json)`);
});
