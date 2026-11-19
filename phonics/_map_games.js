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
  mvow:{ic:'🧪',nm:'母音 煉金坊',goal:'母音 聽辨＋認讀',how:'客人 說 一個 字 🔊 ➜ 用 手指 把 對 的 <b>母音 藥水 拖</b> 到 鍋子 上 倒 進去，才 煉 得 出 那個 字',T:15,q:qVow},
  mon:{ic:'⚔️',nm:'聲音 結界',goal:'字首音（1、2、3 個 子音）',how:'魔物 從 四面 走 過來！聽 🔊 ➜ 在 牠 走到 你 以前 <b>點</b> 身上 寫著 <b>字首</b> 的 那 一隻（bl、st、str…）',T:12,q:qOn},
  mco:{ic:'🧲',nm:'磁浮 打磚塊',goal:'字尾音（1、2 個 子音、兩個 字母 一個 聲音）',how:'聽 🔊 ➜ 點 寫著 <b>字尾</b> 的 磚塊，磁浮 球 飛 過去 打碎 它（st、mp、ng…）',T:15,q:qCo},
  mpat:{ic:'🧱',nm:'子母 方塊 塔',goal:'子音 母音 怎麼 排（子母子、子子母子…）',how:'聽 🔊 或 看 字 ➜ 把 對 的 <b>方框 塔 拖</b> 到 路 邊 發光 的 空地（藍 ＝ 子音、紅 ＝ 母音、黃點 ＝ 聲音），塔 會 自己 射 敵人',T:15,q:qPat},
  mcnt:{ic:'🥁',nm:'聲音 戰鼓',goal:'這個 字 有 幾個 聲音、是 哪些 聲音',how:'聽 🔊 ➜ ① 一個 聲音 敲 一下 鼓 ➜ ② 選 對 的 一排 音標',T:25,q:qCnt},
  mspl:{ic:'📜',nm:'咒語 卷軸',goal:'聽音 拼字',how:'聽 🔊 ➜ 照 聲音 的 順序 把 字母 塊 放進 卷軸（th、sh、ng ＝ 一塊）',T:30,q:qSpl},
  mcoin:{ic:'🎱',nm:'星環 彈珠台',goal:'聽音 認字（拼字 很 像 也 不 會 錯）',how:'聽 🔊 ➜ 按住 彈簧 <b>往 下 拉</b>（拉 愈 多 射 愈 高），讓 彈珠 停 在 寫著 那個 字 的 金幣 洞',T:15,q:qCoin},
  mking:{ic:'👑',nm:'拼音 王國',goal:'看字 讀音（自己 拼 出來，判斷 唸 得 對 不 對）',how:'使者 拿著 一個 字 走 向 城門、唸 給 你 聽 🔊 ➜ 把 拉桿 <b>往 上 推 ＝ 開門（唸 對）</b>、<b>往 下 拉 ＝ 關門（唸 錯）</b>',T:15,q:qKing},
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
  G.Q.push([ok?1:0,ok?0:(info.yours==null?-1:1),Math.round(sec*10)/10,info.yours!=null&&sec<1?1:0,ok?Math.round(left*1000)/1000:0,info.idx]);G.res.push(ok?1:0);if(typeof mPub==='function')mPub(G);
  if(ok){G.combo++;let p=100+Math.round(100*left);const m=(G.combo>=3?2:1)*(G.q===N-1?2:1)*(info.hm||1);p*=m;   /* 第六十次：⏱️ 你 來 拼 不 看 提示 ✖5（info.hm）*/G.score+=p;G.ok++;const c=ctr(B());fx('＋'+p+(m>1?'（✖'+m+'）':''),c[0]-60,c[1]-140);gHud();await okPage(info)}
  else{G.combo=0;G.wrong.push(info);if(info.x&&!G.re&&G.q<(G.N||NQ)-1){G.rq=G.rq||[];G.rq.push({x:info.x,at:G.q+2})}gHud();await noPage(info)}
  G.q++;if(G.q>=N){end();return}next()}
function wordBoxHTML(x,o){return '<div class="wrow">'+wordHTML(info2spec(x),Object.assign({dots:1},o||{}))+'</div>'}
function info2spec(x){return x.spec||specOf(x)}
async function readWord(spec,au,root){const S=parse(spec),cks=root.querySelectorAll('.ck');let k=0;for(const Bx of S)for(const b of Bx)for(const c of b.ch){const el=cks[k++];if(!c.t||b.type==='g'||!el)continue;el.classList.add('on');await say(auOf(c.t,b.coda));el.classList.remove('on')}await say(au)}
function okPage(info){return new Promise(async res=>{if(window.__PHFAST&&!window.__PHFB){res();return}const f=$('#fb');f.className='ok';f.hidden=false;
  f.innerHTML='<h2>✅ 答對了！</h2>'+wordBoxHTML(info.x||info)+(info.zh?'<div class="tip">'+info.zh+'</div>':'');sparks(innerWidth/2,innerHeight/2,24);await say(info.au);if(info.twice){await wait(350);await say(info.au)}await wait(500);f.hidden=true;res()})}
function noPage(info){return new Promise(async res=>{const f=$('#fb');f.className='no';f.hidden=false;
  f.innerHTML='<h2>'+(info.yours==null?'⏰ 時間 到':'❌ 再 看 一次')+'</h2>'+(info.yours!=null?'<div class="yo">你 選 的：<s class="en">'+info.yours+'</s></div>':'')+'<div class="tip">✅ 正確：</div>'+wordBoxHTML(info.x||info)+
    '<div class="sum">'+patTxt(info2spec(info.x||info))+'：<b>'+countOf(info2spec(info.x||info)).n+' 個 聲音</b></div>'+(info.tip?'<div class="tip">💡 '+info.tip+'</div>':'')+'<button class="btn go" id="fbGo" disabled>🔊 聽 …</button>';
  const go=$('#fbGo');await readWord(info2spec(info.x||info),info.au,f);await wait(300);await say(info.au);go.disabled=false;go.textContent='▶ 繼續';if(window.__PHFAST){f.hidden=true;res();return}go.onclick=()=>{f.hidden=true;res()}})}
/* ── 開始／下一題／結束 ── */
/* 第六十二次：30 秒 複習 ＝ 拼音 地圖 那 一段 動畫，或 44 音 字卡 主題 的 複習（GREV 的 第一 格 ＝ 'sndN'）*/
function revPlay(k){const g=GREV[k][0];if(/^sndS\d+$/.test(g))return sndReview(g.slice(3),$('#grevS'));if(/^snd\d+$/.test(g))return sndReview(+g.slice(3),$('#grevS'));return scPlay(SC.findIndex(x=>x.k===g),'step',$('#grevS'))}
function start(k,opt){opt=opt||{};if(typeof SCON!=='undefined'&&SCON&&!SCID&&typeof scLogin==='function'&&!window.__PHNOLOGIN){scLogin(function(){SCH.close();if(typeof scBar==='function')scBar();start(k,opt)});return}
  G={k,q:0,ok:0,score:0,combo:0,res:[],wrong:[],Q:[],t0:Date.now(),lock:-1,tw:0};if(k==='q25'){G.N=25;G.seq=q25Seq()}if(GM[k]&&GM[k].N)G.N=GM[k].N;   /* 第六十四次：44 音 練習 路線 一關 10～20 題（開場 頁 也 寫 對）*/TOK++;
  $('#game').hidden=false;const M=k==='q25'?{ic:'📝',nm:'拼音 25 題 闖關',goal:'10 種 遊戲 混 在 一起',how:'這 一回 抽到：<br>'+[...new Set(G.seq)].map(g=>GM[g].ic+' '+GM[g].nm).join('、')+'<br>每 一次 組合 都 不一樣'}:GM[k];
  $('#gq').textContent='';$('#gt').textContent=M.ic+' '+M.nm;$('#gsc').textContent='⭐ 0';
  B().innerHTML='<div class="pnl" style="padding:20px 26px;text-align:center;max-width:900px"><div style="font-size:70px">'+M.ic+'</div><h2 class="st">'+M.nm+'</h2><div class="cap">🎯 學習 目標：<b>'+M.goal+'</b></div><div class="cap">'+M.how+'</div>'+
    (GREV[k]?(LS.g('pl_'+k,0)?'<button class="btn gold" id="grevB">🎬 看 30 秒 複習（可以 不 看）</button><div class="grev" id="grevW" hidden><div class="pnl" id="grevS"></div></div>':'<div class="grev"><div class="grevt">🎬 先 複習 一下（約 30 秒）</div><div class="pnl" id="grevS"></div></div>'):'')+'<div class="cap" style="font-size:22px;color:#FFE07A">📝 '+(G.N||NQ)+' 題　⚡ 愈 快 分數 愈 高</div><button class="btn go" id="gGo" style="font-size:30px;min-height:70px;padding:10px 40px">▶ 開始！</button></div>';
  /* 第六十一次 老師 2-(3)：字 太 多 ➜ 只 留 目標＋一句 玩法；玩 過 一次 以後 複習 動畫 不 自動 演（學生 自己 選 要不要 看）*/const rv=$('#grevB');if(rv)rv.onclick=()=>{rv.hidden=true;$('#grevW').hidden=false;const one=ONE;ONE=1;revPlay(k).then(()=>{ONE=one})};
  if(GREV[k]&&!window.__PHFAST&&!LS.g('pl_'+k,0)){const one=ONE;ONE=1;revPlay(k).then(()=>{ONE=one;const b=$('#gGo');if(b)b.textContent='▶ 開始！'});const b=$('#gGo');if(b)b.textContent='我 會 了 ▶ 開始'}
  $('#gGo').onclick=async()=>{TOK++;LS.s('pl_'+k,1);for(const n of ['3','2','1','GO!']){B().innerHTML='<div class="big3">'+n+'</div>';await wait(window.__PHFAST?5:650)}next()};if(window.__PHAUTO)$('#gGo').click()}
function next(){const me=G;G.cur=GM[G.seq?G.seq[G.q]:G.k];gHud();if(G.seq&&(G.q===0||G.seq[G.q]!==G.seq[G.q-1])&&!window.__PHFAST){const b=H('div','ban',G.cur.ic+' '+G.cur.nm+'<br><span style="font-size:.7em">🎯 '+G.cur.goal+'</span>');document.body.appendChild(b);setTimeout(()=>{b.remove();if(G===me)G.cur.q()},1300)}else G.cur.q()}
function q25Seq(){const last=LS.g('q25last','');let pick;for(let t=0;t<30;t++){pick=SH(GK).slice(0,5);if(pick.slice().sort().join()!==last)break}LS.s('q25last',pick.slice().sort().join());return [].concat(...pick.map(g=>[g,g,g,g,g]))}
function gQuit(){if(G&&G.t)G.t.stop();G=null;TOK++;$('#game').hidden=true;$('#fb').hidden=true}
$('#gx').onclick=()=>{if(G&&G.Q.length&&!G.sent)rec(G);gQuit()};
async function end(){const g=G,N=g.N||NQ,fr=g.ok/N,rk=fr>=1?'S':fr>=.8?'A':fr>=.6?'B':'C',bk='best_'+g.k,best=LS.g(bk,0);if(g.score>best)LS.s(bk,g.score);rec(g);$('#gtm').firstChild.style.transform='scaleX(0)';
  /* 2026-11-17 第五十八次 老師 (9)：黃色 S 看不懂 ➜ 改「跟 上一次 的 自己 比」＋這次 每 一題 ✅❌＋下一步（研究：跟 自己 比 的 進步 回饋 Hattie & Timperley 2007）*/
  if(typeof mPub==='function')mPub(g);const last=LS.g('last_'+g.k,null);LS.s('last_'+g.k,g.ok);
  B().innerHTML='<div class="pnl" style="padding:16px 24px;text-align:center;max-width:980px;max-height:100%;overflow:auto">'+endProg(g.ok,N,last,g.Q.map(x=>x[0]),rk)+'<div class="cap">⭐ 遊戲 積分 '+g.score+(g.score>best?'　🏆 新 紀錄！':'　（最佳 '+best+'）')+'</div>'+
    (g.wrong.length?'<div class="cap">📒 先 聽完 每 一個 錯題 的 正確 發音</div><div id="wl">'+g.wrong.map((w,i)=>'<div class="mrow" data-wi="'+i+'"><div class="wrow mw2">'+wordHTML(info2spec(w.x||w),{dots:1})+'</div><span class="mz">'+(w.zh||'')+'</span><span class="ms">🔊</span></div>').join('')+'</div>':'')+
    '<div class="ctl" id="endB" style="'+(g.wrong.length?'visibility:hidden':'')+'"><button class="btn go" id="again">🔁 再 玩</button><button class="btn" id="back">🎮 換 遊戲</button></div></div>';
  $('#again').onclick=()=>start(g.k);$('#back').onclick=()=>gQuit();
  B().querySelectorAll('[data-wi]').forEach(r=>r.onclick=()=>say(g.wrong[+r.dataset.wi].au));
  for(let i=0;i<g.wrong.length;i++){if(G!==g)return;const r=B().querySelector('[data-wi="'+i+'"]');if(r)r.style.background='rgba(255,224,122,.25)';await say(g.wrong[i].au);await wait(300);if(r){r.style.background='';r.querySelector('.ms').textContent='✔'}}
  const e=$('#endB');if(e)e.style.visibility='visible'}
