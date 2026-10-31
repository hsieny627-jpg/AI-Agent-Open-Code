/* midterm/_build.js — 📝 四年級 期中複習（2026-10-19 老師第十三次 3(11)；規格 midterm/CLAUDE.md）
 *   node midterm/_build.js  ➜  midterm/index.html（一頁：大廳 ＋ 12 種遊戲）
 * 題庫：midterm/_data.js（唯一真相）。語音：midterm/audio/（node midterm/_audio.js）。照片：midterm/img/（老師給的 Classroom English 截圖切的）。
 * 成績：跟 平常 的 遊戲 一樣（score/_client.js 的 佇列）：題組 g4gm_mt-遊戲（老師看板 類別「📝 期中複習」），一回 10 題，≧ 6 題 才 送。
 * 只放 在 老師 的 教學 總首頁（words/_build_hub.js 的〔📝 四年級 期中複習〕）；在家複習 沒有。 */
const fs = require('fs'), path = require('path');
const DECX = require('../g3mid/_decode.js'), NGX = require('./_newgames.js'), D = require('./_data.js'), CL = require('../score/_client.js');
const J = o => JSON.stringify(o).replace(/</g, '\\u003c');
const AUD = fs.existsSync(path.join(__dirname, 'audio/aud.js'));
const GM = D.GAMES.map(g => ({ id: g.id, ic: g.ic, nm: g.nm, how: g.how, sec: g.sec, t: g.id === 'm8' ? 30 : g.t, B: g.B, solo: g.solo || '' }));   /* 2026-10-26 第二十七次 6-(4)：短文 偵探 每題 30 秒 */
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
.tiles button:disabled{opacity:.2}
/* 第三十二次 第 4 點：母音 紅、不發音 灰 */.slots span.lv,.slots.win span.lv{color:#FF6B6B}.slots span.ls,.slots.win span.ls{color:#8A94A6}.tiles button.lv{color:#C62828}.gls b .lv{color:#FF6B6B}.gls b .ls{color:#8A94A6}.tiles button:active{transform:translateY(3px)}
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
#crgo{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;background:rgba(5,10,25,.9)}.crgob{text-align:center;color:#fff;border:4px solid #FFD54A;border-radius:28px;padding:28px 40px;background:linear-gradient(#24364D,#13203A)}.crgot{font-size:clamp(34px,5vh,54px);font-weight:900;color:#FFE07A;margin:8px 0}
.xoff{text-align:center;font-size:clamp(18px,2.4vh,24px);color:#9FB3C8;padding:6px;margin:6px 0;border:2px dashed #3F6386;border-radius:16px}
#xq{position:fixed;inset:0;z-index:90;display:none;align-items:center;justify-content:center;background:rgba(5,10,25,.82)}#xq.on{display:flex}
.xqb{width:min(92vw,720px);border-radius:28px;border:4px solid #FFD54A;background:linear-gradient(#24364D,#13203A);padding:22px 20px;text-align:center;box-shadow:0 20px 60px #000a}
.xqi{font-size:64px}.xqh{font-size:clamp(32px,4.6vh,46px);font-weight:900;color:#FFE07A}.xqt{font-size:clamp(22px,3vh,30px);line-height:1.5;margin:10px 0 16px}.xqt b{color:#7BF0A8}
.xqbtn{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}.xqbtn button{min-height:72px;min-width:240px;border-radius:20px;border:0;font-size:clamp(24px,3vh,30px);font-weight:900;color:#fff}
#xstay{background:linear-gradient(#22C766,#128A43)}#xleave{background:#3A4A66}
.xbw{display:flex;flex-direction:column;gap:8px}.xbw .xb{border-color:#2BD46A;background:linear-gradient(#0E5A2E,#06301A)}
.xb2{min-height:52px;border-radius:16px;border:2px solid #FFD54A88;background:#2A2A3A;color:#FFE07A;font-size:22px;font-weight:800}
.fb{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:40;width:min(96vw,900px);border-radius:24px;padding:12px 18px;text-align:center;display:none;box-shadow:0 10px 30px rgba(0,0,0,.6)}
.fb.on{display:block;animation:fbIn .35s ease-out}
.fb.sm{top:10px;bottom:auto;width:auto;max-width:min(92vw,560px);padding:6px 22px;border-radius:999px;animation:none}.fb.sm .t{font-size:clamp(20px,2.8vh,28px)}
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
/* ── 🏠 25 題 闖關（回家；home.html，2026-10-30 第三十四次 第 1～4 點）── */
#hm25{position:fixed;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;padding:16px;background:radial-gradient(circle at 50% 20%,#24427A,#070A16 70%);overflow:auto}
#hm25[hidden]{display:none}
.hmw{display:flex;flex-direction:column;align-items:center;gap:clamp(10px,2.2vh,22px);text-align:center;max-width:900px}
.hmt{font-size:clamp(34px,5.4vh,56px);color:#FFE07A;text-shadow:0 4px 0 #6B4A00}
.hms{font-size:clamp(30px,5vh,52px);color:#fff;background:rgba(255,255,255,.08);border:4px solid #FFE07A;border-radius:24px;padding:clamp(10px,2vh,20px) clamp(16px,3vw,32px);line-height:1.35}
.hmk{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}.hmk span{font-size:clamp(20px,2.8vh,28px);background:#14243E;border:3px solid #3E5C88;border-radius:999px;padding:4px 16px;color:#DDEBFF}
.hmb{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
.hmb button{min-height:clamp(76px,11vh,104px);padding:6px clamp(26px,4vw,48px);border-radius:24px;font-size:clamp(30px,4.6vh,46px);border:4px solid #7BF0A8;background:linear-gradient(#36D27A,#1E9E55);color:#06210F;box-shadow:0 8px 0 #0E5A2E;animation:hmgo 1.6s ease-in-out infinite alternate}
.hmb button.b2{background:linear-gradient(#3A4A66,#243048);border-color:#6F86A6;color:#fff;box-shadow:0 8px 0 #121A28;animation:none;font-size:clamp(24px,3.4vh,34px)}
.hmb small{display:block;font-size:.55em;color:#0A3A1C}
.hmbest{font-size:clamp(22px,3vh,30px);color:#FFE07A}
.hmbo{margin-top:6px;font-size:clamp(20px,2.8vh,26px);color:#FFE9A8}.hmbo b{color:#FFD54A;font-size:1.3em}
.hmrv{display:inline-flex;align-items:center;min-height:56px;margin-top:14px;padding:4px 26px;border-radius:18px;border:3px solid #FFD54A;background:#221B05;color:#FFE9A8;font-size:clamp(20px,2.8vh,26px);font-weight:700;text-decoration:none}
@keyframes hmgo{to{transform:scale(1.05)}}@media (prefers-reduced-motion:reduce){.hmb button{animation:none}}
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
/* ⚡ 現場任務（2026-10-27 第三十次）：等 老師 的 畫面 */
#crw{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(6,10,24,.94)}#crw.on{display:flex}.crb{text-align:center;display:flex;flex-direction:column;align-items:center;gap:14px;padding:20px}.cri{font-size:clamp(70px,12vh,120px)}.crt{font-size:clamp(30px,5vh,52px);font-weight:900;line-height:1.35}.crt small{font-size:.6em;color:#B8C4D2;font-weight:700}.crbk{display:inline-flex;align-items:center;min-height:64px;padding:0 30px;border-radius:999px;background:linear-gradient(#FFE07A,#E0A800);color:#3A2A00;font-size:clamp(22px,3vh,30px);font-weight:900;text-decoration:none}
body.crm .top .home{display:none}body.crs .hud .qx{display:none}
/* 🕵️ 短文 偵探：第一幕 只 讀 15 秒 ➜ 第二幕 上面 短文、下面 題目 30 秒；答錯 ＝ 原文 那一句 綠底 */
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
${DECX.JS}
${NGX.JS}
var NGM=${J(D.NGAME.map(g => ({ id: g.id, ic: g.ic, nm: g.nm, how: NGX.HOW[g.id], t: NGX.T[g.id], sec: 'b' })))},XB2=${J(D.XB2)},XGI2={},XBK='A';${J(D.XORD2)}.forEach(function(x,k){XGI2[x[0]+':'+x[1]]=k});
/* 2026-10-29 第 3、5 件：題庫 B ＝ 新 25／新 50（XBK ＝ 'B'）：6 種 全新 遊戲＋🔓；存 進度、做過 的、最高分、成績 代號 都 分開 */
function XBX(){return XBK==='B'?XB2:XB}function XS(){return XBK==='B'?'n':XBK==='H'?'h':''}function XNM(n){return XBK==='H'?n+' 題 闖關':(XBK==='B'?'新 ':'')+n+' 題 挑戰'}function XGX(id,j){return XBK==='B'?XGI2[id+':'+j]:XGI[id+':'+j]}
var LES=${J(D.LES)},DTUT=${J(D.DTUT)},DCG={id:'dc',ic:'🔓',nm:'句子 解碼 任務',how:'👇 把 中文 方塊 拖到 英文 字 的 正下方（也 可以 先 點 方塊、再 點 格子）· 放對 幾個 ＝ 拿 幾成 分數',t:45,sec:'r',B:[]},LVS=null;
var XB=${J(D.XB)},GL=${J(D.GL)},GM=${J(GM)},SEC=${J(D.SEC)},WHO=${J(D.WHO)},JOB=${J(D.JOB)},PAS=${J(D.PAS)},PHOTO=${J(D.PHOTO)},TREE=${J(D.TREE)};
var N=10,R=null,T=[];
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function clr(){if(typeof snStop==='function')snStop();T.forEach(clearTimeout);T=[];cancelAnimationFrame(TM.raf);TM.run=false;FBN++;var w=$('#wf');if(w)w.classList.remove('on')}function later(f,ms){T.push(setTimeout(f,ms))}
var COL={n1:['#1A237E','#7C4DFF'],n2:['#E65100','#FFB300'],n3:['#1B5E20','#76FF03'],n4:['#0277BD','#80D8FF'],n5:['#AD1457','#FF80AB'],n6:['#37474F','#FFD54A'],dc:['#7E57C2','#F5B829'],m1:['#FF7043','#E91E63'],m2:['#AB47BC','#5E35B1'],m3:['#29B6F6','#1565C0'],m4:['#66BB6A','#2E7D32'],m5:['#EF5350','#B71C1C'],m6:['#26C6DA','#00838F'],
  m8:['#8D6E63','#4E342E'],m9:['#9CCC65','#33691E'],m11:['#FFCA28','#F57F17'],m7:['#FFA726','#E65100'],m10:['#7E57C2','#311B92'],m12:['#EC407A','#880E4F']};
/* 發音（2026-10-26 第二十七次 第 6 點，照「三年級 複習」g3mid）：先用 預錄 語音檔，沒有 才用 瀏覽器 語音
   單字（字首音 氣球、聲音 雙胞胎、數字、拼字）＝ 男聲 慢（audio/m1，ENAUDM）、〔🐢 慢慢 唸〕＝ 更慢（audio/m2，ENAUDSL）；
   句子（答錯頁、短文 偵探）＝ 0.85（audio/s，ENAUDF；'m' ＝ 男聲）；沒有 的 用 原本 的（audio，ENAUD）。
   唸 到 一半 被 新的 唸 打斷：被 打斷 的 那一件「唸完 要 做 的 事」交給 新的 唸（PD），不會 卡住（g3mid 第二十六次 1-7） */
var AU=null,ST=null,SID=0,PD=null;
function akey(s){return String(s).replace(/[’]/g,"'").replace(/[=＝≠➜→⇒…＿_　]+/g,' ').replace(/\\s+/g,' ').trim().toLowerCase()}
function stopSay(){if(typeof decStop==='function')decStop();PD=null;SID++;clearTimeout(ST);if(AU){try{AU.pause()}catch(e){}AU=null}try{speechSynthesis.cancel()}catch(e){}}
function aud(t,v){var k=akey(t),X,f;if(v==='L')return 'audio/lab/'+t+'.mp3';if(v==='M1'||v==='M2'){X=window[v==='M1'?'ENAUDM':'ENAUDSL']||{};f=X[k];if(f)return 'audio/'+(v==='M1'?'m1/':'m2/')+f[0]}
  X=window.ENAUDF||{};f=X[(v==='m'?'m:':'')+k]||X[k];if(f)return 'audio/s/'+f[0];X=window.ENAUD||{};f=X[k];return f?'audio/'+f[0]:''}
function say1(t,v,done){var my=SID,f=aud(t,v),fin=function(){if(my===SID&&done)done()};
  if(f){AU=new Audio(f);AU.onended=fin;AU.onerror=function(){tts(t,fin)};var p=AU.play();if(p&&p.catch)p.catch(function(){tts(t,fin)});return}tts(t,fin)}
function tts(t,fin){try{var u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.8;u.onend=fin;u.onerror=fin;speechSynthesis.speak(u)}catch(e){setTimeout(fin,800)}}
/* L ＝ [[聲音, 英文], …]；gap ＝ 兩個 之間 停 幾毫秒（聲音 雙胞胎 ＝ 500：老師「唸完 第一個 字 停 0.5 秒」） */
function sayList(L,done,gap){var pv=PD;stopSay();var cb=pv||done?function(){if(pv)pv();if(done)done()}:null;PD=cb;var i=0,my=SID;
  (function nx(){if(my!==SID)return;if(i>=L.length){PD=null;if(cb)cb();return}var x=L[i++];say1(x[1],x[0],function(){ST=setTimeout(nx,x[2]||gap||450)})})()}
function say(t){sayList([['',t]])}
/* 題目 的 聲音：字首音 氣球、數字 ＝ 男聲 慢；聲音 雙胞胎 ＝ 第一個 字 ➜ 停 0.5 秒 ➜ 第二個 字；自動 唸 2 次，唸 的 時候 倒數 停住 */
function qList(q,sl){var v=sl?'M2':'M1';if(q.pair)return [[v,q.pair[0]],[v,q.pair[1]]];if(R.g.id==='m1'||R.g.id==='m5'||R.g.id==='n1'||(R.g.id==='n3'&&!/\\s/.test(q.say)))return [[v,q.say]];return [['',q.say]]}
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
/* 2026-10-27 第三十一次（老師 選 D）：m12 的 solo 拿掉 ➜ LOB ＝ 12 種（大廳、25／50 題 都 抽 陷阱 偵測器）。原 第三十次 2-(4)（老師 選 A）：🪤 陷阱 偵測器（solo）拿出 大廳 ＝「🪤 四年級 複習 0」，只在 ⚡ 現場任務 開；大廳、25／50 題 ＝ 11 種（LOB）*/
var GMA=GM,LOB=GM.filter(function(g){return !g.solo});
/* 💥 打到 魔王：魔王 抖 一下、血 少 一滴；血 沒了 ＝ 魔王 倒下（不出 聲音）*/
function bossHit(){var b=$('#bossfx');if(!b)return;b.innerHTML='<span class="bm">👾</span><span class="bx">💥</span>'+(R.bhp<=0?'<span class="bk">🎉 魔王 倒 了！</span>':'');b.className='on'+(R.bhp<=0?' ko':'');setTimeout(function(){b.className=''},R.bhp<=0?1600:700)}
/* 🏫 全班 合作 進度條（老師 C35 第 1 題 9）：⚡ 現場任務 的 挑戰：每 5 秒 看 一次 全班 答對 幾題（rooms/班/crp），目標 ＝ 加入 的 人 ✕ 題數 ✕ 7 成 */
var COOP=null;
function coopStart(){coopStop();if(!CR||!CR.room||typeof LDB==='undefined'||!LDB.on()||!R||!R.x)return;var x=R.x,bar=$('#coop');
  COOP=LDB.poll('rooms/'+CR.room+'/crp',5000,function(v){var n=0,ok=0;Object.keys(v||{}).forEach(function(k){var o=v[k];if(o&&o.t===CR.t){n++;ok+=+o.ok||0}});if(!n)return;var goal=Math.max(1,Math.round(n*x*.7)),pc=Math.min(100,Math.round(ok/goal*100));
    bar.innerHTML='<span>🏫 全班 合作：答對 <b>'+ok+'</b> ／ 目標 '+goal+' 題</span><span class="cb"><i style="width:'+pc+'%"></i></span>'+(pc>=100?'<span>🎉 達成！</span>':'');bar.classList.add('on')})}
function coopStop(){if(COOP){try{COOP()}catch(e){}COOP=null}var b=$('#coop');if(b){b.classList.remove('on');b.innerHTML=''}}
/* 🔓 句子 解碼 任務 的 轉接（引擎 g3mid/_decode.js）：全對 ＝ pick(0)（已經 唸 過 整句）；有 錯 ＝ pick(1)＋放對 幾成 */
DEC.A={aud:aud,stop:stopSay,pause:tPause,go:tGo,busy:function(){return !R||R.lock},sid:function(){return (typeof SCID!=='undefined'&&SCID)||''},ok:function(){pick(0);var b=document.querySelector('.dcbox');if(b)decFit(b)},bad:function(got,f){R.frac=f;pick(1,got.join(' '))}};
/* ══ 2026-10-29 第三十三次 第 4 件：👥 兩人 一台（老師 1-8）：兩個 人 各 打 自己 的 5 碼＋密碼 ➜ 一人 一題 輪流、題目 不一樣 ➜ 成績、錯題 各 記 各 的 ══ */
var DUO=null,DUOM=0,XQUIET=0;
function duoRow(){return '<div class="duo"><span>這台 平板：</span><button data-duo="0" class="'+(DUOM?'':'on')+'">🙋 一個人</button><button data-duo="1" class="'+(DUOM?'on':'')+'">👥 兩個人 輪流</button></div>'}
function duoNm(id){id=String(id||'');return id.slice(0,3)+' 班 '+(+id.slice(3))+' 號'}
function duoMsg(h,ms,done){var b=$('#duob');b.innerHTML=h;b.classList.add('on');setTimeout(function(){b.classList.remove('on');if(done)done()},window.__NOGO?50:ms)}
function duoStart(N){var go=function(){var A=SCID;duoMsg('<b>👥 第 2 個 人</b>請 登入（打 自己 的 5 碼＋密碼）',1500,function(){scLogin(function(){SCH.close();var B=SCID;SCID=A;scPut('id_g4',A);scPut('last',A);scBar();
     if(!B||B===A){duoMsg('<b>⚠️ 兩個 人 要 不一樣</b>第 2 個 人 請 打 自己 的 號碼',2200);return}
     XQUIET=1;startX(N);var RA=R;SCID=B;startX(N);var RB=R;XQUIET=0;SCID=A;R=RA;DUO={R:[RA,RB],id:[A,B],cur:0,done:[0,0],rc:[]};clr();coopStart();duoMsg('<b class="p1">👉 輪到</b>'+duoNm(A),1300,show)})})};
 if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();go()});return}go()}
function duoTo(o){DUO.cur=o;R=DUO.R[o];SCID=DUO.id[o];duoMsg('<b class="'+(o?'p2':'p1')+'">👉 輪到</b>'+duoNm(DUO.id[o]),1300,function(){if(R.shownK===R.k)R.k++;if(R.k>=R.idx.length){fin();return}show()})}
function duoSw(){var o=1-DUO.cur;if(DUO.done[o])return false;duoTo(o);return true}
function duoEnd1(){var c=DUO.cur;DUO.done[c]=1;DUO.rc[c]=rec1();var o=1-c;if(!DUO.done[o]){duoTo(o);return}
  var D=DUO;DUO=null;SCID=D.id[0];stopSay();
  $('#app').innerHTML='<div class="end"><div class="big xsc">👥 兩個人 輪流：📝 '+XNM(D.R[0].x)+'</div><div class="duoe">'+[0,1].map(function(k){var r=D.R[k],ok=0;r.Q.forEach(function(x){ok+=x[0]});
    var w=r.sc>D.R[1-k].sc;return '<div class="'+(k?'p2':'p1')+(w?' win':'')+'">'+(w?'<span class="cr">🏆</span>':'')+'<b>👤 '+duoNm(D.id[k])+'</b><span class="big">'+Math.min(100,Math.round(r.sc*10)/10)+' 分 ／ 100</span><span>答對 '+ok+' ／ '+r.x+'</span><small>'+(D.rc[k]?'📝 記進 成績 了':'⚠️ 沒有 記 成績')+'</small></div>'}).join('')+'</div>'+
    '<div class="nav"><button data-x="hub">🎮 回 大廳</button></div></div>';window.scrollTo(0,0)}
function hub(){if(CR&&CR.cfg&&CR.cfg.m==='sync')return;decClose();coopStop();if(R&&!R.crs&&!R.x&&!R.sent&&R.Q&&R.Q.length>=6)rec1();clr();stopSay();R=null;window.scrollTo(0,0);var GM=CR&&CR.cfg?GMA.filter(function(g){return (CR.cfg.gs||[]).indexOf(g.id)>=0}):LOB;
  var h='<div class="top"><h1>'+(CR&&CR.cfg?crName():'📝 四年級 複習')+'</h1><span class="sub">'+GM.length+' 種 遊戲'+(CR?'':'：聽力、閱讀、寫寫看')+'</span><a class="home" href="../index.html">🏠 總首頁</a></div>';
  ['lis','read','write'].forEach(function(s){h+='<div class="sec">'+SEC[s][0]+' '+SEC[s][1]+'<small>'+GM.filter(function(g){return g.sec===s}).length+' 種</small></div><div class="grid">'+
    GM.filter(function(g){return g.sec===s}).map(function(g){var c=COL[g.id],b=best(g.id);return '<button class="gc" data-g="'+g.id+'"><span class="bd" style="--c1:'+c[0]+';--c2:'+c[1]+'">'+g.ic+'</span><span><b>'+g.nm+'</b><small>'+g.how+'</small>'+(b?'<span class="best">🏆 最高 '+b.toLocaleString()+' 分</span>':'')+'</span></button>'}).join('')+'</div>'});
  /* 2026-10-27 第三十二次 3-(3)（老師 A）：📝 25／50 題 只 在 英文課〔⚡ 現場任務〕開（平常 ＝ 一行 說明；老師 開了 x25／x50 ＝ 只 有 那一顆、沒有 遊戲 格子）*/
  var xm=CR&&CR.cfg&&/^([xn])(\\d+)$/.exec(CR.cfg.set||'');
  if(xm){$('#app').innerHTML='<div class="top"><h1>'+crName()+'</h1></div>'+duoRow()+xrow().replace(/<div class="xbw">[\\s\\S]*?<\\/div>|<button class="xb"[\\s\\S]*?<\\/button>/g,function(b){return b.indexOf('"'+xm[2]+'"')>=0&&b.indexOf('data-bk="'+(xm[1]==='n'?'B':'A')+'"')>=0?b:''});return}
  $('#app').innerHTML=CR?h:h.replace('</div>','</div><div class="xoff">📝 25 題／50 題 挑戰：英文課 老師 在〔⚡ 現場任務〕開</div>')}
/* 2026-10-26 第二十八次 第 3、4 點：大廳 最上面〔📝 25 題〕〔📝 50 題〕＝ 12 關 連著 玩（每題 4／2 分）*/
function xrow(){var k0=XBK,h='<div class="xrow">'+[[25,'A'],[50,'A'],[25,'B'],[50,'B']].map(function(a){XBK=a[1];var n=a[0],bk=' data-bk="'+a[1]+'"',b=best('x'+XS()+n),v=xLoad(n),nm=XNM(n);if(v)return '<div class="xbw"><button class="xb xr" data-xr="'+n+'"'+bk+'><b>▶ 繼續 '+nm+'</b><small>已經 做到 第 '+v.Q.length+' ／ '+n+' 題 · 從 第 '+(v.Q.length+1)+' 題 接著 做</small></button><button class="xb2" data-xn="'+n+'"'+bk+'>🔄 重新 開始</button></div>';return '<button class="xb" data-xn="'+n+'"'+bk+'><b>📝 '+nm+'</b><small>'+((a[1]==='B'?NGM:LOB).length+1)+' 關 連著 玩 · 每題 '+(100/n)+' 分 · 滿分 100</small>'+(b?'<span class="best">🏆 最高 '+b+' 分</span>':'')+'</button>'}).join('')+'</div>';XBK=k0;return h}
var XGI={};${J(D.XORD)}.forEach(function(x,k){XGI[x[0]+':'+x[1]]=k});function XG(id,j){return XGI[id+':'+j]}var XN=${D.XORD.length},XB2N=${D.XORD2.length};   /* 2026-10-28：挑戰 題庫 的 第幾題 ＝ D.XORD（舊 84 題 順序 不變）*/
/* 抽題：25 ＝ 1 關 3 題、11 關 2 題；50 ＝ 2 關 5 題、10 關 4 題；🔁 類似 ＝ 30%（25 題 8、50 題 15），平均 分 在 各 關；短文 偵探 只 抽 一篇（先 讀 15 秒）*/
function startX(N){var GM=XBK==='B'?NGM:LOB,XB=XBX();if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();startX(N)});return}
  /* 2026-10-29 第 2 件：第 1 關 ＝ 🔓 句子 解碼 任務（25 題 裡 8 題、50 題 裡 15 題；Unit 1 一半 ➜ Unit 2 一半），其他 12 關 平均 分 剩下 的 */
  DCG.B=XB.dc;LVS=[DCG].concat(GM);var DN=N===25?8:N===50?15:Math.round(N*.3),M=N-DN;
  clr();var n=GM.length,c=GM.map(function(){return Math.floor(M/n)}),s=c.map(function(){return 0}),pick=GM.map(function(){return null}),I=GM.map(function(g,i){return i});
  shuf(I).slice(0,M-c[0]*n).forEach(function(i){c[i]++});var left=XBK==='H'?0:Math.round(N*(XBK==='B'?.5:.3));   /* 新 25／新 50 ＝ 50% 類似 */
  GM.forEach(function(g,i){if(g.id!=='m8')return;var nh=function(q){return !(XBK==='H'&&q.sim)},ks=shuf(Object.keys(PAS).filter(function(k){return XB.m8.some(function(q){return q.pas===k&&nh(q)})})),L=XB.m8.map(function(q,j){return q.pas===ks[0]&&nh(q)?j:-1}).filter(function(j){return j>=0});
    pick[i]=shuf(L).slice(0,c[i]);s[i]=pick[i].filter(function(j){return XB.m8[j].sim}).length;left-=s[i]});
  var SIM=GM.map(function(g){return XB[g.id].map(function(q,j){return q.sim?j:-1}).filter(function(j){return j>=0})}),NEW=GM.map(function(g){return XB[g.id].map(function(q,j){return q.sim?-1:j}).filter(function(j){return j>=0})}),ord=shuf(I);
  while(left>0){var mv=0;ord.forEach(function(i){if(left>0&&!pick[i]&&s[i]<c[i]&&s[i]<SIM[i].length){s[i]++;left--;mv=1}});if(!mv)break}
  var SEEN=xSeen(),un=function(L,i){L=shuf(L);var id=GM[i].id;return L.filter(function(j){return !SEEN[XGX(id,j)]}).concat(L.filter(function(j){return SEEN[XGX(id,j)]}))};   /* 第三十二次 3-(2)：做過 的 先 不出 */
  var gs=[],idx=[],lvOf=[],d1=Math.ceil(DN/2),dcI=function(u){return XB.dc.map(function(q,j){return q.u===u?j:-1}).filter(function(j){return j>=0})},udc=function(L){L=shuf(L);return L.filter(function(j){return !SEEN[XGX('dc',j)]}).concat(L.filter(function(j){return SEEN[XGX('dc',j)]}))};
  udc(dcI(1)).slice(0,d1).concat(udc(dcI(2)).slice(0,DN-d1)).forEach(function(j){gs.push(DCG);idx.push(j);lvOf.push(0)});
  GM.forEach(function(g,i){var X=Object.assign({},g,{B:XB[g.id]}),L=pick[i]||shuf(un(SIM[i],i).slice(0,s[i]).concat(un(NEW[i],i).slice(0,c[i]-s[i])));L.forEach(function(j){gs.push(X);idx.push(j);lvOf.push(i+1)})});c=[DN].concat(c);
  R={x:N,bk:XBK,pt:100/N,g:gs[0],gs:gs,idx:idx,lvOf:lvOf,cnt:c,lv:-1,k:0,sc:0,st:0,Q:[],W:[],t0:Date.now(),rd:{}};if(XQUIET)return;xDel(N);xSave();coopStart();show()}
/* ══ 2026-10-27 第三十二次 第 3-(1)(2) 點（老師：點〔離開〕就 前功盡棄；每一次 重做 題目 不可以 相同）══
   每 答 一題 自動 存（mt_xs25_5碼）；〔✕ 離開〕先 問；大廳〔▶ 繼續〕從 下一題 接著 做；做完 才 送 成績；做過 的 題目（mt_seen_5碼）先 不出 */
function xKey(n){return 'mt_xs'+n+XS()+'_'+((typeof SCID!=='undefined'&&SCID)||'0')}
function xSave(){if(!R||!R.x||R.crs||DUO)return;try{localStorage.setItem(xKey(R.x),JSON.stringify({x:R.x,g:R.gs.map(function(g){return g.id}),idx:R.idx,lvOf:R.lvOf,cnt:R.cnt,sc:R.sc,W:R.W,Q:R.Q,t0:R.t0,t:Date.now()}))}catch(e){}}
function xLoad(n){try{var v=JSON.parse(localStorage.getItem(xKey(n))||'null');if(!v||v.x!==n||!v.Q||v.Q.length>=v.idx.length||Date.now()-v.t>14*864e5||v.g.some(function(id,k){var X=XBX();return !X[id]||!X[id][v.idx[k]]}))return null;return v}catch(e){return null}}
function xDel(n){try{localStorage.removeItem(xKey(n))}catch(e){}}
function xSeen(){try{var a=JSON.parse(localStorage.getItem('mt_seen'+XS()+'_'+((typeof SCID!=='undefined'&&SCID)||'0'))||'[]'),o={};if(a.length>=(XBK==='B'?XB2N:XN))a=[];a.forEach(function(i){o[i]=1});return o}catch(e){return {}}}
function xSeenAdd(i){try{var k='mt_seen'+XS()+'_'+((typeof SCID!=='undefined'&&SCID)||'0'),a=JSON.parse(localStorage.getItem(k)||'[]');if(a.length>=(XBK==='B'?XB2N:XN))a=[];if(a.indexOf(i)<0)a.push(i);localStorage.setItem(k,JSON.stringify(a))}catch(e){}}
function resumeX(n){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();resumeX(n)});return}var v=xLoad(n);if(!v){startX(n);return}clr();
  var by={},GM=XBK==='B'?NGM:LOB,XB=XBX();GM.forEach(function(g){by[g.id]=Object.assign({},g,{B:XB[g.id]})});DCG.B=XB.dc;by.dc=DCG;LVS=v.cnt.length>GM.length?[DCG].concat(GM):GM;var gs=v.g.map(function(id){return by[id]});
  R={x:v.x,bk:XBK,pt:100/v.x,g:gs[v.Q.length],gs:gs,idx:v.idx,lvOf:v.lvOf,cnt:v.cnt,lv:-1,k:v.Q.length,sc:v.sc,st:0,Q:v.Q,W:v.W||[],t0:v.t0,rd:{}};show()}
function xAsk(){if(DUO){var D=DUO;DUO=null;SCID=D.id[0];hub();return}xSave();tPause();stopSay();var n=R.Q.length,o=$('#xq');o.querySelector('.xqt').innerHTML='已經 做 了 <b>'+n+'</b> 題，都 <b>存好 了</b>。<br>下次 按〔▶ 繼續 '+XNM(R.x)+'〕，從 第 '+(n+1)+' 題 接著 做。';o.classList.add('on')}
/* 換 關：第 N 關 的 開場（遊戲 名字、怎麼玩）*/
/* 2026-10-29 第 7 件（老師 C35 第 1 題 1＋4＋10）：🎬 每關 開場 小 動畫＋🗺 闖關 地圖（做完 ✔、現在 發光、👾 魔王 關）；每 4 關 ＝ 👾 魔王 關（答對 一題 ＝ 打 魔王 一下）*/
function isBoss(lv){return !!(R&&R.x&&(lv+1)%4===0)}
function lvSplash(done){var g=R.g,L=LVS||LOB,bs=isBoss(R.lv);R.bhp=bs?R.lvOf.filter(function(l){return l===R.lv}).length:0;R.bmax=R.bhp;
  var map=R.x?'<div class="lmap">'+L.map(function(x,i){return (i?'<i class="lpth'+(i<=R.lv?' on':'')+'"></i>':'')+'<span class="lnd'+(i<R.lv?' ok':i===R.lv?' cur':'')+(isBoss(i)?' bs':'')+'">'+(i<R.lv?'✔':isBoss(i)?'👾':x.ic)+'<small>'+(i+1)+'</small></span>'}).join('')+'</div>':'';
  $('#app').innerHTML='<div class="lvs'+(bs?' boss':'')+'">'+map+'<div class="glv">'+(bs?'👾 魔王 關！':'')+'第 '+(R.lv+1)+' 關 ／ '+L.length+'</div><div class="gi">'+(bs?'👾':g.ic)+'</div><div class="gn">'+esc(g.nm)+'</div><div class="gh">'+(bs?'答對 一題 ＝ 打 魔王 一下 💥（魔王 有 '+R.bhp+' 滴 血）':esc(g.how))+'</div></div>';
  if(window.__NOGO){done();return}later(done,2400)}
/* ── 一回 10 題 ── */
function start(id){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();start(id)});return}
  clr();var g=GM.filter(function(x){return x.id===id})[0];var idx=shuf(g.B.map(function(_,i){return i})).slice(0,N);
  /* 🕵️ 短文 偵探（2026-10-26 第二十七次 6-(4)）：一篇 一篇 來：第 1 篇 先 讀 15 秒 ➜ 它 的 題目 ➜ 第 2 篇 先 讀 15 秒 ➜ 它 的 題目 */
  if(id==='m8'){var ks=shuf(Object.keys(PAS));idx=[];ks.forEach(function(k){idx=idx.concat(shuf(g.B.map(function(q,i){return q.pas===k?i:-1}).filter(function(i){return i>=0})))})}
  R={g:g,idx:idx,k:0,sc:0,st:0,Q:[],W:[],t0:Date.now(),rd:{}};show()}
function frame(body){var g=R.g,c=COL[g.id];
  $('#app').innerHTML='<div class="hud"><span class="nm"><span class="bd" style="display:inline-flex;width:46px;height:46px;border-radius:14px;align-items:center;justify-content:center;font-size:28px;background:linear-gradient(135deg,'+c[0]+','+c[1]+')">'+g.ic+'</span>'+(R.x?'第 '+(R.lv+1)+' 關 · ':'')+g.nm+(DUO?'<span class="duot '+(DUO.cur?'p2':'p1')+'">👤 '+duoNm(DUO.id[DUO.cur])+'</span>':'')+'</span>'+
    '<span class="dots">'+(R.x?'<span class="xpg">📝 '+(R.k+1)+' ／ '+R.x+'</span>':'')+R.idx.map(function(_,i){if(R.x&&R.lvOf[i]!==R.lv)return '';var x=R.Q[i];return '<i class="'+(x?(x[0]?'ok':'no'):i===R.k?'cur':'')+'"></i>'}).join('')+'</span>'+(R.st>=2?'<span class="flm'+(R.st>=5?' hot':'')+'">🔥 '+R.st+'</span>':'')+(R.bmax?'<span class="bhp">👾 '+'❤'.repeat(Math.max(0,R.bhp))+'<s>'+'🖤'.repeat(Math.max(0,R.bmax-R.bhp))+'</s></span>':'')+'<span class="sc">⭐ '+R.sc.toLocaleString()+'</span>'+(DUO?'<span class="vs"><b class="p1">'+Math.round(DUO.R[0].sc*10)/10+'</b> 🆚 <b class="p2">'+Math.round(DUO.R[1].sc*10)/10+'</b></span>':'')+'<button class="qx" data-x="hub">✕ 離開</button></div>'+
    '<div class="tm"><i id="bar"></i></div><div class="how">'+g.how+'</div><div class="stage" id="stage">'+body+'</div><div id="fb" class="fb"></div>'}
function show(){if(R.x){R.g=R.gs[R.k];var lv=R.lvOf[R.k];if(lv!==R.lv){R.lv=lv;lvSplash(show);return}}R.shownK=R.k;var g=R.g,q=g.B[R.idx[R.k]];R.q=q;R.clickW=null;R.qi=R.idx[R.k];R.lock=false;R.ts=Date.now();
  R.ord=shuf(q.o.map(function(_,i){return i}));var id=g.id,h='';
  if(id==='m8'&&!R.rd[q.pas]){readScene(q);return}
  if(id==='dc'&&q.u!==R.dcu){var tut=R.dcu==null;R.dcu=q.u;$('#app').innerHTML='';var les=function(){decLesson(LES[R.bk==='B'?'B':'A'][q.u],show)};if(tut&&!window.__NOTUT)decTut(DTUT,les);else les();return}   /* 2026-10-30 第 9-(5)：這一場 第一題 解碼 前 ＝ 先 教 怎麼 拖、中英 順序 */   /* 🔓 每一課 第一題 前 ＝ 秒懂 動畫 */
  var HEAR='<button class="hear" id="hear" data-x="hear">🔊 再 聽 一次</button>';
  /* 字首音 氣球、聲音 雙胞胎（老師 6-(1)(2)：聽不清楚）：〔🔊 再 聽 一次〕＋〔🐢 慢慢 唸〕
     2026-10-27 第三十次 2-(3)：字首音 氣球 題目 上面 的 圖 拿掉（只 用 聽 的；答錯頁 的 圖 照舊） */
  if(id==='m1'||id==='m2')HEAR='<div class="hrow"><button class="hear" id="hear" data-x="hear">🔊 再 聽 一次</button><button class="hear slow" id="hslow" data-x="slow">🐢 慢慢 唸</button></div>';
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
    h='<div class="sp1"><span class="ic">'+q.ic+'</span></div><div class="slots" id="slots"></div><div class="tiles">'+R.tiles.map(function(c,i){return '<button data-t="'+i+'"'+(/[aeiou]/.test(c)?' class="lv"':'')+'>'+c+'</button>'}).join('')+'</div><button class="bk" data-x="bk">⌫ 退 一個</button>'}
  else if(id==='m10'||id==='m12')h=(q.pic?pic(q.pic,''):'')+'<div class="qline">'+blank(q.blank)+'</div>'+(id==='m10'?'<div class="bankt">Word Bank</div><div class="bank">'+R.ord.map(function(i){return '<button data-o="'+i+'">'+esc(q.o[i])+'</button>'}).join('')+'</div>':opts(R.ord,'n3'));
  if(id==='dc')h='<div class="dcu">📘 Unit '+q.u+'</div><div id="dcst"></div>';R.frac=0;if(NG[id])h=ngShow(id,q);
  frame(h);if(id==='m7')drawSp();if(id==='dc')decRender(q,$('#dcst'));if(NG[id])ngAfter(id);
  tStart(g.t);if(q.say){tPause();later(function(){sayQ(0,id==='m1'||id==='m2'||id==='m5'||id==='n1'||(id==='n3'&&!/\\s/.test(q.say)))},450)}}
/* 短文：一行 一句（對話 ＝ 前面 寫 誰 說 的） */
function pasHTML(k){var P=PAS[k];return '<div class="pas" id="pas">'+P.t.map(function(t,i){return '<span data-ev="'+i+'"'+(P.sp?' class="spl"':'')+'>'+(P.sp?'<b class="sp">'+esc(P.sp[i])+':</b><i>'+esc(t)+'</i>':esc(t))+'</span>'}).join('')+'</div>'}
/* 第一幕：只 有 短文，15 秒 先 讀（2026-10-27 第三十二次 2-(1)A 老師：20 ➜ 15 秒）；讀完 才 解鎖〔▶ 開始 回答〕（不算 在 每題 30 秒 裡） */
function readScene(q){var n=Object.keys(R.rd).length+1,c=window.__RD||15,k=R.k;   /* window.__RD ＝ 量測 用（縮短）*/
  frame('<div class="rd"><div class="rt">📖 第 '+n+' 篇：先 仔細 讀 '+c+' 秒</div>'+pasHTML(q.pas)+'<div class="rc" id="rc">'+c+'</div><button class="go" id="rdgo" data-x="rdgo" disabled>🔒 讀完 才 能 開始</button></div>');
  var b=$('#bar');if(b)b.style.width='100%';
  (function cd(){if(!R||R.k!==k||R.rd[q.pas])return;if(c<=0){var g=$('#rdgo');g.disabled=false;g.textContent='▶ 開始 回答（第 '+(R.k+1)+' 題）';$('#rc').textContent='✔';return}
    $('#rc').textContent=c;if(b)b.style.width=(c/(window.__RD||15)*100)+'%';c--;later(cd,1000)})()}
function opts(ord,cls){var q=R.q,isM2=R.g.id==='m2';var o=isM2?[0,1].map(function(_,j){return q.o.indexOf(j===0?'⭕ Same':'❌ Different')}):ord;
  return '<div class="opts '+(cls||'')+(o.length===2?'':'')+'">'+o.map(function(i,j){return '<button class="o c'+(isM2?(j?0:3):j)+'" data-o="'+i+'">'+esc(q.o[i])+'</button>'}).join('')+'</div>'}
function pic(p,attr){var a=String(p).split('|'),w=WHO[a[0]],j=a[1]?JOB[a[1]]:null;return '<button class="pc" '+attr+' aria-label="'+esc(w[1]+(j?' '+j[1]:''))+'"><span class="pw">'+w[0]+'</span>'+(j?'<span class="pj">'+j[0]+'</span>':'')+'</button>'}
function tbtn(w,c){var i=R.q.o.indexOf(w);return '<button class="'+c+'" data-o="'+(i<0?3:i)+'" data-w="'+w+'">'+WHO[w][0]+'</button>'}   /* 2026-10-26 第二十九次：選項 不 寫 中文（家族樹 只 有 人 的 圖）*/
function blank(s){return esc(s).replace('___','<span class="bl" id="bl">&nbsp;</span>')}
/* 這一個 位置 的 字母 顏色：放對 ＝ 照 q.lc（母音 紅、不發音 灰）；放錯 ＝ 母音 紅 */
function lcC(v,i){var q=R.q,c=v&&v===q.spell[i]&&q.lc?q.lc[i]:/[aeiou]/.test(v||'')?'v':'-';return c==='v'?' lv':c==='s'?' ls':''}
function lcW(w,lc){return w.split('').map(function(c,i){var k=lc?lc[i]:/[aeiou]/.test(c)?'v':'-';return k==='-'?esc(c):'<span class="'+(k==='v'?'lv':'ls')+'">'+esc(c)+'</span>'}).join('')}
function drawSp(){var w=R.q.spell,n=w.length,h='';for(var i=0;i<n;i++){var f=i===0||i===n-1,k=i-1,v=f?w[i]:(R.pk[k]!=null?R.tiles[R.pk[k]]:'');
    h+='<span class="'+(f?'fix':v?'f':'')+(!f&&k===R.pk.length?' cur':'')+lcC(v,i)+'">'+v+'</span>'}$('#slots').innerHTML=h;
  $$('.tiles button').forEach(function(b){b.disabled=R.pk.indexOf(+b.getAttribute('data-t'))>=0||R.lock})}

/* 答 一題：i ＝ 選了 原本 的 第幾個（0 ＝ 正解；-1 ＝ 時間 到） */
function pick(i,you){if(!R||R.lock)return;R.lock=true;var id0=R.g.id,q=R.q,ms=Date.now()-R.ts,ok=i===0,left=i<0?0:tLeft()/TM.T;   /* 剩下 ＝ 倒數 的（唸 題目 的 時間 不算） */
  R.Q.push([ok?1:0,i,Math.round(ms/100)/10,i>=0&&ms<1000?1:0,ok?Math.round(left*1000)/1000:id0==='dc'?Math.round((R.frac||0)*1000)/1000:0,R.x?XGX(R.g.id,R.qi):R.qi]);   /* 🔓 解碼 任務 答錯 ＝ 第 5 格 放 放對 幾成 */crProg(ok);if(R.x&&!R.crs){xSeenAdd(XGX(R.g.id,R.qi));setTimeout(xSave,0)}   /* 25／50 題：題庫 ＝ 挑戰 題庫（12 種 接起來）；crProg ＝ ⚡ 現場任務 自己 答 的 進度 */
  tPause();stopSay();
  var id=R.g.id;
  $$('#stage [data-o]').forEach(function(b){var k=+b.getAttribute('data-o'),w=b.getAttribute('data-w');if(w)k=w===q.o[0]?0:w===R.clickW?i:-9;b.disabled=true;if(k===0)b.classList.add('ok');else if(k===i){b.classList.add('bad');if(id==='m1')b.classList.add('pop')}else b.classList.add('no')});
  if(id==='m1'&&ok){var bb=$('#stage [data-o="0"]');if(bb)bb.classList.add('pop')}
  if(id==='m8')[].concat(q.ev).forEach(function(v){var e=$('#pas [data-ev="'+v+'"]');if(e)e.classList.add(ok?'evy':'evg')});
  if(id==='m9'||(id==='n6'&&q.tree)){var t=$('#tree');if(t)t.classList.add('show')}
  if((id==='m10'||id==='m12')&&$('#bl'))$('#bl').innerHTML=esc(q.o[0]);
  if(id==='m6'){var qb=$('#chat .q');if(qb){qb.classList.remove('q');qb.classList.add('fly');qb.innerHTML='<span class="who">'+(q.chat==='A'?'B':'A')+'</span>'+esc(q.o[0])}}
  if(id==='m7'||id==='n5'){$('#slots').classList.add(ok?'win':'bad');if(!ok)$('#slots').innerHTML=q.spell.split('').map(function(c,i){return '<span class="f'+lcC(c,i)+'" style="border-color:#2BD46A'+(lcC(c,i)?'':';color:#7BF0A8')+'">'+c+'</span>'}).join('')}
  if(ok&&R.bmax&&R.bhp>0){R.bhp--;bossHit()}
  if(ok&&NG[id])ngOk(id);if(id==='n3')snStop();
  if(ok){R.st++;var s=R.x?R.pt:100+Math.round(900*left)+Math.min(250,50*(R.st-1));R.sc=Math.round((R.sc+s)*10)/10;fb(true,'⭐ 答對！ ＋'+s+(R.x?' 分':'')+(R.st>1?'　🔥 連對 '+R.st:''));
    /* 短文 偵探 答對：不 自己 走，解鎖〔▶ 下一題〕（老師 6-(4)） */
    if(id==='m8'){$('#nx8w').innerHTML='<button class="nx8" data-x="next">▶ 下一題</button>';sayList(q.fs)}else if(q.lab){var kk=R.k,nx=function(){if(R&&R.k===kk)next()};sayList(q.lab,function(){later(nx,500)});later(nx,6000)}else if(R.x&&id!=='dc'&&(q.ae||q.fe)){var k5=R.k;sayList([['',q.ae||q.fe]],function(){if(R&&R.k===k5)later(next,450)})}else{if(q.ae&&id!=='dc')sayList([['',q.ae]]);later(next,1500)}}   /* 2026-10-30 第三十四次 第 5 點：挑戰 答對 ＝ 唸完 正確 答案 才 下一題 */   /* 第三十二次：A／B 拆開 唸 ＝ 唸完 才 下一題 */
  else{R.st=0;R.W.push(R.qi);if(R.x&&id==='dc'&&R.frac>0)R.sc=Math.round((R.sc+R.pt*R.frac)*10)/10;var yt=i<0?'':you||(q.oz?q.oz[i]:q.o[i]);
    /* 短文 偵探 答錯：原文 那一句 綠底 ➜ 唸 一次 ➜ 獨立 的 秒懂 頁（逐字 中文＋整句 翻譯）再 唸 一次 ➜ 才 解鎖〔下一題〕 */
    if(id==='m8'){var my=FBN;sayList(q.fs,function(){if(my===FBN&&R&&R.q===q)later(function(){miss(i,yt,1)},500)})}else miss(i,yt,3)}}
/* ══ 答錯 ＝ 綠底 詳細 解說（2026-10-26 第二十七次 6-(5)：100% 照「三年級 複習」）：
   ❌ 你的 答案 ➜ ✅ 正確 答案（每一個 英文字 正下方 ＝ 中文）➜ 整句：翻譯 ➜ 自動 唸 3 次（① ② ③，短文 偵探 1 次）➜〔▶ 下一題 3〕3 秒 自己 走 ══ */
var FBN=0;
function toks(s){var r=[],re=/years old|([A-Za-z][A-Za-z\\-]*)(’|')(s|m|re)\\b|[A-Za-z][A-Za-z\\-’']*|\\d+|[.,?!]/g,m;   /* 2026-10-28 第三十三次：原本 單 斜線 的 b、d 在 樣板 字串 裡 被 吃掉（Who’s、She’s 下面 一直 空白、數字 不見）➜ 兩條 斜線 */
  while((m=re.exec(s))){if(m[2]&&m[1].toLowerCase()!=='let')r.push(m[1],"'"+m[3]);else r.push(m[0])}return r}
function zhOf(w,gx){var k=w.replace(/’/g,"'").toLowerCase();if(gx&&gx[k]!==undefined)return gx[k];if(GL[k]!==undefined)return GL[k];if(/^[A-Z][a-z]+$/.test(w))return '（名字）';return ''}
function gloss(s,gx,red1){var T=toks(s),h='';for(var i=0;i<T.length;i++){var w=T[i];if(/^[.,?!]$/.test(w))continue;var p='';while(/^[.,?!]$/.test(T[i+1]||'')){p+=T[++i]}
    var W=esc(w.replace(/'/g,'’'));if(red1)W='<u>'+W.charAt(0)+'</u>'+W.slice(1);
    h+='<span class="gw'+(/^'/.test(w)?' ct':'')+'"><b>'+W+esc(p)+'</b><i>'+esc(zhOf(w,gx))+'</i></span>'}return '<div class="gls" id="gls">'+h+'</div>'}
/* 2026-10-28 第三十三次 第 7 點（老師：短文 偵探 答錯 的 講解 每一個 英文 單字 正下方 中文）：題目 填好 正確 答案 也 逐字 中文；名字 後面 的 ’s ＝ 的（Jason’s ＝ Jason 的） */
function glossQ(s){return gloss(s,null,0).replace('id="gls"','id="glq"').replace(/(<b>(?!He<|She<|Who<|What<|That<|It<|Let<)([A-Z][a-z]+)<\\/b><i>（名字）<\\/i><\\/span><span class="gw ct"><b>’s([^<]*)<\\/b><i>)是(<\\/i>)/g,'$1的$4')}
function m8Q(q){var o=q.o[0],t=q.q.replace(/^📖 /,'');return /___/.test(t)?t.replace('___',o):t+' '+o}
function picDiv(p){var a=String(p).split('|'),w=WHO[a[0]],j=a[1]?JOB[a[1]]:null;return '<div class="pc"><span class="pw">'+w[0]+'</span>'+(j?'<span class="pj">'+j[0]+'</span>':'')+'</div>'}
function exHTML(q){var id=R.g.id;
  if(id==='n1')return q.ic?'<span class="ic">'+q.ic+'</span>':'';if(id==='n2'||(id==='n6'&&q.tree))return picDiv(q.o[0]);if(id==='n5')return '<span class="ic">'+q.ic+'</span>';
  if(id==='n3')return q.photo?'<img src="img/'+q.o[0]+'.jpg" alt="">':'<span class="num">'+esc(q.o[0])+'</span>';
  if(id==='m1'||id==='m7')return '<span class="ic">'+q.ic+'</span>';if(id==='m5'||(id==='m12'&&!q.ae))return '<span class="num">'+esc(q.o[0])+'</span>';
  if(id==='m3')return picDiv(q.o[0]);if(id==='m11'||q.pic)return q.pic&&q.pic!==1?picDiv(q.pic):'';if(id==='m4')return '<img src="img/'+q.o[0]+'.jpg" alt="">';
  if(id==='m9')return picDiv(q.o[0]);return ''}
function miss(i,you,REP){var q=R.q,id=R.g.id,my=++FBN,ex=exHTML(q);tPause();
  var x=$('#wbox');x.className='box';x.innerHTML='<div class="hd">'+(i<0?'⏰ 時間到':'❌ 答錯了')+'</div>'+(i>=0&&you?'<div class="yp">你的答案：<s>'+esc(you)+'</s></div>':'')+(id==='dc'&&R.x&&R.frac>0?'<div class="yp">✅ 放對 '+Math.round(R.frac*q.t.length)+' ／ '+q.t.length+' 個 ➜ 拿 '+(Math.round(R.pt*R.frac*10)/10)+' 分</div>':'')+
    (id==='m8'?'<div class="ca">📝 題目</div>'+glossQ(m8Q(q)):'')+'<div class="ca">✅ 正確答案'+(id==='m8'?'（短文 裡 的 證據）':'')+'</div>'+(ex?'<div class="ex">'+ex+'</div>':'')+gloss(q.fe,q.gx,id==='m1'||id==='m2')+'<div><span class="tr">整句：'+esc(q.fz)+'</span></div>'+(q.tip?'<div class="tip">💡 '+esc(q.tip)+'</div>':'')+
    '<div class="ft"><span class="n3" id="n3">'+(REP===1?'<span>1</span>':'<span>1</span><span>2</span><span>3</span>')+'</span><button class="say" id="wfs">🔊 再聽</button><span id="nxw"></span></div>';
  if(id==='m7'||id==='n5'){var gb=$('#gls b');if(gb)gb.innerHTML=lcW(q.spell,q.lc)}   /* 第三十二次 第 4 點 */
  $('#wf').classList.add('on');wFit();var c=0;
  function one(){if(my!==FBN)return;if(c>=REP){var w=$('#nxw');w.innerHTML='<button class="nx" id="wfn">▶ 下一題</button>';
      var n=3,b=$('#wfn');b.textContent='▶ 下一題 '+n;var t=setInterval(function(){if(my!==FBN){clearInterval(t);return}n--;if(n<=0){clearInterval(t);wGo()}else b.textContent='▶ 下一題 '+n},1000);return}
    c++;var s=$('#n3').children[c-1];s.classList.add('on');var g=$('#gls');if(g){g.classList.remove('spk');void g.offsetWidth;g.classList.add('spk')}
    sayList(q.fs,function(){setTimeout(one,700)},id==='m2'?500:450)}
  setTimeout(one,500)}
function wFit(){var b=$('#wbox');b.classList.remove('f1','f2');['f1','f2'].forEach(function(c){if(b.scrollHeight>b.clientHeight+2)b.classList.add(c)})}
addEventListener('resize',function(){if($('#wf').classList.contains('on'))wFit()});
function wGo(){FBN++;stopSay();$('#wf').classList.remove('on');next()}
/* 2026-10-27 第三十二次 2-(1)B 老師：短文 偵探 答對 的 綠色 橫幅 太大、蓋住〔▶ 下一題〕➜ 短文 偵探 ＝ 小 一條、放 最上面、1.6 秒 自己 收起來 */
function fb(ok,t,you,ans,z){var e=$('#fb'),sm=ok&&R&&R.g&&R.g.id==='m8';e.className='fb on '+(ok?'ok':'no')+(sm?' sm':'');if(sm)later(function(){if(e.classList.contains('sm'))e.classList.remove('on')},1600);
  e.innerHTML=ok?'<div class="t">'+t+'</div>':'<div class="you">'+you+'</div><div class="ans">✅ '+esc(ans)+'</div>'+(z?'<div class="z">'+esc(z)+'</div>':'')+
    '<div class="row">'+(R.q.ae?'<button data-x="say">🔊 聽</button>':'')+'<button class="go" data-x="next" id="nx" disabled>▶ 下一題</button></div>';
  if(!ok)later(function(){var b=$('#nx');if(b)b.disabled=false},1800)}
function next(){clr();stopSay();if(DUO&&duoSw())return;R.k++;if(R.k>=R.idx.length){fin();return}show()}
/* 結束：星星、答對 幾題、記 成績、錯題 */
function fin(){if(DUO){duoEnd1();return}if(R.crs){crDone();return}if(R.x){finX();return}var n=R.Q.length,ok=0,fast=0;R.Q.forEach(function(x){ok+=x[0];fast+=x[3]});var st=ok>=n-1?3:ok>=n*.6?2:1,rec=n>=6&&fast*2<=n&&rec1();
  try{if(R.sc>best(R.g.id))localStorage.setItem('mt_best_'+R.g.id,R.sc)}catch(e){}
  var g=R.g,h='<div class="end"><div class="st">'+Array(st+1).join('⭐')+'<span class="dim">'+Array(4-st).join('⭐')+'</span></div><div class="big">'+g.ic+' '+g.nm+'：答對 '+ok+' ／ '+n+' 題</div>'+
    '<div class="note">⭐ '+R.sc.toLocaleString()+' 分　'+(rec?'📝 記進 成績 了（練習次數 ＋1）':fast*2>n?'⚠️ 太快 亂按 超過 一半：這一回 不算 成績':(typeof SCID!=='undefined'&&SCID?'📶 沒有 網路：先 存 在 平板':'（沒有 登入：沒有 記 成績）'))+'</div>';
  if(R.W.length)h+='<div class="wl"><div class="note">📌 答錯 的 題目（按〔🔊〕聽）</div>'+R.W.map(function(k){var q=g.B[k];return '<div class="w">'+(q.ae?'<button data-say="'+esc(q.ae)+'">🔊</button>':'')+esc(q.q)+'<br>✅ <b>'+esc(q.oz?q.oz[0]:q.o[0])+'</b>　'+esc(q.z||'')+'</div>'}).join('')+'</div>';
  h+='<div class="nav"><button class="go" data-x="again">🔁 再 玩 一次</button><button data-x="hub">🎮 換 一個 遊戲</button></div>'+(typeof scByeHTML==='function'&&typeof SCID!=='undefined'&&SCID?scByeHTML():'')+'</div>';
  $('#app').innerHTML=h;window.scrollTo(0,0)}
/* 25／50 題 結束：得分 ／ 100、每一關 答對 幾題、答錯 的 題目 */
function finX(){xDel(R.x);var GM=LOB,n=R.Q.length,ok=0,fast=0;R.Q.forEach(function(x){ok+=x[0];fast+=x[3]});var sc=Math.min(100,Math.round(R.sc*10)/10),st=sc>=90?3:sc>=70?2:1,rec=n>=6&&fast*2<=n&&rec1();   /* 🔓 解碼 任務 放對 幾成 拿 幾成 ➜ 分數 ＝ R.sc */
  try{if(sc>best('x'+XS()+R.x))localStorage.setItem('mt_best_x'+XS()+R.x,sc)}catch(e){}
  var h='<div class="end"><div class="st">'+Array(st+1).join('⭐')+'<span class="dim">'+Array(4-st).join('⭐')+'</span></div><div class="big xsc">📝 '+XNM(R.x)+'：<b>'+sc+'</b> 分 ／ 100</div><div class="big">答對 '+ok+' ／ '+R.x+'（每題 '+R.pt+' 分）</div>'+
    '<div class="note">'+(rec?'📝 記進 成績 了':fast*2>n?'⚠️ 太快 亂按 超過 一半：這一回 不算 成績':(typeof SCID!=='undefined'&&SCID?'📶 沒有 網路：先 存 在 平板':'（沒有 登入：沒有 記 成績）'))+'</div>'+
    '<table class="xtb"><tr><th>關</th><th>遊戲</th><th>答對</th></tr>'+(LVS||GM).map(function(g,i){var a=0,m=0;R.lvOf.forEach(function(l,k){if(l===i){m++;if(R.Q[k]&&R.Q[k][0])a++}});return '<tr><td>'+(i+1)+'</td><td>'+g.ic+' '+esc(g.nm)+'</td><td class="'+(a===m?'ok':'')+'">'+a+' ／ '+m+'</td></tr>'}).join('')+'</table>';
  var W=[];R.Q.forEach(function(x,k){if(!x[0])W.push(R.gs[k].B[R.idx[k]])});
  if(W.length)h+='<div class="wl"><div class="note">📌 答錯 的 題目（按〔🔊〕聽）</div>'+W.map(function(q){return '<div class="w">'+(q.ae?'<button data-say="'+esc(q.ae)+'">🔊</button>':'')+esc(q.q)+'<br>✅ <b>'+esc(q.oz?q.oz[0]:q.o[0])+'</b>　'+esc(q.z||'')+'</div>'}).join('')+'</div>';
  h+='<div class="nav"><button class="go" data-xn="'+R.x+'" data-bk="'+(R.bk||'A')+'">🔁 再 挑戰 一次</button><button data-x="hub">🎮 回 大廳</button></div>'+(typeof scByeHTML==='function'&&typeof SCID!=='undefined'&&SCID?scByeHTML():'')+'</div>';
  $('#app').innerHTML=h;window.scrollTo(0,0)}
function rec1(){try{if(typeof scLive!=='function'||!scLive()||R.sent)return false;R.sent=1;var u=SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  var Rr={id:SCID,set:R.x?'g4gm_mt-'+(R.bk==='B'?'n':R.bk==='H'?'h':'x')+R.x:'g4gm_mt-'+R.g.id,name:R.x?'📝 四年級 複習｜📝 '+XNM(R.x):'📝 四年級 複習｜'+R.g.ic+' '+R.g.nm,m:'g',qs:R.Q,raw:R.sc,fix:0,mp:0,mw:0,sec:Math.round((Date.now()-R.t0)/1000),src:'school',dev:SCDEV,u:u,t:Date.now()};
  var QQ=scGet('q')||[];QQ.push(Rr);scPut('q',QQ.slice(-200));scFlush();return true}catch(e){return false}}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if((b=c('[data-g]'))){start(b.getAttribute('data-g'));return}
  if((b=c('[data-xn]'))){XBK=b.getAttribute('data-bk')||XBK;if(DUOM&&CR)duoStart(+b.getAttribute('data-xn'));else startX(+b.getAttribute('data-xn'));return}
  if((b=c('[data-duo]'))){DUOM=+b.getAttribute('data-duo');$$('[data-duo]').forEach(function(x){x.classList.toggle('on',+x.getAttribute('data-duo')===DUOM)});return}
  if((b=c('[data-xr]'))){XBK=b.getAttribute('data-bk')||'A';resumeX(+b.getAttribute('data-xr'));return}
  if((b=c('[data-x]'))){var a=b.getAttribute('data-x');if(a==='hub'){if(R&&R.x&&!R.crs&&R.k<R.idx.length&&b.classList.contains('qx'))xAsk();else hub()}else if(a==='xstay'){$('#xq').classList.remove('on');if(R&&!R.lock)tGo()}else if(a==='xleave'){$('#xq').classList.remove('on');hub()}else if(a==='hear')sayQ(0);else if(a==='say')sayList(R.q.lab||[['',R.q.ae]]);else if(a==='next'){if(!b.disabled)next()}
    else if(a==='slow')sayQ(1);else if(a==='ngl')ngMove(-1);else if(a==='ngr')ngMove(1);else if(a==='ngf')ngFire();else if(a==='rdgo'){if(!b.disabled){R.rd[R.q.pas]=1;show()}}
    else if(a==='again')start(R.g.id);else if(a==='bk'&&R&&!R.lock){R.pk.pop();drawSp()}return}
  if((b=c('[data-say]'))){say(b.getAttribute('data-say'));return}
  if(t.id==='wfn'){wGo();return}if(t.id==='wfs'){sayList(R.q.fs,null,R.g.id==='m2'?500:450);return}
  if(!R||R.lock)return;
  if((b=c('#stage [data-o]'))&&NG[R.g.id]){if(R.g.id==='n3'){snGo(+b.getAttribute('data-o'));return}if(ngTap(b))return}
  if((b=c('#stage [data-d]'))){snDir(b.getAttribute('data-d'));return}
  if((b=c('#stage [data-o]'))){var i=+b.getAttribute('data-o');R.clickW=b.getAttribute('data-w');if(i>=0)pick(i,R.clickW?WHO[R.clickW][1]:'');return}
  if((b=c('[data-t]'))){var k=+b.getAttribute('data-t');if(R.pk.indexOf(k)>=0)return;R.pk.push(k);drawSp();var w=R.q.spell;
    if(R.pk.length>=w.length-2){var s=w[0]+R.pk.map(function(x){return R.tiles[x]}).join('')+w.slice(-1);pick(s===w?0:1,s)}}});
/* ══ 2026-10-27 第三十次 2-(2)(4)（老師 選 A「跟 三年級 一樣」）：📝 四年級 複習、🪤 四年級 複習 0 在〔⚡ 現場任務〕開 ══
   只有 網址 ?live=0402（現場任務 平板 自己 帶 過來）才 是 課堂 模式；老師 大螢幕 寫 Firebase rooms/0402/cr ＝ {on, t, set:'mt'|'mt0', gs:[遊戲], m:'self'|'sync', q, deck:[[遊戲,第幾題]…]}
   〔🙋 學生 自己 答〕＝ 大廳 只 剩 老師 選 的 遊戲（沒有 25／50 題、沒有 🏠），一回 10 題；進度 寫 crp/5碼
   〔👥 全班 同步〕＝ 老師 按〔▶ 下一題〕全班 一起 做 同一題；答完 ＝「等 老師」；答案 寫 cra/編號/5碼
   成績：g4gm_mt-遊戲（跟 平常 一樣；m12 ＝「🪤 四年級 複習 0」）➜ 老師看板〔🏫 課堂複習〕大表 */
var CR=null;
function crName(){var m=CR&&CR.cfg&&/^([xn])(\\d+)$/.exec(CR.cfg.set||'');return '📝 四年級 複習'+(m?'｜📝 '+(m[1]==='n'?'新 ':'')+m[2]+' 題 挑戰':'')}   /* 2026-10-27 第三十一次：不再 有「🪤 四年級 複習 0」；第三十二次：25／50 題 */
function crWait(t,extra){var o=$('#crw');if(!t){o.classList.remove('on');return}o.innerHTML='<div class="crb"><div class="cri">⚡</div><div class="crt">'+t+'</div>'+(extra||'')+'</div>';o.classList.add('on')}
/* 2026-10-27 第三十二次（老師：現場任務 試過 完全 失敗，學生 看不到 任務）：學生 如果 已經 在 這一頁（不是 從 ⚡ 現場任務 進來 的），
   登入 以後 每 2 秒 看 一次 自己 班 的 rooms/0班/cr：老師 一 開 ＝ 蓋 一整頁「老師 開了 …！馬上 進去」➜ 自己 換到 ?live=0班（不用 再 掃 QR）*/
function crAuto(){if(/[?&]live=/.test(location.search)||typeof LDB==='undefined'||!LDB.on())return;var room='',stop=null,go=0;
  setInterval(function(){var id=typeof SCID!=='undefined'?String(SCID||''):'';var r=/^\\d{5}$/.test(id)?'0'+id.slice(0,3):'';if(r===room)return;room=r;if(stop){stop();stop=null}if(!r)return;
    stop=LDB.poll('rooms/'+r+'/cr',2000,function(v){if(go||!v||!v.on||Date.now()-(+v.t||0)>4*36e5)return;go=1;var o=document.createElement('div');o.id='crgo';
      o.innerHTML='<div class="crgob"><div style="font-size:clamp(70px,12vh,120px)">📢</div><div class="crgot">老師 開了 四年級 複習！</div><div style="font-size:28px">⏳ 馬上 進去…</div></div>';document.body.appendChild(o);
      setTimeout(function(){location.replace(location.pathname+'?live='+r)},1400)})},2000)}
function crInit(){var m=/[?&]live=(\\d{4})/.exec(location.search);if(!m){crAuto();return}CR={room:m[1],t:0,cfg:null,acc:{},n:0,ok:0,q:-9,rd:{}};document.body.classList.add('crm');
  if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();crInit2()});return}crInit2()}
function crInit2(){crWait('⏳ 等 老師 開始…');if(typeof LDB==='undefined'||!LDB.on()){crWait('📶 現場任務 還沒 開（老師 要 先 設定 Firebase）');return}LDB.poll('rooms/'+CR.room+'/cr',900,crOn)}
function crStop(){clr();stopSay();FBN++;$('#wf').classList.remove('on')}
function crOn(v){if(!CR)return;XLV.cfg(v);if(!v||!v.on){if(CR.cfg){crFlush();CR.cfg=null;R=null;crStop();$('#app').innerHTML='';document.body.classList.remove('crs');
      crWait('✅ 老師 結束 了，謝謝！','<a class="crbk" href="../live/index.html">⬅ 回 現場任務</a>')}else crWait('⏳ 等 老師 開始…');return}
  if(v.t!==CR.t){if(CR.cfg)crFlush();CR.t=v.t;CR.cfg=v;CR.acc={};CR.n=0;CR.ok=0;CR.q=-9;CR.sc=0;CR.st=0;CR.rd={};R=null;crStop();
    document.body.classList.toggle('crs',v.m==='sync');if(v.m==='self'){crWait('');hub();if(/^[xn]\\d+$/.test(v.set||''))XLV.intro(Math.round((+v.d||0)/60000),function(){})}else{$('#app').innerHTML='';crWait('⏳ 等 老師 出 第 1 題…')}}
  if(v.m==='sync'&&v.q!==CR.q){CR.q=v.q;if(v.q>=0&&v.deck&&v.deck[v.q])crQ(v.deck[v.q]);else if(v.q>=0)crWait('⏳ 等 老師…')}}
/* 全班 同步：一題 ＝ 一次 小 回合（答完 不 自己 走，等 老師 按 下一題）*/
function crQ(d){var g=GMA.filter(function(x){return x.id===d[0]})[0];if(!g||!g.B[d[1]])return;crWait('');
  if(R&&R.crs&&!R.done&&!R.Q.length)R.Q.push([0,-1,0,0,0,R.qi]);   /* 還沒 答 老師 就 換 ＝ 答錯（時間 到 沒有 選 ＝ 答錯）*/
  if(R&&R.crs)crKeep();crStop();
  R={g:g,idx:[d[1]],k:0,sc:CR.sc||0,st:CR.st||0,Q:[],W:[],t0:Date.now(),rd:CR.rd,crs:1};show()}
function crKeep(){if(!R||!R.Q.length)return;var a=CR.acc[R.g.id]=CR.acc[R.g.id]||[];R.Q.forEach(function(x){a.push(x)});R.Q=[]}
function crDone(){CR.sc=R.sc;CR.st=R.st;var ok=R.Q.length?R.Q[0][0]:0;crKeep();R.done=1;
  if(typeof LDB!=='undefined'&&SCID)LDB.set('rooms/'+CR.room+'/cra/'+CR.t+'_'+CR.q+'/'+SCID,ok?1:0);
  $('#app').innerHTML='';crWait(ok?'✅ 答對 了！<br><small>等 老師 按 下一題…</small>':'💪 答好 了！<br><small>等 老師 按 下一題…</small>')}
/* 送 成績：同步 ＝ 每一種 遊戲 一筆；自己 答 ＝ 還沒 送 的 那一回 */
function crFlush(){if(!CR||!CR.cfg)return;if(R&&R.crs){if(!R.done&&!R.Q.length)R.Q.push([0,-1,0,0,0,R.qi]);crKeep()}
  if(R&&!R.crs&&!R.sent&&R.Q&&R.Q.length)rec1();
  Object.keys(CR.acc).forEach(function(id){var Q=CR.acc[id];if(!Q.length||typeof scLive!=='function'||!scLive())return;var g=GMA.filter(function(x){return x.id===id})[0],u=SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    var QQ=scGet('q')||[];QQ.push({id:SCID,set:'g4gm_mt-'+id,name:'📝 四年級 複習｜'+g.ic+' '+g.nm,m:'g',qs:Q,raw:0,fix:0,mp:0,mw:0,sec:0,src:'school',dev:SCDEV,u:u,t:Date.now()});scPut('q',QQ.slice(-200))});
  CR.acc={};try{scFlush()}catch(e){}}
/* 自己 答：進度 給 老師 看 */
function crProg(ok){if(!CR||!CR.cfg||CR.cfg.m!=='self'||typeof LDB==='undefined'||!SCID)return;var P=CR.pn=CR.pn||{},c=P[SCID]=P[SCID]||{n:0,ok:0};c.n++;if(ok)c.ok++;CR.n++;if(ok)CR.ok++;xPub(c)}   /* 兩人 一台：各 算 各 的；2026-10-30 第三十四次：多 分數 s、另一個 人 p */
function xPub(c){if(!CR||!CR.cfg||!SCID)return;c=c||(CR.pn||{})[SCID]||{n:0,ok:0};var o={n:c.n,ok:c.ok,g:R&&R.g?R.g.id:'',s:R&&R.x?Math.min(100,Math.round((R.sc||0)*10)/10):0};if(DUO)o.p=DUO.id[1-DUO.cur];XLV.prog(CR.room,CR.t,SCID,o)}
/* 2026-10-30 第三十四次 第 10、12-(4) 點：老師 大螢幕 時間 到 ➜ 答了 幾題 就 送 幾題（沒 答 的 0 分；兩人 一台 兩個 人 都 送）*/
window.xForce=function(){if(!R||!R.x||R.crs||R.fz)return false;var sent=false;try{decClose()}catch(e){}coopStop();clr();stopSay();
  var one=function(){R.fz=1;if(R.Q.length&&!R.sent){if(rec1())sent=true}xDel(R.x);xPub()};
  if(DUO){var D=DUO;[0,1].forEach(function(k){if(D.done[k])return;R=D.R[k];SCID=D.id[k];D.done[k]=1;one()});DUO=null;SCID=D.id[0]}else one();
  $('#app').innerHTML='';return sent};
/* ══ 2026-10-30 第三十四次 第 1～4 點：🏠 四年級 25 題 闖關（回家 練習；只有 home.html 才 開：window.HOME25）══
   老師 的 決定：每個 年級 一個 專屬 網址＋QR（放 總首頁、老師看板）➜ 掃了 ➜ 打 班級號碼＋密碼 ➜ 馬上 第 1 題；
   題目 ＝ 25 題 挑戰 的 題庫 A 裡「全新 題」（跟 兩個 年級 期中考卷 100% 不一樣、不用 類似 題）、每次 先 出 沒 做過 的（XBK 'H'：存 進度、做過 的、最高分 都 分開，成績 g?gm_…-h25）；
   第一頁 大字「老師依課本、習作自己設計的練習題。」（可以 給 家長 看）；不限 總 時間（每一題 自己 的 倒數 照舊）；答對 唸完 正確 答案 才 下一題（第一批 規則）；不 自動 跳進 現場任務 */
if(window.HOME25){XBK='H';document.title='四年級 25 題 闖關';crAuto=function(){};
 var HMS='老師依課本、習作自己設計的練習題。';
 var hmEl=function(){var o=document.getElementById('hm25');if(!o){o=document.createElement('div');o.id='hm25';document.body.appendChild(o)}return o};
 var hmBanner=function(){try{var h=SCH.box().querySelector('h2');if(h)h.innerHTML='📝 四年級 25 題 闖關<br><span style="color:#FFE07A">'+HMS+'</span>'}catch(e){}};
 var hmGo=function(){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();hmGo()});hmBanner();return}XBK='H';hmEl().hidden=true;if(xLoad(25))resumeX(25);else startX(25)};
 var hmCover=function(){XBK='H';$('#app').innerHTML='';var o=hmEl(),v=xLoad(25),b=best('xh25');
   o.innerHTML='<div class="hmw"><div class="hmt">📝 四年級 25 題 闖關</div><div class="hms">'+HMS+'</div>'+
    '<div class="hmk"><span>🔓 句子 解碼 8 題</span><span>🎮 12 種 遊戲 17 題</span><span>⏳ 不限 時間</span><span>🔁 每次 題目 不一樣</span></div>'+
    '<div class="hmb">'+(v?'<button id="hmgo">▶ 繼續 第 '+(v.Q.length+1)+' 題<small>已經 做 了 '+v.Q.length+' ／ 25 題</small></button><button class="b2" id="hmnew">🔄 重新 開始</button>':'<button id="hmgo">▶ 開始 第 1 題</button>')+'</div>'+
    (b?'<div class="hmbest">🏆 我的 最高 '+b+' 分</div>':'')+(Date.now()<Date.parse('2026-11-01T23:59:59+08:00')?'<div class="hmbo">⏰ 11月1日（星期日）晚上11:59以前：🪙金幣、⭐經驗值 <b>✖2</b></div>':'')+'<a class="hmrv" href="../g4-review/index.html">🏠 回在家複習</a></div>';o.hidden=false;   /* 2026-10-31 第三十五次 第 9 點 */
   $('#hmgo').onclick=hmGo;var nw=$('#hmnew');if(nw)nw.onclick=function(){xDel(25);hmGo()}};
 var lobbyH=hub;hub=function(){lobbyH.apply(this,arguments);hmCover()};
 setTimeout(function(){if(typeof SCON!=='undefined'&&SCON&&!SCID)hmGo()},50)}
hub();crInit();
`;

const html = `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>四年級 複習</title>
<style>${CSS}${DECX.CSS}${NGX.CSS}</style></head>
<body>
${CL.home(4, '../', 'school')}
<script src="../live/fb.js"></script><script>${fs.readFileSync(path.join(__dirname, '..', 'live', '_db.js'), 'utf8')}</script><script>${fs.readFileSync(path.join(__dirname, '..', 'live', '_xlive_rt.js'), 'utf8')}</script>
${AUD ? '<script src="audio/aud.js"></script>' : ''}
${AUDX.map(d => '<script src="audio/' + d + '/aud.js"></script>').join('')}
<div id="duob"></div><div id="bossfx"></div><div id="coop"></div><div id="dcl"></div><div id="wf"><div class="box" id="wbox"></div></div><div id="xq"><div class="xqb"><div class="xqi">🛑</div><div class="xqh">真的 要 離開 嗎？</div><div class="xqt"></div><div class="xqbtn"><button data-x="xstay" id="xstay">▶ 繼續 作答</button><button data-x="xleave" id="xleave">🚪 先 離開</button></div></div></div>
<div id="app" class="scr"></div><div id="crw"></div>
<script>${require('../score/_dsp.js').js()}</script>
<script>${JS}</script>
</body></html>`;   /* 2026-10-31：不 空格 的 script 放 在 JS 前面（home.html 的 HOME25 插在 最後 一個 <script> 前面）*/
/* 2026-10-30 第三十四次 第 9-(1) 點：解碼 教學、秒懂 動畫 要 唸 的 句子 一句 都 不可以 沒有 語音檔 ➜ build 失敗 */
{ const AK = t => String(t).replace(/[’]/g, "'").replace(/[=＝≠➜→⇒…＿_　]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(),
    rd = f => { if (!fs.existsSync(f)) return {}; const c = { window: {} }; require('vm').runInNewContext(fs.readFileSync(f, 'utf8'), c); return Object.assign({}, ...Object.values(c.window).filter(x => x && typeof x === 'object')); },
    M = Object.assign(rd(path.join(__dirname, 'audio', 'aud.js')), rd(path.join(__dirname, 'audio', 's', 'aud.js'))), need = [];
  ['A', 'B'].forEach(b => [1, 2].forEach(u => D.LES[b][u].s.forEach(S => { if (S.eq) need.push(S.eq.a.say, S.eq.b.say); else need.push(S.en); }))); [D.DTUT.demo, D.DTUT.ord].concat(D.DTUT.quiz).forEach(q => need.push(q.en));
  const miss = AUD ? need.filter(t => !M[AK(t)]) : []; if (miss.length) { console.error('✗ 解碼 動畫 沒有 語音檔：' + miss.join('、')); process.exit(1); } }
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
/* 2026-10-30 第三十四次 第 1～4 點：🏠 四年級 25 題 闖關 的 專屬 網址（同一個 網頁，多 一個 HOME25）*/
{ const i = html.lastIndexOf('<script>'); fs.writeFileSync(path.join(__dirname, 'home.html'), (html.slice(0, i) + '<script>window.HOME25=1</script>' + html.slice(i)).replace('<title>四年級 複習</title>', '<title>四年級 25 題 闖關</title>')); }
console.log('midterm ok：' + GM.length + ' 種遊戲、' + GM.reduce((s, g) => s + g.B.length, 0) + ' 題；' + Math.round(html.length / 1024) + ' KB');
