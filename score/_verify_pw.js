/* score/_verify_pw.js — 量 🔑 8 碼 密碼 登入（2026-10-28 第三十三次 第 4 點）。只 印 失敗 項 和 一行 總結。
 *   node score/_verify_pw.js
 * 假 伺服器（score/_gas_stub.js 跑 真的 Code.gs），絕對 不 送到 真的 成績表。三種 尺寸：iPad 橫、iPad 直、教室 觸控 螢幕。
 * 量：伺服器（第一次 設、登入、打錯、鎖、沒 帶 通行證 的 成績 不收、老師 看／清除）；網頁：5 碼 ➜ 密碼 頁（動畫 範例、粉紅 2 格＋藍 6 格、
 *   字母 鍵盤 ➜ 數字 鍵盤、按鈕 ≧ 48px、不用 捲、不 左右 捲）、第一次 設 兩次、兩次 不一樣 ＝ 重設、設好 ＝ 登入、新 分頁「這是您嗎 ✅」＝ 要 打 密碼、打錯 ＝ 搖、
 *   勾〔記住〕＝ 新 分頁 不用 再 打、老師 清除 以後 ＝ 重設。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const { make } = require('./_gas_stub.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec';
const E = []; let n = 0; const ck = (w, c) => { n++; if (!c) E.push(w); };
/* ── 伺服器 ── */
{ const G = make({ TEACHER_PW: 't' }); let j = G.post({ a: 'sp', id: '30412' }); ck('伺服器：還沒 設 ＝ has false', j.ok && j.has === false);
  ck('伺服器：格式 不對 不收', G.post({ a: 'sp', id: '30412', p: 'AB123456', set: 1 }).err === 'fmt');
  j = G.post({ a: 'sp', id: '30412', p: 'ab123456', set: 1 }); const tk = j.tk; ck('伺服器：第一次 設', j.ok && tk);
  ck('伺服器：登入', G.post({ a: 'sp', id: '30412', p: 'ab123456' }).tk === tk); ck('伺服器：打錯', G.post({ a: 'sp', id: '30412', p: 'ab123457' }).err === 'wrong');
  const r = { id: '30412', set: 'g3u1_1-1b', name: 'x', m: 't', qs: [[1, 0, 3, 0, .5, 0]], sec: 10, src: 'home', dev: 'd', u: 'u1', t: Date.now() };
  ck('伺服器：沒 通行證 的 成績 不收', G.post({ a: 'rec', r }).err === 'spk'); ck('伺服器：通行證 對 ＝ 收', G.post({ a: 'rec', r: Object.assign({}, r, { k: tk }) }).saved);
  ck('伺服器：買東西 沒 通行證 不收', G.post({ a: 'rpg', id: '30412', op: 'eq', item: 'x' }).err === 'spk');
  ck('伺服器：老師 看 密碼', G.post({ a: 'spl', pw: 't', id: '30412' }).p === 'ab123456'); ck('伺服器：老師 密碼 錯 看不到', G.post({ a: 'spl', pw: 'x', id: '30412' }).err === 'pw');
  ck('伺服器：老師 清除', G.post({ a: 'spr', pw: 't', id: '30412' }).ok && G.post({ a: 'sp', id: '30412' }).has === false);
  G.post({ a: 'sp', id: '30413', p: 'ab111111', set: 1 }); for (let i = 0; i < 8; i++) G.post({ a: 'sp', id: '30413', p: 'zz000000' }); ck('伺服器：打錯 8 次 鎖', G.post({ a: 'sp', id: '30413', p: 'zz000000' }).err === 'lock');
  ck('伺服器：沒 設 密碼 的 人 照收（舊 平板）', G.post({ a: 'rec', r: Object.assign({}, r, { id: '30414', u: 'u9' }) }).saved); }
/* ── 網頁 ── */
let HTTP = '';
function serve() { return new Promise(ok => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.css': 'text/css', '.svg': 'image/svg+xml' };
  const s = require('http').createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; ok(s); }); }); }
