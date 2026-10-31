/* sentences/_verify_dgswap.js — 第三十六次 第 3 點：🔄 變身術 拖曳 格子 ↔ 格子 ＝ 互相 交換。node sentences/_verify_dgswap.js */
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const E = [];
  for (const vp of [[1024, 768], [820, 1180]]) { const ctx = await b.newContext({ viewport: { width: vp[0], height: vp[1] } }); await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.addInitScript(() => { window.__SCORE_TEST_OFF = 1; window.DGDEMO = 1; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + require('path').join(__dirname, '..') + '/sentences/games.html'); await p.waitForTimeout(800);
    await p.evaluate(() => { document.querySelectorAll('#scov,.scfull').forEach(x => x.remove()); gGo('g4'); }); await p.waitForTimeout(1500);
    await p.evaluate(() => document.querySelectorAll('#scov,.scfull').forEach(x => x.remove()));
    const has = await p.evaluate(() => !!document.getElementById('dgS')); if (!has) { E.push(vp + ' 沒有 變身術 拖曳'); continue; }
    await p.evaluate(() => { dgPut(0, 0); dgPut(1, 1); });
    const s0 = await p.evaluate(() => DG.slot.slice(0, 2));
    const a = await p.$('#dgD .ds[data-k="0"] .dt'), c = await p.$('#dgD .ds[data-k="1"]'); const r0 = await a.boundingBox(), r1 = await c.boundingBox();
    await p.mouse.move(r0.x + r0.width / 2, r0.y + r0.height / 2); await p.mouse.down(); await p.mouse.move(r0.x + 30, r0.y, { steps: 4 }); await p.mouse.move(r1.x + r1.width / 2, r1.y + r1.height / 2, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(300);
    const s1 = await p.evaluate(() => DG.slot.slice(0, 2)); if (!(s1[0] === s0[1] && s1[1] === s0[0])) E.push(vp + ' 變身術 拖 格子 沒有 交換 ' + JSON.stringify([s0, s1]));
    const gone = await p.evaluate(() => document.querySelectorAll('#dgS .dt.gone').length); if (gone !== 2) E.push(vp + ' 上面 消失 的 字 應該 2 個 ' + gone);
    if (errs.length) E.push(vp + ' JS 錯誤 ' + errs[0]); await ctx.close(); }
  E.forEach(e => console.log('✗ ' + e)); console.log('變身術 交換：' + (E.length ? E.length + ' 失敗' : '0 失敗')); await b.close(); })();