function endProg(ok,N,last,res,rk){const d=last==null?null:ok-last;
  return '<div class="res2" data-rk="'+rk+'">✅ 答對 <b>'+ok+'</b> ／ '+N+'</div><div class="eqd">'+res.map(x=>'<i class="'+(x?'y':'n')+'">'+(x?'✅':'❌')+'</i>').join('')+'</div>'+
   '<div class="eprog">'+(last==null?'🌱 第一次 玩：這 就 是 你 的 <b>起點</b>':'📈 上一次 <b>'+last+'</b> ➜ 這次 <b>'+ok+'</b>　'+(d>0?'<b class="up">進步 ＋'+d+' 題！</b>':d===0?(ok===N?'<b class="up">又 全對！穩穩 的！</b>':'<b>一樣，再 加油 1 題 就 進步！</b>'):'<b class="dn">差 '+(-d)+' 題，再 試 一次 一定 行！</b>'))+'</div>'+
   '<div class="enext">'+(ok===N?'💯 全部 答對：你 已經 學會 了！':'💪 下一步：聽 錯 的 '+(N-ok)+' 個 字 ➜ 再 玩 一次，挑戰 '+N+' ／ '+N)+'</div>'}
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
/* 2026-11-19 第六十四次（第六十一次 第 3 點：以前 點 一下 ＝ 動畫 自己 倒 ＝ 假 的）➜ 手指 **拖** 藥水 到 鍋子 上 才 倒 得 進去；倒 錯 ＝ 鍋子 冒 黑煙 */
function qVow(){const x=pickW(y=>y.on.length+y.co.length>=1&&(G.q<3?!y.long:true));const vs=x.v+(x.mg?'_e':'');
  let O;if(!x.long)O=['a','e','i','o','u'];else{const by={};QW.forEach(y=>{if(y.long&&y.vc!==x.vc)by[y.vc]=y.v+(y.mg?'_e':'')});O=SH([vs].concat(SH(Object.values(by)).slice(0,3)))}
  const info=inf(x,{tip:'中間 的 母音 是 <b class="en">'+vs+'</b>（'+tileHTML(x.vc)+'）'});
  G.st=G.st||{};O.forEach(v=>{if(G.st[v]==null)G.st[v]=3+Math.floor(Math.random()*5)});const cs=SH(CUS).slice(0,3);
  B().innerHTML=reTag()+'<div class="cafe" data-real="drag"><div class="lamps"><i></i><i></i></div><div class="queue"><div class="cu now"><div class="ord"><div class="gq" style="margin:0">我 要 👉 🔊</div><div class="wrow" style="padding:22px 4px 26px">'+wordHTML(x.on.join('')+(x.on.length?'.':'')+'[?]v'+(x.co.length?'.'+x.co.join(''):'')+(x.mg?'.e~':''),{hideT:1})+'</div></div><div class="cust">'+cs[0]+'</div></div><div class="cu"><div class="ord sm">🔊 ?</div><div class="cust">'+cs[1]+'</div></div></div>'+
    '<div class="caul" id="caul"><div class="cbub"><i></i><i></i><i></i></div><div class="cpot">⚗️</div><b>✋ 把 藥水 拖 到 這裡</b><div class="csmk"></div></div>'+
    '<div class="potions shelf">'+O.map(v=>'<button class="pot" data-v="'+v+'"><i style="background:linear-gradient(180deg,'+VCOL[v]+'cc,'+VCOL[v]+')"></i><b class="en">'+v+'</b><em class="stk">'+G.st[v]+'</em></button>').join('')+'</div></div>';
  B().appendChild(earBtn(x.c));const cl=$('#caul');
  const pour=p=>{if(!G||G.lock===G.q)return;const me=G;const v=p.dataset.v,ok=v===vs,r=p.getBoundingClientRect(),c=cl.getBoundingClientRect();p.style.transition='transform .45s';p.style.transform='translate('+(c.left+c.width/2-r.left-r.width/2)+'px,'+(c.top-r.top-r.height*.6)+'px) rotate('+(r.left<c.left?110:-110)+'deg)';
    cl.style.setProperty('--pc',VCOL[v]);cl.classList.add('pour');setTimeout(()=>{const k=ctr(cl);if(ok){cl.classList.add('ok');sparks(k[0],k[1]-30,30,VCOL[vs]);G.st[vs]++;const cu=B().querySelector('.cu.now');if(cu)cu.classList.add('served')}else{cl.classList.add('bad')}if(G===me)answer(ok,Object.assign(info,{yours:ok?undefined:v}))},window.__PHFAST?1:520)};
  B().querySelectorAll('.pot').forEach(p=>{sdDrag(p,[cl],()=>pour(p));p.addEventListener('click',()=>{if(!p.classList.contains('drag')){cl.classList.remove('hint');void cl.offsetWidth;cl.classList.add('hint')}})});
  G.hk={ok:()=>pour(B().querySelector('.pot[data-v="'+vs+'"]')),no:()=>pour([].find.call(B().querySelectorAll('.pot'),p=>p.dataset.v!==vs))};begin(GM.mvow.T,()=>info);play1(x.c)}
/* ══ 2 ⚔️ 聲音 結界（Monster Brawl）══ */
function onNear(on){const all=[...new Set(QW.map(y=>y.on.join('')).filter(Boolean))];const sc=y=>(y[0]===on[0]?2:0)+(y.length===on.length?1:0)+(y.slice(-1)===on.slice(-1)?1:0);return SH(all.filter(y=>y!==on)).sort((a,b)=>sc(b)-sc(a)).slice(0,3)}
/* 第六十四次（第六十一次 第 3 點：魔物 以前 走 一半 就 停 ＝ 假 的）➜ 魔物 從 四面 **一直 走 近**（走到 英雄 ＝ 時間 到）；點 魔物 ＝ 英雄 射 出 會 追蹤 的 魔法 彈，**飛 一段 時間** 才 打到（魔物 一直 在 動）；打 錯 ＝ 那 隻 衝 過來 撞 英雄 */
function qOn(){const x=pickW(y=>y.on.length&&(G.q<2?y.ot.length>=1:y.ot.length>=2||Math.random()<.4));const on=x.on.join(''),O=SH([on].concat(onNear(on)));const info=inf(x,{tip:'字首 是 <b class="en">'+on+'</b>（'+x.ot.length+' 個 聲音）'});G.hp=G.hp==null?5:G.hp;
  B().innerHTML=reTag()+'<div class="gq">🔊 聽 ➜ 在 魔物 走到 你 以前，<b>點</b> 身上 是 <b>字首</b> 的 那 一隻</div><div class="arena brawl" id="ar" data-real="move"><div class="hp">'+'❤️'.repeat(G.hp)+'<span style="opacity:.25">'+'🖤'.repeat(5-G.hp)+'</span></div><div class="hero"><div class="aura"></div><div class="hcore">🧙</div></div></div>';B().appendChild(earBtn(x.c));
  const ar=$('#ar'),P=SH([[.08,.12],[.92,.12],[.08,.88],[.92,.88],[.5,.05],[.04,.5],[.96,.5]]).slice(0,O.length),dur=GM.mon.T*(SLOW>1?1.5:1)*1000,me=G,q=G.q;let t0=0,busy=0;
  const M=O.map((o,i)=>{const m=H('div','mon','<div class="mb en"><span>'+o+'</span></div>');ar.appendChild(m);return {m,o,p:P[i],wob:Math.random()*6}});
  (function walk(now){if(G!==me||G.q!==q||G.lock===q)return;if(!t0)t0=now;if(PAUSED)t0+=16;const f=Math.min(1,(now-t0)/dur),W=ar.clientWidth,Hh=ar.clientHeight,cx=W/2,cy=Hh/2;
    M.forEach(z=>{if(z.dead)return;const sz=z.m.offsetWidth,k=1-f*.78,X=cx+(W*z.p[0]-cx)*k+Math.sin(now/300+z.wob)*10,Y=cy+(Hh*z.p[1]-cy)*k+Math.cos(now/350+z.wob)*8;z.x=X;z.y=Y;z.m.style.left=(X-sz/2)+'px';z.m.style.top=(Y-z.m.offsetHeight/2)+'px';z.m.style.transform='scale('+(1+f*.25)+')'});requestAnimationFrame(walk)})(performance.now());
  const zap=z=>{if(!G||G!==me||G.lock===G.q||busy)return;busy=1;const ok=z.o===on,hc=ctr(ar.querySelector('.hcore')),a=ar.getBoundingClientRect(),b=H('div','mbolt');document.body.appendChild(b);const T0=performance.now(),TT=window.__PHFAST?1:380;
    (function fly(now){const k=Math.min(1,(now-T0)/TT),tx=a.left+(z.x||0),ty=a.top+(z.y||0),bx=hc[0]+(tx-hc[0])*k,by=hc[1]+(ty-hc[1])*k;b.style.left=bx+'px';b.style.top=by+'px';if(k<1&&!window.__PHFAST){requestAnimationFrame(fly);return}b.remove();
      if(ok){z.dead=1;z.m.classList.add('dead');sparks(tx,ty,26,'#9EF0FF');ar.querySelector('.aura').classList.add('blast')}else{z.m.classList.add('charge');G.hp=Math.max(1,G.hp-1);ar.classList.add('hurt')}if(G===me)answer(ok,Object.assign(info,{yours:ok?undefined:z.o}))})(performance.now())};
  M.forEach(z=>z.m.onclick=()=>zap(z));
  G.hk={ok:()=>zap(M.find(z=>z.o===on)),no:()=>zap(M.find(z=>z.o!==on))};begin(GM.mon.T,()=>info);play1(x.c)}
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
function patDraw(p,mg){const m=/^(C*)V(C*)$/.exec(p),bx=(t,n)=>'<div class="pbx"><div class="bx '+t+'"><div class="dots" style="position:static;margin-top:4px">'+Array.from({length:n},()=>'<i class="on"></i>').join('')+'</div></div><em class="pl '+t+'">'+(t==='c'?Array.from({length:n},()=>'子').join(' '):'母')+'</em></div>';   /* 第六十一次 老師 2-(3)B：藍 方框 正下方「子」、紅 方框 正下方「母」*/
  return '<div class="patb">'+(m[1]?bx('c',m[1].length):'')+bx('v',1)+(m[2]?bx('c',m[2].length):'')+(mg?'<div class="bx g" title="不 發音"><div class="dots" style="position:static;margin-top:4px"></div></div>':'')+'</div>'}   /* 第五十七次：magic e ＝ 最後 一個 灰色 方框（不 發音、沒有 點）*/
