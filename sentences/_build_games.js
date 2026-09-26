/* sentences/_build_games.js — 10 種複習遊戲（games.html）
 * node sentences/_build_games.js
 * 題庫與驚喜卡改 _game_data.js，玩法與版面改這裡。
 *
 * 十個遊戲共用一顆引擎（2026-09-21 使用者指定改版；2026-09-25 再改版）：
 *  - **每一個遊戲限時 5 分鐘**（⏳ 一直看得到），每一題限時 15 秒，愈快答對分數愈高
 *  - **答對：加分畫面用獨立視窗**（✅ ＋880，下面一排圖示算式 ✅100 ＋ ⚡720 ＋ 🔥60），字大、字少
 *  - **連續答對 3 題才翻驚喜卡**：70% 直接翻一張；30% 自己選（二選一 12%、三選一 9%、四選一 6%、五選一 3%）
 *    每一個遊戲 30 張：名字、效果、翻開的特效全部不一樣，**只給好事**（_surprise.js）
 *  - **答錯：錯題分析的獨立頁**（_shared.js 的 MISS）：倒數 8 秒、正確答案唸 3 次、🔊 發音、
 *    ⭐ 加分 ➜ 再看 8 秒 ➜ 字放大的類似題 ➜ 答對拿 500 ✕ 2；過兩三題再出一題類似題，選項重洗
 *  - 題序、選項每一次都重新打散 → 每次重玩都不一樣
 *  - 最佳紀錄存在這台 iPad 上
 */
const fs = require('fs'), SITE = require('./_site'), DIR = SITE.DIR;
const S = require('./_shared');
const B = SITE.load('_game_data');

/* ── 別的課次共用這一套遊戲引擎時才會用到的設定（sentences 沒寫 ➜ 用 sentences 自己的）──
   META g2／g9 的 duo：兩顆大按鈕各是什麼（[{v,t,d,c}]），g9 題目的第 3 格是答錯的提示 */
