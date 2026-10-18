/* score/_verify_login.js — 量學生登入（2026-10-12 D 第 6 件）：首頁橫幅、「請問 這是您嗎？」、3 分鐘登出（30 秒提醒）、做完提醒登出。只印失敗項和一行總結。
 *   node score/_verify_login.js
 * 假伺服器（score/_gas_stub.js 跑真的 Code.gs），絕對不送到真的成績表。三種尺寸：iPad 橫、iPad 直、教室觸控螢幕。
 * 首頁用 http 開（跟 GitHub Pages 一樣，localStorage 每一頁共用）。
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const { make } = require('./_gas_stub.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec';
const VPS = [[1024, 768], [820, 1180], [1920, 1080]];
const HOMES = [['index.html', 0], ['G3 - L1 + L2/index.html', 3], ['sentences/index.html', 4], ['g3-review/index.html', 3], ['g4-review/index.html', 4]];
let fails = 0, n = 0;
const out = (w, e) => { if (e.length) { fails += e.length; console.log('✗ ' + w); e.forEach(x => console.log('   ' + x)); } };
let HTTP = '';
function serve() { return new Promise(ok => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.css': 'text/css', '.svg': 'image/svg+xml' };
  const s = require('http').createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; ok(s); }); }); }
async function ctxOf(br, vp) {
  const G = make({ TEACHER_PW: 'pw-verify' }), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
  await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); }, URL0);
  await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams);
    const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  await ctx.route(/script\.google\.com/, r => r.abort());
  ctx.G = G; return ctx;
}
const innerHeightOf = vp => vp[1];
const url = f => HTTP + '/' + f.split('/').map(encodeURIComponent).join('/');
/* 橫幅：在不在、字多大、有沒有蓋住下面的東西 */
const bar = p => p.evaluate(() => { const b = document.getElementById('scbar'); if (!b || b.hidden) return null; const r = b.getBoundingClientRect(), e = [];
  [].forEach.call(b.querySelectorAll('span,button'), x => { const z = parseFloat(getComputedStyle(x).fontSize); if (z < 22) e.push('橫幅字太小 ' + z + 'px：' + x.textContent); });
  [].forEach.call(b.querySelectorAll('button'), x => { if (x.getBoundingClientRect().height < 48) e.push('橫幅按鈕太矮：' + x.textContent); });
  /* 不蓋住：橫幅下面第一個看得到的東西在橫幅下面 */
  const nx = b.nextElementSibling && [].filter.call(b.parentNode.children, x => x !== b && x.tagName !== 'SCRIPT' && x.tagName !== 'STYLE' && x.getBoundingClientRect().height > 0)[0];
  if (!b.classList.contains('inl') && nx && nx.getBoundingClientRect().top < r.bottom - 1) e.push('橫幅蓋住下面的東西（' + nx.tagName + '）');
  const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!b.contains(top)) e.push('橫幅被別的東西蓋住');   /* 量橫幅自己的正中間（總首頁的橫幅在標題那一行，不一定在螢幕正中間） */
  if (/index\.html$|\/$/.test(location.pathname) && !/review|sentences|L1/.test(decodeURIComponent(location.pathname)) && document.documentElement.scrollHeight > innerHeight + 1 && innerWidth > innerHeight) e.push('總首頁有捲軸 ' + (document.documentElement.scrollHeight - innerHeight) + 'px（投影會被切掉）');
  return { t: b.innerText.replace(/\s+/g, ' ').trim(), e, ox: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
const full = (p, id) => p.evaluate(id => { const o = document.getElementById(id); if (!o || !o.classList.contains('on')) return null; const e = [];
  [].forEach.call(o.querySelectorAll('.t1,.t2,.t3,.id,button'), x => { const z = parseFloat(getComputedStyle(x).fontSize); if (z < 26) e.push('字太小 ' + z + 'px：' + x.textContent); });
  const r = o.querySelector('.scfb').getBoundingClientRect(); if (r.bottom > innerHeight + 1 || r.right > innerWidth + 1) e.push('超出畫面');
  return { t: o.innerText.replace(/\s+/g, ' ').trim(), e }; }, id);
async function typeId(p, id) { for (const d of id) await p.click('.sckey button[data-k="' + d + '"]'); await p.click('.sckey button[data-k="ok"]'); await p.waitForTimeout(900); }
const clk = (p, sel, e) => p.click(sel, { timeout: 4000 }).catch(x => e.push('按不到 ' + sel + '：' + x.message.split('\n').filter(l => /intercept|not|wait/.test(l)).slice(0, 4).join(' ｜ ')));
const ls = (p, k) => p.evaluate(k => localStorage.getItem('score_' + k), k);

async function run(br, vp) {
  const ctx = await ctxOf(br, vp), W = '@' + vp.join('x');
  /* ① 每一個首頁：沒登入 ＝ 橫幅「👤 還沒登入〔🔑 登入〕」，不蓋住、不橫向溢出、沒有 🚪 */
  for (const [f] of HOMES) {
    const p = await ctx.newPage(), e = []; p.on('pageerror', x => e.push('JS 例外：' + x.message));
    await p.goto(url(f)); await p.waitForTimeout(500);
    const b = await bar(p); n += 4;
    if (!b) e.push('沒有登入橫幅');
    else { b.e.forEach(x => e.push(x)); if (b.ox > 0) e.push('橫向溢出 ' + b.ox + 'px');
      /* 2026-10-17 C8 另 6：在家複習首頁 ＝ 大大的〔🔑 先 登入〕＋兩個好習慣（① 先登入 練習才會記下來 ② 練完 一定 登出） */
      if (/review/.test(f)) { const h = await p.evaluate(() => { const b = document.getElementById('scBarIn'), r = b.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return { h: r.height, f: parseFloat(getComputedStyle(b).fontSize), top: r.top, hit: b.contains(t), st: document.querySelectorAll('#scbar .hst').length }; });
        if (!/👋 開始練習 以前 🔑 先 登入/.test(b.t) || !/① 先 🔑 登入 ➜ 你的 練習 和 努力 .* 都會 記在 老師 的 成績 裡/.test(b.t) || !/② 練完 ➜ 一定 按 👋 登出 ➜ .* 保護 自己 和 同學 的 成績/.test(b.t)) e.push('在家複習首頁沒有兩個好習慣：' + b.t);
        if (h.h < 70 || h.f < 32 || h.top > innerHeightOf(vp) * .5 || h.st !== 2) e.push('〔🔑 先 登入〕不夠醒目（要 ≧ 70px 高、字 ≧ 32px、在畫面上半部）：' + JSON.stringify(h)); }
      else if (b.t !== '👤 還沒登入 🔑 登入') e.push('沒登入的橫幅不對：' + b.t); }
    if (await p.evaluate(() => /🚪/.test(document.body.innerText))) e.push('還有 🚪');
    out(f + ' 沒登入 ' + W, e); await p.close();
  }
  /* ② 總首頁按〔🔑 登入〕➜ 打號碼 ➜ 橫幅「👤 30405〔👋 登出〕」（剛登入不用再問這是您嗎） */
  { const p = await ctx.newPage(), e = []; p.on('pageerror', x => e.push('JS 例外：' + x.message));
    await p.goto(url('index.html')); await p.waitForTimeout(400);
    await p.click('#scBarIn'); await p.waitForTimeout(300);
    if (!await p.$('#scBox')) e.push('〔🔑 登入〕沒有打開數字鍵盤');
    else { await typeId(p, '30405'); const b = await bar(p);
      if (!b || b.t !== '👤 30405 👋 登出') e.push('登入以後橫幅不對：' + (b && b.t)); if (b) b.e.forEach(x => e.push(x));
      await p.evaluate(() => { try { sessionStorage.removeItem('sc_ok'); } catch (x) {} scBar(); }); const bq = await bar(p);
      if (!bq || bq.t !== '請問 這是您嗎？30405 ✅ 是 👋 不是，登出') e.push('還沒按 ✅ 的橫幅不對：' + (bq && bq.t)); if (bq) bq.e.forEach(x => e.push('還沒按 ✅：' + x));
      await p.click('#scBarY'); await p.waitForTimeout(200);
      if (await p.evaluate(() => document.getElementById('scov').classList.contains('on'))) e.push('登入以後數字鍵盤沒有關掉');
      if (await full(p, 'scwho')) e.push('剛登入又問「這是您嗎」'); }
    n += 4; out('總首頁登入 ' + W, e); await p.close(); }
  /* ③ 打開網站的第一頁（新的分頁）：整頁大字「請問 這是您嗎？30405〔✅ 是，繼續〕〔👋 不是，登出〕」；按 ✅ ➜ 橫幅「👤 30405」，換頁不再問 */
  { const p = await ctx.newPage(), e = []; p.on('pageerror', x => e.push('JS 例外：' + x.message));
    await p.goto(url('G3 - L1 + L2/index.html')); await p.waitForTimeout(500);
    const w = await full(p, 'scwho');
    if (!w) e.push('打開網站沒有問「請問 這是您嗎？」');
    else { w.e.forEach(x => e.push('這是您嗎：' + x)); if (!/請問 這是您嗎？ 30405 ✅ 是，繼續 👋 不是，登出/.test(w.t)) e.push('這是您嗎的字不對：' + w.t); }
    await p.click('#scWhoY'); await p.waitForTimeout(300);
    if (await full(p, 'scwho')) e.push('按 ✅ 以後沒有關掉');
    const b = await bar(p); if (!b || b.t !== '👤 30405 戰神之路 👋 登出') e.push('按 ✅ 以後橫幅不對：' + (b && b.t));   /* 2026-10-17：年級首頁的橫幅多〔🦸 我的英雄〕（總首頁一行的小橫幅不放） */
    await p.goto(url('index.html')); await p.waitForTimeout(400);
    if (await full(p, 'scwho')) e.push('換頁又問了一次');
    const b4 = await bar(p); if (!b4 || b4.t !== '👤 30405 👋 登出') e.push('換到總首頁橫幅不對：' + (b4 && b4.t));
    await p.goto(url('sentences/index.html')); await p.waitForTimeout(400);
    const b5 = await bar(p); if (!b5 || b5.t !== '👤 還沒登入 🔑 登入') e.push('三年級的號碼在四年級首頁應該是「還沒登入」：' + (b5 && b5.t));
    await p.goto(url('G3 - L1 + L2/index.html')); await p.waitForTimeout(400);
    n += 6;
    /* ④ 3 分鐘沒動作：最後 30 秒大字「⏳ 30 秒後自動登出〔👆 我還在〕」（不寫「請問 您還在嗎？」）；按了就不登出 */
    await p.evaluate(() => localStorage.setItem('score_act', JSON.stringify(Date.now() - 155000))); await p.waitForTimeout(1300);
    const i1 = await full(p, 'scidle');
    if (!i1) e.push('2 分 30 秒沒動作沒有提醒');
    else { i1.e.forEach(x => e.push('30 秒提醒：' + x)); if (!/⏳ \d+ 秒後自動登出 👆 我還在/.test(i1.t)) e.push('30 秒提醒的字不對：' + i1.t); if (/您還在嗎/.test(i1.t)) e.push('提醒還寫「請問 您還在嗎？」'); }
    await clk(p, '#scStay', e); await p.waitForTimeout(1300);
    if (await full(p, 'scidle')) e.push('按〔👆 我還在〕提醒沒有關掉');
    if (!await ls(p, 'last')) e.push('按〔👆 我還在〕還是被登出了');
    /* 時間到 ＝ 登出＋「👋 已經登出了／3 分鐘沒有動作〔🔑 登入〕」 */
    await p.evaluate(() => localStorage.setItem('score_act', JSON.stringify(Date.now() - 181000))); await p.waitForTimeout(1300);
    const o = await full(p, 'scbye2');
    if (!o || !/👋 已經登出了 3 分鐘沒有動作 🔑 登入/.test(o.t)) e.push('3 分鐘沒動作沒有寫「已經登出了」：' + (o && o.t));
    if (await ls(p, 'last') !== 'null' || await ls(p, 'id_g3') !== 'null') e.push('3 分鐘沒動作號碼沒有清掉');
    const b0 = await bar(p); if (!b0 || b0.t !== '👤 還沒登入 🔑 登入') e.push('登出以後橫幅不對：' + (b0 && b0.t));
    await clk(p, '#scByeIn', e); await p.waitForTimeout(300);
    if (!await p.$('#scBox')) e.push('〔🔑 登入〕沒有打開數字鍵盤');
    n += 8; out('這是您嗎＋3 分鐘 ' + W, e); await p.close(); }
  /* ⑤「👋 不是，登出」＝ 號碼清掉、原地馬上打開數字鍵盤 */
  { const p = await ctx.newPage(), e = []; p.on('pageerror', x => e.push('JS 例外：' + x.message));
    await p.goto(url('index.html')); await p.evaluate(() => { localStorage.setItem('score_last', '"40205"'); localStorage.setItem('score_id_g4', '"40205"'); localStorage.setItem('score_act', JSON.stringify(Date.now())); });
    await p.goto(url('g4-review/index.html')); await p.waitForTimeout(500);
    if (!await full(p, 'scwho')) e.push('在家複習首頁沒有問「這是您嗎」');
    await p.click('#scWhoN'); await p.waitForTimeout(400);
    if (await ls(p, 'last') !== 'null') e.push('〔👋 不是，登出〕號碼沒有清掉');
    if (!await p.$('#scBox')) e.push('〔👋 不是，登出〕沒有原地打開數字鍵盤');
    n += 3; out('不是，登出 ' + W, e); await p.close(); }
  /* 2026-10-17 C8 另 6：在家複習首頁登入以後：「✅ 40205 已經登入：練習 都會 記下來／練完 一定 按 👋 登出」＋〔👋 登出〕 */
  { const p = await ctx.newPage(), e = []; p.on('pageerror', x => e.push('JS 例外：' + x.message));
    await p.goto(url('index.html')); await p.evaluate(() => { localStorage.setItem('score_last', '"40205"'); localStorage.setItem('score_id_g4', '"40205"'); localStorage.setItem('score_act', JSON.stringify(Date.now())); sessionStorage.setItem('sc_ok', '40205'); });
    await p.goto(url('g4-review/index.html')); await p.waitForTimeout(500);
    const b = await bar(p); if (!b || !/✅ 40205 已經登入：練習 都會 記下來 📊 練完 一定 按 👋 登出 戰神之路 👋 登出/.test(b.t)) e.push('在家複習首頁登入以後橫幅不對：' + (b && b.t)); if (b) b.e.forEach(x => e.push(x));
    await clk(p, '#scBarOut', e); await p.waitForTimeout(300); if (await ls(p, 'last') !== 'null') e.push('〔👋 登出〕號碼沒有清掉');
    n += 2; out('在家複習登入以後 ' + W, e); await p.close(); }
  /* ⑥〔🔒 開關〕（D 第 7 件）：老師鎖 304 班的「基礎句型 ①」「🧩 遊戲 g3」「數字：單字結構」 */
  ctx.G.post({ a: 'lock', pw: 'pw-verify', cls: ['304'], keys: ['g3rv_u1-t0-0', 'g3rv_gm-g3', 'g3rv_mo-numbers-parts'], on: true });
  { const p = await ctx.newPage(), e = []; p.on('pageerror', x => e.push('JS 例外：' + x.message));
    await p.goto(url('index.html')); await p.evaluate(() => { ['last', 'id_g3', 'id_g4'].forEach(k => localStorage.removeItem('score_' + k)); });
    await p.goto(url('g3-review/index.html')); await p.waitForTimeout(800);
    const bd = await p.evaluate(() => [].map.call(document.querySelectorAll('a[data-lk] .sclkb'), x => x.closest('a').getAttribute('data-lk') + '｜' + x.textContent));
    if (bd.join() !== 'g3rv_u1-t0-0｜🔒 請先登入,g3rv_gm-g3｜🔒 請先登入,g3rv_mo-numbers-parts｜🔒 請先登入') e.push('沒登入：被任何一班鎖住的主題應該寫「🔒 請先登入」：' + bd.join());
    await p.click('a[data-lk="g3rv_u1-t0-0"]'); await p.waitForTimeout(400);
    const f1 = await full(p, 'sclk'); if (!f1 || f1.t !== '🔒 請先登入 🔑 登入 👌 知道了') e.push('按鎖住的主題：不對 ' + (f1 && f1.t)); if (f1) f1.e.forEach(x => e.push('請先登入：' + x));
    if (/30[47]|311|班/.test((f1 && f1.t) || '')) e.push('寫了鎖了哪幾班');
    if (!/index\.html$/.test(p.url())) e.push('鎖住的主題還是打開了');
    /* 別班（311）登入 ➜ 沒有鎖 ➜ 直接打開那一頁 */
    await clk(p, '#scLkIn', e); await p.waitForTimeout(300); await typeId(p, '31101'); await p.waitForTimeout(1500);
    if (!/u1\.html#t0-0$/.test(p.url())) e.push('311 班登入以後沒有打開「基礎句型 ①」：' + p.url());
    else if (await full(p, 'sclk')) e.push('311 班（沒有鎖）還是看到 🔒');
    n += 5; out('🔒 請先登入 ' + W, e); await p.close(); }
  { const p = await ctx.newPage(), e = []; p.on('pageerror', x => e.push('JS 例外：' + x.message));
    await p.goto(url('index.html')); await p.evaluate(() => { localStorage.setItem('score_last', '"30405"'); localStorage.setItem('score_id_g3', '"30405"'); localStorage.setItem('score_act', JSON.stringify(Date.now())); sessionStorage.setItem('sc_ok', '30405'); });
    for (const [f, w] of [['g3-review/u1.html#t0-0', '句型卡分頁'], ['g3-review/games.html#g3', '遊戲'], ['g3-review/numbers-parts.html', '補充頁']]) {
      await p.goto(url(f.split('#')[0]) + (f.indexOf('#') > 0 ? '#' + f.split('#')[1] : '')); await p.waitForTimeout(1500);
      const f2 = await full(p, 'sclk'); if (!f2 || f2.t !== '🔒 還沒開放 ⬅ 回首頁') e.push(w + '：304 班登入了應該是「🔒 還沒開放」：' + (f2 && f2.t)); else f2.e.forEach(x => e.push(w + '：' + x)); }
    await clk(p, '#scLkHome', e); await p.waitForTimeout(600);
    if (!/g3-review\/index\.html$/.test(p.url())) e.push('〔⬅ 回首頁〕沒有回到複習首頁：' + p.url());
    const bd = await p.evaluate(() => [].map.call(document.querySelectorAll('a[data-lk] .sclkb'), x => x.textContent)); if (bd.join() !== '🔒 還沒開放,🔒 還沒開放,🔒 還沒開放') e.push('304 班的首頁不對：' + bd.join());
    /* 換到沒鎖的分頁（基礎句型 ②）照樣打得開 */
    await p.goto(url('g3-review/u1.html') + '#t1-0'); await p.waitForTimeout(1200); if (await full(p, 'sclk')) e.push('沒鎖的分頁也被鎖');
    n += 6; out('🔒 還沒開放 ' + W, e); await p.close(); }
  await ctx.close();
}
(async () => {
  const srv = await serve(), br = await chromium.launch();
  for (const vp of VPS) { if (process.env.VP && String(vp[0]) !== process.env.VP) continue; try { await run(br, vp); } catch (x) { fails++; console.log('✗ @' + vp.join('x') + ' 量測卡住：' + String(x.message).split('\n')[0] + '（' + (String(x.stack).match(/_verify_login\.js:\d+/g) || []).slice(0, 2).join(' ') + '）'); } }
  await br.close(); srv.close();
  console.log((fails ? '✗ ' : '✓ ') + '學生登入（首頁 5 頁＋這是您嗎＋3 分鐘＋不是，登出 ✕ 3 尺寸）量了 ' + n + ' 項，失敗 ' + fails + ' 項');
  process.exit(fails ? 1 : 0);
})();
