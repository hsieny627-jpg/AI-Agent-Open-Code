/* words/_grades.js — 三年級、四年級「要學什麼、去哪裡」的唯一真相來源（使用者 2026-10-03 指定）
 *
 * 總首頁（words/_build_hub.js）和兩個年級首頁（sentences/_build_home.js、G3 - L1 + L2/_build_home.js）都從這裡畫，
 * 順序一律是（2026-10-07 使用者第 11 點）：(1) Unit 1 (2) Unit 2 (3) Review 1 (4) 句型環遊世界 (5) 縮寫動畫 (6) 比較
 *   (7) 暖身題 (8) 複習遊戲 (9) 三(四)年級複習。縮寫動畫、比較兩個年級內容一樣（g34/_data.js），各自一頁。
 * 三年級在上面、四年級在下面。href 一律相對於專案根目錄；rows(年級, 前綴) 會把前綴接上去。
 * 其他頁（時光機、家庭樹、單字結構、單字故事、1066……）收在各年級的「單字首頁」裡，首頁不再放（2026-10-03 Q8）。
 */
const NAMETAG = require('../sentences/_nametag').TAG;
const G3D = 'G3%20-%20L1%20+%20L2/';
const GRADES = [
  { g: '三年級', home: G3D + 'index.html', rows: [
    { ic: NAMETAG, l: 'Unit 1　名字', s: 'What’s your name?', b: [
      { ic: '👀', t: '單字', href: G3D + 'sight/index.html' }, { ic: '💬', t: '句型', href: G3D + 'unit1.html' }] },
    { ic: '🎂', l: 'Unit 2　年齡', s: 'How old are you?', b: [
      { ic: '🔢', t: '單字', href: G3D + 'numbers/index.html' }, { ic: '💬', t: '句型', href: G3D + 'unit2.html' }] },
    { ic: '📝', l: 'Review 1', s: '介紹我自己', b: [
      { ic: '💬', t: '句型', href: G3D + 'review1.html' }, { ic: '🃏', t: '單字', href: 'review1/index.html' },
      { ic: '🕹️', t: '遊戲', href: 'review1/games.html' }] },
    { ic: '🌍', l: '句型環遊世界', b: [{ ic: '🌍', t: '別的國家怎麼說', href: G3D + 'sight/sight-world.html' }] },
    { ic: '⚡', l: '縮寫動畫', s: 'I am ＝ I’m', b: [{ ic: '⚡', t: '縮寫動畫', href: G3D + 'contract.html' }] },
    { ic: '⚖️', l: '比較', s: 'I am／You are', b: [{ ic: '⚖️', t: '比較', href: G3D + 'compare.html' }] },
    { ic: '🎯', l: '暖身題', b: [{ ic: '🎯', t: '暖身 24 題', href: G3D + 'warmup.html' }] },
    { ic: '🎮', l: '複習遊戲', b: [{ ic: '🎮', t: '10 種遊戲', href: G3D + 'games.html' }] },
    { ic: '🏠', l: '三年級複習', s: '在家複習', b: [{ ic: '🏠', t: '三年級複習', href: 'g3-review/index.html' }] }
  ] },
  { g: '四年級', home: 'sentences/index.html', rows: [
    { ic: '👪', l: 'Unit 1　家人', s: 'Who’s he?', b: [
      { ic: '🔤', t: '單字', href: 'words/index.html' }, { ic: '💬', t: '句型', href: 'sentences/unit1.html' }] },
    { ic: '💼', l: 'Unit 2　職業', s: 'Is he a doctor?', b: [
      { ic: '💼', t: '單字', href: 'words/jobs.html' }, { ic: '💬', t: '句型', href: 'sentences/unit2.html' }] },
    { ic: '📝', l: 'Review 1', s: 'About my family', b: [
      { ic: '💬', t: '句型', href: 'sentences/review1.html' }, { ic: '🃏', t: '單字', href: 'review1/index.html' },
      { ic: '🕹️', t: '遊戲', href: 'review1/games.html' }] },
    { ic: '🌍', l: '句型環遊世界', b: [{ ic: '🌍', t: '別的國家怎麼說', href: 'sentences/world.html' }] },
    { ic: '⚡', l: '縮寫動畫', s: 'I am ＝ I’m', b: [{ ic: '⚡', t: '縮寫動畫', href: 'sentences/contract.html' }] },
    { ic: '⚖️', l: '比較', s: 'I am／You are', b: [{ ic: '⚖️', t: '比較', href: 'sentences/compare.html' }] },
    { ic: '🎯', l: '暖身題', b: [{ ic: '🔤', t: '單字 20 題', href: 'words/quiz.html' }, { ic: '💬', t: '句型 22 題', href: 'sentences/warmup.html' }] },
    { ic: '🎮', l: '複習遊戲', b: [{ ic: '🎮', t: '10 種遊戲', href: 'sentences/games.html' }] },
    { ic: '🏠', l: '四年級複習', s: '在家複習', b: [{ ic: '🏠', t: '四年級複習', href: 'g4-review/index.html' }] }
  ] }
];

