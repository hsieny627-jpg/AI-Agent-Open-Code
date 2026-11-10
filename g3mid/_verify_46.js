/* g3mid/_verify_46.js — 2026-11-10 第四十六次：400 課後班（四年級 的 班）做 📝 成長測驗 25 題（借 live/_verify_cr.js 的 假 Firebase／假 成績系統）：🏫 三年級 課堂複習 在〔⚡ 現場任務〕開（〔👥 全班 同步〕〔🙋 學生 自己 答〕）。只印失敗項和一行總結。
 *   node live/_verify_cr.js
 * 假 的 Firebase（https://fake.test，記憶體 裡 的 JSON）、假 的 成績系統（script.test）；絕對 不 連 真的。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = '';
const { make } = require('../score/_gas_stub.js'), PW = 'pw-verify', URL0 = 'https://script.test/exec';
function serve() { return new Promise(ok => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
  const s = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; ok(s); }); }); }
/* 假 Firebase：GET／PUT／PATCH／DELETE 路徑 ＝ JSON 樹 */
const DB = {}; const seg = p => p.replace(/^\/+|\.json$/g, '').split('/').filter(Boolean);
function dget(p) { let o = DB; for (const k of seg(p)) { if (o == null || typeof o !== 'object') return null; o = o[k]; } return o === undefined ? null : o; }
function dset(p, v, patch) { const S = seg(p); let o = DB; for (let i = 0; i < S.length - 1; i++) { if (typeof o[S[i]] !== 'object' || o[S[i]] === null) o[S[i]] = {}; o = o[S[i]]; } const k = S[S.length - 1];
  if (patch && typeof o[k] === 'object' && o[k]) Object.assign(o[k], v); else if (v === null) delete o[k]; else o[k] = v; }
const POSTS = [];
async function ctxOf(br, vp, G) { const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 50)); r.abort(); });
  await ctx.addInitScript(u => { window.__SCNOJIT = 1; window.__NOTUT = 1; window.__NOUNLOCK = 1; window.__NODFXI = 1; window.__NOSNH = 1;   /* 第四十二次：寶箱 說明、貪吃蛇 怎麼玩 在 _verify_42.js 量 */ window.__NOWB = 1; Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); Object.defineProperty(window, 'LIVE_DB', { get: () => 'https://fake.test', set: () => {}, configurable: true });
    window.__NOGO = 1; window.__NORVA = 1; HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 40); return Promise.resolve(); }; }, URL0);
  await ctx.route(/fake\.test/, async r => { const u = new URL(r.request().url()), m = r.request().method(); let b = null;
    if (m === 'GET') b = dget(u.pathname); else { const v = m === 'DELETE' ? null : JSON.parse(r.request().postData() || 'null'); dset(u.pathname, v, m === 'PATCH'); b = v; }
    await r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(b) }); });
  await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); if (r.request().method() === 'POST') POSTS.push(r.request().postData());
    const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q); await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  return ctx; }
