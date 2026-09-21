/* sentences/_build_cards.js — Unit 1／Unit 2 句型卡的產生器
 * node sentences/_build_cards.js  → unit1.html ／ unit2.html
 * 卡片內容改 _data.js，版面改這裡，不要手改產出的 .html
 *
 * 三大重點（使用者 2026-09-20 指定）：版面簡潔清爽、廢話少、秒懂動畫多。
 */
const fs = require('fs'), DIR = __dirname;
const S = require('./_shared');
const D = require('./_data');

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

/* ── 真實情境（老師按「🎞 情境」才出現）：畫面一段一段跳出來 ── */
.scene{display:none;flex-direction:column;align-items:center;gap:clamp(3px,.7vh,8px);
 width:100%;max-width:840px;margin-bottom:clamp(8px,1.6vh,18px);
 background:#080B0E;border:1px solid #1E2831;border-radius:16px;
 padding:clamp(8px,1.5vh,16px) clamp(10px,1.6vw,22px)}
#card.sc .scene{display:flex}
.scene .sat{font-size:clamp(13px,2vh,19px);color:#7E93A5;letter-spacing:.08em}
.scene .spic{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
 gap:clamp(5px,.9vw,12px);line-height:1.2;text-align:center}
.spic .sg{font-size:clamp(22px,4vh,42px);opacity:0;
 animation:sgIn .44s cubic-bezier(.2,.9,.3,1.3) forwards}
.spic .sar{font-size:clamp(15px,2.4vh,25px);color:#44586A;opacity:0;
 animation:sgIn .44s cubic-bezier(.2,.9,.3,1.3) forwards}
@keyframes sgIn{from{opacity:0;transform:translateX(-16px) scale(.72)}to{opacity:1;transform:none}}
.scene .suse{font-size:clamp(14px,2.3vh,22px);color:var(--body);line-height:1.45;
 text-align:center;max-width:34ch}
.reduce .spic .sg,.reduce .spic .sar{opacity:1;animation:none}

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
.chip{display:flex;flex-direction:column;align-items:center;gap:3px;border-radius:12px;
 padding:clamp(5px,1vh,11px) clamp(8px,1.2vw,16px);font-weight:700;white-space:nowrap;
 font-size:clamp(22px,4.2vh,44px);line-height:1.1;background:#141414;color:var(--fg)}
.chip .cen{display:block;white-space:nowrap}
.chip .ci{font-size:clamp(16px,2.6vh,27px);font-weight:400}
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

/* ── 對話卡：中文放大、照英文的意思斷字（使用者指定）── */
.pair{width:100%;display:flex;flex-direction:column;gap:clamp(8px,1.8vh,20px);
 align-items:stretch;max-width:840px}
.bub{display:flex;align-items:center;gap:clamp(9px,1.5vw,18px);border-radius:18px;
 padding:clamp(10px,1.9vh,20px) clamp(12px,1.8vw,24px);border:1px solid #242424;background:#0B0B0B;
 opacity:0;animation:rowIn .48s cubic-bezier(.2,.9,.3,1.25) forwards}
.reduce .bub{opacity:1;animation:none}
.bub.q{border-color:#2E3A46}
.bub.a{border-color:#2E4636;margin-left:clamp(14px,4vw,64px)}
.bub .bi{font-size:clamp(28px,4.8vh,50px);flex:0 0 auto}
.bub .bt{flex:1 1 auto;min-width:0}
/* 每一個英文字的正下方，就是那一個字的中文（使用者 2026-09-21 指定） */
.pair .tk .en{font-size:clamp(22px,4.8vh,46px)}
.pair .tk .zh{font-size:clamp(15px,2.9vh,28px)}
.pair .tk .ic{font-size:clamp(17px,3.2vh,32px)}
.pair .full{margin-top:clamp(4px,.9vh,10px);font-size:clamp(17px,3vh,30px);
 letter-spacing:.04em;text-align:center}

/* ── 變身卡（Unit 2 的核心秒懂動畫）── */
.swapbox{width:100%;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,18px)}
.swapbtn{background:var(--btn);border:1px solid var(--line);border-radius:999px;
 color:var(--fg);font-size:clamp(15px,2.4vh,23px);font-weight:700;
 padding:clamp(8px,1.4vh,14px) clamp(16px,2.4vw,30px)}
.swapbtn:active{transform:scale(.96);border-color:var(--acc)}
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
.chip.lp{background:#F7A8C4;color:#3A0A1C}
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
.moreq.on .mq{animation:eqp 1s cubic-bezier(.2,.9,.3,1.4) .25s}

/* ── he 問 ➜ He 答（藍底會自己飛下去）── */
.echo{width:100%;max-width:880px;display:flex;flex-direction:column;gap:clamp(8px,1.7vh,18px)}
.erow{display:flex;align-items:center;justify-content:center;gap:clamp(6px,1.2vw,16px);
 background:#0B0B0B;border:1px solid #242424;border-radius:16px;
 padding:clamp(8px,1.5vh,16px) clamp(10px,1.5vw,20px);
 opacity:0;animation:rowIn .48s cubic-bezier(.2,.9,.3,1.25) forwards}
.reduce .erow{opacity:1;animation:none}
.erow .earr{font-size:clamp(17px,2.8vh,30px);color:#44586A;flex:0 0 auto}
.ebub{flex:1 1 0;min-width:0;text-align:center}
.ebub .et{display:block;font-size:clamp(20px,4vh,40px);font-weight:700;line-height:1.2;white-space:nowrap}
.ebub .ez{display:block;font-size:clamp(14px,2.4vh,24px);color:var(--acc);margin-top:4px}
.key{display:inline-block;border-radius:9px;padding:0 .16em}
.key.b{background:var(--he);color:#fff}
.key.p{background:var(--she);color:#fff}
.key.lp{background:#F7A8C4;color:#3A0A1C}
.key.flash{box-shadow:0 0 0 4px rgba(255,255,255,.6)}
.key.fly{position:fixed;z-index:60;pointer-events:none;font-weight:700;
 font-size:clamp(20px,4vh,40px);line-height:1.2}

/* ── 變身卡：。變成 ？ 要看得見（使用者 2026-09-21 指定）── */
.tk.d2q .en{display:inline-block;animation:d2q .8s cubic-bezier(.2,.9,.3,1.3)}
@keyframes d2q{0%{transform:scale(.4) rotate(-25deg);color:var(--be)}
 55%{transform:scale(1.7);color:var(--be)}100%{transform:none}}
/* 句點往上飄、放大——「一定要加上句點」（使用者 2026-09-21 指定） */
.tk.dotup .en{display:inline-block;color:var(--gold);
 text-shadow:0 0 22px rgba(255,210,74,.75);animation:dotup 1.5s cubic-bezier(.2,.9,.3,1.25)}
@keyframes dotup{0%{transform:none}
 20%{transform:translateY(-1.25em) scale(3.4)}
 62%{transform:translateY(-1.25em) scale(3.4)}
 100%{transform:none}}

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
.rvq{font-size:clamp(19px,3.4vh,34px);font-weight:700;text-align:center;line-height:1.35}
.rvo{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(7px,1.2vh,13px);width:100%}
.rvo button{display:flex;align-items:center;gap:clamp(6px,1.1vw,13px);text-align:left;
 background:#0C0C0C;border:1px solid #262626;border-radius:15px;color:var(--fg);
 font-size:clamp(15px,2.5vh,25px);line-height:1.3;
 padding:clamp(9px,1.6vh,17px) clamp(11px,1.6vw,21px);min-height:clamp(48px,7.4vh,76px)}
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
`;

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
/* 縮寫動畫專用：紅色的字母原地讓位給紅色的 ’ */
function morphEn(en,ri){
  var n=String(en).indexOf(ri);
  if(n<0)return enHTML(en,ri);
  return enHTML(en.slice(0,n))+'<span class="lt"><span class="lo">'+ri+
    '</span><b class="la ap">\\u2019</b></span>'+enHTML(en.slice(n+1));
}

/* ---------- 畫一個字（英文／中文／圖示三層）---------- */
/* 's 的發音：唸「前一個字＋'s」，學生聽到的就是 /z/（Who's → /huːz/） */
function tkHTML(t,idx,arr){
  var cls='tk'+(t.tight?' tight':'')+(t.hl?' '+t.hl:'')+(t.blank?' blank':'');
  var sy=t.say||t.en;
  if(/^[\\u2019']s$/.test(t.en)&&arr&&idx>0&&arr[idx-1])sy=arr[idx-1].en+"'s";
  var enh=(MOR&&t.ri)?morphEn(t.en,t.ri):enHTML(t.en,t.ri);
  return '<span class="'+cls+'" data-i="'+idx+'" data-k="'+(t.k||'')+'" data-say="'+esc(sy)+'">'+
    '<span class="en">'+enh+'</span>'+
    '<span class="zh">'+(t.zh||'')+'</span>'+
    '<span class="ic">'+(t.ic||'')+'</span></span>';
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
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

function lineHTML(tk,id){
  return '<div class="wrap"><div class="line"'+(id?' id="'+id+'"':'')+'>'+
    tk.map(tkHTML).join('')+'</div></div>';
}
/* 情境畫面用 ➜ 切段，一段一段跳出來 */
function sceneHTML(c){
  if(!c.scene)return '';
  var segs=String(c.scene.pic).split('\\u279C'), h='', d=0;
  segs.forEach(function(s,n){
    if(n){h+='<span class="sar" style="animation-delay:'+d.toFixed(2)+'s">\\u279C</span>';d+=0.14}
    h+='<span class="sg" style="animation-delay:'+d.toFixed(2)+'s">'+ap(s.trim())+'</span>';d+=0.28;
  });
  return '<div class="scene"><div class="sat">'+c.scene.at+'</div>'+
   '<div class="spic">'+h+'</div>'+
   '<div class="suse">\\uD83D\\uDCA1 '+ap(c.scene.use)+'</div></div>';
}
function subsHTML(kind){
  var s=SUB[kind];if(!s)return '';
  var row=function(list,lbl,cls){
    if(!list.length)return '';
    return '<div class="subrow"><span class="lbl">'+lbl+'</span>'+list.map(function(w){
      return '<button class="sub '+cls+'" data-w="'+w[0]+'" data-z="'+w[1]+'" data-ic="'+w[2]+'">'+
       w[2]+' '+w[0]+' <em>'+w[1]+'</em></button>'}).join('')+'</div>';
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
    h=lineHTML(c.tk)+fullHTML(c.zh,c.say||plain(c.tk));
    subs=c.slot?subsHTML(c.slot):'';
  } else if(c.type==='eq'){
    kind='縮寫';
    /* 兩句都要完整聽得到，而且要看得出「這兩句是同一句」（使用者 2026-09-21 指定） */
    h='<div class="eq">'+
      '<div class="eqrow a" data-say="'+esc(plain(c.a))+'">'+lineHTML(c.a)+'</div>'+
      '<div class="eqmark">＝</div>'+
      '<div class="eqrow b" data-say="'+esc(plain(c.b))+'">'+lineHTML(c.b)+'</div>'+
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
      if(/^[\\u2019']s$/.test(w)&&n>0)return row[n-1][0]+"'s";
      return w;
    };
    var mate=function(col){for(var k=0;k<c.enRow.length;k++)if(c.enRow[k][2]===col)return sayOf(c.enRow,k);return ''};
    var chip=function(x,n,row,zh,rc){
      return '<button class="chip '+x[2]+' '+rc+'" data-c="'+x[2]+'" data-n="'+n+'" data-say="'+esc(sayOf(row,n))+'"'+
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
  } else if(c.type==='focus'){
    kind='秒懂重點';
    h='<div class="focus"><h2>'+ap(c.title)+'</h2>'+c.rows.map(function(r,n){
      return '<div class="frow'+(c.eqRow?' eqr':'')+'" style="animation-delay:'+(0.12+n*0.22).toFixed(2)+'s">'+
        '<span class="fi ic">'+r[2]+'</span>'+
        '<span class="fa en" data-say="'+esc(spk(r[0]))+'">'+enHTML(r[0])+'</span>'+
        (c.eqRow?'<span class="fe">＝</span>':'')+
        '<span class="fb zh" data-zh="'+esc(r[1])+'" data-en="'+esc(spk(r[0]))+'">'+ap(r[1])+'</span>'+
        '</div>'}).join('')+'</div>'+noteHTML(c.note);
  } else if(c.type==='echo'){
    kind='秒懂重點';
    h='<div class="echo">'+c.rows.map(function(r,n){
      return '<div class="erow" style="animation-delay:'+(0.12+n*0.24).toFixed(2)+'s">'+
       '<span class="ebub q"><span class="et en" data-say="'+esc(r.q)+'">'+keyed(r.q,r.qk,r.cls)+'</span>'+
         '<span class="ez zh" data-zh="'+esc(r.qzh)+'" data-en="'+esc(r.q)+'">'+r.qzh+'</span></span>'+
       '<span class="earr">\\u279C</span>'+
       '<span class="ebub a"><span class="et en" data-say="'+esc(r.a)+'">'+keyed(r.a,r.ak,r.cls)+'</span>'+
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
      '<button class="swapbtn" id="swapGo">🔄 '+(c._cur==='st'?'變成問句':'變成直述句')+'</button>'+
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
  var cs=getComputedStyle(card);
  var availH=card.clientHeight-parseFloat(cs.paddingTop||0)-parseFloat(cs.paddingBottom||0);
  var needH=inn.scrollHeight, availW=card.clientWidth, needW=inn.scrollWidth;
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

/* ---------- 語序卡：中文的字飛到英文的位置 ---------- */
function playOrder(){
  if(document.body.classList.contains('reduce'))return;
  var grid=$('.ordgrid',card);
  if(!grid)return;
  var k=parseFloat(card.getAttribute('data-k')||'1')||1;
  var zc=$$('.chip.cz',grid), ec=$$('.chip.ce',grid), used={};
  ec.forEach(function(c){
    var col=c.getAttribute('data-c'), src=null;
    for(var j=0;j<zc.length;j++){if(!used[j]&&zc[j].getAttribute('data-c')===col){src=zc[j];used[j]=1;break}}
    if(!src)return;
    var a=src.getBoundingClientRect(), b=c.getBoundingClientRect();
    c.style.transition='none';
    c.style.transform='translate('+((a.left-b.left)/k)+'px,'+((a.top-b.top)/k)+'px)';
    c.style.opacity='.3';
  });
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    ec.forEach(function(c,n){
      var d=(n*0.13).toFixed(2)+'s';
      c.style.transition='transform .78s cubic-bezier(.3,.75,.25,1) '+d+',opacity .4s '+d;
      c.style.transform='';c.style.opacity='';
    });
  })});
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
  say(two);                                             /* ① */
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
    say(one);
  },2900));
  morT.push(setTimeout(function(){                      /* ⑤ */
    if(i!==myI)return;
    if(eq)eq.classList.add('on');
    fit();
    say(two,null,{keep:1});say(one,null,{keep:1});
  },4200));
}

/* ---------- 等式卡：一句一句亮起來、一句一句唸完，最後兩句一起亮 ＋ 等號放大 ----------
   使用者 2026-09-21 指定：Who is he? 和 Who’s he? 兩句都要完整聽到，
   而且要用會動的方式讓學生秒懂「這兩句是同一句」。 */
/* 一句唸完（或最多等 max 毫秒，語速調到 0.5 也不會脫節）再做下一件事 */
function after(txt,max,fn){
  var myI=i, done=0;
  var run=function(){if(done)return;done=1;if(i!==myI)return;fn()};
  say(txt,null,{keep:1,done:run});
  morT.push(setTimeout(run,max));
}
function playEq(){
  var c=CARDS[i];
  var ra=$('.eqrow.a',card), rb=$('.eqrow.b',card), mk=$('.eqmark',card);
  if(!ra||!rb)return;
  sayStop();
  ra.classList.add('lit');rb.classList.remove('lit');
  after(plain(c.a),6500,function(){
    ra.classList.remove('lit');rb.classList.add('lit');
    after(plain(c.b),6500,function(){
      ra.classList.add('lit');
      if(mk){mk.classList.remove('pulse');void mk.offsetWidth;mk.classList.add('pulse')}
      morT.push(setTimeout(function(){
        ra.classList.remove('lit');rb.classList.remove('lit')},1800));
    });
  });
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
    if(w&&/[A-Za-z]/.test(w))say(w,null,{keep:1});
    step++;
    if(step===tks.length){
      var f=$('.full',card);if(f)setTimeout(function(){f.classList.remove('hide')},260);
      var hint=$('#tapHint');if(hint)hint.classList.add('off');
      if(!auto)say(sentOf(),null,{keep:1});
    }
    fit();
    return true;
  }
  return false;
}
/* 點什麼唸什麼：每一種卡片都要唸得出一句話（使用者 2026-09-21 回報「念一次沒聲音」） */
function sentOf(){
  var c=CARDS[i];
  if(c.type==='sent')return c.say||plain(c.tk);
  if(c.type==='swap'||c.type==='swapdemo')return plain(c[c._cur||'st']);
  if(c.type==='eq')return plain(c.b);
  if(c.type==='morph')return c.say||plain(c.b);
  if(c.type==='order')return c.say||'';
  if(c.type==='focus')return c.rows.map(function(r){return spk(r[0])}).join(', ');
  if(c.type==='echo')return c.rows.map(function(r){return r.q+' '+r.a}).join(' ');
  if(c.type==='pair')return plain(c.qtk)+' '+plain(c.atk);
  return '';
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
    say(sentOf());
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
  if(w&&/[A-Za-z]/.test(w))say(w,null,{keep:1,done:go});
  else setTimeout(go,SLOW?700:380);
}
function autoPlay(){
  if(playing){stopPlay();sayStop();return}
  var c=CARDS[i];
  if(c.type!=='sent'&&c.type!=='swap'){say(sentOf());return}
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
  say(sentOf());
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
        /* 。變成 ？ 要看得見；變回 。 的時候句點往上飄、放大
           ——「一定要加上句點」要讓學生永生不忘（使用者 2026-09-21 指定） */
        var last=now[now.length-1];
        if(last){
          var le=$('.en',last), lc=(le?le.textContent:'').trim();
          var anim=(lc==='.')?'dotup':'d2q';
          last.classList.add(anim);
          setTimeout(function(){last.classList.remove(anim)},anim==='dotup'?1520:820);
        }
        setTimeout(function(){now.forEach(function(t){t.classList.remove('flash')})},520);
      },640);
    })});
  }
  sPop();
  step=now.length;
  setTimeout(function(){say(plain(c[to]))},document.body.classList.contains('reduce')?60:700);
  markSubs();
  /* 秒懂重點卡：自己演三次，演完留著按鈕給老師重播 */
  if(auto&&c.type==='swapdemo'){
    demoN++;
    if(demoN<3)demoT=setTimeout(function(){doSwap(1)},3400);
  }
}

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
  var s=sentOf();if(s)say(s);
}
card.addEventListener('click',function(e){
  var t=e.target;
  var sub=t.closest?t.closest('.sub'):null;
  if(sub){setSlot(sub.getAttribute('data-w'),sub.getAttribute('data-z'),sub.getAttribute('data-ic'));return}
  if(t.closest&&t.closest('#swapGo')){doSwap();return}
  if(t.closest&&t.closest('#ordGo')){playOrder();return}
  if(t.closest&&t.closest('#morGo')){playMorph();return}
  if(t.closest&&t.closest('#eqGo')){playEq();return}
  /* 逐字模式還沒出完：點卡片上任何地方都是「出下一個字」，不要讓學生點到空的地方沒反應 */
  var cc=CARDS[i];
  if(reveal==='word'&&(cc.type==='sent'||cc.type==='swap')&&step<$$('.tk',card).length){
    revealNext(false);return}
  var chip=t.closest?t.closest('.chip'):null;
  if(chip){var w=chip.getAttribute('data-say');
    if(/[A-Za-z]/.test(w))say(w);
    else if(chip.getAttribute('data-en'))sayPair(chip);
    else sayZh(w);
    chip.style.setProperty('--dx','-40px');chip.classList.add('fly');
    setTimeout(function(){chip.classList.remove('fly')},960);return}
  var zh=t.closest?t.closest('[data-zh]'):null;
  if(zh){sayPair(zh);return}
  var tk=t.closest?t.closest('.tk'):null;
  if(tk&&!tk.classList.contains('hide')){
    var w2=tk.getAttribute('data-say');
    if(!show.en){
      if(zhSay==='en'&&/[A-Za-z]/.test(w2))say(w2);
      else sayZh($('.zh',tk)?$('.zh',tk).textContent:w2)}
    else if(/[A-Za-z]/.test(w2))say(w2);
    return}
  var sy=t.closest?t.closest('[data-say]'):null;
  if(sy){say(sy.getAttribute('data-say'));return}
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
  if(scenes){ /* 打開情境：畫面重播一次 */
    var p=$('.spic',card);
    if(p){var h=p.innerHTML;p.innerHTML='';void p.offsetWidth;p.innerHTML=h}
  }
});
$('#zhBtn').addEventListener('click',function(){
  zhSay=zhSay==='zh'?'en':'zh';
  $('#zhBtn').classList.toggle('on',zhSay==='en');
  $('#zhBtn').innerHTML=zhSay==='en'?'🔤 點中文唸 英文':'🔤 點中文唸 中文';
});
$('#play').addEventListener('click',autoPlay);
$('#sayBtn').addEventListener('click',function(){say(sentOf())});
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
  rvGi=gi;rvScore=0;rvOK=0;rvN=0;rvMiss=[];
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
   '<div class="rvq">'+ap(q.q)+'</div>'+
   '<div class="rvo">'+o.map(function(t,n){
     return '<button data-ok="'+(t.n===0)+'"><span class="sh">'+SHP[n]+'</span><span>'+ap(t.x)+'</span></button>'
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
  }
  setTimeout(function(){rvN++;rvAsk()},ok?1100:2200);
}
function rvEnd(){
  rvStop();
  var b=store('rv_'+UNIT+'_'+rvGi)||0, rec='';
  if(rvScore>b){store('rv_'+UNIT+'_'+rvGi,rvScore);b=rvScore;rec='　🎉 破紀錄！'}
  sWow();
  $('#rvbox').innerHTML='<h2>'+RVG[rvGi].t+' 完成！'+rec+'</h2>'+
   '<div class="rvsc">'+rvScore+'</div>'+
   '<p class="lead">答對 '+rvOK+' ／ '+rvQ.length+' 題　最佳紀錄 '+b+'</p>'+
   (rvMiss.length?'<div class="rvfb">📌 要記住的：<br>'+rvMiss.map(function(h){return '・'+ap(h)}).join('<br>')+'</div>'
                 :'<div class="rvfb">全對！一題都沒錯 🎉</div>')+
   '<div class="rvbtns"><button class="go" id="rvAgain">🔁 再玩一次</button>'+
   '<button id="rvBack">📚 換一組</button><button id="rvClose">⬅ 回卡片</button></div>';
}
$('#rv').addEventListener('click',function(e){
  var t=e.target;
  var g=t.closest?t.closest('.rvg'):null;
  if(g){rvStart(parseInt(g.getAttribute('data-g'),10));return}
  if(t.closest&&t.closest('#rvAgain')){rvStart(rvGi);return}
  if(t.closest&&t.closest('#rvBack')){rvHome();return}
  if(t.closest&&t.closest('#rvClose')){rvStop();sayStop();$('#rv').classList.remove('on');return}
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

<nav id="bar">
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

fs.writeFileSync(DIR + '/unit1.html',
  page(1, D.U1, 'Unit 1 句型｜Who’s he? Who’s she?', 'unit2.html', '➡ Unit 2'));
fs.writeFileSync(DIR + '/unit2.html',
  page(2, D.U2, 'Unit 2 句型｜Is he a doctor?', 'unit1.html', '⬅ Unit 1'));
console.log('cards ok  unit1=' + D.U1.length + ' 張  unit2=' + D.U2.length + ' 張');