const NS = B.SURP.g1.length;                          /* 每一個遊戲幾張驚喜卡 */
const metaOf = id => B.GAMES.filter(m => m.id === id)[0] || {};
const duoBtns = d => d.map(x => `     '<button class="dbtn ${x.c}" data-v="${x.v}">${x.t}<span class="ds">${x.d}</span></button>'+`).join('\n');
const DUO2 = metaOf('g2').duo, DUO9 = metaOf('g9').duo;
const LAB9 = DUO9 ? JSON.stringify(DUO9.reduce((o, x) => { o[x.v] = x.t + ' ' + x.d.split('　')[0]; return o }, {})) : '';
const OTHER2 = DUO2 ? JSON.stringify(DUO2.map(x => x.v)) : '["he","she"]';
const CSS = `
#stage{position:fixed;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch;
 padding:calc(var(--safeT) + clamp(14px,2.6vh,26px)) clamp(14px,3vw,36px)
         calc(var(--barH,60px) + var(--safeB) + clamp(6px,1vh,12px)) clamp(14px,3vw,36px)}
#stage.lock{overflow:hidden}

/* ── 遊戲大廳 ── */
#hub{display:flex;flex-direction:column;align-items:center;gap:clamp(10px,1.8vh,20px);min-height:100%}
#hub h1{margin:0;font-size:clamp(24px,4.6vh,44px);font-weight:700;text-align:center}
#hub .lead{margin:0;font-size:clamp(13px,2.1vh,19px);color:var(--dim);text-align:center;max-width:44ch;line-height:1.6}
#grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,252px),1fr));
 gap:clamp(8px,1.4vh,14px);width:100%;max-width:1120px}
.gcard{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:4px;
 text-align:left;background:linear-gradient(180deg,#0E0E0E,#050505);
 border:1px solid #272727;border-radius:18px;color:var(--fg);
 padding:clamp(11px,1.9vh,18px) clamp(12px,1.7vw,20px);min-height:clamp(104px,15vh,140px)}
.gcard:active{transform:scale(.985);border-color:var(--acc)}
.gcard .gn{position:absolute;top:clamp(8px,1.3vh,13px);right:clamp(11px,1.5vw,17px);
 font-size:clamp(18px,3vh,28px);font-weight:700;color:#232323;line-height:1}
.gcard .gi{font-size:clamp(25px,4.2vh,38px);line-height:1.1}
.gcard .gt{font-size:clamp(17px,2.7vh,24px);font-weight:700}
.gcard .gr{font-size:clamp(12px,1.85vh,16px);color:var(--dim);line-height:1.45}
.gcard .gb{margin-top:auto;font-size:clamp(11px,1.6vh,14px);color:#5C5C5C;letter-spacing:.06em}
.gcard .gb b{color:var(--gold);font-weight:700}

/* ── 遊戲 HUD ── */
#ghud{display:none;position:relative;align-items:center;justify-content:space-between;
 gap:clamp(8px,1.6vw,20px);width:100%;max-width:1120px;margin:0 auto clamp(8px,1.5vh,16px)}
#ghud.on{display:flex}
#gring{position:relative;width:clamp(58px,9vh,88px);height:clamp(58px,9vh,88px);flex:0 0 auto}
#gring svg{width:100%;height:100%;transform:rotate(-90deg)}
#gring circle{fill:none;stroke-width:8;stroke-linecap:round}
#gbg{stroke:#1C1C1C}#gfg{stroke:var(--ok);transition:stroke-dashoffset .25s linear,stroke .3s}
#gnum{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
 font-size:clamp(17px,2.9vh,28px);font-weight:700}
#gring.warn #gfg{stroke:var(--be)}#gring.warn #gnum{color:var(--be)}
#gring.dang #gfg{stroke:var(--no)}#gring.dang #gnum{color:var(--no);animation:thump .5s infinite}
@keyframes thump{0%,100%{transform:scale(1)}50%{transform:scale(1.14)}}
.gcell{display:flex;flex-direction:column;gap:1px}
.gcell .k{font-size:clamp(10px,1.45vh,13px);color:#5C5C5C;letter-spacing:.12em}
.gcell .v{font-size:clamp(16px,2.7vh,26px);font-weight:700}
.gcell.r{align-items:flex-end;text-align:right}
#gstreak{color:var(--gold)}
/* 2026-09-26 使用者：右上角分數和文字放大，一眼看懂總分和拿到的獎勵 */
.gsb{display:flex;align-items:flex-end;gap:clamp(8px,1.4vw,18px)}
.gsb>span{display:flex;flex-direction:column;align-items:center;line-height:1.05}
.gsb b{font-weight:700;font-variant-numeric:tabular-nums}
.gsb em{font-style:normal;font-size:clamp(13px,2vh,19px);color:#BFA75A;font-weight:700;letter-spacing:.06em;margin-top:2px}
.gsb .gb1 b{font-size:clamp(34px,6.4vh,64px);color:var(--gold);text-shadow:0 0 18px rgba(255,210,74,.45)}
.gsb .gb2 b{font-size:clamp(22px,4vh,40px)}
#gpop{font-size:clamp(24px,4.4vh,44px)!important;top:-10px!important}
#gname{font-size:clamp(13px,2.1vh,19px);font-weight:700;color:var(--acc)}

/* ── 驚喜卡（2026-09-21 改版；2026-09-25 使用者指定：字、圖示、動畫放大，文字簡潔，質感升級）──
   一張真的卡：卡背先抖（等一下會翻開 ＝ 期待），翻開以後
   大大的圖示 ➜ 最大的那一行 ＝ 你拿到什麼 ➜ 一行短短的白話 ➜ 卡片名字。
   四種顏色（p0～p3）✕ 八種炸法 ＝ 每一張卡翻開的樣子都不一樣。 */
#evt,#pick,#gain{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;
 background:rgba(0,0,0,.84);perspective:1400px}
#evt.on,#pick.on,#gain.on{display:flex}
.c3{position:relative;width:clamp(250px,40vw,420px);height:clamp(300px,52vh,460px);transform-style:preserve-3d;
 transition:transform .75s cubic-bezier(.3,.8,.3,1.1)}
.c3.flip{transform:rotateY(180deg)}
#evt.on .c3.shake{animation:cShake .9s ease-in-out}
@keyframes cShake{0%,100%{transform:rotate(0)}20%{transform:rotate(-6deg) scale(1.04)}40%{transform:rotate(6deg) scale(1.04)}
 60%{transform:rotate(-4deg)}80%{transform:rotate(3deg)}}
.fc{position:absolute;inset:0;border-radius:28px;backface-visibility:hidden;-webkit-backface-visibility:hidden;
 display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(4px,1vh,12px);
 padding:clamp(12px,2.4vh,26px);text-align:center;overflow:hidden}
.fc.bk{background:radial-gradient(circle at 30% 20%,var(--pc2),var(--pc3) 70%);border:3px solid var(--pc);
 box-shadow:0 0 50px var(--pcg),inset 0 0 30px rgba(255,255,255,.08)}
.fc.bk::before{content:'';position:absolute;inset:10px;border-radius:20px;border:2px dashed rgba(255,255,255,.22)}
.fc.bk .bi{font-size:clamp(80px,15vh,150px);line-height:1;animation:bBob 1.4s ease-in-out infinite}
.fc.bk .bl{font-size:clamp(20px,3.4vh,32px);color:#fff;font-weight:700;letter-spacing:.2em}
@keyframes bBob{0%,100%{transform:none}50%{transform:translateY(-10px) scale(1.06)}}
.fc.ft{transform:rotateY(180deg);background:linear-gradient(160deg,var(--pc3),#050505 80%);border:3px solid var(--pc);
 box-shadow:0 0 70px var(--pcg)}
.fc.ft::after{content:'';position:absolute;inset:-40%;background:conic-gradient(from 0deg,transparent,var(--pcg),transparent 30%);
 animation:shine 3.2s linear infinite;opacity:.55;z-index:-1}
@keyframes shine{to{transform:rotate(360deg)}}
.fc .eic{font-size:clamp(64px,12vh,124px);line-height:1;filter:drop-shadow(0 0 18px var(--pcg))}
.fc .ebig{font-size:clamp(34px,6.6vh,66px);font-weight:700;color:var(--pc);line-height:1.08;text-shadow:0 0 22px var(--pcg)}
.fc .ewhy{font-size:clamp(18px,3.1vh,30px);color:#fff;line-height:1.3;max-width:15em}
.fc .ename{font-size:clamp(14px,2.2vh,20px);color:rgba(255,255,255,.6);letter-spacing:.08em}
.p0{--pc:#FFD24A;--pc2:#6B5210;--pc3:#1D1606;--pcg:rgba(255,210,74,.5)}
.p1{--pc:#5AD1FF;--pc2:#12506B;--pc3:#061621;--pcg:rgba(90,209,255,.5)}
.p2{--pc:#FF7EB6;--pc2:#6B1640;--pc3:#1F0612;--pcg:rgba(255,126,182,.5)}
.p3{--pc:#8CF08A;--pc2:#1F6B2A;--pc3:#07190A;--pcg:rgba(140,240,138,.5)}
/* 自己選一張：二選一～五選一 */
#pick .pbox{display:flex;flex-direction:column;align-items:center;gap:clamp(10px,2vh,22px);width:min(96vw,1100px)}
#pick h2{margin:0;font-size:clamp(28px,5.4vh,54px);color:var(--gold);text-shadow:0 0 24px rgba(255,210,74,.5);
 animation:pkT 1s ease-in-out infinite}
@keyframes pkT{0%,100%{transform:none}50%{transform:scale(1.06)}}
.prow{display:flex;gap:clamp(8px,1.6vw,20px);justify-content:center;flex-wrap:nowrap}
.prow .c3{width:clamp(120px,17vw,210px);height:clamp(170px,30vh,290px);cursor:pointer;
 animation:pkIn .5s cubic-bezier(.2,1.4,.4,1) both}
.prow .c3:not(.flip):hover{transform:translateY(-8px)}
.prow .fc .bi{font-size:clamp(46px,8vh,84px)}
.prow .fc .bl{font-size:clamp(14px,2.2vh,22px)}
.prow .fc .eic{font-size:clamp(36px,6.4vh,66px)}
.prow .fc .ebig{font-size:clamp(18px,3.4vh,34px)}
.prow .fc .ewhy{font-size:clamp(12px,2vh,19px)}
.prow .fc .ename{font-size:clamp(11px,1.6vh,15px)}
.prow .c3.dim{opacity:.4;filter:grayscale(.6)}
/* 2026-09-26 使用者：選了一張卻看不到任何回饋 ➜ 原因：進場動畫 pkIn（fill both）把翻面的 rotateY 蓋掉了。
   翻開以後把動畫拿掉，卡片才真的翻過來；另外下面再用最大的字寫「你拿到：…」 */
.prow .c3.flip{animation:none;transform:rotateY(180deg)}
.pres{display:flex;flex-direction:column;align-items:center;gap:4px;min-height:1em;text-align:center}
.pres .pb{font-size:clamp(40px,8.4vh,84px);font-weight:700;color:var(--gold);line-height:1.05;
 text-shadow:0 0 30px rgba(255,210,74,.6);animation:gIn .55s cubic-bezier(.2,1.6,.4,1)}
.pres .pw{font-size:clamp(22px,4vh,40px);color:#fff;font-weight:700;animation:gIn .55s ease .15s both}
.prow .c3.mine .fc.ft{box-shadow:0 0 0 5px #fff,0 0 80px var(--pcg)}
@keyframes pkIn{from{opacity:0;transform:translateY(40px) scale(.7)}to{opacity:1;transform:none}}
/* 答對的加分視窗：✅ ＋880 一眼看完，下面一排圖示算式 */
#gain{background:rgba(0,0,0,.6)}
.gbox{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.2vh,14px);
 background:radial-gradient(circle at 50% 0%,#12361F,#040C07 75%);border:3px solid var(--ok);border-radius:30px;
 padding:clamp(14px,2.6vh,30px) clamp(24px,4vw,56px);box-shadow:0 0 70px rgba(57,217,138,.35);
 animation:gIn .5s cubic-bezier(.2,1.5,.4,1)}
@keyframes gIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:none}}
.gbox .gok{font-size:clamp(48px,9vh,90px);line-height:1}
.gbox .gnum{font-size:clamp(64px,14vh,140px);font-weight:700;color:var(--gold);line-height:1;text-shadow:0 0 36px rgba(255,210,74,.55)}
.geq{display:flex;align-items:center;gap:clamp(6px,1vw,14px);flex-wrap:wrap;justify-content:center}
.geq span{display:flex;flex-direction:column;align-items:center;gap:0;font-size:clamp(22px,4.2vh,42px);font-weight:700;color:#fff;
 background:#0A1A10;border:1px solid #1F4A2E;border-radius:14px;padding:.12em .4em;opacity:0;animation:gPart .4s ease forwards}
.geq span.m{color:var(--gold);border-color:#6B5714;background:#1A1506}
.geq span b{font-weight:700;white-space:nowrap}
.geq span em{font-style:normal;font-size:.5em;color:#BFE8CF;letter-spacing:.04em;white-space:nowrap}
.gbox .gtot{font-size:clamp(20px,3.6vh,36px);color:#fff;font-weight:700}
.gbox .gtot b{color:var(--gold);font-size:1.3em}
.geq i{font-style:normal;color:#5E7A68;font-size:clamp(18px,3.2vh,32px)}
@keyframes gPart{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.gbar{width:min(70vw,440px);height:clamp(12px,2vh,20px);background:#10281A;border-radius:99px;overflow:hidden}
.gbar i{display:block;height:100%;background:linear-gradient(90deg,#F5B301,#39D98A);border-radius:99px;
 transform-origin:left;animation:gBar .8s ease-out both}
@keyframes gBar{from{transform:scaleX(0)}to{transform:none}}
/* 驚喜卡翻開：卡片上的圖示炸滿整個畫面（八種炸法 ✕ 四種顏色，只動 transform／opacity）*/
#burst{position:fixed;inset:0;z-index:61;pointer-events:none;overflow:hidden}
#burst i{position:absolute;left:50%;top:45%;font-style:normal;line-height:1;will-change:transform,opacity;
 font-size:var(--z,44px);animation:var(--a) var(--d,1.9s) cubic-bezier(.2,.8,.3,1) var(--w,0s) both}
#burst b{position:absolute;left:50%;top:45%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;
 border:4px solid var(--pc,#FFD24A);animation:bRing 1s ease-out both}
@keyframes bRing{from{transform:scale(.2);opacity:.9}to{transform:scale(16);opacity:0}}
@keyframes bBoom{0%{transform:translate(-50%,-50%) scale(.2);opacity:0}12%{opacity:1}
 100%{transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(1.2) rotate(var(--r));opacity:0}}
@keyframes bRain{0%{transform:translate(calc(-50% + var(--x)),-60vh) rotate(0);opacity:0}10%{opacity:1}
 100%{transform:translate(calc(-50% + var(--x)),75vh) rotate(var(--r));opacity:.2}}
@keyframes bRise{0%{transform:translate(calc(-50% + var(--x)),70vh) scale(.6);opacity:0}15%{opacity:1}
 100%{transform:translate(calc(-50% + var(--x)),-55vh) scale(1.3);opacity:0}}
@keyframes bSpin{0%{transform:translate(-50%,-50%) rotate(0) translateX(0) scale(.3);opacity:0}15%{opacity:1}
 100%{transform:translate(-50%,-50%) rotate(var(--r)) translateX(var(--x)) scale(1.1);opacity:0}}
@keyframes bSpiral{0%{transform:translate(-50%,-50%) rotate(0) translateX(0) scale(.2);opacity:0}20%{opacity:1}
 100%{transform:translate(-50%,-50%) rotate(calc(var(--r) * 2)) translateX(var(--x)) scale(1.4);opacity:0}}
@keyframes bFount{0%{transform:translate(-50%,40vh) scale(.4);opacity:0}15%{opacity:1}
 55%{transform:translate(calc(-50% + var(--x) * .6),calc(-30vh + var(--y) * .2)) scale(1.1)}
 100%{transform:translate(calc(-50% + var(--x)),50vh) rotate(var(--r));opacity:0}}
@keyframes bZoom{0%{transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(0);opacity:0}
 40%{transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(2.4);opacity:1}
 100%{transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(.2);opacity:0}}
@keyframes bWave{0%{transform:translate(-60vw,calc(-50% + var(--y))) rotate(0);opacity:0}15%{opacity:1}
 50%{transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y) - 8vh)) rotate(var(--r))}
 100%{transform:translate(60vw,calc(-50% + var(--y))) rotate(0);opacity:0}}
#stage.quake{animation:quake .5s}
@keyframes quake{0%,100%{transform:none}20%{transform:translate(-7px,3px)}40%{transform:translate(6px,-4px)}
 60%{transform:translate(-4px,2px)}80%{transform:translate(3px,-1px)}}

/* 魔王技能：壞事用紅色橫幅，不要跟金色的驚喜卡混在一起
   （驚喜卡只給好事，學生才分得出來哪一個是獎勵）*/
#bad{position:fixed;left:50%;top:26%;transform:translate(-50%,-50%) scale(.7);z-index:59;
 opacity:0;pointer-events:none;text-align:center;
 background:#1A0A0A;border:2px solid var(--no);border-radius:20px;
 padding:clamp(10px,1.9vh,20px) clamp(16px,2.8vw,36px);box-shadow:0 0 50px rgba(255,94,94,.25)}
#bad.on{animation:badIn 1.9s cubic-bezier(.2,.9,.3,1.2)}
#bad .bt{font-size:clamp(18px,3.2vh,32px);font-weight:700;color:var(--no)}
#bad .bd{font-size:clamp(12.5px,2vh,18px);color:var(--body);margin-top:4px}
@keyframes badIn{0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}
 14%{opacity:1;transform:translate(-50%,-50%) scale(1.07)}
 22%{transform:translate(-50%,-50%) scale(1)}
 78%{opacity:1;transform:translate(-50%,-50%) scale(1)}
 100%{opacity:0;transform:translate(-50%,-80%) scale(.92)}}

/* 分數跳動 ＋ 飄上去的「＋850」：學生看得到分數是「現在」加上去的 */
#gsc.bump{animation:bump .5s cubic-bezier(.2,.9,.3,1.4)}
@keyframes bump{0%{transform:scale(1)}45%{transform:scale(1.45);color:var(--gold)}
 100%{transform:scale(1)}}
#gpop{position:absolute;right:0;top:-2px;font-size:clamp(15px,2.5vh,24px);font-weight:700;
 color:var(--gold);opacity:0;pointer-events:none}
#gpop.on{animation:gpop 1.15s cubic-bezier(.2,.9,.3,1.2)}
@keyframes gpop{0%{opacity:0;transform:translateY(6px) scale(.8)}
 25%{opacity:1;transform:translateY(-10px) scale(1.15)}
 70%{opacity:1;transform:translateY(-22px) scale(1)}
 100%{opacity:0;transform:translateY(-38px) scale(1)}}

/* 得分算式：為什麼是這個分數，一眼看完（使用者 2026-09-21 指定） */
.calc{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
 gap:clamp(4px,.8vw,9px);margin-top:3px}
.calc .ci{display:flex;flex-direction:column;align-items:center;line-height:1.15;
 background:#0C0C0C;border:1px solid #242424;border-radius:12px;
 padding:clamp(3px,.6vh,7px) clamp(7px,1vw,13px)}
.calc .ci em{font-style:normal;font-size:clamp(10px,1.5vh,13px);color:#7E8A94;letter-spacing:.04em}
.calc .ci b{font-size:clamp(15px,2.5vh,24px);color:var(--fg)}
.calc .ci.sp b{color:var(--be)}
.calc .ci.tot{background:#0F3323;border-color:var(--ok)}
.calc .ci.tot b{color:var(--ok);font-size:clamp(19px,3.2vh,32px)}
.calc .cp{font-size:clamp(14px,2.2vh,21px);color:#6E6E6E;font-weight:700}
.spbar{width:min(100%,420px);height:clamp(9px,1.5vh,14px);background:#141414;
 border:1px solid #262626;border-radius:999px;overflow:hidden;margin-top:5px}
.spbar i{display:block;height:100%;background:linear-gradient(90deg,#F5B301,#39D98A);
 border-radius:999px}
.sphint{font-size:clamp(10.5px,1.6vh,14px);color:#7E8A94;letter-spacing:.04em;margin-top:2px}

/* ── 遊戲場 ── */
#arena{display:none;flex-direction:column;align-items:center;gap:clamp(8px,1.5vh,16px);
 width:100%;max-width:1080px;margin:0 auto}
#arena.on{display:flex}
.qh{font-size:clamp(25px,5vh,50px);font-weight:700;text-align:center;line-height:1.3;max-width:26ch}
.qs{font-size:clamp(17px,2.8vh,28px);color:var(--acc);text-align:center}
.qbig{font-size:clamp(30px,6.6vh,66px);font-weight:700;text-align:center;line-height:1.2}
.qzh{font-size:clamp(19px,3.2vh,32px);color:var(--acc);text-align:center}
.tagline{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.tg{font-size:clamp(11px,1.65vh,14px);letter-spacing:.08em;color:var(--acc);
 border:1px solid #2C3A48;border-radius:999px;padding:3px 11px}
.tg.hot{color:var(--gold);border-color:#5A4A18;background:#1A1508;font-weight:700}
/* 「再答對 N 題就開驚喜卡」：學生一直看得到下一張卡離自己多遠 ＝ 期待感 */
.tg.go{color:#FFE9A8;border-color:#6B5714;background:#14100A;font-weight:700}
.tg.go.near{animation:tgn 1.1s infinite}
@keyframes tgn{0%,100%{box-shadow:0 0 0 0 rgba(255,210,74,0)}
 50%{box-shadow:0 0 0 4px rgba(255,210,74,.22)}}

.opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(7px,1.2vh,13px);width:100%}
.opts.one{grid-template-columns:1fr}
.o{display:flex;align-items:center;gap:clamp(7px,1.2vw,14px);text-align:left;
 background:#0C0C0C;border:1px solid #262626;border-radius:15px;color:var(--fg);
 font-size:clamp(20px,3.8vh,38px);font-weight:700;line-height:1.25;
 padding:clamp(8px,1.5vh,16px) clamp(11px,1.7vw,22px);min-height:clamp(56px,9vh,92px)}
.o .sh{flex:0 0 auto;width:1.25em;text-align:center;font-size:.82em}
.o.s0 .sh{color:#FF5E5E}.o.s1 .sh{color:#F5B301}.o.s2 .sh{color:#39D98A}.o.s3 .sh{color:#5AA9FF}
.o:active{transform:scale(.985)}
.o.ok{background:#0F3323;border-color:var(--ok)}
.o.bad{background:#3A1111;border-color:var(--no)}
.o.dim{opacity:.3}

/* 兩顆大按鈕（他／她、問句／直述句） */
.duo{display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,1.5vw,18px);width:100%}
.dbtn{border-radius:20px;border:2px solid #2A2A2A;background:#0A0A0A;color:var(--fg);
 min-height:clamp(84px,15vh,150px);display:flex;flex-direction:column;align-items:center;
 justify-content:center;gap:5px;font-size:clamp(24px,4.4vh,44px);font-weight:700}
.dbtn .ds{font-size:clamp(12px,1.9vh,17px);color:var(--dim);font-weight:400}
.dbtn.he{border-color:var(--he)}.dbtn.he.fill{background:var(--he)}
.dbtn.she{border-color:var(--she)}.dbtn.she.fill{background:var(--she)}
.dbtn.st{border-color:#3A6E52}.dbtn.qu{border-color:#3A5A7E}
.dbtn:active{transform:scale(.97)}
.dbtn.ok{background:#0F3323;border-color:var(--ok)}
.dbtn.bad{background:#3A1111;border-color:var(--no)}

/* 語序／火眼金睛的字塊 */
.chips{display:flex;flex-wrap:wrap;gap:clamp(6px,1vw,11px);justify-content:center;width:100%}
.cw{background:#111;border:1px solid #2C2C2C;border-radius:13px;color:var(--fg);
 font-size:clamp(22px,4.2vh,42px);font-weight:700;
 padding:clamp(7px,1.3vh,14px) clamp(11px,1.6vw,22px)}
.cw:active{transform:scale(.95)}
.cw.used{opacity:.18;pointer-events:none}
.cw.ok{background:#0F3323;border-color:var(--ok)}
.cw.bad{background:#3A1111;border-color:var(--no);animation:shake .4s}
.slotline{display:flex;flex-wrap:wrap;gap:clamp(5px,.9vw,10px);justify-content:center;
 min-height:clamp(46px,7vh,72px);align-items:center;width:100%;
 border-bottom:2px dashed #272727;padding-bottom:clamp(6px,1.1vh,12px)}
.slotline .cw{background:#1A2430;border-color:#39536E}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}
 50%{transform:translateX(7px)}75%{transform:translateX(-4px)}}

/* 記憶配對 */
.board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(6px,1.1vw,12px);width:100%}
.mc{min-height:clamp(62px,11vh,116px);border-radius:15px;border:1px solid #2A2A2A;background:#0C0C0C;
 color:var(--fg);font-size:clamp(16px,2.8vh,27px);font-weight:700;line-height:1.25;
 display:flex;align-items:center;justify-content:center;text-align:center;padding:6px;
 transition:transform .22s,background .2s,opacity .3s}
.mc.back{background:#151B22;color:#3E4C5A;font-size:clamp(20px,3.4vh,32px)}
.mc.ok{background:#0F3323;border-color:var(--ok)}
.mc.bad{background:#3A1111;border-color:var(--no)}
.mc.gone{opacity:0;pointer-events:none;transform:scale(.6)}
.mc:active{transform:scale(.96)}

/* 魔王血條 */
#boss{display:flex;flex-direction:column;align-items:center;gap:6px;width:100%;max-width:640px}
#bossface{font-size:clamp(34px,6.4vh,64px);line-height:1}
#bossface.hit{animation:hit .4s}
@keyframes hit{0%,100%{transform:none}30%{transform:translateX(-10px) rotate(-7deg)}
 60%{transform:translateX(8px) rotate(6deg)}}
#hpbar{width:100%;height:clamp(13px,2.1vh,20px);background:#1A1A1A;border-radius:999px;overflow:hidden;
 border:1px solid #2A2A2A}
#hp{height:100%;width:100%;background:linear-gradient(90deg,#FF5E5E,#FF9A4A);
 transition:width .45s cubic-bezier(.2,.8,.3,1)}

/* 回饋 */
#gfb{min-height:clamp(40px,6.6vh,64px);display:flex;flex-direction:column;align-items:center;
 justify-content:center;gap:3px;text-align:center;width:100%}
#gfb .fh{font-size:clamp(16px,2.7vh,26px);font-weight:700}
#gfb .fh.ok{color:var(--ok)}#gfb .fh.no{color:var(--no)}
#gfb .fw{font-size:clamp(13px,2.05vh,19px);color:var(--body);line-height:1.45;max-width:40ch}
#gfb .fw b{color:var(--gold)}

/* 結算 */
#gend{display:none;flex-direction:column;align-items:center;gap:clamp(7px,1.4vh,14px);
 text-align:center;width:100%;max-width:760px;margin:0 auto}
#gend.on{display:flex}
#gend h2{margin:0;font-size:clamp(23px,4.4vh,42px)}
#gend .sc{font-size:clamp(38px,7.4vh,76px);font-weight:700;color:var(--gold);line-height:1}
#gend .ln{font-size:clamp(13px,2.15vh,20px);color:var(--dim)}
#gend .rev{width:100%;text-align:left;background:#0A0A0A;border:1px solid #232323;border-radius:14px;
 padding:clamp(9px,1.6vh,16px);max-height:34vh;overflow-y:auto}
#gend .rev div{font-size:clamp(16px,2.6vh,24px);color:var(--body);line-height:1.55;
 padding:4px 0;border-bottom:1px solid #161616}
#gend .rev b{color:var(--gold)}
.big{background:var(--btn);border:1px solid var(--line);border-radius:15px;color:var(--fg);
 font-size:clamp(15px,2.5vh,24px);font-weight:700;padding:clamp(9px,1.7vh,17px) clamp(16px,2.6vw,32px)}
.big.go{background:#123A26;border-color:var(--ok);color:#EAFFF3}
.big:active{transform:scale(.97)}
.rowbtn{display:flex;gap:clamp(7px,1.3vw,14px);flex-wrap:wrap;justify-content:center}
/* ⏳ 每一個遊戲 5 分鐘（使用者 2026-09-25 指定） */
#gclock{font-size:clamp(22px,4vh,40px);font-weight:700;color:var(--fg);font-variant-numeric:tabular-nums}
#gclock.warn{color:var(--be)}#gclock.dang{color:var(--no);animation:thump .6s infinite}
#gring.frz #gfg{stroke:#8FD8FF}#gring.frz #gnum{color:#8FD8FF}
.tg{font-size:clamp(13px,2.1vh,19px)}
.hintl{font-size:clamp(17px,2.9vh,28px);color:var(--gold);background:#1A1508;border:1px solid #5A4A18;
 border-radius:14px;padding:4px 16px;text-align:center}
.o.cut{visibility:hidden}
.o.cutting{animation:cutAway .7s ease forwards}
@keyframes cutAway{0%{opacity:1}40%{transform:rotate(-4deg) scale(1.03)}100%{opacity:0;transform:translateY(20px) scale(.8)}}
`;

