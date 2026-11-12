/* live/_verify_47.js — 2026-11-12 第四十七次：老師 螢幕 排行榜 拿掉 主題 名稱／恭喜 那一句／前 三名 一句 話、現場任務 1／2／3 分鐘、右上角〔⬅ 回 設定〕、
 *   開始 以後 右上角＋右下角〔⬅ 回 上一頁〕、QR 放大 不 被 切掉。只印失敗項和一行總結。node live/_verify_47.js
 *   假 的 Firebase（fake.test）、假 的 成績系統（script.test）；絕對 不 連 真的。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = ''; const ok = (c, m) => { n++; if (!c) E.push(m); };
const { make } = require('../score/_gas_stub.js'), PW = 'pw-verify', URL0 = 'https://script.test/exec';
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
const DB = {}; const seg = p => p.replace(/^\/+|\.json$/g, '').split('/').filter(Boolean);
function dget(p) { let o = DB; for (const k of seg(p)) { if (o == null || typeof o !== 'object') return null; o = o[k]; } return o === undefined ? null : o; }
function dset(p, v, patch) { const S = seg(p); let o = DB; for (let i = 0; i < S.length - 1; i++) { if (typeof o[S[i]] !== 'object' || o[S[i]] === null) o[S[i]] = {}; o = o[S[i]]; } const k = S[S.length - 1];
  if (patch && typeof o[k] === 'object' && o[k]) Object.assign(o[k], v); else if (v === null) delete o[k]; else o[k] = v; }
const inV = (b, vw, vh) => b && b.w > 0 && b.l >= -1 && b.t >= -1 && b.r <= vw + 1 && b.b <= vh + 1;
(async () => { const srv = await serve(), br = await chromium.launch();
  for (const vp of [[1920, 1080], [1024, 768]]) { const tag = vp.join('×'); for (const k in DB) delete DB[k];
    const G = make({ TEACHER_PW: PW }), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 50)); r.abort(); });
    await ctx.addInitScript(u => { window.__NOSNH = 1; window.__AWDFAST = 1; Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {} }); Object.defineProperty(window, 'LIVE_DB', { get: () => 'https://fake.test', set: () => {}, configurable: true }); window.__CRPREVOK = 1; }, URL0);
    await ctx.route(/fake\.test/, async r => { const u = new URL(r.request().url()), m = r.request().method(); let b = null;
      if (m === 'GET') b = dget(u.pathname); else { const v = m === 'DELETE' ? null : JSON.parse(r.request().postData() || 'null'); dset(u.pathname, v, m === 'PATCH'); b = v; }
      await r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(b) }); });
    await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q); await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
    const h = await ctx.newPage(); const errs = []; h.on('pageerror', e => errs.push(e.message));
    await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(400); await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(500);
    await h.click('[data-sc="304"]'); await h.waitForTimeout(200); await h.click('[data-crgo]'); await h.waitForTimeout(200); await h.click('[data-crs="x25"]'); await h.waitForTimeout(150);
    /* 3-(1) 快下課 1／2／3 分鐘 */
    const s1 = await h.evaluate(() => ({ qk: [...document.querySelectorAll('.crmin.qk')].map(b => +b.getAttribute('data-crmin')), tr: (() => { const b = document.getElementById('crback2'); if (!b) return null; const r = b.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, fs: parseFloat(getComputedStyle(b).fontSize) }; })() }));
    ok(s1.qk.join() === '1,2,3,5,8,10', tag + ' 快下課 不是 1 2 3 5 8 10 分鐘 ' + s1.qk);
    ok(inV(s1.tr, vp[0], vp[1]) && s1.tr.t < 80 && s1.tr.r > vp[0] - 40 && s1.tr.fs >= 20, tag + ' 右上角 沒有〔⬅ 回 設定〕' + JSON.stringify(s1.tr));
    await h.click('[data-crmin="1"]'); await h.waitForTimeout(100);
    ok(await h.evaluate(() => crMin() === 1 && document.querySelector('[data-crmin="1"]').classList.contains('on')), tag + ' 按〔1 分鐘 作答〕沒有 選 起來');
    /* 右上角 回 設定 ＝ 回到 現場任務 設定 */
    await h.click('#crback2'); await h.waitForTimeout(150); ok(await h.evaluate(() => H.scr === 'hset'), tag + '〔⬅ 回 設定〕（右上角）沒有 回到 設定');
    await h.click('[data-crgo]'); await h.waitForTimeout(150); await h.click('[data-crs="x25"]'); await h.click('[data-crmin="2"]'); await h.click('#crstart'); await h.waitForTimeout(900);
    const cr = dget('rooms/0304/cr'); ok(cr && cr.on === 1 && cr.d === 120000 && cr.qk === 1, tag + ' 2 分鐘 快速 模式 寫 的 Firebase 不對 ' + JSON.stringify(cr || {}).slice(0, 120));
    /* 3-(3) 開始 以後 右上角＋右下角〔⬅ 回 上一頁〕；只 剩 1、2 分鐘 */
    const s2 = await h.evaluate(() => { const R = e => { const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width }; };
      const pv = [...document.querySelectorAll('#hcrr .crprev')].filter(e => e.offsetParent || getComputedStyle(e).position === 'fixed').map(R), q = document.getElementById('hqrc');
      return { pv, qr: q && !q.hidden ? R(q) : null, left: [...document.querySelectorAll('[data-crleft]')].map(b => +b.getAttribute('data-crleft')), th: (document.querySelector('.crlbth') || {}).textContent || '', scr: H.scr }; });
    ok(s2.scr === 'hcrr' && s2.pv.length === 2 && s2.pv.every(b => inV(b, vp[0], vp[1])), tag + ' 開始 以後 沒有 兩顆〔⬅ 回 上一頁〕' + JSON.stringify(s2.pv));
    if (s2.pv.length === 2) { const [a, b] = s2.pv.sort((x, y) => x.t - y.t); ok(a.t < 90 && a.r > vp[0] - 40, tag + '〔回 上一頁〕不在 右上角 ' + JSON.stringify(a)); ok(b.b > vp[1] - 40 && b.r > vp[0] * .5, tag + '〔回 上一頁〕不在 右下角 ' + JSON.stringify(b));
      ok(!s2.qr || b.r <= s2.qr.l + 1 || b.b <= s2.qr.t + 1, tag + '〔回 上一頁〕蓋住 QR ' + JSON.stringify([b, s2.qr])); }
    ok(s2.left.join() === '1,2,3,5,8,10', tag + ' ⏱ 只 剩 不是 1 2 3 5 8 10 分鐘 ' + s2.left);
    ok(!s2.th, tag + ' 排行榜 還有 主題 名稱 ' + s2.th);
    /* 3-(4) QR 放大 不 被 切掉 */
    await h.evaluate(() => qrBig(true)); await h.waitForTimeout(150);
    const qb = await h.evaluate(() => { const r = document.querySelector('#qrbig .qrbb').getBoundingClientRect(), all = [...document.querySelectorAll('#qrbig .qrbw > *')].map(e => e.getBoundingClientRect()); return { qr: { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width }, out: all.filter(x => x.top < -1 || x.bottom > innerHeight + 1).length }; });
    ok(inV(qb.qr, vp[0], vp[1]) && qb.qr.w >= 280 && !qb.out, tag + ' QR 放大 以後 被 切掉 或 太 小 ' + JSON.stringify(qb));
    await h.evaluate(() => qrBig(false));
    /* 回 上一頁 ＝ 結束 這一場、回到 設定 頁 */
