/* live/_stu_rt.js — ⚡ 現場任務 學生平板（live/index.html）。只寫 ES5。要先載入成績系統的登入（score/_client.js home()）、live/_db.js、live/_common.js、live/_mini.js；網頁裡有 BASE、WORDS。
   2026-10-18 第十一次 重做（規格 live/CLAUDE.md 最上面）：
   流程：🔑 登入（5 碼，跟成績系統同一個）➜ **自動 進入 自己 班 的 遊戲**（0＋班級，不用 打 號碼）➜ 等人：〔🎮 小遊戲〕〔⚔ 換裝備〕〔❓ 怎麼玩〕
        ➜ 怎麼玩 動畫 ➜ 一題一題：四個 顏色＋形狀 的 大按鈕；🔥 挑戰題：點 字母／字卡 方塊 ➜ 公布：整個 畫面 變 綠／紅、這一題 幾分、第幾名、離 前一名 差 幾分
        ➜（不是 經典搶答 的 才有）每答對 5 題：🐾 寵物 叼來 禮物盒（先選 🎮 遊戲功能 或 🎁 獎勵）、干擾（老師大螢幕 自動 送，≦ 3 秒，演完送 🛡） */
var S={code:'',id:'',m:null,qi:-1,ans:null,t0:0,dur:20000,pend:{},cnt:{},draws:0,rw:[],me:null,fxAt:0,met:0,unM:null,unF:null,pick2:[],chN:0,chT:0,okc:0,tab:'mini',made:0,pk:[]};
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function scr(id){$$('.scr').forEach(function(x){x.hidden=x.id!==id})}
function R(p){return 'rooms/'+S.code+(p?'/'+p:'')}
/* ── 登入以後：自動 進入 自己 班 的 遊戲 ── */
function ready(){if(!LDB.on()){scr('soff');return}if(!SCID||!scAsked()){scr('sout');$('#slog').innerHTML=LV.howHTML(LV.LOGIN,'v');return}
  if(S.code&&S.id===SCID)return;S.id=SCID;S.code=LV.room(SCID);S.made=0;S.m=null;
  if(typeof scFetch==='function'&&SCON)scFetch('a=rpg&id='+SCID,null,6000).then(function(j){if(j&&j.ok){S.me=j.v;putMe();if(S.tab==='eq')drawTab()}},function(){});
  if(S.unM)S.unM();S.unM=LDB.listen(R('m'),onM);if(S.unF)S.unF();S.unF=LDB.listen(R('fx/'+S.id),onFx);
  scr('swait');drawWait()}
/* 我 加入了（大螢幕 看得到 我的 英雄）：每一場（made）寫 一次；換裝備 也 重寫 */
function putMe(){if(!S.m||S.m.phase==='end')return;var st=S.me&&S.me.st&&S.me.st.eq||{};LDB.set(R('p/'+S.id),{h:st.h||'',pt:st.p||'',pw:S.me?S.me.power||0:0,at:Date.now()})}
function heroImg(cls){var st=S.me&&S.me.st&&S.me.st.eq||{};return st.h?'<img class="'+(cls||'')+'" src="'+LV.img(BASE,st.h)+'" alt="我的英雄">':'<span class="noh '+(cls||'')+'">👤</span>'}
function petImg(cls){var st=S.me&&S.me.st&&S.me.st.eq||{};return st.p?'<img class="'+(cls||'')+'" src="'+LV.img(BASE,st.p)+'" alt="我的寵物">':'<span class="noh '+(cls||'')+'">🐾</span>'}
/* ── 等人：上面 一行 狀態 ＋ 三個 分頁 ── */
function drawWait(){var m=S.m,on=m&&m.phase!=='end',g=on?LV.game(m.game):null,cls=String(S.id).slice(0,3);
  $('#wt').innerHTML=on?LV.badge(m.game,'sm')+'<span><b>✅ 你 已經 進入 '+cls+' 班 的 遊戲</b><small>'+g.nm+'　等 老師 按〔▶ 開始〕…</small></span>':
    '<span class="wdot"></span><span><b>⏳ 等 老師 建立 '+cls+' 班 的 遊戲…</b><small>老師 一 建立，你 就 自動 進去（不用 打 號碼）</small></span>';
  $$('#wtabs [data-tab]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-tab')===S.tab)});drawTab()}
