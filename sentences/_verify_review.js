/* sentences/_verify_review.js — 量「三年級複習」「四年級複習」兩個網站（2026-10-03）
 *   node sentences/_verify_review.js
 * ① 首頁：三區、每一個連結都連得到、不橫向溢出、字夠大、看不到「精簡版」
 * ② u1／u2／games：交給 sentences/_verify.js（REVIEW_DIR ＝ 這個網站、SITE_DIR ＝ 那一課的資料、GAMES_ONLY ＝ 這裡的三種）
 * 只印失敗項和一行總結。
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), cp = require('child_process'), { pathToFileURL } = require('url');
const ROOT = path.join(__dirname, '..');
const SITES = [{ d: 'g3-review', src: 'G3 - L1 + L2', games: 'g3,g5,g9' }, { d: 'g4-review', src: 'sentences', games: 'g3,g4,g5' }];
(async () => {
  let fails = 0, n = 0;
  const br = await chromium.launch();
  for (const S of SITES) for (const vp of [[1024, 768], [820, 1180]]) {
    const p = await br.newPage({ viewport: { width: vp[0], height: vp[1] } });
    const f = path.join(ROOT, S.d, 'index.html');
    await p.goto(pathToFileURL(f).href); await p.waitForTimeout(300);
    const r = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth - innerWidth, sec: document.querySelectorAll('section').length,
      links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')), txt: document.body.innerText,
      small: [...document.querySelectorAll('.b b')].filter(b => parseFloat(getComputedStyle(b).fontSize) < 16).length }));
    const e = [];
    if (r.ox > 0) e.push('橫向溢出 ' + r.ox);
    if (r.sec !== 3) e.push('首頁不是三區（' + r.sec + '）');
    if (/精簡/.test(r.txt)) e.push('網站上出現「精簡」');
    if (r.small) e.push(r.small + ' 個按鈕的字小於 16px');
    r.links.forEach(h => { if (/^https?:/.test(h)) return; const q = path.resolve(path.dirname(f), decodeURIComponent(h.split('#')[0])); if (!fs.existsSync(q)) e.push('連不到 ' + h); });
    n += 5 + r.links.length;
    if (e.length) { fails += e.length; console.log('✗ ' + S.d + '/index.html @' + vp.join('x')); e.forEach(x => console.log('   ' + x)); }
    await p.close();
  }
  await br.close();
  let sub = 0;
  for (const S of SITES) {
    try { cp.execFileSync('node', [path.join(__dirname, '_verify.js')], { stdio: 'inherit', env: Object.assign({}, process.env,
      { SITE_DIR: S.src === 'sentences' ? '' : path.join(ROOT, S.src), REVIEW_DIR: path.join(ROOT, S.d), GAMES_ONLY: S.games }) }); }
    catch (x) { sub++; }
  }
  console.log((fails || sub ? '✗ ' : '✓ ') + '複習網站首頁量了 ' + n + ' 項，失敗 ' + fails + ' 項；句型頁／遊戲頁 ' + (sub ? sub + ' 個網站有失敗（見上面）' : '全部通過'));
  process.exit(fails || sub ? 1 : 0);
})();
