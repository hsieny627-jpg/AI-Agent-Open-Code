/* sentences/_shared.js — 五頁共用的樣板、配色、發音、語速
 * 改版面只改這一個檔，跑 node sentences/_build.js 全部重出。
 *
 * iPad ／ 任何瀏覽器 100% 流暢的六條做法（不要拿掉）：
 *  1. touch-action:manipulation ＋ user-select:none  → 連點兩下不會放大、不會選到字
 *  2. position:fixed 撐版面 ＋ safe-area  → iPad 直橫轉都不會被瀏海和圓角切到
 *  3. 只用 CSS transform／opacity 做動畫  → 不觸發 reflow，60fps
 *  4. 不用 :has()、.at()、??=、structuredClone  → iOS 14 以上都跑得動
 *  5. 發音第一次一定由「使用者點一下」觸發（iOS 不給自動播）
 *  6. 尺寸全用 clamp() ＋ vh/vw 雙限，1024×768 與 820×1180 都不溢出
 */

/* ══ 答錯的獨立頁（使用者 2026-09-24 指定）══════════════════════════════
 * 暖身題、複習題、遊戲共用。答錯的那一刻蓋上一整頁：
 *   ❌ 你選的（紅色，錯的那幾個字框起來）
 *   ✅ 正確答案（綠色、最大、粗體，改對的那幾個字金色閃）
 *   💡 為什麼（一句話）
 * **倒數 3 秒才會消失**，這 3 秒不能跳過——強迫學生看清楚「哪裡錯、為什麼、正確是什麼」。
 * 結束的時候 missAll() 再蓋一整頁「答錯整理」：每一題都再列一次，一題一張卡。
 */
const MISSCSS = `
#miss,#missAll{position:fixed;inset:0;z-index:95;background:#000;display:none;flex-direction:column;
 align-items:center;padding:calc(var(--safeT) + clamp(10px,2vh,24px)) clamp(14px,3vw,40px)
 calc(var(--safeB) + clamp(10px,2vh,24px));overflow-y:auto}
#miss.on,#missAll.on{display:flex}
#miss .mbox,#missAll .mbox{width:100%;max-width:1060px;margin:auto 0;display:flex;flex-direction:column;
 gap:clamp(8px,1.6vh,18px)}
.mhd{display:flex;align-items:center;justify-content:center;gap:clamp(12px,2vw,26px)}
.mhd .mt{font-size:clamp(30px,6.4vh,62px);font-weight:700;color:var(--no);
 animation:mShake .5s cubic-bezier(.3,.8,.3,1)}
@keyframes mShake{0%,100%{transform:none}20%{transform:translateX(-14px)}40%{transform:translateX(12px)}
 60%{transform:translateX(-8px)}80%{transform:translateX(5px)}}
.mrow{display:flex;align-items:center;gap:clamp(10px,1.8vw,22px);background:#0B0B0B;border:1px solid #222;
 border-left-width:10px;border-radius:16px;padding:clamp(8px,1.5vh,16px) clamp(12px,1.8vw,24px);
 opacity:0;animation:mIn .45s cubic-bezier(.2,.9,.3,1.2) forwards}
@keyframes mIn{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:none}}
.mrow .ml{flex:0 0 auto;width:clamp(86px,12vw,150px);font-size:clamp(15px,2.5vh,24px);font-weight:700;
 color:var(--dim);line-height:1.25}
.mrow .mv{flex:1 1 auto;min-width:0;line-height:1.3;overflow-wrap:anywhere}
.mrow.q{border-left-color:#44586A}.mrow.q .mv{font-size:clamp(19px,3.4vh,34px);color:var(--body)}
.mrow.p{border-left-color:var(--no);animation-delay:.25s}
.mrow.p .mv{font-size:clamp(23px,4.6vh,46px);color:#FF9C9C}
.mrow.a{border-left-color:var(--ok);background:#07190F;animation-delay:.6s}
.mrow.a .mv{font-size:clamp(30px,7vh,70px);font-weight:700;color:var(--ok)}
.mrow.w{border-left-color:var(--gold);animation-delay:1s}
.mrow.w .mv{font-size:clamp(19px,3.5vh,34px);color:var(--fg)}
.mrow.w .mv b{color:var(--gold)}
.mrow .x{border-radius:8px;padding:0 .12em;background:rgba(255,94,94,.28);color:#fff;
 text-decoration:line-through;text-decoration-color:var(--no);text-decoration-thickness:.1em}
.mrow .f{border-radius:8px;padding:0 .12em;background:var(--gold);color:#000;
 display:inline-block;animation:mFix 1.1s ease-in-out .9s 2}
@keyframes mFix{0%,100%{transform:none}50%{transform:scale(1.18)}}
.mrow .say{flex:0 0 auto;background:#10301F;border:1px solid var(--ok);border-radius:999px;
 font-size:clamp(14px,2.2vh,20px);padding:clamp(6px,1vh,10px) clamp(10px,1.4vw,16px);color:#fff}
.mcd{display:flex;align-items:center;justify-content:center;gap:12px;
 font-size:clamp(15px,2.4vh,22px);color:var(--dim)}
.mcd b{display:inline-flex;align-items:center;justify-content:center;width:clamp(46px,7vh,70px);
 height:clamp(46px,7vh,70px);border-radius:50%;border:4px solid var(--gold);color:var(--gold);
 font-size:clamp(24px,4.4vh,42px)}
.mcd b.tick{animation:mTick .9s ease}
@keyframes mTick{0%{transform:scale(1.35)}100%{transform:none}}
#missAll h2{margin:0;text-align:center;font-size:clamp(26px,5vh,48px)}
#missAll .lead{margin:0;text-align:center;font-size:clamp(15px,2.4vh,22px);color:var(--dim)}
.mcard{display:flex;flex-direction:column;gap:clamp(6px,1.1vh,12px);border:1px solid #262626;border-radius:20px;
 padding:clamp(10px,1.8vh,18px);background:#050505;opacity:0;animation:mIn .45s cubic-bezier(.2,.9,.3,1.2) forwards}
.mcard .mn{font-size:clamp(14px,2.2vh,20px);color:var(--acc);font-weight:700;letter-spacing:.1em}
.mcard .mrow{opacity:1;animation:none}
.mbtns{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:clamp(4px,1vh,10px)}
.mbtns button{background:#0F3323;border:1px solid var(--ok);border-radius:999px;color:#fff;font-weight:700;
 font-size:clamp(17px,2.8vh,26px);padding:clamp(10px,1.6vh,16px) clamp(20px,3vw,36px)}
`;

