/* sentences/_build_cards.js — Unit 1／Unit 2 句型卡的產生器
 * node sentences/_build_cards.js  → unit1.html ／ unit2.html
 * 卡片內容改 _data.js，版面改這裡，不要手改產出的 .html
 *
 * 三大重點（使用者 2026-09-20 指定）：版面簡潔清爽、廢話少、秒懂動畫多。
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
/* flex 預設的 min-width:auto 會被 white-space:nowrap 的長句子撐大，整塊就跑出卡片外面
   （字一放大就會壓到左右翻頁箭頭）。這三行讓它縮得回來，fit() 才量得到「需要縮小」。 */
#cardIn,.wrap,.eq,.swapbox,.ord,.focus,.pair{min-width:0;max-width:100%}
.eq{width:100%}
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
/* 字體放大（使用者指定） */
.tk .en{font-size:clamp(30px,8.6vh,82px);font-weight:700;line-height:1.08;
 letter-spacing:.005em;color:var(--fg)}
.tk .zh{font-size:clamp(19px,3.6vh,36px);color:var(--acc);line-height:1.15;font-weight:400}
.tk .ic{font-size:clamp(22px,4.2vh,44px);line-height:1.1}
.tk .ic:empty{display:none}
/* 主詞／be 動詞底色：用顏色就秒懂位置交換（使用者指定） */
.tk.b .en{background:var(--he);color:#fff;border-radius:10px;padding:0 .18em}
.tk.p .en{background:var(--she);color:#fff;border-radius:10px;padding:0 .18em}
.tk.y .en{background:var(--be);color:#000;border-radius:10px;padding:0 .18em}

/* 整句中文 */
.full{margin-top:clamp(10px,2.1vh,22px);font-size:clamp(23px,4.3vh,44px);
 color:var(--body);letter-spacing:.03em;text-align:center;line-height:1.35}
.full:active{color:#fff}

/* ── 四個 Y/N 開關：英文／中文／圖示／整句中文（使用者指定）── */
#card.no-en .en{display:none}
#card.no-zh .zh{display:none}
#card.no-ic .ic{display:none}
#card.no-full .full{display:none}
/* 關掉上面幾層，剩下的那一層就放大，整張卡永遠有主角 */
#card.no-en .tk .zh{font-size:clamp(24px,5vh,48px);color:var(--fg)}
#card.no-en.no-zh .tk .ic{font-size:clamp(34px,7.6vh,78px)}
#card.no-en.no-zh.no-ic .full{font-size:clamp(30px,6.2vh,64px);color:var(--fg);margin:0}
#card.no-en.no-zh .scene .suse,#card.no-en.no-zh .scene .sat{display:none}

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

/* ── 真實情境（老師按「🎞 情境」才出現）：畫面一段一段跳出來 ── */
.scene{display:none;flex-direction:column;align-items:center;gap:clamp(3px,.7vh,8px);
 width:100%;max-width:840px;margin-bottom:clamp(8px,1.6vh,18px);
 background:#080B0E;border:1px solid #1E2831;border-radius:16px;
 padding:clamp(8px,1.5vh,16px) clamp(10px,1.6vw,22px)}
#card.sc .scene{display:flex}
.scene .sat{font-size:clamp(13px,2vh,19px);color:#7E93A5;letter-spacing:.08em}
.scene .spic{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
 gap:clamp(5px,.9vw,12px);line-height:1.2;text-align:center}
.spic .sg{font-size:clamp(22px,4vh,42px);opacity:0;
 animation:sgIn .44s cubic-bezier(.2,.9,.3,1.3) forwards}
.spic .sar{font-size:clamp(15px,2.4vh,25px);color:#44586A;opacity:0;
 animation:sgIn .44s cubic-bezier(.2,.9,.3,1.3) forwards}
@keyframes sgIn{from{opacity:0;transform:translateX(-16px) scale(.72)}to{opacity:1;transform:none}}
.scene .suse{font-size:clamp(14px,2.3vh,22px);color:var(--body);line-height:1.45;
 text-align:center;max-width:34ch}
.reduce .spic .sg,.reduce .spic .sar{opacity:1;animation:none}

/* ── 替換字：放在卡片最下面，不跟中間的英文句子搶位置（使用者指定）── */
.subs{position:absolute;left:clamp(8px,1.6vw,20px);right:clamp(8px,1.6vw,20px);
 bottom:clamp(6px,1.1vh,12px);display:flex;flex-direction:column;
 gap:clamp(3px,.6vh,7px);align-items:center;z-index:2}
.subrow{display:flex;flex-wrap:wrap;gap:clamp(4px,.8vw,9px);justify-content:center;align-items:center}
.subrow .lbl{font-size:clamp(10.5px,1.5vh,13px);color:#5C5C5C;letter-spacing:.1em;margin-right:4px}
.sub{display:inline-flex;align-items:center;gap:5px;background:#0E0E0E;border:1px solid #2E2E2E;
 border-radius:999px;padding:clamp(4px,.75vh,8px) clamp(8px,1.1vw,14px);
 font-size:clamp(12.5px,1.9vh,18px);color:var(--body);font-weight:700}
.sub em{font-style:normal;font-size:.72em;color:var(--dim);font-weight:400}
.sub.on{background:#2C3A48;border-color:var(--acc);color:#fff}
.sub:active{transform:scale(.95)}
.sub.adv{border-style:dashed;border-color:#3A4650}

/* ── 等式卡 ── */
.eq{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.3vh,16px)}
.eqmark{font-size:clamp(28px,5.4vh,54px);color:var(--be);font-weight:700;line-height:1}
.note{margin-top:clamp(9px,1.8vh,20px);font-size:clamp(15px,2.4vh,24px);color:var(--dim);
 text-align:center;max-width:40ch;line-height:1.4}

/* ── 語序卡：中文的字會飛到英文的位置（秒懂動畫）── */
.ord{display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,18px);width:100%}
.ordrow{display:flex;gap:clamp(5px,.9vw,12px);align-items:center;justify-content:center;flex-wrap:nowrap}
.ordrow .cap{font-size:clamp(12px,1.8vh,16px);color:#5C5C5C;letter-spacing:.12em;
 width:clamp(34px,4.4vw,52px);text-align:right;flex:0 0 auto}
.chip{display:flex;flex-direction:column;align-items:center;gap:3px;border-radius:12px;
 padding:clamp(5px,1vh,11px) clamp(8px,1.2vw,16px);font-weight:700;
 font-size:clamp(22px,4.2vh,44px);line-height:1.1;background:#141414;color:var(--fg)}
.chip .ci{font-size:clamp(16px,2.6vh,27px);font-weight:400}
.chip .ci:empty{display:none}
.chip.r{background:var(--ap);color:#fff}
.chip.y{background:var(--be);color:#000}
.chip.b{background:var(--he);color:#fff}
.chip.p{background:var(--she);color:#fff}
.chip.g{background:#262626;color:var(--dim)}
.chip.fly{animation:fly .95s cubic-bezier(.3,.7,.3,1)}
@keyframes fly{0%{transform:translateX(var(--dx)) scale(.9);opacity:.35}
 60%{transform:translateX(0) scale(1.14)}100%{transform:none}}

/* ── 秒懂重點卡：一行一件事，一行一行跳出來 ── */
.focus{width:100%;display:flex;flex-direction:column;align-items:center;gap:clamp(7px,1.4vh,15px)}
.focus h2{margin:0 0 clamp(4px,1vh,10px);font-size:clamp(24px,4.4vh,46px);font-weight:700;
 color:var(--fg);text-align:center;letter-spacing:.02em}
.frow{display:flex;align-items:center;gap:clamp(10px,1.8vw,24px);width:100%;max-width:840px;
 background:#0C0C0C;border:1px solid #232323;border-radius:14px;
 padding:clamp(8px,1.5vh,16px) clamp(12px,1.8vw,24px);
 opacity:0;animation:rowIn .48s cubic-bezier(.2,.9,.3,1.25) forwards}
@keyframes rowIn{from{opacity:0;transform:translateY(20px) scale(.94)}to{opacity:1;transform:none}}
.reduce .frow{opacity:1;animation:none}
.frow .fi{font-size:clamp(26px,4.2vh,44px);flex:0 0 auto;width:1.5em;text-align:center}
.frow .fa{font-size:clamp(23px,4.3vh,44px);font-weight:700;flex:0 0 auto}
.frow .fb{font-size:clamp(19px,3.4vh,34px);color:var(--acc);flex:1 1 auto;text-align:right}

/* ── 對話卡：中文放大、照英文的意思斷字（使用者指定）── */
.pair{width:100%;display:flex;flex-direction:column;gap:clamp(8px,1.8vh,20px);
 align-items:stretch;max-width:840px}
.bub{display:flex;align-items:center;gap:clamp(9px,1.5vw,18px);border-radius:18px;
 padding:clamp(10px,1.9vh,20px) clamp(12px,1.8vw,24px);border:1px solid #242424;background:#0B0B0B;
 opacity:0;animation:rowIn .48s cubic-bezier(.2,.9,.3,1.25) forwards}
.reduce .bub{opacity:1;animation:none}
.bub.q{border-color:#2E3A46}
.bub.a{border-color:#2E4636;margin-left:clamp(14px,4vw,64px)}
.bub .bi{font-size:clamp(28px,4.8vh,50px);flex:0 0 auto}
.bub .bt{flex:1 1 auto;min-width:0}
.bub .be{font-size:clamp(28px,5.4vh,56px);font-weight:700;line-height:1.16}
.bub .bz{font-size:clamp(20px,3.6vh,36px);color:var(--acc);margin-top:5px;letter-spacing:.04em}

/* ── 變身卡（Unit 2 的核心秒懂動畫）── */
.swapbox{width:100%;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,18px)}
.swapbtn{background:var(--btn);border:1px solid var(--line);border-radius:999px;
 color:var(--fg);font-size:clamp(15px,2.4vh,23px);font-weight:700;
 padding:clamp(8px,1.4vh,14px) clamp(16px,2.4vw,30px)}
.swapbtn:active{transform:scale(.96);border-color:var(--acc)}
.swaphint{font-size:clamp(13px,2.1vh,20px);color:var(--dim);text-align:center}
.tk.moving{z-index:3}
.tk.flash .en{box-shadow:0 0 0 3px rgba(255,255,255,.55)}
`;

const JS = `
var CARDS=__CARDS__, UNIT=__UNIT__, SUB=__SUB__;
var i=0, show={en:true,zh:true,ic:true,full:true}, reveal='word', step=0, playing=null;
var scenes=false, zhSay='zh';   /* zhSay：點中文要唸中文還是唸對應的英文 */

var card=$('#card'), dots=$('#dots');
dots.innerHTML=CARDS.map(function(){return '<i></i>'}).join('');

/* ---------- 畫一個字（英文／中文／圖示三層）---------- */
/* 's 的發音：唸「前一個字＋'s」，學生聽到的就是 /z/（Who's → /huːz/） */
function tkHTML(t,idx,arr){
  var cls='tk'+(t.tight?' tight':'')+(t.hl?' '+t.hl:'');
  var sy=t.say||t.en;
  if(/^[\\u2019']s$/.test(t.en)&&arr&&idx>0&&arr[idx-1])sy=arr[idx-1].en+"'s";
  return '<span class="'+cls+'" data-i="'+idx+'" data-k="'+(t.k||'')+'" data-say="'+esc(sy)+'">'+
    '<span class="en">'+ap(t.en)+'</span>'+
    '<span class="zh">'+(t.zh||'')+'</span>'+
    '<span class="ic">'+(t.ic||'')+'</span></span>';
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
function plain(tk){return tk.map(function(t){return t.tight?t.en:' '+t.en}).join('').trim()}
function spk(s){return String(s).replace(/[\\u279C\\u2026]/g,' ')}

function lineHTML(tk){
  return '<div class="wrap"><div class="line">'+tk.map(tkHTML).join('')+'</div></div>';
}
/* 情境畫面用 ➜ 切段，一段一段跳出來 */
function sceneHTML(c){
  if(!c.scene)return '';
  var segs=String(c.scene.pic).split('\\u279C'), h='', d=0;
  segs.forEach(function(s,n){
    if(n){h+='<span class="sar" style="animation-delay:'+d.toFixed(2)+'s">\\u279C</span>';d+=0.14}
    h+='<span class="sg" style="animation-delay:'+d.toFixed(2)+'s">'+ap(s.trim())+'</span>';d+=0.28;
  });
  return '<div class="scene"><div class="sat">'+c.scene.at+'</div>'+
   '<div class="spic">'+h+'</div>'+
   '<div class="suse">\\uD83D\\uDCA1 '+ap(c.scene.use)+'</div></div>';
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
function noteHTML(n){return n?'<div class="note">'+ap(n)+'</div>':''}
function fullHTML(zh,en){
  return zh?'<div class="full" data-zh="'+esc(zh)+'" data-en="'+esc(en)+'">'+zh+'</div>':'';
}

/* ---------- 畫一張卡 ---------- */
function draw(dir){
  var c=CARDS[i], h='', kind='', subs='';
  step=0;
  if(c.type==='sent'){
    kind='句型';
    h=lineHTML(c.tk)+fullHTML(c.zh,c.say||plain(c.tk));
    subs=c.slot?subsHTML(c.slot):'';
  } else if(c.type==='eq'){
    kind='縮寫';
    h='<div class="eq">'+lineHTML(c.a)+'<div class="eqmark">＝</div>'+lineHTML(c.b)+'</div>'+
      fullHTML(c.zh,plain(c.b))+noteHTML(c.note);
  } else if(c.type==='order'){
    kind='中英語序';
    var mate=function(col){for(var k=0;k<c.enRow.length;k++)if(c.enRow[k][2]===col)return c.enRow[k][0];return ''};
    var chip=function(x,n,zh){return '<button class="chip '+x[2]+'" data-c="'+x[2]+'" data-n="'+n+'" data-say="'+esc(x[0])+'"'+
      (zh?' data-zh="'+esc(x[0])+'" data-en="'+esc(mate(x[2]))+'"':'')+'>'+
      x[0]+'<span class="ci ic">'+x[1]+'</span></button>'};
    h='<div class="ord">'+
      '<div class="ordrow zh"><span class="cap">中文</span>'+c.zhRow.map(function(x,n){return chip(x,n,1)}).join('')+'</div>'+
      '<div class="ordrow en"><span class="cap">英文</span>'+c.enRow.map(function(x,n){return chip(x,n)}).join('')+'</div>'+
      '<button class="swapbtn" id="ordGo">🔁 再演一次</button>'+
      '</div>'+noteHTML(c.note);
  } else if(c.type==='focus'){
    kind='秒懂重點';
    h='<div class="focus"><h2>'+ap(c.title)+'</h2>'+c.rows.map(function(r,n){
      return '<div class="frow" style="animation-delay:'+(0.12+n*0.22).toFixed(2)+'s">'+
        '<span class="fi ic">'+r[2]+'</span>'+
        '<span class="fa en" data-say="'+esc(spk(r[0]))+'">'+ap(r[0])+'</span>'+
        '<span class="fb zh" data-zh="'+esc(r[1])+'" data-en="'+esc(spk(r[0]))+'">'+ap(r[1])+'</span>'+
        '</div>'}).join('')+'</div>'+noteHTML(c.note);
  } else if(c.type==='pair'){
    kind='一問一答';
    h='<div class="pair">'+
      '<div class="bub q" style="animation-delay:.10s"><span class="bi ic">'+c.qic+'</span><span class="bt">'+
        '<span class="be en" data-say="'+esc(c.q)+'">'+ap(c.q)+'</span>'+
        '<span class="bz zh" data-zh="'+esc(c.qzh)+'" data-en="'+esc(c.q)+'">'+c.qzh+'</span></span></div>'+
      '<div class="bub a" style="animation-delay:.55s"><span class="bi ic">'+c.aic+'</span><span class="bt">'+
        '<span class="be en" data-say="'+esc(c.a)+'">'+ap(c.a)+'</span>'+
        '<span class="bz zh" data-zh="'+esc(c.azh)+'" data-en="'+esc(c.a)+'">'+c.azh+'</span></span></div>'+
      '</div>';
  } else if(c.type==='swap'){
    kind='變身術';
    c._cur=c._cur||'st';
    h='<div class="swapbox">'+lineHTML(c[c._cur])+
      fullHTML(c._cur==='st'?c.stzh:c.quzh,plain(c[c._cur]))+
      '<button class="swapbtn" id="swapGo">🔄 '+(c._cur==='st'?'變成問句':'變回直述句')+'</button>'+
      '<div class="swaphint">'+ap(c.note)+'</div></div>';
    subs=c.slot?subsHTML(c.slot):'';
  }
  card.className='';
  card.innerHTML='<span class="kind">'+kind+'</span><div id="cardIn">'+sceneHTML(c)+h+
    '<div id="tapHint" class="off">點卡片：一次出現一個字</div></div>'+subs;
  applyMode();
  padBottom();
  fit();
  markSubs();
  if(c.type==='order')playOrder();
  if(reveal==='word'&&(c.type==='sent'||c.type==='swap')){startWord()}
  $$('#dots i').forEach(function(d,n){d.className=n===i?'on':''});
  $('#prev').disabled=i===0;
  $('#next').disabled=i===CARDS.length-1;
  if(dir&&!document.body.classList.contains('reduce')){
    card.classList.add(dir>0?'turnR':'turnL');
    setTimeout(function(){card.classList.remove('turnR','turnL')},430);
  }
}

/* 替換字擺在卡片最下面：先把它的高度讓出來，中間才留給英文句子 */
function padBottom(){
  var sb=$('.subs',card);
  card.style.paddingBottom = sb ? (sb.offsetHeight + 14) + 'px' : '';
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
  var cs=getComputedStyle(card);
  var availH=card.clientHeight-parseFloat(cs.paddingTop||0)-parseFloat(cs.paddingBottom||0);
  var needH=inn.scrollHeight, availW=card.clientWidth, needW=inn.scrollWidth;
  var k=Math.min(availH>0&&needH>availH?availH/needH:1, availW>0&&needW>availW?availW/needW:1);
  var kk=k<1?Math.max(.3,k-0.01):1;
  if(k<1)inn.style.transform='scale('+kk+')';
  card.setAttribute('data-k',kk.toFixed(3));
}

function applyMode(){
  card.classList.remove('no-en','no-zh','no-ic','no-full','sc');
  if(!show.en)card.classList.add('no-en');
  if(!show.zh)card.classList.add('no-zh');
  if(!show.ic)card.classList.add('no-ic');
  if(!show.full)card.classList.add('no-full');
  if(scenes)card.classList.add('sc');
}
/* 點中文：依開關唸中文，或唸那一句對應的英文 */
function sayPair(el){
  var en=el.getAttribute('data-en');
  if(zhSay==='en'&&en){say(en);return}
  sayZh(el.getAttribute('data-zh'));
}

/* ---------- 語序卡：中文的字飛到英文的位置 ---------- */
function playOrder(){
  if(document.body.classList.contains('reduce'))return;
  var enR=$('.ordrow.en',card), zhR=$('.ordrow.zh',card);
  if(!enR||!zhR)return;
  var k=parseFloat(card.getAttribute('data-k')||'1')||1;
  var zc=$$('.chip',zhR), ec=$$('.chip',enR), used={};
  ec.forEach(function(c){
    var col=c.getAttribute('data-c'), src=null;
    for(var j=0;j<zc.length;j++){if(!used[j]&&zc[j].getAttribute('data-c')===col){src=zc[j];used[j]=1;break}}
    if(!src)return;
    var a=src.getBoundingClientRect(), b=c.getBoundingClientRect();
    c.style.transition='none';
    c.style.transform='translate('+((a.left-b.left)/k)+'px,'+((a.top-b.top)/k)+'px)';
    c.style.opacity='.3';
  });
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    ec.forEach(function(c,n){
      var d=(n*0.13).toFixed(2)+'s';
      c.style.transition='transform .78s cubic-bezier(.3,.75,.25,1) '+d+',opacity .4s '+d;
      c.style.transform='';c.style.opacity='';
    });
  })});
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
  var cur=curSlotWord();
  $$('.sub',card).forEach(function(b){
    b.classList.toggle('on',b.getAttribute('data-w')===cur)});
}
function curSlot(){
  var c=CARDS[i],L=c.type==='swap'?c[c._cur]:c.tk;
  if(!L)return null;
  for(var n=0;n<L.length;n++)if(L[n].slot)return L[n];
  return null;
}
function curSlotWord(){var s=curSlot();return s?s.en:''}
function rep(s,a,b){return (s&&a)?String(s).split(a).join(b):s}
/* 換了字，整句的發音和整句中文一定要跟著換（使用者 2026-09-20 指定修掉的 bug） */
function setSlot(w,z,ic){
  var c=CARDS[i];
  var s0=curSlot(), oldEn=s0?s0.en:'', oldZh=s0?s0.zh:'';
  var lists=c.type==='swap'?[c.st,c.qu]:[c.tk];
  lists.forEach(function(L){L.forEach(function(t){if(t.slot){t.en=w;t.zh=z;t.ic=ic}})});
  if(c.say)c.say=rep(c.say,oldEn,w);
  if(c.zh)c.zh=rep(c.zh,oldZh,z);
  if(c.stzh)c.stzh=rep(c.stzh,oldZh,z);
  if(c.quzh)c.quzh=rep(c.quzh,oldZh,z);
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
  var map={0:1,1:0};
  c._cur=to;
  var full=$('.full',card);
  line.innerHTML=c[to].map(tkHTML).join('');
  if(full){var z=(to==='st'?c.stzh:c.quzh);full.textContent=z;full.setAttribute('data-zh',z);
    full.setAttribute('data-en',plain(c[to]))}
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
      now.forEach(function(t){
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
  if(t.closest&&t.closest('#ordGo')){playOrder();return}
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
    if(!show.en){
      if(zhSay==='en'&&/[A-Za-z]/.test(w2))say(w2);
      else sayZh($('.zh',tk)?$('.zh',tk).textContent:w2)}
    else if(/[A-Za-z]/.test(w2))say(w2);
    return}
  var sy=t.closest?t.closest('[data-say]'):null;
  if(sy){say(sy.getAttribute('data-say'));return}
  cardTap();
});

/* ---------- 底部按鈕 ---------- */
/* 四個 Y/N：英文／中文／圖示／整句中文 */
function yn(id,key,label){
  var b=$(id);
  b.addEventListener('click',function(){
    show[key]=!show[key];
    b.classList.toggle('on',show[key]);
    b.innerHTML=label+' '+(show[key]?'Y':'N');
    applyMode();padBottom();fit();
  });
}
yn('#bEn','en','英文');
yn('#bZh','zh','中文');
yn('#bIc','ic','圖示');
yn('#bFull','full','整句中文');
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
  if(scenes){ /* 打開情境：畫面重播一次 */
    var p=$('.spic',card);
    if(p){var h=p.innerHTML;p.innerHTML='';void p.offsetWidth;p.innerHTML=h}
  }
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
/* 音效關掉的按鈕（使用者指定：太吵的時候關掉） */
$('#muteBtn').addEventListener('click',function(){
  MUTE=!MUTE;this.classList.toggle('on',!MUTE);
  this.innerHTML=MUTE?'🔇 音效 N':'🔊 音效 Y';
});
window.addEventListener('resize',function(){padBottom();fit()});
draw(0);
`;

function page(unit, cards, title, other, otherName) {
  const body = `
<div id="dots"></div>
<button class="nav l" id="prev" aria-label="上一張"><span><i>◀</i><b>上一張</b></span></button>
<button class="nav r" id="next" aria-label="下一張"><span><i>▶</i><b>下一張</b></span></button>
<main id="stage"><section id="card"></section></main>

<nav id="bar">
 <span class="grp" id="ynGrp">
  <button id="bEn" class="on">英文 Y</button>
  <button id="bZh" class="on">中文 Y</button>
  <button id="bIc" class="on">圖示 Y</button>
  <button id="bFull" class="on">整句中文 Y</button>
 </span>
 <button id="scBtn">🎞 情境</button>
 <span class="grp" id="revGrp">
  <button data-r="word" class="on">🎬 逐字</button>
  <button data-r="whole">📄 整句</button>
 </span>
 <button id="play">▶ 自動播</button>
 <button id="sayBtn">🔊 念一次</button>
 <button id="zhBtn">🔤 點中文唸 中文</button>
 <button id="slowBtn">🐢 放慢</button>
 <button id="muteBtn" class="on">🔊 音效 Y</button>
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
