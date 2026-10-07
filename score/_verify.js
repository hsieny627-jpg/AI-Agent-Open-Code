/* score/_verify.js — 量成績紀錄（2026-10-07 對話 C）：學生端（兩個教學網站＋在家複習）＋老師看板。只印失敗項和一行總結。
 *   node score/_verify.js            （ONLY=teacher node score/_verify.js ＝ 只量老師看板）
 * 假伺服器：score/_gas_stub.js 跑「真的」score/Code.gs（網站送出去的每一筆都由同一份程式處理）。
 * 三種尺寸：iPad 橫 1024×768、iPad 直 820×1180、教室觸控螢幕 1920×1080。
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), cp = require('child_process'), { pathToFileURL } = require('url');
const { make } = require('./_gas_stub.js');
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
  /* 示範動畫：3 0 4 0 5 自己跳進去 */
  const demoSeen = await p.evaluate(() => document.getElementById('scMsg').textContent);
  if (!/換你了|例/.test(demoSeen)) e.push('登入沒有示範動畫的提示（' + demoSeen + '）');
  /* ② 防呆 */
  const bad = [[P.g === 3 ? '30505' : '40505', '沒有'], [P.other, '年級的網站'], [P.me.slice(0, 3) + '41', '座號'], [P.me.slice(0, 3) + '00', '座號']];
  for (const [id, want] of bad) {
    await typeId(p, id); const m = await p.evaluate(() => document.getElementById('scMsg').textContent);
    if (m.indexOf(want) < 0) e.push('輸入 ' + id + ' 沒有擋下來（' + m + '）');
    for (let k = 0; k < 5; k++) await p.click('.sckey button[data-k="b"]');
    n++;
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
  else { const r = rows[0], qs = JSON.parse(r[16]);
    if (r[1] !== P.me || r[5] !== P.set || r[13] !== P.src) e.push('送出去的 5 碼／題組／來源不對：' + [r[1], r[5], r[13]].join(' '));
    if (r[8] !== 4 || r[9] !== 80) e.push('送出去的答對數／正確率不對：' + r[8] + ' ' + r[9]);
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
  const G = make({ TEACHER_PW: PW }); seed(G, 3); seed(G, 4);
  G.books['班級人數'].d[1][1] = 25;
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
  /* 個人 ➜ 作廢 */
  await p.click('#tabs button[data-t="p"]'); await p.click('tr.row'); await p.waitForTimeout(150);
  if (!await p.$('#modal.on .svgl')) e.push('點一個人沒有出現他的紀錄和折線圖');
  const vu = await p.getAttribute('[data-void]', 'data-void'); await p.click('[data-void]'); await p.waitForTimeout(300);
  const row = G.books['紀錄'].d.filter(r => r[15] === vu)[0];
  if (!row || row[17] !== true) e.push('按〔🚫 作廢〕伺服器沒有打勾');
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
  /* 學生排行榜 開／關 */
  await p.click('#bd'); await p.waitForTimeout(200);
  if (G.P.BOARDS !== 'off') e.push('按〔學生排行榜〕伺服器沒有關掉');
  await p.click('#bd'); await p.waitForTimeout(200);
  /* ⬇ 一鍵下載 Excel */
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#dl')]);
  const f = path.join(require('os').tmpdir(), 'score_verify.xlsx'); await dl.saveAs(f);
  try { const o = cp.execFileSync('python3', ['-W', 'error', '-c', 'import openpyxl,sys;wb=openpyxl.load_workbook(sys.argv[1]);print("|".join(wb.sheetnames));print(wb["個人"].max_row)', f]).toString().trim().split('\n');
    if (o[0] !== '個人|排行榜|班際|錯題|原始紀錄') e.push('Excel 工作表不對：' + o[0]);
    if (+o[1] < 2) e.push('Excel 個人表是空的');
    if (!/^score_G3_week_\d{4}-\d\d-\d\d\.xlsx$/.test(dl.suggestedFilename())) e.push('Excel 檔名不對：' + dl.suggestedFilename());
  } catch (x) { e.push('Excel 打不開：' + String(x).slice(0, 200)); }
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
  const safe = async (W, fn) => { try { await fn(); } catch (x) { fails++; console.log('✗ ' + W + '\n   量測卡住：' + String(x.message).split('\n')[0]); } };
  for (const vp of VPS) { if (process.env.ONLY !== 'teacher') for (const P of PAGES) await safe(P.f + ' @' + vp.join('x'), () => student(br, P, vp)); await safe('teacher @' + vp.join('x'), () => teacher(br, vp)); }
  await br.close(); srv.close();
  console.log((fails ? '✗ ' : '✓ ') + '成績紀錄（4 個學生頁＋老師看板 ✕ 3 尺寸）量了 ' + n + ' 項，失敗 ' + fails + ' 項');
  process.exit(fails ? 1 : 0);
})();
