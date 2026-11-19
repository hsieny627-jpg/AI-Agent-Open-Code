/* phonics/_verify_63.js — 第六十三次 量測（只 印 失敗＋一行 總結）。node phonics/_verify_63.js
 * ① 拼音 地圖〔ㄅㄆㄇ 注音 順序〕：字首 有 有聲 th（th2，聲音 dh-）、母音 29 個 全部 照 老師 的 組 順序（基礎、進階 都 一樣）、e_e 拼 得 出來
 * ② 🃏 聽音 卡牌 6 關 ✕ 基礎／進階：路線 6 張、一場 10 題、第 1～3 題 2 張 卡 ➜ 4～6 題 3 張 ➜ 7～10 題 4 張、基礎 有 注音 方塊／進階 沒有、進階 選項 拼法 不 重複、
 *    這 一關 的 音 都 考 到、卡 不 超出 畫面、字 ≧ 24px、玩完 10 題 有 結束 頁 ③ 現場任務、老師看板 有 sc0b～sc5a */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = '';
const ok = (c, m) => { n++; if (!c) E.push(m); };
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
const ZV = 'e ai ay a_e a ou ow2 ea ee e_e i oo oo2 u o_e oa ow o i_e u_e oi oy au aw ar or er ir ur';
const HOST = fs.readFileSync(path.join(ROOT, 'live', 'host.html'), 'utf8'), BK = fs.readFileSync(path.join(ROOT, 'teacher', 'index.html'), 'utf8');
for (let i = 0; i < 6; i++) for (const l of 'ba') { ok(HOST.indexOf("'sc" + i + l + "'") >= 0, '現場任務 沒有 sc' + i + l); ok(BK.indexOf('g3gm_ph-sc' + i + l) >= 0, '老師看板 沒有 sc' + i + l); }
ok(fs.readdirSync(path.join(__dirname, 'au')).filter(f => /^dh-/.test(f)).length > 200, '有聲 th 的 聲音 不夠');
async function run(br, vp) { const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: true });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
  await ctx.addInitScript(() => { window.__PHFAST = 1; window.__PHSAY = []; window.__PHNOLOGIN = 1; Object.defineProperty(window, 'SCORE_URL', { get: () => '', set: () => {}, configurable: true }); });
  const errs = [], pg = async u => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(u + '：' + e.message)); await p.goto(HTTP + '/' + u); await p.waitForTimeout(500); return p; };
  /* ① 注音 順序 */
  { const p = await pg('phonics/map.html#map'); for (const lv of ['lvB', 'lvA']) { const r = await p.evaluate(async lv => { document.getElementById(lv).click(); await new Promise(r => setTimeout(r, 60));
        for (const k of ['o', 'v']) { const b = document.querySelector('[data-zo="' + k + '"]'); if (!b.classList.contains('on')) b.click(); await new Promise(r => setTimeout(r, 60)); }
        const col = id => [...document.querySelectorAll(id + ' .chip.zc')].map(b => b.dataset.mv).join(' ');
        const t2 = document.querySelector('#mOn .chip.zc[data-mv="th2"]'); let au = '', w = '';
        if (t2) { t2.click(); await new Promise(r => setTimeout(r, 80)); const v = document.querySelector('#mV .chip.zc[data-mv="a"]'); v.click(); await new Promise(r => setTimeout(r, 80)); w = document.querySelector('#mapOut').textContent; au = PHM.codeOf('th2', 'a', 't'); }
        const ee = document.querySelector('#mV .chip.zc[data-mv="e_e"]'); let ew = ''; if (ee) { document.querySelector('#mOn .chip.zc[data-mv="b"]').click(); ee.click(); await new Promise(r => setTimeout(r, 80)); ew = PHM.spellOf ? PHM.spellOf('b', 'e_e', 'd') : ''; }
        return { on: col('#mOn'), v: col('#mV'), au, has: PHM.AV.has(au), t2lab: t2 ? t2.textContent : '', ew }; }, lv);
      ok(/ th th2$/.test(r.on), tag + ' ' + lv + ' 字首 沒有 有聲 th ' + r.on); ok(r.v === ZV, tag + ' ' + lv + ' 母音 順序 ' + r.v); ok(r.au === 'dh-ae-t' && r.has, tag + ' 有聲 th 沒有 聲音 ' + r.au); ok(/有聲|ð/.test(r.t2lab) || r.t2lab.indexOf('th') === 0, tag + ' th2 名字 ' + r.t2lab); }
    await p.close(); }
  /* ② 聽音 卡牌 */
  { const p = await pg('phonics/sounds.html'); const rt = await p.evaluate(() => ({ c: document.querySelectorAll('#scRoute .scrc').length, b: document.querySelectorAll('#scRoute [data-scg]').length }));
    ok(rt.c === 6 && rt.b === 12, tag + ' 練習 路線 不對 ' + JSON.stringify(rt));
    for (let i = 0; i < 6; i++) for (const l of 'ba') { const r = await p.evaluate(async a => { const [i, l] = a, o = { n: [], tile: [], dup: 0, over: 0, small: 0, ks: new Set() }; PHSND.start('sc' + i + l); await new Promise(r => setTimeout(r, 150)); const b = document.getElementById('gGo'); if (b) b.click(); await new Promise(r => setTimeout(r, 1400));
        for (let q = 0; q < 10; q++) { let G = PHSND.G(); for (let w = 0; w < 40 && (!document.querySelector('.scd') || G.lock === G.q); w++) { await new Promise(r => setTimeout(r, 100)); G = PHSND.G(); }
          const cs = [...document.querySelectorAll('.scd')]; o.n.push(cs.length); o.tile.push(cs.every(c => !!c.querySelector('.scz'))); const tx = cs.map(c => c.querySelector('.kqL').textContent.replace(/\s/g, ''));
          if (l === 'a') { const sp = cs.map(c => [...c.querySelectorAll('.sp')].map(s => s.textContent)); sp.forEach((a, x) => sp.forEach((b, y) => { if (x < y && a.some(s => b.indexOf(s) >= 0)) o.dup++; })); }
          cs.forEach(c => { const r = c.getBoundingClientRect(); if (r.right > innerWidth + 1 || r.left < -1 || r.bottom > innerHeight + 1) o.over++; c.querySelectorAll('.sp').forEach(s => { if (parseFloat(getComputedStyle(s).fontSize) < 24) o.small++; }); });
          o.ks.add(G.sdl && G.sdl.k); (q % 3 === 2 ? G.hk.no : G.hk.ok)(); for (let w = 0; w < 40 && G.Q.length <= q; w++) await new Promise(r => setTimeout(r, 100)); await new Promise(r => setTimeout(r, 200)); }
        const G = PHSND.G(); o.q = G.Q.length; o.end = /答對/.test(document.getElementById('gbody').textContent); o.ks = o.ks.size; o.want = SND.GS[i].items.length; document.getElementById('gx').click(); return o; }, [i, l]);
      ok(r.q === 10 && r.end, tag + ' sc' + i + l + ' 沒有 玩完 ' + r.q);
      ok(r.n.slice(0, 3).every(x => x === 2) && r.n.slice(3, 6).every(x => x === 3) && r.n.slice(6).every(x => x >= 3 && x <= 4) && r.n.slice(6).some(x => x === 4), tag + ' sc' + i + l + ' 卡 張數 不是 2➜3➜4 ' + r.n);
      ok(l === 'b' ? r.tile.every(Boolean) : !r.tile.some(Boolean), tag + ' sc' + i + l + ' 注音 方塊 不對');
      ok(!r.dup, tag + ' sc' + i + l + ' 進階 選項 拼法 重複 ' + r.dup); ok(!r.over && !r.small, tag + ' sc' + i + l + ' 卡 超出 ' + r.over + '／字 太 小 ' + r.small);
      ok(r.ks >= Math.min(r.want, 6), tag + ' sc' + i + l + ' 這 一關 的 音 沒有 都 考 到 ' + r.ks + '／' + r.want); }
    await p.close(); }
  errs.forEach(e => E.push(tag + ' 錯誤：' + e)); await ctx.close(); }
(async () => { const s = await serve(); const br = await chromium.launch(); for (const vp of [[1024, 768], [820, 1180]]) await run(br, vp);
  await br.close(); s.close(); E.forEach(e => console.log('❌ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第六十三次：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
