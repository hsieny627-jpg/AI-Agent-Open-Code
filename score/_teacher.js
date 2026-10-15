/* score/_teacher.js — 老師看板 teacher/index.html 的樣板（score/_build.js 呼叫；不要手改 teacher/index.html）
 *
 * 使用者的決定（sentences/2026-10-07_C_設計與研究清單.md 第四節、Q1～Q18 照建議）：
 *   最上面：年級、班級、期間（本週／上週／這學期全部／自訂）、來源（在校／在家）＋〔⬇ 一鍵下載 Excel〕＋〔🏆 學生排行榜 開／關〕
 *   四個大數字：🎯 正確率、💯 總分、練習次數、👥 有做的人（2026-10-12 D4：⚡、🔁、🚀 看不懂 ➜ 換掉；進步 ＝ 綠色粗箭頭）
 *   五個分頁：👤 個人｜🏆 排行榜｜🏫 班際｜❌ 錯題｜🔔 要關心
 *   密碼：網頁裡沒有，送去 Apps Script 比對（指令碼屬性 TEACHER_PW）；這個分頁關掉就要重新輸入（sessionStorage）
 * 算法全部用 score/_calc.js（跟 Apps Script 同一份）。
 * 2026-10-08 對話 D（使用者第 10 題）：加「類別」篩選（📝 複習題／🎮 遊戲／📘 Review 1）；錯題分析看得到遊戲的題目和選項；
 *   🃏 記憶配對（不算正確率、總分）在個人紀錄裡看配完幾對、用幾秒、翻錯幾次。
 * 2026-10-09（使用者第 5 點）：名單（試算表「名單」分頁：班級｜座號｜姓名，伺服器只在密碼對了才給）➜ 個人、排行榜、要關心、個人紀錄、Excel 都加姓名；
 *   🔔 要關心多「這段期間一次都沒做」；試算表「班級人數」沒填的班，參與率用名單人數。投影的〔📺 全班訂正〕不放姓名。
 * 2026-10-09 E（使用者：老師決定哪些遊戲、什麼時段開放，過了期限就鎖住）：第六個分頁〔📌 任務〕
 *   ➕ 派新任務（名稱、哪幾班＋〔全年級〕、項目＝遊戲／📝 複習題／📘 Review 1／💼 職業單字、從幾月幾日幾點 到 幾月幾日幾點）、
 *   ✏️ 隨時改時間、🗑 刪掉；每個任務一張卡：誰做完 ✅、誰還沒 ⏳（要名單才有名字，E6）。鎖的規則在 _calc.js 的 tkLock。
 */
