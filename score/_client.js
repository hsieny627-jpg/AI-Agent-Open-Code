/* score/_client.js — 學生端：登入（5 碼）、作答中本班名次、作答結束的六幕動畫、送成績（2026-10-07 對話 C）
 *
 * 使用者的決定：sentences/2026-10-07_C_設計與研究清單.md（Q1～Q18 全部照建議）＋ 2026-10-06_C_在家複習與成績紀錄_需求.md。
 * 2026-10-08 對話 D：遊戲（句型遊戲、在家複習遊戲、Review 1 遊戲）和 Review 1 頁的 📝 複習也記（score/2026-10-08_D_全部遊戲納入成績_需求.md）。
 * 這一份是共用的；畫在哪裡、題組叫什麼由那一頁的 SCH 決定：
 *   sentences/_tq.js（📝 複習題 5 題）、sentences/_build_cards.js（Review 1 頁的 📝 複習）、sentences/_build_games.js（遊戲）。
 * 算法一律在 score/_calc.js（這裡只有畫面）。
 *
 * 開關：score/url.js 的 window.SCORE_URL（老師部署 Google Apps Script 以後貼上網址）。
 *       沒有網址 ＝ 整套關掉，📝 複習題照 2026-10-04 的樣子（名次跟這台平板比）。量測時 window.__SCORE_TEST_OFF ＝ 關。
 * 來源：教學網站 ＝ 🏫 在校（一定要登入，平板記住）；在家複習 ＝ 🏠 在家（可以按〔👀 先練習，不記成績〕，Q6-A）。
 * 沒有網路：成績先存在這台平板（localStorage score_q），連上網自動補送；伺服器用「編號」去掉重複的。
 */
