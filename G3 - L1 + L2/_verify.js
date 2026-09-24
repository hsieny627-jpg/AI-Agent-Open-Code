/* G3 - L1 + L2/_verify.js — 量測（跟 sentences 共用同一支 _verify.js，只是量這個資料夾）
 *   node "G3 - L1 + L2/_verify.js"             量全部五頁 ✕ 兩尺寸
 *   node "G3 - L1 + L2/_verify.js" unit1.html  只量一頁
 * 只印失敗項與一行總結。
 */
process.env.SITE_DIR = __dirname;
require('../sentences/_verify.js');
