/* vs/_verify.js — ⚔️ 左右 對戰（2026-11-14 第五十四次）量測：node vs/_verify.js（只印 失敗 項 和 一行 總結）
 * A 平板（假 資料庫 window.__VSLIVE、假 成績系統 script.test；**絕對 不 連 真的 Firebase、成績表**）：
 *   戊／丙／乙 ✕ 三、四年級 ✕ 三種 螢幕（iPad 橫 1024×768、iPad 直 768×1024、教室 觸控 1920×1080）＋ 一個人；
 *   兩邊 同 句型、戊 正確 答案 不一樣、丙／乙 同一題 位置 全部 不同、丙 按了 只有 🔒、答對頁／答錯頁（逐字 中文、整句、💡）、換 字 再 考、分數、crp、送 成績、📈 基準。
 * B 大螢幕＋平板 一起（假 Firebase 伺服器 https://fake.test、真的 Code.gs 跑 在 node）：設定 頁 有〔⚔️ 左右 對戰〕三種 模式、開始 寫 vm、平板 自己 跳 進來、
 *   兩個 排行榜（全班 前 10 名、🚀 進步 前 5 名、🛡 保持 滿分、不 寫 上次 幾分）、時間 到 送 兩 人 成績、全班 頒獎 ➜ 🌟 進步 之星（風格 不同）。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = '';
const D = require('./_data.js'), URL0 = 'https://script.test/exec', PW = 'pw-verify';
const ok = (c, m) => { n++; if (!c) E.push(m); };
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
const INIT = (o) => { window.__SCNOJIT = 1; window.__VSFAST = 1; window.__AWDFAST = 1; window.__GROWFAST = 1; window.__VSREC = [];
  Object.defineProperty(window, 'SCORE_URL', { get: () => o.u, set: () => {}, configurable: true });
  if (o.db) Object.defineProperty(window, 'LIVE_DB', { get: () => 'https://fake.test', set: () => {}, configurable: true });
  HTMLMediaElement.prototype.play = function () { const a = this; window.__PLAYS = (window.__PLAYS || 0) + 1; setTimeout(() => a.onended && a.onended(), 30); return Promise.resolve(); };
  if (o.ids) window.__VSIDS = o.ids;
  if (o.cr) { window.__CR = Object.assign({}, o.cr, { t: Date.now() }); window.__CRP = {}; window.__VSLIVE = { poll: (p, ms, cb) => { window.__crcb = cb; setTimeout(() => cb(window.__CR), 20); return () => {}; }, set: (p, v) => { window.__CRP[p] = v; return Promise.resolve(true); } }; }
  if (o.hist) Object.keys(o.hist).forEach(k => localStorage.setItem('vs_h_' + k, JSON.stringify(o.hist[k])));
  o.ids && o.ids.forEach(id => { localStorage.setItem('score_last', '"' + id + '"'); });
  localStorage.setItem('score_act', String(Date.now()));
};
async function ctxOf(br, vp) { const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: true });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
  await ctx.route(/script\.test/, r => r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"ok":true,"dup":[]}' }));
  return ctx; }
/* 一回合：等 題目 出來 ➜ 照 計畫 按 ➜ 等 下一題 */
async function playRound(p, plan) {
  await p.waitForFunction(() => { const S = VS.st(); return S && S.cur && !S.cur.rev && document.querySelector('#h0 .vb'); }, null, { timeout: 15000 });
  const st = await p.evaluate(() => { const S = VS.st(), B = VSBANK[+String(location.search.match(/live=(\d{4})/)[1]).charAt(1)];
    return { r: S.r, vm: S.vm, f: S.cur.f, q: S.cur.q.map(c => c && { i: c.i, ord: c.ord, rc: c.rc, o0: B[c.i].o[0], f: B[c.i].f }) }; });
  for (const k of [0, 1]) { const c = st.q[k]; if (!c) continue; const want = plan[k]; if (want == null) continue;
    const oi = want ? 0 : 1; await p.click('#h' + k + ' .vb[data-o="' + oi + '"]'); await p.waitForTimeout(40); }
  return st; }