/* 第六十四次（第六十一次 第 3 點：點 樣子 ＝ 塔 自己 出現 ＝ 假 的）➜ 把 對 的「結構 塔」用 手指 **拖 到** 路 邊 發光 的 空地，塔 **自己 射** 沿 路 走 的 敵人；錯 的 塔 倒 掉 */
function qPat(){const x=pickW(y=>PATS.indexOf(y.pat)>=0),lsn=G.q%2===0;const O=SH([x.pat].concat(SH(PATS.filter(p=>p!==x.pat&&Math.abs(p.length-x.pat.length)<=1)).slice(0,2)));
  const info=inf(x,{tip:x.w+' ＝ '+patTxt(specOf(x))+'：'+x.n+' 個 聲音'});G.tw=G.tw||0;const sp=TDS[G.tw%TDS.length];
  B().innerHTML=reTag()+'<div class="gq">'+(lsn?'🔊 聽 ➜ 把 對 的 <b>方框 塔</b> 拖 到 發光 的 空地':'👀 看 字 ➜ 把 對 的 <b>方框 塔</b> 拖 到 發光 的 空地')+'</div>'+(lsn?'':'<div class="scroll" style="font-size:60px;padding:4px 30px">'+x.w+'</div>')+'<div class="arena td" id="ar" data-real="drag"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="'+TDP+'" fill="none" stroke="#B9824A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="'+TDP+'" fill="none" stroke="#D9A86A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="tdr">第 '+(G.q+1)+' 波</div>'+Array.from({length:G.tw},(_,k)=>'<div class="twr" style="left:'+TDS[k%TDS.length][0]+'%;top:'+TDS[k%TDS.length][1]+'%">🗼</div>').join('')+'<div class="tdpad" id="tdpad" style="left:'+sp[0]+'%;top:'+(sp[1]/60*100)+'%">🔨</div><div class="enemy" id="en">👾</div></div><div class="opts tdtray">'+O.map(p=>'<div class="op tdtw" data-p="'+p+'" style="padding:4px 8px">'+patDraw(p,x.mg)+'<small>✋ 拖</small></div>').join('')+'</div>';
  if(lsn)B().appendChild(earBtn(x.c));const pad=$('#tdpad');
  const build=b=>{if(!G||G.lock===G.q)return;const me=G;const ok=b.dataset.p===x.pat,ar=$('#ar'),en=$('#en');b.style.visibility='hidden';pad.innerHTML='<div class="tdbt'+(ok?'':' bad')+'">'+patDraw(b.dataset.p,x.mg)+'<i>🗼</i></div>';
    if(ok){G.tw++;const fire=k=>{if(!en||!document.body.contains(en))return;const a=ctr(pad),c=ctr(en),s=H('div','tdshot');s.style.left=a[0]+'px';s.style.top=a[1]+'px';document.body.appendChild(s);requestAnimationFrame(()=>{s.style.left=c[0]+'px';s.style.top=c[1]+'px'});setTimeout(()=>{s.remove();if(k===2){en.classList.add('dead');sparks(c[0],c[1],24,'#FFE07A')}},window.__PHFAST?1:260)};
      [0,1,2].forEach(k=>setTimeout(()=>fire(k),window.__PHFAST?0:k*230))}
    setTimeout(()=>G===me&&answer(ok,Object.assign(info,{yours:ok?undefined:b.dataset.p.split('').map(c=>c==='C'?'子':'母').join(' ')})),window.__PHFAST?5:ok?800:500)};
  B().querySelectorAll('.tdtw').forEach(b=>sdDrag(b,[pad],()=>build(b)));
  tdMove();G.hk={ok:()=>build(B().querySelector('[data-p="'+x.pat+'"]')),no:()=>build([].find.call(B().querySelectorAll('[data-p]'),b=>b.dataset.p!==x.pat))};begin(GM.mpat.T,()=>info);if(lsn)play1(x.c)}
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
/* ══ 7 🎱 星環 彈珠台（第六十四次 重做：以前 點 洞 ＝ 彈珠 自動 射 ＝ 假 的）
 * 真的 彈珠台：中間 一條 往 上 的 霓虹 軌道，軌道 兩邊 4 個 金幣 洞（寫著 字）一個 比 一個 高；手指 **按住 最 下面 的 彈簧 往 下 拉**（拉 愈 多 射 愈 高），放開 ＝ 彈珠 衝 上去、
 * 停 在 哪 一個 洞 旁邊 就 掉 進 那 一個（＝ 選 那 個 字）；沒 停 在 洞 旁邊 ＝ 滾 回來 再 拉（不 扣分）。旁邊 的 力量 尺 有 刻度 ＝ 每 個 洞 的 高度。*/
function qCoin(){const x=pickW(()=>true);let O=[x].concat(near(x,'v',1),near(x,'on',1),near(x,'co',1));while(O.length<4){const y=R(QW);if(O.indexOf(y)<0&&O.every(z=>z.w!==y.w))O.push(y)}O=SH(O.slice(0,4));const info=inf(x,{tip:'聽 每 一個 聲音：'+patTxt(specOf(x))});
  B().innerHTML=reTag()+'<div class="gq">🔊 聽 ➜ 按住 彈簧 <b>往 下 拉</b>（拉 愈 多 射 愈 高），讓 彈珠 停 在 那個 字 的 洞！</div><div class="pin" id="ar" data-real="pull"><div class="pinb pin2"><canvas id="pcv"></canvas><div class="pjack" id="pjk">JACKPOT</div><div class="pmeter"><i id="pmi"></i></div><div class="pplg" id="pplg"><b>✋</b><span>往 下 拉</span></div></div></div>';B().appendChild(earBtn(x.c));
  const bd=B().querySelector('.pinb'),cv=$('#pcv'),W=bd.clientWidth,Hh=bd.clientHeight,ctx=cv.getContext('2d');cv.width=W;cv.height=Hh;
  const LX=W*.5,Y0=Hh*.86,TOP=Hh*.08,HF=[.2,.42,.64,.86],holes=O.map((y,i)=>({y0:y,f:HF[i],side:i%2?1:-1}));const hy=h=>Y0-(Y0-TOP)*h.f;
  holes.forEach(h=>{const c=H('div','coin pcoin',h.y0.w);const sz=Math.min(140,W*.15);c.style.width=c.style.height=sz+'px';c.style.left=(LX+h.side*W*.2-sz/2)+'px';c.style.top=(hy(h)-sz/2)+'px';c.style.animation='none';bd.appendChild(c);h.el=c;
    const m=H('b','ptick');m.style.bottom=(h.f*100)+'%';bd.querySelector('.pmeter').appendChild(m)});
  let ball={y:Y0,v:0,st:'rest'},pull=0,drag=null,raf=0,parts=[],lt=performance.now();const me=G,q=G.q,CATCH=(Y0-TOP)*.07;
  const plg=$('#pplg');bd.style.touchAction='none';
  bd.onpointerdown=e=>{if(G.lock===G.q||ball.st!=='rest')return;const r=bd.getBoundingClientRect();if(e.clientY-r.top<Hh*.6)return;drag=e.clientY;bd.setPointerCapture(e.pointerId)};
  bd.onpointermove=e=>{if(drag==null)return;pull=Math.max(0,Math.min(1,(e.clientY-drag)/(Hh*.32)));$('#pmi').style.height=(pull*100)+'%';plg.style.transform='translateY('+(pull*Hh*.08)+'px)'};
  bd.onpointerup=()=>{if(drag==null)return;drag=null;plg.style.transform='';if(pull<.05){$('#pmi').style.height='0';return}shoot(pull)};
  function shoot(p){ball.st='up';ball.target=Math.min(1,p*1.0);ball.y=Y0;ball.h=0;$('#pmi').style.height='0'}
  function boom(px,py,n,c){for(let k=0;k<n;k++){const a=Math.random()*6.28,v=Math.random()*7+2;parts.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v-3,r:Math.random()*4+2,l:1,c:c||R(['#FFE07A','#FFD54A','#fff','#FF9F43'])})}}
  function land(h){ball.st='in';const ok=h.y0===x;if(ok){G.jack=1;h.el.classList.add('sink','jk');boom(LX+h.side*W*.2,hy(h),window.__PHFAST?2:90);$('#pjk').classList.add('on')}else{h.el.classList.add('crack');boom(LX+h.side*W*.2,hy(h),20,'#9CA3AF')}
    setTimeout(()=>{if(G!==me)return;G.jack=0;answer(ok,Object.assign(info,{yours:ok?undefined:h.y0.w}))},window.__PHFAST?1:700)}
  function draw(now){if(G!==me||G.q!==q){cancelAnimationFrame(raf);return}const dt=Math.min(.05,(now-lt)/1000);lt=now;ctx.clearRect(0,0,W,Hh);
    /* 軌道 */const g=ctx.createLinearGradient(0,TOP,0,Y0);g.addColorStop(0,'#FF4FD8');g.addColorStop(1,'#3BE8FF');ctx.strokeStyle=g;ctx.lineWidth=6;ctx.shadowColor='#3BE8FF';ctx.shadowBlur=18;[-1,1].forEach(s=>{ctx.beginPath();ctx.moveTo(LX+s*28,Y0+30);ctx.lineTo(LX+s*28,TOP);ctx.stroke()});ctx.shadowBlur=0;
    holes.forEach(h=>{const y=hy(h);ctx.strokeStyle='rgba(255,224,122,.55)';ctx.setLineDash([8,8]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(LX,y);ctx.lineTo(LX+h.side*W*.2,y);ctx.stroke();ctx.setLineDash([])});
    /* 彈簧 */const sy=Y0+20+pull*Hh*.08;ctx.strokeStyle='#E5E7EB';ctx.lineWidth=4;ctx.beginPath();for(let k=0;k<=10;k++){const yy=sy+k*(Hh-sy-6)/10;ctx.lineTo(LX+(k%2?14:-14),yy)}ctx.stroke();
    /* 彈珠 物理：往 上 衝 到 目標 高度 停 一下 ➜ 有 洞 ＝ 掉 進去；沒有 ＝ 滾 回來 */
    if(ball.st==='up'){ball.h=Math.min(ball.target,ball.h+dt*(1.4+2*(ball.target-ball.h)));ball.y=Y0-(Y0-TOP)*ball.h;if(ball.target-ball.h<.004){const h=holes.find(z=>Math.abs(hy(z)-ball.y)<=CATCH);if(h)land(h);else{ball.st='down';const m=$('#gbody .pmiss');if(!m)B().insertAdjacentHTML('beforeend','<div class="pmiss">💨 沒 停 在 洞 旁邊，彈珠 滾 回來 了：再 拉 一次（不 扣分）</div>')}}}
    else if(ball.st==='down'){ball.h=Math.max(0,ball.h-dt*1.8);ball.y=Y0-(Y0-TOP)*ball.h;if(ball.h<=0)ball.st='rest'}
    if(ball.st!=='in'){const gg=ctx.createRadialGradient(LX-5,ball.y-5,2,LX,ball.y,15);gg.addColorStop(0,'#fff');gg.addColorStop(.6,'#D1D5DB');gg.addColorStop(1,'#6B7280');ctx.fillStyle=gg;ctx.shadowColor='#fff';ctx.shadowBlur=16;ctx.beginPath();ctx.arc(LX,ball.y,15,0,7);ctx.fill();ctx.shadowBlur=0}
    parts=parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.25;p.l-=.02;if(p.l<=0)return false;ctx.globalAlpha=p.l;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();ctx.globalAlpha=1;return true});
    raf=requestAnimationFrame(draw)}
  raf=requestAnimationFrame(draw);
  G.hk={ok:()=>land(holes.find(h=>h.y0===x)),no:()=>land(holes.find(h=>h.y0!==x))};begin(GM.mcoin.T,()=>info);play1(x.c)}
