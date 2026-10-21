/* rpg/_verify.js — 🦸 我的英雄 量測（假伺服器 score/_gas_stub.js 跑真的 Code.gs，絕對不送到真的成績表）
 *   node rpg/_verify.js        只印失敗項和一行總結；三種尺寸：iPad 橫、iPad 直、教室觸控螢幕
 * 量：沒登入 ＝ 大大的〔🔑 登入〕；登入以後：舞台（英雄空的、Lv、金幣）、免費選第一個英雄 ➜ 試算表「角色」有一列、裝上；金幣不夠／等級不夠擋下來；
 *     換裝；寶物外觀出現；🏪 商城（10 類、上架的 20 種 4 排、買光環 ➜ 戴在英雄後面、舊光環拿下來、還沒上架的「🔜」、必殺特效）；分頁 7 個都畫得出來、字 ≧ 20px、按鈕 ≧ 48px、圖都載得到、不左右捲；做完一次題目 ➜ 平板最後多一幕 🦸（經驗值、金幣） */
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { make } = require('../score/_gas_stub.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec';
const E = []; let n = 0, HTTP = '';
function serve() { return new Promise(ok => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.css': 'text/css', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
  const s = require('http').createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; ok(s); }); }); }
(async () => {
  const srv = await serve(), br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) {
    const tag = vp.join('✕'), G = make({ TEACHER_PW: 'pw-verify' }), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); }, URL0);
    await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams);
      const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
      await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
    await ctx.route(/script\.google\.com/, r => r.abort());
    /* 先讓 40205 練習一些：答對、改對、進步（金幣夠買 ★2） */
    const T0 = Date.now() - 3 * 864e5;
    for (let d = 0; d < 3; d++) for (let k = 0; k < 2; k++) G.post({ a: 'rec', r: { id: '40205', set: 'g4u1_1-1b', name: 'x', src: 'home', dev: 'v', u: 'v' + d + k, t: T0 + d * 864e5 + k * 6e4,
      qs: [0, 1, 2, 3, 4].map(i => [i < 3 + k + (d > 0 ? 1 : 0) ? 1 : 0, 0, 4, 0, .6, i]) } });
    const p = await ctx.newPage(), bad = [], snd = [];
    p.on('request', r => { if (/\.(mp3|wav|ogg)(\?|$)/.test(r.url())) snd.push(r.url().slice(-30)); });
    p.on('pageerror', x => E.push(tag + ' JS 錯誤：' + x.message));
    p.on('response', r => { if (r.status() >= 400 && r.url().startsWith(HTTP)) bad.push(r.url().slice(HTTP.length)); });
    await p.addInitScript(() => { window.__NOCB = 1; });
    await p.goto(HTTP + '/rpg/index.html'); await p.waitForTimeout(1200);
    const o0 = await p.evaluate(() => { const b = document.getElementById('rpIn'); return { out: !document.getElementById('rpout').hidden, h: b ? b.getBoundingClientRect().height : 0 }; });
    if (!o0.out || o0.h < 64) E.push(tag + '：沒登入沒有大大的〔🔑 登入〕');
    /* 2026-10-18 第十次：封面照片＋「戰神之路」；「普通」改「基本」 */
    const cv = await p.evaluate(() => { const i = document.querySelector('.cov>img'), h = document.querySelector('.cov h1'); return { ok: !!i && i.complete && i.naturalWidth > 0, h: i ? i.getBoundingClientRect().height : 0, t: h ? h.textContent : '', ti: document.title }; });
    if (!cv.ok || cv.h < 150 || !/^戰神之路/.test(cv.t) || cv.ti !== '戰神之路') E.push(tag + '：封面照片／「戰神之路」不對（' + cv.t + '，' + cv.h + 'px）');
    /* 登入（跟成績系統同一個）：直接放 5 碼＋已經確認 */
    await p.evaluate(() => { localStorage.setItem('score_last', '"40205"'); localStorage.setItem('score_id_g4', '"40205"'); localStorage.setItem('score_act', JSON.stringify(Date.now())); sessionStorage.setItem('sc_ok', '40205'); });
    await p.reload(); await p.waitForTimeout(1800);
    /* 2026-10-21 第十六次 第 6 點：第一次 打開 ＝ 先 看 📜 獎勵 規則（9 幕）➜ 5 題 小問題 都 答對 才 能 玩；答錯 ＝ 回去 看 那一幕 */
    const g0 = await p.evaluate(() => ({ lk: document.getElementById('rpin').classList.contains('rlock'), st: getComputedStyle(document.getElementById('stage')).display, tb: getComputedStyle(document.getElementById('tabs')).display,
      gate: !!document.querySelector('.rgate'), sc: document.querySelectorAll('#tst .tsc').length, qz: (document.getElementById('qzGo') || {}).hidden, ch: document.querySelectorAll('.tch button').length }));
    if (!g0.lk || g0.st !== 'none' || g0.tb !== 'none' || !g0.gate || g0.sc !== 9 || g0.qz !== true || g0.ch !== 1) E.push(tag + '：第一次 打開 沒有 先 鎖住 看 規則：' + JSON.stringify(g0));
    for (let i = 0; i < 9; i++) { await p.click('[data-tut="' + i + '"]'); await p.waitForTimeout(i === 8 ? 4200 : 3800);
      const f = await p.evaluate(() => { const c = document.querySelector('#tst .tsc.on'), t = document.getElementById('tst').getBoundingClientRect(), o = [];
        c.querySelectorAll('*').forEach(x => { const r = x.getBoundingClientRect(); if (r.width && (r.right > t.right + 2 || r.left < t.left - 2 || r.bottom > t.bottom + 2)) o.push(x.className || x.tagName); });
        let mn = 99; c.querySelectorAll('.cap,.rnote,.rtb>div,.rab .ln,.rlist>div,.rmul>div,.rgm span,.rtl>div,.rwk>span,.tchips span').forEach(x => { if (x.textContent.trim()) mn = Math.min(mn, parseFloat(getComputedStyle(x).fontSize)); });
        return { o: o.slice(0, 3), mn }; });
      if (f.o.length || f.mn < 17) E.push(tag + '：規則 第 ' + (i + 1) + ' 幕 超出 或 字 太小：' + JSON.stringify(f)); }
    const qg = await p.evaluate(() => { const b = document.getElementById('qzGo'); return b && !b.hidden ? b.getBoundingClientRect().height : 0; });
    if (qg < 64) E.push(tag + '：看完 9 幕 沒有 大大的〔📝 5 題 小問題〕（' + qg + '）');
    await p.click('#qzGo'); await p.waitForTimeout(300);
    const q1 = await p.evaluate(() => ({ on: document.getElementById('rqz').className === 'on', n: document.querySelectorAll('#rqz [data-qa]').length, h: Math.min.apply(null, [].map.call(document.querySelectorAll('#rqz [data-qa]'), b => b.getBoundingClientRect().height)), fs: parseFloat(getComputedStyle(document.querySelector('#rqz .qt')).fontSize) }));
    if (!q1.on || q1.n !== 3 || q1.h < 64 || q1.fs < 26) E.push(tag + '：小問題 畫面 不對：' + JSON.stringify(q1));
    await p.click('#rqz [data-qa="1"]'); await p.waitForTimeout(300); await p.click('#qzSee'); await p.waitForTimeout(500);
    const sb = await p.evaluate(() => ({ off: document.getElementById('rqz').className !== 'on', i: TUT.i, pz: TUT.pz, back: !!document.getElementById('qzBack') }));
    if (!sb.off || sb.i !== 0 || !sb.pz || !sb.back) E.push(tag + '：答錯 沒有 回去 看 那一幕（停住）＋〔📝 回到 第 1 題〕：' + JSON.stringify(sb));
    await p.click('#qzBack'); await p.waitForTimeout(300);
    for (let k = 0; k < 5; k++) { await p.click('#rqz [data-qa="0"]'); await p.waitForTimeout(1100); }
    await p.waitForTimeout(600);
    const qd = await p.evaluate(() => ({ t: document.getElementById('rqzb').textContent, qz: RV && RV.qz }));
    if (!/看懂/.test(qd.t) || qd.qz !== 1) E.push(tag + '：5 題 都 對 沒有 送 給 老師：' + JSON.stringify(qd).slice(0, 90));
    if (!G.books['角色'] || !/"qz":1/.test((G.books['角色'].d[1] || [])[1] || '')) E.push(tag + '：試算表「角色」沒有 記 看懂 規則');
    await p.click('#qzEnd'); await p.waitForTimeout(500);
    const gU = await p.evaluate(() => ({ lk: document.getElementById('rpin').classList.contains('rlock'), st: getComputedStyle(document.getElementById('stage')).display }));
    if (gU.lk || gU.st === 'none') E.push(tag + '：看懂 以後 還是 鎖著');
    const s0 = await p.evaluate(() => ({ in: !document.getElementById('rpin').hidden, t: document.getElementById('stage').textContent, free: !!document.querySelector('.free'),
      fr: document.querySelectorAll('#shop .pr.fr').length, it: document.querySelectorAll('#shop .it').length }));
    if (!s0.in || !/還沒有戰士/.test(s0.t) || !/Lv \d/.test(s0.t) || !/金幣/.test(s0.t)) E.push(tag + '：登入以後舞台不對：' + s0.t.slice(0, 80));
    if (/普通/.test(await p.textContent('#rp'))) E.push(tag + '：還有「普通」（要改「基本」）');
    if (!s0.free || s0.fr !== 8 || s0.it !== 30) E.push(tag + '：英雄分頁要 30 個男生英雄、8 個寫「🎁 免費」（' + s0.it + '／' + s0.fr + '）');
    await p.click('[data-sex="g"]'); await p.waitForTimeout(150);
    const gi = await p.evaluate(() => [].map.call(document.querySelectorAll('#shop .it'), x => x.getAttribute('data-id')));
    if (gi.length !== 31 || gi.indexOf('g29') < 0 || gi.indexOf('g31') < 0) E.push(tag + '：女生英雄要 31 個（有女 29、女 31）（' + gi.length + '）');
    await p.click('[data-sex="b"]'); await p.click('#shop [data-id="b02"]'); await p.waitForTimeout(150);
    if (!/免費/.test(await p.textContent('#rpmb'))) E.push(tag + '：點 ★1 英雄沒有問「免費 選 這一個？」');
    await p.click('#rpmb [data-m="buy"]'); await p.waitForTimeout(900);
    /* 2026-10-20 第十四次：選到戰士 ＝ 蓋滿整頁的登場動畫（魔法陣、光柱、卡片轉出來、星星） */
    const b1 = await p.evaluate(() => { const o = document.querySelector('.fxov.sum'); return { ov: !!o, t: o ? o.textContent : '', cv: o ? o.querySelectorAll('canvas').length : 0, img: !!(o && o.querySelector('.fxcard img')), hero: !!document.querySelector('#stage .hc img') }; });
    if (!b1.ov || !/戰士 登場/.test(b1.t) || b1.cv < 2 || !b1.img || !b1.hero) E.push(tag + '：選到戰士沒有登場動畫、舞台沒有戰士：' + JSON.stringify(b1).slice(0, 80));
    await p.evaluate(() => { const b = document.querySelector('.fxov .fxok'); if (b) b.click(); }); await p.waitForTimeout(1200);
    if (await p.$('.fxov')) E.push(tag + '：登場動畫按〔👌 好〕關不掉');
    if (!G.books['角色'] || !/b02/.test((G.books['角色'].d[1] || [])[1] || '')) E.push(tag + '：試算表「角色」沒有存到 b02');
    /* ★2 稀有 150：金幣夠不夠照伺服器 */
    const coins = await p.evaluate(() => RV.coins);
    await p.click('#shop [data-id="b09"]'); await p.waitForTimeout(150);
    const t2 = await p.textContent('#rpmb');
    if (coins >= 150 ? !/150/.test(t2) : !/還差/.test(t2)) E.push(tag + '：★2 英雄（' + coins + ' 金幣）的對話框不對：' + t2.slice(0, 40));
    await p.click('#rpmb [data-m="x"]');
    await p.click('#shop [data-id="b30"]'); await p.waitForTimeout(150);
    if (!/Lv 20/.test(await p.textContent('#rpmb'))) E.push(tag + '：★5 英雄沒有擋「Lv 20」');
    await p.click('#rpmb [data-m="x"]');
    /* 寵物免費一隻 ➜ 舞台有寵物＋「寶寶」 */
    await p.click('#tabs [data-t="p"]'); await p.click('#shop [data-id="p03"]'); await p.click('#rpmb [data-m="buy"]'); await p.waitForTimeout(800); await p.evaluate(() => { const b = document.querySelector('.fxov .fxok'); if (b) b.click(); }); await p.waitForTimeout(450);
    await p.click('#tabs [data-t="w"]'); await p.click('#shop [data-id="w03"]'); await p.click('#rpmb [data-m="buy"]'); await p.waitForTimeout(800);
    const wsm = await p.evaluate(() => { const o = document.querySelector('.fxov.sum'); return o ? o.textContent : ''; }); if (!/武器 登場/.test(wsm) || !/星光/.test(wsm)) E.push(tag + '：選到武器沒有登場動畫（' + wsm.slice(0, 30) + '）');
    await p.evaluate(() => { const b = document.querySelector('.fxov .fxok'); if (b) b.click(); }); await p.waitForTimeout(1600);
    if (!/寶寶/.test(await p.textContent('#stage'))) E.push(tag + '：選了寵物，舞台沒有寵物「🐣 寶寶」');
    /* 寶物：給一點金幣以後買一個（直接改伺服器的「花了多少」不行 ➜ 用夠便宜的 😎 80） */
    await p.click('#tabs [data-t="t"]'); await p.waitForTimeout(100);
    const tn = await p.evaluate(() => document.querySelectorAll('#shop .it').length);
    if (tn !== 10) E.push(tag + '：寶物不是 10 種（' + tn + '）');
    if (coins >= 80) { await p.click('#shop [data-id="t06"]'); await p.click('#rpmb [data-m="buy"]'); await p.waitForTimeout(800); await p.click('#rpmb [data-m="x"]');
      if (!(await p.$('#stage .emo'))) E.push(tag + '：買了 😎 英雄表情，舞台沒有出現'); }
    /* 6 個分頁：字、按鈕、圖、不左右捲 */
    for (const t of ['h', 'w', 'p', 't', 'm', 's', 'q']) {
      await p.click('#tabs [data-t="' + t + '"]'); await p.waitForTimeout(250);
      const m = await p.evaluate(() => { const sm = [].filter.call(document.querySelectorAll('#rp *'), x => { if (!x.getBoundingClientRect().width || x.children.length && !x.textContent.trim()) return false;
          const own = [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()); return own && parseFloat(getComputedStyle(x).fontSize) < 18; }).map(x => x.textContent.trim().slice(0, 10));
        const lowB = [].filter.call(document.querySelectorAll('#rp button,#rp a'), x => x.getBoundingClientRect().width && x.getBoundingClientRect().height < 48).map(x => x.textContent.trim().slice(0, 10));
        return { sm, lowB, ox: document.documentElement.scrollWidth - innerWidth, im: [].filter.call(document.querySelectorAll('#rp img'), x => x.complete && !x.naturalWidth && x.getAttribute('loading') !== 'lazy').length }; });
      if (m.sm.length) E.push(tag + ' 分頁 ' + t + '：字小於 18px：' + m.sm.slice(0, 4).join('、'));
      if (m.lowB.length) E.push(tag + ' 分頁 ' + t + '：按鈕矮於 48px：' + m.lowB.slice(0, 4).join('、'));
      if (m.ox > 1) E.push(tag + ' 分頁 ' + t + '：左右捲 ' + m.ox + 'px');
      if (m.im) E.push(tag + ' 分頁 ' + t + '：有 ' + m.im + ' 張圖載不到');
    }
    if (!/改對/.test(await p.textContent('#shop'))) E.push(tag + '：〔❓ 怎麼賺〕沒有寫改對拿金幣');
    /* ❓ 秒懂動畫：9 幕自己往下演（一幕 7.5 秒，第十六次）；點按鈕跳到那一幕；數字會數上去 */
    await p.click('#tabs [data-t="q"]'); await p.waitForTimeout(300);
    const t0 = await p.evaluate(() => ({ n: document.querySelectorAll('#tst .tsc').length, on: [].indexOf.call(document.querySelectorAll('#tst .tsc'), document.querySelector('#tst .tsc.on')) }));
    await p.waitForTimeout(7900); const t1 = await p.evaluate(() => [].indexOf.call(document.querySelectorAll('#tst .tsc'), document.querySelector('#tst .tsc.on')));
    if (process.env.SHOT && tag === '1024✕768') { }
    await p.click('.tnav [data-tut="2"]'); await p.waitForTimeout(2600); const tc = await p.evaluate(() => (document.querySelector('#tst .tsc.on .tcn') || {}).textContent);
    const tf = await p.evaluate(() => { const r = document.getElementById('tst').getBoundingClientRect(); return [].filter.call(document.querySelectorAll('#tst .tsc.on .cap,#tst .tsc.on .tchips span,#tst .tsc.on .tcoin'), x => { const b = x.getBoundingClientRect(); return b.left < r.left - 1 || b.right > r.right + 1 || b.bottom > r.bottom + 1; }).length; });
    if (t0.n !== 10 || t0.on !== 0 || t1 !== 1 || tc !== '20' || tf) E.push(tag + '：❓ 動畫不對（' + t0.n + ' 幕、一開始第 ' + t0.on + '、7.9 秒後第 ' + t1 + '、金幣 ' + tc + '、跑出框 ' + tf + '）');
    await p.click('#tabs [data-t="h"]');
    /* 🏪 商城：老師發 600 金幣（現場任務獎勵）➜ 買 ✨ 覺醒光環 01（500） */
    G.post({ a: 'rpgb', pw: 'pw-verify', room: '7777', t0: Date.now(), list: [{ id: '40205', c: 600, x: 0, tre: ['t01'] }] });
    for (const r of ['7778', '7779']) G.post({ a: 'rpgb', pw: 'pw-verify', room: r, t0: Date.now(), list: [{ id: '40205', c: 500, x: 0 }] });   /* 一次最多 500：再發兩次，才買得起背景、名字框 */
    await p.reload(); await p.waitForTimeout(1800); await p.click('#tabs [data-t="m"]'); await p.waitForTimeout(200);
    const m0 = await p.evaluate(() => ({ cat: document.querySelectorAll('.scat button').length, soon: document.querySelectorAll('.scat button.soon').length, it: document.querySelectorAll('#shop > .sgrid .it').length,
      rows: [].map.call(document.querySelectorAll('.srow'), x => x.textContent), halo: !!document.querySelector('#stage .halo') }));
    if (m0.cat !== 10 || m0.soon !== 0 || m0.it !== 20 || m0.rows.length !== 4 || !/500/.test(m0.rows[0]) || !/1,200.*Lv 5/.test(m0.rows[1]) || !/2,500.*Lv 10/.test(m0.rows[2]) || !/5,000.*Lv 20.*學霸/.test(m0.rows[3]))
      E.push(tag + '：商城不對（類 ' + m0.cat + '、🔜 ' + m0.soon + '、' + m0.it + ' 種、排：' + m0.rows.join('｜') + '）');
    if (!m0.halo) E.push(tag + '：發獎勵送的舊 ✨ 光環 沒有戴上');
    await p.click('#shop [data-id="s0116"]'); await p.waitForTimeout(150);
    if (!/Lv 20/.test(await p.textContent('#rpmb'))) E.push(tag + '：第 4 排沒有擋「Lv 20」'); await p.click('#rpmb [data-m="x"]');
    await p.click('#shop [data-id="s0101"]'); await p.waitForTimeout(150);
    if (!/500/.test(await p.textContent('#rpmb'))) E.push(tag + '：光環 01 沒有問「用 🪙 500 換」');
    await p.click('#rpmb [data-m="buy"]'); await p.waitForTimeout(1000); await p.click('#rpmb [data-m="x"]'); await p.waitForTimeout(400);
    const m1 = await p.evaluate(() => { const a = document.querySelector('#stage .hc .rw-au'); return { au: !!a && a.complete && a.naturalWidth > 0, halo: !!document.querySelector('#stage .halo'),
      eq: !!document.querySelector('#shop [data-id="s0101"].eqd'), st: (RV.st.eq.s || {}).au }; });
    /* ⚔ 出招：刀光＋一擊的數字（跟 rpDmg 一樣） */
    await p.click('#atkTry'); await p.waitForTimeout(250);
    await p.waitForTimeout(700);
    /* 2026-10-20 第十四次：出招 ＝ 特效引擎（畫布、招式名字、練功幻影、一擊數字）；出 4 次，招式名字至少 2 種（每一次不一樣） */
    const ak = await p.evaluate(() => { const b = document.querySelector('#mfr .fxnum'), n = document.querySelector('#mfr .fxname b'); return { t: b ? b.textContent.replace(/暴擊！/, '') : '', d: RV.hit, cv: !!document.querySelector('#mfr canvas.fxcv'), mon: !!document.querySelector('#mfr .fxmon.holo img'), nm: n ? n.textContent : '' }; });
    if (ak.t !== '💥 ' + ak.d || !ak.cv || !ak.mon || !ak.nm) E.push(tag + '：〔⚔ 出招！〕沒有演出（數字 ' + ak.t + '／' + ak.d + '、畫布 ' + ak.cv + '、幻影 ' + ak.mon + '、招式 ' + ak.nm + '）');
    const nms = new Set([ak.nm]); for (let i = 0; i < 3; i++) { await p.waitForTimeout(2600); await p.click('#atkTry'); await p.waitForTimeout(800); nms.add(await p.evaluate(() => { const n = document.querySelector('#mfr .fxname b'); return n ? n.textContent : ''; })); }
    if (nms.size < 2) E.push(tag + '：出招 4 次 招式 都一樣（' + [...nms].join('、') + '）');
    await p.waitForTimeout(2600);
    if (!m1.au || m1.halo || !m1.eq || m1.st !== 's0101') E.push(tag + '：買了光環：英雄後面 ' + (m1.au ? '有' : '沒有') + ' 新光環、舊光環 ' + (m1.halo ? '還在' : '拿下來') + '、卡片 ' + (m1.eq ? '裝備中' : '沒寫裝備中'));
    if (process.env.SHOT) { await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: path.join(process.env.SHOT, 'rpg_' + tag + '.png'), fullPage: true }); }   /* SHOT=資料夾 拍照看樣子 */
    if (!G.books['角色'] || !/s0101/.test(G.books['角色'].d[1][1])) E.push(tag + '：試算表「角色」沒有存到 s0101');
    await p.click('#shop [data-id="s0101"]'); await p.waitForTimeout(900);
    if (await p.$('#stage .rw-au')) E.push(tag + '：再點一下 沒有 拿下來');
    /* 2026-10-18 第十次：上架的 5 類 ✕ 20 種，商店卡、穿在身上的圖都載得到；買背景 ➜ 舞台換底圖、買名字框 ➜ 圍住號碼 */
    const miss = await p.evaluate(async () => { const o = []; for (let c = 1; c <= 10; c++) for (let n = 1; n <= 20; n++) { const id = 's' + (c < 10 ? '0' : '') + c + (n < 10 ? '0' : '') + n;
      for (const x of ['.jpg', 'i.webp']) { const r = await fetch('shop/' + id + x); if (!r.ok) o.push(id + x); } } return o; });
    if (miss.length) E.push(tag + '：商城圖載不到 ' + miss.slice(0, 4).join('、'));
    for (const id of ['s0501', 's0401']) { await p.click('[data-scat="' + id[2] + '"]'); await p.waitForTimeout(150); await p.click('#shop [data-id="' + id + '"]'); await p.waitForTimeout(150);
      await p.click('#rpmb [data-m="buy"]'); await p.waitForTimeout(1000); await p.click('#rpmb [data-m="x"]'); await p.waitForTimeout(300); }
    const w2 = await p.evaluate(() => ({ bg: /s0501i\.webp/.test(document.querySelector('#mfr .mfbg').getAttribute('style') || ''), nf: !!document.querySelector('#stage .idl .rw-nf[src*="s0401i"]') }));
    if (!w2.bg || !w2.nf) E.push(tag + '：買了背景／名字框 沒有穿上（背景 ' + w2.bg + '、名字框 ' + w2.nf + '）');
    /* 2026-10-18 第十二次：06～10 也上架了 ➜ 每一類 20 種、沒有「即將 上架」；學生看得到的字 沒有「英雄」（老師：一律 改成 戰士） */
    for (let c = 6; c <= 10; c++) { await p.click('[data-scat="' + c + '"]'); await p.waitForTimeout(200);
      await p.waitForFunction(() => [].every.call(document.querySelectorAll('#shop > .sgrid [data-id^="s"] img'), i => i.complete && i.naturalWidth > 0), null, { timeout: 5000 }).catch(() => {});
      const k = await p.evaluate(() => ({ n: document.querySelectorAll('#shop > .sgrid [data-id^="s"]').length, soon: /即將 上架/.test(document.getElementById('shop').textContent),
        img: [].every.call(document.querySelectorAll('#shop [data-id^="s"] img'), i => i.complete && i.naturalWidth > 0) }));
      if (k.n !== 20 || k.soon || !k.img) E.push(tag + '：商城第 ' + c + ' 類 不對（' + k.n + ' 種、即將上架 ' + k.soon + '、圖 ' + k.img + '）'); }
    const hz = await p.evaluate(() => document.body.innerText.indexOf('英雄') >= 0 || /英雄/.test([].map.call(document.querySelectorAll('[alt],[title]'), e => (e.alt || '') + (e.title || '')).join('')));
    if (hz) E.push(tag + '：畫面上 還有「英雄」（要 改成 戰士）');
    await p.evaluate(() => rwFx('../', 's0101')); await p.waitForTimeout(300);
    const fx = await p.evaluate(() => { const o = document.querySelector('.rw-fx img'); return !!o && o.complete && o.naturalWidth > 0; });
    await p.waitForTimeout(1500); if (!fx || await p.$('.rw-fx')) E.push(tag + '：💥 必殺特效 沒有出現或沒有消失');
    /* ══ 2026-10-20 第十四次 ══ */
    /* 1 回首頁：四年級 ➜ 四年級在家複習；三年級 ➜ 三年級在家複習（不可以 回到 總首頁） */
    const hm = await p.evaluate(() => { const a = document.getElementById('rpHome').getAttribute('href'), s0 = SCID; SCID = '30412'; const b = homeHref(); SCID = s0; return [a, b]; });
    if (hm[0] !== '../g4-review/index.html' || hm[1] !== '../g3-review/index.html') E.push(tag + '：〔🏠 回首頁〕不對（' + hm.join('、') + '）');
    /* 2 金幣：畫面上 不可以 有 🪙 這個字（舊的 Windows 沒有）；換成 自己 畫 的 金幣 */
    const cn = await p.evaluate(() => ({ raw: document.body.innerText.indexOf('\u{1FA99}') >= 0, n: document.querySelectorAll('#rp .cnI').length, bg: getComputedStyle(document.querySelector('#rp .cnI')).backgroundImage.length }));
    if (cn.raw || cn.n < 2 || cn.bg < 100) E.push(tag + '：金幣圖示 不對（還有 🪙 ' + cn.raw + '、自己畫的 ' + cn.n + ' 個）');
    /* 3 兩句 不空格 */
    await p.click('#tabs [data-t="q"]'); await p.waitForTimeout(200);
    const ns = await p.evaluate(() => document.getElementById('rp').textContent);
    if (!/經驗值、金幣怎麼來/.test(ns) || !/買到的東西不加分數、不會讓題目變簡單/.test(ns)) E.push(tag + '：兩句 還有 空格');
    await p.click('#tabs [data-t="h"]');
    /* 4 魔幻方框：戰士、武器、寵物、光環、名字框、背景 都在 #mfr 裡面；👾 怪物；〔▶ 看 長大〕 */
    const mf = await p.evaluate(() => { const m = document.getElementById('mfr'); return { h: !!m.querySelector('#hcard img'), w: !!m.querySelector('#wcard img'), p: !!m.querySelector('#pcard img'), nf: !!m.querySelector('.rw-nf'), run: !!m.querySelector('.mfrun svg'), c: m.querySelectorAll('.mfc').length,
      mon: /怪物（第 \d+ 隻）/.test(document.getElementById('stage').textContent) }; });   /* 2026-10-20 第十五次：「👾 下一隻 怪物（第 1 隻）」 */
    if (!mf.h || !mf.w || !mf.p || !mf.nf || !mf.run || mf.c !== 4 || !mf.mon) E.push(tag + '：魔幻方框 不對 ' + JSON.stringify(mf));
    /* 4 限量、限時：商城 最上面 一區 8 樣（2026-10-20 第十五次：限時 5 樣 ＝ s0301 金龍、s0804、s0710、s0908、s1005）；剩幾個 ＝ 伺服器 數；5 個 都 換走 ➜「已 換完」、買不到 */
    await p.click('#tabs [data-t="m"]'); await p.waitForTimeout(200);
    const lt = await p.evaluate(() => ({ n: document.querySelectorAll('.ltd .it').length, a: (document.querySelector('.ltd [data-id="s0713"]') || {}).textContent || '', b: (document.querySelector('.ltd [data-id="s0804"]') || {}).textContent || '', c: !!document.querySelector('.ltd [data-id="s0301"]') && !!document.querySelector('.ltd [data-id="s0908"]') && !document.querySelector('.ltd [data-id="s0805"]') && !document.querySelector('.ltd [data-id="s0907"]') }));
    if (lt.n !== 8 || !lt.c || !/限量 5 個．剩 5 個/.test(lt.a) || !/10 月 31 號 下架/.test(lt.b)) E.push(tag + '：限量、限時 不對（' + lt.n + '、' + lt.a + '、' + lt.b + '）');
    for (let i = 0; i < 5; i++) G.books['角色'].d.push(['4010' + i, JSON.stringify({ own: { s: ['s0713'] } }), new Date()]);
    const sold = G.post({ a: 'rpg', id: '40205', op: 'buy', item: 's0713' });
    await p.reload(); await p.waitForTimeout(1800); await p.click('#tabs [data-t="m"]'); await p.waitForTimeout(200);
    const l2 = await p.evaluate(() => (document.querySelector('.ltd [data-id="s0713"]') || {}).textContent || '');
    if (!/已 換完/.test(l2) || !(sold.err === 'sold' || sold.err === 'lv' || sold.err === 'coin')) E.push(tag + '：5 個 換完 不對（' + l2 + '、' + sold.err + '）');
    const sold2 = (() => { const s = G.books['角色'].d, r = s.find(x => x[0] === '40205'), st = JSON.parse(r[1]); return require('../score/_calc.js').rpBuy([], Object.assign(st, { bc: 99999, bx: 99999 }), 's0713', Date.now(), 5); })();
    if (sold2.err !== 'sold') E.push(tag + '：伺服器 規則：5 個 換完 還 買得到（' + sold2.err + '）');
    if (require('../score/_calc.js').rpBuy([], { bc: 99999, bx: 99999 }, 's0804', Date.UTC(2026, 10, 1, 1), 0).err !== 'end') E.push(tag + '：伺服器 規則：11 月 1 日 還 買得到 限時');
    /* 全班獎勵＋👑 冠軍寶箱：同一個 編號 只發 一次；開 寶箱 ＝ 動畫＋金幣或寶物 */
    const g1 = G.post({ a: 'rpgw', pw: 'pw-verify', list: [{ id: '40205', c: 100, x: 50, chest: 1, k: 'wk|t|402' }] }), g2 = G.post({ a: 'rpgw', pw: 'pw-verify', list: [{ id: '40205', c: 100, x: 50, chest: 1, k: 'wk|t|402' }] });
    if (g1.n !== 1 || g2.skip !== 1) E.push(tag + '：全班獎勵 發兩次 沒有 擋（' + JSON.stringify([g1, g2]) + '）');
    if (G.post({ a: 'rpgw', pw: 'xx', list: [] }).err !== 'pw') E.push(tag + '：全班獎勵 沒有 老師密碼 也 發得出去');
    /* 寵物 長大：零食 ＋3 天 ➜ 重新 打開 ＝ 長大 動畫；金幣 變多 ➜ 金幣 飛進去 */
    G.post({ a: 'rpgb', pw: 'pw-verify', room: '7790', t0: Date.now(), list: [{ id: '40205', c: 50, snack: 3 }] });
    await p.reload(); await p.waitForTimeout(2200);
    const ev = await p.evaluate(() => ({ evo: !!document.querySelector('.fxov.evo'), coin: !!document.querySelector('.fxcoins .cnI'), ch: !!document.getElementById('chOpen') }));
    if (!ev.evo || !ev.coin || !ev.ch) E.push(tag + '：長大動畫 ' + ev.evo + '、金幣 飛 ' + ev.coin + '、寶箱 按鈕 ' + ev.ch);
    await p.evaluate(() => { document.querySelectorAll('.fxov').forEach(o => o.remove()); }); await p.waitForTimeout(1200);
    const ch0 = await p.evaluate(() => RV.ch); await p.click('#chOpen'); await p.waitForTimeout(800);   /* 2026-10-20 第十五次：上週前 5 名 自動 多 1 個 ➜ 開一個 ＝ 少一個 */
    const co = await p.evaluate(() => ({ ov: !!document.querySelector('.fxov.chs'), pr: (document.querySelector('.fxprize') || {}).innerHTML || '', ch: RV.ch, chl: RV.st.chl.length }));
    if (!co.ov || !co.pr || co.ch !== ch0 - 1 || co.chl !== 1) E.push(tag + '：開 冠軍寶箱 不對 ' + JSON.stringify(co).slice(0, 90));
    await p.evaluate(() => { document.querySelectorAll('.fxov').forEach(o => o.remove()); });
    /* 👾 做完練習 打怪（最後一幕；伺服器算好的 f）：怪物、血條掉、打倒 ＝ 淨化、金幣 數到 gc */
    const fg = await p.evaluate(async () => { const G = { h: 'b02', p: 'p03', w: 'w03', s: {}, gx: 10, gc: 7, coins: 120, xp: 300, lv: 5, lv0: 5, lvAt: 256, lvNext: 400,
        f: { hits: 6, d: 12, pd: 5, from: { i: 0, m: 'p16', hp: 20, max: 80 }, to: { i: 1, m: 'p22', hp: 42, max: 120 }, kill: ['p16'] } };
      const d = document.createElement('div'); d.id = 'scn'; d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center'; d.innerHTML = scHeroHTML(G); document.body.appendChild(d);
      const s0 = SCSRC; SCSRC = 'home'; scHeroGo(G); const o = { mon: 0, pure: 0, nm: 0, d3: 0, cv3: 0, sb: !!d.querySelector('#scSnd') }; for (let i = 0; i < 90; i++) { await new Promise(r => setTimeout(r, 150)); if (d.querySelector('#shFight.d3m')) o.d3 = 1; if (d.querySelector('canvas.d3cv')) o.cv3 = 1; if (d.querySelector('.fxmon img')) o.mon = 1; if (d.querySelector('.fxpure')) o.pure = 1; if (d.querySelector('.fxname')) o.nm = 1;
        if (document.getElementById('shGc').textContent === '＋7') break; }
      o.hp = (d.querySelector('.fxhp span') || {}).textContent; o.gc = document.getElementById('shGc').textContent; o.tot = document.getElementById('shTot').textContent; o.t = d.querySelector('.shfl').textContent; d.remove(); SCSRC = s0; return o; });
    if (!fg.d3 || !fg.cv3 || fg.sb) E.push(tag + '：做完練習 最後一幕 不是 3D（或 還有 音效 按鈕）' + JSON.stringify(fg));
    if (!fg.mon || !fg.pure || !fg.nm || fg.hp !== '❤ 78 ／ 120' || fg.gc !== '＋7' || fg.tot !== '120' || !/答對 6 題 ＝ 打 6 下/.test(fg.t)) E.push(tag + '：做完練習 打怪 不對 ' + JSON.stringify(fg));
    /* 👾 怪物圖鑑 */
    await p.click('#tabs [data-t="s"]'); await p.waitForTimeout(200);
    if ((await p.evaluate(() => document.querySelectorAll('.monset > div').length)) !== 15) E.push(tag + '：👾 怪物圖鑑 不是 15 隻');
    /* ══ 2026-10-20 第十五次：舊寶物圖、活起來、音效開關、全部合體、三章秒懂動畫、戰力階級 ══ */
    await p.click('#tabs [data-t="t"]'); await p.waitForTimeout(400);
    const tr = await p.evaluate(() => [].map.call(document.querySelectorAll('#shop .it img'), i => (i.complete && i.naturalWidth > 0 ? 1 : 0) + '|' + /tre\/t\d\d\.(svg|jpg)$/.test(i.getAttribute('src'))));
    if (tr.length !== 10 || tr.some(x => x !== '1|true')) E.push(tag + '：舊寶物 10 種 的 圖 不對 ' + tr.join(','));
    await p.click('#tabs [data-t="h"]'); await p.waitForTimeout(300);
    /* 2026-10-20 第十六次：眨眼／眼睛閃光／^^ 拿掉、音效 全部 拿掉、立體 3D 舞台 */
    const d3 = await p.evaluate(async () => { const m = document.getElementById('mfr'), t = m.querySelector('.team'), w = document.getElementById('wcard'), cs = getComputedStyle(m), ts = getComputedStyle(t);
      const tr0 = t.style.transform, rw0 = getComputedStyle(w).rotate; await new Promise(r => setTimeout(r, 1200)); const tr1 = t.style.transform, rw1 = getComputedStyle(w).rotate;
      let lit = 0; m.querySelectorAll('canvas.d3cv').forEach(c => { const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < d.length; i += 64) if (d[i] > 20) lit++; });
      return { lid: document.querySelectorAll('.lid,.lfo,.gl').length, snd: typeof RPSND, sb: !!document.getElementById('sndB'), d3: m.classList.contains('d3'), per: cs.perspective, pr: ts.transformStyle,
        cv: m.querySelectorAll('canvas.d3cv').length, mv: tr0 !== tr1 && /rotateY/.test(tr1), wr: rw0 !== rw1, g: !!document.querySelector('#hcard .d3g'), lit, ray: !!m.querySelector('.d3ray') }; });
    if (d3.lid || d3.snd !== 'undefined' || d3.sb) E.push(tag + '：眨眼／音效 還沒 拿掉 ' + JSON.stringify(d3));
    if (!d3.d3 || d3.per === 'none' || d3.pr !== 'preserve-3d' || d3.cv !== 2 || !d3.mv || !d3.wr || !d3.g || d3.lit < 20 || !d3.ray) E.push(tag + '：3D 舞台 不對 ' + JSON.stringify(d3));
    if (process.env.SHOT && tag === '1024✕768') await (await p.$('#mfr')).screenshot({ path: path.join(process.env.SHOT, 'd3.png') });
    await p.click('#pcard', { force: true }); await p.waitForTimeout(800);
    const nz = await p.evaluate(() => ({ nz: document.getElementById('pcard').classList.contains('lfnz'), ht: document.querySelectorAll('.lfh').length }));
    if (!nz.nz || nz.ht < 3) E.push(tag + '：點 寵物 沒有 撒嬌（蹭過去、愛心）' + JSON.stringify(nz));
    await p.waitForTimeout(1800);
    await p.click('#atkTry'); await p.waitForTimeout(500);
    const sw = await p.evaluate(() => { const t = document.querySelector('#mfr .team'), z = /translate3d\([^,]+,[^,]+,\s*([\d.]+)px/.exec(t.style.transform); return { w: document.getElementById('wcard').classList.contains('d3ws'), h: document.getElementById('hcard').classList.contains('d3lg'), z: z ? +z[1] : 0 }; });
    if (!sw.w || !sw.h || sw.z < 40) E.push(tag + '：⚔ 3D 出招 不對（戰士 往前 衝、武器 飛出去 轉、鏡頭 衝近）' + JSON.stringify(sw));
    if (process.env.SHOT && tag === '1024✕768') { await p.waitForTimeout(500); await (await p.$('#mfr')).screenshot({ path: path.join(process.env.SHOT, 'd3atk.png') }); }
    await p.waitForTimeout(2500);
    const cbb = await p.evaluate(() => { const b = document.getElementById('cbGo'); if (!b) return null; const r = b.getBoundingClientRect(), m = document.getElementById('mfr').getBoundingClientRect(); return { h: r.height, below: r.top >= m.bottom - 2, t: b.textContent }; });
    if (!cbb || cbb.h < 56 || !cbb.below || !/全部 合體 出招/.test(cbb.t)) E.push(tag + '：〔🌟 全部 合體 出招！〕不在 大方框 下面 ' + JSON.stringify(cbb));
    if (process.env.SHOT && tag === '1024✕768') await p.exposeFunction('__SHOTCB', async () => { await p.screenshot({ path: path.join(process.env.SHOT, 'combo.png') }); });
    await p.click('#cbGo');
    const cb = await p.evaluate(async () => { const o = { ov: 0 }; for (let i = 0; i < 60; i++) { const x = document.querySelector('.lfcb'); if (x) { o.ov = 1; o.cv = Math.max(o.cv || 0, x.querySelectorAll('canvas').length); if (x.classList.contains('s-end')) { await new Promise(r => setTimeout(r, 1400)); o.n = (document.getElementById('cbn') || {}).textContent; o.pw = RV.power.toLocaleString(); o.h = !!x.querySelector('.cbh img'); o.w = !!x.querySelector('.cbw'); o.p = !!x.querySelector('.cbpet img'); o.ms = i * 200; break; } } await new Promise(r => setTimeout(r, 200)); }
      if (window.__SHOTCB) await window.__SHOTCB();
      const ok = document.querySelector('.lfcb .cbok'), r = ok ? ok.getBoundingClientRect() : null; o.ok = !!r && r.bottom <= innerHeight && r.right <= innerWidth && r.height >= 56; if (ok) ok.click(); await new Promise(r => setTimeout(r, 600)); o.gone = !document.querySelector('.lfcb'); return o; });
    if (!cb.ov || cb.n !== cb.pw || !cb.h || !cb.w || !cb.p || cb.cv < 1 || !cb.ok || !cb.gone || cb.ms > 9000) E.push(tag + '：🌟 全部 合體 不對 ' + JSON.stringify(cb));
    /* 戴上 新東西 ➜ 自動 演 一次（老師 C17 第 4 題 C） */
    await p.evaluate(() => { window.__NOCB = 0; }); await p.click('#tabs [data-t="t"]'); await p.waitForTimeout(200);
    const own1 = await p.evaluate(() => { const x = RV.st.own.t[0]; return x || ''; });
    if (own1) { await p.click('#shop [data-id="' + own1 + '"]'); await p.waitForTimeout(1500); if (!(await p.evaluate(() => RV.st.eq.t.indexOf(RV.st.own.t[0]) >= 0))) { await p.click('#shop [data-id="' + own1 + '"]'); await p.waitForTimeout(1500); }
      if (!(await p.$('.lfcb'))) E.push(tag + '：戴上 新寶物 沒有 自動 演〔全部 合體〕'); await p.evaluate(() => { document.querySelectorAll('.lfcb').forEach(o => o.remove()); window.__NOCB = 1; }); }
    else E.push(tag + '：量測 沒有 買到 寶物（量不到 自動 合體）');
    if (snd.length) E.push(tag + '：還有 聲音 檔 ' + snd.slice(0, 2).join('、'));
    /* ❓ 三章 秒懂 動畫（老師第 2、4、6、7 點） */
    await p.click('#tabs [data-t="h"]'); await p.waitForTimeout(200); await p.click('[data-go="qb"]'); await p.waitForTimeout(400);
    const tu = await p.evaluate(() => ({ ch: document.querySelectorAll('.tch button').length, on: (document.querySelector('.tch button.on') || {}).textContent, sc: document.querySelectorAll('#tst .tsc').length, a: !!document.querySelector('#tst .tsc.on') }));
    if (tu.ch !== 4 || !/戰力 是 什麼/.test(tu.on || '') || tu.sc !== 4 || !tu.a) E.push(tag + '：〔❓ 戰力〕沒有 打開 第 2 章 ' + JSON.stringify(tu));
    for (const [k, nsc] of [['a', 10], ['b', 4], ['c', 5], ['r', 9]]) { await p.click('[data-tch="' + k + '"]'); await p.waitForTimeout(300);
      const c1 = await p.evaluate(() => ({ n: document.querySelectorAll('#tst .tsc').length, i: [].indexOf.call(document.querySelectorAll('#tst .tsc'), document.querySelector('#tst .tsc.on')) }));
      await p.waitForTimeout(7900); const c2 = await p.evaluate(() => [].indexOf.call(document.querySelectorAll('#tst .tsc'), document.querySelector('#tst .tsc.on')));
      if (process.env.SHOT && tag === '1024✕768') { await p.waitForTimeout(2600); await (await p.$('.tut')).screenshot({ path: path.join(process.env.SHOT, 'ch_' + k + '.png') }); }
      if (c1.n !== nsc || c1.i !== 0 || c2 !== 1) E.push(tag + '：第 ' + k + ' 章 動畫 不對 ' + JSON.stringify([c1, c2]));
      const ov = await p.evaluate(() => { const t = document.getElementById('tst'), r = t.getBoundingClientRect(); let o = 0; t.querySelectorAll('.tsc.on .cap, .tsc.on .vis > *').forEach(x => { const q = x.getBoundingClientRect(); if (q.width && (q.left < r.left - 2 || q.right > r.right + 2)) o++; }); return o; });
      if (ov) E.push(tag + '：第 ' + k + ' 章 有東西 超出 畫面（' + ov + '）'); }
    /* 第十六次 老師第 4 點：〔⏸ 暫停〕＝ 停在 這一幕；〔下一幕 ▶〕〔◀ 上一幕〕；按鈕 夠大 */
    await p.click('[data-tch="a"]'); await p.waitForTimeout(300);
    const cur = () => p.evaluate(() => [].indexOf.call(document.querySelectorAll('#tst .tsc'), document.querySelector('#tst .tsc.on')));
    const bz = await p.evaluate(() => ['tPause', 'tPrev', 'tNext'].map(i => { const r = document.getElementById(i).getBoundingClientRect(); return Math.round(Math.min(r.height, r.width)); }));
    if (bz.some(x => x < 60)) E.push(tag + '：〔⏸ 暫停〕〔◀〕〔▶〕太小 ' + bz.join(','));
    await p.click('#tPause'); await p.waitForTimeout(8600);
    const pz1 = await cur(), pzt = await p.evaluate(() => ({ t: document.getElementById('tPause').textContent, r: document.getElementById('tst').classList.contains('pz') }));
    if (pz1 !== 0 || !/繼續/.test(pzt.t) || !pzt.r) E.push(tag + '：〔⏸ 暫停〕8 秒 以後 還是 換了 一幕 ' + JSON.stringify([pz1, pzt]));
    await p.click('#tNext'); await p.waitForTimeout(300); const pz2 = await cur(); await p.click('#tNext'); await p.waitForTimeout(200); await p.click('#tPrev'); await p.waitForTimeout(300); const pz3 = await cur();
    await p.waitForTimeout(3000); const pz4 = await cur();
    if (pz2 !== 1 || pz3 !== 1 || pz4 !== 1) E.push(tag + '：〔下一幕 ▶〕〔◀ 上一幕〕不對（暫停 中 要 停住）' + [pz2, pz3, pz4].join(','));
    await p.click('#tPause'); await p.waitForTimeout(7900); if ((await cur()) !== 2) E.push(tag + '：〔▶ 繼續〕以後 沒有 自己 換 下一幕');
    for (let i = 0; i < 10; i++) { await p.click('[data-tut="' + i + '"]'); await p.waitForTimeout(2900);
      if (process.env.SHOT && tag === '1024✕768') await (await p.$('.tut')).screenshot({ path: path.join(process.env.SHOT, 'ch_a_' + (i + 1) + '.png') });
      const ovA = await p.evaluate(() => { const t = document.getElementById('tst'), r = t.getBoundingClientRect(); let o = []; t.querySelectorAll('.tsc.on .cap, .tsc.on .vis *').forEach(x => { const q = x.getBoundingClientRect(); if (q.width && (q.left < r.left - 2 || q.right > r.right + 2 || q.bottom > r.bottom + 2)) o.push(x.className || x.tagName); }); return o; });
      if (ovA.length) E.push(tag + '：第 a 章 第 ' + (i + 1) + ' 幕 超出 ' + ovA.slice(0, 3).join(',')); }
    /* ⚔ 戰力階級：戰力 數字 下面 寫 下一階 */
    await p.click('#tabs [data-t="h"]'); await p.waitForTimeout(200);
    const pw = await p.evaluate(() => ({ t: document.querySelector('.powT').textContent, tb: !!document.querySelector('.powT .tbI'), tier: RV.tier, v: RV.power }));
    if (pw.tier ? !pw.tb : !/再 [\d,]+ ➜ 青銅/.test(pw.t)) E.push(tag + '：⚔ 戰力 那一格 沒有 階級／下一階 ' + JSON.stringify(pw));
    n += 14;
    if (bad.length) E.push(tag + '：載不到 ' + bad.slice(0, 3).join('、'));
    n += 52; await ctx.close();
  }
  await br.close(); srv.close();
  E.forEach(x => console.log('✗ ' + x));
  console.log('戰神之路 量測 ' + n + ' 項，' + E.length + ' 個失敗');
  process.exit(E.length ? 1 : 0);
})();
