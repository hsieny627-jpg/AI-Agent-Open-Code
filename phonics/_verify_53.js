/* phonics/_verify_53.js — 2026-11-14 第五十三次 量測（只 印 失敗 項＋一行 總結）。node phonics/_verify_53.js
 *   R ＝ ㄖㄨ（新 檔、0.2～0.36 秒、跟 第五十二次 不一樣）；字尾 b d g k ＝ 字首 的 5～8 成（聽得 清楚、比 字首 小聲）、比 第五十二次 大聲；
 *   b g s_ep s_et cl_ 沒 動；試聽頁 P53 每 一個 聲音 檔 都 在。不 連 成績表、不 連 Firebase */
const path = require('path'), fs = require('fs'), cp = require('child_process');
const D = __dirname, ROOT = path.join(D, '..'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const LI = path.join(ROOT, 'listen', '2026-11-14_P53'), V52 = path.join(LI, 'v52');
const pcm = f => { const b = cp.execFileSync('ffmpeg', ['-v', 'quiet', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', '22050', '-']); return new Float32Array(b.buffer, b.byteOffset, b.length / 4); };
const dur = f => { const y = pcm(f); let a = 0, b = y.length - 1; const mx = y.reduce((m, x) => Math.max(m, Math.abs(x)), 0); while (a < b && Math.abs(y[a]) < mx * 0.03) a++; while (b > a && Math.abs(y[b]) < mx * 0.03) b--; return (b - a) / 22050; };
const actRms = y => { const w = 441, fr = []; for (let i = 0; i + w < y.length; i += w) { let s = 0; for (let j = i; j < i + w; j++) s += y[j] * y[j]; fr.push(Math.sqrt(s / w)); } const mx = Math.max(...fr), a = fr.filter(x => x > mx * 0.1); return Math.sqrt(a.reduce((t, x) => t + x * x, 0) / a.length); };
const au = c => path.join(D, 'au', c + '.mp3'), same = (a, b) => fs.readFileSync(a).equals(fs.readFileSync(b));
ok(!same(au('s_r'), path.join(V52, 's_r.mp3')), 'R 沒有 換 新 的'); const dr = dur(au('s_r')); ok(dr > 0.2 && dr < 0.36, 'R 長度 ' + dr.toFixed(2));
for (const c of 'bdgk') { const e = au('s_e' + c), a = actRms(pcm(e)), b = actRms(pcm(au('s_' + c))), o = actRms(pcm(path.join(V52, 's_e' + c + '.mp3')));
  ok(!same(e, path.join(V52, 's_e' + c + '.mp3')), '字尾 ' + c + ' 沒有 換'); ok(a > b * 0.5 && a < b * 0.8, '字尾 ' + c + ' 音量 ' + a.toFixed(3) + ' / 字首 ' + b.toFixed(3));
  ok(a > o * 1.1, '字尾 ' + c + ' 沒有 比 第五十二次 大聲'); ok(dur(e) < 0.3, '字尾 ' + c + ' 太 長'); }
for (const c of ['s_b', 's_g', 's_ep', 's_et', 'cl_strong_0_3', 'cl_angry_1_2']) ok(same(au(c), path.join(V52, c + '.mp3')), c + ' 不應該 改');
const h = fs.readFileSync(path.join(LI, 'index.html'), 'utf8');
for (const c of ['s_r', 's_eb', 's_ed', 's_eg', 's_ek', 's_b', 's_g', 's_ep', 's_et', 'cl_strong_0_3', 'cl_angry_1_2', 's_ae', 's_eh', 's_aa', 's_uh', 's_w', 's_d', 's_en']) ok(fs.existsSync(au(c)), '沒有 ' + c);
ok(/<title>[^<]+<\/title>/.test(h) && h.indexOf("O('s_r')") > 0, '試聽頁 不 完整');
/* 第 ③ 點 預覽頁 C53：thin、strong 從頭 跑到 完成（聲音 檔 都 在、6 個 字母 5 個 聲音、母音 偵探、不 超出 螢幕）*/
const C53 = path.join(ROOT, 'listen', '2026-11-14_C53', 'index.html'), hc = fs.readFileSync(C53, 'utf8');
for (const c of (hc.match(/'(s_[a-z]+|cv_[a-z_0-9]+|bk_[a-z]+|cl_[a-z_0-9]+|rm_[a-z_0-9]+)'/g) || []).map(x => x.slice(1, -1))) ok(fs.existsSync(au(c)), 'C53 沒有 聲音 ' + c);
(async () => { const { chromium } = require('playwright'); const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) { const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.addInitScript(() => { HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 20); return Promise.resolve(); }; });
    const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + C53);
    for (const w of ['thin', 'strong']) {
      const r = await p.evaluate(async (w) => { document.querySelector('[data-w="' + w + '"]').click(); RATE = 20; document.getElementById('go').click(); let cnt = '';
        for (let k = 0; k < 400 && !document.querySelector('#vw button'); k++) { await new Promise(s => setTimeout(s, 25)); const c = document.getElementById('cu').textContent; if (c) cnt = c + '|' + document.getElementById('cd').textContent; }
        const boxes = [...document.querySelectorAll('#bx .bx')].map(b => b.textContent.replace(/\d/g, '').trim()); const wrong = [...document.querySelectorAll('#vw button')].find(b => b.dataset.v !== (w === 'thin' ? 'i' : 'o'));
        wrong.click(); await new Promise(s => setTimeout(s, 200)); document.querySelector('#vw [data-v="' + (w === 'thin' ? 'i' : 'o') + '"]').click(); await new Promise(s => setTimeout(s, 400));
        const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth; return { boxes, cnt, step: document.getElementById('step').textContent, zh: document.getElementById('zh').textContent, over: sw > cw }; }, w);
      ok(r.boxes.join() === (w === 'thin' ? 'th,i,n' : 's,t,r,o,ng'), tag + ' ' + w + ' 格子 不對 ' + r.boxes);
      ok(/完成|對/.test(r.step) && r.zh.indexOf(w) === 0, tag + ' ' + w + ' 沒有 跑到 完成 ' + r.step);
      if (w === 'strong') ok(/^123456\|/.test(r.cnt.replace(/\s+/g, '')) && /聲音 5$/.test(r.cnt), tag + ' strong 沒有 6 個 字母 5 個 聲音 ' + r.cnt);
      ok(!r.over, tag + ' ' + w + ' 橫向 超出 螢幕'); }
    ok(!errs.length, tag + ' C53 頁面 錯誤 ' + errs.join(' | ')); await ctx.close(); }
  await br.close();
  console.log(E.length ? E.join('\n') : '', '\nphonics _verify_53：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
