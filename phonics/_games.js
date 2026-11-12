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
const sOf=(p,k)=>k===0?'s_'+PH.initCode(p.i,p.v):k===1?'s_'+PH.vowCode(VOWS[p.v]):(p.e==='m'?'s_em':p.e==='n'?'s_en':p.e==='x'?'s_x':p.e==='ck'?'s_ck':'s_'+PH.endCode(p.e));
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
/* ══ 方塊（雙語 注音／KK／IPA，跟 字卡 一樣 的 顏色）：一個 字母 一組 ══ */
function unitTiles(w,md){md=md||MD;const p=parts(w),C=PH.CONS,V=VOWS[p.v],out=[[],[],[]];
  const pick=e=>md==='zh'?e.zh:md==='kk'?e.kk:e.ipa;
  const ik=(p.i==='c'||p.i==='g')?p.i+'_'+(PH.SOFT.indexOf(p.v)>=0?'soft':'hard'):p.i,ie=C[ik]||PH2.CONS2[p.i];
  if(md==='zh'&&ie.stack)out[0].push({t:ie.zh,bg:PH.CC,stack:1});else [].concat(pick(ie)).forEach((z,k)=>out[0].push({t:z,bg:PH.CC,sup:md==='zh'&&k===0&&!Array.isArray(ie.zh)?ie.sup:null}));
  const ve=PH.VOW[p.v];out[1].push({t:pick(ve),sup:md==='zh'?ve.sup:null,bg:ve.bg,v:1});
  const ek={l:'l_end',d:'d_end',m:'m_end',n:'n_end',r:'r_end',g:'g_end',p:'p_end',f:'f_end',t:'t_end'}[p.e]||p.e,ee=C[ek];
  [].concat(pick(ee)).forEach((z,k)=>out[2].push({t:z,bg:PH.CC,sup:md==='zh'?(Array.isArray(ee.sup)?ee.sup[k]:(k===0?ee.sup:null)):null}));return out}
function tileHTML(T,md){md=md||MD;return '<span class="tls">'+T.map(x=>'<span class="tl'+(md==='zh'?'':' ph')+(x.stack?' stk':'')+(x.dark?' dk':'')+'" style="background:'+x.bg+'">'+(x.stack?x.t.map(s=>'<span>'+s+'</span>').join(''):x.t)+(x.sup?'<span class="sup">'+x.sup+'</span>':'')+'</span>').join('')+'</span>'}
const allTiles=w=>tileHTML([].concat(...unitTiles(w)));
function wordHTML(w){const p=parts(w);return p?'<span class="wd">'+p.i+'<span class="v">'+p.v+'</span>'+p.e+'</span>':'<span class="wd">'+w+'</span>'}
/* 字母（大）＋ 正下方 方塊；點 一個 字母 ＝ 唸 那個 音 */
function letRow(w,sz,id){const p=parts(w),T=unitTiles(w),L=[p.i,p.v,p.e];
  return '<div class="lt" id="'+(id||'lr')+'" data-w="'+w+'">'+L.map((x,k)=>'<div class="u" data-u="'+k+'"><span class="L'+(k===1?' v':'')+'" style="font-size:'+(sz||110)+'px'+(k===1?';color:#000;background:var(--vowel);border-radius:.14em;padding:0 .06em':'')+'">'+x+'</span>'+tileHTML(T[k])+'</div>').join('')+'</div>'}
/* 一個 一個 唸（唸到 的 字母 稍微 放大 發亮），三個 唸完 一起 亮＋唸 整個 字 */
async function blend(root,w,full){const p=parts(w),us=[...root.querySelectorAll('.u')];
  for(let k=0;k<3;k++){if(!us[k])continue;us[k].classList.add('hl');await say(sOf(p,k));await wait(220);us[k].classList.remove('hl');await wait(80)}
  if(full===false)return;us.forEach(u=>u.classList.add('hl'));await say(codeOf(w));await wait(350);us.forEach(u=>u.classList.remove('hl'))}
function bindLet(root){root.addEventListener('click',e=>{const u=e.target.closest('.u');if(!u)return;const w=u.closest('.lt').dataset.w,k=+u.dataset.u;u.classList.add('hl');say(sOf(parts(w),k)).then(()=>setTimeout(()=>u.classList.remove('hl'),150))})}
/* ══ 嘴巴 提示（容易 搞混 的 音）══ */
const CUE={b:'👄 雙唇 碰 一下、喉嚨 會 震動',p:'👄 雙唇 碰 一下、🪶 吹 一口 氣',d:'👅 舌尖 碰 上 牙 後面、喉嚨 會 震動',t:'👅 舌尖 碰 上 牙 後面、🪶 吹 一口 氣',
  m:'👄 嘴巴 閉起來 嗯～（mmm）',n:'👅 嘴巴 張開、舌尖 頂 上面 嗯～',g:'喉嚨 後面 碰 一下、會 震動',k:'喉嚨 後面 碰 一下、🪶 吹 氣',c:'喉嚨 後面 碰 一下、🪶 吹 氣',
  f:'🦷 上 牙 輕輕 咬 下 唇、吹 氣',v:'🦷 上 牙 輕輕 咬 下 唇、會 震動',s:'🐍 嘶～ 不 震動',z:'🐝 滋～ 會 震動',
  a:'😮 嘴巴 張 大 大（🍎 apple）',e:'🙂 嘴巴 張 小 一點（🥚 egg）',i:'😬 嘴巴 扁扁、小小 的（🐛 insect）',o:'😲 嘴巴 張 大 圓圓（🐙 octopus）',u:'😐 嘴巴 放鬆 ㄜ（☂️ umbrella）'};