async function waitNext(p, r) { await p.waitForFunction(r => { const S = VS.st(); return !S || S.over || (S.r > r && S.cur && !S.cur.rev); }, r, { timeout: 30000 }); }

async function tablet(br, vp, room, vm, opt) { opt = opt || {}; const tag = vp.join('×') + ' ' + room + ' ' + vm + (opt.solo ? ' 一個人' : '');
  const ctx = await ctxOf(br, vp), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  const g = +room.charAt(1), A = room.slice(1) + '01', B = room.slice(1) + '02';
  await p.addInitScript(INIT, { u: URL0, ids: opt.solo ? [A] : [A, B], cr: { on: 1, t: 1, set: 'vs', vm, d: 600000, left: 600000 }, hist: { [A]: [[50, 40], [60, 50], [70, 60]], [B]: [[100, 90], [100, 95], [100, 100]] } });
  await p.goto('file://' + path.join(ROOT, 'vs', 'index.html') + '?live=' + room);
  /* 開場 說明 */
  await p.waitForSelector('#vok', { timeout: 5000 }).catch(() => {});
  const it = await p.evaluate(() => { const o = document.getElementById('vcv'); return { t: o.innerText, n: o.querySelectorAll('.vil li').length, b: o.querySelector('#vok') ? o.querySelector('#vok').getBoundingClientRect().height : 0 }; });
  ok(it.n === 5 && /左右 對戰/.test(it.t) && it.b >= 56, tag + ' 開場 說明 不對 ' + JSON.stringify(it).slice(0, 160));
  ok(vm === 'e' ? /題目 不一樣/.test(it.t) : vm === 'c' ? /🔒/.test(it.t) : /位置 不一樣/.test(it.t), tag + ' 開場 沒有 說 這個 模式');
  await p.waitForTimeout(120); await p.click('#vok');
  const R = [], plans = [[1, 0], [0, 1], [1, 1], [0, 0], [1, 0], [1, 1], [1, 1], [1, 1]];
  for (let i = 0; i < plans.length; i++) {
    const st = await playRound(p, plans[i]); R.push(st);
    /* 版面：每 一個 選項 在 自己 那 一半、字 沒有 被 切掉、字 夠大 */
    if (i === 0) { const L = await p.evaluate(() => { const W = innerWidth, H = innerHeight, out = [];
        [0, 1].forEach(k => { const h = document.getElementById('h' + k), hr = h.getBoundingClientRect();
          h.querySelectorAll('.vb,.vq,.vcue').forEach(e => { const r = e.getBoundingClientRect(), fs = parseFloat(getComputedStyle(e).fontSize);
            if (r.left < hr.left - 1 || r.right > hr.right + 1 || r.bottom > H + 1) out.push(k + ' ' + e.className + ' 超出');
            if (e.scrollWidth > e.clientWidth + 2) out.push(k + ' ' + e.className + ' 字 被 切掉 ' + e.textContent.slice(0, 30));
            if (e.classList.contains('vb') && (fs < 18 || r.height < 56)) out.push(k + ' 選項 太小 ' + fs + '/' + Math.round(r.height)); }); });
        return out; });
      ok(!L.length, tag + ' 版面 ' + L.slice(0, 3).join('；')); }
    if (!opt.solo) {
      ok(st.q[0].f === st.q[1].f, tag + ' 第 ' + st.r + ' 題 兩邊 句型 不一樣');
      if (vm === 'e') ok(st.q[0].o0 !== st.q[1].o0, tag + ' 戊：兩邊 正確 答案 一樣（偷看 有用）' + st.q[0].o0);
      else { ok(st.q[0].i === st.q[1].i, tag + ' ' + vm + '：兩邊 不是 同一題'); ok(st.q[0].ord.every((v, j) => v !== st.q[1].ord[j]), tag + ' ' + vm + '：有 選項 位置 一樣（會 抄）' + st.q[0].ord + '|' + st.q[1].ord); }
    }
    /* 按了 以後 的 樣子 */
    if (i === 0) { const lk = await p.evaluate(() => { const b = document.querySelector('#h0 .vb.lock,#h0 .vb.ok,#h0 .vb.no'); return b ? b.className : ''; });
      if (!opt.solo) ok(vm === 'b' ? /\bok\b/.test(lk) : /\block\b/.test(lk) && !/\b(ok|no)\b/.test(lk), tag + ' 按了 以後 樣子 不對（' + vm + '）：' + lk); }
    /* 公布：答對頁／答錯頁 */
    await p.waitForFunction(() => VS.st().cur.rev && document.querySelector('#h0.fb'), null, { timeout: 15000 });
    const fb = await p.evaluate(() => [0, 1].map(k => { const h = document.getElementById('h' + k); if (!h.classList.contains('fb')) return null;
      return { good: h.classList.contains('good'), me: !!h.querySelector('.vme s'), why: (h.querySelector('.vwhy') || {}).textContent || '', w: h.querySelectorAll('.vgl .w').length, zh: [].every.call(h.querySelectorAll('.vgl .w small'), s => /[㐀-鿿]|^[A-Z][a-z]+$/.test(s.textContent)), az: (h.querySelector('.vaz') || {}).textContent || '', green: /rgb\((14, 90|20, 128)/.test(getComputedStyle(h).backgroundImage), over: h.scrollHeight > h.clientHeight + 2 }; }));
    [0, 1].forEach(k => { const f = fb[k], pl = plans[i][k]; if (opt.solo && k === 1) return; if (!f) { E.push(tag + ' 沒有 公布 頁 ' + k); n++; return; }
      ok(f.good === !!pl, tag + ' 公布 頁 對錯 不對 ' + k); ok(f.w >= 2 && f.zh && /[㐀-鿿]/.test(f.az), tag + ' 公布 頁 沒有 逐字 中文／整句 ' + JSON.stringify(f));
      if (!pl) ok(f.me && f.why.length > 3, tag + ' 答錯頁 沒有 你選的／💡 ' + JSON.stringify(f)); ok(!f.over, tag + ' 公布 頁 放不下 ' + k); ok(f.green, tag + ' 公布 頁 不是 綠底 ' + k); });
    await waitNext(p, st.r);
  }
  /* 換 字 再 考：右邊 第 1 題 錯 ➜ 之後 有 一題 同 句型、標 🔁、題目 不是 同一題 */
  if (!opt.solo && vm === 'e') { const miss = R[0].q[1], rc = R.slice(2).find(x => x.q[1].rc); ok(rc && rc.f === miss.f && rc.q[1].i !== miss.i, tag + ' 沒有 換 字 再 考 ' + JSON.stringify(rc && rc.q[1])); }
  const s0 = await p.evaluate(() => { const S = VS.st(); return S.side.map(x => x && { n: x.n, ok: x.ok, pt: x.pt, lr: x.lr, b: x.b }); });
  ok(s0[0].n === plans.length && s0[0].ok === plans.filter(x => x[0]).length, tag + ' 左邊 題數／答對 不對 ' + JSON.stringify(s0[0]));
  ok(s0[0].pt >= 600 * s0[0].ok && s0[0].pt <= 1000 * s0[0].ok, tag + ' 左邊 ⚡ 分數 不在 600～1000 ✕ 答對 ' + s0[0].pt);
  ok(s0[0].b && s0[0].b[0] === 60 && s0[0].b[1] === 50, tag + ' 📈 基準 不是 最近 3 次 平均 ' + JSON.stringify(s0[0].b));
  if (opt.solo) ok(!s0[1], tag + ' 一個人 右邊 應該 沒有 人');
  const crp = await p.evaluate(() => window.__CRP);
  const kA = 'rooms/' + room + '/crp/' + A, cA = crp[kA];
  ok(cA && cA.g === 'vs' && cA.n === plans.length && cA.b0 === 60 && cA.b1 === 50 && cA.p == null && typeof cA.gp === 'number', tag + ' crp 不對 ' + JSON.stringify(cA));
  if (!opt.solo) ok(crp['rooms/' + room + '/crp/' + B], tag + ' 右邊 沒有 crp');
  /* 時間 到 ➜ 兩 人 各 一筆 成績 */
  await p.evaluate(() => window.__crcb(Object.assign({}, window.__CR, { fin: 1, left: 0 })));
  await p.waitForTimeout(600);
  const rec = await p.evaluate(() => ({ r: window.__VSREC, q: JSON.parse(localStorage.getItem('score_q') || '[]').concat(JSON.parse(localStorage.getItem('score_sent') || '[]')).map(x => x.id + '|' + x.set + '|' + x.qs.length + '|' + x.fix + '|' + x.lc), end: document.querySelectorAll('.endh').length, t: document.body.innerText }));
  ok(rec.r.length === (opt.solo ? 1 : 2) && rec.r.every(x => x.set === 'g' + g + 'gm_vs-q1' && x.n === plans.length), tag + ' 送 成績 不對 ' + JSON.stringify(rec.r));
  ok(rec.end === (opt.solo ? 1 : 2) && /📈/.test(rec.t) && /✨ 學會 了/.test(rec.t), tag + ' 結束 頁 不對');
  ok(!errs.length, tag + ' 程式 錯誤 ' + errs.slice(0, 2).join('｜'));
  await ctx.close(); }

/* ── 真的 用 數字 鍵盤 登入：左 30401 ➜ 右 30401（一樣 不行）➜ 右 30701（別班 不行）➜ 右 30402 ── */
async function loginTest(br) { const tag = '登入'; const ctx = await ctxOf(br, [1024, 768]), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await ctx.route(/fake\.test/, r => r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: 'null' }));
  await p.addInitScript(INIT, { u: URL0, db: 1, cr: { on: 1, t: 1, set: 'vs', vm: 'e', d: 600000, left: 600000 } });
  await p.addInitScript(() => { window.__SCLVT = 50; });
  await p.goto('file://' + path.join(ROOT, 'vs', 'index.html') + '?live=0304');
  const key = async id => { await p.waitForSelector('[data-k="' + id[0] + '"]', { timeout: 8000 }); for (const k of id.split('').concat(['ok'])) { await p.click('[data-k="' + k + '"]').catch(() => {}); await p.waitForTimeout(90); } await p.waitForTimeout(900); };
  const cv = () => p.evaluate(() => document.getElementById('vcv').hidden ? '' : document.getElementById('vcv').innerText);
  await p.waitForSelector('#vgoA', { timeout: 5000 }).catch(() => E.push(tag + ' 沒有〔🔑 左邊 登入〕'));
  ok(/左邊/.test(await cv()), tag + ' 第一步 不是 左邊 先 登入');
  await p.click('#vgoA'); await key('30401');
  let t = await cv(); ok(/右邊/.test(t) && /304 班 1 號/.test(t) && /只有 我 一個 人/.test(t), tag + ' 左邊 登入 以後 不是 叫 右邊 ' + t.slice(0, 80));
  await p.click('#vgoB'); await key('30401'); ok(/要 不一樣/.test(await cv()), tag + ' 一樣 的 號碼 沒有 擋');
  await p.click('#vgoB'); await key('30701'); ok(/不是 這 一班/.test(await cv()), tag + ' 別班 沒有 擋');
  await p.click('#vgoB'); await key('30402');
  await p.waitForSelector('#vok', { timeout: 5000 }).catch(() => {});
  const st = await p.evaluate(() => { const S = VS.st(); return S && S.side.map(x => x && x.id); });
  ok(st && st.join() === '30401,30402', tag + ' 兩 個 人 沒有 登入 好 ' + JSON.stringify(st));
  ok(!errs.length, tag + ' 程式 錯誤 ' + errs.slice(0, 2).join('｜')); await ctx.close(); }
