/* g3mid/_verify_42.js — 第四十二次 量測（只 印 失敗 項）。假 成績 伺服器、不連 Firebase。node g3mid/_verify_42.js [mag,nud,…]
 * mag：四年級 🪄 直述句 ➜ 問句 魔法 動畫（Is 最前面、he 第二、? 、嗎、不 超出、唸 問句）；nud：〔▶ 進入 下一頁〕停 太 久 輕輕 放大 */
const { chromium } = require('playwright'), path = require('path');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0, ONLY = (process.argv[2] || '').split(',').filter(Boolean);
const ok = (c, m) => { n++; if (!c) E.push(m); }, want = k => !ONLY.length || ONLY.indexOf(k) >= 0;
const SHOT = process.env.SHOT;
async function ctxOf(br, vp, id) { const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
  await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.route(/script\.test/, r => r.fulfill({ contentType: 'application/json', body: '{"ok":true,"dup":[]}' }));
  await ctx.addInitScript(([id]) => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); window.__NOUNLOCK = 1; window.__NOGO = 1;
    window.__PLAYED = []; HTMLMediaElement.prototype.play = function () { const a = this; window.__PLAYED.push(a.src); setTimeout(() => a.onended && a.onended(), 80); return Promise.resolve(); };
    HTMLMediaElement.prototype.pause = function () {};
    localStorage.setItem('score_last', '"' + id + '"'); localStorage.setItem('score_id_g' + id[0], '"' + id + '"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id); sessionStorage.setItem('score_pks_' + id, 'tk'); }, [id]);
  return ctx; }
module.exports = { ctxOf };
if (require.main === module) (async () => {
  const br = await chromium.launch();
  for (const vp of (process.env.VP ? [process.env.VP.split('x').map(Number)] : [[1024, 768], [820, 1180], [1920, 1080]])) { const tag = vp.join('×');
    if (want('mag') || want('nud')) { const ctx = await ctxOf(br, vp, '40201'), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto('file://' + path.join(ROOT, 'midterm', 'index.html')); await p.waitForTimeout(600);
      await p.evaluate(() => { document.querySelectorAll('.scfull,#scov').forEach(x => x.remove()); window.__RVNUD = 400; RVA.play(RVD.m11, function () {}); });
      await p.waitForTimeout(400); await p.evaluate(() => { const b = document.getElementById('rvgo'); if (b) { b.disabled = false; b.click(); } });
      await p.waitForTimeout(900);
      const m0 = await p.evaluate(() => !!document.querySelector('.rvmag'));
      ok(m0, tag + ' 魔法 頁 沒有 出現');
      for (let w = 0; w < 40; w++) { await p.waitForTimeout(500); if (await p.evaluate(() => !document.getElementById('rvnext').disabled)) break; }
      const r = await p.evaluate(() => { const c = document.querySelector('.rvmag'), ks = [].slice.call(c.querySelectorAll('.mgen .mgk')).map(k => k.querySelector('b').textContent), box = c.getBoundingClientRect(), vw = innerWidth, vh = innerHeight;
        const out = [].slice.call(c.querySelectorAll('.mgk,.mgzh,.mgsum span')).filter(e => { const b = e.getBoundingClientRect(); return b.right > vw + 1 || b.left < -1 || b.bottom > vh + 1; }).length;
        const big = parseFloat(getComputedStyle(c.querySelector('.mgk b')).fontSize);
        return { ks, zh: c.querySelector('.mgzh').textContent, sum: c.querySelector('.mgsum').classList.contains('on'), out, big, ov: c.scrollHeight > c.clientHeight + 2, nx: !document.getElementById('rvnext').disabled, played: window.__PLAYED.filter(s => /rv\//.test(s)).length }; });
      ok(r.ks.join(' ') === 'Is she a nurse ?', tag + ' 魔法 變身 以後 順序 不對：' + r.ks.join(' '));
      ok(/嗎/.test(r.zh) && /^她/.test(r.zh.trim()), tag + ' 中文 沒有 加 嗎 或 順序 變了：' + r.zh);
      ok(r.sum, tag + ' 三個 關鍵 沒有 亮'); ok(!r.out, tag + ' 魔法 頁 有 ' + r.out + ' 個 東西 超出 畫面'); ok(!r.ov, tag + ' 魔法 頁 要 捲動');
      ok(r.big >= 30, tag + ' 英文 字 太 小 ' + r.big); ok(r.nx, tag + ' 演完 沒有 解鎖〔▶ 進入 下一頁〕'); ok(r.played >= 3, tag + ' 唸 不到 3 次（直述句 1＋問句 2）：' + r.played);
      if (SHOT) await p.screenshot({ path: SHOT + '/mag_' + tag + '.png' });
      if (want('nud')) { await p.waitForTimeout(1200); ok(await p.evaluate(() => document.getElementById('rvnext').classList.contains('nud')), tag + ' 停 太 久 按鈕 沒有 輕輕 放大');
        await p.evaluate(() => document.querySelector('[data-rv="pause"]').click()); await p.waitForTimeout(100); await p.evaluate(() => document.getElementById('rvnext').classList.remove('nud')); await p.waitForTimeout(900);
        ok(!(await p.evaluate(() => document.getElementById('rvnext').classList.contains('nud'))), tag + ' 暫停 的 時候 還在 提醒'); }
      ok(!errs.length, tag + ' JS 錯誤 ' + errs.slice(0, 2).join('｜')); await ctx.close(); }
    if (want('dz')) for (const site of ['g3mid', 'midterm']) { const ctx = await ctxOf(br, vp, site === 'g3mid' ? '30401' : '40201'), p = await ctx.newPage(), errs = [], t2 = tag + ' ' + site;
      p.on('pageerror', e => errs.push(e.message));
      await ctx.addInitScript(() => { window.__NORVA = 1; window.__NOTUT = 1; window.__NOMEM = 1; window.__NOWHEEL = 1; window.__NOLIFE = 1; window.__NODFXI = 1; window.__RVAUTO = 1; });
      await p.goto('file://' + path.join(ROOT, site, 'index.html')); await p.waitForTimeout(700);
      await p.evaluate(() => { document.querySelectorAll('.scfull,#scov').forEach(x => x.remove()); window.decLesson = function (L, d) { d(); }; window.decTut = function (L, d) { d(); }; (window.startX || startX)(25); });
      for (let w = 0; w < 30; w++) { await p.waitForTimeout(400); if (await p.evaluate(() => document.querySelectorAll('.dcbox .dcs, #stage .dcs').length > 0 && !document.getElementById('dcl'))) break; }
      await p.evaluate(() => { var ss = [].slice.call(document.querySelectorAll('.dcs')).filter(s => !s.closest('#dcl')), ts = [].slice.call(document.querySelectorAll('.dctl')).filter(t => !t.closest('#dcl')), q = (window.R && R.q) || {};
        var want = ss.map((s, i) => q.t[i][1]), used = [];
        ss.forEach((s, i) => { var t = ts.filter(x => used.indexOf(x) < 0 && (i === 0 ? x._z !== want[0] : x._z === want[i]))[0] || ts.filter(x => used.indexOf(x) < 0)[0]; used.push(t); t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 0, clientY: 0 })); t.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 0, clientY: 0 })); s.click(); }); });
      await p.waitForTimeout(3200);
      const r = await p.evaluate(() => { var b = document.querySelector('#fb.on, #wf.on'); if (!b) return null; var w = b.querySelectorAll('.gw.wbad'), m = b.querySelectorAll('mark.dzm'), y = b.querySelector('.dzwhy');
        var bg = w[0] ? getComputedStyle(w[0].querySelector('b')).backgroundColor : '', bi = w[0] ? getComputedStyle(w[0].querySelector('i')).backgroundColor : '', bm = m[0] ? getComputedStyle(m[0]).backgroundColor : '';
        return { w: w.length, m: m.length, y: y ? y.textContent : '', bg, bi, bm, ov: b.scrollHeight > b.clientHeight + 4 }; });
      ok(r, t2 + ' 放錯 以後 沒有 答錯頁');
      if (r) { ok(r.w >= 1, t2 + ' A 英文 字／B 中文 沒有 紅框'); ok(r.m >= 1, t2 + ' C 整句 翻譯 沒有 紅框'); ok(/放錯/.test(r.y), t2 + ' 沒有「剛才 放錯 的 地方」');
        ok(/211, 47, 47/.test(r.bg) && /211, 47, 47/.test(r.bi) && /211, 47, 47/.test(r.bm), t2 + ' 不是 紅底：' + [r.bg, r.bi, r.bm].join('｜')); }
      if (SHOT) await p.screenshot({ path: SHOT + '/dz_' + site + '_' + tag + '.png' });
      ok(!errs.length, t2 + ' JS 錯誤 ' + errs.slice(0, 2).join('｜')); await ctx.close(); }
    if (want('chest')) for (const site of ['g3mid', 'midterm']) { const ctx = await ctxOf(br, vp, site === 'g3mid' ? '30401' : '40201'), p = await ctx.newPage(), errs = [], t2 = tag + ' ' + site;
      p.on('pageerror', e => errs.push(e.message));
      await p.goto('file://' + path.join(ROOT, site, 'index.html')); await p.waitForTimeout(700);
      await p.evaluate(() => { document.querySelectorAll('.scfull,#scov').forEach(x => x.remove()); localStorage.removeItem(DFX.inKey()); window.__NOGO = 0; window.__IND = 0; DFX.intro(function () { window.__IND = 1; }); });
      const i0 = await p.evaluate(() => ({ d: document.querySelector('.dfxin .igo').disabled, c: document.querySelectorAll('.dfxin .actl button').length, h: document.querySelector('.dfxin .ih').textContent }));
      ok(i0.d, t2 + ' 寶箱 說明 一開始 就 可以 按'); ok(i0.c === 3, t2 + ' 寶箱 說明 沒有 暫停／再播／慢速'); ok(/怎麼 拿到 寶箱/.test(i0.h), t2 + ' 第 1 幕 不是 怎麼 拿 寶箱：' + i0.h);
      const H = []; for (let k = 0; k < 4; k++) { await p.waitForTimeout(k ? 5700 : 300); const o = await p.evaluate(() => { const b = document.querySelector('.dfxin .ib'), r = b.getBoundingClientRect(); return { h: document.querySelector('.dfxin .ih').textContent, ov: r.bottom > innerHeight + 1 || r.right > innerWidth + 1 || b.scrollHeight > b.clientHeight + 2 }; }); H.push(o.h); ok(!o.ov, t2 + ' 寶箱 說明 第 ' + (k + 1) + ' 幕 超出 畫面'); if (SHOT && vp[0] === 1024) await p.screenshot({ path: SHOT + '/in' + k + '_' + site + '.png' }); }
      ok(/愈 難/.test(H[1]) && /隨便/.test(H[2]) && /驚喜/.test(H[3]), t2 + ' 寶箱 說明 4 幕 內容 不對：' + H.join('｜'));
      await p.waitForTimeout(5400); ok(!(await p.evaluate(() => document.querySelector('.dfxin .igo').disabled)), t2 + ' 演完 還是 不能 按');
      await p.evaluate(() => document.querySelector('.dfxin .igo').click()); ok(await p.evaluate(() => window.__IND === 1 && !document.querySelector('.dfxin')), t2 + ' 按了 沒有 開始');
      await p.evaluate(() => { window.__IND = 0; DFX.inR = null; DFX.intro(function () { window.__IND = 1; }); }); await p.waitForTimeout(300);
      ok(await p.evaluate(() => /1 ／ 1/.test(document.querySelector('.dfxin .ip').textContent)), t2 + ' 第二次 不是 只 剩 1 幕'); await p.evaluate(() => { ACTL.off(); document.querySelector('.dfxin').remove(); });
      for (const st of ['box', 'card', 'scratch', 'egg', 'gacha', 'balloon', 'rocket', 'legend']) {
        await p.evaluate(st => { window.__DFXSTY = st; window.__GOT = -1; DFX.chest({ t: st === 'legend' ? 4 : 2, p: st === 'legend' ? 8000 : 1800 }, 10, '測試', function (v) { window.__GOT = v; }); }, st);
        await p.waitForTimeout(900);
        const o = await p.evaluate(() => { const e = document.querySelector('.dfxch2'); if (!e) return null; const out = [].slice.call(e.querySelectorAll('button,canvas,.bx,.nm,.tap')).filter(x => { const r = x.getBoundingClientRect(); return r.width && (r.right > innerWidth + 2 || r.left < -2 || r.bottom > innerHeight + 2 || r.top < -2); }).length; return { out, nm: e.querySelector('.nm').textContent }; });
        ok(o, t2 + ' ' + st + ' 沒有 出現'); if (!o) continue; ok(!o.out, t2 + ' ' + st + ' 有 ' + o.out + ' 個 東西 超出 畫面（' + o.nm + '）');
        if (SHOT && vp[0] === 820 && site === 'midterm') await p.screenshot({ path: SHOT + '/ch_' + st + '.png' });
        await p.evaluate(async st => { const q = s => document.querySelector('.dfxch2 ' + s), cl = e => e && e.click(), w = ms => new Promise(r => setTimeout(r, ms));
          if (st === 'box' || st === 'legend') for (let i = 0; i < 5; i++) { cl(q('.bx')); await w(80); }
          if (st === 'card') cl(q('.dfxcd')); if (st === 'balloon') cl(q('.dfxbl')); if (st === 'egg') for (let i = 0; i < 4; i++) { cl(q('.dfxeg')); await w(60); }
          if (st === 'gacha') { cl(q('.kn')); await w(100); cl(q('.kn')); await w(700); cl(q('.cap')); }
          if (st === 'scratch') { const c = q('canvas'), r = c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + 10, clientY: r.top + 10 })); for (let i = 0; i < 32; i++) c.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + 10 + i * 8, clientY: r.top + 20 + (i % 4) * 20 })); }
          if (st === 'rocket') { const b = q('.dfxrk'); b.dispatchEvent(new PointerEvent('pointerdown', {})); await w(1400); b.dispatchEvent(new PointerEvent('pointerup', {})); } }, st);
        await p.waitForTimeout(st === 'legend' ? 4800 : 4600);
        const g = await p.evaluate(() => ({ g: window.__GOT, left: !!document.querySelector('.dfxch2') }));
        ok(g.g > 0, t2 + ' ' + st + ' 打開 以後 沒有 拿到 積分：' + g.g); ok(!g.left, t2 + ' ' + st + ' 沒有 關掉');
        if (st === 'legend') ok(g.g >= 8000, t2 + ' 傳說 寶箱 獎勵 不夠 豐盛：' + g.g); }
      const L = await p.evaluate(() => { var a = DFX.drop(12, true), b = DFX.drop(4, false); return { a: a && a.t, ap: a && a.p, b: b }; });
      ok(L.a === 4 && L.ap >= 8000, t2 + ' 記憶 解碼 沒有 一定 掉 傳說 寶箱'); ok(L.b === null, t2 + ' 簡單 題 也 掉 寶箱');
      ok(!errs.length, t2 + ' JS 錯誤 ' + errs.slice(0, 2).join('｜')); await ctx.close(); }
    if (want('sn')) { const ctx = await ctxOf(br, vp, '40201'), p = await ctx.newPage(), errs = [], t2 = tag + ' 🐍';
      p.on('pageerror', e => errs.push(e.message));
      await p.goto('file://' + path.join(ROOT, 'midterm', 'index.html')); await p.waitForTimeout(600);
      await p.evaluate(() => { window.__DCLMIN = 0; LDB.set = LDB.must = LDB.patch = () => Promise.resolve(true); CR = { room: '0402', t: 1, cfg: { on: 1, t: 1, set: 'n25', gs: [], m: 'self' }, acc: {}, n: 0, ok: 0, q: -9, rd: {} }; hub(); window.__NORVA = 1; window.__SNFAST = 1; window.__NODFXI = 1; document.querySelectorAll('.scfull,#scov').forEach(x => x.remove()); });
      await p.waitForTimeout(200); await p.click('[data-duo="0"]'); await p.click('.xrow .xb'); await p.waitForTimeout(500);
      await p.evaluate(() => { const k = R.gs.findIndex(g => g.id === 'n3'); R.k = k; R.lv = R.lvOf[k]; window.__NOGO = 0; show(); });
      await p.waitForTimeout(1500);
      const h0 = await p.evaluate(() => { const o = document.querySelector('.snhow'); if (!o) return null; const b = o.querySelector('.shb').getBoundingClientRect(); return { d: o.querySelector('.shgo').disabled, li: o.querySelectorAll('.shs li').length, c: o.querySelectorAll('.actl button').length, ov: b.bottom > innerHeight + 1 || b.right > innerWidth + 1, run: TM.run }; });
      ok(h0, t2 + ' 第一次 沒有 秒懂 動畫「怎麼 玩」'); if (h0) { ok(h0.d, t2 + ' 怎麼玩 一開始 就 能 按'); ok(h0.li === 4, t2 + ' 怎麼玩 不是 4 步'); ok(h0.c === 3, t2 + ' 沒有 暫停／再播／慢速'); ok(!h0.ov, t2 + ' 怎麼玩 超出 畫面'); ok(!h0.run, t2 + ' 看 說明 的 時候 倒數 還在 走'); }
      if (SHOT && vp[0] === 1024) await p.screenshot({ path: SHOT + '/sn_how.png' });
      await p.waitForFunction(() => { const b = document.querySelector('.snhow .shgo'); return b && !b.disabled; }, null, { timeout: 12000 }).catch(() => E.push(t2 + ' 怎麼玩 演完 還是 不能 按'));
      await p.evaluate(() => { const b = document.querySelector('.snhow .shgo'); if (b) b.click(); }); await p.waitForFunction(() => TM.run, null, { timeout: 6000 }).catch(() => {});
      const g = await p.evaluate(() => { const w = document.getElementById('n3w'), r = w.getBoundingClientRect(), f = [...w.querySelectorAll('.fr')].map(x => x.getBoundingClientRect()), d = [...document.querySelectorAll('.dpad3 [data-d]')].map(x => x.getBoundingClientRect());
        return { w: r.width, h: r.height, out: r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.left < -1, fmin: Math.min(...f.map(x => Math.min(x.width, x.height))), dmin: Math.min(...d.map(x => Math.min(x.width, x.height))), dout: d.some(x => x.bottom > innerHeight + 1), run: TM.run, hud: (document.getElementById('n3hud') || {}).textContent || '', eyes: w.querySelectorAll('.sg.hd .ey').length }; });
      ok(g.w >= 540, t2 + ' 草地 太 小：' + Math.round(g.w) + 'px'); ok(!g.out, t2 + ' 草地 超出 畫面'); ok(g.fmin >= 80, t2 + ' 答案 卡 太 小：' + Math.round(g.fmin)); ok(g.dmin >= 64, t2 + ' 方向鍵 太 小：' + Math.round(g.dmin)); ok(!g.dout, t2 + ' 方向鍵 超出 畫面');
      ok(g.run, t2 + ' 按了 開始 倒數 沒有 走'); ok(/長度/.test(g.hud), t2 + ' 沒有 長度'); ok(g.eyes === 2, t2 + ' 蛇 頭 沒有 眼睛');
      if (SHOT && vp[0] === 1024) await p.screenshot({ path: SHOT + '/sn_play_' + tag + '.png' });
      /* 撞 牆 不會 輸：一直 往 左 走 ＝ 從 右邊 出來 */
      const wr = await p.evaluate(async () => { snDir('l'); await new Promise(r => setTimeout(r, 260)); const x = SN.body[0][0]; SN.dir = null; return { x, lock: R.lock }; });   /* 第 3 列 沒有 答案：一直 往 左 ＝ 從 右邊 出來 */
      ok(!wr.lock, t2 + ' 撞 牆 就 結束 了');
      await p.click('#stage [data-o="0"]', { force: true });
      await p.waitForFunction(() => (R.snk || 0) >= 1, null, { timeout: 8000 }).catch(() => E.push(t2 + ' 點 對 的 答案 蛇 沒有 自己 去 吃'));
      const e2 = await p.evaluate(() => ({ snk: R.snk || 0, len: SN.len, sp: document.querySelectorAll('#n3w .snp').length }));
      ok(e2.len >= 4, t2 + ' 吃 對 蛇 沒有 變 長'); ok(e2.sp > 0, t2 + ' 吃 對 沒有 特效');
      ok(!errs.length, t2 + ' JS 錯誤 ' + errs.slice(0, 2).join('｜')); await ctx.close(); }
    if (want('pt') && vp[0] === 1024) for (const site of ['midterm', 'g3mid']) { const id = site === 'g3mid' ? '30401' : '40201', pre = site === 'g3mid' ? 'g3gm_g3m-x25' : 'g4gm_mt-x25', t2 = tag + ' ' + site + ' ⏸', posts = [], PROG = {};
      const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }); await ctx.route(/^https?:\/\//, r => r.abort());
      await ctx.route(/script\.test/, r => { let b = {}; try { b = JSON.parse(r.request().postData() || '{}'); } catch (e) { } posts.push(b);
        if (b.a === 'rec' && b.r && b.r.prog) PROG[b.r.set] = b.r.prog; if (b.a === 'rec' && b.r && !b.r.part) delete PROG[b.r.set];
        r.fulfill({ contentType: 'application/json', body: JSON.stringify(b.a === 'prog' ? { ok: true, prog: PROG[b.set] || null } : { ok: true, saved: true, dup: false, part: b.r && b.r.part ? 1 : 0 }) }); });
      await ctx.addInitScript(([id]) => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); window.__NOUNLOCK = 1; window.__NOGO = 1; window.__SCNOJIT = 1; window.__NORVA = 1; window.__NODFXI = 1; window.__NOTUT = 1;
        HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 30); return Promise.resolve(); }; HTMLMediaElement.prototype.pause = function () {};
        localStorage.setItem('score_last', '"' + id + '"'); localStorage.setItem('score_id_g' + id[0], '"' + id + '"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id); sessionStorage.setItem('score_pks_' + id, 'tk'); }, [id]);
      const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto('file://' + path.join(ROOT, site, 'index.html')); await p.waitForTimeout(700);
      await p.evaluate(() => { document.querySelectorAll('.scfull,#scov').forEach(x => x.remove()); window.decLesson = function (L, d) { d(); }; startX(25); });
      await p.waitForTimeout(600);
      /* 答了 5 題（假的 作答 紀錄）➜ 每 5 題 送 一次 */
      const a = await p.evaluate(() => { for (let i = 0; i < 5; i++) R.Q.push([1, 0, 3, 0, .5, i]); recPart(); const Q = JSON.parse(localStorage.getItem('score_q') || '[]').concat(JSON.parse(localStorage.getItem('score_sent') || '[]')); return { pu: R.pu, q: Q.map(x => ({ u: x.u, part: x.part, n: x.qs.length, prog: !!x.prog })) }; });
      await p.waitForTimeout(800);
      const s1 = posts.filter(b => b.a === 'rec' && b.r.set === pre);
      ok(s1.length >= 1 && s1[s1.length - 1].r.part === 25 && s1[s1.length - 1].r.qs.length === 5 && s1[s1.length - 1].r.u === a.pu && !!s1[s1.length - 1].r.prog, t2 + ' 答 5 題 沒有 送「做到 一半」（part 25、進度）' + JSON.stringify(s1.map(b => [b.r.part, b.r.qs.length])));
      /* 換 一台 平板：這台 的 存檔 刪掉 ➜ 從 伺服器 拿 ➜ 可以〔▶ 繼續〕*/
      const rm = await p.evaluate(async () => { const k = xKey(25); localStorage.removeItem(k); window.XRM = {}; let done = false; xRemote(25, 'A', () => { done = true; }); for (let i = 0; i < 30 && !done; i++) await new Promise(r => setTimeout(r, 100)); const v = xLoad(25); return { done, n: v && v.Q.length, pu: v && v.pu }; });
      ok(rm.done && rm.n === 5 && rm.pu === a.pu, t2 + ' 換 平板 沒有 從 伺服器 拿回 進度 ' + JSON.stringify(rm));
      /* 做完 ＝ 同一個 編號、沒有 part（蓋掉 做到 一半 的）*/
      await p.evaluate(() => { R.sent = 0; while (R.Q.length < 25) R.Q.push([1, 0, 3, 0, .5, R.Q.length]); rec1(); }); await p.waitForTimeout(800);
      const s2 = posts.filter(b => b.a === 'rec' && b.r.set === pre).pop();
      ok(s2 && !s2.r.part && s2.r.u === a.pu && s2.r.qs.length === 25, t2 + ' 做完 的 那一筆 不是 同一個 編號 或 還 標 part ' + JSON.stringify(s2 && [s2.r.u === a.pu, s2.r.part]));
      ok(!errs.length, t2 + ' JS 錯誤 ' + errs.slice(0, 2).join('｜')); await ctx.close(); }
    if (want('pt') && vp[0] === 1024) { const t2 = tag + ' 句型 遊戲 ⏸', posts = [];
      const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }); await ctx.route(/^https?:\/\//, r => r.abort());
      await ctx.route(/script\.test/, r => { let b = {}; try { b = JSON.parse(r.request().postData() || '{}'); } catch (e) { } posts.push(b); r.fulfill({ contentType: 'application/json', body: '{"ok":true,"saved":true,"dup":false}' }); });
      await ctx.addInitScript(() => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); window.__SCNOJIT = 1; localStorage.setItem('score_last', '"40201"'); localStorage.setItem('score_id_g4', '"40201"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', '40201'); sessionStorage.setItem('score_pks_40201', 'tk'); });
      const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto('file://' + path.join(ROOT, 'sentences', 'games.html')); await p.waitForTimeout(800);
      await p.evaluate(() => document.querySelectorAll('.scfull,#scov').forEach(x => x.remove()));
      await p.click('.gcard >> nth=0').catch(() => {}); await p.waitForTimeout(1500);
      const st = await p.evaluate(() => ({ on: document.getElementById('arena').classList.contains('on'), f: typeof window.SCPARTF }));
      if (st.on) { await p.evaluate(() => { GQ.push([1, 0, 2, 0, .8, 0], [0, 1, 4, 0, 0, 1]); }); await p.click('#quit'); await p.waitForTimeout(900);
        const r = posts.filter(b => b.a === 'rec').pop(); ok(r && r.r.part === 999 && r.r.qs.length === 2, t2 + ' 玩 到 一半 按〔⬅ 回遊戲大廳〕沒有 送「沒有 玩完」' + JSON.stringify(r && r.r.part)); }
      else ok(false, t2 + ' 遊戲 沒有 開始 ' + JSON.stringify(st));
      ok(!errs.length, t2 + ' JS 錯誤 ' + errs.slice(0, 2).join('｜')); await ctx.close(); }
  }
  await br.close();
  console.log(E.length ? E.map(x => '✗ ' + x).join('\n') : ''); console.log('第四十二次 量測 ' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0);
})();
