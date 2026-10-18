/* live/_stu_rt.js — ⚡ 現場任務 學生平板（live/index.html）。只寫 ES5。要先載入成績系統的登入（score/_client.js home()）、live/_db.js、live/_common.js；網頁裡有 BASE。
   流程：🔑 登入（5 碼，跟成績系統同一個）➜ 打房間號碼（4 碼，大螢幕上有）➜ 等老師開始 ➜ 一題一題：四個大按鈕 ➜ 公布 ✅／❌、這一題幾分
        ➜ 每答對 5 題：🐾 寵物叼來禮物盒（先選 🎮 遊戲功能 或 🎁 獎勵）➜ 盒子跳三下 ➜ 選一個 ➜ 打開飛出你的英雄說一句話 ➜ 生效
   干擾：老師大螢幕自動送（好笑、不扣分、≦ 3 秒），這一台只負責演；演完送你 🛡。 */
var S={code:'',id:'',m:null,qi:-1,ans:null,t0:0,dur:15000,pend:{},cnt:{},draws:0,rw:[],me:null,fxAt:0,met:0,unM:null,unF:null,pick2:[],chN:0,chT:0,okc:0};
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function scr(id){$$('.scr').forEach(function(x){x.hidden=x.id!==id})}
function R(p){return 'rooms/'+S.code+(p?'/'+p:'')}
/* ── 登入以後：打房間號碼 ── */
function ready(){if(!LDB.on()){scr('soff');return}if(!SCID||!scAsked()){scr('sout');return}if(S.code&&S.id===SCID)return;S.id=SCID;S.code='';codeDraw();scr('scode')}
var TYPED='';
function codeDraw(){var b='';for(var i=0;i<4;i++)b+='<i class="'+(i<TYPED.length?'f':'')+(i===TYPED.length?' cur':'')+'">'+(TYPED.charAt(i)||'')+'</i>';$('#cbox').innerHTML=b}
function codeKey(k){if(k==='⌫')TYPED=TYPED.slice(0,-1);else if(TYPED.length<4)TYPED+=k;codeDraw();$('#cmsg').textContent='';if(TYPED.length===4)join()}
function join(){var c=TYPED,id=SCID;$('#cmsg').textContent='⏳ 找房間…';
  LDB.get('rooms/'+c+'/m').then(function(m){
    if(!m){TYPED='';codeDraw();$('#cmsg').textContent='❌ 沒有 '+c+' 這個房間，再看一次 大螢幕';return}
    if(m.phase==='end'){TYPED='';codeDraw();$('#cmsg').textContent='這個房間 已經 結束了';return}
    if(String(id).slice(0,3)!==String(m.cls)){TYPED='';codeDraw();$('#cmsg').textContent='這個房間 是 '+m.cls+' 班 的（你是 '+String(id).slice(0,3)+' 班）';return}
    S.code=c;var put=function(v){S.me=v||null;var st=v&&v.st&&v.st.eq||{};return LDB.set(R('p/'+id),{h:st.h||'',pt:st.p||'',pw:v?v.power||0:0,at:Date.now()})};
    (typeof scFetch==='function'&&SCON?scFetch('a=rpg&id='+id,null,6000).then(function(j){return j&&j.ok?j.v:null},function(){return null}):Promise.resolve(null)).then(put).then(function(){
      if(S.unM)S.unM();S.unM=LDB.listen(R('m'),onM);if(S.unF)S.unF();S.unF=LDB.listen(R('fx/'+id),onFx);scr('swait');drawWait()})})}
function heroImg(cls){var st=S.me&&S.me.st&&S.me.st.eq||{};return st.h?'<img class="'+(cls||'')+'" src="'+LV.img(BASE,st.h)+'" alt="我的英雄">':'<span class="noh '+(cls||'')+'">👤</span>'}
function petImg(cls){var st=S.me&&S.me.st&&S.me.st.eq||{};return st.p?'<img class="'+(cls||'')+'" src="'+LV.img(BASE,st.p)+'" alt="我的寵物">':'<span class="noh '+(cls||'')+'">🐾</span>'}
function drawWait(){var g=S.m?LV.game(S.m.game):null;$('#wt').innerHTML='✅ 已經 加入 <b>'+S.code+'</b>'+(g?'<br>'+g.ic+' '+g.nm:'');$('#wh').innerHTML=heroImg('wimg')+'<div class="note">等 老師 按〔▶ 開始〕…</div>'+(g?'<div class="note">'+g.d+'</div>':'')}
/* ── 房間的狀態一變就來 ── */
function onM(m){if(!m){scr('scode');S.code='';TYPED='';codeDraw();$('#cmsg').textContent='老師 關掉 房間了';return}S.m=m;
  if(m.phase==='lobby'){scr('swait');drawWait();return}
  if(m.phase==='q'&&m.qi!==S.qi)newQ(m);
  else if(m.phase==='rev'&&m.rev&&m.rev.qi===S.qi)rev(m);
  else if(m.phase==='end')endS(m);
  kingBtn()}
