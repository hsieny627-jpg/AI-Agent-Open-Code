/* phonics/_verify_64.js — 第六十四次 量測（只 印 失敗＋一行 總結）。node phonics/_verify_64.js
 * ① 44 音 練習 路線 10 關（母音 7：短 母音 5 ➜ ㄝ一 組 4 ➜ 複習 9 ➜ ㄨㄜ 組 5 ➜ 其他 5 ➜ 複習 10 ➜ 總複習 19；子音 3）✕ 基礎／進階
 *    每 關 遊戲 不同、題數（新 10／複習 10～11／總複習 20）、由 易 到 難 2 ➜ 3 ➜ 4、每 個 音 都 考 到、基礎 有 注音＋小字 KK／進階 只有 字母、
 *    選項 不 超出 畫面、字 ≧ 24px、KK 小（≦ 注音 的 0.4）、玩完 有 結束 頁、成績 代號 sc<id><b|a>
 * ② 動畫 卡 的 注音 下面 有 KK ③ 新 的 5 個 真的 玩法（_map_games.js）：答對／答錯 都 玩 得 完 ④ 現場任務、老師看板 有 新 代號 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = '';
const ok = (c, m) => { n++; if (!c) E.push(m); };
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
const SND = require('./_snd.js'), IDS = SND.GS.map(g => g.id);
const HOST = fs.readFileSync(path.join(ROOT, 'live', 'host.html'), 'utf8'), BK = fs.readFileSync(path.join(ROOT, 'teacher', 'index.html'), 'utf8');
for (const id of IDS) for (const l of 'ba') { ok(HOST.indexOf("'sc" + id + l + "'") >= 0, '現場任務 沒有 sc' + id + l); ok(BK.indexOf('g3gm_ph-sc' + id + l) >= 0, '老師看板 沒有 sc' + id + l); }
ok(JSON.stringify(SND.GS[0].items) === '["ae","eh","ih","aa","uh"]', '第 1 關 不是 短 母音 a e i o u');
ok(SND.GS.filter(g => !g.rev).every(g => g.items.length <= 5 || !g.items.every(k => SND.BY[k].v)), '母音 新 的 一組 超過 5 個');
ok(new Set(SND.GS.filter(g => g.items.every(k => SND.BY[k].v)).map(g => g.g)).size === 7, '母音 7 關 的 遊戲 沒有 都 不同');
ok(SND.GS.find(g => g.rev === 2).items.length === 19, '總複習 不是 19 個 母音');
/* 第 4 點：beat／jump 的 牌 會 移動 到 框 外（框 會 切掉，本來 就 是 這樣）➜ 不 量 超出；改 量 遊戲 框 本身 不 超出 螢幕 */
async function run(br, vp) { const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: true });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
  await ctx.addInitScript(() => { window.__PHFAST = 1; window.__PHSAY = []; window.__PHNOLOGIN = 1; window.__PHREC = []; Object.defineProperty(window, 'SCORE_URL', { get: () => '', set: () => {}, configurable: true }); });
  const errs = [], pg = async u => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(u + '：' + e.message)); await p.goto(HTTP + '/' + u); await p.waitForTimeout(500); return p; };
  { const p = await pg('phonics/sounds.html');
    const rt = await p.evaluate(() => ({ c: document.querySelectorAll('#scRoute .scrc').length, b: document.querySelectorAll('#scRoute [data-scg]').length, kk: !!document.querySelector('#scRoute .sckk') }));
    ok(rt.c === 10 && rt.b === 20 && rt.kk, tag + ' 練習 路線 不對 ' + JSON.stringify(rt));
    /* ② 動畫 卡 的 KK */
    const kk = await p.evaluate(async () => { PHSND.sdCard(PHSND.SDLIST.findIndex(x => x.k === 'ae')); await new Promise(r => setTimeout(r, 100)); const t = document.querySelector('#sdStage .sdtile.big'), k = t && t.querySelector('.kkm'), z = t && t.querySelector('.zm');
      return k ? { tx: k.textContent, show: getComputedStyle(k).display !== 'none', r: parseFloat(getComputedStyle(k).fontSize) / parseFloat(getComputedStyle(z).fontSize) } : null; });
    ok(kk && kk.tx === '/æ/' && kk.show && kk.r <= .4, tag + ' 動畫 卡 注音 下面 沒有 小字 KK ' + JSON.stringify(kk));
    for (let i = 0; i < IDS.length; i++) for (const l of 'ba') { const r = await p.evaluate(async a => { const [i, l] = a, g = SND.GS[i], o = { n: [], tile: [], kk: [], over: 0, small: 0, ks: new Set(), big: 0 }; PHSND.start('sc' + g.id + l); await new Promise(r => setTimeout(r, 120));
        const h = document.getElementById('gbody').textContent; o.title = /題/.test(h) ? (h.match(/📝 (\d+) 題/) || [])[1] : ''; const b = document.getElementById('gGo'); if (b) b.click(); await new Promise(r => setTimeout(r, 600));
        let G = PHSND.G(); const N = G.N || 10;
        for (let q = 0; q < N; q++) { G = PHSND.G(); for (let w = 0; w < 80 && (G.sgQ !== q || !document.querySelector('#gbody [data-sc]') || G.lock === G.q || G.Q.length > q); w++) { await new Promise(r => setTimeout(r, 60)); G = PHSND.G(); }
          const cs = [...document.querySelectorAll('#gbody [data-sc]')].filter(c => !c.closest('.sgnote')); const nt = document.querySelectorAll('#gbody .sgnote').length;
          o.n.push(G.sgO ? G.sgO.length : cs.length); o.tile.push(cs.length ? cs.every(c => !!c.querySelector('.scz')) : null);
          if (l === 'b') [...document.querySelectorAll('#gbody [data-sc]')].forEach(c => { const k = c.querySelector('.kkm'), z = c.querySelector('.zm'); o.kk.push(!!(k && getComputedStyle(k).display !== 'none' && parseFloat(getComputedStyle(k).fontSize) <= parseFloat(getComputedStyle(z).fontSize) * .45)); });
          const A = document.getElementById('sgA'), ar = A ? A.getBoundingClientRect() : { left: 0, right: innerWidth, top: 0, bottom: innerHeight };
          if (g.g !== 'jump' && g.g !== 'beat') cs.forEach(c => { const r = c.getBoundingClientRect(); if (r.right > Math.min(innerWidth, ar.right) + 2 || r.left < Math.max(0, ar.left) - 2 || r.bottom > innerHeight + 2) o.over++; c.querySelectorAll('.sp').forEach(s => { if (parseFloat(getComputedStyle(s).fontSize) < 24) o.small++; }); });
          if (A && A.getBoundingClientRect().bottom > innerHeight + 2) o.big++;
          o.ks.add(G.sdl && G.sdl.k); if (q % 4 === 3) o.wr = (o.wr || 0) + 1; (q % 4 === 3 ? G.hk.no : G.hk.ok)(); for (let w = 0; w < 60 && G.Q.length <= q; w++) await new Promise(r => setTimeout(r, 60)); await new Promise(r => setTimeout(r, 80)); }
        for (let w = 0; w < 100 && !/答對/.test(document.getElementById('gbody').textContent); w++) await new Promise(r => setTimeout(r, 60));
        G = PHSND.G(); o.N = N; o.q = G.Q.length; o.end = /答對/.test(document.getElementById('gbody').textContent); o.ks = o.ks.size; o.want = g.items.length; o.gm = g.g; o.rec = (window.__PHREC.slice(-1)[0] || {}).set; document.getElementById('gx').click(); return o; }, [i, l]);
      const g = SND.GS[i], want = g.rev === 2 ? 24 : Math.max(10, g.items.length + 1), N = r.N, c1 = Math.round(N * .3), c2 = Math.round(N * .6), tg = tag + ' 第 ' + (i + 1) + ' 關 ' + g.g + ' ' + l;
      ok(r.N === want && r.q === want && r.end, tg + ' 沒有 玩完 ' + r.q + '／' + want); ok(r.title === String(want), tg + ' 開場 題數 寫 ' + r.title);
      ok(r.n.slice(0, c1).every(x => x === 2) && r.n.slice(c1, c2).every(x => x === 3) && r.n.slice(c2).every(x => x >= 3 && x <= 4) && r.n.slice(c2).some(x => x === 4), tg + ' 選項 數 ' + r.n.join(''));
      ok(r.tile.every(t => t === null || t === (l === 'b')), tg + ' 注音 方塊 不對'); ok(l === 'a' || r.kk.every(Boolean) && r.kk.length, tg + ' 基礎 沒有 小字 KK');
      ok(!r.over && !r.small && !r.big, tg + ' 超出 ' + r.over + '／字 太 小 ' + r.small + '／畫面 太 高 ' + r.big); ok(r.ks >= Math.min(r.want, N - (r.wr || 0)), tg + ' 音 沒有 都 考 到 ' + r.ks + '／' + r.want);
      ok(r.rec === 'g3gm_ph-sc' + g.id + l, tg + ' 成績 代號 ' + r.rec); }
    await p.close(); }
  /* ③ 5 個 真的 玩法：每 種 一場（答對、答錯 交錯）*/
  { const p = await pg('phonics/map.html#map'); for (const k of ['mvow', 'mon', 'mpat', 'mcoin', 'mking']) { const r = await p.evaluate(async k => { PHM.start(k); await new Promise(r => setTimeout(r, 100)); const b = document.getElementById('gGo'); if (b) b.click(); await new Promise(r => setTimeout(r, 300));
        let G = PHM.G(); const o = { real: 0 };
        for (let q = 0; q < 5; q++) { for (let w = 0; w < 60 && (!G.hk || G.lock === G.q || G.Q.length > q); w++) { await new Promise(r => setTimeout(r, 60)); G = PHM.G(); }
          o.real += document.querySelector('#gbody [data-real]') ? 1 : 0; (q % 2 ? G.hk.no : G.hk.ok)(); for (let w = 0; w < 80 && G.Q.length <= q; w++) await new Promise(r => setTimeout(r, 60)); }
        for (let w = 0; w < 100 && !/答對/.test(document.getElementById('gbody').textContent); w++) await new Promise(r => setTimeout(r, 60));
        o.q = PHM.G().Q.length; o.end = /答對/.test(document.getElementById('gbody').textContent); document.getElementById('gx').click(); return o; }, k);
      ok(r.q === 5 && r.end, tag + ' ' + k + ' 沒有 玩完 ' + r.q); ok(r.real === 5, tag + ' ' + k + ' 沒有 真的 操作 ' + r.real); }
    await p.close(); }
  errs.forEach(e => E.push(tag + ' 錯誤：' + e)); await ctx.close(); }
(async () => { const s = await serve(); const br = await chromium.launch(); for (const vp of [[1024, 768], [820, 1180]]) await run(br, vp);
  await br.close(); s.close(); E.slice(0, 40).forEach(e => console.log('❌ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第六十四次：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