function drawTab(){var el=$('#wbody');if(!el)return;if(S.tab!=='mini')MINI.stop();
  if(S.tab==='how'){var g=S.m&&S.m.phase!=='end'?LV.game(S.m.game):LV.GAMES[0];el.innerHTML='<div class="whow">'+LV.badge(g.k,'lg')+'<h2>'+g.nm+'</h2>'+LV.howHTML(g.how,'v')+'<h3>🔑 登入 方式</h3>'+LV.howHTML(LV.LOGIN,'v sm')+'</div>';return}
  if(S.tab==='eq'){eqDraw(el);return}
  if(!MINI.on())MINI.start(el,WORDS[String(S.id).charAt(0)==='3'?3:4]||[])}
/* ⚔ 換裝備：我 有的 英雄、武器、寵物（點 一下 ＝ 換上，大螢幕 馬上 換） */
function eqDraw(el){var v=S.me;if(!v){el.innerHTML='<div class="note big2">⏳ 讀取 你的 裝備…（沒有 網路 ＝ 先 玩 小遊戲）</div>';return}
  var own=v.st.own||{},eq=v.st.eq||{},row=function(k,nm){var L=(own[k]||[]);return '<h3>'+nm+'</h3><div class="eqr">'+(L.length?L.map(function(id){return '<button class="eqb'+(eq[k]===id?' on':'')+'" data-eq="'+id+'"><img src="'+LV.img(BASE,id)+'" alt="">'+(eq[k]===id?'<i>✅ 裝備中</i>':'')+'</button>'}).join(''):'<span class="note">還沒有（去〔戰神之路〕換）</span>')+'</div>'};
  el.innerHTML='<div class="eqw"><div class="eqme">'+heroImg('eqhi')+'<div><b>⚔ 戰力 '+(v.power||0)+'</b><span class="note">點 一下 ＝ 換上；大螢幕 上 的 你 也 會 換</span></div></div>'+row('h','🦸 英雄')+row('w','⚔ 武器')+row('p','🐾 寵物')+'<div id="eqm" class="note"></div></div>'}
function eqGo(id){var m=$('#eqm');if(S.eqBusy)return;S.eqBusy=1;if(m)m.textContent='⏳ 換 裝備 中…';
  scFetch('',{a:'rpg',id:S.id,op:'eq',item:id},12000).then(function(j){S.eqBusy=0;if(j&&j.v)S.me=j.v;if(j&&j.ok){putMe();if(S.tab==='eq')drawTab();var mm=$('#eqm');if(mm)mm.textContent='✅ 換好了'}else if(m)m.textContent='❌ 沒有 換成'},function(){S.eqBusy=0;if(m)m.textContent='📶 沒有 網路，沒有 換'})}
/* ── 遊戲 的 狀態 一變 就 來 ── */
function onM(m){S.m=m;
  if(!m){if(S.qi>=0&&!$('#send').hidden)return;S.qi=-1;S.made=0;scr('swait');drawWait();return}   /* 老師 結束 這一場：看 結果 的 人 留著，其他 回到 等待 */
  if(m.made!==S.made){S.made=m.made;S.qi=-1;S.draws=0;S.rw=[];S.pend={};S.cnt={};if(m.phase!=='end')putMe()}
  if(m.phase==='end'){if(S.qi>=0)endS(m);else{scr('swait');drawWait()}return}
  if(m.phase==='lobby'){if($('#swait').hidden)scr('swait');drawWait();return}
  if(m.phase==='how'){showHow(m);return}
  if(m.phase==='q'&&m.qi!==S.qi)newQ(m);
  else if(m.phase==='rev'&&m.rev&&m.rev.qi===S.qi)rev(m);
  else if(m.phase==='rev'&&S.qi<0){S.qi=m.qi;scr('sq');$('#sqq').innerHTML='⏳ 下一題 就 輪到 你！';$('#sqo').innerHTML=''}
  kingBtn()}