/* 新的一題來了，禮物盒還沒打開 ➜ 先收起來，這一題公布以後再拿出來（不擋答題）；已經打開了 ＝ 直接收 */
function giftAway(){var g=$('#gift');if(g.className.indexOf('on')<0)return;if(!(S.gp&&S.gp.done))S.drawLater=1;g.className='';g.innerHTML=''}
function newQ(m){giftAway();S.qi=m.qi;S.ans=null;S.t0=Date.now();S.dur=m.dur||LV.DUR;S.met=0;S.pick2=[];scr('sq');var q=m.q,P=S.pend;
  S.cur={cut:!!P.cut,hint:!!P.hint,two:!!P.retry};delete P.cut;delete P.hint;delete P.retry;delete P.pause;
  $('#sqn').textContent=(m.qi+1)+' ／ '+m.n;$('#sqq').innerHTML=q.t;$('#sqq').classList.toggle('zoom',(S.cnt.zoom||0)>0);if(S.cnt.zoom)S.cnt.zoom--;
  $('#sqh').innerHTML=S.cur.hint&&q.h?'💡 '+petImg('hpet')+' '+q.h:'';$('#sqh').hidden=!(S.cur.hint&&q.h);
  $('#sqo').innerHTML=q.o.map(function(t,i){var cut=S.cur.cut&&(q.x||[]).indexOf(i)>=0;return '<button class="so c'+i+(cut?' cut':'')+'" data-k="'+i+'"'+(cut?' disabled':'')+'><b>'+'ABCD'.charAt(i)+'</b><span>'+t+'</span></button>'}).join('');
  $('#sqm').textContent=S.cur.two?'🔁 這一題 可以 選 2 個':'';$('#sqr').innerHTML='';$('#sq').className='scr';
  stTick()}
function stTick(){clearTimeout(S.tm);if(!S.m||S.m.phase!=='q')return;var left=Math.max(0,S.dur-(Date.now()-S.t0));$('#sqt').textContent=Math.ceil(left/1000);$('#sqbar').style.width=(left/S.dur*100)+'%';
  if(left<=0){if(!S.ans)$('#sqr').innerHTML='<div class="sr no">⏰ 時間到</div>';$$('#sqo .so').forEach(function(b){b.disabled=true});return}S.tm=setTimeout(stTick,200)}
function flags(){var f={},c=S.cnt;if(c.x2>0)f.x2=1;if(c.fire>0)f.fire=1;if(c.rocket>0)f.rocket=1;if(S.pend.shield)f.sh=1;if(S.pend.cheer)f.ch=1;if(S.cur&&S.cur.two)f.rt=1;if(S.met)f.met=S.met;return f}
function answer(k){if(S.ans||!S.m||S.m.phase!=='q')return;var ms=Date.now()-S.t0;if(ms>S.dur)return;
  if(S.cur.two){if(S.pick2.indexOf(k)<0)S.pick2.push(k);$('#sqo [data-k="'+k+'"]').classList.add('pk');if(S.pick2.length<2){$('#sqm').textContent='🔁 再選 1 個';return}k=S.pick2.slice()}
  var f=flags();S.ans={k:k,ms:ms,f:f};['x2','fire','rocket'].forEach(function(x){if(S.cnt[x]>0)S.cnt[x]--});delete S.pend.shield;delete S.pend.cheer;
  LDB.set(R('a/'+S.qi+'/'+S.id),S.ans);$$('#sqo .so').forEach(function(b){b.disabled=true;var kk=+b.getAttribute('data-k');if(kk===k||(k.indexOf&&k.indexOf(kk)>=0))b.classList.add('pk')});
  $('#sqr').innerHTML='<div class="sr wait">✅ 送出了！看 大螢幕</div>'}
