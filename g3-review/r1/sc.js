if(typeof $==='undefined')window.$=function(s){return document.querySelector(s)};if(typeof $$==='undefined')window.$$=function(s){return [].slice.call(document.querySelectorAll(s))};
if(typeof sayStop==='undefined')window.sayStop=function(){};var MISSLOG=window.MISSLOG||[];
/* score/_honor_rt.js — 榮譽動畫的執行程式（2026-10-12 D 第 4 件）。學生平板（score/_client.js）、老師看板（score/_teacher.js）共用。只寫 ES5。
   研究（score/2026-10-12_D_需求與問題.md 第三節）：事先不知道的驚喜不傷動機（Deci 1999）➜ 12 種風格輪流、跟上一次一定不一樣、12 種輪完才重複；
   稱讚努力和方法、不稱讚聰明（Mueller & Dweck 1998、Henderlong & Lepper 2002）➜ 每一句都寫「你做了什麼」。 */
var HON=(function(){
  /* 努力獎：獎牌上面有星星（使用者 2026-10-12 第 1 題 C；自己畫的，每一台都一樣） */
  var EFF='<svg class="heff" viewBox="0 0 120 150" aria-label="最認真練習"><path d="M30 0h22l18 52H48z" fill="#2F7BE8"/><path d="M90 0H68L50 52h22z" fill="#E8453C"/><circle cx="60" cy="95" r="46" fill="#B8860B"/><circle cx="60" cy="95" r="40" fill="#FFC928"/><circle cx="60" cy="95" r="40" fill="#FFF1A8" opacity=".35"/><circle cx="60" cy="95" r="33" fill="none" stroke="#FFF3B0" stroke-width="2" opacity=".7"/><path d="M60 68l8.2 16.6 18.3 2.7-13.2 12.9 3.1 18.2L60 109.8l-16.4 8.6 3.1-18.2-13.2-12.9 18.3-2.7z" fill="#FFFDF0" stroke="#FFB300" stroke-width="2.5" stroke-linejoin="round"/></svg>';
  /* 練習時間：自己畫的時鐘（白底金框、紅色指針；使用者 2026-10-12 D8 第 1 題 A，取代 ⏱） */
  var CLK='<svg class="hclk" viewBox="0 0 100 100" aria-label="時鐘"><circle cx="50" cy="50" r="44" fill="#FFF8E6" stroke="#FFB300" stroke-width="8"/><rect x="48" y="12" width="4" height="10" fill="#8A5A00"/><rect x="48" y="12" width="4" height="10" fill="#8A5A00" transform="rotate(90 50 50)"/><rect x="48" y="12" width="4" height="10" fill="#8A5A00" transform="rotate(180 50 50)"/><rect x="48" y="12" width="4" height="10" fill="#8A5A00" transform="rotate(270 50 50)"/><rect x="47" y="24" width="6" height="28" rx="3" fill="#333"/><rect class="hclkm" x="47" y="34" width="6" height="18" rx="3" fill="#D84315" transform="rotate(60 50 50)"/><circle cx="50" cy="50" r="6" fill="#333"/></svg>';
  /* 三種最高榮譽（使用者 2026-10-12 D6～D8 定案）：學生平板、老師投影、印獎狀、老師看板的字一模一樣，只寫在這裡 */
  /* 2026-10-15 D 第 8 件：第 4 種最高榮譽「最用心」（老師 D9 第 1 題 A＋B、D12 ④） */
  /* 2026-10-16 老師 C5「1 乙、3 A」：用心 和 練習 整個合併成「📅 練習」，❤ 最用心 拿掉，回到 3 種（care 只剩老師看板的「📅 練習分數」） */
  var AWK=['sec','acc','prog'],AWN={sec:'最認真練習',acc:'成績最優',prog:'進步最多'};
  /* 自己畫的圖示（老師 D10 第 2、3 題 A）：獎牌上面有愛心 ＝ 最用心；眼睛＋耳朵 ＝ 看完、聽完 才選；紅 ✗ ➜ 綠 ✓ ＝ 答錯的 改對了 */
  var HRT='<svg class="hhrt" viewBox="0 0 120 150" aria-label="練習"><path d="M30 0h22l18 52H48z" fill="#2F7BE8"/><path d="M90 0H68L50 52h22z" fill="#E8453C"/><circle cx="60" cy="95" r="46" fill="#B8860B"/><circle cx="60" cy="95" r="40" fill="#FFC928"/><circle cx="60" cy="95" r="33" fill="none" stroke="#FFF3B0" stroke-width="2" opacity=".7"/><path d="M60 122C30 102 34 74 48 72C55 71 59 76 60 80C61 76 65 71 72 72C86 74 90 102 60 122Z" fill="#E8453C" stroke="#FFFDF0" stroke-width="4" stroke-linejoin="round"/></svg>';
  var EYE='<svg class="heye" viewBox="0 0 200 100" aria-label="看完、聽完"><path d="M8 50Q50 6 92 50Q50 94 8 50Z" fill="#fff" stroke="#333" stroke-width="5"/><circle cx="50" cy="50" r="17" fill="#2F7BE8"/><circle cx="50" cy="50" r="8" fill="#111"/><circle cx="55" cy="44" r="4" fill="#fff"/><path d="M122 52C118 14 182 8 186 46C188 70 162 70 160 88C158 100 138 100 134 88" fill="#FFD3B0" stroke="#B86B3C" stroke-width="6" stroke-linecap="round"/><path d="M142 48C142 30 168 28 168 46C168 58 154 56 154 68" fill="none" stroke="#B86B3C" stroke-width="6" stroke-linecap="round"/></svg>';
  var FIX='<svg class="hfix" viewBox="0 0 200 100" aria-label="答錯的改對了"><circle cx="38" cy="50" r="32" fill="#E8453C"/><path d="M26 38l24 24M50 38L26 62" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M80 50h34" stroke="#FFD54A" stroke-width="9" stroke-linecap="round"/><path d="M108 36l16 14-16 14z" fill="#FFD54A"/><circle cx="162" cy="50" r="32" fill="#2EB85C"/><path d="M146 51l11 11 21-23" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function mn(sec){sec=Math.round(+sec||0);return sec<60?sec+' 秒':Math.round(sec/60)+' 分鐘'}
  function f1(v){return Math.round(v*10)/10}
  /* 個人獎下面那一句：per ＝ 這週／上週／這學期／這段期間；p ＝ {sec, acc, pf, pt} */
  function awl(k,p,per){return k==='care'?'練習分數 '+Math.round(+p.care||0)+' 分':k==='sec'?(per||'這週')+' 練習 '+mn(p.sec):k==='acc'?'正確率 '+f1(p.acc)+' 分：每一題都看清楚才選。':
    (p.pf!=null&&p.pt!=null?'正確率從 '+p.pf+' 分進步到 '+p.pt+' 分（多了 '+(p.pt-p.pf)+' 分）。':'正確率進步 '+f1(p.prog)+' 分。')}
  /* 班級獎下面那一句：v ＝ 那一種的數字（練習時間 ＝ 平均每一個人幾秒） */
  function awc(k,v){return k==='care'?'平均每一個人 練習分數 '+Math.round(+v||0)+' 分':k==='sec'?'平均每一個人 練習 '+mn(v):k==='acc'?'平均正確率 '+f1(v)+' 分':'平均每一個人 正確率進步 '+f1(v)+' 分'}
  function awi(k){return k==='sec'?EFF:k==='prog'?UP:k==='care'?HRT:'🎯'}
  /* 獎狀那一行（老師 D11 第 2 題 甲、第 3 題 A：四種都一樣精簡） */
  function aws(k,p,per){return k==='care'?'練習分數 '+Math.round(+p.care||0)+' 分':k==='sec'?(per||'這週')+' 練習 '+mn(p.sec):k==='acc'?'正確率 '+f1(p.acc)+' 分':
    (p.pf!=null&&p.pt!=null?'從 '+p.pf+' 分 進步到 '+p.pt+' 分':'正確率 進步 '+f1(p.prog)+' 分')}
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
  /* ══ 📅 這週 練習（原本叫「❤ 這週 用心程度」，2026-10-16 老師 C5「1 乙、4 A」：愛心造型留著、標題改「📅 練習」；2026-10-15 D 第 8 件；老師 D12 ③ 甲「五顆愛心 裝滿」＋「每一次都不一樣風格」＋〔📖 說明〕）══
     一顆愛心 ＝ 一項 ＝ 20 分，五顆裝滿 ＝ 100 分；數字從 0 加上去；裝滿的愛心會笑、會跳；最少的那一顆空的地方閃金光＋那一項的圖示搖＋「💡 請 …」。
     8 種風格（CST）輪流、跟上一次不一樣（pick 同一套洗牌）；〔📖 說明〕＝ 五項一條一條：做了什麼、幾分、✅ 很用心／💡 可以更好 */
  var CI=['<span class="cem">📅</span>','<span class="cem">📝</span>',EYE,FIX,CLK.replace('class="hclk"','class="hclk cclk"')];
  var CN=['這週 練了 幾天','做完 幾次（題目、遊戲、聽完字卡）','看完、聽完 才選','答錯的 改對了','這週 練習 幾分鐘'];
  var CF=['4 天','5 次','太快亂按 0 題','全部改對','30 分鐘'];
  var CT=['請 再多練 1 天','請 再做完 1 次','請 看完、聽完 再選','請 把答錯的 再做一次','請 再多練 幾分鐘'];
  var CC=['#2F7BE8','#9B59D0','#00A6A6','#2EB85C','#FF9F1C'];
  var CST=[{nm:'水倒進去',fx:''},{nm:'愛心氣球',fx:'cf'},{nm:'寶石愛心',fx:'tw'},{nm:'燈籠夜空',fx:'sr'},
    {nm:'顏料滴下來',fx:'cf'},{nm:'愛心火車',fx:''},{nm:'心跳線',fx:''},{nm:'星星雨',fx:'mt'}];
  var HP='M50 88C20 66 4 48 4 28C4 13 15 4 28 4C38 4 45 10 50 18C55 10 62 4 72 4C85 4 96 13 96 28C96 48 80 66 50 88Z',CUID=0;
  function cpick(key){key='hon_'+(key||'cs');var o=lsg(key)||{q:[],last:-1};
    if(!o.q||!o.q.length){var a=[],i;for(i=0;i<CST.length;i++)a.push(i);for(i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}
      if(a[0]===o.last)a.push(a.shift());o.q=a}
    var n=o.q.shift();o.last=n;lss(key,o);return n}
  function cweak(c){var w=-1,m=99;for(var i=0;i<5;i++)if(c.it[i]<20&&c.it[i]<m){m=c.it[i];w=i}return w}
  /* 五項各做了什麼（說明用） */
  function cdid(c){var r=c.raw||{};return [r.days+' 天',r.count+' 次',!r.q?'這週 還沒有作答':r.fq?'太快亂按 '+r.fq+' 題（'+r.fp+'%）':'太快亂按 0 題',
    !r.q?'這週 還沒有作答':!r.W?'沒有答錯':'答錯 '+r.W+' 題，改對 '+r.F+' 題',mn(r.sec)]}
  function heart(k,v,u){var y=(84*(1-v/20)).toFixed(1);
    return '<div class="chc" data-k="'+k+'"><div class="cv">'+v+'</div><div class="chw"><i class="cdrop" style="background:'+CC[k]+'"></i>'+
      '<svg class="ch" viewBox="0 0 100 92"><defs><clipPath id="cc'+u+'_'+k+'"><path d="'+HP+'"/></clipPath></defs><path d="'+HP+'" class="cbk"/>'+
      '<g clip-path="url(#cc'+u+'_'+k+')"><g class="clq" data-y="'+y+'" style="transform:translateY(92px)"><g class="cwv"><path d="M-40 6Q-30 0 -20 6T0 6T20 6T40 6T60 6T80 6T100 6T120 6T140 6V100H-40Z" fill="'+CC[k]+'"/></g></g>'+
      '<rect class="cshn" x="-60" y="-10" width="30" height="120" fill="#fff" opacity=".35" transform="rotate(20)"/></g>'+
      '<path class="cgap" d="'+HP+'"/><g class="cfc" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"><path d="M32 38q5-6 10 0M58 38q5-6 10 0"/><path d="M40 52q10 9 20 0"/></g>'+
      '<path d="'+HP+'" class="cln"/></svg></div><div class="cic">'+CI[k]+'</div></div>'}
  /* 畫＋演：el ＝ 放的地方、st ＝ 第幾種風格、c ＝ _calc.js care() 的結果、o ＝ {help:1 有〔📖 說明〕, onHelp(打開說明時), t:標題} */
  function cscene(el,st,c,o){o=o||{};var S=CST[st]||CST[0],u=++CUID,w=cweak(c),RD=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,G=RD?0:800;
    el.className='care cs'+(st+1);
    el.innerHTML='<div class="cbg"></div><div class="hfx cfx"></div><svg class="cecg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0 60H180L210 20L240 95L270 60H380L410 20L440 95L470 60H580L610 20L640 95L670 60H780L810 20L840 95L870 60H1000"/></svg>'+
      '<div class="ct1">'+(o.t||'這週 📅 練習')+'</div><div class="csum"><b class="cn">0</b><span> ／100</span></div>'+
      '<div class="crow">'+c.it.map(function(v,k){return heart(k,v,u)}).join('')+'</div><div class="cnote">❤ 1 顆 裝滿 ＝ 20 分</div>'+
      '<div class="ctip">'+(w<0?'🎉 五顆 都裝滿了！':'💡 '+CT[w])+'</div>'+
      (o.help?'<button class="chb" type="button">📖 說明</button><div class="chp" hidden></div>':'');
    fx(el.querySelector('.cfx'),S.fx);
    var hc=el.querySelectorAll('.chc'),n=el.querySelector('.cn'),s=0,T=[];
    function up(a,b){var t0=Date.now();(function f(){var p=Math.min(1,(Date.now()-t0)/500);n.textContent=Math.round(a+(b-a)*p);if(p<1&&el.contains(n))requestAnimationFrame(f)})()}
    c.it.forEach(function(v,k){T.push(setTimeout(function(){var h=hc[k],l=h.querySelector('.clq');h.classList.add('on');
      T.push(setTimeout(function(){l.style.transform='translateY('+l.getAttribute('data-y')+'px)';up(s,s+v);s+=v;
        if(v>=20)T.push(setTimeout(function(){h.classList.add('full')},RD?0:800))},RD?0:(st===4||st===7?450:150)))},200+k*G))});
    T.push(setTimeout(function(){n.parentNode.classList.add('pop');if(w>=0)hc[w].classList.add('wk');el.querySelector('.ctip').classList.add('on')},200+5*G+(RD?0:900)));
    el._ct=T;
    if(o.help){var b=el.querySelector('.chb'),P=el.querySelector('.chp');b.onclick=function(){var on=P.hidden;P.hidden=!on;b.textContent=on?'✕ 收起說明':'📖 說明';b.classList.toggle('on',on);
      if(on){P.innerHTML=chelp(c);if(o.onHelp)o.onHelp();setTimeout(function(){[].forEach.call(P.querySelectorAll('.chr'),function(r){r.classList.add('on')})},30)}}}
  }
  /* ══ 成績卡（2026-10-16 老師 C3 第 3 題 甲＋C4 第 3 題 甲、3-2 A＋C5「1 乙」）：🎯 正確、📅 練習 兩大格＋💡 下一步；
     老師看板（下面接〔📋 細節 ▾〕）和學生平板（沒有細節、沒有姓名）同一張。p ＝ {acc, prog, keep}、c ＝ care() ══ */
  var CTS=['多練 1 天','再做完 1 次','聽完再選','答錯的再做一次','多練幾分鐘'];
  function card(p,c,o){p=p||{};o=o||{};var w=c?cweak(c):-1,r=(c&&c.raw)||{};
    var pg=p.prog!=null&&p.prog>0?'<span class="gup">⬆ '+f1(p.prog)+'</span>':p.keep&&p.acc===100?'<span class="gup">🔥 滿分</span>':'';
    return '<div class="gcard"><div class="gbx gac"><div class="gk">🎯 正確</div><div class="gv">'+(p.acc==null?'—':f1(p.acc))+pg+'</div></div>'+
      '<div class="gbx gpr"><div class="gk">📅 練習</div><div class="gv">'+(c?c.tot:0)+'<span class="gsm">'+(r.days||0)+'天 '+(r.count||0)+'次</span></div></div>'+
      (c&&!o.notip?'<div class="gnx">'+(w<0?'🎉 五項都滿分':'💡 '+CTS[w])+'</div>':'')+'</div>'}
  function cstop(el){if(el&&el._ct)el._ct.forEach(clearTimeout)}
  /* 〔📖 說明〕：五項一條一條（圖示、名字、做了什麼、長條 N／20、✅ 很用心 或 💡 怎麼更好） */
  function chelp(c){var d=cdid(c);
    return '<div class="chh">5 項 ✕ 20 分 ＝ 100 分</div>'+c.it.map(function(v,k){var ok=v>=20;
      return '<div class="chr'+(ok?' ok':'')+'" style="transition-delay:'+(k*.25).toFixed(2)+'s"><span class="chi">'+CI[k]+'</span><span class="chn"><b>'+CN[k]+'</b><small>你：'+d[k]+'　滿分：'+CF[k]+'</small></span>'+
        '<span class="chbar"><i style="width:'+(v*5)+'%;background:'+CC[k]+';transition-delay:'+(.3+k*.25).toFixed(2)+'s"></i><em>'+v+'／20</em></span>'+
        '<span class="chk">'+(ok?'✅ 做到了':'💡 '+CT[k])+'</span></div>'}).join('')}
  return {EFF:EFF,UP:UP,CLK:CLK,HRT:HRT,EYE:EYE,FIX:FIX,AWK:AWK,AWN:AWN,mn:mn,awl:awl,awc:awc,awi:awi,aws:aws,ST:ST,pick:pick,scene:scene,fx:fx,snd:snd,ac:ac,
    CST:CST,CN:CN,CT:CT,CTS:CTS,card:card,cpick:cpick,cscene:cscene,cstop:cstop,chelp:chelp,cweak:cweak,cdid:cdid};
})();
/* rpg/_wear_rt.js — 🏪 榮耀寶物商城：穿在英雄身上（2026-10-18 第九次；規則 score/_calc.js 的 RPS；樣子 rpg/_wear.css）
   〔🦸 我的英雄〕舞台、平板最後一幕 🦸、⚡ 現場任務 都用這一份（score/_client.js 帶進每一頁）。s ＝ 身上戴的 {au 光環, cp 披風, fx 必殺, nf 名字框, bg 背景, po 寵物服裝, wg 翅膀, mt 坐騎}
   rwSrc(圖)、rwBack(英雄卡後面：翅膀、披風、光環)、rwFront(腳下：坐騎)、rwPo(寵物服裝)、rwNf(名字框)、rwBg(背景的 style)、rwFx(必殺武功特效：蓋滿畫面 1.4 秒) */
function rwSrc(b,id,ic){return b+'rpg/'+(/^s\d{4}$/.test(id)?'shop/'+id+(ic?'i.webp':'.jpg'):(/^[bg]/.test(id)?'chars':/^w/.test(id)?'weapons':'pets')+'/'+id+'.jpg')}
function rwI(b,id,c){return id?'<img class="'+c+'" src="'+rwSrc(b,id,1)+'" alt="" aria-hidden="true">':''}
function rwBack(b,s){s=s||{};return rwI(b,s.wg,'rw-wg')+rwI(b,s.cp,'rw-cp')+rwI(b,s.au,'rw-au')}
function rwFront(b,s){s=s||{};return rwI(b,s.au,'rw-au2')+rwI(b,s.mt,'rw-mt')}   /* 光環：後面一圈大的＋前面一層半透明發光（只放後面會被英雄卡擋住） */
function rwPo(b,s){return rwI(b,(s||{}).po,'rw-po')}
function rwNf(b,s){return rwI(b,(s||{}).nf,'rw-nf')}
function rwBg(b,s){return s&&s.bg?"background-image:linear-gradient(rgba(5,7,13,.25),rgba(5,7,13,.6)),url('"+rwSrc(b,s.bg,1)+"');background-size:cover;background-position:center":''}
function rwFx(b,id){if(!id||!document.body)return;var o=document.createElement('div');o.className='rw-fx';o.setAttribute('aria-hidden','true');
  o.innerHTML='<img src="'+rwSrc(b,id,1)+'" alt="">';document.body.appendChild(o);setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o)},1500)}