/* 一個年級畫成一張表：一列一件事，左邊是第幾項＋名稱，右邊是按鈕；寬螢幕兩欄，1～5 在左、6～9 在右（照順序往下讀） */
const CSS = `
.gr{width:100%;max-width:1100px;border:1px solid #1E1E1E;border-radius:18px;background:#060606;
 padding:clamp(6px,1.1vh,12px) clamp(10px,1.4vw,16px)}
.gr h2{margin:0 0 clamp(4px,.7vh,8px);font-size:clamp(20px,3.2vh,30px);color:#FFD66B;letter-spacing:.08em;display:flex;align-items:baseline;gap:12px}
.gr h2 a{font-size:clamp(12px,1.7vh,15px);color:#9FB4C8;text-decoration:none;letter-spacing:.04em;border-bottom:1px solid #2A3A48}
.gl{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:repeat(5,auto);grid-auto-flow:column;gap:clamp(5px,.8vh,9px) clamp(8px,1.2vw,14px)}
@media (max-width:860px){.gl{grid-template-columns:1fr;grid-template-rows:none;grid-auto-flow:row}}
.gi{display:flex;align-items:center;gap:clamp(8px,1vw,12px);background:#0C0C0C;border:1px solid #232323;border-radius:14px;
 padding:clamp(4px,.7vh,8px) clamp(8px,1vw,12px);min-height:clamp(46px,6.4vh,62px)}
.gi .gn{flex:0 0 auto;width:1.7em;height:1.7em;border-radius:50%;background:#1A2530;color:#9FB4C8;font-weight:700;
 display:flex;align-items:center;justify-content:center;font-size:clamp(13px,1.9vh,17px)}
.gi .gx{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:1px}
.gi .gx b{font-size:clamp(15px,2.3vh,21px);line-height:1.25}
.gi .gx b .gic{margin-right:6px}
.gi .gx b .gic svg{height:1em;width:auto;vertical-align:-.12em}
.gi .gx i{font-style:normal;font-size:clamp(11.5px,1.6vh,14px);color:#8E8E8E;white-space:nowrap}
.gi .gb{flex:0 0 auto;display:flex;gap:clamp(5px,.7vw,8px)}
.gi .gb a{display:flex;align-items:center;gap:5px;text-decoration:none;color:#F2F2F2;background:#18222B;border:1px solid #3A4A58;
 border-radius:99px;padding:clamp(6px,.9vh,9px) clamp(10px,1.3vw,15px);font-size:clamp(14px,2.1vh,18px);font-weight:700;white-space:nowrap;min-height:42px}
.gi .gb a:hover{border-color:#9FB4C8}
.gi .gb a:active{transform:scale(.97)}`;
function rows(G, pre) {
  pre = pre || '';
  return '<section class="gr"><h2>' + G.g + (G.home && pre !== null ? ' <a href="' + pre + G.home + '">年級首頁 ➜</a>' : '') + '</h2><div class="gl">' +
    G.rows.map((r, k) => '<div class="gi"><span class="gn">' + (k + 1) + '</span><span class="gx"><b><span class="gic">' + r.ic + '</span>' + r.l + '</b>' +
      (r.s ? '<i>' + r.s + '</i>' : '') + '</span><span class="gb">' +
      r.b.map(x => '<a href="' + (pre || '') + x.href + '">' + x.ic + ' ' + x.t + '</a>').join('') + '</span></div>').join('') +
    '</div></section>';
}
module.exports = { GRADES, CSS, rows };
