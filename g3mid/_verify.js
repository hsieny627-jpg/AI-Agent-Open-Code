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
const E = []; let n = 0;
const akey = s => String(s).replace(/[’]/g, "'").replace(/[=＝≠➜→⇒…＿_　]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const rd = f => { const t = fs.readFileSync(path.join(__dirname, f), 'utf8'); return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)); };
const A = rd('audio/aud.js'), W = rd('audio/w/aud.js');
/* 1. 每一句要唸的都有語音檔 */
D.SAY.forEach(s0 => { n++; const s = typeof s0 === 'string' ? s0 : s0.k, k = akey(s.replace(/^m:/, '')), mk = /^m:/.test(s) ? 'm:' + k : k;
  const f = A[mk] ? 'audio/' + A[mk][0] : W[k] ? 'audio/w/' + W[k][0] : '';
  if (!f) E.push('沒有語音檔：' + s); else if (!fs.existsSync(path.join(__dirname, f))) E.push('語音檔不見了：' + s); });
D.CE.forEach(c => { n++; if (!fs.existsSync(path.join(__dirname, 'img', c.k + '.jpg'))) E.push('沒有照片：' + c.k); });
/* 2. 總首頁有〔📝 三年級 複習〕；在家複習沒有；不接成績系統 */
{ n++; const hub = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/<\/?span[^>]*>/g, '');
  if (!/href="g3mid\/index\.html"[^>]*>📝 三年級 複習</.test(hub)) E.push('總首頁沒有〔📝 三年級 複習〕');
  for (const d of ['g3-review', 'g4-review']) for (const f of fs.readdirSync(path.join(ROOT, d)).filter(f => /\.html$/.test(f))) { n++; if (/g3mid\//.test(fs.readFileSync(path.join(ROOT, d, f), 'utf8'))) E.push(d + '/' + f + '：在家複習連到三年級複習'); }
  n++; const h = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  if (/score\/url\.js|<section id="gend">|id="tqGo"|id="rvBtn"|SCORE_URL/.test(h)) E.push('三年級複習接到成績系統了（老師：以後才接）'); }

(async () => {
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) {
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: false }), tag = vp.join('×'), full = vp[0] === 1024;
    await ctx.route(/^https?:\/\//, r => r.abort());
    /* 聲音：不真的放，0.06 秒就算唸完（數唸了幾次） */
    await ctx.addInitScript(() => { window.__say = []; HTMLMediaElement.prototype.play = function () { const a = this; window.__say.push(a.src.split('/').slice(-2).join('/')); setTimeout(() => a.onended && a.onended(), 60); return Promise.resolve(); };
      try { speechSynthesis.speak = u => { window.__say.push('tts:' + u.text); setTimeout(() => u.onend && u.onend(), 60); }; } catch (e) {} });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(400);
    n++; const lb = await p.evaluate(() => ({ g: document.querySelectorAll('.gc').length, ox: document.documentElement.scrollWidth - innerWidth,
      sm: [].filter.call(document.querySelectorAll('#lobby *'), x => [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(x).fontSize) < 18).length,
      lo: [].filter.call(document.querySelectorAll('#lobby .gc,#lobby .home'), x => x.getBoundingClientRect().height < 48).length }));
    if (lb.g !== 10 || lb.ox > 1 || lb.sm || lb.lo) E.push(tag + ' 大廳：' + JSON.stringify(lb));
    if (SHOT) await p.screenshot({ path: path.join(SHOT, 'g3m_lobby_' + vp[0] + '.png'), fullPage: true });
    for (let gi = 0; gi < D.GAMES.length; gi++) {
      const g = D.GAMES[gi];
      await p.evaluate(i => { window.__say = []; start(i); }, gi); await p.waitForTimeout(900);
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
      const qn = full ? 8 : 2;
      for (let k = 0; k < qn; k++) {
        const wrong = k === 0, sc0 = await p.evaluate(() => R.score);
        await answer(p, g, wrong);
        if (wrong) {
          await p.waitForSelector('#fb.on', { timeout: 4000 }).catch(() => {});
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
          n++; if (f.nx) E.push(tag + ' ' + g.id + '：還沒唸完 3 次就有〔▶ 下一題〕');
          n++; if (Math.abs(f.t - t1) > .05) E.push(tag + ' ' + g.id + '：解說的時候倒數還在走');
          n++; if (f.big < 30) E.push(tag + ' ' + g.id + '：解說英文太小 ' + f.big);
          n++; if (f.ov > 2 && vp[0] !== 820) E.push(tag + ' ' + g.id + '：解說要捲動 ' + f.ov + 'px');
          const s0 = await p.evaluate(() => window.__say.length);
          await p.waitForSelector('#fbn', { timeout: 12000 }).catch(() => {});
          const s1 = await p.evaluate(() => ({ n: window.__say.length, nx: !!document.querySelector('#fbn'), tts: window.__say.filter(x => /^tts:/.test(x)) }));
          n++; if (!s1.nx) E.push(tag + ' ' + g.id + '：唸完 3 次還是沒有〔▶ 下一題〕');
          n++; if (s1.tts.length) E.push(tag + ' ' + g.id + '：沒有語音檔，用了瀏覽器語音 ' + s1.tts.slice(0, 2).join('、'));
          if (SHOT && vp[0] !== 1920) await p.screenshot({ path: path.join(SHOT, 'g3m_' + g.id + '_fb_' + vp[0] + '.png') });
          await p.click('#fbn'); await p.waitForTimeout(500);
          n++; const kk = await p.evaluate(() => R.k); if (kk !== 1) E.push(tag + ' ' + g.id + '：按〔▶ 下一題〕沒有到第 2 題');
        } else {
          await p.waitForFunction(kk => R.k > kk || !document.querySelector('#endv').hidden, k, { timeout: 7000 }).catch(() => E.push(tag + ' ' + g.id + ' 第 ' + (k + 1) + ' 題答對沒有到下一題'));
          const sc1 = await p.evaluate(() => R.score); n++; if (!(sc1 > sc0)) E.push(tag + ' ' + g.id + ' 第 ' + (k + 1) + ' 題答對分數沒有變多（' + sc0 + '）');
          await p.waitForTimeout(250);
        }
      }
      if (full) { n++; const e = await p.evaluate(() => ({ v: !document.querySelector('#endv').hidden, t: document.querySelector('#end').textContent }));
        if (!e.v || e.t.indexOf('答對 7 ／ 8') < 0) E.push(tag + ' ' + g.id + '：玩完沒有「答對 7 ／ 8」：' + e.t.slice(0, 40));
        if (SHOT) await p.screenshot({ path: path.join(SHOT, 'g3m_' + g.id + '_end.png') }); }
      await p.evaluate(() => lobby()); await p.waitForTimeout(200);
    }
    n++; if (errs.length) E.push(tag + ' 程式錯誤：' + errs.slice(0, 3).join(' ｜ '));
    await ctx.close();
  }
  await br.close();
  E.forEach(e => console.log('✗ ' + e));
  console.log((E.length ? '❌' : '✅') + ' 三年級 複習：' + n + ' 項，' + E.length + ' 個失敗');
  process.exit(E.length ? 1 : 0);
})();

