/* live/_stu_rt.js — ⚡ 現場任務 學生平板（live/index.html）。只寫 ES5。要先載入成績系統的登入（score/_client.js home()）、live/_db.js、live/_common.js、live/_mini.js；網頁裡有 BASE、MINIB。
   2026-10-18 第十二次 重做（老師 試玩：等不到 第一題、搞不清楚 現在 要 做 什麼、要 全程 無音效、錯題 分析 比照 遊戲；規格 live/CLAUDE.md 最上面）：
   ● 永遠 一行 大字 告訴 學生 現在 要 做 什麼（等 老師／看 大螢幕／點 答案／看 對不對／看 名次）
   ● 同步：live/_db.js 輪詢（每 0.7 秒 問 一次 版本號，變了 才 拿 遊戲 狀態）；答案 一定 送到（失敗 自己 重試）
   ● 平板 沒有 任何 音效、不會 自己 出聲；錯題 頁 有〔🔊 聽〕學生 自己 點（老師 選：大螢幕 自動 唸 給 全班 聽）
   ● 答錯 ➜ 錯題 分析：❌ 你選的（錯的 字 紅框）、✅ 正確 答案（每一個 英文 字 下面 有 中文）、整句 翻譯、💡 為什麼
   ● 結束 ➜ 個人 錯題 總分析：答對 率 圓圈、每一題 ✅❌ 一個一個 亮、我的 錯題（逐字 中文＋🔊）、全班 最多人 錯 的 前 3 題
   ● 等人：⚡ 等人小遊戲（這個 年級 的 句型 重點，答對 記進 平時成績；_mini.js）；換裝 的 頁面 拿掉了（老師 6） */
