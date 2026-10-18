/* live/_mini.js — ⚡ 等人小遊戲（學生 等 老師 按〔▶ 開始〕的 時候 玩）。只寫 ES5。
   2026-10-18 第十二次 老師 6：複習 這個 年級 的 學習 重點、答對 計入 平時 成績、鼓勵 用心 作答；玩法 要 多元、有趣、好玩、刺激；增加 不同 玩法。
   8 種，題目 ＝ 這個 年級 句型遊戲 的 題目（MINIB，live/_qbank.js；成績 題組 g年級gm_lm-遊戲，第幾題 一樣 ➜ 老師看板 錯題 分析 看得到 題目）：
     ⚡ 閃電 連擊（連對 火焰 愈 燒 愈 大）、👑 魔王 對決（答對 打 魔王，8 下 打倒）、🎯 二選一 快手（左右 兩顆 大 按鈕）、🧩 句子 拼圖（照 順序 點）、
     🔄 變身術（答對 句子 翻面 變身）、🔍 偵探 找錯字（放大鏡）、🧱 填空 衝刺（答對 字 飛進 空格）、🗂 分類 快遞（包裹 丟進 左邊 或 右邊）
   一回合 8 題、每題 有 時間條；答對 愈快 分數 愈高、連擊 加分；答錯 ＝ 1.8 秒 看 正確 答案（逐字 中文）＋ 💡
   一回合 做完（≧ 6 題）＝ 記進 成績（跟 平常 的 遊戲 一樣：正確率、練習次數 ＋1、錯題、經驗值 金幣）；1 秒 內 亂按 超過 一半 ＝ 不算（成績 系統 本來 的 規則）
   沒有 音效（老師 7）。 */
