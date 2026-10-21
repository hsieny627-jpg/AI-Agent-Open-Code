/* sentences/_review_sites.js — 「三年級複習」「四年級複習」兩個在家複習網站的設定（原本在 _build_review.js，2026-10-12 D 第 7 件搬出來：
 * 老師看板〔🔒 開關〕要知道在家複習網站有哪些主題，score/_build.js 也讀這一份）。
 * topics(S) ＝ 首頁上每一個主題（句型卡每一個分頁、每一個遊戲、每一個補充頁）＋〔🔒 開關〕的代號（g年級rv_…，例 g3rv_u1-t0-0）。
 */
const NAMETAG = require('./_nametag').TAG;
const path = require('path');
const SITES = [
  { out: 'g3-review', src: 'G3 - L1 + L2', g: '三年級複習', games: ['g3', 'g5', 'g9', 'g2', 'g4', 'g1', 'g6', 'g7', 'g8', 'g10'],   /* 2026-10-21 第十八次 第 11 點：總首頁剩下的 4 個（記憶配對、火眼金睛、填空高手、魔王挑戰）也放進來 */   /* 2026-10-16 C4 第 8 題：再放 I 還是 My、縮寫變身術、閃電四選一（接在後面，舊的〔🔒 開關〕代號不變） */
    r1: 'x3',
    units: [{ ic: NAMETAG, t: 'Unit 1　What’s your name?', f: 'u1.html', tabs: ['What’s your name?', 'My name is ___.'] },
            { ic: '🎂', t: 'Unit 2　How old are you?', f: 'u2.html', tabs: ['How old are you?', 'I’m ten years old.'] }],
    /* 補充（2026-10-07 使用者第 12 點）：複製一份進複習網站（from ＝ 老師網站的那一頁），按鈕只回複習首頁 */
    more: [{ ic: '🔢', t: '數字：單字結構', from: 'G3 - L1 + L2/numbers/numbers-parts.html' },
           { ic: '🔢', t: '數字：單字故事', from: 'G3 - L1 + L2/numbers/numbers-why.html' },
           { ic: '👀', t: 'Sight Words：單字結構', from: 'G3 - L1 + L2/sight/sight-parts.html' },
           { ic: '👀', t: 'Sight Words：單字故事', from: 'G3 - L1 + L2/sight/sight-why.html' }] },
  { out: 'g4-review', src: 'sentences', g: '四年級複習', games: ['g3', 'g4', 'g5', 'g2', 'g9', 'g1', 'g6', 'g7', 'g8', 'g10'],   /* 2026-10-21 第十八次 第 11 點：同上 */   /* 2026-10-16 C4 第 8 題：再放 他還是她、分類大師、閃電四選一 */
    r1: 'x4', jobs: 'https://hsieny627-jpg.github.io/English-Jobs-New/index.html',   /* C4 第 7-2 題：四年級首頁〔💼 職業單字網站 ↗〕（那個網站不動） */
    units: [{ ic: '👪', t: 'Unit 1　Who’s he?', f: 'u1.html', tabs: ['Who’s he/she?', 'He’s/She’s my ___.'] },
            { ic: '💼', t: 'Unit 2　Is he a doctor?', f: 'u2.html', tabs: ['He/She is a ___.', 'Yes／No'] }],
    more: [{ ic: '👪', t: '家人：單字結構', from: 'words/parts.html' },
           { ic: '👪', t: '家人：單字故事', from: 'words/why.html' },
           { ic: '💼', t: '職業：單字結構', from: 'words/jobs-parts.html' },
           { ic: '💼', t: '職業：單字故事', from: 'words/jobs-why.html' }] }
];
/* 每一個主題：k ＝〔🔒 開關〕代號、href ＝ 首頁的連結、grp ＝ 老師看板的分組、t ＝ 名字 */
function topics(S) {
  const g = S.out === 'g3-review' ? 3 : 4, P = 'g' + g + 'rv_', out = [];
  const G = require(path.join(__dirname, '..', S.src, '_game_data'));
  S.units.forEach((u, n) => { const un = 'u' + (n + 1), grp = '📖 ' + u.t.replace(/　.*/, '');
    [['#t0-0', '🌱 基礎句型 ①'], ['#t0-1', '⭐ 進階句型 ①'], ['#t1-0', '🌱 基礎句型 ②'], ['#t1-1', '⭐ 進階句型 ②'], ['#t2', '🔀 中英語序動畫'], ['#t3', '✂️ 縮寫動畫'], ['#t4', '💬 一問一答']]   /* 2026-10-16 C 組：加一問一答（接在最後，舊的〔🔒 開關〕代號不變） */
      .forEach(x => out.push({ k: P + un + '-' + x[0].slice(1), href: u.f + x[0], grp, t: x[1] })); });
  S.games.forEach(id => { const m = G.GAMES.filter(x => x.id === id)[0]; out.push({ k: P + 'gm-' + id, href: 'games.html#' + id, grp: '🎮 遊戲', t: m.ic + ' ' + m.name }); });
  /* 2026-10-16 C4 第 7 題：📘 Review 1（字卡、句型卡、遊戲各一個代號；遊戲 ＝ 20 種＋自己年級的進階，S.r1 ＝ 進階的代號） */
  if (S.r1) [['r1-w', 'r1/index.html', '🃏 Review 1 字卡'], ['r1-s', 'r1.html', '📖 Review 1 句型卡'], ['r1-g', 'r1/games.html', '🎮 Review 1 遊戲']]
    .forEach(x => out.push({ k: P + x[0], href: x[1], grp: '📘 Review 1', t: x[2] }));
  S.more.forEach(x => { const f = path.basename(x.from); out.push({ k: P + 'mo-' + f.replace(/\.html$/, ''), href: f, grp: '📚 補充', t: x.ic + ' ' + x.t }); });
  return out;
}
module.exports = { SITES, topics };
