/* sentences/_pick.js —〔🔤 選單字〕獨立頁（2026-10-11 B 組，使用者第 7(1)、8 點；Q1～Q4、Q12 照建議）
 *
 * 句型卡寫 pick:1 才開（三年級 Review 1 第 5、6 頁；四年級 Review 1 第 3～8 頁），其他卡、其他頁逐位元組不變。
 * - 句型卡下面原本一排一排的小替換字全部收起來（Q2 ①），只留一顆大按鈕〔🔤 選單字〕
 * - 按下去蓋上整個畫面（Q1 ①），按〔✕ 回到句型卡〕回來
 * - 一類一頁（Q3 ①）：上面「📘 課本／物品 1／物品 2」（有切換的才有）＋類別分頁；一頁最多 8 個字（大圖示＋英文＋中文），不用捲動
 * - 點一個字 ➜ 下面立刻出現大字整句（每個字下面有中文，唸到哪亮到哪），學生可以照抄；〔✅ 用這個字〕回到句型卡（Q4 ①）
 * - 四年級：上面也有〔他 He｜她 She〕〔and｜but〕大按鈕，整句跟著換（Q12 ①）
 * 引擎函式（tkHTML、curSlot、setSlot、sayEls、rep、esc、SUB、SUBSETS、GLMAP）都是 _build_cards.js 裡原本就有的。
 */
const CSS = `
/* ===== 〔🔤 選單字〕：句型卡下面只剩一顆大按鈕 ===== */
.subs.pkb{display:flex;justify-content:center;align-items:center}
.pkGo{min-height:64px;padding:6px clamp(22px,3vw,40px);border-radius:20px;border:3px solid var(--acc);background:#16222C;color:#fff;
 font-weight:700;font-size:clamp(22px,3.4vh,32px);display:flex;align-items:center;gap:.4em;animation:pkHi 1.6s ease-in-out 2}
.pkGo small{font-size:.6em;color:#B9C4CE;font-weight:700}
.pkGo:active{transform:scale(.96)}
@keyframes pkHi{0%,100%{box-shadow:0 0 0 0 rgba(255,213,74,0)}50%{box-shadow:0 0 0 8px rgba(255,213,74,.35)}}
/* ===== 獨立頁 ===== */
#pk{position:fixed;inset:0;z-index:80;background:#05070A;display:flex;flex-direction:column;gap:clamp(6px,1.1vh,12px);
 padding:max(10px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));
 touch-action:manipulation;user-select:none;-webkit-user-select:none}
#pk[hidden]{display:none}
.pkTop{display:flex;align-items:center;gap:12px}
.pkT{flex:1;min-width:0;font-size:clamp(22px,3.6vh,34px);font-weight:700;color:#FFD54A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pkX{min-height:52px;padding:4px 18px;border-radius:16px;border:2px solid #556270;background:#141A20;color:#fff;font-weight:700;font-size:clamp(18px,2.6vh,24px);white-space:nowrap}
.pkRow{display:flex;gap:clamp(6px,1vw,12px);justify-content:center;flex-wrap:wrap}
.pkRow[hidden]{display:none}
.pkRow button{min-height:52px;padding:4px clamp(12px,1.6vw,20px);border-radius:999px;border:2px solid #3A4650;background:#101820;color:#CFD8E0;
 font-weight:700;font-size:clamp(18px,2.6vh,26px);white-space:nowrap}
.pkRow button.on{background:#2C3A48;border-color:#FFD54A;color:#fff}
.pkRow .pkSep{width:clamp(8px,2vw,28px)}
.pkGrid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:clamp(6px,1vw,12px)}
@media (orientation:portrait){.pkGrid{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr))}}
.pkTile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(2px,.6vh,6px);min-height:0;min-width:0;overflow:hidden;
 background:#101010;border:3px solid #2A3440;border-radius:20px;color:#fff;padding:4px 6px}
.pkTile.on{border-color:#FFD54A;background:#1E2630;box-shadow:0 0 0 3px rgba(255,213,74,.35)}
.pkTile:active{transform:scale(.96)}
.pkIc{font-size:clamp(34px,7vh,64px);line-height:1.05}
.pkIc img,.pkIc svg{width:1em;height:1em}
.pkEn{flex:none;font-size:clamp(24px,4.6vh,42px);font-weight:700;line-height:1.1;text-align:center;width:100%;overflow-wrap:normal}
.pkIc{flex:0 1 auto;min-height:0}
.pkZh{font-size:clamp(16px,2.6vh,26px);color:#B9C4CE;font-weight:700;white-space:nowrap}
.pkSay{display:flex;align-items:center;gap:clamp(8px,1.4vw,16px);background:#0B0F14;border:2px solid #24303C;border-radius:22px;padding:clamp(4px,1vh,10px) clamp(8px,1.4vw,16px)}
.pkS{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:clamp(2px,.6vh,8px);overflow:hidden}
#pkLine{display:flex;justify-content:center;align-items:flex-start;gap:.28em;white-space:nowrap;font-size:clamp(34px,7.4vh,72px)}
#pk .tk{animation:pkIn .35s ease both}
#pk .tk .en{font-size:1em}
#pk .tk.tight{margin-left:-.28em}
#pk .tk .zh{font-size:.42em}
#pk .tk .ic{font-size:.42em}
@keyframes pkIn{from{opacity:0;transform:translateY(.25em) scale(.85)}to{opacity:1;transform:none}}
.pkFull{font-size:clamp(20px,3.2vh,32px);color:#E6EDF3;font-weight:700;white-space:nowrap}
.pkUse{min-height:64px;padding:6px clamp(12px,1.8vw,22px);border-radius:18px;border:3px solid #66BB6A;background:#1B5E20;color:#fff;font-weight:700;
 font-size:clamp(20px,3vh,30px);white-space:nowrap}
.pkUse:active{transform:scale(.96)}
.reduce #pk .tk{animation:none}
`;

