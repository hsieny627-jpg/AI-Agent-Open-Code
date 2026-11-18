/* phonics/_verify_60.js — 第六十次 量測（只 印 失敗 項＋一行 總結）。node phonics/_verify_60.js
 * ① 聲音：字尾 d 大聲 1.25 倍、ball／or 的 a o 換 回 舊 的、qu ＝ 新 的 ㄎㄨ、字尾 ch ＝ 新 的 s_ech（地圖、遊戲 都 用）
 * ② 字卡：唸 的 時候 整個 字 金框＋字母 放大 發光
 * ③ 拼音 地圖：字首〔無〕（at）、字尾 ll ff ss（短 母音 的 l f s 變 暗）、ball 的 a ＝ ㄛ、短 oo（good）、〔🔊 整個 字〕金框、but／fax 會 唸
 * ④ map2：〔⬅ 原來 的 拼音 地圖〕、選項 底色 跟 音標 不同、〔🔊 再 聽 一次〕大、拼 對／公布 答案 ＝ 唸 兩次 就 停（不 自動 跳）
 * ⑤ map3：兩 個 回 去 的 按鈕、「字首 子音」「字尾 子音」、換 模式／等級 題目 不 變、看 ➜ 讀 點 字母 有 聲音、〔👂 聽 最後 的 聲音〕、字尾 錯 ＝ 比 一比 整個 字
 * ⑥ 新 遊戲 ⚡ 音素 解碼 競速、🧱 聲音 積木 衝刺（30 秒、不 看 提示 ✖5、提示 ✖1、提示 ＝ 音標）、🔦 子母 結構 掃描、📡 子母 聲波 雷達：全對／全錯
 * ⑦ 現場任務：map.html?live=（假 資料庫，不 連 真的 Firebase）老師 開 pm ＝ 自己 開始、每 題 寫 進度、時間 到 送 成績；大螢幕 有 選 遊戲；老師看板 題庫 有 名字 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = '';
const ok = (c, m) => { n++; if (!c) E.push(m); };
function rms(f) { const b = fs.readFileSync(f); return b.length; }
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
/* ① 聲音 */
const AU = p => path.join(__dirname, 'au', p + '.mp3'), LI = p => path.join(ROOT, 'listen', '2026-11-18_P60', p + '.mp3');
['s_ed', 's_ao', 's_kw', 's_ech'].forEach(c => ok(fs.existsSync(AU(c)), '沒有 ' + c));
/* 第六十一次：s_ao、s_kw 又 換 成 P61（_verify_61 量）*/ok(fs.readFileSync(AU('s_ao')).equals(fs.readFileSync(path.join(ROOT, 'listen', '2026-11-18_P61', 's_ao_F.mp3'))), 's_ao 不是 P61');
ok(fs.readFileSync(AU('s_ed')).equals(fs.readFileSync(LI('s_ed_A2'))), 's_ed 不是 大聲 版');
ok(fs.readFileSync(AU('s_kw')).equals(fs.readFileSync(path.join(ROOT, 'listen', '2026-11-18_P61', 's_kw_C.mp3'))), 's_kw 不是 P61');
ok(!fs.readFileSync(AU('s_kw')).equals(fs.readFileSync(LI('v59/s_kw'))), 's_kw 跟 舊 的 一樣');
['s_ao_C', 's_ao_D', 's_kw_B', 's_ech_A'].forEach(c => ok(fs.existsSync(LI(c)), '試聽頁 沒有 ' + c));
const LH = fs.readFileSync(path.join(ROOT, 'listen', '2026-11-18_P60', 'index.html'), 'utf8'); ['s_ao_C', 's_kw_B', 's_ech_A', 's_ed_A2'].forEach(c => ok(LH.indexOf(c) >= 0, '試聽頁 沒 放 ' + c));
const GJ = fs.readFileSync(path.join(__dirname, '_games.js'), 'utf8'); ok(/await say\(bkAu\(w\)\);await wait\(450\);if\(dead\(\)\|\|!QUICK\)return;await say\(bkAu\(w\)\)/.test(GJ), '快速 複習 沒有 唸 兩次');
const P2 = require('./_ph2.js'); ok(P2.DECKS.advanced.ENDINGS.g2.indexOf('nk') >= 0 && P2.DECKS.advanced.ENDINGS.g3.indexOf('nk') < 0, 'nk 沒有 搬 到 2 個 子音'); ok(/CH:cd\?'ech':'ch'/.test(GJ) && /ch:'s_ech'/.test(GJ), '遊戲 字尾 ch 沒 用 s_ech');
/* ⑦ 大螢幕／平板／老師看板 */
const HOST = fs.readFileSync(path.join(ROOT, 'live', 'host.html'), 'utf8'), STU = fs.readFileSync(path.join(ROOT, 'live', 'index.html'), 'utf8'), TCH = fs.readFileSync(path.join(ROOT, 'teacher', 'index.html'), 'utf8');
ok(/\['pm','🗺️ 拼音 地圖 遊戲'\]|"pm","🗺️ 拼音 地圖 遊戲"/.test(HOST) && /function pmBox/.test(HOST) && /cfg\.pk=CRS\.pk/.test(HOST), '大螢幕 沒有 🗺️ 拼音 地圖 遊戲');
['srA', 'srB', 'cvB', 'cvA', 'stm0', 'stm25', 'stb4', 'stb25'].forEach(k => ok(HOST.indexOf("['" + k + "'") >= 0, '大螢幕 選單 沒有 ' + k));
ok(/v\.set==='pm'\?'\.\.\/phonics\/map\.html\?live='/.test(STU), '平板 沒有 跳到 map.html');
['srA', 'srB', 'cvB', 'cvA', 'stm0', 'stb25'].forEach(k => ok(TCH.indexOf('g3gm_ph-' + k) >= 0 && TCH.indexOf('g4gm_ph-' + k) >= 0, '老師看板 題庫 沒有 ' + k));

