/* ══ ⑤ 🎮 10 種 遊戲＋📝 25 題 闖關（放 進 _map.js 的 GAMES 位置）
 * 老師 第五十五次 第 5 點：每 一種 遊戲 有 明確 的 學習 目標；玩法 參考 老師 的 Blooket 影片（Cafe、Monster Brawl、Zorb Blitz、Pirate Pool、Crazy Kingdom、Plushie Panic、Factory、Tower Defense），
 * 名字、畫面 全部 自己 設計；「英文 就是 玩法」：答案 本身 ＝ 攻擊／煉藥／建造（不 是 答完 才 拿 金幣）。
 * 共用：開場（目標＋玩法 一句）➜ 3 2 1 GO ➜ 一局 5 題、每題 限時 ➜ ⚡ 愈 快 愈 高、🔥 連對 2 題 ✖2、👑 最後 一題 ✖2 ➜
 * 答對 ＝ 字 的 方框＋音標＋唸；答錯／時間 到 ＝ 綠底 答錯頁（你 的 答案 劃掉、正確 的 方框＋音標＋黃點、一個 關鍵 提示、一個 一個 唸 ➜ 整個 字 唸 兩次、唸完 才〔▶ 繼續〕）➜
 * 結果 S／A／B／C＋📒 錯題 一定 要 聽完 才 能 再 玩；成績 g年級gm_ph-<代號>（第幾題 ＝ QW 的 位置，音節 遊戲 ＝ QW.length＋SYLW 的 位置）*/
const SYLW=[['bathroom',['bath','room'],['sy_bathroom_0','sy_bathroom_1'],'浴室'],['bedroom',['bed','room'],['sy_bedroom_0','sy_bedroom_1'],'臥室'],['rabbit',['ra','bbit'],['sy_rabbit_0','sy_rabbit_1'],'兔子'],
  ['happy',['ha','ppy'],['sy_happy_0','sy_happy_1'],'快樂的'],['kitchen',['ki','tchen'],['sy_kitchen_0','sy_kitchen_1'],'廚房'],['angry',['an','gry'],['sy_angry_0','sy_angry_1'],'生氣的'],
  ['turtle',['tur','tle'],['sy_turtle_0','sy_turtle_1'],'烏龜'],['dining',['di','ning'],['sy_dining_0','sy_dining_1'],'用餐'],['living',['li','ving'],['sy_living_0','sy_living_1'],'生活'],['baby',['ba','by'],['w_c55_ba','w_c55_by'],'嬰兒']];
const NQ=window.__PHN||5;
const GM={
  mvow:{ic:'🧪',nm:'母音 煉金坊',goal:'母音 聽辨＋認讀',how:'客人 說 一個 字 🔊 ➜ 選 對 的 <b>母音 藥水</b> 倒進 紅框，才 煉 得 出 那個 字',T:15,q:qVow},
  mon:{ic:'⚔️',nm:'聲音 結界',goal:'字首音（1、2、3 個 子音）',how:'聽 🔊 ➜ 打倒 身上 寫著 <b>字首</b> 的 那 一隻 魔物（bl、st、str…）',T:12,q:qOn},
  mco:{ic:'🧲',nm:'磁浮 打磚塊',goal:'字尾音（1、2 個 子音、兩個 字母 一個 聲音）',how:'聽 🔊 ➜ 點 寫著 <b>字尾</b> 的 磚塊，磁浮 球 飛 過去 打碎 它（st、mp、ng…）',T:15,q:qCo},
  mpat:{ic:'🧱',nm:'子母 方塊 塔',goal:'子音 母音 怎麼 排（子母子、子子母子…）',how:'聽 🔊 或 看 字 ➜ 選 對 的 <b>方框 樣子</b>（藍 ＝ 子音、紅 ＝ 母音、黃點 ＝ 聲音），塔 才 蓋 得 上去',T:15,q:qPat},
  mcnt:{ic:'🥁',nm:'聲音 戰鼓',goal:'這個 字 有 幾個 聲音、是 哪些 聲音',how:'聽 🔊 ➜ ① 一個 聲音 敲 一下 鼓 ➜ ② 選 對 的 一排 音標',T:25,q:qCnt},
  mspl:{ic:'📜',nm:'咒語 卷軸',goal:'聽音 拼字',how:'聽 🔊 ➜ 照 聲音 的 順序 把 字母 塊 放進 卷軸（th、sh、ng ＝ 一塊）',T:30,q:qSpl},
  mcoin:{ic:'🎱',nm:'星環 彈珠台',goal:'聽音 認字（拼字 很 像 也 不 會 錯）',how:'聽 🔊 ➜ 點 寫著 那個 字 的 金幣 洞 ➜ 彈簧 一拉，彈珠 繞 軌道 射 進去、撞 彈簧 柱 加 分',T:15,q:qCoin},
  mking:{ic:'👑',nm:'拼音 王國',goal:'看字 讀音（自己 拼 出來，判斷 唸 得 對 不 對）',how:'使者 拿著 一個 字、唸 給 你 聽 🔊 ➜ 他 唸 得 <b>對</b> 還是 <b>錯</b>？判斷 對 ＝ 王國 變 強',T:15,q:qKing},
  mbub:{ic:'🫧',nm:'泡泡 救援',goal:'兩個 字母 一個 聲音（sh ch th ng ck）',how:'聽 🔊 ➜ 照 聲音 順序 戳 泡泡；<b>sh、th 是 一顆</b>，不要 戳 分開 的 s、h',T:25,q:qBub},
  msyl:{ic:'🏭',nm:'音節 工廠',goal:'兩 個 音節 的 字（課本 字）',how:'聽 🔊 ➜ 照 順序 選 兩 個 <b>音節 卡</b> 送進 機器（bath＋room）',T:20,q:qSyl}};
const GK=Object.keys(GM);
/* 2026-11-17 第五十七次 老師 4-16：每 一種 遊戲 開始 前，先 用 秒懂 動畫 複習 這個 遊戲 要 測 的 重點（自動 演，可以〔我 會 了 ▶ 開始〕）＋學會 了 有 什麼 用 */
const GREV={mvow:['cvc','聽到 字 就 知道 中間 是 哪 一個 母音 ＝ 拼字 不 會 拼 錯 母音'],mon:['bl2','字首 有 2、3 個 子音 也 聽 得 出來 ＝ 長 的 字 也 拼 得 出來'],mco:['fin','字尾 聽 得 清楚 ＝ 拼字 不 漏 掉 最後 的 字母'],
  mpat:['seg','知道 字 是 幾 個 方框、幾 個 聲音 ＝ 看到 新 字 知道 怎麼 拆'],mcnt:['seg','數 得 出 聲音 ＝ 聽音 拼字 的 第一步'],mspl:['seg','聽 一個 字 寫 得 出來 ＝ 聽寫、作文 都 用 得 到'],
  mcoin:['chg','只 差 一個 字母 也 分 得 出來 ＝ 不 會 看錯 字'],mking:['cvc','看 到 字 自己 唸 得 出來 ＝ 自己 讀 課本、讀 故事'],mbub:['d_sh','sh ch th 不 拆 開 ＝ ship、chin、thin 唸 得 對'],msyl:['syl','長 的 字 一塊 一塊 唸 ＝ 課本 的 長 單字 不 怕']};
