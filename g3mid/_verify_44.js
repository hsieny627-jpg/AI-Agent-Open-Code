/* g3mid/_verify_44.js — 2026-11-04 第四十四次 量測（只 印 失敗 項＋一行 總結）。node g3mid/_verify_44.js   （SKIP=t,r,a 可以 跳過 老師看板／戰神之路／頒獎）
 * 假 的 成績 伺服器（score/_gas_stub.js 跑 真的 Code.gs）、不連 Firebase、不送 真的 成績表；名單 ＝ 假 的（測試NN）。
 * ① 伺服器：拖曳 題 放錯 的 格（第 7 格 "~1.4"）收 得 進去、錯題 統計 sl、今日任務／金幣 不 受 影響
 * ② ✍️ 字母 書寫（lw／lwh／la／lf）：一回 10 題 ＝ 10 個 不同 的 字母；連 做 3 回 26 個 都 輪到（不 重複 先）
 * ③ 🎧 聽 字首音 寫：題目 沒有 單字 的 圖、🔮 水晶球、📖 魔法 書；開始 前 先 演「寫得 愈好 獎勵 愈 豐盛／寫錯 沒有」；寫對 ＝ 魔法 等級＋積分；寫錯 ＝ 💨
 * ④ 答錯頁 只 唸 兩次（三、四年級）；聲音 卡住 ＝ 保險 計時 一定 出〔▶ 下一題〕；🔓 解碼 答錯 第 1 次 先 唸 放錯 的 字（英文 ➜ 中文）再 整句 英文、整句 中文
 * ⑤ 老師看板：哪一關 最 難 寫 名字、🧩 最多 人 放錯 的 英文 字 前 5 名＋動畫＋唸、詳解 ③ 比較＋難點、④ 圖片＋Show／homework 有 中文
 * ⑥ 戰神之路 保底 寶箱：新 的 先 不 算進 🪙、自己 跳出來、收下 ＝ 金幣 飛 進去、帳本
 * ⑦ 兩人 輪流：步驟 條（① ➜ ②）、還沒 選 就 按 開始 ＝ 搖、選了 ＝ ② 亮；結束 頁 送到 狀態；計分 說明 有 例子
 * ⑧ 頒獎 典禮：第 10～6 名 階梯（最 下面 第 10 名、由下 往上 出現）、第 1 名 皇冠＋光芒、沒有 backdrop-filter、頒獎台 頂面 不是 3D 平面 */