async function stuPage(ctx, url, id) { id = id || '30401'; const p = await ctx.newPage(); p.on('pageerror', e => E.push('平板 JS：' + e.message));
  await p.addInitScript(id => { localStorage.setItem('score_last', '"' + id + '"'); localStorage.setItem('score_id_g' + id.charAt(0), '"' + id + '"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id); try { sessionStorage.setItem('lv_intro', id); } catch (e) { } }, id);
  await p.goto(url); return p; }

const ok = (c, m) => { n++; if (!c) E.push(m); };
(async () => { const srv = await serve(), br = await chromium.launch();
  for (const vp of [[1920, 1080], [1024, 768]]) { const tag = vp.join('×'); for (const k in DB) delete DB[k];
    const G = make({ TEACHER_PW: PW }), ctx = await ctxOf(br, vp, G);
    const h = await ctx.newPage(); h.on('pageerror', e => E.push(tag + ' 大螢幕 JS：' + e.message));
    await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(400); await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(500);
    ok(await h.$('[data-sc="400"]'), tag + ' 大螢幕 沒有 400 這一班');
    await h.click('[data-sc="400"]'); await h.waitForTimeout(200); await h.click('[data-crgo]'); await h.waitForTimeout(200);
    const sets = await h.evaluate(() => [].map.call(document.querySelectorAll('[data-crs]'), b => b.textContent));
    ok(sets.indexOf('📝 成長測驗 25 題 挑戰') >= 0, tag + ' 400 看不到 成長測驗：' + sets.join('|'));
    const bx = await h.$eval('[data-crs="g25"]', b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.bottom <= innerHeight * 3 && parseFloat(getComputedStyle(b).fontSize) >= 18; }).catch(() => false);
    ok(bx, tag + ' 成長測驗 按鈕 看不到 或 字 太小');
    await h.click('[data-crs="g25"]'); await h.waitForTimeout(150); await h.click('#crstart'); await h.waitForTimeout(800);
    const cfg = DB.rooms && DB.rooms['0400'] && DB.rooms['0400'].cr;
    ok(cfg && cfg.on && cfg.set === 'g25' && cfg.d === 15 * 60000, tag + ' 開始 以後 Firebase 不對：' + JSON.stringify(cfg || null).slice(0, 120));
    /* 平板：在 現場任務 頁 ➜ 自己 跳 到 g3mid */
    const s = await stuPage(ctx, HTTP + '/live/index.html', '40001'); await s.waitForURL(/g3mid\/index\.html\?live=0400/, { timeout: 12000 }).catch(() => {});
    ok(/g3mid\/index\.html\?live=0400/.test(s.url()), tag + ' 平板（現場任務 頁）沒有 跳 到 g3mid：' + s.url());
    await s.waitForTimeout(2500);
    const st = await s.evaluate(() => ({ g: SCG, id: SCID, gp: typeof GPF === 'function' ? GPF() : '', x: typeof R !== 'undefined' && R ? R.x : null, err: !!document.querySelector('.scfull') && /年級的網站/.test(document.body.innerText) }));
    ok(st.g === 4 && st.id === '40001', tag + ' 平板 沒有 當 四年級：' + JSON.stringify(st));
    ok(st.gp === 'g4gm_g3m-', tag + ' 成績 代號 不對：' + st.gp);
    ok(!st.err, tag + ' 平板 出現「這是三年級的網站」');
    const lb = await s.evaluate(() => [].filter.call(document.querySelectorAll('#xrow [data-x]'), b => b.offsetParent).map(b => b.dataset.x + ':' + b.textContent.trim().slice(0, 20)));
    ok(lb.length === 1 && /成長測驗/.test(lb[0]), tag + ' 平板 大廳 不是 只有 成長測驗：' + lb.join('|'));
    await s.click('[data-duo="0"]').catch(() => {}); await s.waitForTimeout(200); await s.evaluate(() => { const b = [].filter.call(document.querySelectorAll('#xrow [data-x]'), b => b.offsetParent)[0]; if (b) b.click(); }); await s.waitForTimeout(2500);
    const st2 = await s.evaluate(() => ({ x: typeof R !== 'undefined' && R ? R.x : null, bk: typeof R !== 'undefined' && R ? R.bk : null }));
    ok(st2.x && st2.bk === 'G', tag + ' 成長測驗 沒有 開始：' + JSON.stringify(st2));
    /* 平板：已經 在 四年級 複習 頁 ➜ 也 會 跳 */
    const s2 = await stuPage(ctx, HTTP + '/midterm/index.html', '40002'); await s2.waitForURL(/g3mid\/index\.html\?live=0400/, { timeout: 12000 }).catch(() => {});
    ok(/g3mid\/index\.html\?live=0400/.test(s2.url()), tag + ' 平板（四年級 複習 頁）沒有 跳 到 g3mid：' + s2.url());
    /* 三年級 的 班 照舊 是 三年級 */
    const s3 = await stuPage(ctx, HTTP + '/g3mid/index.html', '30401'); await s3.waitForTimeout(600);
    ok(await s3.evaluate(() => SCG === 3 && GPF() === 'g3gm_g3m-'), tag + ' 三年級 平板 被 改到 了');
    /* 成績 ＝ g4gm_g3m-g25，伺服器 收得 下（題組 年級 ＝ 登入 年級）*/
    const SC = require('../score/_calc.js'), B = require('../score/_bank.js');
    ok(B['g4gm_g3m-g25'] && B['g4gm_g3m-g25'].qs.length === B['g3gm_g3m-g25'].qs.length, '老師看板 題庫 沒有 g4gm_g3m-g25');
    const c = SC.clean ? SC.clean({ id: '40001', set: 'g4gm_g3m-g25', m: 'g', qs: [[1, 0, 3, 0, 0.5, 0]], name: 'x', raw: 0, t: Date.now() }, Date.now()) : 1;
    ok(c, '伺服器 收不下 g4gm_g3m-g25');
    await ctx.close(); }
  await br.close(); srv.close();
  E.forEach(e => console.log('❌ ' + e)); console.log('第四十六次 400 成長測驗：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
