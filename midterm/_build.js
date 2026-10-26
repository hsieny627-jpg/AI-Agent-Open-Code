/* midterm/_build.js — 📝 四年級 期中複習（2026-10-19 老師第十三次 3(11)；規格 midterm/CLAUDE.md）
 *   node midterm/_build.js  ➜  midterm/index.html（一頁：大廳 ＋ 12 種遊戲）
 * 題庫：midterm/_data.js（唯一真相）。語音：midterm/audio/（node midterm/_audio.js）。照片：midterm/img/（老師給的 Classroom English 截圖切的）。
 * 成績：跟 平常 的 遊戲 一樣（score/_client.js 的 佇列）：題組 g4gm_mt-遊戲（老師看板 類別「📝 期中複習」），一回 10 題，≧ 6 題 才 送。
 * 只放 在 老師 的 教學 總首頁（words/_build_hub.js 的〔📝 四年級 期中複習〕）；在家複習 沒有。 */
const fs = require('fs'), path = require('path');
const D = require('./_data.js'), CL = require('../score/_client.js');
const J = o => JSON.stringify(o).replace(/</g, '\\u003c');
const AUD = fs.existsSync(path.join(__dirname, 'audio/aud.js'));
const GM = D.GAMES.map(g => ({ id: g.id, ic: g.ic, nm: g.nm, how: g.how, sec: g.sec, t: g.id === 'm8' ? 30 : g.t, B: g.B }));   /* 2026-10-26 第二十七次 6-(4)：短文 偵探 每題 30 秒 */
/* 2026-10-26 第二十八次 第 3、4 點：📝 25／50 題 挑戰 的 題庫（D.XB）：跟 考卷 人名、「四年級 複習」、短文 草稿 一題 都 不 一樣；類似 題 約 30%（build 失敗 ＝ 有 問題）*/
{ const L = [], PD = require('./_pas_draft.js'), BAN = /\b(Amy|Ken|Mia|Tom|Frank|Lisa|Peter|Grace)\b/,
    KEY = q => JSON.stringify([q.say || '', q.line || '', q.blank || '', q.spell || '', q.pair || '', q.chat || '', q.pic || '', q.o.slice().sort()]);
  D.GAMES.forEach(g => { const X = D.XB[g.id], old = new Set(g.B.map(KEY)); if (!X || X.length < 5) L.push(g.nm + ' 題庫 不到 5 題');
    X.forEach(q => { if (g.id !== 'm8' && old.has(KEY(q))) L.push(g.nm + ' 跟 四年級 複習 一樣：' + KEY(q)); if (BAN.test(JSON.stringify(q))) L.push(g.nm + ' 用了 用過 的 名字');
      if (new Set(q.o).size !== q.o.length) L.push(g.nm + ' 選項 重複'); if (!q.fe || !q.fz || !q.fs) L.push(g.nm + ' 沒有 答錯頁 的 字'); });
    if (new Set(X.map(KEY)).size !== X.length && g.id !== 'm8') L.push(g.nm + ' 自己 有 一樣 的 題目');
    const sm = X.filter(q => q.sim).length; if (sm < 2 || sm > X.length * .45) L.push(g.nm + ' 類似 題 ' + sm + '／' + X.length); });
  Object.keys(D.PAS).filter(k => /^x/.test(k)).forEach(k => { const t = D.PAS[k].t.join(' '); if (BAN.test(t)) L.push('短文 ' + k + ' 用了 用過 的 名字');
    Object.keys(PD.PAS).forEach(o => { const T = PD.PAS[o].t; T.forEach(x => { if (D.PAS[k].t.indexOf(x) >= 0 && x.length > 22) L.push('短文 ' + k + ' 跟 ' + o + ' 有 一樣 的 句子：' + x); }); }); });
  if (L.length) { console.error('✗ ' + L.join('\n✗ ')); process.exit(1); } }
const AUDX = ['s', 'm1', 'm2'].filter(d => fs.existsSync(path.join(__dirname, 'audio', d, 'aud.js')));

