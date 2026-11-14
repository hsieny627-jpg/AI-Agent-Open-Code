/* phonics/_verify_51.js — 2026-11-14 第五十一次 量測（只 印 失敗 項＋一行 總結）。node phonics/_verify_51.js
 *   ① 聲音：p t w r ng b d g 字尾 g、top、rabbit、strong、子音 群 cl_；音量 一致
 *   ② 例外 字 頁：母音 字母 紅色、不 發音 灰色、唸 字母 名字 ＝ 黃底（both、find、kind、most、she ＝ 黃底；come 的 e、great 不 黃）
 *   ③ 逐步 拼音：strong、thin、bathroom 兩種 方式 跟 老師 的 例子 一樣；全部 課本 字 每 一步 都 有 音檔
 *   ④ 小學堂：發音 的 字母 放大＋發亮；⑤ 25 題 闖關「三年級」「四年級」
 *   ⑥ 新 遊戲：⭕ 開頭 是 它 嗎？、👯 聲音 雙胞胎、⚔️ 連線 大 對決 ＝ 答對／答錯 都 玩 得 完、沒 錯誤、不 超出 螢幕；老師看板 題組 有 登記
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
['s_w', 's_r', 's_ng', 's_b', 's_g'].forEach(c => ok(dur(au(c)) < dur(path.join(V50, c + '.mp3')) - 0.02, c + ' 尾巴 沒有 變 短（刪 ㄜ）'));
ok(fs.readFileSync(au('s_d')).equals(fs.readFileSync(path.join(ROOT, 'listen', '2026-11-14_P50', 's_d_B.mp3'))), 'd 不是 B');
ok(fs.readFileSync(au('s_eg')).equals(fs.readFileSync(au('s_g'))), '字尾 g 不是 新 的 g');
['s_p', 's_t', 's_b', 's_d', 's_g', 's_w', 's_r', 's_ng'].forEach(c => { const r = actRms(pcm(au(c))); ok(r > 0.03 && r < 0.1, '音量 不 一致 ' + c + ' ' + r.toFixed(3)); });
/* ③ 逐步 拼音 要 的 每 一個 聲音 */
function serve() { return new Promise(r => { const TY = { '.html': 'text/html', '.js': 'text/javascript', '.mp3': 'audio/mpeg' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': TY[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => r([s, 'http://127.0.0.1:' + s.address().port])); }); }
/* ⑥ 老師看板 題組 */
const TB = fs.readFileSync(path.join(ROOT, 'teacher', 'index.html'), 'utf8');
['yn', 'twin', 'line'].forEach(k => ok(TB.indexOf('gm_ph-' + k) >= 0, '老師看板 沒有 題組 gm_ph-' + k));
(async () => { const [srv, U] = await serve(), br = await chromium.launch();
  for (const vp of [[1024, 768], [1920, 1080]]) { const tag = vp.join('×');
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/fonts\.googleapis|fonts\.gstatic|firebasedatabase|firebaseio|script\.google/, r => r.abort());
    await ctx.addInitScript(() => { HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 10); return Promise.resolve(); }; window.__PHFAST = 1; window.__PHSAY = []; try { localStorage.clear(); } catch (e) {} });
    const page = async (url, init, arg) => { const q = await ctx.newPage(); q.__er = []; q.on('pageerror', e => q.__er.push(e.message)); if (init) await q.addInitScript(init, arg); await q.goto(U + url); await q.waitForTimeout(200); await q.evaluate(() => { try { SCH.close(); } catch (e) {} }); return q; };
    const until = async (q, fn, arg, ms) => { for (let t = 0; t < (ms || 6000) / 50; t++) { if (await q.evaluate(fn, arg)) return true; await q.waitForTimeout(50); } return false; };
    /* ② 例外 字 頁 顏色 */
    { const q = await page('/phonics/exceptions.html');
      const r = await q.evaluate(() => { const bad = [], col = e => getComputedStyle(e).color, bg = e => getComputedStyle(e).backgroundColor, RED = 'rgb(255, 77, 77)', GR = 'rgb(140, 146, 163)', YL = 'rgb(250, 204, 21)', nm = {};
        document.querySelectorAll('.it').forEach(it => { const w = it.querySelector('[data-a^="x_"]').dataset.a.slice(2); nm[w] = [];
          it.querySelectorAll('.aw .ch').forEach(ch => { const sil = ch.classList.contains('sil'); ch.querySelectorAll('.lt i').forEach(i => { const L = i.textContent, c = col(i);
            if (sil && c !== GR) bad.push(w + ' 不發音 ' + L + ' 不是 灰色');
            if (!sil && /[aeiou]/.test(L) && c !== RED && bg(i) !== YL) bad.push(w + ' 母音 ' + L + ' 不是 紅色');
            if (!sil && /[^aeiouy]/.test(L) && c === RED) bad.push(w + ' 子音 ' + L + ' 是 紅色');
            if (bg(i) === YL) nm[w].push(L); }); });
          if (it.getBoundingClientRect().right > innerWidth + 1) bad.push(w + ' 超出'); });
        return { bad, nm, lg: !!document.querySelector('.lg') }; });
      ok(!r.bad.length, tag + ' 例外 字 顏色 不對：' + r.bad.slice(0, 8).join('、'));
      ok(r.lg, tag + ' 例外 字 頁 沒有 顏色 說明');
      const want = { both: 'o', find: 'i', kind: 'i', most: 'o', she: 'e', come: '', great: 'a', was: '', who: '' };
      for (const w in want) ok((r.nm[w] || []).join('') === want[w], tag + ' 例外 字 ' + w + ' 黃底 不對：' + (r.nm[w] || []).join(''));
      ok(!q.__er.length, tag + ' 例外 字 頁 有 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ③ 逐步 拼音（老師 的 例子）＋ 全部 課本 字 的 聲音 都 有 檔 */
    { const q = await page('/phonics/games.html', () => { window.__PHAUTO = 0; });
      const EX = { 'strong|1': 's_s,cl_strong_0_2,cl_strong_0_3,rm_strong_0,bk_strong', 'strong|2': 'cl_strong_0_3,rm_strong_0,bk_strong', 'thin|1': 's_th,cv_thin_0,bk_thin', 'thin|2': 's_th,rm_thin_0,bk_thin',
        'bathroom|1': 's_b,cv_bathroom_0,sy_bathroom_0,s_r,cv_bathroom_1,sy_bathroom_1,bk_bathroom', 'bathroom|2': 's_b,rm_bathroom_0,sy_bathroom_0,s_r,rm_bathroom_1,sy_bathroom_1,bk_bathroom' };
      const TX = { 'strong|1': 's ➜ st ➜ str ➜ ong ➜ strong', 'strong|2': 'str ➜ ong ➜ strong', 'thin|1': 'th ➜ thi ➜ thin', 'thin|2': 'th ➜ in ➜ thin' };
      const L = vp[0] === 1024 ? await q.evaluate(() => PHG.bkOrder()) : ['strong', 'thin', 'bathroom'];
      for (const w of L) for (const m of [1, 2]) {
        await q.evaluate(m => localStorage.setItem('phm_bsm', m), m); await q.evaluate(w => PHG.bridgeOpen(w), w);
        await q.evaluate(m => { const b = document.getElementById('bsM'); if (!b.textContent.startsWith('方式 ' + m)) b.click(); window.__PHSAY.length = 0; document.getElementById('bsS').click(); }, m);
        await until(q, w => { const s = window.__PHSAY; return s.length && s[s.length - 1] === 'bk_' + w.replace(/ /g, '_'); }, w, 8000); await q.waitForTimeout(80);
        const r = await q.evaluate(() => [window.__PHSAY.join(), document.getElementById('bsM').textContent]); const k = w + '|' + m;
        if (EX[k]) ok(r[0] === EX[k], tag + ' 逐步 拼音 ' + k + ' 不對：' + r[0]);
        if (TX[k]) ok(r[1].indexOf(TX[k]) >= 0, tag + ' 方式 按鈕 例子 ' + k + ' 不對：' + r[1]);
        r[0].split(',').filter(Boolean).forEach(c => ok(have.has(c), tag + ' ' + k + ' 沒有 音檔 ' + c));
        ok(r[0].split(',').filter(c => c === 'bk_' + w.replace(/ /g, '_')).length === 1, tag + ' ' + k + ' 整個 字 唸 不只 一次：' + r[0]); }
      /* ⑤ 25 題 闖關 */
      const t = await q.evaluate(() => { PHG.lobby(); return [...document.querySelectorAll('.c25 b')].map(b => b.textContent); });
      ok(t.join() === '三年級,四年級', tag + ' 25 題 闖關 按鈕 不對：' + t.join());
      const gl = await q.evaluate(() => ['line', 'yn', 'twin'].map(k => !!document.querySelector('.gc[data-go="' + k + '"] svg')));
      ok(gl.every(Boolean), tag + ' 大廳 沒有 新 遊戲 卡 ' + gl);
      ok(!q.__er.length, tag + ' 遊戲 頁 有 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ④ 小學堂：發音 的 字母 放大＋發亮 */
    { const q = await page('/phonics/games.html');
      await q.evaluate(() => PHG.lessonOpen(0)); await until(q, () => { const b = document.getElementById('lgo'); return b && b.onclick; }, null, 6000); await q.evaluate(() => document.getElementById('lgo').click());
      await until(q, () => /換\s*你/.test((document.getElementById('st') || {}).textContent || ''), null, 8000);
      const r = await q.evaluate(async () => { const us = [...document.querySelectorAll('#lw .u')]; us.forEach(u => u.classList.remove('hl')); const u = us[1];
        const L0 = u.querySelector('.L'); L0.style.transition = 'none'; u.classList.add('hl'); await new Promise(r => setTimeout(r, 100)); const L = L0, cs = getComputedStyle(L), m = new DOMMatrix(cs.transform), o = getComputedStyle(us[0].querySelector('.L'));
        return { sc: m.a, f: cs.filter, other: new DOMMatrix(o.transform).a }; });
      ok(r.sc > 1.1 && r.sc < 1.35 && /brightness/.test(r.f) && /drop-shadow/.test(r.f), tag + ' 小學堂 發音 字母 沒有 放大 發亮 ' + JSON.stringify(r));
      ok(Math.abs(r.other - 1) < 0.01, tag + ' 小學堂 沒 發音 的 字母 也 放大 了');
      ok(!q.__er.length, tag + ' 小學堂 有 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ⑥ 新 遊戲 */
    for (const k of ['yn', 'twin', 'line']) for (const wr of [0, 1]) {
      const q = await page('/phonics/games.html', wr => { window.__PHAUTO = 1; window.__PHWRONG = wr; }, wr);
      await q.evaluate(() => { window.__RECS = []; window.scLive = () => true; window.scQAdd = r => window.__RECS.push(r); try { SCID = '30412'; } catch (e) {} });
      let fit = true, maxB = 0;
      await q.evaluate(k => PHG.start(k), k);
      for (let t = 0; t < 600; t++) { const s = await q.evaluate(() => { const e = document.querySelector('#game .end'); const sw = document.scrollingElement.scrollWidth; const b = document.getElementById('lok') || document.getElementById('lnb'); return [!!e, sw, innerWidth, b ? b.getBoundingClientRect().bottom : 0]; });
        if (s[1] > s[2] + 1) fit = false; maxB = Math.max(maxB, s[3]); if (s[0]) break; await q.waitForTimeout(50); }
      const r = await q.evaluate(k => { const g = PHG.G, e = document.querySelector('#game .end'); return { end: !!e, ok: g ? g.ok : -1, N: g ? (g.N || 5) : -1, lnr: !!document.querySelector('.lnr'), me: g && g.bd ? g.bd.filter(c => c.o === 'me').length : -1, boss: g && g.bd ? g.bd.filter(c => c.o === 'boss').length : -1, txt: e ? e.textContent.slice(0, 80) : '', rec: (window.__RECS || []).map(x => x.set + ':' + x.qs.length).join() }; }, k);
      ok(r.rec === 'g3gm_ph-' + k + ':' + r.N, tag + ' ' + k + ' 成績 沒有 送 或 不對 ' + r.rec);
      ok(r.end, tag + ' ' + k + (wr ? ' 答錯' : ' 答對') + ' 沒有 玩 完');
      ok(r.ok === (wr ? 0 : r.N), tag + ' ' + k + ' 答對 題數 不對 ' + r.ok + '/' + r.N);
      if (k === 'line') { ok(r.N === 8 && r.lnr, tag + ' 連線 對決 結果 沒有 出來'); ok(r.me === (wr ? 0 : 8) && r.me + r.boss >= 15, tag + ' 連線 對決 格子 不對 我' + r.me + ' 魔王' + r.boss);
        ok(maxB <= vp[1] + 1, tag + ' 連線 棋盤 超出 螢幕 下面 ' + maxB); }
      ok(fit, tag + ' ' + k + ' 左右 超出 螢幕');
      ok(!q.__er.length, tag + ' ' + k + ' 有 錯誤 ' + q.__er.join('|')); await q.close(); }
    await ctx.close(); }
  await br.close(); srv.close();
  E.forEach(e => console.log('❌ ' + e)); console.log('第五十一次：量測 ' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
