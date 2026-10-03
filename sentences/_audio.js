/* sentences/_audio.js — 四年級句型網站會唸到的英文，全部預先做成語音檔（使用者 2026-10-03 指定：跟三年級同一套，Kokoro 美式）
 *
 *   TTS_MODELS=<模型資料夾> node sentences/_audio.js      然後 node sentences/_build.js
 *
 * 收集的方法跟三年級共用（sentences/_audio_collect.js）：每一張卡、上方分頁的卡、Review 1、每一個替換字、
 * 問句女聲／答句男聲、複習題、暖身題、遊戲。網頁唸英文先查 audio/aud.js，查不到才用瀏覽器語音（_shared.js 的 aPlay）。
 */
const path = require('path');
const D = require('./_data'), Q = require('./_quiz_data'), G = require('./_game_data');
const { pack } = require('../tools/audio_pack');
const T = require('./_audio_collect').collect(D, Q, G);
const r = pack({ texts: T, dir: path.join(__dirname, 'audio'), lang: 'en', varName: 'AUD', speak: s => s.replace(/\bLEGO\b/g, 'Lego') });
console.log('四年級句型語音檔：' + r.total + ' 句（這次新做 ' + r.made + ' 句）');