let G=null;
function QI(x){return QW.indexOf(x)}
/* 第五十六次（老師 的 簡報「適應性 難度」：答錯 的 字 會 變成 下一波 的 題目 ＝ 間隔 重複）：答錯 的 字 隔 1 題 以上 再 出 一次（同 一種 遊戲 用 得 到 才 出），上面 寫「🔁 剛才 錯 的 字 再 挑戰」*/
function pickW(f){G.re=0;if(G.rq&&G.rq.length){const k=G.rq.findIndex(r=>r.at<=G.q&&f(r.x));if(k>=0){const r=G.rq.splice(k,1)[0];G.re=1;return r.x}}return R(QW.filter(f))}
function reTag(){return G.re?'<div class="mtag w" style="margin-bottom:6px">🔁 剛才 錯 的 字 再 挑戰！</div>':''}
function specOf(x){const nm=x.long&&x.v!=='oo';return (x.on.length?x.on.join('')+'.':'')+x.v+(x.long?(nm?'!':'')+'='+x.vc:'')+(x.co.length?'.'+x.co.join(''):'')+(x.mg?'.e~':'')}
function pool(f){return QW.filter(f)}
function near(x,k,n){/* 只 換 一個 地方（k ＝ on／v／co）的 真的 字 */const key=y=>k==='on'?[y.v,y.co.join(''),y.mg].join('|'):k==='co'?[y.on.join(''),y.v,y.mg].join('|'):[y.on.join(''),y.co.join('')].join('|');
  const me=key(x),f=k==='on'?y=>y.on.join(''):k==='co'?y=>y.co.join(''):y=>y.v+(y.mg?'_e':'');return SH(QW.filter(y=>y!==x&&key(y)===me&&f(y)!==f(x)&&y.w!==x.w)).slice(0,n)}
function gHud(){const N=G.N||NQ,gm=G.cur;$('#gq').textContent='第 '+(G.q+1)+' ／ '+N+' 題';$('#gt').textContent=gm.ic+' '+gm.nm+'：'+gm.goal;$('#gsc').textContent='⭐ '+G.score+(G.combo>=2?'　🔥 ✖2':'')}
function timer(sec,onEnd){const bar=$('#gtm'),i=bar.firstChild,T=sec*1000*(SLOW>1?1.5:1);let t0=Date.now(),stop=false,used=0,lastP=Date.now();bar.classList.remove('lo');i.style.transform='scaleX(1)';
  const tk=setInterval(()=>{if(stop)return;const n=Date.now();if(PAUSED){t0+=n-lastP}lastP=n;used=n-t0;const f=Math.max(0,1-used/T);i.style.transform='scaleX('+f+')';bar.classList.toggle('lo',f<.25);if(f<=0){stop=true;clearInterval(tk);onEnd()}},80);
  return {stop(){stop=true;clearInterval(tk)},left(){return Math.max(0,1-used/T)},sec(){return used/1000}}}
const B=()=>$('#gbody');
function fx(t,x,y,c){const e=H('div','fx',t);e.style.left=x+'px';e.style.top=y+'px';e.style.color=c||'#FFE07A';document.body.appendChild(e);setTimeout(()=>e.remove(),1000)}
function sparks(x,y,n,c){for(let k=0;k<(n||14);k++){const e=H('div','spark');e.style.left=x+'px';e.style.top=y+'px';e.style.background=c||R(['#FFE07A','#3BE8FF','#FF4FA3','#2EE59D']);const a=Math.random()*6.28,d=60+Math.random()*120;e.style.setProperty('--dx',Math.cos(a)*d+'px');e.style.setProperty('--dy',Math.sin(a)*d+'px');document.body.appendChild(e);setTimeout(()=>e.remove(),850)}}
function ctr(el){const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}
function earBtn(au){const b=H('button','ear','🔊 再 聽 一次');b.onclick=()=>{b.classList.add('on');say(au).then(()=>b.classList.remove('on'))};return b}
async function play1(au){const b=$('#gbody .ear');if(b)b.classList.add('on');await say(au);if(b)b.classList.remove('on')}
/* ── 答 ── */
async function answer(ok,info){if(G.lock===G.q)return;G.lock=G.q;if(G.t)G.t.stop();const left=G.t?G.t.left():0,sec=G.t?G.t.sec():0,N=G.N||NQ;
  G.Q.push([ok?1:0,ok?0:(info.yours==null?-1:1),Math.round(sec*10)/10,info.yours!=null&&sec<1?1:0,ok?Math.round(left*1000)/1000:0,info.idx]);G.res.push(ok?1:0);
  if(ok){G.combo++;let p=100+Math.round(100*left);const m=(G.combo>=3?2:1)*(G.q===N-1?2:1);p*=m;G.score+=p;G.ok++;const c=ctr(B());fx('＋'+p+(m>1?'（✖'+m+'）':''),c[0]-60,c[1]-140);gHud();await okPage(info)}
  else{G.combo=0;G.wrong.push(info);if(info.x&&!G.re&&G.q<(G.N||NQ)-1){G.rq=G.rq||[];G.rq.push({x:info.x,at:G.q+2})}gHud();await noPage(info)}
  G.q++;if(G.q>=N){end();return}next()}
function wordBoxHTML(x,o){return '<div class="wrow">'+wordHTML(info2spec(x),Object.assign({dots:1},o||{}))+'</div>'}
function info2spec(x){return x.spec||specOf(x)}
async function readWord(spec,au,root){const S=parse(spec),cks=root.querySelectorAll('.ck');let k=0;for(const Bx of S)for(const b of Bx)for(const c of b.ch){const el=cks[k++];if(!c.t||b.type==='g'||!el)continue;el.classList.add('on');await say(auOf(c.t,b.coda));el.classList.remove('on')}await say(au)}
function okPage(info){return new Promise(async res=>{if(window.__PHFAST&&!window.__PHFB){res();return}const f=$('#fb');f.className='ok';f.hidden=false;
  f.innerHTML='<h2>✅ 答對了！</h2>'+wordBoxHTML(info.x||info)+(info.zh?'<div class="tip">'+info.zh+'</div>':'');sparks(innerWidth/2,innerHeight/2,24);await say(info.au);await wait(500);f.hidden=true;res()})}
function noPage(info){return new Promise(async res=>{const f=$('#fb');f.className='no';f.hidden=false;
  f.innerHTML='<h2>'+(info.yours==null?'⏰ 時間 到':'❌ 再 看 一次')+'</h2>'+(info.yours!=null?'<div class="yo">你 選 的：<s class="en">'+info.yours+'</s></div>':'')+'<div class="tip">✅ 正確：</div>'+wordBoxHTML(info.x||info)+
    '<div class="sum">'+patTxt(info2spec(info.x||info))+'：<b>'+countOf(info2spec(info.x||info)).n+' 個 聲音</b></div>'+(info.tip?'<div class="tip">💡 '+info.tip+'</div>':'')+'<button class="btn go" id="fbGo" disabled>🔊 聽 …</button>';
  const go=$('#fbGo');await readWord(info2spec(info.x||info),info.au,f);await wait(300);await say(info.au);go.disabled=false;go.textContent='▶ 繼續';if(window.__PHFAST){f.hidden=true;res();return}go.onclick=()=>{f.hidden=true;res()}})}
