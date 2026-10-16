/* score/_verify.js — 量成績紀錄（2026-10-07 對話 C）：學生端（兩個教學網站＋在家複習）＋老師看板。只印失敗項和一行總結。
 *   node score/_verify.js            （ONLY=teacher node score/_verify.js ＝ 只量老師看板）
 * 假伺服器：score/_gas_stub.js 跑「真的」score/Code.gs（網站送出去的每一筆都由同一份程式處理）。
 * 三種尺寸：iPad 橫 1024×768、iPad 直 820×1180、教室觸控螢幕 1920×1080。
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), cp = require('child_process'), { pathToFileURL } = require('url');
const { make } = require('./_gas_stub.js'), SC = require('./_calc.js'), CI = SC.CI;
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec', PW = 'pw-verify';
const VPS = [[1024, 768], [820, 1180], [1920, 1080]];
const PAGES = [
  { f: 'G3 - L1 + L2/unit1.html', g: 3, src: 'school', set: 'g3u1_1-1b', me: '30405', other: '40205' },
  { f: 'sentences/unit2.html', g: 4, src: 'school', set: 'g4u2_1-1b', me: '40205', other: '30405' },
  { f: 'g3-review/u1.html', g: 3, src: 'home', set: 'g3u1_1-1b', me: '30405', other: '40205' },
  { f: 'g4-review/u2.html', g: 4, src: 'home', set: 'g4u2_1-1b', me: '40205', other: '30405' }
];
let fails = 0, n = 0;
const out = (where, e) => { if (e.length) { fails += e.length; console.log('✗ ' + where); e.forEach(x => console.log('   ' + x)); } };
/* 假伺服器：先放 14 個同學（這週），讓排行榜滿 10 個人、而且「我」不在前 10 */
function seed(G, g) {
  const C = g === 3 ? ['304', '307', '311'] : ['402', '406', '409', '410'], set = g === 3 ? 'g3u1_1-1b' : 'g4u2_1-1b';
  for (let s = 1; s <= 14; s++) {
    const id = C[0] + String(s + 10).padStart(2, '0');
    G.post({ a: 'rec', r: { id, set, name: 's', raw: 4500, src: 'school', dev: 'x', u: 'seed' + id, t: Date.now() - 36e5, qs: [0, 1, 2, 3, 4].map(() => [1, 0, 2, 0, .9]) } });
  }
  G.post({ a: 'rec', r: { id: C[1] + '01', set, name: 's', raw: 2000, src: 'school', dev: 'x', u: 'seedB', t: Date.now() - 36e5, qs: [0, 1, 2, 3, 4].map(i => [i < 3 ? 1 : 0, i < 3 ? 0 : 1, 2, 0, .5]) } });
}
let OFF = false;   /* 沒有網路：假伺服器連不上（Playwright 的 setOffline 擋不住 route） */
async function route(ctx, G) {
  await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); }, URL0);
  await ctx.route(URL0 + '**', async r => {
    if (OFF) return r.abort('internetdisconnected');
    const q = Object.fromEntries(new URL(r.request().url()).searchParams);
    const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
  });
}
const fit = p => p.evaluate(() => { const de = document.documentElement, rv = document.getElementById('rv'), e = [];
  if (de.scrollWidth > de.clientWidth + 1) e.push('橫向溢出 ' + (de.scrollWidth - de.clientWidth));
  if (rv && rv.classList.contains('on') && rv.scrollHeight > rv.clientHeight + 1) e.push('要捲動才看得到全部（' + (rv.scrollHeight - rv.clientHeight) + 'px）');
  [].forEach.call(document.querySelectorAll('#rv button, .scbar, .sclist div, .scmine, .scpod .id'), x => { if (x.getBoundingClientRect().width && x.scrollWidth > x.clientWidth + 2) e.push('字超出框：' + x.textContent.trim().slice(0, 24)); });
  return e; });
/* 2026-10-12 D 第 4 件：榮譽動畫的一幕（字夠大、卡片在框裡、有風格） */
const honNow = p => p.evaluate(() => { const h = document.getElementById('scHon'); if (!h) return null; const r = h.getBoundingClientRect(), e = [];
  [].forEach.call(h.querySelectorAll('.hkick,.htit,.hsub,.hcard .hn,.hcard .hl,.hcard .hw'), x => { const z = parseFloat(getComputedStyle(x).fontSize); if (z < (innerWidth >= 1900 ? 22 : 18)) e.push('字太小 ' + z + 'px：' + x.textContent.slice(0, 12)); });
  [].forEach.call(h.querySelectorAll('.hcard'), x => { const b = x.getBoundingClientRect(); if (b.right > r.right + 2 || b.left < r.left - 2 || b.bottom > r.bottom + 2 || b.top < r.top - 2) e.push('卡片超出榮譽動畫的框：' + x.textContent.slice(0, 16)); });
  if (r.bottom > innerHeight + 1 && !document.getElementById('scov')) e.push('榮譽動畫超出畫面下面 ' + Math.round(r.bottom - innerHeight) + 'px');
  return { cls: h.className, t: h.textContent, cards: h.querySelectorAll('.hcard').length, e: e }; });
