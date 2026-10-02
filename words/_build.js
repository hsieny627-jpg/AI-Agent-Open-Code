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
const TOC=require('./_toc');

// e1 / e2 = 幕③的秒懂收尾（e2 留空就只顯示一行）
// build   = 只給 grandfather / grandmother：把幕②從「以前」換成「怎麼組的」
const WORDS=[
{f:'family',src:[0, 0, 0],zh:'家庭',icon:'👨‍👩‍👧‍👦',old:'familia',now:'family',
 e1:'👪 爸爸、媽媽、小孩，<b>全部都是 family</b>'},
{f:'parent',src:[0, 0, 1],parts:{href:'parts.html#10'},zh:'家長',sub:'爸爸或媽媽',icon:'👨‍👩',old:'parens',now:'parent',
 e1:'👤 一位家長是 <b>a parent</b>',e2:'很多位就加 <b class="rs">s</b>：<span class="sp" data-say="parents">parent<b class="rs">s</b></span>'},
{f:'mother',src:[1, 0, 2],parts:{href:'parts.html#4'},zh:'母親',icon:'❤️',old:'mōdor',now:'mother',
 e1:'👶 <b>mother</b> ＝ {{mom}}',e2:'美國說 {{mom}}，英國說 {{mum}}'},
{f:'father',src:[2, 0, 1],parts:{href:'parts.html#4'},zh:'父親',icon:'🧔',old:'fæder',now:'father',
 e1:'👶 <b>father</b> ＝ {{dad}}',e2:'小寶寶還不會說 father，<b>先叫出 dad</b>'},
{f:'brother',src:[2, 1, 3],more:{href:'older-younger.html',label:'🧒 哥哥弟弟'},parts:{href:'parts.html#4'},zh:'哥哥、弟弟',sub:'不分大小',icon:'🧒👦',old:'brōþor',now:'brother',
 e1:'👦 哥哥、弟弟，<b>都叫 brother</b>',e2:'要分大小就加 {{older}} 或 {{younger}}'},
{f:'sister',src:[4, 0, 5],more:{href:'older-younger.html',label:'👧 姊姊妹妹'},parts:{href:'parts.html#4'},zh:'姊姊、妹妹',sub:'不分大小',icon:'👧👩',old:'sweostor',now:'sister',
 e1:'👧 姊姊、妹妹，<b>都叫 sister</b>',e2:'要分大小就加 {{older}} 或 {{younger}}'},
{f:'son',src:[0, 0, 1],zh:'兒子',icon:'👦',old:'sunu',now:'son',
 e1:'☀️ 和太陽 {{sun}} 同音',e2:'一樣的音，<b>不一樣的字</b>'},
{f:'daughter',src:[0, 0, 1],zh:'女兒',icon:'👧',old:'dohtor',now:'daughter',
 e1:'🤫 中間的 <b>gh</b> 不出聲',
 more:{href:'daughter-gh.html',label:'✨ 補充'},parts:{href:'parts.html#4'}},
{f:'grandfather',src:[0, 0, 2],parts:{href:'parts.html#2'},zh:'爺爺',sub:'外公也是',icon:'👴',old:'grand-',now:'grandfather',
 build:{a:'grand',b:'father',note:'<b>grand</b> ＝ <b>大</b>　大的 father ＝ <b>爸爸的爸爸</b>'},
 e1:'👴 <b>grandfather</b> ＝ {{grandpa}}',e2:'爺爺、外公，<b>都叫 grandfather</b>'},
{f:'grandmother',src:[0, 0, 2],parts:{href:'parts.html#2'},zh:'奶奶',sub:'外婆也是',icon:'👵',old:'grand-',now:'grandmother',
 build:{a:'grand',b:'mother',note:'<b>grand</b> ＝ <b>大</b>　大的 mother ＝ <b>媽媽的媽媽</b>'},
 e1:'👵 <b>grandmother</b> ＝ {{grandma}}',e2:'奶奶、外婆，<b>都叫 grandmother</b>'},
{f:'uncle',src:[1, 0, 1],zh:'叔叔',sub:'伯伯、舅舅也是',icon:'🧓',old:'avunculus',now:'uncle',
 e1:'🧓 叔叔、伯伯、舅舅，<b>都叫 uncle</b>',e2:'中文分很多種，英文<b>一個字就夠</b>'},
{f:'aunt',src:[0, 0, 1],zh:'阿姨',sub:'姑姑、舅媽也是',icon:'👩‍🦰',old:'amita',now:'aunt',
 e1:'👩 姑姑、阿姨、舅媽，<b>都叫 aunt</b>',e2:'親一點可以叫 {{auntie}}'},
{f:'cousin',src:[1, 0, 1],zh:'堂表兄弟姊妹',sub:'叔叔阿姨的小孩',icon:'🧑‍🤝‍🧑',old:'consobrinus',now:'cousin',
 e1:'🧑‍🤝‍🧑 叔叔阿姨的小孩，<b>就是 cousin</b>',e2:'堂哥、表姊，<b>都叫 cousin</b>'},
{f:'nephew',src:[1, 0, 1],zh:'姪子',sub:'外甥也是',icon:'👦💙',old:'nepos',now:'nephew',
 e1:'👦 哥哥姊姊的兒子，<b>就是 nephew</b>',e2:'姪子、外甥，<b>都叫 nephew</b>'},
{f:'niece',src:[1, 0, 1],zh:'姪女',sub:'外甥女也是',icon:'👧💜',old:'neptia',now:'niece',
 e1:'👧 哥哥姊姊的女兒，<b>就是 niece</b>',e2:'姪女、外甥女，<b>都叫 niece</b>'},
{f:'husband',src:[0, 0, 0],parts:{href:'parts.html#3'},zh:'丈夫',icon:'🤵',old:'húsbóndi',now:'husband',
 e1:'🤵 介紹另一半就說 <b>my husband</b>'},
{f:'wife',src:[0, 0, 1],zh:'妻子',icon:'👰',old:'wīf',now:'wife',
 e1:'👰 <b>my wife</b> 是「我的妻子」',e2:'不可以隨便這樣叫別人'}
];

