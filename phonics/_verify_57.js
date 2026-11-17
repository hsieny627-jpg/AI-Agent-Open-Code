/* phonics/_verify_57.js — 第五十七次 🗺️ 拼音 地圖（map.html、map2.html）量測（node phonics/_verify_57.js；只 印 失敗 項＋一行 總結；取代 _verify_56.js）
 * 第五十七次 多 量：28 段 ✕（逐次／全部 展示／引導 思考）、每 一行 第一個 方框 對齊、音標 不 超出 方框、「子音／母音」不 被 擋、每 個 字母 一個 點、r 藍、ai 的 i 灰、單字 唸 一次、目次、➕ 5 個、隨堂 測驗 ✕ 28（全對／全錯）、地圖 新 字尾 自由 組、ch≠tch、暗 的 組合、你 來 拼／讀、map2 ▲▼、一字 多音 深淺 紅、遊戲 前 複習、彈珠台
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
  const NS = await p.evaluate(() => PHM.SC.length); ok(NS === 30, tag + ' 動畫 段數 ' + NS);
  const capOK = () => p.waitForFunction(() => { const c = document.querySelector('#stage .cap'); return c && c.innerHTML; }, null, { timeout: 20000 });
  for (let i = 0; i < NS; i++) { const mode = ['step', 'all', 'think'][i % 3];
    await p.evaluate(i => { PHM.scCard(i); }, i); ok(await p.evaluate(() => !!document.querySelector('#stage [data-pm="step"]') && !!document.querySelector('#stage [data-pm="all"]') && /🎯/.test(document.querySelector('#stage').innerText) && /💪/.test(document.querySelector('#stage').innerText)), tag + ' 動畫 ' + (i + 1) + ' 開始 卡 沒有 🎯／💪／兩種 播法');
    await p.evaluate(([i, m]) => { window.__PHSAY.length = 0; window.__PHTHINK = 1; PHM.scPlay(i, m); }, [i, mode]); await capOK().catch(() => E.push(tag + ' 動畫 ' + (i + 1) + ' ' + mode + ' 沒有 演完'));
    const r = await p.evaluate(`(()=>{const st=document.getElementById('stage'),rows=[...st.querySelectorAll('.rows .wrow')];const R=e=>e.getBoundingClientRect();
      const tlOut=[...st.querySelectorAll('.tl[data-t]')].filter(t=>{const b=t.closest('.bx'),a=R(t),c=R(b);return a.left<c.left-1||a.right>c.right+1}).map(t=>t.textContent);
      const labHit=[...st.querySelectorAll('.bx .bl')].filter(l=>{const a=R(l);return [...l.parentNode.querySelectorAll('.L')].some(L=>{const c=R(L);return !(a.bottom<=c.top+2||a.top>=c.bottom||a.right<=c.left||a.left>=c.right)})}).length;
      const AL=PHM.SC[${i}]?PHM.SC[${i}].al:null,firstL=rows.filter(w=>!w.querySelector('.syl')||!AL).map(w=>{const b=AL==='v'?[...w.querySelectorAll('.bx')].find(x=>/\b(v|n)\b/.test(x.className)):w.querySelector('.bx');return b?Math.round(R(b).left):0});
      return {n:rows.length,two:getComputedStyle(st.querySelector('.rows')).gridTemplateColumns.split(' ').length,hid:st.querySelectorAll('.bx.hid').length,tl:st.querySelectorAll('.tl.hide').length,
      rows:rows.map(w=>({dots:w.querySelectorAll('.dt i.on').length,all:w.querySelectorAll('.dt i').length})),say:window.__PHSAY.slice(),o:${over},tlOut,labHit,firstL,AL,
      dotsPerCk:[...st.querySelectorAll('.ck')].filter(c=>!c.classList.contains('sil')&&!c.closest('.bx.g')).every(c=>c.querySelectorAll('.dt i').length>=1),
      silNoDot:[...st.querySelectorAll('.ck.sil')].every(c=>!c.querySelectorAll('.dt i').length),
      fs:Math.min(...[...st.querySelectorAll('.ck .L')].map(e=>parseFloat(getComputedStyle(e).fontSize)))}})()`);
    ok(!r.hid && !r.tl, tag + ' 動畫 ' + (i + 1) + ' 還有 沒 出來 的 方框／音標');
    r.rows.forEach((w, k) => ok(w.dots === w.all, tag + ' 動畫 ' + (i + 1) + ' 第 ' + (k + 1) + ' 列 聲音 點 沒 全部 亮'));
    ok(!r.o.length, tag + ' 動畫 ' + (i + 1) + ' 超出 畫面 ' + r.o.join('|')); ok(r.fs >= (r.n >= 3 || await p.evaluate(i => !!PHM.SC[i].how, i) ? 32 : 40), tag + ' 動畫 ' + (i + 1) + ' 字母 太 小 ' + r.fs);
    ok(!r.tlOut.length, tag + ' 動畫 ' + (i + 1) + ' 音標 超出 方框 ' + r.tlOut.join(' ')); ok(!r.labHit, tag + ' 動畫 ' + (i + 1) + ' 「子音／母音」被 字母 擋住 ' + r.labHit);
    ok(r.dotsPerCk && r.silNoDot, tag + ' 動畫 ' + (i + 1) + ' 字母 下面 的 聲音 點 不對');
    if (r.two === 1) ok(Math.max(...r.firstL) - Math.min(...r.firstL) <= 2, tag + ' 動畫 ' + (i + 1) + (r.AL==='v'?' 每 一行 母音 方框 沒 對齊 ':' 每 一行 第一個 方框 沒 對齊 ') + r.firstL.join(','));
    if (mode !== 'all') { const miss = r.say.filter(f => !AU.has(f)); ok(!miss.length && r.say.length >= 2, tag + ' 動畫 ' + (i + 1) + ' 聲音 檔 沒有：' + miss.join(' ')); }
    ok(await p.evaluate(() => !document.querySelector('#stage .qzrow').hidden), tag + ' 動畫 ' + (i + 1) + ' 演完 沒有〔📝 隨堂 測驗〕');
    /* 隨堂 測驗：全對 3／3、全錯 0／3（錯 ＝ 綠底 答錯頁）*/
    for (const m of ['ok', 'no']) { await p.evaluate(([i, m]) => { window.__PHQZ = m; window.__PHQZDONE = []; window.__PHFB = []; PHM.qzStart(i); }, [i, m]);
      await p.waitForFunction(() => window.__PHQZDONE.length, null, { timeout: 15000 }).catch(() => E.push(tag + ' 隨堂 測驗 ' + (i + 1) + ' ' + m + ' 沒有 做完'));
      const q = await p.evaluate(() => window.__PHQZDONE[0] || {}); ok(q.n === 3 && q.ok === (m === 'ok' ? 3 : 0), tag + ' 隨堂 測驗 ' + (i + 1) + ' ' + m + ' ' + JSON.stringify(q));
      await p.evaluate(() => { document.getElementById('game').hidden = true; window.__PHQZ = null; }); } }
  /* 第五十七次 細節：r 藍、ai 的 i 灰、ee 第一個 黃 第二個 灰、wh 的 h 灰、s 後 的 t ＝ ㄉ、單字 唸 一次、目次、➕ 5 個 */
  const det = await p.evaluate(() => { const box = s => { const d = document.createElement('div'); d.innerHTML = PHM.SC.length && document.createElement('div').outerHTML; return d; };
    const P = s => PHM.parse(s)[0]; const sh = P('sh.or.t'), rn = P('r.ai!=ai.n'), se = P('s.ee!=ee.d'), wh = P('wh.i.p'), st = P('st.o=ao.ng'), du = P('d.u.ck');
    return { rr: sh.length === 4 && sh[2].type === 'c' && sh[2].ch[0].l === 'r', ai: rn[1].ch[0].nm === 1 && rn[1].ch[1].sil === 1 && rn[1].ch[1].l === 'i', ee: se[1].ch[0].nm === 1 && se[1].ch[1].sil === 1,
      wh: wh[0].ch[1].sil === 1 && wh[0].ch[1].l === 'h', st: st[0].ch[1].t === 'd_u', ck: du[2].ch[0].sil === 1, short4: PHM.countOf('sh.or.t').n, thin: PHM.countOf('th.i.n').n }; });
  ok(det.rr && det.ai && det.ee && det.wh && det.st && det.ck && det.short4 === 4 && det.thin === 3, tag + ' 顏色／聲音 規則 ' + JSON.stringify(det));
  await p.evaluate(() => { window.__PHSAY = []; localStorage.setItem('phm_one', '1'); }); await p.reload(); await p.waitForTimeout(300);
  await p.evaluate(() => { window.__PHSAY = []; PHM.scPlay(2, 'step'); }); await capOK().catch(() => {}); const sy1 = await p.evaluate(() => window.__PHSAY.filter(f => /^[a-z]+-[a-z]+-[a-z]+$/.test(f)));
  ok(sy1.length === 3, tag + ' 單字 唸 一次：整個 字 唸 了 ' + sy1.length + ' 次（3 個 字）'); await p.evaluate(() => localStorage.setItem('phm_one', '0')); await p.reload(); await p.waitForTimeout(300);
  await p.click('#aIdx'); ok(await p.evaluate(() => document.querySelectorAll('#scIdx .idxg button').length === 30 && !document.getElementById('scIdx').hidden), tag + ' 目次 不對'); await p.click('#idxX');
  const bi = await p.evaluate(() => PHM.SC.findIndex(s => s.k === 'baby')); await p.evaluate(i => PHM.scPlay(i, 'all'), bi); await p.click('#more2');
  ok(await p.evaluate(() => document.querySelectorAll('#more2w .wrow').length) >= 5, tag + ' ➕ 補充 兩 音節 字 少於 5 個'); 
  /* 黃點 ＝ 聲音 數（③ blast 5、⑦ strong 5、⑥ bathroom 6）*/
  const cnt = await p.evaluate(() => [PHM.countOf('bl.a.st').n, PHM.countOf('str.o=ao.ng').n, PHM.countOf('b.a.th|r.oo.m').n, PHM.countOf('b.a.th').n, PHM.countOf('b.a!=ai|b.y').n, PHM.countOf('b.a.th|r.oo.m').v]);
  ok(cnt.join() === '5,5,6,3,4,2', tag + ' 聲音／音節 數 不對 ' + cnt);
  /* 注音 ➜ KK ➜ IPA */
  await p.evaluate(() => { PHM.scPlay(1, 'all'); }); await p.click('#mdSw [data-md="kk"]'); const kk = await p.evaluate(() => [...document.querySelectorAll('#stage .tl[data-t="ae"]')].map(e => e.textContent)); ok(kk.length && kk.every(t => t === 'æ'), tag + ' KK 沒 換 ' + kk);
  await p.click('#mdSw [data-md="zh"]');
  /* ② 地圖：每 一顆 只 換 那 一個 地方、新 字尾 自由 組、ch ≠ tch、暗 的 組合、全部 合 規則 的 組合 都 有 聲音 */
  await p.click('[data-tab="map"]'); await p.waitForTimeout(200);
  for (const lv of ['#lvB', '#lvA']) { await p.click(lv); await p.waitForTimeout(100);
    const gt = await p.$$eval('#s_map .gtabs button', e => e.map(x => x.dataset.gk + ':' + x.dataset.gv)); for (const g of [null].concat(gt)) { if (g) { await p.click('#s_map .gtabs button[data-gk="' + g.split(':')[0] + '"][data-gv="' + g.split(':')[1] + '"]'); await p.waitForTimeout(40); }
    const ch = await p.$$eval('#s_map .chip', e => e.map(x => x.dataset.mk + ':' + x.dataset.mv));
    for (const c of ch.filter((c, i) => i % 4 === 0 || /^c:(pt|ct|xt|lp|lf|lt|sp|mb|ld|lk|nch|ch|tch)$/.test(c))) { const before = await p.evaluate(() => PHM.MS()); await p.click('#s_map .chip[data-mk="' + c.split(':')[0] + '"][data-mv="' + c.split(':')[1] + '"]'); await p.waitForTimeout(25);
      const o = await p.evaluate(`(()=>({bx:document.querySelectorAll('#mapOut .bx').length,o:${over},ms:PHM.MS()}))()`); ok(o.bx >= 2 && !o.o.length, tag + ' 地圖 ' + lv + ' ' + c + ' 不對 ' + o.o.join('|'));
      const k = c.split(':')[0]; ok(['o', 'v', 'c'].every(x => x === k || o.ms[x] === before[x]), tag + ' 地圖 ' + c + ' 點 一個 卻 改了 別的 地方 ' + JSON.stringify(before) + '➜' + JSON.stringify(o.ms)); } } }
  await p.evaluate(() => PHM.mapSet('bl', 'i', 'lt')); await p.evaluate(() => PHM.mapSet('m', 'i', 'ld')); ok(await p.evaluate(() => /例外/.test(document.querySelector('#mapOut').innerText) && document.getElementById('mSay2').disabled), tag + ' mild 例外 字 沒 標');
  await p.evaluate(() => PHM.mapSet('bl', 'i', 'lt')); ok(await p.evaluate(() => PHM.AV.has(PHM.codeOf('bl', 'i', 'lt')) && [...document.querySelectorAll('#mapOut .ck .L')].map(e => e.textContent).join('') === 'blilt' && !document.getElementById('mSay2').disabled), tag + ' 新 字尾 bl＋i＋lt 不能 自由 組／沒 聲音');
  await p.evaluate(() => PHM.mapSet('l', 'u', 'ch')); ok(await p.evaluate(() => [...document.querySelectorAll('#mapOut .ck .L')].map(e => e.textContent).join('') === 'luch'), tag + ' 點 ch 卻 顯示 tch');
  await p.evaluate(() => PHM.mapSet('l', 'u', 'nch')); ok(await p.evaluate(() => [...document.querySelectorAll('#mapOut .ck .L')].map(e => e.textContent).join('') === 'lunch' && /4 個 聲音/.test(document.querySelector('#mapOut .sum').textContent)), tag + ' lunch');
  await p.evaluate(() => PHM.mapSet('l', 'a', 'mb')); ok(await p.evaluate(() => document.querySelector('#mapOut .ck.sil .L').textContent === 'b'), tag + ' mb 的 b 不是 灰色');
  await p.evaluate(() => PHM.mapSet('t', 'a', 'lk')); ok(await p.evaluate(() => /⚠/.test(document.querySelector('#mapOut').innerText) && document.getElementById('mSay2').disabled), tag + ' talk 的 a 會 變 沒 說明');
  await p.evaluate(() => PHM.mapSet('wh', 'i', 'p')); ok(await p.evaluate(() => [...document.querySelectorAll('#mapOut .ck.sil .L')].map(e => e.textContent).join('') === 'h'), tag + ' wh 的 h 不是 灰色');
  await p.evaluate(() => PHM.mapSet('r', 'ai', 'n')); ok(await p.evaluate(() => document.querySelector('#mapOut .ck.nm .L').textContent === 'a' && document.querySelector('#mapOut .ck.sil .L').textContent === 'i'), tag + ' rain 的 a 黃、i 灰');
  await p.evaluate(() => PHM.mapSet('str', 'a', 'nd')); const st = await p.evaluate(() => ({ d: document.querySelectorAll('#mapOut .dt i').length, t: document.querySelector('#mapOut .sum').textContent })); ok(st.d === 6 && /6 個 聲音/.test(st.t), tag + ' strand 聲音 數 ' + JSON.stringify(st));
  const allOK = await p.evaluate(() => PHM.MAPC.all().filter(x => !PHM.AV.has(x.code) && !PHM.BDS.has(x.code)).map(x => x.w)); ok(!allOK.length, tag + ' 地圖 合 規則 的 組合 沒 聲音 ' + allOK.length + '：' + allOK.slice(0, 8).join(' '));
  const mo = await p.evaluate(`(()=>{const R=e=>e.getBoundingClientRect();return [...document.querySelectorAll('#mapOut .tl[data-t]')].filter(t=>{const a=R(t),c=R(t.closest('.bx'));return a.left<c.left-1||a.right>c.right+1}).length})()`); ok(!mo, tag + ' 地圖 音標 超出 方框');
  await p.click('#pSpell'); ok(await p.evaluate(() => !document.getElementById('prac').hidden && /你 來 拼/.test(document.getElementById('prac').innerText)), tag + ' 你 來 拼'); await p.click('#pAns'); await p.waitForTimeout(80); await p.click('#pX');
  await p.click('#pRead'); ok(await p.evaluate(() => /你 來 讀/.test(document.getElementById('prac').innerText) && document.querySelectorAll('#mapOut .tl.hide').length > 0), tag + ' 你 來 讀（音標 先 藏）'); await p.click('#pX');
  /* map2 新 版本：每 個 方框 下面 ▲▼，點 字首 ▼ 只 換 字首 */
  { const p2 = await ctx.newPage(); await p2.goto(HTTP + '/phonics/map2.html'); await p2.waitForTimeout(300); await p2.evaluate(() => PHM.mapSet('b', 'a', 't'));
    const n2 = await p2.evaluate(() => document.querySelectorAll('#m2w .m2a').length); ok(n2 === 3, tag + ' map2 ▲▼ 不是 3 組 ' + n2);
    await p2.click('#m2w [data-m2="o"][data-d="1"]'); const m = await p2.evaluate(() => PHM.MS()); ok(m.o !== 'b' && m.v === 'a' && m.c === 't', tag + ' map2 ▼ 改了 別的 地方 ' + JSON.stringify(m));
    const o2 = await p2.evaluate(over); ok(!o2.length, tag + ' map2 超出 ' + o2.join('|')); await p2.close(); }
  /* ③ 多 音節＋重音 */
  await p.click('[data-tab="syl"]'); await p.click('#sStress'); const sy = await p.evaluate(() => ({ r: document.querySelectorAll('#sylOut .wrow').length, sx: document.querySelectorAll('#sylOut .bx.sx').length, syl: document.querySelectorAll('#sylOut .syl').length }));
  ok(sy.r === 10 && sy.sx >= 10 && sy.syl === 20 && await p.evaluate(() => { const e = document.querySelector('#sylOut .syl'); e.classList.add('hot'); const t = getComputedStyle(e).transform; e.classList.remove('hot'); return t !== 'none'; }), tag + ' 多 音節／重音 ' + JSON.stringify(sy)); ok(!(await p.evaluate(`[...document.querySelectorAll('#sylOut .bx')].filter(e=>e.getBoundingClientRect().right>innerWidth+2).length`)), tag + ' 多 音節 左右 超出');
  await p.click('#sStress');
  /* ④ 一字 多音 */
  await p.click('[data-tab="many"]'); ok((await p.$$('#manyOut .mrow')).length >= 14, tag + ' 一字 多音 太 少');
  const sh = await p.evaluate(() => { const g = document.querySelector('#manyOut .pnl'); return [...g.querySelectorAll('.mrow')].map(r => { const v = r.querySelector('.bx.v'); return v ? getComputedStyle(v).backgroundColor : 'n'; }); });
  ok(new Set(sh.filter(x => x !== 'n')).size >= 3, tag + ' 一字 多音：不同 聲音 沒有 不同 深淺 的 紅 ' + sh.join(' | ')); ok(await p.evaluate(() => document.querySelectorAll('#manyOut .tl[data-t]').length >= 30), tag + ' 一字 多音：字母 下面 沒有 音標');
  /* ⑤ 遊戲 */
  await p.click('[data-tab="play"]'); const GK = await p.evaluate(() => Object.keys(PHM.GM)); ok(GK.length === 10, tag + ' 遊戲 不是 10 種'); ok(await p.evaluate(() => /星環 彈珠台/.test(document.getElementById('gList').innerText)), tag + ' 彈珠台 名字');
  for (const k of GK) for (const mode of ['ok', 'no']) {
    await p.evaluate(() => { window.__PHREC.length = 0; }); await p.evaluate(k => PHM.start(k), k);
    for (let q = 0; q < 5; q++) { await p.waitForFunction(q => { const g = PHM.G(); return g && g.hk && g.lock !== g.q && g.q === q; }, q, { timeout: 8000 }).catch(() => E.push(tag + ' ' + k + ' 第 ' + (q + 1) + ' 題 沒 出來'));
      const o = await p.evaluate(over); ok(!o.length, tag + ' ' + k + ' 第 ' + (q + 1) + ' 題 超出 ' + o.join('|'));
      const fs2 = await p.evaluate(() => Math.min(...[...document.querySelectorAll('#gbody button')].filter(b => b.offsetParent).map(b => parseFloat(getComputedStyle(b).fontSize)))); ok(fs2 >= 18, tag + ' ' + k + ' 按鈕 字 太 小 ' + fs2);
      await p.evaluate(m => { try { PHM.G().hk[m](); } catch (e) { window.__hkerr = e.message; } }, mode); await p.waitForTimeout(60); }
    await p.waitForFunction(() => document.querySelector('.res2'), null, { timeout: 8000 }).catch(() => E.push(tag + ' ' + k + ' ' + mode + ' 沒有 結果 頁'));
    const g = await p.evaluate(() => { const g = PHM.G(); return { ok: g.ok, rk: document.querySelector('.res2') && document.querySelector('.res2').dataset.rk, rec: window.__PHREC.slice(), err: window.__hkerr, idx: g.Q.map(x => x[5]) }; });
    ok(mode === 'ok' ? g.ok === 5 && g.rk === 'S' : g.ok === 0 && g.rk === 'C', tag + ' ' + k + ' ' + mode + ' 分數 不對 ' + JSON.stringify(g));
    ok(g.rec.length === 1 && g.rec[0].set === 'g3gm_ph-' + k && g.rec[0].n === 5, tag + ' ' + k + ' 成績 ' + JSON.stringify(g.rec)); ok(g.idx.every(i => i >= 0), tag + ' ' + k + ' 第幾題 不對');
    if (mode === 'no') { const w = await p.evaluate(() => ({ n: document.querySelectorAll('#wl .mrow').length, t: document.querySelectorAll('#wl .tl[data-t]').length })); ok(w.n === 5 && w.t >= 10, tag + ' ' + k + ' 錯題 清單（字母 下面 要 有 音標）' + JSON.stringify(w)); }
    await p.evaluate(() => { document.getElementById('gx').click(); window.__hkerr = null; }); }
  /* 25 題 闖關：組合 跟 上次 不同、25 題 */
  const s1 = await p.evaluate(() => [...new Set(PHM.q25Seq())].sort().join()), s2 = await p.evaluate(() => [...new Set(PHM.q25Seq())].sort().join()), len = await p.evaluate(() => PHM.q25Seq().length);
  ok(s1 !== s2 && len === 25, tag + ' 25 題 闖關 組合 一樣 ' + s1 + ' / ' + s2);
  await p.evaluate(() => PHM.start('q25')); for (let q = 0; q < 25; q++) { await p.waitForFunction(q => { const g = PHM.G(); return g && g.hk && g.lock !== g.q && g.q === q; }, q, { timeout: 8000 }).catch(() => E.push(tag + ' q25 第 ' + (q + 1) + ' 題 沒 出來')); await p.evaluate(q => PHM.G().hk[q % 3 ? 'ok' : 'no'](), q); await p.waitForTimeout(40); }
  await p.waitForFunction(() => document.querySelector('.res2'), null, { timeout: 8000 }).catch(() => E.push(tag + ' q25 沒有 結果'));
  ok(await p.evaluate(() => PHM.G().Q.length === 25 && window.__PHREC.some(r => r.k === 'q25' && r.n === 25)), tag + ' q25 成績 不對');
  ok(!errs.length, tag + ' 程式 錯誤 ' + errs.slice(0, 3).join('｜')); await ctx.close(); }
(async () => { const srv = await serve(), br = await chromium.launch(); for (const vp of (process.env.VP ? [process.env.VP.split('x').map(Number)] : [[1024, 768], [768, 1024], [1920, 1080]])) await run(br, vp);
  await br.close(); srv.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 🗺️ 拼音 地圖：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
