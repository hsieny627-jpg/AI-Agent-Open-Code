/* live/_cr_host.js — 🏫 三年級 課堂複習（2026-10-26 第二十九次 第 1 點；老師 C31 說「對」）：只能 在 這個〔⚡ 現場任務 大螢幕〕開。
 * 老師：① 班級（三年級）② 哪一套（📝 三年級 複習／🏫 課堂複習 1／2／3）③ 哪一種 或 哪幾種 遊戲（10 種）④〔🙋 學生 自己 答〕或〔👥 全班 同步〕➜〔▶ 開始〕
 * 寫 Firebase rooms/0304/cr ＝ {on, t, set, gs, m, q, deck}；學生 平板（現場任務 頁）看到 ＝ 自己 跳到 g3mid/index.html?live=0304（三年級 複習 那 10 種 遊戲）。
 * 自己 答：看 crp/5碼（每一個 座號 答了 幾題、對 幾題）；同步：一題 一題（cra/編號/5碼），〔👀 公布 答案〕〔▶ 下一題〕；〔⏹ 結束〕＝ on:0，平板 送 成績（g3gm_c1-q1…）。
 * 資料 CRD ＝ {gs:[[id,圖示,名字]…（關卡 順序）], sets:[[代號,名字]…], B:{代號:{遊戲:[[英文, 中文]…]}}}（live/_build.js 從 g3mid/_data.js 拿） */
var CRS={set:'c1',gs:null,m:'sync',on:false,cfg:null,stop:null,rv:false,ans:{},crp:{}};
/* 2026-10-27 第三十次 2-(2)(4)（老師 選 A「跟 三年級 一樣」）：四年級 的 班 ＝〔📝 四年級 複習〕：📝 四年級 複習（11 種）／🪤 四年級 複習 0（陷阱 偵測器）
   CRDS ＝ {3: 三年級（g3mid/）, 4: 四年級（midterm/）}；only ＝ 每一套 有 哪幾種 遊戲；學生 平板 跳到 midterm/index.html?live=0402 */
function crGr(){return H.cls&&/^[34]/.test(H.cls)?H.cls.charAt(0):''}
function CD(){return CRDS[crGr()||'3']}
function crX(){return /^[xn]\d+$/.test(CRS.set)}   /* 2026-10-29：n25／n50 ＝ 新 25／新 50 */   /* 2026-10-27 第三十二次 3-(3)：📝 25／50 題 挑戰 ＝ 只 能 學生 自己 答、全部 關卡 連著 玩（不用 選 遊戲）*/
function crMin(){var n=+(/\d+/.exec(CRS.set)||[25])[0];if(!CRS.min||CRS.minSet!==CRS.set){CRS.minSet=CRS.set;CRS.min=n>=50?10:5}return CRS.min}   /* 第三十四次 第 12-(4) 點：25 題 5 分鐘、50 題 10 分鐘（老師 可以 換）*/
function crGs(){var d=CD();if(crX())return [];return d.gs.filter(function(g){return !d.only||(d.only[CRS.set]||[]).indexOf(g[0])>=0})}
function crTitle(){return crGr()==='4'?'📝 四年級 期中複習':'📝 三年級 期中複習'}   /* 2026-10-30 第三十四次 第 1-(1)、2-(1) 點：主題 改名（成績 的 名字 不變）*/
function crBox(){var g=crGr();if(g==='4')return '<div class="sgrp crg"><div class="sgh"><span class="sgi">📝</span><b>四年級 期中複習</b><small>12 種 遊戲（字首音 氣球、短文 偵探、陷阱 偵測器…）；學生 自己 答 或 全班 同步</small></div>'+
  '<div class="ggrid"><button data-crgo="1" class="gcd crgo"><span class="crgi">📝</span><span class="gtx"><b>📝 四年級 期中複習</b><small>12 種 遊戲＋25／50 題 挑戰</small></span></button></div></div>';
  var ok=g==='3';return '<div class="sgrp crg"><div class="sgh"><span class="sgi">📝</span><b>三年級 期中複習</b><small>10 種 遊戲（打地鼠、夾娃娃、小精靈…）；學生 自己 答 或 全班 同步</small></div>'+
  '<div class="ggrid"><button data-crgo="1" class="gcd crgo'+(ok?'':' off')+'"><span class="crgi">📝</span><span class="gtx"><b>📝 三年級 期中複習</b><small>'+(ok?'課堂複習 1、2、3／三年級 複習':'① 先 選 三年級 或 四年級 的 班')+'</small></span></button></div></div>'}
