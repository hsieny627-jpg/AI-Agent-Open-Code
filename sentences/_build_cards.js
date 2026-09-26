/* sentences/_build_cards.js — Unit 1／Unit 2 句型卡的產生器
 * node sentences/_build_cards.js  → unit1.html ／ unit2.html
 * 卡片內容改 _data.js，版面改這裡，不要手改產出的 .html
 *
 * 三大重點（使用者 2026-09-20 指定）：版面簡潔清爽、廢話少、秒懂動畫多。
 */
const fs = require('fs'), SITE = require('./_site'), DIR = SITE.DIR;
const S = require('./_shared');
const D = SITE.load('_data');

/* ── 別的課次共用這一套引擎時才會用到的設定（sentences 沒寫 ➜ 跟原本一模一樣）──
   CONTR：哪些縮寫尾巴要黏住前一個字、唸成「前一個字＋縮寫」（sentences 只有 's）
   SIL  ：不發音的字母要淺灰色（{ name:[3] } ＝ name 的第 4 個字母 e），沒寫就用 Who／What 的舊規則 */
const CONTR = D.CONTR ? '(?:' + D.CONTR.join('|') + ')' : 's';
const SUF = v => D.CONTR ? '"\'"+' + v + '.slice(1)' : '"\'s"';
const ENHTML = D.SIL ? `function enHTML(s,ri){
  s=String(s);var out='',did=0,SL=${JSON.stringify(D.SIL)},sil={},re=/[A-Za-z]+/g,m;
  /* 不發音的字母 ＝ 淺灰色：一個字一個字查 SIL（What’s 的 What、name? 的 name 都查得到） */
  while((m=re.exec(s))){var L=SL[m[0].toLowerCase()];if(L)L.forEach(function(k){sil[m.index+k]=1})}
  for(var n=0;n<s.length;n++){
    var ch=s.charAt(n);
    if(sil[n]){out+='<b class="sil">'+ch+'</b>';continue}
    if(ri&&!did&&ch===ri){out+='<b class="ri">'+ch+'</b>';did=1;continue}
    if(ch==="'"||ch==='\\u2019'){out+='<b class="ap">\\u2019</b>';continue}
    out+=ch;
  }
  return out;
}` : null;