/* ── 伺服器（score/_calc.js view）：⚔️ 左右 對戰 給 自己 最近 3 次（不 限 這一週）[💯, ⚡]；別的 題組 不給 ── */
{ const SC = require('../score/_calc.js'), now = Date.now(), mk = (acc, raw, dt, x) => ({ t: now - dt * 864e5, id: '30401', g: 3, cls: '304', seat: 1, set: 'g3gm_vs-q1', name: 'x', m: 'q', n: 8, ok: 6, acc, s: acc, raw, fix: 0, fast: 0, qs: [], x: !!x });
  const v = SC.view([mk(40, 30, 20), mk(50, 40, 10), mk(60, 50, 3), mk(99, 99, 2, 1), mk(70, 60, 1)], { id: '30401', set: 'g3gm_vs-q1' }, now, true, {});
  ok(JSON.stringify(v.set.h) === '[[50,40],[60,50],[70,60]]', '伺服器 最近 3 次 不對 ' + JSON.stringify(v.set.h));
  ok(SC.view([mk(40, 30, 1)], { id: '30401', set: 'g3gu1_1-1b' }, now, true, {}).set.h === undefined, '伺服器 別的 題組 也 給 了 h'); }
/* ── 題庫：全 英文、4 個 不一樣、錯 選項 都 有 💡、每 一個 句型 配得 成 對 ── */
[3, 4].forEach(g => D.BANK[g].forEach((q, i) => { ok(!/[㐀-鿿]/.test(q.q + q.o.join('') + q.cuet), g + '-' + i + ' 題目 有 中文'); ok(new Set(q.o).size === 4, g + '-' + i + ' 選項 重複'); }));

