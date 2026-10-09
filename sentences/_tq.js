/* sentences/_tq.js — 每個分頁最後面的「📝 複習題 5 題」（2026-10-04 對話 B，使用者確認的規格在
 * sentences/2026-10-04_B_複習題_題目清單.md 最上面「使用者的決定」與第一段 B1～B10）
 *
 * 兩個網站（G3、sentences）和在家複習（g3-review、g4-review）的句型頁共用；_build_cards.js 的 page() 會接上來。
 *   題目：各自資料夾的 _tq_data.js（由 tools/tq_from_md.js 從清單產生，不要手改）
 *   每一組 5 題：👀 認讀 ➜ 🎧 聽力 ➜ 看中文選英文 ➜ 看英文選中文 ➜ ⚠️ 易錯（順序固定，選項每次重洗）
 *   時間：認讀 20 秒（要先聽四句），其他 15 秒（B9）
 *   計分：答對 ＝ 100 ＋ 速度分（剩下秒數 ÷ 總秒數 ✕ 900），答錯／時間到 0 分，滿分 5000（B4）；沒有驚喜卡、沒有連對加分
 *   右上角：大數字累計分數＋名次（B3：先跟「這台平板做過這一組的成績」比，對話 C 做好登入後改全班名次）
 *   答錯：共用遊戲的答錯頁 missShow（倒數 8 秒、正解唸 3 次、逐字中文、整句翻譯、結束有答錯整理），
 *         **不傳 gain ➜ 沒有 ⭐ 加分**；也不插類似題（B6）
 *   錯的英文不唸：認讀題的 🔊 選項全部是正確的英文；答錯頁只唸正解（題目的 sp:'' ＝ 不唸）
 *   進入：字卡下方的〔📝 複習題 5 題〕，或最後一張字卡按 ➡（B2）；題目畫面同一個位置是〔🃏 回到字卡〕
 *   2026-10-09 使用者（E16～E20）：**講完才選**——看到這個分頁（這一級）的最後一張卡以前，〔📝 複習題 5 題〕藏起來；
 *     最後一張卡下面 ＝〔📝 做 5 題複習〕〔➡ 下一個主題〕；最後一張再按 ➡ ＝「完成 All done!」頁（✔ 自己畫出來＋彩帶，唸 All done!）＋兩顆大按鈕；
 *     講完以後按鈕就一直在（這台平板記住 TQSEEN）；基礎、進階各自算；📑 目次跳到最後一張也算講完；在家複習一樣
 */
const fs = require('fs'), path = require('path');

/* 每個分頁要放哪一組題目：教學網站照分頁編號（有基礎／進階 ➜ 1-1b、1-1a）；
   在家複習（RPAGES）照分頁名稱找教學網站同名的分頁（有分級就用進階那一組），「縮寫動畫」用 r4 */
function map(DIR, D, P, asKey) {
  const f = path.join(DIR, '_tq_data.js');
  if (!P.tabs || !fs.existsSync(f) || (P.unit !== 1 && P.unit !== 2)) return null;
  const T = require(f)['u' + P.unit], MAIN = P.unit === 1 ? D.TABS1 : D.TABS2;
  const need = (k, why) => { if (!T[k]) throw new Error('複習題：找不到 ' + P.file + ' 「' + why + '」的題目（' + k + '）'); return asKey ? k : T[k]; };
  const isR = P.tabs !== MAIN;
  return P.tabs.map(tb => {
    if (!isR) return tb.sub ? tb.sub.map((x, n) => need(tb.n + (n ? 'a' : 'b'), tb.lb + ' ' + x.lb)) : need(tb.n, tb.lb);
    if (tb.lb === '縮寫動畫') return need('r4', tb.lb);
    const m = MAIN.filter(x => x.lb === tb.lb)[0];
    if (!m) throw new Error('複習題：在家複習的分頁「' + tb.lb + '」在教學網站找不到同名的分頁');
    /* 2026-10-07 對話 C（Q15-A）：在家複習的分頁 1、2 也分「基礎／進階」，用教學網站同一組題目（成績算在一起） */
    if (tb.sub) return tb.sub.map((x, n) => need(m.n + (n ? 'a' : 'b'), tb.lb + ' ' + x.lb));
    return need(m.n + (m.sub ? 'a' : ''), tb.lb);
  });
}
const attach = (DIR, D, P) => map(DIR, D, P, false);
/* 成績紀錄（2026-10-07 對話 C）：學生端的程式（score/_client.js），題組代號 ＝ g年級u單元_分頁（例 g3u1_1-1b），教學網站和在家複習同一組題目同一個代號。
   年級查 score/_sites.js（2026-10-08 對話 D：沒登記的資料夾 build 失敗）；SCH ＝ 這一頁的畫法（畫在 #rvbox） */
