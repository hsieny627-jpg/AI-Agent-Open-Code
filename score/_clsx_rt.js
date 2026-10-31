/* score/_clsx_rt.js — 🏫 班級排行榜 的 頒獎典禮（2026-10-31 第三十五次 第 8-(1) 點）＋〔📊 動畫 看〕的 煙火、號角（第 8-(2) 點）
 * 老師：原本 的 動畫 太 陽春、太 無聊；配樂 太 幼稚、很 難聽 ➜ 最 尊榮、最 震撼、最 精緻、最 閃耀；每一次 動畫 和 配樂 都 不一樣。
 * 一個 獎 ＝ 一幕（約 9 秒 演完）：
 *   ① 燈 全 暗 ➜ 三盞 探照燈 掃過 舞台、鈸 漸強、定音鼓（獎名 金屬 光澤 的 緞帶 拉開）
 *   ② 其他 班（第 4 名 以後）一張 一張 亮 起來（溫和：不 說「最後 一名」）
 *   ③ 第 3 名 ➜ 第 2 名 升上 領獎台（銅管 和弦）
 *   ④ 小鼓 滾奏 漸強、全場 變暗、探照燈 集中 ➜ 💥 白光 一閃、衝擊波、皇冠 落下、煙火、彩帶 ➜ 第 1 名 班級 超大 金字（班級 顏色 光暈）、轉動 的 光芒
 *   ⑤ 一句 話「全班 一起 做到 了 什麼」
 * 10 種 主題（TH：背景、顏色、粒子）× 10 首 配樂（MUS：調、速度、和弦 進行、旋律、音色）＝ 每按一次 換 下一種（跟 上一次 一定 不一樣）。
 * 配樂 ＝ 瀏覽器 自己 合成 的 管弦樂（銅管 3 把 鋸齒波＋濾波 包絡、弦樂 墊底、定音鼓、鈸、小鼓 滾奏、鐘琴；殘響 ＝ 自己 做 的 3 秒 大廳 回音）；不用 外面 的 音樂 檔（沒有 版權 問題、離線 也 能 用）。
 * 用法：CLSX.play(舞台, 第幾種, {ribbon, sub, say, rank:[{rk, cls, col, vt}]}, {snd})（回傳 毫秒）；CLSX.stop(舞台)；CLSX.pick()；CLSX.boom(元素, 顏色)；CLSX.fan(第幾種) */
