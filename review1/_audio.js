/* review1/_audio.js — Review 1 單字卡會唸到的英文，全部預先做成語音檔（Kokoro 美式女聲，跟三年級同一套）
 *
 *   TTS_MODELS=<模型資料夾> node review1/_audio.js     然後再跑一次 node review1/_build.js
 *
 * 收集：每一個字／片語、片語裡的每一個字、整句（I like ___.／I like to ___.）、字的結構那一行裡的 {{單字}}、
 *       遊戲會唸的句子（He likes ___.／He can ___, and I can ___.／I can’t ___.…）。
 * 只會做新的，舊的不重做；不再用到的會刪掉（tools/audio_pack.js）。 */
const path = require('path');
const { WORDS } = require('./_data');
const { pack } = require('../tools/audio_pack');
const SENT = { i1: 'I like', i2: 'I like', a1: 'I like to', a2: 'I like to' };
const T = ['I', 'like', 'to'];
WORDS.forEach(w => {
  T.push(w.en);
  w.tk.forEach(t => { T.push(t[0]); t[0].split(/\s+/).forEach(x => T.push(x)); });
  T.push(SENT[w.g] + ' ' + w.en + '.');
  String(w.pt || '').replace(/\{\{([^{}]+)\}\}/g, (m, x) => T.push(x));
});
/* 遊戲（2026-10-02）：每一題的正確答案、聽力題的整句、語序的每一個字（review1/_game_data.js 的 SAY） */
require('./_game_data').SAY.forEach(x => T.push(x));
/* LEGO 全大寫會被唸成 L-E-G-O：鑰匙照畫面，唸的時候換成 Lego */
const r = pack({ texts: T, dir: path.join(__dirname, 'audio'), varName: 'ENAUD', speak: s => s.replace(/\bLEGO\b/g, 'Lego') });
console.log('review1 語音檔：' + r.total + ' 個（新做 ' + r.made + ' 個）');
