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
function crLW(t){t=t||CRS.set;return t==='lw'||t==='la'||t==='lf'||t==='az'}function crX(){return /^[xng]\d+$/.test(CRS.set)||CRS.set==='c25'||CRS.set==='vs'||crLW()}   /* 2026-11-02 第四十次 第 5 點：✍️ 字母 書寫 也 是 限時、即時 排行榜 */   /* 2026-10-29：n25／n50 ＝ 新 25／新 50 */   /* 2026-10-27 第三十二次 3-(3)：📝 25／50 題 挑戰 ＝ 只 能 學生 自己 答、全部 關卡 連著 玩（不用 選 遊戲）*/
/* 2026-10-31 第三十六次 第 1-(5) 點：每 一關 前面 多 了 🎬 秒懂 複習 動畫（一部 約 1 分 10 秒，含 3 題 突擊 測驗）➜ 預設 限時 加上 動畫 的 時間：
   三年級 11 關 ≈ 13 分鐘 動畫 ➜ 25 題 20 分鐘、50 題 25 分鐘；四年級 13 關 ≈ 16 分鐘 ➜ 25 題 25 分鐘、50 題 30 分鐘（老師 可以 換）*/
function crMin(){var n=+(/\d+/.exec(CRS.set)||[25])[0],g4=String((typeof H!=='undefined'&&H&&H.cls)||'').charAt(0)==='4',k=CRS.set+'|'+g4;if(!CRS.min||CRS.minSet!==k){CRS.minSet=k;CRS.min=CRS.set==='vs'?10:CRS.set==='az'?11:crLW()?5:CRS.set==='g25'?12:CRS.set==='c25'?15:g4?(n>=50?20:15):(n>=50?15:10)}return CRS.min}   /* 2026-11-02 第四十次 第 4-(5) 點：現場任務 不 演 秒懂 動畫 了 ➜ 預設 時間 變 短（三年級 25 題 10、50 題 15；四年級 15、20；✍️ 字母 書寫 5 分鐘）*/   /* 第三十四次 第 12-(4) 點：25 題 5 分鐘、50 題 10 分鐘（老師 可以 換）*/
function crGs(){var d=CD();if(crX())return [];return d.gs.filter(function(g){return !d.only||(d.only[CRS.set]||[]).indexOf(g[0])>=0})}
function crTitle(){return crGr()==='4'?'📝 四年級 期中複習':'📝 三年級 期中複習'}   /* 2026-10-30 第三十四次 第 1-(1)、2-(1) 點：主題 改名（成績 的 名字 不變）*/
function crBox(){var g=crGr();if(g==='4')return '<div class="sgrp crg"><div class="sgh"><span class="sgi">📝</span><b>四年級 期中複習</b><small>12 種 遊戲（字首音 氣球、短文 偵探、陷阱 偵測器…）；學生 自己 答 或 全班 同步</small></div>'+
  '<div class="ggrid"><button data-crgo="1" class="gcd crgo"><span class="crgi">📝</span><span class="gtx"><b>📝 四年級 期中複習</b><small>12 種 遊戲＋25／50 題 挑戰</small></span></button></div></div>';
  var ok=g==='3';return '<div class="sgrp crg"><div class="sgh"><span class="sgi">📝</span><b>三年級 期中複習</b><small>10 種 遊戲（打地鼠、夾娃娃、小精靈…）；學生 自己 答 或 全班 同步</small></div>'+
  '<div class="ggrid"><button data-crgo="1" class="gcd crgo'+(ok?'':' off')+'"><span class="crgi">📝</span><span class="gtx"><b>📝 三年級 期中複習</b><small>'+(ok?'課堂複習 1、2、3／三年級 複習':'① 先 選 三年級 或 四年級 的 班')+'</small></span></button></div></div>'}