const VKEY={a:['🍎','apple'],e:['🥚','egg'],i:['🐛','insect'],o:['🐙','octopus'],u:['☂️','umbrella']};
function diffTip(w,x){if(!x||!parts(x))return '';const p=parts(w),q=parts(x),out=[];
  if(p.i!==q.i)out.push('開頭：你 選 '+q.i+'（'+(CUE[q.i]||'')+'）；聽到 的 是 <b>'+p.i+'</b>（'+(CUE[p.i]||'')+'）');
  if(p.v!==q.v)out.push('中間：你 選 '+q.v+'（'+(CUE[q.v]||'')+'）；聽到 的 是 <b>'+p.v+'</b>（'+(CUE[p.v]||'')+'）');
  if(p.e!==q.e)out.push('最後：你 選 '+q.e+'（'+(CUE[q.e]||'')+'）；聽到 的 是 <b>'+p.e+'</b>（'+(CUE[p.e]||'')+'）');
  return out.join('<br>')}
/* ══ 圖 ══ */
const SVG={thin:'<svg viewBox="0 0 60 90" width="1em" height="1.3em"><circle cx="30" cy="14" r="9" fill="#FFD7A8"/><rect x="26" y="25" width="8" height="34" rx="4" fill="#4FC3F7"/><rect x="26" y="58" width="3.5" height="28" rx="2" fill="#37474F"/><rect x="30.5" y="58" width="3.5" height="28" rx="2" fill="#37474F"/><rect x="20" y="27" width="3" height="26" rx="1.5" fill="#FFD7A8"/><rect x="37" y="27" width="3" height="26" rx="1.5" fill="#FFD7A8"/></svg>',
  tall:'<svg viewBox="0 0 90 90" width="1.2em" height="1.2em"><g opacity=".45"><circle cx="20" cy="52" r="7" fill="#ccc"/><rect x="13" y="60" width="14" height="28" rx="5" fill="#999"/></g><circle cx="58" cy="12" r="9" fill="#FFD7A8"/><rect x="49" y="22" width="18" height="66" rx="6" fill="#FFC21A"/><path d="M80 80V12m-6 8 6-8 6 8" stroke="#2EE59D" stroke-width="4" fill="none"/></svg>',
  short:'<svg viewBox="0 0 90 90" width="1.2em" height="1.2em"><g opacity=".45"><circle cx="58" cy="12" r="9" fill="#ccc"/><rect x="49" y="22" width="18" height="66" rx="6" fill="#999"/></g><circle cx="20" cy="52" r="7" fill="#FFD7A8"/><rect x="13" y="60" width="14" height="28" rx="5" fill="#FFC21A"/><path d="M36 50v34m-6-8 6 8 6-8" stroke="#2EE59D" stroke-width="4" fill="none"/></svg>'};
const ICON=ic=>ic&&ic.indexOf('svg:')===0?SVG[ic.slice(4)]:ic;
/* ══ 遊戲 共用 引擎 ══ */
let G=null;
const alive=g=>G&&G===g;
function book(w){if(!REAL[w])return false;const b=LS.g('book',[]);if(b.indexOf(w)>=0)return false;b.push(w);LS.s('book',b);return true}
function timer(sec,onEnd){const bar=H('div','tmr','<i></i><b></b>'),i=bar.firstChild,lb=bar.lastChild,T=sec*1000*(SLOW>1?1.5:1);let t0=Date.now(),stop=false,pz=0,pt=0;
  const tk=setInterval(()=>{if(stop||pz||PAUSED)return;const f=1-(Date.now()-t0-pt)/T;i.style.transform='scaleX('+Math.max(0,f)+')';lb.textContent=Math.max(0,Math.ceil(f*T/1000))+' 秒';bar.classList.toggle('low',f<.25);if(f<=0){clearInterval(tk);stop=true;onEnd()}},150);
  return {el:bar,left:()=>Math.max(0,1-(Date.now()-t0-pt)/T),sec:()=>(Date.now()-t0-pt)/1000,stop(){stop=true;clearInterval(tk)},pause(){if(!pz)pz=Date.now()},go(){if(pz){pt+=Date.now()-pz;pz=0}}}}
function hud(g){const gems=Array.from({length:NQ},(_,k)=>'<i class="'+(k<g.res.length?(g.res[k]?'ok':'no'):k===g.q?'now':'')+(k===NQ-1?' boss':'')+'">'+(k<g.res.length?(g.res[k]?'✔':'✖'):k===NQ-1?'👑':'')+'</i>').join('');
  const fv=g.combo>=2;document.body.classList.toggle('fever',fv);
  return '<div class="hud"><div class="gems">'+gems+'</div><span class="chip sc">⭐ <b>'+g.score+'</b></span><span class="chip fv'+(fv?' on':'')+'">'+(fv?'🔥 FEVER 這一題 ✖2':'🔥 再 對 '+(2-g.combo)+' 題 ➜ ✖2')+'</span>'+(g.q===NQ-1?'<span class="chip" style="color:#FFB25B">👑 最後 一題 ✖2</span>':'')+'</div>'}
