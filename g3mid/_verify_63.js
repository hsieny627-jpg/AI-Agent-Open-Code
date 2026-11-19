/* g3mid/_verify_63.js — 2026-11-19 第六十三次 老師 3-(2)：模擬 小學生 用 **手指** 在 真的 四線格 上 寫 字母（只 印 失敗＋每 種 情況 一行 總結）
 *  ⚠ 不是 直接 塞 筆畫：用 瀏覽器 真的「手指 觸控」事件（CDP Input.dispatchTouchEvent）一筆 一筆 畫 在 寫字板（Pad）上，再 用 跟 學生 一模一樣 的 判斷（hwDecide）
 *  情況：① 正常 手指（大小 ±5%、輕微 抖）② 手 會 抖（抖 2 倍）③ 一筆 寫 一半 手指 離開 再 接 ④ i j 的 點：點 一下／小 圈圈／點 歪 一點 ⑤ 手掌 碰到 格子 外 一下
 *       ⑥ 寫 太 小 飄 在 中間（要 判 錯）⑦ 整個 掉 到 紅線 下面（要 判 錯）⑧ b／d、p／q 寫 反（要 判 錯）⑨ 寫成 另 一個 大小寫（要 判 錯）⑩ i 忘了 點（記錄，給 老師 決定）
 *  i j 的 點 一定 是 圓 的（畫 出來 寬 ≈ 高）。node g3mid/_verify_63.js */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..'), E = [], SUM = []; let n = 0, HTTP = '';
const ok = (c, m) => { n++; if (!c) E.push(m); };
const HW = require('./_hw.js').HW;
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; r(s); }); }); }
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, gs = () => { let a = 0; for (let i = 0; i < 6; i++) a += rnd(); return a - 3; };
const T0 = ch => HW.T[ch][0].map(s => s.map(p => [p[0] + 1.1, p[1]]));
function dense(st, step) { const o = [st[0]]; for (let i = 1; i < st.length; i++) { const a = st[i - 1], b = st[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(d / step)); for (let j = 1; j <= k; j++) o.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]); } return o; }
const isDot = st => { let L = 0; for (let i = 1; i < st.length; i++) L += Math.hypot(st[i][0] - st[i - 1][0], st[i][1] - st[i - 1][1]); return L < .05; };
/* 一個 小學生 的 手指：大小 0.95～1.05（以 紅線 為 準）、斜 一點、每 個 點 抖 sd 格；點 ＝ 手指 點 一下 */
function finger(sk, sd, opt) { opt = opt || {}; const sc = opt.sc || (0.95 + rnd() * .1), sl = (rnd() - .5) * .08, dx = opt.dx || 0, dy = opt.dy || 0, base = opt.base == null ? 2 : opt.base;
  return sk.map(st => { if (isDot(st)) { const c = st[0]; const p = [c[0] + dx + gs() * .02, base + (c[1] - base) * sc + dy + gs() * .02]; return opt.ring ? [0, 1, 2, 3, 4, 5, 6].map(i => [p[0] + .05 * Math.cos(i), p[1] + .05 * Math.sin(i)]) : [p]; }
    return dense(st, .07).map(p => { const y = base + (p[1] - base) * sc + dy; return [p[0] + (y - base) * sl + dx + gs() * sd, y + gs() * sd]; }); }); }