var MINI=(function(){
  var EL=null,B={},G=4,ON=false,T=[],K=0,ORD=['g1','g10','g2','g3','g4','g7','g8','g9'],R=null;
  var KIND={g1:{c:'#FFB300',sec:8,t:'選 對 的 答案；連對 愈多 🔥 愈 大'},g10:{c:'#E53935',sec:10,t:'答對 ＝ 打 魔王 一下；8 下 打倒 牠！'},g2:{c:'#1E88E5',sec:6,t:'左邊 還是 右邊？愈快 愈好'},g3:{c:'#8E24AA',sec:25,t:'照 順序 點 方塊，排出 整句'},
    g4:{c:'#00897B',sec:12,t:'選 變身 以後 正確 的 句子'},g7:{c:'#6D4C41',sec:12,t:'找出 錯 的 那一個 字（也 可能 全對）'},g8:{c:'#3949AB',sec:10,t:'選 一個 字 填進 空格'},g9:{c:'#F4511E',sec:8,t:'包裹 要 送到 哪一邊？'}};
  function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
  function clr(){T.forEach(clearTimeout);T=[]}
  function later(f,ms){T.push(setTimeout(f,ms))}
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function next(){var k=0,L=ORD.filter(function(x){return B[x]&&B[x].qs.length>=8});if(!L.length)return '';
    try{k=(+localStorage.getItem('lv_mini2')||0)+1;localStorage.setItem('lv_mini2',k)}catch(e){k=Math.floor(Math.random()*L.length)}return L[k%L.length]}
  /* 一回合 */
  function round(id){clr();if(!id)return;var D=B[id];R={id:id,qs:shuf(D.qs).slice(0,8),k:0,Q:[],sc:0,cb:0,best:0,hp:8,t0:Date.now()};show()}
  function frame(body){var D=B[R.id],k=KIND[R.id];
    EL.innerHTML='<div class="mg" style="--mc:'+k.c+'"><div class="mgh"><b>'+D.nm+'</b><small>'+k.t+'</small><span class="mgs">⭐ '+R.sc+'</span></div>'+
      '<div class="mgp">'+R.qs.map(function(_,i){var x=R.Q[i];return '<i class="'+(x?(x[0]?'ok':'no'):i===R.k?'cur':'')+'"></i>'}).join('')+(R.cb>=2?'<span class="mgf" style="--f:'+Math.min(5,R.cb)+'">🔥 '+R.cb+' 連擊</span>':'')+'</div>'+
      '<div class="mgtm"><i id="mgbar"></i></div><div class="mgb mk-'+R.id+'">'+body+'</div><div class="mgf2"><button class="mgx" data-mg="swap">🔄 換 一種 小遊戲</button></div></div>'}
  function show(){var q=R.qs[R.k],id=R.id;R.q=q;R.ts=Date.now();R.lock=false;
    if(q.ty==='or'){R.pk=[];R.sh=null;drawOr();timer();return}
    R.ord=shuf(q.o.map(function(_,i){return i}));
    var opt=function(cls){return R.ord.map(function(i,j){return '<button class="mo '+(cls||'')+' c'+j+'" data-mo="'+i+'"><span class="shp">'+LV.SHAPE[j]+'</span><span>'+q.o[i]+'</span></button>'}).join('')};
    var top='';
    if(id==='g10')top='<div class="mboss"><span class="mbi">🐲</span><span class="mhp"><i style="width:'+(R.hp/8*100)+'%"></i></span><b>❤ '+R.hp+' ／ 8</b></div>';
    if(id==='g7')top='<div class="mmag">🔍</div>';
    if(id==='g9')top='<div class="mpk">📦</div>';
    frame(top+'<div class="mq'+(id==='g4'?' flip':'')+'" id="mq">'+q.t+'</div><div class="mos n'+q.o.length+(id==='g2'||id==='g9'?' duo':'')+'">'+opt(id==='g9'?'bin':'')+'</div><div id="mfb" class="mfb"></div>');
    timer()}
  function tl(){return R.sh||(R.sh=shuf(R.q.tiles.map(function(_,i){return i})))}
  function drawOr(){var q=R.q,need=q.tiles.length;
    frame('<div class="mq">'+(q.zh||'')+'</div><div class="mor"><div class="mslot">'+q.tiles.map(function(_,i){var k=R.pk[i];return '<span class="'+(k!=null?'f':'')+'">'+(k!=null?esc(q.tiles[k]):'')+'</span>'}).join('')+(q.p?'<span class="pun">'+esc(q.p)+'</span>':'')+'</div>'+
      '<div class="mtl">'+tl().map(function(i){return '<button class="mtile" data-mt="'+i+'"'+(R.pk.indexOf(i)>=0||R.lock?' disabled':'')+'>'+esc(q.tiles[i])+'</button>'}).join('')+'</div>'+
      '<div class="mchc"><button data-mb="back"'+(!R.pk.length||R.lock?' disabled':'')+'>⌫ 退 一個</button></div></div><div id="mfb" class="mfb"></div>');
    void need}
  function timer(){var dur=KIND[R.id].sec*1000,b=document.getElementById('mgbar');if(!b)return;
    b.style.transition='none';b.style.width='100%';void b.offsetWidth;b.style.transition='width '+(dur/1000)+'s linear';b.style.width='0%';
    var k=R.k;later(function(){if(R&&R.k===k&&!R.lock)pick(-1)},dur)}
  /* 答 了 一題：pick ＝ 選了 原本 的 第幾個（0 ＝ 正解，-1 ＝ 時間 到） */
  function pick(i){if(R.lock)return;R.lock=true;var q=R.q,dur=KIND[R.id].sec*1000,ms=Date.now()-R.ts,ok=i===0,left=Math.max(0,1-ms/dur);
    R.Q.push([ok?1:0,i,Math.round(ms/100)/10,i>=0&&ms<1000?1:0,ok?Math.round(left*1000)/1000:0,q.i]);
    if(ok){R.cb++;if(R.cb>R.best)R.best=R.cb;var s=100+Math.round(400*left)+Math.min(100,(R.cb-1)*20);R.sc+=s;if(R.id==='g10')R.hp=Math.max(0,R.hp-1)}else R.cb=0;
    var b=EL.querySelector('[data-mo="'+i+'"]');if(b)b.classList.add(ok?'ok':'no');var c=EL.querySelector('[data-mo="0"]');if(c&&!ok)c.classList.add('ok');
    var fb=document.getElementById('mfb');
    if(ok){if(fb)fb.innerHTML='<div class="mok">⭐ 答對！＋'+(100+Math.round(400*left))+(R.cb>=2?'　🔥 '+R.cb+' 連擊':'')+'</div>';
      var mq=document.getElementById('mq');if(mq&&R.id==='g4')mq.classList.add('go');if(R.id==='g8'&&mq)mq.innerHTML=String(mq.innerHTML).replace('＿＿','<b class="mfill">'+(q.ot?esc(q.ot[0]):'')+'</b>');
      if(R.id==='g10'){var bo=EL.querySelector('.mboss');if(bo){bo.classList.add('hit');bo.querySelector('i').style.width=(R.hp/8*100)+'%';bo.querySelector('b').textContent='❤ '+R.hp+' ／ 8'}}
      later(go,ok&&R.id==='g4'?1000:750)}
    else{if(fb)fb.innerHTML='<div class="mno">'+(i<0?'⏰ 時間 到':'再 看 一次 正確 答案')+'</div>'+LV.glHTML({ag:q.ag,az:q.az,ae:q.ae,ans:q.ot?q.ot[0]:q.a,h:q.h});later(go,2600)}
    var bar=document.getElementById('mgbar');if(bar){bar.style.transition='none';bar.style.width=bar.getBoundingClientRect().width+'px'}}
  function go(){R.k++;if(R.k>=R.qs.length||(R.id==='g10'&&R.hp<=0)){fin();return}show()}
  /* 一回合 結束：星星、答對 幾題、最高 連擊、記進 成績 */
  function fin(){clr();var n=R.Q.length,ok=0,fast=0;R.Q.forEach(function(x){ok+=x[0];fast+=x[3]});var st=ok>=n-1?3:ok>=n*.6?2:1,rec=n>=6&&fast*2<=n&&rec1();
    EL.innerHTML='<div class="mg mgend" style="--mc:'+KIND[R.id].c+'"><div class="mgst">'+Array(st+1).join('⭐')+'<span class="dim">'+Array(4-st).join('⭐')+'</span></div>'+
      (R.id==='g10'&&R.hp<=0?'<div class="mgbig">🐲 魔王 被 打倒 了！</div>':'')+
      '<div class="mgbig">答對 '+ok+' ／ '+n+' 題</div><div class="note big2">最高 🔥 '+R.best+' 連擊　⭐ '+R.sc+' 分</div>'+
      '<div class="note">'+(rec?'📝 記進 成績 了（練習 次數 ＋1）':fast*2>n?'⚠ 太快 亂按 超過 一半 ➜ 這一回 不 算 成績；慢慢 看、用心 答':'（沒有 登入 或 沒有 網路：這一回 沒有 記 成績）')+'</div>'+
      '<div class="mgf2"><button class="mgx go" data-mg="again">▶ 再 玩 一回</button><button class="mgx" data-mg="swap">🔄 換 一種</button></div></div>';
    later(function(){round(next())},9000)}
  /* 記 成績：跟 平常 的 遊戲 一樣 送到 成績系統（score/_client.js 的 佇列；沒有 網路 先 存 平板，等一下 補送） */
  function rec1(){try{if(typeof scLive!=='function'||!scLive())return false;
    var u=SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    var Rr={id:SCID,set:'g'+G+'gm_lm-'+R.id,name:'⚡ 等人小遊戲｜'+B[R.id].nm,m:'g',qs:R.Q,raw:R.sc,fix:0,mp:0,mw:0,sec:Math.round((Date.now()-R.t0)/1000),src:'school',dev:SCDEV,u:u,t:Date.now()};
    var QQ=scGet('q')||[];QQ.push(Rr);scPut('q',QQ.slice(-200));scFlush();return true}catch(e){return false}}
  function click(e){var t=e.target,b=t.closest&&t.closest('[data-mo],[data-mt],[data-mb],[data-mg]');if(!b||!R)return;
    if(b.hasAttribute('data-mg')){var a=b.getAttribute('data-mg');round(a==='again'?R.id:next());return}
    if(b.hasAttribute('data-mo')){pick(+b.getAttribute('data-mo'));return}
    if(R.lock)return;var q=R.q;
    if(b.hasAttribute('data-mb')){R.pk.pop();drawOr();return}
    var i=+b.getAttribute('data-mt');if(R.pk.indexOf(i)>=0)return;R.pk.push(i);
    if(R.pk.length>=q.tiles.length){var s=R.pk.map(function(k){return q.tiles[k]}).join('|');var ok=LV.norm(s)===LV.norm(q.a);drawOr();pick(ok?0:1)}else drawOr()}
  return {
    on:function(){return ON},
    start:function(el,bank,g){EL=el;B=bank||{};G=g||4;ON=true;el.onclick=click;
      /* 排句子：方塊 打亂 一次（同一題 一直 同樣 的 順序） */
      R=null;round(next())},
    stop:function(){clr();ON=false;if(EL){EL.onclick=null}}
  };
})();
