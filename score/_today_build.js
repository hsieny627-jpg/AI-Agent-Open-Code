/* score/_today_build.js — 📅 今日任務、📈 我的 進步（2026-10-26 第二十七次 第 2 點，老師 選 C30 第 2 題「1、2、3」；C30 第 4 題 ★★ 🔥 挑戰關）
 *   node score/_today_build.js  ➜  g3-review/today.html、g3-review/stars.html、g4-review/today.html、g4-review/stars.html
 * （sentences/_build_review.js 最後 也 會 叫 這一支）
 *
 * 📅 今日任務 ＝ 每天 5 題、約 5 分鐘、做完 就 收工（建議頁 第 1 件；研究：分開 好幾天 練＋考 自己 記得 最 久 Cepeda 2006、Roediger & Karpicke 2006、Dunlosky 2013）：
 *   ✏️ 最多 3 題 ＝ 自己 以前 答錯、還沒 改對 的（伺服器 {a:'me'} 的 w）；🔁 其他 ＝ 前幾天（不是 今天）做過 的 主題 裡 的 題目；都 沒有 ＝ 🆕 這個 年級 學過 的 題目。
 *   題目 ＝ score/_bank.js 同一份（老師看板 錯題 分析 同一份；o[0] ＝ 正解）；只 用 四選一 能 回答 的（三個 以上 選項、不是「❌ 排錯」那種、不是 認讀 題）。
 *   不 限時（每天 的 好習慣，不要 壓力）；答錯 ＝ 綠底 解說（逐字 中文、整句 翻譯、唸 一次）才 有〔▶ 下一題〕。
 *   成績：題組 g年級td_day（老師看板 類別「📅 今日任務」）；每題 第 7 格 ＝ 原本 的 題組 ➜ 錯題 分析、「答錯 改對」算回 原本 的 題目。
 * 🔥 挑戰關（★★ 精英戰士 以上；C30 第 4 題）：一樣 的 主題、更難（進階、聽力、遊戲 的 題目）、每題 10 秒；答對 的 金幣 ✖1.5（伺服器 rpEarn，RPCHAL）。題組 g年級td_ch。
 * 📈 我的 進步 ＝ 每一個 主題 一列 ⭐（第一次 做）⭐⭐（會了：≧ 80 分）⭐⭐⭐（一週 以後 還 會：第一次 做 7 天 以後 又 ≧ 80）；只 跟 自己 比，不跟 同學 比（建議頁 第 2 件；Hattie & Timperley 2007）。
 * 在家複習（🏠 在家）才 有；三年級 複習（g3m）、課堂複習、四年級 期中複習、⚡ 等人 小遊戲、💼 職業單字 不 出。 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const B = require('./_bank.js'), CL = require('./_client.js'), SC = require('./_calc.js');
const J = o => JSON.stringify(o).replace(/</g, '\\u003c');
const SKIP = /_g3m-|_c[123]-|_mt-|_lm-|_job-|記憶配對/;
const good = q => q && q.o && q.o.length >= 3 && !q.o.some(o => /^❌/.test(o)) && q.k !== 'read';
function bankOf(g) {
  const out = {}, nm = {};
  Object.keys(B).forEach(k => {
    if (!(k.startsWith('g' + g) || k.startsWith('g*')) || SKIP.test(k + '|' + B[k].name)) return;
    if (/_x[34]$/.test(k) && !k.endsWith('x' + g)) return;   /* Review 1 進階：自己 年級 的 */
    const rk = k.replace(/^g\*/, 'g' + g);   /* 送 成績 的 代號（Review 1 ＝ 年級 換進去） */
    const qs = B[k].qs.map(q => good(q) ? { q: q.q, o: q.o, ae: q.ae || '', ag: q.ag || [], az: q.az || '', au: q.au || '', al: q.al || '', k: q.k || '' } : 0);
    if (!qs.some(Boolean)) return;
    out[rk] = qs; nm[rk] = String(B[k].name).replace(/^(三年級|四年級) /, '');
  });
  return { Q: out, N: nm };
}
const CSS = `
@font-face{font-family:Andika;src:url(../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark;--gold:#FFD54A;--ok:#2BD46A;--no:#FF5A5A}
*{box-sizing:border-box}html,body{margin:0;background:#05070A;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;font-weight:700}
button{font:inherit;font-weight:700;color:#fff;cursor:pointer;touch-action:manipulation}
.scr{max-width:1100px;margin:0 auto;padding:12px 16px 40px}
.top{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.top h1{margin:0;font-size:clamp(30px,4.6vh,48px);color:var(--gold)}
.home{margin-left:auto;display:inline-flex;align-items:center;min-height:56px;padding:4px 20px;border-radius:16px;border:3px solid #FFD54A;background:#221B05;color:#FFE9A8;text-decoration:none;font-size:clamp(20px,2.6vh,24px)}
.note{font-size:clamp(20px,2.6vh,26px);color:#BFD3E6;line-height:1.5}
.big{font-size:clamp(26px,3.6vh,38px)}
.go{min-height:76px;padding:6px 36px;border-radius:999px;border:0;font-size:clamp(26px,3.6vh,36px);background:linear-gradient(#22C766,#128A43);box-shadow:0 6px 0 #0B5A2B}
.go.ch{background:linear-gradient(#FF7A2A,#C2410C);box-shadow:0 6px 0 #7C2D12}
.row{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin:16px 0}
.dots{display:flex;gap:10px;justify-content:center;margin:10px 0}.dots i{width:30px;height:30px;border-radius:50%;background:#1A2330;border:3px solid #34475C}
.dots i.ok{background:var(--ok);border-color:var(--ok)}.dots i.no{background:var(--no);border-color:var(--no)}.dots i.cur{border-color:var(--gold);box-shadow:0 0 12px var(--gold)}
.tag{display:inline-block;padding:4px 16px;border-radius:999px;font-size:clamp(20px,2.6vh,26px);margin:6px 0}
.tag.w{background:#3A2E08;color:#FFE07A}.tag.r{background:#0F2A40;color:#9FD8FF}.tag.n{background:#0F3323;color:#7BF0A8}.tag.c{background:#3A1406;color:#FFB38A}
.qq{font-size:clamp(30px,4.6vh,50px);text-align:center;line-height:1.35;margin:14px 0;background:#fff;color:#111;border-radius:20px;padding:12px 20px}
.qq .em{color:#C2185B}
.hear{min-height:72px;padding:6px 30px;border-radius:999px;border:0;background:linear-gradient(#2F7BFF,#1452C4);box-shadow:0 6px 0 #0B347E;font-size:clamp(26px,3.6vh,36px)}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.o{min-height:clamp(90px,13vh,140px);border:0;border-radius:22px;padding:8px 14px;font-size:clamp(24px,3.6vh,40px);box-shadow:0 6px 0 rgba(0,0,0,.35)}
.o.c0{background:#E21B3C}.o.c1{background:#1368CE}.o.c2{background:#D89E00}.o.c3{background:#26890C}
.o.ok{box-shadow:0 0 0 6px #fff,0 0 30px #7BF0A8}.o.dim{opacity:.35}.o.bad{opacity:.5}
.tm{height:16px;border-radius:8px;background:#1A2330;overflow:hidden;margin:8px 0}.tm i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#FF5A5A,var(--gold))}
.yes{position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);font-size:clamp(50px,9vh,100px);color:#7BF0A8;text-shadow:0 0 30px #2BD46A;pointer-events:none;animation:yes 1.1s forwards}
@keyframes yes{0%{transform:translate(-50%,-50%) scale(.4);opacity:0}30%{transform:translate(-50%,-50%) scale(1.15);opacity:1}100%{transform:translate(-50%,-80%);opacity:0}}
#wf{position:fixed;inset:0;z-index:80;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.72);padding:14px}#wf.on{display:flex}
#wf .box{width:min(1100px,100%);max-height:100%;overflow:auto;background:linear-gradient(#0E7A3A,#0A5E2D);border:5px solid #7BF0A8;border-radius:28px;padding:clamp(14px,2.4vh,26px);text-align:center}
#wf .hd{font-size:clamp(30px,4.6vh,46px);color:#FFE07A}#wf .yp{font-size:clamp(22px,3vh,30px);color:#FFD6D6;margin:6px 0}#wf .yp s{text-decoration-thickness:3px}
#wf .ca{font-size:clamp(22px,3vh,30px);color:#C8FFD9;margin-top:8px}
#wf .gls{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 18px;margin:8px 0}#wf .gw{display:flex;flex-direction:column;align-items:center}
#wf .gw b{font-size:clamp(36px,6.6vh,70px);line-height:1.12}#wf .gw i{font-style:normal;font-size:clamp(22px,3.2vh,32px);color:#FFE07A;min-height:1.3em;white-space:nowrap}
#wf .gls.spk .gw b{animation:spk 1s}@keyframes spk{40%{transform:scale(1.12);text-shadow:0 0 22px #fff}}
#wf .tr{display:inline-block;margin-top:6px;font-size:clamp(24px,3.4vh,34px);background:rgba(0,0,0,.25);border-radius:16px;padding:8px 14px}
#wf .nx{min-height:66px;padding:6px 34px;border-radius:999px;border:0;background:linear-gradient(#FFD54A,#E0A800);color:#2A1C00;box-shadow:0 6px 0 #7A5A00;font-size:clamp(25px,3.4vh,34px)}
#wf .nx:disabled{background:#2A3644;box-shadow:none;color:#8FA6BE}
#wf .say{min-height:58px;padding:4px 22px;border-radius:999px;border:3px solid #fff;background:transparent;font-size:clamp(20px,2.6vh,26px)}
.mkl{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr));gap:10px;margin:10px 0}.mkl button{min-height:72px;border-radius:18px;border:3px solid #34475C;background:#17233A;font-size:clamp(22px,3vh,30px);padding:8px 12px;text-align:left}
.mkl button small{display:block;font-size:max(18px,.7em);color:#BFD3E6}.mkl button.on{border-color:#2BD46A;background:#0F3323}.go.mk{background:linear-gradient(#8E44FF,#5A1FC2);box-shadow:0 6px 0 #3A0E8A}
.endc{text-align:center}.endc .st{font-size:clamp(60px,10vh,100px)}
.why{display:grid;gap:10px;margin:14px 0}.why>div{display:flex;gap:14px;align-items:center;background:#0B1520;border:3px solid #22344A;border-radius:18px;padding:10px 16px;font-size:clamp(20px,2.6vh,26px)}
.why b{font-size:1.6em}
/* 📈 我的 進步 */
.sum{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin:10px 0;font-size:clamp(24px,3.2vh,34px)}.sum .n{font-size:1.8em;color:var(--gold)}
.pbar{flex:1;min-width:200px;height:28px;border-radius:14px;background:#1A2330;overflow:hidden}.pbar i{display:block;height:100%;background:linear-gradient(90deg,#FFD54A,#FF9F1C);width:0;transition:width 1.4s}
.leg{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:10px;margin:10px 0}.leg div{background:#0B1520;border:3px solid #22344A;border-radius:16px;padding:10px 14px;font-size:clamp(20px,2.6vh,26px)}
.leg b{display:block;font-size:1.4em;color:var(--gold)}
h2{font-size:clamp(26px,3.4vh,34px);color:#9FD8FF;margin:22px 0 8px}
.tp{display:flex;align-items:center;gap:12px;background:#0B1520;border:2px solid #22344A;border-radius:16px;padding:10px 14px;margin:8px 0;font-size:clamp(20px,2.6vh,26px)}
.tp .nm{flex:1;min-width:0}.tp .sx{font-size:clamp(28px,4vh,40px);letter-spacing:.06em;white-space:nowrap}.tp .sx .d{opacity:.18;filter:grayscale(1)}.tp small{display:block;color:#9FB4C8;font-size:max(18px,.8em)}
@media (max-width:600px){.opts{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;
/* ── 今日任務 頁 ── */
function todayJS(g, D) { return `
var G=${g},Q=${J(D.Q)},NM=${J(D.N)},N=5,R=null,ME=null,TR=0,FBN=0,AU=null;
function $(s){return document.querySelector(s)}function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function play(u,done){try{if(AU){AU.onended=null;AU.pause()}}catch(e){}if(!u){if(done)setTimeout(done,300);return}AU=new Audio(u);AU.onended=function(){if(done)done()};AU.onerror=function(){if(done)done()};var p=AU.play();if(p&&p.catch)p.catch(function(){if(done)done()})}
function has(s,i){return Q[s]&&Q[s][i]}
function dayStart(t){var d=new Date(t+288e5);d.setUTCHours(0,0,0,0);return d.getTime()-288e5}
/* 選 5 題：✏️ 答錯 還沒 改對（最多 3）➜ 🔁 前幾天 做過 的 主題 ➜ 🆕 學過 的 */
function pick5(ch){var L=[],used={},add=function(s,i,t){var k=s+'#'+i;if(used[k]||!has(s,i))return false;used[k]=1;L.push({s:s,i:i,t:t});return true};
  var me=ME||{s:{},w:[]},today=dayStart(Date.now());
  if(ch){var pool=[];Object.keys(Q).forEach(function(s){if(/(_\\d-\\da|_\\da|gm_g(5|8|10)|_x\\d|r1_.*_(5|8))$/.test(s))Q[s].forEach(function(q,i){if(q)pool.push([s,i])})});
    shuf(pool).forEach(function(x){if(L.length<N)add(x[0],x[1],'c')});return L}
  var w=(me.w||[]).filter(function(x){return has(x[0],x[1])&&x[2]<today}).concat((me.w||[]).filter(function(x){return has(x[0],x[1])&&x[2]>=today}));
  w.slice(0,3).forEach(function(x){add(x[0],x[1],'w')});
  var old=Object.keys(me.s||{}).filter(function(s){return Q[s]&&me.s[s][4]<today}),pool2=[];old.forEach(function(s){Q[s].forEach(function(q,i){if(q)pool2.push([s,i])})});
  shuf(pool2).forEach(function(x){if(L.length<N)add(x[0],x[1],'r')});
  if(L.length<N){var all=[];Object.keys(Q).forEach(function(s){Q[s].forEach(function(q,i){if(q)all.push([s,i])})});shuf(all).forEach(function(x){if(L.length<N)add(x[0],x[1],'n')})}
  return shuf(L)}