function crDraw(){var c=H.cls||'';if(CRS.cls!==c){CRS.cls=c;CRS.set=CD().sets[0][0];CRS.gs=null}   /* 換 班 ＝ 回到 第一套 */
  if(!CD().sets.some(function(x){return x[0]===CRS.set})){CRS.set=CD().sets[0][0];CRS.gs=null}if(!CRS.gs)CRS.gs=crGs().map(function(g){return g[0]});if(crX())CRS.m='self';
  var h='<button id="crback2" class="crtr">⬅ 回 設定</button>'+'<div class="sett"><h1>'+crTitle()+'　<small>'+esc(c)+' 班</small></h1></div>'+
  '<div class="sbox"><h2><b class="sn">1</b> 哪一套 題目</h2><div class="row">'+CD().sets.map(function(x){return '<button data-crs="'+x[0]+'" class="'+(CRS.set===x[0]?'on':'')+'">'+esc(x[1])+'</button>'}).join('')+'</div></div>'+
  (CRS.set==='vs'?vsBox():crX()?'<div class="sbox crxb"><h2><b class="sn">2</b> '+esc(CD().sets.filter(function(x){return x[0]===CRS.set})[0][1])+'</h2><div class="note big2">'+(crLW()?(CRS.set==='az'?'🔠 依 順序 背 寫 <b>A a ➜ B b ➜ … ➜ Z z</b>（26 頁，一頁 一個 字母：① 大寫 ➜ ② 小寫；順序 不可以 錯）。一頁 限時 <b>'+(CRS.as||25)+' 秒</b>，時間 到 沒 寫完 ＝ 錯、自動 下一頁；整個 測驗 ＝ 下面 選 的 分鐘，時間 到 還 沒 寫到 的 字母 ＝ 錯。<div class="row">⏱ 一頁 幾 秒：'+[15,20,25,30].map(function(x){return '<button data-cras="'+x+'" class="crmin'+((CRS.as||25)===x?' on':'')+'">'+x+' 秒</button>'}).join('')+'</div>':CRS.set==='la'?'一回 10 題：🔊 聽 一個 <b>字母</b> ➜ 寫 它 的 <b>大寫</b> 或 <b>小寫</b>（10 個 字母 不 重複）':CRS.set==='lf'?'一回 10 題：🔊 聽 一個 <b>單字</b> ➜ 寫 它 的 <b>第一個 字母</b> 的 <b>大寫</b> 或 <b>小寫</b>（不用 考卷 的 字）':'一回 10 題（5 題 跟 期中考 <b>相同</b>、5 題 其他 字母）：看 字母 ➜ 寫 它 的 <b>大寫</b> 或 <b>小寫</b>')+'（四線格 放大、頂天 立地 不超線）。開始 前 一段 秒懂 動畫。<br>🏆 排行榜：先 比 <b>💯 正確率</b>，一樣 再 比 <b>⚡ 遊戲 積分</b>（寫 對 又 快 ＝ 積分 高）。</div></div><div class="sbox"><h2><b class="sn">3</b> ⏱ 限時 幾 分鐘</h2><div class="row">'+(CRS.set==='az'?[5,8,10,11,15]:[3,5,8,10]).map(function(m){return '<button data-crmin="'+m+'" class="crmin'+(crMin()===m?' on':'')+'">'+m+' 分鐘</button>'}).join('')+'</div></div>':CRS.set==='c25'?'25 題：前 15 題 <b>CVC 遊戲</b>（每 一個 學生、每 一回合 組合 都 不一樣）＋ 最後 10 題 <b>課本 單字</b>（'+(String((H&&H.cls)||'').charAt(0)==='4'?'四年級 My Home':'三年級 We Can Help')+'）。<b>時間 到 準時 結束</b>，答了 幾題 就 送 幾題 ➜ 排行榜 先 比 <b>💯 正確率</b>。</div></div><div class="sbox"><h2><b class="sn">3</b> ⏱ 限時 幾 分鐘</h2><div class="row">'+[8,10,12,15].map(function(m){return '<button data-crmin="'+m+'" class="crmin'+(crMin()===m?' on':'')+'">'+m+' 分鐘</button>'}).join('')+'</div></div>':'全部 關卡 連著 玩、每一次 重新 抽（做過 的 題目 先 不出）；學生 自己 答（一個人 或 兩個人 輪流）。<b>時間 到 準時 結束</b>，答了 幾題 就 送 幾題 ➜ 前 10 名 排行榜 ➜ 頒獎 典禮。</div></div>'+
  '<div class="sbox"><h2><b class="sn">3</b> ⏱ 限時 幾 分鐘</h2>'+
   '<div class="crqk"><b>⚡ 快下課（快速 複習）</b><small>題目 先 出 這一班 最常 錯 的 3 關</small><div class="row">'+[1,2,3,5,8,10].map(function(m){return '<button data-crmin="'+m+'" class="crmin qk'+(crMin()===m?' on':'')+'">'+m+' 分鐘 作答</button>'}).join('')+'</div></div>'+
   '<div class="crqk full"><b>📝 完整</b><div class="row">'+[12,15,20,25,30,40].map(function(m){return '<button data-crmin="'+m+'" class="crmin'+(crMin()===m?' on':'')+'">'+m+' 分鐘</button>'}).join('')+'</div></div>'+
   '<div class="note">💯 分數 ＝ <b>正確率</b>（答對 ÷ 已經 答 的 題數）：時間 到、提早 結束、沒有 做完，都 公平。</div></div>'):'')+
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
  var cfg={on:1,t:Date.now(),set:CRS.set,gs:gs,m:CRS.m,q:CRS.m==='sync'?0:-1,deck:deck};if(crX()){cfg.d=crMin()*60000;cfg.left=cfg.d;cfg.fin=0}if(CRS.set==='az')cfg.as=CRS.as||25;if(CRS.set==='vs'){cfg.vm=CRS.vm==='c'?'c':'e';cfg.qs=CRS.vqs||15;cfg.tp=CRS.vtp||''}H.code=LV.room(H.cls);m.textContent='⏳ 開始 中…';
  if(crX()&&!crLW()&&CRS.set!=='c25'&&CRS.set!=='vs'&&crMin()<=10&&!CRS.qgDone){m.textContent='⏳ 找 這一班 最常 錯 的 3 關…';crQG(function(qg){CRS.qgDone=1;crStart();CRS.qgDone=0},1);return}if(crX()&&!crLW()&&CRS.set!=='c25'&&CRS.set!=='vs'&&crMin()<=10){cfg.qk=1;cfg.qg=CRS.qg||[]}   /* 第三十八次 C44 ④ B：5／8／10 分鐘 ＝ ⚡ 快速 模式 */
  LDB.must('PUT','rooms/'+H.code+'/cr',cfg,6).then(function(ok){if(!ok){m.textContent='📶 連不到 Firebase，請 再 按 一次';return}CRS.cfg=cfg;CRS.ended=0;CRS.rv=false;CRS.ans={};CRS.crp={};CRS.lbp={};CRS.t0=Date.now();crPrevB();crRun();scr('hcrr');crPoll();if(cfg.d)crTick()})}
function crPoll(){if(CRS.stop)CRS.stop();var room=H.code,cfg=CRS.cfg;if(!cfg)return;
  var a=LDB.poll('rooms/'+room+'/crp',1200,function(v){CRS.crp=v||{};crRun()}),b=LDB.poll('rooms/'+room+'/cra',1000,function(v){CRS.ans=v||{};crRun()}),d=LDB.poll('rooms/'+room+'/p',1500,function(v){seeP(v);crRun()});CRS.stop=function(){a();b();d()};hqr(true)}
