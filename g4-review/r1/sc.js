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
    var pg=p.prog!=null&&p.prog>0?'<span class="gup">⬆ '+f1(p.prog)+'</span>':p.keep?'<span class="gup">🔥 滿分</span>':'';
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

/* ══════════ 成績紀錄（2026-10-07 對話 C；2026-10-08 對話 D：遊戲、Review 1 也記）══════════
   SCG ＝ 這一頁是幾年級（0 ＝ 三、四年級共用的 Review 1 遊戲：年級看登入的 5 碼）
   SCH ＝ 這一頁怎麼畫（下面那一段由 _tq.js／遊戲引擎／Review 1 複習各自給）：
     on() 畫面開著嗎、open() 打開、box() 畫在哪、back 回去的按鈕、key() 題組代號、name() 題組名稱、
     reopen() 換人以後回哪裡、rk() 作答中名次、btns(E) 最後一幕的按鈕、miss() 答錯整理的標題、act(a) data-sca 按鈕 */
var SCG=4,SCSRC="home";
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
  SCH.box().innerHTML='<div class="sclog"><h2>🔢 先登入，成績才會記下來</h2>'+
   '<div class="scsteps"><span id="scSt1">① 🏫 打班級</span><b>➜</b><span id="scSt2">② 🪑 打座號</span><b>➜</b><span id="scSt3">③ ✅ 按綠色勾勾</span></div>'+
   '<div class="scl"><div class="scbox" id="scBox"><div class="scg c" id="scGc"><span class="lb">🏫 班級</span><div class="cells">'+box(3,'c')+'</div></div>'+
   '<div class="scg s" id="scGs"><span class="lb">🪑 座號</span><div class="cells">'+box(2,'s')+'</div></div></div>'+
   '<div class="scmsg" id="scMsg"></div></div>'+
   '<div class="sckey">'+[1,2,3,4,5,6,7,8,9].map(function(n){return '<button data-k="'+n+'">'+n+'</button>'}).join('')+
   '<button class="bs" data-k="b" aria-label="刪掉">⌫</button><button data-k="0">0</button><button class="okb" data-k="ok" aria-label="確定">✅</button></div>'+
   (SCSRC==='home'?'<button id="scGuest">👀 先練習，不記成績</button>':'')+SCH.back+'</div>';
  scPaint();
}
var SCLOGAFTER=null;
function scPaint(err){
  var v=SCTYPED;if(!$('#scBox'))return;
  $$('#scBox i').forEach(function(c,n){var d=v.charAt(n);if(c.textContent!==d&&d){c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}
    c.textContent=d;c.classList.toggle('f',!!d);c.classList.toggle('cur',n===v.length)});
  var st=v.length<3?1:v.length<5?2:3;
  [1,2,3].forEach(function(k){var s=$('#scSt'+k);s.classList.toggle('now',k===st);s.classList.toggle('done',k<st)});
  $('#scGc').classList.toggle('now',st===1);$('#scGs').classList.toggle('now',st===2);
  $('.sckey .okb').classList.toggle('ready',v.length===5);
  var m=$('#scMsg');
  if(err){m.className='scmsg err';m.innerHTML=err;return}
  m.className='scmsg';
  m.innerHTML=v.length===0?'👆 先打你的<b class="kc">班級</b>（3 個數字）<small>例：304 班 5 號 ➜ 打 3 0 4 0 5</small>':
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
var SCLIST={q:['acc','time','care','honor','end'],g:['acc','time','care','honor','gtop'],mem:['mem','time','care','honor']};
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
function scTimeHTML(E){var V=E.res,me=V&&V.me,up=scUps(E).length;
  if(scFast(E))return '<div class="sctime"><div class="stic">⚠️</div><div class="st1">太快亂按，不算時間</div><div class="st2">請 看完、聽完再選</div></div>';
  var more=me&&!up?Math.round((me.sec-(me.secPrev||0))/60):0;
  return '<div class="sctime"><div class="stic">'+HON.CLK+'</div>'+
    (!up&&E.acc!=null?'<div class="st2">🎯 正確率 '+E.acc+' 分</div>':'')+
    (me?'<div class="st1">這週你已經練習 '+scMin(me.sec)+'</div>':'')+
    '<div class="st3">這一次 練習 '+scMin(E.me1)+'。</div>'+
    (more>0?'<div class="st3">比上週多 練習 '+more+' 分鐘。</div>':'')+
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
      if(!E.ups.length&&E.tgo){var hi=L.indexOf('honor');if(hi>k)L.splice(hi,1);last=k===L.length-1;dots=L.length>1?'<div class="scdots">'+L.map(function(x,n){return '<i'+(n===k?' class="on"':'')+'></i>'}).join('')+'</div>':''}
      h=scTimeHTML(E)+(last?SCH.btns(E):nav());if(!last&&E.tgo)SCAUTO=setTimeout(scNext,4200)}   /* 還在送就等（送到或確定沒網路會再畫一次） */
  }else if(nm==='care'){
    if(!scCareOf(E)){L.splice(k,1);E.k=Math.min(k,L.length-1);scScene();return}   /* 沒有網路、伺服器還沒回 ＝ 不演 */
    /* 2026-10-16 C4 第 3-2 題 A：學生平板也看成績卡（🎯 正確、📅 練習；沒有姓名、沒有〔📋 細節〕），下面接 📅 練習 動畫 */
    var ME=E.res.me;h=HON.card({acc:ME.acc,prog:ME.prog,keep:ME.keep},ME.care,{notip:1})+'<div id="scCare"></div>'+(last?SCH.btns(E):nav());
    if(!last)SCAUTO=setTimeout(scNext,7600);
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
  if(nm==='care'&&$('#scCare')){if(E.cst==null)E.cst=HON.cpick('cs');HON.cscene($('#scCare'),E.cst,scCareOf(E),{help:1,onHelp:function(){clearTimeout(SCAUTO)}})}
  if(nm==='time'&&$('.sctime .hclkm'))$('.sctime').classList.add('go');
  if(nm==='acc')setTimeout(function(){var f=$('#scFg'),a=$('#scAcc');if(!f)return;var L=+f.getAttribute('stroke-dasharray');
    f.setAttribute('stroke-dashoffset',L*(1-E.acc/100));var t0=Date.now(),iv=setInterval(function(){var x=Math.min(1,(Date.now()-t0)/1300);
      if(!$('#scAcc')){clearInterval(iv);return}a.textContent=Math.round(E.acc*x)+'%';if(x>=1)clearInterval(iv)},40)},80);
  setTimeout(function(){$$('.scbar .tr i').forEach(function(x){x.style.width=x.getAttribute('data-w')+'%'})},80);
}
function scPodHTML(L,fmt){
  var pod=[1,0,2].map(function(n){var x=L[n];if(!x)return '<div></div>';
    return '<div class="p'+Math.min(x.rk,3)+(x.id===SCID?' me':'')+'"><span class="id">'+x.id+'</span><span class="v">'+fmt(x)+'</span><span class="st">'+(x.rk===1?'🥇':x.rk===2?'🥈':'🥉')+'</span></div>'}).join('');
  var rest=L.slice(3).map(function(x){return '<div'+(x.id===SCID?' class="me"':'')+'><span><em>'+x.rk+'</em> '+x.id+'</span><span>'+fmt(x)+'</span></div>'}).join('');
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
function scByeHTML(){return '<div class="scbye"><span>👋 做完了，記得登出<small>下一個人才不會用到您的號碼</small></span><button id="scBye">👋 登出</button></div>'}
/* 蓋滿整頁的大字（這是您嗎、30 秒提醒、已經登出了） */
function scFull(id,h){var o=document.getElementById(id);if(!o){o=document.createElement('div');o.id=id;o.className='scfull';document.body.appendChild(o)}o.innerHTML='<div class="scfb">'+h+'</div>';o.classList.add('on');return o}
function scFullOff(id){var o=document.getElementById(id);if(o)o.classList.remove('on')}
function scAskWho(){if(!SCON||!SCID||SCGUEST||scAsked())return;
  scFull('scwho','<div class="sf1">請問 這是您嗎？</div><div class="sfid">'+SCID+'</div><div class="sfbt"><button class="scY" id="scWhoY">✅ 是，繼續</button><button class="scN" id="scWhoN">👋 不是，登出</button></div>')}
function scIdleHide(){scFullOff('scidle')}
function scIdleTick(){if(!SCON||!SCID||SCGUEST){scIdleHide();return}
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
function scBar(){var b=document.getElementById('scbar');if(!b)return;document.body.classList.toggle('scq',!!(SCON&&SCID&&!scAsked()));
  if(!SCON){b.innerHTML='';b.hidden=true;return}b.hidden=false;
  /* 在家複習首頁：大大的兩個好習慣（2026-10-17 C8 另 6） */
  var hab=SCSRC==='home'&&!b.classList.contains('inl');b.classList.toggle('hab',hab);b.classList.toggle('in',hab&&!!SCID);
  if(hab){b.innerHTML=!SCID?'<span class="hh">👋 開始練習 以前</span><span class="hgo"><button class="scK" id="scBarIn">🔑 先 登入</button><span class="hf">👆</span></span>'+
    '<div class="hs"><div class="hst"><span class="hn">①</span><span>先 <b>🔑 登入</b> ➜ 你的 練習 和 努力 <span class="hfl"><i>📝</i><em>➜</em><i>📊</i></span> 都會 記在 老師 的 成績 裡</span></div>'+
    '<div class="hst"><span class="hn">②</span><span>練完 ➜ 一定 按 <b>👋 登出</b> ➜ <span class="hfl"><i>🛡</i></span> 保護 自己 和 同學 的 成績</span></div></div>':
    scAsked()?'<span class="hok">✅ <b>'+SCID+'</b> 已經登入：練習 都會 記下來 📊<small>練完 一定 按 👋 登出</small></span><button class="scN" id="scBarOut">👋 登出</button>':
    '<span>請問 這是您嗎？<b>'+SCID+'</b></span><button class="scY" id="scBarY">✅ 是</button><button class="scN" id="scBarOut">👋 不是，登出</button>';return}
  b.innerHTML=!SCID?'<span>👤 還沒登入</span><button class="scK" id="scBarIn">🔑 登入</button>':
    scAsked()?'<span>👤 <b>'+SCID+'</b></span><button class="scN" id="scBarOut">👋 登出</button>':
    '<span>請問 這是您嗎？<b>'+SCID+'</b></span><button class="scY" id="scBarY">✅ 是</button><button class="scN" id="scBarOut">👋 不是，登出</button>'}
function scHomeLogin(){if(!SCH)return;scFullOff('scbye2');scLogin(SCH.reopen)}
if(SCON){
  (function(){var a=scGet('act');if(SCID&&a&&Date.now()-a>=SCIDLE)scOut()})();   /* 上一次動作已經超過 3 分鐘 ＝ 已經登出了 */
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
