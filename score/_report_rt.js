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
