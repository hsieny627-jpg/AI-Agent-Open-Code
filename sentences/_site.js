/* sentences/_site.js — 這一套產生器要讀哪一個資料夾的資料、寫到哪一個資料夾
 *
 * 平常（node sentences/_build.js）＝ sentences 自己。
 * 別的年級／課次（例：「G3 - L1 + L2」）共用同一套引擎：
 *   它自己的 _build.js 先設 process.env.SITE_DIR ＝ 它的資料夾，再 require 這裡的產生器。
 *   資料（_data.js／_quiz_data.js／_game_data.js）和產出的 .html 都在它自己的資料夾，
 *   發音引擎、配色、字體、按鈕列、卡片產生器、遊戲引擎都跟 sentences 共用同一份。
 *
 * 新功能一律用「有寫才開」的設定（例：_data.js 的 SIL），sentences 沒寫就跟原本一模一樣。
 */
const path = require('path');
const DIR = process.env.SITE_DIR ? path.resolve(process.env.SITE_DIR) : __dirname;
const NAME = path.basename(DIR);
const load = n => require(path.join(DIR, n));
module.exports = { DIR, NAME, load };
