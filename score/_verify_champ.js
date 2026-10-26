/* score/_verify_champ.js — 2026-10-26 第二十九次 第 11 點：👑 冠軍寶箱 登入 動畫（學生 登入 ➜ 為什麼 拿到 ➜ 點 寶箱 ➜ 🪙 ⭐ 飛進 收藏庫）。只印失敗項和一行總結。
 *   node score/_verify_champ.js
 * 假伺服器（script.test）：GET rpg 回 chi（上週 三年級 第 2 名、48 分鐘）＋ v.ch＝1；POST open 回 🪙250 ⭐150。不連真的 成績表。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
let n = 0, E = [];
(async () => { const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) { const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }), tag = vp.join('×'); let opened = 0, gets = 0;
    const J = b => ({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(b) });
    await ctx.route(/^https?:\/\//, r => { const u = r.request().url(); if (!/script\.test/.test(u)) return r.abort();
      if (r.request().method() === 'POST') { const b = JSON.parse(r.request().postData() || '{}'); if (b.op === 'open') { opened++; return r.fulfill(J({ ok: true, r: { c: 250, x: 150 }, v: { coins: 1250, xp: 650, ch: 0 } })); } return r.fulfill(J({ ok: true, dup: [] })); }
      if (/a=rpg/.test(u)) { gets++; return r.fulfill(J({ ok: true, v: { coins: 1000, xp: 500, ch: 1 }, chi: { k: 'ch|2026-10-19|g3', rk: 2, sec: 2880, g: 3 } })); }
      return r.fulfill(J({ ok: true, tasks: [], locks: [] })); });
    await ctx.addInitScript(() => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); localStorage.setItem('score_last', '"30401"'); localStorage.setItem('score_id_g3', '"30401"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', '30401'); });
    const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(__dirname, '..', 'g3-review', 'index.html')); await p.waitForTimeout(5200);
    n++; const a = await p.evaluate(() => { const o = document.getElementById('scch'); return o ? { on: o.classList.contains('on'), t: o.textContent, sm: [].filter.call(o.querySelectorAll('.cht,.chwhy div,.chtap,.chbag span'), x => parseFloat(getComputedStyle(x).fontSize) < 18).length } : null; });
    if (!a || !a.on || !/冠軍 寶箱/.test(a.t) || !/最認真練習 第 2 名/.test(a.t) || !/48 分鐘/.test(a.t) || !/我的 收藏庫/.test(a.t) || a.sm) E.push(tag + ' 登入 以後 沒有 演 冠軍寶箱（或 看不懂 為什麼 拿到）' + JSON.stringify(a).slice(0, 160));
    await p.click('#chBox', { force: true }); await p.waitForTimeout(4200);
    n++; const b = await p.evaluate(() => ({ c: document.getElementById('chC').textContent, x: document.getElementById('chX').textContent, end: !document.getElementById('chEnd').hidden, mark: localStorage.getItem('score_chs_30401'),
      off: [].filter.call(document.querySelectorAll('#scch .chw > *'), x => { const r = x.getBoundingClientRect(); return r.height && (r.bottom > innerHeight + 1 || r.top < -1); }).map(x => x.className + ':' + Math.round(x.getBoundingClientRect().top) + '-' + Math.round(x.getBoundingClientRect().bottom)), box: document.getElementById('chBox').getBoundingClientRect().height }));
    if (opened !== 1 || b.c !== '1250' || b.x !== '650' || !b.end || !/ch\|2026-10-19\|g3/.test(b.mark || '') || b.off.length || b.box < 80) E.push(tag + ' 打開 寶箱 不對（真的 開、數字 數上去、收下、記住、不超出 畫面）' + JSON.stringify(b) + ' 開 ' + opened);
    await p.click('#chOk'); n++; if (await p.evaluate(() => document.getElementById('scch').classList.contains('on'))) E.push(tag + '〔✅ 收下〕沒有 關掉');
    await p.reload(); await p.waitForTimeout(3000); n++; if (await p.evaluate(() => { const o = document.getElementById('scch'); return !!(o && o.classList.contains('on')); })) E.push(tag + ' 同一個 寶箱 演 了 兩次');
    n++; if (errs.length) E.push(tag + ' JS 例外：' + errs.join('｜'));
    await ctx.close(); }
  await br.close(); if (E.length) console.log('✗ ' + E.join('\n✗ ')); console.log((E.length ? '✗' : '✓') + ' 冠軍寶箱 登入 動畫 量了 ' + n + ' 項，失敗 ' + E.length + ' 項'); process.exit(E.length ? 1 : 0); })();
