/* words/_build_story.js — 故事頁的產生器（why.html / why-2.html / why-more.html）
 *
 * 用法： node words/_build_story.js
 *
 * why.html      = 家人單字的故事①：開場 ＋ 前 9 個字（family…grandfather）
 * why-2.html    = 家人單字的故事②：開場 ＋ 後 8 個字（grandmother…wife）＋ 結尾
 * why-more.html = 附加補充：六個學生認識的日常單字
 *
 * 17 個單字的場景都在 FAM 陣列裡，兩頁用 slice 切開——改文案只改 FAM 一個地方。
 *
 * 這兩頁是「通則頁」，不是單字頁：可以講字的來源，但事實必須正確。
 * 17 個單字頁仍然維持三幕、不加演變幕（見 CLAUDE.md）。
 * 字母逐格變形永遠禁止——動畫動的是人、時間、聲音、零件，不是整個單字的拼法。
 */
const fs=require('fs'),path=require('path'),DIR=__dirname;

/* FAM[0]=開場、FAM[1..17]=17 個家人單字、FAM[18]=結尾 */
const FAM=[
 {emoji:'👨‍👩‍👧‍👦',mid:'每一個家人單字，都有自己的故事',
  lines:['為什麼長這樣？往前看一眼就知道']},

 {tag:'意思變窄了',emoji:'👨‍👩‍👧‍👦<span class="extra">👴🧑‍🌾🧹</span>',say:'family',
  h:'<div class="en in d1">family</div>',
  lines:['古羅馬的 <b>familia</b>，連住在一起的<b>僕人</b>都算',
         '（它不是 Father And Mother I Love You 拼出來的）']},

 {tag:'意思的根',emoji:'👨‍👩',say:'parent',
  h:'<div class="en in d1">parent</div>'+
    '<div class="emoji emerge" style="font-size:clamp(40px,7.4vh,66px)">👶</div>',
  lines:['老祖宗 <b>parens</b> 的意思是「<b>把孩子生下來的人</b>」',
         '一位是 a parent，很多位是 parents']},

 {tag:'寶寶先叫出來的',emoji:'👶',say:'mother',
  h:'<div class="en"><span class="bub b1">ma</span><span class="bub b2">ma</span><span class="bub b3">ma</span></div>'+
    '<div class="en pop" style="animation-delay:1.3s">mom</div>',
  lines:['全世界的寶寶，都先發得出 <b>ma</b> 這個音',
         '<b>mother</b> 的暱稱 <b>mom</b>，是從 momma 縮短來的']},

 {tag:'不是剪短來的',emoji:'👶',say:'father',
  h:'<div class="en"><span class="bub b1">da</span><span class="bub b2">da</span><span class="bub b3">da</span></div>'+
    '<div class="en pop" style="animation-delay:1.3s">dad</div>',
  lines:['<b>dad</b> 是寶寶自己先叫出來的','<b>不是</b>把 father 剪短的']},

 {tag:'失落的字母',emoji:'🧒👦',say:'brother',
  h:'<div class="en in d1"><span class="flag">þ</span> <span class="ar">就是</span> th</div>',
  lines:['以前英文有一個字母 <b>þ</b>，像一面小旗子',
         'brother 以前寫成 <b>brōþor</b>']},

 {tag:'兩個村子，兩種叫法',emoji:'🏘️👧🏘️',say:'sister',
  h:'<div class="en in d1" style="font-size:clamp(22px,4vh,38px)">'+
    '<span class="fromL">🏘️ sweostor</span> <span class="ar">＋</span> <span class="fromR">systir 🏘️</span></div>'+
    '<div class="en pop" style="animation-delay:1.2s">sister</div>',
  lines:['以前<b>兩個村子</b>，同一個人<b>叫法不一樣</b>',
         '住在一起久了，兩種叫法<b>合成一個字</b>']},

 {tag:'撞出一樣的聲音',emoji:'☀️👦',say:'son',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.8vh,46px)">'+
    '<span class="fromL">sun ☀️</span> <span class="ar">🔊</span> <span class="fromR">👦 son</span></div>',
  lines:['兩個字走的是<b>不同的路</b>','卻撞出<b>一樣的聲音</b>']},

 {tag:'聲音不見了',emoji:'👧',say:'daughter',
  h:'<div class="en in d1">dau<span class="mute">gh</span>ter</div>',
  lines:['以前 <b>gh</b> 是有聲音的','後來聲音不見了，<b>字母留下來</b>']},

 {tag:'借來的零件',emoji:'👴',say:'grandfather',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.8vh,48px)">'+
    '<span class="fromL hi">grand</span> <span class="ar">＋</span> <span class="fromR">father</span></div>'+
    '<div class="en pop" style="animation-delay:1.2s;font-size:clamp(26px,4.8vh,48px)">grandfather</div>',
  lines:['<b>grand</b> 是從法國借來的零件','接在家人前面，就變成<b>長一輩</b>']},

 {tag:'同一個零件，一直接',emoji:'👵',say:'grandmother',
  h:'<div class="en in d1" style="font-size:clamp(24px,4.4vh,42px)">'+
    '<span class="hi">grand</span> ＋ mother</div>'+
    '<div class="en pop" style="animation-delay:1.2s;font-size:clamp(24px,4.4vh,42px)">'+
    '<span class="hi">grand</span> ＋ ma</div>',
  lines:['同一個零件，<b>可以一直接下去</b>','接上誰，誰就長一輩']},

 {tag:'老祖宗的意思',emoji:'👴',emojiCls:'shrinkTo',say:'uncle',
  h:'<div class="en in d1">uncle</div>',
  lines:['老祖宗的意思和「<b>小爺爺</b>」有關','今天是叔叔、伯伯、舅舅']},

 {tag:'意思變寬了',emoji:'👩‍🦰<span class="plus">👩👵</span>',say:'aunt',
  h:'<div class="en in d1">aunt</div>',
  lines:['拉丁文的 <b>amita</b>，只有「<b>爸爸的姊妹</b>」',
         '現在姑姑、阿姨、舅媽<b>都算</b>']},

 {tag:'意思變寬了',emoji:'🧑<span class="plus">🧒👧👦</span>',say:'cousin',
  h:'<div class="en in d1">cousin</div>',
  lines:['以前只有「<b>媽媽的姊妹的小孩</b>」',
         '現在堂哥、表姊…<b>全部都是 cousin</b>']},

 {tag:'意思變窄了',emoji:'👦<span class="extra">👴👶🧒</span>',say:'nephew',
  h:'<div class="en in d1">nephew</div>',
  lines:['老祖宗 <b>nepos</b>，孫子、姪子、外甥都能指',
         '今天只剩「<b>兄弟姊妹的兒子</b>」']},

 {tag:'和 nephew 一對',emoji:'👧<span class="extra">👵👶👩</span>',say:'niece',
  h:'<div class="en in d1">niece</div>',
  lines:['<b>neptia</b> 以前也是一大群人都能指',
         '今天只剩「<b>兄弟姊妹的女兒</b>」']},

 {tag:'藏在字裡的房子',emoji:'🏠',say:'husband',
  h:'<div class="en in d1"><span class="hi">hus</span>band</div>',
  lines:['<b>hus</b> 就是 <b>house</b>（房子）',
         '以前指的是<b>家裡管事的那個人</b>']},

 {tag:'意思變窄了',emoji:'👰<span class="extra">👩👩‍🦰👵</span>',say:'wife',
  h:'<div class="en in d1">wife</div>',
  lines:['古英語的 <b>wīf</b>，可以指<b>任何女人</b>','今天只剩「<b>妻子</b>」']},

 {tag:'所以',emoji:'🗣️⏳',mid:'字會變，就像綽號',
  lines:['<b>沒有人規定</b>，是大家一直叫','叫著叫著，<b>就慢慢變了</b>']}
];

