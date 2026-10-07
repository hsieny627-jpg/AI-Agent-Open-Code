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
    r.links.forEach(h => { if (/^https?:/.test(h)) return; const q = path.resolve(path.dirname(f), decodeURIComponent(h.split('#')[0])); if (!fs.existsSync(q)) e.push('連不到 ' + h);
      /* 2026-10-07 使用者第 12 點：在家複習的網站獨立，不可以連到老師教學用的頁面 */
      if (path.dirname(q) !== path.join(ROOT, S.d)) e.push('連到複習網站外面：' + h); });
    n += 5 + r.links.length;
    /* 補充（複製進來的單字結構、單字故事）：沒有 JS 錯誤、字體和語音檔載得到、🏠 回複習首頁、老師網站的按鈕藏起來 */
    for (const h of r.links.filter(h => !/^(u[12]|games|index)\.html/.test(h))) {
      const q = await br.newPage({ viewport: { width: vp[0], height: vp[1] } }), er = [];
      q.on('pageerror', x => er.push('JS 例外：' + x.message)); q.on('requestfailed', x => er.push('載不到：' + x.url().split('/').slice(-2).join('/')));
      await q.goto(pathToFileURL(path.join(ROOT, S.d, h)).href); await q.waitForTimeout(500);
      const x = await q.evaluate(async () => { await document.fonts.ready; const vis = id => { const b = document.getElementById(id); return !!b && b.getBoundingClientRect().width > 0; };
        return { font: document.fonts.check('700 48px Andika'), aud: !!window.ENAUD, fwd: vis('fwd'), wh: vis('whome'), home: vis('home'), ox: document.documentElement.scrollWidth - innerWidth }; });
      if (!x.font) er.push('Andika 沒有載到'); if (!x.aud) er.push('英文語音檔沒有載到');
      if (x.fwd || x.wh) er.push('老師網站的按鈕（🌍 環遊世界／🔤 單字首頁）還看得到'); if (x.ox > 0) er.push('橫向溢出 ' + x.ox);
      if (x.home) { await q.click('#home'); await q.waitForTimeout(400); if (path.resolve(decodeURIComponent(new URL(q.url()).pathname)) !== path.join(ROOT, S.d, 'index.html')) er.push('🏠 沒有回到複習首頁（' + q.url() + '）'); }
      else er.push('看不到 🏠 首頁');
      n += 6; if (er.length) { fails += er.length; console.log('✗ ' + S.d + '/' + h + ' @' + vp.join('x')); er.forEach(z => console.log('   ' + z)); }
      await q.close();
    }
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