/* rpg/_fx_rt.js — ⚔ 戰神之路 特效引擎（2026-10-20 第十四次；規格 rpg/CLAUDE.md 最上面「第十四次」）。只寫 ES5。
   老師：戰士登場要震撼；武器要有跟圖相關的特效、真的能打怪（愈強愈猛）；寵物長大進化要逼真、真的幫忙打怪；每一個人、每一次出招都不一樣；賺到金幣要有秒懂的動畫。
   score/_client.js 帶進每一頁（跟 _wear_rt.js 一樣），〔戰神之路〕、做完一次的最後一幕、⚡ 現場任務 都用這一份。
   RPFX.attack(容器, 選項)  出招：蓄力 ➜ 放招（照武器的「元素」和「招式」）➜ 命中（爆炸、震動、傷害數字）➜ 寵物跟著打；★5 ＝ 核彈級
   RPFX.summon(選項)        戰士／武器／寵物 登場（魔法陣、光柱、閃電、卡片轉出來、星星一顆一顆亮）
   RPFX.evolve(選項)        寵物 長大／進化（白色剪影一大一小閃，愈閃愈快 ➜ 白光 ➜ 變大、光芒）
   RPFX.chest(選項)         👑 冠軍寶箱 打開
   RPFX.coins(從, 到, 個數)  金幣飛進去、數字一個一個加
   RPFX.fight(容器, 選項)    做完練習打怪：答對幾題 ＝ 打幾下，怪物的血條一直掉，打倒 ＝ 淨化 */