const JS = `
var BANK=__BANK__, META=__META__, SURP=__SURP__;${DUO9 ? '\nvar LAB9=' + LAB9 + ';' : ''}
var DUOV=${OTHER2};
var SHAPE=['▲','◆','●','■'];
var QT=15, GT=300;                    /* 每一題 15 秒；每一個遊戲 5 分鐘（使用者 2026-09-25 指定） */
var OPTG={g1:1,g4:1,g5:1,g8:1,g10:1}; /* 有四個選項的遊戲（驚喜卡「刪掉錯的選項」只給它們） */
var g=null,queue=[],cur=null,left=QT,qt=QT,tick=null,score=0,streak=0,best=0,right=0,wrong=0;
var asked=0,speedSum=0,shield=0,timeAdd=0,opened=[],lastGain=0;
var mult=1,multLeft=0,fastV=0,cutNext=0,hintNext=0,goldNext=0,freezeNext=0,frozenTo=0,combo=null;
var wrongList=[],busy=false,memPairs=[],memOpen=[],memLeft=0;
var bossHP=100,bossMax=100,bossShield=0;
var gLeft=GT,gTick=null,gPause=0,ended=false;
var pool=[];
var PICK=null;   /* 學生按了什麼（答錯的獨立頁要用） */

var R=2*Math.PI*46;$('#gfg').setAttribute('stroke-dasharray',R);

/* ══ 驚喜卡（使用者 2026-09-25 指定改版）══════════════════════════════
   連續答對 3 題才翻一張。70% 直接翻一張；30% 自己選：二選一 12%、三選一 9%、四選一 6%、五選一 3%。
   卡片上最大的那一行 ＝ 你拿到什麼（eBig），下面一行 ＝ 會發生什麼事（eWhy），都從效果直接算出來。
   只給好事，沒有銘謝惠顧、沒有扣分。 */
function vOf(e){return e.k==='lucky'?(e.got||0):e.v}
function eBig(e){
  var v=e.v;
  if(e.k==='pts')return '＋'+v+' 分';
  if(e.k==='lucky')return '🧧 ＋'+(e.got||0);
  if(e.k==='now')return '這一題 ✕ '+v;
  if(e.k==='mul')return '分數 ✕ '+v[0];
  if(e.k==='time')return '⏰ ＋'+v+' 秒';
  if(e.k==='cut')return '✂️ 刪 '+v+' 個';
  if(e.k==='shield')return '🛡 免死金牌';
  if(e.k==='combo')return '🔗 連對 '+v[0]+' ➜ ✕ '+v[1];
  if(e.k==='hint')return '💡 送你提示';
  if(e.k==='gold')return '🏅 黃金題';
  if(e.k==='fast')return '🎯 快答 ＋'+v;
  if(e.k==='streak')return '🔥 連對 ＋'+v;
  if(e.k==='freeze')return '❄️ 凍結 '+v+' 秒';
  return '';
}
function eWhy(e){
  var v=e.v;
  if(e.k==='pts')return '分數直接加上去';
  if(e.k==='lucky')return '神秘紅包打開了';
  if(e.k==='now')return lastGain+' ✕ '+v+' ＝ '+(lastGain*v);
  if(e.k==='mul')return '接下來 '+v[1]+' 題都 ✕ '+v[0];
  if(e.k==='time')return '下一題多 '+v+' 秒';
  if(e.k==='cut')return '下一題少 '+v+' 個錯的選項';
  if(e.k==='shield')return '下一次答錯不算錯';
  if(e.k==='combo')return '連對 '+v[0]+' 題，第 '+(v[0]+1)+' 題 ✕ '+v[1];
  if(e.k==='hint')return '下一題先看到提示';
  if(e.k==='gold')return '下一題答對 ＋'+v;
  if(e.k==='fast')return '下一題 5 秒內答對';
  if(e.k==='streak')return '連對數字直接加上去';
  if(e.k==='freeze')return '下一題前 '+v+' 秒，時間不動';
  return '';
}
function doEvt(e){
  var v=e.v;
  if(e.k==='pts'){score+=v;popScore(v)}
  else if(e.k==='lucky'){score+=e.got;popScore(e.got)}
  else if(e.k==='now'){var add=lastGain*(v-1);score+=add;popScore(add)}
  else if(e.k==='mul'){mult=v[0];multLeft=v[1]}
  else if(e.k==='time')timeAdd+=v;        /* 下一題開始時才加得到 */
  else if(e.k==='cut')cutNext=v;
  else if(e.k==='shield')shield=1;
  else if(e.k==='combo')combo={need:v[0],mul:v[1],n:0};
  else if(e.k==='hint')hintNext=1;
  else if(e.k==='gold')goldNext=v;
  else if(e.k==='fast')fastV=v;
  else if(e.k==='streak'){streak+=v;if(streak>best)best=streak}
  else if(e.k==='freeze')freezeNext=v;
}
/* 神秘紅包：翻開那一刻才決定幾分（10 分一跳） */
function roll(e){var c={};for(var k in e)c[k]=e[k];
  if(c.k==='lucky')c.got=c.v[0]+Math.round(Math.random()*(c.v[1]-c.v[0])/10)*10;return c}
function draw1(){if(!pool.length)pool=shuf((SURP[g]||[]).slice());return pool.shift()}
function cardHTML(e,big){
  var em=String(e.t).split(' ')[0], nm=String(e.t).split(' ').slice(1).join(' ');
  return '<div class="c3 p'+e.fx[1]+'"><div class="fc bk"><span class="bi">🎁</span><span class="bl">驚喜卡</span></div>'+
   '<div class="fc ft"><div class="eic">'+em+'</div><div class="ebig">'+eBig(e)+'</div>'+
   '<div class="ewhy">'+eWhy(e)+'</div><div class="ename">'+nm+'</div></div></div>';
}
/* 翻一張：卡背抖一抖 ➜ 翻開的那一刻效果才生效、炸滿畫面 ➜ 收起來 ➜ done() */
function fire(done){
  var e=draw1();if(!e){if(done)done();return}
  e=roll(e);
  gPause++;
  var box=$('#evt');box.innerHTML=cardHTML(e);box.classList.add('on');
  var c=$('.c3',box);c.classList.add('shake');sWow();
  setTimeout(function(){c.classList.remove('shake');c.classList.add('flip')},900);
  setTimeout(function(){opened.push(e.t);doEvt(e);paint();burst(e)},1300);
  setTimeout(function(){box.classList.remove('on');box.innerHTML='';gPause=Math.max(0,gPause-1);if(done&&!ended)done()},3900);
}
/* 自己選一張（二～五選一）：選到的那張翻開生效，其他張也翻開給你看（變暗），沒選到的放回牌堆 */
function pickN(n,done){
  var cs=[];for(var k=0;k<n;k++){var e=draw1();if(e&&cs.indexOf(e)<0)cs.push(roll(e))}
  if(cs.length<2){if(cs[0])pool.unshift(cs[0]);fire(done);return}
  gPause++;
  var box=$('#pick');
  box.innerHTML='<div class="pbox"><h2>🎁 '+cs.length+' 選 1！選一張</h2><div class="prow">'+
    cs.map(function(e,k){return cardHTML(e).replace('class="c3','data-k="'+k+'" style="animation-delay:'+(k*0.12).toFixed(2)+'s" class="c3')}).join('')+'</div><div class="pres"></div></div>';
  box.classList.add('on');sWow();
  var got=false;
  $$('.prow .c3',box).forEach(function(el){el.addEventListener('click',function(){
    if(got)return;got=true;
    var k=parseInt(el.getAttribute('data-k'),10), e=cs[k];
    el.classList.add('flip','mine');
    setTimeout(function(){opened.push(e.t);doEvt(e);paint();burst(e);
      var pr=$('.pres',box);if(pr)pr.innerHTML='<div class="pb">🎉 '+eBig(e)+'</div><div class="pw">'+eWhy(e)+'</div>'},450);
    setTimeout(function(){$$('.prow .c3',box).forEach(function(x){if(x!==el){x.classList.add('flip','dim')}})},1300);
    cs.forEach(function(x,j){if(j!==k){for(var q=0;q<(SURP[g]||[]).length;q++)if(SURP[g][q].t===x.t){pool.push(SURP[g][q]);break}}});
    setTimeout(function(){box.classList.remove('on');box.innerHTML='';gPause=Math.max(0,gPause-1);if(done&&!ended)done()},4600);
  })});
}
function surprise(done){
  var r=Math.random(), n=r<0.70?1:(r<0.82?2:(r<0.91?3:(r<0.97?4:5)));
  if(n===1)fire(done);else pickN(n,done);
}
/* 翻開的那一刻：卡片上的圖示炸滿整個畫面；八種炸法 ✕ 四種顏色，每一張卡都不一樣 */
var BK=['bBoom','bRain','bRise','bSpin','bSpiral','bFount','bZoom','bWave'];
var PC=['#FFD24A','#5AD1FF','#FF7EB6','#8CF08A'];
function burst(e){
  if(document.body.classList.contains('reduce'))return;
  var bx=document.getElementById('burst');if(!bx)return;
  var em=String(e.t).split(' ')[0], kind=BK[e.fx[0]], h='<b style="--pc:'+PC[e.fx[1]]+'"></b>';
  for(var n=0;n<24;n++){
    var x,y=(Math.random()*60-30)+'vh',r=(Math.random()*720-360)+'deg',w=(Math.random()*.35).toFixed(2)+'s';
    if(kind==='bBoom'||kind==='bZoom'){var a=Math.random()*6.283,d=16+Math.random()*34;x=Math.cos(a)*d+'vw';y=Math.sin(a)*d+'vh'}
    else if(kind==='bSpin'||kind==='bSpiral'){x=(12+Math.random()*30)+'vw';r=(n*33+180)+'deg'}
    else x=(Math.random()*96-48)+'vw';
    h+='<i style="--a:'+kind+';--x:'+x+';--y:'+y+';--r:'+r+';--w:'+w+';--z:'+(34+Math.round(Math.random()*50))+'px">'+em+'</i>';
  }
  bx.innerHTML=h;
  var st=document.getElementById('stage');st.classList.remove('quake');void st.offsetWidth;st.classList.add('quake');
  clearTimeout(burst.t);
  burst.t=setTimeout(function(){bx.innerHTML='';st.classList.remove('quake')},2600);
}
/* 分數是「現在」加上去的：數字跳一下，旁邊飄一個 ＋850 上去 */
function popScore(v){
  var el=$('#gpop');if(el){el.textContent='＋'+v;
    el.classList.remove('on');void el.offsetWidth;el.classList.add('on')}
  var sc=$('#gsc');if(sc){sc.classList.remove('bump');void sc.offsetWidth;sc.classList.add('bump')}
}
/* 答對的加分視窗：✅ ＋880，下面一排圖示算式；字大、字少（使用者 2026-09-25 指定） */
function showGain(d,done){
  var box=$('#gain');
  /* 2026-09-26 使用者：看不懂圖示 ➜ 每一格下面一行短短的字 */
  var P=function(ic,v,t,m){return '<span'+(m?' class="m"':'')+'><b>'+ic+' '+v+'</b><em>'+t+'</em></span>'};
  var parts=P('✅',100,'答對')+'<i>＋</i>'+P('⚡',d.sp,'速度快')+(d.st?'<i>＋</i>'+P('🔥',d.st,'連對 '+streak+' 題'):'')+
    (d.mul>1?'<i>✕</i>'+P('🎁',d.mul,'驚喜卡倍數',1):'')+(d.extra?'<i>＋</i>'+P(d.extraIc,d.extra,'驚喜卡獎勵',1):'');
  box.innerHTML='<div class="gbox"><div class="gok">✅</div><div class="gnum" id="gnumv">＋0</div>'+
    '<div class="geq">'+parts+'</div><div class="gbar"><i style="width:'+Math.max(4,Math.round(100*d.pct))+'%"></i></div>'+
    '<div class="gtot">🏆 總分 <b>'+score+'</b></div></div>';
  $$('.geq span',box).forEach(function(x,k){x.style.animationDelay=(0.15+k*0.14).toFixed(2)+'s'});
  box.classList.add('on');gPause++;
  var t0=Date.now(), el=$('#gnumv');
  var step=function(){var k=Math.min(1,(Date.now()-t0)/650);if(el)el.textContent='＋'+Math.round(d.p*k);if(k<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
  setTimeout(function(){box.classList.remove('on');box.innerHTML='';gPause=Math.max(0,gPause-1);if(done&&!ended)done()},d.short?1300:2200);
}

/* ── 大廳 ── */
function hub(){
  stop();gStop();missHide(false);lookHide();ended=true;
  var ma=document.getElementById('missAll');if(ma)ma.classList.remove('on');
  ['#evt','#pick','#gain'].forEach(function(s){var x=$(s);x.classList.remove('on');x.innerHTML=''});gPause=0;
  $('#hub').style.display='';$('#ghud').classList.remove('on');
  $('#arena').classList.remove('on');$('#gend').classList.remove('on');
  $('#stage').classList.remove('lock');
  $('#grid').innerHTML=META.map(function(m,n){
    var b=store('best_'+m.id)||0;
    return '<button class="gcard" data-g="'+m.id+'"><span class="gn">'+(n+1)+'</span>'+
      '<span class="gi">'+m.ic+'</span><span class="gt">'+m.name+'</span>'+
      '<span class="gr">'+m.rule+'</span>'+
      '<span class="gb">⏳ 5 分鐘　🎁 '+m.st+' ${NS} 張'+
      (b?'　最佳 <b>'+b+'</b>':'')+'</span></button>';
  }).join('');
}
$('#grid').addEventListener('click',function(e){
  var c=e.target.closest?e.target.closest('.gcard'):null;
  if(c)begin(c.getAttribute('data-g'));
});

/* ── 開一場 ── */
function begin(id){
  g=id;ended=false;
  score=0;streak=0;best=0;right=0;wrong=0;mult=1;multLeft=0;fastV=0;wrongList=[];busy=false;
  asked=0;speedSum=0;shield=0;timeAdd=0;opened=[];lastGain=0;pool=shuf((SURP[id]||[]).slice());
  cutNext=0;hintNext=0;goldNext=0;freezeNext=0;frozenTo=0;combo=null;
  left=QT;qt=QT;
  bossHP=bossMax=100;bossShield=0;
  memLeft=0;memOpen=[];memPairs=[];MISSLOG=[];missHide(false);
  queue=shuf(BANK[id].slice());
  $('#hub').style.display='none';$('#ghud').classList.add('on');
  $('#arena').classList.add('on');$('#gend').classList.remove('on');
  var m=META.filter(function(x){return x.id===id})[0];
  $('#gname').textContent=m.ic+' '+m.name;
  gStart();
  next();
}
/* ⏳ 一場 5 分鐘：答錯分析頁也照算（驚喜卡、加分視窗的動畫時間不算） */
function gStart(){gStop();gLeft=GT;gPause=0;gPaint();
  gTick=setInterval(function(){if(ended)return;if(!gPause){gLeft-=0.1;if(gLeft<=0){gLeft=0;gPaint();timeOver();return}}gPaint()},100)}
function gStop(){if(gTick){clearInterval(gTick);gTick=null}}
function gPaint(){var c=$('#gclock');if(!c)return;var s=Math.ceil(gLeft);
  c.textContent='⏳ '+Math.floor(s/60)+':'+('0'+(s%60)).slice(-2);
  c.className=gLeft<=30?'dang':(gLeft<=60?'warn':'')}
function timeOver(){
  if(ended)return;
  stop();gStop();missHide(false);lookHide();
  ['#evt','#pick','#gain'].forEach(function(s){var x=$(s);x.classList.remove('on');x.innerHTML=''});gPause=0;
  over('⏰ 5 分鐘到！');
}
/* 每一題自己的倒數：時間到就算答錯；❄️ 凍結的那幾秒不會少 */
function run(sec){
  if(tick)clearInterval(tick);
  qt=Math.max(5,(sec||QT)+timeAdd);timeAdd=0;  /* 驚喜卡（或魔王技能）給的秒數在這一題才生效 */
  frozenTo=freezeNext?Date.now()+freezeNext*1000:0;freezeNext=0;
  left=qt;paint();
  tick=setInterval(function(){
    if(gPause)return;
    if(frozenTo&&Date.now()<frozenTo){paint();return}
    left-=0.1;
    if(left<=0){left=0;paint();tstop();timeUp();return}
    if(left<=5&&Math.abs(left-Math.round(left))<0.05)sTick();
    paint();
  },100);
}
function timeUp(){
  if(busy)return;
  if(g==='g6'){busy=true;sNo();streak=0;combo=null;paint();
    $('#gfb').innerHTML='<div class="fh no">⏰ 時間到！</div>';
    asked++;memLeft=0;
    setTimeout(function(){if(!ended){busy=false;next()}},1400);return}
  judge(false,cur?cur.h:'',null,true);
}
function tstop(){if(tick){clearInterval(tick);tick=null}}   /* 只停這一題的倒數 */
function stop(){tstop();sayStop()}                          /* 離開遊戲才連發音一起停 */
function paint(){
  $('#gnum').textContent=Math.ceil(left);
  $('#gfg').setAttribute('stroke-dashoffset',R*(1-left/qt));
  $('#gring').className=(frozenTo&&Date.now()<frozenTo)?'frz':(left<=5?'dang':(left<=8?'warn':''));
  $('#gsc').textContent=score;
  $('#gstreak').textContent=(shield?'🛡 ':'')+(streak?'🔥 '+streak:'—');
  $('#gsurp').textContent='🎁 '+opened.length;
  var t=$('#tagsL');if(t)t.innerHTML=tagsIn();
}

/* ── 出下一題 ── */
function next(){
  if(ended)return;
  busy=false;PICK=null;
  var fb=$('#gfb');if(fb)fb.innerHTML='';   /* 第一題時 #gfb 還沒被畫出來 */
  if(!queue.length)queue=shuf(BANK[g].slice());
  cur=queue.shift();
  ({g1:rMcq,g2:rTwo,g3:rOrder,g4:rTrans,g5:rHear,g6:rMem,g7:rSpot,g8:rFill,g9:rSort,g10:rBoss}[g])();
  /* 驚喜卡的效果：💡 先看到提示、✂️ 刪掉錯的選項 */
  if(hintNext&&cur&&cur.h&&g!=='g6'){hintNext=0;var a=$('#arena'),hl=el('div','hintl','💡 '+ap(cur.h));
    var tl=$('.tagline',a);if(tl&&tl.nextSibling)a.insertBefore(hl,tl.nextSibling);else a.insertBefore(hl,a.firstChild)}
  if(cutNext&&OPTG[g]){var bad=shuf($$('#arena .o[data-ok="false"]')).slice(0,cutNext);cutNext=0;
    bad.forEach(function(b){b.classList.add('cutting');setTimeout(function(){b.classList.remove('cutting');b.classList.add('cut')},700)})}
  run(g==='g6'?QT*4:QT);     /* 記憶配對一局四對，時間比照四題 */
}
/* 標籤：現在身上有什麼好東西、再連對幾題翻驚喜卡（字少、看得懂） */
function tagsIn(){
  var h='', need=3-(streak%3);
  if(multLeft>0)h+='<span class="tg hot">✕'+mult+'　還剩 '+multLeft+' 題</span>';
  if(combo)h+='<span class="tg hot">🔗 '+combo.n+' ／ '+combo.need+' ➜ ✕'+combo.mul+'</span>';
  if(goldNext)h+='<span class="tg hot">🏅 黃金題 ＋'+goldNext+'</span>';
  if(fastV)h+='<span class="tg hot">🎯 5 秒內 ＋'+fastV+'</span>';
  if(shield)h+='<span class="tg hot">🛡 免死金牌</span>';
  h+='<span class="tg go'+(need<=1?' near':'')+'">'+(need<=1?'🎁 再對 1 題就翻卡！':'🎁 再連對 '+need+' 題')+'</span>';
  return h;
}
function tags(extra){
  return '<div class="tagline" id="tagsL">'+tagsIn()+'</div>';
}

/* ── 答錯的獨立頁要的三樣東西：題目、你選的、正確答案（每一種遊戲長得不一樣）── */
function cap1(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function fillBl(txt,w){ /* 把 ___ 填進去；句子開頭的要大寫 */
  return String(txt).replace(/___/g,function(m,off,all){
    var pre=all.slice(0,off);return (/^\\s*$/.test(pre)||/[.?!]\\s*$/.test(pre))?cap1(w):w})}
/* 填空題：b ＝ ___ 表示空格在句子最前面（2026-09-26 修：原本答錯頁會出現「___ Who 's he?」） */
function f8(c,w){return ((c.b==='___'?'':c.b+' ')+w+' '+c.a).replace(/ ([?.,])/g,'$1').replace(/ (['\u2019](s|m|re)\\b)/g,'$1')}
function mInfo(){
  var c=cur||{};
  if(g==='g1'||g==='g10')return {q:c.q,pick:PICK,ans:c.o[0]};
  if(g==='g2')return {q:c.txt+'　'+c.zh,pick:PICK==null?null:fillBl(c.txt,PICK),ans:fillBl(c.txt,c.a)};
  if(g==='g3'){var full=c.s.join(' ').replace(/ ([?.,])/g,'$1').replace(/ ([\u2019']s)/g,'$1');
    return {q:c.zh,pick:PICK,ans:full}}
  if(g==='g4')return {q:c.f+'　'+c.d,pick:PICK,ans:c.o[0]};
  if(g==='g5')return {q:'🔊 聽到的句子是？',pick:PICK,ans:c.o[0]};
  if(g==='g7'){var bad=c.w.join(' ').replace(/ ([?.,])/g,'$1').replace(/ ([\u2019']s)/g,'$1');
    if(c.b<0)return {q:c.zh+'　'+bad,pick:PICK==null?null:('「'+PICK+'」是錯的'),ans:'這一句完全正確 ✅'};
    var ok=c.w.slice();ok[c.b]=c.fix;
    return {q:c.zh+'　'+bad,pick:PICK==null?null:bad,
      ans:ok.join(' ').replace(/ ([?.,])/g,'$1').replace(/ ([\u2019']s)/g,'$1')}}
  if(g==='g8')return {q:c.zh,pick:PICK==null?null:f8(c,PICK),ans:f8(c,c.o[0])};
  if(g==='g9')return {q:c[0],pick:PICK,ans:${DUO9 ? 'LAB9[c[1]]' : "c[1]==='q'?'❓ 問句':'🙋 直述句'"}};
  return {q:'',pick:PICK,ans:''};
}

/* ── 類似題（使用者 2026-09-25 指定）：同一個遊戲的題庫裡，英文字重疊最多、提示一樣的（不含自己）──
   ① 答錯頁的「⭐ 加分」用它出一題字放大的四選一；② 過兩三題再出一題，選項重洗 */
function joinS(a){return a.join(' ').replace(/ ([?.,!])/g,'$1').replace(/ ([’']s)/g,'$1')}
function itxt(c){
  if(g==='g1'||g==='g10')return c.q+' '+c.o[0];
  if(g==='g2')return c.txt+' '+c.a;
  if(g==='g3')return c.s.join(' ');
  if(g==='g4')return c.f+' '+c.o[0];
  if(g==='g5')return c.s+' '+c.o[0];
  if(g==='g7')return c.w.join(' ');
  if(g==='g8')return f8(c,c.o[0]);
  if(g==='g9')return c[0];
  return '';
}
function simsOf(c){return g==='g6'?[]:simRank(c,BANK[g],itxt,function(x){return x.h||x[2]||''})}
function toMcq(c){
  if(g==='g1'||g==='g10')return {q:c.q,o:c.o,h:c.h};
  if(g==='g4')return {q:c.f+'<br>'+c.d,o:c.o,h:c.h};
  if(g==='g5')return {q:'🔊 聽到的是哪一句？',say:c.s,o:c.o,h:c.h};
  if(g==='g8')return {q:(c.b==='___'?'':ap(c.b)+' ')+'<span style="color:var(--be)">＿＿</span> '+ap(c.a)+'<br>'+c.zh,o:c.o,h:c.h};
  if(g==='g2'){var ot=DUOV.filter(function(v){return v!==c.a})[0];
    /* 題目沒有 ___（my father ➜ he／she）：改成整句 ___’s my father. 四選一（2026-09-26） */
    if(!/___/.test(c.txt)){var A=cap1(c.a),O=cap1(ot);
      return {q:c.zh+'（'+c.txt+'）<br>哪一句對？',o:[A+'’s '+c.txt+'.',O+'’s '+c.txt+'.',(c.a==='he'?'His ':'Her ')+c.txt+'.',A+' '+c.txt+'.'],h:c.h}}
    return {q:c.zh+'<br>哪一句對？',o:[fillBl(c.txt,c.a),fillBl(c.txt,ot)],h:c.h}}
  if(g==='g3'){var ok=joinS(c.s),o=[ok],t=0;
    while(o.length<4&&t++<40){var w=c.s.slice(0,-1),p=c.s[c.s.length-1];var x=joinS(shuf(w).concat([/^[?.!]$/.test(p)?p:p]));
      if(o.indexOf(x)<0)o.push(x)}
    return {q:c.zh+'<br>哪一句的順序對？',o:o,h:c.h}}
  if(g==='g7'){var bad=joinS(c.w);
    if(c.b<0){var o7=[bad];BANK.g7.forEach(function(y){if(y!==c&&y.zh===c.zh&&y.b>=0&&o7.length<3)o7.push(joinS(y.w))});
      if(o7.length<2){var w7=c.w.slice(0,-1);o7.push(joinS(shuf(w7).concat(c.w.slice(-1))))}
      return {q:c.zh+'<br>哪一句完全正確？',o:o7,h:c.h}}
    var fix=c.w.slice();fix[c.b]=c.fix;return {q:c.zh+'<br>哪一句完全正確？',o:[joinS(fix),bad],h:c.h}}
  if(g==='g9'&&!${DUO9 ? 1 : 0}){ /* 問句／直述句：四句裡找一句跟它同一種（一句對、三句是另一種） */
    var same=BANK.g9.filter(function(y){return y!==c&&y[1]===c[1]}),diff=shuf(BANK.g9.filter(function(y){return y[1]!==c[1]}));
    if(same.length&&diff.length>=3)return {q:'「'+c[0]+'」是'+(c[1]==='q'?'❓ 問句':'🙋 直述句')+'。<br>哪一句跟它<b>同一種</b>？',
      o:[pick(same)[0]].concat(diff.slice(0,3).map(function(y){return y[0]})),h:c[2]||'',nm:1}}
  if(g==='g9'&&${DUO9 ? 1 : 0}){ /* 在回答哪一題：四個問句選一個 */
    var qs=${DUO9 ? JSON.stringify(DUO9.map(x => x.d.split('　')[1] || '')) : '[]'},ks9=${DUO9 ? JSON.stringify(DUO9.map(x => x.v)) : '[]'};
    var qq=qs[ks9.indexOf(c[1])];
    if(qq)return {q:'「'+c[0]+'」<br>在回答哪一題？',say:c[0],o:[qq].concat(qs.filter(function(x){return x!==qq})),h:c[2]||''}}
  if(g==='g9'){var lab=${DUO9 ? 'LAB9' : "{q:'❓ 問句',s:'🙋 直述句'}"},ks=Object.keys(lab);
    return {q:'「'+c[0]+'」<br>'+(${DUO9 ? "'在回答哪一題？'" : "'是哪一種句子？'"}),say:c[0],
      o:[lab[c[1]]].concat(ks.filter(function(k){return k!==c[1]}).map(function(k){return lab[k]})),h:c[2]||''}}
  return null;
}

/* ── 判定 ──
   愈快答對，分數愈高：答對 100 ＋ 速度分（剩下的秒數 ／ 總秒數 ✕ 900）＋ 連對 ✕ 20，再乘驚喜卡的倍率。
   答對：加分視窗（✅ ＋880 ＋ 圖示算式）➜ 連對到 3 的倍數就翻驚喜卡 ➜ 下一題。
   答錯：錯題分析的獨立頁（倒數 8 秒、唸 3 次、⭐ 加分 ➜ 類似題 ✕2），按「▶ 繼續」才出下一題。 */
function award(sp,short){
  right++;streak++;if(streak>best)best=streak;
  speedSum+=sp;
  var st=streak*20, sub=100+sp+st, mul=1, extra=0, extraIc='';
  if(multLeft>0){mul*=mult;multLeft--;if(!multLeft)mult=1}
  if(combo){combo.n++;if(combo.n>combo.need){mul*=combo.mul;combo=null}}
  if(goldNext){extra+=goldNext;extraIc='🏅';goldNext=0}
  if(fastV){if(qt-left<=5){extra+=fastV;extraIc=extraIc||'🎯'}fastV=0}
  var p=sub*mul+extra;
  score+=p;lastGain=p;sOk();popScore(p);paint();
  return {sp:sp,st:streak>1?st:0,mul:mul,extra:extra,extraIc:extraIc,p:p,pct:left/qt,short:short};
}
function judge(ok,hint,after,timeout){
  if(busy||ended)return;busy=true;
  tstop();
  asked++;
  if(ok){
    var sp0=Math.round(900*(left/qt));
    var fin=function(){
      var d=award(sp0,false);
      var go=function(){if(!ended&&$('#arena').classList.contains('on'))(after||next)()};
      showGain(d,function(){
        if(ended)return;
        if(streak>0&&streak%3===0)surprise(go);else go();
      });
    };
    /* 🔍 火眼金睛：答對也要看 6 秒（正確句子＋逐字中文＋整句翻譯＋自動唸）才得分（使用者 2026-09-26 指定）*/
    if(g==='g7'&&cur){var ok7=cur.w.slice();if(cur.b>=0)ok7[cur.b]=cur.fix;gPause++;
      setTimeout(function(){if(ended){gPause=Math.max(0,gPause-1);return}
        lookShow(joinS(ok7),function(){gPause=Math.max(0,gPause-1);if(!ended)fin()})},450);return}
    fin();
    return;
  }
  var saved=false;
  if(shield){shield=0;saved=true}      /* 🛡 免死金牌：這一次答錯不算錯、連對不斷 */
  else{wrong++;streak=0;combo=null}
  sNo();
  var sims=simsOf(cur);
  /* 過兩三題再出一題類似題（選項每次都重洗），練到會為止 */
  queue.splice(Math.min(queue.length,2+Math.floor(Math.random()*2)),0,sims[1]||sims[0]||cur);
  if(hint&&wrongList.indexOf(hint)<0)wrongList.push(hint);
  paint();
  var mi=mInfo();mi.why=(saved?'🛡 免死金牌：這一次不算錯！　':'')+(hint||'');
  if(timeout)mi.pick=null;
  mi.sims=sims.slice(0,3).map(toMcq).filter(function(x){return x});
  mi.self=cur?toMcq(cur):null;   /* 加分題 ＝ 這一題換個樣子（_miss_rt.js 的 mVar） */
  if(!mi.sims.length&&cur)mi.sim0=toMcq(cur);
  mi.pts=500;
  mi.gain=function(n){score+=n;popScore(n);paint()};
  /* 先讓學生看一眼紅綠（0.5 秒），再蓋上錯題分析頁 */
  setTimeout(function(){
    if(ended||!$('#arena').classList.contains('on'))return;
    missShow(mi,function(){
      if(ended||!$('#arena').classList.contains('on'))return;
      (after||next)();
    });
  },500);
}

/* ── 1 ⚡ 閃電四選一 ── */
function rMcq(){
  var o=shuf(cur.o.map(function(x,n){return{x:x,n:n}}));
  $('#arena').innerHTML=tags('⚡ 閃電')+'<h2 class="qh">'+ap(cur.q)+'</h2>'+
    '<div class="opts">'+o.map(function(t,n){
      return '<button class="o s'+n+'" data-ok="'+(t.n===0)+'" data-t="'+String(t.x).replace(/"/g,'&quot;')+'"><span class="sh">'+SHAPE[n]+
        '</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>'+fbBox();
  bindO();
}
/* ── 2 🔵 他還是她 ── */
function rTwo(){
  $('#arena').innerHTML=tags('${DUO2 ? metaOf('g2').ic + ' ' + metaOf('g2').name : '🔵🩷 他還是她'}')+
    '<div class="qbig">'+ap(cur.txt)+'</div><div class="qzh">'+cur.zh+'</div>'+
    '<div class="duo">'+
${DUO2 ? duoBtns(DUO2) : `     '<button class="dbtn he" data-v="he">He<span class="ds">他　男生</span></button>'+
     '<button class="dbtn she" data-v="she">She<span class="ds">她　女生</span></button>'+`}
    '</div>'+fbBox();
  $$('.dbtn').forEach(function(b){b.addEventListener('click',function(){
    if(busy)return;var ok=b.getAttribute('data-v')===cur.a;
    b.classList.add(ok?'ok':'bad');
    if(!ok)$$('.dbtn').forEach(function(x){if(x.getAttribute('data-v')===cur.a)x.classList.add('ok')});
    PICK=b.getAttribute('data-v');
    ${DUO2 ? 'say(fillBl(cur.txt,cur.a));' : "say(cur.a==='he'?'He':'She');"}judge(ok,cur.h);
  })});
}
/* ── 3 🧩 語序大挑戰 ── */
function rOrder(){
  var need=cur.s,got=[];
  $('#arena').innerHTML=tags('🧩 語序')+'<div class="qzh">'+cur.zh+'</div>'+
    '<div class="slotline" id="slot"></div>'+
    '<div class="chips" id="pool">'+shuf(need.map(function(w,n){return{w:w,n:n}})).map(function(t){
      return '<button class="cw" data-n="'+t.n+'">'+ap(t.w)+'</button>'}).join('')+'</div>'+fbBox();
  $('#pool').addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('.cw'):null;if(!b||busy)return;
    var n=parseInt(b.getAttribute('data-n'),10);
    if(n===got.length){
      got.push(n);b.classList.add('used');sPop();
      var c=el('button','cw',ap(need[n]));$('#slot').appendChild(c);
      var w=need[n];if(/[A-Za-z]/.test(w))say(w);
      if(got.length===need.length){
        $$('#slot .cw').forEach(function(x){x.classList.add('ok')});
        setTimeout(function(){say(need.join(' ').replace(/ ([?.,])/g,'$1'))},260);
        judge(true,'');
      }
    }else{b.classList.add('bad');setTimeout(function(){b.classList.remove('bad')},420);
      /* 你排出來的：前面排對的字 ＋ 你按錯的那一個 */
      PICK=got.map(function(k){return need[k]}).concat([need[n]]).join(' ')
        .replace(/ ([?.,])/g,'$1').replace(/ ([\u2019']s)/g,'$1');
      judge(false,cur.h);}
  });
}
/* ── 4 🔄 變身術 ── */
function rTrans(){
  var o=shuf(cur.o.map(function(x,n){return{x:x,n:n}}));
  $('#arena').innerHTML=tags('🔄 變身術')+
    '<div class="qbig" data-say="'+cur.f.replace(/"/g,'&quot;')+'">'+ap(cur.f)+'</div>'+
    '<div class="qs">'+cur.d+'</div>'+
    '<div class="opts">'+o.map(function(t,n){
      return '<button class="o s'+n+'" data-ok="'+(t.n===0)+'" data-t="'+String(t.x).replace(/"/g,'&quot;')+'"><span class="sh">'+SHAPE[n]+
        '</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>'+fbBox();
  say(cur.f);bindO();
}
/* ── 5 🎧 聽力狙擊 ── */
function rHear(){
  var o=shuf(cur.o.map(function(x,n){return{x:x,n:n}}));
  $('#arena').innerHTML=tags('🎧 聽力狙擊')+
    '<h2 class="qh">聽一聽，射下正確的那一張</h2>'+
    '<button class="big" id="rep">🔊 再聽一次</button>'+
    '<div class="opts">'+o.map(function(t,n){
      return '<button class="o s'+n+'" data-ok="'+(t.n===0)+'" data-t="'+String(t.x).replace(/"/g,'&quot;')+'"><span class="sh">'+SHAPE[n]+
        '</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>'+fbBox();
  $('#rep').addEventListener('click',function(){say(cur.s)});
  setTimeout(function(){say(cur.s)},260);
  bindO();
}
/* ── 6 🃏 記憶配對 ── */
function rMem(){
  if(!memLeft){
    var four=shuf(BANK.g6).slice(0,4);
    memPairs=four;memLeft=4;memOpen=[];
    var cards=[];
    four.forEach(function(p,n){cards.push({k:n,s:p[0],en:1});cards.push({k:n,s:p[1],en:0})});
    cards=shuf(cards);
    $('#arena').innerHTML=tags()+'<div class="qs">翻開兩張，英文配中文</div>'+
      '<div class="board" id="bd">'+cards.map(function(c,n){
        return '<button class="mc back" data-k="'+c.k+'" data-n="'+n+'" data-en="'+c.en+
          '" data-s="'+String(c.s).replace(/"/g,'&quot;')+'">？</button>'}).join('')+'</div>'+fbBox();
    $('#bd').addEventListener('click',memTap);
  }
}
function memTap(e){
  var b=e.target.closest?e.target.closest('.mc'):null;
  if(!b||busy||ended||!b.classList.contains('back')||memOpen.length>=2)return;
  b.classList.remove('back');b.innerHTML=ap(b.getAttribute('data-s'));
  if(b.getAttribute('data-en')==='1')say(b.getAttribute('data-s'));else sayZh(b.getAttribute('data-s'));
  memOpen.push(b);sPop();
  if(memOpen.length===2){
    var a=memOpen[0],c=memOpen[1];
    if(a.getAttribute('data-k')===c.getAttribute('data-k')&&a!==c){
      a.classList.add('ok');c.classList.add('ok');memOpen=[];memLeft--;
      busy=true;
      var d=award(Math.round(900*(left/qt)/4),true);
      var cont=function(){
        busy=false;if(ended)return;
        a.classList.add('gone');c.classList.add('gone');
        if(!memLeft){asked++;paint();tstop();setTimeout(function(){if(!ended){rMem();run(QT*4)}},380)}
      };
      tstop();
      showGain(d,function(){
        if(ended)return;
        var go=function(){if(ended)return;cont();if(memLeft)run(left)};
        if(streak>0&&streak%3===0)surprise(go);else go();
      });
    }else{
      busy=true;a.classList.add('bad');c.classList.add('bad');sNo();
      if(shield)shield=0;else{streak=0;combo=null;wrong++}
      paint();
      setTimeout(function(){[a,c].forEach(function(x){
        x.classList.remove('bad');x.classList.add('back');x.innerHTML='？'});
        memOpen=[];busy=false},780);
    }
  }
}
/* ── 7 🔍 火眼金睛 ── */
function rSpot(){
  $('#arena').innerHTML=tags('🔍 火眼金睛')+'<div class="qzh">'+cur.zh+'</div>'+
    '<div class="chips" id="pool">'+cur.w.map(function(w,n){
      return '<button class="cw" data-n="'+n+'">'+ap(w)+'</button>'}).join('')+'</div>'+
    '<button class="big" id="none">✅ 這句沒錯</button>'+fbBox();
  $('#pool').addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('.cw'):null;if(!b||busy)return;
    var n=parseInt(b.getAttribute('data-n'),10);
    var ok=(n===cur.b);
    b.classList.add(ok?'ok':'bad');
    PICK=cur.w[n];
    judge(ok,cur.b<0?'這一句<b>完全正確</b>，要按「✅ 這句沒錯」。':
      ('錯的是 <b>'+cur.w[cur.b]+'</b> → 要改成 <b>'+cur.fix+'</b>。'+cur.h));
  });
  $('#none').addEventListener('click',function(){
    if(busy)return;
    var ok=(cur.b<0);
    this.classList.add(ok?'ok':'bad');
    PICK='';
    judge(ok,ok?'':('這一句有錯：<b>'+cur.w[cur.b]+'</b> 要改成 <b>'+cur.fix+'</b>。'+cur.h));
  });
}
/* ── 8 ✏️ 填空高手 ── */
function rFill(){
  var o=shuf(cur.o.map(function(x,n){return{x:x,n:n}}));
  $('#arena').innerHTML=tags('✏️ 填空')+
    '<div class="qbig">'+(cur.b==='___'?'':ap(cur.b)+' ')+'<span style="color:var(--be)">＿＿</span> '+ap(cur.a)+'</div>'+
    '<div class="qzh">'+cur.zh+'</div>'+
    '<div class="opts">'+o.map(function(t,n){
      return '<button class="o s'+n+'" data-ok="'+(t.n===0)+'" data-t="'+String(t.x).replace(/"/g,'&quot;')+'"><span class="sh">'+SHAPE[n]+
        '</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>'+fbBox();
  bindO();
}
/* ── 9 🗂 分類大師 ── */
function rSort(){
  $('#arena').innerHTML=tags('🗂 分類')+
    '<div class="qbig" data-say="'+cur[0].replace(/"/g,'&quot;')+'">'+ap(cur[0])+'</div>'+
    '<div class="duo">'+
${DUO9 ? duoBtns(DUO9) : `     '<button class="dbtn st" data-v="s">🙋<span class="ds">直述句　在講一件事</span></button>'+
     '<button class="dbtn qu" data-v="q">❓<span class="ds">問句　在問問題</span></button>'+`}
    '</div>'+fbBox();
  say(cur[0]);
  $$('.dbtn').forEach(function(b){b.addEventListener('click',function(){
    if(busy)return;var ok=b.getAttribute('data-v')===cur[1];
    b.classList.add(ok?'ok':'bad');
${DUO9 ? `    PICK=LAB9[b.getAttribute('data-v')];
    judge(ok,cur[2]||'');` : `    PICK=b.getAttribute('data-v')==='q'?'❓ 問句':'🙋 直述句';
    judge(ok,cur[1]==='q'?'句尾是 <b>?</b>，而且 <b>Is／Who</b> 放在最前面 → <b>問句</b>。':
      '句尾是 <b>.</b>，主詞放最前面 → <b>直述句</b>。');`}
  })});
}
/* ── 10 👑 魔王挑戰 ── */
function rBoss(){
  var o=shuf(cur.o.map(function(x,n){return{x:x,n:n}}));
  var face=bossHP>66?'👹':bossHP>33?'😡':'🥵';
  $('#arena').innerHTML=tags('👑 魔王挑戰')+
    '<div id="boss"><div id="bossface">'+face+'</div>'+
    '<div id="hpbar"><div id="hp" style="width:'+bossHP+'%"></div></div>'+
    '<div class="qs">魔王血量 '+bossHP+'%</div></div>'+
    '<h2 class="qh">'+ap(cur.q)+'</h2>'+
    '<div class="opts">'+o.map(function(t,n){
      return '<button class="o s'+n+'" data-ok="'+(t.n===0)+'" data-t="'+String(t.x).replace(/"/g,'&quot;')+'"><span class="sh">'+SHAPE[n]+
        '</span><span>'+ap(t.x)+'</span></button>'}).join('')+'</div>'+fbBox();
  $('.opts').addEventListener('click',bossTap);
}
function bossTap(e){
  var b=e.target.closest?e.target.closest('.o'):null;if(!b||busy)return;
  var ok=b.getAttribute('data-ok')==='true';
  markO(b,ok);PICK=b.getAttribute('data-t');
  if(ok){
    var dmg=bossShield?5:10;bossShield=0;   /* 打十下倒，一場 12 題打得完 */
    bossHP=Math.max(0,bossHP-dmg);
    $('#hp').style.width=bossHP+'%';
    $('#bossface').classList.add('hit');
    if(bossHP<=0){sWow();stop();setTimeout(win,700);return}
    judge(true,'');
  }else{
    /* 三個技能都是「真的會發生的事」，而且都寫明下一題會怎樣——
       學生看得懂才有壓力，看不懂就只是莫名其妙（使用者 2026-09-21 指定） */
    var sk=pick([
      {t:'🌀 魔王偷時間',d:'下一題只剩 5 秒！',f:function(){timeAdd=-10}},
      {t:'💢 魔王回血 5%',d:'血條又長回去一點了',
       f:function(){bossHP=Math.min(100,bossHP+5);$('#hp').style.width=bossHP+'%'}},
      {t:'🛡 魔王開護盾',d:'下一題答對只扣一半的血',f:function(){bossShield=1}}
    ]);
    sk.f();
    $('#bad .bt').textContent=sk.t;$('#bad .bd').textContent=sk.d+'　答對就能扳回來！';
    var bx=$('#bad');bx.classList.remove('on');void bx.offsetWidth;bx.classList.add('on');
    judge(false,cur.h);
  }
}
function win(){
  if(ended)return;
  stop();gStop();missHide(false);
  score+=1000;
  over('🏆 魔王被打倒了！（獎勵 ＋1000）');
}

/* ── 共用：四選一的綁定 ── */
function fbBox(){return '<div id="gfb"></div>'}
function bindO(){
  $$('.o').forEach(function(b){b.addEventListener('click',function(){
    if(busy)return;
    var ok=b.getAttribute('data-ok')==='true';
    markO(b,ok);PICK=b.getAttribute('data-t');
    judge(ok,cur.h);
  })});
}
function markO(b,ok){
  $$('.o').forEach(function(x){
    if(x.getAttribute('data-ok')==='true')x.classList.add('ok');
    else if(x===b)x.classList.add('bad');else x.classList.add('dim')});
}

/* ── 結算 ── */
function over(title){
  if(ended&&$('#gend').classList.contains('on'))return;
  ended=true;stop();gStop();
  $('#arena').classList.remove('on');$('#gend').classList.add('on');
  $('#gendh').textContent=title||'🏁 這一場結束！';
  endBody();
}
function endBody(){
  var b=store('best_'+g)||0;
  if(score>b){store('best_'+g,score);b=score;$('#gendh').textContent+='　🎉 破紀錄！'}
  $('#gendsc').textContent=score;
  $('#gendln').innerHTML='✅ <b>'+right+'</b>　❌ <b>'+wrong+'</b>　🔥 最長 <b>'+best+
    '</b>　⚡ <b>'+speedSum+'</b>　🏆 最佳 <b>'+b+'</b>';
  $('#gendrev').innerHTML=
    '<div>🎁 翻到 <b>'+opened.length+'</b> 張'+(opened.length?'：'+opened.join('、'):'')+'</div>'+
    (wrongList.length?
     ('<div style="color:#5C5C5C;letter-spacing:.1em">📌 要記住的：</div>'+
      wrongList.map(function(h){return '<div>・'+ap(h)+'</div>'}).join('')):
     '<div>全對！一題都沒錯 🎉</div>');
  var mb=$('#missBtn');if(mb)mb.style.display=MISSLOG.length?'':'none';
  sWow();
  /* 遊戲結束：答錯整理用獨立的一整頁先蓋上來（使用者 2026-09-24 指定） */
  missAll('這一場　答錯整理');
}
$('#retry').addEventListener('click',function(){begin(g)});
$('#missBtn').addEventListener('click',function(){missAll('這一場　答錯整理')});
$('#backhub').addEventListener('click',hub);
$('#quit').addEventListener('click',function(){
  if($('#arena').classList.contains('on')||$('#gend').classList.contains('on'))hub();
});
hub();
`;