/* 字卡按鈕：圖示在上、字在下 */
const B=(id,ic,t)=>'<button id="'+id+'"><span class="bic">'+ic+'</span><span class="blb">'+t+'</span></button>';
const tpl=(W,SET)=>`<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${W.now}｜${SET.title||'單字小故事'}</title>
<!-- 本檔由 words/_build.js 產生，不要手改。改樣板請改 _build.js 再重跑。 -->
<style>
/* Andika 隨檔案放在 fonts/，離線也一定是 Andika（不靠網路） */
@font-face{font-family:Andika;font-style:normal;font-weight:400;font-display:swap;
 src:url(${SET.font||'fonts/'}andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-style:normal;font-weight:700;font-display:swap;
 src:url(${SET.font||'fonts/'}andika-700.woff2) format("woff2")}

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
/* 按鈕列（使用者 2026-10-02 指定，全站單字卡）：一排，「🔊 唸 3 次」在正中央；
   左：目次｜音節｜音標｜放慢　右：（結構／時光機）｜出處｜單字首頁｜總首頁。
   三欄格線 1fr auto 1fr ＝ 中間那顆不管兩邊幾顆都在正中央。圖示在上、字在下，iPad 直放也一排放得下。 */
#bar{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:stretch;gap:clamp(3px,.6vw,10px);width:100%;max-width:1180px}
#bar .bL,#bar .bR{display:flex;gap:clamp(3px,.5vw,9px);align-items:stretch}
#bar .bL{justify-content:flex-end}
#bar .bR{justify-content:flex-start}
#bar button{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:16px;
 display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
 font-size:clamp(12px,min(1.55vh,1.5vw),15px);padding:5px clamp(3px,.6vw,12px);min-height:56px;min-width:clamp(44px,5.4vw,64px);
 font-family:inherit;cursor:pointer;white-space:nowrap;line-height:1.1}
#bar button>.bic{font-size:1.5em;line-height:1;margin:0}
#bar #say3{background:#22303A;border-color:#9FB4C8;font-weight:700;min-width:clamp(70px,9vw,96px)}
#bar button:active{background:#2A2A2A}
/* 念到哪個字，那個字稍微放大、稍微變亮（2026-10-02：不可太亮、不刺眼；字母原本的紅／灰保留） */
#card .sent{cursor:pointer;white-space:nowrap}
#card .sw{display:inline-block;transition:transform .15s,filter .15s}
#card .speak{color:inherit!important;text-shadow:none;transform:scale(1.08);filter:brightness(1.22) drop-shadow(0 0 6px rgba(255,236,170,.32))}
#card .phw.speak .g i,#card .phw.speak .g i.v{color:inherit!important}
/* 句點（2026-10-02，全站單字卡）：緊接最後一個字母；唸完句子稍微放大、稍微變亮，最後停在比原來大一點點 */
.pdot{display:inline-block;transform-origin:30% 85%;margin-left:-.17em}
.pdot.go{animation:pdot 1.3s cubic-bezier(.3,1.4,.4,1) forwards}
.pdot.done{transform:scale(1.25)}
@keyframes pdot{0%{transform:scale(1)}40%{transform:scale(1.7);color:#FFF3C4;text-shadow:0 0 8px rgba(255,230,150,.45)}
 100%{transform:scale(1.25);color:inherit;text-shadow:none}}

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
${TOC.TOCCSS}
.rs{color:#FF5A5A!important}
${PH.CSS}
${SRC.CSS}
.topicfix{position:fixed;top:max(10px,env(safe-area-inset-top));left:14px;z-index:30;color:#FFD66B;font-weight:700;
 font-size:clamp(16px,2.4vh,22px);letter-spacing:.08em;pointer-events:none;white-space:nowrap}
</style>
${SET.head||''}
</head>
<body>
<div class="topicfix">${SET.topic||'🃏 單字卡'}</div>
<div id="dots"></div>
<div id="stage"><div id="card"></div>
<button class="nav" id="prev" aria-label="上一頁">&#8592;</button>
<button class="nav" id="next" aria-label="下一頁">&#8594;</button></div>
<div id="bottom">
<nav id="wnav">
 <a href="${W.prev}.html" title="上一個單字">◀ <span class="w">${W.prevL||W.prev}</span></a>
 <span class="pos">${W.idx} / ${W.total}</span>
 <a href="${W.next}.html" title="下一個單字"><span class="w">${W.nextL||W.next}</span> ▶</a>
</nav>
<div id="bar"><div class="bL">${B('tocb','📑','目次')}${PH.btnSyl}${PH.btnMode}${PH.btnSlow}</div>${B('say3','🔊','唸 3 次')}<div class="bR">${W.more?B('more',W.more.label.split(' ')[0],W.more.label.split(' ').slice(1).join(' ')):''}${W.parts?B('parts','🧩','結構'):''}${W.evo?B('evo','⏳','時光機'):''}${B('srcb','📖','出處')}${B('whome','🔤','單字首頁')}${B('home','🏠','總首頁')}</div></div>
</div>
${TOC.linksHTML(SET.list,W.f)}
${SRC.html((SET.srcW||SRC.W)[W.f],SET.common)}

<script>
${PH.JS}

var W={zh:${JSON.stringify(W.zh)},sub:${JSON.stringify(W.sub||'')},icon:${JSON.stringify(W.icon)},old:${JSON.stringify(W.old)},now:${JSON.stringify(W.now)},
 e1:${JSON.stringify(W.e1||'')},e2:${JSON.stringify(W.e2||'')}${W.build?',\n build:'+JSON.stringify(W.build):''}${W.zhp?',\n zhp:'+JSON.stringify(W.zhp):''}};

var SCENES=[
 // ① 中文意思
 /* zhp（2026-09-26 使用者指定）：「我 是」兩個字中間空一格，每個字正上方對齊它自己的圖示（我 ↔ 🙋、是 ↔ ＝） */
 function(){return (W.zhp?'<div style="display:flex;gap:clamp(22px,5vw,60px);justify-content:center;align-items:flex-end">'+
   W.zhp.map(function(p,k){return '<div style="display:flex;flex-direction:column;align-items:center;gap:6px">'+
    '<div class="emoji pop'+(k?' d1':'')+'" style="margin:0">'+p[1]+'</div><div class="zh in d'+(k+1)+'" style="margin:0">'+p[0]+'</div></div>'}).join('')+'</div>':
   '<div class="emoji pop">'+W.icon+'</div>'+
   '<div class="zh in d1">'+W.zh+'</div>')+
   (W.sub?'<div class="sub in d2">'+W.sub+'</div>':'')},
 // ② 以前的樣貌（圖示就是意思，不再加說明）；grandfather / grandmother 改成「怎麼組的」
 ${W.build?
 `function(){return '<div class="tag in">怎麼組的</div>'+
   '<div class="emoji pop" style="font-size:clamp(50px,9vh,84px)">'+W.icon+'</div>'+
   '<div class="parts in d1">{{'+W.build.a+'}} ＋ {{'+W.build.b+'}}</div>'+
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
];${W.scenes?'\n/* 這一組自己的幕（Review 1，2026-10-01）*/\nSCENES='+W.scenes+';':''}

