/* score/_sites.js — 哪一個資料夾的題目和遊戲記到成績系統的哪裡（2026-10-08 對話 D，使用者第 9 題：以後新的題目、新的遊戲自動記成績）
 *
 * 用共用引擎做出來的頁面（📝 複習題 sentences/_tq.js、遊戲 sentences/_build_games.js、Review 1 頁的 📝 複習 sentences/_build_cards.js）
 * build 的時候都來這裡查「這個資料夾是幾年級、代號是什麼」，題組代號就自動產生：
 *   📝 複習題       g年級u單元_分頁        例 g3u1_1-1b（單元看資料的 unit）
 *   🎮 遊戲         g年級＋tag_遊戲        例 g3gm_g1（句型遊戲）、g3r1_i1_1（Review 1 遊戲）
 *   📘 Review 1 頁  g年級＋tag_rv第幾組    例 g4r1_rv2
 * g 0 ＝ 三、四年級共用（Review 1 遊戲）：年級看登入的 5 碼（使用者第 8 題：成績算在登入的年級）。
 * 在家複習（g3-review／g4-review）用教學網站的資料夾 ＝ 同一個代號，成績算在一起；來源記「🏠 在家」。
 *
 * 新增一個教材資料夾：在這裡加一行（年級、tag 不可以跟別人重複），沒登記 build 會失敗（不會有漏記成績的頁面）。
 * tag：gm ＝ 句型遊戲、r1 ＝ Review 1；以後 Review 2 用 r2，新的句型課次用 gm 以外的兩個小寫字母＋數字（score/_calc.js 的 SETRE 要認得）。
 */
const path = require('path');
const SITES = {
  'sentences':    { g: 4, game: 'gm', rv: 'r1', name: '四年級' },
  'G3 - L1 + L2': { g: 3, game: 'gm', rv: 'r1', name: '三年級' },
  'review1':      { g: 0, game: 'r1', name: 'Review 1' }
};
function of(dir) {
  const k = path.basename(path.resolve(dir)), s = SITES[k];
  if (!s) throw new Error('成績系統：score/_sites.js 沒有登記「' + k + '」（幾年級、代號），這個資料夾的題目和遊戲記不到成績');
  return Object.assign({ dir: k }, s);
}
module.exports = { SITES, of };
