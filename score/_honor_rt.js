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