function crName(){for(var i=0;i<CD().sets.length;i++)if(CD().sets[i][0]===CRS.cfg.set)return CD().sets[i][1];return ''}
function crG(id){for(var i=0;i<CD().gs.length;i++)if(CD().gs[i][0]===id)return CD().gs[i];return [id,'','']}
function crPct(a,b){return b?Math.round(a/b*100):0}
function crRun(){var cfg=CRS.cfg;if(!cfg)return;crPrevB();var o=$('#hcrr .in'),h='<div class="sett"><h1>'+esc(crName())+'　<small>'+esc(H.cls)+' 班 · '+(cfg.m==='sync'?'👥 全班 同步':'🙋 學生 自己 答')+'</small></h1></div>';
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
function crEnd(){var cfg=CRS.cfg;if(!cfg)return;CRS.ended=1;LDB.must('PATCH','rooms/'+H.code+'/cr',{on:0},6);if(CRS.stop)CRS.stop();CRS.stop=null;
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
  if((b=c('[data-cras]'))){CRS.as=+b.getAttribute('data-cras');crDraw();return}   /* 第五十二次 第 7 點：🔠 A～Z 一頁 幾 秒 */
  if((b=c('[data-crmin]'))){CRS.min=+b.getAttribute('data-crmin');CRS.minSet=CRS.set+'|'+(String((H&&H.cls)||'').charAt(0)==='4');   /* 第四十七次：以前 記 的 跟 crMin 比 的 不一樣 ➜ 按了 分鐘 又 變回 預設 */crDraw();return}
  if((b=c('[data-crm]'))){CRS.m=b.getAttribute('data-crm');crDraw();return}
  if(c('#crstart')){crStart();return}if(c('#crback')||c('#crback2')||c('#crhome')){setDraw();scr('hset');return}if(c('.crprev')){crPrev();return}
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
function crRows(){var c=CRS.cfg,L=[];Object.keys(CRS.crp).forEach(function(id){var p=CRS.crp[id];if(p&&p.t===c.t)L.push({id:id,s:+p.s||0,ok:+p.ok||0,n:+p.n||0,p:p.p||'',gp:+p.gp||0,b0:p.b0,b1:p.b1,lr:+p.lr||0})});
  /* 2026-11-01 第三十九次（老師 C45 ③ 甲）：正確率 計分，答 1～2 題 也 可能 100 分 ➜ 答不到 CRMIN（5）題 的 不 排 名次、不上 前 10 名（分數 照樣 記），排在 最 後面、寫「答 N 題」 */
  crHB(c,L);L.forEach(function(x){x.few=x.n<CRMIN});var VSO=c.set==='vs';L.sort(function(a,b){return (a.few-b.few)||b.s-a.s||(VSO?b.gp-a.gp||b.ok-a.ok:b.ok-a.ok||b.gp-a.gp)||a.n-b.n||(a.id<b.id?-1:1)});var rk=0,pv=null;L.forEach(function(x,i){if(x.few){x.rk=0;return}if(!pv||x.s!==pv.s||(!VSO&&x.ok!==pv.ok)||x.gp!==pv.gp)rk=i+1;x.rk=rk;pv=x});return L}
var CRMIN=5;
function crWho(x){return x.p?'<span class="crduo"><span class="crdp">'+nmI(x.id)+'</span><span class="crdp"><i>👥</i>'+nmI(x.p)+'</span></span>':nmI(x.id)}   /* 2026-11-09 第四十五次 第 2-(2) 點：兩人 一台 ＝ 兩個 名字 一樣 大（以前 第二位 是 0.6 倍 的 小字）*/
/* 2026-11-09 第四十五次 第 2-(1) 點（老師：排行榜 讓 教室 充滿 鬥志 和 笑聲 ➜ 每一次 呈現 都 不一樣、更 有趣 更 刺激）：
   10 種 主題 每 一場 換 一種（跟 上一場 一定 不一樣，localStorage cr_lbt）：跑道、車子、尾巴 的 特效、終點、超車 的 話 都 不同；
   每 一行 多 一句「🎯 再 對 N 題 ➜ 超車！」（怕 被 追上、想 追上）、第 1 名「🛡 守住！第 2 名 只 差 N 分」；全部 用 正向 的 話 */
var LBT=[{k:'race',n:'🏎 極速 賽車 大賽',v:'🏎️',tr:'🔥',f:'🏁',ov:'🏎️ 加速 超車！',ld:'👑 新 車王'},{k:'rocket',n:'🚀 火箭 衝 太空',v:'🚀',tr:'✨',f:'🪐',ov:'🚀 點火 超越！',ld:'👑 新 太空 艦長'},
 {k:'ocean',n:'🏄 衝浪 大 挑戰',v:'🏄',tr:'💦',f:'🏝️',ov:'🌊 乘 浪 超車！',ld:'👑 新 浪王'},{k:'balloon',n:'🎈 熱氣球 飛 上 天',v:'🎈',tr:'☁️',f:'🏆',ov:'🎈 飛 過去 了！',ld:'👑 新 天空 之 王'},
 {k:'dragon',n:'🐉 神龍 火焰 競速',v:'🐉',tr:'🔥',f:'🏯',ov:'🐉 神龍 擺尾 超車！',ld:'👑 新 龍王'},{k:'snow',n:'🏂 雪山 滑雪 賽',v:'🏂',tr:'❄️',f:'🚩',ov:'🏂 甩尾 超車！',ld:'👑 新 雪山 王'},
 {k:'train',n:'🚂 魔法 列車 衝刺',v:'🚂',tr:'💨',f:'🚉',ov:'🚂 全速 超車！',ld:'👑 新 列車長'},{k:'rainbow',n:'🦄 彩虹 獨角獸 賽跑',v:'🦄',tr:'🌟',f:'🌈',ov:'🦄 彩虹 衝刺！',ld:'👑 新 彩虹 王'},
 {k:'ufo',n:'🛸 外星 飛碟 光速 賽',v:'🛸',tr:'⚡',f:'🌌',ov:'🛸 光速 超越！',ld:'👑 新 銀河 王'},{k:'horse',n:'🏇 草原 駿馬 賽',v:'🏇',tr:'💨',f:'🏆',ov:'🏇 衝 過 去 了！',ld:'👑 新 冠軍 騎士'}];
function crLBT(){var l=-1;try{l=+(localStorage.getItem('cr_lbt')||-1)}catch(e){}var i=Math.floor(Math.random()*LBT.length);if(i===l)i=(i+1+Math.floor(Math.random()*(LBT.length-1)))%LBT.length;try{localStorage.setItem('cr_lbt',String(i))}catch(e){}return LBT[i]}
/* 差 幾題：要 再 對 k 題（一直 對）才 會 超過 上一名 的 分數 */
function crNeed(x,a){if(!a)return 0;for(var k=1;k<=9;k++)if((x.ok+k)*100/(x.n+k)>a.s+1e-9)return k;return 0}
function crGap(x,i,top){if(i===0){var b=top[1];return b?'🛡 守住！第 2 名 差 '+Math.max(0,Math.round((x.s-b.s)*10)/10)+' 分':'👑 領先 中！'}var k=crNeed(x,top[i-1]);return k?'🎯 再 對 <b>'+k+'</b> 題 ➜ 超車！':'💪 全 對 衝 衝 衝！'}
function crLB(){var c=CRS.cfg,o=$('#hcrr .in');if(!c)return;
  if(CRS.built!==c.t||!$('#crlbw')){CRS.built=c.t;CRS.lbp={};CRS.lsc={};CRS.ovt='';CRS.lead='';if(CRS.lbtT!==c.t){CRS.lbtT=c.t;CRS.lbt=crLBT()}
    o.innerHTML='<div class="crxh"><div><h1>'+esc(crName())+'</h1><div class="crxs">'+esc(H.cls)+' 班 · 分數 ＝ 正確率（答對 ÷ 已經 答 的 題數）'+(crLW(c.set)?' · 一樣 再 比 ⚡ 遊戲 積分':c.set==='vs'?' · 一樣 再 比 ⚡ 正確＋速度 · '+esc(VSM[c.vm==='c'?'c':'e'])+' · 一題 '+(c.qs||15)+' 秒':'')+(c.qk?' · ⚡ 快速 模式':'')+' · 時間 到 自動 結束</div></div><div id="crclk" class="crclk">⏱ '+crMM(crLeft())+'</div></div>'+
      '<div id="crjb" class="crjn"></div><div id="crlead" class="crlead"></div>'+'<div class="vsw2"><div class="vsl"><div class="vsh">🏆 全班 排行榜 <small>前 10 名</small></div>'+'<div id="crlbw" class="crlbw lbt lbt-'+CRS.lbt.k+'"><div class="crlbe">👀 學生 一 開始 答題，名次 就 會 出現 在 這裡</div></div>'+'</div><div class="vsr"><div class="vsh pg">🚀 進步 排行榜 <small>前 5 名・跟 最近 的 自己 比</small></div><div id="crpg" class="crpg"></div></div></div>'+'<div id="crrest" class="crrest"></div>'+
      '<div class="hbar"><span class="crlf">⏱ 只 剩：</span>'+[1,2,3,5,8,10].map(function(m){return '<button data-crleft="'+m+'" class="'+(m===3?'ghost cr3':'ghost')+'">'+m+' 分鐘</button>'}).join('')+'<button id="crend" class="big stopb">⏹ 提早 結束</button></div>'}
  var L=crRows(),on=online().filter(function(id){return id.slice(0,3)===String(H.cls)}),ids={};on.forEach(function(id){ids[id]=1});L.forEach(function(x){ids[x.id]=1;if(x.p)ids[x.p]=1});
  var pair={};L.forEach(function(x){if(x.p)pair[x.id]=x.p});var sh={},chips=Object.keys(ids).sort().filter(function(id){if(sh[id])return false;sh[id]=1;if(pair[id])sh[pair[id]]=1;return true}).map(function(id){var st=L.some(function(x){return x.id===id||x.id===pair[id]});
    return '<span class="crj'+(st?' ok':'')+'">'+(+id.slice(3))+(pair[id]?' 👥 '+(+String(pair[id]).slice(3)):'')+(st?' ✍️':'')+'</span>'});
  $('#crjb').innerHTML='<span class="crjt">📱 已經 連上 <b>'+Object.keys(ids).length+'</b> 人</span>'+(chips.length?chips.join(''):'<span class="crjh">👉 請 學生 掃 右下角 QR Code ➜ 登入 ➜ 自動 進來</span>');
  var W=$('#crlbw'),top=L.filter(function(x){return !x.few}).slice(0,10);if(top.length){var e=W.querySelector('.crlbe');if(e)e.remove()}
  var have={};[].forEach.call(W.querySelectorAll('.crlr'),function(r){have[r.getAttribute('data-id')]=r});
  top.forEach(function(x,i){var r=have[x.id],pr=CRS.lbp[x.id];delete have[x.id];if(!r){r=document.createElement('div');r.className='crlr nw';r.setAttribute('data-id',x.id);W.appendChild(r)}
    var up=pr!=null&&pr>i?pr-i:0;r.style.top=(i*10)+'%';r.className='crlr'+(i===0?' g1':i===1?' g2':i===2?' g3':'')+(up?' up':'')+(pr==null?' nw':'');
    /* 2026-11-03 第四十二次 第 4 點（老師：更 秒懂、更 好玩、更 刺激）：🏎 賽道 排行榜：每 一個 人 一條 跑道，自己 的 戰士 跑 到 分數 的 位置（100 分 ＝ 🏁）；
       超車 ＝ 綠色 閃光＋「🚀 超車 ▲2」＋ 大 橫幅；前 3 名 跑道 冒 🔥；第 1 名 戰士 戴 👑；分數 一格 一格 跳 上去 */
    var ps=CRS.lsc[x.id];if(ps==null)ps=0;
    var LT=CRS.lbt||LBT[0];r.innerHTML='<span class="crrk">'+(x.rk<=3?['🥇','🥈','🥉'][x.rk-1]:x.rk)+'</span><span class="crnm">'+crWho(x)+(vsP(x)>0?'<em class="vspb">📈 ＋'+vsP(x)+'</em>':'')+'</span><span class="crtrk'+(i<3?' hot':'')+'"><i style="width:'+Math.max(2,x.s)+'%"></i><span class="crrun" style="left:'+Math.max(2,Math.min(96,x.s))+'%">'+(i===0?'<b class="crcw">👑</b>':'')+'<em class="crveh">'+LT.v+'</em>'+heroI(x.id,'crhim')+(i<3?'<em class="crfl">'+LT.tr+'</em>':'')+'<i class="crsh"></i></span><span class="crfin">'+LT.f+'</span></span><span class="crsc"><b data-v="'+x.s+'" data-f="'+ps+'">'+ps+'</b><small> 分</small></span><span class="crok">答 '+x.n+' 題 · ✅ '+x.ok+(crLW(c.set)||c.set==='vs'?' · ⚡ '+x.gp:'')+'<small class="crgap">'+crGap(x,i,top)+'</small></span>'+(up?'<em class="crup">'+LT.ov+' ▲ '+up+'</em>':'');
    if(up>=1&&i<3&&CRS.ovt!==x.id+':'+i){CRS.ovt=x.id+':'+i;var bo=$('#crlead');if(bo&&i>0){bo.innerHTML=(CRS.lbt||LBT[0]).ov+' '+nmI(x.id)+' ➜ 第 '+(i+1)+' 名！';bo.classList.remove('on');void bo.offsetWidth;bo.classList.add('on')}}
    CRS.lsc[x.id]=x.s;CRS.lbp[x.id]=i});
  [].forEach.call(W.querySelectorAll('.crsc b[data-v]'),function(b){var f=+b.getAttribute('data-f'),v=+b.getAttribute('data-v');if(f===v)return;var t0=performance.now();(function tk(){var k=Math.min(1,(performance.now()-t0)/700);b.textContent=Math.round(f+(v-f)*k);if(k<1)requestAnimationFrame(tk)})()});
  Object.keys(have).forEach(function(id){have[id].remove();delete CRS.lbp[id]});vsProg(L);
  if(top[0]&&top[0].s>0&&top[0].id!==CRS.lead){var was=CRS.lead;CRS.lead=top[0].id;if(was){var b=$('#crlead');b.innerHTML=(CRS.lbt||LBT[0]).ld+'：'+nmI(top[0].id)+'！';b.classList.remove('on');void b.offsetWidth;b.classList.add('on')}}
  var R2=L.filter(function(x){return !x.few}).slice(10),F=L.filter(function(x){return x.few});
  $('#crrest').innerHTML=(R2.length?'<span class="crrt">第 11 名 以後：</span>'+R2.map(function(x){return '<span>'+x.rk+'. '+nmI(x.id)+' '+x.s+' 分（答 '+x.n+' 題）</span>'}).join(''):'')+
   (F.length?'<span class="crrt">✍️ 答 滿 '+CRMIN+' 題 才 排 名次：</span>'+F.map(function(x){return '<span>'+nmI(x.id)+' 答 '+x.n+' 題</span>'}).join(''):'')}
function crUp(){var c=CRS.cfg;if(!c||c.fin)return;c.fin=1;clearInterval(CRS.tk);LDB.must('PATCH','rooms/'+H.code+'/cr',{fin:1,left:0},6);
  var o=$('#hcrr .in'),n=6;o.innerHTML='<div class="crup0"><div class="cru1">⏰</div><div class="cru2">時間 到！</div><div class="cru3">📝 收 成績 中… <b id="crun">'+n+'</b></div></div>';
  var tm=setInterval(function(){n--;var e=$('#crun');if(e)e.textContent=n;if(n<=0){clearInterval(tm);crShowX()}},1000)}
function crShowX(){var c=CRS.cfg||CRS.lastX;if(!c)return;CRS.lastX=c;crHSave(c);if(CRS.stop){CRS.stop();CRS.stop=null}var L=crRows().filter(function(x){return x.n>0&&!x.few}),st=$('#crgl');
  if(!st){st=document.createElement('div');st.id='crgl';st.innerHTML='<div id="crgls"></div><div class="crglb"><span id="awb2"></span><button id="crxs" class="ghost">⏭ 直接 看 頒獎台</button><button id="crxa" class="ghost">🔁 再 看 一次</button><button id="crxe" class="big go">⏹ 結束（學生 回 現場任務）</button></div>';document.body.appendChild(st)}
  st.classList.add('on');var S=$('#crgls');$('#awb2').innerHTML=AWD.bar();
  if(!L.length){AWD.stop(S);S.className='';S.innerHTML='<div class="crnone">這一場 還沒有 人 答題</div>';return}
  /* 2026-11-03 第四十二次 第 4 點（老師）：新 頒獎 典禮 AWD：開場 ➜ 第 10～6 名 ➜ 第 5、4 名 ➜ 第 3、2 名 升 上 頒獎台 ➜ 心跳 懸疑 3 2 1 ➜ 第 1 名 ➜ 全部 站 上 頒獎台；
     3D 舞台、每一次 不同 主題＋配樂；班級 號碼＋中文 全名；下面〔🦸 戰士〕〔🐾 寵物〕〔⚔ 武器〕〔🎵 配樂〕開／關 */
  var rows=L.filter(function(x){return x.rk>=1&&x.rk<=10}).map(function(x){return awRow(x.id,x.rk,x.s+' 分','答 '+x.n+' 題 · ✅ 答對 '+x.ok+(crLW(c.set)||c.set==='vs'?' · ⚡ '+x.gp:''))});
  var go=function(){AWD.play(S,{kick:esc(H.cls)+' 班',title:'🏆 '+crName()+' 頒獎 典禮',rows:rows},{done:function(){vsAfterAwd(S,L)}})};go();CRS.awGo=go;
  CRS.skip=function(){AWD.skip(S)}}
/* ⚔ 前 5 名 決戰：5 張 卡 一起 數分數 ➜ 第 5、4 名 退下 ➜ 前 3 名 發光「🔥 前 3 名 決戰！」 */
function crF5(S,L){S.className='crf5';var sh=L.slice().sort(function(){return Math.random()-.5});
  S.innerHTML='<div class="f5t">⚔ 前 5 名 決戰！</div><div class="f5r">'+sh.map(function(x){return '<div class="f5c" data-rk="'+x.rk+'">'+heroI(x.id,'f5h')+'<b>'+(+x.id.slice(3))+' 號</b><span class="f5s" data-v="'+x.s+'">0</span><em></em></div>'}).join('')+'</div><div class="f5b"></div>';
  var t0=Date.now(),D=2600,cs=S.querySelectorAll('.f5s');(function cnt(){var k=Math.min(1,(Date.now()-t0)/D);[].forEach.call(cs,function(e){e.textContent=Math.round(+e.getAttribute('data-v')*k)+' 分'});if(k<1&&S.className==='crf5')requestAnimationFrame(cnt)})();
  setTimeout(function(){[].forEach.call(S.querySelectorAll('.f5c'),function(c){var r=+c.getAttribute('data-rk');c.querySelector('em').textContent=r<=3?'':'第 '+r+' 名';c.classList.add(r<=3?'win':'out')});var b=S.querySelector('.f5b');if(b)b.textContent='🔥 前 3 名 決戰！'},window.__NOGO?10:3600)}
var crEnd0=crEnd;crEnd=function(){var g=$('#crgl');if(g){g.classList.remove('on');clearTimeout(CRS.gt);try{GLORY.stop($('#crgls'))}catch(e){}try{AWD.stop($('#crgls'))}catch(e){}}clearInterval(CRS.tk);if(!CRS.cfg&&CRS.lastX){CRS.cfg=CRS.lastX}CRS.lastX=null;CRS.built=null;crEnd0()};

/* ══ 2026-11-01 第三十八次 C44 ④ B＋第 7、8 點（老師 選 甲）══
   開始 前 選〔5／8／10 分鐘 作答〕＝ ⚡ 快速 模式（cfg.qk：每個 學生 的 秒懂 動畫 只 演 第 1 關；cfg.qg ＝ 這一班 最常 錯 的 3 關 先 出）；
   作答 中 按〔5／8／10 分鐘〕＝ 從 現在 起 還 剩 那麼 久，而且 換成 快速（還沒 看 的 動畫 不 演）；分數 一律 正確率（score/_calc.js 的 lc）。
   最常 錯 的 關 ＝ 老師看板 同一份 資料（a:'teacher'，這一班、這個 年級 的 25／50 題 挑戰、新 25／50、🏠 25 題 闖關 的 每一題，照 XORD／XORD2 對 到 關）；拿不到 ＝ 照 原來 順序 */
function crQG(cb){var d=CD(),done=0,fin=function(L){if(done)return;done=1;CRS.qg=L||[];cb(CRS.qg)};setTimeout(function(){fin([])},7000);
  if(!H.pw||typeof post!=='function'){fin([]);return}
  post({a:'teacher',pw:H.pw}).then(function(j){if(!j||!j.rows||!j.cols){fin([]);return}var ci=function(k){return j.cols.indexOf(k)},iS=ci('題組'),iC=ci('班級'),iQ=ci('每題'),iX=ci('作廢'),W={},N={},g=crGr();
    j.rows.forEach(function(r){var set=String(r[iS]||''),m=new RegExp('^g'+g+'gm_(g3m|mt)-([xnh])(25|50)$').exec(set);if(!m||String(r[iC])!==String(H.cls)||r[iX])return;var xo=m[2]==='n'?d.xo2:d.xo,qs;
      try{qs=typeof r[iQ]==='string'?JSON.parse(r[iQ]||'[]'):(r[iQ]||[])}catch(e){qs=[]}qs.forEach(function(q){var id=xo[+q[5]];if(!id)return;N[id]=(N[id]||0)+1;if(!q[0])W[id]=(W[id]||0)+1})});
    fin(Object.keys(N).filter(function(id){return N[id]>=3}).sort(function(a,b){return W[b]/N[b]-W[a]/N[a]||(W[b]||0)-(W[a]||0)}).slice(0,3))},function(){fin([])})}
/* 作答 中：〔5／8／10 分鐘〕＝ 從 現在 起 */
function crSetLeft(mn){var c=CRS.cfg;if(!c||!c.d||c.fin)return;c.d=Date.now()-CRS.t0+mn*60000;c.qk=1;LDB.must('PATCH','rooms/'+H.code+'/cr',{d:c.d,left:mn*60000,qk:1},6);var k=$('#crclk');if(k)k.textContent='⏱ '+crMM(crLeft());
  var b=$('#crlead');if(b){b.innerHTML='⏱ 從 現在 起 還 剩 '+mn+' 分鐘（⚡ 快速：不 再 演 動畫）';b.classList.remove('on');void b.offsetWidth;b.classList.add('on')}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-crleft]');if(b)crSetLeft(+b.getAttribute('data-crleft'))});

/* 2026-11-12 第四十七次 第 3-(3) 點：開始 以後 右上角、右下角〔⬅ 回 上一頁〕＝ 回到 這一套 的 設定 頁（#hcr）。
   還在 進行 ＝ 先 問 老師「這一場 先 結束？」（已經 答 的 題目 都 會 記 成績），確定 才 結束 再 回去；已經 結束 ＝ 直接 回去 */
function crPrevB(){var w=$('#hcrr');if(w&&!w.querySelector('.crprev'))w.insertAdjacentHTML('afterbegin','<button class="crprev crtr">⬅ 回 上一頁</button><button class="crprev crbr">⬅ 回 上一頁</button>')}
function crPrev(){var c=CRS.cfg,run=c&&c.on&&!c.fin&&!CRS.ended;
  if(run&&!(window.__CRPREVOK||confirm('這一場 還 在 進行。\n回 上一頁 ＝ 先 結束 這一場（已經 答 的 題目 都 會 記 成績）。\n確定 嗎？')))return;
  clearInterval(CRS.tk);if(CRS.stop)CRS.stop();CRS.stop=null;if(run)LDB.must('PATCH','rooms/'+H.code+'/cr',{on:0},6);
  var A=document.querySelector('.awd');if(A&&window.AWD)AWD.stop(A);CRS.cfg=null;crDraw();scr('hcr')}

/* ══ 2026-11-14 第五十四次：⚔️ 左右 對戰（兩人 一台 iPad 左右 分割；平板 vs/index.html；規格 vs/CLAUDE.md）══
   設定：老師 選 模式（戊 各自 闖關 PK【預設】／丙 同 一題・防抄／乙 同 一題・位置 不同）＋ 限時（預設 10 分鐘）。
   作答 中：左 6 成 ＝ 🏆 全班 排行榜 前 10 名（💯 正確率，一樣 再 比 ⚡ 正確＋速度；一個 人 一行，兩 人 一台 也 不 算 一組）；
           右 4 成 ＝ 🚀 進步 排行榜 前 5 名（📈 ＝（💯 進步 幾分 ＋ ⚡ 進步 幾分）÷ 2，跟「最近 3 次 的 平均」比；只 寫 ＋幾分，不 寫 上次 幾分；
           第一次 玩、答 不到 5 題 ＝ 不上；本來 就 100 分、這次 又 100 ＝ 🛡 保持 滿分 另外 一行）。
   結束：先 🏆 全班 排行榜 頒獎（AWD）➜〔🌟 下一個：進步 之星〕➜ 🌟 進步 之星 頒獎 典禮（score/_grow.js，風格 完全 不同、壓軸）。 */
/* 2026-11-15 第五十五次（老師 試用 以後）：1 刪「戊」、按了 ＝ 🔒；2 刪「丙」「・防抄」；3 乙（同 一題・位置 不同）刪除（理由 寫 在 vs/CLAUDE.md）；
   4 每一題 幾 秒 老師 先 選（cfg.qs）；7 任何 一個 主題 都 可以（cfg.tp ＝ vs/t/年級_主題.js，VSTL ＝ vs/t/list.json）*/
var VSM={e:'🎯 各自 闖關 PK',c:'🔒 同 一題'};
function vsBox(){var m=CRS.vm==='c'?'c':'e',qs=CRS.vqs||15,g=String(H.cls||'').charAt(0)==='4'?4:3,TL=(typeof VSTL!=='undefined'&&VSTL[g])||[],tp=CRS.vtp||'';
  if(tp&&!TL.some(function(x){return x.k===tp}))tp=CRS.vtp='';
  var D=[['e','🎯 各自 闖關 PK','左右 題目 不一樣、正確 答案 也 不一樣 ➜ 偷看 沒有 用；兩 人 是 對手 ➜ 不會 想 告訴 對方','✅ 建議'],
   ['c','🔒 同 一題','同 一題、選項 位置 不同；按了 只 顯示 🔒，兩 人 都 答完 才 一起 公布','程度 差不多 的 兩 人']];
  var sec={};TL.forEach(function(x){(sec[x.sec]=sec[x.sec]||[]).push(x)});
  return '<div class="sbox crxb"><h2><b class="sn">2</b> ⚔️ 左右 對戰：選 模式</h2><div class="vsmode">'+D.map(function(x){return '<button data-vsm="'+x[0]+'" class="vsmb'+(m===x[0]?' on':'')+'"><b>'+x[1]+'</b><span>'+x[2]+'</span><em>'+x[3]+'</em></button>'}).join('')+'</div>'+
   '<div class="note big2">兩 人 一台 iPad：左半 ＝ 坐 左邊 的 人、右半 ＝ 坐 右邊 的 人（也 可以 一個 人）。兩 人 都 答完 才 公布；答錯 的 題目 等一下 換 一題 再 考（答對 ＝ ✨ 學會 了）。<br>🏆 全班 排行榜：💯 正確率，一樣 再 比 ⚡ 正確＋速度。🚀 進步 排行榜：跟 自己 最近 3 次 的 平均 比。</div></div>'+
   '<div class="sbox"><h2><b class="sn">3</b> 📚 題目：哪 一個 主題</h2><div class="vstp"><button data-vtp="" class="vtpb vtp0'+(tp===''?' on':'')+'"><b>⚔️ 左右 對戰 專用 題</b><small>同 一個 句型 只 換 一個 字（建議）</small></button>'+
     Object.keys(sec).map(function(s0){return '<div class="vtps"><span>'+esc(s0)+'</span>'+sec[s0].map(function(x){return '<button data-vtp="'+esc(x.k)+'" class="vtpb'+(tp===x.k?' on':'')+'">'+esc(x.nm)+'<small>'+x.n+' 題</small></button>'}).join('')+'</div>'}).join('')+
     '<div class="note">🎧 聽力題 不 放（兩 人 一台，同時 放 聲音 會 互相 干擾）。</div></div></div>'+
   '<div class="sbox"><h2><b class="sn">4</b> ⏱ 每一題 幾 秒</h2><div class="row">'+[10,12,15,20,25].map(function(n){return '<button data-vqs="'+n+'" class="crmin'+(qs===n?' on':'')+'">'+n+' 秒</button>'}).join('')+'</div></div>'+
   '<div class="sbox"><h2><b class="sn">5</b> ⏱ 整個 任務 限時 幾 分鐘</h2><div class="row">'+[5,8,10,15].map(function(n){return '<button data-crmin="'+n+'" class="crmin'+(crMin()===n?' on':'')+'">'+n+' 分鐘</button>'}).join('')+'</div></div>'}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-vtp],[data-vqs]');if(!b)return;if(b.hasAttribute('data-vtp'))CRS.vtp=b.getAttribute('data-vtp');else CRS.vqs=+b.getAttribute('data-vqs');crDraw()});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-vsm]');if(b){CRS.vm=b.getAttribute('data-vsm');crDraw()}});