function crDraw(){var c=H.cls||'';if(CRS.cls!==c){CRS.cls=c;CRS.set=CD().sets[0][0];CRS.gs=null}   /* 換 班 ＝ 回到 第一套 */
  if(!CD().sets.some(function(x){return x[0]===CRS.set})){CRS.set=CD().sets[0][0];CRS.gs=null}if(!CRS.gs)CRS.gs=crGs().map(function(g){return g[0]});if(crX())CRS.m='self';
  var h='<div class="sett"><h1>'+crTitle()+'　<small>'+esc(c)+' 班</small></h1></div>'+
  '<div class="sbox"><h2><b class="sn">1</b> 哪一套 題目</h2><div class="row">'+CD().sets.map(function(x){return '<button data-crs="'+x[0]+'" class="'+(CRS.set===x[0]?'on':'')+'">'+esc(x[1])+'</button>'}).join('')+'</div></div>'+
  (crX()?'<div class="sbox crxb"><h2><b class="sn">2</b> '+esc(CD().sets.filter(function(x){return x[0]===CRS.set})[0][1])+'</h2><div class="note big2">全部 關卡 連著 玩、每一次 重新 抽（做過 的 題目 先 不出）；學生 自己 答（一個人 或 兩個人 輪流）。<b>時間 到 準時 結束</b>，答了 幾題 就 送 幾題 ➜ 前 10 名 排行榜 ➜ 頒獎 典禮。</div></div>'+
  '<div class="sbox"><h2><b class="sn">3</b> ⏱ 限時 幾 分鐘</h2><div class="row">'+[3,5,8,10,15].map(function(m){return '<button data-crmin="'+m+'" class="crmin'+(crMin()===m?' on':'')+'">'+m+' 分鐘</button>'}).join('')+'</div></div>':'')+
  (crX()?'':'<div class="sbox"><h2><b class="sn">2</b> 哪 幾種 遊戲 <button data-cra="1" class="ghost">☑ 全選</button><button data-cra="0" class="ghost">☐ 全部 不選</button></h2><div class="crgs">'+crGs().map(function(g,i){var on=CRS.gs.indexOf(g[0])>=0;
    return '<button data-crg="'+g[0]+'" class="crgb'+(on?' on':'')+'"><span class="crn">第 '+(i+1)+' 關</span><span class="cric">'+g[1]+'</span><b>'+esc(g[2])+'</b><em>'+(on?'☑':'☐')+'</em></button>'}).join('')+'</div></div>'+
  '<div class="sbox"><h2><b class="sn">3</b> 怎麼 玩</h2><div class="row"><button data-crm="self" class="crmb'+(CRS.m==='self'?' on':'')+'"><b>🙋 學生 自己 答</b><small>每個人 照 自己 的 速度 玩 老師 選 的 遊戲（一種 '+(crGr()==='4'?10:8)+' 題）</small></button>'+
    '<button data-crm="sync" class="crmb'+(CRS.m==='sync'?' on':'')+'"><b>👥 全班 同步</b><small>全班 一起 做 同一題，老師 按〔▶ 下一題〕</small></button></div></div>')+
  '<div class="row mkrow"><button id="crstart" class="big">▶ 開始</button><button id="crback" class="ghost">⬅ 回 設定</button><span id="crmsg" class="note"></span></div>';
  $('#hcr .in').innerHTML=h}
function crShuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function crStart(){var m=$('#crmsg');if(!crGr()){m.textContent='請 先 選 班';return}var gs=crGs().map(function(g){return g[0]}).filter(function(id){return CRS.gs.indexOf(id)>=0});
  if(!gs.length&&!crX()){m.textContent='② 請 選 遊戲';return}if(crX())CRS.m='self';if(!LDB.on()){m.textContent='📶 現場任務 還沒 設定 Firebase';return}
  var deck=[];if(CRS.m==='sync')gs.forEach(function(id){var B=CD().B[CRS.set][id]||[];crShuf(B.map(function(_,i){return i})).slice(0,8).forEach(function(i){deck.push([id,i])})});
  var cfg={on:1,t:Date.now(),set:CRS.set,gs:gs,m:CRS.m,q:CRS.m==='sync'?0:-1,deck:deck};if(crX()){cfg.d=crMin()*60000;cfg.left=cfg.d;cfg.fin=0}H.code=LV.room(H.cls);m.textContent='⏳ 開始 中…';
  LDB.must('PUT','rooms/'+H.code+'/cr',cfg,6).then(function(ok){if(!ok){m.textContent='📶 連不到 Firebase，請 再 按 一次';return}CRS.cfg=cfg;CRS.rv=false;CRS.ans={};CRS.crp={};CRS.lbp={};CRS.t0=Date.now();crRun();scr('hcrr');crPoll();if(cfg.d)crTick()})}
