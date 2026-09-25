/* sentences/_surprise.js — 驚喜卡的效果目錄（sentences 與 G3 兩個網站共用）
 *
 * 使用者 2026-09-25 指定：
 *  - 連續答對 3 題才翻一張驚喜卡。
 *  - 70% 直接翻一張；30% 讓學生自己選（二選一 12%、三選一 9%、四選一 6%、五選一 3%）。
 *  - **只給好事**：加分、分數 ✕ 2～5、下一題加秒、下一題刪掉 1～2 個錯的選項、免死金牌、
 *    連對挑戰（連對幾題後下一題 ✕ 5）……絕對沒有「銘謝惠顧」、沒有扣分。
 *  - 每一個遊戲的 30 張卡：名字不一樣、**效果不一樣**、**翻開的特效也不一樣**。
 *
 * 做法：
 *  - FX 是全部的正向效果（37 種，種類＋數值都不一樣）。
 *  - 每一個遊戲從 FX 轉一個起點、取 30 種 ➜ 同一個遊戲裡 30 張卡的效果全部不一樣，
 *    十個遊戲拿到的組合也都錯開。
 *  - 特效 fx ＝ [炸法 0～7, 顏色 0～3]：8 種炸法 ✕ 4 種顏色 ＝ 32 種，
 *    第 n 張卡 ➜ [n % 8, ⌊n / 8⌋ % 4]，所以 30 張卡的特效組合沒有一張重複。
 *  - 沒有選項可以刪的遊戲（他還是她、語序、記憶配對、火眼金睛、分類）不給「刪選項」；
 *    記憶配對也不給「送提示」（它沒有提示）。
 */
const FX = [
  ['pts', 300], ['pts', 400], ['pts', 500], ['pts', 600], ['pts', 700], ['pts', 800], ['pts', 1000], ['pts', 1200], ['pts', 1500],
  ['lucky', [200, 800]], ['lucky', [300, 1200]], ['lucky', [500, 1500]], ['lucky', [100, 2000]],
  ['now', 2], ['now', 3], ['now', 4], ['now', 5],
  ['mul', [2, 2]], ['mul', [2, 3]], ['mul', [3, 2]], ['mul', [4, 1]], ['mul', [5, 1]],
  ['time', 5], ['time', 8], ['time', 10],
  ['cut', 1], ['cut', 2],
  ['shield', 1],
  ['combo', [3, 4]], ['combo', [5, 5]],
  ['hint', 1], ['gold', 1000],
  ['fast', 300], ['fast', 500],
  ['streak', 3], ['streak', 5],
  ['freeze', 5]
];
/* 有四個選項、可以「刪掉錯的選項」的遊戲 */
const OPTG = { g1: 1, g4: 1, g5: 1, g8: 1, g10: 1 };

/* names：30 個名字（第一個字是 emoji，翻開時炸滿畫面的就是它）；gi：第幾個遊戲；g：遊戲代號 */
function build(names, gi, g) {
  if (names.length !== 30) throw new Error(g + ' 驚喜卡不是 30 張：' + names.length);
  const pool = FX.filter(f => (OPTG[g] || f[0] !== 'cut') && (g !== 'g6' || f[0] !== 'hint'));
  const st = (gi * 7) % pool.length;
  const rot = pool.slice(st).concat(pool.slice(0, st));
  const cards = names.map((t, n) => ({ t, k: rot[n][0], v: rot[n][1], fx: [n % 8, Math.floor(n / 8) % 4] }));
  const keys = cards.map(c => c.k + ':' + JSON.stringify(c.v));
  if (new Set(keys).size !== keys.length) throw new Error(g + ' 驚喜卡的效果重複了');
  const fxs = cards.map(c => c.fx.join(','));
  if (new Set(fxs).size !== fxs.length) throw new Error(g + ' 驚喜卡的特效重複了');
  return cards;
}
/* 十個遊戲一起做，並檢查名字全部不重複 */
function buildAll(THEME) {
  const SURP = {};
  Object.keys(THEME).forEach((g, gi) => {
    const names = THEME[g].split(' ').map(s => s.replace(/^(\S+?)([一-鿿])/, '$1 $2'));
    SURP[g] = build(names, gi, g);
  });
  const all = [].concat.apply([], Object.keys(SURP).map(k => SURP[k].map(x => x.t)));
  const dup = all.filter((t, n) => all.indexOf(t) !== n);
  if (dup.length) throw new Error('驚喜卡名字重複：' + dup.join('、'));
  return SURP;
}
module.exports = { FX, OPTG, build, buildAll };
