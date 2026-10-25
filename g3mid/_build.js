/* g3mid/_build.js — 📝 三年級 複習（期中考範圍 10 種限時遊戲；2026-10-25 老師第二十四次；規格 g3mid/CLAUDE.md）
 *   node g3mid/_build.js  ➜  g3mid/index.html（一頁：大廳 ＋ 10 種遊戲）
 * 題庫：g3mid/_data.js（唯一真相）。手寫辨識：g3mid/_hw.js。語音：g3mid/audio/（node g3mid/_audio.js）。照片：g3mid/img/（老師給的 Classroom English 截圖切的）。
 * 只放在老師的教學總首頁（words/_build_hub.js 的〔📝 三年級 複習〕）；在家複習沒有、不記成績（老師：以後才放進在家複習和成績系統）。
 * 不可以有 <section id="gend">、id="tqGo"、id="rvBtn"（score/_test.js 會當成要記成績的網頁）。 */
const fs = require('fs'), path = require('path');
const D = require('./_data.js'), HW = require('./_hw.js');
const J = o => JSON.stringify(o).replace(/</g, '\\u003c');
const AUD = fs.existsSync(path.join(__dirname, 'audio/aud.js'));

/* ── 嚴禁洩題：考卷的原題不可以出現（build 失敗）── */
const LEAK = [];
D.GAMES[0].B.forEach(q => { if (D.EXAM_A[q.say] && q.o.indexOf(D.EXAM_A[q.say]) >= 0) LEAK.push('打地鼠 ' + q.say + ' 配 ' + D.EXAM_A[q.say]); });
D.GAMES[3].B.forEach(q => { if (D.EXAM_D.indexOf(q.say) >= 0) LEAK.push('挖礦 ' + q.say); });
D.GAMES[4].B.forEach(q => { if (D.EXAM_E.indexOf(q.show + '>' + q.want) >= 0) LEAK.push('魔鏡 ' + q.show + '>' + q.want); });
const BAN = /\b(Mike|Emma|Wendy|Roy|Sam|Ann|Lily)\b/;
D.GAMES.forEach(g => g.B.forEach(q => { if (BAN.test(JSON.stringify(q))) LEAK.push(g.nm + '：' + JSON.stringify(q).match(BAN)[0]); }));
D.GAMES.forEach(g => { if (g.B.length < 8) LEAK.push(g.nm + ' 題庫不到 8 題');
  g.B.forEach(q => { if (q.o && new Set(q.o.map(x => JSON.stringify(x))).size !== q.o.length) LEAK.push(g.nm + ' 選項重複 ' + JSON.stringify(q.o)); }); });
if (LEAK.length) { console.error('✗ ' + LEAK.join('\n✗ ')); process.exit(1); }

const GM = D.GAMES.map(g => ({ id: g.id, ic: g.ic, nm: g.nm, how: g.how, t: g.t, w: g.w || 0, B: g.B, c1: g.c1, c2: g.c2 }));