async function keys(p, ks) { for (const d of ks) await p.click('.sckey button[data-k="' + d + '"]'); await p.waitForTimeout(150); }
const typed = p => p.evaluate(() => [].map.call(document.querySelectorAll('#scBox i'), x => x.textContent).join(''));
async function typeId(p, id) { for (const d of id) await p.click('.sckey button[data-k="' + d + '"]'); await p.click('.sckey button[data-k="ok"]'); await p.waitForTimeout(250); }
async function quiz(p, wrongAt, started) {
  if (!started) await p.click('#tqStart'); await p.waitForTimeout(700);
  for (let k = 0; k < 5; k++) {
    const sel = (await p.$('.tqr .ch')) ? '.tqr .ch' : '.tqo button';
    await p.waitForTimeout(k === 0 ? 1200 : 1150);   /* 看完題目才按（1 秒內按 ＝ 太快亂按，練習次數不會 ＋1） */
    if (k === wrongAt) { await p.click(sel + '[data-ok="false"]'); await p.waitForTimeout(900); await p.waitForSelector('#miss .nxt', { timeout: 12000 }); await p.click('#miss .nxt'); await p.waitForTimeout(500); }
    else { await p.click(sel + '[data-ok="true"]'); await p.waitForTimeout(1500); }
  }
  await p.waitForTimeout(400);
}
async function student(br, P, vp) {
  const G = make({ TEACHER_PW: PW }); seed(G, P.g);
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }); await route(ctx, G);
  const p = await ctx.newPage(), e = [], W = P.f + ' @' + vp.join('x');
  p.on('pageerror', x => e.push('JS 例外：' + x.message));
  await p.goto(pathToFileURL(path.join(ROOT, P.f)).href); await p.waitForTimeout(500);
  /* 2026-10-09 E16～E20：〔📝 複習題〕講完才出現 ➜ 量測先當作每一個分頁都講完了 */
  await p.evaluate(() => { MISSN = 1; TABM.forEach((tb, t) => { TQSEEN[t + '_0'] = 1; TQSEEN[t + '_1'] = 1; }); tqMark(); });
  /* ① 登入畫面 */
  await p.click('#tqGo'); await p.waitForTimeout(300);
  if (!await p.$('#scBox')) { e.push('按〔📝 複習題〕沒有先出登入畫面'); out(W, e); await ctx.close(); return; }
  await p.waitForTimeout(2600);
  const demo = await p.evaluate(() => ({ cells: document.querySelectorAll('#scBox i').length, keys: [].map.call(document.querySelectorAll('.sckey button'), b => b.getBoundingClientRect().height),
    guest: !!document.getElementById('scGuest'), font: parseFloat(getComputedStyle(document.querySelector('#scBox i')).fontSize) }));
  if (demo.cells !== 5) e.push('登入不是 5 格（' + demo.cells + '）');
  if (demo.keys.length !== 12 || Math.min.apply(null, demo.keys) < 56) e.push('數字鍵盤不是 12 顆或不到 56px 高');
  if (demo.font < 36) e.push('登入格子的數字太小（' + demo.font + 'px）');
  if (demo.guest !== (P.src === 'home')) e.push(P.src === 'home' ? '在家複習沒有〔👀 先練習，不記成績〕' : '教學網站不可以有「不記成績」');
  e.push(...await fit(p)); n += 5;
  /* 2026-10-09 新登入：① 打班級 ➜ ② 打座號 ➜ ③ 按 ✅（那一步會亮、那一格會閃）；班級打錯立刻清空 */
  const L = () => p.evaluate(() => ({ now: [1, 2, 3].filter(k => document.getElementById('scSt' + k).classList.contains('now')),
    cur: [].findIndex.call(document.querySelectorAll('#scBox i'), x => x.classList.contains('cur')), msg: document.getElementById('scMsg').textContent,
    ready: document.querySelector('.sckey .okb').classList.contains('ready'), stepPx: parseFloat(getComputedStyle(document.getElementById('scSt1')).fontSize) }));
  let l = await L();
  if (l.now.join() !== '1' || l.cur !== 0) e.push('登入一開始不是「① 打班級」亮、第 1 格閃（' + l.now + '／' + l.cur + '）');
  if (!/班級/.test(l.msg) || !/例/.test(l.msg)) e.push('登入一開始沒有寫先打班級和例子（' + l.msg + '）');
  if (l.stepPx < 20) e.push('登入步驟的字太小（' + l.stepPx + 'px）');
  await keys(p, P.me.slice(0, 3)); l = await L();
  if (l.now.join() !== '2' || l.cur !== 3) e.push('班級打完不是「② 打座號」亮、第 4 格閃');
  await keys(p, P.me.slice(3)); l = await L();
  if (l.now.join() !== '3' || !l.ready) e.push('5 碼打完不是「③ 按 ✅」亮、✅ 沒有變亮');
  await keys(p, 'b'); if ((await typed(p)) !== P.me.slice(0, 4)) e.push('座號裡按 ⌫ 不是刪一個數字');
  await keys(p, 'b'); await keys(p, 'b'); if ((await typed(p)) !== '') e.push('班級裡按 ⌫ 沒有整個班級清掉');
  await keys(p, P.me.slice(0, 3)); await p.click('#scGc'); await p.waitForTimeout(150);
  if ((await typed(p)) !== '') e.push('點班級的格子沒有整個班級清掉重打');
  n += 8;
  /* ② 防呆：班級打錯（第 3 個數字打完）立刻清空；座號錯只清座號 */
  const bad = [[P.g === 3 ? '305' : (P.g === 4 ? '405' : '305'), '沒有', ''], [P.other.slice(0, 3), '年級的網站', ''],
    [P.me.slice(0, 3) + '31', '座號', P.me.slice(0, 3)], [P.me.slice(0, 3) + '00', '座號', P.me.slice(0, 3)]].filter(x => P.g || x[1] !== '年級的網站');
  for (const [id, want, left] of bad) {
    await keys(p, id); const m = await p.evaluate(() => document.getElementById('scMsg').textContent);
    if (m.indexOf(want) < 0) e.push('輸入 ' + id + ' 沒有擋下來（' + m + '）');
    if ((await typed(p)) !== left) e.push('輸入 ' + id + ' 以後沒有清掉（剩「' + (await typed(p)) + '」）');
    await p.click('#scGc'); await p.waitForTimeout(100);
    n += 2;
  }
  if (P.src === 'home') {
    /* ③ 在家：先練習不記成績 */
    await p.click('#scGuest'); await p.waitForTimeout(300);
    const t = await p.evaluate(() => document.getElementById('rvbox').textContent);
    if (!/練習模式/.test(t)) e.push('按〔先練習〕以後沒有寫「練習模式（不記成績）」');
    const before = G.books['紀錄'].d.length;
    await quiz(p, -1);
    if (G.books['紀錄'].d.length !== before) e.push('練習模式也把成績送出去了');
    if (!await p.$('.tqend .sc')) e.push('練習模式做完沒有原本的結算畫面');
    n += 3;
    await p.click('#tqBack'); await p.waitForTimeout(200); await p.click('#tqGo'); await p.waitForTimeout(300);
    await p.click('#scSwap'); await p.waitForTimeout(300);
    if (!await p.$('#scBox')) e.push('練習模式按〔🔢 登入〕沒有回到登入畫面');
  }
  /* ④ 登入、作答（第 2 題故意答錯） */
  await typeId(p, P.me); await p.waitForTimeout(400);
  const intro = await p.evaluate(() => document.getElementById('rvbox').textContent);
  if (!new RegExp(P.me).test(intro) || /🪑 ?\d/.test(intro)) e.push('開場沒有顯示「' + P.me + '」（號碼前面不放 🪑）');
  if (!/本班/.test(intro)) e.push('開場沒有寫「本班名次」');
  e.push(...await fit(p)); n += 3;
  const before = G.books['紀錄'].d.length;
  await p.click('#tqStart'); await p.waitForTimeout(1000);
  const rk = await p.evaluate(() => document.getElementById('tqrk').textContent);
  if (!/本班第 \d+ 名|再 \d+ 分進前 10/.test(rk)) e.push('作答中右上角不是本班名次（' + rk + '）');
  e.push(...await fit(p)); n += 2;
  await p.evaluate(() => { tqClose(); });
  await p.click('#tqGo'); await p.waitForTimeout(300);
  await quiz(p, 1);
  /* ⑤ 結束畫面（2026-10-12 D 第 4 件）：① 正確率 ➜ 🏆 榮譽動畫（自己的獎 ➜ 本班榮譽榜 ➜ 班際）➜ ③ 答錯整理 */
  await p.waitForTimeout(1600);
  const s0 = await p.evaluate(() => ({ k: SCEND && SCEND.k, t: (document.getElementById('scn') || {}).textContent || '' }));
  if (s0.k !== 0 || !/正確率/.test(s0.t) || !/80%/.test(s0.t)) e.push('第 1 幕不是正確率 80%：' + s0.t.slice(0, 40));
  (await fit(p)).forEach(x => e.push('第 1 幕' + x));
  if (await p.$('#scNx')) await p.click('#scNx'); else e.push('第 1 幕沒有〔➡ 下一步〕');
  /* ② 練習時間（第 4 件修正 D8 ②）：沒上榜 ＝ 時鐘＋正確率＋這週＋這一次；名次沒變 ＝ 不演榮譽動畫 */
  await p.waitForTimeout(1200);
  const tm = await p.evaluate(() => { const x = document.querySelector('.sctime'); return x ? { t: x.textContent, clk: !!x.querySelector('svg.hclk'), z: Math.min.apply(null, [].map.call(x.children, c => parseFloat(getComputedStyle(c).fontSize))) } : null; });
  if (!tm) e.push('第 2 幕沒有練習時間');
  else { if (!tm.clk) e.push('練習時間沒有自己畫的時鐘');
    if (!/這週你已經練習 \d+ (秒|分鐘)/.test(tm.t) || !/這一次 練習 \d+ (秒|分鐘)。/.test(tm.t)) e.push('練習時間的字不對：' + tm.t.slice(0, 60));
    if (!/🎯 正確率 80 分/.test(tm.t)) e.push('沒上榜：練習時間那一張沒有正確率');
    if (tm.z < 24) e.push('練習時間的字太小 ' + tm.z + 'px');
    if (/練習次數 ＋1|努力獎|小提醒|算 1 次/.test(tm.t)) e.push('還有拿掉的小獎或「練習次數 ＋1」'); }
  (await fit(p)).forEach(x => e.push('練習時間' + x));
  await p.waitForTimeout(4600);
  if (await honNow(p)) e.push('名次沒變（沒上榜）卻演了榮譽動畫');
  /* ③ ❤ 這週 用心程度（2026-10-15 D 第 8 件，D12 ③ 甲）：每一次都演、五顆愛心、8 種風格、〔📖 說明〕打開就不自己換幕 */
  await p.waitForTimeout(5400);
  const cs = await p.evaluate(() => { const c = document.querySelector('#scn .care'); return { nm: SCEND && SCEND.list[SCEND.k], c: !!c, h: c ? c.querySelectorAll('.chc').length : 0, on: c ? c.querySelectorAll('.chc.on').length : 0,
    n: c ? +c.querySelector('.cn').textContent : -1, tip: c ? c.querySelector('.ctip').textContent : '', st: c ? (/\bcs([1-8])\b/.exec(c.className) || [])[1] : null, t: c ? c.querySelector('.ct1').textContent : '',
    tot: SCEND && SCEND.res && SCEND.res.me && SCEND.res.me.care && SCEND.res.me.care.tot, min: c ? Math.min.apply(null, [].map.call(c.querySelectorAll('.ct1,.csum,.cv,.cnote,.ctip,.chb'), x => parseFloat(getComputedStyle(x).fontSize))) : 0 }; });
  if (cs.nm !== 'care' || !cs.c) e.push('練習時間下一幕不是 ❤ 用心程度（' + cs.nm + '）');
  else { if (cs.h !== 5 || cs.on !== 5 || cs.n !== cs.tot) e.push('用心程度：五顆愛心沒有演完或數字不對（' + JSON.stringify(cs) + '）');
    if (cs.t !== '這週 用心程度' || !/💡 請|🎉 五顆/.test(cs.tip) || !cs.st) e.push('用心程度的字或風格不對：' + cs.t + '｜' + cs.tip + '｜' + cs.st);
    if (cs.min < 20) e.push('用心程度的字太小 ' + cs.min + 'px');
    (await fit(p)).forEach(x => e.push('用心程度' + x));
    await p.click('#scn .chb'); await p.waitForTimeout(2600);
    const hp = await p.evaluate(() => ({ nm: SCEND.list[SCEND.k], r: document.querySelectorAll('#scn .chp .chr.on').length, t: (document.querySelector('#scn .chp') || {}).textContent || '' }));
    if (hp.r !== 5 || !/5 項 ✕ 20 分 ＝ 100 分/.test(hp.t) || !/你：/.test(hp.t)) e.push('〔📖 說明〕不是五項一條一條（' + hp.r + '）：' + hp.t.slice(0, 60));
    await p.waitForTimeout(5000);
    if (await p.evaluate(() => SCEND.list[SCEND.k]) !== 'care') e.push('打開〔📖 說明〕還自己換到下一幕');
    await p.click('#scNx'); await p.waitForTimeout(400); }
  const cst = await p.evaluate(() => { localStorage.removeItem('hon_cv'); const a = []; for (let i = 0; i < 17; i++) a.push(HON.cpick('cv')); return a; });
  if (new Set(cst.slice(0, 8)).size !== 8 || cst.some((x, i) => i && x === cst[i - 1])) e.push('用心程度 8 種風格沒有輪流（' + cst.join(',') + '）');
  n += 7;
  /* 太快亂按超過一半 ＝ ⚠️ 太快亂按，不算時間／請 看完、聽完再選 */
  const fz = await p.evaluate(() => scTimeHTML({ m: 'q', n: 5, ok: 5, acc: 100, fast: 3, me1: 0, res: null }));
  if (!/⚠️/.test(fz) || !/太快亂按，不算時間/.test(fz) || !/請 看完、聽完再選/.test(fz) || /這週/.test(fz)) e.push('太快亂按的那一張不對：' + fz.replace(/<[^>]+>/g, ' ').slice(0, 60));
  /* 12 種風格：輪完才重複、跟上一次一定不一樣 */
  const rot = await p.evaluate(() => { localStorage.removeItem('hon_v'); const a = []; for (let i = 0; i < 25; i++) a.push(HON.pick('v')); return a; });
  if (new Set(rot.slice(0, 12)).size !== 12 || new Set(rot.slice(12, 24)).size !== 12 || rot.some((x, i) => i && x === rot[i - 1])) e.push('12 種風格沒有輪流（' + rot.join(',') + '）');
  const s2 = await p.evaluate(() => ({ k: SCEND && SCEND.k, nm: SCEND && SCEND.list[SCEND.k], L: SCEND && SCEND.list.join(), t: (document.getElementById('scn') || {}).textContent || '' }));
  if (s2.nm !== 'end' || !/答對/.test(s2.t) || s2.L !== 'acc,time,care,end') e.push('練習時間演完沒有自己到最後一幕（' + s2.nm + '／' + s2.L + '）');
  /* ③ 這一次讓名次上升 ＝ 演榮譽動畫（把伺服器回來的名次改成「以前第 3 名、現在第 2 名」） */
  const up = await p.evaluate(() => { const E = SCEND, V = JSON.parse(JSON.stringify(E.res)); V.boards = true;
    V.rk = { sec: { cls: 2, grade: 4 }, acc: { cls: null, grade: null }, prog: { cls: null, grade: null } }; V.rk0 = { sec: { cls: 3, grade: 4 }, acc: { cls: null, grade: null }, prog: { cls: null, grade: null } };
    V.me.sec = 2880; V.crk = null; E.res = V; E.list = ['acc', 'time', 'care', 'honor', 'end']; E.tgo = 0; return scUps(E).map(u => u.w + '｜' + u.l); });
  if (up.length !== 1 || !/^\d{3} 班 第 2 名｜這週 練習 48 分鐘$/.test(up[0])) e.push('名次上升（第 3 ➜ 第 2）、全年級沒變（第 4 ➜ 第 4）：應該只演班內那一個（' + JSON.stringify(up) + '）');
  await p.evaluate(() => scGo(1)); await p.waitForTimeout(600);
  const tu = await p.evaluate(() => (document.querySelector('.sctime') || {}).textContent || '');
  if (/正確率|比上週/.test(tu)) e.push('上榜的人練習時間那一張不寫正確率、比上週多');
  await p.evaluate(() => scGo(3)); await p.waitForTimeout(2600);
  const hu = await honNow(p);
  if (!hu) e.push('名次上升沒有演榮譽動畫');
  else { hu.e.forEach(x => e.push('榮譽動畫：' + x)); (await fit(p)).forEach(x => e.push('榮譽動畫' + x));
    if (!/🏆 本週 榮譽榜/.test(hu.t) || !/最認真練習/.test(hu.t) || !/第 2 名/.test(hu.t) || !/這週 練習 48 分鐘/.test(hu.t)) e.push('榮譽動畫的字不對：' + hu.t.slice(0, 80));
    if (!/\bhs\d+\b/.test(hu.cls)) e.push('榮譽動畫沒有風格（' + hu.cls + '）');
    if (/聰明|算 1 次|練習次數 ＋1|努力獎|每一題都看完/.test(hu.t)) e.push('榮譽動畫還有拿掉的字：' + hu.t.slice(0, 60)); }
  await p.waitForTimeout(4600);
  const s3 = await p.evaluate(() => SCEND && SCEND.list[SCEND.k]);
  if (s3 !== 'end') e.push('榮譽動畫演完沒有自己到最後一幕（' + s3 + '）');
  await p.evaluate(() => { const m = document.getElementById('missAll'); if (m) m.classList.remove('on'); });
  if (!await p.$('#tqAgain') || !await p.$('#tqMiss')) e.push('最後一幕沒有〔🔁 再挑戰一次〕〔📌 答錯整理〕');
  n += 16;
  /* ⑥ 伺服器收到的那一筆 */
  const rows = G.books['紀錄'].d.slice(before);
  if (rows.length !== 1) e.push('伺服器收到 ' + rows.length + ' 筆（要 1 筆）');
  else { const r = rows[0], qs = JSON.parse(r[CI['每題']]);
    if (r[1] !== P.me || r[CI['題組']] !== P.set || r[CI['來源']] !== P.src) e.push('送出去的 5 碼／題組／來源不對：' + [r[1], r[CI['題組']], r[CI['來源']]].join(' '));
    if (r[CI['答對']] !== 4 || r[CI['正確率']] !== 80) e.push('送出去的答對數／正確率不對：' + r[CI['答對']] + ' ' + r[CI['正確率']]);
    if (qs.length !== 5 || qs[1][0] !== 0 || !(qs[1][1] >= 1 && qs[1][1] <= 3)) e.push('第 2 題（答錯）沒有記到選了哪一個：' + JSON.stringify(qs[1]));
    if (!qs.every((q, i) => i === 1 || (q[0] === 1 && q[1] === 0 && q[4] > 0))) e.push('答對的題目沒有記到速度：' + JSON.stringify(qs));
  }
  n += 4;
  /* ⑦ 沒有網路：先存平板，連上網補送 */
  OFF = true;
  await p.click('#tqAgain'); await p.waitForTimeout(300);
  const b2 = G.books['紀錄'].d.length;
  await quiz(p, -1, true); await p.waitForTimeout(1500);
  await p.click('#scNx'); await p.waitForTimeout(300);
  /* 送不出去會再試 3 次（每次隔 1.5 秒），之後才寫「沒有網路」；榮譽動畫第 2 段（約 8 秒）早就好了 */
  await p.waitForFunction(() => /沒有網路/.test((document.getElementById('scn') || {}).textContent || ''), null, { timeout: 14000 }).catch(() => {});
  const off = await p.evaluate(() => ({ t: document.getElementById('scn').textContent, q: JSON.parse(localStorage.getItem('score_q') || '[]').length }));
  if (!/沒有網路/.test(off.t) || !/成績先存在這台平板/.test(off.t)) e.push('沒有網路時練習時間那一張沒有寫「現在沒有網路，成績先存在這台平板」（' + off.t.slice(0, 30) + '）');
  if (off.q !== 1) e.push('沒有網路時平板裡沒有存著那一筆（' + off.q + '）');
  OFF = false; await p.evaluate(() => window.dispatchEvent(new Event('online'))); await p.waitForTimeout(800);
  if (G.books['紀錄'].d.length !== b2 + 1) e.push('連上網以後沒有自動補送');
  if (await p.evaluate(() => JSON.parse(localStorage.getItem('score_q') || '[]').length)) e.push('補送以後平板裡還留著');
  n += 4;
  /* ⑧ 換人 */
  await p.evaluate(() => { tqClose(); }); await p.click('#tqGo'); await p.waitForTimeout(300); await p.click('#scSwap'); await p.waitForTimeout(300);
  if (!await p.$('#scBox')) e.push('〔換人〕沒有回到登入畫面');
  n++;
  /* ⑧ 👀 看字卡、按 🔊 也算練習時間（2026-10-15 D 第 8 件，D12 ②）：兩次點最多 2 分鐘、3 分鐘沒點不算、作答中不算；存成 m:'v' */
  await p.evaluate(me => { $('#rv').classList.remove('on'); document.body.classList.remove('tqon'); SCID = me; SCGUEST = false; }, P.me);   /* 前面量到最後是登出的 ➜ 再登入 */
  const vw = await p.evaluate(() => { const V = SCVW; if (!V) return null; V.acc = 0; V.busy = false; V.id = SCID; const r = [];
    V.last = Date.now() - 30000; scVwAct(); r.push(V.acc); V.last = Date.now() - 170000; scVwAct(); r.push(V.acc); V.last = Date.now() - 200000; scVwAct(); r.push(V.acc);
    document.body.classList.add('tqon'); $('#rv').classList.add('on'); V.last = Date.now() - 30000; scVwAct(); r.push(V.acc);
    document.body.classList.remove('tqon'); $('#rv').classList.remove('on'); V.last = Date.now() - 30000; scVwAct(); r.push(V.acc); V.last = Date.now() - 30000; scVwAct(); r.push(V.acc);
    return { r: r.map(x => Math.round(x / 1000)), a: V.a, why: [scLive(), document.hidden, scOn(), [].map.call(document.querySelectorAll('.scfull.on'), x => x.id).join()].join('/') }; });
  if (!vw) e.push('句型卡頁沒有接上「看字卡算時間」（scViewOn）');
  else { if (vw.r.join() !== '30,150,150,150,150,180') e.push('看字卡的秒數不對（要 30、＋最多 120、超過 3 分鐘 0、作答中 0、作答完那一下 0、再 30）：' + vw.r.join() + '（' + vw.why + '）');
    const bv = G.books['紀錄'].d.length; await p.evaluate(() => scVwSave()); await p.waitForTimeout(1200);
    const rv = G.books['紀錄'].d.slice(bv).map(SC.fromRow);
    if (rv.length !== 1 || rv[0].m !== 'v' || rv[0].set !== 'g' + P.me.charAt(0) + 'v_' + vw.a || rv[0].sec !== 180 || rv[0].src !== P.src || rv[0].id !== P.me) e.push('看字卡送出去的不對：' + JSON.stringify(rv.map(r => [r.m, r.set, r.sec, r.src, r.id])));
    const lo = await p.evaluate(() => { scOut(); const V = SCVW; V.last = Date.now() - 30000; scVwAct(); return V.acc; });
    if (lo) e.push('登出了還在算看字卡的時間'); }
  n += 4;
  out(W, e); await ctx.close();
}
async function teacher(br, vp) {
  const G = make({ TEACHER_PW: PW }); seed(G, 3); seed(G, 4); seedGame(G, 'g3gm_g1');
  G.post({ a: 'rec', r: { id: '30411', set: 'g3gm_g6', name: 'm', m: 'mem', mp: 9, mw: 4, sec: 180, raw: 3000, src: 'school', dev: 'x', u: 'mem', t: Date.now() - 6e5, qs: [] } });
  G.books['班級人數'].d[1][1] = 25;
  G.post({ a: 'rec', r: { id: '30411', set: 'g3v_u1', name: '👀 句型卡 Unit 1', m: 'v', sec: 600, src: 'home', dev: 'x', u: 'view1', t: Date.now() - 5e5, qs: [] } });   /* 看字卡 10 分鐘（2026-10-15） */
  /* 2026-10-09 名單（假的名字）：304 班有做的人＋一個這週一次都沒做的 30 號 */
  const did = [...new Set(G.books['紀錄'].d.slice(1).map(r => String(r[CI['5碼']])).filter(id => id.slice(0, 3) === '304'))];
  did.forEach(id => G.books['名單'].d.push(['304', +id.slice(3), '測試' + id.slice(3)])); G.books['名單'].d.push(['304班', '30', '沒做小明']);
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, acceptDownloads: true }); await route(ctx, G);
  const p = await ctx.newPage(), e = [], W = 'teacher/index.html @' + vp.join('x');
  p.on('pageerror', x => e.push('JS 例外：' + x.message));
  await p.goto(HTTP + '/teacher/index.html'); await p.waitForTimeout(300);
  const html = fs.readFileSync(path.join(ROOT, 'teacher/index.html'), 'utf8');
  if (html.indexOf(PW) >= 0) e.push('密碼寫進網頁了');
  await p.fill('#pw', 'wrong'); await p.click('#go'); await p.waitForTimeout(300);
  if (!/密碼不對/.test(await p.textContent('#lmsg'))) e.push('密碼錯沒有擋下來');
  await p.fill('#pw', PW); await p.click('#go'); await p.waitForTimeout(500);
  if (await p.isHidden('#app')) { e.push('密碼對了還是進不去'); out(W, e); await ctx.close(); return; }
  const ox = () => p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const tiles = await p.evaluate(() => [].map.call(document.querySelectorAll('.tile .v'), x => x.textContent));
  if (tiles.length !== 4) e.push('不是四個大數字');
  if (tiles[3] !== '15／25') e.push('👥 有做的人不是 15／25（' + tiles[3] + '）');
  n += 5;
  for (const t of ['p', 'b', 'c', 'w', 'k', 'l']) {
    await p.click('#tabs button[data-t="' + t + '"]'); await p.waitForTimeout(150);
    const r = await p.evaluate(() => ({ t: document.getElementById('pane').textContent, small: [].filter.call(document.querySelectorAll('#pane td,#pane .br,#pane button,#pane .kc span,#pane .kp,#pane .note,#pane h3,.tile .k,.tile .d,#tabs button'), x => x.getBoundingClientRect().width && parseFloat(getComputedStyle(x).fontSize) < (innerWidth >= 1900 ? 22 : 16)).length, old: /⚡|🔁|🚀|秒按/.test(document.getElementById('pane').textContent + document.getElementById('tiles').textContent) }));
    if ((await ox()) > 0) e.push('分頁 ' + t + ' 橫向溢出');
    if (r.small) e.push('分頁 ' + t + ' 有 ' + r.small + ' 個字太小（觸控螢幕要 ≧ 22px、iPad ≧ 16px）');
    if (r.old && t !== 't' && t !== 'w') e.push('分頁 ' + t + ' 還有看不懂的舊圖示（⚡🔁🚀／秒按）');
    if (r.t.length < 20) e.push('分頁 ' + t + ' 是空的');
    n += 3;
  }
  /* 2026-10-12 D 第 7 件：〔🔒 開關〕在家複習每一個主題（三年級 19 個）；按一下 ＝ 鎖、存到伺服器；只選 304 再開 ＝ 黃色「只有 307、311 鎖」 */
  await p.click('#tabs button[data-t="l"]'); await p.waitForTimeout(200);
  const lk0 = await p.evaluate(() => ({ n: document.querySelectorAll('#pane .lkb').length, g: document.querySelectorAll('#pane .lkb.lkg').length }));
  if (lk0.n !== 19 || lk0.g !== 19) e.push('〔🔒 開關〕三年級應該 19 個主題、一開始全部綠色（' + lk0.n + '／' + lk0.g + '）');
  await p.click('#pane [data-lk="g3rv_gm-g3"]'); await p.waitForTimeout(500);
  const lk1 = await p.evaluate(() => ({ r: !!document.querySelector('#pane [data-lk="g3rv_gm-g3"].lkr'), m: document.getElementById('lkmsg').textContent }));
  const sv = JSON.parse(G.P.LOCKS || '{}');
  if (!lk1.r || !/存好了/.test(lk1.m)) e.push('按了沒有變紅色、沒有「✔ 存好了」（' + lk1.m + '）');
  if (['304', '307', '311'].some(c => (sv[c] || []).indexOf('g3rv_gm-g3') < 0)) e.push('伺服器沒有存到三班都鎖：' + JSON.stringify(sv));
  await p.click('#pane [data-lkc="307"]'); await p.click('#pane [data-lkc="311"]'); await p.click('#pane [data-lk="g3rv_gm-g3"]'); await p.waitForTimeout(500);
  const lk2 = await p.evaluate(() => (document.querySelector('#pane [data-lk="g3rv_gm-g3"]') || {}).textContent || '');
  if (!/只有 307、311 鎖/.test(lk2)) e.push('只開 304 班以後應該寫「只有 307、311 鎖」：' + lk2);
  await p.click('#pane [data-lkc="*"]'); await p.click('#pane [data-lka="0"]'); await p.waitForTimeout(500);
  if (Object.keys(JSON.parse(G.P.LOCKS || '{}')).length) e.push('〔🔓 全部開〕沒有全部打開');
  if ((await ox()) > 0) e.push('〔🔒 開關〕橫向溢出');
  n += 6;
  await p.click('#tabs button[data-t="b"]'); await p.click('[data-bs="grade"]'); await p.click('[data-bt="acc"]');
  const rkT = await p.textContent('#pane'); if (!/第 15 名/.test(rkT)) e.push('老師的排行榜沒有列出全部學生（看不到第 15 名）');
  if (!/測試\d\d/.test(rkT)) e.push('排行榜沒有姓名');
  /* 2026-10-12 D 第 4 件：🏆 榮譽榜（投影）：每一個榜一顆、全螢幕、12 種風格之一、字夠大、▶ 下一幕、姓名顯示／隱藏、印獎狀、班際 */
  await p.evaluate(() => { window.print = () => { window.__pr = (window.__pr || 0) + 1; }; });
  await p.click('[data-bt="s"]'); await p.waitForTimeout(150); if (await p.$('[data-hon]')) e.push('💯 總分（沒有獎）不應該有〔🏆 榮譽榜〕');
  await p.click('[data-bt="care"]').catch(() => e.push('排行榜沒有〔🏆 最用心〕（D12 ⑥）')); await p.waitForTimeout(150);
  if (!/用心程度 \d+ 分/.test(await p.textContent('#pane')) || !await p.$('[data-hon]')) e.push('〔🏆 最用心〕沒有「用心程度 N 分」或沒有〔🏆 榮譽榜〕');
  await p.click('[data-bt="sec"]'); await p.waitForTimeout(150);
  if (!await p.$('[data-hon="0"]')) e.push('排行榜沒有〔🏆 榮譽榜〕');
  else {
    await p.click('[data-hon="0"]'); await p.waitForTimeout(1200);
    const hn = () => p.evaluate(() => { const o = document.getElementById('honov'), h = document.getElementById('honst'), r = o.getBoundingClientRect(), e = [];
      [].forEach.call(h.querySelectorAll('.hkick,.htit,.hsub,.hcard .hn,.hcard .hl,.hcard .hw,.hr,.hpod .nm'), x => { const z = parseFloat(getComputedStyle(x).fontSize); if (z < (innerWidth >= 1900 ? 26 : 20)) e.push('字太小 ' + z + 'px'); });
      [].forEach.call(document.querySelectorAll('#hctl button'), x => { if (x.getBoundingClientRect().height < 48) e.push('按鈕太小：' + x.textContent); });
      return { on: o.classList.contains('on'), full: r.width >= innerWidth - 2 && r.height >= innerHeight - 2, cls: h.className, t: h.textContent, pg: document.getElementById('hpg').textContent, e: e,
        over: document.getElementById('hctl').getBoundingClientRect().bottom > innerHeight + 1 }; });
    let h = await hn();
    if (!h.on || !h.full) e.push('〔🏆 榮譽榜〕沒有蓋滿整個螢幕');
    if (!/\bhs\d+\b/.test(h.cls)) e.push('榮譽榜沒有風格');
    if (!/榮譽榜/.test(h.t) || !/本週/.test(h.t)) e.push('榮譽榜開場不對：' + h.t.slice(0, 40));
    if (h.over) e.push('榮譽榜下面的按鈕超出螢幕');
    const seen = [h.t]; h.e.forEach(x => e.push('榮譽榜開場：' + x));
    const tot = +h.pg.split('／')[1];
    for (let i = 1; i < tot; i++) { await p.click('#hnx'); await p.waitForTimeout(i === 2 ? 4800 : 1400); h = await hn(); seen.push(h.t); h.e.forEach(x => e.push('榮譽榜第 ' + (i + 1) + ' 幕：' + x)); }
    const all = seen.join('|');
    if (!/第 1 名/.test(all) || !/最認真練習/.test(all) || !/這週 練習 \d+ (秒|分鐘)/.test(all) || !/🏆 本週 榮譽榜/.test(all)) e.push('榮譽榜沒有「🏆 本週 榮譽榜」「最認真練習」第 1 名「這週 練習 N 分鐘」（' + tot + ' 幕）');
    if (/一起練了|進步之星|努力獎|時間獎|每一題都看完/.test(all)) e.push('榮譽榜還有拿掉的東西（全班合照、進步之星、小獎）');
    if (!/測試\d\d/.test(all)) e.push('榮譽榜一開始沒有顯示姓名（D10：預設顯示）');
    if (/聰明/.test(all)) e.push('榮譽榜寫了「聰明」');
    await p.click('#hnmb'); await p.waitForTimeout(400);
    if (/測試\d\d/.test((await hn()).t)) e.push('按〔👤 姓名：隱藏〕還看得到姓名');
    await p.click('#hnmb'); await p.waitForTimeout(200);
    const s0 = await p.evaluate(() => localStorage.getItem('hsnd')); await p.click('#hsd'); const s1 = await p.evaluate(() => localStorage.getItem('hsnd'));
    if (s0 === s1) e.push('〔🔊 聲音〕按了沒有切換'); await p.click('#hsd');
    await p.click('#hpr'); await p.waitForTimeout(200);
    const pr = await p.evaluate(() => { const c = document.querySelector('#prt .cert'); return { n: document.querySelectorAll('#prt .cert').length, t: document.getElementById('prt').textContent, pr: window.__pr,
      w: c ? c.querySelector('.cw').textContent : '', css: [].map.call(document.styleSheets, x => { try { return [].map.call(x.cssRules, r => r.cssText).join(' ') } catch (e) { return '' } }).join(' ') }; });
    /* 2026-10-15 D11 第 2 題 甲、第 3 題 A：「榮譽狀／測試11（名字最大）／三年級 最認真練習 第 1 名／這週 練習 4 分鐘」；刪榮獲、引號、號碼；字體 標楷體（D12 ⑤） */
    if (!pr.pr || pr.n < 1 || !/榮 譽 狀/.test(pr.t) || !/(\d{3} 班|[三四]年級) (最認真練習|成績最優) 第 1 名/.test(pr.t) || !/這週 練習/.test(pr.t)) e.push('〔🖨 印獎狀〕不對（' + pr.n + ' 張）：' + pr.t.slice(0, 80));
    if (/榮獲|「|\d{5}/.test(pr.t) || !/^測試\d\d$/.test(pr.w)) e.push('獎狀沒有精簡（還有榮獲、引號、號碼，或名字那一行不是只有名字：' + pr.w + '）');
    if (!/\.cert\s*\{[^}]*font-family:[^}]*標楷體/.test(pr.css)) e.push('獎狀字體不是標楷體');
    await p.click('#hx'); await p.waitForTimeout(200);
    if (await p.$('#honov.on')) e.push('〔✕ 關閉〕沒有關掉榮譽榜');
    await p.click('#tabs button[data-t="c"]'); await p.waitForTimeout(200);
    if (!await p.$('[data-hon="c"]')) e.push('班際沒有〔🏆 班際榮譽榜〕');
    else { await p.click('[data-hon="c"]'); await p.waitForTimeout(600); h = await hn(); const tc = +h.pg.split('／')[1], ct = [h.t];
      for (let i = 1; i < tc; i++) { await p.click('#hnx'); await p.waitForTimeout(1200); ct.push((await hn()).t); }
      const cj = ct.join('|');
      if (!/最用心的班/.test(cj) || !/平均每一個人 用心程度 \d+ 分/.test(cj)) e.push('班際榮譽榜沒有「最用心的班」（D12 ④）');
      if (!/最認真練習的班/.test(cj) || !/成績最優的班/.test(cj) || !/平均每一個人 練習/.test(cj)) e.push('班際榮譽榜沒有三種（最認真練習的班、成績最優的班…）：' + cj.slice(0, 80));
      if (/每一班都有自己最強的一項|最努力/.test(cj)) e.push('班際榮譽榜還有拿掉的「每一班都有自己最強的一項」或舊的「最努力」');
      await p.click('#hx'); }
    n += 14;
  }
  /* 2026-10-09 名單：個人表有「姓名」欄、要關心列出一次都沒做的人 */
  await p.click('#tabs button[data-t="p"]'); await p.waitForTimeout(150);
  const pt = await p.evaluate(() => ({ th: [].map.call(document.querySelectorAll('#pane th'), x => x.textContent), td: document.getElementById('pane').textContent }));
  if (!/姓名/.test(pt.th[0]) || !/測試\d\d/.test(pt.td)) e.push('個人表沒有姓名欄');
  /* 2026-10-12 D6-A：7 欄、燈號、排序那一欄金色＋寫怎麼排；D5：〔A＋〕真的放大 */
  if (pt.th.length !== 7) e.push('個人表不是 7 欄（' + pt.th.length + '）');
  if (!/全年級名次/.test(pt.th.join()) || /本班名次/.test(pt.th.join())) e.push('個人表還是「本班名次」（D12 ⑥：改全年級名次）');
  if (!/[🔴🟡🟢]/.test(pt.td)) e.push('個人表沒有燈號');
  if (!/高的在上面/.test(pt.th.join())) e.push('排序的那一欄沒有寫「高的在上面」');
  const z0 = await p.evaluate(() => document.getElementById('app').getBoundingClientRect().height); await p.click('#zi'); await p.waitForTimeout(150);
  const z1 = await p.evaluate(() => ({ h: document.getElementById('app').getBoundingClientRect().height, z: localStorage.getItem('tzoom') }));
  if (!(z1.h > z0) || z1.z !== '1.1') e.push('〔A＋〕沒有放大（' + JSON.stringify(z1) + '）');
  await p.click('#zo'); await p.waitForTimeout(150); n += 5;
  await p.click('#tabs button[data-t="k"]'); await p.waitForTimeout(150);
  /* 2026-10-12 D 第 5 件：一班一張表、照座號一格一格（號碼＋姓名＋燈號），沒做的人也有一格（⚪），點一格 ＝ 成績卡 */
  await p.waitForTimeout(1200); if (process.env.KSHOT) await p.screenshot({ path: process.env.KSHOT + vp[0] + '.png', fullPage: true });   /* 只拍照片 */
  const kk = await p.evaluate(() => {
    const S = [].map.call(document.querySelectorAll('.kcls'), s => ({ h: s.querySelector('h3').textContent,
      c: [].map.call(s.querySelectorAll('.kc'), c => ({ id: c.querySelector('b').textContent, n: c.querySelector('.kn').textContent, w: c.querySelector('.kw').textContent, k: c.className,
        r: c.getBoundingClientRect(), o: c.scrollWidth > c.clientWidth + 1, op: +getComputedStyle(c).opacity })) }));
    return { S: S, lg: !!document.querySelector('.klg'), W: innerWidth };
  });
  const s304 = kk.S.find(s => /^304/.test(s.h));
  if (!kk.lg) e.push('要關心沒有圖例（🔴🟡🟢⚪）');
  if (!s304) e.push('要關心沒有 304 班的表');
  else {
    const ids = s304.c.map(c => c.id);
    if (ids.join() !== ids.slice().sort().join()) e.push('要關心 304 班不是照座號排');
    if (new Set(ids).size !== ids.length) e.push('要關心 304 班同一個人有兩格');
    const z = s304.c.find(c => c.id === '30430');
    if (!z || z.n !== '沒做小明' || !/⚪/.test(z.w) || !/nd/.test(z.k)) e.push('要關心：名單上一次都沒做的 30430 沒做小明沒有 ⚪ 那一格');
    if (!/⚪ 還沒做 1/.test(s304.h.replace(/\s+/g, ' '))) e.push('要關心 304 班標題沒有寫「⚪ 還沒做 1」（' + s304.h + '）');
    if (s304.c.some(c => c.id !== '30430' && !/測試\d\d/.test(c.n))) e.push('要關心有做的人沒有姓名');
    if (s304.c.some(c => !/[🔴🟡🟢⚪]/.test(c.w))) e.push('要關心有格子沒有燈號');
  }
  if (kk.S.some(s => s.c.some(c => c.o || c.r.right > kk.W || c.r.height < 52 || c.op < .99))) e.push('要關心的格子超出、太矮、或動畫沒有跑完' + JSON.stringify(kk.S.flatMap(s => s.c).filter(c => c.o || c.r.right > kk.W || c.r.height < 52 || c.op < .99).slice(0, 2).map(c => [c.id, c.w, c.o, Math.round(c.r.right), Math.round(c.r.height), c.op])));
  await p.click('.kc[data-pid="30430"]'); await p.waitForTimeout(200);
  if (!/30430/.test(await p.textContent('#mbox h3').catch(() => ''))) e.push('要關心點一格沒有打開成績卡');
  await p.click('#mx').catch(() => {}); await p.waitForTimeout(100);
  /* 2026-10-15 D 第 8 件：有做的格子多一行「❤獎牌 用心 N」；D12 ⑥〔📊 圖表分析〕：全班整體＋每一個人（要關心的排最前面） */
  if (s304 && s304.c.some(c => c.id !== '30430' && !/用心 \d+/.test(c.w + ''))) { const kh = await p.$$eval('.kcls .kc:not(.nd) .kh', a => a.length); if (!kh) e.push('要關心的格子沒有「用心 N」'); }
  await p.click('[data-km="a"]'); await p.waitForTimeout(1500);
  const ka = await p.evaluate(() => { const S = document.querySelector('.kcls'); return { a4: S ? S.querySelectorAll('.ka4 > div').length : 0, st: S ? S.querySelectorAll('.kst span').length : 0, c5: S ? S.querySelectorAll('.kc5 > div').length : 0,
    g: [].map.call(document.querySelectorAll('.kcls'), s => [].map.call(s.querySelectorAll('.kr:not(.kth)'), r => r.className.replace('kr ', ''))),
    small: [].filter.call(document.querySelectorAll('#pane .ka4 div,#pane .kc5 div,#pane .kr,#pane .kgh,#pane .kst span'), x => x.getBoundingClientRect().width && parseFloat(getComputedStyle(x).fontSize) < (innerWidth >= 1900 ? 22 : 16)).length,
    over: [].filter.call(document.querySelectorAll('#pane *'), x => x.getBoundingClientRect().right > innerWidth + 1).length, mem: localStorage.getItem('kmode') }; });
  const rank = { no: 0, nd: 1, md: 2, ok: 3 };
  if (ka.a4 !== 4 || !ka.st || ka.c5 !== 5) e.push('〔📊 圖表分析〕沒有全班整體（四個大數字 ' + ka.a4 + '、燈號長條 ' + ka.st + '、用心五項 ' + ka.c5 + '）');
  if (!ka.g.length || ka.g.some(L => L.map(x => rank[x]).some((v, i, a) => i && v < a[i - 1]))) e.push('〔📊 圖表分析〕每一個人不是 🔴 ➜ ⚪ ➜ 🟡 ➜ 🟢 排（' + JSON.stringify(ka.g[0]) + '）');
  if (ka.small) e.push('〔📊 圖表分析〕有 ' + ka.small + ' 個字太小');
  if (ka.over) e.push('〔📊 圖表分析〕有 ' + ka.over + ' 個東西超出螢幕右邊');
  if (ka.mem !== 'a') e.push('〔📊 圖表分析〕沒有記在這台電腦');
  await p.click('.kr:not(.kth):not(.nd)'); await p.waitForTimeout(200);
  if (!await p.$('#modal.on .care')) e.push('〔📊 圖表分析〕點一個人沒有打開成績卡');
  await p.click('#mx').catch(() => {}); await p.click('[data-km="g"]'); await p.waitForTimeout(200);
  n += 17;
  /* 個人 ➜ 作廢 */
  await p.click('#tabs button[data-t="p"]'); await p.click('tr.row'); await p.waitForTimeout(150);
  if (!/測試\d\d/.test(await p.textContent('#mbox h3'))) e.push('個人紀錄的標題沒有姓名');
  /* 2026-10-12 D 第 3 件：秒懂成績卡（四個大圖、最拿手／要加油、哪幾天有練、每一組的變化、最常錯的 3 題、明細收起來） */
  await p.waitForTimeout(1700);
  const pc = await p.evaluate(() => { const m = document.getElementById('mbox'), T = m.textContent;
    return { g: m.querySelectorAll('.pc4 .pg').length, ring: m.querySelectorAll('.pc4 .ring').length, cal: m.querySelectorAll('.cal .cw span').length, on: m.querySelectorAll('.cal .cw span.on').length,
      ch: !!m.querySelector('#pch svg circle'), hl: /最拿手/.test(T) && /要加油/.test(T), w: /最常錯的 3 題/.test(T), neg: /進步[^]*?－|進步[^]*?-\d/.test(m.querySelector('.pc4').textContent),
      det: document.getElementById('pdet').hidden, old: /⚡|🔁|🚀|秒按/.test(m.querySelector('.pc4').textContent + [].map.call(m.querySelectorAll('h3:not(#pdet h3)'), x => x.textContent).join()),
      small: [].filter.call(m.querySelectorAll('h3,.note,.pk,.pd,.sb2,.cw span,.pcn b,.pw,button,.pa span'), x => x.getBoundingClientRect().width && parseFloat(getComputedStyle(x).fontSize) < (innerWidth >= 1900 ? 22 : 16)).length,
      over: [].filter.call(m.querySelectorAll('*'), x => !x.closest('.cfx') && !x.closest('.care svg') && x.getBoundingClientRect().right > innerWidth + 1).map(x => x.tagName + '.' + (x.getAttribute('class') || '') + '@' + Math.round(x.getBoundingClientRect().right)).join(' '),   /* 動畫的小亮點在 overflow:hidden 裡面，看不到 */
      rk: getComputedStyle(m.querySelector('.ring .fg')).strokeDashoffset };
  });
  /* SHOT=路徑 ＝ 只拍成績卡的照片給人看（會加假紀錄、改期間，所以這時後面的項目會失敗，不算量測） */
  if (process.env.SHOT) { await p.evaluate(() => { const b = ALL.filter(x => x.id === PID && x.m === 'q')[0], ws = SC.weekStart(DATA.now);
    [[-9, 40, 2], [-6, 60, 3], [-3, 60, 3], [-1, 80, 4]].forEach((a, i) => ALL.push(Object.assign({}, b, { t: ws + a[0] * 864e5 + 36e6, acc: a[1], ok: a[2], u: 'shot' + i, qs: b.qs.map((q, j) => j < 5 - a[2] ? [0, 2, 3, 0, 0, j] : q) })));
    F.p = 'all'; person(PID); }); await p.waitForTimeout(1800); }
  if (process.env.SHOT) { await p.evaluate(() => document.getElementById('pch').scrollIntoView()); await p.waitForTimeout(1500); await p.screenshot({ path: process.env.SHOT + '_' + vp[0] + '.png' }); }
  if (pc.g !== 4 || pc.ring !== 2) e.push('成績卡不是四個大圖（' + pc.g + '／圓圈 ' + pc.ring + '）');
  if (parseFloat(pc.rk) >= 314) e.push('成績卡的圓圈沒有轉上去');
  if (pc.cal % 7 || !pc.on) e.push('成績卡「哪幾天有練」不對（' + pc.cal + ' 格、亮 ' + pc.on + ' 格）');
  if (!pc.ch) e.push('成績卡沒有「每一組的變化」折線圖');
  if (!pc.hl) e.push('成績卡沒有「最拿手／要加油」');
  if (!pc.w) e.push('成績卡沒有「最常錯的 3 題」');
  if (!pc.det) e.push('明細沒有收起來（要放在最下面〔📋 看全部明細〕）');
  if (pc.old) e.push('成績卡還有看不懂的舊圖示');
  if (pc.small) e.push('成績卡有 ' + pc.small + ' 個字太小');
  if (pc.over) e.push('成績卡有東西超出螢幕右邊：' + pc.over.slice(0, 120));
  /* 2026-10-15 D 第 8 件：成績卡的 ❤ 用心程度 ＝ 跟平板同一個動畫（五顆愛心、數字加上去、最少的那一項閃）＋〔📖 說明〕 */
  await p.waitForTimeout(5200);
  const cr = await p.evaluate(() => { const c = document.querySelector('#mbox .care'); if (!c) return null; return { h: c.querySelectorAll('.chc').length, on: c.querySelectorAll('.chc.on').length, n: c.querySelector('.cn').textContent,
    tip: c.querySelector('.ctip').classList.contains('on'), cs: /\bcs[1-8]\b/.test(c.className), t: c.querySelector('.ct1').textContent }; });
  if (!cr) e.push('成績卡沒有 ❤ 用心程度');
  else { if (cr.h !== 5 || cr.on !== 5 || !cr.tip || !cr.cs) e.push('成績卡的用心程度動畫沒有演完（' + JSON.stringify(cr) + '）');
    if (!/^這週 用心程度$/.test(cr.t)) e.push('成績卡用心程度的標題不對：' + cr.t);
    await p.click('#mbox .chb'); await p.waitForTimeout(1800);
    const hp = await p.evaluate(() => { const P = document.querySelector('#mbox .chp'); return { v: !P.hidden, r: P.querySelectorAll('.chr.on').length, t: P.textContent,
      small: [].filter.call(P.querySelectorAll('.chr b,.chr small,.chk,.chbar em'), x => parseFloat(getComputedStyle(x).fontSize) < (innerWidth >= 1900 ? 20 : 16)).length,
      over: [].filter.call(P.querySelectorAll('*'), x => x.getBoundingClientRect().right > innerWidth + 1).length }; });
    if (!hp.v || hp.r !== 5 || !/／20/.test(hp.t) || !/(✅ 很用心|💡 請)/.test(hp.t)) e.push('〔📖 說明〕沒有五項（' + hp.r + '）');
    if (hp.small || hp.over) e.push('〔📖 說明〕字太小 ' + hp.small + '、超出 ' + hp.over); }
  n += 5;
  const nb = await p.$$('#pcx:not([disabled])');
  if (nb.length) { const t0 = await p.textContent('.pcn b'); await p.click('#pcx'); if (t0 === await p.textContent('.pcn b')) e.push('按 ▶ 沒有換下一組'); }
  await p.click('#pdb'); await p.waitForTimeout(100);
  if (!await p.$('#modal.on #pdet:not([hidden]) .svgl')) e.push('按〔📋 看全部明細〕沒有出現每一次的紀錄');
  n += 12;
  const vu = await p.getAttribute('[data-void]', 'data-void'); await p.click('[data-void]'); await p.waitForTimeout(300);
  const row = G.books['紀錄'].d.filter(r => r[CI['編號']] === vu)[0];
  if (!row || row[CI['作廢']] !== true) e.push('按〔🚫 作廢〕伺服器沒有打勾');
  if (!await p.$('#pdet:not([hidden])')) e.push('作廢以後明細又收起來了');
  await p.click('#mx');
  /* 錯題 ➜ 選項分布 ➜ 全班訂正 */
  await p.click('#tabs button[data-t="w"]'); await p.waitForTimeout(150);
  if (!await p.$('.wq')) e.push('錯題分頁沒有題目');
  else {
    await p.click('.wq'); await p.waitForTimeout(150);
    const d = await p.evaluate(() => ({ o: document.querySelectorAll('#mbox .opt').length, mis: !!document.querySelector('#mbox .opt.mis'), why: !!document.querySelector('#mbox .why'), t: document.getElementById('mbox').textContent }));
    if (d.o !== 4 || !d.mis || !d.why) e.push('錯題詳細：要有四個選項的 %、最多人選的錯答案、為什麼');
    if (/最常見的誤會|哪一個唸的是它/.test(d.t) || !/👥 最多人選的錯答案/.test(d.t)) e.push('錯題詳細的字眼不是 D18 A（👥 最多人選的錯答案）');
    /* 2026-10-15 D 第 9 件：一步一步 ① 想一想 ➜ ② 大家選什麼 ➜ ③ 錯在哪裡 ➜ ④ 正確答案；字放大（觸控螢幕題目 ≧ 40px、選項 ≧ 36px） */
    await p.click('#sh'); await p.waitForTimeout(300);
    for (let s = 0; s < 4; s++) {
      const f = await p.evaluate(() => { const x = document.getElementById('show'), z = q => parseFloat(getComputedStyle(document.querySelector(q)).fontSize);
        return { over: x.scrollHeight > x.clientHeight + 1 ? x.scrollHeight - x.clientHeight : 0, n: document.querySelectorAll('#show .so > div').length, st: (document.querySelector('#show .sst .on') || {}).textContent || '', q: z('#show .sq'), o: z('#show .so > div'), W: innerWidth }; });
      if (f.over || f.n !== 4) e.push('全班訂正第 ' + (s + 1) + ' 步放不下或不是四個選項（' + f.over + '／' + f.n + '）');
      if (!new RegExp('^' + (s + 1) + ' ').test(f.st)) e.push('全班訂正第 ' + (s + 1) + ' 步，上面的步驟沒有亮對（' + f.st + '）');
      if (f.q < (f.W >= 1900 ? 40 : 28) || (s < 3 && f.o < (f.W >= 1900 ? 36 : 24))) e.push('全班訂正的字不夠大（題目 ' + f.q + 'px、選項 ' + f.o + 'px）');
      if (s === 0 && !await p.$('#show .stm i')) e.push('第 ① 步沒有「想一想」的動畫');
      if (s === 1) { await p.waitForTimeout(1600); if (!await p.evaluate(() => [].some.call(document.querySelectorAll('#show .pb i'), i => parseFloat(i.style.width) > 0))) e.push('第 ② 步長條沒有長出來'); }
      if (s === 2 && !await p.$('#show .so div.mis.go')) e.push('第 ③ 步最多人選的錯答案沒有搖一搖');
      if (s < 3) { await p.click('#sn'); await p.waitForTimeout(300); }
    }
    await p.waitForTimeout(1300);
    const an = await p.evaluate(() => { const a = document.getElementById('sans'), z = a ? parseFloat(getComputedStyle(a.querySelector('b')).fontSize) : 0;
      return { ok: !!document.querySelector('#show .so div.ok.go'), a: !!a, w: a ? a.querySelectorAll('span').length : 0, zh: a ? [].filter.call(a.querySelectorAll('span'), s => s.querySelector('i').textContent.trim()).length : 0,
        big: a ? a.classList.contains('big') : false, z, W: innerWidth, az: !!document.querySelector('#show .saz') }; });
    if (!an.ok) e.push('全班訂正最後沒有亮出正解');
    if (!an.a || !an.w || !an.zh) e.push('正確答案沒有「每一個英文字下面寫中文」（' + JSON.stringify(an) + '）');
    if (!an.big) e.push('正確答案唸的時候沒有放大變亮');
    if (an.z < (an.W >= 1900 ? 60 : 44)) e.push('正確答案的英文不夠大（' + an.z + 'px）');
    await p.click('#sp'); await p.waitForTimeout(200);
    if (!/^3 /.test(await p.textContent('#show .sst .on'))) e.push('〔◀ 上一步〕沒有回到第 ③ 步');
    /* 聽力題：清單不寫聽到的那一句；認讀題 ＝ D18 A；題庫算好了正解的英文、逐字中文、語音檔 */
    const lq = await p.evaluate(() => { const Q = [].concat.apply([], Object.keys(BANK).map(k => BANK[k].qs)), L = Q.filter(q => isLsn(q) && q.o.indexOf(q.say) >= 0), R = Q.filter(q => q.k === 'read');
      return { leak: L.filter(q => qText(q).indexOf(q.say) >= 0).length, nl: L.length, rd: R.filter(q => !/^👀 .+　🔊 聽 1～4：哪一個號碼 唸的是 .+？$/.test(qText(q))).length,
        ae: Q.filter(q => q.ae).length, au: Q.filter(q => q.au).length, all: Q.length }; });
    if (!lq.nl || lq.leak) e.push('聽力題清單寫出了答案（' + lq.leak + '／' + lq.nl + '）');
    if (lq.rd) e.push('認讀題不是 D18 A 的寫法：' + lq.rd + ' 題');
    if (lq.ae < lq.all * .95 || lq.au < lq.all * .8) e.push('題庫的正解英文／語音檔太少（' + JSON.stringify(lq) + '）');
    await p.click('#sc');
  }
  n += 17;
  /* 類別篩選（📝 複習題／🎮 遊戲／📘 Review 1）＋遊戲的錯題 */
  await p.selectOption('#fk', 'game'); await p.click('#tabs button[data-t="w"]'); await p.waitForTimeout(150);
  const gw = await p.evaluate(() => [].map.call(document.querySelectorAll('.wq em'), x => x.textContent));
  if (!gw.length || !gw.every(x => /遊戲/.test(x))) e.push('類別選 🎮 遊戲，錯題沒有只剩遊戲的題目：' + gw.slice(0, 2).join('／'));
  else { await p.click('.wq'); await p.waitForTimeout(150);
    const d = await p.evaluate(() => ({ o: document.querySelectorAll('#mbox .opt').length, ok: !!document.querySelector('#mbox .opt.ok'), t: document.getElementById('mbox').textContent }));
    if (d.o < 2 || !d.ok || !/第一次作答/.test(d.t)) e.push('遊戲錯題詳細：要有選項的 %、正解、寫「只算第一次作答」');
    await p.click('#mx'); }
  await p.click('#tabs button[data-t="p"]'); await p.click('tr.row[data-id="30411"]'); await p.waitForTimeout(150);
  if (!/配完幾對/.test(await p.textContent('#mbox'))) e.push('個人紀錄看不到 🃏 記憶配對的配完幾對');
  await p.click('#mx'); await p.selectOption('#fk', '');
  n += 3;
  /* 學生排行榜 開／關 */
  await p.click('#bd'); await p.waitForTimeout(200);
  if (G.P.BOARDS !== 'off') e.push('按〔學生排行榜〕伺服器沒有關掉');
  await p.click('#bd'); await p.waitForTimeout(200);
  /* ⬇ 一鍵下載 Excel */
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#dl')]);
  const f = path.join(require('os').tmpdir(), 'score_verify.xlsx'); await dl.saveAs(f);
  try { const o = cp.execFileSync('python3', ['-W', 'error', '-c', 'import openpyxl,sys;wb=openpyxl.load_workbook(sys.argv[1]);print("|".join(wb.sheetnames));print(wb["個人"].max_row);print(wb["個人"]["B1"].value,wb["原始紀錄"]["C1"].value,wb["排行榜"]["E1"].value)', f]).toString().trim().split('\n');
    if (o[0] !== '個人|排行榜|班際|錯題|原始紀錄') e.push('Excel 工作表不對：' + o[0]);
    if (+o[1] < 2) e.push('Excel 個人表是空的');
    if (o[2] !== '姓名 姓名 姓名') e.push('Excel 個人、原始紀錄、排行榜沒有姓名欄（' + o[2] + '）');
    if (!/^score_G3_week_\d{4}-\d\d-\d\d\.xlsx$/.test(dl.suggestedFilename())) e.push('Excel 檔名不對：' + dl.suggestedFilename());
  } catch (x) { e.push('Excel 打不開：' + String(x).slice(0, 200)); }
  n += 5;
  /* 2026-10-12 D3-A：沒勾「記住我」不存在這台電腦；〔🚪 登出〕回到密碼畫面；勾了 ➜ 重新打開不用打密碼；登入畫面字夠大 */
  const st = () => p.evaluate(() => ({ ls: localStorage.getItem('tpw7'), app: !document.getElementById('app').hidden }));
  if ((await st()).ls) e.push('沒勾「記住我」卻存進這台電腦');
  await p.click('#out'); await p.waitForTimeout(200);
  if ((await st()).app) e.push('按〔🚪 登出〕沒有回到密碼畫面');
  await p.reload(); await p.waitForTimeout(400);
  if ((await st()).app) e.push('登出以後重新打開還是進得去');
  const lz = await p.evaluate(() => ({ note: parseFloat(getComputedStyle(document.querySelector('#login .note')).fontSize), rm: parseFloat(getComputedStyle(document.getElementById('rmb')).fontSize), go: document.getElementById('go').getBoundingClientRect().height }));
  if (lz.note < 22 || lz.rm < 22 || lz.go < 60) e.push('登入畫面字或按鈕太小（' + JSON.stringify(lz) + '）');
  if (await ox()) e.push('登入畫面橫向溢出');
  await p.fill('#pw', PW); await p.check('#rm'); await p.click('#go'); await p.waitForTimeout(500);
  const r7 = await st(); if (!r7.app || !r7.ls) e.push('勾「記住我」登入以後沒有存起來');
  await p.evaluate(() => sessionStorage.clear()); await p.reload(); await p.waitForTimeout(600);
  if (!(await st()).app) e.push('勾了「記住我」重新打開還要打密碼');
  await p.evaluate(() => localStorage.setItem('tpw7', JSON.stringify({ p: 'x', x: Date.now() - 1 }))); await p.evaluate(() => sessionStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  if ((await st()).app || (await st()).ls) e.push('過了 7 天還記得密碼');
  n += 7;
  out(W, e); await ctx.close();
}
/* ══ 2026-10-08 對話 D：遊戲、Review 1 頁的 📝 複習也記成績 ══ */
const GPAGES = [
  { f: 'sentences/games.html', g: 4, src: 'school', game: 'g1', set: 'g4gm_g1', me: '40205', mem: 'g6' },
  { f: 'G3 - L1 + L2/games.html', g: 3, src: 'school', game: 'g1', set: 'g3gm_g1', me: '30405' },
  { f: 'g3-review/games.html', g: 3, src: 'home', game: 'g5', set: 'g3gm_g5', me: '30405' },
  { f: 'g4-review/games.html', g: 4, src: 'home', game: 'g4', set: 'g4gm_g4', me: '40205' },
  { f: 'review1/games.html', g: 0, src: 'school', game: 'i1_1', set: 'g4r1_i1_1', me: '40205', mem: 'a1_6' }
];
function seedGame(G, set) {
  const c = set.slice(0, 2) === 'g3' ? '304' : '402';
  for (let s = 1; s <= 12; s++) G.post({ a: 'rec', r: { id: c + String(s + 10).padStart(2, '0'), set, name: 's', m: 'g', raw: 9000, src: 'school', dev: 'x', u: 'gs' + set + s, t: Date.now() - 36e5,
    qs: Array.from({ length: 12 }, (_, i) => [i < 8 + (s % 5) ? 1 : 0, i < 8 + (s % 5) ? 0 : 1, 3, 0, .7, i]) } });
}
const ovFit = p => p.evaluate(() => { const o = document.getElementById('scov'), de = document.documentElement, e = [];
  if (de.scrollWidth > de.clientWidth + 1) e.push('橫向溢出 ' + (de.scrollWidth - de.clientWidth));
  if (o && o.classList.contains('on') && o.scrollHeight > o.clientHeight + 1) e.push('成績畫面要捲動才看得到全部（' + (o.scrollHeight - o.clientHeight) + 'px）');
  [].forEach.call(document.querySelectorAll('#scov button, #scov .scbar, #scov .sclist div, #scov .scmine, #scov .scpod .id, #scov .scstat span'), x => {
    if (x.getBoundingClientRect().width && x.scrollWidth > x.clientWidth + 2) e.push('字超出框：' + x.textContent.trim().slice(0, 24)); });
  [].forEach.call(document.querySelectorAll('#scov button'), b => { if (b.getBoundingClientRect().height && b.getBoundingClientRect().height < 44) e.push('按鈕不到 44px 高：' + b.textContent.trim().slice(0, 16)); });
  return e; });
