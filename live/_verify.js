/* live/_verify.js — ⚡ 現場任務 量測：老師大螢幕＋3 台學生平板真的玩兩場（2026-10-18 第十一次：🏆 經典搶答 5 題〔含 🔥 拼字〕＋ ⚔️ 討伐魔王 10 題）
 *   node live/_verify.js        只印失敗項和一行總結
 * 假的 Firebase：這一支自己開一台小伺服器（REST 讀寫＋串流，跟 Firebase 一樣的格式），網頁的 LIVE_DB 指到它；**絕對不連真的 Firebase**。
 * 假的成績系統：score/_gas_stub.js 跑真的 Code.gs（老師密碼、我的英雄、發獎勵），**絕對不送到真的成績表**。
 * 第十一次 多量：經典搶答 第一個、預設、QR Code、登入 3 步＋怎麼玩 動畫、**不用 打 號碼 自動 進入 自己 班**（別班 看不到）、等人 的 6 種 小遊戲（真的 玩 過關）、⚔ 換裝備、
 *   形狀 按鈕、長條圖、前 5 名、平板 整個 畫面 變色＋名次、🔥 拼字 點 方塊（分數 ✖2）、頒獎台、沒有「開房間」、在家複習 沒有 現場遊戲 入口
 * 量：密碼、學生加入、一題一題（答對 ✅、答錯 ❌、大螢幕血條變少）、一題一題（答對 ✅、答錯 ❌、大螢幕血條變少）、干擾（≦ 3 秒、演完送 🛡）、
 *     答對 5 題 ➜ 🐾 禮物盒（二～五選一、英雄說一句話）、🎮 功能真的生效（✂ 刪掉 2 個）、結束（前 3 名）、〔🎁 發獎勵〕存進「角色」、10 種任務畫面都畫得出來、字和按鈕的大小、不左右捲；設定頁 8 步＋測試 */
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { make } = require('../score/_gas_stub.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec', PW = 'pw-verify';
const E = []; let n = 0, HTTP = '';
const SHOT = process.env.SHOT, shot = (p, f) => SHOT ? p.screenshot({ path: path.join(SHOT, f + '.png') }) : null;   /* 看樣子用（不是量測）：SHOT=資料夾 */
/* ── 假的 Firebase（只有這一支用）── */
let DB = {}; const SUBS = [];
const seg = p => p.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
const getIn = (p) => { let t = DB; for (const k of seg(p)) { if (t == null || typeof t !== 'object') return null; t = t[k]; } return t === undefined ? null : t; };
const setIn = (p, v) => { const a = seg(p); if (!a.length) { DB = v || {}; return; } let o = DB; for (let i = 0; i < a.length - 1; i++) { if (!o[a[i]] || typeof o[a[i]] !== 'object') o[a[i]] = {}; o = o[a[i]]; } if (v == null) delete o[a[a.length - 1]]; else o[a[a.length - 1]] = v; };
const notify = () => SUBS.forEach(s => s.res.write('event: put\ndata: ' + JSON.stringify({ path: '/', data: getIn(s.p) }) + '\n\n'));
function serve() { return new Promise(ok => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.css': 'text/css', '.jpg': 'image/jpeg' };
  const s = require('http').createServer((q, r) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    if (u.startsWith('/fdb/')) {
      const p = u.slice(5).replace(/\.json$/, '');
      if (q.method === 'GET' && /event-stream/.test(q.headers.accept || '')) { r.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' }); const sub = { p, res: r }; SUBS.push(sub);
        r.write('event: put\ndata: ' + JSON.stringify({ path: '/', data: getIn(p) }) + '\n\n'); q.on('close', () => SUBS.splice(SUBS.indexOf(sub), 1)); return; }
      let b = ''; q.on('data', c => b += c); q.on('end', () => { let v = null; try { v = b ? JSON.parse(b) : null; } catch (x) { }
        if (q.method === 'PUT') setIn(p, v); else if (q.method === 'PATCH') Object.keys(v || {}).forEach(k => setIn(p + '/' + k, v[k])); else if (q.method === 'DELETE') setIn(p, null);
        if (q.method !== 'GET') notify(); r.writeHead(200, { 'content-type': 'application/json' }); r.end(JSON.stringify(q.method === 'GET' ? getIn(p) : v)); }); return; }
    const f = path.join(ROOT, u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; ok(s); }); }); }
