/* score/_cer_rt.js — 🏆 頒獎典禮 10 種風格（老師看板〔🏫 班級排行榜〕〔🏆 開始頒獎典禮〕；listen/2026-10-17_C8/ 同一份）
 * 2026-10-17 老師 C6 第三題：保留 10 種風格；文字照 C3 一個字都不改；
 *   每一個領獎台 第 1 名明顯比較高（台子高度 第 1 名 ≈ 第 2 名的 2 倍、第 3 名的 4 倍）；
 *   領獎台每一種風格用不同的動畫上台（第 3 名 ➜ 第 2 名 ➜ 鼓聲 ➜ 第 1 名最後、最大、最震撼）；8 冠軍遊行重做（花車開進來）。
 * 用法：CERX.play(舞台元素, 第幾種, {ribbon, sub, cls, say, pod:[{rk, w}]}, {snd:true/false})；CERX.stop(舞台)；CERX.pick() ＝ 每按一次換一種、跟上一次不一樣。
 * 聲音：每一種風格自己一套（SND，2026-10-17 C8 三），用 HON.ac() 的 AudioContext；沒有 HON 就不出聲。 */
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
  /* 每一種風格自己的音效（老師 2026-10-17 C8 三：每一種動畫的音效必須不同；〔🔊 聲音 開／關〕保留）。網頁自己合成，不用音檔。
     每一種 5 個時間點：a 開場（0 秒）、b 掌聲／歡呼（1.9 秒）、r 第 3 名、第 2 名上台、u 第 1 名上台前的懸疑、f 第 1 名上台 */
  function C(){return window.HON&&HON.ac?HON.ac():null}
  function T(f,t0,d,ty,v,f2){var c=C();if(!c)return;var o=c.createOscillator(),g=c.createGain(),n=c.currentTime+t0;o.type=ty||'triangle';o.frequency.setValueAtTime(f,n);
    if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(v||.15,n+.02);g.gain.exponentialRampToValueAtTime(.001,n+d);
    o.connect(g);g.connect(c.destination);o.start(n);o.stop(n+d+.05)}
  function N(t0,d,v,fq,ty,q){var c=C();if(!c)return;var m=Math.floor(c.sampleRate*d),b=c.createBuffer(1,m,c.sampleRate),x=b.getChannelData(0);for(var i=0;i<m;i++)x[i]=Math.random()*2-1;
    var s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),n=c.currentTime+t0;s.buffer=b;f.type=ty||'bandpass';f.frequency.value=fq||1200;f.Q.value=q||.8;
    g.gain.setValueAtTime(v||.2,n);g.gain.exponentialRampToValueAtTime(.001,n+d);s.connect(f);f.connect(g);g.connect(c.destination);s.start(n)}
  function chord(fs,t0,d,ty,v){fs.forEach(function(f){T(f,t0,d,ty,v)})}
  function clap(d,v){for(var i=0;i<60;i++)N(Math.random()*d,.05,(v||.12)*(.5+Math.random()),900+Math.random()*1500)}
  function roll(d,fq,v){for(var t=0;t<d;t+=.055)N(t,.05,(v||.12)+.2*t/d,fq||180)}
  var SND=[
   {nm:'銅管號角＋鼓聲',a:function(){[[523,0],[659,.22],[784,.44],[1047,.66]].forEach(function(n,i){T(n[0],n[1],i<3?.25:.9,'sawtooth',.07);T(n[0],n[1],i<3?.25:.9,'triangle',.15)})},
    b:function(){clap(2.2)},r:function(){T(1319,0,.5,'sine',.12)},u:function(){roll(1.5)},f:function(){N(0,.8,.3,5000,'highpass');chord([523,659,784,1047],0,1.4,'sawtooth',.05);clap(2.6,.15)}},
   {nm:'星星風鈴',a:function(){[1568,1760,2093,2349,2637,3136].forEach(function(f,i){T(f,i*.12,.9,'sine',.07)})},
    b:function(){for(var i=0;i<10;i++)T(2000+Math.random()*2400,Math.random()*1.6,.6,'sine',.05)},r:function(){T(2637,0,1.2,'sine',.1);T(3951,.05,1,'sine',.05)},
    u:function(){T(400,0,1.5,'sine',.08,1600);T(404,0,1.5,'sine',.05,1612)},f:function(){[1047,1319,1568,2093,2637,3136,4186].forEach(function(f,i){T(f,i*.07,1.6,'sine',.08)})}},
   {nm:'煙火咻～碰',a:function(){T(500,0,.9,'sine',.1,2400);N(.9,.9,.45,120,'lowpass')},b:function(){for(var i=0;i<26;i++)N(Math.random()*1.8,.03,.2,3000+Math.random()*3000,'highpass')},
    r:function(){T(600,0,.6,'sine',.08,2000);N(.6,.6,.35,140,'lowpass')},u:function(){T(300,0,1.5,'sine',.1,3000)},
    f:function(){[0,.25,.55].forEach(function(t){N(t,1,.5,100,'lowpass');N(t,.6,.15,4000,'highpass')});for(var i=0;i<40;i++)N(.4+Math.random()*1.6,.03,.18,5000,'highpass')}},
   {nm:'相機快門＋歡呼',a:function(){for(var i=0;i<8;i++){N(i*.18,.02,.35,3500,'highpass');N(i*.18+.04,.03,.2,1800)}},b:function(){N(0,2,.12,800,'bandpass',.4);clap(2,.1)},
    r:function(){N(0,.02,.35,3500,'highpass');N(.12,.02,.35,3500,'highpass')},u:function(){N(0,1.5,.06,600,'bandpass',.3);T(110,0,1.5,'sine',.08,220)},
    f:function(){T(70,0,.6,'sine',.5,40);N(0,.4,.5,90,'lowpass');N(.1,2.2,.15,900,'bandpass',.4)}},
   {nm:'升旗號＋小鼓',a:function(){[[392,0,.18],[523,.2,.18],[659,.4,.18],[784,.6,.5],[659,1.15,.18],[784,1.35,.8]].forEach(function(n){T(n[0],n[1],n[2],'square',.05);T(n[0],n[1],n[2],'triangle',.1)})},
    b:function(){[0,.25,.5,.62,.75,1,1.25,1.37,1.5].forEach(function(t){N(t,.08,.25,2200)})},r:function(){T(784,0,.3,'square',.05);T(1047,.15,.5,'square',.05)},
    u:function(){roll(1.5,2000,.06)},f:function(){[[523,0,.2],[659,.2,.2],[784,.4,.2],[1047,.6,1.2]].forEach(function(n){T(n[0],n[1],n[2],'square',.06);T(n[0],n[1],n[2],'triangle',.12)});N(.6,.9,.3,5000,'highpass')}},
   {nm:'管風琴＋定音鼓',a:function(){[[262,330,392],[349,440,523],[392,494,587]].forEach(function(c,i){c.concat([c[0]/2]).forEach(function(f){T(f,i*.6,.9,'sine',.07);T(f*2,i*.6,.9,'sine',.025)})})},
    b:function(){T(98,0,.5,'sine',.3,90);T(98,.6,.5,'sine',.3,90)},r:function(){chord([523,659,784],0,1,'sine',.06)},u:function(){for(var t=0;t<1.5;t+=.08)T(98,t,.12,'sine',.12+.15*t/1.5,92)},
    f:function(){chord([131,262,330,392,523],0,2.4,'sine',.07);chord([262,330,392],0,2.4,'triangle',.04);T(65,0,.8,'sine',.4,60)}},
   {nm:'拆信封＋噹啷',a:function(){for(var i=0;i<6;i++)N(i*.12,.12,.12,3000,'bandpass',.5)},b:function(){T(880,0,.12,'sine',.06);T(880,.5,.12,'sine',.06);T(880,1,.12,'sine',.06)},
    r:function(){N(0,.25,.15,2500,'bandpass',.5);chord([659,831,988],.25,.6,'triangle',.07)},u:function(){for(var t=0;t<1.5;t+=.25)T(1200,t,.06,'square',.04)},
    f:function(){N(0,.35,.2,2500,'bandpass',.5);chord([523,659,784,1047],.3,1.6,'triangle',.09);T(2093,.3,1.2,'sine',.06)}},
   {nm:'遊行樂隊',a:function(){for(var b=0;b<4;b++){T(80,b*.5,.25,'sine',.35,55);N(b*.5+.25,.08,.2,2400)}},b:function(){T(2600,0,.25,'sine',.08,3000);T(2600,.35,.25,'sine',.08,3000);clap(1.6,.08)},
    r:function(){T(80,0,.25,'sine',.35,55);N(.12,.3,.25,6000,'highpass')},u:function(){roll(1.5,240,.1)},
    f:function(){[[392,0],[494,.15],[587,.3],[784,.45]].forEach(function(n){T(n[0],n[1],.5,'sawtooth',.06)});N(.45,1.2,.35,6000,'highpass');T(60,.45,.6,'sine',.4,45);for(var i=0;i<6;i++)T(700+i*120,.6+i*.08,.3,'square',.03,1400)}},
   {nm:'極光風聲',a:function(){T(220,0,2,'sine',.06,330);T(222,0,2,'sine',.05,333);N(0,2.2,.07,500,'bandpass',.3)},b:function(){T(660,0,1.6,'sine',.05,880)},
    r:function(){T(1046,0,1.4,'sine',.07);T(1568,.1,1.2,'sine',.04)},u:function(){T(130,0,1.5,'sine',.1,260);N(0,1.5,.08,700,'bandpass',.3)},
    f:function(){chord([392,494,587,784,988],0,2.6,'sine',.06);N(0,2.6,.06,900,'bandpass',.3)}},
   {nm:'水晶敲擊',a:function(){[2793,3520,4186,3136,2637].forEach(function(f,i){T(f,i*.15,.5,'sine',.08);T(f*2.76,i*.15,.2,'sine',.03)})},b:function(){for(var i=0;i<14;i++){var f=2500+Math.random()*3000;T(f,Math.random()*1.6,.35,'sine',.05)}},
    r:function(){T(3520,0,.8,'sine',.1);T(3520*2.76,0,.3,'sine',.03)},u:function(){T(1500,0,1.5,'sine',.06,6000)},
    f:function(){[4186,3951,3520,3136,2637,2349,2093].forEach(function(f,i){T(f,i*.06,.9,'sine',.07);T(f*2.76,i*.06,.3,'sine',.02)});chord([1047,1319,1568],.4,1.6,'sine',.06)}}
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
  function play(el,k,D,o){o=o||{};stop(el);var S=ST[k]||ST[0],TM=[],RD=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,H=window.HON&&HON.snd;
    el.className='cx cs'+(k+1);el.style.background=S.bg||'';
    el.innerHTML='<div class="deco">'+S.deco()+'</div><div class="ribbon">'+D.ribbon+'</div><div class="sub">'+D.sub+'</div>'+
      '<div class="mid"><div class="cupw">'+CUP+'</div><div class="cls">'+D.cls+'</div><div class="say">'+D.say+'</div></div>'+pod(D.pod||[]);
    var CC=['#FFD54A','#FF6B6B','#7FD4FF','#3BD16F','#FF9FD2'],nn=k===7?70:k===0?34:0;
    for(var n=0;n<nn;n++){var c=document.createElement('i');c.className='cf';c.style.left=(Math.random()*100)+'%';c.style.background=CC[n%5];c.style.animationDelay=(k===7?.6:2)+Math.random()*1.4+'s';c.style.borderRadius=n%3?'2px':'50%';el.appendChild(c)}
    void el.offsetWidth;el.classList.add('go');
    var Z=SND[k]||SND[0],z=function(f){try{f()}catch(e){}};
    if(o.snd&&H){z(Z.a);TM.push(setTimeout(function(){z(Z.b)},1900))}
    var P2=RD?0:4600;TM.push(setTimeout(function(){el.classList.add('p2')},P2));
    if(o.snd&&H&&!RD){TM.push(setTimeout(function(){z(Z.r)},P2+300));TM.push(setTimeout(function(){z(Z.r)},P2+1400));
      TM.push(setTimeout(function(){z(Z.u)},P2+1600));TM.push(setTimeout(function(){z(Z.f)},P2+3200))}
    if(!RD&&(k===3||k===7))TM.push(setTimeout(function(){el.classList.add('shk')},P2+3300));
    el._cx=TM;return 9800}
  return {ST:ST,SND:SND,pick:pick,play:play,stop:stop,pod:pod};
})();
