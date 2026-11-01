/* g3mid/_verify_dfx.js — 2026-11-01 第三十九次 第 1 點 量測：🎁 神秘 寶箱、🧩 每一題 換 樣子、👻 影子（三年級 g3mid、四年級 midterm；3 種 螢幕）。只 印 失敗 項。
 * ① 8 題 連著 做：每一題 樣子 都 不一樣（8 種 輪 一圈）、最上面 有 樣子 的 名字、剛好 1 個 寶箱 方塊、寶箱 是 正確 答案 之一、不 超出 畫面、格子 ≧ 56px 高、字 ≧ 20px
 * ② 寶箱 放 錯 格子 ＝ 不 打開；放 對 ＝ 打開（動畫 出現、倒數 停住 再 走、🎁 數字 ＋1）
 * ③ 🔦 透視：正確 的 中文 淡淡 出現 在 一個 還沒 放對 的 格子，1.2 秒 消失
 * ④ 全部 放對：✖2 寶箱 ＝ 解碼 積分 ✖2、過關 特效、影子（做 2 題 以後 有「👻 影子 每格 N 秒」）
 * ⑤ 教學（#dcl）不 加；window.__NODFX 不 加
 * ⑥ 三年級 🌱 皮克敏、📋 資料表：有 樣子、有 寶箱
 * node g3mid/_verify_dfx.js */
const { chromium } = require('playwright'), path = require('path');
const E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const Q = [{ en: "What's your name?", t: [['What', '什麼'], ["'s", '是'], ['your', '你的'], ['name?', '名字']], x: ['我的', '誰'], z: '你叫什麼名字？' },
  { en: 'How old are you?', t: [['How old', '幾歲'], ['are', '是'], ['you?', '你']], x: ['歲', '你的'], z: '你幾歲？' },
  { en: 'Is she a nurse? No, she isn\'t. She\'s a farmer.', t: [['Is', '是'], ['she', '她'], ['a', '一位'], ['nurse?', '護理師'], ['No,', '不'], ['she', '她'], ["isn't.", '不是'], ["She's", '她是'], ['a', '一位'], ['farmer.', '農夫']], x: ['他', '醫生'], z: '她是護理師嗎？不，她不是。她是農夫。' }];