/* ── 開始／下一題／結束 ── */
function start(k,opt){opt=opt||{};if(typeof SCON!=='undefined'&&SCON&&!SCID&&typeof scLogin==='function'&&!window.__PHNOLOGIN){scLogin(function(){SCH.close();if(typeof scBar==='function')scBar();start(k,opt)});return}
  G={k,q:0,ok:0,score:0,combo:0,res:[],wrong:[],Q:[],t0:Date.now(),lock:-1,tw:0};if(k==='q25'){G.N=25;G.seq=q25Seq()}TOK++;
  $('#game').hidden=false;const M=k==='q25'?{ic:'📝',nm:'拼音 25 題 闖關',goal:'10 種 遊戲 混 在 一起',how:'這 一回 抽到：<br>'+[...new Set(G.seq)].map(g=>GM[g].ic+' '+GM[g].nm).join('、')+'<br>每 一次 組合 都 不一樣'}:GM[k];
  $('#gq').textContent='';$('#gt').textContent=M.ic+' '+M.nm;$('#gsc').textContent='⭐ 0';
  B().innerHTML='<div class="pnl" style="padding:20px 26px;text-align:center;max-width:900px"><div style="font-size:70px">'+M.ic+'</div><h2 class="st">'+M.nm+'</h2><div class="cap">🎯 學習 目標：<b>'+M.goal+'</b></div><div class="cap">'+M.how+'</div>'+
    (GREV[k]?'<div class="cap">💪 學會 了：'+GREV[k][1]+'</div><div class="grev"><div class="grevt">🎬 先 複習 一下（約 30 秒）</div><div class="pnl" id="grevS"></div></div>':'')+'<div class="cap" style="font-size:20px;color:#BFD0FF">📝 '+(G.N||NQ)+' 題　⚡ 愈 快 分數 愈 高　🔥 連對 2 題 ➜ 下一題 ✖2　👑 最後 一題 ✖2</div><button class="btn go" id="gGo" style="font-size:30px;min-height:70px;padding:10px 40px">▶ 開始！</button></div>';
  if(GREV[k]&&!window.__PHFAST){const si=SC.findIndex(x=>x.k===GREV[k][0]);const one=ONE;ONE=1;scPlay(si,'step',$('#grevS')).then(()=>{ONE=one;const b=$('#gGo');if(b)b.textContent='▶ 開始！'});const b=$('#gGo');if(b)b.textContent='我 會 了 ▶ 開始'}
  $('#gGo').onclick=async()=>{TOK++;for(const n of ['3','2','1','GO!']){B().innerHTML='<div class="big3">'+n+'</div>';await wait(window.__PHFAST?5:650)}next()};if(window.__PHAUTO)$('#gGo').click()}
function next(){const me=G;G.cur=GM[G.seq?G.seq[G.q]:G.k];gHud();if(G.seq&&(G.q===0||G.seq[G.q]!==G.seq[G.q-1])&&!window.__PHFAST){const b=H('div','ban',G.cur.ic+' '+G.cur.nm+'<br><span style="font-size:.7em">🎯 '+G.cur.goal+'</span>');document.body.appendChild(b);setTimeout(()=>{b.remove();if(G===me)G.cur.q()},1300)}else G.cur.q()}
function q25Seq(){const last=LS.g('q25last','');let pick;for(let t=0;t<30;t++){pick=SH(GK).slice(0,5);if(pick.slice().sort().join()!==last)break}LS.s('q25last',pick.slice().sort().join());return [].concat(...pick.map(g=>[g,g,g,g,g]))}
function gQuit(){if(G&&G.t)G.t.stop();G=null;TOK++;$('#game').hidden=true;$('#fb').hidden=true}
$('#gx').onclick=()=>{if(G&&G.Q.length&&!G.sent)rec(G);gQuit()};
async function end(){const g=G,N=g.N||NQ,fr=g.ok/N,rk=fr>=1?'S':fr>=.8?'A':fr>=.6?'B':'C',bk='best_'+g.k,best=LS.g(bk,0);if(g.score>best)LS.s(bk,g.score);rec(g);$('#gtm').firstChild.style.transform='scaleX(0)';
  B().innerHTML='<div class="pnl" style="padding:16px 24px;text-align:center;max-width:980px;max-height:100%;overflow:auto"><div class="res2">'+rk+'</div><div class="cap">答對 <b>'+g.ok+' ／ '+N+'</b>　⭐ '+g.score+(g.score>best?'　🏆 新 紀錄！':'　🏆 最佳 '+best)+'</div>'+
    (g.wrong.length?'<div class="cap">📒 先 聽完 每 一個 錯題 的 正確 發音</div><div id="wl">'+g.wrong.map((w,i)=>'<div class="mrow" data-wi="'+i+'"><div class="wrow mw2">'+wordHTML(info2spec(w.x||w),{dots:1})+'</div><span class="mz">'+(w.zh||'')+'</span><span class="ms">🔊</span></div>').join('')+'</div>':'')+
    '<div class="ctl" id="endB" style="'+(g.wrong.length?'visibility:hidden':'')+'"><button class="btn go" id="again">🔁 再 玩</button><button class="btn" id="back">🎮 換 遊戲</button></div></div>';
  $('#again').onclick=()=>start(g.k);$('#back').onclick=()=>gQuit();
  B().querySelectorAll('[data-wi]').forEach(r=>r.onclick=()=>say(g.wrong[+r.dataset.wi].au));
  for(let i=0;i<g.wrong.length;i++){if(G!==g)return;const r=B().querySelector('[data-wi="'+i+'"]');if(r)r.style.background='rgba(255,224,122,.25)';await say(g.wrong[i].au);await wait(300);if(r){r.style.background='';r.querySelector('.ms').textContent='✔'}}
  const e=$('#endB');if(e)e.style.visibility='visible'}
function rec(g){try{if(g.sent||!g.Q.length)return;g.sent=1;const gr=(typeof scGr==='function'&&scGr())||3;if(window.__PHREC)window.__PHREC.push({k:g.k,n:g.Q.length,set:'g'+gr+'gm_ph-'+g.k});
  if(typeof scLive!=='function'||!scLive())return;const fast=g.Q.reduce((t,x)=>t+x[3],0);
  scQAdd({id:SCID,set:'g'+gr+'gm_ph-'+g.k,name:'🔤 自然發音｜'+(g.k==='q25'?'📝 拼音 25 題 闖關':GM[g.k].ic+' '+GM[g.k].nm),m:'q',qs:g.Q,raw:g.score,fix:0,mp:0,mw:0,sec:Math.round((Date.now()-g.t0)/1000),src:'school',dev:typeof SCDEV!=='undefined'?SCDEV:'',u:SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now()})}catch(e){}}
function begin(sec,lead){gHud();G.lock=-1;G.t=timer(sec,()=>answer(false,lead()))}
/* 每 個 字 的 資料：x（QW）、au、zh、idx */
const inf=(x,o)=>Object.assign({x,w:x.w,au:x.c,idx:QI(x)},o||{});
/* ══ 1 🧪 母音 煉金坊（Cafe）══ */
const CUS=['🧙','🧛','🧜','🧞','🦸','🧚','🥷','🤴','👸','🧑‍🚀'];
const VT={ae:'a',eh:'e',ih:'i',aa:'o',uh:'u'};
const VCOL={a:'#FF5A5A',e:'#FF9F43',i:'#2EE59D',o:'#3BE8FF',u:'#B57BFF',ai:'#FFD54A',ee:'#7CFF9E',oa:'#7FB0FF',i_e:'#FF8AD8',a_e:'#FFD54A',o_e:'#7FB0FF',ea:'#7CFF9E',ay:'#FFD54A',ow:'#7FB0FF',u_e:'#C4B5FD',oo:'#9EF0FF'};
function qVow(){const x=pickW(y=>y.on.length+y.co.length>=1&&(G.q<3?!y.long:true));const vs=x.v+(x.mg?'_e':'');
  let O;if(!x.long)O=['a','e','i','o','u'];else{const by={};QW.forEach(y=>{if(y.long&&y.vc!==x.vc)by[y.vc]=y.v+(y.mg?'_e':'')});O=SH([vs].concat(SH(Object.values(by)).slice(0,3)))}
  const info=inf(x,{tip:'中間 的 母音 是 <b class="en">'+vs+'</b>（'+tileHTML(x.vc)+'）'});
  /* 第五十六次（老師 的 Cafe 截圖）：櫃台 前 排 一排 客人（頭上 點單 泡泡），下面 一排 藥水 架（右下角 存量）；倒 對 ＝ 出餐＋那 一瓶 補 貨 */
  G.st=G.st||{};O.forEach(v=>{if(G.st[v]==null)G.st[v]=3+Math.floor(Math.random()*5)});const cs=SH(CUS).slice(0,3);
  B().innerHTML=reTag()+'<div class="cafe"><div class="lamps"><i></i><i></i></div><div class="queue"><div class="cu now"><div class="ord"><div class="gq" style="margin:0">我 要 👉 🔊</div><div class="wrow" style="padding:22px 4px 26px">'+wordHTML(x.on.join('')+(x.on.length?'.':'')+'[?]v'+(x.co.length?'.'+x.co.join(''):'')+(x.mg?'.e~':''),{hideT:1})+'</div></div><div class="cust">'+cs[0]+'</div></div><div class="cu"><div class="ord sm">🔊 ?</div><div class="cust">'+cs[1]+'</div></div><div class="cu"><div class="ord sm">🔊 ?</div><div class="cust">'+cs[2]+'</div></div></div>'+
    '<div class="potions shelf">'+O.map(v=>'<button class="pot" data-v="'+v+'"><i style="background:linear-gradient(180deg,'+VCOL[v]+'cc,'+VCOL[v]+')"></i><b class="en">'+v+'</b><em class="stk">'+G.st[v]+'</em></button>').join('')+'</div></div>';
  B().appendChild(earBtn(x.c));B().querySelectorAll('.pot').forEach(p=>p.onclick=()=>{const ok=p.dataset.v===vs;const c=ctr(p);if(ok){sparks(c[0],c[1],20,VCOL[vs]);p.style.transform='translateY(-30px) rotate(-30deg)';G.st[vs]++;p.querySelector('.stk').textContent=G.st[vs];const cu=B().querySelector('.cu.now');if(cu)cu.classList.add('served')}else{p.classList.add('shake')}answer(ok,Object.assign(info,{yours:ok?undefined:p.dataset.v}))});
  G.hk={ok:()=>B().querySelector('.pot[data-v="'+vs+'"]').click(),no:()=>[].find.call(B().querySelectorAll('.pot'),p=>p.dataset.v!==vs).click()};begin(GM.mvow.T,()=>info);play1(x.c)}