const CSS = `
#stage{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
 padding:calc(var(--safeT) + clamp(34px,5.4vh,52px)) clamp(76px,9.6vw,112px)
         calc(var(--barH,72px) + clamp(6px,1vh,12px)) clamp(76px,9.6vw,112px);
 perspective:1400px}

/* 字卡本體：純黑底（使用者指定） */
#card{width:100%;max-width:1180px;height:100%;background:#000;
 border:1px solid #262626;border-radius:22px;box-shadow:0 0 0 1px rgba(159,180,200,.05),0 18px 60px rgba(0,0,0,.9);
 display:flex;align-items:center;justify-content:center;
 padding:clamp(12px,2.2vh,26px) clamp(12px,2vw,30px);overflow:hidden;position:relative}
/* 內層負責內容，量到太大就整塊等比縮小 —— 這是「永遠不溢出」的關鍵 */
#cardIn{width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;
 transform-origin:center center}
/* flex 預設的 min-width:auto 會被 white-space:nowrap 的長句子撐大，整塊就跑出卡片外面
   （字一放大就會壓到左右翻頁箭頭）。這三行讓它縮得回來，fit() 才量得到「需要縮小」。 */
#cardIn,.wrap,.eq,.swapbox,.ord,.focus,.pair,.mor,.echo{min-width:0;max-width:100%}
.eq{width:100%}
#card.turnR{animation:turnR .42s cubic-bezier(.22,.7,.3,1)}
#card.turnL{animation:turnL .42s cubic-bezier(.22,.7,.3,1)}
@keyframes turnR{from{opacity:0;transform:translateX(9%) rotateY(-12deg)}to{opacity:1;transform:none}}
@keyframes turnL{from{opacity:0;transform:translateX(-9%) rotateY(12deg)}to{opacity:1;transform:none}}

/* 卡片類型標籤 */
.kind{position:absolute;top:clamp(9px,1.5vh,16px);left:clamp(12px,1.8vw,22px);
 font-size:clamp(11px,1.6vh,14px);color:#3E3E3E;letter-spacing:.14em}

/* ── 句子（一個字一欄：英文／中文／圖示）── */
.wrap{width:100%;display:flex;align-items:center;justify-content:center;
 transform-origin:center center}
.line{display:flex;align-items:flex-start;justify-content:center;
 gap:clamp(6px,1.1vw,18px);white-space:nowrap}
.tk{display:flex;flex-direction:column;align-items:center;gap:clamp(2px,.5vh,7px);
 padding:2px 2px 4px;border-radius:12px;transition:background .18s}
.tk.tight{margin-left:calc(-1 * clamp(6px,1.1vw,18px))}
/* ’s／’m／’re 底下的「是」要在 s 的正下方（使用者 2026-09-25 指定）：
   ’ 在左邊佔了一點寬度，整格置中會讓「是」看起來偏到 ’ 下面，往右推回 s 的正下方 */
.tk.ctr .zh,.tk.ctr .ic{position:relative;left:.16em}
.tk.ctr .zh{left:.3em}
.tk:active{background:#161616}
/* 字體放大（使用者指定） */
.tk .en{font-size:clamp(30px,8.6vh,82px);font-weight:700;line-height:1.08;
 letter-spacing:.005em;color:var(--fg)}
.tk .zh{font-size:clamp(19px,3.6vh,36px);color:var(--acc);line-height:1.15;font-weight:400}
.tk .ic{font-size:clamp(22px,4.2vh,44px);line-height:1.1}
.tk .ic:empty{display:none}
/* 主詞／be 動詞底色：用顏色就秒懂位置交換（使用者指定） */
.tk.b .en{background:var(--he);color:#fff;border-radius:10px;padding:0 .18em}
.tk.p .en{background:var(--she);color:#fff;border-radius:10px;padding:0 .18em}
.tk.y .en{background:var(--be);color:#000;border-radius:10px;padding:0 .18em}

/* 整句中文 */
.full{margin-top:clamp(10px,2.1vh,22px);font-size:clamp(23px,4.3vh,44px);
 color:var(--body);letter-spacing:.03em;text-align:center;line-height:1.35}
.full:active{color:#fff}

/* ── 四個 Y/N 開關：英文／中文／圖示／整句中文（使用者指定）── */
#card.no-en .en{display:none}
#card.no-zh .zh{display:none}
#card.no-ic .ic{display:none}
#card.no-full .full{display:none}
/* 關掉上面幾層，剩下的那一層就放大，整張卡永遠有主角 */
#card.no-en .tk .zh{font-size:clamp(24px,5vh,48px);color:var(--fg)}
#card.no-en.no-zh .tk .ic{font-size:clamp(34px,7.6vh,78px)}
#card.no-en.no-zh.no-ic .full{font-size:clamp(30px,6.2vh,64px);color:var(--fg);margin:0}
#card.no-en.no-zh .scene .suse,#card.no-en.no-zh .scene .sat{display:none}

/* 逐字動畫：一次只出現一個重點 */
.tk.hide{opacity:0;transform:translateY(14px) scale(.86);pointer-events:none}
.tk{opacity:1;transform:none;transition:opacity .34s ease,transform .34s cubic-bezier(.2,.9,.3,1.2)}
.tk.pop{animation:pop .5s cubic-bezier(.2,.9,.3,1.3)}
@keyframes pop{0%{transform:translateY(16px) scale(.8);opacity:0}
 55%{transform:translateY(-4px) scale(1.09);opacity:1}100%{transform:none;opacity:1}}
.full.hide{opacity:0;pointer-events:none}
#tapHint{position:absolute;bottom:clamp(8px,1.4vh,14px);left:0;right:0;text-align:center;
 font-size:clamp(11.5px,1.7vh,15px);color:#4D4D4D;letter-spacing:.08em}
#tapHint.off{display:none}

/* ── 真實情境：會動的小劇場（老師按「🎞 情境」才出現；使用者 2026-09-24 指定改版）──
   背景亮 ➜ 兩個人走進來 ➜ 左邊的人說話 ➜ 右邊的人回答 ➜ 💡 什麼時候這樣說。
   全部只動 transform／opacity，2.8 秒演完。 */
.scene{display:none;flex-direction:column;align-items:stretch;gap:clamp(3px,.6vh,7px);
 width:100%;max-width:960px;margin-bottom:clamp(8px,1.5vh,16px);
 background:linear-gradient(180deg,#0B121A,#05080B);border:1px solid #1E2831;border-radius:16px;
 padding:clamp(6px,1.1vh,12px) clamp(10px,1.6vw,20px);overflow:hidden}
#card.sc .scene{display:flex}
.sth{position:relative;display:flex;align-items:center;gap:clamp(6px,1vw,12px);
 min-height:clamp(70px,11.5vh,118px);padding:clamp(14px,2.2vh,22px) clamp(30px,3.6vw,44px) 0}
.sbg{position:absolute;left:50%;top:55%;font-size:clamp(66px,12vh,124px);line-height:1;
 opacity:.14;pointer-events:none;transform:translate(-50%,-50%);animation:sbgIn .7s ease both}
@keyframes sbgIn{from{opacity:0;transform:translate(-50%,-50%) scale(.6)}to{opacity:.14;transform:translate(-50%,-50%)}}
.sat{position:absolute;left:0;top:0;font-size:clamp(11px,1.7vh,16px);color:#7E93A5;letter-spacing:.08em;
 white-space:nowrap}
.sact{position:relative;display:flex;flex-direction:column;align-items:center;flex:0 0 auto;z-index:1}
.sfig{font-size:clamp(36px,6.6vh,66px);line-height:1;display:inline-block}
.snm{font-size:clamp(10px,1.5vh,14px);color:var(--dim);margin-top:2px;white-space:nowrap}
.stag{position:absolute;top:-.3em;right:-.35em;font-size:clamp(18px,3.2vh,32px);
 animation:tagIn .5s cubic-bezier(.2,1.5,.4,1) 1.3s both,bob 1.3s ease-in-out 1.8s infinite}
@keyframes tagIn{from{opacity:0;transform:scale(.2) translateY(10px)}to{opacity:1;transform:none}}
@keyframes bob{0%,100%{transform:none}50%{transform:translateY(-6px)}}
/* 走進來：一跳一跳的 */
.sact.L{animation:walkL .9s linear .15s both}
.sact.R{animation:walkR .9s linear .5s both}
@keyframes walkL{0%{opacity:0;transform:translateX(-26px)}15%{opacity:1}
 25%{transform:translateX(-19px) translateY(-9px)}50%{transform:translateX(-12px)}
 75%{transform:translateX(-5px) translateY(-9px)}100%{opacity:1;transform:none}}
@keyframes walkR{0%{opacity:0;transform:translateX(26px)}15%{opacity:1}
 25%{transform:translateX(19px) translateY(-9px)}50%{transform:translateX(12px)}
 75%{transform:translateX(5px) translateY(-9px)}100%{opacity:1;transform:none}}
/* 說話的那一個會點頭 */
.sact.L .sfig{animation:talk .3s ease-in-out 1.15s 4 alternate}
.sact.R.ans .sfig{animation:talk .3s ease-in-out 2.25s 4 alternate}
@keyframes talk{from{transform:none}to{transform:translateY(-5px) rotate(-6deg)}}
/* 對話框 */
.sbub{position:relative;z-index:1;background:#F2F2F2;color:#111;font-weight:700;border-radius:16px;
 padding:clamp(5px,1vh,10px) clamp(9px,1.3vw,16px);font-size:clamp(16px,2.8vh,28px);line-height:1.25;
 max-width:42%;min-width:0;text-align:center;
 animation:bubIn .5s cubic-bezier(.2,1.5,.4,1) 1.05s both;transition:transform .16s,box-shadow .16s}
.sbub.R{background:#FFE7A0;animation-delay:2.15s}
.sbub.L::before,.sbub.R::after{content:'';position:absolute;top:50%;margin-top:-8px;
 border:8px solid transparent}
.sbub.L::before{left:-14px;border-right:8px solid #F2F2F2}
.sbub.R::after{right:-14px;border-left:8px solid #FFE7A0}
@keyframes bubIn{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:none}}
.ssp{flex:1 1 auto}
.scene .suse{font-size:clamp(15px,2.5vh,24px);color:var(--fg);line-height:1.4;text-align:center;
 animation:suseIn .5s ease 2.55s both}
@keyframes suseIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.reduce .sact,.reduce .sbub,.reduce .suse,.reduce .stag{opacity:1;animation:none}
.reduce .sbg{opacity:.14;animation:none}

/* ── 替換字：放在卡片最下面，不跟中間的英文句子搶位置（使用者指定）── */
.subs{position:absolute;left:clamp(8px,1.6vw,20px);right:clamp(8px,1.6vw,20px);
 bottom:clamp(6px,1.1vh,12px);display:flex;flex-direction:column;
 gap:clamp(3px,.6vh,7px);align-items:center;z-index:2}
.subrow{display:flex;flex-wrap:wrap;gap:clamp(4px,.8vw,9px);justify-content:center;align-items:center}
.subrow .lbl{font-size:clamp(10.5px,1.5vh,13px);color:#5C5C5C;letter-spacing:.1em;margin-right:4px}
.sub{display:inline-flex;align-items:center;gap:5px;background:#0E0E0E;border:1px solid #2E2E2E;
 border-radius:999px;padding:clamp(4px,.75vh,8px) clamp(8px,1.1vw,14px);
 font-size:clamp(12.5px,1.9vh,18px);color:var(--body);font-weight:700}
.sub em{font-style:normal;font-size:.72em;color:var(--dim);font-weight:400}
.sub.on{background:#2C3A48;border-color:var(--acc);color:#fff}
.sub:active{transform:scale(.95)}
.sub.adv{border-style:dashed;border-color:#3A4650}

/* ── 等式卡：兩句「一句一句亮起來、一句一句唸出來」，最後兩句一起亮＋等號放大
   （使用者 2026-09-21 指定：兩句都要完整聽到，而且要秒懂它們是同一句）── */
.eq{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.3vh,16px)}
.eqrow{width:100%;border-radius:16px;transition:background .35s,box-shadow .35s;
 padding:clamp(3px,.7vh,8px) clamp(4px,.8vw,10px)}
.eqrow.lit{background:#0F1720;box-shadow:0 0 0 2px rgba(159,180,200,.5)}
.eq.left{width:auto;align-items:stretch}
.eq.left .eqrow .wrap{justify-content:flex-start}
.eq.left .eqmark,.eq.left .swapbtn{align-self:center}
.eqmark{font-size:clamp(28px,5.4vh,54px);color:var(--be);font-weight:700;line-height:1;
 display:inline-block}
.eqmark.pulse{animation:eqp 1s cubic-bezier(.2,.9,.3,1.4)}
@keyframes eqp{0%{transform:scale(1)}38%{transform:scale(2.1);color:var(--ok)}
 70%{transform:scale(2.1);color:var(--ok)}100%{transform:scale(1)}}
.note{margin-top:clamp(9px,1.8vh,20px);font-size:clamp(15px,2.4vh,24px);color:var(--dim);
 text-align:center;max-width:40ch;line-height:1.4}

/* ── 語序卡：中文的字會飛到英文的位置（秒懂動畫）──
   中文和英文放在「同一個 grid」裡：同一欄的寬度由兩排一起決定，
   所以上下永遠對得齊，而且每一格都放得下整個字——
   Who 的 ho 不會再被折到下一行（使用者 2026-09-21 回報）。 */
.ord{display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,18px);width:100%}
.ordgrid{display:grid;align-items:center;justify-items:stretch;justify-content:center;
 column-gap:clamp(5px,.9vw,12px);row-gap:clamp(8px,1.6vh,18px);max-width:100%}
.ordgrid .cap{font-size:clamp(12px,1.8vh,16px);color:#5C5C5C;letter-spacing:.12em;
 justify-self:end;text-align:right;padding-right:clamp(2px,.5vw,6px)}
.chip{display:flex;flex-direction:column;align-items:center;gap:3px;border-radius:14px;
 padding:clamp(6px,1.2vh,13px) clamp(10px,1.4vw,18px);font-weight:700;white-space:nowrap;
 font-size:clamp(28px,6.4vh,64px);line-height:1.1;background:#141414;color:var(--fg);
 transition:transform .22s cubic-bezier(.2,.9,.3,1.4),filter .22s,box-shadow .22s}
.chip .cen{display:block;white-space:nowrap}
.chip .ci{font-size:clamp(18px,3.4vh,34px);font-weight:400}
/* 中英連動（使用者 2026-09-25 指定）：點中文或英文，上下兩個同色的字一起放大變亮 */
.chip.lnk{transform:scale(1.2);filter:brightness(1.3);position:relative;z-index:3;
 box-shadow:0 0 0 4px rgba(255,255,255,.85),0 0 34px rgba(255,255,255,.55)}
.chip.zin{opacity:0;transform:translateY(22px) scale(.6)}
.chip .ci:empty{display:none}
.chip.r{background:var(--ap);color:#fff}
.chip.y{background:var(--be);color:#000}
.chip.b{background:var(--he);color:#fff}
.chip.p{background:var(--she);color:#fff}
.chip.g{background:#262626;color:var(--dim)}
.chip.fly{animation:fly .95s cubic-bezier(.3,.7,.3,1)}
@keyframes fly{0%{transform:translateX(var(--dx)) scale(.9);opacity:.35}
 60%{transform:translateX(0) scale(1.14)}100%{transform:none}}

/* ── 秒懂重點卡：一行一件事，一行一行跳出來 ── */
.focus{width:100%;display:flex;flex-direction:column;align-items:center;gap:clamp(7px,1.4vh,15px)}
.focus h2{margin:0 0 clamp(4px,1vh,10px);font-size:clamp(24px,4.4vh,46px);font-weight:700;
 color:var(--fg);text-align:center;letter-spacing:.02em}
.frow{display:flex;align-items:center;gap:clamp(10px,1.8vw,24px);width:100%;max-width:840px;
 background:#0C0C0C;border:1px solid #232323;border-radius:14px;
 padding:clamp(8px,1.5vh,16px) clamp(12px,1.8vw,24px);
 opacity:0;animation:rowIn .48s cubic-bezier(.2,.9,.3,1.25) forwards}
@keyframes rowIn{from{opacity:0;transform:translateY(20px) scale(.94)}to{opacity:1;transform:none}}
.reduce .frow{opacity:1;animation:none}
.frow .fi{font-size:clamp(26px,4.2vh,44px);flex:0 0 auto;width:1.5em;text-align:center}
.frow .fa{font-size:clamp(23px,4.3vh,44px);font-weight:700;flex:0 0 auto}
.frow .fb{font-size:clamp(19px,3.4vh,34px);color:var(--acc);flex:1 1 auto;text-align:right}
/* Who ＝ 誰：中文就貼在英文旁邊，不要甩到最右邊（使用者 2026-09-21 指定） */
.frow.eqr{justify-content:center;gap:clamp(8px,1.6vw,20px)}
.frow.eqr .fi{width:auto}
.frow.eqr .fa,.frow.eqr .fb{flex:0 0 auto;text-align:left}
.frow.eqr .fe{font-size:clamp(20px,3.6vh,36px);color:var(--be);font-weight:700;flex:0 0 auto}
/* ── 秒懂重點（Who／What／How）：三欄上下對齊、一次出現一個字（使用者 2026-09-25 指定）──
   英文、＝、中文放在同一個 grid，欄寬由每一列一起決定，所以永遠上下對齊。
   一列一列演：先跳出英文（同時唸出來），英文出來以後才跳出 ＝ 和中文。 */
.fq{gap:clamp(8px,1.6vh,18px)}
.fq h2{font-size:clamp(28px,5.2vh,54px);margin:0}
.fgrid{display:grid;grid-template-columns:repeat(4,auto);justify-content:center;align-items:center;
 column-gap:clamp(12px,2.2vw,30px);row-gap:clamp(8px,1.9vh,22px);background:#080808;border:1px solid #1E1E1E;
 border-radius:22px;padding:clamp(10px,2.2vh,24px) clamp(16px,2.8vw,40px);max-width:100%}
.fgrid>span{transition:opacity .35s ease,transform .5s cubic-bezier(.2,.9,.3,1.35)}
.fgrid .gi{font-size:clamp(32px,6vh,60px);text-align:center;line-height:1}
.fgrid .fa{font-size:clamp(40px,9.4vh,96px);font-weight:700;text-align:center;line-height:1.04;white-space:nowrap}
.fgrid .fe{font-size:clamp(30px,6.2vh,62px);color:var(--be);font-weight:700;text-align:center;line-height:1}
.fgrid .fb{font-size:clamp(32px,6.8vh,68px);color:var(--acc);font-weight:700;text-align:left;white-space:nowrap;line-height:1.1}
.fgrid .fh{opacity:0;transform:translateY(18px) scale(.7)}
.fgrid.uses{row-gap:clamp(4px,.9vh,10px)}
.fgrid.uses .fa{font-size:clamp(32px,6.6vh,68px)}
.fgrid.uses .fb{font-size:clamp(26px,5vh,50px)}
.fgrid.uses .gi{font-size:clamp(26px,4.6vh,46px)}
/* 用法放在那一列的正下方（跨四欄），版面不會變寬 */
.fu{display:none;grid-column:1/-1;justify-self:center;align-items:center;gap:clamp(6px,1vw,14px);white-space:nowrap;
 margin-bottom:clamp(4px,1vh,12px);
 background:#161206;border:2px solid #5E4B12;border-radius:16px;padding:clamp(4px,.8vh,10px) clamp(8px,1.2vw,16px)}
.fgrid.uses .fu{display:flex;opacity:0;animation:useIn .6s cubic-bezier(.2,1.2,.3,1.2) forwards}
.fu b{font-size:clamp(22px,4.4vh,44px);color:var(--gold);font-weight:700}
.fv{display:inline-flex;align-items:flex-end;gap:.1em;font-size:clamp(24px,4.8vh,48px);line-height:1}
.fv i{font-style:normal;display:inline-block;opacity:0;animation:uPop .5s cubic-bezier(.2,1.6,.4,1) forwards,uHop 1.6s ease-in-out infinite}
.fv i:nth-child(1){animation-delay:.35s,1s}.fv i:nth-child(2){animation-delay:.55s,1.2s}
.fv i:nth-child(3){animation-delay:.75s,1.4s}.fv i:nth-child(4){animation-delay:.95s,1.6s}
.fv i.spin{animation:uPop .5s cubic-bezier(.2,1.6,.4,1) forwards,uSpin 2.4s linear infinite}
/* 程度：一格一格長高的量表 */
.fv .bars{display:inline-flex;align-items:flex-end;gap:3px;height:1em;margin:0 .15em}
.fv .bars u{display:block;width:.2em;background:var(--ok);border-radius:3px;transform-origin:bottom;
 transform:scaleY(0);animation:uBar 2.2s ease-in-out infinite}
.fv .bars u:nth-child(1){height:30%}.fv .bars u:nth-child(2){height:55%;animation-delay:.2s}
.fv .bars u:nth-child(3){height:80%;animation-delay:.4s}.fv .bars u:nth-child(4){height:100%;animation-delay:.6s}
@keyframes useIn{from{opacity:0;transform:translateX(-24px) scale(.8)}to{opacity:1;transform:none}}
@keyframes uPop{from{opacity:0;transform:scale(.2) translateY(20px)}to{opacity:1;transform:none}}
@keyframes uHop{0%,100%{transform:none}50%{transform:translateY(-.22em)}}
@keyframes uSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes uBar{0%{transform:scaleY(0)}45%,80%{transform:scaleY(1)}100%{transform:scaleY(0)}}
.reduce .fgrid .fh{opacity:1;transform:none}
.reduce .fgrid.uses .fu,.reduce .fv i{opacity:1;animation:none}
.reduce .fv .bars u{transform:none;animation:none}
.swapbtn.on{background:#2A2208;border-color:var(--gold);color:var(--gold)}

/* ── 對話卡：中文放大、照英文的意思斷字（使用者指定）── */
.pair{width:100%;display:flex;flex-direction:column;gap:clamp(8px,1.8vh,20px);
 align-items:stretch;max-width:1040px}
.bub{display:flex;align-items:center;gap:clamp(9px,1.5vw,18px);border-radius:18px;
 padding:clamp(10px,1.9vh,20px) clamp(12px,1.8vw,24px);border:1px solid #242424;background:#0B0B0B;
 opacity:0;animation:rowIn .48s cubic-bezier(.2,.9,.3,1.25) forwards}
.reduce .bub{opacity:1;animation:none}
.bub.q{border-color:#2E3A46}
.bub.a{border-color:#2E4636;margin-left:clamp(14px,4vw,64px)}
.bub .bi{font-size:clamp(28px,4.8vh,50px);flex:0 0 auto}
.bub .bt{flex:1 1 auto;min-width:0}
/* 每一個英文字的正下方，就是那一個字的中文（使用者 2026-09-21 指定）
   2026-09-24 使用者指定：一問一答的英文和中文都太小 ➜ 英文 46 → 70、中文 28 → 40、整句中文 30 → 40 */
.pair .tk .en{font-size:clamp(30px,7.2vh,70px)}
.pair .tk .zh{font-size:clamp(20px,4vh,40px)}
.pair .tk .ic{font-size:clamp(18px,3.2vh,32px)}
.pair .full{margin-top:clamp(4px,.9vh,10px);font-size:clamp(21px,4vh,40px);
 letter-spacing:.04em;text-align:center}

/* ── 變身卡（Unit 2 的核心秒懂動畫）── */
.swapbox{width:100%;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,18px)}
.swapbtn{background:var(--btn);border:1px solid var(--line);border-radius:999px;
 color:var(--fg);font-size:clamp(15px,2.4vh,23px);font-weight:700;
 padding:clamp(8px,1.4vh,14px) clamp(16px,2.4vw,30px)}
.swapbtn:active{transform:scale(.96);border-color:var(--acc)}
.swaprow{display:flex;gap:clamp(8px,1.4vw,16px);flex-wrap:wrap;justify-content:center}
#puncGo{font-size:clamp(13px,2vh,19px);font-weight:400;color:var(--body)}
.swaphint{font-size:clamp(13px,2.1vh,20px);color:var(--dim);text-align:center}
.tk.moving{z-index:3}
.tk.flash .en{box-shadow:0 0 0 3px rgba(255,255,255,.55)}

/* ── 顏色三條（使用者 2026-09-21 指定）────────────────────────────
   ① Who 的 w 不發音 → 淺灰色
   ② is 的 i ／ not 的 o → 紅色（等一下會被 ’ 藏起來）
   ③ Unit 1 的 she 用淺粉底，跟 Who 的紅色分得開 */
.sil{color:#8C8C8C}
.ri{color:var(--ap)}
.tk.lp .en{background:#F7A8C4;color:#3A0A1C;border-radius:10px;padding:0 .18em}
/* 2026-09-25 使用者指定：「她」的底色跟「誰」太接近 ➜ 改成很淡的粉紅色 */
.chip.lp{background:#FFDCE8;color:#4A0E26}
.chip.gr{background:#1E9E62;color:#fff}
.chip.v{background:#7A4DFF;color:#fff}
/* 底色上的不發音字母：淺灰會糊掉（are 的 e 在黃底上看不清楚），改成跟底色對比夠的半透明 */
.chip.y .sil,.chip.lp .sil,.tk.y .en .sil,.tk.lp .en .sil,.key.lp .sil{color:rgba(0,0,0,.42)}
.chip.b .sil,.chip.p .sil,.chip.r .sil,.chip.gr .sil,.chip.v .sil,.tk.b .en .sil,.tk.p .en .sil,.key.b .sil,.key.p .sil{color:rgba(255,255,255,.55)}
.tk.blank .en{letter-spacing:.06em;color:var(--be)}

/* ── 縮寫變身卡：i 躲起來、’ 站上去、兩個字黏在一起（使用者 2026-09-21 指定）── */
.mor{width:100%;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.8vh,20px)}
.mor .line{transition:none}
.mor .tk{transition:transform .55s cubic-bezier(.3,.75,.25,1)}
.lt{position:relative;display:inline-block}
.lt .lo{display:inline-block;color:var(--ap);transition:transform .5s cubic-bezier(.3,.7,.3,1.2),opacity .45s}
.lt.go .lo{transform:translateY(-1.15em) scale(1.7) rotate(-16deg);opacity:0}
.lt .la{position:absolute;left:0;right:0;top:0;text-align:center;opacity:0;
 transform:translateY(-.75em) scale(.3)}
.lt.go .la{opacity:1;transform:none;
 transition:transform .5s cubic-bezier(.2,.9,.3,1.5) .12s,opacity .3s .12s}
.reduce .lt .lo{opacity:0}
.reduce .lt .la{opacity:1;transform:none}
/* 演完以後亮出來的等號：兩個字 ＝ 一個字，而且兩句都會完整唸一次
   （使用者 2026-09-21 指定：要完整聽到 Who is 和 Who’s） */
.moreq{display:flex;align-items:center;justify-content:center;
 gap:clamp(8px,1.6vw,20px);opacity:0;transform:translateY(10px);
 transition:opacity .45s,transform .45s cubic-bezier(.2,.9,.3,1.3)}
.moreq.on{opacity:1;transform:none}
.moreq .ms{font-size:clamp(20px,4vh,40px);font-weight:700;color:var(--fg);
 background:#101010;border:1px solid #2A2A2A;border-radius:14px;
 padding:clamp(5px,1vh,11px) clamp(9px,1.4vw,18px);white-space:nowrap}
.moreq .ms:active{border-color:var(--acc)}
.moreq .mq{font-size:clamp(24px,4.6vh,46px);font-weight:700;color:var(--be)}
.moreq .mq{display:inline-block}
.moreq .mq.go{animation:eqp 1s cubic-bezier(.2,.9,.3,1.4);text-shadow:0 0 24px rgba(57,217,138,.9)}
.moreq .ms.big.spk,.moreq .ms.big{transform:scale(1.28);filter:brightness(1.4);border-color:var(--gold);
 box-shadow:0 0 0 3px rgba(255,210,74,.6),0 0 34px rgba(255,210,74,.45)}

/* ── he 問 ➜ He 答（藍底會自己飛下去）── */
.echo{width:100%;max-width:880px;display:flex;flex-direction:column;gap:clamp(8px,1.7vh,18px)}
.erow{display:flex;align-items:center;justify-content:center;gap:clamp(6px,1.2vw,16px);
 background:#0B0B0B;border:1px solid #242424;border-radius:16px;
 padding:clamp(8px,1.5vh,16px) clamp(10px,1.5vw,20px);
 opacity:0;animation:rowIn .48s cubic-bezier(.2,.9,.3,1.25) forwards}
.reduce .erow{opacity:1;animation:none}
.erow .earr{font-size:clamp(17px,2.8vh,30px);color:#44586A;flex:0 0 auto}
.ebub{flex:1 1 0;min-width:0;text-align:center}
/* 答句靠左：He’s／She’s、I’m 的開頭上下對齊（使用者 2026-09-25 指定） */
.ebub.a{text-align:left}
.ebub .et{display:block;font-size:clamp(20px,4vh,40px);font-weight:700;line-height:1.2;white-space:nowrap}
.ebub .ez{display:block;font-size:clamp(14px,2.4vh,24px);color:var(--acc);margin-top:4px}
.key{display:inline-block;border-radius:9px;padding:0 .16em}
.key.b{background:var(--he);color:#fff}
.key.p{background:var(--she);color:#fff}
.key.lp{background:#F7A8C4;color:#3A0A1C}
.key.flash{box-shadow:0 0 0 4px rgba(255,255,255,.6)}
.key.fly{position:fixed;z-index:60;pointer-events:none;font-weight:700;
 font-size:clamp(20px,4vh,40px);line-height:1.2}

/* ── 變身卡：。變成 ？ 要看得見（使用者 2026-09-21 指定）──
   2026-09-24 使用者指定：問號要更大、放大的時間更長，讓學生永遠記住「問句最後要加問號」
   ➜ 往上飄 ＋ 放大 4.6 倍 ＋ 金色發光 ＋ 左右搖一搖，停在最大 1.8 秒，整段 2.8 秒 */
.tk.d2q{position:relative;z-index:6}
.tk.d2q .en{display:inline-block;color:var(--gold);
 text-shadow:0 0 18px rgba(255,210,74,.95),0 0 44px rgba(255,210,74,.6);
 animation:d2q 2.8s cubic-bezier(.2,.9,.3,1.2)}
@keyframes d2q{0%{transform:scale(.4) rotate(-25deg)}
 14%{transform:translateY(-1.1em) scale(4.6) rotate(10deg)}
 22%{transform:translateY(-1.1em) scale(4.6) rotate(-8deg)}
 30%{transform:translateY(-1.1em) scale(4.6) rotate(5deg)}
 38%{transform:translateY(-1.1em) scale(4.6) rotate(0)}
 78%{transform:translateY(-1.1em) scale(4.6)}
 100%{transform:none}}
/* 句點往上飄、放大——「一定要加上句點」（使用者 2026-09-21 指定） */
.tk.dotup .en{display:inline-block;color:var(--gold);
 text-shadow:0 0 22px rgba(255,210,74,.75);animation:dotup 1.5s cubic-bezier(.2,.9,.3,1.25)}
@keyframes dotup{0%{transform:none}
 20%{transform:translateY(-1.25em) scale(3.4)}
 62%{transform:translateY(-1.25em) scale(3.4)}
 100%{transform:none}}

/* ── 念到哪亮到哪（使用者 2026-09-24 指定）：正在唸的字稍微放大、稍微變亮 ── */
.tk .en,.chip .cen,.frow .fa,.ms,.w{transition:transform .16s ease,filter .16s ease,text-shadow .16s ease}
.w{display:inline-block}
.tk.spk .en,.chip.spk .cen,.fa.spk,.w.spk,.ms.spk{transform:scale(1.14);filter:brightness(1.35);
 text-shadow:0 0 14px rgba(255,255,255,.75),0 0 30px rgba(159,180,200,.55)}
.ms.spk{border-color:var(--gold);box-shadow:0 0 0 2px rgba(255,210,74,.55),0 0 26px rgba(255,210,74,.35)}
.tk.spk .zh{color:#DCEAF7}
.sbub.spk{transform:scale(1.08);box-shadow:0 0 0 2px var(--gold),0 0 22px rgba(255,210,74,.4)}

/* ── 📑 目次（使用者 2026-09-24 指定）：按了才蓋上來，平常完全不佔版面、不擋句子 ── */
#toc{position:fixed;inset:0;z-index:65;background:rgba(0,0,0,.94);display:none;
 flex-direction:column;align-items:center;
 padding:calc(var(--safeT) + clamp(10px,2vh,20px)) clamp(12px,2.4vw,30px)
         calc(var(--safeB) + clamp(10px,2vh,20px));overflow-y:auto}
#toc.on{display:flex}
#toc .th{display:flex;align-items:center;justify-content:space-between;width:100%;max-width:1100px;
 margin-bottom:clamp(8px,1.6vh,16px)}
#toc h2{margin:0;font-size:clamp(20px,3.6vh,34px)}
#toc .tx{background:var(--btn);border:1px solid var(--line);border-radius:999px;
 font-size:clamp(15px,2.4vh,22px);font-weight:700;padding:clamp(7px,1.2vh,12px) clamp(14px,2vw,24px)}
#toc .tg{display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(220px,28vw,300px),1fr));
 gap:clamp(6px,1.1vh,12px);width:100%;max-width:1100px}
#toc .ti{display:flex;align-items:center;gap:clamp(8px,1.2vw,14px);text-align:left;
 background:#0C0C0C;border:1px solid #262626;border-radius:14px;
 padding:clamp(8px,1.4vh,14px) clamp(10px,1.4vw,16px);min-height:clamp(52px,8vh,78px)}
#toc .ti:active{transform:scale(.97)}
#toc .ti.cur{border-color:var(--gold);background:#1D1908;box-shadow:0 0 0 2px rgba(255,210,74,.35)}
#toc .tn{flex:0 0 auto;width:clamp(30px,4.6vh,44px);height:clamp(30px,4.6vh,44px);border-radius:50%;
 background:#1E2A36;color:#fff;font-weight:700;font-size:clamp(14px,2.3vh,21px);
 display:flex;align-items:center;justify-content:center}
#toc .ti.cur .tn{background:var(--gold);color:#000}
#toc .tb{display:flex;flex-direction:column;gap:3px;min-width:0}
#toc .tk2{font-size:clamp(11px,1.6vh,14px);color:var(--acc);letter-spacing:.08em}
#toc .tt{font-size:clamp(15px,2.5vh,23px);font-weight:700;color:var(--fg);line-height:1.25;
 overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ── 複習題（使用者 2026-09-21 指定新增）：20 秒限時，愈快答對分數愈高 ── */
#rv{position:fixed;inset:0;z-index:70;background:#000;display:none;
 flex-direction:column;align-items:center;justify-content:flex-start;
 padding:calc(var(--safeT) + clamp(12px,2.4vh,24px)) clamp(14px,3vw,34px)
         calc(var(--safeB) + clamp(12px,2vh,20px));overflow-y:auto}
#rv.on{display:flex}
#rv .rvbox{width:100%;max-width:860px;margin:auto 0;display:flex;flex-direction:column;
 align-items:center;gap:clamp(8px,1.6vh,18px)}
#rv h2{margin:0;font-size:clamp(20px,3.8vh,36px);text-align:center}
#rv .lead{margin:0;font-size:clamp(13px,2vh,18px);color:var(--dim);text-align:center}
.rvpick{display:flex;flex-wrap:wrap;gap:clamp(7px,1.3vh,13px);justify-content:center;width:100%}
.rvg{background:linear-gradient(180deg,#101010,#060606);border:1px solid #2A2A2A;border-radius:16px;
 color:var(--fg);padding:clamp(10px,1.8vh,18px) clamp(14px,2vw,24px);
 font-size:clamp(15px,2.4vh,22px);font-weight:700;display:flex;flex-direction:column;gap:4px;align-items:center}
.rvg em{font-style:normal;font-size:.68em;font-weight:400;color:var(--dim)}
.rvg b{color:var(--gold)}
.rvg:active{transform:scale(.97);border-color:var(--acc)}
#rvring{position:relative;width:clamp(54px,8.4vh,80px);height:clamp(54px,8.4vh,80px)}
#rvring svg{width:100%;height:100%;transform:rotate(-90deg)}
#rvring circle{fill:none;stroke-width:8;stroke-linecap:round}
#rvbg{stroke:#1C1C1C}#rvfg{stroke:var(--ok);transition:stroke-dashoffset .12s linear,stroke .3s}
#rvnum{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
 font-size:clamp(17px,2.8vh,26px);font-weight:700}
#rvring.warn #rvfg{stroke:var(--be)}#rvring.warn #rvnum{color:var(--be)}
#rvring.dang #rvfg{stroke:var(--no)}#rvring.dang #rvnum{color:var(--no);animation:thump .5s infinite}
@keyframes thump{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
.rvhud{display:flex;align-items:center;justify-content:space-between;gap:clamp(8px,1.6vw,20px);width:100%}
.rvhud .k{font-size:clamp(10.5px,1.5vh,13px);color:#5C5C5C;letter-spacing:.12em}
.rvhud .v{font-size:clamp(16px,2.7vh,26px);font-weight:700}
.rvq{font-size:clamp(24px,4.6vh,46px);font-weight:700;text-align:center;line-height:1.3}
.rvsim{font-size:clamp(14px,2.2vh,20px);color:var(--gold);border:1px solid #5A4A18;background:#1A1508;
 border-radius:999px;padding:3px 14px;font-weight:700}
.rvo{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(7px,1.2vh,13px);width:100%}
.rvo button{display:flex;align-items:center;gap:clamp(6px,1.1vw,13px);text-align:left;
 background:#0C0C0C;border:1px solid #262626;border-radius:15px;color:var(--fg);
 font-size:clamp(20px,3.6vh,36px);font-weight:700;line-height:1.25;
 padding:clamp(9px,1.6vh,17px) clamp(11px,1.6vw,21px);min-height:clamp(56px,9vh,92px)}
.rvo button .sh{flex:0 0 auto;width:1.2em;text-align:center;font-size:.82em}
.rvo button.ok{background:#0F3323;border-color:var(--ok)}
.rvo button.bad{background:#3A1111;border-color:var(--no)}
.rvo button.dim{opacity:.32}
.rvfb{min-height:clamp(42px,7vh,70px);text-align:center;font-size:clamp(14px,2.3vh,22px);
 color:var(--body);line-height:1.45}
.rvfb .gain{font-size:clamp(20px,3.6vh,34px);font-weight:700;color:var(--ok)}
.rvfb .surp{color:var(--gold);font-weight:700}
.rvbtns{display:flex;gap:clamp(7px,1.3vw,14px);flex-wrap:wrap;justify-content:center}
.rvbtns button{background:var(--btn);border:1px solid var(--line);border-radius:999px;
 color:var(--fg);font-size:clamp(14px,2.2vh,20px);font-weight:700;
 padding:clamp(8px,1.4vh,14px) clamp(14px,2.2vw,28px)}
.rvbtns button.go{background:#0F3323;border-color:var(--ok)}
.rvbtns button:active{transform:scale(.96)}
.rvsc{font-size:clamp(34px,7vh,70px);font-weight:700;color:var(--gold);line-height:1}
${D.CSS || ''}`;