const SCC = require('../score/_client.js'), SITES = require('../score/_sites.js');
function scJS(DIR, D, P) {
  const S = SITES.of(DIR);
  if (!S.g) throw new Error('成績紀錄：📝 複習題要有固定的年級（' + S.dir + '）');
  return SCC.js(S, /^\.\.\//.test(P.file) ? 'home' : 'school') + `
var SCKEYS=${JSON.stringify(map(DIR, D, P, true))},SCU=${JSON.stringify(P.unit)};
SCH={on:function(){return document.body.classList.contains('tqon')&&$('#rv').classList.contains('on')},
 open:function(){$('#rv').classList.add('on');document.body.classList.add('tqon')},box:function(){return $('#rvbox')},
 back:'<button id="tqBack">🃏 回到字卡</button>',
 key:function(){var k=SCKEYS[TCUR];return 'g'+SCG+'u'+SCU+'_'+(Object.prototype.toString.call(k)==='[object Array]'?k[LCUR]:k)},
 name:function(){return tqNm()},tk:function(){tqMark()},reopen:function(){tqOpen()},rk:function(){var r=$('#tqrk');if(r)r.innerHTML=tqRkHTML(tqScore)},
 miss:function(){return tqNm()+'　答錯整理'},
 btns:function(){return '<div class="rvbtns">'+(MISSLOG.length?'<button id="tqMiss">📌 答錯整理</button>':'')+
   '<button class="go" id="tqAgain">🔁 再挑戰一次</button>'+(TCUR<TABM.length-1?'<button class="go" id="tqNext">➡ 下一個分頁</button>':'')+'</div>'+
   '<button id="tqBack">🃏 回到字卡</button>'}};
`;
}

const CSS = `
/* ── 📝 複習題 5 題（2026-10-04）：字卡下方的切換按鈕 ── */
body.hastq #stage{padding-bottom:calc(var(--barH,72px) + var(--tqH,52px) + clamp(8px,1.4vh,14px))}
/* 2026-10-07 使用者第 3 點：〔📝 複習題 5 題〕這一顆按鈕不發亮、不放大（沒有光暈、沒有閃三下、按下去也不縮放），以免學習失焦 */
/* 2026-10-09（E16～E20）：#tqBar 一排，最後一張卡多一顆〔➡ 下一個主題〕；還沒講完 ＝ 看不見但位置留著（字卡不會跳） */
#tqBar{position:fixed;left:0;right:0;z-index:30;bottom:calc(var(--barH,72px) + clamp(4px,.8vh,8px));display:flex;justify-content:center;
 gap:clamp(10px,1.6vw,18px);pointer-events:none}
#tqBar button{pointer-events:auto}
#tqBar.wait #tqGo{visibility:hidden;pointer-events:none}
#tqNx{border-color:var(--acc)!important;color:#DDEEFF!important;background:linear-gradient(180deg,#0F2236,#0A1520)!important}
#tqGo,#tqNx,#tqBack{position:static;z-index:30;
 background:linear-gradient(180deg,#2A2208,#171204);border:2px solid var(--gold);color:#FFE9A8;font-family:inherit;font-weight:700;
 font-size:clamp(17px,2.6vh,24px);border-radius:999px;padding:clamp(7px,1.1vh,11px) clamp(20px,2.6vw,32px);min-height:48px;
 white-space:nowrap;box-shadow:none;cursor:pointer}
#tqGo:active{background:#3A2F0B}
#tqBar[hidden]{display:none}
/* 完成 All done!（2026-10-09 使用者：中文「完成」＋英文＋超酷秒懂圖示：綠色大圓圈裡 ✔ 一筆畫出來，彩帶從四周噴出來）＋兩顆大按鈕 */
.tqfin{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.4vh,16px);text-align:center}
.tqdone{position:relative;width:clamp(110px,22vh,200px);height:clamp(110px,22vh,200px)}
.tqdone svg{width:100%;height:100%;overflow:visible;animation:tqPop .5s .95s ease-out both}
.tqdone .c{fill:#0F3323;stroke:var(--ok);stroke-width:7;stroke-dasharray:330;stroke-dashoffset:330;animation:tqDraw .6s .05s ease-out forwards}
.tqdone .k{fill:none;stroke:#fff;stroke-width:11;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:90;stroke-dashoffset:90;animation:tqDraw .4s .6s ease-out forwards}
@keyframes tqDraw{to{stroke-dashoffset:0}}
@keyframes tqPop{50%{transform:scale(1.16)}}
.tqdone i{position:absolute;left:50%;top:50%;width:12px;height:20px;border-radius:3px;opacity:0;background:var(--cc);
 animation:tqConf 1.5s cubic-bezier(.15,.7,.3,1) var(--d) forwards}
@keyframes tqConf{0%{opacity:1;transform:translate(-50%,-50%) rotate(0)}100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) rotate(var(--r))}}
body.reduce .tqdone *{animation-duration:0s!important;animation-delay:0s!important}
body.reduce .tqdone i{display:none}
.tqfin h2{font-size:clamp(44px,8.6vh,84px)!important;color:#fff;margin:0;line-height:1.05;letter-spacing:.1em}
.tqen{font-family:Andika,inherit;font-size:clamp(34px,6.6vh,64px);font-weight:700;color:var(--gold);background:none;border:0;cursor:pointer;line-height:1.1;padding:0 8px}
.tqen.spk{animation:tqBump .6s ease-out}
.tqfin .tqsub{font-size:clamp(18px,3vh,28px)}
.tqfin .rvbtns button{font-size:clamp(24px,4.4vh,40px);padding:clamp(12px,2vh,20px) clamp(24px,3.2vw,40px);min-height:72px}
#tqBack{margin-top:clamp(4px,1vh,10px);border-color:#5A6A78;color:#DDE6EE;background:#141A20;box-shadow:none}
#tqBack:active{transform:scale(.96)}
/* 右上角：大數字的累計分數＋名次 */
.tqhud{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:clamp(8px,1.6vw,20px);width:100%}
.tqhud .lt{display:flex;flex-direction:column;gap:4px;min-width:0}
.tqhud .lt .k{font-size:clamp(14px,2.1vh,19px);color:#9E9E9E;font-weight:700}
.tqkind{align-self:flex-start;font-size:clamp(15px,2.3vh,21px);font-weight:700;border-radius:999px;padding:3px 12px;
 background:#1A2530;border:1px solid #3A5266;color:#CFE3F5;white-space:nowrap}
.tqtop{justify-self:end;display:flex;flex-direction:column;align-items:flex-end;line-height:1}
.tqtop b{font-size:clamp(46px,9vh,92px);font-weight:700;color:var(--gold);text-shadow:0 0 22px rgba(255,210,74,.5)}
.tqtop b.bump{animation:tqBump .5s ease-out}
@keyframes tqBump{40%{transform:scale(1.25);color:#fff}}
.tqtop .rk{margin-top:4px;font-size:clamp(20px,3.6vh,36px);font-weight:700;color:#FFE9A8;white-space:nowrap}
.tqtop .rk em{font-style:normal;font-size:.6em;color:#BFA75A;margin-left:4px}
.tqmid{display:flex;flex-direction:column;align-items:center;gap:4px}
.tqlive{font-size:clamp(16px,2.6vh,24px);font-weight:700;color:var(--ok);white-space:nowrap}
.tqshow{font-size:clamp(34px,7vh,72px);font-weight:700;text-align:center;line-height:1.2;color:#fff}
.tqq{font-size:clamp(23px,4.4vh,44px);font-weight:700;text-align:center;line-height:1.3}
.tqq .em,.tqshow .em{color:var(--gold)}
.tqsub{font-size:clamp(18px,3vh,28px);color:#CFCFCF;text-align:center;font-weight:700}
.tqear{background:#0F2236;border:2px solid var(--acc);color:#fff;border-radius:999px;font-family:inherit;font-weight:700;
 font-size:clamp(22px,4vh,38px);padding:clamp(8px,1.4vh,14px) clamp(24px,3vw,40px);cursor:pointer;min-height:56px}
.tqear.spk{animation:tqBump .6s ease-out infinite}
.tqo{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(8px,1.4vh,14px);width:100%}
.tqo button{display:flex;align-items:center;gap:clamp(6px,1.1vw,13px);text-align:left;background:#121212;border:2px solid #333;
 border-radius:18px;color:#fff;font-family:inherit;font-weight:700;font-size:clamp(21px,3.8vh,38px);
 padding:clamp(10px,1.8vh,18px) clamp(12px,1.6vw,20px);min-height:clamp(64px,10vh,100px);line-height:1.2;cursor:pointer}
.tqo button .sh{flex:0 0 auto;width:1.2em;text-align:center;font-size:.8em;color:#9E9E9E}
.tqo button:active{transform:scale(.97)}
.tqo button.ok{background:#0F3323;border-color:var(--ok)}
.tqo button.bad{background:#3A1111;border-color:var(--no)}
.tqo button.dim{opacity:.32}
/* 認讀：四個選項只有聲音，畫面上不寫字（🔊 聽 ＋ 👆 選） */
.tqr{display:flex;flex-direction:column;gap:6px;background:#121212;border:2px solid #333;border-radius:18px;padding:clamp(8px,1.3vh,12px)}
.tqr.spk{border-color:var(--acc);box-shadow:0 0 18px rgba(127,191,255,.35)}
.tqr .pl{background:#0F2236;border:1px solid #3A5266;border-radius:14px;color:#fff;font-family:inherit;font-weight:700;
 font-size:clamp(22px,4vh,38px);min-height:clamp(52px,8vh,80px);cursor:pointer;justify-content:center}
.tqr .ch{background:#1D1D1D;border:1px solid #444;border-radius:14px;color:#FFE9A8;font-family:inherit;font-weight:700;
 font-size:clamp(17px,2.7vh,26px);min-height:48px;cursor:pointer;justify-content:center}
.tqr.ok{border-color:var(--ok);background:#0F3323}.tqr.bad{border-color:var(--no);background:#3A1111}.tqr.dim{opacity:.32}
.tqo.rd{gap:clamp(8px,1.4vh,14px)}
.tqo.rd .tqr button{min-height:unset;padding:6px 10px;text-align:center}
/* 答對：大大的 ＋880 和算式 */
.tqgain{position:fixed;inset:0;z-index:75;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
 background:rgba(0,0,0,.72);pointer-events:none;animation:tqIn .25s ease-out}
.tqgain b{font-size:clamp(70px,16vh,160px);color:var(--ok);line-height:1;text-shadow:0 0 30px rgba(80,220,140,.5)}
.tqgain .eq{font-size:clamp(22px,4vh,40px);font-weight:700;color:#fff}
.tqgain .eq i{font-style:normal;color:#9E9E9E;margin:0 .3em}
@keyframes tqIn{from{opacity:0;transform:scale(.8)}}
/* 開場：15 秒、愈快分數愈高（會動的秒懂說明） */
.tqintro{display:flex;flex-direction:column;align-items:center;gap:clamp(10px,2vh,20px);text-align:center}
.tqintro h2{font-size:clamp(28px,5.4vh,52px)!important}
.tqrow{display:flex;align-items:center;justify-content:center;gap:clamp(10px,2vw,24px);flex-wrap:wrap;font-size:clamp(20px,3.6vh,34px);font-weight:700}
.tqdemo{width:min(560px,86vw);height:clamp(26px,4.4vh,40px);border-radius:999px;background:#1A1A1A;border:1px solid #333;overflow:hidden;position:relative}
.tqdemo i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#1E7A4C,#5BE39A);border-radius:999px;animation:tqDrain 4s linear infinite}
@keyframes tqDrain{from{width:100%}to{width:10%}}
.tqdn{font-size:clamp(34px,6.4vh,64px);font-weight:700;color:var(--ok);min-width:4em}
.tqintro .rvbtns button{font-size:clamp(18px,3vh,26px);padding:clamp(9px,1.4vh,13px) clamp(18px,2.4vw,28px);min-height:52px}
.tqhud #rvring{width:clamp(72px,11vh,112px);height:clamp(72px,11vh,112px)}
.tqhud #rvnum{font-size:clamp(26px,4.6vh,44px)}
.tqend .sc{font-size:clamp(70px,15vh,150px);font-weight:700;color:var(--gold);line-height:1}
.tqend .rk{font-size:clamp(28px,5.4vh,54px);font-weight:700;color:#FFE9A8}
`;

const JS = `
/* ══════════ 📝 複習題 5 題（2026-10-04 對話 B）══════════ */
var TQD=__TQD__, TQPAGE=__TQPAGE__;
var TQK={read:'👀 認讀',listen:'🎧 聽力',zh2en:'🀄 ➜ 🔤 看中文選英文',en2zh:'🔤 ➜ 🀄 看英文選中文',trap:'⚠️ 易錯'};
var tqQ=null,tqN=0,tqT=15,tqLeft=15,tqTick=null,tqScore=0,tqOK=0,tqBusy=false,tqKey='',tqHist=[];
function tqSet(){if(!TQD)return null;var tb=TABM[TCUR];if(!tb)return null;var s=TQD[TCUR];return tb.sub?(s?s[LCUR]:null):s}
function tqHas(){return !!tqSet()}
/* 2026-10-09（E16～E20）：這個分頁（這一級）講完了沒有 ＝ 有沒有看到最後一張卡；這台平板記住 */
var TQSEEN=store('tqseen_'+TQPAGE)||{};
function tqSk(){return TCUR+'_'+LCUR}
function tqSeen(){return !!(TQSEEN&&TQSEEN[tqSk()])}
function tqFin(){stopPlay();sayStop();
  var nxt=TCUR<TABM.length-1;
  $('#rv').classList.add('on');document.body.classList.add('tqon');
  var cf='',CC=['#FFD24A','#5BE39A','#7FBFFF','#FF7EB6','#FF9F43'];
  for(var n=0;n<26;n++){var a=n/26*6.283+Math.random()*.3,d=95+Math.random()*120;
    cf+='<i style="--cc:'+CC[n%5]+';--x:'+Math.round(Math.cos(a)*d*1.5)+'px;--y:'+Math.round(Math.sin(a)*d)+'px;--r:'+Math.round(Math.random()*720-360)+'deg;--d:'+(0.95+Math.random()*.15).toFixed(2)+'s"></i>'}
  $('#rvbox').innerHTML='<div class="tqfin"><div class="tqdone" aria-hidden="true"><svg viewBox="0 0 120 120"><circle class="c" cx="60" cy="60" r="52"/><path class="k" d="M35 62 L53 80 L87 43"/></svg>'+cf+'</div>'+
   '<h2>完成</h2><button class="tqen" id="tqEn">All done!</button><div class="tqsub">'+esc(tqNm())+'</div>'+
   '<div class="rvbtns"><button class="go" id="tqDo">📝 做 5 題複習</button>'+(nxt?'<button class="go" id="tqNext">➡ 下一個主題</button>':'')+'</div>'+
   '<button id="tqBack">🃏 回到字卡</button></div>';
  clearTimeout(tqFin.t);tqFin.t=setTimeout(tqSayDone,1100)}   /* ✔ 畫好、彩帶噴出來的時候唸 All done!（點英文可以再聽） */
function tqSayDone(){var b=$('#tqEn');if(!b||!document.body.classList.contains('tqon'))return;b.classList.remove('spk');void b.offsetWidth;b.classList.add('spk');say('All done!')}
function tqNm(){var tb=TABM[TCUR];return tb.n+' '+tb.lb+(tb.sub?'・'+tb.sub[LCUR].lb:'')}
function tqStop(){if(tqTick){clearInterval(tqTick);tqTick=null}}
/* 名次：跟這台平板做過這一組的成績比（B3）；平手算同一名 */
function tqRank(s){var n=1;tqHist.forEach(function(x){if(x>s)n++});return n}
function tqRkHTML(s){if(window.scLive&&scLive())return scRk(s);return '🏆 第 '+tqRank(s)+' 名'+(tqHist.length?'<em>共 '+(tqHist.length+1)+' 次</em>':'<em>第一次</em>')}
function tqOpen(){
  stopPlay();sayStop();
  /* 成績紀錄：還沒登入 ➜ 先登入（在家複習可以按〔👀 先練習，不記成績〕） */
  if(SCON&&!SCID&&!SCGUEST){scLogin(tqOpen);return}
  var Q=tqSet();if(!Q)return;
  /* 2026-10-09 E：老師派了任務，這一組沒被指定（或還沒開放、已經截止）➜ 說為什麼鎖住 */
  if(!scTkOk(SCH.key())){scLockShow(scLockOf(SCH.key()));return}
  tqKey='tq_'+TQPAGE+'_'+TCUR+'_'+LCUR;tqHist=store(tqKey)||[];
  $('#rv').classList.add('on');document.body.classList.add('tqon');
  /* 開場：秒懂說明（會動的時間條 ＋ 會往下掉的分數） */
  $('#rvbox').innerHTML='<div class="tqintro"><h2>📝 複習題 5 題</h2><div class="tqsub">'+esc(tqNm())+'</div>'+
   '<div class="tqrow"><span>⏱ 每題 <b style="color:var(--gold)">15</b> 秒</span><span style="color:#9E9E9E">（👀 認讀 20 秒）</span></div>'+
   '<div class="tqrow"><span>✅ 答對</span><span>＋</span><span>⚡ 愈快</span><span>＝</span><span>🏆 分數愈高</span></div>'+
   '<div class="tqdemo"><i></i></div><div class="tqdn" id="tqdn">1000</div>'+
   '<div class="tqrow" style="font-size:clamp(17px,2.8vh,26px);color:#CFCFCF">右上角 ＝ 🏆 總分和'+(scLive()?'本班':'')+'名次</div>'+scMeHTML()+
   '<div class="rvbtns"><button class="go" id="tqStart" style="font-size:clamp(22px,4vh,36px);padding:12px 40px">▶ 開始</button></div>'+
   '<button id="tqBack">🃏 回到字卡</button></div>';
  var t0=Date.now();tqStop();
  tqTick=setInterval(function(){var e=$('#tqdn');if(!e){tqStop();return}
    var f=((Date.now()-t0)%4000)/4000;e.textContent=100+Math.round(900*(1-f))},80);
}
function tqStart(){
  tqStop();sayStop();missHide(false);
  tqQ=tqSet();tqN=0;tqScore=0;tqOK=0;MISSLOG=[];clearTimeout(SCAUTO);SCEND=null;scStart();
  tqAsk();
}
function tqTop(){return '<span class="tqtop"><b id="tqsc">'+tqScore+'</b><span class="rk" id="tqrk">'+tqRkHTML(tqScore)+'</span></span>'}
function tqAsk(){
  tqBusy=false;tqStop();
  if(tqN>=tqQ.length){tqEnd();return}
  var q=tqQ[tqN];tqT=q.k==='read'?20:15;scAsk(q,tqN);
  var o=shuf(q.o.map(function(x,n){return{x:x,n:n}})), body='';
  if(q.k==='read'){
    body='<div class="tqshow">'+ap(q.show)+'</div><div class="tqsub">'+q.q+'</div>'+
     '<div class="tqo rd">'+o.map(function(t,n){return '<div class="tqr" data-i="'+n+'">'+
       '<button class="pl" data-say="'+esc(t.x)+'">🔊 '+(n+1)+'</button>'+
       '<button class="ch" data-ok="'+(t.n===0)+'" data-n="'+t.n+'" data-t="'+esc(t.x)+'">👆 選 '+(n+1)+'</button></div>'}).join('')+'</div>';
  }else{
    body=(q.k==='listen'?'<button class="tqear" id="tqear">🔊 再聽一次</button>':'')+
     '<div class="tqq">'+ap(q.q)+'</div>'+
     '<div class="tqo">'+o.map(function(t,n){
       return '<button data-ok="'+(t.n===0)+'" data-n="'+t.n+'" data-t="'+esc(t.x)+'"><span class="sh">'+SHP[n]+'</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>';
  }
  $('#rvbox').innerHTML='<div class="tqhud"><span class="lt"><span class="k">📝 第 '+(tqN+1)+' ／ '+tqQ.length+' 題</span>'+
    '<span class="tqkind">'+TQK[q.k]+'</span></span>'+
   '<span class="tqmid"><span id="rvring"><svg viewBox="0 0 100 100"><circle id="rvbg" cx="50" cy="50" r="46"></circle>'+
    '<circle id="rvfg" cx="50" cy="50" r="46"></circle></svg><span id="rvnum">'+tqT+'</span></span>'+
    '<span class="tqlive" id="tqlive">⚡ ＋1000</span></span>'+tqTop()+'</div>'+body+
   '<button id="tqBack">🃏 回到字卡</button>';
  $('#rvfg').setAttribute('stroke-dasharray',RVR);
  tqLeft=tqT;tqPaint();
  tqTick=setInterval(function(){
    tqLeft-=0.1;
    if(tqLeft<=0){tqLeft=0;tqPaint();tqDone(null,false);return}
    tqPaint();
  },100);
  /* 認讀：四句自動輪流唸一次（唸到哪一個，那一格亮）；聽力：自動唸一次 */
  var my=tqN;
  if(q.k==='read'){var k=0,rs=$$('.tqr'),nx=function(){
      rs.forEach(function(r){r.classList.remove('spk')});
      if(tqN!==my||tqBusy||k>=rs.length||!$('#rv').classList.contains('on'))return;
      var r=rs[k++],t=$('.pl',r).getAttribute('data-say');r.classList.add('spk');
      say(t,null,{v:boyV(t),done:function(){scHeard();setTimeout(nx,350)}})};
    setTimeout(nx,500)}
  if(q.k==='listen'){var ear=$('#tqear');ear.classList.add('spk');
    setTimeout(function(){if(tqN===my)say(q.say,null,{v:boyV(q.say),done:function(){ear.classList.remove('spk')}})},450)}
}
function tqPts(){return 100+Math.round(900*(tqLeft/tqT))}
function tqPaint(){
  var n=$('#rvnum');if(!n)return;
  n.textContent=Math.ceil(tqLeft);
  $('#rvfg').setAttribute('stroke-dashoffset',RVR*(1-tqLeft/tqT));
  $('#rvring').className=tqLeft<=5?'dang':(tqLeft<=tqT/2?'warn':'');
  var l=$('#tqlive');if(l)l.textContent='⚡ ＋'+tqPts();
}
function tqDone(btn,ok){
  if(tqBusy)return;tqBusy=true;tqStop();sayStop();scDone(btn?+(btn.getAttribute('data-n')||0):-1,ok,tqLeft/tqT);
  var q=tqQ[tqN], rd=q.k==='read';
  $$(rd?'.tqr':'.tqo button').forEach(function(x){
    var c=rd?$('.ch',x):x;
    if(c.getAttribute('data-ok')==='true')x.classList.add('ok');
    else if(c===btn)x.classList.add('bad');else x.classList.add('dim')});
  if(ok){
    var p=tqPts();tqScore+=p;tqOK++;sOk();
    var sc=$('#tqsc');sc.textContent=tqScore;sc.classList.remove('bump');void sc.offsetWidth;sc.classList.add('bump');
    $('#tqrk').innerHTML=tqRkHTML(tqScore);
    var g=document.createElement('div');g.className='tqgain';
    g.innerHTML='<b>＋'+p+'</b><div class="eq">✅ 100<i>＋</i>⚡ '+(p-100)+'</div>';
    document.body.appendChild(g);
    setTimeout(function(){if(g.parentNode)g.parentNode.removeChild(g);tqN++;if($('#rv').classList.contains('on'))tqAsk()},1300);
    return;
  }
  sNo();
  /* 答錯：遊戲的答錯頁（不傳 gain ➜ 沒有 ⭐ 加分）；認讀、聽力的題目寫出那一句英文 */
  var qq=rd?'「'+q.show+'」　哪一個唸的是它？':(q.k==='listen'?'🔊 '+q.say+'　'+q.q:q.q);
  var mo={q:qq,pick:btn?btn.getAttribute('data-t'):null,ans:q.o[0],why:q.h};
  if(q.sp!=null)mo.sp=q.sp;
  var my=tqN;
  setTimeout(function(){
    missShow(mo,function(){if(tqN===my&&$('#rv').classList.contains('on')){tqN++;tqAsk()}});
  },700);
}
function tqEnd(){
  tqStop();sayStop();
  if(scLive()){scEnd({m:'q',raw:tqScore});sWow();return}
  var r=tqRank(tqScore),tot=tqHist.length+1;
  tqHist.push(tqScore);tqHist.sort(function(a,b){return b-a});store(tqKey,tqHist.slice(0,50));
  var nxt=TCUR<TABM.length-1;
  $('#rvbox').innerHTML='<div class="tqintro tqend"><h2>📝 '+esc(tqNm())+'　完成！</h2>'+
   '<div class="sc">'+tqScore+'</div><div class="rk">🏆 第 '+r+' 名'+(tot>1?'<span style="font-size:.55em;color:#BFA75A">　這台平板做了 '+tot+' 次</span>':'')+'</div>'+
   '<div class="tqsub">✅ 答對 '+tqOK+' ／ '+tqQ.length+' 題'+(tqOK===tqQ.length?'　🎉 全對！':'')+'</div>'+
   '<div class="rvbtns">'+(MISSLOG.length?'<button id="tqMiss">📌 答錯整理</button>':'')+
   '<button class="go" id="tqAgain">🔁 再做一次</button>'+(nxt?'<button class="go" id="tqNext">➡ 下一個分頁</button>':'')+'</div>'+
   '<button id="tqBack">🃏 回到字卡</button></div>';
  sWow();
  missAll(tqNm()+'　答錯整理');
}
function tqClose(){tqStop();sayStop();clearTimeout(SCAUTO);SCEND=null;missHide(false);var m=$('#missAll');if(m)m.classList.remove('on');
  $('#rv').classList.remove('on');document.body.classList.remove('tqon');var g=$('.tqgain');if(g&&g.parentNode)g.parentNode.removeChild(g)}
$('#rv').addEventListener('click',function(e){
  if(!document.body.classList.contains('tqon'))return;
  var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#tqStart')||c('#tqAgain')){tqStart();return}
  if(c('#tqDo')){clearTimeout(tqFin.t);tqClose();tqOpen();return}
  if(c('#tqEn')){tqSayDone();return}
  if(c('#tqBack')){tqClose();return}
  if(c('#tqMiss')){missAll(tqNm()+'　答錯整理');return}
  if(c('#tqNext')){tqClose();setDeck(TCUR+1,TABM[TCUR+1].sub?LMEM:0);return}
  if((b=c('#tqear'))){var q=tqQ[tqN];if(!tqBusy){sayStop();say(q.say,null,{v:boyV(q.say)})}return}
  if((b=c('.tqr .pl'))){if(tqBusy)return;sayStop();var r=b.parentNode;$$('.tqr').forEach(function(x){x.classList.toggle('spk',x===r)});
    var s=b.getAttribute('data-say');say(s,null,{v:boyV(s),done:function(){r.classList.remove('spk')}});return}
  if((b=c('.tqr .ch'))||(b=c('.tqo button'))){if(!tqBusy)tqDone(b,b.getAttribute('data-ok')==='true');return}
});
$('#tqGo').addEventListener('click',tqOpen);
$('#tqNx').addEventListener('click',function(){if(TCUR<TABM.length-1)setDeck(TCUR+1,TABM[TCUR+1].sub?LMEM:0)});
/* 換卡、換分頁：這一組有沒有題目（目前每一個分頁都有）；最後一張卡 ＝ 講完了（2026-10-09 E16～E20）；按鈕不閃（2026-10-07） */
function tqMark(){var bar=$('#tqBar'),g=$('#tqGo');if(!bar||!TQSEEN||typeof TCUR!=='number')return;   /* 換卡引擎比這一段先跑：還沒準備好就先不畫 */var has=tqHas(),last=typeof i==='number'&&i===CARDS.length-1;
  if(has&&last&&!tqSeen()){TQSEEN[tqSk()]=1;store('tqseen_'+TQPAGE,TQSEEN)}
  bar.hidden=!has;bar.classList.toggle('wait',!tqSeen());
  g.textContent=(window.SCH&&SCH.key&&!scTkOk(SCH.key())?'🔒 ':'📝 ')+(last?'做 5 題複習':'複習題 5 題');   /* 🔒 ＝ 老師現在沒有指定這一組（2026-10-09 E） */
  $('#tqNx').hidden=!(has&&last&&TCUR<TABM.length-1);
  document.documentElement.style.setProperty('--tqH',(bar.hidden?0:g.offsetHeight)+'px')}
`;

module.exports = { attach, scJS, CSS: CSS + SCC.CSS, JS };
