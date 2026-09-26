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

/* ══ 答錯的獨立頁（2026-09-24 新增；2026-09-25 使用者指定改版）══════════════════
 * 暖身題、複習題、遊戲共用。答錯的那一刻蓋上一整頁，版面只有三件事：
 *   ❌ 你選的（紅色，錯的那幾個字框起來、畫刪除線）
 *   ⬇
 *   ✅ 正確答案（最大、綠色、粗體，改對的那幾個字金色閃）＋ 🔊 發音
 *   💡 為什麼（一句話）
 * ① 一進來**倒數 8 秒**，這 8 秒不能跳過；正確答案的英文**自動唸 3 次**。
 * ② 🔊 發音：自己再聽。
 * ③ ⭐ 加分：再倒數 8 秒（再看仔細一點）➜ 出一題**字放大的類似題** ➜ 答對拿「原題分數 ✕ 2」；
 *    還是答錯 ➜ 再給一次錯題分析，一樣可以按 ⭐ 加分。
 *    這一套加分方法，頁面上用一條會動的「⭐ ➜ 👀 8 秒 ➜ 📝 類似題 ➜ ✕2」先講清楚。
 * 結束的時候 missAll() 再蓋一整頁「答錯整理」：正確答案粗體、綠色、放大。
 */
const MISSCSS = `
#miss,#missAll,#look{position:fixed;inset:0;z-index:95;background:#000;display:none;flex-direction:column;
 align-items:center;padding:calc(var(--safeT) + clamp(8px,1.6vh,20px)) clamp(14px,3vw,40px)
 calc(var(--safeB) + clamp(8px,1.6vh,20px));overflow-y:auto}
#miss.on,#missAll.on,#look.on{display:flex}
#look{z-index:96}
#miss .mbox,#missAll .mbox,#look .mbox{width:100%;max-width:1060px;margin:auto 0;display:flex;flex-direction:column;
 align-items:center;gap:clamp(6px,1.4vh,16px)}
.mhd{font-size:clamp(30px,6vh,60px);font-weight:700;color:var(--no);text-align:center;line-height:1.1;
 animation:mShake .5s cubic-bezier(.3,.8,.3,1)}
.mhd.ok{color:var(--ok);animation:mPop .6s cubic-bezier(.2,1.5,.4,1)}
.mhd.bn{color:var(--gold);animation:mPop .6s cubic-bezier(.2,1.5,.4,1)}
@keyframes mShake{0%,100%{transform:none}20%{transform:translateX(-14px)}40%{transform:translateX(12px)}
 60%{transform:translateX(-8px)}80%{transform:translateX(5px)}}
@keyframes mPop{from{transform:scale(.4);opacity:0}to{transform:none;opacity:1}}
@keyframes mIn{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}
.mq{font-size:clamp(17px,3vh,30px);color:var(--dim);text-align:center;line-height:1.35;max-width:36ch}
.mq b{color:var(--fg)}
.mcmp{display:flex;flex-direction:column;align-items:center;gap:clamp(2px,.6vh,8px);width:100%}
.mcmp .mp,.mcmp .ma{display:flex;align-items:center;justify-content:center;gap:clamp(8px,1.4vw,18px);
 border-radius:20px;padding:clamp(6px,1.2vh,14px) clamp(14px,2.2vw,30px);max-width:100%;
 opacity:0;animation:mIn .45s cubic-bezier(.2,.9,.3,1.2) forwards;overflow-wrap:anywhere;text-align:center}
.mcmp .mp{background:#1A0808;border:2px solid #5A1F1F;font-size:clamp(22px,4.4vh,44px);color:#FF9C9C;animation-delay:.15s}
.mcmp .ma{background:#06190E;border:3px solid var(--ok);font-size:clamp(32px,7.6vh,76px);font-weight:700;
 color:var(--ok);animation-delay:.55s;box-shadow:0 0 40px rgba(57,217,138,.22)}
.mcmp .mi{flex:0 0 auto;font-size:.8em}
.mcmp .mar{font-size:clamp(20px,3.4vh,34px);color:#4A4A4A;line-height:1;opacity:0;animation:mIn .4s ease .4s forwards}
.mcmp .x{border-radius:8px;padding:0 .12em;background:rgba(255,94,94,.28);color:#fff;
 text-decoration:line-through;text-decoration-color:var(--no);text-decoration-thickness:.1em}
.mcmp .f{border-radius:8px;padding:0 .12em;background:var(--gold);color:#000;
 display:inline-block;animation:mFix 1.1s ease-in-out 1s 2}
@keyframes mFix{0%,100%{transform:none}50%{transform:scale(1.18)}}
.mw{font-size:clamp(19px,3.4vh,34px);color:var(--fg);text-align:center;line-height:1.4;max-width:32ch;
 opacity:0;animation:mIn .45s ease 1s forwards}
.mw b{color:var(--gold)}
/* 加分的秒懂說明：一格一格亮起來 */
.mbn{display:flex;align-items:center;justify-content:center;gap:clamp(4px,.9vw,12px);flex-wrap:wrap;
 background:#141005;border:1px dashed #6B5714;border-radius:999px;padding:clamp(4px,.8vh,9px) clamp(10px,1.6vw,20px);
 opacity:0;animation:mIn .45s ease 1.4s forwards}
.mbn span{font-size:clamp(15px,2.6vh,26px);font-weight:700;color:#BFA75A;white-space:nowrap;
 animation:mStep 4s ease-in-out infinite}
.mbn span:nth-of-type(2){animation-delay:1s}.mbn span:nth-of-type(3){animation-delay:2s}.mbn span:nth-of-type(4){animation-delay:3s}
.mbn i{font-style:normal;color:#5E5230;font-size:clamp(13px,2vh,20px)}
.mbn.cur span{animation:none}
.mbn span.now{color:var(--gold);text-shadow:0 0 14px rgba(255,210,74,.8)}
@keyframes mStep{0%,20%{color:var(--gold);text-shadow:0 0 14px rgba(255,210,74,.8);transform:scale(1.12)}30%,100%{color:#BFA75A;text-shadow:none;transform:none}}
/* 最下面一排：倒數 ➜ 倒數完才出現「⭐ 加分」「▶ 繼續」 */
.mft{display:flex;align-items:center;justify-content:center;gap:clamp(8px,1.6vw,18px);flex-wrap:wrap;
 min-height:clamp(60px,9vh,86px)}
.mcd{display:inline-flex;align-items:center;justify-content:center;width:clamp(52px,8.4vh,84px);
 height:clamp(52px,8.4vh,84px);border-radius:50%;border:5px solid var(--gold);color:var(--gold);
 font-size:clamp(26px,4.8vh,46px);font-weight:700}
.mcd.tick{animation:mTick .9s ease}
@keyframes mTick{0%{transform:scale(1.35)}100%{transform:none}}
.mft button,.mbtns button{border-radius:999px;color:#fff;font-weight:700;border:2px solid var(--line);background:var(--btn);
 font-size:clamp(18px,3.2vh,30px);padding:clamp(9px,1.6vh,16px) clamp(18px,2.8vw,34px)}
.mft .say{background:#10301F;border-color:var(--ok)}
.mft .bon{background:#2A2208;border-color:var(--gold);color:var(--gold);animation:mGlow 1.3s ease-in-out infinite}
@keyframes mGlow{0%,100%{box-shadow:0 0 0 0 rgba(255,210,74,0)}50%{box-shadow:0 0 0 7px rgba(255,210,74,.25)}}
.mft .nxt{background:#0F3323;border-color:var(--ok)}
.mft button:active,.mbtns button:active{transform:scale(.96)}
/* 加分題：字放大 */
.mbq{font-size:clamp(26px,5.6vh,56px);font-weight:700;text-align:center;line-height:1.3;max-width:26ch;
 animation:mPop .5s cubic-bezier(.2,1.5,.4,1)}
.mbo{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(8px,1.4vh,16px);width:100%}
.mbo.one{grid-template-columns:1fr}
.mbo button{background:#0C0C0C;border:2px solid #2E2E2E;border-radius:18px;color:var(--fg);
 font-size:clamp(22px,4.4vh,44px);font-weight:700;line-height:1.25;min-height:clamp(64px,11vh,110px);
 padding:clamp(8px,1.4vh,16px) clamp(10px,1.6vw,20px);opacity:0;animation:mIn .4s ease forwards}
.mbo button:active{transform:scale(.97)}
.mbo button.ok{background:#0F3323;border-color:var(--ok)}
.mbo button.bad{background:#3A1111;border-color:var(--no)}
.mgain{font-size:clamp(60px,15vh,150px);font-weight:700;color:var(--gold);line-height:1;
 text-shadow:0 0 40px rgba(255,210,74,.6);animation:mPop .7s cubic-bezier(.2,1.6,.4,1)}
.mx2{display:flex;align-items:center;gap:.4em;font-size:clamp(24px,4.6vh,46px);font-weight:700;color:var(--fg)}
.mx2 b{color:var(--gold)}
#missAll h2{margin:0;text-align:center;font-size:clamp(28px,5.4vh,52px)}
#missAll .lead{margin:0;text-align:center;font-size:clamp(17px,2.8vh,26px);color:var(--dim)}
.mcard{display:flex;flex-direction:column;gap:clamp(4px,.8vh,10px);border:1px solid #262626;border-radius:20px;width:100%;
 padding:clamp(10px,1.8vh,18px) clamp(12px,2vw,24px);background:#050505;opacity:0;animation:mIn .45s cubic-bezier(.2,.9,.3,1.2) forwards}
.mcard .mn{font-size:clamp(15px,2.3vh,21px);color:var(--acc);font-weight:700;letter-spacing:.1em}
.mcard .cq{font-size:clamp(18px,3vh,30px);color:var(--body);line-height:1.35}
.mcard .cp{font-size:clamp(18px,3vh,30px);color:#FF9C9C;line-height:1.35}
.mcard .ca{font-size:clamp(26px,5vh,50px);font-weight:700;color:var(--ok);line-height:1.25}
.mcard .ca b{color:var(--ok)}
.mcard .cw{font-size:clamp(17px,2.8vh,28px);color:var(--fg);line-height:1.4}
.mcard .cw b{color:var(--gold)}
.mcard .x{border-radius:8px;padding:0 .12em;background:rgba(255,94,94,.28);color:#fff;text-decoration:line-through}
.mcard .f{border-radius:8px;padding:0 .12em;background:var(--gold);color:#000}
.mcard .say{align-self:flex-start;background:#10301F;border:1px solid var(--ok);border-radius:999px;color:#fff;
 font-size:clamp(15px,2.4vh,22px);padding:6px 16px}
.mbtns{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:clamp(4px,1vh,10px)}
/* 2026-09-26 使用者指定：正確答案每一個英文字正下方 ＝ 它的中文；下面一行整句翻譯 */
.mv.glw,.ma.gl .mv{display:inline-flex;flex-wrap:wrap;align-items:flex-start;justify-content:center;gap:0 .32em}
.gw{display:inline-flex;flex-direction:column;align-items:center;line-height:1.1}
.gw b{font-weight:700}
.gw i{font-style:normal;font-size:.46em;color:#FFE9A8;font-weight:700;margin-top:.12em;white-space:nowrap;letter-spacing:.02em}
.gw.gc{margin-left:-.3em}.gw.gp{margin-left:-.3em}.gw.gp i{visibility:hidden}
.mtr{font-size:clamp(22px,4.2vh,42px);color:var(--fg);text-align:center;line-height:1.3;opacity:0;animation:mIn .45s ease .8s forwards}
.mtr b{color:#FFE9A8}
#look .lk{font-size:clamp(15px,2.4vh,22px);color:var(--dim)}
.mvar{font-size:clamp(15px,2.4vh,22px);color:var(--acc);letter-spacing:.06em}
.mbtns button{background:#0F3323;border-color:var(--ok)}
`;