/* ══ 2 ⚔️ 聲音 結界（Monster Brawl）══ */
function onNear(on){const all=[...new Set(QW.map(y=>y.on.join('')).filter(Boolean))];const sc=y=>(y[0]===on[0]?2:0)+(y.length===on.length?1:0)+(y.slice(-1)===on.slice(-1)?1:0);return SH(all.filter(y=>y!==on)).sort((a,b)=>sc(b)-sc(a)).slice(0,3)}
function qOn(){const x=pickW(y=>y.on.length&&(G.q<2?y.ot.length>=1:y.ot.length>=2||Math.random()<.4));const on=x.on.join(''),O=SH([on].concat(onNear(on)));const info=inf(x,{tip:'字首 是 <b class="en">'+on+'</b>（'+x.ot.length+' 個 聲音）'});G.hp=G.hp==null?5:G.hp;
  /* 第五十六次（老師 的 Monster Brawl 截圖）：俯視 戰場，英雄 在 正中間＋魔法 光環，魔物 從 四面八方 往 中間 走；打 對 ＝ 英雄 射 出 雷光 */
  B().innerHTML=reTag()+'<div class="gq">🔊 聽 ➜ 打倒 身上 是 <b>字首</b> 的 魔物</div><div class="arena brawl" id="ar"><div class="hp">'+'❤️'.repeat(G.hp)+'<span style="opacity:.25">'+'🖤'.repeat(5-G.hp)+'</span></div><div class="hero"><div class="aura"></div><div class="hcore">🧙</div></div></div>';B().appendChild(earBtn(x.c));
  const ar=$('#ar'),W=ar.clientWidth,Hh=ar.clientHeight,cx=W/2,cy=Hh/2,P=SH([[.1,.14],[.88,.14],[.1,.84],[.88,.84],[.5,.06],[.06,.5],[.94,.5]]).slice(0,O.length),dur=GM.mon.T*(SLOW>1?1.5:1);
  O.forEach((o,i)=>{const m=H('div','mon','<div class="mb en"><span>'+o+'</span></div>');const sz=Math.min(130,Math.max(90,W*.11));m.style.left=(W*P[i][0]-sz/2)+'px';m.style.top=(Hh*P[i][1]-sz/2)+'px';m.style.transition='left '+dur+'s linear,top '+dur+'s linear';ar.appendChild(m);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{m.style.left=(cx+(W*P[i][0]-cx)*.32-sz/2)+'px';m.style.top=(cy+(Hh*P[i][1]-cy)*.32-sz/2)+'px'}));
    m.onclick=()=>{if(G.lock===G.q)return;const ok=o===on,c=ctr(m),h=ctr(ar.querySelector('.hcore'));if(ok){const dx=c[0]-h[0],dy=c[1]-h[1],bo=H('div','bolt');bo.style.left=h[0]+'px';bo.style.top=h[1]+'px';bo.style.height=Math.hypot(dx,dy)+'px';bo.style.transform='rotate('+(Math.atan2(dy,dx)*180/Math.PI-90)+'deg)';bo.style.transformOrigin='top';document.body.appendChild(bo);setTimeout(()=>bo.remove(),400);m.classList.add('dead');sparks(c[0],c[1],22,'#9EF0FF');ar.querySelector('.aura').classList.add('blast')}else{m.classList.add('shake');G.hp=Math.max(1,G.hp-1)}answer(ok,Object.assign(info,{yours:ok?undefined:o}))}});
  G.hk={ok:()=>[].find.call(B().querySelectorAll('.mon'),m=>m.textContent===on).click(),no:()=>[].find.call(B().querySelectorAll('.mon'),m=>m.textContent!==on).click()};begin(GM.mon.T,()=>info);play1(x.c)}
/* ══ 3 🧲 磁浮 打磚塊（Zorb Blitz）══ */
function qCo(){const x=pickW(y=>y.co.length&&!y.mg);const co=x.co.join('');const all=[...new Set(QW.filter(y=>!y.mg).map(y=>y.co.join('')).filter(Boolean))];
  const sc=y=>(y[0]===co[0]?2:0)+(y.slice(-1)===co.slice(-1)?2:0)+(y.length===co.length?1:0);const HARD=a=>/^(th|s|ss|f|ff)$/.test(a);/* 第五十七次（老師）：path 的 th、pass 的 s 字尾 很 難 聽辨 ➜ th 不 跟 s ss f ff 一起 當 選項 */
  const O=SH([co].concat(SH(all.filter(y=>y!==co&&!(HARD(co)&&HARD(y)&&(co==='th')!==(y==='th')))).sort((a,b)=>sc(b)-sc(a)).slice(0,5)));
  const info=inf(x,{tip:'字尾 是 <b class="en">'+co+'</b>（'+x.ct.length+' 個 聲音）'});
  B().innerHTML=reTag()+'<div class="gq">🔊 聽 ➜ 打碎 寫著 <b>字尾</b> 的 磚塊</div><div class="arena zorb" id="ar"><div class="zh"><span>'+'❤️'.repeat(3)+'</span><b>'+String(G.score).padStart(5,'0')+'</b><span>第 '+(G.q+1)+' 關</span></div><div class="planet"></div><div class="wall en" style="grid-template-columns:repeat(3,1fr)">'+O.map(o=>'<button class="brick" data-o="'+o+'">'+o+'</button>').join('')+'</div><div class="paddle"><i></i></div><div class="ball" id="bl"></div></div>';B().appendChild(earBtn(x.c));
  const ar=$('#ar'),bl=$('#bl');bl.style.left=(ar.clientWidth/2-15)+'px';bl.style.top=(ar.clientHeight-70)+'px';bl.style.transition='left .35s,top .35s';
  B().querySelectorAll('.brick').forEach(b=>b.onclick=()=>{const ok=b.dataset.o===co,r=b.getBoundingClientRect(),a=ar.getBoundingClientRect();bl.style.left=(r.left-a.left+r.width/2-15)+'px';bl.style.top=(r.top-a.top+r.height/2-15)+'px';
    setTimeout(()=>{if(ok){b.classList.add('gone');sparks(r.left+r.width/2,r.top+r.height/2,24,'#FF9F43')}else{b.classList.add('shake');bl.style.top=(ar.clientHeight-70)+'px'}},300);answer(ok,Object.assign(info,{yours:ok?undefined:b.dataset.o}))});
  G.hk={ok:()=>B().querySelector('.brick[data-o="'+co+'"]').click(),no:()=>[].find.call(B().querySelectorAll('.brick'),b=>b.dataset.o!==co).click()};begin(GM.mco.T,()=>info);play1(x.c)}