var RPFX = (function () {
  var RM = false; try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
  /* ── 元素：c ＝ [核心, 光, 深色]；sh ＝ 碎片的形狀 ── */
  var EL = {
    fire: { nm: '烈焰', c: ['#FFF4B8', '#FF8A1A', '#FF2A00'], sh: 'flame', w: ['爆炎', '火龍', '流星火雨', '熔岩'] },
    ice: { nm: '冰霜', c: ['#FFFFFF', '#8FE6FF', '#2A6BFF'], sh: 'shard', w: ['冰晶', '絕對零度', '暴風雪', '冰龍'] },
    thunder: { nm: '雷霆', c: ['#FFFFFF', '#FFE34A', '#3FA9FF'], sh: 'bolt', w: ['萬雷', '雷神之怒', '閃電風暴', '天雷'] },
    plasma: { nm: '電漿', c: ['#FFFFFF', '#FF4FD8', '#3FF2FF'], sh: 'dot', w: ['霓虹', '電漿風暴', '光速', '量子'] },
    void: { nm: '虛空', c: ['#F3DBFF', '#B04BFF', '#3A0070'], sh: 'ring', w: ['黑洞', '暗影', '虛空裂縫', '深淵'] },
    time: { nm: '時空', c: ['#FFF7D6', '#FFC94A', '#B07800'], sh: 'gear', w: ['時間暫停', '時空迴旋', '齒輪風暴', '永恆'] },
    star: { nm: '星光', c: ['#FFFFFF', '#FFE680', '#B57BFF'], sh: 'star', w: ['流星雨', '星辰', '天狼', '北極星'] },
    cosmic: { nm: '銀河', c: ['#FFFFFF', '#A07BFF', '#FF5FD2'], sh: 'star', w: ['銀河', '星雲', '超新星', '宇宙'] },
    gravity: { nm: '重力', c: ['#EEDDFF', '#8A4BFF', '#1E0050'], sh: 'ring', w: ['重力崩壞', '引力漩渦', '萬有引力', '奇點'] },
    wind: { nm: '疾風', c: ['#F2FFF6', '#5CFFB0', '#14A070'], sh: 'leaf', w: ['颶風', '風刃', '龍捲', '疾風'] },
    toxic: { nm: '劇毒', c: ['#F6FFD6', '#A6FF3B', '#2E7A00'], sh: 'bubble', w: ['毒霧', '腐蝕', '劇毒爪', '酸雨'] },
    tech: { nm: '機甲', c: ['#FFFFFF', '#42F2FF', '#0A6CFF'], sh: 'hex', w: ['雷射', '飛彈齊射', '軌道砲', '機甲'] },
    shield: { nm: '守護', c: ['#FFFFFF', '#FFD54A', '#3FA9FF'], sh: 'hex', w: ['聖盾', '反擊', '壁壘', '守護'] },
    light: { nm: '聖光', c: ['#FFFFFF', '#FFF0A0', '#FFB52E'], sh: 'star', w: ['聖光', '天使', '審判', '黎明'] }
  };
  /* ── 武器 ➜ [元素, 招式, 星等]（照圖上的名字：例 Thunder Hammer ＝ 雷霆＋重擊；星等 ＝ score/_calc.js 的 RPR.w，商城 ＝ 第幾排 ＋1）── */
  var W = { w01: ['plasma', 'slash', 2], w02: ['fire', 'beam', 5], w03: ['star', 'arrow', 1], w04: ['thunder', 'smash', 4], w05: ['void', 'slash', 1], w06: ['time', 'slash', 3],
    w07: ['void', 'pierce', 2], w08: ['fire', 'slash', 4], w09: ['ice', 'pierce', 2], w10: ['shield', 'nova', 3], w11: ['gravity', 'smash', 3], w12: ['wind', 'arrow', 1],
    w13: ['light', 'orb', 1], w14: ['toxic', 'claw', 2], w15: ['cosmic', 'claw', 2], w16: ['tech', 'orb', 3], w17: ['cosmic', 'orb', 5], w18: ['time', 'nova', 4],
    w19: ['shield', 'nova', 3], w20: ['tech', 'smash', 2], w21: ['tech', 'orb', 1], w22: ['cosmic', 'orb', 3], w23: ['time', 'nova', 4], w24: ['shield', 'nova', 2],
    w25: ['thunder', 'smash', 3], w26: ['fire', 'slash', 2], w27: ['star', 'arrow', 1], w28: ['plasma', 'beam', 1], w29: ['cosmic', 'nova', 5], w30: ['gravity', 'orb', 1],
    s0701: ['cosmic', 'slash'], s0702: ['fire', 'beam'], s0703: ['time', 'orb'], s0704: ['star', 'arrow'], s0705: ['light', 'slash'], s0706: ['fire', 'pierce'], s0707: ['ice', 'nova'],
    s0708: ['thunder', 'smash'], s0709: ['fire', 'claw'], s0710: ['tech', 'beam'], s0711: ['cosmic', 'orb'], s0712: ['light', 'pierce'], s0713: ['void', 'slash'], s0714: ['shield', 'nova'],
    s0715: ['light', 'pierce'], s0716: ['cosmic', 'claw'], s0717: ['toxic', 'claw'], s0718: ['wind', 'arrow'], s0719: ['gravity', 'smash'], s0720: ['fire', 'arrow'] };
  /* 寵物 ➜ 元素（跟 📖 圖鑑的套裝一樣：火焰、星河、雷電、冰雪、夜、機械） */
  var PE = { p05: 'fire', p21: 'fire', p24: 'fire', p01: 'star', p18: 'cosmic', p03: 'thunder', p20: 'thunder', p13: 'ice', p26: 'ice', p29: 'ice', p08: 'void', p09: 'void', p22: 'void', p25: 'void',
    p16: 'tech', p19: 'tech', p30: 'tech', p17: 'fire', p23: 'gravity', p27: 'wind', p28: 'light', s0801: 'cosmic', s0802: 'ice', s0803: 'light', s0804: 'cosmic', s0805: 'light', s0806: 'fire', s0807: 'tech',
    s0808: 'light', s0809: 'wind', s0810: 'fire', s0811: 'tech', s0812: 'thunder', s0813: 'fire', s0814: 'cosmic', s0815: 'ice', s0816: 'tech', s0817: 'fire', s0818: 'void', s0819: 'thunder', s0820: 'time' };
  var FORM = { slash: '連斬', beam: '光砲', arrow: '箭雨', smash: '重擊', orb: '法球', nova: '爆發', claw: '利爪', pierce: '突刺' };
  /* 🗡 每一把 武器 自己的 招牌 3D 特效（2026-10-21 第十七次 老師第 10-(2) 點：每一種 武器 獨一無二）：12 種 招牌 ✕ 14 種 元素，
     照 招式 挑 最像 的 招牌（斬 ➜ 新月／十字／綻放；砲 ➜ 天柱／彗星／螺旋…），同一個 元素 不重複 ➜ 50 把 武器 的「元素＋招牌」兩兩 不一樣（rpg/_verify.js 量） */
  var SIGN = ['雙龍螺旋', '新月三連斬', '天降流星', '大地裂刺', '五星環繞', '十字審判', '星門', '連鎖雷', '天柱', '萬花綻放', '震地波', '彗星'];
  var SIGP = { slash: [1, 5, 9], beam: [8, 11, 0], arrow: [2, 11, 7], smash: [3, 10, 8], orb: [4, 6, 0], nova: [10, 9, 6], claw: [5, 1, 3], pierce: [11, 7, 0] }, WSIG = {};
  (function () { var used = {}; Object.keys(W).forEach(function (id) { var e = W[id][0], L = SIGP[W[id][1]].concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    for (var i = 0; i < L.length; i++) if (!used[e + L[i]]) { used[e + L[i]] = 1; WSIG[id] = L[i]; return; } WSIG[id] = L[0]; }); })();
  function wSig(id) { var k = WSIG[id] != null ? WSIG[id] : 8; return { k: k, nm: SIGN[k] }; }
  function wInfo(id) { var x = W[id], m = /^s07(\d\d)$/.exec(id || ''); return x ? { e: x[0], f: x[1], s: x[2] || (m ? Math.floor((+m[1] - 1) / 5) + 2 : 1) } : { e: 'light', f: 'slash', s: 1 }; }
  function pEl(id) { return PE[id] || ['star', 'wind', 'light', 'plasma', 'ice'][(parseInt(String(id).replace(/\D/g, ''), 10) || 0) % 5]; }
  /* 每一個人不一樣：5 碼 ➜ 固定的「招牌」；每一次不一樣：再加上次數 */
  function hash(s) { s = String(s || ''); var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul ? Math.imul(h, 16777619) : (h * 16777619) | 0; } return h >>> 0; }
  function rnd(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) | 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  if (!Math.imul) Math.imul = function (a, b) { return ((a & 0xffff) * b + ((((a >>> 16) * b) & 0xffff) << 16)) | 0; };
  var SIG = ['無雙', '王者', '破曉', '天命', '極光', '星辰', '霸王', '疾影', '神域', '聖焰', '蒼穹', '幻影'];
  var NCNT = 0; try { NCNT = +(sessionStorage.getItem('rpfx_n') || 0); } catch (e) { }
  function nextSeed(id) { NCNT++; try { sessionStorage.setItem('rpfx_n', String(NCNT)); } catch (e) { } return hash(id) ^ (NCNT * 2654435761) ^ (Date.now() & 0xffff); }

  /* ── 畫布：粒子、圓環、閃電、刀光、光束 ── */
  var SPR = {};
  function glow(col) { if (SPR[col]) return SPR[col]; var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, '#fff'); r.addColorStop(.22, col); r.addColorStop(.6, hexA(col, .35)); r.addColorStop(1, hexA(col, 0)); g.fillStyle = r; g.fillRect(0, 0, 64, 64); SPR[col] = c; return c; }
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function Stage(host, full) {
    var cv = document.createElement('canvas'); cv.className = 'fxcv' + (full ? ' full' : ''); cv.setAttribute('aria-hidden', 'true'); host.appendChild(cv);
    var R = host.getBoundingClientRect(), Wd = Math.max(10, full ? window.innerWidth : R.width), Ht = Math.max(10, full ? window.innerHeight : R.height), d = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(Wd * d); cv.height = Math.round(Ht * d); var g = cv.getContext('2d'); g.scale(d, d);
    var P = [], E = [], t0 = 0, last = 0, done = false, end = 0, S = { w: Wd, h: Ht, g: g, add: function (p) { if (P.length < 900) P.push(p); return p; }, at: function (ms, f) { E.push({ t: ms, f: f }); }, flash: 0, fc: '#fff',
      stop: function (ms) { end = ms; }, cv: cv };
    function step(now) { if (done) return; if (!t0) { t0 = now; last = now; } var t = now - t0, dt = Math.min(50, now - last) / 1000; last = now;
      E = E.filter(function (e) { if (t >= e.t) { try { e.f(t); } catch (x) { } return false; } return true; });
      g.setTransform(d, 0, 0, d, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, Wd, Ht);
      if (S.flash > 0) { g.fillStyle = hexA(S.fc, Math.min(1, S.flash)); g.fillRect(0, 0, Wd, Ht); S.flash -= dt * 2.4; }
      g.globalCompositeOperation = 'lighter';
      for (var i = P.length - 1; i >= 0; i--) { var p = P[i]; p.a += dt; if (p.a >= p.l) { P.splice(i, 1); continue; } draw(g, p, dt, S); }
      if ((end && t >= end && !P.length) || t > 12000) { done = true; if (cv.parentNode) cv.parentNode.removeChild(cv); return; }
      requestAnimationFrame(step); }
    requestAnimationFrame(step); return S;
  }
  function draw(g, p, dt, S) {
    var k = p.a / p.l, al = p.fo === 0 ? 1 : (1 - k);
    if (p.home) { var dx = p.home.x - p.x, dy = p.home.y - p.y, dd = Math.sqrt(dx * dx + dy * dy) || 1; p.vx += dx / dd * p.hs * dt; p.vy += dy / dd * p.hs * dt; if (dd < 18 && !p.hit) { p.hit = 1; p.a = p.l; if (p.onHit) p.onHit(); } }
    var ox = p.x, oy = p.y; p.vx *= (1 - (p.dr || 0) * dt); p.vy *= (1 - (p.dr || 0) * dt); p.vy += (p.gv || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.spin) p.rot = (p.rot || 0) + p.spin * dt;
    g.globalAlpha = Math.max(0, al);
    if (p.t === 'dot') { var s = p.s * (p.gr ? 1 + k * p.gr : 1); g.drawImage(glow(p.c), p.x - s, p.y - s, s * 2, s * 2); }
    else if (p.t === 'streak') { g.strokeStyle = p.c; g.lineWidth = p.s; g.lineCap = 'round'; g.beginPath(); g.moveTo(p.x - p.vx * (p.tl || .05), p.y - p.vy * (p.tl || .05)); g.lineTo(p.x, p.y); g.stroke();
      g.drawImage(glow(p.c), p.x - p.s * 3, p.y - p.s * 3, p.s * 6, p.s * 6); }
    else if (p.t === 'ring') { var r = p.r0 + (p.r1 - p.r0) * (1 - Math.pow(1 - k, 2)); g.strokeStyle = p.c; g.lineWidth = Math.max(.5, p.s * (1 - k)); g.beginPath(); g.arc(p.x, p.y, Math.max(0, r), 0, Math.PI * 2); g.stroke(); }
    else if (p.t === 'arc') { var sw = Math.min(1, k * 2.2); g.strokeStyle = p.c; g.lineCap = 'round'; for (var j = 0; j < 3; j++) { g.lineWidth = p.s * (1 - j * .35) * (1 - k * .6); g.globalAlpha = al * (j === 0 ? .55 : 1);
        g.strokeStyle = j === 2 ? '#fff' : p.c; g.beginPath(); g.arc(p.x, p.y, p.r, p.a0, p.a0 + (p.a1 - p.a0) * sw, p.a1 < p.a0); g.stroke(); } }
    else if (p.t === 'beam') { var w = p.s * (1 - k * .5) * (0.85 + Math.random() * .3); g.lineCap = 'round';
      [[w * 2.2, p.c2, .35], [w, p.c, 1], [w * .38, '#fff', 1]].forEach(function (L) { g.globalAlpha = al * L[2]; g.strokeStyle = L[1]; g.lineWidth = L[0]; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x2, p.y2); g.stroke(); }); }
    else if (p.t === 'bolt') { g.strokeStyle = p.c; g.lineWidth = p.s; g.lineJoin = 'round'; g.beginPath(); g.moveTo(p.x, p.y); var n = 9; for (var b = 1; b <= n; b++) { var q = b / n, jx = b < n ? (Math.random() - .5) * p.j : 0;
        g.lineTo(p.x + (p.x2 - p.x) * q + jx, p.y + (p.y2 - p.y) * q + (b < n ? (Math.random() - .5) * p.j * .4 : 0)); } g.stroke(); g.lineWidth = p.s * .35; g.strokeStyle = '#fff'; g.stroke(); }
    else { /* 形狀碎片 */ g.save(); g.translate(p.x, p.y); g.rotate(p.rot || 0); var z = p.s * (1 - k * .4); g.fillStyle = p.c; g.strokeStyle = p.c; g.lineWidth = 2; shape(g, p.t, z); g.restore();
      g.globalAlpha = al * .6; g.drawImage(glow(p.c), p.x - z * 1.6, p.y - z * 1.6, z * 3.2, z * 3.2); }
    g.globalAlpha = 1;
  }
  function shape(g, t, z) { var i;
    if (t === 'star') { g.beginPath(); for (i = 0; i < 10; i++) { var r = i % 2 ? z * .42 : z, a = i / 10 * Math.PI * 2 - Math.PI / 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); }
    else if (t === 'hex') { g.beginPath(); for (i = 0; i < 6; i++) { var b = i / 6 * Math.PI * 2; g.lineTo(Math.cos(b) * z, Math.sin(b) * z); } g.closePath(); g.stroke(); }
    else if (t === 'gear') { g.beginPath(); for (i = 0; i < 16; i++) { var c = i / 16 * Math.PI * 2, rr = i % 2 ? z * .72 : z; g.lineTo(Math.cos(c) * rr, Math.sin(c) * rr); } g.closePath(); g.stroke(); g.beginPath(); g.arc(0, 0, z * .3, 0, 7); g.stroke(); }
    else if (t === 'shard') { g.beginPath(); g.moveTo(0, -z); g.lineTo(z * .35, 0); g.lineTo(0, z * .6); g.lineTo(-z * .35, 0); g.closePath(); g.fill(); }
    else if (t === 'flame') { g.beginPath(); g.moveTo(0, -z); g.quadraticCurveTo(z * .7, -z * .1, 0, z * .7); g.quadraticCurveTo(-z * .7, -z * .1, 0, -z); g.fill(); }
    else if (t === 'leaf') { g.beginPath(); g.ellipse ? g.ellipse(0, 0, z, z * .32, 0, 0, Math.PI * 2) : g.arc(0, 0, z * .5, 0, 7); g.fill(); }
    else if (t === 'bubble' || t === 'ring2') { g.beginPath(); g.arc(0, 0, z * .7, 0, Math.PI * 2); g.stroke(); }
    else { g.beginPath(); g.arc(0, 0, z * .5, 0, Math.PI * 2); g.fill(); } }
  /* 碎片的形狀：元素 sh ➜ 畫布的 t */
  function sht(e) { var s = EL[e].sh; return s === 'dot' || s === 'bolt' || s === 'ring' ? 'dot' : s; }
  function burst(S, x, y, e, n, sp, big) { var C = EL[e].c, t = sht(e);
    for (var i = 0; i < n; i++) { var a = Math.random() * Math.PI * 2, v = sp * (.3 + Math.random()), sh = i % 3 === 0 && t !== 'dot';
      S.add({ t: sh ? t : 'dot', x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, dr: 2.2, gv: e === 'fire' ? -120 : (e === 'ice' || e === 'toxic' ? 160 : 40), l: .5 + Math.random() * .7 * (big || 1), a: 0,
        s: sh ? 6 + Math.random() * 7 : 5 + Math.random() * 9 * (big || 1), c: C[i % 3 === 0 ? 0 : (i % 3 === 1 ? 1 : 2)], rot: Math.random() * 6, spin: (Math.random() - .5) * 12 }); }
    S.add({ t: 'ring', x: x, y: y, r0: 6, r1: 60 + sp * .12 * (big || 1), s: 7, c: C[1], l: .55, a: 0 }); }
  function bolt(S, x, y, x2, y2, c, s, l) { S.add({ t: 'bolt', x: x, y: y, x2: x2, y2: y2, c: c, s: s || 4, j: 40, l: l || .22, a: 0 }); }
  /* 容器要震 */
  function shake(el, lv) { if (!el || RM) return; el.classList.remove('fxshk', 'fxshk2', 'fxshk3'); void el.offsetWidth; el.classList.add(lv >= 5 ? 'fxshk3' : lv >= 3 ? 'fxshk2' : 'fxshk');
    setTimeout(function () { el.classList.remove('fxshk', 'fxshk2', 'fxshk3'); }, 700); }
  function dom(host, cls, html, ms, css) { var o = document.createElement('div'); o.className = cls; o.setAttribute('aria-hidden', 'true'); if (css) o.setAttribute('style', css); o.innerHTML = html; host.appendChild(o);
    if (ms) setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, ms); return o; }
  function pos(host, el, fx, fy) { var a = host.getBoundingClientRect(), b = el.getBoundingClientRect(); return { x: b.left - a.left + b.width * (fx == null ? .5 : fx), y: b.top - a.top + b.height * (fy == null ? .5 : fy) }; }

  /* ════ ⚔ 出招 ════
     o ＝ {from:{x,y}, to:{x,y}, w:武器, star:武器星等(沒寫 ＝ 照表), id:5 碼, p:寵物, pFrom:{x,y}, pImg:寵物圖, dmg:一擊, pd:寵物, hero:英雄的元素 DOM, quick:快一點, name:要不要寫招式名字, noNum:不寫數字}
     回傳 {ms:總共幾毫秒, hit:命中的時間} */
  function attack(host, o) {
    o = o || {}; if (!host) return { ms: 0 }; if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var I = wInfo(o.w), e = I.e, f = I.f, tier = Math.max(1, Math.min(5, o.star || I.s)), C = EL[e].c, R = rnd(o.seed || nextSeed(o.id)), sig = rnd(hash(o.id || 'x'));
    var S = Stage(host), F = o.from || { x: S.w * .3, y: S.h * .55 }, T = o.to || { x: S.w * .78, y: S.h * .45 }, q = o.quick ? .6 : 1;
    if (RM) { burst(S, T.x, T.y, e, 18, 260, 1); S.stop(400); if (o.dmg != null && !o.noNum) num(host, T, o.dmg, false, 0); return { ms: 900, hit: 0 }; }
    /* 招式：武器本來的 ＋ 這一次隨機換（每一次不一樣）；個人招牌決定第二招 */
    var forms = ['slash', 'beam', 'arrow', 'smash', 'orb', 'nova', 'claw', 'pierce'], f2 = forms[Math.floor(sig() * forms.length)], use = R() < .62 ? f : (R() < .5 ? f2 : forms[Math.floor(R() * forms.length)]);
    var crit = o.crit != null ? o.crit : R() < .18 + tier * .03;
    var ch0 = Math.round(380 * q), hit0 = ch0 + Math.round(420 * q);
    /* 2026-10-20 第十五次：音效、戰士揮武器（rpg/_life_rt.js）跟著這一招的時間 */
    if (o.hook) try { o.hook({ e: e, f: use, tier: tier, crit: crit, ch: ch0, hit: hit0, q: q }); } catch (x) { }
    /* 蓄力 */
    var ch = Math.round(380 * q);
    for (var i = 0; i < 14 + tier * 6; i++) { (function (i) { var a = R() * Math.PI * 2, r = 70 + R() * 70; S.add({ t: 'dot', x: F.x + Math.cos(a) * r, y: F.y + Math.sin(a) * r, vx: 0, vy: 0, home: F, hs: 1400 + R() * 900, l: .6, a: 0, s: 4 + R() * 5, c: C[i % 3], dr: 3 }); })(i); }
    S.add({ t: 'ring', x: F.x, y: F.y, r0: 70, r1: 6, s: 4, c: C[1], l: ch / 1000, a: 0 });
    if (o.hero && !RM) { o.hero.classList.remove('fxlunge'); void o.hero.offsetWidth; o.hero.classList.add('fxlunge'); setTimeout(function () { o.hero.classList.remove('fxlunge'); }, 900); }
    if (o.name !== false) { var nm = SIG[Math.floor(sig() * SIG.length)] + '．' + EL[e].w[Math.floor(R() * EL[e].w.length)] + ' ' + FORM[use];
      dom(host, 'fxname t' + tier, '<b style="--c1:' + C[1] + ';--c2:' + C[2] + '">' + nm + '</b><small>' + EL[e].nm + '．' + ['', '★', '★★', '★★★', '★★★★', '★★★★★'][tier] + '</small>', 1700 * q); }
    var hitT = ch + Math.round(420 * q), n = 2 + tier;
    S.at(ch, function () {
      if (use === 'slash' || use === 'claw') { for (var k = 0; k < (use === 'claw' ? 3 : Math.min(6, n)); k++) (function (k) { S.at(ch + k * 80 * q, function () {
          var rot = use === 'claw' ? -.9 + k * .12 : (R() - .5) * 2.4, rr = 46 + R() * 50 + tier * 6;
          S.add({ t: 'arc', x: T.x + (use === 'claw' ? (k - 1) * 18 : (R() - .5) * 30), y: T.y + (R() - .5) * 20, r: rr, a0: rot - 1.1, a1: rot + 1.1, s: 10 + tier * 2, c: C[1], l: .42, a: 0 });
          for (var j = 0; j < 6; j++) S.add({ t: 'streak', x: T.x, y: T.y, vx: (R() - .5) * 900, vy: (R() - .5) * 900, dr: 4, l: .35, a: 0, s: 2.5, c: C[0], tl: .04 }); }); })(k); }
      else if (use === 'beam' || use === 'pierce') { var bw = use === 'beam' ? 10 + tier * 5 : 6 + tier * 2;
        S.add({ t: 'beam', x: F.x, y: F.y, x2: T.x, y2: T.y, s: bw, c: C[1], c2: C[2], l: use === 'beam' ? .55 * q + tier * .06 : .22, a: 0 });
        for (var b = 0; b < 10 + tier * 4; b++) { var u = R(); S.add({ t: 'dot', x: F.x + (T.x - F.x) * u, y: F.y + (T.y - F.y) * u, vx: (R() - .5) * 220, vy: (R() - .5) * 220, dr: 3, l: .5, a: 0, s: 4 + R() * 6, c: C[b % 3] }); } }
      else if (use === 'arrow' || use === 'orb') { var m = use === 'orb' ? 2 + tier : 3 + tier * 2;
        for (var a2 = 0; a2 < m; a2++) (function (a2) { S.at(ch + a2 * (use === 'orb' ? 70 : 35) * q, function () { var ang = Math.atan2(T.y - F.y, T.x - F.x) + (R() - .5) * 1.6, sp = 500 + R() * 300;
          S.add({ t: use === 'orb' ? 'dot' : 'streak', x: F.x, y: F.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - (use === 'arrow' ? 220 : 0), home: T, hs: 4200, dr: 1.2, l: 1.2, a: 0, fo: 0, s: use === 'orb' ? 9 + tier * 2 : 3.5, c: C[a2 % 2 ? 0 : 1], tl: .06,
            onHit: function () { burst(S, T.x + (R() - .5) * 20, T.y + (R() - .5) * 20, e, 4 + tier, 260, .6); } }); }); })(a2); }
      else if (use === 'smash') { S.at(ch + 160 * q, function () { bolt(S, T.x + (R() - .5) * 30, -10, T.x, T.y, C[1], 5 + tier, .3); if (e === 'thunder' || tier >= 3) bolt(S, T.x - 40, -10, T.x + 10, T.y, C[0], 3, .25);
          for (var r = 0; r < 1 + Math.ceil(tier / 2); r++) S.add({ t: 'ring', x: T.x, y: T.y + 20, r0: 10, r1: 90 + r * 50 + tier * 10, s: 8, c: C[r % 2 ? 2 : 1], l: .6 + r * .12, a: 0 }); }); }
      else { /* nova */ for (var r2 = 0; r2 < 2 + Math.floor(tier / 2); r2++) S.add({ t: 'ring', x: F.x, y: F.y, r0: 20, r1: Math.hypot ? Math.hypot(T.x - F.x, T.y - F.y) + 40 + r2 * 40 : 300, s: 9, c: C[r2 % 2 ? 2 : 1], l: .55 + r2 * .1, a: 0 });
        for (var hx = 0; hx < 8 + tier * 2; hx++) { var aa = hx / (8 + tier * 2) * Math.PI * 2; S.add({ t: sht(e) === 'dot' ? 'hex' : sht(e), x: F.x, y: F.y, vx: Math.cos(aa) * 520, vy: Math.sin(aa) * 520, dr: 1.5, l: .7, a: 0, s: 10, c: C[1], spin: 4 }); } }
    });
    /* 命中 */
    S.at(hitT, function () { burst(S, T.x, T.y, e, 16 + tier * 8, 300 + tier * 60, 1 + tier * .15); S.flash = .08 + tier * .05; S.fc = C[1]; shake(o.shk || host, tier);
      if (e === 'thunder' || e === 'plasma') for (var z = 0; z < tier; z++) bolt(S, T.x, T.y, T.x + (R() - .5) * 240, T.y + (R() - .5) * 200, C[z % 2], 3, .3);
      if (o.dmg != null && !o.noNum) num(host, T, o.dmg, crit, tier);
      if (o.onHit) try { o.onHit(); } catch (x) { } });
    /* ★5 核彈級：白光 ➜ 三圈衝擊波 ➜ 光柱往上衝 */
    if (tier >= 5) S.at(hitT + 160, function () { S.flash = .85; S.fc = '#FFFFFF'; shake(o.shk || host, 5);
      for (var r3 = 0; r3 < 3; r3++) S.add({ t: 'ring', x: T.x, y: T.y, r0: 10, r1: Math.max(S.w, S.h) * (.5 + r3 * .25), s: 14 - r3 * 3, c: C[r3], l: .8 + r3 * .2, a: 0 });
      for (var u2 = 0; u2 < 70; u2++) S.add({ t: 'dot', x: T.x + (R() - .5) * 60, y: T.y, vx: (R() - .5) * 160, vy: -200 - R() * 520, dr: 1.4, gv: 60, l: 1 + R() * .8, a: 0, s: 8 + R() * 12, c: C[u2 % 3] });
      dom(host, 'fxnuke', '<b>★★★★★ 神話 爆發</b>', 1400); });
    /* 🐾 寵物 跟著 打 */
    var pT = hitT + 260;
    if (o.p) S.at(pT, function () { var pe = pEl(o.p), PF = o.pFrom || { x: F.x - 40, y: F.y + 40 };
      if (o.pImg) { var pi = dom(host, 'fxpet', '<img src="' + o.pImg + '" alt="">', 900 * q, 'left:' + PF.x + 'px;top:' + PF.y + 'px;--dx:' + (T.x - PF.x) + 'px;--dy:' + (T.y - PF.y) + 'px'); }
      S.at(pT + 300 * q, function () { burst(S, T.x + 16, T.y + 10, pe, 14, 260, .8); if (o.pd && !o.noNum) num(host, { x: T.x + 40, y: T.y + 30 }, o.pd, false, 1, '🐾 ＋'); }); });
    var ms = (o.p ? pT + 700 : hitT + 700) + (tier >= 5 ? 900 : 0); S.stop(ms); return { ms: ms, hit: hitT, crit: crit };
  }
  function num(host, T, v, crit, tier, pre) { var o = dom(host, 'fxnum' + (crit ? ' crit' : '') + (pre ? ' pet' : ''), (crit ? '<small>暴擊！</small>' : '') + (pre || '💥 ') + v, 1500, 'left:' + T.x + 'px;top:' + T.y + 'px;font-size:' + (40 + (tier || 1) * 6) + 'px'); return o; }

  /* ════ 登場（戰士、武器、寵物）════ o ＝ {img, star, kind:'h'|'w'|'p', title, sub, w:武器編號} */
  function overlay(cls) { var o = document.createElement('div'); o.className = 'fxov ' + (cls || ''); o.setAttribute('role', 'dialog'); document.body.appendChild(o); return o; }
  function close(o, ms, cb) { var tm = setTimeout(go, ms); function go() { clearTimeout(tm); if (!o.parentNode) return; o.classList.add('out'); setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); if (cb) cb(); }, 380); }
    o.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.fxok')) go(); }); return go; }
  function stars(n) { var s = ''; for (var i = 0; i < n; i++) s += '<i style="--i:' + i + '">★</i>'; return s; }
  function summon(o) {
    o = o || {}; var tier = Math.max(1, Math.min(5, o.star || 1)), e = o.kind === 'w' ? wInfo(o.w).e : o.kind === 'p' ? pEl(o.w) : ['light', 'tech', 'thunder', 'cosmic', 'fire', 'light'][tier], C = EL[e].c;
    var ov = overlay('sum t' + tier);
    ov.innerHTML = '<div class="fxsc"><div class="fxcard ' + (o.kind || 'h') + '" style="--c1:' + C[1] + ';--c2:' + C[2] + '"><img src="' + o.img + '" alt=""><div class="fxrays"></div></div>' +
      '<div class="fxst">' + stars(tier) + '</div><div class="fxtt">' + (o.title || '') + '</div><div class="fxsub">' + (o.sub || '') + '</div><button class="fxok">👌 好</button></div>';
    var S = Stage(ov, true), cx = S.w / 2, cy = S.h * .5, rad = Math.min(S.w, S.h) * .32;
    if (RM) { S.stop(100); close(ov, 3200, o.done); return; }
    /* 魔法陣：另外一張畫布，三圈一直轉（中間一圈有七芒星） */
    var mc = document.createElement('canvas'), dp = Math.min(2, window.devicePixelRatio || 1); mc.className = 'fxcv full'; mc.setAttribute('aria-hidden', 'true'); mc.width = Math.round(S.w * dp); mc.height = Math.round(S.h * dp); ov.insertBefore(mc, ov.firstChild);
    var mg = mc.getContext('2d'), rot = 0;
    (function loop() { if (!ov.parentNode) return; mg.setTransform(dp, 0, 0, dp, 0, 0); mg.clearRect(0, 0, S.w, S.h); mg.globalCompositeOperation = 'lighter'; mg.save(); mg.translate(cx, cy + rad * .55); mg.scale(1, .36); rot += .02;
      [[rad, 3, 1], [rad * .78, 2, -1.6], [rad * .55, 2, 2.4]].forEach(function (r, i) { mg.save(); mg.rotate(rot * r[2]); mg.strokeStyle = hexA(C[1], .25); mg.lineWidth = r[1] * 4; mg.beginPath(); mg.arc(0, 0, r[0], 0, Math.PI * 2); mg.stroke();   /* 外面 一圈 淡的 ＝ 發光（不用 shadowBlur：很耗電、iPad 會卡） */
        mg.strokeStyle = hexA(C[i === 0 ? 1 : 0], .85); mg.lineWidth = r[1];
        mg.beginPath(); mg.arc(0, 0, r[0], 0, Math.PI * 2); mg.stroke();
        for (var k = 0; k < 24; k++) { var a = k / 24 * Math.PI * 2; mg.beginPath(); mg.moveTo(Math.cos(a) * r[0], Math.sin(a) * r[0]); mg.lineTo(Math.cos(a) * (r[0] - 12), Math.sin(a) * (r[0] - 12)); mg.stroke(); }
        if (i === 1) { mg.beginPath(); for (var h = 0; h <= 7; h++) { var b = h * 3 / 7 * Math.PI * 2; mg.lineTo(Math.cos(b) * r[0], Math.sin(b) * r[0]); } mg.stroke(); } mg.restore(); });
      mg.restore(); requestAnimationFrame(loop); })();
    for (var i = 0; i < 40 + tier * 20; i++) (function (i) { S.at(i * 22, function () { var a = Math.random() * Math.PI * 2, r = Math.random() * rad; S.add({ t: 'dot', x: cx + Math.cos(a) * r, y: cy + rad * .55 + Math.sin(a) * r * .36, vx: 0, vy: -180 - Math.random() * 380, dr: .4, l: 1.4, a: 0, s: 3 + Math.random() * 6, c: C[i % 3] }); }); })(i);
    if (tier >= 3) for (var b = 0; b < tier * 2; b++) (function (b) { S.at(500 + b * 140, function () { var x = cx + (Math.random() - .5) * rad * 1.6; bolt(S, x, 0, cx + (Math.random() - .5) * 40, cy + rad * .5, C[b % 2], 4, .25); }); })(b);
    S.at(1150, function () { S.add({ t: 'beam', x: cx, y: -20, x2: cx, y2: cy + rad * .6, s: 60 + tier * 16, c: C[1], c2: C[2], l: .9, a: 0 }); S.flash = .5 + tier * .08; S.fc = '#FFFFFF'; });
    S.at(1350, function () { burst(S, cx, cy, e, 50 + tier * 14, 520 + tier * 60, 1.6); for (var r = 0; r < 3; r++) S.add({ t: 'ring', x: cx, y: cy, r0: 20, r1: Math.max(S.w, S.h) * (.45 + r * .2), s: 10, c: C[r], l: .9 + r * .15, a: 0 }); shake(ov.querySelector('.fxsc'), tier); });
    /* 2026-10-20 第十六次 老師第 3 點：立體 光點 漩渦 從 四面八方 收進 卡片 ➜ 卡片 出來 的 那一下 立體 爆開（rpg/life.js 有 載入 才 有） */
    if (window.RPLIFE && RPLIFE.vortex) RPLIFE.vortex(ov, { x: cx, y: cy, c: C, e: e, tier: tier, ms: 1250 });
    S.stop(4200); return close(ov, tier >= 5 ? 6500 : 5400, o.done);
  }
  /* ════ 🐾 長大／進化 ════ o ＝ {img, to:1|2, name} */
  function evolve(o) { o = o || {}; var e = pEl(o.w), C = EL[e].c, ov = overlay('evo s' + (o.to || 1));
    ov.innerHTML = '<div class="fxsc"><div class="fxevo" style="--c1:' + C[1] + ';--c2:' + C[2] + '"><img src="' + o.img + '" alt=""><div class="fxrays"></div></div><div class="fxtt">' + (o.to >= 2 ? pg(2) + ' 進化了！' : pg(1) + ' 長大了！') + '</div>' +
      '<div class="fxsub">' + (o.sub || (o.to >= 2 ? '陪你 練了 7 天 ➜ 變得 更強' : '陪你 練了 3 天 ➜ 長大 了')) + '</div><button class="fxok">👌 好</button></div>';
    var S = Stage(ov, true), cx = S.w / 2, cy = S.h * .44; if (RM) { S.stop(100); return close(ov, 3200, o.done); }
    for (var i = 0; i < 90; i++) (function (i) { S.at(i * 26, function () { var a = Math.random() * Math.PI * 2, r = 160 + Math.random() * 160; S.add({ t: 'dot', x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, vx: -Math.sin(a) * 260, vy: Math.cos(a) * 260, home: { x: cx, y: cy }, hs: 900, dr: 1, l: 1.3, a: 0, s: 4 + Math.random() * 5, c: C[i % 3] }); }); })(i);
    S.at(2500, function () { S.flash = 1; S.fc = '#FFFFFF'; burst(S, cx, cy, e, 80, 640, 1.8); for (var r = 0; r < 3; r++) S.add({ t: 'ring', x: cx, y: cy, r0: 20, r1: 500 + r * 160, s: 10, c: C[r], l: 1 + r * .2, a: 0 }); });
    /* 2026-10-21 第十七次 老師第 12 點：3D 光繭 包住 ➜ 破開 ➜ 長大 ＝ 腳下 藍色 光環、進化 ＝ 金色 光環＋一對 光翼（不再 只是 一張 貼紙 變大） */
    if (window.RPLIFE && RPLIFE.cocoon) RPLIFE.cocoon(ov, { x: cx, y: cy, c: C, e: e, ms: 2450, r: Math.min(S.w, S.h) * .26 });
    else if (window.RPLIFE && RPLIFE.vortex) RPLIFE.vortex(ov, { x: cx, y: cy, c: C, e: e, tier: o.to >= 2 ? 5 : 3, ms: 2450 });
    S.at(2500, function () { ov.classList.add('evd'); });
    S.stop(4200); return close(ov, 6400, o.done); }
  /* ════ 👑 冠軍寶箱 ════ o ＝ {html:打開以後看到的, done} */
  function chest(o) { o = o || {}; var ov = overlay('chs');
    ov.innerHTML = '<div class="fxsc"><div class="fxchest"><i class="lid"></i><i class="box"></i><i class="lock"></i></div><div class="fxprize">' + (o.html || '') + '</div><div class="fxtt">👑 冠軍 寶箱</div><button class="fxok">👌 好</button></div>';
    var S = Stage(ov, true), cx = S.w / 2, cy = S.h * .5; if (RM) { ov.classList.add('open'); S.stop(100); return close(ov, 4000, o.done); }
    S.at(1500, function () { ov.classList.add('open'); S.flash = .7; S.fc = '#FFF2B0'; burst(S, cx, cy, 'light', 90, 600, 1.8); burst(S, cx, cy, 'time', 30, 400, 1.2); });
    for (var i = 0; i < 26; i++) (function (i) { S.at(1600 + i * 60, function () { S.add({ t: 'star', x: cx + (Math.random() - .5) * 200, y: cy, vx: (Math.random() - .5) * 300, vy: -300 - Math.random() * 300, gv: 380, l: 1.6, a: 0, s: 8 + Math.random() * 8, c: ['#FFE680', '#FFFFFF', '#FFB52E'][i % 3], spin: 6 }); }); })(i);
    S.stop(4000); return close(ov, 7000, o.done); }
  /* ════ 🪙 金幣 飛進去 ════ from、to ＝ 元素；n ＝ 拿到幾個；tick(加到幾) */
  function coins(from, to, n, tick, total0) { if (!from || !to || !(n > 0)) return; var k = Math.min(14, Math.max(3, Math.ceil(n / 3))), a = from.getBoundingClientRect(), b = to.getBoundingClientRect(), got = 0, base = total0 || 0;
    var lay = document.createElement('div'); lay.className = 'fxcoins'; lay.setAttribute('aria-hidden', 'true'); document.body.appendChild(lay);
    for (var i = 0; i < k; i++) (function (i) { var c = document.createElement('i'); c.className = 'cnI fxc'; lay.appendChild(c);
      var x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, ang = Math.random() * Math.PI * 2, r = 50 + Math.random() * 70, x1 = x0 + Math.cos(ang) * r, y1 = y0 + Math.sin(ang) * r - 40, x2 = b.left + b.width / 2, y2 = b.top + b.height / 2;
      c.style.left = x0 + 'px'; c.style.top = y0 + 'px';
      var done = function () { if (c.parentNode) c.parentNode.removeChild(c); got++; var v = Math.round(base + n * got / k); if (tick) tick(v); to.classList.remove('fxpop'); void to.offsetWidth; to.classList.add('fxpop'); if (got === k && lay.parentNode) lay.parentNode.removeChild(lay); };
      if (RM || !c.animate) { setTimeout(done, 200 + i * 40); return; }
      var an = c.animate([{ transform: 'translate(-50%,-50%) scale(.3) rotateY(0)', opacity: 0 }, { transform: 'translate(calc(-50% + ' + (x1 - x0) + 'px),calc(-50% + ' + (y1 - y0) + 'px)) scale(1.3) rotateY(360deg)', opacity: 1, offset: .35 },
        { transform: 'translate(calc(-50% + ' + (x2 - x0) + 'px),calc(-50% + ' + (y2 - y0) + 'px)) scale(.7) rotateY(900deg)', opacity: 1 }], { duration: 1000 + i * 45, delay: i * 70, easing: 'cubic-bezier(.5,0,.6,1)', fill: 'forwards' });
      an.onfinish = done; })(i); }
  /* ════ 👾 做完練習打怪 ════
     box ＝ 容器（裡面有 .fxh 英雄、.fxp 寵物、會放怪物）；F ＝ 伺服器算好的 {hits, d, pd, from:{i,m,hp,max}, to:{…}, kill:[…]}；o ＝ {base:網址開頭, w, p, id, done} */
  function monImg(base, m) { return base + 'rpg/pets/' + m + '.jpg'; }
  function fight(box, F, o) {
    o = o || {}; if (!box || !F) return; var base = o.base || '../', hero = box.querySelector('.fxh'), pet = box.querySelector('.fxp');
    var mon = dom(box, 'fxmon', '<div class="fxmi"><img src="' + monImg(base, F.from.m) + '" alt="怪物"></div><div class="fxhp"><i></i><span></span></div><div class="fxmn"></div>', 0);
    var img = mon.querySelector('img'), bar = mon.querySelector('.fxhp i'), lab = mon.querySelector('.fxhp span'), mn = mon.querySelector('.fxmn');
    var per = F.d + F.pd, vis = Math.min(F.hits, RM ? 1 : 6), KL = (F.kill || []).slice(), ML = ['p16', 'p22', 'p23', 'p24', 'p25', 'p27', 'p30', 'p17', 'p19', 'p20', 'p29', 'p28', 'p18', 'p21', 'p26'];
    var mx = function (i) { return 80 + 40 * i; }, cur = { i: F.from.i, hp: F.from.hp };
    /* 跟伺服器（score/_calc.js rpFight）一樣的算法，一下一下演出來 */
    var plan = [], st = { i: cur.i, hp: cur.hp }, kl = KL.length;
    for (var k = 0; k < vis; k++) { var dmg = (Math.round(F.hits * (k + 1) / vis) - Math.round(F.hits * k / vis)) * per, ev = { dmg: dmg, kills: [] };
      while (dmg > 0) { var need = mx(st.i) - st.hp; if (dmg >= need && kl > 0) { dmg -= need; ev.kills.push(ML[st.i % 15]); st.i++; st.hp = 0; kl--; } else { st.hp = Math.min(mx(st.i) - 1, st.hp + dmg); dmg = 0; } }
      ev.end = { i: st.i, hp: st.hp }; plan.push(ev); }
    if (F.to) plan[plan.length - 1].end = { i: F.to.i, hp: F.to.hp };
    function show(c) { var m = mx(c.i), r = Math.max(0, (m - c.hp) / m); bar.style.width = (r * 100).toFixed(1) + '%'; lab.textContent = '❤ ' + (m - c.hp) + ' ／ ' + m; mn.textContent = '👾 第 ' + (c.i + 1) + ' 隻　暗黑神獸'; img.src = monImg(base, ML[c.i % 15]); }
    show(cur);
    function strike(k) {
      if (k >= plan.length) { if (o.done) setTimeout(o.done, 400); return; }
      var ev = plan[k], a = attack(box, { from: pos(box, hero || box, .5, .45), to: pos(box, mon.querySelector('.fxmi'), .5, .5), w: o.w, id: o.id, p: k % 2 === 0 ? o.p : null, pImg: pet ? pet.getAttribute('src') : '', pFrom: pet ? pos(box, pet) : null,
        dmg: ev.dmg, quick: true, name: k === 0, hero: hero, shk: box, hook: o.hook,
        onHit: function () { mon.classList.remove('hit'); void mon.offsetWidth; mon.classList.add('hit');
          if (ev.kills.length) { var m = mx(cur.i); bar.style.width = '0%'; lab.textContent = '❤ 0 ／ ' + m; kill(ev.kills[ev.kills.length - 1], ev.end); } else { cur = ev.end; show(cur); } } });
      setTimeout(function () { strike(k + 1); }, Math.max(900, a.ms - 200) + (ev.kills.length ? 900 : 0));
    }
    function kill(m0, end) { if (o.onKill) try { o.onKill(); } catch (x) { } mon.classList.add('ko'); var S = Stage(box), c = pos(box, mon); burst(S, c.x, c.y, 'light', 60, 520, 1.6); S.stop(1600);
      dom(box, 'fxpure', '<img src="' + monImg(base, m0) + '" alt=""><b>✨ 打倒了！<br>淨化 ➜ 收進 👾 怪物圖鑑</b>', 2600);
      setTimeout(function () { cur = end; mon.classList.remove('ko'); show(cur); }, 1300); }
    setTimeout(function () { strike(0); }, 500);
  }
  /* 小特效（戰神之路 舞台上 戰士 和 寵物 的 互動）：spark ＝ 一團光點、beam ＝ 一道光 */
  function spark(host, x, y, e, n) { if (!host || RM) return; var S = Stage(host); burst(S, x, y, e || 'light', n || 18, 220, .7); S.stop(300); }
  function beam(host, a, b, e) { if (!host || RM) return; var S = Stage(host), C = EL[e || 'light'].c; S.add({ t: 'beam', x: a.x, y: a.y, x2: b.x, y2: b.y, s: 7, c: C[1], c2: C[2], l: .5, a: 0 });
    S.at(250, function () { burst(S, b.x, b.y, e || 'light', 14, 200, .6); }); S.stop(600); }
  /* ⚔ 戰力階級 徽章（2026-10-20 第十五次 老師 C17 第 5 題 B）：自己畫的盾牌（不用 🥇🥈🥉：排行榜第 1、2、3 名已經用了，會搞混）
     2026-10-21 第十六次 第 5 點 改名：1 ★ 見習戰士（鋼）2 ★★ 精英戰士（藍）3 ★★★ 烈焰戰將（火）4 ★★★★ 雷霆戰神（雷）5 ★★★★★ 傳說戰神（金＋皇冠）；tb(階, 'big') ＝ 大的、有星星＋名字 */
  var TN = ['', '見習戰士', '精英戰士', '烈焰戰將', '雷霆戰神', '傳說戰神'], TC = ['', ['#FFFFFF', '#B8C4D4', '#5A6678'], ['#E8FFFF', '#5AB8FF', '#1A4AB0'], ['#FFE08A', '#FF6A1A', '#8A1A00'], ['#F0E8FF', '#8A6BFF', '#2A0A8A'], ['#FFF3B0', '#FFC21A', '#8A5A00']];
  function ts(n) { return new Array(Math.max(0, Math.min(5, +n || 0)) + 1).join('★'); }
  function tb(n, big) { n = Math.max(0, Math.min(5, +n || 0)); if (!n) return ''; var c = TC[n], id = 'tbg' + n;
    var svg = '<svg viewBox="0 0 40 46" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".5" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient></defs>' +
      '<path d="M20 2L37 8V22Q37 36 20 44Q3 36 3 22V8Z" fill="url(#' + id + ')" stroke="' + c[2] + '" stroke-width="2.4"/><path d="M20 7L32 11.5V22Q32 32 20 38.5Q8 32 8 22V11.5Z" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.4"/>' +
      (n >= 5 ? '<path d="M11 13l4 4 5-7 5 7 4-4-2 10H13z" fill="#FFE07A" stroke="#6A3A00" stroke-width="1"/>' : '') +
      '<path d="M20 ' + (n >= 5 ? 24 : 14) + 'l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill="#fff" fill-opacity=".92"/>' + (n >= 4 ? '<circle cx="20" cy="' + (n >= 5 ? 31 : 21) + '" r="2" fill="' + c[1] + '"/>' : '') + '</svg>';
    return '<span class="tbI t' + n + (big ? ' big' : '') + '" role="img" aria-label="' + ts(n) + ' ' + TN[n] + '">' + svg + (big ? '<b><i class="tbS">' + ts(n) + '</i>' + TN[n] + '</b>' : '') + '</span>'; }
  /* 🐾 寵物 長大／進化 徽章（2026-10-21 第十七次 老師第 11 點：🐥 🐲 太幼稚 ➜ 選擇題「光環徽章」）：0 寶寶 ＝ 一圈 灰色 虛線；1 長大 ＝ 一圈 藍色 光環；2 進化 ＝ 兩圈 金色 光環＋光翼 */
  function pg(n) { n = Math.max(0, Math.min(2, +n || 0)); var id = 'pgg' + n, c = [['#C8D0DA', '#6A7686'], ['#E8FBFF', '#4FC3FF'], ['#FFF6C8', '#FFC21A']][n];
    var svg = '<svg viewBox="0 0 56 36" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + c[1] + '"/><stop offset=".5" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs>' +
      (n >= 2 ? '<path d="M18 20Q6 6 1 12Q5 16 3 21Q9 19 10 25Q14 21 18 23Z" fill="url(#' + id + ')" opacity=".9"/><path d="M38 20Q50 6 55 12Q51 16 53 21Q47 19 46 25Q42 21 38 23Z" fill="url(#' + id + ')" opacity=".9"/>' : '') +
      '<ellipse cx="28" cy="' + (n >= 2 ? 24 : 18) + '" rx="' + (n >= 2 ? 15 : 17) + '" ry="5.5" fill="none" stroke="url(#' + id + ')" stroke-width="' + (n ? 3.2 : 2) + '"' + (n ? '' : ' stroke-dasharray="3 3"') + '/>' +
      (n >= 2 ? '<ellipse cx="28" cy="12" rx="11" ry="4" fill="none" stroke="url(#' + id + ')" stroke-width="2.6"/>' : '') +
      (n ? '<path d="M28 ' + (n >= 2 ? 13 : 9) + 'l1.6 3.6 3.6.4-2.7 2.5.8 3.7-3.3-1.9-3.3 1.9.8-3.7-2.7-2.5 3.6-.4z" fill="#fff"/>' : '<circle cx="28" cy="18" r="3" fill="' + c[1] + '"/>') + '</svg>';
    return '<span class="pgI p' + n + '" role="img" aria-label="' + ['寶寶', '長大', '進化'][n] + '">' + svg + '</span>'; }
  return { attack: attack, spark: spark, beam: beam, summon: summon, evolve: evolve, chest: chest, coins: coins, fight: fight, wInfo: wInfo, pEl: pEl, EL: EL, hash: hash, pos: pos, tb: tb, TN: TN, ts: ts, pg: pg, wSig: wSig, SIGN: SIGN };
})();
/* 🪙 金幣圖示：老師的電腦（舊的 Windows）沒有 🪙 這個字 ➜ 一律換成自己畫的金幣（2026-10-20 第十四次 2） */
(function () {
  var CN = '🪙', SKIP = /^(SCRIPT|STYLE|TEXTAREA|TITLE|OPTION|CANVAS)$/;
  function fixText(t) { if (!t.parentNode || SKIP.test(t.parentNode.nodeName) || t.nodeValue.indexOf(CN) < 0) return; var parts = t.nodeValue.split(CN), f = document.createDocumentFragment();
    for (var i = 0; i < parts.length; i++) { if (i) { var s = document.createElement('i'); s.className = 'cnI'; s.setAttribute('role', 'img'); s.setAttribute('aria-label', '金幣'); f.appendChild(s); } if (parts[i]) f.appendChild(document.createTextNode(parts[i])); }
    t.parentNode.replaceChild(f, t); }
  function fix(n) { if (!n) return; if (n.nodeType === 3) { fixText(n); return; } if (n.nodeType !== 1 || SKIP.test(n.nodeName) || (n.textContent || '').indexOf(CN) < 0) return;
    var w = document.createTreeWalker(n, 4, null, false), L = [], x; while ((x = w.nextNode())) if (x.nodeValue.indexOf(CN) >= 0) L.push(x); L.forEach(fixText); }
  function go() { fix(document.body); if (window.MutationObserver) new MutationObserver(function (M) { M.forEach(function (m) { if (m.type === 'characterData') fixText(m.target); else for (var i = 0; i < m.addedNodes.length; i++) fix(m.addedNodes[i]); }); })
    .observe(document.body, { childList: true, subtree: true, characterData: true }); }
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
})();
/* score/_report_rt.js — 📅 練習報告（2026-10-17 老師看完 C9（第八次）一、1～3）。學生平板（score/_client.js）、老師看板（score/_teacher.js）共用。只寫 ES5，要先載入 _honor_rt.js（用 HON 的圖示、cscene、cweak、mn）。
   老師的決定（sentences/2026-10-16_C_需求與問題.md 第四節「第八次」）：
   ① 甲 打勾清單 ＝ 主要畫面：一行一件事＋真的數字＋目標，一行一行出來、蓋章 ✅ 做到了／🎯 還差…，最後兩行 ⭐ 你最棒、🎯 下一步
   ② 第 3 題 B：排法每一次換一種（10 種排法 LAY，洗牌輪流、跟上一次不一樣），數字和字一模一樣
   ③ 原本的愛心動畫（HON.cscene）保留；新做 10 種愛心動画（HV），用下面的切換按鈕看（〔📋 報告〕〔❤ 原本〕＋10 顆）
   數字全部來自 _calc.js care() 的 raw（days、count、q、fq、fp、W、F、sec），目標 ＝ CAREMAX（4 天、5 次、30 分鐘）；做到 ＝ 那一項 20 分。 */