const CSS = `
@font-face{font-family:Andika;src:url(../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark;--gold:#FFD54A;--ok:#2BD46A;--no:#FF5A5A;--line:#2E4058;--k0:#E21B3C;--k1:#1368CE;--k2:#D89E00;--k3:#26890C}
*{box-sizing:border-box}
html,body{margin:0;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;font-weight:700;-webkit-tap-highlight-color:transparent}
body{min-height:100vh;touch-action:manipulation;background:#060912 radial-gradient(1200px 700px at 15% -10%,#1C1446 0,transparent 60%) no-repeat;user-select:none;-webkit-user-select:none}
button{font:inherit;font-weight:700;color:#fff;cursor:pointer;touch-action:manipulation}
.scr{max-width:1280px;margin:0 auto;padding:12px 16px 30px}
/* ── 大廳 ── */
.top{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:6px 0 4px}
.top h1{font-size:clamp(34px,5vh,56px);color:var(--gold);margin:0;letter-spacing:.04em}
.top .sub{font-size:clamp(20px,2.6vh,26px);color:#BFD3E6}
.home{margin-left:auto;display:inline-flex;align-items:center;min-height:52px;padding:4px 20px;border-radius:16px;background:#1B2633;border:3px solid #4A5A6C;color:#fff;text-decoration:none;font-size:22px}
.sec{margin:16px 0 6px;display:flex;align-items:baseline;gap:12px;font-size:clamp(26px,3.4vh,34px);color:#9FD8FF}
.sec small{font-size:clamp(18px,2.2vh,22px);color:#8FA6BE}
.xrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}@media (max-width:640px){.xrow{grid-template-columns:1fr}}
.xb{display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 10px;border-radius:24px;border:4px solid #FFD54A;background:linear-gradient(#5A3A00,#2A1A00);box-shadow:0 0 24px #FFD54A55;min-height:110px}
.xb b{font-size:clamp(28px,4vh,40px);color:#FFE07A}.xb small{font-size:clamp(18px,2.4vh,22px);color:#FFF3C4}
.xpg{font-size:clamp(18px,2.4vh,22px);color:#FFE07A;margin-right:8px;white-space:nowrap}
.lvs{min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center}.lvs .glv{font-size:clamp(30px,5vh,52px);color:#FFE07A;background:#2A1A00;border:3px solid #FFD54A;border-radius:999px;padding:2px 28px}
.lvs .gi{font-size:clamp(80px,15vh,150px)}.lvs .gn{font-size:clamp(36px,6vh,64px);color:#FFD54A}.lvs .gh{font-size:clamp(22px,3.2vh,32px);color:#DDE8F3}
.xtb{margin:8px auto;border-collapse:collapse;font-size:clamp(20px,2.6vh,26px)}.xtb td,.xtb th{border:2px solid #2E4058;padding:4px 14px}.xtb td.ok{color:#2BD46A}.xsc b{font-size:1.5em;color:#FFE07A}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr));gap:14px}
.gc{display:flex;align-items:center;gap:14px;text-align:left;padding:14px;border-radius:22px;border:3px solid var(--line);background:linear-gradient(#17233A,#0D1525);min-height:110px;transition:transform .15s}
.gc:active{transform:scale(.97)}.gc:hover{border-color:var(--gold)}
.gc .bd{flex:0 0 auto;width:74px;height:74px;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:42px;
  background:linear-gradient(135deg,var(--c1),var(--c2));box-shadow:inset 0 2px 0 rgba(255,255,255,.4),0 6px 14px rgba(0,0,0,.45)}
.gc b{display:block;font-size:clamp(24px,2.9vh,30px)}.gc small{display:block;font-size:clamp(19px,2.2vh,22px);color:#B7C8DA;line-height:1.4;margin-top:4px}
.gc .best{display:inline-block;margin-top:6px;font-size:18px;color:#FFE07A}
/* ── 遊戲 ── */
.hud{display:flex;align-items:center;gap:12px;margin:4px 0 8px;flex-wrap:wrap}
.hud .nm{font-size:clamp(24px,3vh,32px);color:var(--gold);display:flex;align-items:center;gap:8px}
.hud .dots{display:flex;gap:6px;flex:1;justify-content:center}.hud .dots i{width:22px;height:22px;border-radius:50%;background:#1A2330;border:3px solid #34475C}
.hud .dots i.ok{background:var(--ok);border-color:var(--ok)}.hud .dots i.no{background:var(--no);border-color:var(--no)}.hud .dots i.cur{border-color:var(--gold);box-shadow:0 0 10px var(--gold)}
.hud .sc{font-size:clamp(26px,3.4vh,36px);color:#FFE07A}
.hud .qx{min-height:52px;padding:4px 16px;border-radius:14px;background:#1B2633;border:3px solid #4A5A6C;font-size:20px}
.tm{height:14px;border-radius:7px;background:#1A2330;overflow:hidden;margin-bottom:10px}.tm i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#FF5A5A,var(--gold))}
.how{font-size:clamp(20px,2.6vh,26px);color:#BFD3E6;text-align:center;margin:2px 0 8px}
.stage{display:flex;flex-direction:column;align-items:center;gap:clamp(10px,1.8vh,18px);min-height:55vh;justify-content:center}
.hear{min-height:70px;padding:6px 30px;border-radius:999px;border:0;background:linear-gradient(#2F7BFF,#1452C4);box-shadow:0 6px 0 #0B347E;font-size:clamp(26px,3.6vh,36px)}
.hear:active{transform:translateY(4px);box-shadow:0 2px 0 #0B347E}.hear.on{animation:hr 1s ease-in-out infinite}
@keyframes hr{50%{box-shadow:0 6px 0 #0B347E,0 0 0 14px rgba(47,123,255,.25)}}
.qline{font-size:clamp(30px,5vh,54px);text-align:center;line-height:1.35;background:#fff;color:#111;border-radius:20px;padding:10px 22px;max-width:100%}
.qline .bl{display:inline-block;min-width:3.2em;border-bottom:5px solid #1368CE;color:#1368CE}
.qzh{font-size:clamp(20px,2.8vh,28px);color:#BFD3E6}
/* 四色 選項（大螢幕 一樣 的 顏色＋形狀） */
.opts{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%}.opts.n3{grid-template-columns:repeat(3,1fr)}.opts.one{grid-template-columns:1fr}
.o{display:flex;align-items:center;justify-content:center;gap:10px;border:0;border-radius:20px;min-height:clamp(84px,12vh,130px);padding:8px 14px;font-size:clamp(24px,3.6vh,40px);box-shadow:0 6px 0 rgba(0,0,0,.35);text-align:center}
.o.c0{background:var(--k0)}.o.c1{background:var(--k1)}.o.c2{background:var(--k2)}.o.c3{background:var(--k3)}
.o:active{transform:translateY(3px)}.o.ok{box-shadow:0 0 0 6px #fff,0 0 30px #7BF0A8;animation:pop .4s}.o.no{opacity:.35}.o.bad{animation:shk .4s;opacity:.5}
@keyframes pop{50%{transform:scale(1.07)}}@keyframes shk{25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
/* 🎈 氣球 */
.bal{display:flex;gap:clamp(10px,3vw,40px);justify-content:center;flex-wrap:wrap}
.bl1{position:relative;width:clamp(110px,15vw,170px);height:clamp(140px,19vw,210px);border:0;background:none;animation:bob 2.4s ease-in-out infinite}
.bl1:nth-child(2){animation-delay:.4s}.bl1:nth-child(3){animation-delay:.8s}.bl1:nth-child(4){animation-delay:1.2s}
.bl1 .bb{position:absolute;inset:0 0 18% 0;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.6),transparent 30%),var(--bc);box-shadow:inset -10px -14px 0 rgba(0,0,0,.18)}
.bl1 .bs{position:absolute;left:50%;bottom:0;width:2px;height:20%;background:#ccc}
.bl1 b{position:absolute;inset:0 0 18% 0;display:flex;align-items:center;justify-content:center;font-size:clamp(56px,9vh,90px);text-shadow:0 3px 0 rgba(0,0,0,.25)}
.bl1.pop .bb,.bl1.pop b{animation:bpop .35s forwards}.bl1.dim{opacity:.3}
@keyframes bob{50%{transform:translateY(-12px)}}@keyframes bpop{to{transform:scale(1.6);opacity:0}}
/* 圖片 卡（人 ＋ 職業） */
.pics{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;width:100%}
.pc{position:relative;width:clamp(170px,24vw,250px);height:clamp(170px,24vw,240px);border-radius:24px;border:4px solid #34475C;background:linear-gradient(#F4F8FF,#D9E6F7);display:flex;align-items:center;justify-content:center}
.pc .pw{font-size:clamp(90px,14vh,140px);line-height:1}.pc .pj{position:absolute;right:10px;bottom:8px;width:44%;height:44%;border-radius:50%;background:#fff;border:4px solid #FFB300;display:flex;align-items:center;justify-content:center;font-size:clamp(40px,6vh,64px);box-shadow:0 4px 10px rgba(0,0,0,.25)}
.pc.ok{border-color:var(--ok);box-shadow:0 0 0 6px var(--ok)}.pc.no{opacity:.35}.pc.bad{border-color:var(--no);animation:shk .4s}
.pc.sm{width:clamp(130px,17vw,180px);height:clamp(130px,17vw,170px)}.pc.sm .pw{font-size:clamp(70px,10vh,100px)}
/* 📷 照片 */
.ph{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:min(100%,920px)}
.ph button{padding:0;border:5px solid #34475C;border-radius:20px;overflow:hidden;background:#000;aspect-ratio:3/2}.ph img{width:100%;height:100%;object-fit:cover;display:block}
.ph button.ok{border-color:var(--ok);box-shadow:0 0 0 5px var(--ok)}.ph button.no{opacity:.3}.ph button.bad{border-color:var(--no);animation:shk .4s}
/* 🎯 靶 */
.tg{display:flex;gap:clamp(12px,3vw,40px);justify-content:center;flex-wrap:wrap}
.tg button{position:relative;width:clamp(130px,17vw,190px);height:clamp(130px,17vw,190px);border-radius:50%;border:0;background:radial-gradient(circle,#fff 0 16%,#E53935 16% 33%,#fff 33% 50%,#E53935 50% 67%,#fff 67% 84%,#E53935 84%);box-shadow:0 8px 18px rgba(0,0,0,.5)}
.tg b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:clamp(48px,7vh,72px);color:#111;text-shadow:0 0 6px #fff,0 0 12px #fff}
.tg button.ok::after{content:'➶';position:absolute;right:-20px;top:-26px;font-size:70px;color:var(--gold);animation:arr .4s ease-out}.tg button.no{opacity:.3}.tg button.bad{animation:shk .4s}
@keyframes arr{from{transform:translate(120px,-120px)}to{transform:none}}
/* 💬 聊天 */
.chat{width:min(100%,860px);background:#0E1726;border:3px solid #22344A;border-radius:24px;padding:14px;display:flex;flex-direction:column;gap:12px}
.bub{max-width:80%;padding:10px 18px;border-radius:22px;font-size:clamp(28px,4.2vh,44px);line-height:1.3}
.bub.a{align-self:flex-start;background:#fff;color:#111;border-bottom-left-radius:6px}.bub.b{align-self:flex-end;background:#2BD46A;color:#062;border-bottom-right-radius:6px}
.bub.q{background:#1B2A40;color:#FFE07A;border:3px dashed #FFE07A}.bub .who{font-size:max(18px,.5em);color:#666;display:block}.bub.b .who{color:#0A5}
.bub.fly{animation:fly .5s cubic-bezier(.2,1.4,.4,1)}@keyframes fly{from{transform:translateY(80px) scale(.6);opacity:0}}
.rep{display:flex;flex-direction:column;gap:10px;width:min(100%,860px)}
.rep button{border:3px solid #34475C;background:#17233A;border-radius:22px;min-height:76px;font-size:clamp(24px,3.6vh,38px);padding:6px 18px}
.rep button.ok{border-color:var(--ok);background:#0F3323}.rep button.no{opacity:.35}.rep button.bad{border-color:var(--no);animation:shk .4s}
/* ✍️ 拼字 */
.sp1{display:flex;align-items:center;gap:16px}.sp1 .ic{font-size:clamp(80px,12vh,120px)}.sp1 .zh{font-size:clamp(34px,5vh,52px);color:#FFE07A}
.slots{display:flex;gap:8px;flex-wrap:nowrap}.slots span{width:clamp(48px,7vw,74px);height:clamp(64px,9vh,90px);border-radius:14px;border:3px dashed #3F6386;display:flex;align-items:center;justify-content:center;font-size:clamp(38px,6vh,62px);background:#0B1520}
.slots span.fix{border-style:solid;border-color:#FFD54A;color:#FFD54A}.slots span.f{border-style:solid;border-color:#5C82A8;animation:pop .3s}.slots span.cur{border-color:#FFD54A;box-shadow:0 0 12px #FFD54A}
.slots.win span{border-color:var(--ok);color:#7BF0A8}.slots.bad{animation:shk .45s}
.tiles{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.tiles button{width:clamp(64px,8.5vw,90px);height:clamp(64px,8.5vw,90px);border-radius:18px;border:0;background:linear-gradient(#FFE07A,#F2B600);color:#3A2600;font-size:clamp(36px,5.6vh,56px);box-shadow:0 5px 0 #A07600}
.tiles button:disabled{opacity:.2}.tiles button:active{transform:translateY(3px)}
.bk{min-height:58px;padding:4px 22px;border-radius:16px;background:#1B2633;border:3px solid #4A5A6C;font-size:22px}
/* 🕵️ 短文 */
.pas{width:min(100%,980px);background:#FFF8E6;color:#2A2010;border-radius:22px;padding:12px 20px;font-size:clamp(24px,3.4vh,36px);line-height:1.5;box-shadow:0 8px 20px rgba(0,0,0,.4)}
.pas span{display:block;border-radius:10px;padding:0 8px;transition:background .4s}.pas span.ev{background:#FFD54A;animation:pop .5s}
.pq{font-size:clamp(28px,4.2vh,42px);color:#FFE07A}
/* 🌳 家族樹 */
.tree{display:grid;grid-template-columns:repeat(6,1fr);gap:8px 10px;width:min(100%,900px);position:relative}
.tree button{grid-column:span 2;justify-self:center;width:clamp(120px,15vw,170px);border-radius:22px;border:4px solid #34475C;background:linear-gradient(#F4F8FF,#D9E6F7);padding:6px 0;font-size:clamp(70px,10vh,104px);line-height:1.15}
.tree .r1{grid-column:2/4}.tree .r1b{grid-column:4/6}.tree .r2{grid-column:2/4}.tree .r2b{grid-column:4/6}
.tree .me{grid-column:3/5;justify-self:center;width:clamp(120px,15vw,170px);border-radius:22px;border:4px dashed #FFD54A;padding:6px 0;text-align:center;font-size:clamp(70px,10vh,104px);line-height:1.15;background:#1B2A40}
.tree .me small{display:block;font-size:22px;color:#FFE07A}
.tree .ln{grid-column:1/-1;height:4px;margin:0 22%;background:#4A5E75;border-radius:2px}
.tree button.ok{border-color:var(--ok);box-shadow:0 0 0 6px var(--ok)}.tree button.no{opacity:.35}.tree button.bad{border-color:var(--no);animation:shk .4s}
.tree .nm{display:block;font-size:22px;color:#333;height:0;overflow:hidden}.tree.show .nm{height:auto}
/* 🧩 字庫 */
.bank{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.bank button{min-width:150px;min-height:76px;border-radius:18px;border:0;background:linear-gradient(#7C4DFF,#5A2BD6);box-shadow:0 5px 0 #3A1890;font-size:clamp(28px,4vh,42px);padding:4px 18px}
.bank button.ok{background:linear-gradient(#2BD46A,#128A43);box-shadow:0 5px 0 #0B5A2B}.bank button.no{opacity:.3}.bank button.bad{animation:shk .4s;background:#7A1F2A}
.bankt{font-size:20px;color:#BFD3E6;letter-spacing:.2em}
/* 回饋 */
.fb{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:40;width:min(96vw,900px);border-radius:24px;padding:12px 18px;text-align:center;display:none;box-shadow:0 10px 30px rgba(0,0,0,.6)}
.fb.on{display:block;animation:fbIn .35s ease-out}
@keyframes fbIn{from{transform:translate(-50%,80px);opacity:0}to{transform:translate(-50%,0);opacity:1}}.fb.ok{background:linear-gradient(#1E9E4F,#0B5A2B);pointer-events:none}.pas span.spl{display:grid;grid-template-columns:auto 1fr;column-gap:.5em}.pas span.spl i{font-style:normal}.fb.no{background:linear-gradient(#5A1420,#2A0810);border:3px solid #FF7A7A}
.fb .t{font-size:clamp(30px,4.6vh,48px)}.fb .you{font-size:clamp(22px,3vh,30px);color:#FFC9C9}.fb .you s{text-decoration-thickness:4px;text-decoration-color:#FF5A5A}
.fb .ans{font-size:clamp(30px,4.6vh,50px);color:#fff;margin:4px 0}.fb .z{font-size:clamp(22px,3vh,30px);color:#FFE07A}
.fb .row{display:flex;gap:12px;justify-content:center;margin-top:8px}.fb button{min-height:60px;padding:4px 26px;border-radius:18px;border:0;font-size:24px;background:#24364D}
.fb button.go{background:linear-gradient(#22C766,#128A43)}.fb button:disabled{opacity:.4}
/* 結束 */
.end{text-align:center}.end .st{font-size:80px}.end .st .dim{opacity:.2}.end .big{font-size:clamp(36px,5.4vh,58px);color:#FFE07A}
.end .note{font-size:clamp(22px,2.8vh,28px);color:#BFD3E6;margin:6px 0}
.wl{text-align:left;width:min(100%,900px);margin:10px auto}.wl .w{background:#151F2E;border:2px solid #2A3B52;border-radius:16px;padding:8px 14px;margin:8px 0;font-size:clamp(20px,2.6vh,26px)}
.wl .w b{color:#7BF0A8}.wl .w button{float:right;min-height:48px;border-radius:12px;border:2px solid #3BD16F;background:#0F3323;padding:2px 14px;font-size:20px}
.nav{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:12px}.nav button{min-height:70px;padding:4px 30px;border-radius:20px;border:0;font-size:clamp(24px,3.2vh,32px);background:#24364D}
.nav button.go{background:linear-gradient(#22C766,#128A43);box-shadow:0 6px 0 #0B5A2B}

/* ══ 2026-10-26 第二十七次 6-(5)：答錯 ＝ 綠底 詳細 解說（100% 照「三年級 複習」g3mid）══ */
#wf{position:fixed;inset:0;z-index:80;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.72);padding:14px}
#wf.on{display:flex}
#wf .box{width:min(1100px,100%);max-height:100%;overflow:auto;background:linear-gradient(#0E7A3A,#0A5E2D);border:5px solid #7BF0A8;border-radius:28px;padding:clamp(14px,2.4vh,26px) clamp(14px,2.6vw,34px);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:fbin2 .35s ease-out}
@keyframes fbin2{from{transform:scale(.85);opacity:0}}
#wf .hd{font-size:clamp(30px,4.6vh,46px);color:#FFE07A;animation:shk .45s}
#wf .yp{margin:8px auto 0;font-size:clamp(20px,2.8vh,28px);color:#FFD6D6;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
#wf .yp s{color:#FFB3B3;text-decoration-thickness:3px}
#wf .ca{margin-top:clamp(8px,1.6vh,16px);font-size:clamp(22px,3vh,30px);color:#C8FFD9}
#wf .gls{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:clamp(6px,1vw,16px) clamp(10px,1.6vw,22px);margin:8px 0}
#wf .gw{display:flex;flex-direction:column;align-items:center;min-width:1.2em;transition:transform .2s}
#wf .gw b{font-size:clamp(38px,7.4vh,76px);line-height:1.12;color:#fff;letter-spacing:.01em}
#wf .gw b u{text-decoration:none;color:#FF5A5A}
#wf .gw i{font-style:normal;font-size:clamp(22px,3.4vh,34px);color:#FFE07A;min-height:1.3em;white-space:nowrap}
#wf .gw.ct{margin-left:calc(-1 * clamp(10px,1.6vw,22px))}
#wf .gls.spk .gw b{animation:spk 1s ease-in-out}
@keyframes spk{40%{transform:scale(1.12);text-shadow:0 0 22px #fff}}
#wf .tr{margin-top:6px;font-size:clamp(24px,3.6vh,36px);color:#fff;background:rgba(0,0,0,.25);border-radius:16px;padding:8px 14px;display:inline-block}
#wf .tip{margin-top:8px;font-size:clamp(22px,3vh,30px);color:#FFF4C2}
#wf .ex{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;margin:6px 0}
#wf .ex .ic{font-size:clamp(60px,10vh,100px)}#wf .ex .num{font-size:clamp(70px,13vh,130px);background:#fff;color:#111;border-radius:16px;padding:0 .25em;line-height:1.1}
#wf .ex img{height:clamp(110px,20vh,200px);border-radius:16px;border:4px solid #fff}
#wf .ex .pc{width:clamp(130px,17vw,180px);height:clamp(130px,17vw,170px)}#wf .ex .pc .pw{font-size:clamp(70px,10vh,100px)}
#wf .ft{margin-top:clamp(10px,1.8vh,18px);display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap}
#wf .n3{display:flex;gap:10px;font-size:clamp(22px,3vh,30px)}#wf .n3 span{width:1.8em;height:1.8em;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.3);border:3px solid #7BF0A8}
#wf .n3 span.on{background:#FFE07A;color:#3A2A00;border-color:#FFE07A;animation:pop .5s}
#wf .nx{min-height:64px;padding:6px 34px;border-radius:999px;border:0;background:linear-gradient(#FFD54A,#E0A800);color:#2A1C00;box-shadow:0 6px 0 #7A5A00;font-size:clamp(25px,3.4vh,34px)}
#wf .say{min-height:56px;padding:4px 22px;border-radius:999px;border:3px solid #fff;background:transparent;font-size:clamp(20px,2.6vh,26px)}
#wf .box.f1 .gw b{font-size:clamp(32px,5.4vh,58px)}#wf .box.f1 .gw i{font-size:clamp(20px,2.7vh,28px)}#wf .box.f1 .ex img{height:clamp(90px,15vh,150px)}
#wf .box.f2 .gw b{font-size:clamp(28px,4.2vh,46px)}#wf .box.f2 .gw i{font-size:clamp(18px,2.3vh,24px)}#wf .box.f2 .tr{font-size:clamp(20px,2.8vh,28px)}#wf .box.f2 .ex{display:none}
.hear.slow{background:linear-gradient(#26A69A,#00796B);box-shadow:0 6px 0 #004D40}
.hrow{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
.q1p{font-size:clamp(70px,11vh,110px);line-height:1}
/* 🕵️ 短文 偵探：第一幕 只 讀 20 秒 ➜ 第二幕 上面 短文、下面 題目 30 秒；答錯 ＝ 原文 那一句 綠底 */
.pas .sp{display:inline-block;min-width:3.6em;color:#8A5A00;font-size:.8em}
.pas span.evg{background:#2BD46A;color:#062;animation:pop .5s}.pas span.evy{background:#FFD54A}
.rd{display:flex;flex-direction:column;align-items:center;gap:14px;width:100%}
.rd .rt{font-size:clamp(28px,4.2vh,42px);color:#FFE07A}.rd .rc{font-size:clamp(60px,10vh,100px);color:#fff;line-height:1}
.rd .go{min-height:76px;padding:6px 40px;border-radius:999px;border:0;font-size:clamp(26px,3.6vh,36px);background:linear-gradient(#22C766,#128A43);box-shadow:0 6px 0 #0B5A2B}
.rd .go:disabled{background:#2A3644;box-shadow:none;color:#8FA6BE}
.nx8{min-height:70px;padding:6px 36px;border-radius:999px;border:0;font-size:clamp(25px,3.4vh,34px);background:linear-gradient(#FFD54A,#E0A800);color:#2A1C00;box-shadow:0 6px 0 #7A5A00}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

const JS = `
var XB=${J(D.XB)},GL=${J(D.GL)},GM=${J(GM)},SEC=${J(D.SEC)},WHO=${J(D.WHO)},JOB=${J(D.JOB)},PAS=${J(D.PAS)},PHOTO=${J(D.PHOTO)},TREE=${J(D.TREE)};
var N=10,R=null,T=[];
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function clr(){T.forEach(clearTimeout);T=[];cancelAnimationFrame(TM.raf);TM.run=false;FBN++;var w=$('#wf');if(w)w.classList.remove('on')}function later(f,ms){T.push(setTimeout(f,ms))}
var COL={m1:['#FF7043','#E91E63'],m2:['#AB47BC','#5E35B1'],m3:['#29B6F6','#1565C0'],m4:['#66BB6A','#2E7D32'],m5:['#EF5350','#B71C1C'],m6:['#26C6DA','#00838F'],
  m8:['#8D6E63','#4E342E'],m9:['#9CCC65','#33691E'],m11:['#FFCA28','#F57F17'],m7:['#FFA726','#E65100'],m10:['#7E57C2','#311B92'],m12:['#EC407A','#880E4F']};