/* 2026-11-16 第五十六次（老師：每一次 現場任務 都 要 全班 前 10 名＋進步 前 5 名 即時 排行榜、兩場 頒獎 典禮）：
   進步 ＝ 跟 自己 最近 3 次 同一個 任務 的 平均 比。⚔️ 左右 對戰 照舊 用 平板 送 來 的（伺服器 最近 3 次）；其他 任務 ＝ 這台 大螢幕 電腦 記 的（crh_任務_5碼，localStorage，不用 部署）。
   有 ⚡ 遊戲 積分 的 任務（字母 書寫、A～Z、左右 對戰）＝（💯 進步＋⚡ 進步）÷ 2；其他 ＝ 💯 進步。*/
function crGP(t){return crLW(t)||t==='vs'}
function crHK(c,id){return 'crh_'+c.set+(c.set==='vs'?'_'+(c.tp||''):'')+'_'+id}
function crHL(k){try{return JSON.parse(localStorage.getItem(k)||'[]')||[]}catch(e){return []}}
function crHB(c,L){L.forEach(function(x){if(x.b0!=null)return;var h=crHL(crHK(c,x.id)).filter(function(r){return r.t!==c.t}).slice(-3);if(!h.length)return;
  var a=0,b=0,nb=0;h.forEach(function(r){a+=+r.s||0;if(r.g!=null){b+=+r.g;nb++}});x.b0=Math.round(a/h.length*10)/10;if(nb)x.b1=Math.round(b/nb*10)/10})}
