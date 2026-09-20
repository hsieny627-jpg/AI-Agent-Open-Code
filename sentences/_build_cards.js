/* sentences/_build_cards.js — Unit 1／Unit 2 句型卡的產生器
 * node sentences/_build_cards.js  → unit1.html ／ unit2.html
 * 卡片內容改 _data.js，版面改這裡，不要手改產出的 .html
 */
const fs = require('fs'), DIR = __dirname;
const S = require('./_shared');
const D = require('./_data');

const CSS = `
#stage{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
 padding:calc(var(--safeT) + clamp(34px,5.4vh,52px)) clamp(76px,9.6vw,112px)
         clamp(58px,9.2vh,86px) clamp(76px,9.6vw,112px);
 perspective:1400px}

/* 字卡本體：純黑底（使用者指定） */
#card{width:100%;max-width:1180px;height:100%;background:#000;
 border:1px solid #262626;border-radius:22px;box-shadow:0 0 0 1px rgba(159,180,200,.05),0 18px 60px rgba(0,0,0,.9);
 display:flex;align-items:center;justify-content:center;
 padding:clamp(12px,2.2vh,26px) clamp(12px,2vw,30px);overflow:hidden;position:relative}
/* 內層負責內容，量到太大就整塊等比縮小 —— 這是「永遠不溢出」的關鍵 */
#cardIn{width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;
 transform-origin:center center}
#card.turnR{animation:turnR .42s cubic-bezier(.22,.7,.3,1)}
#card.turnL{animation:turnL .42s cubic-bezier(.22,.7,.3,1)}
@keyframes turnR{from{opacity:0;transform:translateX(9%) rotateY(-12deg)}to{opacity:1;transform:none}}
@keyframes turnL{from{opacity:0;transform:translateX(-9%) rotateY(12deg)}to{opacity:1;transform:none}}

/* 卡片類型標籤 */
.kind{position:absolute;top:clamp(9px,1.5vh,16px);left:clamp(12px,1.8vw,22px);
 font-size:clamp(11px,1.6vh,14px);color:#3E3E3E;letter-spacing:.14em}

/* ── 句子（一個字一欄：英文／中文／圖示）── */
.wrap{width:100%;display:flex;align-items:center;justify-content:center;
 transform-origin:center center}
.line{display:flex;align-items:flex-start;justify-content:center;
 gap:clamp(6px,1.1vw,18px);white-space:nowrap}
.tk{display:flex;flex-direction:column;align-items:center;gap:clamp(2px,.5vh,7px);
 padding:2px 2px 4px;border-radius:12px;transition:background .18s}
.tk.tight{margin-left:calc(-1 * clamp(6px,1.1vw,18px))}
.tk:active{background:#161616}
.tk .en{font-size:clamp(26px,6.4vh,62px);font-weight:700;line-height:1.08;
 letter-spacing:.005em;color:var(--fg)}
.tk .zh{font-size:clamp(14px,2.35vh,23px);color:var(--acc);line-height:1.15;font-weight:400}
.tk .ic{font-size:clamp(21px,3.9vh,40px);line-height:1.1}
/* 主詞／be 動詞底色：用顏色就秒懂位置交換（使用者指定） */
.tk.b .en{background:var(--he);color:#fff;border-radius:10px;padding:0 .18em}
.tk.p .en{background:var(--she);color:#fff;border-radius:10px;padding:0 .18em}
.tk.y .en{background:var(--be);color:#000;border-radius:10px;padding:0 .18em}

/* 整句中文 */
.full{margin-top:clamp(10px,2.1vh,22px);font-size:clamp(19px,3.3vh,34px);
 color:var(--body);letter-spacing:.03em;text-align:center;line-height:1.35}
.full:active{color:#fff}

/* 四種切換模式：卡片上加 class 控制要看到什麼 */
#card.m-en  .zh,#card.m-en .ic,#card.m-en .full{display:none}
#card.m-zh  .en,#card.m-zh .ic,#card.m-zh .full{display:none}
#card.m-full .en,#card.m-full .zh,#card.m-full .ic{display:none}
#card.m-ic  .en,#card.m-ic .zh,#card.m-ic .full{display:none}
#card.noic  .ic{display:none}
#card.m-ic .tk .ic{font-size:clamp(34px,7.4vh,76px)}
#card.m-zh .tk .zh{font-size:clamp(22px,4.6vh,44px);color:var(--fg)}
#card.m-full .full{font-size:clamp(30px,6vh,62px);color:var(--fg);margin:0}

/* 逐字動畫：一次只出現一個重點 */
.tk.hide{opacity:0;transform:translateY(14px) scale(.86);pointer-events:none}
.tk{opacity:1;transform:none;transition:opacity .34s ease,transform .34s cubic-bezier(.2,.9,.3,1.2)}
.tk.pop{animation:pop .5s cubic-bezier(.2,.9,.3,1.3)}
@keyframes pop{0%{transform:translateY(16px) scale(.8);opacity:0}
 55%{transform:translateY(-4px) scale(1.09);opacity:1}100%{transform:none;opacity:1}}
.full.hide{opacity:0;pointer-events:none}
#tapHint{position:absolute;bottom:clamp(8px,1.4vh,14px);left:0;right:0;text-align:center;
 font-size:clamp(11.5px,1.7vh,15px);color:#4D4D4D;letter-spacing:.08em}
#tapHint.off{display:none}

/* ── 真實情境（老師按「🎞 情境」才出現）── */
.scene{display:none;flex-direction:column;align-items:center;gap:clamp(3px,.7vh,8px);
 width:100%;max-width:840px;margin-bottom:clamp(8px,1.6vh,18px);
 background:#080B0E;border:1px solid #1E2831;border-radius:16px;
 padding:clamp(8px,1.5vh,16px) clamp(10px,1.6vw,22px)}
#card.sc .scene{display:flex}
.scene .sat{font-size:clamp(11.5px,1.75vh,16px);color:#6F8496;letter-spacing:.1em}
.scene .spic{font-size:clamp(19px,3.4vh,36px);line-height:1.25;text-align:center;
 word-break:break-word}
.scene .suse{font-size:clamp(12.5px,2vh,19px);color:var(--body);line-height:1.5;
 text-align:center;max-width:40ch}
#card.m-ic .scene .suse,#card.m-ic .scene .sat{display:none}

/* ── 替換字 ── */
.subs{margin-top:clamp(10px,2vh,20px);width:100%;display:flex;flex-direction:column;
 gap:clamp(4px,.8vh,8px);align-items:center}
.subrow{display:flex;flex-wrap:wrap;gap:clamp(4px,.8vw,9px);justify-content:center;align-items:center}
.subrow .lbl{font-size:clamp(11px,1.6vh,14px);color:#5C5C5C;letter-spacing:.1em;margin-right:4px}
.sub{display:inline-flex;align-items:center;gap:5px;background:#0E0E0E;border:1px solid #2E2E2E;
 border-radius:999px;padding:clamp(5px,.9vh,9px) clamp(9px,1.2vw,15px);
 font-size:clamp(13px,2vh,19px);color:var(--body);font-weight:700}
.sub em{font-style:normal;font-size:.72em;color:var(--dim);font-weight:400}
.sub.on{background:#2C3A48;border-color:var(--acc);color:#fff}
.sub:active{transform:scale(.95)}
.sub.adv{border-style:dashed;border-color:#3A4650}

/* ── 等式卡 ── */
.eq{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.3vh,16px)}
.eqmark{font-size:clamp(26px,5vh,50px);color:var(--be);font-weight:700;line-height:1}
.note{margin-top:clamp(9px,1.8vh,20px);font-size:clamp(14px,2.2vh,22px);color:var(--dim);
 text-align:center;max-width:44ch;line-height:1.45}

/* ── 語序卡 ── */
.ord{display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,18px);width:100%}
.ordrow{display:flex;gap:clamp(5px,.9vw,12px);align-items:center;justify-content:center;flex-wrap:nowrap}
.ordrow .cap{font-size:clamp(11.5px,1.7vh,15px);color:#5C5C5C;letter-spacing:.12em;
 width:clamp(34px,4.4vw,52px);text-align:right;flex:0 0 auto}
.chip{display:flex;flex-direction:column;align-items:center;gap:3px;border-radius:12px;
 padding:clamp(5px,1vh,11px) clamp(8px,1.2vw,16px);font-weight:700;
 font-size:clamp(19px,3.7vh,38px);line-height:1.1;background:#141414;color:var(--fg)}
.chip .ci{font-size:clamp(15px,2.4vh,24px);font-weight:400}
.chip.r{background:var(--ap);color:#fff}
.chip.y{background:var(--be);color:#000}
.chip.b{background:var(--he);color:#fff}
.chip.p{background:var(--she);color:#fff}
.chip.g{background:#262626;color:var(--dim)}
.chip.fly{animation:fly .95s cubic-bezier(.3,.7,.3,1)}
@keyframes fly{0%{transform:translateX(var(--dx)) scale(.9);opacity:.35}
 60%{transform:translateX(0) scale(1.14)}100%{transform:none}}

/* ── 觀念卡 ── */
.focus{width:100%;display:flex;flex-direction:column;align-items:center;gap:clamp(7px,1.4vh,15px)}
.focus h2{margin:0 0 clamp(4px,1vh,10px);font-size:clamp(21px,3.8vh,40px);font-weight:700;
 color:var(--fg);text-align:center;letter-spacing:.02em}
.frow{display:flex;align-items:center;gap:clamp(8px,1.4vw,18px);width:100%;max-width:840px;
 background:#0C0C0C;border:1px solid #232323;border-radius:14px;
 padding:clamp(7px,1.3vh,14px) clamp(10px,1.5vw,20px)}
.frow .fi{font-size:clamp(22px,3.7vh,38px);flex:0 0 auto;width:1.6em;text-align:center}
.frow .fa{font-size:clamp(17px,2.9vh,29px);font-weight:700;flex:0 0 auto;min-width:5.4em}
.frow .fb{font-size:clamp(13.5px,2.15vh,21px);color:var(--acc);flex:1 1 auto}
.frow .fc{font-size:clamp(12px,1.9vh,18px);color:var(--dim);flex:0 0 auto;text-align:right}

/* ── 對話卡 ── */
.pair{width:100%;display:flex;flex-direction:column;gap:clamp(8px,1.8vh,20px);
 align-items:stretch;max-width:840px}
.bub{display:flex;align-items:center;gap:clamp(9px,1.5vw,18px);border-radius:18px;
 padding:clamp(10px,1.9vh,20px) clamp(12px,1.8vw,24px);border:1px solid #242424;background:#0B0B0B}
.bub.q{border-color:#2E3A46}
.bub.a{border-color:#2E4636;margin-left:clamp(14px,4vw,64px)}
.bub .bi{font-size:clamp(25px,4.4vh,46px);flex:0 0 auto}
.bub .bt{flex:1 1 auto;min-width:0}
.bub .be{font-size:clamp(22px,4.1vh,42px);font-weight:700;line-height:1.16}
.bub .bz{font-size:clamp(13.5px,2.15vh,21px);color:var(--acc);margin-top:4px}
#card.m-en .bz{display:none}
#card.m-zh .be,#card.m-full .be,#card.m-ic .be{display:none}

/* ── 變身卡（Unit 2 的核心秒懂動畫）── */
.swapbox{width:100%;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,18px)}
.swapbtn{background:var(--btn);border:1px solid var(--line);border-radius:999px;
 color:var(--fg);font-size:clamp(15px,2.4vh,23px);font-weight:700;
 padding:clamp(8px,1.4vh,14px) clamp(16px,2.4vw,30px)}
.swapbtn:active{transform:scale(.96);border-color:var(--acc)}
.swaphint{font-size:clamp(12.5px,1.95vh,18px);color:var(--dim);text-align:center}
.tk.moving{z-index:3}
.tk.flash .en{box-shadow:0 0 0 3px rgba(255,255,255,.55)}
`;