/* 發音（2026-10-26 第二十七次 第 6 點，照「三年級 複習」g3mid）：先用 預錄 語音檔，沒有 才用 瀏覽器 語音
   單字（字首音 氣球、聲音 雙胞胎、數字、拼字）＝ 男聲 慢（audio/m1，ENAUDM）、〔🐢 慢慢 唸〕＝ 更慢（audio/m2，ENAUDSL）；
   句子（答錯頁、短文 偵探）＝ 0.85（audio/s，ENAUDF；'m' ＝ 男聲）；沒有 的 用 原本 的（audio，ENAUD）。
   唸 到 一半 被 新的 唸 打斷：被 打斷 的 那一件「唸完 要 做 的 事」交給 新的 唸（PD），不會 卡住（g3mid 第二十六次 1-7） */
var AU=null,ST=null,SID=0,PD=null;
function akey(s){return String(s).replace(/[’]/g,"'").replace(/[=＝≠➜→⇒…＿_　]+/g,' ').replace(/\\s+/g,' ').trim().toLowerCase()}
function stopSay(){PD=null;SID++;clearTimeout(ST);if(AU){try{AU.pause()}catch(e){}AU=null}try{speechSynthesis.cancel()}catch(e){}}
function aud(t,v){var k=akey(t),X,f;if(v==='M1'||v==='M2'){X=window[v==='M1'?'ENAUDM':'ENAUDSL']||{};f=X[k];if(f)return 'audio/'+(v==='M1'?'m1/':'m2/')+f[0]}
  X=window.ENAUDF||{};f=X[(v==='m'?'m:':'')+k]||X[k];if(f)return 'audio/s/'+f[0];X=window.ENAUD||{};f=X[k];return f?'audio/'+f[0]:''}