/* 答一題：四選一、他還是她、語序…都點「對的」或「錯的」那一個 */
async function answer(p, right) {
  return p.evaluate(r => {
    if (busy || ended) return 'busy';
    const o = document.querySelector('#arena .o[data-ok="' + r + '"]');
    if (o) { o.click(); return 'o'; }
    if (document.querySelector('#arena .dbtn')) { const v = g === 'g9' ? cur[1] : cur.a, b = [].filter.call(document.querySelectorAll('#arena .dbtn'), x => (x.getAttribute('data-v') === v) === r)[0]; if (b) { b.click(); return 'd'; } }
    if (g === 'g3') { const k = r ? 0 : 1, b = document.querySelector('#pool .cw[data-n="' + k + '"]:not(.used)'); if (r) { for (let i = 0; i < cur.s.length; i++) { const x = document.querySelector('#pool .cw[data-n="' + i + '"]:not(.used)'); if (x) x.click(); } return 's'; } if (b) { b.click(); return 's'; } }
    return 'none';
  }, right);
}
async function playSome(p, k) {   /* 對、對、錯 輪流（不會連對 3 題，驚喜卡不會跳出來） */
  for (let i = 0; i < k; i++) {
    await p.waitForFunction(() => !busy && !ended && document.querySelector('#arena') && document.querySelector('#arena').children.length, null, { timeout: 8000 });
    const wrong = i % 3 === 2, r = await answer(p, !wrong);
    if (r === 'none' || r === 'busy') return 'answer ' + r;
    if (wrong) { await p.waitForSelector('#miss .nxt', { timeout: 12000 }); await p.click('#miss .nxt'); }
    else await p.waitForTimeout(1900);
  }
  return '';
}
async function game(br, P, vp) {
  const G = make({ TEACHER_PW: PW }); seedGame(G, P.set);
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }); await route(ctx, G);
  const p = await ctx.newPage(), e = [], W = P.f + ' @' + vp.join('x');
  p.on('pageerror', x => e.push('JS 例外：' + x.message));
  await p.goto(pathToFileURL(path.join(ROOT, P.f)).href); await p.waitForTimeout(1100);
  await p.evaluate(() => { MISSN = 1; });
  if (!/還沒登入/.test(await p.textContent('#scme'))) e.push('遊戲大廳沒有「🔢 還沒登入」');
  /* ① 一打開遊戲大廳就先登入（2026-10-09 E：登入完才知道老師的任務、才顯示鎖） */
  if (!await p.$('#scov.on #scBox')) { e.push('打開遊戲大廳沒有先出登入畫面'); out(W, e); await ctx.close(); return; }
  if (!!(await p.$('#scGuest')) !== (P.src === 'home')) e.push(P.src === 'home' ? '在家複習的遊戲沒有〔👀 先練習，不記成績〕' : '教學網站的遊戲不可以有「不記成績」');
  (await ovFit(p)).forEach(x => e.push('登入：' + x)); n += 3;
  if (P.src === 'home') {   /* 先練習：玩完不送成績、沒有成績畫面 */
    await p.click('#scGuest'); await p.waitForTimeout(400);
    await p.click('.gcard[data-g="' + P.game + '"]'); await p.waitForTimeout(400);
    const b0 = G.books['紀錄'].d.length; e.push(...[await playSome(p, 2)].filter(x => x));
    await p.evaluate(() => timeOver()); await p.waitForTimeout(3200);
    if (G.books['紀錄'].d.length !== b0) e.push('練習模式也把遊戲成績送出去了');
    if (await p.$('#scov.on')) e.push('練習模式也跳出成績畫面');
    await p.evaluate(() => { const m = document.getElementById('missAll'); if (m) m.classList.remove('on'); });
    await p.click('#backhub'); await p.waitForTimeout(200);
    if (!/練習模式/.test(await p.textContent('#scme'))) e.push('練習模式回到大廳沒有寫「👀 練習模式」');
    await p.click('#scSwap'); await p.waitForTimeout(300); n += 3;
    if (!await p.$('#scov.on #scBox')) { e.push('大廳按〔🔢 登入〕沒有出登入畫面'); out(W, e); await ctx.close(); return; }
    await typeId(p, P.me); await p.waitForTimeout(400);
    if (!new RegExp(P.me).test(await p.textContent('#scme'))) e.push('登入以後大廳沒有顯示 ' + P.me);
    await p.click('.gcard[data-g="' + P.game + '"]'); await p.waitForTimeout(400);
  } else {
    if (P.g === 0) {   /* Review 1 遊戲三、四年級共用：兩個年級的號碼都可以 */
      await keys(p, '305'); if (!/沒有/.test(await p.textContent('#scMsg'))) e.push('沒有 305 班也讓他登入');
      if ((await typed(p)) !== '') e.push('沒有 305 班沒有立刻清空');
    }
    await typeId(p, P.me); await p.waitForTimeout(500);
    if (await p.$('#scov.on')) e.push('登入以後登入畫面沒有關掉');
    await p.click('.gcard[data-g="' + P.game + '"]'); await p.waitForTimeout(400);
  }
  if (!await p.evaluate(() => document.getElementById('arena').classList.contains('on'))) { e.push('登入以後遊戲沒有開始'); out(W, e); await ctx.close(); return; }
  /* ② 玩 6 題（對、對、錯…）：只記第一次作答，類似題不記 */
  const b1 = G.books['紀錄'].d.length;
  const err = await playSome(p, 6); if (err) e.push('玩遊戲卡住：' + err);
  const st = await p.evaluate(() => ({ n: GQ.length, qi: GQ.map(q => q[5]), ok: GQ.map(q => q[0]), fix: gFix, sim: GSIM.length }));
  if (st.n < 4 || st.n > 6) e.push('6 題裡第一次作答的題數不對（' + st.n + '）');
  if (new Set(st.qi).size !== st.qi.length || st.qi.some(i => i < 0)) e.push('第一次作答的題目重複或找不到題庫第幾題：' + st.qi);
  if (st.ok.filter(x => !x).length < 1) e.push('答錯的題目沒有記下來：' + st.ok);
  n += 3;
  /* 補到 12 題（真的作答流程上面量過了），時間到 */
  await p.evaluate(() => { for (let i = GQ.length; i < 12; i++)GQ.push([1, 0, 3, 0, .8, 500 + i]); timeOver(); });
  await p.waitForTimeout(600);
  if (await p.$('#missAll.on')) await p.click('#mAllOk');
  await p.waitForSelector('#scov.on #scn', { timeout: 5000 }).catch(() => e.push('答錯整理看完沒有接成績畫面'));
  const names = [];
  for (let k = 0; k < 5; k++) {
    await p.waitForTimeout(k === 0 ? 1600 : 900);
    const s = await p.evaluate(() => ({ nm: SCEND && SCEND.list[SCEND.k], t: (document.getElementById('scn') || {}).textContent || '' }));
    names.push(s.nm); (await ovFit(p)).forEach(x => e.push('成績第 ' + (k + 1) + ' 幕：' + x));
    if (k === 0 && !/第一次作答/.test(s.t)) e.push('第 1 幕沒有寫「每一題第一次作答」：' + s.t.slice(0, 40));
    if (k === 0 && !/驚喜卡/.test(s.t)) e.push('第 1 幕沒有說驚喜卡不算進成績');
    if (s.nm === 'time' && !/這週你已經練習 \d+ (秒|分鐘)/.test(s.t)) e.push('遊戲 12 題沒有亂按，練習時間那一張不對：' + s.t.slice(0, 60));
    if (s.nm === 'honor') { await p.waitForTimeout(2600); const h = await honNow(p);   /* 卡片掉下來（約 2.5 秒）演完才量 */ if (!h || !/本週 榮譽榜/.test(h.t)) e.push('遊戲榮譽動畫不對：' + (h ? h.t.slice(0, 60) : '沒有')); else h.e.forEach(x => e.push('遊戲榮譽動畫：' + x)); }
    if (s.nm === 'gtop' && !/本班前 10 名/.test(s.t)) e.push('最後一幕不是「這個遊戲本班前 10 名」：' + s.t.slice(0, 60));
    if (s.nm === 'gtop' && !/第 \d+ 名|進前 10|你的紀錄/.test(s.t)) e.push('最後一幕沒有「你」那一行');
    if (s.nm === 'gtop') break;
    await p.click('#scNx');
  }
  if (!/^acc,time,care,(honor,)?gtop$/.test(names.join())) e.push('遊戲的成績畫面不是 正確率 ➜ 練習時間 ➜ ❤ 用心程度 ➜（名次上升才有 🏆）➜ 本班前 10 名（' + names.join() + '）');
  if (!await p.$('[data-sca="again"]') || !await p.$('[data-sca="hub"]')) e.push('最後一幕沒有〔🔁 再玩一次〕〔🎮 換一個遊戲〕');
  n += 9;
  const rows = G.books['紀錄'].d.slice(b1);
  if (rows.length !== 1) e.push('伺服器收到 ' + rows.length + ' 筆（要 1 筆）');
  else { const r = SC.fromRow(rows[0]);
    if (r.id !== P.me || r.set !== P.set || r.src !== P.src || r.m !== 'g') e.push('送出去的 5 碼／題組／來源／玩法不對：' + [r.id, r.set, r.src, r.m].join(' '));
    if (r.n !== 12 || !(r.raw > 0)) e.push('送出去的題數不是 12 或沒有原始分數：' + r.n + ' ' + r.raw);
    if (rows[0][CI['類別']] !== (P.set.indexOf('r1') > 0 ? '📘 Review 1' : '🎮 遊戲')) e.push('類別不對：' + rows[0][CI['類別']]); }
  n += 3;
  await p.click('[data-sca="close"]'); await p.waitForTimeout(200);
  if (await p.$('#scov.on') || !await p.isVisible('#gscore')) e.push('〔📋 回到結算〕以後沒有回到原本的結算（要有〔📊 我的成績〕）');
  n++;
  /* ③ 🃏 記憶配對：只記配完幾對、翻錯幾次、用幾秒 */
  if (P.mem) {
    await p.click('#backhub'); await p.waitForTimeout(200); await p.click('.gcard[data-g="' + P.mem + '"]'); await p.waitForTimeout(500);
    const b2 = G.books['紀錄'].d.length;
    await p.evaluate(() => { const c = [].slice.call(document.querySelectorAll('#bd .mc')), a = c[0], b = c.filter(x => x !== a && x.getAttribute('data-k') !== a.getAttribute('data-k'))[0]; a.click(); b.click(); });
    await p.waitForTimeout(1000);
    await p.evaluate(() => { const c = [].slice.call(document.querySelectorAll('#bd .mc')), a = c[0], b = c.filter(x => x !== a && x.getAttribute('data-k') === a.getAttribute('data-k'))[0]; a.click(); b.click(); });
    await p.waitForTimeout(2600);
    await p.evaluate(() => timeOver()); await p.waitForTimeout(3300);
    const t = await p.evaluate(() => ({ nm: SCEND && SCEND.list[SCEND.k], t: (document.getElementById('scn') || {}).textContent || '' }));
    if (t.nm !== 'mem' || !/配完幾對/.test(t.t) || !/翻錯幾次/.test(t.t)) e.push('記憶配對的成績畫面不對：' + t.t.slice(0, 50));
    if (/正確率 \d|總分 \d/.test(t.t)) e.push('記憶配對不可以有正確率、總分');
    (await ovFit(p)).forEach(x => e.push('記憶配對成績：' + x));
    const r = G.books['紀錄'].d.slice(b2).map(SC.fromRow)[0];
    if (!r || r.m !== 'mem' || r.mp !== 1 || r.mw !== 1 || r.acc != null || !(r.sec > 0)) e.push('記憶配對送出去的不對：' + JSON.stringify(r && { m: r.m, mp: r.mp, mw: r.mw, acc: r.acc, sec: r.sec }));
    n += 4;
  }
  /* ④ 中途回大廳：不送 */
  await p.evaluate(() => { const o = document.getElementById('scov'); if (o) o.classList.remove('on'); }); await p.click('#backhub'); await p.waitForTimeout(200);
  await p.click('.gcard[data-g="' + P.game + '"]'); await p.waitForTimeout(400);
  const b3 = G.books['紀錄'].d.length; await playSome(p, 1); await p.click('#quit'); await p.waitForTimeout(800);
  if (G.books['紀錄'].d.length !== b3) e.push('中途回遊戲大廳也送了成績（要玩完整場才送）');
  n++;
  out(W, e); await ctx.close();
}
/* Review 1 頁的 📝 複習（每 4 張一組）：登入 ➜ 答完 ➜ 六幕 ➜ 送 g年級r1_rv第幾組（類似題不算） */
async function rvPage(br, f, g, me, vp) {
  const G = make({ TEACHER_PW: PW }); seed(G, g);
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }); await route(ctx, G);
  const p = await ctx.newPage(), e = [], W = f + ' 📝 複習 @' + vp.join('x');
  p.on('pageerror', x => e.push('JS 例外：' + x.message));
  await p.goto(pathToFileURL(path.join(ROOT, f)).href); await p.waitForTimeout(500);
  await p.evaluate(() => { MISSN = 1; });
  await p.click('#rvBtn'); await p.waitForTimeout(200); await p.click('.rvg[data-g="1"]'); await p.waitForTimeout(300);
  if (!await p.$('#scBox')) { e.push('Review 1 的 📝 複習沒有先登入'); out(W, e); await ctx.close(); return; }
  await typeId(p, me); await p.waitForTimeout(400);
  const b = G.books['紀錄'].d.length;
  for (let k = 0; k < 8 && !(await p.$('#scn')); k++) {
    await p.waitForTimeout(1200);   /* 看完題目才按（1 秒內 ＝ 太快亂按，練習次數不會 ＋1） */
    if (k === 0) { await p.click('.rvo button[data-ok="false"]'); await p.waitForSelector('#miss .nxt', { timeout: 12000 }); await p.click('#miss .nxt'); await p.waitForTimeout(400); }
    else { await p.click('.rvo button[data-ok="true"]'); await p.waitForTimeout(1400); }
  }
  const sc = [];
  for (let k = 0; k < 5; k++) { await p.waitForTimeout(k === 1 ? 3200 : 900); const nm = await p.evaluate(() => SCEND && SCEND.list[SCEND.k]); sc.push(nm); (await fit(p)).forEach(x => e.push('第 ' + (k + 1) + ' 幕' + x));
    if (nm === 'time') { const t = await p.evaluate(() => (document.querySelector('.sctime') || {}).textContent || ''); if (!/這一次 練習 \d+ (秒|分鐘)。/.test(t)) e.push('練習時間那一張不對：' + t.slice(0, 50)); }
    if (nm === 'honor') { await p.waitForTimeout(2600); const h = await honNow(p); if (!h || !/本週 榮譽榜/.test(h.t)) e.push('榮譽動畫不對：' + (h ? h.t.slice(0, 50) : '沒有')); else h.e.forEach(x => e.push('榮譽動畫：' + x)); }
    if (nm === 'end') break;
    if (await p.$('#scNx')) await p.click('#scNx'); }
  if (!/^acc,time,care,(honor,)?end$/.test(sc.join())) e.push('結束畫面不是 正確率 ➜ 練習時間 ➜ ❤ 用心程度 ➜（名次上升才有 🏆）➜ 最後一幕：' + sc.join());
  await p.evaluate(() => { const m = document.getElementById('missAll'); if (m) m.classList.remove('on'); });
  if (!await p.$('#rvAgain') || !await p.$('#rvBack')) e.push('最後一幕沒有〔🔁 再玩一次〕〔📚 換一組〕');
  const rows = G.books['紀錄'].d.slice(b).map(SC.fromRow);
  if (rows.length !== 1 || rows[0].set !== 'g' + g + 'r1_rv2' || rows[0].n !== 4 || rows[0].ok !== 3 || rows[0].fix !== 1) e.push('送出去的不對（要 g' + g + 'r1_rv2、4 題對 3 題、訂正成功 1）：' + JSON.stringify(rows.map(r => [r.set, r.n, r.ok, r.fix])));
  n += 4;
  out(W, e); await ctx.close();
}
/* 老師派任務（2026-10-09 E）：老師看板派 ➜ 學生的遊戲大廳、📝 複習題照任務鎖；沒有任務的班全部開放；截止以後鎖住；刪掉又開 */
async function task(br, vp) {
  const G = make({ TEACHER_PW: PW }), e = [], W = '任務 @' + vp.join('x');
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }); await route(ctx, G);
  const p = await ctx.newPage(); p.on('pageerror', x => e.push('JS 例外：' + x.message));
  p.on('dialog', d => d.accept());
  await p.goto(HTTP + '/teacher/index.html'); await p.waitForTimeout(300);
  await p.fill('#pw', PW); await p.click('#go'); await p.waitForTimeout(500);
  await p.click('#fg button[data-g="4"]'); await p.click('#tabs button[data-t="t"]'); await p.waitForTimeout(150);
  if (!/還沒有任務/.test(await p.textContent('#pane'))) e.push('老師看板〔📌 任務〕沒有任務時沒有說「全部開放」');
  await p.click('#tkNew'); await p.waitForTimeout(200);
  const f = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth - innerWidth, cls: document.querySelectorAll('input[name=tkc]').length,
    it: [].map.call(document.querySelectorAll('input[name=tki]'), x => x.value), small: [].filter.call(document.querySelectorAll('#tkf label,#tkf button,#tkf input'), x => x.getBoundingClientRect().width && parseFloat(getComputedStyle(x).fontSize) < 17).length,
    over: [].filter.call(document.querySelectorAll('#mbox *'), x => x.getBoundingClientRect().right > innerWidth + 1).length }));
  if (f.cls !== 5) e.push('四年級的班級不是 402、406、409、410、400 五個（' + f.cls + '）');
  ['g4gm_g1', 'g4u2_1-1b', 'g4r1_rv1', 'g4r1_i1_1', 'g4gm_job-memory'].forEach(k => { if (f.it.indexOf(k) < 0) e.push('派任務的清單沒有 ' + k); });
  if (f.it.some(k => !/^g4/.test(k))) e.push('四年級派任務的清單有別的年級');
  if (f.small) e.push('派任務的表單有 ' + f.small + ' 個字小於 17px');
  if (f.ox > 0 || f.over) e.push('派任務的表單超出畫面');
  await p.click('[data-tkq="回家作業"]');
  await p.evaluate(() => { document.querySelectorAll('input[name=tkc]').forEach(x => { x.checked = x.value === '402'; });
    ['g4gm_g1', 'g4gm_job-memory'].forEach(k => { document.querySelector('input[name=tki][value="' + k + '"]').checked = true; }); });
  const tv = ms => { const d = new Date(ms), q = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + q(d.getMonth() + 1) + '-' + q(d.getDate()) + 'T' + q(d.getHours()) + ':' + q(d.getMinutes()); };
  await p.fill('#tkf1', tv(Date.now() - 36e5)); await p.fill('#tkf2', tv(Date.now() + 36e5));
  await p.click('#tkSave'); await p.waitForTimeout(400);
  const T = G.books['任務'].d;
  if (T.length !== 2 || T[1][1] !== '回家作業' || T[1][3] !== '402') e.push('派出去的任務沒有存進試算表「任務」（' + JSON.stringify(T.slice(1)) + '）');
  const pane = await p.textContent('#pane');
  if (!/進行中/.test(pane) || !/回家作業/.test(pane) || !/閃電|g4gm_g1/.test(pane)) e.push('派好的任務卡沒有「🟢 進行中」、名稱、項目');
  n += 8;
  /* 學生（402）：遊戲大廳 */
  const s = await ctx.newPage(); s.on('pageerror', x => e.push('學生 JS 例外：' + x.message));
  await s.goto(pathToFileURL(path.join(ROOT, 'sentences/games.html')).href); await s.waitForTimeout(1100);
  if (!await s.$('#scov.on #scBox')) e.push('遊戲大廳一打開沒有先登入');
  else { await typeId(s, '40205'); await s.waitForTimeout(700); }
  const L = await s.evaluate(() => ({ on: [].map.call(document.querySelectorAll('#grid .gcard.tkon'), c => c.getAttribute('data-g')),
    lock: document.querySelectorAll('#grid .gcard.tklock').length, first: document.querySelector('#grid .gcard').getAttribute('data-g'),
    bar: document.getElementById('sctaskb').textContent, ox: document.documentElement.scrollWidth - innerWidth,
    lab: (document.querySelector('#grid .gcard[data-g="g1"] .sctkc') || {}).textContent || '',
    font: parseFloat(getComputedStyle(document.querySelector('.sctkl') || document.body).fontSize) }));
  if (L.on.join() !== 'g1') e.push('被指定的遊戲沒有發亮（' + L.on + '）');
  if (L.first !== 'g1') e.push('被指定的遊戲沒有放最前面');
  if (L.lock !== 9) e.push('沒被指定的 9 個遊戲沒有全部上鎖（' + L.lock + '）');
  if (!/回家作業/.test(L.bar) || !/到/.test(L.bar)) e.push('大廳上面沒有「📌 老師的任務 … ⏰ 到 …」');
  if (!/⏰ 到/.test(L.lab)) e.push('被指定的遊戲卡沒有寫「⏰ 到 幾點」');
  if (L.font < 19) e.push('任務條的字太小（' + L.font + 'px）');
  if (L.ox > 0) e.push('遊戲大廳加了任務條以後橫向溢出');
  await s.click('#grid .gcard[data-g="g2"]'); await s.waitForTimeout(300);
  const lk = await s.evaluate(() => ({ on: document.getElementById('sctk') && document.getElementById('sctk').classList.contains('on'), t: (document.getElementById('sctk') || {}).textContent || '',
    arena: document.getElementById('arena').classList.contains('on') }));
  if (!lk.on || !/🔒/.test(lk.t) || !/回家作業/.test(lk.t) || lk.arena) e.push('按了沒被指定的遊戲：沒有出現 🔒 說明（或還是開始了）');
  if (lk.on) { await s.click('#sctkOk'); await s.waitForTimeout(150); }
  await s.click('#grid .gcard[data-g="g1"]'); await s.waitForTimeout(400);
  if (!await s.evaluate(() => document.getElementById('arena').classList.contains('on'))) e.push('被指定的遊戲按了沒有開始');
  /* 學生（402）：📝 複習題沒被指定 ➜ 🔒 */
  const q = await ctx.newPage(); q.on('pageerror', x => e.push('學生 JS 例外：' + x.message));
  await q.goto(pathToFileURL(path.join(ROOT, 'sentences/unit2.html')).href); await q.waitForTimeout(900);
  if (await q.$('#scwho.on #scWhoY')) await q.click('#scWhoY'); else e.push('新的分頁（已經登入）沒有先問「請問 這是您嗎？」');
  await q.evaluate(() => { TABM.forEach((tb, t) => { TQSEEN[t + '_0'] = 1; TQSEEN[t + '_1'] = 1; }); tqMark(); });
  if (!/🔒/.test(await q.textContent('#tqGo'))) e.push('沒被指定的 📝 複習題按鈕沒有 🔒');
  await q.click('#tqGo'); await q.waitForTimeout(300);
  if (!await q.evaluate(() => document.getElementById('sctk') && document.getElementById('sctk').classList.contains('on') && !document.body.classList.contains('tqon'))) e.push('沒被指定的 📝 複習題按了沒有 🔒 說明（或還是開始了）');
  n += 10;
  /* 406：沒有任務 ➜ 全部開放 */
  await s.evaluate(() => { SCID = '40605'; scPut('last', '40605'); scPut('id_g4', '40605'); scTkLoad(function () { hub(); }); }); await s.waitForTimeout(500);
  if (await s.evaluate(() => document.querySelectorAll('#grid .gcard.tklock,#grid .gcard.tkon').length)) e.push('沒有任務的班（406）也被鎖住了');
  /* 截止：把任務改到過去 ➜ 402 的 g1 🔒 已經截止，其他全部開放 */
  const t0 = SC.tkClean({ id: 'x', name: '過了', g: 4, cls: ['402'], items: ['g4gm_g1'], from: Date.now() - 72e5, to: Date.now() - 36e5 }, Date.now());
  G.post({ a: 'task', pw: PW, op: 'del', id: G.post({ a: 'teacher', pw: PW }).tasks[0].id }); G.post({ a: 'task', pw: PW, op: 'set', t: t0 });
  await s.evaluate(() => { SCID = '40205'; scPut('last', '40205'); scTkLoad(function () { hub(); }); }); await s.waitForTimeout(500);
  const E = await s.evaluate(() => ({ lock: [].map.call(document.querySelectorAll('#grid .gcard.tklock'), c => c.getAttribute('data-g')), t: (document.querySelector('#grid .gcard[data-g="g1"] .sctkc') || {}).textContent || '' }));
  if (E.lock.join() !== 'g1' || !/截止/.test(E.t)) e.push('截止以後：任務裡的要 🔒 已經截止、其他全部開放（' + E.lock + '）');
  /* 老師刪掉 ➜ 又開 */
  await p.click('#rf'); await p.waitForTimeout(300); await p.click('#tabs button[data-t="t"]'); await p.waitForTimeout(150);
  if (!/已經截止/.test(await p.textContent('#pane'))) e.push('老師看板沒有寫「⛔ 已經截止」');
  await p.click('[data-tkd]'); await p.waitForTimeout(300);
  if (G.books['任務'].d.length !== 1) e.push('老師看板刪不掉任務');
  await s.evaluate(() => { scTkLoad(function () { hub(); }); }); await s.waitForTimeout(400);
  if (await s.evaluate(() => document.querySelectorAll('#grid .gcard.tklock').length)) e.push('任務刪掉以後還是鎖著');
  n += 5;
  out(W, e); await ctx.close();
}
/* 老師看板用 http 開（跟 GitHub Pages 一樣；file:// 下載檔名會被瀏覽器換掉） */
let HTTP = '';
function serve() { return new Promise(ok => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
  const s = require('http').createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; ok(s); }); }); }
