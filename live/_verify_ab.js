/* live/_verify_ab.js — 2026-10-26 第二十七次 第 2 點：大螢幕 的 ⚔ 階級 能力（✍ 同學 出 的 題、🧑‍🏫 小老師、⭐ 傳說戰神 一個月 選 1 次 遊戲）。只印失敗項和一行總結。
 *   node live/_verify_ab.js
 * 假 的 成績系統（score/_gas_stub.js 跑 真的 Code.gs）、假 的 Firebase（網頁 裡 的 LDB 換掉）；絕對 不 連 真的。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const { make } = require('../score/_gas_stub.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec', PW = 'pw-verify', E = []; let n = 0, HTTP = '';
function serve() { return new Promise(ok => { const s = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); }); s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; ok(s); }); }); }
(async () => {
  const srv = await serve(), br = await chromium.launch();
  for (const vp of [[1920, 1080], [1024, 768]]) { const tag = vp.join('×');
    const G = make({ TEACHER_PW: PW });
    G.books['角色'].d.push(['30401', JSON.stringify({ tr: 3, trt: [1, 2, 3] }), new Date()], ['30402', JSON.stringify({ tr: 4, trt: [1, 2, 3, 4] }), new Date()], ['30403', JSON.stringify({ tr: 5, trt: [1, 2, 3, 4, 5] }), new Date()]);
    G.post({ a: 'qsub', id: '30401', zh: '我 是 Amy。', o: ["I'm Amy.", "I'm nine.", "You're Amy.", 'My Amy.'] }); const k = G.post({ a: 'teacher', pw: PW }).qsub[0].k; G.post({ a: 'qok', pw: PW, k, v: 1 });
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 50)); r.abort(); });
    await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); Object.defineProperty(window, 'LIVE_DB', { get: () => 'https://fake.test', set: () => {}, configurable: true }); }, URL0);
    await ctx.route(/fake\.test/, r => r.fulfill({ contentType: 'application/json', body: 'null' }));
    await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
      await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
    const h = await ctx.newPage(); const errs = []; h.on('pageerror', e => errs.push(e.message));
    await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(400);
    await h.evaluate(() => { window.__w = []; LDB.get = () => Promise.resolve(null); LDB.must = (m, p, v) => { window.__w.push([m, p, v]); return Promise.resolve(true); }; });
    await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(500);
    await h.click('[data-sc="304"]'); await h.waitForTimeout(300); await h.click('[data-qg="3"]'); await h.waitForTimeout(300);
    /* ✍ 同學 出 的 題 */
    n++; const sq = await h.evaluate(() => ({ b: [].map.call(document.querySelectorAll('[data-sb]'), x => x.textContent).filter(t => /同學 出 的 題/.test(t)), t: (GR['3sq'] || { qs: [] }).qs.map(q => q.t) }));
    if (sq.b.length !== 1 || !/1 題/.test(sq.b[0]) || !/出題人：304 班 1 號/.test(sq.t[0] || '')) E.push(tag + ' 題目 沒有「✍ 同學 出 的 題」 ' + JSON.stringify(sq));
    /* ⭐ 傳說戰神（304 班 3 號 ★★★★★）*/
    n++; const lg = await h.$('#lgGo'); if (!lg) E.push(tag + ' 沒有〔⭐ 讓 傳說戰神 選 遊戲〕'); else {
      await lg.click(); await h.waitForTimeout(300); n++; const pk = await h.evaluate(() => ({ on: !document.getElementById('chpk').hidden, n: document.querySelectorAll('[data-lpk]').length, t: document.querySelector('#chpk h1').textContent }));
      if (!pk.on || pk.n < 10 || !/3 號/.test(pk.t)) E.push(tag + ' 傳說戰神 選 遊戲 畫面 ' + JSON.stringify(pk));
      await h.click('[data-lpk="race"]'); await h.waitForTimeout(300);
      n++; const w = await h.evaluate(() => window.__w.filter(x => /\/leg$/.test(x[1])).pop()); if (!w || w[2].game !== 'race' || !/^\d{4}-\d{1,2}$/.test(w[2].m) || (await h.evaluate(() => H.game)) !== 'race') E.push(tag + ' 傳說戰神 選 了 沒有 記下來 ' + JSON.stringify(w));
      await h.waitForTimeout(2800); n++; if (!/這個 月 傳說戰神 已經 選過/.test(await h.evaluate(() => document.getElementById('hset').textContent))) E.push(tag + ' 選過 以後 沒有 寫「這個 月 已經 選過」'); }
    /* 🧑‍🏫 小老師：公布 答案 的 時候 才 有；只 列 ★★★★ 以上 */
    await h.evaluate(() => { H.pl = { '30401': 1, '30402': 1, '30403': 1 }; H.phase = 'q'; ctl(); });
    n++; if (!(await h.evaluate(() => document.getElementById('htut').hidden))) E.push(tag + ' 答題 中 就 有〔🧑‍🏫 請 小老師〕');
    await h.evaluate(() => { H.phase = 'rev'; ctl(); scr('hq'); });
    n++; if (await h.evaluate(() => document.getElementById('htut').hidden)) E.push(tag + ' 公布 答案 沒有〔🧑‍🏫 請 小老師〕'); else {
      await h.click('#htut'); await h.waitForTimeout(300); const t1 = await h.evaluate(() => [].map.call(document.querySelectorAll('[data-tut]'), b => b.getAttribute('data-tut')));
      n++; if (t1.join() !== '30402,30403') E.push(tag + ' 小老師 名單 不對（要 ★★★★ 以上）' + t1.join());
      await h.click('[data-tut="30402"]'); await h.waitForTimeout(300); n++; const t2 = await h.evaluate(() => { const o = document.getElementById('tutov'); return { t: o.textContent, z: parseFloat(getComputedStyle(o.querySelector('h1')).fontSize) }; });
      if (!/小老師：304 班 2 號/.test(t2.t) || !/為什麼/.test(t2.t) || t2.z < 34) E.push(tag + ' 小老師 全螢幕 不對 ' + JSON.stringify(t2).slice(0, 120));
      await h.click('#tutx'); }
    n++; if (errs.length) E.push(tag + ' JS 錯誤 ' + errs.slice(0, 2).join('｜'));
    await ctx.close(); }
  await br.close(); srv.close();
  E.forEach(x => console.log('✗ ' + x)); console.log((E.length ? '✗' : '✓') + ' 現場任務 階級 能力 量了 ' + n + ' 項，失敗 ' + E.length + ' 項'); process.exit(E.length ? 1 : 0);
})();
