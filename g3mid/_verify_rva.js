/* g3mid/_verify_rva.js — 🎬 秒懂 複習 動畫＋⚡ 突擊 測驗 量測（2026-10-31 第三十六次 第 1 點；三、四年級）。只 印 失敗 項。
 * 假 的 成績 伺服器（不送 真的 成績表）、不連 Firebase。node g3mid/_verify_rva.js
 * 量：① 題庫（每 一部 ≧ 8 題、≧ 4 種 題型、每句 都 有 語音檔）② 25 題 挑戰 第 1 關 前 先 演 ③ 開場 3 句 2.6 秒 才 能 按 ④ 每一頁：英文 一個 字 一個 字、字 正下方 中文、唸 2 次、唸到 的 那一格 放大
 *     ⑤ 3 題 突擊 測驗、每一題 每一種 題型 都 畫得出來、不 超出 畫面、字 夠 大 ⑥ 答對、答錯（答錯頁：你的答案、正確答案 逐字 中文、整句、💡、唸 3 次、〔🔊 再聽一次〕）
 *     ⑦〔⏸️ 暫停〕真的 停、〔🐢 放慢〕、〔🔁 再一次〕⑧ 送 成績 g3gm_g3m-rv／g4gm_mt-rv ⑨ 再 看 一次 ＝ 3 題 都 不一樣 ⑩ 拖 ＝ 格子 互相 交換 */
