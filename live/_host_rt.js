/* live/_host_rt.js — ⚡ 現場任務 老師大螢幕（live/host.html）。只寫 ES5。要先載入 live/_db.js、live/_common.js、score/qr.js、score/_cer_rt.js；
   網頁裡有 GR（每一組 題目）、LIST（三／四年級 有 哪幾組）、CHAL（挑戰題）、ICON、BASE（到 repo 根目錄）。
   2026-10-18 第十二次 重做（老師 試玩：兩邊 不同步、不知道 怎麼 關 排行榜 開 下一題、音樂 難聽、頒獎 潦草、錯題 分析 要 比照 遊戲；規格 live/CLAUDE.md 最上面）：
   流程（老師 一個 按鈕 一步，按鈕 永遠 在 右下角 同一個 位置、大大的）：
     🔑 密碼 ➜ 設定（① 班級 ② 遊戲 ③ 題目〔三／四年級、句型遊戲＋Review 1〕④ 幾題〔預設 5〕⑤ 挑戰題／干擾）➜〔⚡ 建立 遊戲〕
     ➜ 等人（QR Code、〔📋 複製 網址〕、① ② ③、座號 格子 一格一格 亮）➜〔▶ 開始〕➜ 怎麼玩 ＋ 3、2、1
     ➜ 題目（座號 格子：答了 ＝ 變綠）➜ 時間到／全部 答完 ➜ 公布（長條圖＋✔＋📌 錯題 分析：逐字中文、整句翻譯、💡、自動 唸 3 次）
     ➜〔🏆 看 排行榜〕➜ 前 5 名 ➜〔▶ 下一題〕… ➜〔🏆 頒獎 典禮〕（10 種 風格，沒有 聲音）➜〔📊 全班 錯題 分析〕➜〔🎁 發獎勵 ＋ 記 練習次數〕
   沒有 音樂、沒有 音效（老師 8(5)）；只有 英文 發音（〔🗣 自動 唸：開／關〕）。
   同步：live/_db.js 輪詢（大螢幕 每 寫 一次 m 就 v＋1）。答案 只放在 這一台：題目 送出去 不送 答案，公布 才 送。分數 也是 這一台 算。 */
var H={pw:'',g:4,qg:4,cls:'',game:'classic',sets:{},n:5,int:1,ch:1,x15:0,say:1,code:'',Q:[],qi:-1,P:{},seen:{},pl:{},tot:{},okc:{},st:{},best:{},fxc:{},okq:{},gs:{},tm:null,A:{},xt:{},rw:{},done:false,log:[],prv:{},phase:'',m:{},ver:0,stops:[]};
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function scr(id){$$('.scr').forEach(function(x){x.hidden=x.id!==id});H.scr=id;var t=$('#hstp');if(t)t.hidden=id==='hpw'||id==='hset'||id==='hlob';if(id==='hpw'||id==='hset')hqr(false)}
function post(o){var u=String(window.SCORE_URL||'').trim();if(!u)return Promise.reject(new Error('nourl'));return fetch(u,{method:'POST',body:JSON.stringify(o)}).then(function(r){return r.json()})}
function seatOf(id){return +String(id).slice(3)}
function sp2(n){return (n<10?'0':'')+n}
function R(p){return 'rooms/'+H.code+(p?'/'+p:'')}
LV.ICON=ICON;
/* ── 寫 遊戲 狀態：整個 m ＋ 版本號 一起 寫（PATCH 班級 那一層）；寫 的 時候 又 改了 ＝ 寫完 再 寫 一次 最新 的 ── */
var WB=0,WP=0;
function putM(o){for(var k in o){if(o[k]===null)delete H.m[k];else H.m[k]=o[k]}H.ver++;if(WB){WP=1;return}WB=1;
  var go=function(){WP=0;var body={m:H.m,v:H.ver};LDB.must('PATCH',R(),body,40).then(function(ok){if(WP){go();return}WB=0;if(!ok)net(true)})};go()}
function net(b){var e=$('#net');if(e)e.hidden=!b}
LDB.onBad(net);
/* ── 🔑 密碼 ── */
function pwGo(){var p=$('#pw').value.trim(),m=$('#pwm');if(!p){m.textContent='請打密碼';return}
  if(!LDB.on()){m.innerHTML='⚠ 現場任務 還沒有 設定 Firebase ➜ 請看 <a href="setup.html">大字版 設定頁</a>';return}
  m.textContent='⏳ 檢查中…';post({a:'pw',pw:p}).then(function(j){if(j&&j.ok){H.pw=p;H.champs=j.champs||{};H.tiers=j.tiers||{};H.sq=j.sq||[];sqAdd();try{sessionStorage.setItem('lvpw',p)}catch(e){}setDraw();scr('hset')}else m.textContent='❌ 密碼 不對'},function(){m.textContent='📶 連不到 成績系統'})}
/* ── 👑 每一班 上一週 最認真練習 第 1 名 ➜ 這一週 選 1 次 遊戲（2026-10-21 老師再加第 3 點；選擇題：每班 上週 第 1 名、大螢幕 上 點）──
   名單 ＝ 伺服器（{a:'pw'} 的 champs，A、B 都 做到、同 時間 比 正確率）；用過 了 ＝ Firebase rooms/0班/champ {w 那一週, ids, game}（換 電腦 也 知道）；老師 勾 這次 可以 選 哪幾種（預設 全部） */
H.champs={};H.chU={};H.cOk={};H.chSel=null;
function chOf(){var x=H.cls&&H.champs[H.cls];return x&&x.ids&&x.ids.length?x:null}
function chLoad(){var c=H.cls;if(!c||H.chU[c]!==undefined||!LDB.on())return;H.chU[c]=null;LDB.get('rooms/'+LV.room(c)+'/champ').then(function(v){H.chU[c]=v||0;if(H.cls===c&&H.scr==='hset')setDraw()},function(){})}
function chAll(){var a=[];GRP.forEach(function(g){a=a.concat(g[4])});return a}
function chBox(){var x=chOf();if(!x)return '';var u=H.chU[H.cls];
  if(H.chSel&&H.chSel.cls===H.cls)return '<div class="chbox done">👑 '+esc(H.chSel.ids.join('、'))+' 選了：'+LV.badge(H.chSel.game)+' <b>'+esc(LV.game(H.chSel.game).nm)+'</b></div>';
  if(u&&u.w===x.w)return '<div class="chbox done">👑 這一週 冠軍 已經 選過：'+LV.badge(u.game)+' <b>'+esc(LV.game(u.game).nm)+'</b></div>';
  /* 2026-10-21 第十七次 老師第 6 點（選擇題「金框先收起來」）：老師 決定 要不要 讓 冠軍 選；選了班 只 看到 一顆〔👑 讓 冠軍 選 遊戲〕，按了 才 打開 */
  if(!H.chOpen||H.chOpen!==H.cls)return '<div class="chbox mini"><button id="chOpen" class="chop">👑 讓 冠軍 選 遊戲</button><span class="note">'+esc(H.cls)+' 班 上一週 有 冠軍；老師 同意，才 請 冠軍 上台 選（一週 1 次）</span></div>';
  var all=chAll();all.forEach(function(k){if(H.cOk[k]==null)H.cOk[k]=true});var n=all.filter(function(k){return H.cOk[k]}).length;
  return '<div class="chbox"><div class="cht">👑 <b>'+esc(x.ids.join('、'))+'</b>：上一週 '+esc(H.cls)+' 班 最認真練習 第 1 名 ➜ 可以 選 1 次 遊戲</div>'+
    '<div class="note">老師 勾 這次 可以 選 哪幾種（'+n+' 種）：</div><div class="row chg">'+all.map(function(k){return '<button data-cg="'+k+'" class="'+(H.cOk[k]?'on':'')+'">'+(H.cOk[k]?'☑ ':'☐ ')+esc(LV.game(k).nm)+'</button>'}).join('')+'</div>'+
    '<div class="row"><button id="chGo" class="big chgo"'+(n?'':' disabled')+'>👑 請 冠軍 上台 選</button><span class="note">冠軍 走 上來 點 大螢幕，全班 都 看得到；一週 1 次</span></div></div>'}
function chPick(){var x=chOf();if(!x)return;var L=chAll().filter(function(k){return H.cOk[k]}),o=$('#chpk');if(!o){o=document.createElement('div');o.id='chpk';document.body.appendChild(o)}
  o.hidden=false;o.innerHTML='<div class="chin"><h1>👑 '+esc(x.ids.join('、'))+' 請 上台 選 遊戲</h1><div class="note big2">上一週 '+esc(H.cls)+' 班 最認真練習 第 1 名（練 最久＋👀 看完 才 按＋✏️ 錯了 會 改）</div>'+
    '<div class="chgr">'+L.map(function(k){var G=LV.game(k);return '<button data-cpk="'+k+'">'+LV.badge(k,'lg')+'<b>'+esc(G.nm)+'</b><small>'+esc(G.d)+'</small></button>'}).join('')+'</div><button id="chNo" class="ghost">✕ 這次 先 不選</button></div>'}
function chChose(k){var x=chOf();if(!x)return;var w={w:x.w,ids:x.ids,game:k,t:Date.now()};H.chSel={cls:H.cls,ids:x.ids,game:k};H.chU[H.cls]=w;H.game=k;
  if(LDB.on())LDB.must('PUT','rooms/'+LV.room(H.cls)+'/champ',w,6);
  var o=$('#chpk');o.innerHTML='<div class="chin chok"><div class="chcr">👑</div><h1>'+esc(x.ids.join('、'))+' 選了</h1><div class="chsel">'+LV.badge(k,'xl')+'<b>'+esc(LV.game(k).nm)+'</b></div></div>';
  if(typeof RPFX!=='undefined'){var r=o.getBoundingClientRect();RPFX.spark(o,r.width*.5,r.height*.5,'light',60);setTimeout(function(){RPFX.spark(o,r.width*.3,r.height*.4,'star',40);RPFX.spark(o,r.width*.7,r.height*.4,'star',40)},400)}
  setTimeout(function(){o.hidden=true;setDraw()},2600)}
