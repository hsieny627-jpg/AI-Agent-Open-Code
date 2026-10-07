/* G3 - L1 + L2/_build.js — 一次重建這個課次的整個網站
 *   node "G3 - L1 + L2/_build.js"
 *
 * 引擎（發音、配色、字體、按鈕列、卡片產生器、暖身題、遊戲）全部跟 sentences 共用：
 * 這裡只告訴它「資料在這個資料夾、產出也放這個資料夾」。
 * 首頁（_build_home.js）是這一課自己的；Kahoot 匯入檔也放在這個資料夾。
 */
process.env.SITE_DIR = __dirname;
require('./_build_home');
['_build_cards', '_build_quiz', '_build_games', '_build_kahoot']
  .forEach(m => require('../sentences/' + m));
require('../sentences/_build_review');   /* 2026-10-03：三年級複習／四年級複習網站（g3-review／g4-review）的首頁和遊戲 */
require('../score/_build.js');   /* 2026-10-07 對話 C：成績紀錄（題庫有三年級的題目） */