const typeP = async (p, s) => { for (const c of s) { await p.click('#scPwK button[data-p="' + c + '"]'); } };
const pwState = p => p.evaluate(() => { const c = document.getElementById('scPwC'); if (!c) return null; const r = [].map.call(c.children, i => i.className.split(' ')[0]),
  keys = [].map.call(document.querySelectorAll('#scPwK button'), b => b.getBoundingClientRect()), lo = document.querySelector('.scpw').getBoundingClientRect();
  return { t: document.getElementById('scPwT').textContent, m: document.getElementById('scPwM').textContent, cells: r.join(''), ex: document.querySelectorAll('.pwex i').length, nk: keys.length,
    small: keys.filter(k => k.height < 48 || k.width < 48).length, out: lo.bottom > innerHeight + 1 || lo.top < -1, ox: document.documentElement.scrollWidth - innerWidth, letters: !!document.querySelector('#scPwK button[data-p="a"]') }; });
(async () => { const sv = await serve(), br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) { const tag = vp.join('×'), G = make({ TEACHER_PW: 't' });
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); window.__SCORE_PW = 1; }, URL0);
    await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
      await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
    const p = await ctx.newPage(), er = []; p.on('pageerror', e => er.push(e.message));
    await p.goto(HTTP + '/g3-review/index.html'); await p.waitForTimeout(500);
    await p.click('#scBarIn'); await p.waitForTimeout(300);
    for (const k of '30412') await p.click('.sckey button[data-k="' + k + '"]'); await p.click('.sckey button[data-k="ok"]'); await p.waitForTimeout(1300);
    let s = await pwState(p); ck(tag + ' 5 碼 以後 有 密碼 頁', !!s);
    if (s) { ck(tag + ' 第一次 ＝ 設 密碼：' + s.t, /第一次/.test(s.t)); ck(tag + ' 粉紅 2 格＋藍 6 格 ' + s.cells, s.cells === 'llddddddd'.slice(0, 2) + 'dddddd');
      ck(tag + ' 動畫 範例 8 個 字', s.ex === 8); ck(tag + ' 先 字母 鍵盤', s.letters && s.nk >= 26); ck(tag + ' 按鈕 ≧ 48px（' + s.small + ' 個 太小）', !s.small);
      ck(tag + ' 密碼 頁 放得下', !s.out); ck(tag + ' 不 左右 捲', s.ox <= 1);
      await typeP(p, 'ab'); s = await pwState(p); ck(tag + ' 2 個 字母 以後 ＝ 數字 鍵盤', !s.letters && s.nk >= 12); ck(tag + ' 數字 鍵盤 按鈕 ≧ 48px', !s.small); ck(tag + ' 數字 鍵盤 放得下', !s.out);
      await typeP(p, '123456'); await p.click('#scPwK button[data-p="ok"]'); await p.waitForTimeout(200); s = await pwState(p); ck(tag + ' 再 打 一次：' + s.t, /再 打 一次/.test(s.t));
      await typeP(p, 'ab123457'); await p.click('#scPwK button[data-p="ok"]'); await p.waitForTimeout(200); s = await pwState(p); ck(tag + ' 兩次 不一樣 ＝ 重設：' + s.m, /不一樣/.test(s.m) && /第一次/.test(s.t));
      await typeP(p, 'ab123456'); await p.click('#scPwK button[data-p="ok"]'); await typeP(p, 'ab123456'); await p.click('#scPwK button[data-p="ok"]'); await p.waitForTimeout(1400);
      const L = await p.evaluate(() => ({ id: SCID, pk: !!sessionStorage.getItem('score_pks_30412'), rem: !!localStorage.getItem('score_pk_30412') && localStorage.getItem('score_pk_30412') !== 'null' }));
      ck(tag + ' 設好 ＝ 登入 了 ' + JSON.stringify(L), L.id === '30412' && L.pk && !L.rem); ck(tag + ' 伺服器 存 了 密碼', G.post({ a: 'spl', pw: 't', id: '30412' }).p === 'ab123456');
      /* 新 分頁（沒有 這個 分頁 的 通行證）：「這是您嗎 ✅」＝ 要 打 密碼 */
      const p2 = await ctx.newPage(); p2.on('pageerror', e => er.push(e.message)); await p2.goto(HTTP + '/g3-review/index.html'); await p2.waitForTimeout(600);
      const yb = await p2.$('#scWhoY') || await p2.$('#scBarY'); ck(tag + ' 新 分頁 問「這是您嗎」', !!yb);
      if (yb) { await yb.click(); await p2.waitForTimeout(900); s = await pwState(p2); ck(tag + ' ✅ 是 ＝ 打 密碼：' + (s && s.t), s && /打 你 的 密碼/.test(s.t));
        await typeP(p2, 'ab999999'); await p2.click('#scPwK button[data-p="ok"]'); await p2.waitForTimeout(500); s = await pwState(p2); ck(tag + ' 打錯 ＝ 不對：' + s.m, /不對/.test(s.m));
        await p2.click('#scRem'); await typeP(p2, 'ab123456'); await p2.click('#scPwK button[data-p="ok"]'); await p2.waitForTimeout(1400);
        const L2 = await p2.evaluate(() => ({ ok: sessionStorage.getItem('sc_ok'), rem: localStorage.getItem('score_pk_30412') })); ck(tag + ' 打對 ＝ 登入＋記住 ' + JSON.stringify(L2).slice(0, 60), L2.ok === '30412' && /^"/.test(L2.rem || ''));
        const p3 = await ctx.newPage(); await p3.goto(HTTP + '/g3-review/index.html'); await p3.waitForTimeout(600); const y3 = await p3.$('#scWhoY') || await p3.$('#scBarY');
        if (y3) { await y3.click(); await p3.waitForTimeout(700); } ck(tag + ' 記住 了 ＝ 不用 再 打', !(await pwState(p3)) && await p3.evaluate(() => sessionStorage.getItem('sc_ok') === '30412')); await p3.close(); }
      /* 成績 有 帶 通行證、伺服器 收 了 */
      const sv0 = G.books['紀錄'].d.length; await p2.evaluate(() => { const Q = JSON.parse(localStorage.getItem('score_q') || '[]'); Q.push({ id: '30412', set: 'g3u1_1-1b', name: 'x', m: 't', qs: [[1, 0, 3, 0, .5, 0]], sec: 10, src: 'home', dev: 'd', u: 'uv' + Date.now(), t: Date.now() }); localStorage.setItem('score_q', JSON.stringify(Q)); scFlush(); });
      await p2.waitForTimeout(900); ck(tag + ' 送 成績 有 帶 通行證、收 了', G.books['紀錄'].d.length === sv0 + 1);
      /* 老師 清除 ➜ 平板 舊 的 通行證 不能 用、下次 登入 ＝ 第一次 設 */
      G.post({ a: 'spr', pw: 't', id: '30412' }); ck(tag + ' 清除 以後 ＝ 還沒 設', G.post({ a: 'sp', id: '30412' }).has === false); await p2.close(); }
    ck(tag + ' 沒有 程式 錯誤 ' + (er[0] || ''), !er.length); await ctx.close(); }
  /* 老師 還沒 重新 部署（舊 伺服器 不認得 sp ➜ {err:'a'}）：照 以前 不用 密碼 登入，不可以 卡住 */
  { const G = make({ TEACHER_PW: 't' }), ctx = await br.newContext({ viewport: { width: 1024, height: 768 } });
    await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); window.__SCORE_PW = 1; }, URL0);
    await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams), pd = r.request().postData() || '';
      const body = r.request().method() === 'POST' ? (/"a":"sp"/.test(pd) ? { err: 'a' } : G.post(pd)) : G.get(q);
      await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
    const p = await ctx.newPage(); await p.goto(HTTP + '/g3-review/index.html'); await p.waitForTimeout(500); await p.click('#scBarIn');
    for (const k of '30415') await p.click('.sckey button[data-k="' + k + '"]'); await p.click('.sckey button[data-k="ok"]'); await p.waitForTimeout(1600);
    ck('舊 伺服器（還沒 部署）＝ 照 以前 登入', await p.evaluate(() => SCID === '30415' && !document.getElementById('scPwC'))); await ctx.close(); }
  await br.close(); sv.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '✗' : '✓') + ' 🔑 密碼 登入 量了 ' + n + ' 項，失敗 ' + E.length + ' 項'); })();