var i=0,reduce=false;
try{reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}
if(reduce)document.body.classList.add("reduce");

var dots=document.getElementById("dots");
for(var k=0;k<SCENES.length;k++)dots.appendChild(document.createElement("i"));

/* 念一次：整個單字唸出來，同時一格一格亮過去（字母 ↔ 聲音） */
function say(){spoke=true;var el=PH.main();
 if(el){PH.sayWord(el)}else{PH.say(W.now)}}${W.say?'\nsay=function(){spoke=true;'+W.say+'};':''}

var card=document.getElementById("card");
/* 英文句子（2026-10-02，全站單字卡）：唸到哪個字那個字稍微放大變亮；唸完句子，句點放大一下再停在大一點點。
   一句 ＝ 有 data-sent 的外框，裡面一個字一個 .sw，句點是 .pdot。說明文字裡的句子（I’m ten years old.）也自動包成這樣。 */
var SENT=(function(){
 var tm=[];
 function dur(t){var k=String(t).replace(/[\u2019]/g,"'").replace(/\s+/g," ").trim().toLowerCase(),a=window.ENAUD&&ENAUD[k];
  return a?a[1]*1000/(PH.isSlow()?.7:1):(450+String(t).length*(PH.isSlow()?130:80))}
 function clr(){while(tm.length)clearTimeout(tm.pop());
  [].forEach.call(document.querySelectorAll("#card .sw.speak"),function(x){x.classList.remove("speak")})}
 function play(f){clr();var ws=f.querySelectorAll(".sw"),dot=f.querySelector(".pdot"),t=f.getAttribute("data-sent"),
  d=dur(t),n=[],tot=0,acc=0;
  if(dot)dot.classList.remove("go","done");
  [].forEach.call(ws,function(w){var L=(w.getAttribute("data-w")||w.textContent).length+1;n.push(L);tot+=L});
  PH.say(t);
  [].forEach.call(ws,function(w,k){tm.push(setTimeout(function(){
   [].forEach.call(ws,function(y){y.classList.remove("speak")});w.classList.add("speak")},120+acc));acc+=d*n[k]/tot});
  PH.after(function(){clr();if(dot){void dot.offsetWidth;dot.classList.add("go");
   tm.push(setTimeout(function(){dot.classList.remove("go");dot.classList.add("done")},1350))}})}
 /* autoSay 包好的「多個字」＋ 後面緊接 . ? ! ＝ 一句 */
 function wrap(root){[].forEach.call(root.querySelectorAll(".sp"),function(sp){
  var t=sp.getAttribute("data-say")||"",nx=sp.nextSibling;
  if(!/\s/.test(t)||!nx||nx.nodeType!==3||!/^[.?!]/.test(nx.nodeValue))return;
  var p=nx.nodeValue.charAt(0),h=document.createElement("span");h.className="sent";h.setAttribute("data-sent",t+p);
  h.innerHTML=t.split(/\s+/).map(function(w){return '<span class="sw">'+w+'</span>'}).join(" ")+
   (p==="."?'<span class="pdot">.</span>':p);
  nx.nodeValue=nx.nodeValue.slice(1);sp.parentNode.replaceChild(h,sp);PH.autoSay(h)})}
 document.addEventListener("click",function(e){var f=e.target.closest?e.target.closest(".sent"):null;if(!f)return;
  e.stopPropagation();play(f)},true);
 return{play:play,wrap:wrap,clr:clr}})();
