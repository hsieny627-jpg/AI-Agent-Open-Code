(function(){"use strict";
/* phonics/_map.js — 🗺️ 拼音 地圖（2026-11-16 第五十六次，老師 第五十五次 第 5、6 點 的 回答）。node phonics/_map_build.js ➜ map.html
 * ① 🎬 秒懂 動畫：照 老師 的 步驟（注音 ㄅ＋ㄚ ➜ b a t ➜ bl a t／bl a st ➜ bat／bath ➜ rom／room ➜ bathroom ➜ song／stong／strong ➜ ba／baby ➜ tin／thin、ball／tall／fall、sot…shomp ➜ 一個 字母 很多 聲音）
 *    每 一個 字母 出來 ＝ 唸 它 的 聲音 ➜ 合 起來 唸 ➜ 字母 正下方 一個 一個 出現 音標（注音／KK／IPA）＋唸 ➜ 再 合 起來 ➜ 黃點 數 聲音。藍框 ＝ 子音、紅框 ＝ 母音、黃框 ＝ 唸 名字 的 母音、紅框 數 ＝ 音節。
 * ② 🗺️ 拼音 地圖：字首｜母音｜字尾 三欄（基礎／進階），點 一個 ＝ 字 組 起來（方框＋黃點＋音標＋🔊）
 * ③ 🪜 多 音節：課本 的 兩 音節 字（一個 音節 一個 虛線 框）＋🎵 重音 開關
 * ④ 🔤 一個 字母 很多 聲音／一個 聲音 很多 拼法
 * ⑤ 🎮 10 種 遊戲（每 種 一個 學習 目標）＋📝 25 題 闖關（每 次 抽 5 種、組合 跟 上次 不一樣）；成績 g年級gm_ph-<遊戲>（score/_bank.js）*/
const $=s=>document.querySelector(s),$$=s=>[].slice.call(document.querySelectorAll(s)),H=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const R=a=>a[Math.floor(Math.random()*a.length)],SH=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const LS={g(k,d){try{const v=localStorage.getItem('phm_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},s(k,v){try{localStorage.setItem('phm_'+k,JSON.stringify(v))}catch(e){}}};
const AV=new Set(AVL),FAST=!!window.__PHFAST;let MD=LS.g('md','zh'),PAUSED=false,SLOW=1,TOK=0;
/* ══ 聲音：一個 播放器，iPad 第一次 碰 就 解鎖，每 一次 都 有 保險 計時 ══ */
const AU=new Audio();
document.addEventListener('pointerdown',function u(){document.removeEventListener('pointerdown',u,true);try{AU.muted=true;AU.src='au/s_m.mp3';const p=AU.play();if(p)p.then(()=>{AU.pause();AU.muted=false}).catch(()=>{AU.muted=false})}catch(e){AU.muted=false}},true);
function say(f){return new Promise(res=>{if(window.__PHSAY)window.__PHSAY.push(f);let d=false;const fin=()=>{if(d)return;d=true;res()};if(!f||!AV.has(f)){fin();return}
  AU.muted=false;AU.src='au/'+f+'.mp3';AU.playbackRate=SLOW>1?.8:1;AU.onended=fin;AU.onerror=fin;setTimeout(fin,FAST?40:(SLOW>1?4200:3200));const p=AU.play();if(p&&p.catch)p.catch(fin)})}
const wait=ms=>new Promise(r=>{if(FAST){setTimeout(r,10);return}let left=ms*SLOW,last=Date.now();const t=setInterval(()=>{const n=Date.now();if(!PAUSED)left-=n-last;last=n;if(left<=0){clearInterval(t);r()}},50)});
async function sayW(f,t){if(t!==TOK)return;while(PAUSED&&t===TOK)await wait(100);if(t!==TOK)return;await say(f);await wait(220)}
/* ══ 一個 聲音 ＝ 一個 碼（tok）：字母 塊 ➜ 碼、碼 ➜ 音標、碼 ➜ 音檔 ══ */
const CMAP={bb:'b',pp:'p',dd:'d',tt:'t',c:'k',k:'k',ck:'k',ph:'f',ll:'l',ss:'s',ff:'f',zz:'z',tch:'ch',qu:'kw',x:'ks',wh:'w'},VMAP={a:'ae',e:'eh',i:'ih',o:'aa',u:'uh',oo:'uu',ee:'ee',ea:'ee',ai:'ai',ay:'ai',oa:'oa',ow:'oa',y:'ee',or:'or',al:'ao',ur:'er',ir:'er',ar:'ar',le:'el'};
const CHK=['bb','pp','dd','tt','tch','sch','ch','sh','th','ph','wh','ng','ck','qu','ss','ll','ff','zz','oo','ee','ea','ai','ay','oa','ow','or'];
const NSND=t=>t==='ks'||t==='kw'?2:1;
const CODA={b:'s_eb',d:'s_ed',g:'s_eg',p:'s_ep',t:'s_et',k:'s_ek',m:'s_em',n:'s_en',l:'s_el',ks:'s_x'};
function auOf(t,coda){if(coda&&CODA[t])return CODA[t];if(t==='yu')return 's_uu';if(t==='ah')return 's_uh';return 's_'+t}
function tileOf(t,coda){const T=TT[t]||{zh:t,kk:t,ipa:t};let o={zh:T.zh,sup:T.sup||'',kk:T.kk,ipa:T.ipa};
  if(coda){if(/^[bdgptk]$/.test(t))o.sup='〃';else if(t==='m'||t==='n')o.sup='～';else if(t==='l')o={zh:'ㄛ',sup:'',kk:'l',ipa:'l'};else if(t==='ng')o.sup=''}return o}
function tileHTML(t,coda,hide){if(!t)return '<span class="tl sl'+(hide?' hide':'')+'"></span>';const o=tileOf(t,coda),tx=MD==='zh'?o.zh:MD==='kk'?o.kk:o.ipa;
  return '<span class="tl'+(MD==='zh'?'':' ph')+(hide?' hide':'')+'" data-t="'+t+'" data-cd="'+(coda?1:0)+'">'+tx+(MD==='zh'&&o.sup?'<sup>'+o.sup+'</sup>':'')+'</span>'}
function retile(){$$('.tl[data-t]').forEach(el=>{const h=el.classList.contains('hide'),on=el.classList.contains('on');const x=H('div','',tileHTML(el.dataset.t,el.dataset.cd==='1',h)).firstChild;if(on)x.classList.add('on');el.replaceWith(x)})}
/* 字 的 寫法："b.a.th|r.oo.m"（. ＝ 方框、| ＝ 音節）；可以 指定：o=ao（這個 母音 碼）、a!=ai（唸 名字 ＝ 黃框）、e~（不 發音 灰）、th=dh（有聲 th）、[ㄅ] 注音 */
function parse(spec){return spec.split('|').map(sy=>{let seenV=false;return sy.split('.').map((b,bi)=>{let o={ch:[]},m;
  if((m=/^\[(.+)\]([cv])$/.exec(b))){o.type=m[2];o.zy=1;o.ch=[{l:m[1],t:null}];return o}
  if(/~$/.test(b)){o.type='g';o.ch=[{l:b.slice(0,-1),t:null}];return o}
  let L=b,ov=null,nm=false;if((m=/^(.+?)(!)?=(.+)$/.exec(b))){L=m[1];nm=!!m[2];ov=m[3]}else if(/!$/.test(b)){L=b.slice(0,-1);nm=true}
  const isV=/^[aeiou]/.test(L)||L==='le'||(L==='y'&&bi>0);const parts=[];let s=L;while(s){const c=CHK.find(x=>s.startsWith(x))||s[0];parts.push(c);s=s.slice(c.length)}
  if(isV){seenV=true;o.type=nm?'n':'v';o.ch=[{l:L,t:ov||VMAP[L]||L}]}else{o.type='c';o.coda=seenV;o.ch=parts.map(c=>({l:c,t:ov&&parts.length===1?ov:(CMAP[c]||c)}))}
  return o})})}
function bxHTML(B,o){o=o||{};return B.map((b,bi)=>{const n=b.ch.reduce((a,c)=>a+(c.t?NSND(c.t):0),0);
  return '<div class="bx '+b.type+(o.hide?' hid':'')+(o.sx!=null?(o.sx?' sx':' su'):'')+'" data-b="'+bi+'">'+(o.lab?'<span class="bl">'+(b.type==='c'?'子音':b.type==='g'?'不 發音':'母音')+'</span>':'')+
    b.ch.map((c,ci)=>'<div class="ck" data-c="'+ci+'"><span class="L'+(b.zy?' zy':'')+(b.type==='g'?' gr':'')+'">'+c.l+'</span>'+(b.zy?'':'<span class="T">'+tileHTML(c.t,b.coda,o.hideT)+'</span>')+'</div>').join('')+
    (b.zy||b.type==='g'?'':'<div class="dots">'+Array.from({length:n},()=>'<i class="'+(o.dots?'on':'')+'"></i>').join('')+'</div>')+'</div>'}).join('')}
function wordHTML(spec,o){o=o||{};const S=parse(spec),st=o.st;return S.map((B,si)=>S.length>1?'<div class="syl" data-s="'+si+'">'+bxHTML(B,Object.assign({},o,{sx:st!=null?(si===st):null}))+'</div>':bxHTML(B,o)).join(S.length>1?'<span class="plus">＋</span>':'')}
function countOf(spec){const S=parse(spec);let n=0,b=0,v=0;S.forEach(B=>B.forEach(x=>{if(x.type==='g'||x.zy)return;b++;if(x.type!=='c')v++;x.ch.forEach(c=>{if(c.t)n+=NSND(c.t)})}));return {n,b,v}}
function patTxt(spec){return parse(spec).map(B=>B.filter(x=>x.type!=='g').map(x=>x.type==='c'?'子':'母').join(' ')).join('｜')}
/* ══ ① 秒懂 動畫 ══ */
const SC=[
 {t:'① 注音：子音＋母音',rows:[{s:'[ㄅ]c.[ㄚ]v',au:'zy_ba',zy:['zy_b','zy_a']}],cap:'注音 拼音 大多 是 <span class="cb">子音</span>＋<span class="vb">母音</span>：兩個 方框（ㄅ＋ㄚ ＝ ㄅㄚ）'},
 {t:'② 英文：子音＋母音＋子音',rows:[{s:'[ㄅ]c.[ㄚ]v',au:'zy_ba',zy:['zy_b','zy_a'],dim:1},{s:'b.a.t',au:'b-ae-t'}],cap:'英文 最 基本 的 拼法 ＝ <span class="cb">子</span>＋<span class="vb">母</span>＋<span class="cb">子</span>：三個 方框。<span class="cb">藍框 ＝ 子音</span>、<span class="vb">紅框 ＝ 母音</span>'},
 {t:'③ 一個 方框 可以 放 好幾 個 聲音',rows:[{s:'b.a.t',au:'b-ae-t'},{s:'bl.a.t',au:'bl-ae-t',fake:1},{s:'bl.a.st',au:'bl-ae-st'}],cap:'三個 都 是 <b>子 母 子</b>（三個 方框）：bat <b>3</b> 個 聲音、blat <b>4</b> 個、blast <b>5</b> 個（<b>黃點 ＝ 聲音</b>）'},
 {t:'④ 兩個 字母，只有 一個 聲音',rows:[{s:'b.a.t',au:'b-ae-t'},{s:'b.a.th',au:'b-ae-th'}],cap:'bath 有 4 個 字母，還是 <b>3 個 方框、3 個 聲音</b>：<b>th</b> 兩個 字母 ＝ 一個 吐舌頭 的 聲音',extra:'dg'},
 {t:'⑤ oo 兩個 字母 ＝ 一個 母音',rows:[{s:'r.o.m',au:'r-aa-m',fake:1},{s:'r.oo.m',au:'bk_room'}],cap:'room：<b>oo</b> ＝ 一個 母音（ㄨ）；字尾 <b>m 要 閉嘴</b>：國語 注音 沒有 這種 字尾'},
 {t:'⑥ 兩個 紅框 ＝ 兩個 音節',rows:[{s:'b.a.th',au:'b-ae-th'},{s:'r.oo.m',au:'bk_room'},{s:'b.a.th|r.oo.m',au:'bk_bathroom',st:0}],cap:'bathroom ＝ bath＋room：<b>2 個 紅框（母音）＝ 2 個 音節</b>；6 個 方框、6 個 聲音'},
 {t:'⑦ 子音 一個 一個 加 上去',rows:[{s:'s.o=ao.ng',au:'w_song'},{s:'st.o=ao.ng',au:'w_stong',fake:1},{s:'str.o=ao.ng',au:'bk_strong'}],cap:'都 是 <b>子 母 子</b>：song <b>3</b> 個 聲音、stong <b>4</b> 個、strong <b>5</b> 個（ng ＝ 一個 聲音）'},
 {t:'⑧ ba ➜ baby：子 母 子 母',rows:[{s:'b.a!=ai',au:'w_c55_ba'},{s:'b.a!=ai|b.y',au:'w_c55_baby',st:0}],cap:'baby ＝ ba＋by：<b>子 母｜子 母</b>，4 個 方框、4 個 聲音；a 唸 自己 的 名字（ㄟ）＝ <b>黃框</b>，y 在 最後 ＝ 母音「一」'},
 {t:'⑨ 只 換 一個 地方，變成 新 的 字',rows:[{s:'t.i.n',au:'t-ih-n'},{s:'th.i.n',au:'bk_thin'}],cap:'tin ➜ thin：只 換 了 字首（t ➜ th），還是 <b>子 母 子</b>、3 個 聲音'},
 {t:'⑩ 換 字首',rows:[{s:'b.a=ao.ll',au:'w_ball'},{s:'t.a=ao.ll',au:'bk_tall'},{s:'f.a=ao.ll',au:'w_fall'}],cap:'ball ➜ tall ➜ fall：<b>all</b> 一樣（ll ＝ 一個 聲音），只 換 第一個 方框'},
 {t:'⑪ 一個 一個 換',rows:[{s:'s.o.t',au:'s-aa-t',fake:1},{s:'sh.o.t',au:'sh-aa-t'},{s:'sh.or.t',au:'bk_short'},{s:'sh.or.m',au:'sh-or-m',fake:1},{s:'sh.o.mp',au:'sh-aa-mp',fake:1}],cap:'sot ➜ shot ➜ short ➜ shorm ➜ shomp：每 次 只 換 一個 方框；<b>or</b> ＝ 一個 母音（ㄛㄦ）'},
 {t:'⑫ 大 規則：一個 字母，很多 聲音',rows:[{s:'c.a.t',au:'bk_cat'},{s:'c.a!=ai.k.e~',au:'w_cake'},{s:'b.a=ao.ll',au:'w_ball'},{s:'c.ar',au:'w_car'}],cap:'同 一個 <b>a</b>：cat ㄚㄝ、cake ㄟ（最後 的 e 不 唸）、ball ㄛ、car ㄚㄦ ➜ 看 後面 的 字母 決定',many:1},
 {t:'⑬ 大 規則：一個 聲音，很多 拼法',rows:[{s:'c.a!=ai.k.e~',au:'w_cake'},{s:'r.ai!=ai.n',au:'w_rain'},{s:'d.ay!=ai',au:'w_day'}],cap:'同 一個 聲音 <b>ㄟ（eɪ）</b>：a_e（cake）、ai（rain）、ay（day，在 最後）'}];
const DG=[['ch','ch-ih-n','chin','ch'],['sh','sh-ih-p','ship','sh'],['th','th-ih-n','thin','th','無聲'],['th','dh-ih-s','this','dh','有聲'],['ph','w_phone','phone','f'],['ng','r-ih-ng','ring','ng']];
let SCI=LS.g('sci',0),STR=false;if(SCI>=SC.length)SCI=0;
function scList(){$('#scList').innerHTML=SC.map((s,i)=>'<button data-sc="'+i+'" class="'+(i===SCI?'on':'')+(LS.g('scs',[]).indexOf(i)>=0?' seen':'')+'">'+s.t.split('：')[0].split(' ')[0]+'</button>').join('')}
async function scPlay(i){SCI=i;LS.s('sci',i);const me=++TOK,S=SC[i];scList();PAUSED=false;$('#aPause').textContent='⏸️ 暫停';
  $('#stage').className='pnl n'+S.rows.length;$('#stage').innerHTML='<h2 class="st">'+S.t+'</h2><div class="rows">'+S.rows.map((r,ri)=>'<div class="rw"><div class="wrow'+(STR?' stress':'')+'" data-r="'+ri+'">'+(r.fake?'<span class="lab">🔮 練習 用 的 假字</span>':'')+wordHTML(r.s,{lab:1,hide:1,hideT:1,st:STR?r.st:null})+'</div><div class="sum" data-sum="'+ri+'"></div></div>').join('')+'</div>'+(S.extra==='dg'?'<div id="dgw"></div>':'')+'<div class="cap" id="cap"></div>';
  for(let ri=0;ri<S.rows.length;ri++){if(me!==TOK)return;const r=S.rows[ri],row=$('.wrow[data-r="'+ri+'"]'),bx=[].slice.call(row.querySelectorAll('.bx'));
    /* (1) 方框＋字母 一個 一個 出來，出來 就 唸 那個 聲音 */
    let k=0;const all=[];parse(r.s).forEach(B=>B.forEach(b=>all.push(b)));
    for(let bi=0;bi<bx.length;bi++){if(me!==TOK)return;const el=bx[bi],b=all[bi];el.classList.remove('hid');
      if(b.zy){el.classList.add('say');await sayW(r.zy[k++],me);el.classList.remove('say');continue}
      const cks=el.querySelectorAll('.ck');for(let ci=0;ci<b.ch.length;ci++){const c=b.ch[ci];if(!c.t){await wait(300);continue}cks[ci].classList.add('on');await sayW(auOf(c.t,b.coda),me);cks[ci].classList.remove('on')}}
    /* (2) 合 起來 唸 */
    row.querySelectorAll('.bx').forEach(e=>e.classList.add('say'));await sayW(r.au,me);row.querySelectorAll('.bx').forEach(e=>e.classList.remove('say'));
    if(r.zy){if(r.dim)row.style.opacity=.6;continue}
    /* (3) 字母 正下方 一個 一個 出現 音標＋唸，再 合 起來 */
    for(let bi=0;bi<bx.length;bi++){const b=all[bi];const cks=bx[bi].querySelectorAll('.ck');for(let ci=0;ci<b.ch.length;ci++){if(me!==TOK)return;const c=b.ch[ci],tl=cks[ci].querySelector('.tl');if(tl){tl.classList.remove('hide');tl.classList.add('on')}if(c.t)await sayW(auOf(c.t,b.coda),me);else await wait(300);if(tl)tl.classList.remove('on')}}
    await sayW(r.au,me);
    /* (4) 黃點 數 聲音 */
    let n=0;for(const d of row.querySelectorAll('.dots i')){if(me!==TOK)return;d.classList.add('on');n++;await wait(260)}
    const C=countOf(r.s);$('#stage [data-sum="'+ri+'"]').innerHTML=patTxt(r.s)+'：'+C.b+' 個 方框、<b>'+C.n+' 個 聲音</b>'+(C.v>1?'、'+C.v+' 個 紅框 ＝ '+C.v+' 個 音節':'');
    if(r.dim)row.style.opacity=.6;await wait(500)}
  if(me!==TOK)return;
  if(S.extra==='dg'){$('#dgw').innerHTML='<div class="cap">兩個 字母、一個 聲音：</div><div class="ctl">'+DG.map(d=>'<button data-au="'+d[1]+'" data-s1="'+auOf(d[3])+'"><span class="en" style="font-size:28px">'+d[0]+'</span>'+(d[4]?'（'+d[4]+'）':'')+' '+tileHTML(d[3])+' <span class="en">'+d[2]+'</span></button>').join('')+'</div>';
    for(const d of DG){if(me!==TOK)return;await sayW(auOf(d[3]),me);await sayW(d[1],me)}}
  $('#cap').innerHTML=S.cap;const sn=LS.g('scs',[]);if(sn.indexOf(i)<0){sn.push(i);LS.s('scs',sn)}scList()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-au]');if(b&&b.closest('#dgw')){(async()=>{await say(b.dataset.s1);await say(b.dataset.au)})();return}
  const s=e.target.closest('[data-sc]');if(s){scPlay(+s.dataset.sc);return}
  const ck=e.target.closest('#s_ani .ck,#mapOut .ck,#sylOut .ck');if(ck){const tl=ck.querySelector('.tl[data-t]');if(tl){ck.classList.add('on');say(auOf(tl.dataset.t,tl.dataset.cd==='1')).then(()=>ck.classList.remove('on'))}}});
$('#aPrev').onclick=()=>scPlay(Math.max(0,SCI-1));$('#aNext').onclick=()=>scPlay(Math.min(SC.length-1,SCI+1));$('#aAgain').onclick=()=>scPlay(SCI);
$('#aPause').onclick=()=>{PAUSED=!PAUSED;$('#aPause').textContent=PAUSED?'▶️ 繼續':'⏸️ 暫停';$('#aPause').classList.toggle('on',PAUSED);if(PAUSED)AU.pause()};
$('#aSlow').onclick=()=>{SLOW=SLOW>1?1:1.6;$('#aSlow').classList.toggle('on',SLOW>1)};
function strBtn(){['#aStress','#sStress'].forEach(id=>{const b=$(id);b.textContent='🎵 重音：'+(STR?'開':'關');b.classList.toggle('on',STR)})}
$('#aStress').onclick=()=>{STR=!STR;strBtn();$$('#s_ani .wrow').forEach(r=>r.classList.toggle('stress',STR));scPlay(SCI)};
/* ══ ② 🗺️ 拼音 地圖 ══ */
const ON={b:['b','c','d','f','g','h','j','k','l','m','n','p','r','s','t','v','w','y','z','qu','sh','ch','th','wh'],a2:['bl','cl','fl','gl','pl','sl','br','cr','dr','fr','gr','pr','tr','sk','sm','sn','sp','st','sw'],a3:['scr','spl','spr','str']};
const VV={b:['a','e','i','o','u'],a:['a_e','i_e','o_e','u_e','ai','ay','ee','ea','oa','ow']};
const CO={b:['無','b','d','g','k','l','m','n','p','t','x','s','f','z'],d:['sh','ch','th','ng'],a2:['nd','nt','mp','st','sk','ft','nk'],n2:['pt','ct','xt','lp','lf','lt','sp','mb','ld','lk'],a3:['nch']};
const NEWEX={pt:['kept','k.e.pt'],ct:['fact','f.a.ct'],xt:['next','n.e.xt'],lp:['help','h.e.lp'],lf:['self','s.e.lf'],lt:['melt','m.e.lt'],sp:['crisp','cr.i.sp'],mb:['lamb','l.a.mb'],ld:['old','o!=oa.ld'],lk:['talk','t.a=ao.lk'],nch:['lunch','l.u.nch']};
let MLV='b',MS=LS.g('ms',{o:'b',v:'a',c:'t'});
const ONC=o=>({c:'k',qu:'kw',wh:'w',sc:'sk',scr:'skr'}[o]||o.replace(/^c/,'k').replace(/^sc/,'sk'));
const VC={a:'ae',e:'eh',i:'ih',o:'aa',u:'uh',a_e:'ai',ai:'ai',ay:'ai',i_e:'ii',o_e:'oa',oa:'oa',ow:'oa',ee:'ee',ea:'ee',u_e:'yu'};
function spellOf(o,v,c){const sh=v.length===1,cc=c==='無'?'':c;let cs=cc;if(sh){if(cc==='k')cs='ck';else if(/^[lsfz]$/.test(cc))cs=cc+cc;else if(cc==='ch')cs='tch'}
  if(/_e$/.test(v))return {w:o+v[0]+cs+'e',spec:o+'.'+v[0]+'!='+VC[v]+(cs?'.'+cs:'')+'.e~'};
  return {w:o+v+cs,spec:o+'.'+(sh?v:v+'!='+VC[v])+(cs?'.'+cs:'')}}
function codeOf(o,v,c){const cc=c==='無'?'':(c==='x'?'ks':c);let vc=VC[v];const base=ONC(o)+'-';if(v==='u_e'){const a=base+'yu'+(cc?'-'+cc:''),b=base+'uu'+(cc?'-'+cc:'');return AV.has(a)?a:b}return base+vc+(cc?'-'+cc:'')}
function chipHTML(grp,lab,list,k,newg){return '<div class="mg">'+lab+'</div><div class="chips">'+list.map(x=>'<button class="chip en'+(MS[k]===x?' on':'')+'" data-mk="'+k+'" data-mv="'+x+'">'+x.replace('_e','_e')+(newg?'<small>'+(x==='ld'||x==='lk'?'⚠ 母音 會 變':'新')+'</small>':'')+'</button>').join('')+'</div>'}
function mapDraw(){const A=MLV==='a';$('#lvB').classList.toggle('on',!A);$('#lvA').classList.toggle('on',A);
  $('#mOn').innerHTML=chipHTML(0,'一個 子音（1 個 聲音；sh ch th wh ＝ 兩個 字母 一個 聲音、qu ＝ 2 個 聲音）',ON.b,'o')+(A?chipHTML(0,'兩個 子音（2 個 聲音）',ON.a2,'o')+chipHTML(0,'三個 子音（3 個 聲音）',ON.a3,'o'):'');
  $('#mV').innerHTML=chipHTML(0,'短 母音（紅框）',VV.b,'v')+(A?chipHTML(0,'唸 名字 的 母音（黃框）：magic e、兩個 母音 字母',VV.a,'v'):'');
  $('#mCo').innerHTML=chipHTML(0,'一個 子音（無 ＝ 沒有 字尾）',CO.b,'c')+chipHTML(0,'兩個 字母 一個 聲音',CO.d,'c')+(A?chipHTML(0,'兩個 子音（2 個 聲音）',CO.a2,'c')+chipHTML(0,'兩個 子音 新 加 的（例字）',CO.n2,'c',1)+chipHTML(0,'三個 字母（nch ＝ 2 個 聲音）',CO.a3,'c',1):'');mapOut()}
async function mapOut(){const me=++TOK;const o=MS.o,v=MS.v,c=MS.c,box=$('#mapOut');let spec,code,w,ex=NEWEX[c];
  if(ex){w=ex[0];spec=ex[1];code='w_'+w}else{const s=spellOf(o,v,c);w=s.w;spec=s.spec;code=codeOf(o,v,c)}
  const has=AV.has(code),real=ex?1:(REALC[code]===w),C=countOf(spec);
  box.innerHTML='<div class="wrow">'+wordHTML(spec,{lab:1,dots:1})+'</div><div class="sum">'+patTxt(spec)+'：'+C.b+' 個 方框、<b>'+C.n+' 個 聲音</b>'+(C.v>1?'、'+C.v+' 個 音節':'')+'</div>'+
    '<div class="cap">'+(ex?'<span class="mtag w">例字 '+w+'</span>'+(c==='ld'||c==='lk'?'<span class="mtag p">⚠ old、talk 的 母音 會 變（不 是 短 母音）</span>':c==='mb'?'<span class="mtag p">mb 的 b 不 發音</span>':''):real?'<span class="mtag r">✅ 真的 英文 字</span>':'<span class="mtag p">🔮 練習 用 的 假字（照 規則 唸）</span>')+(has?'':'<span class="mtag w">這個 組合 英文 很少 用（沒有 聲音）</span>')+'</div>'+
    '<div class="ctl"><button id="mSay1">🔊 一個 一個 唸 ➜ 合 起來</button><button id="mSay2">🔊 整個 字</button></div>';
  if(ex&&c==='mb'){const L=box.querySelectorAll('.ck .L');L[L.length-1].classList.add('gr')}
  $('#mSay2').onclick=()=>say(code);$('#mSay1').onclick=()=>mapSay(spec,code);if(has&&!FAST)mapSay(spec,code)}
async function mapSay(spec,code){const me=++TOK,S=parse(spec),cks=$$('#mapOut .ck');let k=0;for(const B of S)for(const b of B)for(const c of b.ch){const el=cks[k++];if(!c.t||b.type==='g')continue;if(me!==TOK)return;el.classList.add('on');await sayW(auOf(c.t,b.coda),me);el.classList.remove('on')}
  $$('#mapOut .bx').forEach(e=>e.classList.add('say'));await sayW(code,me);$$('#mapOut .bx').forEach(e=>e.classList.remove('say'))}
document.addEventListener('click',e=>{const b=e.target.closest('[data-mk]');if(!b)return;MS[b.dataset.mk]=b.dataset.mv;if(b.dataset.mk==='v'&&/_e$/.test(MS.v)&&!/^[bdklmnpt]$/.test(MS.c))MS.c='t';
  if(b.dataset.mk==='v'&&/^(ay|ow)$/.test(MS.v))MS.c='無';LS.s('ms',MS);$$('#s_map .chip').forEach(x=>x.classList.toggle('on',MS[x.dataset.mk]===x.dataset.mv));mapOut()});
$('#lvB').onclick=()=>{MLV='b';if(VV.b.indexOf(MS.v)<0)MS.v='a';if(ON.b.indexOf(MS.o)<0)MS.o='b';if(CO.b.concat(CO.d).indexOf(MS.c)<0)MS.c='t';mapDraw()};$('#lvA').onclick=()=>{MLV='a';mapDraw()};
$('#mRand').onclick=()=>{for(let t=0;t<40;t++){const o=R(MLV==='a'?ON.b.concat(ON.a2,ON.a3):ON.b),v=R(MLV==='a'?VV.b.concat(VV.a):VV.b),c=R(MLV==='a'?CO.b.concat(CO.d,CO.a2):CO.b.concat(CO.d));if(AV.has(codeOf(o,v,c))){MS={o,v,c};break}}LS.s('ms',MS);mapDraw()};
/* ══ ③ 🪜 多 音節（重音 ＝ 第一個 音節）══ */
const SYL=[['bathroom','b.a.th|r.oo.m','浴室'],['bedroom','b.e.d|r.oo.m','臥室'],['rabbit','r.a|bb.i.t','兔子'],['happy','h.a|pp.y','快樂的'],['kitchen','k.i|tch.e=ah.n','廚房'],['baby','b.a!=ai|b.y','嬰兒'],['angry','a.n|gr.y','生氣的'],['turtle','t.ur=er|t.le=el','烏龜'],['dining','d.i!=ii|n.i.ng','用餐'],['living','l.i|v.i.ng','生活']];
function sylDraw(){$('#sylOut').innerHTML='<div class="cap">每 一個 <b>紅框（母音 聲音）＝ 一個 音節</b>；虛線 框 ＝ 一個 音節。'+(STR?'🎵 <b>大 的 ＋ ● ＝ 重音</b>（唸 大聲、唸 長 一點）':'')+'</div>'+
  SYL.map((x,i)=>'<div class="wrow'+(STR?' stress':'')+'" data-sy="'+i+'" style="cursor:pointer">'+wordHTML(x[1],{dots:1,st:STR?0:null})+'<span class="cap" style="align-self:center;margin-left:14px">'+x[2]+'　🔊</span></div>').join('')}
document.addEventListener('click',e=>{const r=e.target.closest('[data-sy]');if(r&&!e.target.closest('.ck')){const x=SYL[+r.dataset.sy];(async()=>{const me=++TOK;const sy=r.querySelectorAll('.syl');for(let i=0;i<sy.length;i++){sy[i].querySelectorAll('.bx').forEach(b=>b.classList.add('say'));await sayW(x[0]==='baby'?['w_c55_ba','w_c55_by'][i]:'sy_'+x[0]+'_'+i,me);sy[i].querySelectorAll('.bx').forEach(b=>b.classList.remove('say'))}await sayW(AV.has('bk_'+x[0])?'bk_'+x[0]:'w_c55_'+x[0],me)})()}});
$('#sStress').onclick=()=>{STR=!STR;strBtn();sylDraw()};
/* ══ ④ 一個 字母 很多 聲音／一個 聲音 很多 拼法 ══ */
const MANY=[['同 一個 字母 a，4 種 聲音（看 後面 的 字母）',[['c<u>a</u>t','ㄚㄝ（æ）','短 a','bk_cat'],['c<u>a</u>k<s style="color:#8C92A3;text-decoration:none">e</s>','ㄟ（eɪ）','magic e','w_cake'],['b<u>a</u>ll','ㄛ（ɔ）','a＋ll','w_ball'],['c<u>a</u>r','ㄚㄦ（ɑr）','a＋r','w_car']]],
 ['同 一個 聲音 ㄟ（eɪ），3 種 拼法',[['c<u>a</u>k<s style="color:#8C92A3;text-decoration:none">e</s>','a_e','中間','w_cake'],['r<u>ai</u>n','ai','中間','w_rain'],['d<u>ay</u>','ay','最後','w_day']]],
 ['同 一個 字母 o，3 種 聲音',[['h<u>o</u>t','ㄚ（ɑ）','短 o','h-aa-t'],['n<u>o</u>t<s style="color:#8C92A3;text-decoration:none">e</s>','ㄡ（oʊ）','magic e','n-oa-t'],['f<u>o</u>r','ㄛㄦ（ɔr）','o＋r','f-or']]],
 ['同 一個 聲音 一（i），2 種 拼法',[['s<u>ee</u>d','ee','','s-ee-d'],['s<u>ea</u>t','ea','','s-ee-t']]]];
function manyDraw(){$('#manyOut').innerHTML=MANY.map(g=>'<div class="pnl"><h3>'+g[0]+'</h3>'+g[1].filter(r=>AV.has(r[3])).map(r=>'<div class="mrow" data-ma="'+r[3]+'"><span class="mw">'+r[0]+'</span><span class="mz">'+r[1]+'<br><small style="color:#BFD0FF">'+r[2]+'</small></span><span class="ms">🔊</span></div>').join('')+'</div>').join('')}
document.addEventListener('click',e=>{const r=e.target.closest('[data-ma]');if(r)say(r.dataset.ma)});
/* ══ 上面：注音／KK／IPA、分頁 ══ */
function mdDraw(){$$('#mdSw button').forEach(b=>b.classList.toggle('on',b.dataset.md===MD))}
$$('#mdSw button').forEach(b=>b.onclick=()=>{MD=b.dataset.md;LS.s('md',MD);mdDraw();retile()});
let TAB='ani';function tab(t){TAB=t;TOK++;$$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));['ani','map','syl','many','play'].forEach(k=>$('#s_'+k).hidden=k!==t);
  if(t==='ani')scPlay(SCI);if(t==='map')mapDraw();if(t==='syl')sylDraw();if(t==='many')manyDraw();if(t==='play')gList();try{history.replaceState(null,'','#'+t)}catch(e){}}
$$('#tabs button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
/*__GAMES__*/
mdDraw();strBtn();tab((/#(ani|map|syl|many|play)/.exec(location.hash)||[0,'ani'])[1]);
window.PHM={SC,parse,countOf,patTxt,scPlay,tab,MS,mapOut,codeOf,spellOf,AV,G:()=>G,start,QW,GM,q25Seq};
})();
