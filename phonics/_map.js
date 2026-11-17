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
const CHK=['bb','pp','dd','tt','tch','ch','sh','th','ph','wh','ng','ck','qu','ss','ll','ff','zz','oo','ee','ea','ai','ay','oa','ow','ou','oy','oi','au','aw'];
const RV={ar:'aa',or:'ao',er:'er1',ir:'er1',ur:'er1'};                 /* 母音＋r：母音 字母 自己 一格（紅）＋r 一格（藍，子音）*/
const TEAM2={ai:1,ay:1,ee:1,ea:1,oa:1,ow:1};                           /* 唸 名字 的 兩個 母音 字母：第一個 黃、第二個 灰 */
const NSND=t=>t==='ks'||t==='kw'?2:1;
const CODA={b:'s_eb',d:'s_ed',g:'s_eg',p:'s_ep',t:'s_et',k:'s_ek',m:'s_em',n:'s_en',l:'s_el',ks:'s_x'};
const UNASP={b_u:['ㄅ','p','b'],d_u:['ㄉ','t','d'],g_u:['ㄍ','k','g']};   /* s 後面 的 p t k：注音 ＝ ㄅ ㄉ ㄍ（老師：speech 的 p 實際 是 ㄅ）*/
function auOf(t,coda){if(!t)return null;if(UNASP[t])return 's_'+UNASP[t][2];if(coda&&CODA[t])return CODA[t];if(t==='yu')return 's_uu';if(t==='ah')return 's_uh';if(t==='rr'||t==='er1')return 's_er';if(t==='rr2')return null;return 's_'+t}
function tileOf(t,coda){if(UNASP[t])return {zh:UNASP[t][0],sup:'',kk:UNASP[t][1],ipa:UNASP[t][1]};const T=TT[t]||{zh:t,kk:t,ipa:t};let o={zh:T.zh,sup:T.sup||'',kk:T.kk,ipa:T.ipa};
  if(coda){if(/^[bdgptk]$/.test(t))o.sup='〃';else if(t==='m'||t==='n')o.sup='～';else if(t==='l')o={zh:'ㄛ',sup:'',kk:'l',ipa:'l'};else if(t==='ng')o.sup=''}return o}
function tileHTML(t,coda,hide){if(!t)return '<span class="tl sl0"></span>';const o=tileOf(t,coda),tx=MD==='zh'?o.zh:MD==='kk'?o.kk:o.ipa;
  return '<span class="tl'+(MD==='zh'?'':' ph')+(hide?' hide':'')+'" data-t="'+t+'" data-cd="'+(coda?1:0)+'">'+(tx||'&nbsp;')+(MD==='zh'&&o.sup?'<sup>'+o.sup+'</sup>':'')+'</span>'}
function retile(){$$('.tl[data-t]').forEach(el=>{const h=el.classList.contains('hide'),on=el.classList.contains('on');const x=H('div','',tileHTML(el.dataset.t,el.dataset.cd==='1',h)).firstChild;if(on)x.classList.add('on');el.replaceWith(x)})}
/* 字 的 寫法："b.a.th|r.oo.m"（. ＝ 方框、| ＝ 音節）：o=ao（母音 碼）、a!=ai（唸 名字 ＝ 黃）、e~（不 發音 灰）、th=dh（有聲 th）、[ㄅ]c 注音；
 * 自動：ai ay ee ea oa ow 加 ! ＝ 第一個 黃、第二個 灰；ar or er ir ur ＝ 母音 一格＋r 藍 一格；wh 的 h、ck 的 c、tch 的 t、mb 的 b ＝ 灰；s 後面 的 p t k ＝ ㄅ ㄉ ㄍ */
const ZYAU={'ㄅ':'zy_b','ㄚ':'zy_a'};
function parse(spec){return spec.split('|').map(sy=>{let seenV=false;const out=[];sy.split('.').forEach((b,bi)=>{let o={ch:[]},m;
  if((m=/^\[(.+)\]([cv])$/.exec(b))){out.push({type:m[2],zy:1,ch:[{l:m[1],t:null,au:ZYAU[m[1]]}]});return}
  if(/~$/.test(b)){out.push({type:'g',ch:[{l:b.slice(0,-1),t:null,sil:1}]});return}
  let L=b,ov=null,nm=false;if((m=/^(.+?)(!)?=(.+)$/.exec(b))){L=m[1];nm=!!m[2];ov=m[3]}else if(/!$/.test(b)){L=b.slice(0,-1);nm=true}
  const isV=/^[aeiou]/.test(L)||L==='le'||(L==='y'&&bi>0);
  if(isV&&RV[L]&&!ov){seenV=true;out.push({type:'v',ch:[{l:L[0],t:RV[L]}]});out.push({type:'c',coda:true,rr:1,ch:[{l:'r',t:L==='ar'||L==='or'?'rr':'rr2'}]});return}
  if(isV){seenV=true;const t=ov||VMAP[L]||L;o.type=nm?'n':'v';o.ch=nm&&L.length===2&&TEAM2[L]?[{l:L[0],t,nm:1},{l:L[1],t:null,sil:1}]:[{l:L,t,nm:nm?1:0}];out.push(o);return}
  const parts=[];let s=L;while(s){const c=CHK.find(x=>s.startsWith(x))||s[0];parts.push(c);s=s.slice(c.length)}
  o.type='c';o.coda=seenV;parts.forEach((c,pi)=>{
    if(c==='wh'){o.ch.push({l:'w',t:'w'},{l:'h',t:null,sil:1});return}
    if(c==='ck'){o.ch.push({l:'c',t:null,sil:1},{l:'k',t:'k'});return}
    if(c==='tch'){o.ch.push({l:'t',t:null,sil:1},{l:'ch',t:'ch'});return}
    if(c==='b'&&seenV&&parts[pi-1]==='m'){o.ch.push({l:'b',t:null,sil:1});return}
    let t=ov&&parts.length===1?ov:(CMAP[c]||c);if(!seenV&&pi>0&&parts[0]==='s'&&/^(p|t|k|c)$/.test(c))t={p:'b_u',t:'d_u',k:'g_u',c:'g_u'}[c];
    o.ch.push({l:c,t})});out.push(o)});return out})}
function nOf(b,c){return b.type==='g'||c.sil?0:b.zy?1:(c.t?NSND(c.t):0)}
function bxHTML(B,o){o=o||{};return B.map((b,bi)=>'<div class="bx '+b.type+(b.rr?' rr':'')+(o.hide?' hid':'')+(o.sx!=null?(o.sx?' sx':' su'):'')+'" data-b="'+bi+'"'+(o.shade&&b.type!=='c'&&b.type!=='g'&&o.shade[bi]?' style="background:'+o.shade[bi]+'"':'')+'>'+
  (o.lab?'<span class="bl">'+(b.type==='c'?'子音':b.type==='g'?'不 發音':'母音')+'</span>':'')+
  b.ch.map((c,ci)=>{const n=nOf(b,c);return '<div class="ck'+(c.nm?' nm':'')+(c.sil?' sil':'')+'" data-c="'+ci+'"'+(c.au?' data-zy="'+c.au+'"':'')+'><span class="L'+(b.zy?' zy':'')+(c.sil?' gr':'')+(/[gjpqy]/.test(c.l)?' dsc':'')+'">'+c.l+'</span>'+
    (b.zy?'':'<span class="T">'+(c.sil?'<span class="tl sl0"></span>':tileHTML(c.t,b.coda,o.hideT))+'</span>')+'<span class="dt">'+Array.from({length:n},()=>'<i class="'+(o.dots?'on':'')+'"></i>').join('')+'</span></div>'}).join('')+'</div>').join('')}
function wordHTML(spec,o){o=o||{};const S=parse(spec),st=o.st;return S.map((B,si)=>S.length>1?'<div class="syl" data-s="'+si+'">'+bxHTML(B,Object.assign({},o,{sx:st!=null?(si===st):null}))+'</div>':bxHTML(B,o)).join(S.length>1?'<span class="plus">＋</span>':'')}
function countOf(spec){const S=parse(spec);let n=0,b=0,v=0;S.forEach(B=>B.forEach(x=>{if(x.type==='g')return;b++;if(x.type!=='c')v++;x.ch.forEach(c=>{n+=nOf(x,c)})}));return {n,b,v}}
function patTxt(spec){return parse(spec).map(B=>B.filter(x=>x.type!=='g').map(x=>x.type==='c'?'子':'母').join(' ')).join('｜')}
/* ══ ① 秒懂 動畫：從 零 開始 的 鷹架（每 段 一個 新 觀念，都 站 在 前 一段 上面）══
 * g ＝ 🎯 學 什麼、w ＝ 💪 對 英文 有 什麼 幫助、ask ＝ 🤔 引導 思考 的 最後 一個 問題、qz ＝ 隨堂 測驗 的 題型 */
