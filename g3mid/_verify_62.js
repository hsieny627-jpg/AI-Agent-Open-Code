/* g3mid/_verify_62.js — 2026-11-19 第六十二次 老師 6-(1)B（只 印 失敗＋一行 總結；不 送 真的 成績、不 連 Firebase）
 *  ① 字母 書寫 開始 前 秒懂 動畫：✍️ 正確 寫法（一筆 一筆 畫 出來）＋❌ 錯 的 寫法（大小寫 寫錯、超出 線、沒 碰到 線）＋大寫／小寫 標籤
 *  ② 寫完 一題 ＝ 成績 那 一題 第 8 格 有 筆畫（"*A:…"），第 7 格 ＝ 原因 或 "~w"；時間 到 沒 送出 ＝ 也 存 板子 上 的 樣子 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, HTTP = '';
const ok = (c, m) => { n++; if (!c) E.push(m); };
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
(async () => { const s = await serve(), br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180]]) { const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: true });
    await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
    await ctx.addInitScript(() => { Object.defineProperty(window, 'SCORE_URL', { get: () => '', set: () => {}, configurable: true }); });
    const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto(HTTP + '/g3mid/index.html'); await p.waitForTimeout(800);
    const it = await p.evaluate(async () => { const o = {}; startLW('lw'); const seen = {}; for (let i = 0; i < 200; i++) { await new Promise(r => setTimeout(r, 250)); const b = document.getElementById('lwb'); if (!b) break; const t = b.textContent;
        if (/正確 的 寫法/.test(t)) { seen.show = 1; seen.cv = b.querySelectorAll('canvas').length; seen.cz = b.querySelectorAll('.cz').length; }
        if (/算 錯/.test(t) && /大寫/.test(t) && /超出/.test(t)) { seen.bad = 1; seen.badn = b.querySelectorAll('.lwc.no').length; }
        const g = document.getElementById('lwgo'); if (g && !g.disabled) { seen.go = 1; break; } }
      o.seen = seen; const ov = [...document.querySelectorAll('.lwi canvas')].filter(c => c.getBoundingClientRect().right > innerWidth + 1).length; o.ov = ov; return o; });
    ok(it.seen.show && it.seen.cv === 2 && it.seen.cz === 2, tag + ' 沒有 正確 寫法 動畫 ' + JSON.stringify(it));
    ok(it.seen.bad && it.seen.badn === 3, tag + ' 沒有 錯 的 寫法（3 種）' + JSON.stringify(it)); ok(it.seen.go && !it.ov, tag + ' 秒懂 動畫 演 不完／超出 ' + JSON.stringify(it));
    await p.click('#lwgo').catch(() => {}); await p.waitForTimeout(2600);
    /* 用 手指 照 正確 字母 的 樣子 寫 一次 ➜〔✅ 寫好了〕*/
    const want = await p.evaluate(() => R && R.q && R.q.want); ok(!!want, tag + ' 沒有 開始 寫字');
    const box = await p.evaluate(() => { const c = document.querySelector('.wrt canvas'), r = c.getBoundingClientRect(); return { x: r.left, y: r.top, h: r.height }; });
    const st = await p.evaluate(w => HW.T[w][0], want), u = box.h / 3.5;
    for (const s1 of st) { await p.mouse.move(box.x + (s1[0][0] + 1) * u, box.y + (s1[0][1] + .25) * u); await p.mouse.down(); for (const q of s1.slice(1)) await p.mouse.move(box.x + (q[0] + 1) * u, box.y + (q[1] + .25) * u, { steps: 2 }); await p.mouse.up(); }
    await p.click('.wrt .go'); await p.waitForTimeout(3500);
    const q0 = await p.evaluate(() => R.Q[0]); ok(q0 && typeof q0[7] === 'string' && q0[7].charAt(0) === '*' && new RegExp('^\\*' + want + ':').test(q0[7]) && (q0[6] === '~w' || /^~/.test(q0[6])), tag + ' 成績 沒有 筆畫 ' + JSON.stringify(q0).slice(0, 160));
    ok(!errs.length, tag + ' JS 錯誤：' + errs.slice(0, 2).join(' | ')); await ctx.close(); }
  await br.close(); s.close(); E.forEach(e => console.log('❌ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第六十二次 g3mid 字母 書寫：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