function stage(g,html,sec,onEnd){const s=$('#game');s.innerHTML=hud(g)+'<div id="tm"></div>'+html;if(sec){const t=timer(sec,onEnd);g.t=t;$('#tm').appendChild(t.el)}else g.t=null}
function conf(n){const C=['#FFD54A','#2EE59D','#3BE8FF','#FF4FA3','#9B7BFF','#FF9F43'];for(let k=0;k<n;k++){const c=H('div','conf');c.style.left=(Math.random()*98)+'vw';c.style.background=R(C);c.style.animationDuration=(1.4+Math.random()*1.4)+'s';c.style.animationDelay=(Math.random()*.5)+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),3600)}}
async function countdown(){for(const n of ['3','2','1','GO!']){const c=H('div','cnt','<b>'+n+'</b>');document.body.appendChild(c);await wait(n==='GO!'?650:700);c.remove()}}
/* 答一題：記 成績、加分、答對頁／答錯頁 */
async function answer(g,okk,pick,w,o){o=o||{};if(g.lock===g.q)return;g.lock=g.q;if(g.t)g.t.stop();
  const sec=g.t?g.t.sec():0,left=g.t?g.t.left():0,idx=o.idx!=null?o.idx:ITEMS.indexOf(w);
  g.Q.push([okk?1:0,okk?0:(pick==null?-1:1),Math.round(sec*10)/10,pick!=null&&sec<1?1:0,okk?Math.round(left*1000)/1000:0,idx]);g.res.push(okk?1:0);
  if(okk){const fv=g.combo>=2,boss=g.q===NQ-1,sp=Math.round(50*left),pts=(100+sp)*(fv?2:1)*(boss?2:1);g.score+=pts;g.combo++;g.ok++;
    const gn=H('div','gain','<div class="n">＋'+pts+'</div><div class="f"><span>✅ 答對 100</span><span>⚡ 快 ＋'+sp+'</span>'+(fv?'<span>🔥 FEVER ✖2</span>':'')+(boss?'<span>👑 最後 一題 ✖2</span>':'')+'</div>');document.body.appendChild(gn);setTimeout(()=>gn.remove(),1500);conf(fv||boss?40:16);
    if(REAL[w])book(w);await (o.okPage||okPage)(g,w,o)}
  else{g.combo=0;g.wrong.push(o.bw||w);await (o.noPage||noPage)(g,w,pick,o)}
  if(!alive(g))return;g.q++;if(g.q>=NQ){end(g);return}GM[g.k].q(g)}
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
function end(g){document.body.classList.remove('fever');const st=g.ok>=5?3:g.ok>=4?2:g.ok>=3?1:0,rk=g.ok>=5?'S':g.ok>=4?'A':g.ok>=3?'B':'C',best=LS.g('best_'+g.k,0),nb=g.score>best;if(nb)LS.s('best_'+g.k,g.score);
  rec(g);const W=[...new Set(g.wrong)];
  const s=$('#game');s.innerHTML='<div class="end"><div style="font-size:30px;font-weight:900">'+GM[g.k].ic+' '+GM[g.k].nm+'</div><div class="rk">'+rk+'</div><div class="stars">'+[0,1,2].map(k=>'<i>'+(k<st?'⭐':'☆')+'</i>').join('')+'</div>'+
   '<div class="sc">✅ '+g.ok+' ／ '+NQ+'　⭐ <b>'+g.score+'</b></div>'+(nb?'<div class="nb">🏆 新 紀錄！</div>':'<div class="nb" style="color:#C9D4FF">最佳 紀錄 ⭐ '+best+'</div>')+
   (W.length?'<h2>📒 錯題 再 聽 一次</h2><div class="rv">'+W.map(w=>'<div class="r" data-rv="'+w+'">'+(parts(w)?wordHTML(w)+allTiles(w):'<span class="wd" style="font-size:40px">'+w+'</span>')+'<span class="zh">'+(REAL[w]?REAL[w].em+' '+REAL[w].zh:BKW[w]?ICON(BKW[w].ic)+' '+BKW[w].zh:'🔮 魔法 咒語')+'</span><button data-rw="'+w+'">🔊</button></div>').join('')+'</div>':'<h2>💯 全部 答對！太 厲害 了！</h2>')+
   '<div class="row"><button class="big" data-go="'+g.k+'">🔁 再 玩 一次</button><button class="big cy" id="back">🎮 換 遊戲</button></div></div>';
  s.onclick=e=>{const rw=e.target.closest('[data-rw]');if(rw)say(auOf(rw.dataset.rw));if(e.target.closest('#back'))lobby()};if(st>=2)conf(60);
  (async()=>{for(const w of W){if(!alive(g))return;const r=s.querySelector('[data-rv="'+w+'"]');if(r)r.classList.add('on');await say(auOf(w));await wait(500);if(r)r.classList.remove('on')}})()}
const auOf=w=>BKW[w]?'bk_'+w.replace(/ /g,'_'):codeOf(w);
/* 成績（老師看板）：g年級gm_ph-遊戲；一題 [答對, 0 對／1 錯／-1 時間到, 秒, 1 秒 內, 剩下 比例, 第幾題]；「題目」格式 ＝ 做完 5 題 就 算 練習 次數 */
function rec(g){try{if(typeof scLive!=='function'||!scLive()||!g.Q.length||g.sent)return;g.sent=1;const fast=g.Q.reduce((t,x)=>t+x[3],0);
  scQAdd({id:SCID,set:'g'+scGr()+'gm_ph-'+g.k,name:'🔤 自然發音｜'+GM[g.k].ic+' '+GM[g.k].nm,m:'q',qs:g.Q,raw:g.score,fix:0,mp:0,mw:0,sec:Math.round((Date.now()-g.t0)/1000),src:'school',dev:typeof SCDEV!=='undefined'?SCDEV:'',u:SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now()});
  if(window.__PHREC)window.__PHREC.push(g.k)}catch(e){}}
