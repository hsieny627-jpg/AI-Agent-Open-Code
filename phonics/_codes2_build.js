/* phonics/_codes2_build.js — 2026-11-12 第四十八次：要 做（或 重做）的 聲音 ➜ _codes2.json [[檔名, 音標, 種類, 要 聽到 的 字, 毫秒]]
 *   種類：r ＝ 直接 做（沒有 意思 的 組合）；w ＝ 真的 字，電腦 聽寫 聽 對 才 用（tools/ph_gen2.py，最多 12 次）；t ＝ 單獨 一個 音，切 短（字首音 不 帶 ㄜ）
 *   ① 基礎版、進階版 新 的 組合 ② 部位〔字首＋母音〕〔母音＋字尾〕③ 照 規則 唸 的 真的 字（原本 的 音檔 也 重做：big 不可以 像 beg）
 *   ④ 例外 字 的 真的 唸法 x_<字> ⑤ 字首音／字尾音（s_b…、字尾 m ＝ s_em 閉嘴、字尾 n ＝ s_en）⑥ 課本 單字 bk_<字>、塊 bc_<塊> */
const fs = require('fs'), path = require('path'), D = __dirname;
const PH = require('./_ph.js'), PH2 = require('./_ph2.js'); Object.assign(PH.EXC, require('./_exc.json'));
const SHOW = require('./_excshow.json'), EXC2 = require('./_exc2.json'), REG = require('./_realreg.json'), BOOK = require('./_book.js');
const { all } = require('./_enum.js'), { all2 } = require('./_enum2.js');
const have = new Set(fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, '')));
const RG = {}; REG.forEach(([c, w]) => RG[c] = w);
const J = new Map(), add = (f, ipa, k, w, ms) => { if (!J.has(f) || k === 'w') J.set(f, [f, ipa, k, w || '', ms || 0]); };
const ipa = c => PH2.ipa2(c);
/* ① ② 原本 字卡 的 部位 */
all().forEach(x => { const V = PH.VLIST[x[3]], c = x[1]; if (PH.BAD.indexOf(c) >= 0) return;
  const key = x[0].toLowerCase() + '|' + c; if (PH.EXC[key] && !SHOW[key]) return;
  ['iv', 've'].forEach(p => { const pc = PH2.partCode(c, p); if (pc.indexOf('s_') === 0 || PH2.bad2(pc)) return; if (!have.has(pc)) add(pc, ipa(pc), 'r'); }); });
/* ① 基礎版、進階版 */
all2().forEach(x => { const c = x[1], key = x[0].toLowerCase() + '|' + c; if (EXC2[key]) return;
  if (!have.has(c)) add(c, ipa(c), RG[c] ? 'w' : 'r', RG[c]);
  ['iv', 've'].forEach(p => { const pc = PH2.partCode(c, p); if (pc.indexOf('s_') === 0 || PH2.bad2(pc)) return; if (!have.has(pc)) add(pc, ipa(pc), 'r'); }); });
/* ③ 照 規則 的 真的 字：全部 重做＋聽寫 */
REG.forEach(([c, w]) => add(c, ipa(c), 'w', w));
/* ④ 例外 字 的 真的 唸法 */
const seen = new Set(); Object.keys(SHOW).forEach(k => { const w = k.split('|')[0]; if (seen.has(w)) return; seen.add(w); add('x_' + w, PH2.realIpa(SHOW[k][0]), 'w', w); });
/* ⑤ 單獨 一個 音（切 短）：塞音 只 留 爆破 那 一下（ㄜ 幾乎 沒有）；長 的 音 留 0.45 秒 */
const T = { b: ['b', 75], d: ['d', 75], g: ['ɡ', 85], p: ['p', 95], t: ['t', 95], k: ['k', 105], j: ['dʒ', 150], ch: ['tʃ', 160], kw: ['kw', 190],
  m: ['mːː', 480], n: ['nːː', 480], f: ['fːː', 450], s: ['sːː', 450], z: ['zːː', 450], v: ['vːː', 450], sh: ['ʃːː', 450], th: ['θːː', 450], dh: ['ðːː', 420], l: ['lːː', 420],
  h: ['h', 140], w: ['w', 200], r: ['ɹː', 260], y: ['j', 190], x: ['ks', 260], ck: ['k', 105], em: ['mːː', 520], en: ['nːː', 520] };
for (const k in T) add('s_' + k, T[k][0] + '.', 't', '', T[k][1]);
/* ⑥ 課本 */
const files = [];
for (const w in BOOK.W) { const x = BOOK.W[w]; add('bk_' + w.replace(/ /g, '_'), PH2.realIpa(x.ph), 'w', w);
  (x.c || []).forEach(c => { const s = c[0].toLowerCase(); const real = ['bed', 'room', 'bath', 'cat', 'dog', 'sad', 'not', 'yes', 'he', 'she', 'no', 'in', 'an', 'all'].indexOf(s) >= 0;
    add('bc_' + s, PH2.realIpa(c[1]), real ? 'w' : 'r', real ? s : ''); }); }
const L = [...J.values()];
fs.writeFileSync(path.join(D, '_codes2.json'), JSON.stringify(L));
const n = k => L.filter(x => x[2] === k).length;
console.log('要 做 的 聲音', L.length, '個：直接 做', n('r'), '、聽寫 檢查', n('w'), '、單獨 的 音', n('t'));
