/* score/_verify_rw.js — 2026-10-25 第二十五次：老師看板〔🎁 全班 獎勵〕5 張大卡＋整頁＋🏆 頒獎典禮、〔📊 最受歡迎〕；伺服器 全班獎勵 自動發（兩個目標、照天數）。只印失敗項和一行總結。
 *   node score/_verify_rw.js
 * 假伺服器：score/_gas_stub.js 跑「真的」score/Code.gs；名單、姓名都是假的（測試NN）；不連真的成績表。三種尺寸：1024×768、820×1180、1920×1080。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const { make } = require('./_gas_stub.js'), SC = require('./_calc.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec', PW = 'pw-verify';
const VPS = [[1024, 768], [820, 1180], [1920, 1080]];
let fails = 0, n = 0;
const out = (w, e) => { if (e.length) { fails += e.length; console.log('✗ ' + w); e.forEach(x => console.log('   ' + x)); } };
const NOW = Date.now(), W0 = SC.weekStart(NOW), LW = W0 - 7 * 864e5, TODAY = Math.min(6, SC.day(NOW) - SC.day(W0));
function rec(G, id, t, k) { G.post({ a: 'rec', r: { id, set: 'g3u1_1-1b', name: 's', raw: 4000, src: 'home', dev: 'x', u: 'rw' + id + '_' + k, t, qs: [0, 1, 2, 3, 4].map(() => [1, 0, 2 + (+id.slice(3)) * .3, 0, 1.5]) } }); }
/* 304 班 30 人：上週 1～24 號 練 2 天（1 號 練 5 天）、25～30 號 沒練 ➜ 目標 ①；這週 1～3 號 今天 練 */
function seed() {
  const G = make({ TEACHER_PW: PW });
  for (let s = 1; s <= 30; s++) G.books['名單'].d.push(['304', s, '測試' + String(s).padStart(2, '0')]);
  for (let s = 1; s <= 24; s++) { const id = '304' + String(s).padStart(2, '0'), d = s === 1 ? 5 : 2; for (let k = 0; k < d; k++) rec(G, id, LW + k * 864e5 + 10 * 36e5, 'L' + k); }
  for (let s = 1; s <= 3; s++) rec(G, '304' + String(s).padStart(2, '0'), W0 + TODAY * 864e5 + 60e3, 'N');
  const R = G.books['角色'];
  const st = (h, w, p, s, q) => JSON.stringify(Object.assign({ own: { h: [h], w: [w], p: [p], t: [], s: s ? [s] : [] }, eq: { h, w, p, t: [], s: s ? { au: s } : {} }, spent: 0 }, q || {}));
  R.d.push(['30401', st('b37', 'w03', 'p03', 's0101', { qz: SC.RPQV, qzt: NOW - 6e5, cq: SC.RPCQV, cqt: NOW - 5e5 }), NOW]);
  R.d.push(['30402', st('b37', 'w05', 'p03', '', { qz: SC.RPQV, qzt: NOW - 6e5 }), NOW]);
  R.d.push(['30403', st('g32', 'w03', 'p08', '', {}), NOW]);
  return G;
}
/* 伺服器：全班獎勵 自動發（1 號 練 5 天 ＝ 🪙 225 ⭐ 130；25 號 沒練 ＝ 沒有；同一週 只 發 一次）；冠軍寶箱 ＝ 🪙 250 ⭐ 150 */
function server() { const e = [], G = seed();
  const v1 = G.get({ a: 'rpg', id: '30401' }).v, b1 = (v1.st.bk || []).filter(k => /^cw\|/.test(k));
  const a5 = SC.cwAmt(1, 5); if (!b1.length || v1.st.bc < a5.c || v1.st.bx < a5.x) e.push('1 號 上週 練 5 天、全班 8 成 達到 ➜ 沒有 拿到 🪙 ' + a5.c + ' ⭐ ' + a5.x + '：' + JSON.stringify({ bk: v1.st.bk, bc: v1.st.bc, bx: v1.st.bx }));
  const v1b = G.get({ a: 'rpg', id: '30401' }).v; if (v1b.st.bc !== v1.st.bc) e.push('全班獎勵 同一週 發了 兩次');
  const v25 = G.get({ a: 'rpg', id: '30425' }).v; if ((v25.st.bk || []).some(k => /^cw\|/.test(k)) || v25.st.bc) e.push('25 號 上週 沒練 也 拿到 全班獎勵');
  const v2 = G.get({ a: 'rpg', id: '30402' }).v, a2 = SC.cwAmt(1, 2); if (v2.st.bc < a2.c) e.push('2 號 練 2 天 沒有 拿到 🪙 ' + a2.c);
  n += 4; out('伺服器 全班獎勵', e); return G; }