/* 開始 一個 遊戲：先 登入（老師看板 要 記 名字）➜ 開場 ➜ 3 2 1 GO */
function start(k){if(typeof SCON!=='undefined'&&SCON&&!SCID&&typeof scLogin==='function'){scLogin(function(){SCH.close();if(typeof scBar==='function')scBar();start(k)});return}
  G={k:k,q:0,ok:0,score:0,combo:0,res:[],wrong:[],Q:[],t0:Date.now(),lock:-1};const g=G,M=GM[k];$('#lobby').hidden=true;const s=$('#game');s.hidden=false;s.onclick=null;$('#quit').hidden=false;$('#ttl').textContent=M.ic+' '+M.nm;
  s.innerHTML='<div class="intro pnl pop"><div class="ie">'+M.ic+'</div><h2>'+M.nm+'</h2><div class="how">'+M.how+'</div><div class="rules"><span>📝 一局 5 題</span><span>⏱ 每題 '+M.T+' 秒</span><span>⚡ 愈 快 分數 愈 高</span><span>🔥 連對 2 題 ➜ ✖2</span><span>👑 最後 一題 ✖2</span></div><button class="big" id="go">▶ 開始！</button></div>';
  $('#go').onclick=async()=>{await countdown();if(alive(g))M.q(g)};if(window.__PHAUTO)$('#go').click()}
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
      $('#z'+k).innerHTML=tileHTML(T[k]);await say(sOf(p,k));await wait(150);r.classList.remove('hl')}
    if(!alive(g))return;const m=$('#msg');m.innerHTML='🗣 先 自己 唸 唸 看！<span class="cd" id="cd">3</span>';[0,1,2].forEach(k=>$('#r'+k).classList.add('hl'));
    for(let c=3;c>0;c--){if(!alive(g))return;$('#cd').textContent=c;await wait(1000)}[0,1,2].forEach(k=>$('#r'+k).classList.remove('hl'));
    slotPick(g,w)};
  $('#spin').onclick=run;$('#lev').onclick=run;if(window.__PHAUTO)run()}
async function slotPick(g,w){const m=$('#msg');$('#spin').hidden=true;m.innerHTML='🎧 聽 3 個 聲音，選出 <span class="k">拉霸機 上 的 字</span>';
  const o=SH([w].concat(near(w,2)));const box=$('#chz');
  box.innerHTML=o.map((x,k)=>'<div class="ch" data-k="'+k+'"><button class="sp" data-sp="'+k+'">🔊 '+(k+1)+'</button><button class="pk" data-pk="'+k+'" disabled>✔ 選 '+(k+1)+'</button></div>').join('');
  for(let k=0;k<o.length;k++){if(!alive(g))return;const c=box.querySelector('[data-k="'+k+'"]');c.classList.add('playing');await say(codeOf(o[k]));c.classList.remove('playing');await wait(300)}
  if(!alive(g))return;box.querySelectorAll('.pk').forEach(b=>b.disabled=false);const t=timer(GM.slot.T,()=>fin(null));g.t=t;$('#tm').appendChild(t.el);
  box.onclick=e=>{const sp=e.target.closest('[data-sp]');if(sp){say(codeOf(o[+sp.dataset.sp]));return}const pk=e.target.closest('[data-pk]');if(pk)fin(+pk.dataset.pk)};
  function fin(k){const right=k!=null&&o[k]===w;answer(g,right,k==null?null:'聲音 '+(k+1),w,{okPage:slotReveal,noPage:(g,w,pk,oo)=>noPage(g,w,pk,{tip:'仔細 聽：'+diffTip(w,k!=null?o[k]:null).replace(/<br>/g,'<br>')+(k!=null?'<br>你 選 的 聲音 是 <b>'+o[k]+'</b>':''),yours:k!=null?o[k]:null})})}
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
  function pick(k){if(k!=null)$('#ops').children[k].classList.add(o[k].ok?'good':'wrong');answer(g,k!=null&&!!o[k].ok,k==null?null:'第 '+(k+1)+' 排',w,{tip:'看 中間 的 母音：<b>'+p.v+'</b> 唸 '+(PH.VOW[p.v].zh+(PH.VOW[p.v].sup||''))+'（'+CUE[p.v]+'）'})}
  if(window.__PHAUTO)pick(o.findIndex(x=>window.__PHWRONG?!x.ok:x.ok))}