var TAG={w:['w','✏️ 你 以前 答錯 的：再 試 一次！'],r:['r','🔁 前幾天 學 的：還 記得 嗎？'],n:['n','🆕 學過 的 題目'],c:['c','🔥 挑戰關：10 秒！']};
function lobby(){FBN++;R=null;var lg=typeof SCID!=='undefined'&&SCID;
  var h='<div class="top"><h1>📅 今日 任務</h1><a class="home" href="index.html">🏠 回首頁</a></div>'+
    '<div class="why"><div><b>5️⃣</b>每天 5 題，大約 5 分鐘：做完 就 收工</div><div><b>✏️</b>你 以前 答錯 的，再 試 一次（改對 了 ＝ 🪙 多）</div><div><b>📅</b>分開 好幾天 練 ➜ 記得 最 久</div></div>';
  if(typeof SCON!=='undefined'&&SCON&&!lg)h+='<div class="row"><button class="go" id="lg">🔑 先 登入</button></div><div class="note" style="text-align:center">登入 才 知道 你 以前 答錯 哪幾題</div>';
  else h+='<div class="row"><button class="go" id="st">▶ 開始 今天 的 5 題</button>'+(TR>=2?'<button class="go ch" id="ch">🔥 挑戰關（10 秒、🪙 ✖1.5）</button>':'')+'</div>'+
    (TR>=3?'<div class="row"><button class="go mk" id="mk">✍ 出 1 題 給 全班（★★★）</button></div>':'')+
    (TR>=2?'':'<div class="note" style="text-align:center">🔥 挑戰關：⚔ 升到 ★★ 精英戰士 才 打得開</div>')+(TR>=3?'':'<div class="note" style="text-align:center">✍ 出 1 題 給 全班：⚔ 升到 ★★★ 烈焰戰將 才 打得開</div>');
  $('#app').innerHTML=h}
