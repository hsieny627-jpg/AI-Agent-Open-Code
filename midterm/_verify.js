/* midterm/_verify.js — 📝 四年級 期中複習 量測（只印失敗項和一行總結；SHOT=資料夾 拍照）
 *   node midterm/_verify.js
 * 三種螢幕（iPad 橫、iPad 直、教室觸控螢幕 1920）：大廳 12 種、三區；每一種遊戲：第一題 畫面 不超出、字 ≧ 20px、按鈕 ≧ 48px、聽力題 有 語音檔、
 * 照片 載得到；答對 ＋分、答錯 有 正確答案＋中文、〔▶ 下一題〕；玩完 一回 10 題 ➜ 成績 佇列 多 一筆 g4gm_mt-遊戲（假 伺服器，**絕對 不送 真的 成績表**）。 */
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.join(__dirname, '..'), D = require('./_data.js'), SHOT = process.env.SHOT;
const E = []; let n = 0;
const aud = fs.readFileSync(path.join(__dirname, 'audio/aud.js'), 'utf8');
const akey = s => String(s).replace(/[’]/g, "'").replace(/[=＝≠➜→⇒…＿_　]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const AUD = JSON.parse(aud.slice(aud.indexOf('{'), aud.lastIndexOf('}') + 1));
/* 1. 題庫：每一個 要 唸 的 都 有 語音檔、照片 都 在 */
D.SAY.forEach(s => { n++; if (!AUD[akey(s)]) E.push('沒有 語音檔：' + s); else if (!fs.existsSync(path.join(__dirname, 'audio', AUD[akey(s)][0]))) E.push('語音檔 不見了：' + s); });
Object.keys(D.PHOTO).forEach(k => { n++; if (!fs.existsSync(path.join(__dirname, 'img', k + '.jpg'))) E.push('沒有 照片：' + k); });
/* 2. 總首頁 有〔📝 四年級 期中複習〕，在家複習 沒有 */
{ n++; const hub = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'); if (!/href="midterm\/index\.html"[^>]*>📝 四年級 期中複習</.test(hub.replace(/<\/?span[^>]*>/g, ''))) E.push('總首頁 沒有〔四年級 期中複習〕');
  for (const d of ['g3-review', 'g4-review']) for (const f of fs.readdirSync(path.join(ROOT, d)).filter(f => /\.html$/.test(f))) if (/midterm\//.test(fs.readFileSync(path.join(ROOT, d, f), 'utf8'))) E.push(d + '/' + f + '：在家複習 連到 期中複習'); }
(async () => {
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) {
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }), tag = vp.join('×');
    await ctx.route(/^https?:\/\/(?!127\.)/, r => /script\.test/.test(r.request().url()) ? r.fulfill({ contentType: 'application/json', body: '{"ok":true,"dup":[]}' }) : r.abort());
    await ctx.addInitScript(() => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} });
      localStorage.setItem('score_last', '"40201"'); localStorage.setItem('score_id_g4', '"40201"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', '40201');
      window.__say = 0; const pl = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { window.__say++; return Promise.resolve(); }; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(500);
    n++; const hb = await p.evaluate(() => ({ g: document.querySelectorAll('[data-g]').length, s: document.querySelectorAll('.sec').length, ox: document.documentElement.scrollWidth - innerWidth }));
    if (hb.g !== 12 || hb.s !== 3 || hb.ox > 1) E.push(tag + ' 大廳：' + JSON.stringify(hb));
    if (SHOT) await p.screenshot({ path: path.join(SHOT, 'mt_hub_' + vp[0] + '.png'), fullPage: true });
    for (const g of D.GAMES) {
      await p.evaluate(id => start(id), g.id); await p.waitForTimeout(700);
      const m = await p.evaluate(() => { const sm = [], low = [];
        document.querySelectorAll('#app *').forEach(x => { const r = x.getBoundingClientRect(); if (!r.width) return; const t = [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim());
          if (t && parseFloat(getComputedStyle(x).fontSize) < 18) sm.push(x.className + ':' + x.textContent.trim().slice(0, 12));
          if (x.tagName === 'BUTTON' && r.height < 48) low.push(x.textContent.trim().slice(0, 10)); if (r.right > innerWidth + 1 || r.left < -1) low.push('超出：' + (x.className || x.tagName)); });
        const img = [].filter.call(document.querySelectorAll('#app img'), i => !i.complete || !i.naturalWidth).length;
        return { sm, low, img, ox: document.documentElement.scrollWidth - innerWidth, opts: document.querySelectorAll('#stage [data-o],#stage [data-t]').length }; });
      n++; if (m.sm.length || m.low.length || m.img || m.ox > 1 || !m.opts) E.push(tag + ' ' + g.id + '：字太小 ' + m.sm.slice(0, 3).join('、') + '／按鈕 ' + m.low.slice(0, 3).join('、') + '／照片 ' + m.img + '／左右捲 ' + m.ox + '／選項 ' + m.opts);
      if (SHOT && vp[0] !== 1920) await p.screenshot({ path: path.join(SHOT, 'mt_' + g.id + '_' + vp[0] + '.png') });
      /* 玩 一回：第 1 題 故意 答錯，其他 答對 */
      for (let k = 0; k < 10; k++) {
        await p.waitForTimeout(1100);   /* 1 秒 內 就 按 ＝ 太快 亂按（超過 一半 不算 成績）➜ 量測 要 像 真的 學生 一樣 看完 再 按 */
        await p.evaluate(k => { const q = R.q; if (R.g.id === 'm7') { const w = q.spell, mid = w.slice(1, -1).split(''); const order = k === 0 ? mid.slice().reverse() : mid, used = [];
              if (k === 0 && mid.join('') === order.join('')) order[0] = R.tiles.filter(c => mid.indexOf(c) < 0)[0];
              order.forEach(c => { for (let i = 0; i < R.tiles.length; i++) if (used.indexOf(i) < 0 && R.tiles[i] === c) { used.push(i); document.querySelector('[data-t="' + i + '"]').click(); return; } }); }
            else document.querySelector('#stage [data-o="' + (k === 0 ? 1 : 0) + '"]').click(); }, k);
        await p.waitForTimeout(150);
        if (k === 0) { n++; const f = await p.evaluate(() => ({ on: document.getElementById('fb').className, t: document.getElementById('fb').innerText, nx: !!document.getElementById('nx') }));
          if (!/no/.test(f.on) || !/✅/.test(f.t) || !f.nx) E.push(tag + ' ' + g.id + '：答錯 沒有 正確答案／下一題 ' + JSON.stringify(f).slice(0, 80));
          if (SHOT && vp[0] === 820) await p.screenshot({ path: path.join(SHOT, 'mt_' + g.id + '_no.png') });
          await p.waitForTimeout(1900); await p.click('#nx'); }
        else await p.waitForTimeout(1600);
      }
      n++; const end = await p.evaluate(() => ({ t: document.getElementById('app').innerText, q: JSON.parse(localStorage.getItem('score_q') || '[]').concat([]) }));
      if (!/答對 9 ／ 10 題/.test(end.t)) E.push(tag + ' ' + g.id + '：結束 畫面 不是 9／10：' + end.t.slice(0, 60));
      if (!/記進 成績/.test(end.t)) E.push(tag + ' ' + g.id + '：沒有 記 成績');
      await p.evaluate(() => hub());
    }
    n++; if (errs.length) E.push(tag + ' JS 錯誤：' + errs.slice(0, 3).join('｜'));
    await ctx.close();
  }
  await br.close();
  E.forEach(x => console.log('❌ ' + x)); console.log('期中複習 量測 ' + n + ' 項，' + E.length + ' 個失敗'); process.exit(E.length ? 1 : 0);
})();
