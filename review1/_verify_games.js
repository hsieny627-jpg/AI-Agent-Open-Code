/* review1/_verify_games.js — Review 1 遊戲的量測（只印失敗項與一行總結）
 *   node review1/_verify_games.js
 *
 * ① 題庫（不用開瀏覽器）：每個遊戲 ≧ 20 題；四選一的四個選項都不一樣、正解只有一個；
 *    錯的選項不可以是「其實也對」的句子；看英文選圖的選項每一個都有圖示＋中文、圖示不重複；
 *    can／can’t 只用技能類活動；驚喜卡 12 副 ✕ 30 張、名字全部不重複。
 * ② 網頁：用 sentences/_verify.js 的遊戲頁量測（大廳、驚喜卡、加分視窗、倒數、每一個遊戲點一次、答錯頁、加分題），
 *    再加 review1/_verify_r1.js（圖示、句點、記憶配對、兩個 to、整句選項、語音檔、逐字中文）。
 */
const GD = require('./_game_data');
const { WORDS } = require('./_data');
const e = [];
const VALID = ['I like dance.', 'I like to juice.', 'I like to milk.', 'He likes to juice.', 'He likes to milk.',
  'I like to play piano.', 'I like to play drums.', 'I like to play guitar.', 'I like swimming.', 'I like dancing.'];
const NOTSKILL = ['run', 'ride-my-bike', 'play-outside', 'play-in-the-park', 'stay-home', 'watch-tv', 'watch-videos', 'eat-snacks', 'go-shopping',
  'play-with-toys', 'listen-to-music', 'play-video-games', 'play-mobile-games', 'go-camping', 'visit-my-grandparents', 'go-to-an-amusement-park'];
let n = 0;
GD.GAMES.forEach(m => {
  const B = GD.BANK[m.id];
  n++; if (B.length < 20) e.push(m.id + ' 只有 ' + B.length + ' 題');
  B.forEach((c, k) => {
    if (!c.o) return;
    n++;
    const low = c.o.map(x => String(x).toLowerCase());
    if (new Set(low).size !== low.length) e.push(m.id + ' 第 ' + (k + 1) + ' 題選項重複：' + c.o.join('／'));
    if (c.o.length !== 4) e.push(m.id + ' 第 ' + (k + 1) + ' 題不是四個選項');
    c.o.slice(1).forEach(x => { if (VALID.indexOf(x) >= 0) e.push(m.id + ' 錯的選項其實也對：' + x); });
    if (c.pic) {
      const ic = c.o.map(x => GD.OIC[x]);
      if (ic.some(x => !x) || c.o.some(x => !GD.OZH[x])) e.push(m.id + ' 看英文選圖的選項少了圖示或中文：' + c.o.join('／'));
      if (new Set(ic).size !== ic.length) e.push(m.id + ' 看英文選圖的選項圖示重複：' + c.o.join('／'));
    }
    if (m.ty === 'g5' && c.o.some(x => !GD.OIC[x])) e.push(m.id + ' 聽力選項少了圖示：' + c.o.join('／'));
  });
});
/* can／can’t：只用技能 */
GD.SKILL.forEach(f => { n++; if (NOTSKILL.indexOf(f) >= 0) e.push('can 的題目放了不是技能的活動：' + f); });
GD.X4.forEach(c => { if (/\bcan(’t)?\b/.test(c.o[0])) { n++; const w = WORDS.find(x => c.o[0].indexOf(' ' + x.en + (c.o[0].indexOf(',') > 0 ? ',' : '.')) > 0 && x.g[0] === 'a');
  if (!w || GD.SKILL.indexOf(w.f) < 0) e.push('四年級進階的 can 題不是技能：' + c.o[0]); } });
/* 驚喜卡 */
const decks = [...new Set(Object.values(GD.SURP))];
n++; if (decks.length !== 12) e.push('驚喜卡不是 12 副（' + decks.length + '）');
const names = [].concat(...decks.map(d => d.map(x => x.t)));
n++; if (names.length !== 360 || new Set(names).size !== 360) e.push('驚喜卡不是 360 張不重複的（' + new Set(names).size + '）');
/* 物品和活動的驚喜卡完全不同 */
const iN = new Set([].concat(...GD.GAMES.filter(m => m.sec[0] === 'i').map(m => GD.SURP[m.id].map(x => x.t))));
const aN = [].concat(...GD.GAMES.filter(m => m.sec[0] === 'a').map(m => GD.SURP[m.id].map(x => x.t)));
n++; if (aN.some(t => iN.has(t))) e.push('活動的驚喜卡跟物品的一樣');

if (e.length) { console.log('✗ 題庫'); e.forEach(x => console.log('   ' + x)); }
console.log((e.length ? '✗ ' : '✓ ') + '題庫：量了 ' + n + ' 項，失敗 ' + e.length + ' 項');

/* ② 網頁 */
process.env.SITE_DIR = __dirname;
process.argv = process.argv.slice(0, 2).concat(['games.html']);
if (!e.length) require('../sentences/_verify.js');
else process.exit(1);
