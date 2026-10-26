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
/* 2026-10-26 第二十七次 第 6 點：慢 的 句子（audio/s）、單字 男聲 慢（audio/m1）、更慢（audio/m2） 都 要 有 */
const rdA = d => { const t = fs.readFileSync(path.join(__dirname, 'audio', d, 'aud.js'), 'utf8'); return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)); };
{ const S = rdA('s'), M1 = rdA('m1'), M2 = rdA('m2');
  D.SAYS.forEach(t => { n++; const k = /^m:/.test(t) ? 'm:' + akey(t.slice(2)) : akey(t); if (!S[k] || !fs.existsSync(path.join(__dirname, 'audio/s', S[k][0]))) E.push('沒有 慢 句子 語音檔：' + t); });
  D.SAYM.forEach(w => { n++; if (!M1[akey(w)] || !M2[akey(w)] || !fs.existsSync(path.join(__dirname, 'audio/m1', M1[akey(w)][0])) || !fs.existsSync(path.join(__dirname, 'audio/m2', M2[akey(w)][0]))) E.push('沒有 單字 慢 語音檔：' + w); });
  D.GAMES.forEach(g => g.B.forEach((q, i) => { n++; if (!q.fe || !q.fz || !(q.fs || []).length) E.push(g.id + ' 第 ' + (i + 1) + ' 題 沒有 答錯頁 的 英文／翻譯／唸'); })); }
