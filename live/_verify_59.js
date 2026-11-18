/* live/_verify_59.js — 第五十九次（由 _verify_56 的 假 Firebase 改）：誰 已經 登入＋全班 到齊、簡潔版、超車、班級 平均、班級 頒獎 典禮
 * （以下 是 原本 的 說明）第五十六次：每一次 現場任務 都 有「全班 前 10 名＋🚀 進步 前 5 名」即時 排行榜，結束 ＝ 前 10 名 頒獎 ➜ 🌟 進步 之星 頒獎
 * 假 Firebase（https://fake.test）＋假 成績 伺服器（score/_gas_stub.js）；**絕對 不 連 真的**。node live/_verify_56.js（只 印 失敗 項）
 * ① 限時 任務（📝 25 題 挑戰 x25）：大螢幕 歷史（crh_）➜ 進步 前 5 名、名字 旁邊 📈、兩欄 寬度、時間 到 ➜ 全班 頒獎 ➜〔🌟 下一個〕➜ 進步 之星 演完
 * ② 經典 搶答：排行榜 ＝ 前 10 名＋進步 前 5 名（第 5 題 以後）、頒獎 以後〔🌟〕➜ 進步 之星 ➜〔📊 全班 錯題 分析〕 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = ''; const PW = 'pw-verify';
const ok = (c, m) => { n++; if (!c) E.push(m); };
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
const FDB = {}; const seg = p => p.replace(/^\/+|\.json$/g, '').split('/').filter(Boolean);
function dget(p) { let o = FDB; for (const k of seg(p)) { if (o == null || typeof o !== 'object') return null; o = o[k]; } return o === undefined ? null : o; }
function dset(p, v, patch) { const S = seg(p); let o = FDB; for (let i = 0; i < S.length - 1; i++) { if (typeof o[S[i]] !== 'object' || o[S[i]] === null) o[S[i]] = {}; o = o[S[i]]; } const k = S[S.length - 1];
  if (patch && typeof o[k] === 'object' && o[k]) Object.assign(o[k], v); else if (v === null) delete o[k]; else o[k] = v; }
async function hostPage(br, vp) { for (const k in FDB) delete FDB[k];
  const { make } = require('../score/_gas_stub.js'), G = make({ TEACHER_PW: PW });
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
  await ctx.addInitScript(() => { window.__SCNOJIT = 1; window.__AWDFAST = 1; window.__GROWFAST = 1;
    Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {}, configurable: true });
    Object.defineProperty(window, 'LIVE_DB', { get: () => 'https://fake.test', set: () => {}, configurable: true });
    HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 30); return Promise.resolve(); }; });
  await ctx.route(/fake\.test/, async r => { const u = new URL(r.request().url()), m = r.request().method(); let b = null;
    if (m === 'GET') b = dget(u.pathname); else { const v = m === 'DELETE' ? null : JSON.parse(r.request().postData() || 'null'); dset(u.pathname, v, m === 'PATCH'); b = v; }
    await r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(b) }); });
  await ctx.route('https://script.test/exec**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  const h = await ctx.newPage(), errs = []; h.on('pageerror', e => errs.push(e.message));
  await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(400); await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(500);
  return { ctx, h, errs }; }

async function run(br, vp) { const tag = vp.join('×'), { ctx, h, errs } = await hostPage(br, vp), S = '/tmp/claude-0/-home-user-AI-Agent-Open-Code/586ff601-0453-56b7-b099-f22df2c81282/scratchpad/';
  await h.evaluate(() => { H.NM = { 30401: '王小明', 30402: '李小華', 30403: '陳大同' }; });
  const now = Date.now(); dset('/rooms/0304/p/30401', { at: now }); dset('/rooms/0304/p/30402', { at: now });
  await h.click('[data-sc="304"]'); await h.waitForTimeout(200); await h.click('[data-crgo]'); await h.waitForTimeout(200); await h.click('[data-crs="x25"]'); await h.waitForTimeout(2200);
  let w = await h.evaluate(() => ({ t: (document.querySelector('#crwho .whoh') || {}).innerText || '', on: document.querySelectorAll('#crwho .ws.on').length, all: !!document.querySelector('#crwho .whoall'), g: document.getElementById('crstart').classList.contains('allgo') }));
  ok(/2\s*／\s*3/.test(w.t) && w.on === 2 && !w.all && !w.g, tag + ' 誰 已經 登入（2／3）' + JSON.stringify(w));
  dset('/rooms/0304/p/30403', { at: Date.now() }); await h.waitForTimeout(2400);
  w = await h.evaluate(() => ({ on: document.querySelectorAll('#crwho .ws.on').length, all: !!document.querySelector('#crwho .whoall'), g: document.getElementById('crstart').classList.contains('allgo') }));
  ok(w.on === 3 && w.all && w.g, tag + ' 全班 到齊 沒有 提示 開始 ' + JSON.stringify(w));
  if (vp[0] === 1024) await h.screenshot({ path: S + 'v59_who.png' });
  dset('/rooms/0307/ca/x25', { a: 72.5, n: 20, t: now - 864e5 }); dset('/rooms/0311/ca/x25', { a: 88, n: 18, t: now - 2 * 864e5 });
  await h.click('#crstart'); await h.waitForTimeout(1500);
  await h.evaluate(() => { const c = CRS.cfg; [['30401', 9, 10], ['30402', 7, 10], ['30403', 4, 10]].forEach(x => { CRS.crp[x[0]] = { t: c.t, n: x[2], ok: x[1], s: x[1] * 10, g: 'a' }; }); crRun(); });
  await h.waitForTimeout(400);
  let r = await h.evaluate(() => ({ cls: [...document.querySelectorAll('#crcls .cab')].map(e => e.innerText.replace(/\s+/g, ' ')), me: !!document.querySelector('#crcls .cab.me'), lbt: LBT.map(x => x.n + x.ld).join('|') }));
  ok(r.cls.length === 3 && r.me && /311/.test(r.cls[0]), tag + ' 班級 平均 即時 排行榜 ' + JSON.stringify(r.cls));
  ok(!/彩虹|熱氣球|駿馬|王/.test(r.lbt.replace(/第 1 名/g, '')), tag + ' 排行榜 還有 幼稚 名稱 ' + r.lbt);
  await h.click('#crsimp'); await h.waitForTimeout(200);
  r = await h.evaluate(() => ({ simp: document.getElementById('hcrr').classList.contains('simp'), veh: [...document.querySelectorAll('#crlbw .crveh')].some(e => e.offsetParent), name: document.querySelectorAll('#crlbw .crnm').length }));
  ok(r.simp && !r.veh && r.name === 3, tag + ' 簡潔版 ' + JSON.stringify(r));
  if (vp[0] === 1024) await h.screenshot({ path: S + 'v59_lb.png' });
  await h.click('#crsimp');
  /* 超車：30403 從 第 3 衝 到 第 1 */
  await h.evaluate(() => { const c = CRS.cfg; CRS.crp['30403'] = { t: c.t, n: 12, ok: 12, s: 100, g: 'a' }; crRun(); }); await h.waitForTimeout(300);
  r = await h.evaluate(() => ({ lead: document.getElementById('crlead').innerText, nitro: document.querySelectorAll('#crlbw .crlr.nitro').length }));
  ok(/逆轉|超/.test(r.lead) && r.nitro >= 1, tag + ' 超車 ' + JSON.stringify(r));
  /* 結束 ➜ 存 本班 平均 ➜ 班級 頒獎 典禮 */
  await h.evaluate(() => { crShowX(); }); await h.waitForTimeout(1200);
  const sv = dget('/rooms/0304/ca/x25'); ok(sv && Math.abs(sv.a - (90 + 70 + 100) / 3) < 0.2 && sv.n === 3, tag + ' 本班 平均 沒有 存 ' + JSON.stringify(sv));
  await h.evaluate(() => caCer('x25', '📝 25 題', null)); await h.waitForTimeout(1500);
  r = await h.evaluate(() => ({ on: document.getElementById('cacer').classList.contains('on'), lx: !!document.querySelector('#cacs.cx.lx'), flag: document.querySelectorAll('#cacs .caf').length, txt: document.getElementById('cacs').innerText }));
  ok(r.on && r.lx && r.flag === 3 && /311/.test(r.txt) && /304/.test(r.txt), tag + ' 班級 頒獎 典禮 ' + JSON.stringify({ on: r.on, lx: r.lx, flag: r.flag }));
  if (vp[0] === 1024) { await h.waitForTimeout(6000); await h.screenshot({ path: S + 'v59_cer.png' }); }
  const k1 = await h.evaluate(() => CLSX.pick()), k2 = await h.evaluate(() => CLSX.pick()); ok(k1 !== k2, tag + ' 班級 頒獎 典禮 兩次 一樣');
  ok(!errs.length, tag + ' 程式 錯誤 ' + errs.slice(0, 3).join('｜')); await ctx.close(); }
(async () => { const srv = await serve(), br = await chromium.launch(); for (const vp of [[1024, 768], [1920, 1080]]) await run(br, vp);
  await br.close(); srv.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第五十九次 現場任務：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