/* ══ 🎈 字首音 氣球 ══ */
function balQ(g){const w=R(realOf()),p=parts(w);g.w=w;const L=SH([p.i].concat(SH((CF[p.i]||'').split('').concat(SH(['b','m','s','h','r','l','f','t'])).filter((x,i,a)=>x!==p.i&&a.indexOf(x)===i)).slice(0,3)));
  stage(g,'<div class="ask">🔊 聽 ➜ 戳破 <span class="k">第一個 字母</span> 的 氣球 <button class="say" id="rp">🔊 再 聽</button></div><div class="bsky" id="bs">'+L.map((x,k)=>'<button class="bal" data-l="'+x+'" style="left:'+(8+k*23)+'%;--c:'+['#FF4FA3','#3BE8FF','#FFD54A','#9B7BFF'][k]+';animation-delay:'+(-k*.7)+'s"><b>'+x+'</b><i></i></button>').join('')+'</div><div class="word0 sm">'+'<span class="wd"><span id="bi">_</span>'+p.v+p.e+'</span></div>',GM.bal.T,()=>pk(null));
  const play=()=>say(codeOf(w));play();$('#rp').onclick=play;$('#bs').onclick=e=>{const b=e.target.closest('.bal');if(b)pk(b)};
  function pk(b){if(b){b.classList.add(b.dataset.l===p.i?'popd':'shake');if(b.dataset.l===p.i)$('#bi').textContent=p.i}answer(g,!!b&&b.dataset.l===p.i,b?b.dataset.l:null,w,{yours:b?b.dataset.l+p.v+p.e:null,tip:b?'第一個 音：'+(CUE[p.i]||p.i):''})}
  if(window.__PHAUTO)pk([...$$('.bal')].find(x=>window.__PHWRONG?x.dataset.l!==p.i:x.dataset.l===p.i))}