const CSS = `
@font-face{font-family:Andika;src:url(../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark;--gold:#FFD54A;--ok:#2BD46A;--no:#FF5A5A;--line:#2E4058}
*{box-sizing:border-box}
html,body{margin:0;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;font-weight:700;-webkit-tap-highlight-color:transparent;overflow-x:hidden}
body{min-height:100vh;touch-action:manipulation;background:#070A16 radial-gradient(1200px 700px at 12% -10%,#1E1650 0,transparent 60%) no-repeat;user-select:none;-webkit-user-select:none}
button{font:inherit;font-weight:700;color:#fff;cursor:pointer;touch-action:manipulation}
.scr{max-width:1320px;margin:0 auto;padding:10px 16px 24px}
/* ── 大廳 ── */
.top{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:4px 0}
.top h1{font-size:clamp(34px,5vh,56px);color:var(--gold);margin:0;letter-spacing:.04em;text-shadow:0 4px 0 #6B4A00}
.top .sub{font-size:clamp(20px,2.6vh,26px);color:#BFD3E6}
.home{margin-left:auto;display:inline-flex;align-items:center;min-height:52px;padding:4px 20px;border-radius:16px;background:#1B2633;border:3px solid #4A5A6C;color:#fff;text-decoration:none;font-size:22px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:14px;margin-top:12px;perspective:900px}
.gc{display:flex;align-items:center;gap:14px;text-align:left;padding:12px 14px;border-radius:22px;border:3px solid var(--line);background:linear-gradient(#17233A,#0D1525);min-height:104px;transition:transform .18s;transform-style:preserve-3d}
.gc:hover{border-color:var(--gold);transform:rotateX(6deg) translateY(-3px)}.gc:active{transform:scale(.97)}
.gc .bd{flex:0 0 auto;width:74px;height:74px;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:42px;
  background:linear-gradient(135deg,var(--c2),var(--c1));box-shadow:inset 0 3px 0 rgba(255,255,255,.45),0 7px 0 rgba(0,0,0,.45);animation:bdf 3s ease-in-out infinite}
.gc:nth-child(2n) .bd{animation-delay:-1.4s}
@keyframes bdf{50%{transform:translateY(-4px) rotate(-4deg)}}
.gc b{display:block;font-size:clamp(23px,2.8vh,29px)}.gc small{display:block;font-size:clamp(18px,2.1vh,21px);color:#B7C8DA;line-height:1.4;margin-top:3px}
.gc .best{display:inline-block;margin-top:4px;font-size:18px;color:#FFE07A}
.rule{margin-top:12px;font-size:clamp(19px,2.3vh,23px);color:#9FB4C8;text-align:center}
/* ── 遊戲 HUD ── */
.hud{display:flex;align-items:center;gap:12px;margin:2px 0 6px;flex-wrap:wrap}
.hud .nm{font-size:clamp(22px,3vh,30px);color:var(--gold)}
.hud .dots{display:flex;gap:6px;flex:1;justify-content:center}.hud .dots i{width:22px;height:22px;border-radius:50%;background:#1A2330;border:3px solid #34475C}
.hud .dots i.ok{background:var(--ok);border-color:var(--ok)}.hud .dots i.no{background:var(--no);border-color:var(--no)}.hud .dots i.cur{border-color:var(--gold);box-shadow:0 0 10px var(--gold)}
.hud .sc{font-size:clamp(26px,3.4vh,36px);color:#FFE07A;min-width:4.5em;text-align:right}
.hud .qx{min-height:52px;padding:4px 16px;border-radius:14px;background:#1B2633;border:3px solid #4A5A6C;font-size:20px}
.tmw{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.tm{flex:1;height:16px;border-radius:8px;background:#1A2330;overflow:hidden}.tm i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#FF5A5A,var(--gold),#2BD46A);transform-origin:left}
.tsec{font-size:clamp(26px,3.6vh,38px);color:#fff;min-width:2.2em;text-align:right}.tsec.low{color:#FF6B6B;animation:tl .5s infinite alternate}
@keyframes tl{to{transform:scale(1.18)}}
.how{font-size:clamp(20px,2.6vh,27px);color:#DDE8F3;text-align:center;margin:2px 0 6px}
.stage{position:relative;min-height:62vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(8px,1.6vh,16px)}
.hear{min-height:68px;padding:6px 30px;border-radius:999px;border:0;background:linear-gradient(#2F7BFF,#1452C4);box-shadow:0 6px 0 #0B347E;font-size:clamp(25px,3.4vh,34px)}
.hear:active{transform:translateY(4px);box-shadow:0 2px 0 #0B347E}.hear.on{animation:hr 1s ease-in-out infinite}
@keyframes hr{50%{box-shadow:0 6px 0 #0B347E,0 0 0 14px rgba(47,123,255,.25)}}
/* 加分 */
#gain{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);z-index:60;pointer-events:none;text-align:center;display:none}
#gain.on{display:block;animation:gn 1.1s ease-out forwards}
#gain b{display:block;font-size:clamp(60px,11vh,110px);color:#FFE07A;text-shadow:0 6px 0 #6B4A00,0 0 30px #FFD54A}
#gain span{display:inline-block;margin-top:4px;font-size:clamp(20px,2.8vh,28px);background:rgba(0,0,0,.6);padding:4px 14px;border-radius:12px}
@keyframes gn{0%{opacity:0;transform:translate(-50%,-30%) scale(.4)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}70%{opacity:1}100%{opacity:0;transform:translate(-50%,-80%) scale(1)}}
.boom{position:fixed;z-index:59;pointer-events:none;font-size:34px;animation:bm 1s ease-out forwards}
@keyframes bm{to{transform:translate(var(--dx),var(--dy)) rotate(var(--r)) scale(.4);opacity:0}}
/* ── 答錯：綠底 詳細解說（老師第 6 點）── */
#fb{position:fixed;inset:0;z-index:80;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.72);padding:14px}
#fb.on{display:flex}
#fb .box{width:min(1100px,100%);max-height:100%;overflow:auto;background:linear-gradient(#0E7A3A,#0A5E2D);border:5px solid #7BF0A8;border-radius:28px;padding:clamp(14px,2.4vh,26px) clamp(14px,2.6vw,34px);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:fbin .35s ease-out}
@keyframes fbin{from{transform:scale(.85);opacity:0}}
#fb .hd{font-size:clamp(30px,4.6vh,46px);color:#FFE07A;animation:shk .45s}
@keyframes shk{25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
#fb .yp{margin:8px auto 0;font-size:clamp(20px,2.8vh,28px);color:#FFD6D6;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
#fb .yp s{color:#FFB3B3;text-decoration-thickness:3px}
#fb .yp canvas{background:#fff;border-radius:10px;height:clamp(70px,11vh,110px);width:auto}
#fb .ca{margin-top:clamp(8px,1.6vh,16px);font-size:clamp(22px,3vh,30px);color:#C8FFD9}
#fb .gls{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:clamp(6px,1vw,16px) clamp(10px,1.6vw,22px);margin:8px 0}
#fb .gw{display:flex;flex-direction:column;align-items:center;min-width:1.2em;transition:transform .2s}
#fb .gw b{font-size:clamp(38px,7.4vh,76px);line-height:1.12;color:#fff;letter-spacing:.01em}
#fb .gw i{font-style:normal;font-size:clamp(22px,3.4vh,34px);color:#FFE07A;min-height:1.3em;white-space:nowrap}
#fb .gw.ct{margin-left:calc(-1 * clamp(10px,1.6vw,22px))}
#fb .gls.spk .gw b{animation:spk 1s ease-in-out}
@keyframes spk{40%{transform:scale(1.12);text-shadow:0 0 22px #fff}}
#fb .ltr{display:flex;align-items:center;justify-content:center;gap:clamp(12px,2vw,30px);margin:6px 0}
#fb .ltr canvas{background:#fff;border-radius:14px;height:clamp(130px,24vh,240px);width:auto}
#fb .ltr .ar{font-size:clamp(40px,7vh,70px)}
#fb .ltr .big{font-size:clamp(80px,16vh,160px);line-height:1;background:#fff;color:#111;border-radius:14px;padding:0 .2em}
#fb .tr{margin-top:6px;font-size:clamp(24px,3.6vh,36px);color:#fff;background:rgba(0,0,0,.25);border-radius:16px;padding:8px 14px;display:inline-block}
#fb .ph{height:clamp(120px,22vh,220px);border-radius:16px;border:4px solid #fff;margin:6px 0}
#fb .ft{margin-top:clamp(10px,1.8vh,18px);display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap}
#fb .n3{display:flex;gap:10px;font-size:clamp(22px,3vh,30px)}#fb .n3 span{width:1.8em;height:1.8em;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.3);border:3px solid #7BF0A8}
#fb .n3 span.on{background:#FFE07A;color:#3A2A00;border-color:#FFE07A;animation:pop .5s}
@keyframes pop{50%{transform:scale(1.25)}}
#fb .nx{min-height:64px;padding:6px 34px;border-radius:999px;border:0;background:linear-gradient(#FFD54A,#E0A800);color:#2A1C00;box-shadow:0 6px 0 #7A5A00;font-size:clamp(25px,3.4vh,34px)}
/* 放不下 ➜ 一級一級縮小（不用捲動）*/
#fb .box.f1 .gw b{font-size:clamp(32px,5.4vh,58px)}#fb .box.f1 .gw i{font-size:clamp(20px,2.7vh,28px)}#fb .box.f1 .ph,#fb .box.f1 .ltr canvas{height:clamp(100px,16vh,170px)}#fb .box.f1 .pc{transform:scale(.8);margin:-14px 0}
#fb .box.f2 .gw b{font-size:clamp(30px,4.4vh,48px)}#fb .box.f2 .gw i{font-size:clamp(19px,2.4vh,24px)}#fb .box.f2 .tr{font-size:clamp(21px,2.9vh,30px)}#fb .box.f2 .pc{transform:scale(.66);margin:-34px 0}#fb .box.f2 .yp .pc{display:none!important}
#fb .say{min-height:56px;padding:4px 22px;border-radius:999px;border:3px solid #fff;background:transparent;font-size:clamp(20px,2.6vh,26px)}
/* ── 結束 ── */
.end{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;padding-top:2vh}
.end .st{font-size:clamp(60px,11vh,110px);letter-spacing:.1em}
.end .st i{font-style:normal;display:inline-block;animation:stin .6s backwards}
.end .st i:nth-child(2){animation-delay:.25s}.end .st i:nth-child(3){animation-delay:.5s}
@keyframes stin{from{transform:scale(0) rotate(-90deg)}}
.end .big{font-size:clamp(34px,5vh,52px);color:var(--gold)}
.end .wl{display:flex;flex-direction:column;gap:8px;width:min(900px,100%)}
.end .wl div{display:flex;align-items:center;gap:12px;background:#122033;border-radius:14px;padding:8px 14px;font-size:clamp(22px,3vh,30px);text-align:left}
.end .wl button{margin-left:auto;min-height:52px;min-width:60px;border-radius:12px;border:0;background:#1452C4;font-size:24px}
.end .btns{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:6px}
.end .btns button{min-height:68px;padding:6px 30px;border-radius:18px;border:0;font-size:clamp(24px,3.2vh,32px);box-shadow:0 6px 0 rgba(0,0,0,.4)}
.end .b1{background:linear-gradient(#2BD46A,#139447)}.end .b2{background:linear-gradient(#3E8BFF,#1452C4)}
/* ══ 1 🔨 打地鼠 ══ */
.lawn{position:relative;width:min(980px,100%);height:clamp(300px,50vh,470px);perspective:900px}
.lawn .gr{position:absolute;inset:8% 0 0;border-radius:40px;background:repeating-linear-gradient(90deg,#3FA34D 0 40px,#379745 40px 80px);transform:rotateX(38deg);transform-origin:50% 100%;box-shadow:inset 0 -30px 60px rgba(0,0,0,.35),0 30px 40px rgba(0,0,0,.5)}
.holes{position:absolute;inset:0;display:grid;grid-template-columns:repeat(4,1fr);align-items:end;padding:0 2% 4%}
.hole{position:relative;height:100%;border:0;background:none;padding:0}
.hole .pit{position:absolute;left:8%;right:8%;bottom:6%;height:24%;border-radius:50%;background:radial-gradient(ellipse at 50% 35%,#1A0E05 0,#2E1A0A 55%,#5A3A1A 72%,#3A7A30 74%);}
.hole .mole{position:absolute;left:14%;right:14%;bottom:14%;height:66%;overflow:hidden;border-radius:0 0 30% 30%}
.hole .mb{position:absolute;left:0;right:0;bottom:0;height:100%;transform:translateY(8%);animation:mup 2.6s ease-in-out infinite}
.hole:nth-child(2) .mb{animation-delay:-.7s}.hole:nth-child(3) .mb{animation-delay:-1.4s}.hole:nth-child(4) .mb{animation-delay:-2s}
@keyframes mup{0%,100%{transform:translateY(8%)}45%{transform:translateY(0)}80%{transform:translateY(22%)}}
.mb .body{position:absolute;left:12%;right:12%;bottom:0;height:62%;border-radius:48% 48% 20% 20%;background:radial-gradient(circle at 35% 25%,#B8834F,#8A5A2B 60%,#6A421D)}
.mb .eye{position:absolute;top:22%;width:12%;height:14%;background:#111;border-radius:50%}.mb .eye.l{left:30%}.mb .eye.r{right:30%}
.mb .nose{position:absolute;top:38%;left:44%;width:12%;height:10%;background:#FF7FA0;border-radius:50%}
.mb .sign{position:absolute;z-index:2;left:50%;top:0;transform:translateX(-50%);min-width:62%;height:44%;background:#FFF7DE;border:5px solid #8A5A2B;border-radius:14px;color:#1B1B1B;font-size:clamp(46px,8vh,84px);line-height:1;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 0 rgba(0,0,0,.35)}
.hole.hit .mb{animation:none;transform:translateY(0) scale(1.05,.9)}
.hole.hit .sign{background:#C8FFD9;border-color:#2BD46A}
.hole.miss .mb{animation:none;transform:translateY(0)}
.hole.miss .sign{background:#FFD0D0;border-color:#FF5A5A}
.hammer{position:absolute;font-size:clamp(70px,11vh,110px);pointer-events:none;z-index:5;transform-origin:80% 80%;animation:ham .35s ease-in forwards}
@keyframes ham{from{transform:rotate(-70deg) translate(-20px,-40px)}to{transform:rotate(15deg)}}
/* ══ 2 🟡 小精靈 ══ */
.maze{position:relative;width:min(1000px,100%);height:clamp(320px,52vh,500px);perspective:1000px}
.maze .bd2{position:absolute;inset:0;border-radius:26px;background:#05072A;border:6px solid #3E5BFF;box-shadow:0 0 30px #3E5BFF88,inset 0 0 40px #1F2A8C;transform:rotateX(24deg);transform-origin:50% 100%}
.maze .wall{position:absolute;border:5px solid #3E5BFF;border-radius:14px;box-shadow:0 0 12px #3E5BFF}
.maze .pd{position:absolute;width:12px;height:12px;border-radius:50%;background:#FFE6A8;box-shadow:0 0 8px #FFE6A8;transition:opacity .2s}
.maze .pd.eat{opacity:0}
.cards{position:absolute;left:0;right:0;top:4%;display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(8px,1.6vw,22px);padding:0 3%}
.pc{position:relative;border:0;border-radius:22px;background:#FFFBEF;color:#111;padding:8px 6px;min-height:clamp(170px,30vh,260px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;box-shadow:0 0 0 5px #FFD23F,0 10px 0 rgba(0,0,0,.4);animation:pcf 2.4s ease-in-out infinite}
.pc:nth-child(2){animation-delay:-.8s}.pc:nth-child(3){animation-delay:-1.6s}
@keyframes pcf{50%{transform:translateY(-6px)}}
.pc.ok{box-shadow:0 0 0 7px #2BD46A,0 0 30px #7BF0A8}.pc.no{opacity:.4}
.tag{width:92%;border-radius:12px;overflow:hidden;border:3px solid #D32F2F;background:#fff}
.tag .tt{background:#D32F2F;color:#fff;font-size:clamp(18px,2.2vh,21px);line-height:1.15;padding:3px 0}.tag .tt b{display:block;font-size:clamp(20px,2.8vh,28px)}
.tag .tn{font-size:clamp(30px,5vh,48px);padding:2px 0 4px}
.cake{position:relative;font-size:clamp(46px,8vh,74px);line-height:1}
.cake .cn{position:absolute;left:50%;top:-.42em;transform:translateX(-50%);font-size:.62em;color:#E21B3C;background:#FFF;border:3px solid #E21B3C;border-radius:12px;padding:0 .18em;line-height:1.1}
.scn{font-size:clamp(46px,8vh,78px);display:flex;gap:2px;align-items:center}.scn .fx{font-size:.55em;align-self:flex-start}
.pac{position:absolute;left:50%;bottom:6%;width:clamp(60px,9vh,90px);height:clamp(60px,9vh,90px);margin-left:calc(clamp(60px,9vh,90px) / -2);transition:left .7s linear,bottom .7s linear,transform .2s;z-index:4}
.pac i{position:absolute;inset:0;border-radius:50%;background:#FFD23F;box-shadow:0 0 18px #FFD23F;animation:chomp .3s linear infinite alternate}
@keyframes chomp{from{clip-path:polygon(50% 50%,100% 20%,100% 0,0 0,0 100%,100% 100%,100% 80%)}to{clip-path:polygon(50% 50%,100% 48%,100% 0,0 0,0 100%,100% 100%,100% 52%)}}
.ghost{position:absolute;bottom:12%;font-size:clamp(40px,6vh,60px);animation:gh 5s linear infinite;z-index:3}
@keyframes gh{0%{left:4%}50%{left:86%}100%{left:4%}}
/* ══ 3 🧸 夾娃娃 ══ */
.claw{position:relative;width:min(1000px,100%);height:clamp(340px,56vh,520px);border-radius:26px;background:linear-gradient(#FFB3D1,#FF6FAE);padding:14px;box-shadow:0 12px 0 #B0306A,0 20px 40px rgba(0,0,0,.5)}
.claw .glass{position:relative;height:100%;border-radius:18px;background:linear-gradient(135deg,rgba(255,255,255,.28),rgba(255,255,255,.06) 40%,rgba(255,255,255,.18));border:4px solid rgba(255,255,255,.7);overflow:hidden}
.claw .rail{position:absolute;left:0;right:0;top:0;height:16px;background:#888;border-bottom:4px solid #555}
.claw .arm{position:absolute;top:12px;left:50%;width:0;transition:left .8s ease-in-out;z-index:6}
.claw .rope{position:absolute;left:-3px;top:0;width:6px;height:40px;background:#555;transition:height .8s ease-in-out}
.claw .hd3{position:absolute;left:-36px;width:72px;height:40px;top:40px;transition:top .8s ease-in-out}
.claw .hd3::before{content:'';position:absolute;left:18px;right:18px;top:0;height:18px;background:#C0C0C0;border-radius:6px;border:3px solid #777}
.claw .hd3 .f{position:absolute;top:14px;width:12px;height:38px;background:#AFAFAF;border:3px solid #666;border-radius:6px;transition:transform .4s}
.claw .hd3 .f.l{left:6px;transform:rotate(28deg);transform-origin:top center}.claw .hd3 .f.r{right:6px;transform:rotate(-28deg);transform-origin:top center}
.claw.grab .hd3 .f.l{transform:rotate(6deg)}.claw.grab .hd3 .f.r{transform:rotate(-6deg)}
.caps{position:absolute;left:0;right:0;bottom:4%;display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(6px,1.2vw,16px);padding:0 2.5%}
.cap{position:relative;border:0;padding:0;background:none;transition:transform .8s ease-in-out}
.cap img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:18px;border:5px solid #fff;box-shadow:0 8px 0 rgba(0,0,0,.3),0 0 0 4px #B0306A}
.cap.ok img{border-color:#2BD46A;box-shadow:0 0 0 6px #2BD46A,0 0 30px #7BF0A8}.cap.no img{filter:grayscale(.7);opacity:.6}
.chute{position:absolute;right:3%;top:22%;font-size:clamp(28px,4vh,40px);color:#fff;text-shadow:0 2px 0 #B0306A}
/* ══ 4・5 寫字 ══ */
.wrow{display:flex;align-items:center;justify-content:center;gap:clamp(12px,3vw,40px);width:100%}
.wleft{display:flex;flex-direction:column;align-items:center;gap:12px}
.pad{position:relative;background:#FFFDF6;border-radius:22px;box-shadow:0 0 0 6px #5FAE3B,0 12px 0 rgba(0,0,0,.4);touch-action:none}
.pad canvas{display:block;border-radius:22px;touch-action:none}
.pad .lg{position:absolute;left:10px;font-size:clamp(18px,2.2vh,21px);color:#C62828;background:#fff;padding:0 6px;border-radius:6px;pointer-events:none}
.wbtn{display:flex;gap:14px;justify-content:center;margin-top:12px}
.wbtn button{min-height:64px;padding:4px 26px;border-radius:18px;border:0;font-size:clamp(23px,3vh,30px);box-shadow:0 6px 0 rgba(0,0,0,.4)}
.wbtn .er{background:#4A5A6C}.wbtn .go{background:linear-gradient(#2BD46A,#139447)}
.mc{position:relative;width:clamp(130px,20vh,200px);height:clamp(130px,20vh,200px);transform-style:preserve-3d;transform:rotateX(-22deg) rotateY(-32deg);margin:20px}
.mc .fc{position:absolute;inset:0;background:#8B8B8B;border:4px solid #555;
 background-image:linear-gradient(45deg,#7A7A7A 25%,transparent 25%,transparent 75%,#7A7A7A 75%),linear-gradient(45deg,#7A7A7A 25%,transparent 25%,transparent 75%,#7A7A7A 75%);background-size:40px 40px;background-position:0 0,20px 20px;display:flex;align-items:center;justify-content:center;font-size:clamp(56px,9vh,90px)}
.mc .f1{transform:translateZ(calc(clamp(130px,20vh,200px) / 2))}.mc .f2{transform:rotateY(90deg) translateZ(calc(clamp(130px,20vh,200px) / 2));filter:brightness(.75)}.mc .f3{transform:rotateX(90deg) translateZ(calc(clamp(130px,20vh,200px) / 2));filter:brightness(1.2);background-color:#6BAF4A}
.mc.crack .f1::after{content:'';position:absolute;inset:0;background:linear-gradient(60deg,transparent 45%,#222 46%,#222 48%,transparent 49%),linear-gradient(-30deg,transparent 52%,#222 53%,#222 55%,transparent 56%)}
.mc.brk{animation:brk .6s forwards}
@keyframes brk{to{transform:rotateX(-22deg) rotateY(-32deg) scale(0);opacity:0}}
.loot{font-size:clamp(70px,12vh,120px);animation:lt .6s backwards}.loot small{display:block;font-size:clamp(30px,5vh,50px);color:#fff}
@keyframes lt{from{transform:translateY(40px) scale(.3);opacity:0}}
.mirror{position:relative;width:clamp(190px,28vh,280px);height:clamp(250px,38vh,370px);border-radius:50% 50% 46% 46%;background:radial-gradient(ellipse at 40% 30%,#E9E4FF,#9C8CE0 70%);border:12px solid #E0B43A;box-shadow:0 0 0 5px #8A6400,0 0 40px #9C6BFFAA,inset 0 0 30px rgba(255,255,255,.6);display:flex;align-items:center;justify-content:center;overflow:hidden}
.mirror::after{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.55) 45%,transparent 60%);animation:shine 2.6s infinite}
@keyframes shine{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
.mirror canvas{position:relative;z-index:1}
.ask{font-size:clamp(24px,3.4vh,34px);color:#fff;background:rgba(0,0,0,.35);padding:4px 16px;border-radius:14px}
.ask b{color:var(--gold)}
/* ══ 6 🧱 金幣磚 ══ */
.sky{width:min(1000px,100%);border-radius:24px;background:linear-gradient(#5DBBFF,#A6DDFF);padding:clamp(8px,1.6vh,16px);display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.4vh,14px);box-shadow:0 10px 0 rgba(0,0,0,.35)}
.objs{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 10px;max-width:640px;font-size:clamp(40px,6.6vh,64px);background:rgba(255,255,255,.55);border-radius:20px;padding:4px 14px}
.objs span{animation:ob .5s backwards}
@keyframes ob{from{transform:scale(0) translateY(-30px)}}
.slots{display:flex;gap:clamp(6px,1vw,12px)}
.slot{width:clamp(56px,8vh,80px);height:clamp(66px,9.4vh,92px);border-bottom:6px solid #1B3A6B;font-size:clamp(46px,7.4vh,72px);color:#0B1A33;display:flex;align-items:flex-end;justify-content:center;line-height:1}
.slot.on{border-color:#E21B3C}
.slot b{animation:fly .35s backwards}@keyframes fly{from{transform:translateY(-120px) scale(.4)}}
.qbs{display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(8px,1.4vw,16px);perspective:600px}
.qb{position:relative;width:clamp(72px,10.5vh,104px);height:clamp(72px,10.5vh,104px);border:0;border-radius:10px;background:linear-gradient(#FFC93C,#E59400);box-shadow:inset 0 -8px 0 #A85F00,inset 0 6px 0 #FFE38A,0 7px 0 #5A3300;color:#5A2A00;font-size:clamp(44px,7vh,68px);line-height:1;transform:rotateX(10deg)}
.qb::before,.qb::after{content:'';position:absolute;width:8px;height:8px;border-radius:50%;background:#8A4A00;top:8px;left:8px;box-shadow:calc(clamp(72px,10.5vh,104px) - 32px) 0 0 #8A4A00}
.qb::after{top:auto;bottom:14px}
.qb.bump{animation:bump .3s}@keyframes bump{50%{transform:rotateX(10deg) translateY(-22px)}}
.qb.used{background:linear-gradient(#B8763A,#8A5320);color:transparent;box-shadow:inset 0 -8px 0 #5A3300,0 7px 0 #3A2000}
.qb.bad{animation:shk .4s;background:#888}
.coin{position:fixed;z-index:58;font-size:44px;pointer-events:none;animation:cn .7s ease-out forwards}
@keyframes cn{to{transform:translateY(-120px);opacity:0}}
/* ══ 7 🌱 皮克敏 ══ */
.sent{font-size:clamp(36px,6.4vh,66px);background:#fff;color:#111;border-radius:22px;padding:10px 24px;text-align:center;line-height:1.3;box-shadow:0 8px 0 rgba(0,0,0,.35);max-width:100%}
.sent .gap{display:inline-block;min-width:3.4em;min-height:1.2em;vertical-align:bottom;border:4px dashed #1D6B5A;border-radius:12px;background:#E3FFF6;color:#1D6B5A;padding:0 .2em}
.sent .gap.hot{background:#B6FFE6;border-style:solid;transform:scale(1.06)}
.sent .gap.fill{border-style:solid;background:#C8FFD9;border-color:#2BD46A}
.field{position:relative;width:min(1000px,100%);height:clamp(220px,34vh,320px);border-radius:26px;background:linear-gradient(#8ED16B,#4E9A37);box-shadow:inset 0 -20px 40px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:space-around}
.pk{position:relative;width:clamp(130px,20vw,210px);display:flex;flex-direction:column;align-items:center;touch-action:none;cursor:grab;animation:pkw 1.2s ease-in-out infinite;z-index:2}
.pk:nth-child(2){animation-delay:-.4s}.pk:nth-child(3){animation-delay:-.8s}
@keyframes pkw{50%{transform:translateY(-8px) rotate(3deg)}}
.pk.drag{animation:none;z-index:20;cursor:grabbing}
.pk .wd{background:#FFF7DE;color:#1B1B1B;border:4px solid #7A5A2B;border-radius:14px;padding:4px 12px;font-size:clamp(30px,5vh,48px);white-space:nowrap;box-shadow:0 5px 0 rgba(0,0,0,.3)}
.pk .bdy{position:relative;width:46px;height:70px;margin-top:4px}
.pk .bdy .lf{position:absolute;left:12px;top:-30px;font-size:30px}
.pk .bdy .hd{position:absolute;left:6px;top:0;width:34px;height:34px;border-radius:50%;background:var(--pc)}
.pk .bdy .hd::before,.pk .bdy .hd::after{content:'';position:absolute;top:12px;width:9px;height:11px;border-radius:50%;background:#fff;box-shadow:inset 3px 0 0 #111}
.pk .bdy .hd::before{left:6px}.pk .bdy .hd::after{right:6px}
.pk .bdy .tr{position:absolute;left:14px;top:32px;width:18px;height:34px;border-radius:9px;background:var(--pc)}
.pk.back{transition:transform .4s}
/* ══ 8 ⚡ 寶可夢 對戰 ══ */
.arena{position:relative;width:min(1000px,100%);height:clamp(250px,36vh,350px);border-radius:26px;background:linear-gradient(#BEE7FF 0,#E8F8FF 50%,#9BD67A 50%,#6DB54E);overflow:hidden;box-shadow:0 10px 0 rgba(0,0,0,.35)}
.arena .pf{position:absolute;width:34%;height:20%;border-radius:50%;background:rgba(60,110,40,.55)}
.arena .pf.e{right:6%;top:40%}.arena .pf.m{left:6%;bottom:6%}
.mon{position:absolute;font-size:clamp(76px,13vh,130px);line-height:1;transition:transform .25s}
.mon.e{right:13%;top:6%;animation:mb 2s ease-in-out infinite}.mon.m{left:13%;bottom:14%;animation:mb 2s ease-in-out -1s infinite;transform:scaleX(-1)}
@keyframes mb{50%{margin-top:-6px}}
.mon.atk{animation:atk .45s}@keyframes atk{50%{transform:translate(60px,-40px) scaleX(-1)}}
.mon.hurt{animation:hurt .5s}@keyframes hurt{20%,60%{opacity:.2}40%,80%{opacity:1}}
.hp{position:absolute;width:38%;background:#FFFBEF;color:#222;border-radius:12px;padding:4px 10px;font-size:clamp(18px,2.4vh,23px);border:3px solid #444}
.hp.e{left:4%;top:6%}.hp.m{right:4%;bottom:8%}
.hp .bar{height:12px;border-radius:6px;background:#ddd;overflow:hidden;margin-top:3px}.hp .bar i{display:block;height:100%;background:#2BD46A;transition:width .5s}
.bub{position:absolute;left:38%;right:30%;top:36%;background:#fff;color:#111;border-radius:18px;padding:8px 14px;font-size:clamp(26px,4.4vh,42px);text-align:center;border:4px solid #333;line-height:1.25}
.bub::after{content:'';position:absolute;right:-22px;top:30%;border:12px solid transparent;border-left-color:#333}
.bub button{border:0;background:#1452C4;border-radius:10px;font-size:22px;min-height:48px;min-width:52px;vertical-align:middle;margin-left:6px}
.bolt{position:absolute;font-size:80px;pointer-events:none;animation:bolt .5s forwards;z-index:5}@keyframes bolt{from{transform:scale(.2);opacity:1}to{transform:scale(2.4);opacity:0}}
.moves{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:min(1000px,100%)}
.mv{min-height:clamp(74px,11vh,104px);border:0;border-radius:18px;font-size:clamp(25px,3.8vh,38px);padding:6px 12px;color:#fff;box-shadow:0 6px 0 rgba(0,0,0,.35);text-align:center}
.mv:nth-child(1){background:#E64A3C}.mv:nth-child(2){background:#2F7BFF}.mv:nth-child(3){background:#2AA84A}.mv:nth-child(4){background:#B0731A}
.mv.ok{box-shadow:0 0 0 6px #fff,0 0 30px #7BF0A8}.mv.no{opacity:.35}
.ask8{font-size:clamp(22px,3vh,30px);color:#fff}
/* ══ 9 🪪 連連看 ══ */
.cn9{position:relative;display:grid;grid-template-columns:1fr minmax(60px,18vw) auto;align-items:center;width:min(1000px,100%)}
.cn9 svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3}
.idc{display:flex;flex-direction:column;gap:clamp(10px,1.8vh,18px)}
.id{position:relative;display:flex;align-items:center;gap:12px;background:linear-gradient(#E9F6FF,#BFE3FF);color:#0B2A44;border:4px solid #35A7E8;border-radius:18px;padding:8px 54px 8px 12px;min-height:clamp(82px,13vh,120px);text-align:left;font-size:clamp(24px,3.6vh,36px);line-height:1.25}
.id .av{font-size:clamp(44px,7vh,66px)}.id small{display:block;font-size:clamp(18px,2.2vh,22px);color:#0E5C8A;letter-spacing:.08em}
.id .dt,.nb .dt{position:absolute;top:50%;width:34px;height:34px;margin-top:-17px;border-radius:50%;background:#fff;border:6px solid #0E5C8A}
.id .dt{right:-17px}.nb .dt{left:-17px}
.nbs{display:flex;flex-direction:column;gap:clamp(10px,1.8vh,18px)}
.nb{position:relative;width:clamp(96px,14vh,130px);height:clamp(82px,13vh,120px);border:0;border-radius:18px;background:linear-gradient(#FFE38A,#FFC93C);color:#3A2A00;font-size:clamp(50px,8vh,80px);box-shadow:0 6px 0 #A85F00}
.id.sel,.nb.sel{box-shadow:0 0 0 6px #FFD54A,0 0 24px #FFD54A}
.id.ok,.nb.ok{box-shadow:0 0 0 6px #2BD46A}
/* ══ 10 🪂 空投 ══ */
.air{position:relative;width:min(1000px,100%);height:clamp(320px,52vh,480px);border-radius:26px;background:linear-gradient(#2B3A55,#6B7F8F 70%,#8C9A6A 70%,#6E7D4B);overflow:hidden;box-shadow:0 10px 0 rgba(0,0,0,.35)}
.crates{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);padding:0 4%}
.crt{position:relative;border:0;background:none;padding:0;height:100%}
.crt .fall{position:absolute;left:0;right:0;top:0;bottom:0;animation:drop 1.4s cubic-bezier(.3,.7,.4,1) backwards}
.crt:nth-child(2) .fall{animation-delay:.25s}.crt:nth-child(3) .fall{animation-delay:.5s}
@keyframes drop{from{transform:translateY(-110%)}}
.crt .chu{position:absolute;left:50%;top:4%;transform:translateX(-50%);font-size:clamp(60px,10vh,96px);animation:sway 2.4s ease-in-out infinite}
@keyframes sway{50%{transform:translateX(-50%) rotate(6deg)}}
.crt .box3{position:absolute;left:12%;right:12%;bottom:12%;height:42%;transform-style:preserve-3d;transform:rotateX(-12deg)}
.crt .box3 .f{position:absolute;inset:0;border-radius:8px;background:repeating-linear-gradient(90deg,#8C6A3A 0 18px,#7A5A2E 18px 22px);border:6px solid #4A3518;display:flex;align-items:center;justify-content:center}
.crt .box3 .f b{background:#111;color:#FFE07A;border-radius:10px;padding:2px .3em;font-size:clamp(40px,6.6vh,66px);letter-spacing:.06em;font-family:Andika,monospace}
.crt .box3 .t{position:absolute;left:0;right:0;top:-18px;height:24px;background:#6E5228;border:5px solid #4A3518;border-radius:6px;transform-origin:bottom;transition:transform .5s}
.crt.open .box3 .t{transform:rotateX(110deg)}
.crt.ok .box3 .f{box-shadow:0 0 0 6px #2BD46A,0 0 40px #FFE07A}
.crt.no{opacity:.45}.crt.no .box3{animation:shk .4s}
.smk{position:absolute;left:50%;bottom:40%;font-size:60px;animation:smk 1s forwards}@keyframes smk{to{transform:translate(-50%,-80px) scale(2);opacity:0}}
/* 直的 iPad、手機 */
@media (orientation:portrait){.holes{grid-template-columns:repeat(2,1fr);grid-template-rows:1fr 1fr}.lawn{height:clamp(380px,52vh,620px)}.caps{grid-template-columns:repeat(2,1fr)}.claw{height:clamp(440px,58vh,700px)}
 .wrow{flex-direction:column}.wleft{flex-direction:row;flex-wrap:wrap;justify-content:center}.mc{width:120px;height:120px;margin:10px 24px}.mc .fc{font-size:56px}.mc .f1,.mc .f2,.mc .f3{--h:60px}
 .mirror{width:170px;height:220px}.wbtn button{white-space:nowrap}}
@media (orientation:portrait){.mc .f1{transform:translateZ(60px)}.mc .f2{transform:rotateY(90deg) translateZ(60px)}.mc .f3{transform:rotateX(90deg) translateZ(60px)}}
@media (max-width:760px){.moves{grid-template-columns:1fr}.bub{left:4%;right:4%;top:auto;bottom:4%}.bub::after{display:none}}
.wbtn button{white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01s!important;animation-iteration-count:1!important}}
`;

