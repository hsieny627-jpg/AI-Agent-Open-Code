/* sentences/_verify.js — 句型網站的量測腳本（不目視、不截圖）
 *
 * 用法： node sentences/_verify.js            量全部五頁
 *        node sentences/_verify.js unit1.html 只量一頁（改一張卡時用這個，省時間）
 *
 * 兩種尺寸（1024×768 橫、820×1180 直）、offline:true 開檔。
 * 只印失敗項與一行總結。
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), DIR = __dirname + '/';
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
      sub: document.querySelectorAll('#cardIn .sub').length,
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
  }
  if (!anyRed) e.push('整本找不到紅色的撇號 ’');
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

  /* 四種切換按鈕真的有效 */
  const vis = () => p.evaluate(() => {
    const on = sel => [].slice.call(document.querySelectorAll('#cardIn ' + sel))
      .some(x => x.offsetParent !== null || x.getClientRects().length);
    return { en: on('.tk .en'), zh: on('.tk .zh'), ic: on('.tk .ic'), full: on('.full') };
  });
  const want = { all: [1, 1, 1, 1], en: [1, 0, 0, 0], zh: [0, 1, 0, 0], full: [0, 0, 0, 1], ic: [0, 0, 1, 0] };
  for (const m of ['all', 'en', 'zh', 'full', 'ic']) {
    await p.click('#modeGrp button[data-m="' + m + '"]'); await p.waitForTimeout(260);
    const v = await vis(); acts++;
    const got = [v.en ? 1 : 0, v.zh ? 1 : 0, v.ic ? 1 : 0, v.full ? 1 : 0];
    if (got.join() !== want[m].join()) e.push('「' + m + '」模式顯示錯：英' + got[0] + ' 中' + got[1] + ' 圖' + got[2] + ' 整句' + got[3]);
    const o = await snap();
    if (o.ox > 0 || o.oy > 0 || o.spill > 2) e.push('「' + m + '」模式溢出 ' + o.ox + '/' + o.oy + '/' + o.spill);
  }
  await p.click('#modeGrp button[data-m="all"]'); await p.waitForTimeout(220);

  /* 圖示開關 */
  await p.click('#icBtn'); await p.waitForTimeout(240);
  if ((await vis()).ic) e.push('關掉圖示以後圖示還在'); acts++;
  await p.click('#icBtn'); await p.waitForTimeout(240);
  if (!(await vis()).ic) e.push('打開圖示以後圖示沒回來'); acts++;

  /* 替換字：點下去要真的換掉句子裡的字 */
  let g2 = 0;
  while ((await snap()).sub === 0 && g2++ < N) { if (!await fwd(p)) break; }
  if ((await snap()).sub > 0) {
    const before = (await snap()).txt;
    const w = await p.$eval('#cardIn .sub:not(.on)', b => b.getAttribute('data-w'));
    await p.click('#cardIn .sub:not(.on)'); await p.waitForTimeout(600);
    const after = await snap(); acts++;
    if (after.txt === before) e.push('點替換字沒有換掉句子');
    if (after.txt.indexOf(w) < 0) e.push('替換字 ' + w + ' 沒有進到句子裡');
    if (after.spill > 2 || after.ox > 0) e.push('換了替換字以後溢出');
  } else e.push('整本找不到替換字');

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
  } else if (f === 'unit2.html') e.push('Unit 2 找不到變身卡');
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
  await p.click('.opt'); await p.waitForTimeout(700);
  s = await snap(); acts++;
  if (!s.fb) e.push('作答後沒有出現回饋');
  if (s.why < 4) e.push('作答後沒有秒懂說明');
  if (!s.lock) e.push('作答後選項沒有鎖住');
  if (!s.nx) e.push('作答後沒有「下一題」');
  if (s.ox > 0 || s.oy > 0) e.push('回饋畫面溢出 ' + s.ox + '/' + s.oy);

  /* 停 6 秒不可自動跳題 */
  const q1 = (await snap()).qn; await p.waitForTimeout(6000);
  if ((await snap()).qn !== q1) e.push('停 6 秒自動跳題'); acts++;
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
  if (s.ox > 0) e.push('大廳橫向溢出 ' + s.ox);

  for (let i = 1; i <= 10; i++) {
    await p.click('.gcard:nth-of-type(' + i + ')'); await p.waitForTimeout(900);
    let g = await snap(); acts++;
    const id = await p.evaluate(() => (document.getElementById('gname').textContent || ''));
    if (!g.arena) { e.push('遊戲 ' + i + ' 沒有進到遊戲場'); await p.click('#quit'); continue }
    if (g.inner < 3) e.push('遊戲 ' + i + '（' + id + '）畫面是空的');
    if (!g.clickable) e.push('遊戲 ' + i + '（' + id + '）沒有可以點的東西');
    if (g.sec !== 120 && g.sec > 120) e.push('遊戲 ' + i + ' 倒數不是 2 分鐘（' + g.sec + '）');
    if (g.ox > 0) e.push('遊戲 ' + i + ' 橫向溢出 ' + g.ox);
    /* 倒數要真的在跑 */
    const a1 = g.sec; await p.waitForTimeout(2400);
    const a2 = (await snap()).sec;
    if (!(a2 < a1)) e.push('遊戲 ' + i + ' 倒數沒有在減少（' + a1 + '→' + a2 + '）');
    /* 點一個答案不可以壞掉 */
    try {
      await p.locator('#arena .o,#arena .dbtn,#arena .cw,#arena .mc').first().click({ timeout: 8000 });
    } catch (err) {
      e.push('遊戲 ' + i + '（' + id + '）點不下去：' + String(err.message).split('\n')[0]);
      await p.click('#quit'); await p.waitForTimeout(400); continue;
    }
    await p.waitForTimeout(2200);
    g = await snap(); acts++;
    if (!g.arena && !g.end) e.push('遊戲 ' + i + ' 作答後畫面不見了');
    if (g.arena && g.inner < 3) e.push('遊戲 ' + i + ' 作答後出不了下一題');
    if (g.ox > 0) e.push('遊戲 ' + i + ' 作答後橫向溢出 ' + g.ox);
    await p.click('#quit'); await p.waitForTimeout(500);
    if ((await snap()).cards !== 10) e.push('遊戲 ' + i + ' 回不了大廳');
  }
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
      await p.goto('file://' + DIR + f);
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