/* 照真的學生的操作答題：wrong ＝ 故意答錯 */
async function answer(p, g, wrong) {
  const q = await p.evaluate(() => R.q);
  const tap = async sel => { const el = await p.$(sel); if (!el) { E.push(g.id + '：找不到 ' + sel); return; } await el.click({ force: true }); };
  if (g.id === 'q1') return tap('.hole[data-v="' + (wrong ? q.o[1] : q.o[0]) + '"]');
  if (g.id === 'q2') return tap('.pc[data-k="' + (wrong ? 1 : 0) + '"]');
  if (g.id === 'q3') return tap('.cap[data-k="' + (wrong ? q.o[1] : q.o[0]) + '"]');
  if (g.id === 'q8' || g.id === 'q10') { const want = wrong ? q.o[1] : q.o[0];
    const els = await p.$$(g.id === 'q8' ? '.mv' : '.crt'); for (const e of els) if ((await e.evaluate((x, id) => id === 'q8' ? x.textContent : x.dataset.c, g.id)) === want) return e.click({ force: true }); E.push(g.id + '：找不到選項 ' + want); return; }
  if (g.id === 'q7') { const want = wrong ? q.o[1] : q.o[0]; const els = await p.$$('.pk'); for (const e of els) if ((await e.evaluate(x => x.querySelector('.wd').textContent)) === want) {
      /* 真的拖過去 */ const b = await e.boundingBox(), gp = await (await p.$('#gap')).boundingBox();
      await p.mouse.move(b.x + b.width / 2, b.y + 20); await p.mouse.down(); await p.mouse.move(gp.x + gp.width / 2, gp.y + gp.height / 2, { steps: 8 }); await p.mouse.up(); return; } return; }
  if (g.id === 'q6') { const W = q.want; if (wrong) { const b = await p.$$('.qb'); for (const e of b) if ((await e.textContent()) !== W[0]) return e.click({ force: true }); }
    for (let i = 0; i < W.length; i++) { const b = await p.$$('.qb:not(.used)'); for (const e of b) if ((await e.textContent()) === W[i]) { await e.click({ force: true }); break; } await p.waitForTimeout(60); } return; }
  if (g.id === 'q9') { const order = wrong ? [1, 0, 2] : [0, 1, 2];
    for (let i = 0; i < 3; i++) { await tap('.id[data-i="' + i + '"]'); await tap('.nb[data-n="' + order[i] + '"]'); await p.waitForTimeout(80); } return; }
  if (g.id === 'q4' || g.id === 'q5') {
    const ch = wrong ? (q.want === q.want.toUpperCase() ? q.want.toLowerCase() : q.want.toUpperCase()) : q.want;
    const c = await (await p.$('.pad canvas')).boundingBox(), u = c.height / 3.5, xs = [].concat(...HW.T[ch][0].map(s => s.map(pt => pt[0]))), x0 = Math.min(...xs);
    for (const s of HW.T[ch][0]) { await p.mouse.move(c.x + u * (.5 + s[0][0] - x0), c.y + u * (s[0][1] + .25)); await p.mouse.down();
      for (const pt of s.slice(1)) await p.mouse.move(c.x + u * (.5 + pt[0] - x0), c.y + u * (pt[1] + .25)); await p.mouse.up(); }
    /* 大小寫一樣形狀（c、o、s、v、w、x、z）故意寫錯 ＝ 寫在錯的格子：上面那一招已經是另一個大小寫的位置 */
    await tap('.wbtn .go'); return;
  }
}
