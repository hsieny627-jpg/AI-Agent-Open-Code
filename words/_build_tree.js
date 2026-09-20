/* words/_build_tree.js — family tree 家庭樹（使用者 2026-09-20 指定）
 *
 * 用法： node words/_build_tree.js
 *
 * 產出兩頁：
 *   family-tree.html   基礎版：自己家人（me / father / mother / brother / sister /
 *                      grandfather / grandmother）
 *   family-tree-2.html 進階版：再加上親戚（uncle / aunt / cousin / nephew / niece）
 *
 * 使用者指定的四件事：
 *  1. **一次只呈現一個家人的英文單字**（一次只給一個學習重點）——
 *     樹上其他人只留圖示而且變暗，只有「現在這一個」會亮起來並顯示單字。
 *  2. 點單字（含 family tree 本身）可以聽**標準美式英語發音**，也能放慢語速。
 *  3. 單字用 _phonics.js 畫：**母音紅色、不發音淺灰**，可切 IPA／KK。
 *  4. 六種顯示切換：
 *       A 只圖示 ／ B 只中文 ／ C 只英文 ／ D 英文＋圖示 ／ E 英文＋中文 ／ F 全部
 *     老師選的那一種記在 localStorage，翻頁與換頁都不會跑掉。
 *
 * 版面規則同其他頁：1024×768 與 820×1180 都不可溢出，由 _verify.js 量。
 * 這一頁有 #dots，所以 _verify.js 會當成「幕頁」來量。
 */
const fs = require('fs'), path = require('path'), DIR = __dirname;
const SRC = require('./_sources');
const PH  = require('./_phonics');

/* 每一個家人：英文、中文、圖示、口語說法（有的話） */
const N = {
 me:          { zh: '我',          ic: '🙋' },
 father:      { zh: '爸爸',        ic: '🧔',   also: 'dad' },
 mother:      { zh: '媽媽',        ic: '👩',   also: 'mom' },
 brother:     { zh: '哥哥、弟弟',  ic: '👦' },
 sister:      { zh: '姊姊、妹妹',  ic: '👧' },
 grandfather: { zh: '爺爺、外公',  ic: '👴',   also: 'grandpa' },
 grandmother: { zh: '奶奶、外婆',  ic: '👵',   also: 'grandma' },
 uncle:       { zh: '叔叔、舅舅',  ic: '🧓' },
 aunt:        { zh: '阿姨、姑姑',  ic: '👩‍🦰' },
 cousin:      { zh: '堂表兄弟姊妹', ic: '🧑' },
 nephew:      { zh: '姪子、外甥',  ic: '👦💙' },
 niece:       { zh: '姪女、外甥女', ic: '👧💜' }
};

/* 樹的排法。一列一個陣列，由上往下。 */
const TREE1 = [
 ['grandfather', 'grandmother'],
 ['father', 'mother'],
 ['brother', 'me', 'sister']
];
const TREE2 = [
 ['grandfather', 'grandmother'],
 ['uncle', 'father', 'mother', 'aunt'],
 ['cousin', 'brother', 'me', 'sister'],
 ['nephew', 'niece']
];

const PAGES = [
{ file: 'family-tree.html', title: 'family tree 基礎版', src: 'family-tree',
  tree: TREE1,
  back: { href: '../index.html', label: '← 回 首頁' },
  S: [
   { open: true, mid: 'family tree', zh: '家庭樹',
     lines: ['<b>點任何一個人</b>，聽聽看怎麼唸'] },
   { k: 'me',          line: '先從<b>自己</b>開始' },
   { k: 'father',      line: '爸爸也可以叫 {{dad}}' },
   { k: 'mother',      line: '媽媽也可以叫 {{mom}}' },
   { k: 'brother',     line: '哥哥、弟弟<b>都叫 brother</b>' },
   { k: 'sister',      line: '姊姊、妹妹<b>都叫 sister</b>' },
   { k: 'grandfather', line: '爸爸的爸爸，也可以叫 {{grandpa}}' },
   { k: 'grandmother', line: '媽媽的媽媽，也可以叫 {{grandma}}' }
  ] },

{ file: 'family-tree-2.html', title: 'family tree 進階版', src: 'family-tree',
  tree: TREE2,
  back: { href: 'family-tree.html', label: '← 回 基礎版' },
  S: [
   { open: true, mid: 'family tree', zh: '再加上親戚',
     lines: ['樹長大了 —— <b>親戚也上樹</b>'] },
   { k: 'uncle',  line: '叔叔、伯伯、舅舅，<b>都叫 uncle</b>' },
   { k: 'aunt',   line: '阿姨、姑姑、舅媽，<b>都叫 aunt</b>' },
   { k: 'cousin', line: '叔叔阿姨的小孩，<b>都叫 cousin</b>' },
   { k: 'nephew', line: '哥哥姊姊的<b>兒子</b>' },
   { k: 'niece',  line: '哥哥姊姊的<b>女兒</b>' },
   { end: true, mid: '整棵樹，十二個人', zh: '',
     lines: ['中文分好多種，<b>英文一個字就夠</b>'] }
  ] }
];