/* ══ 8 👑 拼音 王國（Crazy Kingdom）══ */
const KR=[['🪵','木材'],['👥','人民'],['😊','快樂'],['🪙','黃金']];
/* 第六十四次（第六十一次 第 3 點：以前 只 是 按 對／錯）➜ 使者 拿著 字 **一直 走 向 城門**（走到 ＝ 時間 到）；手指 把 **拉桿 往 上 推 ＝ 開門（唸 對 了）、往 下 拉 ＝ 關門（唸 錯 了）**；判斷 對 ＝ 四種 資源 真的 增加（數字 會 飛）*/
function qKing(){const x=pickW(()=>true),alt=R(near(x,'v',2).concat(near(x,'on',2),near(x,'co',2))),right=!alt||Math.random()<.5,au=right?x.c:alt.c;G.kr=G.kr||[60,60,60,60];
  const info=inf(x,{tip:right?'使者 唸 的 就是 <b class="en">'+x.w+'</b>（唸 對 了）':'使者 唸 成 <b class="en">'+alt.w+'</b>，不是 '+x.w});
  B().innerHTML=reTag()+'<div class="king">'+KR.map((r,k)=>'<div class="res" data-k="'+k+'">'+r[0]+' '+r[1]+'<i style="width:'+G.kr[k]+'%"></i></div>').join('')+'</div><div class="gq">使者 唸 🔊…「'+x.w+'」唸 得 對 嗎？<b>推 拉桿</b> 決定 開 不 開 城門</div>'+
    '<div class="kgd" data-real="lever"><div class="kroad"><div class="kenv" id="kenv"><span>🤴</span><b class="en">'+x.w+'</b></div><div class="kgate" id="kgate"><i></i><i></i></div></div><div class="klev" id="klev"><div class="klt">⬆ 開門<small>唸 對 了</small></div><div class="kslot"><div class="kknob" id="kknob">✋</div></div><div class="klb">⬇ 關門<small>唸 錯 了</small></div></div></div>';B().appendChild(earBtn(au));
  const kn=$('#kknob'),sl=kn.parentNode,env=$('#kenv'),gate=$('#kgate'),me=G,q=G.q,dur=GM.mking.T*(SLOW>1?1.5:1)*1000;let y0=null,off=0,t0=0;
  (function walk(now){if(G!==me||G.q!==q||G.lock===q)return;if(!t0)t0=now;if(PAUSED)t0+=16;const f=Math.min(1,(now-t0)/dur);env.style.left=(4+f*58)+'%';requestAnimationFrame(walk)})(performance.now());
  const decide=open=>{if(!G||G!==me||G.lock===G.q)return;const ok=open===right;kn.style.transform='translateY('+(open?-1:1)*sl.clientHeight*.36+'px)';gate.classList.add(open?'open':'shut');if(open)env.classList.add('in');else env.classList.add('stop');
    G.kr=G.kr.map(v=>Math.max(5,Math.min(100,v+(ok?8:-10))));B().querySelectorAll('.res').forEach((r,k)=>{r.querySelector('i').style.width=G.kr[k]+'%';const c=ctr(r);fx(ok?'＋8':'－10',c[0]-20,c[1]-30,ok?'#2EE59D':'#FF6B6B')});
    setTimeout(()=>G===me&&answer(ok,Object.assign(info,{yours:ok?undefined:(open?'⬆ 開門（唸 對 了）':'⬇ 關門（唸 錯 了）')})),window.__PHFAST?1:650)};
  kn.style.touchAction='none';kn.onpointerdown=e=>{if(G.lock===G.q)return;y0=e.clientY;kn.setPointerCapture(e.pointerId)};
  kn.onpointermove=e=>{if(y0==null)return;const lim=sl.clientHeight*.36;off=Math.max(-lim,Math.min(lim,e.clientY-y0));kn.style.transform='translateY('+off+'px)'};
  kn.onpointerup=()=>{if(y0==null)return;y0=null;const lim=sl.clientHeight*.36;if(off<-lim*.6)decide(true);else if(off>lim*.6)decide(false);else{kn.style.transform='';off=0;sl.classList.remove('hint');void sl.offsetWidth;sl.classList.add('hint')}};
  G.hk={ok:()=>decide(right),no:()=>decide(!right)};begin(GM.mking.T,()=>info);play1(au)}
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

/* ══ 2026-11-18 第六十次 老師 3-(2)C、3-(3)：⏱️ 你 來 拼 ＝ 限時 學習 遊戲 ══
 * 每 題 30 秒、愈 快 答對 分數 愈 高；不 看 提示 答對 ✖5、按〔💡 提示〕（? 下面 出現 注音／KK／IPA）以後 答對 ✖1。
 * 兩 種 畫面：⚡ 音素 解碼 競速（新版 地圖 的 樣子：每 個 ? 下面 4 個 選項）、🧱 聲音 積木 衝刺（第三 版 的 樣子：3 排 積木）；答錯 ＝ 綠底 答錯頁、答對 ＝ 整個 字 唸 兩次。*/
function srPick(){const P=pracPool().filter(z=>z.c!=='無'&&AV.has(z.x.c)&&!BDS.has(z.x.c));G.used=G.used||new Set();
  if(G.rq&&G.rq.length){const k=G.rq.findIndex(r=>r.at<=G.q);if(k>=0){const r=G.rq.splice(k,1)[0],y=P.find(z=>z.x===r.x);if(y){G.re=1;return y}}}G.re=0;
  let y=null;for(let t=0;t<40;t++){y=R(P);if(!G.used.has(y.x.w))break}G.used.add(y.x.w);return y}
const SRNM={o:'字首 子音',v:'母音',c:'字尾 子音'};
function srHint(y,k){const sp=specOfMap(y.o,y.v,y.c),S=parse(sp)[0],i=k==='o'?0:k==='v'?(y.o?1:0):(y.o?2:1),b=S[i];return b?b.ch.map(c=>c.sil?'':tileHTML(c.t,b.coda)).join(''):''}
function srLab(k,x){return x==='無'?'—':k==='v'?vLab(x):x}
function qSR(st){const y=srPick(),info=inf(y.x,{twice:1,tip:''}),S=G.sr={y,st,put:{o:null,v:null,c:null},hint:0,op:{}};const ks=['o','v','c'].filter(k=>k!=='o'||y.o);
  ks.forEach(k=>{const n=st==='2'?4:6,L=m3Opts(y,k).filter(x=>x!==y[k]);S.op[k]=SH([y[k]].concat(L.slice(0,n-1)))});   /* 第六十一次 老師 2-(3)A：以前 洗牌 以後 才 切 ＝ 正確 答案 會 被 切掉 ➜ 一定 放 進去 */
  const draw=()=>{const full=ks.every(k=>S.put[k]!=null);
    B().innerHTML=reTag()+'<div class="srw sr'+st+'"><div class="srtop"><button class="srear" id="srEar">🔊 再 聽 一次</button><span class="srmul'+(S.hint?' lo':'')+'">'+(S.hint?'💡 看了 提示：答對 ✖1':'🔥 不 看 提示：答對 ✖5')+'</span><button class="srhint" id="srHint"'+(S.hint?' disabled':'')+'>💡 提示</button></div>'+
      '<div class="srslots">'+ks.map(k=>{const v=S.put[k];return '<div class="srs '+(k==='v'?'v':'c')+(v!=null?' full':'')+'" data-srs="'+k+'"><small>'+SRNM[k]+'</small><b class="en">'+(v==null?'？':srLab(k,v))+'</b>'+(S.hint?'<span class="srht">'+srHint(y,k)+'</span>':'')+
        (st==='2'?'<div class="srop">'+S.op[k].map(x=>'<button class="'+(S.put[k]===x?'on':'')+'" data-sr="'+k+'" data-v="'+x+'">'+srLab(k,x)+'</button>').join('')+'</div>':'')+'</div>'}).join('')+
        (S.put.v&&/_e$/.test(S.put.v)?'<div class="srs g full"><small>不 發音</small><b class="en">e</b></div>':'')+'</div>'+
      (st==='3'?ks.map(k=>'<div class="srrow"><span class="srl '+(k==='v'?'v':'c')+'">'+SRNM[k]+'</span>'+S.op[k].map(x=>'<button class="srb '+(k==='v'?'v':'c')+(S.put[k]===x?' on':'')+'" data-sr="'+k+'" data-v="'+x+'">'+srLab(k,x)+'</button>').join('')+'</div>').join(''):'')+
      '<button class="srgo" id="srGo"'+(full?'':' disabled')+'>✅ 確定</button></div>';
    $('#srEar').onclick=()=>{const b=$('#srEar');b.classList.add('on');say(y.x.c).then(()=>b.classList.remove('on'))};
    $('#srHint').onclick=()=>{S.hint=1;draw()};
    B().querySelectorAll('[data-sr]').forEach(b=>b.onclick=()=>{const k=b.dataset.sr;S.put[k]=b.dataset.v;draw();m3SayParts(m3Part(k,b.dataset.v,y))});
    $('#srGo').onclick=()=>{const bad=ks.filter(k=>S.put[k]!==y[k]);const ok=!bad.length;
      if(!ok){const k=bad[0];info.tip=SRNM[k]+'：你 選 <s class="en">'+srLab(k,S.put[k])+'</s> ➜ 正確 <b class="en">'+srLab(k,y[k])+'</b>'+(k==='c'&&ECUE[y[k]]&&ECUE[S.put[k]]?'（'+y[k]+' '+ECUE[y[k]]+'；'+S.put[k]+' '+ECUE[S.put[k]]+'）':'')}
      answer(ok,Object.assign(info,{hm:S.hint?1:5,yours:ok?undefined:spellOf(S.put.o||'',S.put.v,S.put.c)}))}};
  draw();G.hk={ok:()=>{ks.forEach(k=>S.put[k]=y[k]);draw();$('#srGo').click()},no:()=>{ks.forEach(k=>S.put[k]=y[k]);const k=ks[ks.length-1];S.put[k]=S.op[k].find(x=>x!==y[k]);draw();$('#srGo').click()},hint:()=>$('#srHint').click()};
  begin(30,()=>Object.assign(info,{hm:1,tip:'⏰ 30 秒 到 了：先 聽 一次，再 一格 一格 選'}));if(!window.__PHFAST)say(y.x.c)}
/* ══ 第六十次 老師 10：🔴🔵 子音 母音 結構 遊戲（基礎 ＝ 看 字 ➜ 選 結構；進階 ＝ 只 聽 ➜ 選 結構）══
 * 結構 ＝ 方框 樣子（藍 子音、紅 母音、黃點 ＝ 聲音）。看 字 的 時候 字母 一律 白色（不 給 紅／藍 提示），學生 自己 找 母音。*/
