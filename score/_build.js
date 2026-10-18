/* score/_build.js — 成績紀錄（2026-10-07 對話 C）：產生兩個檔
 *   score/Code.gs        老師整份複製、貼進 Google Apps Script（＝ score/_calc.js ＋ score/_server.js）
 *   teacher/index.html   老師看板（＝ score/_teacher.js 樣板 ＋ _calc.js ＋ _xlsx.js ＋ 全部題庫）
 *   node score/_build.js
 *
 * 題庫（錯題分析要看題目和選項）2026-10-08 對話 D 起自動收：score/_sites.js 登記的每一個資料夾裡
 *   _tq_data.js（📝 複習題）、_game_data.js（遊戲）、_data.js 的 XPAGES[].rv（Review 1 頁的 📝 複習）。
 *   題組代號跟網頁送出來的一樣；三、四年級共用的（Review 1 遊戲）存成 g*r1_…，看板兩個年級都查得到。
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const SITES = require('./_sites.js').SITES;
const strip = f => fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/\nif \(typeof module !== 'undefined'\) module\.exports = \w+;\s*$/, '\n');
const CALC = strip('_calc.js'), XL = strip('_xlsx.js');
fs.writeFileSync(path.join(__dirname, 'Code.gs'),
  '/* 成績紀錄（英文句型網站：📝 複習題、遊戲、Review 1）— Google Apps Script\n' +
  ' * 本檔由 score/_build.js 產生（_calc.js ＋ _server.js），不要手改；要改就改那兩個檔再跑 node score/_build.js。\n' +
  ' * 部署步驟：score/deploy.html（大字版）。密碼放在「專案設定 ➜ 指令碼屬性」的 TEACHER_PW，不要寫在這裡。 */\n\n' +
  CALC + '\n' + fs.readFileSync(path.join(__dirname, '_server.js'), 'utf8'));

const BANK = require('./_bank.js');
fs.mkdirSync(path.join(ROOT, 'teacher'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'teacher', 'index.html'), require('./_teacher.js')(CALC, XL, BANK));
/* 部署步驟的大字秒懂網頁（使用者 2026-10-07：說明看不懂、視力不佳） */
fs.writeFileSync(path.join(__dirname, 'deploy.html'), require('./_deploy_page.js')(fs.readFileSync(path.join(__dirname, 'Code.gs'), 'utf8')));
fs.writeFileSync(path.join(__dirname, 'update.html'), require('./_deploy_page.js')(fs.readFileSync(path.join(__dirname, 'Code.gs'), 'utf8'), 'update'));   /* 2026-10-09 程式更新＋貼名單 */
module.exports = BANK;
console.log('score ok  Code.gs、teacher/index.html、score/deploy.html、update.html（題組 ' + Object.keys(BANK).length + ' 組）');