async function run(br, vp) { const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: true });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
  await ctx.addInitScript(() => { window.__PHFAST = 1; window.__PHSAY = []; window.__PHREC = []; window.__PHNOLOGIN = 1; Object.defineProperty(window, 'SCORE_URL', { get: () => '', set: () => {}, configurable: true });
    window.__PHLIVE = { poll(p, ms, cb) { window.__POLL = cb; window.__POLLP = p; return () => {}; }, set(p, v) { (window.__SETS = window.__SETS || []).push([p, v]); } }; });
  const errs = [], pg = async u => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(u + '：' + e.message)); await p.goto(HTTP + '/phonics/' + u); await p.waitForTimeout(350); return p; };
  /* ② 字卡 */
  { const p = await pg('index.html'); const r = await p.evaluate(async () => { const G = document.getElementById('grid'), seen = []; const ob = new MutationObserver(() => seen.push(G.classList.contains('say'))); ob.observe(G, { attributes: true });
      document.getElementById('card').click(); await new Promise(r => setTimeout(r, 900)); ob.disconnect(); const L = G.querySelector('.letter'); return { gold: seen.some(Boolean), css: [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => /\.grid\.say/.test(r.selectorText || '')); } catch (e) { return false; } }) }; });
    ok(r.css, tag + ' 字卡 沒有 金框 樣子'); await p.close(); }
  /* ③ 拼音 地圖 */
  { const p = await pg('map.html#map'); await p.waitForTimeout(300);
    const r = await p.evaluate(async () => { const o = {}, pick = (k, v) => { const b = document.querySelector('[data-mk="' + k + '"][data-mv="' + v + '"]'); if (b) b.click(); return !!b; };
      o.none = pick('o', '無'); pick('v', 'a'); pick('c', 't'); await new Promise(r => setTimeout(r, 60)); o.at = /✅/.test(document.querySelector('#mapOut .cap').innerText) && !document.getElementById('mSay2').disabled;
      pick('o', 'b'); pick('v', 'a'); o.ll = pick('c', 'll'); await new Promise(r => setTimeout(r, 60)); const vt = document.querySelector('#mapOut .bx.v .tl'); o.ballT = vt && vt.dataset.t; o.ballW = [...document.querySelectorAll('#mapOut .wrow .L')].map(e => e.textContent).join('');
      o.lDim = document.querySelector('[data-mk="c"][data-mv="l"]').classList.contains('dim'); o.ff = !!document.querySelector('[data-mk="c"][data-mv="ff"]') && !!document.querySelector('[data-mk="c"][data-mv="ss"]');
      pick('o', 'k'); pick('v', 'i'); pick('c', 'ss'); await new Promise(r => setTimeout(r, 60)); o.kiss = /✅/.test(document.querySelector('#mapOut .cap').innerText);
      document.getElementById('lvA').click(); await new Promise(r => setTimeout(r, 60)); pick('o', 'g'); o.oo2 = pick('v', 'oo2'); pick('c', 'd'); await new Promise(r => setTimeout(r, 60)); const vt2 = document.querySelector('#mapOut .bx.v .tl'); o.goodT = vt2 && vt2.dataset.t; o.good = !document.getElementById('mSay2').disabled;
      document.getElementById('lvB').click(); await new Promise(r => setTimeout(r, 60)); pick('o', 'b'); pick('v', 'u'); pick('c', 't'); await new Promise(r => setTimeout(r, 60)); o.but = !document.getElementById('mSay2').disabled;
      pick('o', 'f'); pick('v', 'a'); pick('c', 'x'); await new Promise(r => setTimeout(r, 60)); o.fax = !document.getElementById('mSay2').disabled;
      pick('o', 'r'); pick('v', 'i'); pick('c', 'ch'); await new Promise(r => setTimeout(r, 60)); window.__PHSAY.length = 0; const w = document.querySelector('#mapOut .wrow'); const g = []; const ob = new MutationObserver(() => g.push(w.classList.contains('gold'))); ob.observe(w, { attributes: true });
      document.getElementById('mSay1').click(); await new Promise(r => setTimeout(r, 900)); o.ech = window.__PHSAY.indexOf('s_ech') >= 0;
      document.getElementById('mSay2').click(); await new Promise(r => setTimeout(r, 300)); ob.disconnect(); o.gold = g.some(Boolean);
      PHM.tab('play'); await new Promise(r => setTimeout(r, 60)); o.games = ['srA', 'srB', 'cvB', 'cvA'].every(k => !!document.querySelector('#gList [data-g="' + k + '"]'));
      return o; });
    ok(r.none && r.at, tag + ' 地圖 字首〔無〕＋at 不 對 ' + JSON.stringify([r.none, r.at]));
    ok(r.ll && r.ballT === 'ao' && r.ballW.indexOf('ball') >= 0, tag + ' ball 的 a 不是 ㄛ：' + r.ballT + ' ' + r.ballW);
    ok(r.lDim && r.ff, tag + ' 短 母音 的 l 沒 變 暗 或 沒有 ff ss'); ok(r.kiss, tag + ' kiss 不是 真的 字');
    ok(r.oo2 && r.goodT === 'oo' && r.good, tag + ' 短 oo good 不 對 ' + r.goodT); ok(r.but && r.fax, tag + ' but／fax 不 能 唸');
    ok(r.ech, tag + ' 字尾 ch 沒 用 s_ech'); ok(r.gold, tag + '〔🔊 整個 字〕沒有 金框'); ok(r.games, tag + ' 遊戲 分頁 沒有 4 個 新 遊戲');
    /* ⑥ 新 遊戲：全對／全錯、✖5／✖1 */
    for (const k of ['srA', 'srB', 'cvB', 'cvA']) { const g = await p.evaluate(async k => { window.__PHREC.length = 0; PHM.start(k); await new Promise(r => setTimeout(r, 60)); const go = document.getElementById('gGo'); if (go) go.click(); await new Promise(r => setTimeout(r, 160)); const sc = [], hv = [];
        for (let i = 0; i < 6; i++) { const G = PHM.G(); if (!G || !G.hk || G.q >= (G.N || 5)) break; if (i === 1 && G.hk.hint) { G.hk.hint(); await new Promise(r => setTimeout(r, 30)); hv.push(document.querySelectorAll('#gbody .srht .tl').length); }
          const s0 = G.score, q0 = G.q; (i < 3 ? G.hk.ok : G.hk.no)(); for (let t = 0; t < 60 && PHM.G() === G && G.q === q0; t++) await new Promise(r => setTimeout(r, 50)); await new Promise(r => setTimeout(r, 120)); sc.push(G.score - s0);
          const B = document.getElementById('gbody'), bad = [...B.querySelectorAll('button,.srs,.op')].filter(e => { const R = e.getBoundingClientRect(); return R.width && (R.right > innerWidth + 1 || R.left < -1); }).length; if (bad) hv.push('超出' + bad); }
        return { sc, hv, rec: window.__PHREC.length }; }, k);
      if (k[0] === 's') { ok(g.sc[0] >= 500 && g.sc[1] > 0 && g.sc[1] < g.sc[0], tag + ' ' + k + ' ✖5／✖1 分數 不 對 ' + JSON.stringify(g.sc)); ok(g.hv[0] > 0, tag + ' ' + k + ' 提示 沒有 音標'); }
      ok(g.sc.length >= 5 && g.sc[3] === 0 && g.rec === 1, tag + ' ' + k + ' 全對／全錯 玩 不完 ' + JSON.stringify(g));
      ok(!g.hv.some(x => /超出/.test(String(x))), tag + ' ' + k + ' 按鈕 超出 螢幕');
      await p.evaluate(() => { const b = document.getElementById('back') || document.getElementById('gx'); if (b) b.click(); }); }
    await p.close(); }
  /* ④ map2 */
  { const p = await pg('map2.html#map'); const r = await p.evaluate(async () => { const o = {}; o.nav = [...document.querySelectorAll('.vnav a')].map(a => a.getAttribute('href')).join(',');
      document.getElementById('pSpell').click(); await new Promise(r => setTimeout(r, 120)); const opt = document.querySelector('.m2p button'), tl = document.querySelector('#m2w .tl');
      o.bg = opt && tl ? [getComputedStyle(opt).backgroundColor, getComputedStyle(tl).backgroundColor, getComputedStyle(tl.closest('.bx') || tl).backgroundColor] : null; const ear = document.getElementById('pEar'); o.ear = ear ? parseFloat(getComputedStyle(ear).fontSize) : 0;
      o.rush = !!document.getElementById('pRush');
      window.__PHSAY.length = 0; document.getElementById('pAns').click(); await new Promise(r => setTimeout(r, 700)); const y = document.querySelector('#pRes').innerText; o.rev = /答案/.test(y) && !!document.querySelector('.pnext'); o.twice = window.__PHSAY.length;
      await new Promise(r => setTimeout(r, 500)); o.stay = /答案/.test(document.querySelector('#pRes').innerText); return o; });
    ok(r.nav === 'map.html#map', tag + ' map2 回 原來 地圖 按鈕 ' + r.nav); ok(r.bg && r.bg[0] !== r.bg[1] && r.bg[0] !== r.bg[2], tag + ' map2 選項 底色 跟 音標 一樣 ' + JSON.stringify(r.bg));
    ok(r.ear >= 28, tag + ' map2〔再 聽 一次〕太 小 ' + r.ear); ok(r.rev && r.twice >= 2 && r.stay, tag + ' map2 公布 答案 沒 唸 兩次 或 自己 跳 了 ' + JSON.stringify(r)); ok(r.rush, tag + ' map2 沒有〔⏱️ 限時 挑戰〕');
    await p.close(); }
  /* ⑤ map3 */
  { const p = await pg('map3.html'); const r = await p.evaluate(async () => { const o = {}; o.nav = [...document.querySelectorAll('.vnav a')].map(a => a.getAttribute('href')).join(',');
      o.lab = [...document.querySelectorAll('#m3sl small')].map(e => e.innerText).join('|'); const w0 = PHM.M3S().y.x.w;
      document.querySelector('[data-m3k="read"]').click(); await new Promise(r => setTimeout(r, 60)); o.k1 = PHM.M3S().y.x.w === w0;
      window.__PHSAY.length = 0; const ck = document.querySelector('#m3w .ck'); ck.click(); await new Promise(r => setTimeout(r, 120)); o.ck = window.__PHSAY.length > 0;
      document.getElementById('m3lv').click(); await new Promise(r => setTimeout(r, 60)); o.k2 = PHM.M3S().y.x.w === w0; document.getElementById('m3lv').click(); await new Promise(r => setTimeout(r, 30));
      document.querySelector('[data-m3k="spell"]').click(); await new Promise(r => setTimeout(r, 60)); o.k3 = PHM.M3S().y.x.w === w0;
      o.tail = true;   /* 第六十一次 老師：〔聽 最後 的 聲音〕暫時 刪除（_verify_61 量 沒有 它）*/ o.rush = !!document.getElementById('m3rush');
      /* 字尾 錯 ＝ 比 一比 */
      let tries = 0; while (tries++ < 30) { PHM.m3New(); const y = PHM.M3S().y; if (y.c !== '無' && y.o) break; }
      const S = PHM.M3S(), y = S.y; S.put.o = y.o; S.put.v = y.v; const wrong = [...document.querySelectorAll('[data-m3b="c"]')].map(b => b.dataset.v).find(v => v !== y.c && v !== '無');
      document.querySelector('[data-m3b="o"][data-v="' + y.o + '"]').click(); document.querySelector('[data-m3b="v"][data-v="' + y.v + '"]').click(); document.querySelector('[data-m3b="c"][data-v="' + wrong + '"]').click();
      await new Promise(r => setTimeout(r, 60)); document.getElementById('m3ck').click(); await new Promise(r => setTimeout(r, 1500)); o.bad = /不對/.test(document.getElementById('m3msg').innerText);
      return o; });
    ok(r.nav === 'map.html#map,map2.html#map', tag + ' map3 回 去 按鈕 ' + r.nav); ok(r.lab === '字首 子音|母音|字尾 子音' || /^母音\|字尾 子音$/.test(r.lab), tag + ' map3 標籤 ' + r.lab);
    ok(r.k1 && r.k2 && r.k3, tag + ' map3 換 模式／等級 題目 變 了 ' + JSON.stringify([r.k1, r.k2, r.k3])); ok(r.ck, tag + ' map3 看 ➜ 讀 點 字母 沒 聲音');
    ok(r.tail, tag + ' map3 沒有〔👂 聽 最後 的 聲音〕'); ok(r.rush, tag + ' map3 沒有〔⏱️ 限時 挑戰〕'); ok(r.bad, tag + ' map3 字尾 錯 沒有 回饋');
    await p.close(); }
  /* 9-(4) kitchen 的 t 同 一條 線、〔➡ 下 一個 單字〕；9-(3) 快速 複習 唸 兩次；4 字尾 按鈕 名字 */
  { const p = await pg('map.html#chain=kitchen'); const r = await p.evaluate(async () => { const i = PHM.SC.length - 1; await PHM.scPlay(i, 'all'); const rows = [...document.querySelectorAll('#stage .wrow')];
      const off = rows.some(r => { const b = [...r.querySelectorAll('.ck .L')].map(L => Math.round(L.getBoundingClientRect().bottom)); return b.length && Math.max(...b) - Math.min(...b) > 1; });
      const nx = document.getElementById('chNx'); return { off, nx: nx && nx.innerText }; });
    ok(!r.off, tag + ' kitchen 的 字母 不 在 同 一條 線'); ok(r.nx && /dining/.test(r.nx), tag + ' 沒有〔➡ 下 一個 單字〕' + r.nx); await p.close(); }
  { const p = await pg('advanced.html'); const r = await p.evaluate(() => { const b = [...document.querySelectorAll('#segEnd button')]; return { t: b.map(x => x.innerText).join('|'), over: b.filter(x => { const R = x.getBoundingClientRect(); return R.right > innerWidth + 1; }).length }; });
    ok(/1 個 子音\|2 個 子音：2 個 聲音\|2 個 字母：1 個 聲音/.test(r.t) && !r.over, tag + ' 進階版 字尾 按鈕 名字 ' + JSON.stringify(r)); await p.close(); }
  /* ⑦ 現場任務 */
  { const p = await pg('map.html?live=0304#map'); await p.waitForTimeout(200);
    const r = await p.evaluate(async () => { const o = {}; try { SCID = '30401'; } catch (e) {} o.poll = window.__POLLP; o.wait = /等 老師/.test(document.getElementById('game').innerText);
      window.__POLL({ on: 1, set: 'pm', t: Date.now(), pk: 'srB', d: 480000 }); await new Promise(r => setTimeout(r, 200)); const G = PHM.G(); o.k = G && G.k; o.N = G && G.N; o.live = G && G.live;
      G.hk.ok(); await new Promise(r => setTimeout(r, 200)); o.pub = (window.__SETS || []).some(s => /crp\/30401$/.test(s[0]) && s[1].n === 1 && s[1].g === 'pm');
      window.__PHREC.length = 0; o.force = window.xForce(); o.rec = window.__PHREC.length; o.msg = /時間 到/.test(document.getElementById('game').innerText);
      window.__POLL({ on: 1, set: 'pm', t: Date.now() + 5, pk: 'stm25' }); await new Promise(r => setTimeout(r, 200)); o.k2 = PHM.G() && PHM.G().k; o.N2 = PHM.G() && PHM.G().N; return o; });
    ok(r.poll === 'rooms/0304/cr' && r.wait, tag + ' 現場任務 沒有 等 老師 ' + JSON.stringify(r)); ok(r.k === 'srB' && r.N === 10 && r.live, tag + ' 現場任務 沒有 開始 srB 10 題 ' + JSON.stringify(r));
    ok(r.pub, tag + ' 現場任務 沒 寫 進度'); ok(r.force && r.rec === 1 && r.msg, tag + ' 時間 到 沒 送 成績 ' + JSON.stringify(r)); ok(r.k2 === 'stm25' && r.N2 === 25, tag + ' 現場任務 25 題 闖關 沒 開始 ' + JSON.stringify(r));
    await p.close(); }
  errs.forEach(e => E.push('JS 例外 ' + tag + '：' + e)); await ctx.close(); }
(async () => { const s = await serve(), br = await chromium.launch();
  for (const vp of [[1180, 820], [1920, 1080]]) await run(br, vp);
  await br.close(); s.close();
  E.slice(0, 40).forEach(m => console.log('✗ ' + m)); console.log((E.length ? '❌' : '✅') + ' 第六十次 phonics：' + n + ' 項，' + E.length + ' 個 失敗'); })();
