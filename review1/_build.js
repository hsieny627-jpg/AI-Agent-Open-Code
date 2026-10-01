/* review1/_build.js — Review 1 物品／活動單字卡（三、四年級共用；使用者 2026-10-01 指定）
 *
 *   node review1/_build.js
 *
 * 樣板跟四年級單字卡同一套（words/_build.js 的 buildSet／tpl），只換掉三幕：
 *   ① 中文＋擬真圖示 ➜ ② 英文（母音紅、不發音灰、音節；片語每個字正下方中文＋圖示）＋字的結構
 *   ➜ ③ 放進句子（物品：I like ___.／活動：I like to ___.；to 下面不寫中文）
 * 出處：每個字自己的人氣證據（小圖表）＋ 字源／結構（有查證才放）＋ 這一組的共通出處（音標、音節、語音檔）。
 * 內容只改 _data.js；語音檔：TTS_MODELS=… node review1/_audio.js（改了字或句子才要）。
 */
const fs = require('fs'), path = require('path'), DIR = __dirname;
const { buildSet } = require('../words/_build');
const PH = require('../words/_phonics');
const { e, warn, ev } = require('../words/_sources');
const { RAW, WORDS } = require('./_data');

/* ── 音標：這一組自己的字加進 PH 的資料（檢查跟 RAW 一樣：字母接得回去、一個音節一個母音）── */
const DATA = Object.assign({}, PH.DATA);
Object.keys(RAW).forEach(w => { DATA[w] = PH.parse(w, RAW[w]); });
const words = s => s.toLowerCase().split(/\s+/);
WORDS.forEach(w => w.tk.forEach(t => words(t[0]).forEach(x => {
  if (!DATA[x]) throw new Error('review1：' + x + ' 沒有音標（_data.js 的 RAW）');
})));

/* ── 小工具 ── */
const flag = c => ({
  jp: '<svg class="r1fl" viewBox="0 0 30 20"><rect width="30" height="20" fill="#FFF"/><circle cx="15" cy="10" r="6" fill="#BC002D"/>' +
      '<rect width="30" height="20" fill="none" stroke="#555"/></svg>',
  tw: '<svg class="r1fl" viewBox="0 0 30 20"><rect width="30" height="20" fill="#FE0000"/><rect width="15" height="10" fill="#000095"/>' +
      '<g transform="translate(7.5,5)">' + Array.from({ length: 12 }, (_, k) =>
        '<path d="M0,-3.9L.75,-1.9L-.75,-1.9Z" fill="#FFF" transform="rotate(' + k * 30 + ')"/>').join('') +
      '<circle r="2" fill="#FFF" stroke="#000095" stroke-width=".35"/></g><rect width="30" height="20" fill="none" stroke="#555"/></svg>'
})[c];
const SENT = { i1: ['I', 'like'], i2: ['I', 'like'], a1: ['I', 'like', 'to'], a2: ['I', 'like', 'to'] };
const SZH = { I: ['我', '🙋'], like: ['喜歡', '❤️'], to: ['', ''] };
/* 一格：圖示／英文／中文（片語、句子都用）。t ＝ 這一課要學的字（音節動畫跑這幾格） */
const col = (t, tgt) => '<div class="c' + (tgt ? ' t' : '') + '" data-w="' + t[0] + '">' +
  '<div class="ic">' + (t[2] || '') + '</div><div class="w">{{' + t[0] + '}}</div><div class="z">' + (t[1] || '&nbsp;') + '</div></div>';

function scenes(w) {
  const one = w.tk.length === 1;
  const s1 = '<div class="emoji pop">' + w.ic + '</div><div class="zh in d1">' + w.zh + '</div>';
  const s2 = '<div class="tag in">英文</div>' + (one
    ? '<div class="emoji pop r1sm">' + w.ic + '</div><div class="word in d1 r1f" data-say="' + w.en + '">{{' + w.en + '}}</div>'
    : '<div class="r1ph r1f in d1" data-say="' + w.en + '">' + w.tk.map(t => col(t, 1)).join('') + '</div>') +
    (w.pt ? '<div class="sub in d2">' + w.pt + '</div>' : '');
  const sw = SENT[w.g].map(x => [x, SZH[x][0], SZH[x][1]]);
  const all = sw.concat(w.tk);
  const say = all.map(t => t[0]).join(' ') + '.';
  const s3 = '<div class="tag in">用在句子裡</div>' +
    '<div class="r1ph r1s r1f in d1" data-say="' + say + '">' +
    sw.map(t => col(t, 0)).join('') + w.tk.map((t, k) => col(t, 1) + (k === w.tk.length - 1 ? '<div class="c dot"><div class="ic"></div><div class="w">.</div><div class="z">&nbsp;</div></div>' : '')).join('') +
    '</div><div class="sub in d2">' + w.ex + '</div>';
  return '[' + [s1, s2, s3].map(h => 'function(){return ' + JSON.stringify(h) + '}').join(',') + ']';
}

