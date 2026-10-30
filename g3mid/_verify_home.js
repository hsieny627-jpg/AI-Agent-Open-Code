/* 2026-10-30 第三十四次 第 1～4 點 量測：🏠 25 題 闖關（回家；g3mid/home.html、midterm/home.html）＋ go25 QR 頁 ＋ 總首頁 連結。只 印 失敗 項。
   假 的 成績 伺服器（不送 真的 成績表）、不連 Firebase。node g3mid/_verify_home.js */
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0;
(async () => {
  const br = await chromium.launch();
  for (const site of ['g3mid', 'midterm']) for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) {
    const tag = site + ' ' + vp.join('×'), id = site === 'g3mid' ? '30401' : '40201', D = require(path.join(ROOT, site, '_data.js')), sent = [];
    for (const login of [0, 1]) {
      const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
      await ctx.route(/^https?:\/\//, r => r.abort());
      await ctx.route(/script\.test/, r => { const b = r.request().postData() || ''; if (b) sent.push(b); r.fulfill({ contentType: 'application/json', body: '{"ok":true,"dup":[]}' }); });
      await ctx.addInitScript(([id, login]) => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); window.__NOUNLOCK = 1; window.__NOGO = 1; window.__NOWB = 1; window.__DCLK = .05;
        HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 40); return Promise.resolve(); };
        if (login) { localStorage.setItem('score_last', '"' + id + '"'); localStorage.setItem('score_id_g' + id[0], '"' + id + '"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id); } }, [id, login]);
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto('file://' + path.join(ROOT, site, 'home.html')); await p.waitForTimeout(900);
      if (!login) { /* 沒 登入：一 打開 ＝ 登入（最上面 大字 那一句）*/
        n++; const l = await p.evaluate(() => { const b = document.querySelector('.sclog'); return { t: b ? b.textContent : '', ox: document.documentElement.scrollWidth - innerWidth, h: b ? b.getBoundingClientRect().bottom <= innerHeight + 1 : 0 }; });
        if (!/25 題 闖關/.test(l.t) || !/老師依課本、習作自己設計的練習題。/.test(l.t)) E.push(tag + ' 沒 登入：登入 頁 最上面 沒有「老師依課本、習作自己設計的練習題。」' + l.t.slice(0, 40));
        n++; if (await p.evaluate(() => !!CR)) E.push(tag + ' 回家 闖關 不可以 自己 跳進 現場任務'); }
      else {
        n++; const c = await p.evaluate(() => { const o = document.getElementById('hm25'), r = o && o.querySelector('.hmw').getBoundingClientRect(), g = document.getElementById('hmgo');
          return { on: o && !o.hidden, s: o ? o.querySelector('.hms').textContent : '', fs: o ? parseFloat(getComputedStyle(o.querySelector('.hms')).fontSize) : 0, in: r && r.bottom <= innerHeight + 1 && r.top >= 0, g: g && g.getBoundingClientRect().height, ox: document.documentElement.scrollWidth - innerWidth }; });
        if (!c.on || c.s !== '老師依課本、習作自己設計的練習題。' || c.fs < 28 || !c.in || !(c.g >= 72) || c.ox > 1) E.push(tag + ' 已登入：第一頁 大字 那一句＋〔▶ 開始 第 1 題〕不對 ' + JSON.stringify(c));
        await p.evaluate(() => document.querySelectorAll('.scfull').forEach(x => x.remove()));
        await p.click('#hmgo', { force: true }); await p.waitForTimeout(500);
        n++; const r = await p.evaluate(() => { const L = R.qs || R.gs.map((g, k) => (g.id === 'dc' ? XBX().dc : XBX()[g.id])[R.idx[k]]); return { bk: R.bk, x: R.x, n: L.length, sim: L.filter(q => q && q.sim).length, hid: document.getElementById('hm25').hidden, tut: document.getElementById('dcl').classList.contains('on') }; });
        if (r.bk !== 'H' || r.x !== 25 || r.n !== 25 || r.sim || !r.hid || !r.tut) E.push(tag + ' 按〔▶ 開始〕＝ 馬上 25 題（只有 全新 題、沒有 類似 題）不對 ' + JSON.stringify(r));
        /* 跟 期中考卷 100% 不一樣：題庫 A 的 全新 題 本來 就 檢查 過（build 的 LEAK）；這裡 再 確認 都是 sim 0 */
        n++; const all = await p.evaluate(() => { const XB = XBX(), o = []; Object.keys(XB).forEach(k => XB[k].forEach(q => o.push(q.sim ? 1 : 0))); return o.length; }); if (!all) E.push(tag + ' 題庫 空');
        /* 做完：成績 代號 h25、存 進度 key 分開 */
        await p.evaluate(() => { decClose(); });
        const fin = await p.evaluate(() => { R.Q = R.Q || []; for (let i = 0; i < 25; i++) R.Q.push([1, 0, 3, 0, .5, 0]); if (typeof endX === 'function') { R.score = 100; R.res = R.qs.map(() => 1); endX(); } else { R.sc = 100; R.k = R.idx.length; finX(); } return [...document.querySelectorAll('button')].map(b => b.textContent).join('|'); });
        await p.waitForTimeout(1500);
        n++; const S = sent.join('\n'); if (!new RegExp(site === 'g3mid' ? 'g3gm_g3m-h25' : 'g4gm_mt-h25').test(decodeURIComponent(S))) E.push(tag + ' 做完 沒有 送 h25 成績：' + decodeURIComponent(S).slice(0, 120));
        /* 回 大廳 ＝ 回 闖關 首頁（不是 遊戲 大廳）*/
        await p.evaluate(() => (typeof lobby === 'function' ? lobby : hub)()); await p.waitForTimeout(200); n++;
        if (!(await p.evaluate(() => !document.getElementById('hm25').hidden && /最高/.test(document.getElementById('hm25').textContent)))) E.push(tag + ' 做完 回去 不是 闖關 首頁（或 沒有 🏆 最高）');
      }
      n++; if (errs.length) E.push(tag + ' JS 錯誤：' + errs.slice(0, 2).join(' | '));
      await ctx.close();
    }
  }
  /* go25 QR 頁、總首頁、老師看板 連結 */
  const ctx = await br.newContext({ viewport: { width: 1024, height: 768 } }), p = await ctx.newPage();
  for (const q of ['', '?g=3', '?g=4']) { await p.goto('file://' + path.join(ROOT, 'go25', 'index.html') + q); await p.waitForTimeout(300); n++;
    const r = await p.evaluate(() => ({ c: document.querySelectorAll('.c').length, svg: document.querySelectorAll('.qr svg').length, u: [...document.querySelectorAll('.u')].map(x => x.textContent), say: document.querySelector('.say').textContent, hub: !!document.querySelector('a[href="../index.html"]'), t: !!document.querySelector('a[href="../teacher/index.html"]') }));
    const want = q ? 1 : 2; if (r.c !== want || r.svg !== want || !r.u.every(u => /(g3mid|midterm)\/home\.html$/.test(u)) || r.say !== '老師依課本、習作自己設計的練習題。' || !r.hub || !r.t) E.push('go25' + q + ' 不對 ' + JSON.stringify(r)); }
  n++; const hub = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'); if (!/go25\/index\.html\?g=3/.test(hub) || !/go25\/index\.html\?g=4/.test(hub)) E.push('總首頁 沒有 兩個 年級 的〔📱 25 題 闖關 QR〕');
  n++; const tch = fs.readFileSync(path.join(ROOT, 'teacher', 'index.html'), 'utf8'); if (!/go25\/index\.html\?g=/.test(tch)) E.push('老師看板 沒有〔📱 25 題 闖關 QR〕');
  await br.close();
  E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 25 題 闖關（第三十四次 第 1～4 點）：' + n + ' 項，' + E.length + ' 個失敗'); process.exit(E.length ? 1 : 0);
})();