/* ══ ⚔ 母音 對決 ══ */
function vowQ(g){const w=R(realOf()),p=parts(w);g.w=w;const V=VS();
  stage(g,'<div class="ask">🔊 聽 ➜ 中間 是 <span class="k">哪 一個 母音</span>？ <button class="say" id="rp">🔊 再 聽</button></div><div class="word0 sm"><span class="wd">'+p.i+'<span class="gap" id="vg">?</span>'+p.e+'</span></div><div class="vcards" id="vc">'+
   V.map(v=>'<div class="vcd" data-v="'+v+'"><button class="vk" data-v="'+v+'"><span class="ve">'+VKEY[v][0]+'</span><b>'+v+'</b><small>'+VKEY[v][1]+'</small></button><button class="vs" data-s="'+v+'">🔊 '+v+'</button></div>').join('')+'</div>',GM.vow.T,()=>pk(null));
  const play=()=>say(codeOf(w));play();$('#rp').onclick=play;
  $('#vc').onclick=e=>{const s=e.target.closest('[data-s]');if(s){say('s_'+PH.vowCode(VOWS[s.dataset.s]));return}const k=e.target.closest('.vk');if(k)pk(k.dataset.v)};
  function pk(v){if(v){$('#vg').textContent=v;$('#vg').classList.add(v===p.v?'okv':'nov')}answer(g,v===p.v,v,w,{yours:v?p.i+v+p.e:null,tip:v&&v!==p.v?'你 選 <b>'+v+'</b>（'+CUE[v]+'）<br>聽到 的 是 <b>'+p.v+'</b>（'+CUE[p.v]+'）':'中間：<b>'+p.v+'</b>（'+CUE[p.v]+'）',
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
function bkQ(g){const w=R(BWL),C=chunksOf(w).map(c=>c[0].toLowerCase());g.w=w;const others=SH([].concat(...BWL.filter(x=>x!==w).map(x=>chunksOf(x).map(c=>c[0].toLowerCase()))).filter(x=>C.indexOf(x)<0&&x.length>1));
  const T=SH(C.concat(others.slice(0,2))).map((x,k)=>({x,k}));const fill=C.map(()=>null);
  stage(g,'<div class="ask">📗 🔊 聽 課本 的 字 ➜ 把 <span class="k">一塊 一塊</span> 拼 起來 <button class="say" id="rp">🔊 再 聽</button></div><div class="bslots">'+C.map((c,k)=>'<button class="bsl" data-c="'+k+'"></button>').join('')+'</div><div class="tiles" id="ti">'+T.map(t=>'<button class="tk ck" data-k="'+t.k+'">'+t.x+'</button>').join('')+'</div>',GM.bk.T,()=>chk(true));
  const play=()=>say('bk_'+w.replace(/ /g,'_'));play();$('#rp').onclick=play;
  const draw=()=>{$$('.bsl').forEach((c,k)=>{c.textContent=fill[k]?fill[k].x:'';c.classList.toggle('full',!!fill[k])});$$('.tk').forEach(b=>b.classList.toggle('used',fill.some(f=>f&&f.k===+b.dataset.k)))};
  $('#game').onclick=e=>{const t=e.target.closest('.tk');if(t&&!t.classList.contains('used')){const i=fill.indexOf(null);if(i<0)return;fill[i]=T.find(x=>x.k===+t.dataset.k);say('bc_'+fill[i].x);draw();if(fill.indexOf(null)<0)setTimeout(()=>chk(false),350);return}
    const c=e.target.closest('.bsl');if(c&&fill[+c.dataset.c]){fill[+c.dataset.c]=null;draw()}};
  function chk(tout){if(g.lock===g.q)return;const s=fill.map(f=>f?f.x:'_');answer(g,!tout&&s.join('|')===C.join('|'),tout?null:s.join(' ＋ '),w,{idx:BWL.indexOf(w),yours:tout?null:s.join(' ＋ '),au:'bk_'+w.replace(/ /g,'_'),okHTML:bkHTML(w),noHTML:bkHTML(w),tip:'💡 '+BOOK.W[w].tip,okRun:f=>bkRead(f,w),noRun:f=>bkRead(f,w,2)})}
  if(window.__PHAUTO){(window.__PHWRONG?(C.length>1?C.slice().reverse():[T.find(t=>C.indexOf(t.x)<0).x]):C).forEach(x=>{const t=[...$$('.tk')].find(b=>b.textContent===x&&!b.classList.contains('used'));if(t)t.click()})}}
function bkQ2(g){const w=R(BWL),o=SH([w].concat(SH(BWL.filter(x=>x!==w&&BKW[x].ic!==BKW[w].ic)).slice(0,3)));g.w=w;
  stage(g,'<div class="ask">📗 👀 自己 唸 課本 的 字 ➜ 點 <span class="k">對 的 圖</span></div><div class="word0">'+'<span class="wd">'+w+'</span></div><div class="pics" id="pc">'+o.map(x=>'<button class="pic" data-w="'+x+'"><span>'+ICON(BKW[x].ic)+'</span><small>'+BKW[x].zh+'</small></button>').join('')+'</div>',GM.bkp.T,()=>pk(null));
  $('#pc').onclick=e=>{const b=e.target.closest('.pic');if(b)pk(b)};
  function pk(b){if(b)b.classList.add(b.dataset.w===w?'good':'wrong');answer(g,!!b&&b.dataset.w===w,b?b.dataset.w:null,w,{idx:BWL.indexOf(w),yours:b?b.dataset.w:null,au:'bk_'+w.replace(/ /g,'_'),okHTML:bkHTML(w),noHTML:bkHTML(w),tip:'💡 '+BOOK.W[w].tip,okRun:f=>bkRead(f,w),noRun:f=>bkRead(f,w,2)})}
  if(window.__PHAUTO)pk([...$$('.pic')].find(x=>window.__PHWRONG?x.dataset.w!==w:x.dataset.w===w))}
/* 課本 字：一塊 一塊（字母＋真的 音標）＋ 圖 */
function chunkHTML(c,fin,big){const s=c[0],T=PH2.realTiles(c[1],MD,fin)||[];return '<div class="chk '+c[2]+'"><div class="cs" style="font-size:'+(big||64)+'px">'+s.split('').map(ch=>ch===ch.toUpperCase()?'<i>'+ch.toLowerCase()+'</i>':ch).join('')+'</div>'+tileHTML(T)+
  '<div class="ctg">'+(c[2]==='cvc'||c[2]==='cv'?'✔ 你 會 了':c[2]==='sight'?'⭐ 常見 字':'💡 '+(c[3]||'新 規則'))+'</div></div>'}
function bkHTML(w,big){const x=BOOK.W[w],L=x.parts?x.parts.map(p=>BOOK.W[p].c):[x.c];
  return '<div class="bkw">'+L.map(cs=>'<div class="bkg">'+cs.map((c,k)=>chunkHTML(c,k===cs.length-1,big)).join('<span class="plus">＋</span>')+'</div>').join('<span class="sp2"></span>')+'</div><div class="em">'+ICON(x.ic)+'</div><div class="zh">'+x.zh+'</div>'}
async function bkRead(f,w,n){const ch=[...f.querySelectorAll('.chk')],C=chunksOf(w);for(let k=0;k<ch.length;k++){ch[k].classList.add('hl');await say('bc_'+C[k][0].toLowerCase());await wait(250);ch[k].classList.remove('hl')}
  const b=f.querySelector('.bkw');if(b)b.classList.add('join','hl');for(let r=0;r<(n||1);r++){await say('bk_'+w.replace(/ /g,'_'));await wait(400)}if(b)b.classList.remove('hl')}
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
  bk:{ic:'📗',nm:'課本 單字 拼塊',T:30,q:bkQ,c:['#0E5A3A','#062A1C'],how:'🔊 聽 課本 的 字 ➜ 把 一塊 一塊 照 順序 拼 起來（bed ＋ room ＝ bedroom）。',tag:'課本'},
  bkp:{ic:'📘',nm:'課本 單字 找圖',T:15,q:bkQ2,c:['#0E3A6A','#061A30'],how:'👀 自己 唸 課本 的 字 ➜ 點 對 的 圖。',tag:'課本'},
  ls:{ic:'🐣',nm:'小學堂 小 測驗',T:15,q:lsQ,c:['#5A5A00','#202000'],how:'🔊 聽 ➜ 選 對 的 字。',tag:'新手'}
};
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
  const vs=async()=>{s.innerHTML='<div class="lsn pnl pop"><div class="lh">🐣 第 '+(i+1)+' 課：短 母音 <b>'+L.v+'</b></div><div class="vsp"><span class="vbig">'+L.v+'</span><span class="vem">'+VKEY[L.v][0]+'</span></div><div class="lcue">'+CUE[L.v]+'</div><div class="lnote">'+VKEY[L.v][1]+' 的 開頭 就是 '+L.v+' 的 聲音</div>'+ctlHTML()+'<div class="row"><button class="big" id="lgo">▶ 開始 學 5 個 字</button></div></div>';
    bindCtl(vs);const vb=s.querySelector('.vbig');for(let r=0;r<2;r++){if(G!==me)return;vb.classList.add('hl');await say('s_'+PH.vowCode(VOWS[L.v]));await wait(500);vb.classList.remove('hl');await wait(300)}
    $('#lgo').onclick=()=>{k=0;word()};if(window.__PHAUTO)$('#lgo').click()};
  const word=async()=>{const w=L.w[k],p=parts(w),my=++tok.n||(tok.n=1);const T=unitTiles(w);
    s.innerHTML='<div class="lsn pnl"><div class="lh">🐣 短 母音 '+L.v+'　第 '+(k+1)+' ／ 5 個 字</div><div class="lstep" id="st">① 看 字母，聽 字母 的 音</div><div class="lt lw" id="lw" data-w="'+w+'">'+
     [p.i,p.v,p.e].map((x,j)=>'<div class="u" data-u="'+j+'" style="opacity:0"><span class="L" style="font-size:120px'+(j===1?';color:#000;background:var(--vowel);border-radius:.14em;padding:0 .06em':'')+'">'+x+'</span>'+tileHTML(T[j])+'</div>').join('')+
     '</div><div class="lmean" id="lm"></div><div class="lyou" id="ly" hidden>✋ 換 你：點 每 一個 字母 聽 一次，再 按〔🔗 合 起來〕<div class="row"><button class="big cy" id="lj">🔗 合 起來</button><button class="big" id="ln" hidden>'+(k<4?'▶ 下 一個 字':'⭐ 小 測驗 5 題')+'</button></div></div>'+ctlHTML()+'</div>';
    bindCtl(word);const lw=$('#lw'),us=[...lw.querySelectorAll('.u')],st=$('#st'),dead=()=>G!==me||tok.n!==my;
    for(let j=0;j<3;j++){if(dead())return;us[j].style.opacity=1;us[j].classList.add('pop','hl');await say(sOf(p,j));await wait(450);us[j].classList.remove('hl');await wait(250)}
    if(dead())return;st.textContent='② 慢慢 合 起來';lw.classList.add('j1');us[0].classList.add('hl');us[1].classList.add('hl');await say(PH2.partCode(codeOf(w),'iv'));await wait(450);
    if(dead())return;lw.classList.add('j2');us[2].classList.add('hl');await say(codeOf(w));await wait(500);us.forEach(u=>u.classList.remove('hl'));
    if(dead())return;st.textContent='③ 它 是 什麼 意思？';$('#lm').innerHTML='<span class="eq">＝</span><span class="em pop">'+REAL[w].em+'</span><span class="zh pop">'+REAL[w].zh+'</span>';await say(codeOf(w));await wait(600);
    if(dead())return;st.textContent='④ 換 你 了！';lw.classList.remove('j1','j2');bindLet(lw);$('#ly').hidden=false;book(w);
    const lnb=$('#ln');$('#lj').onclick=async()=>{await blend(lw,w);lnb.hidden=false};$('#ln').onclick=()=>{if(k<4){k++;word()}else{LS.s('ls_'+L.v,1);start('ls')}};
    if(window.__PHAUTO){$('#lj').click();setTimeout(()=>$('#ln').click(),60)}};
  vs()}
/* ══ 📗 從 CVC 到 課本（秒懂 動畫）══ */
function bridgeOpen(w0){const L=BWL;let k=Math.max(0,L.indexOf(w0));G={k:'bridge'};const me=G;$('#lobby').hidden=true;const s=$('#game');s.hidden=false;s.onclick=null;$('#quit').hidden=false;$('#ttl').textContent='📗 從 CVC 到 課本';PAUSED=false;let tok=0;
  const show=async()=>{const w=L[k],x=BOOK.W[w],my=++tok,dead=()=>G!==me||tok!==my;const CS=x.parts?x.parts.map(p=>BOOK.W[p].c):[x.c];
    s.innerHTML='<div class="brg pnl"><div class="lh">📗 '+(k+1)+' ／ '+L.length+'　'+(BOOK.topics.find(t=>t.ls.some(l=>l.w.indexOf(w)>=0))||{}).t+'</div><div class="bstep" id="bst">① 拆 成 一塊 一塊</div><div class="bkw spread" id="bw">'+
     CS.map(cs=>'<div class="bkg">'+cs.map((c,j)=>chunkHTML(c,j===cs.length-1,78)).join('<span class="plus">＋</span>')+'</div>').join('<span class="sp2"></span>')+'</div><div class="bres" id="br"></div>'+ctlHTML()+
     '<div class="row"><button class="say" id="bp">◀ 上 一個</button><button class="say" id="bn">下 一個 ▶</button><button class="say" id="bl">📋 單字 清單</button></div></div>';
    bindCtl(show);$('#bp').onclick=()=>{k=(k+L.length-1)%L.length;show()};$('#bn').onclick=()=>{k=(k+1)%L.length;show()};$('#bl').onclick=()=>lobby('book');
    const ch=[...s.querySelectorAll('.chk')],C=chunksOf(w);ch.forEach(c=>c.style.opacity=0);
    for(let j=0;j<ch.length;j++){if(dead())return;ch[j].style.opacity=1;ch[j].classList.add('pop','hl');await say('bc_'+C[j][0].toLowerCase());await wait(700);ch[j].classList.remove('hl');await wait(200)}
    if(dead())return;$('#bst').textContent='② 合 起來';const bw=$('#bw');bw.classList.remove('spread');bw.classList.add('join','hl');await say('bk_'+w.replace(/ /g,'_'));await wait(500);bw.classList.remove('hl');
    if(dead())return;$('#bst').textContent='③ 意思';$('#br').innerHTML='<span class="eq">＝</span><span class="em pop">'+ICON(x.ic)+'</span><span class="zh pop">'+x.zh+'</span><div class="btip pop">💡 '+x.tip+'</div>';await say('bk_'+w.replace(/ /g,'_'));
    if(window.__PHAUTO&&window.__PHBR)window.__PHBR.push(w)};
  show()}
/* ══ 大廳 ══ */
function lobby(sec){G=null;AUtok++;PAUSED=false;document.body.classList.remove('fever');$('#lobby').hidden=false;$('#game').hidden=true;$('#game').innerHTML='';$('#quit').hidden=true;$('#ttl').textContent='🎮 自然發音 遊戲場';
  const gc=k=>{const M=GM[k],b=LS.g('best_'+k,0);return '<button class="gc" data-go="'+k+'" style="--c1:'+M.c[0]+';--c2:'+M.c[1]+'"><span class="ic">'+M.ic+'</span><b>'+M.nm+'</b><small>'+M.how.split('。')[0]+'</small><span class="tg">'+M.tag+'</span>'+(b?'<span class="best">🏆 '+b+'</span>':'')+'</button>'};
  const bk=LS.g('book',[]),all=WORDS.map(x=>x[0]);
  $('#lobby').innerHTML='<div class="hero"><div><h1>🎮 自然發音 遊戲場</h1><p>每 一局 5 題・限時・連對 FEVER ✖2・最後 一題 ✖2</p></div><div class="lv"><button data-lv="1"'+(LV===1?' class="on"':'')+'>🟢 簡單：a i o</button><button data-lv="2"'+(LV===2?' class="on"':'')+'>🔥 全部：a e i o u</button></div></div>'+
   '<div class="sec"><h2>🐣 新手 小學堂</h2><span>一步 一步：看 字母 ➜ 聽 音 ➜ 慢慢 合 起來 ➜ 換 你</span></div><div class="path">'+LESS.map((L,i)=>'<button class="pstop'+(LS.g('ls_'+L.v,0)?' done':'')+'" data-ls="'+i+'"><span class="pv">'+L.v+'</span><span class="pe">'+VKEY[L.v][0]+'</span><small>第 '+(i+1)+' 課 '+(LS.g('ls_'+L.v,0)?'✔':'')+'</small></button>').join('<span class="pline"></span>')+'</div>'+
   '<div class="sec"><h2>🎮 CVC 遊戲</h2><span>10 種 玩法：聽、讀、拼</span></div><div class="gg">'+['slot','ufo','vault','zhu','bal','vow','end','lad','pic','train'].map(gc).join('')+'</div>'+
   '<div class="sec" id="bookSec"><h2>📗 從 CVC 到 課本 單字</h2><span>大 字 ＝ 一塊 一塊 你 已經 會 的 小 字</span></div><div class="pnl bkl">'+BOOK.topics.map(t=>'<div class="bkt"><b>Topic 2　'+t.t+'　'+t.zt+'</b>'+t.ls.map(l=>'<div class="bkr"><span>'+l.l+'</span>'+l.w.map(w=>'<button class="bkb" data-br="'+w+'">'+ICON(BKW[w].ic)+' '+w+'</button>').join('')+'</div>').join('')+'</div>').join('')+
   '<div class="row"><button class="big" data-br="'+BWL[0]+'">▶ 從 第 一個 字 開始 看</button></div><div class="gg">'+['bk','bkp'].map(gc).join('')+'</div></div>'+
   '<div class="sec"><h2>📖 我 的 單字 圖鑑</h2><span>'+bk.length+' ／ '+all.length+'</span></div><div class="pnl book"><div class="bar"><i style="width:'+Math.round(bk.length/all.length*100)+'%"></i></div><div class="bw">'+
   all.map(w=>bk.indexOf(w)>=0?'<div class="bc"><div class="e">'+REAL[w].em+'</div><div class="w">'+w+'</div><div class="z">'+REAL[w].zh+'</div></div>':'<div class="bc no"><div class="e">'+REAL[w].em+'</div><div class="w">？？？</div><div class="z">還沒 收集</div></div>').join('')+'</div></div>';
  if(sec==='book'){const b=$('#bookSec');if(b)b.scrollIntoView()}}
document.addEventListener('click',e=>{const l=e.target.closest('[data-lv]');if(l){LV=+l.dataset.lv;LS.s('lv',LV);lobby();return}
  const g=e.target.closest('[data-go]');if(g){start(g.dataset.go);return}const ls=e.target.closest('[data-ls]');if(ls){lessonOpen(+ls.dataset.ls);return}const br=e.target.closest('[data-br]');if(br){bridgeOpen(br.dataset.br);return}
  const md=e.target.closest('[data-md]');if(md){MD=md.dataset.md;LS.s('md',MD);$$('[data-md]').forEach(b=>b.classList.toggle('on',b===md));if(G&&G.k==='bridge')$('#cR').click();return}
  if(e.target.closest('#quit')){if(G&&G.t)G.t.stop();lobby()}});
$$('[data-md]').forEach(b=>b.classList.toggle('on',b.dataset.md===MD));
lobby();
window.PHG={get G(){return G},GM:GM,start:start,lobby:lobby,lessonOpen:lessonOpen,bridgeOpen:bridgeOpen,ITEMS:ITEMS,BWL:BWL,codeOf:codeOf,near:near,realOf:realOf,pseOf:pseOf};
})();