/* ══ 4 🧱 子母 方塊 塔（Tower Defense）══ */
const PATS=['CVC','CCVC','CVCC','CCVCC','CCCVC','CV','CCV'];
function patDraw(p,mg){const m=/^(C*)V(C*)$/.exec(p),bx=(t,n)=>'<div class="bx '+t+'"><div class="dots" style="position:static;margin-top:4px">'+Array.from({length:n},()=>'<i class="on"></i>').join('')+'</div></div>';
  return '<div class="patb">'+(m[1]?bx('c',m[1].length):'')+bx('v',1)+(m[2]?bx('c',m[2].length):'')+(mg?'<div class="bx g" title="不 發音"><div class="dots" style="position:static;margin-top:4px"></div></div>':'')+'</div>'}   /* 第五十七次：magic e ＝ 最後 一個 灰色 方框（不 發音、沒有 點）*/
function qPat(){const x=pickW(y=>PATS.indexOf(y.pat)>=0),lsn=G.q%2===0;const O=SH([x.pat].concat(SH(PATS.filter(p=>p!==x.pat&&Math.abs(p.length-x.pat.length)<=1)).slice(0,2)));
  const info=inf(x,{tip:x.w+' ＝ '+patTxt(specOf(x))+'：'+x.n+' 個 聲音'});G.tw=G.tw||0;
  B().innerHTML=reTag()+'<div class="gq">'+(lsn?'🔊 聽 ➜ 這個 字 的 方框 長 什麼 樣子？':'👀 看 字 ➜ 方框 長 什麼 樣子？')+'</div>'+(lsn?'':'<div class="scroll" style="font-size:64px;padding:6px 30px">'+x.w+'</div>')+'<div class="arena td" id="ar"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="'+TDP+'" fill="none" stroke="#B9824A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="'+TDP+'" fill="none" stroke="#D9A86A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="tdr">第 '+(G.q+1)+' 波</div>'+Array.from({length:G.tw},(_,k)=>'<div class="twr" style="left:'+TDS[k%TDS.length][0]+'%;top:'+TDS[k%TDS.length][1]+'%">🗼</div>').join('')+'<div class="enemy" id="en">👾</div></div><div class="opts">'+O.map(p=>'<button class="op" data-p="'+p+'" style="padding:4px 8px">'+patDraw(p,x.mg)+'</button>').join('')+'</div>';
  if(lsn)B().appendChild(earBtn(x.c));B().querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const ok=b.dataset.p===x.pat;b.classList.add(ok?'ok':'no');const en=$('#en');if(ok){const sp=TDS[G.tw%TDS.length];G.tw++;$('#ar').insertAdjacentHTML('beforeend','<div class="twr new" style="left:'+sp[0]+'%;top:'+sp[1]+'%">🗼</div>');if(en){const c=ctr(en);setTimeout(()=>{en.classList.add('dead');sparks(c[0],c[1],22,'#FFE07A')},250)}}answer(ok,Object.assign(info,{yours:ok?undefined:b.dataset.p.split('').map(c=>c==='C'?'子':'母').join(' ')}))});
  tdMove();G.hk={ok:()=>B().querySelector('[data-p="'+x.pat+'"]').click(),no:()=>[].find.call(B().querySelectorAll('[data-p]'),b=>b.dataset.p!==x.pat).click()};begin(GM.mpat.T,()=>info);if(lsn)play1(x.c)}
/* 塔防 的 路（0～100 ✕ 0～60）：魔物 沿著 路 走，時間 到 走 到 終點；答 對 ＝ 路 邊 蓋 一座 塔 把 牠 打掉 */
const TDP='M2 8 L30 8 L30 30 L60 30 L60 10 L85 10 L85 50 L40 50 L40 58',TDPT=[[2,8],[30,8],[30,30],[60,30],[60,10],[85,10],[85,50],[40,50],[40,58]],TDS=[[18,18],[45,40],[70,20],[72,58],[48,62],[92,30],[12,40]];
function tdMove(){const en=$('#en');if(!en)return;const L=[];let tot=0;for(let i=1;i<TDPT.length;i++){const d=Math.hypot(TDPT[i][0]-TDPT[i-1][0],TDPT[i][1]-TDPT[i-1][1]);L.push(d);tot+=d}const me=G,q=G.q;
  (function tk(){if(G!==me||G.q!==q||en.classList.contains('dead')||!G.t)return;const f=1-G.t.left();let d=f*tot,i=0;while(i<L.length-1&&d>L[i]){d-=L[i];i++}const a=TDPT[i],b=TDPT[i+1],k=Math.min(1,d/L[i]);en.style.left=(a[0]+(b[0]-a[0])*k)+'%';en.style.top=((a[1]+(b[1]-a[1])*k)/60*100)+'%';requestAnimationFrame(tk)})()}
/* ══ 5 🥁 聲音 戰鼓 ══ */
const CONF={b:'p',p:'b',d:'t',t:'d',m:'n',n:'m',s:'sh',sh:'s',th:'t',ch:'sh',ng:'n',k:'g',g:'k',f:'v',v:'f',l:'r',r:'l',ae:'eh',eh:'ih',ih:'ee',aa:'uh',uh:'aa',ai:'ee',ee:'ih',oa:'aa',ii:'ai',uu:'oa',z:'s',j:'ch',w:'r',h:'f',y:'ee',ks:'k',kw:'k',dh:'th'};
function seqOf(x){return x.ot.map(t=>[t,0]).concat([[x.vc,0]],x.ct.map(t=>[t,1]))}
function rowHTML(S){return S.map(s=>tileHTML(s[0],s[1])).join('')}
function qCnt(){const x=pickW(y=>G.q<2?y.n<=4:y.n>=4),S=seqOf(x);const n=S.length;let hits=0,step=1;
  const sw=S.map(s=>s.slice());const i=Math.floor(Math.random()*sw.length);sw[i]=[CONF[sw[i][0]]||'s',sw[i][1]];const drop=S.slice(0,-1);const O=SH([S,sw,drop.length>=2?drop:S.concat([['s',1]])]);
  const info=inf(x,{tip:x.w+'：'+n+' 個 聲音（'+S.map(s=>tileOf(s[0],s[1])[MD==='zh'?'zh':MD]).join(' ')+'）'});
  B().innerHTML=reTag()+'<div class="gq" id="cq">① 🔊 聽 ➜ <b>一個 聲音 敲 一下</b> 鼓</div><button class="drum" id="dr">🥁</button><div class="cnt" id="cn">0</div><div class="ctl"><button class="btn" id="c0">↩ 重來</button><button class="btn go" id="cok">✔ 敲 好 了</button></div><div id="c2"></div>';B().appendChild(earBtn(x.c));
  $('#dr').onclick=()=>{if(step!==1)return;hits++;$('#cn').textContent=hits;$('#dr').classList.add('hit');setTimeout(()=>$('#dr')&&$('#dr').classList.remove('hit'),120);const c=ctr($('#dr'));sparks(c[0],c[1]-80,6,'#FFE07A')};$('#c0').onclick=()=>{hits=0;$('#cn').textContent=0};
  $('#cok').onclick=()=>{if(step!==1)return;if(hits!==n){answer(false,Object.assign(info,{yours:hits+' 下'}));return}step=2;$('#cq').innerHTML='② ✅ '+n+' 個 聲音！哪 一排 是 它 的 聲音？';$('#dr').style.display='none';$('#cn').style.display='none';$('#c0').style.display='none';$('#cok').style.display='none';
    $('#c2').innerHTML=O.map((r,k)=>'<div class="trow" data-k="'+k+'">'+rowHTML(r)+'</div>').join('');B().querySelectorAll('.trow').forEach(t=>t.onclick=()=>{const ok=O[+t.dataset.k]===S;t.classList.add(ok?'ok':'no');answer(ok,Object.assign(info,{yours:ok?undefined:'另 一排 聲音'}))})};
  G.hk={ok:()=>{for(let k=0;k<n;k++)$('#dr').click();$('#cok').click();B().querySelectorAll('.trow')[O.indexOf(S)].click()},no:()=>{for(let k=0;k<n+1;k++)$('#dr').click();$('#cok').click()}};begin(GM.mcnt.T,()=>info);play1(x.c)}