const { chromium } = require('playwright'), path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = [], SKIP = (process.env.SKIP || '').split(','); let n = 0;
const ok = (c, m) => { n++; if (!c) E.push(m); };
let HTTP = '';
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.css': 'text/css', '.mp3': 'audio/mpeg', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.txt': 'text/plain' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
const W = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  /* ① 伺服器 */
  { const { make } = require('../score/_gas_stub.js'), SC = require('../score/_calc.js'), G = make({ TEACHER_PW: 'pw' });
    const B = require('../score/_bank.js'), qi = B['g4gm_mt-x25'].qs.findIndex(q => q.dt);
    const qs = [[0, 1, 5, 0, .5, qi, '~1.2'], [1, 0, 4, 0, .6, qi]];
    const r = G.post({ a: 'rec', r: { id: '41001', set: 'g4gm_mt-x25', name: 'x', m: 'g', qs, raw: 1, src: 'school', dev: 'x', u: 'v44a', t: Date.now() - 6e4 } });
    ok(r && (r.saved || r.ok), '伺服器 收 不 進 有 第 7 格 的 紀錄 ' + JSON.stringify(r).slice(0, 200));
    const rs = SC.fromRows ? null : null; const c = SC.clean({ id: '41001', set: 'g4gm_mt-x25', m: 'g', qs, t: Date.now() }, Date.now());
    ok(c && c.qs[0][6] === '~1.2' && c.qs[1].length === 6, '第 7 格 "~1.2" 沒有 留下來 ' + JSON.stringify(c && c.qs));
    const c2 = SC.clean({ id: '41001', set: 'g4gm_mt-x25', m: 'g', qs: [[0, 1, 5, 0, .5, qi, '~abc'], [1, 0, 4, 0, .6, qi, '~1']], t: Date.now() }, Date.now());
    ok(c2 && c2.qs[0].length === 6 && c2.qs[1].length === 6, '亂 寫 的 第 7 格、答對 的 第 7 格 不可以 收 ' + JSON.stringify(c2 && c2.qs));
    const L = SC.questions([c]), x = L.filter(q => q.k === 'g4gm_mt-x25#' + qi)[0];
    ok(x && x.sl && x.sl[1] === 1 && x.sl[2] === 1 && x.n === 2, '錯題 統計 sl 不對 ' + JSON.stringify(x));
    const me = SC.me([c], Date.now()); ok(me.w.every(w => w[0] === 'g4gm_mt-x25'), '今日任務 錯題 題組 被 "~" 弄錯 ' + JSON.stringify(me.w));
    const E0 = SC.rpEarn([c], {}); ok(E0.coin >= 1, '金幣 算錯 ' + JSON.stringify(E0)); }
  const srv = await serve(), br = await chromium.launch();
  const ctxOf = async (vp, id, extra) => { const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/firebasedatabase\.app|firebaseio\.com|script\.google\.com/, r => r.abort());
    await ctx.route(/script\.test/, r => r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"ok":true,"saved":1,"dup":[]}' }));
    await ctx.addInitScript(([id, extra]) => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); Object.assign(window, { __NOUNLOCK: 1, __NODFXI: 1, __NOSNH: 1, __NOGO: 1, __NORVA: 1, __NOWB: 1, __NOTUT: 1, __DCLK: .05, __ZHFAST: 1, __NOMEM: 1, __NOWHEEL: 1, __NOLIFE: 1 }, extra || {});
      localStorage.setItem('score_last', '"' + id + '"'); localStorage.setItem('score_id_g' + id[0], '"' + id + '"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id); localStorage.setItem('g3m_war', '"b31"'); }, [id, extra]);
    return ctx; };
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) { const tag = vp.join('×');
    /* ② ③ 字母 書寫 */
    { const ctx = await ctxOf(vp, '30401'), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto(HTTP + '/g3mid/index.html'); await p.waitForTimeout(700); await p.evaluate(() => document.querySelectorAll('.scfull').forEach(x => x.remove()));
      for (const m of ['lw', 'lwh', 'la', 'lf']) {
        const r = await p.evaluate(async m => { const seen = {}, rounds = []; for (let k = 0; k < (m === 'lw' || m === 'lwh' ? 4 : 3); k++) { window.__NOLWI = 1; startLW(m); await new Promise(s => setTimeout(s, 120));
            const L = R.qs.map(q => (m === 'lf' ? q.say.charAt(0) : q.want).toLowerCase()); rounds.push(L); L.forEach(c => seen[c] = 1); try { lobby(); } catch (e) { } }
          return { rounds, all: Object.keys(seen).length }; }, m);
        ok(r.rounds.every(L => L.length === 10 && new Set(L).size === 10), tag + ' ' + m + '：一回 10 題 字母 有 重複 ' + JSON.stringify(r.rounds));
        if (m === 'la' || m === 'lwh') ok(r.all === 26, tag + ' ' + m + '：3～4 回 沒有 輪到 26 個 字母（' + r.all + '）');
        if (m === 'lf') ok(r.all >= 14, tag + ' lf：3 回 沒有 把 14 個 字首 都 輪到（' + r.all + '）');
      }
      /* lf 開場 動畫 第 1 幕 ＝ 魔法 獎勵 說明 */
      const intro = await p.evaluate(async () => { window.__NOLWI = 0; window.__NOGO = 0; LWM = 'lf'; var done = 0; lwIntro(function () { done = 1; }); await new Promise(s => setTimeout(s, 400)); const b = document.querySelector('.lww'); const t = b ? b.textContent : '';
        const rows = document.querySelectorAll('.mgrow').length, sm = [].filter.call(document.querySelectorAll('.mgrow,.mgh'), x => parseFloat(getComputedStyle(x).fontSize) < 20).length; const o = document.querySelector('.lwi'); if (o) o.remove(); window.__NOGO = 1; return { t: t.slice(0, 200), rows, sm, ox: document.documentElement.scrollWidth - innerWidth }; });
      ok(/寫得 愈好/.test(intro.t) && /寫錯/.test(intro.t) && /沒有 獎勵/.test(intro.t) && intro.rows === 5 && !intro.sm, tag + ' 🎧 開場 沒有 先 演「寫得 愈好 獎勵 愈 豐盛／寫錯 沒有 獎勵」 ' + JSON.stringify(intro));
      /* lf 一題：沒有 圖、有 水晶球＋魔法 書；寫對 ＝ 魔法 */
      const q1 = await p.evaluate(async () => { window.__NOLWI = 1; startLW('lf'); await new Promise(s => setTimeout(s, 900)); const st = document.getElementById('stage');
        return { pic: !!st.querySelector('.mlw'), orb: !!st.querySelector('.mirror.orb .morb'), book: st.querySelectorAll('.mgb i').length, cur: st.querySelectorAll('.mgb i.cur').length, emo: /🐷/.test(document.body.innerText), nm: (document.getElementById('gnm') || {}).textContent }; });
      ok(!q1.pic && q1.orb && q1.book === 10 && q1.cur === 1 && !q1.emo && /🎧/.test(q1.nm), tag + ' 🎧 題目：要 沒有 單字 圖、有 🔮 和 📖 10 格、沒有 🐷 ' + JSON.stringify(q1));
      const win = await p.evaluate(async () => { const q = R.q, sc0 = R.score; R.lastLn = { ok: true, dmx: .05, miss: [], over: [] }; WOK(q, document.querySelector('.wleft')); await new Promise(s => setTimeout(s, 120));
        const o = document.getElementById('mgo'), t = o ? o.textContent : ''; await new Promise(s => setTimeout(s, 900)); return { t: t.slice(0, 120), tier: R.mg[0], sc: R.score - sc0, k: R.k }; });
      ok(/魔法/.test(win.t) && (win.tier === 3 || win.tier === 4) && win.sc >= 300, tag + ' 🎧 寫對 又 整齊 ＝ 💎／🌈 魔法＋積分 ' + JSON.stringify(win));
      const lose = await p.evaluate(async () => { await new Promise(s => setTimeout(s, 1500)); if (R.k < 1) return { k: R.k }; miss('draw'); await new Promise(s => setTimeout(s, 300)); const t = document.getElementById('fbx').textContent; return { k: R.k, mg: R.mg[R.k], no: /沒有 魔法 獎勵/.test(t), n3: document.querySelectorAll('#n3 span').length, pic: /🐷|🐶|🐟/.test(t) }; });
      ok(lose.mg === 0 && lose.no && lose.n3 === 2, tag + ' 🎧 寫錯 ＝ 💨 沒有 獎勵＋答錯頁 只 唸 2 次 ' + JSON.stringify(lose));
      ok(!errs.length, tag + ' 字母 書寫 JS 例外 ' + errs.slice(0, 2).join(' | '));
      await ctx.close(); }
    /* ④ 答錯頁：只 唸 2 次＋卡住 保險＋解碼 先 唸 放錯 的 字 */
    for (const site of ['g3mid', 'midterm']) { const id = site === 'g3mid' ? '30401' : '41001';
      const ctx = await ctxOf(vp, id, { __FBWDG: 1500 }), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
      /* 聲音 永遠 不 結束（模擬 iPad 卡住）：play() 不 回、不 onended；瀏覽器 語音 也 不 回 */
      await p.addInitScript(() => { HTMLMediaElement.prototype.play = function () { return new Promise(() => {}); }; try { speechSynthesis.speak = function () {}; } catch (e) { } });
      await p.goto(HTTP + '/' + site + '/index.html'); await p.waitForTimeout(800); await p.evaluate(() => document.querySelectorAll('.scfull').forEach(x => x.remove()));
      const r = await p.evaluate(async site => { const t0 = Date.now();
        if (site === 'g3mid') { start(0); await new Promise(s => setTimeout(s, 900)); miss(null); } else { start(GM.filter(g => g.id === 'm4')[0].id); await new Promise(s => setTimeout(s, 900)); pick(-1); }
        const box = site === 'g3mid' ? '#fb' : '#wf'; let seen = 0; for (let k = 0; k < 60; k++) { await new Promise(s => setTimeout(s, 200)); if (document.querySelector(site === 'g3mid' ? '#fbn' : '#wfn')) { seen = Date.now() - t0; break; } }
        return { n3: document.querySelectorAll('#n3 span').length, seen, on: document.querySelector(box) && document.querySelector(box).classList.contains('on') }; }, site).catch(e => ({ err: String(e) }));
      ok(r.n3 === 2 && r.seen > 0 && r.seen < 9000, tag + ' ' + site + ' 答錯頁：只 唸 2 次＋聲音 卡住 也 要 出〔▶ 下一題〕 ' + JSON.stringify(r));
      ok(!errs.length, tag + ' ' + site + ' 答錯頁 JS 例外 ' + errs.slice(0, 2).join(' | '));
      await ctx.close(); }
    /* 解碼 答錯 的 唸 法（聲音 正常 結束）*/
    for (const site of ['g3mid', 'midterm']) { const id = site === 'g3mid' ? '30401' : '41001';
      const ctx = await ctxOf(vp, id), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.addInitScript(() => { window.__LOG = []; HTMLMediaElement.prototype.play = function () { const a = this; window.__LOG.push('en:' + decodeURIComponent(String(a.src || '').split('/').pop())); setTimeout(() => a.onended && a.onended(), 60); return Promise.resolve(); };
        const z0 = window.SpeechSynthesisUtterance; window.__ZHFAST = 0; });
      await p.goto(HTTP + '/' + site + '/index.html'); await p.waitForTimeout(800); await p.evaluate(() => document.querySelectorAll('.scfull').forEach(x => x.remove()));
      const r = await p.evaluate(async site => { const z = []; const oz = OKV.zh; OKV.zh = function (t, d) { z.push(t); __LOG.push('zh:' + t); setTimeout(d, 60); };
        const q = (site === 'g3mid' ? XB.dc : XB.dc)[0]; const got = q.t.map(t => t[1]); got[0] = '✗'; const b = decBad(q, got);
        const box = document.createElement('div'); box.innerHTML = decGls(q, got) + '<div><span class="tr">x</span></div>'; document.body.appendChild(box); __LOG.length = 0; let hl = 0, done = 0;
        const iv = setInterval(() => { if (box.querySelector('.gls .gw.dmr') && box.querySelector('.dzwhy span.dmr')) hl = 1; }, 20);
        decMissRead(box, q, got, [[q.v || '', q.en]], q.zh || q.z || '中文', () => true, () => { done = 1; });
        for (let k = 0; k < 80 && !done; k++) await new Promise(s => setTimeout(s, 100)); clearInterval(iv); OKV.zh = oz; box.remove();
        return { done, hl, log: __LOG.slice(0, 6), w0: q.t[0][0], z0: q.t[0][1], bad: b }; }, site).catch(e => ({ err: String(e) }));
      ok(r.done && r.hl && r.log && /^en:/.test(r.log[0]) && r.log[1] === 'zh:' + r.z0 && /^en:/.test(r.log[2]) && /^zh:/.test(r.log[3]), tag + ' ' + site + ' 🔓 答錯：要 先 唸 放錯 的 字（英文 ➜ 中文、一起 亮）再 整句 英文 ➜ 整句 中文 ' + JSON.stringify(r));
      ok(!errs.length, tag + ' ' + site + ' 解碼 JS 例外 ' + errs.slice(0, 2).join(' | '));
      await ctx.close(); }
    /* ⑦ 兩人 輪流 步驟 條 */
    { const ctx = await ctxOf(vp, '41001'), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto(HTTP + '/midterm/index.html'); await p.waitForTimeout(700); await p.evaluate(() => document.querySelectorAll('.scfull').forEach(x => x.remove()));
      const r = await p.evaluate(async () => { const d = document.createElement('div'); d.id = 'vlv'; d.innerHTML = DUOI.row(0) + '<div class="xrow"><button class="xb" data-xn="25" data-bk="B">📝 新 25 題</button></div>'; document.body.prepend(d);
        const s1 = [].map.call(d.querySelectorAll('.lvgs span'), x => x.className).join(), hand = !!d.querySelector('.lvh'), need = DUOI.need(), shk = d.querySelector('.duo').classList.contains('shk');
        const bh = [].map.call(d.querySelectorAll('.lvg .duo button'), b => Math.round(b.getBoundingClientRect().height)), fs = Math.min.apply(0, [].map.call(d.querySelectorAll('.lvgs span,.lvg .duo b,.lvg .duo small'), x => parseFloat(getComputedStyle(x).fontSize)));
        DUOI.pick(1); await new Promise(s => setTimeout(s, 50)); const s2 = [].map.call(d.querySelectorAll('.lvgs span'), x => x.className).join(), on = d.querySelector('[data-duo="1"]').classList.contains('on'), g2 = (d.querySelector('.lvg2') || {}).textContent || '', bd = document.body.classList.contains('lvst2'), need2 = DUOI.need();
        const ox = document.documentElement.scrollWidth - innerWidth; d.remove(); DUOI.PICK = 0; document.body.classList.remove('lvst2');
        return { s1, hand, need, shk, bh, fs, s2, on, g2, bd, need2, ox }; });
      ok(/^on,ar,$/.test(r.s1) && r.hand && r.need && r.shk && /^ok,ar,on$/.test(r.s2) && r.on && /兩個人/.test(r.g2) && r.bd && !r.need2 && r.bh.every(h => h >= 72) && r.fs >= 17 && r.ox <= 0, tag + ' 兩人 輪流 步驟 條 不對 ' + JSON.stringify(r));
      /* 送到 狀態 */
      const st = await p.evaluate(async () => { localStorage.setItem('score_q', JSON.stringify([{ id: '41002', u: 'a' }])); localStorage.setItem('score_qk', JSON.stringify([{ id: '41003', u: 'b' }])); const b = document.createElement('div'); document.body.appendChild(b);
        DUOI.status(b, ['41001', '41002', '41003']); await new Promise(s => setTimeout(s, 100)); const t = [].map.call(b.querySelectorAll('.dst2'), x => x.className.replace('dst2 ', '') + ':' + x.textContent.slice(0, 20)); const bt = !!b.querySelector('[data-dpw="41003"]'); b.remove(); localStorage.removeItem('score_q'); localStorage.removeItem('score_qk'); return { t, bt }; });
      ok(st.t.length === 3 && /^ok/.test(st.t[0]) && /^wait/.test(st.t[1]) && /^bad/.test(st.t[2]) && st.bt, tag + ' 兩人 輪流 結束 頁 送到 狀態 不對 ' + JSON.stringify(st));
      ok(!errs.length, tag + ' 兩人 輪流 JS 例外 ' + errs.slice(0, 2).join(' | '));
      await ctx.close(); }
  }
  /* ⑦ 計分 說明 有 例子 */
  { const s = fs.readFileSync(path.join(__dirname, '_duo.js'), 'utf8'); ok(/tally\(A, 'p1', 12, \[3, 7, 10\]\)/.test(s) && /各 一行/.test(s), '兩人 輪流 說明 沒有 計分 例子');   /* 第四十五次：例子 改 成 秒懂 動畫（tally）*/ }
  /* ⑤ 老師看板 */
  if (SKIP.indexOf('t') < 0) { const { make } = require('../score/_gas_stub.js'), B = require('../score/_bank.js'), G = make({ TEACHER_PW: 'pw' }), NOW = Date.now();
    for (let s = 1; s <= 30; s++) G.books['名單'].d.push(['410', s, '測試' + String(s).padStart(2, '0')]);
    const X = B['g4gm_mt-n25'].qs, dc = X.map((q, i) => q.dt ? i : -1).filter(i => i >= 0), hw = X.findIndex(q => /homework, please/.test(q.ae || ''));
    let u = 0; const rec = (id, qs) => G.post({ a: 'rec', r: { id, set: 'g4gm_mt-n25', name: 'x', m: 'g', qs, raw: 1, src: 'school', dev: 'x', u: 'v44t' + (u++), t: NOW - 6e4, lc: 1 } });
    for (let s = 1; s <= 6; s++) rec('410' + String(s).padStart(2, '0'), [[0, 1, 5, 0, .5, dc[0], '~0.1'], [0, 1, 5, 0, .5, dc[1], '~0'], [0, 2, 5, 0, 0, hw], [1, 0, 3, 0, .5, hw], [s % 2, s % 2 ? 0 : 1, 3, 0, .5, dc[2]]]);
    for (const vp of [[1024, 768], [1920, 1080]]) { const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }), e = [];
      await ctx.addInitScript(() => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {}, configurable: true }); window.__LOG = []; HTMLMediaElement.prototype.play = function () { const a = this; __LOG.push('en:' + String(a.src).split('/').pop()); setTimeout(() => a.onended && a.onended(), 50); return Promise.resolve(); };
        try { speechSynthesis.speak = function (u) { __LOG.push('zh:' + u.text + ':' + u.lang); setTimeout(() => u.onend && u.onend(), 50); }; } catch (x) { } });
      await ctx.route(/firebasedatabase\.app|firebaseio\.com/, r => r.abort());
      await ctx.route('https://script.test/exec**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
        await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
      const p = await ctx.newPage(); p.on('pageerror', x => e.push(x.message));
      await p.goto(HTTP + '/teacher/index.html'); await p.waitForTimeout(300); await p.fill('#pw', 'pw'); await p.click('#go'); await p.waitForTimeout(700);
      await p.click('#tabs button[data-t="g"]'); await p.waitForTimeout(300); await p.click('[data-crg="4"]'); await p.waitForTimeout(300); await p.click('[data-crk="x"]'); await p.waitForTimeout(400); await p.click('[data-g3c="410"]'); await p.waitForTimeout(400);
      const t = await p.evaluate(() => { const L = [].map.call(document.querySelectorAll('.xan.xgn>div b'), b => b.textContent); const D = [].map.call(document.querySelectorAll('#dwr .dwrr'), r => r.querySelector('.ww b').textContent + '=' + r.querySelector('.ww i').textContent + ':' + r.querySelector('.nn').textContent);
        const sm = [].filter.call(document.querySelectorAll('.dwr *,.xan.xgn *'), x => [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(x).fontSize) < 18).length;
        return { L, D, btn: !!document.querySelector('[data-dwr]'), sm, ox: document.documentElement.scrollWidth - innerWidth }; });
      ok(t.L.length >= 2 && t.L.every(x => /\S+ \S+/.test(x)) && t.L.some(x => /🔓 句子 解碼 任務/.test(x)), vp.join('×') + ' 老師看板 哪一關 最 難：圖示 旁邊 要 有 名字 ' + JSON.stringify(t.L));
      ok(t.D.length >= 2 && /放錯 12 次/.test(t.D[0]) && t.btn && !t.sm, vp.join('×') + ' 老師看板 🧩 最多 人 放錯 的 英文 字 ' + JSON.stringify(t));
      if (await p.$('[data-dwr]')) await p.click('[data-dwr]'); await p.waitForTimeout(3500);
      const pl = await p.evaluate(() => ({ show: document.querySelectorAll('#dwr .dwrr.show').length, log: __LOG.slice(0, 4) }));
      ok(pl.show >= 1 && /^en:/.test(pl.log[0]) && /^zh:.*zh-TW$/.test(pl.log[1]), vp.join('×') + ' 🧩 動畫＋唸（英文 ➜ 中文）不對 ' + JSON.stringify(pl));
      /* 詳解：③ 比較＋難點、④ 圖＋中文 */
      const k = 'g4gm_mt-n25#' + hw;
      const d3 = await p.evaluate(k => { QDS = true; show(k, 2); const s = document.getElementById('show'); return { dif: s.querySelectorAll('.sdif .w.k').length, key: (s.querySelector('.skey') || {}).textContent || '' }; }, k);
      ok(d3.dif >= 1 && /homework（作業）|Show（給…看）/.test(d3.key), vp.join('×') + ' 詳解 ③ 要 比較 錯 答案 ↔ 正確 答案＋🎯 難點 ' + JSON.stringify(d3));
      const d4 = await p.evaluate(k => { QDS = true; show(k, 3); const s = document.getElementById('show'), im = s.querySelector('.spic img'); const g = [].map.call(s.querySelectorAll('#sans span'), x => x.querySelector('b').textContent + '=' + x.querySelector('i').textContent); return { im: im ? im.getAttribute('src') : '', g }; }, k);
      await p.waitForTimeout(400); const im2 = await p.evaluate(() => { const i = document.querySelector('#show .spic img'); return i ? i.naturalWidth : 0; });
      ok(/homework\.jpg$/.test(d4.im) && im2 > 0 && d4.g.indexOf('Show=給…看') >= 0 && d4.g.indexOf('homework=作業') >= 0 && d4.g.indexOf('please=請') >= 0, vp.join('×') + ' 詳解 ④ 要 有 圖＋Show／homework／please 中文 ' + JSON.stringify(d4) + im2);
      ok(!e.length, vp.join('×') + ' 老師看板 JS 例外 ' + e.slice(0, 2).join(' | '));
      await ctx.close(); } }
  /* ⑥ 戰神之路 保底 寶箱 */
  if (SKIP.indexOf('r') < 0) for (const vp of [[1024, 768], [820, 1180]]) { const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }), e = [];
    const { make } = require('../score/_gas_stub.js'), G = make({ TEACHER_PW: 'pw' }), NOW = Date.now(), DAY = 864e5;
    let u = 0; for (let d = 0; d < 10; d++) G.post({ a: 'rec', r: { id: '30412', set: 'g3u1_1-1b', name: 'x', m: 'q', qs: [[1, 0, 3, 0, .5, 0], [1, 0, 3, 0, .5, 1], [1, 0, 3, 0, .5, 2], [1, 0, 3, 0, .5, 3], [1, 0, 3, 0, .5, 4]], raw: 1, src: 'home', dev: 'x', u: 'v44r' + (u++), t: NOW - d * DAY } });
    await ctx.addInitScript(() => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {}, configurable: true }); localStorage.setItem('score_last', '"30412"'); localStorage.setItem('score_id_g3', '"30412"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', '30412'); window.__NOTU = 1; });
    await ctx.route(/firebasedatabase\.app|firebaseio\.com|script\.google\.com/, r => r.abort());
    await ctx.route('https://script.test/exec**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
      await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
    const p = await ctx.newPage(); p.on('pageerror', x => e.push(x.message));
    await p.goto(HTTP + '/rpg/index.html'); await p.waitForTimeout(2600);
    const a = await p.evaluate(() => { const o = document.getElementById('bchO'); [].forEach.call(document.querySelectorAll('#rpm.on'), x => x.className = ''); return { ch: RV && RV.chests, coins: RV && RV.coins, shown: (document.getElementById('coinN') || {}).textContent, open: !!(o && o.classList.contains('on')), btn: (document.querySelector('.bch.nw') || {}).textContent || '', warn: !!document.querySelector('.bchw'), led: o ? o.querySelectorAll('.blg span').length : 0 }; });
    const nf = x => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    ok(a.ch >= 1 && a.shown === nf(a.coins - a.ch * 60) && a.open && /新 ?的 ?保底 ?寶箱/.test(a.btn) && a.warn && a.led === 4, vp.join('×') + ' 保底 寶箱：新 的 先 不 算進 🪙、自己 跳出來、帳本 4 行 ' + JSON.stringify(a));
    await p.click('#bchOk'); await p.waitForTimeout(3200);
    const b = await p.evaluate(() => ({ shown: (document.getElementById('coinN') || {}).textContent, coins: RV.coins, ls: localStorage.getItem('rp_bch_30412'), nw: !!document.querySelector('.bch.nw'), view: (document.querySelector('.bch') || {}).textContent || '' }));
    ok(b.shown === nf(b.coins) && +b.ls === a.ch && !b.nw && /已經 ?打開/.test(b.view), vp.join('×') + ' 收下 以後：金幣 飛 進去、記住 打開 了 ' + JSON.stringify(b));
    ok(!e.length, vp.join('×') + ' 戰神之路 JS 例外 ' + e.slice(0, 2).join(' | '));
    await ctx.close(); }
  /* ⑧ 頒獎 典禮 */
  if (SKIP.indexOf('a') < 0) { const A = require('../score/_awd.js');
    ok(!/backdrop-filter/.test(A.CSS), '頒獎 典禮 還有 backdrop-filter（教室 電腦 3D 會 出現 一片 怪 畫面）');
    ok(!/\.pt\{[^}]*rotateX\(90deg\)/.test(A.CSS), '頒獎台 頂面 還是 3D 轉 90 度 的 平面');
    for (const vp of [[1024, 768], [1920, 1080]]) { const p = await br.newPage({ viewport: { width: vp[0], height: vp[1] } }), e = []; p.on('pageerror', x => e.push(x.message));
      const rows = []; for (let i = 1; i <= 10; i++) rows.push({ rk: i, code: '410' + String(i).padStart(2, '0'), nm: '測試' + i, sc: (100 - i) + ' 分', ln: '', h: '', p: '', w: '' });
      await p.setContent('<!doctype html><meta charset="utf-8"><style>html,body{margin:0;height:100%}#s{position:fixed;inset:0}' + A.CSS + '</style><div id="s"></div><script>' + A.JS + '</script>');
      const st = await p.evaluate(async rows => { AWD.play(document.getElementById('s'), { kick: '410 班', title: '🏆 頒獎 典禮', rows }); const t0 = Date.now(); let got = null;
        while (Date.now() - t0 < 16000) { await new Promise(s => setTimeout(s, 250)); const L = document.querySelectorAll('.aws'); if (L.length === 5) { const v = [].map.call(L, x => ({ t: x.querySelector('b').textContent, op: +getComputedStyle(x).opacity, y: Math.round(x.getBoundingClientRect().top), d: parseFloat(x.style.animationDelay) }));
            if (!got) got = { first: v }; if (v.every(x => x.op > .95)) { got.last = v; break; } } }
        const r1 = document.querySelector('.awgrp.r1'); return Object.assign(got || {}, { crown: !!(r1 && r1.querySelector('.awcrown')), rays: !!(r1 && r1.querySelector('.awrays')), champ: !!(r1 && r1.querySelector('.awchamp')) }); }, rows);
      const L = st.last || [];
      ok(L.length === 5 && L[0].t === '第 6 名' && L[4].t === '第 10 名' && L[4].y > L[0].y && L[4].d === 0 && L[0].d > L[1].d && st.first && st.first[4].op >= st.first[0].op, vp.join('×') + ' 頒獎：第 10～6 名 要 是 階梯（最 下面 第 10 名、由下 往上）' + JSON.stringify(st).slice(0, 400));
      ok(st.crown && st.rays && st.champ, vp.join('×') + ' 頒獎：第 1 名 要 有 皇冠、光芒、「👑 冠軍」' + JSON.stringify(st).slice(0, 200));
      ok(!e.length, vp.join('×') + ' 頒獎 JS 例外 ' + e.slice(0, 2).join(' | '));
      await p.close(); } }
  /* ⑥-2 p、t 吹氣 語音 換了 */
  { const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'listen', '2026-11-04_C51', 'au', '_res.json'), 'utf8')); ok(r.pig && r.ten && r.pig[1] >= 85 && r.ten[1] >= 85, 'p、t 吹氣 語音 沒有 做 ' + JSON.stringify(r)); }
  await br.close(); srv.close();
  E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第四十四次：' + n + ' 項，' + E.length + ' 個失敗'); process.exit(E.length ? 1 : 0);
})();
