/* midterm/_newgames.js — 📝 四年級 複習 新 25／新 50 的 6 種 全新 遊戲（2026-10-29 第三十三次 第 5 件；老師 C36「對」＋第 6 點「比 三年級 更 好玩」）
 *   n1 🚀 字首音 太空 射擊（考卷 A＋B）   n2 🏎️ 聽力 賽車（C）   n3 🐍 英文 貪食蛇（D）
 *   n4 🥷 對話 忍者跑酷（E）                n5 🫧 拼字 泡泡龍（F）  n6 🚪 密室 逃脫（G＋H）
 * 題目 ＝ midterm/_data.js 的 XB2（_pool.js 的 NB）。每一種 都 是「選 一個」：學生 操作（射擊、開車、蛇 去 吃、跳、射 泡泡、拿 鑰匙）
 * ➜ 動畫 演完 ➜ 呼叫 原本 的 pick(第幾個)（成績、答錯頁、25／50 題 的 分數 都 照舊）。
 * 這裡 是 網頁 端 的 程式 字串（樣板 裡 的 正規 表示式 一律 兩條 斜線）。 */
exports.HOW = {
  n1: '聽 ➜ ◀ ▶ 移動 太空船 對準 隕石 ➜ 按〔🔥 發射〕（也 可以 直接 點 隕石）',
  n2: '聽 對話 ➜ ◀ ▶ 換 跑道 ➜ 按〔⬆ 衝！〕開進 對 的 拱門（也 可以 直接 點 拱門）',
  n3: '🔊 聽 ➜ 👆 點 對 的 那一個，蛇 自己 衝 過去 吃（也 可以 ⬆⬇⬅➡、手指 滑）；撞 牆 從 另一邊 出來，不會 輸',
  n4: '讀 對話 ➜ 點 寫著 對 的 回答 的 雲，袋鼠 跳 上去 往 上 爬',
  n5: '看 圖 ➜ 點 字母 泡泡 射到 空格（照 順序），拼出 這個 字',
  n6: '讀 牆上 的 對話（或 看 家族樹）➜ 選 對 的 鑰匙 🗝 打開 門'
};
exports.T = { n1: 20, n2: 20, n3: 30, n4: 25, n5: 30, n6: 30 };
exports.COL = { n1: ['#1A237E', '#7C4DFF'], n2: ['#E65100', '#FFB300'], n3: ['#1B5E20', '#76FF03'], n4: ['#0277BD', '#80D8FF'], n5: ['#AD1457', '#FF80AB'], n6: ['#37474F', '#FFD54A'] };
exports.CSS = `
/* ── 👥 兩人 一台（2026-10-29 第 4 件）── */
.duo{display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;font-size:clamp(20px,2.6vh,26px);color:#BFD3E6;margin:14px 0}
.duo button{min-height:60px;padding:6px 22px;border-radius:18px;border:3px solid #4A5A6C;background:#1B2633;font-size:clamp(22px,3vh,28px)}.duo button.on{border-color:#FFD54A;background:#3A3010;color:#FFE38A}
#duob{position:fixed;inset:0;z-index:96;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:rgba(5,8,20,.9);font-size:clamp(40px,7vh,72px);color:#fff;text-align:center;padding:16px}
#duob.on{display:flex;animation:pop .3s}#duob b{font-size:.6em;color:#FFD54A}#duob .p2,.duoe .p2 b{color:#80D8FF}#duob .p1,.duoe .p1 b{color:#FFD54A}
.duot{font-size:clamp(16px,2.2vh,22px);padding:2px 10px;border-radius:999px;border:2px solid #FFD54A;margin-left:8px}.duot.p2{border-color:#80D8FF;color:#80D8FF}.duot.p1{color:#FFE38A}
.duoe{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin:16px 0}.duoe>div{display:flex;flex-direction:column;gap:6px;align-items:center;min-width:260px;padding:16px;border-radius:22px;background:#111A28;border:3px solid #2E4058}
.duoe .big{font-size:clamp(36px,6vh,60px);color:#fff}
/* ── C35 第 1 題 遊戲 元素（2026-10-29 第 7 件）── */
.lmap{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:2px;max-width:min(96vw,1100px);margin-bottom:14px}
.lnd{position:relative;display:inline-flex;align-items:center;justify-content:center;width:clamp(40px,5vw,58px);height:clamp(40px,5vw,58px);border-radius:50%;background:#1B2633;border:3px solid #3F5268;font-size:clamp(20px,2.8vw,30px);opacity:.75;animation:lndIn .4s backwards}
.lnd small{position:absolute;bottom:-1.3em;font-size:18px;color:#9FB4C8}.lnd.ok{background:#14532D;border-color:#2BD46A;color:#BFFFD0;opacity:1}.lnd.cur{border-color:#FFD54A;background:#3A3010;opacity:1;transform:scale(1.2);box-shadow:0 0 18px #FFD54A;animation:lndIn .4s backwards,lndG 1s .5s infinite alternate}
.lnd.bs{border-color:#E040FB}.lnd.bs.cur{box-shadow:0 0 22px #E040FB}
.lpth{display:inline-block;width:clamp(6px,1.2vw,18px);height:6px;border-radius:3px;background:#2E4058}.lpth.on{background:#2BD46A}
@keyframes lndIn{from{transform:scale(0)}}@keyframes lndG{to{box-shadow:0 0 32px #FFD54A}}
.lvs .gi{animation:giIn .7s cubic-bezier(.3,1.6,.5,1)}.lvs .gn{animation:gnIn .6s .25s backwards}.lvs .gh{animation:gnIn .6s .45s backwards}
@keyframes giIn{from{transform:scale(0) rotate(-200deg)}}@keyframes gnIn{from{opacity:0;transform:translateY(24px)}}
.lvs.boss{background:radial-gradient(circle at 50% 50%,rgba(160,30,200,.35),transparent 65%)}.lvs.boss .glv{border-color:#E040FB;color:#F8BBF8;background:#2A0A33}.lvs.boss .gi{animation:giIn .7s cubic-bezier(.3,1.6,.5,1),bshk .5s .7s 3}
@keyframes bshk{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
.flm{display:inline-flex;align-items:center;font-size:clamp(20px,2.8vh,28px);color:#FFB74D;padding:0 8px;animation:flm .6s infinite alternate}.flm.hot{font-size:clamp(26px,3.6vh,36px);color:#FF7043;text-shadow:0 0 12px #FF5722}
@keyframes flm{to{transform:scale(1.12) rotate(-4deg)}}
.bhp{font-size:clamp(18px,2.4vh,24px);white-space:nowrap}.bhp s{text-decoration:none;opacity:.5}
.vs{font-size:clamp(20px,2.6vh,26px);white-space:nowrap}.vs .p1{color:#FFD54A}.vs .p2{color:#80D8FF}
#bossfx{position:fixed;inset:0;pointer-events:none;z-index:70;display:none;align-items:center;justify-content:center;flex-direction:column}#bossfx.on{display:flex}
#bossfx .bm{font-size:clamp(110px,20vh,200px);animation:bshk .3s 2}#bossfx .bx{position:absolute;font-size:clamp(90px,16vh,160px);animation:bxp .6s forwards}#bossfx.ko .bm{animation:bko 1.4s forwards}
#bossfx .bk{font-size:clamp(36px,6vh,60px);color:#FFD54A;text-shadow:0 0 16px #000}
@keyframes bxp{from{transform:scale(.2);opacity:1}to{transform:scale(1.6);opacity:0}}@keyframes bko{to{transform:rotate(90deg) translateY(60px);opacity:0}}
#coop{position:fixed;left:50%;bottom:8px;transform:translateX(-50%);z-index:40;display:none;align-items:center;gap:10px;padding:6px 14px;border-radius:999px;background:rgba(10,20,34,.92);border:2px solid #2E7D32;font-size:clamp(18px,2.2vh,22px);color:#C8E6C9;white-space:nowrap}
#coop.on{display:flex}#coop .cb{width:clamp(120px,18vw,260px);height:14px;border-radius:7px;background:#1B2B1B;overflow:hidden}#coop .cb i{display:block;height:100%;background:linear-gradient(90deg,#66BB6A,#FFD54A);transition:width .6s}
.duoe .win{border-color:#FFD54A;box-shadow:0 0 22px rgba(255,213,74,.5)}.duoe .cr{font-size:48px}
/* ── 🚀 n1 太空 射擊 ── */
.n1{position:relative;width:min(100%,920px);height:clamp(260px,44vh,440px);border-radius:24px;overflow:hidden;background:radial-gradient(ellipse at 50% 120%,#3B1E7A 0,#0B0828 60%,#04030F 100%);border:3px solid #3A2C7A}
.n1 .stars{position:absolute;inset:-50% 0 0;background-image:radial-gradient(2px 2px at 10% 20%,#fff,transparent),radial-gradient(2px 2px at 60% 30%,#fff,transparent),radial-gradient(1px 1px at 30% 70%,#fff,transparent),radial-gradient(2px 2px at 80% 60%,#cfe,transparent),radial-gradient(1px 1px at 45% 45%,#fff,transparent);background-size:220px 220px;animation:stf 6s linear infinite;opacity:.8}
@keyframes stf{to{transform:translateY(220px)}}
.ast{position:absolute;top:10%;transform:translateX(-50%);width:clamp(92px,13vw,130px);height:clamp(92px,13vw,130px);border-radius:46% 54% 52% 48%;border:4px solid #8D6E63;background:radial-gradient(circle at 35% 30%,#BCAAA4,#6D4C41 70%);display:flex;align-items:center;justify-content:center;animation:astf 3.2s ease-in-out infinite alternate}
.ast b{font-size:clamp(46px,8vh,72px);color:#fff;text-shadow:0 3px 0 #3E2723,0 0 12px #000}.ast:nth-of-type(2n){animation-delay:-1.4s}
@keyframes astf{to{top:22%}}
.ast.wide{width:clamp(190px,26vw,270px);border-radius:80px}.ast.wide b{font-size:clamp(36px,6vh,54px)}
.ast.aim{box-shadow:0 0 0 5px #FFD54A,0 0 26px #FFD54A}.ast.ok{background:radial-gradient(circle,#FFF59D,#FF6F00 60%,transparent 70%);border-color:transparent;animation:boom .5s forwards}
.ast.bad{border-color:#FF5A5A;animation:shk .4s}.ast.no{opacity:.35}
@keyframes boom{60%{transform:translateX(-50%) scale(1.5)}to{transform:translateX(-50%) scale(1.25);opacity:.9}}
.ship{position:absolute;bottom:4%;transform:translateX(-50%) rotate(-45deg);font-size:clamp(56px,9vh,84px);transition:left .25s ease;filter:drop-shadow(0 0 10px #7C4DFF)}
.lz{position:absolute;width:10px;border-radius:6px;background:linear-gradient(#FFF,#FF4081);box-shadow:0 0 16px #FF4081;transform:translateX(-50%);opacity:0;pointer-events:none}.lz.on{animation:lz .35s}.lz.big{width:18px}
@keyframes lz{0%{opacity:1;clip-path:inset(100% 0 0 0)}60%{opacity:1;clip-path:inset(0 0 0 0)}100%{opacity:0}}
.ngc{display:flex;gap:14px;justify-content:center;margin-top:8px}.ngc button{min-width:clamp(80px,11vw,120px);min-height:64px;border-radius:18px;border:3px solid #4A5A6C;background:#1B2633;font-size:clamp(26px,3.6vh,36px)}
.ngc .fire{background:linear-gradient(#FF8A65,#E64A19);border-color:#FFAB91;min-width:clamp(150px,20vw,220px)}
/* ── 🏎️ n2 聽力 賽車 ── */
.n2{position:relative;width:min(100%,900px);height:clamp(250px,40vh,420px);border-radius:24px;overflow:hidden;background:linear-gradient(#5DADE2 0,#A9DFBF 26%,#4E5A63 26%,#4E5A63 100%);border:3px solid #2E4058;display:grid;grid-template-columns:repeat(3,1fr)}
.n2 .road{position:absolute;inset:26% 0 0;background:repeating-linear-gradient(to right,transparent 0,transparent calc(33.33% - 4px),#fff calc(33.33% - 4px),#fff 33.33%);mask:repeating-linear-gradient(transparent 0 30px,#000 30px 60px);-webkit-mask:repeating-linear-gradient(transparent 0 30px,#000 30px 60px);animation:rd .5s linear infinite;opacity:.8}
@keyframes rd{to{-webkit-mask-position:0 60px;mask-position:0 60px}}
.lane{position:relative;z-index:1;margin:8px auto 0;align-self:start;width:88%;height:62%;border-radius:22px 22px 6px 6px;border:6px solid #FFB300;background:linear-gradient(#F4F8FF,#D9E6F7);display:flex;align-items:center;justify-content:center;gap:4px}
.lane .pw{font-size:clamp(64px,10vh,100px);line-height:1}.lane .pj{font-size:clamp(40px,6vh,60px);background:#fff;border:4px solid #FFB300;border-radius:50%;width:1.5em;height:1.5em;display:flex;align-items:center;justify-content:center}
.lane.aim{box-shadow:0 0 0 6px #fff,0 0 24px #FFD54A}.lane.ok{border-color:var(--ok);box-shadow:0 0 0 6px var(--ok)}.lane.no{opacity:.35}.lane.bad{border-color:var(--no);animation:shk .4s}
.car{position:absolute;z-index:2;bottom:3%;transform:translateX(-50%) scaleX(-1) rotate(90deg);font-size:clamp(60px,10vh,90px);transition:left .25s ease,bottom .6s cubic-bezier(.5,0,.8,.4)}
.car.go{bottom:46%}.car.spin{animation:spin .7s}@keyframes spin{to{transform:translateX(-50%) scaleX(-1) rotate(450deg)}}
/* ── 🐍 n3 貪食蛇（第四十二次 重做）── */
.n3b{display:flex;align-items:center;gap:18px;justify-content:center;flex-wrap:wrap}
.n3w{position:relative;border-radius:22px;border:5px solid #66BB6A;touch-action:none;background-color:#2E7D32;background-image:linear-gradient(45deg,rgba(255,255,255,.07) 25%,transparent 25%,transparent 75%,rgba(255,255,255,.07) 75%),linear-gradient(45deg,rgba(255,255,255,.07) 25%,transparent 25%,transparent 75%,rgba(255,255,255,.07) 75%);background-size:calc(var(--cs) * 2) calc(var(--cs) * 2);background-position:0 0,var(--cs) var(--cs);box-shadow:inset 0 0 40px rgba(0,0,0,.45),0 10px 30px rgba(0,0,0,.5)}
.n3w .fr{position:absolute;padding:0;border-radius:20px;border:5px solid #FFD54A;background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 0 #B8860B,0 0 22px rgba(255,213,74,.6);animation:frIn .6s cubic-bezier(.3,1.6,.5,1) both,frBob 2s ease-in-out .6s infinite alternate;z-index:1}
@keyframes frIn{from{transform:scale(0) rotate(-20deg)}}@keyframes frBob{to{transform:translateY(-5px)}}
.n3w .fr img{width:100%;height:100%;object-fit:cover}.n3w .fr b{font-size:clamp(26px,calc(var(--cs) * .42),48px);color:#1B3A1F;padding:0 6px;line-height:1.1;text-align:center}
.n3w .fr.tgt{border-color:#40C4FF;box-shadow:0 8px 0 #0277BD,0 0 0 6px rgba(64,196,255,.5),0 0 30px #40C4FF}
.n3w .fr.ok{border-color:var(--ok);box-shadow:0 0 0 6px var(--ok)}.n3w .fr.no{opacity:.35}.n3w .fr.bad{border-color:var(--no);animation:shk .4s}
.n3w .fr.eat{animation:frEat .7s forwards}@keyframes frEat{40%{transform:scale(1.25);filter:brightness(1.6)}100%{transform:scale(0) rotate(40deg);opacity:0}}
.n3w .sg{position:absolute;border-radius:42%;background:radial-gradient(circle at 35% 30%,#E8FFB0,#76D640 55%,#2E9E2E);box-shadow:inset 0 -4px 0 rgba(0,60,0,.35),0 3px 6px rgba(0,0,0,.35);transition:left .17s linear,top .17s linear}
.n3w .sg.gold{background:radial-gradient(circle at 35% 30%,#FFFDE0,#FFD54A 55%,#E09B00)}
.n3w .sg.rb{background:linear-gradient(135deg,#FF6B6B,#FFD54A,#5EF06A,#40C4FF,#B388FF);background-size:300% 300%;animation:snRb 1.6s linear infinite}@keyframes snRb{to{background-position:300% 300%}}
.n3w .sg.hd{border-radius:46%;box-shadow:inset 0 -4px 0 rgba(0,60,0,.35),0 4px 10px rgba(0,0,0,.45)}
.n3w .sg.hd .ey{position:absolute;width:26%;height:26%;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 3px #1B3A1F;top:22%}.n3w .sg.hd .ey:after{content:'';position:absolute;width:45%;height:45%;border-radius:50%;background:#111;left:30%;top:30%}
.n3w .sg.hd .ey.l{left:18%}.n3w .sg.hd .ey.r{right:18%}
.n3w .sg.hd .tg{position:absolute;left:44%;bottom:-16%;width:12%;height:22%;background:#E53935;border-radius:0 0 40% 40%;animation:snTg .5s ease-in-out infinite alternate}@keyframes snTg{to{transform:scaleY(.4)}}
.n3w .sg.hd.dd{transform:rotate(0)}.n3w .sg.hd.du{transform:rotate(180deg)}.n3w .sg.hd.dl{transform:rotate(90deg)}.n3w .sg.hd.dr{transform:rotate(-90deg)}
.n3w .sg.hd .cw{position:absolute;left:50%;top:-50%;transform:translateX(-50%);font-size:calc(var(--cs) * .38);font-style:normal}
.n3w .sg.hd.bite{animation:snBite .35s 2}@keyframes snBite{50%{filter:brightness(1.4);scale:1.25}}
.n3w .snp{position:absolute;font-size:calc(var(--cs) * .35);pointer-events:none;animation:snP .8s ease-out forwards;z-index:60}@keyframes snP{0%{transform:translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(.5)}100%{transform:translate(-50%,-50%) rotate(var(--a)) translateY(calc(var(--cs) * -1.6)) scale(1.3);opacity:0}}
.n3w .snb{position:absolute;transform:translate(-50%,-50%);opacity:0;pointer-events:none;z-index:70;font-size:clamp(26px,calc(var(--cs) * .45),46px);font-weight:900;color:#FFF59D;text-shadow:0 3px 0 #1B5E20,0 0 14px #000;text-align:center;white-space:nowrap}
.n3w .snb.on{animation:snB 1s ease-out forwards}@keyframes snB{0%{opacity:0;transform:translate(-50%,-20%) scale(.4)}25%{opacity:1;transform:translate(-50%,-60%) scale(1.15)}100%{opacity:0;transform:translate(-50%,-140%)}}
.n3w .hit{display:none}
.dpad3{display:grid;grid-template-columns:repeat(3,clamp(70px,9vh,96px));grid-template-rows:repeat(3,clamp(70px,9vh,96px));gap:8px;padding:12px;border-radius:50%;background:radial-gradient(circle,#24384E,#0E1A26);box-shadow:0 0 0 4px #3C5A78,0 10px 24px rgba(0,0,0,.5);touch-action:none}
.dpad3 button{border-radius:20px;border:4px solid #5C7FA3;background:linear-gradient(#2C4562,#1A2B40);font-size:clamp(32px,4.4vh,44px);color:#fff;box-shadow:0 5px 0 #0B1520}
.dpad3 button.on{border-color:#7BF0A8;background:linear-gradient(#36D27A,#1E9E55);box-shadow:0 0 18px rgba(57,217,138,.8)}
.dpad3 .dc{grid-column:2;grid-row:2;border-radius:50%;opacity:.8}
@media (orientation:portrait){.dpad3{grid-template-columns:repeat(3,70px);grid-template-rows:repeat(3,64px);border-radius:40px}}
.dpad3 [data-d="u"]{grid-column:2;grid-row:1}.dpad3 [data-d="l"]{grid-column:1;grid-row:2}.dpad3 [data-d="r"]{grid-column:3;grid-row:2}.dpad3 [data-d="d"]{grid-column:2;grid-row:3}
.n3hud{font-size:clamp(20px,2.6vh,28px);font-weight:700;color:#CCFF90;text-align:center}.n3hud b{color:#fff;font-size:1.2em}
.snhow{position:fixed;inset:0;z-index:9200;background:rgba(3,14,6,.92);display:flex;align-items:center;justify-content:center;padding:12px}
.snhow .shb{width:min(940px,96vw);max-height:96vh;overflow:auto;border-radius:26px;border:4px solid #76FF03;background:linear-gradient(#123C1E,#071A0C);padding:clamp(14px,2.4vh,26px);text-align:center;color:#fff}
.snhow .sht{font-size:clamp(30px,5vh,48px);font-weight:900;color:#CCFF90}
.snhow .shd{display:flex;gap:20px;align-items:center;justify-content:center;flex-wrap:wrap;margin:12px 0}
.snhow .shg{position:relative;width:min(300px,70vw);height:180px;border-radius:18px;background:#2E7D32;border:4px solid #66BB6A;flex:none}
.snhow .sf{position:absolute;top:30px;font-size:54px}.snhow .sf.a{left:20px}.snhow .sf.b{right:20px;border:4px solid #FFD54A;border-radius:14px;background:#fff;line-height:1.1}
.snhow .ss{position:absolute;left:44%;top:110px;display:flex;gap:2px}.snhow .ss i{width:30px;height:30px;border-radius:40%;background:#76D640;font-style:normal;font-size:18px;display:flex;align-items:center;justify-content:center}
.snhow .sh{position:absolute;right:30px;top:96px;font-size:50px;opacity:0}
.snhow .shg.go .sh{animation:shTap 4.5s ease-in-out infinite}.snhow .shg.go .ss{animation:shRun 4.5s ease-in-out infinite}
@keyframes shTap{0%,15%{opacity:0;transform:translate(30px,40px)}25%,40%{opacity:1;transform:none}48%{transform:scale(.8)}60%,100%{opacity:0}}
@keyframes shRun{0%,45%{transform:none}75%,100%{transform:translate(70px,-74px)}}
.snhow .shs{text-align:left;margin:0;padding-left:1.4em;font-size:clamp(22px,3.1vh,32px);line-height:1.5;flex:1;min-width:280px}.snhow .shs li{opacity:.18;transition:opacity .4s,transform .4s}.snhow .shs li.on{opacity:1;transform:translateX(6px)}
.snhow .shs b{color:#FFE58A}.snhow .shs small{display:block;font-size:.72em;color:#BFE9C8}
.snhow .shgo{margin-top:12px;min-height:66px;min-width:300px;border-radius:18px;border:3px solid #4A5A6E;background:#1A2230;color:#8C9AAE;font:inherit;font-size:clamp(22px,3vh,30px);font-weight:700}
.snhow .shgo.rdy{border-color:#7BF0A8;background:linear-gradient(#36D27A,#1E9E55);color:#06210F;box-shadow:0 0 22px rgba(57,217,138,.75);cursor:pointer}
/* ── 🥷 n4 忍者跑酷（原 跳跳樂）── */
.n4{position:relative;width:min(100%,960px);display:flex;flex-direction:column;align-items:center;gap:10px}
.n4 .cl{display:flex;gap:clamp(8px,1.4vw,16px);justify-content:center;width:100%}
.cld{flex:1;max-width:320px;min-height:clamp(96px,14vh,130px);border:0;border-radius:60px;background:radial-gradient(circle at 30% 30%,#fff,#DDEBFA);color:#123;font-size:clamp(22px,3vh,30px);padding:10px 16px;box-shadow:0 8px 0 #9FB8D4;line-height:1.25;transition:transform .2s}
.cld.ok{background:radial-gradient(circle at 30% 30%,#fff,#B9F6CA);box-shadow:0 0 0 6px var(--ok)}.cld.no{opacity:.35}.cld.bad{animation:brk .5s forwards}
@keyframes brk{40%{transform:rotate(-4deg)}100%{transform:translateY(40px) rotate(8deg);opacity:.3}}
.n4 .gr{position:relative;width:100%;height:clamp(110px,17vh,160px)}
.roo{position:absolute;left:50%;bottom:0;transform:translateX(-50%);font-size:clamp(64px,10vh,96px);transition:left .45s cubic-bezier(.3,1.5,.6,1),bottom .45s cubic-bezier(.3,1.5,.6,1)}
.roo.up{bottom:115%}.roo.fall{animation:fall .6s}@keyframes fall{50%{bottom:60%}100%{bottom:0}}
.hm{position:absolute;right:0;bottom:0;font-size:clamp(20px,2.6vh,26px);color:#FFD54A;background:#14202E;border:2px solid #3F6386;border-radius:12px;padding:4px 10px}
/* ── 🫧 n5 泡泡龍 ── */
.n5 .tiles button{border-radius:50%;background:radial-gradient(circle at 32% 30%,#fff 0,#FFD1E8 20%,#FF80AB 75%,#AD1457 100%);color:#3A0018;box-shadow:inset -6px -8px 14px rgba(0,0,0,.18),0 4px 0 #880E4F}
.n5 .tiles button.lv{color:#B71C1C}.n5 .tiles button.fly{animation:bfly .35s ease-in forwards}@keyframes bfly{to{transform:translateY(-140px) scale(.4);opacity:0}}
.n5 .slots span{border-radius:50%}
.n5 .sp1 .ic{font-size:clamp(70px,11vh,110px)}
/* ── 🚪 n6 密室 逃脫 ── */
.n6{width:min(100%,980px);display:flex;flex-direction:column;align-items:center;gap:8px}
.door{display:flex;align-items:center;gap:12px;font-size:clamp(20px,2.6vh,26px);color:#FFD54A}
.door .dr{font-size:clamp(44px,7vh,64px);transition:transform .6s}.door.open .dr{transform:perspective(300px) rotateY(-70deg)}
.n6 .opts.keys .o::before{content:'🗝 '}
.tree.jobs button small{display:block;font-size:.42em;line-height:1}
.n6 .tree button{font-size:clamp(44px,6.4vh,66px);width:clamp(96px,11vw,130px);padding:2px 0}.n6 .tree .me{font-size:clamp(36px,5vh,50px)}.n6 .qline{margin:2px 0}
`;
exports.JS = `
/* ══ 四年級 新 25／新 50 的 6 種 全新 遊戲（midterm/_newgames.js）══ */
var NG={n1:1,n2:1,n3:1,n4:1,n5:1,n6:1},NGS=null;
function ngPic(p){var a=String(p).split('|'),w=WHO[a[0]],j=a[1]?JOB[a[1]]:null;return '<span class="pw">'+w[0]+'</span>'+(j?'<span class="pj">'+j[0]+'</span>':'')}
function ngHear(slow){return '<div class="hrow"><button class="hear" id="hear" data-x="hear">🔊 再 聽 一次</button>'+(slow?'<button class="hear slow" id="hslow" data-x="slow">🐢 慢慢 唸</button>':'')+'</div>'}
/* 拼字 泡泡：多 的 2 顆 ＝ 跟 這個 字 的 字母 長得像／聽起來 像（🔒 錯 的 一律 相近）*/
var NEARL={a:['e','o','u'],e:['a','i','o'],i:['e','y','a'],o:['u','a','e'],u:['o','a','e'],b:['d','p'],d:['b','t'],p:['b','q'],t:['d','f'],m:['n','w'],n:['m','h'],r:['l','n'],l:['r','i'],s:['c','z'],c:['k','s'],k:['c','h'],g:['j','q'],h:['n','k'],f:['v','t'],v:['f','w'],w:['v','m'],y:['i','j'],x:['k','z'],j:['g','y'],z:['s','x'],q:['p','g']};
function ngShow(id,q){var h='';NGS={id:id};
  if(id==='n1'){var n=q.o.length;R.aim=Math.floor((n-1)/2);h=ngHear(1)+'<div class="n1" id="n1"><div class="stars"></div>'+R.ord.map(function(i,j){return '<button class="ast'+(q.kind==='S'?' wide':'')+'" data-o="'+i+'" data-c="'+j+'" style="left:'+((j+.5)/n*100)+'%"><b>'+esc(q.o[i])+'</b></button>'}).join('')+
    '<div class="lz" id="lz"></div><div class="ship" id="ship" style="left:'+((R.aim+.5)/n*100)+'%">🚀</div></div><div class="ngc"><button data-x="ngl" aria-label="左">◀</button><button data-x="ngf" class="fire">🔥 發射</button><button data-x="ngr" aria-label="右">▶</button></div>'}
  else if(id==='n2'){R.aim=1;h=ngHear(0)+'<div class="n2" id="n2"><div class="road"></div>'+R.ord.map(function(i,j){return '<button class="lane" data-o="'+i+'" data-c="'+j+'" aria-label="'+esc(q.oz[i])+'">'+ngPic(q.o[i])+'</button>'}).join('')+
    '<div class="car" id="car" style="left:50%">🏎️</div></div><div class="ngc"><button data-x="ngl" aria-label="左">◀</button><button data-x="ngf" class="fire">⬆ 衝！</button><button data-x="ngr" aria-label="右">▶</button></div>'}
  else if(id==='n3')h=ngHear(!q.photo)+'<div class="n3b"><div class="n3w" id="n3w"></div><div class="dpad3"><button data-d="u" aria-label="上">⬆</button><button data-d="l" aria-label="左">⬅</button><button class="dc" disabled>🐍</button><button data-d="r" aria-label="右">➡</button><button data-d="d" aria-label="下">⬇</button></div></div><div class="n3hud" id="n3hud"></div>';
  else if(id==='n4'){R.jh=R.jh||0;h='<div class="n4"><div class="chat" id="chat">'+(q.chat==='A'?'<div class="bub a"><span class="who">A</span>'+esc(q.line)+'</div><div class="bub b q"><span class="who">B</span>？</div>':'<div class="bub a q"><span class="who">A</span>？</div><div class="bub b"><span class="who">B</span>'+esc(q.line)+'</div>')+'</div>'+
    '<div class="cl">'+R.ord.map(function(i){return '<button class="cld" data-o="'+i+'">'+esc(q.o[i])+'</button>'}).join('')+'</div><div class="gr"><div class="roo" id="roo">🥷</div><div class="hm" id="hm">🏔 '+R.jh+' m</div></div></div>'}
  else if(id==='n5'){R.pk=[];var w=q.spell,mid=w.slice(1,-1).split(''),ex=[];mid.forEach(function(c){(NEARL[c]||[]).forEach(function(x){if(ex.length<2&&mid.indexOf(x)<0&&ex.indexOf(x)<0)ex.push(x)})});
    'bcdfghklmnprstvwy'.split('').forEach(function(c){if(ex.length<2&&mid.indexOf(c)<0&&ex.indexOf(c)<0)ex.push(c)});R.tiles=shuf(mid.concat(ex));
    h='<div class="n5"><div class="sp1"><span class="ic">'+q.ic+'</span></div><div class="slots" id="slots"></div><div class="tiles">'+R.tiles.map(function(c,i){return '<button data-t="'+i+'"'+(/[aeiou]/.test(c)?' class="lv"':'')+'>'+c+'</button>'}).join('')+'</div><button class="bk" data-x="bk">⌫ 退 一個</button></div>'}
  else if(id==='n6'){var rk=(R.gk||0)+1;h='<div class="n6"><div class="door" id="door"><span class="dr">🚪</span>第 '+rk+' 道 門 · 選 對 的 鑰匙 🗝</div>'+(q.room==='P'?pasHTML(q.pas)+'<div class="pq">'+esc(q.q.replace(/^📖 /,''))+'</div>'+opts(R.ord,'n3 keys'):
    '<div class="qline">'+esc(q.line)+'</div><div class="tree jobs" id="tree">'+ngT('grandpa','r1')+ngT('grandma','r1b')+'<div class="ln"></div>'+ngT('dad','r2')+ngT('mom','r2b')+'<div class="ln"></div>'+ngT('brother','')+'<div class="me">🙋<small>me</small></div>'+ngT('sister','')+'</div>')+'</div>'}
  return h}
function ngT(w,c){var i=R.q.o.indexOf(w);return '<button class="'+c+'" data-o="'+(i<0?3:i)+'" data-w="'+w+'">'+WHO[w][0]+'<small>'+JOB[R.q.jobs[w]][0]+'</small></button>'}
/* 畫好 以後：貪食蛇 開始；泡泡龍 畫 格子 */
function ngAfter(id){if(id==='n5')drawSp();if(id==='n3')snInit()}
/* 太空船、賽車：左右 移動、發射／衝 */
function ngMove(d){if(!R||R.lock||!NGS)return;var id=R.g.id,n=R.q.o.length;R.aim=Math.max(0,Math.min(n-1,R.aim+d));var x=((R.aim+.5)/n*100)+'%';
  if(id==='n1'){$('#ship').style.left=x;$$('.ast').forEach(function(a){a.classList.toggle('aim',+a.getAttribute('data-c')===R.aim)})}
  if(id==='n2'){$('#car').style.left=x;$$('.lane').forEach(function(a){a.classList.toggle('aim',+a.getAttribute('data-c')===R.aim)})}}
function ngFire(){if(!R||R.lock||!NGS||NGS.busy)return;var id=R.g.id,b=$('#stage [data-c="'+R.aim+'"]');if(!b)return;var i=+b.getAttribute('data-o');NGS.busy=1;tPause();
  if(id==='n1'){var z=$('#lz'),s=$('#ship'),n=$('#n1').getBoundingClientRect(),br=b.getBoundingClientRect(),sr=s.getBoundingClientRect();z.style.left=(br.left+br.width/2-n.left)+'px';z.style.top=(br.bottom-n.top)+'px';z.style.height=Math.max(10,sr.top-br.bottom)+'px';
    z.classList.toggle('big',(R.st||0)>=2);z.classList.remove('on');void z.offsetWidth;z.classList.add('on');later(function(){NGS.busy=0;pick(i)},360)}
  if(id==='n2'){var c=$('#car');c.classList.add('go');later(function(){NGS.busy=0;pick(i);if(i!==0)c.classList.add('spin')},620)}}
/* 點 選項：先 演 動畫 再 算 */
function ngTap(b){var id=R.g.id,i=+b.getAttribute('data-o');
  if(id==='n1'||id==='n2'){var c=+b.getAttribute('data-c');ngMove(c-R.aim);later(ngFire,260);return true}
  if(id==='n4'){var r=$('#roo'),g=$('#stage .n4').getBoundingClientRect(),br=b.getBoundingClientRect();tPause();r.style.left=(br.left+br.width/2-g.left)+'px';r.classList.add('up');
    later(function(){if(i===0){R.jh+=10;var m=$('#hm');if(m)m.textContent='🏔 '+R.jh+' m'}else r.classList.add('fall');pick(i)},480);return true}
  if(id==='n6'&&R.q.room==='T')return false;
  return false}
/* 答對 以後 的 小 動畫（pick 裡 呼叫）*/
function ngOk(id){if(id==='n6'){var d=$('#door');if(d)d.classList.add('open')}if(id==='n3')snStop()}
/* ── 🐍 貪食蛇（2026-11-03 第四十二次 第 6 點 重做：老師「不知道 怎麼 玩、不好 操作、畫面 太 小、不好玩」）──
   ① 每一回 第一次 玩 ＝ 先 演 秒懂 動畫（3 步，倒數 停住，〔⏸️〕〔🔁〕〔🐢〕）② 畫面 變 大：11 ✕ 7 格，一格 最大 110px；答案 卡 2 ✕ 2 格（大、好 點）
   ③ 最 好 操作：**點 答案 ＝ 蛇 自己 衝 過去 吃**；也 可以 ⬆⬇⬅➡（大 搖桿，按住 滑過去 換 方向）、手指 在 草地 上 滑
   ④ 不會 輸：撞 牆 ＝ 從 另一邊 出來、碰到 自己 ＝ 穿 過去（只 有 答錯 才 算 錯）⑤ 好玩：吃 對 ＝ 咬 一口、果實 炸開、蛇 變 長 一節、連 吃 3 個 變 金色 👑、6 個 彩虹 🌈；蛇 有 眼睛、舌頭 */
var SN=null;
function snInit(){var w=$('#n3w'),q=R.q,C=11,Rw=7,st=$('#stage'),pd0=$('#stage .dpad3'),pdW=pd0?pd0.offsetWidth:280,pdH=pd0?pd0.offsetHeight:280,side=innerWidth>=innerHeight*1.05,top=(w.parentNode||w).getBoundingClientRect().top,aw=st.clientWidth-(side?pdW+30:10),ah=innerHeight-top-(side?0:pdH+14)-46,cs=Math.floor(Math.min(aw/C,ah/Rw,110));cs=Math.max(cs,40);   /* 畫面 放得下：橫放 方向鍵 在 右邊、直放 在 下面 */
  w.style.width=C*cs+'px';w.style.height=Rw*cs+'px';w.style.setProperty('--cs',cs+'px');var spots=[[1,1],[8,1],[1,4],[8,4]].slice(0,q.o.length);
  var L=Math.min(9,3+(R.snk||0));SN={C:C,Rw:Rw,cs:cs,len:L,body:[],dir:null,path:null,iv:0,fr:[],eat:0};for(var k=0;k<L;k++)SN.body.push([5,3]);
  w.innerHTML=R.ord.map(function(i,j){var p=spots[j];SN.fr.push({x:p[0],y:p[1],i:i});var o=q.o[i];return '<button class="fr" data-o="'+i+'" style="left:'+(p[0]*cs+4)+'px;top:'+(p[1]*cs+4)+'px;width:'+(2*cs-8)+'px;height:'+(2*cs-8)+'px;animation-delay:'+(j*.15)+'s">'+(q.photo?'<img src="img/'+o+'.jpg" alt="">':'<b>'+esc(o)+'</b>')+'</button>'}).join('')+'<div class="snb" id="snb"></div>';
  snHud();snDraw();var sx,sy;w.onpointerdown=function(e){if(e.target.closest&&e.target.closest('.fr'))return;sx=e.clientX;sy=e.clientY};w.onpointerup=function(e){if(sx==null)return;var dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)+Math.abs(dy)<26)return;snDir(Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u'))};
  var pd=$('#stage .dpad3');if(pd){var pdn=false,pdir=function(e){var b=document.elementFromPoint(e.clientX,e.clientY);b=b&&b.closest?b.closest('[data-d]'):null;if(b)snDir(b.getAttribute('data-d'))};
    pd.onpointerdown=function(e){pdn=true;try{pd.setPointerCapture(e.pointerId)}catch(x){}pdir(e)};pd.onpointermove=function(e){if(pdn)pdir(e)};pd.onpointerup=pd.onpointercancel=function(){pdn=false}}
  var go=function(){SN.iv=setInterval(snStep,window.__SNFAST?40:190)};
  if(R.snHow!==R.x+'|'+(R.t0||'')&&!window.__NOSNH){R.snHow=R.x+'|'+(R.t0||'');snHow(go)}else go()}
function snHud(){var e=$('#n3hud');if(!e)return;var k=R.snk||0;e.innerHTML='🐍 長度 <b>'+SN.len+'</b>　'+(k>=6?'🌈 彩虹 蛇！':k>=3?'👑 金色 蛇！':'連 吃 對 3 個 ➜ 👑 金色 蛇')}
/* 秒懂 動畫：怎麼 玩（第一次）*/
function snHow(done){tPause();var hold=setInterval(function(){if(TM.run)tPause()},80);try{stopSay()}catch(e){}var o=document.createElement('div');o.className='snhow';
  o.innerHTML='<div class="shb"><div class="sht">🐍 英文 貪食蛇：怎麼 玩？</div><div class="shd"><div class="shg"><span class="sf a">🍎</span><span class="sf b">✅</span><span class="ss"><i></i><i></i><i class="h">👀</i></span><span class="sh">👆</span></div>'+
   '<ol class="shs"><li>🔊 <b>聽</b> 一句 英文</li><li>👆 <b>點</b> 對 的 那一張（蛇 自己 衝 過去）<small>也 可以 ⬆⬇⬅➡ 或 手指 滑</small></li><li>😋 <b>吃到</b> 就 送出：吃 對 ＝ 蛇 變 長；連 吃 3 個 ＝ 👑 金色 蛇</li><li>🧱 撞 牆 從 另一邊 出來，<b>不會 輸</b></li></ol></div><div class="shc"></div><button class="shgo" disabled>🔒 看完 才 能 按</button></div>';
  document.body.appendChild(o);var li=o.querySelectorAll('.shs li'),b=o.querySelector('.shgo'),TT=window.ACTL?ACTL.T:function(f,m){return setTimeout(f,m)},D=window.__NOGO?20:1500;
  var run=function(){[].forEach.call(li,function(x){x.classList.remove('on')});b.disabled=true;b.className='shgo';b.textContent='🔒 看完 才 能 按';var g=o.querySelector('.shg');g.classList.remove('go');void g.offsetWidth;g.classList.add('go');
    [].forEach.call(li,function(x,k){TT(function(){x.classList.add('on')},300+k*D)});TT(function(){b.disabled=false;b.className='shgo rdy';b.textContent='▶ 我 懂了，開始！'},300+li.length*D+400)};
  if(window.ACTL)ACTL.on(o.querySelector('.shc'),run);run();
  b.onclick=function(){if(b.disabled)return;clearInterval(hold);if(window.ACTL)ACTL.off();o.remove();tGo();var h=$('#hear');if(h)h.click();done()}}
function snStop(){if(SN){clearInterval(SN.iv);SN.iv=0}}
function snDir(d){if(!SN||!R||R.lock)return;SN.path=null;var op={u:'d',d:'u',l:'r',r:'l'};if(SN.dir&&op[SN.dir]===d&&SN.len>1&&SN.moved)return;SN.dir=d;
  [].forEach.call(document.querySelectorAll('#stage .dpad3 [data-d]'),function(x){x.classList.toggle('on',x.getAttribute('data-d')===d)})}
function snDraw(){var w=$('#n3w');if(!w)return;var k0=R.snk||0,cs=SN.cs,cls=k0>=6?' rb':k0>=3?' gold':'',old=w.querySelectorAll('.sg'),n=SN.body.length;
  while(old.length<n){var e=document.createElement('div');e.className='sg';w.appendChild(e);old=w.querySelectorAll('.sg')}for(var r=old.length-1;r>=n;r--)old[r].remove();old=w.querySelectorAll('.sg');
  SN.body.forEach(function(p,k){var e=old[k],z=k?Math.max(.62,1-k*.04):1,sz=(cs-8)*z;e.className='sg'+(k?'':' hd d'+(SN.dir||'r'))+cls;e.style.width=e.style.height=sz+'px';e.style.left=(p[0]*cs+(cs-sz)/2)+'px';e.style.top=(p[1]*cs+(cs-sz)/2)+'px';e.style.zIndex=50-k;
    if(!k&&!e.firstChild)e.innerHTML='<i class="ey l"></i><i class="ey r"></i><i class="tg"></i>'+(k0>=3?'<b class="cw">👑</b>':'');if(!k){var c=e.querySelector('.cw');if(k0>=3&&!c)e.insertAdjacentHTML('beforeend','<b class="cw">👑</b>')}})}
function snStep(){if(!SN||!R||R.lock||!TM.run)return;var d=SN.dir;if(SN.path&&SN.path.length){var nx=SN.path.shift(),h0=SN.body[0];var dx=nx[0]-h0[0],dy=nx[1]-h0[1];d=Math.abs(dx)>1?(dx>0?'l':'r'):Math.abs(dy)>1?(dy>0?'u':'d'):dx>0?'r':dx<0?'l':dy>0?'d':'u';SN.dir=d}if(!d)return;
  var h=SN.body[0],m={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]}[d],n=[(h[0]+m[0]+SN.C)%SN.C,(h[1]+m[1]+SN.Rw)%SN.Rw];   /* 撞 牆 ＝ 從 另一邊 出來 */
  SN.moved=1;SN.body.unshift(n);SN.body.pop();snDraw();
  var hit=SN.fr.filter(function(f){return n[0]>=f.x&&n[0]<=f.x+1&&n[1]>=f.y&&n[1]<=f.y+1})[0];if(hit){snStop();snEat(hit)}}
/* 吃 ＝ 咬 一口 ➜ 對：果實 炸開＋變 長 一節＋「＋1」；錯：果實 搖 ➜ 答錯頁 */
function snEat(f){var w=$('#n3w'),b=w.querySelector('.fr[data-o="'+f.i+'"]'),hd=w.querySelector('.sg.hd');if(hd)hd.classList.add('bite');tPause();
  if(f.i===0){R.snk=(R.snk||0)+1;if(b)b.classList.add('eat');var bs=$('#snb');if(bs){bs.style.left=((f.x+1)*SN.cs)+'px';bs.style.top=((f.y+1)*SN.cs)+'px';bs.innerHTML='😋 ＋1 節'+(R.snk===3?'<br>👑 金色 蛇！':R.snk===6?'<br>🌈 彩虹 蛇！':'');bs.className='snb on'}
    for(var k=0;k<14;k++){var sp=document.createElement('span');sp.className='snp';sp.textContent=['✨','🌟','💚','⭐'][k%4];sp.style.left=((f.x+1)*SN.cs)+'px';sp.style.top=((f.y+1)*SN.cs)+'px';sp.style.setProperty('--a',(k*360/14)+'deg');w.appendChild(sp)}
    SN.body.push(SN.body[SN.body.length-1].slice());SN.len++;snDraw();snHud();later(function(){pick(0)},window.__SNFAST?60:900)}
  else{if(b)b.classList.add('bad');later(function(){pick(f.i)},window.__SNFAST?60:650)}}
/* 點 答案 ＝ 蛇 自己 找 最近 的 路（可以 穿過 牆、穿過 自己；不 經過 別的 答案）*/
function snGo(i){if(!SN||R.lock)return;var f=SN.fr.filter(function(x){return x.i===i})[0];if(!f)return;var C=SN.C,Rw=SN.Rw,st=SN.body[0],key=function(p){return p[0]+','+p[1]},prev={},Q=[st],seen={},end=null;seen[key(st)]=1;
  var inF=function(p,x){return p[0]>=x.x&&p[0]<=x.x+1&&p[1]>=x.y&&p[1]<=x.y+1};
  while(Q.length){var p=Q.shift();if(inF(p,f)){end=p;break}[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(m){var n=[(p[0]+m[0]+C)%C,(p[1]+m[1]+Rw)%Rw],k=key(n);if(seen[k])return;
    if(SN.fr.some(function(x){return x.i!==i&&inF(n,x)}))return;seen[k]=1;prev[k]=p;Q.push(n)})}
  if(!end)return;var path=[],c=end;while(key(c)!==key(st)){path.unshift(c);c=prev[key(c)]}SN.path=path;var b=$('#n3w .fr[data-o="'+i+'"]');[].forEach.call(document.querySelectorAll('#n3w .fr'),function(x){x.classList.toggle('tgt',x===b)})}
addEventListener('keydown',function(e){if(!R||!R.g||!NG[R.g.id]||R.lock)return;var id=R.g.id,k=e.key;
  if(id==='n3'){var d={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r'}[k];if(d){e.preventDefault();snDir(d)}return}
  if(id==='n1'||id==='n2'){if(k==='ArrowLeft'){e.preventDefault();ngMove(-1)}else if(k==='ArrowRight'){e.preventDefault();ngMove(1)}else if(k===' '||k==='Enter'||k==='ArrowUp'){e.preventDefault();ngFire()}}});
`;
