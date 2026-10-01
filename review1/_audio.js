/* review1/_audio.js — Review 1 單字卡會唸到的英文，全部預先做成語音檔（Kokoro 美式女聲，跟三年級同一套）
 *
 *   TTS_MODELS=<模型資料夾> node review1/_audio.js     然後再跑一次 node review1/_build.js
 *
 * 收集：每一個字／片語、片語裡的每一個字、整句（I like ___.／I like to ___.）、字的結構那一行裡的 {{單字}}。
 * 只會做新的，舊的不重做；不再用到的會刪掉（tools/audio_pack.js）。 */
const path = require('path');
const { WORDS } = require('./_data');
const { pack } = require('../tools/audio_pack');
const SENT = { i1: 'I like', i2: 'I like', a1: 'I like to', a2: 'I like to' };
const T = ['I', 'like', 'to'];
WORDS.forEach(w => {
  T.push(w.en);
  w.tk.forEach(t => T.push(t[0]));
  T.push(SENT[w.g] + ' ' + w.en + '.');
  String(w.pt || '').replace(/\{\{([^{}]+)\}\}/g, (m, x) => T.push(x));
});
const r = pack({ texts: T, dir: path.join(__dirname, 'audio'), varName: 'ENAUD' });
console.log('review1 語音檔：' + r.total + ' 個（新做 ' + r.made + ' 個）');
