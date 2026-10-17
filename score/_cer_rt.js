/* score/_cer_rt.js — 🏆 頒獎典禮 10 種風格（老師看板〔🏫 班級排行榜〕〔🏆 開始頒獎典禮〕；listen/2026-10-17_C8/ 同一份）
 * 2026-10-17 老師 C6 第三題：保留 10 種風格；文字照 C3 一個字都不改；
 *   每一個領獎台 第 1 名明顯比較高（台子高度 第 1 名 ≈ 第 2 名的 2 倍、第 3 名的 4 倍）；
 *   領獎台每一種風格用不同的動畫上台（第 3 名 ➜ 第 2 名 ➜ 鼓聲 ➜ 第 1 名最後、最大、最震撼）；8 冠軍遊行重做（花車開進來）。
 * 用法：CERX.play(舞台元素, 第幾種, {ribbon, sub, cls, say, pod:[{rk, w}]}, {snd:true/false})；CERX.stop(舞台)；CERX.pick() ＝ 每按一次換一種、跟上一次不一樣。
 * 聲音用 HON.snd（_honor_rt.js），沒有 HON 就不出聲。 */
var CERX=(function(){
  var CUP='<svg class="cup" viewBox="0 0 120 130"><defs><linearGradient id="gcupx" x1="0" x2="1"><stop offset="0" stop-color="#A8740C"/><stop offset=".45" stop-color="#FFE48A"/><stop offset="1" stop-color="#B07A0E"/></linearGradient></defs><path d="M30 10h60v28c0 22-14 38-30 38S30 60 30 38z" fill="url(#gcupx)"/><path d="M30 18H12c0 20 10 30 22 32M90 18h18c0 20-10 30-22 32" fill="none" stroke="url(#gcupx)" stroke-width="7"/><rect x="53" y="76" width="14" height="20" fill="url(#gcupx)"/><rect x="34" y="96" width="52" height="12" rx="3" fill="url(#gcupx)"/><rect x="26" y="108" width="68" height="16" rx="4" fill="#3A2A10"/><path d="M60 26l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="#FFF7D6"/></svg>';
  function stars(n){var o='';for(var i=0;i<n;i++)o+='<i class="xs" style="left:'+((i*37)%100)+'%;top:'+((i*23)%70)+'%;opacity:'+(.3+(i%5)/7).toFixed(2)+'"></i>';return o}
  var ST=[
   {nm:'舞台燈光',bg:'',deco:function(){return '<div class="beam"></div><div class="floor"></div>'}},
   {nm:'星空',bg:'radial-gradient(ellipse at 50% 100%,#1A2A60,#020414 70%)',deco:function(){return stars(60)+'<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="xfull"><path d="M8 20L20 12L33 18L45 8M60 10L72 20L86 14L94 24" fill="none" stroke="#9FB8FF" stroke-width=".3" stroke-dasharray="1 1"/></svg>'}},
   {nm:'金色煙火',bg:'#05040A',deco:function(){var o='';[[20,24],[80,20],[50,12]].forEach(function(p,k){for(var i=0;i<14;i++){var a=i*Math.PI/7;o+='<i class="xfw" style="left:'+p[0]+'%;top:'+p[1]+'%;animation-delay:'+(1+k*.7)+'s;--x:'+(Math.cos(a)*90).toFixed(0)+'px;--y:'+(Math.sin(a)*90).toFixed(0)+'px"></i>'}});return o}},
   {nm:'紅毯',bg:'linear-gradient(#140608,#000)',deco:function(){return '<div class="xrug"></div>'}},
   {nm:'升旗典禮',bg:'linear-gradient(#2A6FB0,#0D2A4A)',deco:function(){return ''}},
   {nm:'皇家殿堂',bg:'linear-gradient(#2A0A10,#120408)',deco:function(){return [6,18,76,88].map(function(x){return '<div class="xcol" style="left:'+x+'%"></div>'}).join('')+'<div class="xcur"></div><div class="beam"></div><div class="crn">👑</div>'}},
   {nm:'打開信封',bg:'radial-gradient(ellipse at 50% 60%,#2B1E40,#05030A 70%)',deco:function(){return '<div class="xenv">得獎的是……</div>'}},
   {nm:'冠軍遊行',bg:'linear-gradient(#0E4A8A 0%,#3FA0E8 55%,#1C6B3A 55%,#0D3A1E 100%)',deco:function(){var o='<div class="xroad"></div>';for(var i=0;i<9;i++)o+='<i class="xbl" style="left:'+(4+i*11)+'%;animation-delay:'+(.2+(i%4)*.35)+'s;background:'+['#FF5A5A','#FFD54A','#5AB0FF','#3BD16F','#FF9FD2'][i%5]+'"></i>';return o}},
   {nm:'極光',bg:'#020812',deco:function(){return '<div class="xaur"></div>'+stars(40)}},
   {nm:'水晶光芒',bg:'radial-gradient(circle at 50% 35%,#18223A,#03050A 70%)',deco:function(){var o='';for(var i=0;i<12;i++)o+='<i class="xray" style="transform:rotate('+(i*30)+'deg);background:linear-gradient(90deg,hsla('+(i*30)+',90%,70%,.8),transparent);animation-delay:'+(1+i*.05)+'s"></i>';return o}}
  ];
  function lsg(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
  function lss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  /* 每按一次換一種，10 種輪完再洗牌，跟上一次不一樣 */
  function pick(){var o=lsg('cer_st')||{q:[],last:-1};if(!o.q||!o.q.length){var a=[],i;for(i=0;i<ST.length;i++)a.push(i);for(i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}
    if(a[0]===o.last)a.push(a.shift());o.q=a}var n=o.q.shift();o.last=n;lss('cer_st',o);return n}
  var MD=['','🥇','🥈','🥉'],DL={3:0,2:1.1,1:3.0};   /* 上台順序：第 3 名 ➜ 第 2 名 ➜（鼓聲）➜ 第 1 名 */
  function pod(P){return '<div class="cpod">'+[2,1,3].map(function(r){var a=P.filter(function(x){return x.rk===r});if(!a.length)return '<div class="cp nop"></div>';
    return '<div class="cp p'+r+'" style="--d:'+DL[r]+'s"><div class="ct"><div class="cfl"></div>'+a.map(function(x){return x.w}).join('<br>')+'</div><div class="cb"><span class="cbm">'+MD[r]+'</span><span class="cbt">第 '+r+' 名</span><i class="cwl l"></i><i class="cwl r"></i></div><div class="cboom"></div></div>'}).join('')+'</div>'}
  function stop(el){if(el&&el._cx){el._cx.forEach(clearTimeout);el._cx=null}}
  function play(el,k,D,o){o=o||{};stop(el);var S=ST[k]||ST[0],T=[],RD=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,H=window.HON&&HON.snd;
    el.className='cx cs'+(k+1);el.style.background=S.bg||'';
    el.innerHTML='<div class="deco">'+S.deco()+'</div><div class="ribbon">'+D.ribbon+'</div><div class="sub">'+D.sub+'</div>'+
      '<div class="mid"><div class="cupw">'+CUP+'</div><div class="cls">'+D.cls+'</div><div class="say">'+D.say+'</div></div>'+pod(D.pod||[]);
    var CC=['#FFD54A','#FF6B6B','#7FD4FF','#3BD16F','#FF9FD2'],nn=k===7?70:k===0?34:0;
    for(var n=0;n<nn;n++){var c=document.createElement('i');c.className='cf';c.style.left=(Math.random()*100)+'%';c.style.background=CC[n%5];c.style.animationDelay=(k===7?.6:2)+Math.random()*1.4+'s';c.style.borderRadius=n%3?'2px':'50%';el.appendChild(c)}
    void el.offsetWidth;el.classList.add('go');
    if(o.snd&&H){H.horn&&H.horn();T.push(setTimeout(function(){H.clap&&H.clap(1.2)},1900))}
    var P2=RD?0:4600;T.push(setTimeout(function(){el.classList.add('p2')},P2));
    if(o.snd&&H&&!RD){T.push(setTimeout(function(){H.ding&&H.ding()},P2+300));T.push(setTimeout(function(){H.ding&&H.ding()},P2+1400));
      T.push(setTimeout(function(){H.drum&&H.drum(1.5)},P2+1600));T.push(setTimeout(function(){H.horn&&H.horn();H.clap&&H.clap(2.6)},P2+3200))}
    if(!RD&&(k===3||k===7))T.push(setTimeout(function(){el.classList.add('shk')},P2+3300));
    el._cx=T;return 9800}
  return {ST:ST,pick:pick,play:play,stop:stop,pod:pod};
})();
