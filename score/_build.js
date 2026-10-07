/* score/_build.js — 成績紀錄（2026-10-07 對話 C）：產生兩個檔
 *   score/Code.gs        老師整份複製、貼進 Google Apps Script（＝ score/_calc.js ＋ score/_server.js）
 *   teacher/index.html   老師看板（＝ score/_teacher.js 樣板 ＋ _calc.js ＋ _xlsx.js ＋ 兩個年級的複習題題庫）
 *   node score/_build.js
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const strip = f => fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/\nif \(typeof module !== 'undefined'\) module\.exports = \w+;\s*$/, '\n');
const CALC = strip('_calc.js'), XL = strip('_xlsx.js');
fs.writeFileSync(path.join(__dirname, 'Code.gs'),
  '/* 成績紀錄（英文句型網站 📝 複習題 5 題）— Google Apps Script\n' +
  ' * 本檔由 score/_build.js 產生（_calc.js ＋ _server.js），不要手改；要改就改那兩個檔再跑 node score/_build.js。\n' +
  ' * 部署步驟：score/Google部署說明.md。密碼放在「專案設定 ➜ 指令碼屬性」的 TEACHER_PW，不要寫在這裡。 */\n\n' +
  CALC + '\n' + fs.readFileSync(path.join(__dirname, '_server.js'), 'utf8'));
/* 題庫：題組代號 g年級u單元_分頁 ➜ 名稱＋5 題（錯題分析要看題目和選項） */
const BANK = {};
[[3, 'G3 - L1 + L2'], [4, 'sentences']].forEach(([g, d]) => {
  const T = require(path.join(ROOT, d, '_tq_data.js')), D = require(path.join(ROOT, d, '_data.js'));
  [1, 2].forEach(u => {
    const TB = u === 1 ? D.TABS1 : D.TABS2, nm = {};
    TB.forEach(tb => { if (tb.sub) tb.sub.forEach((x, n) => { nm[tb.n + (n ? 'a' : 'b')] = tb.n + ' ' + tb.lb + '・' + x.lb; }); else nm[tb.n] = tb.n + ' ' + tb.lb; });
    nm.r4 = '縮寫動畫（在家複習）';
    Object.keys(T['u' + u]).forEach(k => {
      if (!nm[k]) throw new Error('老師看板：' + d + ' Unit ' + u + ' 的題組 ' + k + ' 沒有名稱');
      BANK['g' + g + 'u' + u + '_' + k] = { name: (g === 3 ? '三' : '四') + '年級 Unit ' + u + '｜' + nm[k],
        qs: T['u' + u][k].map(q => ({ k: q.k, q: q.q, show: q.show, say: q.say, sp: q.sp, o: q.o, h: q.h })) };
    });
  });
});
fs.mkdirSync(path.join(ROOT, 'teacher'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'teacher', 'index.html'), require('./_teacher.js')(CALC, XL, BANK));
console.log('score ok  Code.gs、teacher/index.html（題組 ' + Object.keys(BANK).length + ' 組）');
