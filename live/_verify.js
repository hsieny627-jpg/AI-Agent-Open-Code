/* live/_verify.js — ⚡ 現場任務 量測：老師大螢幕＋3 台學生平板真的玩一場
 *   node live/_verify.js        只印失敗項和一行總結
 * 假的 Firebase：這一支自己開一台小伺服器（REST 讀寫＋串流，跟 Firebase 一樣的格式），網頁的 LIVE_DB 指到它；**絕對不連真的 Firebase**。
 * 假的成績系統：score/_gas_stub.js 跑真的 Code.gs（老師密碼、我的英雄、發獎勵），**絕對不送到真的成績表**。
 * 量：密碼、開房間（大大的 4 碼）、學生打號碼加入（別班進不去）、一題一題（答對 ✅、答錯 ❌、大螢幕血條變少）、干擾（≦ 3 秒、演完送 🛡）、
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
  await ctx.route(/script\.google\.com|firebaseio\.com|firebasedatabase\.app/, r => r.abort());
  return ctx;
}
const sizes = (p, min) => p.evaluate(min => { const sm = [].filter.call(document.querySelectorAll('body *'), x => { const r = x.getBoundingClientRect(); if (!r.width || x.closest('#scbar,.pls,.rk5,.lanes,.dt,.sfr,.tc,.fxb,.goth')) return false;
    return [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(x).fontSize) < min; }).map(x => x.textContent.trim().slice(0, 12));
  const low = [].filter.call(document.querySelectorAll('button:not(#scbar button),a.ghost,a.big'), x => { const r = x.getBoundingClientRect(); return r.width && r.height < 48; }).map(x => x.textContent.trim().slice(0, 10));
  return { sm, low, ox: document.documentElement.scrollWidth - innerWidth }; }, min);
(async () => {
  const srv = await serve(), br = await chromium.launch();
  for (const HV of [[1920, 1080], [1024, 768]]) {
    DB = {}; const G = make({ TEACHER_PW: PW }), tag = '大螢幕 ' + HV.join('✕');
    /* 01 有英雄（★1 b01＋寵物 p03），02、03 沒有 */
    G.post({ a: 'rpg', id: '40201', op: 'buy', item: 'b01' }); G.post({ a: 'rpg', id: '40201', op: 'buy', item: 'p03' });
    const hc = await ctxOf(br, G, HV), h = await hc.newPage(); h.on('pageerror', x => E.push(tag + ' JS 錯誤：' + x.message));
    await h.goto(HTTP + '/live/host.html'); await h.waitForTimeout(300);
    await h.fill('#pw', 'wrong'); await h.click('#pwgo'); await h.waitForTimeout(300);
    if (!/不對/.test(await h.textContent('#pwm'))) E.push(tag + '：密碼錯 沒有擋');
    await h.fill('#pw', PW); await h.click('#pwgo'); await h.waitForTimeout(300);
    if (await h.isHidden('#hset')) { E.push(tag + '：密碼對了 進不去'); continue; }
    const st = await sizes(h, HV[0] >= 1900 ? 24 : 19); if (st.sm.length || st.low.length || st.ox > 1) E.push(tag + ' 設定頁：字太小 ' + st.sm.slice(0, 3).join('、') + '／按鈕太矮 ' + st.low.slice(0, 3).join('、') + '／左右捲 ' + st.ox);
    if ((await h.$$('[data-sk]')).length !== 10) E.push(tag + '：任務不是 10 種');
    await h.click('[data-sg="4"]'); await h.click('[data-sc="402"]'); await h.click('[data-sk="boss"]'); await h.click('[data-sb="0"]'); await h.click('[data-sn="10"]'); await h.click('#mk'); await h.waitForTimeout(600);
    const code = (await h.textContent('#code')).trim(), cfs = await h.evaluate(() => parseFloat(getComputedStyle(document.getElementById('code')).fontSize));
    await shot(h, 'lobby_' + HV[0]);
    if (!/^\d{4}$/.test(code) || cfs < 100) E.push(tag + '：房間號碼不是 4 碼大字（' + code + '、' + cfs + 'px）');
    /* 學生：01（iPad 橫）、02（iPad 直）、03（iPad 橫）、別班 40601 */
    const S = [];
    for (const [id, vp] of [['40201', [1024, 768]], ['40202', [820, 1180]], ['40203', [1024, 768]], ['40601', [1024, 768]]]) {
      const c = await ctxOf(br, G, vp, id), p = await c.newPage(); p.on('pageerror', x => E.push(id + ' JS 錯誤：' + x.message));
      await p.goto(HTTP + '/live/index.html'); await p.waitForTimeout(1200);
      if (await p.isHidden('#scode')) { E.push(id + '：登入以後沒有「輸入房間號碼」'); }
      for (const ch of code) await p.click('[data-ck="' + ch + '"]');
      await p.waitForTimeout(1200); S.push({ id, p, c, vp });
    }
    const wrongCls = await S[3].p.textContent('#cmsg'); if (!/402 班/.test(wrongCls)) E.push('別班（406）可以進 402 的房間：' + wrongCls);
    await S[3].c.close(); S.pop();
    await h.waitForTimeout(500);
    if ((await h.textContent('#lcnt')).trim() !== '3') E.push(tag + '：大螢幕 沒有 看到 3 個人加入（' + (await h.textContent('#lcnt')) + '）');
    if (!(await h.$('#lpl img'))) E.push(tag + '：有英雄的人，大螢幕 沒有 英雄圖');
    for (const s of S) { if (await s.p.isHidden('#swait')) E.push(s.id + '：加入以後 沒有「等老師開始」'); }
    const sz = await sizes(S[1].p, 20); if (sz.sm.length || sz.low.length || sz.ox > 1) E.push('學生（直）等待頁：字太小 ' + sz.sm.slice(0, 3).join('、') + '／按鈕 ' + sz.low.join('、') + '／左右捲 ' + sz.ox);
    await h.click('#go'); await h.waitForTimeout(900);
    const ans = () => h.evaluate(() => H.Q[H.qi].a);
    let hp0 = await h.evaluate(() => H.gs.hp);
    for (let qi = 0; qi < 10; qi++) {
      const a = await ans();
      for (const s of S) await s.p.waitForSelector('#sq:not([hidden]) .so', { timeout: 5000 }).catch(() => E.push(s.id + '：第 ' + (qi + 1) + ' 題 沒有出現'));
      if (qi === 0) { const q0 = await sizes(S[0].p, 20); if (q0.sm.length || q0.low.length || q0.ox > 1) E.push('學生 題目：字太小 ' + q0.sm.slice(0, 3).join('、') + '／按鈕 ' + q0.low.join('、') + '／左右捲 ' + q0.ox);
        const qh = await sizes(h, HV[0] >= 1900 ? 24 : 19); if (qh.sm.length || qh.ox > 1) E.push(tag + ' 題目：字太小 ' + qh.sm.slice(0, 3).join('、') + '／左右捲 ' + qh.ox); }
      if (qi === 2) { /* 干擾（大螢幕自動送；這裡直接叫它，量學生那邊） */
        await h.evaluate(() => { clearTimeout(H.tm2); fxSend(); }); await S[2].p.waitForTimeout(400);
        const f1 = await S[2].p.evaluate(() => ({ on: document.getElementById('fxo').classList.contains('on'), t: document.getElementById('fxo').textContent }));
        if (!f1.on || !/打噴嚏/.test(f1.t)) E.push('干擾：魔王打噴嚏 沒有 出現在 學生 平板');
        await S[2].p.waitForTimeout(2600); const f2 = await S[2].p.evaluate(() => ({ on: document.getElementById('fxo').classList.contains('on'), sh: !!S.pend.shield }));
        if (f2.on || !f2.sh) E.push('干擾：3 秒內 沒有 消失、或 沒有 送 🛡' + JSON.stringify(f2) + JSON.stringify(f1).slice(0, 60)); }
      if (qi === 5) { /* 01 這時候有一次 🎮 抽獎 ➜ 直接選 ✂ 刪掉 2 個（量 下一題 真的 少 2 個） */ }
      const cut = qi === 5 ? await S[0].p.evaluate(() => document.querySelectorAll('#sqo .so.cut').length) : -1;
      if (qi === 5 && cut !== 2) E.push('🎮 ✂ 刪掉 2 個：下一題 沒有 真的 刪掉 2 個（' + cut + '）');
      for (const s of S.slice(1)) if (await s.p.evaluate(() => document.getElementById('gift').classList.contains('on'))) { await s.p.click('[data-gk="r"]').catch(() => {}); await s.p.click('#gift .bx').catch(() => {}); await s.p.click('[data-gok]').catch(() => {}); }
      await S[0].p.click('#sqo [data-k="' + a + '"]');
      await S[1].p.click('#sqo [data-k="' + (qi === 0 ? (a + 1) % 4 : a) + '"]');
      await S[2].p.click('#sqo [data-k="' + (qi % 3 ? a : (a + 2) % 4) + '"]');
      await h.waitForTimeout(800);
      const r0 = await S[0].p.textContent('#sqr'), r1 = await S[1].p.textContent('#sqr');
      if (!/答對/.test(r0)) E.push('第 ' + (qi + 1) + ' 題：答對的 沒有 ✅（' + r0.slice(0, 20) + '）');
      if (qi === 0 && !/答錯/.test(r1)) E.push('第 1 題：答錯的 沒有 ❌');
      if (qi === 0) { await shot(h, 'hq_' + HV[0]); await shot(S[0].p, 'sq_' + HV[0]); await shot(S[1].p, 'sqv_' + HV[0]); }
      if (qi === 0) { const hp1 = await h.evaluate(() => H.gs.hp); if (!(hp1 < hp0)) E.push(tag + '：答對了 魔王 血條 沒有 變少'); }
      if (qi === 4 || qi === 9) { /* 01 答對 5、10 題 ➜ 🐾 禮物盒（老師先按 ⏸ 停在這一題，量完再繼續） */
        await h.click('#hp');
        await S[0].p.waitForTimeout(1200);
        const g = await S[0].p.evaluate(() => ({ on: document.getElementById('gift').classList.contains('on'), t: document.getElementById('gift').textContent, pet: !!document.querySelector('#gift .gpi') }));
        if (!g.on || !/寵物/.test(g.t) || !g.pet) E.push('答對 ' + (qi + 1) + ' 題 沒有 🐾 寵物 叼來 禮物盒');
        if (qi === 4) { await S[0].p.evaluate(() => { LV.pickN = function () { return 3; }; LV.shuf = function (a) { a = a.slice(); var i = a.map(function (x) { return x.k; }).indexOf('cut'); if (i > 0) { var t = a[0]; a[0] = a[i]; a[i] = t; } return a; }; }); await S[0].p.click('[data-gk="f"]'); }
        else await S[0].p.click('[data-gk="r"]');
        await S[0].p.waitForTimeout(500);
        const nb = await S[0].p.evaluate(() => document.querySelectorAll('#gift .bx').length);
        if (nb < 2 || nb > 5) E.push('禮物盒 不是 二～五選一（' + nb + '）');
        await shot(S[0].p, 'box' + qi + '_' + HV[0]);
        await S[0].p.click('#gift .bx[data-gi="0"]'); await S[0].p.waitForTimeout(1300); await shot(S[0].p, 'open' + qi + '_' + HV[0]);
        const o = await S[0].p.evaluate(() => ({ t: document.getElementById('gift').textContent, hero: !!document.querySelector('#gift .ghi'), say: (document.querySelector('#gift .say') || {}).textContent }));
        if (!o.hero || !o.say) E.push('打開 盒子 沒有 飛出 英雄＋說一句話');
        if (qi === 4 && !/刪掉 2 個/.test(o.t)) E.push('🎮 選的 不是 ✂ 刪掉 2 個：' + o.t.slice(0, 40));
        if (!(await S[0].p.$('[data-gok]'))) E.push('第 ' + (qi + 1) + ' 題 打開盒子以後 沒有〔👌 好〕：' + (await S[0].p.evaluate(() => document.getElementById('gift').className + '｜' + document.getElementById('gift').textContent.slice(0, 80))));
        else await S[0].p.click('[data-gok]');
        if (await h.evaluate(() => H.phase) !== 'rev') E.push('按 ⏸ 以後 大螢幕 還是 自己 換題');
        await h.click('#hp'); await h.waitForTimeout(qi === 9 ? 1500 : 900);
      } else await h.waitForTimeout(4700);
    }
    await h.waitForSelector('#hend:not([hidden])', { timeout: 8000 }).catch(() => E.push(tag + '：10 題 做完 沒有 結束畫面'));
    await h.waitForTimeout(800);
    const en = await h.evaluate(() => ({ r: document.getElementById('eres').textContent, pod: document.querySelectorAll('#epod .kp').length, rw: document.getElementById('erw').textContent }));
    if (!/魔王/.test(en.r) || en.pod !== 3 || !/1 個/.test(en.rw)) E.push(tag + '：結束畫面 不對：' + JSON.stringify(en));
    await shot(h, 'end_' + HV[0]);
    const se = await S[0].p.textContent('#send'); if (!/第 1 名|任務 完成/.test(se)) E.push('學生 結束畫面 不對：' + se.slice(0, 40));
    await h.click('#give'); await h.waitForTimeout(900);
    if (!/發好了/.test(await h.textContent('#gm'))) E.push(tag + '：〔🎁 發獎勵〕沒有 成功：' + (await h.textContent('#gm')));
    const v1 = G.get({ a: 'rpg', id: '40201' }).v, v2 = G.get({ a: 'rpg', id: '40202' }).v;
    if (!(v1.st.bx >= 10 && v1.st.bc >= 10) || !(v2.st.bc >= 9)) E.push('發獎勵：「角色」沒有 加上 經驗值、金幣：' + JSON.stringify([v1.st.bc, v1.st.bx, v2.st.bc]));
    if (!(await h.evaluate(() => document.getElementById('give').disabled))) E.push('發獎勵 可以 按 兩次');
    /* 10 種任務畫面 */
    for (const g of ['boss', 'race', 'space', 'map', 'tower', 'pet', 'shoot', 'treasure', 'surf', 'king']) {
      const r = await h.evaluate(g => { H.game = g; H.sc = { '40201': 800 }; scr('hq'); drawGame(); const el = document.getElementById('gv'), b = el.getBoundingClientRect();
        return { t: el.textContent.length, out: [].filter.call(el.querySelectorAll('*'), x => { const q = x.getBoundingClientRect(); return q.width && (q.right > b.right + 2 || q.left < b.left - 2); }).length }; }, g);
      if (r.t < 6 || r.out) E.push(tag + ' 任務畫面 ' + g + '：沒有內容 或 超出框（' + r.out + '）');
    }
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
  console.log('現場任務 量測 ' + n + ' 項，' + E.length + ' 個失敗');
  process.exit(E.length ? 1 : 0);
})();
