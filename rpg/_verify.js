/* rpg/_verify.js — 🦸 我的英雄 量測（假伺服器 score/_gas_stub.js 跑真的 Code.gs，絕對不送到真的成績表）
 *   node rpg/_verify.js        只印失敗項和一行總結；三種尺寸：iPad 橫、iPad 直、教室觸控螢幕
 * 量：沒登入 ＝ 大大的〔🔑 登入〕；登入以後：舞台（英雄空的、Lv、金幣）、免費選第一個英雄 ➜ 試算表「角色」有一列、裝上；金幣不夠／等級不夠擋下來；
 *     換裝；寶物外觀出現；🏪 商城（10 類、上架的 20 種 4 排、買光環 ➜ 戴在英雄後面、舊光環拿下來、還沒上架的「🔜」、必殺特效）；分頁 7 個都畫得出來、字 ≧ 20px、按鈕 ≧ 48px、圖都載得到、不左右捲；做完一次題目 ➜ 平板最後多一幕 🦸（經驗值、金幣） */
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { make } = require('../score/_gas_stub.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec';
const E = []; let n = 0, HTTP = '';
function serve() { return new Promise(ok => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.css': 'text/css', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp', '.png': 'image/png' };
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
    const p = await ctx.newPage(), bad = [];
    p.on('pageerror', x => E.push(tag + ' JS 錯誤：' + x.message));
    p.on('response', r => { if (r.status() >= 400 && r.url().startsWith(HTTP)) bad.push(r.url().slice(HTTP.length)); });
    await p.goto(HTTP + '/rpg/index.html'); await p.waitForTimeout(1200);
    const o0 = await p.evaluate(() => { const b = document.getElementById('rpIn'); return { out: !document.getElementById('rpout').hidden, h: b ? b.getBoundingClientRect().height : 0 }; });
    if (!o0.out || o0.h < 64) E.push(tag + '：沒登入沒有大大的〔🔑 登入〕');
    /* 2026-10-18 第十次：封面照片＋「戰神之路」；「普通」改「基本」 */
    const cv = await p.evaluate(() => { const i = document.querySelector('.cov>img'), h = document.querySelector('.cov h1'); return { ok: !!i && i.complete && i.naturalWidth > 0, h: i ? i.getBoundingClientRect().height : 0, t: h ? h.textContent : '', ti: document.title }; });
    if (!cv.ok || cv.h < 150 || !/^戰神之路/.test(cv.t) || cv.ti !== '戰神之路') E.push(tag + '：封面照片／「戰神之路」不對（' + cv.t + '，' + cv.h + 'px）');
    /* 登入（跟成績系統同一個）：直接放 5 碼＋已經確認 */
    await p.evaluate(() => { localStorage.setItem('score_last', '"40205"'); localStorage.setItem('score_id_g4', '"40205"'); localStorage.setItem('score_act', JSON.stringify(Date.now())); sessionStorage.setItem('sc_ok', '40205'); });
    await p.reload(); await p.waitForTimeout(1800);
    const s0 = await p.evaluate(() => ({ in: !document.getElementById('rpin').hidden, t: document.getElementById('stage').textContent, free: !!document.querySelector('.free'),
      fr: document.querySelectorAll('#shop .pr.fr').length, it: document.querySelectorAll('#shop .it').length }));
    if (!s0.in || !/還沒有英雄/.test(s0.t) || !/Lv \d/.test(s0.t) || !/金幣/.test(s0.t)) E.push(tag + '：登入以後舞台不對：' + s0.t.slice(0, 80));
    if (/普通/.test(await p.textContent('#rp'))) E.push(tag + '：還有「普通」（要改「基本」）');
    if (!s0.free || s0.fr !== 8 || s0.it !== 30) E.push(tag + '：英雄分頁要 30 個男生英雄、8 個寫「🎁 免費」（' + s0.it + '／' + s0.fr + '）');
    await p.click('[data-sex="g"]'); await p.waitForTimeout(150);
    const gi = await p.evaluate(() => [].map.call(document.querySelectorAll('#shop .it'), x => x.getAttribute('data-id')));
    if (gi.length !== 31 || gi.indexOf('g29') < 0 || gi.indexOf('g31') < 0) E.push(tag + '：女生英雄要 31 個（有女 29、女 31）（' + gi.length + '）');
    await p.click('[data-sex="b"]'); await p.click('#shop [data-id="b02"]'); await p.waitForTimeout(150);
    if (!/免費/.test(await p.textContent('#rpmb'))) E.push(tag + '：點 ★1 英雄沒有問「免費 選 這一個？」');
    await p.click('#rpmb [data-m="buy"]'); await p.waitForTimeout(800);
    const b1 = await p.evaluate(() => ({ c: document.getElementById('rpm').className, t: document.getElementById('rpmb').textContent, hero: !!document.querySelector('#stage .hc img') }));
    if (!/cele/.test(b1.c) || !/換到了/.test(b1.t) || !b1.hero) E.push(tag + '：免費選完沒有慶祝、舞台沒有英雄：' + b1.t.slice(0, 40));
    if (!G.books['角色'] || !/b02/.test((G.books['角色'].d[1] || [])[1] || '')) E.push(tag + '：試算表「角色」沒有存到 b02');
    await p.click('#rpmb [data-m="x"]');
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
    await p.click('#tabs [data-t="p"]'); await p.click('#shop [data-id="p03"]'); await p.click('#rpmb [data-m="buy"]'); await p.waitForTimeout(800); await p.click('#rpmb [data-m="x"]');
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
    /* ❓ 秒懂動畫：5 幕自己往下演；點按鈕跳到那一幕；金幣會數上去 */
    await p.click('#tabs [data-t="q"]'); await p.waitForTimeout(300);
    const t0 = await p.evaluate(() => ({ n: document.querySelectorAll('#tst .tsc').length, on: [].indexOf.call(document.querySelectorAll('#tst .tsc'), document.querySelector('#tst .tsc.on')) }));
    await p.waitForTimeout(5000); const t1 = await p.evaluate(() => [].indexOf.call(document.querySelectorAll('#tst .tsc'), document.querySelector('#tst .tsc.on')));
    if (process.env.SHOT && tag === '1024✕768') for (let i = 0; i < 5; i++) { await p.click('.tnav [data-tut="' + i + '"]'); await p.waitForTimeout(3600); await (await p.$('.tut')).screenshot({ path: path.join(process.env.SHOT, 'tut' + i + '.png') }); }
    await p.click('.tnav [data-tut="2"]'); await p.waitForTimeout(2600); const tc = await p.evaluate(() => (document.getElementById('tcn') || {}).textContent);
    const tf = await p.evaluate(() => { const r = document.getElementById('tst').getBoundingClientRect(); return [].filter.call(document.querySelectorAll('#tst .tsc.on .cap,#tst .tsc.on .tchips span,#tst .tsc.on .tcoin'), x => { const b = x.getBoundingClientRect(); return b.left < r.left - 1 || b.right > r.right + 1 || b.bottom > r.bottom + 1; }).length; });
    if (t0.n !== 5 || t0.on !== 0 || t1 !== 1 || tc !== '14' || tf) E.push(tag + '：❓ 動畫不對（' + t0.n + ' 幕、一開始第 ' + t0.on + '、5 秒後第 ' + t1 + '、金幣 ' + tc + '、跑出框 ' + tf + '）');
    await p.click('#tabs [data-t="h"]');
    /* 🏪 商城：老師發 600 金幣（現場任務獎勵）➜ 買 ✨ 覺醒光環 01（500） */
    G.post({ a: 'rpgb', pw: 'pw-verify', room: '7777', t0: Date.now(), list: [{ id: '40205', c: 600, x: 0, tre: ['t01'] }] });
    for (const r of ['7778', '7779']) G.post({ a: 'rpgb', pw: 'pw-verify', room: r, t0: Date.now(), list: [{ id: '40205', c: 500, x: 0 }] });   /* 一次最多 500：再發兩次，才買得起背景、名字框 */
    await p.reload(); await p.waitForTimeout(1800); await p.click('#tabs [data-t="m"]'); await p.waitForTimeout(200);
    const m0 = await p.evaluate(() => ({ cat: document.querySelectorAll('.scat button').length, soon: document.querySelectorAll('.scat button.soon').length, it: document.querySelectorAll('#shop .it').length,
      rows: [].map.call(document.querySelectorAll('.srow'), x => x.textContent), halo: !!document.querySelector('#stage .halo') }));
    if (m0.cat !== 10 || m0.soon !== 5 || m0.it !== 20 || m0.rows.length !== 4 || !/500/.test(m0.rows[0]) || !/1,200.*Lv 5/.test(m0.rows[1]) || !/2,500.*Lv 10/.test(m0.rows[2]) || !/5,000.*Lv 20.*學霸/.test(m0.rows[3]))
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
    const ak = await p.evaluate(() => { const b = document.querySelector('#stage .slash b'); return { t: b ? b.textContent : '', d: 10 + Math.min(20, Math.floor(RV.power / 100)) }; });
    if (ak.t !== '💥 ' + ak.d) E.push(tag + '：〔⚔ 出招！〕沒有演出一擊 ' + ak.d + '（' + ak.t + '）');
    await p.waitForTimeout(1500);
    if (!m1.au || m1.halo || !m1.eq || m1.st !== 's0101') E.push(tag + '：買了光環：英雄後面 ' + (m1.au ? '有' : '沒有') + ' 新光環、舊光環 ' + (m1.halo ? '還在' : '拿下來') + '、卡片 ' + (m1.eq ? '裝備中' : '沒寫裝備中'));
    if (process.env.SHOT) { await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: path.join(process.env.SHOT, 'rpg_' + tag + '.png'), fullPage: true }); }   /* SHOT=資料夾 拍照看樣子 */
    if (!G.books['角色'] || !/s0101/.test(G.books['角色'].d[1][1])) E.push(tag + '：試算表「角色」沒有存到 s0101');
    await p.click('#shop [data-id="s0101"]'); await p.waitForTimeout(900);
    if (await p.$('#stage .rw-au')) E.push(tag + '：再點一下 沒有 拿下來');
    /* 2026-10-18 第十次：上架的 5 類 ✕ 20 種，商店卡、穿在身上的圖都載得到；買背景 ➜ 舞台換底圖、買名字框 ➜ 圍住號碼 */
    const miss = await p.evaluate(async () => { const o = []; for (const c of [1, 2, 3, 4, 5]) for (let n = 1; n <= 20; n++) { const id = 's0' + c + (n < 10 ? '0' : '') + n;
      for (const x of ['.jpg', 'i.webp']) { const r = await fetch('shop/' + id + x); if (!r.ok) o.push(id + x); } } return o; });
    if (miss.length) E.push(tag + '：商城圖載不到 ' + miss.slice(0, 4).join('、'));
    for (const id of ['s0501', 's0401']) { await p.click('[data-scat="' + id[2] + '"]'); await p.waitForTimeout(150); await p.click('#shop [data-id="' + id + '"]'); await p.waitForTimeout(150);
      await p.click('#rpmb [data-m="buy"]'); await p.waitForTimeout(1000); await p.click('#rpmb [data-m="x"]'); await p.waitForTimeout(300); }
    const w2 = await p.evaluate(() => ({ bg: /s0501i\.webp/.test(document.getElementById('stage').getAttribute('style') || ''), nf: !!document.querySelector('#stage .idl .rw-nf[src*="s0401i"]') }));
    if (!w2.bg || !w2.nf) E.push(tag + '：買了背景／名字框 沒有穿上（背景 ' + w2.bg + '、名字框 ' + w2.nf + '）');
    await p.click('[data-scat="6"]'); await p.waitForTimeout(150);
    if (!/即將 上架/.test(await p.textContent('#shop'))) E.push(tag + '：寵物專屬服裝 沒有寫「🔜 即將 上架」');
    await p.evaluate(() => rwFx('../', 's0101')); await p.waitForTimeout(300);
    const fx = await p.evaluate(() => { const o = document.querySelector('.rw-fx img'); return !!o && o.complete && o.naturalWidth > 0; });
    await p.waitForTimeout(1500); if (!fx || await p.$('.rw-fx')) E.push(tag + '：💥 必殺特效 沒有出現或沒有消失');
    if (bad.length) E.push(tag + '：載不到 ' + bad.slice(0, 3).join('、'));
    n += 38; await ctx.close();
  }
  await br.close(); srv.close();
  E.forEach(x => console.log('✗ ' + x));
  console.log('戰神之路 量測 ' + n + ' 項，' + E.length + ' 個失敗');
  process.exit(E.length ? 1 : 0);
})();
