/* g34/_build.js — 寫出兩個年級的「縮寫動畫」「比較」四頁（卡片引擎跟兩個句型網站共用 sentences/_build_cards.js）
 *   node g34/_build.js
 * 語音檔要先做好（TTS_MODELS=<模型資料夾> node g34/_audio.js），沒有新句子就不用模型。 */
process.env.SITE_DIR = __dirname;
require('../sentences/_build_cards');
