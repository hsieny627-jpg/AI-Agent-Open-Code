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
const { RAW, PLAIN, WORDS } = require('./_data');

/* ── 音標：這一組自己的字加進 PH 的資料（檢查跟 RAW 一樣：字母接得回去、一個音節一個母音）── */
const DATA = Object.assign({}, PH.DATA);
Object.keys(RAW).forEach(w => { DATA[w] = PH.parse(w, RAW[w]); });
const words = s => s.toLowerCase().split(/\s+/);
WORDS.forEach(w => w.tk.forEach(t => t[0].split(/\s+/).forEach(x => {
  if (!DATA[x.toLowerCase()] && PLAIN.indexOf(x) < 0) throw new Error('review1：' + x + ' 沒有音標（_data.js 的 RAW）');
})));

/* ── 小工具 ── */
const FL = {
  jp: '<rect width="30" height="20" fill="#FFF"/><circle cx="15" cy="10" r="6" fill="#BC002D"/>',
  tw: '<rect width="30" height="20" fill="#FE0000"/><rect width="15" height="10" fill="#000095"/>' +
      '<g transform="translate(7.5,5)">' + Array.from({ length: 12 }, (_, k) =>
        '<path d="M0,-3.9L.75,-1.9L-.75,-1.9Z" fill="#FFF" transform="rotate(' + k * 30 + ')"/>').join('') +
      '<circle r="2" fill="#FFF" stroke="#000095" stroke-width=".35"/></g>',
  /* 韓國：太極（上紅下藍）＋四角的卦（簡化成三條槓） */
  kr: '<rect width="30" height="20" fill="#FFF"/><g transform="translate(15,10) rotate(33.7)"><path d="M-5,0A5,5 0 0 1 5,0A2.5,2.5 0 0 1 0,0A2.5,2.5 0 0 0 -5,0Z" fill="#CD2E3A"/>' +
      '<path d="M5,0A5,5 0 0 1 -5,0A2.5,2.5 0 0 1 0,0A2.5,2.5 0 0 0 5,0Z" fill="#0047A0"/></g>' +
      [[5.2, 4.2, 56], [24.8, 4.2, -56], [5.2, 15.8, -56], [24.8, 15.8, 56]].map(([x, y, r]) =>
        '<g transform="translate(' + x + ',' + y + ') rotate(' + r + ')"><rect x="-2.6" y="-2" width="5.2" height=".8"/><rect x="-2.6" y="-.4" width="5.2" height=".8"/><rect x="-2.6" y="1.2" width="5.2" height=".8"/></g>').join(''),
  /* 美國：13 條紋＋藍底（星星簡化成白點） */
  us: Array.from({ length: 13 }, (_, k) => '<rect y="' + (k * 20 / 13).toFixed(2) + '" width="30" height="' + (20 / 13).toFixed(2) + '" fill="' + (k % 2 ? '#FFF' : '#B22234') + '"/>').join('') +
      '<rect width="12" height="10.77" fill="#3C3B6E"/>' + Array.from({ length: 20 }, (_, k) =>
        '<circle cx="' + (1.4 + (k % 5) * 2.3).toFixed(1) + '" cy="' + (1.4 + Math.floor(k / 5) * 2.6).toFixed(1) + '" r=".55" fill="#FFF"/>').join(''),
  gb: '<rect width="30" height="20" fill="#012169"/><path d="M0,0L30,20M30,0L0,20" stroke="#FFF" stroke-width="4"/>' +
      '<path d="M0,0L30,20M30,0L0,20" stroke="#C8102E" stroke-width="1.6"/>' +
      '<path d="M15,0V20M0,10H30" stroke="#FFF" stroke-width="6"/><path d="M15,0V20M0,10H30" stroke="#C8102E" stroke-width="3.4"/>'
};
const flag = c => '<svg class="r1fl" viewBox="0 0 30 20" aria-hidden="true">' + FL[c] + '<rect width="30" height="20" fill="none" stroke="#555"/></svg>';
const SENT = { i1: ['I', 'like'], i2: ['I', 'like'], a1: ['I', 'like', 'to'], a2: ['I', 'like', 'to'] };
const SZH = { I: ['我', '🙋'], like: ['喜歡', '❤️'], to: ['', ''] };
/* 一格：圖示／英文／中文（片語、句子都用）。t ＝ 這一課要學的字（音節動畫跑這幾格） */
/* 句點緊接最後一個字母（2026-10-02）：句點掛在那一格英文的右邊，中文還是對齊單字正中間 */
const col = (t, tgt, dot) => '<div class="c sw' + (tgt ? ' t' : '') + '" data-w="' + t[0] + '">' +
  '<div class="ic">' + (t[2] || '') + '</div><div class="w">{{' + t[0] + '}}' + (dot ? '<span class="pdot">.</span>' : '') +
  '</div><div class="z">' + (t[1] || '&nbsp;') + '</div></div>';