const HEAD = (title, extraCss) => `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="theme-color" content="#000000">
<title>${title}</title>
<!-- 本檔由 sentences/_build.js 產生，不要手改。改內容請改 sentences/_data.js ／ _quiz_data.js ／ _game_data.js -->
<style>
@font-face{font-family:Andika;font-style:normal;font-weight:400;font-display:swap;
 src:url(../words/fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-style:normal;font-weight:700;font-display:swap;
 src:url(../words/fonts/andika-700.woff2) format("woff2")}

:root{
 --bg:#000; --fg:#F2F2F2; --body:#D8D3C5; --dim:#9E9E9E; --acc:#9FB4C8;
 --btn:#1E1E1E; --line:#4A4A4A;
 --he:#2563EB; --she:#E8467C; --be:#F5B301; --ap:#FF4A4A;
 --ok:#39D98A; --no:#FF5E5E; --gold:#FFD24A;
 --safeT:env(safe-area-inset-top,0px); --safeB:env(safe-area-inset-bottom,0px);
 --safeL:env(safe-area-inset-left,0px); --safeR:env(safe-area-inset-right,0px);
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%;margin:0;overscroll-behavior:none}
body{background:var(--bg);color:var(--fg);
 font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif;
 font-weight:400;overflow:hidden;user-select:none;-webkit-user-select:none;
 touch-action:manipulation;-webkit-text-size-adjust:100%}
button{font-family:inherit;color:inherit;background:none;border:0;padding:0;
 cursor:pointer;touch-action:manipulation}

/* 底部按鈕列：每一頁都一樣 */
#bar{position:fixed;left:0;right:0;bottom:0;z-index:40;
 display:flex;flex-wrap:wrap;gap:clamp(5px,.9vh,9px);justify-content:center;align-items:center;
 padding:clamp(6px,1vh,10px) calc(var(--safeR) + 10px) calc(clamp(6px,1vh,10px) + var(--safeB)) calc(var(--safeL) + 10px);
 background:linear-gradient(180deg,rgba(0,0,0,0) 0%,#000 46%)}
#bar button,#bar a{display:inline-flex;align-items:center;gap:5px;
 background:var(--btn);border:1px solid #333;border-radius:999px;color:var(--body);
 text-decoration:none;font-size:clamp(12.5px,1.85vh,16px);line-height:1;
 padding:clamp(7px,1.15vh,11px) clamp(10px,1.5vw,16px);white-space:nowrap;
 transition:border-color .15s,color .15s,background .15s}
#bar button.on{background:#2C3A48;border-color:var(--acc);color:#fff}
#bar button:active,#bar a:active{transform:scale(.96)}
#bar .grp{display:inline-flex;gap:3px;background:#101010;border:1px solid #2A2A2A;
 border-radius:999px;padding:3px}
#bar .grp button{border:0;background:none;padding:clamp(6px,1vh,9px) clamp(8px,1.2vw,13px);
 font-size:clamp(12px,1.75vh,15px)}
#bar .grp button.on{background:var(--acc);color:#000;font-weight:700}
#bar .grp .glbl{display:inline-flex;align-items:center;padding:0 4px 0 9px;
 font-size:clamp(11px,1.6vh,14px);color:#6E6E6E;letter-spacing:.06em;white-space:nowrap}

/* 左右翻頁：整條邊都可以按，最小 68px（使用者指定） */
.nav{position:fixed;top:0;bottom:0;width:clamp(68px,9vw,104px);z-index:30;
 display:flex;align-items:center;justify-content:center;
 font-size:clamp(30px,5vh,46px);color:#3A3A3A;background:transparent;
 transition:color .15s,background .15s}
.nav.l{left:0;padding-left:var(--safeL)}
.nav.r{right:0;padding-right:var(--safeR)}
.nav:active{color:var(--acc);background:rgba(159,180,200,.08)}
.nav[disabled]{color:#1A1A1A;background:none}
.nav b{display:block;font-size:clamp(9.5px,1.35vh,12px);font-weight:400;
 letter-spacing:.1em;color:inherit;margin-top:4px;opacity:.75}
.nav i{font-style:normal;display:block;line-height:1}

/* 進度點 */
#dots{position:fixed;left:50%;transform:translateX(-50%);z-index:35;
 top:calc(var(--safeT) + clamp(8px,1.4vh,14px));
 display:flex;gap:clamp(4px,.7vw,8px);max-width:78vw;flex-wrap:wrap;justify-content:center}
#dots i{width:clamp(6px,.9vh,9px);height:clamp(6px,.9vh,9px);border-radius:50%;
 background:#2C2C2C;display:block}
#dots i.on{background:var(--acc);transform:scale(1.35)}

.ap{color:var(--ap);font-weight:700}
${MISSCSS}
.reduce *{animation:none!important;transition:none!important}
${extraCss || ''}
</style>
</head>
<body>`;

