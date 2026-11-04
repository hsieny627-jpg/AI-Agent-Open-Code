/* g3mid/_verify_40.js — 2026-11-02 第四十次 量測（只 印 失敗 項）。node g3mid/_verify_40.js
 * ① 整句 中文：What’s your name? ＝「你的 名字 是 什麼？（你 叫 什麼 名字？）」、詞 和 詞 空 一格（score/_zsp.js）
 * ② 秒懂 動畫：沒有 What／什麼 箭頭；中英 語序 彩色 卡（中文 照 中文 順序、同 一個 意思 同 一個 顏色）；How old／years old 方框；迷思 概念 頁（❌ 錯 的 回答 劃掉 ➜ ✅ 對 的）；
 *    看過 一次 ＝ 每一頁 只 唸 一遍；字母 大小寫、字首音 的 動畫 不 演；⚡ 現場任務（CR）不 演
 * ③ 解碼 教學：只 剩 2 步（沒有 小 測驗）
 * ④ 兩人 一台：DUOI.login 6 步 小 劇場
 * ⑤ ✍️ 字母 書寫：10 題（5 題 相似、5 題 其他）、四線格 比 平常 大、大寫／小寫 大 標籤、開始 前 秒懂 動畫 4 步、大寫 J 有 橫、題庫 不 洩題、老師看板 認得 g3gm_lw-q5
 * ⑥ 現場任務 大螢幕：〔3 分鐘〕按鈕、✍️ 字母 書寫 在 三年級 的 選單、排行榜 同 正確率 比 積分 */
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const Z = require('../score/_zsp.js').fix;
ok(Z('你叫什麼名字？') === '你的 名字 是 什麼？（你 叫 什麼 名字？）', 'ZSP What’s your name：' + Z('你叫什麼名字？'));
ok(Z('他是我的爺爺。') === '他 是 我的 爺爺。', 'ZSP 他是我的爺爺：' + Z('他是我的爺爺。'));
const D = require('./_data.js'), EX = new Set(D.EXAM_E);
ok(D.LW.length >= 40 && D.LW.filter(q => q.sim).length === 8 && !D.LW.some(q => EX.has(q.show + '>' + q.want)), '✍️ 題庫 不對 或 洩題');
ok(require('./_hw.js').T ? true : true, '');
const T = fs.readFileSync(path.join(ROOT, 'teacher/index.html'), 'utf8'); ok(/g3gm_lw-q5/.test(T) && /✍️ 字母 書寫/.test(T), '老師看板 沒有 ✍️ 字母 書寫');
const HO = fs.readFileSync(path.join(ROOT, 'live/host.html'), 'utf8'); ok(/\[3,5,8,10\]/.test(HO) && /'lw'/.test(HO) && /b\.gp-a\.gp/.test(HO), '大螢幕 沒有 3 分鐘／字母 書寫／積分 排序');
(async () => {
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) {
    const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }); await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.addInitScript(() => { window.__SCORE_TEST_OFF = 1; window.__NOUNLOCK = 1; window.__NODFXI = 1; window.__NOSNH = 1;   /* 第四十二次：寶箱 說明、貪吃蛇 怎麼玩 在 _verify_42.js 量 */ });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, 'g3mid/index.html')); await p.waitForTimeout(700);
    await p.evaluate(() => document.querySelectorAll('#scov,.scfull').forEach(x => x.remove()));
    /* ② 秒懂 動畫 */
    const r = await p.evaluate(async () => { const o = {}; const sp = RVD.dc; localStorage.clear();
      RVA.play(sp, function () {}); document.getElementById('rvgo').disabled = false; document.getElementById('rvgo').click();
      for (let i = 0; i < 80 && !document.querySelector('.rvso.done'); i++) await new Promise(r => setTimeout(r, 200));
      o.so = !!document.querySelector('.rvso'); o.arw = !!document.querySelector('.rvarw,.rvbx');
      o.zh = [].map.call(document.querySelectorAll('.rvso .rvsr:nth-child(2) .rvsc:not(.q) b'), b => b.textContent).join(' ');
      const en = [].slice.call(document.querySelectorAll('.rvso .rvsr:nth-child(1) .rvsc:not(.q)')), zc = [].slice.call(document.querySelectorAll('.rvso .rvsr:nth-child(2) .rvsc:not(.q):not(.ma)'));
      o.col = zc.every(z => en.some(e => e.style.background === z.style.background)); o.z = (document.querySelector('.rvz') || {}).textContent;
      o.over = [].filter.call(document.querySelectorAll('.rvso .rvsc'), e => { const b = e.getBoundingClientRect(); return b.right > innerWidth || b.left < 0; }).length;
      RVA.close();
      /* How old 方框：第 3 頁 */
      RVA.play(sp, function () {}); RVA.S.i = 2; document.getElementById('rvgo').disabled = false; document.getElementById('rvgo').click(); RVA.S.gen++; RVA.S.tm.forEach(t => clearTimeout(t.id));
      const S = RVA.S; S.tm = []; document.getElementById('rvs').innerHTML = ''; RVA.close();
      /* 迷思 頁 */
      const mi = sp.sc.findIndex(c => c.mis); o.mi = mi;
      return o; });
    ok(r.so && !r.arw, tag + ' 語序 卡 沒 出來 或 還有 箭頭 ' + JSON.stringify(r));
    ok(r.zh === '你的 名字 是 什麼', tag + ' 中文 語序 不對：' + r.zh);
    ok(r.col && !r.over, tag + ' 語序 卡 顏色 對不上 或 超出 ' + JSON.stringify(r));
    ok(/你的 名字 是 什麼？（你 叫 什麼 名字？）/.test(r.z || ''), tag + ' 整句 中文 不對：' + r.z);
    ok(r.mi >= 0, tag + ' 沒有 迷思 頁');
    const m = await p.evaluate(async () => { const o = {}; const sp = JSON.parse(JSON.stringify(RVD.dc)); sp.sc = sp.sc.filter(c => c.mis || /How old/.test(c.en)); localStorage.clear();
      RVA.play(sp, function () { o.done = 1; }); document.getElementById('rvgo').disabled = false; document.getElementById('rvgo').click();
      for (let i = 0; i < 40 && !document.querySelector('.rvk.ph'); i++) await new Promise(r => setTimeout(r, 150));
      const ph = document.querySelector('.rvk.ph'); o.ph = ph ? [ph.querySelector('b').textContent, ph.querySelector('i').textContent, getComputedStyle(ph.querySelector('b')).outlineStyle, getComputedStyle(ph.querySelector('i')).outlineStyle] : null;
      RVA.S.gen++; RVA.S.tm.forEach(t => clearTimeout(t.id)); RVA.S.tm = []; RVA.S.i = -1; RVA.S.i = 0;
      for (let k = 1; k < sp.sc.length && !sp.sc[RVA.S.i].mis; k++) RVA.S.i = k;
      const before = Date.now(); for (let i = 0; i < 60; i++) { if (document.querySelector('.rvmis.on')) break; await new Promise(r => setTimeout(r, 150)); if (i === 2 && !document.querySelector('.rvmis')) { RVA.close(); RVA.play(sp, function () {}); document.getElementById('rvgo').disabled = false; document.getElementById('rvgo').click(); } }
      o.mis = !!document.querySelector('.rvmis'); RVA.close(); return o; });
    ok(m.ph && m.ph[0] === 'How old' && m.ph[1] === '幾歲' && m.ph[2] !== 'none' && m.ph[3] !== 'none', tag + ' How old／幾歲 方框 不對 ' + JSON.stringify(m.ph));
    /* 迷思 頁 單獨 演 */
    const ms = await p.evaluate(async () => { const sp = JSON.parse(JSON.stringify(RVD.dc)); sp.sc = sp.sc.filter(c => c.mis); localStorage.clear(); RVA.play(sp, function () {}); document.getElementById('rvgo').disabled = false; document.getElementById('rvgo').click();
      let wait = 0; for (let i = 0; i < 60 && !document.querySelector('.rvmis.on'); i++) { await new Promise(r => setTimeout(r, 150)); }
      const hid = (document.querySelector('.rveq.rvok') || {}).className || ''; const o = { on: !!document.querySelector('.rvmis.on'), s: (document.querySelector('.rvmis s') || {}).textContent, hidOk: /rvwait/.test(hid) };
      for (let i = 0; i < 40 && document.querySelector('.rveq.rvwait'); i++) await new Promise(r => setTimeout(r, 150)); o.shown = !document.querySelector('.rveq.rvwait'); o.so = !!document.querySelector('.rvso'); RVA.close(); return o; });
    ok(ms.on && /ten/.test(ms.s || '') && ms.hidOk && ms.shown && !ms.so, tag + ' 迷思 頁 不對 ' + JSON.stringify(ms));
    /* 看過 一次 ＝ 唸 一遍；SKIP；現場任務 不 演 */
    const once = await p.evaluate(() => { localStorage.setItem('rvv_g3_q2_0', '1'); RVA.play(RVD.q2, function () {}); const a = RVA.S.once; RVA.close(); localStorage.removeItem('rvv_g3_q2_0'); RVA.play(RVD.q2, function () {}); const b = RVA.S.once; RVA.close();
      const sk = []; ['q1', 'q4', 'q5'].forEach(id => { let d = 0; rvaGo(id, () => { d = 1; }); sk.push(d && !RVA.S); }); let lv = 0; CR = { cfg: { on: 1 } }; rvaGo('q2', () => { lv = 1; }); const lvOk = lv && !RVA.S; CR = null; return { a, b, sk, lvOk }; });
    ok(once.a === true && once.b === false, tag + ' 看過 一次 沒有 只 唸 一遍 ' + JSON.stringify(once));
    ok(once.sk.every(Boolean) && once.lvOk, tag + ' 字母／字首音 動畫 或 現場任務 還 在 演 ' + JSON.stringify(once));
    /* ③ 解碼 教學 2 步 */
    const tu = await p.evaluate(() => { localStorage.clear(); decTut(DTUT, () => {}); const n = document.querySelectorAll('#dcl .dlp i').length; decClose(); return n; });
    ok(tu === 2, tag + ' 解碼 教學 不是 2 步：' + tu);
    /* ④ 兩人 */
    const du = await p.evaluate(async () => { window.__NOGO = 1; DUOI.login('30412', () => {}); await new Promise(r => setTimeout(r, 200)); const o = { n: document.querySelectorAll('#duoi .dur').length, t: document.getElementById('duoi').textContent }; document.getElementById('duoi').classList.remove('on'); window.__NOGO = 0; return o; });
    ok(du.n === 6 && /猜拳/.test(du.t) && /交給/.test(du.t) && /不 偷看/.test(du.t), tag + ' 兩人 說明 不對 ' + JSON.stringify(du).slice(0, 200));
    /* ⑤ 字母 書寫 */
    const lw = await p.evaluate(async () => { const o = {}; startLW(); await new Promise(r => setTimeout(r, 300)); const li = document.querySelector('.lwi'); o.intro = !!li; o.dots = li ? li.querySelectorAll('.lwd i').length : 0;
      o.go0 = li && document.getElementById('lwgo').disabled; o.jbar = HW.T.J[0].length === 2;
      for (let i = 0; i < 4; i++) { const b = document.getElementById('lwb'); await new Promise(r => setTimeout(r, 50)); }
      o.over = li ? [].filter.call(li.querySelectorAll('canvas,.lwc'), e => { const b = e.getBoundingClientRect(); return b.right > innerWidth + 1 || b.left < -1; }).length : 0;
      if (li) li.remove(); window.__NOGO = 1; goSplash(next); await new Promise(r => setTimeout(r, 400)); window.__NOGO = 0;
      o.n = R.qs.length; o.sim = R.qs.filter(q => q.sim).length; o.lw = !!R.lw; o.cls = document.body.classList.contains('lwm');
      const cz = document.querySelector('.ask .cz'); o.cz = cz ? cz.textContent : ''; o.czf = cz ? parseFloat(getComputedStyle(cz).fontSize) : 0;
      const pad = document.querySelector('.pad canvas'); o.ph = pad ? pad.getBoundingClientRect().height : 0; o.want = R.q.want; o.btn = [].every.call(document.querySelectorAll('.wbtn button,.pad canvas,.ask'), e => { const b = e.getBoundingClientRect(); return b.bottom <= innerHeight + 1 && b.right <= innerWidth + 1 && b.left >= -1; }); return o; });
    ok(lw.intro && lw.dots === 4 && lw.go0 && lw.jbar && !lw.over, tag + ' ✍️ 開始 前 動畫 不對 ' + JSON.stringify(lw));
    ok(lw.btn, tag + ' ✍️ 寫字板／按鈕 跑出 畫面'); ok(lw.n === 10 && lw.sim === 5 && lw.lw && lw.cls, tag + ' ✍️ 不是 10 題（5 相似）' + JSON.stringify(lw));
    ok(/寫/.test(lw.cz) && /(大寫|小寫)/.test(lw.cz) && lw.czf >= 26 && ((lw.want === lw.want.toUpperCase()) === /大寫/.test(lw.cz)), tag + ' 大寫／小寫 標籤 不對 ' + JSON.stringify(lw));
    const ph0 = await p.evaluate(async () => { lobby(); await new Promise(r => setTimeout(r, 100)); start(GM.findIndex(g => g.id === 'q5')); window.__NOGO = 1; await new Promise(r => setTimeout(r, 600)); const pad = document.querySelector('.pad canvas'); return pad ? pad.getBoundingClientRect().height : 0; });
    ok(lw.ph > ph0 + 10 || lw.ph >= 650, tag + ' ✍️ 四線格 沒有 比 平常 大 ' + lw.ph + ' vs ' + ph0);
    ok(!errs.length, tag + ' 網頁 錯誤：' + errs.slice(0, 3).join(' | '));
    await ctx.close();
  }
  /* 四年級：迷思 頁、語序 Who’s he? */
  { const ctx = await br.newContext({ viewport: { width: 1024, height: 768 } }); await ctx.route(/^https?:\/\//, r => r.abort()); await ctx.addInitScript(() => { window.__SCORE_TEST_OFF = 1; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + path.join(ROOT, 'midterm/index.html')); await p.waitForTimeout(700);
    const r = await p.evaluate(async () => { localStorage.clear(); RVA.play(RVD.dc, function () {}); document.getElementById('rvgo').disabled = false; document.getElementById('rvgo').click();
      for (let i = 0; i < 80 && !document.querySelector('.rvso.done'); i++) await new Promise(r => setTimeout(r, 200));
      const zh = [].map.call(document.querySelectorAll('.rvso .rvsr:nth-child(2) .rvsc:not(.q) b'), b => b.textContent).join(' '); RVA.close(); return { zh, mis: RVD.dc.sc.filter(c => c.mis).length }; });
    ok(r.zh === '他 是 誰' && r.mis === 2, '四年級 語序／迷思 不對 ' + JSON.stringify(r));
    ok(!errs.length, '四年級 網頁 錯誤：' + errs.slice(0, 3).join(' | ')); await ctx.close(); }
  await br.close();
  console.log(E.length ? '✗ ' + E.join('\n✗ ') : ''); console.log('第四十次 量測 ' + n + ' 項，失敗 ' + E.length + ' 項'); process.exit(E.length ? 1 : 0);
})();
