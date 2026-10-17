/* score/_shot_teacher.js — 老師看板拍照（給 AI 看排版用，不是量測）：假伺服器＋假資料（三個班、名單是「測試」），絕對不送到真的成績表
 * OUT=資料夾 VP=1024x768 node score/_shot_teacher.js */
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const { make } = require('./_gas_stub.js'), SC = require('./_calc.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec', PW = 'pw-shot', OUT = process.env.OUT || '/tmp';
function fill(G) {
  const now = Date.now(), sets = ['g3u1_1-1b', 'g3u1_1-1a', 'g3u2_1-1b', 'g3gm_g1', 'g3gm_g3'];
  let u = 0;
  ['304', '307', '311'].forEach((c, ci) => { for (let s = 1; s <= 24; s++) { const id = c + String(s).padStart(2, '0');
    G.books['名單'].d.push([c, s, '測試' + c.slice(2) + s]);
    if (s > 20 - ci * 3) continue;   /* 有幾個人這週沒做 */
    const lv = (s * 7 + ci * 13) % 10;
    for (let k = 0; k < 1 + (s % 4); k++) { const set = sets[(s + k) % sets.length], m = set.indexOf('gm') > 0 ? 'g' : 'q', nq = m === 'g' ? 10 : 5;
      G.post({ a: 'rec', r: { id, set, name: set, m, raw: 3000, src: k % 2 ? 'home' : 'school', dev: 'x', u: 'u' + (u++), t: now - (k * 30 + s) * 36e5 / 4,
        qs: Array.from({ length: nq }, (_, i) => { const ok = i < Math.round(nq * (0.4 + lv / 16)) ? 1 : 0; return [ok, ok ? 0 : 1 + (i % 3), 4, (s % 9 === 0 && i < 3) ? 1 : 0, .6, i]; }) } }); }
    if (s % 3 === 0) G.post({ a: 'rec', r: { id, set: 'g3v_u1', name: '👀 句型卡 Unit 1', m: 'v', sec: 300 + s * 40, src: 'home', dev: 'x', u: 'v' + (u++), t: now - 4e6, qs: [] } });
    if (s % 4 === 0) G.post({ a: 'rec', r: { id, set: 'g3l_u1-t0-0', name: '🎧 聽完字卡 Unit 1・1 基礎', m: 'l', src: 'home', dev: 'x', u: 'l' + (u++), t: now - 3e6, qs: [] } });
  } });
  G.books['班級人數'].d[1][1] = 24;
}
(async () => {
  const G = make({ TEACHER_PW: PW }); fill(G);
  const vp = (process.env.VP || '1024x768').split('x').map(Number);
  const srv = require('http').createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' }[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok));
  const br = await chromium.launch(), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
  await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); }, URL0);
  await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams);
    const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  const p = await ctx.newPage(); p.on('pageerror', x => console.log('JS 例外：' + x.message));
  await p.goto('http://127.0.0.1:' + srv.address().port + '/teacher/index.html'); await p.fill('#pw', PW); await p.click('#go'); await p.waitForTimeout(900);
  const W = vp[0];
  for (const t of (process.env.TABS || 'p,b,c,w,k,t,l').split(',')) { await p.click('#tabs button[data-t="' + t + '"]'); await p.waitForTimeout(1800);
    await p.screenshot({ path: path.join(OUT, W + '_' + t + '.png'), fullPage: !!process.env.FULL }); }
  if (process.env.KA) { await p.click('#tabs button[data-t="k"]'); await p.waitForTimeout(500); await p.click('[data-km="a"]'); await p.waitForTimeout(2200); await p.screenshot({ path: path.join(OUT, W + '_ka.png'), fullPage: !!process.env.FULL });
    await p.click('[data-km="g"]'); await p.waitForTimeout(300); }
  if (process.env.PERSON) { await p.evaluate(id => person(id), process.env.PERSON); await p.waitForTimeout(3500);
    await p.screenshot({ path: path.join(OUT, W + '_person.png'), fullPage: !!process.env.FULL }); await p.click('#pmb'); await p.waitForTimeout(3000); await p.screenshot({ path: path.join(OUT, W + '_person2.png'), fullPage: true }); }
  if (process.env.CER) { await p.evaluate(() => document.getElementById('modal').classList.remove('on')); await p.click('#tabs button[data-t="c"]'); await p.waitForTimeout(400); const b = await p.$('#cerGo'); if (b) { await b.click();
    let last = 0; for (const t of (process.env.CERT || '1500,3500,6500,9000').split(',').map(Number)) { await p.waitForTimeout(t - last); last = t; await p.screenshot({ path: path.join(OUT, W + '_cer' + t + '.png') }); } } }
  await br.close(); srv.close();
})();