/* ── 念一次：①唸這個字／片語；②③唸畫面上那一串，唸到哪一格那一格就放大變亮 ── */
const SAY = 'R1.say(i)';
const R1JS = `
var R1=(function(){
 function els(){var f=document.querySelector("#card .r1f");return f?[f,f.querySelectorAll(".c:not(.dot)")]:[null,[]]}
 function dur(t){var k=String(t).replace(/[\\u2019]/g,"'").replace(/\\s+/g," ").trim().toLowerCase(),a=window.ENAUD&&ENAUD[k];
  return a?a[1]*1000/(PH.isSlow()?.7:1):(500+String(t).length*(PH.isSlow()?120:75))}
 var tm=[];function clr(){while(tm.length)clearTimeout(tm.pop());
  [].forEach.call(document.querySelectorAll("#card .c.speak"),function(x){x.classList.remove("speak")})}
 function say(i){clr();var x=els(),f=x[0],cs=x[1];
  if(!f||i===0){PH.say(W.now);return}
  if(!cs.length){var p=f.querySelector(".phw");if(p)PH.sayWord(p);else PH.say(W.now);return}
  var t=f.getAttribute("data-say"),d=dur(t),n=[],tot=0,acc=0;
  [].forEach.call(cs,function(c){var L=c.getAttribute("data-w").length+1;n.push(L);tot+=L});
  PH.say(t);
  [].forEach.call(cs,function(c,k){tm.push(setTimeout(function(){
    [].forEach.call(cs,function(y){y.classList.remove("speak")});c.classList.add("speak")},120+acc));acc+=d*n[k]/tot});
  tm.push(setTimeout(clr,120+d+250))}
 /* ✂️ 音節：片語、句子 ＝ 這一課要學的那幾個字，一個一個剪 */
 document.addEventListener("click",function(e){var b=e.target.closest?e.target.closest("#phsyl"):null;if(!b)return;
  var f=document.querySelector("#card .r1f");if(!f)return;
  var ps=f.querySelectorAll(".c.t .phw");if(!ps.length)return;
  e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
  var t0=0;[].forEach.call(ps,function(p){setTimeout(function(){PH.syl(p,null)},t0);t0+=PH.sylTime(p)+3300});
 },true);
 /* 片語、句子放不下就整排一起縮小（不折行、不蓋到左右箭頭）；量的是字卡裡面真的能放字的寬度 */
 function fit(){var f=document.querySelector("#card .r1ph");if(!f)return;var c=document.getElementById("card"),cs=getComputedStyle(c),
  av=c.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),k=1;
  f.style.setProperty("--k",1);while(f.scrollWidth>av&&k>.4){k-=.04;f.style.setProperty("--k",k.toFixed(2))}}
 try{new MutationObserver(fit).observe(document.getElementById("card"),{childList:true})}catch(e){}
 window.addEventListener("resize",fit);
 return{say:say,fit:fit}})();`;

/* ── 出處 ── */
const chart = v => '<div class="r1c"><div class="r1who">' + flag(v.flag) + '<b>' + v.who + '</b></div>' +
  v.bars.map((b, k) => '<div class="r1bar" style="--p:' + b.p + '%;--d:' + (0.4 + k * 0.9) + 's"><div class="r1bl">' + b.l + '</div>' +
    '<div class="r1bt"><i></i></div><div class="r1bp">' + (b.txt || b.p + '%') + '</div></div>').join('') +
  (v.kids ? '<div class="r1kids">' + Array.from({ length: 10 }, (_, k) =>
    '<span class="' + (k < v.kids ? 'on' : '') + '" style="animation-delay:' + (1.4 + k * 0.12).toFixed(2) + 's">🧒</span>').join('') +
    '<em>差不多每 10 個' + (v.kw || '') + '就有 <b>' + v.kids + '</b> 個</em></div>' : '') + '</div>';