var RPT=(function(){
  var GOAL={days:4,count:5,min:30};
  var IC=function(){return ['<span class="rpem">📅</span>','<span class="rpem">📝</span>',HON.EYE,HON.FIX,HON.CLK.replace('class="hclk"','class="hclk rpclk"')]};
  var CC=['#2F7BE8','#9B59D0','#00A6A6','#2EB85C','#FF9F1C'];
  var SHORT=['天數','次數','看完聽完','改對','分鐘'];
  function lsg(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
  function lss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function shuf(n,last){var a=[],i;for(i=0;i<n;i++)a.push(i);for(i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}if(a[0]===last)a.push(a.shift());return a}
  function pick(key,n){key='rpt_'+key;var o=lsg(key)||{q:[],last:-1};if(!o.q||!o.q.length)o.q=shuf(n,o.last);var x=o.q.shift();o.last=x;lss(key,o);return x}
  function mins(sec){return Math.round((+sec||0)/60)}
  /* 五項：真的數字、目標、做到了沒、還差多少（只寫在這裡，10 種排法用同一份） */
  function items(c){var r=c.raw||{},it=c.it,I=IC(),m=mins(r.sec),seen=r.q?100-(r.fp||0):0;
    var L=[
      {k:0,t:'這週 練了 <b>'+(r.days||0)+'</b> 天',g:'目標 '+GOAL.days+' 天',ms:'還差 '+Math.max(1,GOAL.days-(r.days||0))+' 天',x:(r.days||0)/GOAL.days},
      {k:1,t:'做完 <b>'+(r.count||0)+'</b> 次',g:'目標 '+GOAL.count+' 次',ms:'還差 '+Math.max(1,GOAL.count-(r.count||0))+' 次',x:(r.count||0)/GOAL.count},
      {k:2,t:r.q?'<b>'+seen+'%</b> 的題目 看完、聽完 才選':'這週 還沒有作答',g:r.q?'目標 100%':'',ms:r.q?'太快亂按 '+r.fq+' 題':'先做 1 次題目',x:r.q&&!r.fq?1:0},
      {k:3,t:!r.q?'這週 還沒有作答':!r.W?'這週 <b>沒有</b> 答錯':'答錯的 <b>'+r.W+'</b> 題，改對了 <b>'+r.F+'</b> 題',g:'',ms:!r.q?'先做 1 次題目':'還差 '+Math.max(1,r.W-r.F)+' 題',x:r.q&&r.F>=r.W?1:0},
      {k:4,t:'這週 練了 <b>'+(r.sec<60&&r.sec>0?Math.round(r.sec)+'</b> 秒':m+'</b> 分鐘'),g:'目標 '+GOAL.min+' 分鐘',ms:'還差 '+Math.max(1,GOAL.min-m)+' 分鐘',x:(r.sec||0)/(GOAL.min*60)}];
    L.forEach(function(o){o.ic=I[o.k];o.v=it[o.k];o.ok=it[o.k]>=20;o.p=Math.min(100,it[o.k]*5);o.st=o.ok?'✅ 做到了':'🎯 '+o.ms});
    return L}
  /* 最後兩行：⭐ 你最棒（做到的裡面超過目標最多的；都沒做到 ＝ 分數最高的那一項）、🎯 下一步（HON.cweak ＝ 分數最少的那一項） */
  function best(L){var b=null;L.forEach(function(o){if(o.ok&&(!b||o.x>b.x))b=o});if(!b)L.forEach(function(o){if(o.v>0&&(!b||o.v>b.v))b=o});return b}
  function plain(h){return String(h).replace(/<[^>]+>/g,'')}
  function sumHTML(c,L){var b=best(L),w=HON.cweak(c);
    var bt=b?plain(b.t)+(b.ok&&b.x>1.001&&b.g?'（比'+b.g+' 還多）':''):'這週 開始練習了';
    return '<div class="rps"><div class="rs1">⭐ 你最棒：'+bt+'</div><div class="rs2">'+(w<0?'🎉 五項 都做到了！':'🎯 下一步：'+HON.CT[w].replace(/^請 /,'')+'')+'</div></div>'}
  /* ── 10 種排法（字和數字一樣，只換排法和出場動畫）── */
  var LAY=[{nm:'打勾清單',c:'l1'},{nm:'卡片牆',c:'l2'},{nm:'成績單',c:'l3'},{nm:'計分板',c:'l4'},{nm:'跑道',c:'l5'},
    {nm:'圓圈儀表',c:'l6'},{nm:'便利貼',c:'l7'},{nm:'時間軸',c:'l8'},{nm:'獎章',c:'l9'},{nm:'溫度計',c:'l10'}];
  function rowHTML(o,i,lay){var bar='<span class="rpb"><i style="--p:'+o.p+'%;background:'+CC[o.k]+'"></i></span>';
    var ring=lay==='l6'?'<svg class="rpring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" class="rk"/><circle cx="50" cy="50" r="42" class="rf" pathLength="100" style="stroke:'+CC[o.k]+';--p:'+o.p+'"/></svg>':'';
    var th=lay==='l10'?'<span class="rpth"><i style="--p:'+o.p+'%;background:'+CC[o.k]+'"></i></span>':'';
    return '<div class="rpr'+(o.ok?' ok':' no')+'" style="--i:'+i+'"><span class="rpi">'+ring+'<span class="rpic">'+o.ic+'</span></span>'+th+
      '<span class="rpt"><span class="rpx">'+o.t+(o.g?'<em class="rpg">（'+o.g+'）</em>':'')+'</span>'+(o.g?'<small>'+o.g+'</small>':'')+(lay==='l6'||lay==='l10'?'':bar)+'</span>'+
      '<span class="rpst '+(o.ok?'ok':'no')+'">'+o.st+'</span></div>'}
  function report(el,c,o){o=o||{};var L=items(c),n=o.lay!=null?o.lay:pick(o.key||'l',LAY.length),Y=LAY[n],w=HON.cweak(c),b=best(L);
    el.className='rpw '+Y.c;el.setAttribute('data-lay',n);
    el.innerHTML='<div class="rph">'+(o.t||'這週 📅 練習')+'</div><div class="rpl">'+L.map(function(x,i){return rowHTML(x,i,Y.c)}).join('')+'</div>'+sumHTML(c,L);
    var R=el.querySelectorAll('.rpr');if(w>=0)R[w].classList.add('wk');if(b&&b.ok)R[b.k].classList.add('best');
    var RD=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    el._t=[];[].forEach.call(R,function(r,i){el._t.push(setTimeout(function(){r.classList.add('on')},RD?0:150+i*650));el._t.push(setTimeout(function(){r.classList.add('st')},RD?0:150+i*650+700))});
    el._t.push(setTimeout(function(){var s=el.querySelector('.rps');if(s)s.classList.add('on')},RD?0:150+L.length*650+700));
    return n}
  /* ══ 10 種新的愛心動畫（老師 C9 第 2 題 (2)：最精緻、最秒懂、最精準、最觸動學生內心）══
     共同的框：標題、總分從 0 數上去 ／100、中間的畫、下面五格（圖示＋名字＋N／20，最少的那一格金框閃）、最後一句 💡 下一步。
     每一種畫的都是同一件事：五項 ✕ 20 分 ＝ 100 分；每一種最上面一行小字告訴學生「怎麼看」。 */
  var HP='M50 88C20 66 4 48 4 28C4 13 15 4 28 4C38 4 45 10 50 18C55 10 62 4 72 4C85 4 96 13 96 28C96 48 80 66 50 88Z';
  function hs(x,y,s,fill,cls,extra){return '<path class="'+(cls||'')+'" d="'+HP+'" fill="'+fill+'" transform="translate('+x+' '+y+') scale('+s+') translate(-50 -46)"'+(extra||'')+'/>'}
  var UID=0;
  /* 100 格的愛心：在 13 ✕ 12 的格子裡，挑「最在愛心裡面」的 100 格（每一次都一樣） */
  var PIX=(function(){var C=[],x,y;for(y=0;y<12;y++)for(x=0;x<13;x++){var X=(x-6)/6.2,Y=(5.2-y)/5.6+.25,f=Math.pow(X*X+Y*Y-1,3)-X*X*Y*Y*Y;C.push({x:x,y:y,f:f})}
    C.sort(function(a,b){return a.f-b.f});C=C.slice(0,100);C.sort(function(a,b){return (b.y-a.y)||(a.x-b.x)});return C})();
  var HV=[
    {nm:'拼圖大愛心',ic:'🧩',how:'一塊 拼圖 ＝ 一項；裝滿 ＝ 20 分',art:function(L,u){var h='<svg class="hva" viewBox="0 0 100 92"><defs><clipPath id="hz'+u+'"><path d="'+HP+'"/></clipPath></defs><path d="'+HP+'" fill="#152238"/><g clip-path="url(#hz'+u+')">';
      L.forEach(function(o,k){var x=k*20,hh=92*o.v/20;h+='<g class="hzp" style="--k:'+k+'"><rect x="'+x+'" y="0" width="20" height="92" fill="'+CC[o.k]+'" opacity=".18"/><rect class="hzf" x="'+x+'" y="'+(92-hh)+'" width="20" height="'+hh+'" fill="'+CC[o.k]+'"/></g>'});
      h+='</g>';for(var k=1;k<5;k++)h+='<line x1="'+k*20+'" y1="0" x2="'+k*20+'" y2="92" stroke="#0B1830" stroke-width="1.6" clip-path="url(#hz'+u+')"/>';
      return h+'<path d="'+HP+'" fill="none" stroke="#FFE07A" stroke-width="2.2" class="hzo"/></svg>'}},
    {nm:'100 格愛心',ic:'🟥',how:'一格 ＝ 1 分；100 格 ＝ 100 分',art:function(L){var col=[],h='<svg class="hva hvpx" viewBox="0 0 130 120">';L.forEach(function(o){for(var i=0;i<o.v;i++)col.push(CC[o.k])});
      PIX.forEach(function(p,i){var on=i<col.length;h+='<rect x="'+(p.x*10+.8)+'" y="'+(p.y*10+.8)+'" width="8.4" height="8.4" rx="1.6" class="'+(on?'pxo':'pxe')+'" style="'+(on?'fill:'+col[i]+';--i:'+i:'')+'"/>'});return h+'</svg>'}},
    {nm:'愛心電池',ic:'🔋',how:'電池 充滿 ＝ 20 分',art:function(L){var h='<div class="hvbat">';L.forEach(function(o,k){h+='<div class="bt'+(o.ok?' full':'')+'" style="--k:'+k+'"><i class="btc"></i><div class="btb"><i style="--p:'+o.p+'%;background:'+CC[o.k]+'"></i><span>'+(o.ok?'⚡':'')+'</span></div></div>'});return h+'</div>'}},
    {nm:'愛心燈串',ic:'💡',how:'燈 愈亮 ＝ 分數 愈高；全亮 ＝ 20 分',art:function(L,u){var h='<svg class="hva hvlt" viewBox="0 0 500 170"><path d="M10 20Q130 80 250 26T490 20" fill="none" stroke="#6B5B3A" stroke-width="4"/>';
      L.forEach(function(o,k){var x=50+k*100,y=k%2?58:66,b=(.12+.88*o.v/20).toFixed(2);h+='<line x1="'+x+'" y1="'+(y-26)+'" x2="'+x+'" y2="'+y+'" stroke="#6B5B3A" stroke-width="3"/><rect x="'+(x-7)+'" y="'+(y-4)+'" width="14" height="10" rx="2" fill="#8C7A50"/>'+
        '<g class="lb'+(o.ok?' full':'')+'" style="--k:'+k+';--b:'+b+'"><circle cx="'+x+'" cy="'+(y+46)+'" r="44" fill="'+CC[o.k]+'" class="lgl"/>'+hs(x,y+44,.62,CC[o.k],'lbh')+'</g>'});return h+'</svg>'}},
    {nm:'愛心氣球',ic:'🎈',how:'飛到 虛線 ＝ 20 分',art:function(L){var h='<div class="hvbl"><i class="blg"><span>20 分</span></i>';L.forEach(function(o,k){h+='<div class="bl'+(o.ok?' full':'')+'" style="--k:'+k+';--p:'+o.p+'"><svg viewBox="0 0 100 160"><path d="M50 92Q44 120 52 160" stroke="#C8D2DC" stroke-width="2" fill="none"/>'+hs(50,48,.92,CC[o.k])+'<ellipse cx="34" cy="28" rx="7" ry="11" fill="#fff" opacity=".45"/></svg></div>'});return h+'</div>'}},
    {nm:'畫一顆愛心',ic:'✏️',how:'一段 ＝ 一項；畫完 一圈 ＝ 100 分',art:function(L){var h='<svg class="hva hvdr" viewBox="0 0 100 92"><path d="'+HP+'" fill="none" stroke="#24344C" stroke-width="5"/>';
      L.forEach(function(o,k){h+='<path d="'+HP+'" pathLength="100" fill="none" stroke="'+CC[o.k]+'" stroke-width="5.5" stroke-linecap="round" class="drs" style="--k:'+k+';stroke-dasharray:0 '+(k*20)+' '+o.v+' 100"/>'});
      var all=L.every(function(o){return o.ok});return h+'<path d="'+HP+'" class="drf'+(all?' on':'')+'" fill="#FFD54A"/></svg>'}},
    {nm:'愛心花園',ic:'🌷',how:'長到 最高 開花 ＝ 20 分',art:function(L){var h='<div class="hvgd">';L.forEach(function(o,k){h+='<div class="fl'+(o.ok?' full':'')+'" style="--k:'+k+';--p:'+o.p+'"><div class="flst"><i></i><svg class="flh" viewBox="0 0 100 92">'+hs(50,46,1,CC[o.k])+'</svg><b class="flbud" style="background:'+CC[o.k]+'"></b></div><div class="flpot"></div></div>'});return h+'</div>'}},
    {nm:'愛心寶石皇冠',ic:'👑',how:'寶石 愈亮 ＝ 分數 愈高；全亮 ＝ 20 分',art:function(L){var h='<svg class="hva hvcr" viewBox="0 0 500 230"><path class="crb" d="M40 210L20 60L130 130L250 30L370 130L480 60L460 210Z" fill="#B8860B" stroke="#FFE07A" stroke-width="6" stroke-linejoin="round"/><rect x="40" y="190" width="420" height="26" rx="8" fill="#8A6508"/>';
      var P=[[95,170],[175,150],[250,135],[325,150],[405,170]];L.forEach(function(o,k){var b=(.15+.85*o.v/20).toFixed(2);h+='<circle cx="'+P[k][0]+'" cy="'+P[k][1]+'" r="31" fill="#3A2A05"/><g class="gem'+(o.ok?' full':'')+'" style="--k:'+k+';--b:'+b+'">'+hs(P[k][0],P[k][1]+1,.5,CC[o.k])+'</g>'});return h+'</svg>'}},
    {nm:'愛心樹',ic:'🌳',how:'一根 樹枝 ＝ 一項；5 顆 愛心 ＝ 20 分（1 顆 ＝ 4 分）',art:function(L){var h='<svg class="hva hvtr" viewBox="0 0 500 250"><path d="M235 250L242 120L258 120L265 250Z" fill="#7A4E2A"/>';
      var B=[[250,125,70,110],[250,125,140,60],[250,125,250,30],[250,125,360,60],[250,125,430,110]];
      L.forEach(function(o,k){var b=B[k],n=Math.floor(o.v/4);h+='<path class="tbr" style="--k:'+k+'" d="M'+b[0]+' '+b[1]+'Q'+((b[0]+b[2])/2)+' '+(b[1]-20)+' '+b[2]+' '+b[3]+'" stroke="#7A4E2A" stroke-width="9" fill="none" stroke-linecap="round" pathLength="100"/>';
        for(var i=0;i<5;i++){var t=.3+.7*i/4,x=b[0]+(b[2]-b[0])*t,y=b[1]+(b[3]-b[1])*t-(i%2?30:-2)-12*Math.sin(Math.PI*t);h+=i<n?'<g class="tlv" style="--k:'+k+';--i:'+i+'">'+hs(x,y,.3,CC[o.k])+'</g>':'<circle cx="'+x+'" cy="'+y+'" r="6" fill="#3A5A3A"/>'}});return h+'</svg>'}},
    {nm:'愛心煙火',ic:'🎆',how:'飛 愈高、開 愈大 ＝ 分數 愈高',art:function(L){var h='<svg class="hva hvfw" viewBox="0 0 500 250">';
      L.forEach(function(o,k){var x=50+k*100,y=230-170*o.v/20,s=(.12+.5*o.v/20).toFixed(2),g='';
        for(var i=0;i<10;i++){var a=i/10*Math.PI*2;g+='<circle cx="'+(x+Math.cos(a)*48*s*2)+'" cy="'+(y+Math.sin(a)*48*s*2)+'" r="3.4" fill="'+(o.ok?'#FFE07A':CC[o.k])+'"/>'}
        h+='<g class="fwk" style="--k:'+k+';--dy:'+(230-y)+'px"><line x1="'+x+'" y1="230" x2="'+x+'" y2="246" stroke="'+CC[o.k]+'" stroke-width="5" stroke-linecap="round" class="fwr"/></g>'+
          '<g class="fwb'+(o.ok?' full':'')+'" style="--k:'+k+';transform-origin:'+x+'px '+y+'px">'+hs(x,y,+s,CC[o.k])+g+'</g>'});return h+'</svg>'}}];
  function hvScene(el,n,c,o){o=o||{};var V=HV[n],L=items(c),w=HON.cweak(c),u=++UID;
    el.className='hv hv'+(n+1);
    el.innerHTML='<div class="hvt">'+(o.t||'這週 📅 練習')+'</div><div class="hvsum"><b class="cn">0</b><span> ／100</span></div><div class="hvhow">'+V.ic+' '+V.how+'</div>'+
      '<div class="hvart">'+V.art(L,u)+'</div><div class="hvleg">'+L.map(function(x){return '<div class="lg'+(x.ok?' ok':'')+(x.k===w?' wk':'')+'" style="--k:'+x.k+';border-color:'+CC[x.k]+'"><span class="lgi">'+x.ic+'</span><span class="lgn">'+SHORT[x.k]+'</span><b>'+x.v+'<small>／20</small></b></div>'}).join('')+'</div>'+
      '<div class="hvtip">'+(w<0?'🎉 五項 都做到了！':'💡 '+HON.CT[w])+'</div>';
    var RD=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,nEl=el.querySelector('.cn'),t0=Date.now()+(RD?-9e3:400),tot=c.tot;
    (function f(){var p=Math.max(0,Math.min(1,(Date.now()-t0)/2600));nEl.textContent=Math.round(tot*p);if(p<1&&el.contains(nEl))requestAnimationFrame(f)})();
    el._t=[setTimeout(function(){el.classList.add('go')},60),setTimeout(function(){el.classList.add('end')},3600)]}
  /* ══ 整塊：上面舞台＋下面切換按鈕（〔📋 報告〕〔❤ 原本〕＋10 種）══ o ＝ {t, key, onAct} */
  function stop(el){if(!el)return;[].forEach.call(el.querySelectorAll('.rpw,.hv,.care'),function(x){(x._t||[]).forEach(clearTimeout);HON.cstop(x)})}
  function show(el,c,o){o=o||{};var key=o.key||'s';
    var B='<button type="button" data-v="r" class="on">📋 練習 報告</button><button type="button" data-v="h">❤ 原本的 愛心</button>'+HV.map(function(x,i){return '<button type="button" data-v="'+i+'">'+x.ic+' '+x.nm+'</button>'}).join('');
    el.className='rpbox'+(o.strip?' strip':'');el.innerHTML='<div class="rpstage"></div><div class="rpswh">❤ 換一種 看看'+(o.strip?'（左右 滑）':'')+'：</div><div class="rpsw">'+B+'</div>';
    var S=el.querySelector('.rpstage');
    function go(v){stop(el);S.innerHTML='<div></div>';var d=S.firstChild;
      if(v==='r')report(d,c,{t:o.t,key:key+'l'});else if(v==='h')HON.cscene(d,HON.cpick(key==='t'?'ct':'cs'),c,{help:1,t:o.t});else hvScene(d,+v,c,{t:o.t});
      [].forEach.call(el.querySelectorAll('.rpsw button'),function(b){b.classList.toggle('on',b.getAttribute('data-v')===String(v))});
      if(o.fit)setTimeout(function(){if(o.fit()>0)el.classList.add('tight')},0)}   /* 放不下（量出來要捲動）＝ 拿掉長條、再縮緊（.tight） */
    el.querySelector('.rpsw').onclick=function(e){var b=e.target.closest?e.target.closest('button'):null;if(!b)return;if(o.onAct)o.onAct();go(b.getAttribute('data-v'))};
    go('r')}
  return {show:show,report:report,hvScene:hvScene,items:items,LAY:LAY,HV:HV,stop:stop,PIX:PIX}
})();

/* ══════════ 成績紀錄（2026-10-07 對話 C；2026-10-08 對話 D：遊戲、Review 1 也記）══════════
   SCG ＝ 這一頁是幾年級（0 ＝ 三、四年級共用的 Review 1 遊戲：年級看登入的 5 碼）
   SCH ＝ 這一頁怎麼畫（下面那一段由 _tq.js／遊戲引擎／Review 1 複習各自給）：
     on() 畫面開著嗎、open() 打開、box() 畫在哪、back 回去的按鈕、key() 題組代號、name() 題組名稱、
     reopen() 換人以後回哪裡、rk() 作答中名次、btns(E) 最後一幕的按鈕、miss() 答錯整理的標題、act(a) data-sca 按鈕 */
var SCG=3,SCSRC="home";
var SCURL=String(window.SCORE_URL||'').replace(/^\s+|\s+$/g,''),SCON=!!SCURL&&!window.__SCORE_TEST_OFF;
var SCCLS={3:['304','307','311'],4:['402','406','409','410','400']},SCSEAT=30,SCAFTER={'400':'課後班'};   /* 400 ＝ 四年級課後班（2026-10-09 E9～E11）；跟 _calc.js 的 CLASSES／AFTER 一樣 */
function scCn(c){return SCAFTER[c]?c+' '+SCAFTER[c]:c+' 班'}
function scGet(k){try{return JSON.parse(localStorage.getItem('score_'+k)||'null')}catch(e){return null}}
function scPut(k,v){try{localStorage.setItem('score_'+k,JSON.stringify(v))}catch(e){}}
var SCID=scGet(SCG?'id_g'+SCG:'last'),SCGUEST=false,SCDEV=scGet('dev'),SCV=null,SCQ=[],SCT0=0,SCREF=0,SCQI=0,SCIN='',SCEND=null,SCH=null;
if(!SCDEV){SCDEV=Math.random().toString(36).slice(2,8);scPut('dev',SCDEV)}
function scGr(){return SCG||(SCID?+String(SCID).charAt(0):0)}
function scLive(){return SCON&&!!SCID&&!SCGUEST}
function scOn(){return !!(SCH&&SCH.on())}
function scCheck(id){
  if(!/^\d{5}$/.test(id))return{err:'len'};
  var c=id.slice(0,3),s=+id.slice(3),g=c.charAt(0)==='3'?3:(c.charAt(0)==='4'?4:0);
  if(!g||SCCLS[g].indexOf(c)<0)return{err:'cls',cls:c};
  if(SCG&&g!==SCG)return{err:'grade',g:g};
  if(s<1||s>SCSEAT)return{err:'seat'};
  return{id:id,cls:c,seat:s,g:g};
}
function scMsg(r){
  var G={3:'三',4:'四'};
  return r.err==='len'?'要打 5 個數字':r.err==='cls'?'🏫 沒有 '+r.cls+' 班，再看一次':
   r.err==='grade'?'這是'+G[SCG]+'年級的網站（'+G[r.g]+'年級請用'+G[r.g]+'年級的網站）':'🪑 座號要 01～'+SCSEAT;
}
/* 網路：GET 看排行、POST 送成績（text/plain ＝ 不用預檢，Apps Script 收得到） */
function scFetch(q,body,ms){
  return new Promise(function(ok,no){
    var done=false,t=setTimeout(function(){if(!done){done=true;no(new Error('timeout'))}},ms||9000);
    var u=SCURL+(q?(SCURL.indexOf('?')<0?'?':'&')+q:'');
    fetch(u,body?{method:'POST',body:JSON.stringify(body)}:{}).then(function(r){return r.json()})
     .then(function(j){if(!done){done=true;clearTimeout(t);ok(j)}},function(e){if(!done){done=true;clearTimeout(t);no(e)}});
  });
}
/* 沒網路先存平板，連上網補送（同一筆有編號，伺服器不會重複存） */
var SCBUSY=false,SCRES={};
function scFlush(){
  if(!SCON||SCBUSY)return Promise.resolve(null);
  var Q=scGet('q')||[];if(!Q.length)return Promise.resolve(null);
  SCBUSY=true;var last=null;
  var step=function(){Q=scGet('q')||[];if(!Q.length){SCBUSY=false;if(last)scTkLoad(function(){if(SCH&&SCH.tk)SCH.tk()});return last}   /* 送出去了 ➜ 任務的 ✅ 重拿 */
    var r=Q[0];
    return scFetch('',{a:'rec',r:r}).then(function(j){
      if(j&&(j.saved||j.err==='bad')){Q=scGet('q')||[];Q=Q.filter(function(x){return x.u!==r.u});scPut('q',Q);if(j.saved){SCRES[r.u]=j;last=j}return step()}
      SCBUSY=false;return last},function(){SCBUSY=false;return last});
  };
  return step();
}
if(SCON){setTimeout(scFlush,1500);window.addEventListener('online',function(){scFlush()})}
/* 要記成績的地方先過這一關：還沒登入 ➜ 先登入（在家可以〔👀 先練習，不記成績〕）；登入好了 ➜ 直接做 fn */
function scGate(fn){if(SCON&&!SCID&&!SCGUEST){scLogin(fn);return}fn()}
/* ── 登入（2026-10-09 改版，照 English-Jobs-New 的 jobdex 新登入）：① 🏫 打班級 ➜ ② 🪑 打座號 ➜ ③ ✅ 按綠色勾勾
   正在做的那一步會亮、要打的那一格會閃；班級打錯（第 3 個數字打完就檢查）立刻清空；想改班級 ＝ 點班級的格子或按 ⌫，整個班級清空重打 ── */
var SCTYPED='';
function scClsList(){var G={3:'三',4:'四'},gs=SCG?[SCG]:[3,4];
  return gs.map(function(g){return G[g]+'年級：'+SCCLS[g].map(function(c){return SCAFTER[c]?c+'（'+SCAFTER[c]+'）':c}).join('、')}).join('　')}
function scLogin(after){
  if(window.stopPlay)stopPlay();sayStop();
  SCH.open();
  SCTYPED='';SCLOGAFTER=after;
  var box=function(n,k){var s='';for(var i=0;i<n;i++)s+='<i class="'+k+'"></i>';return s};
  var LV0=!!window.SCLIVE;   /* ⚡ 現場任務（2026-10-19 第十三次 3(3)(10)）：字 精簡、沒有〔⬅ 回首頁〕 */
  SCH.box().innerHTML='<div class="sclog'+(LV0?' sclive':'')+'">'+(LV0?'<h2>🔑 登入</h2><div class="sclv">輸入：你的 班級號碼〔共 5 碼〕</div>':'<h2>🔢 先登入，成績才會記下來</h2>')+
   (LV0?'':'<div class="scsteps"><span id="scSt1">① 🏫 打班級</span><b>➜</b><span id="scSt2">② 🪑 打座號</span><b>➜</b><span id="scSt3">③ ✅ 按綠色勾勾</span></div>')+
   '<div class="scl"><div class="scbox" id="scBox"><div class="scg c" id="scGc"><span class="lb">🏫 班級</span><div class="cells">'+box(3,'c')+'</div></div>'+
   '<div class="scg s" id="scGs"><span class="lb">🪑 座號</span><div class="cells">'+box(2,'s')+'</div></div></div>'+
   '<div class="scmsg" id="scMsg"></div></div>'+
   '<div class="sckey">'+[1,2,3,4,5,6,7,8,9].map(function(n){return '<button data-k="'+n+'">'+n+'</button>'}).join('')+
   '<button class="bs" data-k="b" aria-label="刪掉">⌫</button><button data-k="0">0</button><button class="okb" data-k="ok" aria-label="確定">✅</button></div>'+
   (SCSRC==='home'?'<button id="scGuest">👀 先練習，不記成績</button>':'')+(LV0?'':SCH.back)+'</div>';
  scPaint();
}
var SCLOGAFTER=null;
function scPaint(err){
  var v=SCTYPED;if(!$('#scBox'))return;
  $$('#scBox i').forEach(function(c,n){var d=v.charAt(n);if(c.textContent!==d&&d){c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}
    c.textContent=d;c.classList.toggle('f',!!d);c.classList.toggle('cur',n===v.length)});
  var st=v.length<3?1:v.length<5?2:3;
  [1,2,3].forEach(function(k){var s=$('#scSt'+k);if(s){s.classList.toggle('now',k===st);s.classList.toggle('done',k<st)}});
  $('#scGc').classList.toggle('now',st===1);$('#scGs').classList.toggle('now',st===2);
  $('.sckey .okb').classList.toggle('ready',v.length===5);
  var m=$('#scMsg');
  if(err){m.className='scmsg err';m.innerHTML=err;return}
  m.className='scmsg';
  m.innerHTML=v.length===0?'👆 先打你的<b class="kc">班級</b>（3 個數字）'+(window.SCLIVE?'':'<small>例：304 班 5 號 ➜ 打 3 0 4 0 5</small>'):
   v.length<3?'🏫 班級還要打 '+(3-v.length)+' 個數字':
   v.length===3?'👍 '+scCn(v)+'！再打<b class="ks">座號</b><small>5 號 ➜ 打 0 5<br>班級打錯 ➜ 按 ⌫ 重打</small>':
   v.length===4?'🪑 座號還要打 1 個數字':
   '對嗎？<b class="kc">'+scCn(v.slice(0,3))+'</b> <b class="ks">'+(+v.slice(3))+' 號</b> ➜ 按綠色的 ✅';
}
function scShake(){var b=$('#scBox');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake')}
/* 班級（前 3 個數字）對不對：沒有這一班、或不是這個年級的網站 */
function scClsErr(c){var g=c.charAt(0)==='3'?3:(c.charAt(0)==='4'?4:0),G={3:'三',4:'四'};
  if(!g||SCCLS[g].indexOf(c)<0)return '🏫 沒有 '+c+' 班！已經幫你清掉了，請重新打班級<small>'+scClsList()+'</small>';
  if(SCG&&g!==SCG)return '🏫 '+scCn(c)+'是'+G[g]+'年級，這是'+G[SCG]+'年級的網站！已經幫你清掉了<small>'+scClsList()+'</small>';
  return ''}
function scKeyPress(k){
  if(!$('#scBox'))return;
  if(k==='c'){SCTYPED='';scPaint();return}                             /* 點班級的格子 ＝ 整個班級清掉重打 */
  if(k==='s'){SCTYPED=SCTYPED.slice(0,3);scPaint();return}              /* 點座號的格子 ＝ 座號清掉重打 */
  if(k==='b'){SCTYPED=SCTYPED.length<=3?'':SCTYPED.slice(0,-1);scPaint();return}   /* 班級裡按 ⌫ ＝ 整個班級清掉 */
  if(k==='ok'){var r=scCheck(SCTYPED);
    if(r.err==='len'){scShake();scPaint(SCTYPED.length<3?'🏫 先打完班級（3 個數字）':'🪑 座號要打 2 個數字（5 號 ➜ 0 5）');return}
    if(r.err){scShake();scPaint(scMsg(r));return}
    scWho(r);return}
  if(SCTYPED.length>=5)return;
  SCTYPED+=k;
  if(SCTYPED.length===3){var ce=scClsErr(SCTYPED);if(ce){SCTYPED='';scShake();scPaint(ce);return}}
  if(SCTYPED.length===5){var s=+SCTYPED.slice(3);if(s<1||s>SCSEAT){var bad=SCTYPED.slice(3);SCTYPED=SCTYPED.slice(0,3);scShake();
    scPaint('🪑 沒有 '+bad+' 號！請重新打座號<small>座號是 01～'+SCSEAT+'</small>');return}}
  scPaint();
}
/* 登入好了（2026-10-09 Q4：學生端不顯示姓名，不再問伺服器「你是 ○○○ 嗎？」） */
function scWho(r){
  var go=function(){SCID=r.id;scPut('id_g'+r.g,SCID);scPut('last',SCID);SCGUEST=false;scOk();scAct();scBar();var a=SCLOGAFTER;SCLOGAFTER=null;
    scTkLoad(function(){if(SCH&&SCH.tk)SCH.tk();if(a)a()})};   /* 登入好了先拿老師的任務（2026-10-09 E），再做要做的事 */
  var m=$('#scMsg');m.className='scmsg ok';m.textContent='✅ '+scCn(r.cls)+' '+r.seat+' 號';
  setTimeout(go,500);
}
function scMeHTML(){
  if(!SCON)return '';
  if(SCGUEST)return '<div class="scme">👀 練習模式（不記成績）<button id="scSwap">🔑 登入</button></div>';
  if(!SCID)return '<div class="scme">👤 還沒登入<button id="scSwap">🔑 登入</button></div>';
  return '<div class="scme">'+SCID+'<button id="scSwap">👋 登出</button></div>';
}
/* ── 作答中：本班這一組的名次（只有前 10 名給名次；不在前 10 ＝ 再幾分進前 10） ── */
function scStart(gt){
  SCQ=[];SCV=null;SCIN='';clearTimeout(SCAUTO);SCEND=null;
  if(!scLive())return;
  var my=SCH.key();
  scFetch('a=view&id='+SCID+'&set='+encodeURIComponent(my)+(gt?'&gt=1':''),null,6000).then(function(j){if(j&&!j.err&&SCH.key()===my){SCV=j;if(SCH.rk)SCH.rk()}},function(){});
}
function scRk(s){
  if(!SCV)return '🏫 本班排名';
  if(!SCV.boards)return '💪 加油！';
  var o=(SCV.set&&SCV.set.others)||[],n=1;o.forEach(function(x){if(x>s)n++});
  if(n<=10)return '🏅 本班第 '+n+' 名';
  return '⬆ 再 '+(o[9]-s+1)+' 分進前 10';
}
function scAsk(q,qi){SCT0=Date.now();SCREF=q&&q.k==='read'?0:SCT0;SCQI=qi||0}
function scHeard(){if(!SCREF)SCREF=Date.now()}
/* 一題：選了第幾個（0 ＝ 正解，-1 ＝ 時間到）、答對、剩下秒數 ÷ 總秒數 */
function scDone(pick,ok,ratio){
  var now=Date.now(),sec=(now-SCT0)/1000;
  var fast=pick>=0?(now-(SCREF||SCT0)<1000?1:0):0;   /* 認讀題聽完才開始算；聲音沒播出來（沒有 scHeard）就從題目出來開始算，不要整份都變成太快亂按（練習次數 2026-10-12 F4 會看它） */
  SCQ.push([ok?1:0,pick,Math.round(sec*10)/10,fast,ok?Math.round(Math.max(0,Math.min(1,ratio))*1000)/1000:0,SCQI]);
}
/* ── 作答結束（2026-10-12 D 第 4 件；第 4 件修正 ＝ 使用者 D6～D8 定案）──
   題目（m:'q'）：① 正確率 ➜ ② 練習時間（每一個人都看得到，不是獎）➜ ③ 🏆 榮譽動畫（只有這一次讓他第一次進榜或名次上升才演）➜ 答錯整理
   遊戲（m:'g'）：① 正確率（第一次作答）＋✨ 訂正成功 ➜ ② 練習時間 ➜ ③ 🏆（同上）➜ 這個遊戲本班前 10 名
   🃏 記憶配對（m:'mem'）：配完幾對、用幾秒、翻錯幾次 ➜ ② 練習時間 ➜ ③ 🏆（同上）
   2026-10-15 D 第 8 件（老師 D12 ③）：時鐘 ➜ ❤ 這週 用心程度（每一次做完都演、8 種風格輪流、〔📖 說明〕、可以跳過、不放聲音）➜ 🏆 */
var SCLIST={q:['acc','time','care','hero','honor','end'],g:['acc','time','care','hero','honor','gtop'],mem:['mem','time','care','hero','honor']};   /* hero：2026-10-17 第八次 🦸 這一次拿到的經驗值、金幣 */
function scCareOf(E){return E.res&&E.res.me&&E.res.me.care}
/* 不演的那一幕從清單拿掉（名次沒上升 ＝ 🏆、沒有網路 ＝ ❤） */
function scDrop(E,nm){var L=E.list,i=L.indexOf(nm);if(i>E.k)L.splice(i,1)}
function scS100(Q){var n=Q.length,s=0;Q.forEach(function(q){if(q[0])s+=60/n+40/n*q[4]});return Math.round(s)}
function scEnd(o){
  o=o||{};var m=o.m||'q',Q=o.qs||SCQ,key=SCH.key(),n=Q.length,ok=0,fast=0;Q.forEach(function(q){ok+=q[0];fast+=q[3]});
  if(m!=='mem'&&!n)return false;
  var acc=m==='mem'?null:Math.round(ok/n*100),u=SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  var R={id:SCID,set:key,name:SCH.name(),m:m,qs:m==='mem'?[]:Q,raw:Math.round(o.raw||0),fix:o.fix||0,mp:o.mp||0,mw:o.mw||0,sec:Math.round(o.sec||0),
    src:SCSRC,dev:SCDEV,u:u,t:Date.now()};
  var hk='h_'+SCID+'_'+key,H=scGet(hk)||[],sv=SCV&&SCV.set;
  var prev=sv&&sv.tries?sv.prev:(H.length?H[H.length-1].acc:null);
  var best=sv&&sv.tries?sv.best:(H.length?Math.max.apply(null,H.map(function(x){return x.acc||0})):null);
  var today=Math.floor((Date.now()+288e5)/864e5),cnt=m==='mem'?true:(m==='g'&&n<6?false:fast*2<=n);   /* 練習次數 ＋1：做完就算，太快亂按超過一半不算（F4，跟 _calc.js counts 一樣） */
  var todayN=sv?sv.today:H.filter(function(x){return x.d===today&&x.c}).length;
  H.push({t:R.t,acc:acc,c:cnt,d:today});scPut(hk,H.slice(-50));
  var QQ=scGet('q')||[];QQ.push(R);scPut('q',QQ.slice(-200));SCIN=u;
  var me1=m==='mem'?R.sec:(fast*2>n?0:Q.reduce(function(t,q){return t+(q[3]?0:+q[2]||0)},0));   /* 這一次練了幾秒（太快亂按不算，跟 _calc.js secOf 一樣） */
  SCEND={m:m,list:SCLIST[m].slice(),fast:fast,me1:me1,
    acc:acc,ok:ok,n:n,s:m==='mem'?null:scS100(Q),raw:R.raw,fix:R.fix,mp:R.mp,mw:R.mw,sec:R.sec,prev:prev,best:best,cnt:cnt,cap:cnt&&todayN>=3,
    week:(SCV&&SCV.me?SCV.me.count:null),res:null,fail:false,k:0,tab:'acc',scope:'cls'};
  /* 送出：前一次補送還在跑就等一下再試（最多 3 次），還是送不出去 ＝ 沒有網路，先存平板 */
  var send=function(n){scFlush().then(function(){if(!SCEND||SCIN!==u)return;
    var j=SCRES[u],left=(scGet('q')||[]).some(function(x){return x.u===u});
    if(!j&&left&&n<3){setTimeout(function(){send(n+1)},1500);return}
    if(j)SCEND.res=j;else SCEND.fail=true;
    var nm=SCEND.list[SCEND.k];if(nm==='gtop'||(nm==='time'&&!SCEND.tgo))scScene()})};
  send(0);
  scScene();
  return true;
}
var SCAUTO=null;
function scGo(k){SCEND.k=k;scScene()}
function scNext(){var L=SCEND.list;scGo(Math.min(SCEND.k+1,L.length-1))}
function scRing(E,t){var R=46,L=2*Math.PI*R;
  return '<div class="sct">'+t+'</div><div class="scring"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="'+R+'"></circle>'+
    '<circle class="fg" id="scFg" cx="50" cy="50" r="'+R+'" stroke-dasharray="'+L+'" stroke-dashoffset="'+L+'"></circle></svg>'+
    '<b><span id="scAcc">0</span><small>'+E.ok+' ／ '+E.n+' 題</small></b></div>'}
/* ── ② 練習時間＋③ 🏆 榮譽動畫（2026-10-12 D 第 4 件修正，使用者 D6～D8 定案，listen/2026-10-12_D8 ①②）──
   ② 每一個人：自己畫的時鐘「這週你已經練習 12 分鐘」「這一次 練習 3 分鐘。」；沒上榜 ＝ 加正確率＋「比上週多 練習 4 分鐘。」（有多才寫）；
      太快亂按超過一半 ＝「⚠️ 太快亂按，不算時間」「請 看完、聽完再選」
   ③ 只有三種最高榮譽（最認真練習、成績最優、進步最多 × 班內前 10 名、全年級前 10 名；班級三種、前 3 名）；
      這一次讓他第一次進榜或名次上升才演（伺服器給 rk0 ＝ 這一次以前的名次）；名次沒變 ＝ 什麼都不演、不寫。12 種風格輪流、平板不放聲音 */
function scMin(sec){return HON.mn(sec)}
function scFast(E){return E.m!=='mem'&&E.n>0&&E.fast*2>E.n}
/* 這一次讓名次上升的獎（最多 3 個：班內 ➜ 全年級 ➜ 班級） */
function scUps(E){var V=E.res,U=[];if(!V||!V.boards||!V.rk||!V.rk0||scFast(E))return U;
  var my=String(SCID).slice(0,3),G={3:'三',4:'四'}[scGr()]||'';
  ['cls','grade'].forEach(function(sc){HON.AWK.forEach(function(k){var a=V.rk[k]&&V.rk[k][sc],b=V.rk0[k]&&V.rk0[k][sc];
    if(a&&(!b||a<b))U.push({k:k,rk:a,w:(sc==='cls'?scCn(my):G+'年級')+' 第 '+a+' 名',l:HON.awl(k,V.me,'這週')})})});
  if(V.crk&&V.crk0&&!SCAFTER[my])HON.AWK.forEach(function(k){var a=V.crk[k],b=V.crk0[k];
    if(a&&a.rk<=3&&(!b||a.rk<b))U.push({k:k,rk:a.rk,c:1,w:G+'年級 第 '+a.rk+' 名',l:HON.awc(k,a.v)})});
  return U.slice(0,3)}
/* 🏆 最認真練習 的 兩個 條件（2026-10-21 第十六次 第 6 點：貼心 提醒；這一週 到 現在 全部 題目 合起來）：A 👀 不是 太快 亂按、B ✗➜✓ 答錯 改對 都 ≧ 90% 才 上榜 */
function scAbHTML(me){var d=me&&me.dl;if(!d||d.a==null)return '';var L=function(ic,t,v,ok){return '<span class="'+(ok?'ok':'no')+'">'+ic+' '+t+' <b>'+v+'%</b> '+(ok?'✅':'❌')+'<i style="--w:'+Math.min(100,v)+'%"></i></span>'};
  return '<div class="scab"><div class="sab0">🏆 最認真練習 榜：兩個 都 要 ≧ 90%</div>'+L('👀','不是 太快 亂按',d.a,d.okA)+L('✗➜✓','答錯，改對',d.b,d.okB)+'</div>'}
function scTimeHTML(E){var V=E.res,me=V&&V.me,up=scUps(E).length;
  if(scFast(E))return '<div class="sctime"><div class="stic">⚠️</div><div class="st1">太快亂按，不算時間</div><div class="st2">請 看完、聽完再選</div></div>';
  var more=me&&!up?Math.round((me.sec-(me.secPrev||0))/60):0;
  return '<div class="sctime"><div class="stic">'+HON.CLK+'</div>'+
    (!up&&E.acc!=null?'<div class="st2">🎯 正確率 '+E.acc+' 分</div>':'')+
    (me?'<div class="st1">這週你已經練習 '+scMin(me.sec)+'</div>':'')+
    '<div class="st3">這一次 練習 '+scMin(E.me1)+'。</div>'+
    (more>0?'<div class="st3">比上週多 練習 '+more+' 分鐘。</div>':'')+
    scAbHTML(me)+
    (!V?'<div class="st4">'+(E.fail?'📶 現在沒有網路：成績先存在這台平板，連上網會自動送出 ✅':'<i class="scspin">⏳</i> 成績還在送出…')+'</div>':'')+'</div>'}
function scHonGo(E){
  var el=$('#scHon');if(!el)return;if(E.hst==null)E.hst=HON.pick('s');
  var U=E.ups,i=0;
  (function go(){if(SCEND!==E||!$('#scHon'))return;var u=U[i];
    if(!u){if(E.k<E.list.length-1)scNext();return}
    HON.scene($('#scHon'),E.hst,{kick:'🏆 本週 榮譽榜',cards:[{ic:HON.awi(u.k),nm:HON.AWN[u.k]+(u.c?'的班':''),w:u.w,l:u.l,me:1}]});
    SCAUTO=setTimeout(function(){i++;go()},4600)})();
}
function scScene(){
  clearTimeout(SCAUTO);if(!SCEND||!scOn())return;var E=SCEND,L=E.list,k=E.k,nm=L[k],h='',last=k===L.length-1;
  var dots=L.length>1?'<div class="scdots">'+L.map(function(x,n){return '<i'+(n===k?' class="on"':'')+'></i>'}).join('')+'</div>':'';
  var nav=function(more){return '<div class="scnav">'+(more||'')+(!last?'<button class="go" id="scNx">➡ 下一步</button><button id="scSkip">⏭ 跳過</button>':'')+'</div>'};
  if(nm==='acc'){
    h=scRing(E,E.m==='g'?'🎯 正確率（每一題第一次作答）':'🎯 正確率')+
      '<div class="scs">⚡ 總分 '+E.s+' 分（答對 60 ＋ 速度 40）</div>'+
      (E.m==='g'?(E.fix?'<div class="scfix">✨ 訂正成功 '+E.fix+' 題</div>':'')+'<div class="scnote">🎁 驚喜卡、連對加成是運氣，不算進成績</div>':'')+nav();
    SCAUTO=setTimeout(scNext,E.m==='g'?3600:3000);
  }else if(nm==='time'){
    /* 成績還在送：最多等 3 秒，送不到就先寫這一次的時間（這週的時間、榮譽要等伺服器） */
    if(E.hw0==null)E.hw0=Date.now();var hw=!E.res&&!E.fail&&!E.hto;
    if(hw){SCAUTO=setTimeout(function(){if(SCEND===E){E.hto=1;scScene()}},Math.max(0,3000-(Date.now()-E.hw0)));
      h='<div class="sct">'+HON.CLK+'</div><div class="scwait"><i>⏳</i> 正在送出成績…</div>'+nav()}
    else{if(E.res||E.fail)E.tgo=1;E.ups=scUps(E);
      if(E.tgo&&!scCareOf(E))scDrop(E,'care');
      if(E.tgo&&!(E.res&&E.res.rpg))scDrop(E,'hero');
      if(!E.ups.length&&E.tgo){var hi=L.indexOf('honor');if(hi>k)L.splice(hi,1);last=k===L.length-1;dots=L.length>1?'<div class="scdots">'+L.map(function(x,n){return '<i'+(n===k?' class="on"':'')+'></i>'}).join('')+'</div>':''}
      h=scTimeHTML(E)+(last?SCH.btns(E):nav());if(!last&&E.tgo)SCAUTO=setTimeout(scNext,4200)}   /* 還在送就等（送到或確定沒網路會再畫一次） */
  }else if(nm==='care'){
    if(!scCareOf(E)){L.splice(k,1);E.k=Math.min(k,L.length-1);scScene();return}   /* 沒有網路、伺服器還沒回 ＝ 不演 */
    /* 2026-10-16 C4 第 3-2 題 A：學生平板也看成績卡（🎯 正確、📅 練習；沒有姓名、沒有〔📋 細節〕），下面接 📅 練習 動畫 */
    var ME=E.res.me;h='<div class="sccare2">'+HON.card({acc:ME.acc,prog:ME.prog,keep:ME.keep},ME.care,{notip:1})+'<div id="scCare"></div></div>'+(last?SCH.btns(E):nav());   /* 橫的螢幕：成績卡在左、練習報告在右（2026-10-17 第八次：量過 1024✕768 上下排要捲動） */
    if(!last)SCAUTO=setTimeout(scNext,9000);
  }else if(nm==='hero'){
    if(!(E.res&&E.res.rpg)){L.splice(k,1);E.k=Math.min(k,L.length-1);scScene();return}
    h=scHeroHTML(E.res.rpg)+(last?SCH.btns(E):nav());if(!E.hgo){E.hgo=1;setTimeout(function(){if(SCEND===E&&document.querySelector('.schero'))scHeroGo(E.res.rpg)},120)}if(!last)SCAUTO=setTimeout(scNext,5200+scHeroMs(E.res.rpg));
  }else if(nm==='honor'){
    h='<div class="hon" id="scHon"></div>'+(last?SCH.btns(E):nav());
  }else if(nm==='gtop'){
    h=scGtopHTML()+SCH.btns(E);
  }else if(nm==='mem'){
    var per=E.mp?Math.round(E.sec/E.mp*10)/10:null;
    h='<div class="sct">🃏 記憶配對</div><div class="scstat">'+
      '<div><b>'+E.mp+'</b><span>✅ 配完幾對</span></div><div><b>'+E.sec+'</b><span>⏱ 用了幾秒</span></div><div><b>'+E.mw+'</b><span>🔁 翻錯幾次</span></div></div>'+
      (per!=null?'<div class="scs">平均 '+per+' 秒配一對</div>':'')+
      '<div class="scnote">記憶配對是記位置，不算正確率、不算總分（老師看得到這三個數字）</div>'+nav();
    SCAUTO=setTimeout(scNext,4000);
  }else{
    h='<div class="sct">'+(E.ok===E.n?'🎉 全對！':'答錯是大腦在學習 🧠')+'</div>'+
     '<div class="scraw">'+E.raw+'</div><div class="scs">🏆 這一次的分數　✅ 答對 '+E.ok+' ／ '+E.n+' 題</div>'+SCH.btns(E);
    if(MISSLOG.length)setTimeout(function(){if(SCEND&&SCEND.list[SCEND.k]==='end'&&scOn())missAll(SCH.miss())},600);
  }
  if(last&&scLive())h+=scByeHTML();   /* 每一個題目、遊戲做完：提醒登出（D 第 6 件 ③） */
  SCH.box().innerHTML='<div class="scn" id="scn">'+dots+h+'</div>';
  if(nm==='honor'&&$('#scHon'))scHonGo(E);
  if(nm==='care'&&$('#scCare'))RPT.show($('#scCare'),scCareOf(E),{key:'s',strip:1,onAct:function(){clearTimeout(SCAUTO)},fit:function(){var b=SCH.box(),o=b&&b.closest?b.closest('#scov,#rv'):null;return o?o.scrollHeight-o.clientHeight:0}});   /* 2026-10-17 第八次：📅 練習報告（打勾清單）＋愛心切換 */
  if(nm==='time'&&$('.sctime .hclkm'))$('.sctime').classList.add('go');
  if(nm==='hero')setTimeout(function(){var b=$('#scn .shbar i');if(b)b.style.width=b.getAttribute('data-w')+'%'},400);
  if(nm==='acc')setTimeout(function(){var f=$('#scFg'),a=$('#scAcc');if(!f)return;var L=+f.getAttribute('stroke-dasharray');
    f.setAttribute('stroke-dashoffset',L*(1-E.acc/100));var t0=Date.now(),iv=setInterval(function(){var x=Math.min(1,(Date.now()-t0)/1300);
      if(!$('#scAcc')){clearInterval(iv);return}a.textContent=Math.round(E.acc*x)+'%';if(x>=1)clearInterval(iv)},40)},80);
  setTimeout(function(){$$('.scbar .tr i').forEach(function(x){x.style.width=x.getAttribute('data-w')+'%'})},80);
}
/* ⚔ 戰力階級 徽章（2026-10-20 第十五次）：伺服器 給 的 tiers（排行榜上 出現 的 人） */
function scTb(id){var T=SCEND&&SCEND.res&&SCEND.res.tiers;return T&&T[id]&&typeof RPFX!=='undefined'?' '+RPFX.tb(T[id]):''}
function scPodHTML(L,fmt){
  var pod=[1,0,2].map(function(n){var x=L[n];if(!x)return '<div></div>';
    return '<div class="p'+Math.min(x.rk,3)+(x.id===SCID?' me':'')+'"><span class="id">'+x.id+scTb(x.id)+'</span><span class="v">'+fmt(x)+'</span><span class="st">'+(x.rk===1?'🥇':x.rk===2?'🥈':'🥉')+'</span></div>'}).join('');
  var rest=L.slice(3).map(function(x){return '<div'+(x.id===SCID?' class="me"':'')+'><span><em>'+x.rk+'</em> '+x.id+scTb(x.id)+'</span><span>'+fmt(x)+'</span></div>'}).join('');
  return '<div class="scpod">'+pod+'</div>'+(rest?'<div class="sclist">'+rest+'</div>':'');
}
/* 遊戲：這個遊戲本班前 10 名（這週，每個人最好的一次；正確率同分比總分） */
function scGtopHTML(){
  var E=SCEND,V=E.res,T='<div class="sct">🏆 這個遊戲　本班前 10 名（這週）</div>';
  if(!V&&!E.fail)return T+'<div class="scwait"><i>⏳</i> 正在送出成績…</div>';
  if(!V)return '<div class="sct">📶 現在沒有網路</div><div class="scs">成績先存在這台平板，連上網會自動送出 ✅</div>';
  if(!V.boards||!V.gtop)return '<div class="sct">💪 成績送出去了 ✅</div><div class="scs">下次再挑戰更高的正確率！</div>';
  var G=V.gtop,L=G.list,mine;
  if(G.rk)mine='<div class="scmine in">你是第 '+G.rk+' 名！🎉</div>';
  else if(G.cut!=null&&G.best&&G.cut-G.best.acc>=0&&G.cut-G.best.acc<=20)mine='<div class="scmine">⬆ 你再 '+Math.max(1,G.cut-G.best.acc)+' 分進前 10</div>';
  else mine='<div class="scmine">⭐ 你的紀錄 '+(G.best?G.best.acc:E.acc)+'%，下次打敗它！</div>';
  if(!L.length)return T+'<div class="scempty">這週還沒有人上榜，你可以當第一個！</div>'+mine;
  return T+scPodHTML(L,function(x){return x.acc+'%'})+mine;
}
/* ══ 老師派任務（2026-10-09 E；規則在 score/_calc.js 的 tkLock，這裡用同一份）══
   登入以後問伺服器「我這一班有什麼任務、我做完了哪些」（a=tasks）；時間用伺服器的（平板時鐘不準也鎖得對）。
   沒網路 ＝ 用這台平板上一次拿到的；從來沒拿到過 ＝ 全部開放（F）。👀 練習模式（不記成績）不鎖。 */
var scTkLock=function tkLock(T, key, now) {
    var act = [], mine = [], i, t;
    for (i = 0; i < (T || []).length; i++) { t = T[i]; var on = t.from <= now && now <= t.to;
      if (on) act.push(t); if (t.items.indexOf(key) >= 0) mine.push(t); }
    var a = mine.filter(function (x) { return x.from <= now && now <= x.to; });
    if (a.length) return { k: 'open', to: Math.max.apply(null, a.map(function (x) { return x.to; })), task: a[0] };
    if (mine.length) {
      var f = mine.filter(function (x) { return x.from > now; });
      if (f.length) return { k: 'soon', from: Math.min.apply(null, f.map(function (x) { return x.from; })), task: f[0] };
      return { k: 'end', to: Math.max.apply(null, mine.map(function (x) { return x.to; })), task: mine[0] };
    }
    if (act.length) return { k: 'off', act: act };
    return { k: 'free' };
  };
var SCTK=null,SCTKID=null;
function scTkGet(){if(!scLive())return null;if(SCTKID!==SCID){SCTKID=SCID;SCTK=scGet('tk_'+SCID)}return SCTK}
function scTkNow(){var t=scTkGet();return Date.now()+((t&&t.off)||0)}
function scTkLoad(cb){if(!scLive()){if(cb)cb();return}var id=SCID;
  scFetch('a=tasks&id='+id,null,7000).then(function(j){if(j&&j.ok&&id===SCID){SCTK={at:Date.now(),off:(+j.now||Date.now())-Date.now(),tasks:j.tasks||[],locks:j.locks||[]};SCTKID=id;scPut('tk_'+id,SCTK)}if(cb)cb()},function(){if(cb)cb()})}
function scLockOf(key){var t=scTkGet();if(!t||!t.tasks||!key)return {k:'free'};return scTkLock(t.tasks,key,scTkNow())}
function scTkOk(key){var k=scLockOf(key).k;return k==='free'||k==='open'}
var SCWD='日一二三四五六';
function scTkT(ms){var d=new Date(ms),p=function(n){return (n<10?'0':'')+n};return (d.getMonth()+1)+'/'+d.getDate()+'（'+SCWD.charAt(d.getDay())+'）'+p(d.getHours())+':'+p(d.getMinutes())}
function scLockTxt(L){return L.k==='open'?'⏰ 到 '+scTkT(L.to):L.k==='soon'?'🔒 '+scTkT(L.from)+' 開放':L.k==='end'?'🔒 已經截止':L.k==='off'?'🔒 老師現在指定別的':''}
function scTkAct(){var t=scTkGet(),n=scTkNow();return t&&t.tasks?t.tasks.filter(function(x){return x.from<=n&&n<=x.to}):[]}
/* 一個任務一行：📌 名稱：項目 ✅／⏳ … ⏰ 到 幾點 */
function scTkLine(x){var dn=x.done||[];return '<div class="sctkl"><b>📌 '+x.name+'</b>'+x.items.map(function(k){return '<span class="'+(dn.indexOf(k)>=0?'ok':'')+'">'+(dn.indexOf(k)>=0?'✅ ':'⏳ ')+(x.nm&&x.nm[k]||k)+'</span>'}).join('')+'<em>⏰ 到 '+scTkT(x.to)+'</em></div>'}
function scTaskBar(){var a=scTkAct();return a.length?'<div class="sctask">'+a.map(scTkLine).join('')+'</div>':''}
/* 鎖住的時候：一整頁大字（為什麼鎖、老師現在指定什麼、到什麼時候） */
function scLockShow(L){var o=document.getElementById('sctk');if(!o){o=document.createElement('div');o.id='sctk';document.body.appendChild(o)}
  var why=L.k==='soon'?'老師設定 <b>'+scTkT(L.from)+'</b> 才開放':L.k==='end'?'已經截止了（'+scTkT(L.to)+'）':'老師現在指定的不是這一個';
  var a=scTkAct();
  o.innerHTML='<div class="sctkb"><div class="sctki">🔒</div><div class="sctkw">'+why+'</div>'+(a.length?'<div class="sctks">老師現在指定的是：</div>'+a.map(scTkLine).join(''):'')+
   '<button id="sctkOk">👌 知道了</button></div>';o.classList.add('on')}
/* ══〔🔒 開關〕（2026-10-12 D 第 7 件，使用者 D16 A、D6 第 13 題、D8 ⑦）：老師鎖住的在家複習主題（只管在家複習網站 SCSRC home）══
   代號 ＝ g年級rv_主題（u1-t0-0 句型卡分頁、gm-g3 遊戲、mo-parts 補充頁）；鎖住的連任務也打不開
   沒登入（或 👀 先練習）＋任何一班鎖住 ＝「🔒 請先登入〔🔑 登入〕」；登入了＋自己的班鎖住 ＝「🔒 還沒開放」。**不寫鎖了哪幾班**（學生才不會假裝別班）
   沒網路 ＝ 用這台平板上一次拿到的；從來沒拿到 ＝ 全部開放 */
var SCLKANY=null,SCLKPAGE=window.SCLKPAGE||'';
function scLkG(){return SCG||scGr()}
function scLkOf(k){if(!SCON||SCSRC!=='home'||!k)return '';var K='g'+scLkG()+'rv_'+k;
  if(scLive()){var t=scTkGet();return t&&t.locks&&t.locks.indexOf(K)>=0?'no':''}
  var a=SCLKANY||scGet('lk_any_g'+scLkG())||[];return a.indexOf(K)>=0?'login':''}
function scLkLoad(cb){if(!SCON||SCSRC!=='home'){if(cb)cb();return}
  if(scLive()){scTkLoad(cb);return}
  var g=scLkG();if(!g){if(cb)cb();return}
  scFetch('a=locks&g='+g,null,6000).then(function(j){if(j&&j.ok){SCLKANY=j.any||[];scPut('lk_any_g'+g,SCLKANY)}if(cb)cb()},function(){if(cb)cb()})}
/* 句型卡的分頁代號（在家複習的 u1.html／u2.html） */
function scLkTab(t,l){var u=/(u\d)\.html/.exec(location.pathname);if(!u||typeof TABM==='undefined'||!TABM[t])return '';return u[1]+'-t'+t+(TABM[t].sub?'-'+(l||0):'')}
/* 一整頁大字：🔒 請先登入〔🔑 登入〕／🔒 還沒開放（〔⬅ 回首頁〕） */
var SCLKRETRY=null;
function scLkShow(st,retry){SCLKRETRY=retry||null;var home=SCHOMEP&&!SCLKPAGE;
  scFull('sclk','<div class="sfic">🔒</div><div class="sf1">'+(st==='login'?'請先登入':'還沒開放')+'</div><div class="sfbt">'+
    (st==='login'?'<button class="scK" id="scLkIn">🔑 登入</button>':'')+(home?'<button class="scN" id="scLkX">👌 知道了</button>':'<button class="scN" id="scLkHome">⬅ 回首頁</button>')+'</div>')}
function scLkGate(k,retry){var st=scLkOf(k);if(!st){scFullOff('sclk');return true}scLkShow(st,retry);return false}
/* 鎖住的主題按了也打得開以前：先換成一個蓋滿整頁的登入畫面，登入好了再試一次 */
function scLkLogin(){var o=SCH,ov=function(){var x=document.getElementById('scov');if(!x){x=document.createElement('div');x.id='scov';x.innerHTML='<div id="scovb"></div>';document.body.appendChild(x)}return x},
  fin=function(go){if(SCH&&SCH.close)SCH.close();SCH=o;if(go)scLkLoad(function(){var r=SCLKRETRY;if(r)r();scLkRe()});else{var r=SCLKRETRY;if(r)r()}};
  scFullOff('sclk');
  SCH={on:function(){return ov().classList.contains('on')},open:function(){ov().classList.add('on')},close:function(){ov().classList.remove('on')},box:function(){return document.getElementById('scovb')},
    back:'<div class="scnav"><button data-sca="close">⬅ 回去</button></div>',key:function(){return ''},name:function(){return ''},reopen:function(){fin(1)},act:function(){fin(0)},btns:function(){return ''},miss:function(){return ''}};
  scLogin(function(){fin(1)})}
/* 首頁的主題、遊戲大廳的遊戲卡：鎖住的貼上 🔒；現在這一頁（句型卡分頁、補充頁）鎖住了 ＝ 蓋上一整頁 */
function scLkRe(){if(!SCON||SCSRC!=='home')return;
  $$('[data-lk]').forEach(function(a){var k=a.getAttribute('data-lk').replace(/^g\drv_/,''),st=scLkOf(k),x=a.querySelector('.sclkb');if(x)x.parentNode.removeChild(x);
    a.classList.toggle('sclocked',!!st);if(st){x=document.createElement('span');x.className='sclkb';x.textContent=st==='login'?'🔒 請先登入':'🔒 還沒開放';a.appendChild(x)}});
  $$('#grid .gcard[data-g]').forEach(function(c){var st=scLkOf('gm-'+c.getAttribute('data-g')),x=c.querySelector('.sclkb');if(x)x.parentNode.removeChild(x);
    c.classList.toggle('sclocked',!!st);if(st){x=document.createElement('span');x.className='sclkb';x.textContent=st==='login'?'🔒 請先登入':'🔒 還沒開放';c.appendChild(x)}});
  if(SCLKPAGE){scLkGate(SCLKPAGE,null);return}
  if(typeof TCUR!=='undefined'&&scLkTab(TCUR,typeof LCUR!=='undefined'?LCUR:0)){var t=TCUR,l=typeof LCUR!=='undefined'?LCUR:0;scLkGate(scLkTab(t,l),function(){setDeck(t,l)})}}
if(SCON&&SCSRC==='home'){
  document.addEventListener('DOMContentLoaded',function(){scLkRe();scLkLoad(scLkRe)});
  if(document.readyState!=='loading')setTimeout(function(){scLkRe();scLkLoad(scLkRe)},0);
  setInterval(function(){scLkLoad(scLkRe)},120000);
  document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},a;
    if(c('#scLkIn')){scLkLogin();return}
    if(c('#scLkHome')){location.href=window.SCLKHOME||'index.html';return}
    if(c('#scLkX')){scFullOff('sclk');return}
    if((a=c('a[data-lk]'))){var k=a.getAttribute('data-lk').replace(/^g\drv_/,''),href=a.getAttribute('href');
      if(!scLkGate(k,function(){location.href=href})){e.preventDefault();e.stopPropagation()}}},true);
}
/* 打開網頁就拿一次；之後每 2 分鐘再拿（老師隨時會改時間）、每 30 秒重畫（時間到了就鎖） */
if(SCON){setTimeout(function(){if(scLive())scTkLoad(function(){if(SCH&&SCH.tk)SCH.tk()})},400);
  setInterval(function(){if(scLive())scTkLoad(function(){if(SCH&&SCH.tk)SCH.tk()})},120000);
  setInterval(function(){if(SCH&&SCH.tk&&scLive())SCH.tk()},30000)}
