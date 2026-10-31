/* midterm/_verify.js — 📝 四年級 複習 量測（只印失敗項和一行總結；SHOT=資料夾 拍照）
 *   node midterm/_verify.js
 * 三種螢幕（iPad 橫、iPad 直、教室觸控螢幕 1920）：大廳 12 種（2026-10-27 第三十一次 🪤 m12 陷阱 偵測器 放回）、三區；每一種遊戲：第一題 畫面 不超出、字 ≧ 20px、按鈕 ≧ 48px、聽力題 有 語音檔、
 * 照片 載得到；答對 ＋分、答錯 有 正確答案＋中文、〔▶ 下一題〕；玩完 一回 10 題 ➜ 成績 佇列 多 一筆 g4gm_mt-遊戲（假 伺服器，**絕對 不送 真的 成績表**）。 */
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.join(__dirname, '..'), D = require('./_data.js'), SHOT = process.env.SHOT;
const E = []; let DCL1 = 0; let n = 0;
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
/* 2026-10-27 第三十二次 2-(2)(3)：字首音 氣球 每題 2 個（60% b↔p、d↔t；40% 不 容易 聽錯 的）；聲音 雙胞胎 60% 難；「A: …」拆開 唸（字母 A、B 有 語音檔） */
{ const HD = { b: 'p', p: 'b', d: 't', t: 'd' }, fam = c => /[bp]/.test(c) ? 'bp' : 'dt';
  for (const L of [D.GAMES[0].B, D.XB.m1]) { const h = L.filter(q => q.o.length === 2 && HD[q.o[0]] === q.o[1]).length; n++;
    if (L.some(q => q.o.length !== 2) || Math.abs(h / L.length - .6) > .08) E.push('字首音 氣球 不是 每題 2 個 或 難 的 不是 60%：' + h + '／' + L.length); }
  const P = D.GAMES[1].B, hp = P.filter(q => fam(q.pair[0][0]) === fam(q.pair[1][0])).length; n++;
  if (Math.abs(hp / P.length - .6) > .08) E.push('聲音 雙胞胎 難 的 不是 60%：' + hp + '／' + P.length);
  const lab = D.GAMES.concat(Object.keys(D.XB).map(k => ({ B: D.XB[k] }))).reduce((a, g) => a.concat(g.B.filter(q => /^A:/.test(q.ae || ''))), []); n += 2;
  if (!lab.length || lab.some(q => !q.lab || q.lab[0].join() !== 'L,A' || q.lab[2].join() !== 'L,B')) E.push('「A: …」的 句子 沒有 拆開 唸 字母 A');
  if (!['A', 'B'].every(x => fs.existsSync(path.join(__dirname, 'audio/lab', x + '.mp3')))) E.push('沒有 字母 A、B 的 語音檔（audio/lab）');
  if (D.SAY.some(t => /\b[AB]:/.test(t))) E.push('還有 整句 連「A:」一起 唸 的 語音'); }
/* 第三十二次 第 4 點：拼字 救援 母音 紅、不發音 灰（q.lc） */
{ const L = D.GAMES.find(g => g.id === 'm7').B.concat(D.XB.m7); n++;
  if (L.some(q => !q.lc || q.lc.length !== q.spell.length || q.spell.split('').some((c, i) => /[aeiou]/.test(c) !== (q.lc[i] === 'v' || (q.lc[i] === 's' && /[aeiou]/.test(c)))))) E.push('拼字 救援 母音／不發音 記號 不對');
  const nt = L.find(q => q.spell === 'nineteen'); n++; if (nt && nt.lc[3] !== 's') E.push('nineteen 的 第一個 e 要 灰色（不發音）'); }
Object.keys(D.PHOTO).forEach(k => { n++; if (!fs.existsSync(path.join(__dirname, 'img', k + '.jpg'))) E.push('沒有 照片：' + k); });
/* 2. 總首頁 有〔📝 四年級 期中複習〕，在家複習 沒有 */
{ n++; const hub = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'); if (!/href="midterm\/index\.html"[^>]*>📝 四年級 複習</.test(hub.replace(/<\/?span[^>]*>/g, ''))) E.push('總首頁 沒有〔四年級 期中複習〕');
  for (const d of ['g3-review', 'g4-review']) for (const f of fs.readdirSync(path.join(ROOT, d)).filter(f => /\.html$/.test(f))) if (/midterm\/(?!home\.html)/.test(fs.readFileSync(path.join(ROOT, d, f), 'utf8'))) E.push(d + '/' + f + '：在家複習 連到 期中複習（只 可以 連 25 題 闖關 home.html，第三十五次 第 9 點）'); }
