/* phonics/_verify.js — 🔤 Phonics Master＋🎮 CVC 遊戲 量測。只印 失敗 項 和 一行 總結。node phonics/_verify.js
 *   ① 每 一張 會 出現 的 字卡 都 有 音檔（照 雙語 注音 做 的 碼）；老師 點名 的 字 唸法 對；例外 字 不 出現；沒有 ♥
 *   ② 字卡 頁 兩種 螢幕：沒有 JS 錯誤、點 卡 ＝ 播 au/<碼>.mp3、翻頁 跳過 例外
 *   ③ 四個 遊戲 兩種 螢幕：玩 完 一場（3 題、答對＋答錯）、字 不 超出 畫面、主要 的 字 ≧ 20px、結束 頁 出現 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const D = __dirname, ROOT = path.join(D, '..'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const PH = require('./_ph.js'); Object.assign(PH.EXC, require('./_exc.json'));
const have = new Set(fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, '')));
/* 第四十八次：遊戲、部位、例外 字、課本 要 的 音檔 都 要 有 */
require('./_codes2.json').forEach(x => { if (!have.has(x[0])) E.push('沒有 音檔：' + x[0]); }); n++;
/* ① */
const { all } = require('./_enum.js'); let cnt = 0;
all().forEach(x => { const V = PH.VLIST[x[3]]; if (PH.skip(x[2], V, x[4])) return; cnt++; if (!have.has(x[1])) E.push('沒有 音檔：' + x[0] + ' ' + x[1]); }); n++;
const V = t => PH.VLIST.find(v => (v.key || v.t) === t);
const want = { 'c|e|d': 's-eh-d', 'qu|e|d': 'kw-eh-d', 'k|a|d': 'k-ae-d', 'k|o|d': 'k-aa-d', 'j|o|d': 'j-aa-d', 'p|i|d': 'p-ih-d', 'g|i|d': 'j-ih-d', 'j|i|d': 'j-ih-d', 'p|u|d': 'p-uh-d',
  'qu|ar|d': 'kw-ar-d', 'r|er|d': 'r-er-d', 'c|ir|d': 's-er-d', 'r|or|d': 'r-or-d', 'p|ur|d': 'p-er-d', 'n|ai|d': 'n-ai-d', 'b|oa|d': 'b-oa-d', 'b|oo_short|d': 'b-oo-d', 'q|oo_long|d': '',
  'p|ou|d': 'p-ou-d', 'z|ou|x': 'z-ou-ks', 'z|ou|t': 'z-ou-t' };
