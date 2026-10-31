/* g3mid/_verify.js — 📝 三年級 複習 量測（只印失敗項和一行總結；SHOT=資料夾 拍照，不算量測）
 *   node g3mid/_verify.js            三種螢幕（iPad 橫 1024×768、iPad 直 820×1180、教室觸控螢幕 1920×1080）
 * 量：題庫每一句都有語音檔、照片都在、總首頁有〔📝 三年級 複習〕、在家複習沒有、不接成績系統；
 *     大廳 10 種；每一種遊戲：畫面不超出、不用捲動就看得到、字 ≧ 18px、按鈕 ≧ 48px、照片載得到、倒數 15／20 秒真的在減少；
 *     第 1 題故意答錯 ➜ 綠底解說：每一個英文字下面有中文、整句翻譯、自動唸 3 次以後才有〔▶ 下一題〕、解說的時候倒數停住；
 *     第 2 題答對 ➜ 分數變多；1024 那一種 8 題玩完 ➜「答對 7 ／ 8」。手指寫字：照字母的筆畫畫上去（電腦改作業要判對），
 *     故意寫成另一個大小寫（要判錯）。不連網路、不送任何成績。 */
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.join(__dirname, '..'), D = require('./_data.js'), { HW } = require('./_hw.js'), SHOT = process.env.SHOT;
const E = []; let n = 0, DCL1 = 0;
const akey = s => String(s).replace(/[’]/g, "'").replace(/[=＝≠➜→⇒…＿_　]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const rd = f => { const t = fs.readFileSync(path.join(__dirname, f), 'utf8'); return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)); };
const A = rd('audio/aud.js'), W = rd('audio/w/aud.js');
/* 1. 每一句要唸的都有語音檔 */
D.SAY.forEach(s0 => { n++; const s = typeof s0 === 'string' ? s0 : s0.k, k = akey(s.replace(/^m:/, '')), mk = /^m:/.test(s) ? 'm:' + k : k;
  const f = A[mk] ? 'audio/' + A[mk][0] : W[k] ? 'audio/w/' + W[k][0] : '';
  if (!f) E.push('沒有語音檔：' + s); else if (!fs.existsSync(path.join(__dirname, f))) E.push('語音檔不見了：' + s); });
