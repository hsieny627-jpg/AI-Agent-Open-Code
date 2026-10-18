/* live/_host_rt.js — ⚡ 現場任務 老師大螢幕（live/host.html）。只寫 ES5。要先載入 live/_db.js、live/_common.js、score/qr.js；網頁裡有 BANK（四選一）、CHAL（挑戰題）、BASE（到 repo 根目錄）。
   2026-10-18 第十一次 重做（規格 live/CLAUDE.md 最上面）：
   流程：🔑 老師密碼 ➜ 一頁 設定（① 班級 ② 遊戲〔🏆 經典搶答 預設〕③ 題目〔預設 全選〕④ 幾題 ⑤ 🔥 挑戰題／干擾）➜〔⚡ 建立 遊戲〕
        ➜ 等人：大大的 QR Code ＋ 登入 3 步 動畫 ＋ 這一種 怎麼玩 動畫 ＋ 加入 的 英雄 一個一個 跳進來（**學生 不用 打 遊戲 號碼**：0＋班級）
        ➜〔▶ 開始〕➜ 怎麼玩 ＋ 3、2、1 ➜ 一題 20 秒（挑戰題 30 秒；全部答完 就 提早）➜ 公布：長條圖＋正解（＋經典搶答：前 5 名）➜ 下一題 … ➜ 頒獎台 3 ➜ 2 ➜ 1 ＋〔🎁 發獎勵〕
   答案只放在這一台（老師的電腦）：題目送出去的時候 **不送答案**，公布的時候才送。分數也是這一台算。 */
var H={pw:'',g:4,cls:'',game:'classic',sets:{},n:10,int:1,ch:1,snd:1,code:'',Q:[],qi:-1,P:{},tot:{},okc:{},st:{},best:{},fxc:{},gs:{},pause:false,tm:null,unA:null,unP:null,A:{},xt:{},rw:{},done:false,log:[],prv:{},phase:''};
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function scr(id){$$('.scr').forEach(function(x){x.hidden=x.id!==id})}
function post(o){var u=String(window.SCORE_URL||'').trim();if(!u)return Promise.reject(new Error('nourl'));return fetch(u,{method:'POST',body:JSON.stringify(o)}).then(function(r){return r.json()})}
function seatOf(id){return +String(id).slice(3)}
function R(p){return 'rooms/'+H.code+(p?'/'+p:'')}
/* ── 聲音（網頁自己做，不用音檔）：倒數 最後 5 秒 滴答、公布、排行榜、頒獎 ── */
var AC=null;function ac(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){AC=null}return AC}
function tone(f,t0,d,type,vol){if(!H.snd)return;var c=ac();if(!c)return;var o=c.createOscillator(),g=c.createGain();o.type=type||'triangle';o.frequency.value=f;
  g.gain.setValueAtTime(0,c.currentTime+t0);g.gain.linearRampToValueAtTime(vol||.15,c.currentTime+t0+.02);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+t0+d);o.connect(g);g.connect(c.destination);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+d+.05)}
var SND={tick:function(){tone(880,0,.08,'square',.06)},rev:function(){[523,659,784,1047].forEach(function(f,i){tone(f,i*.08,.35,'triangle',.14)})},
  lb:function(){[392,494,587].forEach(function(f,i){tone(f,i*.12,.3,'sine',.12)})},go:function(){[262,330,392,523].forEach(function(f,i){tone(f,i*.15,.4,'sawtooth',.08)})},
  drum:function(){for(var i=0;i<14;i++)tone(90+i*4,i*.07,.06,'square',.08)},win:function(){[523,659,784,1047,1319].forEach(function(f,i){tone(f,i*.1,.6,'triangle',.15)})}};
