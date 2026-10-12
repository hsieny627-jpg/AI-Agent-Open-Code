/* score/_honor_rt.js — 榮譽動畫的執行程式（2026-10-12 D 第 4 件）。學生平板（score/_client.js）、老師看板（score/_teacher.js）共用。只寫 ES5。
   研究（score/2026-10-12_D_需求與問題.md 第三節）：事先不知道的驚喜不傷動機（Deci 1999）➜ 12 種風格輪流、跟上一次一定不一樣、12 種輪完才重複；
   稱讚努力和方法、不稱讚聰明（Mueller & Dweck 1998、Henderlong & Lepper 2002）➜ 每一句都寫「你做了什麼」。 */
var HON=(function(){
  /* 努力獎：獎牌上面有星星（使用者 2026-10-12 第 1 題 C；自己畫的，每一台都一樣） */
  var EFF='<svg class="heff" viewBox="0 0 120 150" aria-label="最認真練習"><path d="M30 0h22l18 52H48z" fill="#2F7BE8"/><path d="M90 0H68L50 52h22z" fill="#E8453C"/><circle cx="60" cy="95" r="46" fill="#B8860B"/><circle cx="60" cy="95" r="40" fill="#FFC928"/><circle cx="60" cy="95" r="40" fill="#FFF1A8" opacity=".35"/><circle cx="60" cy="95" r="33" fill="none" stroke="#FFF3B0" stroke-width="2" opacity=".7"/><path d="M60 68l8.2 16.6 18.3 2.7-13.2 12.9 3.1 18.2L60 109.8l-16.4 8.6 3.1-18.2-13.2-12.9 18.3-2.7z" fill="#FFFDF0" stroke="#FFB300" stroke-width="2.5" stroke-linejoin="round"/></svg>';
  /* 練習時間：自己畫的時鐘（白底金框、紅色指針；使用者 2026-10-12 D8 第 1 題 A，取代 ⏱） */
  var CLK='<svg class="hclk" viewBox="0 0 100 100" aria-label="時鐘"><circle cx="50" cy="50" r="44" fill="#FFF8E6" stroke="#FFB300" stroke-width="8"/><rect x="48" y="12" width="4" height="10" fill="#8A5A00"/><rect x="48" y="12" width="4" height="10" fill="#8A5A00" transform="rotate(90 50 50)"/><rect x="48" y="12" width="4" height="10" fill="#8A5A00" transform="rotate(180 50 50)"/><rect x="48" y="12" width="4" height="10" fill="#8A5A00" transform="rotate(270 50 50)"/><rect x="47" y="24" width="6" height="28" rx="3" fill="#333"/><rect class="hclkm" x="47" y="34" width="6" height="18" rx="3" fill="#D84315" transform="rotate(60 50 50)"/><circle cx="50" cy="50" r="6" fill="#333"/></svg>';
  /* 三種最高榮譽（使用者 2026-10-12 D6～D8 定案）：學生平板、老師投影、印獎狀、老師看板的字一模一樣，只寫在這裡 */
  var AWK=['sec','acc','prog'],AWN={sec:'最認真練習',acc:'成績最優',prog:'進步最多'};
  function mn(sec){sec=Math.round(+sec||0);return sec<60?sec+' 秒':Math.round(sec/60)+' 分鐘'}
  function f1(v){return Math.round(v*10)/10}
  /* 個人獎下面那一句：per ＝ 這週／上週／這學期／這段期間；p ＝ {sec, acc, pf, pt} */
  function awl(k,p,per){return k==='sec'?(per||'這週')+' 練習 '+mn(p.sec):k==='acc'?'正確率 '+f1(p.acc)+' 分：每一題都看清楚才選。':
    (p.pf!=null&&p.pt!=null?'正確率從 '+p.pf+' 分進步到 '+p.pt+' 分（多了 '+(p.pt-p.pf)+' 分）。':'正確率進步 '+f1(p.prog)+' 分。')}
  /* 班級獎下面那一句：v ＝ 那一種的數字（練習時間 ＝ 平均每一個人幾秒） */
  function awc(k,v){return k==='sec'?'平均每一個人 練習 '+mn(v):k==='acc'?'平均正確率 '+f1(v)+' 分':'平均每一個人 正確率進步 '+f1(v)+' 分'}
  function awi(k){return k==='sec'?EFF:k==='prog'?UP:'🎯'}
  /* 進步：綠色粗箭頭（跟老師看板同一個） */
  var UP='<svg class="hup" viewBox="0 0 40 48" aria-label="進步"><path d="M20 2 L38 22 H27 V46 H13 V22 H2 Z" fill="#3BD16F" stroke="#0B3D1E" stroke-width="2" stroke-linejoin="round"/></svg>';
  var ST=[{nm:'金色獎盃從天而降',h:'🏆',fx:'cf'},{nm:'皇冠加冕',h:'👑',fx:'tw'},{nm:'頒獎台升起',h:'🥇',fx:'cf'},{nm:'煙火大會',h:'🎆',fx:'fw'},
    {nm:'紅毯＋聚光燈',h:'🌟',fx:'fl'},{nm:'金牌鑄造',h:'🏅',fx:'em'},{nm:'皇家獎狀',h:'📜',fx:'tw'},{nm:'火箭升空',h:'🚀',fx:'sr'},
    {nm:'寶箱打開',h:'💎',fx:'gm'},{nm:'流星雨',h:'🌠',fx:'mt'},{nm:'神龍守護',h:'🏆',fx:'em'},{nm:'名人堂',h:'🏛️',fx:'tw'}];
  function lsg(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
  function lss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  /* 下一種風格：12 種洗牌，一種一種用；輪完再洗，新的第一種不會跟上一次一樣 */
  function pick(key){key='hon_'+(key||'s');var o=lsg(key)||{q:[],last:-1};
    if(!o.q||!o.q.length){var a=[],i;for(i=0;i<ST.length;i++)a.push(i);
      for(i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}
      if(a[0]===o.last){a.push(a.shift())}o.q=a}
    var n=o.q.shift();o.last=n;lss(key,o);return n}
  function rnd(a,b){return a+Math.random()*(b-a)}
  var COL=['#FFD54A','#FF6B6B','#5BE39A','#7FD4FF','#D9A8FF','#FF9A3C','#FFFFFF'];
  /* 粒子：彩帶、星星、煙火、閃光燈、寶石、流星、火花 */
  function fx(el,k){var h='',i,n;
    if(k==='cf'){for(i=0;i<36;i++)h+='<i class="cf" style="left:'+rnd(0,100).toFixed(1)+'%;--c:'+COL[i%COL.length]+';--d:'+rnd(2.4,4.6).toFixed(2)+'s;--r:'+Math.round(rnd(200,720))+'deg;animation-delay:-'+rnd(0,4).toFixed(2)+'s"></i>'}
    else if(k==='tw'||k==='sr'){for(i=0;i<60;i++)h+='<i class="sr" style="left:'+rnd(0,100).toFixed(1)+'%;top:'+rnd(0,100).toFixed(1)+'%;animation-delay:-'+rnd(0,2).toFixed(2)+'s;'+(k==='tw'?'background:#FFE9A8;width:5px;height:5px':'')+'"></i>'}
    else if(k==='fw'){for(n=0;n<5;n++){var cx=rnd(10,90),cy=rnd(8,55),c=COL[n%COL.length],dl=rnd(0,1.6);
      for(i=0;i<16;i++){var a=i/16*Math.PI*2,r=rnd(70,140);h+='<i class="fw" style="left:'+cx.toFixed(1)+'%;top:'+cy.toFixed(1)+'%;--c:'+c+';--dx:'+Math.round(Math.cos(a)*r)+'px;--dy:'+Math.round(Math.sin(a)*r)+'px;animation-delay:'+dl.toFixed(2)+'s"></i>'}}}
    else if(k==='fl'){for(i=0;i<8;i++)h+='<i class="fl" style="left:'+rnd(5,95).toFixed(1)+'%;top:'+rnd(55,90).toFixed(1)+'%;animation-delay:'+rnd(0,2.2).toFixed(2)+'s"></i>'}
    else if(k==='gm'){var G=['💎','💠','🔷','💚','❤️','💛'];for(i=0;i<22;i++){var a2=rnd(-Math.PI*.95,-Math.PI*.05),r2=rnd(160,420);h+='<i class="gm" style="--dx:'+Math.round(Math.cos(a2)*r2)+'px;--dy:'+Math.round(Math.sin(a2)*r2)+'px;animation-delay:'+rnd(0,2.2).toFixed(2)+'s">'+G[i%G.length]+'</i>'}}
    else if(k==='mt'){for(i=0;i<14;i++)h+='<i class="mt" style="left:'+rnd(30,110).toFixed(1)+'%;top:'+rnd(-10,40).toFixed(1)+'%;animation-delay:'+rnd(0,1.6).toFixed(2)+'s"></i>'}
    else if(k==='em'){for(i=0;i<30;i++)h+='<i class="em" style="left:'+rnd(0,100).toFixed(1)+'%;animation-delay:-'+rnd(0,3).toFixed(2)+'s;animation-duration:'+rnd(2.4,4).toFixed(2)+'s"></i>'}
    el.innerHTML=h}
  /* 畫一幕：o ＝ {kick, tit, sub, hero(要不要大圖示), cards:[{ic,nm,l,w,me}], rows:[{rk,w,v}], pod:[第1,第2,第3]}，st ＝ 第幾種風格 */
  function scene(el,st,o){var S=ST[st]||ST[0],h='<div class="hbg"></div><div class="hfx"></div>';
    if(o.hero!==false)h+='<div class="hhero">'+(o.heroIc||S.h)+'</div>';
    if(o.kick)h+='<div class="hkick">'+o.kick+'</div>';
    if(o.tit)h+='<div class="htit">'+o.tit+'</div>';
    if(o.cards&&o.cards.length)h+='<div class="hcards'+(o.cards.length>3?' many':'')+'" style="--n:'+o.cards.length+'">'+o.cards.map(function(c,i){return '<div class="hcard'+(c.me?' me':'')+'" style="animation-delay:'+(.5+i*(o.gap||.55)).toFixed(2)+'s">'+
      (c.ic?'<div class="hi">'+c.ic+'</div>':'')+(c.nm?'<div class="hn">'+c.nm+'</div>':'')+(c.w?'<div class="hw">'+c.w+'</div>':'')+(c.l?'<div class="hl">'+c.l+'</div>':'')+'</div>'}).join('')+'</div>';
    if(o.rows&&o.rows.length)h+='<div class="hrow">'+o.rows.map(function(r,i){return '<div class="hr" style="animation-delay:'+(.3+i*(o.gap||.9)).toFixed(2)+'s"><b>'+r.rk+'</b><span>'+r.w+'</span><em>'+r.v+'</em></div>'}).join('')+'</div>';
    if(o.pod){var P=o.pod,ord=[1,0,2];h+='<div class="hpod">'+ord.map(function(n){var x=P[n];if(!x)return '<div></div>';var d=x.d||0;
      return '<div class="p'+(n+1)+'"><div class="md" style="animation-delay:'+(d+.6)+'s">'+['🥇','🥈','🥉'][n]+'</div><div class="nm" style="animation-delay:'+(d+.8)+'s">'+x.w+'</div><div class="vv" style="animation-delay:'+(d+1)+'s">'+x.v+'</div>'+
        '<div class="blk" style="animation-delay:'+d+'s">'+(n+1)+'</div></div>'}).join('')+'</div>'}
    if(o.sub)h+='<div class="hsub">'+o.sub+'</div>';
    el.className='hon hs'+(st+1)+(o.cls?' '+o.cls:'');el.innerHTML=h;fx(el.querySelector('.hfx'),S.fx)}
  /* 聲音（只有老師投影用；網頁自己做出來的聲音，不用音檔）：號角、鼓聲、掌聲 */
  var AC=null;function ac(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){AC=null}return AC}
  function tone(f,t0,d,type,vol){var c=ac();if(!c)return;var o=c.createOscillator(),g=c.createGain();o.type=type||'triangle';o.frequency.value=f;
    g.gain.setValueAtTime(0,c.currentTime+t0);g.gain.linearRampToValueAtTime(vol||.18,c.currentTime+t0+.03);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+t0+d);
    o.connect(g);g.connect(c.destination);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+d+.05)}
  function noise(t0,d,vol,fq){var c=ac();if(!c)return;var n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);for(var i=0;i<n;i++)x[i]=Math.random()*2-1;
    var s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=b;f.type='bandpass';f.frequency.value=fq||1200;f.Q.value=.8;
    g.gain.setValueAtTime(vol||.2,c.currentTime+t0);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+t0+d);s.connect(f);f.connect(g);g.connect(c.destination);s.start(c.currentTime+t0)}
  var snd={
    horn:function(){[[523,0,.25],[659,.22,.25],[784,.44,.25],[1047,.66,.9]].forEach(function(n){tone(n[0],n[1],n[2],'sawtooth',.07);tone(n[0],n[1],n[2],'triangle',.16)})},
    drum:function(d){d=d||1.4;for(var t=0;t<d;t+=.06)noise(t,.05,.12+.2*t/d,180);noise(d,.7,.35,4000)},
    clap:function(d){d=d||2.2;for(var i=0;i<70;i++)noise(Math.random()*d,.05,rnd(.05,.16),rnd(900,2400))},
    ding:function(){tone(1319,0,.5,'sine',.12);tone(1760,.08,.6,'sine',.08)}};
  return {EFF:EFF,UP:UP,CLK:CLK,AWK:AWK,AWN:AWN,mn:mn,awl:awl,awc:awc,awi:awi,ST:ST,pick:pick,scene:scene,fx:fx,snd:snd,ac:ac};
})();
