/* 2026-11-03 第四十一次 量測（只 印 失敗 項＋一行 總結）。node g3mid/_verify_41.js
 * 假 的 成績 伺服器（script.test，不 送 真的 成績表）、不 連 Firebase。
 * ① 第 4 點 不會 當掉：聲音 被 擋（play 一直 不 回、語音 不 出聲）＝ 看門狗 時間 到 一定 往下 走（三、四年級）
 * ② 第 1 點 👻 跑道 沒有 了；第 2 點 🔦 記憶 解碼 錯 方塊 ≧ 4、相近、不 重複
 * ③ 第 7-A 點 大／小 動畫；7-B 🔤 聽 字母 寫、7-C 🐷 聽 字首音 寫、lw 現場 5 題 考卷 原題、lwh 在家 5 題 相似；lw.html
 * ④ 建議 1 乙：〔▶ 進入 下一頁〕唸完 才 解鎖、按了 才 下一頁；看過 一次 ＝ 只 剩 重點 頁
 * ⑤ 第 3 點：spk 不 丟（收 起來，打對 密碼 補 送）、排 進 佇列 就 帶 通行證
 * ⑥ 第 6 點：密碼 勾選 方框 56px、發亮、👉、① ② 步驟
 * ⑦ 第 5 點：戰神之路 保底 寶箱 點了 會 打開 */
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const D = require('./_data.js');
(async () => {
  const br = await chromium.launch();
  const mkCtx = async (vp, opt) => { const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.route(/script\.test/, r => { const b = r.request().postData() || ''; let j = { ok: true }; try { const o = JSON.parse(b); if (o.a === 'rec') j = (opt && opt.spk) ? { err: 'spk' } : { saved: true }; } catch (e) { } r.fulfill({ contentType: 'application/json', body: JSON.stringify(j) }); });
    await ctx.addInitScript(o => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); window.__NOUNLOCK = 1; window.__NOWB = 1; window.__NOLIFE = 1; window.__NOWHEEL = 1; window.__SCNOJIT = 1;
      if (o && o.login) { localStorage.setItem('score_last', '"' + o.login + '"'); localStorage.setItem('score_id_g' + o.login[0], '"' + o.login + '"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', o.login); }
      if (o && o.mute) { HTMLMediaElement.prototype.play = function () { return new Promise(() => {}); }; try { speechSynthesis.speak = function () {}; } catch (e) { } }
      else HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 40); return Promise.resolve(); }; }, opt || {});
    return ctx; };
  /* ① 不會 當掉（三、四年級）*/
  for (const site of ['g3mid', 'midterm']) {
    const ctx = await mkCtx([1024, 768], { mute: 1 }), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, site, 'index.html')); await p.waitForTimeout(600);
    const t = await p.evaluate(() => new Promise(res => { const t0 = Date.now(); let k = 0; const L = [['', 'a.'], ['', 'Hello, my name is Zed.']]; sayList(L, () => res(Date.now() - t0)); setTimeout(() => res(-1), 20000); }));
    ok(t > 0 && t < 16000, site + ' 聲音 被 擋：唸 兩句 沒有 往下 走（會 當掉）' + t);
    ok(!errs.length, site + ' JS 錯誤 ' + errs.join(' | ').slice(0, 200)); await ctx.close();
  }
  /* ②～③ 三年級 index.html */
  { const ctx = await mkCtx([1024, 768], { login: '30401' }), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, 'g3mid', 'index.html')); await p.waitForTimeout(700);
    const r = await p.evaluate(() => { document.querySelectorAll('#scov,.scfull').forEach(x => x.remove()); DEC.A = { aud: () => null, stop: () => {}, pause: () => {}, go: () => {}, busy: () => false, sid: () => '30499', ok: () => {}, bad: () => {} };
      const q = { en: "What's your name?", t: [['What', '什麼'], ["'s", '是'], ['your', '你的'], ['name?', '名字']], x: ['我的'], z: '你叫什麼名字？' };
      const out = []; for (let i = 0; i < 4; i++) { const d = document.createElement('div'); d.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#000'; document.body.appendChild(d); DEC.lock = false;
        const n0 = DEC.n || 0; decRender(q, d); const tz = [].map.call(d.querySelectorAll('.dctl'), b => b._z); out.push({ mem: (n0 + 1) % 4 === 0, n: tz.length, tz, rc: d.querySelectorAll('.dfxrc').length, gh: /👻|上次 的 你/.test(d.textContent) }); d.remove(); document.querySelectorAll('.dcmi').forEach(x => x.remove()); }
      return { out, race: typeof DFX.race };
    });
    r.out.forEach((o, i) => { ok(!o.rc && !o.gh, '解碼 第 ' + (i + 1) + ' 題 還 有 🏁👻 跑道');
      if (o.mem) { const ex = o.tz.filter(z => ['什麼', '是', '你的', '名字'].indexOf(z) < 0); ok(ex.length >= 4, '🔦 記憶 解碼 錯 方塊 要 ≧ 4 個：' + ex.join(','));
        ok(new Set(o.tz).size === o.tz.length, '🔦 記憶 解碼 方塊 有 重複 ' + o.tz.join(','));
        ok(ex.every(z => ['我的', '你', '他的', '誰', '幾歲', '不是', '是的', '年紀', '生日', '她的', '我'].indexOf(z) >= 0), '🔦 記憶 解碼 錯 方塊 不是 相近 的：' + ex.join(',')); }
      else ok(o.n === 5, '一般 解碼 方塊 數 不 應該 變（4 格＋1 錯）' + o.n); });
    ok(r.out.some(o => o.mem), '4 題 裡 沒有 🔦 記憶 題'); ok(r.race === 'undefined', 'DFX.race 還在');
    /* 7-A 大／小 動畫 */
    const cz = await p.evaluate(() => { const d = document.createElement('div'); d.innerHTML = caseTag('A') + caseTag('a'); document.body.appendChild(d); const k = d.querySelectorAll('.czk'); const a = [].map.call(k, x => getComputedStyle(x).animationName + '|' + x.textContent); d.remove(); return a; });
    ok(cz[0] === 'czBig|大' && cz[1] === 'czSm|小', '7-A：「大」變大、「小」變小 的 動畫 不對 ' + cz.join(','));
    /* 7-B／7-C／lw／lwh 題目 */
    for (const m of ['lw', 'lwh', 'la', 'lf']) {
      const s = await p.evaluate(m => { window.__NOLWI = 1; window.__NOGO = 1; startLW(m); return { n: R.qs.length, sim2: R.qs.filter(q => q.sim === 2).length, sim1: R.qs.filter(q => q.sim === 1).length, says: R.qs.map(q => q.say), lisw: R.qs.filter(q => q.lisw).length, lis: R.qs.filter(q => q.lis).length, nm: G.nm, B: G.B === LWP[m] }; }, m);
      ok(s.n === 10 && s.B, m + '：一回 要 10 題 ' + JSON.stringify(s).slice(0, 120));
      if (m === 'lw') ok(s.sim2 === 5, 'lw 現場：5 題 要 跟 期中考 相同 ' + s.sim2);
      if (m === 'lwh') ok(s.sim1 === 5 && s.sim2 === 0, 'lwh 在家：5 題 相似（方向 反過來）、不可以 有 原題 ' + s.sim1 + '/' + s.sim2);
      if (m === 'la') ok(s.lis === 10 && new Set(s.says).size === 10, '🔤 聽 字母 寫：10 題 都 聽、字母 不 重複');
      if (m === 'lf') { ok(s.lisw === 10 && new Set(s.says).size === 10, '🐷 聽 字首音 寫：10 題 都 聽 單字、字 不 重複');
        ok(s.says.every(w => D.EXAM_D.indexOf(w) < 0 && !/^[ckqxaeiou]/.test(w)), '🐷 用了 考卷 的 字 或 第一個 聲音 有 兩種 寫法 的 字 ' + s.says.join(',')); }
      await p.waitForTimeout(1200);
      const v = await p.evaluate(() => { const a = document.querySelector('#stage .ask'), c = a && a.querySelector('.cz'); return { t: a ? a.textContent : '', cz: !!c, pic: !!document.querySelector('#stage .mlw'), ox: document.documentElement.scrollWidth - innerWidth }; });
      ok(v.cz && v.ox <= 1, m + '：題目 上 沒有 大／小 標籤 或 超出 ' + JSON.stringify(v));
      if (m === 'lf') ok(v.pic && /第一個 字母/.test(v.t), '🐷 題目 要 有 圖＋「寫 第一個 字母」' + JSON.stringify(v));
      if (m === 'la') ok(/聽 一個 字母/.test(v.t), '🔤 題目 要 寫「聽 一個 字母」');
      await p.evaluate(() => { try { clr(); } catch (e) { } BUSY = false; });
    }
    ok(D.LWP.lw.slice(0, D.LW.length).every((q, i) => q === undefined || JSON.stringify(q) === JSON.stringify(D.LW[i])), 'lw 題庫 前面 要 跟 舊 的 一樣（昨天 的 成績 題號 才 對得上）');
    ok(!errs.length, '三年級 JS 錯誤 ' + errs.join(' | ').slice(0, 200)); await ctx.close(); }
  /* lw.html（在家 ✍️ 字母 書寫）*/
  for (const vp of [[1024, 768], [820, 1180]]) { const ctx = await mkCtx(vp, { login: '30412' }), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, 'g3mid', 'lw.html')); await p.waitForTimeout(900);
    await p.evaluate(() => document.querySelectorAll('.scfull').forEach(x => x.remove()));
    const c = await p.evaluate(() => { const o = document.getElementById('hm25'), g = document.getElementById('hmgo'), h = o && o.querySelector('a.lwhome'); return { on: o && !o.hidden, t: o ? o.textContent : '', g: g ? g.getBoundingClientRect().height : 0, h: h && h.getAttribute('href'), ox: document.documentElement.scrollWidth - innerWidth, lob: !document.getElementById('lobby').hidden }; });
    ok(c.on && /字母 書寫/.test(c.t) && c.g >= 72 && c.h === '../g3-review/index.html' && c.ox <= 1 && !c.lob, 'lw.html 封面 不對 ' + vp.join('×') + JSON.stringify(c));
    await p.evaluate(() => { window.__NOLWI = 1; window.__NOGO = 1; }); await p.click('#hmgo', { force: true }); await p.waitForTimeout(600);
    const s = await p.evaluate(() => ({ m: LWM, n: R && R.qs.length, sim: R && R.qs.filter(q => q.sim === 1).length, set: 'g3gm_' + crSet() + '-' + G.id }));
    ok(s.m === 'lwh' && s.n === 10 && s.sim === 5 && s.set === 'g3gm_lwh-q5', 'lw.html 開始 以後 不對 ' + JSON.stringify(s));
    ok(!errs.length, 'lw.html JS 錯誤 ' + errs.join(' | ').slice(0, 200)); await ctx.close(); }
  { const h = fs.readFileSync(path.join(ROOT, 'g3-review', 'index.html'), 'utf8'); ok(/href="\.\.\/g3mid\/lw\.html"/.test(h), '三年級 在家複習 首頁 沒有 ✍️ 字母 書寫');
    ok(!/lw\.html/.test(fs.readFileSync(path.join(ROOT, 'g4-review', 'index.html'), 'utf8')), '四年級 在家複習 不 應該 有 ✍️ 字母 書寫'); }
  /* ④ 秒懂 動畫〔▶ 進入 下一頁〕＋第二次 只 剩 重點 頁 */
  for (const site of ['g3mid', 'midterm']) { const ctx = await mkCtx([1024, 768], { login: site === 'g3mid' ? '30401' : '40201' }), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, site, 'index.html')); await p.waitForTimeout(700);
    const r = await p.evaluate(async () => { document.querySelectorAll('#scov,.scfull').forEach(x => x.remove()); const s = RVD.dc; let done = 0; RVA.play(s, () => { done = 1; });
      const W = ms => new Promise(r => setTimeout(r, ms)); for (let i = 0; i < 40 && document.getElementById('rvgo').disabled; i++) await W(100); document.getElementById('rvgo').click(); await W(300);
      const b = document.getElementById('rvnext'), l0 = b.disabled, t0 = b.textContent, p0 = RVA.S.i; let k = 0; while (b.disabled && k < 300) { await W(100); k++; }
      const l1 = !b.disabled, t1 = b.textContent, still = RVA.S.i === p0; b.click(); await W(400); const p1 = RVA.S.i, l2 = document.getElementById('rvnext').disabled;
      RVA.close(); try { localStorage.setItem('rvv_' + RVA.A.gr + '_dc_' + (RVA.A.sid() || '0'), '1'); } catch (e) { } RVA.play(s, () => {}); const nS = RVA.S.spec.sc.length; RVA.close();
      return { l0, t0, l1, t1, still, p0, p1, l2, nS, key: s.key.length, full: s.sc.length, fs: parseFloat(getComputedStyle(b).fontSize) }; });
    ok(r.l0 && /看完/.test(r.t0), site + '〔▶ 進入 下一頁〕一開始 要 鎖住 ' + JSON.stringify(r));
    ok(r.l1 && /進入 下一頁/.test(r.t1) && r.still, site + ' 唸完 要 解鎖、而且 不 自己 換頁 ' + JSON.stringify(r));
    ok(r.p1 === r.p0 + 1 && r.l2, site + ' 按了 要 到 下一頁、新 的 一頁 又 鎖住 ' + JSON.stringify(r));
    ok(r.nS === r.key && r.key < r.full, site + ' 看過 一次 要 只 剩 重點 頁 ' + r.nS + '/' + r.key + '/' + r.full);
    ok(!errs.length, site + ' 動畫 JS 錯誤 ' + errs.join(' | ').slice(0, 200)); await ctx.close(); }
  /* ⑤ spk 不 丟 */
  { const ctx = await mkCtx([1024, 768], { login: '30412', spk: 1 }), p = await ctx.newPage(); await p.goto('file://' + path.join(ROOT, 'g3mid', 'index.html')); await p.waitForTimeout(700);
    const r = await p.evaluate(async () => { sessionStorage.setItem('score_pks_30412', 'K1'); scPut('q', [{ id: '30412', set: 'g3gm_g3m-q1', m: 'g', qs: [[1, 0, 1, 0, 0, 0]], u: 'u1' }]); const k1 = (scGet('q')[0] || {}).k;
      await scFlush(); const q = scGet('q') || [], h = scGet('qk') || []; sessionStorage.removeItem('score_pks_30412'); scPkSave('30412', 'K2', false); await new Promise(r => setTimeout(r, 200)); const q2 = scGet('q') || [];
      return { k1, q: q.length, h: h.length, back: q2.length, k2: q2[0] && q2[0].k, left: (scGet('qk') || []).length }; });
    ok(r.k1 === 'K1', '⑤ 排 進 佇列 沒有 帶 通行證 ' + JSON.stringify(r));
    ok(r.q === 0 && r.h === 1, '⑤ 伺服器 說 spk：紀錄 要 收 起來（不可以 丟掉）' + JSON.stringify(r));
    ok(r.back === 1 && r.k2 === 'K2' && r.left === 0, '⑤ 打對 密碼 以後 要 補 送 ' + JSON.stringify(r)); await ctx.close(); }
  /* ⑥ 密碼 勾選 方框 */
  for (const vp of [[1024, 768], [820, 1180]]) { const ctx = await mkCtx(vp), p = await ctx.newPage(); await p.goto('file://' + path.join(ROOT, 'g3mid', 'index.html')); await p.waitForTimeout(700);
    const r = await p.evaluate(() => { SCH.open(); scPwVow({}, () => {}, false); const c = document.getElementById('scVow'), bx = document.querySelector('.vwbx'), f = document.querySelector('.vwf'), s = document.querySelectorAll('#scVowS span'), cr = c.getBoundingClientRect();
      const a = { w: cr.width, glow: getComputedStyle(bx).boxShadow, anim: getComputedStyle(bx).animationName, fa: getComputedStyle(f).animationName, s1: s[0].className, inv: cr.bottom <= innerHeight && cr.top >= 0 };
      c.click(); a.s2 = document.querySelectorAll('#scVowS span')[1].className; a.btn = !document.getElementById('scVowB').disabled; a.fv = getComputedStyle(f).visibility; return a; });
    ok(r.w >= 54 && /255, 213, 74/.test(r.glow) && r.anim === 'none' && r.fa !== 'none' && /on/.test(r.s1) && r.inv, '⑥ 方框 要 放大、穩定 發亮（不閃）、👉 手指、① 亮 ' + vp.join('×') + JSON.stringify(r));
    ok(/on/.test(r.s2) && r.btn && r.fv === 'hidden', '⑥ 勾了 以後 ② 要 亮、按鈕 解鎖、手指 收起來 ' + JSON.stringify(r)); await ctx.close(); }
  /* ⑦ 保底 寶箱 */
  { const ctx = await mkCtx([1024, 768]), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + path.join(ROOT, 'rpg', 'index.html')); await p.waitForTimeout(800);
    const r = await p.evaluate(async () => { const b = document.createElement('div'); b.className = 'chips'; b.innerHTML = '<button class="bch" data-bch="2">🎁 保底 寶箱 ✕ 2</button>'; document.body.appendChild(b); b.firstChild.click();
      await new Promise(r => setTimeout(r, 2800)); const o = document.getElementById('bchO'), t = o ? o.textContent : '', on = o && o.classList.contains('on'), okb = document.getElementById('bchOk'), op = okb ? getComputedStyle(okb).opacity : 0; if (okb) okb.click(); return { on, t, op, off: o && !o.classList.contains('on') }; });
    ok(r.on && /打開/.test(r.t) && /120/.test(r.t) && +r.op > .9 && r.off, '⑦ 保底 寶箱 點了 要 打開＋寫 🪙 ＋120（2 個）、〔👌 好〕關掉 ' + JSON.stringify(r).slice(0, 200));
    ok(!errs.length, '⑦ 戰神之路 JS 錯誤 ' + errs.join(' | ').slice(0, 200)); await ctx.close(); }
  await br.close();
  E.forEach(e => console.log('✗ ' + e)); console.log('第四十一次 量測 ' + n + ' 項，失敗 ' + E.length + ' 項');
})();