/* ══ 6 📜 咒語 卷軸（聽音 拼字）══ */
const LCONF={b:'d',d:'b',p:'b',m:'n',n:'m',a:'e',e:'i',i:'e',o:'u',u:'o',sh:'s',s:'sh',th:'t',t:'th',ch:'sh',ng:'n',ck:'k',k:'ck',f:'v',v:'f',l:'r',r:'l',g:'k',x:'ks',ee:'ea',ea:'ee',ai:'ay',oa:'ow',ow:'oa',ay:'ai',w:'v',h:'f',j:'g',z:'s',y:'i',ss:'s',ll:'l',qu:'kw'};
function qSpl(){const x=pickW(y=>G.q<2?y.n<=3:true),U=x.on.concat([x.v],x.co);const ex=SH(U.map(u=>LCONF[u]).filter(u=>u&&U.indexOf(u)<0)).slice(0,3);while(ex.length<3){const r=R(['b','d','p','m','n','s','t','a','e','i','o','u']);if(U.indexOf(r)<0&&ex.indexOf(r)<0)ex.push(r)}
  const tiles=SH(U.concat(ex));let put=[];const info=inf(x,{tip:x.w+' ＝ '+U.join(' ＋ ')+(x.mg?' ＋ e（不 唸）':'')});
  B().innerHTML=reTag()+'<div class="gq">🔊 聽 ➜ 照 聲音 的 順序 放 字母 塊</div><div class="scroll"><div class="slots" id="sl">'+U.map((u,k)=>'<div class="slot '+(k===x.on.length?'v0':'c0')+'" data-s="'+k+'"></div>').join('')+(x.mg?'<div class="slot f" style="color:#8C92A3;background:#E9E2CF">e</div>':'')+'</div></div><div class="opts">'+tiles.map((t,k)=>'<button class="op" data-k="'+k+'">'+t+'</button>').join('')+'</div>';B().appendChild(earBtn(x.c));
  const draw=()=>{B().querySelectorAll('#sl [data-s]').forEach((s,k)=>{s.textContent=put[k]!=null?tiles[put[k]]:'';s.classList.toggle('f',put[k]!=null)});B().querySelectorAll('.opts .op').forEach((b,k)=>b.style.visibility=put.indexOf(k)>=0?'hidden':'visible')};
  B().querySelectorAll('.opts .op').forEach(b=>b.onclick=()=>{if(put.length>=U.length)return;const k=+b.dataset.k;put.push(k);draw();say(auOf(tokOfChunk(tiles[k]),false));if(put.length===U.length){const s=put.map(k=>tiles[k]),ok=s.join('|')===U.join('|');if(ok){const c=ctr($('#sl'));sparks(c[0],c[1],30,'#FFE07A')}else $('#sl').classList.add('shake');answer(ok,Object.assign(info,{yours:ok?undefined:s.join('')+(x.mg?'e':'')}))}});
  B().querySelectorAll('#sl [data-s]').forEach(s=>s.onclick=()=>{const k=+s.dataset.s;if(put[k]==null)return;put=put.slice(0,k);draw()});
  G.hk={ok:()=>{const used=[];U.forEach(u=>{const k=tiles.findIndex((t,i)=>t===u&&used.indexOf(i)<0);used.push(k);B().querySelector('.opts .op[data-k="'+k+'"]').click()})},no:()=>{const used=[];ex.concat(U).slice(0,U.length).forEach(u=>{const k=tiles.findIndex((t,i)=>t===u&&used.indexOf(i)<0);used.push(k);B().querySelector('.opts .op[data-k="'+k+'"]').click()})}};begin(GM.mspl.T,()=>info);play1(x.c)}
function tokOfChunk(c){return CMAP[c]||VMAP[c]||c}
/* ══ 7 🎱 星環 彈珠台（Pirate Pool 的 玩法；2026-11-17 第五十七次 老師 4-17：原本 沒有 彈珠台 的 樂趣 ➜ 整個 重做）
 * 傾斜 的 3D 檯面＋霓虹 軌道＋會 亮 的 彈簧 柱（bumper）＋右下 發射 彈簧＋下面 兩支 擋板（flipper）；
 * 聽 🔊 ➜ 點 上面 寫著 那個 字 的 金幣 洞 ➜ 拉 彈簧、彈珠 射 上 軌道、繞 一圈 掉進 你 選 的 洞（真的 重力＋碰撞，碰到 彈簧 柱 會 閃＋加 分）
 * 對 ＝ JACKPOT（洞 爆開、金幣 雨、軌道 燈 繞 圈）；錯 ＝ 洞 裂開、彈珠 掉 下去 被 擋板 打 出去 */