function qCV(adv){const x=pickW(y=>PATS.indexOf(y.pat)>=0&&(adv||G.q<2?y.n<=4:true)),O=SH([x.pat].concat(SH(PATS.filter(p=>p!==x.pat&&Math.abs(p.length-x.pat.length)<=1)).slice(0,2)));
  const info=inf(x,{tip:x.w+' ＝ '+patTxt(specOf(x))+'（'+x.pat.split('').map(c=>c==='C'?'子':'母').join(' ')+'）：先 找 母音，母音 前面 ＝ 字首 子音、後面 ＝ 字尾 子音'});
  B().innerHTML=reTag()+'<div class="cvg '+(adv?'adv':'bas')+'"><div class="gq">'+(adv?'📡 只 聽 🔊 ➜ 這個 字 是 什麼 子音 母音 結構？':'🔦 看 字 ➜ 這個 字 是 什麼 子音 母音 結構？')+'</div>'+
    (adv?'<div class="cvradar"><i></i><i></i><i></i></div>':'<div class="cvword"><span class="en">'+x.w+'</span><i class="cvbeam"></i></div>')+
    '<div class="opts">'+O.map(p=>'<button class="op" data-p="'+p+'" style="padding:4px 8px">'+patDraw(p,x.mg)+'<small class="cvt">'+p.split('').map(c=>c==='C'?'子':'母').join(' ')+'</small></button>').join('')+'</div></div>';
  if(adv)B().appendChild(earBtn(x.c));
  B().querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const ok=b.dataset.p===x.pat;b.classList.add(ok?'ok':'no');answer(ok,Object.assign(info,{yours:ok?undefined:b.dataset.p.split('').map(c=>c==='C'?'子':'母').join(' ')}))});
  G.hk={ok:()=>B().querySelector('[data-p="'+x.pat+'"]').click(),no:()=>[].find.call(B().querySelectorAll('[data-p]'),b=>b.dataset.p!==x.pat).click()};begin(adv?15:12,()=>info);if(adv)play1(x.c)}
Object.assign(GM,{
  srA:{ic:'⚡',nm:'音素 解碼 競速',goal:'聽音 拼字（限時 30 秒）',how:'聽 🔊 ➜ 每 個 <b>？</b> 下面 選 一個 ➜ ✅ 確定；不 看 提示 答對 <b>✖5</b>、看了〔💡 提示〕✖1',T:30,q:()=>qSR('2')},
  srB:{ic:'🧱',nm:'聲音 積木 衝刺',goal:'聽音 拼字（限時 30 秒）',how:'聽 🔊 ➜ 從 3 排 積木 選 字首 子音、母音、字尾 子音 ➜ ✅ 確定；不 看 提示 答對 <b>✖5</b>、看了〔💡 提示〕✖1',T:30,q:()=>qSR('3')},
  cvB:{ic:'🔦',nm:'子母 結構 掃描',goal:'看 字 ➜ 認出 子音 母音 結構（基礎）',how:'看 字 ➜ 先 找 母音 ➜ 選 對 的 <b>方框 樣子</b>（子 母 子、子 子 母 子…）',T:12,q:()=>qCV(0)},
  cvA:{ic:'📡',nm:'子母 聲波 雷達',goal:'聽 字 ➜ 認出 子音 母音 結構（進階）',how:'只 聽 🔊（看不到 字）➜ 選 對 的 <b>方框 樣子</b>',T:15,q:()=>qCV(1)}});
Object.assign(GREV,{srA:['seg','聽到 沒 學 過 的 字 也 拼 得 出來 ＝ 聽寫、作文 都 不 怕'],srB:['seg','聽到 沒 學 過 的 字 也 拼 得 出來 ＝ 聽寫、作文 都 不 怕'],cvB:['cv0','一眼 看出 子音 母音 ＝ 長 的 字 也 知道 從 哪裡 切、怎麼 唸'],cvA:['cv0','聽 得 出 子音 母音 ＝ 聽到 字 就 知道 要 寫 幾 個 方框']});
const GK60=['srA','srB','cvB','cvA'];
function gList(){$('#gList').innerHTML='<button class="gc big" data-g="q25"><span class="gi">📝</span><b>拼音 25 題 闖關</b><span>10 種 遊戲 每 次 抽 5 種、每 種 5 題；組合 每 次 都 不一樣　🏆 最佳 '+LS.g('best_q25',0)+'</span></button>'+
  GK.map(k=>'<button class="gc" data-g="'+k+'"><em>🎯 '+GM[k].goal+'</em><span class="gi">'+GM[k].ic+'</span><b>'+GM[k].nm+'</b><span>'+GM[k].how.replace(/<[^>]+>/g,'')+'</span></button>').join('');
  $('#gList').insertAdjacentHTML('afterbegin','<div class="g60"><b>🆕 限時 挑戰（第六十次）</b>'+GK60.map(k=>'<button class="gc" data-g="'+k+'"><em>🎯 '+GM[k].goal+'</em><span class="gi">'+GM[k].ic+'</span><b>'+GM[k].nm+'</b><span>'+GM[k].how.replace(/<[^>]+>/g,'')+'</span></button>').join('')+'</div>');
  $$('#gList [data-g]').forEach(b=>b.onclick=()=>start(b.dataset.g))}

/* ══ 2026-11-18 第五十九次 老師 2-(1)(2)：🔒 每 5 部 秒懂 動畫 ＝ 一個 階段 ➜ 量身 打造 的「⚔️ 階段 試煉」＋全部 融合 成「25 題 闖關」══
 * 兩 家族：🗺️ 拼音 地圖 秒懂 動畫（SC 31 段 ➜ 6 階段）、📗 從 CVC 到 課本（CHAIN 26 個 字 ➜ 6 階段，每 階段 5 個 字，最後 一 階段 6 個）。
 * 每 一個 試煉：開始 前 ① 🎯 練 什麼（這 5 部 動畫 的 能力）② 💪 學會 對 英文 有 什麼 幫助 ③〔🎬 快速 複習〕＝ 5 部 動畫 的 關鍵 一幕 連 起來 演（約 40 秒）➜ 8 題、每 題 15 秒、守護者 血條、🔥 連對、👑 最後 一題 ✖2；
 * 題目 只 考 這 5 部 動畫 教 的（拼音 地圖 ＝ 每 一段 自己 的 隨堂 測驗 題型；課本 字 ＝ 數 聲音、第一個／最後 一個 聲音、聽 ➜ 拼、看 ➜ 讀、從 CVC 加了 哪 一塊）。
 * 25 題 闖關：6 階段 平均 出、每 次 題目 不同（跟 上一次 的 題目 錯開）；**上 一次 答錯 的 ＝ 這 一次 先 出「類似 題」**（同 一種 題型、同 一段／同 一階段 換 一個 字），答對 了 才 從 錯題 庫 拿掉；
 * 答錯 ＝ 綠底 答錯頁（noPage）；做完 ＝ 📊 能力 分析（每 一種 能力 ✅ 幾 ／ 幾）＋📒 錯題 聽完 才 能 再 玩。研究：間隔 重複 與 提取 練習（Adesope 等 2017 後設分析 https://doi.org/10.3102/0034654316689306 ；Cepeda 等 2006 https://doi.org/10.1037/0033-2909.132.3.354 ）；沒有 打開 原文 核對 數字。*/
const CHW=Object.keys(CHAIN).filter(w=>w.indexOf(' ')<0);
/* 2026-11-18 第六十一次 老師 5（對）：照「學習 主題」分 7 關（不再 每 5 部 一關）；數字 ＝ SC 的 第幾 段（從 0 開始），名字 ＝ STGN */
const STGM=[[0,1,2],[3,4,5,23],[14,15,16],[6,7,8,9,10,11,12,13,21],[17,18,19,20,22],[24,25,29,30],[26,27,28]],
  STGN=['聲音 和 字母','CVC 短 母音','子音 群（bl st str）','兩個 字母 一個 聲音','唸 名字 的 母音＋母音 組合','音節（長 的 字）','一 字母 多 聲音'],STGB=[[0,5],[5,10],[10,15],[15,20],[20,26]].concat([]);
const STB=[CHW.slice(0,5),CHW.slice(5,10),CHW.slice(10,15),CHW.slice(15,20),CHW.slice(20,26)];
const SKM={zy:'👂 注音 ↔ 字母',spell:'✏️ 聽音 拼字',spellB:'✏️ 聽音 拼字',count:'👂 數 聲音',part:'🔁 換 一個 方框',dig1:'👯 兩個 字母 一個 聲音',on:'➕ 字首 子音 群',co:'🔚 字尾 子音 群',magic:'🪄 magic e',team:'👫 兩個 母音 字母',syl:'🪜 音節',many:'🎨 一 字母 多 聲音',mix:'🏆 綜合',readA:'👀 看字 讀音',cv:'🔴🔵 子音／母音',
  bsp:'✏️ 聽音 拼字',bcnt:'👂 數 聲音',bfst:'👂 第一個 聲音',blst:'👂 最後 一個 聲音',brd:'👀 看字 讀音',badd:'🧩 從 CVC 加 一塊'};
function stgName(f,i){return f==='m'?'🗺️ 第 '+(i+1)+' 關：'+STGN[i]:'📗 課本 單字 第 '+(i+1)+' 階段'}
function stgSegs(i){return STGM[i].filter(j=>SC[j]&&SC[j].k!=='chain')}
function stgSkills(f,i){if(f==='m')return [...new Set(stgSegs(i).map(j=>SKM[SC[j].qz]||SC[j].t))];return ['👂 數 聲音、第一個／最後 一個 聲音（音素 覺察）','👀 看字 讀音（拼讀）','✏️ 聽音 拼字（拼字）','🧩 從 會 的 CVC 加 一塊 變成 課本 字']}
function stgHelp(f,i){return f==='m'?'看到 沒 學 過 的 字 自己 會 唸、聽到 新 的 字 自己 會 拼 ＝ 自己 學 英文 的 鑰匙':'課本 的 字 不用 死背：拆 成 聲音 ➜ 字母，看 得 懂、唸 得 出、拼 得 對'}
/* 課本 字 的 題目 */
const ltrOf=s=>s.replace(/[.|]|!?=[a-z0-9]+|~|!/g,'');
function bkFinal(w){const C=CHAIN[w];return {s:C[C.length-1][0],au:C[C.length-1][1]}}
function bkNear(word){const v='aeiou',o=new Set(),sw={b:'d',d:'b',p:'b',t:'d',m:'n',n:'m',f:'v',s:'z',k:'g',g:'k',c:'k',h:'n',r:'l',l:'r',y:'j',w:'v',th:'t',sh:'s',ch:'sh'};
  for(let i=0;i<word.length;i++){if(v.indexOf(word[i])>=0){v.split('').filter(x=>x!==word[i]).forEach(x=>o.add(word.slice(0,i)+x+word.slice(i+1)))}}
  const f2=word.slice(0,2);if(sw[f2])o.add(sw[f2]+word.slice(2));if(sw[word[0]])o.add(sw[word[0]]+word.slice(1));const l=word.slice(-1);if(sw[l])o.add(word.slice(0,-1)+sw[l]);
  o.delete(word);return SH([...o])}
