/* g3mid/_verify_ctl.js — 2026-10-31 第三十五次 第 2 點：解碼 秒懂 動畫、怎麼玩 教學 的〔⏸️ 暫停〕〔🔁 再播一次〕〔🐢 慢速〕＋生活例句。只印失敗項和一行總結。
 *   node g3mid/_verify_ctl.js   （三、四年級；1024×768、820×1180；不連 成績表） */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
let fails = 0, n = 0; const bad = (t, x) => { fails++; console.log('✗ ' + t + (x ? ' ' + JSON.stringify(x) : '')); };
(async () => { const b = await chromium.launch();
  for (const [f, U1] of [['g3mid/index.html', 'A'], ['midterm/index.html', 'A']]) for (const vp of [[1024, 768], [820, 1180]]) {
    const tag = f.split('/')[0] + ' ' + vp.join('×'), p = await b.newPage({ viewport: { width: vp[0], height: vp[1] } }), er = []; p.on('pageerror', e => er.push(e.message));
    await p.addInitScript(() => { window.__SCORE_TEST_OFF = 1; window.__DCLK = .3; window.__DCLMIN = 0; window.__NOUNLOCK = 1; });
    await p.goto('file://' + path.join(__dirname, '..', f)); await p.waitForTimeout(600);
    const L = await p.evaluate(() => { const s = LES.A[1].s; return { ex: s.filter(x => x.eq && /生活例句/.test(x.eq.tag)).length, eq: s.filter(x => x.eq && /縮寫/.test(x.eq.tag)).length }; });
    n++; if (L.ex < 2 || L.eq < 2) bad(tag + ' Unit 1 秒懂 動畫 縮寫／生活例句 不夠', L);
    await p.evaluate(() => decLesson(LES.A[1], function () {})); await p.waitForTimeout(1500);
    const dot = () => p.evaluate(() => [].findIndex.call(document.querySelectorAll('#dcl .dlp i'), d => d.className === 'on'));
    const sz = await p.evaluate(() => [].map.call(document.querySelectorAll('#dcl .dlctl button'), x => { const r = x.getBoundingClientRect(); return [r.height, parseFloat(getComputedStyle(x).fontSize), r.bottom <= innerHeight + 1]; }));
    n++; if (sz.length !== 3 || sz.some(s => s[0] < 48 || s[1] < 18 || !s[2])) bad(tag + ' 三顆 按鈕 太小／不在 畫面 裡', sz);
    const d0 = await dot(); await p.click('#dcP'); await p.waitForTimeout(3500); const d1 = await dot(), pz = await p.evaluate(() => DEC.pz && document.getElementById('dcl').classList.contains('pz'));
    n++; if (d1 !== d0 || !pz) bad(tag + ' 按 暫停 還 在 走', { d0, d1, pz });
    await p.click('#dcP'); await p.waitForTimeout(4500); const d2 = await dot(); n++; if (d2 <= d1) bad(tag + ' 按 繼續 沒有 接著 演', { d1, d2 });
    await p.click('#dcR'); await p.waitForTimeout(300); n++; if (await dot() !== 0) bad(tag + ' 再播一次 沒有 從頭');
    await p.click('#dcS'); n++; if (!(await p.evaluate(() => DEC.slow && decK() > (window.__DCLK || 1)))) bad(tag + ' 慢速 沒有 變慢');
    await p.click('#dcS');
    /* 生活例句 那一頁：兩行 都 出來、不 超出 畫面 */
    const ei = await p.evaluate(() => LES.A[1].s.findIndex(x => x.eq && /生活例句/.test(x.eq.tag)));
    await p.evaluate(i => { const L = LES.A[1]; decLesson(Object.assign({}, L, { s: L.s.slice(i, i + 1) }), function () {}); }, ei); await p.waitForTimeout(6500);
    const e = await p.evaluate(() => { const g = document.querySelector('#dcl .dleq'), r = g && g.getBoundingClientRect(), cs = document.querySelectorAll('#dcl .dleq .dlc.in').length;
      return { ok: !!g, in: cs, l: r && r.left, r: r && r.right, w: innerWidth, tag: (document.querySelector('#dcl .dltag') || {}).textContent }; });
    n++; if (!e.ok || e.in < 6 || e.l < -1 || e.r > e.w + 1 || !/生活例句/.test(e.tag || '')) bad(tag + ' 生活例句 沒有 演 完／超出 畫面', e);
    n++; if (er.length) bad(tag + ' JS 例外', er[0]);
    await p.close(); }
  await b.close(); console.log((fails ? '❌' : '✓') + ' 秒懂 動畫 暫停／再播／慢速＋生活例句：量了 ' + n + ' 項，失敗 ' + fails + ' 項'); process.exit(fails ? 1 : 0); })();