const HONCSS = require('fs').readFileSync(require('path').join(__dirname, '_honor.css'), 'utf8'), HONRT = require('fs').readFileSync(require('path').join(__dirname, '_honor_rt.js'), 'utf8');
/* 〔🔒 開關〕（2026-10-12 D 第 7 件）：在家複習網站每一個主題（sentences/_review_sites.js） */
const RVS = require('../sentences/_review_sites.js'), RVT = {};
RVS.SITES.forEach(S => { RVT[S.out === 'g3-review' ? 3 : 4] = RVS.topics(S).map(x => ({ k: x.k, grp: x.grp, t: x.t })); });
module.exports = function (CALC, XL, BANK) {
  return `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>老師看板</title>
<!-- 本檔由 score/_build.js 產生，不要手改。 -->
<style>
@font-face{font-family:Andika;font-weight:400;src:url(../words/fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-weight:700;src:url(../words/fonts/andika-700.woff2) format("woff2")}
:root{--bg:#000;--pn:#0B0B0B;--ln:#262626;--tx:#F2F2F2;--dim:#A8A8A8;--acc:#7FBFFF;--gold:#FFD24A;--ok:#5BE39A;--no:#FF7A7A;--bar:#4D8FCC}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;background:var(--bg);color:var(--tx);font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif}
body{padding:calc(env(safe-area-inset-top) + 12px) 16px calc(env(safe-area-inset-bottom) + 24px)}
button,select,input{font-family:inherit;font-size:clamp(18px,1.45vw,26px);color:var(--tx)}
button{background:#1A1A1A;border:2px solid #3A3A3A;border-radius:999px;padding:9px 20px;min-height:52px;cursor:pointer;font-weight:700}
button:active{transform:scale(.97)}
button.on{background:#0F2236;border-color:var(--acc)}
select,input{background:#141414;border:2px solid #3A3A3A;border-radius:12px;padding:8px 10px;min-height:52px}
h1{margin:0;font-size:clamp(28px,3vw,44px)}
#login{max-width:620px;margin:10vh auto 0;display:flex;flex-direction:column;gap:20px;align-items:center;text-align:center}
#login h1{font-size:clamp(36px,5vw,52px)}
#login .note{font-size:24px;color:#CFE3F5;margin:0}
#login input{font-size:40px;text-align:center;width:100%;letter-spacing:.25em;min-height:72px;border-radius:16px}
#login button{font-size:32px;padding:14px 56px;background:#0F3323;border-color:var(--ok);min-height:72px}
#rmb{display:flex;align-items:center;gap:12px;font-size:26px;font-weight:700;cursor:pointer;color:#FFE9A8}
#rmb input{width:34px;height:34px;min-height:0;accent-color:#E8A900;margin:0}
#rmb em{font-style:normal;display:block;font-size:20px;color:var(--dim);font-weight:400}
#lmsg{min-height:1.4em;color:var(--no);font-weight:700;font-size:26px}
#out{border-color:#7A3A3A}
#app[hidden],#login[hidden]{display:none}
.top{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:12px}
.top .sp{flex:1}
.grp{display:inline-flex;gap:6px;flex-wrap:wrap;align-items:center}
.grp>span{color:#CFCFCF;font-weight:700;font-size:clamp(18px,1.45vw,26px)}
#dl{background:#2A2208;border-color:var(--gold);color:#FFE9A8}
#zm{display:inline-flex;gap:4px}#zm button{min-width:60px;padding:6px 10px}
.tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:8px 0 12px}
.tile{background:var(--pn);border:1px solid var(--ln);border-radius:18px;padding:12px 16px}
.tile .k{color:#E6E6E6;font-weight:700;font-size:clamp(20px,1.8vw,30px)}
.tile .v{font-size:clamp(44px,4.8vw,72px);font-weight:700;line-height:1.1}
.tile .d{color:#BDBDBD;font-size:clamp(16px,1.3vw,24px)}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.tabs button{font-size:clamp(20px,1.75vw,30px);padding:10px 24px;min-height:60px}
.tabs button.on{background:#2A2208;border-color:var(--gold);color:#FFE9A8}
.pane{background:var(--pn);border:1px solid var(--ln);border-radius:18px;padding:14px}
.note{color:#C8C8C8;font-size:clamp(18px,1.35vw,24px);margin:6px 0;line-height:1.5}
.tw{overflow-x:auto;-webkit-overflow-scrolling:touch}
table{border-collapse:collapse;width:100%;font-size:clamp(19px,1.5vw,28px)}
th,td{padding:10px 12px;border-bottom:1px solid #262626;text-align:right;white-space:nowrap}
th{position:sticky;top:0;background:#151515;color:#DDD;cursor:pointer;user-select:none}
th:first-child,td:first-child{text-align:left}
th.s{background:#3A2E08;color:#FFE9A8;box-shadow:inset 0 -4px 0 var(--gold)}
th small{display:block;font-size:.62em;color:var(--gold);font-weight:700}
tr.row{cursor:pointer}tr.row:hover td,tr.row:active td{background:#141A20}
td .mb{display:inline-block;height:.55em;border-radius:6px;background:var(--bar);vertical-align:middle;margin-left:8px}
td.lo{color:var(--no)}
.bars{display:flex;flex-direction:column;gap:8px;margin:6px 0 18px}
.br{display:grid;grid-template-columns:minmax(9em,13em) 1fr 6.5em;gap:12px;align-items:center;font-size:clamp(19px,1.5vw,28px);font-weight:700}
.br .t{height:1.2em;background:#141414;border-radius:6px;overflow:hidden}
.br .t i{display:block;height:100%;background:var(--bar);border-radius:0 4px 4px 0}
.br.hi .t i{background:var(--gold)}.br.ok .t i{background:var(--ok)}.br.no .t i{background:var(--no)}
.br .v{text-align:right;color:#DDD}
.br .l{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
h3{margin:18px 0 8px;font-size:clamp(22px,1.8vw,32px)}
/* 2026-10-12 D 第 5 件：🔔 要關心 一班一張表、照座號一格一格 */
.klg{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:8px 0 4px}
.klg .kx{font-size:clamp(18px,1.35vw,24px);color:#C8C8C8}
.kp{display:inline-flex;gap:6px;align-items:center;border-radius:999px;padding:4px 14px;font-size:clamp(19px,1.5vw,28px);border:2px solid #333;background:#111}
.kp.no{border-color:#FF6B6B}.kp.md{border-color:#FFD24A}.kp.ok{border-color:#3BD16F}.kp.nd{border-color:#666}
.kcls h3{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:22px 0 10px;font-size:clamp(26px,2.2vw,40px)}
.kct{display:flex;flex-wrap:wrap;gap:8px}
.kg{display:grid;grid-template-columns:repeat(auto-fill,minmax(8.4em,1fr));gap:10px;font-size:clamp(20px,1.6vw,30px)}
.kc{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;padding:10px 12px;border-radius:14px;border:3px solid #333;background:#121212;
  font-size:1em;min-height:52px;min-width:0;color:#fff;cursor:pointer;animation:kin .35s ease-out both}
.kc b{font-size:1.1em;letter-spacing:.02em}.kc .kn{font-size:1em;color:#F2F2F2}.kc .kw{font-size:.85em;color:#DDD;white-space:nowrap}
.kc.no{border-color:#FF6B6B;background:#2A1010;animation:kin .35s ease-out both,kbl 1.6s ease-in-out .6s infinite}
.kc.md{border-color:#FFD24A;background:#2A2208}.kc.ok{border-color:#3BD16F;background:#0D1F14}.kc.nd{border-color:#555;background:#161616;color:#BBB}
.kc.nd .kn{color:#BBB}
@keyframes kin{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}
@keyframes kbl{50%{box-shadow:0 0 0 4px rgba(255,107,107,.45)}}
@media (prefers-reduced-motion:reduce){.kc,.kc.no{animation:none}}
/* 2026-10-15 D 第 8 件：格子多一行「❤獎牌 用心 87」｜老師 D12 ⑥：〔📊 圖表分析〕全班整體＋個人（要關心的排最前面） */
.kc .kh{font-size:.85em;color:#FFD0DA;white-space:nowrap;display:flex;align-items:center;gap:4px}.kc .kh svg{height:1.3em;width:auto}
.kmd{display:flex;flex-wrap:wrap;gap:10px;margin:6px 0}.kmd button{font-size:clamp(20px,1.6vw,30px)}.kmd button.on{background:#2A2208;border-color:var(--gold)}
.ka4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:6px 0 10px}
.ka4 div{background:#101418;border:2px solid #263038;border-radius:16px;padding:8px;text-align:center;font-size:clamp(19px,1.5vw,26px)}
.ka4 b{display:block;font-size:clamp(34px,3vw,54px);line-height:1.15}.ka4 svg{height:1.2em;width:auto;vertical-align:middle}
.kst{display:flex;height:clamp(44px,3.6vw,60px);border-radius:14px;overflow:hidden;margin:4px 0 10px;font-size:clamp(20px,1.6vw,28px);font-weight:700}
.kst span{display:flex;align-items:center;justify-content:center;min-width:0;white-space:nowrap;animation:kgrow 1s ease-out backwards}
.kst .no{background:#7A1E1E}.kst .md{background:#6E5A10}.kst .ok{background:#1A5A32}.kst .nd{background:#3A3A3A}
@keyframes kgrow{from{flex-grow:0}}
.kc5{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:4px 0 12px}
.kc5 div{background:#101418;border:2px solid #263038;border-radius:14px;padding:6px;text-align:center;font-size:clamp(18px,1.35vw,24px);line-height:1.25}
.kc5 div.wk{border-color:var(--gold);background:#2A2208}.kc5 .ci{display:flex;justify-content:center;height:clamp(34px,2.8vw,48px);font-size:clamp(30px,2.4vw,42px)}.kc5 .ci svg{height:100%;width:auto}
.kc5 .t{height:.7em;background:#1A2230;border-radius:6px;overflow:hidden;margin:4px 0}.kc5 .t i{display:block;height:100%;animation:grow 1.2s ease-out backwards}
.kgh{font-size:clamp(22px,1.8vw,32px);font-weight:700;margin:12px 0 4px}
.kr{display:grid;grid-template-columns:minmax(7.5em,1.2fr) minmax(0,1.4fr) 5.6em 5.2em minmax(0,1.6fr);gap:10px;align-items:center;width:100%;text-align:left;padding:8px 12px;margin:6px 0;border-radius:14px;
  border:3px solid #333;background:#121212;color:#fff;font-size:clamp(20px,1.6vw,28px);cursor:pointer;animation:kin .35s ease-out both}
.kr.no{border-color:#FF6B6B;background:#2A1010}.kr.md{border-color:#FFD24A;background:#221C08}.kr.ok{border-color:#3BD16F;background:#0D1F14}.kr.nd{border-color:#555;background:#161616;color:#CCC}
.kr .t{height:.9em;background:#1A1A1A;border-radius:6px;overflow:hidden;position:relative}.kr .t i{display:block;height:100%;animation:grow 1.2s ease-out backwards}
.kr .kh2{display:flex;align-items:center;gap:4px;white-space:nowrap}.kr .kh2 svg{height:1.3em;width:auto}
.kr small{color:#DDD;font-size:.85em}
.kr.kth{background:none;border-color:transparent;cursor:default;animation:none;color:#BDBDBD;padding-top:0;padding-bottom:0}.kr.kth svg{height:1.2em;width:auto;vertical-align:middle}
@media (max-width:1100px){.ka4,.kc5{grid-template-columns:repeat(2,minmax(0,1fr))}.kr{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
/* 成績卡的 ❤ 用心程度 */
.pcare{margin:12px 0}
.wq{display:grid;grid-template-columns:2.2em 1fr 13em;gap:10px;align-items:center;padding:12px;border:2px solid #262626;border-radius:16px;margin-bottom:10px;cursor:pointer;font-size:clamp(21px,1.8vw,34px)}
.wq:active{background:#141A20}
.wq .n{font-size:1.3em;font-weight:700;color:var(--gold);text-align:center}
.wq .q{min-width:0}.wq .q b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wq .q em{font-style:normal;color:#BDBDBD;font-size:.78em}
.wq .r .t{height:14px;background:#141414;border-radius:6px;overflow:hidden}.wq .r .t i{display:block;height:100%;background:var(--no)}
.wq .r span{font-weight:700}
#modal{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.86);display:none;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto}
#modal.on{display:flex}
#mbox{background:#0B0B0B;border:1px solid #333;border-radius:20px;padding:16px;width:min(900px,100%);margin:auto 0}
#mbox .x{float:right}
.opt{display:grid;grid-template-columns:2.2em 1fr 8em;gap:10px;align-items:center;font-size:clamp(22px,2vw,36px);font-weight:700;margin:8px 0}
.opt .t{height:24px;background:#141414;border-radius:6px;overflow:hidden}.opt .t i{display:block;height:100%;background:#555}
.opt.ok .t i{background:var(--ok)}.opt.mis .t i{background:var(--no)}
.opt .w{grid-column:2/4;font-size:.8em}
.lsb,.ob{background:#0F2A40;border-color:#7FD4FF}
.why{background:#141A20;border:1px solid #2A3A4A;border-radius:14px;padding:10px 14px;font-size:clamp(20px,1.5vw,28px);margin:10px 0}
#show{position:fixed;inset:0;z-index:60;background:#000;display:none;flex-direction:column;align-items:center;justify-content:center;gap:1.6vh;padding:2vh 3vw;text-align:center;overflow:auto}
/* ❌ 錯題分析（2026-10-15 D 第 9 件，第三批 四-3、四-4、D18 A）：一步一步（① 想一想 ➜ ② 大家選什麼 ➜ ③ 錯在哪裡 ➜ ④ 正確答案）、字放大到最後一排看得到 */
#show .sst{display:flex;gap:1vw;flex-wrap:wrap;justify-content:center}
#show .sst span{border:3px solid #333;border-radius:999px;padding:.3vh 1.2vw;font-size:clamp(18px,min(2.8vh,2.4vw),32px);color:#9A9A9A}
#show .sst span.on{border-color:var(--gold);color:#000;background:var(--gold);font-weight:700;animation:sstp .6s}
#show .sst span.dn{border-color:#3BD16F;color:#9FF0B8}
@keyframes sstp{50%{transform:scale(1.15)}}
#show .sl{display:flex;gap:1.4vw;align-items:center;justify-content:center;flex-wrap:wrap}
#show .sl button{font-size:clamp(26px,4.4vh,48px);padding:1vh 2.4vw;background:#0F2A40;border-color:#7FD4FF}
#show .sl .shw{font-size:clamp(36px,min(7vh,6vw),96px);font-weight:700;color:#FFE07A}
#show .sth{font-size:clamp(24px,min(4.6vh,3.8vw),52px);font-weight:700;color:#FFE07A;min-height:1.2em}
#show .sth .em{display:inline-block;animation:sbob 1.2s ease-in-out infinite}
@keyframes sbob{50%{transform:translateY(-12px) rotate(-8deg)}}
#show .stm{width:min(900px,80vw);height:16px;background:#1A1A1A;border-radius:999px;overflow:hidden}#show .stm i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#3BD16F,#FFD24A,#FF6B6B);transform-origin:left;animation:stm 10s linear forwards}
@keyframes stm{to{transform:scaleX(0)}}
#show .so div{position:relative;transition:opacity .5s,transform .5s,box-shadow .5s}
#show .so .pb{height:clamp(16px,2.4vh,26px);background:#1A1A1A;border-radius:8px;overflow:hidden}#show .so .pb i{display:block;height:100%;background:#7FBFFF;width:0;transition:width 1.4s ease-out}
#show .so div.mis .pb i{background:#FF6B6B}#show .so div.ok .pb i{background:#3BD16F}
#show .so div.dim{opacity:.35;transform:scale(.96)}
#show .so div.mis.go{animation:sshk .6s 2;box-shadow:0 0 0 6px rgba(255,107,107,.45)}
@keyframes sshk{25%{transform:translateX(-12px)}75%{transform:translateX(12px)}}
#show .so div.ok.go{box-shadow:0 0 30px 8px rgba(59,209,111,.65);transform:scale(1.04)}
#show .so .lb{font-size:.62em;color:#FFB0B0}#show .so div.ok .lb{color:#9FF0B8}
#show .so .ob{font-size:.8em;padding:.4vh 1vw;margin-right:.6vw}
#show .sans{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:.4vh 1.6vw;transition:transform .35s,filter .35s}
#show .sans span{display:flex;flex-direction:column;align-items:center}
#show .sans b{font-size:clamp(44px,min(9vh,7vw),110px);line-height:1.1;color:#E8FFF0}
#show .sans i{font-style:normal;font-size:clamp(22px,min(3.8vh,3.2vw),46px);color:#FFE07A;min-height:1.2em}
#show .sans.big{transform:scale(1.12);filter:brightness(1.5) drop-shadow(0 0 22px rgba(120,255,170,.9))}
#show .saz{font-size:clamp(24px,min(4.2vh,3.4vw),50px);color:#CFE3F5}
#show .sw .ck{display:inline-block;animation:sstp .6s}
#show.on{display:flex}
#show .sq{font-size:clamp(28px,min(6.4vh,5vw),80px);font-weight:700;line-height:1.3}
#show .so{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.4vh 1.6vw;width:min(1400px,94vw)}
#show .so div{background:#121212;border:3px solid #333;border-radius:22px;padding:1.2vh 1.6vw;font-size:clamp(24px,min(4.6vh,3.8vw),56px);font-weight:700;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6vh 1vw}
#show .so .pb{flex:1 1 100%}#show .so.cp div{font-size:clamp(20px,min(3vh,2.6vw),36px);padding:.6vh 1.2vw}#show .so.cp .pb{display:none}
#show .so div.ok{border-color:var(--ok);background:#0F3323}#show .so div.mis{border-color:var(--no)}
#show .so .pc{font-size:.7em;color:var(--gold)}
#show .sw{font-size:clamp(22px,min(3.6vh,3vw),44px);color:#CFE3F5;max-width:1500px}
#show .sb{display:flex;gap:14px}
#show .sb button{font-size:clamp(22px,min(3.4vh,2.8vw),38px);padding:10px 26px}
.svgl{width:100%;height:120px;background:#0E0E0E;border-radius:10px}
.att{font-size:clamp(17px,1.3vw,24px)}.att td,.att th{padding:6px 10px}
.att tr.void td{color:#666;text-decoration:line-through}
.att button{min-height:44px;padding:4px 14px;font-size:.9em}
.tk{border:2px solid #2A2A2A;border-radius:18px;padding:12px 14px;margin:0 0 12px}
/* 〔🔒 開關〕（D 第 7 件） */
.lkrow{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.lkrow button.on{background:#10240F;border-color:var(--ok)}
.lkgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:10px}
.lkb{display:flex;align-items:center;gap:10px;text-align:left;min-height:64px;flex-wrap:wrap}.lkb .lki{font-size:1.3em}.lkb .lkt{flex:1;min-width:0}.lkb em{font-style:normal;width:100%;font-size:.8em;color:#FFE9A8}
button.lkg,b.lkg{background:#0F3323!important;border-color:#3BD16F!important;color:#D7FBE4!important}
button.lkr,b.lkr{background:#3A0E0E!important;border-color:#FF6B6B!important;color:#FFD6D2!important}
button.lky{background:#3A3000!important;border-color:#FFD54A!important;color:#FFF3C4!important}
b.lkg,b.lkr{padding:0 8px;border:2px solid;border-radius:10px}
.lkh{margin:14px 0 6px}#lkmsg{font-weight:700;color:#7EE2A8}
.tk.on{border-color:var(--gold);background:#141006}.tk.end{opacity:.75}
.tk h3{margin:0 0 6px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.tk .st{font-size:clamp(17px,1.3vw,24px);border-radius:999px;padding:3px 12px;background:#1A1A1A;border:1px solid #444}
.tk.on .st{background:#2A2208;border-color:var(--gold);color:#FFE9A8}
.tk .tm{font-size:clamp(20px,1.5vw,28px);font-weight:700;color:#FFE9A8;margin:2px 0 6px}
.tk .it{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 8px}.tk .it span{background:#141A20;border:1px solid #2A3A4A;border-radius:10px;padding:3px 10px;font-size:clamp(17px,1.3vw,24px)}
.tk .who{display:flex;flex-wrap:wrap;gap:6px;font-size:clamp(17px,1.3vw,24px);margin:4px 0}.tk .who span{border-radius:10px;padding:3px 9px;background:#1A1A1A}
.tk .who span.ok{background:#0F3323;color:var(--ok)}.tk .who span.no{background:#2A1414;color:#FFB0B0}
.tk .bt{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
#tkf label{display:inline-flex;align-items:center;gap:6px;font-size:clamp(19px,1.4vw,26px);margin:4px 12px 4px 0;cursor:pointer}
#tkf input[type=checkbox]{width:24px;height:24px}
#tkf h4{margin:14px 0 4px;font-size:clamp(20px,1.6vw,28px);color:var(--gold)}
#tkf .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
#tkf input[type=text],#tkf input[type=datetime-local]{font-size:clamp(19px,1.5vw,26px)}
#tkf .gl{border:1px solid #222;border-radius:12px;padding:6px 10px;margin:6px 0;max-height:36vh;overflow-y:auto}
#tkf .gl b{display:block;margin:6px 0 2px;color:#DDD}
#tkmsg{color:var(--no);font-weight:700;min-height:1.3em;font-size:clamp(19px,1.5vw,26px)}
/* 2026-10-12 D4：進步 ＝ 綠色粗箭頭（自己畫的 SVG，每一台電腦都一樣）；燈號 */
.ua{width:.9em;height:1.05em;vertical-align:-.14em}
.lt{font-size:1.15em}
td.nmc{text-align:left}td.nmc b{color:#9FB4C8;margin-right:.4em}
/* 2026-10-12 D 第 3 件：點一個人 ＝ 秒懂成績卡 */
#mbox{width:min(1100px,100%)}
#mbox h3{font-size:clamp(24px,2vw,34px)}
#mbox .note{font-size:clamp(18px,1.45vw,26px)}
#mbox h3.ph{font-size:clamp(30px,2.6vw,44px);margin-top:4px}
.pc4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:10px 0}
.pg{background:#101418;border:2px solid #263038;border-radius:18px;padding:10px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px}
.pk{font-size:clamp(20px,1.7vw,30px);font-weight:700;color:#E6E6E6}
.ring{width:clamp(120px,11vw,170px);height:clamp(120px,11vw,170px)}
.ring circle{fill:none;stroke-width:14}.ring .bg{stroke:#24292E}
.ring .fg{stroke-linecap:round;stroke-dasharray:314;stroke-dashoffset:314;transform:rotate(-90deg);transform-origin:60px 60px;animation:ring 1.6s ease-out forwards}
@keyframes ring{to{stroke-dashoffset:var(--o)}}
.ring text{fill:#fff;font-size:32px;font-weight:700;text-anchor:middle;dominant-baseline:central}
.pn{font-size:clamp(44px,4.4vw,70px);font-weight:700;line-height:1.1}
.sq{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:15em;font-size:clamp(18px,1.4vw,24px)}
.sq i{width:1.15em;height:1.15em;border-radius:5px;background:#3BD16F;animation:sqin .35s backwards}
@keyframes sqin{from{transform:scale(0)}}
.pv{font-size:clamp(56px,5vw,84px);line-height:1.1}
.pv.up .ua{width:.8em;height:1em;animation:upk 1.2s ease-in-out infinite}
@keyframes upk{50%{transform:translateY(-12px)}}
.pd{font-size:clamp(19px,1.5vw,26px);color:#DDD;line-height:1.35}
.hl{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.sb2{display:grid;grid-template-columns:minmax(0,1fr) 30% 2.4em;gap:10px;align-items:center;font-size:clamp(19px,1.5vw,26px);font-weight:700;margin:6px 0}
.sb2 .sl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb2 .t{height:1em;background:#141414;border-radius:6px;overflow:hidden}.sb2 .t i{display:block;height:100%;border-radius:6px;animation:grow 1.2s ease-out backwards}
@keyframes grow{from{width:0!important}}
.sb2 b{text-align:right}
.cal{display:flex;flex-direction:column;gap:8px}
.cw{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}
.cw span{background:#15191E;border:2px solid #232A31;border-radius:14px;min-height:3.6em;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:clamp(19px,1.5vw,26px);line-height:1.2}
.cw span small{font-size:.8em;color:#BDBDBD}
.cw span.on{background:#0F3323;border-color:#3BD16F}.cw span.td{box-shadow:0 0 0 3px var(--gold)}
.pcn{display:flex;align-items:center;gap:12px;justify-content:center;font-size:clamp(20px,1.6vw,28px)}
.pcn b{flex:1;text-align:center}.pcn small{display:block;color:#BDBDBD;font-size:.8em}
.pcn button{font-size:clamp(24px,2vw,34px);min-width:72px}
.pcl{width:100%;height:auto;background:#0E0E0E;border-radius:14px;margin-top:8px}
.pcl .pl{stroke-dasharray:3000;stroke-dashoffset:3000;animation:dr 1.4s ease-out forwards}@keyframes dr{to{stroke-dashoffset:0}}
.pcl .pv2{fill:#fff;font-size:26px;font-weight:700;text-anchor:middle}.pcl .ax{fill:#BDBDBD;font-size:20px}
.pw{border:2px solid #2A2020;border-radius:16px;padding:10px 14px;margin:8px 0;font-size:clamp(20px,1.6vw,28px)}
.pq{font-weight:700}.pq em{display:block;font-style:normal;font-weight:400;color:#BDBDBD;font-size:.8em}
.pa{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}.pa span{border-radius:12px;padding:4px 14px;font-weight:700}
.pa .no{background:#2A1414;color:#FFB0B0}.pa .ok{background:#0F3323;color:var(--ok)}
.pdb{margin-top:18px;width:100%;background:#141A20;border-color:#2A3A4A}
@media (max-width:900px){.pc4{grid-template-columns:repeat(2,minmax(0,1fr))}.hl{grid-template-columns:1fr}}
/* 2026-10-12 D 第 4 件：🏆 榮譽榜（投影） */
.hh{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.bic{display:inline-flex;vertical-align:middle;margin-right:4px}.bic svg{height:1.25em;width:auto}
.hbtn{background:linear-gradient(#FFE07A,#E8A900);color:#2A1A00;border-color:#5A4300;font-size:clamp(20px,1.6vw,28px);box-shadow:0 0 18px #FFD54A66}
#honov{position:fixed;inset:0;z-index:70;background:#000;display:none;flex-direction:column;gap:8px;padding:8px}
#honov.on{display:flex}
#honst{--hh:calc(100vh - 96px);flex:1;border-radius:18px}
#honst .htit{font-size:clamp(40px,7.5vh,104px)}#honst .hkick{font-size:clamp(26px,4.2vh,48px)}#honst .hsub{font-size:clamp(24px,4vh,46px)}
#honst .hhero{font-size:clamp(90px,17vh,210px)}#honst .hcard .hn{font-size:clamp(30px,5vh,60px)}#honst .hcard .hw{font-size:clamp(30px,5.2vh,64px)}#honst .hcard .hl{font-size:clamp(22px,3.6vh,40px)}
#honst .hr{font-size:clamp(26px,4.4vh,52px)}#honst .hpod .nm{font-size:clamp(28px,5vh,60px)}
#hctl{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center}
#hctl button{font-size:clamp(18px,1.4vw,24px);min-height:52px;padding:6px 16px}
#hctl #hpg{font-size:clamp(18px,1.4vw,24px);color:#BDBDBD;font-weight:700}
#hctl #hx{border-color:#7A3A3A}
#prt{display:none}
@media print{body>*{display:none!important}#prt{display:block!important}body{background:#fff!important;padding:0}
 .cert{font-family:"標楷體","DFKai-SB","BiauKai","Kaiti TC","STKaiti","KaiTi","AR PL UKai TW","TW-Kai",serif;page-break-after:always;break-after:page;height:180mm;border:6mm double #B8860B;border-radius:6mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8mm;color:#2A1A00;text-align:center;padding:10mm}
 .cert .ct{font-size:20mm;font-weight:700;color:#8A5A00}.cert .cw{font-size:24mm;font-weight:700}.cert .ca{font-size:14mm;font-weight:700;color:#B8261F}.cert .cl{font-size:11mm}.cert .cd{font-size:7mm;color:#555}}
@page{size:A4 landscape;margin:12mm}
${HONCSS}
@media (max-width:900px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}.wq{grid-template-columns:2em 1fr}.wq .r{grid-column:2}}
</style></head><body>
<div id="login"><h1>👩‍🏫 老師看板</h1><div class="note">🔑 輸入老師密碼</div>
 <input id="pw" type="password" inputmode="numeric" autocomplete="current-password" aria-label="密碼">
 <label id="rmb"><input type="checkbox" id="rm"><span>這台電腦記住我（7 天）<em>只在老師自己的電腦勾；教室公用電腦不要勾</em></span></label>
 <button id="go">🔓 進入</button><div id="lmsg"></div></div>
<div id="app" hidden>
 <div class="top"><h1>👩‍🏫 老師看板</h1><span class="sp"></span>
  <button id="bd">🏆 學生排行榜：開</button><button id="rf">🔄 重新整理</button><span id="zm"><button id="zo" aria-label="字變小">A－</button><button id="zi" aria-label="字變大">A＋</button></span><button id="dl">⬇ 一鍵下載 Excel</button><button id="out">👋 登出</button></div>
 <div class="top">
  <span class="grp" id="fg"><button data-g="3" class="on">三年級</button><button data-g="4">四年級</button></span>
  <span class="grp"><span>班級</span><select id="fc"></select></span>
  <span class="grp"><span>期間</span><select id="fp"><option value="w">本週</option><option value="lw">上週</option><option value="all">這學期全部</option><option value="c">自訂日期</option></select>
   <input type="date" id="f1" hidden><input type="date" id="f2" hidden></span>
  <span class="grp"><span>類別</span><select id="fk"><option value="">全部</option><option value="tq">📝 複習題</option><option value="game">🎮 遊戲</option><option value="r1">📘 Review 1</option></select></span>
  <span class="grp"><span>來源</span><select id="fs"><option value="">全部</option><option value="school">🏫 在校</option><option value="home">🏠 在家</option></select></span>
 </div>
 <div class="tiles" id="tiles"></div>
 <div class="tabs" id="tabs"><button data-t="p" class="on">👤 個人</button><button data-t="b">🏆 排行榜</button><button data-t="c">🏫 班際</button><button data-t="w">❌ 錯題</button><button data-t="k">🔔 要關心</button><button data-t="t">📌 任務</button><button data-t="l">🔒 開關</button></div>
 <div class="pane" id="pane"></div>
</div>
<div id="modal"><div id="mbox"></div></div>
<div id="show"></div>
<div id="honov"><div class="hon" id="honst"></div><div id="hctl"><button id="hre">⏮ 重來</button><button id="hpv">◀</button><span id="hpg"></span><button id="hnx">▶ 下一幕</button>
 <button id="hsd">🔊 聲音：開</button><button id="hnmb">👤 姓名：顯示</button><button id="hpr">🖨 印獎狀</button><button id="hx">✕ 關閉</button></div></div>
<div id="prt"></div>
<script src="../score/url.js"></script>
<script>
${CALC}
${XL}
${HONRT}
var BANK=${JSON.stringify(BANK)};
var RVT=${JSON.stringify(RVT)};
/* 2026-10-12 D4-A／F1：🎯 正確率、💯 總分、練習次數（圖示等使用者選：G1；CNTIC 空白 ＝ 只寫字）、綠色粗箭頭 ＝ 進步、🥇 本班名次、⚠️ 太快亂按 */
var UA='<svg class="ua" viewBox="0 0 40 48" aria-hidden="true"><path d="M20 2 L38 22 H27 V46 H13 V22 H2 Z" fill="#3BD16F" stroke="#0B3D1E" stroke-width="2" stroke-linejoin="round"/></svg>',CNTIC='';
var URL0=String(window.SCORE_URL||'').trim(),PW='',DATA=null,ALL=[],SIZES={},NM={},RCLS={},F={g:3,cls:'',p:'w',src:'',cat:''},TAB='p',SORT={k:'acc',d:1},BT='sec',BS='grade';
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function f1(v){return v==null?'—':(Math.round(v*10)/10)}
function post(o){return fetch(URL0,{method:'POST',body:JSON.stringify(o)}).then(function(r){return r.json()})}
/* 2026-10-12 D3-A：勾「這台電腦記住我（7 天）」才存在這台電腦（localStorage，7 天後自動失效）；沒勾 ＝ 分頁關掉就要重打（sessionStorage）。〔🚪 登出〕兩個都清掉 */
/* 2026-10-12 D5：〔A－〕〔A＋〕整個看板放大縮小（0.8～1.6 倍，記在這台電腦） */
function zoom(d){var z=1;try{z=+localStorage.getItem('tzoom')||1}catch(e){}z=Math.max(.8,Math.min(1.6,Math.round((z+d)*10)/10));try{localStorage.setItem('tzoom',z)}catch(e){}$('#app').style.zoom=z}
function forget(){try{sessionStorage.removeItem('tpw');localStorage.removeItem('tpw7')}catch(e){}}
function remembered(){try{var r=JSON.parse(localStorage.getItem('tpw7')||'null');if(r&&r.p&&r.x>Date.now())return r.p;localStorage.removeItem('tpw7')}catch(e){}return ''}
function login(pw){
  $('#lmsg').textContent='⏳ 讀取中…';
  if(!URL0){$('#lmsg').textContent='還沒有貼上 Apps Script 網址（score/url.js）';return}
  post({a:'teacher',pw:pw}).then(function(j){
    if(j.err==='pw'){$('#lmsg').textContent='❌ 密碼不對';forget();return}
    if(j.err){$('#lmsg').textContent='❌ 伺服器：'+(j.msg||j.err);return}
    PW=pw;try{sessionStorage.setItem('tpw',pw);if($('#rm').checked)localStorage.setItem('tpw7',JSON.stringify({p:pw,x:Date.now()+7*864e5}))}catch(e){}
    load(j);$('#login').hidden=true;$('#app').hidden=false;
  },function(){$('#lmsg').textContent='📶 連不到伺服器，請檢查網路'});
}
/* 名單：5 碼 ➜ 姓名；試算表「班級人數」沒填的班，用名單人數 */
function nm(id){return NM[id]||''}
function who(id){var n=nm(id);return esc(id)+(n?' '+esc(n):'')}
function load(j){DATA=j;NM={};RCLS={};(j.roster||[]).forEach(function(r){var id=r[0]+(r[1]<10?'0':'')+r[1];NM[id]=r[2];(RCLS[r[0]]=RCLS[r[0]]||[]).push(id)});
  SIZES={};var sz=j.sizes||{};Object.keys(RCLS).forEach(function(c){SIZES[c]=RCLS[c].length});Object.keys(sz).forEach(function(c){if(+sz[c]>0)SIZES[c]=+sz[c]});
  ALL=j.rows.map(SC.fromRow).filter(function(r){return r.id&&!isNaN(r.t)});
  $('#bd').textContent='🏆 學生排行榜：'+(j.boards?'開':'關');$('#bd').classList.toggle('on',!!j.boards);clsSel();draw()}
function clsSel(){$('#fc').innerHTML='<option value="">全部班</option>'+SC.CLASSES[F.g].map(function(c){return '<option value="'+c+'"'+(F.cls===c?' selected':'')+'>'+SC.cname(c)+'</option>'}).join('')}
function range(){var now=DATA.now,w=SC.weekStart(now);
  if(F.p==='w')return{from:w,to:null};if(F.p==='lw')return{from:w-7*864e5,to:w};if(F.p==='all')return{from:null,to:null};
  var a=$('#f1').value,b=$('#f2').value;return{from:a?Date.parse(a+'T00:00:00+08:00'):null,to:b?Date.parse(b+'T00:00:00+08:00')+864e5:null}}
function sets(){var r=range(),G=SC.pick(ALL,{g:F.g,from:r.from,to:r.to,src:F.src,cat:F.cat}),C=F.cls?G.filter(function(x){return x.cls===F.cls}):G;return{G:G,C:C}}
/* 名次：班內（每班自己排）、全年級 */
function ranks(psG){var R={};['acc','s','count','prog'].forEach(function(k){
  SC.rank(psG,k).forEach(function(x){(R[x.id]=R[x.id]||{})['g'+k]=x.rk});
  SC.CLASSES[F.g].forEach(function(c){SC.rank(psG.filter(function(p){return p.cls===c}),k).forEach(function(x){(R[x.id]=R[x.id]||{})['c'+k]=x.rk})})});return R}
function draw(){
  var S=sets(),psG=SC.students(S.G),ps=F.cls?psG.filter(function(p){return p.cls===F.cls}):psG,RK=ranks(psG);
  var m=function(k){var a=ps.filter(function(p){return p[k]!=null}).map(function(p){return p[k]});return a.length?a.reduce(function(x,y){return x+y},0)/a.length:null};
  var cnt=0;ps.forEach(function(p){cnt+=p.count});
  var cs=F.cls?[F.cls]:SC.CLASSES[F.g],size=0;cs.forEach(function(c){size+=+SIZES[c]||0});
  $('#tiles').innerHTML=[['🎯 正確率',f1(m('acc')),'分（百分制）'],['💯 總分',f1(m('s')),'分（答對 60＋速度 40）'],[CNTIC+'練習次數',cnt,'次（做完就算；太快亂按超過一半的不算）'],
    ['👥 有做的人',ps.length+(size?'／'+size:''),size?'人（參與率 '+Math.round(ps.length/size*100)+'%）':'人（試算表貼上「名單」就算得出參與率）']]
    .map(function(t){return '<div class="tile"><div class="k">'+t[0]+'</div><div class="v">'+t[1]+'</div><div class="d">'+t[2]+'</div></div>'}).join('');
  var h='';
  if(TAB==='p')h=paneP(ps,RK);else if(TAB==='b')h=paneB(psG);else if(TAB==='c')h=paneC(psG);else if(TAB==='w')h=paneW(S.C);else if(TAB==='t')h=paneT();else if(TAB==='l')h=paneL();else h=paneK(ps,S);
  $('#pane').innerHTML=h;
}
/* 2026-10-12 D6-A：只留 7 欄（其他點那個人看；Excel 照樣全部都有）。燈號：🔴 正確率不到 60 或太快亂按超過 3 成；🟡 正確率不到 80 或太快亂按超過 1 成；🟢 其他 */
/* 老師 2026-10-15 D12 ⑥：「本班名次」改成「全年級名次」（正確率，同分比總分） */
var PCOL=[['id','座號 姓名'],['acc','🎯 正確率'],['s','💯 總分'],['count',CNTIC+'練習次數'],['prog',UA+' 進步'],['gacc','🥇 全年級名次'],['lt','燈號']];
/* Excel 照樣全部欄位（文字，不放圖示） */
var XCOL=[['id','5碼'],['nm','姓名'],['acc','正確率'],['s','總分'],['count','練習次數'],['prog','進步'],['cacc','本班名次（正確率）'],['cs','本班名次（總分）'],['ccount','本班名次（練習次數）'],['cprog','本班名次（進步）'],
  ['gacc','全年級名次（正確率）'],['gs','全年級名次（總分）'],['gcount','全年級名次（練習次數）'],['gprog','全年級名次（進步）'],['sets','做了幾組'],['all','作答幾次'],['fix','訂正成功'],['fast','太快亂按'],['last','最後作答'],
  ['sec','練習時間（分鐘）'],['care','用心程度'],['c0','用心：這週 練了 幾天（分）'],['c1','用心：做完 幾次（分）'],['c2','用心：看完、聽完 才選（分）'],['c3','用心：答錯的 改對了（分）'],['c4','用心：練習 幾分鐘（分）']];
var BNX={sec:'最認真練習（練習秒數）',acc:'成績最優（正確率）',prog:'進步最多（正確率進步）',care:'最用心（用心程度）',s:'總分',count:'練習次數'};
var SDIR={id:'小的在上面',cacc:'第 1 名在上面',gacc:'第 1 名在上面',lt:'🔴 在上面'};
function light(r){return r.acc==null?3:(r.acc<60||r.fast>30)?0:(r.acc<80||r.fast>10)?1:2}
var LTS=['🔴','🟡','🟢','⚪'];
function rowOf(p,RK){var r=RK[p.id]||{},o={id:p.id,nm:nm(p.id),acc:p.acc,s:p.s,count:p.count,prog:p.prog,keep:p.keep,cacc:r.cacc,cs:r.cs,ccount:r.ccount,cprog:r.cprog,
  gacc:r.gacc,gs:r.gs,gcount:r.gcount,gprog:r.gprog,sets:p.sets,all:p.all,fix:p.fix,fast:p.q?Math.round(p.fastQ/p.q*100):0,last:p.last,
  sec:Math.round((p.sec||0)/6)/10,care:p.care,vonly:!p.all};var C=SC.care(p);C.it.forEach(function(v,i){o['c'+i]=v});o.lt=light(o);return o}
function dt(t){var d=new Date(t+288e5);return (d.getUTCMonth()+1)+'/'+d.getUTCDate()+' '+('0'+d.getUTCHours()).slice(-2)+':'+('0'+d.getUTCMinutes()).slice(-2)}
function paneP(ps,RK){
  if(!ps.length)return '<div class="note">這段期間還沒有人作答。</div>';
  var L=ps.map(function(p){return rowOf(p,RK)}),k=SORT.k,low=/^[cg]/.test(k)&&k!=='count';
  L.sort(function(a,b){var x=a[k],y=b[k];if(x==null&&y==null)return a.id<b.id?-1:1;if(x==null)return 1;if(y==null)return -1;
    var asc=k==='id'||k==='lt'||/^[cg](acc|s|count|prog)$/.test(k);return (asc?(x>y?1:x<y?-1:0):(y>x?1:y<x?-1:0))*SORT.d});
  return '<div class="note">點一個人看他每一組每一次的紀錄（可以把冒用的那一次「作廢」）。點欄位標題排序。</div><div class="tw"><table><thead><tr>'+
   PCOL.map(function(c){return '<th data-k="'+c[0]+'"'+(c[0]===k?' class="s"':'')+'>'+c[1]+(c[0]===k?'<small>⬇ '+(SORT.d>0?(SDIR[k]||'高的在上面'):'反過來排')+'</small>':'')+'</th>'}).join('')+'</tr></thead><tbody>'+
   L.map(function(r){return '<tr class="row" data-id="'+r.id+'">'+PCOL.map(function(c){var v=r[c[0]];
     if(c[0]==='id')return '<td class="nmc"><b>'+esc(v)+'</b>'+esc(r.nm||'')+'</td>';
     if(c[0]==='acc'||c[0]==='s')return '<td'+(v!=null&&v<60?' class="lo"':'')+'>'+f1(v)+'<span class="mb" style="width:'+(v||0)*.04+'em"></span></td>';
     if(c[0]==='prog')return '<td>'+(v==null?(r.keep?'🔥 保持滿分':'—'):v>0?'<span style="color:var(--ok)">'+UA+' ＋'+f1(v)+'%</span>':f1(v)+'%')+'</td>';
     if(c[0]==='cacc')return '<td>'+(v==null?'—':v<=3?['','🥇','🥈','🥉'][v]+' '+v:v)+'</td>';
     if(c[0]==='lt')return '<td class="lt" title="'+['要關心','要注意','很好','沒做'][v]+'">'+LTS[v]+'</td>';
     if(c[0]==='fast')return '<td'+(v>30?' class="lo"':'')+'>'+v+'%</td>';
     if(c[0]==='last')return '<td>'+dt(v)+'</td>';
     return '<td>'+(v==null?'—':esc(v))+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>';
}
var BN={acc:'🎯 成績最優',s:'💯 總分',count:CNTIC+'練習次數',prog:UA+' 進步最多',sec:'最認真練習',care:'最用心'};
/* 🏆 三種最高榮譽才有〔🏆 榮譽榜〕（使用者 2026-10-12 D6～D8）；總分、練習次數只是排行，沒有獎 */
function bnb(k){return HON.AWK.indexOf(k)>=0?'<span class="bic">'+HON.awi(k)+'</span>'+HON.AWN[k]:BN[k]}
function mins(v){return HON.mn(v)}
function fmt(k,v){return k==='count'?v+' 次':k==='prog'?'＋'+f1(v)+'%':k==='sec'?mins(v):k==='care'?'用心程度 '+v+' 分':f1(v)+' 分'}
function paneB(psG){
  var h='<div class="top"><span class="grp">'+HON.AWK.map(function(k){return '<button data-bt="'+k+'"'+(BT===k?' class="on"':'')+'>🏆 '+bnb(k)+'</button>'}).join('')+'</span>'+
   '<span class="grp">'+['s','count'].map(function(k){return '<button data-bt="'+k+'"'+(BT===k?' class="on"':'')+'>'+BN[k]+'</button>'}).join('')+'</span>'+
   '<span class="grp"><button data-bs="cls"'+(BS==='cls'?' class="on"':'')+'>🏫 班內</button><button data-bs="grade"'+(BS==='grade'?' class="on"':'')+'>🏆 全年級</button></span></div>'+
   '<div class="note">老師看得到全部學生的名次；學生只看得到前 10 名（自己不在前 10 名，只看到「再多幾分進前 10」）。</div>';
  var lists=BS==='grade'?[['全年級',SC.rank(psG,BT)]]:(F.cls?[F.cls]:SC.CLASSES[F.g]).map(function(c){return [SC.cname(c),SC.rank(psG.filter(function(p){return p.cls===c}),BT)]});
  HLISTS=lists.map(function(L,i){return {t:L[0],L:L[1],cls:BS==='grade'?'':(F.cls||SC.CLASSES[F.g][i])}});
  lists.forEach(function(L,i){var mx=0;L[1].forEach(function(x){mx=Math.max(mx,x.v)});
    h+='<h3 class="hh">'+L[0]+(L[1].length&&HON.AWK.indexOf(BT)>=0?'<button class="hbtn" data-hon="'+i+'">🏆 榮譽榜</button>':'')+'</h3>'+(L[1].length?'<div class="bars">'+L[1].map(function(x){return '<div class="br'+(x.rk<=10?' hi':'')+'"><span class="l">第 '+x.rk+' 名　'+who(x.id)+'</span><span class="t"><i style="width:'+(mx?x.v/mx*100:0)+'%"></i></span><span class="v">'+fmt(BT,x.v)+'</span></div>'}).join('')+'</div>':'<div class="note">還沒有人上榜。</div>')});
  return h;
}
function paneC(psG){
  var C=SC.classes(psG,F.g,SIZES),h='<div class="note">只跟同年級的班比（題目不一樣）。平均 ＝ 有做的人的平均；參與率 ＝ 有做的人 ÷ 名單人數（試算表「班級人數」有填就用那個數字）。'+(SC.CLASSES[F.g].some(function(c){return SC.AFTER[c]})?'課後班（'+SC.CLASSES[F.g].filter(function(c){return SC.AFTER[c]}).join('、')+'）人數、上課時間不一樣，不放進班際比較。':'')+'</div>';
  h='<h3 class="hh">🏫 班際<button class="hbtn" data-hon="c">🏆 班際榮譽榜</button></h3>'+h.replace('平均 ＝ 有做的人的平均；','正確率、總分、進步 ＝ 有做的人的平均；練習次數、練習時間、用心程度 ＝ 全班加起來 ÷ 全班人數（平均每一個人，沒練的人 ＝ 0）；');
  [['acc','🎯 平均正確率',100,function(v){return f1(v)+' 分'}],['s','💯 平均總分',100,function(v){return f1(v)+' 分'}],['cntP',CNTIC+'練習次數（平均每一個人）',0,function(v){return v==null?'—':f1(v)+' 次'}],['secP','⏱ 練習時間（平均每一個人）',0,function(v){return v==null?'—':mins(v)}],['careP','<span class="bic">'+HON.HRT+'</span>用心程度（平均每一個人）',100,function(v){return v==null?'—':v+' 分'}],
   ['rate','👥 參與率',100,function(v){return v==null?'（沒填人數）':Math.round(v)+'%'}],['prog',UA+' 平均進步',0,function(v){return v==null?'—':(v>0?'＋':'')+f1(v)+'%'}]].forEach(function(K){
    var vs=C.map(function(c){return K[0]==='rate'?(c.size?c.n/c.size*100:null):c[K[0]]}),mx=K[2]||Math.max.apply(null,vs.map(function(v){return Math.abs(v||0)}).concat([1]));
    h+='<h3>'+K[1]+'</h3><div class="bars">'+C.map(function(c,n){var v=vs[n];return '<div class="br'+(c.cls===F.cls?' hi':'')+'"><span class="l">'+c.cls+' 班（'+c.n+' 人）</span><span class="t"><i style="width:'+(v==null?0:Math.max(0,v)/mx*100)+'%"></i></span><span class="v">'+K[3](v)+'</span></div>'}).join('')+'</div>'});
  return h;
}
/* ══ 2026-10-12 D 第 4 件：🏆 榮譽榜（老師投影）══
   D8：三種最高榮譽的榜、班際各一顆〔🏆 榮譽榜〕｜D9：開場 ➜ 第 10～4 名一個一個上台 ➜ 頒獎台 3、2、1（第 1 名最後揭曉）➜ 第 1 名的話
   D10：〔👤 姓名 顯示／隱藏〕一開始顯示｜D11：12 種風格輪流（跟上一次一定不一樣）｜D12：號角、鼓聲、掌聲〔🔊 聲音 開／關〕一開始開
   D13：期間 ＝ 上面選的期間｜D14：〔🖨 印獎狀〕每一個上榜的人一張 A4 橫式｜G2・F5：班際 4 種排行（平均每一個人）＋每一班都有最強的一項 */
var HLISTS=[],HN=null,HNM=lsg0('hnm',1),HSND=lsg0('hsnd',1);
function lsg0(k,d){try{var v=localStorage.getItem(k);return v==null?d:+v}catch(e){return d}}
function lss0(k,v){try{localStorage.setItem(k,v)}catch(e){}}
/* 第 4 件修正（使用者 2026-10-12 D6～D8 定案）：只有三種最高榮譽（HON.AWK：最認真練習、成績最優、進步最多），字全部用 HON.AWN／HON.awl／HON.awc
   （學生平板、老師投影、印獎狀一模一樣）；拿掉進步之星、全班合照「一起練了 N 次」、班際「每一班都有自己最強的一項」 */
function hwho(id){var n=nm(id);return esc(id)+(HNM&&n?' '+esc(n):'')}
function hper(){return {w:'本週',lw:'上週',all:'這學期',c:'這段期間'}[F.p]}
function hper2(){return {w:'這週',lw:'上週',all:'這學期',c:'這段期間'}[F.p]}
function hgr(){return (F.g===3?'三':'四')+'年級'}
function hpod(R,f){return [1,2,3].map(function(r){var a=R.filter(function(x){return x.rk===r});return a.length?{w:a.map(f).join('<br>'),v:a[0].vt,d:[3.2,1.6,0][r-1]}:null})}
/* 一個人的榜 ➜ 一幕一幕：開場 ➜ 第 10～4 名 ➜ 頒獎台 3、2、1 ➜ 第 1 名 */
function hPlan(o){var P=[],k=o.k,top=o.L.filter(function(x){return x.rk<=10}),pm={};o.ps.forEach(function(p){pm[p.id]=p});top.forEach(function(x){x.vt=fmt(k,x.v)});
  P.push({o:{kick:esc(o.t)+'　'+HON.AWN[k],heroIc:HON.awi(k),tit:'🏆 '+hper()+' 榮譽榜'},t:3500,snd:'horn'});
  var mid=top.filter(function(x){return x.rk>=4}).reverse();
  if(mid.length)P.push({o:{hero:false,kick:HON.AWN[k]+'　第 '+mid[0].rk+' 名 ➜ 第 4 名',rows:mid.map(function(x){return {rk:x.rk,w:hwho(x.id),v:x.vt}}),gap:.9},t:1800+mid.length*900,snd:'clap'});
  var G=hpod(top,function(x){return hwho(x.id)});
  if(G[0])P.push({o:{hero:false,kick:HON.AWN[k]+'　🥉 第 3 名 ➜ 🥈 第 2 名 ➜ 🥇 第 1 名',pod:G},t:7600,snd:'drum'});
  if(top[0])P.push({o:{heroIc:HON.awi(k),kick:'🥇 '+esc(o.t)+' 第 1 名',cards:top.filter(function(x){return x.rk===1}).map(function(x){return {nm:HON.AWN[k],w:hwho(x.id),l:HON.awl(k,pm[x.id]||{},hper2())}})},t:5000,snd:'clap'});
  return P}
/* 班際 ➜ 3 種（頒獎台：平均每一個人） */
function hPlanC(ps){var C=SC.classes(ps,F.g,SIZES),A=SC.clsAwards(C),P=[];
  P.push({o:{kick:hgr(),heroIc:'🏫',tit:'🏆 '+hper()+' 榮譽榜'},t:3500,snd:'horn'});
  HON.AWK.forEach(function(k){var R=A.rk[k];if(!R.length)return;R.forEach(function(x){x.vt=HON.awc(k,x.v)});
    P.push({o:{hero:false,kick:hgr()+'　'+HON.AWN[k]+'的班',pod:hpod(R,function(x){return SC.cname(x.cls)})},t:7600,snd:'drum'})});
  return {P:P,A:A,C:C}}
function hOpen(key){var S=sets(),psG=SC.students(S.G);HN={i:0,tm:null,key:key,st:HON.pick('t')};
  if(key==='c'){var r=hPlanC(psG);HN.P=r.P;HN.cert=[];
    /* 班級獎狀：每一種的第 1 名 */
    /* 老師 D11 第 2 題 甲、第 3 題 A：「304 班／三年級 最用心的班 第 1 名／平均每一個人 用心程度 75 分」（刪「榮獲」、引號、「：全班一起努力。」） */
    HON.AWK.forEach(function(k){r.A.rk[k].filter(function(x){return x.rk===1}).forEach(function(x){HN.cert.push({w:SC.cname(x.cls),aw:hgr()+' '+HON.AWN[k]+'的班 第 1 名',l:HON.awc(k,x.v)})})})}
  else{var o=HLISTS[+key],ps=o.cls?psG.filter(function(p){return p.cls===o.cls}):psG,pm={};ps.forEach(function(p){pm[p.id]=p});HN.P=hPlan({t:o.t,L:o.L,k:BT,ps:ps,cls:o.cls});
    /* 個人獎狀（D11 第 2 題 甲）：「小華（最大）／304 班 最用心 第 2 名／用心程度 87 分」（刪三年級、號碼、榮獲、引號）；名字隱藏 ＝ 寫號碼 */
    HN.cert=o.L.filter(function(x){return x.rk<=10}).map(function(x){return {id:x.id,aw:(o.cls?SC.cname(o.cls):hgr())+' '+HON.AWN[BT]+' 第 '+x.rk+' 名',l:HON.aws(BT,pm[x.id]||{},hper2())}})}
  $('#honov').classList.add('on');hCtl();hShow()}
function hShow(){clearTimeout(HN.tm);var p=HN.P[HN.i];if(!p)return;HON.scene($('#honst'),HN.st,p.o);
  if(HSND&&p.snd)HON.snd[p.snd]();
  $('#hpg').textContent=(HN.i+1)+'／'+HN.P.length;
  HN.tm=setTimeout(function(){if(HN&&HN.i<HN.P.length-1){HN.i++;hShow()}},p.t)}
function hCtl(){$('#hsd').textContent='🔊 聲音：'+(HSND?'開':'關');$('#hsd').classList.toggle('on',!!HSND);$('#hnmb').textContent='👤 姓名：'+(HNM?'顯示':'隱藏');$('#hnmb').classList.toggle('on',!!HNM)}
function hClose(){if(HN)clearTimeout(HN.tm);HN=null;$('#honov').classList.remove('on');$('#honst').innerHTML=''}
/* 🖨 印獎狀：A4 橫式，一個人（一班）一張 */
function hPrint(){var d=new Date(DATA.now+288e5),dt0=d.getUTCFullYear()+' 年 '+(d.getUTCMonth()+1)+' 月 '+d.getUTCDate()+' 日';
  $('#prt').innerHTML=HN.cert.map(function(c){var n=c.id?nm(c.id):'';
    return '<div class="cert"><div class="ct">榮 譽 狀</div><div class="cw">'+(c.id?(HNM&&n?esc(n):esc(c.id)):esc(c.w))+'</div>'+
      '<div class="ca">'+esc(c.aw)+'</div><div class="cl">'+esc(c.l)+'</div><div class="cd">'+dt0+'</div></div>'}).join('');
  window.print()}
/* 題庫：三、四年級共用的（Review 1 遊戲）存成 g*r1_… */
function bankOf(set){return BANK[set]||BANK[String(set).replace(/^g\\d/,'g*')]||null}
function qOf(k){var a=k.split('#'),b=bankOf(a[0]);return b&&b.qs[+a[1]]?{set:b,q:b.qs[+a[1]]}:null}
function kn(q){return q.kn||KN[q.k]||''}
var KN={read:'👀 認讀',listen:'🎧 聽力',zh2en:'看中文選英文',en2zh:'看英文選中文',trap:'⚠️ 易錯'};
/* D18 A（老師 2026-10-12）：「「she」哪一個唸的是它？」➜「👀 she　🔊 聽 1～4：哪一個是 she？」（句子加「」）
   聽力題：清單、第 ① ～ ③ 步不寫出聽到的那一句（那常常就是答案），改〔🔊 再聽一次〕（第三批 四-4） */
function isLsn(q){return q.k==='listen'||(!!q.say&&/🔊/.test(q.q||''))}
function rdQ(q){var w=/\s/.test(q.show)?'「'+q.show+'」':q.show;return '👀 '+q.show+'　🔊 聽 1～4：哪一個是 '+w+'？'}
function qText(q){return q.k==='read'?rdQ(q):isLsn(q)?'🔊（聽力題）'+(q.k==='listen'?q.q:''):q.q}
/* 放聲音：預先錄好的語音檔（q.au／q.al／q.ao，score/_build.js 算好的）；沒有 ＝ 瀏覽器的英文語音。cb ＝ 唸完 */
var AEL=null;
function play(url,text,cb){var done=false,fin=function(){if(!done){done=true;if(cb)cb()}};try{speechSynthesis.cancel()}catch(e){}
  if(AEL){try{AEL.pause()}catch(e){}AEL=null}
  var tts=function(){try{var u=new SpeechSynthesisUtterance(String(text||'').replace(/[’]/g,"'"));u.lang='en-US';u.rate=.85;u.onend=fin;u.onerror=fin;speechSynthesis.speak(u);setTimeout(fin,6000)}catch(e){fin()}};
  if(!url){tts();return}
  try{var a=new Audio(url);AEL=a;a.onended=fin;a.onerror=function(){if(AEL===a)tts()};var pr=a.play();if(pr&&pr.catch)pr.catch(function(){if(AEL===a)tts()});setTimeout(fin,8000)}catch(e){tts()}}
function stopSnd(){try{speechSynthesis.cancel()}catch(e){}if(AEL){try{AEL.pause()}catch(e){}AEL=null}}
function lsn(q){play(q.al,q.say)}
/* 正確答案：每一個英文字正下方是中文（第三批 四-3 (3)） */
function ansHTML(q){if(!q.ae)return '';return '<div class="sans" id="sans">'+q.ag.map(function(x){return '<span><b>'+esc(x[0])+'</b><i>'+(x[1]?esc(x[1]):'&nbsp;')+'</i></span>'}).join('')+'</div>'+(q.az?'<div class="saz">'+esc(q.az)+'</div>':'')}
/* 唸 3 次：每唸一次，英文放大＋變亮一次（第三批 四-3 (2)） */
var SAYN=0;
function say3(q){var my=++SAYN,n=0;(function one(){if(my!==SAYN||n>=3)return;n++;var el=$('#sans');if(el)el.classList.add('big');
  play(q.au,q.ae,function(){var e2=$('#sans');if(e2)e2.classList.remove('big');setTimeout(one,700)})})()}
function paneW(R){
  var Q=SC.questions(R).filter(function(x){return x.bad>0&&qOf(x.k)}).slice(0,10);
  if(!Q.length)return '<div class="note">這段期間沒有答錯的題目 🎉</div>';
  return '<div class="note">'+(F.cls?SC.cname(F.cls):'全年級')+'最常錯的 10 題（答錯率高的在前面）。點一題看每一個選項有幾 % 的人選，再按〔📺 全班訂正〕投影（一步一步：想一想 ➜ 大家選什麼 ➜ 錯在哪裡 ➜ 正確答案）。聽力題不寫出聽到的句子。</div>'+
   Q.map(function(x,n){var o=qOf(x.k);return '<div class="wq" data-q="'+x.k+'"><span class="n">'+(n+1)+'</span><span class="q"><b>'+esc(qText(o.q))+'</b><em>'+esc(o.set.name)+'・第 '+(x.i+1)+' 題・'+kn(o.q)+'</em></span>'+
     '<span class="r"><span>答錯 '+x.rate+'%（'+x.bad+'／'+x.n+'）</span><span class="t"><i style="width:'+x.rate+'%"></i></span></span></div>'}).join('');
}
/* 2026-10-12 D 第 5 件（使用者第二批 4(3)）：🔔 要關心 ＝ 每一班一張表，照座號一格一格（班級、號碼、姓名）。
   每一格的顏色跟 👤 個人表的燈號同一套（light）：🔴 要關心（正確率不到 60 分、或太快亂按超過 3 成）🟡 要注意（不到 80 分、或亂按超過 1 成）
   🟢 很好 ⚪ 這段期間還沒做（以前做過的多寫「以前有做」）。格子一格一格跳出來，🔴 的框慢慢閃；點一格 ＝ 那個人的秒懂成績卡。
   有名單 ＝ 名單上的每一個人都有一格；沒有名單 ＝ 只有做過的人（上面寫怎麼貼名單） */
var KST=[['🔴','要關心','no'],['🟡','要注意','md'],['🟢','很好','ok'],['⚪','還沒做','nd']];
/* 2026-10-15 D12 ⑥：〔🔲 照座號〕／〔📊 圖表分析〕（記在這台電腦）；格子多一行「❤獎牌 用心 87」 */
var KM=(function(){try{return localStorage.getItem('kmode')||'g'}catch(e){return 'g'}})();
function kWhy(p,o,old){return !p?(old?'以前有做':'還沒做'):!p.all?'👀 只看字卡':o.acc==null?'🃏 只玩記憶配對':o.fast>30?'⚠️ 亂按 '+o.fast+'%':(o.acc>=60&&o.fast>10?'⚠️ 亂按 '+o.fast+'%':f1(o.acc)+' 分')}
function kLt(p,o){return !p?3:(o.acc==null?2:o.lt)}
function paneK(ps,S){
  var r=range(),before=SC.students(SC.pick(ALL,{g:F.g,to:r.from,src:F.src}).filter(function(x){return !F.cls||x.cls===F.cls}));
  var now={},old={};ps.forEach(function(p){now[p.id]=p});
  if(r.from!=null)before.forEach(function(p){old[p.id]=1});
  var cs=F.cls?[F.cls]:SC.CLASSES[F.g],hasR=cs.some(function(c){return RCLS[c]}),h='',k=0;
  cs.forEach(function(c){
    var ids=(RCLS[c]||[]).slice();ps.concat(before).forEach(function(p){if(p.cls===c&&ids.indexOf(p.id)<0)ids.push(p.id)});
    ids.sort();if(!ids.length)return;
    var cnt=[0,0,0,0],R=ids.map(function(id){var p=now[id],o=p?rowOf(p,{}):{acc:null,fast:0},lt=kLt(p,o);cnt[lt]++;return {id:id,p:p,o:o,lt:lt,why:kWhy(p,o,old[id])}});
    var head='<h3>'+esc(SC.cname(c))+'<span class="kct">'+KST.map(function(s,i){return '<span class="kp '+s[2]+'">'+s[0]+' '+s[1]+' <b>'+cnt[i]+'</b></span>'}).join('')+'</span></h3>';
    if(KM==='a'){h+='<section class="kcls">'+head+kAna(c,R,cnt)+'</section>';return}
    var cells=R.map(function(x){
      return '<button class="kc '+KST[x.lt][2]+'" data-pid="'+x.id+'" style="animation-delay:'+Math.min(k++*22,900)+'ms"><b>'+esc(x.id)+'</b><span class="kn">'+(esc(nm(x.id))||'&nbsp;')+'</span><span class="kw">'+KST[x.lt][0]+' '+x.why+'</span>'+
        (x.p?'<span class="kh">'+HON.HRT+' 用心 '+x.p.care+'</span>':'')+'</button>'});
    h+='<section class="kcls">'+head+'<div class="kg">'+cells.join('')+'</div></section>'});
  return '<div class="kmd"><button data-km="g"'+(KM!=='a'?' class="on"':'')+'>🔲 照座號</button><button data-km="a"'+(KM==='a'?' class="on"':'')+'>📊 圖表分析</button></div>'+
   '<div class="note">這一頁只有老師看得到。'+(KM==='a'?'每一班：<b>全班整體</b> ➜ <b>每一個人（要關心的排最前面）</b>。':'每一班照座號一格一格。')+'<b>點一個人看他的成績卡</b>。</div>'+
   '<div class="klg">'+KST.map(function(s){return '<span class="kp '+s[2]+'">'+s[0]+' '+s[1]+'</span>'}).join('')+
   '<span class="kx">🔴 ＝ 正確率不到 60 分、或太快亂按超過 3 成　🟡 ＝ 不到 80 分、或太快亂按超過 1 成</span></div>'+
   (!hasR?'<div class="note">在試算表「名單」分頁貼上 班級｜座號｜姓名，還沒做的人也會有一格。</div>':'')+
   (h||'<div class="note">這段期間還沒有人作答。</div>');
}
/* 📊 圖表分析（老師 D12 ⑥）：① 全班整體（四個大數字、燈號長條、用心五項全班平均＋最弱的一項）② 每一個人：🔴 ➜ ⚪ ➜ 🟡 ➜ 🟢，同一組正確率低的在前面 */
function kAna(c,R,cnt){
  var did=R.filter(function(x){return x.p}),n=R.length,sz=+SIZES[c]||n,avg=function(f){var a=did.map(f).filter(function(v){return v!=null});return a.length?a.reduce(function(x,y){return x+y},0)/a.length:null};
  var careSum=0,secSum=0,it=[0,0,0,0,0];did.forEach(function(x){careSum+=x.p.care;secSum+=x.p.sec||0;SC.care(x.p).it.forEach(function(v,i){it[i]+=v})});
  var per=Math.max(sz,did.length)||1,ia=it.map(function(v){return Math.round(v/per)}),w=HON.cweak({it:ia});
  var ic=['<span>📅</span>','<span>📝</span>',HON.EYE,HON.FIX,HON.CLK];
  var h='<div class="ka4"><div>🎯 平均正確率<b>'+f1(avg(function(x){return x.o.acc}))+'</b>分（有做的人）</div><div>'+HON.HRT+' 用心程度<b>'+Math.round(careSum/per)+'</b>分（平均每一個人）</div>'+
    '<div>'+HON.CLK+' 練習時間<b>'+Math.round(secSum/per/60)+'</b>分鐘（平均每一個人）</div><div>👥 這段期間有做<b>'+did.length+'／'+sz+'</b>人</div></div>';
  h+='<div class="kst">'+[0,3,1,2].filter(function(i){return cnt[i]}).map(function(i){return '<span class="'+KST[i][2]+'" style="flex:'+cnt[i]+'">'+KST[i][0]+' '+cnt[i]+' 人</span>'}).join('')+'</div>';
  h+='<div class="kc5">'+HON.CN.map(function(t,i){return '<div'+(i===w?' class="wk"':'')+'><span class="ci">'+ic[i]+'</span>'+t+'<span class="t"><i style="width:'+ia[i]*5+'%;background:'+['#2F7BE8','#9B59D0','#00A6A6','#2EB85C','#FF9F1C'][i]+'"></i></span><b>'+ia[i]+'／20</b>'+(i===w?'<br>💡 全班最弱':'')+'</div>'}).join('')+'</div>';
  var ord=[0,3,1,2],k=0;
  h+='<div class="kr kth"><span>號碼 姓名</span><span>🎯 正確率</span><span>'+HON.HRT+' 用心</span><span>練習</span><span>為什麼</span></div>';
  ord.forEach(function(lt){var L=R.filter(function(x){return x.lt===lt}).sort(function(a,b){return (a.o.acc==null?999:a.o.acc)-(b.o.acc==null?999:b.o.acc)||(a.id<b.id?-1:1)});if(!L.length)return;
    h+='<div class="kgh">'+KST[lt][0]+' '+KST[lt][1]+'（'+L.length+' 人）</div>'+L.map(function(x){var C=x.p?SC.care(x.p):null,wk=C?HON.cweak(C):-1;
      return '<button class="kr '+KST[lt][2]+'" data-pid="'+x.id+'" style="animation-delay:'+Math.min(k++*30,900)+'ms"><span><b>'+esc(x.id.slice(3))+'</b> '+(esc(nm(x.id))||esc(x.id))+'</span>'+
        '<span class="t"><i style="width:'+(x.o.acc||0)+'%;background:'+vc(x.o.acc)+'"></i></span>'+
        '<span class="kh2">'+(C?HON.HRT+' '+C.tot:'—')+'</span><span>'+(x.p?Math.round((x.p.sec||0)/60)+' 分鐘':'')+'</span>'+
        '<span>'+KST[lt][0]+' '+x.why+(wk>=0&&x.p?'<br><small>❤ 最少：'+HON.CN[wk]+'</small>':'')+'</span></button>'}).join('')});
  return h;
}
/* 2026-10-12 D 第 3 件（D7 ①～⑤⑦）：點一個人 ＝ 秒懂成績卡。
   ① 四個大圖（正確率、總分 ＝ 圓圈從 0 轉上去；練習次數 ＝ 大數字＋綠色小方格一格 ＝ 一次；進步 ＝ 綠色箭頭往上跳，退步不寫負數寫「再加油」）
   ② 👍 最拿手 3 組｜🌱 要加油 3 組（每一組最後一次的正確率）③ 📅 哪幾天有練（一週一排，最近 4 週）④ 每一組的變化（一次一組，◀ ▶ 換）
   ⑤ ❌ 最常錯的 3 題（他選的 ❌、正確答案 ✅）⑦〔📋 看全部明細〕收在最下面（作廢在這裡）。⑥ 用心程度 ＝ 第 8 件做好才加 */
var PID='',PCH={L:[],i:0};
function pRecs(id){var r=range();return ALL.filter(function(x){return x.id===id&&x.g===F.g&&(r.from==null||x.t>=r.from)&&(r.to==null||x.t<r.to)&&(!F.src||x.src===F.src)&&(!F.cat||SC.cat(x.set).k===F.cat)}).sort(function(a,b){return a.t-b.t})}
function setNm(k,L){return (bankOf(k)||{}).name||(L&&L.length?L[L.length-1].name:'')||k}
function ring(v,c){var o=(314-(v||0)*3.14).toFixed(1);return '<svg class="ring" viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="50"/><circle class="fg" cx="60" cy="60" r="50" style="stroke:'+c+';--o:'+o+'"/><text x="60" y="62">'+f1(v)+'</text></svg>'}
function vc(v){return v==null?'#555':v>=80?'#3BD16F':v>=60?'#FFD24A':'#FF7A7A'}
function person(id){
  PID=id;var A=pRecs(id),V=A.filter(function(x){return !x.x}),p=SC.students(V)[0]||{acc:null,s:null,count:0,prog:null,keep:false};
  var h='<button class="x" id="mx">✕ 關閉</button><h3 class="ph">'+who(id)+'</h3>';
  if(!V.length){h+='<div class="note">這段期間沒有紀錄（期間、類別、來源可以在上面換）。</div>'}
  else{
  /* ① 四個大圖 */
  var sq='',nq=Math.min(p.count,20);for(var i=0;i<nq;i++)sq+='<i style="animation-delay:'+(i*.08).toFixed(2)+'s"></i>';
  var pg=p.prog==null?(p.keep?'<div class="pv">🔥</div><div class="pd">保持滿分</div>':'<div class="pv" style="color:#8A8A8A">—</div><div class="pd">同一組練 2 次以上才看得出來</div>')
    :p.prog>0?'<div class="pv up">'+UA+'</div><div class="pd"><b style="color:var(--ok)">＋'+f1(p.prog)+'%</b><br>正確率比上一次高</div>'
    :'<div class="pv">🌱</div><div class="pd">再加油</div>';
  h+='<div class="pc4"><div class="pg"><div class="pk">🎯 正確率</div>'+ring(p.acc,vc(p.acc))+'</div><div class="pg"><div class="pk">💯 總分</div>'+ring(p.s,vc(p.s))+'</div>'+
    '<div class="pg"><div class="pk">'+CNTIC+'練習次數</div><div class="pn">'+p.count+' 次</div><div class="sq">'+sq+(p.count>20?'<span>＋'+(p.count-20)+'</span>':'')+'</div></div>'+
    '<div class="pg"><div class="pk">'+UA+' 進步</div>'+pg+'</div></div>';
  /* ⑥ ❤ 用心程度（2026-10-15 D 第 8 件，D12 ⑥）：跟學生平板同一個動畫（五顆愛心），最少的那一項閃；〔📖 說明〕 */
  h+='<div class="pcare" id="pcare"></div>';
  /* ② 最拿手／要加油 */
  var by={};V.forEach(function(x){(by[x.set]=by[x.set]||[]).push(x)});
  var S=Object.keys(by).filter(function(k){return by[k][by[k].length-1].acc!=null}).map(function(k){var L=by[k];return {k:k,nm:setNm(k,L),v:L[L.length-1].acc}});
  var hi=S.slice().sort(function(a,b){return b.v-a.v}).slice(0,3),lo=S.slice().sort(function(a,b){return a.v-b.v}).filter(function(x){return hi.indexOf(x)<0&&x.v<100}).slice(0,3);
  var bl=function(L,c){return L.length?L.map(function(x){return '<div class="sb2"><span class="sl">'+esc(x.nm)+'</span><span class="t"><i style="width:'+x.v+'%;background:'+c+'"></i></span><b>'+x.v+'</b></div>'}).join(''):'<div class="note">'+(c==='var(--ok)'?'（還沒有）':'沒有 👍 每一組都很好')+'</div>'};
  if(S.length)h+='<div class="hl"><div><h3>👍 最拿手</h3>'+bl(hi,'var(--ok)')+'</div><div><h3>🌱 要加油</h3>'+(S.length<2?'<div class="note">多做幾組才比得出來</div>':bl(lo,'#FF9F43'))+'</div></div><div class="note">每一組看最後一次的正確率。</div>';
  /* ③ 哪幾天有練 */
  var dd={};V.forEach(function(x){if(x.m==='v')return;var d=SC.day(x.t);dd[d]=(dd[d]||0)+1});
  var last=SC.weekStart(V[V.length-1].t),first=Math.max(SC.weekStart(V[0].t),last-3*7*864e5),cal='',WK='一二三四五六日',td=SC.day(DATA.now);
  for(var w=first;w<=last;w+=7*864e5){cal+='<div class="cw">';for(var j=0;j<7;j++){var t0=w+j*864e5,dy=SC.day(t0),n=dd[dy]||0,dt0=new Date(t0+288e5);
    cal+='<span class="'+(n?'on':'')+(dy===td?' td':'')+'"><b>'+WK.charAt(j)+'</b><small>'+(dt0.getUTCMonth()+1)+'/'+dt0.getUTCDate()+'</small>'+(n?'✅'+(n>1?n:''):'')+'</span>'}cal+='</div>'}
  h+='<h3>📅 哪幾天有練</h3><div class="cal">'+cal+'</div><div class="note">✅ ＝ 那一天有練（數字 ＝ 做了幾次）。</div>';
  /* ④ 每一組的變化 */
  PCH={L:S.map(function(x){return x.k}),i:0,by:by};if(PCH.L.length)h+='<h3>📈 每一組的變化</h3><div id="pch"></div>';
  /* ⑤ 最常錯的 3 題 */
  var W={};V.forEach(function(x){(x.qs||[]).forEach(function(q,j){if(q[0])return;var k=x.set+'#'+(q[5]==null?j:q[5]),o=W[k]=W[k]||{k:k,n:0,pk:0,t:0};o.n++;if(x.t>=o.t){o.t=x.t;o.pk=q[1]}})});
  var WL=Object.keys(W).map(function(k){return W[k]}).filter(function(x){return qOf(x.k)}).sort(function(a,b){return b.n-a.n||b.t-a.t}).slice(0,3);
  h+='<h3>❌ 最常錯的 3 題</h3>'+(WL.length?WL.map(function(x){var o=qOf(x.k),q=o.q;return '<div class="pw"><div class="pq">'+esc(qText(q))+'<em>'+esc(o.set.name)+(x.n>1?'・錯了 '+x.n+' 次':'')+'</em></div>'+
    '<div class="pa"><span class="no">❌ '+(x.pk<0?'⏰ 時間到沒有選':esc(q.o[x.pk]))+'</span><span class="ok">✅ '+esc(q.o[0])+'</span></div></div>'}).join(''):'<div class="note">沒有答錯的題目 🎉</div>');
  }
  /* ⑦ 明細（作廢在這裡） */
  h+='<button id="pdb" class="pdb">📋 看全部明細（作廢在這裡）</button><div id="pdet" hidden><div class="note">每一組：正確率的變化（綠點 ＝ 練習次數 ＋1；灰色刪除線 ＝ 作廢）。遊戲的正確率只算每一題第一次作答。</div>'+pdetail(A)+'</div>';
  $('#mbox').innerHTML=h;$('#modal').classList.add('on');pChart();
  if($('#pcare'))HON.cscene($('#pcare'),HON.cpick('ct'),SC.care(p),{help:1,t:hper2()+' 用心程度'});
}
function pChart(){var el=$('#pch');if(!el||!PCH.L.length)return;var k=PCH.L[PCH.i],L=PCH.by[k],n=L.length,W=800,H=260,T=40,B=40;
  var X=function(i){return n>1?50+i*(W-100)/(n-1):W/2},Y=function(v){return T+(1-v/100)*(H-T-B)};
  var g='<svg class="pcl" viewBox="0 0 '+W+' '+H+'"><line x1="20" x2="'+(W-20)+'" y1="'+Y(60)+'" y2="'+Y(60)+'" stroke="#444" stroke-dasharray="6 6"/><text class="ax" x="'+(W-20)+'" y="'+(Y(60)-8)+'" text-anchor="end">60</text>'+
    '<polyline class="pl" fill="none" stroke="#7FBFFF" stroke-width="5" points="'+L.map(function(x,i){return X(i)+','+Y(x.acc)}).join(' ')+'"/>'+
    L.map(function(x,i){return '<circle cx="'+X(i)+'" cy="'+Y(x.acc)+'" r="12" fill="'+(SC.counts(x.ok,x.n,x.m,x.fast)?'#5BE39A':'#FFB86B')+'"/><text class="pv2" x="'+X(i)+'" y="'+(Y(x.acc)-20)+'">'+x.acc+'</text><text class="ax" x="'+X(i)+'" y="'+(H-8)+'" text-anchor="middle">'+dt(x.t).split(' ')[0]+'</text>'}).join('')+'</svg>';
  el.innerHTML='<div class="pcn"><button id="pcp"'+(PCH.L.length>1?'':' disabled')+'>◀</button><b>'+esc(setNm(k,L))+'<small>第 '+(PCH.i+1)+' 組／共 '+PCH.L.length+' 組</small></b><button id="pcx"'+(PCH.L.length>1?'':' disabled')+'>▶</button></div>'+g+'<div class="note">數字 ＝ 那一次的正確率；<b style="color:#5BE39A">綠點</b> ＝ 練習次數 ＋1、<b style="color:#FFB86B">橘點</b> ＝ 這一次沒有加（太快亂按）；虛線 ＝ 60 分。</div>'}
/* 明細表：每一組每一次（舊的「點一個人」整份搬過來） */
function pdetail(A){var h='',by={};A.forEach(function(x){(by[x.set]=by[x.set]||[]).push(x)});
  Object.keys(by).forEach(function(k){var L=by[k],n=L.length,W=600,H=120,pts=L.map(function(x,i){return [n>1?20+i*(W-40)/(n-1):W/2,H-12-((x.acc||0)/100)*(H-24),x]});
    var nm=esc((bankOf(k)||{}).name||L[L.length-1].name||k);
    /* 🃏 記憶配對：沒有正確率，只列配完幾對、用幾秒、翻錯幾次 */
    /* 👀 看字卡：只有時間 */
    if(L[0].m==='v'){h+='<h3>'+nm+'</h3><div class="tw"><table class="att"><tr><th>時間</th><th>看字卡、聽 幾分鐘</th><th>來源</th><th>平板</th><th></th></tr>'+
      L.map(function(x){return '<tr'+(x.x?' class="void"':'')+'><td>'+dt(x.t)+'</td><td>'+mins(x.sec)+'</td><td>'+(x.src==='home'?'🏠 在家':'🏫 在校')+'</td><td>'+esc(x.dev)+'</td>'+
        '<td><button data-void="'+esc(x.u)+'" data-v="'+(x.x?0:1)+'">'+(x.x?'↩ 恢復':'🚫 作廢')+'</button></td></tr>'}).join('')+'</table></div>';return}
    if(L[0].m==='mem'){h+='<h3>'+nm+'</h3><div class="tw"><table class="att"><tr><th>時間</th><th>✅ 配完幾對</th><th>⏱ 用幾秒</th><th>每對幾秒</th><th>❌ 翻錯幾次</th><th>來源</th><th>平板</th><th></th></tr>'+
      L.map(function(x){return '<tr'+(x.x?' class="void"':'')+'><td>'+dt(x.t)+'</td><td>'+x.mp+'</td><td>'+x.sec+'</td><td>'+(x.mp?f1(x.sec/x.mp):'—')+'</td><td>'+x.mw+'</td><td>'+(x.src==='home'?'🏠 在家':'🏫 在校')+'</td><td>'+esc(x.dev)+'</td>'+
        '<td><button data-void="'+esc(x.u)+'" data-v="'+(x.x?0:1)+'">'+(x.x?'↩ 恢復':'🚫 作廢')+'</button></td></tr>'}).join('')+'</table></div>';return}
    h+='<h3>'+nm+'</h3><svg class="svgl" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><line x1="0" x2="'+W+'" y1="'+(H-12-.6*(H-24))+'" y2="'+(H-12-.6*(H-24))+'" stroke="#333" stroke-dasharray="4 4"/>'+
     '<polyline fill="none" stroke="#7FBFFF" stroke-width="2" points="'+pts.filter(function(p){return !p[2].x}).map(function(p){return p[0]+','+p[1]}).join(' ')+'"/>'+
     pts.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="'+(p[2].x?'#555':SC.counts(p[2].ok,p[2].n,p[2].m,p[2].fast)?'#5BE39A':'#FFB86B')+'"/>'}).join('')+'</svg>'+
     '<div class="tw"><table class="att"><tr><th>時間</th><th>正確率</th><th>總分</th><th>答對／題數</th><th>✨ 訂正</th><th>⚠️ 太快亂按</th><th>來源</th><th>平板</th><th></th></tr>'+
     L.map(function(x){return '<tr'+(x.x?' class="void"':'')+'><td>'+dt(x.t)+'</td><td>'+x.acc+'</td><td>'+f1(x.s)+'</td><td>'+x.ok+'／'+x.n+'</td><td>'+(x.fix||0)+'</td><td>'+x.fast+'／'+x.n+'</td><td>'+(x.src==='home'?'🏠 在家':'🏫 在校')+'</td><td>'+esc(x.dev)+'</td>'+
       '<td><button data-void="'+esc(x.u)+'" data-v="'+(x.x?0:1)+'">'+(x.x?'↩ 恢復':'🚫 作廢')+'</button></td></tr>'}).join('')+'</table></div>'});
  return h}
function stats(k){var R=sets()[F.cls?'C':'G'],x=SC.questions(R).filter(function(z){return z.k===k})[0];var mis=-9,mv=0;[1,2,3].forEach(function(i){if((x.p[i]||0)>mv){mv=x.p[i];mis=i}});return {x:x,mis:mis}}
function optTxt(q,i){return q.k==='read'?'🔊 '+'①②③④'.charAt(i):q.o[i]}
function qDetail(k){
  var S=stats(k),x=S.x,mis=S.mis,o=qOf(k),q=o.q;
  var h='<button class="x" id="mx">✕ 關閉</button><h3 style="font-size:clamp(26px,2.4vw,42px)">'+esc(qText(q))+'</h3>'+
    (isLsn(q)?'<button data-snd="al" data-q="'+k+'" class="lsb">🔊 再聽一次</button>':'')+
    '<div class="note">'+esc(o.set.name)+'・第 '+(x.i+1)+' 題・'+kn(q)+'・'+x.n+' 人次作答'+(q.k==='g'?'（只算第一次作答）':'')+'</div>';
  h+=q.o.map(function(t,i){var c=x.p[i]||0,pc=Math.round(c/x.n*100);return '<div class="opt'+(i===0?' ok':i===mis?' mis':'')+'"><span>'+(i===0?'✅':i===mis?'❌':'　')+'</span><span>'+
    (q.k==='read'?'<button data-snd="o'+i+'" data-q="'+k+'" class="ob">🔊</button> ':'')+esc(t)+'</span><span>'+pc+'%（'+c+'）</span>'+
    '<span class="t" style="grid-column:2/4"><i style="width:'+pc+'%"></i></span>'+(i===mis?'<span class="w" style="color:var(--no)">👥 最多人選的錯答案</span>':'')+'</div>'}).join('');
  if(x.p[-1])h+='<div class="note">⏰ 時間到沒有作答：'+x.p[-1]+' 人次</div>';
  h+='<div class="why">💡 為什麼：'+esc(q.h)+'</div><button id="sh" data-q="'+k+'" style="background:#2A2208;border-color:var(--gold)">📺 全班訂正（投影）</button>';
  $('#mbox').innerHTML=h;$('#modal').classList.add('on');
}
/* 📺 全班訂正（投影；2026-10-15 D 第 9 件）：一步一步動畫引導學生想
   ① 🤔 想一想（聽力題先放一次聲音，10 秒想一想的長條）➜ ② 👥 大家選什麼（長條長出來）➜ ③ 🔍 錯在哪裡（最多人選的錯答案搖一搖）
   ➜ ④ ✅ 正確答案（亮起來；英文每一個字下面寫中文、整句中文；唸 3 次，每唸一次英文放大變亮一次）（R19：錯了馬上訂正最好記） */
var SH=null,STN=['🤔 想一想','👥 大家選什麼','🔍 錯在哪裡','✅ 正確答案'];
function show(k,st){
  var S=stats(k),x=S.x,mis=S.mis,o=qOf(k),q=o.q;SAYN++;stopSnd();
  if(!SH||SH.k!==k)SH={k:k};SH.st=st;
  var ord=SH.ord||(SH.ord=q.o.map(function(x,i){return i}).sort(function(){return Math.random()-.5}));
  var nmis=mis>=0&&(x.p[mis]||0)>0;
  var h='<div class="sst">'+STN.map(function(t,i){return '<span class="'+(i===st?'on':i<st?'dn':'')+'">'+(i+1)+' '+t+'</span>'}).join('')+'</div>';
  h+='<div class="sq">'+esc(qText(q))+'</div>';
  if(isLsn(q))h+='<div class="sl"><button data-snd="al" data-q="'+k+'">🔊 再聽一次</button>'+(st>=3&&q.say?'<span class="shw">'+esc(q.say)+'</span>':'')+'</div>';
  h+='<div class="so'+(st>=3?' cp':'')+'">'+ord.map(function(i,n){var pc=Math.round((x.p[i]||0)/x.n*100),c=st>=3?(i===0?'ok go':'dim'):st===2&&i===mis&&nmis?'mis go':'';
    return '<div class="'+c+'"><span>'+(q.k==='read'?'<button data-snd="o'+i+'" data-q="'+k+'" class="ob">🔊</button>':'')+'①②③④'.charAt(n)+' '+(q.k==='read'&&st<3?'':esc(q.o[i]))+'</span>'+
      (st>=1?'<span class="pb"><i data-w="'+pc+'"></i></span><span class="pc">'+pc+'% 的人選這個</span>':'')+
      (st===2&&i===mis&&nmis?'<span class="lb">👥 最多人選的錯答案</span>':'')+(st>=3&&i===0?'<span class="lb">✅ 正確答案</span>':'')+'</div>'}).join('')+'</div>';
  if(st===0)h+='<div class="sth"><span class="em">🤔</span> 先想一想：你會選哪一個？</div><div class="stm"><i></i></div>';
  else if(st===1)h+='<div class="sth">👥 大家選什麼？哪一個最多人選？</div>';
  else if(st===2)h+='<div class="sth">'+(nmis?'🔍 最多人選的錯答案：它哪裡不對？':'🔍 每一個選項：哪裡不一樣？')+'</div>';
  else h+=ansHTML(q)+'<div class="sw"><span class="ck">✅</span> 💡 '+esc(q.h)+'</div>';
  h+='<div class="sb">'+(st>0?'<button id="sp">◀ 上一步</button>':'')+(st<3?'<button id="sn" style="background:#0F3323;border-color:var(--ok)">▶ 下一步：'+STN[st+1]+'</button>':(q.ae?'<button id="ss">🔊 再唸 3 次</button>':''))+'<button id="sc">✕ 結束</button></div>';
  $('#show').innerHTML=h;$('#show').classList.add('on');
  setTimeout(function(){$$('#show .pb i').forEach(function(b){b.style.width=b.getAttribute('data-w')+'%'})},60);
  if(st===0&&isLsn(q))setTimeout(function(){lsn(q)},500);
  if(st===3&&q.ae)setTimeout(function(){say3(q)},900);
}
/* ⬇ 一鍵下載 Excel：五張工作表 */
function excel(){
  var S=sets(),psG=SC.students(S.G),ps=F.cls?psG.filter(function(p){return p.cls===F.cls}):psG,RK=ranks(psG);
  var P=[XCOL.map(function(c){return c[1]})].concat(ps.map(function(p){var r=rowOf(p,RK);return XCOL.map(function(c){var v=r[c[0]];
    return c[0]==='last'?(v?dt(v):''):c[0]==='fast'?v/100:c[0]==='prog'&&v==null&&r.keep?'保持滿分':v==null?'':v})}));
  var B=[['榜','範圍','名次','5碼','姓名','分數']];['sec','acc','prog','care','s','count'].forEach(function(k){
    SC.rank(psG,k).forEach(function(x){if(!F.cls||x.cls===F.cls)B.push([BNX[k],'全年級',x.rk,x.id,nm(x.id),x.v])});
    (F.cls?[F.cls]:SC.CLASSES[F.g]).forEach(function(c){SC.rank(psG.filter(function(p){return p.cls===c}),k).forEach(function(x){B.push([BNX[k],SC.cname(c),x.rk,x.id,nm(x.id),x.v])})})});
  var C=[['班級','有做的人','班級人數','參與率','平均正確率','平均總分','作答總次數','平均進步','練習時間（平均每一個人，分鐘）','用心程度（平均每一個人）']].concat(SC.classes(psG,F.g,SIZES).map(function(c){
    return [c.cls,c.n,c.size||'',c.size?Math.round(c.n/c.size*100)/100:'',c.acc==null?'':c.acc,c.s==null?'':c.s,c.count,c.prog==null?'':c.prog,c.secP==null?'':Math.round(c.secP/6)/10,c.careP==null?'':c.careP]}));
  var W=[['題組','第幾題','題型','題目','正確答案','答錯率','答錯','作答人次','選正解','選項 2','選項 2 人次','選項 3','選項 3 人次','選項 4','選項 4 人次','時間到','為什麼']];
  SC.questions(S.C).forEach(function(x){var o=qOf(x.k);if(!o)return;var q=o.q;W.push([o.set.name,x.i+1,kn(q),isLsn(q)?'🔊 '+q.say+'　'+(q.k==='listen'?q.q:''):qText(q),q.o[0],x.rate/100,x.bad,x.n,x.p[0]||0,q.o[1],x.p[1]||0,q.o[2],x.p[2]||0,q.o[3],x.p[3]||0,x.p[-1]||0,q.h])});
  var r=range(),RAW=[SC.COLS.slice(0,2).concat(['姓名'],SC.COLS.slice(2))].concat(ALL.filter(function(x){return x.g===F.g&&(!F.cls||x.cls===F.cls)&&(r.from==null||x.t>=r.from)&&(r.to==null||x.t<r.to)&&(!F.src||x.src===F.src)&&(!F.cat||SC.cat(x.set).k===F.cat)})
    .sort(function(a,b){return a.t-b.t}).map(function(x){var row=SC.toRow(x);row[0]=dt(x.t);row[SC.CI['題組名稱']]=(bankOf(x.set)||{}).name||x.name;
      row[SC.CI['來源']]=x.src==='home'?'在家':'在校';row[SC.CI['作廢']]=x.x?'作廢':'';row.splice(2,0,nm(x.id));return row}));
  var b=XLSX.make([{name:'個人',rows:P},{name:'排行榜',rows:B},{name:'班際',rows:C},{name:'錯題',rows:W},{name:'原始紀錄',rows:RAW}]);
  /* 檔名只用英文和數字：有些瀏覽器（量測用的 Chromium）遇到中文檔名會改成 download */
  var pn={w:'week',lw:'lastweek',all:'all',c:'custom'}[F.p],d=new Date(DATA.now+288e5).toISOString().slice(0,10);
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([b],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  a.download='score_G'+F.g+(F.cls?'_'+F.cls:'')+'_'+pn+'_'+d+'.xlsx';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000);
  window.LASTXLSX=b;
}
/* ══ 📌 任務（2026-10-09 E）══ */
var WD='日一二三四五六';
function tkT(ms){var d=new Date(ms),p=function(n){return (n<10?'0':'')+n};return (d.getMonth()+1)+'/'+d.getDate()+'（'+WD.charAt(d.getDay())+'）'+p(d.getHours())+':'+p(d.getMinutes())}
function tkV(ms){var d=new Date(ms),p=function(n){return (n<10?'0':'')+n};return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes())}
function tkList(){return (DATA&&DATA.tasks||[]).filter(function(t){return t.g===F.g&&(!F.cls||t.cls.indexOf(F.cls)>=0)})}
/* ══ 2026-10-12 D 第 7 件：〔🔒 開關〕在家複習網站的每一個主題（使用者 D16 A）══
   選班級（可以好幾班、〔✅ 全年級〕）➜ 按一個主題 ＝ 鎖／開（綠 🔓 開、紅 🔒 鎖、黃 ＝ 只有幾班鎖），按一下就存；〔🔓 全部開〕〔🔒 全部鎖〕
   學生看到：沒登入「🔒 請先登入」、登入了自己的班鎖住「🔒 還沒開放」（不寫哪幾班）。鎖住的連任務也打不開；教學網站不鎖 */
var LKC=null,LKMSG='';
function lkCls(){var all=SC.CLASSES[F.g];if(!LKC||LKC.g!==F.g)LKC={g:F.g,c:F.cls?[F.cls]:all.slice()};return LKC.c}
function lkSt(k){var L=DATA.locks||{},cs=lkCls(),f=function(c){return (L[c]||[]).indexOf(k)>=0},n=cs.filter(f),G=SC.CLASSES[F.g].filter(f);return {n:n.length,all:cs.length,who:G,gall:G.length===SC.CLASSES[F.g].length}}
function paneL(){var T=RVT[F.g]||[],cs=lkCls(),G={},h;
  T.forEach(function(x){(G[x.grp]=G[x.grp]||[]).push(x)});
  h='<div class="note">在家複習網站（'+(F.g===3?'三':'四')+'年級複習）：<b class="lkg">🔓 綠色 ＝ 開</b>、<b class="lkr">🔒 紅色 ＝ 鎖</b>。按一下就換、馬上存好。鎖住的主題連任務也打不開；學生只看到「🔒 請先登入」或「🔒 還沒開放」，看不到鎖了哪幾班。教學網站（老師上課用）不鎖。</div>'+
   '<h3>① 哪幾班</h3><div class="lkrow">'+SC.CLASSES[F.g].map(function(c){return '<button data-lkc="'+c+'" class="'+(cs.indexOf(c)>=0?'on':'')+'">'+(cs.indexOf(c)>=0?'☑ ':'☐ ')+esc(SC.cname(c))+'</button>'}).join('')+'<button data-lkc="*">✅ 全年級</button></div>'+
   '<h3>② 一鍵</h3><div class="lkrow"><button data-lka="0" class="lkg">🔓 全部開</button><button data-lka="1" class="lkr">🔒 全部鎖</button><span id="lkmsg">'+LKMSG+'</span></div>'+
   '<h3>③ 一個一個（按一下 ＝ 換）</h3>';
  Object.keys(G).forEach(function(gr){h+='<h4 class="lkh">'+esc(gr)+'</h4><div class="lkgrid">'+G[gr].map(function(x){var st=lkSt(x.k),on=st.n===st.all&&st.all>0,part=st.n&&!on;
    return '<button data-lk="'+x.k+'" class="lkb '+(on?'lkr':part?'lky':'lkg')+'"><span class="lki">'+(on||part?'🔒':'🔓')+'</span><span class="lkt">'+esc(x.t)+'</span>'+
      (st.who.length&&!st.gall?'<em>只有 '+st.who.map(function(c){return esc(c)}).join('、')+' 鎖</em>':'')+'</button>'}).join('')+'</div>'});
  return h}
function lkPost(keys,on){var cs=lkCls();if(!cs.length){LKMSG='❗ 請先選班級';draw();return}
  var old=DATA.locks||{};DATA.locks=SC.lkSet(old,cs,keys,on);LKMSG='⏳ 存起來中…';draw();
  post({a:'lock',pw:PW,cls:cs,keys:keys,on:on}).then(function(j){if(j&&j.ok){DATA.locks=j.locks;LKMSG='✔ 存好了'}else{DATA.locks=old;LKMSG='❌ 存不起來（'+((j&&j.err)||'')+'）'}if(TAB==='l')draw()},
    function(){DATA.locks=old;LKMSG='📶 連不到伺服器，沒有存';if(TAB==='l')draw()})}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;if(TAB!=='l')return;
  if((b=c('[data-lkc]'))){var k=b.getAttribute('data-lkc'),cs=lkCls();LKMSG='';
    if(k==='*')LKC.c=SC.CLASSES[F.g].slice();else{var i=cs.indexOf(k);if(i>=0)cs.splice(i,1);else cs.push(k)}draw();return}
  if((b=c('[data-lka]'))){lkPost((RVT[F.g]||[]).map(function(x){return x.k}),b.getAttribute('data-lka')==='1');return}
  if((b=c('#pane [data-lk]'))){var kk=b.getAttribute('data-lk'),st=lkSt(kk);lkPost([kk],!(st.n===st.all&&st.all>0));return}
});
/* 這一個年級可以派的項目：老師看板的題庫（遊戲、📝 複習題、📘 Review 1、💼 職業單字） */
function tkItems(g){var G={};Object.keys(BANK).forEach(function(k){if(k.indexOf('g'+g)!==0&&k.indexOf('g*')!==0)return;
  var key=k.replace('g*','g'+g),c=SC.cat(key),gr=/^g.gm_job-/.test(key)?'💼 職業單字':c.t;if(g===3&&gr==='💼 職業單字')return;   /* 職業單字是四年級 Unit 2 的主題 */(G[gr]=G[gr]||[]).push([key,BANK[k].name])});return G}
function paneT(){
  var now=Date.now(),L=tkList().sort(function(a,b){var s=function(t){return t.from<=now&&now<=t.to?0:(t.from>now?1:2)};return s(a)-s(b)||a.from-b.from});
  var h='<div class="row" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button id="tkNew" style="background:#2A2208;border-color:var(--gold);color:#FFE9A8">➕ 派新任務</button>'+
   '<span class="note">有任務正在進行的班：只開任務裡的，其他鎖住 🔒；沒有任務正在進行 ＝ 全部開放。任務裡的東西過了截止時間就鎖住，<b>刪掉任務或改時間</b>才會再開。做到一半截止的，讓他做完、成績照記。</span></div>';
  if(!L.length)return h+'<div class="note" style="margin-top:12px">'+(F.g===3?'三':'四')+'年級'+(F.cls?' '+SC.cname(F.cls):'')+'還沒有任務 ➜ 學生全部都可以自由練習。</div>';
  return h+L.map(function(t){var st=t.from<=now&&now<=t.to?['on','🟢 進行中']:(t.from>now?['soon','⏳ 還沒開始']:['end','⛔ 已經截止']);
    var who='';(F.cls?[F.cls]:t.cls).forEach(function(c){var ids=(RCLS[c]||[]).slice(),done={};
      ALL.forEach(function(r){if(!r.x&&r.cls===c&&r.t>=t.from&&r.t<=t.to+SC.TKGRACE&&t.items.indexOf(r.set)>=0){(done[r.id]=done[r.id]||{})[r.set]=1}});
      Object.keys(done).forEach(function(id){if(ids.indexOf(id)<0)ids.push(id)});ids.sort();
      var all=ids.filter(function(id){return done[id]&&Object.keys(done[id]).length>=t.items.length});
      who+='<div class="who"><b style="min-width:7em">'+esc(SC.cname(c))+'　✅ '+all.length+(RCLS[c]?'／'+RCLS[c].length:'')+'</b>'+
       (ids.length?ids.map(function(id){var n=done[id]?Object.keys(done[id]).length:0;return '<span class="'+(n>=t.items.length?'ok':(n?'':'no'))+'">'+(n>=t.items.length?'✅':(n?'◐ '+n+'/'+t.items.length:'⏳'))+' '+who0(id)+'</span>'}).join(''):'<span>（試算表「名單」貼上這一班，就看得到誰還沒做）</span>')+'</div>'});
    return '<div class="tk '+st[0]+'"><h3><span class="st">'+st[1]+'</span>📌 '+esc(t.name)+'<span class="note" style="margin:0">'+t.cls.map(SC.cname).join('、')+'</span></h3>'+
     '<div class="tm">⏰ 從 '+tkT(t.from)+' 到 '+tkT(t.to)+'</div>'+
     '<div class="it">'+t.items.map(function(k){return '<span>'+esc(t.nm&&t.nm[k]||k)+'</span>'}).join('')+'</div>'+who+
     '<div class="bt"><button data-tke="'+esc(t.id)+'">✏️ 改時間／內容</button><button data-tkd="'+esc(t.id)+'">🗑 刪掉這個任務</button></div></div>'}).join('');
}
function who0(id){var n=nm(id);return esc(id.slice(3))+' 號'+(n?' '+esc(n):'')}
function tkForm(t){
  var now=Date.now(),d=new Date();d.setHours(23,59,0,0);
  t=t||{id:'',name:'課堂任務',g:F.g,cls:F.cls?[F.cls]:SC.CLASSES[F.g].slice(),items:[],from:Math.floor(now/6e4)*6e4,to:d.getTime()};
  var G=tkItems(t.g);
  $('#mbox').innerHTML='<button class="x" id="mx">✕ 關閉</button><h2 style="margin:0 0 6px">'+(t.id?'✏️ 改任務':'➕ 派新任務')+'（'+(t.g===3?'三':'四')+'年級）</h2><div id="tkf" data-id="'+esc(t.id)+'" data-g="'+t.g+'">'+
   '<h4>① 名稱</h4><div class="row"><input type="text" id="tkn" maxlength="30" value="'+esc(t.name)+'"><button data-tkq="課堂任務">🏫 課堂任務</button><button data-tkq="回家作業">🏠 回家作業</button></div>'+
   '<h4>② 哪幾班</h4><div class="row">'+SC.CLASSES[t.g].map(function(c){return '<label><input type="checkbox" name="tkc" value="'+c+'"'+(t.cls.indexOf(c)>=0?' checked':'')+'>'+esc(SC.cname(c))+'</label>'}).join('')+'<button id="tkAll">✅ 全年級</button></div>'+
   '<h4>③ 要做什麼（可以選好幾個）</h4><div class="gl">'+Object.keys(G).map(function(gr){return '<b>'+gr+'</b>'+G[gr].map(function(x){return '<label><input type="checkbox" name="tki" value="'+esc(x[0])+'" data-nm="'+esc(x[1])+'"'+(t.items.indexOf(x[0])>=0?' checked':'')+'>'+esc(x[1].replace(/^[三四]年級 ?/,''))+'</label>'}).join('')}).join('')+'</div>'+
   '<h4>④ 時間：從 幾月幾日幾點 到 幾月幾日幾點</h4><div class="row"><span>從</span><input type="datetime-local" id="tkf1" value="'+tkV(t.from)+'"><span>到</span><input type="datetime-local" id="tkf2" value="'+tkV(t.to)+'"></div>'+
   '<div id="tkmsg"></div><div class="row" style="margin-top:10px"><button id="tkSave" style="background:#0F3323;border-color:var(--ok)">💾 '+(t.id?'改好了，存起來':'派出去')+'</button></div></div>';
  $('#modal').classList.add('on');
}
function tkSave(){
  var f=$('#tkf'),g=+f.getAttribute('data-g'),cls=$$('input[name=tkc]:checked').map(function(x){return x.value}),its=$$('input[name=tki]:checked'),nmz={};
  its.forEach(function(x){nmz[x.value]=x.getAttribute('data-nm')});
  var a=Date.parse($('#tkf1').value),b=Date.parse($('#tkf2').value),m=$('#tkmsg');
  if(!cls.length){m.textContent='② 請選至少一班';return}if(!its.length){m.textContent='③ 請選至少一個要做的';return}
  if(!(a>0)||!(b>0)){m.textContent='④ 請填好開始和截止的時間';return}if(b<=a){m.textContent='④ 截止要比開始晚';return}
  var t={id:f.getAttribute('data-id')||('t'+Date.now()),name:$('#tkn').value.trim()||'任務',g:g,cls:cls,items:its.map(function(x){return x.value}),nm:nmz,from:a,to:b};
  m.style.color='var(--dim)';m.textContent='⏳ 存起來中…';
  post({a:'task',pw:PW,op:'set',t:t}).then(function(j){if(j.ok){DATA.tasks=j.tasks;$('#modal').classList.remove('on');draw()}else{m.style.color='';m.textContent='❌ 存不起來（'+(j.err||'')+'）'}},function(){m.style.color='';m.textContent='📶 連不到伺服器'});
}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#tkNew')){tkForm(null);return}
  if((b=c('[data-tke]'))){var id=b.getAttribute('data-tke');tkForm((DATA.tasks||[]).filter(function(x){return x.id===id})[0]);return}
  if((b=c('[data-tkd]'))){var id2=b.getAttribute('data-tkd');if(!confirm('刪掉這個任務？（刪掉以後，裡面的東西學生可以自由練習）'))return;
    post({a:'task',pw:PW,op:'del',id:id2}).then(function(j){if(j.ok){DATA.tasks=j.tasks;draw()}});return}
  if((b=c('[data-tkq]'))){$('#tkn').value=b.getAttribute('data-tkq');return}
  if(c('#tkAll')){$$('input[name=tkc]').forEach(function(x){x.checked=true});return}
  if(c('#tkSave')){tkSave();return}
  if(c('#zi')||c('#zo')){zoom(c('#zi')?.1:-.1);return}
  if(c('#go')){login($('#pw').value.trim());return}
  if(c('#out')){forget();PW='';DATA=null;$('#pw').value='';$('#lmsg').textContent='👋 已經登出';$('#app').hidden=true;$('#login').hidden=false;return}
  if((b=c('#fg button'))){F.g=+b.getAttribute('data-g');F.cls='';$$('#fg button').forEach(function(x){x.classList.toggle('on',x===b)});clsSel();draw();return}
  if((b=c('#tabs button'))){TAB=b.getAttribute('data-t');$$('#tabs button').forEach(function(x){x.classList.toggle('on',x===b)});draw();return}
  if((b=c('th[data-k]'))){var k=b.getAttribute('data-k');SORT={k:k,d:SORT.k===k?-SORT.d:1};draw();return}
  if((b=c('tr.row'))){person(b.getAttribute('data-id'));return}
  if((b=c('.kc'))||(b=c('.kr'))){person(b.getAttribute('data-pid'));return}
  if((b=c('[data-km]'))){KM=b.getAttribute('data-km');try{localStorage.setItem('kmode',KM)}catch(x){}draw();return}
  if((b=c('[data-bt]'))){BT=b.getAttribute('data-bt');draw();return}
  if((b=c('[data-bs]'))){BS=b.getAttribute('data-bs');draw();return}
  if((b=c('[data-hon]'))){hOpen(b.getAttribute('data-hon'));return}
  if(c('#hx')){hClose();return}
  if(c('#hnx')){if(HN&&HN.i<HN.P.length-1){HN.i++;hShow()}return}
  if(c('#hpv')){if(HN&&HN.i>0){HN.i--;hShow()}return}
  if(c('#hre')){if(HN){HN.i=0;HN.st=HON.pick('t');hShow()}return}
  if(c('#hsd')){HSND=HSND?0:1;lss0('hsnd',HSND);if(HSND)HON.ac();hCtl();return}
  if(c('#hnmb')){HNM=HNM?0:1;lss0('hnm',HNM);hCtl();if(HN){var k=HN.key,i=HN.i;hOpen(k);HN.i=i;hShow()}return}
  if(c('#hpr')){if(HN)hPrint();return}
  if(c('#pdb')){var d=$('#pdet');d.hidden=!d.hidden;$('#pdb').classList.toggle('on',!d.hidden);return}
  if(c('#pcp')||c('#pcx')){PCH.i=(PCH.i+(c('#pcx')?1:-1)+PCH.L.length)%PCH.L.length;pChart();return}
  if((b=c('.wq'))){qDetail(b.getAttribute('data-q'));return}
  if(c('#mx')||t.id==='modal'){$('#modal').classList.remove('on');return}
  if((b=c('#sh'))){$('#modal').classList.remove('on');SH=null;show(b.getAttribute('data-q'),0);return}
  if(c('#sn')){show(SH.k,SH.st+1);return}
  if(c('#sp')){show(SH.k,SH.st-1);return}
  if(c('#ss')){say3(qOf(SH.k).q);return}
  if(c('#sc')){$('#show').classList.remove('on');SH=null;SAYN++;stopSnd();return}
  if((b=c('[data-snd]'))){var qq=qOf(b.getAttribute('data-q')).q,w=b.getAttribute('data-snd');SAYN++;if(w==='al')lsn(qq);else{var oi=+w.slice(1);play(qq.ao&&qq.ao[oi],qq.o[oi])}return}
  if((b=c('[data-void]'))){var u=b.getAttribute('data-void'),v=b.getAttribute('data-v')==='1';b.disabled=true;
    post({a:'void',pw:PW,u:u,v:v}).then(function(j){if(j.ok){ALL.forEach(function(x){if(x.u===u)x.x=v});var op=!$('#pdet').hidden;draw();person(PID);if(op){$('#pdet').hidden=false;$('#pdb').classList.add('on')}}else b.disabled=false},function(){b.disabled=false});return}
  if(c('#bd')){var on=!DATA.boards;post({a:'set',pw:PW,boards:on}).then(function(j){if(j.ok){DATA.boards=j.boards;$('#bd').textContent='🏆 學生排行榜：'+(j.boards?'開':'關');$('#bd').classList.toggle('on',j.boards)}});return}
  if(c('#rf')){post({a:'teacher',pw:PW}).then(load);return}
  if(c('#dl')){excel();return}
});
$('#fc').addEventListener('change',function(){F.cls=this.value;draw()});
$('#fs').addEventListener('change',function(){F.src=this.value;draw()});
$('#fk').addEventListener('change',function(){F.cat=this.value;draw()});
$('#fp').addEventListener('change',function(){F.p=this.value;$('#f1').hidden=$('#f2').hidden=F.p!=='c';draw()});
$('#f1').addEventListener('change',draw);$('#f2').addEventListener('change',draw);
$('#pw').addEventListener('keydown',function(e){if(e.key==='Enter')login(this.value.trim())});
zoom(0);try{var sp=sessionStorage.getItem('tpw')||remembered();if(sp)login(sp)}catch(e){}
</script>
</body></html>`;
};