const JS = `
var CARDS=__CARDS__, UNIT=__UNIT__, SUB=__SUB__, RVG=__RVG__;
var i=0, show={en:true,zh:true,ic:true,full:true}, reveal='word', step=0, playing=0;
var scenes=false, zhSay='zh';   /* zhSay：點中文要唸中文還是唸對應的英文 */
var MOR=0, morT=[], demoT=null, demoN=0;

var card=$('#card'), dots=$('#dots');
dots.innerHTML=CARDS.map(function(){return '<i></i>'}).join('');

/* ---------- 英文上色（使用者 2026-09-21 指定的三條）----------
   ① Who 的 w 不發音 → 淺灰色
   ② is 的 i ／ not 的 o → 紅色（等一下會被 ’ 藏起來）
   ③ 所有的 ’ → 紅色 */
function enHTML(s,ri){
  s=String(s);var out='',did=0;
  /* 不發音的字母 ＝ 淺灰色：Who 的 w（唸 /huː/）、What 的 h（唸 /wɑt/）
     （使用者 2026-09-21 指定 What 的 h 也要淺灰） */
  var sil=/^who/i.test(s)?0:(/^wh/i.test(s)?1:-1);
  for(var n=0;n<s.length;n++){
    var ch=s.charAt(n);
    if(n===sil){out+='<b class="sil">'+ch+'</b>';continue}
    if(ri&&!did&&ch===ri){out+='<b class="ri">'+ch+'</b>';did=1;continue}
    if(ch==="'"||ch==='\\u2019'){out+='<b class="ap">\\u2019</b>';continue}
    out+=ch;
  }
  return out;
}
${ENHTML ? '/* 不發音字母改查 SIL：後面這一個 enHTML 會蓋掉上面那一個 */\n' + ENHTML + '\n' : ''}/* 縮寫動畫專用：紅色的字母原地讓位給紅色的 ’ */
function morphEn(en,ri){
  var n=String(en).indexOf(ri);
  if(n<0)return enHTML(en,ri);
  return enHTML(en.slice(0,n))+'<span class="lt"><span class="lo">'+ri+
    '</span><b class="la ap">\\u2019</b></span>'+enHTML(en.slice(n+1));
}

/* ---------- 畫一個字（英文／中文／圖示三層）---------- */
/* 's 的發音：唸「前一個字＋'s」，學生聽到的就是 /z/（Who's → /huːz/） */
function tkHTML(t,idx,arr){
  var cls='tk'+(t.tight?' tight':'')+(t.hl?' '+t.hl:'')+(t.blank?' blank':'')+
    (/^[\u2019']${CONTR}$/.test(t.en)?' ctr':'');
  var sy=t.say||t.en;
  if(/^[\\u2019']${CONTR}$/.test(t.en)&&arr&&idx>0&&arr[idx-1])sy=arr[idx-1].en+${SUF('t.en')};
  var enh=(MOR&&t.ri)?morphEn(t.en,t.ri):enHTML(t.en,t.ri);
  return '<span class="'+cls+'" data-i="'+idx+'" data-k="'+(t.k||'')+'" data-w="'+esc(t.en)+'" data-say="'+esc(sy)+'">'+
    '<span class="en">'+enh+'</span>'+
    '<span class="zh">'+(t.zh||'')+'</span>'+
    '<span class="ic">'+(t.ic||'')+'</span></span>';
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
/* ══ 念到哪亮到哪（使用者 2026-09-24 指定）══════════════════════════
   唸整句的時候，正在唸的那一個字「稍微放大、稍微變亮」（.spk）。
   's、?、. 這種 tight 的 token 跟前一個字算同一個字（Who’s 一起亮）。 */
function hlOff(){$$('.spk').forEach(function(x){x.classList.remove('spk')})}
window.HLCLR=hlOff;
function spGroups(els){
  var g=[];
  els.forEach(function(t){
    var w=t.getAttribute('data-w')||t.textContent||'';
    var tight=t.classList.contains('tight')||/^([\u2019']${CONTR}|[?.,!])$/.test(w);
    if(tight&&g.length){var L=g[g.length-1];L.t+=w;L.els.push(t)}
    else g.push({t:w,els:[t]});
  });
  return g.filter(function(x){return /[A-Za-z]/.test(x.t)});
}
/* 唸一串字（元素陣列），念到哪一個就亮哪一個 */
function sayEls(els,opt){
  opt=opt||{};var g=spGroups(els);
  if(!g.length){if(opt.done)opt.done();return}
  var txt=g.map(function(x){return x.t}).join(' ');
  say(txt,null,{keep:opt.keep,done:opt.done,start:opt.start,hl:function(k){
    g.forEach(function(x){x.els.forEach(function(e){e.classList.remove('spk')})});
    if(k>=0&&g[k])g[k].els.forEach(function(e){e.classList.add('spk')});
  }});
}
/* 唸一個東西（一個字、一個按鈕），唸的時候它整個亮 */
function sayOne(el,txt,opt){
  opt=opt||{};
  say(txt,null,{keep:opt.keep,done:opt.done,hl:function(k){
    if(k>=0){el.classList.add('spk');
      if(el.classList.contains('tight')&&el.previousElementSibling)el.previousElementSibling.classList.add('spk')}
    else{el.classList.remove('spk');if(el.previousElementSibling)el.previousElementSibling.classList.remove('spk')}
  }});
}
function plain(tk){return tk.map(function(t){return t.tight?t.en:' '+t.en}).join('').trim()}
function spk(s){return String(s).replace(/[\\u279C\\u2026]/g,' ')}
/* 替換字用的 {w}（英文）／{z}（中文） */
function fill(s,w,z){return String(s).split('{w}').join(w).split('{z}').join(z)}
/* 把句子裡的那一個關鍵字包成有底色的 key（he 問、He 答，兩個都藍底） */
function keyed(txt,k,cls){
  txt=String(txt);
  if(!k)return enHTML(txt);
  var re=new RegExp('(^|[^A-Za-z])('+k+')(?![A-Za-z])');
  var m=re.exec(txt);
  if(!m)return enHTML(txt);
  var st=m.index+m[1].length, ed=st+k.length;
  return enHTML(txt.slice(0,st))+'<span class="key '+(cls||'')+'">'+enHTML(k)+'</span>'+
    enHTML(txt.slice(ed));
}
/* 一個字一個 .w：念到哪一個字，那一個字就亮（使用者 2026-09-24 指定） */
function wordsHTML(txt,k,cls){
  return String(txt).split(' ').map(function(w){
    return '<span class="w" data-w="'+esc(w)+'">'+keyed(w,k,cls)+'</span>'}).join(' ');
}

function lineHTML(tk,id){
  return '<div class="wrap"><div class="line"'+(id?' id="'+id+'"':'')+'>'+
    tk.map(tkHTML).join('')+'</div></div>';
}
/* 情境：兩個人演一次（使用者 2026-09-24 指定改版）。對話框點了就唸 */
function sceneHTML(c){
  var s=c.scene;if(!s)return '';
  var bub=function(txt,side,zh,mate){
    if(!txt)return '';
    var at=zh?' data-zh="'+esc(txt)+'" data-en="'+esc(mate||'')+'"':' data-say="'+esc(txt)+'"';
    return '<div class="sbub '+side+'"'+at+'>'+ap(txt)+'</div>';
  };
  var act=function(f,nm,tag,side){
    return '<div class="sact '+side+'"><span class="sfig">'+f+'</span>'+
      (tag?'<span class="stag">'+tag+'</span>':'')+(nm?'<span class="snm">'+nm+'</span>':'')+'</div>';
  };
  return '<div class="scene"><div class="sth">'+
    '<span class="sbg">'+(s.bg||'')+'</span><span class="sat">'+s.at+'</span>'+
    act(s.l,s.ln,'','L')+bub(s.b,'L',s.bzh,s.b2)+'<span class="ssp"></span>'+
    bub(s.b2,'R')+act(s.r,s.rn,s.rt,'R'+(s.b2?' ans':''))+
    '</div><div class="suse">\\uD83D\\uDCA1 '+ap(s.use)+'</div></div>';
}
function subsHTML(kind){
  var s=SUB[kind];if(!s)return '';
  var row=function(list,lbl,cls){
    if(!list.length)return '';
    return '<div class="subrow"><span class="lbl">'+lbl+'</span>'+list.map(function(w){
      return '<button class="sub '+cls+'" data-w="'+w[0]+'" data-z="'+w[1]+'" data-ic="'+String(w[2]).replace(/"/g,'&quot;')+'">'+
       w[2]+' '+w[0]+(w[1]!==w[0]?' <em>'+w[1]+'</em>':'')+'</button>'}).join('')+'</div>';
  };
  return '<div class="subs">'+row(s.basic,'基礎','')+row(s.adv,'進階','adv')+'</div>';
}
function noteHTML(n){return n?'<div class="note">'+mk(n)+'</div>':''}
/* 說明文字裡的 [i]／[o] ＝ 那個被藏起來的字母，一樣上紅色 */
function mk(s){return ap(String(s)).replace(/\\[([A-Za-z])\\]/g,'<b class="ri">$1</b>')}
function fullHTML(zh,en){
  return zh?'<div class="full" data-zh="'+esc(zh)+'" data-en="'+esc(en)+'">'+zh+'</div>':'';
}

/* ---------- 畫一張卡 ---------- */
function draw(dir){
  var c=CARDS[i], h='', kind='', subs='';
  step=0;clearAnim();
  if(c.type==='sent'){
    kind='句型';
    /* 整句發音一律照畫面上的字：畫面是 Who’s he? 就唸 Who’s he?，不可以唸成 Who is he?
       （使用者 2026-09-24 指定） */
    h=lineHTML(c.tk)+fullHTML(c.zh,plain(c.tk));
    subs=c.slot?subsHTML(c.slot):'';
  } else if(c.type==='eq'){
    kind='縮寫';
    /* 兩句都要完整聽得到，而且要看得出「這兩句是同一句」（使用者 2026-09-21 指定） */
    /* c.c ＝ 第三句（使用者 2026-09-25 指定：My name is Ken. ＝ I am Ken. ＝ I’m Ken.）；
       c.left ＝ 三句靠左對齊，開頭的 I 上下對齊 */
    h='<div class="eq'+(c.left?' left':'')+'">'+
      '<div class="eqrow a" data-say="'+esc(plain(c.a))+'">'+lineHTML(c.a)+'</div>'+
      '<div class="eqmark">＝</div>'+
      '<div class="eqrow b" data-say="'+esc(plain(c.b))+'">'+lineHTML(c.b)+'</div>'+
      (c.c?'<div class="eqmark">＝</div><div class="eqrow c" data-say="'+esc(plain(c.c))+'">'+lineHTML(c.c)+'</div>':'')+
      '<button class="swapbtn" id="eqGo">🔁 再聽一次</button></div>'+
      fullHTML(c.zh,plain(c.b))+noteHTML(c.note);
  } else if(c.type==='morph'){
    kind='縮寫變身';
    MOR=1;
    var mri='';for(var mn=0;mn<c.a.length;mn++)if(c.a[mn].ri)mri=c.a[mn].ri;
    var two=plain(c.a), one=c.say||plain(c.b);
    h='<div class="mor"><div class="wrap"><div class="line" id="morLine">'+
      c.a.map(tkHTML).join('')+'</div></div>'+
      /* 演完亮出來：兩個字 ＝ 一個字，點哪一邊就唸哪一邊 */
      '<div class="moreq" id="morEq">'+
        '<button class="ms" data-say="'+esc(two)+'">'+enHTML(two,mri)+'</button>'+
        '<span class="mq">＝</span>'+
        '<button class="ms" data-say="'+esc(one)+'">'+enHTML(plain(c.b))+'</button>'+
      '</div>'+
      '<button class="swapbtn" id="morGo">🔁 再演一次</button></div>';
    MOR=0;
  } else if(c.type==='order'){
    kind='中英語序';
    /* 同一個顏色上下對齊：兩排用同一組等寬欄位（使用者 2026-09-21 指定） */
    var sayOf=function(row,n){
      var w=row[n][0];
      if(/^[\\u2019']${CONTR}$/.test(w)&&n>0)return row[n-1][0]+${SUF('w')};
      return w;
    };
    var mate=function(col){for(var k=0;k<c.enRow.length;k++)if(c.enRow[k][2]===col)return sayOf(c.enRow,k);return ''};
    var chip=function(x,n,row,zh,rc){
      return '<button class="chip '+x[2]+' '+rc+'" data-c="'+x[2]+'" data-n="'+n+'" data-w="'+esc(x[0])+'" data-say="'+esc(sayOf(row,n))+'"'+
      (zh?' data-zh="'+esc(x[0])+'" data-en="'+esc(mate(x[2]))+'"':'')+'>'+
      /* 英文一定要包在自己的一個 <span> 裡：.chip 是直向 flex，
         淺灰的 <b>W</b> 如果直接當 flex item，Who 的 ho 就會被推到下一行
         （使用者 2026-09-21 回報的那個 bug） */
      '<span class="cen">'+enHTML(x[0])+'</span><span class="ci ic">'+x[1]+'</span></button>'};
    /* 兩排放在同一個 grid：欄寬由上下兩排一起決定，字不會被折行（使用者 2026-09-21 回報） */
    var cols='auto repeat('+c.enRow.length+',max-content)';
    h='<div class="ord"><div class="ordgrid" style="grid-template-columns:'+cols+'">'+
        '<span class="cap">中文</span>'+
        c.zhRow.map(function(x,n){return chip(x,n,c.zhRow,1,'cz')}).join('')+
        '<span class="cap">英文</span>'+
        c.enRow.map(function(x,n){return chip(x,n,c.enRow,0,'ce')}).join('')+
      '</div><button class="swapbtn" id="ordGo">🔁 再演一次</button>'+
      '</div>'+noteHTML(c.note);
  } else if(c.type==='focus'&&c.eqRow){
    kind='秒懂重點';
    /* 2026-09-25 使用者指定：①一次出現一個英文字，英文出來以後才出現它的中文
       ② 英文、＝、中文三欄上下對齊（同一個 grid）③「💡 問什麼？」按了才用動畫演出用法 ④ 字放大 */
    var hasU=c.rows.some(function(r){return r[3]});
    h='<div class="focus fq"><h2>'+ap(c.title)+'</h2><div class="fgrid'+(hasU?' hasu':'')+'">'+c.rows.map(function(r,n){
      return '<span class="gi ic fh" data-r="'+n+'" data-p="0">'+r[2]+'</span>'+
        '<span class="fa en fh" data-r="'+n+'" data-p="0" data-w="'+esc(spk(r[0]))+'" data-say="'+esc(spk(r[0]))+'">'+enHTML(r[0])+'</span>'+
        '<span class="fe fh" data-r="'+n+'" data-p="1">＝</span>'+
        '<span class="fb zh fh" data-r="'+n+'" data-p="1" data-zh="'+esc(r[1])+'" data-en="'+esc(spk(r[0]))+'">'+ap(r[1])+'</span>'+
        (hasU?'<span class="fu" data-r="'+n+'">'+(r[3]?'<b data-zh="'+esc(r[3].u.replace(/[「」]/g,''))+'" data-en="'+esc(spk(r[0]))+'">'+r[3].u+'</b><span class="fv">'+(r[3].v||'')+'</span>':'')+'</span>':'');
    }).join('')+'</div>'+
    (hasU?'<button class="swapbtn" id="useGo">💡 '+(c.useBtn||'問什麼？')+'</button>':'')+
    '</div>'+noteHTML(c.note);
  } else if(c.type==='focus'){
    kind='秒懂重點';
    h='<div class="focus"><h2>'+ap(c.title)+'</h2>'+c.rows.map(function(r,n){
      return '<div class="frow'+(c.eqRow?' eqr':'')+'" style="animation-delay:'+(0.12+n*0.22).toFixed(2)+'s">'+
        '<span class="fi ic">'+r[2]+'</span>'+
        '<span class="fa en" data-w="'+esc(spk(r[0]))+'" data-say="'+esc(spk(r[0]))+'">'+enHTML(r[0])+'</span>'+
        (c.eqRow?'<span class="fe">＝</span>':'')+
        '<span class="fb zh" data-zh="'+esc(r[1])+'" data-en="'+esc(spk(r[0]))+'">'+ap(r[1])+'</span>'+
        '</div>'}).join('')+'</div>'+noteHTML(c.note);
  } else if(c.type==='echo'){
    kind='秒懂重點';
    h='<div class="echo">'+c.rows.map(function(r,n){
      return '<div class="erow" style="animation-delay:'+(0.12+n*0.24).toFixed(2)+'s">'+
       '<span class="ebub q"><span class="et en" data-say="'+esc(r.q)+'">'+wordsHTML(r.q,r.qk,r.cls)+'</span>'+
         '<span class="ez zh" data-zh="'+esc(r.qzh)+'" data-en="'+esc(r.q)+'">'+r.qzh+'</span></span>'+
       '<span class="earr">\\u279C</span>'+
       '<span class="ebub a"><span class="et en" data-say="'+esc(r.a)+'">'+wordsHTML(r.a,r.ak,r.cls)+'</span>'+
         '<span class="ez zh" data-zh="'+esc(r.azh)+'" data-en="'+esc(r.a)+'">'+r.azh+'</span></span>'+
       '</div>'}).join('')+'</div>';
  } else if(c.type==='pair'){
    kind='一問一答';
    /* 問句和答句都改成逐字：每一個英文字的正下方就是那一個字的中文
       （使用者 2026-09-21 指定，Unit 1 ／ Unit 2 都一樣） */
    h='<div class="pair">'+
      '<div class="bub q" style="animation-delay:.10s"><span class="bi ic">'+c.qic+'</span>'+
        '<span class="bt">'+lineHTML(c.qtk)+fullHTML(c.qzh,plain(c.qtk))+'</span></div>'+
      '<div class="bub a" style="animation-delay:.55s"><span class="bi ic">'+c.aic+'</span>'+
        '<span class="bt">'+lineHTML(c.atk)+fullHTML(c.azh,plain(c.atk))+'</span></div>'+
      '</div>';
    subs=c.slot?subsHTML(c.slot):'';
  } else if(c.type==='swap'||c.type==='swapdemo'){
    kind=c.type==='swap'?'變身術':'秒懂重點';
    c._cur=c._cur||'st';
    h='<div class="swapbox">'+lineHTML(c[c._cur])+
      fullHTML(c._cur==='st'?c.stzh:c.quzh,plain(c[c._cur]))+
      '<span class="swaprow"><button class="swapbtn" id="swapGo">🔄 '+(c._cur==='st'?'變成問句':'變成直述句')+'</button>'+
      '<button class="swapbtn" id="puncGo">'+puncLbl()+'</button></span>'+
      (c.note?'<div class="swaphint">'+mk(c.note)+'</div>':'')+'</div>';
    subs=c.slot?subsHTML(c.slot):'';
  }
  card.className='';
  card.innerHTML='<span class="kind">'+kind+'</span><div id="cardIn">'+sceneHTML(c)+h+
    '<div id="tapHint" class="off">點卡片：一次出現一個字</div></div>'+subs;
  applyMode();
  padBottom();
  fit();
  markSubs();
  if(c.type==='order')playOrder();
  if(c.type==='focus'&&c.eqRow)playFocus();
  if(c.type==='morph')playMorph();
  if(c.type==='eq')playEq();
  if(c.type==='echo')playEcho();
  if(c.type==='pair')playPair();
  if(c.type==='swapdemo'){demoN=0;demoT=setTimeout(function(){doSwap(1)},1600)}
  if(reveal==='word'&&(c.type==='sent'||c.type==='swap')){startWord()}
  $$('#dots i').forEach(function(d,n){d.className=n===i?'on':''});
  $('#prev').disabled=i===0;
  $('#next').disabled=i===CARDS.length-1;
  if(dir&&!document.body.classList.contains('reduce')){
    card.classList.add(dir>0?'turnR':'turnL');
    setTimeout(function(){card.classList.remove('turnR','turnL')},430);
  }
}
/* 換卡以前把上一張的動畫收乾淨，不然飛到一半的字會留在畫面上 */
function clearAnim(){
  morT.forEach(function(t){clearTimeout(t)});morT=[];
  if(demoT){clearTimeout(demoT);demoT=null}
  $$('.key.fly').forEach(function(x){if(x.parentNode)x.parentNode.removeChild(x)});
}

/* 替換字擺在卡片最下面：先把它的高度讓出來，中間才留給英文句子 */
function padBottom(){
  var sb=$('.subs',card);
  card.style.paddingBottom = sb ? (sb.offsetHeight + 14) + 'px' : '';
}

/* 一定不溢出：先把過寬的句子那一排縮起來，再看整張卡夠不夠高（iPad 直式最容易擠爆） */
function fit(){
  var inn=$('#cardIn');if(!inn)return;
  inn.style.transform='';
  $$('.wrap',inn).forEach(function(w){
    w.style.transform='';w.style.height='';
    var ln=$('.line',w);if(!ln)return;
    var avail=w.clientWidth, need=ln.scrollWidth;
    if(need>avail&&avail>0){var k=Math.max(.34,avail/need-0.015);
      w.style.transform='scale('+k+')';w.style.height=(ln.offsetHeight*k)+'px'}
  });
  /* 三句靠左的等式（I 要上下對齊）：三句用同一個縮放、從左邊縮，不然最長那一句自己縮小，I 就對不齊了 */
  var el=$('.eq.left',inn);
  if(el){var ws=$$('.wrap',el),km=1;
    ws.forEach(function(w){var ln=$('.line',w);w.style.transform='';w.style.height='';
      var a=w.clientWidth,nd=ln?ln.scrollWidth:0;if(nd>a&&a>0)km=Math.min(km,Math.max(.34,a/nd-0.015))});
    ws.forEach(function(w){var ln=$('.line',w);w.style.transformOrigin='left center';
      if(km<1){w.style.transform='scale('+km+')';w.style.height=(ln.offsetHeight*km)+'px'}})}
  var cs=getComputedStyle(card);
  var availH=card.clientHeight-parseFloat(cs.paddingTop||0)-parseFloat(cs.paddingBottom||0);
  var needH=inn.scrollHeight, availW=card.clientWidth, needW=inn.scrollWidth;
  /* 置中的 grid（語序卡、秒懂重點、三句等式）太寬時是往「兩邊」溢出，scrollWidth 只算得到右邊，
     所以直接量裡面每一個東西最左、最右的位置（2026-09-25 直式 iPad 量到壓到翻頁箭頭） */
  var cr=card.getBoundingClientRect(), lo=cr.left+parseFloat(cs.paddingLeft||0), hi=cr.right-parseFloat(cs.paddingRight||0), mn=lo, mx=hi;
  $$('.ordgrid>*,.fgrid>*,.eqrow .line,.eqmark',inn).forEach(function(x){var r=x.getBoundingClientRect();if(!r.width)return;
    if(r.left<mn)mn=r.left;if(r.right>mx)mx=r.right});
  var ext=Math.max(hi-lo,2*Math.max(hi-(lo+hi)/2,mx-(lo+hi)/2,(lo+hi)/2-mn));
  if(ext>hi-lo+1){needW=Math.max(needW,ext);availW=hi-lo}
  var k=Math.min(availH>0&&needH>availH?availH/needH:1, availW>0&&needW>availW?availW/needW:1);
  var kk=k<1?Math.max(.3,k-0.01):1;
  if(k<1)inn.style.transform='scale('+kk+')';
  card.setAttribute('data-k',kk.toFixed(3));
}

function applyMode(){
  card.classList.remove('no-en','no-zh','no-ic','no-full','sc');
  if(!show.en)card.classList.add('no-en');
  if(!show.zh)card.classList.add('no-zh');
  if(!show.ic)card.classList.add('no-ic');
  if(!show.full)card.classList.add('no-full');
  if(scenes)card.classList.add('sc');
}
/* 點中文：依開關唸中文，或唸那一句對應的英文 */
function sayPair(el){
  var en=el.getAttribute('data-en');
  if(zhSay==='en'&&en){say(en);return}
  sayZh(el.getAttribute('data-zh'));
}

/* ---------- 秒懂重點（三欄對齊）：一次一個英文字，英文出來、唸完，才出現 ＝ 和中文 ---------- */
function playFocus(){
  var myI=i, g=$('.fgrid',card);if(!g)return;
  var cells=$$('[data-p]',g);
  if(document.body.classList.contains('reduce')){cells.forEach(function(x){x.classList.remove('fh')});return}
  cells.forEach(function(x){x.classList.add('fh')});
  var N=$$('.fa',g).length, r=0;
  var show=function(x){x.classList.remove('fh')};
  function step(){
    if(i!==myI||r>=N)return;
    var p0=$$('[data-r="'+r+'"][data-p="0"]',g), p1=$$('[data-r="'+r+'"][data-p="1"]',g), en=$('.fa[data-r="'+r+'"]',g);
    p0.forEach(show);
    var done=0, nx=function(){if(done)return;done=1;if(i!==myI)return;
      morT.push(setTimeout(function(){if(i!==myI)return;p1.forEach(show);r++;morT.push(setTimeout(step,850))},300))};
    if(en)sayOne(en,en.getAttribute('data-say'),{keep:1,done:nx});
    morT.push(setTimeout(nx,2600));
  }
  morT.push(setTimeout(step,420));
}
/* 💡 問什麼？：按了才出現用法，用法會用動畫演出來（使用者 2026-09-25 指定） */
function useToggle(){
  var g=$('.fgrid',card);if(!g)return;
  var on=!g.classList.contains('uses');
  $$('[data-p]',g).forEach(function(x){x.classList.remove('fh')});
  g.classList.toggle('uses',on);
  var b=$('#useGo');if(b)b.classList.toggle('on',on);
  if(on)$$('.fu',g).forEach(function(u,n){u.style.animationDelay=(n*0.55).toFixed(2)+'s';
    $$('.fv i',u).forEach(function(x,k){x.style.animationDelay=(n*0.55+0.35+k*0.2).toFixed(2)+'s,'+(n*0.55+1+k*0.2).toFixed(2)+'s'})});
  fit();
}

/* ---------- 語序卡：中文的字飛到英文的位置 ---------- */
function playOrder(){
  var grid=$('.ordgrid',card);
  if(!grid)return;
  var myI=i;
  var zc=$$('.chip.cz',grid), ec=$$('.chip.ce',grid);
  morT.forEach(function(t){clearTimeout(t)});morT=[];
  if(document.body.classList.contains('reduce')){zc.concat(ec).forEach(function(x){x.classList.remove('zin');x.style.opacity=''});return}
  /* 2026-09-25 使用者指定：先一個字一個字跳出中文，再一個字一個字跳出英文（英文從它的中文飛過去），
     最後整句英文唸一次 —— 學生看得到「同一個顏色 ＝ 同一個意思」 */
  zc.forEach(function(x){x.classList.add('zin')});
  ec.forEach(function(x){x.style.transition='none';x.style.opacity='0';x.style.transform=''});
  var k=0;
  function zStep(){
    if(i!==myI)return;
    if(k>=zc.length){k=0;morT.push(setTimeout(eStep,500));return}
    var z=zc[k++];z.classList.remove('zin');
    var t=z.getAttribute('data-say')||'';
    if(/[\u4e00-\u9fff]/.test(t)){var d=0,nx=function(){if(d)return;d=1;morT.push(setTimeout(zStep,180))};
      sayZh(t,{keep:1,done:nx});morT.push(setTimeout(nx,1500))}
    else morT.push(setTimeout(zStep,420));
  }
  function eStep(){
    if(i!==myI)return;
    if(k>=ec.length){morT.push(setTimeout(function(){if(i===myI)sayEls(ec,{keep:1})},600));return}
    var c=ec[k++], col=c.getAttribute('data-c'), src=null, used=0;
    for(var j=0;j<zc.length;j++)if(zc[j].getAttribute('data-c')===col){src=zc[j];break}
    var kk=parseFloat(card.getAttribute('data-k')||'1')||1;
    if(src){var a=src.getBoundingClientRect(), b=c.getBoundingClientRect();
      c.style.transition='none';c.style.transform='translate('+((a.left-b.left)/kk)+'px,'+((a.top-b.top)/kk)+'px) scale(.8)';}
    c.style.opacity='.35';
    void c.offsetWidth;
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      c.style.transition='transform .7s cubic-bezier(.3,.75,.25,1),opacity .35s';
      c.style.transform='';c.style.opacity='';
    })});
    lnk(col,900);
    var w=c.getAttribute('data-say')||'', d=0, nx=function(){if(d)return;d=1;morT.push(setTimeout(eStep,260))};
    if(/[A-Za-z]/.test(w)){morT.push(setTimeout(function(){if(i!==myI)return;sayOne(c,w,{keep:1,done:nx})},420));morT.push(setTimeout(nx,2400))}
    else morT.push(setTimeout(nx,760));
  }
  morT.push(setTimeout(zStep,350));
}
/* 中英連動：同一個顏色的中文和英文，一起放大變亮 */
function lnk(col,ms){
  $$('.ordgrid .chip',card).forEach(function(x){x.classList.toggle('lnk',x.getAttribute('data-c')===col)});
  if(lnk.t)clearTimeout(lnk.t);
  lnk.t=setTimeout(function(){$$('.ordgrid .chip.lnk').forEach(function(x){x.classList.remove('lnk')})},ms||1300);
}

/* ---------- 縮寫變身卡（使用者 2026-09-21 指定的五拍）----------
   ① 先完整聽到兩個字：Who is
   ② 紅色的 i 飛走、紅色的 ’ 站到同一個位置
   ③ 兩個字滑過去黏成一個字
   ④ 完整聽到一個字：Who’s
   ⑤ 亮出「Who is ＝ Who’s」，兩句連在一起再唸一次 —— 學生自己聽出它們一樣 */
function playMorph(){
  var c=CARDS[i], myI=i;
  var line=$('#morLine');if(!line)return;
  morT.forEach(function(t){clearTimeout(t)});morT=[];
  var eq=$('#morEq');if(eq)eq.classList.remove('on');
  MOR=1;line.innerHTML=c.a.map(tkHTML).join('');MOR=0;
  applyMode();fit();
  var two=plain(c.a), one=c.say||plain(c.b);
  if(document.body.classList.contains('reduce')){
    line.innerHTML=c.b.map(tkHTML).join('');applyMode();fit();
    if(eq)eq.classList.add('on');return;
  }
  var tks=$$('.tk',line);
  sayEls(tks);                                          /* ① Who is：念到哪個字，那個字就放大變亮 */
  morT.push(setTimeout(function(){                      /* ② */
    if(i!==myI)return;
    var lt=$('.lt',line);if(lt)lt.classList.add('go');
  },1300));
  morT.push(setTimeout(function(){                      /* ③ */
    if(i!==myI)return;
    var gap=parseFloat(getComputedStyle(line).columnGap||'0')||0;
    for(var n=1;n<tks.length;n++)tks[n].style.transform='translateX('+(-gap*n)+'px)';
  },2200));
  morT.push(setTimeout(function(){                      /* ④ */
    if(i!==myI)return;
    line.innerHTML=c.b.map(tkHTML).join('');
    $$('.tk',line).forEach(function(t){t.classList.add('pop')});
    applyMode();fit();
    sayEls($$('.tk',line));                             /* Who’s 一起放大變亮 */
  },2900));
  morT.push(setTimeout(function(){                      /* ⑤ */
    if(i!==myI)return;
    if(eq)eq.classList.add('on');
    fit();
    var ms=$$('.ms',eq||card), mq=$('.mq',eq||card);
    /* 2026-09-25 使用者指定：Who is 唸完，＝ 才放大變亮；＝ 亮完，才唸 Who’s，唸的同時 Who’s 放大變亮 */
    if(ms.length===2){
      sayThen(ms[0],two,4500,function(){
        if(mq){mq.classList.remove('go');void mq.offsetWidth;mq.classList.add('go')}
        morT.push(setTimeout(function(){if(i!==myI)return;
          ms[1].classList.add('big');sayThen(ms[1],one,4500,function(){ms[1].classList.remove('big')})},1050));
      });
    }
    else{say(two,null,{keep:1});say(one,null,{keep:1})}
  },4200));
}
/* 唸一個東西（唸的時候它亮），唸完（或最多等 max 毫秒）才做下一件事；換卡了就不做 */
function sayThen(el,txt,max,fn){
  var myI=i, done=0;
  var run=function(){if(done)return;done=1;if(i!==myI)return;fn()};
  sayOne(el,txt,{keep:1,done:run});
  morT.push(setTimeout(run,max));
}

/* ---------- 等式卡：一句一句亮起來、一句一句唸完，最後兩句一起亮 ＋ 等號放大 ----------
   使用者 2026-09-21 指定：Who is he? 和 Who’s he? 兩句都要完整聽到，
   而且要用會動的方式讓學生秒懂「這兩句是同一句」。 */
/* 一句唸完（或最多等 max 毫秒，語速調到 0.5 也不會脫節）再做下一件事 */
function after(els,max,fn){
  var myI=i, done=0;
  var run=function(){if(done)return;done=1;if(i!==myI)return;fn()};
  sayEls(els,{keep:1,done:run});
  morT.push(setTimeout(run,max));
}
function playEq(){
  var rows=$$('.eqrow',card), mks=$$('.eqmark',card);
  if(rows.length<2)return;
  sayStop();
  var n=0;
  var lit=function(k){rows.forEach(function(r,j){r.classList.toggle('lit',j===k)})};
  var pulse=function(m){if(m){m.classList.remove('pulse');void m.offsetWidth;m.classList.add('pulse')}};
  function nx(){
    if(n>=rows.length){
      rows.forEach(function(r){r.classList.add('lit')});mks.forEach(pulse);
      morT.push(setTimeout(function(){rows.forEach(function(r){r.classList.remove('lit')})},1800));
      return;
    }
    lit(n);var r=rows[n++];
    after($$('.tk',r),6500,nx);
  }
  nx();
}

/* ---------- he 問 ➜ He 答：藍色的字自己飛下去（使用者 2026-09-21 指定）---------- */
function flyKey(from,to,delay){
  if(!from||!to||document.body.classList.contains('reduce'))return;
  setTimeout(function(){
    if(!from.getClientRects().length||!to.getClientRects().length)return;
    var a=from.getBoundingClientRect(), b=to.getBoundingClientRect();
    var cs=getComputedStyle(from);
    var fly=document.createElement('span');
    fly.className='key fly '+(from.className.replace('key','').replace('flash','').trim());
    fly.innerHTML=from.innerHTML;
    /* 底色、字級照抄來源，對話卡的 .tk .en 也飛得起來（使用者 2026-09-21 指定） */
    fly.style.background=cs.backgroundColor;fly.style.color=cs.color;
    fly.style.fontSize=cs.fontSize;fly.style.padding=cs.padding;
    fly.style.borderRadius=cs.borderRadius;
    fly.style.left=a.left+'px';fly.style.top=a.top+'px';
    fly.style.height=a.height+'px';fly.style.lineHeight=a.height+'px';
    document.body.appendChild(fly);
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      fly.style.transition='transform .85s cubic-bezier(.3,.75,.25,1),opacity .35s .62s';
      fly.style.transform='translate('+(b.left-a.left)+'px,'+(b.top-a.top)+'px)';
      fly.style.opacity='0';
    })});
    setTimeout(function(){
      if(fly.parentNode)fly.parentNode.removeChild(fly);
      to.classList.add('flash');sPop();
      setTimeout(function(){to.classList.remove('flash')},620);
    },900);
  },delay);
}
function playEcho(){
  $$('.erow',card).forEach(function(r,n){
    flyKey($('.ebub.q .key',r),$('.ebub.a .key',r),700+n*1600);
  });
}
function playPair(){
  var c=CARDS[i], cls=c.cls||'b';
  flyKey($('.bub.q .tk.'+cls+' .en',card),$('.bub.a .tk.'+cls+' .en',card),1300);
}

/* ---------- 逐字動畫：一次只呈現一個重點 ---------- */
function startWord(){
  var tks=$$('.tk',card);
  tks.forEach(function(t){t.classList.add('hide')});
  var f=$('.full',card);if(f)f.classList.add('hide');
  step=0;
  var hint=$('#tapHint');if(hint)hint.classList.remove('off');
}
function revealNext(auto){
  var tks=$$('.tk',card);
  if(!tks.length)return false;
  if(step<tks.length){
    var t=tks[step];t.classList.remove('hide');t.classList.add('pop');
    sPop();
    var w=t.getAttribute('data-say');
    /* 排隊唸，不砍掉前一個字——這樣就不會「某些字發音不見」（使用者 2026-09-21 回報） */
    if(w&&/[A-Za-z]/.test(w))sayOne(t,w,{keep:1});
    step++;
    if(step===tks.length){
      var f=$('.full',card);if(f)setTimeout(function(){f.classList.remove('hide')},260);
      var hint=$('#tapHint');if(hint)hint.classList.add('off');
      if(!auto)sayCard({keep:1});
    }
    fit();
    return true;
  }
  return false;
}
/* 點什麼唸什麼：每一種卡片都要唸得出一句話（使用者 2026-09-21 回報「念一次沒聲音」） */
function sentOf(){
  var c=CARDS[i];
  if(c.type==='sent')return plain(c.tk);
  if(c.type==='swap'||c.type==='swapdemo')return plain(c[c._cur||'st']);
  if(c.type==='eq')return plain(c.c||c.b);
  if(c.type==='morph')return c.say||plain(c.b);
  if(c.type==='order')return c.say||'';
  if(c.type==='focus')return c.rows.map(function(r){return spk(r[0])}).join(', ');
  if(c.type==='echo')return c.rows.map(function(r){return r.q+' '+r.a}).join(' ');
  if(c.type==='pair')return plain(c.qtk)+' '+plain(c.atk);
  return '';
}
/* 唸整張卡，念到哪個字那個字就亮（使用者 2026-09-24 指定） */
function sayCard(opt){
  opt=opt||{};
  var c=CARDS[i], A=function(sel){return $$(sel,card)};
  if(c.type==='sent'||c.type==='swap'||c.type==='swapdemo'){sayEls(A('#cardIn .line .tk'),opt);return}
  if(c.type==='eq'){sayEls(A(c.c?'.eqrow.c .tk':'.eqrow.b .tk'),opt);return}
  if(c.type==='morph'){sayEls(A('#morLine .tk'),opt);return}
  if(c.type==='order'){sayEls(A('.chip.ce'),opt);return}
  if(c.type==='focus'){sayEls(A(c.eqRow?'.fgrid .fa':'.frow .fa'),opt);return}
  /* 他問他答：一列唸完，停 1 秒，才唸下一列（使用者 2026-09-25 指定：He’s ______. 唸完等一秒才唸 Who’s she?） */
  if(c.type==='echo'){var rs=A('.erow'),k=0,myI=i;
    var nx=function(){if(i!==myI)return;if(k>=rs.length){if(opt.done)opt.done();return}
      var r=rs[k++];sayEls($$('.w',r),{keep:k>1?1:opt.keep,done:function(){
        if(k<rs.length)morT.push(setTimeout(nx,1000));else nx()}})};
    nx();return}
  if(c.type==='pair'){sayEls(A('.bub.q .tk'),opt);sayEls(A('.bub.a .tk'),{keep:1});return}
  var s=sentOf();if(s)say(s,null,opt);
}
/* 自動播：一個字唸完才出下一個字（不再用固定秒數硬推，整句也不會延遲） */
function stopPlay(){
  if(playing){clearTimeout(playing);playing=0}
  var b=$('#play');if(b)b.classList.remove('on');
}
function autoStep(){
  if(!playing)return;
  var tks=$$('.tk',card);
  if(step>=tks.length){
    stopPlay();
    sayCard();
    return;
  }
  var t=tks[step];t.classList.remove('hide');t.classList.add('pop');sPop();
  var w=t.getAttribute('data-say');
  step++;
  if(step===tks.length){
    var f=$('.full',card);if(f)setTimeout(function(){f.classList.remove('hide')},260);
    var hint=$('#tapHint');if(hint)hint.classList.add('off');
  }
  fit();
  var gap=SLOW?820:460;
  var go=function(){if(playing)playing=setTimeout(autoStep,gap)};
  if(w&&/[A-Za-z]/.test(w))sayOne(t,w,{keep:1,done:go});
  else setTimeout(go,SLOW?700:380);
}
function autoPlay(){
  if(playing){stopPlay();sayStop();return}
  var c=CARDS[i];
  if(c.type!=='sent'&&c.type!=='swap'){sayCard();return}
  startWord();
  playing=1;$('#play').classList.add('on');
  autoStep();
}

/* ---------- 替換字 ---------- */
function markSubs(){
  var cur=curSlotWord();
  $$('.sub',card).forEach(function(b){
    b.classList.toggle('on',b.getAttribute('data-w')===cur)});
}
/* 一張卡裡所有的句子（對話卡有兩句，變身卡有直述句和問句） */
function tkLists(c){
  if(c.type==='pair')return [c.qtk,c.atk];
  if(c.type==='swap'||c.type==='swapdemo')return [c.st,c.qu];
  return c.tk?[c.tk]:[];
}
function curSlot(){
  var L=tkLists(CARDS[i]);
  for(var a=0;a<L.length;a++)for(var n=0;n<L[a].length;n++)if(L[a][n].slot)return L[a][n];
  return null;
}
function curSlotWord(){var s=curSlot();return s?s.en:''}
function rep(s,a,b){return (s&&a)?String(s).split(a).join(b):s}
/* 換了字，整句的發音和整句中文一定要跟著換（使用者 2026-09-20 指定修掉的 bug） */
function setSlot(w,z,ic){
  var c=CARDS[i];
  var s0=curSlot(), oldEn=s0?s0.en:'', oldZh=s0?s0.zh:'';
  if(c.type==='pair'&&s0){       /* 換掉的字在問句還是答句，那一邊的圖示就跟著換 */
    if(c.qtk.indexOf(s0)>=0)c.qic=ic;else c.aic=ic;
  }
  tkLists(c).forEach(function(L){
    L.forEach(function(t){if(t.slot){t.en=w;t.zh=z;t.ic=ic;t.blank=0}})});
  ['say','zh','stzh','quzh','qzh','azh'].forEach(function(k){
    if(c[k]){c[k]=rep(rep(c[k],oldEn,w),oldZh,z)}
  });
  var keepStep=step, wasAll=(step>=$$('.tk',card).length);
  draw(0);
  if(reveal==='word'&&(c.type==='sent'||c.type==='swap')){
    if(!wasAll){ /* 還在逐字中，回到原本進度 */
      for(var n=0;n<keepStep;n++)revealNext(true);
    } else {
      var tks=$$('.tk',card);tks.forEach(function(t){t.classList.remove('hide')});
      var f=$('.full',card);if(f)f.classList.remove('hide');step=tks.length;
      var hint=$('#tapHint');if(hint)hint.classList.add('off');
    }
  }
  sayCard();
}

/* ---------- 變身術：FLIP 動畫，主詞和 be 動詞真的滑過去，句號變問號 ---------- */
function doSwap(auto){
  var c=CARDS[i];
  var line=$('.line',card);if(!line)return;
  var before={};
  $$('.tk',line).forEach(function(t,n){before[n]=t.getBoundingClientRect()});
  var from=c._cur, to=from==='st'?'qu':'st';
  /* 位置對應：直述句 [主詞,be,...] ⇄ 問句 [be,主詞,...] */
  var map={0:1,1:0};
  c._cur=to;
  var full=$('.full',card);
  line.innerHTML=c[to].map(tkHTML).join('');
  if(full){var z=(to==='st'?c.stzh:c.quzh);full.textContent=z;full.setAttribute('data-zh',z);
    full.setAttribute('data-en',plain(c[to]))}
  var btn=$('#swapGo');if(btn)btn.textContent='🔄 '+(to==='st'?'變成問句':'變成直述句');
  applyMode();fit();
  var now=$$('.tk',line);
  if(!document.body.classList.contains('reduce')){
    now.forEach(function(t,n){
      var src=before[map[n]!==undefined?map[n]:n];if(!src)return;
      var r=t.getBoundingClientRect();
      var dx=src.left-r.left;
      if(!dx)return;
      t.classList.add('moving');
      t.style.transition='none';
      t.style.transform='translateX('+dx+'px)';
    });
    /* 下一影格再放開，才會看到滑過去 */
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      now.forEach(function(t){
        t.style.transition='transform .62s cubic-bezier(.3,.75,.25,1)';
        t.style.transform='';
      });
      setTimeout(function(){
        now.forEach(function(t){t.classList.remove('moving');t.style.transition='';});
        if(now[0])now[0].classList.add('flash');
        if(now[1])now[1].classList.add('flash');
        if(PUNC==='first')punc();
        setTimeout(function(){now.forEach(function(t){t.classList.remove('flash')})},520);
      },640);
    })});
  }
  /* 。變成 ？ 要看得見；變回 。 的時候句點往上飄、放大
     ——「一定要加上句點」要讓學生永生不忘（使用者 2026-09-21 指定）
     2026-09-25 使用者指定：預設「整句唸完，標點才放大」；按「⏱ 標點」可以切回「標點先放大」 */
  var pd=0;
  function punc(){
    if(pd||CARDS[i]!==c)return;pd=1;
    var last=now[now.length-1];if(!last||document.body.classList.contains('reduce'))return;
    var le=$('.en',last), lc=(le?le.textContent:'').trim();
    var anim=(lc==='.')?'dotup':'d2q';
    last.classList.add(anim);
    setTimeout(function(){last.classList.remove(anim)},anim==='dotup'?1520:2820);
  }
  sPop();
  step=now.length;
  setTimeout(function(){if(CARDS[i]!==c)return;
    sayEls($$('#cardIn .line .tk'),{done:function(){if(PUNC!=='first')setTimeout(punc,120)}});
    if(PUNC!=='first')morT.push(setTimeout(punc,5200));      /* 瀏覽器沒有回報唸完，最多等 5.2 秒 */
  },document.body.classList.contains('reduce')?60:700);
  markSubs();
  /* 秒懂重點卡：自己演三次，演完留著按鈕給老師重播 */
  if(auto&&c.type==='swapdemo'){
    demoN++;
    if(demoN<3)demoT=setTimeout(function(){doSwap(1)},PUNC==='first'?4200:6200);
  }
}
/* ⏱ 標點什麼時候放大：after ＝ 整句唸完才放大（預設）、first ＝ 一變身就先放大 */
var PUNC=store('punc')==='first'?'first':'after';
function puncLbl(){return PUNC==='first'?'⏱ 標點：先放大':'⏱ 標點：唸完才放大'}
function puncToggle(){PUNC=PUNC==='first'?'after':'first';store('punc',PUNC);
  var b=$('#puncGo');if(b){b.textContent=puncLbl();b.classList.toggle('on',PUNC==='first')}}

/* ---------- 📑 目次：一張卡一格，點了直接跳過去（使用者 2026-09-24 指定）---------- */
var KIND={sent:'💬 句型',eq:'＝ 縮寫',morph:'⚡ 縮寫變身',order:'🔁 中英語序',focus:'💡 秒懂重點',
 echo:'💡 秒懂重點',pair:'🗣 一問一答',swap:'🔄 變身術',swapdemo:'🔄 秒懂重點'};
function tocLabel(c){
  if(c.type==='sent')return plain(c.tk);
  if(c.type==='eq')return plain(c.a)+' ＝ '+plain(c.b)+(c.c?' ＝ '+plain(c.c):'');
  if(c.type==='morph')return plain(c.a)+' ➜ '+plain(c.b);
  if(c.type==='order')return c.zhRow.map(function(x){return x[0]}).join('')+' ➜ '+(c.say||'');
  if(c.type==='focus')return c.title;
  if(c.type==='echo')return c.rows.map(function(r){return r.q}).join('　');
  if(c.type==='pair')return plain(c.qtk)+'　'+plain(c.atk);
  if(c.type==='swap')return plain(c.st)+' ➜ '+plain(c.qu);
  if(c.type==='swapdemo')return plain(c.st)+' ⇄ '+plain(c.qu);
  return '';
}
function tocOpen(){
  stopPlay();sayStop();
  $('#tocG').innerHTML=CARDS.map(function(c,n){
    return '<button class="ti'+(n===i?' cur':'')+'" data-n="'+n+'"><span class="tn">'+(n+1)+'</span>'+
      '<span class="tb"><span class="tk2">'+(KIND[c.type]||'')+'</span>'+
      '<span class="tt">'+ap(tocLabel(c))+'</span></span></button>'}).join('');
  $('#toc').classList.add('on');
  var cur=$('#toc .ti.cur');if(cur&&cur.scrollIntoView)try{cur.scrollIntoView({block:'center'})}catch(e){}
}
function tocClose(){$('#toc').classList.remove('on')}
$('#tocBtn').addEventListener('click',tocOpen);
$('#toc').addEventListener('click',function(e){
  var t=e.target, b=t.closest?t.closest('.ti'):null;
  if(b){var n=parseInt(b.getAttribute('data-n'),10);tocClose();
    if(n!==i){var d=n>i?1:-1;stopPlay();sayStop();i=n;draw(d)}return}
  if((t.closest&&t.closest('.tx'))||t===$('#toc'))tocClose();
});

/* ---------- 換卡 ---------- */
function go(d){
  var n=i+d;if(n<0||n>=CARDS.length)return;
  stopPlay();
  sayStop();
  i=n;draw(d);
}
$('#prev').addEventListener('click',function(){go(-1)});
$('#next').addEventListener('click',function(){go(1)});
document.addEventListener('keydown',function(e){
  if($('#toc').classList.contains('on')){if(e.key==='Escape')tocClose();return}
  if($('#rv').classList.contains('on'))return;
  if(e.key==='ArrowLeft')go(-1);
  else if(e.key==='ArrowRight')go(1);
  else if(e.key===' '){e.preventDefault();cardTap()}
});

/* ---------- 點卡片 ---------- */
function cardTap(){
  var c=CARDS[i];
  if(reveal==='word'&&(c.type==='sent'||c.type==='swap')&&step<$$('.tk',card).length){
    revealNext(false);return;
  }
  sayCard();
}
card.addEventListener('click',function(e){
  var t=e.target;
  var sub=t.closest?t.closest('.sub'):null;
  if(sub){setSlot(sub.getAttribute('data-w'),sub.getAttribute('data-z'),sub.getAttribute('data-ic'));return}
  if(t.closest&&t.closest('#swapGo')){doSwap();return}
  if(t.closest&&t.closest('#puncGo')){puncToggle();return}
  if(t.closest&&t.closest('#ordGo')){playOrder();return}
  if(t.closest&&t.closest('#morGo')){playMorph();return}
  if(t.closest&&t.closest('#eqGo')){playEq();return}
  if(t.closest&&t.closest('#useGo')){useToggle();return}
  /* 逐字模式還沒出完：點卡片上任何地方都是「出下一個字」，不要讓學生點到空的地方沒反應 */
  var cc=CARDS[i];
  if(reveal==='word'&&(cc.type==='sent'||cc.type==='swap')&&step<$$('.tk',card).length){
    revealNext(false);return}
  var chip=t.closest?t.closest('.chip'):null;
  if(chip){var w=chip.getAttribute('data-say');
    if(/[A-Za-z]/.test(w))sayOne(chip,w);
    else if(chip.getAttribute('data-en'))sayPair(chip);
    else sayZh(w);
    lnk(chip.getAttribute('data-c'),1500);return}
  var zh=t.closest?t.closest('[data-zh]'):null;
  if(zh){sayPair(zh);return}
  var tk=t.closest?t.closest('.tk'):null;
  if(tk&&!tk.classList.contains('hide')){
    var w2=tk.getAttribute('data-say');
    if(!show.en){
      if(zhSay==='en'&&/[A-Za-z]/.test(w2))sayOne(tk,w2);
      else sayZh($('.zh',tk)?$('.zh',tk).textContent:w2)}
    else if(/[A-Za-z]/.test(w2))sayOne(tk,w2);
    return}
  var sy=t.closest?t.closest('[data-say]'):null;
  if(sy){sayOne(sy,sy.getAttribute('data-say'));return}
  cardTap();
});

/* ---------- 底部按鈕 ---------- */
/* 四個 Y/N：英文／中文／圖示／整句中文 */
function yn(id,key,label){
  var b=$(id);
  b.addEventListener('click',function(){
    show[key]=!show[key];
    b.classList.toggle('on',show[key]);
    b.innerHTML=label+' '+(show[key]?'Y':'N');
    applyMode();padBottom();fit();
  });
}
yn('#bEn','en','英文');
yn('#bZh','zh','中文');
yn('#bIc','ic','圖示');
yn('#bFull','full','整句中文');
$$('#revGrp button').forEach(function(b){
  b.addEventListener('click',function(){
    reveal=b.getAttribute('data-r');
    $$('#revGrp button').forEach(function(x){x.classList.toggle('on',x===b)});
    stopPlay();
    draw(0);
  });
});
$('#scBtn').addEventListener('click',function(){
  scenes=!scenes;$('#scBtn').classList.toggle('on',scenes);
  applyMode();fit();
  if(scenes){ /* 打開情境：小劇場重演一次 */
    var p=$('.scene',card);
    if(p){var h=p.innerHTML;p.innerHTML='';void p.offsetWidth;p.innerHTML=h}
  }
});
$('#zhBtn').addEventListener('click',function(){
  zhSay=zhSay==='zh'?'en':'zh';
  $('#zhBtn').classList.toggle('on',zhSay==='en');
  $('#zhBtn').innerHTML=zhSay==='en'?'🔤 點中文唸 英文':'🔤 點中文唸 中文';
});
$('#play').addEventListener('click',autoPlay);
$('#sayBtn').addEventListener('click',function(){sayCard()});
window.addEventListener('resize',function(){fixBar();padBottom();fit()});
/* 字體載到、按鈕列換行以後，版面要重新量一次（不然替換字會被按鈕列蓋住） */
try{document.fonts.ready.then(function(){fixBar();padBottom();fit()})}catch(e){}
setTimeout(function(){fixBar();padBottom();fit()},450);

/* ══════════ 複習題（使用者 2026-09-21 指定新增）══════════
   每 4 張卡一組，每組至少 3 題；20 秒限時，愈快答對分數愈高。
   題序、選項每一次都重洗——不能用位置背答案。 */
var RVT=20, rvQ=[], rvN=0, rvLeft=RVT, rvTick=null, rvScore=0, rvOK=0, rvBusy=false, rvGi=-1, rvMiss=[];
var RVR=2*Math.PI*46;
var RVWOW=['🎉 太快了！','⭐ 完美！','🔥 手速驚人！','💎 秒殺！','🚀 起飛！','👏 漂亮！',
 '🏆 冠軍級！','⚡ 閃電答題！','🌟 全對中！','🎯 正中紅心！','🍀 好運爆表！','🦸 英雄出現！'];
var SHP=['▲','◆','●','■'];

function rvHome(){
  rvStop();
  $('#rv').classList.add('on');
  var best=function(n){return store('rv_'+UNIT+'_'+n)||0};
  $('#rvbox').innerHTML='<h2>📝 Unit '+UNIT+' 複習　挑一組開始</h2>'+
   '<p class="lead">20 秒一題，愈快答對分數愈高。題目和選項每一次都重洗。</p>'+
   '<div class="rvpick">'+RVG.map(function(g,n){
     return '<button class="rvg" data-g="'+n+'">'+g.t+
       '<em>'+g.q.length+' 題'+(best(n)?'　最佳 <b>'+best(n)+'</b>':'')+'</em></button>'}).join('')+'</div>'+
   '<div class="rvbtns"><button id="rvClose">⬅ 回卡片</button></div>';
}
function rvStop(){if(rvTick){clearInterval(rvTick);rvTick=null}}
function rvStart(gi){
  rvGi=gi;rvScore=0;rvOK=0;rvN=0;rvMiss=[];MISSLOG=[];
  rvQ=shuf(RVG[gi].q.slice());
  rvAsk();
}
function rvAsk(){
  rvBusy=false;
  if(rvN>=rvQ.length){rvEnd();return}
  var q=rvQ[rvN];
  var o=shuf(q.o.map(function(x,n){return{x:x,n:n}}));
  $('#rvbox').innerHTML=
   '<div class="rvhud"><span><span class="k">第 '+(rvN+1)+' ／ '+rvQ.length+' 題</span><br>'+
     '<span class="v">'+RVG[rvGi].t+'</span></span>'+
    '<span id="rvring"><svg viewBox="0 0 100 100"><circle id="rvbg" cx="50" cy="50" r="46"></circle>'+
     '<circle id="rvfg" cx="50" cy="50" r="46"></circle></svg><span id="rvnum">'+RVT+'</span></span>'+
    '<span style="text-align:right"><span class="k">分數</span><br><span class="v" id="rvsc">'+rvScore+'</span></span></div>'+
   (q.sim?'<div class="rvsim">🔁 類似題　剛剛錯的，再練一次</div>':'')+
   '<div class="rvq">'+ap(q.q)+'</div>'+
   '<div class="rvo">'+o.map(function(t,n){
     return '<button data-ok="'+(t.n===0)+'" data-t="'+esc(t.x)+'"><span class="sh">'+SHP[n]+'</span><span>'+ap(t.x)+'</span></button>'
   }).join('')+'</div>'+
   '<div class="rvfb" id="rvfb"></div>';
  $('#rvfg').setAttribute('stroke-dasharray',RVR);
  rvLeft=RVT;rvPaint();
  rvStop();
  rvTick=setInterval(function(){
    rvLeft-=0.1;
    if(rvLeft<=0){rvLeft=0;rvPaint();rvStop();rvDone(null,false,true);return}
    rvPaint();
    if(rvLeft<=5&&Math.abs(rvLeft-Math.round(rvLeft))<0.05)sTick();
  },100);
  $('.rvo').addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('button'):null;
    if(!b||rvBusy)return;
    rvDone(b,b.getAttribute('data-ok')==='true',false);
  });
}
function rvPaint(){
  var n=$('#rvnum');if(!n)return;
  n.textContent=Math.ceil(rvLeft);
  $('#rvfg').setAttribute('stroke-dashoffset',RVR*(1-rvLeft/RVT));
  $('#rvring').className=rvLeft<=5?'dang':(rvLeft<=10?'warn':'');
}
function rvDone(btn,ok,timeout){
  if(rvBusy)return;rvBusy=true;rvStop();
  var q=rvQ[rvN];
  $$('.rvo button').forEach(function(x){
    if(x.getAttribute('data-ok')==='true')x.classList.add('ok');
    else if(x===btn)x.classList.add('bad');else x.classList.add('dim')});
  if(ok){
    /* 愈快答對分數愈高：滿分 1000，20 秒用完只剩 100 */
    var p=100+Math.round(900*(rvLeft/RVT));
    rvScore+=p;rvOK++;sOk();
    var wow=(rvLeft>RVT*0.6)?('<span class="surp">'+pick(RVWOW)+'</span> '):'';
    $('#rvfb').innerHTML='<div class="gain">'+wow+'＋'+p+' 分</div>';
    $('#rvsc').textContent=rvScore;
  }else{
    sNo();
    if(rvMiss.indexOf(q.h)<0)rvMiss.push(q.h);
    $('#rvfb').innerHTML='<div>'+(timeout?'⏰ 時間到！':'❌ 再想一下')+'</div><div>'+ap(q.h)+'</div>';
    /* 答錯：蓋一整頁錯題分析（倒數 8 秒、自動唸 3 次、⭐ 加分 ➜ 類似題 ✕2），按「▶ 繼續」才出下一題
       （使用者 2026-09-24 指定、2026-09-25 改版）；過兩三題再出一題「類似題」，選項重洗 */
    var myG=rvGi, sims=rvSims(q);
    if(sims[1]&&!q.sim){var sq={q:sims[1].q,o:sims[1].o,h:sims[1].h,sim:1};
      rvQ.splice(Math.min(rvQ.length,rvN+3+Math.floor(Math.random()*2)),0,sq)}
    missShow({q:q.q,pick:btn?btn.getAttribute('data-t'):null,ans:q.o[0],why:q.h,
      sims:sims.slice(0,3),pts:500,gain:function(n){rvScore+=n;var e=$('#rvsc');if(e)e.textContent=rvScore}},
      function(){if(rvGi===myG&&$('#rv').classList.contains('on')){rvN++;rvAsk()}});
    return;
  }
  setTimeout(function(){rvN++;rvAsk()},1100);
}
/* 類似題：同一個 Unit 的複習題裡，英文字重疊最多的（不含自己） */
function rvSims(q){
  var all=[];RVG.forEach(function(g){all=all.concat(g.q)});
  return simRank(q,all,function(x){return x.q+' '+x.o[0]},function(x){return x.h});
}
function rvEnd(){
  rvStop();
  var b=store('rv_'+UNIT+'_'+rvGi)||0, rec='';
  if(rvScore>b){store('rv_'+UNIT+'_'+rvGi,rvScore);b=rvScore;rec='　🎉 破紀錄！'}
  sWow();
  $('#rvbox').innerHTML='<h2>'+RVG[rvGi].t+' 完成！'+rec+'</h2>'+
   '<div class="rvsc">'+rvScore+'</div>'+
   '<p class="lead">答對 '+rvOK+' ／ '+rvQ.length+' 題　最佳紀錄 '+b+'</p>'+
   (MISSLOG.length?'':'<div class="rvfb">全對！一題都沒錯 🎉</div>')+
   '<div class="rvbtns">'+(MISSLOG.length?'<button id="rvMissBtn">📌 答錯整理</button>':'')+
   '<button class="go" id="rvAgain">🔁 再玩一次</button>'+
   '<button id="rvBack">📚 換一組</button><button id="rvClose">⬅ 回卡片</button></div>';
  /* 結束：答錯整理用獨立的一整頁先蓋上來（使用者 2026-09-24 指定） */
  missAll(RVG[rvGi].t+'　答錯整理');
}
$('#rv').addEventListener('click',function(e){
  var t=e.target;
  var g=t.closest?t.closest('.rvg'):null;
  if(g){rvStart(parseInt(g.getAttribute('data-g'),10));return}
  if(t.closest&&t.closest('#rvAgain')){rvStart(rvGi);return}
  if(t.closest&&t.closest('#rvMissBtn')){missAll(RVG[rvGi].t+'　答錯整理');return}
  if(t.closest&&t.closest('#rvBack')){missHide(false);rvHome();return}
  if(t.closest&&t.closest('#rvClose')){rvStop();sayStop();missHide(false);$('#rv').classList.remove('on');return}
});
$('#rvBtn').addEventListener('click',function(){
  stopPlay();sayStop();rvHome();
});

draw(0);
`;