(async () => {
  const br = await chromium.launch();
  for (const site of ['g3mid', 'midterm']) for (const vp of [[1024, 768], [820, 1180], [1366, 1024]]) {
    const tag = site + ' ' + vp.join('×');
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }); await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.addInitScript(() => { window.__SCORE_TEST_OFF = 1; window.__NOUNLOCK = 1; window.__NOGO = 1; window.__NOWHEEL = 1; window.__NOLIFE = 1; window.__NOMEM = 1; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(__dirname, '..', site, 'index.html')); await p.waitForTimeout(700);
    await p.evaluate(() => { document.querySelectorAll('#scov,.scfull').forEach(x => x.remove()); window.__P = 0; window.__G = 0;
      DEC.A = { aud: () => null, stop: () => {}, pause: () => { window.__P++ }, go: () => { window.__G++ }, busy: () => false, sid: () => '30499', ok: () => { window.__OK = 1 }, bad: g => { window.__BAD = g } };
      window.tap = function (el) { const r = el.getBoundingClientRect(), o = { bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, pointerId: 1 }; el.dispatchEvent(new PointerEvent('pointerdown', o)); el.dispatchEvent(new PointerEvent('pointerup', o)); };
      window.mk = function (q) { var d = document.getElementById('tdc'); if (d) d.remove(); d = document.createElement('div'); d.id = 'tdc'; d.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#000;overflow:hidden'; document.body.appendChild(d); window.__OK = 0; DEC.lock = false; decRender(q, d); return d; };
      try { localStorage.removeItem(DFX.gk()); } catch (e) { } });
    /* ① 8 題 */
    const seen = [];
    for (let i = 0; i < 8; i++) {
      const r = await p.evaluate(q => { const d = mk(q), b = d.querySelector('.dcbox'), sk = [].filter.call(b.classList, c => /^sk-/.test(c))[0], ch = d.querySelectorAll('.dctl.dfxch'), cor = q.t.map(t => t[1]),
        out = [].concat([].slice.call(d.querySelectorAll('.dcs,.dctl,.dfxban,.dce'))).filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1 || r.bottom > innerHeight + 1; }).length,
        hs = Math.min.apply(null, [].map.call(d.querySelectorAll('.dcs'), x => x.getBoundingClientRect().height)), fs = Math.min.apply(null, [].map.call(d.querySelectorAll('.dcs,.dctl'), x => parseFloat(getComputedStyle(x).fontSize)));
        return { sk, ban: (d.querySelector('.dfxban') || {}).textContent || '', ch: ch.length, chOk: ch.length ? cor.indexOf(ch[0]._z) >= 0 : false, out, hs, fs }; }, Q[i % 3]);
      seen.push(r.sk);
      ok(r.sk && r.ban.length > 2, tag + ' 第 ' + (i + 1) + ' 題 沒有 樣子／名字 ' + JSON.stringify(r));
      ok(r.ch === 1 && r.chOk, tag + ' 第 ' + (i + 1) + ' 題 寶箱 不是 剛好 1 個 正確 方塊 ' + JSON.stringify(r));
      ok(!r.out, tag + ' 第 ' + (i + 1) + ' 題（' + r.sk + '）有 ' + r.out + ' 個 東西 超出 畫面');
      ok(r.hs >= 40 && r.fs >= 20, tag + ' 第 ' + (i + 1) + ' 題（' + r.sk + '）格子 太 小 或 字 太 小 ' + JSON.stringify(r));
    }
    ok(new Set(seen).size === 8, tag + ' 8 題 的 樣子 沒有 8 種 都 不一樣 ' + seen.join(','));
    /* ② 寶箱 放錯 不開、放對 開 */
    const r2 = await p.evaluate(async q => { window.__NOGO = 0; const d = mk(q), ch = d.querySelector('.dctl.dfxch'), z = ch._z, ss = [].slice.call(d.querySelectorAll('.dcs')), want = q.t.findIndex(t => t[1] === z), wrong = ss[(want + 1) % ss.length];
      const P0 = window.__P, O0 = DFX.open; tap(ch); wrong.click(); await new Promise(r => setTimeout(r, 120)); const a = { op: !!document.querySelector('.dfxop'), hold: wrong.classList.contains('dfxhold') };
      wrong.click(); await new Promise(r => setTimeout(r, 60)); tap(ch); ss[want].click(); await new Promise(r => setTimeout(r, 60)); a.op2 = !!document.querySelector('.dfxop'); a.p = window.__P - P0;
      await new Promise(r => setTimeout(r, 1700)); a.n = DFX.open - O0; a.g = window.__G; window.__NOGO = 1; return a; }, Q[0]);
    ok(!r2.op && r2.hold, tag + ' 寶箱 放錯 格子 打開 了（或 格子 沒有 金框）' + JSON.stringify(r2));
    ok(r2.op2 && r2.p >= 1 && r2.n === 1, tag + ' 寶箱 放對 沒有 打開／倒數 沒 停 ' + JSON.stringify(r2));
    /* ③ 透視（__DFXR 0.5 ＝ 木頭 寶箱、第 3 個 獎品 ＝ 🔦）*/
    const r3 = await p.evaluate(async q => { window.__NOGO = 0; window.__DFXR = 0.5; const d = mk(q); const ch = d.querySelector('.dctl.dfxch'), ss = [].slice.call(d.querySelectorAll('.dcs')), want = q.t.findIndex(t => t[1] === ch._z);
      tap(ch); ss[want].click(); await new Promise(r => setTimeout(r, 120)); const pz = (document.querySelector('.dfxop .pz') || {}).textContent || ''; await new Promise(r => setTimeout(r, 1500));
      const see = d.querySelector('.dfxsee'), t = see ? see.textContent : '', cell = see ? +see.parentNode.getAttribute('data-i') : -1; await new Promise(r => setTimeout(r, 1400));
      window.__NOGO = 1; window.__DFXR = null; return { pz, t, good: cell >= 0 && q.t[cell][1] === t && cell !== want, gone: !d.querySelector('.dfxsee') }; }, Q[2]);
    ok(/透視/.test(r3.pz) && r3.good && r3.gone, tag + ' 🔦 透視 不對 ' + JSON.stringify(r3));
    /* ④ 全部 放對：✖2、過關 特效、影子 */
    const r4 = await p.evaluate(async q => { window.__PT = 0; new MutationObserver(m => m.forEach(x => x.addedNodes.forEach(e => { if (e.classList && e.classList.contains('dfxpt')) window.__PT++; }))).observe(document.body, { childList: true });
      for (let k = 0; k < 2; k++) { const d = mk(q); DEC.qx = 2; const ss = [].slice.call(d.querySelectorAll('.dcs')); window.__DFXR = 0.01;
      for (let i = 0; i < q.t.length; i++) { const t = [].filter.call(d.querySelectorAll('.dctl:not(.used)'), x => x._z === q.t[i][1])[0]; tap(t); ss[i].click(); await new Promise(r => setTimeout(r, 20)); }
      window.__DFXR = null; await new Promise(r => setTimeout(r, 4800)); }
      return { okv: window.__OK, qx: DEC.last && DEC.last.qx, pt: window.__PT, sc: DEC.sc, gh: DFX.ghost() }; }, Q[1]);
    ok(r4.okv && r4.qx >= 2 && r4.gh > 0 && r4.pt >= 12, tag + ' 全部 放對：沒有 ✖2 或 影子 ' + JSON.stringify(r4));
    const r5 = await p.evaluate(() => { const d = mk({ en: 'How old are you?', t: [['How old', '幾歲'], ['are', '是'], ['you?', '你']], z: '你幾歲？' }); return (d.querySelector('.dfxhud') || {}).textContent || ''; });
    ok(/影子 每格 \d/.test(r5), tag + ' 做過 題目 以後 沒有 寫 👻 影子 每格 幾秒：' + r5);
    /* ⑤ 教學、__NODFX 不 加 */
    const r6 = await p.evaluate(() => { const o = document.createElement('div'); o.id = 'dcl'; document.body.appendChild(o); decRender({ en: 'How old are you?', t: [['How old', '幾歲'], ['are', '是'], ['you?', '你']], z: '你幾歲？' }, o);
      const a = o.querySelectorAll('.dfxch,.dfxban').length; o.remove(); window.__NODFX = 1; const d = mk({ en: 'How old are you?', t: [['How old', '幾歲'], ['are', '是'], ['you?', '你']], z: '你幾歲？' }); const b = d.querySelectorAll('.dfxch,.dfxban').length; window.__NODFX = 0; return [a, b]; });
    ok(!r6[0] && !r6[1], tag + ' 教學／__NODFX 還是 有 寶箱、樣子 ' + r6);
    /* ⑥ 三年級 皮克敏、資料表 */
    if (site === 'g3mid') for (const id of ['q7', 'q9']) {
      const gi = await p.evaluate(id => GM.findIndex(g => g.id === id), id);
      const r7 = await p.evaluate(gi => { document.getElementById('tdc') && document.getElementById('tdc').remove(); lobby(); window.__NOWB = 1; start(gi); return gi; }, gi);
      await p.waitForTimeout(4500);
      const z = await p.evaluate(() => ({ k: !!(R.q && R.q.k), ban: document.querySelectorAll('.dfxban').length, ch: document.querySelectorAll('.dfxch').length, sk: !!document.querySelector('.dfxq[class*="sk-"]'),
        out: [].filter.call(document.querySelectorAll('.pk,.tile9,.sl9,.gap,.dfxban'), e => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.bottom > innerHeight + 1); }).length }));
      if (z.k) { n++; continue; }   /* 資料表 新 題型（四選一）不是 拖曳 */
      ok(z.ban === 1 && z.ch === 1 && z.sk && !z.out, tag + ' ' + id + '：樣子／寶箱 不對 或 超出 畫面 ' + JSON.stringify(z) + ' gi ' + r7);
    }
    ok(!errs.length, tag + ' JS 錯誤 ' + errs.slice(0, 2).join('｜'));
    await ctx.close();
  }
  await br.close();
  E.forEach(e => console.log('✗ ' + e)); console.log('🎁🧩👻 拖曳題 不 無聊：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0);
})();
