/* g3mid/_verify_swap.js — 第三十六次 第 3 點：🔓 解碼 格子 ↔ 格子 拖 ＝ 互相 交換、點 ＝ 拿 回去（三、四年級）。node g3mid/_verify_swap.js */
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const E = [];
  for (const site of ['g3mid', 'midterm']) for (const vp of [[1024, 768], [820, 1180]]) { const ctx = await b.newContext({ viewport: { width: vp[0], height: vp[1] } }); await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.addInitScript(() => { window.__SCORE_TEST_OFF = 1; window.__NOUNLOCK = 1; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + require('path').join(__dirname, '..') + '/' + site + '/index.html'); await p.waitForTimeout(700);
    await p.evaluate(() => { document.querySelectorAll('#scov,.scfull').forEach(x => x.remove()); var d = document.createElement('div'); d.id = 'tdc'; d.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#000'; document.body.appendChild(d);
      DEC.A = { aud: () => null, stop: () => {}, pause: () => {}, go: () => {}, busy: () => false, sid: () => '', ok: () => { window.__OK = 1 }, bad: g => { window.__BAD = g } };
      decRender({ en: "What's your name?", t: [['What', '什麼'], ["'s", '是'], ['your', '你的'], ['name?', '名字']], x: ['我的'], z: '你叫什麼名字？' }, d); });
    const tl = await p.$$('#tdc .dctl'); await tl[0].click(); await p.waitForTimeout(80); const s = await p.$$('#tdc .dcs'); await s[0].click(); await p.waitForTimeout(80);
    const tl2 = await p.$$('#tdc .dctl:not(.used)'); await tl2[0].click(); await p.waitForTimeout(80); await s[1].click(); await p.waitForTimeout(80);
    const b0 = await p.evaluate(() => [].map.call(document.querySelectorAll('#tdc .dcs'), x => x.textContent));
    const r0 = await s[0].boundingBox(), r1 = await s[1].boundingBox();
    await p.mouse.move(r0.x + r0.width / 2, r0.y + r0.height / 2); await p.mouse.down(); await p.mouse.move(r0.x + 30, r0.y + 5, { steps: 4 }); await p.mouse.move(r1.x + r1.width / 2, r1.y + r1.height / 2, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(300);
    const b1 = await p.evaluate(() => [].map.call(document.querySelectorAll('#tdc .dcs'), x => x.textContent));
    if (!(b0[0] && b0[1] && b1[0] === b0[1] && b1[1] === b0[0])) E.push(site + ' ' + vp + ' 解碼 格子 沒有 交換 ' + JSON.stringify([b0, b1]));
    /* 點 一下 格子 ＝ 拿 回去 */ await s[0].click(); await p.waitForTimeout(100); if (await p.evaluate(() => document.querySelectorAll('#tdc .dcs')[0].textContent)) E.push(site + ' 點 格子 沒有 拿 回去');
    if (errs.length) E.push(site + ' JS 錯誤 ' + errs[0]); await ctx.close(); }
  E.forEach(e => console.log('✗ ' + e)); console.log('解碼 交換：' + (E.length ? E.length + ' 失敗' : '0 失敗')); await b.close(); })();