function page(unit, cards, title, other, otherName) {
  const body = `
<div id="dots"></div>
<button class="nav l" id="prev" aria-label="上一張"><span><i>◀</i><b>上一張</b></span></button>
<button class="nav r" id="next" aria-label="下一張"><span><i>▶</i><b>下一張</b></span></button>
<main id="stage"><section id="card"></section></main>

<div id="rv"><div class="rvbox" id="rvbox"></div></div>
<div id="toc" aria-label="目次"><div class="th"><h2>📑 目次　點一張，直接跳過去</h2>
 <button class="tx">✕ 關閉</button></div><div class="tg" id="tocG"></div></div>

<nav id="bar">
 <button id="tocBtn">📑 目次</button>
 <span class="grp" id="ynGrp">
  <button id="bEn" class="on">英文 Y</button>
  <button id="bZh" class="on">中文 Y</button>
  <button id="bIc" class="on">圖示 Y</button>
  <button id="bFull" class="on">整句中文 Y</button>
 </span>
 <button id="scBtn">🎞 情境</button>
 <span class="grp" id="revGrp">
  <button data-r="word" class="on">🎬 逐字</button>
  <button data-r="whole">📄 整句</button>
 </span>
 <button id="play">▶ 自動播</button>
 <button id="sayBtn">🔊 念一次</button>
 <button id="rvBtn">📝 複習</button>
 <button id="zhBtn">🔤 點中文唸 中文</button>
 ${S.RATEBAR}
 <a href="${other}">${otherName}</a>
 <a href="index.html">🏠 首頁</a>
</nav>

<script>
${S.UTIL}
${S.TTS}
${S.SFX}
${S.MISS}
${JS.replace('__CARDS__', () => JSON.stringify(cards))
    .replace('__UNIT__', () => JSON.stringify(unit))
    .replace('__SUB__', () => JSON.stringify(D.SUB))
    .replace('__RVG__', () => JSON.stringify(unit === 1 ? D.RV1 : D.RV2))}
${S.RATEJS}
</script>
</body>
</html>`;
  return S.HEAD(title, CSS) + body;
}

/* 產出哪幾頁：別的課次可以在 _data.js 寫 PAGES 換標題，沒寫就是 sentences 原本的兩頁 */
const PAGES = D.PAGES || [
  { file: 'unit1.html', unit: 1, title: 'Unit 1 句型｜Who’s he? Who’s she?', other: 'unit2.html', otherName: '➡ Unit 2' },
  { file: 'unit2.html', unit: 2, title: 'Unit 2 句型｜Is he a doctor?', other: 'unit1.html', otherName: '⬅ Unit 1' }
];
PAGES.forEach(P => fs.writeFileSync(DIR + '/' + P.file,
  page(P.unit, P.unit === 1 ? D.U1 : D.U2, P.title, P.other, P.otherName)));
console.log('cards ok  unit1=' + D.U1.length + ' 張  unit2=' + D.U2.length + ' 張');