function crPoll(){if(CRS.stop)CRS.stop();var room=H.code,cfg=CRS.cfg;if(!cfg)return;
  var a=LDB.poll('rooms/'+room+'/crp',1200,function(v){CRS.crp=v||{};crRun()}),b=LDB.poll('rooms/'+room+'/cra',1000,function(v){CRS.ans=v||{};crRun()}),d=LDB.poll('rooms/'+room+'/p',1500,function(v){seeP(v);crRun()});CRS.stop=function(){a();b();d()};hqr(true)}
function crName(){for(var i=0;i<CD().sets.length;i++)if(CD().sets[i][0]===CRS.cfg.set)return CD().sets[i][1];return ''}
function crG(id){for(var i=0;i<CD().gs.length;i++)if(CD().gs[i][0]===id)return CD().gs[i];return [id,'','']}
function crPct(a,b){return b?Math.round(a/b*100):0}
function crRun(){var cfg=CRS.cfg;if(!cfg)return;var o=$('#hcrr .in'),h='<div class="sett"><h1>'+esc(crName())+'　<small>'+esc(H.cls)+' 班 · '+(cfg.m==='sync'?'👥 全班 同步':'🙋 學生 自己 答')+'</small></h1></div>';
  var joined=Object.keys(CRS.crp).filter(function(id){return CRS.crp[id]&&CRS.crp[id].t===cfg.t});
  /* 2026-10-27 第三十二次（老師：學生 看不到 任務）：最上面 一條 ＝ 誰 已經 在 平板 上 連上 了（📱 綠）、誰 開始 作答 了（✍️）；還沒 進來 的 ＝ 掃 右下角 QR */
  var on=online().filter(function(id){return id.slice(0,3)===String(H.cls)}),A0=cfg.m==='sync'?CRS.ans[cfg.t+'_'+cfg.q]||{}:CRS.crp;
  h+='<div class="crjn"><span class="crjt">📱 已經 連上 <b>'+on.length+'</b> 人</span>'+(on.length?on.map(function(id){var st=A0[id]&&(cfg.m==='sync'||A0[id].t===cfg.t);return '<span class="crj'+(st?' ok':'')+'">'+(+id.slice(3))+(st?' ✍️':'')+'</span>'}).join(''):'<span class="crjh">👉 請 學生 掃 右下角 QR Code ➜ 打 5 碼 登入 ➜ 自動 進來</span>')+'</div>';
  if(cfg.d){if(!cfg.fin)crLB();return}   /* 2026-10-30 第三十四次 第 12-(3) 點：期中 挑戰 ＝ 即時 排行榜（畫面 不 整個 重畫，名次 滑 上去）*/
  if(cfg.m==='self'){var tn=0,to=0;joined.forEach(function(id){tn+=+CRS.crp[id].n||0;to+=+CRS.crp[id].ok||0});
    h+='<div class="crsum"><span>👥 已經 開始 <b>'+joined.length+'</b> 人</span><span>📝 一共 答了 <b>'+tn+'</b> 題</span><span>🎯 平均 正確率 <b>'+crPct(to,tn)+'</b></span></div><div class="crseat">'+
      joined.sort().map(function(id){var p=CRS.crp[id],g=crG(p.g),r=crPct(+p.ok||0,+p.n||0);return '<div class="crs '+(p.n?(r>=81?'p2':r>=60?'p1':'p0'):'')+'"><b>'+(+id.slice(3))+' 號</b><span>'+g[1]+'</span><small>答 '+(+p.n||0)+' 題 · ✅ '+(+p.ok||0)+'</small></div>'}).join('')+'</div>'+
      (joined.length?'':'<div class="note big2">學生 在〔⚡ 現場任務〕平板 上 會 自動 跳進來（要 先 登入）</div>')+
      '<div class="hbar"><button id="crend" class="big stopb">⏹ 結束</button></div>'}
  else{var q=cfg.q,d=cfg.deck[q]||cfg.deck[0],g=crG(d[0]),A=CRS.ans[cfg.t+'_'+q]||{},ids=Object.keys(A),ok=ids.filter(function(k){return A[k]===1}).length,ex=(CD().B[cfg.set][d[0]]||[])[d[1]]||['',''];
    h+='<div class="crq"><div class="crqn">第 <b>'+(q+1)+'</b> ／ '+cfg.deck.length+' 題</div><div class="crqg"><span>'+g[1]+'</span>'+esc(g[2])+'</div>'+
      '<div class="crqa"><span>✍️ 已經 答 <b>'+ids.length+'</b> 人'+(joined.length?' ／ '+joined.length:'')+'</span><span>✅ 答對 <b>'+ok+'</b> 人</span><span>🎯 <b>'+crPct(ok,ids.length)+'</b></span></div>'+
      (CRS.rv?'<div class="crans"><div class="cre">✅ '+esc(ex[0])+'</div><div class="crz">'+esc(ex[1])+'</div></div>':'<div class="note big2">題目 在 學生 的 平板 上（聽力 題 學生 自己 聽）</div>')+'</div>'+
      '<div class="hbar">'+(CRS.rv?'':'<button id="crrv" class="ghost">👀 公布 答案</button>')+'<button id="crend" class="ghost">⏹ 結束</button><button id="crnx" class="big go">'+(q+1<cfg.deck.length?'▶ 下一題':'🏁 結束，看 結果')+'</button></div>'}
  o.innerHTML=h}