function scTkGo(key,fn){if(scTkOk(key)){fn();return true}scLockShow(scLockOf(key));return false}
/* 遊戲大廳：被指定的放最前面、會發亮；沒被指定的變灰 🔒（D）；上面一條老師的任務（E7） */
function scTkPaint(cards,keyOf,bar){
  [].forEach.call(cards,function(c){var L=scLockOf(keyOf(c.getAttribute('data-g'))),x=c.querySelector('.sctkc');if(x)x.parentNode.removeChild(x);
    c.classList.toggle('tkon',L.k==='open');c.classList.toggle('tklock',L.k!=='open'&&L.k!=='free');
    if(L.k!=='free'){x=document.createElement('span');x.className='sctkc '+L.k;x.textContent=scLockTxt(L);c.appendChild(x)}});
  [].filter.call(cards,function(c){return c.classList.contains('tkon')}).reverse().forEach(function(c){c.parentNode.insertBefore(c,c.parentNode.firstChild)});
  if(bar)bar.innerHTML=scTaskBar()}
document.addEventListener('click',function(e){
  var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#sctkOk')){document.getElementById('sctk').classList.remove('on');return}
  if(c('#scSwap')||c('#scBye')){if(!SCH)return;scOut();scLogin(SCH.reopen);return}   /* 一鍵登出、原地馬上登入（D 第 6 件 ④） */
  if(!scOn())return;
  if((b=c('.sckey button'))){scKeyPress(b.getAttribute('data-k'));return}
  if(c('#scGc')){scKeyPress('c');return}if(c('#scGs')&&SCTYPED.length>3){scKeyPress('s');return}
  if(c('#scGuest')){SCGUEST=true;var a=SCLOGAFTER;SCLOGAFTER=null;if(a)a();return}
  if((b=c('[data-sca]'))){if(SCH.act)SCH.act(b.getAttribute('data-sca'));return}
  if(!SCEND||!c('#scn'))return;
  if(c('#scSkip')){scGo(SCEND.list.length-1);return}
  if(c('#scNx')){scNext();return}
  var nm=SCEND.list[SCEND.k];if((nm==='acc'||nm==='mem')&&!c('button'))scNext();
});
/* ══ 學生登入（2026-10-12 D 第 6 件；使用者 D6 第 10～12 題 A、D7、D8 定案：1A 2A 3A）══
   ① 打開網站的第一頁問一次（整頁大字）「請問 這是您嗎？30412〔✅ 是，繼續〕〔👋 不是，登出〕」（這個分頁記住，換頁不再問）
   ② 首頁最上面一條橫幅（不蓋住）：沒登入「👤 還沒登入〔🔑 登入〕」；登入了「請問 這是您嗎？30412〔✅ 是〕〔👋 不是，登出〕」，按 ✅ 以後「👤 30412〔👋 登出〕」
   ③ 3 分鐘沒有動作（學校、在家都一樣，D15 A）就登出；最後 30 秒大字提醒「⏳ 30 秒後自動登出〔👆 我還在〕」（不寫「請問 您還在嗎？」）；
      時間到「👋 已經登出了／3 分鐘沒有動作〔🔑 登入〕」。作答中、遊戲中一直在點 ＝ 有動作，不會被登出
   ④ 每一個題目、遊戲做完：「👋 做完了，記得登出／下一個人才不會用到您的號碼〔👋 登出〕」；登出一律 👋（不用 🚪）
   「最後一次動作」存在這台平板（score_act），每一頁都看同一個時間；登出 ＝ 三、四年級的號碼都清掉 */
