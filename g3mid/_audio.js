/* g3mid/_audio.js — 三年級 複習 會唸的英文，全部預先做成語音檔（HiFi-Captain 美式女聲／男聲，跟全站一樣）
 * 老師第 4 點「聽力速度稍微放慢、發音清晰」➜ 句子 語速 0.85（全站 1）；
 * 單獨一個字 語速 0.92（2026-10-25 量過：0.85 的 pig、vest 電腦聽寫 8 次 聽成 egg、fest；0.92 聽得對）➜ audio/w/（ENAUDW）。
 *   TTS_MODELS=<模型資料夾> node g3mid/_audio.js     然後再跑一次 node g3mid/_build.js
 * 只會做新的，舊的不重做；不再用到的會刪掉（tools/audio_pack.js）。 */
const path = require('path');
const { pack } = require('../tools/audio_pack');
const SAY = require('./_data').SAY, one = t => typeof t === 'string' && !/[\s.,?!]/.test(t.replace(/^m:/, ''));
const r = pack({ texts: SAY.filter(t => !one(t)), dir: path.join(__dirname, 'audio'), varName: 'ENAUD', speed: 0.85 });
const w = pack({ texts: SAY.filter(one), dir: path.join(__dirname, 'audio/w'), varName: 'ENAUDW', speed: 0.92 });
console.log('g3mid 語音檔：句子 ' + r.total + ' 個（新做 ' + r.made + '）、單字 ' + w.total + ' 個（新做 ' + w.made + '）');
