/* phonics/_verify_62.js — 第六十二次 量測（只 印 失敗＋一行 總結）。node phonics/_verify_62.js
 * ① 聲音：ㄛ、短 oo、b ＝ 老師 錄音；qu 變 短 ② 常見 拼字 組合：19 個 課本 字、延伸 字 都 有 聲音、strong 的 str 金框＋ng 水藍框、點 ng ＝ 唸 ng、〔✖ 關閉〕真的 關
 * ③ 總首頁：Unit 1 Unit 2 一區、自然發音 大 按鈕 ≧ 15px、不 超出 ④ 拼音 地圖〔ㄅㄆㄇ 注音 順序〕三顆、順序 對、每 顆 有 注音 ⑤ 44 音 字卡 頁（sounds.html）*/
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = '';
const ok = (c, m) => { n++; if (!c) E.push(m); };
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
const AU = p => path.join(__dirname, 'au', p + '.mp3'), LI = p => path.join(ROOT, 'listen', '2026-11-19_P62', p + '.mp3'), eq = (a, b) => fs.readFileSync(a).equals(fs.readFileSync(b));
['s_ao_T', 's_oo_T', 's_b_T', 's_kw_D'].forEach(c => ok(eq(AU(c.split('_').slice(0, 2).join('_')), LI(c)), '網站 聲音 沒有 換：' + c));
['s_ao', 's_oo', 's_b', 's_kw'].forEach(c => ok(!eq(AU(c), LI('v61/' + c)), c + ' 跟 舊 的 一樣'));
ok(fs.statSync(AU('s_kw')).size < fs.statSync(LI('v61/s_kw')).size, 'qu 沒有 變 短');
const LH = fs.readFileSync(path.join(ROOT, 'listen', '2026-11-19_P62', 'index.html'), 'utf8'); ['s_ao_T', 's_oo_T', 's_b_T', 's_kw_D'].forEach(c => ok(LH.indexOf(c) >= 0, '試聽頁 沒有 ' + c));
['teacher_b', 'teacher_ao', 'teacher_oo_short'].forEach(f => ok(fs.existsSync(path.join(ROOT, 'ref', 'audio', f + '.mp3')), 'ref 沒有 ' + f));
const B = require('./_book.js'); ok(Object.keys(B.COMBO).length >= 19, '常見 拼字 組合 不到 19 個 課本 字');
Object.values(B.COMBO).forEach(L => L.forEach(x => { ok(fs.existsSync(AU(x.au)), '沒有 組合 聲音 ' + x.au); x.ex.forEach(e => ok(B.WX[e] && fs.existsSync(AU(B.WX[e].au)), '延伸 字 沒有 聲音 ' + e)); }));
const HUB = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok((HUB.match(/Unit 1　Unit 2/g) || []).length === 2, '總首頁 沒有 兩個「Unit 1　Unit 2」區');
async function run(br, vp) { const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: true });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
  await ctx.addInitScript(() => { window.__PHFAST = 1; window.__PHSAY = []; window.__PHNOLOGIN = 1; Object.defineProperty(window, 'SCORE_URL', { get: () => '', set: () => {}, configurable: true }); });
  const errs = [], pg = async u => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(u + '：' + e.message)); await p.goto(HTTP + '/' + u); await p.waitForTimeout(400); return p; };
  /* ③ 總首頁 */
  { const p = await pg('index.html'); const r = await p.evaluate(() => { const u = [...document.querySelectorAll('.gi.u12')], ph = [...document.querySelectorAll('.phg a')];
      const bad = ph.filter(a => parseFloat(getComputedStyle(a).fontSize) < 15).length, ov = ph.filter((a, i) => ph.some((b, j) => j > i && (() => { const A = a.getBoundingClientRect(), Bq = b.getBoundingClientRect(); return A.left < Bq.right - 1 && Bq.left < A.right - 1 && A.top < Bq.bottom - 1 && Bq.top < A.bottom - 1; })())).length;
      const ub = u.map(x => [...x.querySelectorAll('.gb a')].every(a => a.getBoundingClientRect().right <= x.getBoundingClientRect().right + 1));
      return { u: u.length, ph: ph.length, bad, ov, ub: ub.every(Boolean), sx: document.documentElement.scrollWidth > innerWidth + 1, n: [...document.querySelectorAll('.gr:not(.phm) .gi')].length }; });
    ok(r.u === 2 && r.n === 16, tag + ' 總首頁 Unit 區 不對 ' + JSON.stringify(r)); ok(r.ph >= 9 && !r.bad && !r.ov, tag + ' 自然發音 按鈕 太 小／重疊 ' + JSON.stringify(r)); ok(r.ub && !r.sx, tag + ' 總首頁 超出 ' + JSON.stringify(r));
    const links = await p.evaluate(() => [...document.querySelectorAll('.phg a,.gi.u12 a')].map(a => a.getAttribute('href')));
    links.forEach(h => ok(/^https?:/.test(h) || fs_exists(h), tag + ' 連結 不 存在 ' + h)); await p.close(); }
  /* ② 常見 拼字 組合 */
  { const p = await pg('phonics/games.html?book=3'); const r = await p.evaluate(async () => { const o = {}; window.__PHSAY = []; PHG.cxOpen('strong'); await new Promise(r => setTimeout(r, 300));
      const M = document.getElementById('cxM'), g = [...M.querySelectorAll('.bgp')]; o.gold = g.filter(x => x.classList.contains('cxg')).map(x => x.textContent.trim()[0]).join(''); o.cyan = g.filter(x => x.classList.contains('cxg2')).length;
      const ng = g.find(x => x.classList.contains('cxg2')); window.__PHSAY = []; ng.click(); await new Promise(r => setTimeout(r, 120)); o.say = (window.__PHSAY || []).join(); o.on = ng.classList.contains('cxon');
      document.getElementById('cxX').click(); await new Promise(r => setTimeout(r, 60)); o.closed = getComputedStyle(document.getElementById('cxp')).display === 'none';
      o.all = []; for (const w of Object.keys(PHG.BOOK.COMBO)) { PHG.cxOpen(w); await new Promise(r => setTimeout(r, 30)); const n = document.querySelectorAll('#cxM .cxg,#cxM .cxg2').length; if (!n) o.all.push(w); document.getElementById('cxX').click(); }
      return o; });
    ok(r.gold === 'str' || r.gold.length >= 3, tag + ' strong 的 str 沒有 金框 ' + r.gold); ok(r.cyan >= 1, tag + ' strong 的 ng 沒有 水藍框'); ok(/s_ng/.test(r.say) && r.on, tag + ' 點 ng 沒有 唸 ng ' + r.say);
    ok(r.closed, tag + '〔✖ 關閉〕關 不 起來'); ok(!r.all.length, tag + ' 沒有 框 的 字：' + r.all); await p.close(); }
  /* ④ 注音 順序 */
  { const p = await pg('phonics/map.html#map'); const r = await p.evaluate(async () => { const o = {}; o.btn = document.querySelectorAll('[data-zo]').length;
      for (const k of ['o', 'v', 'c']) { document.querySelector('[data-zo="' + k + '"]').click(); await new Promise(r => setTimeout(r, 60)); }
      const col = id => [...document.querySelectorAll(id + ' .chip.zc')]; o.on = col('#mOn').map(b => b.dataset.mv).join(' '); o.co = col('#mCo').map(b => b.dataset.mv).join(' '); o.v = col('#mV').map(b => b.dataset.mv).join(' ');
      o.zy = col('#mOn').filter(b => b.dataset.mv !== '無').every(b => b.querySelector('.zy').textContent.trim().length > 0);
      o.big = [...document.querySelectorAll('.zob')].every(b => b.getBoundingClientRect().height >= 40);
      document.getElementById('lvA').click(); await new Promise(r => setTimeout(r, 60)); o.vA = col('#mV').map(b => b.dataset.mv).join(' ');
      for (const k of ['o', 'v', 'c']) document.querySelector('[data-zo="' + k + '"]').click(); document.getElementById('lvB').click(); return o; });
    ok(r.btn === 3 && r.big, tag + ' 注音 順序 按鈕 不是 3 顆 ' + r.btn); ok(/^無 b p m f d t n l g c k h j ch sh r z s/.test(r.on), tag + ' 字首 順序 錯 ' + r.on); ok(/^無 b p m f ff d t n l ll g k x dge ch tch sh z s ss ng th ve$/.test(r.co), tag + ' 字尾 順序 錯 ' + r.co);
    ok(r.v === 'e a i u o', tag + ' 基礎 母音 順序 錯 ' + r.v); ok(/^e ai a_e ay a ou ow2 ea ee i u_e oo oo2 u o_e oa ow/.test(r.vA), tag + ' 進階 母音 順序 錯 ' + r.vA); ok(r.zy, tag + ' 字首 沒有 注音'); await p.close(); }
  /* ⑤ 44 音 字卡：13 個 主題、46 部 動畫 每 一部 演完、不 超出；13 個 遊戲 每 個 5 題 玩完 */
  { const p = await pg('phonics/sounds.html'); const r = await p.evaluate(async () => { const o = { bad: [], over: [] }; o.tab = !document.getElementById('s_snd').hidden; o.th = document.querySelectorAll('.sdthb').length; o.n = PHSND.SDLIST.length;
      for (let i = 0; i < o.n; i++) { PHSND.sdCard(i); await PHSND.sdPlay(i); const st = document.getElementById('sdStage'); if (!st.querySelector('.sdend')) o.bad.push(i + 1);
        const W = innerWidth; [...st.querySelectorAll('.sp,.sdtile,.wrow,.sdcap,.sdcue')].forEach(e => { const q = e.getBoundingClientRect(); if (q.right > W + 1 || q.left < -1) o.over.push(i + 1); }); }
      o.big = parseFloat(getComputedStyle(document.querySelector('#sdStage .sdcap')).fontSize); o.sx = document.documentElement.scrollWidth > innerWidth + 1; return o; });
    ok(r.tab && r.th === 13 && r.n === 46, tag + ' 44 音 字卡 頁 不對 ' + JSON.stringify(r)); ok(!r.bad.length, tag + ' 動畫 沒 演完：' + r.bad); ok(!r.over.length, tag + ' 動畫 超出 畫面：' + [...new Set(r.over)]); ok(r.big >= 24 && !r.sx, tag + ' 字 太 小／橫向 超出');
    for (let i = 0; i < 13; i++) { const g = await p.evaluate(async i => { const o = {}; PHSND.start('sd' + i); await new Promise(r => setTimeout(r, 120)); o.rev = !!document.getElementById('grevS') || !!document.getElementById('grevB'); const b = document.getElementById('gGo'); if (b) b.click(); await new Promise(r => setTimeout(r, 1300));
        for (let q = 0; q < 5; q++) { let G = PHSND.G(); for (let w = 0; w < 40 && G && (G.Q.length < q || G.lock === G.q); w++) { await new Promise(r => setTimeout(r, 100)); G = PHSND.G(); } if (!G || !G.hk) { o.stuck = q; break; } (q % 2 ? G.hk.no : G.hk.ok)(); for (let w = 0; w < 40 && G.Q.length <= q; w++) await new Promise(r => setTimeout(r, 100)); await new Promise(r => setTimeout(r, 250)); }
        const G = PHSND.G(); o.q = G && G.Q.length; o.ok = G && G.ok; o.idx = G && G.Q.every(x => x[5] >= 0 && x[5] < 44); o.end = /答對/.test(document.getElementById('gbody').textContent); document.getElementById('gx').click(); return o; }, i);
      ok(g.q === 5 && g.ok === 3 && g.idx && g.end && g.rev, tag + ' 遊戲 sd' + i + ' 不對 ' + JSON.stringify(g)); }
    await p.close(); }
  { const HOST = fs.readFileSync(path.join(ROOT, 'live', 'host.html'), 'utf8'); for (let i = 0; i < 13; i++) ok(HOST.indexOf("'sd" + i + "'") >= 0, '現場任務 沒有 sd' + i); }
  { const BK = fs.readFileSync(path.join(ROOT, 'teacher', 'index.html'), 'utf8'); ok(BK.indexOf('g3gm_ph-sd12') >= 0 && BK.indexOf('g4gm_ph-sd0') >= 0, '老師看板 沒有 44 音 遊戲 題組'); }
  errs.forEach(e => E.push(tag + ' 錯誤：' + e)); await ctx.close(); }
global.fs_exists = h => fs.existsSync(path.join(ROOT, decodeURIComponent(h.split('?')[0].split('#')[0])));
(async () => { const s = await serve(); const br = await chromium.launch();
  await br.newContext().then(c => c.close());
  const exposeFs = async () => {}; await exposeFs();
  for (const vp of [[1024, 768], [820, 1180]]) await run(br, vp);
  await br.close(); s.close(); E.forEach(e => console.log('❌ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第六十二次：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
