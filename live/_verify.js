/* live/_verify.js — ⚡ 現場任務 量測（2026-10-18 第十二次 重寫：老師 試玩 以後 的 問題 一個一個 量）
 *   node live/_verify.js        只印失敗項和一行總結；SHOT=資料夾 拍照看樣子
 * 假的 Firebase：這一支自己開一台小伺服器（REST 讀寫，跟 Firebase 一樣的格式），網頁的 LIVE_DB 指到它；**絕對不連真的 Firebase**。
 * 假的成績系統：score/_gas_stub.js 跑真的 Code.gs（老師密碼、戰神之路、發獎勵、記成績），**絕對不送到真的成績表**。
 * 量：不用「一直 連著 的 線」（EventSource）；老師 還沒 建立 ＝ 平板「等 老師 建立」＋ 等人小遊戲 真的 玩完 一回 ➜ 成績 表 多 一列 g4gm_lm-…；
 *     設定頁（三／四年級、「26 題」、預設 5 題、全選）；等人 頁（QR、〔📋 複製 網址〕、① ② ③ 不動、座號 格子 亮、沒有 一直 動 的 動畫）；
 *     每一題：平板 看到 的 題目 ＝ 大螢幕、老師 看到「✔ 座號」收到 答案、全部 答完 自動 公布、錯題 分析（逐字 中文、翻譯、💡、你選的 紅框）、
 *     大螢幕 自動 唸、平板 不出聲（沒有 任何 音效）、〔🏆 看 排行榜〕〔▶ 下一題〕按鈕 一直 在、平板 名次；🔥 挑戰題 ✖2；
 *     頒獎 典禮（10 種 風格、前 3 名 上台、沒有 聲音）、全班 錯題 總分析（長條、排行、🔊）、平板 個人 錯題 總分析；〔🎁 發獎勵〕；
 *     第二場 ⚔️ 討伐魔王（干擾、禮物盒、✂ 功能）、10 種 場景 兩種 尺寸；學生 頁面 沒有「英雄」；設定頁 8 步＋測試 */
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { make } = require('../score/_gas_stub.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec', PW = 'pw-verify';
const E = []; let n = 0, HTTP = '', REQ = 0, BULB = 0;
const SHOT = process.env.SHOT, shot = (p, f) => SHOT ? p.screenshot({ path: path.join(SHOT, f + '.png') }) : null;
/* ── 假的 Firebase（只有這一支用；只有 GET／PUT／PATCH〔可以 寫 好幾個 路徑〕／DELETE，跟 真的 一樣）── */
let DB = {};
const seg = p => p.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
const getIn = (p) => { let t = DB; for (const k of seg(p)) { if (t == null || typeof t !== 'object') return null; t = t[k]; } return t === undefined ? null : t; };
const setIn = (p, v) => { const a = seg(p); if (!a.length) { DB = v || {}; return; } let o = DB; for (let i = 0; i < a.length - 1; i++) { if (!o[a[i]] || typeof o[a[i]] !== 'object') o[a[i]] = {}; o = o[a[i]]; } if (v == null) delete o[a[a.length - 1]]; else o[a[a.length - 1]] = v; };
function serve() { return new Promise(ok => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.css': 'text/css', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp3': 'audio/mpeg' };
  const s = require('http').createServer((q, r) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    if (u.startsWith('/fdb/')) { REQ++;
      const p = u.slice(5).replace(/\.json$/, '');
      if (/event-stream/.test(q.headers.accept || '')) { E.push('還在 用「一直 連著 的 線」（EventSource）：' + p); r.writeHead(404); r.end(); return; }
      let b = ''; q.on('data', c => b += c); q.on('end', () => { let v = null; try { v = b ? JSON.parse(b) : null; } catch (x) { }
        if (q.method === 'PUT') setIn(p, v); else if (q.method === 'PATCH') Object.keys(v || {}).forEach(k => setIn(p + '/' + k, v[k])); else if (q.method === 'DELETE') setIn(p, null);
        r.writeHead(200, { 'content-type': 'application/json' }); r.end(JSON.stringify(q.method === 'GET' ? getIn(p) : v)); }); return; }
    const f = path.join(ROOT, u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; ok(s); }); }); }
async function ctxOf(br, G, vp, id) {
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
  await ctx.addInitScript(([u, f, id]) => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); Object.defineProperty(window, 'LIVE_DB', { get: () => f, set: () => {}, configurable: true });
    /* 聲音 計數：播 語音檔、瀏覽器 唸、AudioContext（音效）*/
    window.__snd = { play: 0, tts: 0, ac: 0 };
    const pl = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { window.__snd.play++; try { return pl.call(this).catch(() => {}); } catch (e) { return Promise.resolve(); } };
    try { const sp = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = function (x) { window.__snd.tts++; setTimeout(() => x.onend && x.onend(), 300); }; } catch (e) {}
    const AC = window.AudioContext || window.webkitAudioContext; if (AC) window.AudioContext = window.webkitAudioContext = function () { window.__snd.ac++; return new AC(); };
    if (id) { localStorage.setItem('score_last', JSON.stringify(id)); localStorage.setItem('score_id_g' + id.charAt(0), JSON.stringify(id)); localStorage.setItem('score_act', JSON.stringify(Date.now())); sessionStorage.setItem('sc_ok', id); } }, [URL0, HTTP + '/fdb', id || '']);
  await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams);
    const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  await ctx.route(/script\.google\.com|firebaseio\.com|firebasedatabase\.app/, r => { E.push('想連到真的伺服器（擋下來了）：' + r.request().url().slice(0, 60)); r.abort(); });
  return ctx;
}
const sizes = (p, min) => p.evaluate(min => { const sm = [].filter.call(document.querySelectorAll('body *'), x => { const r = x.getBoundingClientRect(); if (!r.width || x.closest('#scbar,.rk5,.qside,.fxb,.goth,.lurl,.cx,.srow,.sqrc')) return false;
    return [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(x).fontSize) < min; }).map(x => x.textContent.trim().slice(0, 12));
  const low = [].filter.call(document.querySelectorAll('button:not(#scbar button),a.ghost,a.big'), x => { const r = x.getBoundingClientRect(); return r.width && r.height < 48; }).map(x => x.textContent.trim().slice(0, 10));
  return { sm, low, ox: document.documentElement.scrollWidth - innerWidth }; }, min);
