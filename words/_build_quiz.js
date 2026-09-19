/* words/_build_quiz.js — 暖身題的產生器（quiz.html / quiz-demo.html）
 *
 * 用法： node words/_build_quiz.js
 *
 * quiz.html      = 20 題暖身選擇題（介紹單字之前先玩）
 * quiz-demo.html = 只有一題的試玩版（給使用者測網址用，引擎完全相同）
 *
 * 使用者 2026-09-19 指定的規則，全部寫在這裡，改題目只改 Q 陣列一個地方：
 *  - 每題 4 選 1，倒數 50 秒，秒數要清楚秒懂
 *  - 小組討論後再作答（前 12 秒鎖住選項，老師可按「提前作答」解鎖）
 *  - 答錯要用秒懂方式說明原因（why 欄位）
 *  - 其中 6 題答對得兩倍分數（x2:true），是比較有挑戰性的題目
 *  - 題目要有震撼感、與學生舊認知強烈反差；嚴禁瑣碎、冷僻、湊題數
 *  - 老師按按鈕決定要不要先做（開場的閘門畫面）
 *  - 出處附在最下方，不佔版面（_sources.js 的 #src 覆蓋卡）
 *
 * 20 題全部出自 17 張家人單字卡與故事頁的內容，不考卡片上沒教過的東西。
 */
const fs = require('fs'), path = require('path'), DIR = __dirname;
const SRC = require('./_sources');
const { Q, shuffle } = require('./_quiz_data');

const SHAPE = ['▲', '◆', '●', '■'];

