// vpk_kwaai_mage/map/tools/reload-check.mjs -- reload the page as a browser that REMEMBERED things.
//
//   node tools/reload-check.mjs
//
// A fresh headless browser never carries localStorage, so a fold or a palette
// remembered from an earlier build can throw on reload without any render
// noticing (2026-09-27: a remembered coverage fold read a const declared
// further down the module -- a TDZ error only real browsers saw). This seeds
// every remembered key, including stale ones, opens a deep link, and prints
// the status line and any exception.

const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe', PORT=9334, sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chrome=spawn(CHROME,['--headless=new','--disable-gpu','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-first-run','--remote-debugging-port='+PORT,'--window-size=1440,900','about:blank'],{stdio:'ignore'});
let t=null; for(let i=0;i<40&&!t;i++){ await sleep(250); try{ t=(await (await fetch(`http://localhost:${PORT}/json`)).json()).find(x=>x.type==='page'); }catch{} }
const ws=new WebSocket(t.webSocketDebuggerUrl); await new Promise(r=>ws.onopen=r); let id=0; const pend=new Map(), errs=[];
ws.onmessage=ev=>{ const m=JSON.parse(ev.data); if(m.id&&pend.has(m.id)){ pend.get(m.id)(m); pend.delete(m.id); } if(m.method==='Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text); };
const send=(method,params={})=>new Promise(r=>{ const i=++id; pend.set(i,r); ws.send(JSON.stringify({id:i,method,params})); });
const ev=async e=>(await send('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true})).result?.result?.value;
await send('Runtime.enable'); await send('Page.enable');
await send('Page.navigate',{url:'http://localhost:8796/'}); await sleep(3000);
await ev("localStorage.setItem('kwaai-map-cov-min','1'); localStorage.setItem('kwaai-map-tab','controls'); localStorage.setItem('kwaai-map-palette', JSON.stringify({cool:'#0f7a4d',warm:'#e8b13a',sword:'#7fffd4',mage:'#cde86a'})); localStorage.setItem('kwaai-map-my-node','anonymous'); localStorage.setItem('kwaai-map-observations', JSON.stringify([{at:'2026-09-27T00:00:00Z',bits:'1'.repeat(32),serving:6,peers:22}])); 'seeded'");
await send('Page.navigate',{url:'http://localhost:8796/?node=12D3KooWAourfFoxBjBiXWHdZjxPAuenuyYLFjxHa1C9zknjYA7A'}); await sleep(6000);
console.log('status:', (await ev("document.getElementById('status').innerText"))?.replace(/\n/g,' | ').slice(0,220));
console.log('cov hidden:', await ev("document.getElementById('coverage').classList.contains('min')"), '· tab:', await ev("document.querySelector('#tabs button.on')?.dataset.tab||'(closed)'"), '· palette cool:', await ev("getComputedStyle(document.documentElement).getPropertyValue('--sword').trim()"));
console.log('errors:', errs.length?errs.join(' | '):'none'); ws.close(); chrome.kill();
