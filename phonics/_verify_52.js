/* phonics/_verify_52.js — 2026-11-14 第五十二次 量測（只 印 失敗 項＋一行 總結）。node phonics/_verify_52.js
 *   ① 聲音：ng r b g 新 檔、字尾 b d g p t k 新 檔 而且 只有 字首 一半 大聲、遊戲／課本 的 字尾 用 新 的
 *   ② 逐步 拼音 方式 1 母音 單獨 唸（th ➜ i ➜ thi ➜ thin）；③ 小學堂 拼法 1 ＝ s ➜ si ➜ six、意思 左邊 沒有 ＝
 *   ④ 從 CVC 到 課本：〔無〕在 右上角 注音 左邊、〔▶ 自動 播放〕會 自己 換 下一個 字、〔⏸️ 暫停〕會 停、room 圖 不是 門
 *   不 連 真的 成績表、不 連 Firebase */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http'), cp = require('child_process');
const D = __dirname, ROOT = path.join(D, '..'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const have = new Set(fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, '')));
const BOOK = require('./_book.js'), V50 = path.join(ROOT, 'listen', '2026-11-14_P51', 'v50');
/* ① 聲音 */
const pcm = f => { const b = cp.execFileSync('ffmpeg', ['-v', 'quiet', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', '22050', '-']); return new Float32Array(b.buffer, b.byteOffset, b.length / 4); };
const dur = f => { const y = pcm(f); let a = 0, b = y.length - 1; const mx = y.reduce((m, x) => Math.max(m, Math.abs(x)), 0); while (a < b && Math.abs(y[a]) < mx * 0.03) a++; while (b > a && Math.abs(y[b]) < mx * 0.03) b--; return (b - a) / 22050; };
const actRms = y => { const w = 441, fr = []; for (let i = 0; i + w < y.length; i += w) { let s = 0; for (let j = i; j < i + w; j++) s += y[j] * y[j]; fr.push(Math.sqrt(s / w)); } const mx = Math.max(...fr), a = fr.filter(x => x > mx * 0.1); return Math.sqrt(a.reduce((t, x) => t + x * x, 0) / a.length); };
const au = c => path.join(D, 'au', c + '.mp3');
['s_p', 's_t', 's_w', 's_r', 's_ng', 's_b', 's_d', 's_g', 's_eg', 't-aa-p', 'bk_rabbit', 'sy_rabbit_1', 'bk_strong', 'rm_strong_0', 'cl_strong_0_2', 'cl_strong_0_3', 'cl_angry_1_2'].forEach(c => ok(have.has(c), '沒有 音檔 ' + c));
['s_p', 's_t', 's_w', 's_r', 's_ng', 's_b', 's_g', 's_eg', 't-aa-p', 'bk_rabbit', 'bk_strong'].forEach(c => ok(!fs.readFileSync(au(c)).equals(fs.readFileSync(path.join(V50, c + '.mp3'))), c + ' 沒有 換 新 的'));
/* 第五十二次：r ng b g 又 重做 了（_verify_52.js 量）*/ ['s_w'].forEach(c => ok(dur(au(c)) < dur(path.join(V50, c + '.mp3')) - 0.02, c + ' 尾巴 沒有 變 短（刪 ㄜ）'));
ok(fs.readFileSync(au('s_d')).equals(fs.readFileSync(path.join(ROOT, 'listen', '2026-11-14_P50', 's_d_B.mp3'))), 'd 不是 B');
/* 第五十二次：字尾 g ＝ s_eg（真的 字 最後 的 g，_verify_52.js 量）*/
['s_p', 's_t', 's_b', 's_d', 's_g', 's_w', 's_r', 's_ng'].forEach(c => { const r = actRms(pcm(au(c))); ok(r > 0.03 && r < 0.1, '音量 不 一致 ' + c + ' ' + r.toFixed(3)); });
/* ③ 逐步 拼音 要 的 每 一個 聲音 */
function serve() { return new Promise(r => { const TY = { '.html': 'text/html', '.js': 'text/javascript', '.mp3': 'audio/mpeg' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': TY[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => r([s, 'http://127.0.0.1:' + s.address().port])); }); }
const V51 = path.join(ROOT, 'listen', '2026-11-14_P52', 'v51');
['s_ng', 's_r', 's_b', 's_g', 't-aa-p', 'cl_strong_0_3', 'cl_angry_1_2'].forEach(c => ok(fs.existsSync(au(c)) && !fs.readFileSync(au(c)).equals(fs.readFileSync(path.join(V51, c + '.mp3'))), c + ' 沒有 換 新 的'));
['s_ng', 's_r'].forEach(c => ok(dur(au(c)) < 0.36, c + ' 太 長（尾巴 沒 刪）' + dur(au(c)).toFixed(2)));
const ini = { b: 's_b', d: 's_d', g: 's_g', p: 's_p', t: 's_t', k: 's_k' };
for (const c in ini) { const e = au('s_e' + c); ok(fs.existsSync(e), '沒有 字尾 ' + c); if (!fs.existsSync(e)) continue;
  const a = actRms(pcm(e)), b = actRms(pcm(au(ini[c]))); ok(a < b * 0.7 && a > 0.015, '字尾 ' + c + ' 沒有 比 字首 小聲 ' + a.toFixed(3) + ' / ' + b.toFixed(3)); ok(dur(e) < 0.3, '字尾 ' + c + ' 太 長'); }
ok(fs.readFileSync(path.join(D, '_book.js'), 'utf8').indexOf('🚪') < 0, 'room 還是 門 🚪');
(async () => { const [srv, U] = await serve(), br = await chromium.launch();
  for (const vp of [[1024, 768], [1366, 1024], [1920, 1080]]) { const tag = vp.join('×');
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/fonts\.googleapis|fonts\.gstatic|firebasedatabase|firebaseio|script\.google/, r => r.abort());
    await ctx.addInitScript(() => { HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 10); return Promise.resolve(); }; window.__PHFAST = 1; window.__PHSAY = []; try { localStorage.clear(); } catch (e) {} });
    const page = async (url) => { const q = await ctx.newPage(); q.__er = []; q.on('pageerror', e => q.__er.push(e.message)); await q.goto(U + url); await q.waitForTimeout(200); await q.evaluate(() => { try { SCH.close(); } catch (e) {} }); return q; };
    const until = async (q, fn, arg, ms) => { for (let t = 0; t < (ms || 6000) / 50; t++) { if (await q.evaluate(fn, arg)) return true; await q.waitForTimeout(50); } return false; };
    const q = await page('/phonics/games.html');
    /* ① 遊戲、課本 的 字尾 */
    const so = await q.evaluate(() => ['b', 'd', 'g', 'p', 't', 'k', 'ck'].map(e => PHG.sOf({ i: 'b', v: 'a', e: e }, 2)).join() + '|' + ['B', 'D', 'G', 'P', 'T', 'K'].map(x => PHG.phAu({ P: [x + ''], coda: 1 }, 0)).join() + '|' + PHG.phAu({ P: ['D'] }, 0));
    ok(so === 's_eb,s_ed,s_eg,s_ep,s_et,s_ek,s_ek|s_eb,s_ed,s_eg,s_ep,s_et,s_ek|s_d', tag + ' 字尾 聲音 沒有 換：' + so);
    /* ② 逐步 拼音 */
    for (const [w, m, want, tx] of [['thin', 1, 's_th,s_ih,cv_thin_0,bk_thin', 'th ➜ i ➜ thi ➜ thin'], ['bathroom', 1, 's_b,s_ae,cv_bathroom_0,sy_bathroom_0,s_r,s_uu,cv_bathroom_1,sy_bathroom_1,bk_bathroom', ''], ['strong', 1, 's_s,cl_strong_0_2,cl_strong_0_3,rm_strong_0,bk_strong', 's ➜ st ➜ str ➜ ong ➜ strong'], ['thin', 2, 's_th,rm_thin_0,bk_thin', 'th ➜ in ➜ thin']]) {
      await q.evaluate(m => localStorage.setItem('phm_bsm', m), m); await q.evaluate(w => PHG.bridgeOpen(w), w);
      await q.evaluate(m => { const b = document.getElementById('bsM'); if (!b.textContent.startsWith('方式 ' + m)) b.click(); window.__PHSAY.length = 0; document.getElementById('bsS').click(); }, m);
      await until(q, w => { const s = window.__PHSAY; return s.length && s[s.length - 1] === 'bk_' + w; }, w, 8000); await q.waitForTimeout(80);
      const r = await q.evaluate(() => [window.__PHSAY.join(), document.getElementById('bsM').textContent]);
      ok(r[0] === want, tag + ' 逐步 拼音 ' + w + '|' + m + ' 不對：' + r[0]); if (tx) ok(r[1].indexOf(tx) >= 0, tag + ' 方式 按鈕 例子 不對：' + r[1]);
      r[0].split(',').forEach(c => ok(have.has(c), tag + ' 沒有 音檔 ' + c)); }
    /* ④〔無〕位置、room 圖、自動 播放 */
    await q.evaluate(() => PHG.bridgeOpen('bathroom')); await q.waitForTimeout(150);
    const nb = await q.evaluate(() => { const n = document.getElementById('mdNo'), z = document.querySelector('[data-md="zh"]'), a = n.getBoundingClientRect(), b = z.getBoundingClientRect();
      return { vis: a.width > 0, left: a.right <= b.left + 1, top: a.top < 120 && Math.abs(a.top - b.top) < 6, right: a.left > innerWidth / 2, old: !!document.getElementById('tN'), f: parseFloat(getComputedStyle(n).fontSize) }; });
    ok(nb.vis && nb.left && nb.top && nb.right && !nb.old && nb.f >= 16, tag + '〔無〕位置 不對：' + JSON.stringify(nb));
    const nt = await q.evaluate(async () => { document.getElementById('mdNo').click(); await new Promise(r => setTimeout(r, 50)); const a = document.querySelector('.brg').classList.contains('notile'); document.getElementById('mdNo').click(); await new Promise(r => setTimeout(r, 50)); return [a, document.querySelector('.brg').classList.contains('notile')]; });
    ok(nt[0] && !nt[1], tag + '〔無〕按了 沒有 作用 ' + nt);
    const rm = await q.evaluate(async () => { document.getElementById('tI').click(); await new Promise(r => setTimeout(r, 80)); const p = [...document.querySelectorAll('.plab .pi')]; const r = p.map(x => x.querySelector('svg') ? 'svg' : x.textContent); document.getElementById('tI').click(); return r.join(); });
    ok(/svg/.test(rm) && rm.indexOf('🚪') < 0, tag + ' room 圖 不對：' + rm);
    const ap = await q.evaluate(async () => { const w0 = document.querySelector('.brg').dataset.w, b = document.getElementById('bA'); if (!b) return 'no'; const f = parseFloat(getComputedStyle(b).fontSize), h = b.getBoundingClientRect().height; b.click();
      for (let t = 0; t < 200; t++) { await new Promise(r => setTimeout(r, 50)); const r = document.querySelector('.brg'); if (r && r.dataset.w !== w0) break; }
      const w1 = document.querySelector('.brg').dataset.w, on = document.getElementById('bA').classList.contains('on'); document.getElementById('cP').click(); await new Promise(r => setTimeout(r, 60));
      const off = !document.getElementById('bA').classList.contains('on'); document.getElementById('cP').click(); return { w0, w1, on, off, f, h }; });
    ok(ap !== 'no' && ap.w1 !== ap.w0 && ap.on && ap.off && ap.f >= 18 && ap.h >= 48, tag + ' 自動 播放／暫停 不對：' + JSON.stringify(ap));
    await q.evaluate(() => PHG.lobby()); await q.waitForTimeout(80);
    ok(await q.evaluate(() => document.getElementById('mdNo').getBoundingClientRect().width === 0), tag + ' 大廳 也 出現〔無〕');
    /* ③ 小學堂 */
    await q.evaluate(() => { localStorage.setItem('phm_lbm', 1); PHG.lessonOpen(0); }); await until(q, () => { const b = document.getElementById('lgo'); return b && b.onclick; }, null, 6000); await q.evaluate(() => document.getElementById('lgo').click());
    await until(q, () => /換\s*你/.test((document.getElementById('st') || {}).textContent || ''), null, 8000);
    const ls = await q.evaluate(async () => { const w = document.getElementById('lw').dataset.w; window.__PHSAY.length = 0; document.getElementById('lj').click(); for (let t = 0; t < 100 && window.__PHSAY.length < 3; t++) await new Promise(r => setTimeout(r, 50)); await new Promise(r => setTimeout(r, 200));
      return { w, say: window.__PHSAY.join(), bt: document.getElementById('lbm').textContent, eq: !!document.querySelector('#lm .eq') }; });
    const p3 = ls.say.split(','), w = ls.w;
    ok(p3.length === 3 && /^s_/.test(p3[0]) && p3[1].split('-').length === 2 && p3[2].split('-').length === 3, tag + ' 小學堂 拼法 1 不是 s ➜ si ➜ six：' + ls.say);
    ok(ls.bt.indexOf(w[0] + ' ➜ ' + w.slice(0, 2) + ' ➜ ' + w) >= 0, tag + ' 小學堂 拼法 1 按鈕 例子 不對：' + ls.bt);
    ok(!ls.eq, tag + ' 小學堂 意思 左邊 還有 ＝');
    ok(!q.__er.length, tag + ' 有 錯誤 ' + q.__er.join('|')); await q.close(); await ctx.close(); }
  await br.close(); srv.close();
  E.forEach(e => console.log('❌ ' + e)); console.log('第五十二次：量測 ' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