function load(cb){if(typeof SCON==='undefined'||!SCON||!SCID){cb();return}var done=0,fin=function(){if(!done){done=1;cb()}};setTimeout(fin,6000);
  scFetch('a=me&id='+SCID).then(function(j){if(j&&j.me){ME=j.me;TR=+j.tr||0}fin()},fin)}
function start(ch){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();load(lobby)});return}
  var L=pick5(ch);R={L:L,k:0,res:[],qs:[],ch:!!ch,t0:Date.now(),fix:0};show()}
function show(){var x=R.L[R.k],q=Q[x.s][x.i];R.q=q;R.x=x;R.lock=false;R.ts=Date.now();R.ord=shuf(q.o.map(function(_,i){return i}));
  var lis=(x&&(q.k==='listen'||/^🔊/.test(q.q)))&&q.al,qt=/^🔊/.test(q.q)?'🔊 聽 一聽，選 你 聽到 的':q.q;
  var h='<div class="top"><h1>'+(R.ch?'🔥 挑戰關':'📅 今日 任務')+'　'+(R.k+1)+' ／ '+R.L.length+'</h1><a class="home" href="index.html">🏠 回首頁</a></div>'+
    '<div class="dots">'+R.L.map(function(_,i){var r=R.res[i];return '<i class="'+(r===1?'ok':r===0?'no':i===R.k?'cur':'')+'"></i>'}).join('')+'</div>'+
    (R.ch?'<div class="tm"><i id="bar"></i></div>':'')+'<div style="text-align:center"><span class="tag '+TAG[x.t][0]+'">'+TAG[x.t][1]+'</span></div>'+
    (lis?'<div class="row"><button class="hear" id="hear">🔊 再 聽 一次</button></div>':'')+'<div class="qq">'+qt+'</div>'+
    '<div class="opts">'+R.ord.map(function(i,j){return '<button class="o c'+j+'" data-o="'+i+'">'+esc(q.o[i])+'</button>'}).join('')+'</div>';
  $('#app').innerHTML=h;window.scrollTo(0,0);if(lis)play(q.al);
  if(R.ch){var k=R.k,b=$('#bar');b.style.transition='none';b.style.width='100%';void b.offsetWidth;b.style.transition='width 10s linear';b.style.width='0%';R.tm=setTimeout(function(){if(R&&R.k===k&&!R.lock)answer(-1)},10000)}}
