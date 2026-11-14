/* phonics/_verify_50.js — 2026-11-14 第五十次 量測（只 印 失敗 項＋一行 總結）。node phonics/_verify_50.js
 *   ① 聲音：單獨 字母 音量 一致、字尾 g／l、ir、逐步 拼音 cv_ rm_、top／rabbit／strong／kitchen
 *   ② 從 CVC 到 課本：上面 只 有 G4 L3 1/6、右上角 4 顆、第 ④ 步 沒有 字、沒有 ＝、最後 唸 bath ➜ room ➜ bathroom ✕2、點 字母 會 唸＋放大、
 *      圖示／中文 在 bath room 正下方、〔無〕、逐步 拼音 兩種、g j p q y 尾巴 不 被 蓋住、黃底（唸 名字）、r 藍底、bird IPA 4 個、where 圖
 *   ③ 遊戲 場：大廳 線條 圖示、登入 列 不 蓋 標題、FEVER 字 拿掉、三種 規則 動畫、圖鑑 點 卡 ＝ 唸；④ 小學堂 兩種 拼法
 *   ⑤ 字卡：點 母音 字首 不 變（quir ➜ quar）、點 W 一定 變 W、例外 字 對齊；⑥ 例外 字 頁 對齊、照 規則 都 有 音檔
 *   不 連 真的 成績表、不 連 Firebase */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http'), cp = require('child_process');
