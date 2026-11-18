/* phonics/_verify_61.js — 第六十一次 量測（只 印 失敗＋一行 總結）。node phonics/_verify_61.js
 * ① 聲音 P61（ㄛ、qu、字尾 ch、短 oo 換 了；試聽頁）② 總首頁〔⚡ 現場任務〕學生 登入 也 看得到 ③ 動畫 頁 喇叭 ＝ 金框、〔下一頁〕＝ 下 一個 單字、live／living 對齊＋e ✖
 * ④ map3 gain a 黃 i 灰、沒有〔聽 最後 的 聲音〕⑤ ⚡ 音素 解碼 競速 正確 答案 一定 在 選項、提示 底色 ≠ 選項 ⑥ 子／母 標籤 ⑦ 真的 打磚塊（球 真的 會 飛）、輸送帶 拖 進 門、雷達 光點 會 動
 * ⑧ 玩 過 一次 以後 複習 動畫 不 自動 演 ⑨ 地圖 dge（ㄓ）、ve（v）⑩ 階段 試煉 7 個 主題 ⑪ 常見 拼字 組合（4 個 課本 字、15 個 延伸 字、金框、有 聲音）*/
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = '';
const ok = (c, m) => { n++; if (!c) E.push(m); };
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
const AU = p => path.join(__dirname, 'au', p + '.mp3'), LI = p => path.join(ROOT, 'listen', '2026-11-18_P61', p + '.mp3'), eq = (a, b) => fs.readFileSync(a).equals(fs.readFileSync(b));
ok(eq(AU('s_ao'), LI('s_ao_F')) && eq(AU('s_kw'), LI('s_kw_C')) && eq(AU('s_ech'), LI('s_ech_B')) && eq(AU('s_oo'), LI('s_oo_C')), '網站 聲音 沒有 換 成 P61');
['s_ao', 's_kw', 's_ech', 's_oo'].forEach(c => ok(!eq(AU(c), LI('v60/' + c)), c + ' 跟 舊 的 一樣'));
const LH = fs.readFileSync(path.join(ROOT, 'listen', '2026-11-18_P61', 'index.html'), 'utf8'); ['s_ao_F', 's_ao_G', 's_kw_C', 's_ech_B', 's_oo_C'].forEach(c => ok(LH.indexOf(c) >= 0 && fs.existsSync(LI(c)), '試聽頁 沒有 ' + c));
const B = require('./_book.js'); ok(Object.keys(B.COMBO).join() === 'thin,tall,short,strong', '常見 拼字 組合 不是 4 個 字');
Object.values(B.COMBO).forEach(L => L.forEach(x => { ok(fs.existsSync(AU(x.au)), '沒有 組合 聲音 ' + x.au); x.ex.forEach(e => ok(B.WX[e] && fs.existsSync(AU(B.WX[e].au)), '延伸 字 沒有 聲音 ' + e)); }));
const HOST = fs.readFileSync(path.join(ROOT, 'live', 'host.html'), 'utf8'); ok(/\['stm6','⚔️ 拼音 地圖 第 7 關','一 字母 多 聲音'\]/.test(HOST), '大螢幕 沒有 第 7 關');
async function run(br, vp) { const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: true });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
  await ctx.addInitScript(() => { window.__PHFAST = 1; window.__PHSAY = []; window.__PHREC = []; window.__PHNOLOGIN = 1; Object.defineProperty(window, 'SCORE_URL', { get: () => '', set: () => {}, configurable: true }); });
  const errs = [], pg = async u => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(u + '：' + e.message)); await p.goto(HTTP + '/' + u); await p.waitForTimeout(350); return p; };
  { const p = await pg('index.html'); const r = await p.evaluate(() => { document.body.classList.add('scin'); return new Promise(res => setTimeout(() => { const a = document.querySelector('.lbtn'); res({ vis: a && getComputedStyle(a).display !== 'none', href: a && a.getAttribute('href'), over: document.documentElement.scrollWidth > innerWidth + 1 }); }, 80)); });
    ok(r.vis && r.href === 'live/index.html' && !r.over, tag + ' 總首頁 學生 登入 看不到〔⚡ 現場任務〕' + JSON.stringify(r)); await p.close(); }
  { const p = await pg('phonics/map.html#ani'); const r = await p.evaluate(async () => { const o = {}, st = document.getElementById('stage'), i = PHM.SC.findIndex(x => x.k === 'd_ng'); await PHM.scPlay(i, 'all');
      const b = st.querySelector('[data-wsay]'), w = b.closest('.rw').querySelector('.wrow'), g = []; const ob = new MutationObserver(() => g.push(w.classList.contains('gold'))); ob.observe(w, { attributes: true }); b.click(); await new Promise(r => setTimeout(r, 300)); ob.disconnect(); o.gold = g.some(Boolean);
      return o; }); ok(r.gold, tag + ' 動畫 頁 喇叭 沒有 金框'); await p.close(); }
  { const p = await pg('phonics/map.html#chain=living'); const r = await p.evaluate(async () => { await PHM.scPlay(PHM.SC.length - 1, 'all'); await new Promise(r => setTimeout(r, 80)); const R = [...document.querySelectorAll('#stage .rows .wrow')];
      const L = R.slice(0, 2).map(w => [...w.querySelectorAll('.bx')].slice(0, 3).map(b => Math.round(b.querySelector('.L').getBoundingClientRect().left)));
      const xe = !!R[0].querySelector('.bx.xe'), syl = R[1].querySelectorAll('.syl').length; return { L, xe, syl }; });
    await Promise.all([p.waitForNavigation({ timeout: 5000 }).catch(() => {}), p.evaluate(() => document.getElementById('aNext').click())]); await p.waitForTimeout(300); r.h = new URL(p.url()).hash + '|' + await p.evaluate(() => PHM.SC[PHM.SC.length - 1].t);
    ok(r.L.length === 2 && r.L[0].every((x, k) => Math.abs(x - r.L[1][k]) <= 2), tag + ' live／living l i v 沒有 上下 對齊 ' + JSON.stringify(r.L)); ok(r.xe && r.syl === 2, tag + ' live 的 e 沒有 ✖ 或 沒有 liv·ing 兩 框');
    ok(/where/.test(decodeURIComponent(r.h)), tag + '〔下一頁〕沒有 到 下 一個 單字 ' + r.h); await p.close(); }
  { const p = await pg('phonics/map3.html'); const r = await p.evaluate(async () => { let y; for (let t = 0; t < 400; t++) { PHM.m3New(); y = PHM.M3S().y; if (y.v === 'ai') break; }
      const S = PHM.M3S(); if (y.v !== 'ai') return { skip: 1, tail: !document.getElementById('m3tail') }; const b = document.querySelector('[data-m3b="v"][data-v="ai"]'); b.click(); await new Promise(r => setTimeout(r, 60));
      const a = document.querySelector('#m3sl .m3l1.nm'), i = document.querySelector('#m3sl .m3l1.sil'); return { a: a && getComputedStyle(a).backgroundColor, i: i && getComputedStyle(i).backgroundColor, btn: !!document.querySelector('[data-m3b="v"][data-v="ai"] .vy'), tail: !document.getElementById('m3tail') }; });
    ok(r.tail, tag + ' map3 還有〔聽 最後 的 聲音〕'); if (!r.skip) ok(r.a === 'rgb(250, 204, 21)' && r.i === 'rgb(140, 146, 163)' && r.btn, tag + ' gain 的 a 黃 i 灰 不 對 ' + JSON.stringify(r)); await p.close(); }
  { const p = await pg('phonics/map.html#map'); const r = await p.evaluate(async () => { const o = {}, pick = (k, v) => { const b = document.querySelector('[data-mk="' + k + '"][data-mv="' + v + '"]'); if (b) b.click(); return !!b; };
      pick('o', 'b'); pick('v', 'a'); o.dge = pick('c', 'dge'); await new Promise(r => setTimeout(r, 60)); o.dgeT = [...document.querySelectorAll('#mapOut .tl[data-t]')].map(t => t.innerText).join('|'); o.dgeOk = !document.getElementById('mSay2').disabled; o.dgeR = /✅/.test(document.querySelector('#mapOut .cap').innerText);
      pick('o', 'h'); pick('v', 'a'); o.ve = pick('c', 've'); await new Promise(r => setTimeout(r, 60)); o.veT = [...document.querySelectorAll('#mapOut .tl[data-t]')].map(t => t.innerText).join('|'); o.veOk = !document.getElementById('mSay2').disabled;
      pick('v', 'o'); await new Promise(r => setTimeout(r, 60)); o.veDim = document.querySelector('[data-mk="c"][data-mv="ve"]').classList.contains('dim');
      PHM.tab('play'); await new Promise(r => setTimeout(r, 60)); o.stg = document.querySelectorAll('[data-stg^="m"]').length;
      /* ⑤⑥⑦⑧ 遊戲 */
      const play = async (k, f) => { PHM.start(k); await new Promise(r => setTimeout(r, 60)); const g0 = document.getElementById('gGo'); o['rv_' + k] = !!document.getElementById('grevB'); if (g0) g0.click(); await new Promise(r => setTimeout(r, 250)); const res = await f(); const b = document.getElementById('gx'); if (b) b.click(); return res; };
      o.srA = await play('srA', async () => { const G = PHM.G(); let good = 1; for (let q = 0; q < 4; q++) { const S = G.sr; ['o', 'v', 'c'].forEach(k => { if (S.op[k] && S.op[k].indexOf(S.y[k]) < 0) good = 0; }); if (q === 0) { G.hk.hint(); await new Promise(r => setTimeout(r, 40)); const h = document.querySelector('.srht'), op = document.querySelector('.srop button'); o.hbg = [h && getComputedStyle(h).backgroundColor, op && getComputedStyle(op).backgroundColor]; } const q0 = G.q; G.hk.ok(); for (let t = 0; t < 60 && G.q === q0; t++) await new Promise(r => setTimeout(r, 50)); } return good; });
      o.bo = await play('mco', async () => { const c = document.getElementById('boc'), r = c.getBoundingClientRect(); const ev = (t, x, y) => c.dispatchEvent(new PointerEvent(t, { bubbles: true, clientX: r.left + x, clientY: r.top + y, pointerId: 1 }));
        ev('pointerdown', r.width / 2, r.height * .9); ev('pointermove', r.width / 2, r.height * .3); ev('pointerup', r.width / 2, r.height * .3); const G0 = PHM.G(); for (let t = 0; t < 120 && !(G0.lock === 0 || G0.res.length); t++) await new Promise(z => setTimeout(z, 50)); const G = PHM.G(); return { canvas: !!c, moved: G.q > 0 || G.lock === 0 || G.res.length > 0, st: JSON.stringify(G.boS && [Math.round(G.boS.ball.x), Math.round(G.boS.ball.y), G.boS.ball.on]) }; });
      o.cv = await play('cvB', async () => { const pl = [...document.querySelectorAll('#gbody .pl')].map(e => e.innerText); const crt = document.getElementById('crt'), x0 = crt.getBoundingClientRect().left; await new Promise(z => setTimeout(z, 600)); const x1 = crt.getBoundingClientRect().left; const G = PHM.G(), q0 = G.q; G.hk.ok(); for (let t = 0; t < 60 && G.q === q0; t++) await new Promise(r => setTimeout(r, 50)); return { pl: pl.every(t => /^(子( 子)*|母)$/.test(t)) && pl.length > 0, belt: x1 > x0, q: G.q, ok: G.ok }; });
      o.rd = await play('cvA', async () => { const b = document.querySelector('.blip'), a = b.getBoundingClientRect().left; await new Promise(z => setTimeout(z, 500)); return { moves: Math.abs(b.getBoundingClientRect().left - a) > 1 }; });
      PHM.start('srA'); await new Promise(r => setTimeout(r, 60)); o.rv2 = !!document.getElementById('grevB'); const b = document.getElementById('gx'); if (b) b.click();
      return o; });
    ok(r.dge && r.dgeT.indexOf('ㄓ') >= 0 && r.dgeOk && r.dgeR, tag + ' badge（dge ＝ ㄓ）不 對 ' + JSON.stringify([r.dgeT, r.dgeOk, r.dgeR])); ok(r.ve && r.veT.indexOf('v') >= 0 && r.veOk && r.veDim, tag + ' have（ve）不 對 ' + JSON.stringify([r.veT, r.veOk, r.veDim]));
    ok(r.stg === 8, tag + ' 拼音 地圖 不是 7 關＋25 題 ' + r.stg); ok(r.srA === 1, tag + ' 音素 解碼 競速 正確 答案 不在 選項');
    ok(r.hbg && r.hbg[0] && r.hbg[0] !== r.hbg[1], tag + ' 提示 底色 跟 選項 一樣 ' + JSON.stringify(r.hbg)); ok(r.bo.canvas && r.bo.moved, tag + ' 打磚塊 球 沒有 飛 出去 打到 磚 ' + JSON.stringify(r.bo));
    ok(r.cv.pl && r.cv.belt && r.cv.q >= 1 && r.cv.ok >= 1, tag + ' 輸送帶 不 對 ' + JSON.stringify(r.cv)); ok(r.rd.moves, tag + ' 雷達 光點 沒有 動'); ok(r.rv2 && !r.rv_srA, tag + ' 玩 過 一次 以後 複習 動畫 不是 選 的');
    await p.close(); }
  { const p = await pg('phonics/games.html'); const r = await p.evaluate(async () => { const o = {}; PHG.bridgeOpen('strong'); await new Promise(r => setTimeout(r, 200)); const b = document.getElementById('bsX'); o.btn = !!b; window.__PHSAY && (window.__PHSAY.length = 0); b.click(); await new Promise(r => setTimeout(r, 1500));
      const M = document.getElementById('cxp'); o.open = M && !M.hidden; o.gold = [...M.querySelectorAll('#cxM .bgp.cxg')].map(g => g.innerText.split('\n')[0]).join(''); o.ex = M.querySelectorAll('.cxw').length; o.tl = M.querySelectorAll('.cxw .tls').length;
      o.over = [...M.querySelectorAll('.cxw,.cxt button')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).length; PHG.bridgeOpen('cat'); await new Promise(r => setTimeout(r, 150)); o.none = !document.getElementById('bsX'); return o; });
    ok(r.btn && r.open && r.ex === 5 && r.tl > 10 && !r.over && r.none, tag + ' 常見 拼字 組合 不 對 ' + JSON.stringify(r)); ok(/str|ng/.test(r.gold), tag + ' strong 沒有 金框 str／ng ' + r.gold); await p.close(); }
  errs.forEach(e => E.push('JS 例外 ' + tag + '：' + e)); await ctx.close(); }
(async () => { const s = await serve(), br = await chromium.launch();
  for (const vp of [[1180, 820], [1920, 1080]]) await run(br, vp);
  await br.close(); s.close();
  E.slice(0, 40).forEach(m => console.log('✗ ' + m)); console.log((E.length ? '❌' : '✅') + ' 第六十一次 phonics：' + n + ' 項，' + E.length + ' 個 失敗'); })();
