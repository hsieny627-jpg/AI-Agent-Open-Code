/* g3mid/_rva_audio.js — 🎬 秒懂 複習 動畫＋⚡ 突擊 測驗 的 語音檔（2026-10-31 第三十六次 第 1 點；三、四年級）
 * HiFi-Captain 美式 女聲／男聲（'m:'），跟 全站 一樣；句子 0.85（三年級 複習 的 速度）、單獨 一個 字 0.92（g3mid/_audio.js 量過：0.85 的 單字 會 糊）。
 *   TTS_MODELS=<模型資料夾> node g3mid/_rva_audio.js     然後 node g3mid/_build.js、node midterm/_build.js
 * 產生：<年級 資料夾>/audio/rv（ENAUDR）、audio/rvw（ENAUDRW）。只 做 新 的。 */
const path = require('path');
const { pack } = require('../tools/audio_pack');
const one = t => !/[\s.,?!]/.test(t.replace(/^m:/, ''));
[['g3mid', require('./_rva_data.js')], ['midterm', require('../midterm/_rva_data.js')]].forEach(([dir, R]) => {
  if (R.err.length) { console.error('✗ ' + R.err.join('\n✗ ')); process.exit(1); }
  const base = path.join(__dirname, '..', dir, 'audio');
  const a = pack({ texts: R.say.filter(t => !one(t)), dir: path.join(base, 'rv'), varName: 'ENAUDR', speed: 0.85 });
  const b = pack({ texts: R.say.filter(one), dir: path.join(base, 'rvw'), varName: 'ENAUDRW', speed: 0.92 });
  console.log(dir + ' 秒懂 複習 動畫 語音：句子 ' + a.total + '（新做 ' + a.made + '）、單字 ' + b.total + '（新做 ' + b.made + '）');
});
