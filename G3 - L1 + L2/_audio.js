/* G3 - L1 + L2/_audio.js — 把這一課會唸到的英文全部做成語音檔（使用者 2026-09-25 指定：美式英語自然正確的語調）
 *
 *   TTS_MODELS=<模型資料夾> node "G3 - L1 + L2/_audio.js"
 *
 * 瀏覽器內建語音的語調常常不自然（一個字一個字、句尾沒有上揚或下降），
 * 所以這一課的句子、單字、題目答案，全部先用神經語音（Kokoro，美式女聲）做成 mp3，放在 audio/。
 * 網頁唸英文時先查 audio/aud.js，查得到就播音檔；查不到（例如以後新加的句子還沒重做）才用瀏覽器語音。
 * 改了 _data.js／_quiz_data.js／_game_data.js 以後要重跑這一支（只會做新的句子，舊的不重做）。
 */
const path = require('path');
const D = require('./_data'), Q = require('./_quiz_data'), G = require('./_game_data');
const { pack } = require('../tools/audio_pack');

/* 2026-10-03：收集的方法搬到 sentences/_audio_collect.js（四年級也用同一套）：原本的卡、上方分頁的卡、Review 1、
   每一個替換字、問句女聲／答句男聲（'m:'）、複習題、暖身題、遊戲 */
const T = require('../sentences/_audio_collect').collect(D, Q, G, require('./_tq_data'));
/* 句子重音（使用者 2026-09-26 指定）：數字是 content word，音高比較高（stressed）；years old 是 function words，唸得比較輕。
   + ＝ 重音、- ＝ 輕讀，做法見 tools/stress.py */
['six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'].forEach(n => {
  /* 2026-09-27 使用者：years、old 都是輕聲，接近中文三聲（低、平）；old 不可以像中文四聲往下掉 ➜ ~ ＝ 低平
     2026-10-04 使用者：數字的音高稍微調低 ➜ ^ ＝ 溫和的重音（✕1.12，原本 + 是 ✕1.25）；
     男聲 old 收尾不自然（~ 把男聲壓到 88Hz，變成氣泡音）➜ 男聲改用 % ＝ 溫和的低平（全句中位數 ✕0.92）。見 tools/stress.py */
  T.push("I'm ^" + n + ' ~years ~old.', 'I am ^' + n + ' ~years ~old.', "I'm ^" + n + '.', 'I am ^' + n + '.');
  T.push("m:I'm ^" + n + ' %years %old.', 'm:I am ^' + n + ' %years %old.', "m:I'm ^" + n + '.', 'm:I am ^' + n + '.');   /* m: ＝ 男聲（2026-10-03） */
});
/* LEGO 全大寫會被唸成 L-E-G-O：鑰匙照畫面，唸的時候換成 Lego（跟 review1 一樣；2026-10-02 起新做的句子適用） */
/* 2026-10-04 使用者：女聲單獨唸 years old，old 太弱（只有 years 的 1/4 大聲）➜ ! ＝ old 大聲一點、加句點（量過：old ＝ years 的 0.87，男聲本來就 0.94） */
const SPK = { 'years old': 'years !old.' };
const r = pack({ texts: T, dir: path.join(__dirname, 'audio'), lang: 'en', varName: 'AUD', speak: s => SPK[s] || s.replace(/\bLEGO\b/g, 'Lego') });
console.log('語音檔：' + r.total + ' 句（這次新做 ' + r.made + ' 句）');
