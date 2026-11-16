/* live/_verify_56.js — 第五十六次：每一次 現場任務 都 有「全班 前 10 名＋🚀 進步 前 5 名」即時 排行榜，結束 ＝ 前 10 名 頒獎 ➜ 🌟 進步 之星 頒獎
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
async function timed(br, vp) { const tag = '限時 x25 ' + vp.join('×'), { ctx, h, errs } = await hostPage(br, vp);
  await h.click('[data-sc="304"]'); await h.waitForTimeout(200); await h.click('[data-crgo]'); await h.waitForTimeout(200);
  await h.click('[data-crs="x25"]'); await h.waitForTimeout(200); await h.click('#crstart'); await h.waitForTimeout(800);
  const t = await h.evaluate(() => CRS.cfg && CRS.cfg.t); ok(!!t, tag + ' 沒有 開始');
  /* 大螢幕 歷史：30401 以前 50、60、70（平均 60）、30402 以前 100、100、100、30403 第一次 */
  await h.evaluate(() => { const c = CRS.cfg; localStorage.setItem('crh_x25_30401', JSON.stringify([{ t: 1, s: 50 }, { t: 2, s: 60 }, { t: 3, s: 70 }]));
    localStorage.setItem('crh_x25_30402', JSON.stringify([{ t: 1, s: 100 }, { t: 2, s: 100 }, { t: 3, s: 100 }]));
    localStorage.setItem('crh_x25_30404', JSON.stringify([{ t: 1, s: 90 }]));
    const put = (id, o) => { CRS.crp[id] = Object.assign({ t: c.t }, o); };
    put('30401', { n: 10, ok: 9, s: 90 }); put('30402', { n: 10, ok: 10, s: 100 }); put('30403', { n: 10, ok: 8, s: 80 }); put('30404', { n: 10, ok: 6, s: 60 }); put('30405', { n: 2, ok: 2, s: 100 });
    for (let i = 6; i <= 14; i++) put('304' + String(i).padStart(2, '0'), { n: 6, ok: 3, s: 50 }); crLB(); });
  await h.waitForTimeout(400);
  const lb = await h.evaluate(() => ({ rows: document.querySelectorAll('#crlbw .crlr').length, pg: [].map.call(document.querySelectorAll('#crpg .vsg'), r => r.innerText.replace(/\s+/g, ' ')), keep: (document.querySelector('#crpg .vsgk') || {}).textContent || '',
    badge: (document.querySelector('#crlbw .crlr[data-id="30401"] .vspb') || {}).textContent || '', h: [].map.call(document.querySelectorAll('.vsh'), x => x.textContent).join('|'),
    w: (() => { const a = document.querySelector('.vsl'), b = document.querySelector('.vsr'); return a && b ? [a.getBoundingClientRect().width, b.getBoundingClientRect().width] : [0, 0]; })(), over: document.documentElement.scrollWidth > innerWidth + 1 }));
  ok(lb.rows === 10, tag + ' 全班 排行榜 不是 10 行 ' + lb.rows);
  ok(/全班 排行榜/.test(lb.h) && /進步 排行榜/.test(lb.h), tag + ' 沒有 兩個 排行榜 標題 ' + lb.h);
  ok(lb.pg.length === 1 && /30401/.test(lb.pg[0]) && /📈 ＋30/.test(lb.pg[0]) && !/⚡/.test(lb.pg[0]), tag + ' 進步 排行榜 不對 ' + JSON.stringify(lb.pg));
  ok(/📈 ＋30/.test(lb.badge), tag + ' 名字 旁邊 沒有 📈 ' + lb.badge); ok(/30402/.test(lb.keep), tag + ' 沒有 🛡 保持 滿分');
  ok(vp[0] < 1100 || (lb.w[0] > lb.w[1] && lb.w[1] > 300), tag + ' 兩欄 寬度 不對 ' + lb.w); ok(!lb.over, tag + ' 橫向 超出');
  await h.evaluate(() => crUp());
  await h.waitForSelector('#crgl.on .awd', { timeout: 15000 }).catch(() => E.push(tag + ' 沒有 全班 頒獎'));
  await h.waitForSelector('#vsgo', { timeout: 30000 }).catch(() => E.push(tag + ' 頒獎 以後 沒有〔🌟 下一個：進步 之星〕'));
  await h.click('#vsgo').catch(() => {}); await h.waitForSelector('#vsgrow.fin', { timeout: 20000 }).catch(() => E.push(tag + ' 進步 之星 沒有 演完'));
  const gr = await h.evaluate(() => { const g = document.getElementById('vsgrow'); return g ? { c: [].map.call(g.querySelectorAll('.grc'), c => c.innerText.replace(/\s+/g, ' ')).join('|'), top: g.contains(document.elementFromPoint(innerWidth / 2, innerHeight / 2)) } : null; });
  ok(gr && /30401/.test(gr.c) && !/⚡/.test(gr.c) && gr.top, tag + ' 進步 之星 內容 不對 ' + JSON.stringify(gr).slice(0, 200));
  const hs = await h.evaluate(() => JSON.parse(localStorage.getItem('crh_x25_30401') || '[]'));
  ok(hs.length === 4 && hs[3].s === 90, tag + ' 這一場 沒有 記 進 歷史 ' + JSON.stringify(hs));
  ok(!errs.length, tag + ' 程式 錯誤 ' + errs.slice(0, 2).join('｜')); await ctx.close(); }
