/* sentences/_build_games.js — 10 種複習遊戲（games.html）
 * node sentences/_build_games.js
 * 題庫與驚喜回饋改 _game_data.js，玩法與版面改這裡。
 *
 * 十個遊戲共用一顆引擎（2026-09-21 使用者指定改版）：
 *  - **每一題限時 15 秒**（不是一整場 2 分鐘），圓環 ＋ 大數字
 *  - **愈快答對分數愈高**：基本 100 分 ＋ 速度分（最多 900）＋ 連對加成
 *    答完馬上看到「＋850（速度分 ＋720）」，學生秒懂「快 ＝ 高分」
 *  - 一場 12 題；題序、選項每一次都重新打散 → 每次重玩都不一樣
 *  - **每一個遊戲有自己的 20 種正向驚喜回饋**（_game_data.js 的 SURP），
 *    十個遊戲完全不重複，抽過不再抽 → 學生摸不透、猜不著
 *  - 答錯（或時間到）→ 給鷹架提示，那一題會再回到題庫，練到會為止
 *  - 最佳紀錄存在這台 iPad 上
 */
const fs = require('fs'), DIR = __dirname;
const S = require('./_shared');
const B = require('./_game_data');

const CSS = `
#stage{position:fixed;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch;
 padding:calc(var(--safeT) + clamp(14px,2.6vh,26px)) clamp(14px,3vw,36px)
         calc(clamp(52px,8vh,74px) + var(--safeB)) clamp(14px,3vw,36px)}
#stage.lock{overflow:hidden}

/* ── 遊戲大廳 ── */
#hub{display:flex;flex-direction:column;align-items:center;gap:clamp(10px,1.8vh,20px);min-height:100%}
#hub h1{margin:0;font-size:clamp(24px,4.6vh,44px);font-weight:700;text-align:center}
#hub .lead{margin:0;font-size:clamp(13px,2.1vh,19px);color:var(--dim);text-align:center;max-width:44ch;line-height:1.6}
#grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,252px),1fr));
 gap:clamp(8px,1.4vh,14px);width:100%;max-width:1120px}
.gcard{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:4px;
 text-align:left;background:linear-gradient(180deg,#0E0E0E,#050505);
 border:1px solid #272727;border-radius:18px;color:var(--fg);
 padding:clamp(11px,1.9vh,18px) clamp(12px,1.7vw,20px);min-height:clamp(104px,15vh,140px)}
.gcard:active{transform:scale(.985);border-color:var(--acc)}
.gcard .gn{position:absolute;top:clamp(8px,1.3vh,13px);right:clamp(11px,1.5vw,17px);
 font-size:clamp(18px,3vh,28px);font-weight:700;color:#232323;line-height:1}
.gcard .gi{font-size:clamp(25px,4.2vh,38px);line-height:1.1}
.gcard .gt{font-size:clamp(17px,2.7vh,24px);font-weight:700}
.gcard .gr{font-size:clamp(12px,1.85vh,16px);color:var(--dim);line-height:1.45}
.gcard .gb{margin-top:auto;font-size:clamp(11px,1.6vh,14px);color:#5C5C5C;letter-spacing:.06em}
.gcard .gb b{color:var(--gold);font-weight:700}

/* ── 遊戲 HUD ── */
#ghud{display:none;align-items:center;justify-content:space-between;gap:clamp(8px,1.6vw,20px);
 width:100%;max-width:1120px;margin:0 auto clamp(8px,1.5vh,16px)}
#ghud.on{display:flex}
#gring{position:relative;width:clamp(58px,9vh,88px);height:clamp(58px,9vh,88px);flex:0 0 auto}
#gring svg{width:100%;height:100%;transform:rotate(-90deg)}
#gring circle{fill:none;stroke-width:8;stroke-linecap:round}
#gbg{stroke:#1C1C1C}#gfg{stroke:var(--ok);transition:stroke-dashoffset .25s linear,stroke .3s}
#gnum{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
 font-size:clamp(17px,2.9vh,28px);font-weight:700}
#gring.warn #gfg{stroke:var(--be)}#gring.warn #gnum{color:var(--be)}
#gring.dang #gfg{stroke:var(--no)}#gring.dang #gnum{color:var(--no);animation:thump .5s infinite}
@keyframes thump{0%,100%{transform:scale(1)}50%{transform:scale(1.14)}}
.gcell{display:flex;flex-direction:column;gap:1px}
.gcell .k{font-size:clamp(10px,1.45vh,13px);color:#5C5C5C;letter-spacing:.12em}
.gcell .v{font-size:clamp(16px,2.7vh,26px);font-weight:700}
.gcell.r{align-items:flex-end;text-align:right}
#gstreak{color:var(--gold)}
#gname{font-size:clamp(13px,2.1vh,19px);font-weight:700;color:var(--acc)}

/* 驚喜事件橫幅 */
#evt{position:fixed;left:50%;top:22%;transform:translate(-50%,-50%) scale(.7);z-index:60;
 opacity:0;pointer-events:none;text-align:center;
 background:#160F00;border:2px solid var(--gold);border-radius:20px;
 padding:clamp(11px,2vh,22px) clamp(18px,3vw,40px);box-shadow:0 0 60px rgba(255,210,74,.28)}
#evt.on{animation:evt 1.9s cubic-bezier(.2,.9,.3,1.2)}
#evt .et{font-size:clamp(20px,3.6vh,36px);font-weight:700;color:var(--gold)}
#evt .ed{font-size:clamp(12.5px,2vh,18px);color:var(--body);margin-top:4px}
@keyframes evt{0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}
 14%{opacity:1;transform:translate(-50%,-50%) scale(1.07)}
 22%{transform:translate(-50%,-50%) scale(1)}
 78%{opacity:1;transform:translate(-50%,-50%) scale(1)}
 100%{opacity:0;transform:translate(-50%,-80%) scale(.92)}}

/* ── 遊戲場 ── */
#arena{display:none;flex-direction:column;align-items:center;gap:clamp(8px,1.5vh,16px);
 width:100%;max-width:1080px;margin:0 auto}
#arena.on{display:flex}
.qh{font-size:clamp(19px,3.6vh,34px);font-weight:700;text-align:center;line-height:1.35;max-width:28ch}
.qs{font-size:clamp(13px,2.1vh,20px);color:var(--acc);text-align:center}
.qbig{font-size:clamp(25px,5vh,50px);font-weight:700;text-align:center;line-height:1.2}
.qzh{font-size:clamp(14px,2.3vh,22px);color:var(--acc);text-align:center}
.tagline{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.tg{font-size:clamp(11px,1.65vh,14px);letter-spacing:.08em;color:var(--acc);
 border:1px solid #2C3A48;border-radius:999px;padding:3px 11px}
.tg.hot{color:var(--gold);border-color:#5A4A18;background:#1A1508;font-weight:700}

.opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(7px,1.2vh,13px);width:100%}
.opts.one{grid-template-columns:1fr}
.o{display:flex;align-items:center;gap:clamp(7px,1.2vw,14px);text-align:left;
 background:#0C0C0C;border:1px solid #262626;border-radius:15px;color:var(--fg);
 font-size:clamp(15px,2.5vh,25px);line-height:1.3;
 padding:clamp(9px,1.7vh,18px) clamp(11px,1.7vw,22px);min-height:clamp(50px,7.8vh,80px)}
.o .sh{flex:0 0 auto;width:1.25em;text-align:center;font-size:.82em}
.o.s0 .sh{color:#FF5E5E}.o.s1 .sh{color:#F5B301}.o.s2 .sh{color:#39D98A}.o.s3 .sh{color:#5AA9FF}
.o:active{transform:scale(.985)}
.o.ok{background:#0F3323;border-color:var(--ok)}
.o.bad{background:#3A1111;border-color:var(--no)}
.o.dim{opacity:.3}

/* 兩顆大按鈕（他／她、問句／直述句） */
.duo{display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,1.5vw,18px);width:100%}
.dbtn{border-radius:20px;border:2px solid #2A2A2A;background:#0A0A0A;color:var(--fg);
 min-height:clamp(84px,15vh,150px);display:flex;flex-direction:column;align-items:center;
 justify-content:center;gap:5px;font-size:clamp(24px,4.4vh,44px);font-weight:700}
.dbtn .ds{font-size:clamp(12px,1.9vh,17px);color:var(--dim);font-weight:400}
.dbtn.he{border-color:var(--he)}.dbtn.he.fill{background:var(--he)}
.dbtn.she{border-color:var(--she)}.dbtn.she.fill{background:var(--she)}
.dbtn.st{border-color:#3A6E52}.dbtn.qu{border-color:#3A5A7E}
.dbtn:active{transform:scale(.97)}
.dbtn.ok{background:#0F3323;border-color:var(--ok)}
.dbtn.bad{background:#3A1111;border-color:var(--no)}

/* 語序／火眼金睛的字塊 */
.chips{display:flex;flex-wrap:wrap;gap:clamp(6px,1vw,11px);justify-content:center;width:100%}
.cw{background:#111;border:1px solid #2C2C2C;border-radius:13px;color:var(--fg);
 font-size:clamp(18px,3.2vh,32px);font-weight:700;
 padding:clamp(7px,1.3vh,14px) clamp(11px,1.6vw,22px)}
.cw:active{transform:scale(.95)}
.cw.used{opacity:.18;pointer-events:none}
.cw.ok{background:#0F3323;border-color:var(--ok)}
.cw.bad{background:#3A1111;border-color:var(--no);animation:shake .4s}
.slotline{display:flex;flex-wrap:wrap;gap:clamp(5px,.9vw,10px);justify-content:center;
 min-height:clamp(46px,7vh,72px);align-items:center;width:100%;
 border-bottom:2px dashed #272727;padding-bottom:clamp(6px,1.1vh,12px)}
.slotline .cw{background:#1A2430;border-color:#39536E}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}
 50%{transform:translateX(7px)}75%{transform:translateX(-4px)}}

/* 記憶配對 */
.board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(6px,1.1vw,12px);width:100%}
.mc{min-height:clamp(62px,11vh,116px);border-radius:15px;border:1px solid #2A2A2A;background:#0C0C0C;
 color:var(--fg);font-size:clamp(13px,2.15vh,21px);font-weight:700;line-height:1.25;
 display:flex;align-items:center;justify-content:center;text-align:center;padding:6px;
 transition:transform .22s,background .2s,opacity .3s}
.mc.back{background:#151B22;color:#3E4C5A;font-size:clamp(20px,3.4vh,32px)}
.mc.ok{background:#0F3323;border-color:var(--ok)}
.mc.bad{background:#3A1111;border-color:var(--no)}
.mc.gone{opacity:0;pointer-events:none;transform:scale(.6)}
.mc:active{transform:scale(.96)}

/* 魔王血條 */
#boss{display:flex;flex-direction:column;align-items:center;gap:6px;width:100%;max-width:640px}
#bossface{font-size:clamp(34px,6.4vh,64px);line-height:1}
#bossface.hit{animation:hit .4s}
@keyframes hit{0%,100%{transform:none}30%{transform:translateX(-10px) rotate(-7deg)}
 60%{transform:translateX(8px) rotate(6deg)}}
#hpbar{width:100%;height:clamp(13px,2.1vh,20px);background:#1A1A1A;border-radius:999px;overflow:hidden;
 border:1px solid #2A2A2A}
#hp{height:100%;width:100%;background:linear-gradient(90deg,#FF5E5E,#FF9A4A);
 transition:width .45s cubic-bezier(.2,.8,.3,1)}

/* 回饋 */
#gfb{min-height:clamp(40px,6.6vh,64px);display:flex;flex-direction:column;align-items:center;
 justify-content:center;gap:3px;text-align:center;width:100%}
#gfb .fh{font-size:clamp(16px,2.7vh,26px);font-weight:700}
#gfb .fh.ok{color:var(--ok)}#gfb .fh.no{color:var(--no)}
#gfb .fw{font-size:clamp(13px,2.05vh,19px);color:var(--body);line-height:1.45;max-width:40ch}
#gfb .fw b{color:var(--gold)}

/* 結算 */
#gend{display:none;flex-direction:column;align-items:center;gap:clamp(7px,1.4vh,14px);
 text-align:center;width:100%;max-width:760px;margin:0 auto}
#gend.on{display:flex}
#gend h2{margin:0;font-size:clamp(23px,4.4vh,42px)}
#gend .sc{font-size:clamp(38px,7.4vh,76px);font-weight:700;color:var(--gold);line-height:1}
#gend .ln{font-size:clamp(13px,2.15vh,20px);color:var(--dim)}
#gend .rev{width:100%;text-align:left;background:#0A0A0A;border:1px solid #232323;border-radius:14px;
 padding:clamp(9px,1.6vh,16px);max-height:34vh;overflow-y:auto}
#gend .rev div{font-size:clamp(12.5px,2vh,18px);color:var(--body);line-height:1.55;
 padding:4px 0;border-bottom:1px solid #161616}
#gend .rev b{color:var(--gold)}
.big{background:var(--btn);border:1px solid var(--line);border-radius:15px;color:var(--fg);
 font-size:clamp(15px,2.5vh,24px);font-weight:700;padding:clamp(9px,1.7vh,17px) clamp(16px,2.6vw,32px)}
.big.go{background:#123A26;border-color:var(--ok);color:#EAFFF3}
.big:active{transform:scale(.97)}
.rowbtn{display:flex;gap:clamp(7px,1.3vw,14px);flex-wrap:wrap;justify-content:center}
`;

