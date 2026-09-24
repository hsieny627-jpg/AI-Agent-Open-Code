/* sentences/_verify.js — 句型網站的量測腳本（不目視、不截圖）
 *
 * 用法： node sentences/_verify.js            量全部五頁
 *        node sentences/_verify.js unit1.html 只量一頁（改一張卡時用這個，省時間）
 *
 * 兩種尺寸（1024×768 橫、820×1180 直）、offline:true 開檔。
 * 只印失敗項與一行總結。
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
/* 別的課次（例：「G3 - L1 + L2」）共用這一支：SITE_DIR ＝ 那個資料夾，它自己的 _verify.js 會設好 */
const SITE_DIR = process.env.SITE_DIR ? path.resolve(process.env.SITE_DIR) : '';
const DIR = (SITE_DIR || __dirname) + '/';
/* 這個課次自己的資料：不發音字母（SIL）、驚喜卡（SURP）、題目要不要每次重洗（CFG.random） */
const SD = SITE_DIR ? require(DIR + '_data.js') : {};
const SG = SITE_DIR ? require(DIR + '_game_data.js') : {};
const SQ = SITE_DIR ? require(DIR + '_quiz_data.js') : {};
const args = process.argv.slice(2);
const ALL = ['index.html', 'warmup.html', 'unit1.html', 'unit2.html', 'games.html'];
const FILES = args.length ? args : ALL;
const VPS = [{ n: '1024x768', width: 1024, height: 768 }, { n: '820x1180', width: 820, height: 1180 }];

const OV = () => {
  const de = document.documentElement;
  return { ox: de.scrollWidth - de.clientWidth, oy: de.scrollHeight - de.clientHeight };
};
const fontOk = p => p.evaluate(async () => {
  await document.fonts.ready;
  return document.fonts.check('700 48px Andika') && document.fonts.check('400 48px Andika');
});