/* ── 🔑 密碼 ── */
function pwGo(){var p=$('#pw').value.trim(),m=$('#pwm');if(!p){m.textContent='請打密碼';return}
  if(!LDB.on()){m.innerHTML='⚠ 現場任務 還沒有 設定 Firebase ➜ 請看 <a href="setup.html">大字版 設定頁</a>';return}
  m.textContent='⏳ 檢查中…';post({a:'pw',pw:p}).then(function(j){if(j&&j.ok){H.pw=p;try{sessionStorage.setItem('lvpw',p)}catch(e){}setDraw();scr('hset')}else m.textContent='❌ 密碼 不對'},function(){m.textContent='📶 連不到 成績系統'})}
/* ── 一頁 設定（預設：經典搶答、題目 全選、10 題、🔥 挑戰題 開）── */
var CLS={3:['304','307','311'],4:['402','406','409','410','400']};
function allSets(g){(BANK[g]||[]).forEach(function(b,i){if(H.sets[g+'_'+i]==null)H.sets[g+'_'+i]=true})}
function setDraw(){allSets(H.g);var G=LV.game(H.game);
  var h='<div class="sett"><h1>⚡ 現場任務</h1><span class="note">選好 ➜ 按 最下面〔⚡ 建立 遊戲〕</span></div>'+
  '<h2><b class="sn">1</b> 哪一班</h2><div class="row">'+[3,4].map(function(g){return CLS[g].map(function(c){return '<button data-sc="'+c+'" class="clsb'+(H.cls===c?' on':'')+'">'+c+(c==='400'?' 課後班':'')+'</button>'}).join('')}).join('<span class="gsep"></span>')+'</div>'+
  '<h2><b class="sn">2</b> 哪一種 遊戲</h2><div class="ggrid">'+LV.GAMES.map(function(x,i){return '<button data-sk="'+x.k+'" class="gcd'+(H.game===x.k?' on':'')+(i===0?' first':'')+'">'+LV.badge(x.k)+'<span class="gtx"><b>'+x.nm+(i===0?' <em>推薦</em>':'')+'</b><small>'+x.d+'</small></span></button>'}).join('')+'</div>'+
  '<h2><b class="sn">3</b> 題目 <span class="note">（'+(H.g===3?'三':'四')+'年級；可以 只選 幾組）</span></h2><div class="row">'+(BANK[H.g]||[]).map(function(b,i){var on=!!H.sets[H.g+'_'+i];return '<button data-sb="'+i+'" class="'+(on?'on':'')+'">'+(on?'☑ ':'☐ ')+esc(b.nm)+'（'+b.qs.length+'）</button>'}).join('')+'</div>'+
  '<h2><b class="sn">4</b> 幾題</h2><div class="row">'+[5,10,15,20].map(function(n){return '<button data-sn="'+n+'" class="'+(H.n===n?'on':'')+'">'+n+' 題（約 '+Math.ceil(n*30/60)+' 分鐘）</button>'}).join('')+'</div>'+
  '<h2><b class="sn">5</b> 加點 刺激</h2><div class="row"><button data-ch="1" class="'+(H.ch?'on':'')+'">🔥 挑戰題 開（拼字、排句子，分數 ✖2）</button><button data-ch="0" class="'+(!H.ch?'on':'')+'">✖ 挑戰題 關</button></div>'+
  (G.fx?'<div class="row"><button data-si="1" class="'+(H.int?'on':'')+'">'+G.fx.ic+' 干擾 開（不扣分、≦ 3 秒）</button><button data-si="0" class="'+(!H.int?'on':'')+'">✖ 干擾 關</button><span class="note">'+esc(G.fx.t)+'</span></div>':'')+
  '<div class="row mkrow"><button id="mk" class="big">⚡ 建立 遊戲</button><span id="mkm" class="note"></span></div>';
  $('#hset .in').innerHTML=h}