for (const k in want) { const [i, v, e] = k.split('|'); if (!want[k]) continue; const c = PH.code(i, V(v), e); ok(c === want[k] && have.has(c), '唸法 碼 不對 或 沒有 音檔：' + k + ' ➜ ' + c + '（要 ' + want[k] + '）'); }
['w|ar|d', 'w|or|d', 's|ai|d', 'g|oo_long|d', 'h|oo_long|d', 'w|oo_long|d', 'qu|a|d', 'w|a|d'].forEach(k => { const [i, v, e] = k.split('|'); ok(PH.skip(i, V(v), e), '真的 字 唸法 不一樣，應該 不放：' + k); });
ok(!PH.VOW.o.sup && !PH.RVOW.ar.sup, '♥ 還在');
ok(!/♥/.test(fs.readFileSync(path.join(D, 'index.html'), 'utf8')) && !/♥/.test(fs.readFileSync(path.join(D, 'games.html'), 'utf8')), '頁面 裡 還有 ♥');
ok(!/speechSynthesis\./.test(fs.readFileSync(path.join(D, 'index.html'), 'utf8')), '字卡 頁 還在 用 瀏覽器 語音');
function serve() { return new Promise(r => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.mp3': 'audio/mpeg' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => r([s, 'http://127.0.0.1:' + s.address().port])); }); }
(async () => { const [srv, U] = await serve(), br = await chromium.launch();
  for (const vp of [[1024, 768], [1920, 1080]]) { const tag = vp.join('×');
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/fonts\.googleapis|fonts\.gstatic|firebasedatabase|firebaseio/, r => r.abort());   /* 第四十九次：games.html 帶 了 現場任務，量測 絕對 不 連 真的 Firebase */
    await ctx.addInitScript(() => { window.__PLAYED = []; HTMLMediaElement.prototype.play = function () { const a = this; window.__PLAYED.push(a.src); setTimeout(() => a.onended && a.onended(), 20); return Promise.resolve(); }; });
    /* ② 字卡 */
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto(U + '/phonics/index.html'); await p.waitForTimeout(300);
    await p.click('#card'); await p.waitForTimeout(100);
    const c1 = await p.evaluate(() => ({ pl: window.__PLAYED.slice(-1)[0] || '', cnt: document.getElementById('counter').textContent, txt: document.getElementById('grid').textContent }));
    ok(/\/phonics\/au\/b-ae-d\.mp3$/.test(c1.pl), tag + ' 點 字卡 沒有 播 au/b-ae-d.mp3：' + c1.pl);
    /* 翻 完 一整 副（字尾 d、基礎）：每一張 播 的 檔 都 存在、沒有 例外 字 */
    const deckW = await p.evaluate(() => { const out = []; for (let k = 0; k < deck.length; k++) { idx = k; out.push(PH.spell(curInit(), curVow(), curEnd).toLowerCase() + '|' + PH.code(curInit(), curVow(), curEnd)); } idx = 0; build(); return out; });
    const XS = require('./_excshow.json');
    ok(deckW.every(x => !PH.EXC[x] || XS[x]) && deckW.every(x => XS[x] ? have.has('x_' + x.split('|')[0]) : have.has(x.split('|')[1])), tag + ' 字卡 副 裡 有 不 常見 的 例外 字 或 沒有 音檔');
    ok(deckW.indexOf('said|s-ai-d') >= 0, tag + ' 第四十八次：said（常見 例外 字）應該 放回 字卡');
    /* 換 字尾 x、進階 */
    await p.evaluate(() => { [...document.querySelectorAll('#endChips button')].find(b => b.textContent === 'x').click(); });
    await p.click('[data-v="adv"]'); await p.waitForTimeout(100);
    const c2 = await p.evaluate(() => ({ n: deck.length, ok: deck.every((c, i) => { idx = i; return !cSkip(curInit(), curVow(), curEnd); }) }));
    ok(c2.n > 50 && c2.ok, tag + ' 進階＋字尾 x 的 字卡 副 不對 ' + JSON.stringify(c2));
    const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1); ok(!ov, tag + ' 字卡 頁 左右 超出');
    ok(!errs.length, tag + ' 字卡 頁 JS 錯誤：' + errs.join(' | '));
    await p.close();
    /* ②-2 第四十八次：部位 10 顆、例外 字、按鈕 放大 不 影響 中間 的 字 */
    const p2 = await ctx.newPage(); const e2 = []; p2.on('pageerror', e => e2.push(e.message)); await p2.goto(U + '/phonics/index.html'); await p2.waitForTimeout(200);
    const pt = await p2.evaluate(() => { const r = {}; const L = parseFloat(getComputedStyle(document.querySelector('.letter')).fontSize), cr = document.getElementById('card').getBoundingClientRect(), mr = document.querySelector('main').getBoundingClientRect();
      r.L = L; r.inMain = cr.bottom <= mr.bottom + 1 && cr.top >= mr.top - 1; r.btn = Math.min(...[...document.querySelectorAll('.btn')].map(b => parseFloat(getComputedStyle(b).fontSize))); r.n = document.querySelectorAll('#segPart button').length;
      const vis = () => [...document.querySelectorAll('#grid .cell')].filter((c, i) => i % 2 === 0).map(c => c.style.visibility !== 'hidden');
      const clk = v => { document.querySelector('#segPart [data-v="' + v + '"]').click(); return { vis: vis(), src: curSrc(), hear: !!document.querySelector('.hear') }; };
      r.none = clk('none'); r.noI = clk('noI'); r.noV = clk('noV'); r.noE = clk('noE'); r.iv = clk('iv'); r.ve = clk('ve'); r.all = clk('all'); return r; });
    ok(pt.n === 10, tag + ' 部位 不是 10 顆 ' + pt.n);
    ok(pt.L >= 100 && pt.inMain, tag + ' 中間 的 字 變小 或 字卡 被 切掉 ' + JSON.stringify([pt.L, pt.inMain]));
    ok(pt.btn >= 13, tag + ' 下面 小 按鈕 沒有 放大 ' + pt.btn);
    ok(pt.none.vis.every(v => !v) && pt.none.hear && /b-ae-d/.test(pt.none.src), tag + ' 全無 不對 ' + JSON.stringify(pt.none));
    ok(JSON.stringify(pt.noI.vis) === '[false,true,true]' && JSON.stringify(pt.noV.vis) === '[true,false,true]' && JSON.stringify(pt.noE.vis) === '[true,true,false]', tag + ' 字首／母音／字尾：無 不對');
    ok(pt.iv.vis.length === 2 && /au\/b-ae\.mp3$/.test(pt.iv.src) && pt.ve.vis.length === 2 && /au\/0-ae-d\.mp3$/.test(pt.ve.src), tag + ' 字首＋母音／母音＋字尾 不對 ' + JSON.stringify([pt.iv, pt.ve]));
    ok(have.has('b-ae') && have.has('0-ae-d'), '部位 的 音檔 沒有 b-ae／0-ae-d');
    const ex = await p2.evaluate(() => { [...document.querySelectorAll('#vowels button')].find(b => b.textContent === 'ai').click(); [...document.querySelectorAll('#initChips button')].find(b => b.textContent === 's').click();
      return { xb: !!document.querySelector('.xb'), real: document.querySelectorAll('.real .tile').length, xl: !!document.querySelector('.xl'), src: curSrc(), tiles: document.querySelectorAll('#grid .tile').length }; });
    ok(ex.xb && ex.xl && ex.real === 0 && /x_said\.mp3$/.test(ex.src) && ex.tiles === 3,   /* 第五十次：真的 唸法 放在 字母 正下方 */ tag + ' said 例外 字 卡 不對 ' + JSON.stringify(ex));
    ok(!e2.length, tag + ' 字卡 頁（部位）JS 錯誤：' + e2.join(' | ')); await p2.close();
    /* ②-3 基礎版、進階版、例外 字 頁 */
    for (const f of ['basic', 'advanced']) { const p3 = await ctx.newPage(); const e3 = []; p3.on('pageerror', e => e3.push(e.message)); await p3.goto(U + '/phonics/' + f + '.html'); await p3.waitForTimeout(200);
      const r = await p3.evaluate(() => { const out = { n: 0, miss: [], ig: DK.IG.length, ov: document.documentElement.scrollWidth > innerWidth + 1 };
        for (const ig of DK.IG) { document.querySelector('#segInit [data-v="' + ig[0] + '"]').click(); for (const eg of DK.EG) { document.querySelector('#segEnd [data-v="' + eg[0] + '"]').click();
          for (const e of ENDINGS[eg[0]]) { [...document.querySelectorAll('#endChips button')].find(b => b.textContent === e).click(); for (let k = 0; k < deck.length; k++) { idx = k; out.n++; out.miss.push(curSrc()); } } } }
        idx = 0; build(); return out; });
      const miss = [...new Set(r.miss)].filter(x => !have.has(x.replace(/^au\//, '').replace(/\.mp3$/, '')));
      ok(r.n > 300 && !miss.length && !r.ov, tag + ' ' + f + ' 字卡 沒有 音檔 或 超出：' + r.n + ' 張，少 ' + miss.length + ' ' + miss.slice(0, 5));
      if (f === 'advanced') { const m = await p3.evaluate(() => { document.querySelector('#segInit [data-v="blend"]').click(); document.querySelector('#segEnd [data-v="g1"]').click();
          [...document.querySelectorAll('#endChips button')].find(b => b.textContent === 'k').click(); [...document.querySelectorAll('#vowels button')].find(b => b.textContent === 'a_e').click();
          [...document.querySelectorAll('#initChips button')].find(b => b.textContent === 'bl').click(); return { t: document.getElementById('grid').textContent, src: curSrc() }; });
        ok(/blake/.test(m.t.replace(/[^a-z]/g, '')) && /bl-ai-k/.test(m.src), tag + ' 進階版 blake（magic e）不對 ' + JSON.stringify(m)); }
      ok(!e3.length, tag + ' ' + f + ' JS 錯誤：' + e3.join(' | ')); await p3.close(); }
    { const p4 = await ctx.newPage(); const e4 = []; p4.on('pageerror', e => e4.push(e.message)); await p4.goto(U + '/phonics/exceptions.html'); await p4.waitForTimeout(200);
      const r = await p4.evaluate(() => ({ n: document.querySelectorAll('.it').length, t0: [...document.querySelectorAll('.it')].filter(i => !i.querySelector('.tile')).length, a: [...document.querySelectorAll('[data-a^="x_"]')].map(b => b.dataset.a) }));
      ok(r.n >= 100 && !r.t0 && r.a.every(a => have.has(a)), tag + ' 例外 字 頁 不對 ' + JSON.stringify({ n: r.n, t0: r.t0, miss: r.a.filter(a => !have.has(a)).slice(0, 5) }));
      ok(!e4.length, tag + ' 例外 字 頁 JS 錯誤 ' + e4.join('|')); await p4.close(); }
    /* ③ 遊戲：14 種（第四十九次 多 🧩 bksp） ✕ 一局 5 題（第 2 題 故意 答錯）＋小學堂＋課本 動畫 */
    const GS = ['slot', 'ufo', 'vault', 'zhu', 'bal', 'vow', 'end', 'lad', 'pic', 'train', 'bk', 'bkp', 'bksp'];
    for (const g of GS.concat(['ls', 'br'])) {
      const q = await ctx.newPage(); const er = []; q.on('pageerror', e => er.push(e.message));
      await q.addInitScript(() => { window.__PHFAST = 1; window.__PHAUTO = 1; window.__PHWDG = 60; window.__PHBR = []; try { localStorage.clear(); } catch (e) {}
        Object.defineProperty(window, '__PHWRONG', { get() { return !!(window.PHG && PHG.G && PHG.G.q === 1); } }); });
      await q.goto(U + '/phonics/games.html'); await q.waitForTimeout(200);
      if (g === 'slot') { const lob = await q.evaluate(() => ({ cards: document.querySelectorAll('.gc').length, small: [...document.querySelectorAll('.gc b,.gc small,.lv button,.sec h2')].filter(e => parseFloat(getComputedStyle(e).fontSize) < 17).length, book: document.querySelectorAll('.bkb').length, path: document.querySelectorAll('.pstop').length, ov: document.documentElement.scrollWidth > innerWidth + 1 }));
        ok(lob.cards === 16 && !lob.small && lob.book === 25 && lob.path === 5 && !lob.ov, tag + ' 大廳 不對（16 個 遊戲（第五十一次 多 3 種）、25 個 課本 字、5 課）' + JSON.stringify(lob)); }
      /* 成績：假 登入（不 連 真的 伺服器）*/
      await q.evaluate(() => { window.__RECS = []; window.scLive = () => true; window.scQAdd = r => window.__RECS.push(r); try { SCID = '30412'; } catch (e) {} });
      if (g === 'ls') await q.evaluate(() => PHG.lessonOpen(0)); else if (g === 'br') await q.evaluate(() => PHG.bridgeOpen('kitchen')); else await q.evaluate(g => PHG.start(g), g);
      /* 每 一題 量 版面 */
      const lays = [];
      for (let t = 0; t < 60; t++) { await q.waitForTimeout(120); const L = await q.evaluate(() => { const m = document.querySelector('main'), els = [...document.querySelectorAll('#game *')].filter(e => e.offsetParent && e.children.length === 0 && e.textContent.trim());
          return { q: PHG.G && PHG.G.q, end: !!document.querySelector('.end'), out: els.filter(e => { const b = e.getBoundingClientRect(); return b.right > innerWidth + 2 || b.left < -2; }).map(e => e.textContent.slice(0, 12)).slice(0, 3),
            small: els.filter(e => !e.closest('.tmr,.marq,.ctg,.vk small,.tgt small,.dial .cue,.sup') && parseFloat(getComputedStyle(e).fontSize) < 15).map(e => e.textContent.slice(0, 10)).slice(0, 3) }; });
        lays.push(L); if (L.end || (g === 'br' && t > 8)) break; }
      const bad = lays.filter(L => L.out.length || L.small.length);
      ok(!bad.length, tag + ' ' + g + ' 有 字 超出 畫面 或 太 小：' + JSON.stringify(bad[0]));
      if (g === 'br') { const b = await q.evaluate(() => ({ br: window.__PHBR, gp: document.querySelectorAll('.brg .bgp').length, plus: /＋/.test(document.querySelector('.brg').textContent), bars: !!document.querySelector('.bw2.bars'), em: !!document.querySelector('.bres .em') }));
        ok(b.br.indexOf('kitchen') >= 0 && b.gp === 6 && !b.plus && !b.bars && b.em, tag + ' 課本 動畫 kitchen 沒有 演完（第四十九次：6 組 字母、沒有 ＋）' + JSON.stringify(b)); }
      else { const en = await q.evaluate(() => ({ t: (document.querySelector('.end .sc') || {}).textContent || '', rk: (document.querySelector('.end .rk') || {}).textContent, rv: document.querySelectorAll('.rv .r').length, rec: window.__RECS.map(r => [r.set, r.m, r.qs.length, r.qs.map(x => x[0]).join(''), r.qs.every(x => x[5] >= 0)]) }));
        ok(/✅ 4 ／ 5/.test(en.t) && en.rk === 'A' && en.rv === 1, tag + ' ' + g + ' 結束 頁 不對（要 4／5、A、錯題 1 個）' + JSON.stringify(en));
        ok(en.rec.length === 1 && en.rec[0][0] === 'g3gm_ph-' + g && en.rec[0][1] === 'q' && en.rec[0][2] === 5 && en.rec[0][3] === '10111' && en.rec[0][4], tag + ' ' + g + ' 成績 沒有 送 或 不對 ' + JSON.stringify(en.rec)); }
      const pl = await q.evaluate(() => window.__PLAYED.filter(s => !/\/au\//.test(s) || /undefined/.test(s)));
      ok(!pl.length, tag + ' ' + g + ' 播了 不是 音檔 的 聲音 ' + pl.slice(0, 3));
      const said = await q.evaluate(() => (window.__PHSAY || []));
      ok(!er.length, tag + ' ' + g + ' JS 錯誤：' + er.join(' | '));
      await q.close();
    }
    await ctx.close();
  }
  await br.close(); srv.close();
  E.forEach(e => console.log('❌ ' + e)); console.log('Phonics Master：字卡 ' + cnt + ' 張 都 有 音檔；量測 ' + n + ' 項，' + E.length + ' 個 失敗');
  process.exit(E.length ? 1 : 0);
})();