function answer(i){if(R.lock)return;R.lock=true;clearTimeout(R.tm);var q=R.q,x=R.x,ok=i===0,ms=Date.now()-R.ts;var b=$('#bar');if(b){b.style.transition='none';b.style.width=b.getBoundingClientRect().width+'px'}
  R.res[R.k]=ok?1:0;R.qs.push([ok?1:0,i<0?-1:Math.min(3,i),Math.round(ms/100)/10,i>=0&&ms<1000?1:0,R.ch&&ok?Math.round(Math.max(0,1-ms/10000)*1000)/1000:(ok?1:0),x.i,x.s]);
  [].forEach.call(document.querySelectorAll('.o'),function(e){var k=+e.getAttribute('data-o');e.disabled=true;if(k===0)e.classList.add('ok');else if(k===i)e.classList.add('bad');else e.classList.add('dim')});
  if(ok){if(x.t==='w')R.fix++;var y=document.createElement('div');y.className='yes';y.textContent=x.t==='w'?'✨ 改對 了！':'✅ 答對！';document.body.appendChild(y);setTimeout(function(){y.remove()},1100);setTimeout(next,1200)}
  else setTimeout(function(){wrong(i)},500)}
/* 答錯：綠底 解說（照 三年級 複習）：每一個 英文 字 下面 中文、整句 翻譯、唸 一次 ➜〔▶ 下一題〕*/
function wrong(i){var q=R.q,my=++FBN,ag=(q.ag||[]).filter(function(x){return !/^[?.!,]$/.test(x[0])});
  var gl=ag.length?'<div class="gls" id="gls">'+ag.map(function(x){return '<span class="gw"><b>'+esc(x[0])+'</b><i>'+esc(x[1])+'</i></span>'}).join('')+'</div>':'<div class="gls" id="gls"><span class="gw"><b>'+esc(q.o[0])+'</b><i></i></span></div>';
  $('#wbox').innerHTML='<div class="hd">'+(i<0?'⏰ 時間到':'❌ 答錯了')+'</div>'+(i>=0?'<div class="yp">你選 的：<s>'+esc(q.o[i])+'</s></div>':'')+'<div class="ca">✅ 正確答案：'+esc(q.o[0])+'</div>'+gl+
    (q.az?'<div><span class="tr">整句：'+esc(q.az)+'</span></div>':'')+'<div class="row"><button class="say" id="wfs">🔊 再聽</button><button class="nx" id="wfn" disabled>▶ 下一題</button></div>';
  $('#wf').classList.add('on');var g=$('#gls');if(g)g.classList.add('spk');play(q.au,function(){if(my===FBN){var b=$('#wfn');if(b)b.disabled=false}})}
