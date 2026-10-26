/* fun/_verify.js — 🏰 守城、🎣 釣魚（在家複習 版）量測。只印失敗項和一行總結。  node fun/_verify.js
 * 假 的 成績 伺服器（script.test）＋ 已經 登入 30401／40201；絕對 不 送 真的。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0; const CJK = /[㐀-鿿]/;
(async () => { const br = await chromium.launch();
  for (const g of [3, 4]) for (const k of ['castle', 'fish']) for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) { const tag = g + ' 年級 ' + k + ' ' + vp.join('×'), id = g + '0' + (g === 3 ? 4 : 2) + '01';
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }); const posts = [];
    await ctx.route(/^https?:\/\//, r => { if (/script\.test/.test(r.request().url())) { if (r.request().method() === 'POST') posts.push(r.request().postData()); return r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"ok":true,"dup":[],"tasks":[],"locks":[]}' }); } return r.abort(); });
    await ctx.addInitScript(id => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); localStorage.setItem('score_last', JSON.stringify(id)); localStorage.setItem('score_id_g' + id.charAt(0), JSON.stringify(id)); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id);
      HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 40); return Promise.resolve(); }; }, id);
    const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, 'g' + g + '-review', k + '.html')); await p.waitForTimeout(500);
    n++; const a = await p.evaluate(() => ({ pool: POOL.length, cjk: POOL.filter(q => /[㐀-鿿]/.test(q.t.replace(/<[^>]+>/g, '').replace(/§i:[^§]+§/g, '')) || q.o.some(o => /[㐀-鿿]/.test(String(o).replace(/<[^>]+>/g, '')))).length, home: (document.querySelector('a.hb') || {}).getAttribute && document.querySelector('a.hb').getAttribute('href') }));
    if (a.pool < 120 || a.cjk || a.home !== 'index.html') E.push(tag + ' 題庫／全英文／回首頁 ' + JSON.stringify(a));
    await p.click('#go'); await p.waitForTimeout(900);
    n++; const b = await p.evaluate(() => { const bs = [...document.querySelectorAll('#op button')], qt = document.getElementById('qt');
      return { n: bs.length, low: bs.filter(x => x.getBoundingClientRect().height < 48 || parseFloat(getComputedStyle(x).fontSize) < 22).length, qcjk: /[㐀-鿿]/.test(qt.textContent), ox: document.documentElement.scrollWidth - innerWidth,
        off: [...document.querySelectorAll('#play *')].filter(x => { const r = x.getBoundingClientRect(); return r.width && (r.bottom > innerHeight + 1 || r.right > innerWidth + 1); }).length }; });
    if (b.n < 2 || b.low || b.qcjk || b.ox > 1 || b.off) E.push(tag + ' 題目 畫面（選項 ≧ 48px、字 ≧ 22px、題目 沒 中文、不 超出）' + JSON.stringify(b));
    /* 答對 一題 */
    await p.waitForTimeout(1100); await p.evaluate(() => [...document.querySelectorAll('#op button')].find(x => x.dataset.i === '0').click());
    if (k === 'fish') { await p.waitForSelector('#reel', { timeout: 6000 }).catch(() => {}); n++; if (!(await p.$('#reel'))) E.push(tag + ' 答對 沒有 拋竿〔收線！〕'); else { await p.click('#reel', { force: true }); await p.waitForTimeout(400); n++; if (!(await p.$('.catch .en'))) E.push(tag + ' 收線 沒有 釣到 魚 字卡'); } await p.waitForTimeout(2500); }
    else { await p.waitForTimeout(1300); n++; const c = await p.evaluate(() => ({ ok: R.ok, mons: document.querySelectorAll('.mon').length })); if (c.ok !== 1 || !c.mons) E.push(tag + ' 答對 以後 ' + JSON.stringify(c)); }
    /* 答錯 一題 ➜ 正確 答案（逐字 中文、整句、時間 停住）*/
    await p.waitForTimeout(1100); await p.evaluate(() => { const x = [...document.querySelectorAll('#op button')].find(x => x.dataset.i !== '0'); x.click(); }); await p.waitForTimeout(900);
    n++; const d = await p.evaluate(() => ({ on: document.getElementById('fb').classList.contains('on'), gw: document.querySelectorAll('#fb .gw').length, t1: tLeft() })); await p.waitForTimeout(800); const t2 = await p.evaluate(() => tLeft());
    if (!d.on || !d.gw || Math.abs(d.t1 - t2) > .05) E.push(tag + ' 答錯 沒有 正確 答案 頁（或 時間 還在 走）' + JSON.stringify(d) + ' ' + t2);
    await p.waitForSelector('#fbn:not([hidden])', { timeout: 6000 }).catch(() => {}); await p.click('#fbn').catch(() => {});
    await p.waitForTimeout(1300); await p.evaluate(() => finish()); await p.waitForTimeout(800);
    n++; const e = await p.evaluate(() => ({ end: !document.getElementById('endv').hidden, t: document.getElementById('end').textContent, q: JSON.parse(localStorage.getItem('score_q') || '[]') }));
    const sent = posts.concat(e.q.map(x => JSON.stringify(x))).join(' ');
    if (!e.end || !/再玩 一次/.test(e.t) || sent.indexOf('g' + g + 'gm_fun-' + k) < 0) E.push(tag + ' 結束 頁／成績（g' + g + 'gm_fun-' + k + '）' + e.t.slice(0, 40));
    n++; if (errs.length) E.push(tag + ' JS：' + errs.slice(0, 2).join('｜'));
    await ctx.close(); }
  /* 在家複習 首頁 有 兩個 新 遊戲 */
  for (const d of ['g3-review', 'g4-review']) { n++; const h = fs.readFileSync(path.join(ROOT, d, 'index.html'), 'utf8'); if (!/href="castle\.html"/.test(h) || !/href="fish\.html"/.test(h)) E.push(d + ' 首頁 沒有 守城／釣魚'); }
  await br.close(); E.forEach(x => console.log('✗ ' + x)); console.log((E.length ? '✗' : '✓') + ' 守城、釣魚（在家複習）量了 ' + n + ' 項，失敗 ' + E.length + ' 項'); process.exit(E.length ? 1 : 0); })();