const SC=[
 {k:'zy',t:'👂 注音：聲音 可以 拆、可以 合',g:'ㄅ＋ㄚ ＝ ㄅㄚ（八）：一個 字 是 好幾 個 聲音 拼 起來 的',w:'拼 英文 字 用 的 是 同 一個 本領（你 已經 會 了！）',rows:[{s:'[ㄅ]c.[ㄚ]v',au:'zy_ba'}],ask:'🤔 ㄅ 是 子音、ㄚ 是 母音。那 ㄅ＋ㄚ 有 幾 個 聲音？',cap:'注音 拼音 ＝ <span class="cb">子音</span>＋<span class="vb">母音</span>：兩個 方框、兩個 聲音（ㄅ＋ㄚ ＝ ㄅㄚ）',qz:'zy'},
 {k:'ab',t:'🔤 英文 字母 也 有 聲音',g:'b 唸 ㄅ、a 唸 ㄚㄝ、t 唸 ㄊ：看到 字母 就 想到 聲音',w:'看到 沒 學 過 的 字 也 唸 得 出來',rows:[{s:'[ㄅ]c.[ㄚ]v',au:'zy_ba',dim:1},{s:'b.a.t',au:'b-ae-t'}],ask:'🤔 b 和 ㄅ 有 什麼 一樣？',cap:'<span class="cb">b ＝ ㄅ</span>（上下 對齊）。英文 最 基本 的 拼法 ＝ <span class="cb">子</span>＋<span class="vb">母</span>＋<span class="cb">子</span>：三個 方框',qz:'zy'},
 {k:'cvc',t:'🧩 看字 讀音：一個 一個 唸 ➜ 合 起來',g:'子 母 子 三個 方框：一個 一個 唸，再 合 起來',w:'看字 讀音 的 第一步',rows:[{s:'m.a.p',au:'m-ae-p'},{s:'s.u.n',au:'s-uh-n'},{s:'p.i.g',au:'p-ih-g'}],ask:'🤔 三個 字 都 是 幾 個 方框？紅框 在 哪裡？',cap:'三個 字 都 是 <b>子 母 子</b>：<span class="vb">紅框（母音）在 中間</span>，一個 方框 一個 聲音',qz:'spell'},
 {k:'seg',t:'✂️ 聽音 拼字：聽 一個 字，數 聲音',g:'聽 hen ➜ 拆 成 h、e、n 三個 聲音 ➜ 寫 三個 字母',w:'聽音 拼字：聽到 就 寫 得 出來',rows:[{s:'h.e.n',au:'h-eh-n'},{s:'c.u.p',au:'k-uh-p'}],ask:'🤔 聽 到 一個 字，第一步 要 做 什麼？',cap:'聽音 拼字 3 步：① <b>數 聲音</b>（黃點）② 每 個 聲音 寫 一個 字母 ③ 再 唸 一次 檢查',qz:'count'},
 {k:'chg',t:'🔁 換 一個 方框 ＝ 新 的 字',g:'bat ➜ cat ➜ cut ➜ cup：每 次 只 換 一個 方框',w:'學會 一個 字 ＝ 學會 很多 字',rows:[{s:'b.a.t',au:'b-ae-t'},{s:'c.a.t',au:'k-ae-t'},{s:'c.u.t',au:'k-uh-t'},{s:'c.u.p',au:'k-uh-p'}],ask:'🤔 每 一次 換 了 哪 一個 方框？',cap:'字首 ➜ 母音 ➜ 字尾：<b>每 次 只 換 一個 方框</b>，就 變成 新 的 字',qz:'part'},
 {k:'d_ch',t:'👯 兩個 字母 一個 聲音：ch',g:'c＋h 不是 ㄎ＋ㄏ：ch ＝ 一個 聲音 ㄔ',w:'看到 ch 不 會 拆 開 唸',rows:[{s:'c.h',au:null,lab:'❌ 分開 唸'},{s:'ch',au:'s_ch',lab:'✅ ch ＝ 一個 聲音'},{s:'ch.i.n',au:'ch-ih-n'}],ask:'🤔 chin 有 4 個 字母，有 幾 個 聲音？',cap:'<b>ch ＝ 一個 聲音（ㄔ）</b>：chin 4 個 字母、<b>3 個 聲音</b>（一個 聲音 一個 點）',qz:'dig'},
 {k:'d_sh',t:'👯 兩個 字母 一個 聲音：sh',g:'s＋h 不是 ㄙ＋ㄏ：sh ＝ 一個 聲音 ㄕ',w:'看到 sh 不 會 拆 開 唸',rows:[{s:'s.h',au:null,lab:'❌ 分開 唸'},{s:'sh',au:'s_sh',lab:'✅ sh ＝ 一個 聲音'},{s:'sh.i.p',au:'sh-ih-p'}],ask:'🤔 ship 有 幾 個 聲音？',cap:'<b>sh ＝ 一個 聲音（ㄕ）</b>：ship 4 個 字母、<b>3 個 聲音</b>',qz:'dig'},
 {k:'d_th',t:'👯 兩個 字母 一個 聲音：th（不 震動）',g:'th ＝ 舌頭 輕輕 咬 住、吹 氣（喉嚨 不 震動）',w:'thin、three、bath 都 唸 得 對',rows:[{s:'t.h',au:null,lab:'❌ 分開 唸'},{s:'th',au:'s_th',lab:'✅ th ＝ 一個 聲音'},{s:'th.i.n',au:'bk_thin'}],ask:'🤔 唸 th 的 時候，舌頭 在 哪裡？',cap:'<b>th ＝ 一個 聲音</b>：舌頭 輕輕 放 在 上下 牙齒 中間，吹 氣',qz:'dig'},
 {k:'d_dh',t:'👯 兩個 字母 一個 聲音：th（震動）',g:'同 樣 是 th，this 的 th 喉嚨 會 震動',w:'this、that、the 都 唸 得 對',rows:[{s:'th',au:'s_th',lab:'不 震動（thin）'},{s:'th=dh',au:'s_dh',lab:'會 震動（this）'},{s:'th=dh.i.s',au:'dh-ih-s'}],ask:'🤔 把 手 放 在 喉嚨，兩個 th 有 什麼 不一樣？',cap:'th 有 兩種：thin <b>不 震動</b>、this <b>會 震動</b>（舌頭 位置 一樣）',qz:'dig'},
 {k:'d_ph',t:'👯 兩個 字母 一個 聲音：ph',g:'ph ＝ f 的 聲音（ㄈ）',w:'phone、photo 唸 得 出來',rows:[{s:'p.h',au:null,lab:'❌ 分開 唸'},{s:'ph',au:'s_f',lab:'✅ ph ＝ ㄈ'},{s:'ph.o!=oa.n.e~',au:'w_phone'}],ask:'🤔 ph 唸 起來 像 哪 一個 字母？',cap:'<b>ph ＝ f 的 聲音（ㄈ）</b>：phone 最後 的 e 不 唸（灰色）',qz:'dig'},
 {k:'d_ng',t:'👯 兩個 字母 一個 聲音：ng',g:'ng ＝ 一個 鼻音（ㄥ），在 字 的 最後',w:'ring、sing、king 唸 得 對',rows:[{s:'n.g',au:null,lab:'❌ 分開 唸'},{s:'ng',au:'s_ng',lab:'✅ ng ＝ 一個 聲音'},{s:'r.i.ng',au:'r-ih-ng'}],ask:'🤔 ring 有 幾 個 聲音？',cap:'<b>ng ＝ 一個 聲音（ㄥ）</b>：ring 4 個 字母、<b>3 個 聲音</b>',qz:'dig'},
 {k:'d_wh',t:'👯 兩個 字母 一個 聲音：wh',g:'wh ＝ w 的 聲音（ㄨ），h 不 發音（灰色）',w:'what、where、white、when 唸 得 對',rows:[{s:'wh',au:'s_w',lab:'✅ wh ＝ ㄨ'},{s:'wh.i.p',au:'w-ih-p'}],ask:'🤔 wh 的 h 有 聲音 嗎？',cap:'<b>wh ＝ ㄨ</b>：<b>h 是 灰色 ＝ 不 發音</b>',qz:'dig'},
 {k:'d_ck',t:'👯 兩個 字母 一個 聲音：ck',g:'ck ＝ 一個 k 的 聲音，c 不 發音（灰色）',w:'duck、back、kick 拼 得 對',rows:[{s:'ck',au:'s_k',lab:'✅ ck ＝ ㄎ'},{s:'d.u.ck',au:'d-uh-k'}],ask:'🤔 duck 有 4 個 字母，有 幾 個 聲音？',cap:'<b>ck ＝ 一個 聲音</b>：c 灰色（不 發音）、k 唸 ㄎ；短 母音 後面 常 寫 ck',qz:'dig'},
 {k:'bl1',t:'➕ 字首、字尾 多 一個 子音',g:'一個 方框 可以 放 好幾 個 聲音：bat ➜ blat ➜ blast',w:'長 的 字 也 不 怕',rows:[{s:'b.a.t',au:'b-ae-t'},{s:'bl.a.t',au:'bl-ae-t',fake:1},{s:'bl.a.st',au:'bl-ae-st'}],ask:'🤔 三個 字 都 是 幾 個 方框？聲音 一樣 多 嗎？',cap:'三個 都 是 <b>子 母 子</b>（三個 方框）：bat <b>3</b> 個 聲音、blat <b>4</b> 個、blast <b>5</b> 個',qz:'on'},
 {k:'bl2',t:'➕ 子音 一個 一個 加 上去',g:'song ➜ stong ➜ strong：字首 子音 一個 一個 加',w:'看到 str 也 唸 得 出來',rows:[{s:'s.o=ao.ng',au:'w_song'},{s:'st.o=ao.ng',au:'w_stong',fake:1},{s:'str.o=ao.ng',au:'bk_strong'}],ask:'🤔 strong 有 6 個 字母，有 幾 個 聲音？',cap:'都 是 <b>子 母 子</b>：song <b>3</b> 個 聲音、stong <b>4</b> 個、strong <b>5</b> 個（ng ＝ 一個 聲音）；<b>s 後面 的 t 唸 ㄉ</b>',qz:'on'},
 {k:'fin',t:'🔚 字尾 兩個 子音：不要 漏 掉',g:'ten ➜ tent、ben ➜ bend、cam ➜ camp：字尾 多 一個 子音',w:'拼字 不 漏 n、m（最 常 漏 的 地方）',rows:[{s:'t.e.n',au:'t-eh-n'},{s:'t.e.nt',au:'t-eh-nt'},{s:'c.a.m',au:'k-ae-m',fake:1},{s:'c.a.mp',au:'k-ae-mp'}],ask:'🤔 tent 的 最後，有 幾 個 子音 聲音？',cap:'tent、camp 的 字尾 有 <b>兩個 聲音</b>：n＋t、m＋p。<b>先 鼻子 哼 一下 n／m，再 唸 t／p</b>',qz:'co'},
 {k:'mag',t:'🪄 magic e：母音 唸 自己 的 名字',g:'cap ➜ cape、kit ➜ kite：最後 加 e，前面 的 母音 唸 名字，e 不 唸',w:'一 看 就 知道 母音 要 唸 長 的',rows:[{s:'c.a.p',au:'k-ae-p'},{s:'c.a!=ai.p.e~',au:'k-ai-p'},{s:'k.i.t',au:'k-ih-t'},{s:'k.i!=ii.t.e~',au:'k-ii-t'}],ask:'🤔 最後 的 e 有 聲音 嗎？它 讓 誰 改變 了？',cap:'magic e：<b>最後 的 e 不 唸（灰色）</b>，讓 前面 的 母音 唸 <b>自己 的 名字</b>（黃色：a ＝ ㄟ、i ＝ ㄞ）',qz:'magic'},
 {k:'team',t:'👫 兩個 母音 字母：第一個 唸 名字',g:'rain、day、seat、boat：第一個 母音 唸 名字（黃）、第二個 不 發音（灰）',w:'「兩個 母音 走路，第一個 說話」',rows:[{s:'r.ai!=ai.n',au:'w_rain'},{s:'d.ay!=ai',au:'w_day'},{s:'s.ea!=ee.t',au:'s-ee-t'},{s:'b.oa!=oa.t',au:'b-oa-t'}],ask:'🤔 rain 的 i 有 聲音 嗎？',cap:'<b>兩個 母音 字母 在 一起：第一個 唸 名字（黃）、第二個 不 發音（灰）</b>：ai ay ea oa',qz:'team'},
 {k:'oo',t:'🌙 oo：兩個 字母 一個 母音',g:'rom ➜ room：oo 兩個 字母 ＝ 一個 母音（ㄨ）',w:'room、moon、food 唸 得 對',rows:[{s:'r.o.m',au:'r-aa-m',fake:1},{s:'r.oo.m',au:'bk_room'}],ask:'🤔 room 的 oo 是 一個 聲音 還是 兩個？',cap:'<b>oo ＝ 一個 母音（ㄨ）</b>；字尾 <b>m 要 閉嘴</b>',qz:'count'},
 {k:'rr',t:'🔵 母音＋r：r 是 子音（藍）',g:'car、for、bird：母音 後面 的 r ＝ 藍色 子音（ㄦ）',w:'car、short、bird、turtle 唸 得 對',rows:[{s:'c.ar',au:'w_car'},{s:'f.or',au:'f-or'},{s:'b.ir.d',au:'b-er-d'}],ask:'🤔 car 的 r 是 子音 還是 母音？',cap:'<b>母音 後面 的 r ＝ 子音（藍色，ㄦ）</b>：car ㄎ ㄚ ㄦ、for ㄈ ㄛ ㄦ',qz:'count'},
 {k:'tin',t:'🔁 只 換 一個 地方：t ➜ th',g:'tin ➜ thin：只 換 了 字首（t ➜ th）',w:'會 比較，就 不 會 唸 錯',rows:[{s:'t.i.n',au:'t-ih-n'},{s:'th.i.n',au:'bk_thin'}],ask:'🤔 tin 和 thin 哪裡 不一樣？',cap:'tin ➜ thin：只 換 了 字首（t ➜ th），還是 <b>子 母 子</b>、3 個 聲音',qz:'part'},
 {k:'all',t:'🔁 只 換 字首：all 家族',g:'ball ➜ tall ➜ fall：all 一樣，只 換 第一個 方框',w:'看到 all 就 會 唸 ㄛ（嘴巴 大大 張開）',rows:[{s:'b.a=ao.ll',au:'w_ball'},{s:'t.a=ao.ll',au:'bk_tall'},{s:'f.a=ao.ll',au:'w_fall'}],ask:'🤔 三個 字 哪 一個 方框 不一樣？',cap:'ball ➜ tall ➜ fall：<b>all</b> 一樣（a ＝ ㄛ，嘴巴 大大 張開；ll ＝ 一個 聲音），只 換 第一個 方框',qz:'part'},
 {k:'sh2',t:'🔁 一個 一個 換：sot ➜ shomp',g:'sot ➜ shot ➜ short ➜ shorm ➜ shomp：每 次 只 換 一個 方框',w:'自己 會 拼 新 的 字',rows:[{s:'s.o.t',au:'s-aa-t',fake:1},{s:'sh.o.t',au:'sh-aa-t'},{s:'sh.or.t',au:'bk_short'},{s:'sh.or.m',au:'sh-or-m',fake:1},{s:'sh.o.mp',au:'sh-aa-mp',fake:1}],ask:'🤔 short 的 r 是 什麼 顏色？為什麼？',cap:'每 次 只 換 一個 方框；<b>short 的 r ＝ 藍色 子音</b>；shomp 的 m、p 各 一個 聲音',qz:'part'},
 {k:'syl',t:'🪜 兩個 紅框 ＝ 兩個 音節',g:'bathroom ＝ bath＋room：數 紅框（母音），就 知道 有 幾 個 音節',w:'長 的 課本 字 一塊 一塊 唸',rows:[{s:'b.a.th',au:'b-ae-th'},{s:'r.oo.m',au:'bk_room'},{s:'b.a.th|r.oo.m',au:'bk_bathroom',st:0}],ask:'🤔 bathroom 有 幾 個 紅框？所以 有 幾 個 音節？',cap:'bathroom ＝ bath＋room：<b>2 個 紅框（母音）＝ 2 個 音節</b>',qz:'syl'},
 {k:'baby',t:'🪜 ba ➜ baby：子 母｜子 母',g:'baby ＝ ba＋by：兩個 音節，y 在 最後 ＝ 母音「一」',w:'課本 的 兩 音節 字 都 拆 得 開',rows:[{s:'b.a!=ai',au:'w_c55_ba'},{s:'b.a!=ai|b.y',au:'w_c55_baby',st:0}],ask:'🤔 baby 的 a 唸 什麼？為什麼 是 黃色？',cap:'baby ＝ ba＋by：<b>子 母｜子 母</b>；a 唸 名字（ㄟ）＝ 黃色，y 在 最後 ＝ 母音「一」',qz:'syl',more:1},
 {k:'many1',t:'🎨 一個 字母，很多 聲音',g:'同 一個 a：cat ㄚㄝ、cake ㄟ、ball ㄛ、car ㄚ',w:'看 後面 的 字母，就 知道 a 唸 什麼',rows:[{s:'c.a.t',au:'bk_cat'},{s:'c.a!=ai.k.e~',au:'w_cake'},{s:'b.a=ao.ll',au:'w_ball'},{s:'c.ar',au:'w_car'}],ask:'🤔 四個 a 的 聲音 一樣 嗎？是 誰 決定 的？',cap:'同 一個 <b>a</b>：cat ㄚㄝ、cake ㄟ（e 不 唸）、ball ㄛ、car ㄚ＋r ➜ <b>看 後面 的 字母 決定</b>',qz:'many'},
 {k:'many2',t:'🎨 一個 聲音，很多 拼法',g:'同 一個 ㄟ：cake（a_e）、rain（ai）、day（ay 在 最後）',w:'聽到 ㄟ，知道 可能 怎麼 拼',rows:[{s:'c.a!=ai.k.e~',au:'w_cake'},{s:'r.ai!=ai.n',au:'w_rain'},{s:'d.ay!=ai',au:'w_day'}],ask:'🤔 三個 字 的 ㄟ 寫法 一樣 嗎？day 的 ay 在 哪裡？',cap:'同 一個 聲音 <b>ㄟ</b>：a_e（cake）、ai（rain，在 中間）、ay（day，<b>在 最後</b>）',qz:'team'},
 {k:'sum',t:'🏆 總 整理：你 會 自己 拼 新 的 字 了',g:'看字 讀音 3 步、聽音 拼字 3 步',w:'以後 看到 新 的 字，自己 唸 得 出來、拼 得 出來',rows:[{s:'sh.i.p',au:'sh-ih-p'},{s:'c.a!=ai.k.e~',au:'w_cake'},{s:'b.a.th|r.oo.m',au:'bk_bathroom'}],ask:'🤔 看到 一個 新 的 字，第一步 先 找 什麼？',cap:'👀 看字 讀音：① 找 <span class="vb">母音</span> ② 一個 方框 一個 方框 唸 ③ 合 起來<br>🎧 聽音 拼字：① 數 聲音 ② 每 個 聲音 寫 字母 ③ 唸 一次 檢查',qz:'mix'}];
