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

/* ── 👑 冠軍寶箱 登入 動畫（2026-10-26 第二十九次 第 11 點）── */
#scch{position:fixed;inset:0;z-index:120;display:none;background:radial-gradient(circle at 50% 38%,#3A2A08 0,#120C02 45%,#000 80%);overflow:hidden;color:#fff;font-family:inherit}
#scch.on{display:block}.chw{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(8px,1.8vh,18px);padding:16px;text-align:center}
.chray{position:absolute;left:50%;top:44%;width:0;height:0;animation:chSpin 18s linear infinite}.chray i{position:absolute;left:-30px;top:-80vh;width:60px;height:80vh;background:linear-gradient(rgba(255,213,74,0),rgba(255,213,74,.16));transform-origin:30px 80vh}
.chcr{line-height:1;font-size:clamp(70px,11vh,120px);transition:font-size .6s;animation:chDrop 1s cubic-bezier(.3,1.5,.5,1) both;filter:drop-shadow(0 0 18px rgba(255,213,74,.7))}
.cht{font-size:clamp(46px,8vh,92px);font-weight:700;letter-spacing:.12em;background:linear-gradient(#FFF6C8,#FFD54A 45%,#C98A00);-webkit-background-clip:text;background-clip:text;color:transparent;animation:chIn .8s .7s both;text-shadow:0 0 30px rgba(255,213,74,.35)}
.chwhy{font-size:clamp(24px,3.8vh,40px);font-weight:700;line-height:1.45;animation:chIn .7s 1.5s both}.chwhy b{color:#FFE07A}.chrk{display:inline-block;font-size:1.5em;color:#FFD54A;animation:chPop .6s 2.1s both}.chs{font-size:.9em}.chsm{font-size:max(18px,.55em);color:#D8C9A0;font-weight:400}
.chbox{position:relative;flex-shrink:0;width:clamp(150px,22vh,260px);height:clamp(110px,17vh,210px);border:0;background:none;cursor:pointer;animation:chIn .6s 2.6s both,chBob 1.8s 3.2s ease-in-out infinite;touch-action:manipulation}
.chbd{position:absolute;left:0;right:0;bottom:0;height:62%;border-radius:12px;background:linear-gradient(#B0641A,#6E3A0C);box-shadow:inset 0 0 0 6px #FFD54A,0 10px 30px rgba(0,0,0,.6);display:flex;align-items:flex-start;justify-content:center}
.chlk{font-style:normal;font-size:clamp(28px,4vh,40px);margin-top:-6%}
.chlid{position:absolute;left:-3%;right:-3%;top:4%;height:38%;border-radius:40% 40% 10px 10px;background:linear-gradient(#D8892A,#8A4A10);box-shadow:inset 0 0 0 6px #FFD54A;transform-origin:50% 100%;transition:transform .6s cubic-bezier(.3,1.6,.5,1)}
.chgl{position:absolute;left:10%;right:10%;bottom:40%;height:0;background:radial-gradient(ellipse at 50% 100%,rgba(255,240,170,.95),rgba(255,213,74,0) 70%);transition:height .7s}
.chbox.shake{animation:chShake .35s infinite}.chbox.open{animation:none}.chbox.open .chlid{transform:translateY(-40%) rotateX(70deg) rotate(-14deg)}.chbox.open .chgl{height:160%}.chbox.open .chlk{opacity:0}
.chtap{font-size:clamp(26px,4vh,40px);font-weight:700;color:#FFE07A;animation:chIn .5s 3s both}.chtap b{font-size:1.15em}
.chbag{display:flex;align-items:center;gap:clamp(10px,2vw,22px);background:rgba(255,255,255,.08);border:3px solid rgba(255,213,74,.6);border-radius:22px;padding:10px 22px;font-size:clamp(22px,3.2vh,32px);font-weight:700;animation:chIn .5s 3.2s both}
.chbag .chbi{font-size:1.5em}.chbag.pulse{animation:chBag .5s 3}.chn b{color:#FFE07A}
.chfly{position:fixed;z-index:121;font-size:clamp(34px,5vh,52px);pointer-events:none;animation:chFly 1.5s cubic-bezier(.4,0,.6,1) forwards;filter:drop-shadow(0 0 10px rgba(255,213,74,.8))}
.chend{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:clamp(24px,3.6vh,36px);font-weight:700;animation:chIn .6s both}.chend[hidden]{display:none}
.chend button{font-family:inherit;font-weight:700;font-size:clamp(24px,3.8vh,36px);min-height:64px;padding:0 40px;border-radius:999px;border:3px solid #39D98A;background:#0F3323;color:#fff;cursor:pointer}
.chmsg{position:absolute;left:0;right:0;bottom:10px;font-size:22px;color:#FFB4B4}.chw.done .chcr{font-size:clamp(44px,6vh,70px)}.chw.done .cht{font-size:clamp(36px,5.5vh,60px);transition:font-size .6s}.chw.done .chsm{display:none}
@keyframes chSpin{to{transform:rotate(360deg)}}@keyframes chDrop{from{transform:translateY(-60vh) scale(1.6);opacity:0}to{transform:none;opacity:1}}
@keyframes chIn{from{opacity:0;transform:translateY(24px) scale(.94)}to{opacity:1;transform:none}}@keyframes chPop{0%{transform:scale(0)}70%{transform:scale(1.35)}to{transform:scale(1)}}
@keyframes chBob{50%{transform:translateY(-10px) rotate(-2deg)}}@keyframes chShake{0%,100%{transform:rotate(0)}25%{transform:rotate(-6deg)}75%{transform:rotate(6deg)}}
@keyframes chBag{50%{transform:scale(1.08);box-shadow:0 0 24px rgba(255,213,74,.7)}}
@keyframes chFly{0%{transform:translate(0,0) scale(.4);opacity:0}25%{transform:translate(var(--ux),-140px) scale(1.25);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(.5);opacity:.9}}
@media (max-height:820px){.chcr{font-size:64px}.cht{font-size:50px}.chw{gap:8px}}
@media (prefers-reduced-motion:reduce){.chray{animation:none}.chcr,.cht,.chwhy,.chbox,.chtap,.chbag{animation:none}}
/* ── 老師派任務（2026-10-09 E）：大廳上面的任務條、遊戲卡的 🔒／⏰、鎖住時的一整頁 ── */
.sctask{display:flex;flex-direction:column;gap:6px;margin:0 auto clamp(6px,1.2vh,12px);max-width:1100px;width:100%}
.sctkl{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;background:#2A2208;border:3px solid var(--gold);border-radius:18px;
 padding:clamp(6px,1vh,10px) clamp(10px,1.6vw,18px);font-size:clamp(19px,3vh,28px);font-weight:700;color:#FFE9A8;line-height:1.3}
.sctkl b{color:#fff}.sctkl span{white-space:nowrap}.sctkl span.ok{color:var(--ok)}.sctkl em{font-style:normal;color:#FFD24A;white-space:nowrap;margin-left:auto}
.gcard.tklock{filter:grayscale(1);opacity:.45}
.gcard.tkon{border-color:var(--gold)!important;box-shadow:0 0 0 3px rgba(255,210,74,.55),0 0 26px rgba(255,210,74,.45)!important}
.sctkc{display:block;margin-top:4px;font-size:clamp(16px,2.5vh,22px);font-weight:700;color:#FFE9A8;white-space:nowrap}
.sctkc.open{color:#FFD24A}
#sctk{position:fixed;inset:0;z-index:95;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.88);padding:16px}
#sctk.on{display:flex}
.sctkb{display:flex;flex-direction:column;align-items:center;gap:clamp(10px,2vh,20px);max-width:1000px;width:100%;text-align:center}
.sctki{font-size:clamp(70px,14vh,140px);line-height:1}
.sctkw{font-size:clamp(28px,5vh,50px);font-weight:700;color:#fff}.sctkw b{color:var(--gold)}
.sctks{font-size:clamp(22px,3.6vh,34px);font-weight:700;color:#CFCFCF}
#sctkOk{font-family:inherit;font-weight:700;font-size:clamp(24px,4.2vh,40px);border-radius:999px;border:3px solid var(--ok);background:#0F3323;color:#fff;
 padding:clamp(10px,1.8vh,18px) clamp(30px,4vw,56px);min-height:64px;cursor:pointer}
/* ── 🔑 8 碼 密碼（2026-10-28 第三十三次 第 4 點）── */
.scpw .pwani{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px 10px;font-size:clamp(20px,3.2vh,30px);font-weight:700;color:#DDE6EE;background:#0E141A;border:2px solid #2E3A46;border-radius:18px;padding:8px 14px}
.scpw .pwani b{color:var(--gold)}.scpw .pwani .ar{color:#8FA3B5}
.scpw .pwex{display:inline-flex;gap:4px}.scpw .pwex i{font-style:normal;display:inline-flex;align-items:center;justify-content:center;width:1.4em;height:1.6em;border-radius:8px;opacity:0;animation:scPwEx 6s infinite}
.scpw .pwex i.l{background:#5A2340;color:#FFC2DD;border:2px solid #FF7AB6}.scpw .pwex i.d{background:#173452;color:#BFE2FF;border:2px solid #4FA8FF}
.scpw .pwlab{display:flex;gap:10px;font-size:clamp(17px,2.6vh,24px)}.scpw .pwlab .l{color:#FF9BC9}.scpw .pwlab .d{color:#8CCBFF}
@keyframes scPwEx{0%{opacity:0;transform:scale(.4)}8%,80%{opacity:1;transform:scale(1)}100%{opacity:0}}
.scpw .pwt{font-size:clamp(24px,4vh,38px);font-weight:700;color:#fff;text-align:center}
.scpw .pwc{display:flex;gap:clamp(4px,.8vw,10px)}.scpw .pwc i{font-style:normal;width:clamp(42px,6.4vh,64px);height:clamp(54px,8vh,80px);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:clamp(28px,5vh,46px);font-weight:700;color:#fff}
.scpw .pwc i.l{background:#2A1220;border:3px solid #FF7AB6}.scpw .pwc i.d{background:#0E1E30;border:3px solid #4FA8FF}.scpw .pwc i.cur{box-shadow:0 0 0 4px var(--gold);animation:scStep 1.2s ease-in-out infinite}
.scpw .pwc i.sp{margin-left:clamp(6px,1.4vw,18px)}
.scpw .pwm{min-height:1.4em;font-size:clamp(20px,3.2vh,30px);font-weight:700;color:#FFE07A;text-align:center}.scpw .pwm.err{color:#FF8A8A}.scpw .pwm.ok{color:var(--ok)}
.scpw .sckey.pwk{grid-template-columns:repeat(7,clamp(54px,8.4vh,84px))}.scpw .sckey.pwk button{min-height:clamp(52px,7.4vh,76px);font-size:clamp(24px,4vh,38px)}
.scpw .sckey.pwk.dg{grid-template-columns:repeat(6,clamp(64px,10vh,100px))}
.scpw .pwrow{display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:center}
.scpw .pwrem{display:flex;align-items:center;gap:10px;font-size:clamp(18px,2.8vh,26px);font-weight:700;color:#DDE6EE;background:#141A20;border:2px solid #3A4A58;border-radius:16px;padding:8px 14px;min-height:52px;cursor:pointer}
.scpw .pwrem input{width:30px;height:30px}
.scvow{text-align:center}.scvow .vwi{font-size:clamp(46px,8vh,72px);margin:6px 0}
.scvow .vwl{display:flex;align-items:center;justify-content:center;gap:14px;margin:10px auto;max-width:640px;padding:16px 18px;border-radius:20px;border:4px solid #FFD54A;background:#221B05;color:#FFE9A8;font-size:clamp(24px,3.6vh,34px);font-weight:700;cursor:pointer;animation:vwp 1.4s ease-in-out infinite}
.scvow .vwl.on{border-color:#39D98A;background:#0C2A18;color:#CFF7DF;animation:none}.scvow .vwl input{width:44px;height:44px;flex:none;accent-color:#39D98A}
.scvow .vwh{font-size:clamp(20px,2.8vh,26px);color:#DDE6EE;margin:8px 0}
.scvow .vwb{min-height:72px;padding:6px 34px;border-radius:22px;border:4px solid #7BF0A8;background:linear-gradient(#36D27A,#1E9E55);color:#06210F;font:inherit;font-weight:700;font-size:clamp(26px,4vh,38px);cursor:pointer}
.scvow .vwb:disabled{opacity:.35;filter:grayscale(1);cursor:default}
@keyframes vwp{0%,100%{box-shadow:0 0 0 0 #FFD54A66}50%{box-shadow:0 0 0 10px #FFD54A00}}@media (prefers-reduced-motion:reduce){.scvow .vwl{animation:none}}.scpw .pweye{min-height:52px;border-radius:16px;background:#141A20;border:2px solid #3A4A58;color:#fff;font:inherit;font-weight:700;font-size:clamp(18px,2.8vh,26px);padding:6px 14px;cursor:pointer}
/* ── 成績紀錄（2026-10-07 對話 C） ── */
.sclog{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.3vh,14px);width:100%}
.sclog h2{font-size:clamp(28px,5vh,50px)!important;margin:0}
.sclv{font-size:clamp(22px,3.6vh,36px);font-weight:700;color:#FFE082;text-align:center}
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
.scbox.shake .scg.c{animation:scShake .45s}.scpw .pwc.shake{animation:scShake .45s}
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
.scCov{height:1.3em;width:2.6em;object-fit:cover;border-radius:.28em;border:2px solid #FFD54A;vertical-align:middle;margin:0 .3em .12em 0;box-shadow:0 0 8px rgba(255,213,74,.45)}
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
/* 學生登入（D 第 6 件）：首頁橫幅、整頁大字 */
#scbar{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px 16px;align-self:stretch;width:auto;margin:0 0 8px;background:#10240F;border-bottom:3px solid #3BD16F;color:#fff;
  font-size:clamp(22px,3.4vh,32px);font-weight:700;padding:8px 16px;position:relative;z-index:5}
#scbar[hidden]{display:none}#scbar b{color:#FFE07A;letter-spacing:.04em}
#scbar button,.scfull button,.scbye button{font-family:inherit;font-weight:700;border-radius:14px;border:0;cursor:pointer;min-height:52px;padding:6px 22px;font-size:clamp(22px,3.2vh,30px);color:#000}
.scfull{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.94);display:none;align-items:center;justify-content:center;padding:16px;text-align:center;color:#fff}
.scfull.on{display:flex}.scfb{display:flex;flex-direction:column;align-items:center;gap:clamp(10px,2.4vh,24px);max-width:900px}
.scfull .sfic{font-size:clamp(90px,16vh,160px);line-height:1}
.scfull .sf1{font-size:clamp(36px,6.4vh,64px);font-weight:700;color:#FFE07A}
.scfull .sf2{font-size:clamp(32px,5.6vh,56px);font-weight:700}.scfull .sf2 b{color:#FFE07A;font-size:1.3em}
.scfull .sf3{font-size:clamp(26px,4.4vh,40px);font-weight:700;color:#CFE3F5}
.scfull .sfid{font-size:clamp(80px,15vh,150px);font-weight:700;letter-spacing:.08em;line-height:1.1}
.scfull .sfbt{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
.scfull button{min-height:clamp(64px,10vh,90px);padding:8px 30px;font-size:clamp(28px,4.6vh,42px)}
#scbar a.scH{cursor:pointer;display:inline-flex;align-items:center;font-weight:700;border-radius:14px;min-height:52px;padding:6px 18px;font-size:clamp(22px,3.2vh,30px);color:#FFE9A8;background:#3A2E08;border:3px solid #FFD54A;text-decoration:none}
.scY{background:#3BD16F!important}.scN{background:#FF8A80!important}.scK{background:#FFD54A!important}
/* 總首頁：一頁要放得下（iPad 橫放不可以有捲軸）➜ 橫幅放在「首頁」那一行，不多佔一行 */
#scbar.inl{display:inline-flex;border:2px solid #3BD16F;border-radius:999px;padding:0 3px 0 14px;font-size:clamp(22px,2.9vh,28px);vertical-align:middle;margin:0 0 0 .5em;gap:8px;letter-spacing:0}
body.scq .url{display:none}
/* 在家複習首頁（老師 2026-10-17 C8 另 6）：學生不知道要先登入 ➜ 大大的「兩個好習慣」：① 先〔🔑 登入〕練習才會記到老師那裡 ② 練完〔👋 登出〕保護自己和同學 */
#scbar.hab{flex-direction:column;gap:clamp(8px,1.6vh,14px);background:radial-gradient(ellipse at 50% 0,#2A2008,#0A0A06 80%);border:3px solid #FFD54A;border-radius:22px;margin:4px 0 14px;padding:clamp(10px,2vh,18px) clamp(12px,2vw,24px)}
#scbar.hab.in{background:#0D1F14;border-color:#3BD16F;flex-direction:row;padding:10px 16px}
.hab .hh{font-size:clamp(26px,4.2vh,40px);color:#FFE07A}
.hab .hgo{position:relative;display:inline-block;margin-right:clamp(50px,7.6vh,74px)}
#scbar.hab .hgo button{min-height:clamp(70px,10vh,92px);font-size:clamp(32px,5vh,48px);padding:8px 44px;border-radius:20px;box-shadow:0 0 0 0 rgba(255,213,74,.7);animation:habPulse 1.6s ease-out infinite}
@keyframes habPulse{70%{box-shadow:0 0 0 22px rgba(255,213,74,0)}100%{box-shadow:0 0 0 0 rgba(255,213,74,0)}}
/* 2026-10-24 第二十三次第 3 點：手指原本蓋在〔先 登入〕的「入」上面 ➜ 移到按鈕右邊外面（右邊先留位置），指向按鈕 */
.hab .hf{position:absolute;left:calc(100% + 4px);top:calc(50% - .4em);line-height:1;font-size:clamp(44px,7vh,66px);pointer-events:none;animation:habTap 1.6s ease-in-out infinite;transform-origin:30% 10%}
@keyframes habTap{0%,100%{transform:translate(16px,0) rotate(-60deg)}45%{transform:translate(0,0) rotate(-60deg) scale(.9)}55%{transform:translate(0,0) rotate(-60deg) scale(.8)}}
@media(max-width:480px){#scbar.hab .hgo button{padding:8px 14px}.hab .hgo{margin-right:44px}.hab .hf{font-size:40px}}
.hab .hs{display:grid;grid-template-columns:1fr;gap:clamp(6px,1.2vh,10px);width:min(980px,100%)}
.hab .hst{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:12px;background:#111;border:2px solid #3A3A3A;border-radius:16px;padding:6px 14px;font-size:clamp(22px,3.2vh,30px);text-align:left;opacity:0;animation:habIn .6s ease-out forwards}
.hab .hst:nth-child(2){animation-delay:.9s}.hab .hst .hn{font-size:1.3em;color:#FFE07A}
.hab .hfl{display:inline-flex;align-items:center;gap:.25em;white-space:nowrap}.hab .hfl i{font-style:normal;display:inline-block;animation:habHop 2.4s ease-in-out infinite}
.hab .hfl i:nth-child(3){animation-delay:.4s}.hab .hfl i:nth-child(5){animation-delay:.8s}.hab .hfl em{font-style:normal;color:#8FA3B5}
@keyframes habHop{0%,60%,100%{transform:none}30%{transform:translateY(-8px) scale(1.15)}}
@keyframes habIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.hab .hok{font-size:clamp(24px,3.6vh,34px)}.hab .hok small{display:block;font-size:.72em;color:#CFE3F5}
@media (prefers-reduced-motion:reduce){#scbar.hab *{animation:none!important;opacity:1!important}}
#scbar.inl[hidden]{display:none}#scbar.inl button{min-height:48px;padding:2px 16px;font-size:clamp(22px,2.9vh,28px)}
.sccare2{width:min(1180px,96vw);margin:0 auto}
@media (min-aspect-ratio:5/4){.sccare2{display:grid;grid-template-columns:minmax(190px,24%) minmax(0,1fr);gap:14px;align-items:start}.sccare2 .gcard{grid-template-columns:1fr;width:100%;margin:0}}
.schero{display:flex;align-items:center;justify-content:center;gap:clamp(12px,3vw,40px);flex-wrap:wrap;width:100%}
.shimg{position:relative;width:clamp(150px,24vh,240px)}.shimg img{display:block;width:100%;border-radius:16px;border:4px solid #FFD54A;box-shadow:0 0 22px rgba(255,213,74,.5);animation:shIn .7s cubic-bezier(.2,1.5,.4,1)}
.shimg img.shp{position:absolute;right:-22%;bottom:-6%;width:52%;border-color:#7FD4FF;box-shadow:0 0 14px rgba(127,212,255,.6);animation-delay:.25s;animation-fill-mode:both}
@keyframes shIn{from{transform:scale(.3) translateY(40px);opacity:0}}
.shno{border:4px dashed #FFD54A;border-radius:16px;padding:30px 10px;font-size:clamp(24px,3.4vh,32px);text-align:center}
.shst{display:flex;flex-direction:column;gap:10px;min-width:min(100%,340px);font-size:clamp(24px,3.4vh,34px);text-align:left}
.shx b,.shc b{font-size:1.5em;color:#FFE07A}.shc small{font-size:.7em;color:#CFE3F5;margin-left:6px}
.shbar{height:26px;border-radius:999px;background:#1B2633;border:3px solid #34404C;overflow:hidden}.shbar i{display:block;height:100%;background:linear-gradient(90deg,#3B7BFF,#7FD4FF);transition:width 1.4s ease-out}
.shar{position:relative;width:min(640px,60vw);min-width:min(100%,340px);min-height:clamp(210px,34vh,330px);display:flex;align-items:center;border-radius:22px;background:radial-gradient(ellipse at 70% 60%,rgba(120,40,200,.35),transparent 60%),linear-gradient(160deg,#101A2E,#060A14);border:2px solid rgba(255,213,74,.4);box-shadow:inset 0 0 40px rgba(0,0,0,.6)}
.shar .shimg{width:clamp(120px,21vh,200px);margin-left:5%}
.shar .fxp{position:absolute;left:calc(5% + clamp(120px,21vh,200px) - 26px);bottom:5%;width:clamp(56px,9.5vh,92px);border-radius:12px;border:3px solid #7FD4FF;box-shadow:0 0 14px rgba(127,212,255,.7);animation:shPet 2.2s ease-in-out infinite;z-index:3}
@keyframes shPet{50%{transform:translateY(-8px) rotate(-3deg)}}
.shar .fxmon{width:min(34%,200px)}
.shfl{width:100%;text-align:center;font-size:clamp(20px,2.8vh,28px);color:#FFE9A8}.shfl b{color:#fff;text-shadow:0 0 10px #FF8A3D}
.shlv b{color:#FFE07A}.shgo{cursor:pointer;display:inline-flex;align-items:center;justify-content:center;min-height:56px;padding:6px 22px;border-radius:16px;background:#3A2E08;border:3px solid #FFD54A;color:#FFE9A8;text-decoration:none;font-size:.85em;align-self:flex-start}
.scbye{display:flex;align-items:center;justify-content:center;gap:12px 18px;flex-wrap:wrap;background:#1F1A08;border:3px solid #FFD54A;border-radius:18px;padding:6px 16px;
  font-size:clamp(20px,3vh,28px);font-weight:700;color:#fff}
.scbye span{display:flex;flex-direction:column;align-items:center;line-height:1.25}.scbye small{font-size:.8em;color:#CFE3F5}
.scbye button{background:#FF8A80;min-height:48px}
.sclkb{display:inline-block;margin-left:auto;background:#3A0E0E;border:2px solid #FF8A80;color:#FFD6D2;border-radius:999px;padding:2px 12px;font-size:clamp(16px,2.4vh,22px);font-weight:700;white-space:nowrap}
.sclocked{opacity:.75}.gcard .sclkb{position:absolute;top:8px;right:8px}
/* 2026-10-27 第三十二次 第 8 點（老師：學生 要 一眼 看到 按鈕 上方 的 上鎖 圖示）：大 標籤 貼在 按鈕 上方（左上角 突出 來），🔒 紅、✅ 綠；鎖住 的 變灰 */
[data-lk].sclk1{position:relative;margin-top:22px!important;overflow:visible!important}
[data-lk].sclk1>.sclkb{position:absolute;top:-20px;left:14px;margin:0;z-index:3;font-size:clamp(20px,2.8vh,26px);font-weight:900;padding:3px 16px;box-shadow:0 3px 10px #0008}
[data-lk].sclk1.sclocked{opacity:1;filter:grayscale(.75) brightness(.8)}[data-lk].sclk1.sclocked>.sclkb{filter:none;background:#B71C1C;border-color:#FFCDD2;color:#fff}
[data-lk].sclk1>.sclkb.ok{background:#1B7A3D;border-color:#B9F6CA;color:#fff}
.sctime{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.4vh,14px);padding:clamp(8px,2vh,20px) 0}
.sctime .stic{font-size:clamp(80px,14vh,130px);line-height:1}.sctime .stic svg{height:clamp(90px,15vh,140px);width:auto}
.sctime .st1{font-size:clamp(30px,5.4vh,52px);font-weight:700;color:#FFE07A;line-height:1.25}
.sctime .st2{font-size:clamp(26px,4.6vh,44px);font-weight:700;line-height:1.3}
.scab{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 14px;margin-top:6px;font-size:clamp(24px,3.4vh,32px);line-height:1.3}.scab .sab0{width:100%;text-align:center;color:#FFE9A8}
.scab>span{position:relative;padding:3px 12px 9px;border-radius:12px;border:2px solid #5DE89A;background:rgba(93,232,154,.12);white-space:nowrap}.scab>span.no{border-color:#FF7A8A;background:rgba(255,122,138,.12)}
.scab>span i{position:absolute;left:10px;right:10px;bottom:3px;height:5px;border-radius:9px;background:rgba(255,255,255,.15)}.scab>span i::after{content:'';position:absolute;left:0;top:0;bottom:0;width:0;border-radius:9px;background:#5DE89A;animation:scabG 1.2s ease-out .5s forwards}.scab>span.no i::after{background:#FF7A8A}
@keyframes scabG{to{width:var(--w)}}
.sctime .st3{font-size:clamp(24px,4.2vh,40px);font-weight:700;color:#CFE3F5;line-height:1.3}
.sctime .st4{font-size:clamp(20px,3.2vh,30px);font-weight:700;color:#CFCFCF}
.sctime .hclkm{transform-origin:50px 50px;transform:rotate(0deg)}
.sctime.go .hclkm{animation:scClk 1.6s cubic-bezier(.3,1.3,.6,1) forwards}
.sctime>div{animation:scUp .5s backwards}.sctime>div:nth-child(2){animation-delay:.25s}.sctime>div:nth-child(3){animation-delay:.5s}.sctime>div:nth-child(4){animation-delay:.75s}
@keyframes scClk{to{transform:rotate(420deg)}}
@keyframes scUp{from{opacity:0;transform:translateY(16px)}}
@media (prefers-reduced-motion:reduce){.sctime>div,.sctime.go .hclkm{animation:none}}
.scwait{font-size:clamp(22px,4vh,38px);font-weight:700;color:#CFCFCF}
.scwait i,.scspin{display:inline-block;animation:scSpin 1s linear infinite;font-style:normal}
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

const JS = require('fs').readFileSync(require('path').join(__dirname, '_honor_rt.js'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '..', 'rpg', '_wear_rt.js'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '..', 'rpg', '_fx_rt.js'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '_report_rt.js'), 'utf8') + `
/* ══════════ 成績紀錄（2026-10-07 對話 C；2026-10-08 對話 D：遊戲、Review 1 也記）══════════
   SCG ＝ 這一頁是幾年級（0 ＝ 三、四年級共用的 Review 1 遊戲：年級看登入的 5 碼）
   SCH ＝ 這一頁怎麼畫（下面那一段由 _tq.js／遊戲引擎／Review 1 複習各自給）：
     on() 畫面開著嗎、open() 打開、box() 畫在哪、back 回去的按鈕、key() 題組代號、name() 題組名稱、
     reopen() 換人以後回哪裡、rk() 作答中名次、btns(E) 最後一幕的按鈕、miss() 答錯整理的標題、act(a) data-sca 按鈕 */
var SCG=__SCG__,SCSRC=__SCSRC__;
var SCURL=String(window.SCORE_URL||'').replace(/^\\s+|\\s+$/g,''),SCON=!!SCURL&&!window.__SCORE_TEST_OFF;
var SCCLS={3:['304','307','311'],4:['402','406','409','410','400']},SCSEAT=30,SCAFTER={'400':'課後班'};   /* 400 ＝ 四年級課後班（2026-10-09 E9～E11）；跟 _calc.js 的 CLASSES／AFTER 一樣 */
function scCn(c){return SCAFTER[c]?c+' '+SCAFTER[c]:c+' 班'}
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
    if(body&&!body.k&&body.a!=='sp'){var bid=body.id||(body.r&&body.r.id),bk=(body.r&&body.r.k)||(bid?scPk(bid):'');if(bk)body.k=bk}   /* 2026-10-28：🔑 通行證 */
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
  var step=function(){Q=scGet('q')||[];if(!Q.length){SCBUSY=false;if(last)scTkLoad(function(){if(SCH&&SCH.tk)SCH.tk()});return last}   /* 送出去了 ➜ 任務的 ✅ 重拿 */
    var r=Q[0];if(!r.k){var kk=scPk(r.id);if(kk){r.k=kk;Q[0]=r;scPut('q',Q)}}
    return scFetch('',{a:'rec',r:r}).then(function(j){
      if(j&&(j.saved||j.err==='bad'||j.err==='spk')){Q=scGet('q')||[];Q=Q.filter(function(x){return x.u!==r.u});scPut('q',Q);if(j.saved){SCRES[r.u]=j;last=j}return step()}
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
  return gs.map(function(g){return G[g]+'年級：'+SCCLS[g].map(function(c){return SCAFTER[c]?c+'（'+SCAFTER[c]+'）':c}).join('、')}).join('　')}
function scLogin(after){
  if(window.stopPlay)stopPlay();sayStop();
  SCH.open();
  SCTYPED='';SCLOGAFTER=after;
  var box=function(n,k){var s='';for(var i=0;i<n;i++)s+='<i class="'+k+'"></i>';return s};
  var LV0=!!window.SCLIVE;   /* ⚡ 現場任務（2026-10-19 第十三次 3(3)(10)）：字 精簡、沒有〔⬅ 回首頁〕 */
  SCH.box().innerHTML='<div class="sclog'+(LV0?' sclive':'')+'">'+(LV0?'<h2>🔑 登入</h2><div class="sclv">輸入：你的 班級號碼〔共 5 碼〕</div>':'<h2>🔢 先登入，成績才會記下來</h2>')+
   (LV0?'':'<div class="scsteps"><span id="scSt1">① 🏫 打班級</span><b>➜</b><span id="scSt2">② 🪑 打座號</span><b>➜</b><span id="scSt3">③ ✅ 按綠色勾勾</span></div>')+
   '<div class="scl"><div class="scbox" id="scBox"><div class="scg c" id="scGc"><span class="lb">🏫 班級</span><div class="cells">'+box(3,'c')+'</div></div>'+
   '<div class="scg s" id="scGs"><span class="lb">🪑 座號</span><div class="cells">'+box(2,'s')+'</div></div></div>'+
   '<div class="scmsg" id="scMsg"></div></div>'+
   '<div class="sckey">'+[1,2,3,4,5,6,7,8,9].map(function(n){return '<button data-k="'+n+'">'+n+'</button>'}).join('')+
   '<button class="bs" data-k="b" aria-label="刪掉">⌫</button><button data-k="0">0</button><button class="okb" data-k="ok" aria-label="確定">✅</button></div>'+
   (SCSRC==='home'?'<button id="scGuest">👀 先練習，不記成績</button>':'')+(LV0?'':SCH.back)+'</div>';
  scPaint();
}
var SCLOGAFTER=null;
function scPaint(err){
  var v=SCTYPED;if(!$('#scBox'))return;
  $$('#scBox i').forEach(function(c,n){var d=v.charAt(n);if(c.textContent!==d&&d){c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}
    c.textContent=d;c.classList.toggle('f',!!d);c.classList.toggle('cur',n===v.length)});
  var st=v.length<3?1:v.length<5?2:3;
  [1,2,3].forEach(function(k){var s=$('#scSt'+k);if(s){s.classList.toggle('now',k===st);s.classList.toggle('done',k<st)}});
  $('#scGc').classList.toggle('now',st===1);$('#scGs').classList.toggle('now',st===2);
  $('.sckey .okb').classList.toggle('ready',v.length===5);
  var m=$('#scMsg');
  if(err){m.className='scmsg err';m.innerHTML=err;return}
  m.className='scmsg';
  m.innerHTML=v.length===0?'👆 先打你的<b class="kc">班級</b>（3 個數字）'+(window.SCLIVE?'':'<small>例：304 班 5 號 ➜ 打 3 0 4 0 5</small>'):
   v.length<3?'🏫 班級還要打 '+(3-v.length)+' 個數字':
   v.length===3?'👍 '+scCn(v)+'！再打<b class="ks">座號</b><small>5 號 ➜ 打 0 5<br>班級打錯 ➜ 按 ⌫ 重打</small>':
   v.length===4?'🪑 座號還要打 1 個數字':
   '對嗎？<b class="kc">'+scCn(v.slice(0,3))+'</b> <b class="ks">'+(+v.slice(3))+' 號</b> ➜ 按綠色的 ✅';
}
function scShake(){var b=$('#scBox');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake')}
/* 班級（前 3 個數字）對不對：沒有這一班、或不是這個年級的網站 */
function scClsErr(c){var g=c.charAt(0)==='3'?3:(c.charAt(0)==='4'?4:0),G={3:'三',4:'四'};
  if(!g||SCCLS[g].indexOf(c)<0)return '🏫 沒有 '+c+' 班！已經幫你清掉了，請重新打班級<small>'+scClsList()+'</small>';
  if(SCG&&g!==SCG)return '🏫 '+scCn(c)+'是'+G[g]+'年級，這是'+G[SCG]+'年級的網站！已經幫你清掉了<small>'+scClsList()+'</small>';
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
/* 登入好了（2026-10-09 Q4：學生端不顯示姓名，不再問伺服器「你是 ○○○ 嗎？」） */
function scWho(r){
  var go=function(){SCID=r.id;scPut('id_g'+r.g,SCID);scPut('last',SCID);SCGUEST=false;scOk();scAct();scBar();var a=SCLOGAFTER;SCLOGAFTER=null;
    scTkLoad(function(){if(SCH&&SCH.tk)SCH.tk();if(a)a();scChamp(1)})};   /* 登入好了先拿老師的任務（2026-10-09 E），再做要做的事 */
  var m=$('#scMsg');m.className='scmsg ok';m.textContent='✅ '+scCn(r.cls)+' '+r.seat+' 號';
  setTimeout(function(){scPwStep(r.id,go)},500);   /* 2026-10-28 第三十三次 第 4 點：5 碼 對了 ➜ 🔑 8 碼 密碼 */
}
/* ══ 🔑 8 碼 密碼（2026-10-28 第三十三次 第 4 點，老師 選 A：5 碼 ➜ 密碼；第一次 自己 設；全部 登入 都 要；忘記 ＝ 老師看板〔🔑 清除 密碼〕）══
   密碼 ＝ 2 個 小寫 英文 字母（粉紅 格）＋ 6 個 數字（藍 格），例 ab123456；平板 只 存 伺服器 給 的 通行證（這個 分頁 sessionStorage；勾〔記住〕＝ localStorage） */
var SCPW=null;
function scPk(id){var v='';try{v=sessionStorage.getItem('score_pks_'+id)||''}catch(e){}return v||scGet('pk_'+id)||''}
function scPkSave(id,k,rem){try{sessionStorage.setItem('score_pks_'+id,k)}catch(e){}scPut('pk_'+id,rem?k:null)}
function scPwStep(id,done){if(/script\\.test/.test(SCURL)&&!window.__SCORE_PW){done();return}   /* 量測 的 假 伺服器：別的 量測 不打 密碼（密碼 本身 在 score/_verify_pw.js 量，它 設 __SCORE_PW） */
  SCPW={id:id,done:done,v:'',first:'',mode:'?',eye:false,rem:!!scGet('pk_'+id)};if(!SCH.on||!SCH.on())SCH.open();
  var ex='<span class="pwex">'+'ab123456'.split('').map(function(c,i){return '<i class="'+(i<2?'l':'d')+'" style="animation-delay:'+(i*.35).toFixed(2)+'s">'+c+'</i>'}).join('')+'</span>';
  SCH.box().innerHTML='<div class="sclog scpw"><h2>🔑 密碼</h2>'+
   '<div class="pwani"><span>① 🏫 <b>'+id+'</b> ✅</span><span class="ar">➜</span><span>② 🔑</span>'+ex+'</div>'+
   '<div class="pwlab"><span class="l">🩷 2 個 小寫 英文 字母</span><span>＋</span><span class="d">🩵 6 個 數字</span></div>'+
   '<div class="pwt" id="scPwT">⏳ 連線 中…</div><div class="pwc" id="scPwC"></div><div class="pwm" id="scPwM"></div><div id="scPwK"></div>'+
   '<div class="pwrow"><label class="pwrem"><input type="checkbox" id="scRem"'+(SCPW.rem?' checked':'')+'>📱 我 自己 的 平板：記住 密碼（我 會 負責）</label><button class="pweye" id="scEye">👁 看 密碼</button></div>'+SCH.back+'</div>';
  scPwPaint();
  scFetch('',{a:'sp',id:id},12000).then(function(j){if(!SCPW||SCPW.id!==id)return;if(j&&j.err==='a'){var d0=SCPW.done;SCPW=null;d0();return}   /* 老師 還沒 重新 部署（舊 伺服器 不認得 sp）＝ 照 以前 不用 密碼 */
    if(!j||!j.ok){scPwOff(j);return}SCPW.mode=j.has?'in':'set';scPwPaint()},function(){if(!SCPW||SCPW.id!==id)return;scPwOff(null)})}
function scPwOff(j){var P=SCPW;if(scPk(P.id)){var d=P.done;SCPW=null;d();return}   /* 連不上 但是 這台 平板 記得 ＝ 照樣 登入 */
  P.mode='off';scPwPaint(j&&j.err==='seat'?'🪑 沒有 這個 座號':'📶 連不上 網路，等一下 再 按 ✅ 試 一次')}
function scPwPaint(msg,cls){var P=SCPW;if(!P||!$('#scPwC'))return;var v=P.v,T={'?':'⏳ 連線 中…',set:'🆕 第一次：自己 設 一個 密碼',set2:'🔁 再 打 一次 一樣 的 密碼',in:'🔑 打 你 的 密碼',off:'📶 連不上 網路',busy:'⏳ 檢查 中…'};
  $('#scPwT').textContent=T[P.mode]||'';
  var h='';for(var i=0;i<8;i++){var c=v.charAt(i);h+='<i class="'+(i<2?'l':'d')+(i===v.length?' cur':'')+(i===2?' sp':'')+'">'+(c?(P.eye||i===v.length-1?c:'●'):'')+'</i>'}$('#scPwC').innerHTML=h;
  var lt=v.length<2,keys=lt?'abcdefghijklmnopqrstuvwxyz'.split(''):'1234567890'.split('');
  var k='<div class="sckey pwk'+(lt?'':' dg')+'">'+keys.map(function(c){return '<button data-p="'+c+'">'+c+'</button>'}).join('')+''+
    '<button class="bs" data-p="del" aria-label="刪掉">⌫</button><button class="okb'+(v.length===8||P.mode==='off'?' ready':'')+'" data-p="ok" aria-label="確定">✅</button></div>';
  $('#scPwK').innerHTML=k;
  var m=$('#scPwM');m.className='pwm'+(cls?' '+cls:msg?' err':'');
  m.innerHTML=msg||(P.mode==='set'||P.mode==='in'||P.mode==='set2'?(lt?'👆 先 打 <b>'+(2-v.length)+'</b> 個 小寫 英文 字母':v.length<8?'👆 再 打 <b>'+(8-v.length)+'</b> 個 數字':'👍 打好 了 ➜ 按 綠色 ✅'):'')}
function scPwKey(k){var P=SCPW;if(!P)return;if(P.mode==='?'||P.mode==='busy')return;
  if(P.mode==='off'){if(k==='ok')scPwStep(P.id,P.done);return}
  if(k==='del'){P.v=P.v.slice(0,-1);scPwPaint();return}   /* ⌫ ＝ del（b 是 字母） */
  if(k==='ok'){if(P.v.length<8){scShakePw();scPwPaint(P.v.length<2?'🩷 先 打 2 個 小寫 英文 字母':'🩵 數字 還 差 '+(8-P.v.length)+' 個');return}
    if(P.mode==='set'){P.first=P.v;P.v='';P.mode='set2';scPwPaint('👍 記住 這個 密碼！再 打 一次','ok');return}
    if(P.mode==='set2'&&P.v!==P.first){P.v='';P.first='';P.mode='set';scShakePw();scPwPaint('❌ 兩次 不一樣，重新 設 一次');return}
    var set=P.mode==='set2',pv=P.v;P.mode='busy';scPwPaint();
    scFetch('',{a:'sp',id:P.id,p:pv,set:set?1:0},12000).then(function(j){if(SCPW!==P)return;
      if(j&&j.ok&&j.tk){scPkSave(P.id,j.tk,$('#scRem')&&$('#scRem').checked);P.mode='done';scPwPaint(set?'🎉 密碼 設好 了！':'✅ 密碼 對了','ok');var d=P.done;setTimeout(function(){if(SCPW===P){if(set){scPwVow(P,d);return}SCPW=null;d()}},700);return}
      if(j&&j.ok&&!j.tk){P.v='';P.mode=j.has?'in':'set';scPwPaint();return}
      P.v='';P.mode=set?'set':'in';scShakePw();
      scPwPaint(j&&j.err==='lock'?'🔒 打錯 太多 次，10 分鐘 後 再 試（或 請 老師 幫忙）':j&&j.err==='wrong'?'❌ 密碼 不對，再 試 一次<br><small>忘記 了 ➜ 請 老師 按〔🔑 清除 密碼〕，再 自己 重設</small>':'📶 連不上 網路，等一下 再 試')},
     function(){if(SCPW!==P)return;P.v='';P.mode=set?'set':'in';scPwPaint('📶 連不上 網路，等一下 再 試')});return}
  if(P.v.length>=8||k.length!==1)return;if(P.v.length<2&&!/[a-z]/.test(k))return;if(P.v.length>=2&&!/[0-9]/.test(k))return;P.v+=k;scPwPaint()}
/* 2026-10-31 第三十五次 第 12 點：設好 密碼 以後 一定 勾「我為自己的密碼：記憶和負責。」才 進得去 */
function scPwVow(P,d){var b=SCH.box();if(!b){SCPW=null;d();return}
  b.innerHTML='<div class="sclog scpw scvow"><h2>🔑 密碼設好了！</h2><div class="vwi">🧠 ＋ 🤝</div>'+
   '<label class="vwl" id="scVowL"><input type="checkbox" id="scVow"><span>我為自己的密碼：記憶和負責。</span></label>'+
   '<div class="vwh" id="scVowH">👆 先勾上面的方框</div><button class="vwb" id="scVowB" disabled>✅ 進入在家複習</button></div>';
  var c=$('#scVow'),k=$('#scVowB'),h=$('#scVowH');
  c.onchange=function(){k.disabled=!c.checked;$('#scVowL').classList.toggle('on',c.checked);h.textContent=c.checked?'👍 謝謝你！按綠色按鈕進去':'👆 先勾上面的方框'};
  k.onclick=function(){if(!c.checked)return;if(SCPW===P)SCPW=null;d()}}
function scShakePw(){var b=$('#scPwC');if(!b)return;b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake')}
/* 「請問 這是您嗎？」按 ✅：這個 分頁 已經 打過 密碼、或 這台 平板 記住 了 ＝ 直接 過；不然 ＝ 打 密碼 */
function scSure(fn){if(!SCID||scPk(SCID)||!SCH||!SCH.box){fn();return}scPwStep(SCID,function(){if(SCH.close)SCH.close();fn()})}
function scMeHTML(){
  if(!SCON)return '';
  if(SCGUEST)return '<div class="scme">👀 練習模式（不記成績）<button id="scSwap">🔑 登入</button></div>';
  if(!SCID)return '<div class="scme">👤 還沒登入<button id="scSwap">🔑 登入</button></div>';
  return '<div class="scme">'+SCID+'<button id="scSwap">👋 登出</button></div>';
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
  var fast=pick>=0?(now-(SCREF||SCT0)<1000?1:0):0;   /* 認讀題聽完才開始算；聲音沒播出來（沒有 scHeard）就從題目出來開始算，不要整份都變成太快亂按（練習次數 2026-10-12 F4 會看它） */
  SCQ.push([ok?1:0,pick,Math.round(sec*10)/10,fast,ok?Math.round(Math.max(0,Math.min(1,ratio))*1000)/1000:0,SCQI]);
}
/* ── 作答結束（2026-10-12 D 第 4 件；第 4 件修正 ＝ 使用者 D6～D8 定案）──
   題目（m:'q'）：① 正確率 ➜ ② 練習時間（每一個人都看得到，不是獎）➜ ③ 🏆 榮譽動畫（只有這一次讓他第一次進榜或名次上升才演）➜ 答錯整理
   遊戲（m:'g'）：① 正確率（第一次作答）＋✨ 訂正成功 ➜ ② 練習時間 ➜ ③ 🏆（同上）➜ 這個遊戲本班前 10 名
   🃏 記憶配對（m:'mem'）：配完幾對、用幾秒、翻錯幾次 ➜ ② 練習時間 ➜ ③ 🏆（同上）
   2026-10-15 D 第 8 件（老師 D12 ③）：時鐘 ➜ ❤ 這週 用心程度（每一次做完都演、8 種風格輪流、〔📖 說明〕、可以跳過、不放聲音）➜ 🏆 */
var SCLIST={q:['acc','time','care','hero','honor','end'],g:['acc','time','care','hero','honor','gtop'],mem:['mem','time','care','hero','honor']};   /* hero：2026-10-17 第八次 🦸 這一次拿到的經驗值、金幣 */
function scCareOf(E){return E.res&&E.res.me&&E.res.me.care}
/* 不演的那一幕從清單拿掉（名次沒上升 ＝ 🏆、沒有網路 ＝ ❤） */
function scDrop(E,nm){var L=E.list,i=L.indexOf(nm);if(i>E.k)L.splice(i,1)}
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
  var today=Math.floor((Date.now()+288e5)/864e5),cnt=m==='mem'?true:(m==='g'&&n<6?false:fast*2<=n);   /* 練習次數 ＋1：做完就算，太快亂按超過一半不算（F4，跟 _calc.js counts 一樣） */
  var todayN=sv?sv.today:H.filter(function(x){return x.d===today&&x.c}).length;
  H.push({t:R.t,acc:acc,c:cnt,d:today});scPut(hk,H.slice(-50));
  var QQ=scGet('q')||[];QQ.push(R);scPut('q',QQ.slice(-200));SCIN=u;
  var me1=m==='mem'?R.sec:(fast*2>n?0:Q.reduce(function(t,q){return t+(q[3]?0:+q[2]||0)},0));   /* 這一次練了幾秒（太快亂按不算，跟 _calc.js secOf 一樣） */
  SCEND={m:m,list:SCLIST[m].slice(),fast:fast,me1:me1,
    acc:acc,ok:ok,n:n,s:m==='mem'?null:scS100(Q),raw:R.raw,fix:R.fix,mp:R.mp,mw:R.mw,sec:R.sec,prev:prev,best:best,cnt:cnt,cap:cnt&&todayN>=3,
    week:(SCV&&SCV.me?SCV.me.count:null),res:null,fail:false,k:0,tab:'acc',scope:'cls'};
  /* 送出：前一次補送還在跑就等一下再試（最多 3 次），還是送不出去 ＝ 沒有網路，先存平板 */
  var send=function(n){scFlush().then(function(){if(!SCEND||SCIN!==u)return;
    var j=SCRES[u],left=(scGet('q')||[]).some(function(x){return x.u===u});
    if(!j&&left&&n<3){setTimeout(function(){send(n+1)},1500);return}
    if(j)SCEND.res=j;else SCEND.fail=true;
    var nm=SCEND.list[SCEND.k];if(nm==='gtop'||(nm==='time'&&!SCEND.tgo))scScene()})};
  send(0);
  scScene();
  return true;
}
var SCAUTO=null;
function scGo(k){SCEND.k=k;scScene()}
function scNext(){var L=SCEND.list;scGo(Math.min(SCEND.k+1,L.length-1))}
function scRing(E,t){var R=46,L=2*Math.PI*R;
  return '<div class="sct">'+t+'</div><div class="scring"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="'+R+'"></circle>'+
    '<circle class="fg" id="scFg" cx="50" cy="50" r="'+R+'" stroke-dasharray="'+L+'" stroke-dashoffset="'+L+'"></circle></svg>'+
    '<b><span id="scAcc">0</span><small>'+E.ok+' ／ '+E.n+' 題</small></b></div>'}
/* ── ② 練習時間＋③ 🏆 榮譽動畫（2026-10-12 D 第 4 件修正，使用者 D6～D8 定案，listen/2026-10-12_D8 ①②）──
   ② 每一個人：自己畫的時鐘「這週你已經練習 12 分鐘」「這一次 練習 3 分鐘。」；沒上榜 ＝ 加正確率＋「比上週多 練習 4 分鐘。」（有多才寫）；
      太快亂按超過一半 ＝「⚠️ 太快亂按，不算時間」「請 看完、聽完再選」
   ③ 只有三種最高榮譽（最認真練習、成績最優、進步最多 × 班內前 10 名、全年級前 10 名；班級三種、前 3 名）；
      這一次讓他第一次進榜或名次上升才演（伺服器給 rk0 ＝ 這一次以前的名次）；名次沒變 ＝ 什麼都不演、不寫。12 種風格輪流、平板不放聲音 */
function scMin(sec){return HON.mn(sec)}
function scFast(E){return E.m!=='mem'&&E.n>0&&E.fast*2>E.n}
/* 這一次讓名次上升的獎（最多 3 個：班內 ➜ 全年級 ➜ 班級） */
function scUps(E){var V=E.res,U=[];if(!V||!V.boards||!V.rk||!V.rk0||scFast(E))return U;
  var my=String(SCID).slice(0,3),G={3:'三',4:'四'}[scGr()]||'';
  ['cls','grade'].forEach(function(sc){HON.AWK.forEach(function(k){var a=V.rk[k]&&V.rk[k][sc],b=V.rk0[k]&&V.rk0[k][sc];
    if(a&&(!b||a<b))U.push({k:k,rk:a,w:(sc==='cls'?scCn(my):G+'年級')+' 第 '+a+' 名',l:HON.awl(k,V.me,'這週')})})});
  if(V.crk&&V.crk0&&!SCAFTER[my])HON.AWK.forEach(function(k){var a=V.crk[k],b=V.crk0[k];
    if(a&&a.rk<=3&&(!b||a.rk<b))U.push({k:k,rk:a.rk,c:1,w:G+'年級 第 '+a.rk+' 名',l:HON.awc(k,a.v)})});
  return U.slice(0,3)}
/* 🏆 最認真練習 的 兩個 條件（2026-10-21 第十六次 第 6 點：貼心 提醒；這一週 到 現在 全部 題目 合起來）：A 👀 不是 太快 亂按、B ✗➜✓ 答錯 改對 都 ≧ 90% 才 上榜 */
function scAbHTML(me){var d=me&&me.dl;if(!d||d.a==null)return '';var L=function(ic,t,v,ok){return '<span class="'+(ok?'ok':'no')+'">'+ic+' '+t+' <b>'+v+'%</b> '+(ok?'✅':'❌')+'<i style="--w:'+Math.min(100,v)+'%"></i></span>'};
  return '<div class="scab"><div class="sab0">🏆 最認真練習 榜：兩個 都 要 ≧ 90%</div>'+L('👀','不是 太快 亂按',d.a,d.okA)+L('✗➜✓','答錯，改對',d.b,d.okB)+'</div>'}
function scTimeHTML(E){var V=E.res,me=V&&V.me,up=scUps(E).length;
  if(scFast(E))return '<div class="sctime"><div class="stic">⚠️</div><div class="st1">太快亂按，不算時間</div><div class="st2">請 看完、聽完再選</div></div>';
  var more=me&&!up?Math.round((me.sec-(me.secPrev||0))/60):0;
  return '<div class="sctime"><div class="stic">'+HON.CLK+'</div>'+
    (!up&&E.acc!=null?'<div class="st2">🎯 正確率 '+E.acc+' 分</div>':'')+
    (me?'<div class="st1">這週你已經練習 '+scMin(me.sec)+'</div>':'')+
    '<div class="st3">這一次 練習 '+scMin(E.me1)+'。</div>'+
    (more>0?'<div class="st3">比上週多 練習 '+more+' 分鐘。</div>':'')+
    scAbHTML(me)+
    (!V?'<div class="st4">'+(E.fail?'📶 現在沒有網路：成績先存在這台平板，連上網會自動送出 ✅':'<i class="scspin">⏳</i> 成績還在送出…')+'</div>':'')+'</div>'}
function scHonGo(E){
  var el=$('#scHon');if(!el)return;if(E.hst==null)E.hst=HON.pick('s');
  var U=E.ups,i=0;
  (function go(){if(SCEND!==E||!$('#scHon'))return;var u=U[i];
    if(!u){if(E.k<E.list.length-1)scNext();return}
    HON.scene($('#scHon'),E.hst,{kick:'🏆 本週 榮譽榜',cards:[{ic:HON.awi(u.k),nm:HON.AWN[u.k]+(u.c?'的班':''),w:u.w,l:u.l,me:1}]});
    SCAUTO=setTimeout(function(){i++;go()},4600)})();
}
function scScene(){
  clearTimeout(SCAUTO);if(!SCEND||!scOn())return;var E=SCEND,L=E.list,k=E.k,nm=L[k],h='',last=k===L.length-1;
  var dots=L.length>1?'<div class="scdots">'+L.map(function(x,n){return '<i'+(n===k?' class="on"':'')+'></i>'}).join('')+'</div>':'';
  var nav=function(more){return '<div class="scnav">'+(more||'')+(!last?'<button class="go" id="scNx">➡ 下一步</button><button id="scSkip">⏭ 跳過</button>':'')+'</div>'};
  if(nm==='acc'){
    h=scRing(E,E.m==='g'?'🎯 正確率（每一題第一次作答）':'🎯 正確率')+
      '<div class="scs">⚡ 總分 '+E.s+' 分（答對 60 ＋ 速度 40）</div>'+
      (E.m==='g'?(E.fix?'<div class="scfix">✨ 訂正成功 '+E.fix+' 題</div>':'')+'<div class="scnote">🎁 驚喜卡、連對加成是運氣，不算進成績</div>':'')+nav();
    SCAUTO=setTimeout(scNext,E.m==='g'?3600:3000);
  }else if(nm==='time'){
    /* 成績還在送：最多等 3 秒，送不到就先寫這一次的時間（這週的時間、榮譽要等伺服器） */
    if(E.hw0==null)E.hw0=Date.now();var hw=!E.res&&!E.fail&&!E.hto;
    if(hw){SCAUTO=setTimeout(function(){if(SCEND===E){E.hto=1;scScene()}},Math.max(0,3000-(Date.now()-E.hw0)));
      h='<div class="sct">'+HON.CLK+'</div><div class="scwait"><i>⏳</i> 正在送出成績…</div>'+nav()}
    else{if(E.res||E.fail)E.tgo=1;E.ups=scUps(E);
      if(E.tgo&&!scCareOf(E))scDrop(E,'care');
      if(E.tgo&&!(E.res&&E.res.rpg))scDrop(E,'hero');
      if(!E.ups.length&&E.tgo){var hi=L.indexOf('honor');if(hi>k)L.splice(hi,1);last=k===L.length-1;dots=L.length>1?'<div class="scdots">'+L.map(function(x,n){return '<i'+(n===k?' class="on"':'')+'></i>'}).join('')+'</div>':''}
      h=scTimeHTML(E)+(last?SCH.btns(E):nav());if(!last&&E.tgo)SCAUTO=setTimeout(scNext,4200)}   /* 還在送就等（送到或確定沒網路會再畫一次） */
  }else if(nm==='care'){
    if(!scCareOf(E)){L.splice(k,1);E.k=Math.min(k,L.length-1);scScene();return}   /* 沒有網路、伺服器還沒回 ＝ 不演 */
    /* 2026-10-16 C4 第 3-2 題 A：學生平板也看成績卡（🎯 正確、📅 練習；沒有姓名、沒有〔📋 細節〕），下面接 📅 練習 動畫 */
    var ME=E.res.me;h='<div class="sccare2">'+HON.card({acc:ME.acc,prog:ME.prog,keep:ME.keep},ME.care,{notip:1})+'<div id="scCare"></div></div>'+(last?SCH.btns(E):nav());   /* 橫的螢幕：成績卡在左、練習報告在右（2026-10-17 第八次：量過 1024✕768 上下排要捲動） */
    if(!last)SCAUTO=setTimeout(scNext,9000);
  }else if(nm==='hero'){
    if(!(E.res&&E.res.rpg)){L.splice(k,1);E.k=Math.min(k,L.length-1);scScene();return}
    h=scHeroHTML(E.res.rpg)+(last?SCH.btns(E):nav());if(!E.hgo){E.hgo=1;setTimeout(function(){if(SCEND===E&&document.querySelector('.schero'))scHeroGo(E.res.rpg)},120)}if(!last)SCAUTO=setTimeout(scNext,5200+scHeroMs(E.res.rpg));
  }else if(nm==='honor'){
    h='<div class="hon" id="scHon"></div>'+(last?SCH.btns(E):nav());
  }else if(nm==='gtop'){
    h=scGtopHTML()+SCH.btns(E);
  }else if(nm==='mem'){
    var per=E.mp?Math.round(E.sec/E.mp*10)/10:null;
    h='<div class="sct">🃏 記憶配對</div><div class="scstat">'+
      '<div><b>'+E.mp+'</b><span>✅ 配完幾對</span></div><div><b>'+E.sec+'</b><span>⏱ 用了幾秒</span></div><div><b>'+E.mw+'</b><span>🔁 翻錯幾次</span></div></div>'+
      (per!=null?'<div class="scs">平均 '+per+' 秒配一對</div>':'')+
      '<div class="scnote">記憶配對是記位置，不算正確率、不算總分（老師看得到這三個數字）</div>'+nav();
    SCAUTO=setTimeout(scNext,4000);
  }else{
    h='<div class="sct">'+(E.ok===E.n?'🎉 全對！':'答錯是大腦在學習 🧠')+'</div>'+
     '<div class="scraw">'+E.raw+'</div><div class="scs">🏆 這一次的分數　✅ 答對 '+E.ok+' ／ '+E.n+' 題</div>'+SCH.btns(E);
    if(MISSLOG.length)setTimeout(function(){if(SCEND&&SCEND.list[SCEND.k]==='end'&&scOn())missAll(SCH.miss())},600);
  }
  if(last&&scLive())h+=scByeHTML();   /* 每一個題目、遊戲做完：提醒登出（D 第 6 件 ③） */
  SCH.box().innerHTML='<div class="scn" id="scn">'+dots+h+'</div>';
  if(nm==='honor'&&$('#scHon'))scHonGo(E);
  if(nm==='care'&&$('#scCare'))RPT.show($('#scCare'),scCareOf(E),{key:'s',strip:1,onAct:function(){clearTimeout(SCAUTO)},fit:function(){var b=SCH.box(),o=b&&b.closest?b.closest('#scov,#rv'):null;return o?o.scrollHeight-o.clientHeight:0}});   /* 2026-10-17 第八次：📅 練習報告（打勾清單）＋愛心切換 */
  if(nm==='time'&&$('.sctime .hclkm'))$('.sctime').classList.add('go');
  if(nm==='hero')setTimeout(function(){var b=$('#scn .shbar i');if(b)b.style.width=b.getAttribute('data-w')+'%'},400);
  if(nm==='acc')setTimeout(function(){var f=$('#scFg'),a=$('#scAcc');if(!f)return;var L=+f.getAttribute('stroke-dasharray');
    f.setAttribute('stroke-dashoffset',L*(1-E.acc/100));var t0=Date.now(),iv=setInterval(function(){var x=Math.min(1,(Date.now()-t0)/1300);
      if(!$('#scAcc')){clearInterval(iv);return}a.textContent=Math.round(E.acc*x)+'%';if(x>=1)clearInterval(iv)},40)},80);
  setTimeout(function(){$$('.scbar .tr i').forEach(function(x){x.style.width=x.getAttribute('data-w')+'%'})},80);
}
/* ⚔ 戰力階級 徽章（2026-10-20 第十五次）：伺服器 給 的 tiers（排行榜上 出現 的 人） */
function scTb(id){var T=SCEND&&SCEND.res&&SCEND.res.tiers;return T&&T[id]&&typeof RPFX!=='undefined'?' '+RPFX.tb(T[id]):''}
function scPodHTML(L,fmt){
  var pod=[1,0,2].map(function(n){var x=L[n];if(!x)return '<div></div>';
    return '<div class="p'+Math.min(x.rk,3)+(x.id===SCID?' me':'')+'"><span class="id">'+x.id+scTb(x.id)+'</span><span class="v">'+fmt(x)+'</span><span class="st">'+(x.rk===1?'🥇':x.rk===2?'🥈':'🥉')+'</span></div>'}).join('');
  var rest=L.slice(3).map(function(x){return '<div'+(x.id===SCID?' class="me"':'')+'><span><em>'+x.rk+'</em> '+x.id+scTb(x.id)+'</span><span>'+fmt(x)+'</span></div>'}).join('');
  return '<div class="scpod">'+pod+'</div>'+(rest?'<div class="sclist">'+rest+'</div>':'');
}
/* 遊戲：這個遊戲本班前 10 名（這週，每個人最好的一次；正確率同分比總分） */
function scGtopHTML(){
  var E=SCEND,V=E.res,T='<div class="sct">🏆 這個遊戲　本班前 10 名（這週）</div>';
  if(!V&&!E.fail)return T+'<div class="scwait"><i>⏳</i> 正在送出成績…</div>';
  if(!V)return '<div class="sct">📶 現在沒有網路</div><div class="scs">成績先存在這台平板，連上網會自動送出 ✅</div>';
  if(!V.boards||!V.gtop)return '<div class="sct">💪 成績送出去了 ✅</div><div class="scs">下次再挑戰更高的正確率！</div>';
  var G=V.gtop,L=G.list,mine;
  if(G.rk)mine='<div class="scmine in">你是第 '+G.rk+' 名！🎉</div>';
  else if(G.cut!=null&&G.best&&G.cut-G.best.acc>=0&&G.cut-G.best.acc<=20)mine='<div class="scmine">⬆ 你再 '+Math.max(1,G.cut-G.best.acc)+' 分進前 10</div>';
  else mine='<div class="scmine">⭐ 你的紀錄 '+(G.best?G.best.acc:E.acc)+'%，下次打敗它！</div>';
  if(!L.length)return T+'<div class="scempty">這週還沒有人上榜，你可以當第一個！</div>'+mine;
  return T+scPodHTML(L,function(x){return x.acc+'%'})+mine;
}
/* ══ 老師派任務（2026-10-09 E；規則在 score/_calc.js 的 tkLock，這裡用同一份）══
   登入以後問伺服器「我這一班有什麼任務、我做完了哪些」（a=tasks）；時間用伺服器的（平板時鐘不準也鎖得對）。
   沒網路 ＝ 用這台平板上一次拿到的；從來沒拿到過 ＝ 全部開放（F）。👀 練習模式（不記成績）不鎖。 */
var scTkLock=__TKLOCK__;
var SCTK=null,SCTKID=null;
function scTkGet(){if(!scLive())return null;if(SCTKID!==SCID){SCTKID=SCID;SCTK=scGet('tk_'+SCID)}return SCTK}
function scTkNow(){var t=scTkGet();return Date.now()+((t&&t.off)||0)}
function scTkLoad(cb){if(!scLive()){if(cb)cb();return}var id=SCID;
  scFetch('a=tasks&id='+id,null,7000).then(function(j){if(j&&j.ok&&id===SCID){SCTK={at:Date.now(),off:(+j.now||Date.now())-Date.now(),tasks:j.tasks||[],locks:j.locks||[]};SCTKID=id;scPut('tk_'+id,SCTK)}if(cb)cb()},function(){if(cb)cb()})}
function scLockOf(key){var t=scTkGet();if(!t||!t.tasks||!key)return {k:'free'};return scTkLock(t.tasks,key,scTkNow())}
function scTkOk(key){var k=scLockOf(key).k;return k==='free'||k==='open'}
var SCWD='日一二三四五六';
function scTkT(ms){var d=new Date(ms),p=function(n){return (n<10?'0':'')+n};return (d.getMonth()+1)+'/'+d.getDate()+'（'+SCWD.charAt(d.getDay())+'）'+p(d.getHours())+':'+p(d.getMinutes())}
function scLockTxt(L){return L.k==='open'?'⏰ 到 '+scTkT(L.to):L.k==='soon'?'🔒 '+scTkT(L.from)+' 開放':L.k==='end'?'🔒 已經截止':L.k==='off'?'🔒 老師現在指定別的':''}
function scTkAct(){var t=scTkGet(),n=scTkNow();return t&&t.tasks?t.tasks.filter(function(x){return x.from<=n&&n<=x.to}):[]}
/* 一個任務一行：📌 名稱：項目 ✅／⏳ … ⏰ 到 幾點 */
function scTkLine(x){var dn=x.done||[];return '<div class="sctkl"><b>📌 '+x.name+'</b>'+x.items.map(function(k){return '<span class="'+(dn.indexOf(k)>=0?'ok':'')+'">'+(dn.indexOf(k)>=0?'✅ ':'⏳ ')+(x.nm&&x.nm[k]||k)+'</span>'}).join('')+'<em>⏰ 到 '+scTkT(x.to)+'</em></div>'}
function scTaskBar(){var a=scTkAct();return a.length?'<div class="sctask">'+a.map(scTkLine).join('')+'</div>':''}
/* 鎖住的時候：一整頁大字（為什麼鎖、老師現在指定什麼、到什麼時候） */
function scLockShow(L){var o=document.getElementById('sctk');if(!o){o=document.createElement('div');o.id='sctk';document.body.appendChild(o)}
  var why=L.k==='soon'?'老師設定 <b>'+scTkT(L.from)+'</b> 才開放':L.k==='end'?'已經截止了（'+scTkT(L.to)+'）':'老師現在指定的不是這一個';
  var a=scTkAct();
  o.innerHTML='<div class="sctkb"><div class="sctki">🔒</div><div class="sctkw">'+why+'</div>'+(a.length?'<div class="sctks">老師現在指定的是：</div>'+a.map(scTkLine).join(''):'')+
   '<button id="sctkOk">👌 知道了</button></div>';o.classList.add('on')}
/* ══〔🔒 開關〕（2026-10-12 D 第 7 件，使用者 D16 A、D6 第 13 題、D8 ⑦）：老師鎖住的在家複習主題（只管在家複習網站 SCSRC home）══
   代號 ＝ g年級rv_主題（u1-t0-0 句型卡分頁、gm-g3 遊戲、mo-parts 補充頁）；鎖住的連任務也打不開
   沒登入（或 👀 先練習）＋任何一班鎖住 ＝「🔒 請先登入〔🔑 登入〕」；登入了＋自己的班鎖住 ＝「🔒 還沒開放」。**不寫鎖了哪幾班**（學生才不會假裝別班）
   沒網路 ＝ 用這台平板上一次拿到的；從來沒拿到 ＝ 全部開放 */
var SCLKANY=null,SCLKPAGE=window.SCLKPAGE||'';
function scLkG(){return SCG||scGr()}
function scLkOf(k){if(!SCON||SCSRC!=='home'||!k)return '';var K='g'+scLkG()+'rv_'+k;
  if(scLive()){var t=scTkGet();return t&&t.locks&&t.locks.indexOf(K)>=0?'no':''}
  var a=SCLKANY||scGet('lk_any_g'+scLkG())||[];return a.indexOf(K)>=0?'login':''}
function scLkLoad(cb){if(!SCON||SCSRC!=='home'){if(cb)cb();return}
  if(scLive()){scTkLoad(cb);return}
  var g=scLkG();if(!g){if(cb)cb();return}
  scFetch('a=locks&g='+g,null,6000).then(function(j){if(j&&j.ok){SCLKANY=j.any||[];scPut('lk_any_g'+g,SCLKANY)}if(cb)cb()},function(){if(cb)cb()})}
/* 句型卡的分頁代號（在家複習的 u1.html／u2.html） */
function scLkTab(t,l){var u=/(u\\d)\\.html/.exec(location.pathname);if(!u||typeof TABM==='undefined'||!TABM[t])return '';return u[1]+'-t'+t+(TABM[t].sub?'-'+(l||0):'')}
/* 一整頁大字：🔒 請先登入〔🔑 登入〕／🔒 還沒開放（〔⬅ 回首頁〕） */
var SCLKRETRY=null;
function scLkShow(st,retry){SCLKRETRY=retry||null;var home=SCHOMEP&&!SCLKPAGE;
  scFull('sclk','<div class="sfic">🔒</div><div class="sf1">'+(st==='login'?'請先登入':'還沒開放')+'</div><div class="sfbt">'+
    (st==='login'?'<button class="scK" id="scLkIn">🔑 登入</button>':'')+(home?'<button class="scN" id="scLkX">👌 知道了</button>':'<button class="scN" id="scLkHome">⬅ 回首頁</button>')+'</div>')}
function scLkGate(k,retry){var st=scLkOf(k);if(!st){scFullOff('sclk');return true}scLkShow(st,retry);return false}
/* 鎖住的主題按了也打得開以前：先換成一個蓋滿整頁的登入畫面，登入好了再試一次 */
function scLkLogin(){var o=SCH,ov=function(){var x=document.getElementById('scov');if(!x){x=document.createElement('div');x.id='scov';x.innerHTML='<div id="scovb"></div>';document.body.appendChild(x)}return x},
  fin=function(go){if(SCH&&SCH.close)SCH.close();SCH=o;if(go)scLkLoad(function(){var r=SCLKRETRY;if(r)r();scLkRe()});else{var r=SCLKRETRY;if(r)r()}};
  scFullOff('sclk');
  SCH={on:function(){return ov().classList.contains('on')},open:function(){ov().classList.add('on')},close:function(){ov().classList.remove('on')},box:function(){return document.getElementById('scovb')},
    back:'<div class="scnav"><button data-sca="close">⬅ 回去</button></div>',key:function(){return ''},name:function(){return ''},reopen:function(){fin(1)},act:function(){fin(0)},btns:function(){return ''},miss:function(){return ''}};
  scLogin(function(){fin(1)})}
/* 首頁的主題、遊戲大廳的遊戲卡：鎖住的貼上 🔒；現在這一頁（句型卡分頁、補充頁）鎖住了 ＝ 蓋上一整頁 */
function scLkRe(){if(!SCON||SCSRC!=='home')return;
  var LKA=[].slice.call(document.querySelectorAll('[data-lk]')),any=LKA.some(function(a){return !!scLkOf(a.getAttribute('data-lk').replace(/^g\\drv_/,''))});   /* 這一班 有 鎖 ＝ 開放 的 也 貼〔✅ 開放〕（老師、學生 一眼 分得出來）*/
  LKA.forEach(function(a){var k=a.getAttribute('data-lk').replace(/^g\\drv_/,''),st=scLkOf(k),x=a.querySelector('.sclkb');if(x)x.parentNode.removeChild(x);
    a.classList.toggle('sclocked',!!st);a.classList.toggle('sclk1',!!st||(any&&scLive()));if(st){x=document.createElement('span');x.className='sclkb';x.textContent=st==='login'?'🔒 請先登入':'🔒 還沒開放';a.appendChild(x)}
    else if(any&&scLive()){x=document.createElement('span');x.className='sclkb ok';x.textContent='✅ 開放';a.appendChild(x)}});
  $$('#grid .gcard[data-g]').forEach(function(c){var st=scLkOf('gm-'+c.getAttribute('data-g')),x=c.querySelector('.sclkb');if(x)x.parentNode.removeChild(x);
    c.classList.toggle('sclocked',!!st);if(st){x=document.createElement('span');x.className='sclkb';x.textContent=st==='login'?'🔒 請先登入':'🔒 還沒開放';c.appendChild(x)}});
  if(SCLKPAGE){scLkGate(SCLKPAGE,null);return}
  if(typeof TCUR!=='undefined'&&scLkTab(TCUR,typeof LCUR!=='undefined'?LCUR:0)){var t=TCUR,l=typeof LCUR!=='undefined'?LCUR:0;scLkGate(scLkTab(t,l),function(){setDeck(t,l)})}}
if(SCON&&SCSRC==='home'){
  document.addEventListener('DOMContentLoaded',function(){scLkRe();scLkLoad(scLkRe)});
  if(document.readyState!=='loading')setTimeout(function(){scLkRe();scLkLoad(scLkRe)},0);
  setInterval(function(){scLkLoad(scLkRe)},120000);
  document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},a;
    if(c('#scLkIn')){scLkLogin();return}
    if(c('#scLkHome')){location.href=window.SCLKHOME||'index.html';return}
    if(c('#scLkX')){scFullOff('sclk');return}
    if((a=c('a[data-lk]'))){var k=a.getAttribute('data-lk').replace(/^g\\drv_/,''),href=a.getAttribute('href');
      if(!scLkGate(k,function(){location.href=href})){e.preventDefault();e.stopPropagation()}}},true);
}
/* 打開網頁就拿一次；之後每 2 分鐘再拿（老師隨時會改時間）、每 30 秒重畫（時間到了就鎖） */
if(SCON){setTimeout(function(){if(scLive())scTkLoad(function(){if(SCH&&SCH.tk)SCH.tk()})},400);
  setInterval(function(){if(scLive())scTkLoad(function(){if(SCH&&SCH.tk)SCH.tk()})},120000);
  setInterval(function(){if(SCH&&SCH.tk&&scLive())SCH.tk()},30000)}
function scTkGo(key,fn){if(scTkOk(key)){fn();return true}scLockShow(scLockOf(key));return false}
/* 遊戲大廳：被指定的放最前面、會發亮；沒被指定的變灰 🔒（D）；上面一條老師的任務（E7） */
function scTkPaint(cards,keyOf,bar){
  [].forEach.call(cards,function(c){var L=scLockOf(keyOf(c.getAttribute('data-g'))),x=c.querySelector('.sctkc');if(x)x.parentNode.removeChild(x);
    c.classList.toggle('tkon',L.k==='open');c.classList.toggle('tklock',L.k!=='open'&&L.k!=='free');
    if(L.k!=='free'){x=document.createElement('span');x.className='sctkc '+L.k;x.textContent=scLockTxt(L);c.appendChild(x)}});
  [].filter.call(cards,function(c){return c.classList.contains('tkon')}).reverse().forEach(function(c){c.parentNode.insertBefore(c,c.parentNode.firstChild)});
  if(bar)bar.innerHTML=scTaskBar()}
document.addEventListener('click',function(e){
  var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#sctkOk')){document.getElementById('sctk').classList.remove('on');return}
  if(c('#scSwap')||c('#scBye')){if(!SCH)return;scOut();scLogin(SCH.reopen);return}   /* 一鍵登出、原地馬上登入（D 第 6 件 ④） */
  if(!scOn())return;
  if((b=c('.sckey button[data-p]'))){scPwKey(b.getAttribute('data-p'));return}
  if(c('#scEye')&&SCPW){SCPW.eye=!SCPW.eye;scPwPaint();return}
  if((b=c('.sckey button'))){scKeyPress(b.getAttribute('data-k'));return}
  if(c('#scGc')){scKeyPress('c');return}if(c('#scGs')&&SCTYPED.length>3){scKeyPress('s');return}
  if(c('#scGuest')){SCGUEST=true;var a=SCLOGAFTER;SCLOGAFTER=null;if(a)a();return}
  if((b=c('[data-sca]'))){if(SCH.act)SCH.act(b.getAttribute('data-sca'));return}
  if(!SCEND||!c('#scn'))return;
  if(c('#scSkip')){scGo(SCEND.list.length-1);return}
  if(c('#scNx')){scNext();return}
  var nm=SCEND.list[SCEND.k];if((nm==='acc'||nm==='mem')&&!c('button'))scNext();
});
/* ══ 學生登入（2026-10-12 D 第 6 件；使用者 D6 第 10～12 題 A、D7、D8 定案：1A 2A 3A）══
   ① 打開網站的第一頁問一次（整頁大字）「請問 這是您嗎？30412〔✅ 是，繼續〕〔👋 不是，登出〕」（這個分頁記住，換頁不再問）
   ② 首頁最上面一條橫幅（不蓋住）：沒登入「👤 還沒登入〔🔑 登入〕」；登入了「請問 這是您嗎？30412〔✅ 是〕〔👋 不是，登出〕」，按 ✅ 以後「👤 30412〔👋 登出〕」
   ③ 10 分鐘沒有動作（2026-10-23 第二十二次老師：3 分鐘 ➜ 10 分鐘；學校、在家都一樣）就登出；最後 30 秒大字提醒「⏳ 30 秒後自動登出〔👆 我還在〕」（不寫「請問 您還在嗎？」）；
      時間到「👋 已經登出了／10 分鐘沒有動作〔🔑 登入〕」。作答中、遊戲中一直在點 ＝ 有動作，不會被登出
   ④ 每一個題目、遊戲做完：「👋 做完了，記得登出／下一個人才不會用到您的號碼〔👋 登出〕」；登出一律 👋（不用 🚪）
   「最後一次動作」存在這台平板（score_act），每一頁都看同一個時間；登出 ＝ 三、四年級的號碼都清掉 */
var SCIDLE=600000,SCGAP=180000,SCWARN=30000,SCHOMEP=false,SCIT=null;
function scOk(){try{sessionStorage.setItem('sc_ok',String(SCID||''))}catch(e){}}
function scAsked(){try{return sessionStorage.getItem('sc_ok')===String(SCID||'')}catch(e){return true}}
function scAct(){scPut('act',Date.now())}
function scOut(){SCID=null;SCGUEST=false;['id_g3','id_g4','last'].forEach(function(k){scPut(k,null)});try{sessionStorage.removeItem('sc_ok')}catch(e){}
  SCTK=null;SCTKID=null;scIdleHide();scBar();if(SCSRC==='home')setTimeout(scLkRe,0);var m=document.getElementById('scme');if(m&&typeof scMeHTML==='function'&&m.innerHTML)m.innerHTML=scMeHTML()}
/* 🦸 這一次拿到的經驗值、金幣（2026-10-17 第八次；規則 score/_calc.js rpEarn）：英雄＋寵物、經驗值條往上長、升級、金幣、〔🦸 我的 英雄〕 */
var SCRPB=(function(){var s=document.querySelector('script[src$="score/url.js"]');return s?s.getAttribute('src').replace(/score\\/url\\.js$/,''):'../'})();
/* 2026-10-18 第十次（老師：🦸 圖示太幼稚 ➜ 換成老師的封面照片；「我的英雄」➜「戰神之路」）：小圖示 ＝ rpg/cover_icon.webp（兩張臉並排，rpg/_cover.py） */
function scCovI(){return '<img class="scCov" src="'+SCRPB+'rpg/cover_icon.webp" alt="" aria-hidden="true">'}
/* 2026-10-25 第二十六次 第 3-2 點（老師選 A）：做完 練習 最後一幕 暫時 不演 打怪（金幣 直接 飛進去）；要 加回來 ＝ SCMON 改 1 */
var SCMON=0;
function scHeroHTML(G){var D=function(id){return rwSrc(SCRPB,id)},S=G.s||{};if(G.h&&S.fx)setTimeout(function(){rwFx(SCRPB,S.fx)},900);   /* 2026-10-18：🏪 商城寶物、💥 必殺武功特效（做完一次 演一次） */
  var a=Math.max(0,G.xp-G.gx),p0=G.lv>G.lv0?0:Math.max(0,(a-G.lvAt)/(G.lvNext-G.lvAt)*100),p1=Math.min(100,(G.xp-G.lvAt)/(G.lvNext-G.lvAt)*100);
  /* 2026-10-20 第十四次 老師：武器、寵物真的能打怪 ➜ 答對幾題 ＝ 打幾下（伺服器算好的 G.f，score/_calc.js rpFight）；賺到金幣 ➜ 金幣飛進去、數字一個一個加 */
  var F=SCMON&&G.h&&G.f&&G.f.hits?G.f:null;
  if(F)return '<div class="sct">'+scCovI()+'這一次 你拿到</div><div class="schero"><div class="shar" id="shFight"><div class="shimg rw-host fxh">'+rwBack(SCRPB,S)+'<img src="'+D(G.h)+'" alt="我的戰士">'+rwFront(SCRPB,S)+'</div>'+
    (G.p?'<img class="fxp" src="'+D(G.p)+'" alt="我的寵物">':'')+'</div>'+
    '<div class="shst"><div class="shfl">⚔ 答對 <b>'+F.hits+'</b> 題 ＝ 打 <b>'+F.hits+'</b> 下<br>一下 💥 <b>'+F.d+'</b>'+(F.pd?'（🐾 ＋'+F.pd+'）':'')+'</div>'+scHeroSt(G,p0,p1)+'</div></div>';
  return '<div class="sct">'+scCovI()+'這一次 你拿到</div><div class="schero"><div class="shimg rw-host">'+(G.h?rwBack(SCRPB,S)+'<img src="'+D(G.h)+'" alt="我的戰神">'+rwFront(SCRPB,S)+(G.p?'<img class="shp" src="'+D(G.p)+'" alt="我的寵物">':''):'<div class="shno">'+scCovI()+'<br>還沒有 戰士</div>')+'</div>'+
    '<div class="shst">'+scHeroSt(G,p0,p1)+'</div></div>'}
function scHeroSt(G,p0,p1){return '<div class="shx">⭐ 經驗值 <b>＋'+G.gx+'</b></div><div class="shbar"><i style="width:'+p0.toFixed(1)+'%" data-w="'+p1.toFixed(1)+'"></i></div>'+
    '<div class="shlv">'+(G.lv>G.lv0?'🎉 升級了！ Lv '+G.lv0+' ➜ <b>Lv '+G.lv+'</b>':'Lv '+G.lv+'（再 '+(G.lvNext-G.xp)+' 升級）')+'</div>'+
    '<div class="shc" id="shCoin">🪙 金幣 <b id="shGc">＋'+(G.gc>0?0:G.gc)+'</b><small>（共 <span id="shTot">'+(G.gc>0?G.coins-G.gc:G.coins)+'</span>）</small></div>'+
    '<a class="shgo" role="button" tabindex="0" data-rpg="1">'+(G.h?scCovI()+'戰神之路 ➜':'🎁 免費 選 1 個 戰士 ➜')+'</a>'}
/* 畫好以後才演：金幣飛進去（從 戰士／怪物 那邊）、打怪；回傳要演幾毫秒 */
function scHeroMs(G){var F=SCMON&&G.h&&G.f&&G.f.hits?G.f:null;return F?600+Math.min(F.hits,6)*1350+(F.kill||[]).length*900+1800:0}
function scHeroGo(G){var F=SCMON&&G.h&&G.f&&G.f.hits?G.f:null,box=document.getElementById('shFight')||(SCMON?null:document.querySelector('.schero')),   /* 2026-10-26：不打怪 一樣 3D（卡片 慢慢 轉） */w=G.w,id=SCID;
  var coin=function(){var to=document.getElementById('shGc'),fr=box||document.querySelector('.schero .shimg');if(!to||!(G.gc>0))return;var tot=document.getElementById('shTot'),t0=G.coins-G.gc;
    if(typeof RPFX==='undefined'){to.textContent='＋'+G.gc;if(tot)tot.textContent=G.coins;return}
    RPFX.coins(fr,to,G.gc,function(v){to.textContent='＋'+v;if(tot)tot.textContent=t0+v},0)};
  /* 2026-10-20 第十六次（老師第 1～3 點）：在家 練習 做完 的 最後一幕 ＝ 3D 打怪 場地（鏡頭 慢慢 轉、卡片 反光、命中 立體 爆炸）；眨眼、音效 拿掉；rpg/life.js 要用 才 載入 */
  var H=SCSRC==='home'&&!window.SCLIVE,go=function(){if(H&&window.RPLIFE&&RPLIFE.mini&&box)RPLIFE.mini(box);
    if(F&&box&&typeof RPFX!=='undefined')RPFX.fight(box,F,{base:SCRPB,w:w,p:G.p,id:id,done:coin,hook:H?function(x){if(!window.RPLIFE||!RPLIFE.burst)return;setTimeout(function(){var mo=box.querySelector('.fxmon .fxmi')||box.querySelector('.fxmon');if(mo)RPLIFE.burst(box,{at:mo,e:x.e,tier:x.tier,crit:x.crit})},x.hit)}:null});else setTimeout(coin,500)};
  if(H)scLifeLoad(go);else go()}
function scLifeLoad(cb){if(window.RPLIFE){cb();return}var done=false,f=function(){if(done)return;done=true;cb()};
  if(!document.getElementById('scLifeCss')){var l=document.createElement('link');l.id='scLifeCss';l.rel='stylesheet';l.href=SCRPB+'rpg/life.css';document.head.appendChild(l)}
  var s=document.createElement('script');s.src=SCRPB+'rpg/life.js';s.onload=f;s.onerror=f;document.head.appendChild(s);setTimeout(f,2500)}
function scByeHTML(){return '<div class="scbye"><span>👋 做完了，記得登出<small>下一個人才不會用到您的號碼</small></span><button id="scBye">👋 登出</button></div>'}
/* 蓋滿整頁的大字（這是您嗎、30 秒提醒、已經登出了） */
function scFull(id,h){var o=document.getElementById(id);if(!o){o=document.createElement('div');o.id=id;o.className='scfull';document.body.appendChild(o)}o.innerHTML='<div class="scfb">'+h+'</div>';o.classList.add('on');return o}
function scFullOff(id){var o=document.getElementById(id);if(o)o.classList.remove('on')}
function scAskWho(){if(!SCON||!SCID||SCGUEST||scAsked())return;
  scFull('scwho','<div class="sf1">請問 這是您嗎？</div><div class="sfid">'+SCID+'</div><div class="sfbt"><button class="scY" id="scWhoY">✅ 是，繼續</button><button class="scN" id="scWhoN">👋 不是，登出</button></div>')}
function scIdleHide(){scFullOff('scidle')}
function scIdleTick(){if(!SCON||!SCID||SCGUEST||window.SCLIVE){   /* ⚡ 現場任務：看 大螢幕 很久 不碰 平板，不可以 被 登出（2026-10-19 第十三次 3(5)） */scIdleHide();return}
  var a=scGet('act'),left=a?SCIDLE-(Date.now()-a):SCIDLE;if(!a){scAct();return}
  if(left<=0){scOut();scFull('scbye2','<div class="sfic">👋</div><div class="sf1">已經登出了</div><div class="sf3">10 分鐘沒有動作</div><div class="sfbt"><button class="scK" id="scByeIn">🔑 登入</button></div>');return}
  if(left<=SCWARN){var o=document.getElementById('scidle');if(!o||!o.classList.contains('on'))scFull('scidle','<div class="sfic">⏳</div><div class="sf2"><b id="scIdleN">30</b> 秒後自動登出</div><div class="sfbt"><button class="scY" id="scStay">👆 我還在</button></div>');
    var n=document.getElementById('scIdleN');if(n)n.textContent=Math.max(1,Math.ceil(left/1000))}
  else scIdleHide()}
/* ══ 👀 看字卡、按 🔊 聽，也算練習時間（2026-10-15 D 第 8 件，老師 D12 ②：句型卡、Review 1 頁、在家複習的每一頁）══
   登入才記；兩次點（點、打字、捲動）之間最多算 2 分鐘（一張卡停超過 2 分鐘只算 2 分鐘）；超過 3 分鐘沒點 ＝ 那一段不算（也會被登出）；
   換到別的分頁不算；作答中（📝 複習題、📝 複習蓋在上面）不算（作答的秒數另外記）。存成一筆 m:'v'（代號 g年級v_區域），跟成績一起送 */
var SCVW=null,SCVMAX=120000;
function scViewOn(a,nm){if(!SCON||SCVW)return;SCVW={a:a,nm:nm||'👀 看字卡',last:0,acc:0,id:null,busy:false};
  ['pointerdown','keydown','wheel','touchstart'].forEach(function(e){document.addEventListener(e,scVwAct,{passive:true,capture:true})});
  window.addEventListener('scroll',scVwAct,{passive:true});
  document.addEventListener('visibilitychange',function(){scVwAct();if(document.hidden)scVwSave()});
  window.addEventListener('pagehide',function(){scVwAct();scVwSave()});
  setInterval(function(){if(SCVW.acc>=300000)scVwSave()},30000)}   /* 5 分鐘存一筆 */
function scVwAct(){var V=SCVW,n=Date.now();if(!V)return;
  var live=scLive()&&!document.hidden,busy=scOn()||!!document.querySelector('.scfull.on');
  if(V.id&&V.id!==SCID)scVwSave();
  if(live&&V.last&&!V.busy&&!busy&&V.id===SCID){var g=n-V.last;if(g<=SCGAP)V.acc+=Math.min(g,SCVMAX)}
  V.last=live?n:0;V.busy=busy;if(live)V.id=SCID}
function scVwSave(){var V=SCVW;if(!V||!V.id)return;var sec=Math.round(V.acc/1000),id=V.id;V.acc=0;if(V.id!==SCID)V.id=null;if(sec<1)return;
  var QQ=scGet('q')||[];QQ.push({id:id,set:'g'+String(id).charAt(0)+'v_'+V.a,name:V.nm,m:'v',qs:[],sec:Math.min(3600,sec),src:SCSRC,dev:SCDEV,
    u:id+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now()});scPut('q',QQ.slice(-200));scFlush()}
/* ══ 🎧 聽完字卡（2026-10-16 老師 C4 第 6 題 A、6-2 A、C5「1 乙」：算進 📅 練習）══
   只有在家複習（SCSRC home）、登入（不是 👀 先練習）才記。頁面在「一張卡的單字和句子從頭到尾唸完」時呼叫 scHeard(站, 第幾張, 這一站幾張, 名字)；
   一站每一張都聽完 ＝ 送一筆 m:'l'（代號 g年級l_站）＝ 練習次數 ＋1、那一天算練了 1 天（同一站一天最多 3 次由 _calc.js 的 CAP 管）。
   聽完哪幾張記在這台平板（score_hd：哪一天、誰、每一站），換一天、換一個人就重來；送出以後那一站重來（再聽完一輪才再 ＋1） */
function scHeard(st,k,n,nm){if(!SCON||!SCID||SCGUEST||SCSRC!=='home'||!(n>0)||!/^[\\w-]{1,16}$/.test(st))return;
  var d=Math.floor((Date.now()+288e5)/864e5),H=scGet('hd');if(!H||H.d!==d||H.id!==SCID||!H.s)H={d:d,id:SCID,s:{}};
  var a=H.s[st]=H.s[st]||[];if(a.indexOf(k)<0)a.push(k);
  if(a.length>=n){H.s[st]=[];var QQ=scGet('q')||[];QQ.push({id:SCID,set:'g'+String(SCID).charAt(0)+'l_'+st,name:nm||'🎧 聽完字卡',m:'l',qs:[],sec:0,src:SCSRC,dev:SCDEV,
    u:SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now()});scPut('q',QQ.slice(-200));scFlush()}
  scPut('hd',H)}
/* 首頁的橫幅（只有首頁有 #scbar） */
function scBar(){var b=document.getElementById('scbar');if(!b)return;document.body.classList.toggle('scq',!!(SCON&&SCID&&!scAsked()));document.body.classList.toggle('scin',!!(SCON&&SCID));   /* scin ＝ 有 學生 登入（總首頁：不放 老師 的〔⚡ 開 現場任務 大螢幕〕，2026-10-18 第十二次） */
  if(!SCON){b.innerHTML='';b.hidden=true;return}b.hidden=false;
  /* 在家複習首頁：大大的兩個好習慣（2026-10-17 C8 另 6） */
  var hab=SCSRC==='home'&&!b.classList.contains('inl');b.classList.toggle('hab',hab);b.classList.toggle('in',hab&&!!SCID);
  if(hab){b.innerHTML=!SCID?'<span class="hh">👋 開始練習 以前</span><span class="hgo"><button class="scK" id="scBarIn">🔑 先 登入</button><span class="hf">👆</span></span>'+
    '<div class="hs"><div class="hst"><span class="hn">①</span><span>先 <b>🔑 登入</b> ➜ 你的 練習 和 努力 <span class="hfl"><i>📝</i><em>➜</em><i>📊</i></span> 都會 記在 老師 的 成績 裡</span></div>'+
    '<div class="hst"><span class="hn">②</span><span>練完 ➜ 一定 按 <b>👋 登出</b> ➜ <span class="hfl"><i>🛡</i></span> 保護 自己 和 同學 的 成績</span></div></div>':
    scAsked()?'<span class="hok">✅ <b>'+SCID+'</b> 已經登入：練習 都會 記下來 📊<small>練完 一定 按 👋 登出</small></span>'+scHeroA()+'<button class="scN" id="scBarOut">👋 登出</button>':
    '<span>請問 這是您嗎？<b>'+SCID+'</b></span><button class="scY" id="scBarY">✅ 是</button><button class="scN" id="scBarOut">👋 不是，登出</button>';return}
  b.innerHTML=!SCID?'<span>👤 還沒登入</span><button class="scK" id="scBarIn">🔑 登入</button>':
    scAsked()?'<span>👤 <b>'+SCID+'</b></span>'+scHeroA()+'<button class="scN" id="scBarOut">👋 登出</button>':
    '<span>請問 這是您嗎？<b>'+SCID+'</b></span><button class="scY" id="scBarY">✅ 是</button><button class="scN" id="scBarOut">👋 不是，登出</button>'}
/* 登入以後橫幅上〔🦸 我的英雄〕（2026-10-17 第八次）；在〔🦸 我的英雄〕那一頁、總首頁（一行的小橫幅，量過放了會多出捲軸）不放 */
function scHeroA(){var b=document.getElementById('scbar');return window.SCLIVE||location.pathname.indexOf('/rpg/')>=0||(b&&b.classList.contains('inl'))?'':'<a class="scH" role="button" tabindex="0" data-rpg="1">'+scCovI()+'戰神之路</a>'}
/* 連結用點的（不寫 href：在家複習 r1/ 的複製程式會把 href 換路徑） */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-rpg]');if(a){e.preventDefault();location.href=SCRPB+'rpg/index.html'}});
function scHomeLogin(){if(!SCH)return;scFullOff('scbye2');scLogin(SCH.reopen)}
if(SCON){
  (function(){var a=scGet('act');if(SCID&&a&&!window.SCLIVE&&Date.now()-a>=SCIDLE)scOut()})();   /* 上一次動作已經超過 10 分鐘 ＝ 已經登出了 */
  ['pointerdown','keydown','touchstart','wheel'].forEach(function(k){document.addEventListener(k,function(e){
    if(SCID&&!SCGUEST&&!(e.target&&e.target.closest&&e.target.closest('#scbye2')))scAct()},true)});
  SCIT=setInterval(scIdleTick,1000);
  window.addEventListener('storage',function(e){if(e.key==='score_last'&&!e.newValue&&SCID){SCID=null;scBar()}});
  document.addEventListener('DOMContentLoaded',function(){scBar();scAskWho()});
  if(document.readyState!=='loading')setTimeout(function(){scBar();scAskWho()},0);
}
document.addEventListener('click',function(e){
  var t=e.target,c=function(s){return t.closest?t.closest(s):null};
  if(c('#scWhoY')){scFullOff('scwho');scSure(function(){scOk();scAct();scBar()});return}
  if(c('#scWhoN')){scOut();scFullOff('scwho');if(SCHOMEP)scHomeLogin();return}
  if(c('#scStay')){scAct();scIdleHide();return}
  if(c('#scByeIn')){scFullOff('scbye2');if(SCHOMEP)scHomeLogin();return}
  if(c('#scBarIn')){scHomeLogin();return}
  if(c('#scBarY')){scSure(function(){scOk();scAct();scBar()});return}
  if(c('#scBarOut')){scOut();return}
});
document.addEventListener('keydown',function(e){if(!$('#scBox'))return;
  if(SCPW&&$('#scPwC')){if(/^[a-z0-9]$/.test(e.key))scPwKey(e.key);else if(e.key==='Backspace')scPwKey('del');else if(e.key==='Enter')scPwKey('ok');return}
  if(/^\\d$/.test(e.key))scKeyPress(e.key);else if(e.key==='Backspace')scKeyPress('b');else if(e.key==='Enter')scKeyPress('ok')});

/* ══ 👑 冠軍寶箱 登入 動畫（2026-10-26 第二十九次 第 11 點，老師 選 A：學生 在 任何 一個 網站 登入 就 演）══
   伺服器 GET rpg 會 先 自動 發 上週 的 寶箱（每週一 0:00 以後、每個 年級 最認真練習 前 5 名），回 chi＝{k 編號, rk 名次, sec 秒數, g 年級}、v.ch＝還沒 開 幾個。
   ① 黑幕＋聚光燈、皇冠 從 天上 掉下來、金字「冠軍 寶箱」② 為什麼：上週 三年級 最認真練習 第 2 名、練習 48 分鐘 ③ 寶箱 發光 搖一搖 ➜〔👆 點 寶箱 打開〕＝ 伺服器 真的 開（POST rpg open）
   ➜ 蓋子 打開、金光 往上、🪙 ⭐ 一顆一顆 飛進 下面 的「🎒 我的 收藏庫」、數字 數上去 ④「下週 繼續 認真 練習」〔✅ 收下〕。同一個 寶箱 只 演 一次（這台 平板 chs_5碼）。 */
var SCCH=null;
function scChamp(force){if(!SCON||!SCID||SCGUEST)return;try{if(!force&&sessionStorage.getItem('sc_chk')===SCID)return;sessionStorage.setItem('sc_chk',SCID)}catch(e){}
  var id=SCID;scFetch('a=rpg&id='+id).then(function(j){if(!j||!j.ok||!j.chi||!j.v||!(j.v.ch>0)||SCID!==id)return;if(scGet('chs_'+id)===j.chi.k)return;scChampShow(j,id)}).catch(function(){})}
function scChMin(s){s=Math.round(+s||0);return s<60?s+' 秒':Math.round(s/60)+' 分鐘'}
function scChampShow(j,id){var c=j.chi,o=document.getElementById('scch');if(!o){o=document.createElement('div');o.id='scch';document.body.appendChild(o)}
  var rk=c.rk||'',gn=(c.g===3?'三':'四')+'年級',st=j.v;SCCH={id:id,k:c.k,c0:+st.coins||0,x0:+st.xp||0,busy:false};
  var rays='';for(var i=0;i<12;i++)rays+='<i style="transform:rotate('+(i*30)+'deg)"></i>';
  o.innerHTML='<div class="chw"><div class="chray">'+rays+'</div><div class="chcr">👑</div><div class="cht">冠軍 寶箱</div>'+
   '<div class="chwhy"><div>🏆 上週 '+gn+' <b>最認真練習</b>'+(rk?' 第 <span class="chrk">'+rk+'</span> 名':' 前 5 名')+'</div>'+(c.sec?'<div class="chs">⏱ 你 練習 了 <b>'+scChMin(c.sec)+'</b></div>':'')+'<div class="chsm">每週一 0 點，每個 年級 最認真練習 前 5 名 自動 得到</div></div>'+
   '<button class="chbox" id="chBox" aria-label="打開 寶箱"><span class="chlid"></span><span class="chbd"><i class="chlk">🔒</i></span><span class="chgl"></span></button><div class="chtap" id="chTap">👆 點 寶箱 打開！</div>'+
   '<div class="chbag" id="chBag"><span class="chbi">🎒</span><span>我的 收藏庫</span><span class="chn">🪙 <b id="chC">'+SCCH.c0+'</b></span><span class="chn">⭐ <b id="chX">'+SCCH.x0+'</b></span></div>'+
   '<div class="chend" id="chEnd" hidden><div>🔥 下週 繼續 認真 練習，再 拿 冠軍 寶箱！</div><button id="chOk">✅ 收下</button></div><div class="chmsg" id="chMsg"></div></div>';
  o.classList.add('on');document.getElementById('chBox').onclick=scChampOpen}
function scChCount(el,a,b,ms){var t0=Date.now();(function f(){var k=Math.min(1,(Date.now()-t0)/ms);el.textContent=Math.round(a+(b-a)*k);if(k<1)requestAnimationFrame(f)})()}
function scChampOpen(){var S=SCCH;if(!S||S.busy)return;S.busy=true;var bx=document.getElementById('chBox'),m=document.getElementById('chMsg');bx.classList.add('shake');m.textContent='';
  scFetch('',{a:'rpg',op:'open',id:S.id},12000).then(function(r){if(!r||!r.ok||!r.r){S.busy=false;bx.classList.remove('shake');m.textContent='📶 等一下 再 點 一次（戰神之路 也 可以 打開）';return}
    scPut('chs_'+S.id,S.k);var gc=+r.r.c||0,gx=+r.r.x||0;bx.classList.remove('shake');bx.classList.add('open');document.getElementById('chTap').innerHTML='🎉 <b>🪙 ＋'+gc+'</b>　<b>⭐ ＋'+gx+'</b>';
    var w=document.querySelector('#scch .chw'),br=bx.getBoundingClientRect(),bg=document.getElementById('chBag').getBoundingClientRect(),N=18;
    for(var i=0;i<N;i++)(function(i){setTimeout(function(){var f=document.createElement('span');f.className='chfly';f.textContent=i%3===2?'⭐':'🪙';var sx=br.left+br.width/2,sy=br.top+br.height*.3,dx=(Math.random()-.5)*260,tx=bg.left+bg.width*(i%3===2?.86:.66),ty=bg.top+bg.height/2;
      f.style.left=sx+'px';f.style.top=sy+'px';f.style.setProperty('--ux',dx+'px');f.style.setProperty('--tx',(tx-sx)+'px');f.style.setProperty('--ty',(ty-sy)+'px');document.getElementById('scch').appendChild(f);setTimeout(function(){f.remove()},1700)},500+i*70)})(i);
    setTimeout(function(){var bag=document.getElementById('chBag');bag.classList.add('pulse');scChCount(document.getElementById('chC'),S.c0,S.c0+gc,1300);scChCount(document.getElementById('chX'),S.x0,S.x0+gx,1300)},1500);
    setTimeout(function(){w.classList.add('done');document.getElementById('chEnd').hidden=false;var b=document.getElementById('chOk');b.onclick=function(){document.getElementById('scch').classList.remove('on');SCCH=null}},3400)},
   function(){S.busy=false;bx.classList.remove('shake');m.textContent='📶 沒有 網路，等一下 再 點 一次'})}
setTimeout(function(){if(SCID)scChamp(0)},1600);
`;

/* 一頁要放的東西：S ＝ score/_sites.js 查到的這個資料夾、src ＝ school／home、g 覆寫年級（0 ＝ 看登入的 5 碼） */
function js(S, src) { return JS.replace('__SCG__', S.g).replace('__SCSRC__', JSON.stringify(src === 'home' ? 'home' : 'school')).replace('__TKLOCK__', () => require('./_calc.js').tkLock.toString()) +
  '\n;' + require('./_dsp.js').js('#scov,#scbar,.scme,.scbanner,#scHomeBar') + '\n'; }   /* 2026-10-31 第三十五次 第 11 點：登入 框、成績 畫面 的 中文 不 空格（整頁 的 另外 在 各 網頁 加）*/

const CSSALL = CSS + require('fs').readFileSync(require('path').join(__dirname, '..', 'rpg', '_wear.css'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '..', 'rpg', '_fx.css'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '_honor.css'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '_report.css'), 'utf8');
/* 首頁（總首頁、三年級、四年級、在家複習首頁）：最上面的登入橫幅＋「請問 這是您嗎？」＋10 分鐘登出（2026-10-12 D 第 6 件；2026-10-23 改 10 分鐘）
   g ＝ 年級（0 ＝ 總首頁：看最後登入的號碼）、rel ＝ 到 repo 根目錄的相對路徑（例 '../'）、src ＝ school／home。登入用遊戲那一種蓋滿整頁的 #scov */
function home(g, rel, src, inl) {
  return (inl ? '' : '<div id="scbar" hidden></div>\n') + '<script src="' + rel + 'score/url.js"></script>\n<style>\n#scov{--btn:#1E1E1E;--line:#4A4A4A;--ok:#39D98A;--gold:#FFD24A;--acc:#9FB4C8}\n' + CSSALL + '</style>\n<script>\n' +
    "if(typeof $==='undefined')window.$=function(s){return document.querySelector(s)};if(typeof $$==='undefined')window.$$=function(s){return [].slice.call(document.querySelectorAll(s))};\n" +
    "if(typeof sayStop==='undefined')window.sayStop=function(){};var MISSLOG=window.MISSLOG||[];\n" +
    js({ g: g || 0 }, src) + "\nSCHOMEP=true;\nfunction hOv(){var o=document.getElementById('scov');if(!o){o=document.createElement('div');o.id='scov';o.innerHTML='<div id=\"scovb\"></div>';document.body.appendChild(o)}return o}\n" +
    "SCH={on:function(){return hOv().classList.contains('on')},open:function(){hOv().classList.add('on')},close:function(){hOv().classList.remove('on')},box:function(){return document.getElementById('scovb')},\n" +
    " back:'<div class=\"scnav\"><button data-sca=\"close\">⬅ 回首頁</button></div>',key:function(){return ''},name:function(){return ''},reopen:function(){SCH.close();scBar()},act:function(){SCH.close()},btns:function(){return ''},miss:function(){return ''}};\n</script>\n";
}
module.exports = { CSS: CSSALL, JS, js, home };
