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
async function keys(p, ks) { for (const d of ks) await p.click('.sckey button[data-k="' + d + '"]'); await p.waitForTimeout(150); }
const typed = p => p.evaluate(() => [].map.call(document.querySelectorAll('#scBox i'), x => x.textContent).join(''));
async function typeId(p, id) { for (const d of id) await p.click('.sckey button[data-k="' + d + '"]'); await p.click('.sckey button[data-k="ok"]'); await p.waitForTimeout(250); }
async function quiz(p, wrongAt, started) {
  if (!started) await p.click('#tqStart'); await p.waitForTimeout(700);
  for (let k = 0; k < 5; k++) {
    const sel = (await p.$('.tqr .ch')) ? '.tqr .ch' : '.tqo button';
    await p.waitForTimeout(k === 0 ? 1200 : 400);
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
  await p.evaluate(() => { MISSN = 1; });
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
  if (!new RegExp('🪑 ' + P.me).test(intro)) e.push('開場沒有顯示「🪑 ' + P.me + '」');
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
  /* ⑤ 結束六幕 */
  const sc = [];
  for (let k = 0; k < 6; k++) {
    await p.waitForTimeout(k === 0 ? 1600 : 1300);
    const s = await p.evaluate(() => ({ k: SCEND && SCEND.k, t: (document.getElementById('scn') || {}).textContent || '' }));
    sc.push(s);
    const f = await fit(p); f.forEach(x => e.push('第 ' + (k + 1) + ' 幕' + x));
    if (k === 4) {
      for (const t of ['acc', 's', 'count', 'prog']) for (const s2 of ['cls', 'grade']) {
        await p.click('[data-bt="' + t + '"]'); await p.click('[data-bs="' + s2 + '"]'); await p.waitForTimeout(150);
        const b = await p.evaluate(() => ({ t: document.getElementById('scn').textContent, mine: (document.querySelector('.scmine') || {}).textContent || '' }));
        (await fit(p)).forEach(x => e.push('排行榜 ' + t + '/' + s2 + '：' + x));
        if (!b.mine) e.push('排行榜 ' + t + '/' + s2 + '：沒有「🪑 你：」那一行');
        if (/你是第 \d+ 名/.test(b.mine) && t === 'acc') e.push('排行榜：不在前 10 名卻顯示名次（' + b.mine + '）');
        n += 2;
      }
    }
    if (k < 5) { if (await p.$('#scNx')) await p.click('#scNx'); else { e.push('第 ' + (k + 1) + ' 幕沒有〔➡ 下一步〕'); break; } }
  }
  const want = [/正確率/, /跟上一次比/, /算不算 1 次/, /我幫全班/, /排行榜/, /答對/];
  sc.forEach((s, k) => { if (s.k !== k || !want[k].test(s.t)) e.push('第 ' + (k + 1) + ' 幕不對（k=' + s.k + '）：' + s.t.slice(0, 40)); });
  if (sc[0] && !/80%/.test(sc[0].t)) e.push('第 1 幕正確率不是 80%：' + sc[0].t.slice(0, 40));
  if (sc[2] && !/算 1 次/.test(sc[2].t)) e.push('對 4 題卻沒有「算 1 次」');
  if (sc[3] && !/班/.test(sc[3].t)) e.push('第 4 幕沒有各班長條');
  await p.evaluate(() => { const m = document.getElementById('missAll'); if (m) m.classList.remove('on'); });
  if (!await p.$('#tqAgain') || !await p.$('#tqMiss')) e.push('最後一幕沒有〔🔁 再挑戰一次〕〔📌 答錯整理〕');
  n += 10;
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
  for (let k = 0; k < 3; k++) { await p.click('#scNx'); await p.waitForTimeout(300); }
  /* 送不出去會再試 3 次（每次隔 1.5 秒），之後才寫「沒有網路」；學生看完前三幕（約 9 秒）早就好了 */
  await p.waitForFunction(() => /沒有網路/.test((document.getElementById('scn') || {}).textContent || ''), null, { timeout: 9000 }).catch(() => {});
  const off = await p.evaluate(() => ({ t: document.getElementById('scn').textContent, q: JSON.parse(localStorage.getItem('score_q') || '[]').length }));
  if (!/沒有網路/.test(off.t)) e.push('沒有網路時第 4 幕沒有寫「成績先存在這台平板」（' + off.t.slice(0, 30) + '）');
  if (off.q !== 1) e.push('沒有網路時平板裡沒有存著那一筆（' + off.q + '）');
  OFF = false; await p.evaluate(() => window.dispatchEvent(new Event('online'))); await p.waitForTimeout(800);
  if (G.books['紀錄'].d.length !== b2 + 1) e.push('連上網以後沒有自動補送');
  if (await p.evaluate(() => JSON.parse(localStorage.getItem('score_q') || '[]').length)) e.push('補送以後平板裡還留著');
  n += 4;
  /* ⑧ 換人 */
  await p.evaluate(() => { tqClose(); }); await p.click('#tqGo'); await p.waitForTimeout(300); await p.click('#scSwap'); await p.waitForTimeout(300);
  if (!await p.$('#scBox')) e.push('〔換人〕沒有回到登入畫面');
  n++;
  out(W, e); await ctx.close();
}
async function teacher(br, vp) {
  const G = make({ TEACHER_PW: PW }); seed(G, 3); seed(G, 4); seedGame(G, 'g3gm_g1');
  G.post({ a: 'rec', r: { id: '30411', set: 'g3gm_g6', name: 'm', m: 'mem', mp: 9, mw: 4, sec: 180, raw: 3000, src: 'school', dev: 'x', u: 'mem', t: Date.now() - 6e5, qs: [] } });
  G.books['班級人數'].d[1][1] = 25;
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
  for (const t of ['p', 'b', 'c', 'w', 'k']) {
    await p.click('#tabs button[data-t="' + t + '"]'); await p.waitForTimeout(150);
    const r = await p.evaluate(() => ({ t: document.getElementById('pane').textContent, small: [].filter.call(document.querySelectorAll('#pane td,#pane .br,#pane button'), x => parseFloat(getComputedStyle(x).fontSize) < 14).length }));
    if ((await ox()) > 0) e.push('分頁 ' + t + ' 橫向溢出');
    if (r.small) e.push('分頁 ' + t + ' 有 ' + r.small + ' 個字小於 14px');
    if (r.t.length < 20) e.push('分頁 ' + t + ' 是空的');
    n += 3;
  }
  await p.click('#tabs button[data-t="b"]'); await p.click('[data-bs="grade"]');
  const rkT = await p.textContent('#pane'); if (!/第 15 名/.test(rkT)) e.push('老師的排行榜沒有列出全部學生（看不到第 15 名）');
  if (!/測試\d\d/.test(rkT)) e.push('排行榜沒有姓名');
  /* 2026-10-09 名單：個人表有「姓名」欄、要關心列出一次都沒做的人 */
  await p.click('#tabs button[data-t="p"]'); await p.waitForTimeout(150);
  const pt = await p.evaluate(() => ({ th: [].map.call(document.querySelectorAll('#pane th'), x => x.textContent), td: document.getElementById('pane').textContent }));
  if (pt.th[1] !== '姓名' || !/測試\d\d/.test(pt.td)) e.push('個人表沒有姓名欄');
  await p.click('#tabs button[data-t="k"]'); await p.waitForTimeout(150);
  const kt = await p.textContent('#pane');
  if (!/一次都沒做（1 人）/.test(kt) || !/30430 沒做小明/.test(kt)) e.push('要關心沒有列出名單上一次都沒做的人（' + kt.slice(0, 80) + '）');
  n += 3;
  /* 個人 ➜ 作廢 */
  await p.click('#tabs button[data-t="p"]'); await p.click('tr.row'); await p.waitForTimeout(150);
  if (!await p.$('#modal.on .svgl')) e.push('點一個人沒有出現他的紀錄和折線圖');
  if (!/測試\d\d/.test(await p.textContent('#mbox h3'))) e.push('個人紀錄的標題沒有姓名');
  const vu = await p.getAttribute('[data-void]', 'data-void'); await p.click('[data-void]'); await p.waitForTimeout(300);
  const row = G.books['紀錄'].d.filter(r => r[CI['編號']] === vu)[0];
  if (!row || row[CI['作廢']] !== true) e.push('按〔🚫 作廢〕伺服器沒有打勾');
  await p.click('#mx');
  /* 錯題 ➜ 選項分布 ➜ 全班訂正 */
  await p.click('#tabs button[data-t="w"]'); await p.waitForTimeout(150);
  if (!await p.$('.wq')) e.push('錯題分頁沒有題目');
  else {
    await p.click('.wq'); await p.waitForTimeout(150);
    const d = await p.evaluate(() => ({ o: document.querySelectorAll('#mbox .opt').length, mis: !!document.querySelector('#mbox .opt.mis'), why: !!document.querySelector('#mbox .why') }));
    if (d.o !== 4 || !d.mis || !d.why) e.push('錯題詳細：要有四個選項的 %、最常見的誤會、為什麼');
    await p.click('#sh'); await p.waitForTimeout(150);
    for (let s = 0; s < 2; s++) { const f = await p.evaluate(() => { const x = document.getElementById('show'); return x.scrollHeight > x.clientHeight + 1 || document.querySelectorAll('#show .so div').length !== 4; }); if (f) e.push('全班訂正第 ' + (s + 1) + ' 步放不下或不是四個選項'); await p.click('#sn'); await p.waitForTimeout(150); }
    if (!await p.$('#show .so div.ok')) e.push('全班訂正最後沒有亮出正解');
    await p.click('#sc');
  }
  n += 6;
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
  await p.goto(pathToFileURL(path.join(ROOT, P.f)).href); await p.waitForTimeout(400);
  await p.evaluate(() => { MISSN = 1; });
  if (!/還沒登入/.test(await p.textContent('#scme'))) e.push('遊戲大廳沒有「🔢 還沒登入」');
  /* ① 點遊戲 ➜ 先登入 */
  await p.click('.gcard[data-g="' + P.game + '"]'); await p.waitForTimeout(300);
  if (!await p.$('#scov.on #scBox')) { e.push('點遊戲沒有先出登入畫面'); out(W, e); await ctx.close(); return; }
  if (!!(await p.$('#scGuest')) !== (P.src === 'home')) e.push(P.src === 'home' ? '在家複習的遊戲沒有〔👀 先練習，不記成績〕' : '教學網站的遊戲不可以有「不記成績」');
  (await ovFit(p)).forEach(x => e.push('登入：' + x)); n += 3;
  if (P.src === 'home') {   /* 先練習：玩完不送成績、沒有成績畫面 */
    await p.click('#scGuest'); await p.waitForTimeout(400);
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
    if (!new RegExp(P.me).test(await p.textContent('#scme'))) e.push('登入以後大廳沒有顯示 🪑 ' + P.me);
    await p.click('.gcard[data-g="' + P.game + '"]'); await p.waitForTimeout(400);
  } else {
    if (P.g === 0) {   /* Review 1 遊戲三、四年級共用：兩個年級的號碼都可以 */
      await keys(p, '305'); if (!/沒有/.test(await p.textContent('#scMsg'))) e.push('沒有 305 班也讓他登入');
      if ((await typed(p)) !== '') e.push('沒有 305 班沒有立刻清空');
    }
    await typeId(p, P.me); await p.waitForTimeout(500);
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
  for (let k = 0; k < 3; k++) {
    await p.waitForTimeout(k === 0 ? 1600 : 900);
    const s = await p.evaluate(() => ({ nm: SCEND && SCEND.list[SCEND.k], t: (document.getElementById('scn') || {}).textContent || '' }));
    names.push(s.nm); (await ovFit(p)).forEach(x => e.push('成績第 ' + (k + 1) + ' 幕：' + x));
    if (k === 0 && !/第一次作答/.test(s.t)) e.push('第 1 幕沒有寫「每一題第一次作答」：' + s.t.slice(0, 40));
    if (k === 0 && !/驚喜卡/.test(s.t)) e.push('第 1 幕沒有說驚喜卡不算進成績');
    if (k === 1 && !/算 1 次/.test(s.t)) e.push('對 2/3 以上、12 題卻沒有「算 1 次」：' + s.t.slice(0, 60));
    if (k === 2 && !/本班前 10 名/.test(s.t)) e.push('最後一幕不是「這個遊戲本班前 10 名」：' + s.t.slice(0, 60));
    if (k === 2 && !/第 \d+ 名|進前 10|你的紀錄/.test(s.t)) e.push('最後一幕沒有「🪑 你」那一行');
    if (k < 2) await p.click('#scNx');
  }
  if (names.join() !== 'acc,gprog,gtop') e.push('遊戲的成績畫面不是三幕（' + names.join() + '）');
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
    if (k === 0) { await p.click('.rvo button[data-ok="false"]'); await p.waitForSelector('#miss .nxt', { timeout: 12000 }); await p.click('#miss .nxt'); await p.waitForTimeout(400); }
    else { await p.click('.rvo button[data-ok="true"]'); await p.waitForTimeout(1400); }
  }
  const sc = [];
  for (let k = 0; k < 6; k++) { await p.waitForTimeout(k ? 400 : 900); sc.push(await p.evaluate(() => SCEND && SCEND.list[SCEND.k])); (await fit(p)).forEach(x => e.push('第 ' + (k + 1) + ' 幕' + x)); if (k < 5 && await p.$('#scNx')) await p.click('#scNx'); }
  if (sc.join() !== 'acc,prev,count,class,board,end') e.push('六幕不對：' + sc.join());
  await p.evaluate(() => { const m = document.getElementById('missAll'); if (m) m.classList.remove('on'); });
  if (!await p.$('#rvAgain') || !await p.$('#rvBack')) e.push('最後一幕沒有〔🔁 再玩一次〕〔📚 換一組〕');
  const rows = G.books['紀錄'].d.slice(b).map(SC.fromRow);
  if (rows.length !== 1 || rows[0].set !== 'g' + g + 'r1_rv2' || rows[0].n !== 4 || rows[0].ok !== 3 || rows[0].fix !== 1) e.push('送出去的不對（要 g' + g + 'r1_rv2、4 題對 3 題、訂正成功 1）：' + JSON.stringify(rows.map(r => [r.set, r.n, r.ok, r.fix])));
  n += 4;
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
  const safe = async (W, fn) => { try { await fn(); } catch (x) { fails++; console.log('✗ ' + W + '\n   量測卡住：' + String(x.message).split('\n')[0]); } };
  const O = process.env.ONLY || '';
  for (const vp of VPS) {
    if (!O || O === 'tq') for (const P of PAGES) await safe(P.f + ' @' + vp.join('x'), () => student(br, P, vp));
    if (!O || O === 'game') for (const P of GPAGES) await safe(P.f + ' @' + vp.join('x'), () => game(br, P, vp));
    if (!O || O === 'rv') for (const R of [['G3 - L1 + L2/review1.html', 3, '30405'], ['sentences/review1.html', 4, '40205']]) await safe(R[0] + ' @' + vp.join('x'), () => rvPage(br, R[0], R[1], R[2], vp));
    if (!O || O === 'teacher') await safe('teacher @' + vp.join('x'), () => teacher(br, vp));
  }
  await br.close(); srv.close();
  console.log((fails ? '✗ ' : '✓ ') + '成績紀錄（複習題 4 頁＋遊戲 5 頁＋Review 1 複習 2 頁＋老師看板 ✕ 3 尺寸）量了 ' + n + ' 項，失敗 ' + fails + ' 項');
  process.exit(fails ? 1 : 0);
})();