var CLSX=(function(){
  var TH=[
   {nm:'黃金殿堂',a:'#FFD54A',b:'#FFF3C4',c:'#B8860B',bg:'radial-gradient(ellipse at 50% 120%,#5A3A08 0,#1A0F02 55%,#050300 100%)',dk:'cols',pt:['#FFD54A','#FFF3C4','#E8A317','#FFFFFF']},
   {nm:'星際凱旋',a:'#9FD4FF',b:'#E6F4FF',c:'#3A6FD8',bg:'radial-gradient(ellipse at 30% 20%,#2A1A6A 0,#090A2A 45%,#020208 100%)',dk:'stars',pt:['#9FD4FF','#FFFFFF','#B48CFF','#FFD54A']},
   {nm:'冠軍之夜',a:'#FFE07A',b:'#FFFFFF',c:'#2E7DFF',bg:'linear-gradient(#060A1A,#0B1838 60%,#0A2A18)',dk:'stadium',pt:['#FFFFFF','#FFE07A','#5EC8FF','#FF6B6B']},
   {nm:'皇家紅毯',a:'#FFD54A',b:'#FFE9C4',c:'#B01030',bg:'linear-gradient(#1A0206,#060001)',dk:'curtain',pt:['#FFD54A','#FF4D6D','#FFFFFF','#FFB3C1']},
   {nm:'極光榮耀',a:'#7BF0C8',b:'#E8FFF7',c:'#2BB8A0',bg:'linear-gradient(#020812,#06182A 60%,#020608)',dk:'aurora',pt:['#7BF0C8','#9FD4FF','#E8FFF7','#C9A0FF']},
   {nm:'雷霆之巔',a:'#B8D8FF',b:'#FFFFFF',c:'#3A5FA0',bg:'radial-gradient(ellipse at 50% 0,#22324F 0,#070B14 70%)',dk:'storm',pt:['#FFFFFF','#B8D8FF','#FFD54A','#7AA8FF']},
   {nm:'破曉凱歌',a:'#FFB347',b:'#FFF0D6',c:'#E8662A',bg:'linear-gradient(#1A0A20,#5A1E2A 45%,#E8742A 85%,#FFC46B)',dk:'sunrise',pt:['#FFD54A','#FFB347','#FFFFFF','#FF7A59']},
   {nm:'水晶宮殿',a:'#A8F4FF',b:'#FFFFFF',c:'#3AB8D8',bg:'radial-gradient(ellipse at 50% 100%,#0E3A4A 0,#04121A 60%,#010407 100%)',dk:'crystal',pt:['#A8F4FF','#FFFFFF','#7BE0FF','#D6C8FF']},
   {nm:'霓虹巨星',a:'#FF7AE0',b:'#FFE6FA',c:'#8A3AFF',bg:'linear-gradient(#0A0218,#16052E 60%,#05010C)',dk:'laser',pt:['#FF7AE0','#7AF0FF','#FFE07A','#B48CFF']},
   {nm:'翡翠勝典',a:'#6BFFB0',b:'#EFFFF6',c:'#0E8A50',bg:'radial-gradient(ellipse at 50% 110%,#0A4A2A 0,#031A0E 55%,#010603 100%)',dk:'leaves',pt:['#6BFFB0','#FFD54A','#FFFFFF','#A8FFD6']}];
  /* ═══ 配樂（每 一首：調 key＝MIDI、速度 bpm、和弦 進行 pr（級數）、號角 旋律 mo [拍, 級數, 拍長]、亮度 br、鐘琴 bl）═══ */
  var MUS=[
   {nm:'黃金號角',key:62,bpm:96,pr:[1,4,5,1],mo:[[0,5,.5],[.5,5,.5],[1,1,1],[2,3,.5],[2.5,5,1.5]],br:1,bl:[1,3,5,8]},
   {nm:'星際凱旋曲',key:65,bpm:88,pr:[1,6,4,5],mo:[[0,1,1],[1,5,1],[2,8,1.5],[3.5,7,.5]],br:.8,bl:[5,8,10,12]},
   {nm:'冠軍進行曲',key:60,bpm:112,pr:[1,4,1,5],mo:[[0,1,.5],[.5,3,.5],[1,5,.5],[1.5,8,1.5],[3,5,1]],br:1.1,bl:[1,5,8,12]},
   {nm:'皇家典禮',key:63,bpm:84,pr:[1,6,2,5],mo:[[0,5,1.5],[1.5,4,.5],[2,3,1],[3,5,1]],br:.9,bl:[3,5,8,10]},
   {nm:'極光讚歌',key:67,bpm:80,pr:[1,3,6,4],mo:[[0,3,1],[1,5,1],[2,6,1],[3,5,1]],br:.7,bl:[1,3,5,8,10]},
   {nm:'雷霆凱歌',key:58,bpm:104,pr:[1,-7,-6,1],mo:[[0,1,.75],[.75,1,.25],[1,5,1],[2,4,.5],[2.5,3,.5],[3,5,1]],br:1.2,bl:[1,5,8]},
   {nm:'破曉頌',key:64,bpm:92,pr:[1,5,6,4],mo:[[0,5,1],[1,6,.5],[1.5,5,.5],[2,3,2]],br:.9,bl:[5,6,8,10]},
   {nm:'水晶光輝',key:69,bpm:86,pr:[1,4,6,5],mo:[[0,8,1],[1,7,.5],[1.5,6,.5],[2,5,2]],br:.75,bl:[8,10,12,15]},
   {nm:'巨星登場',key:61,bpm:118,pr:[6,4,1,5],mo:[[0,1,.5],[.5,1,.5],[1,3,.5],[1.5,5,.5],[2,8,2]],br:1.15,bl:[1,3,5,8,12]},
   {nm:'榮耀勝典',key:66,bpm:90,pr:[1,4,-6,5],mo:[[0,5,1],[1,8,1],[2,7,.5],[2.5,6,.5],[3,5,1]],br:1,bl:[1,5,8,10]}];
  var SC=[0,2,4,5,7,9,11];   /* 大調 */
  function deg(key,d){var neg=d<0,a=Math.abs(d)-1,o=Math.floor(a/7),s=SC[a%7]+12*o;if(neg)s-=1;return key+s}   /* -6 ＝ 降 六級、-7 ＝ 降 七級（史詩 感）*/
  function hz(m){return 440*Math.pow(2,(m-69)/12)}
  function chord(key,d){var r=deg(key,Math.abs(d)),minor=[2,3,6].indexOf(Math.abs(d))>=0&&d>0;if(d<0)r=deg(key,d);return [r-12,r,r+(minor?3:4),r+7]}
  var NB=null;
  function ctx(){try{return window.HON&&HON.ac?HON.ac():null}catch(e){return null}}
  function noise(c){if(NB&&NB.sampleRate===c.sampleRate)return NB;var n=c.sampleRate*2,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()*2-1;NB=b;return b}
  function bus(c){if(c._lx)return c._lx;var cp=c.createDynamicsCompressor();cp.threshold.value=-16;cp.knee.value=12;cp.ratio.value=4;cp.connect(c.destination);
    var m=c.createGain();m.gain.value=.8;m.connect(cp);var rv=c.createConvolver(),n=Math.floor(c.sampleRate*3),ir=c.createBuffer(2,n,c.sampleRate);
    for(var ch=0;ch<2;ch++){var d=ir.getChannelData(ch);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.6)}rv.buffer=ir;var rg=c.createGain();rg.gain.value=.32;rv.connect(rg);rg.connect(cp);
    c._lx={m:m,r:rv,live:[]};return c._lx}
  function out(c,node,wet){var B=bus(c);node.connect(B.m);if(wet){var g=c.createGain();g.gain.value=wet;node.connect(g);g.connect(B.r)}B.live.push(node)}
  function brass(c,t,ms,dur,vel,br){var g=c.createGain(),f=c.createBiquadFilter();f.type='lowpass';f.Q.value=1.4;f.connect(g);out(c,g,.45);
    var pk=Math.min(.32,.5/ms.length)*(vel||1);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+.05);g.gain.setTargetAtTime(pk*.75,t+.12,.2);g.gain.setTargetAtTime(0,t+dur,.18);
    f.frequency.setValueAtTime(350,t);f.frequency.linearRampToValueAtTime(2600*(br||1),t+.09);f.frequency.setTargetAtTime(1500*(br||1),t+.15,.3);
    ms.forEach(function(m){[-7,0,7].forEach(function(dt){var o=c.createOscillator();o.type='sawtooth';o.frequency.value=hz(m);o.detune.value=dt;o.connect(f);o.start(t);o.stop(t+dur+1)})})}
  function strings(c,t,ms,dur,vol){var g=c.createGain(),f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=1700;f.connect(g);out(c,g,.7);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((vol||.16)/ms.length*2,t+.7);g.gain.setTargetAtTime(0,t+dur,.6);
    var lf=c.createOscillator(),lg=c.createGain();lf.frequency.value=5.2;lg.gain.value=6;lf.connect(lg);lf.start(t);lf.stop(t+dur+3);
    ms.forEach(function(m){[-12,12].forEach(function(dt){var o=c.createOscillator();o.type='sawtooth';o.frequency.value=hz(m);o.detune.value=dt;lg.connect(o.detune);o.connect(f);o.start(t);o.stop(t+dur+3)})})}
  function timp(c,t,m,vel){var o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(hz(m)*1.5,t);o.frequency.exponentialRampToValueAtTime(hz(m),t+.25);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.55*(vel||1),t+.01);g.gain.exponentialRampToValueAtTime(.001,t+1.4);o.connect(g);out(c,g,.35);o.start(t);o.stop(t+1.5);
    var s=c.createBufferSource(),f=c.createBiquadFilter(),ng=c.createGain();s.buffer=noise(c);f.type='lowpass';f.frequency.value=260;ng.gain.setValueAtTime(.4*(vel||1),t);ng.gain.exponentialRampToValueAtTime(.001,t+.35);s.connect(f);f.connect(ng);out(c,ng,.3);s.start(t);s.stop(t+.4)}
  function cym(c,t,swell,len){var s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noise(c);s.loop=true;f.type='highpass';f.frequency.value=5200;
    if(swell){g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.18,t+len);g.gain.exponentialRampToValueAtTime(.001,t+len+.15)}else{g.gain.setValueAtTime(.32,t);g.gain.exponentialRampToValueAtTime(.001,t+(len||2.6))}
    s.connect(f);f.connect(g);out(c,g,.5);s.start(t);s.stop(t+(len||2.6)+.3)}
  function roll(c,t,len){for(var k=0,x=0;x<len;k++,x+=.048){var s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),v=.05+.25*(x/len);s.buffer=noise(c);f.type='bandpass';f.frequency.value=1900;f.Q.value=.7;
    g.gain.setValueAtTime(v,t+x);g.gain.exponentialRampToValueAtTime(.001,t+x+.06);s.connect(f);f.connect(g);out(c,g,.25);s.start(t+x);s.stop(t+x+.08)}}
  function bell(c,t,m){[[1,.16],[2.76,.05],[5.4,.02]].forEach(function(p){var o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=hz(m)*p[0];g.gain.setValueAtTime(p[1],t);g.gain.exponentialRampToValueAtTime(.0005,t+2.2);o.connect(g);out(c,g,.6);o.start(t);o.stop(t+2.3)})}
  /* 一幕 的 配樂（跟 動畫 同一個 時間表）*/
  function score(k,T){var c=ctx();if(!c)return;var M=MUS[k%MUS.length],t0=c.currentTime+.05,b=60/M.bpm,K=M.key;
    /* ① 開場：鈸 漸強＋定音鼓 滾＋弦樂 */
    cym(c,t0,1,2.1);for(var i=0;i<8;i++)timp(c,t0+.6+i*.18,K-24,.35+i*.06);strings(c,t0,chord(K,M.pr[0]).slice(1),2.4,.14);
    /* 號角 旋律（獎名 出來）*/
    var t1=t0+2.1;timp(c,t1,K-24,1);cym(c,t1,0,1.6);M.mo.forEach(function(n){var m=deg(K,n[1]);brass(c,t1+n[0]*b,[m,m-12],n[2]*b*.95,.9,M.br)});
    M.pr.forEach(function(d,j){strings(c,t1+j*b,chord(K,d),b*1.05,.12)});
    /* ③ 第 3 名、第 2 名：短 和弦 */
    brass(c,t0+T[0]/1000,chord(K,M.pr[1]),.55,.8,M.br);timp(c,t0+T[0]/1000,K-20,.7);
    brass(c,t0+T[1]/1000,chord(K,M.pr[2]),.7,.95,M.br);timp(c,t0+T[1]/1000,K-17,.8);
    /* ④ 小鼓 滾奏 漸強 ➜ 第 1 名：全 樂團 主 和弦＋鈸＋定音鼓＋鐘琴 */
    var tr=t0+T[2]/1000,tw=t0+T[3]/1000;roll(c,tr,tw-tr);cym(c,tr,1,tw-tr);
    brass(c,tw,chord(K,1).concat([K+12]),2.8,1.2,M.br*1.1);strings(c,tw,chord(K,1).concat([K+12,K+16]),3.4,.2);cym(c,tw,0,3.2);timp(c,tw,K-24,1.2);timp(c,tw+.35,K-17,.9);timp(c,tw+.7,K-24,1);
    M.bl.forEach(function(d,j){bell(c,tw+.4+j*.16,deg(K,d)+12)});
    brass(c,tw+2.9,chord(K,M.pr[3]===1?5:M.pr[3]),.5,.7,M.br);brass(c,tw+3.4,chord(K,1),1.8,1,M.br)}
  /* 〔📊 動畫 看〕第 1 名 出來 的 短 號角 */
  function fan(k){var c=ctx();if(!c)return;var M=MUS[k%MUS.length],t=c.currentTime+.05,K=M.key;timp(c,t,K-24,1);cym(c,t,0,2);brass(c,t,[deg(K,5),deg(K,5)-12],.18,.9,M.br);brass(c,t+.2,[deg(K,5),deg(K,5)-12],.18,.9,M.br);brass(c,t+.42,chord(K,1).concat([K+12]),1.8,1.1,M.br);M.bl.forEach(function(d,j){bell(c,t+.5+j*.15,deg(K,d)+12)})}
  function hush(){var c=ctx();if(!c||!c._lx)return;var B=c._lx;try{B.live.forEach(function(n){try{n.disconnect()}catch(e){}})}catch(e){}B.live=[]}
  /* ═══ 粒子：煙火＋彩帶（canvas）═══ */
  function fx(cv,cols,kind){var x=cv.getContext('2d'),W,H,P=[],run=true,t0=performance.now();
    function size(){var r=cv.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0)}size();
    function burst(px,py,n){for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,s=2+Math.random()*6;P.push({x:px,y:py,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,d:.008+Math.random()*.012,c:cols[i%cols.length],r:1.6+Math.random()*2.2,f:1})}}
    function conf(n){for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:-20-Math.random()*H*.4,vx:(Math.random()-.5)*1.4,vy:1.5+Math.random()*2.5,l:1,d:.002,c:cols[i%cols.length],w:6+Math.random()*8,h:3+Math.random()*4,a:Math.random()*6,va:(Math.random()-.5)*.3,cf:1})}
    function loop(){if(!run)return;x.clearRect(0,0,W,H);for(var i=P.length-1;i>=0;i--){var p=P[i];p.x+=p.vx;p.y+=p.vy;if(p.cf){p.a+=p.va;p.vx+=Math.sin(p.a)*.03}else{p.vy+=.06;p.vx*=.985;p.vy*=.985}p.l-=p.d;if(p.l<=0||p.y>H+30){P.splice(i,1);continue}
      x.globalAlpha=Math.max(0,p.l);x.fillStyle=p.c;if(p.cf){x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()}else{x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill();x.globalAlpha=Math.max(0,p.l*.35);x.beginPath();x.arc(p.x-p.vx*2,p.y-p.vy*2,p.r*.8,0,7);x.fill()}}
      x.globalAlpha=1;requestAnimationFrame(loop)}
    requestAnimationFrame(loop);
    return {burst:function(fx2,fy2,n){burst(fx2*W,fy2*H,n||90)},conf:conf,stop:function(){run=false},size:size}}
  /* ═══ 背景 ═══ */
  function deco(t){var o='',i;
    if(t.dk==='cols')for(i=0;i<6;i++)o+='<i class="lxcol" style="left:'+[4,14,24,72,82,92][i]+'%"></i>';
    if(t.dk==='stars'||t.dk==='crystal'||t.dk==='storm')for(i=0;i<70;i++)o+='<i class="lxstar" style="left:'+((i*37.3)%100)+'%;top:'+((i*19.7)%62)+'%;--s:'+(1+(i%3))+'px;animation-delay:'+((i%9)*.3)+'s"></i>';
    if(t.dk==='stadium')for(i=0;i<2;i++)o+='<div class="lxstd '+(i?'r':'l')+'">'+'<b></b>'.repeat(12)+'</div>';
    if(t.dk==='stadium'||t.dk==='curtain'||t.dk==='laser')o+='<div class="lxcrowd"></div>';
    if(t.dk==='curtain')o+='<i class="lxcur l"></i><i class="lxcur r"></i><i class="lxrug"></i>';
    if(t.dk==='aurora')for(i=0;i<3;i++)o+='<i class="lxaur" style="--k:'+i+'"></i>';
    if(t.dk==='storm')o+='<i class="lxbolt"></i>';
    if(t.dk==='sunrise')o+='<i class="lxsun"></i><i class="lxhill"></i>';
    if(t.dk==='crystal')for(i=0;i<9;i++)o+='<i class="lxcry" style="left:'+(i*12+2)+'%;--h:'+(18+((i*7)%5)*7)+'%;--r:'+((i%2?1:-1)*(4+i%3*3))+'deg"></i>';
    if(t.dk==='laser')for(i=0;i<6;i++)o+='<i class="lxlas" style="--k:'+i+'"></i>';
    if(t.dk==='leaves')for(i=0;i<16;i++)o+='<i class="lxleaf" style="left:'+((i*29)%100)+'%;animation-delay:'+(i*.5)+'s"></i>';
    return o}
  var CROWN='<svg class="lxcrown" viewBox="0 0 120 80"><defs><linearGradient id="lxcg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".45" stop-color="#FFD54A"/><stop offset="1" stop-color="#B07A0E"/></linearGradient></defs><path d="M8 70L14 18L40 44L60 6L80 44L106 18L112 70Z" fill="url(#lxcg)" stroke="#7A5208" stroke-width="3"/><rect x="8" y="64" width="104" height="12" rx="4" fill="url(#lxcg)" stroke="#7A5208" stroke-width="3"/><circle cx="60" cy="40" r="7" fill="#E8203A"/><circle cx="34" cy="52" r="5" fill="#2E86DE"/><circle cx="86" cy="52" r="5" fill="#27AE60"/><circle cx="14" cy="16" r="5" fill="#FFF6C8"/><circle cx="60" cy="5" r="5" fill="#FFF6C8"/><circle cx="106" cy="16" r="5" fill="#FFF6C8"/></svg>';
  var CUR=null;
  function stop(st){if(CUR){CUR.tm.forEach(clearTimeout);if(CUR.fx)CUR.fx.stop();CUR=null}hush();if(st){st.classList.remove('lx');st.style.removeProperty('--la');st.style.removeProperty('--lb')}}
  function pick(){var k=0;try{k=((+localStorage.getItem('clsx_st'))+1)%TH.length;if(isNaN(k))k=0;localStorage.setItem('clsx_st',k)}catch(e){k=Math.floor(Math.random()*TH.length)}return k}
  /* 時間表（毫秒）：第 3 名、第 2 名、小鼓 開始、第 1 名 */
  var TT=[3400,4700,5900,7700];
  function play(st,k,o,opt){stop(st);var t=TH[k%TH.length],R=o.rank||[],p=function(r){return R.filter(function(x){return x.rk===r})},top3=[1,2,3].map(p),rest=R.filter(function(x){return x.rk>3}).sort(function(a,b){return b.rk-a.rk});
    var nm=function(L){return L.map(function(x){return '<span style="color:'+x.col+'">'+x.cls+'</span>'}).join('、')},vt=function(L){return L.length?L[0].vt:''};
    st.className='cx lx';st.style.background=t.bg;st.style.setProperty('--la',t.a);st.style.setProperty('--lb',t.b);st.style.setProperty('--lc',t.c);
    st.innerHTML='<div class="lxbg">'+deco(t)+'</div><i class="lxsp s1"></i><i class="lxsp s2"></i><i class="lxsp s3"></i><i class="lxrays"></i><canvas class="lxfx"></canvas>'+
     '<div class="lxtop"><div class="ribbon"><span>'+o.ribbon+'</span></div><div class="sub">'+o.sub+'</div></div>'+
     (rest.length?'<div class="lxrest">'+rest.map(function(x,i){return '<span class="lxr" style="--d:'+(1.6+i*Math.min(.35,1.4/rest.length)).toFixed(2)+'s;--cc:'+x.col+'"><b>第 '+x.rk+' 名</b> '+x.cls+'<small>'+x.vt+'</small></span>'}).join('')+'</div>':'')+
     '<div class="lxwin"><div class="cls">'+o.cls+'</div><div class="say">'+o.say+'</div></div>'+
     '<div class="lxpod">'+[2,1,3].map(function(r){var L=top3[r-1];return '<div class="cp p'+r+(L.length?'':' nop')+'">'+(r===1?CROWN:'')+'<div class="ct">'+(L.length?nm(L)+'<small>'+vt(L)+'</small>':'')+'</div><div class="cb"><b>'+r+'</b></div></div>'}).join('')+'</div>'+'<i class="lxflash"></i><i class="lxwave"></i>';
    var cv=st.querySelector('.lxfx'),F=fx(cv,t.pt),tm=[];CUR={tm:tm,fx:F};
    tm.push(setTimeout(function(){st.classList.add('lxdim')},TT[2]));
    tm.push(setTimeout(function(){st.classList.remove('lxdim');st.classList.add('lxwon');F.size();F.burst(.5,.42,140);F.burst(.2,.3,80);F.burst(.8,.3,80);F.conf(160)},TT[3]));
    tm.push(setTimeout(function(){F.burst(.32,.2,90);F.burst(.68,.22,90)},TT[3]+900));
    tm.push(setTimeout(function(){F.burst(.5,.15,120);F.conf(90)},TT[3]+1900));
    if(opt&&opt.snd)score(k,TT);
    return TT[3]+3600}
  /* 〔📊 動畫 看〕第 1 名：煙火（畫在 el 上 一張 canvas）*/
  function boom(el,k){var t=TH[k%TH.length],cv=document.createElement('canvas');cv.className='lxfx';el.appendChild(cv);var F=fx(cv,t.pt);F.burst(.5,.3,130);F.burst(.25,.25,70);F.burst(.75,.25,70);F.conf(120);setTimeout(function(){F.burst(.5,.2,100)},900);setTimeout(function(){F.stop();cv.remove()},7000);return F}
  return {TH:TH,MUS:MUS,play:play,stop:stop,pick:pick,boom:boom,fan:fan,TT:TT}})();