const JS = `
var CARDS=__CARDS__, UNIT=__UNIT__, SUB=__SUB__;
var i=0, mode='all', icons=true, reveal='word', step=0, playing=null;
var scenes=false, zhSay='zh';   /* zhSay：點中文要唸中文還是唸對應的英文 */

var card=$('#card'), dots=$('#dots');
dots.innerHTML=CARDS.map(function(){return '<i></i>'}).join('');

/* ---------- 畫一個字（英文／中文／圖示三層）---------- */
function tkHTML(t,idx){
  var cls='tk'+(t.tight?' tight':'')+(t.hl?' '+t.hl:'');
  return '<span class="'+cls+'" data-i="'+idx+'" data-k="'+(t.k||'')+'" data-say="'+esc(t.en)+'">'+
    '<span class="en">'+ap(t.en)+'</span>'+
    '<span class="zh">'+(t.zh||'')+'</span>'+
    '<span class="ic">'+(t.ic||'')+'</span></span>';
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
function plain(tk){return tk.map(function(t){return t.tight?t.en:' '+t.en}).join('').trim()}

function lineHTML(tk){
  return '<div class="wrap"><div class="line">'+tk.map(tkHTML).join('')+'</div></div>';
}
function sceneHTML(c){
  if(!c.scene)return '';
  return '<div class="scene"><div class="sat">'+c.scene.at+'</div>'+
   '<div class="spic">'+ap(c.scene.pic)+'</div>'+
   '<div class="suse">💡 '+ap(c.scene.use)+'</div></div>';
}
function subsHTML(kind){
  var s=SUB[kind];if(!s)return '';
  var row=function(list,lbl,cls){
    if(!list.length)return '';
    return '<div class="subrow"><span class="lbl">'+lbl+'</span>'+list.map(function(w){
      return '<button class="sub '+cls+'" data-w="'+w[0]+'" data-z="'+w[1]+'" data-ic="'+w[2]+'">'+
       w[2]+' '+w[0]+' <em>'+w[1]+'</em></button>'}).join('')+'</div>';
  };
  return '<div class="subs">'+row(s.basic,'基礎','')+row(s.adv,'進階','adv')+'</div>';
}

/* ---------- 畫一張卡 ---------- */
function draw(dir){
  var c=CARDS[i], h='', kind='';
  step=0;
  if(c.type==='sent'){
    kind='句型';
    h=lineHTML(c.tk)+'<div class="full" data-zh="'+esc(c.zh)+'" data-en="'+esc(c.say||plain(c.tk))+'">'+c.zh+'</div>'+
      (c.slot?subsHTML(c.slot):'');
  } else if(c.type==='eq'){
    kind='縮寫';
    h='<div class="eq">'+lineHTML(c.a)+'<div class="eqmark">＝</div>'+lineHTML(c.b)+'</div>'+
      '<div class="full" data-zh="'+esc(c.zh)+'" data-en="'+esc(plain(c.b))+'">'+c.zh+'</div>'+
      (c.note?'<div class="note">'+ap(c.note)+'</div>':'');
  } else if(c.type==='order'){
    kind='中英語序';
    var mate=function(col){for(var k=0;k<c.enRow.length;k++)if(c.enRow[k][2]===col)return c.enRow[k][0];return ''};
    var chip=function(x,n,zh){return '<button class="chip '+x[2]+'" data-n="'+n+'" data-say="'+esc(x[0])+'"'+
      (zh?' data-zh="'+esc(x[0])+'" data-en="'+esc(mate(x[2]))+'"':'')+'>'+
      x[0]+'<span class="ci">'+x[1]+'</span></button>'};
    h='<div class="ord">'+
      '<div class="ordrow"><span class="cap">英文</span>'+c.enRow.map(function(x,n){return chip(x,n)}).join('')+'</div>'+
      '<div class="ordrow"><span class="cap">中文</span>'+c.zhRow.map(function(x,n){return chip(x,n,1)}).join('')+'</div>'+
      '</div><div class="note">'+ap(c.note)+'</div>';
  } else if(c.type==='focus'){
    kind='秒懂重點';
    h='<div class="focus"><h2>'+ap(c.title)+'</h2>'+c.rows.map(function(r){
      return '<div class="frow"><span class="fi">'+r[2]+'</span>'+
        '<span class="fa" data-say="'+esc(r[0])+'">'+ap(r[0])+'</span>'+
        '<span class="fb" data-zh="'+esc(r[1])+'" data-en="'+esc(r[0])+'">'+ap(r[1])+'</span>'+
        '<span class="fc">'+ap(r[3]||'')+'</span></div>'}).join('')+
      '</div><div class="note">'+ap(c.note)+'</div>';
  } else if(c.type==='pair'){
    kind='一問一答';
    h='<div class="pair">'+
      '<div class="bub q"><span class="bi">'+c.qic+'</span><span class="bt">'+
        '<span class="be" data-say="'+esc(c.q)+'">'+ap(c.q)+'</span>'+
        '<span class="bz" data-zh="'+esc(c.qzh)+'" data-en="'+esc(c.q)+'">'+c.qzh+'</span></span></div>'+
      '<div class="bub a"><span class="bi">'+c.aic+'</span><span class="bt">'+
        '<span class="be" data-say="'+esc(c.a)+'">'+ap(c.a)+'</span>'+
        '<span class="bz" data-zh="'+esc(c.azh)+'" data-en="'+esc(c.a)+'">'+c.azh+'</span></span></div>'+
      '</div>';
  } else if(c.type==='swap'){
    kind='變身術';
    c._cur=c._cur||'st';
    h='<div class="swapbox">'+lineHTML(c[c._cur])+
      '<div class="full" data-zh="'+esc(c._cur==='st'?c.stzh:c.quzh)+'" data-en="'+esc(plain(c[c._cur]))+'">'+
        (c._cur==='st'?c.stzh:c.quzh)+'</div>'+
      '<button class="swapbtn" id="swapGo">🔄 '+(c._cur==='st'?'變成問句':'變回直述句')+'</button>'+
      '<div class="swaphint">'+ap(c.note)+'</div>'+
      (c.slot?subsHTML(c.slot):'')+'</div>';
  }
  card.className='';
  card.innerHTML='<span class="kind">'+kind+'</span><div id="cardIn">'+sceneHTML(c)+h+
    '<div id="tapHint" class="off">點卡片：一次出現一個字</div></div>';
  applyMode();
  fit();
  markSubs();
  if(reveal==='word'&&(c.type==='sent'||c.type==='swap')){startWord()}
  $$('#dots i').forEach(function(d,n){d.className=n===i?'on':''});
  $('#prev').disabled=i===0;
  $('#next').disabled=i===CARDS.length-1;
  if(dir&&!document.body.classList.contains('reduce')){
    card.classList.add(dir>0?'turnR':'turnL');
    setTimeout(function(){card.classList.remove('turnR','turnL')},430);
  }
}

/* 一定不溢出：先把過寬的句子那一排縮起來，再看整張卡夠不夠高（iPad 直式最容易擠爆） */
function fit(){
  var inn=$('#cardIn');if(!inn)return;
  inn.style.transform='';
  $$('.wrap',inn).forEach(function(w){
    w.style.transform='';w.style.height='';
    var ln=$('.line',w);if(!ln)return;
    var avail=w.clientWidth, need=ln.scrollWidth;
    if(need>avail&&avail>0){var k=Math.max(.34,avail/need-0.015);
      w.style.transform='scale('+k+')';w.style.height=(ln.offsetHeight*k)+'px'}
  });
  var availH=card.clientHeight-2*parseFloat(getComputedStyle(card).paddingTop||0);
  var needH=inn.scrollHeight, availW=card.clientWidth, needW=inn.scrollWidth;
  var k=Math.min(availH>0&&needH>availH?availH/needH:1, availW>0&&needW>availW?availW/needW:1);
  var kk=k<1?Math.max(.3,k-0.01):1;
  if(k<1)inn.style.transform='scale('+kk+')';
  card.setAttribute('data-k',kk.toFixed(3));
}

function applyMode(){
  card.classList.remove('m-all','m-en','m-zh','m-full','m-ic','noic','sc');
  card.classList.add('m-'+mode);
  if(!icons)card.classList.add('noic');
  if(scenes)card.classList.add('sc');
}
/* 點中文：依開關唸中文，或唸那一句對應的英文 */
function sayPair(el){
  var en=el.getAttribute('data-en');
  if(zhSay==='en'&&en){say(en);return}
  sayZh(el.getAttribute('data-zh'));
}

/* ---------- 逐字動畫：一次只呈現一個重點 ---------- */
function startWord(){
  var tks=$$('.tk',card);
  tks.forEach(function(t){t.classList.add('hide')});
  var f=$('.full',card);if(f)f.classList.add('hide');
  step=0;
  var hint=$('#tapHint');if(hint)hint.classList.remove('off');
}
function revealNext(auto){
  var tks=$$('.tk',card);
  if(!tks.length)return false;
  if(step<tks.length){
    var t=tks[step];t.classList.remove('hide');t.classList.add('pop');
    sPop();
    var w=t.getAttribute('data-say');
    if(w&&/[A-Za-z]/.test(w))say(w);
    step++;
    if(step===tks.length){
      var f=$('.full',card);if(f)setTimeout(function(){f.classList.remove('hide')},260);
      var hint=$('#tapHint');if(hint)hint.classList.add('off');
      if(!auto)setTimeout(function(){say(sentOf())},420);
    }
    fit();
    return true;
  }
  return false;
}
function sentOf(){
  var c=CARDS[i];
  if(c.type==='sent')return c.say||plain(c.tk);
  if(c.type==='swap')return plain(c[c._cur]);
  return '';
}
function autoPlay(){
  if(playing){clearInterval(playing);playing=null;$('#play').classList.remove('on');return}
  var c=CARDS[i];
  if(c.type!=='sent'&&c.type!=='swap'){say(sentOf());return}
  startWord();
  $('#play').classList.add('on');
  playing=setInterval(function(){
    if(!revealNext(true)){clearInterval(playing);playing=null;$('#play').classList.remove('on');
      setTimeout(function(){say(sentOf())},260)}
  },SLOW?1500:1000);
}

/* ---------- 替換字 ---------- */
function markSubs(){
  var c=CARDS[i];
  var cur=curSlotWord();
  $$('.sub',card).forEach(function(b){
    b.classList.toggle('on',b.getAttribute('data-w')===cur)});
}
function curSlotWord(){
  var c=CARDS[i],list=c.type==='swap'?c[c._cur]:c.tk;
  if(!list)return '';
  for(var n=0;n<list.length;n++)if(list[n].slot)return list[n].en;
  return '';
}
function setSlot(w,z,ic){
  var c=CARDS[i];
  var lists=c.type==='swap'?[c.st,c.qu]:[c.tk];
  lists.forEach(function(L){L.forEach(function(t){if(t.slot){t.en=w;t.zh=z;t.ic=ic}})});
  var keepStep=step, wasAll=(step>=$$('.tk',card).length);
  draw(0);
  if(reveal==='word'&&!wasAll){ /* 還在逐字中，回到原本進度 */
    for(var n=0;n<keepStep;n++)revealNext(true);
  } else if(reveal==='word'){
    var tks=$$('.tk',card);tks.forEach(function(t){t.classList.remove('hide')});
    var f=$('.full',card);if(f)f.classList.remove('hide');step=tks.length;
    var hint=$('#tapHint');if(hint)hint.classList.add('off');
  }
  say(sentOf());
}

/* ---------- 變身術：FLIP 動畫，主詞和 be 動詞真的滑過去 ---------- */
function doSwap(){
  var c=CARDS[i];
  var line=$('.line',card);if(!line)return;
  var before={};
  $$('.tk',line).forEach(function(t,n){before[n]=t.getBoundingClientRect()});
  var from=c._cur, to=from==='st'?'qu':'st';
  /* 位置對應：直述句 [主詞,be,...] ⇄ 問句 [be,主詞,...] */
  var map=from==='st'?{0:1,1:0}:{0:1,1:0};
  c._cur=to;
  var full=$('.full',card);
  line.innerHTML=c[to].map(tkHTML).join('');
  if(full){var z=(to==='st'?c.stzh:c.quzh);full.textContent=z;full.setAttribute('data-zh',z)}
  var btn=$('#swapGo');if(btn)btn.textContent='🔄 '+(to==='st'?'變回直述句':'變成問句');
  applyMode();fit();
  var now=$$('.tk',line);
  if(!document.body.classList.contains('reduce')){
    now.forEach(function(t,n){
      var src=before[map[n]!==undefined?map[n]:n];if(!src)return;
      var r=t.getBoundingClientRect();
      var dx=src.left-r.left;
      if(!dx)return;
      t.classList.add('moving');
      t.style.transition='none';
      t.style.transform='translateX('+dx+'px)';
    });
    /* 下一影格再放開，才會看到滑過去 */
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      now.forEach(function(t,n){
        t.style.transition='transform .62s cubic-bezier(.3,.75,.25,1)';
        t.style.transform='';
      });
      setTimeout(function(){
        now.forEach(function(t){t.classList.remove('moving');t.style.transition='';});
        if(now[0])now[0].classList.add('flash');
        if(now[1])now[1].classList.add('flash');
        setTimeout(function(){now.forEach(function(t){t.classList.remove('flash')})},520);
      },640);
    })});
  }
  sPop();
  step=now.length;
  setTimeout(function(){say(plain(c[to]))},document.body.classList.contains('reduce')?60:700);
  markSubs();
}

/* ---------- 換卡 ---------- */
function go(d){
  var n=i+d;if(n<0||n>=CARDS.length)return;
  if(playing){clearInterval(playing);playing=null}
  try{speechSynthesis.cancel()}catch(e){}
  i=n;draw(d);
}
$('#prev').addEventListener('click',function(){go(-1)});
$('#next').addEventListener('click',function(){go(1)});
document.addEventListener('keydown',function(e){
  if(e.key==='ArrowLeft')go(-1);
  else if(e.key==='ArrowRight')go(1);
  else if(e.key===' '){e.preventDefault();cardTap()}
});

/* ---------- 點卡片 ---------- */
function cardTap(){
  var c=CARDS[i];
  if(reveal==='word'&&(c.type==='sent'||c.type==='swap')&&step<$$('.tk',card).length){
    revealNext(false);return;
  }
  var s=sentOf();if(s)say(s);
}
card.addEventListener('click',function(e){
  var t=e.target;
  var sub=t.closest?t.closest('.sub'):null;
  if(sub){setSlot(sub.getAttribute('data-w'),sub.getAttribute('data-z'),sub.getAttribute('data-ic'));return}
  if(t.closest&&t.closest('#swapGo')){doSwap();return}
  /* 逐字模式還沒出完：點卡片上任何地方都是「出下一個字」，不要讓學生點到空的地方沒反應 */
  var cc=CARDS[i];
  if(reveal==='word'&&(cc.type==='sent'||cc.type==='swap')&&step<$$('.tk',card).length){
    revealNext(false);return}
  var chip=t.closest?t.closest('.chip'):null;
  if(chip){var w=chip.getAttribute('data-say');
    if(/[A-Za-z]/.test(w))say(w);
    else if(chip.getAttribute('data-en'))sayPair(chip);
    else sayZh(w);
    chip.style.setProperty('--dx','-40px');chip.classList.add('fly');
    setTimeout(function(){chip.classList.remove('fly')},960);return}
  var zh=t.closest?t.closest('[data-zh]'):null;
  if(zh){sayPair(zh);return}
  var tk=t.closest?t.closest('.tk'):null;
  if(tk&&!tk.classList.contains('hide')){
    var w2=tk.getAttribute('data-say');
    if(mode==='zh'||mode==='ic'){
      if(zhSay==='en'&&/[A-Za-z]/.test(w2))say(w2);
      else sayZh($('.zh',tk)?$('.zh',tk).textContent:w2)}
    else if(/[A-Za-z]/.test(w2))say(w2);
    return}
  var sy=t.closest?t.closest('[data-say]'):null;
  if(sy){say(sy.getAttribute('data-say'));return}
  cardTap();
});

/* ---------- 底部按鈕 ---------- */
$$('#modeGrp button').forEach(function(b){
  b.addEventListener('click',function(){
    mode=b.getAttribute('data-m');
    $$('#modeGrp button').forEach(function(x){x.classList.toggle('on',x===b)});
    applyMode();fit();
  });
});
$('#icBtn').addEventListener('click',function(){
  icons=!icons;$('#icBtn').classList.toggle('on',icons);
  $('#icBtn').innerHTML='🖼 圖示';
  applyMode();fit();
});
$$('#revGrp button').forEach(function(b){
  b.addEventListener('click',function(){
    reveal=b.getAttribute('data-r');
    $$('#revGrp button').forEach(function(x){x.classList.toggle('on',x===b)});
    if(playing){clearInterval(playing);playing=null;$('#play').classList.remove('on')}
    draw(0);
  });
});
$('#scBtn').addEventListener('click',function(){
  scenes=!scenes;$('#scBtn').classList.toggle('on',scenes);
  applyMode();fit();
});
$('#zhBtn').addEventListener('click',function(){
  zhSay=zhSay==='zh'?'en':'zh';
  $('#zhBtn').classList.toggle('on',zhSay==='en');
  $('#zhBtn').innerHTML=zhSay==='en'?'🔤 點中文唸 英文':'🔤 點中文唸 中文';
});
$('#play').addEventListener('click',autoPlay);
$('#sayBtn').addEventListener('click',function(){var s=sentOf();say(s|| '')});
$('#slowBtn').addEventListener('click',function(){
  SLOW=!SLOW;$('#slowBtn').classList.toggle('on',SLOW);
});
window.addEventListener('resize',function(){fit()});
draw(0);
`;