function scenes(w) {
  const one = w.tk.length === 1;
  const s1 = '<div class="emoji pop">' + w.ic + '</div><div class="zh in d1">' + w.zh + '</div>';
  const s2 = '<div class="tag in">英文</div>' + (one
    ? '<div class="emoji pop r1sm">' + w.ic + '</div><div class="word in d1 r1f">{{' + w.en + '}}</div>'
    : '<div class="r1ph r1f in d1" data-sent="' + w.en + '">' + w.tk.map(t => col(t, 1)).join('') + '</div>') +
    (w.pt ? '<div class="sub in d2">' + w.pt + '</div>' : '');
  const sw = SENT[w.g].map(x => [x, SZH[x][0], SZH[x][1]]);
  const all = sw.concat(w.tk);
  const say = all.map(t => t[0]).join(' ') + '.';
  const s3 = '<div class="tag in">用在句子裡</div>' +
    '<div class="r1ph r1s r1f in d1" data-sent="' + say + '">' +
    sw.map(t => col(t, 0)).join('') + w.tk.map((t, k) => col(t, 1, k === w.tk.length - 1)).join('') +
    '</div><div class="sub in d2">' + w.ex + '</div>';
  return '[' + [s1, s2, s3].map(h => 'function(){return ' + JSON.stringify(h) + '}').join(',') + ']';
}

/* ── 念一次：①唸這個字／片語；②③唸畫面上那一串，唸到哪一格那一格就放大變亮 ── */
const SAY = 'R1.say(i)';
const R1JS = `
var R1=(function(){
 /* 念：幕① 唸這個字／片語；片語、句子交給 SENT（唸到哪一格那一格亮，唸完句點動一下） */
 function say(i){var f=document.querySelector("#card .r1f");
  if(!f||i===0){PH.say(W.now);return}
  if(f.hasAttribute("data-sent")){SENT.play(f);return}
  var p=f.querySelector(".phw");if(p)PH.sayWord(p);else PH.say(W.now)}
 /* ✂️ 音節：片語、句子 ＝ 這一課要學的那幾個字，一個一個剪 */
 document.addEventListener("click",function(e){var b=e.target.closest?e.target.closest("#phsyl"):null;if(!b)return;
  var f=document.querySelector("#card .r1f");if(!f)return;
  var ps=f.querySelectorAll(".c.t .phw");if(!ps.length)return;
  e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
  var t0=0;[].forEach.call(ps,function(p){setTimeout(function(){PH.syl(p,null)},t0);t0+=PH.sylTime(p)+3300});
 },true);
 /* 片語、句子放不下就整排一起縮小（不折行、不蓋到左右箭頭）；量的是字卡裡面真的能放字的寬度，留 4% 給「唸到哪一格放大」 */
 function fit(){var f=document.querySelector("#card .r1ph");if(!f)return;var c=document.getElementById("card"),cs=getComputedStyle(c),
  av=c.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),k=1;
  f.style.setProperty("--k",1);while(f.scrollWidth>av*.96&&k>.4){k-=.03;f.style.setProperty("--k",k.toFixed(2))}}
 try{new MutationObserver(fit).observe(document.getElementById("card"),{childList:true})}catch(e){}
 window.addEventListener("resize",fit);
 return{say:say,fit:fit}})();`;

/* ── 出處 ── */
const MED = n => n === 1 ? '🥇' : n === 2 ? '🥈' : n === 3 ? '🥉' : '🏅';
const row = (b, k) => {
  const d = (0.4 + k * 0.9).toFixed(1) + 's';
  if (b.rk) return '<div class="r1rk" style="--d:' + d + '"><span class="r1md">' + MED(b.rk) + '</span><span class="r1rn">第 <b>' + b.rk + '</b> 名</span><span class="r1bl">' + b.l + '</span></div>';
  if (b.tp) return '<div class="r1rk r1tp" style="--d:' + d + '"><span class="r1md">👩‍🏫</span><span class="r1bl">' + b.l + '</span></div>';
  if (b.tx) return '<div class="r1rk r1tx" style="--d:' + d + '"><span class="r1md">' + (b.ic || '📌') + '</span><span class="r1bl">' + b.tx + '</span></div>';
  return '<div class="r1bar" style="--p:' + Math.min(b.p, 100) + '%;--d:' + d + '"><div class="r1bl">' + b.l + '</div>' +
    '<div class="r1bt"><i></i></div><div class="r1bp">' + (b.txt || b.p + '%') + '</div></div>';
};
const chart = v => '<div class="r1c"><div class="r1who">' + (v.flag ? flag(v.flag) : '📚') + '<b>' + v.who + '</b></div>' + v.bars.map(row).join('') +
  (v.kids && v.bars.length <= 2 ? '<div class="r1kids">' + Array.from({ length: 10 }, (_, k) =>
    '<span class="' + (k < v.kids ? 'on' : '') + '" style="animation-delay:' + (1.4 + k * 0.12).toFixed(2) + 's">🧒</span>').join('') +
    '<em>差不多每 10 個' + (v.kw || '') + '就有 <b>' + v.kids + '</b> 個</em></div>' : '') + '</div>';