async function classic(br, vp) { const tag = '經典 搶答 ' + vp.join('×'), { ctx, h, errs } = await hostPage(br, vp);
  await h.evaluate(() => { H.cls = '304'; H.start = 777; H.n = 8; H.qi = 5; H.pl = {}; H.tot = {}; H.okc = {}; H.st = {}; H.P = H.P || {};
    for (let i = 1; i <= 12; i++) { const id = '304' + String(i).padStart(2, '0'); H.pl[id] = 1; H.tot[id] = 1000 * (13 - i); H.okc[id] = i <= 6 ? 6 - (i % 3) : 2; H.st[id] = 0; }
    localStorage.setItem('crh_lv_30403', JSON.stringify([{ t: 1, s: 20 }, { t: 2, s: 40 }])); localStorage.setItem('crh_lv_30401', JSON.stringify([{ t: 1, s: 100 }]));
    scr('hlb'); drawLB(); });
  await h.waitForTimeout(1200);
  const lb = await h.evaluate(() => ({ rows: document.querySelectorAll('#lb .vsl .lbr').length, pg: [].map.call(document.querySelectorAll('#lb .vsg'), r => r.innerText.replace(/\s+/g, ' ')),
    out: [].filter.call(document.querySelectorAll('#lb .lbr,#lb .vsg'), e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 || r.bottom > innerHeight + 1; }).length, fs: Math.min.apply(null, [].map.call(document.querySelectorAll('#lb .lbr'), e => parseFloat(getComputedStyle(e).fontSize))) }));
  ok(lb.rows === 10, tag + ' 前 10 名 不是 10 行 ' + lb.rows); ok(lb.pg.length === 1 && /30403/.test(lb.pg[0]) && /📈 ＋70/.test(lb.pg[0]), tag + ' 進步 前 5 名 不對 ' + JSON.stringify(lb.pg));
  ok(!lb.out, tag + ' 排行榜 超出 畫面 ' + lb.out); ok(lb.fs >= 24, tag + ' 字 太 小 ' + lb.fs);
  await h.evaluate(() => { H.qi = 7; H.sum = []; H.Q = []; H.game = 'classic'; H.gs = {}; end(); });
  await h.waitForSelector('#lvgo', { timeout: 30000 }).catch(() => E.push(tag + ' 頒獎 以後 沒有〔🌟 下一個：進步 之星〕'));
  await h.click('#lvgo').catch(() => {}); await h.waitForSelector('#lvgrow.fin', { timeout: 20000 }).catch(() => E.push(tag + ' 進步 之星 沒有 演完'));
  const gr = await h.evaluate(() => { const g = document.getElementById('lvgrow'); return g ? { c: g.innerText.replace(/\s+/g, ' ').slice(0, 300), top: g.contains(document.elementFromPoint(innerWidth / 2, innerHeight / 2)), b: !!document.getElementById('lvge') } : null; });
  ok(gr && /30403/.test(gr.c) && gr.top && gr.b, tag + ' 進步 之星 不對 ' + JSON.stringify(gr).slice(0, 200));
  await h.click('#lvge').catch(() => {}); await h.waitForTimeout(800); ok(!(await h.$('#lvgrow')) && await h.evaluate(() => H.scr === 'hana'), tag + ' 〔📊 全班 錯題 分析〕沒有 過去');
  ok(!errs.length, tag + ' 程式 錯誤 ' + errs.slice(0, 2).join('｜')); await ctx.close(); }
(async () => { const srv = await serve(), br = await chromium.launch();
  for (const vp of [[1920, 1080], [1024, 768]]) { await timed(br, vp); await classic(br, vp); }
  await br.close(); srv.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第五十六次 排行榜＋進步 之星：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