function say1(t,v,done){var my=SID,f=aud(t,v),fin=function(){if(my===SID&&done)done()};
  if(f){AU=new Audio(f);AU.onended=fin;AU.onerror=function(){tts(t,fin)};var p=AU.play();if(p&&p.catch)p.catch(function(){tts(t,fin)});return}tts(t,fin)}
function tts(t,fin){try{var u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.8;u.onend=fin;u.onerror=fin;speechSynthesis.speak(u)}catch(e){setTimeout(fin,800)}}
/* L ＝ [[聲音, 英文], …]；gap ＝ 兩個 之間 停 幾毫秒（聲音 雙胞胎 ＝ 500：老師「唸完 第一個 字 停 0.5 秒」） */
function sayList(L,done,gap){var pv=PD;stopSay();var cb=pv||done?function(){if(pv)pv();if(done)done()}:null;PD=cb;var i=0,my=SID;
  (function nx(){if(my!==SID)return;if(i>=L.length){PD=null;if(cb)cb();return}var x=L[i++];say1(x[1],x[0],function(){ST=setTimeout(nx,x[2]||gap||450)})})()}
function say(t){sayList([['',t]])}
/* 題目 的 聲音：字首音 氣球、數字 ＝ 男聲 慢；聲音 雙胞胎 ＝ 第一個 字 ➜ 停 0.5 秒 ➜ 第二個 字；自動 唸 2 次，唸 的 時候 倒數 停住 */
function qList(q,sl){var v=sl?'M2':'M1';if(q.pair)return [[v,q.pair[0]],[v,q.pair[1]]];if(R.g.id==='m1'||R.g.id==='m5')return [[v,q.say]];return [['',q.say]]}
function sayQ(sl,twice){var q=R.q;if(!q.say)return;var L=qList(q,sl),k=R.k;if(twice){L[L.length-1]=L[L.length-1].concat([1300]);L=L.concat(qList(q,sl))}
  tPause();var b=$(sl?'#hslow':'#hear');if(b)b.classList.add('on');
  sayList(L,function(){if(b)b.classList.remove('on');if(R&&R.k===k&&!R.lock)tGo()},q.pair?500:700)}
