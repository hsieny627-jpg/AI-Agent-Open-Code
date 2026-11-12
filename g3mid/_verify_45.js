/* 2026-11-09 第四十五次 量測：📝 三年級 成長測驗 25 題（set g25）。不連 真的 成績 伺服器、不連 Firebase。只 印 失敗 項。node g3mid/_verify_45.js
   ① 題目：25 題 ＝ 15／6／4、開頭 的 音 3 一樣＋3 不一樣、常用語 4 張 圖 不同；連 做 3 回：常用語、開頭 的 音 不 重複，字母 先 出 沒 寫過 的
   ② 三 種 螢幕（1024×768 iPad 橫、820×1180 iPad 直、1920×1080 教室 大 螢幕）：每 一關 畫面 不 超出、按鈕 夠 大、字 夠 大
   ③ 🔤 寫 大寫 對 ➜ 換 小寫；寫錯 ＝ 綠底 答錯頁（大寫＋小寫 兩個 四線格、唸 2 次、▶ 下一題）
   ④ 👂 ⭕／❌ 兩顆、答錯頁（兩個 字＋圖＋中文＋開頭 的 音）、答對頁
   ⑤ 🖼 三張 圖 都 畫 出來、答錯頁 有 正確 的 圖＋逐字 中文
   ⑥ 成績 代號 g3gm_g3m-g25；⚡ 現場任務 set g25 大廳 只 有 成長測驗 一顆 */
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0;
const ok = (c, m) => { n++; if (!c) E.push(m); };
(async () => {
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) {
    const tag = vp.join('×');
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.addInitScript(() => { Object.assign(window, { __NOUNLOCK: 1, __NODFXI: 1, __NOSNH: 1, __NOGO: 1, __NORVA: 1, __NOWB: 1, __NOTUT: 1, __FBWDG: 900, __WRVFAST: 1, __NOGO2: 1 });
      HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 30); return Promise.resolve(); };
      localStorage.setItem('g3m_war', '"b01"'); });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, 'g3mid', 'index.html')); await p.waitForTimeout(700);
    await p.evaluate(() => document.querySelectorAll('.scfull').forEach(x => x.remove()));
    if (vp[0] === 1024) {   /* ① 題目 */
      const r = await p.evaluate(() => { const out = []; for (let k = 0; k < 4; k++) { XBK = 'G'; XQUIET = 1; startGT(25); XQUIET = 0; out.push({ lv: R.lvOf.slice(), q: R.qs.map(q => GTALL.indexOf(q)), same: R.qs.filter(q => q.a && q.same).length, gcK: R.qs.filter(q => q.k).map(q => q.k) }); } return out; });
      r.forEach((x, k) => {
        ok(x.q.length === 25 && x.q.every(i => i >= 0), tag + ' 第 ' + (k + 1) + ' 回 不是 25 題 或 題目 不在 題庫');
        ok([0, 1, 2].map(l => x.lv.filter(v => v === l).length).join() === '15,6,4', tag + ' 三 關 題數 不是 15／6／4');
        ok(x.same === 3, tag + ' 開頭 的 音 一樣 的 不是 3 題');
        ok(new Set(x.gcK).size === 4, tag + ' 常用語 4 題 的 圖 有 重複');
      });
      const GC0 = await p.evaluate(() => GTALL.indexOf(GT.GC.filter(q => q.say === 'Close your book.')[0])), gs = r.slice(0, 3).map(x => x.q.filter(i => (i >= 26 && i < 78) || i >= 93)), gc = r.slice(0, 3).map(x => x.q.filter(i => i >= 78 && i < 93 && i !== GC0));   /* 第四十七次：Close your book. 每 一回 一定 出（TOP）*/
      { const GA = require('./_gt_data.js').GTALL; r.forEach((x, k) => { const Q = x.q.map(i => GA[i]).filter(q => q && q.a);
        ok(Q.filter(q => q.same && ['m', 'h', 'b', 'y'].indexOf(q.on) >= 0).length >= 2 && Q.some(q => !q.same && ((q.on === 'f' && q.on2 === 'v') || (q.on === 'v' && q.on2 === 'f'))), tag + ' 第 ' + (k + 1) + ' 回 開頭 的 音 沒有 通過率 最低 的 題型（一樣 m／h／b／y ≧ 2、不一樣 f／v）'); }); }
      r.forEach((x, k) => ok(x.q.indexOf(GC0) >= 0 && ['n', 'q', 'j'].every(c => x.q.indexOf(c.charCodeAt(0) - 97) >= 0), tag + ' 第 ' + (k + 1) + ' 回 沒有 通過率 最低 的 題型（N Q J、Close your book.）'));
      ok(new Set([].concat(...gs)).size === 18, tag + ' 連 3 回 開頭 的 音 有 重複');
      ok(new Set([].concat(...gc)).size === 9, tag + ' 連 3 回 常用語 有 重複');
      const l1 = r[0].q.filter(i => i < 26), l2 = r[1].q.filter(i => i < 26);
      ok(l2.filter(i => l1.indexOf(i) < 0).length === 11, tag + ' 第 2 回 字母 沒有 先 出 沒寫過 的 11 個');
      ok(await p.evaluate(() => { XBK = 'G'; XQUIET = 1; startGT(25); XQUIET = 0; return recObj().set; }) === 'g3gm_g3m-g25', tag + ' 成績 代號 不是 g3gm_g3m-g25');
      /* ⑥ 現場任務 大廳 */
      const lb = await p.evaluate(() => { CR = { cfg: { set: 'g25', on: 1 } }; try { lobby(); } catch (e) { return 'err ' + e.message; } const v = [].filter.call(document.querySelectorAll('#xrow [data-x]'), b => (b.closest('.xbw') || b).style.display !== 'none' && b.offsetParent); const r = v.map(b => b.getAttribute('data-bk') + b.textContent); CR = null; return r; });
      /* 第 3 點：🔤 聽 字母 寫 ＝ 🌌 星座、✍️ 字母 書寫 ＝ 🥚 神獸 蛋、🎧 ＝ 🪄 魔法（每 一種 不一樣）*/
      for (const [m, bk, vb] of [['la', '🌌 星空 圖', '點亮 了'], ['lw', '🥚 神獸 圖鑑', '孵出 了'], ['lf', '📖 魔法 書', '變成 了']]) {
        const r3 = await p.evaluate(async ([m]) => { CR = null; window.__NOLWI = 1; if (typeof SCON !== 'undefined') SCON = 0; try { startLW(m); } catch (e) { return { err: e.message }; } await new Promise(s => setTimeout(s, 400)); document.querySelectorAll('#lwi,.lwo,#lwo').forEach(x => x.remove && x.hidden !== undefined && (x.hidden = true));
          if (R.k < 0) { try { next(); } catch (e) { } await new Promise(s => setTimeout(s, 300)); }
          const book = (document.querySelector('.mgb .mgl') || {}).textContent || '', intro = (() => { const d = document.createElement('div'); mgIntro(d); return d.textContent; })();
          BUSY = false; mgWin(R.q, document.querySelector('.mirror') || document.body); await new Promise(s => setTimeout(s, 120)); const w = (document.getElementById('mgo') || {}).textContent || ''; const o = document.getElementById('mgo'); if (o) o.remove(); return { book, intro, w, end: mgEnd() }; }, [m]);
        ok(!r3.err && r3.book === bk, tag + ' ' + m + ' 收集 書 不是「' + bk + '」：' + JSON.stringify(r3).slice(0, 160));
        ok(new RegExp(vb).test(r3.w) && /寫錯/.test(r3.intro), tag + ' ' + m + ' 寫對 的 獎勵 動畫／開場 規則 不對 ' + (r3.w || '').slice(0, 80));
      }
      await p.evaluate(() => { try { lobby(); } catch (e) { } });
      /* 第 4 點：兩人 輪流 計分 秒懂 動畫 */
      const du = await p.evaluate(async () => { DUOI.intro('30401', '30402', '30401', function () { }); await new Promise(s => setTimeout(s, 300)); const o = document.getElementById('duoi'), t = [...o.querySelectorAll('.dtly')].map(x => ({ n: x.querySelectorAll('.dsq i').length, no: x.querySelectorAll('.dsq i.no').length, t: x.textContent }));
        const end = DUOI.tallyR('30401', 'p1', [[1], [0], [1], [1]], 75); o.classList.remove('on'); o.innerHTML = ''; return { t, q: o ? 1 : 0, end }; });
      ok(du.t.length === 2 && du.t[0].n === 12 && du.t[0].no === 3 && /9 ÷ 12/.test(du.t[0].t) && /75 分/.test(du.t[0].t) && du.t[1].n === 13 && /92.3 分/.test(du.t[1].t), tag + ' 兩人 輪流 計分 動畫 不對 ' + JSON.stringify(du.t).slice(0, 200));
      ok(/3 ÷ 4/.test(du.end) && /75 分/.test(du.end), tag + ' 兩人 輪流 結束 頁 小 卡 不對 ' + du.end.slice(0, 120));
      ok(Array.isArray(lb) && lb.length === 1 && /^G/.test(lb[0]) && /成長測驗/.test(lb[0]), tag + ' 現場任務 g25 大廳 不是 只 有 成長測驗 一顆：' + JSON.stringify(lb));
    }
    /* ②～⑤ 每 一關 */
    await p.evaluate(() => { CR = null; XBK = 'G'; startGT(25); });
    const lvFirst = await p.evaluate(() => [0, 1, 2].map(l => R.lvOf.indexOf(l)));
    for (const [l, gid] of [[0, 'gl'], [1, 'gs'], [2, 'gc']]) {
      await p.evaluate(k => { QID++; stopSay(); $('#fb').classList.remove('on'); FBN++; R.k = k - 1; R.lv = -1; next(); }, lvFirst[l]);
      await p.waitForTimeout(gid === 'gl' ? 900 : 2600);
      const v = await p.evaluate(() => { const st = $('#stage'), W = innerWidth, Hh = innerHeight, out = []; st.querySelectorAll('button,canvas,.gcp,.ask').forEach(e => { const r = e.getBoundingClientRect(); if (!r.width) return; if (r.left < -1 || r.right > W + 1 || r.bottom > Hh + 1) out.push((e.className || e.tagName) + ' 超出 ' + Math.round(r.right) + ',' + Math.round(r.bottom)); });
        const small = [].filter.call(st.querySelectorAll('button'), b => { const r = b.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44); }).map(b => b.className);
        return { gid: G.id, out, small, ask: parseFloat(getComputedStyle(st.querySelector('.ask') || st).fontSize), svg: st.querySelectorAll('.gcp svg,.gcp img').length, gsk: st.querySelectorAll('.gsk').length, step: (st.querySelector('.glstep') || {}).textContent || '' }; });
      ok(v.gid === gid, tag + ' 第 ' + (l + 1) + ' 關 不是 ' + gid + '：' + v.gid);
      ok(!v.out.length, tag + ' ' + gid + ' 超出 畫面：' + v.out.join(' | '));
      ok(!v.small.length, tag + ' ' + gid + ' 按鈕 太小：' + v.small.join(' | '));
      ok(v.ask >= 20, tag + ' ' + gid + ' 題目 說明 字 太小 ' + v.ask);
      if (gid === 'gc') ok(v.svg === 3, tag + ' 🖼 不是 三張 圖：' + v.svg);
      if (gid === 'gs') ok(v.gsk === 2, tag + ' 👂 不是 ⭕／❌ 兩顆');
      if (gid === 'gl') {
        ok(/① 大寫/.test(v.step) && /② 小寫/.test(v.step), tag + ' 🔤 沒有 ① 大寫 ➜ ② 小寫 步驟');
        /* 大寫 對 ➜ 換 小寫 */
        const s2 = await p.evaluate(async () => { BUSY = false; WOK(R.glq); await new Promise(s => setTimeout(s, 1700)); return { want: R.glq.want, q: R.q.lo, on: ($('.glstep .on') || {}).textContent || '' }; });
        ok(s2.want === s2.q && /② 小寫/.test(s2.on), tag + ' 🔤 寫 大寫 對 了 沒有 換 小寫 ' + JSON.stringify(s2));
        /* 寫錯 ＝ 答錯頁 */
        const f = await p.evaluate(async () => { R.lastImg = null; miss('draw'); await new Promise(s => setTimeout(s, 700)); const x = $('#fbx'); return { on: $('#fb').classList.contains('on'), cv: x.querySelectorAll('#ltr canvas').length, n3: x.querySelectorAll('#n3 span').length, tr: (x.querySelector('.tr') || {}).textContent || '' }; });
        ok(f.on && f.cv === 2 && f.n3 === 2 && /大寫/.test(f.tr), tag + ' 🔤 答錯頁 不對（要 大寫＋小寫 兩個 四線格、唸 2 次、整句）' + JSON.stringify(f));
        await p.waitForTimeout(4500);
        ok(await p.evaluate(() => !!$('#fbn') || !$('#fb').classList.contains('on')), tag + ' 🔤 答錯頁 唸完 沒有 ▶ 下一題');
      }
      if (gid === 'gs') {
        const f = await p.evaluate(async () => { BUSY = false; const q = R.q, b = [].filter.call(document.querySelectorAll('.gsk'), x => !x.classList.contains(q.o[0]))[0]; b.click(); await new Promise(s => setTimeout(s, 700)); const x = $('#fbx'); return { on: $('#fb').classList.contains('on'), f: x.querySelectorAll('.gsf').length, yp: (x.querySelector('.yp') || {}).textContent || '', em: [].map.call(x.querySelectorAll('.gsf em'), e => e.textContent).join() }; });
        ok(f.on && f.f === 2 && /Same|Different/.test(f.yp) && /\/\w\/,\/\w\//.test(f.em), tag + ' 👂 答錯頁 不對 ' + JSON.stringify(f));
      }
      if (gid === 'gc') {
        const f = await p.evaluate(async () => { BUSY = false; const q = R.q, b = [].filter.call(document.querySelectorAll('.gcp'), x => x.dataset.k !== q.k)[0]; b.click(); await new Promise(s => setTimeout(s, 700)); const x = $('#fbx'); return { on: $('#fb').classList.contains('on'), pic: x.querySelectorAll('.gcfb svg,.gcfb img').length, gw: x.querySelectorAll('.gls .gw').length, zh: [].every.call(x.querySelectorAll('.gls .gw i'), i => i.textContent.trim()), yp: x.querySelectorAll('.yp svg,.yp img').length }; });
        ok(f.on && f.pic === 1 && f.gw >= 1 && f.zh && f.yp === 1, tag + ' 🖼 答錯頁 不對（正確 的 圖、你選的 圖、每個 英文 字 下面 中文）' + JSON.stringify(f));
      }
    }
    /* 答對頁（👂）*/
    const okp = await p.evaluate(async k => { QID++; stopSay(); $('#fb').classList.remove('on'); FBN++; R.k = k - 1; R.lv = -1; next(); await new Promise(s => setTimeout(s, 300)); BUSY = false; const q = R.q; [].filter.call(document.querySelectorAll('.gsk'), x => x.classList.contains(q.o[0]))[0].click(); for (let t = 0; t < 40; t++) { await new Promise(s => setTimeout(s, 50)); const o = document.querySelector('.okb'); if (o && /答對了/.test(o.innerText)) return true; } return false; }, lvFirst[1]);
    ok(okp, tag + ' 👂 答對 沒有「✅ 答對了！」頁');
    ok(!errs.length, tag + ' 網頁 錯誤：' + errs.slice(0, 3).join(' | '));
    await ctx.close();
  }
  /* 第 2-(4) 點：現場任務 登入 預設 不用 密碼；老師 開〔🔑 要 密碼〕才 要；沒有 打 密碼 的 成績 標 lv:1 */
  for (const np of [0, 1]) { const ctx = await br.newContext({ viewport: { width: 1024, height: 768 } }); await ctx.route(/^https?:\/\//, r => r.abort()); await ctx.route(/script\.test/, r => r.fulfill({ contentType: 'application/json', body: '{"ok":true,"has":false}' }));
    await ctx.addInitScript(np => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); Object.assign(window, { __SCORE_PW: 1, __SCLVPW: np, __NOGO: 1, __NORVA: 1 }); }, np);
    const pg = await ctx.newPage(); const er = []; pg.on('pageerror', e => er.push(e.message)); await pg.goto('file://' + path.join(ROOT, 'g3mid', 'index.html') + '?live=0304'); await pg.waitForTimeout(800);
    const r = await pg.evaluate(async () => { let d = 0; scPwStep('30401', () => { d = 1; }); await new Promise(s => setTimeout(s, 500)); const pw = !!document.querySelector('.scpw'); const rr = { id: '30401', u: 'x1', set: 'g3gm_g3m-g25', qs: [] }; try { localStorage.removeItem('score_q'); } catch (e) { } scQAdd(rr); return { d, pw, lv: rr.lv }; });
    if (np === 0) ok(r.d === 1 && !r.pw && r.lv === 1, '現場任務 不用 密碼：登入 不該 問 密碼、成績 要 標 lv:1 ' + JSON.stringify(r));
    else ok(r.d === 0 && r.pw, '老師 開了〔🔑 要 密碼〕：要 出現 密碼 畫面 ' + JSON.stringify(r));
    ok(!er.length, '登入 量測 網頁 錯誤 ' + er.join('|')); await ctx.close(); }
  { const gs = fs.readFileSync(path.join(ROOT, 'score', 'Code.gs'), 'utf8'), h = fs.readFileSync(path.join(ROOT, 'live', 'host.html'), 'utf8');
    ok(/function lvpwOn/.test(gs) && /o\.a === 'lvpw'/.test(gs) && /o\.r\.lv === 1 && !lvpwOn/.test(gs), '伺服器 Code.gs 沒有 現場任務 密碼 開關');
    ok(/data-lvpw/.test(h) && /lvOld/.test(h), '大螢幕 沒有〔🔑 學生 登入〕開關（或 沒有 舊 伺服器 保護）'); }
  /* 第 2-(3) 點：頒獎 典禮 不可以 有 會 遮住 畫面 的 東西（3D 空間、混色、毛玻璃 濾鏡、比 畫面 大 很多 的 圖層），光效 在 一張 畫布 */
  { const A = require('../score/_awd.js'); for (const vp of [[1920, 1080], [1024, 768]]) { const pg = await br.newPage({ viewport: { width: vp[0], height: vp[1] } }); const er = []; pg.on('pageerror', e => er.push(e.message));
    await pg.setContent('<html><body style="margin:0;background:#000"><style>' + A.CSS + '</style><div id="h" style="width:100vw;height:100vh"></div><script>window.__AWDFAST=1;' + A.JS + '</script></body></html>');
    const r = await pg.evaluate(async () => { const rows = [1, 2, 3, 4, 5, 6, 7].map(k => ({ rk: k, code: '3040' + k, nm: '測試' + k, sc: (100 - k) + ' 分' })); AWD.play(document.getElementById('h'), { rows, title: '🏆 頒獎 典禮' }, {}); await new Promise(s => setTimeout(s, 4000));
      const H = document.getElementById('h').getBoundingClientRect(), bad = [];
      document.querySelectorAll('#h, #h *').forEach(e => { const c = getComputedStyle(e); if (c.mixBlendMode !== 'normal') bad.push('混色 ' + e.className); if (c.backdropFilter && c.backdropFilter !== 'none') bad.push('毛玻璃濾鏡 ' + e.className); if (c.transformStyle === 'preserve-3d') bad.push('3D ' + e.className); if (e !== document.getElementById('h') && c.perspective !== 'none') bad.push('透視 ' + e.className);
        const q = e.getBoundingClientRect(); if (getComputedStyle(e).display !== 'none' && (q.width > H.width * 1.6 || q.height > H.height * 1.6)) bad.push('太大 ' + e.className + ' ' + Math.round(q.width) + '×' + Math.round(q.height)); if (/hue-rotate|blur/.test(c.filter) && q.width * q.height > H.width * H.height * .25) bad.push('大 濾鏡 ' + e.className); });
      return { bad: [...new Set(bad)].slice(0, 6), bc: !!document.querySelector('#h canvas.awbc'), hon: [...document.querySelectorAll('.awhon')].map(x => x.textContent).length, glass: getComputedStyle(document.querySelector('.awp'), '::before').content, ps: document.querySelectorAll('.awpod .ps').length }; });
    ok(!r.bad.length, vp.join('×') + ' 頒獎 典禮 還有 可能 遮住 畫面 的 效果：' + r.bad.join(' | '));
    ok(r.bc && r.hon === 0 && r.glass !== 'none' && r.ps >= 3, vp.join('×') + ' 頒獎 典禮 少了 光效 畫布／前 三名 榮譽／玻璃 光／立體 側面 ' + JSON.stringify(r));
    ok(!er.length, vp.join('×') + ' 頒獎 典禮 錯誤 ' + er.join('|')); await pg.close(); } }
  await br.close();
  if (E.length) E.forEach(e => console.log('❌ ' + e));
  console.log('第四十五次 成長測驗：' + n + ' 項，' + E.length + ' 個 失敗');
  process.exit(E.length ? 1 : 0);
})();