/* 2026-10-26 第 1-1 點：打地鼠 的 慢 男聲（m1）、更慢（m2）每個 字 都 有 */
{ const M1 = rd('audio/m1/aud.js'), M2 = rd('audio/m2/aud.js'); D.SAYM.forEach(w => { n++; if (!M1[w] || !M2[w] || !fs.existsSync(path.join(__dirname, 'audio/m1', M1[w][0])) || !fs.existsSync(path.join(__dirname, 'audio/m2', M2[w][0]))) E.push('打地鼠 慢 的 語音檔 沒有：' + w); }); }
D.CE.forEach(c => { n++; if (!fs.existsSync(path.join(__dirname, 'img', c.k + '.jpg'))) E.push('沒有照片：' + c.k); });
/* 2. 總首頁有〔📝 三年級 複習〕；在家複習沒有；不接成績系統 */
{ n++; const hub = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/<\/?span[^>]*>/g, '');
  if (!/href="g3mid\/index\.html"[^>]*>📝 三年級 複習</.test(hub)) E.push('總首頁沒有〔📝 三年級 複習〕');
  for (const d of ['g3-review', 'g4-review']) for (const f of fs.readdirSync(path.join(ROOT, d)).filter(f => /\.html$/.test(f))) { n++; if (/g3mid\/(?!home\.html)/.test(fs.readFileSync(path.join(ROOT, d, f), 'utf8').replace(/g3mid\/audio\//g, ''))) E.push(d + '/' + f + '：在家複習連到三年級複習（只 可以 連 25 題 闖關 home.html，2026-10-31 第三十五次 第 9 點）'); }
  n++; const h = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  /* 2026-10-26 第二十七次 第 1-(3) 點：三年級 複習 的 成績 也 進 老師看板 ➜ 一定 要 接 成績系統（登入、佇列）*/
  if (!/score\/url\.js/.test(h) || !/id="scbar"/.test(h) || !/g3gm_g3m-/.test(h)) E.push('三年級複習 沒有 接 成績系統（老師 第二十七次：成績 要 進 老師看板）'); }

(async () => {
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]].filter(v => !process.env.VP || +process.env.VP === v[0])) {
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: false }), tag = vp.join('×'), full = vp[0] === 1024;
    await ctx.route(/^https?:\/\//, r => r.abort());
    /* 假 的 成績 伺服器（絕對 不送 真的 成績表）＋ 已經 登入 30401 */
    await ctx.route(/script\.test/, r => r.fulfill({ contentType: 'application/json', body: '{"ok":true,"dup":[]}' }));
    await ctx.addInitScript(() => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} });
      localStorage.setItem('score_last', '"30401"'); localStorage.setItem('score_id_g3', '"30401"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', '30401'); });
    /* 聲音：不真的放，0.06 秒就算唸完（數唸了幾次） */
    await ctx.addInitScript(() => { window.__NOGO = 1; window.__NORVA = 1; window.__NOWB = 1; window.__NOTUT = 1; window.__NOUNLOCK = 1; window.__G2CALM = 1; window.__DCLK = 0.05; window.__say = []; HTMLMediaElement.prototype.play = function () { const a = this; window.__say.push(a.src.split('/').slice(-2).join('/')); setTimeout(() => a.onended && a.onended(), 60); return Promise.resolve(); };
      try { speechSynthesis.speak = u => { window.__say.push('tts:' + u.text); setTimeout(() => u.onend && u.onend(), 60); }; } catch (e) {} });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(400);
    n++; const lb = await p.evaluate(() => ({ g: document.querySelectorAll('.gc').length, ox: document.documentElement.scrollWidth - innerWidth,
      sm: [].filter.call(document.querySelectorAll('#lobby *'), x => [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(x).fontSize) < 18).length,
      lo: [].filter.call(document.querySelectorAll('#lobby .gc,#lobby .home'), x => x.getBoundingClientRect().height < 48).length }));
    if (lb.g !== 10 || lb.ox > 1 || lb.sm || lb.lo) E.push(tag + ' 大廳：' + JSON.stringify(lb));
    if (SHOT) await p.screenshot({ path: path.join(SHOT, 'g3m_lobby_' + vp[0] + '.png'), fullPage: true });
    /* 2026-10-25 第二十五次：開場 3、2、1、GO! 才 出 第 1 題 */
    { n++; const s = await p.evaluate(async () => { window.__NOGO = 0; start(0); await new Promise(r => setTimeout(r, 300)); const a = { on: document.getElementById('go').classList.contains('on'), t: document.getElementById('go').textContent, k: R.k };
        await new Promise(r => setTimeout(r, 2800)); a.k2 = R.k; a.off = !document.getElementById('go').classList.contains('on'); window.__NOGO = 1; window.__NORVA = 1; lobby(); return a; });
      if (!s.on || !/3/.test(s.t) || s.k !== -1 || s.k2 !== 0 || !s.off) E.push(tag + ' 開場 3 2 1 GO 不對：' + JSON.stringify(s)); }
    for (let gi = 0; gi < D.GAMES.length; gi++) {
      const g = D.GAMES.filter(x => x.id === D.ORD[gi])[0]; if (process.env.ONLY && process.env.ONLY.split(',').indexOf(g.id) < 0) continue;
      await p.evaluate(i => { window.__say = []; start(i); }, gi); await p.waitForTimeout(300);
      /* 2026-10-30 第三十四次 第 6 點：資料表 小幫手 一開始 ＝ 習作 21 頁 獨立 頁（圖、那一句、2.6 秒 才 有〔▶ 開始〕、倒數 還沒 走）*/
      if (g.id === 'q9') { await p.evaluate(i => { lobby(); window.__NOWB = 0; start(i); }, gi); await p.waitForTimeout(900); n++;
        const w = await p.evaluate(() => { const o = document.getElementById('wb9'), im = o.querySelector('img'), r = im ? im.getBoundingClientRect() : {};
          return { on: o.classList.contains('on'), img: !!(im && im.complete && im.naturalWidth), t: o.textContent.replace(/\s+/g, ''), go: !!document.querySelector('.wbgo'), run: TM.run, ins: r.bottom <= innerHeight && r.top >= 0 }; });
        if (!w.on || !w.img || !/這一關的題目是根據習作21頁改編/.test(w.t) || w.go || w.run || !w.ins) E.push(tag + ' 資料表 一開始 沒有 習作 21 頁 獨立 頁：' + JSON.stringify(w));
        await p.waitForSelector('.wbgo', { timeout: 4000 }).catch(() => E.push(tag + ' 習作 21 頁 沒有〔▶ 開始〕')); await p.click('.wbgo').catch(() => {}); await p.waitForTimeout(300);
        if (await p.evaluate(() => document.getElementById('wb9').classList.contains('on'))) E.push(tag + ' 按〔▶ 開始〕習作 頁 沒有 關'); await p.evaluate(() => { window.__NOWB = 1; }); }
      if (g.id === 'q8') { n++; const wp = await p.evaluate(() => ({ on: document.getElementById('wp').classList.contains('on'), n: document.querySelectorAll('#wp [data-wr]').length, k: R.k }));
        if (!wp.on || wp.n < 10 || wp.k !== -1) E.push(tag + ' q8：第一次 玩 沒有 先 選 戰士：' + JSON.stringify(wp));
        if (wp.on) { await p.click('#wp [data-wr]'); await p.waitForTimeout(300); } }
      if (g.id === 'q2') { n++; const hw = await p.$('#q2go'); if (!hw) E.push(tag + ' q2：第 1 題 沒有〔怎麼 玩〕說明'); else { const t0 = await p.evaluate(() => tLeft()); await p.waitForTimeout(500); const t1 = await p.evaluate(() => tLeft()); if (t1 < t0 - .05) E.push(tag + ' q2：看 說明 的 時候 倒數 在 走'); await hw.click(); } }
      await p.waitForTimeout(600);
      /* 版面 */
      const m = await p.evaluate(() => { const sm = [], low = [], out = [];
        document.querySelectorAll('#game *').forEach(x => { const r = x.getBoundingClientRect(); if (!r.width || getComputedStyle(x).visibility === 'hidden') return;
          const t = [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim());
          if (t && parseFloat(getComputedStyle(x).fontSize) < 18) sm.push((x.className || x.tagName) + ':' + x.textContent.trim().slice(0, 10));
          if ((x.tagName === 'BUTTON' || x.classList.contains('pk')) && (r.height < 48 || r.width < 48)) low.push((x.className || 'button') + ':' + x.textContent.trim().slice(0, 8) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
          if ((x.tagName === 'BUTTON' || x.tagName === 'CANVAS' || x.classList.contains('pk') || x.classList.contains('id')) && (r.right > innerWidth + 1 || r.left < -1 || r.bottom > innerHeight + 1)) out.push((x.className || x.tagName) + ' ' + Math.round(r.bottom)); });
        const img = [].filter.call(document.querySelectorAll('#game img'), i => !i.complete || !i.naturalWidth).length;
        return { sm, low, out, img, ox: document.documentElement.scrollWidth - innerWidth, t: tLeft(), T: TM.T }; });
      n++; if (m.sm.length || m.low.length || m.out.length || m.img || m.ox > 1) E.push(tag + ' ' + g.id + ' ' + g.nm + '：字太小 ' + m.sm.slice(0, 3).join('、') + '／按鈕 ' + m.low.slice(0, 3).join('、') + '／跑出畫面 ' + m.out.slice(0, 3).join('、') + '／照片 ' + m.img + '／左右捲 ' + m.ox);
      n++; if (m.T !== g.t || !(m.t < g.t && m.t > g.t - 3)) E.push(tag + ' ' + g.id + '：倒數 ' + m.T + ' 秒、現在 ' + m.t.toFixed(1));
      if (SHOT && vp[0] !== 1920) await p.screenshot({ path: path.join(SHOT, 'g3m_' + g.id + '_' + vp[0] + '.png') });
      n++; const ex = await special(p, g); if (ex.length) E.push(tag + ' ' + g.id + '：' + ex.join('／'));
      const qn = full ? 8 : 2;
      for (let k = 0; k < qn; k++) {
        const wrong = k === 0, sc0 = await p.evaluate(() => R.score);
        const f3 = g.id === 'q3' && k === 1 ? await p.evaluate(() => { window.__say = []; return aud(R.q.say).split('/').slice(-2).join('/'); }) : '';
        await answer(p, g, wrong);
        if (f3) { await p.waitForFunction(kk => R.k > kk, k, { timeout: 15000 }).catch(() => {}); n++; const sy = await p.evaluate(() => window.__say.slice());
          if (sy[0] !== f3) E.push(tag + ' q3：夾到 對的 照片 以後 沒有 再 唸 一次 那一句（第二十八次 第 6 點）：' + JSON.stringify(sy.slice(0, 3)) + ' 要 ' + f3); }
        if (wrong) {
          /* 2026-10-26 第二十九次 第 8 點：資料表 答錯 ＝ 先 停 在 題目 畫面：三個 人 各 一種 顏色 的 方框（答錯 的 那一位 紅色）＋ 箭頭，演完 才 綠底 頁 */
          if (g.id === 'q9') { await p.waitForTimeout(2600); n++; const k = await p.evaluate(() => ({ kk: !!R.q.k, fb: document.querySelector('#fb').classList.contains('on'), k9: document.querySelectorAll('.k9').length, ar: !!document.querySelector('.ar9 path'),
              red: [].filter.call(document.querySelectorAll('.k9'), x => /255, 107, 107|#FF6B6B/i.test(x.getAttribute('style') || '')).length, cols: new Set([].map.call(document.querySelectorAll('.k9'), x => x.style.getPropertyValue('--k'))).size, anim: [].filter.call(document.querySelectorAll('.k9'), x => getComputedStyle(x).animationIterationCount === 'infinite').length }));
            if (k.fb || k.k9 < (k.kk ? 7 : 9) || !k.ar || k.red < 3 || k.cols !== 3 || k.anim) E.push(tag + ' q9：答錯 沒有 先 在 題目 畫面 框 關鍵字＋箭頭（或 一直 閃）' + JSON.stringify(k)); }
          await p.waitForSelector('#fb.on', { timeout: 7000 }).catch(() => {});
          const t1 = await p.evaluate(() => tLeft()); await p.waitForTimeout(1200);
          const f = await p.evaluate(() => { const gw = [].slice.call(document.querySelectorAll('#fb .gw'));
            return { on: document.querySelector('#fb').classList.contains('on'), bg: getComputedStyle(document.querySelector('#fb .box')).backgroundImage,
              gw: gw.length, emp: gw.filter(x => !x.querySelector('i').textContent.trim() && !/^(to|a\.?|[A-Za-z]\.?)$/i.test(x.querySelector('b').textContent.replace(/[.,?!]/g, ''))).map(x => x.querySelector('b').textContent),
              tr: (document.querySelector('#fb .tr') || {}).textContent || '', zh: R.q.zh, nx: !!document.querySelector('#fbn'), t: tLeft(),
              big: gw.length ? parseFloat(getComputedStyle(gw[0].querySelector('b')).fontSize) : 99, ltr: !!document.querySelector('#fb .ltr canvas'),
              ov: document.querySelector('#fb .box').scrollHeight - document.querySelector('#fb .box').clientHeight }; });
          n++; if (!f.on || !/gradient/.test(f.bg)) E.push(tag + ' ' + g.id + '：答錯沒有綠底解說');
          n++; if (!f.gw && !f.ltr) E.push(tag + ' ' + g.id + '：解說沒有逐字中文');
          n++; if (f.emp.length) E.push(tag + ' ' + g.id + '：這些字下面沒有中文 ' + f.emp.join(' '));
          n++; if (f.tr.indexOf(f.zh) < 0) E.push(tag + ' ' + g.id + '：沒有整句翻譯');
          n++; if (f.nx && g.id !== 'q9') E.push(tag + ' ' + g.id + '：還沒唸完 3 次就有〔▶ 下一題〕');
          n++; if (Math.abs(f.t - t1) > .05) E.push(tag + ' ' + g.id + '：解說的時候倒數還在走');
          n++; if (f.big < 30) E.push(tag + ' ' + g.id + '：解說英文太小 ' + f.big);
          n++; if (f.ov > 2 && vp[0] !== 820) E.push(tag + ' ' + g.id + '：解說要捲動 ' + f.ov + 'px');
          /* 2026-10-26 第 1-7 點：唸 的 時候 點〔🔊 再聽〕不可以 當機（還是 要 出現〔▶ 下一題〕）*/
          if (!f.nx) await p.click('#fbs').catch(() => {});
          const s0 = await p.evaluate(() => window.__say.length);
          await p.waitForSelector('#fbn', { timeout: 12000 }).catch(() => {});
          const s1 = await p.evaluate(() => ({ n: window.__say.length, nx: !!document.querySelector('#fbn'), tts: window.__say.filter(x => /^tts:/.test(x)) }));
          n++; if (!s1.nx) E.push(tag + ' ' + g.id + '：唸完 3 次還是沒有〔▶ 下一題〕');
          if (g.id === 'q9') { n++; const r9 = await p.evaluate(() => ({ n3: document.querySelectorAll('#n3 span').length, say: window.__say.length }));
            if (r9.n3 !== 1 || r9.say - s0 > 6) E.push(tag + ' q9：答錯頁 要 只唸 1 次（3 句）：' + JSON.stringify(r9) + ' 從 ' + s0); }
          if (g.id === 'q4' || g.id === 'q5') { n++; const lw = await p.evaluate(() => ({ dot: !!document.querySelector('#fb .lnh'), y: (document.querySelector('#fb .yp') || {}).textContent || '' }));
            if (!lw.dot && !(g.id === 'q4' && vp[0] === 820)) E.push(tag + ' ' + g.id + '：答錯頁 沒有「頂天立地 ● 要 碰到 線」');
            n++; const nc = await p.evaluate(() => document.querySelectorAll('#fb .ltr canvas').length); if (nc < 2 && !(g.id === 'q4' && vp[0] === 820)) E.push(tag + ' ' + g.id + '：答錯頁 要 有 兩個 字母 都 畫 在 格線 上（題目／比一比 ＋ 正確答案）：' + nc); if (vp[0] === 1920 && !/^[cosvwxz]$/i.test(await p.evaluate(() => R.q.want || ''))   /* 大小寫 形狀 一樣 的 字 浮 起來 ＝ 會 被 看成 另一個 大小寫（不是 頂天立地 的 錯）*/ && !/沒有 碰到/.test(lw.y)) E.push(tag + ' ' + g.id + '：寫 浮 起來 的 字 沒有 說「沒有 碰到 …線」：' + lw.y.slice(0, 40)); }
          n++; if (s1.tts.length) E.push(tag + ' ' + g.id + '：沒有語音檔，用了瀏覽器語音 ' + s1.tts.slice(0, 2).join('、'));
          if (SHOT && vp[0] !== 1920) await p.screenshot({ path: path.join(SHOT, 'g3m_' + g.id + '_fb_' + vp[0] + '.png') });
          await p.click('#fbn'); await p.waitForTimeout(500);
          n++; const kk = await p.evaluate(() => R.k); if (kk !== 1) E.push(tag + ' ' + g.id + '：按〔▶ 下一題〕沒有到第 2 題');
        } else {
          await p.waitForFunction(kk => R.k > kk || !document.querySelector('#endv').hidden, k, { timeout: 9000 }).catch(() => E.push(tag + ' ' + g.id + ' 第 ' + (k + 1) + ' 題答對沒有到下一題'));
          const sc1 = await p.evaluate(() => R.score); n++; if (!(sc1 > sc0)) E.push(tag + ' ' + g.id + ' 第 ' + (k + 1) + ' 題答對分數沒有變多（' + sc0 + '）');
          await p.waitForTimeout(250);
        }
      }
      if (full) { n++; const e = await p.evaluate(() => ({ v: !document.querySelector('#endv').hidden, t: document.querySelector('#end').textContent }));
        if (!e.v || e.t.indexOf('答對 7 ／ 8') < 0) E.push(tag + ' ' + g.id + '：玩完沒有「答對 7 ／ 8」：' + e.t.slice(0, 40));
        /* 第二十七次：記進 成績（題組 g3gm_g3m-遊戲、8 題、7 題 對、題庫 第幾題 對得上）*/
        n++; const rq = await p.evaluate(id => { const Q = JSON.parse(localStorage.getItem('score_q') || '[]').concat(JSON.parse(localStorage.getItem('score_sent') || '[]')); const r = Q.filter(x => x.set === 'g3gm_g3m-' + id).pop(); return r ? { n: r.qs.length, ok: r.qs.filter(q => q[0]).length, bi: r.qs.every(q => q[5] >= 0), nm: r.name, src: r.src } : null; }, g.id);
        if (!rq || rq.n !== 8 || rq.ok !== 7 || !rq.bi || !/三年級 複習/.test(rq.nm)) { const t2 = await p.evaluate(() => (document.querySelector('.rcn') || {}).textContent); E.push(tag + ' ' + g.id + '：沒有 記進 成績 ' + JSON.stringify(rq) + ' ' + t2); }
        if (SHOT) await p.screenshot({ path: path.join(SHOT, 'g3m_' + g.id + '_end.png') }); }
      await p.evaluate(() => lobby()); await p.waitForTimeout(200);
    }
    /* 第三十二次 3-(1)(2)：25 題 做 3 題 ➜〔✕ 離開〕先 問 ➜ 繼續 ➜ 離開 ➜〔▶ 繼續 25 題〕從 第 4 題、12 分；中途 不送；做過 的 先 不出 */
    if (full && (!process.env.ONLY || /xr/.test(process.env.ONLY))) {
      /* 第三十二次 3-(3)：平常 打開 沒有 25／50 題；⚡ 現場任務 開了 x25 ＝ 只 有 那一顆、沒有 遊戲 格子（Firebase 換 假 的） */
      { await p.evaluate(() => { CR = null; lobby(); }); n += 2; const z0 = await p.evaluate(() => ({ xb: document.querySelectorAll('#xrow .xb').length, off: !!document.querySelector('.xoff') }));
        if (z0.xb || !z0.off) E.push(tag + ' 平常 打開 還 看得到 25／50 題 ' + JSON.stringify(z0));
        await p.evaluate(N => { LDB.set = LDB.must = LDB.patch = () => Promise.resolve(true); CR = { room: '0304', t: 1, cfg: { on: 1, t: 1, set: 'x' + N, gs: [], m: 'self' }, acc: {}, n: 0, ok: 0, q: -9 }; lobby(); }, 25); const z1 = await p.evaluate(() => ({ xb: [...document.querySelectorAll('#xrow [data-x],#xrow [data-xr]')].filter(b => (b.closest('.xbw') || b).style.display !== 'none').map(b => b.dataset.x || b.dataset.xr).join(), gc: [...document.querySelectorAll('#grid .gc')].filter(b => b.style.display !== 'none').length }));
        if (z1.xb !== '25' || z1.gc) E.push(tag + ' 現場任務 開了 25 題：要 只 有 25 那一顆 ' + JSON.stringify(z1)); }
      const ID = await p.evaluate(() => SCID); await p.evaluate(id => { const N = 25; LDB.set = LDB.must = LDB.patch = () => Promise.resolve(true); CR = { room: '0304', t: 1, cfg: { on: 1, t: 1, set: 'x' + N, gs: [], m: 'self' }, acc: {}, n: 0, ok: 0, q: -9 }; localStorage.removeItem('g3m_seen_' + id); localStorage.removeItem('g3m_xs25_' + id); lobby(); }, ID);
      await p.click('#xrow .xb[data-x="25"]'); await p.waitForTimeout(400);
      for (let k = 0; k < 3; k++) { await passL(p); const hw = await p.$('#q2go'); if (hw) { await hw.click(); await p.waitForTimeout(150); } const wp = await p.$('#wp.on [data-wr]'); if (wp) { await wp.click(); await p.waitForTimeout(250); }
        const id = await p.evaluate(() => G.id); await p.waitForTimeout(id === 'q2' ? 300 : 120); await answer(p, { id }, false);
        await p.waitForFunction(kk => R.k > kk, k, { timeout: 15000 }).catch(() => E.push(tag + ' 離開 測試：第 ' + (k + 1) + ' 題 沒有 到 下一題')); await p.waitForTimeout(150); }
      const sent0 = await p.evaluate(() => JSON.parse(localStorage.getItem('score_q') || '[]').filter(x => x.set === 'g3gm_g3m-x25').length);
      await p.click('#qx'); await p.waitForTimeout(300); n += 6;
      const q1 = await p.evaluate(() => ({ on: document.getElementById('xq').classList.contains('on'), t: document.getElementById('xq').innerText, run: TM.run, h: Math.round(document.getElementById('xstay').getBoundingClientRect().height) }));
      if (!q1.on || !/真的 要 離開 嗎/.test(q1.t) || !/存好/.test(q1.t) || !/第 4 題/.test(q1.t) || q1.run || q1.h < 64) E.push(tag + ' 按〔✕ 離開〕沒有 先 問（存好、從 第 4 題、倒數 停住）' + JSON.stringify(q1));
      await p.click('#xstay'); await p.waitForTimeout(300); if (await p.evaluate(() => document.getElementById('xq').classList.contains('on') || document.getElementById('game').hidden)) E.push(tag + '〔▶ 繼續 作答〕沒有 回到 題目');
      await p.click('#qx'); await p.waitForTimeout(300); await p.click('#xleave'); await p.waitForTimeout(400);
      const lb = await p.evaluate(() => ({ r: (document.querySelector('[data-xr="25"]') || {}).innerText || '', nw: !!document.querySelector('.xb2[data-x="25"]'), sent: JSON.parse(localStorage.getItem('score_q') || '[]').filter(x => x.set === 'g3gm_g3m-x25').length }));
      if (!/繼續 25 題/.test(lb.r) || !/第 3 ／ 25/.test(lb.r) || !lb.nw) E.push(tag + ' 大廳 沒有〔▶ 繼續 25 題〕〔🔄 重新 開始〕' + JSON.stringify(lb));
      if (lb.sent !== sent0) E.push(tag + ' 中途 離開 不可以 送 成績');
      await p.click('[data-xr="25"]'); await p.waitForTimeout(500); await passL(p);
      const rs = await p.evaluate(() => ({ k: R.k, sc: R.score, q: R.Q.length, n: R.qs.length }));
      if (rs.k !== 3 || rs.sc !== 12 || rs.q !== 3 || rs.n !== 25) E.push(tag + ' 繼續 以後 不是 從 第 4 題、12 分：' + JSON.stringify(rs));
      const sn = await p.evaluate(id => { const S = JSON.parse(localStorage.getItem('g3m_seen_' + id) || '[]'); lobby(); startX(25); const hit = R.qs.filter(q => S.indexOf(XALL.indexOf(q)) >= 0).length; lobby(); return { s: S.length, hit }; }, ID);
      if (sn.s !== 3 || sn.hit) E.push(tag + ' 做過 的 題目 下一次 又 出現 ' + JSON.stringify(sn));
      await p.evaluate(id => { localStorage.removeItem('g3m_xs25_' + id); localStorage.removeItem('g3m_seen_' + id); lobby(); }, ID); }
    /* 2026-10-26 第二十八次 第 1、2 點：📝 25 題／50 題 挑戰（10 關 連著 玩、每題 4／2 分、30% 類似、記 成績）*/
    for (const N of (process.env.ONLY && !/x/.test(process.env.ONLY) ? [] : full ? [25, 50] : vp[0] === 820 ? [25] : [])) {
      await p.evaluate(N => { LDB.set = LDB.must = LDB.patch = () => Promise.resolve(true); CR = { room: '0304', t: 1, cfg: { on: 1, t: 1, set: 'x' + N, gs: [], m: 'self' }, acc: {}, n: 0, ok: 0, q: -9 }; lobby(); }, N); await p.waitForTimeout(200);
      n++; const lb2 = await p.evaluate(() => [...document.querySelectorAll('#xrow .xb')].filter(b => b.style.display !== 'none').map(b => b.dataset.x + ':' + Math.round(b.getBoundingClientRect().height)).join());
      if (lb2.split(':')[0] !== String(N) || +lb2.split(':')[1] < 60) E.push(tag + ' 現場任務 大廳 沒有〔📝 ' + N + ' 題〕大按鈕：' + lb2);
await p.evaluate(d1 => { if (!d1) Object.keys(localStorage).filter(k => /^dcl_seen_/.test(k)).forEach(k => localStorage.removeItem(k)); window.__DCLMIN = d1 ? 0 : undefined; }, DCL1);   /* 第一次 量 ＝ 沒 看過 動畫（不能 跳過、≧ 20 秒）*/
      await p.click('#xrow .xb[data-x="' + N + '"]'); await p.waitForTimeout(400);
      const pl = await p.evaluate(() => ({ c: R.cnt, s: R.nsim, sim: R.qs.filter(q => q.sim).length, n: R.qs.length, ord: R.lvOf.every((l, i) => !i || l >= R.lvOf[i - 1]) }));
      n++; const want = N === 25 ? [1, 2] : [3, 4], dN = N === 25 ? 8 : 15;   /* 2026-10-29：第 1 關 ＝ 🔓 解碼 任務 8／15 題，其他 10 關 平均 */
      if (pl.c[0] !== dN || pl.n !== N || pl.c.slice(1).some(x => x < want[0] || x > want[1]) || pl.sim !== Math.round(N * .3) || !pl.ord) E.push(tag + ' ' + N + ' 題：抽題 不 平均／類似 不是 30%：' + JSON.stringify(pl));
      let lvSeen = new Set(), guard = 0, sc0 = 0;
      while (guard++ < N + 5) {
        const st = await p.evaluate(() => ({ end: !document.querySelector('#endv').hidden, k: R.k, id: G && G.id, lv: R.lv, sc: R.score, gnm: document.getElementById('gnm').textContent }));
        if (st.end) break; lvSeen.add(st.lv);
        if (st.k === 0 && !/第 1 關/.test(st.gnm)) E.push(tag + ' ' + N + ' 題：上面 沒有 寫「第 1 關」：' + st.gnm);
        /* 🔓 解碼 任務：每一課 第一題 前 先 有 秒懂 動畫（≧ 20 秒、第一次 不能 跳過）*/
        if (st.id === 'dc') { const L = await p.evaluate(() => document.getElementById('dcl').classList.contains('on'));
          if (L) { n++; if (!DCL1) { DCL1 = 1; const a = await p.evaluate(async () => { await new Promise(r => setTimeout(r, 3000)); return { go: !!document.getElementById('dlgo'), sk: !!document.getElementById('dlsk'), c: document.querySelectorAll('#dcl .dlc').length, zh: [...document.querySelectorAll('#dcl .dlc .zh')].every(x => x.textContent.trim()), t: TM.run }; });
              if (a.go || a.sk || !a.c || !a.zh || a.t) E.push(tag + ' 解碼 動畫：3 秒 就 可以 開始／跳過、沒有 字、或 倒數 在 走：' + JSON.stringify(a));
              const t0 = Date.now(); await p.waitForSelector('#dlgo', { timeout: 30000 }).catch(() => E.push(tag + ' 解碼 動畫 沒有〔▶ 開始 解碼〕')); if (Date.now() - t0 + 3000 < 19000) E.push(tag + ' 解碼 動畫 不到 20 秒'); await p.evaluate(() => { window.__DCLMIN = 0; }); }
            else await p.waitForSelector('#dlgo,#dlsk', { timeout: 30000 }).catch(() => E.push(tag + ' 解碼 動畫 沒有〔▶ 開始〕'));
            await p.click('#dlgo,#dlsk').catch(() => {}); await p.waitForTimeout(250); } }
        const hw = await p.$('#q2go'); if (hw) { await hw.click(); await p.waitForTimeout(150); }
        const wp = await p.$('#wp.on [data-wr]'); if (wp) { await wp.click(); await p.waitForTimeout(250); }
        await p.waitForTimeout(st.id === 'q2' ? 300 : 120);
        const wrong = st.k === 0; await answer(p, { id: st.id }, wrong);
        if (wrong) { await p.waitForSelector('#fbn', { timeout: 15000 }).catch(() => E.push(tag + ' ' + N + ' 題：答錯 沒有〔▶ 下一題〕')); await p.click('#fbn').catch(() => {}); }
        await p.waitForFunction(kk => R.k > kk || !document.querySelector('#endv').hidden, st.k, { timeout: 15000 }).catch(() => E.push(tag + ' ' + N + ' 題 第 ' + (st.k + 1) + ' 題（' + st.id + '）沒有 到 下一題'));
        if (!wrong) { const s1 = await p.evaluate(() => R.score); if (Math.abs(s1 - st.sc - 100 / N) > .01) { E.push(tag + ' ' + N + ' 題：答對 一題 要 ＋' + (100 / N) + ' 分，現在 ＋' + (s1 - st.sc)); } }
        await p.waitForTimeout(150);
      }
      n++; if (lvSeen.size !== 11) E.push(tag + ' ' + N + ' 題：沒有 11 關 連著 玩：' + [...lvSeen].join());
      n++; const e = await p.evaluate(() => ({ t: document.querySelector('#end').textContent, rows: document.querySelectorAll('#end .xtb tr').length }));
      const want2 = await p.evaluate(() => Math.min(100, Math.round(R.score * 10) / 10));   /* 第 1 題（解碼）故意 錯：放對 幾成 拿 幾成 */
      if (want2 <= (N - 1) * (100 / N) - .01 || want2 >= 100 || e.t.indexOf(want2 + ' 分 ／ 100') < 0 || e.rows !== 12 || e.t.indexOf('答對 ' + (N - 1) + ' ／ ' + N) < 0) E.push(tag + ' ' + N + ' 題：結束 頁 不對（要 ' + want2 + ' 分、10 關 表）：' + e.t.slice(0, 80));
      n++; const rq = await p.evaluate(N => { const Q = JSON.parse(localStorage.getItem('score_q') || '[]').concat(JSON.parse(localStorage.getItem('score_sent') || '[]')); const r = Q.filter(x => x.set === 'g3gm_g3m-x' + N).pop();
          return r ? { n: r.qs.length, ok: r.qs.filter(q => q[0]).length, bi: r.qs.every(q => q[5] >= 0 && XALL[q[5]]), nm: r.name } : null; }, N);
      if (!rq || rq.n !== N || rq.ok !== N - 1 || !rq.bi || !/三年級 複習｜📝 /.test(rq.nm)) E.push(tag + ' ' + N + ' 題：沒有 記進 成績：' + JSON.stringify(rq));
      if (SHOT) await p.screenshot({ path: path.join(SHOT, 'g3m_x' + N + '_end_' + vp[0] + '.png'), fullPage: true });
      await p.evaluate(() => lobby()); await p.waitForTimeout(200);
    }
    /* 2026-10-29 第 3 件：📝 新 25／新 50（題庫 B，50% 類似）*/
    for (const N of (process.env.ONLY && !/n/.test(process.env.ONLY) ? [] : full ? [25] : [])) {
      await p.evaluate(N => { window.__DCLMIN = 0; LDB.set = LDB.must = LDB.patch = () => Promise.resolve(true); CR = { room: '0304', t: 1, cfg: { on: 1, t: 1, set: 'n' + N, gs: [], m: 'self' }, acc: {}, n: 0, ok: 0, q: -9 }; lobby(); }, N); await p.waitForTimeout(200);
      n++; const lb = await p.evaluate(() => [...document.querySelectorAll('#xrow [data-x],#xrow [data-xr]')].filter(b => (b.closest('.xbw') || b).style.display !== 'none').map(b => (b.dataset.x || b.dataset.xr) + (b.dataset.bk || '')).join());
      if (lb !== N + 'B') E.push(tag + ' 現場任務 開 新 ' + N + '：大廳 要 只 有〔📝 新 ' + N + '〕' + lb);
      await p.click('#xrow .xb[data-x="' + N + '"][data-bk="B"]'); await p.waitForTimeout(400);
      n++; const pl = await p.evaluate(() => ({ c: R.cnt, sim: R.qs.filter(q => q.sim).length, n: R.qs.length, bk: R.bk, inB: R.qs.every(q => XALL2.indexOf(q) >= 0) }));
      if (pl.n !== N || pl.c[0] !== 8 || pl.sim !== Math.round(N * .5) || pl.bk !== 'B' || !pl.inB) E.push(tag + ' 新 ' + N + ' 題：抽題 不對 ' + JSON.stringify(pl));
      let guard = 0;
      while (guard++ < N + 5) {
        const st = await p.evaluate(() => ({ end: !document.querySelector('#endv').hidden, k: R.k, id: G && G.id }));
        if (st.end) break; await passL(p);
        const hw = await p.$('#q2go'); if (hw) { await hw.click(); await p.waitForTimeout(150); }
        const wp = await p.$('#wp.on [data-wr]'); if (wp) { await wp.click(); await p.waitForTimeout(250); }
        const id = await p.evaluate(() => G.id); await p.waitForTimeout(id === 'q2' ? 300 : 120); await answer(p, { id }, false);
        await p.waitForFunction(kk => R.k > kk || !document.querySelector('#endv').hidden, st.k, { timeout: 15000 }).catch(() => E.push(tag + ' 新 ' + N + ' 第 ' + (st.k + 1) + ' 題（' + id + '）沒有 到 下一題')); await p.waitForTimeout(150);
      }
      n++; const t = await p.evaluate(() => document.querySelector('#end').textContent); if (!/新 25 題 挑戰：100 分/.test(t)) E.push(tag + ' 新 ' + N + '：結束 頁 不對 ' + t.slice(0, 80));
      n++; const rq = await p.evaluate(N => { const Q = JSON.parse(localStorage.getItem('score_q') || '[]').concat(JSON.parse(localStorage.getItem('score_sent') || '[]')); const r = Q.filter(x => x.set === 'g3gm_g3m-n' + N).pop(); return r ? { n: r.qs.length, ok: r.qs.filter(q => q[0]).length, bi: r.qs.every(q => q[5] >= 0 && XALL2[q[5]]) } : null; }, N);
      if (!rq || rq.n !== N || rq.ok !== N || !rq.bi) E.push(tag + ' 新 ' + N + '：沒有 記進 成績 g3gm_g3m-n' + N + ' ' + JSON.stringify(rq));
      await p.evaluate(() => { window.__DCLMIN = undefined; lobby(); }); await p.waitForTimeout(200);
    }
    n++; if (errs.length) E.push(tag + ' 程式錯誤：' + errs.slice(0, 3).join(' ｜ '));
    await ctx.close();
  }
  await br.close();
  E.forEach(e => console.log('✗ ' + e));
  console.log((E.length ? '❌' : '✅') + ' 三年級 複習：' + n + ' 項，' + E.length + ' 個失敗');
  process.exit(E.length ? 1 : 0);
})();

/* 🔓 解碼 動畫 開著 ＝ 快轉 過去（離開／繼續 的 測試 用）*/
async function passL(p) { if (await p.evaluate(() => document.getElementById('dcl').classList.contains('on'))) { await p.evaluate(() => { window.__DCLMIN = 0; }); await p.waitForSelector('#dlgo,#dlsk', { timeout: 30000 }).catch(() => {}); await p.click('#dlgo,#dlsk').catch(() => {}); await p.waitForTimeout(250); } }
/* 照真的學生的操作答題：wrong ＝ 故意答錯 */
async function answer(p, g, wrong) {
  const q = await p.evaluate(() => R.q);
  const tap = async sel => { const el = await p.$(sel); if (!el) { E.push(g.id + '：找不到 ' + sel); return; } await el.click({ force: true }); };
  if (g.id === 'dc') { await p.waitForSelector('.dctl', { timeout: 5000 }).catch(() => {}); for (let i = 0; i < q.t.length; i++) { const want = q.t[i][1], tl = await p.$$('.dctl:not(.used)'); let pick = null;
      for (const e of tl) { const t = await e.textContent(); if (wrong && i === 0 ? t !== want : t === want) { pick = e; break; } } if (!pick && wrong) pick = tl[0]; if (!pick) { E.push('解碼：找不到 方塊 ' + want + '｜' + q.en + '｜' + (await p.$$eval('.dctl', x => x.map(e => e.textContent + (e.classList.contains('used') ? '*' : '')).join(' '))) + '｜' + (await p.evaluate(() => R.q.en))); return; }
      const sl = (await p.$$('.dcs'))[i]; if (i === 0) { const b = await pick.boundingBox(), s = await sl.boundingBox(); await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await p.mouse.down(); await p.mouse.move(s.x + s.width / 2, s.y + s.height / 2, { steps: 8 }); await p.mouse.up(); }
      else { await pick.click(); await sl.click(); } await p.waitForTimeout(40); } return; }
  if (g.id === 'q1') return tap('.hole[data-v="' + (wrong ? q.o[1] : q.o[0]) + '"]');
  if (g.id === 'q8') return tap('.mv[data-o="' + (wrong ? q.o[1] : q.o[0]).replace(/"/g, '\\"') + '"]');
  if (g.id === 'q2') return p.evaluate(k => P2.goK(k), wrong ? 1 : 0);   /* ＝ 點 小 地圖／畫面 上 的 房間：小精靈 自己 走過去 */
  if (g.id === 'q3') return tap('.cap[data-k="' + (wrong ? q.o[1] : q.o[0]) + '"]');
  if (g.id === 'q10') { const want = wrong ? q.o[1] : q.o[0];
    const els = await p.$$('.crt'); for (const e of els) if ((await e.evaluate((x, id) => id === 'q8' ? x.textContent : x.dataset.c, g.id)) === want) return e.click({ force: true }); E.push(g.id + '：找不到選項 ' + want); return; }
  if (g.id === 'q7') { const want = wrong ? q.o[1] : q.o[0]; const els = await p.$$('.pk'); for (const e of els) if ((await e.evaluate(x => x.querySelector('.wd').textContent)) === want) {
      /* 真的拖過去 */ const b = await e.boundingBox(), gp = await (await p.$('#gap')).boundingBox();
      await p.mouse.move(b.x + b.width / 2, b.y + 20); await p.mouse.down(); await p.mouse.move(gp.x + gp.width / 2, gp.y + gp.height / 2, { steps: 8 }); await p.mouse.up(); return; } return; }
  if (g.id === 'q6') { const W = q.want; if (wrong) { const b = await p.$$('.qb'); for (const e of b) if ((await e.textContent()) !== W[0]) return e.click({ force: true }); }
    for (let i = 0; i < W.length; i++) { const b = await p.$$('.qb:not(.used)'); for (const e of b) if ((await e.textContent()) === W[i]) { await e.click({ force: true }); break; } await p.waitForTimeout(60); } return; }
  if (g.id === 'q9' && q.k) { const want = wrong ? q.o[1] : q.o[0]; return p.evaluate(w => { const b = [...document.querySelectorAll('.o9')].filter(x => x.textContent === w)[0]; if (b) b.click(); }, want); }   /* 2026-10-30 新題型 */
  if (g.id === 'q9') { const sl = await p.$$eval('.sl9', x => x.map(e => +e.dataset.r)); let bad = false;
    for (let i = 0; i < sl.length; i++) { await p.waitForFunction(() => !BUSY, null, { timeout: 5000 }).catch(() => {}); const r = sl[i], wantv = q.bl[r] === 'n' ? q.c[r].t : String(q.c[r].a);
      const v = wrong && i === 1 ? q.tl.filter(x => x !== wantv && !(q.bl.some((b, j) => (b === 'n' ? q.c[j].t : String(q.c[j].a)) === x)))[0] : wantv;
      const s0 = await p.evaluate(() => window.__say.length);
      const t = await p.$('.tile9:not(.used)[data-v="' + v + '"]'); if (!t) { E.push('q9：找不到 方塊 ' + v); return; }
      /* 真的 拖過去 */ const tb = await t.boundingBox(), sb = await (await p.$('.sl9[data-r="' + r + '"]')).boundingBox();
      await p.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2); await p.mouse.down(); await p.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2, { steps: 8 }); await p.mouse.up();
      if (wrong && i === 1) return; await p.waitForTimeout(150);
      const s1 = await p.evaluate(() => window.__say.length); if (s1 <= s0) E.push('q9：放對 沒有 馬上 唸 那個人 的 那一句'); await p.waitForTimeout(250); } return; }
  if (g.id === 'q4' || g.id === 'q5') {
    /* 挖礦：先 點 對的 圖（老師：單字 跟 圖片 配對）；820 那一種 故意 點 錯的 圖 */
    if (g.id === 'q4') { const vw = await p.evaluate(() => innerWidth); if (wrong && vw === 820) return tap('.ore:not([data-ow="' + q.say + '"])'); await tap('.ore[data-ow="' + q.say + '"]'); await p.waitForTimeout(200); }
    /* 1920 那一種：答錯 ＝ 字 寫 對、但是 整個 往上 浮（沒有 碰到 底線）➜ 頂天立地 要 判 錯 */
    const fl = wrong && (await p.evaluate(() => innerWidth)) === 1920 ? (/[gjpqy]/.test(q.want) ? -.6 : .6) : 0;   /* 2026-10-31 第三十五次 第 4 點：放寬 以後 偏 0.3 格 以內 算 對 ➜ 量「偏 0.6 格」要 判 錯（有 長 下來 的 往上、其他 往下，不 超出 寫字板）*/   /* 0.3 ＝ 大寫 的 第一筆 會 落在 寫字板 外面（寫不上去）*/
    /* 2026-10-26：浮 起來 0.2 格 也 超出 整個 格子（＜ −0.15） ➜ 第一次 會「再 寫 一次」；這裡 量 的 是 第二次（R.retry ＝ 1）要 判 錯 */
    if (fl) await p.evaluate(() => { R.retry = 1; });
    const ch = wrong && !fl ? (q.want === q.want.toUpperCase() ? q.want.toLowerCase() : q.want.toUpperCase()) : q.want;
    const c = await (await p.$('.pad canvas')).boundingBox(), u = c.height / 3.5, xs = [].concat(...HW.T[ch][0].map(s => s.map(pt => pt[0]))), x0 = Math.min(...xs);
    for (const s of HW.T[ch][0]) { await p.mouse.move(c.x + u * (.5 + s[0][0] - x0), c.y + u * (s[0][1] + .25 + fl)); await p.mouse.down();
      for (const pt of s.slice(1)) await p.mouse.move(c.x + u * (.5 + pt[0] - x0), c.y + u * (pt[1] + .25 + fl)); await p.mouse.up(); }
    /* 大小寫一樣形狀（c、o、s、v、w、x、z）故意寫錯 ＝ 寫在錯的格子：上面那一招已經是另一個大小寫的位置 */
    await tap('.wbtn .go'); return;
  }
}

/* 2026-10-25 第二十五次：每一種 遊戲 新 的 東西 真的 有 */
async function special(p, g) { const e = [];
  if (g.id === 'q2') { /* 2026-10-26 第二十八次：照 Wordwall 迷宮 追逐 ➜ 3 個 房間、鏡頭 放大 跟著 走、按 一下 一直 走、被 抓 不 扣 時間 */
    await p.waitForFunction(() => P2 && P2.ph === 'go' && P2.z >= 1, null, { timeout: 8000 }).catch(() => {});
    const r = await p.evaluate(async () => { const S = P2, a = [S.p.cx, S.p.cy, S.ph, S.cs, S.cs0];
      document.querySelector('.dpad [data-d="l"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      await new Promise(r => setTimeout(r, 900)); const b = [S.p.cx + (S.p.tx - S.p.cx) * S.p.f, S.p.cy, S.p.d];
      const t0 = tLeft(); S.caught(); await new Promise(r => setTimeout(r, 300)); const c = { x: S.p.cx, y: S.p.cy, dt: t0 - tLeft(), toast: document.querySelector('.pmt').textContent, gw: S.gw };
      const pc = document.querySelector('.pac2').getBoundingClientRect(), v = document.querySelector('.pmv').getBoundingClientRect(), sd = document.querySelector('.pmside').getBoundingClientRect();
      const rm = [...document.querySelectorAll('.rmc')].map(x => x.dataset.rm).sort().join('');
      return { a, b, c, d: document.querySelectorAll('.dpad button').length, gh: document.querySelectorAll('.gst').length, rm, mm: !!document.querySelector('.mmap'), pac: Math.round(pc.width),
        ovl: v.right > sd.left + 1 && v.bottom > sd.top + 1 && sd.bottom > v.top + 1 && sd.right > v.left + 1, vh: Math.round(v.height), cs: Math.round(S.cs) }; });
    if (r.d !== 4 || r.gh !== 2 || r.rm !== 'ABC' || !r.mm) e.push('迷宮 沒有 方向鍵 4 顆／👻 2 隻／3 個 房間／小 地圖：' + JSON.stringify(r));
    if (r.a[2] !== 'go' || !(r.cs >= 1.6 * r.a[4]) || r.pac < 50) e.push('GO 以後 鏡頭 沒有 放大（一格 ' + r.cs + 'px、整張 ' + Math.round(r.a[4]) + 'px、小精靈 ' + r.pac + 'px）');
    if (!(r.b[0] < r.a[0] - 1.5)) e.push('按 ⬅ 一下 小精靈 沒有 一直 往 左 走：' + JSON.stringify(r.a) + '→' + JSON.stringify(r.b));
    if (r.c.x !== 7 || r.c.y !== 5 || r.c.dt > .05 || !/被抓到/.test(r.c.toast) || !/不算 錯/.test(r.c.toast) || !(r.c.gw > 1.5)) e.push('被 👻 抓到 要 回 起點、不 扣 時間、鬼 等 2 秒：' + JSON.stringify(r.c));
    if (r.ovl || r.vh < 300) e.push('迷宮 蓋到 右邊 按鈕／太 矮：' + JSON.stringify(r));
    /* 房間 裡 的 卡片：放大 以後 名字、蛋糕 不 被 切掉 */
    const o = await p.evaluate(() => { const o = []; document.querySelectorAll('.rmc').forEach(c => { const cr = c.getBoundingClientRect(); c.querySelectorAll('.tn,.cake,.q2sc').forEach(x => { const b = x.getBoundingClientRect(); if (b.width && (b.right > cr.right + 1 || b.left < cr.left - 1 || b.bottom > cr.bottom + 1 || b.top < cr.top - 1)) o.push('切掉 ' + x.className); }); }); return [...new Set(o)]; });
    if (o.length) e.push('房間 卡片：' + o.join('、'));
    /* 新 的 一題：先 看 整張（時間 停）*/
    const t = await p.evaluate(async () => { const S = P2; S.ph = 'ov'; const t0 = tLeft(); tPause(); await new Promise(r => setTimeout(r, 400)); const x = { t: t0 - tLeft(), cs: Math.round(S.cs), cs0: Math.round(S.cs0) }; S.ph = 'go'; tGo(); return x; });
    if (t.t > .05 || t.cs !== t.cs0) e.push('看 整張 迷宮 的 時候 時間 要 停、要 看到 整張：' + JSON.stringify(t)); }
  if (g.id === 'q3') { const r = await p.evaluate(() => ({ c: document.querySelectorAll('.ctl3 button').length, ey: !!document.querySelector('.hd3 .ey') })); if (r.c !== 3 || !r.ey) e.push('夾娃娃 沒有 ◀ ⬇ ▶ 或 夾子 眼睛');
    await p.click('.ctl3 [data-c="r"]'); await p.waitForTimeout(150); if (!(await p.$('.cap.aim'))) e.push('按 ▶ 夾子 沒有 移到 照片 上面'); }
  if (g.id === 'q4') { const r = await p.evaluate(() => ({ o: document.querySelectorAll('.ore').length, lk: document.querySelector('.pad').classList.contains('lk') })); if (r.o !== 3 || !r.lk) e.push('挖礦 沒有 3 塊 圖 礦石、還沒 點 圖 寫字板 要 鎖住：' + JSON.stringify(r)); }
  if (g.id === 'q6') { const t = await p.evaluate(() => document.querySelector('.q6h').textContent + '|' + document.querySelector('.q6ex').textContent); if (!/How many/.test(t) || !/例：/.test(t)) e.push('金幣磚 沒有 英文 問句「How many …?」＋例子：' + t.slice(0, 50));   /* 2026-10-26 第二十九次：題目 全 英文 */
    const c = await p.evaluate(() => { const s = [].slice.call(document.querySelectorAll('.objs span'), 0, 2); s.forEach(x => x.click()); return s.map(x => x.dataset.c).join(); }); if (c !== '1,2' && c !== '1')   /* 題目 是 one ＝ 只有 1 個 */ e.push('點 東西 沒有 數 1、2：' + c); }
  if (g.id === 'q8') { const r = await p.evaluate(() => ({ t: document.getElementById('stage').textContent + document.getElementById('gnm').textContent + document.title, im: (document.querySelector('.fig.me img') || {}).src || '', foe: ((document.querySelector('.fcard.foe img') || {}).src || '').split('/').pop(), ok: (document.querySelector('.fcard.foe img') || {}).naturalWidth > 0, sw: !document.getElementById('wsw').hidden }));
    if (/寶可夢/.test(r.t)) e.push('還有「寶可夢」'); if (!/rpg\/chars\/[bg]\d+\.jpg/.test(r.im) || r.foe !== 'foe1.webp' || !r.ok || !r.sw || !/DARK OVERLORD/.test(r.t)) e.push('擂台 沒有 自己 的 戰士／老師 給 的 反派 DARK OVERLORD／〔🔄 換 戰士〕：' + JSON.stringify(r).slice(0, 160));
    /* 第 1 回合 打倒（4 題）➜ 第 2 回合 SHADOW SCHEMER */ const r2 = await p.evaluate(() => { var k0 = R.k; R.k = 4; HP8.e = 0; var st = document.getElementById('stage'), q = R.q; st.innerHTML = ''; REN.q8(q, st); return { f: (document.querySelector('.fcard.foe img') || {}).src || '', t: document.querySelector('.rnd8').textContent, nw: !!document.querySelector('.nw8'), k0 }; }); await p.evaluate(k => { R.k = k; }, r2.k0);
    if (!/foe2\.webp/.test(r2.f) || !/ROUND 2/.test(r2.t) || !r2.nw) e.push('打倒 DARK OVERLORD 以後 沒有 換 SHADOW SCHEMER：' + JSON.stringify(r2));
    await p.evaluate(() => { HP8 = { b: 0, e: 4, m: 8, ko: 0 }; var st = document.getElementById('stage'); st.innerHTML = ''; REN.q8(R.q, st); }); }
  if (g.id === 'q9' && await p.evaluate(() => !!R.q.k)) { const r = await p.evaluate(() => ({ b: document.querySelectorAll('.bub9').length, o: document.querySelectorAll('.o9').length, sl: document.querySelectorAll('.sl9').length, th: [].map.call(document.querySelectorAll('.fm9 th'), x => x.textContent).join(','), k: R.q.k }));
    if (r.b !== 3 || r.o !== 4 || r.sl !== 1 || r.th !== 'Name,Age') e.push('資料表 新題型（' + r.k + '）：3 個 對話框、一列 資料表、4 個 選項：' + JSON.stringify(r)); }
  else if (g.id === 'q9') { const r = await p.evaluate(() => ({ b: document.querySelectorAll('.bub9').length, sp: document.querySelectorAll('.sp9').length, sl: document.querySelectorAll('.sl9').length, tl: document.querySelectorAll('.tile9').length, t: document.querySelector('.ft9').textContent, th: [].map.call(document.querySelectorAll('.fm9 th'), x => x.textContent).join(',') }));
    if (r.b !== 3 || r.sp !== 3 || r.sl !== 3 || r.tl !== 5 || !/New Friends/.test(r.t) || !/Name,Age/.test(r.th)) e.push('資料表 小幫手：3 個 對話框＋🔊、3 個 空格、5 個 方塊、Name／Age：' + JSON.stringify(r));
    /* 第二十九次 第 8 點：30 秒；方塊 在 資料表 正上方；先 點 空格 再 點 方塊 也 可以 */
    const r2 = await p.evaluate(() => { const tw = document.querySelector('.tw9').getBoundingClientRect(), fm = document.querySelector('.fm9').getBoundingClientRect(), bb = document.querySelector('.bb9').getBoundingClientRect();
      const sl = document.querySelector('.sl9'); sl.click(); const s1 = sl.classList.contains('sel'); return { t: TM.T, above: tw.bottom <= fm.top + 2 && tw.top >= bb.bottom - 2, s1, bot: fm.bottom <= innerHeight + 1 }; });
    if (r2.t !== 30 || !r2.above || !r2.s1 || !r2.bot) e.push('資料表：30 秒／方塊 在 資料表 上面／先 點 空格 會 亮／資料表 不 超出 畫面 ' + JSON.stringify(r2));
    await p.evaluate(() => { const sl = document.querySelector('.sl9.sel'); if (sl) sl.click(); }); }
  if (g.id === 'q1') { const r = await p.evaluate(() => ({ pic: !!document.querySelector('.q1pic'), sl: !!document.querySelector('.hear.slow'), m1: window.__say.filter(x => /^m1\//.test(x)).length }));
    if (r.pic || !r.sl || r.m1 < 2) e.push('打地鼠：不可以 有 圖（第二十九次 第 6 點：只 用 聽 的）、要〔🐢 慢慢 唸〕、自動 用 慢 的 男聲 唸 2 次：' + JSON.stringify(r)); }
  if (g.id === 'q3') { const t = await p.evaluate(() => document.querySelector('.claw').textContent + '|' + document.querySelector('.ctl3').textContent); ['CLAW MACHINE', 'PRIZE', 'PUSH', 'INSERT COIN', 'LEFT', 'DROP', 'RIGHT'].forEach(w => { if (t.indexOf(w) < 0) e.push('夾娃娃 沒有 英文「' + w + '」'); }); if (/[\u4e00-\u9fff]/.test(t)) e.push('夾娃娃 機台／按鈕 還有 中文：' + t.slice(0, 60)); }
  if (g.id === 'q5') { /* 第 1-4 點：超出 格子 很多 ➜「再 寫 一次」（不算 錯、倒數 停住）*/ const q = await p.evaluate(() => R.q), c = await (await p.$('.pad canvas')).boundingBox(), u = c.height / 3.5, xs = [].concat(...HW.T[q.want][0].map(s => s.map(pt => pt[0]))), x0 = Math.min(...xs);
    for (const s of HW.T[q.want][0]) { const yy = v => Math.min(c.y + c.height - 2, Math.max(c.y + 2, c.y + u * (v * 1.9 - .1)));   /* 2026-10-31：碰到 寫字板 的 邊 ＝ 超出 很多 */ await p.mouse.move(c.x + u * (.5 + s[0][0] - x0), yy(s[0][1])); await p.mouse.down(); for (const pt of s.slice(1)) await p.mouse.move(c.x + u * (.5 + pt[0] - x0), yy(pt[1])); await p.mouse.up(); }
    await p.click('.wbtn .go'); await p.waitForTimeout(200); const r = await p.evaluate(() => ({ t: !!document.querySelector('.rtry'), res: R.res[R.k], fb: document.getElementById('fb').classList.contains('on') }));
    if (!r.t || r.res !== undefined || r.fb) e.push('寫字 超出 很多 沒有「再 寫 一次」：' + JSON.stringify(r)); await p.waitForTimeout(2000); }
  return e; }