var SCIDLE=180000,SCWARN=30000,SCHOMEP=false,SCIT=null;
function scOk(){try{sessionStorage.setItem('sc_ok',String(SCID||''))}catch(e){}}
function scAsked(){try{return sessionStorage.getItem('sc_ok')===String(SCID||'')}catch(e){return true}}
function scAct(){scPut('act',Date.now())}
function scOut(){SCID=null;SCGUEST=false;['id_g3','id_g4','last'].forEach(function(k){scPut(k,null)});try{sessionStorage.removeItem('sc_ok')}catch(e){}
  SCTK=null;SCTKID=null;scIdleHide();scBar();if(SCSRC==='home')setTimeout(scLkRe,0);var m=document.getElementById('scme');if(m&&typeof scMeHTML==='function'&&m.innerHTML)m.innerHTML=scMeHTML()}
/* 🦸 這一次拿到的經驗值、金幣（2026-10-17 第八次；規則 score/_calc.js rpEarn）：英雄＋寵物、經驗值條往上長、升級、金幣、〔🦸 我的 英雄〕 */
var SCRPB=(function(){var s=document.querySelector('script[src$="score/url.js"]');return s?s.getAttribute('src').replace(/score\/url\.js$/,''):'../'})();
/* 2026-10-18 第十次（老師：🦸 圖示太幼稚 ➜ 換成老師的封面照片；「我的英雄」➜「戰神之路」）：小圖示 ＝ rpg/cover_icon.webp（兩張臉並排，rpg/_cover.py） */
function scCovI(){return '<img class="scCov" src="'+SCRPB+'rpg/cover_icon.webp" alt="" aria-hidden="true">'}
function scHeroHTML(G){var D=function(id){return rwSrc(SCRPB,id)},S=G.s||{};if(G.h&&S.fx)setTimeout(function(){rwFx(SCRPB,S.fx)},900);   /* 2026-10-18：🏪 商城寶物、💥 必殺武功特效（做完一次 演一次） */
  var a=Math.max(0,G.xp-G.gx),p0=G.lv>G.lv0?0:Math.max(0,(a-G.lvAt)/(G.lvNext-G.lvAt)*100),p1=Math.min(100,(G.xp-G.lvAt)/(G.lvNext-G.lvAt)*100);
  /* 2026-10-20 第十四次 老師：武器、寵物真的能打怪 ➜ 答對幾題 ＝ 打幾下（伺服器算好的 G.f，score/_calc.js rpFight）；賺到金幣 ➜ 金幣飛進去、數字一個一個加 */
  var F=G.h&&G.f&&G.f.hits?G.f:null;
  if(F)return '<div class="sct">'+scCovI()+'這一次 你拿到</div><div class="schero"><div class="shar" id="shFight"><div class="shimg rw-host fxh">'+rwBack(SCRPB,S)+'<img src="'+D(G.h)+'" alt="我的戰士">'+rwFront(SCRPB,S)+'</div>'+
    (G.p?'<img class="fxp" src="'+D(G.p)+'" alt="我的寵物">':'')+'</div>'+
    '<div class="shst"><div class="shfl">⚔ 答對 <b>'+F.hits+'</b> 題 ＝ 打 <b>'+F.hits+'</b> 下<br>一下 💥 <b>'+F.d+'</b>'+(F.pd?'（🐾 ＋'+F.pd+'）':'')+'</div>'+scHeroSt(G,p0,p1)+'</div></div>';
  return '<div class="sct">'+scCovI()+'這一次 你拿到</div><div class="schero"><div class="shimg rw-host">'+(G.h?rwBack(SCRPB,S)+'<img src="'+D(G.h)+'" alt="我的戰神">'+rwFront(SCRPB,S)+(G.p?'<img class="shp" src="'+D(G.p)+'" alt="我的寵物">':''):'<div class="shno">'+scCovI()+'<br>還沒有 戰士</div>')+'</div>'+
    '<div class="shst">'+scHeroSt(G,p0,p1)+'</div></div>'}
