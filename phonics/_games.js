(function(){"use strict";
/* phonics/_games.js — 🎮 自然發音 遊戲場（node phonics/_build.js 放進 games.html）
 * 2026-11-12 第四十八次（老師 第 2～7 點）：
 *   每 一局 5 題、每 題 限時、3 2 1 GO、5 顆 寶石（對 綠、錯 紅）、🔥 連對 2 題 ➜ 第 3 題 起 FEVER ✖2、👑 最後 一題 ✖2、
 *   每 一題 答對 跳出「＋150 ＝ ✅ 100 ＋ ⚡ 50」看得 懂 的 加分、結果 S／A／B／C＋星星＋最佳 紀錄；
 *   答對 ＝「✅ 答對了！」一頁（字＋音標＋圖＋唸 一次）、答錯 ＝ 綠底 答錯頁（你的 答案、正確 答案、嘴巴 提示、唸 兩次、〔🔊 再聽一次〕、唸完 才〔▶ 繼續〕）；
 *   字母 下面 一定 對齊 雙語 注音（上面〔注音｜KK｜IPA〕切換）；點 字母 ＝ 唸 那個 字母 的 音（唸 的 時候 那個 字母 稍微 放大 發亮、不 閃），三個 唸完 一起 亮＋唸 整個 字；
 *   聲音 ＝ au/ 預先 做好 的 音檔：真的 字 都 用 電腦 聽寫 檢查 過（big 不會 再 像 beg）、字首音 不 帶 ㄜ、字尾 m ＝ 閉嘴 mmm、字尾 n ＝ 嗯；
 *   🔮 魔法 咒語（取代 👽 外星 字）＝ 不是 真的 字，但 唸 得 出來；成績 進 老師看板（g年級gm_ph-遊戲，「題目」格式：做完 5 題 ＝ 練習 次數 ＋1）。 */
const $=s=>document.querySelector(s),$$=s=>[].slice.call(document.querySelectorAll(s)),H=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const R=a=>a[Math.floor(Math.random()*a.length)],SH=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const LS={g(k,d){try{const v=localStorage.getItem('phm_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},s(k,v){try{localStorage.setItem('phm_'+k,JSON.stringify(v))}catch(e){}}};
const NQ=window.__PHN||5;   /* 老師：每 一局 5 題 */
let LV=LS.g('lv',1),MD=LS.g('md','zh');
const AV=new Set(CODES);
/* ══ 聲音：一個 播放器（iPad 第一次 碰 就 解鎖），每 一次 都 有 保險 計時；⏸ 暫停、🐢 放慢 ══ */
const AU=new Audio();let AUtok=0,PAUSED=false,SLOW=1;
document.addEventListener('pointerdown',function u(){document.removeEventListener('pointerdown',u,true);try{AU.muted=true;AU.src='au/s_m.mp3';const p=AU.play();if(p)p.then(()=>{AU.pause();AU.muted=false}).catch(()=>{AU.muted=false})}catch(e){AU.muted=false}},true);
function say(f,rate){++AUtok;return new Promise(res=>{if(window.__PHSAY)window.__PHSAY.push(f);let done=false;const fin=()=>{if(done)return;done=true;res()};
  if(!f||!AV.has(f)){fin();return}AU.muted=false;AU.src='au/'+f+'.mp3';AU.playbackRate=(rate||1)/(SLOW>1?1.25:1);AU.onended=fin;AU.onerror=fin;setTimeout(fin,window.__PHWDG||(SLOW>1?4200:3200));const p=AU.play();if(p&&p.catch)p.catch(fin)})}
const wait=ms=>new Promise(r=>{if(window.__PHFAST){setTimeout(r,Math.min(ms,25));return}let left=ms*SLOW,last=Date.now();const tk=setInterval(()=>{const n=Date.now();if(!PAUSED)left-=n-last;last=n;if(left<=0){clearInterval(tk);r()}},50)});
/* ══ 字 ➜ 字首、母音、字尾 ══ */
const VOWS={a:PH.VLIST[0],e:PH.VLIST[1],i:PH.VLIST[2],o:PH.VLIST[3],u:PH.VLIST[4]};
function parts(w){const m=/^(qu|[bcdfghjklmnprstvwyz])([aeiou])(ck|[bdfgklmnprstxz])$/.exec(w);return m?{i:m[1],v:m[2],e:m[3]}:null}
const codeOf=w=>{const p=parts(w);return PH.code(p.i,VOWS[p.v],p.e)};
/* 單獨 一個 音：字首（不 帶 ㄜ）、母音、字尾（m ＝ 閉嘴 mmm、n ＝ 嗯）*/
const sOf=(p,k)=>k===0?'s_'+PH.initCode(p.i,p.v):k===1?'s_'+PH.vowCode(VOWS[p.v]):(p.e==='m'?'s_em':p.e==='n'?'s_en':p.e==='g'?'s_eg':p.e==='l'?'s_el':p.e==='x'?'s_x':p.e==='ck'?'s_ck':'s_'+PH.endCode(p.e));
const REAL={};WORDS.forEach(x=>REAL[x[0]]={zh:x[1],em:x[2]});
const PSEW=PSE.map(x=>x[0]);
const ITEMS=WORDS.map(x=>x[0]).concat(PSEW);   /* 老師看板 的 第幾題 ＝ 這個 清單 的 第幾個（score/_bank.js 同一份）*/
const ok=w=>{const p=parts(w);if(!p)return false;const c=codeOf(w);if(PH.BAD.indexOf(c)>=0||PH2.BAD2.indexOf(c)>=0)return false;if(REAL[w]&&PH.skip(p.i,VOWS[p.v],p.e))return false;return AV.has(c)};
const VS=()=>LV===1?['a','i','o']:['a','e','i','o','u'];
const realOf=()=>WORDS.map(x=>x[0]).filter(w=>VS().indexOf(parts(w).v)>=0&&ok(w));
const pseOf=()=>PSEW.filter(w=>VS().indexOf(parts(w).v)>=0&&ok(w));
const CO=['b','d','g','m','n','p','t','x'];
function onOK(i,v){if(i==='c'||i==='g')return 'aou'.indexOf(v)>=0;if(i==='k')return 'ei'.indexOf(v)>=0;return true}
const CF={b:'pd',d:'tb',p:'bt',t:'dp',m:'n',n:'m',g:'kd',k:'g',c:'g',f:'hp',s:'z',z:'s',h:'f',j:'g',l:'r',r:'l',w:'r',x:'kp'};
/* 跟 w 只 差 一個 音（母音、字首 或 字尾 換 成 容易 搞混 的）*/
function near(w,n,realOnly){const p=parts(w),out=[];const add=x=>{if(x!==w&&out.indexOf(x)<0&&ok(x)&&(!realOnly||REAL[x]))out.push(x)};
  SH(VS().filter(v=>v!==p.v)).forEach(v=>{if(onOK(p.i,v))add(p.i+v+p.e)});
  SH((CF[p.e]||'').split('')).forEach(e=>{if(CO.indexOf(e)>=0)add(p.i+p.v+e)});
  SH((CF[p.i]||'').split('')).forEach(i=>{if(onOK(i,p.v))add(i+p.v+p.e)});
  const pool=realOnly?realOf():realOf().concat(pseOf());for(const x of SH(pool)){if(out.length>=n*3)break;add(x)}
  return SH(out.slice(0,Math.max(n*2,n))).slice(0,n)}
/* 第四十九次 老師：拉霸機 wam、hot 三 個 聲音 難 分；top 的 字尾 p 難 聽 ➜ 拉霸機（只 用 耳朵 選）的 錯 選項：
   ① 一個 換 母音、一個 換 子音（兩個 錯 的 不 在 同 一個 地方）
   ② 母音 不 用 最 難 分 的 一對（a／e、e／i、o／u；w 後面 的 a／o）
   ③ 字尾 換 成「同 一個 地方 發音、但 方式 不同」：p／b ↔ m、t／d ↔ n、g ↔ d、x ↔ t（嘴型 一樣，耳朵 聽得 出 差別）*/
const HARDV={a:'e',e:'ai',i:'e',o:'u',u:'o'};
const CNEAR={b:'m',p:'m',m:'b',d:'n',t:'n',n:'d',g:'d',x:'t'};
function slotNear(w){const p=parts(w),out=[];const okx=x=>x!==w&&out.indexOf(x)<0&&ok(x);
  const vs=SH(VS().filter(v=>v!==p.v&&HARDV[p.v].indexOf(v)<0&&!(p.i==='w'&&'ao'.indexOf(v)>=0&&'ao'.indexOf(p.v)>=0)&&onOK(p.i,v)));
  for(const v of vs){if(okx(p.i+v+p.e)){out.push(p.i+v+p.e);break}}
  const cs=SH([...(CNEAR[p.e]||'').split('').map(e=>p.i+p.v+e),...(CF[p.i]||'').split('').filter(i=>onOK(i,p.v)).map(i=>i+p.v+p.e)]);
  for(const x of cs){if(out.length>=2)break;if(okx(x))out.push(x)}
  /* 不夠 兩個：只 換 一個 地方（其他 字首、其他 字尾），一樣 避開 最 難 分 的 母音 */
  if(out.length<2)for(const x of SH([...'bdfghjklmnprstvwz'].filter(i=>i!==p.i&&onOK(i,p.v)).map(i=>i+p.v+p.e).concat(CO.filter(e=>e!==p.e).map(e=>p.i+p.v+e)))){if(out.length>=2)break;if(okx(x))out.push(x)}
  return out.slice(0,2)}
/* ══ 方塊（雙語 注音／KK／IPA，跟 字卡 一樣 的 顏色）：一個 字母 一組 ══ */
function unitTiles(w,md){md=md||MD;const p=parts(w),C=PH.CONS,V=VOWS[p.v],out=[[],[],[]];
  const pick=e=>md==='zh'?e.zh:md==='kk'?e.kk:e.ipa;
  const ik=(p.i==='c'||p.i==='g')?p.i+'_'+(PH.SOFT.indexOf(p.v)>=0?'soft':'hard'):p.i,ie=C[ik]||PH2.CONS2[p.i];
  if(md==='zh'&&ie.stack)out[0].push({t:ie.zh,bg:PH.CC,stack:1});else [].concat(pick(ie)).forEach((z,k)=>out[0].push({t:z,bg:PH.CC,sup:md==='zh'&&k===0&&!Array.isArray(ie.zh)?ie.sup:null}));
  const ve=PH.VOW[p.v];out[1].push({t:pick(ve),sup:md==='zh'?ve.sup:null,bg:ve.bg,v:1});
  const ek={l:'l_end',d:'d_end',m:'m_end',n:'n_end',r:'r_end',g:'g_end',p:'p_end',f:'f_end',t:'t_end'}[p.e]||p.e,ee=C[ek];
  [].concat(pick(ee)).forEach((z,k)=>out[2].push({t:z,bg:PH.CC,sup:md==='zh'?(Array.isArray(ee.sup)?ee.sup[k]:(k===0?ee.sup:null)):null}));return out}
function tileHTML(T,md,tw){md=md||MD;return '<span class="tls"'+(tw?' data-tw="'+tw+'"':'')+'>'+T.map(x=>'<span class="tl'+(md==='zh'?'':' ph')+(x.stack?' stk':'')+(x.dark?' dk':'')+'" style="background:'+x.bg+'">'+(x.stack?x.t.map(s=>'<span>'+s+'</span>').join(''):x.t)+(x.sup?'<span class="sup">'+x.sup+'</span>':'')+'</span>').join('')+'</span>'}
const allTiles=w=>tileHTML([].concat(...unitTiles(w)),null,w+'|a');
/* 第四十九次 老師：小學堂 的〔注音｜KK｜IPA〕不 能 馬上 換 ➜ 畫面 上 所有 字母 下面 的 方塊 當場 重畫 */
function retile(){document.querySelectorAll('[data-tw]').forEach(el=>{const [w,j]=el.dataset.tw.split('|');if(!parts(w))return;const U=unitTiles(w);el.outerHTML=tileHTML(j==='a'?[].concat(...U):U[+j],null,el.dataset.tw)});document.querySelectorAll('[data-bt]').forEach(el=>{const i=el.dataset.bt.lastIndexOf('|');el.outerHTML=bkTiles(el.dataset.bt.slice(0,i),+el.dataset.bt.slice(i+1))})}
function wordHTML(w){const p=parts(w);return p?'<span class="wd">'+p.i+'<span class="v">'+p.v+'</span>'+p.e+'</span>':'<span class="wd">'+w+'</span>'}
/* 字母（大）＋ 正下方 方塊；點 一個 字母 ＝ 唸 那個 音 */
function letRow(w,sz,id){const p=parts(w),T=unitTiles(w),L=[p.i,p.v,p.e];
  return '<div class="lt" id="'+(id||'lr')+'" data-w="'+w+'">'+L.map((x,k)=>'<div class="u" data-u="'+k+'"><span class="L'+(k===1?' v':'')+'" style="font-size:'+(sz||110)+'px'+(k===1?';color:#000;background:var(--vowel);border-radius:.14em;padding:0 .06em':'')+'">'+x+'</span>'+tileHTML(T[k],null,w+'|'+k)+'</div>').join('')+'</div>'}
/* 一個 一個 唸（唸到 的 字母 稍微 放大 發亮），三個 唸完 一起 亮＋唸 整個 字 */
async function blend(root,w,full){const p=parts(w),us=[...root.querySelectorAll('.u')];
  for(let k=0;k<3;k++){if(!us[k])continue;us[k].classList.add('hl');await say(sOf(p,k));await wait(220);us[k].classList.remove('hl');await wait(80)}
  if(full===false)return;us.forEach(u=>u.classList.add('hl'));await say(codeOf(w));await wait(350);us.forEach(u=>u.classList.remove('hl'))}
/* 第五十次（老師 第 10 點）小學堂 拼法：方式 1 ＝ s＋i 先 合（si）➜ 接 x ➜ six；方式 2 ＝ s ➜ i＋x 先 合（ix）➜ six。唸到 的 字母 稍微 放大 發亮 */
let LBM=LS.g('lbm',1),LBT=0;
const lbTxt=w=>{const p=parts(w);return LBM===1?p.i+p.v+' ＋ '+p.e+' ➜ '+w:p.i+' ＋ '+p.v+p.e+' ➜ '+w};
async function blend2(root,w,m,dead){dead=dead||(()=>false);const p=parts(w),us=[...root.querySelectorAll('.u')],c=codeOf(w),on=a=>{us.forEach((u,k)=>u.classList.toggle('hl',a.indexOf(k)>=0))};
  const steps=m===1?[[[0,1],PH2.partCode(c,'iv')],[[2],sOf(p,2)],[[0,1,2],c]]:[[[0],sOf(p,0)],[[1,2],PH2.partCode(c,'ve')],[[0,1,2],c]];
  root.classList.add('j1');for(const [ks,au] of steps){if(dead())break;on(ks);if(ks.length===3)root.classList.add('j2');await say(au);await wait(450)}on([])}
function bindLet(root){root.addEventListener('click',e=>{const u=e.target.closest('.u');if(!u)return;const w=u.closest('.lt').dataset.w,k=+u.dataset.u;u.classList.add('hl');say(sOf(parts(w),k)).then(()=>setTimeout(()=>u.classList.remove('hl'),150))})}
/* ══ 嘴巴 提示（容易 搞混 的 音）══ */
/* 第四十九次 老師：錯題 解析 刪 多餘 的 字、圖示、例字（例：「嘴巴 扁扁、小小 的（insect）」）➜ 只 留 一個 關鍵 差別；母音 不 寫 說明 */
const CUE={b:'喉嚨 震動',p:'吹 氣',d:'喉嚨 震動',t:'吹 氣',m:'閉 嘴',n:'張 嘴',g:'喉嚨 震動',k:'吹 氣',c:'吹 氣',
  f:'吹 氣',v:'震動',s:'不 震動',z:'震動',a:'',e:'',i:'',o:'',u:''};
/* 小學堂 的 母音 聚光燈 照舊（老師 只 說 改 錯題 解析）*/
const LCUE={a:'😮 嘴巴 張 大 大（🍎 apple）',e:'🙂 嘴巴 張 小 一點（🥚 egg）',i:'😬 嘴巴 扁扁、小小 的（🐛 insect）',o:'😲 嘴巴 張 大 圓圓（🐙 octopus）',u:'😐 嘴巴 放鬆 ㄜ（☂️ umbrella）'};
const cue=x=>CUE[x]?'（'+CUE[x]+'）':'';
const VKEY={a:['🍎','apple'],e:['🥚','egg'],i:['🐛','insect'],o:['🐙','octopus'],u:['☂️','umbrella']};
function diffTip(w,x){if(!x||!parts(x))return '';const p=parts(w),q=parts(x),out=[];
  [['i','開頭'],['v','中間'],['e','最後']].forEach(([k,n])=>{if(p[k]!==q[k])out.push(n+'：<s>'+q[k]+'</s>'+cue(q[k])+' ➜ <b>'+p[k]+'</b>'+cue(p[k]))});
  return out.join('<br>')}
/* ══ 圖 ══ */
const SVG={where:'<svg viewBox="0 0 100 100" width="1.15em" height="1.15em"><rect x="6" y="58" width="58" height="36" rx="6" fill="#2E7D5B"/><path d="M6 76h58M30 58v36" stroke="#5FBF8F" stroke-width="3"/><circle cx="17" cy="67" r="5" fill="#FFD54A"/><circle cx="50" cy="86" r="4" fill="#FF7A7A"/><circle cx="58" cy="40" r="27" fill="rgba(170,225,255,.35)" stroke="#FFD54A" stroke-width="8"/><path d="M77 60l15 15" stroke="#8D6E63" stroke-width="11" stroke-linecap="round"/><text x="58" y="52" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="36" fill="#fff" stroke="#1A237E" stroke-width="2">?</text></svg>',
  thin:'<svg viewBox="0 0 60 90" width="1em" height="1.3em"><circle cx="30" cy="14" r="9" fill="#FFD7A8"/><rect x="26" y="25" width="8" height="34" rx="4" fill="#4FC3F7"/><rect x="26" y="58" width="3.5" height="28" rx="2" fill="#37474F"/><rect x="30.5" y="58" width="3.5" height="28" rx="2" fill="#37474F"/><rect x="20" y="27" width="3" height="26" rx="1.5" fill="#FFD7A8"/><rect x="37" y="27" width="3" height="26" rx="1.5" fill="#FFD7A8"/></svg>',
  tall:'<svg viewBox="0 0 90 90" width="1.2em" height="1.2em"><g opacity=".45"><circle cx="20" cy="52" r="7" fill="#ccc"/><rect x="13" y="60" width="14" height="28" rx="5" fill="#999"/></g><circle cx="58" cy="12" r="9" fill="#FFD7A8"/><rect x="49" y="22" width="18" height="66" rx="6" fill="#FFC21A"/><path d="M80 80V12m-6 8 6-8 6 8" stroke="#2EE59D" stroke-width="4" fill="none"/></svg>',
  short:'<svg viewBox="0 0 90 90" width="1.2em" height="1.2em"><g opacity=".45"><circle cx="58" cy="12" r="9" fill="#ccc"/><rect x="49" y="22" width="18" height="66" rx="6" fill="#999"/></g><circle cx="20" cy="52" r="7" fill="#FFD7A8"/><rect x="13" y="60" width="14" height="28" rx="5" fill="#FFC21A"/><path d="M36 50v34m-6-8 6 8 6-8" stroke="#2EE59D" stroke-width="4" fill="none"/></svg>'};
const ICON=ic=>ic&&ic.indexOf('svg:')===0?SVG[ic.slice(4)]:ic;
/* ══ 遊戲 共用 引擎 ══ */
let G=null;
const alive=g=>G&&G===g;
function book(w){if(!REAL[w]&&!BKW[w])return false;const b=LS.g('book',[]);if(b.indexOf(w)>=0)return false;b.push(w);LS.s('book',b);return true}
function timer(sec,onEnd){const bar=H('div','tmr','<i></i><b></b>'),i=bar.firstChild,lb=bar.lastChild,T=sec*1000*(SLOW>1?1.5:1);let t0=Date.now(),stop=false,pz=0,pt=0;
  const tk=setInterval(()=>{if(stop||pz||PAUSED)return;const f=1-(Date.now()-t0-pt)/T;i.style.transform='scaleX('+Math.max(0,f)+')';lb.textContent=Math.max(0,Math.ceil(f*T/1000))+' 秒';bar.classList.toggle('low',f<.25);if(f<=0){clearInterval(tk);stop=true;onEnd()}},150);
  return {el:bar,left:()=>Math.max(0,1-(Date.now()-t0-pt)/T),sec:()=>(Date.now()-t0-pt)/1000,stop(){stop=true;clearInterval(tk)},pause(){if(!pz)pz=Date.now()},go(){if(pz){pt+=Date.now()-pz;pz=0}}}}
function hud(g){const N=nq(g),big=N>5;const gems=big?'':Array.from({length:N},(_,k)=>'<i class="'+(k<g.res.length?(g.res[k]?'ok':'no'):k===g.q?'now':'')+(k===N-1?' boss':'')+'">'+(k<g.res.length?(g.res[k]?'✔':'✖'):k===N-1?'👑':'')+'</i>').join('');
  const fv=g.combo>=2;document.body.classList.toggle('fever',fv);const cur=g.k==='c25'&&g.seq?GM[g.seq[g.q]]:null;
  return '<div class="hud">'+(big?'<div class="c25p"><b>第 '+(g.q+1)+' ／ '+N+' 題</b><span class="c25b"><i style="width:'+Math.round(g.q/N*100)+'%"></i></span><span>✅ '+g.ok+'</span></div>':'<div class="gems">'+gems+'</div>')+'<span class="chip sc">⭐ <b>'+g.score+'</b></span><span class="chip fv'+(fv?' on':'')+'">'+(fv?'🔥 連對 加倍：這一題 ✖2':'🔥 再 對 '+(2-g.combo)+' 題 ➜ 加倍')+'</span>'+(g.q===N-1?'<span class="chip" style="color:#FFB25B">👑 最後 一題 ✖2</span>':'')+'</div>'+
   (cur?'<div class="c25g">'+(g.q>=15?'📗 課本 單字　':'')+cur.ic+' '+cur.nm+'<small>'+cur.how.split('。')[0]+'</small></div>':'')}
function stage(g,html,sec,onEnd){const s=$('#game');s.innerHTML=hud(g)+'<div id="tm"></div>'+html;{const N=nq(g),b=g.q===N-1?'👑 最後 一題：答對 分數 ✖2':g.combo===2?'🔥 連對 2 題！這一題 答對 分數 ✖2':'';if(b&&!window.__PHFAST){const e=H('div','qban',b);document.body.appendChild(e);setTimeout(()=>e.remove(),1700)}}if(sec){const t=timer(sec,onEnd);g.t=t;$('#tm').appendChild(t.el)}else g.t=null}
function conf(n){const C=['#FFD54A','#2EE59D','#3BE8FF','#FF4FA3','#9B7BFF','#FF9F43'];for(let k=0;k<n;k++){const c=H('div','conf');c.style.left=(Math.random()*98)+'vw';c.style.background=R(C);c.style.animationDuration=(1.4+Math.random()*1.4)+'s';c.style.animationDelay=(Math.random()*.5)+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),3600)}}
async function countdown(){for(const n of ['3','2','1','GO!']){const c=H('div','cnt','<b>'+n+'</b>');document.body.appendChild(c);await wait(n==='GO!'?650:700);c.remove()}}
/* 答一題：記 成績、加分、答對頁／答錯頁 */
async function answer(g,okk,pick,w,o){o=o||{};if(g.lock===g.q)return;g.lock=g.q;if(g.t)g.t.stop();
  const sec=g.t?g.t.sec():0,left=g.t?g.t.left():0,idx=g.k==='c25'&&C25B.indexOf(g.seq[g.q])>=0?ITEMS.length+BWL.indexOf(w):o.idx!=null?o.idx:ITEMS.indexOf(w);
  g.Q.push([okk?1:0,okk?0:(pick==null?-1:1),Math.round(sec*10)/10,pick!=null&&sec<1?1:0,okk?Math.round(left*1000)/1000:0,idx]);g.res.push(okk?1:0);
  if(okk){const fv=g.combo>=2,boss=g.q===nq(g)-1,sp=Math.round(50*left),nw=book(w),qk=nw&&left>=0.5,pts=(100+sp)*(fv?2:1)*(boss?2:1)*(nw?2:1)*(qk?2:1);g.score+=pts;g.combo++;g.ok++;
    /* 第四十九次 第 7-(2) 點（老師 選 甲）：第一次 收進 圖鑑 的 字 ＝ 這一題 ✖2；而且 答得 快（剩 一半 以上 的 時間）再 ✖2 */
    const gn=H('div','gain','<div class="n">＋'+pts+'</div><div class="f"><span>✅ 答對 100</span><span>⚡ 快 ＋'+sp+'</span>'+(fv?'<span>🔥 連對 ✖2</span>':'')+(boss?'<span>👑 最後 一題 ✖2</span>':'')+(nw?'<span>📖 新 收集 ✖2</span>':'')+(qk?'<span>⚡ 快 收集 ✖2</span>':'')+'</div>');document.body.appendChild(gn);if(window.__PHGAIN)window.__PHGAIN.push(gn.textContent);setTimeout(()=>gn.remove(),1500);conf(fv||boss||nw?40:16);
    await (o.okPage||okPage)(g,w,o)}
  else{g.combo=0;g.wrong.push(o.bw||w);await (o.noPage||noPage)(g,w,pick,o)}
  if(!alive(g))return;g.q++;if(typeof g.onQ==='function')g.onQ();if(g.q>=nq(g)){end(g);return}GM[g.k].q(g)}
/* ✅ 答對了！（一頁：字＋音標＋圖＋唸 一次）*/
async function okPage(g,w,o){const f=H('div','fb','<div class="box pop"><h3>✅ 答對了！</h3>'+(o.okHTML||(parts(w)?letRow(w,96,'okr'):'<div class="cw">'+w+'</div>'))+(REAL[w]?'<div class="em">'+REAL[w].em+'</div><div class="zh">'+REAL[w].zh+'</div>':'')+'</div>');document.body.appendChild(f);
  if(o.okRun)await o.okRun(f);else if(parts(w))await blend(f.querySelector('.lt'),w);else await say(o.au||codeOf(w));await wait(500);f.remove()}
/* ❌ 答錯頁（綠底）：你的 答案、正確 答案（字母＋音標）、為什麼、唸 兩次、唸完 才〔▶ 繼續〕*/
function noPage(g,w,pick,o){return new Promise(async res=>{const yp=o.yours!=null?o.yours:(pick!=null&&typeof pick==='string'?pick:null);
  const f=H('div','fb no','<div class="box pop"><h3>'+(pick==null&&!o.yours?'⏰ 時間 到':'❌ 答錯 了')+'</h3>'+(yp?'<div class="yw">你的 答案：<s>'+yp+'</s></div>':'')+
   '<div style="font-size:22px;color:#9FF0C8;margin-top:6px">✅ 正確 答案</div>'+(o.noHTML||(parts(w)?letRow(w,100,'nor'):'<div class="cw">'+w+'</div>'))+(REAL[w]?'<div class="em">'+REAL[w].em+'</div><div class="zh">'+REAL[w].zh+'</div>':'')+
   '<div class="tip">'+(o.tip||diffTip(w,yp))+'</div><div class="row"><button class="say" id="fbRe">🔊 再聽一次</button><button class="big" id="fbGo" hidden>▶ 繼續</button></div></div>');
  document.body.appendChild(f);const lr=f.querySelector('.lt');if(lr)bindLet(lr);
  const run=async()=>{if(o.noRun){await o.noRun(f);return}if(lr){await blend(lr,w);await wait(300);await say(codeOf(w))}else{await say(o.au||codeOf(w));await wait(400);await say(o.au||codeOf(w))}};
  f.querySelector('#fbRe').onclick=()=>run();await run();if(!document.body.contains(f)){res();return}const b=f.querySelector('#fbGo');b.hidden=false;b.onclick=()=>{f.remove();res()};if(window.__PHAUTO)setTimeout(()=>b.click(),30)})}
/* 結果 */
function end(g){document.body.classList.remove('fever');const N=nq(g),fr=g.ok/N,st=fr>=1?3:fr>=.8?2:fr>=.6?1:0,rk=fr>=1?'S':fr>=.8?'A':fr>=.6?'B':'C',best=LS.g('best_'+g.k,0),nb=g.score>best;if(nb)LS.s('best_'+g.k,g.score);
  rec(g);if(typeof g.onEnd==='function')g.onEnd();const W=[...new Set(g.wrong)];
  const s=$('#game');s.innerHTML='<div class="end"><div style="font-size:30px;font-weight:900">'+GM[g.k].ic+' '+GM[g.k].nm+'</div><div class="rk">'+rk+'</div><div class="stars">'+[0,1,2].map(k=>'<i>'+(k<st?'⭐':'☆')+'</i>').join('')+'</div>'+
   '<div class="sc">✅ '+g.ok+' ／ '+N+'　⭐ <b>'+g.score+'</b></div>'+(nb?'<div class="nb">🏆 新 紀錄！</div>':'<div class="nb" style="color:#C9D4FF">最佳 紀錄 ⭐ '+best+'</div>')+
   (W.length?'<h2>📒 錯題 再 聽 一次</h2><div class="rv">'+W.map(w=>'<div class="r" data-rv="'+w+'">'+(parts(w)?wordHTML(w)+allTiles(w):'<span class="wd" style="font-size:40px">'+w+'</span>')+'<span class="zh">'+(REAL[w]?REAL[w].em+' '+REAL[w].zh:BKW[w]?ICON(BKW[w].ic)+' '+BKW[w].zh:'🔮 魔法 咒語')+'</span><button data-rw="'+w+'">🔊</button></div>').join('')+'</div>':'<h2>💯 全部 答對！太 厲害 了！</h2>')+
   (W.length?'<div class="lk" id="lk">🔒 先 聽完 每 一個 錯題 的 正確 發音</div>':'')+
   '<div class="row" id="endRow"'+(W.length?' hidden':'')+'><button class="big" data-go="'+g.k+'">🔁 再 玩 一次</button><button class="big cy" id="back">🎮 換 遊戲</button></div></div>';
  /* 第四十九次 老師：遊戲 結束 一定 要 聽 過 一次 剛才 答錯 的 字 的 正確 發音 ➜ 每 一個 都 唸 完（✔）才 出現〔再 玩〕〔換 遊戲〕*/
  const heard=new Set(),unlock=()=>{if(heard.size>=W.length){const r=s.querySelector('#endRow'),l=s.querySelector('#lk');if(r)r.hidden=false;if(l)l.remove()}};
  const hear=async w=>{const r=s.querySelector('[data-rv="'+w+'"]');if(r)r.classList.add('on');await say(auOf(w));if(r){r.classList.remove('on');r.classList.add('heard')}heard.add(w);unlock()};
  s.onclick=e=>{const rw=e.target.closest('[data-rw]');if(rw)hear(rw.dataset.rw);if(e.target.closest('#back'))lobby()};if(st>=2)conf(60);
  (async()=>{for(const w of W){if(!alive(g))return;await hear(w);await wait(500)}})()}
const auOf=w=>BKW[w]?'bk_'+w.replace(/ /g,'_'):codeOf(w);
/* 成績（老師看板）：g年級gm_ph-遊戲；一題 [答對, 0 對／1 錯／-1 時間到, 秒, 1 秒 內, 剩下 比例, 第幾題]；「題目」格式 ＝ 做完 5 題 就 算 練習 次數 */
function rec(g){try{if(typeof scLive!=='function'||!scLive()||!g.Q.length||g.sent)return;g.sent=1;const fast=g.Q.reduce((t,x)=>t+x[3],0);
  scQAdd({id:SCID,set:'g'+(g.k==='c25'&&g.gr?g.gr:scGr())+'gm_ph-'+g.k,name:'🔤 自然發音｜'+GM[g.k].ic+' '+GM[g.k].nm,m:'q',qs:g.Q,raw:g.score,fix:0,mp:0,mw:0,sec:Math.round((Date.now()-g.t0)/1000),src:'school',dev:typeof SCDEV!=='undefined'?SCDEV:'',u:SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now()});
  if(window.__PHREC)window.__PHREC.push(g.k)}catch(e){}}
/* 開始 一個 遊戲：先 登入（老師看板 要 記 名字）➜ 開場 ➜ 3 2 1 GO */
function start(k,opt){opt=opt||{};if(typeof SCON!=='undefined'&&SCON&&!SCID&&typeof scLogin==='function'){scLogin(function(){SCH.close();if(typeof scBar==='function')scBar();start(k,opt)});return}
  G={k:k,q:0,ok:0,score:0,combo:0,res:[],wrong:[],Q:[],t0:Date.now(),lock:-1};if(k==='c25'){G.N=C25N;G.seq=c25Seq();G.gr=opt.gr||c25Gr();G.bw=bkOrder(G.gr)}Object.assign(G,opt.g||{});const g=G,M=GM[k];$('#lobby').hidden=true;const s=$('#game');s.hidden=false;s.onclick=null;$('#quit').hidden=false;$('#ttl').textContent=M.ic+' '+M.nm;
  s.innerHTML='<div class="intro pnl pop"><div class="ie">'+M.ic+'</div><h2>'+M.nm+'</h2><div class="how">'+M.how+'</div><div class="rules">'+(k==='c25'?'<span>📝 25 題：前 15 題 CVC＋最後 10 題 課本（'+(G.gr===4?'四年級 My Home':'三年級 We Can Help')+'）</span><span>🎲 每 一回合 遊戲 組合 都 不一樣</span>':''+(k==='line'?'<span>⚔️ 8 回合</span><span>⏱ 每 回合 30 秒</span>':'<span>📝 一局 5 題</span><span>⏱ 每題 '+M.T+' 秒</span>'))+'<span>⚡ 愈 快 分數 愈 高</span></div><div class="rxb"><button class="say" data-rx="fever">🔥 連對 加倍 是 什麼？</button><button class="say" data-rx="boss">👑 最後 一題 ✖2 是 什麼？</button></div><button class="big" id="go">▶ 開始！</button></div>';
  $('#go').onclick=async()=>{await countdown();if(alive(g))M.q(g)};if(window.__PHAUTO){$('#go').click();return}
  if(!LS.g('rx_seen',0)){LS.s('rx_seen',1);ruleShow('fever',()=>ruleShow('boss'))}}
/* ══ 🎰 拉霸機 ══ */
function slotQ(g){const real=Math.random()<.5&&realOf().length,w=real?R(realOf()):R(pseOf()),p=parts(w);g.w=w;
  stage(g,'<div class="ask">① 拉 拉桿 ➜ ② 聽 每 一個 字母 的 音 ➜ ③ 先 自己 唸 ➜ ④ 選 對 的 聲音</div><div class="slot"><div class="cab"><div class="marq"><i></i>C · V · C<i></i></div><div class="win">'+
   [0,1,2].map(k=>'<div class="col"><div class="reel'+(k===1?' v':'')+'" id="r'+k+'" data-u="'+k+'"><b>?</b></div><div class="zt" id="z'+k+'"></div></div>').join('')+'</div><div class="plate">🔤 點 字母 ＝ 聽 它 的 音</div></div>'+
   '<button class="lever" id="lev" aria-label="拉 拉桿"><span class="rod"></span><span class="knob"></span></button><div class="side"><button class="big" id="spin">🎰 拉 一下！</button><div class="ask" id="msg"></div><div id="chz" class="choose"></div></div></div>');
  const T=unitTiles(w),sv=[p.i,p.v,p.e],L=[['b','p','m','f','d','t','n','l','h','j','w','r','s','z','c','g','k'],VS(),CO];
  const reelClick=e=>{const r=e.target.closest('.reel');if(!r||!r.classList.contains('done'))return;r.classList.add('hl');say(sOf(p,+r.dataset.u)).then(()=>setTimeout(()=>r.classList.remove('hl'),150))};
  $('.win').addEventListener('click',reelClick);
  let go=false;const run=async()=>{if(go||!alive(g))return;go=true;$('#spin').disabled=true;$('#lev').classList.add('pull');setTimeout(()=>{const l=$('#lev');if(l)l.classList.remove('pull')},520);
    [0,1,2].forEach(k=>{const r=$('#r'+k);r.classList.add('spin');const b=r.querySelector('b');b._iv=setInterval(()=>{b.textContent=R(L[k])},65)});
    for(let k=0;k<3;k++){await wait(k?600:850);if(!alive(g))return;const r=$('#r'+k),b=r.querySelector('b');clearInterval(b._iv);r.classList.remove('spin');b.textContent=sv[k];r.classList.add('stop','done','hl');
      $('#z'+k).innerHTML=tileHTML(T[k],null,w+'|'+k);await say(sOf(p,k));await wait(150);r.classList.remove('hl')}
    if(!alive(g))return;const m=$('#msg');m.innerHTML='🗣 先 自己 唸 唸 看！<span class="cd" id="cd">3</span>';[0,1,2].forEach(k=>$('#r'+k).classList.add('hl'));
    for(let c=3;c>0;c--){if(!alive(g))return;$('#cd').textContent=c;await wait(1000)}[0,1,2].forEach(k=>$('#r'+k).classList.remove('hl'));
    slotPick(g,w)};
  $('#spin').onclick=run;$('#lev').onclick=run;if(window.__PHAUTO)run()}
async function slotPick(g,w){const m=$('#msg');$('#spin').hidden=true;m.innerHTML='🎧 聽 3 個 聲音，選出 <span class="k">拉霸機 上 的 字</span>';
  const o=SH([w].concat(slotNear(w)));const box=$('#chz');
  box.innerHTML=o.map((x,k)=>'<div class="ch" data-k="'+k+'"><button class="sp" data-sp="'+k+'">🔊 '+(k+1)+'</button><button class="pk" data-pk="'+k+'" disabled>✔ 選 '+(k+1)+'</button></div>').join('');
  for(let k=0;k<o.length;k++){if(!alive(g))return;const c=box.querySelector('[data-k="'+k+'"]');c.classList.add('playing');await say(codeOf(o[k]));c.classList.remove('playing');await wait(300)}
  if(!alive(g))return;box.querySelectorAll('.pk').forEach(b=>b.disabled=false);const t=timer(GM.slot.T,()=>fin(null));g.t=t;$('#tm').appendChild(t.el);
  box.onclick=e=>{const sp=e.target.closest('[data-sp]');if(sp){say(codeOf(o[+sp.dataset.sp]));return}const pk=e.target.closest('[data-pk]');if(pk)fin(+pk.dataset.pk)};
  function fin(k){const right=k!=null&&o[k]===w;answer(g,right,k==null?null:'聲音 '+(k+1),w,{okPage:slotReveal,noPage:(g,w,pk,oo)=>noPage(g,w,pk,{tip:diffTip(w,k!=null?o[k]:null),yours:k!=null?o[k]:null})})}
  if(window.__PHAUTO)fin(window.__PHWRONG?o.findIndex(x=>x!==w):o.indexOf(w))}
/* 拉霸機 答對：一個 一個 唸 ➜ 一起 亮＋唸 整個 字 ➜ 真的 字（💡 圖 ＝ 意思）或 🔮 魔法 咒語 */
async function slotReveal(g,w){const real=!!REAL[w];
  const f=H('div','fb','<div class="box pop"><h3>✅ 答對了！</h3>'+letRow(w,104,'rv1')+'<div class="mean" id="mean"></div></div>');document.body.appendChild(f);
  await blend(f.querySelector('.lt'),w);const m=f.querySelector('#mean');
  if(real){const nw=book(w);m.innerHTML='<div class="step pop">💡 這是 一個 <b>真的 英文 字</b>！</div><div class="eqr"><span class="wd" style="font-size:64px">'+w+'</span><span class="eq">＝</span><span class="em pop" style="animation-delay:.5s">'+REAL[w].em+'</span><span class="zh pop" style="animation-delay:.8s">'+REAL[w].zh+'</span></div><div class="step pop" style="animation-delay:1.2s">👀 圖 告訴 你 它 的 <b>意思</b>'+(nw?'　📖 收進 你 的 單字 圖鑑！':'')+'</div>';conf(30);await say(codeOf(w));await wait(1900)}
  else{m.innerHTML='<div class="step pop">🔮 <b>魔法 咒語</b>：不是 真的 英文 字（所以 沒有 圖）</div><div class="step pop" style="animation-delay:.5s">✨ 但是 你 會 唸 了 ＝ 你 學會 拼讀 了！</div>';await wait(2000)}
  f.remove()}
/* ══ 🛸 聽音 打 飛碟 ══ */
function ufoQ(g){const w=R(realOf().concat(pseOf())),o=SH([w].concat(near(w,3)));g.w=w;
  stage(g,'<div class="ask">🔊 聽 ➜ 打下 <span class="k">寫著 那個 字</span> 的 飛碟 <button class="say" id="rp">🔊 再 聽</button></div><div class="sky" id="sky"><div class="ship">🚀</div></div>',GM.ufo.T,()=>hit(null));
  const P=[[6,8],[54,6],[10,50],[56,48]];o.forEach((x,k)=>{const u=H('button','ufo','<span class="u">🛸</span><span class="w">'+x+'</span>');u.style.left=P[k][0]+'%';u.style.top=P[k][1]+'%';u.style.animationDelay=(-k*.8)+'s';u.dataset.w=x;$('#sky').appendChild(u)});
  const play=()=>say(codeOf(w));play();$('#rp').onclick=play;$('#sky').onclick=e=>{const u=e.target.closest('.ufo');if(u)hit(u)};
  function hit(u){if(g.lock===g.q)return;const sky=$('#sky');if(u){const r=u.getBoundingClientRect(),sr=sky.getBoundingClientRect(),dx=r.left+r.width/2-sr.left-sr.width/2,dy=sr.height-(r.top+r.height/2-sr.top),L=H('div','laser');L.style.height=Math.hypot(dx,dy)+'px';L.style.transform='rotate('+Math.atan2(dx,dy)*180/Math.PI+'deg)';sky.appendChild(L);setTimeout(()=>L.remove(),300);if(u.dataset.w===w)u.classList.add('boom');else u.classList.add('shake')}
    answer(g,!!u&&u.dataset.w===w,u?u.dataset.w:null,w)}
  if(window.__PHAUTO)hit([...$$('.ufo')].find(x=>window.__PHWRONG?x.dataset.w!==w:x.dataset.w===w))}
/* ══ 🔐 聽音 拼字 保險箱 ══ */
function vaultQ(g){const w=R(realOf()),p=parts(w);g.w=w;g.try=0;
  const CFV={b:'bpd',d:'dtb',p:'pbt',t:'tdp',m:'mnb',n:'nmd',g:'gkd',k:'kgc',c:'ckg',f:'fvh',s:'szc',z:'zs',h:'hfn',j:'jgz',l:'lrn',r:'rlw',w:'wrv',x:'xkp'};
  const opt=[SH(((CFV[p.i]||p.i)+'bdp').split('').filter((x,i,a)=>a.indexOf(x)===i).slice(0,4)),VS().slice(),SH(((CFV[p.e]||p.e)+'dtg').split('').filter((x,i,a)=>a.indexOf(x)===i&&CO.indexOf(x)>=0).slice(0,4))];
  [p.i,p.v,p.e].forEach((x,k)=>{if(opt[k].indexOf(x)<0)opt[k][0]=x});const want=[p.i,p.v,p.e];
  const cur=opt.map(a=>Math.floor(Math.random()*a.length));[0,1,2].forEach(k=>{if(opt[k][cur[k]]===want[k])cur[k]=(cur[k]+1)%opt[k].length});
  stage(g,'<div class="ask">🔊 聽 ➜ 轉 三個 密碼 輪 拼 出來 ➜〔🔓 開鎖〕<br><button class="say" id="rp">🔊 再 聽</button> <button class="say" id="slow">🐢 一個 音 一個 音 聽</button></div><div class="vault" id="vt"><div class="vlt">🔒 SAFE</div><div class="dials">'+
   [0,1,2].map(k=>'<div class="dial'+(k===1?' v':'')+'" id="d'+k+'"><button class="ar" data-a="'+k+'" data-d="-1">▲</button><div class="face"><b>'+opt[k][cur[k]]+'</b></div><button class="ar" data-a="'+k+'" data-d="1">▼</button><div class="cue" id="c'+k+'"></div></div>').join('')+
   '</div><div class="row"><button class="big" id="open">🔓 開鎖</button><button class="say" id="cmp" hidden>👂 比一比</button></div></div><div class="ask" id="msg"></div>',GM.vault.T,()=>chk(true));
  const play=()=>say(codeOf(w));play();$('#rp').onclick=play;
  $('#slow').onclick=async()=>{for(let k=0;k<3;k++){await say(sOf(p,k));await wait(280)}await say(codeOf(w))};
  $('#vt').onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;const k=+a.dataset.a;if($('#d'+k).classList.contains('okd'))return;cur[k]=(cur[k]+(+a.dataset.d)+opt[k].length)%opt[k].length;
    const f=$('#d'+k+' .face');f.querySelector('b').textContent=opt[k][cur[k]];f.classList.remove('flip');void f.offsetWidth;f.classList.add('flip');$('#d'+k).classList.remove('badd');$('#c'+k).textContent=''};
  $('#open').onclick=()=>chk(false);
  async function chk(tout){if(g.lock===g.q)return;const got=cur.map((c,k)=>opt[k][c]);
    if(!tout&&got.join('')===w){$('#vt').appendChild(H('div','door open',''));await wait(500);answer(g,true,null,w,{okRun:async f=>{await blend(f.querySelector('.lt'),w)}});return}
    g.try++;const mine=got.join('');
    if(g.try<2&&!tout){[0,1,2].forEach(k=>{const d=$('#d'+k);if(got[k]===want[k])d.classList.add('okd');else{d.classList.add('badd','shake');setTimeout(()=>d.classList.remove('shake'),460);$('#c'+k).textContent=k===1?'母音：再 聽 中間':k===0?'開頭：'+(CUE[got[k]]?'這個 是 '+CUE[got[k]]:'再 聽 一次'):'最後：'+(CUE[got[k]]?'這個 是 '+CUE[got[k]]:'再 聽 一次')}});
      $('#msg').innerHTML='綠色 的 對 了！紅色 的 再 轉 轉 看（按〔👂 比一比〕聽 你 拼 的 和 題目）';
      const cb=$('#cmp');if(ok(mine)){cb.hidden=false;cb.onclick=async()=>{$('#msg').innerHTML='👂 你 拼 的 <b class="wd">'+mine+'</b>：';await say(codeOf(mine));await wait(400);$('#msg').innerHTML='🎯 題目：';await say(codeOf(w))}}return}
    answer(g,false,tout?null:mine,w,{yours:tout?null:mine})}
  if(window.__PHAUTO){if(window.__PHWRONG){chk(false).then(()=>chk(false))}else{want.forEach((x,k)=>cur[k]=opt[k].indexOf(x));chk(false)}}}
/* ══ 🀄 看字 選 音標 ══ */
function zhuQ(g){const w=R(Math.random()<.5?realOf():pseOf()),p=parts(w),U=unitTiles(w);g.w=w;
  const vs=SH(VS().filter(v=>v!==p.v).filter(v=>onOK(p.i,v))).slice(0,2),opts=[{T:[].concat(...U),ok:1}];
  vs.forEach(v=>{const x=p.i+v+p.e;opts.push({T:[].concat(...unitTiles(x)),ok:0})});
  if(Math.random()<.5){const ic=(CF[p.i]||'').split('').filter(i=>onOK(i,p.v)&&parts(i+p.v+p.e))[0];if(ic)opts[opts.length-1]={T:[].concat(...unitTiles(ic+p.v+p.e)),ok:0}}
  const o=SH(opts);const nm=MD==='zh'?'雙語 注音':MD.toUpperCase();
  stage(g,'<div class="ask">👀 看 字 ➜ 選 對 的 <span class="k">'+nm+'</span></div><div class="word0">'+wordHTML(w)+'</div><div class="opts" id="ops">'+o.map((x,k)=>'<button class="opt" data-k="'+k+'">'+tileHTML(x.T)+'</button>').join('')+'</div>',GM.zhu.T,()=>pick(null));
  $('#ops').onclick=e=>{const b=e.target.closest('.opt');if(b)pick(+b.dataset.k)};
  function pick(k){if(k!=null)$('#ops').children[k].classList.add(o[k].ok?'good':'wrong');answer(g,k!=null&&!!o[k].ok,k==null?null:'第 '+(k+1)+' 排',w,{tip:'<b>'+p.v+'</b> ＝ '+(PH.VOW[p.v].zh+(PH.VOW[p.v].sup||''))})}
  if(window.__PHAUTO)pick(o.findIndex(x=>window.__PHWRONG?!x.ok:x.ok))}
/* ══ 🎈 字首音 氣球 ══ */
function balQ(g){const w=R(realOf()),p=parts(w);g.w=w;const L=SH([p.i].concat(SH((CF[p.i]||'').split('').concat(SH(['b','m','s','h','r','l','f','t'])).filter((x,i,a)=>x!==p.i&&a.indexOf(x)===i)).slice(0,3)));
  stage(g,'<div class="ask">🔊 聽 ➜ 戳破 <span class="k">第一個 字母</span> 的 氣球 <button class="say" id="rp">🔊 再 聽</button></div><div class="bsky" id="bs">'+L.map((x,k)=>'<button class="bal" data-l="'+x+'" style="left:'+(8+k*23)+'%;--c:'+['#FF4FA3','#3BE8FF','#FFD54A','#9B7BFF'][k]+';animation-delay:'+(-k*.7)+'s"><b>'+x+'</b><i></i></button>').join('')+'</div><div class="word0 sm">'+'<span class="wd"><span id="bi">_</span>'+p.v+p.e+'</span></div>',GM.bal.T,()=>pk(null));
  const play=()=>say(codeOf(w));play();$('#rp').onclick=play;$('#bs').onclick=e=>{const b=e.target.closest('.bal');if(b)pk(b)};
  function pk(b){if(b){b.classList.add(b.dataset.l===p.i?'popd':'shake');if(b.dataset.l===p.i)$('#bi').textContent=p.i}answer(g,!!b&&b.dataset.l===p.i,b?b.dataset.l:null,w,{yours:b?b.dataset.l+p.v+p.e:null,tip:b&&b.dataset.l!==p.i?'開頭：<s>'+b.dataset.l+'</s>'+cue(b.dataset.l)+' ➜ <b>'+p.i+'</b>'+cue(p.i):''})}
  if(window.__PHAUTO)pk([...$$('.bal')].find(x=>window.__PHWRONG?x.dataset.l!==p.i:x.dataset.l===p.i))}
/* ══ ⚔ 母音 對決 ══ */
function vowQ(g){const w=R(realOf()),p=parts(w);g.w=w;const V=VS();
  stage(g,'<div class="ask">🔊 聽 ➜ 中間 是 <span class="k">哪 一個 母音</span>？ <button class="say" id="rp">🔊 再 聽</button></div><div class="word0 sm"><span class="wd">'+p.i+'<span class="gap" id="vg">?</span>'+p.e+'</span></div><div class="vcards" id="vc">'+
   V.map(v=>'<div class="vcd" data-v="'+v+'"><button class="vk" data-v="'+v+'"><span class="ve">'+VKEY[v][0]+'</span><b>'+v+'</b><small>'+VKEY[v][1]+'</small></button><button class="vs" data-s="'+v+'">🔊 '+v+'</button></div>').join('')+'</div>',GM.vow.T,()=>pk(null));
  const play=()=>say(codeOf(w));play();$('#rp').onclick=play;
  $('#vc').onclick=e=>{const s=e.target.closest('[data-s]');if(s){say('s_'+PH.vowCode(VOWS[s.dataset.s]));return}const k=e.target.closest('.vk');if(k)pk(k.dataset.v)};
  function pk(v){if(v){$('#vg').textContent=v;$('#vg').classList.add(v===p.v?'okv':'nov')}answer(g,v===p.v,v,w,{yours:v?p.i+v+p.e:null,tip:v&&v!==p.v?'中間：<s>'+v+'</s> ➜ <b>'+p.v+'</b>':'',
    noRun:async f=>{await say('s_'+PH.vowCode(VOWS[p.v]));await wait(300);if(v&&v!==p.v){await say('s_'+PH.vowCode(VOWS[v]));await wait(300)}await blend(f.querySelector('.lt'),w)}})}
  if(window.__PHAUTO)pk(window.__PHWRONG?V.find(x=>x!==p.v):p.v)}
/* ══ 🎯 尾音 狙擊 ══ */
function endQ(g){const w=R(realOf()),p=parts(w);g.w=w;const E=SH([p.e].concat((CF[p.e]||'').split('').filter(x=>CO.indexOf(x)>=0&&x!==p.e)).concat(SH(CO.filter(x=>x!==p.e))).filter((x,i,a)=>a.indexOf(x)===i).slice(0,LV===1?3:4));
  stage(g,'<div class="ask">🔊 聽 ➜ <span class="k">最後 一個 音</span> 是 哪 一個？（瞄準 打下來）<button class="say" id="rp">🔊 再 聽</button></div><div class="word0 sm"><span class="wd">'+p.i+'<span class="v">'+p.v+'</span><span class="gap" id="eg">?</span></span></div><div class="tgts" id="tg">'+
   E.map(x=>'<button class="tgt" data-e="'+x+'"><span class="ring"></span><b>'+x+'</b><small>'+(CUE[x]?CUE[x].split('、')[0]:'')+'</small></button>').join('')+'</div>',GM.end.T,()=>pk(null));
  const play=()=>say(codeOf(w));play();$('#rp').onclick=play;$('#tg').onclick=e=>{const b=e.target.closest('.tgt');if(b)pk(b)};
  function pk(b){const e=b?b.dataset.e:null;if(b){b.classList.add(e===p.e?'hitd':'shake');$('#eg').textContent=e}answer(g,e===p.e,e,w,{yours:e?p.i+p.v+e:null,
    noRun:async f=>{await blend(f.querySelector('.lt'),w);await wait(300);await say(sOf(p,2))}})}
  if(window.__PHAUTO)pk([...$$('.tgt')].find(x=>window.__PHWRONG?x.dataset.e!==p.e:x.dataset.e===p.e))}
/* ══ 🪜 換 字母 階梯 ══ */
function ladStart(g){const RW=realOf().concat(pseOf()),nb=w=>RW.filter(x=>{let d=0;for(let k=0;k<3;k++)if(x[k]!==w[k])d++;return d===1});
  for(let t=0;t<80;t++){const c=[R(realOf())];while(c.length<=NQ){const n=SH(nb(c[c.length-1])).filter(x=>c.indexOf(x)<0&&REAL[x]);if(!n.length)break;c.push(n[0])}if(c.length>NQ)return c}
  const c=[R(realOf())];while(c.length<=NQ){const n=SH(nb(c[c.length-1])).filter(x=>c.indexOf(x)<0);c.push(n[0]||R(RW))}return c}
function ladQ(g){if(!g.ch)g.ch=ladStart(g);const cur=g.ch[g.q],w=g.ch[g.q+1];g.w=w;const RW=realOf().concat(pseOf());
  const nb=RW.filter(x=>{if(x===w||x===cur)return false;let d=0;for(let k=0;k<3;k++)if(x[k]!==cur[k])d++;return d===1});const o=SH([w].concat(SH(nb).slice(0,2)));
  stage(g,'<div class="ask">🪜 現在 在 <b class="wd">'+cur+'</b>　🔊 聽 ➜ <span class="k">只 換 一個 字母</span>，爬 上去！<button class="say" id="rp">🔊 再 聽</button></div><div class="lad"><div class="rails">'+
   g.ch.slice(0,NQ+1).map((x,k)=>'<div class="rung'+(k===g.q?' cur':'')+(k<g.q?' done':'')+'">'+(k<=g.q?'<span class="wd">'+x+'</span>':'？')+(k===g.q?'<span class="me">🧗</span>':'')+'</div>').reverse().join('')+'</div><div class="lopts" id="lo">'+
   o.map(x=>'<button class="lop" data-w="'+x+'">'+[0,1,2].map(k=>'<span'+(x[k]!==cur[k]?' class="chg"':'')+'>'+x[k]+'</span>').join('')+'</button>').join('')+'</div></div>',GM.lad.T,()=>pk(null));
  const play=()=>say(codeOf(w));play();$('#rp').onclick=play;$('#lo').onclick=e=>{const b=e.target.closest('.lop');if(b)pk(b)};
  function pk(b){answer(g,!!b&&b.dataset.w===w,b?b.dataset.w:null,w)}
  if(window.__PHAUTO)pk([...$$('.lop')].find(x=>window.__PHWRONG?x.dataset.w!==w:x.dataset.w===w))}
/* ══ 🖼 看字 找圖 ══ */
function picQ(g){const w=R(realOf()),o=SH([w].concat(near(w,3,true).filter(x=>REAL[x]&&REAL[x].em!==REAL[w].em).slice(0,3)));while(o.length<4){const x=R(realOf());if(o.indexOf(x)<0)o.push(x)}g.w=w;
  stage(g,'<div class="ask">👀 自己 唸 這個 字 ➜ 點 <span class="k">對 的 圖</span>（不 給 你 聽 喔！）</div><div class="word0">'+wordHTML(w)+'</div><div class="pics" id="pc">'+o.map(x=>'<button class="pic" data-w="'+x+'"><span>'+REAL[x].em+'</span><small>'+REAL[x].zh+'</small></button>').join('')+'</div>',GM.pic.T,()=>pk(null));
  $('#pc').onclick=e=>{const b=e.target.closest('.pic');if(b)pk(b)};
  function pk(b){if(b)b.classList.add(b.dataset.w===w?'good':'wrong');answer(g,!!b&&b.dataset.w===w,b?b.dataset.w:null,w,{yours:b?b.dataset.w:null})}
  if(window.__PHAUTO)pk([...$$('.pic')].find(x=>window.__PHWRONG?x.dataset.w!==w:x.dataset.w===w))}
/* ══ 🚂 聲音 火車（拼字）══ */
function trainQ(g){const w=R(realOf()),p=parts(w);g.w=w;const ex=SH((CF[p.i]||'').split('').concat((CF[p.e]||'').split(''),VS().filter(v=>v!==p.v))).filter(x=>[p.i,p.v,p.e].indexOf(x)<0).filter((x,i,a)=>a.indexOf(x)===i).slice(0,2);
  const T=SH([p.i,p.v,p.e].concat(ex)).map((x,k)=>({x,k}));const fill=[null,null,null];
  stage(g,'<div class="ask">🔊 聽 ➜ 把 字母 <span class="k">照 聲音 的 順序</span> 放上 車廂 <button class="say" id="rp">🔊 再 聽</button> <button class="say" id="slow">🐢 一個 音 一個 音</button></div><div class="train"><div class="loco">🚂</div>'+
   [0,1,2].map(k=>'<button class="car'+(k===1?' v':'')+'" data-c="'+k+'"><b></b></button>').join('')+'</div><div class="tiles" id="ti">'+T.map(t=>'<button class="tk'+('aeiou'.indexOf(t.x)>=0?' v':'')+'" data-k="'+t.k+'">'+t.x+'</button>').join('')+'</div>',GM.train.T,()=>chk(true));
  const play=()=>say(codeOf(w));play();$('#rp').onclick=play;$('#slow').onclick=async()=>{for(let k=0;k<3;k++){await say(sOf(p,k));await wait(280)}};
  const draw=()=>{$$('.car').forEach((c,k)=>{c.querySelector('b').textContent=fill[k]?fill[k].x:'';c.classList.toggle('full',!!fill[k])});$$('.tk').forEach(b=>b.classList.toggle('used',fill.some(f=>f&&f.k===+b.dataset.k)))};
  $('#game').onclick=e=>{const t=e.target.closest('.tk');if(t&&!t.classList.contains('used')){const i=fill.indexOf(null);if(i<0)return;fill[i]=T.find(x=>x.k===+t.dataset.k);say('s_'+(('aeiou'.indexOf(fill[i].x)>=0)?PH.vowCode(VOWS[fill[i].x]):i===2?(fill[i].x==='m'?'em':fill[i].x==='n'?'en':fill[i].x):PH.initCode(fill[i].x,'a')));draw();if(fill.indexOf(null)<0)setTimeout(()=>chk(false),350);return}
    const c=e.target.closest('.car');if(c&&fill[+c.dataset.c]){fill[+c.dataset.c]=null;draw()}};
  function chk(tout){if(g.lock===g.q)return;const s=fill.map(f=>f?f.x:'_').join('');const right=!tout&&s===w;if(right)$('.train').classList.add('go');answer(g,right,tout?null:s,w,{yours:tout?null:s})}
  if(window.__PHAUTO){const want=window.__PHWRONG?[p.e,p.v,p.i]:[p.i,p.v,p.e];want.forEach(x=>{const t=[...$$('.tk')].find(b=>b.textContent===x&&!b.classList.contains('used'));if(t)t.click()})}}
/* ══ 📗 課本：拼塊、看字 找圖 ══ */
const BKW={};BOOK.topics.forEach(t=>t.ls.forEach(l=>l.w.forEach(w=>BKW[w]=BOOK.W[w])));
const BWL=Object.keys(BKW);
function chunksOf(w){const x=BOOK.W[w];return x.parts?[].concat(...x.parts.map(p=>BOOK.W[p].c)):x.c}
function bkQ(g){const w=bkPick(g),BL=blocksOf(w),C=BL.map(b=>b[0]),AUB={};BL.forEach(b=>AUB[b[0]]=b[1]);g.w=w;const others=SH([].concat(...BWL.filter(x=>x!==w).map(x=>blocksOf(x))).filter(b=>C.indexOf(b[0])<0&&b[0].length>1));others.forEach(b=>AUB[b[0]]=AUB[b[0]]||b[1]);
  const T=SH(C.concat([...new Set(others.map(b=>b[0]))].slice(0,2))).map((x,k)=>({x,k}));const fill=C.map(()=>null);
  stage(g,'<div class="ask">📗 🔊 聽 課本 的 字 ➜ 把 <span class="k">一塊 一塊（音節）</span> 照 順序 拼 起來 <button class="say" id="rp">🔊 再 聽</button></div><div class="bslots">'+C.map((c,k)=>'<button class="bsl" data-c="'+k+'"></button>').join('')+'</div><div class="tiles" id="ti">'+T.map(t=>'<button class="tk ck" data-k="'+t.k+'">'+t.x+'</button>').join('')+'</div>',GM.bk.T,()=>chk(true));
  const play=()=>say('bk_'+w.replace(/ /g,'_'));play();$('#rp').onclick=play;
  const draw=()=>{$$('.bsl').forEach((c,k)=>{c.textContent=fill[k]?fill[k].x:'';c.classList.toggle('full',!!fill[k])});$$('.tk').forEach(b=>b.classList.toggle('used',fill.some(f=>f&&f.k===+b.dataset.k)))};
  $('#game').onclick=e=>{const t=e.target.closest('.tk');if(t&&!t.classList.contains('used')){const i=fill.indexOf(null);if(i<0)return;fill[i]=T.find(x=>x.k===+t.dataset.k);say(AUB[fill[i].x]);draw();if(fill.indexOf(null)<0)setTimeout(()=>chk(false),350);return}
    const c=e.target.closest('.bsl');if(c&&fill[+c.dataset.c]){fill[+c.dataset.c]=null;draw()}};
  function chk(tout){if(g.lock===g.q)return;const s=fill.map(f=>f?f.x:'_');answer(g,!tout&&s.join('|')===C.join('|'),tout?null:s.join(' ＋ '),w,{idx:BWL.indexOf(w),yours:tout?null:s.join(' ＋ '),au:'bk_'+w.replace(/ /g,'_'),okHTML:bkHTML(w),noHTML:bkHTML(w),tip:'💡 '+BOOK.W[w].tip,okRun:f=>bkRead(f,w),noRun:f=>bkRead(f,w,2)})}
  if(window.__PHAUTO){(window.__PHWRONG?(C.length>1?C.slice().reverse():[T.find(t=>C.indexOf(t.x)<0).x]):C).forEach(x=>{const t=[...$$('.tk')].find(b=>b.textContent===x&&!b.classList.contains('used'));if(t)t.click()})}}
function bkQ2(g){const w=bkPick(g),o=SH([w].concat(SH(BWL.filter(x=>x!==w&&BKW[x].ic!==BKW[w].ic)).slice(0,3)));g.w=w;
  stage(g,'<div class="ask">📗 👀 自己 唸 課本 的 字 ➜ 點 <span class="k">對 的 圖</span></div><div class="word0">'+'<span class="wd">'+w+'</span></div><div class="pics" id="pc">'+o.map(x=>'<button class="pic" data-w="'+x+'"><span>'+ICON(BKW[x].ic)+'</span><small>'+BKW[x].zh+'</small></button>').join('')+'</div>',GM.bkp.T,()=>pk(null));
  $('#pc').onclick=e=>{const b=e.target.closest('.pic');if(b)pk(b)};
  function pk(b){if(b)b.classList.add(b.dataset.w===w?'good':'wrong');answer(g,!!b&&b.dataset.w===w,b?b.dataset.w:null,w,{idx:BWL.indexOf(w),yours:b?b.dataset.w:null,au:'bk_'+w.replace(/ /g,'_'),okHTML:bkHTML(w),noHTML:bkHTML(w),tip:'💡 '+BOOK.W[w].tip,okRun:f=>bkRead(f,w),noRun:f=>bkRead(f,w,2)})}
  if(window.__PHAUTO)pk([...$$('.pic')].find(x=>window.__PHWRONG?x.dataset.w!==w:x.dataset.w===w))}
/* 課本 字：一塊 一塊（字母＋真的 音標）＋ 圖 */
function chunkHTML(c,fin,big){const s=c[0],T=PH2.realTiles(c[1],MD,fin)||[];return '<div class="chk '+c[2]+'"><div class="cs" style="font-size:'+(big||64)+'px">'+s.split('').map(ch=>ch===ch.toUpperCase()?'<i>'+ch.toLowerCase()+'</i>':ch).join('')+'</div>'+tileHTML(T)+
  '<div class="ctg">'+(c[2]==='cvc'||c[2]==='cv'?'✔ 你 會 了':c[2]==='sight'?'⭐ 常見 字':'💡 '+(c[3]||'新 規則'))+'</div></div>'}
/* ══ 遊戲 清單 ══ */
const GM={
  slot:{ic:'🎰',nm:'CVC 拉霸機',T:25,q:slotQ,c:['#7A0F3F','#2A0716'],how:'拉 拉桿 ➜ 三個 轉輪 停下來，一個 一個 唸 出 字母 的 音 ➜ 🗣 先 自己 唸 ➜ 🎧 聽 3 個 聲音，選出 拉霸機 上 的 字。',tag:'讀＋聽'},
  ufo:{ic:'🛸',nm:'聽音 打 飛碟',T:15,q:ufoQ,c:['#064A5E','#04192A'],how:'🔊 聽 一個 字 ➜ 雷射 打下 寫著 那個 字 的 飛碟！',tag:'聽＋讀'},
  vault:{ic:'🔐',nm:'聽音 拼字 保險箱',T:35,q:vaultQ,c:['#3B1F7A','#120A2A'],how:'🔊 聽 ➜ 轉 三個 密碼 輪（開頭、母音、最後）拼 出來 ➜〔🔓 開鎖〕。錯 了 可以 再 試 一次，按〔👂 比一比〕聽 你 拼 的 和 題目。',tag:'聽＋拼'},
  zhu:{ic:'🀄',nm:'看字 選 音標',T:15,q:zhuQ,c:['#5B1238','#1E0714'],how:'👀 看 一個 字 ➜ 選 對 的 雙語 注音（上面 可以 換 KK、IPA）。',tag:'讀'},
  bal:{ic:'🎈',nm:'字首音 氣球',T:12,q:balQ,c:['#7A2A00','#2A0E00'],how:'🔊 聽 一個 字 ➜ 戳破 它 的 第一個 字母 的 氣球！',tag:'聽 開頭'},
  vow:{ic:'⚔️',nm:'母音 對決',T:15,q:vowQ,c:['#0E5A3A','#04200F'],how:'🔊 聽 ➜ 中間 是 a、e、i、o、u 哪 一個？每 一張 卡 可以 按 🔊 聽 那個 母音。',tag:'聽 母音'},
  end:{ic:'🎯',nm:'尾音 狙擊',T:15,q:endQ,c:['#5A4A00','#201A00'],how:'🔊 聽 ➜ 最後 一個 音 是 哪 一個？（b／p、d／t、m／n 要 仔細 聽！）',tag:'聽 最後'},
  lad:{ic:'🪜',nm:'換 字母 爬 階梯',T:15,q:ladQ,c:['#1E3A8A','#0A1433'],how:'🔊 聽 ➜ 只 換 一個 字母，變成 聽到 的 字，一路 爬 到 頂！',tag:'聽＋讀'},
  pic:{ic:'🖼️',nm:'看字 找圖',T:15,q:picQ,c:['#4A1E7A','#180A2A'],how:'👀 自己 唸 這個 字（不 給 你 聽）➜ 點 對 的 圖。',tag:'讀 懂 意思'},
  train:{ic:'🚂',nm:'聲音 火車（拼字）',T:25,q:trainQ,c:['#7A3A00','#2A1200'],how:'🔊 聽 ➜ 把 字母 照 聲音 的 順序 放上 3 節 車廂，火車 就 開 走！點 車廂 ＝ 拿 下來。',tag:'聽＋拼'},
  bk:{ic:'📗',nm:'課本 單字 拼塊',T:30,q:bkQ,c:['#0E5A3A','#062A1C'],how:'🔊 聽 課本 的 字 ➜ 把 一塊 一塊（音節）照 順序 拼 起來（ra ＋ bbit ＝ rabbit）。',tag:'課本'},
  bkp:{ic:'📘',nm:'課本 單字 找圖',T:15,q:bkQ2,c:['#0E3A6A','#061A30'],how:'👀 自己 唸 課本 的 字 ➜ 點 對 的 圖。',tag:'課本'},
  yn:{ic:'⭕',nm:'開頭 是 它 嗎？',T:10,q:ynQ,c:['#0B4F6C','#04202E'],how:'上面 一個 字母 ➜ 字 一個 一個 飛 過來 ➜ 🔊 聽 ➜ 開頭 的 聲音 是 這個 字母 嗎？按〔⭕ 是〕或〔❌ 不是〕。',tag:'聽 開頭'},
  twin:{ic:'👯',nm:'聲音 雙胞胎',T:15,q:twinQ,c:['#5A1E6E','#1E0A26'],how:'🔊 聽 A 和 B 兩個 字 ➜ 開頭（或 中間 母音）的 聲音 一樣 嗎？點 A、B 可以 再 聽。',tag:'聽 辨別'},
  line:{ic:'⚔️',nm:'連線 大 對決',T:30,q:lineQ,c:['#3A0E5A','#12051E'],how:'🎲 先 擲 骰子 ➜ 跟 👾 魔王 輪流 搶 格子：點 一格 ➜ 🔊 聽 ➜ 拼 出 三個 字母 ＝ ⭐ 佔領（拼錯 ＝ 魔王 搶走）➜ 直、橫、斜 連 3 格 ＝ ⭕ 連線 ＋150！8 回合。',tag:'聽＋拼'},
  ls:{ic:'🐣',nm:'小學堂 小 測驗',T:15,q:lsQ,c:['#5A5A00','#202000'],how:'🔊 聽 ➜ 選 對 的 字。',tag:'新手'}
};

/* ══ 第五十一次（老師 第 5 點 選 丙 ＝ 甲＋乙 都 要；第 6 點 老師 的 WORDHERO 檔 ＝ 5✕5 連線 對戰 ➜ 優化）══
   ⭕ 開頭 是 它 嗎？（甲）：上面 一個 目標 字母 ➜ 字 一個 一個 飛 過來 ➜ 聽 ➜〔⭕ 是〕〔❌ 不是〕；不是 的 字 一定 是 最 容易 搞混 的（b／p、d／t…）
   👯 聲音 雙胞胎（乙）：聽 A、B 兩個 字 ➜ 開頭（或 中間 母音）的 聲音 一樣 嗎？〔⭕ 一樣〕〔❌ 不一樣〕
   ⚔️ 連線 大 對決：4✕4 棋盤 藏 16 個 字，跟 👾 魔王 輪流 搶 格子；點 一格 ➜ 聽 ➜ 拼 出 三個 字母 ＝ 佔領（拼錯 ＝ 魔王 搶走）；
      直、橫、斜 三格 連 一線 ＝ ⭕ 連線 ＋150；🎲 先 擲 骰子 決定 誰 先；8 回合 */
function ynQ(g){const W=realOf();let T,w,yes=Math.random()<.5,tries=0;
  do{T=R(W.map(x=>parts(x).i).filter((x,i,a)=>a.indexOf(x)===i));const sameW=W.filter(x=>parts(x).i===T),cf=(CF[T]||'').split(''),near=W.filter(x=>cf.indexOf(parts(x).i)>=0);
    w=yes?R(sameW):(near.length?R(near):R(W.filter(x=>parts(x).i!==T)));tries++}while((!w||g.used&&g.used.indexOf(w)>=0&&tries<30));
  (g.used=g.used||[]).push(w);g.w=w;const p=parts(w);yes=p.i===T;
  stage(g,'<div class="ask">🔊 聽 ➜ 這個 字 的 <span class="k">開頭</span> 是 <b class="yt">'+T+'</b> 嗎？ <button class="say" id="rp">🔊 再 聽</button></div>'+
   '<div class="ynT"><span class="ynL">'+T+'</span><small>'+(CUE[T]?CUE[T].split('、')[0]:'')+'</small></div><div class="ynF"><div class="ynC fly">🔊<b>? ? ?</b></div></div>'+
   '<div class="ynB"><button class="ynb y" data-y="1">⭕ 是</button><button class="ynb n" data-y="0">❌ 不是</button></div>',GM.yn.T,()=>pk(null));
  const play=()=>say(codeOf(w));setTimeout(play,350);$('#rp').onclick=play;
  $$('.ynb').forEach(b=>b.onclick=()=>pk(b.dataset.y==='1'));
  function pk(v){const okk=v!=null&&v===yes;if(v!=null){const c=$('.ynC');c.innerHTML=wordHTML(w);c.classList.add(okk?'okc':'noc')}
    answer(g,okk,v==null?null:(v?'⭕ 是':'❌ 不是'),w,{yours:v==null?null:(v?'⭕ 是 '+T:'❌ 不是 '+T),tip:'開頭：<b>'+p.i+'</b>'+cue(p.i)+(p.i===T?' ＝ '+T:' ≠ <s>'+T+'</s>'+cue(T))})}
  if(window.__PHAUTO)pk(window.__PHWRONG?!yes:yes)}
function twinQ(g){const W=realOf(),foc=Math.random()<.65?'i':'v',same=Math.random()<.5;let a,b,t=0;
  do{a=R(W);const pa=parts(a);if(same)b=R(W.filter(x=>x!==a&&parts(x)[foc]===pa[foc]));
    else{const cf=foc==='i'?(CF[pa.i]||'').split(''):VS().filter(v=>v!==pa.v),near=W.filter(x=>cf.indexOf(parts(x)[foc])>=0&&(foc==='i'?parts(x).v===pa.v:true));b=near.length?R(near):R(W.filter(x=>parts(x)[foc]!==pa[foc]))}t++}while(!b&&t<30);
  g.w=a;const pa=parts(a),pb=parts(b),sm=pa[foc]===pb[foc],what=foc==='i'?'開頭':'中間 母音';
  stage(g,'<div class="ask">🔊 聽 A 和 B ➜ <span class="k">'+what+'</span> 的 聲音 一樣 嗎？</div><div class="twn"><button class="twc" id="ta"><i>A</i>🔊<b>? ? ?</b></button><span class="twv">'+(foc==='i'?'▢ ? ?':'? ▢ ?')+'</span><button class="twc" id="tb"><i>B</i>🔊<b>? ? ?</b></button></div>'+
   '<div class="ynB"><button class="ynb y" data-y="1">⭕ 一樣</button><button class="ynb n" data-y="0">❌ 不一樣</button></div>',GM.twin.T,()=>pk(null));
  const hl=(id,on)=>{const e=$(id);if(e)e.classList.toggle('hl',on)},pa2=async()=>{hl('#ta',1);await say(codeOf(a));hl('#ta',0);await wait(450);hl('#tb',1);await say(codeOf(b));hl('#tb',0)};
  setTimeout(pa2,350);$('#ta').onclick=()=>say(codeOf(a));$('#tb').onclick=()=>say(codeOf(b));$$('.ynb').forEach(x=>x.onclick=()=>pk(x.dataset.y==='1'));
  const show=(x,px)=>'<span class="wd">'+[px.i,px.v,px.e].map((c,k)=>'<span class="'+(k===1?'v':'')+((foc==='i'&&k===0)||(foc==='v'&&k===1)?' twk':'')+'">'+c+'</span>').join('')+'</span>';
  const pair='<div class="twp"><div>'+show(a,pa)+'<small>'+(REAL[a]?REAL[a].em+' '+REAL[a].zh:'')+'</small></div><b>'+(sm?'＝':'≠')+'</b><div>'+show(b,pb)+'<small>'+(REAL[b]?REAL[b].em+' '+REAL[b].zh:'')+'</small></div></div>';
  const run=async f=>{for(const[x,px]of[[a,pa],[b,pb]]){await say(foc==='i'?sOf(px,0):'s_'+PH.vowCode(VOWS[px.v]));await wait(300);await say(codeOf(x));await wait(450)}};
  function pk(v){const okk=v!=null&&v===sm;if(v!=null){$('#ta b').outerHTML=show(a,pa);$('#tb b').outerHTML=show(b,pb)}
    answer(g,okk,v==null?null:(v?'⭕ 一樣':'❌ 不一樣'),a,{yours:v==null?null:(v?'⭕ 一樣':'❌ 不一樣'),okHTML:pair,noHTML:pair,okRun:run,noRun:run,
      tip:what+'：<b>'+pa[foc]+'</b>'+(foc==='i'?cue(pa.i):'')+' '+(sm?'＝':'≠')+' <b>'+pb[foc]+'</b>'+(foc==='i'?cue(pb.i):'')})}
  if(window.__PHAUTO)pk(window.__PHWRONG?!sm:sm)}
const LN4=(()=>{const L=[],id=(r,c)=>r*4+c;for(let r=0;r<4;r++)for(let c=0;c<4;c++){if(c<2)L.push([id(r,c),id(r,c+1),id(r,c+2)]);if(r<2)L.push([id(r,c),id(r+1,c),id(r+2,c)]);if(r<2&&c<2)L.push([id(r,c),id(r+1,c+1),id(r+2,c+2)]);if(r<2&&c>1)L.push([id(r,c),id(r+1,c-1),id(r+2,c-2)])}return L})();
const lines=(bd,o)=>LN4.filter(l=>l.every(i=>bd[i].o===o));
function lineBoss(g){const e=g.bd.map((c,i)=>c.o?-1:i).filter(i=>i>=0);if(!e.length)return -1;let pick=-1;
  if(Math.random()<.6)for(const l of SH(LN4)){const m=l.filter(i=>g.bd[i].o==='me').length,f=l.filter(i=>!g.bd[i].o);if(m===2&&f.length===1){pick=f[0];break}}
  if(pick<0)for(const l of SH(LN4)){const m=l.filter(i=>g.bd[i].o==='boss').length,f=l.filter(i=>!g.bd[i].o);if(m===2&&f.length===1){pick=f[0];break}}
  if(pick<0)pick=R(e);g.bd[pick].o='boss';return pick}
const lineBoard=(g,hot)=>'<div class="lnb" id="lnb">'+g.bd.map((c,i)=>'<button class="lnc'+(c.o?' '+c.o:'')+(i===hot?' hot':'')+'" data-c="'+i+'">'+(c.o==='me'?'<span class="lme">⭐</span><small>'+c.w+'</small>':c.o==='boss'?'<span class="lbs">👾</span><small>'+c.w+'</small>':'<span class="lq">🔊</span>')+'</button>').join('')+'</div>';
async function lineDice(g){const ov=H('div','rx','<div class="rxp pnl pop lnd"><h3>🎲 命運 的 一擲：誰 先 搶 格子？</h3><div class="lndr"><div><b>你</b><span id="d1">🎲</span></div><em>VS</em><div><b>👾 魔王</b><span id="d2">🎲</span></div></div><div class="rxc" id="dm">&nbsp;</div></div>');document.body.appendChild(ov);
  let a,b;do{a=1+Math.floor(Math.random()*6);b=1+Math.floor(Math.random()*6)}while(a===b);const F='⚀⚁⚂⚃⚄⚅';
  if(!window.__PHFAST)for(let k=0;k<12;k++){ov.querySelector('#d1').textContent=F[k%6];ov.querySelector('#d2').textContent=F[(k+3)%6];await wait(90)}
  ov.querySelector('#d1').textContent=F[a-1];ov.querySelector('#d2').textContent=F[b-1];ov.querySelector('#dm').innerHTML=a>b?'🎉 你 先 搶！':'👾 魔王 先 搶！';await wait(window.__PHFAST?50:1400);ov.remove();return a>b}
async function lineQ(g){if(!g.bd){g.N=8;const W=SH(realOf());g.bd=Array.from({length:16},(_,i)=>({w:W[i%W.length],o:null}));g.ln=0;g.bl=0;g.first=await lineDice(g);if(!alive(g))return;
    g.onEnd=()=>setTimeout(()=>{const e=$('#game .end');if(!e)return;const me=lines(g.bd,'me').length,bs=lines(g.bd,'boss').length;e.insertAdjacentHTML('afterbegin','<div class="lnr '+(me>=bs?'win':'')+'">'+(me>bs?'🏆 你 打敗 了 👾 魔王！':me===bs?'🤝 平手！':'👾 魔王 贏 了…再 挑戰 一次！')+'<div>⭐ 你 '+me+' 條 線　VS　👾 魔王 '+bs+' 條 線</div>'+lineBoard(g,-1)+'</div>')},0)}
  let hot=-1;if(g.q>0||!g.first){hot=lineBoss(g);const nb=lines(g.bd,'boss').length;if(nb>g.bl){g.bl=nb;const e=H('div','qban','👾 魔王 連線 了！');document.body.appendChild(e);setTimeout(()=>e.remove(),1500)}}
  if(!g.bd.some(c=>!c.o)){g.q=nq(g);end(g);return}
  stage(g,'<div class="ask">⭐ 輪到 你：點 <span class="k">🔊 格子</span> ➜ 聽 ➜ 拼 對 就 佔領（連 3 格 ＝ ⭕ 連線）</div><div class="lnw">'+lineBoard(g,hot)+'<div class="lns"><div class="lnsc">⭐ 你 <b>'+lines(g.bd,'me').length+'</b> 線<br>👾 魔王 <b>'+lines(g.bd,'boss').length+'</b> 線</div><div id="lsp"></div></div></div>',GM.line.T,()=>chk(null));
  let cell=-1,w=null,p=null,sel=[null,null,null];
  $('#lnb').onclick=e=>{const b=e.target.closest('.lnc');if(!b||b.classList.contains('me')||b.classList.contains('boss'))return;cell=+b.dataset.c;w=g.bd[cell].w;p=parts(w);g.w=w;$$('.lnc').forEach(x=>x.classList.toggle('pick',x===b));sel=[null,null,null];spell()};
  const CFV={b:'bpd',d:'dtb',p:'pbt',t:'tdp',m:'mnb',n:'nmd',g:'gkd',k:'kgc',c:'ckg',f:'fvh',s:'szc',z:'zs',h:'hfn',j:'jgz',l:'lrn',r:'rlw',w:'wrv',x:'xkp'};
  function spell(){const o=[SH(((CFV[p.i]||p.i)+'bdp').split('').filter((x,i,a)=>a.indexOf(x)===i).slice(0,3)),VS().slice(),SH(((CFV[p.e]||p.e)+'dtg').split('').filter((x,i,a)=>a.indexOf(x)===i&&CO.indexOf(x)>=0).slice(0,3))];
    [p.i,p.v,p.e].forEach((x,k)=>{if(o[k].indexOf(x)<0)o[k][0]=x});
    $('#lsp').innerHTML='<div class="lnsl">'+[0,1,2].map(k=>'<span class="ls'+(k===1?' v':'')+'" id="lq'+k+'">_</span>').join('')+'</div>'+o.map((r,k)=>'<div class="lrow">'+SH(r).map(x=>'<button class="lch'+(k===1?' v':'')+'" data-k="'+k+'" data-x="'+x+'">'+x+'</button>').join('')+'</div>').join('')+'<div class="row"><button class="say" id="rp">🔊 再 聽</button><button class="big" id="lok" disabled>✔ 佔領！</button></div>';
    const play=()=>say(codeOf(w));play();$('#rp').onclick=play;
    $('#lsp').onclick=e=>{const c=e.target.closest('.lch');if(!c)return;const k=+c.dataset.k;sel[k]=c.dataset.x;$$('.lch[data-k="'+k+'"]').forEach(x=>x.classList.toggle('on',x===c));$('#lq'+k).textContent=sel[k];$('#lok').disabled=sel.some(x=>x==null)};
    $('#lok').onclick=()=>chk(sel.join(''));if(window.__PHAUTO)chk(window.__PHWRONG?(p.i===o[0][0]?o[0][1]:o[0][0])+p.v+p.e:w)}
  function chk(y){if(cell<0){const e=g.bd.map((c,i)=>c.o?-1:i).filter(i=>i>=0);cell=R(e);w=g.bd[cell].w;p=parts(w);g.w=w}
    const okk=y===w;g.bd[cell].o=okk?'me':'boss';const nl=lines(g.bd,'me').length;let bonus='';
    if(okk&&nl>g.ln){const n=nl-g.ln;g.ln=nl;g.score+=150*n;bonus='<div class="lnx">⭕ 連線！＋'+(150*n)+'</div>';const e=H('div','qban','⭕ 連線 成功！＋'+(150*n));document.body.appendChild(e);setTimeout(()=>e.remove(),1700);conf(50)}
    if(!okk)g.bl=lines(g.bd,'boss').length;
    answer(g,okk,y,w,{yours:y,okHTML:bonus?bonus+letRow(w,96,'okr'):null,tip:y?'你 拼 的：<s>'+y+'</s> ➜ <b>'+w+'</b>　👾 魔王 搶走 這 一格':'⏰ 時間 到 ➜ 👾 魔王 搶走 這 一格'})}
  if(window.__PHAUTO){const e=g.bd.map((c,i)=>c.o?-1:i).filter(i=>i>=0);$('.lnc[data-c="'+e[0]+'"]').click()}}
/* ══ 🐣 新手 小學堂（低成就、怕 英文 的 學生：一步 一步、我 做 ➜ 一起 做 ➜ 你 做）══ */
const LESS=[{v:'a',w:['cat','hat','map','bag','pan']},{v:'i',w:['pig','six','zip','pin','big']},{v:'o',w:['dog','box','hot','pot','top']},{v:'e',w:['bed','pen','hen','ten','net']},{v:'u',w:['sun','cup','bug','hug','nut']}];
let LSN=null;
function lsQ(g){const L=LSN||LESS[0],w=R(L.w),n=g.q<2?1:2;const o=SH([w].concat(SH(L.w.filter(x=>x!==w)).slice(0,n)));g.w=w;
  stage(g,'<div class="ask">🔊 聽 ➜ 選 對 的 字 <button class="say" id="rp">🔊 再 聽</button></div><div class="pics" id="pc">'+o.map(x=>'<button class="pic wpic" data-w="'+x+'">'+wordHTML(x)+'</button>').join('')+'</div>',GM.ls.T,()=>pk(null));
  const play=()=>say(codeOf(w));play();$('#rp').onclick=play;$('#pc').onclick=e=>{const b=e.target.closest('.pic');if(b)pk(b)};
  function pk(b){if(b)b.classList.add(b.dataset.w===w?'good':'wrong');answer(g,!!b&&b.dataset.w===w,b?b.dataset.w:null,w,{yours:b?b.dataset.w:null})}
  if(window.__PHAUTO)pk([...$$('.pic')].find(x=>window.__PHWRONG?x.dataset.w!==w:x.dataset.w===w))}
function ctlHTML(){return '<div class="ctl"><button id="cP">⏸️ 暫停</button><button id="cS">🐢 放慢</button><button id="cR">🔁 再一次</button></div>'}
function bindCtl(re){const P=$('#cP'),S=$('#cS');P.onclick=()=>{PAUSED=!PAUSED;P.classList.toggle('on',PAUSED);P.textContent=PAUSED?'▶️ 繼續':'⏸️ 暫停';if(PAUSED)AU.pause();else AU.play().catch(()=>{})};
  S.onclick=()=>{SLOW=SLOW>1?1:1.5;S.classList.toggle('on',SLOW>1)};S.classList.toggle('on',SLOW>1);$('#cR').onclick=re}
function lessonOpen(i){LSN=LESS[i];const L=LSN,tok={};let k=-1;G={k:'lesson',tok};const me=G;$('#lobby').hidden=true;const s=$('#game');s.hidden=false;s.onclick=null;$('#quit').hidden=false;$('#ttl').textContent='🐣 小學堂：短 母音 '+L.v;PAUSED=false;
  const vs=async()=>{s.innerHTML='<div class="lsn pnl pop"><div class="lh">🐣 第 '+(i+1)+' 課：短 母音 <b>'+L.v+'</b></div><div class="vsp"><span class="vbig">'+L.v+'</span><span class="vem">'+VKEY[L.v][0]+'</span></div><div class="lcue">'+LCUE[L.v]+'</div><div class="lnote">'+VKEY[L.v][1]+' 的 開頭 就是 '+L.v+' 的 聲音</div>'+ctlHTML()+'<div class="row"><button class="big" id="lgo">▶ 開始 學 5 個 字</button></div></div>';
    bindCtl(vs);const vb=s.querySelector('.vbig');for(let r=0;r<2;r++){if(G!==me)return;vb.classList.add('hl');await say('s_'+PH.vowCode(VOWS[L.v]));await wait(500);vb.classList.remove('hl');await wait(300)}
    $('#lgo').onclick=()=>{k=0;word()};if(window.__PHAUTO)$('#lgo').click()};
  const word=async()=>{const w=L.w[k],p=parts(w),my=++tok.n||(tok.n=1);const T=unitTiles(w);
    s.innerHTML='<div class="lsn pnl"><div class="lh">🐣 短 母音 '+L.v+'　第 '+(k+1)+' ／ 5 個 字</div><div class="lstep" id="st">① 看 字母，聽 字母 的 音</div><div class="lt lw" id="lw" data-w="'+w+'">'+
     [p.i,p.v,p.e].map((x,j)=>'<div class="u" data-u="'+j+'" style="opacity:0"><span class="L" style="font-size:120px'+(j===1?';color:#000;background:var(--vowel);border-radius:.14em;padding:0 .06em':'')+'">'+x+'</span>'+tileHTML(T[j],null,w+'|'+j)+'</div>').join('')+
     '</div><div class="row"><button class="say" id="lbm">🔀 拼法 '+LBM+'：'+lbTxt(w)+'</button></div><div class="lmean" id="lm"></div><div class="lyou" id="ly" hidden>✋ 換 你：點 每 一個 字母 聽 一次，再 按〔🔗 合 起來〕<div class="row"><button class="big cy" id="lj">🔗 合 起來</button><button class="big" id="ln" hidden>'+(k<4?'▶ 下 一個 字':'⭐ 小 測驗 5 題')+'</button></div></div>'+ctlHTML()+'</div>';
    bindCtl(word);$('#lbm').onclick=()=>{LBM=LBM===1?2:1;LS.s('lbm',LBM);$('#lbm').textContent='🔀 拼法 '+LBM+'：'+lbTxt(w)};const lw=$('#lw'),us=[...lw.querySelectorAll('.u')],st=$('#st'),dead=()=>G!==me||tok.n!==my;
    for(let j=0;j<3;j++){if(dead())return;us[j].style.opacity=1;us[j].classList.add('pop','hl');await say(sOf(p,j));await wait(450);us[j].classList.remove('hl');await wait(250)}
    if(dead())return;st.textContent='② 慢慢 合 起來（'+lbTxt(w)+'）';await blend2(lw,w,LBM,dead);
    if(dead())return;st.textContent='③ 它 是 什麼 意思？';$('#lm').innerHTML='<span class="eq">＝</span><span class="em pop">'+REAL[w].em+'</span><span class="zh pop">'+REAL[w].zh+'</span>';await say(codeOf(w));await wait(600);
    if(dead())return;st.textContent='④ 換 你 了！';lw.classList.remove('j1','j2');bindLet(lw);$('#ly').hidden=false;book(w);
    const lnb=$('#ln');$('#lj').onclick=async()=>{const t=++LBT;await blend2(lw,w,LBM,()=>t!==LBT);lnb.hidden=false};$('#ln').onclick=()=>{if(k<4){k++;word()}else{LS.s('ls_'+L.v,1);start('ls')}};
    if(window.__PHAUTO){$('#lj').click();setTimeout(()=>$('#ln').click(),60)}};
  vs()}
/* ══ 2026-11-13 第四十九次 第 6 點：課本 單字 ＝ 每 一個 字母 正下方 對齊 它 的 雙語 注音／KK／IPA（照 老師 的 bathroom 截圖）══
   字母 顏色：子音 白、一個 母音 紅、兩個 母音 一個 音（oo）粉紅、th sh ch ng 水藍、不發音 灰（where 最後 的 e、tired 的 e、kitchen 的 t）
   音節 照 老師：ra·bbit、ha·ppy（一個 子音 聲 往 後 搬，兩個 一樣 的 字母 一起 搬）；最後 一定 合 回 正確 的 拼字（bathroom 不 留 空格、不 留 ＋）*/
const VL='aeiouy',BKVOW={ERV:1,AE:1,EH:1,IH:1,AA:1,AO:1,AH:1,IY:1,UW:1,AY:1,OW:1,ER:1,UH:1,EY:1,AW:1};
const isV=p=>!!BKVOW[p.replace(/\d/g,'')];
const BKC={B:['ㄅ','b','b'],P:['ㄆ','p','p'],M:['ㄇ','m','m'],F:['ㄈ','f','f'],D:['ㄉ','d','d'],T:['ㄊ','t','t'],N:['ㄋ','n','n'],L:['ㄌ','l','l'],K:['ㄎ','k','k'],G:['ㄍ','g','ɡ'],HH:['ㄏ','h','h'],S:['ㄙ','s','s'],Z:['z','z','z'],JH:['ㄓ','dʒ','dʒ'],CH:['ㄔ','tʃ','tʃ'],SH:['ㄕ','ʃ','ʃ'],TH:['θ','θ','θ'],DH:['ð','ð','ð'],W:['ㄨ','w','w'],R:[['ㄖ','ㄨ'],'r','ɹ'],Y:['一','j','j'],V:['v','v','v'],NG:['ㄥ','ŋ','ŋ']};
const BKV={AE:[['ㄚ','ㄝ'],'æ','æ'],EH:[['ㄝ'],'ɛ','ɛ'],IH:[['ㄜ','一'],'ɪ','ɪ'],AA:[['ㄚ'],'ɑ','ɑː'],AO:[['ㄛ'],'ɔ','ɔː'],AH:[['ㄜ'],'ʌ','ʌ'],AH0:[['ㄜ'],'ə','ə'],IY:[['一'],'i','iː'],IY0:[['一'],'ɪ','i'],UW:[['ㄨ'],'u','uː'],AY:[['ㄞ'],'aɪ','aɪ'],OW:[['ㄛㄨ'],'o','oʊ'],ER:[['ㄜㄦ'],'ɝ','ɝ'],ER0:[['ㄦ'],'ɚ','ɚ'],ERV:[['ㄜ'],'ɝ','ɜ']};
/* 第五十次：母音 字母 後面 的 r（bird、turtle、short、where）＝ RC：注音 ㄦ 藍底（老師）、IPA ɹ（ir、ur ＝ 兩個 IPA ɜ＋ɹ）、KK r（ɝ 後面 不 再 寫）*/
const NAMEV={a:'EY',e:'IY',i:'AY',o:'OW',u:'UW'};
function bkTile(p,coda,md){const m=md==='zh'?0:md==='kk'?1:2,b=p.replace(/[12]/g,'');
  if(b==='RC')return {t:['ㄦ','r','ɹ'][m],bg:PH.CC};
  if(BKV[b]){const v=BKV[b];return m===0?{t:v[0][0],sup:v[0][1]||null,bg:PH.VC,v:1}:{t:v[m],bg:PH.VC,v:1}}
  const c=BKC[b];if(m!==0)return {t:c[m],bg:PH.CC};const lat=t=>/^[a-zθð]+$/.test(t);
  if(coda){if(b==='L')return {t:'ㄛ',bg:PH.CC};if(b==='R')return {t:'ㄦ',bg:PH.CC};const sup={B:'〃',P:'〃',D:'〃',T:'〃',G:'〃',K:'〃',M:'~',N:'~'}[b]||null;return lat(c[0])?{t:c[0],bg:'#fff',dark:1,sup}:{t:c[0],bg:PH.CC,sup}}
  if(b==='R')return {t:c[0],bg:PH.CC,stack:1};return lat(c[0])?{t:c[0],bg:'#fff',dark:1}:{t:c[0],bg:PH.CC}}
const BKI={};
function bkInfo(w){if(BKI[w])return BKI[w];const x=BOOK.W[w];if(x.parts)return BKI[w]={w,parts:x.parts.map(bkInfo)};
  const S=x.sy.split('·');let si=0,used=0;const G=x.g.split(' ').map(t=>{const i=t.indexOf(':'),l=t.slice(0,i),p=t.slice(i+1),o={l,P:p==='-'?[]:p.split('+'),s:si};used+=l.length;if(used>=S[si].length){si++;used=0}return o});
  G.forEach(o=>{o.v=!!o.P.length&&isV(o.P[0])});
  G.forEach(o=>{o.nm=o.l.length===1&&!!NAMEV[o.l]&&!!o.P.length&&o.P[0].replace(/\d/g,'')===NAMEV[o.l]});   /* 第五十次：母音 字母 唸 它 的 名字（dining、tired 的 i、he 的 e、no 的 o）＝ 暫時 黃底 */
  G.forEach((o,k)=>{o.coda=!o.v&&!!o.P.length&&G.some((q,j)=>j<k&&q.s===o.s&&q.v);o.cls=!o.P.length?'x':o.v?([...o.l].every(c=>VL.indexOf(c)>=0)&&o.l.length>1?'vt':'v'):(o.l.length>1&&o.l[0]!==o.l[1]?'dg':'c')});
  return BKI[w]={w,G,S}}
const lcls=(o,ch)=>'lc-'+(o.cls==='v'?(VL.indexOf(ch)>=0?'v':'c'):o.cls);
function bkTiles(w,k,md){md=md||MD;const o=bkInfo(w).G[k];if(!o.P.length)return '<span class="tls sil" data-bt="'+w+'|'+k+'"><span class="tl sl">'+(md==='zh'?'':'')+'</span></span>';
  const I=bkInfo(w),pv=I.G[k-1];let T=o.P.map((p,j)=>bkTile(p,o.coda||(j>0&&o.v),md));
  if(o.P[0]==='RC'&&md==='kk'&&pv&&pv.P[0]==='ERV')T=[{t:'',bg:PH.CC}];   /* KK 的 ɝ 已經 有 r */
  if(o.l==='r')T.forEach(t=>t.bg=PH.CC);   /* tired 的 r（ㄦ）＝ 藍底 */
  return tileHTML(T,md).replace('<span class="tls"','<span class="tls" data-bt="'+w+'|'+k+'"')}
function bkInner(I){return '<span class="bwd" data-w="'+I.w+'">'+I.S.map((s,si)=>'<span class="bsy" data-s="'+si+'">'+I.G.map((g,k)=>g.s!==si?'':'<span class="bgp '+g.cls+(g.nm?' nm':'')+'" data-g="'+k+'"><span class="bgl">'+[...g.l].map(ch=>'<i class="'+lcls(g,ch)+'">'+ch+'</i>').join('')+'</span>'+bkTiles(I.w,k)+'</span>').join('')+'</span>').join('<span class="bdot">·</span>')+'</span>'}
function bkWordHTML(w,o){o=o||{};const I=bkInfo(w);return '<div class="bw2'+(o.cls?' '+o.cls:'')+'" style="--fs:'+(o.fs||(w.length>9?60:w.length>6?72:88))+'px">'+(I.parts?I.parts.map(bkInner).join('<span class="bsp"></span>'):bkInner(I))+'</div>'}
const BKS={ERV:'ir',AE:'ae',EH:'eh',IH:'ih',AA:'aa',AO:'ao',AH:'uh',AH0:'uh',IY:'ee',IY0:'ee',UW:'uu',AY:'ii',OW:'oa',ER:'er',ER0:'er'};
function phAu(o,j){const b=o.P[j].replace(/[12]/g,'');if(BKS[b])return 's_'+BKS[b];const cd=o.coda||(j>0&&o.v);
  return 's_'+({B:'b',P:'p',F:'f',D:'d',T:'t',L:cd?'el':'l',K:'k',G:cd?'eg':'g',HH:'h',S:'s',Z:'z',JH:'j',CH:'ch',SH:'sh',TH:'th',DH:'dh',W:'w',Y:'y',V:'v',NG:'ng',M:cd?'em':'m',N:cd?'en':'n',R:cd?'er':'r',RC:'er'}[b])}
const bkAu=w=>'bk_'+w.replace(/ /g,'_');
const bkWords=I=>I.parts||[I];
/* 一個 一個 字母 出來＋唸 它 的 聲音（不 發音 的 ＝ 灰色＋🤫，不 出 聲）*/
async function bkLetters(root,w,dead){for(const I of bkWords(bkInfo(w))){for(let k=0;k<I.G.length;k++){if(dead())return;const o=I.G[k],gp=root.querySelector('.bwd[data-w="'+I.w+'"] .bgp[data-g="'+k+'"]');if(!gp)continue;
  gp.querySelectorAll('i').forEach(i=>i.classList.add('on'));gp.classList.add('hl');
  if(!o.P.length){gp.classList.add('shh');await wait(900)}else for(let j=0;j<o.P.length;j++){await say(phAu(o,j));await wait(180)}
  gp.classList.remove('hl');await wait(200)}}}
/* 音節：一個 一個 亮＋唸（單音節 的 字 ＝ 唸 整個 字）*/
async function bkSyll(root,w,dead){for(const I of bkWords(bkInfo(w))){const sy=[...root.querySelectorAll('.bwd[data-w="'+I.w+'"] .bsy')];
  if(sy.length<2){const d=root.querySelector('.bwd[data-w="'+I.w+'"]');d.classList.add('hl');await say(bkAu(I.w));await wait(300);d.classList.remove('hl');continue}
  for(let si=0;si<sy.length;si++){if(dead())return;sy[si].classList.add('hl');await say('sy_'+I.w+'_'+si);await wait(350);sy[si].classList.remove('hl')}}}
const hasSyl=w=>bkWords(bkInfo(w)).some(I=>I.S.length>1);
const sylTxt=w=>bkWords(bkInfo(w)).map(I=>I.S.join(' · ')).join('　');
/* 答對頁／答錯頁 用（取代 一塊 一塊 ＋）：最後 ＝ 正確 拼字＋音標＋圖＋中文 */
function bkHTML(w){const x=BOOK.W[w];return bkWordHTML(w,{fs:w.length>9?56:68})+(hasSyl(w)?'<div class="bsyl">音節：'+sylTxt(w)+'</div>':'')+'<div class="em">'+ICON(x.ic)+'</div><div class="zh">'+x.zh+'</div>'}
async function bkRead(f,w,n){const b=f.querySelector('.bw2');if(!b)return;if(hasSyl(w)){b.classList.add('split');await bkSyll(b,w,()=>false);b.classList.remove('split');await wait(450)}
  b.classList.add('hl');for(let r=0;r<(n||1);r++){await say(bkAu(w));await wait(400)}b.classList.remove('hl')}
const topicOf=w=>BOOK.topics.find(t=>t.ls.some(l=>l.w.indexOf(w)>=0))||{};
const topicLb=t=>'Topic 2: '+t.t+'（'+t.zt.replace(/ /g,'')+'）　'+t.lb;
/* 📗 從 CVC 到 課本（秒懂 動畫，照 老師 的 拉霸機 步驟：先 只 聽 ➜ 看 音標 ➜ 字母 一個 一個 出來 ➜ 音節 ➜ 合 起來）
   第五十次（老師 第 4 點）：上面 只 留「G4 L3 1/6」；右上角〔無〕〔🖼 圖示〕〔中文〕〔📋 單字 清單〕；第 ④ 步 的 字 拿掉；最後 一幕 圖＋中文（沒有 ＝）；
   最後 先 唸 bath、再 唸 room，合 起來 唸 bathroom 兩次；點 每 一個 字母 ＝ 聽 它 的 聲音（那 個 字母 稍微 放大 發亮）；〔🧩 逐步 拼音〕兩種 方式 */
const BT=Object.assign({no:false,ic:false,zh:false},LS.g('bt',{}));
const bkLesson=w=>{for(const t of BOOK.topics)for(const l of t.ls){const i=l.w.indexOf(w);if(i>=0)return 'G'+t.gr+'　L'+l.l.replace(/\D/g,'')+'　'+(i+1)+'/'+l.w.length}return ''};
/* 有 自己 意思 的 部分：bath＋room（pi，一個 音節 一個）、dining＋room（parts）*/
function bkPieces(root,w){const x=BOOK.W[w];if(x.parts)return x.parts.map(p=>({el:root.querySelector('.bwd[data-w="'+p+'"]'),ic:BOOK.W[p].ic,zh:BOOK.W[p].zh,au:bkAu(p)}));
  if(x.pi)return [...root.querySelectorAll('.bwd[data-w="'+w+'"] .bsy')].map((el,i)=>({el,ic:x.pi[i][0],zh:x.pi[i][1],au:'sy_'+w+'_'+i}));return []}
function bkLabs(root,w){const box=root.querySelector('.blabs');if(!box)return;box.innerHTML='';const on=BT.ic||BT.zh,P=bkPieces(root,w);box.style.height=on&&P.length?(BT.ic?(BT.zh?'118px':'78px'):'46px'):'0';if(!on)return;
  const r0=box.getBoundingClientRect();P.forEach(p=>{if(!p.el)return;const r=p.el.getBoundingClientRect(),d=H('div','plab',(BT.ic?'<span class="pi">'+ICON(p.ic)+'</span>':'')+(BT.zh?'<span class="pz">'+p.zh+'</span>':''));d.style.left=(r.left+r.width/2-r0.left)+'px';box.appendChild(d)})}
function bkRes(root,w,fin){const x=BOOK.W[w],br=root.querySelector('.bres');if(!br)return;const ic=fin||BT.ic,zh=fin||BT.zh;
  br.innerHTML=(ic?'<span class="em'+(fin?' pop':'')+'">'+ICON(x.ic)+'</span>':'')+(zh?'<span class="zh'+(fin?' pop':'')+'">'+x.zh+'</span>':'')}
/* 點 字母 ＝ 聽 那 一個 字母（一組）的 聲音 */
let TAPn=0;
async function bkTap(gp){const bw=gp.closest('.bwd');if(!bw)return;const o=bkInfo(bw.dataset.w).G[+gp.dataset.g],my=++TAPn;
  gp.classList.add('tap');if(!o.P.length){gp.classList.add('shh');await wait(700);gp.classList.remove('shh')}else for(let j=0;j<o.P.length;j++){if(my!==TAPn)break;await say(phAu(o,j))}
  setTimeout(()=>gp.classList.remove('tap'),120)}
/* 🧩 逐步 拼音：方式 1 ＝ b ➜ ba ➜ bath（字首＋母音 先 合）；方式 2 ＝ b ➜ ath ➜ bath（字首＋後面 一起）*/
const sylAu=(I,si)=>I.S.length>1?'sy_'+I.w+'_'+si:bkAu(I.w);
function sylParts(I,si){const gs=I.G.map((g,k)=>Object.assign({k},g)).filter(g=>g.s===si),vi=gs.findIndex(g=>g.v);const on=vi<0?gs:gs.slice(0,vi),vw=vi<0?null:gs[vi],cd=vi<0?[]:gs.slice(vi+1);
  const more=!!vw&&(vw.P.length>1||cd.some(g=>g.P.length));return {gs,on,vw,cd,more,onS:on.some(g=>g.P.length)}}
/* 第五十一次（老師 第 3 點）：
   方式 1（最 細膩）＝ 字首 子音 一個 一個 加上去（s ➜ st ➜ str）➜ 子音 群 後面 接 ong ➜ strong；一個 字首 ＝ b ➜ ba ➜ bath（r ➜ roo ➜ room ➜ bathroom）
   方式 2 ＝ 字首（str 整組）➜ 母音＋後面（ong）➜ 整個 字：str ➜ ong ➜ strong、th ➜ in ➜ thin、b ➜ ath ➜ bath ➜ r ➜ oom ➜ room ➜ bathroom
   只有 一個 音節 的 字：最後 只 唸 一次 整個 字（不 重複）。子音 群 的 聲音 ＝ cl_<字>_<音節>_<幾個>（tools/ph_step51.py）*/
function stepPlan(w,m){const out=[],WS=bkWords(bkInfo(w)),nsy=WS.reduce((n,I)=>n+I.S.length,0);
  for(const I of WS)I.S.forEach((_,si)=>{const q=sylParts(I,si),G=a=>a.map(g=>[I.w,g.k]),onG=q.on.filter(g=>g.P.length),cl=onG.length>=2;
    const upTo=n=>q.on.slice(0,q.on.indexOf(onG[n-1])+1),rime=()=>q.more?{g:G([q.vw].concat(q.cd)),au:'rm_'+I.w+'_'+si}:{g:G([q.vw]),gp:q.vw,I};
    if(m===1){
      if(cl){onG.forEach((g,n)=>out.push(n?{g:G(upTo(n+1)),au:'cl_'+I.w+'_'+si+'_'+(n+1)}:{g:G(upTo(1)),gp:g,I}));if(q.vw)out.push(rime())}
      else{q.on.forEach(g=>out.push({g:G([g]),gp:g,I}));
        if(q.onS&&q.vw&&q.more)out.push({g:G(q.on.concat([q.vw])),au:'cv_'+I.w+'_'+si});
        else if(!q.onS&&q.vw&&q.more)out.push({g:G([q.vw]),gp:q.vw,I})}}
    else{if(cl)out.push({g:G(q.on),au:'cl_'+I.w+'_'+si+'_'+onG.length});else q.on.forEach(g=>out.push({g:G([g]),gp:g,I}));
      if(q.onS&&q.vw)out.push(rime())}
    if(nsy>1)out.push({g:G(q.gs),au:sylAu(I,si)})});
  out.push({all:1,au:bkAu(w)});return out}
const stepTxt=(w,m)=>{const I=bkWords(bkInfo(w))[0],q=sylParts(I,0),on=q.on.map(g=>g.l).join(''),v=q.vw?q.vw.l:'',c=q.cd.map(g=>g.l).join(''),sy=I.S[0],onG=q.on.filter(g=>g.P.length);
  if(!on)return sy;if(m===2)return on+' ➜ '+v+c+' ➜ '+sy;
  if(onG.length>=2){const L=[];let t='';q.on.forEach(g=>{t+=g.l;if(g.P.length)L.push(t)});return L.join(' ➜ ')+' ➜ '+v+c+' ➜ '+sy}
  return on+' ➜ '+(q.more?on+v+' ➜ ':'')+sy};
async function bkStep(root,w,m,dead){const bw=root.querySelector('.bw2');bw.classList.remove('bars');for(const st of stepPlan(w,m)){if(dead())return;
  const els=st.all?[...bw.querySelectorAll('.bgp')]:st.g.map(([x,k])=>bw.querySelector('.bwd[data-w="'+x+'"] .bgp[data-g="'+k+'"]')).filter(Boolean);els.forEach(e=>e.classList.add('tap'));
  if(st.gp){if(!st.gp.P.length)await wait(500);else for(let j=0;j<st.gp.P.length;j++)await say(phAu(st.gp,j))}else await say(st.au);
  await wait(st.all?500:380);els.forEach(e=>e.classList.remove('tap'));await wait(120)}}
function bridgeOpen(w0){const L=bkOrder();let k=Math.max(0,L.indexOf(w0));G={k:'bridge'};const me=G;$('#lobby').hidden=true;const s=$('#game');s.hidden=false;s.onclick=null;$('#quit').hidden=false;$('#ttl').textContent='📗 從 CVC 到 課本';PAUSED=false;let tok=0,fin=false,SM=LS.g('bsm',1);
  const tgl=(id,key,lb)=>'<button class="btg'+(BT[key]?' on':'')+'" id="'+id+'">'+lb+'</button>';
  const show=async()=>{const w=L[k],x=BOOK.W[w],my=++tok,dead=()=>G!==me||tok!==my;fin=false;
    s.innerHTML='<div class="brg pnl'+(BT.no?' notile':'')+'"><div class="btop"><span class="lh">'+bkLesson(w)+'</span><span class="btgs">'+tgl('tN','no','無')+tgl('tI','ic','🖼 圖示')+tgl('tZ','zh','中文')+'<button class="btg" id="bl">📋 單字 清單</button></span></div>'+
     '<div class="bstep" id="bst">① 🎧 先 聽，看 字母 下面 的 音標</div>'+bkWordHTML(w,{cls:'bars'})+'<div class="blabs"></div><div class="bres" id="br"></div>'+ctlHTML()+
     '<div class="row bsp2"><button class="say cy" id="bsS">🧩 逐步 拼音</button><button class="say" id="bsM">方式 '+SM+'：'+stepTxt(w,SM)+'</button></div>'+
     '<div class="row"><button class="say" id="bp">◀ 上 一個</button><button class="say" id="bn">下 一個 ▶</button></div></div>';
    const root=s.querySelector('.brg');root.dataset.w=w;const bw=root.querySelector('.bw2'),st=$('#bst'),refresh=()=>{bkLabs(root,w);bkRes(root,w,fin)};
    bindCtl(show);$('#bp').onclick=()=>{k=(k+L.length-1)%L.length;show()};$('#bn').onclick=()=>{k=(k+1)%L.length;show()};$('#bl').onclick=()=>lobby('book');
    const flip=(id,key)=>{$('#'+id).onclick=()=>{BT[key]=!BT[key];LS.s('bt',BT);$('#'+id).classList.toggle('on',BT[key]);root.classList.toggle('notile',BT.no);refresh()}};flip('tN','no');flip('tI','ic');flip('tZ','zh');
    $('#bsM').onclick=()=>{SM=SM===1?2:1;LS.s('bsm',SM);$('#bsM').textContent='方式 '+SM+'：'+stepTxt(w,SM)};
    $('#bsS').onclick=async()=>{++tok;const t2=tok;st.innerHTML='🧩 逐步 拼音（方式 '+SM+'）';bw.classList.remove('bars','split');await bkStep(root,w,SM,()=>G!==me||tok!==t2);if(G===me&&tok===t2){st.innerHTML='&nbsp;';fin=true;refresh()}};
    root.addEventListener('click',e=>{const gp=e.target.closest('.bw2 .bgp');if(gp&&!bw.classList.contains('bars'))bkTap(gp)});
    refresh();
    for(let r=0;r<2;r++){if(dead())return;bw.classList.add('hl');await say(bkAu(w));bw.classList.remove('hl');await wait(700)}
    if(dead())return;st.textContent='② 一個 字母 一個 聲音（灰色 ＝ 不 發音）';await bkLetters(bw,w,dead);bw.classList.remove('bars');
    if(dead())return;if(hasSyl(w)){st.textContent='③ 音節：'+sylTxt(w);bw.classList.add('split');await wait(600);bkLabs(root,w);await bkSyll(bw,w,dead);await wait(300);if(dead())return;bw.classList.remove('split');await wait(650)}
    if(dead())return;st.innerHTML='&nbsp;';bw.classList.add('join');fin=true;bkLabs(root,w);bkRes(root,w,true);
    /* 老師：先 唸 bath、再 唸 room，然後 合 起來 唸 bathroom 兩次 */
    const P=bkPieces(root,w).length?bkPieces(root,w):hasSyl(w)?bkWords(bkInfo(w)).map(I=>[...bw.querySelectorAll('.bwd[data-w="'+I.w+'"] .bsy')].map((el,i)=>({el,au:'sy_'+I.w+'_'+i})))[0]:[];
    for(const p of P){if(dead())return;p.el.classList.add('hl');await say(p.au);await wait(380);p.el.classList.remove('hl');await wait(120)}
    for(let r=0;r<2;r++){if(dead())return;bw.classList.add('hl');await say(bkAu(w));await wait(420);bw.classList.remove('hl');await wait(200)}
    if(window.__PHAUTO&&window.__PHBR)window.__PHBR.push(w)};
  if(!window.__bkRZ){window.__bkRZ=1;addEventListener('resize',()=>{const r=document.querySelector('.brg');if(r&&r.dataset.w&&G&&G.k==='bridge')bkLabs(r,r.dataset.w)})}
  show()}
/* 課本 字 的 順序：三年級（We Can Help）在 前、四年級（My Home）在 後（BWL 的 順序 不 動 ＝ 老師看板 第幾題 不 變）*/
function bkOrder(gr){return [].concat(...BOOK.topics.slice().sort((a,b)=>a.gr-b.gr).filter(t=>!gr||t.gr===gr).map(t=>[].concat(...t.ls.map(l=>l.w))))}
/* 課本 遊戲 出題：25 題 闖關 ＝ 自己 年級 的 字、不 重複 */
function bkPick(g){if(!g.bw)return R(BWL);if(!g.bq||!g.bq.length)g.bq=SH(g.bw);return g.bq.pop()}
/* 拼塊：兩個 音節 以上 ＝ 音節（ra · bbit）；一個 音節 ＝ 原本 的 一塊 一塊 */
function blocksOf(w){return [].concat(...bkWords(bkInfo(w)).map(I=>I.S.length>1?I.S.map((s,si)=>[s,'sy_'+I.w+'_'+si]):BOOK.W[I.w].c.map(c=>[c[0].toLowerCase(),'bc_'+c[0].toLowerCase()])))}

/* ══ 第四十九次 第 9-(1) 點 新 遊戲：🧩 音標 密碼 拼字（照 老師 的 截圖：字母 藏 成 彩色 橫條、下面 是 音標 ➜ 聽＋看 音標，把 字母 一個 一個 放 回去）══
   橫條 顏色 ＝ 提示：紅 ＝ 母音、粉紅 ＝ 兩個 母音、水藍 ＝ th sh ch ng、灰 ＝ 不 發音（也 要 拼 出來）。
   鍵盤 ＝ 這個 字 的 字母 ＋ 容易 搞混 的 字母（b／d／p、m／n、a／e、e／i、o／u）；放錯 ＝ 那 一格 抖 一下、不 放 進去；同 一格 錯 2 次 ＝ 正確 字母 閃 一下（鷹架）。
   研究：拼字 練習 讓 學生 把 聲音 對到 字母（phoneme–grapheme mapping）對 拼讀 有 中 等 以上 效果（Graham & Santangelo 2014 後設分析 https://doi.org/10.1007/s11145-014-9517-0 ；這次 沒有 打開 原文 核對 數字）*/
const CONF={b:'dp',d:'bt',p:'bq',m:'n',n:'mu',a:'e',e:'ia',i:'e',o:'ua',u:'o',t:'d',g:'q',h:'n',r:'l',l:'r',s:'z',c:'k',k:'c',y:'i',w:'v',f:'v',v:'f'};
function bkSpQ(g){const w=bkPick(g),x=BOOK.W[w];g.w=w;const letters=w.replace(/ /g,'').split('');
  const ex=[];letters.forEach(c=>(CONF[c]||'').split('').forEach(z=>{if(z&&letters.indexOf(z)<0&&ex.indexOf(z)<0)ex.push(z)}));
  const keys=SH([...new Set(letters)].concat(SH(ex).slice(0,Math.max(3,8-new Set(letters).size))));
  stage(g,'<div class="ask">🧩 🔊 聽＋👀 看 <span class="k">音標</span> ➜ 把 字母 放 回 彩色 橫條 <button class="say" id="rp">🔊 再 聽</button></div>'+bkWordHTML(w,{cls:'bars sp',fs:w.length>9?66:w.length>6?92:120})+
   '<div class="kb" id="kb">'+keys.map(c=>'<button class="key" data-c="'+c+'">'+c+'</button>').join('')+'<button class="key bk" id="bkx">⌫</button></div>',GM.bksp.T,()=>chk(true));
  const play=()=>say(bkAu(w));play();$('#rp').onclick=play;
  const slots=[...$$('.bw2 .bgl i')];let pos=0,miss=0;const mark=()=>slots.forEach((s,k)=>s.classList.toggle('cur',k===pos));mark();
  $('#kb').onclick=e=>{if(g.lock===g.q)return;if(e.target.closest('#bkx')){if(pos>0){pos--;slots[pos].classList.remove('on');miss=0;mark()}return}
    const b=e.target.closest('.key');if(!b||pos>=slots.length)return;const c=b.dataset.c;
    if(c!==slots[pos].textContent){slots[pos].classList.add('shake');setTimeout(()=>slots[pos]&&slots[pos].classList.remove('shake'),450);g.miss=(g.miss||0)+1;miss++;if(miss>=2){const t=slots[pos];t.classList.add('peek');setTimeout(()=>t.classList.remove('peek'),900)}return}
    slots[pos].classList.add('on');pos++;miss=0;mark();if(pos>=slots.length)setTimeout(()=>chk(false),300)};
  g.miss=0;
  function chk(tout){if(g.lock===g.q)return;const right=!tout&&(g.miss||0)===0;
    answer(g,right,tout?null:'放錯 '+g.miss+' 次',w,{idx:BWL.indexOf(w),au:bkAu(w),okHTML:bkHTML(w),noHTML:bkHTML(w),tip:tout?'':'第一次 就 全部 放 對 才 算 答對',okRun:f=>bkRead(f,w),noRun:f=>bkRead(f,w,2)})}
  if(window.__PHAUTO){const ks=[...$$('.key')];if(window.__PHWRONG){const z=ks.find(k=>k.dataset.c!==slots[0].textContent&&k.id!=='bkx');if(z)z.click()}
    slots.forEach(s=>{const k=ks.find(b=>b.dataset.c===s.textContent);if(k)k.click()})}}
GM.bksp={ic:'🧩',nm:'音標 密碼 拼字',T:45,q:bkSpQ,c:['#5A1E6A','#200A2A'],how:'🔊 聽 課本 的 字＋👀 看 字母 下面 的 音標 ➜ 把 字母 一個 一個 放 回 彩色 橫條（紅 ＝ 母音、灰 ＝ 不 發音 也 要 拼）。',tag:'課本'};

/* ══ 第四十九次 第 9-(2) 點：🏁 CVC 單字 25 題 闖關 ══
   前 15 題 ＝ CVC 遊戲（9 種 混 在 一起，每 一回合 組合 都 不一樣）、最後 10 題 ＝ 從 CVC 到 課本（自己 年級 的 課：三年級 We Can Help、四年級 My Home；拼塊、找圖、音標 密碼 拼字 輪流）。
   放在 總首頁（老師 上課）、〔⚡ 現場任務〕三年級 和 四年級。成績 g年級gm_ph-c25（第幾題：CVC ＝ ITEMS、課本 ＝ ITEMS 長度 ＋ BWL）。*/
const C25N=25,C25A=['slot','ufo','vault','zhu','bal','vow','end','pic','train'],C25B=['bk','bkp','bksp'];
function c25Seq(){const last=LS.g('c25last','');let seq;for(let t=0;t<20;t++){const a=[];while(a.length<15){const p=SH(C25A);if(a.length&&p[0]===a[a.length-1])p.push(p.shift());a.push(...p)}
  const b=[];while(b.length<10){const p=SH(C25B);if(b.length&&p[0]===b[b.length-1])p.push(p.shift());b.push(...p)}seq=a.slice(0,15).concat(b.slice(0,10));if(seq.join()!==last)break}
  LS.s('c25last',seq.join());return seq}
const nq=g=>g.N||NQ;
function c25Gr(){if(typeof SCID!=='undefined'&&/^[34]/.test(String(SCID||'')))return +String(SCID).charAt(0);const m=/[?&]c25=([34])/.exec(location.search);return m?+m[1]:LS.g('c25gr',3)}
GM.c25={ic:'🏁',nm:'CVC 單字 25 題 闖關',T:0,c:['#7A5A00','#2A1E00'],how:'25 題 一關 一關 闖：前 15 題 ＝ CVC 遊戲（每 一回合 組合 都 不一樣），最後 10 題 ＝ 課本 單字。',tag:'闖關',
  q:g=>{const k=g.seq[g.q];g.cur=k;return GM[k].q(g)}};
function c25Start(gr){gr=gr||c25Gr();LS.s('c25gr',gr);start('c25',{gr})}


/* ══ 第四十九次 第 9-(2) 點：〔⚡ 現場任務〕三年級、四年級 ＝ 🏁 CVC 單字 25 題 闖關 ══
   網址 ?live=0304（現場任務 平板 自己 帶 過來）：登入 ➜ 每 0.9 秒 看 rooms/0304/cr；老師 開 set 'c25' ＝ 馬上 開始（年級 ＝ 班級 第一個 數字）；
   每 答 一題 ＝ 寫 crp/5碼（大螢幕 即時 排行榜：答了 幾題、對 幾題、💯 正確率）；老師 時間 到（XLV）或 結束 ＝ 答了 幾題 就 送 幾題。
   學生 已經 在 這一頁（不是 從 現場任務 來 的）＝ 每 2 秒 看 自己 班，老師 一 開 就 自己 跳 進去。測試 開關 window.__PHLIVE（不 連 真的 Firebase）*/
let CRP=null;
const LDBx=()=>window.__PHLIVE||(typeof LDB!=='undefined'&&LDB.on&&LDB.on()?LDB:null);
function crPub(g){const D=LDBx();if(!CRP||!D||typeof SCID==='undefined'||!SCID)return;const n=g.res.length,ok=g.ok;const o={n,ok,s:n?Math.round(ok/n*1000)/10:0,g:'c25',gp:g.score};
  if(typeof XLV!=='undefined'&&D===LDB)XLV.prog(CRP.room,CRP.t,SCID,o);else D.set('rooms/'+CRP.room+'/crp/'+SCID,Object.assign(o,{t:CRP.t}))}
function crMsg(t,extra){$('#lobby').hidden=true;const s=$('#game');s.hidden=false;s.onclick=null;s.innerHTML='<div class="intro pnl pop"><div class="ie">🏁</div><h2>'+t+'</h2>'+(extra||'')+'</div>'}
window.xForce=function(){const g=G;if(!g||g.k!=='c25'||g.sent)return false;g.fz=1;if(g.t)g.t.stop();AUtok++;rec(g);crPub(g);crMsg('⏰ 時間 到！','<div class="how">答了 '+g.res.length+' 題，對 '+g.ok+' 題，成績 送 給 老師 了。</div>');G=null;return true};
function crOn(v){if(!CRP)return;if(typeof XLV!=='undefined')try{XLV.cfg(v)}catch(e){}
  if(!v||!v.on||v.set!=='c25'||Date.now()-(+v.t||0)>4*36e5){if(G&&G.k==='c25'&&!G.sent&&G.res.length){rec(G);crPub(G);G=null;crMsg('✅ 老師 結束 了，謝謝！','<a class="big" href="../live/index.html">⬅ 回 現場任務</a>')}
    else if(!G)crMsg('⏳ 等 老師 開始 CVC 單字 25 題 闖關…');return}
  if(v.t!==CRP.t){CRP.t=v.t;const gr=+String(CRP.room).charAt(1)||c25Gr();start('c25',{gr,g:{live:1,onQ(){crPub(this)},onEnd(){crPub(this)}}});const go=$('#go');if(go)go.click()}}
function crInit(){const m=/[?&]live=(\d{4})/.exec(location.search);if(!m){crAuto();return}CRP={room:m[1],t:0};document.body.classList.add('crm');
  const go=CRP.go=()=>{const D=LDBx();if(!D){crMsg('📶 現場任務 還沒 開');return}crMsg('⏳ 等 老師 開始 CVC 單字 25 題 闖關…');D.poll('rooms/'+CRP.room+'/cr',900,crOn)};
  if(typeof SCON!=='undefined'&&SCON&&(typeof SCID==='undefined'||!SCID)&&typeof scLogin==='function'){scLogin(function(){SCH.close();if(typeof scBar==='function')scBar();go()});return}go()}
function crAuto(){const D=LDBx();if(!D)return;let room='',stop=null,gone=0;setInterval(()=>{const id=typeof SCID!=='undefined'?String(SCID||''):'';const r=/^[34]\d{4}$/.test(id)?'0'+id.slice(0,3):'';if(r===room)return;room=r;if(stop){stop();stop=null}if(!r)return;
  stop=D.poll('rooms/'+r+'/cr',2000,v=>{if(gone||!v||!v.on||v.set!=='c25'||Date.now()-(+v.t||0)>4*36e5)return;gone=1;crMsg('📢 老師 開了 CVC 單字 25 題 闖關！','<div class="how">⏳ 馬上 進去…</div>');setTimeout(()=>location.replace(location.pathname+'?live='+r),1400)})},2000)}
/* ══ 大廳 ══ */
/* 第五十次（老師 第 6-(3) 點）：大廳 重新 設計 ＝ 簡潔、有 質感、秒懂（一種 底色、一種 重點 色 金色；遊戲 圖示 ＝ 同 一套 線條 圖示，不用 卡通 表情）*/
const LI2={slot:'<rect x="5" y="7" width="19" height="19" rx="3"/><path d="M10 7v19M15 7v19M20 7v19"/><path d="M24 12h3v-4"/><circle cx="27" cy="7" r="2"/>',
  ufo:'<ellipse cx="16" cy="15" rx="12" ry="4.5"/><path d="M10 13a6 6 0 0 1 12 0"/><path d="M12 20l-3 7M20 20l3 7M16 20v7"/>',
  vault:'<rect x="6" y="13" width="20" height="15" rx="3"/><path d="M11 13V9a5 5 0 0 1 10 0v4"/><circle cx="16" cy="20.5" r="2.4"/>',
  zhu:'<rect x="5" y="5" width="22" height="22" rx="4"/><text x="16" y="21.5" text-anchor="middle" font-size="13" font-weight="900" fill="currentColor" stroke="none">ㄅ</text>',
  bal:'<ellipse cx="16" cy="12" rx="7.5" ry="9"/><path d="M14.5 21l1.5 2 1.5-2M16 23c-2 3 2 4 0 7"/>',
  vow:'<circle cx="12" cy="16" r="7"/><circle cx="20" cy="16" r="7"/>',
  end:'<circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="6.5"/><circle cx="16" cy="16" r="2" fill="currentColor"/>',
  lad:'<path d="M10 4v24M22 4v24M10 9h12M10 15h12M10 21h12M10 27h12"/>',
  pic:'<rect x="4" y="6" width="24" height="20" rx="3"/><circle cx="11" cy="12" r="2.4"/><path d="M5 24l7-7 5 5 4-4 6 6"/>',
  train:'<rect x="5" y="9" width="16" height="13" rx="2"/><path d="M21 13h5v9h-5M9 9V6h6v3"/><circle cx="10" cy="25" r="2.5"/><circle cx="21" cy="25" r="2.5"/>',
  bk:'<path d="M4 7h9a3 3 0 0 1 3 3v17a3 3 0 0 0-3-3H4zM28 7h-9a3 3 0 0 0-3 3v17a3 3 0 0 1 3-3h9z"/>',
  bkp:'<path d="M4 7h9a3 3 0 0 1 3 3v17a3 3 0 0 0-3-3H4z"/><rect x="18" y="7" width="10" height="10" rx="2"/><path d="M19 16l3-3 2 2 3-3"/>',
  bksp:'<rect x="4" y="10" width="24" height="14" rx="3"/><path d="M8 14h2M13 14h2M18 14h2M23 14h1M8 19h16"/>',
  yn:'<circle cx="11" cy="16" r="7"/><path d="M20 9l8 14M28 9l-8 14"/>',
  twin:'<circle cx="11" cy="13" r="5"/><circle cx="21" cy="13" r="5"/><path d="M4 27c1-5 4-7 7-7s6 2 7 7M14 27c1-5 4-7 7-7s6 2 7 7"/>',
  line:'<rect x="4" y="4" width="24" height="24" rx="3"/><path d="M12 4v24M20 4v24M4 12h24M4 20h24"/><path d="M7 25L25 7" stroke-width="3"/>',
  c25:'<path d="M7 28V5"/><path d="M7 6h17l-3 5 3 5H7"/>',
  ls:'<path d="M16 28V15"/><path d="M16 17c-6 0-9-4-9-9 6 0 9 4 9 9zM16 15c0-5 3-8 9-8 0 5-3 8-9 8z"/>'};
const lic=k=>'<svg class="li" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+(LI2[k]||'')+'</svg>';
const SHOW={yn:'聽 一個 字，開頭 是 不是 這個 字母',twin:'聽 兩個 字，開頭 或 母音 一樣 嗎',line:'跟 魔王 搶 格子，拼 對 就 佔領，連 3 格',slot:'拉 拉桿，聽 3 個 聲音，選 對 的 字',ufo:'聽 一個 字，打 對 的 飛碟',vault:'聽 一個 字，轉 密碼 拼 出來',zhu:'看 一個 字，選 對 的 音標',bal:'聽 一個 字，戳 它 的 第一個 字母',vow:'聽 一個 字，選 中間 的 母音',end:'聽 一個 字，選 最後 的 聲音',lad:'聽 一個 字，只 換 一個 字母',pic:'自己 唸，選 對 的 圖',train:'聽 一個 字，字母 照 順序 放上 車廂',bk:'聽 課本 的 字，一塊 一塊 拼',bkp:'自己 唸 課本 的 字，選 對 的 圖',bksp:'看 音標，把 字母 放 回去'};
function lobby(sec){G=null;AUtok++;PAUSED=false;document.body.classList.remove('fever');$('#lobby').hidden=false;$('#game').hidden=true;$('#game').innerHTML='';$('#quit').hidden=true;$('#ttl').textContent='自然發音 遊戲場';
  const gc=k=>{const M=GM[k],b=LS.g('best_'+k,0);return '<button class="gc" data-go="'+k+'"><span class="ic">'+lic(k)+'</span><span class="gt"><b>'+M.nm+'</b><small>'+(SHOW[k]||M.how.split('。')[0])+'</small><span class="gm"><span class="tg">'+M.tag+'</span>'+(b?'<span class="best">最佳 '+b+'</span>':'')+'</span></span></button>'};
  const bk=LS.g('book',[]),all=WORDS.map(x=>x[0]).concat(bkOrder());
  /* 第四十九次 第 7-(1) 點：圖鑑 的 字 ＝ 母音 字母 紅色、不 發音 的 字母 灰色（課本 的 字 也 收集）*/
  const dexW=w=>BKW[w]?'<span class="dw">'+bkWords(bkInfo(w)).map(I=>I.G.map(o=>[...o.l].map(ch=>'<i class="'+lcls(o,ch)+'">'+ch+'</i>').join('')).join('')).join(' ')+'</span>':'<span class="dw">'+[...w].map(ch=>'<i class="lc-'+('aeiou'.indexOf(ch)>=0?'v':'c')+'">'+ch+'</i>').join('')+'</span>';
  const dexE=w=>BKW[w]?ICON(BKW[w].ic):REAL[w].em,dexZ=w=>BKW[w]?BKW[w].zh:REAL[w].zh;
  const sec2=(n,t,h,x)=>'<div class="sec"'+(x||'')+'><span class="sn">'+n+'</span><h2>'+t+'</h2><span class="sh">'+h+'</span></div>';
  $('#lobby').innerHTML='<div class="hero"><div><h1>自然發音 遊戲場</h1><p>一局 5 題・限時・答對 愈 快 分數 愈 高</p></div><div class="hr"><div class="lv"><button data-lv="1"'+(LV===1?' class="on"':'')+'>簡單：a i o</button><button data-lv="2"'+(LV===2?' class="on"':'')+'>全部：a e i o u</button></div><button class="rxq" data-rx="fever">❓ 分數 怎麼 算</button></div></div>'+
   sec2('1','CVC 單字 25 題 闖關','前 15 題 CVC 遊戲＋最後 10 題 課本 單字',' class="sec c25s"')+'<div class="c25row"><button class="c25" data-c25="3"><span class="ic">'+lic('c25')+'</span><b>三年級</b><small>最後 10 題：We Can Help</small></button><button class="c25" data-c25="4"><span class="ic">'+lic('c25')+'</span><b>四年級</b><small>最後 10 題：My Home</small></button></div>'+
   sec2('2','新手 小學堂','看 字母 ➜ 聽 聲音 ➜ 慢慢 合 起來 ➜ 換 你')+'<div class="path">'+LESS.map((L,i)=>'<button class="pstop'+(LS.g('ls_'+L.v,0)?' done':'')+'" data-ls="'+i+'"><span class="pv">'+L.v+'</span><small>第 '+(i+1)+' 課'+(LS.g('ls_'+L.v,0)?' ✔':'')+'</small></button>').join('')+'</div>'+
   sec2('3','CVC 遊戲','13 種 玩法：聽、讀、拼')+'<div class="gg">'+['line','yn','twin','slot','ufo','vault','zhu','bal','vow','end','lad','pic','train'].map(gc).join('')+'</div>'+
   sec2('4','從 CVC 到 課本 單字','點 一個 字 看 動畫',' id="bookSec"')+'<div class="pnl bkl">'+BOOK.topics.slice().sort((a,b)=>a.gr-b.gr).map(t=>'<div class="bkt"><b>'+(t.gr===3?'三年級':'四年級')+'　'+t.t+'</b>'+t.ls.map(l=>'<div class="bkr"><span>'+l.l+'</span>'+l.w.map(w=>'<button class="bkb" data-br="'+w+'">'+w+'</button>').join('')+'</div>').join('')+'</div>').join('')+
   '<div class="row"><button class="big" data-br="'+bkOrder()[0]+'">▶ 從 第 一個 字 開始 看</button></div><div class="gg">'+['bk','bkp','bksp'].map(gc).join('')+'</div></div>'+
   sec2('5','我 的 單字 圖鑑',bk.length+' ／ '+all.length+'　點 卡片 ＝ 聽 發音')+'<div class="pnl book"><div class="dxh"><div class="bar"><i style="width:'+Math.round(bk.length/all.length*100)+'%"></i></div><button class="rxq" data-rx="dex">❓ 收集 加分 怎麼 算</button></div><div class="bw">'+
   all.map(w=>bk.indexOf(w)>=0?'<button class="bc" data-dw="'+w+'"><div class="e">'+dexE(w)+'</div><div class="w">'+dexW(w)+'</div><div class="z">'+dexZ(w)+'</div></button>':'<div class="bc no"><div class="e">'+dexE(w)+'</div><div class="w">？？？</div><div class="z">還沒 收集</div></div>').join('')+'</div></div>';
  if(sec==='book'){const b=$('#bookSec');if(b)b.scrollIntoView()}}
/* 第五十次（老師 第 6-(1)(2)、8 點）：🔥 連對 加倍、👑 最後 一題 ✖2、📖 收集 加分 ＝ 秒懂 動畫（第一次 玩 自動 演；隨時 按〔❓〕再 看）*/
async function ruleShow(kind,then){const tok=++RXn,ov=H('div','rx'),gem=(c,t)=>'<i class="rg '+c+'">'+(t||'')+'</i>';
  const TT={fever:'🔥 連對 加倍',boss:'👑 最後 一題 ✖2',dex:'📖 收集 加分'};
  ov.innerHTML='<div class="rxp pnl pop"><h3>'+TT[kind]+'</h3><div class="rxs" id="rxs"></div><div class="rxc" id="rxc">&nbsp;</div><div class="row"><button class="say" id="rxP">⏸️ 暫停</button><button class="say" id="rxS">🐢 放慢</button><button class="say" id="rxR">🔁 再看一次</button><button class="big" id="rxOK">✔ 懂了</button></div></div>';
  document.body.appendChild(ov);const S=ov.querySelector('#rxs'),C=ov.querySelector('#rxc'),dead=()=>tok!==RXn||!ov.isConnected,cap=t=>{C.innerHTML=t;C.classList.remove('pop');void C.offsetWidth;C.classList.add('pop')};
  const close=()=>{RXn++;PAUSED=false;ov.remove();if(then)then()};ov.querySelector('#rxOK').onclick=close;ov.querySelector('#rxR').onclick=()=>{ov.remove();ruleShow(kind,then)};
  const P=ov.querySelector('#rxP');P.onclick=()=>{PAUSED=!PAUSED;P.textContent=PAUSED?'▶️ 繼續':'⏸️ 暫停'};const Sl=ov.querySelector('#rxS');Sl.classList.toggle('on',SLOW>1);Sl.onclick=()=>{SLOW=SLOW>1?1:1.5;Sl.classList.toggle('on',SLOW>1)};
  const pts=(a,b)=>'<span class="rpt"><s>＋'+a+'</s> ➜ <b>＋'+b+'</b></span>',W=ms=>wait(ms);
  if(kind==='fever'){S.innerHTML='<div class="rgs">'+gem('','1')+gem('','2')+gem('','3')+'</div><div class="rfl"><span>🔥</span><span>🔥</span></div><div class="rnum" id="rn"></div>';const g=[...S.querySelectorAll('.rg')],f=[...S.querySelectorAll('.rfl span')],n=S.querySelector('#rn');
    cap('答對 1 題 ＝ ＋100');await W(500);if(dead())return;g[0].className='rg ok';g[0].textContent='✔';f[0].classList.add('on');n.innerHTML='＋100';await W(1500);if(dead())return;
    cap('再 答對 1 題（連續 2 題）');g[1].className='rg ok';g[1].textContent='✔';f[1].classList.add('on');n.innerHTML='＋100';await W(1600);if(dead())return;
    cap('🔥 下 一題 答對 ＝ 分數 ✖2');g[2].className='rg fire';S.classList.add('hot');await W(900);if(dead())return;g[2].textContent='✔';n.innerHTML=pts(100,200);await W(2200);if(dead())return;
    cap('答錯 ＝ 🔥 熄掉，重新 數');S.classList.remove('hot');g[2].className='rg no';g[2].textContent='✖';f.forEach(x=>x.classList.remove('on'));n.innerHTML='';await W(2200)}
  else if(kind==='boss'){S.innerHTML='<div class="rgs">'+gem('','1')+gem('','2')+gem('','3')+gem('','4')+gem('boss','👑')+'</div><div class="rnum" id="rn"></div>';const g=[...S.querySelectorAll('.rg')],n=S.querySelector('#rn');
    cap('一局 有 5 題');for(let i=0;i<4;i++){await W(380);if(dead())return;g[i].className='rg ok';g[i].textContent='✔'}await W(700);if(dead())return;
    cap('👑 第 5 題 ＝ 最後 一題');g[4].classList.add('glow');await W(1500);if(dead())return;
    cap('最後 一題 答對 ＝ 分數 ✖2');g[4].textContent='✔';n.innerHTML=pts(100,200);await W(2200);if(dead())return;
    cap('🔥 連對 加倍 ＋ 👑 最後 一題 ＝ ✖2 再 ✖2');n.innerHTML=pts(100,400);await W(2600)}
  else{S.innerHTML='<div class="rcd" id="cd"><div class="fr">？？？</div><div class="bk2"><div class="e">🐱</div><div class="w">c<b>a</b>t</div><div class="z">貓</div></div></div><div class="rtm" id="tmb"><i></i></div><div class="rnum" id="rn"></div>';const cd=S.querySelector('#cd'),n=S.querySelector('#rn'),tb=S.querySelector('#tmb');
    cap('第一次 答對 一個 新 的 字');await W(900);if(dead())return;cd.classList.add('flip');await W(1200);if(dead())return;
    cap('📖 收進 圖鑑 ＝ 這 一題 分數 ✖2');n.innerHTML=pts(100,200);await W(2200);if(dead())return;
    cap('⏱ 時間 還 剩 一半 以上 就 答對');tb.classList.add('on');await W(2000);if(dead())return;
    cap('⚡ 快 收集 ＝ 再 ✖2');n.innerHTML=pts(200,400);await W(2200);if(dead())return;
    cap('收集 過 的 字 不 再 加倍 ➜ 去 找 新 的 字！');n.innerHTML='';await W(2400)}
  if(!dead())cap('按〔✔ 懂了〕')}
let RXn=0;
document.addEventListener('click',e=>{const rx=e.target.closest('[data-rx]');if(rx){ruleShow(rx.dataset.rx,rx.dataset.rx==='fever'&&rx.classList.contains('rxq')?()=>ruleShow('boss'):null);return}const dw=e.target.closest('[data-dw]');if(dw){dw.classList.add('tap');say(auOf(dw.dataset.dw)).then(()=>dw.classList.remove('tap'));return}const l=e.target.closest('[data-lv]');if(l){LV=+l.dataset.lv;LS.s('lv',LV);lobby();return}
  const g=e.target.closest('[data-go]');if(g){start(g.dataset.go);return}const ls=e.target.closest('[data-ls]');if(ls){lessonOpen(+ls.dataset.ls);return}const br=e.target.closest('[data-br]');if(br){bridgeOpen(br.dataset.br);return}const c5=e.target.closest('[data-c25]');if(c5){c25Start(+c5.dataset.c25);return}
  const md=e.target.closest('[data-md]');if(md){MD=md.dataset.md;LS.s('md',MD);$$('[data-md]').forEach(b=>b.classList.toggle('on',b===md));retile();if(G&&G.k==='bridge')$('#cR').click();return}
  if(e.target.closest('#quit')){if(G&&G.t)G.t.stop();lobby()}});
$$('[data-md]').forEach(b=>b.classList.toggle('on',b.dataset.md===MD));
lobby();crInit();{const sb=document.getElementById('scbar');if(sb&&window.ResizeObserver)new ResizeObserver(()=>document.documentElement.style.setProperty('--sbh',(sb.hidden?0:sb.offsetHeight)+'px')).observe(sb)}{const m=/[?&]c25=([34])/.exec(location.search);if(m&&!/[?&]live=/.test(location.search))c25Start(+m[1])}
window.PHG={get G(){return G},GM:GM,start:start,lobby:lobby,lessonOpen:lessonOpen,bridgeOpen:bridgeOpen,c25Start:c25Start,crGo:()=>CRP&&CRP.go&&CRP.go(),bkInfo:bkInfo,bkOrder:bkOrder,slotNear:slotNear,phAu:phAu,HARDV:HARDV,CNEAR:CNEAR,C25A:C25A,C25B:C25B,ITEMS:ITEMS,BWL:BWL,codeOf:codeOf,near:near,realOf:realOf,pseOf:pseOf};
})();