function next(){FBN++;$('#wf').classList.remove('on');R.k++;if(R.k>=R.L.length){fin();return}show()}
function fin(){var ok=R.res.filter(function(x){return x===1}).length,n=R.L.length,fast=0;R.qs.forEach(function(x){fast+=x[3]});var rec=false;
  try{if(typeof scLive==='function'&&scLive()&&fast*2<=n){var u=SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    var QQ=scGet('q')||[];QQ.push({id:SCID,set:'g'+G+(R.ch?'td_ch':'td_day'),name:R.ch?'🔥 挑戰關':'📅 今日任務',m:'q',qs:R.qs,raw:ok,fix:R.fix,mp:0,mw:0,sec:Math.round((Date.now()-R.t0)/1000),src:'home',dev:SCDEV,u:u,t:Date.now()});
    scPut('q',QQ.slice(-200));scFlush();rec=true}}catch(e){}
  $('#app').innerHTML='<div class="top"><h1>'+(R.ch?'🔥 挑戰關':'📅 今日 任務')+' 完成！</h1><a class="home" href="index.html">🏠 回首頁</a></div><div class="endc"><div class="st">🎉</div>'+
    '<div class="big">答對 '+ok+' ／ '+n+' 題'+(R.fix?'　✨ 改對 了 '+R.fix+' 題':'')+'</div>'+
    '<div class="note">'+(rec?'📝 記進 成績 了（練習次數 ＋1）':fast*2>n?'⚠️ 太快 亂按 超過 一半：這一回 不算':'（沒有 登入：沒有 記 成績）')+'</div>'+
    '<div class="why"><div><b>📅</b>明天 再來 一次：分開 好幾天 練，記得 最 久！</div></div>'+
    '<div class="row"><a class="go" style="text-decoration:none;display:inline-flex;align-items:center" href="stars.html">📈 看 我的 進步 ⭐</a>'+(TR>=2&&!R.ch?'<button class="go ch" id="ch">🔥 挑戰關</button>':'')+'</div>'+(typeof scByeHTML==='function'&&typeof SCID!=='undefined'&&SCID?scByeHTML():'')+'</div>';window.scrollTo(0,0)}
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('button'):null;if(!t)return;
  if(t.id==='st')start(0);else if(t.id==='ch')start(1);else if(t.id==='lg')scLogin(function(){SCH.close();scBar();load(lobby)});else if(t.id==='hear')play(R.q.al);
  else if(t.id==='wfs')play(R.q.au,function(){var b=$('#wfn');if(b)b.disabled=false});else if(t.id==='wfn'){if(!t.disabled)next()}else if(t.hasAttribute('data-o')&&R&&!R.lock)answer(+t.getAttribute('data-o'))});
