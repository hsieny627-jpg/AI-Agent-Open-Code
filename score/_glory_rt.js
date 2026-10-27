/* score/_glory_rt.js — 🏆 個人排行榜〔🏆 榮譽榜〕投影（2026-10-22 第二十一次 第 10(3) 點）。只寫 ES5。老師看板 teacher/index.html 用。
 * 老師：每一次不一樣的風格；最尊榮、最震撼、最酷炫的揭開名次＋頒獎；第 10 名到第 4 名「從下往上」一個一個揭開；音效震撼又好聽、每一次都不一樣。
 * 一場 ＝ 6 幕：0 開場 ➜ 1 第 10～4 名（從最下面一格往上翻開）➜ 2 🥉 第 3 名 ➜ 3 🥈 第 2 名 ➜ 4 🥇 第 1 名（最長的鼓聲、全白閃光、三圈衝擊波、皇冠落下、煙火）➜ 5 頒獎台
 * 10 種風格（ST）：背景、粒子、翻開名次的方法、音樂（調性、樂器、節奏）全部不一樣；pick() 洗牌輪流、跟上一次一定不一樣；
 * 同一種風格每一次再隨機移調、換旋律、粒子位置 ➜ 每一次聽起來、看起來都不一樣。
 * 用法：GLORY.pick() ➜ 第幾種；GLORY.scene(舞台, 第幾種, 第幾幕, 資料, 有沒有聲音)；GLORY.stop(舞台)
 * 資料 ＝ {kick:'304 班', aw:'最認真練習', per:'本週', ic:'圖示 html', rows:[{rk,w,v}](第 10～4 名), top:{1:[{w,v,l}],2:[…],3:[…]}}
 * 2026-10-26 第二十七次 第 4-(3) 點（全班獎勵、冠軍寶箱 頒獎典禮 也 用 這一套）：可以 多給 title（開場 大標題）、lab:{1:'練 7 天',…}（取代「第 1 名」）、rows 的 lab（取代「第 N 名」）；
 *   沒給 ＝ 跟 原本 一樣（榮譽榜 不變）。頒獎台 第 1 名 多 一頂 會 發光 的 皇冠（冠軍 寶座）。 */