/* 這幾段 JS 接進卡片引擎（找得到才換，次數不對 build 就失敗） */
const JS = `
/* ===== 〔🔤 選單字〕獨立頁（2026-10-11 B 組） ===== */
var PK=null,SIDEK=['pr','cj'];
function pkMain(c){var L=c.slots||(c.slot?[c.slot]:[]);for(var n=0;n<L.length;n++)if(SIDEK.indexOf(L[n])<0)return L[n];return null}
function pkCount(k){var s=SUB[k],ss=(typeof SUBSETS!=='undefined')&&SUBSETS[k],n=s.basic.length+s.adv.length;
  if(ss)ss.slice(1).forEach(function(x){x.rows.forEach(function(r){n+=r[1].length})});return n}
function pkBar(){var c=CARDS[i],k=pkMain(c);
  return '<div class="subs pkb"><button class="pkGo" type="button">\\uD83D\\uDD24 選單字 <small>（'+pkCount(k)+' 個）</small></button></div>'}
/* 一組 ＝ 📘 課本／物品 1／物品 2；一頁 ＝ 一類、最多 8 個字（太多就平均切成兩三頁） */
function pkGroups(k){var s=SUB[k],ss=(typeof SUBSETS!=='undefined')&&SUBSETS[k],G=[];
  var rows=[[s.lb||'基礎',s.basic],[s.la||'進階',s.adv]].filter(function(r){return r[1].length});
  G.push({n:ss?ss[0].n:'',rows:rows});
  if(ss)ss.slice(1).forEach(function(x){G.push({n:x.n,rows:x.rows})});
  G.forEach(function(g){g.pages=[];g.rows.forEach(function(r){var L=r[1],m=Math.ceil(L.length/8),sz=Math.ceil(L.length/m);
    for(var j=0;j<m;j++)g.pages.push({n:r[0]+(m>1?' '+(j+1):''),w:L.slice(j*sz,(j+1)*sz)})})});
  return G}
function pkEl(){var o=document.getElementById('pk');if(o)return o;
  o=document.createElement('div');o.id='pk';o.hidden=true;
  o.innerHTML='<div class="pkTop"><b class="pkT"></b><button class="pkX" type="button">\\u2715 回到句型卡</button></div>'+
   '<div class="pkRow" id="pkG"></div><div class="pkRow" id="pkP"></div><div class="pkGrid" id="pkW"></div>'+
   '<div class="pkSay"><div class="pkS"><div id="pkLine"></div><div class="pkFull" id="pkFull"></div></div><button class="pkUse" type="button">\\u2705 用這個字</button></div>';
  document.body.appendChild(o);
  o.addEventListener('click',function(e){var t=e.target;e.stopPropagation();
    if(t.closest('.pkX')){pkClose();return}
    if(t.closest('.pkUse')){pkUse();return}
    var b=t.closest('[data-pg]');if(b){PK.g=+b.getAttribute('data-pg');PK.p=0;pkDraw(0);return}
    b=t.closest('[data-pp]');if(b){PK.p=+b.getAttribute('data-pp');pkDraw(0);return}
    b=t.closest('[data-sk]');if(b){var k=b.getAttribute('data-sk'),x=SUB[k].basic[+b.getAttribute('data-sn')];PK.side[k]={w:x[0],z:x[1],ic:x[2]};pkDraw(1);return}
    b=t.closest('.pkTile');if(b){var w=PK.G[PK.g].pages[PK.p].w[+b.getAttribute('data-n')];PK.sel={w:w[0],z:w[1],ic:w[2]};pkDraw(1);return}
    if(t.closest('.pkS'))pkSay()});
  return o}
function pkOpen(){var c=CARDS[i],k=pkMain(c);if(!k)return;
  stopPlay&&stopPlay();sayStop();
  PK={k:k,G:pkGroups(k),g:0,p:0,sel:null,side:{}};
  var cw=curSlot(c.slots?k:null),cur=cw&&!cw.blank?cw.en:'';
  PK.G.forEach(function(g,a){g.pages.forEach(function(pg,b){pg.w.forEach(function(w){if(w[0]===cur&&!PK.f){PK.g=a;PK.p=b;PK.f=1}})})});
  var o=pkEl();o.querySelector('.pkT').innerHTML=ap(plain(c.tk.map(function(t){return t.slot===k?{en:'______',tight:0}:t})));
  o.hidden=false;pkDraw(0)}
function pkClose(){sayStop();var o=document.getElementById('pk');if(o)o.hidden=true;PK=null}
function pkCur(k){var c=CARDS[i],x=curSlot(c.slots?k:null);return x?x.en:''}
function pkDraw(talk){var o=pkEl(),c=CARDS[i],G=PK.G,g=G[PK.g],cur=PK.sel?PK.sel.w:pkCur(PK.k);
  /* 第一排：📘 課本／物品 1／物品 2（有切換才有）＋ 他 He／她 She、and／but */
  var top=G.length>1?G.map(function(x,n){return '<button type="button" data-pg="'+n+'"'+(n===PK.g?' class="on"':'')+'>'+x.n+'</button>'}).join(''):'';
  (c.slots||[]).forEach(function(k){if(SIDEK.indexOf(k)<0||!SUB[k])return;var now=PK.side[k]?PK.side[k].w:pkCur(k);
    top+='<span class="pkSep"></span>'+SUB[k].basic.map(function(x,n){return '<button type="button" data-sk="'+k+'" data-sn="'+n+'"'+(x[0]===now?' class="on"':'')+'>'+(x[1]!==x[0]?x[1]+' ':'')+x[0]+'</button>'}).join('')});
  var gr=o.querySelector('#pkG');gr.innerHTML=top;gr.hidden=!top;
  o.querySelector('#pkP').innerHTML=g.pages.map(function(pg,n){return '<button type="button" data-pp="'+n+'"'+(n===PK.p?' class="on"':'')+'>'+pg.n+'</button>'}).join('');
  o.querySelector('#pkW').innerHTML=g.pages[PK.p].w.map(function(w,n){
    return '<button type="button" class="pkTile'+(w[0]===cur?' on':'')+'" data-n="'+n+'" data-w="'+esc(w[0])+'"><span class="pkIc">'+w[2]+'</span><span class="pkEn">'+w[0]+'</span>'+
     (w[1]!==w[0]?'<span class="pkZh">'+w[1]+'</span>':'')+'</button>'}).join('');
  /* 大字整句：句型卡的句子換成選到的字（每個字下面有中文） */
  var T=JSON.parse(JSON.stringify(c.tk)),z=c.zh||'';
  var put=function(k,v){if(!v)return;T.forEach(function(t){if(t.slot===k){t.en=v.w;t.zh=v.z;t.ic=v.ic;t.blank=0}});
    var x=curSlot(c.slots?k:null);if(x)z=rep(z,x.zh,v.z)};
  put(PK.k,PK.sel);SIDEK.forEach(function(k){put(k,PK.side[k])});
  o.querySelector('#pkLine').innerHTML=T.map(function(t,n,a){return tkHTML(t,n,a)}).join('');
  o.querySelector('#pkFull').textContent=z;
  o.querySelector('.pkUse').disabled=!(PK.sel||Object.keys(PK.side).length);
  o.querySelector('.pkUse').style.opacity=o.querySelector('.pkUse').disabled?.35:1;
  pkFit();if(talk)pkSay()}
function pkSay(){sayEls([].slice.call(document.querySelectorAll('#pkLine .tk')))}
/* 字太長就縮到放得下（不折掉整句、方塊裡的英文最多兩行） */
function pkFit(){
  [].forEach.call(document.querySelectorAll('#pk .pkEn'),function(e){e.style.fontSize='';var f=parseFloat(getComputedStyle(e).fontSize),n=0;
    while((e.scrollWidth>e.clientWidth+1||e.offsetHeight>f*2.35)&&n++<30){f*=.93;e.style.fontSize=f+'px'}});
  /* 方塊太矮（直式 iPad 一類 7、8 個字）：圖示先縮，英文不縮 */
  [].forEach.call(document.querySelectorAll('#pk .pkTile'),function(t){var ic=t.querySelector('.pkIc');ic.style.fontSize='';var f=parseFloat(getComputedStyle(ic).fontSize),n=0;
    var need=function(){var h=0;[].forEach.call(t.children,function(x){h+=x.offsetHeight});return h+(t.children.length-1)*6+12};
    while(need()>t.clientHeight&&f>18&&n++<25){f*=.9;ic.style.fontSize=f+'px'}});
  var L=document.getElementById('pkLine'),S=L.parentNode;L.style.fontSize='';var f=parseFloat(getComputedStyle(L).fontSize),n=0;
  while(L.scrollWidth>S.clientWidth+1&&n++<30){f*=.93;L.style.fontSize=f+'px'}
  var F=document.getElementById('pkFull');F.style.fontSize='';f=parseFloat(getComputedStyle(F).fontSize);n=0;
  while(F.scrollWidth>S.clientWidth+1&&n++<30){f*=.93;F.style.fontSize=f+'px'}}
function pkUse(){var c=CARDS[i],P=PK;pkClose();
  SIDEK.forEach(function(k){if(P.side[k])setSlot(P.side[k].w,P.side[k].z,P.side[k].ic,k)});
  if(P.sel)setSlot(P.sel.w,P.sel.z,P.sel.ic,P.k)}
window.addEventListener('resize',function(){if(PK)pkFit()});
`;

const PATCH = [
  ["function subsHTML(kind,inner){\n", "function subsHTML(kind,inner){\n  if(!inner&&CARDS[i]&&CARDS[i].pick&&pkMain(CARDS[i]))return pkBar();\n"],
  ["  var sub=t.closest?t.closest('.sub'):null;\n  if(sub){", "  if(t.closest&&t.closest('.pkGo')){pkOpen();return}\n  var sub=t.closest?t.closest('.sub'):null;\n  if(sub){"],
  ["  if($('#rv').classList.contains('on'))return;\n", "  if($('#rv').classList.contains('on'))return;\n  if(PK){if(e.key==='Escape')pkClose();return}\n"],
  ["var CARDS=__CARDS__", JS + "var CARDS=__CARDS__"]
];
module.exports = { CSS, PATCH };