/* ── 倒數（可以 暫停：唸 題目、答錯頁 的 時候 不算）── */
var TM={t0:0,used:0,run:false,T:15,raf:0};
function tStart(T){TM.T=T;TM.used=0;TM.t0=performance.now();TM.run=true;tick()}
function tPause(){if(TM.run){TM.used+=(performance.now()-TM.t0)/1000;TM.run=false}}
function tGo(){if(!TM.run&&tLeft()>0){TM.t0=performance.now();TM.run=true;tick()}}
function tLeft(){return Math.max(0,TM.T-TM.used-(TM.run?(performance.now()-TM.t0)/1000:0))}
function tick(){cancelAnimationFrame(TM.raf);if(!R)return;var l=tLeft(),b=$('#bar');if(b)b.style.width=(l/TM.T*100).toFixed(2)+'%';
  if(TM.run&&l<=0){TM.run=false;if(!R.lock)pick(-1);return}if(TM.run)TM.raf=requestAnimationFrame(tick)}
/* ── 大廳 ── */
function best(id){try{return +localStorage.getItem('mt_best_'+id)||0}catch(e){return 0}}
function hub(){clr();stopSay();R=null;window.scrollTo(0,0);
  var h='<div class="top"><h1>📝 四年級 期中複習</h1><span class="sub">12 種 遊戲：聽力、閱讀、寫寫看</span><a class="home" href="../index.html">🏠 總首頁</a></div>';
  ['lis','read','write'].forEach(function(s){h+='<div class="sec">'+SEC[s][0]+' '+SEC[s][1]+'<small>'+GM.filter(function(g){return g.sec===s}).length+' 種</small></div><div class="grid">'+
    GM.filter(function(g){return g.sec===s}).map(function(g){var c=COL[g.id],b=best(g.id);return '<button class="gc" data-g="'+g.id+'"><span class="bd" style="--c1:'+c[0]+';--c2:'+c[1]+'">'+g.ic+'</span><span><b>'+g.nm+'</b><small>'+g.how+'</small>'+(b?'<span class="best">🏆 最高 '+b.toLocaleString()+' 分</span>':'')+'</span></button>'}).join('')+'</div>'});
  $('#app').innerHTML=h.replace('</div>','</div>'+xrow())}
/* 2026-10-26 第二十八次 第 3、4 點：大廳 最上面〔📝 25 題〕〔📝 50 題〕＝ 12 關 連著 玩（每題 4／2 分）*/
function xrow(){return '<div class="xrow">'+[25,50].map(function(n){var b=best('x'+n);return '<button class="xb" data-xn="'+n+'"><b>📝 '+n+' 題 挑戰</b><small>12 關 連著 玩 · 每題 '+(100/n)+' 分 · 滿分 100</small>'+(b?'<span class="best">🏆 最高 '+b+' 分</span>':'')+'</button>'}).join('')+'</div>'}
var XOFF={},XN=0;GM.forEach(function(g){XOFF[g.id]=XN;XN+=XB[g.id].length});
/* 抽題：25 ＝ 1 關 3 題、11 關 2 題；50 ＝ 2 關 5 題、10 關 4 題；🔁 類似 ＝ 30%（25 題 8、50 題 15），平均 分 在 各 關；短文 偵探 只 抽 一篇（先 讀 20 秒）*/
function startX(N){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();startX(N)});return}
  clr();var n=GM.length,c=GM.map(function(){return Math.floor(N/n)}),s=c.map(function(){return 0}),pick=GM.map(function(){return null}),I=GM.map(function(g,i){return i});
  shuf(I).slice(0,N-c[0]*n).forEach(function(i){c[i]++});var left=Math.round(N*.3);
  GM.forEach(function(g,i){if(g.id!=='m8')return;var ks=shuf(Object.keys(PAS).filter(function(k){return XB.m8.some(function(q){return q.pas===k})})),L=XB.m8.map(function(q,j){return q.pas===ks[0]?j:-1}).filter(function(j){return j>=0});
    pick[i]=shuf(L).slice(0,c[i]);s[i]=pick[i].filter(function(j){return XB.m8[j].sim}).length;left-=s[i]});
  var SIM=GM.map(function(g){return XB[g.id].map(function(q,j){return q.sim?j:-1}).filter(function(j){return j>=0})}),NEW=GM.map(function(g){return XB[g.id].map(function(q,j){return q.sim?-1:j}).filter(function(j){return j>=0})}),ord=shuf(I);
  while(left>0){var mv=0;ord.forEach(function(i){if(left>0&&!pick[i]&&s[i]<c[i]&&s[i]<SIM[i].length){s[i]++;left--;mv=1}});if(!mv)break}
  var gs=[],idx=[],lvOf=[];GM.forEach(function(g,i){var X=Object.assign({},g,{B:XB[g.id]}),L=pick[i]||shuf(shuf(SIM[i]).slice(0,s[i]).concat(shuf(NEW[i]).slice(0,c[i]-s[i])));L.forEach(function(j){gs.push(X);idx.push(j);lvOf.push(i)})});
  R={x:N,pt:100/N,g:gs[0],gs:gs,idx:idx,lvOf:lvOf,cnt:c,lv:-1,k:0,sc:0,st:0,Q:[],W:[],t0:Date.now(),rd:{}};show()}
/* 換 關：第 N 關 的 開場（遊戲 名字、怎麼玩）*/
function lvSplash(done){var g=R.g;$('#app').innerHTML='<div class="lvs"><div class="glv">第 '+(R.lv+1)+' 關 ／ '+GM.length+'</div><div class="gi">'+g.ic+'</div><div class="gn">'+esc(g.nm)+'</div><div class="gh">'+esc(g.how)+'</div></div>';
  if(window.__NOGO){done();return}later(done,1900)}
/* ── 一回 10 題 ── */
function start(id){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();start(id)});return}
  clr();var g=GM.filter(function(x){return x.id===id})[0];var idx=shuf(g.B.map(function(_,i){return i})).slice(0,N);
  /* 🕵️ 短文 偵探（2026-10-26 第二十七次 6-(4)）：一篇 一篇 來：第 1 篇 先 讀 20 秒 ➜ 它 的 題目 ➜ 第 2 篇 先 讀 20 秒 ➜ 它 的 題目 */
  if(id==='m8'){var ks=shuf(Object.keys(PAS));idx=[];ks.forEach(function(k){idx=idx.concat(shuf(g.B.map(function(q,i){return q.pas===k?i:-1}).filter(function(i){return i>=0})))})}
  R={g:g,idx:idx,k:0,sc:0,st:0,Q:[],W:[],t0:Date.now(),rd:{}};show()}
function frame(body){var g=R.g,c=COL[g.id];
  $('#app').innerHTML='<div class="hud"><span class="nm"><span class="bd" style="display:inline-flex;width:46px;height:46px;border-radius:14px;align-items:center;justify-content:center;font-size:28px;background:linear-gradient(135deg,'+c[0]+','+c[1]+')">'+g.ic+'</span>'+(R.x?'第 '+(R.lv+1)+' 關 · ':'')+g.nm+'</span>'+
    '<span class="dots">'+(R.x?'<span class="xpg">📝 '+(R.k+1)+' ／ '+R.x+'</span>':'')+R.idx.map(function(_,i){if(R.x&&R.lvOf[i]!==R.lv)return '';var x=R.Q[i];return '<i class="'+(x?(x[0]?'ok':'no'):i===R.k?'cur':'')+'"></i>'}).join('')+'</span><span class="sc">⭐ '+R.sc.toLocaleString()+'</span><button class="qx" data-x="hub">✕ 離開</button></div>'+
    '<div class="tm"><i id="bar"></i></div><div class="how">'+g.how+'</div><div class="stage" id="stage">'+body+'</div><div id="fb" class="fb"></div>'}