(async () => {
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]].filter(v => !process.env.VP || process.env.VP === String(v[0]))) {   /* VP＝1024 只 量 一種 螢幕 */
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } }), tag = vp.join('×');
    await ctx.route(/^https?:\/\/(?!127\.)/, r => /script\.test/.test(r.request().url()) ? r.fulfill({ contentType: 'application/json', body: '{"ok":true,"dup":[]}' }) : r.abort());
    await ctx.addInitScript(() => { window.__DCLK = 0.05; window.__NOTUT = 1; window.__NOUNLOCK = 1; window.__NOWB = 1; Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} });
      localStorage.setItem('score_last', '"40201"'); localStorage.setItem('score_id_g4', '"40201"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', '40201');
      window.__say = 0; window.__pl = []; window.__RD = 2; window.speechSynthesis && (window.speechSynthesis.speak = u => setTimeout(() => u.onend && u.onend(), 100));
      HTMLMediaElement.prototype.play = function () { window.__say++; window.__pl.push(this.src.replace(/^.*\/midterm\//, '')); const a = this; setTimeout(() => { a.onended && a.onended(); }, 120); return Promise.resolve(); }; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(500);
    n++; const hb = await p.evaluate(() => ({ m12: !!document.querySelector('[data-g="m12"]'), g: document.querySelectorAll('[data-g]').length, s: document.querySelectorAll('.sec').length, ox: document.documentElement.scrollWidth - innerWidth }));
    /* 2026-10-28 第三十三次 第 7 點：答錯頁 每一個 英文 字 正下方 都 有 中文（Who’s、She’s 的 ’s、數字；the／to 本來 就 空白）；短文 偵探 題目 也 逐字、名字 的 ’s ＝ 的 */
    if (vp[0] === 1024) { n++; const gz = await p.evaluate(() => { const bad = []; GM.concat([{ id: 'x', B: [].concat.apply([], Object.keys(XB).map(k => XB[k])) }]).forEach(g => g.B.forEach(q => { if (!q.fe) return;
        const d = document.createElement('div'); d.innerHTML = gloss(q.fe, q.gx, 0) + (q.pas ? glossQ(m8Q(q)) : ''); [].forEach.call(d.querySelectorAll('.gw'), w => { const e = w.querySelector('b').textContent.replace(/[.,?!]/g, ''); if (!w.querySelector('i').textContent && !/^(the|to)$/i.test(e)) bad.push(e); }); }));
        return { bad: [...new Set(bad)], pos: /Emily.*的/.test(glossQ('She’s Emily’s sister.').replace(/<[^>]+>/g, '')) }; });
      if (gz.bad.length || !gz.pos) E.push(tag + ' 答錯頁 逐字 中文 空白：' + gz.bad.join(' ') + (gz.pos ? '' : '｜名字 的 ’s 不是 的')); }
    if (hb.g !== 12 || !hb.m12 || hb.s !== 3 || hb.ox > 1) E.push(tag + ' 大廳：' + JSON.stringify(hb));
    if (SHOT) await p.screenshot({ path: path.join(SHOT, 'mt_hub_' + vp[0] + '.png'), fullPage: true });
    for (const g of D.GAMES.filter(g => !process.env.G || process.env.G.split(',').indexOf(g.id) >= 0)) {   /* G＝m1,m8 只 量 這幾 種 */
      if (process.env.DBG) console.log('… ' + tag + ' ' + g.id);
      await p.evaluate(id => { window.__pl = []; start(id); }, g.id); await p.waitForTimeout(700);
      /* 🕵️ 短文 偵探：第一幕 只有 短文、〔開始〕鎖住，讀完 才 解鎖（量測 __RD ＝ 2 秒；老師 20 秒）*/
      if (g.id === 'm8') { n++; const r0 = await p.evaluate(() => ({ pas: !!document.querySelector('.rd .pas'), opt: document.querySelectorAll('#stage [data-o]').length, dis: document.getElementById('rdgo').disabled, def: /__RD\|\|15\b/.test(readScene.toString()) }));
        if (!r0.pas || r0.opt || !r0.dis || !r0.def) E.push(tag + ' m8 第一幕 不對（只有 短文、15 秒 鎖住）' + JSON.stringify(r0));
        await p.waitForTimeout(2600); n++; if (await p.evaluate(() => document.getElementById('rdgo').disabled)) E.push(tag + ' m8 讀完 沒有 解鎖〔開始〕');
        await p.click('#rdgo'); await p.waitForTimeout(500);
        n++; const r1 = await p.evaluate(() => ({ pas: !!document.querySelector('#stage .pas'), opt: document.querySelectorAll('#stage [data-o]').length, t: TM.T }));
        if (!r1.pas || r1.opt !== 3 || r1.t !== 30) E.push(tag + ' m8 第二幕 不對（上面 短文、下面 3 個 選項、30 秒）' + JSON.stringify(r1));
        /* 第三十二次 2-(1)B：答對 的 綠色 橫幅 小、在 最上面、不 蓋住〔▶ 下一題〕、1.6 秒 收起來 */
        await p.click('#stage [data-o="0"]'); await p.waitForTimeout(400); n += 2;
        const ok8 = await p.evaluate(() => { const f = document.getElementById('fb').getBoundingClientRect(), b = document.querySelector('.nx8'), r = b && b.getBoundingClientRect(), hit = r && !(f.bottom <= r.top || f.top >= r.bottom || f.right <= r.left || f.left >= r.right);
          const x = r && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { sm: document.getElementById('fb').classList.contains('sm'), top: Math.round(f.top), h: Math.round(f.height), hit, btn: !!(x && b.contains(x)) }; });
        if (!ok8.sm || ok8.top > 40 || ok8.h > 80 || ok8.hit || !ok8.btn) E.push(tag + ' m8 答對 橫幅 太大／蓋住〔▶ 下一題〕' + JSON.stringify(ok8));
        await p.waitForTimeout(1600); if (await p.evaluate(() => document.getElementById('fb').classList.contains('on'))) E.push(tag + ' m8 答對 橫幅 沒有 自己 收起來');
        await p.evaluate(() => start('m8')); await p.waitForTimeout(2600); await p.click('#rdgo'); await p.waitForTimeout(500); }
      /* 字首音 氣球、聲音 雙胞胎：〔🐢 慢慢 唸〕、男聲 慢 自動 唸 2 次、唸 的 時候 倒數 停住 */
      if (g.id === 'm1' || g.id === 'm2') { await p.waitForTimeout(g.id === 'm2' ? 2600 : 1400); n++; const a1 = await p.evaluate(() => ({ sl: !!document.getElementById('hslow'), pic: !!document.querySelector('.q1p'), pl: window.__pl.slice() }));
        const m1n = a1.pl.filter(x => /^audio\/m1\//.test(x)).length;
        if (!a1.sl || (g.id === 'm1' && a1.pic) || m1n !== (g.id === 'm2' ? 4 : 2)) E.push(tag + ' ' + g.id + '：〔🐢〕／字首音 氣球 不可以 有 圖（第三十次）／男聲 慢 唸 2 次 不對 ' + JSON.stringify(a1));
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
            if (!e8.g || e8.wf) E.push(tag + ' m8 答錯：原文 那一句 沒有 綠底（或 還沒 唸 就 跳 頁）' + JSON.stringify(e8)); await p.waitForFunction(() => document.getElementById('wf').classList.contains('on'), null, { timeout: 6000 }).catch(() => {}); await p.waitForTimeout(150); }   /* 第二十九次：證據 一句一句 唸 ➜ 等 唸完 才 跳 */
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
        else { await p.waitForTimeout(1600); await p.waitForFunction(kk => !R || R.k > kk || !!document.querySelector('.end'), k, { timeout: 8000 }).catch(() => {}); }   /* 第三十二次：A／B 拆開 唸 ＝ 唸完 才 換 題 */
      }
      n++; const end = await p.evaluate(() => ({ t: document.getElementById('app').innerText, q: JSON.parse(localStorage.getItem('score_q') || '[]').concat([]) }));
      if (!/答對 9 ／ 10 題/.test(end.t)) E.push(tag + ' ' + g.id + '：結束 畫面 不是 9／10：' + end.t.slice(0, 60));
      if (!/記進 成績/.test(end.t)) E.push(tag + ' ' + g.id + '：沒有 記 成績');
      await p.evaluate(() => hub());
    }
    /* 第三十二次 3-(1)(2)：25 題 做 3 題 ➜〔✕ 離開〕先 問 ➜ 繼續 作答 ➜ 再 離開 ➜ 大廳〔▶ 繼續〕從 第 4 題、分數 接著；離開 不送 成績；做過 的 題目 下一次 先 不出 */
    if (vp[0] === 1024 && (!process.env.G || /xr/.test(process.env.G))) {
      /* 第三十二次 3-(3)：平常 打開 沒有 25／50 題（只 有 一行 說明）；⚡ 現場任務 開了 x25 ＝ 只 有 那一顆、沒有 遊戲 格子（假 的 現場任務 設定，Firebase 換成 假 的，絕對 不 連 真的） */
      { await p.evaluate(() => { CR = null; hub(); }); n += 2; const z0 = await p.evaluate(() => ({ xb: document.querySelectorAll('.xrow .xb').length, off: !!document.querySelector('.xoff') }));
        if (z0.xb || !z0.off) E.push(tag + ' 平常 打開 還 看得到 25／50 題（要 只 在 現場任務 開）' + JSON.stringify(z0));
        await p.evaluate(N => { LDB.set = LDB.must = LDB.patch = () => Promise.resolve(true); CR = { room: '0402', t: 1, cfg: { on: 1, t: 1, set: 'x' + N, gs: [], m: 'self' }, acc: {}, n: 0, ok: 0, q: -9, rd: {} }; hub(); }, 25); const z1 = await p.evaluate(() => ({ xb: [...document.querySelectorAll('.xrow [data-xn],.xrow [data-xr]')].map(b => b.getAttribute('data-xn') || b.getAttribute('data-xr')).join(), gc: document.querySelectorAll('.gc').length }));
        if (z1.xb !== '25' || z1.gc) E.push(tag + ' 現場任務 開了 25 題：要 只 有 25 那一顆、沒有 遊戲 格子 ' + JSON.stringify(z1)); }
      await p.evaluate(N => { LDB.set = LDB.must = LDB.patch = () => Promise.resolve(true); CR = { room: '0402', t: 1, cfg: { on: 1, t: 1, set: 'x' + N, gs: [], m: 'self' }, acc: {}, n: 0, ok: 0, q: -9, rd: {} }; hub(); window.__NOGO = 1; window.__NORVA = 1; localStorage.removeItem('mt_seen_40201'); document.querySelectorAll('.scfull').forEach(x => x.remove()); }, 25); await p.click('.xrow .xb[data-xn="25"]'); await p.waitForTimeout(300);
      for (let k = 0; k < 3; k++) { await passL(p); if (await p.evaluate(() => !!document.getElementById('rdgo'))) { await p.waitForTimeout(2600); await p.click('#rdgo'); await p.waitForTimeout(300); }
        await p.waitForTimeout(1100); await p.evaluate(() => { const q = R.q; if (R.g.id === 'dc') { const sl = [...document.querySelectorAll('.dcs')]; q.t.forEach((x, i) => { const t = [...document.querySelectorAll('.dctl:not(.used)')].filter(e => e.textContent === x[1])[0]; sl[i].click(); ['pointerdown', 'pointerup'].forEach(ev => t.dispatchEvent(new PointerEvent(ev, { bubbles: true, clientX: 1, clientY: 1 }))); }); } else if (R.g.id === 'm7') { const w = q.spell, mid = w.slice(1, -1).split(''), used = []; mid.forEach(c => { for (let i = 0; i < R.tiles.length; i++) if (used.indexOf(i) < 0 && R.tiles[i] === c) { used.push(i); document.querySelector('[data-t="' + i + '"]').click(); return; } }); } else document.querySelector('#stage [data-o="0"]').click(); });
        await p.waitForTimeout(400); await p.evaluate(() => { const b = document.querySelector('#nx8w .nx8'); if (b) b.click(); });
        await p.waitForFunction(kk => R.k > kk, k, { timeout: 9000 }).catch(() => E.push(tag + ' 離開 測試：第 ' + (k + 1) + ' 題 沒有 到 下一題')); }
      const sent0 = await p.evaluate(() => JSON.parse(localStorage.getItem('score_q') || '[]').filter(x => x.set === 'g4gm_mt-x25').length);
      await p.waitForTimeout(400); await p.click('.hud .qx'); await p.waitForTimeout(300); n += 6;
      const q1 = await p.evaluate(() => ({ on: document.getElementById('xq').classList.contains('on'), t: document.getElementById('xq').innerText, run: TM.run, h: Math.round(document.getElementById('xstay').getBoundingClientRect().height) }));
      if (!q1.on || !/真的 要 離開 嗎/.test(q1.t) || !/存好/.test(q1.t) || !/第 4 題/.test(q1.t) || q1.run || q1.h < 64) E.push(tag + ' 按〔✕ 離開〕沒有 先 問（存好 了、從 第 4 題、倒數 停住）' + JSON.stringify(q1));
      await p.click('#xstay'); await p.waitForTimeout(300); if (await p.evaluate(() => document.getElementById('xq').classList.contains('on') || !R || R.k !== 3)) E.push(tag + '〔▶ 繼續 作答〕沒有 回到 題目');
      await p.click('.hud .qx'); await p.waitForTimeout(300); await p.click('#xleave'); await p.waitForTimeout(400);
      const lb = await p.evaluate(() => ({ r: (document.querySelector('[data-xr="25"]') || {}).innerText || '', nw: !!document.querySelector('.xb2[data-xn="25"]'), sent: JSON.parse(localStorage.getItem('score_q') || '[]').filter(x => x.set === 'g4gm_mt-x25').length }));
      if (!/繼續 25 題/.test(lb.r) || !/第 3 ／ 25/.test(lb.r) || !lb.nw) E.push(tag + ' 大廳 沒有〔▶ 繼續 25 題〕〔🔄 重新 開始〕' + JSON.stringify(lb));
      if (lb.sent !== sent0) E.push(tag + ' 中途 離開 不可以 送 成績（要 做完 才 送）');
      await p.click('[data-xr="25"]'); await p.waitForTimeout(500); await passL(p); if (await p.evaluate(() => !!document.getElementById('rdgo'))) { await p.waitForTimeout(2600); await p.click('#rdgo'); await p.waitForTimeout(300); }
      const rs = await p.evaluate(() => ({ k: R.k, sc: R.sc, q: R.Q.length, n: R.idx.length }));
      if (rs.k !== 3 || rs.sc !== 12 || rs.q !== 3 || rs.n !== 25) E.push(tag + ' 繼續 以後 不是 從 第 4 題、12 分 接著：' + JSON.stringify(rs));
      const sn = await p.evaluate(() => { const S = JSON.parse(localStorage.getItem('mt_seen_40201') || '[]'); startX(25); const now = R.gs.map((g, k) => XG(g.id, R.idx[k])); const hit = now.filter(i => S.indexOf(i) >= 0).length; hub(); return { s: S.length, hit }; });
      if (sn.s !== 3 || sn.hit) E.push(tag + ' 做過 的 題目 下一次 又 出現（要 先 不出）' + JSON.stringify(sn));
      await p.evaluate(() => { localStorage.removeItem('mt_xs25_40201'); localStorage.removeItem('mt_seen_40201'); hub(); }); }
    /* 2026-10-26 第二十八次 第 3、4 點：📝 25 題／50 題 挑戰（12 關 連著 玩、每題 4／2 分、30% 類似、記 成績）*/
    for (const N of (process.env.G && !/x/.test(process.env.G) ? [] : vp[0] === 1024 ? [25, 50] : vp[0] === 820 ? [25] : []).filter(x => !process.env.XN || +process.env.XN === x)) {
      await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(400);   /* 每一次 重新 打開（做完 會 提醒 登出）*/
      await p.evaluate(N => { LDB.set = LDB.must = LDB.patch = () => Promise.resolve(true); CR = { room: '0402', t: 1, cfg: { on: 1, t: 1, set: 'x' + N, gs: [], m: 'self' }, acc: {}, n: 0, ok: 0, q: -9, rd: {} }; hub(); window.__NOGO = 1; window.__NORVA = 1; }, N); await p.waitForTimeout(200);
      n++; const xb = await p.evaluate(() => [...document.querySelectorAll('.xrow .xb')].map(b => b.getAttribute('data-xn') + ':' + Math.round(b.getBoundingClientRect().height)).join());
      if (xb !== N + ':' + xb.split(':')[1] || +xb.split(':')[1] < 60) E.push(tag + ' 現場任務 大廳 沒有〔📝 ' + N + ' 題〕大按鈕：' + xb);
      await p.evaluate(d1 => { if (!d1) Object.keys(localStorage).filter(k => /^dcl_seen_/.test(k)).forEach(k => localStorage.removeItem(k)); window.__DCLMIN = d1 ? 0 : undefined; }, DCL1); await p.evaluate(() => { document.querySelectorAll('.scfull').forEach(x => x.remove()); }); await p.click('.xrow .xb[data-xn="' + N + '"]'); await p.waitForTimeout(300);   /* 做完 提醒 登出 的 那一頁 先 關掉 */
      n++; const pl = await p.evaluate(() => ({ c: R.cnt, sim: R.gs.filter((g, k) => g.B[R.idx[k]].sim).length, n: R.idx.length, ord: R.lvOf.every((l, i) => !i || l >= R.lvOf[i - 1]), p8: [...new Set(R.gs.map((g, k) => g.id === 'm8' ? g.B[R.idx[k]].pas : '').filter(x => x))].length }));
      const want = N === 25 ? [1, 2] : [2, 3], dN = N === 25 ? 8 : 15;   /* 2026-10-29：第 1 關 ＝ 🔓 解碼 任務 8／15 題，其他 12 關 平均 */
      if (pl.c[0] !== dN || pl.n !== N || pl.c.slice(1).some(x => x < want[0] || x > want[1]) || pl.sim !== Math.round(N * .3) || !pl.ord || pl.p8 !== 1) E.push(tag + ' ' + N + ' 題：抽題 不 平均／類似 不是 30%／短文 不是 一篇：' + JSON.stringify(pl));
      const lvs = new Set(); let guard = 0;
      while (guard++ < N + 5) {
        if (await p.evaluate(() => !!document.querySelector('.end'))) break;
        if (await p.evaluate(() => !!document.getElementById('rdgo'))) { await p.waitForTimeout(2600); await p.click('#rdgo'); await p.waitForTimeout(300); }
        /* 🔓 解碼 任務：每一課 第一題 前 秒懂 動畫（≧ 20 秒、第一次 不能 跳過）*/
        if (await p.evaluate(() => document.getElementById('dcl').classList.contains('on'))) { n++;
          if (!DCL1) { DCL1 = 1; const a = await p.evaluate(async () => { await new Promise(r => setTimeout(r, 3000)); return { go: !!document.getElementById('dlgo'), sk: !!document.getElementById('dlsk'), c: document.querySelectorAll('#dcl .dlc').length, zh: [...document.querySelectorAll('#dcl .dlc')].filter(c => c.getAttribute('data-w')).every(c => c.querySelector('.zh').textContent.trim())   /* 第三十五次：縮寫 動畫 的 ______ 空格 下面 本來 就 沒有 中文 */ }; });
            if (a.go || a.sk || !a.c || !a.zh) E.push(tag + ' 解碼 動畫：3 秒 就 可以 開始／跳過 或 沒有 字：' + JSON.stringify(a));
            const t0 = Date.now(); await p.waitForSelector('#dlgo', { timeout: 30000 }).catch(() => E.push(tag + ' 解碼 動畫 沒有〔▶ 開始 解碼〕')); if (Date.now() - t0 + 3000 < 19000) E.push(tag + ' 解碼 動畫 不到 20 秒'); await p.evaluate(() => { window.__DCLMIN = 0; }); }
          else await p.waitForSelector('#dlgo,#dlsk', { timeout: 30000 }).catch(() => E.push(tag + ' 解碼 動畫 沒有〔▶ 開始〕'));
          await p.click('#dlgo,#dlsk').catch(() => {}); await p.waitForTimeout(300); }
        const st = await p.evaluate(() => ({ k: R.k, lv: R.lv, id: R.g.id, sc: R.sc, nm: document.querySelector('.hud .nm').textContent }));
        if (process.env.DBG) console.log('… ' + N + ' 第 ' + (st.k + 1) + ' 題 ' + st.id + ' ' + new Date().toISOString().slice(11, 19));
        lvs.add(st.lv); if (!/第 \d+ 關/.test(st.nm)) E.push(tag + ' ' + N + ' 題：上面 沒有 寫「第 幾 關」');
        await p.waitForTimeout(1100); const wrong = st.k === 0;
        if (st.id === 'dc') { const q = await p.evaluate(() => R.q); for (let i = 0; i < q.t.length; i++) { const want = q.t[i][1], tl = await p.$$('.dctl:not(.used)'); let pk = null;
            for (const e of tl) { const t = await e.textContent(); if (wrong && i === 0 ? t !== want : t === want) { pk = e; break; } } if (!pk && wrong) pk = tl[0]; if (!pk) { E.push('解碼：找不到 方塊 ' + want + '｜' + q.en); break; }
            const sl = (await p.$$('.dcs'))[i]; if (i === 0) { const b = await pk.boundingBox(), s2 = await sl.boundingBox(); await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await p.mouse.down(); await p.mouse.move(s2.x + s2.width / 2, s2.y + s2.height / 2, { steps: 8 }); await p.mouse.up(); }
            else { await pk.click(); await sl.click(); } await p.waitForTimeout(40); }
          if (!wrong) await p.waitForFunction(kk => !R || R.k > kk || R.lock, st.k, { timeout: 8000 }).catch(() => {}); }
        else await p.evaluate(k => { const q = R.q; if (R.g.id === 'm7') { const w = q.spell, mid = w.slice(1, -1).split(''); const order = k === 0 ? mid.slice().reverse() : mid, used = [];
              if (k === 0 && mid.join('') === order.join('')) order[0] = R.tiles.filter(c => mid.indexOf(c) < 0)[0];
              order.forEach(c => { for (let i = 0; i < R.tiles.length; i++) if (used.indexOf(i) < 0 && R.tiles[i] === c) { used.push(i); document.querySelector('[data-t="' + i + '"]').click(); return; } }); }
            else document.querySelector('#stage [data-o="' + (k === 0 ? 1 : 0) + '"]').click(); }, st.k);
        if (wrong) { await p.waitForFunction(() => !!document.getElementById('wfn'), null, { timeout: 15000 }).catch(() => E.push(tag + ' ' + N + ' 題：答錯 沒有〔▶ 下一題〕')); await p.click('#wfn').catch(() => {}); }
        else { const s1 = await p.evaluate(() => R.sc); if (st.id !== 'dc' && Math.abs(s1 - st.sc - 100 / N) > .01) E.push(tag + ' ' + N + ' 題：答對 一題 要 ＋' + (100 / N) + ' 分，現在 ＋' + (s1 - st.sc));
          if (st.id === 'm8') { await p.waitForSelector('#nx8w .nx8', { timeout: 5000 }).catch(() => {}); await p.waitForTimeout(300); await p.evaluate(() => { const b = document.querySelector('#nx8w .nx8'); if (b) b.click(); }); } }   /* 答對 的 提示 會 蓋住 一下 ➜ 直接 按 */
        await p.waitForFunction(kk => !R || R.k > kk || !!document.querySelector('.end'), st.k, { timeout: 15000 }).catch(() => E.push(tag + ' ' + N + ' 題 第 ' + (st.k + 1) + ' 題（' + st.id + '）沒有 到 下一題'));
        await p.waitForTimeout(100);
      }
      n++; if (lvs.size !== 13) E.push(tag + ' ' + N + ' 題：沒有 13 關 連著 玩：' + [...lvs].join());
      n++; const e = await p.evaluate(() => ({ t: document.getElementById('app').innerText, rows: document.querySelectorAll('.xtb tr').length }));
      const w2 = await p.evaluate(() => Math.min(100, Math.round(R.sc * 10) / 10)); if (w2 < (N - 1) * 100 / N - .01 || e.t.indexOf(w2 + ' 分 ／ 100') < 0 || e.rows !== 14 || e.t.indexOf('答對 ' + (N - 1) + ' ／ ' + N) < 0 || !/記進 成績/.test(e.t)) E.push(tag + ' ' + N + ' 題：結束 頁 不對：' + e.t.slice(0, 90));
      n++; const rq = await p.evaluate(N => { const Q = JSON.parse(localStorage.getItem('score_q') || '[]').concat(JSON.parse(localStorage.getItem('score_sent') || '[]')); const r = Q.filter(x => x.set === 'g4gm_mt-x' + N).pop();
          return r ? { n: r.qs.length, ok: r.qs.filter(q => q[0]).length, bi: r.qs.every(q => q[5] >= 0 && q[5] < XN), nm: r.name } : null; }, N);
      if (!rq || rq.n !== N || rq.ok !== N - 1 || !rq.bi || !/^📝 四年級 複習｜📝 /.test(rq.nm)) E.push(tag + ' ' + N + ' 題：沒有 記進 成績：' + JSON.stringify(rq));
      if (SHOT) await p.screenshot({ path: path.join(SHOT, 'mt_x' + N + '_' + vp[0] + '.png'), fullPage: true });
      await p.evaluate(() => { window.__NOGO = 0; hub(); });
    }
    /* 2026-10-29 第 3、5 件：📝 新 25／新 50（題庫 B）＝ 第 1 關 🔓 ＋ 6 種 全新 遊戲（每一種 第一題 故意 錯：答錯頁 有 逐字 中文、不用 捲動）*/
    for (const N of (process.env.G && !/n/.test(process.env.G) ? [] : vp[0] === 1024 ? [25, 50] : vp[0] === 820 ? [25] : [])) {
      await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(400);
      await p.evaluate(N => { window.__DCLMIN = 0; LDB.set = LDB.must = LDB.patch = () => Promise.resolve(true); CR = { room: '0402', t: 1, cfg: { on: 1, t: 1, set: 'n' + N, gs: [], m: 'self' }, acc: {}, n: 0, ok: 0, q: -9, rd: {} }; hub(); window.__NOGO = 1; window.__NORVA = 1; document.querySelectorAll('.scfull').forEach(x => x.remove()); }, N); await p.waitForTimeout(200);
      n++; const xb = await p.evaluate(() => [...document.querySelectorAll('.xrow .xb')].map(b => b.getAttribute('data-xn') + b.getAttribute('data-bk') + ':' + /新 /.test(b.innerText)).join());
      if (xb !== N + 'B:true') E.push(tag + ' 現場任務 開 新 ' + N + '：大廳 要 只 有〔📝 新 ' + N + ' 題 挑戰〕' + xb);
      await p.click('.xrow .xb'); await p.waitForTimeout(300);
      n++; const pl = await p.evaluate(() => ({ c: R.cnt, n: R.idx.length, ids: [...new Set(R.gs.map(g => g.id))].join(), sim: R.gs.filter((g, k) => g.B[R.idx[k]].sim).length }));
      if (pl.n !== N || pl.c[0] !== (N === 25 ? 8 : 15) || pl.ids !== 'dc,n1,n2,n3,n4,n5,n6' || pl.sim !== Math.round(N * .5)) E.push(tag + ' 新 ' + N + ' 題：抽題 不對（第 1 關 解碼、6 種 新 遊戲、類似 50%）' + JSON.stringify(pl));
      const wr = {}; let guard = 0;
      while (guard++ < N + 10) {
        const st = await p.evaluate(() => ({ end: !!document.querySelector('.end'), dcl: document.getElementById('dcl').classList.contains('on'), id: R && R.g && R.g.id, k: R && R.k, sc: R && R.sc }));
        if (st.end) break; if (st.dcl) { await p.waitForSelector('#dlgo,#dlsk', { timeout: 20000 }).catch(() => {}); await p.click('#dlgo,#dlsk').catch(() => {}); await p.waitForTimeout(300); continue; }
        await p.waitForTimeout(900); const q = await p.evaluate(() => R.q), wrong = !wr[st.id]; wr[st.id] = 1;
        if (st.id === 'dc') { const sl = await p.$$('.dcs'); for (let i = 0; i < q.t.length; i++) { const tl = await p.$$('.dctl:not(.used)'); let pk = null; for (const e of tl) { const t = await e.textContent(); if (wrong && i === 0 ? t !== q.t[0][1] : t === q.t[i][1]) { pk = e; break; } } if (!pk) pk = tl[0]; await pk.click(); await sl[i].click(); } }
        else if (st.id === 'n5') { const w = q.spell.slice(1, -1).split(''); if (wrong) w.reverse(); if (wrong && w.join('') === q.spell.slice(1, -1)) w[0] = '?';
          for (const ch of w) await p.evaluate(ch => { let i = R.tiles.map((c, j) => c === ch && R.pk.indexOf(j) < 0 ? j : -1).filter(j => j >= 0)[0]; if (i == null) i = R.tiles.map((c, j) => R.pk.indexOf(j) < 0 ? j : -1).filter(j => j >= 0)[0]; document.querySelector('[data-t="' + i + '"]').click(); }, ch); }
        else await p.click('#stage [data-o="' + (wrong ? 1 : 0) + '"]', { force: true });
        if (wrong) { await p.waitForSelector('#wfn', { timeout: 25000 }).catch(() => E.push(tag + ' 新 ' + N + '：' + st.id + ' 答錯 沒有〔▶ 下一題〕'));
          n++; const a = await p.evaluate(() => ({ gl: document.querySelectorAll('#wf .gw').length, oy: document.getElementById('wbox').scrollHeight - document.getElementById('wbox').clientHeight }));
          if (!a.gl || a.oy > 2) E.push(tag + ' 新 ' + N + '：' + st.id + ' 答錯頁 沒有 逐字 中文 或 要 捲動 ' + JSON.stringify(a)); await p.click('#wfn').catch(() => {}); }
        else { n++; const ov = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight); if (ov > 2) E.push(tag + ' 新 ' + N + '：' + st.id + ' 畫面 超出 ' + ov + 'px'); }
        await p.waitForFunction(kk => !R || R.k > kk || !!document.querySelector('.end'), st.k, { timeout: 20000 }).catch(() => E.push(tag + ' 新 ' + N + ' 第 ' + (st.k + 1) + ' 題（' + st.id + '）沒有 到 下一題'));
      }
      n++; const e = await p.evaluate(() => ({ t: document.getElementById('app').innerText, rows: document.querySelectorAll('.xtb tr').length }));
      if (!/📝 新 \d+ 題 挑戰：/.test(e.t) || e.rows !== 8) E.push(tag + ' 新 ' + N + '：結束 頁 不對（7 關 表）' + e.t.slice(0, 80));
      n++; const rq = await p.evaluate(N => { const Q = JSON.parse(localStorage.getItem('score_q') || '[]').concat(JSON.parse(localStorage.getItem('score_sent') || '[]')); const r = Q.filter(x => x.set === 'g4gm_mt-n' + N).pop(); return r ? { n: r.qs.length, bi: r.qs.every(q => q[5] >= 0 && q[5] < XB2N), nm: r.name } : null; }, N);
      if (!rq || rq.n !== N || !rq.bi || !/新 /.test(rq.nm)) E.push(tag + ' 新 ' + N + '：沒有 記進 成績（g4gm_mt-n' + N + '）' + JSON.stringify(rq));
      await p.evaluate(() => { window.__NOGO = 0; window.__DCLMIN = undefined; hub(); });
    }
    n++; if (errs.length) E.push(tag + ' JS 錯誤：' + errs.slice(0, 3).join('｜'));
    await ctx.close();
  }
  await br.close();
  E.forEach(x => console.log('❌ ' + x)); console.log('四年級 複習 量測 ' + n + ' 項，' + E.length + ' 個失敗'); process.exit(E.length ? 1 : 0);
})();
/* 🔓 解碼 動畫 開著 ＝ 快轉 過去（離開／繼續 的 測試 用）*/
async function passL(p) { if (await p.evaluate(() => document.getElementById('dcl').classList.contains('on'))) { await p.evaluate(() => { window.__DCLMIN = 0; }); await p.waitForSelector('#dlgo,#dlsk', { timeout: 30000 }).catch(() => {}); await p.click('#dlgo,#dlsk').catch(() => {}); await p.waitForTimeout(250); } }