/* ── ⚔ 戰力 階級 登場 特效（2026-10-21 第十六次 第 5 點：大螢幕 等人 的 時候，一階 比 一階 強；電腦 自動，不改 分數）── */
H.ent={};H.entQ=[];H.entOn=0;
var ENTE=['','light','ice','fire','thunder','star'];
function entSee(L){L.forEach(function(id){if(H.ent[id])return;H.ent[id]=1;var p=H.P[id]||{},t=Math.max(0,Math.min(5,+p.tr||0));if(t)H.entQ.push({id:id,t:t,h:p.h})});entNext()}
function entNext(){if(H.entOn||!H.entQ.length)return;var x=H.entQ.shift();H.entOn=1;var o=document.createElement('div');o.className='tent t'+x.t;
  o.innerHTML='<div class="tenc">'+(x.h?'<img src="'+LV.img(BASE,x.h)+'" alt="">':'')+'<div class="tent1">'+(typeof RPFX!=='undefined'?RPFX.tb(x.t,1):'')+'</div><div class="tent2">'+esc(x.id)+' 登場！</div></div>'+(x.t>=4?'<i class="tbolt"></i><i class="tbolt b2"></i>':'')+(x.t>=5?'<i class="tpil"></i>':'');
  document.body.appendChild(o);if(x.t>=5)document.body.classList.add('tshk');
  if(typeof RPFX!=='undefined'){var r=o.getBoundingClientRect();RPFX.spark(o,r.width*.5,r.height*.45,ENTE[x.t],14+x.t*12);if(x.t>=3)setTimeout(function(){RPFX.spark(o,r.width*.5,r.height*.45,ENTE[x.t],20+x.t*10)},350)}
  var d=1300+x.t*250;setTimeout(function(){o.classList.add('out');document.body.classList.remove('tshk')},d);setTimeout(function(){o.remove();H.entOn=0;entNext()},d+400)}
/* ── 一頁 設定（預設：經典搶答、題目 全選、5 題、🔥 挑戰題 開）── */
var CLS={3:['304','307','311'],4:['402','406','409','410','400']};
/* 2026-10-19 第十三次 3(1)(2)：同一類 的 遊戲 放 同一區 */
var GRP=[['c','🏆','經典 搶答','全班 一起 搶答（像 Kahoot）',['classic']],['s','🙋','個人賽','每個人 自己 比 分數',['race','tower','shoot','surf','king']],
  ['t','🤝','全班 合作','全班 一起 完成 一個 任務',['boss','pet','treasure']],['v','⚔️','兩隊 對抗','單號隊 vs 雙號隊',['tug','map']]];
