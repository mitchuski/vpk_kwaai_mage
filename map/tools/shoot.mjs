// vpk_kwaai_mage/map/tools/shoot.mjs -- render the instrument headlessly and report.
//
//   node tools/shoot.mjs [http://localhost:8796/] [outdir]
//
// Drives a headless Chrome over its debugging protocol (no puppeteer): loads
// the page, reads the status line, screenshots the globe, folds to the chain
// and to the star, selects the first node in the find list, switches to the
// seam lens, opens the model and key tabs, and prints every console error it
// saw. Writes PNGs to outdir (default tools/shots/). A review aid: what the
// page looks like without opening it.

import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const URL_ = process.argv[2] || 'http://localhost:8796/';
const OUT = process.argv[3] || join('tools', 'shots');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;
mkdirSync(OUT, { recursive: true });

const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-first-run',
  '--remote-debugging-port=' + PORT, '--window-size=1440,900', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target = null;
for (let i = 0; i < 40 && !target; i++) { await sleep(250); try { const list = await (await fetch(`http://localhost:${PORT}/json`)).json(); target = list.find(t => t.type === 'page'); } catch {} }
if (!target) { chrome.kill(); throw new Error('chrome did not answer on ' + PORT); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const errors = []; const logs = [];
ws.onmessage = ev => { const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled') { const line = m.params.args.map(a => a.value ?? a.description ?? '').join(' '); (m.params.type === 'error' ? errors : logs).push(line); }
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errors.push(m.params.entry.text + ' ' + (m.params.entry.url || '')); };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push('evaluate: ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text)); return r.result?.result?.value; };
const shot = async name => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(OUT, name), Buffer.from(r.result.data, 'base64')); console.log('shot ', name); };
const tab = name => evaluate(`document.querySelector('#tabs button[data-tab=${name}]').click(); 'ok'`);
const fold = v => evaluate(`{ const f=document.getElementById('fold'); f.value=${v}; f.dispatchEvent(new Event('input')); } 'ok'`);

await send('Runtime.enable'); await send('Page.enable'); await send('Log.enable');
await send('Page.navigate', { url: URL_ });
await sleep(6000);
console.log('status:', await evaluate("document.getElementById('status').innerText"));
console.log('nodes :', await evaluate("document.querySelectorAll('#covBar .c').length + ' coverage cells · ' + document.querySelectorAll('#tBody tr').length + ' table rows · ' + document.querySelectorAll('.chip').length + ' chips · ' + document.querySelectorAll('#tabs button').length + ' tabs'"));
await shot('01-globe.png');
await tab('view'); await fold(1); await sleep(1800); await shot('02-chain.png');
await fold(2); await sleep(1800); await shot('03-star.png');
await fold(0); await tab('find'); await sleep(1200);
console.log('find  :', await evaluate("document.querySelectorAll('#findList .frow').length + ' rows'"));
await evaluate("document.querySelector('#findList .frow').click(); 'ok'");
await sleep(1600);
console.log('card  :', await evaluate("(document.getElementById('nodeCard').classList.contains('open') ? 'open · ' : 'CLOSED · ') + document.getElementById('nodeBody').innerText.slice(0, 120).replace(/\\s+/g, ' ')"));
await shot('04-node-card.png');
await tab('seam'); await evaluate("document.getElementById('seamOn').click(); 'ok'"); await sleep(1000); await shot('05-seam-lens.png');
await tab('model'); await sleep(600);
console.log('model :', await evaluate("document.getElementById('netTerm').textContent + ' network term · strata ' + [...document.querySelectorAll('#strataTable .chip')].map(c=>c.textContent.trim()).join(' / ')"));
await shot('06-model.png');
await tab('key'); await evaluate("document.querySelector('#nodeCard [data-act=walk]').click(); document.querySelectorAll('#findList .frow')[1] && (document.querySelector('#tabs button[data-tab=find]').click(), document.querySelectorAll('#findList .frow')[1].click()); 'ok'"); await sleep(800);
await evaluate("document.querySelector('#nodeCard [data-act=walk]').click(); document.querySelector('#tabs button[data-tab=key]').click(); document.getElementById('wRun').click(); document.getElementById('recBtn').click(); 'ok'"); await sleep(2500);
console.log('key   :', await evaluate("document.getElementById('keyLine').innerText + ' · ' + document.getElementById('witLine').innerText.slice(0, 90)"));
await shot('07-key-walk.png');
await tab('doors'); await sleep(500); await shot('08-doors.png');
// import a fixture key (the /star "nature" preset palette, three lit vertices) and look at it on the globe and on the star
await evaluate("window.__importKey({ name:'review fixture · nature', version:1, palette:{ cool:'#0f7a4d', warm:'#e8b13a', sword:'#7fffd4', mage:'#cde86a' }, lit:[6,7,22,45], packets:{ root:'sha256:0', count:0 }, source:{ kind:'fixture' } }); 'ok'");
await sleep(1500); await tab('key'); await fold(0); await sleep(1200); await shot('09-key-import-globe.png');
await fold(2); await sleep(1800); await shot('10-key-import-star.png');
console.log('import:', await evaluate("document.getElementById('kImported').innerText.slice(0, 160)"));
console.log('errors:', errors.length ? errors.join(' | ') : 'none');
if (logs.length) console.log('logs  :', logs.slice(0, 8).join(' | '));
ws.close(); chrome.kill();