function show(){if(R.x){R.g=R.gs[R.k];var lv=R.lvOf[R.k];if(lv!==R.lv){R.lv=lv;lvSplash(show);return}}var g=R.g,q=g.B[R.idx[R.k]];R.q=q;R.clickW=null;R.qi=R.idx[R.k];R.lock=false;R.ts=Date.now();
  R.ord=shuf(q.o.map(function(_,i){return i}));var id=g.id,h='';
  if(id==='m8'&&!R.rd[q.pas]){readScene(q);return}
  var HEAR='<button class="hear" id="hear" data-x="hear">🔊 再 聽 一次</button>';
  /* 字首音 氣球、聲音 雙胞胎（老師 6-(1)(2)：聽不清楚）：〔🔊 再 聽 一次〕＋〔🐢 慢慢 唸〕；字首音 氣球 上面 放 圖（這個 字 是 什麼） */
  if(id==='m1'||id==='m2')HEAR=(id==='m1'?'<div class="q1p">'+q.ic+'</div>':'')+'<div class="hrow"><button class="hear" id="hear" data-x="hear">🔊 再 聽 一次</button><button class="hear slow" id="hslow" data-x="slow">🐢 慢慢 唸</button></div>';
  if(id==='m1')h=HEAR+'<div class="bal">'+R.ord.map(function(i,j){return '<button class="bl1" data-o="'+i+'" style="--bc:'+['#E53935','#1E88E5','#FDD835','#43A047'][j]+'"><span class="bb"></span><span class="bs"></span><b>'+q.o[i]+'</b></button>'}).join('')+'</div>';
  else if(id==='m2')h=HEAR+'<div class="pics"><div class="pc sm"><span class="pw">🔈</span><span class="pj">1</span></div><div class="pc sm"><span class="pw">🔈</span><span class="pj">2</span></div></div>'+opts([0,1].map(function(i){return i}),'');
  else if(id==='m3')h=HEAR+'<div class="pics">'+R.ord.map(function(i){return pic(q.o[i],'data-o="'+i+'"')}).join('')+'</div>';
  else if(id==='m4')h=HEAR+'<div class="ph">'+R.ord.map(function(i){return '<button data-o="'+i+'"><img src="img/'+q.o[i]+'.jpg" alt=""></button>'}).join('')+'</div>';
  else if(id==='m5')h=HEAR+'<div class="tg">'+R.ord.map(function(i){return '<button data-o="'+i+'"><b>'+q.o[i]+'</b></button>'}).join('')+'</div>';
  else if(id==='m6')h='<div class="chat" id="chat">'+(q.chat==='A'?'<div class="bub a"><span class="who">A</span>'+esc(q.line)+'</div><div class="bub b q"><span class="who">B</span>？</div>':'<div class="bub a q"><span class="who">A</span>？</div><div class="bub b"><span class="who">B</span>'+esc(q.line)+'</div>')+'</div>'+
    '<div class="rep">'+R.ord.map(function(i){return '<button data-o="'+i+'">'+esc(q.o[i])+'</button>'}).join('')+'</div>';
  else if(id==='m8')h=pasHTML(q.pas)+'<div class="pq">'+esc(q.q.replace(/^📖 /,''))+'</div>'+opts(R.ord,'n3')+'<div id="nx8w"></div>';
  else if(id==='m9')h='<div class="qline">'+esc(q.line)+'</div><div class="tree" id="tree">'+tbtn('grandpa','r1')+tbtn('grandma','r1b')+'<div class="ln"></div>'+tbtn('dad','r2')+tbtn('mom','r2b')+'<div class="ln"></div>'+
    tbtn('brother','')+'<div class="me">🙋<small>me</small></div>'+tbtn('sister','')+'</div>';
  else if(id==='m11')h='<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center">'+pic(q.pic,'')+'<div class="bub a" style="max-width:none">'+esc(q.line)+'</div></div>'+opts(R.ord,'');
  else if(id==='m7'){R.pk=[];var w=q.spell,mid=w.slice(1,-1).split(''),ex=shuf('bcdfghklmnprstvwy'.split('').filter(function(c){return w.indexOf(c)<0})).slice(0,2);R.tiles=shuf(mid.concat(ex));
    h='<div class="sp1"><span class="ic">'+q.ic+'</span></div><div class="slots" id="slots"></div><div class="tiles">'+R.tiles.map(function(c,i){return '<button data-t="'+i+'">'+c+'</button>'}).join('')+'</div><button class="bk" data-x="bk">⌫ 退 一個</button>'}
  else if(id==='m10'||id==='m12')h=(q.pic?pic(q.pic,''):'')+'<div class="qline">'+blank(q.blank)+'</div>'+(id==='m10'?'<div class="bankt">Word Bank</div><div class="bank">'+R.ord.map(function(i){return '<button data-o="'+i+'">'+esc(q.o[i])+'</button>'}).join('')+'</div>':opts(R.ord,'n3'));
  frame(h);if(id==='m7')drawSp();
  tStart(g.t);if(q.say){tPause();later(function(){sayQ(0,id==='m1'||id==='m2'||id==='m5')},450)}}
/* 短文：一行 一句（對話 ＝ 前面 寫 誰 說 的） */
function pasHTML(k){var P=PAS[k];return '<div class="pas" id="pas">'+P.t.map(function(t,i){return '<span data-ev="'+i+'"'+(P.sp?' class="spl"':'')+'>'+(P.sp?'<b class="sp">'+esc(P.sp[i])+':</b><i>'+esc(t)+'</i>':esc(t))+'</span>'}).join('')+'</div>'}
/* 第一幕：只 有 短文，20 秒 先 讀；讀完 才 解鎖〔▶ 開始 回答〕（不算 在 每題 30 秒 裡） */
function readScene(q){var n=Object.keys(R.rd).length+1,c=window.__RD||20,k=R.k;   /* window.__RD ＝ 量測 用（縮短）*/
  frame('<div class="rd"><div class="rt">📖 第 '+n+' 篇：先 仔細 讀 '+c+' 秒</div>'+pasHTML(q.pas)+'<div class="rc" id="rc">'+c+'</div><button class="go" id="rdgo" data-x="rdgo" disabled>🔒 讀完 才 能 開始</button></div>');
  var b=$('#bar');if(b)b.style.width='100%';
  (function cd(){if(!R||R.k!==k||R.rd[q.pas])return;if(c<=0){var g=$('#rdgo');g.disabled=false;g.textContent='▶ 開始 回答（第 '+(R.k+1)+' 題）';$('#rc').textContent='✔';return}
    $('#rc').textContent=c;if(b)b.style.width=(c/(window.__RD||20)*100)+'%';c--;later(cd,1000)})()}
function opts(ord,cls){var q=R.q,isM2=R.g.id==='m2';var o=isM2?[0,1].map(function(_,j){return q.o.indexOf(j===0?'⭕ Same':'❌ Different')}):ord;
  return '<div class="opts '+(cls||'')+(o.length===2?'':'')+'">'+o.map(function(i,j){return '<button class="o c'+(isM2?(j?0:3):j)+'" data-o="'+i+'">'+esc(q.o[i])+'</button>'}).join('')+'</div>'}
function pic(p,attr){var a=String(p).split('|'),w=WHO[a[0]],j=a[1]?JOB[a[1]]:null;return '<button class="pc" '+attr+' aria-label="'+esc(w[1]+(j?' '+j[1]:''))+'"><span class="pw">'+w[0]+'</span>'+(j?'<span class="pj">'+j[0]+'</span>':'')+'</button>'}
function tbtn(w,c){var i=R.q.o.indexOf(w);return '<button class="'+c+'" data-o="'+(i<0?3:i)+'" data-w="'+w+'">'+WHO[w][0]+'</button>'}   /* 2026-10-26 第二十九次：選項 不 寫 中文（家族樹 只 有 人 的 圖）*/
function blank(s){return esc(s).replace('___','<span class="bl" id="bl">&nbsp;</span>')}
function drawSp(){var w=R.q.spell,n=w.length,h='';for(var i=0;i<n;i++){var f=i===0||i===n-1,k=i-1,v=f?w[i]:(R.pk[k]!=null?R.tiles[R.pk[k]]:'');
    h+='<span class="'+(f?'fix':v?'f':'')+(!f&&k===R.pk.length?' cur':'')+'">'+v+'</span>'}$('#slots').innerHTML=h;
  $$('.tiles button').forEach(function(b){b.disabled=R.pk.indexOf(+b.getAttribute('data-t'))>=0||R.lock})}