function showHow(m){MINI.stop();scr('show');var g=LV.game(m.game);$('#shw').innerHTML=LV.badge(m.game,'lg')+'<h1>'+g.nm+'</h1>'+LV.howHTML(g.how,'v')+'<div class="note big2">👀 看 大螢幕，馬上 開始！</div>'}
/* 新的一題來了，禮物盒還沒打開 ➜ 先收起來，這一題公布以後再拿出來（不擋答題）；已經打開了 ＝ 直接收 */
function giftAway(){var g=$('#gift');if(g.className.indexOf('on')<0)return;if(!(S.gp&&S.gp.done))S.drawLater=1;g.className='';g.innerHTML=''}
function newQ(m){MINI.stop();giftAway();$('#res').className='';S.qi=m.qi;S.ans=null;S.t0=Date.now();S.dur=m.dur||LV.DUR;S.met=0;S.pick2=[];S.pk=[];scr('sq');var q=m.q,P=S.pend;
  S.cur={cut:!!P.cut,hint:!!P.hint,two:!!P.retry&&q.ty==='mc'};delete P.cut;delete P.hint;delete P.retry;delete P.pause;
  $('#sqn').textContent='第 '+(m.qi+1)+' ／ '+m.n+' 題';
  $('#sqq').innerHTML=q.ty==='mc'?q.t:'<span class="chal">🔥 挑戰題 分數 ✖2</span><div>'+q.t+'</div><div class="chz">'+(q.ic?'<span class="chi">'+q.ic+'</span>':'')+esc(q.zh)+'</div>';
  $('#sqq').classList.toggle('zoom',(S.cnt.zoom||0)>0);if(S.cnt.zoom)S.cnt.zoom--;
  $('#sqh').innerHTML=S.cur.hint&&q.h?'💡 '+petImg('hpet')+' '+q.h:'';$('#sqh').hidden=!(S.cur.hint&&q.h);
  if(q.ty==='mc')$('#sqo').innerHTML='<div class="sos">'+q.o.map(function(t,i){var cut=S.cur.cut&&(q.x||[]).indexOf(i)>=0;return '<button class="so c'+i+(cut?' cut':'')+'" data-k="'+i+'"'+(cut?' disabled':'')+'><span class="shp">'+LV.SHAPE[i]+'</span><span class="sot">'+t+'</span></button>'}).join('')+'</div>';
  else chDraw();
  $('#sqm').textContent=S.cur.two?'🔁 這一題 可以 選 2 個':'';$('#sq').className='scr';stTick()}
/* 🔥 挑戰題：上面 空格（拼字 ＝ 字母 數；排句子 ＝ 字卡 數）、下面 打亂 的 方塊；點了 跳上去，〔⌫〕退一個，排滿 ＝〔✅ 送出〕 */
function chDraw(){var q=S.m.q,sp=q.ty==='sp',need=sp?q.tiles.length-2:q.tiles.length,done=S.ans;
  $('#sqo').innerHTML='<div class="chw'+(sp?' sp':' or')+'"><div class="chs">'+Array.apply(null,{length:need}).map(function(_,i){var k=S.pk[i];return '<span class="slot'+(k!=null?' f':'')+(i===S.pk.length?' cur':'')+'">'+(k!=null?esc(q.tiles[k]):'')+'</span>'}).join('')+(q.p?'<span class="pun">'+esc(q.p)+'</span>':'')+'</div>'+
    '<div class="cht2">'+q.tiles.map(function(t,i){return '<button class="tile" data-tile="'+i+'"'+(S.pk.indexOf(i)>=0||done?' disabled':'')+'>'+esc(t)+'</button>'}).join('')+'</div>'+
    '<div class="chc"><button class="chb" data-chb="back"'+(!S.pk.length||done?' disabled':'')+'>⌫ 退 一個</button><button class="chb go" data-chb="go"'+(S.pk.length<need||done?' disabled':'')+'>✅ 送出</button></div></div>'}
function stTick(){clearTimeout(S.tm);if(!S.m||S.m.phase!=='q')return;var left=Math.max(0,S.dur-(Date.now()-S.t0));$('#sqt').textContent=Math.ceil(left/1000);$('#sqring').style.setProperty('--p',(left/S.dur*100).toFixed(1));
  if(left<=0){if(!S.ans)$('#sqr').innerHTML='<div class="sr no">⏰ 時間到</div>';$$('#sqo button').forEach(function(b){b.disabled=true});return}S.tm=setTimeout(stTick,200)}
function flags(){var f={},c=S.cnt;if(c.x2>0)f.x2=1;if(c.fire>0)f.fire=1;if(c.rocket>0)f.rocket=1;if(S.pend.shield)f.sh=1;if(S.pend.cheer)f.ch=1;if(S.cur&&S.cur.two)f.rt=1;if(S.met)f.met=S.met;return f}
function send(a){var f=flags();a.f=f;S.ans=a;['x2','fire','rocket'].forEach(function(x){if(S.cnt[x]>0)S.cnt[x]--});delete S.pend.shield;delete S.pend.cheer;
  LDB.set(R('a/'+S.qi+'/'+S.id),a);$('#sqr').innerHTML='<div class="sr wait">✅ 送出了！看 大螢幕</div>'}
function answer(k){if(S.ans||!S.m||S.m.phase!=='q')return;var ms=Date.now()-S.t0;if(ms>S.dur)return;
  if(S.cur.two){if(S.pick2.indexOf(k)<0)S.pick2.push(k);$('#sqo [data-k="'+k+'"]').classList.add('pk');if(S.pick2.length<2){$('#sqm').textContent='🔁 再選 1 個';return}k=S.pick2.slice()}
  send({k:k,ms:ms});$$('#sqo .so').forEach(function(b){b.disabled=true;var kk=+b.getAttribute('data-k');if(kk===k||(k.indexOf&&k.indexOf(kk)>=0))b.classList.add('pk')})}
