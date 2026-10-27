/* live/_verify_cr.js — 2026-10-26 第二十九次 第 1 點：🏫 三年級 課堂複習 在〔⚡ 現場任務〕開（〔👥 全班 同步〕〔🙋 學生 自己 答〕）。只印失敗項和一行總結。
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
  await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); Object.defineProperty(window, 'LIVE_DB', { get: () => 'https://fake.test', set: () => {}, configurable: true });
    window.__NOGO = 1; HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 40); return Promise.resolve(); }; }, URL0);
  await ctx.route(/fake\.test/, async r => { const u = new URL(r.request().url()), m = r.request().method(); let b = null;
    if (m === 'GET') b = dget(u.pathname); else { const v = m === 'DELETE' ? null : JSON.parse(r.request().postData() || 'null'); dset(u.pathname, v, m === 'PATCH'); b = v; }
    await r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(b) }); });
  await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); if (r.request().method() === 'POST') POSTS.push(r.request().postData());
    const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q); await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  return ctx; }
async function stuPage(ctx, url, id) { id = id || '30401'; const p = await ctx.newPage(); p.on('pageerror', e => E.push('平板 JS：' + e.message));
  await p.addInitScript(id => { localStorage.setItem('score_last', '"' + id + '"'); localStorage.setItem('score_id_g' + id.charAt(0), '"' + id + '"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id); try { sessionStorage.setItem('lv_intro', id); } catch (e) { } }, id);
  await p.goto(url); return p; }
const ans = p => p.evaluate(() => { const q = R.q, id = G.id; if (id === 'q1') { [].find.call(document.querySelectorAll('.hole'), h => h.dataset.v === q.o[0]).click(); return 1; }
  if (id === 'q10') { const c = [].find.call(document.querySelectorAll('[data-v],[data-c],.crate'), x => (x.dataset.v || x.dataset.c || x.textContent).indexOf(q.code) >= 0); if (c) { c.click(); return 1; } } return 0; });
(async () => { const srv = await serve(), br = await chromium.launch();
  for (const vp of [[1920, 1080], [1024, 768]]) { const tag = vp.join('×'); for (const k in DB) delete DB[k];
    const G = make({ TEACHER_PW: PW }), ctx = await ctxOf(br, vp, G);
    const h = await ctx.newPage(); const errs = []; h.on('pageerror', e => errs.push(e.message));
    await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(400); await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(500);
    /* 2026-10-27 第三十次：四年級 的 班 ＝〔📝 四年級 複習〕（兩套：四年級 複習 11 種、🪤 四年級 複習 0 ＝ 陷阱 偵測器）*/
    await h.click('[data-sc="402"]'); await h.waitForTimeout(200); await h.click('[data-crgo]'); await h.waitForTimeout(200);
    n++; const s4 = await h.evaluate(() => ({ scr: H.scr, h1: document.querySelector('#hcr h1').textContent, sets: [].map.call(document.querySelectorAll('[data-crs]'), b => b.textContent), gs: [].map.call(document.querySelectorAll('[data-crg]'), b => b.textContent) }));
    if (s4.scr !== 'hcr' || !/四年級 複習/.test(s4.h1) || s4.sets.join('|') !== '📝 四年級 複習|🪤 四年級 複習 0' || s4.gs.length !== 11 || s4.gs.some(t => /陷阱/.test(t)) || !/字首音/.test(s4.gs[0])) E.push(tag + ' 四年級 複習 設定 畫面 ' + JSON.stringify(s4).slice(0, 300));
    await h.click('[data-crs="mt0"]'); await h.waitForTimeout(150); n++; const g0 = await h.evaluate(() => [].map.call(document.querySelectorAll('[data-crg]'), b => b.textContent));
    if (g0.length !== 1 || !/陷阱/.test(g0[0]) || !/☑/.test(g0[0])) E.push(tag + ' 🪤 四年級 複習 0 不是 只有 陷阱 偵測器 ' + JSON.stringify(g0));
    await h.click('#crback'); await h.waitForTimeout(150);
    await h.click('[data-sc="304"]'); await h.waitForTimeout(200); await h.click('[data-crgo]'); await h.waitForTimeout(200);
    n++; const s0 = await h.evaluate(() => ({ scr: H.scr, sets: [].map.call(document.querySelectorAll('[data-crs]'), b => b.textContent), gs: [].map.call(document.querySelectorAll('[data-crg]'), b => b.textContent), sm: [].filter.call(document.querySelectorAll('#hcr button'), b => b.getBoundingClientRect().height < 48 || parseFloat(getComputedStyle(b).fontSize) < 18).length }));
    if (s0.scr !== 'hcr' || s0.sets.length !== 4 || !/課堂複習 1/.test(s0.sets.join()) || s0.gs.length !== 10 || !/第 9 關.*夾娃娃/.test(s0.gs[8]) || !/第 10 關.*小精靈/.test(s0.gs[9]) || s0.sm) E.push(tag + ' 課堂複習 設定 畫面 ' + JSON.stringify(s0).slice(0, 300));
    /* 〔👥 全班 同步〕課堂複習 1：打地鼠、空投 */
    await h.click('[data-crs="c1"]'); await h.click('[data-cra="0"]'); await h.click('[data-crg="q1"]'); await h.click('[data-crg="q10"]'); await h.click('[data-crm="sync"]'); await h.click('#crstart'); await h.waitForTimeout(500);
    n++; const cr = dget('rooms/0304/cr'); if (!cr || cr.on !== 1 || cr.set !== 'c1' || cr.m !== 'sync' || cr.deck.length !== 16 || cr.q !== 0 || cr.deck[0][0] !== 'q1' || cr.deck[15][0] !== 'q10') E.push(tag + ' 同步 開始 寫 的 Firebase 不對 ' + JSON.stringify(cr).slice(0, 200));
    /* 學生：現場任務 頁 自己 跳 過去 */
    const s = await stuPage(ctx, HTTP + '/live/index.html'); await s.waitForURL(/g3mid\/index\.html\?live=0304/, { timeout: 12000 }).catch(() => {});
    n++; if (!/g3mid\/index\.html\?live=0304/.test(s.url())) E.push(tag + ' 現場任務 平板 沒有 自己 跳到 課堂複習 ' + s.url());
    await s.waitForTimeout(2500);
    n++; const q0 = await s.evaluate(() => ({ g: !document.getElementById('game').hidden, nm: document.getElementById('gnm').textContent, id: G.id, set: crSet(), home: getComputedStyle(document.querySelector('#lobby .home')).display }));
    if (!q0.g || !/第 1 ／ 16 題/.test(q0.nm) || q0.id !== 'q1' || q0.set !== 'c1') E.push(tag + ' 平板 沒有 出現 第 1 題 ' + JSON.stringify(q0));
    await s.waitForTimeout(1300); await ans(s); await s.waitForTimeout(2600);
    n++; const w1 = await s.evaluate(() => ({ on: document.getElementById('crw').classList.contains('on'), t: document.getElementById('crw').textContent })); if (!w1.on || !/答對/.test(w1.t) || !/等 老師/.test(w1.t)) E.push(tag + ' 答完 沒有「答對 了，等 老師」' + JSON.stringify(w1));
    n++; const a1 = dget('rooms/0304/cra/' + cr.t + '_0'); if (!a1 || a1['30401'] !== 1) E.push(tag + ' 答案 沒有 寫到 cra ' + JSON.stringify(a1));
    await h.waitForTimeout(1600); n++; const hv = await h.evaluate(() => document.getElementById('hcrr').textContent); if (!/已經 答 1 人/.test(hv) || !/答對 1 人/.test(hv)) E.push(tag + ' 大螢幕 沒有 看到 幾個 人 答 ' + hv.slice(0, 120));
    await h.click('#crrv'); n++; if (!(await h.$('.crans'))) E.push(tag + '〔👀 公布 答案〕沒有 答案');
    await h.click('#crnx'); await h.waitForTimeout(2200);
    n++; const q1 = await s.evaluate(() => ({ g: !document.getElementById('game').hidden, nm: document.getElementById('gnm').textContent })); if (!q1.g || !/第 2 ／ 16 題/.test(q1.nm)) E.push(tag + ' 老師 按 下一題 平板 沒有 換 ' + JSON.stringify(q1));
    /* 第 2 題 沒 答 老師 就 結束 ➜ 算 答錯；成績 送出（g3gm_c1-q1，2 題） */
    await h.click('#crend'); await h.waitForTimeout(2500);
    n++; const e1 = await s.evaluate(() => ({ t: document.getElementById('crw').textContent, q: JSON.parse(localStorage.getItem('score_q') || '[]').concat([]) }));
    const sent = POSTS.map(x => { try { return JSON.parse(x); } catch (e) { return {}; } }).filter(x => x.r && /^g3gm_c1-q1$/.test(x.r.set) || x.recs && x.recs.some(r => r.set === 'g3gm_c1-q1'));
    if (!/結束/.test(e1.t) || !sent.length && !e1.q.some(r => r.set === 'g3gm_c1-q1')) E.push(tag + ' 結束 以後 沒有 送 成績 g3gm_c1-q1 ' + e1.t.slice(0, 40) + ' ' + POSTS.length);
    n++; const res = await h.evaluate(() => document.getElementById('hcrr').textContent); if (!/結束 了/.test(res) || !/打地鼠/.test(res)) E.push(tag + ' 大螢幕 結束 沒有 每一種 遊戲 的 結果 ' + res.slice(0, 100));
    /* 〔🙋 學生 自己 答〕三年級 複習：只 有 空投 */
    await h.click('#crhome'); await h.click('[data-crgo]'); await h.click('[data-crs="g3m"]'); await h.click('[data-cra="0"]'); await h.click('[data-crg="q10"]'); await h.click('[data-crm="self"]'); await h.click('#crstart'); await h.waitForTimeout(2600);
    n++; const lb = await s.evaluate(() => ({ cards: [].filter.call(document.querySelectorAll('#grid .gc'), b => b.style.display !== 'none').map(b => b.textContent.slice(0, 12)), x: document.getElementById('xrow').innerHTML, lob: !document.getElementById('lobby').hidden }));
    if (!lb.lob || lb.cards.length !== 1 || !/空投/.test(lb.cards[0]) || lb.x) E.push(tag + ' 自己 答 的 大廳 不是 只有 老師 選 的 遊戲 ' + JSON.stringify(lb));
    await s.evaluate(() => start(GM.findIndex(g => g.id === 'q10'))); await s.waitForTimeout(1500); await ans(s); await s.waitForTimeout(1800);
    n++; const p1 = dget('rooms/0304/crp/30401'); if (!p1 || p1.n !== 1 || p1.ok !== 1 || p1.g !== 'q10') E.push(tag + ' 自己 答 的 進度 沒有 寫 crp ' + JSON.stringify(p1));
    await h.waitForTimeout(1600); n++; const hs = await h.evaluate(() => document.getElementById('hcrr').textContent); if (!/已經 開始 1 人/.test(hs) || !/1 號/.test(hs)) E.push(tag + ' 大螢幕 沒有 看到 誰 在 做 ' + hs.slice(0, 120));
    await h.click('#crend'); await h.waitForTimeout(400);
    /* ══ 2026-10-27 第三十次：四年級（402）〔👥 全班 同步〕🪤 四年級 複習 0 ➜ 平板 跳到 midterm ➜ 答 ➜ 下一題 ➜ 結束 送 g4gm_mt-m12 ══ */
    await h.click('#crhome').catch(() => {}); await h.waitForTimeout(200); await h.click('[data-sc="402"]'); await h.waitForTimeout(200); await h.click('[data-crgo]'); await h.click('[data-crs="mt0"]'); await h.click('[data-crm="sync"]'); await h.click('#crstart'); await h.waitForTimeout(500);
    n++; const c4 = dget('rooms/0402/cr'); if (!c4 || c4.on !== 1 || c4.set !== 'mt0' || c4.deck.length !== 8 || c4.deck.some(d => d[0] !== 'm12')) E.push(tag + ' 四年級 同步 Firebase 不對 ' + JSON.stringify(c4).slice(0, 200));
    const s4p = await stuPage(ctx, HTTP + '/live/index.html', '40201'); await s4p.waitForURL(/midterm\/index\.html\?live=0402/, { timeout: 12000 }).catch(() => {});
    n++; if (!/midterm\/index\.html\?live=0402/.test(s4p.url())) E.push(tag + ' 四年級 平板 沒有 自己 跳到 四年級 複習 ' + s4p.url());
    await s4p.waitForTimeout(2500);
    n++; const m0 = await s4p.evaluate(() => ({ id: R && R.g.id, crs: R && R.crs, o: document.querySelectorAll('#stage [data-o]').length, qx: getComputedStyle(document.querySelector('.hud .qx')).display }));
    if (m0.id !== 'm12' || !m0.crs || m0.o !== 3 || m0.qx !== 'none') E.push(tag + ' 四年級 平板 沒有 出現 第 1 題（陷阱 偵測器）' + JSON.stringify(m0));
    await s4p.click('#stage [data-o="0"]'); await s4p.waitForTimeout(3500);
    n++; const w4 = await s4p.evaluate(() => ({ on: document.getElementById('crw').classList.contains('on'), t: document.getElementById('crw').textContent })); if (!w4.on || !/答對/.test(w4.t) || !/等 老師/.test(w4.t)) E.push(tag + ' 四年級 答完 沒有「答對 了，等 老師」' + JSON.stringify(w4));
    n++; const a4 = dget('rooms/0402/cra/' + c4.t + '_0'); if (!a4 || a4['40201'] !== 1) E.push(tag + ' 四年級 答案 沒有 寫到 cra ' + JSON.stringify(a4));
    await h.waitForTimeout(1600); n++; const hv4 = await h.evaluate(() => document.getElementById('hcrr').textContent); if (!/已經 答 1 人/.test(hv4)) E.push(tag + ' 四年級 大螢幕 沒有 看到 幾個 人 答 ' + hv4.slice(0, 120));
    await h.click('#crrv'); n++; const rv4 = await h.evaluate(() => (document.querySelector('.crans') || {}).textContent || ''); if (!/✅ \S/.test(rv4)) E.push(tag + ' 四年級〔👀 公布 答案〕沒有 英文 答案 ' + rv4);
    await h.click('#crnx'); await h.waitForTimeout(2200);
    n++; const m1 = await s4p.evaluate(() => ({ id: R && R.g.id, o: document.querySelectorAll('#stage [data-o]').length, w: document.getElementById('crw').classList.contains('on') })); if (m1.id !== 'm12' || m1.o !== 3 || m1.w) E.push(tag + ' 四年級 老師 按 下一題 平板 沒有 換 ' + JSON.stringify(m1));
    await h.click('#crend'); await h.waitForTimeout(2500);
    n++; const e4 = await s4p.evaluate(() => ({ t: document.getElementById('crw').textContent, q: JSON.parse(localStorage.getItem('score_q') || '[]') }));
    const sent4 = POSTS.map(x => { try { return JSON.parse(x); } catch (e) { return {}; } }).filter(x => x.r && x.r.set === 'g4gm_mt-m12' || x.recs && x.recs.some(r => r.set === 'g4gm_mt-m12'));
    const r4 = [].concat(...sent4.map(x => x.recs || [x.r])).concat(e4.q).filter(r => r && r.set === 'g4gm_mt-m12').pop();
    if (!/結束/.test(e4.t) || !r4 || r4.qs.length !== 2 || r4.qs[0][0] !== 1 || r4.qs[1][0] !== 0 || !/^🪤 四年級 複習 0｜/.test(r4.name)) E.push(tag + ' 四年級 結束 沒有 送 成績 g4gm_mt-m12（2 題：對、沒答 ＝ 錯）' + JSON.stringify(r4 || null).slice(0, 160));
    /* 〔🙋 學生 自己 答〕📝 四年級 複習：只 有 數字 神射手 */
    await h.click('#crhome'); await h.click('[data-crgo]'); await h.click('[data-crs="mt"]'); await h.click('[data-cra="0"]'); await h.click('[data-crg="m5"]'); await h.click('[data-crm="self"]'); await h.click('#crstart'); await h.waitForTimeout(2600);
    n++; const lb4 = await s4p.evaluate(() => ({ cards: [].map.call(document.querySelectorAll('[data-g]'), b => b.getAttribute('data-g')), x: !!document.querySelector('.xrow'), h1: document.querySelector('.top h1').textContent, home: getComputedStyle(document.querySelector('.top .home')).display }));
    if (lb4.cards.join() !== 'm5' || lb4.x || !/四年級 複習/.test(lb4.h1) || lb4.home !== 'none') E.push(tag + ' 四年級 自己 答 的 大廳 不是 只有 老師 選 的 遊戲 ' + JSON.stringify(lb4));
    await s4p.click('[data-g="m5"]'); await s4p.waitForTimeout(2500); await s4p.click('#stage [data-o="0"]'); await s4p.waitForTimeout(800);
    n++; const p4 = dget('rooms/0402/crp/40201'); if (!p4 || p4.n !== 1 || p4.ok !== 1 || p4.g !== 'm5') E.push(tag + ' 四年級 自己 答 的 進度 沒有 寫 crp ' + JSON.stringify(p4));
    await h.waitForTimeout(1600); n++; const hs4 = await h.evaluate(() => document.getElementById('hcrr').textContent); if (!/已經 開始 1 人/.test(hs4)) E.push(tag + ' 四年級 大螢幕 沒有 看到 誰 在 做 ' + hs4.slice(0, 120));
    await h.click('#crend'); await h.waitForTimeout(400);
    n++; if (errs.length) E.push(tag + ' 大螢幕 JS：' + errs.slice(0, 2).join('｜'));
    await ctx.close(); }
  await br.close(); srv.close(); E.forEach(x => console.log('✗ ' + x)); console.log((E.length ? '✗' : '✓') + ' 課堂複習（現場任務）量了 ' + n + ' 項，失敗 ' + E.length + ' 項'); process.exit(E.length ? 1 : 0); })();
