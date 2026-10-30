/* 2026-10-30 第三十四次 第 9 點 量測：🔓 句子 解碼（三年級 g3mid、四年級 midterm 共用 引擎 _decode.js）
   (1) 聲音：解碼 只用 一個 播放器（換 句子 不 換 播放器）、手指 第一次 碰 畫面 先 解鎖；教學／秒懂 動畫 每一句 都 有 語音檔（build 會 擋）
   (2)(3)(6) 縮寫／省略 等式：兩行、第一個 字母 上下 對齊、＝ 在 下面 那一行 第一個 字母 左邊、每個 英文 字 正下方 有 中文；What 和 ’s 的 中文 分開
   (4) 格子：每一格 ≧ 最寬 的 中文 方塊、英文 字 在 格子 正上方 置中、格子 ≧ 64px 高
   (5A)(5B) 第一次 ＝ 先 教學（3 步、不能 跳過）➜ 小 測驗 真的 拖（答錯 ＝ 看 正確 答案 再 做）➜ 秒懂 動畫；第二次 有〔⏭ 跳過〕
   只 印 失敗 項。node g3mid/_verify_dct.js */
const { chromium } = require('playwright'), path = require('path');
const E = []; let n = 0;
(async () => {
  const br = await chromium.launch();
  for (const site of ['g3mid', 'midterm']) for (const vp of [[1024, 768], [820, 1180]]) {
    const tag = site + ' ' + vp.join('×'), id = site === 'g3mid' ? '30401' : '40201', D = require(path.join(__dirname, '..', site, '_data.js'));
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/^https?:\/\//, r => r.abort()); await ctx.route(/script\.test/, r => r.fulfill({ contentType: 'application/json', body: '{"ok":true,"dup":[]}' }));
    await ctx.addInitScript(id => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); localStorage.setItem('score_last', '"' + id + '"'); localStorage.setItem('score_id_g' + id[0], '"' + id + '"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id);
      window.__NOGO = 1; window.__NOWB = 1; window.__DCLK = 0.15; window.__DCLMIN = 0; window.__els = new Set(); window.__src = [];
      HTMLMediaElement.prototype.play = function () { const a = this; window.__els.add(a); window.__src.push(a.src.slice(0, 30)); setTimeout(() => a.onended && a.onended(), 150); return Promise.resolve(); }; HTMLMediaElement.prototype.pause = function () {};
      Object.defineProperty(HTMLMediaElement.prototype, 'duration', { get() { return 0.15; } }); }, id);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(__dirname, '..', site, 'index.html')); await p.waitForTimeout(500);
    /* (1) 第一次 手指 碰 畫面 ＝ 解鎖（放 一段 沒 聲音 的 wav）*/
    await p.mouse.click(5, vp[1] - 5); await p.waitForTimeout(100); n++;
    if (!(await p.evaluate(() => window.__src.some(s => /^data:audio\/wav/.test(s)) && DEC.el && DEC.el._ok))) E.push(tag + ' 第一次 碰 畫面 沒有 解鎖 聲音');
    await p.evaluate(() => { LDB.set = LDB.must = LDB.patch = () => Promise.resolve(true); CR = { room: '0304', t: 1, cfg: { on: 1, t: 1, set: 'x25', gs: [], m: 'self' }, acc: {}, n: 0, ok: 0, q: -9, rd: {} }; (typeof lobby === 'function' ? lobby : hub)(); document.querySelectorAll('.scfull').forEach(x => x.remove()); window.__els = new Set(); });
    await p.waitForTimeout(200);
    await p.click(site === 'midterm' ? '.xrow .xb[data-xn="25"]' : '[data-x="25"]'); await p.waitForTimeout(400);
    /* (5) 教學 */
    n++; const t0 = await p.evaluate(() => ({ on: document.getElementById('dcl').classList.contains('on'), t: document.querySelector('#dcl .dlt') && document.querySelector('#dcl .dlt').textContent, sk: !!document.getElementById('dlsk'), dots: document.querySelectorAll('#dcl .dlp i').length, run: typeof TM !== 'undefined' ? TM.run : 0 }));
    if (!t0.on || !/怎麼 玩/.test(t0.t) || t0.sk || t0.dots !== 3) E.push(tag + ' 第一次 沒有 先 教學（或 可以 跳過）：' + JSON.stringify(t0));
    /* ① 手 示範 拖 */
    await p.waitForFunction(() => /拖 到/.test((document.getElementById('dtcap') || {}).textContent || ''), null, { timeout: 8000 }).catch(() => E.push(tag + ' 教學 ① 沒有「拖 到 英文 字 正下方」'));
    n++; await p.waitForFunction(() => document.querySelector('#dthand.on'), null, { timeout: 8000 }).catch(() => E.push(tag + ' 教學 ① 沒有 手指 示範'));
    /* ② 中英 順序 */
    n++; await p.waitForFunction(() => document.querySelector('#dcl .dtnat'), null, { timeout: 20000 }).catch(() => E.push(tag + ' 教學 ② 沒有 中文 一排'));
    await p.waitForFunction(() => /最下面/.test(document.getElementById('dtz').textContent), null, { timeout: 20000 }).catch(() => E.push(tag + ' 教學 ② 沒有 最下面 真正 的 中文'));
    n++; const o2 = await p.evaluate(() => [...document.querySelectorAll('#dcl .dcs')].map(x => x.textContent).join(' '));
    const D_ORD = D.DTUT.ord.t.map(x => x[1]).join(' ');
    if (o2 !== D_ORD) E.push(tag + ' 教學 ② 中文 沒有 飛到 自己 的 英文 字 下面：' + o2);
    /* ③ 小 測驗：第一題 故意 錯 ➜ 看 正確 答案 再 做；之後 真的 用 滑鼠 拖 */
    await p.waitForFunction(() => /小 測驗 1/.test(document.getElementById('dtcap').textContent), null, { timeout: 20000 }).catch(() => E.push(tag + ' 沒有 小 測驗'));
    const drag = async (want) => { const bx = await p.$$('#dcl .dcs'); for (let i = 0; i < bx.length; i++) { const t = await p.evaluateHandle(w => [...document.querySelectorAll('#dcl .dctl:not(.used)')].find(b => b.textContent === w), want[i]);
        const a = await t.asElement().boundingBox(), b = await bx[i].boundingBox(); await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down(); await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(80); } };
    const Q = D.DTUT.quiz;
    await drag(Q[0].t.map(x => x[1]).reverse()); await p.waitForTimeout(1300); n++;
    const w1 = await p.evaluate(() => ({ cap: document.getElementById('dtcap').textContent, ok: document.querySelectorAll('#dcl .dcs.ok').length }));
    if (!/再 做 一次/.test(w1.cap) || w1.ok !== Q[0].t.length) E.push(tag + ' 小 測驗 答錯 沒有 看 正確 答案＋再 做 一次：' + JSON.stringify(w1));
    for (let k = 0; k < Q.length; k++) { await p.waitForFunction(k => new RegExp('小 測驗 ' + (k + 1)).test(document.getElementById('dtcap').textContent) && document.querySelectorAll('#dcl .dcs:not(.fill)').length, k, { timeout: 15000 }).catch(() => {});
      await drag(Q[k].t.map(x => x[1])); await p.waitForTimeout(400); }
    n++; await p.waitForFunction(() => /學會/.test(document.getElementById('dcl').textContent), null, { timeout: 15000 }).catch(() => E.push(tag + ' 小 測驗 做對 沒有「✅ 你 學會 了」'));
    n++; await p.waitForFunction(() => /解碼 秘笈/.test(document.getElementById('dcl').textContent), null, { timeout: 15000 }).catch(() => E.push(tag + ' 教學 完 沒有 接 秒懂 動畫'));
    /* (2)(3)(6) 三年級：縮寫／省略 等式 */
    if (site === 'g3mid') for (const u of [1, 2]) { n++;
      /* 直接 畫 一次 再 量（不等 動畫）*/
      const m = await p.evaluate(u => new Promise(res => { decClose(); const S = LES.A[u].s.filter(S => S.eq); const L = { key: 'm' + u, title: 't', sub: 's', s: S }; decLesson(L, () => {});
        const chk = () => { const g = document.querySelector('#dcl .dleq'); if (!g || !g.classList.contains('go')) { setTimeout(chk, 100); return; }
          const rows = [...g.querySelectorAll('.dqr')], ms = [...g.querySelectorAll('.dqm')], f = rows.map(r => r.querySelector('.en').getBoundingClientRect().left),
            eqm = ms[1].getBoundingClientRect(), zh = rows.map(r => [...r.querySelectorAll('.dlc')].map(c => c.querySelector('.zh').textContent.trim())),
            ov = [...g.querySelectorAll('.zh')].filter(z => z.textContent.trim()).map(z => z.getBoundingClientRect()).some((a, i, A) => A.some((b, j) => j !== i && Math.abs(a.top - b.top) < 4 && a.left < b.right - 2 && b.left < a.right - 2));
          res({ n: rows.length, dl: Math.abs(f[0] - f[1]), eq: ms[1].textContent, eqL: eqm.right <= f[1] + 1, zh, ov, tag: (g.querySelector('.dltag') || {}).textContent, out: g.getBoundingClientRect().bottom > innerHeight || g.getBoundingClientRect().top < 0 }); decClose(); };
        chk(); }), u);
      if (m.n !== 2 || m.dl > 2 || m.eq !== '＝' || !m.eqL || m.ov || m.out) E.push(tag + ' Unit ' + u + ' 等式：兩行／第一個 字母 對齊／＝ 在 左邊／中文 重疊／跑出 畫面：' + JSON.stringify(m));
      if (u === 1 && !(m.zh[0][0] === '什麼' && m.zh[0][1] === '是')) E.push(tag + ' What is 的 中文 不是「什麼」「是」分開 兩格：' + JSON.stringify(m.zh));
      if (u === 2 && !/省略/.test(m.tag)) E.push(tag + ' 沒有「years old 可以 省略」：' + JSON.stringify(m)); }
    /* (4) 正式 題目 的 格子 */
    const clr = () => p.evaluate(() => { Object.keys(localStorage).filter(k => /^(mt|g3m)_xs/.test(k)).forEach(k => localStorage.removeItem(k)); document.querySelectorAll('.scfull').forEach(x => x.remove()); });
    await p.evaluate(() => { decClose(); window.__NOTUT = 1; }); await clr(); await p.evaluate(() => { (typeof lobby === 'function' ? lobby : hub)(); }); await clr();
    await p.waitForTimeout(200); await p.click(site === 'midterm' ? '.xrow .xb[data-xn="25"]' : '[data-x="25"]').catch(() => {}); await p.waitForTimeout(400);
    for (let k = 0; k < 6 && await p.evaluate(() => document.getElementById('dcl').classList.contains('on')); k++) { await p.waitForSelector('#dlgo,#dlsk', { timeout: 30000 }).catch(() => {}); await p.click('#dlgo,#dlsk').catch(() => {}); await p.waitForTimeout(300); }
    n++; const b4 = await p.evaluate(() => { const st = document.querySelector('.dcbox'); if (!st) return { none: 1 }; const cs = [...st.querySelectorAll('.dcc')], tw = Math.max(...[...st.querySelectorAll('.dctl')].map(t => t.getBoundingClientRect().width));
      return { cells: cs.length, small: cs.filter(c => c.querySelector('.dcs').getBoundingClientRect().width + 1 < tw).length, low: cs.filter(c => c.querySelector('.dcs').getBoundingClientRect().height < 48).length,
        off: cs.map(c => { const e = c.querySelector('.dce').getBoundingClientRect(), s = c.querySelector('.dcs').getBoundingClientRect(); return Math.abs((e.left + e.right) / 2 - (s.left + s.right) / 2); }).filter(d => d > 3).length,
        scr: document.documentElement.scrollHeight > innerHeight + 1 }; });
    if (b4.none || b4.small || b4.low || b4.off || b4.scr) E.push(tag + ' 解碼 格子：比 中文 方塊 小／太矮／英文 沒有 在 格子 正上方／要 捲動：' + JSON.stringify(b4));
    /* (1) 唸 句子 都 用 同一個 播放器 */
    n++; const el = await p.evaluate(() => [...window.__els].filter(a => /\.mp3/.test(a.src || '') && a === DEC.el).length + '/' + [...window.__els].filter(a => a === DEC.el).length);
    if (!/^1\/1$/.test(el)) E.push(tag + ' 解碼 唸 句子 沒有 用 同一個 播放器：' + el);
    /* 第二次 ＝ 有〔⏭ 跳過〕*/
    await p.evaluate(() => { window.__NOTUT = 0; decClose(); }); await clr(); await p.evaluate(() => { (typeof lobby === 'function' ? lobby : hub)(); }); await clr(); await p.waitForTimeout(200);
    await p.click(site === 'midterm' ? '.xrow .xb[data-xn="25"]' : '[data-x="25"]').catch(() => {}); await p.waitForTimeout(500); n++;
    if (!(await p.evaluate(() => /怎麼 玩/.test(document.getElementById('dcl').textContent) && !!document.getElementById('dlsk')))) E.push(tag + ' 第二次 教學 沒有〔⏭ 跳過〕');
    n++; if (errs.length) E.push(tag + ' JS 錯誤：' + errs.slice(0, 3).join(' | '));
    await ctx.close();
  }
  await br.close();
  E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 句子 解碼（第三十四次 第 9 點）：' + n + ' 項，' + E.length + ' 個失敗'); process.exit(E.length ? 1 : 0);
})();
