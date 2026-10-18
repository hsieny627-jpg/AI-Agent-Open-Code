/* live/_host_rt.js — ⚡ 現場任務 老師大螢幕（live/host.html）。只寫 ES5。要先載入 live/_db.js、live/_common.js，網頁裡有 BANK（題目）、BASE（到 repo 根目錄）。
   流程：🔑 老師密碼（成績系統同一個，送 Apps Script 比對）➜ ① 年級 ② 班級 ③ 10 種任務 ④ 題目 ⑤ 幾題 ⑥ 干擾 開／關 ➜〔⚡ 開房間〕
        ➜ 大大的房間號碼（學生打開 …/live/ 輸入）➜〔▶ 開始〕➜ 一題 15 秒（全部答完就提早）➜ 公布 4.5 秒 ➜ 下一題 … ➜ 結束：前 3 名＋任務結果＋〔🎁 發獎勵〕
   答案只放在這一台（老師的電腦）：題目送出去的時候 **不送答案**，公布的時候才送。分數也是這一台算。 */
var H={pw:'',g:4,cls:'',game:'boss',sets:{},n:10,int:1,code:'',Q:[],qi:-1,P:{},tot:{},okc:{},st:{},fxc:{},sh:{},gs:{},pause:false,tm:null,unA:null,unP:null,A:{},xt:{},rw:{},done:false,log:[]};
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function scr(id){$$('.scr').forEach(function(x){x.hidden=x.id!==id})}
function post(o){var u=String(window.SCORE_URL||'').trim();if(!u)return Promise.reject(new Error('nourl'));return fetch(u,{method:'POST',body:JSON.stringify(o)}).then(function(r){return r.json()})}
function seatOf(id){return +String(id).slice(3)}
/* ── 🔑 密碼 ── */
function pwGo(){var p=$('#pw').value.trim(),m=$('#pwm');if(!p){m.textContent='請打密碼';return}
  if(!LDB.on()){m.innerHTML='⚠ 現場任務 還沒有 設定 Firebase ➜ 請看 <a href="setup.html">大字版 設定頁</a>';return}
  m.textContent='⏳ 檢查中…';post({a:'pw',pw:p}).then(function(j){if(j&&j.ok){H.pw=p;try{sessionStorage.setItem('lvpw',p)}catch(e){}setDraw();scr('hset')}else m.textContent='❌ 密碼 不對'},function(){m.textContent='📶 連不到 成績系統'})}
/* ── ① ～ ⑥ 設定 ── */
var CLS={3:['304','307','311'],4:['402','406','409','410','400']};
function setDraw(){var h='<h2>① 年級</h2><div class="row">'+[3,4].map(function(g){return '<button data-sg="'+g+'" class="'+(H.g===g?'on':'')+'">'+(g===3?'三':'四')+'年級</button>'}).join('')+'</div>'+
  '<h2>② 班級</h2><div class="row">'+CLS[H.g].map(function(c){return '<button data-sc="'+c+'" class="'+(H.cls===c?'on':'')+'">'+c+(c==='400'?' 課後班':'')+'</button>'}).join('')+'</div>'+
  '<h2>③ 哪一種 現場任務</h2><div class="ggrid">'+LV.GAMES.map(function(x){return '<button data-sk="'+x.k+'" class="gcd'+(H.game===x.k?' on':'')+'"><span class="gi">'+x.ic+'</span><b>'+x.nm+'</b><small>'+x.d+'</small></button>'}).join('')+'</div>'+
  '<h2>④ 題目（可以選好幾組）</h2><div class="row">'+(BANK[H.g]||[]).map(function(b,i){var on=!!H.sets[H.g+'_'+i];return '<button data-sb="'+i+'" class="'+(on?'on':'')+'">'+(on?'☑ ':'☐ ')+esc(b.nm)+'（'+b.qs.length+' 題）</button>'}).join('')+'</div>'+
  '<h2>⑤ 幾題</h2><div class="row">'+[5,10,15,20].map(function(n){return '<button data-sn="'+n+'" class="'+(H.n===n?'on':'')+'">'+n+' 題（約 '+Math.ceil(n*22/60)+' 分鐘）</button>'}).join('')+'</div>'+
  '<h2>⑥ 好笑的干擾</h2><div class="row"><button data-si="1" class="'+(H.int?'on':'')+'">'+LV.game(H.game).fx.ic+' 開（不扣分、≦ 3 秒）</button><button data-si="0" class="'+(!H.int?'on':'')+'">✖ 關</button><span class="note">'+esc(LV.game(H.game).fx.t)+'</span></div>'+
  '<div class="row"><button id="mk" class="big">⚡ 開房間</button><span id="mkm" class="note"></span></div>';
  $('#hset .in').innerHTML=h}
