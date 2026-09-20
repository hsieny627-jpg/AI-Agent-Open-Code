/* sentences/_shared.js — 五頁共用的樣板、配色、發音、音效
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
.reduce *{animation:none!important;transition:none!important}
${extraCss || ''}
</style>
</head>
<body>`;

/* 發音：標準美式 en-US，可放慢；中文用 zh-TW。iOS 第一次一定要由點擊觸發 */
const TTS = `
var SLOW=false,VOX=null,VOXZH=null;
function pickVoice(){try{var v=speechSynthesis.getVoices();if(!v||!v.length)return;
 var en=v.filter(function(x){return /^en[-_]US/i.test(x.lang)});
 if(!en.length)en=v.filter(function(x){return /^en/i.test(x.lang)});
 var pref=['Samantha','Ava','Allison','Alex','Google US English','Microsoft Zira','Microsoft Aria'];
 for(var i=0;i<pref.length;i++){for(var j=0;j<en.length;j++)if(en[j].name.indexOf(pref[i])>=0){VOX=en[j];break}if(VOX)break}
 if(!VOX&&en.length)VOX=en[0];
 var zh=v.filter(function(x){return /^zh[-_](TW|HK|CN)/i.test(x.lang)});
 if(zh.length)VOXZH=zh[0];}catch(e){}}
pickVoice();
try{speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
function say(txt,lang){try{if(!txt)return;
 var u=new SpeechSynthesisUtterance(String(txt).replace(/[\\u2019]/g,"'"));
 if(lang==='zh'){u.lang='zh-TW';if(VOXZH)u.voice=VOXZH;u.rate=SLOW?.55:.92}
 else{u.lang='en-US';if(VOX)u.voice=VOX;u.rate=SLOW?.45:.88}
 u.pitch=1;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function sayZh(t){say(t,'zh')}
/* iOS 要先由一次點擊喚醒語音引擎 */
var TTSWOKE=false;
function wakeTTS(){if(TTSWOKE)return;TTSWOKE=true;
 try{var u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);pickVoice()}catch(e){}}
document.addEventListener('touchstart',wakeTTS,{once:true,passive:true});
document.addEventListener('mousedown',wakeTTS,{once:true});
`;

/* 音效：WebAudio，離線可用，可靜音 */
const SFX = `
var MUTE=false,AC=null;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}
 if(AC&&AC.state==='suspended'){try{AC.resume()}catch(e){}}return AC}
function beep(f,d,type,vol){if(MUTE)return;var c=ac();if(!c)return;
 try{var o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.value=f;
 g.gain.setValueAtTime(0,c.currentTime);
 g.gain.linearRampToValueAtTime(vol||.13,c.currentTime+.012);
 g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);
 o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+d+.02)}catch(e){}}
function sOk(){beep(784,.11);setTimeout(function(){beep(1175,.17)},95)}
function sNo(){beep(196,.2,'square',.1);setTimeout(function(){beep(146,.26,'square',.09)},110)}
function sTick(){beep(1320,.045,'sine',.07)}
function sPop(){beep(988,.07,'triangle',.1)}
function sWow(){[523,659,784,1047,1319].forEach(function(f,i){setTimeout(function(){beep(f,.16,'triangle',.11)},i*70)})}
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
`;

const HOME = (href) => `<a href="${href}">🏠 首頁</a>`;

module.exports = { HEAD, TTS, SFX, UTIL, HOME };