/* 老師 的 步驟條（3(9)）：① 設定 ➜ ② 等 學生 ➜ ③ 答題 ➜ ④ 頒獎 ➜ ⑤ 錯題 ➜ ⑥ 發獎勵 */
var HSTEPS=[['⚙️','設定'],['📱','等 學生'],['⚡','答題'],['🏆','頒獎'],['📊','錯題'],['🎁','發獎勵']];
function hstep(k){$$('.hstp').forEach(function(e){if(e.getAttribute('data-k')!==String(k)){e.setAttribute('data-k',k);e.innerHTML=LV.stepsHTML(HSTEPS,k)}})}
function allSets(g){(LIST[g]||[]).forEach(function(k){if(H.sets[g+'_'+k]==null)H.sets[g+'_'+k]=true})}
function mins(n){return Math.max(1,Math.round(n*36/60))}
function setDraw(){allSets(H.qg);var G=LV.game(H.game),L=LIST[H.qg]||[],secs=[];L.forEach(function(k){var s=GR[k].sec;if(secs.indexOf(s)<0)secs.push(s)});
  var h='<div class="sett"><h1>⚡ 現場任務</h1>'+LV.stepsHTML(HSTEPS,0)+'</div>'+
  '<div class="sbox"><h2><b class="sn">1</b> 哪一班</h2><div class="row">'+[3,4].map(function(g){return CLS[g].map(function(c){return '<button data-sc="'+c+'" class="clsb'+(H.cls===c?' on':'')+'">'+c+(c==='400'?' 課後班':'')+'</button>'}).join('')}).join('<span class="gsep"></span>')+'</div>'+
  '</div><div class="sbox"><h2><b class="sn">2</b> 哪一種 遊戲</h2>'+chBox()+legBox()+GRP.map(function(g){return '<div class="sgrp"><div class="sgh"><span class="sgi">'+g[1]+'</span><b>'+g[2]+'</b><small>'+g[3]+'</small></div><div class="ggrid">'+
    g[4].map(function(k){var x=LV.game(k);return '<button data-sk="'+k+'" class="gcd'+(H.game===k?' on':'')+'">'+LV.badge(k)+'<span class="gtx"><b>'+x.nm+(k==='classic'?' <em>推薦</em>':'')+'</b><small>'+x.d+'</small></span></button>'}).join('')+'</div></div>'}).join('')+
  '</div><div class="sbox"><h2><b class="sn">3</b> 題目</h2><div class="row"><button data-qg="3" class="'+(H.qg===3?'on':'')+'">三年級 的 題目</button><button data-qg="4" class="'+(H.qg===4?'on':'')+'">四年級 的 題目</button>'+
    '<span class="gsep"></span><button data-sa="1">☑ 全選</button><button data-sa="0">☐ 全部 不選</button><span class="note">（每一行 後面 ＝ 那一組 有 幾題）</span></div>'+
  secs.map(function(s){return '<div class="secn">'+s+'</div><div class="row sets">'+L.filter(function(k){return GR[k].sec===s}).map(function(k){var on=!!H.sets[H.qg+'_'+k];
    return '<button data-sb="'+k+'" class="'+(on?'on':'')+'">'+(on?'☑ ':'☐ ')+esc(GR[k].nm)+'<em>'+GR[k].qs.length+' 題</em></button>'}).join('')+'</div>'}).join('')+
  '</div><div class="sbox"><h2><b class="sn">4</b> 幾題</h2><div class="row">'+[5,10,15,20].map(function(n){return '<button data-sn="'+n+'" class="'+(H.n===n?'on':'')+'">'+n+' 題（約 '+mins(n)+' 分鐘）</button>'}).join('')+'</div>'+
  '</div><div class="sbox"><h2><b class="sn">5</b> 加點 刺激</h2><div class="row"><button data-ch="1" class="'+(H.ch?'on':'')+'">🔥 挑戰題 開（拼字、排句子，分數 ✖2）</button><button data-ch="0" class="'+(!H.ch?'on':'')+'">✖ 挑戰題 關</button></div>'+
  /* 2026-10-20 第十五次（老師 C17 第 6 題 C＋1.5 倍）：全班 表現 好、上課 規矩 ➜ 老師 才 開：答對 得到 的 🪙 金幣、⭐ 經驗值 都 ✖1.5 */
  /* 2026-10-21 老師再加第 2 點：多一顆〔✖2〕（三選一，預設 關）；H.x15 ＝ 倍數（0 ＝ 關、1.5、2） */
  '<div class="row">'+[[0,'✖ 加倍 關'],[1.5,'⚡ 金幣、經驗值 ✖1.5'],[2,'⚡ 金幣、經驗值 ✖2']].map(function(x){return '<button data-x15="'+x[0]+'" class="'+(H.x15===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'<span class="note">老師 決定：答對 5 題 ➜ 🪙 5／8／10、⭐ 10／15／20</span></div>'+
  (G.fx?'<div class="row"><button data-si="1" class="'+(H.int?'on':'')+'">'+G.fx.ic+' 干擾 開（不扣分、≦ 3 秒）</button><button data-si="0" class="'+(!H.int?'on':'')+'">✖ 干擾 關</button><span class="note">'+esc(G.fx.t)+'</span></div>':'')+
  '</div><div class="row mkrow"><button id="mk" class="big">⚡ 建立 遊戲</button><span id="mkm" class="note"></span></div>';
  $('#hset .in').innerHTML=h}
function selQs(){var a=[];(LIST[H.qg]||[]).forEach(function(k){if(H.sets[H.qg+'_'+k])a=a.concat(GR[k].qs)});return a}
/* 題目：每 3 題 的 第 3 題 ＝ 🔥 挑戰題（🔤 拼字、🧩 排句子 輪流）；四選一 每題 重洗 選項 */
function mkQ(){var all=LV.shuf(selQs()),C=CHAL[H.qg]||{sp:[],or:[]},sp=LV.shuf(C.sp),or=LV.shuf(C.or),Q=[],mi=0,ci=0;
  for(var i=0;i<H.n;i++){
    if(H.ch&&i%3===2&&(sp.length||or.length)){var useSp=(ci%2===0&&sp.length)||!or.length;ci++;
      if(useSp){var w=sp.shift()||C.sp[0],ex=LV.shuf('bcdfghklmnprstvwy'.split('').filter(function(c){return w.en.toLowerCase().indexOf(c)<0})).slice(0,2);
        Q.push({ty:'sp',ch:1,t:'🔤 拼出 這個 英文 字',zh:w.zh,ic:w.ic,tiles:LV.shuf(w.en.toLowerCase().split('').concat(ex)),a:w.en,ans:w.en,h:w.zh+' ＝ '+w.en,ae:w.en,ag:[[w.en,w.zh]],az:w.zh,au:w.au||''})}
      else{var s=or.shift()||C.or[0];Q.push({ty:'or',ch:1,t:'🧩 排出 這一句 英文',zh:s.zh,tiles:LV.shuf(s.tiles),a:s.a,p:s.p,ans:sent(s),h:s.h||'',ae:s.ae,ag:s.ag,az:s.az,au:s.au})}
      continue}
    var q=all[mi++%Math.max(1,all.length)];if(!q)break;
    if(q.ty==='or'){Q.push({ty:'or',t:q.t,zh:q.zh,tiles:LV.shuf(q.tiles),a:q.a,p:q.p,ans:sent(q),h:q.h,ae:q.ae,ag:q.ag,az:q.az,au:q.au});continue}
    var n=q.o.length,ord=LV.shuf(Array.apply(null,{length:n}).map(function(_,k){return k})),a=ord.indexOf(0),x=n===4?LV.shuf(ord.map(function(_,k){return k}).filter(function(k){return k!==a})).slice(0,2):[];
    Q.push({ty:'mc',t:LV.ic(q.t),o:ord.map(function(k){return LV.ic(q.o[k])}),ot:ord.map(function(k){return q.ot[k]}),a:a,x:x,ls:q.ls||0,al:q.al||'',ans:q.ot[0],h:q.h||'',ae:q.ae,ag:q.ag,az:q.az,au:q.au})}
  return Q}
function sent(s){return String(s.a).split('|').join(' ').replace(/ (’|')/g,'$1')+(s.p||'')}
function mkRoom(){var m=$('#mkm');if(!H.cls){m.textContent='① 請選 哪一班';return}if(!selQs().length){m.textContent='③ 請選 題目';return}
  H.Q=mkQ();H.n=H.Q.length;H.code=LV.room(H.cls);H.g=H.cls.charAt(0)==='3'?3:4;H.ver=Date.now();m.textContent='⏳ 建立 遊戲 中…';
  /* 每一班 固定 一個（0＋班級）：清掉 上一場（答案、干擾、獎勵…），**留著 p**（已經 登入 等著 的 學生） */
  H.m={v:3,g:H.qg,cls:H.cls,game:H.game,n:H.n,int:H.int,x15:H.x15,phase:'lobby',made:Date.now()};
  LDB.must('PATCH',R(),{m:H.m,v:++H.ver,a:null,rw:null,xt:null,ch:null},6).then(function(ok){if(!ok){m.textContent='📶 連不到 Firebase，請 再 按 一次';return}lobby()})}
/* ── 誰 在線上：p/5碼 的 at 一變 ＝ 還在（平板 每 20 秒 寫 一次）；第一次 看到 的 時間 差 5 分鐘 以內 才 算 ── */
function seeP(v){var now=Date.now();H.P=v||{};for(var id in H.P){if(!/^\d{5}$/.test(id))continue;var at=+(H.P[id]||{}).at||0,s=H.seen[id];
  if(!s)H.seen[id]={at:at,t:Math.abs(now-at)<3e5?now:0};else if(s.at!==at){s.at=at;s.t=now}}}
function online(){var now=Date.now();return Object.keys(H.seen).filter(function(id){return now-H.seen[id].t<60000}).sort()}
function ids(){return Object.keys(H.pl).sort()}
function stopAll(){H.stops.forEach(function(f){f()});H.stops=[]}
/* ── 等學生加入：QR Code ＋ 〔📋 複製 網址〕＋ ① ② ③ ＋ 座號 格子 ── */
function stuURL(){return LV.stuURL()}
function qrSVG(u){return LV.qr(u)}
/* 右下角 QR Code（3(7)）：每一個 畫面 都 有，不小心 登出 的 學生 掃 這個 回來 */
function hqr(on){var e=$('#hqrc');if(!e)return;if(on&&!e.getAttribute('data-ok')){e.querySelector('.qrb').innerHTML=qrSVG(stuURL());e.setAttribute('data-ok',1)}e.hidden=!on}
function lobby(){scr('hlob');hstep(1);hqr(false);var G=LV.game(H.game);
  $('#lqr').innerHTML=qrSVG(stuURL());$('#lurl').textContent=stuURL().replace(/^https?:\/\//,'');
  $('#llog').innerHTML=LV.howHTML(LV.LOGIN,'v sm');
  $('#lgame').innerHTML=LV.badge(H.game,'lg')+'<div><b>'+G.nm+'</b><span>'+H.cls+' 班　'+H.n+' 題　'+(H.qg===3?'三':'四')+'年級 的 題目'+(H.ch?'　🔥 挑戰題 ✖2':'')+(H.x15?'　<b class="x15b">⚡ 金幣 經驗值 ✖'+H.x15+'</b>':'')+'</span></div>';
  stopAll();H.stops.push(LDB.poll(R('p'),1500,function(v){seeP(v);drawLobby()}));
  H.lt=setInterval(drawLobby,2000)}
function seatGrid(on,cls,extra){var n=30,h='';for(var i=1;i<=n;i++){var id=H.cls+sp2(i),o=on.indexOf(id)>=0;h+='<span class="st'+(o?' on':'')+(extra&&extra(id)?' '+extra(id):'')+'">'+(o&&H.P[id]&&H.P[id].h?'<img src="'+LV.img(BASE,H.P[id].h)+'" alt="">':'')+'<b>'+sp2(i)+'</b></span>'}
  return '<div class="seats '+(cls||'')+'">'+h+'</div>'}
function drawLobby(){if(H.scr!=='hlob')return;var L=online();entSee(L);$('#lcnt').textContent=L.length;$('#lpl').innerHTML=seatGrid(L)}
/* ── ▶ 開始：怎麼玩 ＋ 3、2、1（不動 的 ① ② ③）── */
function start(){var L=online();if(!L.length){$('#lmsg').textContent='還沒有 學生 加入（學生 掃 QR Code、打 5 碼）';return}clearInterval(H.lt);
  H.psU={};H.pl={};L.forEach(function(id){H.pl[id]=1;H.tot[id]=0;H.okc[id]=0;H.st[id]=0;H.best[id]=0;H.fxc[id]=0;H.okq[id]=''});H.qi=-1;H.start=Date.now();H.gs=gs0();H.sum=[];
  var G=LV.game(H.game);scr('hhow');hstep(2);hqr(true);$('#hhw').innerHTML=LV.badge(H.game,'xl')+'<h1>'+G.nm+'</h1>'+LV.howHTML(G.how,'big')+'<div id="cnt3" class="cnt3"></div>';
  putM({phase:'how',t0:Date.now(),pl:H.pl});
  stopAll();H.stops.push(LDB.poll(R('p'),3000,function(v){seeP(v);online().forEach(join)}));
  var k=0;(function c3(){var t=[5000,1000,1000,1000][k];H.tm=setTimeout(function(){k++;if(k<4){$('#cnt3').textContent=4-k;$('#cnt3').className='cnt3 on';c3()}else next()},t)})()}
/* 開始 以後 才 進來 的：下一題 開始 算 */
function join(id){if(H.pl[id])return;H.pl[id]=1;H.tot[id]=0;H.okc[id]=0;H.st[id]=0;H.best[id]=0;H.fxc[id]=0;H.okq[id]=Array(Math.max(0,H.qi)+1).join('-')}
function next(){clearTimeout(H.tm);clearTimeout(H.tm2);clearTimeout(H.tm3);LV.stopSay();H.qi++;if(H.qi>=H.n){end();return}
  var q=H.Q[H.qi];H.A={};H.fxNow={};H.lbOn=false;
  LDB.get(R('xt')).then(function(v){return v},function(){return null}).then(function(xt){H.xt=xt||{};var ext=0;for(var id in H.xt)if(+H.xt[id]===H.qi)ext=5000;
    var dur=(q.ty==='mc'?LV.DUR:LV.DURCH)+(q.ls?4000:0)+ext;H.dur=dur;H.t0=Date.now();
    var sq={ty:q.ty,t:q.t,ch:q.ch||0};if(q.ty==='mc'){sq.o=q.o;sq.ot=q.ot;sq.x=q.x;sq.ls=q.ls}else{sq.zh=q.zh;sq.ic=q.ic||'';sq.tiles=q.tiles;sq.p=q.p||''}
    H.phase='q';putM({phase:'q',qi:H.qi,q:sq,t0:H.t0,dur:dur,rev:null,fx:null,pl:H.pl});
    H.stops.push(H.unA=LDB.poll(R('a/'+H.qi),600,function(v){H.A=v||{};for(var id in H.A)join(id);drawQ();if(H.phase==='q'&&ids().every(function(id){return H.A[id]}))reveal()}));
    if(H.game==='king')H.stops.push(H.unC=LDB.poll(R('ch'),1500,function(v){H.ch2=v||{};if(H.phase==='q'||H.phase==='rev')drawGame()}));
    scr('hq');hstep(2);hqr(true);$('#hq').className='scr '+(H.game==='classic'?'classic':'side');drawQ();drawGame();ctl();tick();
    if(q.ls&&q.al)H.tm3=setTimeout(function(){LV.say(BASE+q.al.replace(/^\.\.\//,''),q.ae,2)},700);
    var F=LV.game(H.game).fx;if(H.int&&F&&F.ms)H.tm2=setTimeout(fxSend,3000+Math.random()*3000)})}
function tick(){clearTimeout(H.tm);if(H.phase!=='q')return;var left=Math.max(0,H.dur-(Date.now()-H.t0)),s=Math.ceil(left/1000);
  $('#qt').textContent=s;$('#qring').style.setProperty('--p',(left/H.dur*100).toFixed(1));$('#qtm').classList.toggle('hurry',s<=5);
  if(left<=0){reveal();return}H.tm=setTimeout(tick,200)}
/* 干擾（系統自動、不扣分）：寫在 m.fx（平板 跟著 m 一起 拿到）；全班一起的 ＝ 每一個人；其他 ＝ 隨機 1～2 個（每人每場最多 2 次、還沒答的） */
function fxSend(){if(H.phase!=='q')return;var F=LV.game(H.game).fx;if(!F)return;var L=ids().filter(function(id){return (H.fxc[id]||0)<LV.MAXFX&&!H.A[id]});if(!L.length)return;
  var who=F.all?L:LV.shuf(L).slice(0,Math.random()<.5?1:2),now=Date.now(),fx={};
  who.forEach(function(id){H.fxc[id]=(H.fxc[id]||0)+1;H.fxNow[id]=F.k;fx[id]={k:F.k,qi:H.qi,at:now}});putM({fx:fx});
  H.log.push({qi:H.qi,k:F.k,n:who.length});drawGame()}
function qTitle(q){var c=q.ty==='mc'?'':'<span class="chal">'+(q.ch?'🔥 挑戰題 分數 ✖2':'🧩 排句子')+'</span>';
  if(q.ty==='mc')return (q.ls?'<div class="lsn">🎧 仔細 聽 <button id="hear" class="ghost">🔊 再 聽 一次</button></div>':q.t);
  return c+'<div class="cht">'+q.t+'</div><div class="chz">'+(q.ic?'<span class="chi">'+q.ic+'</span>':'')+LV.ic(q.zh)+'</div>'}
/* 題目 畫面：上面 一行（第幾題、倒數、幾個人 答了）、題目、選項；下面 一排 座號（答了 ＝ 綠色 ✔：老師 一眼 看到 收到 誰 的 答案） */
function drawQ(){var q=H.Q[H.qi];if(!q)return;$('#qn').textContent='第 '+(H.qi+1)+' ／ '+H.n+' 題';$('#qq').innerHTML=qTitle(q);
  var rv=H.phase==='rev',D=H.dist||[0,0,0,0],mx=Math.max(1,Math.max.apply(null,D));$('#hq').classList.toggle('rv',rv);
  if(q.ty==='mc')$('#qo').innerHTML='<div class="qos n'+q.o.length+'">'+q.o.map(function(t,i){return '<div class="qo c'+i+(rv&&i===q.a?' ok':'')+(rv&&i!==q.a?' no':'')+'"><span class="shp">'+LV.SHAPE[i]+'</span><span class="qt">'+t+'</span>'+
    (rv?'<span class="qd"><i style="--h:'+(D[i]/mx*100).toFixed(0)+'%"></i><b>'+D[i]+' 人</b></span>':'')+(rv&&i===q.a?'<span class="qck">✔</span>':'')+'</div>'}).join('')+'</div>';
  else $('#qo').innerHTML='<div class="chbox">'+(rv?'<div class="chans">✔ '+esc(q.ans)+'</div>':
    '<div class="chtiles">'+q.tiles.map(function(t){return '<span>'+esc(t)+'</span>'}).join('')+'</div><div class="note">👆 在 平板 上 照 順序 點</div>')+'</div>';
  var na=ids().filter(function(id){return H.A[id]}).length;
  $('#qa').innerHTML='✋ <b>'+na+'</b> ／ '+ids().length+' 人 答了';
  $('#qs').innerHTML=rv?'':seatRow();
  $('#qh').innerHTML=rv?anaHTML(q):'';$('#qh').hidden=!rv}
function seatRow(){return '<div class="srow">'+ids().map(function(id){return '<span class="'+(H.A[id]?'ok':'')+'">'+(H.A[id]?'✔ ':'')+sp2(seatOf(id))+'</span>'}).join('')+'</div>'}
/* 📌 錯題 分析（公布 的 時候）：答對 幾 人、答錯 幾 人、最多人 選錯 哪一個；正確 答案 逐字 中文、整句 翻譯、💡、〔🔊 再 唸〕 */
function anaHTML(q){var n=ids().length,ok=H.nOk||0,bad=n-ok,top='';
  if(q.ty==='mc'&&bad){var D=H.dist||[],wi=-1;D.forEach(function(v,i){if(i!==q.a&&v&&(wi<0||v>D[wi]))wi=i});if(wi>=0)top='<div class="anw">❌ 最多人 選錯：<span class="shp sm c'+wi+'">'+LV.SHAPE[wi]+'</span> '+esc(q.ot[wi])+'（'+D[wi]+' 人）</div>'}
  return '<div class="ana"><div class="anh"><span class="aok">✅ 答對 '+ok+' 人</span><span class="abad">❌ 答錯 '+bad+' 人</span>'+top+'</div>'+
    '<div class="ant">📌 正確 答案<button id="resay" class="ghost">🔊 再 唸 一次</button></div>'+LV.glHTML({ag:q.ag,az:q.az,ae:q.ae,ans:q.ans,h:q.h},true)+'</div>'}
/* 控制 按鈕：永遠 在 右下角 同一個 位置（老師 8(3)(4)：不知道 怎麼 關 排行榜、開 下一題）*/
function ctl(){var p=H.phase,b=$('#hgo'),last=H.qi>=H.n-1;
  b.textContent=p==='q'?'⏭ 提早 公布':p==='rev'?'🏆 看 排行榜 ➜':p==='lb'?(last?'🏆 頒獎 典禮 ➜':'▶ 下一題（第 '+(H.qi+2)+' 題）'):'';
  b.className='big '+(p==='q'?'ghost':'go');$('#hctl2').hidden=p!=='q';var tb=$('#htut');if(tb)tb.hidden=!(p==='rev'&&tutL().length)}
function hgo(){if(H.phase==='q')reveal();else if(H.phase==='rev')lbShow();else if(H.phase==='lb')next()}
/* ── 公布 ── */
function okOf(q,a){if(!a)return false;if(q.ty==='mc')return Object.prototype.toString.call(a.k)==='[object Array]'?a.k.indexOf(q.a)>=0:a.k===q.a;return LV.norm(a.s)===LV.norm(q.a)}
function reveal(){if(H.phase!=='q')return;H.phase='rev';clearTimeout(H.tm);clearTimeout(H.tm2);if(H.unA)H.unA();
  LDB.get(R('a/'+H.qi)).then(function(v){return v},function(){return null}).then(function(v){if(v)for(var k in v){H.A[k]=v[k];join(k)}rev2()})}
function rev2(){var q=H.Q[H.qi],sc={},ok1={},cheer=0,hits=[],D=[0,0,0,0],nOk=0,psNow={};if(!H.psU)H.psU={};
  H.rk0=rank().map(function(x){return x.id});
  ids().forEach(function(id){var a=H.A[id],f=(a&&a.f)||{},ok=okOf(q,a);
    if(a&&q.ty==='mc'&&typeof a.k==='number')D[a.k]++;
    /* 2026-10-20 第十四次（老師：寵物 真的 幫忙；老師選「只在遊戲裡幫」）：一擊 ＝ 戰士（武器 愈強 愈痛）＋ 🐾 寵物 一起 打；🐾 寵物護盾 ＝ 一場 一次，答錯 連對 🔥 不會 斷 */
    var PP=H.P[id]||{},dd=(+PP.hit||10+Math.min(20,Math.floor((+PP.pw||0)/100)))+(PP.pt?(+PP.ph||3):0);
    if(ok){H.st[id]++;H.okc[id]++;nOk++;if(H.st[id]>H.best[id])H.best[id]=H.st[id];hits.push({id:id,ms:a.ms,d:dd,pd:PP.pt?(+PP.ph||3):0})}
    else if(f.sh){}else if(PP.pt&&H.psU&&!H.psU[id]&&H.st[id]>0){H.psU[id]=1;psNow[id]=1}else H.st[id]=0;
    var ff={};for(var k in f)ff[k]=f[k];if(q.ch)ff.chal=1;
    var s=LV.score(ok,a?a.ms:H.dur,H.dur,ff,H.st[id]);
    if(f.met)s+=30*Math.min(3,+f.met||0);
    if(ok&&(H.fxNow[id]==='lock'||H.fxNow[id]==='wave'))s+=50;
    if(f.ch)cheer++;sc[id]=s;ok1[id]=ok?1:0;H.tot[id]+=s;H.okq[id]=(H.okq[id]||'')+(a?(ok?'1':'0'):'-')});
  hits.sort(function(a,b){return a.ms-b.ms});H.hits=hits;H.dist=D;H.nOk=nOk;H.sc=sc;
  H.sum.push({qi:H.qi,ok:nOk,n:ids().length});
  if(H.game!=='classic')gsUp(ok1,hits,cheer);
  putM({phase:'rev',rev:{qi:H.qi,a:q.a,ty:q.ty,ans:q.ans,h:q.h,ae:q.ae,ag:q.ag,az:q.az,au:q.au,d:D,n:nOk},r:{qi:H.qi,sc:sc,tot:H.tot,ok:ok1,st:H.st,okc:H.okc,ps:psNow,psU:H.psU},gs:H.game==='classic'?null:H.gs,fx:null});
  drawQ();drawGame();ctl();
  if(H.say&&q.ae)H.tm3=setTimeout(function(){LV.say(q.au?BASE+q.au.replace(/^\.\.\//,''):'',q.ae,3)},900)}
function rank(){return ids().map(function(id){return {id:id,v:H.tot[id]||0}}).sort(function(a,b){return b.v-a.v||(a.id<b.id?-1:1)})}
/* 🏆 前 5 名：每一列 從「上一題 的 名次」滑到 現在 的 名次；🔥 連對 */
function lbShow(){H.phase='lb';LV.stopSay();if(H.unC)H.unC();putM({phase:'lb'});scr('hlb');drawLB();ctl2()}
function ctl2(){var b=$('#hgo2'),last=H.qi>=H.n-1;b.textContent=last?'🏆 頒獎 典禮 ➜':'▶ 下一題（第 '+(H.qi+2)+' 題）'}
function drawLB(){var el=$('#lb');var R0=H.rk0||[],R1=rank().slice(0,5);
  el.innerHTML='<div class="lbt">🏆 前 5 名　<small>第 '+(H.qi+1)+' ／ '+H.n+' 題 以後</small></div>'+R1.map(function(x,i){var was=R0.indexOf(x.id),dy=(was<0?5:Math.min(5,was))-i;
    return '<div class="lbr'+(i===0?' top':'')+'" style="--dy:'+dy+'"><b class="lbn">'+(i+1)+'</b>'+heroI(x.id,'lbi')+'<span class="lbs">'+seatOf(x.id)+' 號 '+tbI(x.id)+'</span>'+(dy>0?'<i class="up">▲ '+dy+'</i>':'')+
      ((H.st[x.id]||0)>=2?'<i class="fire">🔥 連對 '+H.st[x.id]+'</i>':'')+'<em>'+(x.v||0).toLocaleString()+'</em></div>'}).join('')}
/* ⚔ 戰力階級 徽章（2026-10-20 第十五次）：學生 平板 送來 的 tr */
function tbI(id){var p=H.P[id]||{};return p.tr&&typeof RPFX!=='undefined'?RPFX.tb(p.tr):''}
function heroI(id,cls){var p=H.P[id]||{};return p.h?'<img class="'+(cls||'')+'" src="'+LV.img(BASE,p.h)+'" alt="">':'<span class="noh '+(cls||'')+'">👤</span>'}
/* ── 遊戲 場景（大螢幕 右邊；經典搶答 沒有）── */
var BOSS=['p30','p29','p28','p27','p26','p25','p24','p23'];
function gs0(){var n=Math.max(1,ids().length),hp=n*Math.max(3,Math.round(H.n*.55))*15;
  var tre=[];for(var i=0;i<6;i++)tre.push('s0'+(1+Math.floor(Math.random()*5))+('0'+(1+Math.floor(Math.random()*20))).slice(-2));
  return {hp:hp,hp0:hp,tug:0,rt:[0,0],cells:[],nw:[],pet:0,tr:0,cheer:0,boss:BOSS[Math.floor(Math.random()*BOSS.length)],tre:tre,arr:[],bull:{},combo:0,chal:''}}
function team(id){return seatOf(id)%2?0:1}
function gsUp(ok1,hits,cheer){var G=H.gs,L=ids(),tn=[0,0],to=[0,0];G.cheer+=cheer;
  L.forEach(function(id){tn[team(id)]++;if(ok1[id])to[team(id)]++});
  var rate=L.length?hits.length/L.length:0,mul=rate>=.8?1.5:1,dmg=0;hits.forEach(function(x){dmg+=x.d});G.combo=mul>1?1:0;G.hp=Math.max(0,G.hp-Math.round(dmg*mul)-cheer*50);
  G.rt=[tn[0]?to[0]/tn[0]:0,tn[1]?to[1]/tn[1]:0];G.tug=Math.max(-100,Math.min(100,G.tug+Math.round((G.rt[0]-G.rt[1])*45)));
  /* 領土：每一隊 搶 round(比例 ✕ 4) 塊；空地 沒了 ➜ 搶 對方 的 */
  G.nw=[];[0,1].forEach(function(t){var k=Math.round(G.rt[t]*4);for(var i=0;i<k;i++){var e=[],o=[];for(var c=0;c<40;c++){if(G.cells[c]==null)e.push(c);else if(G.cells[c]!==t)o.push(c)}var p=e.length?e:o;if(!p.length)break;var c2=p[Math.floor(Math.random()*p.length)];G.cells[c2]=t;G.nw.push(c2)}});
  /* 神射手：這一題 答對 的 箭（愈快 愈 靠近 紅心）；紅心 次數 */
  G.arr=hits.map(function(x){var ring=Math.min(4,Math.floor(x.ms/H.dur*5));if(ring===0)G.bull[x.id]=(G.bull[x.id]||0)+1;return {id:x.id,r:ring}});
  var tot=0,max=L.length*H.n;L.forEach(function(id){tot+=H.okc[id]||0});var en=Math.min(1,(tot+G.cheer)/Math.max(1,max*.8));G.en=en;G.pet=en>=1?4:en>=.75?3:en>=.5?2:en>=.25?1:0;G.tr=Math.min(6,Math.floor(en*6.99))}
/* 從 上一次 的 位置 滑到 這一次（每一次 重畫 都 看得到 移動） */
function mv(k,v){var a=H.prv[k];H.prv[k]=v;return '--a:'+(a==null?v:a)+';--b:'+v}
function drawGame(){var el=$('#gv');if(!el||H.game==='classic')return;var G=H.gs,k=H.game,L=ids(),R=rank(),rv=H.phase==='rev',g=LV.game(k),h='<div class="gvt">'+LV.badge(k,'sm')+' '+g.nm+'</div>';
  var fxi=function(id){return H.fxNow&&H.fxNow[id]&&g.fx?'<i class="fxb">'+g.fx.ic+'</i>':''};
  if(k==='boss'){var p=G.hp/G.hp0*100;
    h+='<div class="bs'+(G.hp<=0?' dead':'')+(rv&&H.hits&&H.hits.length?' hit':'')+'"><div class="bsau"></div><img class="bsi" src="'+LV.img(BASE,G.boss)+'" alt="魔王">'+(G.hp<=0?'<div class="ko">K.O.</div>':'')+'</div>'+
      '<div class="hpb"><i style="'+mv('hp',p.toFixed(1)+'%')+'"></i><span>'+(G.hp<=0?'🎉 全班 打倒 魔王！':'❤ '+G.hp.toLocaleString()+' ／ '+G.hp0.toLocaleString())+'</span></div>'+
      (rv&&H.hits?'<div class="hits">'+H.hits.slice(0,12).map(function(x,i){return '<span class="hit1" style="--i:'+i+'">'+heroI(x.id,'hti')+'<b>－'+Math.round(x.d*(G.combo?1.5:1))+'</b>'+(x.pd?'<em class="hpd">🐾 ＋'+x.pd+'</em>':'')+'</span>'}).join('')+(H.hits.length>12?'<span class="more">＋'+(H.hits.length-12)+' 人</span>':'')+'</div>'+
        (G.combo?'<div class="combo">🤝 全班 答對 8 成 ＝ 連擊 ✖1.5！</div>':'<div class="note c">全班 答對 8 成 ＝ 連擊 ✖1.5</div>'):'<div class="note c">✋ 答對 的 人 ＝ 戰士 飛過去 出招</div>')}
  else if(k==='race'){var top=R.slice(0,8),len=Math.max(H.n*800,(R[0]?R[0].v:0)*1.08);
    h+='<div class="rc">'+top.map(function(x,i){var pc=Math.min(92,(x.v/len*92));return '<div class="rl"><b class="rp">'+(i+1)+'</b><span class="rtk"><span class="car'+((H.st[x.id]||0)>=3?' nitro':'')+'" style="'+mv('car'+x.id,pc.toFixed(1)+'%')+'">'+heroI(x.id,'cri')+'<i>'+seatOf(x.id)+'</i>'+fxi(x.id)+'</span></span><span class="fin"></span></div>'}).join('')+'</div>'+
      '<div class="note c">🔥 ＝ 連對 3 題 氮氣 加速　🏁 前 8 名</div>'}
  else if(k==='tug'){var pos=50+G.tug/2,tm=[0,1].map(function(t){return L.filter(function(id){return team(id)===t})});
    h+='<div class="tg"><div class="tgs"><div class="tgt t0"><b>🔵 單號隊</b><span>'+tm[0].length+' 人</span>'+(rv?'<em>答對 '+Math.round(G.rt[0]*100)+'%</em>':'')+'</div><div class="tgt t1"><b>🔴 雙號隊</b><span>'+tm[1].length+' 人</span>'+(rv?'<em>答對 '+Math.round(G.rt[1]*100)+'%</em>':'')+'</div></div>'+
      '<div class="tga"><div class="tgl"></div><div class="tgr" style="'+mv('tug',(100-pos).toFixed(1)+'%')+'"><span class="rope"></span><span class="knot"></span></div>'+
      '<div class="tgp t0">'+tm[0].slice(0,5).map(function(id){return heroI(id,'tgi')}).join('')+'</div><div class="tgp t1">'+tm[1].slice(0,5).map(function(id){return heroI(id,'tgi')}).join('')+'</div></div>'+
      '<div class="tgm"><span>🔵 拉到 這裡 贏</span><span>🔴 拉到 這裡 贏</span></div><div class="note c">看 答對 的「比例」：人少 的 隊 也 公平</div></div>'}
  else if(k==='map'){var cnt=[0,0];G.cells.forEach(function(t){if(t!=null)cnt[t]++});
    h+='<div class="hx">'+Array.apply(null,{length:40}).map(function(_,i){var t=G.cells[i];return '<i class="'+(t==null?'':'t'+t)+(rv&&G.nw.indexOf(i)>=0?' nw':'')+'"></i>'}).join('')+'</div>'+
      '<div class="mps"><b class="t0">🔵 單號隊 '+cnt[0]+' 塊</b><b class="t1">🔴 雙號隊 '+cnt[1]+' 塊</b></div>'}
  else if(k==='tower'){var P=[],N=H.n;for(var i=0;i<=N;i++){var y=92-i/N*80,x=i%2?62:38;x+=(i/N)*(i%2?-8:8);P.push([x,y])}
    var at={};h+='<div class="mt"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="mtg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3F2FD"/><stop offset=".28" stop-color="#90A4AE"/><stop offset="1" stop-color="#263238"/></linearGradient></defs>'+
      '<path d="M0 100L30 40L42 52L50 8L60 30L70 22L100 100Z" fill="url(#mtg)"/><path d="M50 8L44 20L50 17L55 24L60 30L57 18Z" fill="#fff"/><polyline points="'+P.map(function(p){return p.join(',')}).join(' ')+'" fill="none" stroke="#FFD54A" stroke-width=".7" stroke-dasharray="1.5 1.2"/></svg>'+
      '<span class="camp" style="left:'+P[Math.round(N/3)][0]+'%;top:'+P[Math.round(N/3)][1]+'%">⛺ 營地 1</span><span class="camp" style="left:'+P[Math.round(N*2/3)][0]+'%;top:'+P[Math.round(N*2/3)][1]+'%">⛺ 營地 2</span><span class="flag" style="left:'+P[N][0]+'%;top:'+P[N][1]+'%">🚩</span>'+
      R.slice(0,12).map(function(x){var n=Math.min(N,H.okc[x.id]||0),o=(at[n]=(at[n]||0)+1)-1,pp=P[n];return '<span class="clb" style="'+mv('cx'+x.id,(pp[0]+(o%4)*4-6).toFixed(1)+'%').replace(/--a/,'--ax').replace(/--b/,'--bx')+';'+mv('cy'+x.id,(pp[1]-Math.floor(o/4)*6).toFixed(1)+'%').replace(/--a/,'--ay').replace(/--b/,'--by')+'">'+heroI(x.id,'cli')+'<i>'+seatOf(x.id)+'</i>'+fxi(x.id)+'</span>'}).join('')+'</div>'}
  else if(k==='pet'){var e=G.en||0,st=G.pet,hat=st>=2;
    h+='<div class="pt"><div class="ptv st'+st+'">'+(hat?'<img class="pti" src="'+LV.img(BASE,G.boss)+'" alt="傳說寵物"><div class="ptl">'+['','','Lv 1 孵出來 了！','Lv 2 長大 了！','Lv 3 傳說 進化！'][st]+'</div>':
      '<svg class="egg" viewBox="0 0 100 120"><defs><radialGradient id="eg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF8E1"/><stop offset=".6" stop-color="#FFB74D"/><stop offset="1" stop-color="#6D3A00"/></radialGradient></defs><ellipse cx="50" cy="64" rx="38" ry="50" fill="url(#eg)"/>'+
      '<path d="M22 40L30 52L38 44L46 58" stroke="#5D2E00" stroke-width="3" fill="none" opacity="'+(st>=1?1:0)+'"/><path d="M54 30L60 44L70 38L76 54" stroke="#5D2E00" stroke-width="3" fill="none" opacity="'+(e>=.4?1:0)+'"/></svg>')+'</div>'+
      '<div class="enb"><i style="'+mv('en',(e*100).toFixed(1)+'%')+'"></i><span>⚡ 全班 能量 '+Math.round(e*100)+'%</span></div><div class="pts">'+['🥚 龍蛋','💥 裂開','🐣 Lv 1','🐲 Lv 2','🐉 Lv 3'].map(function(x,i){return '<span class="'+(i<=st?'on':'')+'">'+x+'</span>'}).join('')+'</div></div>'}
  else if(k==='shoot'){var b=Object.keys(G.bull).sort(function(a,c){return G.bull[c]-G.bull[a]}).slice(0,3);
    h+='<div class="sh"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#FAFAFA"/><circle cx="50" cy="50" r="38.4" fill="#212121"/><circle cx="50" cy="50" r="28.8" fill="#1E88E5"/><circle cx="50" cy="50" r="19.2" fill="#E53935"/><circle cx="50" cy="50" r="9.6" fill="#FFD600"/></svg>'+
      (rv?G.arr.map(function(x,i){var a=(i*137.5)*Math.PI/180,r=Math.min(38,x.r*9.6+4.8);return '<i class="ar" style="left:'+(50+Math.cos(a)*r).toFixed(1)+'%;top:'+(50+Math.sin(a)*r).toFixed(1)+'%;--i:'+i+'"><b>'+seatOf(x.id)+'</b></i>'}).join(''):'')+'</div>'+
      '<div class="note c">'+(b.length?'🎯 正中 紅心：'+b.map(function(id){return seatOf(id)+' 號 ✕'+G.bull[id]}).join('　'):'⚡ 答得 愈快 ＝ 愈 靠近 紅心')+'</div>'}
  else if(k==='treasure'){h+='<div class="ts"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M4 50C20 50 18 12 34 14S46 50 60 46S76 10 96 12" fill="none" stroke="#FFCC80" stroke-width="1.6" stroke-dasharray="2 1.6"/></svg>'+
      [[10,46],[26,16],[40,34],[56,46],[72,20],[92,12]].map(function(p,i){var op=i<G.tr;return '<span class="chest'+(op?' op':'')+(rv&&op&&i===G.tr-1?' new':'')+'" style="left:'+p[0]+'%;top:'+(p[1]/60*100).toFixed(0)+'%">'+(op?'<img src="'+BASE+'rpg/shop/'+G.tre[i]+'.jpg" alt="">':'<b>🔒</b>')+'</span>'}).join('')+
      '<span class="exp" style="'+mv('ex',(G.tr===0?2:[10,26,40,56,72,92][G.tr-1]-4)+'%')+'">🧭</span></div><div class="note c">🗝 全班 打開 '+G.tr+' ／ 6 個 寶箱（裡面 是 商城 的 寶物）</div>'}
  else if(k==='surf'){var tp=L.map(function(id){return {id:id,s:H.st[id]||0}}).sort(function(a,c){return c.s-a.s}).slice(0,8),bb=0,bi='';L.forEach(function(id){if((H.best[id]||0)>bb){bb=H.best[id];bi=id}});
    h+='<div class="sf"><svg class="w1" viewBox="0 0 200 40" preserveAspectRatio="none"><path d="M0 20Q25 0 50 20T100 20T150 20T200 20V40H0Z" fill="#0277BD"/></svg><svg class="w2" viewBox="0 0 200 40" preserveAspectRatio="none"><path d="M0 22Q25 8 50 22T100 22T150 22T200 22V40H0Z" fill="#4FC3F7"/></svg>'+
      tp.map(function(x,i){return '<span class="sfr" style="left:'+(4+i*11.5)+'%;'+mv('sf'+x.id,(12+Math.min(9,x.s)*6)+'%').replace(/--a/,'--ay').replace(/--b/,'--by')+'">'+heroI(x.id,'sfi')+'<b>'+(x.s?'🔥'+x.s:seatOf(x.id)+' 號')+'</b>'+fxi(x.id)+'</span>'}).join('')+'</div>'+
      '<div class="note c">'+(bb?'🏆 最長 連勝：'+seatOf(bi)+' 號 '+bb+' 題':'🔥 連對 愈多 ＝ 浪 愈高')+'</div>'}
  else{var t3=R.slice(0,3),cc=0,chg='';for(var c2 in (H.ch2||{}))cc+=+H.ch2[c2]||0;if(rv&&H.hits)for(var j=0;j<H.hits.length;j++){if(!t3.some(function(x){return x.id===H.hits[j].id})){chg=H.hits[j].id;break}}
    h+='<div class="kg"><div class="kpod">'+[1,0,2].map(function(n){var x=t3[n];return '<div class="kp p'+(n+1)+'">'+(x?(n===0?'<span class="crown">👑</span>':'')+heroI(x.id,'kpi')+'<b>'+seatOf(x.id)+' 號 '+tbI(x.id)+'</b><em>'+x.v.toLocaleString()+'</em>':'')+'<div class="kb">'+(n+1)+'</div></div>'}).join('')+'</div>'+
      (chg?'<div class="chg">👊 挑戰者：'+heroI(chg,'chgi')+seatOf(chg)+' 號（台下 答對 最快）</div>':'')+'<div class="kc">📣 台下 加油 <b>'+cc+'</b> 次</div></div>'}
  h+='<div class="rk5">'+R.slice(0,5).map(function(x,i){return '<span><b>'+(i+1)+'</b> '+seatOf(x.id)+' 號 '+(x.v||0).toLocaleString()+'</span>'}).join('')+'</div>';
  el.innerHTML=h}
/* ── 結束 ① 🏆 頒獎 典禮（老師 8(6)：潦草 ➜ 用 老師看板 的 10 種 風格〔每一次 不一樣〕、前 3 名 一個一個 上台；沒有 聲音）── */
function end(){H.phase='end';clearTimeout(H.tm);clearTimeout(H.tm3);LV.stopSay();stopAll();
  var Rk=rank(),top=[];for(var i=0;i<Rk.length&&top.length<3;i++)top.push(Rk[i]);
  /* 全班 錯題：每一題 答對 率；最多人 錯 的 前 3 題（平板 的 個人 總分析 也 要 用） */
  var S=H.sum.map(function(s){var q=H.Q[s.qi];return {qi:s.qi,ok:s.ok,n:s.n,r:s.n?Math.round(s.ok/s.n*100):0,ans:q.ans,ae:q.ae,ag:q.ag,az:q.az,au:q.au,h:q.h,t:q.ty==='mc'?(q.ls?'🎧 聽力題':q.t):q.t+'：'+LV.ic(q.zh||'')}});
  var W=S.filter(function(s){return s.ok<s.n}).sort(function(a,b){return a.r-b.r||a.qi-b.qi}).slice(0,3).map(function(s){return s.qi});
  H.S=S;H.W=W;
  putM({phase:'end',r:{qi:H.qi,tot:H.tot,okc:H.okc,st:H.st,okq:H.okq},gs:H.game==='classic'?null:H.gs,sum:{w:W,s:S.map(function(s){return {qi:s.qi,r:s.r,ok:s.ok,n:s.n}}),
    wq:W.map(function(k){var s=S[k];return {qi:k,r:s.r,ans:s.ans,ae:s.ae,ag:s.ag,az:s.az,au:s.au,h:s.h}})}});
  cerShow()}
function cerShow(){scr('hend');hstep(3);hqr(true);var Rk=rank(),G=H.gs,k=H.game,cnt=[0,0];(G.cells||[]).forEach(function(t){if(t!=null)cnt[t]++});
  var res=k==='boss'?(G.hp<=0?'🎉 全班 打倒 魔王！':'魔王 還剩 '+G.hp+' 血'):k==='tug'?(G.tug===0?'🤝 兩隊 平手':(G.tug>0?'🔵 單號隊':'🔴 雙號隊')+' 贏了 拔河'):
    k==='map'?(cnt[0]===cnt[1]?'🤝 兩隊 平手':(cnt[0]>cnt[1]?'🔵 單號隊':'🔴 雙號隊')+' 搶到 比較 多 地'):k==='pet'?['🥚 龍蛋 快 孵出來 了','💥 龍蛋 裂開 了','🐣 孵出 傳說 寵物','🐲 寵物 長大 了','🐉 傳說 進化'][G.pet||0]:k==='treasure'?'🗝 全班 打開 '+G.tr+' 個 寶箱':'';
  var pod=[];for(var i=0;i<Rk.length&&i<3;i++){var x=Rk[i];pod.push({rk:i+1,w:'<span class="cph">'+heroI(x.id,'cpi')+'</span><span class="cpn">'+seatOf(x.id)+' 號</span><span class="cps">'+x.v.toLocaleString()+' 分</span>'})}
  var one=Rk[0],G2=LV.game(H.game);
  H.cerK=CERX.pick();
  CERX.play($('#cerst'),H.cerK,{ribbon:'⚡ 現場任務 冠軍',sub:H.cls+' 班　'+G2.nm+'　'+H.n+' 題'+(res?'　'+res:''),cls:one?'👑 '+seatOf(one.id)+' 號':'',
    say:one?'🌟 總分 '+one.v.toLocaleString()+' 分、答對 '+(H.okc[one.id]||0)+' ／ '+H.n+' 題':'',pod:pod},{snd:false});
  $('#cstn').textContent='第 '+(H.cerK+1)+' 種 風格：'+CERX.ST[H.cerK].nm}
/* ── 結束 ② 📊 全班 錯題 總分析：每一題 答對 率 長條（一條一條 長出來）＋ 最多人 錯 的 前 3 名（逐字 中文、翻譯、🔊）── */
function anaShow(){CERX.stop($('#cerst'));scr('hana');hstep(4);hqr(true);var S=H.S||[],n=S.length,okA=0,nA=0;S.forEach(function(s){okA+=s.ok;nA+=s.n});var acc=nA?Math.round(okA/nA*100):0;
  var RD=46,L=2*Math.PI*RD;
  var h='<div class="anahd"><svg class="ring2" viewBox="0 0 110 110"><circle cx="55" cy="55" r="'+RD+'" fill="none" stroke="#24313F" stroke-width="12"/><circle class="rg" cx="55" cy="55" r="'+RD+'" fill="none" stroke="#3BD16F" stroke-width="12" stroke-linecap="round" stroke-dasharray="'+L.toFixed(1)+'" stroke-dashoffset="'+L.toFixed(1)+'" style="--to:'+(L*(1-acc/100)).toFixed(1)+'" transform="rotate(-90 55 55)"/><text x="55" y="62" text-anchor="middle" font-size="26" fill="#fff" font-weight="700">'+acc+'%</text></svg>'+
    '<div><h1>📊 全班 錯題 總分析</h1><div class="note big2">'+H.cls+' 班　全班 平均 答對 '+acc+'%</div></div></div>'+
    '<div class="bars">'+S.map(function(s,i){var w=s.r;return '<div class="bar" style="--i:'+i+'"><b>第 '+(s.qi+1)+' 題</b><span class="bt"><i class="'+(w>=80?'g':w>=50?'y':'r')+'" style="--w:'+w+'%"></i></span><em>'+w+'%</em><small>'+s.ok+' ／ '+s.n+' 人</small></div>'}).join('')+'</div>'+
    '<h2>❌ 最多人 錯 的 題目 排行</h2>'+((H.W||[]).length?'<div class="wrk">'+H.W.map(function(k,j){var s=S[k];return '<div class="wr" style="--i:'+j+'"><div class="wrh"><b class="wn">'+['🥇','🥈','🥉'][j]+' 第 '+(s.qi+1)+' 題</b><span class="note">答對 '+s.r+'%</span><button class="ghost" data-say="'+k+'">🔊 唸</button></div>'+
      '<div class="wrq">'+s.t+'</div>'+LV.glHTML({ag:s.ag,az:s.az,ae:s.ae,ans:s.ans,h:s.h})+'</div>'}).join('')+'</div>':'<div class="note big2">🎉 每一題 全班 都 答對！</div>');
  $('#hanab').innerHTML=h;
  setTimeout(function(){$$('#hanab .bar,#hanab .wr').forEach(function(x){x.classList.add('go')});var g=$('#hanab .rg');if(g)g.classList.add('go')},60);
  /* 3(8)：最多人 錯 的 題目，一題一題 自動 唸 3 次（唸到 的 那一題 亮） */
  if(H.say&&H.W&&H.W.length){var sw=function(j){$$('#hanab .wr').forEach(function(x,i){x.classList.toggle('spk',i===j)});if(j>=H.W.length||H.scr!=='hana')return;var s=S[H.W[j]];
      LV.say(s.au?BASE+s.au.replace(/^\.\.\//,''):'',s.ae,3,function(){H.tm3=setTimeout(function(){sw(j+1)},700)})};H.tm3=setTimeout(function(){sw(0)},1500)}
  LDB.get(R('rw')).then(function(rw){H.rw=rw||{};$('#erw').textContent='🎁 這一場 抽到 的 獎勵：'+Object.keys(H.rw).reduce(function(s,id){return s+(H.rw[id]||[]).length},0)+' 個'},function(){})}
/* 每一個人：參加 ＋10 經驗值、答對 1 題 ＋1 金幣；抽到的獎勵照 LV.RW */
function bonusList(){var k=H.x15||1;return ids().map(function(id){var rw=H.rw[id]||[],c=Math.round((H.okc[id]||0)*k),x=Math.round(10*k),o={id:id,c:c,x:x,tre:[],title:'',snack:0,medal:0};   /* ✖1.5（2026-10-20 第十五次）：先 乘 再 加 抽到 的 獎勵 */
  rw.forEach(function(k){if(k==='c2')o.c+=c;else if(k==='x2')o.x+=x;else if(k==='frag')o.c+=20;else if(k==='title')o.title='⚡ 現場任務 勇者';else if(k==='emo')o.tre.push('t06');else if(k==='fx')o.tre.push('t04');else if(k==='snack')o.snack++;else if(k==='medal')o.medal++;else if(k==='box')o.c+=30});return o})}
function give(){var b=$('#give'),m=$('#gm');if(H.done){m.textContent='✅ 已經 發過了';return}b.disabled=true;m.textContent='⏳ 發獎勵中…';
  post({a:'rpgb',pw:H.pw,room:H.code,t0:H.start,list:bonusList()}).then(function(j){if(j&&j.ok){H.done=true;hstep(5);b.textContent='✅ 獎勵 發好了';m.textContent='✅ 發好了（'+j.n+' 人）：〔戰神之路〕拿到 獎勵、老師看板 練習次數 ＋1';putM({given:1})}else{b.disabled=false;m.textContent='❌ 沒有 發成（'+((j&&j.err)||'')+'）'}},
    function(){b.disabled=false;m.textContent='📶 連不到 成績系統'})}
/* 結束 這一場：清掉 遊戲（留著 p：學生 還 登入 著，下一場 直接 進來）*/
function closeGame(){LV.stopSay();stopAll();if(H.code)LDB.must('PATCH',R(),{m:null,v:Date.now(),a:null,rw:null,xt:null,ch:null},6).then(function(){location.reload()});else location.reload()}
function copyURL(b){var u=stuURL(),ok=function(){b.textContent='✅ 複製 好了';setTimeout(function(){b.textContent='📋 複製 網址'},2000)};
  try{navigator.clipboard.writeText(u).then(ok,function(){fb()})}catch(e){fb()}
  function fb(){var t=document.createElement('textarea');t.value=u;document.body.appendChild(t);t.select();try{document.execCommand('copy');ok()}catch(e){}t.remove()}}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#pwgo')){pwGo();return}
  if((b=c('[data-sc]'))){H.cls=b.getAttribute('data-sc');H.g=H.cls.charAt(0)==='3'?3:4;H.qg=H.g;chLoad();setDraw();return}
  if((b=c('[data-sk]'))){H.game=b.getAttribute('data-sk');setDraw();return}
  if((b=c('[data-qg]'))){H.qg=+b.getAttribute('data-qg');setDraw();return}
  if((b=c('[data-sa]'))){var on=b.getAttribute('data-sa')==='1';(LIST[H.qg]||[]).forEach(function(k){H.sets[H.qg+'_'+k]=on});setDraw();return}
  if((b=c('[data-sb]'))){var k=H.qg+'_'+b.getAttribute('data-sb');H.sets[k]=!H.sets[k];setDraw();return}
  if((b=c('[data-sn]'))){H.n=+b.getAttribute('data-sn');setDraw();return}
  if((b=c('[data-ch]'))){H.ch=+b.getAttribute('data-ch');setDraw();return}
  if((b=c('[data-x15]'))){H.x15=+b.getAttribute('data-x15');setDraw();return}
  if((b=c('[data-cg]'))){var g0=b.getAttribute('data-cg');H.cOk[g0]=!H.cOk[g0];setDraw();return}
  if(c('#chOpen')){H.chOpen=H.cls;setDraw();return}
  if(c('#chGo')){chPick();return}
  if((b=c('[data-cpk]'))){chChose(b.getAttribute('data-cpk'));return}
  if(c('#chNo')){$('#chpk').hidden=true;return}
  if(c('#lgGo')){legPick();return}
  if((b=c('[data-lpk]'))){legChose(b.getAttribute('data-lpk'));return}
  if(c('#htut')){tutOpen();return}
  if((b=c('[data-tut]'))){tutShow(b.getAttribute('data-tut'));return}
  if(c('#tutx')){$('#tutov').hidden=true;return}
  if((b=c('[data-si]'))){H.int=+b.getAttribute('data-si');setDraw();return}
  if(c('#mk')){mkRoom();return}
  if((b=c('#lcopy'))){copyURL(b);return}
  if(c('#go')){start();return}
  if(c('#hgo')){hgo();return}
  if(c('#hgo2')){next();return}
  if(c('#hear')){var q=H.Q[H.qi];LV.say(q.al?BASE+q.al.replace(/^\.\.\//,''):'',q.ae,1);return}
  if(c('#resay')){var q2=H.Q[H.qi];LV.say(q2.au?BASE+q2.au.replace(/^\.\.\//,''):'',q2.ae,1);return}
  if((b=c('[data-say]'))){var s=H.S[+b.getAttribute('data-say')];LV.say(s.au?BASE+s.au.replace(/^\.\.\//,''):'',s.ae,1);return}
  if(c('#hpz')){H.pz=!H.pz;if(H.pz){clearTimeout(H.tm);H.left=H.dur-(Date.now()-H.t0);$('#hpz').textContent='▶ 繼續'}else{H.t0=Date.now()-(H.dur-H.left);$('#hpz').textContent='⏸ 暫停';tick()}return}
  if(c('#hint')){H.int=H.int?0:1;$('#hint').textContent=H.int?'😆 干擾：開':'✖ 干擾：關';putM({int:H.int});return}
  if(c('#hsay')){H.say=H.say?0:1;$$('.hsay').forEach(function(x){x.textContent=H.say?'🗣 自動 唸：開':'🗣 自動 唸：關'});if(!H.say)LV.stopSay();return}
  if(c('#tana')){anaShow();return}
  if(c('#tcer')){cerShow();return}
  if(c('#give')){give();return}
  if(c('#close')||c('#close2')){if(confirm('結束 這一場？（學生 會 回到 等待 畫面）'))closeGame();return}
});
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&document.activeElement&&document.activeElement.id==='pw')pwGo();
  if((e.key===' '||e.key==='ArrowRight')&&!/INPUT|TEXTAREA/.test((document.activeElement||{}).tagName||'')){if(H.scr==='hq'){e.preventDefault();hgo()}else if(H.scr==='hlb'){e.preventDefault();next()}}});
(function(){try{var p=sessionStorage.getItem('lvpw');if(p&&LDB.on()){H.pw=p;setDraw();scr('hset');post({a:'pw',pw:p}).then(function(j){if(j&&j.ok){H.champs=j.champs||{};if(H.scr==='hset')setDraw()}},function(){});return}}catch(e){}scr('hpw')})();

/* ══ 2026-10-26 第二十七次 第 2 點（老師 選 C30 第 4 題「照 表 做」）：⚔ 階級 愈高 能力 愈強 ══
   伺服器 {a:'pw'} 多 給：sq ＝ 老師 說 可以 的 ✍ 學生 出題、tiers ＝ 每一個 人 的 階級（只有 5 碼）。
   ✍ ★★★ 出 的 題 ＝ 題目 第 3 步 多 一組「✍ 同學 出 的 題」（大螢幕 寫「✍ 出題人：304 班 12 號」）；
   🧑‍🏫 ★★★★ 小老師 ＝ 公布 答案 的 時候〔🧑‍🏫 請 小老師〕➜ 點 一位 ➜ 全螢幕「請 上台 說 一次 為什麼」；
   ⭐ ★★★★★ 傳說戰神 ＝ 一個月 1 次 幫 全班 選 遊戲（用過 了 ＝ Firebase rooms/0班/leg {m 月份, ids, game}） */
H.tiers={};H.sq=[];H.lgU={};
function sqAdd(){[3,4].forEach(function(g){var L=H.sq.filter(function(x){return String(x.id).charAt(0)===String(g)}),k=g+'sq';if(!L.length)return;
  GR[k]={sec:'✍ 同學 出 的 題',nm:'✍ 同學 出 的 題',qs:L.map(function(x){return {ty:'mc',t:'「'+esc(x.zh)+'」的 英文 是？<br><small class="sqby">✍ 出題人：'+esc(String(x.id).slice(0,3))+' 班 '+(+String(x.id).slice(3))+' 號</small>',o:x.o.map(esc),ot:x.o,h:'',ae:x.o[0],ag:[],az:x.zh,au:''}})};
  LIST[g]=LIST[g]||[];if(LIST[g].indexOf(k)<0)LIST[g].push(k)})}
function tierOf(id){return Math.max(+H.tiers[id]||0,+((H.P||{})[id]||{}).tr||0)}
function tutL(){return ids().filter(function(id){return tierOf(id)>=4})}
function tutOpen(){var o=$('#tutov');if(!o){o=document.createElement('div');o.id='tutov';o.className='tutov';document.body.appendChild(o)}o.hidden=false;var L=tutL();
  o.innerHTML='<div class="tutin"><h1>🧑‍🏫 請 小老師</h1><div class="note big2">★★★★ 雷霆戰神 以上 才 能 當 小老師：點 一位 請 上台</div><div class="tutg">'+L.map(function(id){return '<button data-tut="'+id+'">'+heroI(id,'tuth')+'<b>'+esc(id.slice(0,3))+' 班 '+(+id.slice(3))+' 號</b>'+tbI(id)+'</button>'}).join('')+'</div><button id="tutx" class="ghost">✕ 關閉</button></div>'}
function tutShow(id){var o=$('#tutov');o.innerHTML='<div class="tutin tutok"><div class="tutic">🧑‍🏫</div><h1>小老師：'+esc(id.slice(0,3))+' 班 '+(+id.slice(3))+' 號</h1>'+heroI(id,'tutbig')+'<div class="big2">請 上台，說 一次「為什麼 這一題 選 這個」</div><button id="tutx" class="ghost">✕ 關閉</button></div>';
  if(typeof RPFX!=='undefined'){var r=o.getBoundingClientRect();RPFX.spark(o,r.width*.5,r.height*.4,'thunder',60)}}
function mon(){var d=new Date(Date.now()+288e5);return d.getUTCFullYear()+'-'+(d.getUTCMonth()+1)}
function legOf(){var c=H.cls;if(!c)return null;var L=Object.keys(H.tiers).filter(function(id){return H.tiers[id]>=5&&id.slice(0,3)===c}).sort();return L.length?L:null}
function legLoad(){var c=H.cls;if(!c||H.lgU[c]!==undefined||!LDB.on())return;H.lgU[c]=null;LDB.get('rooms/'+LV.room(c)+'/leg').then(function(v){H.lgU[c]=v||0;if(H.cls===c&&H.scr==='hset')setDraw()},function(){})}
function legBox(){var L=legOf();if(!L)return '';legLoad();var u=H.lgU[H.cls];
  if(u&&u.m===mon())return '<div class="chbox done">⭐ 這個 月 傳說戰神 已經 選過：'+LV.badge(u.game)+' <b>'+esc(LV.game(u.game).nm)+'</b></div>';
  return '<div class="chbox mini"><button id="lgGo" class="chop">⭐ 讓 傳說戰神 選 遊戲</button><span class="note">'+esc(L.map(function(id){return +id.slice(3)+' 號'}).join('、'))+'：★★★★★ 傳說戰神，一個月 1 次 幫 全班 選</span></div>'}
function legPick(){var L=legOf();if(!L)return;var o=$('#chpk');if(!o){o=document.createElement('div');o.id='chpk';document.body.appendChild(o)}o.hidden=false;
  o.innerHTML='<div class="chin"><h1>⭐ 傳說戰神 '+esc(L.map(function(id){return +id.slice(3)+' 號'}).join('、'))+' 請 上台 選 遊戲</h1><div class="note big2">★★★★★ 傳說戰神 的 能力：一個月 1 次 幫 全班 選 現場任務 遊戲</div>'+
    '<div class="chgr">'+chAll().map(function(k){var G=LV.game(k);return '<button data-lpk="'+k+'">'+LV.badge(k,'lg')+'<b>'+esc(G.nm)+'</b><small>'+esc(G.d)+'</small></button>'}).join('')+'</div><button id="chNo" class="ghost">✕ 這次 先 不選</button></div>'}
function legChose(k){var L=legOf();if(!L)return;var w={m:mon(),ids:L,game:k,t:Date.now()};H.lgU[H.cls]=w;H.game=k;if(LDB.on())LDB.must('PUT','rooms/'+LV.room(H.cls)+'/leg',w,6);
  var o=$('#chpk');o.innerHTML='<div class="chin chok"><div class="chcr">⭐</div><h1>傳說戰神 選了</h1><div class="chsel">'+LV.badge(k,'xl')+'<b>'+esc(LV.game(k).nm)+'</b></div></div>';
  if(typeof RPFX!=='undefined'){var r=o.getBoundingClientRect();RPFX.spark(o,r.width*.5,r.height*.5,'star',70)}
  setTimeout(function(){o.hidden=true;setDraw()},2600)}
