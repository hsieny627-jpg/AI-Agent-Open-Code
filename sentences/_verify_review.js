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
/* 2026-10-16 C4 第 8 題：遊戲 3 ➜ 6 種；第 7 題：📘 Review 1（r1.html、r1/）、四年級〔💼 職業單字網站 ↗〕 */
const SITES = [{ d: 'g3-review', src: 'G3 - L1 + L2', games: 'g3,g5,g9,g2,g4,g1,g6,g7,g8,g10', adv: 'x3' }, { d: 'g4-review', src: 'sentences', games: 'g3,g4,g5,g2,g9,g1,g6,g7,g8,g10', adv: 'x4', jobs: 1 }];
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
    if (r.sec !== 4) e.push('首頁不是四區（' + r.sec + '）');
    ['r1/index.html', 'r1.html', 'r1/games.html'].forEach(h => { if (r.links.indexOf(h) < 0) e.push('首頁沒有 📘 Review 1 的 ' + h); });
    if (!!S.jobs !== r.links.some(h => /English-Jobs-New/.test(h))) e.push(S.jobs ? '四年級首頁沒有〔💼 職業單字網站 ↗〕' : '三年級首頁不該有職業單字網站');
    if (/精簡/.test(r.txt)) e.push('網站上出現「精簡」');
    if (r.small) e.push(r.small + ' 個按鈕的字小於 16px');
    r.links.forEach(h => { if (/^https?:/.test(h)) return; const q = path.resolve(path.dirname(f), decodeURIComponent(h.split('#')[0])); if (!fs.existsSync(q)) e.push('連不到 ' + h);
      /* 2026-10-07 使用者第 12 點：在家複習的網站獨立，不可以連到老師教學用的頁面 */
      if (path.dirname(q) !== path.join(ROOT, S.d) && path.dirname(q) !== path.join(ROOT, S.d, 'r1')) e.push('連到複習網站外面：' + h); });
    n += 5 + r.links.length;
    /* 補充（複製進來的單字結構、單字故事）：沒有 JS 錯誤、字體和語音檔載得到、🏠 回複習首頁、老師網站的按鈕藏起來 */
    for (const h of r.links.filter(h => !/^(u[12]|games|index|r1|today|stars)\.html|^r1\/|^https?:/.test(h))) {
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
          const gc = document.querySelectorAll('#grid .gcard').length; if (h1.indexOf(gc + ' 種') < 0) o.push('遊戲大廳標題的種數跟遊戲卡片不一樣（' + gc + '）'); return o; }
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
    /* 📘 Review 1（2026-10-16 C4 第 7 題）：句型卡、單字首頁、三張字卡、遊戲 ➜ 沒有 JS 錯誤、載得到、金色〔🏠 回首頁〕回在家複習首頁、來源 🏠 在家、〔🔒〕代號 */
    for (const [f, lk] of [['r1.html', 'r1-s'], ['r1/index.html', 'r1-w'], ['r1/basketball.html', 'r1-w'], ['r1/play-soccer.html', 'r1-w'], ['r1/youtube-videos.html', 'r1-w'], ['r1/games.html', 'r1-g']]) {
      const q = await br.newPage({ viewport: { width: vp[0], height: vp[1] } }), er = []; await NOGAS(q);
      q.on('pageerror', x => er.push('JS 例外：' + x.message)); q.on('requestfailed', x => /script\.google/.test(x.url()) || er.push('載不到：' + x.url().split('/').slice(-3).join('/')));
      await q.goto(pathToFileURL(path.join(ROOT, S.d, f)).href); await q.waitForTimeout(700);
      const x = await q.evaluate(([f, adv]) => { const o = [], card = /^r1\/(?!index|games)/.test(f);
        if (typeof SCSRC === 'undefined' || SCSRC !== 'home') o.push('來源不是 🏠 在家');
        const hb = card ? document.getElementById('home') : document.querySelector('a.rvhome'), R = hb && hb.getBoundingClientRect();
        if (!hb || !R.width || R.height < 44 || !/回首頁/.test(hb.textContent) || getComputedStyle(hb).borderTopColor !== 'rgb(255, 213, 74)') o.push('沒有金色〔🏠 回首頁〕');
        if (card && !window.ENAUD) o.push('英文語音檔沒有載到');
        if (f === 'r1/games.html') { const vis = [...document.querySelectorAll('#grid .gcard')].filter(c => c.getBoundingClientRect().width > 0).map(c => c.getAttribute('data-g'));
          if (vis.length !== 21) o.push('遊戲看得到 ' + vis.length + ' 個（應該 20＋自己年級的進階）'); if (vis.indexOf(adv) < 0) o.push('看不到自己年級的進階 ' + adv);
          if (!/r1audio|review1\/audio\/$/.test(window.AUDDIR || '')) o.push('AUDDIR 不對：' + window.AUDDIR); }
        return { o, lk: window.SCLKPAGE, home: hb && (hb.getAttribute('href') || '') }; }, [f, S.adv]);
      if (x.lk !== lk) er.push('〔🔒〕代號是 ' + x.lk + '（應該 ' + lk + '）'); er.push(...x.o);
      if (/^r1\//.test(f)) { await q.evaluate(s => document.querySelector(s).click(), /games/.test(f) || /index/.test(f) ? 'a.rvhome' : '#home');   /* 遊戲頁一打開有登入畫面蓋著，用程式點 */ await q.waitForTimeout(400);
        if (path.resolve(decodeURIComponent(new URL(q.url()).pathname)) !== path.join(ROOT, S.d, 'index.html')) er.push('🏠 沒有回在家複習首頁'); }
      else if (x.home !== 'index.html') er.push('〔🏠 回首頁〕沒有連回複習首頁');
      n += 8; if (er.length) { fails += er.length; console.log('✗ ' + S.d + '/' + f + ' @' + vp.join('x')); er.forEach(z => console.log('   ' + z)); }
      await q.close();
    }
    if (vp[0] === 1024) { /* r1/ 每一個檔：連結、圖、字體、語音檔都找得到；不連到在家複習以外的網頁 */
      const D = path.join(ROOT, S.d, 'r1'), fl = fs.readdirSync(D).filter(f => /\.html$/.test(f));
      if (fl.length !== fs.readdirSync(path.join(ROOT, 'review1')).filter(f => /\.html$/.test(f)).length) e.push('r1/ 的檔案數跟 review1/ 不一樣');
      fl.forEach(f => { const h = fs.readFileSync(path.join(D, f), 'utf8'); n++;
        (h.match(/(?<![.\w])(?:src|href)="(?!https?:|#|data:)[^"]+"|url\((?![#'"]|data:)[^)]+\)|[A-Z]+DIR="[^"]+"/g) || []).forEach(m => {
          const u = m.replace(/^[^"(]*["(]|[")]$/g, '').replace(/[?#].*$/, ''); if (!u || /['+]/.test(u)) return;
          const a = path.resolve(D, decodeURIComponent(u));
          if (!fs.existsSync(a)) e.push('r1/' + f + ' 找不到 ' + u);
          else if (/\.html$/.test(a) && path.dirname(a) !== D && a !== path.join(ROOT, S.d, 'index.html')) e.push('r1/' + f + ' 連到在家複習外面：' + u); }); });
    }
    if (e.length) { fails += e.length; console.log('✗ ' + S.d + '/index.html @' + vp.join('x')); e.forEach(x => console.log('   ' + x)); }
    await p.close();
  }
  await br.close();
  let sub = 0;
  for (const S of process.env.HOME_ONLY ? [] : SITES) {   /* HOME_ONLY=1 ＝ 只量首頁、補充、📘 Review 1（句型頁、遊戲頁沒改的時候） */
    try { cp.execFileSync('node', [path.join(__dirname, '_verify.js')], { stdio: 'inherit', env: Object.assign({}, process.env,
      { SITE_DIR: S.src === 'sentences' ? '' : path.join(ROOT, S.src), REVIEW_DIR: path.join(ROOT, S.d), GAMES_ONLY: S.games }) }); }
    catch (x) { sub++; }
  }
  console.log((fails || sub ? '✗ ' : '✓ ') + '複習網站首頁量了 ' + n + ' 項，失敗 ' + fails + ' 項；句型頁／遊戲頁 ' + (sub ? sub + ' 個網站有失敗（見上面）' : '全部通過'));
  process.exit(fails || sub ? 1 : 0);
})();