const body = `
<div id="bad"><div class="bt"></div><div class="bd"></div></div>
<div id="burst"></div>
<div id="evt"></div>
<div id="pick"></div>
<div id="gain"></div>

<main id="stage">
 <section id="hub">
  <h1>🎮 複習遊戲　10 種玩法</h1>
  <p class="lead">⏳ 每個遊戲 <b>5 分鐘</b>　⚡ 每題 15 秒，<b>愈快分數愈高</b><br>
     🔥 <b>連對 3 題</b> ➜ 翻一張 🎁 驚喜卡（每個遊戲 ${NS} 張，張張不一樣）<br>
     ❌ 答錯 ➜ 看清楚 ➜ ⭐ 加分題答對 <b>✕ 2</b></p>
  <div id="grid"></div>
 </section>

 <div id="ghud">
  <span class="gcell"><span class="k">遊戲</span><span class="v" id="gname"></span></span>
  <span class="gcell"><span class="k">剩下</span><span class="v" id="gclock">⏳ 5:00</span></span>
  <span id="gring"><svg viewBox="0 0 100 100"><circle id="gbg" cx="50" cy="50" r="46"></circle>
   <circle id="gfg" cx="50" cy="50" r="46"></circle></svg><span id="gnum">15</span></span>
  <span class="gsb"><span class="gb1"><b id="gsc">0</b><em>🏆 總分</em></span>
   <span class="gb2"><b id="gstreak">—</b><em>連對</em></span>
   <span class="gb2"><b id="gsurp">🎁 0</b><em>驚喜卡</em></span></span>
  <span id="gpop"></span>
 </div>

 <section id="arena"></section>

 <section id="gend">
  <h2 id="gendh">🏁 這一場結束！</h2>
  <div class="sc" id="gendsc">0</div>
  <div class="ln" id="gendln"></div>
  <div class="rev" id="gendrev"></div>
  <div class="rowbtn">
   <button class="big" id="missBtn">📌 答錯整理</button>
   <button class="big go" id="retry">🔁 再玩一次</button>
   <button class="big" id="backhub">🎮 換一個遊戲</button>
  </div>
 </section>
</main>

<nav id="bar">
 <button id="quit">⬅ 回遊戲大廳</button>
 ${S.RATEBAR}
 <a href="index.html">🏠 首頁</a>
</nav>

<script>
${S.UTIL}
${S.TTS}
${S.SFX}
${S.MISS}
${JS.replace('__BANK__', () => JSON.stringify({
    g1: B.G1, g2: B.G2, g3: B.G3, g4: B.G4, g5: B.G5,
    g6: B.G6, g7: B.G7, g8: B.G8, g9: B.G9, g10: B.G10
  })).replace('__META__', () => JSON.stringify(B.GAMES))
     .replace('__SURP__', () => JSON.stringify(B.SURP))}
${S.RATEJS}
</script>
</body>
</html>`;

fs.writeFileSync(DIR + '/games.html', S.HEAD('複習遊戲 10 種｜英文句型', CSS) + body);
console.log('games ok  ' + B.GAMES.length + ' 種，題數 ' + B.GAMES.map(g => g.n).join('/'));
