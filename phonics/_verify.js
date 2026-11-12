/* phonics/_verify.js — 🔤 Phonics Master＋🎮 CVC 遊戲 量測。只印 失敗 項 和 一行 總結。node phonics/_verify.js
 *   ① 每 一張 會 出現 的 字卡 都 有 音檔（照 雙語 注音 做 的 碼）；老師 點名 的 字 唸法 對；例外 字 不 出現；沒有 ♥
 *   ② 字卡 頁 兩種 螢幕：沒有 JS 錯誤、點 卡 ＝ 播 au/<碼>.mp3、翻頁 跳過 例外
 *   ③ 四個 遊戲 兩種 螢幕：玩 完 一場（3 題、答對＋答錯）、字 不 超出 畫面、主要 的 字 ≧ 20px、結束 頁 出現 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const D = __dirname, ROOT = path.join(D, '..'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const PH = require('./_ph.js'); Object.assign(PH.EXC, require('./_exc.json'));
const have = new Set(fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, '')));
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
    await ctx.route(/fonts\.googleapis|fonts\.gstatic/, r => r.abort());
    await ctx.addInitScript(() => { window.__PLAYED = []; HTMLMediaElement.prototype.play = function () { const a = this; window.__PLAYED.push(a.src); setTimeout(() => a.onended && a.onended(), 20); return Promise.resolve(); }; });
    /* ② 字卡 */
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto(U + '/phonics/index.html'); await p.waitForTimeout(300);
    await p.click('#card'); await p.waitForTimeout(100);
    const c1 = await p.evaluate(() => ({ pl: window.__PLAYED.slice(-1)[0] || '', cnt: document.getElementById('counter').textContent, txt: document.getElementById('grid').textContent }));
    ok(/\/phonics\/au\/b-ae-d\.mp3$/.test(c1.pl), tag + ' 點 字卡 沒有 播 au/b-ae-d.mp3：' + c1.pl);
    /* 翻 完 一整 副（字尾 d、基礎）：每一張 播 的 檔 都 存在、沒有 例外 字 */
    const deckW = await p.evaluate(() => { const out = []; for (let k = 0; k < deck.length; k++) { idx = k; out.push(PH.spell(curInit(), curVow(), curEnd).toLowerCase() + '|' + PH.code(curInit(), curVow(), curEnd)); } idx = 0; build(); return out; });
    ok(deckW.every(x => !PH.EXC[x]) && deckW.every(x => have.has(x.split('|')[1])), tag + ' 字卡 副 裡 有 例外 字 或 沒有 音檔');
    ok(deckW.indexOf('good|g-uu-d') < 0 && deckW.indexOf('said|s-ai-d') < 0, tag + ' good／said 還在 字卡 裡');
    /* 換 字尾 x、進階 */
    await p.evaluate(() => { [...document.querySelectorAll('#endChips button')].find(b => b.textContent === 'x').click(); });
    await p.click('[data-v="adv"]'); await p.waitForTimeout(100);
    const c2 = await p.evaluate(() => ({ n: deck.length, ok: deck.every((c, i) => { idx = i; return !PH.skip(curInit(), curVow(), curEnd); }) }));
    ok(c2.n > 50 && c2.ok, tag + ' 進階＋字尾 x 的 字卡 副 不對 ' + JSON.stringify(c2));
    const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1); ok(!ov, tag + ' 字卡 頁 左右 超出');
    ok(!errs.length, tag + ' 字卡 頁 JS 錯誤：' + errs.join(' | '));
    await p.close();
    /* ③ 遊戲 */
    for (const g of ['slot', 'ufo', 'vault', 'zhu']) {
      const q = await ctx.newPage(); const er = []; q.on('pageerror', e => er.push(e.message));
      await q.addInitScript(() => { window.__PHN = 3; window.__PHFAST = 1; window.__PHAUTO = 1; window.__PHWDG = 60; try { localStorage.clear(); } catch (e) {} });
      await q.goto(U + '/phonics/games.html'); await q.waitForTimeout(200);
      const lob = await q.evaluate(() => ({ cards: document.querySelectorAll('.gc').length, small: [...document.querySelectorAll('.gc b,.gc small,.lvrow button')].filter(e => parseFloat(getComputedStyle(e).fontSize) < 18).length }));
      ok(lob.cards === 4 && !lob.small, tag + ' 大廳 不是 4 個 遊戲 或 字 太 小 ' + JSON.stringify(lob));
      await q.click('[data-go="' + g + '"]');
      for (let k = 0; k < 3; k++) {
        const right = k !== 1;
        if (g === 'slot') { await q.waitForSelector('[data-pk]:not([disabled])', { timeout: 15000 }).catch(() => E.push(tag + ' 拉霸機 沒有 出現 三個 聲音 選項'));
          const lay = await q.evaluate(() => { const r = [...document.querySelectorAll('.reel,.ch,.zrow .tl')].map(e => e.getBoundingClientRect()); return { out: r.filter(b => b.right > innerWidth + 1 || b.left < -1).length, reels: document.querySelectorAll('.reel').length, z: document.querySelectorAll('.zrow .tl').length, big: parseFloat(getComputedStyle(document.querySelector('.reel b')).fontSize) }; });
          ok(lay.reels === 3 && lay.z >= 3 && !lay.out && lay.big >= 80, tag + ' 拉霸機 版面 不對 ' + JSON.stringify(lay));
          await q.evaluate(r => { const btns = [...document.querySelectorAll('#chz [data-pk]')], pl = window.__PLAYED.slice(-3).map(s => s.split('/au/')[1].replace('.mp3', '')), good = pl.indexOf(codeOf(G.w));
            btns[r ? good : (good + 1) % btns.length].click(); }, right);
        } else if (g === 'ufo') { await q.waitForSelector('.ufo'); const lay = await q.evaluate(() => { const r = [...document.querySelectorAll('.ufo')].map(e => e.getBoundingClientRect()), s = document.getElementById('sky').getBoundingClientRect(); return { n: r.length, out: r.filter(b => b.right > s.right + 2 || b.left < s.left - 2 || b.bottom > s.bottom + 2 || b.top < s.top - 2).length, fs: parseFloat(getComputedStyle(document.querySelector('.ufo .w')).fontSize) }; });
          ok(lay.n === 4 && !lay.out && lay.fs >= 40, tag + ' 飛碟 版面 不對 ' + JSON.stringify(lay));
          await q.evaluate(r => { const u = [...document.querySelectorAll('.ufo')]; const t = u.find(x => x.dataset.w === G.w); (r ? t : u.find(x => x !== t)).click(); }, right);
        } else if (g === 'vault') { await q.waitForSelector('.dial'); const lay = await q.evaluate(() => { const r = [...document.querySelectorAll('.dial')].map(e => e.getBoundingClientRect()); return { out: r.filter(b => b.right > innerWidth + 1 || b.bottom > innerHeight + 1).length, fs: parseFloat(getComputedStyle(document.querySelector('.dial .face b')).fontSize) }; });
          ok(!lay.out && lay.fs >= 70, tag + ' 保險箱 版面 不對（超出 畫面 或 字 太 小）' + JSON.stringify(lay));
          for (let t = 0; t < (right ? 1 : 2); t++) {
            await q.evaluate(r => { const w = G.w.split(''); [0, 1, 2].forEach(k => { const d = document.getElementById('d' + k); for (let s = 0; s < 6; s++) { if (d.querySelector('.face b').textContent === w[k] || d.classList.contains('okd')) break; d.querySelector('[data-d="1"]').click(); } if (!r && k === 0 && d.querySelector('.face b').textContent === w[0] && !d.classList.contains('okd')) d.querySelector('[data-d="1"]').click(); }); document.getElementById('open').click(); }, right);
            await q.waitForTimeout(80); }
        } else { await q.waitForSelector('.opt'); const lay = await q.evaluate(() => ({ n: document.querySelectorAll('.opt').length, out: [...document.querySelectorAll('.opt,.word0')].map(e => e.getBoundingClientRect()).filter(b => b.right > innerWidth + 1).length, diff: new Set([...document.querySelectorAll('.opt')].map(o => o.textContent)).size }));
          ok(lay.n === 3 && !lay.out && lay.diff === 3, tag + ' 注音 選項 不對（要 3 排、不一樣、不 超出）' + JSON.stringify(lay));
          await q.evaluate(r => { const T = tiles(G.w).map(x => [].concat(x.t).join('') + (x.sup || '')).join(''); const o = [...document.querySelectorAll('.opt')]; const g0 = o.find(b => [...b.querySelectorAll('.tl')].map(x => x.textContent).join('') === T); (r ? g0 : o.find(b => b !== g0)).click(); }, right);
        }
        await q.waitForTimeout(400);
        if (k < 2) await q.waitForFunction(n => G && G.q === n, k + 1, { timeout: 15000 }).catch(() => E.push(tag + ' ' + g + ' 第 ' + (k + 1) + ' 題 以後 沒有 下一題'));
      }
      await q.waitForSelector('.end', { timeout: 15000 }).catch(() => E.push(tag + ' ' + g + ' 沒有 結束 頁'));
      const en = await q.evaluate(() => ({ t: (document.querySelector('.end .sc') || {}).textContent || '', rv: document.querySelectorAll('.rv .r').length, best: localStorage.getItem('phm_best_' + G.k) }));
      ok(/答對 2 ／ 3 題/.test(en.t) && en.rv === 1, tag + ' ' + g + ' 結束 頁 不對（要 答對 2／3、答錯 1 個 字）' + JSON.stringify(en));
      const pl = await q.evaluate(() => window.__PLAYED.filter(s => !/\/au\//.test(s) || /undefined/.test(s)));
      ok(!pl.length, tag + ' ' + g + ' 播了 不是 音檔 的 聲音 ' + pl.slice(0, 3));
      ok(!er.length, tag + ' ' + g + ' JS 錯誤：' + er.join(' | '));
      await q.close();
    }
    await ctx.close();
  }
  await br.close(); srv.close();
  E.forEach(e => console.log('❌ ' + e)); console.log('Phonics Master：字卡 ' + cnt + ' 張 都 有 音檔；量測 ' + n + ' 項，' + E.length + ' 個 失敗');
  process.exit(E.length ? 1 : 0);
})();