function boxL(b){return b.ch.filter(c=>!c.sil).map(c=>c.l).join('')}
function bkMake(kind,w,pool){const F=bkFinal(w),S=parse(F.s),flat=[].concat(...S).filter(b=>b.type!=='g'),info={spec:F.s,au:F.au,w:ltrOf(F.s),zh:(BKZH[w]||'')},others=SH(pool.filter(x=>x!==w));
  if(kind==='bsp'){const O=SH([info.w].concat(bkNear(info.w).slice(0,2)));return {k:kind,q:'🔊 聽 ➜ 選 對 的 拼法',au:F.au,O,ans:info.w,key:kind+w,info:Object.assign(info,{tip:'聽 每 一個 聲音：'+patTxt(F.s)})}}
  if(kind==='bcnt'){const n=countOf(F.s).n;return {k:kind,q:'🔊 聽 ➜ 這個 字 有 幾 個 聲音？',au:F.au,O:SH([n,n-1,n+1].filter(x=>x>0).map(String)),ans:String(n),key:kind+w,info:Object.assign(info,{tip:info.w+' ＝ <b>'+n+' 個 聲音</b>（一個 聲音 一個 黃點）'})}}
  if(kind==='bfst'||kind==='blst'){const b=kind==='bfst'?flat[0]:flat[flat.length-1],a=boxL(b),pick=y=>{const P=[].concat(...parse(bkFinal(y).s)).filter(z=>z.type!=='g');return boxL(kind==='bfst'?P[0]:P[P.length-1])};
    const O=SH([a].concat([...new Set(others.map(pick))].filter(x=>x&&x!==a).slice(0,2)));return {k:kind,q:'🔊 聽 ➜ '+(kind==='bfst'?'第一個':'最後 一個')+' 聲音 是 哪 一個？',au:F.au,O,ans:a,key:kind+w,info:Object.assign(info,{tip:info.w+' 的 '+(kind==='bfst'?'第一個':'最後 一個')+' 聲音 ＝ <b>'+a+'</b>'})}}
  if(kind==='brd'){const ws=[{w:info.w,c:F.au}].concat(others.slice(0,2).map(y=>({w:ltrOf(bkFinal(y).s),c:bkFinal(y).au})));return {k:kind,q:'👀 看 這個 字 ➜ 先 自己 唸 ➜ 哪 一個 🔊 唸 對 了？',au:null,show:F.s,aud:1,O:SH(ws.map(y=>y.w)),ans:info.w,byW:ws,key:kind+w,info:Object.assign(info,{tip:'① 找 母音 ➜ ② 一個 一個 唸 ➜ ③ 合 起來 ＝ <b>'+info.w+'</b>'})}}
  /* badd：從 會 的 那 一塊 加 了 哪 一塊（ca ＋ ? ＝ cat、tur ＋ ? ＝ turtle）*/
  const C=CHAIN[w],a0=ltrOf(C[0][0]),add=info.w.indexOf(a0)===0&&info.w.length>a0.length?info.w.slice(a0.length):null;
  if(!add)return bkMake('bsp',w,pool);
  const adds=[...new Set(others.map(y=>{const c=CHAIN[y],f=ltrOf(bkFinal(y).s),z=ltrOf(c[0][0]);return f.indexOf(z)===0?f.slice(z.length):''}).filter(x=>x&&x!==add))];
  return {k:'badd',q:'🧩 <b class="en">'+a0+'</b> ＋ ？ ＝ 🔊 聽 ➜ 加 哪 一塊？',au:F.au,O:SH([add].concat(adds.slice(0,2))),ans:add,key:'badd'+w,info:Object.assign(info,{tip:'<b>'+a0+'</b> ＋ <b>'+add+'</b> ＝ '+info.w+'：從 你 會 的 那 一塊 開始'})}}
const BKZH={cat:'貓',dog:'狗',sad:'難過的',not:'不',yes:'是',fish:'魚',thin:'瘦的',he:'他',she:'她',no:'不',room:'房間',bedroom:'臥室',bathroom:'浴室',rabbit:'兔子',kitchen:'廚房',dining:'用餐',living:'生活',where:'哪裡',bird:'鳥',turtle:'烏龜',strong:'強壯的',short:'矮的',tall:'高的',tired:'累的',angry:'生氣的',happy:'快樂的'};
const BKK=['bcnt','bfst','blst','bsp','brd','badd'];
/* 一題：家族 f、階段 i、（類似 題）指定 題型 kind／段 seg */
function stgQ(f,i,want){if(f==='m'){const segs=stgSegs(i);let j=want&&want.seg!=null&&segs.indexOf(want.seg)>=0?want.seg:R(segs);QZI=j;const kind=want&&want.kind?want.kind:SC[j].qz;let q=qzMake(kind)||qzMake('spell');q.seg=j;q.stg=i;q.sk=kind;return q}
  const W=STB[i];let w=want&&want.w&&W.indexOf(want.w)>=0?R(W.filter(x=>x!==want.w).concat([want.w])):R(W);const kind=want&&want.kind?want.kind:R(BKK);const q=bkMake(kind,w,[].concat(...STB));q.stg=i;q.sk=q.k;q.bw=w;return q}
function stgRender(q,res){B().innerHTML=stgBoss()+'<div class="gq">'+q.q+'</div>'+(q.show?'<div class="wrow">'+wordHTML(q.show,{dots:0,hideT:1})+'</div>':'')+'<div class="opts'+(q.aud?' aud':'')+'">'+q.O.map((o,k)=>q.aud?'<div class="aop"><button class="op aplay" data-ap="'+k+'">🔊 '+'①②③④'[k]+'</button><button class="op apick" data-o="'+o+'">✅ 選 '+'①②③④'[k]+'</button></div>':'<button class="op'+(/^[㄀-ㄯ一-鿿💨📳🔴🔵]/u.test(o)?' zh':'')+'" data-o="'+o+'">'+(/^[a-z]+$/.test(o)?vRed(o):o)+'</button>').join('')+'</div>';
  if(q.aud)B().querySelectorAll('[data-ap]').forEach(b=>b.onclick=()=>{const y=q.byW.find(z=>z.w===q.O[+b.dataset.ap]);B().querySelectorAll('.aplay').forEach(e=>e.classList.remove('on'));b.classList.add('on');say(y.c).then(()=>b.classList.remove('on'))});
  if(q.au){B().appendChild(earBtn(q.au));play1(q.au)}
  B().querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{if(G.lock===G.q)return;const y=b.dataset.o===q.ans;b.classList.add(y?'ok':'no');if(y){const c=ctr(b);sparks(c[0],c[1],22,'#FFD54A')}res(y,b.dataset.o)});
  G.hk={ok:()=>[].find.call(B().querySelectorAll('[data-o]'),b=>b.dataset.o===q.ans).click(),no:()=>[].find.call(B().querySelectorAll('[data-o]'),b=>b.dataset.o!==q.ans).click()}}
function stgBoss(){const N=G.N||NQ,hp=Math.max(0,100-Math.round(G.ok/N*100));return '<div class="sboss"><span class="sbn">🛡️ '+esc2(G.bossN||'守關 者')+'</span><span class="sbh"><i style="width:'+hp+'%"></i></span><b>'+hp+'</b>'+(G.combo>=2?'<span class="sbf">🔥 連對 '+G.combo+'</span>':'')+'</div>'}
const esc2=s=>String(s).replace(/</g,'&lt;');
function stgOne(){const me=G,f=G.fam,i=G.sq?G.sq[G.q].i:G.stg,want=G.sq?G.sq[G.q].want:null;let q=null;for(let t=0;t<12;t++){q=stgQ(f,i,want);if(!G.keys.has(q.key||q.au+q.ans))break}G.keys.add(q.key||q.au+q.ans);G.cq=q;
  stgRender(q,(ok,yours)=>{G.sk[q.sk]=G.sk[q.sk]||[0,0];G.sk[q.sk][1]++;if(ok)G.sk[q.sk][0]++;stgBank(G.fam,q,ok,want);answer(ok,Object.assign({},q.info,ok?{}:{yours}))});begin(15,()=>Object.assign({},q.info))}
/* 錯題 庫：答錯 ＝ 記 下來（題型＋段／階段＋字）；下 一次 25 題 闖關 先 出 類似 題；類似 題 答對 ＝ 拿掉 */
function stgBank(f,q,ok,want){const k='wb_'+f;let L=LS.g(k,[]);const it={kind:q.sk,i:q.stg,seg:q.seg,w:q.bw};const same=x=>x.kind===it.kind&&x.i===it.i&&(f==='m'?x.seg===it.seg:true);
  if(!ok){if(!L.some(same))L.push(it)}else if(want)L=L.filter(x=>!same(x));LS.s(k,L.slice(-20))}
function stgStart(f,i,q25){const n=q25?25:8;const T=q25?{ic:'📝',nm:(f==='m'?'🗺️ 拼音 地圖':'📗 課本 單字')+' 25 題 闖關',goal:(f==='m'?'7':'5')+' 個 階段 全部 融合（上 一次 錯 的 先 出 類似 題）',how:''}:{ic:'⚔️',nm:stgName(f,i)+'：試煉',goal:f==='b'?'數 聲音・看字 讀音・聽音 拼字':stgSkills(f,i).slice(0,3).join('・'),how:''};
  const k='st'+f+(q25?'25':i);GM[k]=Object.assign({T:15,q:stgOne},T);
  if(typeof SCON!=='undefined'&&SCON&&!SCID&&typeof scLogin==='function'&&!window.__PHNOLOGIN){scLogin(function(){SCH.close();if(typeof scBar==='function')scBar();stgStart(f,i,q25)});return}
  G={k,q:0,ok:0,score:0,combo:0,res:[],wrong:[],Q:[],t0:Date.now(),lock:-1,tw:0,N:n,fam:f,stg:i,keys:new Set(),sk:{},stg9:1,bossN:q25?'25 題 闖關 守護者':'第 '+(i+1)+' 關 守護者'};TOK++;
  if(q25){const W=SH(LS.g('wb_'+f,[])).slice(0,8),last=new Set(LS.g('lk_'+f,[])),ns=(f==='m'?STGM:STB).length,seq=W.map(w=>({i:w.i,want:w}));let r=0;while(seq.length<n){seq.push({i:r%ns,want:null});r++}
    G.sq=[].concat(seq.slice(0,W.length),SH(seq.slice(W.length)));G.keys=last;G.re=W.length}
  $('#game').hidden=false;$('#gq').textContent='';$('#gt').textContent=T.ic+' '+T.nm;$('#gsc').textContent='⭐ 0';
  const sk=q25?['🗺️／📗 6 個 階段 的 全部 能力']:stgSkills(f,i),wb=LS.g('wb_'+f,[]).length;
  B().innerHTML='<div class="pnl stgin" style="padding:18px 24px;text-align:center;max-width:960px"><div style="font-size:60px">'+T.ic+'</div><h2 class="st">'+T.nm+'</h2>'+
    '<div class="stgk"><b>🎯 這 一關 練 什麼？</b>'+sk.map(s=>'<span>'+s+'</span>').join('')+'</div><div class="cap">💪 學會 了：'+stgHelp(f,i)+'</div>'+(q25&&wb?'<div class="cap" style="color:#FFB4A8">🔁 上一次 錯 的 '+Math.min(8,wb)+' 題，這次 會 先 出「類似 題」</div>':'')+
    '<div class="cap" style="font-size:20px;color:#BFD0FF">📝 '+n+' 題　⏱ 每 題 15 秒　🔥 連對 3 題 ✖2　👑 最後 一題 ✖2　🛡️ 答對 ＝ 打掉 守護者 的 血</div>'+
    '<div class="ctl"><button class="btn gold" id="stRev">🎬 快速 複習（先 看 重點）</button><button class="btn go" id="gGo" style="font-size:30px;min-height:70px;padding:10px 40px">▶ 開始 '+(q25?'闖關':'試煉')+'！</button></div></div>';
  $('#stRev').onclick=()=>stgReview(f,q25?null:i);
  $('#gGo').onclick=async()=>{TOK++;const o=$('#capAni');if(o)o.hidden=true;for(const n of ['3','2','1','GO!']){B().innerHTML='<div class="big3">'+n+'</div>';await wait(window.__PHFAST?5:650)}next()};
  if(!window.__PHFAST&&!LS.g('strev_'+k,0)){LS.s('strev_'+k,1);stgReview(f,q25?null:i)}if(window.__PHAUTO)$('#gGo').click()}
/* 🎬 快速 複習 ＝ 這 一階段 每 一部 動畫 的 關鍵 幕（拼音 地圖 ＝ 每 段 最後 2 幕；課本 字 ＝ 從 會 的 一塊 ➜ 課本 字）*/
function stgReview(f,i){let fr=[];const IS=i==null?(f==='m'?STGM:STB).map((_,k)=>k):[i];
  IS.forEach(k=>{if(f==='m')stgSegs(k).forEach(j=>{const S=SC[j];if(S.ca)fr=fr.concat(S.ca.slice(-(i==null?1:2)))});else STB[k].slice(0,i==null?1:5).forEach(w=>{const C=CHAIN[w];fr.push({t:ltrOf(C[0][0])+' ➜ '+ltrOf(C[C.length-1][0]),s:C[C.length-1][0],p:1,a:C[C.length-1][1]})})});
  capAni({cap:'🎬 快速 複習：'+(i==null?'全部 階段':stgName(f,i)),ca:fr})}