function selQs(){var a=[];(BANK[H.g]||[]).forEach(function(b,i){if(H.sets[H.g+'_'+i])a=a.concat(b.qs)});return a}
function mkRoom(){var m=$('#mkm');if(!H.cls){m.textContent='② 請選班級';return}var all=selQs();if(!all.length){m.textContent='④ 請選題目';return}
  H.Q=LV.shuf(all).slice(0,H.n).map(function(q){var ord=LV.shuf([0,1,2,3]),o=ord.map(function(i){return q.o[i]}),a=ord.indexOf(0),w=LV.shuf([0,1,2,3].filter(function(i){return i!==a})).slice(0,2);return {t:q.q,o:o,a:a,h:q.h||'',x:w}});
  H.n=H.Q.length;m.textContent='⏳ 開房間中…';
  (function tryCode(n){var c=String(1000+Math.floor(Math.random()*9000));LDB.get('rooms/'+c+'/m').then(function(v){if(v&&n<8)return tryCode(n+1);H.code=c;
    return LDB.set('rooms/'+c+'/m',{v:1,g:H.g,cls:H.cls,game:H.game,n:H.n,int:H.int,phase:'lobby',made:Date.now()}).then(function(ok){if(!ok){m.textContent='📶 連不到 Firebase';return}lobby()})})})(0)}
/* ── 等學生加入 ── */
function lobby(){scr('hlob');$('#code').textContent=H.code;$('#lgame').innerHTML=LV.game(H.game).ic+' '+LV.game(H.game).nm+'　'+H.cls+' 班　'+H.n+' 題';
  if(H.unP)H.unP();H.unP=LDB.listen('rooms/'+H.code+'/p',function(v){H.P=v||{};drawLobby();if(H.qi>=0)drawGame()});
  LDB.listen('rooms/'+H.code+'/xt',function(v){H.xt=v||{}});LDB.listen('rooms/'+H.code+'/ch',function(v){H.ch=v||{};if(H.game==='king'&&H.qi>=0)drawGame()})}
function ids(){return Object.keys(H.P||{}).filter(function(id){return /^\d{5}$/.test(id)}).sort()}
function drawLobby(){var L=ids();$('#lcnt').textContent=L.length;
  $('#lpl').innerHTML=L.map(function(id){var p=H.P[id];return '<div class="pl">'+(p.h?'<img src="'+LV.img(BASE,p.h)+'" alt="">':'<span class="noh">🦸</span>')+'<b>'+seatOf(id)+' 號</b></div>'}).join('')}
/* ── 一題 ── */
function start(){if(!ids().length){$('#lmsg').textContent='還沒有 學生 加入';return}H.qi=-1;H.start=Date.now();ids().forEach(function(id){H.tot[id]=0;H.okc[id]=0;H.st[id]=0;H.fxc[id]=0});H.gs=gs0();scr('hq');next()}
function next(){clearTimeout(H.tm);H.qi++;if(H.qi>=H.n){end();return}
  var q=H.Q[H.qi],ext=0;for(var id in H.xt)if(+H.xt[id]===H.qi)ext=5000;var dur=LV.DUR+ext;H.dur=dur;H.A={};H.fxNow={};H.t0=Date.now();
  LDB.patch('rooms/'+H.code+'/m',{phase:'q',qi:H.qi,q:{t:q.t,o:q.o,h:q.h,x:q.x},t0:H.t0,dur:dur,rev:null});
  if(H.unA)H.unA();H.unA=LDB.listen('rooms/'+H.code+'/a/'+H.qi,function(v){H.A=v||{};drawQ();if(Object.keys(H.A).length>=ids().length&&H.phase==='q')reveal()});
  H.phase='q';drawQ();drawGame();tick();
  if(H.int&&LV.game(H.game).fx.ms)H.tm2=setTimeout(fxSend,3000+Math.random()*3000)}