const eqv = (q, ch) => '<div class="ev">' + q.map((x, k) => (k ? '<span class="ar" style="animation-delay:' + (k * 0.6 - 0.3).toFixed(1) + 's">' + (ch ? '➜' : k === q.length - 1 ? '＝' : '＋') + '</span>' : '') +
  '<span class="st" style="animation-delay:' + (k * 0.6).toFixed(1) + 's"><span class="r1eqi">' + x[0] + '</span><b>' + (k === q.length - 1 ? '<span class="new">' + x[1] + '</span>' : x[1]) + '</b><em>' + x[2] + '</em></span>').join('') + '</div>';
const srcW = {};
WORDS.forEach(w => {
  srcW[w.f] = [ev(w.ev.t, w.ev.s, w.ev.d, chart(w.ev))].concat(w.et ? [ev(w.et.t, w.et.s, w.et.d, eqv(w.et.eq, w.et.ch))] : []);
  w.src = [0, w.et ? 1 : 0, 0];
});
const COMMON = [
  e('音標（美式）', 'Cambridge Dictionary 各詞條的 US 發音', '本教材的 IPA 一律用<b>美式</b>。'),
  e('KK 音標', 'Kenyon &amp; Knott《A Pronouncing Dictionary of American English》(1944)', '台灣課本用的標法。'),
  e('音節怎麼切', '本教材的切法（老師指定，2026-10-02）；對照 Merriam-Webster、Cambridge Dictionary',
    '<b>一個出聲的母音 ＝ 一個音節</b>。兩個母音中間只有<b>一個子音的聲音</b>（ck、ll、tt 也只唸一個）➜ 搬到後面：<b>sti．ckers</b>；有兩個子音的聲音 ➜ 從中間切：<b>bas．ket．ball</b>。'),
  warn('辭典寫 stick·er 也對', 'Merriam-Webster 寫 <b>stick·er</b>、Cambridge 標 <b>/ˈstɪk.ɚ/</b>：那是辭典的切法。本教材教的是<b>一個子音聲跟著後面的母音</b>，切法不同，都不是錯。'),
  warn('品牌名和縮寫', 'Minecraft、Splatoon、Beyblade 辭典沒有收：照組成的英文字標音（mine＋craft）。Roblox、Mario 照維基百科的標音。<b>TV、TCG</b> 是一個字母一個字母唸的縮寫，<b>不標母音顏色和音標</b>。'),
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
.r1ph{--k:1;display:flex;align-items:flex-end;justify-content:center;gap:calc(clamp(10px,2vw,26px)*var(--k)*var(--k));flex-wrap:nowrap}
.r1ph .phw{flex-wrap:nowrap}
.r1ph .c{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:clamp(2px,.6vh,8px);transition:transform .15s}
.r1ph .ic{font-size:calc(clamp(34px,6.4vh,62px)*var(--k));line-height:1.1;min-height:1.1em}
.r1ph .w{font-size:calc(clamp(44px,min(9vh,9.5vw),92px)*var(--k));font-weight:700;line-height:1.05;white-space:nowrap}
.r1ph .z{font-size:calc(clamp(22px,3.6vh,36px)*var(--k));color:#D8D3C5;font-weight:700;white-space:nowrap}
.r1ph.r1s .w{font-size:calc(clamp(36px,min(7.4vh,7.6vw),76px)*var(--k))}
.r1ph.r1s .ic{font-size:calc(clamp(28px,5.2vh,52px)*var(--k))}
.r1ph .w{position:relative}
.r1ph .w .pdot{position:absolute;left:100%;bottom:0;margin-left:-.17em;line-height:1.05}
#stage{max-width:980px}
/* 唸到哪一格：整格（圖示、英文、中文）稍微放大、稍微變亮（樣式在 words/_build.js 的 #card .speak） */
/* 出處的小圖表 */
#src .r1c{display:flex;flex-direction:column;gap:clamp(3px,.8vh,8px);width:min(100%,760px)}
#src .r1who{display:flex;align-items:center;gap:12px;font-size:clamp(20px,3.2vh,30px);color:#F2F2F2}
#src .r1fl{height:1.1em;width:auto;border-radius:3px}
#src .r1bar{display:grid;grid-template-columns:1fr auto;grid-template-areas:"l p" "t t";gap:4px 14px;align-items:end}
#src .r1bl{grid-area:l;font-size:clamp(18px,2.6vh,27px);color:#D8D3C5}
#src .r1bl b{color:#FFD24A}
#src .r1bp{grid-area:p;font-size:clamp(24px,4vh,44px);line-height:1;font-weight:700;color:#FFD24A;opacity:0;animation:srcIn .5s ease calc(var(--d) + 1s) both}
#src .r1bt{grid-area:t;height:clamp(12px,2vh,22px);background:#1A1A1A;border:1px solid #333;border-radius:99px;overflow:hidden}
#src .r1bt i{display:block;height:100%;width:0;background:linear-gradient(90deg,#C9962B,#FFD24A);border-radius:99px;
 animation:r1grow 1.1s cubic-bezier(.3,.9,.3,1) var(--d) forwards}
@keyframes r1grow{to{width:var(--p)}}
#src .r1kids{display:flex;align-items:center;flex-wrap:wrap;gap:2px;font-size:clamp(22px,3.4vh,38px)}
#src .r1kids span{opacity:0;filter:grayscale(1) brightness(.35);animation:srcIn .35s ease both}
#src .r1kids span.on{filter:none}
#src .r1kids em{font-style:normal;font-size:clamp(18px,2.8vh,26px);color:#D8D3C5;margin-left:10px}
#src .r1kids em b{color:#FFD24A}
/* 第幾名／老師選的字／一句話：一列一件事，一列一列跳出來 */
#src .r1rk{display:flex;align-items:center;gap:10px;line-height:1.25;opacity:0;animation:srcIn .5s cubic-bezier(.2,1.4,.4,1) var(--d) both;
 background:#141414;border:1px solid #2E2E2E;border-radius:14px;padding:3px 12px}
#src .r1md{font-size:clamp(24px,4vh,40px);line-height:1}
#src .r1rn{font-size:clamp(18px,2.8vh,28px);color:#D8D3C5;white-space:nowrap}
#src .r1rn b{font-size:1.5em;color:#FFD24A}
#src .r1rk .r1bl{font-size:clamp(17px,2.5vh,25px);color:#D8D3C5;line-height:1.35}
#src .r1rk .r1bl b{color:#FFD24A}
#src .r1tp{border-color:#9FB4C8}
#src .ev .st em{font-size:clamp(16px,2.4vh,22px);color:#B8B8B8}
#src .r1eqi{font-size:clamp(34px,6vh,58px);line-height:1.1}
#src .r1eqi .r1i{width:1em;height:1em}
#src .r1eqi .flag{width:1.3em;height:auto;vertical-align:middle}
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
/* ── 🔤 單字首頁（review1/index.html）：四組，按了才展開 ── */
const GROUP = [['i1', '🍟', '物品 1', '美食、零食、飲料、玩具'], ['i2', '🎮', '物品 2', '3C、電玩、球類、書和漫畫、生活愛用品'],
  ['a1', '⛹️', '活動 1', '球類運動、個人運動、才藝、戶外玩耍'], ['a2', '🎧', '活動 2', '3C 和電玩、競賽、靜態活動、家裡的活動、假日出遊']];
function index(list) {
  const { indexHTML } = require('../words/_section');
  let h = indexHTML({ title: '🃏 Review 1 單字卡', sub: 'I like ___.　I like to ___.', font: '../words/fonts/', home: '../index.html',
    links: GROUP.map(([g, ic, t, d]) => { const L = list.filter(w => w.g === g);
      return { ic, t: t + '（' + L.length + ' 個）', d: (g[0] === 'i' ? 'I like ___.　' : 'I like to ___.　') + d,
        cards: L.map(w => ({ f: w.en, zh: w.zh, icon: w.ic, href: w.f + '.html' })) }; }) });
  /* 自己畫的圖示跟著字級走；三、四年級共用 ➜ 首頁按鈕是總首頁 */
  h = h.replace('</style>', '.r1i{width:1em;height:1em;vertical-align:middle}\n.card .ic .r1i{width:1.1em;height:1.1em}\n</style>')
    .replace('🏠 首頁</a>', '🏠 總首頁</a>');
  fs.writeFileSync(path.join(DIR, 'index.html'), h, 'utf8');
}
if (require.main === module) {
  const WL = build(WORDS);
  index(WORDS);
  console.log('review1：' + WL.length + ' 張字卡 ＋ 單字首頁');
}