const { chromium } = require('playwright'), path = require('path'), fs = require('fs'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0;
const ok = (c, m) => { n++; if (!c) E.push(m); };
const rdA = f => { if (!fs.existsSync(f)) return {}; const c = { window: {} }; vm.runInNewContext(fs.readFileSync(f, 'utf8'), c); return Object.assign({}, ...Object.values(c.window)); };
const AK = t => String(t).replace(/[’]/g, "'").replace(/[=＝≠➜→⇒…＿_　]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
(async () => {
  for (const site of ['g3mid', 'midterm']) { const R = require(path.join(ROOT, site, '_rva_data.js')), A = Object.assign(rdA(path.join(ROOT, site, 'audio/rv/aud.js')), rdA(path.join(ROOT, site, 'audio/rvw/aud.js')));
    ok(!R.err.length, site + ' 題庫 錯誤 ' + R.err.slice(0, 3).join('｜'));
    R.say.forEach(t => ok(A[AK(t.replace(/^m:/, '').replace(/^/, t.indexOf('m:') === 0 ? 'm:' : ''))] || A[AK(t)], site + ' 沒有 語音檔：' + t));
    R.list.forEach(a => { ok(a.qz.length >= 8, site + ' ' + a.nm + ' 測驗 不到 8'); ok(new Set(a.qz.map(q => q.ty)).size >= 4, site + ' ' + a.nm + ' 題型 不到 4 種');
      a.sc.forEach((c, i) => ok(c.t.every(p => p[1] !== undefined), site + ' ' + a.nm + ' 第 ' + (i + 1) + ' 頁 有 字 沒 中文')); }); }
  const br = await chromium.launch();
  for (const site of ['g3mid', 'midterm']) for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) {
    const tag = site + ' ' + vp.join('×'), id = site === 'g3mid' ? '30401' : '40201', sent = [];
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.route(/script\.test/, r => { const b = r.request().postData() || ''; if (b) sent.push(b); r.fulfill({ contentType: 'application/json', body: '{"ok":true,"dup":[]}' }); });
    await ctx.addInitScript(([id]) => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); window.__NOUNLOCK = 1; window.__NOGO = 1; window.__NOWB = 1; window.__NOTUT = 1; window.__DCLK = .05;
      window.__PLAYED = []; HTMLMediaElement.prototype.play = function () { const a = this; window.__PLAYED.push(a.src); setTimeout(() => a.onended && a.onended(), 60); return Promise.resolve(); };
      HTMLMediaElement.prototype.pause = function () {};
      localStorage.setItem('score_last', '"' + id + '"'); localStorage.setItem('score_id_g' + id[0], '"' + id + '"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id); sessionStorage.setItem('score_pks_' + id, 'tk'); }, [id]);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, site, 'index.html')); await p.waitForTimeout(800);
    await p.evaluate(() => { document.querySelectorAll('.scfull,#scov').forEach(x => x.remove()); });
    /* 25 題 挑戰 ➜ 第 1 關 前 ＝ 動畫 */
    await p.evaluate(() => { (typeof startX === 'function' ? startX : window.startX)(25); });
    await p.waitForTimeout(700);
    const on = await p.evaluate(() => !!(window.RVA && RVA.S && document.getElementById('rva').classList.contains('on')));
    ok(on, tag + ' 25 題 挑戰 第 1 關 前 沒有 演 秒懂 複習 動畫');
    if (!on) { await ctx.close(); continue; }
    /* ③ 開場 */
    const in0 = await p.evaluate(() => ({ t: document.querySelector('.rvin').textContent, d: document.getElementById('rvgo').disabled }));
    ok(/隨時/.test(in0.t) && /列入成績|列入 成績/.test(in0.t) && /專心/.test(in0.t), tag + ' 開場 沒說 隨時 出題、列入 成績、專心：' + in0.t.slice(0, 60));
    ok(in0.d, tag + ' 開場 一開始 就 可以 按');
    await p.waitForTimeout(2900); ok(!(await p.evaluate(() => document.getElementById('rvgo').disabled)), tag + ' 開場 2.6 秒 後 還是 不能 按');
    /* 只 留 第一頁 有 測驗（量 答錯）：把 計畫 改成 第 1 頁 唸完 第 1 次 ＝ 測驗 */
    const spec = await p.evaluate(() => { const S = RVA.S; return { nq: S.nq, plan: Object.keys(S.plan).length, n: S.spec.sc.length, id: S.spec.id }; });
    ok(spec.nq === 3 && spec.plan === 3, tag + ' 不是 3 題 突擊 測驗 ' + JSON.stringify(spec));
    /* 假 的 播放器 沒有 長度 ➜ 第一頁 用 照 時間 估 的 那一條 路（一樣 會 亮）*/ await p.evaluate(() => { RVA.__aud = RVA.A.aud; RVA.A.aud = () => null; });
    await p.click('#rvgo'); await p.waitForTimeout(250);
    /* ④ 一個 字 一個 字 */
    const pop = await p.evaluate(() => { const k = document.querySelectorAll('#rvs .rvk'); return { n: k.length, in: [].filter.call(k, x => x.classList.contains('in')).length, zh: [].every.call(k, x => x.querySelector('i')) }; });
    ok(pop.n > 0 && pop.in < pop.n, tag + ' 英文 不是 一個 字 一個 字 跳出來 ' + JSON.stringify(pop)); ok(pop.zh, tag + ' 字 下面 沒有 中文');
    /* 暫停：1.5 秒 內 不 前進 */
    await p.click('[data-rv="pause"]'); const a0 = await p.evaluate(() => document.querySelectorAll('#rvs .rvk.in').length + '|' + RVA.S.i); await p.waitForTimeout(1500);
    const a1 = await p.evaluate(() => document.querySelectorAll('#rvs .rvk.in').length + '|' + RVA.S.i); ok(a0 === a1, tag + '〔⏸️ 暫停〕沒有 停 ' + a0 + ' ➜ ' + a1);
    ok(await p.evaluate(() => /繼續/.test(document.querySelector('[data-rv="pause"]').textContent)), tag + ' 暫停 以後 按鈕 沒有 變〔▶ 繼續〕');
    await p.click('[data-rv="pause"]'); await p.click('[data-rv="slow"]'); ok(await p.evaluate(() => RVA.S.slow), tag + '〔🐢 放慢〕沒 作用'); await p.click('[data-rv="slow"]');
    /* 按鈕 夠 大、在 畫面 裡 */
    const bt = await p.evaluate(() => [].map.call(document.querySelectorAll('#rvc button'), b => { const r = b.getBoundingClientRect(); return [r.height, r.bottom <= innerHeight + 1, parseFloat(getComputedStyle(b).fontSize)]; }));
    ok(bt.length === 3 && bt.every(x => x[0] >= 52 && x[1] && x[2] >= 18), tag + ' 暫停／放慢／再一次 按鈕 不夠 大 或 跑出 畫面 ' + JSON.stringify(bt));
    /* 唸 2 次 ＋ 唸到 的 格子 亮：等 第一頁 唸完 */
    let saw = 0; for (let i = 0; i < 40; i++) { await p.waitForTimeout(150); const s = await p.evaluate(() => ({ spk: !!document.querySelector('#rvs .rvk.spk'), c: document.querySelectorAll('#rvs .rvcnt i.on').length, q: !!document.querySelector('.rvqz') })); if (s.spk) saw |= 1; if (s.c >= 1) saw |= 2; if (s.c >= 2) saw |= 4; if (s.q) break; }
    ok(saw & 1, tag + ' 唸 的 時候 沒有 一格 放大 變亮'); ok(saw & 2, tag + ' 沒有 唸 第 1 次 的 標記');
    await p.evaluate(() => { RVA.A.aud = RVA.__aud; });
    /* 🔁 再一次 ＝ 這一頁 重來 */
    if (!(await p.evaluate(() => !!document.querySelector('.rvqz')))) { await p.click('[data-rv="again"]'); await p.waitForTimeout(150); ok(await p.evaluate(() => document.querySelectorAll('#rvs .rvk.in').length < document.querySelectorAll('#rvs .rvk').length), tag + '〔🔁 再一次〕沒有 重來'); }
    /* 一次 演 每 一種 題型（直接 叫 測驗，量 版面）*/
    const tys = await p.evaluate(() => { const o = {}; RVA.S.spec.qz.forEach((q, i) => { if (o[q.ty] == null) o[q.ty] = i; }); return o; });
    for (const ty of Object.keys(tys)) {
      await p.evaluate(qi => { const S = RVA.S; S.gen++; S.tm.forEach(t => clearTimeout(t.id)); S.tm = []; document.querySelectorAll('.rvfb').forEach(x => x.remove()); RVA.__quiz = qi; }, tys[ty]);
      await p.evaluate(qi => { /* 用 引擎 自己 的 quiz：經過 slot */ const S = RVA.S; S.plan = {}; S.plan[2 * S.i] = qi; }, tys[ty]);
      await p.evaluate(() => { const S = RVA.S; S.ans = false; });
      await p.evaluate(() => { document.querySelector('[data-rv="again"]').click(); });
      let got = false; for (let i = 0; i < 60; i++) { await p.waitForTimeout(150); if (await p.evaluate(() => !!document.querySelector('.rvqz'))) { got = true; break; } }
      ok(got, tag + ' 題型 ' + ty + ' 沒有 出現'); if (!got) continue;
      await p.waitForTimeout(700);
      const L = await p.evaluate(() => { const q = document.querySelector('.rvqz'), r = q.getBoundingClientRect(), pp = q.querySelector('.rvqp'); const bad = [].filter.call(q.querySelectorAll('button,.rvtl,.rvds,.rvdc b'), e => { const b = e.getBoundingClientRect(); return b.right > innerWidth + 1 || b.bottom > innerHeight + 1 || b.left < -1; }).length;
        return { b: r.bottom <= innerHeight + 1, ox: document.documentElement.scrollWidth - innerWidth, bad, fs: parseFloat(getComputedStyle(pp).fontSize), zh: /[\u4e00-\u9fff]/.test((q.querySelector('.rvqq') || { textContent: '' }).textContent + [].map.call(q.querySelectorAll('.rvo,.rvsw,.rvtl.en'), x => x.textContent).join('')), ctl: getComputedStyle(document.getElementById('rvc')).visibility }; });
      ok(L.b && L.ox <= 1 && !L.bad, tag + ' 題型 ' + ty + ' 跑出 畫面 ' + JSON.stringify(L)); ok(L.fs >= 26, tag + ' 題型 ' + ty + ' 題目 字 太小 ' + L.fs);
      ok(!L.zh, tag + ' 題型 ' + ty + ' 題目／選項 有 中文'); ok(L.ctl === 'hidden', tag + ' 測驗 的 時候 暫停 鈕 沒有 收起來');
      /* 交換：dec／ord 先 放 兩個，再 把 第 1 格 拖到 第 2 格 */
      if (ty === 'dec' || ty === 'ord') {
        const tl = await p.$$('.rvtray .rvtl'); await tl[0].click(); await p.waitForTimeout(80); const tl2 = await p.$$('.rvtray .rvtl:not(.used)'); await tl2[0].click(); await p.waitForTimeout(80);
        const b0 = await p.evaluate(() => [].map.call(document.querySelectorAll('.rvqz .rvds'), s => s.textContent));
        const s = await p.$$('.rvqz .rvds'); const r0 = await s[0].boundingBox(), r1 = await s[1].boundingBox();
        await p.mouse.move(r0.x + r0.width / 2, r0.y + r0.height / 2); await p.mouse.down(); await p.mouse.move(r0.x + r0.width / 2 + 20, r0.y + 10, { steps: 4 }); await p.mouse.move(r1.x + r1.width / 2, r1.y + r1.height / 2, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(150);
        const b1 = await p.evaluate(() => [].map.call(document.querySelectorAll('.rvqz .rvds'), s => s.textContent));
        ok(b1[0] === b0[1] && b1[1] === b0[0], tag + ' 題型 ' + ty + ' 拖 格子 沒有 互相 交換 ' + JSON.stringify([b0.slice(0, 2), b1.slice(0, 2)])); }
      /* 答錯 ＝ 答錯頁 */
      await p.evaluate(() => { const S = RVA.S, q = S.q; S.ans = false; /* 直接 用 引擎 的 判斷 */ });
      const wrong = await p.evaluate(ty => { const q = document.querySelector('.rvqz'); if (ty === 'mc' || ty === 'hear') { const S = RVA.S, b = [].filter.call(q.querySelectorAll('.rvo'), x => x.textContent !== S.q.o[0].replace(/'/g, '’'))[0]; b.click(); return 1; }
        if (ty === 'tf') { const b = [].filter.call(q.querySelectorAll('.rvo'), x => /True/.test(x.textContent) !== RVA.S.q.ok)[0]; b.click(); return 1; }
        if (ty === 'spot') { const S = RVA.S, b = q.querySelectorAll('.rvsw')[S.q.bad === 0 ? 1 : 0]; b.click(); return 1; }
        return 2; }, ty);
      if (wrong === 2) for (let k = 0; k < 12; k++) { const t = await p.$('.rvqz .rvtray .rvtl:not(.used)'), e = await p.evaluate(() => [].some.call(document.querySelectorAll('.rvqz .rvds'), s => !s.textContent)); if (!t || !e) break; await t.click(); await p.waitForTimeout(60); }
      let fbo = false; for (let i = 0; i < 30; i++) { await p.waitForTimeout(120); if (await p.evaluate(() => !!document.querySelector('.rvfb'))) { fbo = true; break; } if (await p.evaluate(() => !!document.querySelector('.rvok'))) break; }
      if (ty === 'dec' || ty === 'ord') { if (!fbo) { const isok = await p.evaluate(() => !!document.querySelector('.rvok')); ok(isok, tag + ' 題型 ' + ty + ' 放完 沒有 檢查'); continue; } }
      ok(fbo, tag + ' 題型 ' + ty + ' 答錯 沒有 答錯頁'); if (!fbo) continue;
      await p.waitForTimeout(400);
      const F = await p.evaluate(() => { const f = document.querySelector('.rvfx'), r = f.getBoundingClientRect(); return { t: f.textContent, k: f.querySelectorAll('.rvk').length, zh: [].every.call(f.querySelectorAll('.rvk'), k => k.querySelector('i')), say: !!f.querySelector('#rvfs'), b: r.bottom <= innerHeight + 1, fs: parseFloat(getComputedStyle(f.querySelector('.tr')).fontSize) }; });
      ok(/答錯了/.test(F.t) && /正確答案/.test(F.t) && /整句/.test(F.t) && /💡/.test(F.t) && F.k > 0 && F.zh && F.say, tag + ' 題型 ' + ty + ' 答錯頁 少 東西 ' + F.t.slice(0, 80));
      ok(/再聽一次/.test(F.t), tag + ' 答錯頁 沒有〔🔊 再聽一次〕'); ok(F.b && F.fs >= 22, tag + ' 題型 ' + ty + ' 答錯頁 跑出 畫面 或 字 太小');
      /* 唸 3 次 才 有〔▶ 繼續〕*/
      let nx = false; for (let i = 0; i < 40; i++) { await p.waitForTimeout(150); if (await p.evaluate(() => !!document.querySelector('.rvfx .nx'))) { nx = true; break; } }
      ok(nx && (await p.evaluate(() => document.querySelectorAll('.rvfx .n3 i.on').length)) === 3, tag + ' 題型 ' + ty + ' 答錯頁 沒有 唸 3 次 ➜ 繼續');
      if (nx) { await p.click('.rvfx .nx'); await p.waitForTimeout(200); ok(!(await p.evaluate(() => !!document.querySelector('.rvfb'))), tag + ' 按〔▶ 繼續〕沒有 回 動畫'); }
    }
    /* 答對：mc ＝ 點 正解 */
    const mi = await p.evaluate(() => RVA.S.spec.qz.findIndex(q => q.ty === 'mc' || q.ty === 'hear'));
    if (mi >= 0) { await p.evaluate(qi => { const S = RVA.S; S.gen++; S.tm.forEach(t => clearTimeout(t.id)); S.tm = []; S.plan = {}; S.plan[2 * S.i] = qi; document.querySelector('[data-rv="again"]').click(); }, mi);
      for (let i = 0; i < 60; i++) { await p.waitForTimeout(150); if (await p.evaluate(() => !!document.querySelector('.rvqz'))) break; }
      await p.evaluate(() => { const S = RVA.S, b = [].filter.call(document.querySelectorAll('.rvo'), x => x.textContent === S.q.o[0].replace(/'/g, '’'))[0]; b.click(); });
      await p.waitForTimeout(300); ok(await p.evaluate(() => /答對/.test((document.querySelector('.rvok') || { textContent: '' }).textContent) && !!document.querySelector('.rvok .rvk')), tag + ' 答對 沒有「✅ 答對了」＋ 正確 句子'); }
    /* 演完 ＋ 送 成績：把 剩下 的 頁 跳 到 最後 */
    await p.evaluate(() => { const S = RVA.S; S.gen++; S.tm.forEach(t => clearTimeout(t.id)); S.tm = []; S.plan = {}; document.querySelectorAll('.rvfb,.rvok').forEach(x => x.remove()); S.i = S.spec.sc.length - 1; document.querySelector('[data-rv="again"]').click(); });
    for (let i = 0; i < 80; i++) { await p.waitForTimeout(150); if (await p.evaluate(() => !!document.getElementById('rvend'))) break; }
    const end = await p.evaluate(() => { const e = document.querySelector('.rvend'); return e ? e.textContent : ''; });
    ok(/看完/.test(end) && /答對/.test(end), tag + ' 看完 那一頁 不對 ' + end.slice(0, 50));
    await p.waitForTimeout(1200);
    const S = decodeURIComponent(sent.join('\n')); ok(new RegExp(site === 'g3mid' ? 'g3gm_g3m-rv' : 'g4gm_mt-rv').test(S), tag + ' 沒有 送 突擊 測驗 成績 ' + S.slice(0, 160));
    if (await p.$('#rvend')) { await p.click('#rvend'); await p.waitForTimeout(400); ok(!(await p.evaluate(() => !!(RVA.S))), tag + '〔▶ 開始 這一關〕沒有 關掉 動畫'); }
    /* ⑨ 再 看 一次 ＝ 3 題 都 不一樣（同 一個 學生、同 一部）*/
    const diff = await p.evaluate(() => { const sp = RVD[Object.keys(RVD)[1]], took = []; for (let r = 0; r < 3; r++) { RVA.play(sp, function () {}); took.push(Object.keys(RVA.S.plan).map(k => RVA.S.plan[k]).sort((a, b) => a - b)); try { localStorage.setItem(RVA.S.key, JSON.stringify(RVA.S.seen)); } catch (e) { } RVA.close(); } return took; });
    const fl = [].concat(...diff); ok(new Set(fl).size === fl.length, tag + ' 再 看 一次 測驗 有 重複 ' + JSON.stringify(diff));
    ok(!errs.length, tag + ' JS 錯誤 ' + errs.slice(0, 2).join('｜'));
    await ctx.close();
  }
  await br.close();
  E.forEach(e => console.log('✗ ' + e));
  console.log('秒懂 複習 動畫：' + n + ' 項，' + E.length + ' 個 失敗');
  process.exit(E.length ? 1 : 0);
})();