function tick(){clearTimeout(H.tm);if(H.phase!=='q')return;var left=Math.max(0,H.dur-(Date.now()-H.t0));$('#qt').textContent=Math.ceil(left/1000);$('#qbar').style.width=(left/H.dur*100)+'%';
  if(left<=0){reveal();return}H.tm=setTimeout(tick,200)}
/* 干擾（系統自動、好笑、不扣分）：全班一起的 ＝ 每一個人；其他 ＝ 隨機 1～2 個（每人每場最多 2 次、剛被干擾過的有 🛡 不會再被選） */
function fxSend(){if(H.phase!=='q')return;var F=LV.game(H.game).fx,L=ids().filter(function(id){return (H.fxc[id]||0)<LV.MAXFX&&!H.A[id]});if(!L.length)return;
  var who=F.all?L:LV.shuf(L).slice(0,Math.random()<.5?1:2),now=Date.now();
  who.forEach(function(id){H.fxc[id]=(H.fxc[id]||0)+1;H.fxNow[id]=F.k;LDB.set('rooms/'+H.code+'/fx/'+id,{k:F.k,qi:H.qi,at:now})});
  H.log.push({qi:H.qi,k:F.k,n:who.length});drawGame()}
function drawQ(){var q=H.Q[H.qi];if(!q)return;$('#qn').textContent=(H.qi+1)+' ／ '+H.n;$('#qq').innerHTML=q.t;
  $('#qo').innerHTML=q.o.map(function(t,i){return '<div class="qo c'+i+(H.phase==='rev'&&i===q.a?' ok':'')+(H.phase==='rev'&&i!==q.a?' no':'')+'"><b>'+'ABCD'.charAt(i)+'</b><span>'+t+'</span></div>'}).join('');
  $('#qa').textContent='✋ 已經 答了 '+Object.keys(H.A).length+' ／ '+ids().length+' 人'}
/* ── 公布 ── */
function reveal(){if(H.phase!=='q')return;H.phase='rev';clearTimeout(H.tm);clearTimeout(H.tm2);var q=H.Q[H.qi],sc={},ok1={},cheer=0,dmg=0;
  ids().forEach(function(id){var a=H.A[id],f=(a&&a.f)||{},ok=!!a&&(Object.prototype.toString.call(a.k)==='[object Array]'?a.k.indexOf(q.a)>=0:a.k===q.a),s=LV.score(ok,a?a.ms:H.dur,H.dur,f);
    if(f.met)s+=30*Math.min(3,+f.met||0);
    if(ok&&(H.fxNow[id]==='lock'||H.fxNow[id]==='wave'))s+=50;
    if(ok){H.st[id]++;H.okc[id]++;dmg+=10+Math.min(20,Math.floor((+(H.P[id]||{}).pw||0)/100))}else if(!f.sh)H.st[id]=0;
    if(f.ch)cheer++;sc[id]=s;ok1[id]=ok?1:0;H.tot[id]+=s});
  gsUp(ok1,dmg,cheer);
  LDB.patch('rooms/'+H.code+'/m',{phase:'rev',rev:{qi:H.qi,a:q.a,h:q.h},r:{qi:H.qi,sc:sc,tot:H.tot,ok:ok1,st:H.st,okc:H.okc},gs:H.gs});
  H.sc=sc;drawQ();drawGame();
  if(!H.pause)H.tm=setTimeout(next,4500)}
/* ── 遊戲畫面（大螢幕右邊）── */
function gs0(){var n=Math.max(1,ids().length);return {hp:n*Math.max(3,Math.round(H.n*.6))*15,hp0:n*Math.max(3,Math.round(H.n*.6))*15,fuel:[0,0],cells:[],pet:0,tr:0,cheer:0}}
function team(id){return seatOf(id)%2?0:1}
function gsUp(ok1,dmg,cheer){var G=H.gs;G.hp=Math.max(0,G.hp-dmg-cheer*50);G.cheer+=cheer;
  ids().forEach(function(id){if(ok1[id]){G.fuel[team(id)]++;if(G.cells.length<30)G.cells.push(team(id))}});
  var tot=0,max=ids().length*H.n;ids().forEach(function(id){tot+=H.okc[id]});G.pet=Math.min(4,Math.floor((tot+G.cheer)/Math.max(1,max)*5));G.tr=Math.min(6,Math.floor((tot+G.cheer)/Math.max(1,max)*7))}
