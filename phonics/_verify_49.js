/* phonics/_verify_49.js — 2026-11-13 第四十九次 量測（只 印 失敗 項＋一行 總結）。node phonics/_verify_49.js
 *   ① 聲音：單獨 一個 音 重做（沒有 母音 ㄜ）、課本 字 每 一個 字母 的 聲音＋音節 聲音 都 有 音檔
 *   ② 從 CVC 到 課本：25 個 字 ✕ 兩種 螢幕：演完、字母 正下方 對齊 音標（不 超出）、母音 紅、不發音 灰、最後 合 回 正確 拼字、音節 ra·bbit ha·ppy
 *   ③ 錯題 解析 沒有 多餘 的 字／圖示／例字；④ 結束 頁 一定 要 聽完 錯題；⑤ 小學堂 KK／IPA 馬上 換；⑥ 拉霸機 錯 選項 避開 最 難 分 的
 *   ⑦ 圖鑑 母音 紅、新 收集 ✖2；⑧ 字卡 子音群 每 一個 字母 對齊；⑨ 🏁 25 題 闖關（組合 每次 不同、最後 10 題 自己 年級 的 課本、成績 g年級gm_ph-c25）
 *   ⑩ 現場任務（假 的 資料庫，不 連 真的 Firebase）：自己 開始、即時 進度、時間 到 送 成績；大螢幕／平板／總首頁 都 有 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const D = __dirname, ROOT = path.join(D, '..'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const have = new Set(fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, '')));
const BOOK = require('./_book.js');
/* ① */
const ISO = require('./_iso_check.json');
['b', 'd', 'g', 'p', 't', 'k', 'j', 'ch', 'm', 'n', 'f', 's', 'l', 'h', 'w', 'z', 'v', 'sh', 'th', 'dh', 'em', 'en', 'ng'].forEach(c => ok(ISO[c] && ISO[c].ok && have.has('s_' + c), '單獨 的 音 s_' + c + ' 沒有 重做 或 還 有 母音 ' + JSON.stringify(ISO[c])));
['s_ao', 's_ii', 'b-ih-g', 't-aa-p', 'h-ae-m', 'bk_kitchen', 'bk_fish'].forEach(c => ok(have.has(c), '沒有 音檔 ' + c));
for (const w in BOOK.W) { const x = BOOK.W[w]; if (x.parts) continue; const S = x.sy.split('·'); if (S.length > 1) S.forEach((s, i) => ok(have.has('sy_' + w + '_' + i), '沒有 音節 音檔 sy_' + w + '_' + i)); ok(have.has('bk_' + w), '沒有 bk_' + w); }
ok(BOOK.W.rabbit.sy === 'ra·bbit' && BOOK.W.happy.sy === 'ha·ppy', '音節 rabbit／happy 不是 老師 的 切法');
const T = t => BOOK.topics.find(x => x.t === t);
ok(T('We Can Help').gr === 3 && T('My Home').gr === 4 && /三年級 第三、四 課/.test(T('We Can Help').lb) && /四年級 第三、四 課/.test(T('My Home').lb), 'Topic 年級 標示 不對');
/* ⑩ 靜態：大螢幕、平板、總首頁、四年級／三年級 複習 頁 */
const host = fs.readFileSync(path.join(ROOT, 'live', 'host.html'), 'utf8'), stu = fs.readFileSync(path.join(ROOT, 'live', 'index.html'), 'utf8'), hub = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok((host.match(/'c25','🏁 CVC 單字 25 題 闖關'|"c25","🏁 CVC 單字 25 題 闖關"/g) || []).length >= 2 || (host.split('🏁 CVC 單字 25 題 闖關').length - 1) >= 2, '大螢幕 三、四年級 沒有 🏁 CVC 單字 25 題 闖關');
ok(/CRS\.set==='c25'\|\|crLW\(\)/.test(host), '大螢幕 c25 不是 限時＋即時 排行榜');
ok(/phonics\/games\.html\?live=/.test(stu), '平板 沒有 跳到 phonics/games.html?live=');
ok(/phonics\/games\.html\?c25=3/.test(hub) && /phonics\/games\.html\?c25=4/.test(hub), '總首頁 沒有 三、四年級 25 題 闖關');
['g3mid/index.html', 'midterm/index.html'].forEach(f => ok(/v\.set==='c25'/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')), f + ' 沒有 c25 轉 到 phonics'));
const bank = fs.readFileSync(path.join(ROOT, 'score', '_bank.js'), 'utf8'); ok(/c25: '🏁 CVC 單字 25 題 闖關'/.test(bank) && /bksp: '🧩 音標 密碼 拼字'/.test(bank), '老師看板 題庫 沒有 c25／bksp');
function serve() { return new Promise(r => { const TY = { '.html': 'text/html', '.js': 'text/javascript', '.mp3': 'audio/mpeg' };
  const s = http.createServer((q, w) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { w.writeHead(404); w.end(); return; } w.writeHead(200, { 'content-type': TY[path.extname(f)] || 'application/octet-stream' }); w.end(b); }); });
  s.listen(0, '127.0.0.1', () => r([s, 'http://127.0.0.1:' + s.address().port])); }); }
