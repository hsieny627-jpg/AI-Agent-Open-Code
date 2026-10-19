/* midterm/_audio.js — 四年級 期中複習 會唸的英文，全部預先做成語音檔（HiFi-Captain 美式女聲，跟全站一樣）
 *   TTS_MODELS=<模型資料夾> node midterm/_audio.js     然後再跑一次 node midterm/_build.js
 * 只會做新的，舊的不重做；不再用到的會刪掉（tools/audio_pack.js）。 */
const path = require('path');
const { pack } = require('../tools/audio_pack');
const r = pack({ texts: require('./_data').SAY, dir: path.join(__dirname, 'audio'), varName: 'ENAUD' });
console.log('midterm 語音檔：' + r.total + ' 個（新做 ' + r.made + ' 個）');