/* 站內連結都要真的存在 */
async function links(p, e) {
  const hs = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
  for (const h of hs) {
    if (!h || /^(https?:|mailto:|#)/.test(h)) continue;
    const fp = path.resolve(DIR, h.split('#')[0].split('?')[0]);
    if (!fs.existsSync(fp)) e.push('連結指到不存在的檔案：' + h);
  }
}

/* 🗣 語速六段：0.5 0.6 0.7 0.8 0.9 1.0，按下去 RATE 真的跟著變（使用者 2026-09-21 指定）
   音效和音效按鈕已依使用者指定暫時刪除，所以這裡不再量 MUTE。 */
async function rateBar(p, e) {
  const n = await p.$$eval('#rateGrp button', a => a.map(b => b.textContent.trim()));
  if (n.join(',') !== '0.5,0.6,0.7,0.8,0.9,1.0') e.push('語速不是六段（' + n.join(',') + '）');
  if (await p.$('#muteBtn')) e.push('音效按鈕還在（使用者指定暫時刪除）');
  if (await p.$('#slowBtn')) e.push('🐢 放慢按鈕還在（已改成語速六段）');
  await p.click('#rateGrp button[data-r="0.5"]'); await p.waitForTimeout(220);
  if (Math.abs((await p.evaluate(() => RATE)) - 0.5) > 0.001) e.push('按了語速 0.5，RATE 沒有跟著變');
  const on = await p.$$eval('#rateGrp button.on', a => a.map(b => b.textContent.trim()));
  if (on.join(',') !== '0.5') e.push('語速 0.5 沒有亮起來（' + on.join(',') + '）');
  await p.click('#rateGrp button[data-r="1"]'); await p.waitForTimeout(220);
  if ((await p.evaluate(() => RATE)) !== 1) e.push('語速切不回 1.0');
  return 3;
}

/* 答錯的獨立頁（使用者 2026-09-24 指定）：要出現、要有正確答案、
   1.5 秒時還在（不可以不到 3 秒就消失）、4.5 秒內自己消失 */
async function missCheck(p, e, who) {
  const on = () => p.evaluate(() => { const m = document.getElementById('miss'); return !!(m && m.classList.contains('on')) });
  let seen = false;
  for (let k = 0; k < 12 && !seen; k++) { if (await on()) seen = true; else await p.waitForTimeout(100); }
  if (!seen) { e.push(who + '答錯了，沒有出現「答錯的獨立頁」'); return 1; }
  const c = await p.evaluate(() => ({
    ans: ((document.querySelector('#miss .mrow.a .mv') || {}).textContent || '').trim(),
    cd: ((document.getElementById('mcdn') || {}).textContent || '').trim(),
    ox: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }));
  if (!c.ans) e.push(who + '答錯的獨立頁沒有正確答案');
  if (c.cd !== '3') e.push(who + '答錯的獨立頁不是從 3 開始倒數（' + c.cd + '）');
  if (c.ox > 0) e.push(who + '答錯的獨立頁橫向溢出 ' + c.ox);
  await p.waitForTimeout(1500);
  if (!await on()) e.push(who + '答錯的獨立頁不到 3 秒就消失了');
  await p.waitForTimeout(2600);
  if (await on()) e.push(who + '答錯的獨立頁 3 秒後沒有消失');
  return 1;
}

/* 往後翻一張；已經是最後一張就回報 false（停用的按鈕點下去 Playwright 會卡 30 秒） */
async function fwd(p) {
  if (await p.$eval('#next', b => b.disabled)) return false;
  await p.click('#next'); await p.waitForTimeout(420); return true;
}

/* 一路按回第一張（#prev 停用時就不要再按，否則 Playwright 會卡住 30 秒） */
async function rewind(p, N) {
  for (let i = 0; i < N + 1; i++) {
    if (await p.$eval('#prev', b => b.disabled)) break;
    await p.click('#prev'); await p.waitForTimeout(140);
  }
  await p.waitForTimeout(320);
}

/* ---------- 字卡頁 ---------- */
async function cardsPage(p, f, vp, e) {
  const snap = () => p.evaluate(OVS => {
    const ov = eval('(' + OVS + ')')();
    const card = document.getElementById('card'), inn = document.getElementById('cardIn');
    const cr = card.getBoundingClientRect(), ir = inn ? inn.getBoundingClientRect() : null;
    const navs = [].slice.call(document.querySelectorAll('.nav')).map(n => n.getBoundingClientRect());
    let hit = null;
    if (inn) for (const el of inn.querySelectorAll('*')) {
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      for (const n of navs) if (r.left < n.right - 2 && r.right > n.left + 2 && r.top < n.bottom && r.bottom > n.top)
        hit = (el.className || el.tagName) + ' 壓到翻頁箭頭';
    }
    return {
      ox: ov.ox, oy: ov.oy, hit,
      spill: ir ? Math.max(0, Math.round(cr.top - ir.top)) + Math.max(0, Math.round(ir.bottom - cr.bottom))
                + Math.max(0, Math.round(cr.left - ir.left)) + Math.max(0, Math.round(ir.right - cr.right)) : 0,
      on: [].slice.call(document.querySelectorAll('#dots i')).findIndex(x => x.className === 'on'),
      n: document.querySelectorAll('#dots i').length,
      pd: document.getElementById('prev').disabled, nd: document.getElementById('next').disabled,
      tk: document.querySelectorAll('#cardIn .tk').length,
      hidden: document.querySelectorAll('#cardIn .tk.hide').length,
      red: !!document.querySelector('#cardIn .ap'),
      swap: !!document.getElementById('swapGo'),
      sub: document.querySelectorAll('#card .sub').length,
      subTop: (function(){var b=document.querySelector('#card .subs');
        return b?Math.round(b.getBoundingClientRect().top):0})(),
      lineBot: (function(){var l=document.querySelector('#cardIn .line');
        return l?Math.round(l.getBoundingClientRect().bottom):0})(),
      fullEn: (function(){var f=document.querySelector('#cardIn .full');
        return f?(f.getAttribute('data-en')||''):''})(),
      apos: (function(){var a=[].slice.call(document.querySelectorAll('#cardIn .tk'))
        .filter(function(t){var e=t.querySelector('.en');return e&&/^[\u2019'](s|m|re)$/.test(e.textContent)});
        return a.map(function(t){return t.getAttribute('data-say')}).join('|')})(),
      scene: (function () {
        const sc = document.querySelector('#cardIn .scene');
        if (!sc) return 0;
        return (sc.offsetParent !== null || sc.getClientRects().length) ? 2 : 1;
      })(),
      k: parseFloat(card.getAttribute('data-k') || '1'),
      en: document.querySelectorAll('#cardIn [data-en]').length,
      zhLbl: (document.getElementById('zhBtn') || {}).textContent || '',
      zhOn: !!(document.getElementById('zhBtn') || {}).classList &&
            document.getElementById('zhBtn').classList.contains('on'),
      txt: (document.getElementById('cardIn') || {}).innerText || ''
    };
  }, OV.toString());

  const first = await snap(); const N = first.n; let acts = 0, anyRed = false;
  if (N < 5) e.push('卡片數只有 ' + N);
  for (let i = 0; i < N; i++) {
    if (i) { await p.click('#next'); await p.waitForTimeout(520); }
    const s = await snap(); acts++;
    if (s.on !== i) e.push('第' + (i + 1) + '張進度點錯');
    if (s.ox > 0) e.push('第' + (i + 1) + '張橫向溢出 ' + s.ox);
    if (s.oy > 0) e.push('第' + (i + 1) + '張縱向溢出 ' + s.oy);
    if (s.spill > 2) e.push('第' + (i + 1) + '張內容超出卡片 ' + s.spill + 'px');
    if (s.hit) e.push('第' + (i + 1) + '張 ' + s.hit);
    if (i === 0 && (!s.pd || s.nd)) e.push('第1張箭頭狀態錯');
    if (i === N - 1 && (!s.nd || s.pd)) e.push('最後一張箭頭狀態錯');
    if (s.red) anyRed = true;
    if (s.txt.indexOf('\u2019') >= 0 && !s.red) e.push('第' + (i + 1) + '張的撇號 ’ 沒有上紅色');
    if (s.scene === 0) e.push('第' + (i + 1) + '張沒有情境');
    if (s.scene === 2) e.push('第' + (i + 1) + '張情境沒關起來就跑出來了');
  }
  if (!anyRed) e.push('整本找不到紅色的撇號 ’');
  /* 🎞 情境：打開以後每一張都要看得見、不溢出、而且不可以縮到最後一排看不清楚 */
  await rewind(p, N);
  await p.click('#scBtn'); await p.waitForTimeout(320);
  for (let i = 0; i < N; i++) {
    if (i && !await fwd(p)) break;
    const s = await snap(); acts++;
    if (s.scene !== 2) e.push('情境開著，第' + (i + 1) + '張沒有出現情境');
    if (s.ox > 0) e.push('情境開著，第' + (i + 1) + '張橫向溢出 ' + s.ox);
    if (s.oy > 0) e.push('情境開著，第' + (i + 1) + '張縱向溢出 ' + s.oy);
    if (s.spill > 2) e.push('情境開著，第' + (i + 1) + '張內容超出卡片 ' + s.spill + 'px');
    if (s.hit) e.push('情境開著，第' + (i + 1) + '張 ' + s.hit);
    if (s.k < 0.62) e.push('情境開著，第' + (i + 1) + '張被縮到 ' + s.k + '（最後一排會看不清楚）');
  }
  await p.click('#scBtn'); await p.waitForTimeout(320);
  if ((await snap()).scene === 2) e.push('情境按第二次沒有關掉'); acts++;
  await rewind(p, N);

  /* 秒懂動畫：跳出來的東西一定要「跳完」，不可以卡在半透明或整個沒出現 */
  {
    const faded = () => p.evaluate(() => {
      const sel = '#cardIn .frow,#cardIn .bub,#cardIn .scene .sact,#cardIn .scene .sbub,#cardIn .scene .suse,#cardIn .chip.ce';
      return [].slice.call(document.querySelectorAll(sel))
        .filter(x => parseFloat(getComputedStyle(x).opacity) < 0.9)
        .map(x => (x.className || x.tagName) + '@' + getComputedStyle(x).opacity);
    });
    await p.click('#scBtn'); await p.waitForTimeout(320);   /* 情境打開，連情境畫面一起量 */
    for (let i = 0; i < N; i++) {
      if (i && !await fwd(p)) break;
      await p.waitForTimeout(3100);                          /* 等動畫跑完（情境小劇場 2.8 秒演完） */
      const bad = await faded(); acts++;
      if (bad.length) e.push('第' + (i + 1) + '張的動畫沒有跑完，東西還是看不見：' + bad.join('、'));
    }
    await p.click('#scBtn'); await p.waitForTimeout(260);
    await rewind(p, N);
  }

  /* 🔤 點中文唸：中文 ↔ 英文 */
  {
    const a = await snap();
    if (a.zhOn) e.push('「點中文唸」一開始就不是中文');
    await p.click('#zhBtn'); await p.waitForTimeout(220);
    const b = await snap(); acts++;
    if (!b.zhOn || b.zhLbl.indexOf('英文') < 0) e.push('按了「點中文唸」沒有切到英文（' + b.zhLbl + '）');
    await p.click('#zhBtn'); await p.waitForTimeout(220);
    const c2 = await snap(); acts++;
    if (c2.zhOn || c2.zhLbl.indexOf('中文') < 0) e.push('「點中文唸」切不回中文（' + c2.zhLbl + '）');
  }

  /* 中文那一行要真的帶著對應的英文，不然切到「唸英文」會沒聲音 */
  {
    let noEn = [];
    await rewind(p, N);
    for (let i = 0; i < N; i++) {
      if (i && !await fwd(p)) break;
      const s = await snap();
      const hasZh = await p.$$eval('#cardIn [data-zh]', a => a.length);
      if (hasZh > 0 && s.en === 0) noEn.push(i + 1);
    }
    acts++;
    if (noEn.length) e.push('第 ' + noEn.join('、') + ' 張的中文沒有帶對應的英文');
    await rewind(p, N);
  }

  /* 停 6 秒不可自動換頁 */
  const b4 = (await snap()).on; await p.waitForTimeout(6000);
  if ((await snap()).on !== b4) e.push('停 6 秒自動換頁'); acts++;

  /* 回到第一張句型卡 */
  await rewind(p, N);
  /* 找一張有 token 的卡 */
  let guard = 0;
  while ((await snap()).tk === 0 && guard++ < N) { if (!await fwd(p)) break; }

  /* 逐字動畫：一開始要藏起來，點一下出現一個 */
  let s = await snap(); acts++;
  if (s.tk && s.hidden !== s.tk) e.push('逐字模式一開始沒有把字藏起來（' + s.hidden + '/' + s.tk + '）');
  await p.click('#card'); await p.waitForTimeout(420);
  const s2 = await snap(); acts++;
  if (s2.hidden !== s.tk - 1) e.push('點一下卡片沒有剛好出現一個字（剩 ' + s2.hidden + '）');

  /* 整句模式：字不可以是藏的 */
  await p.click('#revGrp button[data-r="whole"]'); await p.waitForTimeout(400);
  const s3 = await snap(); acts++;
  if (s3.hidden > 0) e.push('整句模式還有字是藏起來的');

  /* 四個 Y/N 開關：英文／中文／圖示／整句中文 各自獨立，按下去真的有效 */
  const vis = () => p.evaluate(() => {
    const on = sel => [].slice.call(document.querySelectorAll('#cardIn ' + sel))
      .some(x => x.offsetParent !== null || x.getClientRects().length);
    return { en: on('.tk .en'), zh: on('.tk .zh'), ic: on('.tk .ic'), full: on('.full') };
  });
  const YN = [['#bEn', 'en', '英文'], ['#bZh', 'zh', '中文'], ['#bIc', 'ic', '圖示'], ['#bFull', 'full', '整句中文']];
  {
    const v0 = await vis(); acts++;
    for (const [id, k, name] of YN) {
      const lbl0 = await p.$eval(id, b => b.textContent.trim());
      if (!/Y$/.test(lbl0)) e.push(name + ' 一開始不是 Y（' + lbl0 + '）');
      await p.click(id); await p.waitForTimeout(280);
      const v1 = await vis(); acts++;
      const lbl1 = await p.$eval(id, b => b.textContent.trim());
      if (!/N$/.test(lbl1)) e.push('按了' + name + '沒有變成 N（' + lbl1 + '）');
      if (v0[k] && v1[k]) e.push(name + ' 按成 N 以後還看得見');
      for (const [, k2, n2] of YN) if (k2 !== k && v0[k2] && !v1[k2])
        e.push('關掉' + name + '，' + n2 + '也跟著不見了（四個開關要各自獨立）');
      const o = await snap();
      if (o.ox > 0 || o.oy > 0 || o.spill > 2) e.push(name + ' 關掉以後溢出 ' + o.ox + '/' + o.oy + '/' + o.spill);
      await p.click(id); await p.waitForTimeout(280);
      const v2 = await vis(); acts++;
      if (v0[k] && !v2[k]) e.push(name + ' 切回 Y 以後沒有回來');
    }
  }

  /* 📝 複習：每 4 張一組，20 秒限時，愈快答對分數愈高（使用者 2026-09-21 指定） */
  {
    await p.click('#rvBtn'); await p.waitForTimeout(420); acts++;
    const gs = await p.$$eval('#rv .rvg', a => a.map(x => x.textContent));
    const gn = gs.length;
    if (gn < 3) e.push('複習只有 ' + gn + ' 組（要每 4 張一組）');
    if (gn * 5 < N) e.push('複習沒有蓋到全部 ' + N + ' 張（只有 ' + gn + ' 組）');
    for (const g of gs) {
      const m = /(\d+)\s*題/.exec(g);
      if (!m || parseInt(m[1], 10) < 3) e.push('複習「' + g.trim() + '」不到 3 題');
    }
    await p.click('#rv .rvg'); await p.waitForTimeout(650); acts++;
    const q = await p.evaluate(() => ({
      q: (document.querySelector('.rvq') || {}).textContent || '',
      o: document.querySelectorAll('.rvo button').length,
      sec: parseInt((document.getElementById('rvnum') || {}).textContent || '0', 10),
      ox: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }));
    if (!q.q) e.push('複習題出不來');
    if (q.o !== 4) e.push('複習題不是四選一（' + q.o + '）');
    if (q.sec !== 20) e.push('複習題不是 20 秒（' + q.sec + '）');
    if (q.ox > 0) e.push('複習題橫向溢出 ' + q.ox);
    await p.waitForTimeout(1200);
    const s2 = await p.evaluate(() => parseInt(document.getElementById('rvnum').textContent, 10));
    if (!(s2 < q.sec)) e.push('複習題的倒數沒有在減少（' + q.sec + '→' + s2 + '）');
    await p.click('.rvo button[data-ok="false"]'); await p.waitForTimeout(300); acts++;
    const fb = await p.$eval('#rvfb', x => x.textContent.trim());
    if (!fb) e.push('複習題答完沒有回饋');
    acts += await missCheck(p, e, '複習題');
    await p.waitForTimeout(400);
    const q2 = await p.evaluate(() => ((document.querySelector('.rvq') || {}).textContent || ''));
    if (!q2) e.push('複習題答錯頁關掉以後，沒有出下一題');
    await p.evaluate(() => { rvStop(); document.getElementById('rv').classList.remove('on'); });
    await p.waitForTimeout(250);
  }


  /* 📑 目次（使用者 2026-09-24 指定）：一張卡一格、點了真的跳過去、平常不佔版面 */
  {
    await rewind(p, N);
    const hidden0 = await p.$eval('#toc', t => getComputedStyle(t).display === 'none');
    if (!hidden0) e.push('目次一開始就蓋在畫面上（要按了才出來）');
    await p.click('#tocBtn'); await p.waitForTimeout(300); acts++;
    const ti = await p.$$eval('#toc .ti', a => a.length);
    if (ti !== N) e.push('目次有 ' + ti + ' 格，卡片有 ' + N + ' 張');
    const o = await p.evaluate(OVS => eval('(' + OVS + ')')(), OV.toString());
    if (o.ox > 0) e.push('目次橫向溢出 ' + o.ox);
    const k = Math.min(N - 1, 5);
    await p.click('#toc .ti[data-n="' + k + '"]'); await p.waitForTimeout(600); acts++;
    const s0 = await snap();
    if (s0.on !== k) e.push('目次點第 ' + (k + 1) + ' 張，跳到的是第 ' + (s0.on + 1) + ' 張');
    if (!await p.$eval('#toc', t => getComputedStyle(t).display === 'none')) e.push('目次點完沒有收起來');
    await rewind(p, N);
  }

  /* 念到哪亮到哪：畫面上是 ’s 的句子，整句發音也一定是 ’s（使用者 2026-09-24 指定） */
  {
    let bad = [];
    for (let i = 0; i < N; i++) {
      if (i && !await fwd(p)) break;
      const r = await p.evaluate(() => {
        const has = [].slice.call(document.querySelectorAll('#cardIn .line .tk'))
          .some(t => /^['\u2019](s|m|re)$/.test(t.getAttribute('data-w') || ''));
        const f = document.querySelector('#cardIn .full');
        return { has, en: f ? (f.getAttribute('data-en') || '') : '', grp: typeof sayEls === 'function' };
      });
      if (!r.grp) { bad.push('沒有 sayEls'); break; }
      if (r.has && /\b(Who|He|She|What) is\b|\bI am\b|\bYou are\b/.test(r.en)) bad.push((i + 1) + ':' + r.en);
    }
    acts++;
    if (bad.length) e.push('畫面是 ’s，唸出來卻是 is（' + bad.join('、') + '）');
    await rewind(p, N);
  }

  /* 's 的發音要是 /z/：data-say 必須是「前一個字＋'s」，不是單獨一個 's */
  {
    await rewind(p, N);
    let bad = [];
    for (let i = 0; i < N; i++) {
      if (i && !await fwd(p)) break;
      const s0 = await snap();
      if (!s0.apos) continue;
      for (const w of s0.apos.split('|'))
        if (!/[A-Za-z]{2,}['\u2019]s$|^[A-Za-z]+['\u2019](m|re)$/.test(w)) bad.push((i + 1) + ':' + w);
    }
    acts++;
    if (bad.length) e.push('這幾張的 ’s 發音不是 /z/（' + bad.join('、') + '）');
    await rewind(p, N);
  }

  /* 替換字：點下去要真的換掉句子、發音也要跟著換，而且要待在句子的下方 */
  let g2 = 0;
  while ((await snap()).sub === 0 && g2++ < N) { if (!await fwd(p)) break; }
  if ((await snap()).sub > 0) {
    const b0 = await snap();
    const w = await p.$eval('#card .sub:not(.on)', b => b.getAttribute('data-w'));
    if (b0.subTop && b0.lineBot && b0.subTop < b0.lineBot)
      e.push('替換字跑到英文句子上面去了（' + b0.subTop + ' < ' + b0.lineBot + '）');
    await p.click('#card .sub:not(.on)'); await p.waitForTimeout(600);
    const after = await snap(); acts++;
    if (after.txt === b0.txt) e.push('點替換字沒有換掉句子');
    if (after.txt.indexOf(w) < 0) e.push('替換字 ' + w + ' 沒有進到句子裡');
    if (after.fullEn.indexOf(w) < 0)
      e.push('換了 ' + w + '，整句的發音沒有跟著換（還是「' + after.fullEn + '」）');
    const spoken = await p.evaluate(() => sentOf());
    if (spoken.indexOf(w) < 0)
      e.push('換了 ' + w + '，點卡片唸出來的還是舊句子（' + spoken + '）');
    if (after.spill > 2 || after.ox > 0) e.push('換了替換字以後溢出');
  } else e.push('整本找不到替換字');

  /* 一問一答：問句和答句都要逐字對齊（每一個英文字的正下方就是它的中文） */
  {
    await rewind(p, N);
    let g4 = 0, ok = false;
    while (g4++ < N) {
      const pr = await p.evaluate(() => {
        const b = document.querySelectorAll('#cardIn .pair .bub');
        if (b.length !== 2) return null;
        return [].slice.call(b).map(x => ({
          tk: x.querySelectorAll('.tk').length,
          zh: [].slice.call(x.querySelectorAll('.tk')).filter(t => {
            const z = t.querySelector('.zh'); return z && z.textContent.trim();
          }).length
        }));
      });
      if (pr) {
        ok = true; acts++;
        pr.forEach((x, n) => {
          const who = n ? '答句' : '問句';
          if (x.tk < 2) e.push('一問一答的' + who + '沒有逐字（' + x.tk + ' 個字）');
          if (x.zh !== x.tk) e.push('一問一答的' + who + '有 ' + (x.tk - x.zh) + ' 個英文字下面沒有中文');
        });
        break;
      }
      if (!await fwd(p)) break;
    }
    if (!ok) e.push('找不到一問一答卡');
    await rewind(p, N);
  }

  /* 變身術（Unit 2）：主詞和 be 動詞要真的交換 */
  await rewind(p, N);
  let g3 = 0, found = false;
  while (g3++ < N) { if ((await snap()).swap) { found = true; break } if (!await fwd(p)) break; }
  if (found) {
    const words = () => p.$$eval('#cardIn .line .tk .en', a => a.map(x => x.textContent.trim()));
    const b = await words();
    await p.click('#swapGo'); await p.waitForTimeout(1400);
    const a2 = await words(); acts++;
    if (b.slice(0, 2).join(' ').toLowerCase() === a2.slice(0, 2).join(' ').toLowerCase())
      e.push('按了變身，前兩個字沒有交換（' + b.slice(0, 2).join(' ') + ' → ' + a2.slice(0, 2).join(' ') + '）');
    const o = await snap();
    if (o.spill > 2 || o.ox > 0) e.push('變身以後溢出');
  } else if (f === 'unit2.html' && !SITE_DIR) e.push('Unit 2 找不到變身卡');

  /* 不發音的字母一律淺灰色（SIL 寫幾個字，就量幾個字：灰的剛好是那幾個字母，不多不少） */
  if (SD.SIL) {
    const bad = await p.evaluate(SIL => {
      const out = [];
      for (const w in SIL) {
        const d = document.createElement('div'); d.innerHTML = enHTML(w);
        const got = [].slice.call(d.childNodes).reduce((a, n) => {
          const t = n.textContent; if (n.className === 'sil') for (let k = 0; k < t.length; k++) a.push(a.len + k);
          a.len += t.length; return a;
        }, Object.assign([], { len: 0 })).join(',');
        if (got !== SIL[w].join(',')) out.push(w + '（應該灰 ' + SIL[w].join(',') + '，實際 ' + (got || '沒有') + '）');
      }
      if (!document.querySelector('#cardIn .sil, .sil')) out.push('整頁看不到任何淺灰色的字母');
      return out;
    }, SD.SIL);
    acts++;
    if (bad.length) e.push('不發音字母不對：' + bad.join('、'));
  }
  acts += await rateBar(p, e);
  return acts;
}

/* ---------- 暖身題頁 ---------- */
async function quizPage(p, f, vp, e) {
  const snap = () => p.evaluate(OVS => {
    const ov = eval('(' + OVS + ')')();
    return {
      ox: ov.ox, oy: ov.oy,
      gate: getComputedStyle(document.getElementById('gate')).display !== 'none',
      n: document.querySelectorAll('.opt').length,
      lock: document.getElementById('opts').className.indexOf('lock') >= 0,
      sec: parseInt(document.getElementById('rnum').textContent, 10),
      fb: document.getElementById('fb').classList.contains('on'),
      why: (document.getElementById('why').innerText || '').length,
      nx: (document.getElementById('nextQ').textContent || ''),
      qn: document.getElementById('qn').textContent
    };
  }, OV.toString());

  let acts = 0, s = await snap(); acts++;
  if (!s.gate) e.push('一開始不是閘門畫面（老師要能決定先不先做）');
  if (s.ox > 0 || s.oy > 0) e.push('閘門畫面溢出 ' + s.ox + '/' + s.oy);

  await p.click('#go'); await p.waitForTimeout(600);
  s = await snap(); acts++;
  /* 題目和選項每一次都重洗（CFG.random）：連開三次，題序和第一題的選項不可以都一樣 */
  if (SQ.CFG && SQ.CFG.random) {
    const sig = await p.evaluate(() => {
      const r = []; for (let k = 0; k < 3; k++) { start(); r.push(order.join(',') + '|' + cur().o.join('/')) }
      return r;
    });
    acts++;
    if (sig[0] === sig[1] && sig[1] === sig[2]) e.push('暖身題連開三次，題序和選項都一樣（沒有隨機）');
    const ok = await p.evaluate(() => QS.every(q => q.o[q.a] !== undefined && q.o.length === 4));
    if (!ok) e.push('重洗以後正確答案對不上');
    s = await snap();
  }
  if (s.n !== 4) e.push('選項不是 4 個（' + s.n + '）');
  if (!s.lock) e.push('一開始選項沒有鎖住（小組討論 20 秒）');
  if (s.ox > 0 || s.oy > 0) e.push('出題畫面溢出 ' + s.ox + '/' + s.oy);

  /* 倒數要真的在減少 */
  const t1 = (await snap()).sec; await p.waitForTimeout(2400);
  const t2 = (await snap()).sec; acts++;
  if (!(t2 < t1)) e.push('倒數沒有在減少（' + t1 + '→' + t2 + '）');

  /* 暫停要真的停住，繼續要真的恢復 */
  await p.click('#pause'); const p1 = (await snap()).sec;
  await p.waitForTimeout(2400); const p2 = (await snap()).sec; acts++;
  if (p2 !== p1) e.push('按了暫停，倒數還在跑（' + p1 + '→' + p2 + '）');
  await p.click('#pause'); await p.waitForTimeout(2400);
  if ((await snap()).sec >= p2) e.push('按了繼續，倒數沒有恢復'); acts++;

  /* 提前作答要真的解鎖 */
  await p.click('#early'); await p.waitForTimeout(300);
  if ((await snap()).lock) e.push('按了「提前作答」沒有解鎖'); acts++;

  /* 作答後：要有秒懂說明與下一題，選項要全鎖 */
  const wrongN = await p.evaluate(() => (cur().a + 1) % 4);
  await p.click('.opt[data-n="' + wrongN + '"]'); await p.waitForTimeout(250);
  acts += await missCheck(p, e, '暖身題');
  s = await snap(); acts++;
  if (!s.fb) e.push('作答後沒有出現回饋');
  if (s.why < 4) e.push('作答後沒有秒懂說明');
  if (!s.lock) e.push('作答後選項沒有鎖住');
  if (!s.nx) e.push('作答後沒有「下一題」');
  if (s.ox > 0 || s.oy > 0) e.push('回饋畫面溢出 ' + s.ox + '/' + s.oy);

  /* 停 6 秒不可自動跳題 */
  const q1 = (await snap()).qn; await p.waitForTimeout(6000);
  if ((await snap()).qn !== q1) e.push('停 6 秒自動跳題'); acts++;
  acts += await rateBar(p, e);
  return acts;
}

/* ---------- 遊戲頁 ---------- */
async function gamesPage(p, f, vp, e) {
  const snap = () => p.evaluate(OVS => {
    const ov = eval('(' + OVS + ')')();
    const st = document.getElementById('stage');
    return {
      ox: ov.ox, oy: st.scrollHeight - st.clientHeight,
      cards: document.querySelectorAll('.gcard').length,
      arena: document.getElementById('arena').classList.contains('on'),
      inner: (document.getElementById('arena').innerText || '').length,
      clickable: document.querySelectorAll('#arena .o,#arena .dbtn,#arena .cw,#arena .mc').length,
      sec: parseInt(document.getElementById('gnum').textContent, 10),
      end: document.getElementById('gend').classList.contains('on')
    };
  }, OV.toString());

  let acts = 0, s = await snap(); acts++;
  if (s.cards !== 10) e.push('遊戲大廳不是 10 種（' + s.cards + '）');

  /* 驚喜卡：每一個遊戲張數一樣、十個遊戲的名字全部不重複；翻開一張要真的出現、炸得出來、不溢出 */
  if (SG.SURP) {
    const all = [], need = SG.SURP.g1.length;
    for (const k in SG.SURP) {
      if (SG.SURP[k].length !== need) e.push(k + ' 的驚喜卡是 ' + SG.SURP[k].length + ' 張（其他是 ' + need + ' 張）');
      SG.SURP[k].forEach(x => all.push(x.t));
    }
    const dup = all.filter((t, n) => all.indexOf(t) !== n);
    if (dup.length) e.push('驚喜卡名字重複：' + dup.join('、'));
    if (SG.CFG && SG.CFG.minSurp && need < SG.CFG.minSurp) e.push('每個遊戲只有 ' + need + ' 張驚喜卡（要 ' + SG.CFG.minSurp + ' 張）');
    await p.click('.gcard:nth-of-type(1)'); await p.waitForTimeout(700);
    const sc0 = await p.evaluate(() => score);
    for (let k = 0; k < 3; k++) { await p.evaluate(() => fire()); await p.waitForTimeout(1250); }
    const ev = await p.evaluate(() => ({
      on: document.getElementById('evt').classList.contains('on'),
      big: (document.querySelector('#evt .ebig') || {}).textContent || '',
      burst: document.querySelectorAll('#burst i').length, hasBurst: !!document.getElementById('burst'),
      opened: opened.length, ox: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }));
    acts++;
    if (!ev.on || !ev.big) e.push('翻驚喜卡沒有出現／卡片上沒有寫拿到什麼');
    if (ev.opened !== 3) e.push('翻了 3 張驚喜卡，記到 ' + ev.opened + ' 張');
    if (ev.hasBurst && ev.burst < 10) e.push('驚喜卡翻開沒有炸滿畫面（' + ev.burst + ' 個）');
    if (ev.ox > 0) e.push('驚喜卡翻開以後橫向溢出 ' + ev.ox);
    await p.waitForTimeout(1600);
    await p.click('#quit'); await p.waitForTimeout(500);
  }
  if (s.ox > 0) e.push('大廳橫向溢出 ' + s.ox);

  for (let i = 1; i <= 10; i++) {
    await p.click('.gcard:nth-of-type(' + i + ')'); await p.waitForTimeout(900);
    let g = await snap(); acts++;
    const id = await p.evaluate(() => (document.getElementById('gname').textContent || ''));
    if (!g.arena) { e.push('遊戲 ' + i + ' 沒有進到遊戲場'); await p.click('#quit'); continue }
    if (g.inner < 3) e.push('遊戲 ' + i + '（' + id + '）畫面是空的');
    if (!g.clickable) e.push('遊戲 ' + i + '（' + id + '）沒有可以點的東西');
    if (g.sec > 60) e.push('遊戲 ' + i + ' 一題的倒數不是 15 秒（' + g.sec + '）');
    if (g.ox > 0) e.push('遊戲 ' + i + ' 橫向溢出 ' + g.ox);
    /* 倒數要真的在跑 */
    const a1 = g.sec; await p.waitForTimeout(2400);
    const a2 = (await snap()).sec;
    if (!(a2 < a1)) e.push('遊戲 ' + i + ' 倒數沒有在減少（' + a1 + '→' + a2 + '）');
    /* 點一個答案不可以壞掉 */
    try {
      const wr = await p.$('#arena .o[data-ok="false"]');
      if (wr) await wr.click({ timeout: 8000 });
      else await p.locator('#arena .o,#arena .dbtn,#arena .cw,#arena .mc').first().click({ timeout: 8000 });
    } catch (err) {
      e.push('遊戲 ' + i + '（' + id + '）點不下去：' + String(err.message).split('\n')[0]);
      await p.click('#quit'); await p.waitForTimeout(400); continue;
    }
    await p.waitForTimeout(250);
    if (await p.evaluate(() => { const m = document.getElementById('miss'); return !!(m && m.classList.contains('on')) })
        || await p.$('#arena .o[data-ok="false"].bad'))
      acts += await missCheck(p, e, '遊戲 ' + i + ' ');
    await p.waitForTimeout(700);
    g = await snap(); acts++;
    if (!g.arena && !g.end) e.push('遊戲 ' + i + ' 作答後畫面不見了');
    if (g.arena && g.inner < 3) e.push('遊戲 ' + i + ' 作答後出不了下一題');
    if (g.ox > 0) e.push('遊戲 ' + i + ' 作答後橫向溢出 ' + g.ox);
    await p.click('#quit'); await p.waitForTimeout(500);
    if ((await snap()).cards !== 10) e.push('遊戲 ' + i + ' 回不了大廳');
  }
  acts += await rateBar(p, e);
  return acts;
}

/* ---------- 首頁 ---------- */
async function homePage(p, f, vp, e) {
  const s = await p.evaluate(OVS => eval('(' + OVS + ')')(), OV.toString());
  if (s.ox > 0) e.push('首頁橫向溢出 ' + s.ox);
  if (s.oy > 0) e.push('首頁有捲軸（投影會被切掉）' + s.oy);
  const n = await p.$$eval('#menu .card', a => a.length);
  if (n !== 4) e.push('首頁不是四個部分（' + n + '）');
  return 2;
}

(async () => {
  const br = await chromium.launch();
  let fails = 0, acts = 0;
  for (const f of FILES) {
    for (const vp of VPS) {
      const ctx = await br.newContext({ viewport: { width: vp.width, height: vp.height }, offline: true });
      const p = await ctx.newPage();
      const e = [];
      p.on('pageerror', err => e.push('JS 例外：' + err.message));
      p.on('console', m => { if (m.type() === 'error') e.push('console error：' + m.text().slice(0, 120)) });
      await p.goto(pathToFileURL(DIR + f).href);
      await p.waitForTimeout(500);
      if (!await fontOk(p)) e.push('Andika 沒有載到');
      await links(p, e);
      if (f === 'index.html') acts += await homePage(p, f, vp, e);
      else if (f === 'warmup.html') acts += await quizPage(p, f, vp, e);
      else if (f === 'games.html') acts += await gamesPage(p, f, vp, e);
      else acts += await cardsPage(p, f, vp, e);
      if (e.length) { fails += e.length; console.log('✗ ' + f + ' @' + vp.n); e.forEach(x => console.log('   ' + x)) }
      await ctx.close();
    }
  }
  await br.close();
  console.log((fails ? '✗ ' : '✓ ') + FILES.length + ' 頁 ✕ 2 尺寸，量了 ' + acts + ' 項，失敗 ' + fails + ' 項');
  process.exit(fails ? 1 : 0);
})();