/* 發音：標準美式 en-US，可放慢；中文用 zh-TW。iOS 第一次一定要由點擊觸發
 *
 * 2026-09-21 使用者回報三件事，這一版全部修掉（不要改回去）：
 *  ① 自動播時「某些英文單字發音不見、整句發音延遲」
 *     → 原因：舊版每次 say() 都先 speechSynthesis.cancel()，前一個字被砍掉。
 *       現在改成「排隊」：say(字,null,{keep:1}) 會排在後面，一個講完才講下一個。
 *  ② 點英文句子、點「念一次」沒聲音
 *     → 原因：Chrome／Edge 的老 bug —— cancel() 之後馬上 speak() 會被吃掉。
 *       現在 cancel() 之後等 90ms 再講，而且有看門狗（卡住就自己救回來）。
 *  ③ ＝ 等號不可以發音（使用者指定）
 *     → sayText() 把 ＝ = ➜ … ＿ _ 這些符號一律拿掉，唸不出來就不唸。
 */
const TTS = `
var RATE=0.9, SLOW=true, VOX=null, VOXZH=null;
/* 語速可調整（使用者 2026-09-21 指定）：0.5 0.6 0.7 0.8 0.9 1.0，1.0 ＝ 正常語速。
   SLOW 只用來決定動畫要不要等久一點（0.8 以下算慢）。 */
function setRate(r){r=parseFloat(r);if(!(r>0))r=0.9;
 RATE=Math.max(0.5,Math.min(1,r));SLOW=RATE<=0.8;return RATE}
var SQ=[],SBUSY=false,SID=0,SLAST=0;
function pickVoice(){try{var v=speechSynthesis.getVoices();if(!v||!v.length)return;
 /* 離線上課（使用者 2026-09-24 指定）：沒有網路的時候，只能用「電腦內建」的語音——
    Google／Edge 的線上語音離線會沒聲音。所以離線時先把線上語音拿掉。 */
 var off=false;try{off=(navigator.onLine===false)}catch(e){}
 if(off){var loc=v.filter(function(x){return x.localService!==false});if(loc.length)v=loc}
 VOX=null;VOXZH=null;
 var en=v.filter(function(x){return /^en[-_]US/i.test(x.lang)});
 if(!en.length)en=v.filter(function(x){return /^en/i.test(x.lang)});
 var pref=['Samantha','Ava','Allison','Alex','Google US English','Microsoft Zira','Microsoft Aria'];
 for(var i=0;i<pref.length;i++){for(var j=0;j<en.length;j++)if(en[j].name.indexOf(pref[i])>=0){VOX=en[j];break}if(VOX)break}
 if(!VOX&&en.length)VOX=en[0];
 var zh=v.filter(function(x){return /^zh[-_](TW|HK|CN)/i.test(x.lang)});
 if(zh.length)VOXZH=zh[0];}catch(e){}}
pickVoice();
try{speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
try{window.addEventListener('online',pickVoice);window.addEventListener('offline',pickVoice)}catch(e){}

/* 唸出來以前先洗一次：＝ ➜ ＿ 這些符號不發音（使用者指定） */
function sayText(s){
 return String(s).replace(/[\\u2019]/g,"'")
  .replace(/[=\\uFF1D\\u2260\\u279C\\u2192\\u21D2\\u2026\\uFF3F_\\u3000]+/g,' ')
  .replace(/\\s+/g,' ').trim();
}
/* 真正送出一句 */
function pump(){
 if(SBUSY)return;
 var it=SQ.shift();if(!it)return;
 var t=sayText(it.t);
 if(!t){if(it.done)try{it.done()}catch(e){};setTimeout(pump,0);return}
 var u;try{u=new SpeechSynthesisUtterance(t)}catch(e){if(it.done)try{it.done()}catch(e2){};return}
 if(it.l==='zh'){u.lang='zh-TW';if(VOXZH)u.voice=VOXZH;u.rate=RATE}
 else{u.lang='en-US';if(VOX)u.voice=VOX;u.rate=RATE}
 u.pitch=1;
 var mine=++SID;SBUSY=true;SLAST=Date.now();
 /* 念到哪個字，那個字就亮（使用者 2026-09-24 指定）：
    有 onboundary 的瀏覽器照真正的時間亮；沒有的（部分 Chrome 線上語音、iPad 舊版）
    就照字母數估時間一個一個亮過去。第一個真的 boundary 一來，估算就停掉。 */
 var ws=[],wm,wre=/\\S+/g;while((wm=wre.exec(t)))ws.push({s:wm.index,n:wm[0].replace(/[^A-Za-z]/g,'').length});
 var hk=-2,gotB=false,ft=null,began=false;
 var mark=function(k){if(!it.hl||k===hk)return;hk=k;try{it.hl(k)}catch(e){}};
 var est=function(k){var n=ws[k]?ws[k].n:3;return (140+62*Math.max(1,n))/RATE};
 var step=function(){if(gotB||mine!==SID)return;var k=hk+1;
  if(k<ws.length){mark(k);ft=setTimeout(step,est(k))}};
 var begin=function(){if(began)return;began=true;
  if(it.start)try{it.start()}catch(e){}
  if(it.hl){mark(0);ft=setTimeout(step,est(0))}};
 u.onstart=begin;
 u.onboundary=function(e){if(!it.hl||mine!==SID)return;
  if(e&&e.name&&e.name!=='word')return;
  gotB=true;if(ft){clearTimeout(ft);ft=null}begin();
  var c=e&&typeof e.charIndex==='number'?e.charIndex:0,k=0;
  for(var q=0;q<ws.length;q++)if(ws[q].s<=c)k=q;
  mark(k)};
 var fin=function(){if(ft){clearTimeout(ft);ft=null}
  if(it.hl&&hk!==-1){hk=-1;try{it.hl(-1)}catch(e){}}
  if(mine!==SID)return;SID++;SBUSY=false;SLAST=Date.now();
  if(it.done)try{it.done()}catch(e){}
  setTimeout(pump,60)};
 u.onend=fin;u.onerror=fin;
 try{speechSynthesis.speak(u)}catch(e){fin()}
 /* 有些瀏覽器不發 onstart：0.35 秒還沒開始就自己開始亮 */
 setTimeout(function(){if(mine===SID&&SBUSY)begin()},350);
}
/* say(句子)            ＝ 馬上講，砍掉還沒講完的
   say(字,null,{keep:1}) ＝ 排隊，前一個講完才講（自動播、逐字用這個）
   say(句子,null,{done:fn}) ＝ 講完再做一件事
   say(句子,null,{hl:fn})   ＝ 念到第 k 個字就呼叫 fn(k)，念完呼叫 fn(-1)（念到哪亮到哪）
   say(句子,null,{start:fn})＝ 真的開始出聲的那一刻呼叫 fn */
function say(txt,lang,opt){
 opt=opt||{};
 if(!txt||!sayText(txt)){if(opt.done)opt.done();return}
 var item={t:txt,l:lang,done:opt.done,hl:opt.hl,start:opt.start};
 if(opt.keep){if(SQ.length>4)SQ.length=4;SQ.push(item);pump();return}
 SQ.length=0;SID++;SBUSY=false;
 if(window.HLCLR)try{HLCLR()}catch(e){}
 try{speechSynthesis.cancel()}catch(e){}
 SQ.push(item);
 /* Chrome／Edge：cancel() 之後馬上 speak() 會被吃掉，等 90ms 再講 */
 setTimeout(pump,90);
}
function sayZh(t,opt){say(t,'zh',opt)}
function sayStop(){SQ.length=0;SID++;SBUSY=false;if(window.HLCLR)try{HLCLR()}catch(e){}
 try{speechSynthesis.cancel()}catch(e){}}
/* 看門狗：瀏覽器有時候不發 onend（或講到一半自己停住），卡住就救回來 */
setInterval(function(){
 try{
  if(speechSynthesis.speaking&&!speechSynthesis.paused)speechSynthesis.resume();
  if(!SBUSY){if(SQ.length)pump();return}
  var idle=Date.now()-SLAST;
  if(!speechSynthesis.speaking&&!speechSynthesis.pending&&idle>900){SID++;SBUSY=false;pump()}
  else if(idle>15000){SID++;SBUSY=false;try{speechSynthesis.cancel()}catch(e){}pump()}
 }catch(e){}
},400);
/* iOS 要先由一次點擊喚醒語音引擎 */
var TTSWOKE=false;
function wakeTTS(){if(TTSWOKE)return;TTSWOKE=true;
 try{var u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);pickVoice()}catch(e){}}
document.addEventListener('touchstart',wakeTTS,{once:true,passive:true});
document.addEventListener('mousedown',wakeTTS,{once:true});
`;