function crHSave(c){if(!c||!c.t||CRS.hsv===c.t)return;CRS.hsv=c.t;crRows().forEach(function(x){if(x.n<CRMIN)return;var k=crHK(c,x.id),h=crHL(k).filter(function(r){return r.t!==c.t});
  h.push({t:c.t,s:x.s,g:crGP(c.set)?x.gp:null});try{localStorage.setItem(k,JSON.stringify(h.slice(-10)))}catch(e){}})}
function vsP(x){var t=(CRS.cfg||CRS.lastX||{}).set;if(x.n<CRMIN||x.b0==null)return null;if(!crGP(t)||x.b1==null)return Math.round((x.s-(+x.b0))*10)/10;return Math.round(((x.s-(+x.b0))+(x.gp-(+x.b1)))/2*10)/10}
function vsKeep(x){return x.n>=CRMIN&&+x.b0===100&&x.s===100}
function vsTop(L){return L.map(function(x){return {x:x,p:vsP(x)}}).filter(function(o){return o.p!=null&&o.p>0&&!vsKeep(o.x)}).sort(function(a,b){return b.p-a.p||b.x.s-a.x.s||(a.x.id<b.x.id?-1:1)}).slice(0,5)}
function vsD(a,b){var d=Math.round((a-(+b))*10)/10;return (d>=0?'＋':'－')+Math.abs(d)}
function vsProg(L){var o=$('#crpg');if(!o)return;var T=vsTop(L),K=L.filter(vsKeep);
  o.innerHTML=(T.length?T.map(function(t,i){var x=t.x;return '<div class="vsg'+(i===0?' g1':'')+'"><span class="vsgr">'+(i+1)+'</span>'+heroI(x.id,'crhim')+'<span class="vsgn">'+nmI(x.id)+'<small>💯 '+vsD(x.s,x.b0)+(x.b1!=null&&crGP((CRS.cfg||CRS.lastX||{}).set)?'　⚡ '+vsD(x.gp,x.b1):'')+'</small></span><b class="vsgp">📈 ＋'+t.p+'</b></div>'}).join('')
    :'<div class="vsge">🌱 答 滿 5 題、而且 以前 玩過 的 人，進步 了 就 會 出現 在 這裡</div>')+(K.length?'<div class="vsgk">🛡 保持 滿分：'+K.map(function(x){return nmI(x.id)}).join('、')+'</div>':'')}