function rev(m){clearTimeout(S.tm);var r=m.r||{},id=S.id,ok=r.ok&&r.ok[id],sc=(r.sc&&r.sc[id])||0,tot=(r.tot&&r.tot[id])||0,st=(r.st&&r.st[id])||0;
  $$('#sqo .so').forEach(function(b){var k=+b.getAttribute('data-k');b.disabled=true;b.classList.toggle('ok',k===m.rev.a);b.classList.toggle('no',k!==m.rev.a)});
  if(ok&&typeof rwFx==='function'){var eq5=S.me&&S.me.st&&S.me.st.eq||{};if(eq5.s&&eq5.s.fx)rwFx(BASE,eq5.s.fx)}   /* 💥 必殺武功特效（2026-10-18：現場任務 答對 一題 演一次）；打魔王：平板寫「你的 英雄 出招 ➜ 魔王 －N」（2026-10-18 第十次，N ＝ SC.rpDmg：基本 10 ＋ 戰力 ÷ 100，最多 30） */
  $('#sqr').innerHTML='<div class="sr '+(ok?'ok':'no')+'">'+(ok?'✅ 答對！ ＋'+sc:S.ans?'❌ 答錯了，沒關係':'⏰ 這一題 沒有 答')+'</div><div class="ss">🏆 總分 '+tot+(st>1?'　🔥 連對 '+st:'')+'</div>'+(ok&&m.game==='boss'?'<div class="ss sdmg">⚔ 你的 英雄 出招 ➜ 魔王 <b>－'+(10+Math.min(20,Math.floor(((S.me&&S.me.power)||0)/100)))+'</b></div>':'')+(!ok&&m.rev.h?'<div class="note">💡 '+m.rev.h+'</div>':'');
  var okc=(r.okc&&r.okc[id])||0;S.okc=okc;if(Math.floor(okc/5)>S.draws||S.drawLater){S.draws=Math.max(S.draws,Math.floor(okc/5));S.drawLater=0;setTimeout(draw,900)}}
function endS(m){clearTimeout(S.tm);scr('send');var r=m.r||{},T=r.tot||{},L=Object.keys(T).sort(function(a,b){return T[b]-T[a]}),rk=L.indexOf(S.id)+1;
  $('#ew').innerHTML=heroImg('wimg')+'<div class="et">'+(rk>0&&rk<=3?['🥇','🥈','🥉'][rk-1]+' 第 '+rk+' 名！':'🎉 任務 完成！')+'</div><div class="ss">🏆 總分 '+(T[S.id]||0)+'　✅ 答對 '+((r.okc||{})[S.id]||0)+' 題</div>'+
    (S.rw.length?'<div class="note">🎁 你 抽到：'+S.rw.map(function(k){var x=LV.RW.filter(function(y){return y.k===k})[0];return x?x.ic+' '+x.nm:k}).join('、')+'</div>':'')+
    '<div class="note">'+(m.given?'✅ 老師 發好 獎勵了 ➜ 打開〔戰神之路〕看看':'老師 發 獎勵 以後，打開〔戰神之路〕就 看得到（⭐ 經驗值、🪙 金幣）')+'</div>'}
/* ── 🐾 寵物叼來禮物盒（每答對 5 題）── */
function draw(){S.gp=null;var o=$('#gift');o.className='on';o.innerHTML='<div class="gb"><div class="gt">🎉 答對 '+(S.draws*5)+' 題！你的 寵物 叼來 禮物 了</div><div class="gpet">'+petImg('gpi')+'<span class="gbox">🎁</span></div>'+
  '<div class="gt2">要 抽 哪一種？</div><div class="grow"><button data-gk="f">🎮 遊戲 功能<small>這一場 馬上 用</small></button><button data-gk="r">🎁 獎勵<small>遊戲 結束 老師 發</small></button></div></div>'}
function boxes(kind){var n=LV.pickN(),pool=LV.shuf(kind==='f'?LV.FEAT:LV.RW).slice(0,n),o=$('#gift');S.gp={kind:kind,pool:pool};
  o.innerHTML='<div class="gb"><div class="gt">'+(kind==='f'?'🎮 遊戲 功能':'🎁 獎勵')+'：'+n+' 選 1</div><div class="gpet walk">'+petImg('gpi')+'</div>'+
    '<div class="gbx n'+n+'">'+pool.map(function(x,i){return '<button class="bx" data-gi="'+i+'" style="animation-delay:'+(i*.12)+'s">🎁</button>'}).join('')+'</div><div class="gt2">👆 選 一個 盒子</div></div>'}