/* 音效：使用者 2026-09-21 指定「暫時刪除音效和音效按鈕」。
 * 這裡把六個發聲函式留成空殼（名字還在，什麼都不做），
 * 五頁的呼叫點就不用一個一個拆掉，之後要加回來只改這一段。
 */
const SFX = `
var MUTE=true;
function beep(){}
function sOk(){}function sNo(){}function sTick(){}function sPop(){}function sWow(){}
`;

/* 小工具 */
const UTIL = `
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;
 if(html!=null)d.innerHTML=html;return d}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));
 var t=a[i];a[i]=a[j];a[j]=t}return a}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
/* ' 一律上紅色（使用者指定） */
function ap(s){return String(s).replace(/['\\u2019]/g,'<b class="ap">\\u2019</b>')}
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem('sent_'+k)||'null');
 localStorage.setItem('sent_'+k,JSON.stringify(v))}catch(e){return null}}
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)
 document.body.classList.add('reduce');
/* iPad：轉向或鍵盤收起後把版面高度重算，不會留白 */
function fixVH(){document.documentElement.style.setProperty('--vh',window.innerHeight*0.01+'px')}
fixVH();window.addEventListener('resize',fixVH);window.addEventListener('orientationchange',fixVH);
/* 底部按鈕列有幾排，就讓出幾排的高度（--barH）。
   按鈕多了會自動換行，寫死一個數字一定會蓋到內容（語速六段就是這樣蓋到替換字的）。 */
function fixBar(){try{var b=document.getElementById('bar');
 if(b)document.documentElement.style.setProperty('--barH',b.offsetHeight+'px')}catch(e){}}
fixBar();window.addEventListener('resize',fixBar);window.addEventListener('orientationchange',fixBar);
try{document.fonts.ready.then(fixBar)}catch(e){}
setTimeout(fixBar,400);
`;