function qCoin(){const x=pickW(()=>true);let O=[x].concat(near(x,'v',1),near(x,'on',1),near(x,'co',1));while(O.length<4){const y=R(QW);if(O.indexOf(y)<0&&O.every(z=>z.w!==y.w))O.push(y)}O=SH(O.slice(0,4));const info=inf(x,{tip:'聽 每 一個 聲音：'+patTxt(specOf(x))});
  B().innerHTML=reTag()+'<div class="gq">🔊 聽 ➜ 點 寫著 那個 字 的 金幣 洞，把 彈珠 射 進去！</div><div class="pin" id="ar"><div class="pinb"><canvas id="pcv"></canvas><div class="prail"></div><div class="plane"><i id="pspr"></i></div><div class="pjack" id="pjk">JACKPOT</div></div></div>';B().appendChild(earBtn(x.c));
  const ar=$('#ar'),bd=ar.querySelector('.pinb'),cv=$('#pcv'),W=bd.clientWidth,Hh=bd.clientHeight,ctx=cv.getContext('2d');cv.width=W;cv.height=Hh;
  const HX=[.16,.39,.61,.84],HY=.2,holes=O.map((y,i)=>({x:W*HX[i]*.9,y:Hh*HY,y0:y}));
  const PEG=[];[[.22,.42],[.45,.4],[.68,.42],[.12,.6],[.34,.58],[.57,.6],[.79,.58],[.24,.76],[.66,.76]].forEach(p=>PEG.push({x:W*p[0]*.9,y:Hh*p[1],r:Math.max(14,W*.022),f:0}));
  holes.forEach((h,i)=>{const c=H('button','coin pcoin',h.y0.w);c.style.left=(h.x-Math.min(80,W*.09))+'px';c.style.top=(h.y-Math.min(80,W*.09)*.75)+'px';bd.appendChild(c);
    c.onclick=()=>{if(G.lock===G.q||G.pin)return;G.pin=1;if(G.t)G.t.stop();const ok=h.y0===x;launch(h,c,ok)}});
  let ball=null,parts=[],lights=0,raf=0;const me=G,q=G.q;
  function draw(){if(G!==me||G.q!==q){cancelAnimationFrame(raf);return}ctx.clearRect(0,0,W,Hh);lights+=.06;
    /* 軌道 燈：一圈 會 繞 的 小 燈 */
    for(let k=0;k<26;k++){const a=Math.PI+k/25*Math.PI,lx=W*.45+Math.cos(a)*W*.43,ly=Hh*.34+Math.sin(a)*Hh*.3,on=(Math.floor(lights*3)+k)%5===0||G.jack;ctx.fillStyle=on?'#FFE07A':'rgba(255,224,122,.25)';ctx.beginPath();ctx.arc(lx,ly,on?5:3,0,7);ctx.fill()}
    PEG.forEach(p=>{p.f*=.9;const g=ctx.createRadialGradient(p.x-p.r*.3,p.y-p.r*.3,2,p.x,p.y,p.r);g.addColorStop(0,'#fff');g.addColorStop(.35,p.f>.2?'#FFE07A':'#9EF0FF');g.addColorStop(1,p.f>.2?'#FF7A00':'#1B46C9');
      ctx.shadowColor=p.f>.2?'#FFB000':'#3BE8FF';ctx.shadowBlur=14+p.f*30;ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r*(1+p.f*.35),0,7);ctx.fill();ctx.shadowBlur=0});
    /* 擋板 */
    const fl=G.flip||0;[[.24,1],[.66,-1]].forEach(([fx,s])=>{ctx.save();ctx.translate(W*fx,Hh*.93);ctx.rotate(s*(.35-fl*.8));ctx.fillStyle='#FF4FA3';ctx.shadowColor='#FF4FA3';ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect?ctx.roundRect(s>0?0:-W*.17,-9,W*.17,18,9):ctx.rect(s>0?0:-W*.17,-9,W*.17,18);ctx.fill();ctx.restore()});ctx.shadowBlur=0;
    parts=parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.25;p.l-=.02;if(p.l<=0)return false;ctx.globalAlpha=p.l;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();ctx.globalAlpha=1;return true});
    if(ball){(ball.tr||[]).forEach((t,k,A)=>{ctx.globalAlpha=k/A.length*.6;ctx.fillStyle='#9EF0FF';ctx.beginPath();ctx.arc(t[0],t[1],ball.r*(k/A.length),0,7);ctx.fill()});ctx.globalAlpha=1;
      const g=ctx.createRadialGradient(ball.x-4,ball.y-4,2,ball.x,ball.y,ball.r);g.addColorStop(0,'#fff');g.addColorStop(.5,'#E5E7EB');g.addColorStop(1,'#6B7280');ctx.fillStyle=g;ctx.shadowColor='#fff';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,7);ctx.fill();ctx.shadowBlur=0}
    raf=requestAnimationFrame(draw)}
  draw();
  function boom(px,py,n,c){for(let k=0;k<n;k++){const a=Math.random()*6.28,v=Math.random()*7+2;parts.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v-3,r:Math.random()*4+2,l:1,c:c||R(['#FFE07A','#FFD54A','#fff','#FF9F43'])})}}
  async function launch(h,coin,ok){const F=window.__PHFAST,spr=$('#pspr');spr.classList.add('pull');await wait(F?5:380);spr.classList.remove('pull');
    ball={x:W*.955,y:Hh*.88,r:Math.max(11,W*.016),tr:[]};
    /* ① 發射：沿著 右邊 軌道 往上 ➜ 繞 上面 的 弧 ➜ 到 你 選 的 洞 上方（貝茲 曲線）*/
    const P0=[W*.955,Hh*.88],P1=[W*.97,Hh*.02],P2=[h.x+(h.x<W*.45?-W*.1:W*.1),-Hh*.05],P3=[h.x,h.y];const T1=F?2:900,t0=performance.now();
    await new Promise(res=>{(function mv(){const k=Math.min(1,(performance.now()-t0)/T1),u=1-k,bz=i=>u*u*u*P0[i]+3*u*u*k*P1[i]+3*u*k*k*P2[i]+k*k*k*P3[i];ball.tr.push([ball.x,ball.y]);if(ball.tr.length>10)ball.tr.shift();ball.x=bz(0);ball.y=bz(1);if(k<1)requestAnimationFrame(mv);else res()})()});
    if(ok){G.jack=1;coin.classList.add('sink','jk');boom(h.x,h.y,F?4:90);$('#pjk').classList.add('on');const k2=ctr(coin);sparks(k2[0],k2[1],30,'#FFD54A');setTimeout(()=>{G.jack=0},1600)}else{coin.classList.add('crack');boom(h.x,h.y,F?2:24,'#9CA3AF')}
    /* ② 掉 下來：真的 重力＋碰 彈簧 柱 反彈（碰 一下 ＝ 閃＋＋10）*/
    let vx=(Math.random()-.5)*4,vy=1;const t2=performance.now();
    await new Promise(res=>{(function fall(){if(F){res();return}vy+=.38;ball.x+=vx;ball.y+=vy;ball.tr.push([ball.x,ball.y]);if(ball.tr.length>10)ball.tr.shift();
      PEG.forEach(p=>{const dx=ball.x-p.x,dy=ball.y-p.y,d=Math.hypot(dx,dy),m=ball.r+p.r;if(d<m&&d>0){const nx=dx/d,ny=dy/d,dot=vx*nx+vy*ny;vx-=1.9*dot*nx;vy-=1.9*dot*ny;vx+=nx*1.5;ball.x=p.x+nx*m;ball.y=p.y+ny*m;p.f=1;boom(p.x,p.y,10,'#9EF0FF');fx('＋10',p.x+bd.getBoundingClientRect().left,p.y+bd.getBoundingClientRect().top-30,'#9EF0FF')}});
      if(ball.x<ball.r){ball.x=ball.r;vx=Math.abs(vx)*.8}if(ball.x>W*.9-ball.r){ball.x=W*.9-ball.r;vx=-Math.abs(vx)*.8}
      if(ball.y>Hh*.88||performance.now()-t2>2600){res();return}requestAnimationFrame(fall)})()});
    /* ③ 擋板 一拍，彈珠 飛 出去 */
    G.flip=1;setTimeout(()=>{if(G)G.flip=0},F?2:220);ball=null;await wait(F?5:300);
    answer(ok,Object.assign(info,{yours:ok?undefined:h.y0.w}))}
  G.pin=0;G.hk={ok:()=>[].find.call(B().querySelectorAll('.coin'),c=>c.textContent===x.w).click(),no:()=>[].find.call(B().querySelectorAll('.coin'),c=>c.textContent!==x.w).click()};begin(GM.mcoin.T,()=>info);play1(x.c)}
/* ══ 8 👑 拼音 王國（Crazy Kingdom）══ */
const KR=[['🪵','木材'],['👥','人民'],['😊','快樂'],['🪙','黃金']];
function qKing(){const x=pickW(()=>true),alt=R(near(x,'v',2).concat(near(x,'on',2),near(x,'co',2))),right=!alt||Math.random()<.5,au=right?x.c:alt.c;G.kr=G.kr||[60,60,60,60];
  const info=inf(x,{tip:right?'使者 唸 的 就是 <b class="en">'+x.w+'</b>（唸 對 了）':'使者 唸 成 <b class="en">'+alt.w+'</b>，不是 '+x.w});
  B().innerHTML=reTag()+'<div class="king">'+KR.map((r,k)=>'<div class="res">'+r[0]+' '+r[1]+'<i style="width:'+G.kr[k]+'%"></i></div>').join('')+'</div><div class="cust">🤴</div><div class="gq">使者：「這個 字 唸 作 🔊…」對 嗎？</div><div class="scroll">'+x.w+'</div><div class="opts"><button class="op zh" data-y="1">⭕ 唸 對 了</button><button class="op zh" data-y="0">❌ 唸 錯 了</button></div>';B().appendChild(earBtn(au));
  B().querySelectorAll('[data-y]').forEach(b=>b.onclick=()=>{const ok=(b.dataset.y==='1')===right;G.kr=G.kr.map(v=>Math.max(5,Math.min(100,v+(ok?8:-10))));b.classList.add(ok?'ok':'no');answer(ok,Object.assign(info,{yours:ok?undefined:b.textContent}))});
  G.hk={ok:()=>B().querySelector('[data-y="'+(right?1:0)+'"]').click(),no:()=>B().querySelector('[data-y="'+(right?0:1)+'"]').click()};begin(GM.mking.T,()=>info);play1(au)}