function show(n){
 var back=(n<i);s3++;
 i=Math.max(0,Math.min(SCENES.length-1,n));
 window.SRCAT=${JSON.stringify(W.src||[0,0,0])}[i];   /* 按「📖 出處」直接跳到這一張字卡的證據（使用者 2026-09-25 指定） */
 card.innerHTML=PH.expand(SCENES[i]());
 PH.autoSay(card);       // 補充單字、字詞、用法都可以點來聽
 SENT.clr();SENT.wrap(card);
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
/* 🔊 唸 3 次（2026-10-02 指定；「唸 1 次」刪掉了，點單字就會唸一次）：唸完一次才唸下一次，換幕或點別的就停 */
var s3=0;
function say3(){var my=++s3,n=0;(function go(){if(my!==s3)return;say();if(++n<3)PH.after(function(){setTimeout(go,650)})})()}
document.getElementById("say3").addEventListener("click",say3);
document.addEventListener("keydown",function(e){
 if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();show(i+1)}
 if(e.key==="ArrowLeft")show(i-1);
});

show(0);
armFirstTouch();
${W.more?`document.getElementById("more").addEventListener("click",function(){location.href=${JSON.stringify(W.more.href)}});`:''}
${W.parts?`document.getElementById("parts").addEventListener("click",function(){location.href=${JSON.stringify(W.parts.href)}});`:''}
${W.evo?`document.getElementById("evo").addEventListener("click",function(){location.href=${JSON.stringify(W.evo)}});`:''}
document.getElementById("home").addEventListener("click",function(){location.href=${JSON.stringify(SET.top)}});
document.getElementById("whome").addEventListener("click",function(){location.href=${JSON.stringify(SET.whome||'index.html')}});
${TOC.LINKJS}
${SRC.JS}
</script>
</body>
</html>
`;

/* 一組單字卡（家人、職業，或 G3 的數字、常見字）：同一個樣板，一組一組產出。
   SET：dir 輸出資料夾、font 字體路徑、home 首頁、srcW 出處（單字 ➜ 出處）、title 網頁標題後綴、head 額外放進 <head> 的東西 */
function buildSet(WL,SET){
 /* 🏠 總首頁 ＝ 三、四年級的總首頁（repo 根目錄 index.html），從輸出資料夾算相對路徑 */
 SET.top=path.relative(SET.dir||DIR,path.join(__dirname,'..')).split(path.sep).join('/');
 SET.top=(SET.top?SET.top+'/':'')+'index.html';
 /* 上一個／下一個單字（頭尾相接），使用者 2026-09-20 指定加在每張字卡下方 */
 WL.forEach((w,k)=>{
  w.prev=WL[(k-1+WL.length)%WL.length].f;
  w.next=WL[(k+1)%WL.length].f;
  w.prevL=WL[(k-1+WL.length)%WL.length].now;
  w.nextL=WL[(k+1)%WL.length].now;
  w.idx=k+1; w.total=WL.length;
 });
 SET.list=WL.map(w=>({f:w.now||w.f,zh:w.zh,icon:w.icon,href:w.f+'.html',k:w.f}));
 /* ⏳ 單字時光機（2026-09-28）：有資料的字，字卡多一顆「⏳ 時光機」 */
 WL.forEach(w=>{if(require('./_evo_data').EVO.some(r=>r.w===w.f))w.evo=w.f+'-evo.html'});
 WL.forEach(w=>fs.writeFileSync(path.join(SET.dir||DIR,w.f+'.html'),tpl(w,SET),'utf8'));
 return WL;
}
module.exports={buildSet,tpl};
if(require.main===module){
 buildSet(WORDS,{dir:DIR});
 /* 給總入口（_build_hub.js）用的單字清單。由本檔產出，所以永遠不會跟字卡走鐘。 */
 fs.writeFileSync(path.join(DIR,'_words.json'),
  JSON.stringify(WORDS.map(w=>({f:w.f,zh:w.zh,icon:w.icon})),null,1),'utf8');
 console.log('已產生 '+WORDS.length+' 頁：'+WORDS.map(w=>w.f).join(' '));
}
