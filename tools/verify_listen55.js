/* tools/verify_listen55.js — 第五十五次 兩個 預覽頁（listen/2026-11-15_P55 新聲音、listen/2026-11-15_C55 從注音到英文拼字）量測：node tools/verify_listen55.js（只 印 失敗）
 * 每一頁：沒有 程式 錯誤、每一個 聲音 檔 都 存在、iPad 橫／直、教室 觸控 螢幕 沒有 橫 捲、按鈕 ≧ 56px、字 ≧ 17px；C55 九步 都 走 得 完、最後 一步 方框／聲音／音節 數 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright'); const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
(async () => { const br = await chromium.launch();
  for (const pg of ['listen/2026-11-15_P55/index.html', 'listen/2026-11-15_C55/index.html']) for (const vp of [[1024, 768], [768, 1024], [1920, 1080]]) {
    const tag = pg.split('/')[1] + ' ' + vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(() => { HTMLMediaElement.prototype.play = function () { (window.__S = window.__S || []).push(this.src); const a = this; setTimeout(() => a.onended && a.onended(), 30); return Promise.resolve(); }; });
    await p.goto('file://' + path.join(ROOT, pg)); await p.waitForTimeout(500);
    if (/C55/.test(pg)) {
      for (let i = 0; i < 9; i++) { await p.waitForTimeout(200); const bx = await p.evaluate(() => document.querySelectorAll('#steps .bx').length); ok(bx > 0, tag + ' 第 ' + (i + 1) + ' 步 沒有 方框'); if (i < 8) await p.click('#bn'); }
      await p.waitForTimeout(2500); const c = await p.evaluate(() => document.getElementById('cnt').innerText); ok(/4/.test(c) && /音節/.test(c), tag + ' 最後 一步 baby 的 數 不對 ' + c);
      for (const w of ['bathroom', 'kitchen', 'rabbit', 'happy', 'baby']) await p.click('#stw [data-w="' + w + '"]');
      for (const b of await p.$$('#g44 [data-a]')) await b.click(); await p.click('#stsw');
    } else { for (const b of await p.$$('button')) await b.click().catch(() => {}); }
    await p.waitForTimeout(800);
    const played = await p.evaluate(() => window.__S || []);
    ok(played.length > 5, tag + ' 幾乎 沒有 播 聲音 ' + played.length);
    for (const s of new Set(played)) { const f = decodeURIComponent(s.replace(/^file:\/\//, '')); ok(fs.existsSync(f), tag + ' 沒有 這個 聲音 檔 ' + s); }
    const lay = await p.evaluate(() => ({ ov: document.documentElement.scrollWidth > innerWidth + 2, small: [...document.querySelectorAll('button')].filter(b => b.offsetParent && b.getBoundingClientRect().height < 56).length,
      tiny: [...document.querySelectorAll('p,td,button,.note,.cnt span')].filter(e => e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 17).length }));
    ok(!lay.ov, tag + ' 有 橫 捲'); ok(!lay.small, tag + ' 有 ' + lay.small + ' 個 按鈕 太小'); ok(!lay.tiny, tag + ' 有 ' + lay.tiny + ' 個 字 太小');
    ok(!errs.length, tag + ' 程式 錯誤 ' + errs.join('｜')); await ctx.close(); }
  await br.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第五十五次 預覽頁：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