const ckWords = (p, tag) => p.evaluate(() => document.body.innerText).then(t => { if (/房間/.test(t)) E.push(tag + '：畫面 上 還有「房間」'); if (/英雄/.test(t)) E.push(tag + '：畫面 上 還有「英雄」（要 改成 戰士）：' + t.match(/.{0,10}英雄.{0,10}/)[0]); });
async function students(br, G, list) { const S = [];
  for (const [id, vp] of list) { const c = await ctxOf(br, G, vp, id), p = await c.newPage(); p.on('pageerror', x => E.push(id + ' JS 錯誤：' + x.message));
    await p.goto(HTTP + '/live/index.html'); await p.waitForTimeout(800); S.push({ id, p, c, vp });
    /* 2026-10-19 第十三次 3(4)：登入 以後 先 說明「現在 ／ 等一下」，2.4 秒 以後 才 按得下去〔我 懂了〕；3(10)：沒有〔首頁〕〔戰神之路〕；3(7)：右下角 QR */
    const it = await p.evaluate(() => { const b = document.getElementById('sigo'), q = document.getElementById('sqrc').getBoundingClientRect();
      return { on: !document.getElementById('sintro').hidden, t: document.getElementById('sinb').innerText, dis: !!(b && b.disabled), bad: (document.body.innerText.match(/戰神之路|回首頁|🏠/) || [''])[0], qr: q.width > 60 && q.right > innerWidth - 30 && q.bottom > innerHeight - 30, qs: !!document.querySelector('#sqrc svg') }; });
    if (!it.on || !/現在/.test(it.t) || !/等一下/.test(it.t) || !/每一題 都 算 成績/.test(it.t) || !it.dis) E.push(id + '：登入 以後 沒有 先 說明「現在 ／ 等一下」：' + JSON.stringify(it).slice(0, 90));
    if (it.bad) E.push(id + '：平板 還有〔' + it.bad + '〕'); if (!it.qr || !it.qs) E.push(id + '：右下角 沒有 QR Code');
    await p.waitForTimeout(2500); await p.click('#sigo'); await p.waitForTimeout(400);
    /* 3(5)：登出 以後 同一個 號碼 再 登入 ➜ 要 回到 遊戲（原本 卡在 登入 畫面）；3(3)：登入 字 精簡、沒有〔回首頁〕 */
    if (id === '40203') { await p.evaluate(() => scOut()); await p.waitForTimeout(1500);
      const lg = await p.evaluate(() => ({ k: !!document.querySelector('#scov.on .sckey'), t: (document.querySelector('#scov.on .sclog') || {}).innerText || '' }));
      if (!lg.k) E.push(id + '：登出 以後 沒有 自動 出現 數字 鍵盤'); if (!/🔑 登入/.test(lg.t) || !/輸入：你的 班級號碼〔共 5 碼〕/.test(lg.t) || /回首頁|先登入，成績才會記下來|打座號/.test(lg.t)) E.push(id + '：登入 畫面 的 字 不對：' + lg.t.replace(/\s+/g, ' ').slice(0, 60));
      for (const k of '40203'.split('').concat(['ok'])) await p.click('#scov [data-k="' + k + '"]');
      await p.waitForTimeout(2000);
      if (await p.evaluate(() => document.getElementById('swait').hidden)) E.push(id + '：登出 再 登入 回不去 現場任務'); }
    n += 4; }
  return S; }
async function hostIn(br, G, HV, tag) { const hc = await ctxOf(br, G, HV), h = await hc.newPage(); h.on('pageerror', x => E.push(tag + ' JS 錯誤：' + x.message));
  await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(300); return { hc, h }; }
const snd = p => p.evaluate(() => window.__snd);
/* 一題：學生 答（ok ＝ 哪幾個 答對），等 公布 */
async function answerQ(h, S, okSet, qi, tag) {
  const q = await h.evaluate(() => ({ ty: H.Q[H.qi].ty, a: H.Q[H.qi].a, tiles: H.Q[H.qi].tiles, n: (H.Q[H.qi].o || []).length, ls: H.Q[H.qi].ls, t: (document.getElementById('qq').innerText || '').trim() }));
  for (const s of S) { await s.p.waitForFunction(qi => !document.getElementById('sq').hidden && S.qi === qi && document.querySelector('#sqo .so,#sqo .tile'), qi, { timeout: 5000 }).catch(() => E.push(tag + ' ' + s.id + '：第 ' + (qi + 1) + ' 題 平板 5 秒 內 沒有 出現'));
    if (q.ty === 'mc' && !q.ls) { const st = (await s.p.evaluate(() => document.getElementById('sqq').innerText)).trim(); if (st !== q.t) E.push(tag + ' ' + s.id + '：第 ' + (qi + 1) + ' 題 平板 的 題目 跟 大螢幕 不一樣：' + st.slice(0, 30) + '｜' + q.t.slice(0, 30)); } }
  for (let k = 0; k < S.length; k++) { const s = S[k], ok = okSet.indexOf(s.id) >= 0;
    if (q.ty === 'mc') await s.p.click('#sqo [data-k="' + (ok ? q.a : (q.a + 1) % q.n) + '"]');
    else { const want = q.ty === 'sp' ? q.a.toLowerCase().split('') : q.a.split('|'), used = [];
      const seq = want.map(t => { for (let i = 0; i < q.tiles.length; i++) if (used.indexOf(i) < 0 && q.tiles[i] === t) { used.push(i); return i; } return -1; });
      if (!ok) { const t = seq[0]; seq[0] = seq[1]; seq[1] = t; }
      for (const i of seq) await s.p.click('[data-tile="' + i + '"]');
      await s.p.click('[data-chb="go"]'); }
    if (k === 0) { await h.waitForTimeout(1500); const sr = await h.evaluate(() => ({ ok: document.querySelectorAll('#qs .srow span.ok').length, a: document.getElementById('qa').textContent }));
      if (H_PH(await h.evaluate(() => H.phase)) && (sr.ok !== 1 || !/✋ 1 ／/.test(sr.a))) E.push(tag + ' 第 ' + (qi + 1) + ' 題：學生 送出 以後 大螢幕 沒有 看到（✔ 座號 ' + sr.ok + '、' + sr.a + '）'); } }
  await h.waitForFunction(() => H.phase === 'rev', null, { timeout: 6000 }).catch(() => E.push(tag + ' 第 ' + (qi + 1) + ' 題：大家 答完 沒有 自動 公布'));
  await h.waitForTimeout(2200); return q; }
