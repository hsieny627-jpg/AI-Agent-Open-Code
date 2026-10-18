/* live/_mini.js — ⚡ 現場任務：學生 等 其他 同學 登入 的 時候 玩 的 小遊戲（2026-10-18 第十一次 老師：每次 登入 以後、開始 以前，每次 都 不一樣）。只寫 ES5。
   6 種，每一次 進來 換 下一種（localStorage 記 上一次 是 哪一種，再 打亂）；玩完 一回合 可以〔🔄 換 一種〕。
   全部 用 這一個 年級 學過 的 字（WORDS：en、zh、ic），只 練 英文，不 記 成績、不 連網。
   ① 🎈 氣球 拼字 ② 🃏 翻牌 配對 ③ ⚡ 看 英文 選 中文 ④ 🔤 ABC 排排站 ⑤ 👀 哪一個 拼對了 ⑥ 🖼 看 圖 選 英文 */
var MINI=(function(){
  var EL=null,W=[],ON=false,T=[],K=0,ST={n:0,ok:0};
  var GM=[['🎈','氣球 拼字','照 順序 點 氣球，拼出 英文 字'],['🃏','翻牌 配對','翻 兩張：英文 配 中文'],['⚡','看 英文 選 中文','連對 愈多 愈 厲害'],
          ['🔤','ABC 排排站','照 a b c 的 順序 點 字母'],['👀','哪一個 拼對了','只有 一個 拼對，找出來'],['🖼','看 圖 選 英文','看 圖示，點 對的 英文']];
  function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
  function pick(n,ex){return shuf(W.filter(function(w){return !ex||ex.indexOf(w)<0})).slice(0,n)}
  function clr(){T.forEach(clearTimeout);T=[]}
  function later(f,ms){T.push(setTimeout(f,ms))}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function next(){var k=0;try{k=(+localStorage.getItem('lv_mini')||0)+1+Math.floor(Math.random()*2);localStorage.setItem('lv_mini',k)}catch(e){k=Math.floor(Math.random()*6)}return k%GM.length}
  function frame(body){var g=GM[K];EL.innerHTML='<div class="mg"><div class="mgh"><span class="mgi">'+g[0]+'</span><b>'+g[1]+'</b><small>'+g[2]+'</small><span class="mgs">⭐ '+ST.ok+'</span></div><div class="mgb">'+body+'</div>'+
    '<div class="mgf"><button class="mgx" data-mg="swap">🔄 換 一種 小遊戲</button></div></div>'}
  function good(msg,then){ST.ok++;var b=EL.querySelector('.mgb');if(b)b.insertAdjacentHTML('beforeend','<div class="mgok">'+(msg||'⭐ 太棒了！')+'</div>');later(then,1100)}
  function bad(el){if(!el)return;el.classList.remove('mgno');void el.offsetWidth;el.classList.add('mgno')}
  /* ① 🎈 氣球 拼字 */
  function g0(){var w=pick(1)[0],L=w.en.toLowerCase().split(''),i=0;
    frame('<div class="mgq"><span class="mgic">'+w.ic+'</span>'+esc(w.zh)+'</div><div class="mgsl">'+L.map(function(){return '<i></i>'}).join('')+'</div><div class="mgbl">'+
      shuf(L.map(function(c,j){return {c:c,j:j}})).map(function(x,n){return '<button class="bal" data-bal="'+x.c+'" style="--d:'+(n*.37%1.8).toFixed(2)+'s;--h:'+(n*47%360)+'">'+x.c+'</button>'}).join('')+'</div>');
    EL.onclick=function(e){var b=e.target.closest&&e.target.closest('[data-bal]');if(!b||b.disabled)return;
      if(b.getAttribute('data-bal')===L[i]){b.disabled=true;b.classList.add('pop');EL.querySelectorAll('.mgsl i')[i].textContent=L[i];i++;if(i>=L.length)good('⭐ '+esc(w.en)+'！',g0)}else bad(b)}}
  /* ② 🃏 翻牌 配對（3 對） */
  function g1(){var ws=pick(3),C=shuf(ws.map(function(w,j){return {t:w.en,p:j}}).concat(ws.map(function(w,j){return {t:w.ic+' '+w.zh,p:j}}))),up=[],done=0;
    frame('<div class="mgcards">'+C.map(function(c,j){return '<button class="mcd" data-cd="'+j+'"><span class="mcb">?</span><span class="mcf">'+esc(c.t)+'</span></button>'}).join('')+'</div>');
    EL.onclick=function(e){var b=e.target.closest&&e.target.closest('[data-cd]');if(!b||b.classList.contains('up')||up.length>=2)return;b.classList.add('up');up.push(b);
      if(up.length===2){var a=C[+up[0].getAttribute('data-cd')],c=C[+up[1].getAttribute('data-cd')];
        if(a.p===c.p){up.forEach(function(x){x.classList.add('done')});up=[];done++;if(done>=3)good('⭐ 全部 配好了！',g1)}
        else later(function(){up.forEach(function(x){x.classList.remove('up')});up=[]},800)}}}
  /* ③ ⚡ 看 英文 選 中文 */
  function g2(){var w=pick(1)[0],o=shuf([w].concat(pick(2,[w])));
    frame('<div class="mgq big">'+esc(w.en)+'</div><div class="mgo">'+o.map(function(x){return '<button data-o="'+(x===w?1:0)+'">'+x.ic+' '+esc(x.zh)+'</button>'}).join('')+'</div>');
    EL.onclick=function(e){var b=e.target.closest&&e.target.closest('[data-o]');if(!b)return;if(b.getAttribute('data-o')==='1'){b.classList.add('ok');good('',g2)}else bad(b)}}
  /* ④ 🔤 ABC 排排站（5 個 字母） */
  function g3(){var A=shuf('abcdefghijklmnopqrstuvwxyz'.split('')).slice(0,5),S2=A.slice().sort(),i=0;
    frame('<div class="mgq">照 <b>a ➜ z</b> 的 順序 點</div><div class="mgsl">'+S2.map(function(){return '<i></i>'}).join('')+'</div><div class="mgbl abc">'+A.map(function(c){return '<button class="bal" data-abc="'+c+'" style="--h:'+(c.charCodeAt(0)*37%360)+'">'+c+'</button>'}).join('')+'</div>');
    EL.onclick=function(e){var b=e.target.closest&&e.target.closest('[data-abc]');if(!b||b.disabled)return;
      if(b.getAttribute('data-abc')===S2[i]){b.disabled=true;b.classList.add('pop');EL.querySelectorAll('.mgsl i')[i].textContent=S2[i];i++;if(i>=S2.length)good('⭐ '+S2.join(' ')+'！',g3)}else bad(b)}}
  /* ⑤ 👀 哪一個 拼對了（另外 兩個：兩個 字母 換 位置、少 一個 字母） */
  function g4(){var w=pick(1,W.filter(function(x){return x.en.length<4}))[0]||W[0],e=w.en,j=1+Math.floor(Math.random()*(e.length-2)),
      sw=e.slice(0,j)+e.charAt(j+1)+e.charAt(j)+e.slice(j+2),dr=e.slice(0,j)+e.slice(j+1),o=shuf([e,sw,dr].filter(function(x,k,a){return a.indexOf(x)===k}));
    frame('<div class="mgq"><span class="mgic">'+w.ic+'</span>'+esc(w.zh)+'</div><div class="mgo">'+o.map(function(x){return '<button data-o="'+(x===e?1:0)+'" class="en">'+esc(x)+'</button>'}).join('')+'</div>');
    EL.onclick=function(ev){var b=ev.target.closest&&ev.target.closest('[data-o]');if(!b)return;if(b.getAttribute('data-o')==='1'){b.classList.add('ok');good('',g4)}else bad(b)}}
  /* ⑥ 🖼 看 圖 選 英文 */
  function g5(){var w=pick(1)[0],o=shuf([w].concat(pick(2,[w])));
    frame('<div class="mgq"><span class="mgic huge">'+w.ic+'</span><small>'+esc(w.zh)+'</small></div><div class="mgo">'+o.map(function(x){return '<button data-o="'+(x===w?1:0)+'" class="en">'+esc(x.en)+'</button>'}).join('')+'</div>');
    EL.onclick=function(e){var b=e.target.closest&&e.target.closest('[data-o]');if(!b)return;if(b.getAttribute('data-o')==='1'){b.classList.add('ok');good('',g5)}else bad(b)}}
  var RUN=[g0,g1,g2,g3,g4,g5];
  function go(){clr();RUN[K]();var sw=EL.onclick;EL.onclick=function(e){var b=e.target.closest&&e.target.closest('[data-mg="swap"]');if(b){K=(K+1)%GM.length;go();return}sw&&sw(e)}}
  return {start:function(el,words){EL=el;W=(words||[]).filter(function(w){return w&&w.en&&/^[A-Za-z]+$/.test(w.en)&&w.en.length>=3});if(W.length<4){el.innerHTML='';return}ON=true;K=next();go()},
    stop:function(){clr();ON=false;if(EL)EL.onclick=null},on:function(){return ON},
    /* 量測 用：直接 開 第 k 種 */
    test:function(el,words,k){this.start(el,words);K=k;go()},n:GM.length};
})();