function selQs(){var a=[];(BANK[H.g]||[]).forEach(function(b,i){if(H.sets[H.g+'_'+i])a=a.concat(b.qs)});return a}
/* 題目：每 3 題 的 第 3 題 ＝ 🔥 挑戰題（🔤 拼字、🧩 排句子 輪流）；四選一 每題 重洗 選項 */
function mkQ(){var all=LV.shuf(selQs()),C=CHAL[H.g]||{sp:[],or:[]},sp=LV.shuf(C.sp),or=LV.shuf(C.or),Q=[],mi=0,ci=0;
  for(var i=0;i<H.n;i++){
    if(H.ch&&i%3===2&&(sp.length||or.length)){var useSp=(ci%2===0&&sp.length)||!or.length;ci++;
      if(useSp){var w=sp.shift()||C.sp[0],ex=LV.shuf('bcdfghklmnprstvwy'.split('').filter(function(c){return w.en.toLowerCase().indexOf(c)<0})).slice(0,2);
        Q.push({ty:'sp',t:'🔤 拼出 這個 英文 字',zh:w.zh,ic:w.ic,tiles:LV.shuf(w.en.toLowerCase().split('').concat(ex)),a:w.en,h:w.zh+' ＝ '+w.en})}
      else{var s=or.shift()||C.or[0];Q.push({ty:'or',t:'🧩 排出 這一句 英文',zh:s.zh,tiles:LV.shuf(s.w),a:s.w.join('|'),p:s.p,h:s.h||''})}
      continue}
    var q=all[mi++%Math.max(1,all.length)];if(!q)break;
    var ord=LV.shuf([0,1,2,3]),o=ord.map(function(k){return q.o[k]}),a=ord.indexOf(0),x=LV.shuf([0,1,2,3].filter(function(k){return k!==a})).slice(0,2);Q.push({ty:'mc',t:q.q,o:o,a:a,h:q.h||'',x:x})}
  return Q}
function mkRoom(){var m=$('#mkm');if(!H.cls){m.textContent='① 請選 哪一班';return}if(!selQs().length){m.textContent='③ 請選 題目';return}
  H.Q=mkQ();H.n=H.Q.length;H.code=LV.room(H.cls);m.textContent='⏳ 建立 遊戲 中…';
  /* 每一班 固定 一個（0＋班級）：先 清掉 上一場，再 寫 新的 */
  LDB.del(R()).then(function(){return LDB.set(R('m'),{v:2,g:H.g,cls:H.cls,game:H.game,n:H.n,int:H.int,phase:'lobby',made:Date.now()})}).then(function(ok){if(!ok){m.textContent='📶 連不到 Firebase';return}lobby()})}