function rank(){return ids().map(function(id){return {id:id,v:H.tot[id]||0}}).sort(function(a,b){return b.v-a.v||(a.id<b.id?-1:1)})}
function heroI(id,cls){var p=H.P[id]||{};return p.h?'<img class="'+(cls||'')+'" src="'+LV.img(BASE,p.h)+'" alt="">':'<span class="noh '+(cls||'')+'">🦸</span>'}
function drawGame(){var el=$('#gv');if(!el)return;var G=H.gs,k=H.game,L=ids(),R=rank(),mx=Math.max(1,R.length?R[0].v:1),h='<div class="gvt">'+LV.game(k).ic+' '+LV.game(k).nm+'</div>';
  var fxi=function(id){return H.fxNow&&H.fxNow[id]?'<i class="fxb">'+LV.game(k).fx.ic+'</i>':''};
  if(k==='boss'){var p=G.hp/G.hp0*100;h+='<div class="boss'+(G.hp<=0?' dead':'')+'"><div class="bm">'+(G.hp<=0?'💥':'🐲')+'</div><div class="hpb"><i style="width:'+p+'%"></i><span>'+(G.hp<=0?'🎉 全班 打倒 魔王！':'❤ '+G.hp+' ／ '+G.hp0)+'</span></div></div>'}
  else if(k==='race')h+='<div class="lanes">'+L.map(function(id){return '<div class="ln"><b>'+seatOf(id)+'</b><span class="tr"><span class="car" style="left:calc('+((H.tot[id]||0)/Math.max(mx,H.n*600)*88)+'%)">🏎'+fxi(id)+'</span></span><span class="fl">🏁</span></div>'}).join('')+'</div>';
  else if(k==='space'){var f=G.fuel,top=Math.max(4,Math.ceil(L.length*H.n/2*.7));h+='<div class="sp"><div class="moon">🌕</div>'+[0,1].map(function(t){return '<div class="rk"><div class="rkr" style="bottom:'+Math.min(100,f[t]/top*100)+'%">🚀</div><b>'+(t?'雙號隊':'單號隊')+' '+f[t]+'</b></div>'}).join('')+'</div>'}
  else if(k==='map'){var c=G.cells,cnt=[0,0];c.forEach(function(t){cnt[t]++});h+='<div class="mp">'+Array.apply(null,{length:30}).map(function(_,i){return '<i class="'+(i<c.length?'t'+c[i]:'')+'"></i>'}).join('')+'</div><div class="mps"><b class="t0">🔵 單號隊 '+cnt[0]+'</b><b class="t1">🔴 雙號隊 '+cnt[1]+'</b></div>'}
  else if(k==='tower')h+='<div class="tw">'+L.map(function(id){var n=H.okc[id]||0;return '<div class="tc"><div class="tcl" style="height:'+(n/Math.max(1,H.n)*100)+'%">'+heroI(id,'tci')+fxi(id)+'</div><b>'+seatOf(id)+'</b></div>'}).join('')+'</div>';
  else if(k==='pet')h+='<div class="pe"><div class="pei st'+G.pet+'">'+['🥚','🐣','🐥','🦅','🐉'][G.pet]+'</div><div class="pes">'+['🥚','🐣','🐥','🦅','🐉'].map(function(x,i){return '<span class="'+(i<=G.pet?'on':'')+'">'+x+'</span>'}).join('➜')+'</div></div>';
  else if(k==='shoot')h+='<div class="sh"><div class="tgt"></div>'+L.map(function(id,i){var s=(H.sc&&H.sc[id])||0,r=s?Math.max(4,46-s/1000*42):0,a=i*137.5*Math.PI/180;return s?'<i class="dt" style="left:calc(50% + '+(Math.cos(a)*r)+'%);top:calc(50% + '+(Math.sin(a)*r)+'%)">'+seatOf(id)+'</i>':''}).join('')+'</div>';
  else if(k==='treasure')h+='<div class="trs">'+Array.apply(null,{length:7}).map(function(_,i){return '<span class="'+(i<G.tr?'op':i===G.tr?'now':'')+'">'+(i<G.tr?'💰':i===G.tr?'🚶':'🎁')+'</span>'}).join('<em>➜</em>')+'</div>';
  else if(k==='surf')h+='<div class="sf"><svg viewBox="0 0 400 120" preserveAspectRatio="none"><path d="M0 90Q50 40 100 80T200 70T300 60T400 70V120H0Z" fill="#1E88E5"/><path d="M0 100Q60 70 120 95T240 90T400 95V120H0Z" fill="#64B5F6"/></svg>'+
    L.map(function(id,i){var s=Math.min(8,H.st[id]||0);return '<div class="sfr" style="left:'+(4+i*(92/Math.max(1,L.length)))+'%;bottom:'+(20+s*9)+'%">🏄<b>'+seatOf(id)+'</b>'+fxi(id)+'</div>'}).join('')+'</div>';
  else{var t3=R.slice(0,3),cc=0;for(var c2 in (H.ch||{}))cc+=+H.ch[c2]||0;h+='<div class="kg"><div class="kpod">'+[1,0,2].map(function(n){var x=t3[n];return '<div class="kp p'+(n+1)+'">'+(x?heroI(x.id,'kpi')+'<b>'+seatOf(x.id)+' 號</b><em>'+x.v+'</em>':'')+'<div class="kb">'+(n+1)+'</div></div>'}).join('')+'</div><div class="kc">📣 台下 加油 '+cc+' 次</div></div>'}
  h+='<div class="rk5">'+R.slice(0,5).map(function(x,i){return '<span><b>'+(i+1)+'</b> '+seatOf(x.id)+' 號 '+x.v+'</span>'}).join('')+'</div>';
  el.innerHTML=h}
