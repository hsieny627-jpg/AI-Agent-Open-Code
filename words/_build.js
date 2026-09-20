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
const PH=require('./_phonics');

// e1 / e2 = 幕③的秒懂收尾（e2 留空就只顯示一行）
// build   = 只給 grandfather / grandmother：把幕②從「以前」換成「怎麼組的」
const WORDS=[
{f:'family',zh:'家庭',icon:'👨‍👩‍👧‍👦',old:'familia',now:'family',
 e1:'👪 爸爸、媽媽、小孩，<b>全部都是 family</b>'},
{f:'parent',parts:{href:'parts.html#8'},zh:'家長',sub:'爸爸或媽媽',icon:'👨‍👩',old:'parens',now:'parent',
 e1:'👤 一位家長是 <b>a parent</b>',e2:'很多位就加 s：{{parents}}'},
{f:'mother',parts:{href:'parts.html#4'},zh:'母親',icon:'❤️',old:'mōdor',now:'mother',
 e1:'👶 <b>mother</b> ＝ {{mom}}',e2:'美國說 {{mom}}，英國說 {{mum}}'},
{f:'father',parts:{href:'parts.html#4'},zh:'父親',icon:'🧔',old:'fæder',now:'father',
 e1:'👶 <b>father</b> ＝ {{dad}}',e2:'小寶寶還不會說 father，<b>先叫出 dad</b>'},
{f:'brother',more:{href:'older-younger.html',label:'🧒 哥哥弟弟'},parts:{href:'parts.html#4'},zh:'哥哥、弟弟',sub:'不分大小',icon:'🧒👦',old:'brōþor',now:'brother',
 e1:'👦 哥哥、弟弟，<b>都叫 brother</b>',e2:'要分大小就加 {{older}} 或 {{younger}}'},
{f:'sister',more:{href:'older-younger.html',label:'👧 姊姊妹妹'},parts:{href:'parts.html#4'},zh:'姊姊、妹妹',sub:'不分大小',icon:'👧👩',old:'sweostor',now:'sister',
 e1:'👧 姊姊、妹妹，<b>都叫 sister</b>',e2:'要分大小就加 {{older}} 或 {{younger}}'},
{f:'son',zh:'兒子',icon:'👦',old:'sunu',now:'son',
 e1:'☀️ 和太陽 {{sun}} 同音',e2:'一樣的音，<b>不一樣的字</b>'},
{f:'daughter',zh:'女兒',icon:'👧',old:'dohtor',now:'daughter',
 e1:'🤫 中間的 <b>gh</b> 不出聲',
 more:{href:'daughter-gh.html',label:'✨ 補充'},parts:{href:'parts.html#4'}},
{f:'grandfather',parts:{href:'parts.html#2'},zh:'爺爺',sub:'外公也是',icon:'👴',old:'grand-',now:'grandfather',
 build:{a:'grand',b:'father',note:'<b>grand</b> ＝ <b>大</b>　大的 father ＝ <b>爸爸的爸爸</b>'},
 e1:'👴 <b>grandfather</b> ＝ {{grandpa}}',e2:'爺爺、外公，<b>都叫 grandfather</b>'},
{f:'grandmother',parts:{href:'parts.html#2'},zh:'奶奶',sub:'外婆也是',icon:'👵',old:'grand-',now:'grandmother',
 build:{a:'grand',b:'mother',note:'<b>grand</b> ＝ <b>大</b>　大的 mother ＝ <b>媽媽的媽媽</b>'},
 e1:'👵 <b>grandmother</b> ＝ {{grandma}}',e2:'奶奶、外婆，<b>都叫 grandmother</b>'},
{f:'uncle',zh:'叔叔',sub:'伯伯、舅舅也是',icon:'🧓',old:'avunculus',now:'uncle',
 e1:'🧓 叔叔、伯伯、舅舅，<b>都叫 uncle</b>',e2:'中文分很多種，英文<b>一個字就夠</b>'},
{f:'aunt',zh:'阿姨',sub:'姑姑、舅媽也是',icon:'👩‍🦰',old:'amita',now:'aunt',
 e1:'👩 姑姑、阿姨、舅媽，<b>都叫 aunt</b>',e2:'親一點可以叫 {{auntie}}'},
{f:'cousin',zh:'堂表兄弟姊妹',sub:'叔叔阿姨的小孩',icon:'🧑‍🤝‍🧑',old:'consobrinus',now:'cousin',
 e1:'🧑‍🤝‍🧑 叔叔阿姨的小孩，<b>就是 cousin</b>',e2:'堂哥、表姊，<b>都叫 cousin</b>'},
{f:'nephew',zh:'姪子',sub:'外甥也是',icon:'👦💙',old:'nepos',now:'nephew',
 e1:'👦 哥哥姊姊的兒子，<b>就是 nephew</b>',e2:'姪子、外甥，<b>都叫 nephew</b>'},
{f:'niece',zh:'姪女',sub:'外甥女也是',icon:'👧💜',old:'neptia',now:'niece',
 e1:'👧 哥哥姊姊的女兒，<b>就是 niece</b>',e2:'姪女、外甥女，<b>都叫 niece</b>'},
{f:'husband',parts:{href:'parts.html#3'},zh:'丈夫',icon:'🤵',old:'húsbóndi',now:'husband',
 e1:'🤵 介紹另一半就說 <b>my husband</b>'},
{f:'wife',zh:'妻子',icon:'👰',old:'wīf',now:'wife',
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

/* 左右翻頁箭頭：**貼在字卡自己的左右邊**（使用者 2026-09-20 指定，老師點起來比較順手）。
   放在 #stage 裡、不放在 #card 裡——#card 每翻一幕都整個 innerHTML 重寫，
   而且翻卡時會做 3D 旋轉，箭頭當它的子元素會被洗掉、也會跟著歪。
   絕對定位的基準是 #stage 的 padding 邊，所以左右偏移用同一個 --pad 對齊卡片邊緣。 */
.nav{position:absolute;top:0;bottom:0;width:var(--navw);border:0;background:none;
 color:#9FB4C8;font-size:clamp(38px,5.4vw,58px);font-family:inherit;line-height:1;z-index:2;
 display:flex;align-items:center;justify-content:center;cursor:pointer}
.nav:disabled{color:#202020;cursor:default}
.nav:active:not(:disabled){background:rgba(255,255,255,.06)}
#prev{left:var(--pad);border-radius:clamp(18px,3vh,30px) 0 0 clamp(18px,3vh,30px)}
#next{right:var(--pad);border-radius:0 clamp(18px,3vh,30px) clamp(18px,3vh,30px) 0}

/* 字卡：一張卡就是一幕，翻頁＝翻卡（使用者 2026-09-19 指定） */
#stage{--pad:clamp(10px,2.5vw,28px);--navw:clamp(56px,7.5vw,86px);
 position:relative;width:100%;max-width:760px;padding:0 var(--pad);
 display:flex;align-items:center;justify-content:center;perspective:1500px}
#card{width:100%;text-align:center;min-height:clamp(300px,57vh,520px);
 display:flex;flex-direction:column;align-items:center;justify-content:center;
 gap:clamp(8px,1.6vh,18px);
 border:1px solid #242424;border-radius:clamp(18px,3vh,30px);
 background:linear-gradient(180deg,#0B0B0B 0%,#040404 100%);
 box-shadow:0 18px 50px rgba(0,0,0,.65);
 padding:clamp(10px,2.4vh,24px) calc(var(--navw) + clamp(6px,1.2vw,12px))}
.tag{font-size:clamp(13px,1.6vh,16px);color:#9FB4C8;letter-spacing:.4em;font-weight:700;padding-left:.4em}
.emoji{font-size:clamp(84px,17vh,150px);line-height:1.05}
.zh{font-size:clamp(50px,9vh,84px);font-weight:700;letter-spacing:.06em}
/* 中央的學習焦點單字：使用者 2026-09-20 指定再放大，最後一排要看得清楚 */
/* 高度與寬度都要夾住，否則直式（820 寬）會折行 */
.word{font-size:clamp(50px,min(10.6vh,11.5vw),104px);font-weight:700;letter-spacing:.01em}
.word.past{color:#D8D3C5}
.parts{font-size:clamp(36px,6.4vh,62px);font-weight:700;color:#D8D3C5;letter-spacing:.01em}
.parts b{color:#9FB4C8;font-weight:700}
.sub{font-size:clamp(19px,2.7vh,26px);color:#D8D3C5;line-height:1.5}
.sub b{color:#F2F2F2;font-weight:700}

/* 底部固定兩排：上排「上一個／下一個單字」，下排工具鈕。
   使用者 2026-09-20 指定：**字卡本身不放任何按鈕與說明文字**，讓單字聚焦。 */
#bottom{position:fixed;left:0;right:0;bottom:max(16px,env(safe-area-inset-bottom));
 display:flex;flex-direction:column;align-items:center;gap:9px;padding:0 10px}
#wnav{display:flex;align-items:center;justify-content:center;gap:clamp(10px,2.4vw,26px);
 width:100%;max-width:640px}
#wnav a{display:flex;align-items:center;gap:7px;text-decoration:none;color:#D8D3C5;
 background:#141414;border:1px solid #333;border-radius:99px;font-family:inherit;
 font-size:clamp(14px,2vh,17px);padding:9px 17px;min-height:44px;white-space:nowrap}
#wnav a:hover{border-color:#9FB4C8;color:#F2F2F2}
#wnav a .w{font-weight:700}
#wnav .pos{font-size:clamp(12px,1.7vh,14px);color:#5E5E5E;letter-spacing:.1em;white-space:nowrap}
#bar{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
#bar button{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;
 font-size:15px;padding:10px 17px;min-height:46px;font-family:inherit;cursor:pointer}
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
${PH.CSS}
${SRC.CSS}
</style>
</head>
<body>
<div id="dots"></div>
<div id="stage"><div id="card"></div>
<button class="nav" id="prev" aria-label="上一頁">&#8592;</button>
<button class="nav" id="next" aria-label="下一頁">&#8594;</button></div>
<div id="bottom">
<nav id="wnav">
 <a href="${W.prev}.html" title="上一個單字">◀ <span class="w">${W.prev}</span></a>
 <span class="pos">${W.idx} / ${W.total}</span>
 <a href="${W.next}.html" title="下一個單字"><span class="w">${W.next}</span> ▶</a>
</nav>
<div id="bar"><button id="say">🔊 念一次</button>${PH.btnSlow}${PH.btnMode}${PH.btnSyl}${W.more?`<button id="more">${W.more.label}</button>`:''}${W.parts?`<button id="parts">🧩 結構</button>`:''}<button id="home">🏠 首頁</button>${SRC.btn}</div>
</div>
${SRC.html(SRC.W[W.f])}

<script>
${PH.JS}

var W={zh:${JSON.stringify(W.zh)},sub:${JSON.stringify(W.sub||'')},icon:${JSON.stringify(W.icon)},old:${JSON.stringify(W.old)},now:${JSON.stringify(W.now)},
 e1:${JSON.stringify(W.e1||'')},e2:${JSON.stringify(W.e2||'')}${W.build?',\n build:'+JSON.stringify(W.build):''}};

var SCENES=[
 // ① 中文意思
 function(){return '<div class="emoji pop">'+W.icon+'</div>'+
   '<div class="zh in d1">'+W.zh+'</div>'+
   (W.sub?'<div class="sub in d2">'+W.sub+'</div>':'')},
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
   '<div class="word in d1"'+(W.now.length>=11?' style="font-size:clamp(38px,min(7.5vh,8.2vw),74px)"':'')+'>'+
   PH.box(W.now)+'</div>'+
   '<div class="sub in d2" style="margin-top:2px">'+W.e1+'</div>'+
   (W.e2?'<div class="sub in d3">'+W.e2+'</div>':'')}
];

var i=0,reduce=false;
try{reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}
if(reduce)document.body.classList.add("reduce");

var dots=document.getElementById("dots");
for(var k=0;k<SCENES.length;k++)dots.appendChild(document.createElement("i"));

/* 念一次：整個單字唸出來，同時一格一格亮過去（字母 ↔ 聲音） */
function say(){spoke=true;var el=PH.main();
 if(el){PH.sayWord(el)}else{PH.say(W.now)}}

var card=document.getElementById("card");
function show(n){
 var back=(n<i);
 i=Math.max(0,Math.min(SCENES.length-1,n));
 card.innerHTML=PH.expand(SCENES[i]());
 PH.autoSay(card);       // 補充單字、字詞、用法都可以點來聽
 if(!reduce){card.classList.remove("turnR","turnL");void card.offsetWidth;
  card.classList.add(back?"turnL":"turnR")}
 var d=dots.children;
 for(var k=0;k<d.length;k++)d[k].className=(k===i?"on":"");
 document.getElementById("prev").disabled=(i===0);
 document.getElementById("next").disabled=(i===SCENES.length-1);
 /* 使用者 2026-09-20 指定：一翻到中文意思那一幕，就自動唸一次英文單字。
    （有些瀏覽器規定要先碰過畫面才准發聲，所以下面補一個「第一次碰到就補唸」。） */
 if(i===0||i===SCENES.length-1)say();
}
var spoke=false;
function armFirstTouch(){
 function go(){if(!spoke&&i===0)say();
  document.removeEventListener("pointerdown",go);document.removeEventListener("keydown",go)}
 document.addEventListener("pointerdown",go);document.addEventListener("keydown",go);
}

document.getElementById("prev").addEventListener("click",function(){show(i-1)});
document.getElementById("next").addEventListener("click",function(){show(i+1)});
document.getElementById("say").addEventListener("click",say);
document.addEventListener("keydown",function(e){
 if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();show(i+1)}
 if(e.key==="ArrowLeft")show(i-1);
});

show(0);
armFirstTouch();
${W.more?`document.getElementById("more").addEventListener("click",function(){location.href=${JSON.stringify(W.more.href)}});`:''}
${W.parts?`document.getElementById("parts").addEventListener("click",function(){location.href=${JSON.stringify(W.parts.href)}});`:''}
document.getElementById("home").addEventListener("click",function(){location.href="../index.html"});
${SRC.JS}
</script>
</body>
</html>
`;

/* 上一個／下一個單字（頭尾相接），使用者 2026-09-20 指定加在每張字卡下方 */
WORDS.forEach((w,k)=>{
 w.prev=WORDS[(k-1+WORDS.length)%WORDS.length].f;
 w.next=WORDS[(k+1)%WORDS.length].f;
 w.idx=k+1; w.total=WORDS.length;
});
WORDS.forEach(w=>fs.writeFileSync(path.join(DIR,w.f+'.html'),tpl(w),'utf8'));
/* 給總入口（_build_hub.js）用的單字清單。由本檔產出，所以永遠不會跟字卡走鐘。 */
fs.writeFileSync(path.join(DIR,'_words.json'),
 JSON.stringify(WORDS.map(w=>({f:w.f,zh:w.zh,icon:w.icon})),null,1),'utf8');
console.log('已產生 '+WORDS.length+' 頁：'+WORDS.map(w=>w.f).join(' '));
