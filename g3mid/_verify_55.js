/* g3mid/_verify_55.js（第五十五次：從 _verify_52.js 改；老師看板 表 在 _verify_52.js）── 原本：g3mid/_verify_52.js — 2026-11-14 第五十二次 第 7 點：🔠 A～Z 依序 背寫（⚡ 現場任務 set az）（借 live/_verify_cr.js 的 假 Firebase／假 成績系統）：🏫 三年級 課堂複習 在〔⚡ 現場任務〕開（〔👥 全班 同步〕〔🙋 學生 自己 答〕）。只印失敗項和一行總結。
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
async function stuPage(ctx, url, id) { id = id || '30401'; const p = await ctx.newPage(); p.on('pageerror', e => E.push('平板 JS：' + e.message + ' @' + String(e.stack).split('\n').slice(1,3).join(' ')));
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
      ok(cfg && cfg.on && cfg.set === 'az' && cfg.as === 20 && cfg.d === 11 * 60000, tag + ' ' + cls + ' Firebase 不對：' + JSON.stringify(cfg || null).slice(0, 140));
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
      /* 第五十五次 (2)：寫錯 ➜ 安靜 的 書寫 動畫（不 唸）➜ 自己 下一頁 */
      const p0 = await s.evaluate(() => { window.__PLAYS = 0; HTMLMediaElement.prototype.play = function () { window.__PLAYS++; const a = this; setTimeout(() => a.onended && a.onended(), 40); return Promise.resolve(); }; return 0; });
      await s.evaluate(() => { window.__NOGO = 0; miss('draw'); }); await s.waitForTimeout(900);
      const fb = await s.evaluate(() => { const o = document.getElementById('azov'); return { on: !!o, t: o ? o.innerText : '', cv: o ? o.querySelectorAll('canvas').length : 0, old: document.getElementById('fb').classList.contains('on'), plays: window.__PLAYS || 0, ov: o ? o.scrollWidth > innerWidth + 2 : false,
        ink: (() => { const c = o && o.querySelector('canvas'); if (!c) return 0; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let k = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 2] > 100 && d[i] < 80) k++; return k; })() }; });
      ok(fb.on && /第 2 個 字母/.test(fb.t) && /B b/.test(fb.t) && /安靜/.test(fb.t) && fb.cv === 2 && !fb.old, tag + ' ' + cls + ' 寫錯 的 書寫 動畫 不對：' + JSON.stringify(fb).slice(0, 220));
      ok(fb.plays === 0, tag + ' ' + cls + ' 寫錯 動畫 不可以 唸 出 聲音（' + fb.plays + '）');
      ok(fb.ink > 50, tag + ' ' + cls + ' 書寫 動畫 沒有 畫 出 筆畫 ' + fb.ink); ok(!fb.ov, tag + ' ' + cls + ' 書寫 動畫 超出 畫面');
      await s.waitForFunction(() => R.k === 2 && !document.getElementById('azov'), null, { timeout: 15000 }).catch(() => E.push(tag + ' ' + cls + ' 書寫 動畫 以後 沒有 自己 下一頁'));
      /* (1)B 開始 前 的 新 動畫：分數、J 一橫 */
      const iv = await s.evaluate(() => { const b = document.createElement('div'); azScore(b); const t1 = b.innerText; const c = document.createElement('div'); azJ(c); return { t1, t2: c.innerText, cv: c.querySelectorAll('canvas').length }; });
      ok(/💯 正確率/.test(iv.t1) && /🎮 遊戲 分數/.test(iv.t1) && /÷ 26/.test(iv.t1) && /第二次/.test(iv.t1), tag + ' 分數 說明 不對 ' + iv.t1.slice(0, 120));
      ok(/J/.test(iv.t2) && /一橫/.test(iv.t2) && iv.cv >= 2, tag + ' J 一橫 動畫 不對 ' + JSON.stringify(iv).slice(0, 160));
      /* 時間 到（11 分鐘）＝ 送 第一次 ➜ 錯題 統整 ➜ 整頁 A～Z（錯 的 黃色）➜ 第二次 只 寫 錯 的 */
      POSTS.length = 0; await s.evaluate(() => { window.__NOGO = 1; xForce(); }); await s.waitForTimeout(400);
      const bd = await s.evaluate(() => new Promise(r => { let n = 0; const t = setInterval(() => { const g = document.getElementById('azcd') ? document.querySelectorAll('#azov .azgrid i').length : 0; if (g === 26 || ++n > 600) { clearInterval(t); r({ g, w: document.querySelectorAll('#azov .azgrid i.w').length, cd: !!document.getElementById('azcd') }); } }, 25); }));
      ok(bd.g === 26 && bd.w === 25 && bd.cd, tag + ' ' + cls + ' 第二次 前 的 整頁 A～Z 不對 ' + JSON.stringify(bd));
      await s.waitForFunction(() => R && R.azr === 2 && R.k === 0, null, { timeout: 8000 }).catch(() => {});
      const r2 = await s.evaluate(() => ({ azr: R.azr, n: R.qs.length, first: R.qs[0] && R.qs[0].up, gnm: document.getElementById('gnm').textContent }));
      ok(r2.azr === 2 && r2.n === 25 && r2.first === 'B' && /第二次/.test(r2.gnm), tag + ' ' + cls + ' 第二次 沒有 開始 ' + JSON.stringify(r2));
      await s.evaluate(() => { try { scFlush(); } catch (e) { } }); await s.waitForTimeout(1500);
      const recOf = want => { const P = POSTS.map(x => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean), recs = []; P.forEach(p => (p.q || p.rows || []).forEach(r => recs.push(r))); return recs.filter(x => x.set === want)[0] || JSON.parse((POSTS.join('').match(new RegExp('\\{[^{}]*"set":"' + want + '"[^{}]*\\}')) || ['null'])[0]); };
      const gp = cls === '400' ? 'g4' : 'g3', r1 = recOf(gp + 'gm_az-q5');
      ok(r1 && r1.qs.length === 26 && r1.qs.filter(q => q[0]).length === 1, tag + ' ' + cls + ' 第一次 成績 不對 ' + (r1 ? r1.qs.length : 'null'));
      /* 第二次：寫對 23 個、錯 2 個 ➜ 送 q6 ➜ 等 老師 決定 第三次 */
      POSTS.length = 0;
      await s.evaluate(() => { R.Q = R.qs.map((q, i) => [i < 23 ? 1 : 0, 0, 3, 0, 0.5, G.B.indexOf(q)]); R.res = R.qs.map((q, i) => i < 23 ? 1 : 0); R.k = R.qs.length; R.score = 23 * 300; end(); });
      await s.waitForTimeout(1500); await s.evaluate(() => { try { scFlush(); } catch (e) { } }); await s.waitForTimeout(1500);
      const r6 = recOf(gp + 'gm_az-q6');
      ok(r6 && r6.qs.length === 25 && r6.qs.filter(q => q[0]).length === 23 && r6.raw > 0 && r6.raw <= 100, tag + ' ' + cls + ' 第二次 成績 不對 ' + JSON.stringify(r6 && { n: r6.qs.length, raw: r6.raw }));
      const w3 = await s.evaluate(() => (document.getElementById('azov') || {}).innerText || '');
      ok(/第三次/.test(w3) && /Yy/.test(w3) && /Zz/.test(w3), tag + ' ' + cls + ' 等 老師 決定 第三次 的 畫面 不對 ' + w3.slice(0, 120));
      const az2r = DB.rooms && DB.rooms['0' + cls] && DB.rooms['0' + cls].az2 && DB.rooms['0' + cls].az2[id];
      ok(az2r && az2r.r === 2 && az2r.ok === 23 && az2r.n === 25 && /Yy/.test(az2r.w), tag + ' ' + cls + ' 大螢幕 收不到 第二次 結果 ' + JSON.stringify(az2r));
      /* 大螢幕：〔🔠 第三次：老師 決定〕➜〔🔓 開 第三次〕➜ 平板 開始 第三次 */
      await h.waitForSelector('#az3b', { timeout: 8000 }).catch(() => E.push(tag + ' ' + cls + ' 大螢幕 沒有〔🔠 第三次〕按鈕'));
      await h.click('#az3b').catch(() => {}); await h.waitForTimeout(300);
      const tb = await h.evaluate(() => { const o = document.getElementById('az3p'); return o ? { t: o.innerText, b: document.querySelectorAll('[data-az3]').length, f: Math.min.apply(0, [].map.call(document.querySelectorAll('.az3t td'), e => parseFloat(getComputedStyle(e).fontSize))) } : null; });
      ok(tb && tb.b === 1 && /Yy/.test(tb.t) && tb.f >= 18, tag + ' ' + cls + ' 大螢幕 第三次 表 不對 ' + JSON.stringify(tb).slice(0, 200));
      await h.click('[data-az3]').catch(() => {}); await h.waitForTimeout(300);
      await s.waitForFunction(() => R && R.azr === 3 && R.k === 0, null, { timeout: 12000 }).catch(() => {});
      const r3 = await s.evaluate(() => ({ azr: R.azr, n: R.qs.length, L: R.qs.map(q => q.up).join('') }));
      ok(r3.azr === 3 && r3.n === 2 && r3.L === 'YZ', tag + ' ' + cls + ' 第三次 沒有 開始 ' + JSON.stringify(r3));
      await h.click('#az3x').catch(() => {});
      await s.close(); await h.click('#crend').catch(() => {}); await h.waitForTimeout(300);
    }
    await ctx.close(); }
  await br.close(); srv.close();
  E.forEach(e => console.log('❌ ' + e)); console.log('第五十五次 🔠 A～Z（11 分鐘、安靜 書寫 動畫、第二次、第三次）：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
