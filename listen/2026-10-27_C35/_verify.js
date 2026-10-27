/* node listen/2026-10-27_C35/_verify.js — 問題頁 C35：三種 螢幕 不 左右 捲、字 ≧ 20px、拖曳 樣品 點 方塊＋點 格子 放得進去、放滿 會 對 答案（只 印 失敗 項）*/
const path = require('path'), { chromium } = require('/opt/node22/lib/node_modules/playwright');
const E = []; let n = 0;
(async () => { const b = await chromium.launch();
  for (const vp of [[820, 1180], [1024, 768], [1920, 1080]]) { const p = await b.newPage({ viewport: { width: vp[0], height: vp[1] } }), er = []; p.on('pageerror', e => er.push(e.message));
    await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(300); const t = vp.join('×');
    const m = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth - innerWidth, sm: [].filter.call(document.querySelectorAll('body *'), x => x.childNodes.length && [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && x.getBoundingClientRect().width && parseFloat(getComputedStyle(x).fontSize) < 18 && !x.closest('.src')).length }));
    n += 2; if (m.ox > 1) E.push(t + ' 左右 捲 ' + m.ox); if (m.sm) E.push(t + ' 字 太小 ' + m.sm + ' 個');
    await p.evaluate(() => { const s = S[0]; s.forEach((x, i) => { const tl = [].find.call(document.querySelectorAll('.tile:not(.used)'), y => y.textContent === x[1]); tl.click(); document.querySelector('.slot[data-s="' + i + '"]').click(); }); });
    n++; const r = await p.textContent('#dgres'); if (!/放對 4 ／ 4 格 ＝ 100%/.test(r)) E.push(t + ' 拖曳 樣品 對 答案 不對：' + r);
    n++; if (er.length) E.push(t + ' 程式 錯誤 ' + er[0]); await p.close(); }
  await b.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '✗' : '✓') + ' C35 問題頁 量了 ' + n + ' 項，失敗 ' + E.length + ' 項'); })();