function vsAfterAwd(){clearTimeout(CRS.vsT);CRS.vsT=setTimeout(function(){var g=$('#crgl');if(!g||!g.classList.contains('on')||$('#vsgo'))return;var b=$('#awb2');if(b)b.insertAdjacentHTML('afterbegin','<button id="vsgo" class="big go">🌟 下一個：進步 之星 ➜</button>')},window.__AWDFAST?50:5000)}
function vsGrow(){var c=CRS.cfg||CRS.lastX;if(!c)return;try{AWD.stop($('#crgls'))}catch(e){}var L=crRows();
  var T=vsTop(L),rows=T.map(function(t,i){var x=t.x;return {rk:i+1,nm:nmI(x.id),hero:heroI(x.id,'grhi'),pr:t.p,ds:vsD(x.s,x.b0),dg:x.b1!=null&&crGP(c.set)?vsD(x.gp,x.b1):''}});
  var g=$('#vsgrow');if(!g){g=document.createElement('div');g.id='vsgrow';document.body.appendChild(g)}
  GROW.play(g,{kick:esc(H.cls)+' 班',rows:rows,keep:L.filter(vsKeep).map(function(x){return nmI(x.id)})},{done:function(){if(!$('#vsgx'))g.insertAdjacentHTML('beforeend','<div class="grbar" id="vsgx"><button id="vsgr" class="ghost">🔁 再 看 一次</button><button id="vsge" class="big go">⏹ 結束（學生 回 現場任務）</button></div>')}});
  g.insertAdjacentHTML('beforeend','<div class="grbar0"><button id="vsgs" class="ghost">⏭ 直接 看 最後</button></div>')}
