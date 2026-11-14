/* g3mid/_verify_52.js — 2026-11-14 第五十二次 第 7 點：🔠 A～Z 依序 背寫（⚡ 現場任務 set az）（借 live/_verify_cr.js 的 假 Firebase／假 成績系統）：🏫 三年級 課堂複習 在〔⚡ 現場任務〕開（〔👥 全班 同步〕〔🙋 學生 自己 答〕）。只印失敗項和一行總結。
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
  for (const vp of [[1920, 1080], [1366, 1024], [1024, 768]]) { const tag = vp.join('×'); for (const k in DB) delete DB[k]; POSTS.length = 0;
    const G = make({ TEACHER_PW: PW }), ctx = await ctxOf(br, vp, G);
    const h = await ctx.newPage(); h.on('pageerror', e => E.push(tag + ' 大螢幕 JS：' + e.message));
    await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(400); await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(500);
    for (const cls of ['304', '400']) {
      await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(400); if (await h.$('#pw')) { await h.fill('#pw', PW).catch(() => {}); await h.click('#pwgo').catch(() => {}); await h.waitForTimeout(500); } await h.click('[data-sc="' + cls + '"]'); await h.waitForTimeout(200); await h.click('[data-crgo]'); await h.waitForTimeout(200);
      const sets = await h.evaluate(() => [].map.call(document.querySelectorAll('[data-crs]'), b => b.textContent));
      ok(sets.indexOf('🔠 A～Z 依序 背寫') >= 0, tag + ' ' + cls + ' 大螢幕 沒有 A～Z：' + sets.join('|'));
      await h.click('[data-crs="az"]'); await h.waitForTimeout(150);
      const ui = await h.evaluate(() => ({ s: [].map.call(document.querySelectorAll('[data-cras]'), b => b.textContent), f: Math.min.apply(0, [].map.call(document.querySelectorAll('[data-cras]'), b => parseFloat(getComputedStyle(b).fontSize))), on: (document.querySelector('[data-cras].on') || {}).textContent }));
      ok(ui.s.join() === '15 秒,20 秒,25 秒,30 秒' && ui.on === '25 秒', tag + ' 一頁 幾 秒 按鈕 不對：' + JSON.stringify(ui));
      ok(ui.f >= 18, tag + ' 秒數 按鈕 字 太小 ' + ui.f);
      await h.click('[data-cras="20"]'); await h.waitForTimeout(100); await h.click('#crstart'); await h.waitForTimeout(800);
      const cfg = DB.rooms && DB.rooms['0' + cls] && DB.rooms['0' + cls].cr;
      ok(cfg && cfg.on && cfg.set === 'az' && cfg.as === 20 && cfg.d === 5 * 60000, tag + ' ' + cls + ' Firebase 不對：' + JSON.stringify(cfg || null).slice(0, 140));
      const qr = await h.evaluate(() => taskURL());
      ok(/g3mid\/index\.html\?live=0/.test(qr), tag + ' ' + cls + ' QR 網址 不是 g3mid：' + qr);
      /* 平板 */
      const id = cls === '400' ? '40001' : '30401', s = await stuPage(ctx, HTTP + (cls === '400' ? '/midterm/index.html' : '/live/index.html'), id);
      await s.waitForURL(/g3mid\/index\.html\?live=0/, { timeout: 12000 }).catch(() => {}); ok(/g3mid\/index\.html\?live=0/.test(s.url()), tag + ' ' + cls + ' 平板 沒有 跳 到 g3mid：' + s.url());
      await s.waitForTimeout(2200);
      const lb = await s.evaluate(() => { const b = document.querySelector('#xrow [data-lw]'); return b ? b.dataset.lw + '|' + b.textContent : ''; });
      ok(/^az\|/.test(lb) && /26 個 字母/.test(lb), tag + ' ' + cls + ' 平板 大廳 按鈕 不對：' + lb);
      await s.evaluate(() => { window.__NOLWI = 0; window.__NOGO = 0; }); await s.click('#xrow [data-lw]').catch(() => {}); await s.waitForTimeout(600);
      const it = await s.evaluate(() => ({ h: (document.querySelector('.azi .azh') || {}).textContent || '', n: document.querySelectorAll('.azi .azr span').length, b: (document.getElementById('lwgo') || {}).textContent || '' }));
      ok(/依 順序/.test(it.h) && it.n === 26 && /26 個 字母/.test(it.b), tag + ' ' + cls + ' 開始 前 秒懂 動畫 不對：' + JSON.stringify(it));
      await s.evaluate(() => { window.__NOGO = 1; const o = document.querySelector('.lwi'); if (o) o.remove(); goSplash(next); }); await s.waitForTimeout(1500);
      const st = await s.evaluate(() => ({ az: R.az, k: R.k, t: G.t, ord: R.qs.map(q => q.up + q.lo).join(''), cells: document.querySelectorAll('.azs i').length, ph: (document.querySelector('.azq .azn') || {}).textContent || '', tag: (document.querySelector('.wleft .ask') || {}).textContent || '', pad: (() => { const c = document.querySelector('.wrt canvas'); if (!c) return 0; const r = c.getBoundingClientRect(); return Math.min(r.width, r.height); })(), ov: document.documentElement.scrollWidth > innerWidth + 2 }));
      ok(st.az === 1 && st.k === 0 && st.t === 20, tag + ' ' + cls + ' 沒有 開始 或 秒數 不對：' + JSON.stringify(st).slice(0, 160));
      ok(st.ord === 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz', tag + ' ' + cls + ' 順序 不是 A～Z：' + st.ord);
      ok(st.cells === 26 && /第 1 個 字母/.test(st.ph) && /大/.test(st.tag), tag + ' ' + cls + ' 第 1 頁 不對：' + JSON.stringify(st).slice(0, 200));
      ok(st.pad >= Math.min(vp[1] * 0.35, 300), tag + ' ' + cls + ' 四線格 太小（手指 不好 寫）' + st.pad);
      ok(!st.ov, tag + ' ' + cls + ' 畫面 超出（橫 捲）');
      const small = await s.evaluate(() => [].filter.call(document.querySelectorAll('.azs i,.azq span,.glstep span,.wleft .ask'), e => e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 14).length);
      ok(!small, tag + ' ' + cls + ' 有 ' + small + ' 個 字 太小');
      /* A：大寫 對 ➜ 小寫 對 ➜ 下一頁 */
      await s.evaluate(() => WOK(R.glq, document.querySelector('.wleft'))); await s.waitForTimeout(400);
      ok(await s.evaluate(() => R.glq.want === 'a' && /②/.test(document.querySelector('.wleft .ask').textContent)), tag + ' ' + cls + ' 大寫 對了 沒有 換 小寫');
      await s.evaluate(() => { R.lastLn = { dmx: 0.05 }; WOK(R.glq, document.querySelector('.wleft')); }); for (let t = 0; t < 300 && !(await s.evaluate(() => R.k === 1 && !!document.querySelector('.azq'))); t++) { await s.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(x => x.offsetParent && /下一題|繼續|下一個|➡/.test(x.textContent))[0]; if (b) b.click(); }); await s.waitForTimeout(100); } await s.waitForTimeout(300);
      const a2 = await s.evaluate(() => ({ k: R.k, q0: R.Q[0] && R.Q[0][0], mg: R.mg[0], sc: R.score, ph: (document.querySelector('.azq .azn') || {}).textContent || '', done: (document.querySelector('.azs i.ok') || {}).textContent || '' }));
      ok(a2.k === 1 && a2.q0 === 1 && a2.mg > 0 && a2.sc > 0 && /第 2 個/.test(a2.ph) && /Aa/.test(a2.done), tag + ' ' + cls + ' A 寫對 以後 不對：' + JSON.stringify(a2));
      /* B：大寫 寫錯 ➜ 答錯頁（兩個 正確 字母）➜ 下一頁 */
      await s.evaluate(() => { window.__NOGO = 0; miss('draw'); }); await s.waitForTimeout(700);
      const fb = await s.evaluate(() => ({ on: document.getElementById('fb').classList.contains('on'), az: (document.querySelector('#fbx .azfb') || {}).textContent || '', cv: document.querySelectorAll('#ltr canvas').length, ov: (() => { const b = document.getElementById('fbx'); return b ? b.scrollHeight > b.clientHeight + 4 && getComputedStyle(b).overflowY === 'hidden' : false; })() }));
      ok(fb.on && /第 2 個 字母/.test(fb.az) && /B b/.test(fb.az) && /A a 的 下一個/.test(fb.az) && fb.cv >= 2, tag + ' ' + cls + ' 答錯頁 不對：' + JSON.stringify(fb));
      ok(!fb.ov, tag + ' ' + cls + ' 答錯頁 被 切掉');
      /* 時間 到（5 分鐘）＝ 送 成績：26 題、正確率 1／26、遊戲 積分 百分制 */
      POSTS.length = 0; await s.evaluate(() => xForce()); await s.waitForTimeout(1500); await s.evaluate(() => { try { scFlush(); } catch (e) { } }); await s.waitForTimeout(1500);
      const P = POSTS.map(x => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean), recs = [];
      P.forEach(p => (p.q || p.rows || []).forEach(r => recs.push(r)));
      const want = (cls === '400' ? 'g4' : 'g3') + 'gm_az-q5', r = recs.filter(x => x.set === want)[0] || JSON.parse((POSTS.join('').match(new RegExp('\\{[^{}]*"set":"' + want + '"[^{}]*\\}')) || ['null'])[0]);
      ok(!!r, tag + ' ' + cls + ' 沒有 送 ' + want + '：' + POSTS.join('').slice(0, 160));
      if (r) { ok(r.qs.length === 26 && r.qs.filter(q => q[0]).length === 1, tag + ' ' + cls + ' 題數／正確 不對 ' + r.qs.length);
        ok(r.raw > 0 && r.raw <= 100, tag + ' ' + cls + ' 遊戲 積分 不是 百分制 ' + r.raw); }
      await s.close(); await h.click('#crend').catch(() => {}); await h.waitForTimeout(300);
    }
    await ctx.close(); }
  /* 老師看板：🔠 A～Z 兩個 成績 */
  { const G = make({ TEACHER_PW: PW }), ctx = await ctxOf(br, [1366, 1024], G), t = await ctx.newPage(); t.on('pageerror', e => E.push('老師看板 JS：' + e.message));
    await t.goto(HTTP + '/teacher/index.html'); await t.waitForTimeout(300);
    const html = await t.evaluate(() => { const Q = []; for (let i = 0; i < 26; i++) Q.push([i < 20 ? 1 : 0, 0, 3, 0, 0.5, i]); ALL.push({ id: '30412', cls: '304', set: 'g3gm_az-q5', qs: Q, raw: 62.4, t: Date.now(), x: false }); G3S = 'az'; G3C = '304'; window.range = () => ({ from: null, to: null }); try { RCLS['304'] = RCLS['304'] || []; } catch (e) { } return paneGT(); }).catch(e => 'ERR ' + e.message);
    ok(/💯/.test(html) && /🎮/.test(html) && /77/.test(html) && /62/.test(html) && /20 ／ 26/.test(html) && />T</.test(html), '老師看板 A～Z 表 不對：' + html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300));
    await ctx.close(); }
  await br.close(); srv.close();
  E.forEach(e => console.log('❌ ' + e)); console.log('第五十二次 🔠 A～Z 依序 背寫：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
