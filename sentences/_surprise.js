/* sentences/_surprise.js — 驚喜卡的效果目錄（sentences 與 G3 兩個網站共用）
 *
 * 使用者 2026-09-25 指定：
 *  - 連續答對 3 題才翻驚喜卡。
 *  - 2026-09-27 使用者：取消單張，一律自己選（二選一 40%、三選一 30%、四選一 20%、五選一 10%）；
 *    卡包的外觀每一次都不一樣（_skins.js）；效果要有核彈級（接下來 3 題 ✕3、下一題 ✕10、總分翻倍……）。
 *  - **只給好事**：加分、分數 ✕ 2～5、下一題加秒、下一題刪掉 1～2 個錯的選項、免死金牌、
 *    連對挑戰（連對幾題後下一題 ✕ 5）……絕對沒有「銘謝惠顧」、沒有扣分。
 *  - 每一個遊戲的 30 張卡：名字不一樣、**效果不一樣**、**翻開的特效也不一樣**。
 *
 * 做法：
 *  - FX 是全部的正向效果（36 種，種類＋數值都不一樣）。
 *  - 每一個遊戲從 FX 轉一個起點、取 30 種 ➜ 同一個遊戲裡 30 張卡的效果全部不一樣，
 *    十個遊戲拿到的組合也都錯開。
 *  - 特效 fx ＝ [炸法 0～7, 顏色 0～3]：8 種炸法 ✕ 4 種顏色 ＝ 32 種，
 *    第 n 張卡 ➜ [n % 8, ⌊n / 8⌋ % 4]，所以 30 張卡的特效組合沒有一張重複。
 *  - 沒有選項可以刪的遊戲（他還是她、語序、記憶配對、火眼金睛、分類）不給「刪選項」；
 *    記憶配對也不給「送提示」（它沒有提示）。
 */
const FX = [
  /* 2026-09-27 使用者：驚喜內容嚴禁相似、要有核彈級震撼 ➜ 同一種效果最多兩三個數值，種類拉開 */
  ['pts', 500], ['pts', 1000], ['pts', 2000],
  ['lucky', [200, 1000]], ['lucky', [100, 5000]],
  ['slot', 1],
  ['now', 2], ['now', 3], ['now', 5],
  ['mul', [2, 3]], ['mul', [3, 3]], ['mul', [5, 2]], ['mul', [10, 1]], ['mul', [2, 5]],
  ['time', 8], ['gt', 20], ['gt', 40],
  ['cut', 1], ['cut', 2],
  ['shield', 1], ['shield', 2],
  ['combo', [3, 4]], ['combo', [5, 6]],
  ['hint', 1],
  ['gold', 1000], ['gold', 3000],
  ['fast', 500],
  ['streak', 3], ['streak', 5],
  ['freeze', 5], ['freeze', 10],
  ['pct', 20], ['pct', 50],
  ['rain', [300, 3]], ['rain', [500, 5]],
  ['dbl', 3000]
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