function scHeroSt(G,p0,p1){return '<div class="shx">⭐ 經驗值 <b>＋'+G.gx+'</b></div><div class="shbar"><i style="width:'+p0.toFixed(1)+'%" data-w="'+p1.toFixed(1)+'"></i></div>'+
    '<div class="shlv">'+(G.lv>G.lv0?'🎉 升級了！ Lv '+G.lv0+' ➜ <b>Lv '+G.lv+'</b>':'Lv '+G.lv+'（再 '+(G.lvNext-G.xp)+' 升級）')+'</div>'+
    '<div class="shc" id="shCoin">🪙 金幣 <b id="shGc">＋'+(G.gc>0?0:G.gc)+'</b><small>（共 <span id="shTot">'+(G.gc>0?G.coins-G.gc:G.coins)+'</span>）</small></div>'+
    '<a class="shgo" role="button" tabindex="0" data-rpg="1">'+(G.h?scCovI()+'戰神之路 ➜':'🎁 免費 選 1 個 戰士 ➜')+'</a>'}
/* 畫好以後才演：金幣飛進去（從 戰士／怪物 那邊）、打怪；回傳要演幾毫秒 */
function scHeroMs(G){var F=G.h&&G.f&&G.f.hits?G.f:null;return F?600+Math.min(F.hits,6)*1350+(F.kill||[]).length*900+1800:0}
function scHeroGo(G){var F=G.h&&G.f&&G.f.hits?G.f:null,box=document.getElementById('shFight'),w=G.w,id=SCID;
  var coin=function(){var to=document.getElementById('shGc'),fr=box||document.querySelector('.schero .shimg');if(!to||!(G.gc>0))return;var tot=document.getElementById('shTot'),t0=G.coins-G.gc;
    if(typeof RPFX==='undefined'){to.textContent='＋'+G.gc;if(tot)tot.textContent=G.coins;return}
    RPFX.coins(fr,to,G.gc,function(v){to.textContent='＋'+v;if(tot)tot.textContent=t0+v},0)};
  /* 2026-10-20 第十六次（老師第 1～3 點）：在家 練習 做完 的 最後一幕 ＝ 3D 打怪 場地（鏡頭 慢慢 轉、卡片 反光、命中 立體 爆炸）；眨眼、音效 拿掉；rpg/life.js 要用 才 載入 */
  var H=SCSRC==='home'&&!window.SCLIVE,go=function(){if(H&&window.RPLIFE&&RPLIFE.mini&&box)RPLIFE.mini(box);
    if(F&&box&&typeof RPFX!=='undefined')RPFX.fight(box,F,{base:SCRPB,w:w,p:G.p,id:id,done:coin,hook:H?function(x){if(!window.RPLIFE||!RPLIFE.burst)return;setTimeout(function(){var mo=box.querySelector('.fxmon .fxmi')||box.querySelector('.fxmon');if(mo)RPLIFE.burst(box,{at:mo,e:x.e,tier:x.tier,crit:x.crit})},x.hit)}:null});else setTimeout(coin,500)};
  if(H)scLifeLoad(go);else go()}