const BODY = `
<div class="scr" id="lobby">
 <div class="top"><h1>📝 三年級 複習</h1><span class="sub">期中考 範圍 · 10 種 限時 遊戲</span><a class="home" href="../index.html">🏠 首頁</a></div>
 <div class="grid" id="grid"></div>
 <div class="rule">一回 8 題 · 每題 15 秒（寫字 20 秒）· 答對 而且 愈快 ＝ 分數 愈高</div>
</div>
<div class="scr" id="game" hidden>
 <div class="hud"><span class="nm" id="gnm"></span><span class="dots" id="dots"></span><span class="sc" id="sc">0</span><button class="qx" id="qx">⬅ 大廳</button></div>
 <div class="tmw"><div class="tm"><i id="tmb"></i></div><span class="tsec" id="tsec">15</span></div>
 <div class="how" id="how"></div>
 <div class="stage" id="stage"></div>
</div>
<div class="scr" id="endv" hidden><div class="end" id="end"></div></div>
<div id="gain"></div>
<div id="fb"><div class="box" id="fbx"></div></div>`;

const JS = `
var GM=${J(GM)}, GL=${J(D.GL)}, PHM=${J(D.PHM)}, CE=${J(D.CE)}, SC=${J(D.SC)}, BOYS=${J(D.BOYS)}, NUMW=${J(D.NUMW)};
${HW.js}
function $(s){return document.querySelector(s)}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
/* ── 聲音：先用預錄的語音檔（慢一點的美式發音），沒有才用瀏覽器語音 ── */
function akey(s){return String(s).replace(/[’]/g,"'").replace(/[=＝≠➜→⇒…＿_　]+/g,' ').replace(/\\s+/g,' ').trim().toLowerCase()}
var AU=null,ST=null,SID=0;
function stopSay(){SID++;clearTimeout(ST);if(AU){try{AU.pause()}catch(e){}AU=null}try{speechSynthesis.cancel()}catch(e){}}
function aud(t,v){var k=akey(t),A=window.ENAUD||{},W=window.ENAUDW||{},f=A[(v==='m'?'m:':'')+k]||A[k];if(f)return 'audio/'+f[0];f=W[k];return f?'audio/w/'+f[0]:''}
function say1(t,v,done){var my=SID,f=aud(t,v),fin=function(){if(my===SID&&done)done()};
 if(f){AU=new Audio(f);AU.onended=fin;AU.onerror=function(){tts(t,fin)};var p=AU.play();if(p&&p.catch)p.catch(function(){tts(t,fin)});return}
 tts(t,fin)}
function tts(t,fin){try{var u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.8;u.onend=fin;u.onerror=fin;speechSynthesis.speak(u)}catch(e){setTimeout(fin,800)}}
function sayList(L,done){stopSay();var i=0,my=SID;(function nx(){if(my!==SID)return;if(i>=L.length){if(done)done();return}var x=L[i++];say1(x[1],x[0],function(){ST=setTimeout(nx,450)})})()}
function sayT(t,done){var v=/^(Hi|Hello), I'm (\\w+)/.exec(t);sayList([[v&&BOYS.indexOf(v[2])>=0?'m':'',t]],done)}
/* ── 狀態 ── */
var G=null,R=null,TM={t0:0,used:0,run:false,T:15,raf:0},BUSY=false;
function lobby(){stopSay();cancelAnimationFrame(TM.raf);$('#game').hidden=true;$('#endv').hidden=true;$('#lobby').hidden=false;$('#fb').classList.remove('on');
 $('#grid').innerHTML=GM.map(function(g,i){var b=ls('g3m_best_'+g.id);return '<button class="gc" data-g="'+i+'" style="--c1:'+g.c1+';--c2:'+g.c2+'"><span class="bd">'+g.ic+'</span><span><b>'+(i+1)+'　'+g.nm+'</b><small>'+g.how+'</small>'+(b?'<span class="best">🏆 最高 '+b+' 分</span>':'')+'</span></button>'}).join('');
 window.scrollTo(0,0)}
function start(i){G=GM[i];var qs=shuf(G.B).slice(0,8);R={i:i,qs:qs,k:-1,score:0,streak:0,res:[],wrong:[]};
 $('#lobby').hidden=true;$('#endv').hidden=true;$('#game').hidden=false;$('#gnm').textContent=G.ic+' '+G.nm;$('#how').textContent=G.how;$('#sc').textContent='0';next()}
function dots(){$('#dots').innerHTML=R.qs.map(function(q,k){return '<i class="'+(R.res[k]===1?'ok':R.res[k]===0?'no':k===R.k?'cur':'')+'"></i>'}).join('')}
function next(){R.k++;BUSY=false;if(R.k>=R.qs.length){end();return}dots();R.q=R.qs[R.k];$('#stage').innerHTML='';REN[G.id](R.q,$('#stage'));tStart(G.t)}
/* ── 倒數（錯題回饋、動畫時暫停：老師第 6 點「不算在限時裡」）── */
function tStart(T){TM.T=T;TM.used=0;TM.t0=performance.now();TM.run=true;tick()}
function tPause(){if(TM.run){TM.used+=(performance.now()-TM.t0)/1000;TM.run=false}}
function tLeft(){return Math.max(0,TM.T-TM.used-(TM.run?(performance.now()-TM.t0)/1000:0))}
function tick(){cancelAnimationFrame(TM.raf);var l=tLeft();$('#tmb').style.transform='scaleX('+(l/TM.T)+')';var s=$('#tsec');s.textContent=Math.ceil(l);s.classList.toggle('low',l<=5&&TM.run);
 if(TM.run&&l<=0){TM.run=false;if(!BUSY){BUSY=true;miss(null)}return}TM.raf=requestAnimationFrame(tick)}
/* ── 對了：100 ＋ 速度 900 ＋ 連對（最多 ＋250）── */
function good(el){if(BUSY)return;BUSY=true;tPause();var l=tLeft(),sp=Math.round(900*l/TM.T),cb=Math.min(250,R.streak*50),p=100+sp+cb;
 R.streak++;R.score+=p;R.res[R.k]=1;dots();$('#sc').textContent=R.score;
 var g=$('#gain');g.innerHTML='<b>＋'+p+'</b><span>✅ 100 ＋ ⚡ 快 '+sp+(cb?' ＋ 🔥 連對 '+cb:'')+'</span>';g.classList.remove('on');void g.offsetWidth;g.classList.add('on');
 boom(el);setTimeout(next,1500)}
function boom(el){var r=el&&el.getBoundingClientRect?el.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0},E=['⭐','✨','🎉','💥','🪙'];
 for(var i=0;i<12;i++){var b=document.createElement('div');b.className='boom';b.textContent=E[i%E.length];b.style.left=(r.left+r.width/2)+'px';b.style.top=(r.top+r.height/2)+'px';
  b.style.setProperty('--dx',(Math.cos(i/12*6.28)*160)+'px');b.style.setProperty('--dy',(Math.sin(i/12*6.28)*160)+'px');b.style.setProperty('--r',(i*40)+'deg');document.body.appendChild(b);setTimeout(function(x){x.remove()}.bind(null,b),1100)}}
/* ── 錯了／時間到 ➜ 綠底 詳細解說：每一個英文字下面 中文、最下面 整句翻譯、自動唸 3 次 才能 下一題（不做類似題）── */
function toks(s){var r=[],re=/([A-Za-z][A-Za-z\\-]*)(’|')(s|m|re)\\b|[A-Za-z][A-Za-z\\-’']*|\\d+|[.,?!]/g,m;
 while((m=re.exec(s))){if(m[2])r.push(m[1],"'"+m[3]);else r.push(m[0])}return r}
function zhOf(w){var k=w.replace(/’/g,"'").toLowerCase();if(GL[k]!==undefined)return GL[k];if(/^[A-Z][a-z]+$/.test(w))return '（名字）';return ''}
function gloss(s){var T=toks(s),h='';for(var i=0;i<T.length;i++){var w=T[i];if(/^[.,?!]$/.test(w))continue;var p='';while(/^[.,?!]$/.test(T[i+1]||'')){p+=T[++i]}
  h+='<span class="gw'+(/^'/.test(w)?' ct':'')+'"><b>'+esc(w.replace(/'/g,'’'))+esc(p)+'</b><i>'+esc(zhOf(w))+'</i></span>'}return '<div class="gls" id="gls">'+h+'</div>'}
function miss(pick){BUSY=true;tPause();R.streak=0;R.res[R.k]=0;dots();var q=R.q,o=FB[G.id](q,pick);R.wrong.push({en:o.say||q.en,show:o.show||q.en});
 var x=$('#fbx');x.innerHTML='<div class="hd">'+(pick==null?'⏰ 時間到':'❌ 答錯了')+'</div>'+(o.you?'<div class="yp">你的答案：'+o.you+'</div>':'')+
  '<div class="ca">✅ 正確答案</div>'+o.body+'<div><span class="tr">整句：'+esc(q.zh)+'</span></div>'+
  '<div class="ft"><span class="n3" id="n3"><span>1</span><span>2</span><span>3</span></span><button class="say" id="fbs">🔊 再聽</button><span id="nxw"></span></div>';
 $('#fb').classList.add('on');if(o.after)o.after();fbFit();
 var c=0,my=++FBN;function one(){if(my!==FBN)return;if(c>=3){var w=$('#nxw');w.innerHTML='<button class="nx" id="fbn">▶ 下一題</button>';
   var n=3,b=$('#fbn');b.textContent='▶ 下一題 '+n;var t=setInterval(function(){if(my!==FBN){clearInterval(t);return}n--;if(n<=0){clearInterval(t);fbGo()}else b.textContent='▶ 下一題 '+n},1000);return}
  c++;var s=$('#n3').children[c-1];s.classList.add('on');var g=$('#gls');if(g){g.classList.remove('spk');void g.offsetWidth;g.classList.add('spk')}
  sayList(o.sl||[['',o.say||q.en]],function(){setTimeout(one,700)})}
 setTimeout(one,500)}
var FBN=0;
function fbFit(){var b=$('#fbx');b.classList.remove('f1','f2');['f1','f2'].forEach(function(c){if(b.scrollHeight>b.clientHeight+2)b.classList.add(c)})}
addEventListener('resize',function(){if($('#fb').classList.contains('on'))fbFit()});
function fbGo(){FBN++;stopSay();$('#fb').classList.remove('on');next()}
document.addEventListener('click',function(e){var t=e.target;if(t.id==='fbn')fbGo();if(t.id==='fbs'){var q=R.q,o=FB[G.id](q,null);sayList(o.sl||[['',o.say||q.en]])}});
/* ── 結束 ── */
function end(){stopSay();cancelAnimationFrame(TM.raf);$('#game').hidden=true;$('#endv').hidden=false;var ok=R.res.filter(function(x){return x===1}).length,st=ok>=7?3:ok>=5?2:1;
 var b=+(ls('g3m_best_'+G.id)||0),nb=R.score>b;if(nb)ls('g3m_best_'+G.id,R.score);
 $('#end').innerHTML='<div class="st">'+[0,1,2].map(function(k){return '<i>'+(k<st?'⭐':'☆')+'</i>'}).join('')+'</div><div class="big">答對 '+ok+' ／ 8　·　'+R.score+' 分'+(nb?'　🏆 新紀錄':'')+'</div>'+
  (R.wrong.length?'<div class="wl">'+R.wrong.map(function(w,k){return '<div>📌 '+esc(w.show)+'<button data-w="'+k+'">🔊</button></div>'}).join('')+'</div>':'<div class="big">🎉 全部答對！</div>')+
  '<div class="btns"><button class="b1" id="again">🔁 再玩一次</button><button class="b2" id="tolob">🎮 換一個遊戲</button></div>';window.scrollTo(0,0)}
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('button'):null;if(!t)return;
 if(t.dataset.g!=null)start(+t.dataset.g);else if(t.id==='again')start(R.i);else if(t.id==='tolob'||t.id==='qx')lobby();else if(t.dataset.w!=null)sayT(R.wrong[+t.dataset.w].en)});
function hearBtn(fn){var b=document.createElement('button');b.className='hear';b.id='hear';b.textContent='🔊 再聽一次';b.onclick=function(){b.classList.add('on');fn();setTimeout(function(){b.classList.remove('on')},1500)};return b}
function H(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}

/* ═══════ 手寫板（四線格：紅線 ＝ 底線）═══════ */
function Pad(host,opt){var self=this,u=0,W=0,Hh=0,cv=document.createElement('canvas'),wrap=H('div','pad'),cx=cv.getContext('2d'),strokes=[],cur=null,dpr=Math.min(2,window.devicePixelRatio||1);
 wrap.appendChild(cv);var lg=H('span','lg','紅線 ＝ 底線');wrap.appendChild(lg);host.appendChild(wrap);
 function size(){var r=host.getBoundingClientRect(),avH=opt.h||Math.max(260,Math.min(innerHeight*(innerHeight>innerWidth?.42:.5),480)),avW=Math.min(r.width||innerWidth,opt.w||560);u=avH/3.5;Hh=avH;W=Math.min(avW,u*3.4);
  cv.width=W*dpr;cv.height=Hh*dpr;cv.style.width=W+'px';cv.style.height=Hh+'px';lg.style.top=(Y(2)+6)+'px';draw()}
 function Y(g){return u*(g+.25)}
 function draw(){cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,Hh);[[0,'#9AA7B5',2,[10,8]],[1,'#9AA7B5',2,[10,8]],[2,'#E53935',5,[]],[3,'#9AA7B5',2,[10,8]]].forEach(function(l){cx.beginPath();cx.setLineDash(l[3]);cx.strokeStyle=l[1];cx.lineWidth=l[2];cx.moveTo(8,Y(l[0]));cx.lineTo(W-8,Y(l[0]));cx.stroke()});
  cx.setLineDash([]);cx.strokeStyle='#1A237E';cx.lineWidth=Math.max(9,u*.09);cx.lineCap='round';cx.lineJoin='round';strokes.forEach(function(s){cx.beginPath();s.forEach(function(p,i){var X=p[0]*u,YY=Y(p[1]);if(i)cx.lineTo(X,YY);else cx.moveTo(X,YY)});if(s.length===1)cx.lineTo(s[0][0]*u+.1,Y(s[0][1]));cx.stroke()})}
 function pt(e){var r=cv.getBoundingClientRect();return [(e.clientX-r.left)/u,(e.clientY-r.top)/u-.25]}
 cv.addEventListener('pointerdown',function(e){if(opt.lock&&opt.lock())return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(x){}cur=[pt(e)];strokes.push(cur);draw()});
 cv.addEventListener('pointermove',function(e){if(!cur)return;e.preventDefault();var p=pt(e),l=cur[cur.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])>.015){cur.push(p);draw()}});
 function up(){cur=null}cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 self.clear=function(){strokes=[];draw()};self.strokes=function(){return strokes};self.size=size;self.empty=function(){return !strokes.length};
 self.img=function(){return cv.toDataURL()};setTimeout(size,0);addEventListener('resize',size)}
/* 在四線格畫一個字母（答錯頁、魔鏡）：用辨識的同一份筆畫 */
function letterCanvas(ch,hpx,col){var st=HW.T[ch][0],u=hpx/3.5,xs=[];st.forEach(function(s){s.forEach(function(p){xs.push(p[0])})});var x0=Math.min.apply(0,xs),x1=Math.max.apply(0,xs),W=Math.max(u*2.2,(x1-x0)*u+u*1.2),ox=(W-(x1-x0)*u)/2-x0*u;
 var c=document.createElement('canvas'),d=2;c.width=W*d;c.height=hpx*d;c.style.height=hpx+'px';var cx=c.getContext('2d');cx.scale(d,d);cx.fillStyle='#fff';cx.fillRect(0,0,W,hpx);
 function Y(g){return u*(g+.25)}[[0,'#9AA7B5',2,[8,6]],[1,'#9AA7B5',2,[8,6]],[2,'#E53935',4,[]],[3,'#9AA7B5',2,[8,6]]].forEach(function(l){cx.beginPath();cx.setLineDash(l[3]);cx.strokeStyle=l[1];cx.lineWidth=l[2];cx.moveTo(4,Y(l[0]));cx.lineTo(W-4,Y(l[0]));cx.stroke()});
 cx.setLineDash([]);cx.strokeStyle=col||'#1A237E';cx.lineWidth=Math.max(6,u*.1);cx.lineCap='round';cx.lineJoin='round';st.forEach(function(s){cx.beginPath();s.forEach(function(p,i){if(i)cx.lineTo(ox+p[0]*u,Y(p[1]));else cx.moveTo(ox+p[0]*u,Y(p[1]))});cx.stroke()});return c}
function writeUI(stage,q,left){var row=H('div','wrow'),L=H('div','wleft'),Rt=H('div','');row.appendChild(L);row.appendChild(Rt);stage.appendChild(row);left(L);
 var pad=new Pad(Rt,{lock:function(){return BUSY}}),bt=H('div','wbtn','<button class="er">🧽 擦掉</button><button class="go">✅ 寫好了</button>');Rt.appendChild(bt);
 bt.querySelector('.er').onclick=function(){if(!BUSY)pad.clear()};
 bt.querySelector('.go').onclick=function(){if(BUSY||pad.empty())return;var j=HW.judge(pad.strokes(),q.want);R.lastImg=pad.img();R.lastGot=j.got;if(j.ok)WOK(q,L);else miss('draw')};return pad}

/* ═══════ 10 種 遊戲 的 畫面 ═══════ */
var REN={},FB={},WOK=null;
/* 1 🔨 字母 打地鼠 */
REN.q1=function(q,st){var lw=H('div','lawn','<div class="gr"></div><div class="holes"></div>'),hs=lw.querySelector('.holes');st.appendChild(hearBtn(function(){sayT(q.say)}));st.appendChild(lw);
 shuf(q.o).forEach(function(c){var h=H('button','hole','<span class="pit"></span><span class="mole"><span class="mb"><span class="sign">'+c+'</span><span class="body"><span class="eye l"></span><span class="eye r"></span><span class="nose"></span></span></span></span>');h.dataset.v=c;
  h.onclick=function(){if(BUSY)return;var hm=H('div','hammer','🔨'),r=h.getBoundingClientRect(),lr=lw.getBoundingClientRect();hm.style.left=(r.left-lr.left+r.width*.35)+'px';hm.style.top=(r.top-lr.top+r.height*.05)+'px';lw.appendChild(hm);
   if(c===q.o[0]){h.classList.add('hit');good(h)}else{h.classList.add('miss');R.pick=c;setTimeout(function(){miss(c)},350);BUSY=true;tPause()}};hs.appendChild(h)});
 setTimeout(function(){sayT(q.say)},350)};
FB.q1=function(q,p){var w=PHM[q.say];return {you:p?'<b style="font-size:1.5em">'+esc(p)+'</b>':'',body:'<div style="font-size:clamp(60px,10vh,100px)">'+w[2]+'</div>'+gloss(q.say).replace('<b>'+q.say,'<b><u style="color:#FFE07A">'+q.say[0]+'</u>'+q.say.slice(1)),say:q.say}};
/* 2 🟡 小精靈 聽句 */
function card2(c){if(c.sc){var s=SC[c.sc];return '<div class="scn">'+s.ic.map(function(x){return '<span>'+x+'</span>'}).join('')+(s.fx?'<span class="fx">'+s.fx+'</span>':'')+'</div>'}
 return '<div class="tag"><div class="tt"><b>HELLO</b>my name is</div><div class="tn">'+esc(c.t)+'</div></div><div class="cake">🎂<span class="cn">'+c.a+'</span></div>'}
REN.q2=function(q,st){var mz=H('div','maze','<div class="bd2"></div><div class="cards"></div><div class="pac"><i></i></div><div class="ghost">👻</div>'),cs=mz.querySelector('.cards'),pac=mz.querySelector('.pac');
 var play=function(){sayList(q.say)};st.appendChild(hearBtn(play));st.appendChild(mz);
 for(var i=0;i<14;i++){var d=H('i','pd');d.style.left=(6+i*6.6)+'%';d.style.bottom='3%';mz.appendChild(d)}
 shuf(q.o.map(function(c,k){return {c:c,k:k}})).forEach(function(o){var b=H('button','pc',card2(o.c));b.dataset.k=o.k;b.onclick=function(){if(BUSY)return;BUSY=true;tPause();var r=b.getBoundingClientRect(),m=mz.getBoundingClientRect();
  pac.style.left=((r.left+r.width/2-m.left)/m.width*100)+'%';pac.style.bottom=((m.bottom-r.bottom)/m.height*100+5)+'%';pac.style.transform='rotate(-90deg)';
  [].forEach.call(mz.querySelectorAll('.pd'),function(x,j){setTimeout(function(){x.classList.add('eat')},j*40)});
  setTimeout(function(){if(o.k===0){b.classList.add('ok');BUSY=false;good(b)}else{b.classList.add('no');miss(o.c)}},750)};cs.appendChild(b)});
 setTimeout(play,350)};
FB.q2=function(q,p){return {you:p?'<span class="pc" style="display:inline-flex;min-height:0;animation:none;transform:scale(.62);margin:-30px -20px">'+card2(p)+'</span>':'',
 body:'<div style="display:flex;justify-content:center"><span class="pc" style="animation:none;min-height:0;padding:10px 20px">'+card2(q.o[0])+'</span></div>'+q.say.map(function(s){return gloss(s[1])}).join('').replace(/id="gls"/g,'').replace('class="gls"','class="gls" id="gls"'),sl:q.say}};
/* 3 🧸 教室 夾娃娃（照片 ＝ 老師給的 Classroom English 截圖）*/
REN.q3=function(q,st){var cw=H('div','claw','<div class="glass"><div class="rail"></div><div class="arm"><div class="rope"></div><div class="hd3"><span class="f l"></span><span class="f r"></span></div></div><div class="chute">🎁</div><div class="caps"></div></div>'),
 caps=cw.querySelector('.caps'),arm=cw.querySelector('.arm'),rope=cw.querySelector('.rope'),hd=cw.querySelector('.hd3'),gl=cw.querySelector('.glass');st.appendChild(hearBtn(function(){sayT(q.say)}));st.appendChild(cw);
 shuf(q.o).forEach(function(k){var b=H('button','cap','<img src="img/'+k+'.jpg" alt="">');b.dataset.k=k;b.onclick=function(){if(BUSY)return;BUSY=true;tPause();var r=b.getBoundingClientRect(),g=gl.getBoundingClientRect();
  arm.style.left=(r.left+r.width/2-g.left)+'px';setTimeout(function(){var dy=r.top-g.top-40;rope.style.height=dy+'px';hd.style.top=dy+'px'},800);
  setTimeout(function(){cw.classList.add('grab');if(k===q.o[0]){b.style.transform='translateY(-'+(r.top-g.top-30)+'px) scale(.8)';rope.style.height='40px';hd.style.top='40px'}else{rope.style.height='40px';hd.style.top='40px'}},1650);
  setTimeout(function(){if(k===q.o[0]){b.classList.add('ok');BUSY=false;good(b)}else{b.classList.add('no');miss(k)}},2500)};caps.appendChild(b)});
 setTimeout(function(){sayT(q.say)},350)};
FB.q3=function(q,p){return {you:p?'<img src="img/'+p+'.jpg" style="height:clamp(60px,9vh,90px);border-radius:10px;border:3px solid #FF8A8A">':'',body:'<img class="ph" src="img/'+q.o[0]+'.jpg">'+gloss(q.say),say:q.say}};
/* 4 ⛏️ 挖礦 寫字母 */
REN.q4=function(q,st){var mc;writeUI(st,q,function(L){L.appendChild(hearBtn(function(){sayT(q.say)}));mc=H('div','mc','<div class="fc f1">❓</div><div class="fc f2"></div><div class="fc f3"></div>');L.appendChild(mc);
  L.appendChild(H('div','ask','寫出 <b>第一個字母</b>（小寫）'))});
 WOK=function(q,L){mc.classList.add('crack');setTimeout(function(){mc.classList.add('brk')},350);setTimeout(function(){var w=PHM[q.say];mc.remove();var lt=H('div','loot',w[2]+'<small><u style="color:#FFE07A">'+q.say[0]+'</u>'+q.say.slice(1)+'</small>');L.insertBefore(lt,L.lastChild);sayT(q.say)},800);good(mc)};
 setTimeout(function(){sayT(q.say)},350)};
function fbWrite(q){var big=Math.round(Math.min(innerHeight*.2,220));return {you:R.lastImg&&R.lastImg.length?'<img src="'+R.lastImg+'" style="height:clamp(70px,11vh,110px);background:#fff;border-radius:10px">'+(R.lastGot&&R.lastGot!==q.want?'<span>（電腦看到的是 <b>'+esc(R.lastGot)+'</b>）</span>':''):'',
 body:'<div class="ltr" id="ltr"></div>',after:function(){var l=$('#ltr');l.appendChild(letterCanvas(q.want,big,'#0A5E2D'));if(G.id==='q5'){var a=H('span','ar','➜'),s=H('span','big',esc(q.show));l.insertBefore(a,l.firstChild);l.insertBefore(s,l.firstChild)}}}}
FB.q4=function(q,p){var o=fbWrite(q),w=PHM[q.say];o.body+='<div style="display:flex;align-items:center;justify-content:center;gap:16px"><span style="font-size:clamp(44px,7vh,70px)">'+w[2]+'</span>'+gloss(q.say).replace('<b>'+q.say,'<b><u style="color:#FFE07A">'+q.say[0]+'</u>'+q.say.slice(1))+'</div>';o.say=q.say;return o};
/* 5 🪞 大小寫 魔鏡 */
REN.q5=function(q,st){var mi;writeUI(st,q,function(L){mi=H('div','mirror');L.appendChild(mi);var up=q.show===q.show.toUpperCase();
  L.appendChild(H('div','ask','鏡子裡 是 '+(up?'<b>大寫</b>':'<b>小寫</b>')+' ➜ 寫 '+(up?'<b>小寫</b>':'<b>大寫</b>')));setTimeout(function(){var h=Math.min(mi.clientHeight*.86,320);mi.appendChild(letterCanvas(q.show,h,'#3A1A80'))},0)});
 WOK=function(q,L){mi.style.transition='transform .6s';mi.style.transform='rotateY(360deg) scale(1.08)';sayList([['',q.want+'.']]);good(mi)}};
FB.q5=function(q){var o=fbWrite(q);o.say=q.want+'.';o.body+=gloss(q.want).replace('<i></i>','<i>'+(q.want===q.want.toUpperCase()?'大寫':'小寫')+'</i>');return o};
/* 6 🧱 數字 金幣磚 */
REN.q6=function(q,st){var sk=H('div','sky'),ob=H('div','objs'),sl=H('div','slots'),qb=H('div','qbs');for(var i=0;i<q.n;i++){var s=H('span','',q.obj);s.style.animationDelay=(i*.06)+'s';ob.appendChild(s)}
 sk.appendChild(ob);sk.appendChild(H('div','ask','有 幾個？拼出 <b>英文</b>'));sk.appendChild(sl);st.appendChild(sk);st.appendChild(qb);var k=0,W=q.want;
 for(var i=0;i<W.length;i++)sl.appendChild(H('div','slot'+(i?'':' on')));
 shuf(W.split('').concat(q.extra)).forEach(function(c){var b=H('button','qb',c);b.onclick=function(){if(BUSY||b.classList.contains('used'))return;b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');
   if(c===W[k]){b.classList.add('used');var r=b.getBoundingClientRect(),cn=H('div','coin','🪙');cn.style.left=r.left+'px';cn.style.top=(r.top-30)+'px';document.body.appendChild(cn);setTimeout(function(){cn.remove()},800);
    var s=sl.children[k];s.innerHTML='<b>'+c+'</b>';s.classList.remove('on');k++;if(sl.children[k])sl.children[k].classList.add('on');if(k>=W.length){sayT(W);good(sl)}}
   else{b.classList.add('bad');R.pick=W.slice(0,k)+c;BUSY=true;tPause();setTimeout(function(){miss(W.slice(0,k)+c)},450)}};qb.appendChild(b)})};
FB.q6=function(q,p){return {you:p?'<s>'+esc(p)+'</s>':'',body:'<div style="font-size:clamp(34px,5vh,50px)">'+new Array(q.n+1).join(q.obj)+'</div><div style="font-size:clamp(50px,8vh,80px);color:#FFE07A">'+q.n+'</div>'+gloss(q.want),say:q.want}};
/* 7 🌱 皮克敏 搬字（拖曳；點一下也可以）*/
REN.q7=function(q,st){var parts=q.s.split('___'),se=H('div','sent',esc(parts[0])+'<span class="gap" id="gap">　</span>'+esc(parts[1])),fd=H('div','field');st.appendChild(se);st.appendChild(fd);st.appendChild(H('div','ask','👆 拖 一隻 皮克敏 到 空格'));
 var C=['#E53935','#1E88E5','#FDD835'];shuf(q.o).forEach(function(w,i){var p=H('div','pk','<span class="wd">'+esc(w)+'</span><span class="bdy" style="--pc:'+C[i]+'"><span class="lf">🌱</span><span class="hd"></span><span class="tr"></span></span>');fd.appendChild(p);
  var sx,sy,mv=false;p.addEventListener('pointerdown',function(e){if(BUSY)return;e.preventDefault();sx=e.clientX;sy=e.clientY;mv=false;p.classList.add('drag');p.classList.remove('back');try{p.setPointerCapture(e.pointerId)}catch(x){}});
  p.addEventListener('pointermove',function(e){if(!p.classList.contains('drag'))return;var dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>8)mv=true;p.style.transform='translate('+dx+'px,'+dy+'px) scale(1.08)';$('#gap').classList.toggle('hot',over(e))});
  function over(e){var g=$('#gap').getBoundingClientRect();return e.clientX>g.left-40&&e.clientX<g.right+40&&e.clientY>g.top-60&&e.clientY<g.bottom+80}
  function drop(e){if(!p.classList.contains('drag'))return;p.classList.remove('drag');$('#gap').classList.remove('hot');if(!mv||over(e))put();else{p.classList.add('back');p.style.transform=''}}
  p.addEventListener('pointerup',drop);p.addEventListener('pointercancel',function(){p.classList.remove('drag');p.classList.add('back');p.style.transform=''});
  function put(){if(BUSY)return;var g=$('#gap');g.textContent=w;p.style.visibility='hidden';if(w===q.o[0]){g.classList.add('fill');sayT(q.say);good(g)}else{R.pick=w;BUSY=true;tPause();setTimeout(function(){miss(w)},400)}}})};
FB.q7=function(q,p){return {you:p?'<s>'+esc(q.s.replace('___',p))+'</s>':'',body:gloss(q.en),say:q.en}};
/* 8 ⚡ 寶可夢 對話 對戰 */
var HP8={e:8,m:8};
REN.q8=function(q,st){if(R.k===0)HP8={e:8,m:8};var line=q.rev?q.b:q.a;
 var ar=H('div','arena','<div class="pf e"></div><div class="pf m"></div><div class="hp e">對手 ⚡<div class="bar"><i style="width:'+(HP8.e/8*100)+'%"></i></div></div><div class="hp m">我 🔥<div class="bar"><i style="width:'+(HP8.m/8*100)+'%"></i></div></div><div class="mon e">🐲</div><div class="mon m">🦊</div><div class="bub">'+esc(line)+'<button id="b8">🔊</button></div>');
 st.appendChild(ar);st.appendChild(H('div','ask8',q.rev?'對手 回答了這一句 ➜ 他 剛剛 被問 什麼？':'對手 說了這一句 ➜ 你 要 回答 什麼？'));var mv=H('div','moves');st.appendChild(mv);
 var play=function(){sayT(line)};ar.querySelector('#b8').onclick=play;
 shuf(q.o).forEach(function(o){var b=H('button','mv',esc(o));b.onclick=function(){if(BUSY)return;if(o===q.o[0]){b.classList.add('ok');var me=ar.querySelector('.mon.m'),en=ar.querySelector('.mon.e');me.classList.add('atk');var bt=H('div','bolt','⚡');bt.style.right='14%';bt.style.top='8%';ar.appendChild(bt);en.classList.add('hurt');HP8.e=Math.max(0,HP8.e-1);ar.querySelector('.hp.e i').style.width=(HP8.e/8*100)+'%';good(b)}
  else{b.classList.add('no');var en=ar.querySelector('.mon.e'),me=ar.querySelector('.mon.m');en.style.transform='translate(-60px,40px)';me.classList.add('hurt');HP8.m=Math.max(0,HP8.m-1);ar.querySelector('.hp.m i').style.width=(HP8.m/8*100)+'%';R.pick=o;BUSY=true;tPause();setTimeout(function(){miss(o)},600)}};mv.appendChild(b)});
 setTimeout(play,350)};
FB.q8=function(q,p){var A=q.rev?q.o[0]:q.a,B=q.rev?q.b:q.o[0];return {you:p?'<s>'+esc(p)+'</s>':'',body:'<div style="font-size:clamp(20px,2.6vh,26px);color:#C8FFD9">A：</div>'+gloss(A).replace('id="gls"','')+'<div style="font-size:clamp(20px,2.6vh,26px);color:#C8FFD9">B：</div>'+gloss(B),sl:[['',A],['m',B]]}};
/* 9 🪪 證件 連連看 */
REN.q9=function(q,st){var w=H('div','cn9','<div class="idc"></div><div></div><div class="nbs"></div><svg></svg>'),ic=w.querySelector('.idc'),nb=w.querySelector('.nbs'),sv=w.querySelector('svg');st.appendChild(w);st.appendChild(H('div','ask','👆 從 學生證 的 圓點 拉一條線 到 年齡（也可以 先點 學生證、再點 數字）'));
 var AV=['🧒','👧','👦','🧑'],L={},sel=null,drag=null;
 q.c.forEach(function(c,i){var b=H('div','id','<span class="av">'+(BOYS.indexOf(c.t)>=0?'👦':'👧')+'</span><span><small>STUDENT</small>Name: '+esc(c.t)+'<br>Age: '+c.w+'</span><span class="dt"></span>');b.dataset.i=i;ic.appendChild(b)});
 shuf(q.c.map(function(c,i){return i})).forEach(function(i){var b=H('button','nb',String(q.c[i].a)+'<span class="dt"></span>');b.dataset.n=i;nb.appendChild(b)});
 function ctr(el,side){var r=el.querySelector('.dt').getBoundingClientRect(),W=w.getBoundingClientRect();return [r.left+r.width/2-W.left,r.top+r.height/2-W.top]}
 function redraw(tmp){var h='';Object.keys(L).forEach(function(i){var a=ctr(ic.children[i]),b=ctr(nb.querySelector('[data-n="'+L[i]+'"]'));h+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="#FFD54A" stroke-width="8" stroke-linecap="round"/>'});
  if(tmp)h+='<line x1="'+tmp[0]+'" y1="'+tmp[1]+'" x2="'+tmp[2]+'" y2="'+tmp[3]+'" stroke="#fff" stroke-width="6" stroke-dasharray="10 8" stroke-linecap="round"/>';sv.innerHTML=h}
 function link(i,n){Object.keys(L).forEach(function(k){if(L[k]===n)delete L[k]});L[i]=n;sel=null;[].forEach.call(w.querySelectorAll('.sel'),function(x){x.classList.remove('sel')});redraw();
  if(Object.keys(L).length===q.c.length){BUSY=true;tPause();var bad=Object.keys(L).filter(function(k){return +L[k]!==+k});setTimeout(function(){if(!bad.length){[].forEach.call(w.querySelectorAll('.id,.nb'),function(x){x.classList.add('ok')});BUSY=false;sayT(q.say);good(nb)}else{R.pick=L;miss(bad)}},300)}}
 function idAt(x,y){var e=document.elementFromPoint(x,y);return e&&e.closest?e.closest('.nb'):null}
 ic.addEventListener('pointerdown',function(e){var c=e.target.closest('.id');if(!c||BUSY)return;e.preventDefault();sel=+c.dataset.i;[].forEach.call(ic.children,function(x){x.classList.toggle('sel',x===c)});drag=ctr(c);try{ic.setPointerCapture(e.pointerId)}catch(x){}});
 ic.addEventListener('pointermove',function(e){if(drag==null)return;var W=w.getBoundingClientRect();redraw([drag[0],drag[1],e.clientX-W.left,e.clientY-W.top])});
 ic.addEventListener('pointerup',function(e){if(drag==null)return;drag=null;var t=idAt(e.clientX,e.clientY);if(t&&sel!=null)link(sel,+t.dataset.n);else redraw()});
 nb.addEventListener('click',function(e){var b=e.target.closest('.nb');if(!b||BUSY||sel==null)return;link(sel,+b.dataset.n)});
 addEventListener('resize',function(){if(R.q===q)redraw()})};
FB.q9=function(q,p){var bad=Array.isArray(p)?p.map(Number):[0,1,2];return {you:'',body:bad.map(function(i){var c=q.c[i];return '<div style="font-size:clamp(22px,3vh,30px);margin-top:4px">🪪 Name: '+esc(c.t)+'　Age: '+c.w+' ➜ <b style="color:#FFE07A;font-size:1.5em">'+c.a+'</b></div>'+gloss(q.lines[i]).replace('id="gls"','')}).join('').replace('class="gls"','class="gls" id="gls"'),
 sl:bad.map(function(i){return [BOYS.indexOf(q.c[i].t)>=0?'m':'',q.lines[i]]})}};
/* 10 🪂 空投 密碼箱 */
REN.q10=function(q,st){var a=H('div','air','<div class="crates"></div>'),cr=a.querySelector('.crates');st.appendChild(hearBtn(function(){sayT(q.say)}));st.appendChild(a);
 shuf(q.o).forEach(function(c){var b=H('button','crt','<span class="fall"><span class="chu">🪂</span><span class="box3"><span class="t"></span><span class="f"><b>'+c+'</b></span></span></span>');b.dataset.c=c;b.onclick=function(){if(BUSY)return;
  if(c===q.o[0]){b.classList.add('open','ok');var lt=H('div','loot','💎');lt.style.cssText='position:absolute;left:50%;bottom:52%;transform:translateX(-50%)';b.querySelector('.fall').appendChild(lt);good(b)}
  else{b.classList.add('no');var s=H('div','smk','💨');b.appendChild(s);R.pick=c;BUSY=true;tPause();setTimeout(function(){miss(c)},500)}};cr.appendChild(b)});
 setTimeout(function(){sayT(q.say)},1200)};
FB.q10=function(q,p){return {you:p?'<s style="font-size:1.6em">'+esc(p)+'</s>':'',body:'<div style="font-size:clamp(60px,11vh,110px);color:#FFE07A;letter-spacing:.1em">'+q.code+'</div>'+gloss(q.en),say:q.say}};
lobby();
`;

const html = `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>三年級 複習</title>
<style>${CSS}</style></head>
<body>${BODY}
${AUD ? '<script src="audio/aud.js"></script><script src="audio/w/aud.js"></script>' : ''}
<script>${JS}</script>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('g3mid/index.html：10 種遊戲、題庫 ' + D.GAMES.map(g => g.B.length).reduce((a, b) => a + b) + ' 題' + (AUD ? '' : '（還沒有語音檔，先用瀏覽器語音）'));