/* ── 等學生加入：QR Code ＋ 登入 3 步 ＋ 怎麼玩 ── */
function stuURL(){return String(location.href).split('#')[0].split('?')[0].replace(/host\.html$/,'')}
function qrSVG(u){try{var q=qrcode(0,'M');q.addData(u);q.make();return q.createSvgTag({cellSize:8,margin:2,scalable:true})}catch(e){return ''}}
function lobby(){scr('hlob');var G=LV.game(H.game);
  $('#lqr').innerHTML=qrSVG(stuURL());$('#lurl').textContent=stuURL().replace(/^https?:\/\//,'');
  $('#llog').innerHTML=LV.howHTML(LV.LOGIN,'v sm');
  $('#lgame').innerHTML=LV.badge(H.game,'lg')+'<div><b>'+G.nm+'</b><span>'+H.cls+' 班　'+H.n+' 題'+(H.ch?'　🔥 挑戰題 ✖2':'')+'</span></div>';
  $('#lhow').innerHTML=LV.howHTML(G.how);
  if(H.unP)H.unP();H.unP=LDB.listen(R('p'),function(v){H.P=v||{};drawLobby();if(H.qi>=0)drawGame()});
  LDB.listen(R('xt'),function(v){H.xt=v||{}});LDB.listen(R('ch'),function(v){H.ch2=v||{};if(H.game==='king'&&H.qi>=0)drawGame()})}
function ids(){return Object.keys(H.P||{}).filter(function(id){return /^\d{5}$/.test(id)}).sort()}
function heroI(id,cls){var p=H.P[id]||{};return p.h?'<img class="'+(cls||'')+'" src="'+LV.img(BASE,p.h)+'" alt="">':'<span class="noh '+(cls||'')+'">👤</span>'}
function drawLobby(){var L=ids();$('#lcnt').textContent=L.length;
  $('#lpl').innerHTML=L.map(function(id){return '<div class="pl">'+heroI(id)+'<b>'+seatOf(id)+' 號</b></div>'}).join('')}
/* ── ▶ 開始：怎麼玩 ＋ 3、2、1 ── */
function start(){if(!ids().length){$('#lmsg').textContent='還沒有 學生 加入';return}H.qi=-1;H.start=Date.now();
  ids().forEach(function(id){H.tot[id]=0;H.okc[id]=0;H.st[id]=0;H.best[id]=0;H.fxc[id]=0});H.gs=gs0();
  var G=LV.game(H.game);scr('hhow');$('#hhw').innerHTML=LV.badge(H.game,'xl')+'<h1>'+G.nm+'</h1>'+LV.howHTML(G.how,'big')+'<div id="cnt3" class="cnt3"></div>';
  LDB.patch(R('m'),{phase:'how',t0:Date.now()});SND.go();
  var k=0;(function c3(){var t=[6000,1000,1000,1000][k];H.tm=setTimeout(function(){k++;if(k<4){$('#cnt3').textContent=4-k;$('#cnt3').className='cnt3 on';tone(440+k*110,0,.2,'square',.1);c3()}else next()},t)})()}
function next(){clearTimeout(H.tm);clearTimeout(H.tm2);H.qi++;if(H.qi>=H.n){end();return}
  var q=H.Q[H.qi],ext=0;for(var id in H.xt)if(+H.xt[id]===H.qi)ext=5000;var dur=(q.ty==='mc'?LV.DUR:LV.DURCH)+ext;H.dur=dur;H.A={};H.fxNow={};H.t0=Date.now();H.lbOn=false;
  var sq={ty:q.ty,t:q.t};if(q.ty==='mc'){sq.o=q.o;sq.h=q.h;sq.x=q.x}else{sq.zh=q.zh;sq.ic=q.ic||'';sq.tiles=q.tiles;sq.p=q.p||''}
  LDB.patch(R('m'),{phase:'q',qi:H.qi,q:sq,t0:H.t0,dur:dur,rev:null});
  if(H.unA)H.unA();H.unA=LDB.listen(R('a/'+H.qi),function(v){H.A=v||{};drawQ();if(Object.keys(H.A).length>=ids().length&&H.phase==='q')reveal()});
  H.phase='q';scr('hq');$('#hq').className='scr '+(H.game==='classic'?'classic':'side');drawQ();drawGame();tick();
  var F=LV.game(H.game).fx;if(H.int&&F&&F.ms)H.tm2=setTimeout(fxSend,3000+Math.random()*3000)}
function tick(){clearTimeout(H.tm);if(H.phase!=='q')return;var left=Math.max(0,H.dur-(Date.now()-H.t0)),s=Math.ceil(left/1000);
  if(s!==H.lastS){H.lastS=s;if(s<=5&&s>0)SND.tick()}
  $('#qt').textContent=s;$('#qring').style.setProperty('--p',(left/H.dur*100).toFixed(1));$('#qtm').classList.toggle('hurry',s<=5);
  if(left<=0){reveal();return}H.tm=setTimeout(tick,200)}
/* 干擾（系統自動、不扣分）：全班一起的 ＝ 每一個人；其他 ＝ 隨機 1～2 個（每人每場最多 2 次、還沒答的） */
function fxSend(){if(H.phase!=='q')return;var F=LV.game(H.game).fx;if(!F)return;var L=ids().filter(function(id){return (H.fxc[id]||0)<LV.MAXFX&&!H.A[id]});if(!L.length)return;
  var who=F.all?L:LV.shuf(L).slice(0,Math.random()<.5?1:2),now=Date.now();
  who.forEach(function(id){H.fxc[id]=(H.fxc[id]||0)+1;H.fxNow[id]=F.k;LDB.set(R('fx/'+id),{k:F.k,qi:H.qi,at:now})});
  H.log.push({qi:H.qi,k:F.k,n:who.length});drawGame()}
function qTitle(q){return q.ty==='mc'?q.t:'<span class="chal">🔥 挑戰題 分數 ✖2</span><div class="cht">'+q.t+'</div><div class="chz">'+(q.ic?'<span class="chi">'+q.ic+'</span>':'')+esc(q.zh)+'</div>'}
function drawQ(){var q=H.Q[H.qi];if(!q)return;$('#qn').textContent='第 '+(H.qi+1)+' ／ '+H.n+' 題';$('#qq').innerHTML=qTitle(q);
  var rv=H.phase==='rev',D=H.dist||[0,0,0,0],mx=Math.max(1,Math.max.apply(null,D));
  if(q.ty==='mc')$('#qo').innerHTML=q.o.map(function(t,i){return '<div class="qo c'+i+(rv&&i===q.a?' ok':'')+(rv&&i!==q.a?' no':'')+'"><span class="shp">'+LV.SHAPE[i]+'</span><span class="qt">'+t+'</span>'+
    (rv?'<span class="qd"><i style="--h:'+(D[i]/mx*100).toFixed(0)+'%"></i><b>'+D[i]+'</b></span>':'')+(rv&&i===q.a?'<span class="qck">✔</span>':'')+'</div>'}).join('');
  else $('#qo').innerHTML='<div class="chbox">'+(rv?'<div class="chans">✔ '+esc(q.ty==='sp'?q.a:q.a.split('|').join(' ').replace(/ (’|')/g,'$1')+(q.p||''))+'</div><div class="chok">✅ 答對 '+(H.nOk||0)+' 人</div>':
    '<div class="chtiles">'+q.tiles.map(function(t){return '<span>'+esc(t)+'</span>'}).join('')+'</div><div class="note">👆 在 平板 上 照 順序 點</div>')+'</div>';
  $('#qa').innerHTML='✋ <b>'+Object.keys(H.A).length+'</b> ／ '+ids().length+' 人 答了';
  $('#qh').innerHTML=rv&&q.h?'💡 '+q.h:'';$('#qh').hidden=!(rv&&q.h)}
/* ── 公布 ── */
function okOf(q,a){if(!a)return false;if(q.ty==='mc')return Object.prototype.toString.call(a.k)==='[object Array]'?a.k.indexOf(q.a)>=0:a.k===q.a;
  if(q.ty==='sp')return LV.norm(a.s)===LV.norm(q.a);return LV.norm(a.s)===LV.norm(q.a)}
function reveal(){if(H.phase!=='q')return;H.phase='rev';clearTimeout(H.tm);clearTimeout(H.tm2);var q=H.Q[H.qi],sc={},ok1={},cheer=0,hits=[],D=[0,0,0,0],nOk=0;
  H.rk0=rank().map(function(x){return x.id});
  ids().forEach(function(id){var a=H.A[id],f=(a&&a.f)||{},ok=okOf(q,a);
    if(a&&q.ty==='mc'&&typeof a.k==='number')D[a.k]++;
    if(ok){H.st[id]++;H.okc[id]++;nOk++;if(H.st[id]>H.best[id])H.best[id]=H.st[id];hits.push({id:id,ms:a.ms,d:10+Math.min(20,Math.floor((+(H.P[id]||{}).pw||0)/100))})}else if(!f.sh)H.st[id]=0;
    var ff={};for(var k in f)ff[k]=f[k];if(q.ty!=='mc')ff.chal=1;
    var s=LV.score(ok,a?a.ms:H.dur,H.dur,ff,H.st[id]);
    if(f.met)s+=30*Math.min(3,+f.met||0);
    if(ok&&(H.fxNow[id]==='lock'||H.fxNow[id]==='wave'))s+=50;
    if(f.ch)cheer++;sc[id]=s;ok1[id]=ok?1:0;H.tot[id]+=s});
  hits.sort(function(a,b){return a.ms-b.ms});H.hits=hits;H.dist=D;H.nOk=nOk;H.sc=sc;
  gsUp(ok1,hits,cheer);
  var ra=q.ty==='mc'?q.a:q.a;
  LDB.patch(R('m'),{phase:'rev',rev:{qi:H.qi,a:ra,ty:q.ty,h:q.h,d:D,n:nOk},r:{qi:H.qi,sc:sc,tot:H.tot,ok:ok1,st:H.st,okc:H.okc},gs:H.gs});
  SND.rev();drawQ();drawGame();
  /* 經典搶答：長條圖 3 秒 ➜ 前 5 名（名次 往上 往下 會 動）；其他：場景 自己 演 */
  if(H.game==='classic')H.tm3=setTimeout(function(){if(H.phase==='rev'){H.lbOn=true;drawLB();SND.lb()}},3200);
  if(!H.pause)H.tm=setTimeout(next,H.game==='classic'?9000:7000)}
function rank(){return ids().map(function(id){return {id:id,v:H.tot[id]||0}}).sort(function(a,b){return b.v-a.v||(a.id<b.id?-1:1)})}
/* 前 5 名：每一列 從「上一題 的 名次」滑到 現在 的 名次；🔥 連對 */
function drawLB(){var el=$('#lb');if(!el)return;var R0=H.rk0||[],R1=rank().slice(0,5);
  el.innerHTML='<div class="lbt">🏆 前 5 名</div>'+R1.map(function(x,i){var was=R0.indexOf(x.id),dy=(was<0?5:Math.min(5,was))-i;
    return '<div class="lbr'+(i===0?' top':'')+'" style="--dy:'+dy+'"><b class="lbn">'+(i+1)+'</b>'+heroI(x.id,'lbi')+'<span class="lbs">'+seatOf(x.id)+' 號</span>'+(dy>0?'<i class="up">▲ '+dy+'</i>':'')+
      ((H.st[x.id]||0)>=2?'<i class="fire">🔥 '+H.st[x.id]+'</i>':'')+'<em>'+(x.v||0).toLocaleString()+'</em></div>'}).join('');
  el.className='lb on'}
/* ── 遊戲 場景（大螢幕 右邊）── */
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
      (rv&&H.hits?'<div class="hits">'+H.hits.slice(0,12).map(function(x,i){return '<span class="hit1" style="--i:'+i+'">'+heroI(x.id,'hti')+'<b>－'+Math.round(x.d*(G.combo?1.5:1))+'</b></span>'}).join('')+(H.hits.length>12?'<span class="more">＋'+(H.hits.length-12)+' 人</span>':'')+'</div>'+
        (G.combo?'<div class="combo">🤝 全班 答對 8 成 ＝ 連擊 ✖1.5！</div>':'<div class="note c">全班 答對 8 成 ＝ 連擊 ✖1.5</div>'):'<div class="note c">✋ 答對 的 人 ＝ 英雄 飛過去 出招</div>')}
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
    h+='<div class="kg"><div class="kpod">'+[1,0,2].map(function(n){var x=t3[n];return '<div class="kp p'+(n+1)+'">'+(x?(n===0?'<span class="crown">👑</span>':'')+heroI(x.id,'kpi')+'<b>'+seatOf(x.id)+' 號</b><em>'+x.v.toLocaleString()+'</em>':'')+'<div class="kb">'+(n+1)+'</div></div>'}).join('')+'</div>'+
      (chg?'<div class="chg">👊 挑戰者：'+heroI(chg,'chgi')+seatOf(chg)+' 號（台下 答對 最快）</div>':'')+'<div class="kc">📣 台下 加油 <b>'+cc+'</b> 次</div></div>'}
  h+='<div class="rk5">'+R.slice(0,5).map(function(x,i){return '<span><b>'+(i+1)+'</b> '+seatOf(x.id)+' 號 '+(x.v||0).toLocaleString()+'</span>'}).join('')+'</div>';
  el.innerHTML=h}
/* ── 結束：頒獎台 3 ➜ 2 ➜ 1 ＋ 發獎勵 ── */
function end(){H.phase='end';clearTimeout(H.tm);clearTimeout(H.tm3);LDB.patch(R('m'),{phase:'end',r:{qi:H.qi,tot:H.tot,okc:H.okc,st:H.st},gs:H.gs});scr('hend');SND.drum();
  var Rk=rank(),G=H.gs,k=H.game,cnt=[0,0];G.cells.forEach(function(t){if(t!=null)cnt[t]++});
  var res=k==='boss'?(G.hp<=0?'🎉 全班 打倒 魔王！':'魔王 還剩 '+G.hp+' 血 —— 下次 一定 打得倒！'):k==='tug'?(G.tug===0?'🤝 兩隊 平手！':(G.tug>0?'🔵 單號隊':'🔴 雙號隊')+' 贏了 拔河！'):
    k==='map'?(cnt[0]===cnt[1]?'🤝 兩隊 平手！':(cnt[0]>cnt[1]?'🔵 單號隊':'🔴 雙號隊')+' 搶到 比較 多 地！'):k==='pet'?['🥚 龍蛋 快 孵出來 了！','💥 龍蛋 裂開 了！','🐣 孵出 傳說 寵物！','🐲 寵物 長大 了！','🐉 傳說 進化！'][G.pet]:
    k==='treasure'?'🗝 全班 打開 '+G.tr+' 個 寶箱':k==='tower'?'🚩 '+seatOf((Rk[0]||{}).id||'00000')+' 號 爬 最高！':'';
  var bb=0,bi='';ids().forEach(function(id){if((H.best[id]||0)>bb){bb=H.best[id];bi=id}});
  $('#eres').innerHTML=(res?'<div>'+res+'</div>':'')+(bb>=2?'<div class="note big2">🔥 這一場 最長 連勝：'+seatOf(bi)+' 號 '+bb+' 題</div>':'');
  $('#epod').innerHTML=[1,0,2].map(function(n){var x=Rk[n];return '<div class="kp p'+(n+1)+'" style="--d:'+[2.6,1.3,0][n]+'s">'+(x?heroI(x.id,'kpi')+'<b>'+seatOf(x.id)+' 號</b><em>'+x.v.toLocaleString()+' 分</em>':'')+'<div class="kb">'+['🥇','🥈','🥉'][n]+'</div></div>'}).join('');
  setTimeout(SND.win,2800);
  LDB.get(R('rw')).then(function(rw){H.rw=rw||{};var fw=Object.keys(H.rw).filter(function(id){return (H.rw[id]||[]).indexOf('fw')>=0});
    if(fw.length)$('#efw').innerHTML='<div class="fwt">🎇 煙火 送給：</div>'+fw.map(function(id){return heroI(id,'fwi')}).join('')+fwHTML();
    $('#erw').textContent='🎁 這一場 抽到 的 獎勵：'+Object.keys(H.rw).reduce(function(s,id){return s+(H.rw[id]||[]).length},0)+' 個（按 下面 的 按鈕 發 到 每一個人 的 戰神之路）'})}
function fwHTML(){var h='<div class="fwx">',C=['#FFD54A','#FF6B6B','#7FD4FF','#7BF0A8','#D9A8FF'];for(var n=0;n<5;n++){var x=10+n*20,y=20+(n%2)*25;for(var i=0;i<14;i++){var a=i/14*Math.PI*2;h+='<i style="left:'+x+'%;top:'+y+'%;--c:'+C[n]+';--x:'+Math.round(Math.cos(a)*90)+'px;--y:'+Math.round(Math.sin(a)*90)+'px;animation-delay:'+(n*.3)+'s"></i>'}}return h+'</div>'}
/* 每一個人：參加 ＋10 經驗值、答對 1 題 ＋1 金幣；抽到的獎勵照 LV.RW */
function bonusList(){return ids().map(function(id){var rw=H.rw[id]||[],c=H.okc[id]||0,x=10,o={id:id,c:c,x:x,tre:[],title:'',snack:0,medal:0};
  rw.forEach(function(k){if(k==='c2')o.c+=c;else if(k==='x2')o.x+=x;else if(k==='frag')o.c+=20;else if(k==='title')o.title='⚡ 現場任務 勇者';else if(k==='emo')o.tre.push('t06');else if(k==='fx')o.tre.push('t04');else if(k==='snack')o.snack++;else if(k==='medal')o.medal++;else if(k==='box')o.c+=30});return o})}
function give(){var b=$('#give'),m=$('#gm');if(H.done){m.textContent='✅ 已經 發過了';return}b.disabled=true;m.textContent='⏳ 發獎勵中…';
  post({a:'rpgb',pw:H.pw,room:H.code,t0:H.start,list:bonusList()}).then(function(j){if(j&&j.ok){H.done=true;b.textContent='✅ 獎勵 發好了';m.textContent='✅ 發好了（'+j.n+' 人）：〔戰神之路〕拿到 獎勵、老師看板 練習次數 ＋1';LDB.patch(R('m'),{given:1})}else{b.disabled=false;m.textContent='❌ 沒有 發成（'+((j&&j.err)||'')+'）'}},
    function(){b.disabled=false;m.textContent='📶 連不到 成績系統'})}
function closeGame(){if(H.code)LDB.del(R()).then(function(){location.reload()});else location.reload()}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;ac();
  if(c('#pwgo')){pwGo();return}
  if((b=c('[data-sc]'))){H.cls=b.getAttribute('data-sc');var g=H.cls.charAt(0)==='3'?3:4;H.g=g;setDraw();return}
  if((b=c('[data-sk]'))){H.game=b.getAttribute('data-sk');setDraw();return}
  if((b=c('[data-sb]'))){var k=H.g+'_'+b.getAttribute('data-sb');H.sets[k]=!H.sets[k];setDraw();return}
  if((b=c('[data-sn]'))){H.n=+b.getAttribute('data-sn');setDraw();return}
  if((b=c('[data-ch]'))){H.ch=+b.getAttribute('data-ch');setDraw();return}
  if((b=c('[data-si]'))){H.int=+b.getAttribute('data-si');setDraw();return}
  if(c('#mk')){mkRoom();return}
  if(c('#go')){start();return}
  if(c('#hp')){H.pause=!H.pause;$('#hp').textContent=H.pause?'▶ 繼續':'⏸ 停在 這一題';if(H.pause&&H.phase==='rev')clearTimeout(H.tm);if(!H.pause&&H.phase==='rev')next();return}
  if(c('#hn')){if(H.phase==='q')reveal();else next();return}
  if(c('#hint')){H.int=H.int?0:1;$('#hint').textContent=H.int?'😆 干擾：開':'✖ 干擾：關';LDB.patch(R('m'),{int:H.int});return}
  if(c('#hsnd')){H.snd=H.snd?0:1;$('#hsnd').textContent=H.snd?'🔊 聲音：開':'🔇 聲音：關';return}
  if(c('#give')){give();return}
  if(c('#close')||c('#close2')){if(confirm('結束 這一場？（學生 會 回到 等待 畫面）'))closeGame();return}
});
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&document.activeElement&&document.activeElement.id==='pw')pwGo()});
(function(){try{var p=sessionStorage.getItem('lvpw');if(p&&LDB.on()){H.pw=p;setDraw();scr('hset');return}}catch(e){}scr('hpw')})();