/* ✍ ★★★ 出 1 題 給 全班（C30 第 4 題＋選擇題 A：點選，不用 打字）：① 點 一句 學過 的 英文（當 正確 答案）➜ ② 點 3 個 錯的 ➜ ③ 看一看 ➜〔📤 送給 老師〕；老師〔✔ 可以〕才 進 現場任務 */
var MK=null,SEN=(function(){var o=[],seen={};Object.keys(Q).forEach(function(s){Q[s].forEach(function(q){if(!q||!q.ae||!q.az||!/ /.test(q.ae)||/[_＿]/.test(q.ae)||seen[q.ae])return;seen[q.ae]=1;o.push({e:q.ae,z:q.az})})});return o})();
function mkGo(){MK={st:1,a:null,w:[],L:shuf(SEN).slice(0,12)};mkDraw()}
function mkDraw(){var h='<div class="top"><h1>✍ 出 1 題 給 全班</h1><a class="home" href="index.html">🏠 回首頁</a></div><div class="dots">'+[1,2,3].map(function(k){return '<i class="'+(k<MK.st?'ok':k===MK.st?'cur':'')+'"></i>'}).join('')+'</div>';
  if(MK.st===1)h+='<div class="note big" style="text-align:center">① 點 一句 英文 ＝ 正確 答案</div><div class="mkl">'+MK.L.map(function(x,i){return '<button data-mka="'+i+'"><b>'+esc(x.e)+'</b><small>'+esc(x.z)+'</small></button>'}).join('')+'</div><div class="row"><button class="hear" id="mkre">🔄 換 一批</button></div>';
  else if(MK.st===2){var a=MK.a,fw=a.e.split(' ')[0],C=SEN.filter(function(x){return x.e!==a.e}).sort(function(x,y){return (y.e.split(' ')[0]===fw)-(x.e.split(' ')[0]===fw)||Math.abs(x.e.length-a.e.length)-Math.abs(y.e.length-a.e.length)});MK.C=MK.C||C.slice(0,8);
    h+='<div class="note big" style="text-align:center">② 點 3 個 錯的 答案（已經 點 '+MK.w.length+' 個）</div><div class="qq">「'+esc(a.z)+'」<br>✅ '+esc(a.e)+'</div><div class="mkl">'+MK.C.map(function(x,i){var on=MK.w.indexOf(x.e)>=0;return '<button data-mkw="'+i+'" class="'+(on?'on':'')+'">'+(on?'☑ ':'☐ ')+esc(x.e)+'</button>'}).join('')+'</div>'+
      '<div class="row"><button class="hear" id="mkbk">⬅ 重新 選 句子</button>'+(MK.w.length===3?'<button class="go" id="mknx">▶ 看一看</button>':'')+'</div>'}
  else h+='<div class="note big" style="text-align:center">③ 全班 會 看到 這一題：</div><div class="qq">「'+esc(MK.a.z)+'」的 英文 是？</div><div class="opts">'+[MK.a.e].concat(MK.w).map(function(x,j){return '<button class="o c'+j+'" disabled>'+(j?'':'✅ ')+esc(x)+'</button>'}).join('')+'</div>'+
    '<div class="row"><button class="hear" id="mkbk2">⬅ 改 錯的</button><button class="go" id="mksd">📤 送給 老師</button></div><div class="note" id="mkm" style="text-align:center">老師 說 OK，就 會 出現 在 ⚡ 現場任務（大螢幕 寫 出題人：你的 班級＋號碼）</div>';
  $('#app').innerHTML=h;window.scrollTo(0,0)}
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('button'):null;if(!t)return;
  if(t.id==='mk')mkGo();else if(t.id==='mkre'){MK.L=shuf(SEN).slice(0,12);mkDraw()}else if(t.hasAttribute('data-mka')){MK.a=MK.L[+t.getAttribute('data-mka')];MK.w=[];MK.C=null;MK.st=2;mkDraw()}
  else if(t.hasAttribute('data-mkw')){var x=MK.C[+t.getAttribute('data-mkw')].e,i=MK.w.indexOf(x);if(i>=0)MK.w.splice(i,1);else if(MK.w.length<3)MK.w.push(x);mkDraw()}
  else if(t.id==='mkbk'){MK.st=1;mkDraw()}else if(t.id==='mknx'){MK.st=3;mkDraw()}else if(t.id==='mkbk2'){MK.st=2;mkDraw()}
  else if(t.id==='mksd'){t.disabled=true;$('#mkm').textContent='⏳ 送出 中…';scFetch('',{a:'qsub',id:SCID,zh:MK.a.z,o:[MK.a.e].concat(MK.w)}).then(function(j){
      $('#mkm').textContent=j&&j.ok?'✅ 送出 了！老師 說 OK，就 會 出現 在 ⚡ 現場任務':j&&j.err==='week'?'這週 你 出 的 題 老師 已經 放進 現場任務 了，下週 再 出 一題 😊':j&&j.err==='tier'?'要 ⚔ ★★★ 烈焰戰將 才 能 出題':'❌ 沒有 送到（'+((j&&j.err)||'')+'）';if(!(j&&j.ok))t.disabled=false},function(){$('#mkm').textContent='📶 沒有 網路，等一下 再 送';t.disabled=false})}});
