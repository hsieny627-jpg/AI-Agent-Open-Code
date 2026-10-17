/* rpg/_build.js — 🦸 我的英雄（rpg/index.html）：選英雄、武器、寵物、外觀寶物、經驗值、金幣、商店、圖鑑（2026-10-17 老師看完 C9（第八次）；規格 rpg/CLAUDE.md）
 *   node rpg/_build.js
 * 規則（價錢、稀有度、等級、經驗值、金幣）全部在 score/_calc.js 的 rp…（伺服器、這一頁、量測同一份）；這一頁只負責畫。
 * 圖：rpg/chars/（男 b01～b30、女 g01～g30）、rpg/weapons/w01～w30、rpg/pets/p01～p30（切法 rpg/_crop.py）；女 29 等老師換新圖（SC.RPHIDE）。
 * 登入用成績系統同一個（score/_client.js 的 home()）；買東西、換裝都送伺服器（{a:'rpg'}），平板改不了金幣。 */
const fs = require('fs'), path = require('path');
const SC = require('../score/_calc.js'), CL = require('../score/_client.js');
const CAT = { R: SC.RPR, P: SC.RPP, L: SC.RPL, T: SC.RPT, SET: SC.RPSET, HIDE: SC.RPHIDE, X: SC.RPX, C: SC.RPC };
['h', 'w', 'p'].forEach(k => Object.keys(SC.RPR[k]).forEach(id => {
  const f = path.join(__dirname, k === 'h' ? 'chars' : k === 'w' ? 'weapons' : 'pets', id + '.jpg');
  if (!fs.existsSync(f)) throw new Error('rpg：少了圖 ' + f);
}));
const html = `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>我的英雄</title>
<style>
@font-face{font-family:Andika;src:url(../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark;--gold:#FFD54A;--ok:#3BD16F;--line:#34475C}
*{box-sizing:border-box}
html,body{margin:0;background:#05070D;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;font-weight:700;-webkit-tap-highlight-color:transparent}
body{padding:0 max(12px,env(safe-area-inset-right)) 40px max(12px,env(safe-area-inset-left));touch-action:manipulation}
button{font:inherit;font-weight:700;color:#fff;cursor:pointer;touch-action:manipulation}
#rp{max-width:1280px;margin:0 auto}
.rph{display:flex;align-items:center;gap:14px;margin:10px 0}
.rph h1{margin:0;font-size:clamp(30px,4.6vh,46px);color:var(--gold);flex:1}
.home{display:inline-flex;align-items:center;gap:6px;min-height:56px;padding:6px 20px;border-radius:16px;background:#3A2E08;border:3px solid var(--gold);color:#FFE9A8;text-decoration:none;font-size:clamp(20px,2.6vh,26px)}
#rpout{text-align:center;padding:40px 10px;font-size:clamp(28px,4vh,40px)}
#rpout .big{display:inline-block;margin-top:20px;font-size:clamp(30px,4.4vh,44px);padding:12px 40px;border-radius:22px;background:#3A2E08;border:4px solid var(--gold);color:#FFE9A8;min-height:80px}
#rpwait{text-align:center;font-size:30px;padding:40px}
/* ── 舞台：我的英雄 ── */
.stage{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:18px;align-items:center;background:linear-gradient(#0E1A2C,#060A12);border:3px solid #2A3A50;border-radius:26px;padding:16px;position:relative;overflow:hidden}
.stage.bg8{background:radial-gradient(ellipse at 30% 20%,#2B1A5A,#060A1E 60%),#060A1E}
.stage.bg8::before{content:'';position:absolute;inset:0;background-image:radial-gradient(2px 2px at 10% 20%,#fff,transparent),radial-gradient(2px 2px at 30% 70%,#cfe,transparent),radial-gradient(1.5px 1.5px at 55% 30%,#fff,transparent),radial-gradient(2px 2px at 80% 60%,#fde,transparent),radial-gradient(1.5px 1.5px at 90% 15%,#fff,transparent),radial-gradient(2px 2px at 65% 85%,#fff,transparent);animation:tw 3s ease-in-out infinite alternate;pointer-events:none}
@keyframes tw{to{opacity:.4}}
@media (max-width:900px){.stage{grid-template-columns:1fr}}
.team{position:relative;isolation:isolate;display:flex;align-items:flex-end;justify-content:center;gap:10px;min-height:clamp(300px,46vh,460px);padding-top:44px}
.hc{position:relative;isolation:isolate;width:min(62%,300px);border-radius:18px;padding:5px;background:var(--rc,#8A9AAA);box-shadow:0 0 0 3px #000}
.hc img{display:block;width:100%;border-radius:14px}
.hc .stars{position:absolute;z-index:3;left:0;right:0;top:-18px;text-align:center;font-size:24px;letter-spacing:-2px;text-shadow:0 0 6px #000;color:#FFE07A}
.r3{box-shadow:0 0 18px 2px rgba(90,176,255,.7)}.r4{box-shadow:0 0 26px 4px rgba(181,123,255,.85);animation:glow4 2.4s ease-in-out infinite}
.r5{box-shadow:0 0 34px 8px rgba(255,213,74,.9);animation:glow5 2s ease-in-out infinite}
@keyframes glow4{50%{box-shadow:0 0 36px 10px rgba(181,123,255,.95)}}@keyframes glow5{50%{box-shadow:0 0 50px 16px rgba(255,170,0,1)}}
.rays{position:absolute;inset:-40%;background:conic-gradient(from 0deg,transparent 0 10deg,rgba(255,220,120,.18) 10deg 20deg,transparent 20deg 40deg,rgba(255,220,120,.18) 40deg 50deg,transparent 50deg 70deg,rgba(255,220,120,.18) 70deg 80deg,transparent 80deg);animation:spin 12s linear infinite;pointer-events:none;z-index:-1}
@keyframes spin{to{transform:rotate(360deg)}}
.wc,.pc{position:relative;border-radius:14px;padding:4px;background:var(--rc,#8A9AAA)}
.wc{width:min(26%,130px);align-self:center}.wc img,.pc img{display:block;width:100%;border-radius:10px}
.pc{width:min(28%,140px)}.pc.s0{transform:scale(.82);transform-origin:bottom}.pc.s2{animation:evo 2.4s ease-in-out infinite}
@keyframes evo{50%{filter:drop-shadow(0 0 14px #7FD4FF)}}
.pc .pst{position:absolute;left:50%;bottom:-14px;transform:translateX(-50%);white-space:nowrap;background:#0B1830;border:2px solid #7FD4FF;border-radius:999px;padding:0 10px;font-size:18px}
.empty{display:flex;align-items:center;justify-content:center;text-align:center;border:3px dashed #4A5A6C;border-radius:14px;color:#9FB3C8;font-size:20px;padding:8px;aspect-ratio:3/4}
/* 寶物外觀 */
.halo{position:absolute;z-index:2;left:50%;top:-40px;width:46%;height:26px;transform:translateX(-50%);border-radius:50%;border:6px solid #FFE07A;box-shadow:0 0 18px #FFE07A;animation:hb 2s ease-in-out infinite}
@keyframes hb{50%{transform:translate(-50%,-6px)}}
.cape{position:absolute;inset:8% -14% 2%;background:linear-gradient(160deg,#C62828,#5A0E0E);clip-path:polygon(20% 0,80% 0,100% 100%,0 100%);z-index:-1;border-radius:12px;animation:cp 3s ease-in-out infinite}
@keyframes cp{50%{clip-path:polygon(18% 0,82% 0,96% 100%,4% 100%)}}
.feet{position:absolute;left:0;right:0;bottom:-6px;height:18px;background:radial-gradient(circle,#FFE07A 30%,transparent 32%) 0 0/36px 18px repeat-x;animation:ft 1.6s linear infinite;opacity:.8}
@keyframes ft{to{background-position:36px 0}}
.fw{position:absolute;inset:0;pointer-events:none}.fw i{position:absolute;width:8px;height:8px;border-radius:50%;left:50%;top:40%;animation:fwb 1.6s ease-out forwards;background:var(--c)}
@keyframes fwb{to{transform:translate(var(--x),var(--y));opacity:0}}
.emo{position:absolute;right:-6%;top:6%;background:#fff;color:#000;border-radius:18px;padding:2px 10px;font-size:34px;animation:hb 2.4s ease-in-out infinite}
.pose{animation:pose 3.2s ease-in-out infinite}@keyframes pose{0%,70%,100%{transform:none}78%{transform:translateY(-22px) rotate(-3deg)}86%{transform:translateY(0) rotate(2deg)}}
.hat{position:absolute;left:50%;top:-30px;transform:translateX(-50%);font-size:40px}
.wglow{animation:wg 1.6s ease-in-out infinite}@keyframes wg{50%{box-shadow:0 0 22px 6px #5AF0FF}}
/* 右邊：數字 */
.stat{display:grid;gap:12px;font-size:clamp(22px,2.8vh,30px)}
.idl{display:inline-block;padding:2px 16px;border-radius:12px;background:#111;border:2px solid #333}.idl.gf{border:4px solid var(--gold);box-shadow:0 0 12px rgba(255,213,74,.6)}
.lv{display:flex;align-items:baseline;gap:12px}.lv b{font-size:clamp(46px,7vh,70px);color:var(--gold);line-height:1}
.bar{height:26px;border-radius:999px;background:#1B2633;border:3px solid #34404C;overflow:hidden}.bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#3B7BFF,#7FD4FF);transition:width 1.2s ease-out}
.coin b{font-size:clamp(40px,6vh,60px);color:#FFE07A}
.pow{color:#FFB3B3}.ttl span{display:inline-block;margin:3px 6px 3px 0;background:#2A2208;border:2px solid var(--gold);border-radius:999px;padding:0 12px;font-size:.85em}
.note{color:#9FB3C8;font-size:clamp(18px,2.2vh,22px)}
/* 分頁＋商店 */
.tabs{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 10px}
.tabs button{min-height:60px;padding:6px 18px;border-radius:16px;background:#16212D;border:3px solid var(--line);font-size:clamp(20px,2.6vh,26px)}
.tabs button.on{border-color:var(--gold);color:#FFE07A;background:#2A2208}
.sub{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}.sub button{min-height:52px;padding:4px 16px;border-radius:14px;background:#111;border:3px solid #333;font-size:20px}.sub button.on{border-color:#7FD4FF;color:#BFE6FF}
.free{background:#0F2A1C;border:3px solid var(--ok);border-radius:18px;padding:10px 16px;font-size:clamp(22px,2.8vh,28px);margin-bottom:10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(46%,170px),1fr));gap:12px}
.it{position:relative;display:flex;flex-direction:column;align-items:stretch;gap:4px;border-radius:16px;padding:6px;background:#0E1724;border:3px solid var(--rc,#34475C);min-height:120px;text-align:center}
.it img{width:100%;border-radius:10px;display:block}.it .st{font-size:18px;color:#FFE07A;letter-spacing:-1px}
.it .pr{font-size:20px;border-radius:10px;padding:2px 4px;background:#111}.it .pr.lock{color:#FF9F9F}.it .pr.ok{color:#7BF0A8}.it .pr.eq{background:#1B4A2E;color:#fff}.it .pr.fr{background:#0F2A1C;color:#7BF0A8}
.it.dim img{filter:grayscale(.75) brightness(.6)}
.it.eqd{box-shadow:0 0 0 4px #3BD16F}
.tre{font-size:44px;line-height:1.3}.tre small{display:block;font-size:20px}
.how table{border-collapse:collapse;width:100%;font-size:clamp(20px,2.6vh,26px)}.how td,.how th{border:2px solid #2A3540;padding:8px 12px;text-align:left;vertical-align:middle}.how th{background:#14202B}
.set{display:flex;flex-wrap:wrap;align-items:center;gap:8px;border:2px solid #34475C;border-radius:16px;padding:8px 12px;margin:8px 0;font-size:22px}.set.ok{border-color:var(--gold);background:#2A2208}
.set img{width:64px;border-radius:8px}.set img.no{filter:grayscale(1) brightness(.4)}
/* 對話框 */
#rpm{position:fixed;inset:0;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;z-index:50;padding:16px}
#rpm.on{display:flex}
#rpm .box{background:#0B1118;border:4px solid var(--gold);border-radius:26px;padding:20px;max-width:560px;width:100%;text-align:center;font-size:clamp(24px,3vh,32px);position:relative;overflow:hidden}
#rpm .box img{width:min(60%,240px);border-radius:14px}
#rpm .bt{display:flex;gap:12px;justify-content:center;margin-top:14px;flex-wrap:wrap}#rpm .bt button{min-height:64px;padding:6px 26px;border-radius:18px;font-size:clamp(24px,3vh,30px);border:3px solid}
#rpm .yes{background:#0F3323;border-color:var(--ok)}#rpm .no{background:#1B2633;border-color:#4A5A6C}
#rpm.cele .box img{animation:pop .8s cubic-bezier(.2,1.6,.4,1)}@keyframes pop{from{transform:scale(.2) rotate(-20deg);opacity:0}}
</style></head><body>
${CL.home(0, '../', 'home')}
<main id="rp">
 <header class="rph"><a class="home" href="../index.html">🏠 回首頁</a><h1>🦸 我的 英雄</h1></header>
 <div id="rpout" hidden><div>🔑 先 登入 ➜ 才看得到 你的 英雄</div><button class="big" id="rpIn">🔑 登入</button><div class="note" style="margin-top:20px">⭐ 經驗值、🪙 金幣 都是 從 你的 練習 算出來的：練得愈多、改對愈多，就可以 換 愈酷 的 英雄！</div></div>
 <div id="rpwait" hidden>⏳ 正在拿 你的 英雄…</div>
 <div id="rpin" hidden>
  <section class="stage" id="stage"></section>
  <nav class="tabs" id="tabs"><button data-t="h" class="on">🦸 英雄</button><button data-t="w">⚔ 武器</button><button data-t="p">🐾 寵物</button><button data-t="t">✨ 寶物</button><button data-t="s">📖 圖鑑</button><button data-t="q">❓ 怎麼賺</button></nav>
  <section id="shop"></section>
 </div>
</main>
<div id="rpm"><div class="box" id="rpmb"></div></div>
<script>
var CAT=${JSON.stringify(CAT)};
var RV=null,TAB='h',SEX='b',LAST='',BUSY=false;
var DIR={h:'chars',w:'weapons',p:'pets'},RC=['#34475C','#8A9AAA','#3BD16F','#5AB0FF','#B57BFF','#FFD54A'],RN=['','普通','稀有','史詩','傳說','神話'];
function kOf(id){return /^[bg]\\d\\d$/.test(id)?'h':/^w/.test(id)?'w':/^p/.test(id)?'p':'t'}
function star(id){var k=kOf(id);return k==='t'?0:(CAT.R[k][id]||0)}
function img(id){return DIR[kOf(id)]+'/'+id+'.jpg'}
function stars(n){var s='';for(var i=0;i<n;i++)s+='★';return s}
function tre(id){for(var i=0;i<CAT.T.length;i++)if(CAT.T[i][0]===id)return CAT.T[i];return null}
function price(id){var k=kOf(id);return k==='t'?tre(id)[2]:CAT.P[star(id)]}
function need(id){return kOf(id)==='t'?1:CAT.L[star(id)]}
function own(id){return !!RV&&RV.st.own[kOf(id)].indexOf(id)>=0}
function isEq(id){var k=kOf(id);return !!RV&&(k==='t'?RV.st.eq.t.indexOf(id)>=0:RV.st.eq[k]===id)}
function freeOk(id){var k=kOf(id);return !!RV&&k!=='t'&&star(id)===1&&!RV.st.free[k]&&!RV.st.own[k].length}
function show(id){document.getElementById(id).hidden=false}function hide(id){document.getElementById(id).hidden=true}
/* ── 舞台 ── */
function drawStage(){var V=RV,e=V.st.eq,T=e.t,has=function(t){return T.indexOf(t)>=0},h='';
  var st=document.getElementById('stage');st.className='stage'+(has('t08')?' bg8':'');
  h+='<div class="team">';
  if(e.h){var s=star(e.h);h+='<div class="hc r'+s+(has('t07')?' pose':'')+'" style="--rc:'+RC[s]+'">'+(s>=5?'<div class="rays"></div>':'')+(has('t02')?'<div class="cape"></div>':'')+(has('t01')?'<div class="halo"></div>':'')+
    '<div class="stars">'+stars(s)+'</div><img src="'+img(e.h)+'" alt="我的英雄">'+(has('t06')?'<div class="emo">😎</div>':'')+(has('t03')?'<div class="feet"></div>':'')+(has('t04')?fwHTML():'')+'</div>'}
  else h+='<div class="hc empty" style="width:min(62%,300px)">🦸<br>還沒有英雄<br>👇 下面 免費 選 1 個</div>';
  h+='<div style="display:flex;flex-direction:column;gap:16px;width:min(30%,150px)">';
  h+=e.w?'<div class="wc r'+star(e.w)+(has('t10')?' wglow':'')+'" style="--rc:'+RC[star(e.w)]+';width:100%"><img src="'+img(e.w)+'" alt="我的武器"></div>':'<div class="empty">⚔<br>還沒有武器</div>';
  h+=e.p?'<div class="pc s'+V.petStage+'" style="--rc:'+RC[star(e.p)]+';width:100%">'+(has('t09')?'<div class="hat">🎩</div>':'')+'<img src="'+img(e.p)+'" alt="我的寵物"><span class="pst">'+['🐣 寶寶','🐥 長大了','🐲 進化了'][V.petStage]+'</span></div>':'<div class="empty">🐾<br>還沒有寵物</div>';
  h+='</div></div>';
  var pct=Math.max(0,Math.min(100,(V.xp-V.lvAt)/(V.lvNext-V.lvAt)*100));
  h+='<div class="stat"><div><span class="idl'+(has('t05')?' gf':'')+'">🪪 '+SCID+'</span></div>'+
    '<div class="lv"><span>⭐ 等級</span><b>Lv '+V.lv+'</b></div><div class="bar"><i id="xpb" data-w="'+pct.toFixed(1)+'"></i></div><div class="note">經驗值 '+V.xp+'（再 '+(V.lvNext-V.xp)+' 升到 Lv '+(V.lv+1)+'）</div>'+
    '<div class="coin">🪙 金幣 <b>'+V.coins+'</b></div><div class="pow">⚔ 戰力 '+V.power+'（全班 打魔王 時 打得 比較痛）</div>'+
    (e.p?'<div class="note">🐾 寵物 陪你 練了 '+V.petDays+' 天：3 天 長大、7 天 進化（天天練 就會長大）</div>':'')+
    (V.medal?'<div class="ttl">🏅 勳章 ✕ '+V.medal+'（⚡ 現場任務）</div>':'')+(V.titles.length?'<div class="ttl">🏷 稱號 '+V.titles.map(function(t){return '<span>'+t+'</span>'}).join('')+'</div>':'')+
    (V.chests?'<div class="note">🎁 每週 保底 寶箱 已經 拿到 '+V.chests+' 個（＋'+V.chests*CAT.C.chest+' 金幣）</div>':'')+'</div>';
  st.innerHTML=h;setTimeout(function(){var b=document.getElementById('xpb');if(b)b.style.width=b.getAttribute('data-w')+'%'},60)}
function fwHTML(){var h='<div class="fw">',C=['#FFD54A','#FF6B6B','#7FD4FF','#7BF0A8','#D9A8FF'];for(var i=0;i<24;i++){var a=i/24*Math.PI*2,r=90+Math.random()*60;h+='<i style="--c:'+C[i%5]+';--x:'+Math.round(Math.cos(a)*r)+'px;--y:'+Math.round(Math.sin(a)*r)+'px;animation-delay:'+(i%3*.15)+'s"></i>'}return h+'</div>'}
/* ── 商店 ── */
function itemHTML(id){var k=kOf(id),s=star(id),o=own(id),eq=isEq(id),fr=!o&&freeOk(id),lk=!o&&RV.lv<need(id),pr=price(id),poor=!o&&!fr&&RV.coins<pr;
  var tag=eq?'<div class="pr eq">✅ 裝備中</div>':o?'<div class="pr ok">👆 點一下 裝上</div>':fr?'<div class="pr fr">🎁 免費</div>':lk?'<div class="pr lock">🔒 要 Lv '+need(id)+'</div>':'<div class="pr'+(poor?' lock':'')+'">🪙 '+pr+'</div>';
  if(k==='t'){var t=tre(id);return '<button class="it'+(eq?' eqd':'')+'" data-id="'+id+'"><div class="tre">'+t[1].split(' ')[0]+'<small>'+t[1].split(' ').slice(1).join(' ')+'</small></div>'+tag+'</button>'}
  return '<button class="it'+(eq?' eqd':'')+(lk||poor?' dim':'')+'" data-id="'+id+'" style="--rc:'+RC[s]+'"><img loading="lazy" src="'+img(id)+'" alt="'+id+'"><div class="st">'+stars(s)+' '+RN[s]+'</div>'+tag+'</button>'}
function ids(k){var a=Object.keys(CAT.R[k]).filter(function(id){return !CAT.HIDE[id]&&(k!=='h'||id.charAt(0)===SEX)});
  return a.sort(function(x,y){return (CAT.R[k][x]-CAT.R[k][y])||(x<y?-1:1)})}
function drawShop(){var S=document.getElementById('shop'),h='';
  if(TAB==='h'||TAB==='w'||TAB==='p'){var k=TAB,nm={h:'英雄',w:'武器',p:'寵物'}[k];
    if(!RV.st.own[k].length&&!RV.st.free[k])h+='<div class="free">🎁 第一個 '+nm+' 免費：選 1 個 ★ 普通 的 '+nm+'！之後 用 🪙 金幣 換 更酷 的。</div>';
    if(k==='h')h+='<div class="sub"><button data-sex="b" class="'+(SEX==='b'?'on':'')+'">👦 男生 英雄</button><button data-sex="g" class="'+(SEX==='g'?'on':'')+'">👧 女生 英雄</button></div>';
    h+='<div class="note" style="margin-bottom:8px">★ 普通 50　★★ 稀有 150　★★★ 史詩 400（Lv 5）　★★★★ 傳說 900（Lv 10）　★★★★★ 神話 2000（Lv 20）</div>';
    h+='<div class="grid">'+ids(k).map(itemHTML).join('')+'</div>'}
  else if(TAB==='t')h+='<div class="note" style="margin-bottom:8px">✨ 寶物 只換 外觀（不加分數）。買了 會 自動 戴上；再 點一下 ＝ 拿下來／戴上。</div><div class="grid">'+CAT.T.map(function(t){return itemHTML(t[0])}).join('')+'</div>';
  else if(TAB==='s'){var all=RV.st.own.h.concat(RV.st.own.w,RV.st.own.p);
    h+='<div class="note">📖 集滿 一套 ＝ 拿到 稱號（亮起來）：</div>'+CAT.SET.map(function(x){var ok=x[1].every(function(id){return all.indexOf(id)>=0});
      return '<div class="set'+(ok?' ok':'')+'"><b style="min-width:8em">'+(ok?'✅ ':'')+x[0]+'</b>'+x[1].map(function(id){return '<img src="'+img(id)+'" class="'+(all.indexOf(id)>=0?'':'no')+'" alt="'+id+'">'}).join('')+'</div>'}).join('')}
  else h+='<div class="how"><table><tr><th style="width:34%">怎麼 拿</th><th>拿到 多少</th></tr>'+
    '<tr><td>📝 做完 一次 題目、遊戲（練習次數 ＋1）</td><td>⭐ 經驗值 ＋'+CAT.X.rec+'</td></tr><tr><td>🎧 聽完 一站 字卡</td><td>⭐ 經驗值 ＋'+CAT.X.rec+'</td></tr><tr><td>📅 那一天 第一次 練</td><td>⭐ 經驗值 ＋'+CAT.X.day+'（天天練 最划算）</td></tr>'+
    '<tr><td>✅ 第一次 就 答對 1 題</td><td>🪙 金幣 ＋1</td></tr><tr><td>✗➜✓ 答錯 以後 改對 1 題</td><td>🪙 金幣 ＋'+CAT.C.fix+'（改錯 最多 金幣！）</td></tr><tr><td>⬆ 同一組 比 自己 上一次 進步</td><td>🪙 金幣 ＋'+CAT.C.prog+'</td></tr>'+
    '<tr><td>🎁 這一週 練了 '+CAT.C.chestDays+' 天 以上</td><td>保底 寶箱 🪙 ＋'+CAT.C.chest+'（每一個 肯練 的 人 都 拿得到）</td></tr>'+
    '<tr><td>⚠️ 太快 亂按</td><td>那一次 沒有 金幣</td></tr><tr><td>🪙 一天 最多</td><td>'+CAT.C.cap+' 金幣（練 太久 不會 一直 賺）</td></tr>'+
    '<tr><td>🚫 不可以</td><td>交易、搶 別人 的、抽獎；買到 的 東西 <b>不加 分數、不會 讓 題目 變簡單</b></td></tr></table>'+
    '<p class="note">⭐ 經驗值 只會 升，不會 被 花掉；等級 夠 才 換得到 ★★★ 以上。🐾 寵物 陪你 練 3 天 長大、7 天 進化。</p></div>';
  S.innerHTML=h}
function draw(){drawStage();drawShop()}
/* ── 伺服器 ── */
function load(){if(!SCON){hide('rpin');hide('rpwait');show('rpout');return}
  if(!SCID||!scAsked()){RV=null;hide('rpin');hide('rpwait');show('rpout');return}
  hide('rpout');if(!RV)show('rpwait');var id=SCID;
  scFetch('a=rpg&id='+id,null,9000).then(function(j){if(id!==SCID)return;hide('rpwait');if(j&&j.ok){RV=j.v;show('rpin');draw()}else msg('📶 拿不到 你的 英雄，等一下 再 試',1)},function(){hide('rpwait');msg('📶 現在 沒有 網路，等一下 再 試',1)})}
function msg(t,x){var m=document.getElementById('rpm');m.className='on';document.getElementById('rpmb').innerHTML='<div>'+t+'</div><div class="bt"><button class="no" data-m="x">👌 知道了</button></div>'}
function ask(id){var k=kOf(id),fr=freeOk(id),pr=fr?0:price(id),t=k==='t'?tre(id)[1]:'';
  if(RV.lv<need(id)){msg('🔒 要 <b>Lv '+need(id)+'</b> 才 換得到<br><span class="note">現在 Lv '+RV.lv+'：多 練習 就會 升級 ⭐</span>');return}
  if(!fr&&RV.coins<pr){msg('🪙 還差 <b>'+(pr-RV.coins)+'</b> 金幣<br><span class="note">答對、改對、進步 都會 拿到 金幣</span>');return}
  var m=document.getElementById('rpm');m.className='on';
  document.getElementById('rpmb').innerHTML=(k==='t'?'<div class="tre" style="font-size:80px">'+t.split(' ')[0]+'</div><div>'+t+'</div>':'<img src="'+img(id)+'" alt="'+id+'"><div style="color:'+RC[star(id)]+'">'+stars(star(id))+' '+RN[star(id)]+'</div>')+
    '<div style="margin-top:8px">'+(fr?'🎁 免費 選 這一個？':'用 <b>🪙 '+pr+'</b> 換 這一個？')+'</div><div class="bt"><button class="yes" data-m="buy" data-id="'+id+'">✅ 換</button><button class="no" data-m="x">✕ 不要</button></div>'}
function act(op,id){if(BUSY)return;BUSY=true;var me=SCID;
  scFetch('',{a:'rpg',id:me,op:op,item:id},12000).then(function(j){BUSY=false;if(me!==SCID)return;
    if(j&&j.v)RV=j.v;
    if(j&&j.ok){draw();if(op==='buy')cele(id);else document.getElementById('rpm').className=''}
    else msg(j&&j.err==='coin'?'🪙 金幣 不夠':j&&j.err==='lv'?'🔒 等級 不夠':'❌ 沒有 換成（'+((j&&j.err)||'')+'）')},
   function(){BUSY=false;msg('📶 現在 沒有 網路，沒有 換')})}
function cele(id){var k=kOf(id),m=document.getElementById('rpm');m.className='on cele';
  document.getElementById('rpmb').innerHTML=fwHTML()+(k==='t'?'<div class="tre" style="font-size:90px">'+tre(id)[1].split(' ')[0]+'</div>':'<img src="'+img(id)+'" alt="'+id+'">')+
    '<div style="font-size:1.2em;color:#FFE07A;margin-top:8px">🎉 換到了！已經 裝上</div><div class="bt"><button class="yes" data-m="x">👌 好</button></div>'}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#rpIn')){scLogin(function(){SCH.close();scBar();load()});return}
  if((b=c('#tabs button'))){TAB=b.getAttribute('data-t');[].forEach.call(document.querySelectorAll('#tabs button'),function(x){x.classList.toggle('on',x===b)});drawShop();return}
  if((b=c('[data-sex]'))){SEX=b.getAttribute('data-sex');drawShop();return}
  if((b=c('#shop [data-id]'))){var id=b.getAttribute('data-id');if(own(id)){if(kOf(id)==='t'||!isEq(id))act('eq',id)}else ask(id);return}
  if((b=c('[data-m]'))){var w=b.getAttribute('data-m');if(w==='buy')act('buy',b.getAttribute('data-id'));else document.getElementById('rpm').className='';return}
  if(t.id==='rpm')document.getElementById('rpm').className='';
});
/* 登入、登出、換人：每 0.8 秒看一次 */
setInterval(function(){var k=(SCID||'')+'|'+(SCID&&scAsked()?1:0);if(k!==LAST){LAST=k;RV=null;load()}},800);
</script>
</body></html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('rpg ok：英雄 ' + Object.keys(SC.RPR.h).filter(x => !SC.RPHIDE[x]).length + '、武器 ' + Object.keys(SC.RPR.w).length + '、寵物 ' + Object.keys(SC.RPR.p).length + '、寶物 ' + SC.RPT.length);