document.addEventListener('click',function(e){var t=e.target;if(!t.closest)return;if(t.closest('#vsgo')||t.closest('#vsgr')){vsGrow();return}
  if(t.closest('#vsgs')){window.__GROWFAST=1;vsGrow();setTimeout(function(){window.__GROWFAST=0},3000);return}
  if(t.closest('#vsge')){var g=$('#vsgrow');if(g){try{GROW.stop(g)}catch(x){}g.remove()}crEnd();return}});

/* ══ 2026-11-15 第五十五次 第 1-(2) 點：🔠 A～Z 依序 背寫 ➜ 第二次 測驗 以後 還 有 錯 的 學生：老師 決定 要不要 開 第三次 ══
   平板 寫 rooms/0班/az2/5碼 ＝ {r 第幾次 做完, w 還 錯 的 字母, ok, n, t 這一場}；老師 按〔🔓 開 第三次〕＝ rooms/0班/az3/5碼 ＝ 這一場 的 t（平板 讀到 就 開始）。
   右下角 一顆〔🔠 第三次：老師 決定〕（有 人 第二次 做完 還 有 錯 才 亮），點 ＝ 一張 表。 */
var AZ3={on:0,d:{},open:{},stop:null};
function az3Watch(){if(AZ3.stop||typeof LDB==='undefined'||!LDB.poll||!H.code)return;
  AZ3.stop=LDB.poll('rooms/'+H.code+'/az2',1500,function(v){AZ3.d=v||{};az3Btn();if(AZ3.on)az3Draw()});
  LDB.poll('rooms/'+H.code+'/az3',2000,function(v){AZ3.open=v||{};if(AZ3.on)az3Draw()})}