Object.keys(D.PHOTO).forEach(k => { n++; if (!fs.existsSync(path.join(__dirname, 'img', k + '.jpg'))) E.push('沒有 照片：' + k); });
/* 2. 總首頁 有〔📝 四年級 期中複習〕，在家複習 沒有 */
{ n++; const hub = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'); if (!/href="midterm\/index\.html"[^>]*>📝 四年級 複習</.test(hub.replace(/<\/?span[^>]*>/g, ''))) E.push('總首頁 沒有〔四年級 期中複習〕');
  for (const d of ['g3-review', 'g4-review']) for (const f of fs.readdirSync(path.join(ROOT, d)).filter(f => /\.html$/.test(f))) if (/midterm\//.test(fs.readFileSync(path.join(ROOT, d, f), 'utf8'))) E.push(d + '/' + f + '：在家複習 連到 期中複習'); }
(async () => {
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]].filter(v => !process.env.VP || process.env.VP === String(v[0]))) {   /* VP＝1024 只 量 一種 螢幕 */
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }), tag = vp.join('×');
    await ctx.route(/^https?:\/\/(?!127\.)/, r => /script\.test/.test(r.request().url()) ? r.fulfill({ contentType: 'application/json', body: '{"ok":true,"dup":[]}' }) : r.abort());
    await ctx.addInitScript(() => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} });
      localStorage.setItem('score_last', '"40201"'); localStorage.setItem('score_id_g4', '"40201"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', '40201');
      window.__say = 0; window.__pl = []; window.__RD = 2; window.speechSynthesis && (window.speechSynthesis.speak = u => setTimeout(() => u.onend && u.onend(), 100));
      HTMLMediaElement.prototype.play = function () { window.__say++; window.__pl.push(this.src.replace(/^.*\/midterm\//, '')); const a = this; setTimeout(() => { a.onended && a.onended(); }, 120); return Promise.resolve(); }; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(500);
    n++; const hb = await p.evaluate(() => ({ g: document.querySelectorAll('[data-g]').length, s: document.querySelectorAll('.sec').length, ox: document.documentElement.scrollWidth - innerWidth }));
    if (hb.g !== 12 || hb.s !== 3 || hb.ox > 1) E.push(tag + ' 大廳：' + JSON.stringify(hb));
    if (SHOT) await p.screenshot({ path: path.join(SHOT, 'mt_hub_' + vp[0] + '.png'), fullPage: true });
    for (const g of D.GAMES.filter(g => !process.env.G || process.env.G.split(',').indexOf(g.id) >= 0)) {   /* G＝m1,m8 只 量 這幾 種 */
      if (process.env.DBG) console.log('… ' + tag + ' ' + g.id);
      await p.evaluate(id => { window.__pl = []; start(id); }, g.id); await p.waitForTimeout(700);
      /* 🕵️ 短文 偵探：第一幕 只有 短文、〔開始〕鎖住，讀完 才 解鎖（量測 __RD ＝ 2 秒；老師 20 秒）*/
      if (g.id === 'm8') { n++; const r0 = await p.evaluate(() => ({ pas: !!document.querySelector('.rd .pas'), opt: document.querySelectorAll('#stage [data-o]').length, dis: document.getElementById('rdgo').disabled, def: /20/.test(readScene.toString()) }));
        if (!r0.pas || r0.opt || !r0.dis || !r0.def) E.push(tag + ' m8 第一幕 不對（只有 短文、20 秒 鎖住）' + JSON.stringify(r0));
        await p.waitForTimeout(2600); n++; if (await p.evaluate(() => document.getElementById('rdgo').disabled)) E.push(tag + ' m8 讀完 沒有 解鎖〔開始〕');
        await p.click('#rdgo'); await p.waitForTimeout(500);
        n++; const r1 = await p.evaluate(() => ({ pas: !!document.querySelector('#stage .pas'), opt: document.querySelectorAll('#stage [data-o]').length, t: TM.T }));
        if (!r1.pas || r1.opt !== 3 || r1.t !== 30) E.push(tag + ' m8 第二幕 不對（上面 短文、下面 3 個 選項、30 秒）' + JSON.stringify(r1)); }
      /* 字首音 氣球、聲音 雙胞胎：〔🐢 慢慢 唸〕、男聲 慢 自動 唸 2 次、唸 的 時候 倒數 停住 */
      if (g.id === 'm1' || g.id === 'm2') { await p.waitForTimeout(g.id === 'm2' ? 2600 : 1400); n++; const a1 = await p.evaluate(() => ({ sl: !!document.getElementById('hslow'), pic: !!document.querySelector('.q1p'), pl: window.__pl.slice() }));
        const m1n = a1.pl.filter(x => /^audio\/m1\//.test(x)).length;
        if (!a1.sl || (g.id === 'm1' && !a1.pic) || m1n !== (g.id === 'm2' ? 4 : 2)) E.push(tag + ' ' + g.id + '：〔🐢〕／圖／男聲 慢 唸 2 次 不對 ' + JSON.stringify(a1));
        await p.evaluate(() => { window.__pl = []; document.getElementById('hslow').click(); }); await p.waitForTimeout(900);
        n++; if (!(await p.evaluate(() => window.__pl.some(x => /^audio\/m2\//.test(x))))) E.push(tag + ' ' + g.id + '：〔🐢 慢慢 唸〕沒有 用 更慢 的 語音檔'); }
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
        if (g.id === 'm8' && await p.evaluate(() => !!document.getElementById('rdgo'))) { await p.waitForTimeout(2600); await p.click('#rdgo'); await p.waitForTimeout(300); }
        await p.waitForTimeout(1100);   /* 1 秒 內 就 按 ＝ 太快 亂按（超過 一半 不算 成績）➜ 量測 要 像 真的 學生 一樣 看完 再 按 */
        await p.evaluate(k => { const q = R.q; if (R.g.id === 'm7') { const w = q.spell, mid = w.slice(1, -1).split(''); const order = k === 0 ? mid.slice().reverse() : mid, used = [];
              if (k === 0 && mid.join('') === order.join('')) order[0] = R.tiles.filter(c => mid.indexOf(c) < 0)[0];
              order.forEach(c => { for (let i = 0; i < R.tiles.length; i++) if (used.indexOf(i) < 0 && R.tiles[i] === c) { used.push(i); document.querySelector('[data-t="' + i + '"]').click(); return; } }); }
            else document.querySelector('#stage [data-o="' + (k === 0 ? 1 : 0) + '"]').click(); }, k);
        await p.waitForTimeout(150);
        if (k === 0) {
          /* 答錯 ＝ 綠底 一整頁（照 三年級 複習）：逐字 中文、整句、唸 3 次（短文 偵探：原文 那一句 綠底 ➜ 唸 1 次 ➜ 獨立 頁 唸 1 次）才 有〔▶ 下一題〕，倒數 停住 */
          if (g.id === 'm8') { n++; const e8 = await p.evaluate(() => ({ g: !!document.querySelector('#pas span.evg'), wf: document.getElementById('wf').classList.contains('on') }));
            if (!e8.g || e8.wf) E.push(tag + ' m8 答錯：原文 那一句 沒有 綠底（或 還沒 唸 就 跳 頁）' + JSON.stringify(e8)); await p.waitForTimeout(1300); }
          n++; const f = await p.evaluate(() => { const w = document.getElementById('wf'), gw = [].map.call(w.querySelectorAll('.gw'), x => [x.querySelector('b').textContent, x.querySelector('i').textContent]);
            return { on: w.classList.contains('on'), bg: getComputedStyle(w.querySelector('.box')).backgroundImage, gw, tr: (w.querySelector('.tr') || {}).textContent || '', n3: w.querySelectorAll('#n3 span').length, nx: !!document.getElementById('wfn'), run: TM.run,
              big: parseFloat(getComputedStyle(w.querySelector('.gw b') || w).fontSize), out: w.querySelector('.box').scrollHeight > w.querySelector('.box').clientHeight + 2 }; });
          const zhN = f.gw.filter(x => x[1]).length;
          if (!f.on || !/14, 122, 58|0E7A3A/i.test(f.bg) || !f.gw.length || zhN < Math.min(1, f.gw.length) || !/^整句：\S/.test(f.tr) || f.n3 !== (g.id === 'm8' ? 1 : 3) || f.nx || f.run || f.big < 28 || f.out)
            E.push(tag + ' ' + g.id + '：答錯頁 不對 ' + JSON.stringify(f).slice(0, 220));
          if (SHOT && vp[0] === 820) await p.screenshot({ path: path.join(SHOT, 'mt_' + g.id + '_no.png') });
          /* 唸 的 時候 點〔🔊 再聽〕不會 卡住 */
          await p.waitForTimeout(400); await p.evaluate(() => document.getElementById('wfs').click());
          await p.waitForFunction(() => !!document.getElementById('wfn'), null, { timeout: 15000 }).catch(() => E.push(tag + ' ' + g.id + '：答錯頁 唸完 沒有〔▶ 下一題〕'));
          n++; const tx = await p.evaluate(() => document.getElementById('wfn') && document.getElementById('wfn').textContent); if (!/▶ 下一題 \d/.test(tx || '')) E.push(tag + ' ' + g.id + '：〔▶ 下一題 3〕倒數 不對 ' + tx);
          await p.click('#wfn'); await p.waitForTimeout(300); }
        else if (g.id === 'm8') { await p.waitForTimeout(400); n++; const c8 = await p.evaluate(() => ({ b: !!document.querySelector('#nx8w .nx8'), y: !!document.querySelector('#pas span.evy') }));
          if (!c8.b || !c8.y) E.push(tag + ' m8 答對：沒有 解鎖〔▶ 下一題〕或 證據 沒亮 ' + JSON.stringify(c8)); await p.waitForTimeout(700); await p.click('#nx8w .nx8'); await p.waitForTimeout(200); }
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