function crNext(){var cfg=CRS.cfg;if(!cfg)return;if(cfg.q+1>=cfg.deck.length){crEnd();return}cfg.q++;CRS.rv=false;LDB.must('PATCH','rooms/'+H.code+'/cr',{q:cfg.q},6);crRun()}
function crEnd(){var cfg=CRS.cfg;if(!cfg)return;LDB.must('PATCH','rooms/'+H.code+'/cr',{on:0},6);if(CRS.stop)CRS.stop();CRS.stop=null;
  /* 結果：同步 ＝ 每一種 遊戲 的 正確率；自己 答 ＝ 每一個 座號 */
  var h='<div class="sett"><h1>🏁 '+esc(crName())+' 結束 了</h1></div>';
  if(cfg.m==='sync'){var per={};cfg.deck.forEach(function(d,i){var A=CRS.ans[cfg.t+'_'+i]||{},k=Object.keys(A),p=per[d[0]]=per[d[0]]||[0,0];p[1]+=k.length;p[0]+=k.filter(function(x){return A[x]===1}).length});
    h+='<div class="crres">'+Object.keys(per).map(function(id){var g=crG(id),r=crPct(per[id][0],per[id][1]);return '<div class="crr '+(per[id][1]?(r>=81?'p2':r>=60?'p1':'p0'):'')+'"><span>'+g[1]+'</span><b>'+esc(g[2])+'</b><em>'+(per[id][1]?r+' 分':'—')+'</em></div>'}).join('')+'</div>'}
  else h+='<div class="note big2">每一個 人 的 成績 已經 送到 老師看板〔🏫 課堂複習〕大表。</div>';
  h+='<div class="note">成績 在 老師看板〔🏫 課堂複習〕（只 算 已經 作答 的 題目；時間 到 沒有 選 ＝ 答錯）</div><div class="hbar"><button id="crhome" class="big go">⬅ 回 設定</button></div>';
  $('#hcrr .in').innerHTML=h;CRS.cfg=null}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if((b=c('[data-crgo]'))){if(!crGr()){var m=$('#mkm');if(m)m.textContent='請 先 選 班';return}crDraw();scr('hcr');return}
  if((b=c('[data-crs]'))){var ns=b.getAttribute('data-crs');if(ns!==CRS.set)CRS.gs=null;CRS.set=ns;crDraw();return}
  if((b=c('[data-crg]'))){var id=b.getAttribute('data-crg'),i=CRS.gs.indexOf(id);if(i>=0)CRS.gs.splice(i,1);else CRS.gs.push(id);crDraw();return}
  if((b=c('[data-cra]'))){CRS.gs=b.getAttribute('data-cra')==='1'?crGs().map(function(g){return g[0]}):[];crDraw();return}
  if((b=c('[data-crmin]'))){CRS.min=+b.getAttribute('data-crmin');CRS.minSet=CRS.set;crDraw();return}
  if((b=c('[data-crm]'))){CRS.m=b.getAttribute('data-crm');crDraw();return}
  if(c('#crstart')){crStart();return}if(c('#crback')||c('#crhome')){setDraw();scr('hset');return}
  if(c('#crrv')){CRS.rv=true;crRun();return}if(c('#crnx')){crNext();return}if(c('#crend')){if(CRS.cfg&&CRS.cfg.d&&!CRS.cfg.fin){crUp();return}crEnd();return}
  if(c('#crxa')){crShowX();return}if(c('#crxe')){crEnd();return}});