const tpl = (P) => `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${P.title}｜家人單字暖身題</title>
<!-- 本檔由 words/_build_quiz.js 產生，不要手改。改題目請改 _build_quiz.js 的 Q 陣列再重跑。 -->
<style>
@font-face{font-family:Andika;font-style:normal;font-weight:400;font-display:swap;
 src:url(fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-style:normal;font-weight:700;font-display:swap;
 src:url(fonts/andika-700.woff2) format("woff2")}

*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%}
body{margin:0;background:#000;color:#F2F2F2;
 font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif;
 display:flex;flex-direction:column;align-items:center;justify-content:center;
 overflow:hidden;user-select:none}

/* 上排：題號／倒數／分數 —— 倒數要最大、最清楚 */
#hud{position:fixed;top:0;left:0;right:0;height:clamp(84px,13vh,116px);
 display:none;align-items:center;justify-content:space-between;
 padding:0 clamp(14px,3vw,34px);z-index:5}
#hud.on{display:flex}
.meta{font-size:clamp(13px,1.9vh,17px);color:#9FB4C8;letter-spacing:.14em;line-height:1.5;min-width:92px}
.meta b{display:block;color:#F2F2F2;font-size:clamp(20px,3.2vh,28px);letter-spacing:0}
.meta.r{text-align:right}

#clock{position:relative;width:clamp(72px,11vh,100px);height:clamp(72px,11vh,100px);flex:none}
#clock svg{width:100%;height:100%;transform:rotate(-90deg)}
#clock circle{fill:none;stroke-width:8;stroke-linecap:round}
#clock .bg{stroke:#1C1C1C}
#arc{stroke:#9FB4C8;transition:stroke-dashoffset .25s linear,stroke .3s}
#secs{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
 font-size:clamp(28px,4.6vh,40px);font-weight:700;letter-spacing:-.02em}
#clock.warn #arc{stroke:#E0B15C}#clock.warn #secs{color:#E0B15C}
#clock.hot #arc{stroke:#E07A6B}#clock.hot #secs{color:#E07A6B}
#clock.hot{animation:tick 1s ease-in-out infinite}
#clock.held #arc{stroke:#5A5A5A}#clock.held #secs{color:#5A5A5A}
@keyframes tick{0%,100%{transform:scale(1)}50%{transform:scale(1.09)}}

#stage{width:100%;max-width:940px;padding:clamp(88px,13vh,116px) clamp(14px,3vw,32px) clamp(74px,10vh,92px);
 text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;
 gap:clamp(8px,1.8vh,20px)}

.kicker{font-size:clamp(12px,1.6vh,15px);color:#9FB4C8;letter-spacing:.34em;font-weight:700;padding-left:.34em}
.big{font-size:clamp(28px,5vh,46px);font-weight:700;line-height:1.35}
.qtext{font-size:clamp(23px,4vh,38px);font-weight:700;line-height:1.35;max-width:820px}
.note{font-size:clamp(16px,2.4vh,23px);color:#D8D3C5;line-height:1.5;max-width:760px}
.note b{color:#F2F2F2;font-weight:700}

#opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(7px,1.2vh,13px);
 width:100%;max-width:860px;margin-top:clamp(2px,.7vh,8px)}
.opt{display:flex;align-items:center;gap:10px;text-align:left;
 min-height:clamp(54px,8.8vh,78px);padding:clamp(7px,1.2vh,13px) clamp(9px,1.4vw,16px);
 background:#121212;border:1px solid #3A3A3A;border-radius:16px;color:#F2F2F2;
 font-family:inherit;font-size:clamp(18px,2.8vh,27px);font-weight:700;line-height:1.3;cursor:pointer}
.opt .s{font-size:clamp(19px,2.9vh,27px);flex:none;width:1.3em;text-align:center}
.opt:nth-child(1) .s{color:#E07A6B}.opt:nth-child(2) .s{color:#7FA7D4}
.opt:nth-child(3) .s{color:#E0B15C}.opt:nth-child(4) .s{color:#8FBE92}
.opt:active:not(:disabled){background:#1E1E1E}
.opt:disabled{cursor:default}
#opts.lock .opt{opacity:.42}
.opt.right{background:#16301D;border-color:#8FBE92}
.opt.wrong{background:#331A18;border-color:#E07A6B}
.opt.dim{opacity:.3}

.badge{display:inline-block;background:#2A2214;border:1px solid #E0B15C;color:#E0B15C;
 border-radius:99px;padding:5px 16px;font-size:clamp(14px,2vh,19px);font-weight:700;letter-spacing:.08em}
.verdict{font-size:clamp(24px,4.2vh,38px);font-weight:700}
.verdict.ok{color:#8FBE92}.verdict.no{color:#E07A6B}
.gain{font-size:clamp(19px,3vh,28px);color:#E0B15C;font-weight:700}

#bar{position:fixed;bottom:max(16px,env(safe-area-inset-bottom));display:flex;gap:10px;flex-wrap:wrap;
 justify-content:center;padding:0 10px;z-index:6}
#bar button{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;
 font-size:clamp(14px,2vh,16px);padding:11px 20px;min-height:48px;font-family:inherit;cursor:pointer}
#bar button:active{background:#2A2A2A}
#bar button.go{background:#9FB4C8;border-color:#9FB4C8;color:#0A0A0A;font-weight:700}
#bar button.hide{display:none}

.in{animation:rise .42s cubic-bezier(.2,.9,.3,1) both}
.d1{animation-delay:.08s}.d2{animation-delay:.2s}.d3{animation-delay:.32s}
@keyframes rise{0%{opacity:0;transform:translateY(16px) scale(.96)}100%{opacity:1;transform:none}}
.pop{animation:pop .5s cubic-bezier(.2,1.5,.4,1) both}
@keyframes pop{0%{opacity:0;transform:scale(.5)}100%{opacity:1;transform:scale(1)}}
/* 翻卡換頁：下一題像翻開一張新卡 */
.turn{animation:turn .42s cubic-bezier(.25,.85,.3,1) both}
@keyframes turn{0%{opacity:.2;transform:perspective(1500px) rotateY(48deg) translateX(20px) scale(.95)}
 100%{opacity:1;transform:none}}
.shake{animation:shake .5s both}
@keyframes shake{0%,100%{transform:none}20%{transform:translateX(-9px)}40%{transform:translateX(8px)}
 60%{transform:translateX(-5px)}80%{transform:translateX(3px)}}
.reduce *{animation:none!important;transition:none!important}
${SRC.CSS}
</style>
</head>
<body>
<div id="hud">
 <div class="meta">第 <b><span id="qn">1</span>／${'${N}'}</b></div>
 <div id="clock"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="44"></circle>
  <circle id="arc" cx="50" cy="50" r="44"></circle></svg><div id="secs">50</div></div>
 <div class="meta r">分數 <b id="score">0</b></div>
</div>

<div id="stage"></div>

<div id="bar">
 <button id="go" class="go">▶ 開始暖身題</button>
 <button id="skip">⏭ 先不做，直接上單字</button>
 <button id="pause" class="hide">⏸ 暫停</button>
 <button id="unlock" class="hide">✋ 提前作答</button>
 <button id="next" class="hide">下一題 →</button>
 <button id="toword" class="hide">📖 開始上單字 →</button>
 <button id="sound">🔊 音效</button>
 ${SRC.btn}
</div>
${SRC.html(SRC.P.quiz)}

<script>
var Q=${JSON.stringify(P.Q)};
var SHAPE=${JSON.stringify(SHAPE)};
var SEC=50;        // 每題倒數 50 秒
var TALK=12;       // 前 12 秒小組討論，選項鎖住
var N=Q.length;

var reduce=false;
try{reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}
if(reduce)document.body.classList.add("reduce");

var stage=document.getElementById("stage"),hud=document.getElementById("hud"),
    bar={go:document.getElementById("go"),skip:document.getElementById("skip"),
         pause:document.getElementById("pause"),
         unlock:document.getElementById("unlock"),next:document.getElementById("next"),
         toword:document.getElementById("toword"),sound:document.getElementById("sound")},
    elSecs=document.getElementById("secs"),elArc=document.getElementById("arc"),
    elClock=document.getElementById("clock"),elQn=document.getElementById("qn"),
    elScore=document.getElementById("score");

var C=2*Math.PI*44;
elArc.style.strokeDasharray=C;elArc.style.strokeDashoffset=0;

var i=0,score=0,streak=0,best=0,right=0,left=SEC,timer=null,answered=false,locked=true,sound=true,held=false;

/* --- 音效：離線也能用，不靠任何檔案 --- */
var ac=null;
function beep(f,d,type){if(!sound)return;try{
 ac=ac||new (window.AudioContext||window.webkitAudioContext)();
 var o=ac.createOscillator(),g=ac.createGain();
 o.type=type||"sine";o.frequency.value=f;o.connect(g);g.connect(ac.destination);
 g.gain.setValueAtTime(.06,ac.currentTime);
 g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);
 o.start();o.stop(ac.currentTime+d)}catch(e){}}
function sOk(){beep(660,.12);setTimeout(function(){beep(990,.22)},110)}
function sNo(){beep(180,.32,"square")}
function sTick(){beep(1250,.05,"triangle")}

function show(html,cls){
 stage.innerHTML=html;
 if(!reduce){stage.classList.remove("turn");void stage.offsetWidth;stage.classList.add("turn")}
}
function btn(b,on){b.classList.toggle("hide",!on)}

/* --- 閘門：老師決定要不要先做 --- */
function gate(){
 hud.classList.remove("on");stop();
 btn(bar.go,true);btn(bar.skip,true);btn(bar.unlock,false);btn(bar.next,false);btn(bar.toword,true);
 bar.go.textContent="▶ 開始暖身題";
 show('<div class="kicker in">上單字之前</div>'+
  '<div class="emoji pop" style="font-size:clamp(56px,11vh,96px);line-height:1.05">🎯</div>'+
  '<div class="big in d1">家人單字 暖身 '+N+' 題</div>'+
  '<div class="note in d2">四選一　每題倒數 <b>50 秒</b>　<b>先小組討論，再作答</b><br>'+
  '其中 <b>6 題挑戰題</b>，答對 <b>分數 ✕ 2</b></div>'+
  '<div class="note in d3" style="color:#8A8A8A">老師按「開始」才會出題；也可以先不做，直接上單字。</div>');
}
function skipped(){
 hud.classList.remove("on");stop();
 btn(bar.go,true);btn(bar.skip,false);btn(bar.unlock,false);btn(bar.next,false);btn(bar.toword,true);
 bar.go.textContent="▶ 還是來做暖身題";
 show('<div class="kicker in">已跳過</div>'+
  '<div class="emoji pop" style="font-size:clamp(56px,11vh,96px);line-height:1.05">📖</div>'+
  '<div class="big in d1">先上單字</div>'+
  '<div class="note in d2">隨時可以回來按「還是來做暖身題」。</div>');
}

/* --- 倒數 --- */
function stop(){if(timer){clearInterval(timer);timer=null}}
function paint(){
 elSecs.textContent=left;
 elArc.style.strokeDashoffset=C*(1-left/SEC);
 elClock.className=held?"held":(left<=10?"hot":(left<=20?"warn":""));
}
function run(){
 left=SEC;paint();stop();
 timer=setInterval(function(){
  if(held)return;
  left--;if(left<0)left=0;paint();
  if(left<=5&&left>0)sTick();
  if(left===SEC-TALK&&locked)open_();
  if(left<=0){stop();if(!answered)pick(-1)}
 },1000);
}
function open_(){
 locked=false;
 var o=document.getElementById("opts");if(o)o.classList.remove("lock");
 var t=document.getElementById("talk");if(t)t.innerHTML='✋ <b>可以作答了</b>';
 [].forEach.call(document.querySelectorAll(".opt"),function(b){b.disabled=false});
 btn(bar.unlock,false);
 beep(880,.1);
}

/* --- 出題 --- */
function ask(){
 var q=Q[i];answered=false;locked=true;
 hud.classList.add("on");elQn.textContent=(i+1);
 btn(bar.go,false);btn(bar.skip,false);btn(bar.next,false);btn(bar.unlock,true);btn(bar.toword,false);
 held=false;bar.pause.textContent="⏸ 暫停";btn(bar.pause,true);
 var h='';
 if(q.x2)h+='<div class="badge pop">⭐ 挑戰題　答對 分數 ✕ 2</div>';
 h+='<div class="qtext in d1">'+q.q+'</div>';
 h+='<div id="talk" class="note in d2" style="color:#9FB4C8">👥 <b>小組討論中</b>　先討論，'+TALK+' 秒後開放作答</div>';
 h+='<div id="opts" class="lock in d3">'+q.o.map(function(t,k){
  return '<button class="opt" data-k="'+k+'" disabled><span class="s">'+SHAPE[k]+'</span><span>'+t+'</span></button>'
 }).join('')+'</div>';
 show(h);
 [].forEach.call(document.querySelectorAll(".opt"),function(b){
  b.addEventListener("click",function(){pick(+b.getAttribute("data-k"))})});
 run();
}

/* --- 作答（k=-1 代表時間到沒作答） --- */
function pick(k){
 if(answered)return;answered=true;stop();
 var q=Q[i],ok=(k===q.a);
 [].forEach.call(document.querySelectorAll(".opt"),function(b){
  var n=+b.getAttribute("data-k");b.disabled=true;
  if(n===q.a)b.classList.add("right");
  else if(n===k)b.classList.add("wrong");
  else b.classList.add("dim")});
 var gain=0;
 if(ok){gain=q.x2?200:100;score+=gain;right++;streak++;if(streak>best)best=streak;sOk()}
 else{streak=0;sNo();if(!reduce)stage.classList.add("shake")}
 elScore.textContent=score;
 var t=document.getElementById("talk");
 if(t){
  t.innerHTML = ok
   ? '<span class="verdict ok">✅ 答對了！</span>　<span class="gain">'+(q.x2?'100 <b>✕ 2</b> ＝ +200':'+100')+'</span>'+(streak>1?'　🔥 連對 '+streak+' 題':'')
   : '<span class="verdict no">'+(k<0?'⏰ 時間到':'❌ 答錯了')+'</span><br><span class="note" style="display:inline-block;margin-top:6px">'+q.why+'</span>';
  if(ok&&q.why)t.innerHTML+='<br><span class="note" style="display:inline-block;margin-top:6px;color:#8A8A8A">'+q.why+'</span>';
 }
 btn(bar.unlock,false);btn(bar.pause,false);held=false;btn(bar.next,true);
 bar.next.textContent=(i>=N-1)?'看成績 →':'下一題 →';
 setTimeout(function(){stage.classList.remove("shake")},520);
}

function end(){
 hud.classList.remove("on");stop();
 btn(bar.go,true);btn(bar.skip,false);btn(bar.unlock,false);btn(bar.next,false);btn(bar.toword,true);
 bar.go.textContent="↺ 再玩一次";
 var full=N*100+Q.filter(function(q){return q.x2}).length*100;
 show('<div class="kicker in">暖身結束</div>'+
  '<div class="emoji pop" style="font-size:clamp(56px,11vh,96px);line-height:1.05">🏁</div>'+
  '<div class="big in d1">'+score+' 分 ／ '+full+' 分</div>'+
  '<div class="note in d2">答對 <b>'+right+'／'+N+'</b> 題　最長連對 <b>'+best+'</b> 題</div>'+
  '<div class="note in d3" style="color:#8A8A8A">接下來就正式上這些單字。</div>');
}

/* --- 按鈕 --- */
bar.go.addEventListener("click",function(){i=0;score=0;streak=0;best=0;right=0;elScore.textContent=0;ask()});
bar.skip.addEventListener("click",skipped);
bar.unlock.addEventListener("click",open_);
bar.pause.addEventListener("click",function(){
 held=!held;bar.pause.textContent=held?"▶ 繼續":"⏸ 暫停";paint()});
bar.next.addEventListener("click",function(){if(i>=N-1){end()}else{i++;ask()}});
bar.toword.addEventListener("click",function(){location.href="family.html"});
bar.sound.addEventListener("click",function(){sound=!sound;bar.sound.textContent=sound?"🔊 音效":"🔇 靜音"});
document.addEventListener("keydown",function(e){
 if(e.key==="Enter"&&!bar.next.classList.contains("hide")){bar.next.click()}
 if(e.key>="1"&&e.key<="4"&&!locked&&!answered){pick(+e.key-1)}
});

gate();
${SRC.JS}
</script>
</body>
</html>
`;

const ALL = shuffle(Q);
const PAGES = [
 { file: 'quiz.html', title: '暖身 20 題', Q: ALL },
 { file: 'quiz-demo.html', title: '暖身題 試玩一題', Q: [ALL[5]] }   // 第 6 題：⭐挑戰題，震撼感最強
];

PAGES.forEach(p => {
 const html = tpl(p).replace(/\$\{N\}/g, String(p.Q.length));
 fs.writeFileSync(path.join(DIR, p.file), html, 'utf8');
});
console.log('已產生：' + PAGES.map(p => p.file + '（' + p.Q.length + ' 題）').join('  ') +
 '　挑戰題 ' + ALL.filter(q => q.x2).length + ' 題');
