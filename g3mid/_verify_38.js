/* g3mid/_verify_38.js — 第三十八次 新 東西 的 量測（三、四年級 ✕ 3 種 螢幕）。只 印 失敗 項。不連 網路、不送 成績。node g3mid/_verify_38.js
 * hear2 先 聽 ➜ 字母 ➜ 圖、中英 語序 箭頭、四線格、is 的 i 紅、整句 中文 空格、答錯頁 字 大、答對頁（OKV）、解碼 生活 頁（LIFE）、🎰 轉盤 */
const { chromium } = require('playwright'), path = require('path'), ROOT = path.join(__dirname, '..'), E = []; let n = 0;
const ok = (c, m) => { n++; if (!c) E.push(m); };
(async () => {
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) for (const site of ['g3mid', 'midterm']) {
    const tag = site + ' ' + vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }); await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.addInitScript(() => { window.__NOGO = 1; window.__NODFXI = 1; window.__NOSNH = 1; HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 60); return Promise.resolve(); }; try { speechSynthesis.speak = u => setTimeout(() => u.onend && u.onend(), 60); } catch (e) { } });
    const p = await ctx.newPage(), er = []; p.on('pageerror', e => er.push(e.message)); await p.goto('file://' + path.join(ROOT, site, 'index.html')); await p.waitForTimeout(400);
    /* 中文 斷詞 */
    ok(await p.evaluate(() => ZSP('他是我的爺爺。') === '他 是 我的 爺爺。' && ZSP('你叫什麼名字？') === '你的 名字 是 什麼？（你 叫 什麼 名字？）'), tag + ' ZSP 斷詞 不對');
    /* 中英 語序：2026-11-02 第四十次 箭頭 拿掉 ➜ 彩色 語序 卡（.rvso）；解碼 那一部 第 1 頁 */
    await p.evaluate(() => { RVA.play(RVD.dc, function () { }); RVA.S.plan = {}; }); await p.waitForTimeout(2800); await p.click('#rvgo'); await p.waitForFunction(() => document.querySelector('.rvso'), null, { timeout: 20000 }).catch(() => {});
    const o = await p.evaluate(() => ({ a: !document.querySelector('.rvarw'), bx: !document.querySelector('.rvbx'), zb: [].map.call(document.querySelectorAll('.rvso .rvsr:nth-child(2) b'), b => b.textContent).join(' '), z: (document.querySelector('.rvz') || {}).textContent || '' }));
    ok(o.a && o.bx && /什麼|誰/.test(o.zb), tag + ' 中英 語序 卡 沒有（或 還有 箭頭）' + JSON.stringify(o)); ok(/ /.test(o.z), tag + ' 整句 中文 沒有 空格 ' + o.z);
    await p.evaluate(() => RVA.close());
    /* hear2：字首音 那一部 */
    const gid = site === 'g3mid' ? 'q1' : 'm1';
    await p.evaluate(gid => { RVA.play(RVD[gid], function () { }); const S = RVA.S, qi = S.spec.qz.findIndex(q => q.ty === 'hear2'); S.plan = {}; S.plan[1] = qi; S.nq = 1; }, gid);
    await p.waitForTimeout(2800); await p.click('#rvgo');
    let got = false; for (let i = 0; i < 80; i++) { await p.waitForTimeout(150); if (await p.evaluate(() => !!document.querySelector('.rvqz .rvol'))) { got = true; break; } }
    ok(got, tag + ' hear2 沒有 出現');
    if (got) { const h = await p.evaluate(() => ({ s: !!document.querySelector('.rvqz .rvhear'), n: document.querySelectorAll('.rvqz .rvol').length, fl: !!document.querySelector('.rvfl') }));
      ok(h.s && h.n === 4, tag + ' hear2 第 1 步：要 先 有 🔊、4 個 字母 ' + JSON.stringify(h));
      await p.evaluate(() => { const S = RVA.S; [].filter.call(document.querySelectorAll('.rvqz .rvol'), b => b.textContent === S.q.o[0])[0].click(); }); await p.waitForTimeout(1000);
      const p2 = await p.evaluate(() => ({ n: document.querySelectorAll('.rvqz .rvop').length, fs: parseFloat(getComputedStyle(document.querySelector('.rvqz .rvop') || document.body).fontSize) }));
      ok(p2.n === 4 && p2.fs >= 40, tag + ' hear2 第 2 步：4 個 圖、夠 大 ' + JSON.stringify(p2));
      await p.evaluate(() => { const S = RVA.S; [].filter.call(document.querySelectorAll('.rvqz .rvop'), b => b.textContent === S.q.p[0])[0].click(); }); await p.waitForTimeout(500);
      ok(await p.evaluate(() => !!document.querySelector('.rvok')), tag + ' hear2 兩步 都 對 ＝ 答對 頁');
      const fs = await p.evaluate(() => { const b = document.querySelector('.rvok .rvk b'); return b ? parseFloat(getComputedStyle(b).fontSize) : 0; }); ok(fs >= 40, tag + ' 答對 的 英文 字 太 小 ' + fs); }
    await p.evaluate(() => RVA.close());
    /* 四線格（三年級 q5）*/
    if (site === 'g3mid') { await p.evaluate(() => { RVA.play(RVD.q5, function () { }); RVA.S.plan = {}; }); await p.waitForTimeout(2800); await p.click('#rvgo'); await p.waitForTimeout(1500);
      const g = await p.evaluate(() => { const s = document.querySelector('.rv4l'); if (!s) return null; const r = s.getBoundingClientRect(); return { red: [].some.call(s.querySelectorAll('line'), l => l.getAttribute('stroke') === '#FF5A5A'), lines: s.querySelectorAll('line').length, st: s.querySelectorAll('.rv4s').length, fl: /2F/.test(s.textContent) && /B1/.test(s.textContent), in: r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1, h: r.height }; });
      ok(g && g.red && g.lines === 4 && g.st >= 4 && g.fl && g.in && g.h >= 100, tag + ' 四線格 不對 ' + JSON.stringify(g)); await p.evaluate(() => RVA.close()); }
    /* 解碼 的 縮寫：i 紅、______ 跟 底線 齊平 */
    const eq = await p.evaluate(() => { let L = null; for (const k in window) { const v = window[k]; if (v && v.A && v.A[1] && v.A[1].s) { L = v.A[1]; break; } } L.key = 'v38' + Math.random(); decLesson(L, () => { }); return 1; });
    await p.waitForTimeout(9000);
    const q = await p.evaluate(() => { const bl = document.querySelector('#dcl .dbl'), c = bl && bl.closest('.dlc').querySelector('.en'), w = [...document.querySelectorAll('#dcl .dleq .dlc .en')][0]; if (!bl) return null; const a = bl.getBoundingClientRect(), b = w.getBoundingClientRect();
      return { dy: Math.abs(a.bottom - b.bottom), red: !!document.querySelector('#dcl .dri'), zi: !!document.querySelector('#dcl .dzi'), sk: !!document.querySelector('#dlsk') }; });
    ok(q && q.dy < 22 && q.red && q.zi && !q.sk, tag + ' 縮寫 動畫：______ 齊平、i 紅、沒有 跳過 ' + JSON.stringify(q));
    await p.evaluate(() => decClose());
    /* 解碼 生活 頁 */
    await p.evaluate(() => { window.__NOGO = 0; LIFE.go({ en: "What's your name? My name is Bill.", z: '你叫什麼名字？我的名字是 Bill。' }, () => { window.__lf = 1; }); }); await p.waitForTimeout(1500);
    const lf = await p.evaluate(() => { const o = document.getElementById('lifev'), r = o.querySelector('.lfw').getBoundingClientRect(); return { on: o.classList.contains('on'), b: o.querySelectorAll('.lb').length, c: o.querySelector('.lfc').textContent, z: o.querySelector('.lfz').textContent, in: r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1 }; });
    ok(lf.on && lf.b === 2 && /開學/.test(lf.c) && / /.test(lf.z) && lf.in, tag + ' 生活 頁 不對 ' + JSON.stringify(lf));
    for (let i = 0; i < 60 && !(await p.evaluate(() => window.__lf)); i++) await p.waitForTimeout(150); ok(await p.evaluate(() => window.__lf === 1), tag + ' 生活 頁 唸完 沒有 自己 走');
    await p.evaluate(() => { window.__NOGO = 1; });
    /* 🔦 記憶 解碼：第 4 題 先 秒懂 說明 ➜ 我 準備好 了 ➜ 3 秒 後 英文 變暗＋〔👀 再看 一次〕*/
    const mm = await p.evaluate(() => { const L = (window.XBX ? XBX() : XB).dc, st = document.createElement('div'); document.body.appendChild(st); DEC.rr = window.R; DEC.n = 3; decRender(L[0], st); return { mi: !!document.querySelector('.dcmi') }; });
    ok(mm.mi, tag + ' 記憶 解碼 沒有 先 秒懂 說明');
    if (mm.mi) { await p.waitForSelector('#dcmg:not([disabled])', { timeout: 8000 }).catch(() => {}); await p.click('#dcmg'); await p.waitForTimeout(400);
      const m2 = await p.evaluate(() => ({ dim: !!document.querySelector('.dcw.mem'), pk: !!document.querySelector('.dcpk:not([hidden])') })); ok(m2.dim && m2.pk, tag + ' 記憶 解碼 英文 沒有 變暗 或 沒有〔👀 再看 一次〕' + JSON.stringify(m2));
      await p.click('.dcpk'); ok(await p.evaluate(() => !document.querySelector('.dcw.mem') && DEC.memPeek === 1), tag + ' 〔👀 再看 一次〕英文 沒有 回來'); }
    /* 答對 頁（OKV）*/
    await p.evaluate(() => OKV.ok('<div class="gls"><span class="gw"><b>Hi.</b><i>嗨</i></span></div><div><span class="tr keepsp">整句：嗨。</span></div>', [['', 'Hi.']], () => { window.__ok = 1; })); await p.waitForTimeout(150);
    ok(await p.evaluate(() => /答對了/.test(document.getElementById('okv').textContent)), tag + ' 答對 頁 沒有 出現');
    for (let i = 0; i < 40 && !(await p.evaluate(() => window.__ok)); i++) await p.waitForTimeout(100); ok(await p.evaluate(() => window.__ok === 1), tag + ' 答對 頁 唸完 沒有 走');
    ok(!er.length, tag + ' 程式 錯誤 ' + er.slice(0, 2).join('｜')); await ctx.close();
  }
  await br.close(); E.forEach(x => console.log('✗ ' + x)); console.log((E.length ? '❌' : '✅') + ' 第三十八次 新 東西：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0);
})();
