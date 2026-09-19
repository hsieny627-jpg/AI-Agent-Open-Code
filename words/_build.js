/* words/_build.js — 17 個單字頁的唯一產生器
 *
 * 用法： node words/_build.js        （重建全部 17 頁）
 *
 * 規格見 words/CLAUDE.md。改版面／互動只改下面的 tpl()，跑一次就 17 頁同步，
 * 不要手動去編輯 <單字>.html——那些檔案是產物，會被覆蓋。
 * why.html 與 brother-why.html 不由本檔產生（它們是獨立的一次性頁面）。
 *
 * 文案來源：family-time-machine-ipad.html 的 D 陣列，
 * 每頁只能從該單字自己的 story / hook / q / a 濃縮。
 */
const fs=require('fs'),path=require('path'),DIR=__dirname;
const SRC=require('./_sources');

// e1 / e2 = 幕③的秒懂收尾（e2 留空就只顯示一行）
// build   = 只給 grandfather / grandmother：把幕②從「以前」換成「怎麼組的」
const WORDS=[
{f:'family',zh:'家庭',sub:'一家人',icon:'👨‍👩‍👧‍👦',old:'familia',now:'family',
 e1:'👪 爸爸、媽媽、小孩，<b>全部都是 family</b>'},
{f:'parent',zh:'家長',sub:'爸爸或媽媽',icon:'👨‍👩',old:'parens',now:'parent',
 e1:'👤 一位家長是 <b>a parent</b>',e2:'很多位就加 s：<b>parents</b>'},
{f:'mother',zh:'母親',sub:'媽媽',icon:'❤️',old:'mōdor',now:'mother',
 e1:'👶 也可以叫 <b>mom</b>',e2:'美國常說 mom，英國常說 <b>mum</b>'},
{f:'father',zh:'父親',sub:'爸爸',icon:'🧔',old:'fæder',now:'father',
 e1:'👶 也可以叫 <b>dad</b>',e2:'dad 是寶寶先叫的，<b>不是 father 剪短的</b>'},
{f:'brother',zh:'哥哥、弟弟',sub:'不分大小',icon:'🧒👦',old:'brōþor',now:'brother',
 e1:'👦 哥哥、弟弟，<b>都叫 brother</b>',e2:'要分大小就加 <b>older</b> 或 <b>younger</b>'},
{f:'sister',zh:'姊姊、妹妹',sub:'不分大小',icon:'👧👩',old:'sweostor',now:'sister',
 e1:'👧 姊姊、妹妹，<b>都叫 sister</b>',e2:'要分大小就加 <b>older</b> 或 <b>younger</b>'},
{f:'son',zh:'兒子',sub:'爸爸媽媽的男孩',icon:'👦',old:'sunu',now:'son',
 e1:'☀️ 和太陽 <b>sun</b> 同音',e2:'一樣的音，<b>不一樣的字</b>'},
{f:'daughter',zh:'女兒',sub:'爸爸媽媽的女孩',icon:'👧',old:'dohtor',now:'daughter',
 e1:'🤫 中間的 <b>gh</b> 不出聲',e2:'念的時候直接跳過它',
 more:{href:'daughter-gh.html',label:'✨ 補充'}},
{f:'grandfather',zh:'爺爺',sub:'外公也是',icon:'👴',old:'grand-',now:'grandfather',
 build:{a:'grand',b:'father',note:'<b>grand</b> 加在家人前面 ＝ 長一輩'},
 e1:'👴 也可以叫 <b>grandpa</b>',e2:'爺爺、外公，<b>都叫 grandfather</b>'},
{f:'grandmother',zh:'奶奶',sub:'外婆也是',icon:'👵',old:'grand-',now:'grandmother',
 build:{a:'grand',b:'mother',note:'<b>grand</b> 加在家人前面 ＝ 長一輩'},
 e1:'👵 也可以叫 <b>grandma</b>',e2:'奶奶、外婆，<b>都叫 grandmother</b>'},
{f:'uncle',zh:'叔叔',sub:'伯伯、舅舅也是',icon:'🧓',old:'avunculus',now:'uncle',
 e1:'🧓 叔叔、伯伯、舅舅，<b>都叫 uncle</b>',e2:'中文分很多種，英文<b>一個字就夠</b>'},
{f:'aunt',zh:'阿姨',sub:'姑姑、舅媽也是',icon:'👩‍🦰',old:'amita',now:'aunt',
 e1:'👩 姑姑、阿姨、舅媽，<b>都叫 aunt</b>',e2:'親一點可以叫 <b>auntie</b>'},
{f:'cousin',zh:'堂表兄弟姊妹',sub:'叔叔阿姨的小孩',icon:'🧑‍🤝‍🧑',old:'consobrinus',now:'cousin',
 e1:'🧑‍🤝‍🧑 叔叔阿姨的小孩，<b>就是 cousin</b>',e2:'堂哥、表姊，<b>都叫 cousin</b>'},
{f:'nephew',zh:'姪子',sub:'外甥也是',icon:'👦💙',old:'nepos',now:'nephew',
 e1:'👦 哥哥姊姊的兒子，<b>就是 nephew</b>',e2:'姪子、外甥，<b>都叫 nephew</b>'},
{f:'niece',zh:'姪女',sub:'外甥女也是',icon:'👧💜',old:'neptia',now:'niece',
 e1:'👧 哥哥姊姊的女兒，<b>就是 niece</b>',e2:'姪女、外甥女，<b>都叫 niece</b>'},
{f:'husband',zh:'丈夫',sub:'先生',icon:'🤵',old:'húsbóndi',now:'husband',
 e1:'🤵 介紹另一半就說 <b>my husband</b>'},
{f:'wife',zh:'妻子',sub:'太太',icon:'👰',old:'wīf',now:'wife',
 e1:'👰 <b>my wife</b> 是「我的妻子」',e2:'不可以隨便這樣叫別人'}
];

