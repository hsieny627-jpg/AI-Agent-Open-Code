/* review1/_because_review.js — because 句子的大字審查網頁（2026-10-11 B 組 Q8：分 4 批給使用者看，每句有編號）
 * node review1/_because_review.js ➜ listen/2026-10-11_B/index.html
 * 句子 ＝ review1/_because.js；字、中文、圖示 ＝ 三年級 SUB.like／SUB.liketo（課本）＋ review1/_data.js（物品、活動）。
 * ★ ＝ 這個字不在劍橋兒童英檢官方字表（Pre A1 Starters／A1 Movers／A2 Flyers, 2018）裡：比較難，但是更道地、更能說出心裡的話（使用者 2026-10-11：可以多用）。
 */
const fs = require('fs'), path = require('path');
const B = require('./_because'), { WORDS } = require('./_data'), G3 = require('../G3 - L1 + L2/_data');
/* 2026-10-11 打開劍橋字表（https://www.cambridgeenglish.org/pl/Images/149681-yle-flyers-word-list.pdf）逐字比對，查不到的字 */
const STAR = 'air bake battle beat bones bubbles calm case cheer chef chew code collection confident creamy creative crispy crunchy curious cute decorate detective energy feelings fizzy focus free fresh friendly gifts healthy hearts hugs imagination imagine ink juicy level lonely loyal nature neighbors packs patient pearls programmer proud relax relaxing rules scientist share shot smarter solve spicy tickle toppings trade treat trick useful yummy'.split(' ');
const icOf = {}, zhOf = {};
[...G3.SUB.like.basic, ...G3.SUB.like.adv, ...G3.SUB.liketo.basic, ...G3.SUB.liketo.adv].forEach(x => { icOf[x[0]] = x[2]; zhOf[x[0]] = x[1]; });
WORDS.forEach(w => { if (!icOf[w.en]) { icOf[w.en] = w.ic; zhOf[w.en] = w.zh.replace(/ /g, ''); } });
const tb = new Set([...G3.SUB.like.basic, ...G3.SUB.like.adv, ...G3.SUB.liketo.basic, ...G3.SUB.liketo.adv].map(x => x[0]));
const grp = g => WORDS.filter(w => w.g === g && !tb.has(w.en)).map(w => w.en).filter((x, n, a) => a.indexOf(x) === n);
const BATCH = [
  ['📘 課本', [...G3.SUB.like.basic, ...G3.SUB.like.adv].map(x => ['T', x[0]]).concat([...G3.SUB.liketo.basic, ...G3.SUB.liketo.adv].map(x => ['A', x[0]]))],
  ['🍟 物品 1', grp('i1').map(x => ['T', x])],
  ['🎮 物品 2', grp('i2').map(x => ['T', x])],
  ['⛹️ 活動', grp('a1').concat(grp('a2')).map(x => ['A', x])]
];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const star = s => esc(s).replace(/[A-Za-z]+/g, w => STAR.indexOf(w.toLowerCase()) >= 0 ? '<u>' + w + '</u><sup>★</sup>' : w).replace(/’/g, '<b class="ap">’</b>');
let n = 0, total = 0;
const sec = BATCH.map(([nm, L], b) => {
  const h = L.map(([t, w]) => {
    const S = (t === 'T' ? B.THING : B.ACT)[w];
    if (!S) throw new Error('沒有 because 句子：' + w);
    const head = (t === 'T' ? 'I like ' : 'I like to ') + w + ' because …';
    return '<section class="wd"><h3><span class="ic">' + icOf[w] + '</span>' + esc(head) + '<small>我喜歡' + zhOf[w] + '，因為……</small></h3><ol>' +
      S.map(s => { n++; return '<li value="' + n + '"><span class="no">' + n + '</span><span class="en">' + star(s[0]) + '</span><span class="zh">' + esc(s[1]) + '</span></li>'; }).join('') + '</ol></section>';
  }).join('');
  total += L.length;
  return '<div class="pg" id="b' + b + '"' + (b ? ' hidden' : '') + '><p class="cnt">' + nm + '：' + L.length + ' 個字</p>' + h + '</div>';
}).join('');
const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>because 句子審查</title><style>
@font-face{font-family:Andika;src:url(../../words/fonts/andika-400.woff2) format('woff2');font-weight:400}
@font-face{font-family:Andika;src:url(../../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark}
body{margin:0;background:#05070A;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 60px}
header{position:sticky;top:0;background:#05070A;padding:12px 0 10px;z-index:2;border-bottom:2px solid #24303C}
h1{font-size:30px;margin:0 0 6px;color:#FFD54A}
.how{font-size:22px;line-height:1.5;margin:0 0 10px;color:#E6EDF3}
.tabs{display:flex;gap:10px;flex-wrap:wrap}
.tabs button{font:inherit;font-size:24px;font-weight:700;min-height:56px;padding:4px 20px;border-radius:999px;border:3px solid #3A4650;background:#101820;color:#CFD8E0}
.tabs button.on{border-color:#FFD54A;background:#2C3A48;color:#fff}
.cnt{font-size:22px;color:#B9C4CE}
.wd{border:2px solid #24303C;border-radius:20px;margin:18px 0;padding:10px 16px;background:#0B0F14}
h3{font-size:32px;margin:4px 0 8px;display:flex;flex-wrap:wrap;align-items:center;gap:12px}
h3 .ic{font-size:44px;line-height:1}
h3 .ic svg,h3 .ic img{width:1em;height:1em}
h3 small{font-size:24px;color:#B9C4CE;font-weight:400}
ol{list-style:none;margin:0;padding:0}
li{display:grid;grid-template-columns:72px 1fr;column-gap:12px;padding:8px 0;border-top:1px solid #1C252E}
.no{grid-row:span 2;font-size:26px;font-weight:700;color:#05070A;background:#FFD54A;border-radius:14px;text-align:center;align-self:start;padding:4px 0}
.en{font-size:34px;font-weight:700;line-height:1.25}
.zh{font-size:26px;color:#C8D2DA}
sup{color:#FFB74D;font-size:.55em}
u{text-decoration-color:#FFB74D;text-underline-offset:4px}
.ap{color:#FF5A5A}
</style></head><body>
<header><h1>because 句子審查（${total} 個字、${n} 句）</h1>
<p class="how">要改哪一句，回覆「第 ○ 句改成……」就好。<u>底線</u><sup>★</sup> ＝ 劍橋兒童英檢字表裡沒有的字（比較難，但更道地）。</p>
<nav class="tabs">${BATCH.map((b, k) => '<button data-b="' + k + '"' + (k ? '' : ' class="on"') + '>' + b[0] + '</button>').join('')}</nav></header>
${sec}
<script>
document.querySelector('.tabs').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  [].forEach.call(document.querySelectorAll('.tabs button'),function(x){x.classList.toggle('on',x===b)});
  [].forEach.call(document.querySelectorAll('.pg'),function(p,k){p.hidden=k!==+b.getAttribute('data-b')});scrollTo(0,0)});
</script></body></html>`;
const out = path.join(__dirname, '..', 'listen', '2026-10-11_B');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('because 審查頁：listen/2026-10-11_B/index.html（' + total + ' 個字、' + n + ' 句）');
