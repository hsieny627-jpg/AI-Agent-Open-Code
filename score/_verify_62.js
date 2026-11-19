/* score/_verify_62.js — 2026-11-19 第六十二次 老師 6：〔🔎 找 成績〕班級 最近 成績＋✍️ 字母 書寫 截圖 分析（假 伺服器＋假 資料，絕對 不 送 真的 成績表）
 *   ① 伺服器 留 得 住 寫字 題 的 筆畫（第 8 格）、沒有 原因 ＝ ~w ② 班級 按鈕 307 ＝ 現場／回家 兩欄 都 有 ③ 打開 任務 ＝ 全班 整體 表現、全班 錯題 排行、〔🔍 錯題〕個人
 *   ④〔✍️ 字母 書寫 截圖 分析〕＝ 每 一題 一顆、正確 寫法 動畫、每 一位 學生 一張 截圖、點 ＝ 放大 重播；不 超出 畫面　node score/_verify_62.js */
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const { make } = require('./_gas_stub.js'), HW = require('../g3mid/_hw.js').HW;
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec', PW = 'pw-v62';
let n = 0; const bad = []; const ok = (c, m) => { n++; if (!c) bad.push(m); };
const SKC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', C = v => SKC[Math.max(0, Math.min(61, Math.round(v)))];
const enc = sk => sk.map(st => st.map(p => C(p[0] / 3.4 * 61) + C((p[1] + .25) / 3.5 * 61)).join('')).join(',');
const tpl = (ch, dy) => HW.T[ch][0].map(s => s.map(p => [p[0] + 1.1, p[1] + (dy || 0)]));
function qOne(s, i) { const LW = 'ABCDEFGHIJ', good = i < 4 + (s % 3), ch = LW[i], q = [good ? 1 : 0, good ? 0 : 1, 6, 0, .5, i];
  if (!good) q.push(s % 2 ? '~line' : '~draw'); else q.push(null);
  q.push('*' + ch + ':' + enc(tpl(ch, good ? 0 : .5)) + '/' + ch.toLowerCase() + ':' + enc(tpl(ch.toLowerCase()))); if (q[6] === null) q[6] = 0; return q; }
(async () => {
  const G = make({ TEACHER_PW: PW }), now = Date.now(); let u = 0;
  for (let s = 1; s <= 6; s++) { const id = '307' + String(s).padStart(2, '0'); G.books['名單'].d.push(['307', s, '測試' + s]);
    G.post({ a: 'rec', r: { id, set: 'g3gm_lw-q5', name: '✍️ 字母 書寫', m: 'q', raw: 0, src: 'school', dev: 'x', u: 'u' + (u++), t: now - 3e5 + s * 1e3, qs: Array.from({ length: 10 }, (_, i) => qOne(s, i)) } });
    G.post({ a: 'rec', r: { id, set: 'g3gm_ph-sd1', name: '🔤 自然發音｜44 音 2', m: 'q', raw: 0, src: 'home', dev: 'x', u: 'u' + (u++), t: now - 6e5 + s * 1e3, qs: Array.from({ length: 5 }, (_, i) => [i < 3 ? 1 : 0, i < 3 ? 0 : 1, 5, 0, .5, i]) } }); }
  const raw = JSON.stringify(G.books); ok(/\*A:/.test(raw) && /~w/.test(raw) && /~line/.test(raw), '伺服器 沒有 留住 筆畫／~w');
  const srv = require('http').createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript' }[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(o => srv.listen(0, '127.0.0.1', o));
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180]]) { const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/firebase|googleapis|gstatic/, r => r.abort());
    await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); }, URL0);
    await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams);
      const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
      await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', x => errs.push(x.message));
    await p.goto('http://127.0.0.1:' + srv.address().port + '/teacher/index.html'); await p.fill('#pw', PW); await p.click('#go'); await p.waitForTimeout(1200);
    ok(await p.$('[data-scls="307"]'), tag + ' 沒有 班級 按鈕 307'); await p.click('[data-scls="307"]'); await p.waitForTimeout(500);
    const L = await p.$$eval('.sCol.L .sT', a => a.length), Hm = await p.$$eval('.sCol.H .sT', a => a.length); ok(L >= 1 && Hm >= 1, tag + ' 307 現場／回家 沒有 都 出來 ' + L + '/' + Hm);
    await p.click('.sCol.L .sT.big'); await p.waitForTimeout(500); const mb = await p.textContent('#mbox');
    ok(/全班 整體 表現/.test(mb) && /全班 錯題 排行榜/.test(mb) && (await p.$$('#mbox .wq')).length >= 3, tag + ' 任務 沒有 整體 表現／錯題 排行');
    await p.click('[data-sper="30701"]'); await p.waitForTimeout(400); ok(/307 班 1 號/.test(await p.textContent('#sPerW')) && (await p.$$('#sPerW .wq')).length >= 1, tag + ' 個人 錯題 沒 出來');
    ok(await p.$('[data-hsk]'), tag + ' 沒有〔✍️ 字母 書寫 截圖 分析〕'); await p.click('[data-hsk]'); await p.waitForTimeout(800);
    const h = await p.evaluate(() => ({ q: document.querySelectorAll('[data-hsi]').length, ok: document.querySelectorAll('#hsOk canvas').length, shots: document.querySelectorAll('.hsShot').length, cv: document.querySelectorAll('.hsShot canvas').length,
      bars: document.querySelectorAll('.hsBars .sOb').length, tip: !!document.querySelector('.hsTip'), over: [...document.querySelectorAll('#mbox canvas,.hsShot')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).length }));
    ok(h.q === 10 && h.ok === 2 && h.shots === 6 && h.cv === 12 && h.bars >= 1 && h.tip && !h.over, tag + ' 截圖 分析 頁 不對 ' + JSON.stringify(h));
    await p.click('[data-hsi="9"]'); await p.waitForTimeout(500); ok(/✏️|📏/.test(await p.textContent('#mbox')), tag + ' 第 10 題 沒有 錯 的 原因');
    await p.click('[data-hsj="0"]'); await p.waitForTimeout(700); const bg = await p.evaluate(() => { const b = document.getElementById('hsBig'); return { v: b && !b.hidden, c: b ? b.querySelectorAll('canvas').length : 0, h: b ? Math.max(...[...b.querySelectorAll('canvas')].map(c => c.getBoundingClientRect().height)) : 0 }; });
    ok(bg.v && bg.c >= 3 && bg.h >= 200, tag + ' 點 截圖 沒有 放大 ' + JSON.stringify(bg)); if (process.env.SHOT) { await p.screenshot({ path: process.env.SHOT + tag + 'b.png' }); await p.click('#hsBx'); await p.evaluate(() => document.querySelector('#mbox').scrollTop = 0); await p.screenshot({ path: process.env.SHOT + tag + 'a.png' }); }
    ok(!errs.length, tag + ' JS 例外：' + errs.join(' | ')); await ctx.close(); }
  await br.close(); srv.close();
  bad.forEach(m => console.log('✗ ' + m)); console.log((bad.length ? '❌' : '✅') + ' 第六十二次 老師看板：' + n + ' 項，' + bad.length + ' 個 失敗');
})();