function scLifeLoad(cb){if(window.RPLIFE){cb();return}var done=false,f=function(){if(done)return;done=true;cb()};
  if(!document.getElementById('scLifeCss')){var l=document.createElement('link');l.id='scLifeCss';l.rel='stylesheet';l.href=SCRPB+'rpg/life.css';document.head.appendChild(l)}
  var s=document.createElement('script');s.src=SCRPB+'rpg/life.js';s.onload=f;s.onerror=f;document.head.appendChild(s);setTimeout(f,2500)}
function scByeHTML(){return '<div class="scbye"><span>👋 做完了，記得登出<small>下一個人才不會用到您的號碼</small></span><button id="scBye">👋 登出</button></div>'}
/* 蓋滿整頁的大字（這是您嗎、30 秒提醒、已經登出了） */
function scFull(id,h){var o=document.getElementById(id);if(!o){o=document.createElement('div');o.id=id;o.className='scfull';document.body.appendChild(o)}o.innerHTML='<div class="scfb">'+h+'</div>';o.classList.add('on');return o}
function scFullOff(id){var o=document.getElementById(id);if(o)o.classList.remove('on')}
function scAskWho(){if(!SCON||!SCID||SCGUEST||scAsked())return;
  scFull('scwho','<div class="sf1">請問 這是您嗎？</div><div class="sfid">'+SCID+'</div><div class="sfbt"><button class="scY" id="scWhoY">✅ 是，繼續</button><button class="scN" id="scWhoN">👋 不是，登出</button></div>')}
function scIdleHide(){scFullOff('scidle')}
function scIdleTick(){if(!SCON||!SCID||SCGUEST||window.SCLIVE){   /* ⚡ 現場任務：看 大螢幕 很久 不碰 平板，不可以 被 登出（2026-10-19 第十三次 3(5)） */scIdleHide();return}
  var a=scGet('act'),left=a?SCIDLE-(Date.now()-a):SCIDLE;if(!a){scAct();return}
  if(left<=0){scOut();scFull('scbye2','<div class="sfic">👋</div><div class="sf1">已經登出了</div><div class="sf3">3 分鐘沒有動作</div><div class="sfbt"><button class="scK" id="scByeIn">🔑 登入</button></div>');return}
  if(left<=SCWARN){var o=document.getElementById('scidle');if(!o||!o.classList.contains('on'))scFull('scidle','<div class="sfic">⏳</div><div class="sf2"><b id="scIdleN">30</b> 秒後自動登出</div><div class="sfbt"><button class="scY" id="scStay">👆 我還在</button></div>');
    var n=document.getElementById('scIdleN');if(n)n.textContent=Math.max(1,Math.ceil(left/1000))}
  else scIdleHide()}
/* ══ 👀 看字卡、按 🔊 聽，也算練習時間（2026-10-15 D 第 8 件，老師 D12 ②：句型卡、Review 1 頁、在家複習的每一頁）══
   登入才記；兩次點（點、打字、捲動）之間最多算 2 分鐘（一張卡停超過 2 分鐘只算 2 分鐘）；超過 3 分鐘沒點 ＝ 那一段不算（也會被登出）；
   換到別的分頁不算；作答中（📝 複習題、📝 複習蓋在上面）不算（作答的秒數另外記）。存成一筆 m:'v'（代號 g年級v_區域），跟成績一起送 */
var SCVW=null,SCVMAX=120000;
function scViewOn(a,nm){if(!SCON||SCVW)return;SCVW={a:a,nm:nm||'👀 看字卡',last:0,acc:0,id:null,busy:false};
  ['pointerdown','keydown','wheel','touchstart'].forEach(function(e){document.addEventListener(e,scVwAct,{passive:true,capture:true})});
  window.addEventListener('scroll',scVwAct,{passive:true});
  document.addEventListener('visibilitychange',function(){scVwAct();if(document.hidden)scVwSave()});
  window.addEventListener('pagehide',function(){scVwAct();scVwSave()});
  setInterval(function(){if(SCVW.acc>=300000)scVwSave()},30000)}   /* 5 分鐘存一筆 */
function scVwAct(){var V=SCVW,n=Date.now();if(!V)return;
  var live=scLive()&&!document.hidden,busy=scOn()||!!document.querySelector('.scfull.on');
  if(V.id&&V.id!==SCID)scVwSave();
  if(live&&V.last&&!V.busy&&!busy&&V.id===SCID){var g=n-V.last;if(g<=SCIDLE)V.acc+=Math.min(g,SCVMAX)}
  V.last=live?n:0;V.busy=busy;if(live)V.id=SCID}
function scVwSave(){var V=SCVW;if(!V||!V.id)return;var sec=Math.round(V.acc/1000),id=V.id;V.acc=0;if(V.id!==SCID)V.id=null;if(sec<1)return;
  var QQ=scGet('q')||[];QQ.push({id:id,set:'g'+String(id).charAt(0)+'v_'+V.a,name:V.nm,m:'v',qs:[],sec:Math.min(3600,sec),src:SCSRC,dev:SCDEV,
    u:id+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now()});scPut('q',QQ.slice(-200));scFlush()}
/* ══ 🎧 聽完字卡（2026-10-16 老師 C4 第 6 題 A、6-2 A、C5「1 乙」：算進 📅 練習）══
   只有在家複習（SCSRC home）、登入（不是 👀 先練習）才記。頁面在「一張卡的單字和句子從頭到尾唸完」時呼叫 scHeard(站, 第幾張, 這一站幾張, 名字)；
   一站每一張都聽完 ＝ 送一筆 m:'l'（代號 g年級l_站）＝ 練習次數 ＋1、那一天算練了 1 天（同一站一天最多 3 次由 _calc.js 的 CAP 管）。
   聽完哪幾張記在這台平板（score_hd：哪一天、誰、每一站），換一天、換一個人就重來；送出以後那一站重來（再聽完一輪才再 ＋1） */
function scHeard(st,k,n,nm){if(!SCON||!SCID||SCGUEST||SCSRC!=='home'||!(n>0)||!/^[\w-]{1,16}$/.test(st))return;
  var d=Math.floor((Date.now()+288e5)/864e5),H=scGet('hd');if(!H||H.d!==d||H.id!==SCID||!H.s)H={d:d,id:SCID,s:{}};
  var a=H.s[st]=H.s[st]||[];if(a.indexOf(k)<0)a.push(k);
  if(a.length>=n){H.s[st]=[];var QQ=scGet('q')||[];QQ.push({id:SCID,set:'g'+String(SCID).charAt(0)+'l_'+st,name:nm||'🎧 聽完字卡',m:'l',qs:[],sec:0,src:SCSRC,dev:SCDEV,
    u:SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now()});scPut('q',QQ.slice(-200));scFlush()}
  scPut('hd',H)}
/* 首頁的橫幅（只有首頁有 #scbar） */
function scBar(){var b=document.getElementById('scbar');if(!b)return;document.body.classList.toggle('scq',!!(SCON&&SCID&&!scAsked()));document.body.classList.toggle('scin',!!(SCON&&SCID));   /* scin ＝ 有 學生 登入（總首頁：不放 老師 的〔⚡ 開 現場任務 大螢幕〕，2026-10-18 第十二次） */
  if(!SCON){b.innerHTML='';b.hidden=true;return}b.hidden=false;
  /* 在家複習首頁：大大的兩個好習慣（2026-10-17 C8 另 6） */
  var hab=SCSRC==='home'&&!b.classList.contains('inl');b.classList.toggle('hab',hab);b.classList.toggle('in',hab&&!!SCID);
  if(hab){b.innerHTML=!SCID?'<span class="hh">👋 開始練習 以前</span><span class="hgo"><button class="scK" id="scBarIn">🔑 先 登入</button><span class="hf">👆</span></span>'+
    '<div class="hs"><div class="hst"><span class="hn">①</span><span>先 <b>🔑 登入</b> ➜ 你的 練習 和 努力 <span class="hfl"><i>📝</i><em>➜</em><i>📊</i></span> 都會 記在 老師 的 成績 裡</span></div>'+
    '<div class="hst"><span class="hn">②</span><span>練完 ➜ 一定 按 <b>👋 登出</b> ➜ <span class="hfl"><i>🛡</i></span> 保護 自己 和 同學 的 成績</span></div></div>':
    scAsked()?'<span class="hok">✅ <b>'+SCID+'</b> 已經登入：練習 都會 記下來 📊<small>練完 一定 按 👋 登出</small></span>'+scHeroA()+'<button class="scN" id="scBarOut">👋 登出</button>':
    '<span>請問 這是您嗎？<b>'+SCID+'</b></span><button class="scY" id="scBarY">✅ 是</button><button class="scN" id="scBarOut">👋 不是，登出</button>';return}
  b.innerHTML=!SCID?'<span>👤 還沒登入</span><button class="scK" id="scBarIn">🔑 登入</button>':
    scAsked()?'<span>👤 <b>'+SCID+'</b></span>'+scHeroA()+'<button class="scN" id="scBarOut">👋 登出</button>':
    '<span>請問 這是您嗎？<b>'+SCID+'</b></span><button class="scY" id="scBarY">✅ 是</button><button class="scN" id="scBarOut">👋 不是，登出</button>'}
/* 登入以後橫幅上〔🦸 我的英雄〕（2026-10-17 第八次）；在〔🦸 我的英雄〕那一頁、總首頁（一行的小橫幅，量過放了會多出捲軸）不放 */
function scHeroA(){var b=document.getElementById('scbar');return window.SCLIVE||location.pathname.indexOf('/rpg/')>=0||(b&&b.classList.contains('inl'))?'':'<a class="scH" role="button" tabindex="0" data-rpg="1">'+scCovI()+'戰神之路</a>'}
/* 連結用點的（不寫 href：在家複習 r1/ 的複製程式會把 href 換路徑） */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-rpg]');if(a){e.preventDefault();location.href=SCRPB+'rpg/index.html'}});
function scHomeLogin(){if(!SCH)return;scFullOff('scbye2');scLogin(SCH.reopen)}
if(SCON){
  (function(){var a=scGet('act');if(SCID&&a&&!window.SCLIVE&&Date.now()-a>=SCIDLE)scOut()})();   /* 上一次動作已經超過 3 分鐘 ＝ 已經登出了 */
  ['pointerdown','keydown','touchstart','wheel'].forEach(function(k){document.addEventListener(k,function(e){
    if(SCID&&!SCGUEST&&!(e.target&&e.target.closest&&e.target.closest('#scbye2')))scAct()},true)});
  SCIT=setInterval(scIdleTick,1000);
  window.addEventListener('storage',function(e){if(e.key==='score_last'&&!e.newValue&&SCID){SCID=null;scBar()}});
  document.addEventListener('DOMContentLoaded',function(){scBar();scAskWho()});
  if(document.readyState!=='loading')setTimeout(function(){scBar();scAskWho()},0);
}
document.addEventListener('click',function(e){
  var t=e.target,c=function(s){return t.closest?t.closest(s):null};
  if(c('#scWhoY')){scOk();scAct();scFullOff('scwho');scBar();return}
  if(c('#scWhoN')){scOut();scFullOff('scwho');if(SCHOMEP)scHomeLogin();return}
  if(c('#scStay')){scAct();scIdleHide();return}
  if(c('#scByeIn')){scFullOff('scbye2');if(SCHOMEP)scHomeLogin();return}
  if(c('#scBarIn')){scHomeLogin();return}
  if(c('#scBarY')){scOk();scAct();scBar();return}
  if(c('#scBarOut')){scOut();return}
});
document.addEventListener('keydown',function(e){if(!$('#scBox'))return;
  if(/^\d$/.test(e.key))scKeyPress(e.key);else if(e.key==='Backspace')scKeyPress('b');else if(e.key==='Enter')scKeyPress('ok')});

SCHOMEP=true;
function hOv(){var o=document.getElementById('scov');if(!o){o=document.createElement('div');o.id='scov';o.innerHTML='<div id="scovb"></div>';document.body.appendChild(o)}return o}
SCH={on:function(){return hOv().classList.contains('on')},open:function(){hOv().classList.add('on')},close:function(){hOv().classList.remove('on')},box:function(){return document.getElementById('scovb')},
 back:'<div class="scnav"><button data-sca="close">⬅ 回首頁</button></div>',key:function(){return ''},name:function(){return ''},reopen:function(){SCH.close();scBar()},act:function(){SCH.close()},btns:function(){return ''},miss:function(){return ''}};