/* ⑧ baby 的〔➕ 再 看 5 個〕：何嘉仁 Super Fun 課本 的 兩 音節 字（老師 的 簡報 裡 有 的；字母 少、結構 簡單），音節 照「一個 子音 聲 往 後 搬」*/
const MORE2=[['s.e|v.e=ah.n','w_c57_seven','seven','七'],['l.e|tt.er','w_c57_letter','letter','信'],['d.o.c|t.or','w_c57_doctor','doctor','醫生'],['n.u.m|b.er','w_c57_number','number','數字'],['s.i.s|t.er','w_c57_sister','sister','姊妹'],['f.ar|m.er','w_c57_farmer','farmer','農夫']].map(x=>({s:x[0],au:x[1],w:x[2],zh:x[3]}));
/* ══ 老師 4-11：每 個 課本 單字 字卡〔🎬 秒懂 動畫〕＝ 從 CVC 一步 一步 變成 課本 字（map.html#chain=<字>，用 同 一套 動畫）══ */
const CHAIN={cat:[['b.a.t','b-ae-t'],['c.a.t','bk_cat']],dog:[['d.o.t','d-aa-t'],['d.o.g','bk_dog']],sad:[['s.a.t','s-ae-t'],['s.a.d','bk_sad']],not:[['h.o.t','h-aa-t'],['n.o.t','bk_not']],
  yes:[['y.e.t','y-eh-t'],['y.e.s','bk_yes']],fish:[['f.i.t','f-ih-t'],['f.i.sh','bk_fish']],thin:[['t.i.n','t-ih-n'],['th.i.n','bk_thin']],he:[['h.e.n','h-eh-n'],['h.e!=ee','bk_he']],
  she:[['h.e!=ee','bk_he'],['sh.e!=ee','bk_she']],no:[['n.o.t','bk_not'],['n.o!=oa','bk_no']],room:[['r.o.m','r-aa-m'],['r.oo.m','bk_room']],
  bedroom:[['b.e.d','b-eh-d'],['r.oo.m','bk_room'],['b.e.d|r.oo.m','bk_bedroom']],bathroom:[['b.a.t','b-ae-t'],['b.a.th','b-ae-th'],['b.a.th|r.oo.m','bk_bathroom']],
  rabbit:[['r.a.b','r-ae-b'],['b.i.t','b-ih-t'],['r.a|bb.i.t','bk_rabbit']],kitchen:[['k.i.t','k-ih-t'],['k.i|tch.e=ah.n','bk_kitchen']],
  dining:[['d.i!=ii.n.e~','d-ii-n'],['d.i!=ii|n.i.ng','bk_dining']],living:[['l.i.t','l-ih-t'],['l.i|v.i.ng','bk_living']],
  where:[['w.e.t','w-eh-t'],['wh.e=eh.r=rr.e~','bk_where']],bird:[['b.i.d','b-ih-d'],['b.ir.d','bk_bird']],turtle:[['t.u.b','t-uh-b'],['t.ur|t.le=el','bk_turtle']],
  strong:[['s.o=ao.ng','w_song'],['st.o=ao.ng','w_stong',1],['str.o=ao.ng','bk_strong']],short:[['sh.o.t','sh-aa-t'],['sh.or.t','bk_short']],tall:[['b.a=ao.ll','w_ball'],['t.a=ao.ll','bk_tall']],
  tired:[['t.i.n','t-ih-n'],['t.i!=ii.r=rr.e~.d','bk_tired']],angry:[['a.n.t','0-ae-nt'],['a.n|gr.y','bk_angry']],happy:[['h.a.p','h-ae-p'],['h.a|pp.y','bk_happy']]};