/* 語速按鈕列（五頁共用；1.0 ＝ 正常語速） */
const RATEBAR = `<span class="grp" id="rateGrp">
  <span class="glbl">\u{1F5E3} 語速</span>
  <button data-r="0.5">0.5</button><button data-r="0.6">0.6</button>
  <button data-r="0.7">0.7</button><button data-r="0.8">0.8</button>
  <button data-r="0.9">0.9</button><button data-r="1">1.0</button>
 </span>`;

const RATEJS = `
(function(){
  var g=$('#rateGrp');if(!g)return;
  var saved=store('rate');if(saved)setRate(saved);
  function mark(){$$('#rateGrp button').forEach(function(b){
    b.classList.toggle('on',Math.abs(parseFloat(b.getAttribute('data-r'))-RATE)<0.001)})}
  mark();
  g.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button'):null;if(!b)return;
    setRate(parseFloat(b.getAttribute('data-r')));store('rate',RATE);mark();sayStop();
  });
})();
`;

const MISS = `
/* 找出「哪裡錯」：兩句逐字比對，錯的字框紅色、改對的字框金色 */
function mTok(s){var r=[],re=/[A-Za-z\u2019']+|[^\sA-Za-z\u2019']/g,m;s=String(s);
 while((m=re.exec(s)))r.push({t:m[0],s:m.index,e:m.index+m[0].length});return r}
function mKey(t){return t.replace(/\u2019/g,"'").toLowerCase()}
function mDiff(a,b){ /* 回傳：a 裡面哪些字不在共同的部分、b 裡面哪些字不在共同的部分 */
 var A=mTok(a),B=mTok(b),n=A.length,m=B.length,L=[],i,j;
 for(i=0;i<=n;i++){L.push([]);for(j=0;j<=m;j++)L[i].push(0)}
 for(i=n-1;i>=0;i--)for(j=m-1;j>=0;j--)
  L[i][j]=mKey(A[i].t)===mKey(B[j].t)?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 var ia={},ib={};i=0;j=0;
 while(i<n&&j<m){if(mKey(A[i].t)===mKey(B[j].t)){ia[i]=1;ib[j]=1;i++;j++}
  else if(L[i+1][j]>=L[i][j+1])i++;else j++}
 return {A:A,B:B,ia:ia,ib:ib};
}
function mPaint(s,T,keep,cls){ /* 把沒對上的字包起來，其他字照原樣 */
 s=String(s);var out='',p=0;
 T.forEach(function(t,k){out+=mEsc(s.slice(p,t.s));
  out+=keep[k]?mEsc(t.t):'<span class="'+cls+'">'+mEsc(t.t)+'</span>';p=t.e});
 return ap(out+mEsc(s.slice(p)));
}
function mEsc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function mStrip(h){var d=document.createElement('div');d.innerHTML=String(h||'');return d.textContent||''}
function mRows(o){
 var pick=o.pick==null?null:mStrip(o.pick), ans=mStrip(o.ans), dp='', da='';
 if(pick!=null){var d=mDiff(pick,ans);dp=mPaint(pick,d.A,d.ia,'x');da=mPaint(ans,d.B,d.ib,'f')}
 else da=ap(mEsc(ans));
 var en=/[A-Za-z]/.test(ans);
 return (o.q?'<div class="mrow q"><span class="ml">📝 題目</span><span class="mv">'+ap(o.q)+'</span></div>':'')+
  '<div class="mrow p"><span class="ml">❌ 你選的</span><span class="mv">'+
    (pick==null?'⏰ 時間到，沒有作答':dp)+'</span></div>'+
  '<div class="mrow a"><span class="ml">✅ 正確答案</span><span class="mv">'+da+'</span>'+
    (en?'<button class="say" data-say="'+mEsc(ans).replace(/"/g,'&quot;')+'">🔊 聽</button>':'')+'</div>'+
  (o.why?'<div class="mrow w"><span class="ml">💡 為什麼</span><span class="mv">'+ap(o.why)+'</span></div>':'');
}
var MISSLOG=[], missT=null, missCB=null;
/* 答錯：蓋一整頁，倒數 3 秒才消失，消失以後才呼叫 cb */
function missShow(o,cb){
 var m=document.getElementById('miss');
 if(!m){m=document.createElement('div');m.id='miss';document.body.appendChild(m);
  m.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('.say'):null;
   if(b)say(b.getAttribute('data-say'))})}
 var key=mStrip(o.q)+'|'+mStrip(o.ans);
 MISSLOG=MISSLOG.filter(function(x){return x.key!==key});
 MISSLOG.push({key:key,q:o.q,pick:o.pick,ans:o.ans,why:o.why});
 if(missT){clearInterval(missT);missT=null}
 missCB=cb||null;
 var n=3;
 m.innerHTML='<div class="mbox"><div class="mhd"><span class="mt">'+(o.pick==null?'⏰ 時間到':'❌ 答錯了')+'</span></div>'+
  mRows(o)+'<div class="mcd">看清楚：錯在哪裡、正確答案是什麼 <b id="mcdn">3</b></div></div>';
 m.classList.add('on');
 var ans=mStrip(o.ans);if(/[A-Za-z]/.test(ans))setTimeout(function(){say(ans)},700);
 missT=setInterval(function(){
  n--;var b=document.getElementById('mcdn');
  if(n>0&&b){b.textContent=n;b.classList.remove('tick');void b.offsetWidth;b.classList.add('tick');return}
  missHide(true);
 },1000);
}
function missHide(run){
 if(missT){clearInterval(missT);missT=null}
 var m=document.getElementById('miss');if(m)m.classList.remove('on');
 var cb=missCB;missCB=null;if(run&&cb)cb();
}
function missOn(){var m=document.getElementById('miss');return !!(m&&m.classList.contains('on'))}
/* 結束時的「答錯整理」：一題一張卡，全部再看一次 */
function missAll(title,done){
 var m=document.getElementById('missAll');
 if(!m){m=document.createElement('div');m.id='missAll';document.body.appendChild(m);
  m.addEventListener('click',function(e){
   var b=e.target.closest?e.target.closest('.say'):null;if(b){say(b.getAttribute('data-say'));return}
   if(e.target.closest&&e.target.closest('#mAllOk')){m.classList.remove('on');var f=m._done;m._done=null;if(f)f()}})}
 if(!MISSLOG.length){if(done)done();return false}
 m._done=done||null;
 m.innerHTML='<div class="mbox"><h2>📌 '+(title||'答錯整理')+'</h2>'+
  '<p class="lead">一共 <b style="color:var(--gold)">'+MISSLOG.length+'</b> 題。看紅框（錯在哪裡）和金框（改成什麼）。</p>'+
  MISSLOG.map(function(x,k){return '<div class="mcard" style="animation-delay:'+(0.12+k*0.18).toFixed(2)+'s">'+
   '<span class="mn">第 '+(k+1)+' 題</span>'+mRows(x)+'</div>'}).join('')+
  '<div class="mbtns"><button id="mAllOk">✅ 我都弄懂了</button></div></div>';
 m.scrollTop=0;m.classList.add('on');
 return true;
}
`;

const HOME = (href) => `<a href="${href}">🏠 首頁</a>`;

module.exports = { HEAD, TTS, SFX, UTIL, HOME, RATEBAR, RATEJS, MISS };