async function ctxOf(br, G, vp, id) {
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
  await ctx.addInitScript(([u, f, id]) => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); Object.defineProperty(window, 'LIVE_DB', { get: () => f, set: () => {}, configurable: true });
    if (id) { localStorage.setItem('score_last', JSON.stringify(id)); localStorage.setItem('score_id_g4', JSON.stringify(id)); localStorage.setItem('score_act', JSON.stringify(Date.now())); sessionStorage.setItem('sc_ok', id); } }, [URL0, HTTP + '/fdb', id || '']);
  await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams);
    const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  await ctx.route(/script\.google\.com|firebaseio\.com|firebasedatabase\.app/, r => { E.push('想連到真的伺服器（擋下來了）：' + r.request().url().slice(0, 60)); r.abort(); });   /* 2026-10-18 第十次：fb.js 有老師的真網址了 ➜ 連過去 ＝ 失敗 */
  return ctx;
}
const sizes = (p, min) => p.evaluate(min => { const sm = [].filter.call(document.querySelectorAll('body *'), x => { const r = x.getBoundingClientRect(); if (!r.width || x.closest('#scbar,.pls,.rk5,.qside,.fxb,.goth,.lurl')) return false;
    return [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(x).fontSize) < min; }).map(x => x.textContent.trim().slice(0, 12));
  const low = [].filter.call(document.querySelectorAll('button:not(#scbar button),a.ghost,a.big'), x => { const r = x.getBoundingClientRect(); return r.width && r.height < 48; }).map(x => x.textContent.trim().slice(0, 10));
  return { sm, low, ox: document.documentElement.scrollWidth - innerWidth }; }, min);
const ckWords = (p, tag) => p.evaluate(() => document.body.innerText).then(t => { if (/開房間|房間/.test(t)) E.push(tag + '：畫面 上 還有「房間」：' + t.match(/.{0,10}房間.{0,10}/)[0]); });
async function students(br, G, list) { const S = [];
  for (const [id, vp] of list) { const c = await ctxOf(br, G, vp, id), p = await c.newPage(); p.on('pageerror', x => E.push(id + ' JS 錯誤：' + x.message));
    await p.goto(HTTP + '/live/index.html'); await p.waitForTimeout(1000); S.push({ id, p, c, vp }); }
  return S; }
async function hostIn(br, G, HV, tag) { const hc = await ctxOf(br, G, HV), h = await hc.newPage(); h.on('pageerror', x => E.push(tag + ' JS 錯誤：' + x.message));
  await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(300); return { hc, h }; }
/* 一題：學生 答（ok ＝ 哪幾個 答對），等 公布 */
async function answerQ(h, S, okSet, qi) {
  const q = await h.evaluate(() => ({ ty: H.Q[H.qi].ty, a: H.Q[H.qi].a, tiles: H.Q[H.qi].tiles }));
  for (const s of S) await s.p.waitForSelector('#sq:not([hidden]) ' + (q.ty === 'mc' ? '.so' : '.tile'), { timeout: 6000 }).catch(() => E.push(s.id + '：第 ' + (qi + 1) + ' 題 沒有出現'));
  for (const s of S) { const ok = okSet.indexOf(s.id) >= 0;
    if (q.ty === 'mc') await s.p.click('#sqo [data-k="' + (ok ? q.a : (q.a + 1) % 4) + '"]');
    else { const want = q.ty === 'sp' ? q.a.toLowerCase().split('') : q.a.split('|'), used = [];
      const seq = want.map(t => { for (let i = 0; i < q.tiles.length; i++) if (used.indexOf(i) < 0 && q.tiles[i] === t) { used.push(i); return i; } return -1; });
      if (!ok) { const t = seq[0]; seq[0] = seq[1]; seq[1] = t; }
      for (const i of seq) await s.p.click('[data-tile="' + i + '"]');
      await s.p.click('[data-chb="go"]'); } }
  await h.waitForFunction(() => H.phase === 'rev', null, { timeout: 8000 }).catch(() => E.push('第 ' + (qi + 1) + ' 題：大家 答完 沒有 公布'));
  await h.waitForTimeout(700); return q; }