const eqv = q => '<div class="ev">' + q.map((x, k) => (k ? '<span class="ar" style="animation-delay:' + (k * 0.6 - 0.3).toFixed(1) + 's">' + (k === q.length - 1 ? '＝' : '＋') + '</span>' : '') +
  '<span class="st" style="animation-delay:' + (k * 0.6).toFixed(1) + 's"><span class="r1eqi">' + x[0] + '</span><b>' + (k === q.length - 1 ? '<span class="new">' + x[1] + '</span>' : x[1]) + '</b><em>' + x[2] + '</em></span>').join('') + '</div>';
const srcW = {};
WORDS.forEach(w => {
  srcW[w.f] = [ev(w.ev.t, w.ev.s, w.ev.d, chart(w.ev))].concat(w.et ? [ev(w.et.t, w.et.s, w.et.d, eqv(w.et.eq))] : []);
  w.src = [0, w.et ? 1 : 0, 0];
});
const COMMON = [
  e('音標（美式）', 'Cambridge Dictionary 各詞條的 US 發音', '本教材的 IPA 一律用<b>美式</b>。'),
  e('KK 音標', 'Kenyon &amp; Knott《A Pronouncing Dictionary of American English》(1944)', '台灣課本用的標法。'),
  e('音節怎麼切', 'Louisa Moats《Speech to Print》', '<b>一個出聲的母音 ＝ 一個音節</b>。合成字照零件切：<b>basket．ball</b>。'),
  warn('淺灰色的字母不算', '不出聲的字母（淺灰色）<b>不算母音</b>，數紅色的就對了。'),
  e('唸出來的聲音', 'Kokoro（神經語音，美式女聲 af_bella，Apache-2.0），預先做成語音檔',
    '每一個字、每一句都先做好。<b>不是真人錄音</b>；語音檔沒有的才用瀏覽器內建語音。')
];

/* ── 這一組的版面（放進 <head>）── */
const HEAD = `<script src="audio/aud.js" onerror="window.ENAUD=null"></script><script>window.ENDIR="audio/";</script>
<style>
.r1i{width:1em;height:1em;vertical-align:middle}
.emoji .r1i{width:1em;height:1em}
.r1sm{font-size:clamp(50px,9vh,84px)!important}
#toc .r1i{width:1.3em;height:1.3em}
/* 片語、句子：一格一個字，圖示在上、英文在中、中文在下（對齊） */
.r1ph{--k:1;display:flex;align-items:flex-end;justify-content:center;gap:clamp(10px,2vw,26px);flex-wrap:nowrap}
.r1ph .phw{flex-wrap:nowrap}
.r1ph .c{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:clamp(2px,.6vh,8px);transition:transform .15s}
.r1ph .ic{font-size:calc(clamp(34px,6.4vh,62px)*var(--k));line-height:1.1;min-height:1.1em}
.r1ph .w{font-size:calc(clamp(44px,min(9vh,9.5vw),92px)*var(--k));font-weight:700;line-height:1.05;white-space:nowrap}
.r1ph .z{font-size:calc(clamp(22px,3.6vh,36px)*var(--k));color:#D8D3C5;font-weight:700;white-space:nowrap}
.r1ph.r1s .w{font-size:calc(clamp(36px,min(7.4vh,7.6vw),76px)*var(--k))}
.r1ph.r1s .ic{font-size:calc(clamp(28px,5.2vh,52px)*var(--k))}
.r1ph .c.dot{margin-left:calc(-.75*clamp(10px,2vw,26px))}
#stage{max-width:980px}
.r1ph .c.speak{transform:scale(1.12)}
.r1ph .c.speak .z{color:#FFD24A}
.r1ph .c.speak .phw .g i,.r1ph .c.speak .phw .g i.v{color:#FFD24A!important;text-shadow:0 0 16px rgba(255,210,74,.8)}
/* 出處的小圖表 */
#src .r1c{display:flex;flex-direction:column;gap:clamp(4px,1vh,10px);width:min(100%,760px)}
#src .r1who{display:flex;align-items:center;gap:12px;font-size:clamp(20px,3.2vh,30px);color:#F2F2F2}
#src .r1fl{height:1.1em;width:auto;border-radius:3px}
#src .r1bar{display:grid;grid-template-columns:1fr auto;grid-template-areas:"l p" "t t";gap:4px 14px;align-items:end}
#src .r1bl{grid-area:l;font-size:clamp(18px,2.6vh,27px);color:#D8D3C5}
#src .r1bl b{color:#FFD24A}
#src .r1bp{grid-area:p;font-size:clamp(24px,4vh,44px);line-height:1;font-weight:700;color:#FFD24A;opacity:0;animation:srcIn .5s ease calc(var(--d) + 1s) both}
#src .r1bt{grid-area:t;height:clamp(16px,2.6vh,26px);background:#1A1A1A;border:1px solid #333;border-radius:99px;overflow:hidden}
#src .r1bt i{display:block;height:100%;width:0;background:linear-gradient(90deg,#C9962B,#FFD24A);border-radius:99px;
 animation:r1grow 1.1s cubic-bezier(.3,.9,.3,1) var(--d) forwards}
@keyframes r1grow{to{width:var(--p)}}
#src .r1kids{display:flex;align-items:center;flex-wrap:wrap;gap:2px;font-size:clamp(22px,3.4vh,38px)}
#src .r1kids span{opacity:0;filter:grayscale(1) brightness(.35);animation:srcIn .35s ease both}
#src .r1kids span.on{filter:none}
#src .r1kids em{font-style:normal;font-size:clamp(18px,2.8vh,26px);color:#D8D3C5;margin-left:10px}
#src .r1kids em b{color:#FFD24A}
#src .ev .st em{font-size:clamp(16px,2.4vh,22px);color:#B8B8B8}
#src .r1eqi{font-size:clamp(34px,6vh,58px);line-height:1.1}
#src .r1eqi .r1i{width:1em;height:1em}
.reduce #src .r1bt i{width:var(--p)}
</style>`;

