/* fun/_build.js — 🏰 全班 守城、🎣 英文 釣魚 的「在家複習」版（2026-10-26 老師第二十九次 第 3 點：C32 先做 1、2；放在 哪裡 C ＝ 在家複習＋現場任務 兩個 都要）
 *   node fun/_build.js  ➜  g3-review/castle.html、g3-review/fish.html、g4-review/castle.html、g4-review/fish.html（在家複習 自己 的 資料夾，不連 老師 的 頁面）
 * 題目（老師 選擇題 A）＝ 自己 年級 的 句型遊戲 ＋ Review 1 遊戲（跟 ⚡ 現場任務 同一份 live/_qbank.js）；
 *   🔒 永久原則（第二十九次 第 14 點）：新的 遊戲 題目 和 選項 一律 全 英文 ➜ 只 用「題目、選項 都 沒有 中文」的 題（中文 提示 拿掉；看 圖 選 英文 留著）；聽力 題 ＝「🔊 Which one do you hear?」。
 *   答錯 ＝ 正確 答案（每一個 英文 字 下面 中文、整句 翻譯、唸 一次）＝ 答錯頁 的 中文 是 解說，不是 題目。
 * 成績：g3gm_fun-castle／g3gm_fun-fish（g4 同）＝ 🎮 遊戲 類別；題目 第幾題 ＝ fun/_pool.json 的 順序（score/_bank.js 讀）。
 * 研究／改編（建議頁 listen/2026-10-26_C32/）：守城 ＝ Plants vs. Zombies、Blooket Tower Defense＋答錯 過 一下 再 考（Metcalfe 2017）；釣魚 ＝ Gimkit Fishtopia＋回想 練習（Roediger & Karpicke 2006）。 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const QB = require('../live/_qbank.js')(), CL = require('../score/_client.js');
const J = o => JSON.stringify(o).replace(/</g, '\\u003c');
const CJK = /[㐀-鿿]/;
/* 題目：拿掉 中文 提示（<small>、qz）➜ 題目、選項 都 沒有 中文 才 用；分類大師、變身術（要 看 中文 說明 才 知道 要 做 什麼）不用 */
const SKIP = /sg4$|sg9$|_9$|sg6$/;
function pool(g) { const out = [];
  QB.LIST[g].forEach(k => { if (SKIP.test(k)) return; const G = QB.GR[k]; G.qs.forEach(q => { if (q.ty !== 'mc') return;
    let t = String(q.t).replace(/<br><small>[\s\S]*?<\/small>/g, '').replace(/<small>[\s\S]*?<\/small>/g, '').replace(/<span class="qz">[\s\S]*?<\/span>/g, '').trim();
    if (q.ls) t = '🔊 Which one do you hear?';
    const plain = t.replace(/<[^>]+>/g, '').replace(/§i:[^§]+§/g, '');
    if (CJK.test(plain) || q.ot.some(o => CJK.test(String(o))) || q.o.some(o => CJK.test(String(o).replace(/<[^>]+>/g, '')))) return;
    if (q.ls && !q.al) return;
    out.push({ k, t, o: q.o, ot: q.ot, ls: q.ls ? 1 : 0, al: q.al || '', au: q.au || '', ae: q.ae || '', ag: q.ag || [], az: q.az || '', nm: G.nm }); }); });
  return out; }
const POOL = { 3: pool(3), 4: pool(4) };
[3, 4].forEach(g => { if (POOL[g].length < 120) throw new Error(g + ' 年級 題目 太少：' + POOL[g].length); });
fs.writeFileSync(path.join(__dirname, '_pool.json'), JSON.stringify({ 3: POOL[3].map(q => ({ q: q.t.replace(/<[^>]+>/g, '').replace(/§i:([^§]+)§/g, '〔$1〕'), o: q.ot, ae: q.ae, ag: q.ag, az: q.az, au: q.au })), 4: POOL[4].map(q => ({ q: q.t.replace(/<[^>]+>/g, '').replace(/§i:([^§]+)§/g, '〔$1〕'), o: q.ot, ae: q.ae, ag: q.ag, az: q.az, au: q.au })) }));
const ICON = QB.ICON;