/* 結束 頁 多 一塊：📊 能力 分析 */
const _endOld=end;end=async function(){const g=G;const p=_endOld();if(g&&g.stg9){if(g.sq)LS.s('lk_'+g.fam,[...g.keys].slice(-60));const pn=B().querySelector('.pnl');if(pn){const K=Object.keys(g.sk);pn.insertAdjacentHTML('afterbegin','<div class="skan"><div class="skt">📊 能力 分析</div>'+K.map(k=>{const v=g.sk[k],r=Math.round(v[0]/v[1]*100);return '<div class="skr"><span>'+(SKM[k]||k)+'</span><span class="skb"><i class="'+(r>=80?'hi':r>=60?'mid':'lo')+'" style="width:'+Math.max(4,r)+'%"></i></span><b>'+v[0]+' ／ '+v[1]+'</b></div>'}).join('')+'<div class="skn">'+(K.some(k=>g.sk[k][0]<g.sk[k][1])?'💡 紅色 的 能力：下 一次 25 題 闖關 會 先 出 類似 題 幫 你 練':'🎉 每 一種 能力 都 全對！')+'</div></div>')}
    const ag=$('#again');if(ag)ag.onclick=()=>stgStart(g.fam,g.stg,!!g.sq)}return p};
/* 遊戲 列表 多 兩區：⚔️ 階段 試煉（照 動畫 順序）＋兩個 25 題 闖關 */
const _gListOld=gList;gList=function(){_gListOld();$('#gList').insertAdjacentHTML('afterbegin','<div class="stgL"><h3>⚔️ 階段 試煉：每 5 部 動畫 一關（先 看 動畫 ➜ 再 闖關）</h3>'+
  '<div class="stgR"><b>🗺️ 拼音 地圖 動畫</b>'+STGM.map((s,i)=>'<button class="stb" data-stg="m'+i+'">第 '+(i+1)+' 關<small>'+STGN[i]+'</small></button>').join('')+'<button class="stb big" data-stg="m25">📝 25 題 闖關</button></div>'+
  '<div class="stgR"><b>📗 從 CVC 到 課本</b>'+STB.map((W,i)=>'<button class="stb" data-stg="b'+i+'">第 '+(i+1)+' 關<small>'+W.slice(0,3).join(' ')+'…</small></button>').join('')+'<button class="stb big" data-stg="b25">📝 25 題 闖關</button></div></div>')};
document.addEventListener('click',e=>{const b=e.target.closest('[data-stg]');if(!b)return;const v=b.dataset.stg,f=v[0],r=v.slice(1);stgStart(f,r==='25'?0:+r,r==='25')});
/* 每 一階段 最後 一部 動畫 演完 ＝ 隨堂 測驗 旁邊 多〔⚔️ 第 N 關 試煉〕 */
function stgOfSeg(j){for(let i=0;i<STGM.length;i++)if(STGM[i].indexOf(j)>=0)return i;return -1}

/* ══ 2026-11-18 第六十次：〔⚡ 現場任務〕🗺️ 拼音 地圖 遊戲（set 'pm'，老師 選 一個 遊戲 cfg.pk）══
 * 網址 ?live=0304（現場任務 平板 自己 帶 過來）：登入 ➜ 每 0.9 秒 看 rooms/0304/cr；老師 開 ＝ 馬上 開始 那 一個 遊戲（限時 遊戲、子母 結構 一回 10 題；⚔️ 階段 試煉 8 題、25 題 闖關 25 題）；
 * 每 答 一題 ＝ 寫 crp/5碼（大螢幕 即時 排行榜：答了 幾題、對 幾題、💯 正確率）；老師 時間 到（xForce）或 結束 ＝ 答了 幾題 就 送 幾題。測試 開關 window.__PHLIVE（不 連 真的 Firebase）*/
let MP=null;
const MLDB=()=>window.__PHLIVE||(typeof LDB!=='undefined'&&LDB.on&&LDB.on()?LDB:null);
function mPub(g){const D=MLDB();if(!MP||!D||!g||!g.live||typeof SCID==='undefined'||!SCID)return;const n=g.res.length,o={n,ok:g.ok,s:n?Math.round(g.ok/n*1000)/10:0,g:'pm',gp:g.score};
  if(typeof XLV!=='undefined'&&D===LDB)XLV.prog(MP.room,MP.t,SCID,o);else D.set('rooms/'+MP.room+'/crp/'+SCID,Object.assign(o,{t:MP.t}))}
function mMsg(t,extra){$('#game').hidden=false;B().innerHTML='<div class="pnl" style="padding:26px 30px;text-align:center;max-width:900px"><div style="font-size:72px">🗺️</div><h2 class="st">'+t+'</h2>'+(extra||'')+'</div>'}
function mStart(pk){const st=/^st([mb])(\d+)$/.exec(pk);if(st)stgStart(st[1],st[2]==='25'?0:+st[2],st[2]==='25');else if(GM[pk])start(pk);else return;
  if(G){G.live=1;if(!st)G.N=10}const go=$('#gGo');if(go)go.click()}
window.xForce=function(){const g=G;if(!g||!g.live||g.sent)return false;if(g.t)g.t.stop();TOK++;rec(g);mPub(g);G=null;$('#fb').hidden=true;mMsg('⏰ 時間 到！','<div class="cap">答了 '+g.res.length+' 題，對 '+g.ok+' 題，成績 送 給 老師 了。👀 抬頭 看 大螢幕</div>');return true};
function mOn(v){if(!MP)return;if(typeof XLV!=='undefined')try{XLV.cfg(v)}catch(e){}
  if(!v||!v.on||v.set!=='pm'||Date.now()-(+v.t||0)>4*36e5){if(G&&G.live&&!G.sent&&G.res.length){const g=G;rec(g);mPub(g);G=null;mMsg('✅ 老師 結束 了，謝謝！','<a class="btn go" href="../live/index.html">⬅ 回 現場任務</a>')}
    else if(!G||!G.live)mMsg('⏳ 等 老師 開始 拼音 地圖 遊戲…');return}
  if(v.t!==MP.t){MP.t=v.t;mStart(v.pk||'srA')}}
function mInit(){const m=/[?&]live=(\d{4})/.exec(location.search);if(!m)return;MP={room:m[1],t:0};document.body.classList.add('crm');
  const go=()=>{const D=MLDB();if(!D){mMsg('📶 現場任務 還沒 開');return}mMsg('⏳ 等 老師 開始 拼音 地圖 遊戲…');D.poll('rooms/'+MP.room+'/cr',900,mOn)};
  if(typeof SCON!=='undefined'&&SCON&&(typeof SCID==='undefined'||!SCID)&&typeof scLogin==='function'&&!window.__PHNOLOGIN){scLogin(function(){SCH.close();if(typeof scBar==='function')scBar();go()});return}go()}
setTimeout(mInit,0);

/* ══ 2026-11-18 第六十一次 老師 2-(3)：「磁浮 打磚塊 根本 是 假 的」➜ 真的 打磚塊 ══
 * 聽 🔊 ➜ 左右 拖 球拍、手指 往上 拉 ＝ 瞄準（虛線 ＝ 球 會 怎麼 跑、撞 牆 會 反彈）➜ 放開 ＝ 發射；球 真的 會 飛、撞 牆 反彈、撞 灰色 磚 會 碎（不算 答案）；
 * 第一個 打到 的「字尾 磚」＝ 你 的 答案：對 ＝ 爆炸、錯 ＝ 裂開。掉 到 球拍 下面 ＝ 球 回到 球拍，再 瞄 一次（不 扣分）。時間 20 秒。*/