CHAIN['dining room']=CHAIN.dining;CHAIN['living room']=CHAIN.living;
function chainScene(w){const C=CHAIN[w];if(!C)return null;return {k:'chain',t:'🎬 從 CVC 到 課本：'+w,g:C.map(r=>r[0].replace(/[.|]|!?=[a-z0-9]+|~/g,'')).join(' ➜ ')+'：每 次 只 加 一點點',w:'用 你 已經 會 的 CVC，一步 一步 變成 課本 的 字',
  rows:C.map(r=>({s:r[0],au:r[1],fake:r[2]})),ask:'🤔 從 上 一行 到 下 一行，改變 了 哪裡？',cap:'<b>'+w+'</b>：從 '+C[0][0].replace(/[.|]|!?=[a-z0-9]+|~/g,'')+' 一步 一步 變 過來 ➜ 每 一步 只 改 一個 地方',qz:'spell'}}
let SCI=LS.g('sci2',0),STR=false,SMODE=LS.g('smode','step'),THINK=false;if(SCI>=SC.length)SCI=0;
const qs=(r,s)=>r.querySelector(s),qsa=(r,s)=>[].slice.call(r.querySelectorAll(s));
function scList(){$('#scList').innerHTML=SC.map((s,i)=>'<button data-sc="'+i+'" class="'+(i===SCI?'on':'')+(LS.g('scs2',[]).indexOf(i)>=0?' seen':'')+'">'+(i+1)+'</button>').join('')}
function idxDraw(){const sn=LS.g('scs2',[]);$('#scIdx').innerHTML='<div class="idxp"><h2 class="st">📑 目次（點 一下 ＝ 馬上 到 那 一段）</h2><div class="idxg">'+SC.map((s,i)=>'<button data-sc="'+i+'" class="'+(i===SCI?'on':'')+'"><b>'+(i+1)+'</b> '+s.t+(sn.indexOf(i)>=0?' <i>✔</i>':'')+'</button>').join('')+'</div><div class="ctl"><button class="btn" id="idxX">✖ 關 起來</button></div></div>';$('#scIdx').hidden=false;$('#idxX').onclick=()=>$('#scIdx').hidden=true}
/* 開始 卡：🎯／💪＋三種 播法 */
function scCard(i){SCI=i;LS.s('sci2',i);TOK++;scList();const S=SC[i];$('#scIdx').hidden=true;
  $('#stage').className='pnl';$('#stage').innerHTML='<div class="scard"><div class="sno">第 '+(i+1)+' ／ '+SC.length+' 段</div><h2 class="st">'+S.t+'</h2><div class="goal">🎯 學 什麼：<b>'+S.g+'</b></div><div class="why">💪 對 英文 有 什麼 幫助：'+S.w+'</div>'+
    '<div class="ctl big"><button class="btn go" data-pm="step">▶ 逐次 播放</button><button class="btn" data-pm="all">👀 全部 展示</button><button class="btn gold" data-pm="think">🤔 引導 思考</button></div><div class="hint">▶ 逐次 播放 ＝ 一步 一步 演（約 1 分鐘）　👀 全部 展示 ＝ 整頁 一次 出來　🤔 引導 思考 ＝ 每 一步 先 想、點 了 才 公布（比較 久、學得 更 深）</div></div>'}
async function scPlay(i,mode,root){root=root||$('#stage');const inGame=root!==$('#stage');if(!inGame){SCI=i;LS.s('sci2',i);scList()}const me=++TOK,S=SC[i];mode=mode||SMODE;THINK=mode==='think';const ALL=mode==='all';PAUSED=false;if($('#aPause'))$('#aPause').textContent='⏸️ 暫停';
  root.className='pnl n'+S.rows.length;root.innerHTML='<div class="shead"><h2 class="st">'+S.t+'</h2><div class="goal sm">🎯 '+S.g+'</div></div><div class="rows">'+S.rows.map((r,ri)=>'<div class="rw'+(ri?'':' r0')+'"><div class="wrow'+(STR?' stress':'')+(r.au?'':' noau')+'" data-r="'+ri+'">'+wordHTML(r.s,{lab:ri===0,hide:!ALL,hideT:!ALL,dots:ALL,st:STR?r.st:null})+'</div><div class="rsd">'+(r.fake?'<span class="mtag p">🔮 練習 用 的 假字</span>':r.lab?'<span class="mtag w">'+r.lab+'</span>':'')+'<div class="sum" data-sum="'+ri+'"></div></div></div>').join('')+'</div>'+
    (S.more?'<div class="ctl"><button class="btn gold" id="more2">➕ 再 看 '+MORE2.length+' 個 課本 的 兩 音節 字</button></div><div id="more2w"></div>':'')+'<div class="think" hidden></div><div class="cap"></div>'+(inGame?'':'<div class="ctl qzrow" hidden><button class="btn gold" data-qz="'+i+'">📝 隨堂 測驗（3 題）</button><button class="btn" data-next="1">下一段 ▶</button></div>');
  const cap=qs(root,'.cap'),rowsOf=()=>S.rows;if(S.more)qs(root,'#more2').onclick=()=>more2(root);
  const sum=(ri,r)=>{const C=countOf(r.s);qs(root,'[data-sum="'+ri+'"]').innerHTML=patTxt(r.s)+'：'+C.b+' 個 方框、<b>'+C.n+' 個 聲音</b>'+(C.v>1?'、'+C.v+' 個 紅框 ＝ '+C.v+' 個 音節':'')};
  if(ALL){rowsOf().forEach((r,ri)=>{sum(ri,r);if(r.dim)qs(root,'.wrow[data-r="'+ri+'"]').style.opacity=.6});cap.innerHTML=S.cap;scDone(i,root,inGame);return}
  for(let ri=0;ri<S.rows.length;ri++){if(me!==TOK)return;const r=S.rows[ri],row=qs(root,'.wrow[data-r="'+ri+'"]'),bx=qsa(row,'.bx'),all=[];parse(r.s).forEach(B=>B.forEach(b=>all.push(b)));
    /* (1) 方框＋字母 一個 一個 出來（引導 思考：先 不 出 聲，學生 自己 先 唸）*/
    if(THINK){bx.forEach(e=>e.classList.remove('hid'));if(!await think(root,ri===0?'🤔 先 自己 唸唸 看：每 一個 字母 是 什麼 聲音？':'🤔 跟 上面 比，哪裡 不一樣？先 自己 唸 唸 看',me))return}
    for(let bi=0;bi<bx.length;bi++){if(me!==TOK)return;const el=bx[bi],b=all[bi];el.classList.remove('hid');const cks=qsa(el,'.ck');
      for(let ci=0;ci<b.ch.length;ci++){const c=b.ch[ci],a=c.au||auOf(c.t,b.coda);if(!a||c.sil){await wait(300);continue}cks[ci].classList.add('on');await sayW(a,me);cks[ci].classList.remove('on')}}
    /* (2) 合 起來 唸（〔1️⃣ 單字 唸 一次〕＝ 這裡 不 唸，最後 才 唸）*/
    if(r.au&&!ONE){if(THINK&&!await think(root,'🤔 合 起來 怎麼 唸？',me))return;row.querySelectorAll('.bx').forEach(e=>e.classList.add('say'));await sayW(r.au,me);row.querySelectorAll('.bx').forEach(e=>e.classList.remove('say'))}
    /* (3) 字母 正下方 一個 一個 出現 音標＋唸，再 合 起來 */
    if(!r.s.startsWith('[')){for(let bi=0;bi<bx.length;bi++){const b=all[bi];const cks=qsa(bx[bi],'.ck');for(let ci=0;ci<b.ch.length;ci++){if(me!==TOK)return;const c=b.ch[ci],tl=qs(cks[ci],'.tl[data-t]');if(tl){tl.classList.remove('hide');tl.classList.add('on')}const a=auOf(c.t,b.coda);if(a&&!c.sil)await sayW(a,me);else await wait(300);if(tl)tl.classList.remove('on')}}
      if(r.au){row.querySelectorAll('.bx').forEach(e=>e.classList.add('say'));await sayW(r.au,me);row.querySelectorAll('.bx').forEach(e=>e.classList.remove('say'))}}
    else if(r.au&&ONE){row.querySelectorAll('.bx').forEach(e=>e.classList.add('say'));await sayW(r.au,me);row.querySelectorAll('.bx').forEach(e=>e.classList.remove('say'))}
    /* (4) 數 聲音：每 個 字母 下面 的 點 一個 一個 亮 */
    if(THINK&&!await think(root,'🤔 數 一 數：有 幾 個 聲音？（不 發音 的 灰色 字母 不 算）',me))return;
    for(const d of row.querySelectorAll('.dt i')){if(me!==TOK)return;d.classList.add('on');await wait(260)}
    sum(ri,r);if(r.dim)row.style.opacity=.6;await wait(400)}
  if(me!==TOK)return;if(THINK&&S.ask&&!await think(root,S.ask,me))return;cap.innerHTML=S.cap;scDone(i,root,inGame)}
