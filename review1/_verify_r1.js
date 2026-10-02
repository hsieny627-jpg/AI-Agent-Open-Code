/* review1/_verify_r1.js — review1/games.html 自己的檢查（sentences/_verify.js 的遊戲頁量完以後呼叫）
 * 大廳分五區；每一種玩法的題目、選項都有圖示（看圖選英文的選項不可以有圖示，看英文選圖的選項 ＝ 圖示＋中文）；
 * 填空的句點緊接空格；記憶配對翻開圖卡看得到圖示和中文、配對得起來；語序兩個 to 先點哪一個都算對；
 * 太長的整句選項一列一個、不折行；每一個會唸的句子都有語音檔；答錯頁每一個英文字下面都有中文（to／the／an 例外）。
 * 只回傳量了幾項，失敗的寫進 e。 */
module.exports = async function (p, e, snap, missCheck, quitG) {
  let acts = 0;
  const sec = await p.evaluate(() => document.querySelectorAll('#grid .gsec').length);
  acts++; if (sec !== 5) e.push('大廳不是分成五區（' + sec + '）');
  const bar = await p.evaluate(() => { const b = document.getElementById('bar'), r = [...b.children].map(x => x.getBoundingClientRect());
    return { rows: new Set(r.map(x => Math.round(x.top / 6))).size, out: r.some(x => x.left < 0 || x.right > innerWidth) }; });
  acts++; if (bar.rows !== 1 || bar.out) e.push('下面的按鈕列不是一排或超出畫面');

  /* 每一個遊戲：挑幾題直接畫出來量 */
  const res = await p.evaluate(async () => {
    const out = [], wait = ms => new Promise(r => setTimeout(r, ms));
    const ovf = () => [...document.querySelectorAll('#arena .o,#arena .dbtn')].filter(b => b.getBoundingClientRect().width &&
      (b.scrollWidth > b.clientWidth + 1 || parseFloat(getComputedStyle(b).fontSize) < 14)).map(b => b.textContent.trim().slice(0, 30));
    const st = document.getElementById('stage');
    for (const m of META) {
      begin(m.id); await wait(60);
      const B = BANK[m.id], L = m.id + ' ' + m.name;
      const pickQ = f => B.filter(f).slice(0, 3);
      const draw = (c, fn) => { cur = c; fn(); fitO(); };
      if (g === 'g1') {
        for (const c of pickQ(x => x.ni)) { draw(c, rMcq);
          if (!document.querySelector('#arena .qh .qic')) out.push(L + '：看圖選英文的題目沒有圖示');
          if (document.querySelector('#arena .o .oi')) out.push(L + '：看圖選英文的選項有圖示（一看就知道答案）'); }
        for (const c of pickQ(x => x.pic)) { draw(c, rMcq);
          const os = [...document.querySelectorAll('#arena .o')];
          if (os.some(o => !o.querySelector('.opic .oi') || !(o.querySelector('.oi').innerHTML.trim()) || !(o.querySelector('.oz').textContent.trim())))
            out.push(L + '：看英文選圖的選項沒有圖示＋中文');
          /* 選項不可以寫出英文答案（圖示裡畫的字、中文裡的品牌名 YouTube／Switch 不算） */
          if (os.some(o => o.querySelector('.oz').textContent.toLowerCase().indexOf(o.getAttribute('data-t').toLowerCase()) >= 0))
            out.push(L + '：看英文選圖的選項寫了英文答案'); }
      }
      if (g === 'g5') for (const c of pickQ(() => 1)) { draw(c, rHear);
        if ([...document.querySelectorAll('#arena .o')].some(o => !o.querySelector('.oi'))) out.push(L + '：聽力的選項沒有圖示'); }
      if (g === 'g8') for (const c of pickQ(() => 1)) { draw(c, rFill);
        if (!document.querySelector('#arena .qzh .qic')) out.push(L + '：填空的題目沒有圖示');
        if (document.querySelector('#arena .o .oi')) out.push(L + '：填空的選項有圖示（一看就知道答案）');
        const t = document.querySelector('#arena .qbig').textContent;
        if (c.a === '.' && !/＿＿\.$/.test(t.trim())) out.push(L + '：句點沒有緊接空格（' + t + '）'); }
      if (g === 'g9') for (const c of pickQ(() => 1)) { draw(c, rSort);
        if (!document.querySelector('#arena .qbig .oi')) out.push(L + '：分類的字沒有圖示'); }
      if (g === 'g3') {
        for (const c of pickQ(() => 1).concat([B.slice().sort((x, y) => y.s.length - x.s.length)[0]])) { draw(c, rOrder);
          if (!document.querySelector('#arena .qzh .qic')) out.push(L + '：語序的題目沒有圖示');
          if (st.scrollHeight - st.clientHeight > 2) out.push(L + '：語序要往下捲才看得到全部（' + c.s.join(' ') + '）'); }
        /* 兩個 to：每一次都點「最後一個」一樣的字，也要算對 */
        const two = B.filter(c => c.s.filter(w => w === 'to').length > 1)[0];
        if (two) { draw(two, rOrder); busy = false; window.LASTOK = null;
          for (let k = 0; k < two.s.length; k++) { const bs = [...document.querySelectorAll('#pool .cw:not(.used)')].filter(b => b.textContent === two.s[k]);
            bs[bs.length - 1].click(); if (window.LASTOK === false) break; }
          if (window.LASTOK !== true) out.push(L + '：兩個 to 先點後面那一個被判錯（' + two.s.join(' ') + '）');
          await wait(50); ['gain', 'pick', 'evt'].forEach(id => document.getElementById(id).classList.remove('on')); busy = false; }
      }
      if (g === 'g6') { memLeft = 0; rMem(); const bd = document.getElementById('bd');
        const pic = bd.querySelector('.mc[data-en="0"]'), k = pic.getAttribute('data-k');
        pic.click(); await wait(30);
        if (!pic.querySelector('.oi') || !pic.querySelector('.oz').textContent.trim()) out.push(L + '：記憶配對的圖卡沒有圖示＋中文');
        if (!pic.getAttribute('data-z')) out.push(L + '：記憶配對的圖卡沒有中文可以唸');
        bd.querySelector('.mc[data-en="1"][data-k="' + k + '"]').click(); await wait(30);
        if (memLeft !== 3) out.push(L + '：圖配英文配對不起來');
        ['gain', 'pick', 'evt'].forEach(id => document.getElementById(id).classList.remove('on')); busy = false; }
      if (g === 'g10') for (const c of B.filter((x, n) => n % 31 === 0).concat([B.slice().sort((x, y) => y.o.join('').length - x.o.join('').length)[0]])) { draw(c, rBoss);
        if (st.scrollHeight - st.clientHeight > 2) out.push(L + '：魔王題要往下捲才看得到全部（' + c.o[0] + '）');
        if (!document.querySelector('#arena .qh .qic')) out.push(L + '：魔王題沒有圖示');
        const long = c.o.some(x => x.length > 24);
        if (long && !document.querySelector('#arena .opts.one')) out.push(L + '：太長的選項沒有一列一個'); }
      const ov = ovf(); if (ov.length) out.push(L + '：選項折行或超出：' + ov.slice(0, 2).join('／'));
      if (g !== 'g6' && st.scrollHeight - st.clientHeight > 2) out.push(L + '：要往下捲才看得到全部（多 ' + (st.scrollHeight - st.clientHeight) + 'px）');
      if (document.documentElement.scrollWidth > document.documentElement.clientWidth) out.push(L + '：橫向溢出');
      hub(); await wait(30);
    }
    return out;
  });
  acts += 8 * 22; res.forEach(x => e.push(x));

  /* 語音檔：每一題會唸的正確答案、聽力的句子、語序的每一個字 */
  const aud = await p.evaluate(() => {
    const miss = [], has = t => !!AUD[akey(t)];
    const chk = t => { if (t && /[A-Za-z]/.test(t) && !has(t)) miss.push(t); };
    for (const id in BANK) BANK[id].forEach(c => {
      if (Array.isArray(c)) { chk(c[0]); if (c[3]) chk(c[3]); return; }
      if (c.o) chk(c.o[0]); if (typeof c.s === 'string') chk(c.s);
      if (Array.isArray(c.s)) { c.s.forEach(chk); chk(joinS(c.s.slice(0, -1)) + c.s[c.s.length - 1]); }
      if (c.b) chk(c.b + ' ' + c.o[0] + (/^[.?!,]/.test(c.a) ? '' : ' ') + c.a);
    });
    return [...new Set(miss)];
  });
  acts++; if (aud.length) e.push('沒有語音檔（' + aud.length + ' 句）：' + aud.slice(0, 4).join('／'));

  /* 答錯頁的逐字中文：正確答案的每一個英文字下面都有中文（to、the、an 這類照字卡空白）＋整句翻譯 */
  const gl = await p.evaluate(() => {
    const out = [], blank = new Set(['to', 'the', 'an']);
    R1PHR.forEach(p => p[0].forEach((w, k) => { if (!p[1][k]) blank.add(w); }));
    const ans = c => Array.isArray(c) ? c[3] : (c.b ? c.b + ' ' + c.o[0] + (/^[.?!,]/.test(c.a) ? '' : ' ') + c.a :
      (Array.isArray(c.s) ? joinS(c.s.slice(0, -1)) + c.s[c.s.length - 1] : c.o[0]));
    for (const id in BANK) BANK[id].forEach(c => {
      if (!Array.isArray(c) && !c.o && !c.s) return;
      if (Array.isArray(c) && !c[3]) return;              /* 記憶配對沒有答錯頁 */
      const a = ans(c), d = document.createElement('div'); d.innerHTML = mGloss(a, null);
      const bad = [...d.querySelectorAll('.gw:not(.gp)')].filter(x => !x.querySelector('i').textContent.trim() &&
        !blank.has(gKey(x.querySelector('b').textContent))).map(x => x.querySelector('b').textContent);
      if (bad.length) out.push(a + '（' + bad.join('、') + '）');
      if (/ /.test(a) && !mTr(a)) out.push(a + '（沒有整句翻譯）');
    });
    return [...new Set(out)];
  });
  acts++; if (gl.length) e.push('答錯頁有英文字下面沒有中文（' + gl.length + '）：' + gl.slice(0, 4).join('／'));
  return acts;
};