(async () => {
  const srv = await serve();
  const br = await chromium.launch();
  const safe = async (W, fn) => { try { await fn(); } catch (x) { fails++; console.log('✗ ' + W + '\n   量測卡住：' + String(x.message).split('\n')[0] + '（' + (String(x.stack).match(/_verify\.js:\d+/g) || []).slice(0, 2).join(' ') + '）'); } };
  const O = process.env.ONLY || '', PF = process.env.PAGE || '', VF = process.env.VP || '';   /* PAGE=檔名一部分、VP=1024 只量一頁一種尺寸（找問題用） */
  for (const vp of VPS) { if (VF && String(vp[0]) !== VF) continue;
    if (!O || O === 'tq') for (const P of PAGES.filter(P => P.f.indexOf(PF) >= 0)) await safe(P.f + ' @' + vp.join('x'), () => student(br, P, vp));
    if (!O || O === 'game') for (const P of GPAGES) await safe(P.f + ' @' + vp.join('x'), () => game(br, P, vp));
    if (!O || O === 'rv') for (const R of [['G3 - L1 + L2/review1.html', 3, '30405'], ['sentences/review1.html', 4, '40205']]) await safe(R[0] + ' @' + vp.join('x'), () => rvPage(br, R[0], R[1], R[2], vp));
    if (!O || O === 'teacher') await safe('teacher @' + vp.join('x'), () => teacher(br, vp));
    if (!O || O === 'task') await safe('task @' + vp.join('x'), () => task(br, vp));
  }
  await br.close(); srv.close();
  console.log((fails ? '✗ ' : '✓ ') + '成績紀錄（複習題 4 頁＋遊戲 5 頁＋Review 1 複習 2 頁＋老師看板＋派任務 ✕ 3 尺寸）量了 ' + n + ' 項，失敗 ' + fails + ' 項');
  process.exit(fails ? 1 : 0);
})();