const GAME = {
  castle: { ic: '🏰', nm: '守城 大作戰', set: 'fun-castle', bg: 'linear-gradient(#0E1A33,#1C2E14 70%)',
    how: [['👾', '怪物 一波 一波 走向 城堡'], ['✅', '答對 ＝ 大砲 打 最前面 的 怪物'], ['🔥', '連對 3 題 ＝ 蓋 一座 砲台（自己 會 打）'], ['❌', '答錯 ＝ 怪物 衝 一步；那一題 等一下 再 出現']] },
  fish: { ic: '🎣', nm: '英文 釣魚 大賽', set: 'fun-fish', bg: 'linear-gradient(#073B5C,#0A5E8A 45%,#0B3550)',
    how: [['✅', '答對 一題 ＝ 一個 魚餌 🪱'], ['🎣', '拋竿 ➜ 浮標 一沉「❗」➜ 馬上 按〔收線！〕'], ['🌟', '答得 愈快 ＝ 愈 容易 釣到 稀有 魚、傳說 魚'], ['📖', '每一條 魚 ＝ 一張 英文 字卡，收進 你的 水族箱']] }
};
const CSS = `
:root{--gold:#FFD24A;--ok:#39D98A}*{box-sizing:border-box}html,body{margin:0;height:100%}
body{font-family:Andika,"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;color:#fff;background:#071022;overflow:hidden;-webkit-user-select:none;user-select:none;touch-action:manipulation}
@font-face{font-family:Andika;src:url(../words/fonts/andika-400.woff2) format('woff2');font-weight:400}@font-face{font-family:Andika;src:url(../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
button{font-family:inherit;font-weight:700;color:#fff;cursor:pointer;border:0}
.scr{position:fixed;inset:0;display:flex;flex-direction:column}.scr[hidden]{display:none}
.top{display:flex;align-items:center;gap:12px;padding:10px 16px}.top h1{margin:0;font-size:clamp(26px,3.6vh,38px)}.top .sp{flex:1}
.hb{display:inline-flex;align-items:center;min-height:52px;padding:0 20px;border-radius:999px;background:linear-gradient(#FFE07A,#E0A800);color:#3A2A00;font-size:20px;font-weight:700;text-decoration:none}
.intro{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(10px,2vh,22px);padding:16px;text-align:center}
.intro .big{font-size:clamp(70px,13vh,130px)}.intro h2{margin:0;font-size:clamp(34px,5.4vh,58px);color:var(--gold)}
.hw{display:grid;grid-template-columns:auto 1fr;gap:10px 16px;align-items:center;font-size:clamp(22px,3.2vh,32px);text-align:left;max-width:860px}.hw span{font-size:1.4em}
.go{min-height:76px;padding:0 50px;border-radius:999px;background:linear-gradient(#22C766,#128A43);box-shadow:0 6px 0 #0B5A2B;font-size:clamp(28px,4vh,40px)}
.hud{display:flex;align-items:center;gap:14px;padding:8px 16px;font-size:clamp(20px,2.8vh,28px);background:rgba(0,0,0,.35)}.hud b{color:var(--gold)}.hud .sp{flex:1}
.tm{flex:1;height:14px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden}.tm i{display:block;height:100%;background:linear-gradient(90deg,#FF6B6B,#FFD24A,#39D98A);transform-origin:left}
.field{position:relative;flex:1 1 42%;min-height:180px;overflow:hidden}
.qp{flex:0 0 auto;padding:10px 16px 16px;background:rgba(4,8,18,.88);display:flex;flex-direction:column;gap:10px;align-items:center}
.qt{font-size:clamp(28px,4.4vh,46px);font-weight:700;text-align:center;line-height:1.3;display:flex;align-items:center;gap:14px;justify-content:center;flex-wrap:wrap}.qt .qic svg{width:clamp(80px,12vh,130px);height:auto}.qt .qic{font-size:clamp(70px,11vh,120px)}
.op{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;width:min(1100px,100%)}.op button{min-height:clamp(64px,9vh,92px);border-radius:18px;font-size:clamp(24px,3.4vh,36px);padding:6px 12px;box-shadow:0 5px 0 rgba(0,0,0,.35)}
.op button:nth-child(1){background:#C62D42}.op button:nth-child(2){background:#1E6FD9}.op button:nth-child(3){background:#C99A00}.op button:nth-child(4){background:#1E9E4F}.op button .oi svg{width:1.6em;height:auto;vertical-align:middle}
.op button.ok{outline:6px solid #fff;filter:brightness(1.15)}.op button.no{opacity:.35}
.hear{min-height:56px;padding:0 22px;border-radius:999px;background:#2E5A8A;font-size:22px}
/* 🏰 守城 */
.castle{position:absolute;right:1%;bottom:10%;width:clamp(120px,18vw,230px);height:78%}.castle svg{width:100%;height:100%}
.wall{position:absolute;right:calc(clamp(120px,18vw,230px) + 1%);bottom:10%;width:clamp(26px,3vw,40px);height:46%;display:flex;flex-direction:column-reverse;gap:2px}.wall i{flex:1;background:linear-gradient(#B08A5A,#7A5A30);border-radius:3px;box-shadow:inset 0 0 0 2px rgba(0,0,0,.25)}.wall i.crk{background:linear-gradient(#5A4020,#3A2810);opacity:.6}
.ground{position:absolute;left:0;right:0;bottom:0;height:10%;background:linear-gradient(#3E7A2A,#22441A)}
.mon{position:absolute;bottom:10%;font-size:clamp(46px,8vh,80px);transition:left .5s linear;transform:translateX(-50%)}.mon .hp{position:absolute;left:10%;right:10%;top:-12px;height:8px;border-radius:99px;background:#400;overflow:hidden}.mon .hp i{display:block;height:100%;background:#FF5252}
.mon.boss{font-size:clamp(80px,14vh,140px)}.mon.die{animation:mdie .6s forwards}@keyframes mdie{to{transform:translateX(-50%) scale(.2) rotate(200deg);opacity:0}}
.tw{position:absolute;bottom:56%;font-size:clamp(34px,5vh,52px);text-align:center}.tw small{display:block;font-size:16px;color:var(--gold)}
.ball{position:absolute;width:22px;height:22px;border-radius:50%;background:radial-gradient(#fff,#FFB300 50%,#B05000);box-shadow:0 0 14px #FFB300;transition:left .35s ease-in,top .35s ease-in;z-index:3}
.boom{position:absolute;font-size:60px;transform:translate(-50%,-50%);animation:bm .6s forwards;z-index:4}@keyframes bm{from{transform:translate(-50%,-50%) scale(.3)}to{transform:translate(-50%,-50%) scale(1.6);opacity:0}}
.wv{position:absolute;left:50%;top:16%;transform:translateX(-50%);font-size:clamp(34px,6vh,64px);font-weight:700;color:var(--gold);text-shadow:0 0 18px rgba(0,0,0,.8);animation:wvi 2s forwards;white-space:nowrap}@keyframes wvi{0%{opacity:0;transform:translateX(-50%) scale(2)}20%{opacity:1;transform:translateX(-50%) scale(1)}80%{opacity:1}to{opacity:0}}
.hearts{font-size:clamp(24px,3.4vh,34px)}
/* 🎣 釣魚 */
.sky{position:absolute;left:0;right:0;top:0;height:30%;background:linear-gradient(#7FC8F8,#BFE6FF)}.sea{position:absolute;left:0;right:0;top:30%;bottom:0;background:linear-gradient(#1E88E5,#0B3D6B)}
.boat{position:absolute;left:8%;top:14%;font-size:clamp(60px,10vh,100px)}.line{position:absolute;left:calc(8% + 70px);top:20%;width:3px;background:#fff;transform-origin:top;height:0;transition:height .6s}
.bob{position:absolute;top:31%;font-size:clamp(34px,5vh,50px);transform:translate(-50%,-50%);transition:left .6s}.bob.dip{animation:dip .25s 3}@keyframes dip{50%{transform:translate(-50%,-10%)}}
.bang{position:absolute;top:18%;font-size:clamp(50px,8vh,80px);color:#FF5252;transform:translateX(-50%);animation:bmp .3s infinite alternate}@keyframes bmp{to{transform:translateX(-50%) scale(1.25)}}
.reel{position:absolute;left:50%;bottom:8%;transform:translateX(-50%);min-height:96px;padding:0 60px;border-radius:999px;font-size:clamp(34px,5vh,52px);background:linear-gradient(#FF8A3D,#D9381E);box-shadow:0 8px 0 #7A1E08;z-index:5}
.bait{font-size:clamp(22px,3vh,30px)}.aq{position:absolute;right:2%;bottom:4%;display:flex;flex-wrap:wrap-reverse;gap:4px;max-width:46%;justify-content:flex-end;font-size:clamp(28px,4vh,40px)}
.aq span.r{filter:drop-shadow(0 0 8px #7FD4FF)}.aq span.l{filter:drop-shadow(0 0 10px #FFD54A)}
.catch{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6)}.cc{background:linear-gradient(#FFF8E1,#FFE9A8);color:#2A1A00;border-radius:26px;padding:20px 30px;text-align:center;min-width:min(90vw,520px);box-shadow:0 0 0 6px var(--rc,#FFD54A),0 0 40px var(--rc,#FFD54A);animation:cci .5s}
.cc .fi{font-size:clamp(80px,13vh,130px)}.cc .rr{font-size:24px;font-weight:700;color:var(--rd,#8A5A00)}.cc .en{font-size:clamp(30px,4.6vh,46px);font-weight:700;margin-top:6px}.cc .zh{font-size:24px;color:#6A5020}
@keyframes cci{from{transform:scale(.3) rotate(-10deg)}to{transform:none}}
/* 答錯：正確 答案 */
.fb{position:fixed;inset:0;z-index:30;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.72)}.fb.on{display:flex}
.fbb{background:linear-gradient(#0F5A2E,#0A3D1F);border:4px solid var(--ok);border-radius:24px;padding:18px 26px;max-width:min(94vw,980px);text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center}
.fbb h3{margin:0;font-size:30px;color:#FFB4B4}.gls{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center}.gw{display:flex;flex-direction:column;align-items:center}.gw b{font-size:clamp(30px,5vh,52px)}.gw i{font-style:normal;font-size:22px;color:#CFF5DD;min-height:1.2em}
.fbz{font-size:24px;color:#E8FFF0}.fbn{min-height:64px;padding:0 36px;border-radius:999px;background:linear-gradient(#22C766,#128A43);font-size:28px}
.end{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:16px}.end h2{margin:0;font-size:clamp(36px,6vh,64px);color:var(--gold)}.end .st{font-size:clamp(24px,3.4vh,34px)}
.end .row{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}.end .alb{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:1000px}.end .alb div{background:rgba(255,255,255,.08);border-radius:14px;padding:6px 12px;font-size:20px}.end .alb b{font-size:30px;display:block}
@media (orientation:portrait){.op{grid-template-columns:1fr}.field{flex-basis:36%}}
@media (prefers-reduced-motion:reduce){.mon{transition:none}}
`;
const RT = `
var $=function(s){return document.querySelector(s)};function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function ic(h){return String(h||'').replace(/§i:([^§]+)§/g,function(m,k){return ICON[k]||''})}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var AU=null;function play(f,done){try{if(AU)AU.pause()}catch(e){}if(!f){if(done)setTimeout(done,300);return}AU=new Audio(f);AU.onended=function(){if(done)done()};AU.onerror=function(){if(done)done()};var p=AU.play();if(p&&p.catch)p.catch(function(){if(done)done()})}
var T=90,R=null,TM={t0:0,used:0,run:false};function tLeft(){return Math.max(0,T-TM.used-(TM.run?(performance.now()-TM.t0)/1000:0))}
function tPause(){if(TM.run){TM.used+=(performance.now()-TM.t0)/1000;TM.run=false}}function tGo(){if(!TM.run&&tLeft()>0){TM.t0=performance.now();TM.run=true}}
function intro(){$('#intro').hidden=false;$('#play').hidden=true;$('#endv').hidden=true}
function start(){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();start()});return}
  R={Q:[],sc:0,st:0,ok:0,n:0,t0:Date.now(),qs:shuf(POOL.map(function(_,i){return i})),pi:0,back:[],sent:0};TM={t0:performance.now(),used:0,run:true};
  $('#intro').hidden=true;$('#endv').hidden=true;$('#play').hidden=false;GM.init();nextQ();tick()}
function tick(){if(!R||R.over)return;var l=tLeft();$('#tmi').style.transform='scaleX('+(l/T)+')';$('#tms').textContent=Math.ceil(l);if(l<=0){finish();return}GM.tick&&GM.tick();requestAnimationFrame(tick)}
/* 下一題：答錯 的 題 ＝ 過 4 題 再 出現 一次（答錯 過 一下 再 考：Metcalfe 2017）*/
function pickQ(){for(var i=0;i<R.back.length;i++){if(R.back[i][1]<=R.n){var x=R.back.splice(i,1)[0];return x[0]}}var k=R.qs[R.pi++%R.qs.length];return k}
function nextQ(){if(!R||R.over)return;var k=pickQ(),q=POOL[k];R.k=k;R.q=q;R.ts=Date.now();var ord=shuf(q.o.map(function(_,i){return i}));R.ord=ord;
  $('#qt').innerHTML=(q.ls?'':'')+ic(q.t);$('#op').innerHTML=ord.map(function(i){return '<button data-i="'+i+'">'+ic(q.o[i])+'</button>'}).join('');
  $('#hr').hidden=!q.ls;if(q.ls)play(q.al)}
function ans(i){if(!R||R.busy||R.over)return;var q=R.q,ok=i===0,ms=Date.now()-R.ts;R.busy=1;R.n++;
  [].forEach.call(document.querySelectorAll('#op button'),function(b){var j=+b.dataset.i;b.classList.add(j===0?'ok':'no')});
  R.Q.push([ok?1:0,ok?0:Math.min(3,i),Math.round(ms/100)/10,ms<1000?1:0,ok?Math.round(tLeft()/T*1000)/1000:0,R.k]);
  if(ok){R.ok++;R.st++;GM.good(ms,function(){R.busy=0;nextQ()})}else{R.st=0;R.back.push([R.k,R.n+4]);GM.bad(function(){showFix(q,function(){R.busy=0;nextQ()})})}}
/* 答錯：正確 答案（每一個 字 下面 中文、整句 翻譯、唸 一次）；看 的 時候 時間 停住 */
function showFix(q,done){tPause();var o=$('#fb');o.innerHTML='<div class="fbb"><h3>❌ 這一題 的 正確 答案</h3><div class="gls">'+(q.ag.length?q.ag.filter(function(x){return !/^[.,?!]$/.test(x[0])}).map(function(x){return '<div class="gw"><b>'+esc(x[0])+'</b><i>'+esc(x[1])+'</i></div>'}).join(''):'<div class="gw"><b>'+ic(q.o[0])+'</b></div>')+'</div>'+
  (q.az?'<div class="fbz">整句：'+esc(q.az)+'</div>':'')+'<button class="fbn" id="fbn" hidden>▶ 繼續</button></div>';o.classList.add('on');
  var go=function(){var b=$('#fbn');if(!b)return;b.hidden=false;b.onclick=function(){o.classList.remove('on');tGo();done()}};play(q.au,function(){setTimeout(go,300)});if(!q.au)setTimeout(go,1200)}
function finish(){if(!R||R.over)return;R.over=1;tPause();GM.stop&&GM.stop();rec();var s=GM.sum();
  $('#play').hidden=true;$('#endv').hidden=false;$('#end').innerHTML='<div class="big" style="font-size:90px">'+s.ic+'</div><h2>'+s.t+'</h2><div class="st">✅ 答對 '+R.ok+' 題 ／ '+R.n+' 題　⭐ '+R.sc+' 分</div>'+(s.h||'')+
   '<div class="row"><button class="go" id="again">🔁 再玩 一次</button><a class="hb" href="index.html">🏠 回首頁</a></div>'}
/* 成績（跟 其他 遊戲 一樣 送 佇列；太快 亂按 超過 一半 不送）*/
function rec(){try{if(!R||R.sent||!R.Q.length||typeof scLive!=='function'||!scLive())return;var f=0;R.Q.forEach(function(x){f+=x[3]});if(f*2>R.Q.length)return;R.sent=1;
  var QQ=scGet('q')||[];QQ.push({id:SCID,set:'g'+GR+'gm_'+SET,name:NAME,m:'g',qs:R.Q,raw:R.sc,fix:0,mp:0,mw:0,sec:Math.round((Date.now()-R.t0)/1000),src:'home',dev:SCDEV,u:SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now()});scPut('q',QQ.slice(-200));scFlush()}catch(e){}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#op button');if(b){ans(+b.dataset.i);return}
  if(e.target.closest&&e.target.closest('#go,#again'))start();if(e.target.closest&&e.target.closest('#hr'))play(R&&R.q&&R.q.al);if(e.target.closest&&e.target.closest('#quit')){finish()}});
window.addEventListener('pagehide',function(){if(R&&!R.over)rec()});
`;
/* 🏰 守城：怪物 一波 一波（史萊姆 ➜ 哥布林 ➜ 魔王）走向 城堡；答對 ＝ 大砲 打；連對 3 題 ＝ 砲台（每 6 秒 自己 打）；答錯 ＝ 怪物 衝 一步；碰到 城牆 ＝ 少 一顆 ❤ */
const CASTLE = `
var GM=(function(){var S;
  var WV=[{n:'第 1 波',m:'🟢',hp:1,c:3,sp:.9},{n:'第 2 波',m:'👺',hp:2,c:4,sp:1.1},{n:'第 3 波',m:'👹',hp:2,c:5,sp:1.25},{n:'⚠ 魔王 來了！',m:'🐲',hp:6,c:1,sp:.8,boss:1}];
  function fld(){return $('#field')}
  function init(){var f=fld();f.innerHTML='<div class="ground"></div><div class="castle"><svg viewBox="0 0 100 140"><rect x="10" y="40" width="80" height="100" fill="#8A8A9A"/><rect x="0" y="20" width="26" height="120" fill="#9A9AAA"/><rect x="74" y="20" width="26" height="120" fill="#9A9AAA"/>'+
    '<path d="M0 20h6v-8h7v8h6v-8h7v8M74 20h6v-8h7v8h6v-8h7v8" fill="#9A9AAA"/><rect x="38" y="96" width="24" height="44" rx="12" fill="#4A2E14"/><path d="M50 4v24" stroke="#5A4020" stroke-width="2"/><path d="M50 4l18 6-18 6z" fill="#E53935"/></svg></div><div class="wall" id="wall"></div>';
    S={wave:-1,mons:[],hearts:3,kills:0,towers:[],last:performance.now(),tw:0};wall();nextWave();hud()}
  function wall(){var w=$('#wall');if(!w)return;var h='';for(var i=0;i<6;i++)h+='<i class="'+(i>=S.hearts*2?'crk':'')+'"></i>';w.innerHTML=h}
  function hud(){$('#hx').innerHTML='<span class="hearts">'+'❤️'.repeat(S.hearts)+'🖤'.repeat(3-S.hearts)+'</span>　👾 打倒 <b>'+S.kills+'</b>　🏹 砲台 <b>'+S.towers.length+'</b>'}
  function nextWave(){S.wave++;if(S.wave>=WV.length){finish();return}var W=WV[S.wave],f=fld();var b=document.createElement('div');b.className='wv';b.textContent=W.n;f.appendChild(b);setTimeout(function(){b.remove()},2000);
    for(var i=0;i<W.c;i++){var m=document.createElement('div');m.className='mon'+(W.boss?' boss':'');m.innerHTML=W.m+'<span class="hp"><i style="width:100%"></i></span>';f.appendChild(m);S.mons.push({el:m,x:-6-i*11,hp:W.hp,hp0:W.hp,sp:W.sp});m.style.left=(-6-i*11)+'%'}}
  /* 怪物 慢慢 走（答 題 的 時候 也 在 走 ＝ 刺激；看 正確 答案 的 時候 停）*/
  function tick(){var now=performance.now(),dt=Math.min(.1,(now-S.last)/1000);S.last=now;if(!TM.run)return;var lim=74;
    S.mons.forEach(function(m){m.x+=m.sp*dt*1.15;if(m.x>=lim){m.x=lim-18;S.hearts--;wall();hud();m.el.style.transition='none';boom(m,'💥');if(S.hearts<=0){finish();return}}m.el.style.left=m.x+'%'});
    S.tw+=dt;if(S.towers.length&&S.tw>=6){S.tw=0;S.towers.forEach(function(t,i){setTimeout(function(){shoot(t)},i*300)})}}
  function front(){var b=null;S.mons.forEach(function(m){if(!b||m.x>b.x)b=m});return b}
  function boom(m,e){var r=m.el.getBoundingClientRect(),fr=fld().getBoundingClientRect(),o=document.createElement('div');o.className='boom';o.textContent=e;o.style.left=(r.left-fr.left+r.width/2)+'px';o.style.top=(r.top-fr.top+r.height/2)+'px';fld().appendChild(o);setTimeout(function(){o.remove()},700)}
  function shoot(src,done){var m=front();if(!m){if(done)done();return}var f=fld(),fr=f.getBoundingClientRect(),b=document.createElement('div');b.className='ball';var sx=src?src.x:fr.width*.86,sy=src?src.y:fr.height*.4;b.style.left=sx+'px';b.style.top=sy+'px';f.appendChild(b);
    var r=m.el.getBoundingClientRect();requestAnimationFrame(function(){b.style.left=(r.left-fr.left+r.width/2)+'px';b.style.top=(r.top-fr.top+r.height/2)+'px'});
    setTimeout(function(){b.remove();if(S.mons.indexOf(m)<0){if(done)done();return}m.hp--;m.el.querySelector('.hp i').style.width=Math.max(0,m.hp/m.hp0*100)+'%';boom(m,'💥');
      if(m.hp<=0){S.mons.splice(S.mons.indexOf(m),1);m.el.classList.add('die');S.kills++;R.sc+=m.hp0*100;setTimeout(function(){m.el.remove()},600);hud();if(!S.mons.length)setTimeout(nextWave,700)}if(done)done()},380)}
  function good(ms,done){R.sc+=Math.max(0,Math.round(50-ms/200));if(R.st>0&&R.st%3===0&&S.towers.length<4){var f=fld(),fr=f.getBoundingClientRect(),t=document.createElement('div');t.className='tw';var x=fr.width*(.56+S.towers.length*.07);t.style.left=x+'px';t.innerHTML='🏹<small>連對 '+R.st+'</small>';f.appendChild(t);S.towers.push({x:x+20,y:fr.height*.44});hud()}
    shoot(null,function(){setTimeout(done,150)})}
  function bad(done){var m=front();if(m){m.x+=6;m.el.style.left=m.x+'%';boom(m,'😈')}setTimeout(done,500)}
  function sum(){var win=S.wave>=WV.length;return {ic:win?'🏆':S.hearts>0?'🏰':'💔',t:win?'守住 城堡！全部 打倒！':S.hearts>0?'時間 到！城堡 守住 了':'城門 被 攻破…再 試 一次！',h:'<div class="st">👾 打倒 '+S.kills+' 隻　🏹 蓋了 '+S.towers.length+' 座 砲台</div>'}}
  return {init:init,tick:tick,good:good,bad:bad,sum:sum,stop:function(){}}})();
`;
/* 🎣 釣魚：答對 ＝ 魚餌 ➜ 拋竿 ➜ 浮標 一沉「❗」➜ 1.2 秒 內 按〔收線！〕＝ 釣到；答得 快 ＝ 稀有、傳說 魚 機會 大；每一條 魚 ＝ 一張 英文 字卡（水族箱、圖鑑 存 在 這台 平板）*/
const FISH = `
var GM=(function(){var S,FS={n:['🐟','🐠','🐡','🦐','🦀'],r:['🦑','🐙','🦈','🐬'],l:['🐋','🐉','🧜']};
  function init(){$('#field').innerHTML='<div class="sky"></div><div class="sea"></div><div class="boat">🚣</div><div class="line" id="ln"></div><div class="bob" id="bob" hidden>🔴</div><div class="aq" id="aq"></div>';S={fish:[],bait:0,busy:0};hud()}
  function hud(){var r=S.fish.filter(function(f){return f.t!=='n'}).length;$('#hx').innerHTML='<span class="bait">🪱 魚餌 <b>'+S.bait+'</b></span>　🐟 釣到 <b>'+S.fish.length+'</b>　🌟 稀有 <b>'+r+'</b>'}
  function rar(ms){var p=Math.random(),fast=ms<3500?1:ms<7000?.5:0;return p<.06+.12*fast?'l':p<.3+.25*fast?'r':'n'}
  function good(ms,done){S.bait++;hud();tPause();cast(rar(ms),function(){tGo();done()})}
  function cast(t,done){var ln=$('#ln'),bob=$('#bob'),f=$('#field'),fr=f.getBoundingClientRect(),x=20+Math.random()*40;ln.style.height='0';bob.hidden=false;bob.style.left=x+'%';ln.style.left=(8)+'%';ln.style.height=(fr.height*.12)+'px';
    var wait=900+Math.random()*1600,tm=setTimeout(function(){bob.classList.add('dip');var bg=document.createElement('div');bg.className='bang';bg.textContent='❗';bg.style.left=x+'%';f.appendChild(bg);
      var rb=document.createElement('button');rb.className='reel';rb.id='reel';rb.textContent='🎣 收線！';f.appendChild(rb);var t0=performance.now(),gone=false;
      var miss=setTimeout(function(){gone=true;clean();S.bait--;hud();say('💨 魚 跑掉 了…要 快 一點 按！',done)},1500);
      rb.onclick=function(){if(gone)return;clearTimeout(miss);clean();S.bait--;catchF(t,done)};
      function clean(){bob.classList.remove('dip');bg.remove();rb.remove();bob.hidden=true;ln.style.height='0'}},wait)}
  function say(t,done){var f=$('#field'),o=document.createElement('div');o.className='wv';o.textContent=t;f.appendChild(o);setTimeout(function(){o.remove();done()},1500)}
  function catchF(t,done){var q=R.q,L=FS[t],fi=L[Math.floor(Math.random()*L.length)],en=String(q.ae||q.ot[0]),zh=q.az||'';S.fish.push({t:t,fi:fi,en:en});R.sc+=t==='l'?300:t==='r'?150:60;hud();
    var a=$('#aq'),sp=document.createElement('span');sp.className=t;sp.textContent=fi;a.appendChild(sp);
    var c=document.createElement('div');c.className='catch';c.innerHTML='<div class="cc" style="--rc:'+(t==='l'?'#FFD54A':t==='r'?'#7FD4FF':'#B8E6B8')+';--rd:'+(t==='l'?'#8A5A00':t==='r'?'#0B5A8A':'#2E6B1F')+'"><div class="fi">'+fi+'</div><div class="rr">'+(t==='l'?'👑 傳說 魚！':t==='r'?'🌟 稀有 魚！':'🐟 釣到 了！')+'</div><div class="en">'+esc(en)+'</div><div class="zh">'+esc(zh)+'</div></div>';$('#field').appendChild(c);
    try{var al=JSON.parse(localStorage.getItem('fish_album')||'{}');al[en]=(al[en]||'')+fi;localStorage.setItem('fish_album',JSON.stringify(al))}catch(e){}
    play(q.au,function(){setTimeout(function(){c.remove();done()},400)});if(!q.au)setTimeout(function(){c.remove();done()},1800)}
  function bad(done){setTimeout(done,300)}
  function sum(){var r=S.fish.filter(function(f){return f.t==='r'}).length,l=S.fish.filter(function(f){return f.t==='l'}).length;
    return {ic:l?'🐋':r?'🦈':'🎣',t:'釣到 '+S.fish.length+' 條 魚！',h:'<div class="st">👑 傳說 '+l+'　🌟 稀有 '+r+'</div><div class="alb">'+S.fish.slice(-12).map(function(f){return '<div><b>'+f.fi+'</b>'+esc(f.en)+'</div>'}).join('')+'</div>'}}
  return {init:init,good:good,bad:bad,sum:sum,tick:null,stop:function(){}}})();
`;
function page(g, key) { const G = GAME[key];
  return `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${G.nm}</title><style>${CSS}body{background:${G.bg}}</style></head><body>
<script>window.SCLKPAGE=${J(G.set)};</script>
${CL.home(g, '../', 'home')}
<div class="scr" id="intro"><div class="top"><h1>${G.ic} ${G.nm}</h1><span class="sp"></span><a class="hb" href="index.html">🏠 回首頁</a></div>
 <div class="intro"><div class="big">${G.ic}</div><h2>${G.nm}</h2><div class="hw">${G.how.map(x => '<span>' + x[0] + '</span><div>' + x[1] + '</div>').join('')}</div><div class="st" style="font-size:22px;color:#B8C4D2">⏱ 1 分 30 秒 · 題目 全部 英文</div><button class="go" id="go">▶ 開始</button></div></div>
<div class="scr" id="play" hidden><div class="hud"><span>${G.ic}</span><span id="hx"></span><span class="sp"></span><span class="tm"><i id="tmi"></i></span><b id="tms">90</b><button class="hear" id="quit">⏹ 結束</button></div>
 <div class="field" id="field"></div>
 <div class="qp"><div class="qt" id="qt"></div><button class="hear" id="hr" hidden>🔊 Listen again</button><div class="op" id="op"></div></div></div>
<div class="scr" id="endv" hidden><div class="end" id="end"></div></div><div class="fb" id="fb"></div>
<script>var GR=${g},SET=${J(G.set)},NAME=${J(G.ic + ' ' + G.nm + '（在家）')},POOL=${J(POOL[g])},ICON=${J(ICON)};
${RT}
${key === 'castle' ? CASTLE : FISH}
intro();</script></body></html>`; }
let n = 0;
[3, 4].forEach(g => ['castle', 'fish'].forEach(k => { const f = path.join(ROOT, 'g' + g + '-review', k + '.html'); fs.writeFileSync(f, page(g, k)); n++; }));
console.log('fun ok：' + n + ' 頁（三年級 題目 ' + POOL[3].length + ' 題、四年級 ' + POOL[4].length + ' 題）');