var GLORY=(function(){
  var RD=function(){return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)};
  /* ── 10 種風格 ── c ＝ 主色、c2 ＝ 第二色、pt ＝ 粒子、rv ＝ 翻開名次的方法、mu ＝ 音樂 */
  var ST=[
    {nm:'黃金殿堂',c:'#FFD54A',c2:'#FFF4C2',pt:'gold',rv:'flip',mu:{root:60,sc:[0,2,4,5,7,9,11],ld:'brass',ch:'strings',pc:'timp',bpm:96}},
    {nm:'星際傳送門',c:'#7FE8FF',c2:'#C79BFF',pt:'warp',rv:'beam',mu:{root:62,sc:[0,2,4,6,7,9,11],ld:'synth',ch:'pad',pc:'kick',bpm:120}},
    {nm:'龍焰',c:'#FF7A2A',c2:'#FFD36B',pt:'ember',rv:'burn',mu:{root:63,sc:[0,2,4,5,7,9,11],ld:'brass',ch:'strings',pc:'taiko',bpm:100}},
    {nm:'雷霆',c:'#9FD8FF',c2:'#FFFFFF',pt:'bolt',rv:'zap',mu:{root:65,sc:[0,2,4,5,7,9,11],ld:'brass',ch:'pad',pc:'timp',bpm:112}},
    {nm:'冰晶',c:'#BDF3FF',c2:'#7FC8FF',pt:'snow',rv:'shat',mu:{root:67,sc:[0,2,4,5,7,9,11],ld:'bell',ch:'pad',pc:'chime',bpm:90}},
    {nm:'皇家加冕',c:'#FF4D6D',c2:'#FFD54A',pt:'conf',rv:'drop',mu:{root:58,sc:[0,2,4,5,7,9,11],ld:'brass',ch:'organ',pc:'timp',bpm:88}},
    {nm:'極光',c:'#6CFFB8',c2:'#A88BFF',pt:'star',rv:'fade',mu:{root:69,sc:[0,2,4,5,7,9,11],ld:'harp',ch:'choir',pc:'chime',bpm:84}},
    {nm:'櫻花',c:'#FF9FD2',c2:'#FFE3F1',pt:'petal',rv:'petal',mu:{root:64,sc:[0,2,4,7,9],ld:'pluck',ch:'pad',pc:'chime',bpm:92}},
    {nm:'霓虹電競',c:'#FF3DF2',c2:'#3DF2FF',pt:'neon',rv:'glitch',mu:{root:57,sc:[0,2,3,5,7,8,10],ld:'synth',ch:'pad',pc:'kick',bpm:128}},
    {nm:'太陽神',c:'#FFB300',c2:'#FF5A1F',pt:'sun',rv:'flare',mu:{root:62,sc:[0,2,4,5,7,9,11],ld:'brass',ch:'choir',pc:'taiko',bpm:96}}];
  function lsg(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
  function lss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  /* 洗牌輪流：10 種輪完才重複，跟上一次一定不一樣 */
  function pick(){var o=lsg('gl_t')||{q:[],last:-1};if(!o.q||!o.q.length){var a=[],i;for(i=0;i<ST.length;i++)a.push(i);
      for(i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}if(a[0]===o.last)a.push(a.shift());o.q=a}
    var n=o.q.shift();o.last=n;lss('gl_t',o);return n}
  function rnd(a,b){return a+Math.random()*(b-a)}

  /* ══ 聲音：網頁自己合成（不用音檔）。主音量 ➜ 壓縮器（不會爆音）＋殘響（像在大禮堂） ══ */
  function AC(){var c=window.HON&&HON.ac?HON.ac():null;if(!c)return null;
    if(!c._gl){var cp=c.createDynamicsCompressor();cp.threshold.value=-16;cp.knee.value=12;cp.ratio.value=5;cp.attack.value=.005;cp.release.value=.25;cp.connect(c.destination);
      var bus=c.createGain();bus.gain.value=.9;bus.connect(cp);
      var n=Math.floor(c.sampleRate*2.6),ir=c.createBuffer(2,n,c.sampleRate);for(var ch=0;ch<2;ch++){var d=ir.getChannelData(ch);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3.2)}
      var cv=c.createConvolver();cv.buffer=ir;var wet=c.createGain();wet.gain.value=.32;bus.connect(cv);cv.connect(wet);wet.connect(cp);c._gl={bus:bus}}
    return c}
  var SND=true,TR=0;
  function hz(m){return 440*Math.pow(2,(m+TR-69)/12)}
  function env(g,t,a,v,d,rel){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.setValueAtTime(v,t+Math.max(a,d-rel));g.gain.exponentialRampToValueAtTime(.0008,t+d)}
  function osc(c,ty,f,t,d,out,det){var o=c.createOscillator();o.type=ty;o.frequency.setValueAtTime(f,t);if(det)o.detune.value=det;o.connect(out);o.start(t);o.stop(t+d+.05);return o}
  function noiseBuf(c){if(!c._nb){var n=c.sampleRate*2,b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);for(var i=0;i<n;i++)x[i]=Math.random()*2-1;c._nb=b}return c._nb}
  function nz(t0,d,v,ty,fq,q,f2){var c=AC();if(!c||!SND)return;var t=c.currentTime+t0,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseBuf(c);s.loop=true;
    f.type=ty||'bandpass';f.frequency.setValueAtTime(fq||1500,t);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t+d);f.Q.value=q||.8;
    g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(f);f.connect(g);g.connect(c._gl.bus);s.start(t);s.stop(t+d+.05)}
  /* 樂器 */
  var INS={
    brass:function(c,t,f,d,v){var g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.Q.value=2;lp.frequency.setValueAtTime(500,t);lp.frequency.linearRampToValueAtTime(3200,t+.08);lp.frequency.exponentialRampToValueAtTime(1300,t+Math.min(d,.6));
      lp.connect(g);g.connect(c._gl.bus);env(g,t,.04,v,d,.18);osc(c,'sawtooth',f,t,d,lp,-7);osc(c,'sawtooth',f,t,d,lp,7);osc(c,'square',f/2,t,d,lp)},
    strings:function(c,t,f,d,v){var g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2200;lp.connect(g);g.connect(c._gl.bus);env(g,t,.18,v*.7,d,.4);
      [-9,0,9].forEach(function(dt){var o=osc(c,'sawtooth',f,t,d,lp,dt),l=c.createOscillator(),lg=c.createGain();l.frequency.value=5.5;lg.gain.value=4;l.connect(lg);lg.connect(o.detune);l.start(t);l.stop(t+d+.05)})},
    pad:function(c,t,f,d,v){var g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(700,t);lp.frequency.linearRampToValueAtTime(2400,t+d*.6);lp.connect(g);g.connect(c._gl.bus);env(g,t,.35,v*.6,d,.5);
      [-12,0,12].forEach(function(dt){osc(c,'sawtooth',f,t,d,lp,dt)});osc(c,'triangle',f*2,t,d,lp)},
    choir:function(c,t,f,d,v){var g=c.createGain();g.connect(c._gl.bus);env(g,t,.4,v*.6,d,.6);
      [[700,8],[1150,9],[2600,10]].forEach(function(F){var bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=F[0];bp.Q.value=F[1];bp.connect(g);[-8,0,8].forEach(function(dt){osc(c,'sawtooth',f,t,d,bp,dt)})})},
    organ:function(c,t,f,d,v){var g=c.createGain();g.connect(c._gl.bus);env(g,t,.05,v*.5,d,.25);[1,2,3,4].forEach(function(h,i){var gg=c.createGain();gg.gain.value=[.6,.35,.18,.12][i];gg.connect(g);osc(c,'sine',f*h,t,d,gg)})},
    bell:function(c,t,f,d,v){[[1,1],[2.76,.45],[5.4,.25],[8.93,.12]].forEach(function(p){var g=c.createGain();g.connect(c._gl.bus);g.gain.setValueAtTime(v*p[1],t);g.gain.exponentialRampToValueAtTime(.0008,t+Math.max(.6,d*2/p[0]));osc(c,'sine',f*p[0],t,Math.max(.6,d*2/p[0]),g)})},
    harp:function(c,t,f,d,v){var g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(5000,t);lp.frequency.exponentialRampToValueAtTime(900,t+1);lp.connect(g);g.connect(c._gl.bus);
      g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+1.6);osc(c,'triangle',f,t,1.6,lp);osc(c,'sine',f*2,t,1.2,lp)},
    pluck:function(c,t,f,d,v){var g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(4200,t);lp.frequency.exponentialRampToValueAtTime(700,t+.5);lp.connect(g);g.connect(c._gl.bus);
      g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+1.1);osc(c,'sawtooth',f,t,1.1,lp);osc(c,'triangle',f*2,t,.8,lp)},
    synth:function(c,t,f,d,v){var g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.Q.value=6;lp.frequency.setValueAtTime(900,t);lp.frequency.exponentialRampToValueAtTime(4800,t+.06);lp.frequency.exponentialRampToValueAtTime(1500,t+Math.min(d,.5));
      lp.connect(g);g.connect(c._gl.bus);env(g,t,.01,v*.8,d,.12);osc(c,'square',f,t,d,lp,-5);osc(c,'sawtooth',f,t,d,lp,5)}};
  var PERC={
    timp:function(c,t,v){var g=c.createGain();g.connect(c._gl.bus);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+1.4);var o=osc(c,'sine',hz(43),t,1.4,g);o.frequency.exponentialRampToValueAtTime(hz(36),t+.35);nz(t-c.currentTime,.12,v*.5,'lowpass',400)},
    taiko:function(c,t,v){var g=c.createGain();g.connect(c._gl.bus);g.gain.setValueAtTime(v*1.2,t);g.gain.exponentialRampToValueAtTime(.0008,t+.9);var o=osc(c,'sine',140,t,.9,g);o.frequency.exponentialRampToValueAtTime(48,t+.25);nz(t-c.currentTime,.2,v*.6,'lowpass',700)},
    kick:function(c,t,v){var g=c.createGain();g.connect(c._gl.bus);g.gain.setValueAtTime(v*1.2,t);g.gain.exponentialRampToValueAtTime(.0008,t+.5);var o=osc(c,'sine',160,t,.5,g);o.frequency.exponentialRampToValueAtTime(42,t+.14);nz(t-c.currentTime,.05,v*.4,'highpass',3000)},
    chime:function(c,t,v){INS.bell(c,t,hz(96),.6,v*.35);INS.bell(c,t+.07,hz(100),.6,v*.25)}};
  function mus(){return ST[CUR].mu}
  function note(deg,oct){var M=mus(),s=M.sc,n=s.length,o=Math.floor(deg/n);return M.root+12*(oct||0)+s[((deg%n)+n)%n]+12*o}
  function play(ins,t0,deg,dur,v,oct){var c=AC();if(!c||!SND)return;INS[ins](c,c.currentTime+t0,hz(note(deg,oct)),dur,v)}
  function chord(ins,t0,degs,dur,v,oct){degs.forEach(function(d){play(ins,t0,d,dur,v,oct)})}
  function hit(t0,v){var c=AC();if(!c||!SND)return;PERC[mus().pc](c,c.currentTime+t0,v||.5)}
  function crash(t0,v){nz(t0,2.8,v||.22,'highpass',5200);nz(t0,.4,(v||.22)*.8,'bandpass',2600,.6)}
  function roll(t0,d,v){var c=AC();if(!c||!SND)return;var k=mus().pc,step;for(var t=0;t<d;t+=step){step=.11-.07*(t/d);var vv=(v||.3)*(.25+.75*t/d);
      if(k==='timp'||k==='taiko')PERC[k](c,c.currentTime+t0+t,vv*.55);else nz(t0+t,.06,vv*.7,'bandpass',k==='kick'?900:2400,1.2)}
    nz(t0,d,.08,'bandpass',300,.7,5000)}   /* 懸疑的上升風聲 */
  function clap(t0,d){for(var i=0;i<90;i++)nz(t0+Math.random()*d,.06,rnd(.03,.09),'bandpass',rnd(900,2600),1)}
  /* 旋律變化：同一種風格每一次換一個（再加上隨機移調） */
  var MEL=[[0,2,4,7,4,7,9,11,14],[0,4,7,9,7,11,12,14],[4,2,0,4,7,9,7,11,14],[0,7,4,9,7,12,11,14]],MV=0;
  var MSC={
    open:function(){var M=mus(),b=60/M.bpm,m=MEL[MV];hit(0,.6);crash(0,.18);
      m.forEach(function(d,i){play(M.ld,.2+i*b*.5,d,i===m.length-1?b*3:b*.55,.12,0)});
      chord(M.ch,.2,[0,2,4],b*m.length*.5,.07,-1);chord(M.ch,.2+b*m.length*.5,[4,6,8],b*2.5,.07,-1);hit(.2+b*m.length*.5,.5)},
    tick:function(k){var M=mus();play(M.ld,0,k+2,.5,.11,0);play(M.ld==='brass'?'bell':M.ld,0.02,k+9,.6,.06,0);hit(0,.32);nz(0,.25,.05,'highpass',4000)},
    roll:function(d){roll(0,d,.34)},
    stinger:function(r){var M=mus(),b=60/M.bpm,C=r===3?[[3,5,7]]:[[4,6,8],[7,9,11]];hit(0,.7);crash(0,r===3?.16:.2);
      C.forEach(function(cd,i){chord(M.ld,i*b,cd,b*(i===C.length-1?3:1),.09,0);chord(M.ch,i*b,cd,b*3,.06,-1)});play(M.ld,b*C.length,r===3?9:11,b*2,.1,0);clap(.6,2.2)},
    win:function(){var M=mus(),b=60/M.bpm;hit(0,.9);crash(0,.3);nz(0,1.4,.18,'lowpass',180);   /* 第 1 名：全部一起 */
      var P=[[0,2,4],[3,5,7],[4,6,8],[7,9,11]];P.forEach(function(cd,i){var t=i*b*1.5;chord(M.ld,t,cd,b*(i===3?4:1.4),.08,0);chord(M.ch,t,cd,b*(i===3?5:1.5),.06,-1);chord('strings',t,[cd[0]],b*1.5,.05,-2);hit(t,.6)});
      var m=MEL[(MV+1)%MEL.length];m.forEach(function(d,i){play('bell',b*6+i*b*.33,d+7,.8,.07,0)});crash(b*4.5,.24);clap(1,4.5)},
    fin:function(){var M=mus(),b=60/M.bpm;chord(M.ch,0,[0,2,4,7],b*6,.06,-1);[0,4,7,11,14,18,21].forEach(function(d,i){play('harp',i*.12,d,.8,.07,0)});clap(.2,3.2)}};

  /* ══ 畫布粒子 ══ */
  /* 2026-10-27 第三十二次 第 7 點（老師：冠軍寶箱 頒獎 播到 第二名 就 卡住）：教室 電腦 比較 慢 ➜ 粒子 太多，畫面 卡住、下一幕 一直 等不到。
     量 每一格 畫 多久：連續 20 格 超過 34 毫秒 ＝ 輕量 模式（LITE：粒子 最多 350、不 畫 光暈、解析度 1 倍），這一次 打開 網頁 一直 保持 */
  var LITE=0,SLOW=0;
  function Cv(el){var cv=document.createElement('canvas');cv.className='glcv';el.appendChild(cv);var x=cv.getContext('2d'),P=[],W=0,H=0,dpr=LITE?1:Math.min(2,window.devicePixelRatio||1),alive=true,bg=null;
    function rs(){var r=el.getBoundingClientRect();W=r.width;H=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);x.setTransform(dpr,0,0,dpr,0,0)}rs();
    var S={P:P,W:function(){return W},H:function(){return H},bg:function(f){bg=f},stop:function(){alive=false},add:function(p){if(P.length<(LITE?350:1600))P.push(p)}};
    var last=performance.now();
    function fr(now){if(!alive||!cv.isConnected)return;var raw=now-last,dt=Math.min(.05,raw/1000);last=now;if(!LITE){SLOW=raw>34?SLOW+1:Math.max(0,SLOW-1);if(SLOW>=20){LITE=1;dpr=1;rs();if(P.length>350)P.splice(0,P.length-350)}}if(Math.abs(cv.clientWidth-W)>2)rs();x.clearRect(0,0,W,H);if(bg)bg(x,W,H,now/1000,dt);
      x.globalCompositeOperation='lighter';
      for(var i=P.length-1;i>=0;i--){var p=P[i];p.t+=dt;if(p.t>=p.l){P.splice(i,1);continue}var k=p.t/p.l;
        p.vy+=(p.g||0)*dt;p.vx*=(1-(p.dr||0)*dt);p.vy*=(1-(p.dr||0)*dt);p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.sw)p.x+=Math.sin(p.t*p.sw+p.ph)*p.sa*dt;
        var a=(p.fi?Math.min(1,p.t/p.fi):1)*(1-Math.pow(k,p.fo||1.6));x.globalAlpha=Math.max(0,a);
        if(p.k==='ring'){x.strokeStyle=p.c;x.lineWidth=p.w*(1-k)+1;x.beginPath();x.arc(p.x,p.y,p.r0+(p.r1-p.r0)*(1-Math.pow(1-k,2.4)),0,7);x.stroke()}
        else if(p.k==='ray'){var ln=p.len*(.6+.4*Math.sin(p.t*3+p.ph));x.save();x.translate(p.x,p.y);x.rotate(p.a+p.t*p.rv);var gr=x.createLinearGradient(0,0,ln,0);gr.addColorStop(0,p.c);gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.beginPath();x.moveTo(0,0);x.lineTo(ln,-p.w);x.lineTo(ln,p.w);x.closePath();x.fill();x.restore()}
        else if(p.k==='bolt'){x.strokeStyle=p.c;x.lineWidth=p.w*(1-k)+1;x.shadowColor=p.c;x.shadowBlur=LITE?0:18;x.beginPath();x.moveTo(p.pts[0][0],p.pts[0][1]);for(var j=1;j<p.pts.length;j++)x.lineTo(p.pts[j][0],p.pts[j][1]);x.stroke();x.shadowBlur=0}
        else if(p.k==='conf'||p.k==='petal'||p.k==='shard'){x.globalCompositeOperation='source-over';x.save();x.translate(p.x,p.y);x.rotate(p.ro+=p.vr*dt);x.scale(1,Math.abs(Math.cos(p.t*p.fl))+.15);x.fillStyle=p.c;
          if(p.k==='petal'){x.beginPath();x.ellipse(0,0,p.s,p.s*.55,0,0,7);x.fill()}else if(p.k==='shard'){x.beginPath();x.moveTo(0,-p.s);x.lineTo(p.s*.5,p.s*.6);x.lineTo(-p.s*.5,p.s*.4);x.closePath();x.fill()}else x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore();x.globalCompositeOperation='lighter'}
        else if(p.k==='trail'){x.strokeStyle=p.c;x.lineWidth=p.s;x.lineCap='round';x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x-p.vx*.06,p.y-p.vy*.06);x.stroke()}
        else{var s=p.s*(p.gr?1+k*p.gr:1-k*.5),g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,s);g.addColorStop(0,p.c2||'#fff');g.addColorStop(.35,p.c);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,s,0,7);x.fill()}
        if(p.on&&p.t>=p.l-dt*1.5){var f=p.on;p.on=null;f(p)}}
      x.globalAlpha=1;x.globalCompositeOperation='source-over';requestAnimationFrame(fr)}
    requestAnimationFrame(fr);return S}
  function col(i){var s=ST[CUR],L=[s.c,s.c2,'#FFFFFF',s.c];return L[i%L.length]}
  /* 爆開：n 顆、速度 v；kind 照風格 */
  function burst(S,x,y,n,v,big){if(!S||RD())return;var pt=ST[CUR].pt,i;
    for(i=0;i<n;i++){var a=Math.random()*Math.PI*2,sp=v*rnd(.25,1),c=col(i);
      if(pt==='conf'||pt==='petal'||(pt==='snow'&&i%2)){S.add({k:pt==='conf'?'conf':pt==='petal'?'petal':'shard',x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-v*.3,g:260,dr:1.2,l:rnd(1.8,3.2),t:0,s:rnd(7,15)*(big?1.4:1),c:pt==='conf'?['#FF4D6D','#FFD54A','#4DA3FF','#3DDC84','#FFFFFF','#C79BFF'][i%6]:c,ro:rnd(0,6),vr:rnd(-8,8),fl:rnd(3,9)})}
      else S.add({k:'trail',x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,g:pt==='ember'||pt==='sun'?-60:120,dr:1.6,l:rnd(.7,1.6),t:0,s:rnd(2,4)*(big?1.5:1),c:c})}
    for(i=0;i<Math.round(n/3);i++){var a2=Math.random()*Math.PI*2,s2=v*rnd(.1,.6);S.add({x:x,y:y,vx:Math.cos(a2)*s2,vy:Math.sin(a2)*s2,dr:1,l:rnd(.8,1.8),t:0,s:rnd(10,26)*(big?1.6:1),c:col(i),gr:.4})}}
  function ring(S,x,y,r1,c,d,w){if(!S||RD())return;S.add({k:'ring',x:x,y:y,vx:0,vy:0,r0:10,r1:r1,c:c||'#fff',w:w||14,l:d||1,t:0,fo:1.2})}
  function rays(S,x,y,n,len,d,c){if(!S||RD())return;for(var i=0;i<n;i++)S.add({k:'ray',x:x,y:y,vx:0,vy:0,a:i/n*Math.PI*2,rv:.25,len:len,w:len*.06,c:c||col(i),l:d,t:0,ph:i,fi:.4,fo:3})}
  function bolt(S,x0,y0,x1,y1,c){if(!S||RD())return;var pts=[[x0,y0]],n=10;for(var i=1;i<n;i++){var k=i/n;pts.push([x0+(x1-x0)*k+rnd(-40,40),y0+(y1-y0)*k+rnd(-12,12)])}pts.push([x1,y1]);S.add({k:'bolt',pts:pts,x:0,y:0,vx:0,vy:0,c:c||'#CFEFFF',w:7,l:.45,t:0,fo:1})}
  function rocket(S,x,y,ty){if(!S||RD())return;S.add({x:x,y:S.H()+10,vx:rnd(-30,30),vy:-(S.H()+10-y)*1.35,g:(S.H()-y)*.9,dr:0,l:1,t:0,s:6,c:'#FFF3C0',on:function(p){burst(S,p.x,p.y,70,rnd(260,380));ring(S,p.x,p.y,rnd(90,150),col(Math.floor(Math.random()*3)),.9,6)}})}
  /* 一直在飄的背景粒子（每一種風格不一樣） */
  function ambient(S){var pt=ST[CUR].pt,W=S.W(),H=S.H();
    S.bg(function(x,w,h,t,dt){var n={warp:7,ember:4,snow:3,star:2,petal:2,neon:3,sun:3,gold:3,bolt:2,conf:2}[pt]||2;
      for(var i=0;i<n;i++){if(Math.random()>.5)continue;
        if(pt==='warp'){var a=Math.random()*7,r=rnd(10,60);S.add({k:'trail',x:w/2+Math.cos(a)*r,y:h/2+Math.sin(a)*r,vx:Math.cos(a)*rnd(200,700),vy:Math.sin(a)*rnd(200,700),dr:-1.2,l:1.6,t:0,s:rnd(1,2.6),c:col(i),fi:.2})}
        else if(pt==='ember'||pt==='sun')S.add({x:rnd(0,w),y:h+10,vx:rnd(-20,20),vy:-rnd(60,180),sw:2,sa:30,ph:rnd(0,6),l:rnd(2.5,5),t:0,s:rnd(3,8),c:col(i),fi:.3})
        else if(pt==='snow'||pt==='star'||pt==='gold'||pt==='neon'||pt==='bolt')S.add({x:rnd(0,w),y:pt==='snow'?-10:rnd(0,h),vx:rnd(-10,10),vy:pt==='snow'?rnd(30,80):rnd(-15,15),sw:1.5,sa:20,ph:rnd(0,6),l:rnd(2,4),t:0,s:rnd(2,6),c:col(i),fi:.8})
        else if(pt==='petal')S.add({k:'petal',x:rnd(-50,w),y:-20,vx:rnd(30,90),vy:rnd(40,90),sw:2,sa:40,ph:rnd(0,6),l:rnd(4,7),t:0,s:rnd(6,11),c:Math.random()<.5?'#FFB7DA':'#FFE3F1',ro:rnd(0,6),vr:rnd(-3,3),fl:rnd(1,3),fi:.5})
        else if(pt==='conf')S.add({k:'conf',x:rnd(0,w),y:-20,vx:rnd(-20,20),vy:rnd(60,120),sw:2,sa:30,ph:rnd(0,6),l:rnd(4,6),t:0,s:rnd(8,13),c:['#FF4D6D','#FFD54A','#4DA3FF','#3DDC84','#FFFFFF'][i%5],ro:rnd(0,6),vr:rnd(-6,6),fl:rnd(3,7),fi:.3})}
      if(pt==='bolt'&&Math.random()<dt*.5)bolt(S,rnd(0,w),0,rnd(0,w),rnd(h*.3,h*.7))})}

  /* ══ 圖：獎牌、皇冠 ══ */
  function medal(n){var C=[['#FFE48A','#B8860B','#FFF6CF'],['#F2F5F8','#8D99A6','#FFFFFF'],['#F0B07A','#8A4A1C','#FFE0C2']][n-1];
    return '<svg class="glmd" viewBox="0 0 120 160"><path d="M28 0h24l16 58H46z" fill="#2F7BE8"/><path d="M92 0H68L52 58h24z" fill="#E8453C"/><circle cx="60" cy="104" r="50" fill="'+C[1]+'"/><circle cx="60" cy="104" r="43" fill="'+C[0]+'"/><circle cx="60" cy="104" r="35" fill="none" stroke="'+C[2]+'" stroke-width="3" opacity=".8"/>'+
      '<text x="60" y="122" text-anchor="middle" font-size="52" font-weight="900" fill="'+C[1]+'" font-family="Arial,sans-serif">'+n+'</text><path d="M30 82a40 40 0 0 1 30-20" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/></svg>'}
  var CROWN='<svg class="glcr" viewBox="0 0 200 130"><defs><linearGradient id="glcrg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".45" stop-color="#FFD23F"/><stop offset="1" stop-color="#B8860B"/></linearGradient></defs><path d="M14 112L6 30l52 40L100 6l42 64 52-40-8 82z" fill="url(#glcrg)" stroke="#7A5A00" stroke-width="5" stroke-linejoin="round"/><rect x="12" y="104" width="176" height="20" rx="6" fill="url(#glcrg)" stroke="#7A5A00" stroke-width="4"/><circle cx="100" cy="64" r="12" fill="#E8453C"/><circle cx="52" cy="80" r="9" fill="#2F7BE8"/><circle cx="148" cy="80" r="9" fill="#2EB85C"/><circle cx="6" cy="30" r="8" fill="#FFF6C8"/><circle cx="100" cy="6" r="9" fill="#FFF6C8"/><circle cx="194" cy="30" r="8" fill="#FFF6C8"/></svg>';

  var CUR=0;
  function stop(el){if(!el)return;(el._gt||[]).forEach(clearTimeout);el._gt=[];if(el._gs)el._gs.stop();el._gs=null}
  function at(el,ms,f){el._gt.push(setTimeout(f,RD()?Math.min(ms,200):ms))}
  function ctr(el,q){var a=el.getBoundingClientRect(),b=(typeof q==='string'?el.querySelector(q):q);if(!b)return {x:a.width/2,y:a.height/2};var r=b.getBoundingClientRect();return {x:r.left-a.left+r.width/2,y:r.top-a.top+r.height/2}}
  function shake(el,c){el.classList.remove('glsk','glsk2');void el.offsetWidth;el.classList.add(c||'glsk')}
  function flash(el,c){var f=document.createElement('div');f.className='glfl';if(c)f.style.background=c;el.appendChild(f);setTimeout(function(){if(f.parentNode)f.parentNode.removeChild(f)},1400)}
  function head(D,k){return '<div class="glkick">'+(D.ic||'🏆')+'<span>'+D.kick+'　'+D.aw+'</span></div>'}
  /* 一幕 */
  function scene(el,st,k,D,snd){stop(el);CUR=(st|0)%ST.length;SND=!!snd;var S0=ST[CUR];
    if(k===0){TR=Math.floor(rnd(-3,4));MV=Math.floor(Math.random()*MEL.length)}   /* 每一場：隨機移調、換旋律 ➜ 同一種風格聽起來也不一樣 */
    el.className='gl gs'+(CUR+1)+' gk'+k;el.style.setProperty('--gc',S0.c);el.style.setProperty('--gc2',S0.c2);
    el.innerHTML='<div class="glbg"></div><div class="glsty">'+S0.nm+'</div>';var S=RD()?null:Cv(el);el._gs=S;if(S)ambient(S);
    var c=document.createElement('div');c.className='glc';el.appendChild(c);
    if(k===0){c.innerHTML='<div class="glic">'+(D.ic||'🏆')+'</div><div class="glt">'+(D.title||'🏆 '+D.per+' 榮譽榜').match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g).map(function(ch,i){return '<i style="animation-delay:'+(1+i*.09).toFixed(2)+'s">'+(ch===' '?'\u00a0':ch)+'</i>'}).join('')+'</div>'+
        '<div class="gls">'+D.kick+'<b>'+D.aw+'</b></div>';
      if(SND)MSC.open();at(el,250,function(){var p=ctr(el,'.glic');ring(S,p.x,p.y,el.clientWidth*.6,S0.c,1.4,18);rays(S,p.x,p.y,16,el.clientWidth*.7,5,null);burst(S,p.x,p.y,120,520,1);shake(el)});
      at(el,2300,function(){var p=ctr(el,'.glt');burst(S,p.x-el.clientWidth*.25,p.y,60,380);burst(S,p.x+el.clientWidth*.25,p.y,60,380)});return}
    if(k===1){var R=D.rows||[];   /* 第 10～4 名：第 10 名 在 最下面，從下往上 一格一格 翻開 */
      c.innerHTML=head(D)+'<div class="glrows" style="--n:'+R.length+'">'+R.map(function(r){return '<div class="glr"><div class="glin"><b class="glrk">'+(r.lab||'第 '+r.rk+' 名')+'</b><span class="glw">'+r.w+'</span><em class="glv">'+r.v+'</em></div><div class="glcov"><span>'+(r.lab||'第 '+r.rk+' 名')+'</span><i>？</i></div></div>'}).join('')+'</div>';
      var L=[].slice.call(c.querySelectorAll('.glr'));L.reverse();   /* DOM 由上 到下 ＝ 第 4 名 ➜ 第 10 名；翻開 的 順序 ＝ 最下面 先 */
      L.forEach(function(row,i){at(el,900+i*1250,function(){row.classList.add('on');var p=ctr(el,row);if(SND)MSC.tick(i);
        burst(S,p.x,p.y,46,330);ring(S,p.x,p.y,row.clientWidth*.55,S0.c,.8,8);if(S0.pt==='bolt')bolt(S,p.x+rnd(-100,100),0,p.x,p.y);if(S0.rv==='zap'||S0.rv==='glitch')shake(el)})});return}
    if(k===2||k===3||k===4){var n=k===2?3:k===3?2:1,P=(D.top||{})[n]||[],dr=n===1?3400:n===2?2200:1800;   /* 🥉 ➜ 🥈 ➜ 🥇 */
      var LB=D.lab&&D.lab[n]?D.lab[n]:'第 '+n+' 名';
      c.innerHTML='<div class="glwait"><div class="glq">'+['','🥇','🥈','🥉'][n]+' '+LB+' 是……</div><div class="gldots"><i></i><i></i><i></i></div></div>'+
        '<div class="glwin w'+n+'">'+(n===1?'<div class="glcrw">'+CROWN+'</div>':'')+medal(n)+'<div class="glwk">'+D.kick+'　'+D.aw+'　'+LB+'</div>'+
        P.map(function(p){return '<div class="glwn">'+p.w+'</div>'}).join('')+'<div class="glwv">'+(P[0]?P[0].v:'')+'</div>'+(n===1&&P[0]&&P[0].l?'<div class="glwl">'+P[0].l+'</div>':'')+'</div>';
      el.classList.add('gldim');if(SND)MSC.roll(dr/1000);
      if(n===1)at(el,dr*.5,function(){el.classList.add('glbeat')});
      at(el,dr,function(){el.classList.remove('gldim','glbeat');c.classList.add('rev');if(SND){if(n===1)MSC.win();else MSC.stinger(n)}
        var p=ctr(el,'.glmd'),W=el.clientWidth;flash(el,n===1?'#fff':null);shake(el,n===1?'glsk2':'glsk');
        burst(S,p.x,p.y,n===1?360:160,n===1?900:560,1);ring(S,p.x,p.y,W*(n===1?.9:.55),S0.c,1.3,22);rays(S,p.x,p.y,n===1?24:12,W*(n===1?.9:.6),n===1?9:5,n===1?'#FFE48A':null);
        if(n===1){at(el,220,function(){ring(S,p.x,p.y,W*.75,'#FFFFFF',1.2,16)});at(el,440,function(){ring(S,p.x,p.y,W*.6,S0.c2,1.2,12)});
          for(var f=0;f<9;f++)(function(f){at(el,700+f*520,function(){rocket(S,rnd(W*.1,W*.9),rnd(el.clientHeight*.12,el.clientHeight*.45))})})(f);
          at(el,500,function(){if(S0.pt==='bolt')for(var b=0;b<4;b++)bolt(S,rnd(0,W),0,p.x,p.y)})}
        else for(var g=0;g<3;g++)(function(g){at(el,500+g*600,function(){rocket(S,rnd(W*.15,W*.85),rnd(el.clientHeight*.15,el.clientHeight*.4))})})(g)});return}
    /* 5 頒獎台：台子 第 1 名 ＝ 第 2 名 2 倍、第 3 名 4 倍 */
    var T=D.top||{};c.innerHTML=head(D)+'<div class="glpod">'+[2,1,3].map(function(n,i){var P=T[n]||[];return '<div class="gp p'+n+'" style="animation-delay:'+(.3+[.6,1.2,0][i])+'s">'+(n===1?'<div class="gpcr">'+CROWN+'</div>':'')+medal(n)+
      '<div class="gpn">'+(P.map(function(p){return p.w}).join('<br>')||'—')+'</div><div class="gpv">'+(P[0]?P[0].v:'')+'</div><div class="gpb">'+n+'</div></div>'}).join('')+'</div>';
    if(SND)MSC.fin();at(el,1600,function(){var p=ctr(el,'.gp.p1 .glmd');burst(S,p.x,p.y,150,520,1);ring(S,p.x,p.y,el.clientWidth*.5,S0.c,1.2,14)});
    for(var f2=0;f2<6;f2++)(function(f2){at(el,1800+f2*700,function(){rocket(S,rnd(el.clientWidth*.1,el.clientWidth*.9),rnd(el.clientHeight*.1,el.clientHeight*.35))})})(f2)}
  return {ST:ST,pick:pick,scene:scene,stop:stop,lite:function(v){if(v!=null)LITE=v?1:0;return LITE}}})();