const tpl = (P) => `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${P.title}｜家人單字</title>
<!-- 本檔由 words/_build_tree.js 產生，不要手改。 -->
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

#dots{display:flex;gap:9px;position:fixed;top:max(16px,env(safe-area-inset-top))}
#dots i{width:22px;height:4px;border-radius:99px;background:#2A2A2A;transition:background .3s}
#dots i.on{background:#9FB4C8}

.nav{position:fixed;top:0;bottom:0;width:clamp(68px,10vw,120px);border:0;background:none;
 color:#9FB4C8;font-size:clamp(38px,5.4vw,58px);font-family:inherit;line-height:1;
 display:flex;align-items:center;justify-content:center;cursor:pointer}
.nav:disabled{color:#202020;cursor:default}
.nav:active:not(:disabled){background:rgba(255,255,255,.05)}
#prev{left:0}#next{right:0}

/* min-height 要比內容高一點：進場動畫（.in 會先往下 20px）跑到一半時，
   沒有這點餘裕 #stage 的 scrollHeight 就會比 clientHeight 大，_verify.js 會判定溢出。
   其他幕頁也是靠同一個 min-height 才量得過。 */
#stage{width:100%;max-width:840px;padding:0 clamp(76px,11vw,130px);text-align:center;
 min-height:clamp(340px,64vh,620px);
 display:flex;flex-direction:column;align-items:center;justify-content:center;
 gap:clamp(6px,1.3vh,14px)}

/* ── 樹 ── */
#tree{display:flex;flex-direction:column;align-items:center;gap:0}
.trow{display:flex;align-items:flex-start;justify-content:center;
 gap:clamp(12px,3vw,42px)}
.link{width:2px;background:#3A3A3A;height:clamp(13px,2.1vh,24px)}
.tn{display:flex;flex-direction:column;align-items:center;gap:2px;
 opacity:.34;transition:opacity .35s,transform .35s;cursor:pointer;min-width:clamp(40px,6vw,62px)}
.tn .ti{font-size:clamp(28px,4.7vh,48px);line-height:1.15}
.tn .tz{font-size:clamp(10px,1.4vh,13px);color:#7E7E7E;white-space:nowrap}
.tn.on{opacity:1;transform:scale(1.16)}
.tn.on .ti{filter:drop-shadow(0 0 16px rgba(159,180,200,.85))}
.tn.on .tz{color:#9FB4C8;font-weight:700}

/* ── 下方的學習焦點（一次只有一個） ── */
.focus{display:flex;flex-direction:column;align-items:center;gap:clamp(3px,.8vh,9px);
 min-height:clamp(78px,13.5vh,136px);justify-content:center}
.fic{font-size:clamp(38px,6.8vh,70px);line-height:1.05}
.fen{font-size:clamp(30px,min(5.8vh,7vw),66px);font-weight:700;letter-spacing:.01em}
.fzh{font-size:clamp(22px,3.8vh,36px);font-weight:700;color:#F2F2F2;letter-spacing:.06em}
.fq{font-size:clamp(40px,7vh,74px);color:#3A3A3A;font-weight:700}
.mid{font-size:clamp(26px,4.4vh,42px);font-weight:700;line-height:1.4;letter-spacing:.03em}
.sub{font-size:clamp(17px,2.5vh,24px);color:#D8D3C5;line-height:1.5}
.sub b{color:#F2F2F2;font-weight:700}
.tag{font-size:clamp(13px,1.7vh,16px);color:#9FB4C8;letter-spacing:.34em;font-weight:700;padding-left:.34em}

/* ── 下方按鈕 ── */
#bottom{position:fixed;left:0;right:0;bottom:max(14px,env(safe-area-inset-bottom));
 display:flex;flex-direction:column;align-items:center;gap:8px;padding:0 10px}
#modes{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
#modes button{background:#131313;border:1px solid #333;color:#8E8E8E;border-radius:99px;
 font-family:inherit;font-size:clamp(12px,1.7vh,15px);padding:6px 13px;min-height:34px;cursor:pointer}
#modes button.on{background:#9FB4C8;border-color:#9FB4C8;color:#0A0A0A;font-weight:700}
#bar{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
#bar button{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;
 font-size:15px;padding:10px 17px;min-height:46px;font-family:inherit;cursor:pointer}
#bar button:active{background:#2A2A2A}

.in{animation:rise .5s cubic-bezier(.2,.9,.3,1) both}
.d1{animation-delay:.10s}.d2{animation-delay:.28s}.d3{animation-delay:.46s}
/* 這一頁的進場**只淡入、不位移**：位移到一半時 #stage 的 scrollHeight 會暫時大於
   clientHeight，_verify.js 就會判定溢出。動感交給 .pop（只縮放不位移）與樹上跳一下。 */
@keyframes rise{0%{opacity:0}100%{opacity:1}}
.pop{animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
@keyframes pop{0%{opacity:0;transform:scale(.4)}100%{opacity:1;transform:scale(1)}}
/* 樹上的人被點名：跳一下 */
.tn.on{animation:hop .6s cubic-bezier(.2,1.5,.4,1) both}
@keyframes hop{0%{transform:scale(.8)}60%{transform:scale(1.3)}100%{transform:scale(1.16)}}
.turnR{animation:turnR .42s cubic-bezier(.25,.85,.3,1) both}
.turnL{animation:turnL .42s cubic-bezier(.25,.85,.3,1) both}
@keyframes turnR{0%{opacity:.2;transform:perspective(1500px) rotateY(48deg) translateX(20px) scale(.95)}
 100%{opacity:1;transform:none}}
@keyframes turnL{0%{opacity:.2;transform:perspective(1500px) rotateY(-48deg) translateX(-20px) scale(.95)}
 100%{opacity:1;transform:none}}
.reduce *{animation:none!important;transition:none!important}
${PH.CSS}
${SRC.CSS}
</style>
</head>
<body>
<div id="dots"></div>
<button class="nav" id="prev" aria-label="上一頁">&#8592;</button>
<div id="stage"></div>
<button class="nav" id="next" aria-label="下一頁">&#8594;</button>
<div id="bottom">
 <div id="modes">
  <button data-m="A">圖示</button><button data-m="B">中文</button><button data-m="C">英文</button>
  <button data-m="D">英＋圖</button><button data-m="E">英＋中</button><button data-m="F">全部</button>
 </div>
 <div id="bar"><button id="say">🔊 念一次</button>${PH.btnSlow}${PH.btnMode}${PH.btnSyl}<button id="back">${P.back.label}</button><button id="home">🏠 首頁</button>${SRC.btn}</div>
</div>
${SRC.html(SRC.P[P.src])}

<script>
${PH.JS}

var N=${JSON.stringify(N)};
var TREE=${JSON.stringify(P.tree)};
var S=${JSON.stringify(P.S)};

/* 顯示模式：A 只圖示／B 只中文／C 只英文／D 英＋圖／E 英＋中／F 全部 */
var MODE="F";
try{var m=localStorage.getItem("treeMode");if(m&&"ABCDEF".indexOf(m)>=0)MODE=m}catch(e){}

var i=0,reduce=false;
try{reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}
if(reduce)document.body.classList.add("reduce");

var dots=document.getElementById("dots");
for(var k=0;k<S.length;k++)dots.appendChild(document.createElement("i"));

/* 樹：其他人只留圖示而且變暗，只有「現在這一個」亮起來 */
function tree(hi){
 var h='<div id="tree">',r,c;
 for(r=0;r<TREE.length;r++){
  if(r)h+='<div class="link"></div>';
  h+='<div class="trow">';
  for(c=0;c<TREE[r].length;c++){
   var key=TREE[r][c],n=N[key],on=(key===hi);
   h+='<div class="tn'+(on?" on":"")+'" data-k="'+key+'" data-say="'+key+'">'+
      '<div class="ti">'+n.ic+'</div></div>';
  }
  h+='</div>';
 }
 return h+'</div>';
}

/* 下方的學習焦點：模式決定看得到什麼 */
function focus(key){
 var n=N[key],h='<div class="focus">';
 if(MODE==="A")      h+='<div class="fic pop">'+n.ic+'</div><div class="fq in d1">？</div>';
 else if(MODE==="B") h+='<div class="fzh in d1" style="font-size:clamp(34px,6vh,60px)">'+n.zh+'</div>';
 else if(MODE==="C") h+='<div class="fen in d1">{{'+key+'}}</div>';
 else if(MODE==="D") h+='<div class="fic pop">'+n.ic+'</div><div class="fen in d1">{{'+key+'}}</div>';
 else if(MODE==="E") h+='<div class="fen in d1">{{'+key+'}}</div><div class="fzh in d2">'+n.zh+'</div>';
 else                h+='<div class="fic pop">'+n.ic+'</div><div class="fen in d1">{{'+key+'}}</div>'+
                        '<div class="fzh in d2">'+n.zh+'</div>';
 return h+'</div>';
}

function draw(s){
 var h="";
 if(s.open||s.end){
  h+='<div class="fic pop">🌳</div>';
  h+='<div class="fen in d1">{{family tree}}</div>';
  if(s.zh)h+='<div class="fzh in d2">'+s.zh+'</div>';
  h+=tree(null);
 }else{
  h+=tree(s.k);
  h+=focus(s.k);
 }
 (s.lines||(s.line?[s.line]:[])).forEach(function(t,k){
  h+='<div class="sub in d'+(k+2)+'">'+t+'</div>'});
 return PH.expand(h);
}

var stage=document.getElementById("stage");
function render(){
 stage.innerHTML=draw(S[i]);
 PH.autoSay(stage);
}
function show(n){
 var back=(n<i);
 i=Math.max(0,Math.min(S.length-1,n));
 render();
 if(!reduce){stage.classList.remove("turnR","turnL");void stage.offsetWidth;
  stage.classList.add(back?"turnL":"turnR")}
 var d=dots.children;
 for(var k=0;k<d.length;k++)d[k].className=(k===i?"on":"");
 document.getElementById("prev").disabled=(i===0);
 document.getElementById("next").disabled=(i===S.length-1);
 say();
}
/* 念一次：這一幕的主角。開場／結尾唸 family tree。 */
function say(){
 var w=S[i].k||"family tree";
 var el=stage.querySelector('.phw[data-say="'+w+'"]');
 if(el){PH.sayWord(el)}else{PH.say(w)}
}

function paintModes(){
 [].forEach.call(document.querySelectorAll("#modes button"),function(b){
  b.classList.toggle("on",b.getAttribute("data-m")===MODE)});
}
document.getElementById("modes").addEventListener("click",function(e){
 var b=e.target.closest("button[data-m]");if(!b)return;
 MODE=b.getAttribute("data-m");
 try{localStorage.setItem("treeMode",MODE)}catch(x){}
 paintModes();render();
});
paintModes();

document.getElementById("prev").addEventListener("click",function(){show(i-1)});
document.getElementById("next").addEventListener("click",function(){show(i+1)});
document.getElementById("say").addEventListener("click",say);
document.addEventListener("keydown",function(e){
 if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();show(i+1)}
 if(e.key==="ArrowLeft")show(i-1);
});
/* 點樹上的人 → 跳到那一幕（順便唸出來） */
stage.addEventListener("click",function(e){
 var t=e.target.closest(".tn");if(!t)return;
 var key=t.getAttribute("data-k"),k;
 for(k=0;k<S.length;k++)if(S[k].k===key){show(k);return}
});
document.getElementById("back").addEventListener("click",function(){
 location.href=${JSON.stringify(P.back.href)}});
document.getElementById("home").addEventListener("click",function(){location.href="../index.html"});
show(0);
${SRC.JS}
</script>
</body>
</html>
`;

PAGES.forEach(p => fs.writeFileSync(path.join(DIR, p.file), tpl(p), 'utf8'));
console.log('已產生：' + PAGES.map(p => p.file).join('  '));