(async () => { const [srv, U] = await serve(), br = await chromium.launch();
  for (const vp of [[1024, 768], [1920, 1080]]) { const tag = vp.join('×');
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/fonts\.googleapis|fonts\.gstatic|firebasedatabase|firebaseio/, r => r.abort());
    await ctx.addInitScript(() => { window.__PLAYED = []; HTMLMediaElement.prototype.play = function () { const a = this; window.__PLAYED.push(a.src); setTimeout(() => a.onended && a.onended(), 15); return Promise.resolve(); };
      window.__PHFAST = 1; window.__PHGAIN = []; try { localStorage.clear(); } catch (e) {} });
    const page = async (url, init) => { const q = await ctx.newPage(); q.__er = []; q.on('pageerror', e => q.__er.push(e.message)); if (init) await q.addInitScript(init); await q.goto(U + url); await q.waitForTimeout(150); return q; };
    /* ② 從 CVC 到 課本：每 一個 字 */
    { const q = await page('/phonics/games.html', () => { window.__PHAUTO = 1; window.__PHBR = []; });
      const L = await q.evaluate(() => PHG.bkOrder());
      ok(L.length === 25 && L[0] === 'strong' && L[24] === 'fish', tag + ' 課本 字 順序（三年級 在 前）不對 ' + L.slice(0, 2));
      for (const w of L) { await q.evaluate(w => PHG.bridgeOpen(w), w);
        for (let t = 0; t < 120; t++) { await q.waitForTimeout(60); if (await q.evaluate(w => window.__PHBR.indexOf(w) >= 0, w)) break; }
        const r = await q.evaluate(w => { const b = document.querySelector('.brg .bw2'), gp = [...b.querySelectorAll('.bgp')];
          const mis = gp.filter(g => { const l = g.querySelector('.bgl').getBoundingClientRect(), t = g.querySelector('.tls'); return t.scrollWidth > l.width + 6 || Math.abs(t.getBoundingClientRect().left - l.left) > 4; }).map(g => g.textContent.slice(0, 4));
          const cls = gp.map(g => [...g.querySelectorAll('.bgl i')].map(i => i.textContent + ':' + i.className.replace(/ ?on/, '')).join(','));
          return { done: window.__PHBR.indexOf(w) >= 0, bars: b.classList.contains('bars'), split: b.classList.contains('split'), word: [...b.querySelectorAll('.bgl i')].map(i => i.textContent).join(''), mis, cls: cls.join(' '),
            ov: document.documentElement.scrollWidth > innerWidth + 1 || b.getBoundingClientRect().right > innerWidth + 1, small: [...b.querySelectorAll('.tl,.tl span:not(.sup)')].filter(e => e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 15).length,
            em: !!document.querySelector('.bres .em'), lb: document.querySelector('.brg .lh').textContent }; }, w);
        ok(r.done && !r.bars && !r.split && r.word === w.replace(/ /g, '') && r.em, tag + ' 課本 動畫 ' + w + ' 沒有 演完 或 最後 不是 正確 拼字 ' + JSON.stringify(r).slice(0, 200));
        ok(!r.mis.length && !r.ov && !r.small, tag + ' 課本 ' + w + ' 字母 下面 的 音標 沒有 對齊／超出／太 小 ' + JSON.stringify([r.mis, r.ov, r.small]));
        ok(/Topic 2: (We Can Help（我們可以幫忙）　三年級|My Home（我的家）　四年級) 第三、四 課/.test(r.lb), tag + ' ' + w + ' 沒有 Topic 年級 標示 ' + r.lb);
        const want = { where: ['h:lc-x', 'e:lc-x', 'w:lc-c'], kitchen: ['t:lc-x', 'i:lc-v', 'c:lc-dg'], tired: ['e:lc-x', 'i:lc-v'], bathroom: ['a:lc-v', 'o:lc-vt', 't:lc-dg', 'h:lc-dg'], happy: ['a:lc-v', 'y:lc-v'], fish: ['s:lc-dg', 'h:lc-dg'], turtle: ['e:lc-x'] }[w];
        if (want) want.forEach(x => ok(r.cls.indexOf(x) >= 0, tag + ' ' + w + ' 字母 顏色 不對（要 ' + x + '）' + r.cls)); }
      /* 音標：tired 的 r ＝ ㄦ、fish 的 sh ＝ ㄕ、kitchen 的 i ＝ ㄜ＋一；換 KK 馬上 換 */
      await q.evaluate(() => PHG.bridgeOpen('tired')); await q.waitForTimeout(200);
      const zh = await q.evaluate(() => [...document.querySelectorAll('.brg .bgp')].map(g => g.querySelector('.tls').textContent).join('|'));
      ok(zh.split('|')[2] === 'ㄦ' && zh.split('|')[3] === '', tag + ' tired 的 r 不是 ㄦ 或 e 不是 不發音 ' + zh);
      await q.evaluate(() => PHG.bridgeOpen('fish')); await q.waitForTimeout(200);
      ok((await q.evaluate(() => [...document.querySelectorAll('.brg .bgp')][2].querySelector('.tls').textContent)) === 'ㄕ', tag + ' fish 的 sh 不是 ㄕ');
      await q.evaluate(() => PHG.bridgeOpen('kitchen')); await q.waitForTimeout(200);
      ok((await q.evaluate(() => [...document.querySelectorAll('.brg .bgp')][1].querySelector('.tls').textContent)) === 'ㄜ一', tag + ' kitchen 的 i 不是 一ㄜ');
      await q.click('[data-md="kk"]'); await q.waitForTimeout(80);
      ok((await q.evaluate(() => [...document.querySelectorAll('.brg .bgp')][1].querySelector('.tls').textContent)) === 'ɪ', tag + ' 課本 換 KK 沒有 馬上 換');
      await q.click('[data-md="zh"]');
      /* 音節 */
      await q.evaluate(() => PHG.bridgeOpen('rabbit')); for (let t = 0; t < 80; t++) { await q.waitForTimeout(40); if (await q.evaluate(() => /音節/.test(document.getElementById('bst').textContent))) break; }
      ok(/ra · bbit/.test(await q.evaluate(() => document.getElementById('bst').textContent)), tag + ' rabbit 音節 不是 ra · bbit');
      /* 拉霸機 錯 選項 */
      const sn = await q.evaluate(() => { const bad = []; const H = PHG.HARDV, C = PHG.CNEAR; const P = w => /^(qu|[a-z])([aeiou])(ck|[a-z])$/.exec(w);
        PHG.realOf().concat(PHG.pseOf()).forEach(w => { for (let k = 0; k < 4; k++) { const o = PHG.slotNear(w), p = P(w); let vd = 0;
          o.forEach(x => { const q = P(x); const d = [1, 2, 3].filter(i => q[i] !== p[i]); if (d.length !== 1) bad.push(w + '>' + x); if (d[0] === 2) { vd++; if (H[p[2]].indexOf(q[2]) >= 0) bad.push('hard ' + w + '>' + x); if (p[1] === 'w' && 'ao'.indexOf(p[2]) >= 0 && 'ao'.indexOf(q[2]) >= 0) bad.push('w ' + w + '>' + x); } });
          if (o.length !== 2 || vd > 1) bad.push('n ' + w + ':' + o); } }); return bad; });
      ok(!sn.length, tag + ' 拉霸機 錯 選項 太 難 分 ' + sn.slice(0, 5));
      ok(!q.__er.length, tag + ' 課本 頁 JS 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ③④⑦ 錯題 解析 精簡、結束 頁 強制 聽、新 收集 ✖2 */
    { const q = await page('/phonics/games.html', () => { window.__PHAUTO = 1; window.__TIPS = [];
        Object.defineProperty(window, '__PHWRONG', { get() { return !!(window.PHG && PHG.G && PHG.G.q === 1); } });
        new MutationObserver(() => { const er = document.getElementById('endRow'); if (er && window.__ROW0 === undefined) window.__ROW0 = er.hidden && !!document.getElementById('lk'); const t = document.querySelector('.fb.no .tip'); if (t && window.__TIPS.indexOf(t.innerHTML) < 0) window.__TIPS.push(t.innerHTML); }).observe(document, { childList: true, subtree: true }); });
      await q.evaluate(() => { try { SCID = '30412'; } catch (e) {} window.scLive = () => true; window.__RECS = []; window.scQAdd = r => window.__RECS.push(r); });
      await q.evaluate(() => PHG.start('vow'));
      let lockSeen = false; for (let t = 0; t < 900; t++) { await q.waitForTimeout(50); const e = await q.evaluate(() => ({ end: !!document.querySelector('.end'), lk: !!document.getElementById('lk'), row: document.getElementById('endRow') ? document.getElementById('endRow').hidden : null }));
        if (e.end && e.lk && e.row) lockSeen = true; if (e.end && !e.lk && e.row === false) break; }
      const en = await q.evaluate(() => ({ row0: window.__ROW0, heard: document.querySelectorAll('.rv .r.heard').length, rv: document.querySelectorAll('.rv .r').length, row: document.getElementById('endRow') ? document.getElementById('endRow').hidden : 'none', tips: window.__TIPS, gain: window.__PHGAIN }));
      ok((lockSeen || en.row0) && en.heard === en.rv && en.rv >= 1 && en.row === false, tag + ' 結束 頁 沒有 先 聽完 錯題 才 出現 按鈕 ' + JSON.stringify(en).slice(0, 160));
      ok(en.tips.length && en.tips.every(t => !/insect|🐛|🍎|🥚|🐙|☂️|扁扁|嘴巴 張|你 選 的 聲音|仔細 聽/.test(t)), tag + ' 錯題 解析 還有 多餘 的 字／圖示／例字 ' + JSON.stringify(en.tips));
      ok(en.gain.some(t => /📖 新 收集 ✖2/.test(t)), tag + ' 新 收集 的 字 沒有 ✖2 ' + JSON.stringify(en.gain));
      /* 圖鑑：母音 紅 */
      await q.evaluate(() => PHG.lobby()); const dx = await q.evaluate(() => { const c = document.querySelector('.book .bc:not(.no) .dw'); return c ? [...c.querySelectorAll('i')].map(i => i.textContent + ':' + i.className).join(',') : ''; });
      ok(/[aeiou]:lc-v/.test(dx) && /[^aeiou]:lc-c/.test(dx) && await q.evaluate(() => getComputedStyle(document.querySelector('.book .dw .lc-v')).color === 'rgb(255, 32, 32)'), tag + ' 圖鑑 母音 不是 紅色 ' + dx);
      ok(!q.__er.length, tag + ' 遊戲 JS 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ⑤ 小學堂 KK／IPA 馬上 換 */
    { const q = await page('/phonics/games.html'); await q.evaluate(() => PHG.lessonOpen(0)); await q.click('#lgo').catch(() => {});
      for (let t = 0; t < 60; t++) { await q.waitForTimeout(50); if (await q.evaluate(() => !!document.querySelector('#lw .tl'))) break; }
      await q.click('[data-md="kk"]'); await q.waitForTimeout(60);
      const kk = await q.evaluate(() => [...document.querySelectorAll('#lw .tls')].map(t => t.textContent).join('|'));
      await q.click('[data-md="ipa"]'); await q.waitForTimeout(60); const ip = await q.evaluate(() => [...document.querySelectorAll('#lw .tls')].map(t => t.textContent).join('|'));
      ok(/æ/.test(kk) && !/[ㄅ-ㄩ]/.test(kk) && /æ/.test(ip) && kk !== '', tag + ' 小學堂 KK／IPA 沒有 馬上 換 ' + kk + ' / ' + ip);
      await q.click('[data-md="zh"]'); ok(!q.__er.length, tag + ' 小學堂 JS 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ⑧ 字卡 子音群：每 一個 字母 正下方 一個 音標 */
    { const q = await page('/phonics/advanced.html');
      const r = await q.evaluate(() => { document.querySelector('#segInit [data-v="trip"]').click(); [...document.querySelectorAll('#initChips button')].find(b => b.textContent === 'str').click();
        const cells = [...document.querySelectorAll('#grid .cell')]; const units = []; for (let k = 0; k < cells.length; k += 2) units.push([cells[k].textContent, cells[k + 1].querySelectorAll('.tile').length]);
        const out = { str: units.slice(0, 3) };
        const eg = [...document.querySelectorAll('#segEnd [data-v]')].find(b => /2/.test(b.dataset.v)); if (eg) eg.click(); const sb = [...document.querySelectorAll('#endChips button')].find(b => b.textContent === 'st'); if (sb) sb.click();
        const c2 = [...document.querySelectorAll('#grid .cell')]; const u2 = []; for (let k = 0; k < c2.length; k += 2) u2.push([c2[k].textContent, c2[k + 1].querySelectorAll('.tile').length]); out.st = u2.slice(-2); return out; });
      ok(JSON.stringify(r.str) === '[["s",1],["t",1],["r",1]]', tag + ' 字卡 str 沒有 每 一個 字母 對齊 ' + JSON.stringify(r.str));
      ok(JSON.stringify(r.st) === '[["s",1],["t",1]]', tag + ' 字卡 字尾 st 沒有 每 一個 字母 對齊 ' + JSON.stringify(r.st));
      ok(!q.__er.length, tag + ' 進階版 JS 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ⑨ 🏁 25 題 闖關（三、四年級）*/
    for (const gr of [3, 4]) { const q = await page('/phonics/games.html', () => { window.__PHAUTO = 1; Object.defineProperty(window, '__PHWRONG', { get() { return !!(window.PHG && PHG.G && (PHG.G.q === 1 || PHG.G.q === 20)); } }); });
      await q.evaluate(() => { try { SCID = '30412'; } catch (e) {} window.scLive = () => true; window.__RECS = []; window.scQAdd = r => window.__RECS.push(r); window.__LAYS = []; });
      await q.evaluate(gr => PHG.c25Start(gr), gr); const seq1 = await q.evaluate(() => PHG.G.seq.join());
      let bad = null; for (let t = 0; t < 1500; t++) { await q.waitForTimeout(40); const L = await q.evaluate(() => { const els = [...document.querySelectorAll('#game *')].filter(e => e.offsetParent && e.children.length === 0 && e.textContent.trim());
          return { end: !!document.querySelector('.end'), out: els.filter(e => { const b = e.getBoundingClientRect(); return b.right > innerWidth + 2 || b.left < -2; }).length }; });
        if (L.out && !bad) bad = await q.evaluate(() => PHG.G && PHG.G.seq[PHG.G.q]); if (L.end) break; }
      const r = await q.evaluate(() => ({ sc: (document.querySelector('.end .sc') || {}).textContent || '', rec: window.__RECS.map(r => ({ set: r.set, n: r.qs.length, ok: r.qs.map(x => x[0]).join(''), idx: r.qs.map(x => x[5]) })), IT: PHG.ITEMS.length, BWL: PHG.BWL, seq: PHG.G ? PHG.G.seq : null }));
      const R0 = r.rec[0] || {}; const words = (R0.idx || []).slice(15).map(i => r.BWL[i - r.IT]); const topic = gr === 3 ? 'We Can Help' : 'My Home'; const TW = [].concat(...T(topic).ls.map(l => l.w));
      ok(/✅ 23 ／ 25/.test(r.sc) && r.rec.length === 1 && R0.set === 'g' + gr + 'gm_ph-c25' && R0.n === 25, tag + ' ' + gr + ' 年級 25 題 闖關 結束／成績 不對 ' + JSON.stringify([r.sc, r.rec.map(x => [x.set, x.n, x.ok])]));
      ok(words.length === 10 && words.every(w => TW.indexOf(w) >= 0) && new Set(words).size === 10 && (R0.idx || []).slice(0, 15).every(i => i >= 0 && i < r.IT), tag + ' ' + gr + ' 年級 最後 10 題 不是 自己 年級 的 課本 字 ' + JSON.stringify(words));
      ok(r.seq && r.seq.slice(0, 15).every(k => ['slot', 'ufo', 'vault', 'zhu', 'bal', 'vow', 'end', 'pic', 'train'].indexOf(k) >= 0) && r.seq.slice(15).every(k => ['bk', 'bkp', 'bksp'].indexOf(k) >= 0) && new Set(r.seq.slice(0, 15)).size >= 8, tag + ' 25 題 遊戲 組合 不對 ' + r.seq);
      ok(!bad, tag + ' ' + gr + ' 年級 25 題 有 字 超出 畫面：' + bad);
      await q.evaluate(gr => { PHG.lobby(); PHG.c25Start(gr); }, gr); const seq2 = await q.evaluate(() => PHG.G.seq.join()); ok(seq1 !== seq2, tag + ' 兩 回合 遊戲 組合 一樣');
      ok(!q.__er.length, tag + ' 25 題 JS 錯誤 ' + q.__er.join('|')); await q.close(); }
    /* ⑩ 現場任務（假 資料庫）*/
    { const q = await page('/phonics/games.html?live=0304', () => { window.__PHAUTO = 1; window.__SETS = []; const t0 = Date.now();
        window.__PHLIVE = { on: () => true, poll(p, ms, cb) { const iv = setInterval(() => cb(window.__CFG || null), 200); return () => clearInterval(iv); }, set(p, v) { window.__SETS.push([p, JSON.parse(JSON.stringify(v))]); return Promise.resolve(); } };
        window.__CFG = { on: 1, set: 'c25', t: t0, m: 'self', d: 600000 }; try { SCID = '30412'; } catch (e) {} });
      await q.evaluate(() => { try { SCID = '30412'; } catch (e) {} window.scLive = () => true; window.__RECS = []; window.scQAdd = r => window.__RECS.push(r); try { SCH.close(); } catch (e) {} PHG.crGo(); });
      for (let t = 0; t < 200; t++) { await q.waitForTimeout(50); if (await q.evaluate(() => PHG.G && PHG.G.k === 'c25' && PHG.G.q >= 3)) break; }
      const a = await q.evaluate(() => ({ live: PHG.G && PHG.G.live, gr: PHG.G && PHG.G.gr, sets: window.__SETS.filter(s => /rooms\/0304\/crp\/30412/.test(s[0])).map(s => s[1].n) }));
      ok(a.live && a.gr === 3 && a.sets.length >= 3 && a.sets[a.sets.length - 1] >= 3, tag + ' 現場任務 沒有 自己 開始 或 沒有 即時 進度 ' + JSON.stringify(a));
      await q.evaluate(() => window.xForce());
      const b = await q.evaluate(() => ({ rec: window.__RECS.map(r => [r.set, r.qs.length]), t: document.querySelector('#game h2') ? document.querySelector('#game h2').textContent : '' }));
      ok(b.rec.length === 1 && b.rec[0][0] === 'g3gm_ph-c25' && b.rec[0][1] >= 3 && /時間 到/.test(b.t), tag + ' 現場任務 時間 到 沒有 送 答了 的 題目 ' + JSON.stringify(b));
      ok(!q.__er.length, tag + ' 現場任務 JS 錯誤 ' + q.__er.join('|')); await q.close(); }
    await ctx.close(); }
  await br.close(); srv.close();
  E.forEach(e => console.log('❌ ' + e)); console.log('第四十九次 量測 ' + n + ' 項，' + E.length + ' 個 失敗');
  process.exit(E.length ? 1 : 0);
})();
