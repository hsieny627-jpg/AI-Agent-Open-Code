/* phonics/_verify_56.js — 第五十六次 🗺️ 拼音 地圖（map.html）量測（node phonics/_verify_56.js；只 印 失敗 項＋一行 總結）
 * 三種 螢幕（iPad 橫 1024×768、iPad 直 768×1024、教室 觸控 1920×1080）：
 * ① 秒懂 動畫 13 段：每 段 演完、方框／字母／音標／黃點 都 出現、黃點 數 ＝ 聲音 數、不 超出 畫面、每 個 要 唸 的 聲音 都 有 檔；注音／KK／IPA 切換
 * ② 拼音 地圖：基礎、進階、每 一個 字尾 新 例字、ld lk 標註、mb 灰色 ③ 多 音節＋重音 開關 ④ 一字 多音
 * ⑤ 10 種 遊戲 ✕（全對、全錯）＋25 題 闖關（組合 跟 上次 不同）：不 超出、答錯頁、成績 g3gm_ph-<代號> */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = '';
const ok = (c, m) => { n++; if (!c) E.push(m); };
const AU = new Set(fs.readdirSync(path.join(__dirname, 'au')).map(f => f.replace('.mp3', '')));
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
const over = `(()=>{const o=[];document.querySelectorAll('#stage .bx,#mapOut .bx,#sylOut .bx,#gbody button,#gbody .bx,#fb .bx,.mon,.coin,.bub').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&(r.right>innerWidth+2||r.left<-2||r.bottom>innerHeight+2))o.push((e.textContent||e.className).slice(0,20))});return o})()`;
async function run(br, vp) { const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: true });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
  await ctx.addInitScript(() => { window.__PHFAST = 1; window.__PHAUTO = 1; window.__PHSAY = []; window.__PHREC = []; window.__PHNOLOGIN = 1; Object.defineProperty(window, 'SCORE_URL', { get: () => '', set: () => {}, configurable: true }); });
  const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(HTTP + '/phonics/map.html#ani'); await p.waitForTimeout(300);
  const NS = await p.evaluate(() => PHM.SC.length); ok(NS === 13, tag + ' 動畫 段數 ' + NS);
  for (let i = 0; i < NS; i++) { await p.evaluate(i => { window.__PHSAY.length = 0; PHM.scPlay(i); }, i); await p.waitForFunction(() => (document.getElementById('cap') || {}).innerHTML, null, { timeout: 15000 }).catch(() => E.push(tag + ' 動畫 ' + (i + 1) + ' 沒有 演完'));
    const r = await p.evaluate(`(()=>{const rows=[...document.querySelectorAll('#stage .wrow')];return {hid:document.querySelectorAll('#stage .bx.hid').length,tl:document.querySelectorAll('#stage .tl.hide').length,
      rows:rows.map(w=>({dots:w.querySelectorAll('.dots i.on').length,all:w.querySelectorAll('.dots i').length})),sums:[...document.querySelectorAll('#stage .sum')].map(s=>s.textContent),say:window.__PHSAY.slice(),o:${over},
      fs:Math.min(...[...document.querySelectorAll('#stage .ck .L')].map(e=>parseFloat(getComputedStyle(e).fontSize)))}})()`);
    ok(!r.hid && !r.tl, tag + ' 動畫 ' + (i + 1) + ' 還有 沒 出來 的 方框／音標');
    r.rows.forEach((w, k) => ok(w.dots === w.all, tag + ' 動畫 ' + (i + 1) + ' 第 ' + (k + 1) + ' 列 黃點 沒 全部 亮'));
    ok(!r.o.length, tag + ' 動畫 ' + (i + 1) + ' 超出 畫面 ' + r.o.join('|')); ok(r.fs >= 40, tag + ' 動畫 ' + (i + 1) + ' 字母 太 小 ' + r.fs);
    const miss = r.say.filter(f => !AU.has(f)); ok(!miss.length && r.say.length >= 4, tag + ' 動畫 ' + (i + 1) + ' 聲音 檔 沒有：' + miss.join(' '));
  }
  /* 黃點 ＝ 聲音 數（③ blast 5、⑦ strong 5、⑥ bathroom 6）*/
  const cnt = await p.evaluate(() => [PHM.countOf('bl.a.st').n, PHM.countOf('str.o=ao.ng').n, PHM.countOf('b.a.th|r.oo.m').n, PHM.countOf('b.a.th').n, PHM.countOf('b.a!=ai|b.y').n, PHM.countOf('b.a.th|r.oo.m').v]);
  ok(cnt.join() === '5,5,6,3,4,2', tag + ' 聲音／音節 數 不對 ' + cnt);
  /* 注音 ➜ KK ➜ IPA */
  await p.click('#mdSw [data-md="kk"]'); const kk = await p.evaluate(() => [...document.querySelectorAll('#stage .tl[data-t="ae"]')].map(e => e.textContent)); ok(kk.length && kk.every(t => t === 'æ'), tag + ' KK 沒 換 ' + kk);
  await p.click('#mdSw [data-md="zh"]');
  /* ② 地圖 */
  await p.click('[data-tab="map"]'); await p.waitForTimeout(200);
  for (const lv of ['#lvB', '#lvA']) { await p.click(lv); await p.waitForTimeout(100); const ch = await p.$$eval('#s_map .chip', e => e.map(x => x.dataset.mk + ':' + x.dataset.mv));
    for (const c of ch.filter((c, i) => i % 3 === 0 || /^c:(pt|ct|xt|lp|lf|lt|sp|mb|ld|lk|nch)$/.test(c))) { await p.click('#s_map .chip[data-mk="' + c.split(':')[0] + '"][data-mv="' + c.split(':')[1] + '"]'); await p.waitForTimeout(30);
      const o = await p.evaluate(`(()=>({bx:document.querySelectorAll('#mapOut .bx').length,o:${over},t:document.querySelector('#mapOut').innerText}))()`); ok(o.bx >= 2 && !o.o.length, tag + ' 地圖 ' + lv + ' ' + c + ' 不對 ' + o.o.join('|')); } }
  await p.click('#s_map .chip[data-mv="ld"]'); ok(/母音 會 變/.test(await p.innerText('#mapOut')), tag + ' ld 沒有 標註');
  await p.click('#s_map .chip[data-mv="mb"]'); ok(await p.evaluate(() => [...document.querySelectorAll('#mapOut .ck .L')].pop().classList.contains('gr')), tag + ' mb 的 b 不是 灰色');
  await p.click('#lvA'); await p.click('#s_map .chip[data-mv="str"]'); await p.click('#s_map .chip[data-mv="a"]'); await p.click('#s_map .chip[data-mv="nd"]');
  const st = await p.evaluate(() => ({ d: document.querySelectorAll('#mapOut .dots i').length, t: document.querySelector('#mapOut .sum').textContent })); ok(st.d === 6 && /6 個 聲音/.test(st.t), tag + ' strand 聲音 數 ' + JSON.stringify(st));
  /* ③ 多 音節＋重音 */
  await p.click('[data-tab="syl"]'); await p.click('#sStress'); const sy = await p.evaluate(() => ({ r: document.querySelectorAll('#sylOut .wrow').length, sx: document.querySelectorAll('#sylOut .bx.sx').length, syl: document.querySelectorAll('#sylOut .syl').length }));
  ok(sy.r === 10 && sy.sx >= 10 && sy.syl === 20, tag + ' 多 音節／重音 ' + JSON.stringify(sy)); ok(!(await p.evaluate(over)).length, tag + ' 多 音節 超出');
  await p.click('#sStress');
  /* ④ 一字 多音 */
  await p.click('[data-tab="many"]'); ok((await p.$$('#manyOut .mrow')).length >= 10, tag + ' 一字 多音 太 少');
  /* ⑤ 遊戲 */
  await p.click('[data-tab="play"]'); const GK = await p.evaluate(() => Object.keys(PHM.GM)); ok(GK.length === 10, tag + ' 遊戲 不是 10 種');
  for (const k of GK) for (const mode of ['ok', 'no']) {
    await p.evaluate(() => { window.__PHREC.length = 0; }); await p.evaluate(k => PHM.start(k), k);
    for (let q = 0; q < 5; q++) { await p.waitForFunction(q => { const g = PHM.G(); return g && g.hk && g.lock !== g.q && g.q === q; }, q, { timeout: 8000 }).catch(() => E.push(tag + ' ' + k + ' 第 ' + (q + 1) + ' 題 沒 出來'));
      const o = await p.evaluate(over); ok(!o.length, tag + ' ' + k + ' 第 ' + (q + 1) + ' 題 超出 ' + o.join('|'));
      const fs2 = await p.evaluate(() => Math.min(...[...document.querySelectorAll('#gbody button')].filter(b => b.offsetParent).map(b => parseFloat(getComputedStyle(b).fontSize)))); ok(fs2 >= 18, tag + ' ' + k + ' 按鈕 字 太 小 ' + fs2);
      await p.evaluate(m => { try { PHM.G().hk[m](); } catch (e) { window.__hkerr = e.message; } }, mode); await p.waitForTimeout(60); }
    await p.waitForFunction(() => document.querySelector('.res2'), null, { timeout: 8000 }).catch(() => E.push(tag + ' ' + k + ' ' + mode + ' 沒有 結果 頁'));
    const g = await p.evaluate(() => { const g = PHM.G(); return { ok: g.ok, rk: document.querySelector('.res2') && document.querySelector('.res2').textContent, rec: window.__PHREC.slice(), err: window.__hkerr, idx: g.Q.map(x => x[5]) }; });
    ok(mode === 'ok' ? g.ok === 5 && g.rk === 'S' : g.ok === 0 && g.rk === 'C', tag + ' ' + k + ' ' + mode + ' 分數 不對 ' + JSON.stringify(g));
    ok(g.rec.length === 1 && g.rec[0].set === 'g3gm_ph-' + k && g.rec[0].n === 5, tag + ' ' + k + ' 成績 ' + JSON.stringify(g.rec)); ok(g.idx.every(i => i >= 0), tag + ' ' + k + ' 第幾題 不對');
    if (mode === 'no') { const w = await p.evaluate(() => document.querySelectorAll('#wl .mrow').length); ok(w === 5, tag + ' ' + k + ' 錯題 清單 ' + w); }
    await p.evaluate(() => { document.getElementById('gx').click(); window.__hkerr = null; }); }
  /* 25 題 闖關：組合 跟 上次 不同、25 題 */
  const s1 = await p.evaluate(() => [...new Set(PHM.q25Seq())].sort().join()), s2 = await p.evaluate(() => [...new Set(PHM.q25Seq())].sort().join()), len = await p.evaluate(() => PHM.q25Seq().length);
  ok(s1 !== s2 && len === 25, tag + ' 25 題 闖關 組合 一樣 ' + s1 + ' / ' + s2);
  await p.evaluate(() => PHM.start('q25')); for (let q = 0; q < 25; q++) { await p.waitForFunction(q => { const g = PHM.G(); return g && g.hk && g.lock !== g.q && g.q === q; }, q, { timeout: 8000 }).catch(() => E.push(tag + ' q25 第 ' + (q + 1) + ' 題 沒 出來')); await p.evaluate(q => PHM.G().hk[q % 3 ? 'ok' : 'no'](), q); await p.waitForTimeout(40); }
  await p.waitForFunction(() => document.querySelector('.res2'), null, { timeout: 8000 }).catch(() => E.push(tag + ' q25 沒有 結果'));
  ok(await p.evaluate(() => PHM.G().Q.length === 25 && window.__PHREC.some(r => r.k === 'q25' && r.n === 25)), tag + ' q25 成績 不對');
  ok(!errs.length, tag + ' 程式 錯誤 ' + errs.slice(0, 3).join('｜')); await ctx.close(); }
(async () => { const srv = await serve(), br = await chromium.launch(); for (const vp of [[1024, 768], [768, 1024], [1920, 1080]]) await run(br, vp);
  await br.close(); srv.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 🗺️ 拼音 地圖：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
