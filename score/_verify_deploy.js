/* score/_verify_deploy.js — 量部署步驟網頁 score/deploy.html、score/update.html（2026-10-09 程式更新＋貼名單）（大字、一頁放得下、手指點到對的地方、複製程式真的複製到）。只印失敗項。
 *   node score/_verify_deploy.js */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), { pathToFileURL } = require('url');
const PG = [{ f: 'deploy.html', copy: 3, key: 4 }, { f: 'update.html', copy: 5, key: -1 }], CODE = fs.readFileSync(path.join(__dirname, 'Code.gs'), 'utf8');
const VPS = [[1024, 768], [820, 1180], [1920, 1080], [1366, 768], [390, 844]];
(async () => {
  const br = await chromium.launch(); let fails = 0, n = 0;
  for (const P of PG) for (const vp of VPS) for (const z of [1, 1.3]) {
    const F = pathToFileURL(path.join(__dirname, P.f)).href;
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, permissions: ['clipboard-read', 'clipboard-write'] });
    const p = await ctx.newPage(), e = [], phone = vp[0] < 600;
    p.on('pageerror', x => e.push('JS 例外：' + x.message));
    await p.goto(F); await p.evaluate(z => { localStorage.clear(); zoom(z); K = 0; draw(); }, z); await p.waitForTimeout(300);
    const N = await p.evaluate(() => STEPS.length);
    for (let k = 0; k <= N; k++) {
      await p.evaluate(k => { K = k; draw(); }, k); await p.waitForTimeout(250);
      const r = await p.evaluate(() => {
        const de = document.documentElement, o = [];
        if (de.scrollWidth > innerWidth + 1) o.push('橫向溢出 ' + (de.scrollWidth - innerWidth));
        o.ovY = de.scrollHeight - innerHeight;
        const small = [];
        document.querySelectorAll('main *, nav button').forEach(x => {
          const own = [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim());
          if (!own || !x.getBoundingClientRect().width ) return;
          const fs = parseFloat(getComputedStyle(x).fontSize), min = x.closest('.url,.file,.sec,.tile small,.url2') ? 18 : 24;
          if (fs < min) small.push(x.textContent.trim().slice(0, 12) + ' ' + fs + 'px');
        });
        if (small.length) o.push('字太小：' + small.slice(0, 4).join('、'));
        const h1 = document.querySelector('h1'); if (h1 && parseFloat(getComputedStyle(h1).fontSize) < 32) o.push('標題不到 32px');
        return { o: o, ovY: o.ovY, taps: document.querySelectorAll('#stage [data-tap]').length };
      });
      r.o.forEach(x => e.push('第 ' + (k + 1) + ' 頁 ' + x));
      /* 原本的字（✕1）：iPad、電腦一頁放得下；字放大（✕1.3）或手機：可以往下捲，但〔下一步〕一定黏在最下面看得到 */
      if (!phone && z === 1 && r.ovY > 1) e.push('第 ' + (k + 1) + ' 頁要往下捲 ' + r.ovY + 'px 才看得完');
      const nb = await p.evaluate(() => { const b = document.getElementById('nx').getBoundingClientRect(); return b.bottom <= innerHeight + 1 && b.top >= 0; });
      if (!nb) e.push('第 ' + (k + 1) + ' 頁看不到〔下一步〕');
      /* 手指：每一個 data-tap 都點得到（手指尖在那一格裡面、那一格亮金框） */
      for (let t = 0; t < r.taps; t++) {
        await p.waitForTimeout(t ? 2300 : 900);
        const h = await p.evaluate(() => { const f = document.getElementById('fing').getBoundingClientRect(), x = document.querySelector('#stage .tap');
          if (!x) return 'none'; const b = x.getBoundingClientRect(), cx = f.left + f.width * .35, cy = f.top + 4;
          return cx >= b.left - 6 && cx <= b.right + 6 && cy >= b.top - 6 && cy <= b.bottom + 12 ? 'ok' : 'off ' + x.textContent.trim().slice(0, 10); });
        if (h !== 'ok') { e.push('第 ' + (k + 1) + ' 頁手指第 ' + (t + 1) + ' 下沒有點在要按的地方（' + h + '）'); break; }
      }
      n += 4 + r.taps;
    }
    /* 複製程式 */
    await p.evaluate(k => { K = k; draw(); }, P.copy); await p.waitForTimeout(200); await p.click('#copy'); await p.waitForTimeout(300);
    const clip = await p.evaluate(() => navigator.clipboard.readText());
    if (clip !== CODE) e.push('〔📋 複製程式〕複製到的不是整份 Code.gs（' + clip.length + '／' + CODE.length + ' 字）');
    if (!/複製好了/.test(await p.textContent('#copy'))) e.push('按〔📋 複製程式〕沒有寫「✅ 複製好了」');
    if (P.key >= 0) { await p.evaluate(k => { K = k; draw(); }, P.key); await p.waitForTimeout(200); await p.click('#copyk'); await p.waitForTimeout(300);
      if (await p.evaluate(() => navigator.clipboard.readText()) !== 'TEACHER_PW') e.push('〔📋 複製 TEACHER_PW〕沒有複製到'); }
    else { await p.evaluate(() => { K = STEPS.length; draw(); }); if (!await p.$('main a[href="../teacher/"]')) e.push('完成頁沒有〔打開老師看板〕'); }
    /* 下一步／上一步 */
    await p.evaluate(() => { K = 0; draw(); }); await p.click('#nx'); await p.click('#nx'); await p.click('#pv');
    if (await p.evaluate(() => K) !== 1) e.push('〔下一步〕〔上一步〕不對');
    n += 4;
    if (e.length) { fails += e.length; console.log('✗ ' + P.f + ' @' + vp.join('x') + ' 字 ✕' + z); e.forEach(x => console.log('   ' + x)); }
    await ctx.close();
  }
  await br.close();
  const html = fs.readFileSync(path.join(__dirname, 'deploy.html'), 'utf8');
  console.log((fails ? '✗ ' : '✓ ') + '部署步驟網頁量了 ' + n + ' 項，失敗 ' + fails + ' 項');
  process.exit(fails ? 1 : 0);
})();