function scDone(i,root,inGame){if(inGame)return;const sn=LS.g('scs2',[]);if(sn.indexOf(i)<0){sn.push(i);LS.s('scs2',sn)}scList();const q=qs(root,'.qzrow');if(q)q.hidden=false}
/* 🤔 引導 思考：問題 出來 ➜ 停 住 ➜ 老師／學生 點〔👉 公布 答案〕才 往 下 */
function think(root,q,me){return new Promise(res=>{if(FAST&&!window.__PHTHINK){res(me===TOK);return}const t=qs(root,'.think');t.hidden=false;t.innerHTML='<div class="tq">'+q+'</div><button class="btn gold" id="thGo">👉 公布 答案</button>';
  const go=()=>{t.hidden=true;res(me===TOK)};qs(t,'#thGo').onclick=go;if(window.__PHTHINK)setTimeout(go,30)})}
async function more2(root){const w=qs(root,'#more2w');w.innerHTML='<div class="rows">'+MORE2.map((r,ri)=>'<div class="rw"><div class="wrow" data-m="'+ri+'">'+wordHTML(r.s,{lab:1,dots:1})+'<span class="cap mz2">'+r.w+'＝'+r.zh+'　🔊</span></div><div class="sum">'+patTxt(r.s)+'：'+countOf(r.s).n+' 個 聲音、2 個 音節</div></div>').join('')+'</div>';
  const me=++TOK;for(let ri=0;ri<MORE2.length;ri++){const row=qs(w,'[data-m="'+ri+'"]');row.querySelectorAll('.syl').forEach(s=>s.classList.add('hot'));await sayW(MORE2[ri].au,me);row.querySelectorAll('.syl').forEach(s=>s.classList.remove('hot'));if(me!==TOK)return}}
/* ══ 📝 隨堂 測驗：每 段 3 題（每 次 不同）；錯題 回饋 ＝ 遊戲 的 綠底 答錯頁（noPage／okPage）══ */
const ZYQ=[['ㄅ','b'],['ㄆ','p'],['ㄇ','m'],['ㄈ','f'],['ㄉ','d'],['ㄊ','t'],['ㄋ','n'],['ㄌ','l'],['ㄍ','g'],['ㄎ','k'],['ㄏ','h'],['ㄙ','s']];
const QZK={zy:'聽 ➜ 這個 注音 跟 哪 一個 英文 字母 同 一個 聲音？',spell:'🔊 聽 ➜ 選 對 的 拼法',count:'🔊 聽 ➜ 這個 字 有 幾 個 聲音？',part:'🔊 聽 ➜ 選 對 的 字（只 差 一個 方框）',dig:'🔊 聽 ➜ 哪 兩個 字母 是 一個 聲音？',on:'🔊 聽 ➜ 字首 是 哪 一組？',co:'🔊 聽 ➜ 字尾 是 哪 一組？',magic:'🔊 聽 ➜ 有 沒有 magic e？選 對 的 字',team:'🔊 聽 ➜ 選 對 的 母音 拼法',syl:'🔊 聽 ➜ 有 幾 個 音節？',many:'🔊 聽 ➜ 這個 a 唸 什麼？',mix:''};
function qzMake(kind){const P=f=>QW.filter(f),sp=x=>specOf(x),one=x=>({spec:sp(x),au:x.c,w:x.w,x});
  if(kind==='mix')kind=R(['spell','count','part','on','co','team']);
  if(kind==='zy'){const z=R(ZYQ),O=SH([z[1]].concat(SH(ZYQ.filter(y=>y!==z).map(y=>y[1])).slice(0,2)));return {k:kind,q:'聽 ➜ <b class="zyb">'+z[0]+'</b> 跟 哪 一個 英文 字母 同 一個 聲音？',au:'s_'+z[1],O,ans:z[1],info:{spec:z[1],au:'s_'+z[1],w:z[1],tip:'<b>'+z[0]+' ＝ '+z[1]+'</b>（同 一個 聲音）'}}}
  if(kind==='count'){const x=R(P(y=>y.n>=3&&y.n<=5)),O=SH([x.n,x.n-1,x.n+1].map(String));return {k:kind,q:QZK.count,au:x.c,O,ans:String(x.n),info:Object.assign(one(x),{tip:x.w+'：'+x.n+' 個 聲音（一個 聲音 一個 點）'})}}
  if(kind==='syl'){const s=R(SYLW),O=['1','2','3'];return {k:kind,q:QZK.syl,au:AV.has('bk_'+s[0])?'bk_'+s[0]:'w_c55_baby',O,ans:'2',info:{spec:SPECS[s[0]],au:AV.has('bk_'+s[0])?'bk_'+s[0]:'w_c55_baby',w:s[0],tip:s[0]+' ＝ '+s[1].join(' ＋ ')+'：2 個 紅框 ＝ <b>2 個 音節</b>'}}}
  if(kind==='many'){const M=[['bk_cat','c.a.t','ㄚㄝ'],['w_cake','c.a!=ai.k.e~','ㄟ'],['w_ball','b.a=ao.ll','ㄛ'],['w_car','c.ar','ㄚ']],m=R(M);return {k:kind,q:QZK.many,au:m[0],O:SH(M.map(y=>y[2])),ans:m[2],show:m[1],info:{spec:m[1],au:m[0],w:m[1].replace(/[.!=~|]|ai|ao/g,'').replace(/=?/g,''),tip:'這個 a 唸 <b>'+m[2]+'</b>：看 後面 的 字母 決定'}}}
  const F={spell:y=>!y.long&&y.n===3,part:y=>!y.long&&y.n<=4,dig:y=>/^(sh|ch|th|wh)$/.test(y.on.join(''))||/^(sh|ch|th|ng|ck)$/.test(y.co.join('')),on:y=>y.on.join('').length>=2&&!/^(sh|ch|th|wh|qu)$/.test(y.on.join('')),co:y=>y.co.length>=2&&!/^(sh|ch|th|ng|ck|ll|ss|ff|zz)$/.test(y.co.join('')),magic:y=>y.mg,team:y=>y.long&&!y.mg&&y.v!=='oo'}[kind]||(()=>true);
  const x=R(P(F)),info=Object.assign(one(x));
  if(kind==='dig'){const d=(/^(sh|ch|th|wh)$/.test(x.on.join(''))?x.on:x.co).join(''),O=SH([d].concat(SH(['sh','ch','th','ng','ck','wh'].filter(y=>y!==d)).slice(0,2)));info.tip='<b>'+d+'</b> ＝ 兩個 字母、一個 聲音';return {k:kind,q:QZK.dig,au:x.c,O,ans:d,info}}
  if(kind==='on'||kind==='co'){const v=(kind==='on'?x.on:x.co).join(''),all=[...new Set(QW.map(y=>(kind==='on'?y.on:y.co).join('')).filter(z=>z.length>=2))],O=SH([v].concat(SH(all.filter(z=>z!==v&&z[0]===v[0]).concat(SH(all.filter(z=>z!==v&&z[0]!==v[0])))).slice(0,2)));info.tip=(kind==='on'?'字首':'字尾')+' ＝ <b>'+v+'</b>（'+v.length+' 個 聲音，一個 一個 聽）';return {k:kind,q:QZK[kind],au:x.c,O,ans:v,info}}
  let ws=[x].concat(kind==='magic'?QW.filter(y=>y!==x&&y.on.join('')===x.on.join('')&&y.co.join('')===x.co.join('')&&!y.mg&&!y.long).slice(0,1):[],near(x,kind==='team'?'v':R(['on','v','co']),3));ws=[...new Map(ws.map(y=>[y.w,y])).values()].slice(0,3);while(ws.length<3){const y=R(QW);if(ws.every(z=>z.w!==y.w))ws.push(y)}
  info.tip=kind==='magic'?(x.mg?'最後 有 <b>e</b>（不 唸），前面 的 母音 唸 名字':'沒有 magic e，母音 唸 短 的'):'聽 每 一個 聲音：'+patTxt(sp(x));return {k:kind,q:QZK[kind]||QZK.spell,au:x.c,O:SH(ws.map(y=>y.w)),ans:x.w,info,byW:ws}}
