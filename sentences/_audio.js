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
/* 2026-10-04 使用者（清單第 7 點）：
   He is my father. 的 my 唸輕 ➜ -my（音高 ✕0.86、音量 ✕0.7）；He’s my／She is my／She’s my 也一樣
   Is he a doctor? 句尾上揚 ➜ 最後一個字前面加 /（音高從 ✕1.0 升到 ✕1.38）；Is he／Is she 開頭的問句全部一樣
   she 單獨唸，sh 聽起來像 s（語音辨識聽成「C」）➜ 唸成「She.」（辨識聽得出 She）。做法見 tools/stress.py */
const MARK = [];
T.forEach(x => {
  const m = /^(m:)?(.*)$/.exec(String(x)), v = m[1] || '', s = m[2];
  if (/^(He|She)('s| is) my [A-Za-z]+\.$/.test(s)) MARK.push(v + s.replace(/ my /, ' -my '));
  if (/^Is (he|she) .*\?$/.test(s)) MARK.push(v + s.replace(/(\S+)\?$/, '/$1?'));
});
const SPK = { she: 'She.' };
const r = pack({ texts: T.concat(MARK), dir: path.join(__dirname, 'audio'), lang: 'en', varName: 'AUD', speak: s => SPK[s] || s.replace(/\bLEGO\b/g, 'Lego') });
console.log('四年級句型語音檔：' + r.total + ' 句（這次新做 ' + r.made + ' 句）');