const tpl=(W)=>`<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${W.now}｜單字小故事</title>
<!-- 本檔由 words/_build.js 產生，不要手改。改樣板請改 _build.js 再重跑。 -->
<style>
/* Andika 隨檔案放在 fonts/，離線也一定是 Andika（不靠網路） */
@font-face{font-family:Andika;font-style:normal;font-weight:400;font-display:swap;
 src:url(fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-style:normal;font-weight:700;font-display:swap;
 src:url(fonts/andika-700.woff2) format("woff2")}

*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%}
body{margin:0;background:#000;color:#F2F2F2;
 font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif;
 display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;user-select:none}

#dots{display:flex;gap:10px;position:fixed;top:max(18px,env(safe-area-inset-top))}
#dots i{width:26px;height:4px;border-radius:99px;background:#2A2A2A;transition:background .3s}
#dots i.on{background:#9FB4C8}

/* 左右翻頁箭頭：整條邊都可以按，投影或小朋友上台都點得到 */
.nav{position:fixed;top:0;bottom:0;width:clamp(68px,10vw,120px);border:0;background:none;
 color:#9FB4C8;font-size:clamp(38px,5.4vw,58px);font-family:inherit;line-height:1;
 display:flex;align-items:center;justify-content:center;cursor:pointer}
.nav:disabled{color:#202020;cursor:default}
.nav:active:not(:disabled){background:rgba(255,255,255,.05)}
#prev{left:0}#next{right:0}

/* 字卡：一張卡就是一幕，翻頁＝翻卡（使用者 2026-09-19 指定） */
#stage{width:100%;max-width:760px;padding:0 clamp(76px,11vw,130px);
 display:flex;align-items:center;justify-content:center;perspective:1500px}
#card{width:100%;text-align:center;min-height:clamp(300px,57vh,520px);
 display:flex;flex-direction:column;align-items:center;justify-content:center;
 gap:clamp(8px,1.6vh,18px);
 border:1px solid #242424;border-radius:clamp(18px,3vh,30px);
 background:linear-gradient(180deg,#0B0B0B 0%,#040404 100%);
 box-shadow:0 18px 50px rgba(0,0,0,.65);
 padding:clamp(10px,2.4vh,24px) clamp(8px,2vw,18px)}
.tag{font-size:clamp(13px,1.6vh,16px);color:#9FB4C8;letter-spacing:.4em;font-weight:700;padding-left:.4em}
.emoji{font-size:clamp(84px,17vh,150px);line-height:1.05}
.zh{font-size:clamp(46px,8.4vh,78px);font-weight:700;letter-spacing:.06em}
.word{font-size:clamp(50px,9vh,88px);font-weight:700;letter-spacing:.01em}
.word.past{color:#D8D3C5}
.parts{font-size:clamp(34px,6vh,58px);font-weight:700;color:#D8D3C5;letter-spacing:.01em}
.parts b{color:#9FB4C8;font-weight:700}
.sub{font-size:clamp(17px,2.4vh,23px);color:#D8D3C5;line-height:1.5}
.sub b{color:#F2F2F2;font-weight:700}

#bar{position:fixed;bottom:max(20px,env(safe-area-inset-bottom));display:flex;gap:12px}
#bar button{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;
 font-size:16px;padding:11px 20px;min-height:48px;font-family:inherit;cursor:pointer}
#bar button:active{background:#2A2A2A}

.in{animation:rise .5s cubic-bezier(.2,.9,.3,1) both}
.d1{animation-delay:.10s}.d2{animation-delay:.24s}.d3{animation-delay:.40s}
.d4{animation-delay:1.55s}.d5{animation-delay:1.75s}
@keyframes rise{0%{opacity:0;transform:translateY(20px) scale(.92)}100%{opacity:1;transform:none}}
.pop{animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
@keyframes pop{0%{opacity:0;transform:scale(.4)}100%{opacity:1;transform:scale(1)}}
/* 翻卡：往後翻從右邊翻進來，往回翻從左邊翻進來（420ms，翻完才是穩定畫面） */
.turnR{animation:turnR .42s cubic-bezier(.25,.85,.3,1) both}
.turnL{animation:turnL .42s cubic-bezier(.25,.85,.3,1) both}
@keyframes turnR{0%{opacity:.2;transform:rotateY(54deg) translateX(24px) scale(.94)}
 100%{opacity:1;transform:none}}
@keyframes turnL{0%{opacity:.2;transform:rotateY(-54deg) translateX(-24px) scale(.94)}
 100%{opacity:1;transform:none}}
.reduce *{animation:none!important;transition:none!important}
${SRC.CSS}
</style>
</head>
<body>
<div id="dots"></div>
<button class="nav" id="prev" aria-label="上一頁">&#8592;</button>
<div id="stage"><div id="card"></div></div>
<button class="nav" id="next" aria-label="下一頁">&#8594;</button>
<div id="bar"><button id="say">🔊 念一次</button><button id="again">▶ 從頭看</button>${W.more?`<button id="more">${W.more.label}</button>`:''}${SRC.btn}</div>
${SRC.html(SRC.W[W.f])}

<script>
var W={zh:${JSON.stringify(W.zh)},sub:${JSON.stringify(W.sub)},icon:${JSON.stringify(W.icon)},old:${JSON.stringify(W.old)},now:${JSON.stringify(W.now)},
 e1:${JSON.stringify(W.e1||'')},e2:${JSON.stringify(W.e2||'')}${W.build?',\n build:'+JSON.stringify(W.build):''}};

var SCENES=[
 // ① 中文意思
 function(){return '<div class="emoji pop">'+W.icon+'</div>'+
   '<div class="zh in d1">'+W.zh+'</div>'+
   '<div class="sub in d2">'+W.sub+'</div>'},
 // ② 以前的樣貌（圖示就是意思，不再加說明）；grandfather / grandmother 改成「怎麼組的」
 ${W.build?
 `function(){return '<div class="tag in">怎麼組的</div>'+
   '<div class="emoji pop" style="font-size:clamp(50px,9vh,84px)">'+W.icon+'</div>'+
   '<div class="parts in d1"><b>'+W.build.a+'</b> ＋ '+W.build.b+'</div>'+
   '<div class="sub in d2" style="margin-top:2px">'+W.build.note+'</div>'}`
 :
 `function(){return '<div class="tag in">以前</div>'+
   '<div class="word past in d1">'+W.old+'</div>'+
   '<div class="emoji pop d2" style="font-size:clamp(66px,12vh,104px)">'+W.icon+'</div>'}`},
 // ③ 現在的單字＋秒懂收尾
 function(){return '<div class="tag in">現在</div>'+
   '<div class="emoji pop" style="font-size:clamp(50px,9vh,84px)">'+W.icon+'</div>'+
   '<div class="word in d1">'+W.now+'</div>'+
   '<div class="sub in d2" style="margin-top:2px">'+W.e1+'</div>'+
   (W.e2?'<div class="sub in d3">'+W.e2+'</div>':'')}
];

var i=0,reduce=false;
try{reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}
if(reduce)document.body.classList.add("reduce");

var dots=document.getElementById("dots");
for(var k=0;k<SCENES.length;k++)dots.appendChild(document.createElement("i"));

function say(){try{var u=new SpeechSynthesisUtterance(W.now);u.lang="en-US";u.rate=.8;
 speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}

var card=document.getElementById("card");
function show(n){
 var back=(n<i);
 i=Math.max(0,Math.min(SCENES.length-1,n));
 card.innerHTML=SCENES[i]();
 if(!reduce){card.classList.remove("turnR","turnL");void card.offsetWidth;
  card.classList.add(back?"turnL":"turnR")}
 var d=dots.children;
 for(var k=0;k<d.length;k++)d[k].className=(k===i?"on":"");
 document.getElementById("prev").disabled=(i===0);
 document.getElementById("next").disabled=(i===SCENES.length-1);
 if(i===SCENES.length-1)say();
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
${W.more?`document.getElementById("more").addEventListener("click",function(){location.href=${JSON.stringify(W.more.href)}});`:''}
${SRC.JS}
</script>
</body>
</html>
`;

WORDS.forEach(w=>fs.writeFileSync(path.join(DIR,w.f+'.html'),tpl(w),'utf8'));
console.log('已產生 '+WORDS.length+' 頁：'+WORDS.map(w=>w.f).join(' '));