function az3List(){var c=CRS.cfg||CRS.lastX,t=c&&c.t;return Object.keys(AZ3.d).filter(function(id){var x=AZ3.d[id];return x&&x.t===t&&x.r>=2&&x.w}).sort()}
function az3Btn(){var b=document.getElementById('az3b'),L=az3List();if(!L.length){if(b)b.remove();return}
  if(!b){b=document.createElement('button');b.id='az3b';b.className='az3b';document.body.appendChild(b);b.onclick=function(){AZ3.on=1;az3Draw()}}
  b.innerHTML='🔠 第三次：老師 決定<b>'+L.length+' 人</b>'}
function az3Draw(){var o=document.getElementById('az3p');if(!o){o=document.createElement('div');o.id='az3p';document.body.appendChild(o)}var c=CRS.cfg||CRS.lastX,t=c&&c.t,L=az3List();
  o.innerHTML='<div class="az3w"><div class="az3h">🔠 A～Z 第二次 背寫 做完、還 有 錯 的 學生<button id="az3x">✖ 關掉</button></div><div class="az3n">老師 按〔🔓 開 第三次〕＝ 那一位 學生 的 平板 馬上 開始 第三次（跟 第二次 一樣：先 看 錯 的 字母 怎麼 寫 ➜ 只 寫 還 錯 的 字母）</div>'+
   (L.length?'<table class="az3t"><tr><th>號碼</th><th>姓名</th><th>第二次</th><th>還 錯 的 字母</th><th></th></tr>'+L.map(function(id){var x=AZ3.d[id],op=AZ3.open[id]===t;
     return '<tr><td>'+esc(id.slice(3))+'</td><td>'+nmI(id)+'</td><td>💯 '+Math.round((x.ok||0)/(x.n||1)*100)+'<small>寫對 '+(x.ok||0)+'／'+(x.n||0)+'</small></td><td class="en az3l">'+esc(x.w)+'</td><td>'+(x.r>=3?'✅ 第三次 做完 了':op?'⏳ 已經 開了':'<button class="az3o" data-az3="'+esc(id)+'">🔓 開 第三次</button>')+'</td></tr>'}).join('')+'</table>':'<div class="az3n">還 沒有。</div>')+'</div>'}
document.addEventListener('click',function(e){var t=e.target;if(!t.closest)return;if(t.closest('#az3x')){AZ3.on=0;var o=document.getElementById('az3p');if(o)o.remove();return}
  var b=t.closest('[data-az3]');if(b){var c=CRS.cfg||CRS.lastX;if(!c)return;var id=b.getAttribute('data-az3');AZ3.open[id]=c.t;var P={};P[id]=c.t;LDB.must('PATCH','rooms/'+H.code+'/az3',P,6);az3Draw()}});
setInterval(function(){var c=CRS.cfg||CRS.lastX;if(c&&c.set==='az')az3Watch()},2000);