/* PH 的發音：英文先查這一組的語音檔（ENAUD），查不到才用瀏覽器語音。
   只改這一組的產物（不動 words/_phonics.js，其他網站逐位元組不變）；找不到要換的那一段 build 就失敗 */
const PATCH = [
  ['var A=(lang&&/^sv/i.test(lang)&&window.SVAUD)?SVAUD[akey(t)]:null;',
   'var EN=!(lang&&!/^en/i.test(lang))&&window.ENAUD,A=(lang&&/^sv/i.test(lang)&&window.SVAUD)?SVAUD[akey(t)]:(EN?ENAUD[akey(t)]:null);'],
  ['AU.src=(window.SVDIR||"audio/sv/")+A[0];', 'AU.src=(EN?(window.ENDIR||"audio/"):(window.SVDIR||"audio/sv/"))+A[0];'],
  ['var D=' + JSON.stringify(PH.DATA) + ';', 'var D=' + JSON.stringify(DATA) + ';']
];

function build(list) {
  list.forEach(w => { w.now = w.en; w.icon = w.ic; w.scenes = scenes(w); w.say = SAY; });
  const WL = buildSet(list, { dir: DIR, font: '../words/fonts/', home: '../index.html', srcW, common: COMMON,
    title: 'Review 1 單字卡', head: HEAD, topic: '🃏 Review 1 單字卡' });
  WL.forEach(w => {
    const fp = path.join(DIR, w.f + '.html');
    let h = fs.readFileSync(fp, 'utf8');
    PATCH.forEach(([a, b]) => { if (h.split(a).length !== 2) throw new Error('review1：PH 的程式變了，找不到 ' + a.slice(0, 40)); h = h.replace(a, b); });
    h = h.replace('<script>\n', '<script>\n' + '').replace('\nvar W={', R1JS + '\nvar W={');
    if (!/var R1=/.test(h)) throw new Error('review1：R1 沒有放進去');
    fs.writeFileSync(fp, h, 'utf8');
  });
  return WL;
}
module.exports = { WORDS, build, scenes };
if (require.main === module) {
  const WL = build(WORDS);
  console.log('review1：' + WL.length + ' 張字卡');
}