/* ── 結束＋發獎勵 ── */
function end(){H.phase='end';clearTimeout(H.tm);LDB.patch('rooms/'+H.code+'/m',{phase:'end',r:{qi:H.qi,tot:H.tot,okc:H.okc,st:H.st},gs:H.gs});scr('hend');
  var R=rank(),G=H.gs,k=H.game,res=k==='boss'?(G.hp<=0?'🎉 全班 打倒 魔王！':'🐲 魔王 還剩 '+G.hp+' 血，下次 再來！'):k==='space'||k==='map'?(function(){var a=k==='space'?G.fuel:[G.cells.filter(function(t){return !t}).length,G.cells.filter(function(t){return t}).length];return a[0]===a[1]?'🤝 兩隊 平手！':(a[0]>a[1]?'🔵 單號隊':'🔴 雙號隊')+' 贏了！'})():
    k==='pet'?'全班的 寵物 進化到 '+['🥚','🐣','🐥','🦅','🐉'][G.pet]:k==='treasure'?'全班 打開 '+G.tr+' 個 寶箱 💰':'';
  $('#eres').textContent=res;
  $('#epod').innerHTML=[1,0,2].map(function(n){var x=R[n];return '<div class="kp p'+(n+1)+'">'+(x?heroI(x.id,'kpi')+'<b>'+seatOf(x.id)+' 號</b><em>'+x.v+' 分</em>':'')+'<div class="kb">'+['🥇','🥈','🥉'][n]+'</div></div>'}).join('');
  LDB.get('rooms/'+H.code+'/rw').then(function(rw){H.rw=rw||{};var fw=Object.keys(H.rw).filter(function(id){return (H.rw[id]||[]).indexOf('fw')>=0});
    if(fw.length)$('#efw').innerHTML='<div class="fwt">🎇 煙火 送給：</div>'+fw.map(function(id){return heroI(id,'fwi')}).join('')+fwHTML();
    $('#erw').textContent='🎁 這一場 抽到 的 獎勵：'+Object.keys(H.rw).reduce(function(s,id){return s+(H.rw[id]||[]).length},0)+' 個（按 下面 的 按鈕 發 到 每一個人 的 英雄）'})}
