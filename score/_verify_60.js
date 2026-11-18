/* score/_verify_60.js — 2026-11-18 第六十次 老師 6：〔🔎 找 成績〕找不到 400 班 昨天 成長測驗 的 兩次 成績
 *   假伺服器＋假資料（名單「測試」），絕對 不 送 真的 成績表。上面 年級 選 三年級（預設），不 打 字：
 *   ① ⚡ 現場 任務 看得到 400 班（四年級）的 成長測驗　② 同 一天 兩次 ＝ 兩張 卡「第 1 次」「第 2 次」　③〔三年級〕按鈕 ＝ 看不到 400、〔四年級〕＝ 看得到
 *   node score/_verify_60.js   只 印 失敗 */
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const { make } = require('./_gas_stub.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec', PW = 'pw-v60';
let n = 0; const bad = []; const ok = (c, m) => { n++; if (!c) bad.push(m); };
(async () => {
  const G = make({ TEACHER_PW: PW }), now = Date.now(), y = Date.parse(new Date(now + 288e5 - 864e5).toISOString().slice(0, 10) + 'T10:00:00+08:00'); let u = 0;
  for (let s = 1; s <= 6; s++) { const id = '400' + String(s).padStart(2, '0'); G.books['名單'].d.push(['400', s, '測試' + s]);
    [0, 50 * 6e4].forEach((dt, k) => G.post({ a: 'rec', r: { id, set: 'g4gm_g3m-g25', name: '📝 成長測驗 25 題', m: 'q', raw: 0, src: 'school', dev: 'x', u: 'u' + (u++), t: y + dt + s * 3e4,
      qs: Array.from({ length: 10 }, (_, i) => (o => [o, o ? 0 : 1, 4, 0, .6, i])(i < 5 + k * 3 ? 1 : 0)) } })); }
  for (let s = 1; s <= 4; s++) { const id = '304' + String(s).padStart(2, '0'); G.books['名單'].d.push(['304', s, '測試三' + s]);
    G.post({ a: 'rec', r: { id, set: 'g3gm_g3m-g25', name: '📝 成長測驗 25 題', m: 'q', raw: 0, src: 'school', dev: 'x', u: 'u' + (u++), t: now - 2 * 864e5, qs: Array.from({ length: 10 }, (_, i) => (o => [o, o ? 0 : 1, 4, 0, .6, i])(i < 8 ? 1 : 0)) } }); }
  const srv = require('http').createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript' }[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(o => srv.listen(0, '127.0.0.1', o));
  const br = await chromium.launch(), ctx = await br.newContext({ viewport: { width: 1024, height: 768 } });
  await ctx.route(/firebase|googleapis|gstatic/, r => r.abort());
  await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); }, URL0);
  await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams);
    const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', x => errs.push(x.message));
  await p.goto('http://127.0.0.1:' + srv.address().port + '/teacher/index.html'); await p.fill('#pw', PW); await p.click('#go'); await p.waitForTimeout(1200);
  const L = () => p.$$eval('.sCol.L .sT', a => a.map(e => e.textContent));
  let t = await L();
  ok(t.some(x => /400|課後/.test(x) && /第 1 次/.test(x)) && t.some(x => /第 2 次/.test(x)), '沒 打 字：⚡ 現場 任務 看不到 400 的 兩次（' + t.length + ' 張）');
  ok(t.some(x => /304|三年/.test(x)), '沒 打 字：看不到 304');
  ok(await p.$('[data-sgr="0"].on'), '〔全部 年級〕不是 預設');
  await p.click('[data-sgr="3"]'); await p.waitForTimeout(500); t = await L(); ok(!t.some(x => /第 . 次/.test(x)) && t.length >= 1, '〔三年級〕還 看到 400');
  await p.click('[data-sgr="4"]'); await p.waitForTimeout(500); t = await L(); ok(t.some(x => /第 1 次/.test(x)) && t.some(x => /第 2 次/.test(x)), '〔四年級〕看不到 400 兩次');
  await p.click('.sCol.L .sT.big',{timeout:3000}).catch(()=>{}); await p.waitForTimeout(500); ok(/第 2 次/.test(await p.textContent('#mbox')), '打開 卡 沒寫 第幾 次');
  ok(!errs.length, 'JS 例外：' + errs.join(' | '));
  await br.close(); srv.close();
  bad.forEach(m => console.log('✗ ' + m)); console.log((bad.length ? '❌' : '✅') + ' 第六十次 老師看板 找 成績：' + n + ' 項，' + bad.length + ' 個 失敗');
})();
