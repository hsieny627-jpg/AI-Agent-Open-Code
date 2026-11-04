/* g3mid/_verify_dfx.js — 拖曳題 量測（2026-11-02 第四十次 第 ③ 點 重做；三年級 g3mid、四年級 midterm；3 種 螢幕）。只 印 失敗 項。
 * ① 8 題 連著 做：每一題 樣子 都 不一樣（8 種 輪 一圈）、最上面 有 樣子 的 名字、**題目 上 看不到 任何 寶箱**、不 超出 畫面、格子 ≧ 40px 高、字 ≧ 20px
 * ② 第四十一次：🏁👻 跑道 整個 刪除 ＝ 量「沒有 跑道」
 * ③ 難度 規則（DFX.drop）：難度 ≦ 4 ＝ 一定 不 掉；難度 愈 高 ＝ 掉 的 機會、寶箱、獎勵 都 不 會 變 少
 * ④ 簡單 題（3 格＋2 錯 方塊 ＝ 難度 5，__DFXR ＝ 0.9）全對 ＝ 不 掉 寶箱；難 題（10 格＋2 ＝ 12，__DFXR ＝ 0.1）全對 ＝ 寶箱 從 天上 掉 下來 ➜ 點 3 下 打開 ➜ 解碼 積分 增加
 * ⑤ 放錯（不是 全對）＝ 一定 不 掉；教學（#dcl）不 加；三年級 🌱 皮克敏、📋 資料表 沒有 樣子、沒有 寶箱（改回 單純 拖曳）
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
    await ctx.addInitScript(() => { window.__SCORE_TEST_OFF = 1; window.__NOUNLOCK = 1; window.__NODFXI = 1; window.__NOSNH = 1;   /* 第四十二次：寶箱 說明、貪吃蛇 怎麼玩 在 _verify_42.js 量 */ window.__NOGO = 1; window.__NOWHEEL = 1; window.__NOLIFE = 1; window.__NOMEM = 1; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(__dirname, '..', site, 'index.html')); await p.waitForTimeout(700);
    await p.evaluate(() => { document.querySelectorAll('#scov,.scfull').forEach(x => x.remove());
      DEC.A = { aud: () => null, stop: () => {}, pause: () => {}, go: () => {}, busy: () => false, sid: () => '30499', ok: () => { window.__OK = 1 }, bad: g => { window.__BAD = g } };
      window.tap = function (el) { const r = el.getBoundingClientRect(), o = { bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, pointerId: 1 }; el.dispatchEvent(new PointerEvent('pointerdown', o)); el.dispatchEvent(new PointerEvent('pointerup', o)); };
      window.mk = function (q) { var d = document.getElementById('tdc'); if (d) d.remove(); d = document.createElement('div'); d.id = 'tdc'; d.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#000;overflow:hidden'; document.body.appendChild(d); window.__OK = 0; window.__BAD = 0; DEC.lock = false; decRender(q, d); return d; };
      window.fill = function (q, wrong) { const d = document.getElementById('tdc'), S = d.querySelectorAll('.dcs'); q.t.forEach((t, i) => { const z = wrong && i === 0 ? q.x[0] : t[1]; const b = [].filter.call(d.querySelectorAll('.dctl'), x => x._z === z && !x.classList.contains('used'))[0]; tap(b); S[i].click(); }); };
      try { localStorage.removeItem(DFX.gk()); } catch (e) { } });
    /* ① 8 題 */
    const seen = [];
    for (let i = 0; i < 8; i++) {
      const r = await p.evaluate(q => { const d = mk(q), b = d.querySelector('.dcbox'), sk = [].filter.call(b.classList, c => /^sk-/.test(c))[0],
        out = [].concat([].slice.call(d.querySelectorAll('.dcs,.dctl,.dfxban,.dce,.dfxrc'))).filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1 || r.bottom > innerHeight + 1; }).length,
        hs = Math.min.apply(null, [].map.call(d.querySelectorAll('.dcs'), x => x.getBoundingClientRect().height)), fs = Math.min.apply(null, [].map.call(d.querySelectorAll('.dcs,.dctl'), x => parseFloat(getComputedStyle(x).fontSize)));
        return { sk, ban: (d.querySelector('.dfxban') || {}).textContent || '', ch: d.querySelectorAll('.dfxch,.dfxbg,.dfxch2').length, rc: !!d.querySelector('.dfxrc'), out, hs, fs }; }, Q[i % 3]);
      seen.push(r.sk);
      ok(r.sk && r.ban.length > 2, tag + ' 第 ' + (i + 1) + ' 題 沒有 樣子／名字 ' + JSON.stringify(r));
      ok(r.ch === 0, tag + ' 第 ' + (i + 1) + ' 題 題目 上 看得到 寶箱（應該 不 可以）');
      ok(!r.rc, tag + ' 第 ' + (i + 1) + ' 題 還有 🏁 跑道（第四十一次 刪除）');
      ok(!r.out, tag + ' 第 ' + (i + 1) + ' 題（' + r.sk + '）有 ' + r.out + ' 個 東西 超出 畫面');
      ok(r.hs >= 40 && r.fs >= 20, tag + ' 第 ' + (i + 1) + ' 題（' + r.sk + '）格子 太 小 或 字 太 小 ' + JSON.stringify(r));
    }
    ok(new Set(seen).size === 8, tag + ' 8 題 的 樣子 沒有 8 種 都 不一樣 ' + seen.join(','));
    /* ③ 難度 規則 */
    const dr = await p.evaluate(() => { const o = {}; [0.01, 0.5, 0.99].forEach(x => { window.__DFXR = x; for (let d = 3; d <= 12; d++) { const r = DFX.drop(d); o[x + '_' + d] = r ? [r.t, r.p] : null; } }); window.__DFXR = null; return o; });
    ok([3, 4].every(d => !dr['0.01_' + d]), tag + ' 難度 ≦ 4 也 掉 寶箱 ' + JSON.stringify(dr));
    let mono = true; for (let d = 6; d <= 12; d++) { const a = dr['0.01_' + (d - 1)], b = dr['0.01_' + d]; if (a && (!b || b[1] < a[1])) mono = false; }
    ok(mono, tag + ' 難度 高 獎勵 反而 少 ' + JSON.stringify(dr));
    /* ② 第四十一次 第 1 點：🏁👻 跑道 整個 刪除 */
    const rc = await p.evaluate(q => { const d = mk(q); return { rc: d.querySelectorAll('.dfxrc').length, g: typeof DFX.race + typeof DFX.ghost, t: /👻|上次 的 你|上次 的 自己/.test(d.textContent) }; }, Q[0]);
    ok(!rc.rc && rc.g === 'undefinedundefined' && !rc.t, tag + ' 🏁👻 跑道 還在 ' + JSON.stringify(rc));
    /* ④ 簡單 題 全對 不 掉；難 題 全對 掉、點 3 下 打開、積分 增加 */
    const ez = await p.evaluate(async q => { window.__DFXR = 0.9; mk(q); fill(q); await new Promise(r => setTimeout(r, 900)); const c = !!document.querySelector('.dfxch2'); window.__DFXR = null; return { c, ok: window.__OK }; }, Q[0]);
    ok(!ez.c, tag + ' 簡單 題 也 掉 寶箱');
    await p.evaluate(() => { document.querySelectorAll('.dfxch2').forEach(x => x.remove()); DEC.lock = false; });
    const hd = await p.evaluate(async q => { window.__DFXR = 0.1; const s0 = DEC.sc || 0; mk(q); fill(q); let c = null; for (let i = 0; i < 40 && !c; i++) { await new Promise(r => setTimeout(r, 100)); c = document.querySelector('.dfxch2'); }
      if (!c) { window.__DFXR = null; return { c: 0 }; } const bx = c.querySelector('.bx'); bx.click(); bx.click(); const before = !c.classList.contains('op'); bx.click(); await new Promise(r => setTimeout(r, 400));
      const op = c.classList.contains('op'), pz = (c.querySelector('.pz') || {}).textContent || ''; await new Promise(r => setTimeout(r, 900)); window.__DFXR = null; return { c: 1, before, op, pz, gone: !document.querySelector('.dfxch2'), up: (DEC.sc || 0) > s0 }; }, Q[2]);
    ok(hd.c && hd.before && hd.op && /＋\d+/.test(hd.pz) && hd.gone && hd.up, tag + ' 難 題 寶箱 不對 ' + JSON.stringify(hd));
    await p.evaluate(() => { document.querySelectorAll('.dfxch2').forEach(x => x.remove()); DEC.lock = false; });
    /* ⑤ 放錯 不 掉 */
    const wr = await p.evaluate(async q => { window.__DFXR = 0.01; mk(q); fill(q, 1); await new Promise(r => setTimeout(r, 1300)); const c = !!document.querySelector('.dfxch2'); window.__DFXR = null; return { c, bad: !!window.__BAD }; }, Q[2]);
    ok(!wr.c && wr.bad, tag + ' 放錯 也 掉 寶箱 ' + JSON.stringify(wr));
    const tu = await p.evaluate(() => { const o = document.getElementById('dcl') || document.createElement('div'); o.id = 'dcl'; document.body.appendChild(o); const w = document.createElement('div'); o.appendChild(w); DEC.lock = false; decRender({ en: 'Hi.', t: [['Hi.', '嗨']], x: [], z: '嗨。' }, w); return !!w.querySelector('.dfxban,.dfxrc'); });
    ok(!tu, tag + ' 教學 也 加 了 樣子');
    if (site === 'g3mid') {
      const pk = await p.evaluate(() => { const r = {}; ['q7', 'q9'].forEach(id => { const g = GM.filter(x => x.id === id)[0]; if (!g) return; G = g; window.R = { qs: [], k: 0, Q: [], res: [], wrong: [], score: 0, streak: 0 }; const st = document.createElement('div'); document.body.appendChild(st); try { REN[id](g.B[0], st); } catch (e) { r[id + 'e'] = e.message; }
        r[id] = st.querySelectorAll('.dfxban,.dfxch,.dfxbg,.dfxrc').length + [].filter.call(st.classList, c => /^sk-|dfx/.test(c)).length; st.remove(); }); return r; });
      ok(pk.q7 === 0 && pk.q9 === 0 && !pk.q7e && !pk.q9e, tag + ' 皮克敏／資料表 還有 寶箱 或 樣子 ' + JSON.stringify(pk));
    }
    ok(!errs.length, tag + ' 網頁 錯誤：' + errs.slice(0, 3).join(' | '));
    await ctx.close();
  }
  await br.close();
  console.log(E.length ? '✗ ' + E.join('\n✗ ') : ''); console.log('拖曳題 量測 ' + n + ' 項，失敗 ' + E.length + ' 項'); process.exit(E.length ? 1 : 0);
})();
