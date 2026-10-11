/* sentences/_verify_pick.js —〔🔤 選單字〕獨立頁的量測（2026-10-11 B 組），sentences/_verify.js 的 Review 1 頁會呼叫
 * 每一張 pick 卡：句型卡下面只有一顆大按鈕（≧ 56px 高、沒有小替換字）；打開獨立頁 ➜ 每一組、每一頁都按：
 * 不用捲動、方塊都在畫面裡、英文 ≧ 22px、圖示不壓到英文、字數對；每一頁點第一個和最後一個字：
 * 大字整句換成那個字、整句中文換、整句一行放得下、有語音檔；他／她、and／but 換得過去；〔✅ 用這個字〕回到句型卡而且句子真的換了；✕、Esc 關得掉。
 * 只回傳失敗項。 */
module.exports = async function pickCheck(p, e) {
  const idx = await p.evaluate(() => CARDS.map((c, n) => c.pick ? n : -1).filter(n => n >= 0));
  let acts = 0;
  for (const n of idx) {
    const w0 = '第' + (n + 1) + '張選單字：';
    await p.evaluate(n => { stopPlay(); sayStop(); i = n; draw(0); }, n); await p.waitForTimeout(250);
    const bar = await p.evaluate(() => { const b = document.querySelector('#card .pkGo'); if (!b) return null; const r = b.getBoundingClientRect();
      return { h: r.height, f: parseFloat(getComputedStyle(b).fontSize), subs: document.querySelectorAll('#card .sub').length, in: r.bottom <= innerHeight && r.top >= 0 }; });
    acts++;
    if (!bar) { e.push(w0 + '句型卡下面沒有〔🔤 選單字〕'); continue; }
    if (bar.h < 56 || bar.f < 20) e.push(w0 + '〔🔤 選單字〕太小（' + Math.round(bar.h) + 'px、字 ' + bar.f + 'px）');
    if (bar.subs) e.push(w0 + '句型卡下面還有 ' + bar.subs + ' 顆小替換字');
    if (!bar.in) e.push(w0 + '〔🔤 選單字〕不在畫面裡');
    await p.click('#card .pkGo'); await p.waitForTimeout(300);
    const G = await p.evaluate(() => PK ? PK.G.map(g => g.pages.map(pg => pg.w.length)) : null);
    if (!G) { e.push(w0 + '按了打不開'); continue; }
    for (let g = 0; g < G.length; g++) {
      if (G.length > 1) { await p.click('#pkG [data-pg="' + g + '"]'); await p.waitForTimeout(150); }
      for (let q = 0; q < G[g].length; q++) {
        await p.click('#pkP [data-pp="' + q + '"]'); await p.waitForTimeout(200);
        const w = w0 + '第 ' + (g + 1) + ' 組第 ' + (q + 1) + ' 頁：';
        const r = await p.evaluate(() => {
          const o = document.getElementById('pk'), W = document.getElementById('pkW').getBoundingClientRect(), out = [];
          if (o.scrollHeight > o.clientHeight + 1 || document.documentElement.scrollHeight > innerHeight + 1) out.push('要捲動');
          const T = [...document.querySelectorAll('.pkTile')];
          T.forEach(t => { const r = t.getBoundingClientRect(), en = t.querySelector('.pkEn'), ic = t.querySelector('.pkIc'), f = parseFloat(getComputedStyle(en).fontSize);
            const nm = en.textContent;
            if (r.left < W.left - 1 || r.right > W.right + 1 || r.top < W.top - 1 || r.bottom > W.bottom + 1 || r.bottom > innerHeight) out.push(nm + ' 跑出畫面');
            if (f < 22) out.push(nm + ' 英文太小（' + Math.round(f) + 'px）');
            if (en.scrollWidth > en.clientWidth + 1) out.push(nm + ' 英文超出方塊');
            const a = ic.getBoundingClientRect(), b = en.getBoundingClientRect();
            if (a.bottom > b.top + 2) out.push(nm + ' 圖示壓到英文');
            if (b.top < r.top || b.bottom > r.bottom + 1) out.push(nm + ' 英文被方塊切掉'); });
          [...document.querySelectorAll('#pk .pkRow button,.pkX,.pkUse')].forEach(b => { if (b.getBoundingClientRect().height < 47.5) out.push('按鈕「' + b.textContent + '」太矮'); });
          return { n: T.length, out };
        });
        acts++;
        if (r.n !== G[g][q]) e.push(w + '方塊 ' + r.n + ' 個（要 ' + G[g][q] + ' 個）');
        r.out.forEach(x => e.push(w + x));
        for (const t of [0, G[g][q] - 1]) {
          const word = await p.evaluate(t => { const b = document.querySelectorAll('.pkTile')[t]; b.click(); return PK.sel; }, t);
          await p.waitForTimeout(150);
          const s = await p.evaluate(() => { const L = [...document.querySelectorAll('#pkLine .tk')].map(t => ({ en: t.getAttribute('data-w'), tight: t.classList.contains('tight') }));
            const txt = plain(L), S = document.querySelector('.pkS'), line = document.getElementById('pkLine'), full = document.getElementById('pkFull');
            return { txt, zh: full.textContent, over: line.scrollWidth > S.clientWidth + 1 || full.scrollWidth > S.clientWidth + 1,
              f: parseFloat(getComputedStyle(line).fontSize), aud: !window.AUD || !!AUD[akey(txt)], on: (document.querySelector('.pkTile.on') || {}).textContent || '' }; });
          acts++;
          if (s.txt.indexOf(word.w) < 0) e.push(w + '點了「' + word.w + '」大字整句沒有換（' + s.txt + '）');
          if (s.zh.indexOf(word.z) < 0 && /[一-鿿]/.test(word.z)) e.push(w + '點了「' + word.w + '」整句中文沒有換成「' + word.z + '」');
          if (s.over) e.push(w + '「' + s.txt + '」一行放不下');
          if (s.f < 28) e.push(w + '「' + s.txt + '」大字整句太小（' + Math.round(s.f) + 'px）');
          if (!s.aud) e.push(w + '「' + s.txt + '」沒有語音檔');
          if (s.on.indexOf(word.w) < 0) e.push(w + '點了「' + word.w + '」那一格沒有亮');
        }
      }
    }
    /* 他／她、and／but */
    const side = await p.evaluate(() => [...document.querySelectorAll('#pkG [data-sk]')].map(b => [b.getAttribute('data-sk'), +b.getAttribute('data-sn'), SUB[b.getAttribute('data-sk')].basic[+b.getAttribute('data-sn')][0]]));
    for (const [k, sn, sw] of side) {
      await p.click('#pkG [data-sk="' + k + '"][data-sn="' + sn + '"]'); await p.waitForTimeout(150);
      const t = await p.evaluate(() => [...document.querySelectorAll('#pkLine .tk')].map(t => t.getAttribute('data-w')));
      acts++;
      if (t.indexOf(sw) < 0) e.push(w0 + '按了「' + sw + '」大字整句沒有換（' + t.join(' ') + '）');
    }
    /* ✅ 用這個字 ➜ 回到句型卡、句子真的換了 */
    const want = await p.evaluate(() => { const b = document.querySelectorAll('.pkTile')[0]; b.click(); return [...document.querySelectorAll('#pkLine .tk')].map(t => t.getAttribute('data-w')).join(' '); });
    await p.waitForTimeout(150); await p.click('.pkUse'); await p.waitForTimeout(500);
    const back = await p.evaluate(() => ({ open: !!PK || !document.getElementById('pk').hidden, now: [...document.querySelectorAll('#cardIn .line .tk')].map(t => t.getAttribute('data-w')).join(' '), i }));
    acts++;
    if (back.open) e.push(w0 + '按〔✅ 用這個字〕沒有回到句型卡');
    if (back.now !== want) e.push(w0 + '回到句型卡，句子不是剛剛選的（' + back.now + ' ≠ ' + want + '）');
    if (back.i !== n) e.push(w0 + '回到句型卡跑到別張');
    /* ✕、Esc */
    await p.click('#card .pkGo'); await p.waitForTimeout(200); await p.click('.pkX'); await p.waitForTimeout(150);
    if (await p.evaluate(() => !document.getElementById('pk').hidden)) e.push(w0 + '按 ✕ 關不掉');
    await p.click('#card .pkGo'); await p.waitForTimeout(200); await p.keyboard.press('Escape'); await p.waitForTimeout(150);
    if (await p.evaluate(n => !document.getElementById('pk').hidden || i !== n, n)) e.push(w0 + '按 Esc 關不掉');
    acts += 2;
  }
  return acts;
};