async function qzStart(i){const S=SC[i];if(typeof G!=='undefined')G=null;TOK++;$('#game').hidden=false;$('#gq').textContent='';$('#gt').textContent='📝 隨堂 測驗：'+S.t;$('#gsc').textContent='';$('#gtm').firstChild.style.transform='scaleX(1)';
  const Q=[],seen=new Set();for(let t=0;t<40&&Q.length<3;t++){const q=qzMake(S.qz);if(q&&!seen.has(q.au+q.ans)){seen.add(q.au+q.ans);Q.push(q)}}
  let ok=0;const wr=[];for(let k=0;k<Q.length;k++){const q=Q[k];$('#gq').textContent='第 '+(k+1)+' ／ '+Q.length+' 題';
    const r=await new Promise(res=>{B2().innerHTML='<div class="gq">'+q.q+'</div>'+(q.show?'<div class="wrow">'+wordHTML(q.show,{dots:0,hideT:1})+'</div>':'')+'<div class="opts">'+q.O.map(o=>'<button class="op'+(/^[㄀-ㄯ一-鿿]/.test(o)?' zh':'')+'" data-o="'+o+'">'+o+'</button>').join('')+'</div>';
      const ear=H('button','ear','🔊 再 聽 一次');ear.onclick=()=>say(q.au);B2().appendChild(ear);say(q.au);
      B2().querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const y=b.dataset.o===q.ans;b.classList.add(y?'ok':'no');res({y,o:b.dataset.o})});if(window.__PHQZ)setTimeout(()=>{const b=[].find.call(B2().querySelectorAll('[data-o]'),b=>(b.dataset.o===q.ans)===(window.__PHQZ==='ok'));if(b)b.click()},20)});
    if(r.y){ok++;await okPage(q.info)}else{wr.push(q);await noPage(Object.assign({},q.info,{yours:r.o}))}}
  B2().innerHTML='<div class="pnl" style="padding:18px 26px;text-align:center;max-width:900px"><div class="res2">'+ok+' ／ '+Q.length+'</div><div class="cap">'+(ok===Q.length?'🎉 全部 答對！這 一段 你 學會 了':'💪 再 看 一次 動畫，答錯 的 地方 就 會 了')+'</div>'+
    (wr.length?'<div class="cap">📒 答錯 的：</div>'+wr.map(q=>'<div class="wrow" data-wa="'+q.info.au+'">'+wordHTML(q.info.spec,{dots:1})+'</div>').join(''):'')+'<div class="ctl"><button class="btn gold" id="qzAgain">🔁 再 測 一次（題目 不一樣）</button><button class="btn" id="qzBack">🎬 回 動畫</button><button class="btn go" id="qzNext">下一段 ▶</button></div></div>';
  B2().querySelectorAll('[data-wa]').forEach(r=>r.onclick=()=>say(r.dataset.wa));for(const r of B2().querySelectorAll('[data-wa]')){await say(r.dataset.wa);await wait(300)}
  $('#qzAgain').onclick=()=>qzStart(i);$('#qzBack').onclick=()=>{$('#game').hidden=true;scCard(i)};$('#qzNext').onclick=()=>{$('#game').hidden=true;scCard(Math.min(SC.length-1,i+1))};
  if(window.__PHQZDONE)window.__PHQZDONE.push({i,ok,n:Q.length})}
const B2=()=>$('#gbody');
document.addEventListener('click',e=>{const s=e.target.closest('[data-sc]');if(s){scCard(+s.dataset.sc);return}
  const pm=e.target.closest('[data-pm]');if(pm){SMODE=pm.dataset.pm==='think'?SMODE:pm.dataset.pm;if(pm.dataset.pm!=='think')LS.s('smode',SMODE);modeBtn();scPlay(SCI,pm.dataset.pm);return}
  const qz=e.target.closest('[data-qz]');if(qz){qzStart(+qz.dataset.qz);return}const nx=e.target.closest('[data-next]');if(nx){scCard(Math.min(SC.length-1,SCI+1));return}
  /* 點 字母／注音／音標 ＝ 聽＋放大＋發亮（老師 第五十七次 4-4：以後 全部 字卡 都 這樣）*/
  const ck=e.target.closest('#s_ani .ck,#mapOut .ck,#sylOut .ck,#manyOut .ck,#more2w .ck,#fb .ck,#gbody .ck,#m2w .ck');if(ck){const tl=ck.querySelector('.tl[data-t]'),a=ck.dataset.zy||(tl&&auOf(tl.dataset.t,tl.dataset.cd==='1'));if(a&&!ck.classList.contains('sil')){ck.classList.add('on');say(a).then(()=>ck.classList.remove('on'))}return}
  const w=e.target.closest('[data-m]');if(w&&w.closest('#more2w')){say(MORE2[+w.dataset.m].au)}});
$('#aPrev').onclick=()=>scCard(Math.max(0,SCI-1));$('#aNext').onclick=()=>scCard(Math.min(SC.length-1,SCI+1));$('#aAgain').onclick=()=>scPlay(SCI,SMODE);$('#aIdx').onclick=idxDraw;
$('#aPause').onclick=()=>{PAUSED=!PAUSED;$('#aPause').textContent=PAUSED?'▶️ 繼續':'⏸️ 暫停';$('#aPause').classList.toggle('on',PAUSED);if(PAUSED)AU.pause()};
$('#aSlow').onclick=()=>{SLOW=SLOW>1?1:1.6;$('#aSlow').classList.toggle('on',SLOW>1)};
$('#aOne').onclick=()=>{ONE=ONE?0:1;LS.s('one',ONE);modeBtn()};
$('#aStep').onclick=()=>{SMODE='step';LS.s('smode',SMODE);modeBtn();scPlay(SCI,'step')};$('#aAll').onclick=()=>{SMODE='all';LS.s('smode',SMODE);modeBtn();scPlay(SCI,'all')};$('#aThink').onclick=()=>scPlay(SCI,'think');
$('#aQz').onclick=()=>qzStart(SCI);
function modeBtn(){$('#aOne').classList.toggle('on',!!ONE);$('#aOne').textContent=ONE?'1️⃣ 單字 唸 一次：開':'1️⃣ 單字 唸 一次：關';$('#aStep').classList.toggle('on',SMODE==='step');$('#aAll').classList.toggle('on',SMODE==='all')}
function strBtn(){['#aStress','#sStress'].forEach(id=>{const b=$(id);b.textContent='🎵 重音：'+(STR?'開':'關');b.classList.toggle('on',STR)})}
$('#aStress').onclick=()=>{STR=!STR;strBtn();scPlay(SCI,SMODE)};
/* ══ ② 🗺️ 拼音 地圖（第五十七次 老師 4-20）══
 * 清單＋規則 ＝ _map_combos.js（MAPC）；點 一顆 ＝ 只 換 那 一個 地方（字首／母音／字尾），其他 不 動；不合 拼字 習慣 的 ＝ 暗＋說 為什麼（不 自動 改 別的 地方）
 * 新 字尾 pt ct xt lp lf lt sp mb ld lk nch 可以 自由 組合（不再 是 固定 的 例字）；ch 就 是 ch、tch 另外 一顆；全部 組合 都 有 聲音（tools/ph_gen57.py）*/
const XBS=new Set(typeof XBAD!=='undefined'?XBAD:[]),BDS=new Set(typeof BADC!=='undefined'?BADC:[]),MAPC=window.MAPC,ON=MAPC.ON,VV=MAPC.VV,CO=MAPC.CO;
let MLV=LS.g('mlv','b'),MS=LS.g('ms2',{o:'b',v:'a',c:'t'}),MG={o:LS.g('mgo','b'),c:LS.g('mgc','b')};
const VNM={a:'a',e:'e',i:'i',o:'o',u:'u',a_e:'a_e',i_e:'i_e',o_e:'o_e',u_e:'u_e',ai:'ai',ay:'ay',ee:'ee',ea:'ea',oa:'oa',ow:'ow',ou:'ou',ow2:'ow',oi:'oi',oy:'oy',au:'au',aw:'aw',oo:'oo',ar:'ar',or:'or',er:'er',ir:'ir',ur:'ur'};
const VSUB={ow:'ㄡ',ow2:'ㄠ',au:'ㄛ',aw:'ㄛ',oo:'ㄨ',ou:'ㄠ',oi:'ㄛ一',oy:'ㄛ一'};
function codeOf(o,v,c){return MAPC.code(o,v,c)}function spellOf(o,v,c){return MAPC.spell(o,v,c)}
/* 拼字 ➜ 方框 的 寫法 */
function specOfMap(o,v,c){const sh=VV.b.indexOf(v)>=0,cc=c==='無'?'':c;let cs=cc;if(sh){if(cc==='k')cs='ck';else if(/^[lsfz]$/.test(cc))cs=cc+cc}
  const vc=MAPC.VC[v],vs=v==='ow2'?'ow':v;let vp;
  if(/_e$/.test(v))vp=v[0]+'!='+(codeOf(o,v,c).split('-')[1]);else if(sh)vp=v;else if(v==='ow2')vp='ow='+vc;else if(TEAM2[vs])vp=vs+'!='+vc;else if(RV[vs])vp=vs;else vp=vs+'='+vc;
  return (o?o+'.':'')+vp+(cs?'.'+cs:'')+(/_e$/.test(v)?'.e~':'')}
function why(o,v,c){if(MAPC.ok(o,v,c))return '';const sh=VV.b.indexOf(v)>=0;
  if(sh&&c==='無')return '短 母音 後面 一定 要 有 字尾（例：ca ➜ cat）';if(sh&&(c==='ld'||c==='lk'))return 'a、o 後面 接 ld、lk 母音 會 變（old、talk）';if(sh&&c==='mb')return 'mb 只 跟 a、i、u（lamb、limb、thumb）';
  if(v==='ay'||v==='ow'||v==='oy'||v==='aw')return v+' 通常 在 字 的 最後（day、snow、boy、saw）';if(/_e$/.test(v))return 'magic e 後面 只 放 一個 子音（b d k l m n p t）';
  return '英文 很少 這樣 拼'}