await h.click('#hcrr .crprev.crtr', { timeout: 3000 }).catch(async () => E.push(tag + ' 按不到 回 上一頁 ' + JSON.stringify(await h.evaluate(() => ({ scr: H.scr, n: document.querySelectorAll('.crprev').length, par: [...document.querySelectorAll('.crprev')].map(e => e.parentElement.id), cfg: !!CRS.cfg }))))); await h.waitForTimeout(400);
    ok(await h.evaluate(() => H.scr === 'hcr'), tag + '〔⬅ 回 上一頁〕沒有 回到 這一套 的 設定 頁');
    ok((dget('rooms/0304/cr') || {}).on === 0, tag + '〔⬅ 回 上一頁〕沒有 先 結束 這一場');
    /* 1 排行榜／頒獎 典禮：沒有 主題 名稱、恭喜 那一句、前 三名 一句 話 */
    const aw = await h.evaluate(async () => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;inset:0;z-index:99'; document.body.appendChild(d);
      AWD.play(d, { kick: '304 班', title: '🏆 測試', rows: [1, 2, 3, 4].map(k => ({ rk: k, code: '3040' + k, nm: '測試' + k, sc: (100 - k) + ' 分' })) }, {}); await new Promise(s => setTimeout(s, 4500));
      const t = d.textContent; const r = { thm: !!d.querySelector('.awthm'), hon: d.querySelectorAll('.awhon').length, yx: /用心 被 看見/.test(t), names: AWD.TH.filter(x => t.indexOf(x.nm) >= 0).map(x => x.nm) }; AWD.stop(d); d.remove(); return r; });
    ok(!aw.thm && !aw.hon && !aw.yx && !aw.names.length, tag + ' 頒獎 典禮 還有 主題 名稱／前 三名 一句 話／恭喜 那一句 ' + JSON.stringify(aw));
    ok(!errs.length, tag + ' 大螢幕 JS 錯誤：' + errs.slice(0, 3).join(' | '));
    await ctx.close();
  }
  await br.close(); srv.close();
  E.forEach(e => console.log('❌ ' + e)); console.log('第四十七次 現場任務：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0);
})();