const H_PH = ph => ph === 'q';
(async () => {
  const srv = await serve(), br = await chromium.launch();
  /* 在家複習 不可以 有 現場遊戲 的 入口；網頁 不可以 有「房間」、EventSource；平板 頁 沒有 音效 程式 */
  for (const d of ['g3-review', 'g4-review']) for (const f of fs.readdirSync(path.join(ROOT, d)).filter(f => /\.html$/.test(f))) {
    const t = fs.readFileSync(path.join(ROOT, d, f), 'utf8'); if (/href="[^"]*live\//.test(t) || /data-live|⚡ 加入 現場/.test(t)) E.push(d + '/' + f + '：在家複習 有 現場遊戲 入口'); }
  for (const f of ['host.html', 'index.html']) { const t = fs.readFileSync(path.join(__dirname, f), 'utf8'); if (/開房間/.test(t)) E.push('live/' + f + '：還有「開房間」'); if (/new EventSource/.test(t)) E.push('live/' + f + '：還有 EventSource'); }
  if (/createOscillator/.test(fs.readFileSync(path.join(__dirname, '_stu_rt.js'), 'utf8') + fs.readFileSync(path.join(__dirname, '_mini.js'), 'utf8') + fs.readFileSync(path.join(__dirname, '_common.js'), 'utf8'))) E.push('學生 平板 的 程式 還有 音效');
  { const hub = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'); if (/href="live\/index\.html"/.test(hub)) E.push('總首頁 還有 學生 的〔⚡ 現場任務〕'); if (!/href="live\/host\.html"[^>]*>⚡ 現場任務</.test(hub.replace(/<\/?span[^>]*>/g, ''))) E.push('總首頁 沒有〔⚡ 現場任務〕'); }
  n += 6;
  /* ════ 第一場：🏆 經典搶答 5 題（第 3 題 🔥 挑戰題）、大螢幕 1920 ════ */
  { DB = {}; const G = make({ TEACHER_PW: PW }), HV = [1920, 1080], tag = '經典';
    G.post({ a: 'rpg', id: '40201', op: 'buy', item: 'b31' }); G.post({ a: 'rpg', id: '40201', op: 'buy', item: 'p03' });
    const { hc, h } = await hostIn(br, G, HV, tag);
    await h.fill('#pw', 'wrong'); await h.click('#pwgo'); await h.waitForTimeout(300);
    if (!/不對/.test(await h.textContent('#pwm'))) E.push(tag + '：密碼錯 沒有擋');
    await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(300);
    await h.click('[data-sc="402"]');
    const st = await sizes(h, 22); if (st.sm.length || st.low.length || st.ox > 1) E.push(tag + ' 設定頁：字太小 ' + st.sm.slice(0, 3).join('、') + '／按鈕太矮 ' + st.low.slice(0, 3).join('、') + '／左右捲 ' + st.ox);
    const set = await h.evaluate(() => ({ n: document.querySelectorAll('[data-sk]').length, f: document.querySelector('[data-sk]').getAttribute('data-sk'), on: document.querySelector('[data-sk].on').getAttribute('data-sk'),
      sets: document.querySelectorAll('[data-sb].on').length, all: document.querySelectorAll('[data-sb]').length, g4: document.querySelector('[data-qg="4"]').classList.contains('on'), n5: document.querySelector('[data-sn="5"]').classList.contains('on'),
      t26: /⚡ 閃電四選一26 題/.test(document.querySelector('[data-sb]').textContent), r1: /Review 1/.test(document.body.innerText), m5: /5 題（約 3 分鐘）/.test(document.body.innerText) }));
    if (set.n !== 11 || set.f !== 'classic' || set.on !== 'classic') E.push(tag + '：遊戲 不是「經典搶答 第一個、預設、11 種（第三十一次 守城、釣魚 暫時 下架）」');
    if (set.sets !== set.all || set.all < 30) E.push(tag + '：題目 沒有 預設 全選、或 沒有 句型遊戲＋Review 1（' + set.sets + '／' + set.all + '）');
    if (!set.g4 || !set.n5 || !set.t26 || !set.r1 || !set.m5) E.push(tag + '：設定頁 不對（402 ➜ 四年級 題目、預設 5 題 約 3 分鐘、「26 題」、Review 1）' + JSON.stringify(set));
    await h.click('[data-qg="3"]'); if (!/I 還是 My/.test(await h.textContent('#hset'))) E.push(tag + '：402 班 選 三年級 題目 沒有 換'); await h.click('[data-qg="4"]');
    await ckWords(h, tag + ' 設定頁');
    /* 學生 先 登入（老師 還沒 建立）：402 的 三台 ＋ 406 一台 */
    const S = await students(br, G, [['40201', [1024, 768]], ['40202', [820, 1180]], ['40203', [1180, 820]], ['40601', [1024, 768]]]);
    for (const s of S) { const w = await s.p.evaluate(() => ({ w: !document.getElementById('swait').hidden, t: document.getElementById('now').textContent, mg: !!document.querySelector('#wbody .mg'), eq: !!document.querySelector('[data-tab="eq"],[data-eq]') }));
      if (!w.w || !/等 老師 建立/.test(w.t)) E.push(s.id + '：老師 還沒 建立，平板 最上面 沒有「等 老師 建立」：' + w.t.slice(0, 30));
      if (!w.mg) E.push(s.id + '：等人 的 時候 沒有 小遊戲'); if (w.eq) E.push(s.id + '：換裝 頁面 還在'); }
    /* ⚡ 等人小遊戲：8 種 都 畫得出來；一回 照 答案 玩完 ➜ 成績 表 多 一列 */
    for (const s of [S[0], S[1]]) { const kinds = [];
      await s.p.evaluate(() => { const b = document.querySelector('#wbody [data-mg="swap"]'); b && b.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await s.p.waitForTimeout(300);   /* 前一台 玩 的 時候 這一台 的 題目 已經 時間 到 ➜ 重新 開 一回 */
      for (let r = 0; r < 8; r++) {
        const k = await s.p.evaluate(() => { const b = document.querySelector('#wbody .mgb'); return b ? b.className.replace(/.*mk-/, '') : ''; }); kinds.push(k);
        const lay = await s.p.evaluate(() => { const el = document.getElementById('wbody'); return { out: [].filter.call(el.querySelectorAll('button'), x => { const q = x.getBoundingClientRect(); return q.width && (q.right > innerWidth + 1 || q.left < -1); }).length,
          small: [].filter.call(el.querySelectorAll('button'), x => { const q = x.getBoundingClientRect(); return q.width && q.height < 48; }).map(x => x.textContent.slice(0, 8)), ox: document.documentElement.scrollWidth - innerWidth }; });
        if (lay.out || lay.small.length || lay.ox > 1) E.push(s.id + ' 小遊戲 ' + k + '：超出／按鈕太小 ' + JSON.stringify(lay));
        if (s === S[1]) await shot(s.p, 'mini_' + k);
        if (r === 0) { /* 照 答案 玩完 一回 */
          for (let t = 0; t < 60; t++) { await s.p.waitForTimeout(1100); const d = await s.p.evaluate(() => { const el = document.getElementById('wbody'); if (el.querySelector('.mgend')) return 1; const c = el.querySelector('[data-mo="0"]:not(.ok):not(.no)');
              if (c) { c.dispatchEvent(new MouseEvent('click', { bubbles: true })); return 0; } const ts = [].filter.call(el.querySelectorAll('[data-mt]'), b => !b.disabled).sort((a, b) => a.getAttribute('data-mt') - b.getAttribute('data-mt'));
              if (ts[0]) ts[0].dispatchEvent(new MouseEvent('click', { bubbles: true })); return 0; }); if (d) break; await s.p.waitForTimeout(1500); }
          const end = await s.p.evaluate(() => (document.querySelector('#wbody .mgend') || {}).textContent || '');
          if (!/答對 8 ／ 8/.test(end) || !/記進 成績/.test(end)) E.push(s.id + ' 小遊戲：照 答案 玩完 一回 沒有「答對 8 ／ 8、記進 成績」：' + end.slice(0, 60));
          if (s === S[0]) await shot(s.p, 'mini_end'); }
        await s.p.evaluate(() => { const b = document.querySelector('#wbody [data-mg="swap"]'); b && b.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await s.p.waitForTimeout(300); }
      if (new Set(kinds).size !== 8) E.push(s.id + ' 小遊戲：8 次 不是 8 種 不同 的 玩法（' + kinds.join(',') + '）'); }
    await S[0].p.waitForTimeout(1500);
    { const rows = (G.books['紀錄'] ? G.books['紀錄'].d : []).filter(r => /gm_lm-/.test(String(r.join('|'))));
      if (rows.length < 2) E.push('等人小遊戲：成績 表 沒有 記到（' + rows.length + ' 列）'); }
    const sz = await sizes(S[1].p, 20); if (sz.sm.length || sz.low.length || sz.ox > 1) E.push('學生（直）等待頁：字太小 ' + sz.sm.slice(0, 3).join('、') + '／按鈕 ' + sz.low.join('、') + '／左右捲 ' + sz.ox);
    await ckWords(S[0].p, '學生 等待頁');
    /* 老師 建立 遊戲 ➜ 等人 頁 */
    await h.click('#mk'); await h.waitForTimeout(2500);
    const lob = await h.evaluate(() => ({ qr: (document.querySelector('#lqr svg') || { getBoundingClientRect: () => ({ width: 0 }) }).getBoundingClientRect().width, u: document.getElementById('lurl').textContent, cp: !!document.getElementById('lcopy'),
      log: [].map.call(document.querySelectorAll('#llog .hw'), x => x.textContent.replace(/\s+/g, '')), seats: document.querySelectorAll('#lpl .st').length, on: document.querySelectorAll('#lpl .st.on').length, cnt: document.getElementById('lcnt').textContent, img: !!document.querySelector('#lpl .st.on img'),
      anim: document.getAnimations().filter(a => a.effect && a.effect.target && a.effect.target.closest && !a.effect.target.closest('.seats') && a.playState === 'running' && (a.effect.getTiming().iterations === Infinity)).map(a => a.effect.target.className).slice(0, 3) }));
    if (lob.qr < 300 || !/live\/$/.test(lob.u) || !lob.cp) E.push(tag + '：等人 頁 沒有 大 QR Code／網址／〔📋 複製 網址〕' + JSON.stringify(lob));
    if (lob.log.join('|') !== '1📱掃QRCode|2🔢打5碼（班級＋座號）|3✅自動進入自己班的遊戲') E.push(tag + '：等人 頁 的 ① ② ③ 不對：' + lob.log.join('|'));
    if (lob.anim.length) E.push(tag + '：等人 頁 還有 一直 動 的 動畫（' + lob.anim.join('、') + '）');
    if (lob.seats !== 30 || lob.on !== 3 || lob.cnt.trim() !== '3' || !lob.img) E.push(tag + '：座號 格子 沒有 亮 3 格（402 的 3 個 人）' + JSON.stringify(lob));
    { const sh = await h.evaluate(() => document.documentElement.scrollHeight - innerHeight); if (sh > 1) E.push(tag + '：等人 頁 要 上下 捲 ' + sh + 'px'); }
    await h.click('#lcopy'); await h.waitForTimeout(300); if (!/複製 好了|複製 網址/.test(await h.textContent('#lcopy'))) E.push(tag + '：〔📋 複製 網址〕沒有 反應');
    await shot(h, 'c_lobby');
    const o6 = await S[3].p.textContent('#now'); if (!/等 老師 建立 406/.test(o6)) E.push('別班（406）看到 402 的 遊戲：' + o6.slice(0, 40));
    await S[3].c.close(); S.pop();
    for (const s of S) { const t = await s.p.textContent('#now'); if (!/已經 進入 402 班/.test(t)) E.push(s.id + '：沒有「已經 進入 402 班 的 遊戲」：' + t.slice(0, 30)); }
    /* ▶ 開始 */
    await h.click('#go'); await h.waitForTimeout(1500);
    if (await h.isHidden('#hhow') || (await h.$$('#hhw .how .hw')).length !== 3) E.push(tag + '：按 ▶ 開始 沒有「怎麼玩」');
    for (const s of S) if (await s.p.isHidden('#show')) E.push(s.id + '：開始 的 時候 平板 沒有「怎麼玩」');
    if (await S[0].p.evaluate(() => MINI.on())) E.push('開始 以後 小遊戲 還在 跑');
    await h.waitForFunction(() => H.phase === 'q', null, { timeout: 12000 }).catch(() => E.push(tag + '：3、2、1 以後 沒有 第 1 題'));
    for (let qi = 0; qi < 5; qi++) {
      await h.waitForFunction(qi => H.phase === 'q' && H.qi === qi, qi, { timeout: 6000 }).catch(() => E.push(tag + ' 第 ' + (qi + 1) + ' 題 沒有 出來'));
      const b0 = await h.evaluate(() => ({ t: document.getElementById('hgo').textContent, vis: !!document.getElementById('hgo').offsetParent }));
      if (!b0.vis || !/提早 公布/.test(b0.t)) E.push(tag + ' 第 ' + (qi + 1) + ' 題：右下角 沒有〔⏭ 提早 公布〕');
      if (qi === 0) { const qh = await sizes(h, 22); if (qh.sm.length || qh.ox > 1) E.push(tag + ' 題目：字太小 ' + qh.sm.slice(0, 3).join('、') + '／左右捲 ' + qh.ox);
        const q0 = await sizes(S[1].p, 20); if (q0.sm.length || q0.low.length || q0.ox > 1) E.push('學生 題目：字太小 ' + q0.sm.slice(0, 3).join('、') + '／按鈕 ' + q0.low.join('、') + '／左右捲 ' + q0.ox);
        await shot(h, 'c_q'); await shot(S[1].p, 'c_sqv'); }
      const okSet = qi === 0 ? ['40201', '40203'] : ['40201', '40202'];
      const q = await answerQ(h, S, okSet, qi, tag);
      if (qi === 2 && !(q.ty === 'sp' || q.ty === 'or')) E.push('第 3 題 不是 🔥 挑戰題（' + q.ty + '）');
      const rv = await h.evaluate(() => ({ bars: document.querySelectorAll('#qo .qd').length, ck: !!document.querySelector('#qo .qck,#qo .chans'), sc: H.sc, ana: !!document.querySelector('#qh .ana .gls .gw'), b: document.getElementById('hgo').textContent, ae: H.Q[H.qi].ae }));
      if (q.ty === 'mc' && (rv.bars !== q.n || !rv.ck)) E.push('第 ' + (qi + 1) + ' 題：公布 沒有 長條圖＋✔');
      if (!rv.ana) E.push('第 ' + (qi + 1) + ' 題：大螢幕 公布 沒有 📌 錯題 分析（逐字 中文）');
      if (!/看 排行榜/.test(rv.b)) E.push('第 ' + (qi + 1) + ' 題：公布 以後 右下角 沒有〔🏆 看 排行榜〕');
      if (qi === 2 && !(Object.values(rv.sc).some(v => v >= 200))) E.push('🔥 挑戰題：答對 沒有 ✖2 ' + JSON.stringify(rv.sc));
      const hs = await snd(h); if (rv.ae && !(hs.play + hs.tts >= 1)) E.push('第 ' + (qi + 1) + ' 題：大螢幕 沒有 自動 唸 正確 答案');
      const wrong = S.filter(s => okSet.indexOf(s.id) < 0)[0], right = S.filter(s => okSet.indexOf(s.id) >= 0)[0];
      const r0 = await right.p.evaluate(() => ({ c: document.getElementById('res').className, t: document.getElementById('res').textContent }));
      const r2 = await wrong.p.evaluate(() => ({ c: document.getElementById('res').className, gl: document.querySelectorAll('#res .miss .gls .gw').length, you: !!document.querySelector('#res .myou'), say: !!document.querySelector('#res [data-say1]'), bulb: !!document.querySelector('#res .glh .glb'), fit: (() => { const b = document.querySelector('#res .rbx').getBoundingClientRect(); return b.bottom <= innerHeight + 1 && b.right <= innerWidth + 1; })() }));
      if (!/on ok/.test(r0.c) || !/第 \d+ 名/.test(r0.t) || !/＋/.test(r0.t)) E.push('第 ' + (qi + 1) + ' 題：答對 的 平板 沒有 變綠＋分數＋名次 ' + r0.c);
      if (r2.bulb) BULB = 1;
      if (!/on no/.test(r2.c) || !r2.gl || !r2.you || !r2.say || !r2.fit) E.push('第 ' + (qi + 1) + ' 題：答錯 的 平板 錯題 分析 不對 ' + JSON.stringify(r2) + '（' + wrong.id + '）');
      if (qi === 0) { await shot(right.p, 'c_res_ok'); await shot(wrong.p, 'c_res_no'); await shot(h, 'c_rev'); }
      for (const s of S) { const z = await snd(s.p); if (z.play || z.tts || z.ac) E.push(s.id + '：平板 自己 出聲 了（' + JSON.stringify(z) + '）'); }
      await h.click('#hgo'); await h.waitForTimeout(1600);
      const lb = await h.evaluate(() => ({ on: !document.getElementById('hlb').hidden, n: document.querySelectorAll('#lb .lbr').length, b: document.getElementById('hgo2').textContent, vis: !!document.getElementById('hgo2').offsetParent }));
      if (!lb.on || lb.n !== 3 || !lb.vis || !(qi < 4 ? /下一題（第 \d 題）/ : /頒獎/).test(lb.b)) E.push(tag + ' 第 ' + (qi + 1) + ' 題：排行榜 或 右下角 按鈕 不對 ' + JSON.stringify(lb));
      for (const s of S) { const l = await s.p.evaluate(() => ({ c: document.getElementById('res').className, t: document.getElementById('res').textContent })); if (!/lb/.test(l.c) || !/第 \d 名/.test(l.t)) E.push(s.id + '：排行榜 的 時候 平板 沒有 名次'); }
      if (qi === 0) { await shot(h, 'c_lb'); const ls = await sizes(h, 24); if (ls.sm.length) E.push(tag + ' 前 5 名：字太小 ' + ls.sm.slice(0, 3).join('、')); }
      await h.click('#hgo2');
    }
    await h.waitForFunction(() => !document.getElementById('hend').hidden, null, { timeout: 8000 }).catch(async () => E.push(tag + '：5 題 做完 沒有 頒獎 典禮 ' + JSON.stringify(await h.evaluate(() => ({ p: H.phase, qi: H.qi, n: H.n, s: H.scr })))));
    await h.waitForTimeout(9000); await shot(h, 'c_cer');
    const ce = await h.evaluate(() => ({ cls: document.getElementById('cerst').className, pod: document.querySelectorAll('#cerst .cp:not(.nop)').length, img: document.querySelectorAll('#cerst .cp img').length, ac: window.__snd.ac }));
    if (!/cx cs\d/.test(ce.cls) || ce.pod !== 3 || ce.img < 1) E.push(tag + '：頒獎 典禮 不對 ' + JSON.stringify(ce));
    await ckWords(h, tag + ' 頒獎');
    await h.click('#tana'); await h.waitForTimeout(3500); await shot(h, 'c_ana');
    const an = await h.evaluate(() => ({ bars: document.querySelectorAll('#hanab .bar.go').length, w: document.querySelectorAll('#hanab .wr').length, gl: document.querySelectorAll('#hanab .wr .gls').length, say: document.querySelectorAll('#hanab [data-say]').length }));
    if (an.bars !== 5 || !an.w || an.gl !== an.w || an.say !== an.w) E.push(tag + '：全班 錯題 總分析 不對 ' + JSON.stringify(an));
    for (const s of S) { await s.p.waitForSelector('#send:not([hidden])', { timeout: 4000 }).catch(() => {}); await s.p.waitForTimeout(1500);
      const e2 = await s.p.evaluate(() => ({ ch: document.querySelectorAll('#ew .qch span.go').length, mine: document.querySelectorAll('#ew .wr').length, t: document.getElementById('ew').textContent }));
      if (e2.ch !== 5 || !/第 \d 名/.test(e2.t) || !e2.mine) E.push(s.id + '：平板 個人 錯題 總分析 不對 ' + JSON.stringify({ ch: e2.ch, mine: e2.mine }));
      const z = await snd(s.p); if (z.play || z.tts || z.ac) E.push(s.id + '：平板 自己 出聲 了'); }
    await shot(S[1].p, 'c_send');
    await S[1].p.click('#ew [data-say2]'); await S[1].p.waitForTimeout(300); { const z = await snd(S[1].p); if (!(z.play + z.tts)) E.push('平板 按〔🔊 聽〕沒有 唸'); }
    await ckWords(S[0].p, '學生 結束頁');
    /* 2026-10-20 第十五次：老師〔✖1.5〕：答對 的 🪙、一場 的 ⭐ 都 ✖1.5（四捨五入） */
    { const x = await h.evaluate(() => { var a = bonusList(); H.x15 = 1.5; var b = bonusList(); H.x15 = 2; var d = bonusList(); H.x15 = 0; return { a: a, b: b, d: d, okc: H.okc, rw: H.rw }; });
      x.a.forEach(function (o, j) { if ((x.rw[o.id] || []).length) return; var k = x.okc[o.id] || 0, q = x.b[j], r = x.d[j]; if (o.c !== k || o.x !== 10 || q.c !== Math.round(k * 1.5) || q.x !== 15 || r.c !== k * 2 || r.x !== 20) E.push(tag + '：✖1.5／✖2 不對 ' + o.id + ' ' + JSON.stringify([o.c, o.x, q.c, q.x, r.c, r.x, k])); }); n++; }
    await h.click('#give'); await h.waitForTimeout(900);
    if (!/發好了/.test(await h.textContent('#gm'))) E.push(tag + '：〔🎁 發獎勵〕沒有 成功：' + (await h.textContent('#gm')));
    const v1 = G.get({ a: 'rpg', id: '40201' }).v; if (!(v1.st.bx >= 10 && v1.st.bc >= 4)) E.push('發獎勵：「角色」沒有 加上 經驗值、金幣：' + JSON.stringify([v1.st.bc, v1.st.bx]));
    if ((await h.evaluate(() => window.__snd.ac))) E.push(tag + '：大螢幕 有 音效（AudioContext）');
    for (const s of S) await s.c.close(); await hc.close(); n += 90; }
  /* ════ 第二場：⚔️ 討伐魔王 10 題（干擾、禮物盒、✂ 功能）、大螢幕 1024 ════ */
  { DB = {}; const G = make({ TEACHER_PW: PW }), HV = [1024, 768], tag = '魔王 1024';
    G.post({ a: 'rpg', id: '40201', op: 'buy', item: 'b31' }); G.post({ a: 'rpg', id: '40201', op: 'buy', item: 'p03' });
    G.post({ a: 'rpg', id: '40203', op: 'buy', item: 'b32' }); G.post({ a: 'rpg', id: '40203', op: 'buy', item: 'p06' });   /* 2026-10-20 第十四次：🐾 寵物護盾（一場 一次） */
    { const t0 = require('../score/_calc.js').weekStart(Date.now()) - 7 * 864e5 + 5 * 3600e3;
      for (let k = 0; k < 3; k++) G.post({ a: 'rec', r: { id: '40205', set: 'g4u1_1-1b', name: 'x', src: 'home', dev: 'v', u: 'lw' + k, t: t0 + k * 6e4, qs: [0, 1, 2, 3, 4].map(i => [1, 0, 6, 0, .6, i]) } }); }
    const { hc, h } = await hostIn(br, G, HV, tag);
    await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(300);
    await h.click('[data-sc="402"]');
    const st = await sizes(h, 19); if (st.sm.length || st.low.length || st.ox > 1) E.push(tag + ' 設定頁：字太小 ' + st.sm.slice(0, 3).join('、') + '／按鈕太矮 ' + st.low.slice(0, 3).join('、') + '／左右捲 ' + st.ox);
    { const xb = await h.evaluate(() => { const L = ['0', '1.5', '2'].map(k => document.querySelector('[data-x15="' + k + '"]')); return L.every(Boolean) ? Math.min.apply(null, L.map(b => b.getBoundingClientRect().height)) : 0; }); if (xb < 48) E.push(tag + '：開場 沒有〔關〕〔✖1.5〕〔✖2〕三顆（' + xb + '）'); n++; }
    /* 2026-10-21 老師再加第 3 點：👑 每班 上週 第 1 名 選 1 次 遊戲（老師 勾 哪幾種 ➜ 大螢幕 上 點 ➜ Firebase 記 用過 了） */
    { const mi = await h.evaluate(() => ({ mini: !!document.querySelector('.chbox.mini #chOpen'), cg: document.querySelectorAll('[data-cg]').length, bh: (document.getElementById('chOpen') || { getBoundingClientRect: () => ({ height: 0 }) }).getBoundingClientRect().height }));
      if (!mi.mini || mi.cg || mi.bh < 56) E.push(tag + '：冠軍 金框 沒有 先 收起來（第十七次 第 6 點）' + JSON.stringify(mi)); n++;
      await h.click('#chOpen'); await h.waitForTimeout(200); }
    { const ch = await h.evaluate(() => ({ box: !!document.querySelector('.chbox:not(.done)'), t: (document.querySelector('.chbox') || {}).textContent || '', n: document.querySelectorAll('[data-cg]').length }));
      if (!ch.box || !/40205/.test(ch.t) || ch.n !== 11) E.push(tag + '：沒有 👑 冠軍 選 遊戲 那一塊 ' + JSON.stringify(ch).slice(0, 120)); n++;
      await h.click('[data-cg="race"]'); await h.click('#chGo'); await h.waitForTimeout(400);
      const pk = await h.evaluate(() => { const o = document.getElementById('chpk'), b = [].slice.call(o.querySelectorAll('[data-cpk]')); return { on: !o.hidden, n: b.length, race: b.some(x => x.getAttribute('data-cpk') === 'race'), h: Math.min.apply(null, b.map(x => x.getBoundingClientRect().height)), ox: o.scrollHeight - o.clientHeight }; });
      if (!pk.on || pk.n !== 10 || pk.race || pk.h < 100 || pk.ox > 1) E.push(tag + '：冠軍 選 遊戲 畫面 不對 ' + JSON.stringify(pk)); n++;
      await shot(h, 'champ'); await h.click('[data-cpk="tug"]'); await h.waitForTimeout(3000);
      const dn = await h.evaluate(() => ({ g: H.game, done: !!document.querySelector('.chbox.done'), hid: document.getElementById('chpk').hidden }));
      if (dn.g !== 'tug' || !dn.done || !dn.hid) E.push(tag + '：冠軍 選好 以後 不對 ' + JSON.stringify(dn)); n++;
      if (!DB.rooms || !DB.rooms['0402'] || !DB.rooms['0402'].champ || DB.rooms['0402'].champ.game !== 'tug') E.push(tag + '：Firebase 沒有 記 冠軍 用過 了'); n++; }
    /* ⚔ 戰力 階級 登場 特效：★5 傳說戰神 */
    { await h.evaluate(() => { H.P['40299'] = { tr: 5 }; entSee(['40299']); }); await h.waitForTimeout(700);
      const te = await h.evaluate(() => { const o = document.querySelector('.tent.t5'); return o ? { tb: !!o.querySelector('.tbI'), t: o.textContent, pil: !!o.querySelector('.tpil') } : null; });
      if (!te || !te.tb || !/傳說戰神/.test(te.t) || !/40299 登場/.test(te.t) || !te.pil) E.push(tag + '：★5 登場 特效 不對 ' + JSON.stringify(te)); n++;
      await h.waitForTimeout(2800); if (await h.$('.tent')) E.push(tag + '：登場 特效 沒有 自己 收起來'); n++; }
    await h.click('[data-sk="boss"]');
    await h.click('[data-ch="0"]'); await h.click('[data-sa="0"]'); await h.click('[data-sb="4sg1"]'); await h.click('[data-sb="4sg10"]'); await h.click('[data-sn="10"]'); await h.click('#mk'); await h.waitForTimeout(600);
    const S = await students(br, G, [['40201', [1024, 768]], ['40202', [820, 1180]], ['40203', [1024, 768]]]);
    await h.waitForTimeout(2500);
    if ((await h.textContent('#lcnt')).trim() !== '3') E.push(tag + '：大螢幕 沒有 看到 3 個人加入（' + (await h.textContent('#lcnt')) + '）');
    { const sh = await h.evaluate(() => document.documentElement.scrollHeight - innerHeight); if (sh > 1) E.push(tag + '：等人 頁 要 上下 捲 ' + sh + 'px'); }
    await shot(h, 'lobby_1024');
    await h.click('#go'); await h.waitForFunction(() => H.phase === 'q', null, { timeout: 12000 });
    let hp0 = await h.evaluate(() => H.gs.hp);
    for (let qi = 0; qi < 10; qi++) {
      await h.waitForFunction(qi => H.phase === 'q' && H.qi === qi, qi, { timeout: 6000 }).catch(() => E.push(tag + ' 第 ' + (qi + 1) + ' 題 沒有 出來'));
      const a = await h.evaluate(() => H.Q[H.qi].a), nO = await h.evaluate(() => H.Q[H.qi].o.length);
      for (const s of S) await s.p.waitForFunction(qi => !document.getElementById('sq').hidden && S.qi === qi && document.querySelector('#sqo .so'), qi, { timeout: 5000 }).catch(() => E.push(s.id + '：第 ' + (qi + 1) + ' 題 沒有出現'));
      if (qi === 0) { const qh = await sizes(h, 19); if (qh.sm.length || qh.ox > 1) E.push(tag + ' 題目：字太小 ' + qh.sm.slice(0, 3).join('、') + '／左右捲 ' + qh.ox); }
      if (qi === 2) { await h.evaluate(() => { clearTimeout(H.tm2); fxSend(); }); await S[2].p.waitForTimeout(1600);
        const f1 = await S[2].p.evaluate(() => ({ on: document.getElementById('fxo').classList.contains('on'), t: document.getElementById('fxo').textContent }));
        if (!f1.on || !/怒吼/.test(f1.t)) E.push('干擾：魔王 怒吼 沒有 出現在 學生 平板');
        await S[2].p.waitForTimeout(1800); const f2 = await S[2].p.evaluate(() => ({ on: document.getElementById('fxo').classList.contains('on'), sh: !!S.pend.shield }));
        if (f2.on || !f2.sh) E.push('干擾：3 秒內 沒有 消失、或 沒有 送 🛡' + JSON.stringify(f2)); }
      const cut = qi === 5 ? await S[0].p.evaluate(() => document.querySelectorAll('#sqo .so.cut').length) : -1;
      if (qi === 5 && nO === 4 && cut !== 2) E.push('🎮 ✂ 刪掉 2 個：下一題 沒有 真的 刪掉 2 個（' + cut + '）');
      await S[0].p.click('#sqo [data-k="' + a + '"]');
      await S[1].p.click('#sqo [data-k="' + (qi === 0 ? (a + 1) % nO : a) + '"]');
      await S[2].p.click('#sqo [data-k="' + (qi % 3 ? a : (a + 1) % nO) + '"]');
      await h.waitForFunction(() => H.phase === 'rev', null, { timeout: 6000 }).catch(() => E.push(tag + ' 第 ' + (qi + 1) + ' 題 沒有 公布')); await h.waitForTimeout(1600);
      const r0 = await S[0].p.textContent('#res'), r1 = await S[1].p.textContent('#res');
      if (!/答對/.test(r0)) E.push('魔王 第 ' + (qi + 1) + ' 題：答對的 沒有 ✅（' + r0.slice(0, 20) + '）');
      if (qi === 3 || qi === 6) { const ps = await h.evaluate(() => ({ st: H.st['40203'], u: (H.psU || {})['40203'] })), t3 = await S[2].p.textContent('#res');
        if (qi === 3 && (ps.st !== 2 || ps.u !== 1 || !/寵物 護盾/.test(t3))) E.push(tag + '：🐾 寵物護盾 第一次 答錯 沒有 保住 連對（' + JSON.stringify(ps) + '）');
        if (qi === 6 && (ps.st !== 0 || /寵物 護盾/.test(t3))) E.push(tag + '：🐾 寵物護盾 一場 用了 第二次（' + JSON.stringify(ps) + '）'); }
      if (qi === 0) { const d0 = await S[0].p.evaluate(() => (S.me && S.me.hit) || 10 + Math.min(20, Math.floor(((S.me && S.me.power) || 0) / 100)));
        if (!(await h.$('#gv .hits .hpd'))) E.push(tag + '：答對 的 戰士 旁邊 沒有 🐾 寵物 一起 打');
        if (r0.indexOf('出招 ➜ 魔王 －' + d0) < 0 || /出招/.test(r1)) E.push('魔王 第 1 題：答對 沒有寫「你的 戰士 出招 ➜ 魔王 －' + d0 + '」');
        const hp1 = await h.evaluate(() => H.gs.hp); if (!(hp1 < hp0)) E.push(tag + '：答對了 魔王 血條 沒有 變少');
        if (!(await h.$('#gv .hits .hit1'))) E.push(tag + '：答對 的 戰士 沒有 飛過去 出招');
        await shot(h, 'hq_1024'); }
      await h.click('#hgo'); await h.waitForTimeout(1500);
      if (qi === 4 || qi === 9) { /* 01 答對 5、10 題 ➜ 排行榜 的 時候 🐾 禮物盒 */
        await S[0].p.waitForTimeout(800);
        const g = await S[0].p.evaluate(() => ({ on: document.getElementById('gift').classList.contains('on'), t: document.getElementById('gift').textContent, pet: !!document.querySelector('#gift .gpi') }));
        if (!g.on || !/寵物/.test(g.t) || !g.pet) E.push('答對 ' + (qi + 1) + ' 題 沒有 🐾 寵物 叼來 禮物盒');
        if (qi === 4) { await S[0].p.evaluate(() => { LV.pickN = function () { return 3; }; LV.shuf = function (a) { a = a.slice(); var i = a.map(function (x) { return x.k; }).indexOf('cut'); if (i > 0) { var t = a[0]; a[0] = a[i]; a[i] = t; } return a; }; }); await S[0].p.click('[data-gk="f"]'); }
        else await S[0].p.click('[data-gk="r"]');
        await S[0].p.waitForTimeout(500);
        const nb = await S[0].p.evaluate(() => document.querySelectorAll('#gift .bx').length); if (nb < 2 || nb > 5) E.push('禮物盒 不是 二～五選一（' + nb + '）');
        await S[0].p.click('#gift .bx[data-gi="0"]'); await S[0].p.waitForTimeout(1300);
        const o = await S[0].p.evaluate(() => ({ t: document.getElementById('gift').textContent, hero: !!document.querySelector('#gift .ghi'), say: (document.querySelector('#gift .say') || {}).textContent }));
        if (!o.hero || !o.say) E.push('打開 盒子 沒有 飛出 戰士＋說一句話');
        if (qi === 4 && !/刪掉 2 個/.test(o.t)) E.push('🎮 選的 不是 ✂ 刪掉 2 個：' + o.t.slice(0, 40));
        if (await S[0].p.$('[data-gok]')) await S[0].p.click('[data-gok]'); else E.push('打開盒子以後 沒有〔👌 好〕'); }
      await h.click('#hgo2');
    }
    await h.waitForFunction(() => !document.getElementById('hend').hidden, null, { timeout: 8000 }).catch(() => E.push(tag + '：10 題 做完 沒有 頒獎 典禮'));
    await h.waitForTimeout(1500);
    if (!/魔王/.test(await h.textContent('#cerst'))) E.push(tag + '：頒獎 典禮 沒有 寫 魔王 的 結果');
    await h.click('#tana'); await h.waitForTimeout(800);
    if (!/1 個/.test(await h.textContent('#erw'))) E.push(tag + '：抽到 的 獎勵 數 不對：' + (await h.textContent('#erw')));
    await h.click('#give'); await h.waitForTimeout(900);
    if (!/發好了/.test(await h.textContent('#gm'))) E.push(tag + '：〔🎁 發獎勵〕沒有 成功：' + (await h.textContent('#gm')));
    if (!(await h.evaluate(() => document.getElementById('give').disabled))) E.push('發獎勵 可以 按 兩次');
    /* 10 種 場景：兩種 大螢幕 尺寸、題目 中、公布 都 畫得 出來、不 超出 框 */
    for (const VW of [[1920, 1080], [1024, 768]]) { await h.setViewportSize({ width: VW[0], height: VW[1] });
      for (const g of ['boss', 'race', 'tug', 'map', 'tower', 'pet', 'shoot', 'treasure', 'surf', 'king']) for (const ph of ['q', 'rev']) {
        await h.evaluate(([g, ph]) => { H.game = g; H.phase = ph; H.qi = Math.min(H.qi, H.n - 1); H.hits = ids().map(function (id, i) { return { id: id, ms: 1000 * i, d: 12 }; }); H.gs.arr = H.hits.map(function (x, i) { return { id: x.id, r: i % 5 }; }); H.gs.en = .8; H.gs.pet = 3; H.gs.tr = 3; H.gs.cells = [0, 1, 0, 1, 1]; H.gs.nw = [0, 1];
          scr('hq'); document.getElementById('hq').className = 'scr side'; drawGame(); }, [g, ph]);
        await h.waitForTimeout(1500);
        const r = await h.evaluate(() => { const el = document.getElementById('gv'), b = el.getBoundingClientRect();
          return { t: el.textContent.length, img: el.querySelectorAll('img').length, out: [].filter.call(el.querySelectorAll('*'), x => { if (x.closest('.sf svg')) return false; const q = x.getBoundingClientRect(); return q.width && q.height && (q.left < b.left - 2 || q.right > b.right + 2 || q.top < b.top - 2 || q.bottom > b.bottom + 2); }).map(x => x.className).slice(0, 3) }; });
        if (r.t < 6 || r.out.length) E.push('場景 ' + g + '（' + ph + '，' + VW[0] + '）：沒有 內容 或 超出 框 ' + JSON.stringify(r.out));
        if (['boss', 'race', 'tug', 'pet', 'surf', 'king'].indexOf(g) >= 0 && ph === 'rev' && !r.img) E.push('場景 ' + g + '：沒有 用 學生 的 戰士／寵物 圖'); }
      n += 20; }
    for (const s of S) await s.c.close(); await hc.close(); n += 50; }

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
  if (!BULB) E.push('答錯 的 平板 錯題 分析 沒有 💡（2026-10-20 第十四次 加回來）');
  E.forEach(x => console.log('✗ ' + x));
  console.log('現場任務 量測 ' + (n + 1) + ' 項，' + E.length + ' 個失敗');
  process.exit(E.length ? 1 : 0);
})();