var S={code:'',id:'',m:null,qi:-1,ans:null,t0:0,dur:20000,pend:{},cnt:{},draws:0,rw:[],me:null,fxAt:0,met:0,unW:null,pick2:[],chN:0,chT:0,okc:0,made:0,pk:[],hist:{},hb:null};
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function scr(id){$$('.scr').forEach(function(x){x.hidden=x.id!==id});if(id!=='swait')MINI.stop()}
function R(p){return 'rooms/'+S.code+(p?'/'+p:'')}
function grade(){return String(S.id).charAt(0)==='3'?3:4}
function audio(p){return p?BASE+String(p).replace(/^\.\.\//,''):''}
function say1(o){LV.say(audio(o.au),o.ae||o.ans,1)}
/* 一行 大字：現在 要 做 什麼 */
function now(t,cls){var e=$('#now');e.innerHTML=t;e.className='now '+(cls||'')}
LDB.onBad(function(b){var e=$('#net');if(e)e.hidden=!b});
/* ── 登入以後：自動 進入 自己 班 的 遊戲 ── */
function ready(){if(!LDB.on()){scr('soff');return}if(!SCID||!scAsked()){scr('sout');now('🔑 先 登入：打 你的 5 碼');return}
  if(S.code&&S.id===SCID)return;S.id=SCID;S.code=LV.room(SCID);S.made=0;S.m=null;S.hist={};
  if(typeof scFetch==='function'&&SCON)scFetch('a=rpg&id='+SCID,null,6000).then(function(j){if(j&&j.ok){S.me=j.v;putMe()}},function(){});
  putMe();clearInterval(S.hb);S.hb=setInterval(putMe,20000);
  if(S.unW)S.unW();S.unW=LDB.watch(S.code,700,onM);
  wait()}
/* 我 在 這裡（大螢幕、老師看板 的 座號 格子 會 亮）：每 20 秒 寫 一次 */
function putMe(){if(!S.id)return;var st=S.me&&S.me.st&&S.me.st.eq||{};LDB.set(R('p/'+S.id),{h:st.h||'',pt:st.p||'',pw:S.me?S.me.power||0:0,at:Date.now()})}
function heroImg(cls){var st=S.me&&S.me.st&&S.me.st.eq||{};return st.h?'<img class="'+(cls||'')+'" src="'+LV.img(BASE,st.h)+'" alt="我的戰士">':'<span class="noh '+(cls||'')+'">👤</span>'}
function petImg(cls){var st=S.me&&S.me.st&&S.me.st.eq||{};return st.p?'<img class="'+(cls||'')+'" src="'+LV.img(BASE,st.p)+'" alt="我的寵物">':'<span class="noh '+(cls||'')+'">🐾</span>'}
/* ── 等人：上面 一行 ＋ 小遊戲 ── */
function wait(){var m=S.m,on=m&&m.phase==='lobby',cls=String(S.id).slice(0,3);
  if($('#swait').hidden)scr('swait');
  if(on)now('✅ 你 已經 進入 '+cls+' 班 的 遊戲<small>'+LV.game(m.game).nm+'　等 老師 按〔▶ 開始〕；先 玩 小遊戲</small>','ok');
  else now('⏳ 等 老師 建立 '+cls+' 班 的 遊戲<small>老師 一 建立，你 就 自動 進去；先 玩 小遊戲</small>');
  if(!MINI.on())MINI.start($('#wbody'),MINIB[grade()]||{},grade())}
/* ── 遊戲 的 狀態 一變 就 來 ── */
function onM(m){S.m=m;
  if(!m||!m.phase){if(S.qi>=0&&!$('#send').hidden)return;S.qi=-1;S.made=0;wait();return}   /* 老師 結束 這一場：看 結果 的 人 留著，其他 回到 等待 */
  if(m.made!==S.made){S.made=m.made;S.qi=-1;S.draws=0;S.rw=[];S.pend={};S.cnt={};S.hist={};S.revd=-1;S.lbd=-1;putMe()}
  if(m.fx&&m.fx[S.id])onFx(m.fx[S.id]);
  if(m.phase==='lobby'){wait();return}
  if(m.phase==='end'){if(S.qi>=0||Object.keys(S.hist).length)endS(m);else wait();return}
  if(m.phase==='how'){if(S.how!==m.made){S.how=m.made;showHow(m)}return}
  if(m.phase==='q'&&m.qi!==S.qi){newQ(m);return}
  if(m.phase==='q'){kingBtn();return}
  if(m.phase==='rev'&&m.rev&&S.revd!==m.qi){S.revd=m.qi;if(S.qi===m.qi)rev(m);else lateS(m);return}
  if(m.phase==='lb'&&S.lbd!==m.qi){S.lbd=m.qi;lbS(m);return}
  kingBtn()}
function lateS(m){S.qi=m.qi;scr('sq');$('#sqq').innerHTML='';$('#sqo').innerHTML='';$('#sqr').innerHTML='';now('👀 看 大螢幕：下一題 就 輪到 你！','go')}
function showHow(m){scr('show');var g=LV.game(m.game);$('#shw').innerHTML=LV.badge(m.game,'lg')+'<h1>'+g.nm+'</h1>'+LV.howHTML(g.how,'v');now('👀 看 大螢幕：馬上 開始！','go')}
/* 新的一題來了，禮物盒還沒打開 ➜ 先收起來（不擋答題） */
function giftAway(){var g=$('#gift');if(g.className.indexOf('on')<0)return;if(!(S.gp&&S.gp.done))S.drawLater=1;g.className='';g.innerHTML=''}
function newQ(m){giftAway();$('#res').className='';$('#res').innerHTML='';S.qi=m.qi;S.ans=null;S.t0=Date.now();S.dur=m.dur||LV.DUR;S.met=0;S.pick2=[];S.pk=[];scr('sq');var q=m.q,P=S.pend;
  S.cur={cut:!!P.cut,hint:!!P.hint,two:!!P.retry&&q.ty==='mc'&&q.o.length===4};delete P.cut;delete P.hint;delete P.retry;delete P.pause;
  $('#sqn').textContent='第 '+(m.qi+1)+' ／ '+m.n+' 題';
  $('#sqq').innerHTML=q.ty==='mc'?(q.ls?'<div class="lsn">🎧 仔細 聽 大螢幕</div>':q.t):'<span class="chal">'+(q.ch?'🔥 挑戰題 分數 ✖2':'🧩 排句子')+'</span><div>'+q.t+'</div><div class="chz">'+(q.ic?'<span class="chi">'+q.ic+'</span>':'')+(q.zh||'')+'</div>';
  $('#sqq').classList.toggle('zoom',(S.cnt.zoom||0)>0);if(S.cnt.zoom)S.cnt.zoom--;
  $('#sqh').innerHTML=S.cur.hint&&m.q.h?'💡 '+petImg('hpet')+' '+m.q.h:'';$('#sqh').hidden=true;
  if(q.ty==='mc')$('#sqo').innerHTML='<div class="sos n'+q.o.length+'">'+q.o.map(function(t,i){var cut=S.cur.cut&&(q.x||[]).indexOf(i)>=0;return '<button class="so c'+i+(cut?' cut':'')+'" data-k="'+i+'"'+(cut?' disabled':'')+'><span class="shp">'+LV.SHAPE[i]+'</span><span class="sot">'+t+'</span></button>'}).join('')+'</div>';
  else chDraw();
  $('#sqm').textContent=S.cur.two?'🔁 這一題 可以 選 2 個':'';$('#sqr').innerHTML='';
  now(q.ty==='mc'?'👆 點 你的 答案（跟 大螢幕 同樣 的 顏色＋形狀）':'👆 照 順序 點 方塊，再 按〔✅ 送出〕','go');stTick();kingBtn()}
/* 🔥 挑戰題／🧩 排句子：上面 空格、下面 打亂 的 方塊；點了 跳上去，〔⌫〕退一個，排滿 ＝〔✅ 送出〕 */
function chDraw(){var q=S.m.q,sp=q.ty==='sp',need=sp?q.tiles.length-2:q.tiles.length,done=S.ans;
  $('#sqo').innerHTML='<div class="chw'+(sp?' sp':' or')+'"><div class="chs">'+Array.apply(null,{length:need}).map(function(_,i){var k=S.pk[i];return '<span class="slot'+(k!=null?' f':'')+(i===S.pk.length?' cur':'')+'">'+(k!=null?esc(q.tiles[k]):'')+'</span>'}).join('')+(q.p?'<span class="pun">'+esc(q.p)+'</span>':'')+'</div>'+
    '<div class="cht2">'+q.tiles.map(function(t,i){return '<button class="tile" data-tile="'+i+'"'+(S.pk.indexOf(i)>=0||done?' disabled':'')+'>'+esc(t)+'</button>'}).join('')+'</div>'+
    '<div class="chc"><button class="chb" data-chb="back"'+(!S.pk.length||done?' disabled':'')+'>⌫ 退 一個</button><button class="chb go" data-chb="go"'+(S.pk.length<need||done?' disabled':'')+'>✅ 送出</button></div></div>'}
function stTick(){clearTimeout(S.tm);if(!S.m||S.m.phase!=='q')return;var left=Math.max(0,S.dur-(Date.now()-S.t0));$('#sqt').textContent=Math.ceil(left/1000);$('#sqring').style.setProperty('--p',(left/S.dur*100).toFixed(1));
  if(S.cur&&S.cur.hint&&$('#sqh').hidden&&$('#sqh').innerHTML)$('#sqh').hidden=false;
  if(left<=0){if(!S.ans){$('#sqr').innerHTML='<div class="sr no">⏰ 時間到</div>';now('⏰ 時間到 ➜ 👀 看 大螢幕 公布','')}$$('#sqo button').forEach(function(b){b.disabled=true});return}S.tm=setTimeout(stTick,200)}
function flags(){var f={},c=S.cnt;if(c.x2>0)f.x2=1;if(c.fire>0)f.fire=1;if(c.rocket>0)f.rocket=1;if(S.pend.shield)f.sh=1;if(S.pend.cheer)f.ch=1;if(S.cur&&S.cur.two)f.rt=1;if(S.met)f.met=S.met;return f}
/* 送 答案：一定 送到（失敗 每 0.8 秒 再 試）；送到 才 寫「✅ 送出了」 */
function send(a,show){var f=flags();a.f=f;S.ans=a;S.ansT=show;['x2','fire','rocket'].forEach(function(x){if(S.cnt[x]>0)S.cnt[x]--});delete S.pend.shield;delete S.pend.cheer;
  var qi=S.qi;$('#sqr').innerHTML='<div class="sr wait">⏳ 送出 中…</div>';
  LDB.must('PUT',R('a/'+qi+'/'+S.id),a,15).then(function(ok){if(S.qi!==qi)return;$('#sqr').innerHTML=ok?'<div class="sr wait">✅ 送出了！你選：'+show+'</div>':'<div class="sr no">📶 沒有 送到（網路 斷了）</div>';
    if(ok)now('✅ 送出了 ➜ 👀 看 大螢幕，等 老師 公布','ok')})}
function answer(k){if(S.ans||!S.m||S.m.phase!=='q')return;var ms=Date.now()-S.t0;if(ms>S.dur)return;var q=S.m.q;
  if(S.cur.two){if(S.pick2.indexOf(k)<0)S.pick2.push(k);$('#sqo [data-k="'+k+'"]').classList.add('pk');if(S.pick2.length<2){$('#sqm').textContent='🔁 再選 1 個';return}k=S.pick2.slice()}
  var show=(k.length?k:[k]).map(function(i){return '<span class="shp sm c'+i+'">'+LV.SHAPE[i]+'</span> '+esc((q.ot||[])[i]||'')}).join('、');
  send({k:k,ms:ms},show);$$('#sqo .so').forEach(function(b){b.disabled=true;var kk=+b.getAttribute('data-k');if(kk===k||(k.indexOf&&k.indexOf(kk)>=0))b.classList.add('pk')})}
function chTap(i){if(S.ans||!S.m||S.m.phase!=='q')return;var q=S.m.q,need=q.ty==='sp'?q.tiles.length-2:q.tiles.length;if(S.pk.length>=need||S.pk.indexOf(i)>=0)return;S.pk.push(i);chDraw()}
function chGo(){var q=S.m.q,ms=Date.now()-S.t0;if(S.ans||ms>S.dur)return;var s=S.pk.map(function(i){return q.tiles[i]});
  var show=q.ty==='sp'?s.join(''):s.join(' ').replace(/ (’|')/g,'$1')+(q.p||'');send({s:q.ty==='sp'?s.join(''):s.join('|'),ms:ms},esc(show));chDraw()}
/* ── 公布：整個 畫面 變色；答錯 ＝ 錯題 分析（比照 遊戲 答錯頁）；離 前一名 差 幾分（正向：只說「再 N 分 就 追上」）── */
function youTxt(q,a){if(!a)return '';if(q.ty==='mc'){var k=a.k;return (k&&k.length?k:[k]).map(function(i){return (q.ot||[])[i]||''}).join('、')}return q.ty==='sp'?a.s:String(a.s).split('|').join(' ').replace(/ (’|')/g,'$1')+(q.p||'')}
function rankOf(T,id){var L=Object.keys(T).sort(function(a,b){return T[b]-T[a]||(a<b?-1:1)}),rk=L.indexOf(id)+1;return {rk:rk,gap:rk>1?T[L[rk-2]]-(T[id]||0):0}}
function rev(m){clearTimeout(S.tm);var r=m.r||{},id=S.id,ok=!!(r.ok&&r.ok[id]),sc=(r.sc&&r.sc[id])||0,T=r.tot||{},tot=T[id]||0,st=(r.st&&r.st[id])||0,q=m.q||{},V=m.rev;
  if(q.ty==='mc')$$('#sqo .so').forEach(function(b){var k=+b.getAttribute('data-k');b.disabled=true;b.classList.toggle('ok',k===V.a);b.classList.toggle('no',k!==V.a)});
  var RK=rankOf(T,id),you=youTxt(q,S.ans),okTxt=V.ans||'';
  S.hist[m.qi]={ok:ok,you:you,ans:okTxt,ae:V.ae,ag:V.ag,az:V.az,au:V.au,h:V.h,t:q.ty==='mc'?(q.ls?'🎧 聽力題':q.t):q.t};
  if(ok&&typeof rwFx==='function'&&m.game!=='classic'){var eq5=S.me&&S.me.st&&S.me.st.eq||{};if(eq5.s&&eq5.s.fx)rwFx(BASE,eq5.s.fx)}   /* 💥 必殺武功特效（經典搶答 不演） */
  var o=$('#res');o.className='on '+(ok?'ok':S.ans?'no':'to');
  var ana=ok?'':'<div class="miss">'+(S.ans?'<div class="myou">❌ 你選的：<span>'+LV.diffHTML(you,V.ae&&q.ty!=='mc'?V.ae:okTxt)+'</span></div>':'')+
    '<div class="mok">✅ 正確 答案<button class="ghost say1" data-say1="1">🔊 聽</button></div>'+LV.glHTML({ag:V.ag,az:V.az,ae:V.ae,ans:okTxt,h:V.h},true)+'</div>';
  o.innerHTML='<div class="rbx"><div class="rtop"><span class="rbig">'+(ok?'✔':S.ans?'✖':'⏰')+'</span><span class="rt">'+(ok?'答對！':S.ans?'答錯了，看 一下 正確 答案':'這一題 沒有 答')+'</span>'+(ok?'<span class="rsc">＋'+sc.toLocaleString()+'</span>':'')+'</div>'+
    (ok&&st>1?'<div class="rst">🔥 連對 '+st+' 題（連對 加分）</div>':'')+
    (ok&&m.game==='boss'?'<div class="rst">⚔ 你的 戰士 出招 ➜ 魔王 <b>－'+(10+Math.min(20,Math.floor(((S.me&&S.me.power)||0)/100)))+'</b></div>':'')+ana+
    '<div class="rrk">🏆 總分 '+tot.toLocaleString()+'　｜　第 <b>'+RK.rk+'</b> 名'+(RK.rk>1?'<small>再 '+RK.gap.toLocaleString()+' 分 就 追上 第 '+(RK.rk-1)+' 名！</small>':'<small>你 是 第一名！保持 下去！</small>')+'</div></div>';
  $('#sqr').innerHTML='';
  now(ok?'✔ 答對！👀 看 大螢幕':'📌 看 正確 答案（可以 按〔🔊 聽〕）','ok');
  var okc=(r.okc&&r.okc[id])||0;S.okc=okc;if(m.game!=='classic'&&(Math.floor(okc/5)>S.draws))S.drawLater=1}
/* 排行榜：我 第幾名 */
function lbS(m){var r=m.r||{},T=r.tot||{},RK=rankOf(T,S.id),o=$('#res');if(S.qi<0)scr('sq');o.className='on lb';
  o.innerHTML='<div class="rbx"><div class="rtop"><span class="rbig">🏆</span><span class="rt">你 是 第 <b>'+RK.rk+'</b> 名</span></div><div class="rrk">總分 '+(T[S.id]||0).toLocaleString()+(RK.rk>1?'<small>再 '+RK.gap.toLocaleString()+' 分 就 追上 第 '+(RK.rk-1)+' 名！</small>':'<small>保持 下去！</small>')+'</div></div>';
  now('👀 看 大螢幕 的 排行榜；等 老師 出 下一題','');
  if(m.game!=='classic'&&S.drawLater){S.drawLater=0;S.draws=Math.floor(S.okc/5);setTimeout(draw,1200)}}
/* ── 結束：個人 錯題 總分析 ── */
function endS(m){if(S.ended===m.made)return;S.ended=m.made;clearTimeout(S.tm);$('#res').className='';giftAway();scr('send');var r=m.r||{},T=r.tot||{},RK=rankOf(T,S.id),q=(r.okq||{})[S.id]||'',sum=m.sum||{};
  var n=q.length,ok=(q.match(/1/g)||[]).length,acc=n?Math.round(ok/n*100):0,RD=46,L=2*Math.PI*RD;
  var mine=Object.keys(S.hist).map(Number).sort(function(a,b){return a-b}).filter(function(k){return !S.hist[k].ok});
  var h='<div class="eh">'+heroImg('wimg')+'<div><div class="et">'+(RK.rk>0&&RK.rk<=3?['🥇','🥈','🥉'][RK.rk-1]+' 第 '+RK.rk+' 名！':'🎉 任務 完成！第 '+RK.rk+' 名')+'</div><div class="ss">🏆 總分 '+(T[S.id]||0).toLocaleString()+'</div></div>'+
    '<svg class="ring2" viewBox="0 0 110 110"><circle cx="55" cy="55" r="'+RD+'" fill="none" stroke="#24313F" stroke-width="12"/><circle class="rg" cx="55" cy="55" r="'+RD+'" fill="none" stroke="#3BD16F" stroke-width="12" stroke-linecap="round" stroke-dasharray="'+L.toFixed(1)+'" stroke-dashoffset="'+L.toFixed(1)+'" style="--to:'+(L*(1-acc/100)).toFixed(1)+'" transform="rotate(-90 55 55)"/><text x="55" y="52" text-anchor="middle" font-size="22" fill="#fff" font-weight="700">'+ok+'／'+n+'</text><text x="55" y="74" text-anchor="middle" font-size="14" fill="#9FB3C8">答對</text></svg></div>'+
    '<div class="qch">'+q.split('').map(function(c,i){return '<span class="'+(c==='1'?'ok':c==='0'?'no':'na')+'" style="--i:'+i+'"><b>'+(i+1)+'</b>'+(c==='1'?'✅':c==='0'?'❌':'⏰')+'</span>'}).join('')+'</div>'+
    (mine.length?'<h2>📌 我的 錯題（看 正確 答案，按〔🔊〕聽）</h2>'+mine.map(function(k){var x=S.hist[k];return '<div class="wr go"><div class="wrh"><b>第 '+(k+1)+' 題</b><button class="ghost" data-say2="'+k+'">🔊 聽</button></div><div class="wrq">'+x.t+'</div>'+
      (x.you?'<div class="myou">❌ 你選的：<span>'+LV.diffHTML(x.you,x.ans)+'</span></div>':'')+LV.glHTML({ag:x.ag,az:x.az,ae:x.ae,ans:x.ans,h:x.h})+'</div>'}).join(''):'<h2>🎉 這一場 全部 答對！</h2>')+
    ((sum.wq||[]).length?'<h2>❌ 全班 最多人 錯 的 題目</h2>'+sum.wq.map(function(x,j){return '<div class="wr go"><div class="wrh"><b>'+['🥇','🥈','🥉'][j]+' 第 '+(x.qi+1)+' 題</b><span class="note">全班 答對 '+x.r+'%</span><button class="ghost" data-say3="'+j+'">🔊 聽</button></div>'+LV.glHTML({ag:x.ag,az:x.az,ae:x.ae,ans:x.ans,h:x.h})+'</div>'}).join(''):'')+
    (S.rw.length?'<div class="note">🎁 你 抽到：'+S.rw.map(function(k){var x=LV.RW.filter(function(y){return y.k===k})[0];return x?x.ic+' '+x.nm:k}).join('、')+'</div>':'')+
    '<div class="note big2">'+(m.given?'✅ 老師 發好 獎勵了 ➜ 打開〔戰神之路〕看看':'老師 發 獎勵 以後，打開〔戰神之路〕就 看得到（⭐ 經驗值、🪙 金幣）')+'</div>';
  $('#ew').innerHTML=h;now('🏁 任務 完成！看 你的 錯題 分析','ok');
  setTimeout(function(){var g=$('#ew .rg');if(g)g.classList.add('go');$$('#ew .qch span').forEach(function(x){x.classList.add('go')})},60)}
/* ── 🐾 寵物叼來禮物盒（每答對 5 題；經典搶答 沒有；排行榜 的 時候 才 出來）── */
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
  if(G.kind==='f')useF(x);else{S.rw.push(x.k);LDB.must('PUT',R('rw/'+S.id),S.rw,6)}}
function useF(x){var k=x.k;if(k==='x2'||k==='fire'||k==='rocket'||k==='zoom')S.cnt[k]=(S.cnt[k]||0)+x.n;else S.pend[k]=1;
  if(k==='pause')LDB.must('PUT',R('xt/'+S.id),S.qi+1,6)}
/* ── 干擾（老師大螢幕自動送，寫在 m.fx；經典搶答 沒有）── */
function onFx(v){if(!v||!v.at||v.at<=S.fxAt||!S.m||!S.m.int||S.m.phase!=='q')return;S.fxAt=v.at;var g=LV.game(S.m.game),F=g.fx,q=$('#sq'),o=$('#fxo');if(!F)return;
  o.className='on '+F.k;o.innerHTML='<div class="fxt">'+F.ic+' '+F.t+'</div>';
  if(F.k==='roar'||F.k==='yank'||F.k==='wave')q.classList.add('shake');
  else if(F.k==='smoke'||F.k==='fog')q.classList.add('fog');
  else if(F.k==='snow'){var h='';for(var i=0;i<40;i++)h+='<i class="sno" style="left:'+(Math.random()*100).toFixed(0)+'%;animation-delay:'+(Math.random()*.8).toFixed(2)+'s"></i>';o.innerHTML+=h;q.classList.add('fog')}
  else if(F.k==='gust')q.classList.add('float');
  else if(F.k==='pat'){S.wake=0;o.innerHTML+='<button class="slp" data-wake="1"><span class="egg2">🥚</span><b>點 3 下 安撫 龍蛋</b></button>'}
  clearTimeout(S.ftm);S.ftm=setTimeout(fxOff,F.ms||2000)}
function fxOff(){var q=$('#sq');['fog','float','shake'].forEach(function(c){q.classList.remove(c)});var o=$('#fxo');o.className='';o.innerHTML='';
  S.pend.shield=1;var b=$('#sqm');if(b&&!S.ans)b.textContent='🛡 送你 護盾：下一次 答錯 不算 斷連對'}
/* 👑 王者擂台：台下（不是前 3 名）可以按 📣 加油（一秒一次、最多 30 次） */
function kingBtn(){var b=$('#kch');if(!b)return;var m=S.m,on=m&&m.game==='king'&&m.phase==='q';
  if(on){var T=(m.r&&m.r.tot)||{},L=Object.keys(T).sort(function(a,c){return T[c]-T[a]});on=L.slice(0,3).indexOf(S.id)<0}b.hidden=!on}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#sIn')){scLogin(function(){SCH.close();scBar();ready()});return}
  if(c('#howb')){var hw=$('#whow');hw.hidden=!hw.hidden;return}
  if((b=c('#sqo .so'))){answer(+b.getAttribute('data-k'));return}
  if((b=c('[data-tile]'))){chTap(+b.getAttribute('data-tile'));return}
  if((b=c('[data-chb]'))){if(b.getAttribute('data-chb')==='back'){if(!S.ans){S.pk.pop();chDraw()}}else chGo();return}
  if(c('[data-say1]')){var V=S.m&&S.m.rev;if(V)say1(V);return}
  if((b=c('[data-say2]'))){say1(S.hist[+b.getAttribute('data-say2')]);return}
  if((b=c('[data-say3]'))){say1(((S.m&&S.m.sum)||{}).wq[+b.getAttribute('data-say3')]);return}
  if((b=c('[data-gk]'))){boxes(b.getAttribute('data-gk'));return}
  if((b=c('[data-gi]'))){openBox(+b.getAttribute('data-gi'));return}
  if(c('[data-gok]')){$('#gift').className='';$('#gift').innerHTML='';return}
  if(c('[data-wake]')){S.wake++;if(S.wake>=3)fxOff();return}
  if(c('#kch')){var tn=Date.now();if(tn-S.chT<1000||S.chN>=30)return;S.chT=tn;S.chN++;LDB.set(R('ch/'+S.id),S.chN);b=$('#kch');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');return}
});
setInterval(function(){if(!S.code||S.id!==SCID)ready()},800);
