/* phonics/_verify_58.js — 第五十八次 新 東西 的 量測（只 印 失敗 項＋一行 總結）。node phonics/_verify_58.js
 * ① 拼音 地圖：注音 小 的 在 右上角、ㄛ一 拆開、雙 母音 第二個 灰底、錯 的 唸法 大 ✖、例字〔🔊〕、母音 對齊（14 15 21 段）、ㄚ 在 a 正上方、4 種 a 不同 紅
 * ② 🪜 3／4 音節：每 個 字 有 聲音、不 超出 畫面 ③ map3 聲音 積木：放 對 ➜ 拼 對、放 錯 ➜ 紅＋說 哪 一格 ④ map2 你 來 拼：每 個 方框 4 個 選項
 * ⑤ 字卡〔⚖️ 比較〕：一般 字 ＝ 一樣、例外 字 ＝ 不一樣 ⑥ 遊戲場 結束 頁：沒有 S、有「上一次 ➜ 這次」⑦ 隨堂 測驗〔🔴／⚪〕切換 */
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
  const R = await p.evaluate(() => { const S = PHM.SC, out = {}, Rr = e => e.getBoundingClientRect(), ix = k => S.findIndex(s => s.k === k);
    PHM.scPlay(1, 'all'); const st = document.getElementById('stage'), rows = [...st.querySelectorAll('.rows .wrow')], a = rows[0].querySelectorAll('.bx')[1], b = rows[1].querySelectorAll('.bx')[1];
    out.ya = Math.abs(Rr(a).left - Rr(b).left) <= 2 && Math.abs(Rr(a).width - Rr(b).width) <= 2;
    const t = st.querySelector('.tl[data-t="ae"]'); out.sup = !!(t && t.querySelector('sup.zc') && getComputedStyle(t.querySelector('sup.zc')).position === 'absolute' && Rr(t.querySelector('sup.zc')).top < Rr(t.querySelector('.zm')).top + 4);
    out.fs = t ? parseFloat(getComputedStyle(t).fontSize) >= 24 : false;
    PHM.scPlay(ix('d_ch'), 'all'); out.x = !!st.querySelector('.wrow.wx .bigx') && /錯 的 唸法/.test(st.innerText) && !!st.querySelector('[data-wsay="ch-ih-n"]');
    for (const k of ['bl1', 'bl2', 'tin']) { PHM.scPlay(ix(k), 'all'); const L = [...st.querySelectorAll('.rows .wrow')].map(w => Math.round(Rr([...w.querySelectorAll('.bx')].find(x => /\b(v|n)\b/.test(x.className))).left)); out['al_' + k] = Math.max(...L) - Math.min(...L) <= 2; }
    PHM.scPlay(ix('team'), 'all'); const n = st.querySelector('.bx.n'), c0 = n.querySelector('.ck.nm'), c1 = n.querySelector('.ck.sil');
    out.team = getComputedStyle(n).backgroundImage === 'none' && /255, 213, 79|245, 163, 0/.test(getComputedStyle(c0).backgroundImage) && /140, 146, 163|91, 96, 112/.test(getComputedStyle(c1).backgroundImage);
    PHM.scPlay(ix('many1'), 'all'); out.many = new Set([...st.querySelectorAll('.rows .wrow')].map(w => { const v = [...w.querySelectorAll('.bx')].find(x => /\b(v|n)\b/.test(x.className)); return getComputedStyle(v.classList.contains('n') ? v.querySelector('.ck') : v).backgroundColor + getComputedStyle(v.classList.contains('n') ? v.querySelector('.ck') : v).backgroundImage; })).size === 4;
    const sp = PHM.parse('b.ir.d')[0]; out.er = sp[1].ch[0].t === 'er1' && sp[2].ch[0].t === 'rr2'; const dc = PHM.parse('t.or=er1')[0]; out.doc = dc[1].ch[0].t === 'er1' && dc[2].ch[0].l === 'r';
    out.how = S.some(s => s.how === 'R') && S.some(s => s.how === 'S');
    return out; });
  for (const k in R) ok(R[k] === true, tag + ' 拼音 地圖 ' + k + ' 不對');
  /* ⑦ 隨堂 測驗 切換 */
  const q = await p.evaluate(async () => { const i = PHM.SC.findIndex(s => s.k === 'seg'); window.__PHQZ = null; PHM.qzStart(i); await new Promise(r => setTimeout(r, 200)); const b = document.querySelectorAll('[data-qred]'), v = document.querySelectorAll('#gbody .op .vr').length; b[1].click(); const v2 = document.querySelectorAll('#gbody .op .vr').length; b[0].click(); const gx = document.getElementById('gx'); return { b: b.length, v, v2, gxfs: parseFloat(getComputedStyle(gx).fontSize), gxh: gx.getBoundingClientRect().height }; });
  ok(q.b === 2 && q.v >= 3 && q.v2 === 0, tag + ' 隨堂 測驗 母音 紅／全部 同色 ' + JSON.stringify(q)); ok(q.gxfs >= 22 && q.gxh >= 60, tag + ' 〔離開〕不夠 大 ' + JSON.stringify(q));
  await p.evaluate(() => { document.getElementById('game').hidden = true; });
  /* ② 3／4 音節 */
  await p.click('[data-tab="syl"]');
  for (const k of ['3', '4']) { await p.click('[data-syln="' + k + '"]'); const s = await p.evaluate(() => ({ n: document.querySelectorAll('#sylOut .wrow').length, o: [...document.querySelectorAll('#sylOut .bx')].filter(b => b.getBoundingClientRect().right > innerWidth + 1).length, sy: [...document.querySelectorAll('#sylOut .wrow')].map(w => w.querySelectorAll('.syl').length) }));
    ok(s.n >= 4 && !s.o && s.sy.every(x => x === +k), tag + ' 多 音節 ' + k + ' ' + JSON.stringify(s)); }
  for (const w of ['banana', 'umbrella', 'tomato', 'hamburger', 'fantastic', 'family', 'animal', 'elephant', 'watermelon', 'caterpillar', 'alligator', 'helicopter']) { const nn = /water|cater|alli|heli/.test(w) ? 4 : 3; ok(AU.has('w_c58_' + w) && Array.from({ length: nn }, (_, i) => AU.has('sy_' + w + '_' + i)).every(Boolean), tag + ' ' + w + ' 沒有 聲音'); }
  await p.click('[data-syln="2"]');
  /* ④ map2 你 來 拼 */
  { const p2 = await ctx.newPage(); await p2.goto(HTTP + '/phonics/map2.html'); await p2.waitForTimeout(300); await p2.click('[data-tab="map"]').catch(() => {}); await p2.click('#pSpell');
    const m = await p2.evaluate(() => [...document.querySelectorAll('#m2w .m2p')].map(x => x.querySelectorAll('button').length)); ok(m.length >= 2 && m.every(x => x === 4), tag + ' map2 你 來 拼 選項 ' + JSON.stringify(m)); await p2.close(); }
  /* ③ map3 */
  { const p3 = await ctx.newPage(), e3 = []; p3.on('pageerror', e => e3.push(e.message)); await p3.goto(HTTP + '/phonics/map3.html'); await p3.waitForTimeout(300);
    const r = await p3.evaluate(async () => { const S = PHM.M3S(), y = S.y, ks = ['o', 'v', 'c'].filter(k => k !== 'o' || y.o), wrong = ks[ks.length - 1];
      for (const k of ks) { const b = [...document.querySelectorAll('[data-m3b="' + k + '"]')].find(b => k === wrong ? b.dataset.v !== y[k] : b.dataset.v === y[k]); b.click(); }
      document.getElementById('m3ck').click(); await new Promise(r => setTimeout(r, 100)); const bad = document.querySelectorAll('.m3s.bad').length, msg = document.getElementById('m3msg').innerText;
      document.querySelector('[data-m3b="' + wrong + '"][data-v="' + y[wrong] + '"]').click(); document.getElementById('m3ck').click(); await new Promise(r => setTimeout(r, 100));
      const good = /拼 對 了/.test(document.getElementById('m3msg') ? document.getElementById('m3msg').innerText : document.getElementById('m3').innerText);
      const rows = [...document.querySelectorAll('.m3row')].map(r => r.querySelectorAll('.m3b').length), o = [...document.querySelectorAll('#m3 button')].filter(b => b.getBoundingClientRect().right > innerWidth + 1 || b.getBoundingClientRect().bottom > innerHeight + 300).length;
      document.querySelector('[data-m3k="read"]').click(); const rd = !!document.querySelector('#m3w .bx') && !!document.getElementById('m3bl');
      return { bad, msg, good, rows, o, rd }; });
    ok(r.bad === 1 && /不對/.test(r.msg) && r.good, tag + ' map3 拼字 對錯 ' + JSON.stringify(r)); ok(r.rows.every(x => x >= 4) && !r.o, tag + ' map3 積木 ' + JSON.stringify(r)); ok(r.rd, tag + ' map3 看 ➜ 讀'); ok(!e3.length, tag + ' map3 錯誤 ' + e3.join('|')); await p3.close(); }
  /* ⑤ 字卡 比較 */
  { const p4 = await ctx.newPage(), e4 = []; p4.on('pageerror', e => e4.push(e.message)); await p4.goto(HTTP + '/phonics/index.html'); await p4.waitForTimeout(400);
    const c = await p4.evaluate(() => { document.getElementById('cmpB').click(); const a = document.getElementById('cmpw').innerText; let j = -1; for (let i = 0; i < deck.length; i++) { idx = i; if (curEx()) { j = i; break; } } go(j, false); const b = document.getElementById('cmpw').innerText, w = document.getElementById('cmpw').getBoundingClientRect();
      return { a: /一樣/.test(a) && (a.match(/照 規則/g) || []).length >= 1, b: /例外/.test(b) && /不一樣/.test(b), cells: document.querySelectorAll('#cmpw td').length, in: w.right <= innerWidth + 1 && w.left >= -1 }; });
    ok(c.a && c.b && c.cells === 6 && c.in, tag + ' 字卡 比較 ' + JSON.stringify(c)); ok(!e4.length, tag + ' 字卡 錯誤 ' + e4.join('|')); await p4.close(); }
  ok(!errs.length, tag + ' 程式 錯誤 ' + errs.slice(0, 3).join('｜')); await ctx.close(); }
(async () => { const srv = await serve(), br = await chromium.launch(); for (const vp of (process.env.VP ? [process.env.VP.split('x').map(Number)] : [[1024, 768], [768, 1024], [1920, 1080]])) await run(br, vp);
  await br.close(); srv.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第五十八次 phonics：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