const CSS = `
/* ── 成績紀錄（2026-10-07 對話 C） ── */
.sclog{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.3vh,14px);width:100%}
.sclog h2{font-size:clamp(28px,5vh,50px)!important;margin:0}
/* 2026-10-09：① 打班級 ➜ ② 打座號 ➜ ③ 按 ✅，正在做的那一步會亮 */
.scsteps{display:flex;align-items:center;justify-content:center;gap:clamp(4px,1vw,10px);flex-wrap:wrap}
.scsteps span{display:flex;align-items:center;padding:clamp(4px,.8vh,8px) clamp(10px,1.6vw,20px);border-radius:999px;border:3px solid #333;color:#8A8A8A;
 font-size:clamp(20px,3.4vh,32px);font-weight:700;white-space:nowrap;transition:transform .3s}
.scsteps b{color:#555;font-size:clamp(20px,3.2vh,30px)}
.scsteps span.now{border-color:var(--gold);color:#fff;background:#2A2208;transform:scale(1.08);animation:scStep 1.4s ease-in-out infinite}
.scsteps span.done{border-color:var(--ok);color:var(--ok);background:#0F3323}
@keyframes scStep{50%{box-shadow:0 0 0 8px rgba(255,200,60,.22)}}
.scbox{display:flex;gap:clamp(14px,3vw,40px);align-items:flex-end}
.scg{display:flex;flex-direction:column;align-items:center;gap:6px;padding:clamp(4px,.8vh,10px);border-radius:20px;border:3px solid transparent;cursor:pointer}
.scg .lb{font-size:clamp(22px,3.8vh,36px);font-weight:700}.scg.c .lb{color:var(--acc)}.scg.s .lb{color:var(--ok)}
.scg.now{border-color:#4A4A2A;background:#16140A}
.scg .cells{display:flex;gap:clamp(6px,1.2vw,12px)}
.scbox i{font-style:normal;display:flex;align-items:center;justify-content:center;width:clamp(56px,9vh,86px);height:clamp(68px,11vh,104px);position:relative;
 border-radius:16px;background:#111;border:4px solid #333;font-size:clamp(40px,7.4vh,70px);font-weight:700;color:#fff;transition:transform .2s,border-color .2s}
.scbox i.c{border-color:#3A6FA8}.scbox i.s{border-color:#3A8F5E}
.scbox i.c.f{background:#0F2236;border-color:var(--acc)}.scbox i.s.f{background:#0F3323;border-color:var(--ok)}
/* 要打的那一格會閃 */
.scbox i.cur{border-color:var(--gold);box-shadow:0 0 0 5px rgba(255,200,60,.3)}
.scbox i.cur::after{content:'';position:absolute;bottom:14%;width:42%;height:6px;border-radius:3px;background:var(--gold);animation:scBlink 1s steps(1) infinite}
@keyframes scBlink{50%{opacity:0}}
.scbox i.pop{animation:scPop .3s ease-out}
@keyframes scPop{50%{transform:scale(1.18)}}
.scbox.shake .scg.c{animation:scShake .45s}
@keyframes scShake{20%,60%{transform:translateX(-14px)}40%,80%{transform:translateX(14px)}}
.scmsg{min-height:2.6em;font-size:clamp(21px,3.6vh,34px);font-weight:700;color:#fff;text-align:center;line-height:1.3}
.scmsg b.kc{color:var(--acc)}.scmsg b.ks{color:var(--ok)}
.scmsg small{display:block;font-size:.74em;color:#BDBDBD}
.scmsg.err{color:#FF9A9A}.scmsg.ok{color:var(--ok)}
.sckey{display:grid;grid-template-columns:repeat(3,clamp(88px,13.6vh,132px));gap:clamp(6px,1.1vh,12px)}
.sckey button{min-height:clamp(60px,8.6vh,86px);border-radius:18px;background:#1A1A1A;border:2px solid #3A3A3A;color:#fff;
 font-family:inherit;font-weight:700;font-size:clamp(30px,5.2vh,48px);cursor:pointer}
.sckey button:active{transform:scale(.94);background:#2A2A2A}
.sckey .okb{background:#0F3323;border-color:var(--ok)}
.sckey .okb.ready{background:var(--ok);color:#000;animation:scStep 1.2s ease-in-out infinite}
.sckey .bs{font-size:clamp(24px,4vh,36px)}
.scl{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.3vh,14px)}
/* 橫的螢幕（iPad 橫放、教室觸控螢幕）：數字鍵盤放在格子右邊，字不用縮小也放得下 */
@media (min-aspect-ratio:5/4){.sclog{display:grid;grid-template-columns:auto auto;justify-content:center;align-items:center;column-gap:clamp(24px,4vw,60px)}
 .sclog>*{grid-column:1/-1;justify-self:center}.sclog>.scl{grid-column:1;grid-row:3}.sclog>.sckey{grid-column:2;grid-row:3}
 .scl .scmsg{max-width:min(46vw,520px)}}
#scGuest{background:#141A20;border:2px solid #5A6A78;color:#DDE6EE;border-radius:999px;font-family:inherit;font-weight:700;
 font-size:clamp(17px,2.7vh,24px);padding:10px 26px;min-height:48px;cursor:pointer}
.scme{display:flex;align-items:center;gap:12px;font-size:clamp(20px,3.4vh,32px);font-weight:700;color:#DDE6EE}
.scme button{background:#141A20;border:1px solid #5A6A78;color:#DDE6EE;border-radius:999px;font-family:inherit;font-weight:700;
 font-size:clamp(15px,2.3vh,20px);padding:8px 18px;min-height:44px;cursor:pointer}
.scwho{display:flex;flex-direction:column;align-items:center;gap:14px;font-size:clamp(26px,4.8vh,46px);font-weight:700;text-align:center}
.tqtop .rk.sc2{font-size:clamp(18px,3.2vh,32px)}
/* 作答結束：一幕一幕 */
.scn{display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,18px);width:100%;text-align:center;min-height:min(70vh,640px);justify-content:center}
.scdots{display:flex;gap:8px;justify-content:center}
.scdots i{width:12px;height:12px;border-radius:50%;background:#333}.scdots i.on{background:var(--gold)}
.scnav{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.scnav button{background:var(--btn);border:1px solid var(--line);border-radius:999px;color:#fff;font-family:inherit;font-weight:700;
 font-size:clamp(18px,3vh,26px);padding:10px 28px;min-height:52px;cursor:pointer}
.scnav .go{background:#0F3323;border-color:var(--ok)}
.sct{font-size:clamp(26px,5vh,48px);font-weight:700;line-height:1.25}
.scs{font-size:clamp(18px,3vh,28px);color:#CFCFCF;font-weight:700}
.scring{position:relative;width:clamp(200px,34vh,320px);height:clamp(200px,34vh,320px)}
.scring svg{width:100%;height:100%;transform:rotate(-90deg)}
.scring circle{fill:none;stroke-width:10}
.scring .bg{stroke:#222}.scring .fg{stroke:var(--ok);stroke-linecap:round;transition:stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)}
.scring b{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:clamp(54px,10vh,96px);line-height:1}
.scring b small{font-size:.32em;color:#CFCFCF;margin-top:6px}
.scbars{display:flex;flex-direction:column;gap:clamp(8px,1.6vh,16px);width:min(640px,88vw)}
.scbar{display:grid;grid-template-columns:5.2em 1fr 4.2em;align-items:center;gap:10px;font-size:clamp(20px,3.4vh,32px);font-weight:700}
.scbar .tr{height:clamp(26px,4.6vh,44px);background:#161616;border-radius:999px;overflow:hidden;border:1px solid #2A2A2A}
.scbar .tr i{display:block;height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,#3A5266,#7FBFFF);transition:width 1.1s cubic-bezier(.2,.8,.2,1)}
.scbar.now .tr i{background:linear-gradient(90deg,#1E7A4C,#5BE39A)}
.scbar.me .tr i{background:linear-gradient(90deg,#8A6A12,#FFD24A)}
.scbar.me{color:var(--gold)}
.scbar .lb{text-align:left;white-space:nowrap}.scbar .vl{text-align:right;white-space:nowrap}
.scbig{font-size:clamp(46px,9vh,90px);font-weight:700;line-height:1.1}
.scbig.up{color:var(--ok)}.scbig.pb{color:var(--gold)}
.scpop{animation:scBoom .7s cubic-bezier(.2,1.6,.4,1) both}
@keyframes scBoom{from{transform:scale(.2);opacity:0}}
.scburst{position:relative}
.scburst::after{content:'';position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px;border-radius:50%;
 box-shadow:0 -90px 0 #FFD24A,64px -64px 0 #5BE39A,90px 0 0 #7FBFFF,64px 64px 0 #FF8FB1,0 90px 0 #FFD24A,-64px 64px 0 #5BE39A,-90px 0 0 #7FBFFF,-64px -64px 0 #FF8FB1;
 animation:scFw 1s ease-out .2s both;pointer-events:none}
@keyframes scFw{from{transform:scale(.1);opacity:1}to{transform:scale(1.9);opacity:0}}
.scstamp{display:inline-block;border:6px solid var(--ok);color:var(--ok);border-radius:20px;padding:8px 28px;font-size:clamp(40px,8vh,80px);font-weight:700;
 transform:rotate(-6deg);animation:scStamp .55s cubic-bezier(.3,1.5,.5,1) both}
@keyframes scStamp{from{transform:scale(3) rotate(-20deg);opacity:0}}
.scstamp.no{border-color:#FFB86B;color:#FFB86B}
.sccnt{font-size:clamp(26px,4.8vh,46px);font-weight:700}
.sccnt b{color:var(--gold);display:inline-block}
.sccnt b.pop{animation:scPop .5s ease-out .6s}
.scwait{font-size:clamp(22px,4vh,38px);font-weight:700;color:#CFCFCF}
.scwait i{display:inline-block;animation:scSpin 1s linear infinite;font-style:normal}
@keyframes scSpin{to{transform:rotate(360deg)}}
/* 排行榜 */
.sctabs,.scscope{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.sctabs button,.scscope button{background:#141414;border:2px solid #333;color:#DDD;border-radius:999px;font-family:inherit;font-weight:700;
 font-size:clamp(17px,2.8vh,26px);padding:7px 16px;min-height:48px;cursor:pointer;white-space:nowrap}
.sctabs button.on{background:#2A2208;border-color:var(--gold);color:#FFE9A8}
.scscope button.on{background:#0F2236;border-color:var(--acc);color:#fff}
.scpod{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:end;gap:clamp(6px,1.2vw,14px);width:min(620px,90vw)}
.scpod div{display:flex;flex-direction:column;align-items:center;gap:4px;font-weight:700}
.scpod .id{font-size:clamp(18px,3vh,28px)}.scpod .v{font-size:clamp(15px,2.4vh,22px);color:#CFCFCF}
.scpod .st{width:100%;border-radius:14px 14px 0 0;display:flex;align-items:flex-start;justify-content:center;font-size:clamp(28px,5vh,46px);padding-top:6px;
 transform-origin:bottom;animation:scRise .8s cubic-bezier(.2,.9,.3,1.2) both}
.scpod .p1 .st{height:clamp(90px,14vh,140px);background:linear-gradient(180deg,#8A6A12,#3A2D08)}
.scpod .p2 .st{height:clamp(64px,10vh,100px);background:linear-gradient(180deg,#6A747C,#2A2F33);animation-delay:.15s}
.scpod .p3 .st{height:clamp(48px,7.4vh,74px);background:linear-gradient(180deg,#8A5A32,#3A2614);animation-delay:.3s}
@keyframes scRise{from{transform:scaleY(0)}}
.scpod .me .id{color:var(--gold)}
.sclist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 12px;width:min(620px,90vw);font-size:clamp(16px,2.6vh,24px);font-weight:700}
.sclist div{display:flex;justify-content:space-between;gap:8px;background:#111;border:1px solid #222;border-radius:12px;padding:4px 12px}
.sclist div.me{border-color:var(--gold);color:var(--gold);background:#2A2208}
.sclist em{font-style:normal;color:#9E9E9E}
.scmine{font-size:clamp(19px,3.2vh,30px);font-weight:700;color:#FFE9A8;background:#1A1505;border:2px solid #5A4A12;border-radius:16px;padding:8px 18px}
.scmine.in{color:var(--gold);border-color:var(--gold)}
.sckeep{font-size:clamp(15px,2.4vh,22px);color:#FFB86B;font-weight:700}
.scempty{font-size:clamp(18px,3vh,28px);color:#9E9E9E;font-weight:700;padding:20px}
/* 2026-10-08 對話 D：遊戲的成績畫面蓋在遊戲上面（#scov）；作答結束的大分數 */
#scov{position:fixed;inset:0;z-index:92;background:#000;display:none;overflow-y:auto;-webkit-overflow-scrolling:touch;
 padding:calc(env(safe-area-inset-top) + clamp(10px,2vh,20px)) clamp(12px,3vw,36px) calc(env(safe-area-inset-bottom) + clamp(10px,2vh,20px))}
#scov.on{display:flex}
#scovb{width:100%;max-width:1100px;margin:auto;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,16px)}
#scov .sckey button,#scov .scnav button{color:#fff}
.scraw{font-size:clamp(70px,15vh,150px);font-weight:700;color:var(--gold);line-height:1}
.scfix{font-size:clamp(20px,3.4vh,32px);font-weight:700;color:#8FE3FF}
.scnote{font-size:clamp(15px,2.4vh,21px);color:#9E9E9E;font-weight:700}
.scstat{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(8px,1.4vw,16px);width:min(820px,92vw)}
.scstat div{background:#111;border:2px solid #2A2A2A;border-radius:20px;padding:clamp(8px,1.6vh,16px) 6px;display:flex;flex-direction:column;align-items:center;gap:4px}
.scstat b{font-size:clamp(40px,8vh,78px);line-height:1;color:var(--gold)}
.scstat span{font-size:clamp(17px,2.8vh,26px);font-weight:700;color:#DDE6EE;white-space:nowrap}
.scrow2{display:flex;align-items:center;justify-content:center;gap:clamp(12px,3vw,40px);flex-wrap:wrap}
#scme:empty{display:none}
/* 遊戲上面的登入（在家複習多一顆〔先練習〕）：iPad 橫放一頁放得下 */
#scov .sclog h2,#scov .sct{margin:0}
@media (max-height:860px){#scov{padding-top:calc(env(safe-area-inset-top) + 8px);padding-bottom:calc(env(safe-area-inset-bottom) + 8px)}
 #scov .sclog{gap:6px}#scov .sckey button{min-height:58px}}
/* iPad 橫放（768 高）：排行榜那一幕要一頁放得下 */
@media (min-width:900px){.sclist{grid-template-columns:repeat(3,minmax(0,1fr));width:min(900px,92vw)}}
@media (max-height:860px){.scn{min-height:0;gap:clamp(6px,1.1vh,10px)}
 .scpod .p1 .st{height:clamp(60px,9vh,80px)}.scpod .p2 .st{height:clamp(44px,6.6vh,60px)}.scpod .p3 .st{height:clamp(32px,4.8vh,44px)}
 .sctabs button,.scscope button{min-height:44px;padding:5px 14px}}
`;