/* 第二頁的開場 */
const OPEN2={emoji:'👨‍👩‍👧‍👦',mid:'還有八個家人單字',
 lines:['故事也都不一樣']};

const PAGES=[
/* 19 幕一次放太長，拆成兩頁：前 9 個字／後 8 個字，各 10 幕 */
{file:'why.html',title:'家人單字的故事 ①',S:FAM.slice(0,10)},
{file:'why-2.html',title:'家人單字的故事 ②',S:[OPEN2].concat(FAM.slice(10,18),[FAM[18]])},

{file:'why-more.html',title:'更多字的故事',
 S:[
 {emoji:'🌍',mid:'不只家人單字',lines:['很多你認識的字，也有故事']},

 {tag:'從台灣出海',emoji:'🍵🚢',emojiCls:'fly',say:'tea',
  h:'<div class="en in d1">tea</div>',
  lines:['台灣話的「茶」唸 <b>tê</b>','坐船到外國，就變成 <b>tea</b>']},

 {tag:'也是台灣話',emoji:'🍅',say:'ketchup',
  h:'<div class="en in d1">ketchup</div>',
  lines:['台灣話的 <b>kê-tsiap</b>（鮭汁）是魚做的醬','英文借去用，今天變成番茄醬']},

 {tag:'城市的名字',emoji:'🍔',say:'hamburger',
  h:'<div class="en in d1">hamburger</div>',
  lines:['來自德國的<b>漢堡市</b>，不是火腿','後來被切成 ham＋burger，才有 cheeseburger']},

 {tag:'人的名字',emoji:'🥪',say:'sandwich',
  h:'<div class="en in d1">sandwich</div>',
  lines:['這是一位<b>伯爵的名字</b>','他請人把肉夾在麵包中間，不用停下手邊的事']},

 {tag:'兩個字黏起來',emoji:'🍳',say:'breakfast',
  h:'<div class="en"><span class="fromL">break</span> ＋ <span class="fromR">fast</span></div>',
  lines:['合起來就是 <b>breakfast</b>（早餐）','睡了一整晚沒吃，早上<b>打破</b>它']},

 {tag:'一句話縮起來',emoji:'👋',say:'goodbye',
  h:'<div class="en squeeze">goodbye</div>',
  lines:['本來是一整句 <b>God be with ye</b>','（願神與你同在）說久了，縮成一個字']},

 {tag:'看出來了嗎',emoji:'🗣️⏳',mid:'每個字，都是這樣來的',
  lines:['從外國借來、兩個字黏起來、一句話縮起來']}
]}
];