function page(unit, cards, title, other, otherName) {
  const body = `
<div id="dots"></div>
<button class="nav l" id="prev" aria-label="上一張"><span><i>◀</i><b>上一張</b></span></button>
<button class="nav r" id="next" aria-label="下一張"><span><i>▶</i><b>下一張</b></span></button>
<main id="stage"><section id="card"></section></main>

<nav id="bar">
 <span class="grp" id="modeGrp">
  <button data-m="all" class="on">全部</button>
  <button data-m="en">只英文</button>
  <button data-m="zh">只中文</button>
  <button data-m="full">整句中文</button>
  <button data-m="ic">只圖示</button>
 </span>
 <button id="icBtn" class="on">🖼 圖示</button>
 <button id="scBtn">🎞 情境</button>
 <span class="grp" id="revGrp">
  <button data-r="word" class="on">🎬 逐字</button>
  <button data-r="whole">📄 整句</button>
 </span>
 <button id="play">▶ 自動播</button>
 <button id="sayBtn">🔊 念一次</button>
 <button id="zhBtn">🔤 點中文唸 中文</button>
 <button id="slowBtn">🐢 放慢</button>
 <a href="${other}">${otherName}</a>
 <a href="index.html">🏠 首頁</a>
</nav>

<script>
${S.UTIL}
${S.TTS}
${S.SFX}
${JS.replace('__CARDS__', () => JSON.stringify(cards))
    .replace('__UNIT__', () => JSON.stringify(unit))
    .replace('__SUB__', () => JSON.stringify(D.SUB))}
</script>
</body>
</html>`;
  return S.HEAD(title, CSS) + body;
}

fs.writeFileSync(DIR + '/unit1.html',
  page(1, D.U1, 'Unit 1 句型｜Who’s he? Who’s she?', 'unit2.html', '➡ Unit 2'));
fs.writeFileSync(DIR + '/unit2.html',
  page(2, D.U2, 'Unit 2 句型｜Is he a doctor?', 'unit1.html', '⬅ Unit 1'));
console.log('cards ok  unit1=' + D.U1.length + ' 張  unit2=' + D.U2.length + ' 張');
