/* score/_jobs_bank.js — 💼 職業單字（English-Jobs-New 的 jobdex.html，7 種遊戲）的題庫 ➜ score/_jobs_bank.json（2026-10-09 E，使用者第 4 點）
 *   node score/_jobs_bank.js [English-Jobs-New 資料夾]      （預設 ../english-jobs-new 或 /home/user/english-jobs-new）
 *
 * 職業單字的成績本來就送進同一張 Google 成績表（代號 g年級gm_job-遊戲，例 g4gm_job-memory），
 * 老師看板要認得「這是哪一個遊戲、第幾題是哪一個字」（錯題分析）和派任務的清單，就用這一份。
 * 題目順序 ＝ 那一頁每一個遊戲的 deck（成績的「題庫第幾題」就是 deck 的第幾個），所以直接打開那一頁讀，不另外抄一份。
 * 職業單字改了字或遊戲 ➜ 重跑這一支，再 node score/_build.js。量測擋掉 Google（不送成績）。
 */
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIRS = [process.argv[2], path.join(__dirname, '..', '..', 'english-jobs-new'), '/home/user/english-jobs-new'].filter(Boolean);
const DIR = DIRS.find(d => fs.existsSync(path.join(d, 'jobdex.html')));
if (!DIR) { console.log('找不到 English-Jobs-New 的 jobdex.html（' + DIRS.join('、') + '）'); process.exit(1); }
(async () => {
  const br = await chromium.launch(), p = await br.newPage();
  await p.route(/^https?:/, r => r.abort());   /* 不連外面（不送成績、不讀任務） */
  await p.addInitScript(() => { window.__SCORE_TEST_OFF = 1; window.__TASK_TEST_OFF = 1; });
  await p.goto(pathToFileURL(path.join(DIR, 'jobdex.html')).href); await p.waitForTimeout(800);
  const B = await p.evaluate(() => {
    const o = {};
    META.forEach(m => {
      const G = GAMES[m.id]; if (!G) return;
      const deck = G.deck('all') || [];
      o[m.id] = { name: m.ic + ' ' + m.name, qs: deck.map(e => ({ k: 'g', kn: m.ic + ' ' + m.name, q: (J[e] ? J[e].ic + ' ' + J[e].z : e), o: [e, '❌ 沒答對'], say: e })) };
    });
    return o;
  });
  await br.close();
  if (Object.keys(B).length !== 7) { console.log('職業單字的遊戲不是 7 種：' + Object.keys(B).join('、')); process.exit(1); }
  fs.writeFileSync(path.join(__dirname, '_jobs_bank.json'), JSON.stringify(B, null, 1) + '\n');
  console.log('jobs bank ok  ' + Object.keys(B).map(k => k + ' ' + B[k].qs.length).join('／'));
})();