const tpl=(P)=>`<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${P.title}｜單字小故事</title>
<!-- 本檔由 words/_build_story.js 產生，不要手改。 -->
<style>
@font-face{font-family:Andika;font-style:normal;font-weight:400;font-display:swap;
 src:url(fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-style:normal;font-weight:700;font-display:swap;
 src:url(fonts/andika-700.woff2) format("woff2")}

*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%}
body{margin:0;background:#000;color:#F2F2F2;
 font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif;
 display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;user-select:none}

#dots{display:flex;gap:9px;position:fixed;top:max(18px,env(safe-area-inset-top))}
#dots i{width:22px;height:4px;border-radius:99px;background:#2A2A2A;transition:background .3s}
#dots i.on{background:#9FB4C8}

.nav{position:fixed;top:0;bottom:0;width:clamp(68px,10vw,120px);border:0;background:none;
 color:#9FB4C8;font-size:clamp(38px,5.4vw,58px);font-family:inherit;line-height:1;
 display:flex;align-items:center;justify-content:center;cursor:pointer}
.nav:disabled{color:#202020;cursor:default}
.nav:active:not(:disabled){background:rgba(255,255,255,.05)}
#prev{left:0}#next{right:0}

#stage{width:100%;max-width:760px;padding:0 clamp(76px,11vw,130px);text-align:center;
 min-height:clamp(320px,62vh,560px);display:flex;flex-direction:column;align-items:center;justify-content:center;
 gap:clamp(8px,1.6vh,18px)}
.tag{font-size:clamp(13px,1.6vh,16px);color:#9FB4C8;letter-spacing:.4em;font-weight:700;padding-left:.4em}
.emoji{font-size:clamp(62px,12.4vh,112px);line-height:1.05}
.mid{font-size:clamp(25px,4.2vh,38px);font-weight:700;line-height:1.45;letter-spacing:.04em}
.en{font-size:clamp(38px,7vh,68px);font-weight:700;letter-spacing:.01em}
.sub{font-size:clamp(17px,2.4vh,23px);color:#D8D3C5;line-height:1.55}
.sub b{color:#F2F2F2;font-weight:700}
.hi{color:#9FB4C8}
.ar{color:#9FB4C8;font-size:.58em;vertical-align:middle}

#bar{position:fixed;bottom:max(20px,env(safe-area-inset-bottom));display:flex;gap:12px}
#bar button{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;
 font-size:16px;padding:11px 20px;min-height:48px;font-family:inherit;cursor:pointer}
#bar button:active{background:#2A2A2A}

.in{animation:rise .5s cubic-bezier(.2,.9,.3,1) both}
.d1{animation-delay:.10s}.d2{animation-delay:.28s}.d3{animation-delay:.46s}
@keyframes rise{0%{opacity:0;transform:translateY(20px) scale(.92)}100%{opacity:1;transform:none}}
.pop{animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
@keyframes pop{0%{opacity:0;transform:scale(.4)}100%{opacity:1;transform:scale(1)}}
/* 多出來的人淡掉（意思變窄） */
.extra{display:inline-block;animation:vanish 2.6s ease-in-out both}
@keyframes vanish{0%,45%{opacity:1;transform:none}100%{opacity:.10;transform:scale(.72)}}
/* þ 像一面小旗子 */
.flag{display:inline-block;color:#9FB4C8;animation:flag 1.8s ease-in-out both}
@keyframes flag{0%{opacity:0;transform:rotate(-14deg) scale(.5)}45%{opacity:1;transform:rotate(9deg) scale(1)}
 72%{transform:rotate(-6deg)}100%{opacity:1;transform:none}}
/* gh 的聲音慢慢消失 */
.mute{animation:mute 2.4s ease-in-out both}
@keyframes mute{0%,38%{color:#9FB4C8}100%{color:#2E2E2E}}
/* 多出來的人跑進來（意思變寬） */
.plus{display:inline-block;animation:plusin .8s cubic-bezier(.2,1.5,.4,1) both;animation-delay:1.1s}
@keyframes plusin{0%{opacity:0;transform:scale(.3)}100%{opacity:1;transform:none}}
/* 爺爺縮小成「小爺爺」 */
.shrinkTo{animation:shrinkTo 2.4s ease-in-out both}
@keyframes shrinkTo{0%{opacity:0;transform:scale(1.3)}35%{opacity:1;transform:scale(1.3)}100%{opacity:1;transform:scale(.78)}}
/* 寶寶的 ma-ma / da-da */
.bub{display:inline-block;color:#9FB4C8;margin:0 .12em;
 animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
.b1{animation-delay:.15s}.b2{animation-delay:.52s}.b3{animation-delay:.89s}
/* 小孩從字裡冒出來 */
.emerge{animation:emerge .9s cubic-bezier(.2,1.2,.3,1) both;animation-delay:.55s}
@keyframes emerge{0%{opacity:0;transform:translateY(34px) scale(.5)}100%{opacity:1;transform:none}}
/* 坐船飄過來 */
.fly{animation:fly 1.2s cubic-bezier(.3,.8,.3,1) both}
@keyframes fly{0%{opacity:0;transform:translateX(-52px)}60%{opacity:1}100%{opacity:1;transform:none}}
/* 一整句話縮成一個字 */
.squeeze{animation:squeeze 1.3s cubic-bezier(.3,.9,.3,1) both}
@keyframes squeeze{0%{opacity:0;letter-spacing:.40em}100%{opacity:1;letter-spacing:.01em}}
/* 兩邊靠攏，黏成一個字 */
.fromL{display:inline-block;animation:fromL .9s cubic-bezier(.2,.9,.3,1) both}
.fromR{display:inline-block;animation:fromR .9s cubic-bezier(.2,.9,.3,1) both}
@keyframes fromL{0%{opacity:0;transform:translateX(-58px)}100%{opacity:1;transform:none}}
@keyframes fromR{0%{opacity:0;transform:translateX(58px)}100%{opacity:1;transform:none}}
.reduce *{animation:none!important;transition:none!important}
</style>
</head>
<body>
<div id="dots"></div>
<button class="nav" id="prev" aria-label="上一頁">&#8592;</button>
<div id="stage"></div>
<button class="nav" id="next" aria-label="下一頁">&#8594;</button>
<div id="bar"><button id="say">🔊 念一次</button><button id="again">▶ 從頭看</button></div>

<script>
var S=${JSON.stringify(P.S,null,1)};

function draw(s){
 var h="";
 if(s.tag)h+='<div class="tag in">'+s.tag+'</div>';
 if(s.emoji)h+='<div class="emoji '+(s.emojiCls||"pop")+'">'+s.emoji+'</div>';
 if(s.mid)h+='<div class="mid in d1">'+s.mid+'</div>';
 if(s.h)h+=s.h;
 (s.lines||[]).forEach(function(t,k){h+='<div class="sub in d'+(k+2)+'">'+t+'</div>'});
 return h;
}

var i=0,reduce=false;
try{reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}
if(reduce)document.body.classList.add("reduce");

var dots=document.getElementById("dots");
for(var k=0;k<S.length;k++)dots.appendChild(document.createElement("i"));

function say(){try{var w=S[i].say;if(!w)return;
 var u=new SpeechSynthesisUtterance(w);u.lang="en-US";u.rate=.8;
 speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}

function show(n){
 i=Math.max(0,Math.min(S.length-1,n));
 document.getElementById("stage").innerHTML=draw(S[i]);
 var d=dots.children;
 for(var k=0;k<d.length;k++)d[k].className=(k===i?"on":"");
 document.getElementById("prev").disabled=(i===0);
 document.getElementById("next").disabled=(i===S.length-1);
}

document.getElementById("prev").addEventListener("click",function(){show(i-1)});
document.getElementById("next").addEventListener("click",function(){show(i+1)});
document.getElementById("again").addEventListener("click",function(){show(0)});
document.getElementById("say").addEventListener("click",say);
document.addEventListener("keydown",function(e){
 if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();show(i+1)}
 if(e.key==="ArrowLeft")show(i-1);
});

show(0);
</script>
</body>
</html>
`;

PAGES.forEach(p=>fs.writeFileSync(path.join(DIR,p.file),tpl(p),'utf8'));
console.log('已產生：'+PAGES.map(p=>p.file).join('  '));