/* 聽 起來 一樣 的 字尾（ch／tch、k／ck、l／ll、s／ss、f／ff）不 可以 一起 當 選項 */
const SAME=c=>({tch:'ch',ck:'k',ll:'l',ss:'s',ff:'f',zz:'z'})[c]||c;
function boQ(){const x=pickW(y=>y.co.length&&!y.mg);const co=x.co.join('');const all=[...new Set(QW.filter(y=>!y.mg).map(y=>y.co.join('')).filter(Boolean))];
  const sc=y=>(y[0]===co[0]?2:0)+(y.slice(-1)===co.slice(-1)?2:0)+(y.length===co.length?1:0),HARD=a=>/^(th|s|ss|f|ff)$/.test(a);
  const O=SH([co].concat(SH(all.filter(y=>y!==co&&SAME(y)!==SAME(co)&&!(HARD(co)&&HARD(y)&&(co==='th')!==(y==='th')))).sort((a,b)=>sc(b)-sc(a)).slice(0,4)));
  const info=inf(x,{tip:'字尾 是 <b class="en">'+co+'</b>（'+x.ct.length+' 個 聲音）'});
  B().innerHTML=reTag()+'<div class="gq">🔊 聽 ➜ 用 球 打碎 寫著 <b>字尾</b> 的 磚塊</div><div class="arena bo" id="ar"><canvas id="boc"></canvas><div class="bohint" id="boh">👆 拖 球拍 ＋ 往上 拉 瞄準 ➜ 放開 發射</div></div>';B().appendChild(earBtn(x.c));
  const ar=$('#ar'),cv=$('#boc'),cx=cv.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1),W=ar.clientWidth,Hh=ar.clientHeight;cv.width=W*dpr;cv.height=Hh*dpr;cv.style.width=W+'px';cv.style.height=Hh+'px';cx.scale(dpr,dpr);
  const me=G,q=me.q,bw=(W-40)/O.length,bh=Math.max(54,Hh*.13),R0=Math.max(12,W*.014);
  const bricks=O.map((o,i)=>({x:20+i*bw+4,y:60,w:bw-8,h:bh,o,lab:1,hp:1})).concat(Array.from({length:O.length*2},(_,i)=>({x:20+(i%O.length)*bw+4+(i>=O.length?bw/2:0)*0,y:60+bh+12+Math.floor(i/O.length)*(bh*.55+8),w:bw-8,h:bh*.55,lab:0,hp:1})).filter((b,i)=>i%3!==1));
  const pad={x:W/2,w:Math.max(120,W*.17),y:Hh-34},ball={x:W/2,y:Hh-34-R0-2,vx:0,vy:0,on:1},aim={x:W/2,y:Hh*.4,act:0};let done=0,parts=[];
  function path(){/* 瞄準 虛線：從 球 出發，撞 左右 牆 反彈，到 第一個 磚 為止 */let px=ball.x,py=ball.y,dx=aim.x-ball.x,dy=Math.min(-30,aim.y-ball.y);const L=Math.hypot(dx,dy);dx/=L;dy/=L;const pts=[[px,py]];
    for(let s=0;s<900;s++){px+=dx*4;py+=dy*4;if(px<R0||px>W-R0){dx=-dx;px=Math.max(R0,Math.min(W-R0,px));pts.push([px,py])}if(py<R0)break;if(bricks.some(b=>b.hp&&px>b.x&&px<b.x+b.w&&py>b.y&&py<b.y+b.h))break}pts.push([px,py]);return pts}
  function hit(b){if(done)return;b.hp=0;for(let k=0;k<26;k++)parts.push({x:b.x+b.w/2,y:b.y+b.h/2,vx:(Math.random()-.5)*9,vy:(Math.random()-.8)*9,l:1,c:b.lab?(b.o===co?'#FFD54A':'#FF4D4D'):'#9AA7B5'});
    if(!b.lab)return;done=1;const ok=b.o===co;if(!ok){b.hp=1;b.bad=1}const r=ar.getBoundingClientRect();if(ok)sparks(r.left+b.x+b.w/2,r.top+b.y+b.h/2,30,'#FFD54A');answer(ok,Object.assign(info,{yours:ok?undefined:b.o}))}
  function draw(){cx.clearRect(0,0,W,Hh);const g=cx.createLinearGradient(0,0,0,Hh);g.addColorStop(0,'#0B1440');g.addColorStop(1,'#03061A');cx.fillStyle=g;cx.fillRect(0,0,W,Hh);
    bricks.forEach(b=>{if(!b.hp)return;cx.fillStyle=b.lab?(b.bad?'#B3261E':'#FF8A1F'):'#3A4566';cx.strokeStyle=b.lab?'#FFE0B2':'#5C6890';cx.lineWidth=3;cx.beginPath();cx.roundRect(b.x,b.y,b.w,b.h,10);cx.fill();cx.stroke();
      if(b.lab){cx.fillStyle='#fff';cx.font='800 '+Math.round(b.h*.55)+'px Andika, sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(b.o,b.x+b.w/2,b.y+b.h/2+2)}});
    if(ball.on&&aim.act){const P=path();cx.setLineDash([8,10]);cx.strokeStyle='rgba(255,224,122,.85)';cx.lineWidth=4;cx.beginPath();P.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke();cx.setLineDash([])}
    cx.fillStyle='#7FD4FF';cx.shadowColor='#7FD4FF';cx.shadowBlur=18;cx.beginPath();cx.roundRect(pad.x-pad.w/2,pad.y,pad.w,16,8);cx.fill();cx.shadowBlur=0;
    cx.fillStyle='#fff';cx.shadowColor='#FFE07A';cx.shadowBlur=22;cx.beginPath();cx.arc(ball.x,ball.y,R0,0,7);cx.fill();cx.shadowBlur=0;
    parts=parts.filter(p=>(p.l-=.025)>0);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.35;cx.globalAlpha=p.l;cx.fillStyle=p.c;cx.fillRect(p.x,p.y,6,6)});cx.globalAlpha=1}
  function step(){if(G!==me||me.q!==q||!document.body.contains(cv))return;
    if(!ball.on){for(let s=0;s<3;s++){ball.x+=ball.vx/3;ball.y+=ball.vy/3;if(ball.x<R0||ball.x>W-R0){ball.vx=-ball.vx;ball.x=Math.max(R0,Math.min(W-R0,ball.x))}if(ball.y<R0){ball.vy=Math.abs(ball.vy)}
        for(const b of bricks){if(b.hp&&ball.x>b.x-R0&&ball.x<b.x+b.w+R0&&ball.y>b.y-R0&&ball.y<b.y+b.h+R0){const ox=Math.min(ball.x-(b.x-R0),b.x+b.w+R0-ball.x),oy=Math.min(ball.y-(b.y-R0),b.y+b.h+R0-ball.y);if(ox<oy)ball.vx=-ball.vx;else ball.vy=-ball.vy;hit(b);break}}
        if(ball.vy>0&&ball.y>pad.y-R0&&ball.y<pad.y+16&&Math.abs(ball.x-pad.x)<pad.w/2+R0){const t=(ball.x-pad.x)/(pad.w/2);const sp=Math.hypot(ball.vx,ball.vy);ball.vx=sp*Math.sin(t*1.05);ball.vy=-sp*Math.cos(t*1.05)}
        if(ball.y>Hh+R0){ball.on=1;ball.vx=ball.vy=0}}}
    if(ball.on){ball.x=pad.x;ball.y=pad.y-R0-2}draw();requestAnimationFrame(step)}
  const pt=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  cv.addEventListener('pointerdown',e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(z){}const p=pt(e);if(p[1]>Hh*.62)pad.x=Math.max(pad.w/2,Math.min(W-pad.w/2,p[0]));aim.act=1;aim.x=p[0];aim.y=p[1]});
  cv.addEventListener('pointermove',e=>{if(!aim.act)return;const p=pt(e);if(p[1]>Hh*.62){pad.x=Math.max(pad.w/2,Math.min(W-pad.w/2,p[0]))}aim.x=p[0];aim.y=Math.min(p[1],pad.y-40)});
  const fire=()=>{if(!aim.act)return;aim.act=0;if(!ball.on||done)return;let dx=aim.x-ball.x,dy=Math.min(-30,aim.y-ball.y);const L=Math.hypot(dx,dy),sp=Math.max(9,Hh*.018);ball.vx=dx/L*sp;ball.vy=dy/L*sp;ball.on=0;const h=$('#boh');if(h)h.style.opacity=0};
  cv.addEventListener('pointerup',fire);cv.addEventListener('pointercancel',()=>{aim.act=0});
  G.boS={ball,bricks,aim};requestAnimationFrame(step);
  G.hk={ok:()=>hit(bricks.find(b=>b.lab&&b.o===co)),no:()=>hit(bricks.find(b=>b.lab&&b.o!==co))};begin(20,()=>info);play1(x.c)}
GM.mco.q=boQ;GM.mco.T=20;GM.mco.how='聽 🔊 ➜ 拖 球拍、往上 拉 <b>瞄準</b>、放開 發射 ➜ 用 球 打碎 寫著 <b>字尾</b> 的 磚塊（灰 磚 只 會 碎，不算 答案）';

/* ══ 第六十一次 老師 2-(3)B：🔦 子母 結構 掃描 ＝ 輸送帶 分類（拖 的 遊戲）══
 * 一個 字 坐在 輸送帶 上 往 右 跑（跑到 盡頭 ＝ 時間 到）➜ 用 手指 把 它 拖 進 對 的「結構 門」（下面 寫 子 母 子…）。看 字：字母 一律 白色，自己 找 母音。*/
function cvSort(){const x=pickW(y=>PATS.indexOf(y.pat)>=0&&(G.q<2?y.n<=4:true)),O=SH([x.pat].concat(SH(PATS.filter(p=>p!==x.pat&&Math.abs(p.length-x.pat.length)<=1)).slice(0,2)));
  const info=inf(x,{tip:x.w+' ＝ '+x.pat.split('').map(c=>c==='C'?'子':'母').join(' ')+'：先 找 母音（紅），母音 前面 ＝ 字首 子音、後面 ＝ 字尾 子音'});
  B().innerHTML=reTag()+'<div class="gq">🔦 把 字 拖 進 對 的 <b>子音 母音 結構</b> 門</div><div class="cvbelt" id="belt"><div class="belt"><i></i></div><div class="crate en" id="crt">'+x.w+'</div></div>'+
    '<div class="gates">'+O.map(p=>'<div class="gate" data-p="'+p+'">'+patDraw(p,x.mg)+'</div>').join('')+'</div>';
  const crt=$('#crt'),belt=$('#belt'),t0=Date.now(),T=GM.cvB.T*1000;let drag=null,done=0;
  (function run(){if(done||!document.body.contains(crt))return;if(!drag){const f=Math.min(1,(Date.now()-t0)/T);crt.style.left=(4+f*78)+'%'}requestAnimationFrame(run)})();
  const fin=g=>{if(done)return;done=1;const ok=g&&g.dataset.p===x.pat;if(g){g.classList.add(ok?'ok':'no');const r=g.getBoundingClientRect();if(ok)sparks(r.left+r.width/2,r.top+r.height/2,24,'#2EE59D')}answer(!!ok,Object.assign(info,{yours:ok||!g?undefined:g.dataset.p.split('').map(c=>c==='C'?'子':'母').join(' ')}))};
  crt.addEventListener('pointerdown',e=>{if(done)return;e.preventDefault();try{crt.setPointerCapture(e.pointerId)}catch(z){}const r=crt.getBoundingClientRect();drag={dx:e.clientX-r.left,dy:e.clientY-r.top};crt.classList.add('drag');crt.style.position='fixed';crt.style.left=r.left+'px';crt.style.top=r.top+'px'});
  crt.addEventListener('pointermove',e=>{if(!drag)return;crt.style.left=(e.clientX-drag.dx)+'px';crt.style.top=(e.clientY-drag.dy)+'px';B().querySelectorAll('.gate').forEach(g=>{const r=g.getBoundingClientRect();g.classList.toggle('hov',e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom)})});
  crt.addEventListener('pointerup',e=>{if(!drag)return;drag=null;crt.classList.remove('drag');const g=[...B().querySelectorAll('.gate')].find(g=>{const r=g.getBoundingClientRect();return e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom});
    if(g){crt.style.display='none';fin(g)}else{crt.style.position='';crt.style.top=''}});
  B().querySelectorAll('.gate').forEach(g=>g.onclick=()=>{});
  G.hk={ok:()=>fin(B().querySelector('.gate[data-p="'+x.pat+'"]')),no:()=>fin([].find.call(B().querySelectorAll('.gate'),g=>g.dataset.p!==x.pat))};begin(GM.cvB.T,()=>info)}
/* ══ 📡 子母 聲波 雷達 ＝ 會 動 的 目標（只 聽）══
 * 雷達 掃描 線 一直 轉；3 個 結構 光點 在 雷達 上 慢慢 飄。聽 🔊 ➜ 趁 光點 還 在 的 時候 點 對 的 那 一個（點到 ＝ 鎖定 ＋ 發射）。*/
function cvRadar(){const x=pickW(y=>PATS.indexOf(y.pat)>=0),O=SH([x.pat].concat(SH(PATS.filter(p=>p!==x.pat&&Math.abs(p.length-x.pat.length)<=1)).slice(0,2)));
  const info=inf(x,{tip:'聽到 '+x.w+' ＝ '+x.pat.split('').map(c=>c==='C'?'子':'母').join(' ')+'（'+x.n+' 個 聲音）'});
  B().innerHTML=reTag()+'<div class="gq">📡 只 聽 🔊 ➜ 鎖定 對 的 <b>子音 母音 結構</b></div><div class="radar" id="rd"><i class="sweep"></i>'+O.map((p,i)=>'<button class="blip" data-p="'+p+'" style="--a:'+(i*120+Math.random()*40)+'deg">'+patDraw(p,x.mg)+'</button>').join('')+'</div>';B().appendChild(earBtn(x.c));
  let done=0;const rd=$('#rd'),t0=Date.now();(function spin(){if(done||!document.body.contains(rd))return;const a=(Date.now()-t0)/90;rd.querySelectorAll('.blip').forEach((b,i)=>{const ang=(i*120+a)*Math.PI/180,rr=30+8*Math.sin(a/40+i);b.style.left=(50+rr*Math.cos(ang))+'%';b.style.top=(50+rr*Math.sin(ang))+'%'});requestAnimationFrame(spin)})();
  rd.querySelectorAll('.blip').forEach(b=>b.onclick=()=>{if(done)return;done=1;const ok=b.dataset.p===x.pat;b.classList.add(ok?'ok':'no');const r=b.getBoundingClientRect();if(ok)sparks(r.left+r.width/2,r.top+r.height/2,26,'#2EE59D');answer(ok,Object.assign(info,{yours:ok?undefined:b.dataset.p.split('').map(c=>c==='C'?'子':'母').join(' ')}))});
  G.hk={ok:()=>rd.querySelector('.blip[data-p="'+x.pat+'"]').click(),no:()=>[].find.call(rd.querySelectorAll('.blip'),b=>b.dataset.p!==x.pat).click()};begin(GM.cvA.T,()=>info);play1(x.c)}
GM.cvB.q=cvSort;GM.cvB.T=14;GM.cvB.how='字 坐在 輸送帶 上 ➜ 用 手指 把 它 <b>拖 進</b> 對 的 結構 門（子 母 子、子 子 母 子…）';
GM.cvA.q=cvRadar;GM.cvA.how='只 聽 🔊 ➜ 在 雷達 上 <b>鎖定</b> 對 的 結構 光點（光點 會 一直 飄）';