(async () => { const s = await serve(), br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: false });
  await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => r.abort());
  await ctx.addInitScript(() => { Object.defineProperty(window, 'SCORE_URL', { get: () => '', set: () => {}, configurable: true }); });
  const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto(HTTP + '/g3mid/index.html'); await p.waitForTimeout(700);
  const cdp = await ctx.newCDPSession(p);
  await p.evaluate(() => { const h = document.createElement('div'); h.id = 'tpad'; h.style.cssText = 'position:fixed;left:20px;top:20px;width:560px;z-index:9999;background:#123'; document.body.appendChild(h); window.__TP = new Pad(h, { h: 420 }); });
  const box = await p.evaluate(() => { const c = document.querySelector('#tpad canvas'), r = c.getBoundingClientRect(); return { x: r.left, y: r.top, h: r.height, w: r.width }; }), u = box.h / 3.5;
  const X = q => box.x + q[0] * u, Y = q => box.y + (q[1] + .25) * u;
  async function write(sk) { await p.evaluate(() => window.__TP.clear());
    for (const st of sk) { const pt = (t, q) => cdp.send('Input.dispatchTouchEvent', { type: t, touchPoints: t === 'touchEnd' ? [] : [{ x: X(q), y: Y(q), radiusX: 9, radiusY: 9, force: 1, id: 1 }] });
      await pt('touchStart', st[0]); for (const q of st.slice(1)) await pt('touchMove', q); await pt('touchEnd', st[st.length - 1]); }
    return p.evaluate(() => { const sk = window.__TP.strokes(); return sk; }); }
  async function judge(sk, want) { const got = await write(sk); return p.evaluate(a => { const d = hwDecide(a[0], a[1]); return { k: d.k, got: d.got, n: a[0].length }; }, [got, want]); }
  /* ⓪ 點 是 圓 的：畫 標準 的 i，量 點 的 墨水 寬 和 高 */
  const dotWH = await p.evaluate(() => { const c = letterCanvas('i', 300, '#000', 0), x = c.getContext('2d'), W = c.width, H = c.height, d = x.getImageData(0, 0, W, H).data; let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
    for (let y = 0; y < H * .3; y++) for (let i = 0; i < W; i++) { const k = (y * W + i) * 4; if (d[k] < 60 && d[k + 1] < 60 && d[k + 2] < 60 && d[k + 3] > 200) { x0 = Math.min(x0, i); x1 = Math.max(x1, i); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } } return [x1 - x0 + 1, y1 - y0 + 1]; });
  ok(dotWH[0] > 4 && Math.abs(dotWH[0] - dotWH[1]) <= 2, 'i 的 點 不是 圓 的（寬 ' + dotWH[0] + '、高 ' + dotWH[1] + '）');
  const LET = 'abcdefghijklmnopqrstuvwxyzABDEFGHJKMNPQRTWY'.split('');
  const C = [['① 正常 手指', LET, ch => finger(T0(ch), .025), 'ok'], ['② 手 會 抖', LET, ch => finger(T0(ch), .05), 'ok'],
    ['③ 一筆 寫 一半 離開 再 接', LET, ch => finger(T0(ch), .025).flatMap(st => st.length > 12 ? [st.slice(0, Math.floor(st.length / 2) + 1), st.slice(Math.floor(st.length / 2))] : [st]), 'ok'],
    ['④ i j 點 ＝ 點 一下', ['i', 'j'], ch => finger(T0(ch), .025), 'ok'], ['④ i j 點 ＝ 小 圈圈', ['i', 'j'], ch => finger(T0(ch), .025, { ring: 1 }), 'ok'],
    ['④ i j 點 歪 一點', ['i', 'j'], ch => finger(T0(ch), .025).map(st => st.length === 1 ? [[st[0][0] + .12, st[0][1] - .1]] : st), 'ok'],
    ['⑤ 手掌 碰 格子 外', ['a', 'b', 'g', 'h', 'M'], ch => finger(T0(ch), .025).concat([[[2.9, 3.22]]]), 'ok'],
    ['⑥ 寫 太 小 飄 在 中間', ['b', 'd', 'h', 'k', 'l', 't', 'B', 'D', 'H'], ch => finger(T0(ch), .02, { sc: .55, dy: -.35 }), 'no'],
    ['⑦ 掉 到 紅線 下面', ['a', 'c', 'e', 'm', 'n', 'o', 's', 'A', 'E', 'M'], ch => finger(T0(ch), .02, { dy: .55 }), 'no'],
    ['⑧ b／d、p／q 寫 反', [['b', 'd'], ['d', 'b'], ['p', 'q'], ['q', 'p']], pr => finger(T0(pr[1]), .025), 'no'],
    ['⑨ 寫成 另 一個 大小寫', [['A', 'a'], ['B', 'b'], ['D', 'd'], ['E', 'e'], ['G', 'g'], ['H', 'h'], ['Q', 'q'], ['R', 'r'], ['a', 'A'], ['g', 'G']], pr => finger(T0(pr[1]), .025), 'no']];
  for (const c of C) { let good = 0, tot = 0; const bad = [];
    for (const it of c[1]) { const want = Array.isArray(it) ? it[0] : it; for (let rep = 0; rep < 3; rep++) { const r = await judge(c[2](it), want); tot++; const pass = c[3] === 'ok' ? r.k === 'ok' : r.k !== 'ok';
      if (pass) good++; else bad.push(want + (Array.isArray(it) ? '（寫成 ' + it[1] + '）' : '') + '＝' + r.k); } }
    const pc = Math.round(good / tot * 100); SUM.push(c[0] + '：' + good + ' ／ ' + tot + '（' + pc + '%）' + (bad.length ? '　✗ ' + [...new Set(bad)].slice(0, 8).join('、') : ''));
    ok(pc >= (c[3] === 'ok' ? 95 : 100), c[0] + ' 只 有 ' + pc + '%'); }
  { let k = 0; for (let rep = 0; rep < 3; rep++) { const r = await judge(finger(T0('i'), .025).filter(st => st.length > 1), 'i'); if (r.k === 'ok') k++; } SUM.push('⑩ i 忘了 點：' + (k ? '目前 算 對（' + k + ' ／ 3）' : '目前 算 錯') + '（給 老師 決定）'); }
  ok(!errs.length, 'JS 錯誤：' + errs.slice(0, 2).join(' | '));
  await br.close(); s.close(); SUM.forEach(x => console.log('  ' + x)); E.forEach(e => console.log('❌ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第六十三次 手指 寫 字母：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