/* ══ 2026-10-30 第三十四次 第 10、12 點：📝 期中 挑戰（25／50 題、新 25／新 50）在 大螢幕 ══
   ① 限時（crTick：每 0.5 秒 算 還剩 多久，每 5 秒 寫 一次 rooms/0班/cr/left 給 平板 倒數）② 作答 中 ＝ 即時 排行榜（crLB：前 10 名 一列 一列，名次 換 了 ＝ 滑 上去／下去、▲ 往上 幾名、👑 新 的 第 1 名）
   ③ 時間 到（crUp）＝ 寫 fin:1 ➜ 平板 答了 幾題 就 送 幾題 ➜ 等 6 秒 收 最後 的 分數 ➜ crShowX：🏆 前 10 名（最 後面 的 名次 在 最下面，一個一個 往上 翻開）➜ ⚔ 前 5 名 決戰 ➜ 🥉🥈🥇 ➜ 頒獎台（榮譽榜 那一套 GLORY，每一次 不同 風格，沒有 聲音）
   兩人 一台：crp/5碼 的 p ＝ 另一個 人 ➜ 最上面 一條、排行榜 都 寫「12 👥 15」 */
function crLeft(){var c=CRS.cfg;return c&&c.d?Math.max(0,c.d-(Date.now()-CRS.t0)):0}
function crMM(ms){var x=Math.ceil(ms/1000);return Math.floor(x/60)+':'+('0'+x%60).slice(-2)}
function crTick(){clearInterval(CRS.tk);var last=0;CRS.tk=setInterval(function(){var c=CRS.cfg;if(!c||!c.d||c.fin){clearInterval(CRS.tk);return}var l=crLeft(),k=$('#crclk');
  if(k){k.textContent='⏱ '+crMM(l);k.classList.toggle('lo',l<60000)}
  if(Date.now()-last>5000){last=Date.now();LDB.must('PATCH','rooms/'+H.code+'/cr',{left:l},3)}if(l<=0)crUp()},500)}
function crRows(){var c=CRS.cfg,L=[];Object.keys(CRS.crp).forEach(function(id){var p=CRS.crp[id];if(p&&p.t===c.t)L.push({id:id,s:+p.s||0,ok:+p.ok||0,n:+p.n||0,p:p.p||''})});
  L.sort(function(a,b){return b.s-a.s||b.ok-a.ok||a.n-b.n||(a.id<b.id?-1:1)});var rk=0,pv=null;L.forEach(function(x,i){if(!pv||x.s!==pv.s||x.ok!==pv.ok)rk=i+1;x.rk=rk;pv=x});return L}