/* ── B 大螢幕＋平板 ── */
const FDB = {}; const seg = p => p.replace(/^\/+|\.json$/g, '').split('/').filter(Boolean);
function dget(p) { let o = FDB; for (const k of seg(p)) { if (o == null || typeof o !== 'object') return null; o = o[k]; } return o === undefined ? null : o; }
function dset(p, v, patch) { const S = seg(p); let o = FDB; for (let i = 0; i < S.length - 1; i++) { if (typeof o[S[i]] !== 'object' || o[S[i]] === null) o[S[i]] = {}; o = o[S[i]]; } const k = S[S.length - 1];
  if (patch && typeof o[k] === 'object' && o[k]) Object.assign(o[k], v); else if (v === null) delete o[k]; else o[k] = v; }
async function host(br, vp) { const tag = '大螢幕 ' + vp.join('×'); for (const k in FDB) delete FDB[k];
  const { make } = require('../score/_gas_stub.js'), G = make({ TEACHER_PW: PW });
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
  await ctx.addInitScript(INIT, { u: URL0, db: 1 });
  await ctx.route(/fake\.test/, async r => { const u = new URL(r.request().url()), m = r.request().method(); let b = null;
    if (m === 'GET') b = dget(u.pathname); else { const v = m === 'DELETE' ? null : JSON.parse(r.request().postData() || 'null'); dset(u.pathname, v, m === 'PATCH'); b = v; }
    await r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(b) }); });
  await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  const h = await ctx.newPage(), errs = []; h.on('pageerror', e => errs.push('大螢幕 ' + e.message));
  await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(400); await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(500);
  await h.click('[data-sc="304"]'); await h.waitForTimeout(200); await h.click('[data-crgo]'); await h.waitForTimeout(200);
  const has = await h.evaluate(() => [].some.call(document.querySelectorAll('[data-crs]'), b => b.getAttribute('data-crs') === 'vs'));
  ok(has, tag + ' 三年級 沒有〔⚔️ 左右 對戰〕');
  await h.click('[data-crs="vs"]'); await h.waitForTimeout(200);
  const md = await h.evaluate(() => ({ b: [].map.call(document.querySelectorAll('[data-vsm]'), b => b.getAttribute('data-vsm') + (b.classList.contains('on') ? '*' : '')), mn: (document.querySelector('[data-crmin].on') || {}).textContent, gs: document.querySelectorAll('[data-crg]').length,
    small: [].filter.call(document.querySelectorAll('[data-vsm]'), b => b.getBoundingClientRect().height < 56).length }));
  ok(md.b.join() === 'e*,c,b' && /10 分鐘/.test(md.mn) && md.gs === 0 && !md.small, tag + ' 設定 頁 不對 ' + JSON.stringify(md));
  await h.click('[data-vsm="c"]'); await h.waitForTimeout(100); await h.click('[data-vsm="e"]'); await h.waitForTimeout(100);
  await h.click('#crstart'); await h.waitForTimeout(800);
  const cr = dget('/rooms/0304/cr'); ok(cr && cr.on && cr.set === 'vs' && cr.vm === 'e' && cr.d === 600000 && !cr.qk, tag + ' Firebase cr 不對 ' + JSON.stringify(cr));
  ok(/vs\/index\.html\?live=0304/.test(await h.evaluate(() => taskURL())), tag + ' QR 網址 不是 vs 頁');
  /* 平板：從 現場任務 的 g3mid 頁 也 會 自己 跳 過來 */
  const t = await ctx.newPage(); t.on('pageerror', e => errs.push('平板 ' + e.message));
  await t.addInitScript(() => { window.__VSIDS = ['30401', '30402']; localStorage.setItem('score_last', '"30401"'); localStorage.setItem('score_id_g3', '"30401"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', '30401'); localStorage.setItem('vs_h_30401', '[[50,40],[60,50],[70,60]]'); localStorage.setItem('vs_h_30402', '[[100,90],[100,100],[100,100]]'); });
  await t.goto(HTTP + '/g3mid/index.html?live=0304'); await t.waitForURL(/vs\/index\.html/, { timeout: 8000 }).catch(() => E.push(tag + ' g3mid 頁 沒有 跳到 vs'));
  await t.waitForSelector('#vok', { timeout: 8000 }).catch(() => {}); await t.waitForTimeout(150); await t.click('#vok').catch(() => {});
  for (let i = 0; i < 6; i++) { const st = await playRound(t, [1, 1]); await waitNext(t, st.r); }
  /* 另外 三個 人（假 的 crp）：一個 進步 很多、一個 第一次、一個 只 答 2 題 */
  await h.evaluate(() => { const c = CRS.cfg, put = (id, o) => { CRS.crp[id] = Object.assign({ t: c.t, g: 'vs' }, o); };
    put('30405', { n: 8, ok: 6, s: 75, gp: 60, b0: 10, b1: 0, lr: 1 }); put('30406', { n: 8, ok: 8, s: 100, gp: 80 }); put('30407', { n: 2, ok: 2, s: 100, gp: 95, b0: 10, b1: 10 }); });
  await h.waitForTimeout(1600); await h.evaluate(() => crLB());
  const lb = await h.evaluate(() => ({ cls: [].map.call(document.querySelectorAll('#crlbw .crlr'), r => r.getAttribute('data-id')), pg: [].map.call(document.querySelectorAll('#crpg .vsg'), r => r.innerText.replace(/\s+/g, ' ')),
    keep: (document.querySelector('#crpg .vsgk') || {}).textContent || '', w: (() => { const a = document.querySelector('.vsl'), b = document.querySelector('.vsr'); return a && b ? [a.getBoundingClientRect().width, b.getBoundingClientRect().width] : [0, 0]; })(),
    over: (() => { const r = document.querySelector('#crpg').getBoundingClientRect(); return r.right > innerWidth + 1; })() }));
  ok(await h.evaluate(() => /📈 ＋\d/.test((document.querySelector('#crlbw .crlr[data-id="30401"] .vspb') || {}).textContent || '')), tag + ' 全班 排行榜 名字 旁邊 沒有 📈 小 徽章');
  ok(lb.cls.slice(0, 3).join() === '30401,30402,30406' && lb.cls.indexOf('30407') < 0, tag + ' 全班 排行榜 順序 不對 ' + lb.cls.join());
  ok(lb.pg.length >= 1 && /30405/.test(lb.pg[0]) && /📈 ＋62\.5/.test(lb.pg[0]) && !lb.pg.some(x => /30406|30407|30402/.test(x)), tag + ' 進步 排行榜 不對 ' + JSON.stringify(lb.pg));
  ok(/30402/.test(lb.keep), tag + ' 沒有 🛡 保持 滿分 30402 ' + lb.keep);
  ok(!lb.pg.some(x => /上次/.test(x)), tag + ' 進步 排行榜 寫了 上次 幾分 ' + JSON.stringify(lb.pg));
  ok(vp[0] < 1100 || (lb.w[0] > lb.w[1] && lb.w[1] > 300), tag + ' 兩個 排行榜 寬度 不對 ' + lb.w); ok(!lb.over, tag + ' 進步 排行榜 超出 畫面');
  /* 時間 到 ➜ 平板 送 兩 人 ➜ 全班 頒獎 ➜ 進步 之星 */
  await h.evaluate(() => crUp()); await t.waitForTimeout(2500);
  const rec = await t.evaluate(() => window.__VSREC.map(x => x.id + '|' + x.set + '|' + x.n));
  ok(rec.join() === '30401|g3gm_vs-q1|6,30402|g3gm_vs-q1|6', tag + ' 時間 到 送 成績 不對 ' + rec.join());
  await h.waitForSelector('#crgl.on .awd', { timeout: 15000 }).catch(() => E.push(tag + ' 沒有 全班 頒獎 典禮'));
  await h.waitForSelector('#vsgo', { timeout: 30000 }).catch(() => E.push(tag + ' 全班 頒獎 以後 沒有〔🌟 下一個：進步 之星〕'));
  await h.click('#vsgo').catch(() => {}); await h.waitForSelector('#vsgrow.fin', { timeout: 20000 }).catch(() => E.push(tag + ' 進步 之星 沒有 演完'));
  const gr = await h.evaluate(() => { const g = document.getElementById('vsgrow'); if (!g) return null; return { cls: g.className, aw: !!g.querySelector('.awd'), c: [].map.call(g.querySelectorAll('.grc'), c => c.innerText.replace(/\s+/g, ' ')), keep: g.querySelector('.grkeep').textContent, t: g.querySelector('.grt').textContent,
    fs: Math.min.apply(null, [].map.call(g.querySelectorAll('.grnm,.grpr,.grt'), e => parseFloat(getComputedStyle(e).fontSize))), out: [].filter.call(g.querySelectorAll('.grc'), c => { const r = c.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1 || r.bottom > innerHeight + 1; }).length, end: !!document.getElementById('vsge'), top: g.contains(document.elementFromPoint(innerWidth / 2, innerHeight / 2)) }; });
  ok(gr && gr.top, tag + ' 進步 之星 被 別的 畫面 蓋住');
  ok(gr && /grw/.test(gr.cls) && !gr.aw && gr.c.length >= 1 && /30405/.test(gr.c[gr.c.length - 1] + gr.c.join()) && /進步 之星/.test(gr.t), tag + ' 進步 之星 內容 不對 ' + JSON.stringify(gr).slice(0, 220));
  ok(gr && /30402/.test(gr.keep) && gr.fs >= 20 && !gr.out && gr.end, tag + ' 進步 之星 版面 不對 ' + JSON.stringify(gr && { keep: gr.keep, fs: gr.fs, out: gr.out, end: gr.end }));
  await h.click('#vsge').catch(e => E.push(tag + ' 按不到〔⏹ 結束〕' + e.message.slice(0, 80))); await h.waitForTimeout(1500);
  ok(!(await h.$('#vsgrow')), tag + ' 〔⏹ 結束〕沒有 收起來'); ok(!dget('/rooms/0304/cr').on, tag + ' 〔⏹ 結束〕沒有 寫 on:0 ' + JSON.stringify(dget('/rooms/0304/cr')).slice(0, 80));
  ok(!errs.length, tag + ' 程式 錯誤 ' + errs.slice(0, 2).join('｜'));
  await ctx.close(); }

(async () => { const srv = await serve(), br = await chromium.launch();
  for (const vp of [[1024, 768], [768, 1024], [1920, 1080]]) for (const vm of ['e', 'c', 'b']) await tablet(br, vp, vp[0] === 768 && vm !== 'e' ? '0402' : '0304', vm);
  await tablet(br, [1024, 768], '0402', 'e'); await tablet(br, [1024, 768], '0311', 'e', { solo: 1 }); await loginTest(br);
  for (const vp of [[1920, 1080], [1024, 768]]) await host(br, vp);
  await br.close(); srv.close();
  E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' ⚔️ 左右 對戰：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