function chTap(i){if(S.ans||!S.m||S.m.phase!=='q')return;var q=S.m.q,need=q.ty==='sp'?q.tiles.length-2:q.tiles.length;if(S.pk.length>=need||S.pk.indexOf(i)>=0)return;S.pk.push(i);chDraw()}
function chGo(){var q=S.m.q,ms=Date.now()-S.t0;if(S.ans||ms>S.dur)return;var s=S.pk.map(function(i){return q.tiles[i]});send({s:q.ty==='sp'?s.join(''):s.join('|'),ms:ms});chDraw()}
/* ── 公布：整個 畫面 變色、這一題 幾分、第幾名、離 前一名 差 幾分（正向：只說「再 N 分 就 追上」）── */
function rev(m){clearTimeout(S.tm);var r=m.r||{},id=S.id,ok=r.ok&&r.ok[id],sc=(r.sc&&r.sc[id])||0,T=r.tot||{},tot=T[id]||0,st=(r.st&&r.st[id])||0,q=m.q||{};
  if(q.ty==='mc')$$('#sqo .so').forEach(function(b){var k=+b.getAttribute('data-k');b.disabled=true;b.classList.toggle('ok',k===m.rev.a);b.classList.toggle('no',k!==m.rev.a)});
  var L=Object.keys(T).sort(function(a,b){return T[b]-T[a]||(a<b?-1:1)}),rk=L.indexOf(id)+1,gap=rk>1?T[L[rk-2]]-tot:0;
  var ans=q.ty==='mc'?(q.o||[])[m.rev.a]:q.ty==='sp'?m.rev.a:String(m.rev.a).split('|').join(' ').replace(/ (’|')/g,'$1')+(q.p||'');
  if(ok&&typeof rwFx==='function'&&m.game!=='classic'){var eq5=S.me&&S.me.st&&S.me.st.eq||{};if(eq5.s&&eq5.s.fx)rwFx(BASE,eq5.s.fx)}   /* 💥 必殺武功特效：答對 一題 演一次（經典搶答 不演，畫面 保持 乾淨） */
  var o=$('#res');o.className='on '+(ok?'ok':S.ans?'no':'to');
  o.innerHTML='<div class="rbx"><div class="rbig">'+(ok?'✔':S.ans?'✖':'⏰')+'</div><div class="rt">'+(ok?'答對！':S.ans?'答錯了，沒關係':'這一題 沒有 答')+'</div>'+
    (ok?'<div class="rsc">＋'+sc.toLocaleString()+'</div>'+(st>1?'<div class="rst">🔥 連對 '+st+' 題（連對 加分）</div>':''):'<div class="rans">✔ 正確 答案：<b>'+esc(ans)+'</b></div>'+(m.rev.h?'<div class="rh">💡 '+m.rev.h+'</div>':''))+
    (ok&&m.game==='boss'?'<div class="rst">⚔ 你的 英雄 出招 ➜ 魔王 <b>－'+(10+Math.min(20,Math.floor(((S.me&&S.me.power)||0)/100)))+'</b></div>':'')+
    '<div class="rrk">🏆 總分 '+tot.toLocaleString()+'　｜　第 <b>'+rk+'</b> 名'+(rk>1?'<small>再 '+gap.toLocaleString()+' 分 就 追上 第 '+(rk-1)+' 名！</small>':'<small>你 是 第一名！保持 下去！</small>')+'</div></div>';
  $('#sqr').innerHTML='<div class="sr '+(ok?'ok':'no')+'">'+(ok?'✅ 答對！ ＋'+sc:S.ans?'❌ 答錯了，沒關係':'⏰ 這一題 沒有 答')+'</div>';
  var okc=(r.okc&&r.okc[id])||0;S.okc=okc;if(m.game!=='classic'&&(Math.floor(okc/5)>S.draws||S.drawLater)){S.draws=Math.max(S.draws,Math.floor(okc/5));S.drawLater=0;setTimeout(function(){$('#res').className='';draw()},2200)}}
function endS(m){clearTimeout(S.tm);$('#res').className='';scr('send');var r=m.r||{},T=r.tot||{},L=Object.keys(T).sort(function(a,b){return T[b]-T[a]}),rk=L.indexOf(S.id)+1;
  $('#ew').innerHTML=heroImg('wimg')+'<div class="et">'+(rk>0&&rk<=3?['🥇','🥈','🥉'][rk-1]+' 第 '+rk+' 名！':'🎉 任務 完成！第 '+rk+' 名')+'</div><div class="ss">🏆 總分 '+(T[S.id]||0).toLocaleString()+'　✅ 答對 '+((r.okc||{})[S.id]||0)+' 題</div>'+
    (S.rw.length?'<div class="note">🎁 你 抽到：'+S.rw.map(function(k){var x=LV.RW.filter(function(y){return y.k===k})[0];return x?x.ic+' '+x.nm:k}).join('、')+'</div>':'')+
    '<div class="note">'+(m.given?'✅ 老師 發好 獎勵了 ➜ 打開〔戰神之路〕看看':'老師 發 獎勵 以後，打開〔戰神之路〕就 看得到（⭐ 經驗值、🪙 金幣）')+'</div>'}
/* ── 🐾 寵物叼來禮物盒（每答對 5 題；經典搶答 沒有）── */
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
/* ── 干擾（老師大螢幕自動送；經典搶答 沒有）── */
function onFx(v){if(!v||!v.at||v.at<=S.fxAt||!S.m||!S.m.int)return;S.fxAt=v.at;var g=LV.game(S.m.game),F=g.fx,q=$('#sq'),o=$('#fxo');if(!F)return;
  o.className='on '+F.k;o.innerHTML='<div class="fxt">'+F.ic+' '+F.t+'</div>';
  if(F.k==='roar'||F.k==='yank')q.classList.add('shake');
  else if(F.k==='smoke'||F.k==='fog')q.classList.add('fog');
  else if(F.k==='snow'){var h='';for(var i=0;i<40;i++)h+='<i class="sno" style="left:'+(Math.random()*100).toFixed(0)+'%;animation-delay:'+(Math.random()*.8).toFixed(2)+'s"></i>';o.innerHTML+=h;q.classList.add('fog')}
  else if(F.k==='gust')q.classList.add('float');else if(F.k==='wave')q.classList.add('shake');
  else if(F.k==='pat'){S.wake=0;o.innerHTML+='<button class="slp" data-wake="1"><span class="egg2">🥚</span><b>點 3 下 安撫 龍蛋</b></button>'}
  clearTimeout(S.ftm);S.ftm=setTimeout(fxOff,F.ms||2000)}
function fxOff(){var q=$('#sq');['fog','float','shake'].forEach(function(c){q.classList.remove(c)});var o=$('#fxo');o.className='';o.innerHTML='';
  S.pend.shield=1;var b=$('#sqm');if(b&&!S.ans)b.textContent='🛡 送你 護盾：下一次 答錯 不算 斷連對'}
/* 👑 王者擂台：台下（不是前 3 名）可以按 📣 加油（一秒一次、最多 30 次） */
function kingBtn(){var b=$('#kch');if(!b)return;var m=S.m,on=m&&m.game==='king'&&(m.phase==='q'||m.phase==='rev');
  if(on){var T=(m.r&&m.r.tot)||{},L=Object.keys(T).sort(function(a,c){return T[c]-T[a]});on=L.slice(0,3).indexOf(S.id)<0}b.hidden=!on}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#sIn')){scLogin(function(){SCH.close();scBar();ready()});return}
  if((b=c('#wtabs [data-tab]'))){S.tab=b.getAttribute('data-tab');drawWait();return}
  if((b=c('[data-eq]'))){eqGo(b.getAttribute('data-eq'));return}
  if((b=c('#sqo .so'))){answer(+b.getAttribute('data-k'));return}
  if((b=c('[data-tile]'))){chTap(+b.getAttribute('data-tile'));return}
  if((b=c('[data-chb]'))){if(b.getAttribute('data-chb')==='back'){if(!S.ans){S.pk.pop();chDraw()}}else chGo();return}
  if(c('#res')){$('#res').className='';return}
  if((b=c('[data-gk]'))){boxes(b.getAttribute('data-gk'));return}
  if((b=c('[data-gi]'))){openBox(+b.getAttribute('data-gi'));return}
  if(c('[data-gok]')){$('#gift').className='';$('#gift').innerHTML='';return}
  if(c('[data-wake]')){S.wake++;if(S.wake>=3)fxOff();return}
  if(c('#kch')){var now=Date.now();if(now-S.chT<1000||S.chN>=30)return;S.chT=now;S.chN++;LDB.set(R('ch/'+S.id),S.chN);b=$('#kch');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');return}
});
setInterval(function(){if(!S.code||S.id!==SCID)ready()},800);