function crWho(x){return '<b>'+(+x.id.slice(3))+' 號</b>'+(x.p?'<small class="crdu">👥 和 '+(+String(x.p).slice(3))+' 號 一台</small>':'')}
function crLB(){var c=CRS.cfg,o=$('#hcrr .in');if(!c)return;
  if(CRS.built!==c.t||!$('#crlbw')){CRS.built=c.t;CRS.lbp={};CRS.lead='';
    o.innerHTML='<div class="crxh"><div><h1>'+esc(crName())+'</h1><div class="crxs">'+esc(H.cls)+' 班 · 答 對 愈 多 分數 愈 高 · 時間 到 自動 結束</div></div><div id="crclk" class="crclk">⏱ '+crMM(crLeft())+'</div></div>'+
      '<div id="crjb" class="crjn"></div><div id="crlead" class="crlead"></div><div id="crlbw" class="crlbw"><div class="crlbe">👀 學生 一 開始 答題，名次 就 會 出現 在 這裡</div></div><div id="crrest" class="crrest"></div>'+
      '<div class="hbar"><button id="crend" class="big stopb">⏹ 提早 結束</button></div>'}
  var L=crRows(),on=online().filter(function(id){return id.slice(0,3)===String(H.cls)}),ids={};on.forEach(function(id){ids[id]=1});L.forEach(function(x){ids[x.id]=1;if(x.p)ids[x.p]=1});
  var pair={};L.forEach(function(x){if(x.p)pair[x.id]=x.p});var sh={},chips=Object.keys(ids).sort().filter(function(id){if(sh[id])return false;sh[id]=1;if(pair[id])sh[pair[id]]=1;return true}).map(function(id){var st=L.some(function(x){return x.id===id||x.id===pair[id]});
    return '<span class="crj'+(st?' ok':'')+'">'+(+id.slice(3))+(pair[id]?' 👥 '+(+String(pair[id]).slice(3)):'')+(st?' ✍️':'')+'</span>'});
  $('#crjb').innerHTML='<span class="crjt">📱 已經 連上 <b>'+Object.keys(ids).length+'</b> 人</span>'+(chips.length?chips.join(''):'<span class="crjh">👉 請 學生 掃 右下角 QR Code ➜ 登入 ➜ 自動 進來</span>');
  var W=$('#crlbw'),top=L.slice(0,10);if(top.length){var e=W.querySelector('.crlbe');if(e)e.remove()}
  var have={};[].forEach.call(W.querySelectorAll('.crlr'),function(r){have[r.getAttribute('data-id')]=r});
  top.forEach(function(x,i){var r=have[x.id],pr=CRS.lbp[x.id];delete have[x.id];if(!r){r=document.createElement('div');r.className='crlr nw';r.setAttribute('data-id',x.id);W.appendChild(r)}
    var up=pr!=null&&pr>i?pr-i:0;r.style.top=(i*10)+'%';r.className='crlr'+(i===0?' g1':i===1?' g2':i===2?' g3':'')+(up?' up':'')+(pr==null?' nw':'');
    r.innerHTML='<span class="crrk">'+(x.rk<=3?['🥇','🥈','🥉'][x.rk-1]:x.rk)+'</span><span class="crhi">'+heroI(x.id,'crhim')+'</span><span class="crnm">'+crWho(x)+'</span><span class="crbar"><i style="width:'+Math.max(2,x.s)+'%"></i></span><span class="crsc">'+x.s+'<small> 分</small></span><span class="crok">✅ '+x.ok+' ／ '+x.n+'</span>'+(up?'<em class="crup">▲ '+up+'</em>':'');
    CRS.lbp[x.id]=i});
  Object.keys(have).forEach(function(id){have[id].remove();delete CRS.lbp[id]});
  if(top[0]&&top[0].s>0&&top[0].id!==CRS.lead){var was=CRS.lead;CRS.lead=top[0].id;if(was){var b=$('#crlead');b.innerHTML='👑 新 的 第 1 名：'+(+top[0].id.slice(3))+' 號！';b.classList.remove('on');void b.offsetWidth;b.classList.add('on')}}
  $('#crrest').innerHTML=L.length>10?'<span class="crrt">第 11 名 以後：</span>'+L.slice(10).map(function(x){return '<span>'+x.rk+'. '+(+x.id.slice(3))+' 號 '+x.s+' 分</span>'}).join(''):''}
function crUp(){var c=CRS.cfg;if(!c||c.fin)return;c.fin=1;clearInterval(CRS.tk);LDB.must('PATCH','rooms/'+H.code+'/cr',{fin:1,left:0},6);
  var o=$('#hcrr .in'),n=6;o.innerHTML='<div class="crup0"><div class="cru1">⏰</div><div class="cru2">時間 到！</div><div class="cru3">📝 收 成績 中… <b id="crun">'+n+'</b></div></div>';
  var tm=setInterval(function(){n--;var e=$('#crun');if(e)e.textContent=n;if(n<=0){clearInterval(tm);crShowX()}},1000)}
