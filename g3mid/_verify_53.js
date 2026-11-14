/* 2026-11-14 第五十三次 量測：📝 成長測驗 聽寫 字母 ＝ 老師 給 的 113、114 年 錄音（g3mid/audio/ex/）。只 印 失敗 項。node g3mid/_verify_53.js
   ① 23 個 字母 檔 都 在、長度 0.4～1.3 秒 ② 頁面 aud('a.','X') ＝ audio/ex/a.mp3，i o w ＝ 網站 語音 ③ 真的 開始 成長測驗：聽寫 字母 播 的 是 audio/ex/ ④ 答錯頁 的 聲音 也 是
   不連 真的 成績 伺服器、不連 Firebase */
const { chromium } = require('playwright'), path = require('path'), fs = require('fs'), cp = require('child_process');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const GTEX = require('./_gt_data.js').GTEX;
ok(GTEX === 'abcdefghjklmnpqrstuvxyz', 'GTEX 不對 ' + GTEX);
for (const c of GTEX) { const f = path.join(__dirname, 'audio', 'ex', c + '.mp3'); ok(fs.existsSync(f), '沒有 ' + c + '.mp3'); if (!fs.existsSync(f)) continue;
  const d = +cp.execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString(); ok(d > 0.4 && d < 1.3, c + ' 長度 ' + d); }
(async () => {
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180]]) {
    const tag = vp.join('×'), ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.addInitScript(() => { Object.assign(window, { __NOUNLOCK: 1, __NODFXI: 1, __NOSNH: 1, __NOGO: 1, __NORVA: 1, __NOWB: 1, __NOTUT: 1, __FBWDG: 900, __WRVFAST: 1, __NOGO2: 1 }); window.__SRC = [];
      HTMLMediaElement.prototype.play = function () { const a = this; window.__SRC.push(a.src); setTimeout(() => a.onended && a.onended(), 30); return Promise.resolve(); };
      localStorage.setItem('g3m_war', '"b01"'); });
    const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, 'g3mid', 'index.html')); await p.waitForTimeout(700);
    const a = await p.evaluate(() => ['a.', 'z.', 'H.', 'i.', 'o.', 'w.'].map(t => aud(t, 'X')));
    ok(a[0] === 'audio/ex/a.mp3' && a[1] === 'audio/ex/z.mp3' && a[2] === 'audio/ex/h.mp3', tag + ' aud X 不是 老師 錄音 ' + a.slice(0, 3));
    ok(a.slice(3).every(x => x.indexOf('audio/ex/') < 0), tag + ' i o w 不應該 用 ex ' + a.slice(3));
    const r = await p.evaluate(async () => { document.querySelectorAll('.scfull').forEach(x => x.remove()); CR = null; XBK = 'G'; startGT(25); await new Promise(s => setTimeout(s, 300));
      for (let k = 0; k < 30 && !(R.q && R.q.up); k++) { try { next(); } catch (e) { } await new Promise(s => setTimeout(s, 200)); }
      window.__SRC = []; const q = R.q; if (!q || !q.up) return { err: 'no gl' }; const mi = document.querySelector('.mlis'); if (mi) mi.click(); await new Promise(s => setTimeout(s, 900));
      const fb = FB.gl(q, ''); return { lo: q.lo, src: window.__SRC.slice(), fb: fb.sl }; });
    ok(!r.err, tag + ' 沒有 進到 聽寫 字母 ' + r.err);
    if (!r.err) { const want = GTEX.indexOf(r.lo) >= 0 ? 'audio/ex/' + r.lo + '.mp3' : null;
      ok(want ? r.src.some(s => s.endsWith(want)) : !r.src.some(s => /audio\/ex\//.test(s)), tag + ' 聽寫 ' + r.lo + ' 播 的 不是 老師 錄音：' + r.src.map(s => s.split('/').slice(-2).join('/')).join(','));
      ok(r.fb && r.fb[0] && r.fb[0][0] === 'X', tag + ' 答錯頁 的 聲音 沒有 用 老師 錄音'); }
    ok(!errs.length, tag + ' 頁面 錯誤 ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  await br.close();
  console.log(E.length ? E.join('\n') : '', '\ng3mid _verify_53：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0);
})();