/* 答 一題：i ＝ 選了 原本 的 第幾個（0 ＝ 正解；-1 ＝ 時間 到） */
function pick(i,you){if(!R||R.lock)return;R.lock=true;var q=R.q,ms=Date.now()-R.ts,ok=i===0,left=i<0?0:tLeft()/TM.T;   /* 剩下 ＝ 倒數 的（唸 題目 的 時間 不算） */
  R.Q.push([ok?1:0,i,Math.round(ms/100)/10,i>=0&&ms<1000?1:0,ok?Math.round(left*1000)/1000:0,R.x?XOFF[R.g.id]+R.qi:R.qi]);   /* 25／50 題：題庫 ＝ 挑戰 題庫（12 種 接起來）*/
  tPause();stopSay();
  var id=R.g.id;
  $$('#stage [data-o]').forEach(function(b){var k=+b.getAttribute('data-o'),w=b.getAttribute('data-w');if(w)k=w===q.o[0]?0:w===R.clickW?i:-9;b.disabled=true;if(k===0)b.classList.add('ok');else if(k===i){b.classList.add('bad');if(id==='m1')b.classList.add('pop')}else b.classList.add('no')});
  if(id==='m1'&&ok){var bb=$('#stage [data-o="0"]');if(bb)bb.classList.add('pop')}
  if(id==='m8')[].concat(q.ev).forEach(function(v){var e=$('#pas [data-ev="'+v+'"]');if(e)e.classList.add(ok?'evy':'evg')});
  if(id==='m9'){var t=$('#tree');if(t)t.classList.add('show')}
  if((id==='m10'||id==='m12')&&$('#bl'))$('#bl').innerHTML=esc(q.o[0]);
  if(id==='m6'){var qb=$('#chat .q');if(qb){qb.classList.remove('q');qb.classList.add('fly');qb.innerHTML='<span class="who">'+(q.chat==='A'?'B':'A')+'</span>'+esc(q.o[0])}}
  if(id==='m7'){$('#slots').classList.add(ok?'win':'bad');if(!ok)$('#slots').innerHTML=q.spell.split('').map(function(c){return '<span class="f" style="border-color:#2BD46A;color:#7BF0A8">'+c+'</span>'}).join('')}
  if(ok){R.st++;var s=R.x?R.pt:100+Math.round(900*left)+Math.min(250,50*(R.st-1));R.sc+=s;fb(true,'⭐ 答對！ ＋'+s+(R.x?' 分':'')+(R.st>1?'　🔥 連對 '+R.st:''));
    /* 短文 偵探 答對：不 自己 走，解鎖〔▶ 下一題〕（老師 6-(4)） */
    if(id==='m8'){$('#nx8w').innerHTML='<button class="nx8" data-x="next">▶ 下一題</button>';sayList(q.fs)}else{if(q.ae)sayList([['',q.ae]]);later(next,1500)}}
  else{R.st=0;R.W.push(R.qi);var yt=i<0?'':you||(q.oz?q.oz[i]:q.o[i]);
    /* 短文 偵探 答錯：原文 那一句 綠底 ➜ 唸 一次 ➜ 獨立 的 秒懂 頁（逐字 中文＋整句 翻譯）再 唸 一次 ➜ 才 解鎖〔下一題〕 */
    if(id==='m8'){var my=FBN;sayList(q.fs,function(){if(my===FBN&&R&&R.q===q)later(function(){miss(i,yt,1)},500)})}else miss(i,yt,3)}}
/* ══ 答錯 ＝ 綠底 詳細 解說（2026-10-26 第二十七次 6-(5)：100% 照「三年級 複習」）：
   ❌ 你的 答案 ➜ ✅ 正確 答案（每一個 英文字 正下方 ＝ 中文）➜ 整句：翻譯 ➜ 自動 唸 3 次（① ② ③，短文 偵探 1 次）➜〔▶ 下一題 3〕3 秒 自己 走 ══ */
var FBN=0;
function toks(s){var r=[],re=/([A-Za-z][A-Za-z\-]*)(’|')(s|m|re)\b|[A-Za-z][A-Za-z\-’']*|\d+|[.,?!]/g,m;
  while((m=re.exec(s))){if(m[2]&&m[1].toLowerCase()!=='let')r.push(m[1],"'"+m[3]);else r.push(m[0])}return r}
