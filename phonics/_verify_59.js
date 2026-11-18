/* phonics/_verify_59.js — 第五十九次 新 東西 的 量測（只 印 失敗 項＋一行 總結）。node phonics/_verify_59.js
 * ① 拼音 地圖：子音 和 母音 新 段（4 幕）、第 3／4 段 看字 讀音／聽音 拼字 橫幅、〔🔤 拼讀〕每 一列（一個 一個 唸 ➜ 整個 字 金框）、聲音 點 ≧ 20px、子音／母音 字 ≧ 20px、
 *    燈泡〔🎬 秒懂 動畫〕每 一段 都 有 而且 演 得 完、隨堂 測驗〔⬅ 上一段〕、4 種 a 顏色 不同＋cake 黃 ② map3：file ＝ f i l e（e 在 最後）、黃點 在 字母 下面、對 了 不 自動 跳、〔❓ 怎麼 玩〕
 * ③ 進階版 ts＝ㄘ、ds＝ㄗ 一個 方框 跟 兩個 字母 一樣 寬 ④ 例外 字 A～Z 索引、〔🎬 比 一比〕⑤ 課本 單字 ?book=3／4、⚡ 快速 複習、金框、鏈 從 最 熟悉 的 一塊 開始（turtle ＝ tur）、live／dine
 * ⑥ ⚔️ 階段 試煉 11 個 ✕ 全對／全錯、25 題 闖關 兩 家族＋錯題 庫 類似 題 ⑦ 字母 書寫 M W 中間 的 尖 碰 線 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = '';
const ok = (c, m) => { n++; if (!c) E.push(m); };
const AU = new Set(fs.readdirSync(path.join(__dirname, 'au')).map(f => f.replace('.mp3', '')));
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.png': 'image/png', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }

async function run(br, vp) { const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: true });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
  await ctx.addInitScript(() => { window.__PHFAST = 1; window.__PHAUTO = 1; window.__PHSAY = []; window.__PHREC = []; window.__PHNOLOGIN = 1; Object.defineProperty(window, 'SCORE_URL', { get: () => '', set: () => {}, configurable: true }); });
  const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(HTTP + '/phonics/map.html#ani'); await p.waitForTimeout(300);
  const R = await p.evaluate(async () => { const S = PHM.SC, out = {}, ix = k => S.findIndex(s => s.k === k), st = document.getElementById('stage'), Rr = e => e.getBoundingClientRect();
    out.cv0 = ix('cv0') === 2 && ix('cvc') === 3 && ix('seg') === 4;
    PHM.scPlay(ix('cv0'), 'all'); out.cv4 = st.querySelectorAll('.cvp:not(.hid2)').length === 4 && st.querySelectorAll('.abc b.v').length === 5 && st.querySelectorAll('.abc b.c').length === 21;
    PHM.scPlay(ix('cvc'), 'all'); out.modeR = !!st.querySelector('.modeb.R'); PHM.scPlay(ix('seg'), 'all'); out.modeS = !!st.querySelector('.modeb.S');
    out.allSegCap = true; out.blb = true; out.dots = true; out.lab = true;
    for (let i = 0; i < S.length; i++) { PHM.scPlay(i, 'all'); await new Promise(r => setTimeout(r, 0)); const cb = st.querySelector('.capb[data-capani="' + i + '"]'); if (!cb || !S[i].ca || !S[i].ca.length) { out.allSegCap = false; out.capMiss = (out.capMiss || '') + ' ' + (i + 1); }
      const rows = [...st.querySelectorAll('.rows .rw')].filter(r => !r.querySelector('.wx') && r.querySelector('.wsay')); if (rows.some(r => !r.querySelector('.blb'))) { out.blb = false; out.blbMiss = i + 1; }
      const d = st.querySelector('.dt i'); if (d && d.offsetWidth < 14.5) { out.dots = false; out.dotW = d.offsetWidth; }
      const l = st.querySelector('.bx .bl'); if (l && parseFloat(getComputedStyle(l).fontSize) < 20) { out.lab = false; out.labF = getComputedStyle(l).fontSize; } }
    /* 秒懂 動畫 每 一段 演 得 完 */
    out.capRun = true; for (let i = 0; i < S.length; i++) { await PHM.capAni(S[i]); const o = document.getElementById('capAni'); if (!o || o.hidden || !o.querySelector('#caX.pulse')) { out.capRun = false; out.capRunBad = i + 1; } o.querySelector('#caX').click(); }
    /* 拼讀：一個 一個 唸 ➜ 整個 字（金框）*/
    PHM.scPlay(ix('d_ch'), 'all'); window.__PHSAY.length = 0; const row = [...st.querySelectorAll('.rows .rw')].find(r => r.querySelector('.blb')); const b = row.querySelector('.blb'); const gold = []; const ob = new MutationObserver(() => { if (row.querySelector('.wrow.gold')) gold.push(1) }); ob.observe(row, { attributes: true, subtree: true });
    await PHM.blendRow(row.querySelector('.wrow'), b.dataset.bsp, b.dataset.bau, b); ob.disconnect(); out.blend = window.__PHSAY.slice(-1)[0] === b.dataset.bau && window.__PHSAY.length >= 2 && gold.length > 0;
    /* 4 種 a */
    PHM.scPlay(ix('many1'), 'all'); const V = [...st.querySelectorAll('.rows .wrow')].map(w => { const v = [...w.querySelectorAll('.bx')].find(x => /\b(v|n)\b/.test(x.className)); return v.classList.contains('n') ? 'Y' : getComputedStyle(v).backgroundColor + getComputedStyle(v).backgroundImage.slice(0, 40); });
    out.many = V[1] === 'Y' && new Set(V).size === 4;
    /* 上一段 */
    PHM.scPlay(ix('seg'), 'all'); out.prev = !!st.querySelector('.qzrow [data-prev]') && st.querySelector('.qzrow').firstElementChild.hasAttribute('data-prev');
    st.querySelector('.qzrow [data-prev]').click(); out.prev2 = PHM.SC.indexOf(PHM.SC[ix('cvc')]) >= 0 && /看字 讀音/.test(document.getElementById('stage').innerText);
    /* 階段 試煉 按鈕 在 第 5 段 */
    PHM.scPlay(4, 'all'); out.stgBtn = !!st.querySelector('.qzrow [data-stg="m0"]');
    return out; });
  for (const k of ['cv0', 'cv4', 'modeR', 'modeS', 'allSegCap', 'blb', 'dots', 'lab', 'capRun', 'blend', 'many', 'prev', 'prev2', 'stgBtn']) ok(R[k] === true, tag + ' 拼音 地圖 ' + k + ' ' + JSON.stringify(R).slice(0, 300));
  /* 鏈：從 最 熟悉 的 一塊 開始、每 一列 都 有 聲音 */
  const C = await p.evaluate(() => { const C = PHM.CHAIN, o = []; for (const w in C) C[w].forEach(r => { if (r[1] && !PHM.AV.has(r[1])) o.push(w + ':' + r[1]); }); return { miss: o, tur: C.turtle[0][0], live: C.living[0][1], dine: C.dining[0][1], cat: C.cat[0][0], n: Object.keys(C).filter(w => w.indexOf(' ') < 0).length }; });
  ok(!C.miss.length, tag + ' 鏈 沒 聲音 ' + C.miss.join(' ')); ok(C.tur === 't.ur' && C.live === 'w_c59_live' && C.dine === 'w_c59_dine' && C.cat === 'c.a' && C.n === 26, tag + ' 鏈 不對 ' + JSON.stringify(C));
  /* ⑥ 階段 試煉 ＋ 25 題 闖關 */
  await p.evaluate(() => PHM.tab('play')); await p.waitForTimeout(200);
  for (const f of ['m', 'b']) for (let i = 0; i < (f === 'm' ? 6 : 5); i++) for (const mode of ['ok', 'no']) {
    const r = await p.evaluate(async ([f, i, mode]) => { document.querySelector('[data-stg="' + f + i + '"]').click(); for (let t = 0; t < 300; t++) { await new Promise(r => setTimeout(r, 30)); const g = PHM.G(); if (!g || document.querySelector('#again')) break; if (g.hk && g.lock !== g.q) { const h = g.hk; g.hk = null; h[mode](); } }
      const g = PHM.G(), an = document.querySelector('.skan'); const o = { ok: g && g.ok, n: g && g.Q.length, an: !!an }; document.getElementById('gx').click(); return o; }, [f, i, mode]);
    ok(r.n === 8 && r.ok === (mode === 'ok' ? 8 : 0) && r.an, tag + ' 試煉 ' + f + i + ' ' + mode + ' ' + JSON.stringify(r)); }
  for (const f of ['m', 'b']) { const r = await p.evaluate(async f => { const wb0 = JSON.parse(localStorage.getItem('phm_wb_' + f) || '[]').length; document.querySelector('[data-stg="' + f + '25"]').click(); await new Promise(r => setTimeout(r, 50)); const g0 = PHM.G(), re = g0.re, sq = g0.sq.slice(0, re).every(x => x.want);
      for (let t = 0; t < 900; t++) { await new Promise(r => setTimeout(r, 25)); const g = PHM.G(); if (!g || document.querySelector('#again')) break; if (g.hk && g.lock !== g.q) { const h = g.hk; g.hk = null; h.ok(); } }
      const g = PHM.G(), wb1 = JSON.parse(localStorage.getItem('phm_wb_' + f) || '[]').length; const o = { n: g.Q.length, ok: g.ok, wb0, wb1, re, sq }; document.getElementById('gx').click(); return o; }, f);
    ok(r.n === 25 && r.ok === 25 && r.wb0 > 0 && r.re === Math.min(8, r.wb0) && r.sq && r.wb1 === r.wb0 - r.re, tag + ' 25 題 闖關 ' + f + ' ' + JSON.stringify(r)); }
  /* ② map3 */
  { const p3 = await ctx.newPage(), e3 = []; p3.on('pageerror', e => e3.push(e.message)); await p3.goto(HTTP + '/phonics/map3.html'); await p3.waitForTimeout(300);
    const r = await p3.evaluate(async () => { document.getElementById('m3lv').click(); let y; for (let t = 0; t < 500; t++) { PHM.m3New(); y = PHM.M3S().y; if (/_e$/.test(y.v) && y.o && y.c !== '無') break; }
      const ks = ['o', 'v', 'c']; ks.forEach(k => { const b = [...document.querySelectorAll('[data-m3b="' + k + '"]')].find(b => b.dataset.v === y[k]); b.click(); });
      const L = [...document.querySelectorAll('#m3sl .m3l1 b')].map(b => b.textContent).join(''), last = [...document.querySelectorAll('#m3sl .m3s')].pop().dataset.m3s;
      const d = [...document.querySelectorAll('#m3sl .m3l1')].filter(u => !u.classList.contains('sil')).every(u => { const a = u.querySelector('b').getBoundingClientRect(), i = u.querySelector('.m3dt i'); if (!i) return false; const c = i.getBoundingClientRect(); return c.top >= a.bottom - 6 && c.width >= 22; });
      document.getElementById('m3ck').click(); await new Promise(r => setTimeout(r, 120)); const w = y.x.w; const still = PHM.M3S().y.x.w === w && !!document.getElementById('m3nx') && /拼 對 了/.test(document.getElementById('m3msg').innerText);
      return { L, w, last, d, still, how: !!document.getElementById('m3how') }; });
    ok(r.L === r.w && r.last === 'e', tag + ' map3 magic e 沒 在 最後 ' + JSON.stringify(r)); ok(r.d, tag + ' map3 黃點 不在 字母 正下方'); ok(r.still, tag + ' map3 對 了 自己 跳 題'); ok(r.how, tag + ' map3 沒有〔❓ 怎麼 玩〕'); ok(!e3.length, tag + ' map3 錯誤 ' + e3.join('|')); await p3.close(); }
  /* ③ 進階版 ts／ds */
  { const p4 = await ctx.newPage(); await p4.goto(HTTP + '/phonics/advanced.html'); await p4.waitForTimeout(300);
    for (const e of ['ts', 'ds']) { const r = await p4.evaluate(e => { endGrp = 'g5'; curEnd = e; buildDeck(true); build(); const t = document.querySelector('.tile.span2'); if (!t) return null; const L = t.parentNode.previousSibling.getBoundingClientRect(), a = t.getBoundingClientRect(); return { z: t.textContent, d: Math.abs(L.left - a.left) + Math.abs(L.right - a.right) }; }, e);
      ok(r && r.z === (e === 'ts' ? 'ㄘ' : 'ㄗ') && r.d <= 2, tag + ' 進階版 ' + e + ' ' + JSON.stringify(r)); } await p4.close(); }
  /* ④ 例外 字 */
  { const p5 = await ctx.newPage(), e5 = []; p5.on('pageerror', e => e5.push(e.message)); await p5.goto(HTTP + '/phonics/exceptions.html'); await p5.waitForTimeout(300);
    const r = await p5.evaluate(async () => { const az = document.querySelectorAll('#az button').length, on = document.querySelectorAll('#az button:not([disabled])').length; document.querySelector('[data-az="S"]').scrollIntoView ? document.querySelector('[data-az="S"]').click() : 0; await new Promise(r => setTimeout(r, 1800));
      const h = document.getElementById('L_S').getBoundingClientRect().top, hd = document.getElementById('az').getBoundingClientRect().bottom; const ani = document.querySelectorAll('[data-xa]').length; xani('said'); await new Promise(r => setTimeout(r, 4500));
      return { az, on, vis: h >= hd - 2 && h < innerHeight, ani, x1: document.querySelectorAll('#x1t .tile').length, x2: document.querySelectorAll('#x2t .tile').length, df: document.querySelectorAll('#x2t .tile.df').length }; });
    ok(r.az === 26 && r.on >= 15 && r.vis && r.ani >= 140 && r.x1 >= 3 && r.x2 >= 3 && r.df >= 1, tag + ' 例外 字 ' + JSON.stringify(r)); ok(!e5.length, tag + ' 例外 字 錯誤 ' + e5.join('|')); await p5.close(); }
  /* ⑤ 課本 單字 */
  { const p6 = await ctx.newPage(), e6 = []; p6.on('pageerror', e => e6.push(e.message)); await p6.addInitScript(() => { window.__PHFAST = 0; }); await p6.goto(HTTP + '/phonics/games.html?book=4'); await p6.waitForTimeout(800);
    const r = await p6.evaluate(async () => { const t = document.getElementById('ttl').textContent, lh = document.querySelector('.brg .lh').textContent; document.getElementById('bQ').click(); await new Promise(r => setTimeout(r, 200)); const q = document.getElementById('bQ').classList.contains('on');
      let gold = 0; for (let i = 0; i < 60 && !gold; i++) { await new Promise(r => setTimeout(r, 100)); if (document.querySelector('.bw2.gold')) gold = 1; } return { t, lh, q, gold, row: !!document.querySelector('a.bkbig') }; });
    ok(/四年級/.test(r.t) && /^G4/.test(r.lh) && r.q && r.gold, tag + ' 課本 單字 ' + JSON.stringify(r)); ok(!e6.length, tag + ' 課本 單字 錯誤 ' + e6.join('|')); await p6.close();
    const p7 = await ctx.newPage(); await p7.goto(HTTP + '/phonics/games.html'); await p7.waitForTimeout(400); ok(await p7.evaluate(() => document.querySelectorAll('.bkrow a.bkbig').length === 2), tag + ' 遊戲場 沒有 課本 單字 大 按鈕'); await p7.close(); }
  ok(!errs.length, tag + ' 程式 錯誤 ' + errs.slice(0, 3).join('｜')); await ctx.close(); }
(async () => { const srv = await serve(), br = await chromium.launch(); for (const vp of [[1024, 768], [768, 1024]]) await run(br, vp);
  /* ⑦ 字母 書寫 M W */
  const { HW } = require('../g3mid/_hw.js'); const src = fs.readFileSync(path.join(__dirname, '..', 'g3mid', '_hw.js'), 'utf8');
  ok(/M: \[\[L\(0, 0, 0, 2\), L\(0, 0, \.65, 2\), L\(\.65, 2, 1\.3, 0\)/.test(src), 'M 的 尖 沒有 碰 到 底線（課本）'); ok(/W: \[\[L\(0, 0, \.4, 2\), L\(\.4, 2, \.8, 0\)/.test(src), 'W 的 中間 尖 沒有 碰 到 最上面 的 線（課本）');
  const hub = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'); ok(/games\.html\?book=3/.test(hub) && /games\.html\?book=4/.test(hub), '總首頁 沒有 三、四年級 第三、四課 單字');
  await br.close(); srv.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第五十九次 phonics：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
