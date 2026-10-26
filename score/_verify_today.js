/* score/_verify_today.js — 2026-10-26 第二十七次 第 2 點：📅 今日任務、🔥 挑戰關、📈 我的 進步（在家複習）。只印失敗項和一行總結。
 *   node score/_verify_today.js
 * 假 的 成績 伺服器（script.test，絕對 不送 真的 成績表）；三種 尺寸 ✕ 三、四年級。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), SC = require('./_calc.js');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0;
const NOW = Date.now(), D9 = NOW - 9 * 864e5;
(async () => {
  const br = await chromium.launch();
  for (const g of [3, 4]) for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) {
    const tag = g + '年級 ' + vp.join('×'), id = g === 3 ? '30401' : '40201', s0 = 'g' + g + 'u1_1-1b', i0 = require('./_today_build.js').bankOf(g).Q[s0].findIndex(Boolean);
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/^https?:\/\/(?!script\.test)/, r => r.abort());
    await ctx.route(/script\.test/, r => { const u = r.request().url(); const body = /a=me/.test(u) ? { ok: true, tr: 3, me: { s: { [s0]: [D9 - 864e5, 60, 0, 1, D9] }, w: [[s0, i0, D9]], now: NOW } } : { ok: true, dup: [] };
      r.fulfill({ contentType: 'application/json', body: JSON.stringify(body) }); });
    await ctx.addInitScript(id => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} });
      localStorage.setItem('score_last', JSON.stringify(id)); localStorage.setItem('score_id_g' + id[0], JSON.stringify(id)); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id);
      HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 80); return Promise.resolve(); }; }, id);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    const lay = () => p.evaluate(() => { const sm = [], lo = []; document.querySelectorAll('#app *, #wf *').forEach(x => { const r = x.getBoundingClientRect(); if (!r.width) return;
        if ([].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(x).fontSize) < 17) sm.push(x.textContent.trim().slice(0, 10));
        if ((x.tagName === 'BUTTON' || x.classList.contains('go')) && r.height < 48) lo.push(x.textContent.trim().slice(0, 8)); });
      return { sm, lo, ox: document.documentElement.scrollWidth - innerWidth }; });
    /* 在家複習 首頁 兩張 大卡 */
    await p.goto('file://' + path.join(ROOT, 'g' + g + '-review', 'index.html')); await p.waitForTimeout(300);
    n++; const hm = await p.evaluate(() => [].map.call(document.querySelectorAll('.tdb'), a => [a.getAttribute('href'), a.getBoundingClientRect().height]));
    if (hm.length !== 2 || hm[0][0] !== 'today.html' || hm[1][0] !== 'stars.html' || hm.some(x => x[1] < 60)) E.push(tag + ' 首頁 沒有〔📅 今日任務〕〔📈 我的進步〕' + JSON.stringify(hm));
    /* 今日任務 */
    await p.goto('file://' + path.join(ROOT, 'g' + g + '-review', 'today.html')); await p.waitForTimeout(600);
    n++; const lb = await p.evaluate(() => ({ st: !!document.getElementById('st'), ch: !!document.getElementById('ch') })); if (!lb.st || !lb.ch) E.push(tag + ' 今日任務 大廳 沒有〔▶ 開始〕或〔🔥 挑戰關〕（★★）' + JSON.stringify(lb));
    let L0 = await lay(); n++; if (L0.sm.length || L0.lo.length || L0.ox > 1) E.push(tag + ' 大廳 版面 ' + JSON.stringify(L0));
    await p.click('#st'); await p.waitForTimeout(500);
    n++; const s1 = await p.evaluate(() => ({ L: R.L.map(x => [x.s, x.i, x.t]), dots: document.querySelectorAll('.dots i').length }));
    if (s1.L.length !== 5 || s1.dots !== 5 || !s1.L.some(x => x[0] === s0 && x[2] === 'w' && x[1] === i0)) E.push(tag + ' 5 題 裡 沒有 以前 答錯 的 那一題 ' + JSON.stringify(s1));
    for (let k = 0; k < 5; k++) {
      await p.waitForTimeout(1100);
      if (k === 0) { const l1 = await lay(); n++; if (l1.sm.length || l1.lo.length || l1.ox > 1) E.push(tag + ' 題目 版面 ' + JSON.stringify(l1));
        await p.evaluate(() => { const b = [].filter.call(document.querySelectorAll('.o'), x => x.getAttribute('data-o') !== '0')[0]; b.click(); }); await p.waitForTimeout(800);
        n++; const w = await p.evaluate(() => ({ on: document.getElementById('wf').classList.contains('on'), gw: document.querySelectorAll('#wf .gw').length, zh: [].filter.call(document.querySelectorAll('#wf .gw i'), i => i.textContent.trim()).length, ca: (document.querySelector('#wf .ca') || {}).textContent || '' }));
        if (!w.on || !w.gw || !/正確答案/.test(w.ca)) E.push(tag + ' 答錯 沒有 綠底 解說 ' + JSON.stringify(w));
        const l2 = await lay(); n++; if (l2.sm.length || l2.lo.length) E.push(tag + ' 答錯頁 版面 ' + JSON.stringify(l2));
        await p.waitForFunction(() => { const b = document.getElementById('wfn'); return b && !b.disabled; }, null, { timeout: 8000 }).catch(() => E.push(tag + ' 答錯頁 唸完 沒有 解鎖〔▶ 下一題〕'));
        await p.click('#wfn'); }
      else { await p.evaluate(() => document.querySelector('.o[data-o="0"]').click()); await p.waitForTimeout(1400); }
    }
    await p.waitForTimeout(400);
    n++; const en = await p.evaluate(() => ({ t: document.getElementById('app').innerText, q: (JSON.parse(localStorage.getItem('score_q') || '[]').pop() || null) }));
    if (!/答對 4 ／ 5/.test(en.t) || !/記進 成績/.test(en.t)) E.push(tag + ' 結束 畫面 ' + en.t.slice(0, 80));
    if (!en.q || en.q.set !== 'g' + g + 'td_day' || en.q.qs.length !== 5 || en.q.qs.some(x => typeof x[6] !== 'string' || !/^g[34]/.test(x[6]))) E.push(tag + ' 送 的 成績 不對 ' + JSON.stringify(en.q).slice(0, 200));
    else { n++; const c = SC.clean(Object.assign({}, en.q), NOW); if (!c || c.qs.some(x => typeof x[6] !== 'string')) E.push(tag + ' 伺服器 不收（或 丟掉 原本 的 題組）' + JSON.stringify(c && c.qs).slice(0, 120)); }
    /* 🔥 挑戰關：10 秒 倒數 */
    await p.goto('file://' + path.join(ROOT, 'g' + g + '-review', 'today.html')); await p.waitForTimeout(600); await p.click('#ch'); await p.waitForTimeout(400);
    n++; const c1 = await p.evaluate(() => ({ bar: !!document.getElementById('bar'), ch: R.ch, tag: document.querySelector('.tag').textContent })); if (!c1.bar || !c1.ch || !/10 秒/.test(c1.tag)) E.push(tag + ' 挑戰關 ' + JSON.stringify(c1));
    /* ✍ ★★★ 出 1 題：① 點 句子 ➜ ② 點 3 個 錯的 ➜ ③ 看一看 ➜ 送出（假 伺服器 收到 4 個 選項） */
    await p.goto('file://' + path.join(ROOT, 'g' + g + '-review', 'today.html')); await p.waitForTimeout(600);
    n++; if (!(await p.$('#mk'))) E.push(tag + ' ★★★ 沒有〔✍ 出 1 題〕'); else {
      let sent = null; await p.route(/script\.test/, r => { if (r.request().method() === 'POST') sent = JSON.parse(r.request().postData()); r.fulfill({ contentType: 'application/json', body: '{"ok":true}' }); });
      await p.click('#mk'); await p.waitForTimeout(200); await p.click('[data-mka="0"]'); await p.waitForTimeout(200);
      for (const i of [0, 1, 2]) { await p.click('[data-mkw="' + i + '"]'); await p.waitForTimeout(100); }
      const lm = await lay(); n++; if (lm.sm.length || lm.lo.length || lm.ox > 1) E.push(tag + ' 出題 版面 ' + JSON.stringify(lm));
      await p.click('#mknx'); await p.waitForTimeout(200); n++; if ((await p.$$('.opts .o')).length !== 4) E.push(tag + ' 出題 預覽 不是 4 個 選項');
      await p.click('#mksd'); await p.waitForTimeout(500); n++; if (!sent || sent.a !== 'qsub' || sent.id !== id || !sent.zh || (sent.o || []).length !== 4 || !/送出 了/.test(await p.textContent('#mkm'))) E.push(tag + ' 出題 送出 不對 ' + JSON.stringify(sent)); await p.unroute(/script\.test/); }
    /* 📈 我的 進步 */
    await p.goto('file://' + path.join(ROOT, 'g' + g + '-review', 'stars.html')); await p.waitForTimeout(800);
    n++; const st = await p.evaluate(s0 => { const rows = [].map.call(document.querySelectorAll('.tp'), r => ({ t: r.querySelector('.nm').textContent, on: r.querySelectorAll('.sx span:not(.d)').length })); return { rows: rows.length, one: rows.filter(r => r.on === 1).length, sum: document.querySelector('.sum').textContent }; }, s0);
    if (st.rows < 20 || st.one !== 1 || !/⭐ 1/.test(st.sum)) E.push(tag + ' 我的 進步 ' + JSON.stringify(st));
    const l3 = await lay(); n++; if (l3.sm.length || l3.lo.length || l3.ox > 1) E.push(tag + ' 我的 進步 版面 ' + JSON.stringify(l3));
    n++; if (errs.length) E.push(tag + ' JS 錯誤 ' + errs.slice(0, 2).join('｜'));
    await ctx.close();
  }
  /* 伺服器（真的 Code.gs）：✍ 出題 要 ★★★、一週 1 題、老師〔✔ 可以〕才 給 大螢幕；名人堂 只有 ★★★★★、同 年級 */
  { const { make } = require('./_gas_stub.js'), G = make({ TEACHER_PW: 'pw-t' }), q = { a: 'qsub', id: '30401', zh: '我 是 Amy。', o: ["I'm Amy.", "I'm nine.", "You're Amy.", 'My Amy.'] };
    n++; if (G.post(q).err !== 'tier') E.push('★ 也 能 出題');
    G.books['角色'].d.push(['30401', JSON.stringify({ tr: 3, trt: [1, 2, 3] }), new Date()]); G.books['角色'].d.push(['30402', JSON.stringify({ tr: 5, trt: [1, 2, 3, 4, 5] }), new Date()]); G.books['角色'].d.push(['40203', JSON.stringify({ tr: 5, trt: [1, 2, 3, 4, 5] }), new Date()]);
    n++; if (!G.post(q).ok || !G.post(Object.assign({}, q, { zh: '我 九 歲。' })).ok) E.push('★★★ 出題 送 不進去');
    n++; const T0 = G.post({ a: 'teacher', pw: 'pw-t' }); if (!T0.qsub || T0.qsub.length !== 1 || T0.qsub[0].zh !== '我 九 歲。') E.push('同一週 再 出 ＝ 換掉 原本 的（老師 只 看到 1 題）' + JSON.stringify(T0.qsub));
    n++; if (G.post({ a: 'qok', pw: 'wrong', k: T0.qsub[0].k, v: 1 }).err !== 'pw') E.push('沒有 密碼 也 能 核准');
    G.post({ a: 'qok', pw: 'pw-t', k: T0.qsub[0].k, v: 1 }); const P = G.post({ a: 'pw', pw: 'pw-t' });
    n++; if (!P.sq || P.sq.length !== 1 || P.sq[0].id !== '30401' || P.sq[0].o.length !== 4 || !P.tiers || P.tiers['30402'] !== 5) E.push('大螢幕 拿不到 核准 的 題目／階級 ' + JSON.stringify(P).slice(0, 200));
    n++; if (G.post(q).err !== 'week') E.push('老師 核准 以後，同一週 還 能 再 出');
    n++; const H3 = G.get({ a: 'rpg', id: '30401' }); if (!H3.hall || H3.hall.join() !== '30402') E.push('名人堂 不對（只要 三年級 ★★★★★）' + JSON.stringify(H3.hall)); }
  /* 伺服器 算法：me()、🔥 挑戰關 金幣 ✖1.5（★★ 以上）*/
  { n++; const qs = (ok, st) => [[ok, ok ? 0 : 1, 3, 0, 1, 0, st]];
    const r0 = { t: NOW - 5e6, id: '30401', set: 'g3u1_1-1b', m: 'q', acc: 0, n: 1, ok: 0, qs: [[0, 1, 3, 0, 0, 0]] }, r1 = { t: NOW - 1e6, id: '30401', set: 'g3td_day', m: 'q', acc: 100, n: 1, ok: 1, qs: qs(1, 'g3u1_1-1b') };
    const m0 = SC.me([r0], NOW), m1 = SC.me([r0, r1], NOW); if (m0.w.length !== 1 || m1.w.length !== 0) E.push('me()：答錯 ➜ 今日任務 改對 以後 還在 錯題 裡');
    n++; const mk = (set, k) => Array.from({ length: 5 }, (_, i) => ({ t: NOW - (i + 1) * 3e5, id: '30401', cls: '304', set, m: 'q', acc: 100, n: 5, ok: 5, fast: 0, qs: [0, 1, 2, 3, 4].map(j => [1, 0, 3, 0, 1, j]) }));
    const st2 = { trt: [NOW - 9e9, NOW - 8e9] }, a = SC.rpEarn(mk('g3td_day'), st2).coin, b = SC.rpEarn(mk('g3td_ch'), st2).coin, c = SC.rpEarn(mk('g3td_ch'), { trt: [NOW - 9e9] }).coin;
    if (!(b > a) || c !== SC.rpEarn(mk('g3td_day'), { trt: [NOW - 9e9] }).coin) E.push('挑戰關 金幣：★★ 要 多、★ 不 多 ' + JSON.stringify([a, b, c])); }
  await br.close();
  E.forEach(x => console.log('✗ ' + x)); console.log((E.length ? '✗' : '✓') + ' 今日任務／我的進步 量了 ' + n + ' 項，失敗 ' + E.length + ' 項'); process.exit(E.length ? 1 : 0);
})();