function zhOf(w,gx){var k=w.replace(/’/g,"'").toLowerCase();if(gx&&gx[k]!==undefined)return gx[k];if(GL[k]!==undefined)return GL[k];if(/^[A-Z][a-z]+$/.test(w))return '（名字）';return ''}
function gloss(s,gx,red1){var T=toks(s),h='';for(var i=0;i<T.length;i++){var w=T[i];if(/^[.,?!]$/.test(w))continue;var p='';while(/^[.,?!]$/.test(T[i+1]||'')){p+=T[++i]}
    var W=esc(w.replace(/'/g,'’'));if(red1)W='<u>'+W.charAt(0)+'</u>'+W.slice(1);
    h+='<span class="gw'+(/^'/.test(w)?' ct':'')+'"><b>'+W+esc(p)+'</b><i>'+esc(zhOf(w,gx))+'</i></span>'}return '<div class="gls" id="gls">'+h+'</div>'}
function picDiv(p){var a=String(p).split('|'),w=WHO[a[0]],j=a[1]?JOB[a[1]]:null;return '<div class="pc"><span class="pw">'+w[0]+'</span>'+(j?'<span class="pj">'+j[0]+'</span>':'')+'</div>'}
function exHTML(q){var id=R.g.id;
  if(id==='m1'||id==='m7')return '<span class="ic">'+q.ic+'</span>';if(id==='m5'||(id==='m12'&&!q.ae))return '<span class="num">'+esc(q.o[0])+'</span>';
  if(id==='m3')return picDiv(q.o[0]);if(id==='m11'||q.pic)return q.pic&&q.pic!==1?picDiv(q.pic):'';if(id==='m4')return '<img src="img/'+q.o[0]+'.jpg" alt="">';
  if(id==='m9')return picDiv(q.o[0]);return ''}
function miss(i,you,REP){var q=R.q,id=R.g.id,my=++FBN,ex=exHTML(q);tPause();
  var x=$('#wbox');x.className='box';x.innerHTML='<div class="hd">'+(i<0?'⏰ 時間到':'❌ 答錯了')+'</div>'+(i>=0&&you?'<div class="yp">你的答案：<s>'+esc(you)+'</s></div>':'')+
    '<div class="ca">✅ 正確答案</div>'+(ex?'<div class="ex">'+ex+'</div>':'')+gloss(q.fe,q.gx,id==='m1'||id==='m2')+'<div><span class="tr">整句：'+esc(q.fz)+'</span></div>'+(q.tip?'<div class="tip">💡 '+esc(q.tip)+'</div>':'')+
    '<div class="ft"><span class="n3" id="n3">'+(REP===1?'<span>1</span>':'<span>1</span><span>2</span><span>3</span>')+'</span><button class="say" id="wfs">🔊 再聽</button><span id="nxw"></span></div>';
  $('#wf').classList.add('on');wFit();var c=0;
  function one(){if(my!==FBN)return;if(c>=REP){var w=$('#nxw');w.innerHTML='<button class="nx" id="wfn">▶ 下一題</button>';
      var n=3,b=$('#wfn');b.textContent='▶ 下一題 '+n;var t=setInterval(function(){if(my!==FBN){clearInterval(t);return}n--;if(n<=0){clearInterval(t);wGo()}else b.textContent='▶ 下一題 '+n},1000);return}
    c++;var s=$('#n3').children[c-1];s.classList.add('on');var g=$('#gls');if(g){g.classList.remove('spk');void g.offsetWidth;g.classList.add('spk')}
    sayList(q.fs,function(){setTimeout(one,700)},id==='m2'?500:450)}
  setTimeout(one,500)}
function wFit(){var b=$('#wbox');b.classList.remove('f1','f2');['f1','f2'].forEach(function(c){if(b.scrollHeight>b.clientHeight+2)b.classList.add(c)})}
addEventListener('resize',function(){if($('#wf').classList.contains('on'))wFit()});
function wGo(){FBN++;stopSay();$('#wf').classList.remove('on');next()}
function fb(ok,t,you,ans,z){var e=$('#fb');e.className='fb on '+(ok?'ok':'no');
  e.innerHTML=ok?'<div class="t">'+t+'</div>':'<div class="you">'+you+'</div><div class="ans">✅ '+esc(ans)+'</div>'+(z?'<div class="z">'+esc(z)+'</div>':'')+
    '<div class="row">'+(R.q.ae?'<button data-x="say">🔊 聽</button>':'')+'<button class="go" data-x="next" id="nx" disabled>▶ 下一題</button></div>';
  if(!ok)later(function(){var b=$('#nx');if(b)b.disabled=false},1800)}
function next(){clr();stopSay();R.k++;if(R.k>=R.idx.length){fin();return}show()}
/* 結束：星星、答對 幾題、記 成績、錯題 */
function fin(){if(R.x){finX();return}var n=R.Q.length,ok=0,fast=0;R.Q.forEach(function(x){ok+=x[0];fast+=x[3]});var st=ok>=n-1?3:ok>=n*.6?2:1,rec=n>=6&&fast*2<=n&&rec1();
  try{if(R.sc>best(R.g.id))localStorage.setItem('mt_best_'+R.g.id,R.sc)}catch(e){}
  var g=R.g,h='<div class="end"><div class="st">'+Array(st+1).join('⭐')+'<span class="dim">'+Array(4-st).join('⭐')+'</span></div><div class="big">'+g.ic+' '+g.nm+'：答對 '+ok+' ／ '+n+' 題</div>'+
    '<div class="note">⭐ '+R.sc.toLocaleString()+' 分　'+(rec?'📝 記進 成績 了（練習次數 ＋1）':fast*2>n?'⚠️ 太快 亂按 超過 一半：這一回 不算 成績':(typeof SCID!=='undefined'&&SCID?'📶 沒有 網路：先 存 在 平板':'（沒有 登入：沒有 記 成績）'))+'</div>';
  if(R.W.length)h+='<div class="wl"><div class="note">📌 答錯 的 題目（按〔🔊〕聽）</div>'+R.W.map(function(k){var q=g.B[k];return '<div class="w">'+(q.ae?'<button data-say="'+esc(q.ae)+'">🔊</button>':'')+esc(q.q)+'<br>✅ <b>'+esc(q.oz?q.oz[0]:q.o[0])+'</b>　'+esc(q.z||'')+'</div>'}).join('')+'</div>';
  h+='<div class="nav"><button class="go" data-x="again">🔁 再 玩 一次</button><button data-x="hub">🎮 換 一個 遊戲</button></div>'+(typeof scByeHTML==='function'&&typeof SCID!=='undefined'&&SCID?scByeHTML():'')+'</div>';
  $('#app').innerHTML=h;window.scrollTo(0,0)}
/* 25／50 題 結束：得分 ／ 100、每一關 答對 幾題、答錯 的 題目 */
function finX(){var n=R.Q.length,ok=0,fast=0;R.Q.forEach(function(x){ok+=x[0];fast+=x[3]});var sc=Math.round(ok*R.pt),st=sc>=90?3:sc>=70?2:1,rec=n>=6&&fast*2<=n&&rec1();
  try{if(sc>best('x'+R.x))localStorage.setItem('mt_best_x'+R.x,sc)}catch(e){}
  var h='<div class="end"><div class="st">'+Array(st+1).join('⭐')+'<span class="dim">'+Array(4-st).join('⭐')+'</span></div><div class="big xsc">📝 '+R.x+' 題 挑戰：<b>'+sc+'</b> 分 ／ 100</div><div class="big">答對 '+ok+' ／ '+R.x+'（每題 '+R.pt+' 分）</div>'+
    '<div class="note">'+(rec?'📝 記進 成績 了':fast*2>n?'⚠️ 太快 亂按 超過 一半：這一回 不算 成績':(typeof SCID!=='undefined'&&SCID?'📶 沒有 網路：先 存 在 平板':'（沒有 登入：沒有 記 成績）'))+'</div>'+
    '<table class="xtb"><tr><th>關</th><th>遊戲</th><th>答對</th></tr>'+GM.map(function(g,i){var a=0,m=0;R.lvOf.forEach(function(l,k){if(l===i){m++;if(R.Q[k]&&R.Q[k][0])a++}});return '<tr><td>'+(i+1)+'</td><td>'+g.ic+' '+esc(g.nm)+'</td><td class="'+(a===m?'ok':'')+'">'+a+' ／ '+m+'</td></tr>'}).join('')+'</table>';
  var W=[];R.Q.forEach(function(x,k){if(!x[0])W.push(R.gs[k].B[R.idx[k]])});
  if(W.length)h+='<div class="wl"><div class="note">📌 答錯 的 題目（按〔🔊〕聽）</div>'+W.map(function(q){return '<div class="w">'+(q.ae?'<button data-say="'+esc(q.ae)+'">🔊</button>':'')+esc(q.q)+'<br>✅ <b>'+esc(q.oz?q.oz[0]:q.o[0])+'</b>　'+esc(q.z||'')+'</div>'}).join('')+'</div>';
  h+='<div class="nav"><button class="go" data-xn="'+R.x+'">🔁 再 挑戰 一次</button><button data-x="hub">🎮 回 大廳</button></div>'+(typeof scByeHTML==='function'&&typeof SCID!=='undefined'&&SCID?scByeHTML():'')+'</div>';
  $('#app').innerHTML=h;window.scrollTo(0,0)}
function rec1(){try{if(typeof scLive!=='function'||!scLive())return false;var u=SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  var Rr={id:SCID,set:R.x?'g4gm_mt-x'+R.x:'g4gm_mt-'+R.g.id,name:R.x?'📝 期中複習｜📝 '+R.x+' 題 挑戰':'📝 期中複習｜'+R.g.ic+' '+R.g.nm,m:'g',qs:R.Q,raw:R.sc,fix:0,mp:0,mw:0,sec:Math.round((Date.now()-R.t0)/1000),src:'school',dev:SCDEV,u:u,t:Date.now()};
  var QQ=scGet('q')||[];QQ.push(Rr);scPut('q',QQ.slice(-200));scFlush();return true}catch(e){return false}}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if((b=c('[data-g]'))){start(b.getAttribute('data-g'));return}
  if((b=c('[data-xn]'))){startX(+b.getAttribute('data-xn'));return}
  if((b=c('[data-x]'))){var a=b.getAttribute('data-x');if(a==='hub')hub();else if(a==='hear')sayQ(0);else if(a==='say')say(R.q.ae);else if(a==='next'){if(!b.disabled)next()}
    else if(a==='slow')sayQ(1);else if(a==='rdgo'){if(!b.disabled){R.rd[R.q.pas]=1;show()}}
    else if(a==='again')start(R.g.id);else if(a==='bk'&&R&&!R.lock){R.pk.pop();drawSp()}return}
  if((b=c('[data-say]'))){say(b.getAttribute('data-say'));return}
  if(t.id==='wfn'){wGo();return}if(t.id==='wfs'){sayList(R.q.fs,null,R.g.id==='m2'?500:450);return}
  if(!R||R.lock)return;
  if((b=c('#stage [data-o]'))){var i=+b.getAttribute('data-o');R.clickW=b.getAttribute('data-w');if(i>=0)pick(i,R.clickW?WHO[R.clickW][1]:'');return}
  if((b=c('[data-t]'))){var k=+b.getAttribute('data-t');if(R.pk.indexOf(k)>=0)return;R.pk.push(k);drawSp();var w=R.q.spell;
    if(R.pk.length>=w.length-2){var s=w[0]+R.pk.map(function(x){return R.tiles[x]}).join('')+w.slice(-1);pick(s===w?0:1,s)}}});
hub();
`;

const html = `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>四年級 期中複習</title>
<style>${CSS}</style></head>
<body>
${CL.home(4, '../', 'school')}
${AUD ? '<script src="audio/aud.js"></script>' : ''}
${AUDX.map(d => '<script src="audio/' + d + '/aud.js"></script>').join('')}
<div id="wf"><div class="box" id="wbox"></div></div>
<div id="app" class="scr"></div>
<script>${JS}</script>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('midterm ok：' + GM.length + ' 種遊戲、' + GM.reduce((s, g) => s + g.B.length, 0) + ' 題；' + Math.round(html.length / 1024) + ' KB');