function fwHTML(){var h='<div class="fwx">',C=['#FFD54A','#FF6B6B','#7FD4FF','#7BF0A8','#D9A8FF'];for(var n=0;n<5;n++){var x=10+n*20,y=20+(n%2)*25;for(var i=0;i<14;i++){var a=i/14*Math.PI*2;h+='<i style="left:'+x+'%;top:'+y+'%;--c:'+C[n]+';--x:'+Math.round(Math.cos(a)*90)+'px;--y:'+Math.round(Math.sin(a)*90)+'px;animation-delay:'+(n*.3)+'s"></i>'}}return h+'</div>'}
/* 每一個人：參加 ＋10 經驗值、答對 1 題 ＋1 金幣；抽到的獎勵照 LV.RW */
function bonusList(){return ids().map(function(id){var rw=H.rw[id]||[],c=H.okc[id]||0,x=10,o={id:id,c:c,x:x,tre:[],title:'',snack:0,medal:0};
  rw.forEach(function(k){if(k==='c2')o.c+=c;else if(k==='x2')o.x+=x;else if(k==='frag')o.c+=20;else if(k==='title')o.title='⚡ 現場任務 勇者';else if(k==='emo')o.tre.push('t06');else if(k==='fx')o.tre.push('t04');else if(k==='snack')o.snack++;else if(k==='medal')o.medal++;else if(k==='box')o.c+=30});return o})}
function give(){var b=$('#give'),m=$('#gm');if(H.done){m.textContent='✅ 已經 發過了';return}b.disabled=true;m.textContent='⏳ 發獎勵中…';
  post({a:'rpgb',pw:H.pw,room:H.code,t0:H.start,list:bonusList()}).then(function(j){if(j&&j.ok){H.done=true;b.textContent='✅ 獎勵 發好了';m.textContent='✅ 發好了（'+j.n+' 人）：〔🦸 我的英雄〕拿到 獎勵、老師看板 練習次數 ＋1';LDB.patch('rooms/'+H.code+'/m',{given:1})}else{b.disabled=false;m.textContent='❌ 沒有 發成（'+((j&&j.err)||'')+'）'}},
    function(){b.disabled=false;m.textContent='📶 連不到 成績系統'})}
function closeRoom(){if(H.code)LDB.del('rooms/'+H.code);location.reload()}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#pwgo')){pwGo();return}
  if((b=c('[data-sg]'))){H.g=+b.getAttribute('data-sg');H.cls='';setDraw();return}
  if((b=c('[data-sc]'))){H.cls=b.getAttribute('data-sc');setDraw();return}
  if((b=c('[data-sk]'))){H.game=b.getAttribute('data-sk');setDraw();return}
  if((b=c('[data-sb]'))){var k=H.g+'_'+b.getAttribute('data-sb');H.sets[k]=!H.sets[k];setDraw();return}
  if((b=c('[data-sn]'))){H.n=+b.getAttribute('data-sn');setDraw();return}
  if((b=c('[data-si]'))){H.int=+b.getAttribute('data-si');setDraw();if(H.code)LDB.patch('rooms/'+H.code+'/m',{int:H.int});return}
  if(c('#mk')){mkRoom();return}
  if(c('#go')){start();return}
  if(c('#hp')){H.pause=!H.pause;$('#hp').textContent=H.pause?'▶ 繼續':'⏸ 停在 這一題';if(H.pause&&H.phase==='rev')clearTimeout(H.tm);if(!H.pause&&H.phase==='rev')next();return}
  if(c('#hn')){if(H.phase==='q')reveal();else next();return}
  if(c('#hint')){H.int=H.int?0:1;$('#hint').textContent=H.int?'😆 干擾：開':'✖ 干擾：關';LDB.patch('rooms/'+H.code+'/m',{int:H.int});return}
  if(c('#give')){give();return}
  if(c('#close')){if(confirm('關掉 這個 房間？（學生 會 回到 輸入 號碼）'))closeRoom();return}
});
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&document.activeElement&&document.activeElement.id==='pw')pwGo()});
(function(){try{var p=sessionStorage.getItem('lvpw');if(p&&LDB.on()){H.pw=p;setDraw();scr('hset');return}}catch(e){}scr('hpw')})();