function chipHTML(lab,list,k,tag){return '<div class="mg">'+lab+'</div><div class="chips">'+list.map(x=>{const t=Object.assign({},MS);t[k]=x;const ok=MAPC.ok(t.o,t.v,t.c);
  return '<button class="chip en'+(MS[k]===x?' on':'')+(ok?'':' dim')+'" data-mk="'+k+'" data-mv="'+x+'">'+(k==='v'?VNM[x]:x)+(k==='v'&&VSUB[x]?'<small>'+VSUB[x]+'</small>':tag?'<small>'+(x==='ld'||x==='lk'?'⚠ old talk':'新')+'</small>':'')+'</button>'}).join('')+'</div>'}
const OG=[['b','一個 子音（sh ch th wh ＝ 兩個 字母 一個 聲音；wh 的 h 不 發音；qu ＝ 2 個 聲音）',ON.b],['a2','兩個 子音（2 個 聲音）',ON.a2],['a3','三個 子音（3 個 聲音）',ON.a3]];
const VG=[['b','短 母音（紅）',VV.b],['a','唸 名字 的 母音（黃）：magic e、兩個 母音 字母（第二個 灰）',VV.a],['t','其他 母音 組合：兩個 一起 唸（紅）、母音＋r（r 藍）',VV.t]];
const CG=[['b','一個 子音（無 ＝ 沒有 字尾）',CO.b],['d','兩個 字母 一個 聲音（tch 的 t 不 發音）',CO.d],['a2','兩個 子音（2 個 聲音）',CO.a2],['n2','兩個 子音 新 加 的（mb 的 b 不 發音）',CO.n2.concat(CO.a3),1]];
function grpTabs(k,G0,cur){return '<div class="gtabs">'+G0.map(g=>'<button data-gk="'+k+'" data-gv="'+g[0]+'" class="'+(cur===g[0]?'on':'')+'">'+g[1].split('（')[0]+'</button>').join('')+'</div>'}
function mapDraw(){const A=MLV==='a';$('#lvB').classList.toggle('on',!A);$('#lvA').classList.toggle('on',A);
  if(!A){$('#mOn').innerHTML=chipHTML(OG[0][1],ON.b,'o');$('#mV').innerHTML=chipHTML(VG[0][1],VV.b,'v');$('#mCo').innerHTML=chipHTML(CG[0][1],CO.b,'c')+chipHTML(CG[1][1],CO.d,'c')}
  else{/* 🔵 進階：字首、字尾 上面 分組 按鈕，一次 只 看 一組（不 眼花）*/
    const og=OG.find(g=>g[0]===MG.o)||OG[0],cg=CG.find(g=>g[0]===MG.c)||CG[0];
    $('#mOn').innerHTML=grpTabs('o',OG,og[0])+chipHTML(og[1],og[2],'o');$('#mV').innerHTML=VG.map(g=>chipHTML(g[1],g[2],'v')).join('');$('#mCo').innerHTML=grpTabs('c',CG,cg[0])+chipHTML(cg[1],cg[2],'c',cg[3])}
  mapOut()}
function mapSet(o,v,c){MS={o,v,c};LS.s('ms2',MS);if(TAB==='map')mapDraw()}
async function mapOut(){TOK++;const o=MS.o,v=MS.v,c=MS.c,box=M2?$('#m2w'):$('#mapOut');const ok=MAPC.ok(o,v,c),spec=specOfMap(o,v,c),w=spellOf(o,v,c),code=codeOf(o,v,c),xb=XBS.has(code),bd=BDS.has(code),has=ok&&!xb&&!bd&&AV.has(code),real=REALC[code]===w,C=countOf(spec);
  const note=(c==='ld'||c==='lk')?'<span class="mtag p">⚠ old、talk 的 母音 會 變（a、o 不 接 ld、lk）</span>':c==='mb'?'<span class="mtag p">mb 的 b 不 發音</span>':c==='tch'?'<span class="mtag p">tch 的 t 不 發音</span>':(v==='au'||v==='aw')?'<span class="mtag p">au、aw ＝ ㄛ（嘴巴 大大 張開，像 talk 的 a）</span>':'';
  box.innerHTML='<div class="wrow'+(ok?'':' bad')+'">'+wordHTML(spec,{lab:1,dots:1})+'</div><div class="sum">'+patTxt(spec)+'：'+C.b+' 個 方框、<b>'+C.n+' 個 聲音</b>'+(C.v>1?'、'+C.v+' 個 音節':'')+'</div>'+
    '<div class="cap">'+(bd?'<span class="mtag w">⚠ 這個 組合 不 放（唸 起來 像 不 好 的 字）</span>':xb?'<span class="mtag w">⚠ '+w+' 是 真的 英文 字，但是 不 照 規則 唸（例外 字），所以 這裡 不 唸</span>':!ok?'<span class="mtag w">⚠ '+why(o,v,c)+'</span>':real?'<span class="mtag r">✅ 真的 英文 字</span>':'<span class="mtag p">🔮 練習 用 的 假字（照 規則 唸）</span>')+note+'</div>'+
    '<div class="ctl"><button id="mSay1"'+(has?'':' disabled')+'>🔊 一個 一個 唸 ➜ 合 起來</button><button id="mSay2"'+(has?'':' disabled')+'>🔊 整個 字</button></div>';
  if(M2)m2Arrows();$('#mSay2').onclick=()=>say(code);$('#mSay1').onclick=()=>mapSay(spec,code,box);if(has&&!FAST&&!PRAC)mapSay(spec,code,box)}
async function mapSay(spec,code,box){const me=++TOK,S=parse(spec),cks=qsa(box,'.ck');let k=0;for(const B of S)for(const b of B)for(const c of b.ch){const el=cks[k++];const a=auOf(c.t,b.coda);if(!a||c.sil||b.type==='g')continue;if(me!==TOK)return;el.classList.add('on');await sayW(a,me);el.classList.remove('on')}
  qsa(box,'.bx').forEach(e=>e.classList.add('say'));await sayW(code,me);qsa(box,'.bx').forEach(e=>e.classList.remove('say'))}
document.addEventListener('click',e=>{const g=e.target.closest('[data-gk]');if(g){MG[g.dataset.gk]=g.dataset.gv;LS.s('mg'+g.dataset.gk,g.dataset.gv);mapDraw();return}
  const b=e.target.closest('[data-mk]');if(!b)return;MS[b.dataset.mk]=b.dataset.mv;LS.s('ms2',MS);mapDraw();if(PRAC)pracCheck()});
$('#lvB').onclick=()=>{MLV='b';LS.s('mlv','b');if(VV.b.indexOf(MS.v)<0)MS.v='a';if(ON.b.indexOf(MS.o)<0)MS.o='b';if(CO.b.concat(CO.d).indexOf(MS.c)<0)MS.c='t';mapDraw()};$('#lvA').onclick=()=>{MLV='a';LS.s('mlv','a');mapDraw()};
$('#mRand').onclick=()=>{const L=MAPC.all().filter(x=>AV.has(x.code)&&!XBS.has(x.code)&&!BDS.has(x.code)&&(MLV==='a'||(ON.b.indexOf(x.o)>=0&&VV.b.indexOf(x.v)>=0&&CO.b.concat(CO.d).indexOf(x.c)>=0)));const x=R(L);MS={o:x.o,v:x.v,c:x.c};LS.s('ms2',MS);mapDraw()};
/* 🎧 你 來 拼（聽 ➜ 自己 點 字首、母音、字尾）／👀 你 來 讀（看 ➜ 先 自己 唸 ➜ 再 聽 對 不 對）：我 做 ➜ 一起 做 ➜ 你 做 */
let PRAC=null;
function pracPool(){return QW.filter(x=>MLV==='a'||(!x.long&&x.on.join('').length<=2&&x.co.join('').length<=2)).map(x=>{const o=x.on.join(''),c=x.co.join('')||'無',v=x.v+(x.mg?'_e':'');return {o,v,c:c==='ck'?'k':/^(ll|ss|ff|zz)$/.test(c)?c[0]:c,x}}).filter(y=>MAPC.ok(y.o,y.v,y.c)&&codeOf(y.o,y.v,y.c)===y.x.c)}
function pracStart(kind){const y=R(pracPool());if(!y)return;PRAC={kind,y};const P=$('#prac');P.hidden=false;
  if(kind==='spell'){P.innerHTML='<div class="tq">🎧 你 來 拼：聽 ➜ 自己 點 ① 字首 ② 母音 ③ 字尾，拼 出 這個 字</div><div class="ctl"><button class="btn" id="pEar">🔊 再 聽 一次</button><button class="btn gold" id="pAns">👉 公布 答案</button><button class="btn" id="pX">✖ 結束 練習</button></div><div id="pRes" class="cap"></div>';
    say(y.x.c);$('#pEar').onclick=()=>say(y.x.c);$('#pAns').onclick=()=>pracReveal()}
  else{MS={o:y.o,v:y.v,c:y.c};mapDraw();$$('#mapOut .tl[data-t],#m2w .tl[data-t]').forEach(t=>t.classList.add('hide'));
    P.innerHTML='<div class="tq">👀 你 來 讀：先 找 母音（紅），一個 方框 一個 方框 在 心裡 唸，再 合 起來 ➜ 大聲 唸 出來</div><div class="ctl"><button class="btn gold" id="pAns">🔊 聽 答案（對 不 對？）</button><button class="btn" id="pNx">➡ 下 一個</button><button class="btn" id="pX">✖ 結束 練習</button></div>';
    $('#pAns').onclick=()=>{$$('#mapOut .tl,#m2w .tl').forEach(t=>t.classList.remove('hide'));mapSay(specOfMap(y.o,y.v,y.c),y.x.c,M2?$('#m2w'):$('#mapOut'))};$('#pNx').onclick=()=>pracStart('read')}
  $('#pX').onclick=()=>{PRAC=null;P.hidden=true;mapDraw()}}
