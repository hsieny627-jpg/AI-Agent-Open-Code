/* sentences/_verify_review.js — 量「三年級複習」「四年級複習」兩個網站（2026-10-03）
 *   node sentences/_verify_review.js
 * ① 首頁：三區、每一個連結都連得到、不橫向溢出、字夠大、看不到「精簡版」
 * ② u1／u2／games：交給 sentences/_verify.js（REVIEW_DIR ＝ 這個網站、SITE_DIR ＝ 那一課的資料、GAMES_ONLY ＝ 這裡的三種）
 * 只印失敗項和一行總結。
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/* 2026-10-09：量測絕對不可以送到真的 Google 成績表（使用者指定）➜ 擋掉 Google Apps Script */
const NOGAS = p => p.route(/script\.google(usercontent)?\.com/, r => r.abort());
const fs = require('fs'), path = require('path'), cp = require('child_process'), { pathToFileURL } = require('url');
const ROOT = path.join(__dirname, '..');
const SITES = [{ d: 'g3-review', src: 'G3 - L1 + L2', games: 'g3,g5,g9' }, { d: 'g4-review', src: 'sentences', games: 'g3,g4,g5' }];
(async () => {
  let fails = 0, n = 0;
  const br = await chromium.launch();
  for (const S of SITES) for (const vp of [[1024, 768], [820, 1180]]) {
    const p = await br.newPage({ viewport: { width: vp[0], height: vp[1] } }); await NOGAS(p);
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
      const q = await br.newPage({ viewport: { width: vp[0], height: vp[1] } }), er = []; await NOGAS(q);
      q.on('pageerror', x => er.push('JS 例外：' + x.message)); q.on('requestfailed', x => /script\.google/.test(x.url()) || er.push('載不到：' + x.url().split('/').slice(-2).join('/')));
      await q.goto(pathToFileURL(path.join(ROOT, S.d, h)).href); await q.waitForTimeout(500);
      const x = await q.evaluate(async () => { await document.fonts.ready; const vis = id => { const b = document.getElementById(id); return !!b && b.getBoundingClientRect().width > 0; };
        return { font: document.fonts.check('700 48px Andika'), aud: !!window.ENAUD, fwd: vis('fwd'), wh: vis('whome'), home: vis('home'), homeBig: !!document.getElementById('home') && parseFloat(getComputedStyle(document.getElementById('home')).fontSize) >= 18 && /回首頁/.test(document.getElementById('home').textContent), ox: document.documentElement.scrollWidth - innerWidth }; });
      if (!x.font) er.push('Andika 沒有載到'); if (!x.aud) er.push('英文語音檔沒有載到');
      if (x.fwd || x.wh) er.push('老師網站的按鈕（🌍 環遊世界／🔤 單字首頁）還看得到'); if (x.ox > 0) er.push('橫向溢出 ' + x.ox);
      if (x.home && !x.homeBig) er.push('〔🏠 回首頁〕不夠大（< 18px）或沒寫「回首頁」');
      if (x.home) { await q.click('#home'); await q.waitForTimeout(400); if (path.resolve(decodeURIComponent(new URL(q.url()).pathname)) !== path.join(ROOT, S.d, 'index.html')) er.push('🏠 沒有回到複習首頁（' + q.url() + '）'); }
      else er.push('看不到 🏠 首頁');
      n += 6; if (er.length) { fails += er.length; console.log('✗ ' + S.d + '/' + h + ' @' + vp.join('x')); er.forEach(z => console.log('   ' + z)); }
      await q.close();
    }
    /* 2026-10-16 C 組：闖關路線、一問一答、刪縮寫動畫第 4 頁、〔🏠 回首頁〕金色大按鈕、遊戲頁寫真的幾種 */
    if (!r.links.some(h => /u1\.html#t4/.test(h)) || !r.links.some(h => /u2\.html#t4/.test(h))) e.push('首頁沒有〔💬 一問一答〕');
    for (const f of ['u1.html', 'u2.html', 'games.html']) {
      const q = await br.newPage({ viewport: { width: vp[0], height: vp[1] } }); await NOGAS(q);
      await q.goto(pathToFileURL(path.join(ROOT, S.d, f)).href); await q.waitForTimeout(600);
      const x = await q.evaluate(f => { const o = [], hb = document.querySelector('#bar a.rvhome'), R = hb && hb.getBoundingClientRect();
        if (!hb || !R.width || R.height < 46 || parseFloat(getComputedStyle(hb).fontSize) < 18 || !/回首頁/.test(hb.textContent)) o.push('下面沒有金色大按鈕〔🏠 回首頁〕');
        else if (hb.getAttribute('href') !== 'index.html') o.push('〔🏠 回首頁〕沒有連回複習首頁');
        if (f === 'games.html') { const n = document.querySelectorAll('#grid .gcard,#grid > *').length, h1 = document.querySelector('#hub h1').textContent;
          if (/10 種/.test(h1)) o.push('遊戲大廳標題還寫 10 種'); return o; }
        if (!window.TABM || TABM[TABM.length - 1].lb !== '一問一答') o.push('最後一站不是一問一答');
        const st = document.querySelectorAll('#tabs.route .st').length, want = TABM.reduce((a, t) => a + (t.sub ? t.sub.length : 1), 0);
        if (st !== want) o.push('闖關路線 ' + st + ' 站（應該 ' + want + '）');
        const rh = document.querySelector('#tabs .rh'); if (innerWidth > 900 && (!rh || !rh.getBoundingClientRect().width)) o.push('上面沒有〔🏠 回首頁〕');
        if (location.pathname.indexOf('g4-review/u2') >= 0) { const k = TABM.findIndex(t => t.lb === '縮寫動畫'); setDeck(k, 0); if (CARDS.length !== 3) o.push('四年級 Unit 2 縮寫動畫 ' + CARDS.length + ' 頁（應該 3 頁）'); }
        /* 看到最後一張卡 ➜ 打 ✔、「現在在這裡」還在這一站、下一站寫「下一個」 */
        try { localStorage.clear(); } catch (z) {} TQSEEN = {}; setDeck(0, 0); i = CARDS.length - 1; draw(0);
        const b0 = document.querySelector('#tabs .st[data-t="0"][data-l="0"]');
        if (!b0.classList.contains('done')) o.push('看完 1 基礎最後一張，沒有打 ✔');
        if (!b0.classList.contains('now')) o.push('「現在在這裡」不在 1 基礎');
        if (!document.querySelector('#tabs .st[data-t="0"][data-l="1"]').classList.contains('next')) o.push('「下一個」不是 1 進階');
        document.querySelector('#tabs .st[data-t="0"][data-l="1"]').click();
        if (TCUR !== 0 || LCUR !== 1) o.push('點 1 進階沒有過去');
        setDeck(0, 0); return o; }, f);
      n += 6; if (x.length) { fails += x.length; console.log('✗ ' + S.d + '/' + f + ' @' + vp.join('x')); x.forEach(z => console.log('   ' + z)); }
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