load(lobby);
`; }
/* ── 我的 進步 頁 ── */
function starsJS(g, D) { return `
var G=${g},NM=${J(D.N)},STAR=${SC.STAR},ME=null;
function $(s){return document.querySelector(s)}function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function grp(s){return /u1_/.test(s)?'📖 Unit 1':/u2_/.test(s)?'📖 Unit 2':/gm_/.test(s)?'🎮 遊戲':'📘 Review 1'}
function stars(x){return !x?0:x[2]?3:x[1]>=STAR?2:1}
function draw(){var me=ME||{s:{}},K=Object.keys(NM),tot=0,got=0,G2={};K.forEach(function(s){var n=stars(me.s[s]);tot+=3;got+=n;(G2[grp(s)]=G2[grp(s)]||[]).push([s,n])});
  var lg=typeof SCID!=='undefined'&&SCID;
  var h='<div class="top"><h1>📈 我的 進步</h1><a class="home" href="index.html">🏠 回首頁</a></div>'+
    '<div class="leg"><div><b>⭐</b>第一次 做 這個 主題</div><div><b>⭐⭐</b>會了：做到 '+STAR+' 分</div><div><b>⭐⭐⭐</b>一週 以後 還 會：第一次 做 7 天 以後，又 做到 '+STAR+' 分</div></div>'+
    '<div class="note">只 跟 自己 比：每一顆 ⭐ 都 是 你 自己 練 出來 的。</div>';
  if(typeof SCON!=='undefined'&&SCON&&!lg)h+='<div class="row"><button class="go" id="lg">🔑 先 登入</button></div>';
  h+='<div class="sum">你 一共 有 <span class="n">⭐ '+got+'</span> ／ '+tot+' 顆<span class="pbar"><i id="pb"></i></span></div>';
  ['📖 Unit 1','📖 Unit 2','🎮 遊戲','📘 Review 1'].forEach(function(gn){var L=G2[gn];if(!L)return;h+='<h2>'+gn+'</h2>'+L.map(function(x){var y=me.s[x[0]];
    return '<div class="tp"><span class="nm">'+esc(NM[x[0]].replace(/^[^｜]*｜/,''))+(y?'<small>最好 '+y[1]+' 分．做了 '+y[3]+' 次</small>':'<small>還沒 做</small>')+'</span><span class="sx">'+[1,2,3].map(function(k){return '<span class="'+(k<=x[1]?'':'d')+'">⭐</span>'}).join('')+'</span></div>'}).join('')});
  h+='<div class="row"><a class="go" style="text-decoration:none;display:inline-flex;align-items:center" href="today.html">📅 做 今日 任務</a></div>';
  $('#app').innerHTML=h;setTimeout(function(){var b=$('#pb');if(b)b.style.width=(tot?got/tot*100:0)+'%'},100)}