function pracCheck(){if(!PRAC||PRAC.kind!=='spell')return;const y=PRAC.y;if(MS.o===y.o&&MS.v===y.v&&MS.c===y.c){$('#pRes').innerHTML='🎉 <b>拼 對 了！</b> '+y.x.w;mapSay(specOfMap(y.o,y.v,y.c),y.x.c,M2?$('#m2w'):$('#mapOut'));setTimeout(()=>{if(PRAC&&PRAC.y===y)pracStart('spell')},FAST?30:2600)}}
function pracReveal(){const y=PRAC.y;MS={o:y.o,v:y.v,c:y.c};mapDraw();$('#pRes').innerHTML='答案 ＝ <b class="en">'+y.x.w+'</b>；再 聽 一次，下 一題 自己 拼 拼 看';setTimeout(()=>{if(PRAC&&PRAC.y===y)pracStart('spell')},FAST?30:3200)}
$('#pSpell').onclick=()=>pracStart('spell');$('#pRead').onclick=()=>pracStart('read');
/* map2（新 版本）：每 一個 方框 正下方〔▲〕〔▼〕直接 換（照 Phonics Master 字卡 的 操作，字 在 最 上面 大大 的）*/
function m2List(k){const A=MLV==='a';return k==='o'?(A?ON.b.concat(ON.a2,ON.a3):ON.b):k==='v'?(A?VV.b.concat(VV.a,VV.t):VV.b):(A?CO.b.concat(CO.d,CO.a2,CO.n2,CO.a3):CO.b.concat(CO.d))}
function m2Arrows(){const box=$('#m2w');let seenV=false;qsa(box,'.bx').forEach(b=>{if(b.classList.contains('g')||b.classList.contains('rr'))return;const k=b.classList.contains('c')?(seenV?'c':'o'):(seenV=true,'v');
  b.appendChild(H('div','m2a','<button data-m2="'+k+'" data-d="-1">▲</button><span>'+(k==='o'?'字首':k==='v'?'母音':'字尾')+'</span><button data-m2="'+k+'" data-d="1">▼</button>'))})}
document.addEventListener('click',e=>{const a=e.target.closest('[data-m2]');if(!a)return;e.stopPropagation();const k=a.dataset.m2,L=m2List(k);let i=L.indexOf(MS[k]);for(let t=0;t<L.length;t++){i=(i+(+a.dataset.d)+L.length)%L.length;const T=Object.assign({},MS);T[k]=L[i];if(MAPC.ok(T.o,T.v,T.c))break}MS[k]=L[i];LS.s('ms2',MS);mapDraw();if(PRAC)pracCheck()},true);

/* ══ ③ 🪜 多 音節（重音 ＝ 第一個 音節）；唸 到 的 音節 整個 放大＋發亮（老師 4-14）══ */
const SYL=[['bathroom','b.a.th|r.oo.m','浴室'],['bedroom','b.e.d|r.oo.m','臥室'],['rabbit','r.a|bb.i.t','兔子'],['happy','h.a|pp.y','快樂的'],['kitchen','k.i|tch.e=ah.n','廚房'],['baby','b.a!=ai|b.y','嬰兒'],['angry','a.n|gr.y','生氣的'],['turtle','t.ur|t.le=el','烏龜'],['dining','d.i!=ii|n.i.ng','用餐'],['living','l.i|v.i.ng','生活']];
function sylDraw(){$('#sylOut').innerHTML='<div class="cap">每 一個 <b>紅框（母音 聲音）＝ 一個 音節</b>；虛線 框 ＝ 一個 音節。'+(STR?'🎵 <b>大 的 ＋ ● ＝ 重音</b>（唸 大聲、唸 長 一點）':'')+'</div>'+
  SYL.map((x,i)=>'<div class="wrow'+(STR?' stress':'')+'" data-sy="'+i+'" style="cursor:pointer">'+wordHTML(x[1],{dots:1,st:STR?0:null})+'<span class="cap" style="align-self:center;margin-left:14px">'+x[2]+'　🔊</span></div>').join('')}
document.addEventListener('click',e=>{const r=e.target.closest('[data-sy]');if(r&&!e.target.closest('.ck')){const x=SYL[+r.dataset.sy];(async()=>{const me=++TOK;const sy=r.querySelectorAll('.syl');for(let i=0;i<sy.length;i++){sy[i].classList.add('hot');await sayW(x[0]==='baby'?['w_c55_ba','w_c55_by'][i]:'sy_'+x[0]+'_'+i,me);sy[i].classList.remove('hot')}r.querySelectorAll('.syl').forEach(s=>s.classList.add('hot'));await sayW(AV.has('bk_'+x[0])?'bk_'+x[0]:'w_c55_'+x[0],me);r.querySelectorAll('.syl').forEach(s=>s.classList.remove('hot'))})()}});
$('#sStress').onclick=()=>{STR=!STR;strBtn();sylDraw()};
/* ══ ④ 一個 字母 很多 聲音／一個 聲音 很多 拼法（老師 4-15）：每 個 字母 正下方 音標；同 一組 裡 不同 的 聲音 ＝ 不同 深淺 的 紅；唸 名字 ＝ 黃；不 發音 ＝ 灰 ══ */
const RED=['#FF8A8A','#E53935','#A51D1D','#6D0F0F'];
const MANY=[['同 一個 字母 a，4 種 聲音（看 後面 的 字母）',[['c.a.t','bk_cat','短 a'],['c.a!=ai.k.e~','w_cake','magic e'],['b.a=ao.ll','w_ball','a＋ll'],['c.ar','w_car','a＋r']]],
 ['同 一個 聲音 ㄟ（eɪ），3 種 拼法',[['c.a!=ai.k.e~','w_cake','a_e'],['r.ai!=ai.n','w_rain','ai：在 中間'],['d.ay!=ai','w_day','ay：在 最後']]],
 ['同 一個 字母 o，3 種 聲音',[['h.o.t','h-aa-t','短 o'],['n.o!=oa.t.e~','n-oa-t','magic e'],['f.or','f-or','o＋r']]],
 ['同 一個 聲音 一（i），2 種 拼法',[['s.ee!=ee.d','s-ee-d','ee：第一個 e 唸 名字'],['s.ea!=ee.t','s-ee-t','ea：e 唸 名字']]],
 ['ow 有 兩種 聲音',[['sn.ow!=oa','sn-oa','ㄡ：o 唸 名字、w 不 發音'],['c.ow=ou','k-ou','ㄠ：o、w 一起 唸（紅）']]],
 ['其他 兩個 母音 字母 一起 唸（都 紅）',[['l.ou.d','l-ou-d','ou ＝ ㄠ'],['b.oy','b-oy','oy ＝ ㄛ一'],['c.oi.n','k-oy-n','oi ＝ ㄛ一'],['s.aw','s-ao','aw ＝ ㄛ（嘴巴 大大 張開）'],['m.oo.n','m-uu-n','oo ＝ ㄨ']]]];
function shadeOf(rows){const seen=[];return rows.map(r=>{const S=parse(r[0]);let k=0;const o={};S[0].forEach((b,bi)=>{if(b.type==='v'){const t=b.ch[0].t;let i=seen.indexOf(t);if(i<0){seen.push(t);i=seen.length-1}o[bi]=RED[i%RED.length]}});return o})}
function manyDraw(){$('#manyOut').innerHTML=MANY.map(g=>{const rs=g[1].filter(r=>AV.has(r[1])),sh=shadeOf(rs);return '<div class="pnl"><h3>'+g[0]+'</h3>'+rs.map((r,i)=>'<div class="mrow" data-ma="'+r[1]+'"><div class="wrow mw2">'+wordHTML(r[0],{dots:1,shade:sh[i]})+'</div><span class="mz">'+r[2]+'</span><span class="ms">🔊</span></div>').join('')+'</div>'}).join('')}
document.addEventListener('click',e=>{const r=e.target.closest('[data-ma]');if(r&&!e.target.closest('.ck'))say(r.dataset.ma)});
/* ══ 上面：注音／KK／IPA、分頁 ══ */
function mdDraw(){$$('.mdSw button').forEach(b=>b.classList.toggle('on',b.dataset.md===MD))}
$$('.mdSw button').forEach(b=>b.onclick=()=>{MD=b.dataset.md;LS.s('md',MD);mdDraw();retile()});
let TAB='ani';function tab(t){TAB=t;TOK++;$$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));['ani','map','syl','many','play'].forEach(k=>$('#s_'+k).hidden=k!==t);
  if(t==='ani')scCard(SCI);if(t==='map')mapDraw();if(t==='syl')sylDraw();if(t==='many')manyDraw();if(t==='play')gList();try{history.replaceState(null,'','#'+t)}catch(e){}}
$$('#tabs button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
/*__GAMES__*/
mdDraw();strBtn();modeBtn();{const ch=/#chain=([^&]+)/.exec(location.hash);if(ch){const w=decodeURIComponent(ch[1]),S=chainScene(w);if(S){SC.push(S);const i=SC.length-1;tab('ani');SCI=i;scCard(i);$('#aIdx').insertAdjacentHTML('beforebegin','<button class="btn go" onclick="history.length>1?history.back():location.href=\'games.html\'">⬅ 回 字卡</button>')}else tab('ani')}else tab((/#(ani|map|syl|many|play)/.exec(location.hash)||[0,M2?'map':'ani'])[1])}
window.PHM={BDS,SC,CHAIN,chainScene,MORE2,parse,countOf,patTxt,scPlay,scCard,qzStart,qzMake,tab,MS:()=>MS,mapOut,mapSet,codeOf,spellOf,AV,G:()=>G,start,QW,GM,q25Seq,MAPC};
})();