const JS = `
/* ══════════ 成績紀錄（2026-10-07 對話 C；2026-10-08 對話 D：遊戲、Review 1 也記）══════════
   SCG ＝ 這一頁是幾年級（0 ＝ 三、四年級共用的 Review 1 遊戲：年級看登入的 5 碼）
   SCH ＝ 這一頁怎麼畫（下面那一段由 _tq.js／遊戲引擎／Review 1 複習各自給）：
     on() 畫面開著嗎、open() 打開、box() 畫在哪、back 回去的按鈕、key() 題組代號、name() 題組名稱、
     reopen() 換人以後回哪裡、rk() 作答中名次、btns(E) 最後一幕的按鈕、miss() 答錯整理的標題、act(a) data-sca 按鈕 */
var SCG=__SCG__,SCSRC=__SCSRC__;
var SCURL=String(window.SCORE_URL||'').replace(/^\\s+|\\s+$/g,''),SCON=!!SCURL&&!window.__SCORE_TEST_OFF;
var SCCLS={3:['304','307','311'],4:['402','406','409','410']},SCSEAT=30;
function scGet(k){try{return JSON.parse(localStorage.getItem('score_'+k)||'null')}catch(e){return null}}
function scPut(k,v){try{localStorage.setItem('score_'+k,JSON.stringify(v))}catch(e){}}
var SCID=scGet(SCG?'id_g'+SCG:'last'),SCGUEST=false,SCDEV=scGet('dev'),SCV=null,SCQ=[],SCT0=0,SCREF=0,SCQI=0,SCIN='',SCEND=null,SCH=null;
if(!SCDEV){SCDEV=Math.random().toString(36).slice(2,8);scPut('dev',SCDEV)}
function scGr(){return SCG||(SCID?+String(SCID).charAt(0):0)}
function scLive(){return SCON&&!!SCID&&!SCGUEST}
function scOn(){return !!(SCH&&SCH.on())}
function scCheck(id){
  if(!/^\\d{5}$/.test(id))return{err:'len'};
  var c=id.slice(0,3),s=+id.slice(3),g=c.charAt(0)==='3'?3:(c.charAt(0)==='4'?4:0);
  if(!g||SCCLS[g].indexOf(c)<0)return{err:'cls',cls:c};
  if(SCG&&g!==SCG)return{err:'grade',g:g};
  if(s<1||s>SCSEAT)return{err:'seat'};
  return{id:id,cls:c,seat:s,g:g};
}
function scMsg(r){
  var G={3:'三',4:'四'};
  return r.err==='len'?'要打 5 個數字':r.err==='cls'?'🏫 沒有 '+r.cls+' 班，再看一次':
   r.err==='grade'?'這是'+G[SCG]+'年級的網站（'+G[r.g]+'年級請用'+G[r.g]+'年級的網站）':'🪑 座號要 01～'+SCSEAT;
}
/* 網路：GET 看排行、POST 送成績（text/plain ＝ 不用預檢，Apps Script 收得到） */
function scFetch(q,body,ms){
  return new Promise(function(ok,no){
    var done=false,t=setTimeout(function(){if(!done){done=true;no(new Error('timeout'))}},ms||9000);
    var u=SCURL+(q?(SCURL.indexOf('?')<0?'?':'&')+q:'');
    fetch(u,body?{method:'POST',body:JSON.stringify(body)}:{}).then(function(r){return r.json()})
     .then(function(j){if(!done){done=true;clearTimeout(t);ok(j)}},function(e){if(!done){done=true;clearTimeout(t);no(e)}});
  });
}
/* 沒網路先存平板，連上網補送（同一筆有編號，伺服器不會重複存） */
var SCBUSY=false,SCRES={};
function scFlush(){
  if(!SCON||SCBUSY)return Promise.resolve(null);
  var Q=scGet('q')||[];if(!Q.length)return Promise.resolve(null);
  SCBUSY=true;var last=null;
  var step=function(){Q=scGet('q')||[];if(!Q.length){SCBUSY=false;return last}
    var r=Q[0];
    return scFetch('',{a:'rec',r:r}).then(function(j){
      if(j&&(j.saved||j.err==='bad')){Q=scGet('q')||[];Q=Q.filter(function(x){return x.u!==r.u});scPut('q',Q);if(j.saved){SCRES[r.u]=j;last=j}return step()}
      SCBUSY=false;return last},function(){SCBUSY=false;return last});
  };
  return step();
}
if(SCON){setTimeout(scFlush,1500);window.addEventListener('online',function(){scFlush()})}
/* 要記成績的地方先過這一關：還沒登入 ➜ 先登入（在家可以〔👀 先練習，不記成績〕）；登入好了 ➜ 直接做 fn */
function scGate(fn){if(SCON&&!SCID&&!SCGUEST){scLogin(fn);return}fn()}
/* ── 登入（2026-10-09 改版，照 English-Jobs-New 的 jobdex 新登入）：① 🏫 打班級 ➜ ② 🪑 打座號 ➜ ③ ✅ 按綠色勾勾
   正在做的那一步會亮、要打的那一格會閃；班級打錯（第 3 個數字打完就檢查）立刻清空；想改班級 ＝ 點班級的格子或按 ⌫，整個班級清空重打 ── */
var SCTYPED='';
function scClsList(){var G={3:'三',4:'四'},gs=SCG?[SCG]:[3,4];
  return gs.map(function(g){return G[g]+'年級：'+SCCLS[g].join('、')}).join('　')}
function scLogin(after){
  if(window.stopPlay)stopPlay();sayStop();
  SCH.open();
  SCTYPED='';SCLOGAFTER=after;
  var box=function(n,k){var s='';for(var i=0;i<n;i++)s+='<i class="'+k+'"></i>';return s};
  SCH.box().innerHTML='<div class="sclog"><h2>🔢 先登入，成績才會記下來</h2>'+
   '<div class="scsteps"><span id="scSt1">① 🏫 打班級</span><b>➜</b><span id="scSt2">② 🪑 打座號</span><b>➜</b><span id="scSt3">③ ✅ 按綠色勾勾</span></div>'+
   '<div class="scl"><div class="scbox" id="scBox"><div class="scg c" id="scGc"><span class="lb">🏫 班級</span><div class="cells">'+box(3,'c')+'</div></div>'+
   '<div class="scg s" id="scGs"><span class="lb">🪑 座號</span><div class="cells">'+box(2,'s')+'</div></div></div>'+
   '<div class="scmsg" id="scMsg"></div></div>'+
   '<div class="sckey">'+[1,2,3,4,5,6,7,8,9].map(function(n){return '<button data-k="'+n+'">'+n+'</button>'}).join('')+
   '<button class="bs" data-k="b" aria-label="刪掉">⌫</button><button data-k="0">0</button><button class="okb" data-k="ok" aria-label="確定">✅</button></div>'+
   (SCSRC==='home'?'<button id="scGuest">👀 先練習，不記成績</button>':'')+SCH.back+'</div>';
  scPaint();
}
var SCLOGAFTER=null;
function scPaint(err){
  var v=SCTYPED;if(!$('#scBox'))return;
  $$('#scBox i').forEach(function(c,n){var d=v.charAt(n);if(c.textContent!==d&&d){c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}
    c.textContent=d;c.classList.toggle('f',!!d);c.classList.toggle('cur',n===v.length)});
  var st=v.length<3?1:v.length<5?2:3;
  [1,2,3].forEach(function(k){var s=$('#scSt'+k);s.classList.toggle('now',k===st);s.classList.toggle('done',k<st)});
  $('#scGc').classList.toggle('now',st===1);$('#scGs').classList.toggle('now',st===2);
  $('.sckey .okb').classList.toggle('ready',v.length===5);
  var m=$('#scMsg');
  if(err){m.className='scmsg err';m.innerHTML=err;return}
  m.className='scmsg';
  m.innerHTML=v.length===0?'👆 先打你的<b class="kc">班級</b>（3 個數字）<small>例：304 班 5 號 ➜ 打 3 0 4 0 5</small>':
   v.length<3?'🏫 班級還要打 '+(3-v.length)+' 個數字':
   v.length===3?'👍 '+v+' 班！再打<b class="ks">座號</b><small>5 號 ➜ 打 0 5<br>班級打錯 ➜ 按 ⌫ 重打</small>':
   v.length===4?'🪑 座號還要打 1 個數字':
   '對嗎？<b class="kc">'+v.slice(0,3)+' 班</b> <b class="ks">'+(+v.slice(3))+' 號</b> ➜ 按綠色的 ✅';
}
function scShake(){var b=$('#scBox');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake')}
/* 班級（前 3 個數字）對不對：沒有這一班、或不是這個年級的網站 */
function scClsErr(c){var g=c.charAt(0)==='3'?3:(c.charAt(0)==='4'?4:0),G={3:'三',4:'四'};
  if(!g||SCCLS[g].indexOf(c)<0)return '🏫 沒有 '+c+' 班！已經幫你清掉了，請重新打班級<small>'+scClsList()+'</small>';
  if(SCG&&g!==SCG)return '🏫 '+c+' 班是'+G[g]+'年級，這是'+G[SCG]+'年級的網站！已經幫你清掉了<small>'+scClsList()+'</small>';
  return ''}
function scKeyPress(k){
  if(!$('#scBox'))return;
  if(k==='c'){SCTYPED='';scPaint();return}                             /* 點班級的格子 ＝ 整個班級清掉重打 */
  if(k==='s'){SCTYPED=SCTYPED.slice(0,3);scPaint();return}              /* 點座號的格子 ＝ 座號清掉重打 */
  if(k==='b'){SCTYPED=SCTYPED.length<=3?'':SCTYPED.slice(0,-1);scPaint();return}   /* 班級裡按 ⌫ ＝ 整個班級清掉 */
  if(k==='ok'){var r=scCheck(SCTYPED);
    if(r.err==='len'){scShake();scPaint(SCTYPED.length<3?'🏫 先打完班級（3 個數字）':'🪑 座號要打 2 個數字（5 號 ➜ 0 5）');return}
    if(r.err){scShake();scPaint(scMsg(r));return}
    scWho(r);return}
  if(SCTYPED.length>=5)return;
  SCTYPED+=k;
  if(SCTYPED.length===3){var ce=scClsErr(SCTYPED);if(ce){SCTYPED='';scShake();scPaint(ce);return}}
  if(SCTYPED.length===5){var s=+SCTYPED.slice(3);if(s<1||s>SCSEAT){var bad=SCTYPED.slice(3);SCTYPED=SCTYPED.slice(0,3);scShake();
    scPaint('🪑 沒有 '+bad+' 號！請重新打座號<small>座號是 01～'+SCSEAT+'</small>');return}}
  scPaint();
}
/* 名單開關（預設關）：開了才問「你是 304 班 5 號 ○○○ 嗎？」，學生不自己打名字 */
function scWho(r){
  var go=function(){SCID=r.id;scPut('id_g'+r.g,SCID);scPut('last',SCID);SCGUEST=false;var a=SCLOGAFTER;SCLOGAFTER=null;if(a)a()};
  var m=$('#scMsg');m.className='scmsg ok';m.textContent='✅ '+r.cls+' 班 '+r.seat+' 號';
  scFetch('a=who&id='+r.id,null,3000).then(function(j){
    if(!j||!j.roster||!j.name){go();return}
    SCH.box().innerHTML='<div class="scwho"><div>你是 '+r.cls+' 班 '+r.seat+' 號</div><div style="color:var(--gold);font-size:1.3em">'+esc(j.name)+'</div><div>嗎？</div>'+
     '<div class="scnav"><button class="go" id="scYes">✅ 是我</button><button id="scNo">❌ 重新輸入</button></div></div>';
    $('#scYes').onclick=go;$('#scNo').onclick=function(){scLogin(SCLOGAFTER)};
  },function(){setTimeout(go,500)});
}
function scMeHTML(){
  if(!SCON)return '';
  if(SCGUEST)return '<div class="scme">👀 練習模式（不記成績）<button id="scSwap">🔢 登入</button></div>';
  if(!SCID)return '<div class="scme">🔢 還沒登入<button id="scSwap">🔢 登入</button></div>';
  return '<div class="scme">🪑 '+SCID+'<button id="scSwap">換人</button></div>';
}
/* ── 作答中：本班這一組的名次（只有前 10 名給名次；不在前 10 ＝ 再幾分進前 10） ── */
function scStart(gt){
  SCQ=[];SCV=null;SCIN='';clearTimeout(SCAUTO);SCEND=null;
  if(!scLive())return;
  var my=SCH.key();
  scFetch('a=view&id='+SCID+'&set='+encodeURIComponent(my)+(gt?'&gt=1':''),null,6000).then(function(j){if(j&&!j.err&&SCH.key()===my){SCV=j;if(SCH.rk)SCH.rk()}},function(){});
}
function scRk(s){
  if(!SCV)return '🏫 本班排名';
  if(!SCV.boards)return '💪 加油！';
  var o=(SCV.set&&SCV.set.others)||[],n=1;o.forEach(function(x){if(x>s)n++});
  if(n<=10)return '🏅 本班第 '+n+' 名';
  return '⬆ 再 '+(o[9]-s+1)+' 分進前 10';
}
function scAsk(q,qi){SCT0=Date.now();SCREF=q&&q.k==='read'?0:SCT0;SCQI=qi||0}
function scHeard(){if(!SCREF)SCREF=Date.now()}
/* 一題：選了第幾個（0 ＝ 正解，-1 ＝ 時間到）、答對、剩下秒數 ÷ 總秒數 */
function scDone(pick,ok,ratio){
  var now=Date.now(),sec=(now-SCT0)/1000;
  var fast=pick>=0?(SCREF?(now-SCREF<1000?1:0):1):0;
  SCQ.push([ok?1:0,pick,Math.round(sec*10)/10,fast,ok?Math.round(Math.max(0,Math.min(1,ratio))*1000)/1000:0,SCQI]);
}
/* ── 作答結束 ──
   題目（m:'q'）六幕：① 正確率 ② 跟上一次比 ③ 算不算 1 次 ④ 我幫全班 ⑤ 排行榜 ⑥ 答錯整理
   遊戲（m:'g'）精簡版三幕：① 正確率（第一次作答）＋✨ 訂正成功 ② 跟上一次比＋算不算 1 次 ③ 這個遊戲本班前 10 名
   🃏 記憶配對（m:'mem'）一幕：配完幾對、用幾秒、翻錯幾次＋算 1 次（不算正確率、不算總分） */
var SCLIST={q:['acc','prev','count','class','board','end'],g:['acc','gprog','gtop'],mem:['mem']};
function scS100(Q){var n=Q.length,s=0;Q.forEach(function(q){if(q[0])s+=60/n+40/n*q[4]});return Math.round(s)}
function scEnd(o){
  o=o||{};var m=o.m||'q',Q=o.qs||SCQ,key=SCH.key(),n=Q.length,ok=0,fast=0;Q.forEach(function(q){ok+=q[0];fast+=q[3]});
  if(m!=='mem'&&!n)return false;
  var acc=m==='mem'?null:Math.round(ok/n*100),u=SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  var R={id:SCID,set:key,name:SCH.name(),m:m,qs:m==='mem'?[]:Q,raw:Math.round(o.raw||0),fix:o.fix||0,mp:o.mp||0,mw:o.mw||0,sec:Math.round(o.sec||0),
    src:SCSRC,dev:SCDEV,u:u,t:Date.now()};
  var hk='h_'+SCID+'_'+key,H=scGet(hk)||[],sv=SCV&&SCV.set;
  var prev=sv&&sv.tries?sv.prev:(H.length?H[H.length-1].acc:null);
  var best=sv&&sv.tries?sv.best:(H.length?Math.max.apply(null,H.map(function(x){return x.acc||0})):null);
  var today=Math.floor((Date.now()+288e5)/864e5),cnt=m==='mem'?true:(m==='g'&&n<10?false:ok*3>=n*2);
  var todayN=sv?sv.today:H.filter(function(x){return x.d===today&&x.c}).length;
  H.push({t:R.t,acc:acc,c:cnt,d:today});scPut(hk,H.slice(-50));
  var QQ=scGet('q')||[];QQ.push(R);scPut('q',QQ.slice(-200));SCIN=u;
  SCEND={m:m,list:SCLIST[m],acc:acc,ok:ok,n:n,s:m==='mem'?null:scS100(Q),raw:R.raw,fix:R.fix,mp:R.mp,mw:R.mw,sec:R.sec,prev:prev,best:best,cnt:cnt,cap:cnt&&todayN>=3,
    week:(SCV&&SCV.me?SCV.me.count:null),res:null,fail:false,k:0,tab:'acc',scope:'cls'};
  /* 送出：前一次補送還在跑就等一下再試（最多 3 次），還是送不出去 ＝ 沒有網路，先存平板 */
  var send=function(n){scFlush().then(function(){if(!SCEND||SCIN!==u)return;
    var j=SCRES[u],left=(scGet('q')||[]).some(function(x){return x.u===u});
    if(!j&&left&&n<3){setTimeout(function(){send(n+1)},1500);return}
    if(j)SCEND.res=j;else SCEND.fail=true;
    var nm=SCEND.list[SCEND.k];if(nm==='class'||nm==='gtop'||nm==='gprog')scScene()})};
  send(0);
  scScene();
  return true;
}
var SCAUTO=null;
function scGo(k){SCEND.k=k;scScene()}
function scNext(){var L=SCEND.list,k=SCEND.k+1;if(L[k]==='board'&&!(SCEND.res&&SCEND.res.boards))k++;scGo(Math.min(k,L.length-1))}
function scRing(E,t){var R=46,L=2*Math.PI*R;
  return '<div class="sct">'+t+'</div><div class="scring"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="'+R+'"></circle>'+
    '<circle class="fg" id="scFg" cx="50" cy="50" r="'+R+'" stroke-dasharray="'+L+'" stroke-dashoffset="'+L+'"></circle></svg>'+
    '<b><span id="scAcc">0</span><small>'+E.ok+' ／ '+E.n+' 題</small></b></div>'}
function scPrevHTML(E,small){
  var up=E.prev!=null?E.acc-E.prev:null,pb=E.best!=null&&E.acc>E.best,f=small?' style="font-size:clamp(34px,6.6vh,64px)"':'';
  var big=E.prev==null?'<div class="scbig pb scpop scburst"'+f+'>⭐ 第一次紀錄：'+E.acc+'%</div>'+(small?'':'<div class="scs">下次打敗它！</div>'):
    E.acc===100&&E.prev===100?'<div class="scbig pb scpop scburst"'+f+'>🔥 保持 100%！</div>':
    pb?'<div class="scbig pb scpop scburst"'+f+'>🏅 新紀錄！🚀 ＋'+up+'%</div>':
    up>0?'<div class="scbig up scpop"'+f+'>🚀 ＋'+up+'%</div>':
    up===0?'<div class="scbig scpop"'+f+'>👍 跟上次一樣 '+E.acc+'%</div>'+(small?'':'<div class="scs">再快一點、再多對一題，就破紀錄！</div>'):
    '<div class="scbig scpop" style="font-size:clamp(30px,6vh,56px)">💪 上次 '+E.prev+'%，這次 '+E.acc+'%</div>'+(small?'':'<div class="scs">再挑戰一次！</div>');
  return (E.prev!=null?'<div class="scbars">'+
    '<div class="scbar"><span class="lb">上一次</span><span class="tr"><i data-w="'+E.prev+'"></i></span><span class="vl">'+E.prev+'%</span></div>'+
    '<div class="scbar now"><span class="lb">這一次</span><span class="tr"><i data-w="'+E.acc+'"></i></span><span class="vl">'+E.acc+'%</span></div></div>':'')+big}
function scCntHTML(E){
  var res=E.res&&E.res.me?E.res.me.count:(E.week!=null?E.week+(E.cnt&&!E.cap?1:0):null),need=Math.ceil(E.n*2/3);
  return (E.cnt?(E.cap?'<div class="scstamp">✅ 很棒！</div><div class="scs">今天這'+(E.m==='q'?'一組':'個遊戲')+'已經算滿 3 次，明天再來，次數會再加！📅</div>':
       '<div class="scstamp">✅ 算 1 次！</div>'):
     E.m==='g'&&E.n<6?'<div class="scstamp no">再多答 '+(6-E.n)+' 題</div><div class="scs">一場要答 6 題以上才算 1 次 💪</div>':
       '<div class="scstamp no">再多對 '+(need-E.ok)+' 題</div><div class="scs">就算 1 次 💪（'+E.n+' 題要對 '+need+' 題）</div>')+
   (res!=null?'<div class="sccnt">🔁 這週 <b class="pop">'+res+'</b> 次</div>':'')}
function scScene(){
  clearTimeout(SCAUTO);if(!SCEND||!scOn())return;var E=SCEND,L=E.list,k=E.k,nm=L[k],h='',last=k===L.length-1;
  var dots=L.length>1?'<div class="scdots">'+L.map(function(x,n){return '<i'+(n===k?' class="on"':'')+'></i>'}).join('')+'</div>':'';
  var nav=function(more){return '<div class="scnav">'+(more||'')+(!last?'<button class="go" id="scNx">➡ 下一步</button><button id="scSkip">⏭ 跳過</button>':'')+'</div>'};
  if(nm==='acc'){
    h=scRing(E,E.m==='g'?'🎯 正確率（每一題第一次作答）':'🎯 正確率')+
      '<div class="scs">⚡ 總分 '+E.s+' 分（答對 60 ＋ 速度 40）</div>'+
      (E.m==='g'?(E.fix?'<div class="scfix">✨ 訂正成功 '+E.fix+' 題</div>':'')+'<div class="scnote">🎁 驚喜卡、連對加成是運氣，不算進成績</div>':'')+nav();
    SCAUTO=setTimeout(scNext,E.m==='g'?3600:3000);
  }else if(nm==='prev'){
    h='<div class="sct">🚀 跟上一次比</div>'+scPrevHTML(E)+nav();
    SCAUTO=setTimeout(scNext,3400);
  }else if(nm==='count'){
    h='<div class="sct">🔁 算不算 1 次？</div>'+scCntHTML(E)+nav();
    SCAUTO=setTimeout(scNext,3000);
  }else if(nm==='gprog'){
    h='<div class="sct">🚀 跟上一次比</div>'+scPrevHTML(E,1)+scCntHTML(E)+nav();
    SCAUTO=setTimeout(scNext,4200);
  }else if(nm==='class'){
    var V=E.res;
    if(!V&&!E.fail)h='<div class="sct">🏫 我幫全班</div><div class="scwait"><i>⏳</i> 正在送出成績…</div>'+nav();
    else if(!V)h='<div class="sct">📶 現在沒有網路</div><div class="scs">成績先存在這台平板，連上網會自動送出 ✅</div>'+nav();
    else{var my=V.cls;
      h='<div class="sct">🏫 我幫全班</div><div class="scbars">'+V.classes.map(function(c){
        return '<div class="scbar'+(c.cls===my?' me':'')+'"><span class="lb">'+c.cls+' 班</span><span class="tr"><i data-w="'+(c.acc||0)+'"></i></span><span class="vl">'+(c.acc==null?'—':Math.round(c.acc))+'</span></div>'}).join('')+'</div>'+
       '<div class="scs">'+(V.delta>0?'你這一次幫 '+my+' 班 ＋'+V.delta+' 分 💪':'你為 '+my+' 班又多練了一次 💪')+'</div>'+
       '<div class="scs" style="font-size:clamp(14px,2.2vh,19px);color:#9E9E9E">各班這週的平均正確率</div>'+nav();
      SCAUTO=setTimeout(scNext,3600)}
  }else if(nm==='board'){
    h=scBoardHTML()+nav();
  }else if(nm==='gtop'){
    h=scGtopHTML()+SCH.btns(E);
  }else if(nm==='mem'){
    var per=E.mp?Math.round(E.sec/E.mp*10)/10:null;
    h='<div class="sct">🃏 記憶配對</div><div class="scstat">'+
      '<div><b>'+E.mp+'</b><span>✅ 配完幾對</span></div><div><b>'+E.sec+'</b><span>⏱ 用了幾秒</span></div><div><b>'+E.mw+'</b><span>🔁 翻錯幾次</span></div></div>'+
      (per!=null?'<div class="scs">平均 '+per+' 秒配一對</div>':'')+scCntHTML(E)+
      '<div class="scnote">記憶配對是記位置，不算正確率、不算總分（老師看得到這三個數字）</div>'+SCH.btns(E);
  }else{
    h='<div class="sct">'+(E.ok===E.n?'🎉 全對！':'答錯是大腦在學習 🧠')+'</div>'+
     '<div class="scraw">'+E.raw+'</div><div class="scs">🏆 這一次的分數　✅ 答對 '+E.ok+' ／ '+E.n+' 題</div>'+SCH.btns(E);
    if(MISSLOG.length)setTimeout(function(){if(SCEND&&SCEND.list[SCEND.k]==='end'&&scOn())missAll(SCH.miss())},600);
  }
  SCH.box().innerHTML='<div class="scn" id="scn">'+dots+h+'</div>';
  if(nm==='acc')setTimeout(function(){var f=$('#scFg'),a=$('#scAcc');if(!f)return;var L=+f.getAttribute('stroke-dasharray');
    f.setAttribute('stroke-dashoffset',L*(1-E.acc/100));var t0=Date.now(),iv=setInterval(function(){var x=Math.min(1,(Date.now()-t0)/1300);
      if(!$('#scAcc')){clearInterval(iv);return}a.textContent=Math.round(E.acc*x)+'%';if(x>=1)clearInterval(iv)},40)},80);
  setTimeout(function(){$$('.scbar .tr i').forEach(function(x){x.style.width=x.getAttribute('data-w')+'%'})},80);
}
var SCBN={acc:'🎯 正確率',s:'⚡ 總分',count:'🔁 次數',prog:'🚀 進步'};
function scFmt(t,v){return t==='count'?v+' 次':t==='prog'?'＋'+v+'%':Math.round(v)+' 分'}
function scPodHTML(L,fmt){
  var pod=[1,0,2].map(function(n){var x=L[n];if(!x)return '<div></div>';
    return '<div class="p'+Math.min(x.rk,3)+(x.id===SCID?' me':'')+'"><span class="id">'+x.id+'</span><span class="v">'+fmt(x)+'</span><span class="st">'+(x.rk===1?'🥇':x.rk===2?'🥈':'🥉')+'</span></div>'}).join('');
  var rest=L.slice(3).map(function(x){return '<div'+(x.id===SCID?' class="me"':'')+'><span><em>'+x.rk+'</em> '+x.id+'</span><span>'+fmt(x)+'</span></div>'}).join('');
  return '<div class="scpod">'+pod+'</div>'+(rest?'<div class="sclist">'+rest+'</div>':'');
}
function scBoardHTML(){
  var E=SCEND,V=E.res,t=E.tab,sc=E.scope;
  var L=(V.top[t]||{})[sc]||[];
  var tabs='<div class="sctabs">'+['acc','s','count','prog'].map(function(x){return '<button data-bt="'+x+'"'+(x===t?' class="on"':'')+'>'+SCBN[x]+'</button>'}).join('')+'</div>'+
   '<div class="scscope"><button data-bs="cls"'+(sc==='cls'?' class="on"':'')+'>🏫 本班</button><button data-bs="grade"'+(sc==='grade'?' class="on"':'')+'>🏆 全年級</button></div>';
  if(!L.length)return '<div class="sct">🏆 排行榜（這週）</div>'+tabs+'<div class="scempty">'+(t==='prog'?'同一組做兩次，就能上 🚀 進步榜！':'這週還沒有人上榜，你可以當第一個！')+'</div>'+scMineHTML(t,sc);
  return '<div class="sct">🏆 排行榜（這週）</div>'+tabs+scPodHTML(L,function(x){return scFmt(t,x.v)})+scMineHTML(t,sc);
}
/* 遊戲：這個遊戲本班前 10 名（這週，每個人最好的一次；正確率同分比總分） */
function scGtopHTML(){
  var E=SCEND,V=E.res,T='<div class="sct">🏆 這個遊戲　本班前 10 名（這週）</div>';
  if(!V&&!E.fail)return T+'<div class="scwait"><i>⏳</i> 正在送出成績…</div>';
  if(!V)return '<div class="sct">📶 現在沒有網路</div><div class="scs">成績先存在這台平板，連上網會自動送出 ✅</div>';
  if(!V.boards||!V.gtop)return '<div class="sct">💪 成績送出去了 ✅</div><div class="scs">下次再挑戰更高的正確率！</div>';
  var G=V.gtop,L=G.list,mine;
  if(G.rk)mine='<div class="scmine in">🪑 你是第 '+G.rk+' 名！🎉</div>';
  else if(G.cut!=null&&G.best&&G.cut-G.best.acc>=0&&G.cut-G.best.acc<=20)mine='<div class="scmine">🪑 你：⬆ 再 '+Math.max(1,G.cut-G.best.acc)+' 分進前 10</div>';
  else mine='<div class="scmine">🪑 你：⭐ 你的紀錄 '+(G.best?G.best.acc:E.acc)+'%，下次打敗它！</div>';
  if(!L.length)return T+'<div class="scempty">這週還沒有人上榜，你可以當第一個！</div>'+mine;
  return T+scPodHTML(L,function(x){return x.acc+'%'})+mine;
}
/* 自己：前 10 名 ＝ 名次；不在前 10 名 ＝ 不顯示名次數字，差距小才寫「再多 N 進前 10」，差太多改寫自己的進步（Q2-A） */
function scMineHTML(t,sc){
  var E=SCEND,V=E.res,me=V.me,my=V.rk[t][sc],cut=V.cut[t][sc],v=me[t],keep='';
  if(t==='prog'&&V.keep&&V.keep.length&&sc==='cls')keep='<div class="sckeep">🔥 保持滿分：'+V.keep.slice(0,12).join('、')+'</div>';
  if(my)return keep+'<div class="scmine in">🪑 你是第 '+my+' 名！🎉</div>';
  var gap=v==null||cut==null?null:(t==='count'?cut-v:Math.ceil(cut-v)),lim=t==='count'?5:20,txt;
  if(v==null&&t==='prog')txt=me.keep?'🔥 你保持滿分！':'同一組再做一次，就能比進步！';
  else if(gap!=null&&gap>=0&&gap<=lim)txt=gap===0?'⬆ 再快一點就進前 10！':'⬆ 再 '+gap+(t==='count'?' 次':' 分')+'進前 10';
  else if(E.prev!=null&&E.acc>E.prev)txt='🚀 你這次比上次 ＋'+(E.acc-E.prev)+'%';
  else txt='⭐ 你的紀錄：'+(E.best!=null?Math.max(E.best,E.acc):E.acc)+'%，下次打敗它！';
  return keep+'<div class="scmine">🪑 你：'+txt+'</div>';
}
document.addEventListener('click',function(e){
  var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#scSwap')){if(!SCH)return;SCID=null;scPut('id_g'+scGr(),null);scPut('last',null);SCGUEST=false;scLogin(SCH.reopen);return}
  if(!scOn())return;
  if((b=c('.sckey button'))){scKeyPress(b.getAttribute('data-k'));return}
  if(c('#scGc')){scKeyPress('c');return}if(c('#scGs')&&SCTYPED.length>3){scKeyPress('s');return}
  if(c('#scGuest')){SCGUEST=true;var a=SCLOGAFTER;SCLOGAFTER=null;if(a)a();return}
  if((b=c('[data-sca]'))){if(SCH.act)SCH.act(b.getAttribute('data-sca'));return}
  if(!SCEND||!c('#scn'))return;
  if((b=c('[data-bt]'))){SCEND.tab=b.getAttribute('data-bt');scScene();return}
  if((b=c('[data-bs]'))){SCEND.scope=b.getAttribute('data-bs');scScene();return}
  if(c('#scSkip')){scGo(SCEND.list.length-1);return}
  if(c('#scNx')){scNext();return}
  var nm=SCEND.list[SCEND.k];if((nm==='acc'||nm==='prev'||nm==='count'||nm==='class'||nm==='gprog')&&!c('button'))scNext();
});
document.addEventListener('keydown',function(e){if(!$('#scBox'))return;
  if(/^\\d$/.test(e.key))scKeyPress(e.key);else if(e.key==='Backspace')scKeyPress('b');else if(e.key==='Enter')scKeyPress('ok')});
`;

/* 一頁要放的東西：S ＝ score/_sites.js 查到的這個資料夾、src ＝ school／home、g 覆寫年級（0 ＝ 看登入的 5 碼） */
function js(S, src) { return JS.replace('__SCG__', S.g).replace('__SCSRC__', JSON.stringify(src === 'home' ? 'home' : 'school')); }

module.exports = { CSS, JS, js };