/* ══ 9 🫧 泡泡 救援（Plushie Panic）══ */
const DIG=['sh','ch','th','ng','ck','tch','wh','ph'];
function qBub(){const x=pickW(y=>y.on.concat(y.co).some(c=>DIG.indexOf(c)>=0)),U=x.on.concat([x.v],x.co);let ex=[];U.forEach(u=>{if(DIG.indexOf(u)>=0)ex.push(...u.split(''))});ex=ex.filter(e=>U.indexOf(e)<0);ex=[...new Set(ex)].slice(0,3);
  while(U.length+ex.length<8){const r=R(['b','d','p','m','n','s','t','a','e','i','o','u','l','r']);if(U.indexOf(r)<0&&ex.indexOf(r)<0)ex.push(r)}
  const all=SH(U.concat(ex));let k=0;const info=inf(x,{tip:'<b class="en">'+U.filter(u=>DIG.indexOf(u)>=0).join('、')+'</b> ＝ 兩個 字母、一個 聲音（一顆 泡泡）'});
  /* 第五十六次（老師 的 Plushie Panic 截圖）：街機 機台，泡泡 黏 在 上面，下面 發射器；點 泡泡 ＝ 發射器 射 過去 戳破 */
  B().innerHTML=reTag()+'<div class="gq">🔊 聽 ➜ 照 聲音 順序 戳 泡泡（sh、th ＝ 一顆）</div><div class="arena cab" id="ar"><div class="cabin"><div class="cluster" id="cl"></div><div class="slots" id="sl">'+U.map(()=>'<div class="slot"></div>').join('')+'</div><div class="launch" id="ln"><i></i></div></div></div>';B().appendChild(earBtn(x.c));
  const COL=['#FF4F6D','#2EE59D','#3BA0FF','#FF9F43','#B57BFF','#FFD54A'];
  all.forEach((u,i)=>{const b=H('button','bub',u);b.style.setProperty('--bc',COL[i%COL.length]);b.style.animationDelay=(i*.25)+'s';$('#cl').appendChild(b);
    b.onclick=()=>{if(G.lock===G.q||b.classList.contains('pop'))return;const ln=ctr($('#ln')),c=ctr(b),sh=H('div','shot');sh.style.left=ln[0]+'px';sh.style.top=ln[1]+'px';document.body.appendChild(sh);requestAnimationFrame(()=>{sh.style.left=c[0]+'px';sh.style.top=c[1]+'px'});setTimeout(()=>sh.remove(),260);
      if(u===U[k]){setTimeout(()=>{b.classList.add('pop');sparks(c[0],c[1],12,'#9EF0FF')},200);$('#sl').children[k].textContent=u;$('#sl').children[k].classList.add('f');say(auOf(tokOfChunk(u),k>x.on.length));k++;if(k===U.length)answer(true,info)}else{b.classList.add('shake');answer(false,Object.assign(info,{yours:U.slice(0,k).join('')+u+'…'}))}}});
  G.hk={ok:()=>{const used=[];U.forEach(u=>{const b=[].find.call(B().querySelectorAll('.bub'),e=>e.textContent===u&&used.indexOf(e)<0);used.push(b);b.click()})},no:()=>{const b=[].find.call(B().querySelectorAll('.bub'),e=>e.textContent!==U[0]);b.click()}};begin(GM.mbub.T,()=>info);play1(x.c)}
/* ══ 10 🏭 音節 工廠（Factory）══ */
function qSyl(){G.re=0;const s=R(SYLW),ex=SH([].concat(...SYLW.filter(y=>y!==s).map(y=>y[1]))).filter(y=>s[1].indexOf(y)<0).slice(0,3),cards=SH(s[1].concat(ex));let got=[];G.mach=G.mach||0;
  const info={w:s[0],au:AV.has('bk_'+s[0])?'bk_'+s[0]:'w_c55_baby',zh:s[3],idx:QW.length+SYLW.indexOf(s),spec:SPECS[s[0]],tip:s[0]+' ＝ '+s[1].join(' ＋ ')+'（2 個 紅框 ＝ 2 個 音節）'};
  B().innerHTML=reTag()+'<div class="gq">🔊 聽 ➜ 照 順序 選 兩 個 音節 卡 送進 機器</div><div style="font-size:60px">🏭'+'⚙️'.repeat(Math.min(6,G.mach))+'</div><div class="slots"><div class="slot" id="s0"></div><div class="plus">＋</div><div class="slot" id="s1"></div></div><div class="mach">'+cards.map((c,k)=>'<button class="sc" data-k="'+k+'">'+c+'</button>').join('')+'</div>';B().appendChild(earBtn(info.au));
  B().querySelectorAll('.sc').forEach(b=>b.onclick=()=>{if(b.classList.contains('used'))return;const c=cards[+b.dataset.k];b.classList.add('used');$('#s'+got.length).textContent=c;$('#s'+got.length).classList.add('f');const si=s[1].indexOf(c);if(si>=0)say(s[2][si]);got.push(c);
    if(got.length===2){const ok=got.join('|')===s[1].join('|');if(ok){G.mach++;const k=ctr(b);sparks(k[0],k[1],20,'#FFD54A')}answer(ok,Object.assign(info,{yours:ok?undefined:got.join('')}))}});
  G.hk={ok:()=>s[1].forEach(c=>B().querySelector('.sc[data-k="'+cards.indexOf(c)+'"]').click()),no:()=>{B().querySelector('.sc[data-k="'+cards.indexOf(s[1][1])+'"]').click();B().querySelector('.sc[data-k="'+cards.indexOf(s[1][0])+'"]').click()}};begin(GM.msyl.T,()=>info);play1(info.au)}
const SPECS={bathroom:'b.a.th|r.oo.m',bedroom:'b.e.d|r.oo.m',rabbit:'r.a|bb.i.t',happy:'h.a|pp.y',kitchen:'k.i|tch.e=ah.n',angry:'a.n|gr.y',turtle:'t.ur=er|t.le=el',dining:'d.i!=ii|n.i.ng',living:'l.i|v.i.ng',baby:'b.a!=ai|b.y'};
/* ── 遊戲 列表 ── */
function gList(){$('#gList').innerHTML='<button class="gc big" data-g="q25"><span class="gi">📝</span><b>拼音 25 題 闖關</b><span>10 種 遊戲 每 次 抽 5 種、每 種 5 題；組合 每 次 都 不一樣　🏆 最佳 '+LS.g('best_q25',0)+'</span></button>'+
  GK.map(k=>'<button class="gc" data-g="'+k+'"><em>🎯 '+GM[k].goal+'</em><span class="gi">'+GM[k].ic+'</span><b>'+GM[k].nm+'</b><span>'+GM[k].how.replace(/<[^>]+>/g,'')+'</span></button>').join('');
  $$('#gList [data-g]').forEach(b=>b.onclick=()=>start(b.dataset.g))}
