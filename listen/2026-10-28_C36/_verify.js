/* node listen/2026-10-28_C36/_verify.js — 題目 清單 頁 C36：三種 螢幕 不 左右 捲、字 ≧ 18px、沒有 程式 錯誤（只 印 失敗 項）*/
const path = require('path'), { chromium } = require('/opt/node22/lib/node_modules/playwright');
const E = []; let n = 0;
(async () => { const b = await chromium.launch();
  for (const vp of [[820, 1180], [1024, 768], [1920, 1080]]) { const p = await b.newPage({ viewport: { width: vp[0], height: vp[1] } }), er = []; p.on('pageerror', e => er.push(e.message));
    await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(300); const t = vp.join('×');
    const m = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth - innerWidth, sm: [].filter.call(document.querySelectorAll('body *'), x => [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && x.getBoundingClientRect().width && parseFloat(getComputedStyle(x).fontSize) < 18).length, rows: document.querySelectorAll('tr').length }));
    n += 3; if (m.ox > 1) E.push(t + ' 左右 捲 ' + m.ox); if (m.sm) E.push(t + ' 字 太小 ' + m.sm + ' 個'); if (m.rows < 670) E.push(t + ' 題目 列 太少 ' + m.rows);
    n++; if (er.length) E.push(t + ' 程式 錯誤 ' + er[0]); await p.close(); }
  await b.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '✗' : '✓') + ' C36 題目 清單 頁 量了 ' + n + ' 項，失敗 ' + E.length + ' 項'); })();
