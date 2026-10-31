/* score/_verify_dsp.js — 2026-10-31 第三十五次 第 11 點：學生 看到 的 中文 說明 字詞 中間 不 空格。只印失敗項和一行總結。
 *   node score/_verify_dsp.js
 * 不連 真的 成績表（script.google 一律 擋掉）、不連 真的 Firebase（擋掉）。兩種 尺寸：1024×768、820×1180。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), { pathToFileURL } = require('url'), D = require('./_dsp.js');
const ROOT = path.join(__dirname, '..');
const PAGES = ['g3mid/index.html', 'g3mid/home.html', 'midterm/index.html', 'midterm/home.html', 'live/index.html', 'live/host.html', 'g3-review/index.html', 'g4-review/index.html', 'rpg/index.html'];
const BAD = new RegExp(D.RE);
let fails = 0, n = 0;
(async () => {
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180]]) for (const f of PAGES) {
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.addInitScript(() => { window.__DSPTEST = 1; window.__SCORE_TEST_OFF = 1; });
    await ctx.route(/script\.google(usercontent)?\.com|firebaseio\.com|firebasedatabase\.app/, r => r.abort());
    const p = await ctx.newPage(), er = []; p.on('pageerror', e => er.push(e.message));
    await p.goto(pathToFileURL(path.join(ROOT, f)).href); await p.waitForTimeout(1200);
    /* 登入 框（有 的 頁 有）也 打開 量 一次 */
    await p.evaluate(() => { try { if (typeof scLogin === 'function' && typeof SCH !== 'undefined' && SCH.open) scLogin(function () {}); } catch (e) {} }); await p.waitForTimeout(400);
    const r = await p.evaluate(src => { const R = new RegExp(src), w = document.createTreeWalker(document.body, 4), out = []; let t;
      while ((t = w.nextNode())) { const e = t.parentElement; if (!e || e.closest('script,style,textarea,.keepsp')) continue; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (R.test(t.nodeValue)) out.push(t.nodeValue.trim().slice(0, 40)); } return out; }, D.RE);
    n += 2; const tag = vp.join('×') + ' ' + f;
    if (r.length) { fails++; console.log('✗ ' + tag + '：還有 空格 ' + r.length + ' 處，例：' + r.slice(0, 3).join('｜')); }
    if (er.length) { fails++; console.log('✗ ' + tag + '：JS 例外 ' + er[0]); }
    await ctx.close();
  }
  /* 只 改 畫面、中文 和 英文／數字 中間 的 空格 留著 */
  n += 3; if (D.fix('⏰ 時間 到！你 的 成績') !== '⏰ 時間到！你的成績') { fails++; console.log('✗ fix 不對'); }
  if (D.fix('第 2 題') !== '第 2 題' || D.fix('我是 Amy。') !== '我是 Amy。') { fails++; console.log('✗ 中文 和 英文／數字 中間 的 空格 被 拿掉'); }
  await br.close();
  console.log((fails ? '❌' : '✓') + ' 中文 說明 不 空格：量了 ' + n + ' 項，失敗 ' + fails + ' 項');
  process.exit(fails ? 1 : 0);
})();