let HTTP = '';
function serve() { return new Promise(ok => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.css': 'text/css' };
  const s = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; ok(s); }); }); }
async function teacher(br, vp) {
  const G = seed(), e = [], W = 'teacher 全班獎勵 @' + vp.join('x'), big = vp[0] >= 1900 ? 22 : 18;
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
  await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); try { localStorage.setItem('hsnd', '0'); } catch (x) { } }, URL0);
  await ctx.route(/firebasedatabase\.app|firebaseio\.com/, r => r.abort());
  await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  const p = await ctx.newPage(); p.on('pageerror', x => e.push('JS 例外：' + x.message));
  await p.goto(HTTP + '/teacher/index.html'); await p.waitForTimeout(300); await p.fill('#pw', PW); await p.click('#go'); await p.waitForTimeout(600);
  await p.click('#tabs button[data-t="r"]'); await p.waitForTimeout(900);
  const c0 = await p.evaluate(fs0 => { const C = [].map.call(document.querySelectorAll('.rwcard'), b => ({ k: b.getAttribute('data-rwk'), h: b.getBoundingClientRect().height, t: b.textContent })), sm = [];
    document.querySelectorAll('.rwcard b,.rwcard em,.rwcard small,.rwhd').forEach(x => { const z = parseFloat(getComputedStyle(x).fontSize); if (z < fs0) sm.push(x.textContent.slice(0, 10) + ' ' + z); });
    return { C, sm, ox: document.documentElement.scrollWidth > innerWidth + 1 }; }, big);
  if (c0.C.map(x => x.k).join() !== 'cw,ch,cp,qz,cq') e.push('全班獎勵 不是 5 張 大卡：' + c0.C.map(x => x.k).join());
  if (c0.C.some(x => x.h < 200)) e.push('大卡 太小');
  if (c0.sm.length) e.push('大卡 字 太小：' + c0.sm.slice(0, 3).join('｜')); if (c0.ox) e.push('大卡 橫向溢出'); n += 4;
  for (const k of ['cw', 'ch', 'cp', 'qz', 'cq']) {
    await p.click('.rwcard[data-rwk="' + k + '"]'); await p.waitForTimeout(400);
    if (k === 'cw') { await p.click('[data-rww="last"]'); await p.waitForTimeout(300); }
    const r = await p.evaluate(fs0 => { const P = document.getElementById('rwp'), sm = [], ov = [];
      P.querySelectorAll('h2,h3,.rwrule small,.rwgo>div,.rwnm,.rwl em,.rwsel button,.rwbtn,.rwnone').forEach(x => { if (!x.getBoundingClientRect().width) return; const z = parseFloat(getComputedStyle(x).fontSize); if (z < fs0) sm.push(x.textContent.slice(0, 10) + ' ' + z); });
      P.querySelectorAll('.rwper').forEach(x => { if (x.scrollWidth > x.clientWidth + 2) ov.push(x.textContent.slice(0, 16)); });
      const ok = [].map.call(P.querySelectorAll('.rwok .rwper'), x => x.textContent), no = [].map.call(P.querySelectorAll('.rwno .rwper'), x => x.textContent);
      return { on: P.classList.contains('on'), ok, no, sm, ov, ox: document.getElementById('rwpb').scrollWidth > document.getElementById('rwpb').clientWidth + 1, rule: P.querySelectorAll('.rwrule span').length, cer: !!document.getElementById('rwcer') }; }, big);
    if (!r.on) { e.push(k + '：點 大卡 沒有 開 整頁'); continue; }
    if (r.sm.length) e.push(k + '：整頁 字 太小：' + r.sm.slice(0, 3).join('｜')); if (r.ov.length || r.ox) e.push(k + '：整頁 超出：' + r.ov.slice(0, 2).join('｜'));
    if (r.rule < 3) e.push(k + '：上面 沒有 一步一步 的 圖示 規則');
    if ([...r.ok, ...r.no].some(t => !/測試\d\d/.test(t) && !/名單 沒有/.test(t))) e.push(k + '：有人 沒有 中文 名字');
    if (k === 'cw') { if (r.ok.length !== 24 || r.no.length !== 6) e.push('cw 上週：做到 要 24 人、還沒 6 人：' + r.ok.length + '／' + r.no.length);
      const one = r.ok.find(t => /測試01/.test(t)) || ''; if (!/練了 5 天/.test(one) || !/225/.test(one) || !/✅/.test(one)) e.push('cw：1 號 沒有 寫 練了 5 天、🪙 225：' + one.slice(0, 80));
      const z = r.no.find(t => /測試25/.test(t)) || ''; if (!/還差 2 天/.test(z)) e.push('cw：25 號 沒有 寫 還差 2 天：' + z.slice(0, 60)); n += 3; }
    if (k === 'qz' && (r.ok.length !== 2 || !r.ok.every(t => /測試0[12]/.test(t)))) e.push('qz：看懂 規則 要 是 1、2 號：' + r.ok.length);
    if (k === 'cq' && (r.ok.length !== 1 || !/測試01/.test(r.ok[0] || '') || r.no.length !== 29)) e.push('cq：看懂 全班獎勵 要 是 1 號（還沒 29 人）：' + r.ok.length + '／' + r.no.length);
    if (k === 'ch' && (!r.ok.length || r.ok.length > 5)) e.push('ch：冠軍寶箱 前 5 名 人數 不對：' + r.ok.length);
    if (r.ok.length && !r.cer) e.push(k + '：有人 做到 卻 沒有〔🏆 頒獎〕');
    n += 6;
    /* 🏆 頒獎典禮：開場 ➜ 第 1 個 人（名字 大、做到 的 事 一樣一樣 亮）➜ … ➜ 榮譽牆 */
    if (r.cer && (k === 'cw' || k === 'qz')) {
      await p.click('#rwcer'); await p.waitForTimeout(3600);
      const s0 = await p.evaluate(() => ({ on: document.getElementById('rwc').classList.contains('on'), t: document.getElementById('rwcs').textContent }));
      if (!s0.on || !/頒獎典禮/.test(s0.t) || !/位 同學 做到/.test(s0.t)) e.push(k + '：頒獎典禮 開場 不對：' + s0.t.slice(0, 60));
      await p.click('#rwcnx'); await p.waitForTimeout(4200);
      const s1 = await p.evaluate(() => { const S = document.getElementById('rwcs'), nmE = S.querySelector('.rwnm'), r = S.getBoundingClientRect(), o = [];
        S.querySelectorAll('.rwc1 *').forEach(x => { const b = x.getBoundingClientRect(); if (b.width && (b.right > r.right + 2 || b.left < r.left - 2 || b.bottom > r.bottom + 2)) o.push(x.className || x.tagName); });
        return { nm: nmE ? nmE.textContent : '', z: nmE ? parseFloat(getComputedStyle(nmE).fontSize) : 0, ems: S.querySelectorAll('.rwc1 .rwl em').length, op: [].filter.call(S.querySelectorAll('.rwc1 .rwl>span'), x => +getComputedStyle(x).opacity > .9).length, o: o.slice(0, 3), med: !!S.querySelector('.med') }; });
      if (!/測試\d\d/.test(s1.nm) || s1.z < 50 || !s1.med || s1.ems < 2 || s1.op < 2) e.push(k + '：頒獎 一個人 那一幕 不對（名字 大、獎牌、做到 的 事）：' + JSON.stringify(s1));
      if (s1.o.length) e.push(k + '：頒獎 那一幕 超出 畫面：' + s1.o.join('｜'));
      await p.evaluate(() => { RWC.i = RWC.o.done.length + 1; rwcShow(); }); await p.waitForTimeout(1800);
      const s2 = await p.evaluate(() => ({ w: document.querySelectorAll('#rwcs .wall>span').length, t: document.getElementById('rwcs').textContent, n: RWC.o.done.length }));
      if (s2.w !== s2.n || !/下一個 就是 你/.test(s2.t)) e.push(k + '：榮譽牆 不對：' + JSON.stringify(s2).slice(0, 80));
      await p.click('#rwcx'); await p.waitForTimeout(200); n += 4; }
    await p.click('#rwx'); await p.waitForTimeout(200);
  }
  /* 📊 最受歡迎 */
  await p.click('#tabs button[data-t="f"]'); await p.waitForTimeout(800);
  const f1 = await p.evaluate(() => { const R = [].map.call(document.querySelectorAll('.fvr'), x => ({ v: +x.querySelector('.fvv').textContent.replace(/\D/g, ''), img: x.querySelector('img').src.split('/').pop() })); return { R, ox: document.documentElement.scrollWidth > innerWidth + 1 }; });
  const ids = f1.R.map(x => x.img.replace('.jpg', ''));
  if (f1.R.length !== 28 || f1.R[0].img !== 'b37.jpg' || f1.R[0].v !== 2 || ids.some(x => /^b(0\d|1[0-6])$/.test(x))) e.push('最受歡迎 男戰士：要 28 個、第 1 名 男 37（2 人 買過）、沒有 下架 的：' + JSON.stringify(f1.R.slice(0, 2)) + ' ' + f1.R.length);
  if (f1.R.some((x, i) => i && x.v > f1.R[i - 1].v)) e.push('最受歡迎 沒有 從 多 排到 少'); if (f1.ox) e.push('最受歡迎 橫向溢出');
  await p.click('[data-fvk="w"]'); await p.click('[data-fvm="e"]'); await p.waitForTimeout(500);
  const f2 = await p.evaluate(() => [].map.call(document.querySelectorAll('.fvr'), x => [x.querySelector('img').src.split('/').pop(), +x.querySelector('.fvv').textContent.replace(/\D/g, '')]));
  if (!f2.length || f2[0][0] !== 'w03.jpg' || f2[0][1] !== 2 || f2.length !== 30) e.push('最受歡迎 武器（正在用）：第 1 名 要 w03（2 人）、30 個：' + JSON.stringify(f2.slice(0, 2)));
  await p.click('[data-fvk="s"]'); await p.waitForTimeout(500);
  const f3 = await p.evaluate(() => ({ n: document.querySelectorAll('.fvr').length, a: (document.querySelector('.fvr img') || {}).src || '', bad: [].filter.call(document.querySelectorAll('.fvr img'), i => i.complete && !i.naturalWidth).length }));
  if (f3.n !== 200 || !/s0101/.test(f3.a)) e.push('最受歡迎 商城寶物：要 200 個、第 1 名 s0101：' + JSON.stringify(f3));
  n += 5;
  out(W, e); await ctx.close();
}
(async () => {
  server();
  const srv = await serve(), br = await chromium.launch();
  for (const vp of VPS) await teacher(br, vp);
  await br.close(); srv.close();
  console.log((fails ? '✗' : '✓') + ' 全班獎勵＋最受歡迎 量了 ' + n + ' 項，失敗 ' + fails + ' 項');
  process.exit(fails ? 1 : 0);
})();