const JS = `
var BANK=__BANK__, META=__META__, SURP=__SURP__;
var SHAPE=['▲','◆','●','■'];
var QT=15, ROUNDQ=12;                 /* 每一題 15 秒，一場 12 題（使用者 2026-09-21 指定） */
var g=null,queue=[],cur=null,left=QT,qt=QT,tick=null,score=0,streak=0,best=0,right=0,wrong=0;
var asked=0,speedSum=0,shield=0;
var mult=1,multLeft=0,fast=0,wrongList=[],busy=false,memPairs=[],memOpen=[],memLeft=0;
var bossHP=100,bossMax=100;
var pool=[];

var R=2*Math.PI*46;$('#gfg').setAttribute('stroke-dasharray',R);

/* ── 驚喜回饋：每一個遊戲 20 種，抽過不重複，十個遊戲都不一樣 ── */
var nextEvt=2+Math.floor(Math.random()*3);
function doEvt(e){
  if(e.k==='pts')score+=e.v;
  else if(e.k==='x2'){mult=2;multLeft=e.v}
  else if(e.k==='x3'){mult=3;multLeft=e.v}
  else if(e.k==='time'){left=left+e.v;qt=Math.max(qt,left)}
  else if(e.k==='fast')fast=Date.now();
  else if(e.k==='streak'){streak+=e.v;if(streak>best)best=streak}
  else if(e.k==='shield')shield=1;
}
function fire(){
  if(!pool.length)pool=shuf((SURP[g]||[]).slice());
  var e=pool.shift();if(!e)return;
  $('#evt .et').textContent=e.t;$('#evt .ed').textContent=e.d;
  doEvt(e);
  var box=$('#evt');box.classList.remove('on');void box.offsetWidth;box.classList.add('on');
  sWow();paint();
  nextEvt=2+Math.floor(Math.random()*3);
}

/* ── 大廳 ── */
function hub(){
  stop();
  $('#hub').style.display='';$('#ghud').classList.remove('on');
  $('#arena').classList.remove('on');$('#gend').classList.remove('on');
  $('#stage').classList.remove('lock');
  $('#grid').innerHTML=META.map(function(m,n){
    var b=store('best_'+m.id)||0;
    return '<button class="gcard" data-g="'+m.id+'"><span class="gn">'+(n+1)+'</span>'+
      '<span class="gi">'+m.ic+'</span><span class="gt">'+m.name+'</span>'+
      '<span class="gr">'+m.rule+'</span>'+
      '<span class="gb">'+m.n+' 題庫　一場 '+ROUNDQ+' 題　每題 '+QT+' 秒'+(b?'　最佳 <b>'+b+'</b>':'')+'</span></button>';
  }).join('');
}
$('#grid').addEventListener('click',function(e){
  var c=e.target.closest?e.target.closest('.gcard'):null;
  if(c)begin(c.getAttribute('data-g'));
});

/* ── 開一場 ── */
function begin(id){
  g=id;
  score=0;streak=0;best=0;right=0;wrong=0;mult=1;multLeft=0;fast=0;wrongList=[];busy=false;
  asked=0;speedSum=0;shield=0;pool=shuf((SURP[id]||[]).slice());
  left=QT;qt=QT;nextEvt=2+Math.floor(Math.random()*3);
  bossHP=bossMax=100;
  memLeft=0;memOpen=[];memPairs=[];
  queue=shuf(BANK[id].slice());
  $('#hub').style.display='none';$('#ghud').classList.add('on');
  $('#arena').classList.add('on');$('#gend').classList.remove('on');
  var m=META.filter(function(x){return x.id===id})[0];
  $('#gname').textContent=m.ic+' '+m.name;
  next();
}
/* 每一題自己的倒數：時間到就算答錯，給提示再出下一題 */
function run(sec){
  if(tick)clearInterval(tick);
  qt=sec||QT;left=qt;paint();
  tick=setInterval(function(){
    left-=0.1;
    if(left<=0){left=0;paint();tstop();timeUp();return}
    if(left<=5&&Math.abs(left-Math.round(left))<0.05)sTick();
    paint();
  },100);
}
function timeUp(){
  if(busy)return;
  if(g==='g6'){busy=true;sNo();streak=0;paint();
    $('#gfb').innerHTML='<div class="fh no">⏰ 時間到！</div><div class="fw">記住位置，下一局會更快。</div>';
    asked++;memLeft=0;
    setTimeout(function(){if(asked>=ROUNDQ)over();else{busy=false;next()}},1600);return}
  judge(false,cur?cur.h:'',null,true);
}
function tstop(){if(tick){clearInterval(tick);tick=null}}   /* 只停這一題的倒數 */
function stop(){tstop();sayStop()}                          /* 離開遊戲才連發音一起停 */
function paint(){
  $('#gnum').textContent=Math.ceil(left);
  $('#gfg').setAttribute('stroke-dashoffset',R*(1-left/qt));
  $('#gring').className=left<=5?'dang':(left<=8?'warn':'');
  $('#gsc').textContent=score;
  $('#gstreak').textContent=(shield?'🛡 ':'')+(streak?'🔥 '+streak:'—');
  $('#gprog').textContent=asked+' ／ '+ROUNDQ+' 題';
}

/* ── 出下一題 ── */
function next(){
  busy=false;
  var fb=$('#gfb');if(fb)fb.innerHTML='';   /* 第一題時 #gfb 還沒被畫出來 */
  if(asked>=ROUNDQ){over();return}
  if(!queue.length)queue=shuf(BANK[g].slice());
  cur=queue.shift();
  ({g1:rMcq,g2:rTwo,g3:rOrder,g4:rTrans,g5:rHear,g6:rMem,g7:rSpot,g8:rFill,g9:rSort,g10:rBoss}[g])();
  run(g==='g6'?QT*4:QT);     /* 記憶配對一局四對，時間比照四題 */
}
function tags(extra){
  var h='';
  if(multLeft>0)h+='<span class="tg hot">分數 ✕ '+mult+'（剩 '+multLeft+' 題）</span>';
  if(fast)h+='<span class="tg hot">🎯 急速題</span>';
  if(extra)h+='<span class="tg">'+extra+'</span>';
  return h?'<div class="tagline">'+h+'</div>':'';
}

/* ── 判定 ── */
/* 愈快答對，分數愈高（使用者 2026-09-21 指定）：
   基本 100 分 ＋ 速度分（剩下的秒數 ／ 總秒數 ✕ 900）＋ 連對加成，最後再乘上倍率 */
function judge(ok,hint,after,timeout){
  if(busy)return;busy=true;
  tstop();
  var bonus=0;
  asked++;
  if(ok){
    right++;streak++;if(streak>best)best=streak;
    var sp=Math.round(900*(left/qt));speedSum+=sp;
    var p=100+sp+streak*20;
    if(fast&&Date.now()-fast<5000){bonus=200;fast=0}
    else if(fast&&Date.now()-fast>=5000){fast=0}
    p=p*mult+bonus;
    score+=p;sOk();
    if(multLeft>0){multLeft--;if(multLeft===0)mult=1}
    $('#gfb').innerHTML='<div class="fh ok">✅ ＋'+p+'</div>'+
      '<div class="fw">⚡ 速度分 ＋'+sp+'（剩 '+left.toFixed(1)+' 秒）'+
      (streak>1?'　🔥 連對 ＋'+(streak*20):'')+(mult>1?'　✕ '+mult:'')+
      (bonus?'　🎯 急速 ＋200':'')+'</div>';
    nextEvt--;
    if(nextEvt<=0)setTimeout(fire,320);
  }else{
    wrong++;
    if(shield){shield=0;$('#gstreak').textContent='🔥 '+streak}else streak=0;
    sNo();
    $('#gfb').innerHTML='<div class="fh no">'+(timeout?'⏰ 時間到！':'❌ 再想一下')+'</div>'+
      '<div class="fw">'+ap(hint||'')+'</div>';
    queue.splice(Math.min(queue.length,2+Math.floor(Math.random()*3)),0,cur); /* 練到會為止 */
    if(hint&&wrongList.indexOf(hint)<0)wrongList.push(hint);
  }
  paint();
  setTimeout(function(){
    if(!$('#arena').classList.contains('on'))return;
    if(asked>=ROUNDQ){over();return}
    (after||next)();
  },ok?1000:2000);
}

/* ── 1 ⚡ 閃電四選一 ── */
function rMcq(){
  var o=shuf(cur.o.map(function(x,n){return{x:x,n:n}}));
  $('#arena').innerHTML=tags('⚡ 閃電')+'<h2 class="qh">'+ap(cur.q)+'</h2>'+
    '<div class="opts">'+o.map(function(t,n){
      return '<button class="o s'+n+'" data-ok="'+(t.n===0)+'"><span class="sh">'+SHAPE[n]+
        '</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>'+fbBox();
  bindO();
}
/* ── 2 🔵 他還是她 ── */
function rTwo(){
  $('#arena').innerHTML=tags('🔵🩷 他還是她')+
    '<div class="qbig">'+ap(cur.txt)+'</div><div class="qzh">'+cur.zh+'</div>'+
    '<div class="duo">'+
     '<button class="dbtn he" data-v="he">He<span class="ds">他　男生</span></button>'+
     '<button class="dbtn she" data-v="she">She<span class="ds">她　女生</span></button>'+
    '</div>'+fbBox();
  $$('.dbtn').forEach(function(b){b.addEventListener('click',function(){
    if(busy)return;var ok=b.getAttribute('data-v')===cur.a;
    b.classList.add(ok?'ok':'bad');
    if(!ok)$$('.dbtn').forEach(function(x){if(x.getAttribute('data-v')===cur.a)x.classList.add('ok')});
    say(cur.a==='he'?'He':'She');judge(ok,cur.h);
  })});
}
/* ── 3 🧩 語序大挑戰 ── */
function rOrder(){
  var need=cur.s,got=[];
  $('#arena').innerHTML=tags('🧩 語序')+'<div class="qzh">'+cur.zh+'</div>'+
    '<div class="slotline" id="slot"></div>'+
    '<div class="chips" id="pool">'+shuf(need.map(function(w,n){return{w:w,n:n}})).map(function(t){
      return '<button class="cw" data-n="'+t.n+'">'+ap(t.w)+'</button>'}).join('')+'</div>'+fbBox();
  $('#pool').addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('.cw'):null;if(!b||busy)return;
    var n=parseInt(b.getAttribute('data-n'),10);
    if(n===got.length){
      got.push(n);b.classList.add('used');sPop();
      var c=el('button','cw',ap(need[n]));$('#slot').appendChild(c);
      var w=need[n];if(/[A-Za-z]/.test(w))say(w);
      if(got.length===need.length){
        $$('#slot .cw').forEach(function(x){x.classList.add('ok')});
        setTimeout(function(){say(need.join(' ').replace(/ ([?.,])/g,'$1'))},260);
        judge(true,'');
      }
    }else{b.classList.add('bad');setTimeout(function(){b.classList.remove('bad')},420);
      judge(false,cur.h);}
  });
}
/* ── 4 🔄 變身術 ── */
function rTrans(){
  var o=shuf(cur.o.map(function(x,n){return{x:x,n:n}}));
  $('#arena').innerHTML=tags('🔄 變身術')+
    '<div class="qbig" data-say="'+cur.f.replace(/"/g,'&quot;')+'">'+ap(cur.f)+'</div>'+
    '<div class="qs">'+cur.d+'</div>'+
    '<div class="opts">'+o.map(function(t,n){
      return '<button class="o s'+n+'" data-ok="'+(t.n===0)+'"><span class="sh">'+SHAPE[n]+
        '</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>'+fbBox();
  say(cur.f);bindO();
}
/* ── 5 🎧 聽力狙擊 ── */
function rHear(){
  var o=shuf(cur.o.map(function(x,n){return{x:x,n:n}}));
  $('#arena').innerHTML=tags('🎧 聽力狙擊')+
    '<h2 class="qh">聽一聽，射下正確的那一張</h2>'+
    '<button class="big" id="rep">🔊 再聽一次</button>'+
    '<div class="opts">'+o.map(function(t,n){
      return '<button class="o s'+n+'" data-ok="'+(t.n===0)+'"><span class="sh">'+SHAPE[n]+
        '</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>'+fbBox();
  $('#rep').addEventListener('click',function(){say(cur.s)});
  setTimeout(function(){say(cur.s)},260);
  bindO();
}
/* ── 6 🃏 記憶配對 ── */
function rMem(){
  if(!memLeft){
    var four=shuf(BANK.g6).slice(0,4);
    memPairs=four;memLeft=4;memOpen=[];
    var cards=[];
    four.forEach(function(p,n){cards.push({k:n,s:p[0],en:1});cards.push({k:n,s:p[1],en:0})});
    cards=shuf(cards);
    $('#arena').innerHTML=tags('🃏 記憶配對')+'<div class="qs">翻開兩張，英文配中文</div>'+
      '<div class="board" id="bd">'+cards.map(function(c,n){
        return '<button class="mc back" data-k="'+c.k+'" data-n="'+n+'" data-en="'+c.en+
          '" data-s="'+String(c.s).replace(/"/g,'&quot;')+'">？</button>'}).join('')+'</div>'+fbBox();
    $('#bd').addEventListener('click',memTap);
  }
}
function memTap(e){
  var b=e.target.closest?e.target.closest('.mc'):null;
  if(!b||busy||!b.classList.contains('back')||memOpen.length>=2)return;
  b.classList.remove('back');b.innerHTML=ap(b.getAttribute('data-s'));
  if(b.getAttribute('data-en')==='1')say(b.getAttribute('data-s'));else sayZh(b.getAttribute('data-s'));
  memOpen.push(b);sPop();
  if(memOpen.length===2){
    var a=memOpen[0],c=memOpen[1];
    if(a.getAttribute('data-k')===c.getAttribute('data-k')&&a!==c){
      a.classList.add('ok');c.classList.add('ok');memOpen=[];memLeft--;
      right++;streak++;if(streak>best)best=streak;
      var sp=Math.round(900*(left/qt)/4);speedSum+=sp;
      var p=(150+sp+streak*20)*mult;score+=p;sOk();
      if(multLeft>0){multLeft--;if(multLeft===0)mult=1}
      nextEvt--;if(nextEvt<=0)setTimeout(fire,300);
      $('#gfb').innerHTML='<div class="fh ok">✅ ＋'+p+'</div><div class="fw">⚡ 速度分 ＋'+sp+'</div>';
      paint();
      setTimeout(function(){a.classList.add('gone');c.classList.add('gone');
        if(!memLeft){asked++;paint();
          if(asked>=ROUNDQ)over();
          else setTimeout(function(){rMem();run(QT*4)},380)}},420);
    }else{
      busy=true;a.classList.add('bad');c.classList.add('bad');sNo();streak=0;wrong++;paint();
      setTimeout(function(){[a,c].forEach(function(x){
        x.classList.remove('bad');x.classList.add('back');x.innerHTML='？'});
        memOpen=[];busy=false},780);
    }
  }
}
/* ── 7 🔍 火眼金睛 ── */
function rSpot(){
  $('#arena').innerHTML=tags('🔍 火眼金睛')+'<div class="qzh">'+cur.zh+'</div>'+
    '<div class="chips" id="pool">'+cur.w.map(function(w,n){
      return '<button class="cw" data-n="'+n+'">'+ap(w)+'</button>'}).join('')+'</div>'+
    '<button class="big" id="none">✅ 這句沒錯</button>'+fbBox();
  $('#pool').addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('.cw'):null;if(!b||busy)return;
    var n=parseInt(b.getAttribute('data-n'),10);
    var ok=(n===cur.b);
    b.classList.add(ok?'ok':'bad');
    judge(ok,cur.b<0?'這一句<b>完全正確</b>，要按「✅ 這句沒錯」。':
      ('錯的是 <b>'+cur.w[cur.b]+'</b> → 要改成 <b>'+cur.fix+'</b>。'+cur.h));
  });
  $('#none').addEventListener('click',function(){
    if(busy)return;
    var ok=(cur.b<0);
    this.classList.add(ok?'ok':'bad');
    judge(ok,ok?'':('這一句有錯：<b>'+cur.w[cur.b]+'</b> 要改成 <b>'+cur.fix+'</b>。'+cur.h));
  });
}
/* ── 8 ✏️ 填空高手 ── */
function rFill(){
  var o=shuf(cur.o.map(function(x,n){return{x:x,n:n}}));
  $('#arena').innerHTML=tags('✏️ 填空')+
    '<div class="qbig">'+ap(cur.b)+' <span style="color:var(--be)">＿＿</span> '+ap(cur.a)+'</div>'+
    '<div class="qzh">'+cur.zh+'</div>'+
    '<div class="opts">'+o.map(function(t,n){
      return '<button class="o s'+n+'" data-ok="'+(t.n===0)+'"><span class="sh">'+SHAPE[n]+
        '</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>'+fbBox();
  bindO();
}
/* ── 9 🗂 分類大師 ── */
function rSort(){
  $('#arena').innerHTML=tags('🗂 分類')+
    '<div class="qbig" data-say="'+cur[0].replace(/"/g,'&quot;')+'">'+ap(cur[0])+'</div>'+
    '<div class="duo">'+
     '<button class="dbtn st" data-v="s">🙋<span class="ds">直述句　在講一件事</span></button>'+
     '<button class="dbtn qu" data-v="q">❓<span class="ds">問句　在問問題</span></button>'+
    '</div>'+fbBox();
  say(cur[0]);
  $$('.dbtn').forEach(function(b){b.addEventListener('click',function(){
    if(busy)return;var ok=b.getAttribute('data-v')===cur[1];
    b.classList.add(ok?'ok':'bad');
    judge(ok,cur[1]==='q'?'句尾是 <b>?</b>，而且 <b>Is／Who</b> 放在最前面 → <b>問句</b>。':
      '句尾是 <b>.</b>，主詞放最前面 → <b>直述句</b>。');
  })});
}
/* ── 10 👑 魔王挑戰 ── */
function rBoss(){
  var o=shuf(cur.o.map(function(x,n){return{x:x,n:n}}));
  var face=bossHP>66?'👹':bossHP>33?'😡':'🥵';
  $('#arena').innerHTML=tags('👑 魔王挑戰')+
    '<div id="boss"><div id="bossface">'+face+'</div>'+
    '<div id="hpbar"><div id="hp" style="width:'+bossHP+'%"></div></div>'+
    '<div class="qs">魔王血量 '+bossHP+'%</div></div>'+
    '<h2 class="qh">'+ap(cur.q)+'</h2>'+
    '<div class="opts">'+o.map(function(t,n){
      return '<button class="o s'+n+'" data-ok="'+(t.n===0)+'"><span class="sh">'+SHAPE[n]+
        '</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>'+fbBox();
  $('.opts').addEventListener('click',bossTap);
}
function bossTap(e){
  var b=e.target.closest?e.target.closest('.o'):null;if(!b||busy)return;
  var ok=b.getAttribute('data-ok')==='true';
  markO(b,ok);
  if(ok){
    bossHP=Math.max(0,bossHP-10);   /* 打十下倒，一場 12 題打得完 */
    $('#hp').style.width=bossHP+'%';
    $('#bossface').classList.add('hit');
    if(bossHP<=0){sWow();stop();setTimeout(win,700);return}
    judge(true,'');
  }else{
    var sk=pick([
      {t:'🌀 魔王技能：偷走 10 秒',f:function(){left=Math.max(5,left-10)}},
      {t:'🎲 魔王技能：選項洗牌',f:function(){}},
      {t:'💢 魔王回血 5%',f:function(){bossHP=Math.min(100,bossHP+5);$('#hp').style.width=bossHP+'%'}}
    ]);
    sk.f();
    $('#evt .et').textContent=sk.t;$('#evt .ed').textContent='答對就能扳回來！';
    var bx=$('#evt');bx.classList.remove('on');void bx.offsetWidth;bx.classList.add('on');
    judge(false,cur.h);
  }
}
function win(){
  $('#arena').classList.remove('on');
  $('#gend').classList.add('on');
  score+=1000;
  $('#gendh').textContent='🏆 魔王被打倒了！（獎勵 ＋1000）';
  endBody();
}

/* ── 共用：四選一的綁定 ── */
function fbBox(){return '<div id="gfb"></div>'}
function bindO(){
  $$('.o').forEach(function(b){b.addEventListener('click',function(){
    if(busy)return;
    var ok=b.getAttribute('data-ok')==='true';
    markO(b,ok);
    judge(ok,cur.h);
  })});
}
function markO(b,ok){
  $$('.o').forEach(function(x){
    if(x.getAttribute('data-ok')==='true')x.classList.add('ok');
    else if(x===b)x.classList.add('bad');else x.classList.add('dim')});
}

/* ── 結算 ── */
function over(){
  stop();
  $('#arena').classList.remove('on');$('#gend').classList.add('on');
  $('#gendh').textContent='🏁 這一場結束！';
  endBody();
}
function endBody(){
  stop();
  var b=store('best_'+g)||0;
  if(score>b){store('best_'+g,score);b=score;$('#gendh').textContent+='　🎉 破紀錄！'}
  $('#gendsc').textContent=score;
  $('#gendln').innerHTML='答對 <b>'+right+'</b> 題　答錯 <b>'+wrong+'</b> 題　最長連對 <b>'+best+
    '</b>　速度分共 <b>'+speedSum+'</b>　最佳紀錄 <b>'+b+'</b>';
  $('#gendrev').innerHTML=wrongList.length?
    ('<div style="color:#5C5C5C;letter-spacing:.1em">📌 這一場要記住的：</div>'+
     wrongList.map(function(h){return '<div>・'+ap(h)+'</div>'}).join('')):
    '<div>全對！一題都沒錯 🎉</div>';
  sWow();
}
$('#retry').addEventListener('click',function(){begin(g)});
$('#backhub').addEventListener('click',hub);
$('#quit').addEventListener('click',function(){
  if($('#arena').classList.contains('on')||$('#gend').classList.contains('on'))hub();
});
$('#slowBtn').addEventListener('click',function(){
  SLOW=!SLOW;this.classList.toggle('on',SLOW);this.innerHTML=SLOW?'🐢 放慢 開':'🐢 放慢 關'});
$('#muteBtn').addEventListener('click',function(){
  MUTE=!MUTE;this.classList.toggle('on',!MUTE);this.innerHTML=MUTE?'🔇 音效 N':'🔊 音效 Y'});
hub();
`;

