/* review1/_subsets.js — 句型卡的替換字切換（使用者 2026-09-28 指定、2026-10-02 跟遊戲一起做）
 *
 * 三年級 Review 1：I like ___. ➜ 📘 課本／🍟 物品 1／🎮 物品 2；I like to ___. ➜ 📘 課本／⛹️ 活動 1／🎧 活動 2
 * 四年級 Review 1：He can ___,／and I can ___. ➜ 📘 課本／⛹️ 活動 1／🎧 活動 2，**只放技能類活動**（SKILL，跟四年級進階遊戲同一套）；
 *                  He likes ___, 保留顏色（那一張在教 and／but 比顏色；使用者 2026-10-02 選「can 只放技能類」）。
 * 「📘 課本」＝ 原本的替換字（SUB 的 basic／adv）；物品、活動的字、中文、圖示全部從 review1/_data.js 拿，分門別類一排一類。
 * 句型卡上的中文不空格（打籃球），跟原本的課本字一樣。
 */
const { WORDS } = require('./_data');

/* can／can’t 只用「技能」類活動：學了才會的運動、樂器、才藝、做菜……（不放 run、stay home、watch TV、eat snacks 這類）
 * 不放 ride my bike：He can ride my bike.（他會騎「我的」腳踏車）意思怪；課本的替換字已經有 ride a bike */
const SKILL = ['play-basketball', 'play-badminton', 'play-soccer', 'play-baseball', 'play-dodgeball', 'swim',
  'play-the-piano', 'play-the-drums', 'play-the-guitar', 'do-taekwondo', 'dance', 'sing', 'draw', 'speak-english', 'do-crafts',
  'do-magic-tricks', 'read', 'cook', 'make-videos', 'bake-cakes', 'write-code'];

/* 句型卡上 can 的中文：do taekwondo 在字卡是「學 跆拳道」（我喜歡學跆拳道），can 的句子要說「他會跆拳道」 */
const CANZH = { 'do-taekwondo': '跆拳道' };
const zh0 = w => w.zh.replace(/ /g, '');
/* 一類一排；小的類別併成一排（版面才放得下）：GRP ＝ 哪幾類放同一排 */
const GRP = { i1: [['零食'], ['飲料', '水果'], ['美食'], ['玩具']], i2: [['3C', '電玩', '手遊'], ['球類'], ['書', '漫畫'], ['生活愛用品']],
  a1: [['球類運動'], ['個人運動'], ['才藝'], ['戶外玩耍']], a2: [['3C 和電玩', '競賽'], ['靜態活動'], ['家裡的活動'], ['假日出遊']] };
function rows(g, keep) {
  const L = WORDS.filter(w => w.g === g && (!keep || keep(w))), out = [];
  if (L.some(w => !GRP[g].some(cs => cs.indexOf(w.cat) >= 0))) throw new Error('替換字：' + g + ' 有類別沒有排進 GRP');
  GRP[g].forEach(cs => { const ws = L.filter(w => cs.indexOf(w.cat) >= 0); if (ws.length) out.push([cs.filter(c => ws.some(w => w.cat === c)), ws]); });
  /* can 只放技能：剩一兩個字的排併到前一排 */
  const m = [];
  out.forEach(r => { if (r[1].length < 3 && m.length) { const p = m[m.length - 1]; p[0] = p[0].concat(r[0]); p[1] = p[1].concat(r[1]); } else m.push(r); });
  return m.map(r => [r[0].join('・'), r[1].map(w => [w.en, (keep && CANZH[w.f]) || zh0(w), w.ic])]);
}
const sk = w => SKILL.indexOf(w.f) >= 0;
const SETS = {
  like: [{ n: '📘 課本' }, { n: '🍟 物品 1', rows: rows('i1') }, { n: '🎮 物品 2', rows: rows('i2') }],
  liketo: [{ n: '📘 課本' }, { n: '⛹️ 活動 1', rows: rows('a1') }, { n: '🎧 活動 2', rows: rows('a2') }],
  can: [{ n: '📘 課本' }, { n: '⛹️ 活動 1', rows: rows('a1', sk) }, { n: '🎧 活動 2', rows: rows('a2', sk) }]
};
module.exports = { SKILL, SETS, CANZH };