function openBox(i){var G=S.gp,x=G.pool[i],o=$('#gift');if(!x||G.done)return;G.done=1;
  o.innerHTML='<div class="gb"><div class="gopen"><span class="lid">🎁</span><div class="ghero">'+heroImg('ghi')+'<div class="say">「'+(x.say||'太好了！')+'」</div></div></div>'+
    '<div class="gget">'+x.ic+' <b>'+x.nm+'</b><br><span>'+x.t+'</span></div>'+
    (G.pool.length>1?'<div class="goth">其他 盒子：'+G.pool.filter(function(y,j){return j!==i}).map(function(y){return y.ic+' '+y.nm}).join('、')+'</div>':'')+
    '<button class="gok" data-gok="1">👌 好</button></div>';
  if(G.kind==='f')useF(x);else{S.rw.push(x.k);LDB.set(R('rw/'+S.id),S.rw)}}
function useF(x){var k=x.k;if(k==='x2'||k==='fire'||k==='rocket'||k==='zoom')S.cnt[k]=(S.cnt[k]||0)+x.n;else S.pend[k]=1;
  if(k==='pause')LDB.set(R('xt/'+S.id),S.qi+1)}
/* ── 干擾（老師大螢幕自動送）── */
function onFx(v){if(!v||!v.at||v.at<=S.fxAt||!S.m||!S.m.int)return;S.fxAt=v.at;var g=LV.game(S.m.game),F=g.fx,q=$('#sq'),o=$('#fxo');
  o.className='on '+F.k;o.innerHTML='<div class="fxt">'+F.ic+' '+F.t+'</div>';
  if(F.k==='sneeze'){var h='';for(var i=0;i<26;i++)h+='<i class="bub" style="left:'+(Math.random()*100).toFixed(0)+'%;animation-delay:'+(Math.random()*.6).toFixed(2)+'s;width:'+(30+Math.random()*50).toFixed(0)+'px"></i>';o.innerHTML+=h}
  else if(F.k==='banana')q.classList.add('spin');
  else if(F.k==='meteor'){o.innerHTML+=[0,1,2].map(function(i){return '<button class="met" data-met="'+i+'" style="left:'+(15+i*30)+'%;top:'+(30+(i%2)*25)+'%">☄️</button>'}).join('')}
  else if(F.k==='fog')q.classList.add('fog');else if(F.k==='wind')q.classList.add('wind');else if(F.k==='balloon')q.classList.add('float');else if(F.k==='wave')q.classList.add('shake');
  else if(F.k==='sleep'){S.wake=0;o.innerHTML+='<button class="slp" data-wake="1">'+petImg('spi')+'<b>😴 點 3 下 叫醒</b></button>'}
  clearTimeout(S.ftm);S.ftm=setTimeout(fxOff,F.ms||2000)}
function fxOff(){var q=$('#sq');['spin','fog','wind','float','shake'].forEach(function(c){q.classList.remove(c)});var o=$('#fxo');o.className='';o.innerHTML='';
  S.pend.shield=1;var b=$('#sqm');if(b&&!S.ans)b.textContent='🛡 送你 護盾：下一次 答錯 不算 斷連對'}
/* 👑 王者擂台：台下（不是前 3 名）可以按 📣 加油（一秒一次、最多 30 次） */
function kingBtn(){var b=$('#kch');if(!b)return;var m=S.m,on=m&&m.game==='king'&&(m.phase==='q'||m.phase==='rev');
  if(on){var T=(m.r&&m.r.tot)||{},L=Object.keys(T).sort(function(a,c){return T[c]-T[a]});on=L.slice(0,3).indexOf(S.id)<0}b.hidden=!on}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#sIn')){scLogin(function(){SCH.close();scBar();ready()});return}
  if((b=c('[data-ck]'))){codeKey(b.getAttribute('data-ck'));return}
  if((b=c('#sqo .so'))){answer(+b.getAttribute('data-k'));return}
  if((b=c('[data-gk]'))){boxes(b.getAttribute('data-gk'));return}
  if((b=c('[data-gi]'))){openBox(+b.getAttribute('data-gi'));return}
  if(c('[data-gok]')){$('#gift').className='';$('#gift').innerHTML='';return}
  if((b=c('[data-met]'))){b.remove();S.met=Math.min(3,S.met+1);if(S.ans)LDB.patch(R('a/'+S.qi+'/'+S.id+'/f'),{met:S.met});return}
  if(c('[data-wake]')){S.wake++;if(S.wake>=3)fxOff();return}
  if(c('#kch')){var now=Date.now();if(now-S.chT<1000||S.chN>=30)return;S.chT=now;S.chN++;LDB.set(R('ch/'+S.id),S.chN);b=$('#kch');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');return}
});
setInterval(function(){if(!S.code||S.id!==SCID)ready()},800);