const body = `
<div id="evt"><div class="et"></div><div class="ed"></div></div>

<main id="stage">
 <section id="hub">
  <h1>🎮 複習遊戲　10 種玩法</h1>
  <p class="lead">每一題<b>限時 15 秒</b>，一場 12 題。<b>愈快答對，分數愈高</b>——
     答完馬上看到速度分。<br>
     每一個遊戲都有<b>自己的 20 種驚喜回饋</b>，十個遊戲完全不一樣，
     抽到什麼<b>猜不著</b>；題序和選項每一次都重新洗牌。<br>
     答錯會給你提示，那一題等一下還會再出現，<b>練到會為止</b>。</p>
  <div id="grid"></div>
 </section>

 <div id="ghud">
  <span class="gcell"><span class="k">遊戲</span><span class="v" id="gname"></span></span>
  <span id="gring"><svg viewBox="0 0 100 100"><circle id="gbg" cx="50" cy="50" r="46"></circle>
   <circle id="gfg" cx="50" cy="50" r="46"></circle></svg><span id="gnum">15</span></span>
  <span class="gcell r"><span class="k">分數 ／ 連對 ／ 進度</span>
   <span class="v"><span id="gsc">0</span>　<span id="gstreak">—</span>　<span id="gprog">0 題</span></span></span>
 </div>

 <section id="arena"></section>

 <section id="gend">
  <h2 id="gendh">🏁 這一場結束！</h2>
  <div class="sc" id="gendsc">0</div>
  <div class="ln" id="gendln"></div>
  <div class="rev" id="gendrev"></div>
  <div class="rowbtn">
   <button class="big go" id="retry">🔁 再玩一次</button>
   <button class="big" id="backhub">🎮 換一個遊戲</button>
  </div>
 </section>
</main>

<nav id="bar">
 <button id="quit">⬅ 回遊戲大廳</button>
 <button id="slowBtn">🐢 放慢 關</button>
 <button id="muteBtn" class="on">🔊 音效 Y</button>
 <a href="index.html">🏠 首頁</a>
</nav>

<script>
${S.UTIL}
${S.TTS}
${S.SFX}
${JS.replace('__BANK__', () => JSON.stringify({
    g1: B.G1, g2: B.G2, g3: B.G3, g4: B.G4, g5: B.G5,
    g6: B.G6, g7: B.G7, g8: B.G8, g9: B.G9, g10: B.G10
  })).replace('__META__', () => JSON.stringify(B.GAMES))
     .replace('__SURP__', () => JSON.stringify(B.SURP))}
</script>
</body>
</html>`;

fs.writeFileSync(DIR + '/games.html', S.HEAD('複習遊戲 10 種｜英文句型', CSS) + body);
console.log('games ok  ' + B.GAMES.length + ' 種，題數 ' + B.GAMES.map(g => g.n).join('/'));
