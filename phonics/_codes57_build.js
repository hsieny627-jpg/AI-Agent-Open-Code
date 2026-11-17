/* phonics/_codes57_build.js — 2026-11-17 第五十七次：還 沒有 聲音 的 組合 ➜ _codes57.json [[碼, 音標, 拼字]]
 *   ① 進階版 字卡 新 字尾（pt ct xt lp lf lt sp mb ld lk nch）＋部位〔母音＋字尾〕（老師 第 2 點）
 *   ② 🗺️ 拼音 地圖 每 一個「合 英文 拼字 習慣」的 組合（老師 4-20：很 少 用 的 字 也 要 發音）
 *   聲音：tools/ph_gen57.py（真的 字 ＝ 電腦 聽寫 聽 對 才 用）。不雅 的（PH.BAD、PH2.BAD2）永遠 不 做。 */
const fs = require('fs'), path = require('path'), D = __dirname;
const PH = require('./_ph.js'), PH2 = require('./_ph2.js'), EXC2 = require('./_exc2.json'), { all2 } = require('./_enum2.js'), MAP = require('./_map_combos.js');
const have = new Set(fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, '')));
const J = new Map(), add = (c, w) => { if (have.has(c) || J.has(c) || PH2.bad2(c)) return; J.set(c, [c, PH2.ipa2(c), w || '']); };
all2().forEach(x => { const c = x[1], key = x[0].toLowerCase() + '|' + c; if (EXC2[key]) return; add(c, x[0].toLowerCase());
  const pc = PH2.partCode(c, 've'); if (pc.indexOf('s_') !== 0) add(pc, ''); const pi = PH2.partCode(c, 'iv'); add(pi, ''); });
MAP.all().forEach(x => add(x.code, x.w));
const L = [...J.values()]; fs.writeFileSync(path.join(D, '_codes57.json'), JSON.stringify(L)); console.log('要 做 的 聲音', L.length);