const D = __dirname, ROOT = path.join(D, '..'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const have = new Set(fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, '')));
const BOOK = require('./_book.js'), EXS = require('./_excshow.json');
/* ① 聲音 */
const pcm = f => { const b = cp.execFileSync('ffmpeg', ['-v', 'quiet', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', '22050', '-']); return new Float32Array(b.buffer, b.byteOffset, b.length / 4); };
const actRms = y => { const w = 441, fr = []; for (let i = 0; i + w < y.length; i += w) { let s = 0; for (let j = i; j < i + w; j++) s += y[j] * y[j]; fr.push(Math.sqrt(s / w)); } const mx = Math.max(...fr), a = fr.filter(x => x > mx * 0.1); return Math.sqrt(a.reduce((t, x) => t + x * x, 0) / a.length); };
const S = [...have].filter(c => /^s_/.test(c)); let lo = 1, hi = 0;
S.forEach(c => { const r = actRms(pcm(path.join(D, 'au', c + '.mp3'))); lo = Math.min(lo, r); hi = Math.max(hi, r); ok(r > 0.03 && r < 0.1, '單獨 字母 音量 不 一致 ' + c + ' ' + r.toFixed(3)); });
ok(hi / lo < 2.6, '單獨 字母 最 大聲／最 小聲 差 太 多 ' + (hi / lo).toFixed(2));
['s_eg', 's_el', 's_ir', 's_r', 's_ng', 't-aa-p', 'bk_rabbit', 'sy_rabbit_1', 'bk_strong'].forEach(c => ok(have.has(c), '沒有 音檔 ' + c));
ok(fs.readFileSync(path.join(D, 'au', 'bk_kitchen.mp3')).equals(fs.readFileSync(path.join(ROOT, 'listen', '2026-11-14_P50', 'v48_kitchen.mp3'))), 'kitchen 不是 舊 的');
ok(fs.readFileSync(path.join(D, 'au', 's_em.mp3')).equals(fs.readFileSync(path.join(D, 'au', 's_m.mp3'))) && fs.readFileSync(path.join(D, 'au', 's_en.mp3')).equals(fs.readFileSync(path.join(D, 'au', 's_n.mp3'))), '字尾 m n 不是 字首 的 m n');
JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'tools', 'ph_step50.js')]).toString()).forEach(([c]) => ok(have.has(c), '逐步 拼音 沒有 音檔 ' + c));
ok(/i:IH/.test(BOOK.W.rabbit.g) && /i:ERV r:RC/.test(BOOK.W.bird.g) && /u:ERV r:RC/.test(BOOK.W.turtle.g), '_book.js rabbit／bird／turtle 沒 改');
Object.keys(EXS).forEach(k => ok(have.has(k.split('|')[1]), '例外 字〔照 規則〕沒有 音檔 ' + k));
function serve() { return new Promise(r => { const TY = { '.html': 'text/html', '.js': 'text/javascript', '.mp3': 'audio/mpeg' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': TY[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => r([s, 'http://127.0.0.1:' + s.address().port])); }); }
(async () => { const [srv, U] = await serve(), br = await chromium.launch();
  for (const vp of [[1024, 768], [1920, 1080]]) { const tag = vp.join('×');
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/fonts\.googleapis|fonts\.gstatic|firebasedatabase|firebaseio|script\.google/, r => r.abort());
    await ctx.addInitScript(() => { HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 10); return Promise.resolve(); }; window.__PHFAST = 1; window.__PHSAY = []; try { localStorage.clear(); } catch (e) {} });
    const page = async (url, init, arg) => { const q = await ctx.newPage(); q.__er = []; q.on('pageerror', e => q.__er.push(e.message)); if (init) await q.addInitScript(init, arg); await q.goto(U + url); await q.waitForTimeout(200); await q.evaluate(() => { try { SCH.close(); } catch (e) {} }); return q; };
    const until = async (q, fn, arg, ms) => { for (let t = 0; t < (ms || 6000) / 50; t++) { if (await q.evaluate(fn, arg)) return true; await q.waitForTimeout(50); } return false; };
    /* ② 從 CVC 到 課本 */
    { const q = await page('/phonics/games.html', () => { window.__PHAUTO = 1; window.__PHBR = []; });
      const L = await q.evaluate(() => PHG.bkOrder());
      for (const w of L) {
        await q.evaluate(w => { window.__PHSAY.length = 0; PHG.bridgeOpen(w); }, w);
        const done = await until(q, w => window.__PHBR.indexOf(w) >= 0, w, 15000);
        const r = await q.evaluate(w => { const root = document.querySelector('.brg'), bw = root.querySelector('.bw2'), top = root.querySelector('.btop'), word = bw.getBoundingClientRect();
          const tg = [...top.querySelectorAll('.btg')].map(b => b.id), rt = top.querySelector('.btgs').getBoundingClientRect();
          const desc = [...bw.querySelectorAll('.bgp')].filter(g => /[gjpqy]/.test(g.querySelector('.bgl').textContent)).map(g => { const a = g.querySelector('.bgl').getBoundingClientRect(), t = g.querySelector('.tls'); return t ? t.getBoundingClientRect().top - a.bottom : 9; });
          return { lh: top.querySelector('.lh').textContent, tg, right: rt.right > innerWidth * 0.6 && rt.bottom < word.top, st: document.getElementById('bst').textContent.trim(), eq: /＝/.test(document.getElementById('br').textContent), br: document.getElementById('br').textContent.trim(), say: window.__PHSAY.slice(), desc, over: document.documentElement.scrollWidth > innerWidth + 1 }; }, w);
        ok(done, tag + ' 課本 ' + w + ' 動畫 沒 演完');
        ok(/^G[34]\s+L\d\s+\d+\/\d+$/.test(r.lh), tag + ' ' + w + ' 上面 不是 G4 L3 1/6：' + r.lh);
        ok(r.tg.join() === 'tN,tI,tZ,bl' && r.right, tag + ' ' + w + ' 右上角 按鈕 不對 ' + r.tg.join());
        ok(r.st === '' && !r.eq && r.br.length > 0, tag + ' ' + w + ' 第 ④ 步 還 有 字／還 有 ＝／沒有 圖＋中文 ' + JSON.stringify([r.st, r.br]));
        const au = w.replace(/ /g, '_'), tail = r.say.slice(-2);
        ok(tail[0] === 'bk_' + au && tail[1] === 'bk_' + au, tag + ' ' + w + ' 最後 沒有 唸 整個 字 兩次 ' + tail.join());
        ok(r.desc.every(d => d >= -1), tag + ' ' + w + ' g j p q y 尾巴 被 蓋住 ' + r.desc.join());
        ok(!r.over, tag + ' ' + w + ' 超出 螢幕');
        ok(r.say.every(f => !f || /^(s_|bk_|sy_|cv_|rm_)/.test(f) && await0(f)), tag + ' ' + w + ' 有 聲音 沒有 音檔 ' + r.say.filter(f => f && !have.has(f)).join());
      }
      /* bathroom：最後 先 唸 bath、room，再 bathroom ✕2 */
      await q.evaluate(() => { window.__PHSAY.length = 0; PHG.bridgeOpen('bathroom'); }); await until(q, () => window.__PHBR.filter(x => x === 'bathroom').length >= 2, null, 15000);
      const sq = await q.evaluate(() => window.__PHSAY.slice(-4).join());
      ok(sq === 'sy_bathroom_0,sy_bathroom_1,bk_bathroom,bk_bathroom', tag + ' bathroom 最後 不是 bath ➜ room ➜ bathroom ✕2：' + sq);
      /* 圖示＋中文：在 bath、room 正下方 */
      const lab = await q.evaluate(() => { document.getElementById('tI').click(); document.getElementById('tZ').click(); const sy = [...document.querySelectorAll('.bwd .bsy')].map(e => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; });
        const pl = [...document.querySelectorAll('.plab')].map(e => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, e.textContent]; }); return { sy, pl, br: document.getElementById('br').textContent }; });
      ok(lab.pl.length === 2 && lab.pl.every((p, i) => Math.abs(p[0] - lab.sy[i]) < 12) && /洗澡/.test(lab.pl[0][1]) && /房間/.test(lab.pl[1][1]), tag + ' 圖示／中文 沒有 在 bath room 正下方 ' + JSON.stringify(lab));
      const no = await q.evaluate(() => { document.getElementById('tI').click(); document.getElementById('tZ').click(); document.getElementById('tN').click(); const t = [...document.querySelectorAll('.bw2 .tls')].filter(x => x.offsetWidth > 0).length; document.getElementById('tN').click(); return t; });
      ok(no === 0, tag + '〔無〕還 看得到 音標 ' + no);
      /* 點 字母 ＝ 唸 那 個 字母（放大）*/
      const tp = await q.evaluate(async () => { window.__PHSAY.length = 0; const g = document.querySelector('.bwd .bgp[data-g="2"]'); g.click(); const cls = g.classList.contains('tap'); await new Promise(r => setTimeout(r, 200)); return [cls, window.__PHSAY.join()]; });
      ok(tp[0] && tp[1] === 's_th', tag + ' 點 th 沒有 唸／沒有 放大 ' + tp.join(' '));
      /* 逐步 拼音 兩種 */
      for (const [m, want] of [[1, 's_b,cv_bathroom_0,sy_bathroom_0,s_r,cv_bathroom_1,sy_bathroom_1,bk_bathroom'], [2, 's_b,rm_bathroom_0,sy_bathroom_0,s_r,rm_bathroom_1,sy_bathroom_1,bk_bathroom']]) {
        await q.evaluate(m => { localStorage.setItem('phm_bsm', m); }, m); await q.evaluate(() => PHG.bridgeOpen('bathroom'));
        await q.evaluate(m => { const b = document.getElementById('bsM'); if (!b.textContent.startsWith('方式 ' + m)) b.click(); window.__PHSAY.length = 0; document.getElementById('bsS').click(); }, m);
        await q.waitForTimeout(1500); const got = await q.evaluate(() => window.__PHSAY.join());
        ok(got === want, tag + ' 逐步 拼音 方式 ' + m + ' 不對：' + got);
      }
      /* 黃底、r 藍底、bird IPA 4 個、where 圖 */
      const cl = await q.evaluate(() => { const o = {}; for (const w of ['dining room', 'tired', 'he', 'she', 'no', 'bird', 'turtle', 'where', 'short']) { PHG.bridgeOpen(w); const nm = [...document.querySelectorAll('.bgp.nm')].map(g => g.textContent.replace(/[^a-z]/g, '').slice(0, 1));
          const rb = [...document.querySelectorAll('.bgp')].filter(g => g.querySelector('.bgl').textContent === 'r').map(g => { const t = g.querySelector('.tl'); return t ? getComputedStyle(t).backgroundColor : ''; }); o[w] = { nm, rb }; }
        document.querySelector('#mdSw [data-md="ipa"]').click(); PHG.bridgeOpen('bird'); o.ipa = [...document.querySelectorAll('.bw2 .tl')].map(t => t.textContent); document.querySelector('#mdSw [data-md="zh"]').click();
        document.getElementById('tI') && null; PHG.bridgeOpen('where'); document.getElementById('tI').click(); o.wsvg = !!document.querySelector('.bres svg'); document.getElementById('tI').click(); return o; });
      ok(cl['dining room'].nm.join() === 'i' && cl.tired.nm.join() === 'i' && cl.he.nm.join() === 'e' && cl.she.nm.join() === 'e' && cl.no.nm.join() === 'o', tag + ' 唸 名字 的 母音 沒有 黃底 ' + JSON.stringify(cl));
      const blue = c => /144, 194, 231|rgb\(1[0-9]{2}, 1[89][0-9], 2[0-9]{2}\)/.test(c);
      ok(['bird', 'turtle', 'where', 'short', 'tired'].every(w => cl[w].rb.length && cl[w].rb.every(blue)), tag + ' r 下面 不是 藍底 ' + JSON.stringify(['bird', 'turtle', 'where', 'short', 'tired'].map(w => cl[w].rb)));
      ok(cl.ipa.join(' ') === 'b ɜ ɹ d', tag + ' bird IPA 不是 4 個 ' + cl.ipa.join(' '));
      ok(cl.wsvg, tag + ' where 的 圖 不是 新 畫 的 放大鏡');
      ok(!q.__er.length, tag + ' 課本 頁 有 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ③ 遊戲 場 大廳＋規則 動畫＋圖鑑 */
    { const q = await page('/phonics/games.html', () => { localStorage.setItem('phm_book', JSON.stringify(['cat'])); });
      const r = await q.evaluate(() => { const sb = document.getElementById('scbar'), ttl = document.getElementById('ttl').getBoundingClientRect(), sr = sb && !sb.hidden ? sb.getBoundingClientRect() : null;
        return { li: document.querySelectorAll('.gc .ic svg.li').length, gc: document.querySelectorAll('.gc').length, emo: [...document.querySelectorAll('.gc .ic')].some(e => /\p{Extended_Pictographic}/u.test(e.textContent)), sb: sr ? sr.top >= ttl.bottom - 1 : true, fever: /FEVER/.test(document.body.innerText), over: document.querySelector('main').scrollWidth > innerWidth + 1 }; });
      ok(r.li === r.gc && r.gc >= 13 && !r.emo, tag + ' 大廳 遊戲 圖示 不是 線條 圖示 ' + JSON.stringify(r));
      ok(r.sb, tag + ' 登入 列 蓋住 標題'); ok(!r.fever, tag + ' 還 有 FEVER 字'); ok(!r.over, tag + ' 大廳 超出 螢幕');
      for (const k of ['fever', 'boss', 'dex']) { await q.evaluate(k => { document.querySelectorAll('.rx').forEach(x => x.remove()); const b = document.createElement('button'); b.dataset.rx = k; document.body.appendChild(b); b.click(); b.remove(); }, k);
        const fin = await until(q, () => { const c = document.getElementById('rxc'); return c && /懂了/.test(c.textContent); }, null, 6000);
        const box = await q.evaluate(() => { const p = document.querySelector('.rxp').getBoundingClientRect(); return p.right <= innerWidth && p.bottom <= innerHeight && p.top >= 0; });
        ok(fin && box, tag + ' 規則 動畫 ' + k + ' 沒 演完／超出'); await q.evaluate(() => document.getElementById('rxOK').click()); }
      const dx = await q.evaluate(async () => { window.__PHSAY.length = 0; document.querySelector('[data-dw="cat"]').click(); await new Promise(r => setTimeout(r, 100)); return window.__PHSAY.join(); });
      ok(dx === 'bk_cat' || dx === 'k-ae-t', tag + ' 圖鑑 點 卡片 沒有 唸 ' + dx);
      const hud = await q.evaluate(async () => { localStorage.setItem('phm_rx_seen', '1'); window.__PHAUTO = 0; try { SCID = '30412'; } catch (e) {} window.scLive = () => false; window.scQAdd = () => {}; PHG.start('ufo'); document.getElementById('go').click(); await new Promise(r => setTimeout(r, 400)); const t = document.querySelector('.hud') ? document.querySelector('.hud').innerText : ''; PHG.lobby(); return t; });
      ok(!/FEVER/.test(hud) && /加倍/.test(hud), tag + ' 遊戲 上面 還 有 FEVER ' + hud.replace(/\s+/g, ' '));
      ok(!q.__er.length, tag + ' 大廳 有 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ④ 小學堂 兩種 拼法（pig）*/
    for (const [m, want] of [[1, 'p-ih,s_eg,p-ih-g'], [2, 's_p,0-ih-g,p-ih-g']]) {
      const q = await page('/phonics/games.html', m => { localStorage.setItem('phm_lbm', m); }, m);
      await q.evaluate(() => { window.__PHSAY.length = 0; PHG.lessonOpen(1); }); await until(q, () => { const b = document.getElementById('lgo'); return b && b.onclick; }, null, 6000); await q.evaluate(() => document.getElementById('lgo').click());
      await until(q, () => /換\s*你/.test((document.getElementById('st') || {}).textContent || ''), null, 8000);
      const r = await q.evaluate(() => ({ w: document.getElementById('lw').dataset.w, say: window.__PHSAY.slice() }));
      const exp = want.replace(/pig|p-ih-g/g, x => x).split(','), w = r.w, code = await q.evaluate(w => PHG.codeOf(w), w);
      const seq = await q.evaluate(([w, m]) => { const c = PHG.codeOf(w), p = /^(qu|[a-z])([aeiou])([a-z]+)$/.exec(w); return m === 1 ? [PH2.partCode(c, 'iv'), null, c] : [null, PH2.partCode(c, 've'), c]; }, [w, m]);
      const s = r.say.join(); ok(s.indexOf(m === 1 ? seq[0] : seq[1]) >= 0 && s.lastIndexOf(code) > s.indexOf(m === 1 ? seq[0] : seq[1]), tag + ' 小學堂 拼法 ' + m + ' 不對 ' + w + '：' + s);
      ok(!q.__er.length, tag + ' 小學堂 有 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ⑤ 字卡：點 母音 字首 不 變、點 W 一定 變 W、例外 字 對齊 */
    { const q = await page('/phonics/index.html');
      const r = await q.evaluate(() => { curEnd = 'r'; buildDeck(false); go(deck.findIndex(c => c.i === 'qu' && VLIST[c.v].t === 'i')); const a = curInit();
        [...document.querySelectorAll('#vowels .btn')].find(b => b.textContent.trim() === 'a').click(); const b = curInit() + VLIST[deck[idx].v].t;
        curEnd = 'd'; buildDeck(false); go(deck.findIndex(c => c.i === 'b' && VLIST[c.v].t === 'a')); [...document.querySelectorAll('#initChips .btn')].find(x => x.textContent.trim() === 'w').click(); const c = curInit();
        curEnd = 'r'; buildDeck(false); go(deck.findIndex(c => c.i === 'b' && VLIST[c.v].t === 'a')); const cells = [...document.getElementById('grid').children], al = [];
        for (let i = 0; i < cells.length; i += 2) { const L = cells[i].getBoundingClientRect(), t = cells[i + 1].querySelector('.tile'); al.push(t ? Math.abs(t.getBoundingClientRect().left + t.getBoundingClientRect().width / 2 - L.left - L.width / 2) : -1); }
        return { a, b, c, al, xl: !!document.querySelector('.xl') }; });
      ok(r.a === 'qu' && r.b === 'qua', tag + ' 字卡 quir 點 a 沒有 變成 quar：' + r.b);
      ok(r.c === 'w', tag + ' 字卡 點 W 字首 沒有 變 W：' + r.c);
      ok(r.xl && r.al.length === 3 && r.al.every(d => d >= 0 && d < 6), tag + ' bar 例外 卡 字母 正下方 沒 對齊 ' + JSON.stringify(r.al));
      ok(!q.__er.length, tag + ' 字卡 有 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ⑥ 例外 字 頁 */
    for (const md of ['zh', 'kk', 'ipa']) { const q = await page('/phonics/exceptions.html');
      const r = await q.evaluate(md => { document.querySelector('[data-m="' + md + '"]').click(); const bad = [];
        document.querySelectorAll('.it').forEach(it => { const w = it.querySelector('[data-a^="x_"]').dataset.a.slice(2), ch = [...it.querySelectorAll('.aw .ch')];
          if (ch.map(c => c.querySelector('.lt').textContent).join('') !== w) bad.push(w + ' 字母');
          ch.forEach(c => { const l = c.querySelector('.lt').getBoundingClientRect(), t = c.querySelector('.tl').getBoundingClientRect(); if (Math.abs(l.left + l.width / 2 - t.left - t.width / 2) > 4) bad.push(w + ' ' + c.textContent); });
          if (it.getBoundingClientRect().right > innerWidth) bad.push(w + ' 超出'); }); return bad; }, md);
      ok(!r.length, tag + ' 例外 字 頁（' + md + '）沒 對齊：' + r.slice(0, 8).join('、'));
      ok(!q.__er.length, tag + ' 例外 字 頁 有 錯誤'); await q.close(); }
    await ctx.close(); }
  await br.close(); srv.close();
  E.forEach(e => console.log('❌ ' + e)); console.log('第五十次：量測 ' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
function await0(f) { return have.has(f); }