const SRC = require('./_site').NAME;
/* 預先錄好的語音（使用者 2026-09-25 指定：G3 全部句型要美式英語自然正確的語調）：
   資料夾裡有 audio/aud.js 才會載入（sentences 沒有 ➜ 跟原本一樣用瀏覽器語音） */
const AUDJS = require('fs').existsSync(require('./_site').DIR + '/audio/aud.js') ? '<script src="audio/aud.js"></script>\n' : '';
const HEAD = (title, extraCss) => `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="theme-color" content="#000000">
<title>${title}</title>
${AUDJS}
<!-- 本檔由 ${SRC}/_build.js 產生，不要手改。改內容請改 ${SRC}/_data.js ／ _quiz_data.js ／ _game_data.js -->
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
/* 預先錄好的語音檔（有 window.AUD 才用）：英文先查表，查得到就播音檔，查不到才用瀏覽器語音
   （使用者 2026-09-25 指定：美式英語自然正確的語調）。播放速度照語速六段。 */
var AEL=null,APLAY=false;
function akey(t){return sayText(t).toLowerCase()}
function aEl(){if(!AEL){try{AEL=new Audio();AEL.preload='auto'}catch(e){AEL=null}}return AEL}
function aPlay(it,t,a){
 var el=aEl();if(!el)return false;
 var mine=++SID;SBUSY=true;APLAY=true;SLAST=Date.now();
 var ws=[],wm,wre=/\\S+/g;while((wm=wre.exec(t)))ws.push(Math.max(1,wm[0].replace(/[^A-Za-z]/g,'').length));
 var tot=ws.reduce(function(x,y){return x+y},0),ft=[],done=false;
 var hl=function(k){if(it.hl)try{it.hl(k)}catch(e){}};
 var fin=function(){if(done)return;done=true;ft.forEach(clearTimeout);APLAY=false;
  if(it.hl)hl(-1);
  if(mine!==SID)return;SID++;SBUSY=false;SLAST=Date.now();
  if(it.done)try{it.done()}catch(e){}
  setTimeout(pump,60)};
 var began=false;
 var begin=function(){if(began)return;began=true;
  if(it.start)try{it.start()}catch(e){}
  if(it.hl){var d=a[1]*1000/RATE,acc=0;
   ws.forEach(function(n,k){ft.push(setTimeout(function(){if(mine===SID)hl(k)},acc));acc+=d*n/tot})}};
 el.onplaying=begin;el.onended=fin;el.onerror=fin;
 try{el.pause()}catch(e){}
 el.src=(window.AUDDIR||'audio/')+a[0];
 try{el.playbackRate=RATE;el.defaultPlaybackRate=RATE;el.preservesPitch=true;el.webkitPreservesPitch=true}catch(e){}
 var pr;try{pr=el.play()}catch(e){fin();return true}
 if(pr&&pr.catch)pr.catch(function(){fin()});
 /* 最多等「音檔長度 ＋ 2 秒」，播放器沒有回報也不會卡住 */
 ft.push(setTimeout(fin,a[1]*1000/RATE+2000));
 return true;
}
/* 真正送出一句 */
function pump(){
 if(SBUSY)return;
 var it=SQ.shift();if(!it)return;
 var t=sayText(it.t);
 if(!t){if(it.done)try{it.done()}catch(e){};setTimeout(pump,0);return}
 if(it.l!=='zh'&&window.AUD){var au=AUD[akey(t)];if(au&&aPlay(it,t,au))return}
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
 SQ.length=0;SID++;SBUSY=false;APLAY=false;
 if(window.HLCLR)try{HLCLR()}catch(e){}
 try{if(AEL)AEL.pause()}catch(e){}
 try{speechSynthesis.cancel()}catch(e){}
 SQ.push(item);
 /* Chrome／Edge：cancel() 之後馬上 speak() 會被吃掉，等 90ms 再講 */
 setTimeout(pump,90);
}
function sayZh(t,opt){say(t,'zh',opt)}
function sayStop(){SQ.length=0;SID++;SBUSY=false;APLAY=false;if(window.HLCLR)try{HLCLR()}catch(e){}
 try{if(AEL)AEL.pause()}catch(e){}
 try{speechSynthesis.cancel()}catch(e){}}
/* 看門狗：瀏覽器有時候不發 onend（或講到一半自己停住），卡住就救回來 */
setInterval(function(){
 try{
  if(speechSynthesis.speaking&&!speechSynthesis.paused)speechSynthesis.resume();
  if(!SBUSY){if(SQ.length)pump();return}
  if(APLAY)return;                    /* 播音檔的時候不歸看門狗管（音檔自己有逾時） */
  var idle=Date.now()-SLAST;
  if(!speechSynthesis.speaking&&!speechSynthesis.pending&&idle>900){SID++;SBUSY=false;pump()}
  else if(idle>15000){SID++;SBUSY=false;try{speechSynthesis.cancel()}catch(e){}pump()}
 }catch(e){}
},400);
/* iOS 要先由一次點擊喚醒語音引擎 */
var TTSWOKE=false;
function wakeTTS(){if(TTSWOKE)return;TTSWOKE=true;
 try{var u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);pickVoice()}catch(e){}
 /* iPad：音檔也要先由一次點擊「解鎖」，之後才可以自己播 */
 try{if(window.AUD){var el=aEl(),k0=Object.keys(AUD)[0];if(el&&k0){el.muted=true;el.src=(window.AUDDIR||'audio/')+AUD[k0][0];
  var pr=el.play();var un=function(){try{el.pause()}catch(e){}el.muted=false};if(pr&&pr.then)pr.then(un,un);else un()}}}catch(e){}}
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
function mTok(s){var r=[],re=/[A-Za-z’']+|[^\\sA-Za-z’']/g,m;s=String(s);
 while((m=re.exec(s)))r.push({t:m[0],s:m.index,e:m.index+m[0].length});return r}
function mKey(t){return t.replace(/’/g,"'").toLowerCase()}
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
function mPair(o){ /* 你選的（紅框）／正確答案（金框）＋ 逐字中文、整句翻譯（2026-09-26） */
 var pick=o.pick==null?null:mStrip(o.pick), ans=mStrip(o.ans), dp='', da='', bad=[];
 if(pick!=null&&pick!==''){var d=mDiff(pick,ans);dp=mPaint(pick,d.A,d.ia,'x');da=mPaint(ans,d.B,d.ib,'f');
  d.B.forEach(function(t,k){if(!d.ib[k])bad.push(t)})}
 else da=ap(mEsc(ans));
 var src=gSrc(o),g='',tr='';
 if(src){g=src.en===ans?mGloss(ans,bad):null;tr=src.zh||'';
  if(g===null){g='';o._gq=mGloss(src.en,null)}}
 /* st ＝ 🔊 發音要唸的英文：答案有英文就唸答案；答案是中文（看英文選中文）就唸題目裡的那一句英文 */
 var st=/[A-Za-z]/.test(ans)?ans:(src&&src.en?src.en:'');
 return {p:(pick==null?'⏰ 時間到，沒有作答':(pick===''?'（沒有選）':dp)),a:da,g:g,tr:tr,gq:o._gq||'',en:/[A-Za-z]/.test(ans),ans:ans,st:st};
}
var MISSLOG=[], missT=null, missCB=null, MS=null, MISSN=8;
function mEl(){
 var m=document.getElementById('miss');
 if(!m){m=document.createElement('div');m.id='miss';document.body.appendChild(m);
  m.addEventListener('click',function(e){
   var t=e.target,b=t.closest?t.closest('button'):null;if(!b)return;
   if(b.classList.contains('say')){say(b.getAttribute('data-say'));return}
   if(b.classList.contains('bon')){missBonus();return}
   if(b.classList.contains('nxt')){missHide(true);return}
   if(b.hasAttribute('data-ok'))missPick(b);
  })}
 return m;
}
/* 正確答案的英文自動唸 3 次（使用者 2026-09-25 指定），頁面關掉就停 */
function mSay3(t){
 if(!/[A-Za-z]/.test(t))return;
 var k=0,my=MS;
 var go=function(){if(MS!==my||!missOn()||k>=3)return;k++;
  say(t,null,{keep:k>1?1:0,done:function(){setTimeout(go,650)}})};
 setTimeout(go,700);
}
function mCount(n,fn){
 if(missT){clearInterval(missT);missT=null}
 var b=document.getElementById('mcdn');if(b)b.textContent=n;
 missT=setInterval(function(){
  n--;var c=document.getElementById('mcdn');
  if(n>0&&c){c.textContent=n;c.classList.remove('tick');void c.offsetWidth;c.classList.add('tick');return}
  clearInterval(missT);missT=null;fn();
 },1000);
}
function mStrip4(cur){ /* 加分的秒懂說明：⭐ ➜ 👀 8 秒 ➜ 📝 類似題 ➜ ✅ ✕2 */
 var st=['⭐ 加分','👀 再看 8 秒','📝 類似題','✅ 分數 ✕ 2'];
 return '<div class="mbn'+(cur!=null?' cur':'')+'">'+st.map(function(x,k){
  return (k?'<i>➜</i>':'')+'<span'+(cur===k?' class="now"':'')+'>'+x+'</span>'}).join('')+'</div>';
}
function mCan(){return !!(MS&&MS.o&&MS.o.gain&&(MS.o.self||(MS.o.sims&&MS.o.sims.length)||MS.o.sim0))}
/* 錯題分析頁：reread ＝ 按了加分以後的「再看 8 秒」 */
function mRead(reread){
 var o=MS.o, p=mPair(o), m=mEl();
 m.innerHTML='<div class="mbox">'+
  '<div class="mhd'+(reread?' bn':'')+'">'+(reread?'👀 再仔細看一次':(o.pick==null?'⏰ 時間到':'❌ 答錯了'))+'</div>'+
  (o.q?'<div class="mq">'+ap(o.q)+'</div>':'')+
  (p.gq?'<div class="mcmp"><div class="ma gl" style="animation-delay:.1s;font-size:clamp(26px,5.6vh,56px)"><span class="mi">🔤</span><span class="mv">'+p.gq+'</span></div></div>':'')+
  '<div class="mcmp"><div class="mp"><span class="mi">❌</span><span class="mv">'+p.p+'</span></div>'+
  '<div class="mar">⬇</div><div class="ma'+(p.g?' gl':'')+'"><span class="mi">✅</span><span class="mv">'+(p.g?p.g:p.a)+'</span></div></div>'+
  (p.tr?'<div class="mtr">整句：<b>'+mEsc(p.tr)+'</b></div>':'')+
  (o.why?'<div class="mw">💡 '+ap(o.why)+'</div>':'')+
  (mCan()?mStrip4(reread?1:null):'')+
  '<div class="mft" id="mft">'+(p.st?'<button class="say" data-say="'+mEsc(p.st).replace(/"/g,'&quot;')+'">🔊 發音</button>':'')+
   '<span class="mcd" id="mcdn">'+MISSN+'</span></div></div>';
 m.scrollTop=0;m.classList.add('on');
 mSay3(/[A-Za-z]{2}/.test(p.ans)?p.ans:((gSrc(o)||{}).en||''));
 mCount(MISSN,function(){
  if(reread){mQuiz();return}
  var f=document.getElementById('mft');if(!f)return;
  f.innerHTML=(p.st?'<button class="say" data-say="'+mEsc(p.st).replace(/"/g,'&quot;')+'">🔊 發音</button>':'')+
   (mCan()?'<button class="bon">⭐ 加分</button>':'')+'<button class="nxt">▶ 繼續</button>';
 });
}
/* 答錯：蓋一整頁，倒數 8 秒，倒數完才看得到「⭐ 加分」「▶ 繼續」；按「▶ 繼續」才呼叫 cb
   o：q 題目、pick 你選的、ans 正確答案、why 為什麼、
      sims 類似題 [{q,o:[正解,...],h,say}]、pts 原題分數、gain(n) 加分題答對要把 n 分加進去 */
function missShow(o,cb){
 var key=mStrip(o.q)+'|'+mStrip(o.ans);
 MISSLOG=MISSLOG.filter(function(x){return x.key!==key});
 MISSLOG.push({key:key,q:o.q,pick:o.pick,ans:o.ans,why:o.why});
 missCB=cb||null;
 o.self0=o.self;MS={o:o};
 mRead(false);
}
function missBonus(){if(!mCan())return;sayStop();mRead(true)}
/* 加分題：字放大的類似題，選項重洗 */
function mQuiz(){
 /* 2026-09-26 使用者指定：加分題 ＝ 同一題換個樣子（mVar），一律四個選項；原題不能轉就用最像的一題 */
 var o=MS.o, s=o.self?mVar(o.self,o.self===o.self0?o.pick:null):((o.sims&&o.sims.length)?mVar(o.sims.shift()):mVar(o.sim0));
 if(!s){missHide(true);return}
 MS.s=s;
 var opts=shuf(s.o.map(function(x,n){return{x:x,n:n}}));
 var m=mEl();
 m.innerHTML='<div class="mbox"><div class="mhd bn">⭐ 加分題</div><div class="mvar">🔁 同一個重點，換個樣子再考一次</div>'+mStrip4(2)+
  '<div class="mbq">'+ap(s.q)+'</div>'+
  (s.say?'<div class="mft"><button class="say" data-say="'+mEsc(s.say).replace(/"/g,'&quot;')+'">🔊 再聽一次</button></div>':'')+
  '<div class="mbo">'+opts.map(function(t,k){
   return '<button data-ok="'+(t.n===0)+'" data-t="'+mEsc(t.x).replace(/"/g,'&quot;')+'" style="animation-delay:'+(0.15+k*0.1).toFixed(2)+'s">'+ap(t.x)+'</button>'}).join('')+'</div>'+
  '<div class="mx2">答對 ＝ <b>'+o.pts+' ✕ 2</b></div></div>';
 m.scrollTop=0;
 if(s.say)setTimeout(function(){say(s.say)},450);
}
function missPick(b){
 if(!MS||!MS.s||MS.done)return;
 var ok=b.getAttribute('data-ok')==='true', o=MS.o, s=MS.s;
 [].forEach.call(document.querySelectorAll('#miss .mbo button'),function(x){
  if(x.getAttribute('data-ok')==='true')x.classList.add('ok');else if(x===b)x.classList.add('bad')});
 if(ok){
  MS.done=1;var g=o.pts*2;
  setTimeout(function(){
   if(!missOn())return;
   try{o.gain(g)}catch(e){}
   var m=mEl();
   m.innerHTML='<div class="mbox"><div class="mhd ok">🎉 答對了！</div>'+mStrip4(3)+
    '<div class="mgain">＋'+g+'</div><div class="mx2">'+o.pts+' <b>✕ 2</b> ＝ <b>'+g+'</b></div>'+
    '<div class="mft"><button class="nxt">▶ 繼續</button></div></div>';
   say(s.o[0]);
  },650);
  return;
 }
 /* 加分題也答錯：再給一次錯題分析，一樣可以再按 ⭐ 加分 */
 setTimeout(function(){
  if(!missOn())return;
  var no={q:s.q,pick:b.getAttribute('data-t'),ans:s.o[0],why:s.h,pts:o.pts,gain:o.gain,
   sims:o.sims,sim0:o.sim0||s,self:o.self||s,look:o.look};
  var key=mStrip(no.q)+'|'+mStrip(no.ans);
  MISSLOG=MISSLOG.filter(function(x){return x.key!==key});
  MISSLOG.push({key:key,q:no.q,pick:no.pick,ans:no.ans,why:no.why});
  MS={o:no};mRead(false);
 },700);
}
function missHide(run){
 if(missT){clearInterval(missT);missT=null}
 var m=document.getElementById('miss');if(m)m.classList.remove('on');
 MS=null;sayStop();
 var cb=missCB;missCB=null;if(run&&cb)cb();
}
function missOn(){var m=document.getElementById('miss');return !!(m&&m.classList.contains('on'))}
/* 結束時的「答錯整理」：一題一張卡，正確答案粗體、綠色、放大 */
function missAll(title,done){
 var m=document.getElementById('missAll');
 if(!m){m=document.createElement('div');m.id='missAll';document.body.appendChild(m);
  m.addEventListener('click',function(e){
   var b=e.target.closest?e.target.closest('.say'):null;if(b){say(b.getAttribute('data-say'));return}
   if(e.target.closest&&e.target.closest('#mAllOk')){m.classList.remove('on');var f=m._done;m._done=null;if(f)f()}})}
 if(!MISSLOG.length){if(done)done();return false}
 m._done=done||null;
 m.innerHTML='<div class="mbox"><h2>📌 '+(title||'答錯整理')+'</h2>'+
  '<p class="lead">一共 <b style="color:var(--gold)">'+MISSLOG.length+'</b> 題　<b style="color:var(--ok)">綠色粗體</b> ＝ 正確答案</p>'+
  MISSLOG.map(function(x,k){var p=mPair(x);
   return '<div class="mcard" style="animation-delay:'+(0.1+k*0.14).toFixed(2)+'s">'+
   '<span class="mn">第 '+(k+1)+' 題</span>'+(x.q?'<div class="cq">📝 '+ap(x.q)+'</div>':'')+
   '<div class="cp">❌ '+p.p+'</div><div class="ca">✅ <b>'+(p.g?'<span class="mv glw">'+p.g+'</span>':p.a)+'</b></div>'+
   (p.tr?'<div class="cw">整句：<b>'+mEsc(p.tr)+'</b></div>':'')+
   (x.why?'<div class="cw">💡 '+ap(x.why)+'</div>':'')+
   (p.en?'<button class="say" data-say="'+mEsc(p.ans).replace(/"/g,'&quot;')+'">🔊 發音</button>':'')+'</div>'}).join('')+
  '<div class="mbtns"><button id="mAllOk">✅ 我都弄懂了</button></div></div>';
 m.scrollTop=0;m.classList.add('on');
 return true;
}
/* 找類似題：同一題庫裡，英文字重疊最多、提示一樣的題目（不含自己）；回傳由像到不像排好的 */
function simRank(me,list,txt,hint){
 /* 英文字 ＋ 中文兩個字一組：觀念題（大多是中文）也找得到像的 */
 var W=function(s){var o={};s=String(s).toLowerCase().replace(/[’']/g,"'");
  s.replace(/[a-z']+/g,function(w){o[w]=1});
  var z=s.replace(/[^一-鿿]/g,'');for(var i=0;i+1<z.length;i++)o[z.substr(i,2)]=1;return o};
 var a=W(txt(me)),ha=hint?hint(me):'';
 return list.filter(function(x){return x!==me}).map(function(x){
  var b=W(txt(x)),n=0,t=0,k;for(k in a){t++;if(b[k])n++}for(k in b)if(!a[k])t++;
  return {x:x,s:(t?n/t:0)+(ha&&hint(x)===ha?1:0)+Math.random()*.01}}).sort(function(p,q){return q.s-p.s})
  .map(function(p){return p.x});
}
`;

const MISS2 = require('./_gloss').JS() + '\n' + require('fs').readFileSync(__dirname + '/_miss_rt.js', 'utf8');
const HOME = (href) => `<a href="${href}">🏠 首頁</a>`;

module.exports = { HEAD, TTS, SFX, UTIL, HOME, RATEBAR, RATEJS, MISS: MISS + MISS2 };