function load(){if(typeof SCON==='undefined'||!SCON||!SCID){draw();return}draw();scFetch('a=me&id='+SCID).then(function(j){if(j&&j.me){ME=j.me;draw()}},function(){})}
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('button'):null;if(t&&t.id==='lg')scLogin(function(){SCH.close();scBar();load()})});
load();
`; }
function page(g, title, js) { return `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex">
<title>${title}</title><style>${CSS}</style></head><body>
${CL.home(g, '../', 'home')}
<div id="app" class="scr"></div><div id="wf"><div class="box" id="wbox"></div></div>
<script>${js}</script>
</body></html>`; }
function build() {
  [3, 4].forEach(g => { const D = bankOf(g);
    const out = path.join(ROOT, 'g' + g + '-review');
    fs.writeFileSync(path.join(out, 'today.html'), page(g, '今日任務', todayJS(g, D)));
    fs.writeFileSync(path.join(out, 'stars.html'), page(g, '我的進步', starsJS(g, D)));
    console.log('g' + g + '-review：📅 今日任務 ' + Object.keys(D.Q).length + ' 個 主題、' + Object.keys(D.Q).reduce((a, k) => a + D.Q[k].filter(Boolean).length, 0) + ' 題；📈 我的 進步'); });
}
if (require.main === module) build();
module.exports = { build, bankOf };
