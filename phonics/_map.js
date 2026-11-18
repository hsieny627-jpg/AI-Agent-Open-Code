(function(){"use strict";
/* phonics/_map.js — 🗺️ 拼音 地圖（2026-11-16 第五十六次；2026-11-17 第五十七次 老師 17 點 大 改）。node phonics/_map_build.js ➜ map.html、map2.html
 * ① 🎬 秒懂 動畫（第五十七次：從 零 開始 的 鷹架 順序 28 段，見 phonics/2026-11-17_第五十七次_計畫.md 第三節）：
 *    每 段 開始 先 一張 卡：🎯 學 什麼、💪 對 英文 有 什麼 幫助 ➜〔▶ 逐次 播放〕〔👀 全部 展示〕〔🤔 引導 思考〕；最後〔📝 隨堂 測驗〕3 題（錯題 回饋 ＝ 25 題 闖關 那一套）
 *    〔1️⃣ 單字 唸 一次〕〔📑 目次〕；每 個 字母 正下方：音標＋聲音 點點（一個 聲音 一個 點）；每 一行 第一個 方框 上下 對齊；點 字母／注音／音標 ＝ 聽＋放大＋發亮
 *    顏色：藍 ＝ 子音、紅 ＝ 母音、黃 ＝ 唸 名字 的 母音（兩個 母音 字母：第一個 黃、第二個 灰 ＝ 不 發音）、母音 後 的 r ＝ 藍（子音）、灰 ＝ 不 發音（wh 的 h、ck 的 c、tch 的 t、mb 的 b、magic e）
 * ② 🗺️ 拼音 地圖：字首｜母音｜字尾（🟢 基礎 原本 樣子／🔵 進階 一次 看 一組）；點 一個 只 換 那 一個 地方；不合 拼字 習慣 的 ＝ 暗；〔🎧 你 來 拼〕〔👀 你 來 讀〕
 *    map2.html（window.MAP2）＝ 新 版本：字 在 最 上面 大大 的，每 一個 方框 正下方〔▲〕〔▼〕直接 換（照 Phonics Master 字卡 的 操作）
 * ③ 🪜 多 音節（唸到 的 音節 整個 放大＋發亮）＋🎵 重音 ④ 🔤 一個 字母 很多 聲音（每 個 字母 正下方 音標、不同 聲音 不同 深淺 的 紅）⑤ 🎮 遊戲（_map_games.js）*/
const $=s=>document.querySelector(s),$$=s=>[].slice.call(document.querySelectorAll(s)),H=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const R=a=>a[Math.floor(Math.random()*a.length)],SH=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const LS={g(k,d){try{const v=localStorage.getItem('phm_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},s(k,v){try{localStorage.setItem('phm_'+k,JSON.stringify(v))}catch(e){}}};
const AV=new Set(AVL),FAST=!!window.__PHFAST,M2=!!window.MAP2;let MD=LS.g('md','zh'),PAUSED=false,SLOW=1,TOK=0,ONE=LS.g('one',0);
/* ══ 聲音：一個 播放器，iPad 第一次 碰 就 解鎖，每 一次 都 有 保險 計時 ══ */
const AU=new Audio();
document.addEventListener('pointerdown',function u(){document.removeEventListener('pointerdown',u,true);try{AU.muted=true;AU.src='au/s_m.mp3';const p=AU.play();if(p)p.then(()=>{AU.pause();AU.muted=false}).catch(()=>{AU.muted=false})}catch(e){AU.muted=false}},true);
function say(f){return new Promise(res=>{if(window.__PHSAY)window.__PHSAY.push(f);let d=false;const fin=()=>{if(d)return;d=true;res()};if(!f||!AV.has(f)){fin();return}
  AU.muted=false;AU.src='au/'+f+'.mp3';AU.playbackRate=SLOW>1?.8:1;AU.onended=fin;AU.onerror=fin;setTimeout(fin,FAST?40:(SLOW>1?4200:3200));const p=AU.play();if(p&&p.catch)p.catch(fin)})}
const wait=ms=>new Promise(r=>{if(FAST){setTimeout(r,10);return}let left=ms*SLOW,last=Date.now();const t=setInterval(()=>{const n=Date.now();if(!PAUSED)left-=n-last;last=n;if(left<=0){clearInterval(t);r()}},50)});
async function sayW(f,t){if(t!==TOK)return;while(PAUSED&&t===TOK)await wait(100);if(t!==TOK)return;await say(f);await wait(220)}
/* ══ 一個 聲音 ＝ 一個 碼（tok）══ */
const CMAP={bb:'b',pp:'p',dd:'d',tt:'t',c:'k',k:'k',ph:'f',ll:'l',ss:'s',ff:'f',zz:'z',qu:'kw',x:'ks'},
  VMAP={a:'ae',e:'eh',i:'ih',o:'aa',u:'uh',oo:'uu',ee:'ee',ea:'ee',ai:'ai',ay:'ai',oa:'oa',ow:'oa',y:'ee',al:'ao',le:'el',ou:'ou',oy:'oy',oi:'oy',au:'ao',aw:'ao'};
const CHK=['dge','ve','bb','pp','dd','tt','tch','ch','sh','th','ph','wh','ng','ck','qu','ss','ll','ff','zz','oo','ee','ea','ai','ay','oa','ow','ou','oy','oi','au','aw'];
const RV={ar:'aa',or:'ao',er:'er1',ir:'er1',ur:'er1'};                 /* 母音＋r：母音 字母 自己 一格（紅）＋r 一格（藍，子音）*/
const TEAM2={ai:1,ay:1,ee:1,ea:1,oa:1,ow:1};                           /* 唸 名字 的 兩個 母音 字母：第一個 黃、第二個 灰 */
const NSND=t=>t==='ks'||t==='kw'?2:1;
const CODA={b:'s_eb',d:'s_ed',g:'s_eg',p:'s_ep',t:'s_et',k:'s_ek',m:'s_em',n:'s_en',l:'s_el',ks:'s_x',ch:'s_ech'};   /* 第六十次 老師 4-(4)：字尾 ch ＝ ㄔ（s_ech，先 閉住 再 爆開）*/
const UNASP={b_u:['ㄅ','p','b'],d_u:['ㄉ','t','d'],g_u:['ㄍ','k','g']};   /* s 後面 的 p t k：注音 ＝ ㄅ ㄉ ㄍ（老師：speech 的 p 實際 是 ㄅ）*/
function auOf(t,coda){if(!t)return null;if(UNASP[t])return 's_'+UNASP[t][2];if(coda&&CODA[t])return CODA[t];if(t==='yu')return 's_uu';if(t==='ah')return 's_uh';if(t==='er1')return 's_uh';if(t==='rr'||t==='rr2')return 's_er';if(t==='dj')return 's_j';   /* 第五十八次 老師 (6)-8：ir er ur 的 i e u ＝ ㄜ；r 點 了 要 有 聲音 */return 's_'+t}
/* 2026-11-17 第五十八次 老師 (4)：兩個 注音 一格 ＝ 大 的＋右上角 小 的（照 老師 雙語 注音 表 的 排法）：ㄝㄚ、一ㄝ、ㄨㄛ、ㄛ一、ㄊ〃 */
const ZSPLIT={'ㄛ一':['ㄛ','一']};
function tileOf(t,coda){if(UNASP[t])return {zh:UNASP[t][0],sup:'',kk:UNASP[t][1],ipa:UNASP[t][1]};const T=TT[t]||{zh:t,kk:t,ipa:t};let o={zh:T.zh,sup:T.sup||'',kk:T.kk,ipa:T.ipa};if(ZSPLIT[o.zh]&&!o.sup){o.sup=ZSPLIT[o.zh][1];o.zh=ZSPLIT[o.zh][0]}
  if(coda){if(/^[bdgptk]$/.test(t))o.sup='〃';else if(t==='m'||t==='n')o.sup='～';else if(t==='l')o={zh:'ㄛ',sup:'',kk:'l',ipa:'l'};else if(t==='ng')o.sup=''}return o}
function tileHTML(t,coda,hide){if(!t)return '<span class="tl sl0"></span>';const o=tileOf(t,coda),tx=MD==='zh'?o.zh:MD==='kk'?o.kk:o.ipa;
  const hs=MD==='zh'&&o.sup;return '<span class="tl'+(MD==='zh'?'':' ph')+(hs?' hs':'')+(hide?' hide':'')+'" data-t="'+t+'" data-cd="'+(coda?1:0)+'">'+(hs?'<b class="zm">'+tx+'</b><sup class="zc">'+o.sup+'</sup>':(tx||'&nbsp;'))+'</span>'}
function retile(){setTimeout(()=>{if(ALG&&document.body.contains(ALG[0]))alignRows(ALG[0],ALG[1])},0);$$('.tl[data-t]').forEach(el=>{const h=el.classList.contains('hide'),on=el.classList.contains('on');const x=H('div','',tileHTML(el.dataset.t,el.dataset.cd==='1',h)).firstChild;if(on)x.classList.add('on');el.replaceWith(x)})}
/* 字 的 寫法："b.a.th|r.oo.m"（. ＝ 方框、| ＝ 音節）：o=ao（母音 碼）、a!=ai（唸 名字 ＝ 黃）、e~（不 發音 灰）、th=dh（有聲 th）、[ㄅ]c 注音；
 * 自動：ai ay ee ea oa ow 加 ! ＝ 第一個 黃、第二個 灰；ar or er ir ur ＝ 母音 一格＋r 藍 一格；wh 的 h、ck 的 c、tch 的 t、mb 的 b ＝ 灰；s 後面 的 p t k ＝ ㄅ ㄉ ㄍ */
const ZYAU={'ㄅ':'zy_b','ㄚ':'zy_a'};
function parse(spec){return spec.split('|').map(sy=>{let seenV=false;const out=[];sy.split('.').forEach((b,bi)=>{let o={ch:[]},m;
  if((m=/^\[(.+)\]([cv])$/.exec(b))){out.push({type:m[2],zy:1,ch:[{l:m[1],t:null,au:ZYAU[m[1]]}]});return}
  if(/~$/.test(b)){out.push({type:'g',ch:[{l:b.slice(0,-1),t:null,sil:1}]});return}
  let L=b,ov=null,nm=false;if((m=/^(.+?)(!)?=(.+)$/.exec(b))){L=m[1];nm=!!m[2];ov=m[3]}else if(/!$/.test(b)){L=b.slice(0,-1);nm=true}
  const isV=/^[aeiou]/.test(L)||L==='le'||(L==='y'&&bi>0);
  if(isV&&RV[L]){seenV=true;const tv=ov||RV[L];out.push({type:'v',ch:[{l:L[0],t:tv}]});out.push({type:'c',coda:true,rr:1,ch:[{l:'r',t:tv==='er1'?'rr2':L==='ar'||L==='or'?'rr':'rr2'}]});return}
  if(isV){seenV=true;const t=ov||VMAP[L]||L;o.type=nm?'n':'v';o.ch=nm&&L.length===2&&TEAM2[L]?[{l:L[0],t,nm:1},{l:L[1],t:null,sil:1}]:[{l:L,t,nm:nm?1:0}];out.push(o);return}
  const parts=[];let s=L;while(s){const c=CHK.find(x=>s.startsWith(x))||s[0];parts.push(c);s=s.slice(c.length)}
  o.type='c';o.coda=seenV;parts.forEach((c,pi)=>{
    if(c==='wh'){o.ch.push({l:'w',t:'w'},{l:'h',t:null,sil:1});return}
    if(c==='ck'){o.ch.push({l:'c',t:null,sil:1},{l:'k',t:'k'});return}
    if(c==='tch'){o.ch.push({l:'t',t:null,sil:1},{l:'ch',t:'ch'});return}
    if(c==='dge'&&seenV){o.ch.push({l:'d',t:null,sil:1},{l:'g',t:'dj'},{l:'e',t:null,sil:1});return}   /* 第六十一次：dge ＝ ㄓ（d、e 灰）*/
    if(c==='ve'&&seenV){o.ch.push({l:'v',t:'v'},{l:'e',t:null,sil:1});return}   /* ve ＝ v（e 灰）*/
    if(c==='b'&&seenV&&parts[pi-1]==='m'){o.ch.push({l:'b',t:null,sil:1});return}
    let t=ov&&parts.length===1?ov:(CMAP[c]||c);if(!seenV&&pi>0&&parts[0]==='s'&&/^(p|t|k|c)$/.test(c))t={p:'b_u',t:'d_u',k:'g_u',c:'g_u'}[c];
    o.ch.push({l:c,t})});out.push(o)});return out})}
function nOf(b,c){return b.type==='g'||c.sil?0:b.zy?1:(c.t?NSND(c.t):0)}
function bxHTML(B,o){o=o||{};return B.map((b,bi)=>'<div class="bx '+b.type+(b.rr?' rr':'')+(o.hide?' hid':'')+(o.sx!=null?(o.sx?' sx':' su'):'')+'" data-b="'+bi+'"'+(o.shade&&b.type!=='c'&&b.type!=='g'&&o.shade[bi]?' style="--sh:'+o.shade[bi]+';background:'+o.shade[bi]+'"':'')+'>'+
  (o.lab?'<span class="bl">'+(b.type==='c'?'子音':b.type==='g'?'不 發音':'母音')+'</span>':'')+
  b.ch.map((c,ci)=>{const n=nOf(b,c);return '<div class="ck'+(c.nm?' nm':'')+(c.sil?' sil':'')+'" data-c="'+ci+'"'+(c.au?' data-zy="'+c.au+'"':'')+'><span class="L'+(b.zy?' zy':'')+(c.sil?' gr':'')+(/[gjpqy]/.test(c.l)?' dsc':'')+'">'+c.l+'</span>'+
    (b.zy?'':'<span class="T">'+(c.sil?'<span class="tl sl0"></span>':tileHTML(c.t,b.coda,o.hideT))+'</span>')+'<span class="dt">'+Array.from({length:n},()=>'<i class="'+(o.dots?'on':'')+'"></i>').join('')+'</span></div>'}).join('')+'</div>').join('')}
function wordHTML(spec,o){o=o||{};const S=parse(spec),st=o.st;return S.map((B,si)=>S.length>1?'<div class="syl" data-s="'+si+'">'+bxHTML(B,Object.assign({},o,{sx:st!=null?(si===st):null}))+'</div>':bxHTML(B,o)).join(S.length>1?'<span class="plus">＋</span>':'')}
function countOf(spec){const S=parse(spec);let n=0,b=0,v=0;S.forEach(B=>B.forEach(x=>{if(x.type==='g')return;b++;if(x.type!=='c')v++;x.ch.forEach(c=>{n+=nOf(x,c)})}));return {n,b,v}}
/* 第五十八次：一行 的 母音 方框 換 顏色（老師 (5)-26：4 個 a 用 明顯 不同 的 紅）*/
function shadeV(spec,col){const o={};parse(spec).forEach(B=>B.forEach((b,bi)=>{if(b.type==='v'||b.type==='n')o[bi]=col}));return o}
/* 第五十八次：對齊（老師 (5)-2 ㄚ 正下方 a ＝ 每 一欄 一樣 寬；(5)-14、15、21 ＝ 母音 方框 上下 對齊）*/
/* 第六十一次 老師 6（對）：live ／ living 照 字母 位置 上下 對齊（l 對 l、i 對 i、v 對 v），live 的 e 消失（✖ 淡出），liv · ing 兩 個 虛線 框 */
function alignLtr(root){const R=qsa(root,'.rows .wrow');if(R.length<2)return;const A=qsa(R[0],'.bx'),Bx=qsa(R[1],'.bx');if(A.length<4||Bx.length<3)return;
  A.forEach(b=>{b.style.marginLeft='';b.style.minWidth=''});for(let k=0;k<3;k++){const w=Math.max(A[k].offsetWidth,Bx[k].offsetWidth);A[k].style.minWidth=Bx[k].style.minWidth=w+'px'}
  for(let k=0;k<3;k++){const d=Bx[k].getBoundingClientRect().left-A[k].getBoundingClientRect().left;if(Math.abs(d)>.5)A[k].style.marginLeft=(parseFloat(A[k].style.marginLeft||0)+d)+'px'}
  const e=A[A.length-1];if(e&&e.classList.contains('g'))e.classList.add('xe')}
function alignRows(root,mode){const rows=qsa(root,'.rows .wrow').filter(w=>!w.querySelector('.syl'));rows.forEach(w=>{w.style.paddingLeft='';qsa(w,'.bx').forEach(b=>b.style.minWidth='')});if(rows.length<2)return;
  if(mode==='v'){const off=rows.map(w=>{const b=qsa(w,'.bx').find(x=>x.classList.contains('v')||x.classList.contains('n'));return b?b.offsetLeft-w.offsetLeft:0}),mx=Math.max.apply(null,off);rows.forEach((w,k)=>{if(mx-off[k]>0)w.style.paddingLeft=(parseFloat(getComputedStyle(w).paddingLeft)||0)+(mx-off[k])+'px'});return}
  const W=[];rows.forEach(w=>qsa(w,'.bx').forEach((b,j)=>{W[j]=Math.max(W[j]||0,b.offsetWidth)}));rows.forEach(w=>qsa(w,'.bx').forEach((b,j)=>{b.style.minWidth=W[j]+'px'}))}
function patTxt(spec){return parse(spec).map(B=>B.filter(x=>x.type!=='g').map(x=>x.type==='c'?'子':'母').join(' ')).join('｜')}
/* ══ ① 秒懂 動畫：從 零 開始 的 鷹架（每 段 一個 新 觀念，都 站 在 前 一段 上面）══
 * g ＝ 🎯 學 什麼、w ＝ 💪 對 英文 有 什麼 幫助、ask ＝ 🤔 引導 思考 的 最後 一個 問題、qz ＝ 隨堂 測驗 的 題型 */
const SC=[
 {k:'zy',t:'👂 聲音 可以 拆、可以 合',g:'ㄅ＋ㄚ ＝ ㄅㄚ',w:'拼 英文 也 是 這樣',rows:[{s:'[ㄅ]c.[ㄚ]v',au:'zy_ba'}],ask:'🤔 ㄅㄚ 有 幾 個 聲音？',cap:'ㄅ 和 ㄚ 兩個 聲音 ➜ 快快 合 起來 ＝ ㄅㄚ',ca:[{t:'先 唸 ㄅ',s:'[ㄅ]c',a:'zy_b'},{t:'再 唸 ㄚ',s:'[ㄚ]v',a:'zy_a'},{t:'快快 合 起來 ＝ ㄅㄚ',s:'[ㄅ]c.[ㄚ]v',a:'zy_ba'},{t:'✅ 2 個 聲音 ➜ 合 成 1 個 字'}],cap0:'<span class="cb">ㄅ</span> ＋ <span class="vb">ㄚ</span> ＝ ㄅㄚ',qz:'zy'},
 {k:'ab',t:'🔤 字母 也 有 聲音',g:'b ＝ ㄅ',w:'看到 字母 ➜ 想到 聲音',rows:[{s:'[ㄅ]c.[ㄚ]v',au:'zy_ba',dim:1},{s:'b.a.t',au:'b-ae-t'}],ask:'🤔 b 和 ㄅ 一樣 嗎？',cap:'英文 字母 b 的 聲音 ＝ 注音 ㄅ',ca:[{t:'注音 ㄅ',s:'[ㄅ]c',a:'zy_b'},{t:'英文 b 也 唸 ㄅ',s:'b',a:'s_b'},{t:'a 唸 ㄝㄚ',s:'a',a:'s_ae'},{t:'✅ 看到 字母 ➜ 想到 它 的 聲音'}],cap0:'<span class="cb">b ＝ ㄅ</span>　<span class="vb">a ＝ ㄝㄚ</span>',qz:'zy'},
 {k:'cv0',t:'🔴🔵 子音 和 母音 是 什麼？',g:'🔴 母音 ＝ 嘴巴 打開　🔵 子音 ＝ 擋 一下',w:'每 個 字 先 找 🔴 母音，就 會 分、會 唸',cv:1,rows:[],ask:'🤔 cat 的 母音 是 哪 一個？',cap:'<span class="vb">a e i o u</span> ＝ 母音（5 個）　其他 21 個 ＝ <span class="cb">子音</span>',qz:'cv',ca:[{t:'🔴 母音：嘴巴 打開，聲音 可以 拉 很 長',s:'a',a:'s_ae'},{t:'🔵 子音：嘴唇、舌頭、牙齒 先 擋 一下',s:'b',a:'s_b'},{t:'英文 只有 5 個 母音 字母',s:'a.e.i.o.u',p:1},{t:'cat ＝ 🔵 子 ＋ 🔴 母 ＋ 🔵 子',s:'c.a.t',p:1,a:'k-ae-t'},{t:'✅ 看到 字 ➜ 先 找 🔴 母音'}]},
 {k:'cvc',t:'👀 看字 讀音：一個 一個 唸 ➜ 合 起來',g:'看到 字 ➜ 唸 出來',w:'沒 學 過 的 字 也 會 唸',how:'R',rows:[{s:'m.a.p',au:'m-ae-p'},{s:'p.i.g',au:'p-ih-g'}],ask:'🤔 紅框 在 哪裡？',cap:'👀 看 字 ➜ 🔴 找 母音 ➜ 一個 一個 唸 ➜ 🔗 合 起來',qz:'readA',ca:[{t:'① 👀 看 字',s:'m.a.p'},{t:'② 🔴 找 母音：a',s:'m.a.p',v:1},{t:'③ 一個 一個 唸：m ‧ a ‧ p',s:'m.a.p',p:1},{t:'④ 🔗 合 起來 ＝ map',s:'m.a.p',a:'m-ae-p'}]},
 {k:'seg',t:'✏️ 聽音 拼字：聽 ➜ 數 聲音 ➜ 寫 字母',g:'聽到 聲音 ➜ 寫 出 字母',w:'聽到 就 會 拼',how:'S',rows:[{s:'h.e.n',au:'h-eh-n'},{s:'c.u.p',au:'k-uh-p'}],ask:'🤔 有 幾 個 聲音？',cap:'👂 聽到 3 個 聲音 ➜ ✏️ 寫 3 個 字母',qz:'spellB',ca:[{t:'① 👂 聽：hen',a:'h-eh-n'},{t:'② 數 聲音：3 個',d:3},{t:'③ 一個 聲音 寫 一個 字母',s:'h.e.n',p:1},{t:'✅ 3 個 聲音 ➜ 3 個 字母',s:'h.e.n',a:'h-eh-n'}]},
 {k:'chg',t:'🔁 換 一個 方框',g:'bat ➜ cat ➜ cut ➜ cup',w:'會 一個 ＝ 會 很多 個',rows:[{s:'b.a.t',au:'b-ae-t'},{s:'c.a.t',au:'k-ae-t'},{s:'c.u.t',au:'k-uh-t'},{s:'c.u.p',au:'k-uh-p'}],ask:'🤔 換 了 哪 一個？',cap:'只 換 一個 字母 ➜ 變 成 一個 新 的 字',ca:[{t:'bat',s:'b.a.t',a:'b-ae-t'},{t:'換 第一個：b ➜ c ＝ cat',s:'c.a.t',a:'k-ae-t'},{t:'換 中間：a ➜ u ＝ cut',s:'c.u.t',a:'k-uh-t'},{t:'換 最後：t ➜ p ＝ cup',s:'c.u.p',a:'k-uh-p'}],cap0:'每 次 只 換 <b>一個</b> 方框',qz:'part'},
 {k:'d_ch',t:'👯 ch ＝ 一個 聲音',g:'ch ＝ ㄔ',w:'不 拆 開 唸',rows:[{s:'c.h',au:null,lab:'錯 的 唸法',x:1},{s:'ch',au:'s_ch',lab:'✅ ch ＝ 一個 聲音'},{s:'ch.i.n',au:'ch-ih-n'}],ask:'🤔 chin 有 幾 個 聲音？',cap:'c 和 h 放 在 一起 ➜ 只 唸 一個 聲音 ㄔ',ca:[{t:'❌ 不 是 c、h 分開 唸',s:'c.h',x:1},{t:'✅ ch ＝ 一個 聲音 ㄔ',s:'ch',a:'s_ch'},{t:'chin：ch ‧ i ‧ n ＝ 3 個 聲音',s:'ch.i.n',p:1,a:'ch-ih-n'}],cap0:'<b>ch</b> ＝ 1 個 聲音　chin ＝ ●●●',qz:'dig1'},
 {k:'d_sh',t:'👯 sh ＝ 一個 聲音',g:'sh ＝ ㄕ',w:'不 拆 開 唸',rows:[{s:'s.h',au:null,lab:'錯 的 唸法',x:1},{s:'sh',au:'s_sh',lab:'✅ sh ＝ 一個 聲音'},{s:'sh.i.p',au:'sh-ih-p'}],ask:'🤔 ship 有 幾 個 聲音？',cap:'s 和 h 放 在 一起 ➜ 只 唸 一個 聲音 ㄕ',ca:[{t:'❌ 不 是 s、h 分開 唸',s:'s.h',x:1},{t:'✅ sh ＝ 一個 聲音 ㄕ',s:'sh',a:'s_sh'},{t:'ship：sh ‧ i ‧ p ＝ 3 個 聲音',s:'sh.i.p',p:1,a:'sh-ih-p'}],cap0:'<b>sh</b> ＝ 1 個 聲音　ship ＝ ●●●',qz:'dig1'},
 {k:'d_th',t:'👯 th ＝ 一個 聲音（不 震動）',g:'舌頭 輕輕 咬、吹 氣',w:'thin、three',rows:[{s:'t.h',au:null,lab:'錯 的 唸法',x:1},{s:'th',au:'s_th',lab:'✅ th ＝ 一個 聲音'},{s:'th.i.n',au:'bk_thin'}],ask:'🤔 舌頭 在 哪裡？',cap:'th：舌頭 輕輕 咬 ＋ 吹 氣（不 是 t，也 不 是 h）',ca:[{t:'❌ 不 是 t、h 分開 唸',s:'t.h',x:1},{t:'👅 舌頭 放 在 上下 牙齒 中間',s:'th',a:'s_th'},{t:'💨 輕輕 吹 氣：thin',s:'th.i.n',p:1,a:'bk_thin'}],cap0:'👅 咬 舌 ＋ 💨 吹 氣',qz:'dig1'},
 {k:'d_dh',t:'👯 th（會 震動）',g:'this 的 th：喉嚨 會 震動',w:'this、that、the',rows:[{s:'th',au:'s_th',lab:'不 震動（thin）'},{s:'th=dh',au:'s_dh',lab:'會 震動（this）'},{s:'th=dh.i.s',au:'dh-ih-s'}],ask:'🤔 摸 喉嚨：哪 一個 會 震動？',cap:'thin 的 th：只 吹 氣 💨　this 的 th：喉嚨 會 震動 📳',ca:[{t:'👅 兩個 都 要 輕輕 咬 舌頭'},{t:'thin 的 th：只 吹 氣 💨（喉嚨 不 震動）',s:'th',a:'s_th'},{t:'this 的 th：喉嚨 會 震動 📳',s:'th=dh',a:'s_dh'},{t:'✋ 手 摸 喉嚨，唸 唸 看 this',s:'th=dh.i.s',a:'dh-ih-s'}],cap0:'thin 💨　this 📳',qz:'dig1'},
 {k:'d_ph',t:'👯 ph ＝ ㄈ',g:'ph ＝ f',w:'phone、photo',rows:[{s:'p.h',au:null,lab:'錯 的 唸法',x:1},{s:'ph',au:'s_f',lab:'✅ ph ＝ ㄈ'},{s:'ph.o!=oa.n.e~',au:'w_phone'}],ask:'🤔 ph 像 哪 一個 字母？',cap:'p 和 h 放 在 一起 ➜ 唸 ㄈ（跟 f 一樣）',ca:[{t:'❌ 不 是 p、h 分開 唸',s:'p.h',x:1},{t:'✅ ph ＝ ㄈ',s:'ph',a:'s_f'},{t:'phone',s:'ph.o!=oa.n.e~',a:'w_phone'}],cap0:'<b>ph ＝ f</b>',qz:'dig1'},
 {k:'d_ng',t:'👯 ng ＝ 一個 鼻音',g:'ng ＝ ㄥ',w:'ring、sing、king',rows:[{s:'n.g',au:null,lab:'錯 的 唸法',x:1},{s:'ng',au:'s_ng',lab:'✅ ng ＝ 一個 聲音'},{s:'r.i.ng',au:'r-ih-ng'}],ask:'🤔 ring 有 幾 個 聲音？',cap:'n 和 g 放 在 一起 ➜ 只 唸 一個 鼻音 ㄥ',ca:[{t:'❌ 不 是 n、g 分開 唸',s:'n.g',x:1},{t:'✅ ng ＝ 一個 聲音 ㄥ',s:'ng',a:'s_ng'},{t:'ring：r ‧ i ‧ ng ＝ 3 個 聲音',s:'r.i.ng',p:1,a:'r-ih-ng'}],cap0:'<b>ng</b> ＝ 1 個 聲音　ring ＝ ●●●',qz:'dig1'},
 {k:'d_wh',t:'👯 wh ＝ ㄨ',g:'h 不 發音（灰）',w:'what、where、when',rows:[{s:'wh',au:'s_w',lab:'✅ wh ＝ ㄨ'},{s:'wh.i.p',au:'w-ih-p'}],ask:'🤔 h 有 聲音 嗎？',cap:'wh 只 唸 w 的 聲音 ㄨ，h 不 唸（灰色）',ca:[{t:'wh：w 唸 ㄨ，h 灰色 不 唸',s:'wh',a:'s_w'},{t:'whip',s:'wh.i.p',p:1,a:'w-ih-p'}],cap0:'<b>wh ＝ ㄨ</b>　h 灰色 ＝ 不 唸',qz:'dig1'},
 {k:'d_ck',t:'👯 ck ＝ ㄎ',g:'c 不 發音（灰）',w:'duck、back、kick',rows:[{s:'ck',au:'s_k',lab:'✅ ck ＝ ㄎ'},{s:'d.u.ck',au:'d-uh-k'}],ask:'🤔 duck 有 幾 個 聲音？',cap:'ck 只 唸 k 的 聲音 ㄎ，c 不 唸（灰色）',ca:[{t:'ck：c 灰色 不 唸，k 唸 ㄎ',s:'ck',a:'s_k'},{t:'duck：d ‧ u ‧ ck ＝ 3 個 聲音',s:'d.u.ck',p:1,a:'d-uh-k'}],cap0:'<b>ck ＝ ㄎ</b>　duck ＝ ●●●',qz:'dig1'},
 {k:'bl1',t:'➕ 多 一個 子音',g:'bat ➜ blat ➜ blast',w:'長 的 字 也 不 怕',al:'v',rows:[{s:'b.a.t',au:'b-ae-t'},{s:'bl.a.t',au:'bl-ae-t',fake:1},{s:'bl.a.st',au:'bl-ae-st'}],ask:'🤔 聲音 一樣 多 嗎？',cap:'多 一個 字母 ➜ 多 一個 聲音',ca:[{t:'bat ＝ 3 個 聲音',s:'b.a.t',d:1,a:'b-ae-t'},{t:'加 l ➜ blat ＝ 4 個 聲音',s:'bl.a.t',d:1,a:'bl-ae-t'},{t:'加 s ➜ blast ＝ 5 個 聲音',s:'bl.a.st',d:1,a:'bl-ae-st'}],cap0:'●●● ➜ ●●●● ➜ ●●●●●',qz:'on'},
 {k:'bl2',t:'➕ 一個 一個 加 上去',g:'song ➜ stong ➜ strong',w:'str 也 唸 得 出來',al:'v',rows:[{s:'s.o=ao.ng',au:'w_song'},{s:'st.o=ao.ng',au:'w_stong',fake:1},{s:'str.o=ao.ng',au:'bk_strong'}],ask:'🤔 strong 有 幾 個 聲音？',cap:'s ➜ st ➜ str：一個 一個 加 上去',ca:[{t:'song',s:'s.o=ao.ng',a:'w_song'},{t:'加 t ➜ stong（s 後面 的 t 唸 ㄉ）',s:'st.o=ao.ng',a:'w_stong'},{t:'再 加 r ➜ strong',s:'str.o=ao.ng',a:'bk_strong'}],cap0:'s ➜ st ➜ str　（s 後面 的 t ＝ ㄉ）',qz:'on'},
 {k:'fin',t:'🔚 字尾 兩個 子音',g:'ten ➜ tent',w:'不 漏 n、m',rows:[{s:'t.e.n',au:'t-eh-n'},{s:'t.e.nt',au:'t-eh-nt'},{s:'c.a.m',au:'k-ae-m',fake:1},{s:'c.a.mp',au:'k-ae-mp'}],ask:'🤔 tent 最後 有 幾 個 聲音？',cap:'字 最後 的 兩個 子音 都 要 唸',ca:[{t:'ten',s:'t.e.n',a:'t-eh-n'},{t:'最後 加 t ➜ tent（n 和 t 都 唸）',s:'t.e.nt',p:1,a:'t-eh-nt'},{t:'camp（m 和 p 都 唸）',s:'c.a.mp',p:1,a:'k-ae-mp'}],cap0:'n＋t　m＋p',qz:'co'},
 {k:'mag',t:'🪄 magic e',g:'cap ➜ cape',w:'母音 唸 名字',rows:[{s:'c.a.p',au:'k-ae-p'},{s:'c.a!=ai.p.e~',au:'k-ai-p'},{s:'k.i.t',au:'k-ih-t'},{s:'k.i!=ii.t.e~',au:'k-ii-t'}],ask:'🤔 最後 的 e 有 聲音 嗎？',cap:'最後 加 e（不 唸）➜ 前面 的 a 唸 自己 的 名字',ca:[{t:'cap',s:'c.a.p',a:'k-ae-p'},{t:'最後 加 e ➜ e 灰色 不 唸',s:'c.a!=ai.p.e~'},{t:'a 變 黃色 ＝ 唸 名字 ㄟ：cape',s:'c.a!=ai.p.e~',a:'k-ai-p'}],cap0:'e 不 唸 ➜ <span class="nmb">a</span> 唸 名字',qz:'magic'},
 {k:'team',t:'👫 兩個 母音 字母',g:'第一個 唸 名字、第二個 不 唸',w:'rain、day、seat、boat',rows:[{s:'r.ai!=ai.n',au:'w_rain'},{s:'d.ay!=ai',au:'w_day'},{s:'s.ea!=ee.t',au:'s-ee-t'},{s:'b.oa!=oa.t',au:'b-oa-t'}],ask:'🤔 rain 的 i 有 聲音 嗎？',cap:'兩個 母音 字母：第一個 唸 名字（黃），第二個 不 唸（灰）',ca:[{t:'rain：a 黃色 唸 名字',s:'r.ai!=ai.n',p:1},{t:'i 灰色 不 唸',s:'r.ai!=ai.n',a:'w_rain'},{t:'boat：o 唸 名字，a 不 唸',s:'b.oa!=oa.t',a:'b-oa-t'}],cap0:'<span class="nmb">a</span><span class="grb">i</span>　<span class="nmb">a</span><span class="grb">y</span>　<span class="nmb">e</span><span class="grb">a</span>　<span class="nmb">o</span><span class="grb">a</span>',qz:'team'},
 {k:'oo',t:'🌙 oo ＝ 一個 母音',g:'rom ➜ room',w:'room、moon、food',rows:[{s:'r.o.m',au:'r-aa-m',fake:1},{s:'r.oo.m',au:'bk_room'}],ask:'🤔 oo 是 幾 個 聲音？',cap:'oo 兩個 字母 ＝ 一個 聲音 ㄨ',ca:[{t:'rom（假字）：o 唸 ㄚ',s:'r.o.m',a:'r-aa-m'},{t:'oo ＝ 一個 聲音 ㄨ：room',s:'r.oo.m',p:1,a:'bk_room'}],cap0:'<b>oo ＝ ㄨ</b>　m 閉 嘴',qz:'count'},
 {k:'rr',t:'🔵 母音＋r',g:'r 是 藍色 子音',w:'car、for、bird',rows:[{s:'c.ar',au:'w_car'},{s:'f.or',au:'f-or'},{s:'b.ir.d',au:'b-er-d'}],ask:'🤔 r 是 什麼 顏色？',cap:'母音 後面 的 r ＝ 藍色 子音（捲 舌 ㄦ）',ca:[{t:'car：a ＋ 藍色 r',s:'c.ar',p:1,a:'w_car'},{t:'for',s:'f.or',p:1,a:'f-or'},{t:'bird',s:'b.ir.d',p:1,a:'b-er-d'}],cap0:'ar　or　ir ➜ r ＝ <span class="cb">藍</span>',qz:'count'},
 {k:'tin',t:'🔁 t ➜ th',g:'tin ➜ thin',w:'會 比較 就 不 唸 錯',al:'v',rows:[{s:'t.i.n',au:'t-ih-n'},{s:'th.i.n',au:'bk_thin'}],ask:'🤔 哪裡 不一樣？',cap:'tin ➜ thin：只 換 第一個（t ➜ th）',ca:[{t:'tin',s:'t.i.n',a:'t-ih-n'},{t:'t 換 成 th ➜ thin',s:'th.i.n',a:'bk_thin'}],cap0:'只 換 <b>字首</b>',qz:'part'},
 {k:'all',t:'🔁 all 家族',g:'ball ➜ tall ➜ fall',w:'all ＝ ㄛ',rows:[{s:'b.a=ao.ll',au:'w_ball'},{s:'t.a=ao.ll',au:'bk_tall'},{s:'f.a=ao.ll',au:'w_fall'}],ask:'🤔 哪 一個 不一樣？',cap:'ball、tall、fall：後面 都 一樣，只 換 第一個 字母',ca:[{t:'ball',s:'b.a=ao.ll',a:'w_ball'},{t:'b ➜ t：tall',s:'t.a=ao.ll',a:'bk_tall'},{t:'t ➜ f：fall',s:'f.a=ao.ll',a:'w_fall'}],cap0:'只 換 <b>第一個</b>',qz:'part'},
 {k:'sh2',t:'🔁 一次 換 一個',g:'sot ➜ shot ➜ short',w:'自己 拼 新 字',rows:[{s:'s.o.t',au:'s-aa-t',fake:1},{s:'sh.o.t',au:'sh-aa-t'},{s:'sh.or.t',au:'bk_short'},{s:'sh.or.m',au:'sh-or-m',fake:1},{s:'sh.o.mp',au:'sh-aa-mp',fake:1}],ask:'🤔 每 次 換 了 哪裡？',cap:'每 次 只 改 一個 地方 ➜ 自己 拼 出 新 字',ca:[{t:'sot',s:'s.o.t',a:'s-aa-t'},{t:'s ➜ sh：shot',s:'sh.o.t',a:'sh-aa-t'},{t:'o ➜ or：short',s:'sh.or.t',a:'bk_short'}],cap0:'每 次 只 換 <b>一個</b>',qz:'part'},
 {k:'syl',t:'🪜 兩個 紅框 ＝ 兩個 音節',g:'bath ＋ room',w:'長 字 一塊 一塊 唸',rows:[{s:'b.a.th',au:'b-ae-th'},{s:'r.oo.m',au:'bk_room'},{s:'b.a.th|r.oo.m',au:'bk_bathroom',st:0}],ask:'🤔 有 幾 個 紅框？',cap:'2 個 紅框（母音）＝ 2 個 音節：bath ＋ room',ca:[{t:'bath（1 個 紅框）',s:'b.a.th',a:'b-ae-th'},{t:'room（1 個 紅框）',s:'r.oo.m',a:'bk_room'},{t:'合 起來 ＝ bathroom（2 個 音節）',s:'b.a.th|r.oo.m',a:'bk_bathroom'}],cap0:'2 個 <span class="vb">紅框</span> ＝ 2 個 音節',qz:'syl'},
 {k:'baby',t:'🪜 ba ➜ baby',g:'ba ＋ by',w:'課本 兩 音節 字',rows:[{s:'b.a!=ai',au:'w_c55_ba'},{s:'b.a!=ai|b.y',au:'w_c55_baby',st:0}],ask:'🤔 a 為什麼 是 黃色？',cap:'baby ＝ ba ＋ by（a 黃色 唸 名字）',ca:[{t:'ba',s:'b.a!=ai',a:'w_c55_ba'},{t:'ba ＋ by ＝ baby',s:'b.a!=ai|b.y',a:'w_c55_baby'}],cap0:'ba ＋ by',qz:'syl',more:1},
 {k:'many1',t:'🎨 一個 a，4 種 聲音',g:'看 後面 的 字母',w:'a 不 只 一種 唸法',rows:[{s:'c.a.t',au:'bk_cat',sh:'#E53935',nt:'a ＝ ㄝㄚ'},{s:'c.a!=ai.k.e~',au:'w_cake',nt:'a（黃）＝ ㄟ'},{s:'b.a=ao.ll',au:'w_ball',sh:'#8E3DFF',nt:'a ＝ ㄛ'},{s:'c.ar',au:'w_car',sh:'#FF8A00',nt:'a ＝ ㄚ'}],ask:'🤔 4 個 a 一樣 嗎？',cap:'同 一個 a，有 4 種 唸法：看 a 後面 的 字母',ca:[{t:'cat 的 a ＝ ㄝㄚ',s:'c.a.t',a:'bk_cat'},{t:'cake 的 a（黃）＝ ㄟ',s:'c.a!=ai.k.e~',a:'w_cake'},{t:'ball 的 a ＝ ㄛ',s:'b.a=ao.ll',a:'w_ball'},{t:'car 的 a ＝ ㄚ',s:'c.ar',a:'w_car'}],cap0:'<span style="color:#FF5FA2">ㄝㄚ</span>　<span style="color:#FF7A1A">ㄟ</span>　<span style="color:#FF9C9C">ㄛ</span>　<span style="color:#E04BB0">ㄚ</span>',qz:'many'},
 {k:'many2',t:'🎨 一個 ㄟ，3 種 拼法',g:'a_e　ai　ay',w:'聽到 ㄟ 會 拼',rows:[{s:'c.a!=ai.k.e~',au:'w_cake'},{s:'r.ai!=ai.n',au:'w_rain'},{s:'d.ay!=ai',au:'w_day'}],ask:'🤔 ay 在 哪裡？',cap:'ㄟ 有 3 種 拼法：a_e、ai（在 中間）、ay（在 最後）',ca:[{t:'cake：a_e',s:'c.a!=ai.k.e~',a:'w_cake'},{t:'rain：ai 在 中間',s:'r.ai!=ai.n',a:'w_rain'},{t:'day：ay 在 最後',s:'d.ay!=ai',a:'w_day'}],cap0:'ay 在 <b>最後</b>',qz:'team'},
 {k:'sum',t:'🏆 總 整理',g:'3 種 最 重要 的 拼法',w:'新 的 字 自己 會 唸',why:'為什麼 是 這 3 個 字？<br>ship ＝ 👯 兩個 字母 一個 聲音　cake ＝ 🪄 magic e　bathroom ＝ 🪜 兩個 音節',rows:[{s:'sh.i.p',au:'sh-ih-p'},{s:'c.a!=ai.k.e~',au:'w_cake'},{s:'b.a.th|r.oo.m',au:'bk_bathroom'}],ask:'🤔 先 找 什麼？',cap:'看到 新 字：① 找 🔴 母音 ② 一個 一個 唸 ③ 合 起來',ca:[{t:'① 找 🔴 母音',s:'sh.i.p',v:1},{t:'② 一個 一個 唸',s:'sh.i.p',p:1},{t:'③ 合 起來 ＝ ship',s:'sh.i.p',a:'sh-ih-p'}],cap0:'👀 找 <span class="vb">母音</span> ➜ 一個 一個 唸 ➜ 合 起來',qz:'mix'},
 {k:'howR',t:'👀 看字 讀音：長 一點 的 字',g:'① 找 母音 ② 一個 一個 唸 ③ 合 起來',w:'沒 學 過 的 字 也 會 唸',how:'R',rows:[{s:'d.u.ck',au:'d-uh-k'},{s:'sh.i.ft',au:'sh-ih-ft'}],ask:'🤔 先 找 什麼？',cap:'看 字 ➜ 🔴 找 母音 ➜ 一個 一個 唸 ➜ 🔗 合 起來',ca:[{t:'① 🔴 找 母音',s:'d.u.ck',v:1},{t:'② 一個 一個 唸',s:'d.u.ck',p:1},{t:'③ 🔗 合 起來 ＝ duck',s:'d.u.ck',a:'d-uh-k'}],cap0:'① 🔴 ➜ ② 🔊🔊🔊 ➜ ③ 🔗',qz:'readA'},
 {k:'howS',t:'✏️ 聽音 拼字：長 一點 的 字',g:'① 數 聲音 ② 一個 聲音 一個 字母 ③ 唸 一次 檢查',w:'聽到 就 會 拼',how:'S',rows:[{s:'fr.o.g',au:'fr-aa-g'},{s:'b.e.nch',au:'b-eh-nch'}],ask:'🤔 先 做 什麼？',cap:'聽 ➜ 數 聲音 ➜ 一個 聲音 寫 一個 字母 ➜ 再 唸 一次 檢查',ca:[{t:'① 👂 聽：frog',a:'fr-aa-g'},{t:'② 數 聲音：4 個',d:4},{t:'③ 一個 聲音 一個 字母',s:'fr.o.g',p:1},{t:'④ 🔊 再 唸 一次 檢查',s:'fr.o.g',a:'fr-aa-g'}],cap0:'① ●●● ➜ ② ✏️ ➜ ③ 🔊 ✅',qz:'spellB'}];
/* ⑧ baby 的〔➕ 再 看 5 個〕：何嘉仁 Super Fun 課本 的 兩 音節 字（老師 的 簡報 裡 有 的；字母 少、結構 簡單），音節 照「一個 子音 聲 往 後 搬」*/
const MORE2=[['s.e|v.e=ah.n','w_c57_seven','seven','七'],['l.e|tt.er','w_c57_letter','letter','信'],['d.o.c|t.or=er1','w_c57_doctor','doctor','醫生'],['n.u.m|b.er','w_c57_number','number','數字'],['s.i.s|t.er','w_c57_sister','sister','姊妹'],['f.ar|m.er','w_c57_farmer','farmer','農夫']].map(x=>({s:x[0],au:x[1],w:x[2],zh:x[3]}));
/* ══ 老師 4-11：每 個 課本 單字 字卡〔🎬 秒懂 動畫〕＝ 從 CVC 一步 一步 變成 課本 字（map.html#chain=<字>，用 同 一套 動畫）══ */
/* 2026-11-18 第五十九次 老師 4-(3)：🔒 最高 原則 ＝ 降低 認知 負荷：第一步 一定 是 學生 最 熟悉 的 舊 經驗（自己 會 拼 的 那 一塊：字首＋母音、第一個 音節），
 * 每 一步 只 多 一個 新 的 東西，嚴禁 多 一個 不 認識 的 字（以前 tub ➜ turtle、bat ➜ cat、lit ➜ living 都 多 了 一個 不 認識 的 字，而且 tub 的 聲音 像 tom）。
 * 一個 音節：字首＋母音（cv_）➜ 整個 字；兩個 音節：第一個 音節 ➜ 第二個 音節 ➜ 整個 字；live ➜ living、dine ➜ dining（老師 指定：聲音＋中文＋圖 比較）*/
const CHAIN={cat:[['c.a','cv_cat_0'],['c.a.t','bk_cat']],dog:[['d.o','cv_dog_0'],['d.o.g','bk_dog']],sad:[['s.a','cv_sad_0'],['s.a.d','bk_sad']],not:[['n.o','cv_not_0'],['n.o.t','bk_not']],
  yes:[['y.e','cv_yes_0'],['y.e.s','bk_yes']],fish:[['f.i','cv_fish_0'],['f.i.sh','bk_fish']],thin:[['th.i','cv_thin_0'],['th.i.n','bk_thin']],he:[['h','s_h'],['h.e!=ee','bk_he']],
  she:[['sh','s_sh'],['sh.e!=ee','bk_she']],no:[['n','s_n'],['n.o!=oa','bk_no']],room:[['r.oo','cv_room_0'],['r.oo.m','bk_room']],
  bedroom:[['b.e.d','b-eh-d',0,'🛏️ bed ＝ 床'],['r.oo.m','bk_room',0,'🏠 room ＝ 房間'],['b.e.d|r.oo.m','bk_bedroom',0,'bedroom ＝ 臥室']],bathroom:[['b.a.th','b-ae-th',0,'🛀 bath ＝ 洗澡'],['r.oo.m','bk_room',0,'🏠 room ＝ 房間'],['b.a.th|r.oo.m','bk_bathroom',0,'bathroom ＝ 浴室']],
  rabbit:[['r.a','sy_rabbit_0'],['bb.i.t','sy_rabbit_1'],['r.a|bb.i.t','bk_rabbit']],kitchen:[['k.i','sy_kitchen_0'],['tch.e=ah.n','sy_kitchen_1'],['k.i|tch.e=ah.n','bk_kitchen']],
  dining:[['d.i!=ii.n.e~','w_c59_dine',0,'🍽️ dine ＝ 用餐'],['d.i!=ii|n.i.ng','bk_dining',0,'🍽️ dining ＝ 用餐（的）：e 拿掉 ＋ ing']],living:[['l.i.v.e~','w_c59_live',0,'🏡 live ＝ 住、生活'],['l.i.v|i.ng','bk_living',0,'🛋️ living ＝ 生活（的）：e 拿掉 ＋ ing']],
  where:[['wh','s_w'],['wh.e=eh.r=rr.e~','bk_where']],bird:[['b.ir','cv_bird_0'],['b.ir.d','bk_bird']],turtle:[['t.ur','sy_turtle_0'],['t.le=el','sy_turtle_1'],['t.ur|t.le=el','bk_turtle']],
  strong:[['s.o=ao.ng','w_song'],['st.o=ao.ng','w_stong',1],['str.o=ao.ng','bk_strong']],short:[['sh.o.t','sh-aa-t'],['sh.or.t','bk_short']],tall:[['t','s_t'],['t.a=ao.ll','bk_tall']],
  tired:[['t.i!=ii','cv_tired_0'],['t.i!=ii.r=rr.e~.d','bk_tired']],angry:[['a.n','sy_angry_0'],['gr.y','sy_angry_1'],['a.n|gr.y','bk_angry']],happy:[['h.a','sy_happy_0'],['pp.y','sy_happy_1'],['h.a|pp.y','bk_happy']]};
CHAIN['dining room']=CHAIN.dining;CHAIN['living room']=CHAIN.living;
function chainScene(w){const C=CHAIN[w];if(!C)return null;return {ltr:/^living/.test(w)?1:0,k:'chain',t:'🎬 從 CVC 到 課本：'+w,g:C.map(r=>r[0].replace(/[.|]|!?=[a-z0-9]+|~/g,'')).join(' ➜ ')+'：每 次 只 加 一點點',w:'從 你 已經 會 的 那 一塊 開始，一步 一步 變成 課本 的 字',
  rows:C.map(r=>({s:r[0],au:r[1],fake:r[2],nt:r[3]})),ask:'🤔 從 上 一行 到 下 一行，改變 了 哪裡？',cap:'<b>'+w+'</b>：從 '+C[0][0].replace(/[.|]|!?=[a-z0-9]+|~/g,'')+' 一步 一步 變 過來 ➜ 每 一步 只 改 一個 地方',qz:'spell'}}
let ALG=null,ANI=LS.g('ani',1);
let SCI=LS.g('sci3',0),STR=false,SMODE=LS.g('smode','step'),THINK=false;if(SCI>=SC.length)SCI=0;
const qs=(r,s)=>r.querySelector(s),qsa=(r,s)=>[].slice.call(r.querySelectorAll(s));
function scList(){$('#scList').innerHTML=SC.map((s,i)=>'<button data-sc="'+i+'" class="'+(i===SCI?'on':'')+(LS.g('scs3',[]).indexOf(i)>=0?' seen':'')+'">'+(i+1)+'</button>').join('')}
function idxDraw(){const sn=LS.g('scs3',[]);$('#scIdx').innerHTML='<div class="idxp"><h2 class="st">📑 目次（點 一下 ＝ 馬上 到 那 一段）</h2><div class="idxg">'+SC.map((s,i)=>'<button data-sc="'+i+'" class="'+(i===SCI?'on':'')+'"><b>'+(i+1)+'</b> '+s.t+(sn.indexOf(i)>=0?' <i>✔</i>':'')+'</button>').join('')+'</div><div class="ctl"><button class="btn" id="idxX">✖ 關 起來</button></div></div>';$('#scIdx').hidden=false;$('#idxX').onclick=()=>$('#scIdx').hidden=true}
/* 開始 卡：🎯／💪＋三種 播法 */
function scCard(i){if(!ANI&&!FAST){SCI=i;LS.s('sci3',i);scList();$('#scIdx').hidden=true;scPlay(i,'all');return}SCI=i;LS.s('sci3',i);TOK++;scList();const S=SC[i];$('#scIdx').hidden=true;
  $('#stage').className='pnl';$('#stage').innerHTML='<div class="scard"><div class="sno">第 '+(i+1)+' ／ '+SC.length+' 段</div><h2 class="st">'+S.t+'</h2><div class="goal">🎯 學 什麼：<b>'+S.g+'</b></div><div class="why">💪 對 英文 有 什麼 幫助：'+S.w+'</div>'+
    (S.how?'<div class="modeb '+S.how+'">'+(S.how==='R'?'<b>👀 看到 字</b><i>➜</i><b>🔊 唸 出來</b><span>看字 讀音</span>':'<b>👂 聽到 聲音</b><i>➜</i><b>✏️ 寫 出 字母</b><span>聽音 拼字</span>')+'</div>':'')+'<div class="ctl big"><button class="btn go" data-pm="step">▶ 逐次 播放</button><button class="btn" data-pm="all">👀 全部 展示</button><button class="btn gold" data-pm="think">🤔 引導 思考</button></div></div>'}
async function scPlay(i,mode,root){root=root||$('#stage');const inGame=root!==$('#stage');if(!inGame){SCI=i;LS.s('sci3',i);scList()}const me=++TOK,S=SC[i];mode=mode||SMODE;THINK=mode==='think';const ALL=mode==='all';PAUSED=false;if($('#aPause'))$('#aPause').textContent='⏸️ 暫停';
  root.className='pnl n'+Math.max(S.rows.length,S.how?3:0);root.innerHTML='<div class="shead"><h2 class="st">'+S.t+'</h2><div class="goal sm">🎯 '+S.g+'</div></div><div class="rows">'+S.rows.map((r,ri)=>'<div class="rw'+(ri?'':' r0')+'"><div class="wrow'+(STR?' stress':'')+(r.au?'':' noau')+(r.x?' wx':'')+'" data-r="'+ri+'">'+wordHTML(r.s,{lab:ri===0,hide:!ALL,hideT:!ALL,dots:ALL,st:STR?r.st:null,shade:r.sh?shadeV(r.s,r.sh):null})+(r.x?'<span class="bigx" aria-label="錯">✖</span>':'')+'</div><div class="rsd">'+(r.x?'<span class="mtag w xw">❌ '+r.lab+'</span>':r.fake?'<span class="mtag p">🔮 練習 用 的 假字</span>':r.lab?'<span class="mtag w">'+r.lab+'</span>':'')+(r.nt?'<span class="mtag nt" style="--c:'+(r.sh||'#F5A300')+'">'+r.nt+'</span>':'')+(r.au&&!r.x&&!r.s.startsWith('[')?'<button class="wsay blb" data-bsp="'+r.s+'" data-bau="'+r.au+'">🔤 拼讀</button>':'')+(r.au&&/^[a-z.!=~|]+$/i.test(r.s.replace(/[0-9]/g,''))&&r.s.replace(/[.|]|!?=[a-z0-9]+|~|!/g,'').length>2?'<button class="wsay" data-wsay="'+r.au+'">🔊 '+r.s.replace(/[.|]|!?=[a-z0-9]+|~|!/g,'')+'</button>':'')+'<div class="sum" data-sum="'+ri+'"></div></div></div>').join('')+'</div>'+
    (S.more?'<div class="ctl"><button class="btn gold" id="more2">➕ 再 看 '+MORE2.length+' 個 課本 的 兩 音節 字</button></div><div id="more2w"></div>':'')+'<div class="think" hidden></div><div class="cap"></div>'+(inGame?'':'<div class="ctl qzrow" hidden><button class="btn" data-prev="1">⬅ 上一段</button><button class="btn gold" data-qz="'+i+'">📝 隨堂 測驗（3 題）</button><button class="btn" data-next="1">下一段 ▶</button>'+(typeof STGM!=='undefined'&&stgOfSeg(i)>=0&&i===STGM[stgOfSeg(i)][STGM[stgOfSeg(i)].length-1]?'<button class="btn go stgb" data-stg="m'+stgOfSeg(i)+'">⚔️ 第 '+(stgOfSeg(i)+1)+' 關 試煉</button>':S.k==='chain'?'<button class="btn go stgb" data-stg="b'+Math.max(0,STB.findIndex(W=>W.some(w=>S.t.indexOf('：'+w)>0)))+'">⚔️ 課本 單字 試煉</button>':'')+'</div>');
  alignRows(root,S.al||'col');ALG=[root,S.al||'col'];if(S.ltr)setTimeout(()=>alignLtr(root),0);const cap=qs(root,'.cap'),rowsOf=()=>S.rows;if(S.cv)return cvPlay(i,mode,root,me,inGame);if(S.how)return howPlay(i,mode,root,me,inGame);if(S.more)qs(root,'#more2').onclick=()=>more2(root);
  const sum=(ri,r)=>{if(r.x)return;const C=countOf(r.s);qs(root,'[data-sum="'+ri+'"]').innerHTML=patTxt(r.s)+'：'+C.b+' 個 方框、<b>'+C.n+' 個 聲音</b>'+(C.v>1?'、'+C.v+' 個 紅框 ＝ '+C.v+' 個 音節':'')};
  if(ALL){rowsOf().forEach((r,ri)=>{sum(ri,r);if(r.dim)qs(root,'.wrow[data-r="'+ri+'"]').style.opacity=.6});capShow(cap,S);scDone(i,root,inGame);return}
  for(let ri=0;ri<S.rows.length;ri++){if(me!==TOK)return;const r=S.rows[ri],row=qs(root,'.wrow[data-r="'+ri+'"]'),bx=qsa(row,'.bx'),all=[];parse(r.s).forEach(B=>B.forEach(b=>all.push(b)));
    /* (1) 方框＋字母 一個 一個 出來（引導 思考：先 不 出 聲，學生 自己 先 唸）*/
    if(THINK){bx.forEach(e=>e.classList.remove('hid'));if(!await think(root,ri===0?'🤔 先 自己 唸唸 看：每 一個 字母 是 什麼 聲音？':'🤔 跟 上面 比，哪裡 不一樣？先 自己 唸 唸 看',me))return}
    for(let bi=0;bi<bx.length;bi++){if(me!==TOK)return;const el=bx[bi],b=all[bi];el.classList.remove('hid');const cks=qsa(el,'.ck');
      for(let ci=0;ci<b.ch.length;ci++){const c=b.ch[ci],a=c.au||auOf(c.t,b.coda);if(!a||c.sil){await wait(300);continue}cks[ci].classList.add('on');await sayW(a,me);cks[ci].classList.remove('on')}}
    /* (2) 合 起來 唸（〔1️⃣ 單字 唸 一次〕＝ 這裡 不 唸，最後 才 唸）*/
    if(r.au&&!ONE){if(THINK&&!await think(root,'🤔 合 起來 怎麼 唸？',me))return;await sayWhole(row,r.au,me)}
    /* (3) 字母 正下方 一個 一個 出現 音標＋唸，再 合 起來 */
    if(!r.s.startsWith('[')){for(let bi=0;bi<bx.length;bi++){const b=all[bi];const cks=qsa(bx[bi],'.ck');for(let ci=0;ci<b.ch.length;ci++){if(me!==TOK)return;const c=b.ch[ci],tl=qs(cks[ci],'.tl[data-t]');if(tl){tl.classList.remove('hide');tl.classList.add('on')}const a=auOf(c.t,b.coda);if(a&&!c.sil)await sayW(a,me);else await wait(300);if(tl)tl.classList.remove('on')}}
      if(r.au){await sayWhole(row,r.au,me)}}
    else if(r.au&&ONE){await sayWhole(row,r.au,me)}
    /* (4) 數 聲音：每 個 字母 下面 的 點 一個 一個 亮 */
    if(THINK&&!await think(root,'🤔 數 一 數：有 幾 個 聲音？（不 發音 的 灰色 字母 不 算）',me))return;
    for(const d of row.querySelectorAll('.dt i')){if(me!==TOK)return;d.classList.add('on');await wait(260)}
    sum(ri,r);if(r.dim)row.style.opacity=.6;await wait(400)}
  if(me!==TOK)return;if(THINK&&S.ask&&!await think(root,S.ask,me))return;capShow(cap,S);scDone(i,root,inGame)}
/* 2026-11-18 第五十九次 老師 2-5、4-(4)(5)：唸 整個 字 ＝ 金色 框 框 起來＋每 個 字母 同時 稍微 放大、發光 */
async function sayWhole(el,au,me){const w=el.classList&&el.classList.contains('wrow')?el:(el.querySelector('.wrow')||el),bx=qsa(w,'.bx');w.classList.add('gold');bx.forEach(e=>e.classList.add('say'));await sayW(au,me);bx.forEach(e=>e.classList.remove('say'));w.classList.remove('gold')}
/* 第五十九次 老師 2-(2)：〔🔤 拼讀〕＝ 每 個 字母（聲音）一個 一個 唸＋發亮 ➜ 合 起來 唸 整個 字 */
async function blendRow(row,spec,au,btn){if(!row)return;const me=++TOK,S=parse(spec),cks=qsa(row,'.ck');qsa(row,'.bx').forEach(e=>e.classList.remove('hid'));qsa(row,'.tl').forEach(t=>t.classList.remove('hide'));qsa(row,'.dt i').forEach(d=>d.classList.add('on'));if(btn)btn.classList.add('on');let k=0;
  for(const B of S)for(const b of B)for(const c of b.ch){const el=cks[k++];const a=c.au||auOf(c.t,b.coda);if(!a||c.sil||b.type==='g'||!el)continue;if(me!==TOK)return;el.classList.add('on');await sayW(a,me);el.classList.remove('on')}
  if(me===TOK)await sayWhole(row,au,me);if(btn)btn.classList.remove('on')}
/* 第五十九次 老師 2-(4)：燈泡 ＝ 一句 白話＋〔🎬 秒懂 動畫〕（ca：一幕 一句 話＋字＋聲音；p ＝ 一個 一個 唸、a ＝ 整個 字、d ＝ 黃點、v ＝ 母音 跳、x ＝ 錯 的）*/
let CAPT=0;
async function capAni(S){if(!S||!S.ca)return;const me=++TOK,my=++CAPT;let o=$('#capAni');if(!o){o=H('div','');o.id='capAni';document.body.appendChild(o)}o.hidden=false;PAUSED=false;
  o.innerHTML='<div class="cai"><div class="cah">💡 '+S.cap+'</div><div class="caf" id="caf"></div><div class="cad">'+S.ca.map(()=>'<i></i>').join('')+'</div><div class="ctl"><button class="btn" id="caP">⏸️ 暫停</button><button class="btn" id="caR">🔁 再 看 一次</button><button class="btn go" id="caX">✔ 懂 了</button></div></div>';
  qs(o,'#caX').onclick=()=>{TOK++;CAPT++;o.hidden=true;PAUSED=false};qs(o,'#caR').onclick=()=>capAni(S);qs(o,'#caP').onclick=e=>{PAUSED=!PAUSED;e.target.textContent=PAUSED?'▶️ 繼續':'⏸️ 暫停';if(PAUSED)AU.pause()};
  for(let k=0;k<S.ca.length;k++){if(me!==TOK||my!==CAPT)return;const f=S.ca[k],box=qs(o,'#caf');qsa(o,'.cad i').forEach((d,j)=>d.classList.toggle('on',j<=k));
    box.innerHTML='<div class="cat">'+f.t+'</div>'+(f.s?'<div class="wrow'+(f.x?' wx':'')+'">'+wordHTML(f.s,{lab:f.s.indexOf('.')>0&&!f.s.startsWith('['),dots:f.d||f.p||f.a?1:0})+(f.x?'<span class="bigx">✖</span>':'')+'</div>':'')+(f.d&&!f.s?'<div class="hdots big">'+Array.from({length:f.d},()=>'<i class="on"></i>').join('')+'</div>':'');
    const row=qs(box,'.wrow');await wait(500);
    if(f.v&&row){qsa(row,'.bx.v,.bx.n').forEach(e=>e.classList.add('vpulse'));await wait(1400)}
    if(f.p&&row){const P=parse(f.s),cks=qsa(row,'.ck');let i=0;for(const B of P)for(const b of B)for(const c of b.ch){const el=cks[i++];const a=c.au||auOf(c.t,b.coda);if(!a||c.sil||b.type==='g')continue;el.classList.add('on');await sayW(a,me);el.classList.remove('on')}}
    if(f.a){if(row)await sayWhole(row,f.a,me);else await sayW(f.a,me)}
    await wait(f.a||f.p?900:1700)}
  if(me===TOK&&my===CAPT)qs(o,'#caX').classList.add('pulse')}
/* 第五十八次 老師 (1)：結論 ＝ 一行 秒懂 重點 卡（跳 出來＋發光），不 寫 長 句子；總 整理 多「為什麼 是 這 3 個 字」*/
function capShow(cap,S){const i=SC.indexOf(S);cap.innerHTML='<div class="kcap">💡 '+S.cap+(S.ca&&i>=0?' <button class="capb" data-capani="'+i+'">🎬 秒懂 動畫</button>':'')+'</div>'+(S.why?'<div class="kwhy">'+S.why+'</div>':'')}
/* 第五十八次 老師 (5)-28：👀 看字 讀音、🎧 聽字 拼音「怎麼 做」＝ 三 步 一步 一步 演（上面 步驟 條 亮 到 哪 一步）*/
async function howPlay(i,mode,root,me,inGame){const S=SC[i],R1=S.how==='R',ST=R1?['👀 ① 找 母音（紅）','👄 ② 一個 一個 唸','🔗 ③ 合 起來']:['👂 ① 聽 ➜ 數 聲音','✏️ ② 一個 聲音 一個 字母','🔊 ③ 再 唸 一次 檢查'],ALL=mode==='all';
  root.querySelector('.shead').appendChild(H('div','modeb '+(R1?'R':'S'),R1?'<b>👀 看到 字</b><i>➜</i><b>🔊 唸 出來</b><span>看字 讀音</span>':'<b>👂 聽到 聲音</b><i>➜</i><b>✏️ 寫 出 字母</b><span>聽音 拼字</span>'));const strip=H('div','hsteps',ST.map((t,k)=>'<span data-hs="'+k+'">'+t+'</span>').join(''));root.querySelector('.shead').appendChild(strip);const cap=qs(root,'.cap');
  const on=k=>qsa(strip,'span').forEach((e,j)=>{e.classList.toggle('on',j===k);if(j<k)e.classList.add('ok')});
  for(let ri=0;ri<S.rows.length;ri++){const r=S.rows[ri],row=qs(root,'.wrow[data-r="'+ri+'"]'),bx=qsa(row,'.bx'),all=[];parse(r.s).forEach(B=>B.forEach(b=>all.push(b)));
    const sum=()=>{const C=countOf(r.s);qs(root,'[data-sum="'+ri+'"]').innerHTML=patTxt(r.s)+'：<b>'+C.n+' 個 聲音</b>'};
    if(ALL){bx.forEach(e=>e.classList.remove('hid'));qsa(row,'.tl').forEach(t=>t.classList.remove('hide'));qsa(row,'.dt i').forEach(d=>d.classList.add('on'));sum();continue}
    if(me!==TOK)return;
    if(R1){bx.forEach(e=>e.classList.remove('hid'));on(0);if(THINK&&!await think(root,'🤔 母音（紅框）在 哪裡？',me))return;
      bx.forEach((e,k)=>{if(all[k].type==='v'||all[k].type==='n')e.classList.add('vpulse')});await wait(1400);bx.forEach(e=>e.classList.remove('vpulse'));
      on(1);if(THINK&&!await think(root,'🤔 一個 方框 一個 方框，自己 先 唸 唸 看',me))return;
      for(let bi=0;bi<bx.length;bi++){const b=all[bi],cks=qsa(bx[bi],'.ck');for(let ci=0;ci<b.ch.length;ci++){if(me!==TOK)return;const c=b.ch[ci],tl=qs(cks[ci],'.tl[data-t]');if(tl)tl.classList.remove('hide');const a=auOf(c.t,b.coda);if(!a||c.sil){await wait(250);continue}cks[ci].classList.add('on');await sayW(a,me);cks[ci].classList.remove('on')}}
      on(2);if(THINK&&!await think(root,'🤔 合 起來 怎麼 唸？',me))return;await sayWhole(row,r.au,me);qsa(row,'.dt i').forEach(d=>d.classList.add('on'))}
    else{on(0);await sayW(r.au,me);if(THINK&&!await think(root,'🤔 聽 到 幾 個 聲音？',me))return;const C=countOf(r.s),dl=H('div','hdots',Array.from({length:C.n},()=>'<i></i>').join(''));row.parentNode.querySelector('.rsd').prepend(dl);
      for(const d of qsa(dl,'i')){if(me!==TOK)return;d.classList.add('on');await wait(420)}
      on(1);if(THINK&&!await think(root,'🤔 每 一個 聲音 寫 哪 一個 字母？',me))return;
      for(let bi=0;bi<bx.length;bi++){const b=all[bi],cks=qsa(bx[bi],'.ck');bx[bi].classList.remove('hid');for(let ci=0;ci<b.ch.length;ci++){if(me!==TOK)return;const c=b.ch[ci],tl=qs(cks[ci],'.tl[data-t]');if(tl)tl.classList.remove('hide');const a=auOf(c.t,b.coda);if(!a||c.sil){await wait(250);continue}cks[ci].classList.add('on');qsa(cks[ci],'.dt i').forEach(d=>d.classList.add('on'));await sayW(a,me);cks[ci].classList.remove('on')}}
      on(2);await sayWhole(row,r.au,me)}
    sum();await wait(500)}
  if(me!==TOK)return;qsa(strip,'span').forEach(e=>{e.classList.remove('on');e.classList.add('ok')});if(THINK&&S.ask&&!await think(root,S.ask,me))return;capShow(cap,S);scDone(i,root,inGame)}
/* 2026-11-18 第五十九次 老師 2-(4)：🔴🔵 子音 和 母音 是 什麼？為什麼 要 知道？哪些 字母 是 子音、母音？＝ 4 幕（一幕 一件 事）*/
const CVV='aeiou';
async function cvPlay(i,mode,root,me,inGame){const S=SC[i],ALL=mode==='all';const sec=root.querySelector('.rows');
  const P=[['cvp1','<div class="cvh"><span class="vb">🔴 母音</span> ＝ 嘴巴 <b>打開</b>，聲音 一直 出來、可以 拉 很 長</div><div class="cvr"><div class="mouth open">😮</div><div class="wrow">'+wordHTML('a',{})+'</div><div class="cvlong" id="cvl1">ㄚ～～～～</div></div>'],
   ['cvp2','<div class="cvh"><span class="cb">🔵 子音</span> ＝ 嘴唇、舌頭、牙齒 先 <b>擋 一下</b></div><div class="cvr">'+[['b','👄 嘴唇 擋','s_b'],['t','👅 舌頭 擋','s_t'],['s','🦷 牙齒 擋','s_s']].map(x=>'<div class="cvx" data-cva="'+x[2]+'"><div class="wrow">'+wordHTML(x[0],{})+'</div><span>'+x[1]+'</span></div>').join('')+'</div>'],
   ['cvp3','<div class="cvh">26 個 字母：<span class="vb">5 個 母音</span>　<span class="cb">21 個 子音</span></div><div class="abc">'+'abcdefghijklmnopqrstuvwxyz'.split('').map(c=>'<b class="'+(CVV.indexOf(c)>=0?'v':'c')+'" data-cl="'+c+'">'+c+'</b>').join('')+'</div><div class="cvn">💡 y 在 字 的 最後（baby、my）也 會 當 母音</div>'],
   ['cvp4','<div class="cvh">💪 有 什麼 幫助？<b>每 一個 英文 字 都 有 🔴 母音</b> ➜ 先 找 紅色，就 知道 怎麼 分、怎麼 唸</div><div class="cvr"><div class="wrow" id="cvcat">'+wordHTML('c.a.t',{lab:1,dots:1})+'</div><div class="cvz">ㄅㄚ 也 一樣：<div class="wrow">'+wordHTML('[ㄅ]c.[ㄚ]v',{lab:1})+'</div></div></div>']];
  sec.innerHTML=P.map((p,k)=>'<div class="cvp '+p[0]+(ALL?'':' hid2')+'" data-cvp="'+k+'">'+p[1]+'</div>').join('');
  qsa(sec,'[data-cva]').forEach(e=>e.onclick=()=>say(e.dataset.cva));qsa(sec,'[data-cl]').forEach(e=>e.onclick=()=>{e.classList.add('on');say('s_'+({c:'k',q:'kw',x:'x',y:'y'}[e.dataset.cl]||(CVV.indexOf(e.dataset.cl)>=0?{a:'ae',e:'eh',i:'ih',o:'aa',u:'uh'}[e.dataset.cl]:e.dataset.cl))).then(()=>e.classList.remove('on'))});
  const cap=qs(root,'.cap');if(ALL){const l=qs(sec,'#cvl1');if(l)l.classList.add('go');capShow(cap,S);scDone(i,root,inGame);return}
  const show=k=>{const e=qs(sec,'[data-cvp="'+k+'"]');e.classList.remove('hid2');e.classList.add('in');try{e.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(x){}return e};
  let e=show(0);if(THINK&&!await think(root,'🤔 唸 ㄚ 的 時候，嘴巴 是 開 的 還是 關 的？',me))return;await sayW('zy_a',me);qs(e,'#cvl1').classList.add('go');await sayW('s_ae',me);await wait(700);
  e=show(1);if(THINK&&!await think(root,'🤔 唸 b 的 時候，什麼 先 擋住？',me))return;for(const x of qsa(e,'.cvx')){if(me!==TOK)return;x.classList.add('on');await sayW(x.dataset.cva,me);x.classList.remove('on')}
  e=show(2);if(THINK&&!await think(root,'🤔 26 個 字母 裡，哪 5 個 是 母音？',me))return;for(const c of 'aeiou'){if(me!==TOK)return;const b=qs(e,'[data-cl="'+c+'"]');b.classList.add('on');await sayW('s_'+{a:'ae',e:'eh',i:'ih',o:'aa',u:'uh'}[c],me);b.classList.remove('on');b.classList.add('lit')}
  e=show(3);const row=qs(e,'#cvcat');if(THINK&&!await think(root,S.ask,me))return;qsa(row,'.bx.v').forEach(x=>x.classList.add('vpulse'));await wait(1200);await blendRow(row,'c.a.t','k-ae-t');
  if(me!==TOK&&!FAST)return;capShow(cap,S);scDone(i,root,inGame)}
function scDone(i,root,inGame){if(inGame)return;const sn=LS.g('scs3',[]);if(sn.indexOf(i)<0){sn.push(i);LS.s('scs3',sn)}scList();const q=qs(root,'.qzrow');if(q)q.hidden=false}
/* 🤔 引導 思考：問題 出來 ➜ 停 住 ➜ 老師／學生 點〔👉 公布 答案〕才 往 下 */
function think(root,q,me){return new Promise(res=>{if(FAST&&!window.__PHTHINK){res(me===TOK);return}const t=qs(root,'.think');t.hidden=false;t.innerHTML='<div class="tq">'+q+'</div><button class="btn gold" id="thGo">👉 公布 答案</button>';
  const go=()=>{t.hidden=true;res(me===TOK)};qs(t,'#thGo').onclick=go;if(window.__PHTHINK)setTimeout(go,30)})}
async function more2(root){const w=qs(root,'#more2w');w.innerHTML='<div class="rows">'+MORE2.map((r,ri)=>'<div class="rw"><div class="wrow" data-m="'+ri+'">'+wordHTML(r.s,{lab:1,dots:1})+'<span class="cap mz2">'+r.w+'＝'+r.zh+'　🔊</span><button class="wsay blb" data-bsp="'+r.s+'" data-bau="'+r.au+'">🔤 拼讀</button></div><div class="sum">'+patTxt(r.s)+'：'+countOf(r.s).n+' 個 聲音、2 個 音節</div></div>').join('')+'</div>';
  const me=++TOK;for(let ri=0;ri<MORE2.length;ri++){const row=qs(w,'[data-m="'+ri+'"]');row.querySelectorAll('.syl').forEach(s=>s.classList.add('hot'));await sayW(MORE2[ri].au,me);row.querySelectorAll('.syl').forEach(s=>s.classList.remove('hot'));if(me!==TOK)return}}
/* ══ 📝 隨堂 測驗：每 段 3 題（每 次 不同）；錯題 回饋 ＝ 遊戲 的 綠底 答錯頁（noPage／okPage）══ */
const ZYQ=[['ㄅ','b'],['ㄆ','p'],['ㄇ','m'],['ㄈ','f'],['ㄉ','d'],['ㄊ','t'],['ㄋ','n'],['ㄌ','l'],['ㄍ','g'],['ㄎ','k'],['ㄏ','h'],['ㄙ','s']];
const QZK={zy:'聽 ➜ 這個 注音 跟 哪 一個 英文 字母 同 一個 聲音？',spell:'🔊 聽 ➜ 選 對 的 拼法',count:'🔊 聽 ➜ 這個 字 有 幾 個 聲音？',part:'🔊 聽 ➜ 選 對 的 字（只 差 一個 方框）',dig:'🔊 聽 ➜ 哪 兩個 字母 是 一個 聲音？',on:'🔊 聽 ➜ 字首 是 哪 一組？',co:'🔊 聽 ➜ 字尾 是 哪 一組？',magic:'🔊 聽 ➜ 有 沒有 magic e？選 對 的 字',team:'🔊 聽 ➜ 選 對 的 母音 拼法',syl:'🔊 聽 ➜ 有 幾 個 音節？',many:'🔊 聽 ➜ 這個 a 唸 什麼？',mix:''};
/* 第五十八次 老師 (5)-6～13：兩個 字母 一個 聲音 的 隨堂 測驗 太 難 ➜ 只 考 剛 學 的：聽 一個 聲音 ➜ 選 哪 兩個 字母（錯 的 ＝ 前面 學 過 的、或 拆 開 的 單 字母）*/
const DIG1=[['d_ch','ch','s_ch'],['d_sh','sh','s_sh'],['d_th','th','s_th'],['d_dh','th','s_dh'],['d_ph','ph','s_f'],['d_ng','ng','s_ng'],['d_wh','wh','s_w'],['d_ck','ck','s_k']];
let QZI=0;
function qzMake(kind){const P=f=>QW.filter(f),sp=x=>specOf(x),one=x=>({spec:sp(x),au:x.c,w:x.w,x});
  if(kind==='dig1'){const k=SC[QZI]&&SC[QZI].k,di=Math.max(0,DIG1.findIndex(d=>d[0]===k)),D=DIG1[di];
    if(D[0]==='d_dh'){const v=Math.random()<.5,TW=v?[['dh-ih-s','this','th=dh.i.s'],['dh-ae-t','that','th=dh.a.t'],['dh-eh-n','then','th=dh.e.n'],['dh-eh-m','them','th=dh.e.m'],['s_dh','th','th=dh']]:[['bk_thin','thin','th.i.n'],['m-ae-th','math','m.a.th'],['p-ae-th','path','p.a.th'],['th-ih-k','thick','th.i.ck'],['s_th','th','th']],w=R(TW);
      return {k:kind,q:'🔊 聽 ➜ 這個 th 喉嚨 有 沒有 震動？',au:w[0],key:w[0],O:['💨 不 震動','📳 會 震動'],ans:v?'📳 會 震動':'💨 不 震動',info:{spec:w[2],au:w[0],w:w[1],tip:v?'<b>'+w[1]+'</b> 的 th：喉嚨 <b>會 震動</b> 📳':'<b>'+w[1]+'</b> 的 th：<b>不 震動</b>，只 吹 氣 💨'}}}
    const lr=DIG1.slice(0,di+1).filter(d=>d[1]!=='th'||d[0]==='d_th'),T=R(lr.slice(-3)),oth=SH(lr.filter(d=>d[1]!==T[1]).map(d=>d[1])).slice(0,2);let O=[T[1]].concat(oth);T[1].split('').forEach(c=>{if(O.length<3&&O.indexOf(c)<0)O.push(c)});
    /* 兩種 問法：① 聽 這個 聲音（單獨）② 聽 一個 有 這個 聲音 的 字（字 從 _qwords 來）*/
    const W=QW.filter(y=>!y.long&&y.n<=4&&(y.on.join('')===T[1]||y.co.join('')===T[1])),x=W.length&&Math.random()<.6?R(W):null;
    if(x)return {k:kind,q:'🔊 聽 這個 字 ➜ 裡面 有 哪 一個？',au:x.c,O:SH(O),ans:T[1],key:x.c,info:Object.assign(one(x),{tip:'<b>'+x.w+'</b> 裡面 有 <b>'+T[1]+'</b>：兩個 字母、<b>一個</b> 聲音'})};
    return {k:kind,q:'🔊 聽 這個 聲音 ➜ 是 哪 一個？',au:T[2],O:SH(O),ans:T[1],key:T[2]+O.join(),info:{spec:T[1],au:T[2],w:T[1],tip:'<b>'+T[1]+'</b> ＝ 兩個 字母、<b>一個</b> 聲音'}}}
  /* 第五十八次 (5)-28：👀 看字 讀音 ＝ 看 字（沒有 音標）➜ 3 個 🔊 選 唸 對 的；🎧 聽字 拼音 ＝ 聽 ➜ 選 對 的 拼法（只 差 一點）*/
  if(kind==='readA'){const x=R(P(y=>!y.long&&y.n>=3&&y.n<=4));let ws=[x].concat(near(x,R(['on','v','co']),3));ws=[...new Map(ws.map(y=>[y.w,y])).values()].slice(0,3);while(ws.length<3){const y=R(P(y=>!y.long&&y.n===x.n));if(ws.every(z=>z.w!==y.w))ws.push(y)}
    return {k:kind,q:'👀 看 這個 字 ➜ 先 自己 唸 ➜ 哪 一個 🔊 唸 對 了？',au:null,show:sp(x),aud:1,O:SH(ws.map(y=>y.w)),ans:x.w,byW:ws,info:Object.assign(one(x),{tip:'① 找 母音 ➜ ② 一個 一個 唸 ➜ ③ 合 起來 ＝ <b>'+x.w+'</b>'})}}
  if(kind==='cv'){const c=R('abdefghiklmnoprstuvz'.split('')),v=CVV.indexOf(c)>=0,a='s_'+(v?{a:'ae',e:'eh',i:'ih',o:'aa',u:'uh'}[c]:c==='c'?'k':c);
    return {k:kind,q:'👀 這個 字母 是 母音 還是 子音？',au:a,key:c,show:c,O:['🔴 母音','🔵 子音'],ans:v?'🔴 母音':'🔵 子音',info:{spec:c,au:a,w:c,tip:v?'<b>'+c+'</b> 是 🔴 母音（a e i o u 這 5 個）':'<b>'+c+'</b> 是 🔵 子音（a e i o u 以外 的 字母）'}}}
  if(kind==='spellB')kind='spell';
  if(kind==='mix')kind=R(['spell','count','part','on','co','team']);
  if(kind==='zy'){const z=R(ZYQ),O=SH([z[1]].concat(SH(ZYQ.filter(y=>y!==z).map(y=>y[1])).slice(0,2)));return {k:kind,q:'聽 ➜ <b class="zyb">'+z[0]+'</b> 跟 哪 一個 英文 字母 同 一個 聲音？',au:'s_'+z[1],O,ans:z[1],info:{spec:z[1],au:'s_'+z[1],w:z[1],tip:'<b>'+z[0]+' ＝ '+z[1]+'</b>（同 一個 聲音）'}}}
  if(kind==='count'){const x=R(P(y=>y.n>=3&&y.n<=5)),O=SH([x.n,x.n-1,x.n+1].map(String));return {k:kind,q:QZK.count,au:x.c,O,ans:String(x.n),info:Object.assign(one(x),{tip:x.w+'：'+x.n+' 個 聲音（一個 聲音 一個 點）'})}}
  if(kind==='syl'){const s=R(SYLW),O=['1','2','3'];return {k:kind,q:QZK.syl,au:AV.has('bk_'+s[0])?'bk_'+s[0]:'w_c55_baby',O,ans:'2',info:{spec:SPECS[s[0]],au:AV.has('bk_'+s[0])?'bk_'+s[0]:'w_c55_baby',w:s[0],tip:s[0]+' ＝ '+s[1].join(' ＋ ')+'：2 個 紅框 ＝ <b>2 個 音節</b>'}}}
  if(kind==='many'){const M=[['bk_cat','c.a.t','ㄚㄝ'],['w_cake','c.a!=ai.k.e~','ㄟ'],['w_ball','b.a=ao.ll','ㄛ'],['w_car','c.ar','ㄚ']],m=R(M);return {k:kind,q:QZK.many,au:m[0],O:SH(M.map(y=>y[2])),ans:m[2],show:m[1],info:{spec:m[1],au:m[0],w:m[1].replace(/[.!=~|]|ai|ao/g,'').replace(/=?/g,''),tip:'這個 a 唸 <b>'+m[2]+'</b>：看 後面 的 字母 決定'}}}
  const F={spell:y=>!y.long&&y.n>=3&&y.n<=4,part:y=>!y.long&&y.n<=4,dig:y=>/^(sh|ch|th|wh)$/.test(y.on.join(''))||/^(sh|ch|th|ng|ck)$/.test(y.co.join('')),on:y=>y.on.join('').length>=2&&!/^(sh|ch|th|wh|qu)$/.test(y.on.join('')),co:y=>y.co.length>=2&&!/^(sh|ch|th|ng|ck|ll|ss|ff|zz)$/.test(y.co.join('')),magic:y=>y.mg,team:y=>y.long&&!y.mg&&y.v!=='oo'}[kind]||(()=>true);
  const x=R(P(F)),info=Object.assign(one(x));
  if(kind==='dig'){const d=(/^(sh|ch|th|wh)$/.test(x.on.join(''))?x.on:x.co).join(''),O=SH([d].concat(SH(['sh','ch','th','ng','ck','wh'].filter(y=>y!==d)).slice(0,2)));info.tip='<b>'+d+'</b> ＝ 兩個 字母、一個 聲音';return {k:kind,q:QZK.dig,au:x.c,O,ans:d,info}}
  if(kind==='on'||kind==='co'){const v=(kind==='on'?x.on:x.co).join(''),all=[...new Set(QW.map(y=>(kind==='on'?y.on:y.co).join('')).filter(z=>z.length>=2))],O=SH([v].concat(SH(all.filter(z=>z!==v&&z[0]===v[0]).concat(SH(all.filter(z=>z!==v&&z[0]!==v[0])))).slice(0,2)));info.tip=(kind==='on'?'字首':'字尾')+' ＝ <b>'+v+'</b>（'+v.length+' 個 聲音，一個 一個 聽）';return {k:kind,q:QZK[kind],au:x.c,O,ans:v,info}}
  let ws=[x].concat(kind==='magic'?QW.filter(y=>y!==x&&y.on.join('')===x.on.join('')&&y.co.join('')===x.co.join('')&&!y.mg&&!y.long).slice(0,1):[],near(x,kind==='team'?'v':R(['on','v','co']),3));ws=[...new Map(ws.map(y=>[y.w,y])).values()].slice(0,3);while(ws.length<3){const y=R(QW);if(ws.every(z=>z.w!==y.w))ws.push(y)}
  info.tip=kind==='magic'?(x.mg?'最後 有 <b>e</b>（不 唸），前面 的 母音 唸 名字':'沒有 magic e，母音 唸 短 的'):'聽 每 一個 聲音：'+patTxt(sp(x));return {k:kind,q:QZK[kind]||QZK.spell,au:x.c,O:SH(ws.map(y=>y.w)),ans:x.w,info,byW:ws}}
async function qzStart(i){QZI=i;qzMono();const S=SC[i];if(typeof G!=='undefined')G=null;TOK++;$('#game').hidden=false;$('#gq').textContent='';$('#gt').textContent='📝 隨堂 測驗：'+S.t;$('#gsc').textContent='';$('#gtm').firstChild.style.transform='scaleX(1)';
  const Q=[],seen=new Set();for(let t=0;t<40&&Q.length<3;t++){const q=qzMake(S.qz);const kq=q&&(q.key||q.au+q.ans);if(q&&!seen.has(kq)){seen.add(kq);Q.push(q)}}
  let ok=0;const wr=[];for(let k=0;k<Q.length;k++){const q=Q[k];$('#gq').textContent='第 '+(k+1)+' ／ '+Q.length+' 題';
    const r=await new Promise(res=>{B2().innerHTML=qzRedBar()+'<div class="gq">'+q.q+'</div>'+(q.show?'<div class="wrow">'+wordHTML(q.show,{dots:0,hideT:1})+'</div>':'')+'<div class="opts'+(q.aud?' aud':'')+'">'+q.O.map((o,k)=>q.aud?'<div class="aop"><button class="op aplay" data-ap="'+k+'">🔊 '+'①②③④'[k]+'</button><button class="op apick" data-o="'+o+'">✅ 選 '+'①②③④'[k]+'</button></div>':'<button class="op'+(/^[㄀-ㄯ一-鿿💨📳🔴🔵]/u.test(o)?' zh':'')+'" data-o="'+o+'">'+(/^[a-z]+$/.test(o)?vRed(o):o)+'</button>').join('')+'</div>';
      if(q.aud)B2().querySelectorAll('[data-ap]').forEach(b=>b.onclick=()=>{const y=q.byW.find(z=>z.w===q.O[+b.dataset.ap]);B2().querySelectorAll('.aplay').forEach(e=>e.classList.remove('on'));b.classList.add('on');say(y.c).then(()=>b.classList.remove('on'))});
      if(q.au){const ear=H('button','ear','🔊 再 聽 一次');ear.onclick=()=>say(q.au);B2().appendChild(ear);say(q.au)}
      B2().querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const y=b.dataset.o===q.ans;b.classList.add(y?'ok':'no');res({y,o:b.dataset.o})});if(window.__PHQZ)setTimeout(()=>{const b=[].find.call(B2().querySelectorAll('[data-o]'),b=>(b.dataset.o===q.ans)===(window.__PHQZ==='ok'));if(b)b.click()},20)});
    if(r.y){ok++;await okPage(q.info)}else{wr.push(q);await noPage(Object.assign({},q.info,{yours:r.o}))}}
  B2().innerHTML='<div class="pnl" style="padding:18px 26px;text-align:center;max-width:900px"><div class="res2">'+ok+' ／ '+Q.length+'</div><div class="cap">'+(ok===Q.length?'🎉 全部 答對！這 一段 你 學會 了':'💪 再 看 一次 動畫，答錯 的 地方 就 會 了')+'</div>'+
    (wr.length?'<div class="cap">📒 答錯 的：</div>'+wr.map(q=>'<div class="wrow" data-wa="'+q.info.au+'">'+wordHTML(q.info.spec,{dots:1})+'</div>').join(''):'')+'<div class="ctl"><button class="btn gold" id="qzAgain">🔁 再 測 一次（題目 不一樣）</button><button class="btn" id="qzBack">🎬 回 動畫</button><button class="btn" id="qzPrev">⬅ 上一段</button><button class="btn go" id="qzNext">下一段 ▶</button></div></div>';
  B2().querySelectorAll('[data-wa]').forEach(r=>r.onclick=()=>say(r.dataset.wa));for(const r of B2().querySelectorAll('[data-wa]')){await say(r.dataset.wa);await wait(300)}
  $('#qzAgain').onclick=()=>qzStart(i);$('#qzBack').onclick=()=>{$('#game').hidden=true;scCard(i)};$('#qzPrev').onclick=()=>{$('#game').hidden=true;scCard(Math.max(0,i-1))};$('#qzNext').onclick=()=>{$('#game').hidden=true;scCard(Math.min(SC.length-1,i+1))};
  if(window.__PHQZDONE)window.__PHQZDONE.push({i,ok,n:Q.length})}
const B2=()=>$('#gbody');
/* 第五十八次 老師 (2)、(9)：題目 的 母音 字母 紅色（🔴 基礎）／全部 同色（⚪ 進階：鷹架 慢慢 拿掉，像 真的 課本）*/
let QRED=LS.g('qred',1);
function vRed(w){return QRED?w.replace(/[aeiou]/g,m=>'<span class="vr">'+m+'</span>'):w}
function qzRedBar(){return '<div class="qred"><button data-qred="1" class="'+(QRED?'on':'')+'">🔴 母音 紅（基礎）</button><button data-qred="0" class="'+(QRED?'':'on')+'">⚪ 全部 同色（進階）</button></div>'}
function qzMono(){const g=$('#gbody');if(g)g.classList.toggle('mono',!QRED)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-qred]');if(b){QRED=+b.dataset.qred;LS.s('qred',QRED);qsa(document,'[data-qred]').forEach(x=>x.classList.toggle('on',+x.dataset.qred===QRED));qsa(document,'#gbody .op[data-o]').forEach(x=>{if(/^[a-z]+$/.test(x.dataset.o))x.innerHTML=vRed(x.dataset.o)});qzMono();return}
  const w=e.target.closest('[data-wsay]');if(w){/* 🔒 第六十一次 老師 2-(1)：點 喇叭（🔊 song、🔊 strong…）＝ 整個 字 金框＋每 個 字母 同時 稍微 放大 發光（每 一頁 都 一樣）*/const rw=w.closest('.rw,.mrow,[data-sy]'),wr=rw&&rw.querySelector('.wrow');w.classList.add('on');(wr?sayWhole(wr,w.dataset.wsay,++TOK):say(w.dataset.wsay)).then(()=>w.classList.remove('on'))}});
document.addEventListener('click',e=>{const s=e.target.closest('[data-sc]');if(s){scCard(+s.dataset.sc);return}
  const pm=e.target.closest('[data-pm]');if(pm){SMODE=pm.dataset.pm==='think'?SMODE:pm.dataset.pm;if(pm.dataset.pm!=='think')LS.s('smode',SMODE);modeBtn();scPlay(SCI,pm.dataset.pm);return}
  const qz=e.target.closest('[data-qz]');if(qz){qzStart(+qz.dataset.qz);return}const nx=e.target.closest('[data-next]');if(nx){if(SC[SCI]&&SC[SCI].k==='chain'&&$('#chNx')){$('#chNx').click();return}scCard(Math.min(SC.length-1,SCI+1));return}const pv=e.target.closest('[data-prev]');if(pv){$('#game').hidden=true;scCard(Math.max(0,SCI-1));return}
  const bl=e.target.closest('[data-bsp]');if(bl){e.stopPropagation();const row=bl.closest('.rw,.mrow,[data-sy],[data-m]');blendRow(row&&row.querySelector('.wrow')||row,bl.dataset.bsp,bl.dataset.bau,bl);return}
  const cb=e.target.closest('[data-capani]');if(cb){capAni(SC[+cb.dataset.capani]);return}
  /* 點 字母／注音／音標 ＝ 聽＋放大＋發亮（老師 第五十七次 4-4：以後 全部 字卡 都 這樣）*/
  const ck=e.target.closest('#s_ani .ck,#mapOut .ck,#sylOut .ck,#manyOut .ck,#more2w .ck,#fb .ck,#gbody .ck,#m2w .ck');if(ck){const tl=ck.querySelector('.tl[data-t]'),a=ck.dataset.zy||(tl&&auOf(tl.dataset.t,tl.dataset.cd==='1'));if(a&&!ck.classList.contains('sil')){ck.classList.add('on');say(a).then(()=>ck.classList.remove('on'))}return}
  const w=e.target.closest('[data-m]');if(w&&w.closest('#more2w')&&!e.target.closest('[data-bsp]')){say(MORE2[+w.dataset.m].au)}});
$('#aPrev').onclick=()=>scCard(Math.max(0,SCI-1));$('#aNext').onclick=()=>{const nb=$('#chNx');if(nb&&SC[SCI]&&SC[SCI].k==='chain'){nb.click();return}scCard(Math.min(SC.length-1,SCI+1))};   /* 第六十一次 老師 2-(2)：從 CVC 到 課本 的 動畫 頁〔下一頁〕＝ 下 一個 單字 的 動畫 */$('#aAgain').onclick=()=>scPlay(SCI,SMODE);$('#aIdx').onclick=idxDraw;
$('#aPause').onclick=()=>{PAUSED=!PAUSED;$('#aPause').textContent=PAUSED?'▶️ 繼續':'⏸️ 暫停';$('#aPause').classList.toggle('on',PAUSED);if(PAUSED)AU.pause()};
$('#aSlow').onclick=()=>{SLOW=SLOW>1?1:1.6;$('#aSlow').classList.toggle('on',SLOW>1)};
$('#aOne').onclick=()=>{ONE=ONE?0:1;LS.s('one',ONE);modeBtn()};
$('#aStep').onclick=()=>{SMODE='step';LS.s('smode',SMODE);modeBtn();scPlay(SCI,'step')};$('#aAll').onclick=()=>{SMODE='all';LS.s('smode',SMODE);modeBtn();scPlay(SCI,'all')};$('#aThink').onclick=()=>scPlay(SCI,'think');
$('#aQz').onclick=()=>qzStart(SCI);
if($('#aAni')){const ab=()=>{$('#aAni').textContent='🎬 秒懂 動畫：'+(ANI?'開':'關');$('#aAni').classList.toggle('on',!!ANI)};ab();$('#aAni').onclick=()=>{ANI=ANI?0:1;LS.s('ani',ANI);ab();scCard(SCI)}}
function modeBtn(){$('#aOne').classList.toggle('on',!!ONE);$('#aOne').textContent=ONE?'1️⃣ 單字 唸 一次：開':'1️⃣ 單字 唸 一次：關';$('#aStep').classList.toggle('on',SMODE==='step');$('#aAll').classList.toggle('on',SMODE==='all')}
function strBtn(){['#aStress','#sStress'].forEach(id=>{const b=$(id);b.textContent='🎵 重音：'+(STR?'開':'關');b.classList.toggle('on',STR)})}
$('#aStress').onclick=()=>{STR=!STR;strBtn();scPlay(SCI,SMODE)};
/* ══ ② 🗺️ 拼音 地圖（第五十七次 老師 4-20）══
 * 清單＋規則 ＝ _map_combos.js（MAPC）；點 一顆 ＝ 只 換 那 一個 地方（字首／母音／字尾），其他 不 動；不合 拼字 習慣 的 ＝ 暗＋說 為什麼（不 自動 改 別的 地方）
 * 新 字尾 pt ct xt lp lf lt sp mb ld lk nch 可以 自由 組合（不再 是 固定 的 例字）；ch 就 是 ch、tch 另外 一顆；全部 組合 都 有 聲音（tools/ph_gen57.py）*/
const XBS=new Set(typeof XBAD!=='undefined'?XBAD:[]),BDS=new Set(typeof BADC!=='undefined'?BADC:[]),MAPC=window.MAPC,ON=MAPC.ON,VV=MAPC.VV,CO=MAPC.CO;
/* 第六十次：ll ff ss、all、短 oo、沒有 字首 的 常見 真的 字（_realreg 用 規則 拼法 找 不到）*/
const REALW=new Set('badge edge ledge hedge wedge ridge bridge judge fudge lodge dodge have give bell tell sell well fell yell hill fill will bill pill mill doll dull gull puff cuff cliff stiff stuff sniff fluff kiss miss boss moss toss less mess pass mass glass class grass dress press cross bliss ball tall fall call hall wall mall small stall good hood wood foot look cook hook took shook stood at an in on it up am and ant ask end ink'.split(' '));
let MLV=LS.g('mlv','b'),MS=LS.g('ms2',{o:'b',v:'a',c:'t'}),MG={o:LS.g('mgo','b'),c:LS.g('mgc','b')};
const VNM={a:'a',e:'e',i:'i',o:'o',u:'u',a_e:'a_e',i_e:'i_e',o_e:'o_e',u_e:'u_e',ai:'ai',ay:'ay',ee:'ee',ea:'ea',oa:'oa',ow:'ow',ou:'ou',ow2:'ow',oi:'oi',oy:'oy',au:'au',aw:'aw',oo:'oo',oo2:'oo',ar:'ar',or:'or',er:'er',ir:'ir',ur:'ur'};
const VSUB={ow:'ㄡ',ow2:'ㄠ',au:'ㄛ',aw:'ㄛ',oo:'長 ㄨ',oo2:'短 ㄛㄨ',ou:'ㄠ',oi:'ㄛ一',oy:'ㄛ一'};
function codeOf(o,v,c){return MAPC.code(o,v,c)}function spellOf(o,v,c){return MAPC.spell(o,v,c)}
/* 拼字 ➜ 方框 的 寫法 */
function specOfMap(o,v,c){if(o==='無')o='';const sh=VV.b.indexOf(v)>=0,cc=c==='無'?'':c;let cs=cc;if(sh){if(cc==='k')cs='ck';else if(cc==='z')cs='zz'}
  const vc=MAPC.VC[v],vs=v==='ow2'?'ow':v==='oo2'?'oo':v;let vp;
  if(/_e$/.test(v))vp=v[0]+'!='+(codeOf(o,v,c).split('-')[1]);else if(sh)vp=(v==='a'&&c==='ll')?'a=ao':v;else if(v==='ow2')vp='ow='+vc;else if(TEAM2[vs])vp=vs+'!='+vc;else if(RV[vs])vp=vs;else vp=vs+'='+vc;
  return (o?o+'.':'')+vp+(cs?'.'+cs:'')+(/_e$/.test(v)?'.e~':'')}
function why(o,v,c){if(MAPC.ok(o,v,c))return '';const sh=VV.b.indexOf(v)>=0;
  if(sh&&c==='無')return '短 母音 後面 一定 要 有 字尾（例：ca ➜ cat）';if(sh&&/^[lfs]$/.test(c))return '短 母音 後面 的 l、f、s 要 寫 兩個：ll、ff、ss（bell、puff、kiss）➜ 點 右邊 的 '+c+c;if(c==='dge')return 'dge 只 接 在 短 母音 後面（badge、edge、bridge）';if(c==='ve')return 've 這裡 只 配 a、i（have、give）；其他 的 ve 字 常常 是 magic e（gave、five）';if(/^(ll|ff|ss)$/.test(c))return c+' 只 接 在 短 母音 a e i o u 後面'+(c==='ll'?'（o＋ll 會 變 音：doll／poll）':'');if(v==='oo2')return '短 的 oo 常見 的 字：good、foot、look ➜ 字尾 選 d、t、k';if(sh&&(c==='ld'||c==='lk'))return 'a、o 後面 接 ld、lk 母音 會 變（old、talk）';if(sh&&c==='mb')return 'mb 只 跟 a、i、u（lamb、limb、thumb）';
  if(v==='ay'||v==='ow'||v==='oy'||v==='aw')return v+' 通常 在 字 的 最後（day、snow、boy、saw）';if(/_e$/.test(v))return 'magic e 後面 只 放 一個 子音（b d k l m n p t）';
  return '英文 很少 這樣 拼'}
function chipHTML(lab,list,k,tag){return '<div class="mg">'+lab+'</div><div class="chips">'+list.map(x=>{const t=Object.assign({},MS);t[k]=x;const ok=MAPC.ok(t.o,t.v,t.c);
  return '<button class="chip en'+(MS[k]===x?' on':'')+(ok?'':' dim')+'" data-mk="'+k+'" data-mv="'+x+'">'+(k==='v'?VNM[x]:x)+(k==='v'&&VSUB[x]?'<small>'+VSUB[x]+'</small>':tag?'<small>'+(x==='ld'||x==='lk'?'⚠ old talk':'新')+'</small>':'')+'</button>'}).join('')+'</div>'}
const OG=[['b','一個 子音（無 ＝ 沒有 字首，例：at、up；sh ch th wh ＝ 兩個 字母 一個 聲音；wh 的 h 不 發音；qu ＝ 2 個 聲音）',ON.b],['a2','兩個 子音（2 個 聲音）',ON.a2],['a3','三個 子音（3 個 聲音）',ON.a3]];
const VG=[['b','短 母音（紅）',VV.b],['a','唸 名字 的 母音（黃）：magic e、兩個 母音 字母（第二個 灰）',VV.a],['t','其他 母音 組合：兩個 一起 唸（紅）、母音＋r（r 藍）',VV.t]];
const CG=[['b','一個 子音（無 ＝ 沒有 字尾）',CO.b],['d','兩個 字母 一個 聲音（tch 的 t 不 發音；ll ff ss ＝ 短 母音 後面 的 l f s；dge ＝ ㄓ、ve ＝ v）',CO.d],['a2','兩個 子音（2 個 聲音）',CO.a2],['n2','兩個 子音 新 加 的（mb 的 b 不 發音）',CO.n2.concat(CO.a3),1]];
function grpTabs(k,G0,cur){return '<div class="gtabs">'+G0.map(g=>'<button data-gk="'+k+'" data-gv="'+g[0]+'" class="'+(cur===g[0]?'on':'')+'">'+g[1].split('（')[0]+'</button>').join('')+'</div>'}
function mapDraw(){const A=MLV==='a';$('#lvB').classList.toggle('on',!A);$('#lvA').classList.toggle('on',A);
  if(!A){$('#mOn').innerHTML=chipHTML(OG[0][1],['無'].concat(ON.b),'o');$('#mV').innerHTML=chipHTML(VG[0][1],VV.b,'v');$('#mCo').innerHTML=chipHTML(CG[0][1],CO.b,'c')+chipHTML(CG[1][1],CO.d,'c')}
  else{/* 🔵 進階：字首、字尾 上面 分組 按鈕，一次 只 看 一組（不 眼花）*/
    const og=OG.find(g=>g[0]===MG.o)||OG[0],cg=CG.find(g=>g[0]===MG.c)||CG[0];
    $('#mOn').innerHTML=grpTabs('o',OG,og[0])+chipHTML(og[1],og[0]==='b'?['無'].concat(og[2]):og[2],'o');$('#mV').innerHTML=VG.map(g=>chipHTML(g[1],g[2],'v')).join('');$('#mCo').innerHTML=grpTabs('c',CG,cg[0])+chipHTML(cg[1],cg[2],'c',cg[3])}
  mapOut()}
function mapSet(o,v,c){MS={o,v,c};LS.s('ms2',MS);if(TAB==='map')mapDraw()}
async function mapOut(){TOK++;const o=MS.o,v=MS.v,c=MS.c,box=M2?$('#m2w'):$('#mapOut');const ok=MAPC.ok(o,v,c),spec=specOfMap(o,v,c),w=spellOf(o,v,c),code=codeOf(o,v,c),xb=XBS.has(code),bd=BDS.has(code),has=ok&&!xb&&!bd&&AV.has(code),real=REALC[code]===w||REALW.has(w),C=countOf(spec);
  const note=(c==='ld'||c==='lk')?'<span class="mtag p">⚠ old、talk 的 母音 會 變（a、o 不 接 ld、lk）</span>':c==='mb'?'<span class="mtag p">mb 的 b 不 發音</span>':c==='tch'?'<span class="mtag p">tch 的 t 不 發音</span>':(v==='au'||v==='aw')?'<span class="mtag p">au、aw ＝ ㄛ（嘴巴 大大 張開，像 talk 的 a）</span>':(v==='a'&&c==='ll')?'<span class="mtag p">all 的 a ＝ ㄛ（ball、tall、fall）</span>':v==='oo2'?'<span class="mtag p">短 的 oo ＝ ㄛㄨ（good、foot、look）</span>':/^(ll|ff|ss)$/.test(c)?'<span class="mtag p">'+c+' ＝ 兩個 字母 一個 聲音</span>':c==='dge'?'<span class="mtag p">dge ＝ ㄓ（d、e 不 發音）</span>':c==='ve'?'<span class="mtag p">ve ＝ v（英文 字 不 用 v 結尾，後面 加 不 發音 的 e）</span>':'';
  box.innerHTML='<div class="wrow'+(ok?'':' bad')+'">'+wordHTML(spec,{lab:1,dots:1})+'</div><div class="sum">'+patTxt(spec)+'：'+C.b+' 個 方框、<b>'+C.n+' 個 聲音</b>'+(C.v>1?'、'+C.v+' 個 音節':'')+'</div>'+
    '<div class="cap">'+(bd?'<span class="mtag w">⚠ 這個 組合 不 放（唸 起來 像 不 好 的 字）</span>':xb?'<span class="mtag w">⚠ '+w+' 是 真的 英文 字，但是 不 照 規則 唸（例外 字），所以 這裡 不 唸</span>':!ok?'<span class="mtag w">⚠ '+why(o,v,c)+'</span>':real?'<span class="mtag r">✅ 真的 英文 字</span>':'<span class="mtag p">🔮 練習 用 的 假字（照 規則 唸）</span>')+note+'</div>'+
    '<div class="ctl"><button id="mSay1"'+(has?'':' disabled')+'>🔤 拼讀（一個 一個 唸 ➜ 合 起來）</button><button id="mSay2"'+(has?'':' disabled')+'>🔊 整個 字</button></div>';
  if(M2)m2Arrows();$('#mSay2').onclick=()=>sayWhole(box,code,++TOK);   /* 第六十次 老師 4-(4)：整個 字 ＝ 金框＋每 個 字母 一起 放大 發光 */$('#mSay1').onclick=()=>mapSay(spec,code,box);if(has&&!FAST&&!PRAC)mapSay(spec,code,box)}
async function mapSay(spec,code,box){const me=++TOK,S=parse(spec),cks=qsa(box,'.ck');let k=0;for(const B of S)for(const b of B)for(const c of b.ch){const el=cks[k++];const a=auOf(c.t,b.coda);if(!a||c.sil||b.type==='g')continue;if(me!==TOK)return;el.classList.add('on');await sayW(a,me);el.classList.remove('on')}
  await sayWhole(box,code,me)}
document.addEventListener('click',e=>{const g=e.target.closest('[data-gk]');if(g){MG[g.dataset.gk]=g.dataset.gv;LS.s('mg'+g.dataset.gk,g.dataset.gv);mapDraw();return}
  const b=e.target.closest('[data-mk]');if(!b)return;MS[b.dataset.mk]=b.dataset.mv;LS.s('ms2',MS);mapDraw();if(PRAC)pracCheck()});
$('#lvB').onclick=()=>{MLV='b';LS.s('mlv','b');if(VV.b.indexOf(MS.v)<0)MS.v='a';if(ON.b.indexOf(MS.o)<0)MS.o='b';if(CO.b.concat(CO.d).indexOf(MS.c)<0)MS.c='t';mapDraw()};$('#lvA').onclick=()=>{MLV='a';LS.s('mlv','a');mapDraw()};
$('#mRand').onclick=()=>{const L=MAPC.all().filter(x=>AV.has(x.code)&&!XBS.has(x.code)&&!BDS.has(x.code)&&(MLV==='a'||(ON.b.indexOf(x.o)>=0&&VV.b.indexOf(x.v)>=0&&CO.b.concat(CO.d).indexOf(x.c)>=0)));const x=R(L);MS={o:x.o,v:x.v,c:x.c};LS.s('ms2',MS);mapDraw()};
/* 🎧 你 來 拼（聽 ➜ 自己 點 字首、母音、字尾）／👀 你 來 讀（看 ➜ 先 自己 唸 ➜ 再 聽 對 不 對）：我 做 ➜ 一起 做 ➜ 你 做 */
let PRAC=null;
function pracPool(){return QW.filter(x=>MLV==='a'||(!x.long&&x.on.join('').length<=2&&x.co.join('').length<=2)).map(x=>{const o=x.on.join(''),c=x.co.join('')||'無',v=x.v+(x.mg?'_e':'');return {o,v,c:c==='ck'?'k':c==='zz'?'z':c,x}}).filter(y=>MAPC.ok(y.o,y.v,y.c)&&codeOf(y.o,y.v,y.c)===y.x.c)}
function pracStart(kind){const y=R(pracPool());if(!y)return;PRAC={kind,y};if(M2&&kind==='spell')mapDraw();const P=$('#prac');P.hidden=false;
  if(kind==='spell'){/* 2026-11-18 第六十次 老師 3-(2)C：〔🔊 再 聽 一次〕大大 的、會 呼吸 發光；拼 對／公布 答案 ＝ 整個 字 唸 兩次 就 停，等 學生 按〔🔊 再 聽 一次〕或〔➡ 下一題〕*/
    P.innerHTML='<div class="tq">🎧 你 來 拼：聽 ➜ 自己 點 ① 字首 ② 母音 ③ 字尾，拼 出 這個 字</div><div class="ctl"><button class="btn bigear" id="pEar">🔊 再 聽 一次</button><button class="btn gold" id="pAns">👉 公布 答案</button><button class="btn go" id="pNx2">➡ 下一題</button><button class="btn" id="pX">✖ 結束 練習</button></div><div class="ctl"><button class="btn rush" id="pRush">⏱️ 限時 挑戰：⚡ 音素 解碼 競速（每 題 30 秒、不 看 提示 ✖5）</button></div><div id="pRes" class="cap"></div>';
    say(y.x.c);$('#pEar').onclick=()=>{const b=$('#pEar');b.classList.add('on');say(y.x.c).then(()=>b.classList.remove('on'))};$('#pAns').onclick=()=>pracReveal();$('#pNx2').onclick=()=>pracStart('spell');$('#pRush').onclick=()=>{TOK++;start('srA')}}
  else{MS={o:y.o,v:y.v,c:y.c};mapDraw();$$('#mapOut .tl[data-t],#m2w .tl[data-t]').forEach(t=>t.classList.add('hide'));
    P.innerHTML='<div class="tq">👀 你 來 讀：先 找 母音（紅），一個 方框 一個 方框 在 心裡 唸，再 合 起來 ➜ 大聲 唸 出來</div><div class="ctl"><button class="btn gold" id="pAns">🔊 聽 答案（對 不 對？）</button><button class="btn" id="pNx">➡ 下 一個</button><button class="btn" id="pX">✖ 結束 練習</button></div>';
    $('#pAns').onclick=()=>{$$('#mapOut .tl,#m2w .tl').forEach(t=>t.classList.remove('hide'));mapSay(specOfMap(y.o,y.v,y.c),y.x.c,M2?$('#m2w'):$('#mapOut'))};$('#pNx').onclick=()=>pracStart('read')}
  $('#pX').onclick=()=>{PRAC=null;P.hidden=true;mapDraw()}}
async function pracTwice(y){const box=M2?$('#m2w'):$('#mapOut'),me=++TOK;for(let k=0;k<2;k++){if(me!==TOK)return;await sayWhole(box,y.x.c,me);await wait(350)}}
function pracDone(y,msg){PRAC.done=1;$('#pRes').innerHTML=msg+'<div class="pnext">👉 再 聽 一次？還是 ➡ 下一題？</div>';$('#pAns').hidden=true;$('#pNx2').classList.add('pulse');pracTwice(y)}
function pracCheck(){if(!PRAC||PRAC.kind!=='spell'||PRAC.done)return;const y=PRAC.y;if(MS.o===y.o&&MS.v===y.v&&MS.c===y.c)pracDone(y,'🎉 <b>拼 對 了！</b> <span class="en">'+y.x.w+'</span>')}
function pracReveal(){const y=PRAC.y;PRAC.done=0;MS={o:y.o,v:y.v,c:y.c};mapDraw();PRAC.done=0;pracDone(y,'👉 答案 ＝ <b class="en">'+y.x.w+'</b>　下 一題 自己 拼 拼 看')}
$('#pSpell').onclick=()=>pracStart('spell');$('#pRead').onclick=()=>pracStart('read');
/* map2（新 版本）：每 一個 方框 正下方〔▲〕〔▼〕直接 換（照 Phonics Master 字卡 的 操作，字 在 最 上面 大大 的）*/
function m2List(k){const A=MLV==='a';return k==='o'?(A?ON.b.concat(ON.a2,ON.a3):ON.b):k==='v'?(A?VV.b.concat(VV.a,VV.t):VV.b):(A?CO.b.concat(CO.d,CO.a2,CO.n2,CO.a3):CO.b.concat(CO.d))}
/* 2026-11-17 第五十八次 老師 (7)：你 來 拼 的 時候 不 用 一直 轉 ▲▼ ➜ 每 個 方框 下面 直接 4 個 選項（對 的＋3 個 只 差 一點 的），點 一下 就 放 進去 */
function m2Pick(k){const y=PRAC.y,L=m2List(k).filter(x=>x!==y[k]),near=L.filter(x=>x!==y[k]&&(x[0]===y[k][0]||x.length===y[k].length)),far=L.filter(x=>x!==y[k]&&near.indexOf(x)<0);
  const O=SH([y[k]].concat(SH(near).concat(SH(far)).filter(x=>{const T=Object.assign({},y);T[k]=x;return MAPC.ok(T.o,T.v,T.c)}).slice(0,3)));PRAC.op=PRAC.op||{};PRAC.op[k]=PRAC.op[k]||O;return PRAC.op[k]}
function m2Arrows(){const box=$('#m2w');let seenV=false;const PK=PRAC&&PRAC.kind==='spell';qsa(box,'.bx').forEach(b=>{if(b.classList.contains('g')||b.classList.contains('rr'))return;const k=b.classList.contains('c')?(seenV?'c':'o'):(seenV=true,'v');
  if(PK){b.appendChild(H('div','m2p',m2Pick(k).map(x=>'<button data-m2p="'+k+'" data-v="'+x+'" class="'+(MS[k]===x?'on':'')+'">'+(k==='v'?VNM[x]:x)+'</button>').join('')));return}
  b.appendChild(H('div','m2a','<button data-m2="'+k+'" data-d="-1">▲</button><span>'+(k==='o'?'字首':k==='v'?'母音':'字尾')+'</span><button data-m2="'+k+'" data-d="1">▼</button>'))})}
document.addEventListener('click',e=>{const p=e.target.closest('[data-m2p]');if(p){e.stopPropagation();MS[p.dataset.m2p]=p.dataset.v;LS.s('ms2',MS);mapDraw();if(PRAC)pracCheck();return}},true);
document.addEventListener('click',e=>{const a=e.target.closest('[data-m2]');if(!a)return;e.stopPropagation();const k=a.dataset.m2,L=m2List(k);let i=L.indexOf(MS[k]);for(let t=0;t<L.length;t++){i=(i+(+a.dataset.d)+L.length)%L.length;const T=Object.assign({},MS);T[k]=L[i];if(MAPC.ok(T.o,T.v,T.c))break}MS[k]=L[i];LS.s('ms2',MS);mapDraw();if(PRAC)pracCheck()},true);

/* ══ ③ 🪜 多 音節（重音 ＝ 第一個 音節）；唸 到 的 音節 整個 放大＋發亮（老師 4-14）══ */
const SYL=[['bathroom','b.a.th|r.oo.m','浴室'],['bedroom','b.e.d|r.oo.m','臥室'],['rabbit','r.a|bb.i.t','兔子'],['happy','h.a|pp.y','快樂的'],['kitchen','k.i|tch.e=ah.n','廚房'],['baby','b.a!=ai|b.y','嬰兒'],['angry','a.n|gr.y','生氣的'],['turtle','t.ur|t.le=el','烏龜'],['dining','d.i!=ii|n.i.ng','用餐'],['living','l.i|v.i.ng','生活']];
/* 2026-11-17 第五十八次 老師 (6)-1：進階版 ＝ 3 音節、4 音節（從 CVC 一塊 一塊 走到 課本 的 長 字）；第 4 格 ＝ 重音 在 第幾 個 音節；語音 tools/ph_syl58.py（整個 字 電腦 聽寫 12／12 對、音節 從 真的 字 切）*/
const SYL3=[['banana','b.a=ah|n.a|n.a=ah','香蕉',1],['umbrella','u.m|br.e|ll.a=ah','雨傘',1],['tomato','t.o=ah|m.a!=ai|t.o!=oa','番茄',1],['hamburger','h.a.m|b.ur|g.er','漢堡',0],['fantastic','f.a.n|t.a.s|t.i.c','好 棒 的',1],['family','f.a|m.i=ah|l.y','家人',0],['animal','a|n.i=ah|m.a=ah.l','動物',0],['elephant','e|l.e=ah|ph.a=ah.nt','大象',0]];
const SYL4=[['watermelon','w.a=ao|t.er|m.e|l.o=ah.n','西瓜',0],['caterpillar','c.a|t.er|p.i|ll.ar=er1','毛毛蟲',0],['alligator','a|ll.i=ah|g.a!=ai|t.or=er1','短吻鱷',0],['helicopter','h.e|l.i=ah|c.o.p|t.er','直升機',0]];
let SYLN=LS.g('syln',2);const sylL=()=>SYLN===3?SYL3:SYLN===4?SYL4:SYL;const sylW=w=>AV.has('bk_'+w)?'bk_'+w:AV.has('w_c58_'+w)?'w_c58_'+w:'w_c55_'+w;
function sylDraw(){$('#sylOut').className='pnl s'+SYLN;qsa(document,'[data-syln]').forEach(b=>b.classList.toggle('on',+b.dataset.syln===SYLN));$('#sylOut').innerHTML='<div class="cap">每 一個 <b>紅框（母音 聲音）＝ 一個 音節</b>；虛線 框 ＝ 一個 音節。'+(STR?'🎵 <b>大 的 ＋ ● ＝ 重音</b>（唸 大聲、唸 長 一點）':'')+'</div>'+
  sylL().map((x,i)=>'<div class="wrow'+(STR?' stress':'')+'" data-sy="'+i+'" style="cursor:pointer">'+wordHTML(x[1],{dots:1,st:STR?(x[3]||0):null})+'<span class="cap" style="align-self:center;margin-left:14px">'+x[2]+'　🔊</span><button class="wsay blb" data-bsp="'+x[1]+'" data-bau="'+sylW(x[0])+'">🔤 拼讀</button></div>').join('')}
document.addEventListener('click',e=>{const r=e.target.closest('[data-sy]');if(r&&!e.target.closest('.ck')&&!e.target.closest('[data-bsp]')){const x=sylL()[+r.dataset.sy];(async()=>{const me=++TOK;const sy=r.querySelectorAll('.syl');for(let i=0;i<sy.length;i++){sy[i].classList.add('hot');await sayW(x[0]==='baby'?['w_c55_ba','w_c55_by'][i]:'sy_'+x[0]+'_'+i,me);sy[i].classList.remove('hot')}r.querySelectorAll('.syl').forEach(s=>s.classList.add('hot'));await sayW(sylW(x[0]),me);r.querySelectorAll('.syl').forEach(s=>s.classList.remove('hot'))})()}});
$('#sStress').onclick=()=>{STR=!STR;strBtn();sylDraw()};
document.addEventListener('click',e=>{const b=e.target.closest('[data-syln]');if(b){SYLN=+b.dataset.syln;LS.s('syln',SYLN);sylDraw()}});
/* ══ ④ 一個 字母 很多 聲音／一個 聲音 很多 拼法（老師 4-15）：每 個 字母 正下方 音標；同 一組 裡 不同 的 聲音 ＝ 不同 深淺 的 紅；唸 名字 ＝ 黃；不 發音 ＝ 灰 ══ */
const RED=['#FF8A8A','#E53935','#A51D1D','#6D0F0F'];
const MANY=[['同 一個 字母 a，4 種 聲音（看 後面 的 字母）',[['c.a.t','bk_cat','短 a'],['c.a!=ai.k.e~','w_cake','magic e'],['b.a=ao.ll','w_ball','a＋ll'],['c.ar','w_car','a＋r']]],
 ['同 一個 聲音 ㄟ（eɪ），3 種 拼法',[['c.a!=ai.k.e~','w_cake','a_e'],['r.ai!=ai.n','w_rain','ai：在 中間'],['d.ay!=ai','w_day','ay：在 最後']]],
 ['同 一個 字母 o，3 種 聲音',[['h.o.t','h-aa-t','短 o'],['n.o!=oa.t.e~','n-oa-t','magic e'],['f.or','f-or','o＋r']]],
 ['同 一個 聲音 一（i），2 種 拼法',[['s.ee!=ee.d','s-ee-d','ee：第一個 e 唸 名字'],['s.ea!=ee.t','s-ee-t','ea：e 唸 名字']]],
 ['ow 有 兩種 聲音',[['sn.ow!=oa','sn-oa','ㄡ：o 唸 名字、w 不 發音'],['c.ow=ou','k-ou','ㄠ：o、w 一起 唸（紅）']]],
 ['其他 兩個 母音 字母 一起 唸（都 紅）',[['l.ou.d','l-ou-d','ou ＝ ㄠ'],['b.oy','b-oy','oy ＝ ㄛ一'],['c.oi.n','k-oy-n','oi ＝ ㄛ一'],['s.aw','s-ao','aw ＝ ㄛ（嘴巴 大大 張開）'],['m.oo.n','m-uu-n','oo ＝ ㄨ']]]];
function shadeOf(rows){const seen=[];return rows.map(r=>{const S=parse(r[0]);let k=0;const o={};S[0].forEach((b,bi)=>{if(b.type==='v'){const t=b.ch[0].t;let i=seen.indexOf(t);if(i<0){seen.push(t);i=seen.length-1}o[bi]=RED[i%RED.length]}});return o})}
function manyDraw(){$('#manyOut').innerHTML=MANY.map(g=>{const rs=g[1].filter(r=>AV.has(r[1])),sh=shadeOf(rs);return '<div class="pnl"><h3>'+g[0]+'</h3>'+rs.map((r,i)=>'<div class="mrow" data-ma="'+r[1]+'"><div class="wrow mw2">'+wordHTML(r[0],{dots:1,shade:sh[i]})+'</div><span class="mz">'+r[2]+'</span><span class="ms">🔊</span><button class="wsay blb" data-bsp="'+r[0]+'" data-bau="'+r[1]+'">🔤 拼讀</button></div>').join('')+'</div>'}).join('')}
document.addEventListener('click',e=>{const r=e.target.closest('[data-ma]');if(r&&!e.target.closest('.ck')&&!e.target.closest('[data-bsp]')){const wr=r.querySelector('.wrow');if(wr)sayWhole(wr,r.dataset.ma,++TOK);else say(r.dataset.ma)}});
/* ══ 上面：注音／KK／IPA、分頁 ══ */
function mdDraw(){$$('.mdSw button').forEach(b=>b.classList.toggle('on',b.dataset.md===MD))}
$$('.mdSw button').forEach(b=>b.onclick=()=>{MD=b.dataset.md;LS.s('md',MD);mdDraw();retile()});
let TAB='ani';function tab(t){TAB=t;TOK++;$$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));['ani','map','syl','many','play'].forEach(k=>$('#s_'+k).hidden=k!==t);
  if(t==='ani')scCard(SCI);if(t==='map')mapDraw();if(t==='syl')sylDraw();if(t==='many')manyDraw();if(t==='play')gList();try{history.replaceState(null,'','#'+t)}catch(e){}}
$$('#tabs button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
/*__GAMES__*/
const BKORD=['strong','thin','short','tall','he','she','tired','angry','happy','sad','yes','no','not','bathroom','bedroom','kitchen','dining','living','where','bird','rabbit','turtle','cat','dog','fish'];
mdDraw();strBtn();modeBtn();{const ch=/#chain=([^&]+)/.exec(location.hash);if(ch){const w=decodeURIComponent(ch[1]),S=chainScene(w);if(S){SC.push(S);const i=SC.length-1;tab('ani');SCI=i;scCard(i);$('#aIdx').insertAdjacentHTML('beforebegin','<button class="btn go" onclick="history.length>1?history.back():location.href=\'games.html\'">⬅ 回 課本 單字 動畫</button>');/* 第六十次 老師 9-(4)：〔➡ 下 一個 單字〕＝ 直接 進 下 一個 字 的「從 CVC 變成…」動畫（課本 順序：三年級 ➜ 四年級）*/{const L=BKORD.filter(x=>CHAIN[x]),j=L.indexOf(w.replace(/ room$/,'')),nx=L[(j+1)%L.length];if(nx&&nx!==w)$('#aIdx').insertAdjacentHTML('afterend','<button class="btn gold" id="chNx" style="font-size:24px">➡ 下 一個 單字：<span class="en">'+nx+'</span></button>');const b=$('#chNx');if(b)b.onclick=()=>{location.replace('map.html#chain='+encodeURIComponent(nx));location.reload()}}}else tab('ani')}else tab((/#(ani|map|syl|many|play)/.exec(location.hash)||[0,M2?'map':'ani'])[1])}

/* ══ 2026-11-17 第五十八次 老師 (7)：🆕 第三 版 拼音 地圖 map3.html ＝「聲音 積木 拼字台」（不同 的 介面，最 直覺、最 好 操作）══
 * 🎧 聽 ➜ 拼：聽 一個 字 ➜ 上面 3 個 空 方框（字首｜母音｜字尾，數 聲音 的 黃點 先 出來）➜ 下面 3 排 積木（每 排 6 個：對 的＋只 差 一點 的），點 積木 ＝ 唸 它 的 聲音＋放進 方框 ➜〔✅ 對 答案〕：
 *    對 ＝ 一個 一個 唸 ➜ 合 起來、🔥 連對；錯 ＝ 那 一格 紅、唸 你 放 的 ➜ 唸 對 的（只 差 哪裡 一看 就 懂）➜ 再 試 一次
 * 👀 看 ➜ 讀：一個 字 出來（沒有 音標）➜ 點 每 一個 方框 ＝ 聽 那 一塊 ➜〔🔗 合 起來〕➜〔🔊 聽 答案〕對照 */
const M3=!!window.MAP3;let M3S=null,M3K=LS.g('m3k','spell'),M3F=0;
/* 第六十次 老師 3-(3)：字尾 子音 選項 下面 一句 嘴巴 提示（只 寫 最 容易 搞混 的 那 一組 的 差別）*/
function vLab(x){return TEAM2[x]?'<span class="vy">'+x[0]+'</span><span class="vg">'+x[1]+'</span>':VNM[x]}   /* ai ay ee ea oa ow：第一個 黃、第二個 灰 */
const TAILON=false;   /* 第六十一次 老師 2-(2)：〔👂 聽 最後 的 聲音〕暫時 刪除（要 加 回來 ＝ 改 true）*/
const ECUE={b:'喉嚨 震動',p:'吹 一口 氣',d:'喉嚨 震動',t:'吹 一口 氣',g:'喉嚨 震動',k:'吹 一口 氣',m:'閉 嘴',n:'舌頭 頂 上面',th:'舌頭 夾 牙齒',s:'牙齒 嘶 嘶',f:'上 牙 咬 下 唇',sh:'嘟 嘴 噓',ch:'先 閉 再 噴'};
/* 只 聽 最後 的 聲音 ＝ 母音＋字尾（cab ➜ ab），少 了 字首 ＝ 耳朵 只 注意 最後 */
function m3Rime(y){if(!y||y.c==='無')return null;const cd=codeOf(y.o,y.v,y.c).split('-').slice(1).join('-'),rc='0-'+cd;return AV.has(rc)&&!BDS.has(rc)?rc:null}
/* 點 字母 ＝ 唸 那個 字母 的 聲音＋發光（看 ➜ 讀 公布 答案 以前 也 可以）*/
function ckSay(row,spec){if(!row)return;const S=parse(spec),cks=qsa(row,'.ck');let k=0;for(const B of S)for(const b of B)for(const c of b.ch){const el=cks[k++];if(!el)continue;const a=c.sil||b.type==='g'?null:(c.au||auOf(c.t,b.coda));if(!a)continue;el.style.cursor='pointer';el.onclick=ev=>{ev.stopPropagation();el.classList.add('on');say(a).then(()=>el.classList.remove('on'))}}}
function m3Opts(y,k){const L=m2List(k).filter(x=>x!==y[k]),near=L.filter(x=>x[0]===y[k][0]||x.slice(-1)===y[k].slice(-1)),far=L.filter(x=>near.indexOf(x)<0);
  return SH([y[k]].concat(SH(near).concat(SH(far)).filter(x=>{const T=Object.assign({},y);T[k]=x;return MAPC.ok(T.o,T.v,T.c)&&(k!=='v'||!/_e$/.test(x)===!/_e$/.test(y.v))}).slice(0,5)))}
function m3Part(k,val,y){/* 一塊 的 聲音：照 方框 的 字母 一個 一個 唸 */const T=Object.assign({},y);T[k]=val;const sp=specOfMap(T.o,T.v,T.c),S=parse(sp)[0];let i=k==='o'?0:k==='v'?(T.o?1:0):(T.o?2:1);const b=S[i];return b?b.ch.map(c=>c.sil?null:auOf(c.t,b.coda)).filter(Boolean):[]}
async function m3SayParts(a){const me=++TOK;for(const f of a){if(me!==TOK)return;await sayW(f,me)}}
function m3New(){const y=R(pracPool().filter(z=>MLV==='a'||z.c!=='無'));M3S={y,put:{o:null,v:null,c:null},tries:0};m3Draw();if(M3K==='spell')say(y.x.c)}
/* 第六十次 老師 3-(3)：按〔聽 ➜ 拼〕〔看 ➜ 讀〕〔基礎／進階〕題目 不 換（只有〔➡ 下 一個〕才 換）*/
function m3Keep(){const y=M3S.y;M3S={y,put:{o:null,v:null,c:null},tries:0};m3Draw();if(M3K==='spell')say(y.x.c)}
/* 2026-11-18 第五十九次 老師 3：版面 重排（上 ➜ 下 一條 動線：① 聽 ➜ ② 選 積木 ➜ ③ 對 答案）；上面 的 字 ＝ 方框 本身（magic e 自己 跑 到 最後：f i l e）；
 * 每 個 聲音 一個 黃點，在 發 那 個 聲音 的 字母 正下方；點 字母 ＝ 唸＋發光、點〔🔊 整個 字〕＝ 全部 字母 一起 發光＋金框；對 答案 以後 不 自動 跳 題（只有〔➡ 下 一個〕才 跳）、結果 就 在 字 的 正下方 */
function m3Units(k,val,y){/* 一格 裡 的「聲音 單位」：[{l:字母,n:幾 個 聲音,a:聲音 檔,sil}] */const T=Object.assign({},y);T[k]=val;const S=parse(specOfMap(T.o,T.v,T.c))[0];const i=k==='o'?0:k==='v'?(T.o?1:0):(T.o?2:1),b=S[i];if(!b)return [];
  return b.ch.map(c=>({l:c.l,n:nOf(b,c),a:c.sil?null:auOf(c.t,b.coda),sil:!!c.sil,nm:!!c.nm}))}
function m3Slot(k,S,y,nm){const v=S.put[k],cls='m3s '+(k==='v'?(v&&/_e$/.test(v)?'n':'v'):'c')+(v!=null?' full':'')+(S.bad&&S.bad[k]?' bad':'')+(S.good?' good':'');
  if(v==null){const n=m3Units(k,y[k],y).reduce((a,u)=>a+u.n,0);return '<div class="'+cls+'" data-m3s="'+k+'"><small>'+nm[k]+'</small><b>？</b><span class="m3dt">'+Array.from({length:n},()=>'<i></i>').join('')+'</span></div>'}
  if(v==='無')return '<div class="'+cls+'" data-m3s="'+k+'"><small>'+nm[k]+'</small><b>—</b><span class="m3dt"></span></div>';
  return '<div class="'+cls+'" data-m3s="'+k+'"><small>'+nm[k]+'</small><div class="m3u">'+m3Units(k,v,y).map(u=>'<span class="m3l1'+(u.sil?' sil':'')+(u.nm?' nm':'')+'"'+(u.a?' data-m3a="'+u.a+'"':'')+'><b>'+u.l+'</b><span class="m3dt">'+Array.from({length:u.n},()=>'<i></i>').join('')+'</span></span>').join('')+'</div></div>'}
function m3Draw(){const W=$('#m3'),S=M3S,y=S.y,ks=['o','v','c'].filter(k=>k!=='o'||y.o),nm={o:'字首 子音',v:'母音',c:'字尾 子音'},full=ks.every(k=>S.put[k]!=null);
  let h='<div class="m3top"><button data-m3k="spell" class="'+(M3K==='spell'?'on':'')+'">🎧 聽 ➜ 拼</button><button data-m3k="read" class="'+(M3K==='read'?'on':'')+'">👀 看 ➜ 讀</button><button id="m3lv" class="lv">'+(MLV==='a'?'🔵 進階':'🟢 基礎')+'</button><button id="m3how" class="how">❓ 怎麼 玩</button><button id="m3rush" class="rush">⏱️ 限時 挑戰</button><span class="m3f">🔥 連對 <b>'+M3F+'</b></span></div>';
  if(M3K==='spell'){const st=S.good||S.bad?2:full?2:Object.values(S.put).some(v=>v!=null)?1:0;
    h+='<div class="m3steps">'+['🔊 ① 聽','🧱 ② 選 積木 放進 方框','✅ ③ 對 答案'].map((t,j)=>'<span class="'+(j===st?'on':j<st?'ok':'')+'">'+t+'</span>').join('')+'</div>';
    h+='<div class="m3word"><div class="m3side"><button class="m3ear" id="m3ear">🔊 再 聽 一次</button>'+(TAILON&&y.c!=='無'?'<button class="m3tail" id="m3tail">👂 聽 最後 的 聲音</button>':'')+'<button class="m3whole" id="m3whole"'+(full?'':' disabled')+'>🔊 整個 字</button></div><div class="m3slots wrow" id="m3sl">'+ks.map(k=>m3Slot(k,S,y,nm)).join('')+(S.put.v&&/_e$/.test(S.put.v)?'<div class="m3s g full" data-m3s="e"><small>不 發音</small><div class="m3u"><span class="m3l1 sil"><b>e</b><span class="m3dt"></span></span></div></div>':'')+'</div></div>';
    h+='<div class="m3msg'+(S.good?' good':S.bad?' bad':'')+'" id="m3msg">'+(S.msg||'💡 黃點 ＝ 這 一格 有 幾 個 聲音')+'</div>';
    if(S.good)h+='<div class="m3ctl"><button class="btn" id="m3again">🔊 再 聽 一次</button><button class="btn go big" id="m3nx">➡ 下 一個</button></div>';
    else{h+=ks.map(k=>'<div class="m3row"><span class="m3l '+(k==='v'?'v':'c')+'">'+nm[k]+'</span>'+(S.op&&S.op[k]||(S.op=S.op||{},S.op[k]=m3Opts(y,k))).map(x=>'<button class="m3b '+(k==='v'?'v':'c')+(S.put[k]===x?' on':'')+'" data-m3b="'+k+'" data-v="'+x+'">'+(x==='無'?'—':k==='v'?vLab(x):x)+(k==='c'&&ECUE[x]?'<small class="m3cue">'+ECUE[x]+'</small>':'')+'</button>').join('')+'</div>').join('');
      h+='<div class="m3ctl"><button class="btn gold big" id="m3ck"'+(full?'':' disabled')+'>✅ 對 答案</button><button class="btn" id="m3sk">👉 看 答案</button><button class="btn go" id="m3nx">➡ 下 一個</button></div>'}}
  else{const sp=specOfMap(y.o,y.v,y.c);h+='<div class="m3steps">'+['👀 ① 找 🔴 母音','👆 ② 點 每 一格 聽','🔗 ③ 合 起來 唸'].map((t,j)=>'<span class="'+(j===0?'on':'')+'">'+t+'</span>').join('')+'</div><div class="wrow m3w" id="m3w">'+wordHTML(sp,{hideT:1,dots:1,lab:1})+'</div>'+
    '<div class="m3ctl"><button class="btn gold big" id="m3bl">🔗 合 起來（聽 答案）</button><button class="btn go" id="m3nx">➡ 下 一個</button></div>'}
  W.innerHTML=h;const g=id=>W.querySelector(id);
  if(g('#m3ear'))g('#m3ear').onclick=()=>say(y.x.c);if(g('#m3again'))g('#m3again').onclick=()=>{const w=$('#m3sl');sayWhole(w,y.x.c,++TOK)};if(g('#m3nx'))g('#m3nx').onclick=m3New;
  if(g('#m3lv'))g('#m3lv').onclick=()=>{MLV=MLV==='a'?'b':'a';LS.s('mlv',MLV);m3Keep()};if(g('#m3how'))g('#m3how').onclick=m3How;if(g('#m3rush'))g('#m3rush').onclick=()=>{TOK++;start('srB')};
  if(g('#m3whole'))g('#m3whole').onclick=async()=>{const T=S.put,code=codeOf(T.o||'',T.v,T.c),me=++TOK;if(AV.has(code))await sayWhole($('#m3sl'),code,me);else{for(const e of qsa($('#m3sl'),'[data-m3a]')){if(me!==TOK)return;e.classList.add('on');await sayW(e.dataset.m3a,me);e.classList.remove('on')}}};
  qsa(W,'#m3sl [data-m3a]').forEach(e=>e.onclick=()=>{e.classList.add('on');say(e.dataset.m3a).then(()=>e.classList.remove('on'))});
  const msgTop=()=>{const m=$('#m3msg');if(m&&m.scrollIntoView)try{m.scrollIntoView({block:'center',behavior:FAST?'auto':'smooth'})}catch(x){}};
  if(g('#m3sk'))g('#m3sk').onclick=()=>{M3F=0;S.put={o:y.o||null,v:y.v,c:y.c};S.good=1;S.bad=null;S.msg='👉 答案 ＝ <b class="en">'+y.x.w+'</b>　再 聽 一次，下 一題 自己 拼 拼 看';m3Draw();msgTop();blendRow($('#m3sl'),specOfMap(y.o,y.v,y.c),y.x.c)};
  if(g('#m3ck'))g('#m3ck').onclick=async()=>{const bad={};ks.forEach(k=>{if(S.put[k]!==y[k])bad[k]=1});S.tries++;
    if(!Object.keys(bad).length){M3F++;S.good=1;S.bad=null;S.msg='🎉 <b>拼 對 了！</b> <span class="en">'+y.x.w+'</span>';m3Draw();msgTop();await m3Blend(y);return}
    M3F=0;S.bad=bad;const k=Object.keys(bad)[0];S.msg='❌ <b>'+nm[k]+'</b> 不對：你 放 的 '+(S.put[k]==='無'?'—':k==='v'?VNM[S.put[k]]:S.put[k])+' ➜ 聽 一次 對 的 聲音，再 試 一次';m3Draw();msgTop();
    await m3SayParts(m3Part(k,S.put[k],y));await wait(350);await m3SayParts(m3Part(k,y[k],y));
    /* 第六十次 老師 3-(3)：字尾 難 聽 ➜ 再 比 一比 整個 字（cap ➜ cab），慢慢 聽 最後 的 聲音 */
    if(k==='c'){const T=Object.assign({},y);T.c=S.put[k];const wc=codeOf(T.o,T.v,T.c),me=TOK;if(AV.has(wc)&&!BDS.has(wc)){await wait(400);S.msg+='<div class="m3pair">👂 比 一比：<b class="en">'+spellOf(T.o,T.v,T.c)+'</b> ➜ <b class="en ok">'+y.x.w+'</b></div>';const m=$('#m3msg');if(m)m.innerHTML=S.msg;await sayW(wc,me);await wait(300);await sayW(y.x.c,me)}}};
  qsa(W,'[data-m3b]').forEach(b=>b.onclick=()=>{const k=b.dataset.m3b,v=b.dataset.v;S.put[k]=v;S.bad=null;S.good=0;S.msg='';m3Draw();m3SayParts(m3Part(k,v,y))});
  if(g('#m3bl'))g('#m3bl').onclick=async()=>{qsa(W,'.tl').forEach(t=>t.classList.remove('hide'));await blendRow($('#m3w'),specOfMap(y.o,y.v,y.c),y.x.c)};
  qsa(W,'[data-m3k]').forEach(b=>b.onclick=()=>{M3K=b.dataset.m3k;LS.s('m3k',M3K);m3Keep()});
  if(M3K==='read')ckSay($('#m3w'),specOfMap(y.o,y.v,y.c));
  if(g('#m3tail'))g('#m3tail').onclick=async()=>{const b=g('#m3tail'),me=++TOK,rc=m3Rime(y),fp=m3Part('c',y.c,y);b.classList.add('on');await sayW(y.x.c,me);await wait(300);for(let k=0;k<2;k++){if(rc)await sayW(rc,me);else await m3SayParts(fp);await wait(250)}b.classList.remove('on')}   /* 沒有「母音＋字尾」的 檔 ＝ 唸 字尾 的 聲音 */}
/* 拼 對 了：每 個 字母 一個 一個 唸＋發光 ➜ 整個 字 金框＋全部 發光 */
async function m3Blend(y){const me=++TOK;for(const e of qsa($('#m3sl'),'[data-m3a]')){if(me!==TOK)return;e.classList.add('on');await sayW(e.dataset.m3a,me);e.classList.remove('on')}if(me===TOK)await sayWhole($('#m3sl'),y.x.c,me)}
/* ❓ 怎麼 玩：秒懂 動畫（第一次 打開 自動 演）*/
function m3How(){capAni(M3K==='spell'?{cap:'🧱 聲音 積木：聽到 一個 字 ➜ 用 積木 拼 出來',ca:[{t:'🎯 這裡 練習「聽音 拼字」：聽到 字 就 會 拼'},{t:'① 🔊 先 聽（可以 一直 按 再 聽）',a:'f-ii-l'},{t:'② 黃點 ＝ 這 一格 有 幾 個 聲音',s:'f.i!=ii.l.e~',d:1},{t:'③ 點 積木 ＝ 聽 它 的 聲音＋放進 方框',s:'f.i!=ii.l.e~',p:1},{t:'magic e 會 自己 跑 到 最後：f i l e',s:'f.i!=ii.l.e~',a:'f-ii-l'},{t:'④ 按 ✅ 對 答案：錯 的 那 一格 變 紅'},{t:'💪 學會 了：沒 學 過 的 字，聽到 也 會 拼'}]}
  :{cap:'👀 看 ➜ 讀：看到 字 ➜ 自己 唸 出來',ca:[{t:'🎯 這裡 練習「看字 讀音」'},{t:'① 先 找 🔴 母音',s:'d.u.ck',v:1},{t:'② 點 每 一格 聽',s:'d.u.ck',p:1},{t:'③ 🔗 合 起來 唸',s:'d.u.ck',a:'d-uh-k'},{t:'💪 學會 了：新 的 字 自己 會 唸'}]})}
/* 第六十次 老師 3-(1)(2)A：第三 版、新版 上面 明顯 的 按鈕 回到 原來 的 拼音 地圖／新版 拼音 地圖 */
if(M2||M3){const nv=H('div','vnav','<a class="vbtn v1" href="map.html#map">⬅ 🗺️ 原來 的 拼音 地圖</a>'+(M3?'<a class="vbtn v2" href="map2.html#map">⬅ 🆕 新版 拼音 地圖</a>':''));document.body.insertBefore(nv,document.body.firstChild)}
if(M3){document.body.classList.add('m3');$('#m3').hidden=false;qsa(document,'main>.scr').forEach(e=>e.hidden=true);if($('#tabs'))$('#tabs').style.display='none';m3New();if(!LS.g('m3intro',0)&&!FAST){LS.s('m3intro',1);m3How()}}
window.PHM={blendRow,capAni,cvPlay,m3New,M3S:()=>M3S,BDS,SC,CHAIN,chainScene,MORE2,parse,countOf,patTxt,scPlay,scCard,qzStart,qzMake,tab,MS:()=>MS,mapOut,mapSet,codeOf,spellOf,AV,G:()=>G,start,QW,GM,q25Seq,MAPC};
})();