(async () => {
  const srv = await serve(), br = await chromium.launch();
  /* 在家複習 不可以 有 現場遊戲 的 入口（老師 第 5(4) 點） */
  for (const d of ['g3-review', 'g4-review']) for (const f of fs.readdirSync(path.join(ROOT, d)).filter(f => /\.html$/.test(f))) {
    const t = fs.readFileSync(path.join(ROOT, d, f), 'utf8'); if (/href="[^"]*live\//.test(t) || /data-live|⚡ 加入 現場/.test(t)) E.push(d + '/' + f + '：在家複習 有 現場遊戲 入口'); }
  for (const f of ['host.html', 'index.html']) if (/開房間/.test(fs.readFileSync(path.join(__dirname, f), 'utf8'))) E.push('live/' + f + '：還有「開房間」');
  n += 3;
  /* ════ 第一場：🏆 經典搶答 5 題（第 3 題 🔥 拼字）、大螢幕 1920 ════ */
  { DB = {}; const G = make({ TEACHER_PW: PW }), HV = [1920, 1080], tag = '經典 大螢幕';
    G.post({ a: 'rpg', id: '40201', op: 'buy', item: 'b01' }); G.post({ a: 'rpg', id: '40201', op: 'buy', item: 'p03' });
    const { hc, h } = await hostIn(br, G, HV, tag);
    await h.fill('#pw', 'wrong'); await h.click('#pwgo'); await h.waitForTimeout(300);
    if (!/不對/.test(await h.textContent('#pwm'))) E.push(tag + '：密碼錯 沒有擋');
    await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(300);
    const st = await sizes(h, 24); if (st.sm.length || st.low.length || st.ox > 1) E.push(tag + ' 設定頁：字太小 ' + st.sm.slice(0, 3).join('、') + '／按鈕太矮 ' + st.low.slice(0, 3).join('、') + '／左右捲 ' + st.ox);
    const set = await h.evaluate(() => ({ n: document.querySelectorAll('[data-sk]').length, f: document.querySelector('[data-sk]').getAttribute('data-sk'), on: document.querySelector('[data-sk].on').getAttribute('data-sk'), sets: document.querySelectorAll('[data-sb].on').length, all: document.querySelectorAll('[data-sb]').length, bd: document.querySelectorAll('.gcd .badge').length }));
    if (set.n !== 11 || set.f !== 'classic' || set.on !== 'classic' || set.bd !== 11) E.push(tag + '：遊戲 不是「經典搶答 第一個、預設、11 種、都有 徽章」' + JSON.stringify(set));
    if (set.sets !== set.all) E.push(tag + '：題目 沒有 預設 全選');
    await ckWords(h, tag + ' 設定頁');
    /* 學生 先 登入（老師 還沒 建立）：402 的 兩台 ＋ 406 一台 ＋ 402 直的 */
    const S = await students(br, G, [['40201', [1024, 768]], ['40202', [820, 1180]], ['40203', [1024, 768]], ['40601', [1024, 768]]]);
    for (const s of S) { const w = await s.p.evaluate(() => ({ w: !document.getElementById('swait').hidden, t: document.getElementById('wt').textContent, code: !!document.getElementById('scode') }));
      if (!w.w || !/等 老師 建立/.test(w.t)) E.push(s.id + '：老師 還沒 建立，平板 沒有「等 老師 建立」：' + w.t.slice(0, 30));
      if (w.code) E.push(s.id + '：還有「輸入 號碼」的 畫面'); }
    await h.click('[data-sc="402"]'); await h.click('[data-sn="5"]'); await h.click('#mk'); await h.waitForTimeout(900);
    const lob = await h.evaluate(() => ({ qr: !!document.querySelector('#lqr svg'), qw: (document.querySelector('#lqr svg') || { getBoundingClientRect: () => ({ width: 0 }) }).getBoundingClientRect().width, u: document.getElementById('lurl').textContent, log: document.querySelectorAll('#llog .hw').length, how: document.querySelectorAll('#lhow .hw').length, code: H.code }));
    if (!lob.qr || lob.qw < 300 || !/live\/$/.test(lob.u)) E.push(tag + '：等人 畫面 沒有 大大的 QR Code：' + JSON.stringify(lob));
    if (lob.log !== 3 || lob.how !== 3) E.push(tag + '：等人 畫面 沒有「登入 3 步」「怎麼玩 3 步」動畫');
    { const sh = await h.evaluate(() => document.documentElement.scrollHeight - innerHeight); if (sh > 1) E.push(tag + '：等人 畫面 要 上下 捲 ' + sh + 'px（老師 看不到 全部）'); }
    if (lob.code !== '0402') E.push(tag + '：402 班 的 遊戲 不是 0402：' + lob.code);
    await h.waitForTimeout(1500);
    if ((await h.textContent('#lcnt')).trim() !== '3') E.push(tag + '：學生 沒有 自動 加入（' + (await h.textContent('#lcnt')) + ' 人，應該 3 人）');
    if (!(await h.$('#lpl img'))) E.push(tag + '：有英雄的人，大螢幕 沒有 英雄圖');
    await shot(h, 'c_lobby');
    const o6 = await S[3].p.textContent('#wt'); if (!/等 老師 建立 406/.test(o6)) E.push('別班（406）看到 402 的 遊戲：' + o6.slice(0, 40));
    await S[3].c.close(); S.pop();
    for (const s of S) { const t = await s.p.textContent('#wt'); if (!/已經 進入 402 班/.test(t)) E.push(s.id + '：沒有「已經 進入 402 班 的 遊戲」：' + t.slice(0, 30)); }
    /* 等人：6 種 小遊戲（每一種 都 真的 玩到 過關）、⚔ 換裝備、❓ 怎麼玩 */
    for (const s of [S[0], S[1]]) for (let k = 0; k < 6; k++) {
      const r = await s.p.evaluate(k => { const el = document.getElementById('wbody'); MINI.test(el, WORDS[4], k); const b = el.getBoundingClientRect(), mg = el.querySelector('.mg');
        const out = [].filter.call(el.querySelectorAll('button'), x => { const q = x.getBoundingClientRect(); return q.width && (q.right > innerWidth + 1 || q.left < -1); }).length;
        const small = [].filter.call(el.querySelectorAll('button'), x => { const q = x.getBoundingClientRect(); return q.width && q.height < 48; }).length;
        return { ok: !!mg, out, small, ox: document.documentElement.scrollWidth - innerWidth }; }, k);
      if (!r.ok || r.out || r.small || r.ox > 1) E.push(s.id + ' 小遊戲 ' + (k + 1) + '：畫不出來／超出／按鈕太小 ' + JSON.stringify(r));
      /* 照 答案 點，看 會 不會 過關（⭐ 變多） */
      const before = await s.p.evaluate(() => document.querySelector('.mgs').textContent);
      await s.p.evaluate(k => { const el = document.getElementById('wbody'), cl = x => x && x.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        if (k === 0 || k === 3) { const want = [].map.call(el.querySelectorAll('.mgsl i'), () => 0); const bs = [].slice.call(el.querySelectorAll('.bal'));
          const order = k === 3 ? bs.map(b => b.getAttribute('data-abc')).sort() : null;
          for (let i = 0; i < want.length; i++) { const nx = k === 3 ? bs.filter(b => !b.disabled && b.getAttribute('data-abc') === order[i])[0] : null;
            if (k === 3) cl(nx); else { /* 拼字：照 空格 順序，試 每一個 還沒 點 的 氣球 */ for (const b of bs.filter(b => !b.disabled)) { const n0 = el.querySelectorAll('.bal:disabled').length; cl(b); if (el.querySelectorAll('.bal:disabled').length > n0) break; } } } }
        else if (k === 1) { const cs = [].slice.call(el.querySelectorAll('.mcd')); for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) { /* 偷看 答案：同一對 */ } }
        else { cl(el.querySelector('[data-o="1"]')); } }, k);
      if (k === 1) { /* 翻牌：一對一對 試 */ const n6 = await s.p.evaluate(() => document.querySelectorAll('.mcd').length);
        for (let i = 0; i < n6; i++) for (let j = i + 1; j < n6; j++) { const dn = await s.p.evaluate(([i, j]) => { const c = document.querySelectorAll('.mcd'); if (c[i].classList.contains('done') || c[j].classList.contains('done')) return 1; c[i].click(); c[j].click(); return c[i].classList.contains('done') ? 1 : 0; }, [i, j]); if (!dn) await s.p.waitForTimeout(850); } }
      await s.p.waitForTimeout(1400);
      const after = await s.p.evaluate(() => document.querySelector('.mgs').textContent);
      if (before === after) E.push(s.id + ' 小遊戲 ' + (k + 1) + '：照 答案 點 了，沒有 過關（⭐ 沒有 變多）');
      if (k === 0) await shot(s.p, 'mini_' + s.id); }
    { const ps = await S[0].p.evaluate(() => { S.tab = 'eq'; drawWait(); return { n: document.querySelectorAll('[data-eq]').length, on: document.querySelectorAll('.eqb.on').length }; });
      if (ps.n < 2 || ps.on < 2) E.push('40201 ⚔ 換裝備：沒有 列出 自己 的 英雄、寵物 ' + JSON.stringify(ps));
      await S[0].p.evaluate(() => { S.tab = 'how'; drawWait(); }); if ((await S[0].p.$$('#wbody .how .hw')).length < 6) E.push('40201 ❓ 怎麼玩：沒有 遊戲 3 步＋登入 3 步');
      await S[0].p.evaluate(() => { S.tab = 'mini'; drawWait(); }); }
    const sz = await sizes(S[1].p, 20); if (sz.sm.length || sz.low.length || sz.ox > 1) E.push('學生（直）等待頁：字太小 ' + sz.sm.slice(0, 3).join('、') + '／按鈕 ' + sz.low.join('、') + '／左右捲 ' + sz.ox);
    await ckWords(S[0].p, '學生 等待頁');
    /* ▶ 開始：怎麼玩 ＋ 3、2、1 */
    await h.click('#go'); await h.waitForTimeout(800);
    if (await h.isHidden('#hhow') || (await h.$$('#hhw .how .hw')).length !== 3) E.push(tag + '：按 ▶ 開始 沒有「怎麼玩」');
    for (const s of S) if (await s.p.isHidden('#show')) E.push(s.id + '：開始 的 時候 平板 沒有「怎麼玩」');
    await h.waitForFunction(() => H.phase === 'q', null, { timeout: 12000 }).catch(() => E.push(tag + '：3、2、1 以後 沒有 第 1 題'));
    for (let qi = 0; qi < 5; qi++) {
      if (qi > 0) await h.waitForFunction(qi => H.phase === 'q' && H.qi === qi, qi, { timeout: 12000 }).catch(() => E.push('第 ' + (qi + 1) + ' 題 沒有 自己 來'));
      if (qi === 0) { const cl = await h.evaluate(() => ({ c: document.getElementById('hq').className, side: getComputedStyle(document.getElementById('gv')).display, sh: document.querySelectorAll('#qo .qo .shp svg').length }));
        if (!/classic/.test(cl.c) || cl.side !== 'none' || cl.sh !== 4) E.push(tag + '：經典搶答 不是 全寬＋四個 形狀 ' + JSON.stringify(cl));
        const qh = await sizes(h, 24); if (qh.sm.length || qh.ox > 1) E.push(tag + ' 題目：字太小 ' + qh.sm.slice(0, 3).join('、') + '／左右捲 ' + qh.ox);
        const q0 = await sizes(S[0].p, 20); if (q0.sm.length || q0.low.length || q0.ox > 1) E.push('學生 題目：字太小 ' + q0.sm.slice(0, 3).join('、') + '／按鈕 ' + q0.low.join('、') + '／左右捲 ' + q0.ox);
        if ((await S[1].p.$$('#sqo .so .shp svg')).length !== 4) E.push('學生 平板 按鈕 沒有 形狀'); await shot(h, 'c_q'); await shot(S[1].p, 'c_sqv'); }
      const q = await answerQ(h, S, qi === 0 ? ['40201', '40203'] : ['40201', '40202'], qi);
      if (qi === 2 && q.ty !== 'sp') E.push('第 3 題 不是 🔥 拼字（' + q.ty + '）');
      const rv = await h.evaluate(() => ({ bars: document.querySelectorAll('#qo .qd').length, ck: !!document.querySelector('#qo .qck,#qo .chans'), sc: H.sc }));
      if (q.ty === 'mc' && (rv.bars !== 4 || !rv.ck)) E.push('第 ' + (qi + 1) + ' 題：公布 沒有 長條圖＋✔');
      if (q.ty === 'sp' && !rv.ck) E.push('第 3 題：公布 沒有 正確 拼字');
      if (q.ty === 'sp' && !(rv.sc['40201'] >= 200 && rv.sc['40203'] === 0)) E.push('🔥 拼字：答對 沒有 ✖2、或 答錯 有分 ' + JSON.stringify(rv.sc));
      const r0 = await S[0].p.evaluate(() => ({ c: document.getElementById('res').className, t: document.getElementById('res').textContent })), r2 = await S[2].p.evaluate(() => document.getElementById('res').className);
      if (!/on ok/.test(r0.c) || !/第 \d+ 名/.test(r0.t) || !/＋/.test(r0.t)) E.push('第 ' + (qi + 1) + ' 題：答對 的 平板 沒有 整個 變綠＋分數＋名次 ' + r0.c);
      if (qi > 0 && !/on no/.test(r2)) E.push('第 ' + (qi + 1) + ' 題：答錯 的 平板 沒有 變紅');
      if (qi === 0) { await shot(S[0].p, 'c_res'); await h.waitForTimeout(2800); const lb = await h.evaluate(() => ({ on: document.getElementById('lb').classList.contains('on'), n: document.querySelectorAll('#lb .lbr').length }));
        if (!lb.on || lb.n !== 3) E.push(tag + '：公布 以後 沒有「前 5 名」' + JSON.stringify(lb)); await shot(h, 'c_lb');
        const ls = await sizes(h, 24); if (ls.sm.length) E.push(tag + ' 前 5 名：字太小 ' + ls.sm.slice(0, 3).join('、')); }
    }
    await h.waitForSelector('#hend:not([hidden])', { timeout: 15000 }).catch(() => E.push(tag + '：5 題 做完 沒有 頒獎台'));
    await h.waitForTimeout(3500); await shot(h, 'c_end');
    const en = await h.evaluate(() => ({ pod: document.querySelectorAll('#epod .kp').length, img: document.querySelectorAll('#epod img').length }));
    if (en.pod !== 3) E.push(tag + '：頒獎台 不對 ' + JSON.stringify(en));
    await ckWords(h, tag + ' 頒獎台');
    const se = await S[0].p.textContent('#send'); if (!/第 \d 名/.test(se)) E.push('學生 結束畫面 不對：' + se.slice(0, 40));
    await h.click('#give'); await h.waitForTimeout(900);
    if (!/發好了/.test(await h.textContent('#gm'))) E.push(tag + '：〔🎁 發獎勵〕沒有 成功：' + (await h.textContent('#gm')));
    const v1 = G.get({ a: 'rpg', id: '40201' }).v; if (!(v1.st.bx >= 10 && v1.st.bc >= 4)) E.push('發獎勵：「角色」沒有 加上 經驗值、金幣：' + JSON.stringify([v1.st.bc, v1.st.bx]));
    for (const s of S) await s.c.close(); await hc.close(); n += 70; }
  /* ════ 第二場：⚔️ 討伐魔王 10 題（禮物盒、干擾、功能）、大螢幕 1024 ════ */
  for (const HV of [[1024, 768]]) {
    DB = {}; const G = make({ TEACHER_PW: PW }), tag = '大螢幕 ' + HV.join('✕');
    G.post({ a: 'rpg', id: '40201', op: 'buy', item: 'b01' }); G.post({ a: 'rpg', id: '40201', op: 'buy', item: 'p03' });
    const { hc, h } = await hostIn(br, G, HV, tag);
    await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(300);
    const st = await sizes(h, 19); if (st.sm.length || st.low.length || st.ox > 1) E.push(tag + ' 設定頁：字太小 ' + st.sm.slice(0, 3).join('、') + '／按鈕太矮 ' + st.low.slice(0, 3).join('、') + '／左右捲 ' + st.ox);
    await h.click('[data-sc="402"]'); await h.click('[data-sk="boss"]'); await h.click('[data-ch="0"]'); await h.click('[data-sn="10"]'); await h.click('#mk'); await h.waitForTimeout(600);
    const S = await students(br, G, [['40201', [1024, 768]], ['40202', [820, 1180]], ['40203', [1024, 768]]]);
    await h.waitForTimeout(800);
    if ((await h.textContent('#lcnt')).trim() !== '3') E.push(tag + '：大螢幕 沒有 看到 3 個人加入（' + (await h.textContent('#lcnt')) + '）');
    await shot(h, 'lobby_' + HV[0]);
    await h.click('#go'); await h.waitForFunction(() => H.phase === 'q', null, { timeout: 12000 });
    const ans = () => h.evaluate(() => H.Q[H.qi].a);
    let hp0 = await h.evaluate(() => H.gs.hp);
    for (let qi = 0; qi < 10; qi++) {
      if (qi > 0) await h.waitForFunction(qi => H.phase === 'q' && H.qi === qi, qi, { timeout: 12000 }).catch(() => E.push('魔王 第 ' + (qi + 1) + ' 題 沒有 自己 來'));
      const a = await ans();
      for (const s of S) await s.p.waitForSelector('#sq:not([hidden]) .so', { timeout: 5000 }).catch(() => E.push(s.id + '：第 ' + (qi + 1) + ' 題 沒有出現'));
      if (qi === 0) { const qh = await sizes(h, 19); if (qh.sm.length || qh.ox > 1) E.push(tag + ' 題目：字太小 ' + qh.sm.slice(0, 3).join('、') + '／左右捲 ' + qh.ox); }
      if (qi === 2) { /* 干擾（大螢幕自動送；這裡直接叫它，量學生那邊） */
        await h.evaluate(() => { clearTimeout(H.tm2); fxSend(); }); await S[2].p.waitForTimeout(400);
        const f1 = await S[2].p.evaluate(() => ({ on: document.getElementById('fxo').classList.contains('on'), t: document.getElementById('fxo').textContent }));
        if (!f1.on || !/怒吼/.test(f1.t)) E.push('干擾：魔王 怒吼 沒有 出現在 學生 平板');
        await S[2].p.waitForTimeout(1800); const f2 = await S[2].p.evaluate(() => ({ on: document.getElementById('fxo').classList.contains('on'), sh: !!S.pend.shield }));
        if (f2.on || !f2.sh) E.push('干擾：3 秒內 沒有 消失、或 沒有 送 🛡' + JSON.stringify(f2)); }
      const cut = qi === 5 ? await S[0].p.evaluate(() => document.querySelectorAll('#sqo .so.cut').length) : -1;
      if (qi === 5 && cut !== 2) E.push('🎮 ✂ 刪掉 2 個：下一題 沒有 真的 刪掉 2 個（' + cut + '）');
      for (const s of S.slice(1)) if (await s.p.evaluate(() => document.getElementById('gift').classList.contains('on'))) { await s.p.click('[data-gk="r"]').catch(() => {}); await s.p.click('#gift .bx').catch(() => {}); await s.p.click('[data-gok]').catch(() => {}); }
      await S[0].p.click('#sqo [data-k="' + a + '"]');
      await S[1].p.click('#sqo [data-k="' + (qi === 0 ? (a + 1) % 4 : a) + '"]');
      await S[2].p.click('#sqo [data-k="' + (qi % 3 ? a : (a + 2) % 4) + '"]');
      await h.waitForFunction(() => H.phase === 'rev', null, { timeout: 8000 }).catch(() => {}); await h.waitForTimeout(600);
      const r0 = await S[0].p.textContent('#res'), r1 = await S[1].p.textContent('#res');
      if (!/答對/.test(r0)) E.push('魔王 第 ' + (qi + 1) + ' 題：答對的 沒有 ✅（' + r0.slice(0, 20) + '）');
      if (qi === 0 && !/答錯/.test(r1)) E.push('魔王 第 1 題：答錯的 沒有 ❌');
      if (qi === 0) { const d0 = await S[0].p.evaluate(() => 10 + Math.min(20, Math.floor(((S.me && S.me.power) || 0) / 100)));
        if (r0.indexOf('出招 ➜ 魔王 －' + d0) < 0 || /出招/.test(r1)) E.push('魔王 第 1 題：答對 沒有寫「出招 ➜ 魔王 －' + d0 + '」（' + r0.slice(0, 60) + '）');
        const hp1 = await h.evaluate(() => H.gs.hp); if (!(hp1 < hp0)) E.push(tag + '：答對了 魔王 血條 沒有 變少');
        if (!(await h.$('#gv .hits .hit1'))) E.push(tag + '：答對 的 英雄 沒有 飛過去 出招');
        await shot(h, 'hq_' + HV[0]); await shot(S[0].p, 'sq_' + HV[0]); }
      if (qi === 4 || qi === 9) { /* 01 答對 5、10 題 ➜ 🐾 禮物盒（老師先按 ⏸ 停在這一題，量完再繼續） */
        await h.click('#hp');
        await S[0].p.waitForTimeout(2600);
        const g = await S[0].p.evaluate(() => ({ on: document.getElementById('gift').classList.contains('on'), t: document.getElementById('gift').textContent, pet: !!document.querySelector('#gift .gpi') }));
        if (!g.on || !/寵物/.test(g.t) || !g.pet) E.push('答對 ' + (qi + 1) + ' 題 沒有 🐾 寵物 叼來 禮物盒');
        if (qi === 4) { await S[0].p.evaluate(() => { LV.pickN = function () { return 3; }; LV.shuf = function (a) { a = a.slice(); var i = a.map(function (x) { return x.k; }).indexOf('cut'); if (i > 0) { var t = a[0]; a[0] = a[i]; a[i] = t; } return a; }; }); await S[0].p.click('[data-gk="f"]'); }
        else await S[0].p.click('[data-gk="r"]');
        await S[0].p.waitForTimeout(500);
        const nb = await S[0].p.evaluate(() => document.querySelectorAll('#gift .bx').length);
        if (nb < 2 || nb > 5) E.push('禮物盒 不是 二～五選一（' + nb + '）');
        await S[0].p.click('#gift .bx[data-gi="0"]'); await S[0].p.waitForTimeout(1300);
        const o = await S[0].p.evaluate(() => ({ t: document.getElementById('gift').textContent, hero: !!document.querySelector('#gift .ghi'), say: (document.querySelector('#gift .say') || {}).textContent }));
        if (!o.hero || !o.say) E.push('打開 盒子 沒有 飛出 英雄＋說一句話');
        if (qi === 4 && !/刪掉 2 個/.test(o.t)) E.push('🎮 選的 不是 ✂ 刪掉 2 個：' + o.t.slice(0, 40));
        if (await S[0].p.$('[data-gok]')) await S[0].p.click('[data-gok]'); else E.push('打開盒子以後 沒有〔👌 好〕');
        if (await h.evaluate(() => H.phase) !== 'rev') E.push('按 ⏸ 以後 大螢幕 還是 自己 換題');
        await h.click('#hp'); await h.waitForTimeout(400);
      }
    }
    await h.waitForSelector('#hend:not([hidden])', { timeout: 12000 }).catch(() => E.push(tag + '：10 題 做完 沒有 結束畫面'));
    await h.waitForTimeout(800);
    const en = await h.evaluate(() => ({ r: document.getElementById('eres').textContent, pod: document.querySelectorAll('#epod .kp').length, rw: document.getElementById('erw').textContent }));
    if (!/魔王/.test(en.r) || en.pod !== 3 || !/1 個/.test(en.rw)) E.push(tag + '：結束畫面 不對：' + JSON.stringify(en));
    await h.click('#give'); await h.waitForTimeout(900);
    if (!/發好了/.test(await h.textContent('#gm'))) E.push(tag + '：〔🎁 發獎勵〕沒有 成功：' + (await h.textContent('#gm')));
    const v1 = G.get({ a: 'rpg', id: '40201' }).v, v2 = G.get({ a: 'rpg', id: '40202' }).v;
    if (!(v1.st.bx >= 10 && v1.st.bc >= 10) || !(v2.st.bc >= 9)) E.push('發獎勵：「角色」沒有 加上 經驗值、金幣：' + JSON.stringify([v1.st.bc, v1.st.bx, v2.st.bc]));
    if (!(await h.evaluate(() => document.getElementById('give').disabled))) E.push('發獎勵 可以 按 兩次');
    /* 10 種 場景：兩種 大螢幕 尺寸、題目 中、公布 都 畫得 出來、不 超出 框 */
    for (const VW of [[1920, 1080], [1024, 768]]) { await h.setViewportSize({ width: VW[0], height: VW[1] });
      for (const g of ['boss', 'race', 'tug', 'map', 'tower', 'pet', 'shoot', 'treasure', 'surf', 'king']) for (const ph of ['q', 'rev']) {
        await h.evaluate(([g, ph]) => { H.game = g; H.phase = ph; H.hits = ids().map(function (id, i) { return { id: id, ms: 1000 * i, d: 12 }; }); H.gs.arr = H.hits.map(function (x, i) { return { id: x.id, r: i % 5 }; }); H.gs.en = .8; H.gs.pet = 3; H.gs.tr = 3; H.gs.cells = [0, 1, 0, 1, 1]; H.gs.nw = [0, 1];
          scr('hq'); document.getElementById('hq').className = 'scr side'; drawGame(); }, [g, ph]);
        await h.waitForTimeout(1500);   /* 動畫 演完 才 量（箭 從 外面 飛進來） */
        const r = await h.evaluate(() => { const el = document.getElementById('gv'), b = el.getBoundingClientRect();
          return { t: el.textContent.length, img: el.querySelectorAll('img').length, out: [].filter.call(el.querySelectorAll('*'), x => { if (x.closest('.sf svg')) return false; /* 衝浪 的 浪 故意 比 框 寬（框 會 切掉、一直 往 旁邊 流） */ const q = x.getBoundingClientRect(); return q.width && q.height && (q.right > b.right + 2 || q.left < b.left - 2 || q.bottom > b.bottom + 2); }).map(x => x.className).slice(0, 3) }; });
        if (r.t < 6 || r.out.length) E.push('場景 ' + g + '（' + ph + '，' + VW[0] + '）：沒有 內容 或 超出 框 ' + JSON.stringify(r.out));
        if (['boss', 'race', 'tug', 'pet', 'surf', 'king'].indexOf(g) >= 0 && ph === 'rev' && !r.img) E.push('場景 ' + g + '：沒有 用 學生 的 英雄／寵物 圖');
        if (ph === 'rev' && VW[0] === 1920) await shot(h, 'scene_' + g); }
      n += 20; }
    for (const s of S) await s.c.close(); await hc.close(); n += 40;
  }
  /* 設定頁：8 步、複製規則、測試（假的 Firebase 網址 ➜ 量測自己回答） */
  { const c = await br.newContext({ viewport: { width: 1024, height: 768 } }), p = await c.newPage(); p.on('pageerror', x => E.push('設定頁 JS 錯誤：' + x.message));
    const FB = 'https://test-default-rtdb.asia-southeast1.firebasedatabase.app';
    await c.route(FB + '/**', r => { const m = r.request().method(), u = new URL(r.request().url()).pathname.replace(/\.json$/, '');
      let v = null; try { v = r.request().postData() ? JSON.parse(r.request().postData()) : null; } catch (x) {}
      if (m === 'PUT') setIn('/sp' + u, v); else if (m === 'DELETE') setIn('/sp' + u, null);
      r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(m === 'GET' ? getIn('/sp' + u) : v) }); });
    await p.goto(HTTP + '/live/setup.html'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
    const nd = await p.evaluate(() => STEPS.length); if (nd !== 8) E.push('設定頁 不是 8 步（' + nd + '）');
    for (let k = 0; k < 8; k++) { const z = await p.evaluate(() => ({ h: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize), ox: document.documentElement.scrollWidth - innerWidth }));
      if (z.h < 30 || z.ox > 1) E.push('設定頁 第 ' + (k + 1) + ' 步：標題太小 或 左右捲'); if (k < 7) await p.click('#nx'); }
    await p.fill('#u', 'https://abc.com'); await p.click('#test'); await p.waitForTimeout(200);
    if (!/網址 不對/.test(await p.textContent('#tm'))) E.push('設定頁：錯的 網址 沒有 擋');
    await p.fill('#u', FB); await p.click('#test'); await p.waitForTimeout(800);
    if (!/成功/.test(await p.textContent('#tm'))) E.push('設定頁：測試 沒有 成功：' + (await p.textContent('#tm')));
    await c.close(); n += 12; }
  await br.close(); srv.close();
  E.forEach(x => console.log('✗ ' + x));
  console.log('現場任務 量測 ' + (n + 1) + ' 項，' + E.length + ' 個失敗');
  process.exit(E.length ? 1 : 0);
})();