function crShowX(){var c=CRS.cfg||CRS.lastX;if(!c)return;CRS.lastX=c;if(CRS.stop){CRS.stop();CRS.stop=null}var L=crRows().filter(function(x){return x.n>0}),gst=GLORY.pick(),st=$('#crgl');
  if(!st){st=document.createElement('div');st.id='crgl';st.innerHTML='<div id="crgls"></div><div class="crglb"><button id="crxs" class="ghost">⏭ 跳過</button><button id="crxa" class="ghost">🔁 再 看 一次</button><button id="crxe" class="big go">⏹ 結束（學生 回 現場任務）</button></div>';document.body.appendChild(st)}
  st.classList.add('on');var S=$('#crgls'),w=function(x){return '<span class="crgw">'+heroI(x.id,'crghi')+'<span>'+esc(H.cls)+' 班 '+(+x.id.slice(3))+' 號</span></span>'},v=function(x){return x.s+' 分'};
  var T={};[1,2,3].forEach(function(r){var a=L.filter(function(x){return x.rk===r});if(a.length)T[r]=a.map(function(x){return {w:w(x),v:v(x),l:'答對 '+x.ok+' 題'}})});
  var D={kick:esc(H.cls)+' 班　'+esc(crName()),aw:'',title:'🏆 前 10 名',ic:'🏆',per:'',rows:L.filter(function(x){return x.rk>=4&&x.rk<=10}).map(function(x){return {rk:x.rk,w:w(x),v:v(x)}}),top:T};
  var P=[{g:0,t:5200}];if(D.rows.length)P.push({g:1,t:1800+D.rows.length*1250+1600});if(L.length>=4)P.push({f5:1,t:8200});if(T[3])P.push({g:2,t:6800});if(T[2])P.push({g:3,t:7400});if(T[1])P.push({g:4,t:11500});if(L.length)P.push({g:5,t:9000});
  if(!L.length){S.className='';S.innerHTML='<div class="crnone">這一場 還沒有 人 答題</div>';return}
  var i=0;clearTimeout(CRS.gt);(function nx(){var p=P[i];if(!p)return;try{if(p.f5){GLORY.stop(S);crF5(S,L.slice(0,5))}else GLORY.scene(S,gst,p.g,D,false)}catch(e){}i++;CRS.gt=setTimeout(nx,window.__NOGO?60:p.t)})();
  CRS.skip=function(){clearTimeout(CRS.gt);GLORY.stop(S);try{GLORY.scene(S,gst,5,D,false)}catch(e){}}}
/* ⚔ 前 5 名 決戰：5 張 卡 一起 數分數 ➜ 第 5、4 名 退下 ➜ 前 3 名 發光「🔥 前 3 名 決戰！」 */
function crF5(S,L){S.className='crf5';var sh=L.slice().sort(function(){return Math.random()-.5});
  S.innerHTML='<div class="f5t">⚔ 前 5 名 決戰！</div><div class="f5r">'+sh.map(function(x){return '<div class="f5c" data-rk="'+x.rk+'">'+heroI(x.id,'f5h')+'<b>'+(+x.id.slice(3))+' 號</b><span class="f5s" data-v="'+x.s+'">0</span><em></em></div>'}).join('')+'</div><div class="f5b"></div>';
  var t0=Date.now(),D=2600,cs=S.querySelectorAll('.f5s');(function cnt(){var k=Math.min(1,(Date.now()-t0)/D);[].forEach.call(cs,function(e){e.textContent=Math.round(+e.getAttribute('data-v')*k)+' 分'});if(k<1&&S.className==='crf5')requestAnimationFrame(cnt)})();
  setTimeout(function(){[].forEach.call(S.querySelectorAll('.f5c'),function(c){var r=+c.getAttribute('data-rk');c.querySelector('em').textContent=r<=3?'':'第 '+r+' 名';c.classList.add(r<=3?'win':'out')});var b=S.querySelector('.f5b');if(b)b.textContent='🔥 前 3 名 決戰！'},window.__NOGO?10:3600)}
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#crxs')&&CRS.skip)CRS.skip()});
var crEnd0=crEnd;crEnd=function(){var g=$('#crgl');if(g){g.classList.remove('on');clearTimeout(CRS.gt);try{GLORY.stop($('#crgls'))}catch(e){}}clearInterval(CRS.tk);if(!CRS.cfg&&CRS.lastX){CRS.cfg=CRS.lastX}CRS.lastX=null;CRS.built=null;crEnd0()};
