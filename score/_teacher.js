/* score/_teacher.js — 老師看板 teacher/index.html 的樣板（score/_build.js 呼叫；不要手改 teacher/index.html）
 *
 * 使用者的決定（sentences/2026-10-07_C_設計與研究清單.md 第四節、Q1～Q18 照建議）：
 *   最上面：年級、班級、期間（本週／上週／這學期全部／自訂）、上課／課後 時間（2026-10-26 第二十七次：看 什麼 時候 做 的，課後班 400 到 17:30）＋〔⬇ 一鍵下載 Excel〕（〔🏆 學生排行榜 開／關〕2026-10-17 C9 第 9 題 B 刪掉）
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
const CERCSS = require('fs').readFileSync(require('path').join(__dirname, '_cer.css'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '..', 'rpg', '_fx.css'), 'utf8'), CERRT = require('fs').readFileSync(require('path').join(__dirname, '_cer_rt.js'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '..', 'rpg', '_fx_rt.js'), 'utf8');   /* 2026-10-20 第十四次：老師的電腦 沒有 🪙 ➜ 自己畫的 金幣（rpg/_fx_rt.js 最下面） */
const HONCSS = require('fs').readFileSync(require('path').join(__dirname, '_honor.css'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '_glory.css'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '_report.css'), 'utf8'), HONRT = require('fs').readFileSync(require('path').join(__dirname, '_honor_rt.js'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '_glory_rt.js'), 'utf8') + require('fs').readFileSync(require('path').join(__dirname, '_report_rt.js'), 'utf8');
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
/* 2026-10-16 C 第 9 題 甲 */
.bar1 h1{margin-right:6px}.mwrap{position:relative}
#morep{position:absolute;right:0;top:calc(100% + 8px);z-index:40;display:flex;flex-direction:column;gap:10px;background:#111;border:2px solid #444;border-radius:18px;padding:12px;min-width:15em;box-shadow:0 10px 30px rgba(0,0,0,.7)}
#morep[hidden]{display:none}#morep #zm{justify-content:center}#more.on{background:#0F2236;border-color:var(--acc)}
.fline{gap:6px;background:#0B0B0B;border:1px solid var(--ln);border-radius:16px;padding:6px 12px}
.fline .fic{font-size:clamp(20px,1.6vw,28px)}.fline i{font-style:normal;color:#777;font-weight:700}
.fline select{background:transparent;border:2px solid transparent;border-radius:12px;font-weight:700;color:#FFE9A8;padding:6px 8px;min-height:48px}
.fline select:hover,.fline select:focus{border-color:#555;background:#141414}
.tile .k{display:block}.tiles{position:relative}
.tile .d{display:none}.tiles.help .tile .d{display:block}
#thelp{position:absolute;right:6px;top:6px;min-height:44px;min-width:44px;padding:4px 10px;font-size:clamp(18px,1.4vw,24px)}
.bdg{font-style:normal;display:inline-block;min-width:1.5em;margin-left:8px;padding:0 .4em;border-radius:999px;background:#E53935;color:#fff;font-size:.8em;line-height:1.5;text-align:center}
.bdg[hidden]{display:none}
.alert1{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 10px;padding:10px 14px;border:2px solid #FF6B6B;background:#2A1010;border-radius:14px;font-size:clamp(19px,1.5vw,28px);font-weight:700;cursor:pointer}
.alert1 small{font-weight:400;color:#FFC8C8}
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
.tabs button{font-size:clamp(19px,1.6vw,30px);padding:8px clamp(10px,1.2vw,24px);min-height:56px}
.tabs button.on{background:#2A2208;border-color:var(--gold);color:#FFE9A8}
.rwd{border:1px solid var(--ln);border-radius:16px;padding:12px 14px;margin:0 0 14px;background:rgba(255,255,255,.03)}.rwd h3{margin:0 0 8px;font-size:1.15em;color:#FFE9A8}
.bsec{grid-template-columns:auto 1fr 6.5em;row-gap:6px;padding:8px 0;border-bottom:1px solid #2A2A2A}.bsec .l{grid-column:1/-1;white-space:normal;overflow:visible}
.tbw{display:inline-flex;align-items:center;gap:4px;margin-left:8px;padding:0 10px;border:2px solid #4A5A7A;border-radius:999px;background:#0E1626;vertical-align:middle}.tbw small{font-size:.8em;color:#CFE0FF;white-space:nowrap}.tbw svg{height:1.2em;width:auto}
.hab{display:flex;gap:8px;flex-wrap:wrap}.hab em,.abp em{font-style:normal;white-space:nowrap;border-radius:10px;padding:2px 10px;font-size:clamp(18px,1.35vw,24px);border:2px solid #555;background:#141414}
.hab em.ok,.abp em.ok{border-color:#3BD16F;color:#BFFFD8}.hab em.no,.abp em.no{border-color:#FF6B6B;color:#FFC9D2;background:#2A1010}
.abbox .abt{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:clamp(24px,2vw,36px)}.abbox .abt b.ok{color:#BFFFD8}.abbox .abs{font-size:clamp(20px,1.55vw,28px);color:#FFE9A8;margin:6px 0}
.abnt{font-size:clamp(22px,1.8vw,32px);color:#FF9AA8;font-weight:700;margin-top:10px}.abno{display:grid;gap:8px;margin-top:6px}.abp{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;font-size:clamp(20px,1.6vw,30px)}.abp>span{display:flex;flex-wrap:wrap;gap:8px}
.txq{min-height:52px;font-size:clamp(20px,1.6vw,28px)!important;border:2px solid #FFD54A!important;background:#2A2208!important;border-radius:12px;padding:4px 14px;font-weight:700;cursor:pointer}
#txp{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.86);display:flex;align-items:center;justify-content:center;padding:16px}#txp[hidden]{display:none}
.txb{position:relative;width:min(1100px,100%);max-height:100%;overflow:auto;background:linear-gradient(160deg,#141E34,#0A0F1C);border:3px solid #FFD54A;border-radius:22px;padding:22px clamp(14px,3vw,40px);text-align:center}
.txx{position:absolute;right:10px;top:10px;min-height:52px;font-size:22px!important}.txn{display:flex;gap:8px;justify-content:center;margin:4px 0 12px}.txn i{width:16px;height:16px;border-radius:50%;background:#333}.txn i.on{background:#FFD54A}.txn i.ok{background:#3BD16F}
.txc{font-size:clamp(28px,3vw,46px);font-weight:700;color:#FFE07A;margin:10px 50px 18px;animation:txIn .5s ease-out}.txv{display:flex;flex-direction:column;align-items:center;gap:16px;min-height:220px;justify-content:center;font-size:clamp(24px,2.2vw,36px)}
.txv>*{animation:txIn .6s ease-out both}.txv>*:nth-child(2){animation-delay:.6s}.txv>*:nth-child(3){animation-delay:1.2s}@keyframes txIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.txctl{display:flex;gap:12px;justify-content:center;margin-top:20px}.txctl button{min-height:60px;min-width:9em;font-size:clamp(22px,1.8vw,30px)!important}
.txm{display:grid;gap:6px;width:min(100%,900px);font-size:clamp(22px,2vw,30px)}.txm .ml{text-align:left;line-height:1.35}.txm .ml b{color:#fff;font-size:1.25em}
.txm .mv{display:inline-block;padding:0 12px;border-radius:999px;font-weight:800;white-space:nowrap}.txm .mv.r{background:#5A1A22;color:#FFB3B3}.txm .mv.y{background:#5A4808;color:#FFE58A}.txm .mv.g{background:#1E5A34;color:#A8F5C4}
.txm .mt{position:relative;display:flex;margin-top:26px;border-radius:12px;overflow:visible}.txm .mt span{display:flex;align-items:center;justify-content:center;min-height:42px;padding:2px 4px;font-size:clamp(16px,1.4vw,22px);font-weight:700;color:#0B1220;text-align:center;line-height:1.1}
.txm .mt span.r{background:#FF8A8A;border-radius:12px 0 0 12px}.txm .mt span.y{background:#FFD24A}.txm .mt span.g{background:#5DE89A;border-radius:0 12px 12px 0}.txm .mt span.g:first-child{border-radius:12px 0 0 12px}.txm .mt span.r:last-child{border-radius:0 12px 12px 0}
.txm .mt i.pt{position:absolute;top:-30px;left:0;transform:translateX(-50%);font-style:normal;font-size:28px;color:#fff;text-shadow:0 0 6px #000;animation:txP 1.4s ease-out .3s forwards}@keyframes txP{to{left:var(--p)}}
.txtl{display:inline-flex;gap:14px;padding:12px 18px;border-radius:40px;background:#0A0F18;border:4px solid #3A4A60;margin-bottom:6px}.txtl i{width:58px;height:58px;border-radius:50%;opacity:.18}.txtl i.r{background:#FF4A4A}.txtl i.y{background:#FFD24A}.txtl i.g{background:#3BD16F}
.txtl i.on{opacity:1;box-shadow:0 0 22px currentColor,0 0 44px currentColor;animation:txOn .8s ease-out}.txtl i.r.on{color:#FF4A4A}.txtl i.y.on{color:#FFD24A}.txtl i.g.on{color:#3BD16F}@keyframes txOn{from{opacity:.18;transform:scale(.6)}}
.txtl.cyc i{animation:txCy 3s steps(1) infinite}.txtl.cyc i.y{animation-delay:1s}.txtl.cyc i.g{animation-delay:2s}@keyframes txCy{0%{opacity:1;box-shadow:0 0 24px #fff}33%,100%{opacity:.18;box-shadow:none}}
.txd{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.txd i{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-weight:700;background:#1E5A34;border:3px solid #5DE89A;opacity:0;animation:txIn .3s ease-out forwards}
.txd i.fa{background:#4A1A22;border-color:#FF6B6B}.txd i.ok{background:#1E5A34;border-color:#5DE89A}.txd i.r{background:#4A1A22;border-color:#FF6B6B}.txd i.g{background:#1E5A34;border-color:#5DE89A}
.txs{color:#FFE9A8}.txbig{font-size:110px;line-height:1}.txsum{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center}.txsum span{padding:10px 18px;border:3px solid #3A5A8A;border-radius:16px;background:#121C30}.txsum span.gd{border-color:#FFD54A;font-size:1.4em}.txsum i{font-style:normal;color:#FFE07A}
.txrow{padding:10px 22px;border-radius:16px;border:3px solid #555;background:#121C30}.txrow.ok{border-color:#3BD16F}.txrow.no{border-color:#FF6B6B}
.txl{display:grid;gap:8px;min-width:min(100%,520px)}.txl div{padding:6px 16px;border-radius:12px;border:2px solid #3A5A8A;background:#121C30;text-align:left}.txl .x{border-color:#FF6B6B;text-decoration:line-through;opacity:.6}.txl .in{border-color:#3BD16F;color:#BFFFD8}
.txtb{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}.txtb span{display:flex;flex-direction:column;align-items:center;gap:6px;opacity:0;animation:txIn .5s ease-out forwards}.txtb svg{height:64px;width:auto}
.ltw{border:3px solid #555;border-radius:16px;padding:12px 16px;margin:8px 0 12px;display:grid;gap:12px;background:#111}.ltw.l0{border-color:#FF6B6B;background:#2A1010}.ltw.l1{border-color:#FFD24A;background:#2A2208}.ltw.l2{border-color:#3BD16F}
.ltw .ltt{display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:clamp(24px,2vw,34px);font-weight:700}.ltw .ltt b{color:#FFE9A8}
@media (max-width:700px){.txd i{width:40px;height:40px}.txtl i{width:44px;height:44px}}
.abbox{border:2px solid #FFD54A;border-radius:14px;padding:10px 14px;margin:8px 0 12px;background:rgba(255,213,74,.08);line-height:1.5}.abno{margin-top:6px;display:flex;flex-wrap:wrap;gap:6px 18px;color:#FFC9D2}.abv{margin-left:10px;color:#BFFFD8;font-size:.85em;white-space:nowrap}
.rwr{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;padding:8px 0;border-top:1px solid var(--ln);font-size:1.05em}.rwr:first-of-type{border-top:0}.rwr .cid{font-size:1.2em;min-width:2.6em}
.rwr button{min-height:56px;padding:4px 18px;border-radius:999px;border:2px solid #FFD54A;background:#3A2E08;color:#FFE9A8;font-size:1em}.rwr button:disabled{opacity:.45;border-color:#555;background:#222;color:#aaa}
.rwr small{color:#BFD0E2}.rwmsg{color:#7BF0A8;font-size:1.05em;min-height:1.4em}
.pane{background:var(--pn);border:1px solid var(--ln);border-radius:18px;padding:14px}
.note{color:#C8C8C8;font-size:clamp(18px,1.35vw,24px);margin:6px 0;line-height:1.5}
.tw{overflow-x:auto;-webkit-overflow-scrolling:touch}
table{border-collapse:collapse;width:100%;font-size:clamp(19px,1.5vw,28px)}
th,td{padding:10px 12px;border-bottom:1px solid #262626;text-align:right;white-space:nowrap}
th{position:sticky;top:0;background:#151515;color:#DDD;cursor:pointer;user-select:none}
th:first-child,td:first-child{text-align:left}
th[data-k="nm"],td.nmc{text-align:left}td.idc{font-weight:700;letter-spacing:.02em}.cid{font-weight:700}
th.s{background:#3A2E08;color:#FFE9A8;box-shadow:inset 0 -4px 0 var(--gold)}
th small{display:block;font-size:.62em;color:var(--gold);font-weight:700}
tr.row{cursor:pointer}tr.row:hover td,tr.row:active td{background:#141A20}
td .mb{display:inline-block;height:.55em;border-radius:6px;background:var(--bar);vertical-align:middle;margin-left:8px}
td.lo{color:var(--no)}
.bars{display:flex;flex-direction:column;gap:8px;margin:6px 0 18px}
.br{display:grid;grid-template-columns:minmax(9em,22em) minmax(4em,1fr) 6.5em;gap:12px;align-items:center;font-size:clamp(19px,1.5vw,28px);font-weight:700}
.br .t{height:1.2em;background:#141414;border-radius:6px;overflow:hidden}
.br .t i{display:block;height:100%;background:var(--bar);border-radius:0 4px 4px 0}
.br.hi .t i{background:var(--gold)}.br.ok .t i{background:var(--ok)}.br.no .t i{background:var(--no)}
.br .v{text-align:right;color:#DDD}
.br .l{white-space:normal;overflow:visible;overflow-wrap:anywhere}   /* 2026-10-22 第二十一次 10(2)：名字 右邊 不再 被 切成「…」，太長 就 換行 */
h3{margin:18px 0 8px;font-size:clamp(22px,1.8vw,32px)}
/* 2026-10-22 第二十一次 第 11 點：要關心〔📊 圖表分析〕秒懂 動畫 */
.kan{border:3px solid #FFD24A;border-radius:18px;background:radial-gradient(ellipse at 50% 0,#1E2A40,#0B0F18 70%);padding:14px 16px;margin:8px 0 14px}
.kanst{min-height:clamp(300px,42vh,520px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center}
.kant{font-size:clamp(26px,2.4vw,44px);font-weight:900;line-height:1.35;animation:kanIn .5s ease-out both}.kant b{color:#FFD24A}
.kanb{width:100%;display:flex;flex-direction:column;align-items:center;gap:14px}
@keyframes kanIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes kanPop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.2)}100%{opacity:1;transform:none}}
.kdots{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;max-width:1100px}
.kdots i{width:clamp(48px,4.2vw,72px);height:clamp(48px,4.2vw,72px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:900;font-size:clamp(20px,1.7vw,30px);color:#111;opacity:0;animation:kanPop .45s ease-out forwards}
.kdots i.no{background:#FF5A5A;box-shadow:0 0 14px #FF5A5A}.kdots i.md{background:#FFD24A}.kdots i.ok{background:#3BD16F}.kdots i.nd{background:#555;color:#DDD}
.klg2{display:flex;flex-wrap:wrap;justify-content:center;gap:12px 22px}.klg2 span{font-size:clamp(22px,1.9vw,34px);font-weight:800;opacity:0;animation:kanPop .4s ease-out forwards}.klg2 b{font-size:1.3em}
.klg2 .no b{color:#FF7A7A}.klg2 .md b{color:#FFD24A}.klg2 .ok b{color:#3BD16F}.klg2 .nd b{color:#BBB}
.kredc{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:12px;width:100%;max-width:1300px}
.kredc button{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left;background:#2A1010;border:3px solid #FF5A5A;border-radius:16px;padding:10px 16px;color:#fff;font:inherit;font-size:clamp(22px,1.8vw,32px);font-weight:800;cursor:pointer;opacity:0;animation:kanPop .45s ease-out forwards}
.kredc em{font-style:normal;color:#FF9A9A;font-size:1.2em}.kredc small{font-size:.8em;color:#FFD0D0;font-weight:700}
.kmore{font-size:clamp(20px,1.6vw,28px);color:#FFD0D0}.kyay{font-size:clamp(60px,6vw,110px);animation:kanPop .6s ease-out .3s both}
.kbig{font-size:1.5em}
.kgau{position:relative;width:min(100%,1100px);padding-top:36px}
.kz{display:flex;height:clamp(48px,5vh,70px);border-radius:14px;overflow:hidden}.kz span{display:flex;align-items:center;justify-content:center;font-size:clamp(18px,1.5vw,28px);font-weight:900;color:#111}
.kz .r{background:#FF7A7A}.kz .y{background:#FFD24A}.kz .g{background:#3BD16F}
.kptr{position:absolute;top:0;left:0;width:0;height:0;border-left:18px solid transparent;border-right:18px solid transparent;border-top:30px solid #fff;margin-left:-18px;animation:kPtr 1.4s cubic-bezier(.2,1.2,.4,1) .3s forwards;filter:drop-shadow(0 0 8px #fff)}
@keyframes kPtr{to{left:var(--x)}}
.kbar{position:relative;width:min(100%,1100px);height:clamp(54px,6vh,80px);border-radius:40px;background:#222;border:3px solid #444;overflow:visible}
.kbar i{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:40px;background:linear-gradient(90deg,#3BA0FF,#3BD16F);animation:kBar 1.6s ease-out .3s forwards}@keyframes kBar{to{width:var(--w)}}
.kflag{position:absolute;right:0;top:-44px;font-size:clamp(20px,1.6vw,30px);font-weight:900}
.kday{font-size:clamp(22px,1.8vw,32px);font-weight:800;animation:kanIn .5s ease-out 1.6s both}.kday b{color:#FFD24A}
.k5r{display:flex;flex-wrap:wrap;justify-content:center;gap:14px}
.k5r>div{width:clamp(150px,13vw,220px);display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px;border-radius:16px;background:#141C2A;border:3px solid #2A3A5A;opacity:0;animation:kanPop .45s ease-out forwards}
.k5r .ci{font-size:clamp(40px,3.4vw,60px);height:1.2em;display:flex;align-items:center}.k5r .ci svg{height:1.1em;width:auto}
.k5r small{font-size:clamp(18px,1.4vw,24px);font-weight:700;text-align:center}.k5r b{font-size:clamp(22px,1.8vw,32px)}
.k5r .wk{border-color:#FFD24A;box-shadow:0 0 22px rgba(255,210,74,.7);animation:kanPop .45s ease-out forwards,kWk .8s ease-in-out 1.6s 3}
@keyframes kWk{50%{transform:scale(1.12) rotate(-3deg)}}
.ktip{font-size:clamp(24px,2vw,36px);font-weight:900;color:#FFD24A;animation:kanIn .5s ease-out 2s both}
.kanct{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px;margin-top:10px}
.kanct button{min-height:56px;padding:6px 18px;font-size:clamp(20px,1.6vw,28px);font-weight:800;border-radius:14px;border:2px solid #556;background:#1A2232;color:#fff;cursor:pointer}
.kanpg{font-size:clamp(20px,1.6vw,28px);color:#AAB}
.kdet>.kgh{font-size:clamp(20px,1.6vw,28px)}
@media (prefers-reduced-motion:reduce){.kan *{animation-duration:.01s!important;animation-delay:0s!important}}
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
.kc b{font-size:1em;letter-spacing:.02em}.kc .kn{font-size:.9em;color:#F2F2F2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.kc .kw{font-size:1.45em;font-weight:700;color:#fff;white-space:nowrap;line-height:1.15;max-width:100%;overflow:hidden}.kc .kw small{font-size:.55em}
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
.ka3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:6px 0 4px}.ka3 div{background:#101418;border:2px solid #263038;border-radius:16px;padding:8px;text-align:center;font-size:clamp(19px,1.5vw,26px)}
.ka3 b{display:block;font-size:clamp(38px,3.4vw,60px);line-height:1.1}.ka3 small{font-size:.5em;color:#AAA}.ka3 svg{height:1.1em;width:auto;vertical-align:middle}.kred{color:#FF8A8A}
.knote{font-size:clamp(18px,1.35vw,24px);color:#BFD3E6;margin:-2px 0 8px}
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
.kgh{font-size:clamp(22px,1.8vw,32px);font-weight:700;margin:10px 0 4px;width:100%;text-align:left;border-radius:14px;display:flex;justify-content:space-between}
.kgrp .kgl{display:none}.kgrp.open .kgl{display:block}.kgrp.open .kar{transform:rotate(180deg)}.kar{display:inline-block;transition:transform .2s}
.kblk{background:#0E1114;border:2px solid #222A31;border-radius:18px;padding:10px 12px;margin:10px 0}
.khd{font-size:clamp(22px,1.8vw,32px);font-weight:700;color:#FFE9A8;margin:2px 0 8px}
.kac{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.kac button.on{background:#2A2208;border-color:var(--gold);color:#FFE9A8}
.kr{display:grid;grid-template-columns:minmax(7.5em,1.2fr) minmax(0,1.4fr) 5.6em 5.2em minmax(0,1.6fr);gap:10px;align-items:center;width:100%;text-align:left;padding:8px 12px;margin:6px 0;border-radius:14px;
  border:3px solid #333;background:#121212;color:#fff;font-size:clamp(20px,1.6vw,28px);cursor:pointer;animation:kin .35s ease-out both}
.kr.no{border-color:#FF6B6B;background:#2A1010}.kr.md{border-color:#FFD24A;background:#221C08}.kr.ok{border-color:#3BD16F;background:#0D1F14}.kr.nd{border-color:#555;background:#161616;color:#CCC}
.kr .t{height:.9em;background:#1A1A1A;border-radius:6px;overflow:hidden;position:relative}.kr .t i{display:block;height:100%;animation:grow 1.2s ease-out backwards}
.kr .kh2{display:flex;align-items:center;gap:4px;white-space:nowrap}.kr .kh2 svg{height:1.3em;width:auto}
.kr small{color:#DDD;font-size:.85em}
.kr.kth{background:none;border-color:transparent;cursor:default;animation:none;color:#BDBDBD;padding-top:0;padding-bottom:0}.kr.kth svg{height:1.2em;width:auto;vertical-align:middle}
@media (max-width:1100px){.ka4,.kc5{grid-template-columns:repeat(2,minmax(0,1fr))}.kr{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
/* 2026-10-17 C8 另 2(3)：圖表分析 ② 一項一列（圖示｜一句話＋真的數字｜長條），③ 一個人一列三格 */
.kc5{display:flex;flex-direction:column;gap:8px;margin:4px 0 6px}
.kc5 .k5{display:grid;grid-template-columns:clamp(40px,3.4vw,56px) minmax(0,1.5fr) minmax(0,1fr);align-items:center;gap:12px;text-align:left;padding:8px 14px;font-size:clamp(20px,1.6vw,28px);background:#101418;border:2px solid #263038;border-radius:14px}
.kc5 .k5 .ci{height:clamp(34px,2.8vw,48px);font-size:clamp(30px,2.4vw,42px);display:flex;align-items:center;justify-content:center}.kc5 .k5 .ci svg{height:100%;width:auto}
.kc5 .k5t b{font-size:1.35em;color:#fff}.kc5 .k5t small{color:#AAB;font-size:.8em;margin-left:4px;white-space:nowrap}
.kc5 .k5 .t{height:clamp(18px,1.4vw,24px);background:#1A2230;border-radius:999px;overflow:hidden;margin:0;border:2px solid #34404C}.kc5 .k5 .t i{background:#4D8FCC}
.kc5 .k5.wk{border-color:var(--gold);background:#2A2208}.kc5 .k5.wk .t i{background:var(--gold)}
.kc5 .k5w{grid-column:2/4;color:#FFE07A;font-weight:700}
.kr{grid-template-columns:minmax(0,1.3fr) minmax(0,.8fr) minmax(0,1.3fr)!important;font-size:clamp(20px,1.6vw,28px)}
.kr .kv b{font-size:1.4em}.kr .ky{color:#E8E8E8}.kr .kn2 b{margin-right:.3em}
@media (max-width:900px){.kc5 .k5{grid-template-columns:clamp(36px,6vw,48px) minmax(0,1fr)}.kc5 .k5 .t{grid-column:2/3}.kc5 .k5w{grid-column:1/3}}
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
button.lvq{background:#0E2240;border-color:#5AB0FF;color:#D6EBFF}
#lvov{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;padding:16px}#lvov[hidden]{display:none}
.lvbx{background:#0B1118;border:4px solid #5AB0FF;border-radius:26px;padding:18px 24px;text-align:center;max-width:760px;width:100%;max-height:96vh;overflow:auto}
.lvbx h2{font-size:clamp(28px,4vh,42px);color:#FFE07A;margin:4px 0 10px}.lvqr{background:#fff;border-radius:20px;padding:10px;width:min(100%,52vh,460px);aspect-ratio:1;margin:0 auto}.lvqr svg{width:100%;height:100%;display:block}
.lvu{font-size:20px;color:#9FB3C8;word-break:break-all;margin:6px 0}.lvst{list-style:none;padding:0;margin:10px 0;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;font-size:clamp(20px,2.6vh,28px)}.lvst li{background:#16212D;border:2px solid #34475C;border-radius:14px;padding:6px 14px}
.lvbt{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}.lvbt button,.lvbt a{min-height:60px;font-size:24px}
a.lvb{display:inline-flex;align-items:center;min-height:52px;padding:6px 16px;border-radius:14px;background:#0E2240;border:2px solid #5AB0FF;color:#D6EBFF;text-decoration:none;font-size:1em}
/* 2026-10-18 第十二次（老師 2、3）：〔📱 現場 QR〕視窗 重新 排：左 QR＋〔📋 複製 網址〕、右 ① ② ③ 大 編號；下面 點 班級 ➜ 座號 格子 亮 ＝ 已經 加入；最上面 醒目〔⚡ 開 現場任務 大螢幕〕 */
.lvbx{max-width:1180px}.lvgrid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.4fr);gap:20px;align-items:start}
@media (max-width:600px){.lvgrid{grid-template-columns:1fr}}
.lvbx .lvqr{width:min(100%,30vh,300px)}.lvbx h2{margin:0 0 6px}.lvbx{padding:12px 20px}
ol.lvst2{list-style:none;padding:0;margin:0;display:grid;gap:12px;text-align:left}
ol.lvst2 li{display:flex;align-items:center;gap:14px;background:#16212D;border:3px solid #34475C;border-radius:18px;padding:4px 14px;font-size:clamp(22px,2.8vh,30px)}ol.lvst2{gap:8px}
ol.lvst2 li b{flex:0 0 auto;width:54px;height:54px;border-radius:50%;background:#FFD54A;color:#231600;display:inline-flex;align-items:center;justify-content:center;font-size:32px}
#lvcp{min-height:56px;font-size:22px;margin-top:6px}
.lvwho{margin:8px 0 8px;text-align:left}.lvwt{font-size:clamp(22px,2.8vh,30px);color:#FFE9A8;margin-bottom:6px}
#lvcls{display:flex;flex-wrap:wrap;gap:8px}#lvcls button{min-height:48px;font-size:20px;padding:2px 12px}#lvcls button.on{background:#2A2208;border-color:#FFD54A;color:#FFE9A8}
#lvseat .lvn{font-size:clamp(22px,2.8vh,30px);margin:8px 0}
.lvs{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:6px}.lvs span{aspect-ratio:2.2;border-radius:12px;background:#111A26;border:3px solid #2A3646;display:flex;align-items:center;justify-content:center;font-size:clamp(18px,2.4vh,26px);color:#5D6B7C}
.lvs span.on{background:#14532D;border-color:#3BD16F;color:#fff}
#cbx{position:fixed;inset:0;z-index:90;background:radial-gradient(circle at 50% 0,#1B2A44,#060A12 70%);display:none;overflow:auto}#cbx.on{display:block}
.cbw{max-width:1500px;margin:0 auto;padding:clamp(14px,3vh,36px) clamp(16px,3vw,48px);color:#fff}
.cbh{display:flex;align-items:center;gap:18px;flex-wrap:wrap;animation:cbIn .6s both}.cbh .cbi{font-size:clamp(56px,8vh,96px)}.cbh b{font-size:clamp(36px,5.4vh,64px)}.cbh small{font-size:clamp(20px,2.4vh,28px);color:#9FB4C8;margin-left:auto}
.cbl{display:flex;flex-direction:column;gap:clamp(10px,1.6vh,18px);margin:clamp(14px,3vh,34px) 0}
.cbr{display:grid;grid-template-columns:clamp(56px,6vw,84px) clamp(110px,11vw,170px) 1fr clamp(130px,13vw,200px) auto;align-items:center;gap:14px;font-size:clamp(26px,3.6vh,44px);opacity:0;animation:cbIn .5s var(--d) both}
.cbr .cbk{text-align:center;font-weight:700;color:#9FB4C8}.cbr .cbn{font-weight:700;color:var(--cc)}.cbr .cbv{text-align:right;font-weight:700}
.cbt{height:clamp(34px,5vh,58px);background:rgba(255,255,255,.08);border-radius:999px;overflow:hidden}.cbt i{display:block;height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,var(--cc),#fff8);animation:cbGrow 1.1s var(--d) cubic-bezier(.2,.8,.2,1) forwards}
.cbr.top .cbt{box-shadow:0 0 0 3px #FFD54A,0 0 14px rgba(255,213,74,.45)}.cbr.top .cbk{font-size:1.2em}
.cbtag{font-size:max(18px,.62em);font-weight:700;padding:4px 12px;border-radius:999px;white-space:nowrap}.cbtag.g{background:#FFD54A;color:#3A2A00}.cbtag.y{background:#2E5A8A;color:#fff}
.cbs{font-size:clamp(26px,3.6vh,42px);text-align:center;padding:14px;border-radius:18px;background:rgba(255,255,255,.07);opacity:0;animation:cbIn .6s var(--d,1.4s) both}
.cbnv{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:clamp(12px,2.4vh,26px)}.cbnv button{min-height:60px;font-size:clamp(20px,2.4vh,26px);padding:0 22px}
.cbgo{margin-left:12px;min-height:48px;font-size:clamp(18px,1.4vw,22px);vertical-align:middle}.cbgo.big{min-height:56px}
@keyframes cbGrow{to{width:var(--w)}}@keyframes cbIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.cbr,.cbs,.cbh{animation:none;opacity:1}.cbt i{animation:none;width:var(--w)}}
a.thome{display:inline-flex;align-items:center;gap:4px;min-height:52px;padding:6px 16px;border-radius:999px;background:linear-gradient(#FFE07A,#E0A800);color:#3A2A00;font-size:20px;font-weight:700;text-decoration:none;white-space:nowrap;box-shadow:0 3px 0 #8A6400}/* 2026-10-26 第二十九次 第 12 點：回 教師 總首頁 */
a.lvgo{display:inline-block;line-height:40px;font-size:20px;min-height:52px;padding:6px 18px;border-radius:999px;background:linear-gradient(#FF8A3D,#D9381E);color:#fff;border:0;text-decoration:none;font-weight:700;box-shadow:0 0 0 3px #5A1A00,0 0 16px #FF6B3D88;white-space:nowrap}
@media (max-width:1200px){.lvlg{display:none}.bar1 .lvsm{display:none}a.thome{padding:6px 12px}}/* 第二十九次：多了〔🏠 總首頁〕，1024 寬 也要 一條 */@media (max-width:900px){.lvsm,.lvsm2{display:none}.bar1 h1{display:none}a.lvgo{padding:6px 8px;font-size:.9em}#lvqr{padding-left:10px;padding-right:10px;min-width:0}}
button.lkt,b.lkt{background:#0E2240!important;border-color:#5AB0FF!important;color:#D6EBFF!important}
.lkb .lkt0{flex:1;min-width:0}.lkb em.lktm{color:#BFE0FF}
.lkw{border:3px dashed #5AB0FF;border-radius:16px;padding:8px 12px;margin:6px 0}
.lkrow input[type=datetime-local]{font:inherit;font-size:max(18px,1em);min-height:52px;background:#0B1118;color:#fff;border:2px solid #4A5A6C;border-radius:12px;padding:4px 10px}
.okn{font-size:.75em;color:#FFE9A8;margin-left:8px}.okclr{font-size:.8em;margin-left:10px}
details.okg{border:2px solid #34404C;border-radius:16px;margin:8px 0;padding:4px 12px;background:#0B1118}
details.okg summary{cursor:pointer;font-size:max(18px,1.05em);min-height:48px;display:flex;align-items:center;gap:6px}
.okgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr));gap:8px;margin:6px 0 10px}
button.oki{text-align:left;min-height:52px}button.oki.on{background:#2A2208;border-color:var(--gold);color:#FFE9A8}
button.okgo{background:#0F3323;border:4px solid var(--ok);font-size:1.25em;min-height:64px;padding:6px 30px}
.oklst{display:grid;gap:8px}.okl{display:grid;grid-template-columns:8.5em 1.6fr 1fr 1.6fr 1.6fr 1fr auto;gap:8px;align-items:center;background:#111;border-radius:14px;padding:8px 12px}
.okl .okb{display:flex;gap:6px}
@media (max-width:1100px){.okl{grid-template-columns:1fr 1fr}.okl .okb{justify-content:flex-end}}
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
/* 2026-10-24 第二十三次第 2 點：這一行原本寫 .kp，跟〔要關心〕燈號（span.kp）撞名 ➜ 燈號被壓成 1.7em 寬、字直直排下來；改成只管 svg */
svg.kp{width:1.7em;height:1.06em;vertical-align:-.22em}.pv svg.kp{width:1.6em;height:1em}
.lt{font-size:1.15em}
td.nmc{text-align:left}
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
.delw{margin-top:26px;border-top:2px dashed #3A2A2A;padding-top:16px}.delb{background:#2A1010;border-color:#B04040;color:#FFB0B0}.delb:disabled{opacity:.4}
#delc{background:#1A0A0A;border:2px solid #B04040;border-radius:18px;padding:14px 16px}.delq{font-size:clamp(20px,1.6vw,28px);line-height:1.5}.delq small{color:#CFA8A8;font-size:.8em}
.delr{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:12px;font-size:clamp(19px,1.5vw,26px)}#deli{width:6.5em;font-size:1.3em;text-align:center;letter-spacing:.15em}#delm{margin-top:8px;color:#FFB0B0;font-weight:700}
#toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%);background:#0F3323;border:2px solid var(--ok);border-radius:16px;padding:12px 24px;font-size:24px;font-weight:700;z-index:99;opacity:0;transition:opacity .3s;pointer-events:none}#toast.on{opacity:1}
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
/* 🏆 頒獎典禮（2026-10-16 C3 第 4 題：舞台燈光） */
.cerb{background:linear-gradient(#1A1206,#0B0B0B);border:2px solid #6E5A10;border-radius:20px;padding:12px 14px;margin:0 0 14px}
.cawd{display:grid;grid-template-columns:repeat(auto-fit,minmax(15em,1fr));gap:10px;margin:8px 0}
.caw{background:#120E06;border:2px solid #8A6A10;border-radius:16px;padding:10px 12px;text-align:center}
.caw .ccn{display:inline-block;background:linear-gradient(#C8102E,#8E0B20);color:#FFE9A8;border-radius:10px;padding:2px 16px;font-size:clamp(22px,1.9vw,32px);font-weight:700}
.caw .ccs{color:#FFE9A8;font-size:clamp(18px,1.4vw,24px);margin:4px 0}
.caw .cwn{font-size:clamp(30px,2.8vw,48px);font-weight:700;background:linear-gradient(#FFF4C2,#FFC93C 55%,#C98A12);-webkit-background-clip:text;background-clip:text;color:transparent}
.caw .ccl{display:flex;flex-direction:column;gap:2px;font-size:clamp(18px,1.4vw,24px);color:#E6E6E6;margin-top:4px}
.cergo{display:block;margin:10px auto 4px;font-size:clamp(24px,2.2vw,36px);padding:12px 40px;min-height:64px;background:linear-gradient(#FFD54A,#E8A900);color:#2A1A00;border-color:#FFE9A8;box-shadow:0 0 22px rgba(255,200,60,.45)}
#cer{position:fixed;inset:0;z-index:70;background:#000;display:none;flex-direction:column}
#cer.on{display:flex}
/* 2026-10-25 第二十五次：🎁 全班 獎勵 5 張大卡＋整頁＋頒獎典禮；📊 最受歡迎 */
.rwhd{font-size:clamp(22px,2.6vw,30px);line-height:1.45;margin:4px 0 14px;color:#FFE9A8}
.rwcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:16px}
.rwcard{display:flex;flex-direction:column;align-items:center;gap:8px;padding:18px 12px;border-radius:24px;border:4px solid #6E5A10;background:linear-gradient(160deg,#2A2006,#0B0B0B);color:#fff;cursor:pointer;font:inherit;text-align:center;opacity:0;animation:rwIn .5s forwards;min-height:260px}
.rwcard:hover,.rwcard:focus-visible{border-color:#FFD54A;transform:translateY(-3px)}
.rwcard .rwi{font-size:76px;line-height:1;animation:rwBob 2.4s ease-in-out infinite}.rwcard b{font-size:clamp(28px,3vw,38px);color:#FFE07A}.rwcard .rws{font-size:30px;letter-spacing:.06em}
.rwcard .rwn2{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.rwcard small{font-size:clamp(20px,1.6vw,24px);color:#CFE3F5}
.rwn2 em,.rwl em{font-style:normal;font-size:clamp(20px,2.2vw,26px);padding:4px 12px;border-radius:12px;background:#1A2230;border:2px solid #3A4A5A;display:inline-flex;align-items:center;gap:4px;line-height:1.3}
em.ok{background:#0F3A20;border-color:#3BD16F;color:#C8FFD9}em.no{background:#3A0F16;border-color:#E84A5A;color:#FFC8CF}em.tip{background:#2A2A0A;border-color:#C8A81A;color:#FFF0A8}em.gd{background:#3A2A06;border-color:#FFD54A;color:#FFE07A;font-weight:900}
@keyframes rwIn{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:none}}@keyframes rwBob{50%{transform:translateY(-8px) scale(1.06)}}
#rwp{position:fixed;inset:0;z-index:60;background:#05070A;display:none}#rwp.on{display:block}
#rwpb{position:absolute;inset:0;overflow:auto;padding:14px clamp(12px,2.5vw,32px) 60px;color:#fff;font-size:clamp(22px,2.4vw,30px)}
.rwtop{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.rwtop h2{margin:0;font-size:clamp(34px,4.4vw,56px);color:#FFE07A;flex:1}.rwi2{font-size:clamp(52px,6vw,80px);animation:rwBob 2.4s ease-in-out infinite}
.rwbtn{min-height:60px;font-size:clamp(22px,2.4vw,30px);border-radius:16px;border:3px solid #6A7A8A;background:#16202C;color:#fff;padding:6px 20px;cursor:pointer;font-weight:900}.rwbtn.gd{border-color:#FFD54A;background:linear-gradient(#5A4208,#2A1E04);color:#FFE07A;margin-left:12px;animation:rwGl 1.6s ease-in-out infinite}
@keyframes rwGl{50%{box-shadow:0 0 22px #FFD54A}}
.rwrule{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;margin:12px 0;padding:12px;border-radius:20px;background:#0E1520;border:3px solid #2A3A4A}
.rwrule span{display:flex;flex-direction:column;align-items:center;padding:6px 14px;border-radius:16px;background:#16243C;border:2px solid #4A6A9A;opacity:0;animation:rwIn .5s forwards;min-width:120px}
.rwrule span b{font-size:clamp(40px,4.6vw,60px);line-height:1.1}.rwrule span small{font-size:clamp(20px,2.2vw,26px);text-align:center;line-height:1.3}.rwrule .rwa{font-style:normal;font-size:36px;color:#FFD54A;opacity:0;animation:rwIn .4s forwards}
.rwsel{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0;align-items:center}.rwsel button{min-height:60px;min-width:96px;font-size:clamp(22px,2.4vw,30px);border-radius:16px;border:3px solid var(--cc,#6A7A8A);background:#10161E;color:var(--cc,#fff);font-weight:900;cursor:pointer;padding:4px 14px}
.rwsel button.on{background:var(--cc,#FFD54A);color:#000;box-shadow:0 0 16px var(--cc,#FFD54A)}.rwsp{flex:1}.rwsel [data-rww]{--cc:#9FD8FF}
.rwgo{display:grid;gap:10px;margin:8px 0 14px}.rwgo>div{border-radius:18px;padding:10px 16px;background:#141A22;border:3px solid #3A4A5A;font-size:clamp(22px,2.4vw,30px);line-height:1.5}.rwgo>div.ok{border-color:#3BD16F;background:#0D2A18}
.rwgo b{color:#FFE07A;margin-right:10px}.rwgo .big{font-size:1.7em;color:#fff;font-weight:900}.rwnote{font-size:clamp(20px,2.2vw,26px);color:#CFE3F5}
.rwbar{display:block;position:relative;height:22px;border-radius:11px;background:#26303C;margin-top:6px;overflow:visible}.rwbar i{display:block;height:100%;border-radius:11px;background:linear-gradient(90deg,#3BD16F,#FFD54A);animation:rwGrow 1.4s ease-out}.rwbar b{position:absolute;top:-6px;width:4px;height:34px;background:#fff;margin-left:-2px;border-radius:2px}
@keyframes rwGrow{from{width:0}}
.rwcols{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media (max-width:900px){.rwcols{grid-template-columns:1fr}}
.rwcols h3{font-size:clamp(28px,3vw,38px);margin:6px 0 10px;display:flex;align-items:center;flex-wrap:wrap;gap:6px}.rwok h3{color:#7DFFB0}.rwno h3{color:#FF9AA6}
.rwper{border-radius:18px;padding:10px 14px;margin-bottom:10px;background:#10161E;border:3px solid #2A3A4A;opacity:0;animation:rwIn .45s forwards}.rwok .rwper{border-color:#2E8A50;background:linear-gradient(90deg,#0D2A18,#10161E)}.rwno .rwper{border-color:#6A2A34}
.rwq{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}.rwq .cid{font-size:clamp(28px,3vw,38px);font-weight:900}.rwsn{font-size:clamp(26px,2.8vw,34px)}.rwq .rwsn{color:#DDE6EE;font-weight:900}.rwnm{font-size:clamp(34px,3.8vw,48px);color:#fff}
.rwl{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.rwnone{font-size:clamp(24px,2.6vw,32px);color:#CFE3F5;padding:10px}
.rwdd{display:inline-flex;gap:4px}.rwdd i{font-style:normal;width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:22px;background:#26303C;color:#7A8A9A}.rwdd i.on{background:#3BD16F;color:#000;font-weight:900}
#rwc{position:fixed;inset:0;z-index:75;background:#000;display:none;flex-direction:column}#rwc.on{display:flex}
#rwcctl{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:center;padding:10px;background:#0B0B0B;border-top:1px solid #333}#rwcctl button{min-height:56px;font-size:24px;border-radius:14px;border:2px solid #6A7A8A;background:#16202C;color:#fff;padding:4px 16px;cursor:pointer}#rwcctl span{font-size:22px;color:#CFE3F5}
.rwcs{flex:1;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,var(--c2),#000 75%);display:flex;align-items:center;justify-content:center;color:#fff;text-align:center}
.rwcs .beam{position:absolute;left:50%;top:-10%;width:60vmin;height:120%;margin-left:-30vmin;background:linear-gradient(rgba(255,255,255,.35),transparent 80%);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);opacity:0;animation:rwBeam 1.4s .3s forwards}.rwcs .beam.sw{animation:rwBeam 1s .1s forwards,rwSw 3s 1s ease-in-out infinite alternate}
@keyframes rwBeam{to{opacity:1}}@keyframes rwSw{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}
.rwcs .cur{position:absolute;top:0;bottom:0;width:50%;background:repeating-linear-gradient(90deg,#7A0A14 0 40px,#A0101E 40px 80px);z-index:3;animation:rwCur 1.6s .4s ease-in forwards}.rwcs .cur.l{left:0;--d:-100%}.rwcs .cur.r{right:0;--d:100%}@keyframes rwCur{to{transform:translateX(var(--d))}}
.rwc0,.rwc1,.rwc2{position:relative;z-index:2;padding:16px;max-width:96vw}
.rwc0 .tro{font-size:clamp(90px,16vmin,180px);animation:rwPop 1s 1.2s both,rwBob 2.4s 2.2s ease-in-out infinite}.rwc0 .rb{font-size:clamp(40px,7vmin,84px);font-weight:900;color:var(--c1);text-shadow:0 0 24px var(--c1);animation:rwPop .8s 1.8s both}
.rwc0 .sb{font-size:clamp(26px,4vmin,44px);margin-top:10px;animation:rwPop .8s 2.4s both}.rwc0 .nn{font-size:clamp(30px,5vmin,56px);margin-top:16px;color:#FFE9A8;font-weight:900;animation:rwPop .8s 3s both}
@keyframes rwPop{from{opacity:0;transform:scale(.3)}70%{transform:scale(1.12)}to{opacity:1;transform:none}}
.rwc1 .med{width:clamp(120px,22vmin,220px);height:clamp(120px,22vmin,220px);margin:0 auto;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF4C2,var(--c1) 45%,#7A5A06);display:flex;align-items:center;justify-content:center;box-shadow:0 0 60px var(--c1);animation:rwDrop 1.1s cubic-bezier(.3,1.5,.5,1) both,rwSpin 4s 1.2s linear infinite}
.rwc1 .med span{font-size:clamp(70px,13vmin,130px)}@keyframes rwDrop{from{transform:translateY(-80vh) rotate(-200deg)}to{transform:none}}@keyframes rwSpin{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
.rwc1 .who{margin-top:16px;animation:rwZoom 1s 1s both}.rwc1 .rwq{justify-content:center}.rwc1 .rwq .cid,.rwc1 .rwq .rwsn{font-size:clamp(34px,6vmin,64px)}.rwc1 .rwnm{font-size:clamp(56px,11vmin,130px);color:var(--c1);text-shadow:0 0 30px var(--c1)}
@keyframes rwZoom{from{opacity:0;transform:scale(3);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
.rwc1 .rwl{justify-content:center;margin-top:16px}.rwc1 .rwl>span{opacity:0;animation:rwPop .6s both}.rwc1 .rwl em{font-size:clamp(24px,3.6vmin,38px)}.rwc1 .cg{display:inline-block;font-size:clamp(36px,6vmin,64px);color:#FFE9A8;font-weight:900;margin-top:14px;opacity:0;animation:rwPop .8s 3.6s both}
.rwc2 .rb{font-size:clamp(40px,6.4vmin,76px);font-weight:900;color:var(--c1);text-shadow:0 0 24px var(--c1);margin-bottom:14px}
.rwc2 .wall{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-height:62vh;overflow:auto}.rwc2 .wall>span{display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:16px;background:rgba(0,0,0,.55);border:3px solid var(--c1);opacity:0;animation:rwPop .6s both}
.rwc2 .wall i{font-style:normal;font-size:40px}.rwc2 .rwnm{font-size:clamp(30px,4.4vmin,48px)}.rwc2 .nx{font-size:clamp(26px,4vmin,42px);margin-top:16px;color:#FFE9A8}
.rwcs .cfz{position:absolute;top:-4%;width:12px;height:18px;opacity:0;animation:rwFall 3.2s linear forwards;z-index:1}@keyframes rwFall{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:.8;transform:translateY(110vh) rotate(720deg)}}
@media (prefers-reduced-motion:reduce){.rwcs *{animation-duration:.01s!important;animation-delay:0s!important}}
.pmsg{background:#0B1520;border:3px solid #22344A;border-radius:18px;padding:12px 16px;margin:10px 0;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}
.pmsg .pt{font-size:clamp(20px,1.7vw,26px);line-height:1.6;white-space:pre-wrap}.pmsg .pn{font-size:clamp(22px,1.9vw,28px);color:#FFE07A}.pmsg button,.pmall{min-height:60px;font-size:clamp(20px,1.7vw,26px)}
.pmall{background:#1E7A45!important}.pmsg.no{border-color:#7A1F2A}
.abl{display:grid;gap:8px;margin:8px 0}.abl>div{display:grid;grid-template-columns:minmax(9em,14em) 1fr;gap:10px;align-items:center;background:#0B1520;border:2px solid #22344A;border-radius:14px;padding:8px 14px;font-size:clamp(20px,1.7vw,26px)}
.qsc{background:#0B1520;border:3px solid #22344A;border-radius:18px;padding:12px 16px;margin:10px 0;font-size:clamp(20px,1.7vw,26px)}.qsc.ok{border-color:#3BD16F}.qsc.no{opacity:.55}
.qsc .qz{font-size:1.2em;color:#FFE07A;margin:6px 0}.qsc .qo{display:flex;flex-wrap:wrap;gap:8px}.qsc .qo span{background:#1B2633;border-radius:12px;padding:4px 12px}.qsc .qo span.a{background:#0F3323;color:#7BF0A8}
.qsc button{min-height:56px;font-size:clamp(20px,1.7vw,26px);margin:8px 8px 0 0}.qsc .y{background:#1E7A45}.qsc .n{background:#7A1F2A}
.g3t{border-collapse:collapse;width:100%;font-size:clamp(20px,1.7vw,28px)}.g3t th,.g3t td{border:2px solid #2A3A4A;padding:6px 8px;text-align:center}.g3t th{background:#14202B;font-size:clamp(18px,1.3vw,22px);line-height:1.25}.g3t th b{display:block;font-size:1.6em}
.g3t td.nm{text-align:left;white-space:nowrap}.g3t td small{display:block;font-size:max(18px,.62em);color:#9FB4C8}.g3h small{font-size:max(20px,.6em)!important}.g3t .p2{background:#1F7A45;color:#fff}.g3t .p1{background:#B08A10;color:#fff}.g3t .p0{background:#A3263A;color:#fff}.g3t td.p0 small,.g3t td.p1 small,.g3t td.p2 small{color:rgba(255,255,255,.85)}.g3t .av{font-size:1.15em;border-left:5px solid var(--gold)}
.g3t tr.all td{border-bottom:5px solid var(--gold);font-size:1.1em;font-weight:700}.g3t th small.g3n{display:block;font-size:18px;color:#9FB4C8;font-weight:400}.g3k{display:inline-block;padding:2px 10px;border-radius:8px;margin-right:6px}.g3k.p2{background:#1F7A45;color:#fff}.g3k.p1{background:#B08A10;color:#fff}.g3k.p0{background:#A3263A;color:#fff}.g3w{overflow-x:auto}.g3sw{display:flex;gap:10px;flex-wrap:wrap;margin:8px 0}.g3sw button{min-height:56px;font-size:clamp(20px,1.7vw,26px)}.g3sw button.on{background:#2A2208;border-color:var(--gold);color:#FFE9A8}
.fvhd{font-size:clamp(28px,3vw,38px);color:#FFE07A;margin:4px 0 10px}.fvhd small{font-size:.6em;color:#CFE3F5}
.fvsw{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0}.fvsw button{min-height:58px;font-size:clamp(22px,2.4vw,28px);border-radius:16px;border:3px solid #4A6A9A;background:#10161E;color:#fff;padding:4px 16px;cursor:pointer;font-weight:900}.fvsw button.on{background:#FFD54A;color:#000;border-color:#FFD54A}
.fvl{display:grid;gap:8px;margin-top:10px}.fvr{display:grid;grid-template-columns:110px 168px minmax(150px,240px) 1fr 100px;align-items:center;gap:10px;padding:6px 10px;border-radius:16px;background:#10161E;border:2px solid #2A3A4A;opacity:0;animation:rwIn .4s forwards}
.fvr.z{opacity:.55}.fvr.z{animation:none;opacity:.55}.fvr.t1{border-color:#FFD54A;background:linear-gradient(90deg,#3A2A06,#10161E)}.fvr.t2{border-color:#D0D8E0}.fvr.t3{border-color:#CD8A4A}
.bo{border:4px solid #FFD54A;border-radius:20px;padding:12px 16px;margin:0 0 18px;background:rgba(255,213,74,.08)}.bo h3{margin:0 0 8px;font-size:clamp(26px,2.6vw,34px)}.bost{font-size:clamp(20px,2vw,26px);line-height:1.5;margin-bottom:8px}.bo1{color:#5DE89A}.bo0{color:#FF9A9A}
.bo .lkrow button{min-height:56px;font-size:clamp(20px,1.9vw,24px)}.bo .bog{background:#1E7A45}.bo .bor{background:#8A1E2A}.bo .bob{background:#1E4A8A}.bo .lkrow button small{display:block;font-size:.7em;font-weight:400}.bo .lkrow button.bsel,.bor1 button.on{box-shadow:0 0 0 3px #FFF3B0,0 0 8px 2px rgba(255,213,74,.4)}.bo .lkrow button.bsel{border:3px solid #FFF3B0;transform:scale(1.04)}.bo .lkrow button:not(.bsel){opacity:.72}@keyframes boGlow{50%{box-shadow:0 0 0 4px #FFF3B0,0 0 34px 14px rgba(255,213,74,1)}}@media (prefers-reduced-motion:reduce){.bo .lkrow button.bsel,.bor1 button.on{animation:none}}
.bor1{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:8px 0;font-size:clamp(20px,1.9vw,24px)}.bor1 button{min-height:52px;padding:0 14px;border-radius:12px;border:2px solid #4A4A4A;background:#1E1E1E;color:#fff;font-size:inherit}.bor1 button.on{background:#FFD54A;color:#111;border-color:#FFD54A}.bor1 button[data-boc]{border-color:var(--cc)}
.fvoff{display:inline-block;margin-left:8px;font-style:normal;background:#555;color:#fff;border-radius:8px;padding:0 8px;font-size:.8em;vertical-align:middle}
/* 2026-10-26 第二十七次 4-(4)：圖示 太小 ➜ 84 ➜ 168px（兩倍）；手機 寬度 64 ➜ 120 */.fvr img{width:168px;height:168px;object-fit:contain;border-radius:10px;background:#000}.fvk{font-size:clamp(22px,2.4vw,30px)}.fvr.t1 .fvk,.fvr.t2 .fvk,.fvr.t3 .fvk{font-size:44px}.fvn{font-size:clamp(20px,2.2vw,26px);display:flex;flex-direction:column}.fvn small{color:#FFD54A;font-size:20px}
.fvt{height:30px;border-radius:15px;background:#26303C;overflow:hidden}.fvt i{display:block;height:100%;border-radius:15px;background:linear-gradient(90deg,#4FC3F7,#FFD54A);animation:rwGrow 1.2s ease-out both}.fvv{font-size:clamp(24px,2.6vw,32px);text-align:right}
@media (max-width:820px){.fvr{grid-template-columns:76px 120px 1fr 80px}.fvr .fvt{grid-column:1/-1}.fvr img{width:120px;height:120px}}
#cerctl{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:center;padding:10px;background:#0B0B0B;border-top:1px solid #333}
#cpg{font-size:clamp(20px,1.6vw,28px);color:#BBB;min-width:4em;text-align:center}
.cx.fin{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;overflow-y:auto}
.cx.fin .ctl{font-size:clamp(32px,5vh,60px);font-weight:700;color:#FFE9A8;margin-bottom:12px;text-align:center}
.cx.fin .cawd{width:min(1300px,96vw)}.cx.fin .caw .ccl{font-size:clamp(22px,2.6vh,32px)}
${HONCSS}
${CERCSS}
@media (max-width:900px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}.wq{grid-template-columns:2em 1fr}.wq .r{grid-column:2}}
</style></head><body>
<div id="login"><h1>老師看板</h1><div class="note">🔑 輸入老師密碼</div>
 <input id="pw" type="password" inputmode="numeric" autocomplete="current-password" aria-label="密碼">
 <label id="rmb"><input type="checkbox" id="rm"><span>這台電腦記住我（7 天）<em>只在老師自己的電腦勾；教室公用電腦不要勾</em></span></label>
 <button id="go">🔓 進入</button><div id="lmsg"></div></div>
<div id="app" hidden>
 <!-- 2026-10-16 老師 C 組第 9 題 甲：上面一條（年級、Excel、⚙ 更多）、篩選縮成一行、大數字只留名字（說明收進〔❓〕）、分頁上面紅色數字 -->
 <div class="top bar1"><a class="thome" href="../index.html" title="回到 教師 總首頁">🏠 <span class="lvsm">回 </span>總首頁</a><h1>老師看板</h1>
  <span class="grp" id="fg"><button data-g="3" class="on">三年級</button><button data-g="4">四年級</button></span><span class="sp"></span>
  <a class="lvgo" href="../live/host.html" target="_blank" rel="noopener">⚡ <span class="lvsm">開 </span><span class="lvlg">現場任務 </span>大螢幕</a><button id="lvqr" class="lvq" title="現場遊戲 QR Code">📱<span class="lvsm2"> <span class="lvsm">現場 </span>QR</span></button><button id="dl">⬇ Excel</button><span class="mwrap"><button id="more" aria-expanded="false">⚙ 更多</button>
  <div id="morep" hidden><button id="rf">🔄 重新整理</button><span id="zm"><button id="zo" aria-label="字變小">A－</button><button id="zi" aria-label="字變大">A＋</button></span><button id="out">👋 登出</button></div></span></div>
 <div class="top fline"><span class="fic">🔎</span>
  <select id="fc" aria-label="班級"></select><i>·</i>
  <span class="grp"><select id="fp" aria-label="期間"><option value="w">本週</option><option value="lw">上週</option><option value="all">這學期全部</option><option value="c">自訂日期</option></select>
   <input type="date" id="f1" hidden><input type="date" id="f2" hidden></span><i>·</i>
  <select id="fk" aria-label="類別"><option value="">全部類別</option><option value="tq">📝 複習題</option><option value="game">🎮 遊戲</option><option value="mt">📝 四年級 複習</option><option value="g3c">🏫 三年級 複習</option><option value="r1">📘 Review 1</option><option value="l">🎧 聽完字卡</option><option value="lv">⚡ 現場任務</option><option value="v">👀 看字卡</option></select><i>·</i>
  <select id="fs" aria-label="什麼時候做的"><option value="">上課＋課後</option><option value="in">🕘 上課 時間</option><option value="out">🌙 課後 時間</option></select>
 </div>
 <div class="tiles" id="tiles"></div>
 <div class="tabs" id="tabs"><button data-t="p" class="on">👤 個人</button><button data-t="b">🏆 個人排行榜</button><button data-t="c">🏫 班級排行榜</button><button data-t="w">❌ 錯題</button><button data-t="k">🔔 要關心<em class="bdg" id="kbdg" hidden></em></button><button data-t="o">📅 一鍵設定</button><button data-t="t">📌 任務</button><button data-t="l">🔒 開關</button><button data-t="r">🎁 全班 獎勵</button><button data-t="f">📊 最受歡迎</button><button data-t="g">🏫 課堂複習</button><button data-t="m">📱 給家長</button><button data-t="a">⚔ 階級 能力</button></div>
 <div class="pane" id="pane"></div>
</div>
<div id="modal"><div id="mbox"></div></div>
<div id="show"></div>
<div id="honov"><div class="hon" id="honst"></div><div id="hctl"><button id="hre">⏮ 重來</button><button id="hpv">◀</button><span id="hpg"></span><button id="hnx">▶ 下一幕</button>
 <button id="hsd">🔊 聲音：開</button><button id="hnmb">👤 姓名：顯示</button><button id="heqb">⚔ 戰士 寵物 武器：顯示</button><button id="hpr">🖨 印獎狀</button><button id="hx">✕ 關閉</button></div></div>
<div id="prt"></div>
<!-- 2026-10-18 第十一次 老師：教師首頁 一鍵 產生 QR Code，學生 掃了 ➜ 打 5 碼 ➜ 自動 進入 自己 班 的 遊戲（不用 打 遊戲 號碼） -->
<div id="lvov" hidden><div class="lvbx"><h2>📱 現場任務：學生 加入</h2>
 <div class="lvgrid"><div><div id="lvq" class="lvqr"></div><div id="lvu" class="lvu"></div><button id="lvcp">📋 複製 遊戲 網址</button></div>
  <div><ol class="lvst2"><li><b>1</b><span>📱 掃 QR Code</span></li><li><b>2</b><span>🔢 打 5 碼（班級 ＋ 座號）</span></li><li><b>3</b><span>✅ 自動 進入 自己 班 的 遊戲</span></li></ol>
 <div class="lvwho"><div class="lvwt">👥 誰 已經 加入？點 班級 ➜ 座號 亮 ＝ 已經 進來</div><div id="lvcls"></div><div id="lvseat"></div></div></div></div>
 <div class="lvbt"><a class="lvgo" style="font-size:24px;line-height:48px" href="../live/host.html" target="_blank" rel="noopener">⚡ 開 現場任務 大螢幕</a><button id="lvx">✕ 關閉</button></div></div></div>
<div id="cer"><div class="cx" id="cerst"></div><div id="cerctl"><button id="cnx">⏭ 下一個</button><button id="cps">⏸ 停</button><span id="cpg"></span><span id="cstn"></span><button id="csd">🔊 聲音：開</button><button id="cx">✕ 關閉</button></div></div>
<div id="rwp"><div id="rwpb"></div></div>
<div id="rwc"><div class="rwcs" id="rwcs"></div><div id="rwcctl"><button id="rwcpv">◀</button><button id="rwcnx">⏭ 下一個</button><button id="rwcps">⏸ 停</button><span id="rwcpg"></span><span id="rwcst"></span><button id="rwcsd">🔊 聲音：開</button><button id="rwcx">✕ 關閉</button></div></div>
<script src="../score/url.js"></script><script src="../score/qr.js"></script><script src="../live/fb.js"></script>
<script>
${CALC}
${XL}
${HONRT}
${CERRT}
var BANK=${JSON.stringify(BANK)};
var RVT=${JSON.stringify(RVT)};
/* 2026-10-12 D4-A／F1：🎯 正確率、💯 總分、練習次數（圖示等使用者選：G1；CNTIC 空白 ＝ 只寫字）、綠色粗箭頭 ＝ 進步、🥇 本班名次、⚠️ 太快亂按 */
/* 「保持滿分」的圖示（2026-10-20 第十五次 老師：字不改、🔥 換成更秒懂的）：兩張 100 分（上一次、這一次）＋ 綠色 ✔ */
var KP='<svg class="kp" viewBox="0 0 64 40" aria-hidden="true"><g font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="11" text-anchor="middle"><circle cx="17" cy="20" r="15" fill="#FFE07A" stroke="#B8741A" stroke-width="2.4"/><text x="17" y="24" fill="#6A3A00">100</text><circle cx="41" cy="20" r="15" fill="#FFD54A" stroke="#B8741A" stroke-width="2.4"/><text x="41" y="24" fill="#6A3A00">100</text></g><circle cx="54" cy="30" r="9" fill="#3BD16F" stroke="#0B3D1E" stroke-width="2"/><path d="M49.5 30l3.2 3.2 6-6.4" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var UA='<svg class="ua" viewBox="0 0 40 48" aria-hidden="true"><path d="M20 2 L38 22 H27 V46 H13 V22 H2 Z" fill="#3BD16F" stroke="#0B3D1E" stroke-width="2" stroke-linejoin="round"/></svg>',CNTIC='';
var THELP=0,RED=[];
var URL0=String(window.SCORE_URL||'').trim(),PW='',DATA=null,ALL=[],SIZES={},NM={},RCLS={},F={g:3,cls:'',p:'w',src:'',cat:''},TAB='p',SORT={k:'acc',d:1},BT='sec',BS='grade';
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function f1(v){return v==null?'—':(Math.round(v*10)/10)}
function post(o){return fetch(URL0,{method:'POST',body:JSON.stringify(o)}).then(function(r){return r.json()})}
/* 2026-10-12 D3-A：勾「這台電腦記住我（7 天）」才存在這台電腦（localStorage，7 天後自動失效）；沒勾 ＝ 分頁關掉就要重打（sessionStorage）。〔🚪 登出〕兩個都清掉 */
/* 2026-10-12 D5：〔A－〕〔A＋〕整個看板放大縮小（0.8～1.6 倍，記在這台電腦） */
/* 第二十九次：字放大（A＋）以後〔⚙ 更多〕可能 換到 第二行 最左邊，選單 不可以 跑出 畫面左邊 */
function mpFit(){var mp=$('#morep');if(!mp||mp.hidden)return;mp.style.left='';mp.style.right='';if(mp.getBoundingClientRect().left<8){mp.style.left='0';mp.style.right='auto'}}
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
/* 班級顏色（老師 2026-10-17 C8 另 2(2)）：一班一個顏色，老師一眼看出是哪一班（三年級 304 藍、307 橘、311 綠；四年級 402 藍、406 橘、409 綠、410 紫、400 金） */
/* 2026-10-18 第十一次 老師：班級數字用明顯不同的顏色，「304 黃、402 黃」＝ 同一個「第幾班」同一個顏色：第 1 班 黃、第 2 班 藍、第 3 班 綠、第 4 班 粉紅、第 5 班 橘 */
/* 2026-10-21 第十八次 第 10 點：307 和 311 太像 ➜ 每一個年級自己一組（三年級 黃、粉紅、綠；四年級 黃、藍、粉紅、綠、橘） */
var CCOL={3:['#FFD400','#FF6FB5','#3DDC84'],4:['#FFD400','#4DA3FF','#FF6FB5','#3DDC84','#FF8A1F']};
function ccol(c){var g=String(c).charAt(0)==='3'?3:4,i=(SC.CLASSES[g]||[]).indexOf(String(c));return i<0?'#C9A0FF':CCOL[g][i]}
function cidH(id){id=String(id);return '<span class="cid" style="color:'+ccol(id.slice(0,3))+'">'+esc(id.slice(0,3))+'</span><span style="color:#DDE6EE">'+esc(id.slice(3))+'</span>'}
function who(id){var n=nm(id);return esc(id)+(n?' '+esc(n):'')}
/* 2026-10-22 第二十一次 10(1)：個人排行榜 的 班級 數字 也 用 班級 顏色（304 黃、307 粉紅…） */
function whoC(id){var n=nm(id);return cidH(id)+(n?' '+esc(n):'')}
function load(j){DATA=j;NM={};RCLS={};(j.roster||[]).forEach(function(r){var id=r[0]+(r[1]<10?'0':'')+r[1];NM[id]=r[2];(RCLS[r[0]]=RCLS[r[0]]||[]).push(id)});
  SIZES={};var sz=j.sizes||{};Object.keys(RCLS).forEach(function(c){SIZES[c]=RCLS[c].length});Object.keys(sz).forEach(function(c){if(+sz[c]>0)SIZES[c]=+sz[c]});
  ALL=j.rows.map(SC.fromRow).filter(function(r){return r.id&&!isNaN(r.t)});
  clsSel();draw()}
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
    .map(function(t){return '<div class="tile"><div class="v">'+t[1]+'</div><div class="k">'+t[0]+'</div><div class="d">'+t[2]+'</div></div>'}).join('')+
    '<button id="thelp" aria-label="大數字怎麼算">'+(THELP?'✕':'❓')+'</button>';
  $('#tiles').classList.toggle('help',!!THELP);
  /* 分頁上面的紅色數字：🔔 要關心 ＝ 🔴 幾個人（9 甲） */
  var red=ps.filter(function(p){return light(rowOf(p,{}))===0});$('#kbdg').hidden=!red.length;$('#kbdg').textContent=red.length;RED=red.map(function(p){return p.id}).sort();
  var h='';
  if(TAB==='p')h=paneP(ps,RK);else if(TAB==='b')h=paneB(psG);else if(TAB==='c')h=paneC(psG);else if(TAB==='w')h=paneW(S.C);else if(TAB==='t')h=paneT();else if(TAB==='l')h=paneL();else if(TAB==='o')h=paneO();else if(TAB==='r')h=paneR();else if(TAB==='f')h=paneF();else if(TAB==='g')h=paneG();else if(TAB==='m')h=paneM(psG);else if(TAB==='a')h=paneA();else h=paneK(ps,S);
  $('#pane').innerHTML=h;kanGo();
}
/* 2026-10-12 D6-A：只留 7 欄（其他點那個人看；Excel 照樣全部都有）。燈號：🔴 正確率不到 60 或太快亂按超過 3 成；🟡 正確率不到 80 或太快亂按超過 1 成；🟢 其他 */
/* 老師 2026-10-15 D12 ⑥：「本班名次」改成「全年級名次」（正確率，同分比總分） */
/* 老師 2026-10-17 C8 另 2(1)：〔姓名〕自己一欄，標題正下方就是姓名（靠左對齊）；(2) 班級數字每一班一個顏色（cidH） */
var PCOL=[['id','座號'],['nm','姓名'],['acc','🎯 正確率'],['s','💯 總分'],['count',CNTIC+'練習次數'],['prog',UA+' 進步'],['gacc','🥇 全年級名次'],['lt','燈號']];
/* Excel 照樣全部欄位（文字，不放圖示） */
var XCOL=[['id','5碼'],['nm','姓名'],['acc','正確率'],['s','總分'],['count','練習次數'],['prog','進步'],['cacc','本班名次（正確率）'],['cs','本班名次（總分）'],['ccount','本班名次（練習次數）'],['cprog','本班名次（進步）'],
  ['gacc','全年級名次（正確率）'],['gs','全年級名次（總分）'],['gcount','全年級名次（練習次數）'],['gprog','全年級名次（進步）'],['sets','做了幾組'],['all','作答幾次'],['fix','訂正成功'],['fast','太快亂按'],['last','最後作答'],
  ['sec','練習時間（分鐘）'],['care','練習分數'],['c0','練習分數：這週 練了 幾天（分）'],['c1','練習分數：做完 幾次（分）'],['c2','練習分數：看完、聽完 才選（分）'],['c3','練習分數：答錯的 改對了（分）'],['c4','練習分數：練習 幾分鐘（分）'],['lc','聽完字卡（站）']];
var BNX={sec:'最認真練習（練習秒數）',acc:'成績最優（正確率）',prog:'進步最多（正確率進步）',care:'練習分數',s:'總分',count:'練習次數'};
var SDIR={id:'小的在上面',nm:'照筆畫',cacc:'第 1 名在上面',gacc:'第 1 名在上面',lt:'🔴 在上面'};
function light(r){return r.acc==null?3:(r.acc<60||r.fast>30)?0:(r.acc<80||r.fast>10)?1:2}
var LTS=['🔴','🟡','🟢','⚪'];
function rowOf(p,RK){var r=RK[p.id]||{},o={id:p.id,nm:nm(p.id),acc:p.acc,s:p.s,count:p.count,prog:p.prog,keep:p.keep,cacc:r.cacc,cs:r.cs,ccount:r.ccount,cprog:r.cprog,
  gacc:r.gacc,gs:r.gs,gcount:r.gcount,gprog:r.gprog,sets:p.sets,all:p.all,fix:p.fix,fast:p.q?Math.round(p.fastQ/p.q*100):0,last:p.last,
  sec:Math.round((p.sec||0)/6)/10,care:p.care,lc:p.lc||0,vonly:!p.all};var C=SC.care(p);C.it.forEach(function(v,i){o['c'+i]=v});o.lt=light(o);return o}
function dt(t){var d=new Date(t+288e5);return (d.getUTCMonth()+1)+'/'+d.getUTCDate()+' '+('0'+d.getUTCHours()).slice(-2)+':'+('0'+d.getUTCMinutes()).slice(-2)}
function paneP(ps,RK){
  if(!ps.length)return '<div class="note">這段期間還沒有人作答。</div>';
  var L=ps.map(function(p){return rowOf(p,RK)}),k=SORT.k,low=/^[cg]/.test(k)&&k!=='count';
  L.sort(function(a,b){var x=a[k],y=b[k];if(x==null&&y==null)return a.id<b.id?-1:1;if(x==null)return 1;if(y==null)return -1;
    if(k==='nm')return (String(x).localeCompare(String(y),'zh-Hant-TW-u-co-stroke')||(a.id<b.id?-1:1))*SORT.d;
    var asc=k==='id'||k==='lt'||/^[cg](acc|s|count|prog)$/.test(k);return (asc?(x>y?1:x<y?-1:0):(y>x?1:y<x?-1:0))*SORT.d});
  var red=L.filter(function(r){return r.lt===0}).map(function(r){return r.id}).sort();
  return (red.length?'<div class="alert1">🔴 '+red.length+' 人要關心：'+red.slice(0,6).map(esc).join('、')+(red.length>6?' …':'')+'<small>（點這裡看 🔔 要關心）</small></div>':'')+
   '<div class="note">點一個人 ＝ 成績卡　點標題 ＝ 排序</div><div class="tw"><table><thead><tr>'+
   PCOL.map(function(c){return '<th data-k="'+c[0]+'"'+(c[0]===k?' class="s"':'')+'>'+c[1]+(c[0]===k?'<small>⬇ '+(SORT.d>0?(SDIR[k]||'高的在上面'):'反過來排')+'</small>':'')+'</th>'}).join('')+'</tr></thead><tbody>'+
   L.map(function(r){return '<tr class="row" data-id="'+r.id+'">'+PCOL.map(function(c){var v=r[c[0]];
     if(c[0]==='id')return '<td class="idc">'+cidH(v)+'</td>';
     if(c[0]==='nm')return '<td class="nmc">'+esc(v||'')+'</td>';
     if(c[0]==='acc'||c[0]==='s')return '<td'+(v!=null&&v<60?' class="lo"':'')+'>'+f1(v)+'<span class="mb" style="width:'+(v||0)*.04+'em"></span></td>';
     if(c[0]==='prog')return '<td>'+(v==null?(r.keep&&r.acc===100?KP+' 保持滿分':'—'):v>0?'<span style="color:var(--ok)">'+UA+' ＋'+f1(v)+'%</span>':f1(v)+'%')+'</td>';
     if(c[0]==='cacc')return '<td>'+(v==null?'—':v<=3?['','🥇','🥈','🥉'][v]+' '+v:v)+'</td>';
     if(c[0]==='lt')return '<td class="lt" title="'+['要關心','要注意','很好','沒做'][v]+'">'+LTS[v]+'</td>';
     if(c[0]==='fast')return '<td'+(v>30?' class="lo"':'')+'>'+v+'%</td>';
     if(c[0]==='last')return '<td>'+dt(v)+'</td>';
     return '<td>'+(v==null?'—':esc(v))+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>';
}
var BN={acc:'🎯 成績最優',s:'💯 總分',count:CNTIC+'練習次數',prog:UA+' 進步最多',sec:'最認真練習',care:'📅 練習分數'};
/* 🏆 三種最高榮譽才有〔🏆 榮譽榜〕（使用者 2026-10-12 D6～D8）；總分、練習次數只是排行，沒有獎 */
function bnb(k){return HON.AWK.indexOf(k)>=0?'<span class="bic">'+HON.awi(k)+'</span>'+HON.AWN[k]:BN[k]}
function mins(v){return HON.mn(v)}
function fmt(k,v){return k==='count'?v+' 次':k==='prog'?'＋'+f1(v)+'%':k==='sec'?mins(v):k==='care'?'練習分數 '+v+' 分':f1(v)+' 分'}
/* ⚔ 戰力階級 徽章（2026-10-20 第十五次 老師 C17 第 5 題 B：排行榜 名字 旁邊）：伺服器 給 的 tiers（最高 到過 第幾階） */
function tbT(id){var T=DATA&&DATA.tiers;return T&&T[id]&&typeof RPFX!=='undefined'?' <span class="tbw">'+RPFX.tb(T[id])+'<small>'+RPFX.TN[T[id]]+'</small></span>':''}
function paneB(psG){
  var h='<div class="top"><span class="grp">'+HON.AWK.map(function(k){return '<button data-bt="'+k+'"'+(BT===k?' class="on"':'')+'>🏆 '+bnb(k)+'</button>'}).join('')+'</span>'+
   '<span class="grp">'+['s','count'].map(function(k){return '<button data-bt="'+k+'"'+(BT===k?' class="on"':'')+'>'+BN[k]+'</button>'}).join('')+'</span>'+
   '<span class="grp"><button data-bs="cls"'+(BS==='cls'?' class="on"':'')+'>🏫 班內</button><button data-bs="grade"'+(BS==='grade'?' class="on"':'')+'>🏆 全年級</button></span></div>'+
   '<div class="note">老師看得到全部學生的名次；學生只看得到前 10 名（自己不在前 10 名，只看到「再多幾分進前 10」）。</div>';
  var lists=BS==='grade'?[['全年級',SC.rank(psG,BT)]]:(F.cls?[F.cls]:SC.CLASSES[F.g]).map(function(c){return [SC.cname(c),SC.rank(psG.filter(function(p){return p.cls===c}),BT)]});
  HLISTS=lists.map(function(L,i){return {t:L[0],L:L[1],cls:BS==='grade'?'':(F.cls||SC.CLASSES[F.g][i])}});
  /* 2026-10-21 第十六次 第 6 點＋老師再加第 1 點：最認真練習 ＝ 練習時間 ＋ A、B 都 ≧ 90%（這段期間 到 現在）；沒 做到 的 人 列出來（公開、說得出 為什麼） */
  var byP={};psG.forEach(function(p){byP[p.id]=p});
  /* 2026-10-21 第十七次 老師第 13 點：看不懂 A、B、盾牌、字太小 ➜ A ＝ 👀 看完才按、B ＝ ✏️ 錯了會改，兩顆大字小卡（不會被切掉）；盾牌旁邊寫階級名字；〔❓ 怎麼算〕秒懂動畫 */
  var hbT=function(id){var d=SC.dili(byP[id]);return '<span class="hab"><em class="'+(d.okA?'ok':'no')+'">👀 看完才按 '+(d.a==null?'—':d.a+'%')+'</em><em class="'+(d.okB?'ok':'no')+'">✏️ 錯了會改 '+d.b+'%</em></span>'};
  if(BT==='sec'){var noL=psG.filter(function(p){return p.sec>0&&!SC.dili(p).ok&&(BS==='grade'||!F.cls||p.cls===F.cls)}).sort(function(a,b){return b.sec-a.sec});
    h+='<div class="abbox"><div class="abt">🏆 <b>最認真練習</b> ＝ 練最久 ＋ <b class="ok">👀 看完才按</b> ＋ <b class="ok">✏️ 錯了會改</b><button class="txq" data-txq="dili">❓ 怎麼算</button></div>'+
      '<div class="abs">兩個好習慣：這週到現在，10 題裡面至少 9 題做到（'+SC.DILI+'%）。沒做到 ➜ 不上榜，下一名補上。</div>'+
      (noL.length?'<div class="abnt">❌ 沒上榜（好習慣沒做到）</div><div class="abno">'+noL.map(function(p){var d=SC.dili(p);return '<div class="abp"><b>'+whoC(p.id)+'</b><span>'+(d.a==null?'<em class="no">沒有作答題目</em>':'<em class="'+(d.okA?'ok':'no')+'">👀 看完才按 '+d.a+'%'+(d.okA?' ✅':' ❌')+'</em><em class="'+(d.okB?'ok':'no')+'">✏️ 錯了會改 '+d.b+'%'+(d.okB?' ✅':' ❌')+'</em>')+'<em>練了 '+Math.round(p.sec/60)+' 分鐘</em></span></div>'}).join('')+'</div>':'')+'</div>'}
  lists.forEach(function(L,i){var mx=0;L[1].forEach(function(x){mx=Math.max(mx,x.v)});
    h+='<h3 class="hh">'+L[0]+(L[1].length&&HON.AWK.indexOf(BT)>=0?'<button class="hbtn" data-hon="'+i+'">🏆 榮譽榜</button>':'')+'</h3>'+(L[1].length?'<div class="bars">'+L[1].map(function(x){return '<div class="br'+(x.rk<=10?' hi':'')+(BT==='sec'?' bsec':'')+'"><span class="l">第 '+x.rk+' 名　'+whoC(x.id)+tbT(x.id)+'</span>'+(BT==='sec'?hbT(x.id):'')+'<span class="t"><i style="width:'+(mx?x.v/mx*100:0)+'%"></i></span><span class="v">'+fmt(BT,x.v)+'</span></div>'}).join('')+'</div>':'<div class="note">還沒有人上榜。</div>')});
  return h;
}
/* ══ 🏆 頒獎典禮（2026-10-16 老師 C2 第 13、14 題、C3 第 4 題、C4 第 4 題 A、甲；C5 第 3 題 A ＝ 3 個獎）══
   〔🏫 班級排行榜〕最上面：3 個獎一眼看完＋〔🏆 開始頒獎典禮〕；按了 ＝ 一個獎一個全螢幕：燈光打下來 ➜ 紅色彩帶（獎名）➜ 下面一行（什麼意思）
   ➜ 金色獎盃升起 ➜ 金色大字班級 ➜ 🌟 這一班做到的事 ➜ 頒獎台（🥇 第 1 名 ○○ 班 🥈 🥉）；最後一頁 3 個獎＋每一班的名次。
   原本的班際數字、〔🏆 班際榮譽榜〕全部留在下面。每一次不同風格：第 ④ 步做 10 種給老師挑（CERST），先用 C3 的「舞台燈光」 */
var CERN={sec:'⏰ 最認真練習',acc:'🎯 成績最優',prog:'⬆ 進步最多'},CERS={sec:'練最多分鐘',acc:'正確最多',prog:'比上一次進步最多'};
function cerSay(k,v){return k==='sec'?'平均每一個人 練習 '+HON.mn(v)+'，全年級最多':k==='acc'?'全班平均 '+f1(v)+' 分，全年級最高':'全班平均 正確率多了 '+f1(v)+' 分，全年級最多'}
function cerData(psG){var A=SC.clsAwards(SC.classes(psG,F.g,SIZES));return HON.AWK.map(function(k){return {k:k,R:A.rk[k]||[]}}).filter(function(x){return x.R.length})}
function cerSum(D){return '<div class="cawd">'+D.map(function(d){var one=d.R.filter(function(x){return x.rk===1});
  return '<div class="caw"><div class="ccn">'+CERN[d.k]+'</div><div class="ccs">'+CERS[d.k]+'</div><div class="cwn">👑 '+one.map(function(x){return esc(SC.cname(x.cls))}).join('、')+'</div>'+
   '<div class="ccl">'+d.R.map(function(x){return '<span>'+(x.rk<=3?['','🥇','🥈','🥉'][x.rk]:'')+' 第 '+x.rk+' 名 '+esc(SC.cname(x.cls))+'</span>'}).join('')+'</div></div>'}).join('')+'</div>'}
var CER=null;
function cerOpen(){var S=sets(),D=cerData(SC.students(S.G));if(!D.length)return;CER={D:D,i:0,tm:null,pause:false,st:CERX.pick()};$('#cer').classList.add('on');if(HSND)HON.ac();cerShow()}
function cerShow(){clearTimeout(CER.tm);var st=$('#cerst'),i=CER.i,D=CER.D;CERX.stop(st);
  $('#cpg').textContent=(i+1)+'／'+(D.length+1);$('#cnx').textContent=i<D.length?'⏭ 下一個':'⏮ 從頭再演';$('#cstn').textContent='🎨 '+(CER.st+1)+'. '+CERX.ST[CER.st].nm+'　🎵 '+CERX.SND[CER.st].nm;
  if(i>=D.length){st.className='cx fin';st.style.background='';st.innerHTML='<div class="ctl">🏆 '+hper()+' '+hgr()+' 頒獎典禮</div>'+cerSum(D);return}
  var d=D[i],one=d.R.filter(function(x){return x.rk===1});
  var ms=CERX.play(st,CER.st,{ribbon:CERN[d.k],sub:CERS[d.k],cls:'👑 '+one.map(function(x){return esc(SC.cname(x.cls))}).join('、'),say:'🌟 '+esc(cerSay(d.k,one[0].v)),
    pod:d.R.filter(function(x){return x.rk<=3}).map(function(x){return {rk:x.rk,w:esc(SC.cname(x.cls))}})},{snd:HSND});
  if(!CER.pause)CER.tm=setTimeout(function(){if(CER){CER.i++;cerShow()}},ms+2600)}
function cerClose(){if(CER)clearTimeout(CER.tm);CERX.stop($('#cerst'));CER=null;$('#cer').classList.remove('on');$('#cerst').innerHTML=''}
/* ══ 2026-10-26 第二十九次 第 4 點（老師）：班級 排行榜 ＝ 每一個 項目 一個 獨立 的 動畫 頁（一眼 看出 哪一班 最好、哪一班 要 加油）══
   〔📊 一項 一項 看（動畫）〕或 每一項 的〔📊 動畫 看 這一項〕➜ 全螢幕：大 標題 ➜ 每一班 一條 長條（班級 顏色）從 0 長上去、照 名次 排（第 1 名 在 最上面）➜
   第 1 名 👑 金框＋「🏆 第 1 名」、最後 一名「💪 加油」（不 寫 最差）➜ 下面 一句 話：「🏆 402 班 最好：87 分」；〔◀〕〔▶ 下一項〕〔✕〕、鍵盤 ← → Esc */
var CBK=[['acc','🎯 平均正確率',100,function(v){return f1(v)+' 分'}],['s','💯 平均總分',100,function(v){return f1(v)+' 分'}],['cntP',CNTIC+'練習次數（平均每一個人）',0,function(v){return v==null?'—':f1(v)+' 次'}],['secP','⏱ 練習時間（平均每一個人）',0,function(v){return v==null?'—':mins(v)}],['careP','📅 練習分數（平均每一個人）',100,function(v){return v==null?'—':v+' 分'}],
   ['rate','👥 參與率',100,function(v){return v==null?'（沒填人數）':Math.round(v)+'%'}],['prog',UA+' 平均進步',0,function(v){return v==null?'—':(v>0?'＋':'')+f1(v)+'%'}]],CBC=[],CBI=0;
function cbVals(C,K){return C.map(function(c){return K[0]==='rate'?(c.size?c.n/c.size*100:null):c[K[0]]})}
function cbShow(){var K=CBK[CBI],C=CBC,vs=cbVals(C,K),L=C.map(function(c,i){return {c:c,v:vs[i]}}),ok=L.filter(function(x){return x.v!=null}).sort(function(a,b){return b.v-a.v}),no=L.filter(function(x){return x.v==null});
  var mx=K[2]||Math.max.apply(null,ok.map(function(x){return Math.abs(x.v)}).concat([1])),R=ok.concat(no),best=ok.length?ok[0]:null,low=ok.length>1?ok[ok.length-1]:null,o=$('#cbx');
  var mm=/^(<svg[\\s\\S]*?<\\/svg>|\\S+)\\s*([\\s\\S]*)$/.exec(K[1])||['',K[1],''],ic=mm[1],tt=mm[2];
  o.innerHTML='<div class="cbw"><div class="cbh"><span class="cbi">'+ic+'</span><b>'+esc(tt)+'</b><small>'+hgr()+'　'+hper()+'　第 '+(CBI+1)+' ／ '+CBK.length+' 項</small></div>'+
   '<div class="cbl">'+R.map(function(x,i){var top=best&&x===best,lw=low&&x===low&&x.v!==best.v,w=x.v==null?0:Math.max(2,Math.max(0,x.v)/mx*100);
     return '<div class="cbr'+(top?' top':'')+(lw?' low':'')+'" style="--d:'+(i*.35+.3)+'s;--cc:'+ccol(x.c.cls)+'"><span class="cbk">'+(x.v==null?'—':top?'👑':(i+1))+'</span><span class="cbn">'+esc(x.c.cls)+' 班</span><span class="cbt"><i style="--w:'+w+'%"></i></span><span class="cbv">'+K[3](x.v)+'</span>'+(top?'<span class="cbtag g">🏆 第 1 名</span>':lw?'<span class="cbtag y">💪 加油</span>':'')+'</div>'}).join('')+'</div>'+
   (best?'<div class="cbs" style="--d:'+(R.length*.35+.6)+'s">🏆 <b style="color:'+ccol(best.c.cls)+'">'+esc(best.c.cls)+' 班</b> 最好：'+K[3](best.v)+(low&&low.v!==best.v?'　·　💪 '+esc(low.c.cls)+' 班 加油：'+K[3](low.v):'')+'</div>':'<div class="cbs">這段 期間 還 沒有 資料。</div>')+
   '<div class="cbnv"><button data-cbn="-1">◀ 上一項</button><button data-cbn="r">🔁 再 演 一次</button><button data-cbn="1">下一項 ▶</button><button data-cbn="x">✕ 關閉</button></div></div>';
  o.classList.add('on')}
function cbOpen(i){CBI=Math.max(0,Math.min(CBK.length-1,i||0));if(!$('#cbx')){var d=document.createElement('div');d.id='cbx';document.body.appendChild(d)}cbShow()}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-cb],[data-cbn]');if(!b)return;
  if(b.hasAttribute('data-cb')){cbOpen(+b.getAttribute('data-cb'));return}var v=b.getAttribute('data-cbn');
  if(v==='x'){$('#cbx').classList.remove('on');return}if(v==='r'){cbShow();return}CBI=(CBI+(+v)+CBK.length)%CBK.length;cbShow()});
document.addEventListener('keydown',function(e){var o=$('#cbx');if(!o||!o.classList.contains('on'))return;if(e.key==='Escape')o.classList.remove('on');else if(e.key==='ArrowRight'){CBI=(CBI+1)%CBK.length;cbShow()}else if(e.key==='ArrowLeft'){CBI=(CBI-1+CBK.length)%CBK.length;cbShow()}});
function paneC(psG){
  var D=cerData(psG),hc='<section class="cerb"><div class="khd">🏆 '+hper()+' 頒獎典禮（'+hgr()+'）</div>'+(D.length?cerSum(D)+'<button id="cerGo" class="cergo">🏆 開始頒獎典禮</button>':'<div class="note">這段期間還沒有班級可以頒獎。</div>')+
    '<div class="note">💯 總分、練習次數、👥 有做的人 不頒獎，在下面的數字裡。</div></section><h3 class="hh">📊 每一班的數字 <button class="cbgo big" data-cb="0">📊 一項 一項 看（動畫）</button></h3>';
  var C=SC.classes(psG,F.g,SIZES),h='<div class="note">只跟同年級的班比（題目不一樣）。平均 ＝ 有做的人的平均；參與率 ＝ 有做的人 ÷ 名單人數（試算表「班級人數」有填就用那個數字）。'+(SC.CLASSES[F.g].some(function(c){return SC.AFTER[c]})?'課後班（'+SC.CLASSES[F.g].filter(function(c){return SC.AFTER[c]}).join('、')+'）人數、上課時間不一樣，不放進班際比較。':'')+'</div>';
  h=hc+'<h3 class="hh">🏫 班際<button class="hbtn" data-hon="c">🏆 班際榮譽榜</button></h3>'+h.replace('平均 ＝ 有做的人的平均；','正確率、總分、進步 ＝ 有做的人的平均；練習次數、練習時間、練習分數 ＝ 全班加起來 ÷ 全班人數（平均每一個人，沒練的人 ＝ 0）；');
  CBC=C;CBK.forEach(function(K,ki){
    var vs=cbVals(C,K),mx=K[2]||Math.max.apply(null,vs.map(function(v){return Math.abs(v||0)}).concat([1]));
    h+='<h3>'+K[1]+' <button class="cbgo" data-cb="'+ki+'">📊 動畫 看 這一項</button></h3><div class="bars">'+C.map(function(c,n){var v=vs[n];return '<div class="br'+(c.cls===F.cls?' hi':'')+'"><span class="l">'+c.cls+' 班（'+c.n+' 人）</span><span class="t"><i style="width:'+(v==null?0:Math.max(0,v)/mx*100)+'%"></i></span><span class="v">'+K[3](v)+'</span></div>'}).join('')+'</div>'});
  return h;
}
/* ══ 2026-10-12 D 第 4 件：🏆 榮譽榜（老師投影）══
   D8：三種最高榮譽的榜、班際各一顆〔🏆 榮譽榜〕｜D9：開場 ➜ 第 10～4 名一個一個上台 ➜ 頒獎台 3、2、1（第 1 名最後揭曉）➜ 第 1 名的話
   D10：〔👤 姓名 顯示／隱藏〕一開始顯示｜D11：12 種風格輪流（跟上一次一定不一樣）｜D12：號角、鼓聲、掌聲〔🔊 聲音 開／關〕一開始開
   D13：期間 ＝ 上面選的期間｜D14：〔🖨 印獎狀〕每一個上榜的人一張 A4 橫式｜G2・F5：班際 4 種排行（平均每一個人）＋每一班都有最強的一項 */
var HLISTS=[],HN=null,HNM=lsg0('hnm',1),HSND=lsg0('hsnd',1),HEQ=lsg0('heq',1);
function lsg0(k,d){try{var v=localStorage.getItem(k);return v==null?d:+v}catch(e){return d}}
function lss0(k,v){try{localStorage.setItem(k,v)}catch(e){}}
/* 第 4 件修正（使用者 2026-10-12 D6～D8 定案）：只有三種最高榮譽（HON.AWK：最認真練習、成績最優、進步最多），字全部用 HON.AWN／HON.awl／HON.awc
   （學生平板、老師投影、印獎狀一模一樣）；拿掉進步之星、全班合照「一起練了 N 次」、班際「每一班都有自己最強的一項」 */
function hwho(id){var n=nm(id);return esc(id)+(HNM&&n?' '+esc(n):'')}
function hper(){return {w:'本週',lw:'上週',all:'這學期',c:'這段期間'}[F.p]}
function hper2(){return {w:'這週',lw:'上週',all:'這學期',c:'這段期間'}[F.p]}
function hgr(){return (F.g===3?'三':'四')+'年級'}
function hpod(R,f){return [1,2,3].map(function(r){var a=R.filter(function(x){return x.rk===r});return a.length?{w:a.map(f).join('<br>'),v:a[0].vt,d:[3.2,1.6,0][r-1]}:null})}
/* 一個人的榜 ➜ 一幕一幕（2026-10-22 第二十一次 10(3)：換成 GLORY 引擎 score/_glory_rt.js：每一次不一樣的風格＋音樂）
   0 開場 ➜ 1 第 10～4 名（從最下面一格往上翻開）➜ 2 🥉 ➜ 3 🥈 ➜ 4 🥇（最長的鼓聲、全白閃光、皇冠、煙火）➜ 5 頒獎台 */
function hwhoC(id){var n=nm(id);return cidH(id)+(HNM&&n?' '+esc(n):'')+hEq(id)+hTier(id)}
/* 2026-10-26 第二十九次 第 9(b)(c) 點（老師 選 A：現在 的 榮譽榜 每一位 下面 加）：戰神 稱號＋階級 徽章（伺服器 DATA.tiers ＝ 最高 到過 第幾階）；
   愈 高階 愈 尊榮：★ 銅、★★ 銀、★★★ 金、★★★★ 紫金＋光暈、★★★★★ 金色 光環 慢慢 流動（柔和，不 閃） */
function hTier(id){var T=DATA&&DATA.tiers,k=T&&+T[id];if(!k||typeof RPFX==='undefined')return '';return '<span class="gltr t'+k+'"><span class="gltb">'+RPFX.tb(k)+'</span><b>'+RPFX.ts(k)+' '+RPFX.TN[k]+'</b></span>'}
/* 2026-10-23 第二十二次 第 4 點：榮譽榜 呈現 學生 的 戰神 代表 人物、寵物、武器（伺服器 DATA.eqs ＝ {5碼:[戰士,武器,寵物]}）；〔⚔ 戰士 寵物 武器：顯示／隱藏〕 */
function hEqI(id){if(/^t\\d{2}$/.test(id))return '../rpg/tre/'+id+'.svg';return /^s\\d{4}$/.test(id)?'../rpg/shop/'+id+'.jpg':'../rpg/'+({b:'chars',g:'chars',w:'weapons',p:'pets'}[id.charAt(0)]||'chars')+'/'+id+'.jpg'}
function hEq(id){var q=HEQ&&DATA.eqs&&DATA.eqs[id];if(!q)return '';var L=[[q[0],'戰士'],[q[2],'寵物'],[q[1],'武器']].filter(function(x){return /^[bgwps]\\d{2,4}$/.test(x[0]||'')});
  return L.length?'<span class="gleq">'+L.map(function(x){return '<img class="ge'+x[0].charAt(0)+'" src="'+hEqI(x[0])+'" alt="'+x[1]+'">'}).join('')+'</span>':''}
function hPlan(o){var P=[],k=o.k,top=o.L.filter(function(x){return x.rk<=10}),pm={};o.ps.forEach(function(p){pm[p.id]=p});top.forEach(function(x){x.vt=fmt(k,x.v)});
  var mid=top.filter(function(x){return x.rk>=4}),T={};[1,2,3].forEach(function(r){var a=top.filter(function(x){return x.rk===r});if(a.length)T[r]=a.map(function(x){return {w:hwhoC(x.id),v:x.vt,l:HON.awl(k,pm[x.id]||{},hper2())}})});
  HN.gd={kick:esc(o.t),aw:HON.AWN[k],per:hper(),ic:HON.awi(k),rows:mid.map(function(x){return {rk:x.rk,w:hwhoC(x.id),v:x.vt}}),top:T};
  P.push({g:0,t:5600});if(mid.length)P.push({g:1,t:1800+mid.length*1250+1600});
  if(T[3])P.push({g:2,t:6800});if(T[2])P.push({g:3,t:7400});if(T[1])P.push({g:4,t:11500});P.push({g:5,t:9000});
  return P}
/* 班際 ➜ 3 種（頒獎台：平均每一個人） */
function hPlanC(ps){var C=SC.classes(ps,F.g,SIZES),A=SC.clsAwards(C),P=[];
  P.push({o:{kick:hgr(),heroIc:'🏫',tit:'🏆 '+hper()+' 榮譽榜'},t:3500,snd:'horn'});
  HON.AWK.forEach(function(k){var R=A.rk[k];if(!R.length)return;R.forEach(function(x){x.vt=HON.awc(k,x.v)});
    P.push({o:{hero:false,kick:hgr()+'　'+HON.AWN[k]+'的班',pod:hpod(R,function(x){return SC.cname(x.cls)})},t:7600,snd:'drum'})});
  return {P:P,A:A,C:C}}
function hOpen(key){var S=sets(),psG=SC.students(S.G);if(HN)clearTimeout(HN.tm);HN={i:0,tm:null,key:key,st:HON.pick('t'),gst:GLORY.pick()};
  if(key==='c'){var r=hPlanC(psG);HN.P=r.P;HN.cert=[];
    /* 班級獎狀：每一種的第 1 名 */
    /* 老師 D11 第 2 題 甲、第 3 題 A：「304 班／三年級 最用心的班 第 1 名／平均每一個人 用心程度 75 分」（刪「榮獲」、引號、「：全班一起努力。」） */
    HON.AWK.forEach(function(k){r.A.rk[k].filter(function(x){return x.rk===1}).forEach(function(x){HN.cert.push({w:SC.cname(x.cls),aw:hgr()+' '+HON.AWN[k]+'的班 第 1 名',l:HON.awc(k,x.v)})})})}
  else{var o=HLISTS[+key],ps=o.cls?psG.filter(function(p){return p.cls===o.cls}):psG,pm={};ps.forEach(function(p){pm[p.id]=p});HN.P=hPlan({t:o.t,L:o.L,k:BT,ps:ps,cls:o.cls});
    /* 個人獎狀（D11 第 2 題 甲）：「小華（最大）／304 班 最用心 第 2 名／用心程度 87 分」（刪三年級、號碼、榮獲、引號）；名字隱藏 ＝ 寫號碼 */
    HN.cert=o.L.filter(function(x){return x.rk<=10}).map(function(x){return {id:x.id,aw:(o.cls?SC.cname(o.cls):hgr())+' '+HON.AWN[BT]+' 第 '+x.rk+' 名',l:HON.aws(BT,pm[x.id]||{},hper2())}})}
  $('#honov').classList.add('on');hCtl();hShow()}
function hShow(){clearTimeout(HN.tm);var p=HN.P[HN.i];if(!p)return;GLORY.stop($('#honst'));
  if(p.g!=null)GLORY.scene($('#honst'),HN.gst,p.g,HN.gd,HSND);else{HON.scene($('#honst'),HN.st,p.o);if(HSND&&p.snd)HON.snd[p.snd]()}
  $('#hpg').textContent=(HN.i+1)+'／'+HN.P.length;
  var me=HN;HN.tm=setTimeout(function(){if(HN&&HN===me&&HN.i<HN.P.length-1){HN.i++;hShow()}},p.t)}   /* 第二十一次：舊的 計時器 不可以 跑到 新的 榜 */
function hCtl(){$('#hsd').textContent='🔊 聲音：'+(HSND?'開':'關');$('#hsd').classList.toggle('on',!!HSND);$('#hnmb').textContent='👤 姓名：'+(HNM?'顯示':'隱藏');$('#hnmb').classList.toggle('on',!!HNM);$('#heqb').textContent='⚔ 戰士 寵物 武器：'+(HEQ?'顯示':'隱藏');$('#heqb').classList.toggle('on',!!HEQ)}
function hClose(){if(HN)clearTimeout(HN.tm);GLORY.stop($('#honst'));HN=null;$('#honov').classList.remove('on');$('#honst').innerHTML=''}
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
/* D18 A（老師 2026-10-12）：「「she」哪一個唸的是它？」➜「👀 she　🔊 聽 1～4：哪一個是 she？」（句子加「」）；老師 2026-10-16 ➜「哪一個號碼 唸的是 she？」
   聽力題：清單、第 ① ～ ③ 步不寫出聽到的那一句（那常常就是答案），改〔🔊 再聽一次〕（第三批 四-4） */
function isLsn(q){return q.k==='listen'||(!!q.say&&/🔊/.test(q.q||''))}
function rdQ(q){var w=/\s/.test(q.show)?'「'+q.show+'」':q.show;return '👀 '+q.show+'　🔊 聽 1～4：哪一個號碼 唸的是 '+w+'？'}
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
var KHELP=0,KAC='';
var KM=(function(){try{return localStorage.getItem('kmode')||'g'}catch(e){return 'g'}})();
function kWhy(p,o,old){return !p?(old?'以前有做':'還沒做'):!p.all?'👀 只看字卡':o.acc==null?(p.lc>=p.all?'🎧 只聽字卡':(p.lvc||0)>=p.all?'⚡ 只玩現場任務':(p.lc||0)+(p.lvc||0)>=p.all?'🎧⚡ 只聽字卡、現場任務':'🃏 只玩記憶配對'):o.fast>30?'⚠️ 亂按 '+o.fast+'%':(o.acc>=60&&o.fast>10?'⚠️ 亂按 '+o.fast+'%':f1(o.acc)+' 分')}
function kLt(p,o){return !p?3:(o.acc==null?2:o.lt)}
function paneK(ps,S){
  var r=range(),before=SC.students(SC.pick(ALL,{g:F.g,to:r.from,src:F.src}).filter(function(x){return !F.cls||x.cls===F.cls}));
  var now={},old={};ps.forEach(function(p){now[p.id]=p});
  if(r.from!=null)before.forEach(function(p){old[p.id]=1});
  var cs=F.cls?[F.cls]:SC.CLASSES[F.g],hasR=cs.some(function(c){return RCLS[c]}),h='',k=0,pick='';
  /* 📊 圖表分析：一次看一班（2026-10-16 C2 第 2 題：細節全部保留、版面更簡潔）；上面點班級換 */
  if(KM==='a'&&cs.length>1){if(cs.indexOf(KAC)<0)KAC=cs[0];
    pick='<div class="kac">'+cs.map(function(c){return '<button data-kac="'+c+'"'+(c===KAC?' class="on"':'')+'>'+esc(SC.cname(c))+'</button>'}).join('')+'</div>';cs=[KAC]}
  cs.forEach(function(c){
    var ids=(RCLS[c]||[]).slice();ps.concat(before).forEach(function(p){if(p.cls===c&&ids.indexOf(p.id)<0)ids.push(p.id)});
    ids.sort();if(!ids.length)return;
    var cnt=[0,0,0,0],R=ids.map(function(id){var p=now[id],o=p?rowOf(p,{}):{acc:null,fast:0},lt=kLt(p,o);cnt[lt]++;return {id:id,p:p,o:o,lt:lt,why:kWhy(p,o,old[id])}});
    var head='<h3>'+esc(SC.cname(c))+'<span class="kct">'+KST.map(function(s,i){return '<span class="kp '+s[2]+'">'+s[0]+' '+s[1]+' <b>'+cnt[i]+'</b></span>'}).join('')+'</span></h3>';
    if(KM==='a'){h+='<section class="kcls">'+head+kAna(c,R,cnt)+'</section>';return}
    /* 2026-10-16 C 第 12 題 乙：每一格三行（號碼 姓名／大大的分數／📅 練習），整格塗顏色、不放小圓點 */
    var cells=R.map(function(x){
      return '<button class="kc '+KST[x.lt][2]+'" data-pid="'+x.id+'" title="'+KST[x.lt][1]+'" style="animation-delay:'+Math.min(k++*22,900)+'ms"><span class="kn"><b>'+esc(x.id.slice(3))+'</b> '+(esc(nm(x.id))||esc(x.id))+'</span><span class="kw">'+esc(x.why).replace(/ (\d+%)$/,' <small>$1</small>')+'</span>'+
        '<span class="kh">'+(x.p?'📅 練習 '+x.p.care:'&nbsp;')+'</span></button>'});
    h+='<section class="kcls">'+head+'<div class="kg">'+cells.join('')+'</div></section>'});
  return '<div class="kmd"><button data-km="g"'+(KM!=='a'?' class="on"':'')+'>🔲 照座號</button><button data-km="a"'+(KM==='a'?' class="on"':'')+'>📊 圖表分析</button>'+
   '<button id="khelp"'+(KHELP?' class="on"':'')+'>❓ 顏色怎麼看</button></div>'+
   (KHELP?'<div class="klg">'+KST.map(function(s){return '<span class="kp '+s[2]+'">'+s[0]+' '+s[1]+'</span>'}).join('')+
   '<button class="txq" data-txq="lt">❓ 燈號怎麼算</button><span class="kx">🔴 ＝ 正確率不到 60 分、或太快亂按超過 3 成　🟡 ＝ 不到 80 分、或太快亂按超過 1 成。這一頁只有老師看得到。'+(KM==='a'?'每一班：全班整體 ➜ 每一個人（要關心的排最前面）。':'每一班照座號一格一格。')+'點一個人 ＝ 成績卡。</span></div>':'')+
   (!hasR?'<div class="note">在試算表「名單」分頁貼上 班級｜座號｜姓名，還沒做的人也會有一格。</div>':'')+pick+
   (h||'<div class="note">這段期間還沒有人作答。</div>');
}
/* 📊 圖表分析（老師 D12 ⑥）：① 全班整體（四個大數字、燈號長條、用心五項全班平均＋最弱的一項）② 每一個人：🔴 ➜ ⚪ ➜ 🟡 ➜ 🟢，同一組正確率低的在前面 */
/* 2026-10-17 老師 C8 另 2(3)：要關心〔📊 圖表分析〕太複雜、太亂；看不懂「② 最弱 ＝ 這週 練了 幾天」和直條圖
   ➜ 一班三塊，每一塊一句大字標題：① 這一班：幾個人要關心（一條顏色長條＋三個大數字）
   ② 全班平均每一個人：練了幾天、做完幾次、幾成題目看完聽完才選、幾成答錯改對了、練了幾分鐘（寫真的數字，不寫「4／20 分」）；
      做得最少的那一項金框＋「👈 全班最少 ➜ 上課提醒：…」；長條 ＝ 離做到的目標還有多遠（滿 ＝ 做到了）
   ③ 每一個人：號碼姓名｜大大的正確率｜為什麼（🔴 的排最前面、打開；其他按 ▾ 才打開） */
/* ③ 的「為什麼」寫原因，不再重複分數 */
function kWhy2(x){var o=x.o;if(!x.p||o.acc==null)return x.why;if(o.fast>30||(o.lt===1&&o.fast>10&&o.acc>=80))return '⚠️ 太快亂按 '+o.fast+'%';
  return x.lt===0?'📉 正確率 不到 60':x.lt===1?'正確率 不到 80':'👍 很好'}
function kAna(c,R,cnt){
  var did=R.filter(function(x){return x.p}),n=R.length,sz=+SIZES[c]||n,avg=function(f){var a=did.map(f).filter(function(v){return v!=null});return a.length?a.reduce(function(x,y){return x+y},0)/a.length:null};
  var it=[0,0,0,0,0],rw={days:0,count:0,q:0,fq:0,W:0,F:0,sec:0};did.forEach(function(x){var C=SC.care(x.p);C.it.forEach(function(v,i){it[i]+=v});for(var k in rw)rw[k]+=+C.raw[k]||0});
  var per=Math.max(sz,did.length)||1,ia=it.map(function(v){return Math.round(v/per)}),w=HON.cweak({it:ia});
  var ic=['<span>📅</span>','<span>📝</span>',HON.EYE,HON.FIX,HON.CLK],r1=function(v){return Math.round(v*10)/10};
  var acc=avg(function(x){return x.o.acc}),secA=Math.round(rw.sec/per/60);
  /* ② 五項：真的數字＋目標 */
  var V=[[r1(rw.days/per),'天','這週 平均 練了','4 天'],[r1(rw.count/per),'次','平均 做完','5 次'],[rw.q?Math.round(100-rw.fq/rw.q*100):0,'％','題目 看完、聽完 才選',''],
    [rw.W?Math.round(rw.F/rw.W*100):(rw.q?100:0),'％','答錯的 改對了',''],[secA,'分鐘','這週 平均 練了','30 分鐘']];
  /* 2026-10-22 第二十一次 第 11 點：老師「太複雜，看不懂」➜ 最上面 改成 秒懂 動畫（一幕 一件事、自己 往下演）；原本 ①②③ 全部 收進〔📋 細節 ▾〕 */
  var kd={c:c,sz:sz,did:did.length,acc:acc,secA:secA,w:w,ia:ia,cnt:cnt,V:V,ppl:R.map(function(x){return {id:x.id,lt:x.lt,acc:x.o.acc,why:kWhy2(x)}})};KANS[c]=kd;
  var top='<div class="kan" data-kan="'+esc(c)+'"><div class="kanst" id="kanst"></div><div class="kanct"><button data-kan2="p">◀ 上一幕</button><button data-kan2="z" id="kanz">⏸ 暫停</button><button data-kan2="n">下一幕 ▶</button><span class="kanpg" id="kanpg"></span></div></div>';
  var h='<div class="kblk"><div class="khd">① 這一班：'+(cnt[0]?'<span class="kred">🔴 '+cnt[0]+' 人 要關心</span>':'沒有人要關心 🎉')+(cnt[3]?'　⚪ '+cnt[3]+' 人 還沒做':'')+'</div>';
  h+='<div class="kst">'+[0,1,2,3].filter(function(i){return cnt[i]}).map(function(i){return '<span class="'+KST[i][2]+'" style="flex:'+cnt[i]+'">'+KST[i][0]+' '+cnt[i]+'</span>'}).join('')+'</div>';
  h+='<div class="ka3"><div><b style="color:'+vc(acc)+'">'+f1(acc)+'</b>🎯 平均 正確率</div><div><b>'+secA+'</b>'+HON.CLK+' 平均 練了 幾分鐘</div><div><b>'+did.length+'<small>／'+sz+'</small></b>👥 有做的人</div></div></div>';
  h+='<div class="kblk"><div class="khd">② 全班 平均每一個人 練習了多少？</div><div class="knote">長條 ＝ 離目標還有多遠，<b>滿了 ＝ 做到了</b></div><div class="kc5">'+HON.CN.map(function(t,i){var v=V[i];
    return '<div class="k5'+(i===w?' wk':'')+'"><span class="ci">'+ic[i]+'</span><span class="k5t">'+v[2]+' <b>'+v[0]+'</b> '+v[1]+(v[3]?'<small>（目標 '+v[3]+'）</small>':'')+'</span>'+
      '<span class="t"><i style="width:'+ia[i]*5+'%"></i></span>'+(i===w?'<span class="k5w">👈 全班最少 ➜ 上課提醒：'+HON.CT[i]+'</span>':'')+'</div>'}).join('')+'</div></div>';
  var ord=[0,3,1,2],k=0;
  h+='<div class="kblk"><div class="khd">③ 每一個人（🔴 要關心的排最前面）</div>';
  ord.forEach(function(lt){var L=R.filter(function(x){return x.lt===lt}).sort(function(a,b){return (a.o.acc==null?999:a.o.acc)-(b.o.acc==null?999:b.o.acc)||(a.id<b.id?-1:1)});if(!L.length)return;
    h+='<div class="kgrp'+(lt===0?' open':'')+'"><button class="kgh" data-kgo="1">'+KST[lt][0]+' '+KST[lt][1]+'（'+L.length+' 人）<span class="kar">▾</span></button><div class="kgl">'+L.map(function(x){
      return '<button class="kr '+KST[lt][2]+'" data-pid="'+x.id+'" style="animation-delay:'+Math.min(k++*30,900)+'ms"><span class="kn2"><b>'+cidH(x.id)+'</b> '+(esc(nm(x.id))||'')+'</span>'+
        '<span class="kv">'+(x.o.acc==null?'—':'<b style="color:'+vc(x.o.acc)+'">'+f1(x.o.acc)+'</b> 分')+'</span><span class="ky">'+esc(kWhy2(x))+'</span></button>'}).join('')+'</div></div>'});
  h+='</div>';
  return top+'<div class="kgrp kdet"><button class="kgh" data-kgo="1">📋 細節（① 這一班 ② 練習了多少 ③ 每一個人）<span class="kar">▾</span></button><div class="kgl">'+h+'</div></div>';
}
/* 秒懂 動畫：5 幕（每一幕 6.5 秒；最後一幕 停住） */
var KANS={},KAN={c:'',i:0,tm:0,pz:false};
function kanScenes(d){var S=[],seat=function(id){return String(id).slice(3)},col=['#FF5A5A','#FFD24A','#3BD16F','#8A8A8A'];
  S.push(['👥 這一班 '+d.sz+' 人：每一個圓圈 ＝ 一個人','<div class="kdots">'+d.ppl.map(function(x,i){return '<i class="'+KST[x.lt][2]+'" style="animation-delay:'+(.2+i*.06).toFixed(2)+'s">'+esc(seat(x.id))+'</i>'}).join('')+'</div>'+
    '<div class="klg2">'+[0,1,2,3].map(function(i){return '<span class="'+KST[i][2]+'" style="animation-delay:'+(1.4+i*.3)+'s">'+KST[i][0]+' '+KST[i][1]+' <b>'+d.cnt[i]+'</b> 人</span>'}).join('')+'</div>']);
  var red=d.ppl.filter(function(x){return x.lt===0}).sort(function(a,b){return (a.acc==null?999:a.acc)-(b.acc==null?999:b.acc)});
  S.push([red.length?'🔴 要關心 '+red.length+' 人：點一個人 ＝ 看他的成績卡':'🎉 這一班 沒有人 要關心',red.length?'<div class="kredc">'+red.slice(0,8).map(function(x,i){return '<button data-pid="'+x.id+'" style="animation-delay:'+(.3+i*.25)+'s"><b>'+cidH(x.id)+'</b> '+(esc(nm(x.id))||'')+'<em>'+(x.acc==null?'—':f1(x.acc)+' 分')+'</em><small>'+esc(x.why)+'</small></button>'}).join('')+'</div>'+(red.length>8?'<div class="kmore">還有 '+(red.length-8)+' 人：在下面〔📋 細節〕③</div>':''):'<div class="kyay">🟢 🟢 🟢</div>']);
  var a=d.acc==null?0:Math.max(0,Math.min(100,d.acc));
  S.push(['🎯 全班 平均 正確率：'+(d.acc==null?'還沒有人做':'<b class="kbig" data-to="'+f1(d.acc)+'">0</b> 分'),'<div class="kgau"><div class="kz"><span class="r" style="width:60%">🔴 不到 60</span><span class="y" style="width:20%">🟡 60～79</span><span class="g" style="width:20%">🟢 80 以上</span></div><i class="kptr" style="--x:'+a+'%"></i></div>']);
  var sp=Math.min(100,d.secA/30*100);
  S.push(['⏰ 平均 每一個人 練了 <b class="kbig" data-to="'+d.secA+'">0</b> 分鐘（目標 30 分鐘）','<div class="kbar"><i style="--w:'+sp+'%"></i><span class="kflag">🏁 30 分鐘</span></div><div class="kday">📅 平均 練了 <b>'+d.V[0][0]+'</b> 天（目標 4 天）．📝 平均 做完 <b>'+d.V[1][0]+'</b> 次（目標 5 次）</div>']);
  var ic=['<span>📅</span>','<span>📝</span>',HON.EYE,HON.FIX,HON.CLK];
  S.push(['👈 全班 最少 的 一項：'+HON.CN[d.w],'<div class="k5r">'+ic.map(function(x,i){return '<div class="'+(i===d.w?'wk':'')+'" style="animation-delay:'+(.2+i*.2)+'s"><span class="ci">'+x+'</span><small>'+HON.CN[i]+'</small><b>'+d.V[i][0]+' '+d.V[i][1]+'</b>'+(d.V[i][3]?'<small>目標 '+d.V[i][3]+'</small>':'')+'</div>'}).join('')+'</div><div class="ktip">💡 上課 提醒：'+HON.CT[d.w]+'</div>']);
  return S}
function kanGo(){var el=document.querySelector('.kan');clearTimeout(KAN.tm);if(!el)return;var c=el.getAttribute('data-kan');if(KAN.c!==c){KAN.c=c;KAN.i=0;KAN.pz=false}kanShow()}
function kanShow(){clearTimeout(KAN.tm);var st=$('#kanst'),d=KANS[KAN.c];if(!st||!d)return;var S=kanScenes(d);KAN.i=Math.max(0,Math.min(S.length-1,KAN.i));var s=S[KAN.i];
  st.innerHTML='<div class="kant">'+s[0]+'</div><div class="kanb">'+s[1]+'</div>';$('#kanpg').textContent=(KAN.i+1)+'／'+S.length;$('#kanz').textContent=KAN.pz?'▶ 繼續':'⏸ 暫停';
  [].forEach.call(st.querySelectorAll('.kbig'),function(b){var to=+b.getAttribute('data-to')||0,t0=Date.now(),dc=String(b.getAttribute('data-to')).indexOf('.')>=0;(function f(){var k=Math.min(1,(Date.now()-t0)/1200),v=to*(1-Math.pow(1-k,3));b.textContent=dc?(Math.round(v*10)/10):Math.round(v);if(k<1&&b.isConnected)requestAnimationFrame(f)})()});
  if(!KAN.pz&&KAN.i<S.length-1)KAN.tm=setTimeout(function(){KAN.i++;kanShow()},6500)}
/* ══ 2026-10-21 第十七次 老師第 13、14 點：秒懂動畫說明（〔❓〕）＋成績卡「為什麼是這個燈」══
   一幕一件事、自己往下演（7 秒）、〔◀ 上一幕〕〔⏸ 暫停〕〔下一幕 ▶〕；字 ≧ 24px。dili ＝ 🏆 最認真練習怎麼算＋盾牌；lt ＝ 燈號怎麼算 */
var TX={i:0,tm:0,L:[],pz:false};
/* 2026-10-21 第十八次 第 9(1) 點：看不懂「👆 太快亂按 1030 8 %」（兩個刻度 10、30 擠在一起）➜ 選擇題「一句話＋紅綠燈」：
   一句話（👆 太快亂按（不到 1 秒就按）：每 100 題有 8 題 🟢 很好）＋ 一條 三色 尺（每一段 寫 清楚 範圍）＋ ▼ 指出 這個 學生 在 哪裡 */
function txMeter(lab,v,marks,bad,c){var m0=marks[0],m1=marks[1],x=Math.max(0,Math.min(100,+v||0)),L=bad?(x>m1?0:x>m0?1:2):(x<m0?0:x<m1?1:2),W=['🔴 要關心','🟡 要注意','🟢 很好'][L],K=['r','y','g'][L];
  var sg=bad?[[m0,'g','🟢 '+m0+' 題以內'],[m1-m0,'y','🟡 '+m0+'～'+m1+' 題'],[100-m1,'r','🔴 '+m1+' 題以上']]:[[m0,'r','🔴 不到 '+m0+' 分'],[m1-m0,'y','🟡 '+m0+'～'+(m1-1)+' 分'],[100-m0-(m1-m0),'g','🟢 '+m1+' 分以上']];
  return '<div class="txm"><div class="ml">'+(bad?'👆 太快亂按（不到 1 秒就按）：每 100 題有 <b>'+Math.round(x)+'</b> 題':'🎯 正確率：<b>'+Math.round(x)+'</b> 分')+'　<span class="mv '+K+'">'+W+'</span></div>'+
    '<div class="mt">'+sg.map(function(q){return '<span class="'+q[1]+'" style="flex:'+Math.max(14,q[0])+'">'+q[2]+'</span>'}).join('')+'<i class="pt" style="--p:'+(bad?txPos(x,sg):txPos(x,sg))+'%">▼</i></div></div>'}
/* ▼ 的 位置：每一段 至少 14 寬（字 放得下），照 段 換算 */
function txPos(x,sg){var tot=0,acc=0,lo=0,i;for(i=0;i<sg.length;i++)tot+=Math.max(14,sg[i][0]);for(i=0;i<sg.length;i++){var w=sg[i][0],ww=Math.max(14,w);if(x<=lo+w||i===sg.length-1){return ((acc+ww*Math.min(1,(x-lo)/(w||1)))/tot*100).toFixed(1)}acc+=ww;lo+=w}return 100}
/* 🚦 紅綠燈：L ＝ 0 紅、1 黃、2 綠 亮；-1 ＝ 三顆 輪流 亮；-2 ＝ 全 暗（⚪） */
function txLight(L){return '<div class="txtl'+(L===-1?' cyc':'')+'">'+['r','y','g'].map(function(c,i){return '<i class="'+c+(i===L?' on':'')+'"></i>'}).join('')+'</div>'}
function txDots(n,k,cls){var h='<div class="txd">';for(var i=0;i<n;i++)h+='<i class="'+(i<k?cls:(cls==='ok'?'r':'g'))+'" style="animation-delay:'+(.3+i*.15).toFixed(2)+'s">'+(i<k?(cls==='ok'?'✓':'👆'):(cls==='ok'?'✗':'✓'))+'</i>';return h+'</div>'}
function txScenes(k){var G='#3BD16F',Y='#FFD24A',R='#FF7A7A',D=SC.DILI;
  /* 2026-10-21 第十八次 第 9(2) 點：看不懂〔❓ 燈號怎麼算〕➜ 紅綠燈 動畫：一幕 一件事，燈 亮 哪一顆 一看 就 懂 */
  if(k==='lt')return [
   ['🚦 燈號 只看 兩件事',txLight(-1)+'<div class="txsum"><span>🎯 正確率（答對幾分）</span><span>👆 太快亂按（題目還沒看完就按）</span></div>'],
   ['🟢 綠燈 ＝ 很好：正確率 80 分以上，很少亂按',txLight(2)+txMeter('',88,[60,80],0)+txMeter('',4,[10,30],1)],
   ['🟡 黃燈 ＝ 要注意：正確率 60～79 分，或亂按 10～30 題',txLight(1)+txMeter('',72,[60,80],0)+txMeter('',4,[10,30],1)],
   ['🔴 紅燈 ＝ 要關心：正確率不到 60 分，或亂按 30 題以上',txLight(0)+txMeter('',52,[60,80],0)+txMeter('',4,[10,30],1)],
   ['👆 太快亂按 ＝ 不到 1 秒就按（還沒看完題目）',txDots(10,4,'fa')+'<div class="txs">10 題有 4 題亂按 ＝ 每 100 題有 40 題 ➜ 🔴</div>'],
   ['兩件事，看「比較差」的那一件',txLight(0)+txMeter('',85,[60,80],0)+txMeter('',40,[10,30],1)+'<div class="txs">正確率 85 分很好，但亂按 40 題 ➜ <b style="color:'+R+'">🔴 要關心</b></div>'],
   ['⚪ 還沒做 ＝ 這段期間一次都沒做',txLight(-2)+'<div class="txs">上面可以換期間（這週、上週…）</div>']];
  return [
   ['🏆 最認真練習 ＝ 練最久 ＋ 兩個好習慣','<div class="txsum"><span>練最久</span><i>＋</i><span>👀 看完才按</span><i>＋</i><span>✏️ 錯了會改</span><i>＝</i><span class="gd">🏆</span></div>'],
   ['👀 看完才按 ＝ 不是不到 1 秒就亂按','<div class="txrow ok">👀 看完題目 ➜ 再按 ✅</div><div class="txrow no">👆 不到 1 秒就按 ➜ 亂按 ❌</div><div class="txs">原本的「A」</div>'],
   ['✏️ 錯了會改 ＝ 答錯的題目，後來改對','<div class="txrow ok"><b style="color:'+R+'">✗</b> 答錯 ➜ 再做一次 ➜ <b style="color:'+G+'">✓</b> 改對 ✅</div><div class="txs">一題都沒錯 ＝ 也算做到（原本的「B」）</div>'],
   ['兩個好習慣都要 10 題至少 9 題（'+D+'%）',txDots(10,9,'ok')+'<div class="txs">這週到現在，全部題目合起來算</div>'],
   ['沒做到 ➜ 不上榜，下一名補上','<div class="txl"><div>1　40412　✅</div><div class="x">2　40205　👀 85% ❌</div><div>3　40903　✅</div><div class="in">➜ 40417 補上</div></div>'],
   ['⚔ 名字旁邊的劍、翅膀、皇冠 ＝ 戰神之路的戰士階級','<div class="txtb">'+[1,2,3,4,5].map(function(n){return '<span style="animation-delay:'+(.3+n*.35)+'s">'+(typeof RPFX!=='undefined'?RPFX.tb(n):'')+'<small>'+(typeof RPFX!=='undefined'?RPFX.TN[n]:'')+'</small></span>'}).join('')+'</div><div class="txs">戰力升上來就換徽章（愈高階愈華麗）；不加分數，只是榮譽</div>']]}
function txOpen(k){TX.L=txScenes(k);TX.pz=false;var o=$('#txp');if(!o){o=document.createElement('div');o.id='txp';document.body.appendChild(o)}o.hidden=false;txGo(0)}
function txGo(i){clearTimeout(TX.tm);TX.i=i;var S=TX.L[i],o=$('#txp');if(!S||!o)return;
  o.innerHTML='<div class="txb"><button class="txx" data-tx="x">✕ 關閉</button><div class="txn">'+TX.L.map(function(x,k){return '<i class="'+(k===i?'on':k<i?'ok':'')+'"></i>'}).join('')+'</div>'+
   '<div class="txc">'+S[0]+'</div><div class="txv">'+S[1]+'</div><div class="txctl"><button data-tx="p"'+(i?'':' disabled')+'>◀ 上一幕</button><button data-tx="z">'+(TX.pz?'▶ 繼續':'⏸ 暫停')+'</button><button data-tx="n">'+(i<TX.L.length-1?'下一幕 ▶':'⟲ 從頭再看')+'</button></div></div>';
  if(!TX.pz&&i<TX.L.length-1)TX.tm=setTimeout(function(){txGo(i+1)},7000)}
document.addEventListener('click',function(e){var t=e.target,b=t.closest&&t.closest('[data-txq],[data-tx]');if(!b)return;
  if(b.hasAttribute('data-txq')){txOpen(b.getAttribute('data-txq'));return}
  var k=b.getAttribute('data-tx');if(k==='x'){clearTimeout(TX.tm);$('#txp').hidden=true}else if(k==='p')txGo(Math.max(0,TX.i-1));else if(k==='n')txGo(TX.i<TX.L.length-1?TX.i+1:0);else if(k==='z'){TX.pz=!TX.pz;txGo(TX.i)}});
/* 成績卡最上面：為什麼是這個燈（兩條尺：正確率 60、80；太快亂按 10、30），學生自己的數字滑進去 */
function ltWhy(p){var r=rowOf(p,{}),L=r.lt,C=['#FF7A7A','#FFD24A','#3BD16F','#8A8A8A'][L];if(L===3)return '';
  var why=[];if(r.acc<60)why.push('🎯 正確率 '+f1(r.acc)+' 分（不到 60）');else if(L===1&&r.acc<80)why.push('🎯 正確率 '+f1(r.acc)+' 分（不到 80）');
  if(r.fast>30)why.push('👆 太快亂按：每 100 題有 '+r.fast+' 題（30 題以上）');else if(L===1&&r.fast>10)why.push('👆 太快亂按：每 100 題有 '+r.fast+' 題（10 題以上）');
  var q=['🔴 為什麼是紅燈？','🟡 為什麼是黃燈？','🟢 很好：正確率 80 分以上，很少亂按'][L];
  return '<div class="ltw l'+L+'"><div class="ltt">'+q+(why.length?'　<b>'+why.join('、')+'</b>':'')+'<button class="txq" data-txq="lt">❓ 燈號怎麼算</button></div>'+
    txMeter('',Math.round(r.acc),[60,80],0)+txMeter('',r.fast,[10,30],1)+'</div>'}
/* 2026-10-12 D 第 3 件（D7 ①～⑤⑦）：點一個人 ＝ 秒懂成績卡。
   ① 四個大圖（正確率、總分 ＝ 圓圈從 0 轉上去；練習次數 ＝ 大數字＋綠色小方格一格 ＝ 一次；進步 ＝ 綠色箭頭往上跳，退步不寫負數寫「再加油」）
   ② 👍 最拿手 3 組｜🌱 要加油 3 組（每一組最後一次的正確率）③ 📅 哪幾天有練（一週一排，最近 4 週）④ 每一組的變化（一次一組，◀ ▶ 換）
   ⑤ ❌ 最常錯的 3 題（他選的 ❌、正確答案 ✅）⑦〔📋 看全部明細〕收在最下面（作廢在這裡）。⑥ 用心程度 ＝ 第 8 件做好才加 */
var PID='',PCH={L:[],i:0};
function pRecs(id){var r=range();return ALL.filter(function(x){return x.id===id&&x.g===F.g&&(r.from==null||x.t>=r.from)&&(r.to==null||x.t<r.to)&&(!F.src||SC.when(x)===F.src)&&(!F.cat||SC.cat(x.set).k===F.cat)}).sort(function(a,b){return a.t-b.t})}
function setNm(k,L){return (bankOf(k)||{}).name||(L&&L.length?L[L.length-1].name:'')||k}
function ring(v,c){var o=(314-(v||0)*3.14).toFixed(1);return '<svg class="ring" viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="50"/><circle class="fg" cx="60" cy="60" r="50" style="stroke:'+c+';--o:'+o+'"/><text x="60" y="62">'+f1(v)+'</text></svg>'}
function vc(v){return v==null?'#555':v>=80?'#3BD16F':v>=60?'#FFD24A':'#FF7A7A'}
function person(id){
  PID=id;var A=pRecs(id),V=A.filter(function(x){return !x.x}),p=SC.students(V)[0]||{acc:null,s:null,count:0,prog:null,keep:false};
  var h='<button class="x" id="mx">✕ 關閉</button><h3 class="ph">'+who(id)+'</h3>';
  if(!V.length){h+='<div class="note">這段期間沒有紀錄（期間、類別、上課／課後 可以在上面換）。</div>'}
  else{
  /* 2026-10-16 C3／C4 第 3 題 甲：最上面 ＝ 成績卡（🎯 正確、📅 練習、💡 下一步）；原本的東西全部收進〔📋 細節 ▾〕，一個都不少 */
  h+=ltWhy(p)+HON.card(p,SC.care(p))+'<button id="pmb" class="pdb">📋 細節 ▾</button><div id="pmore" hidden>';
  /* ① 四個大圖 */
  var sq='',nq=Math.min(p.count,20);for(var i=0;i<nq;i++)sq+='<i style="animation-delay:'+(i*.08).toFixed(2)+'s"></i>';
  var pg=p.prog==null?(p.keep&&p.acc===100?'<div class="pv">'+KP+'</div><div class="pd">保持滿分</div>':'<div class="pv" style="color:#8A8A8A">—</div><div class="pd">同一組練 2 次以上才看得出來</div>')
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
  if(V.length)h+='</div>';   /* #pmore */
  /* 🗑 刪除這個人全部的成績（老師 2026-10-17 C8 另 4）：要打一次 5 碼才刪得掉；伺服器先搬到「已刪除」工作表 */
  h+='<div class="delw"><button id="delp" class="delb" data-id="'+esc(id)+'">🗑 刪除 '+esc(id)+' 全部的成績</button><div id="delc" hidden>'+
    '<div class="delq">⚠ 要刪除 <b>'+who(id)+'</b> <b>全部</b>的成績嗎？<br><small>每一週、每一個遊戲、每一次都刪；排行榜、要關心、Excel 都不再有這個人（試算表「已刪除」分頁留一份備份）。</small></div>'+
    '<div class="delr"><span>請打這個人的 5 碼：</span><input id="deli" inputmode="numeric" maxlength="5" autocomplete="off"><button id="delgo" class="delb" disabled>🗑 確定刪除</button><button id="delno">取消</button></div><div id="delm"></div></div></div>';
  $('#mbox').innerHTML=h;$('#modal').classList.add('on');PCARE=SC.care(p);
  if(!V.length)$('#pdet').hidden=false;
}
var PCARE=null;
/*〔📋 細節 ▾〕打開才演圖表和 📅 練習 動畫 */
function pMore(on){var m=$('#pmore');if(!m)return;m.hidden=!on;$('#pmb').textContent=on?'📋 收起細節 ▴':'📋 細節 ▾';$('#pmb').classList.toggle('on',on);
  if(on){pChart();if($('#pcare'))RPT.show($('#pcare'),PCARE,{key:'t',t:hper2()+' 📅 練習'})}}   /* 2026-10-17 第八次：📅 練習報告＋愛心切換（跟學生平板同一份） */
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
    /* 🎧 聽完字卡（2026-10-16 C4 第 6 題 A）：一站每一張都聽完 ＝ 一筆 */
    if(L[0].m==='l'||L[0].m==='lv'){var LV=L[0].m==='lv';h+='<h3>'+(LV?'⚡ 現場任務':nm)+'</h3><div class="tw"><table class="att"><tr><th>時間</th><th>'+(LV?'⚡ 參加 一場（老師〔🎁 發獎勵〕）':'🎧 這一站每一張都聽完')+'</th><th>上課／課後</th><th>平板</th><th></th></tr>'+
      L.map(function(x){return '<tr'+(x.x?' class="void"':'')+'><td>'+dt(x.t)+'</td><td>✅ 練習次數 ＋1（'+(LV?'正確率 不算；一天最多 3 場':'同一站一天最多 3 次')+'）</td><td>'+(SC.when(x)==='out'?'🌙 課後 時間':'🕘 上課 時間')+'</td><td>'+esc(x.dev)+'</td>'+
        '<td><button data-void="'+esc(x.u)+'" data-v="'+(x.x?0:1)+'">'+(x.x?'↩ 恢復':'🚫 作廢')+'</button></td></tr>'}).join('')+'</table></div>';return}
    if(L[0].m==='v'){h+='<h3>'+nm+'</h3><div class="tw"><table class="att"><tr><th>時間</th><th>看字卡、聽 幾分鐘</th><th>上課／課後</th><th>平板</th><th></th></tr>'+
      L.map(function(x){return '<tr'+(x.x?' class="void"':'')+'><td>'+dt(x.t)+'</td><td>'+mins(x.sec)+'</td><td>'+(SC.when(x)==='out'?'🌙 課後 時間':'🕘 上課 時間')+'</td><td>'+esc(x.dev)+'</td>'+
        '<td><button data-void="'+esc(x.u)+'" data-v="'+(x.x?0:1)+'">'+(x.x?'↩ 恢復':'🚫 作廢')+'</button></td></tr>'}).join('')+'</table></div>';return}
    if(L[0].m==='mem'){h+='<h3>'+nm+'</h3><div class="tw"><table class="att"><tr><th>時間</th><th>✅ 配完幾對</th><th>⏱ 用幾秒</th><th>每對幾秒</th><th>❌ 翻錯幾次</th><th>上課／課後</th><th>平板</th><th></th></tr>'+
      L.map(function(x){return '<tr'+(x.x?' class="void"':'')+'><td>'+dt(x.t)+'</td><td>'+x.mp+'</td><td>'+x.sec+'</td><td>'+(x.mp?f1(x.sec/x.mp):'—')+'</td><td>'+x.mw+'</td><td>'+(SC.when(x)==='out'?'🌙 課後 時間':'🕘 上課 時間')+'</td><td>'+esc(x.dev)+'</td>'+
        '<td><button data-void="'+esc(x.u)+'" data-v="'+(x.x?0:1)+'">'+(x.x?'↩ 恢復':'🚫 作廢')+'</button></td></tr>'}).join('')+'</table></div>';return}
    h+='<h3>'+nm+'</h3><svg class="svgl" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><line x1="0" x2="'+W+'" y1="'+(H-12-.6*(H-24))+'" y2="'+(H-12-.6*(H-24))+'" stroke="#333" stroke-dasharray="4 4"/>'+
     '<polyline fill="none" stroke="#7FBFFF" stroke-width="2" points="'+pts.filter(function(p){return !p[2].x}).map(function(p){return p[0]+','+p[1]}).join(' ')+'"/>'+
     pts.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="'+(p[2].x?'#555':SC.counts(p[2].ok,p[2].n,p[2].m,p[2].fast)?'#5BE39A':'#FFB86B')+'"/>'}).join('')+'</svg>'+
     '<div class="tw"><table class="att"><tr><th>時間</th><th>正確率</th><th>總分</th><th>答對／題數</th><th>✨ 訂正</th><th>⚠️ 太快亂按</th><th>上課／課後</th><th>平板</th><th></th></tr>'+
     L.map(function(x){return '<tr'+(x.x?' class="void"':'')+'><td>'+dt(x.t)+'</td><td>'+x.acc+'</td><td>'+f1(x.s)+'</td><td>'+x.ok+'／'+x.n+'</td><td>'+(x.fix||0)+'</td><td>'+x.fast+'／'+x.n+'</td><td>'+(SC.when(x)==='out'?'🌙 課後 時間':'🕘 上課 時間')+'</td><td>'+esc(x.dev)+'</td>'+
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
    return c[0]==='last'?(v?dt(v):''):c[0]==='fast'?v/100:c[0]==='prog'&&v==null&&r.keep&&r.acc===100?'保持滿分':v==null?'':v})}));
  var B=[['榜','範圍','名次','5碼','姓名','分數']];['sec','acc','prog','s','count'].forEach(function(k){
    SC.rank(psG,k).forEach(function(x){if(!F.cls||x.cls===F.cls)B.push([BNX[k],'全年級',x.rk,x.id,nm(x.id),x.v])});
    (F.cls?[F.cls]:SC.CLASSES[F.g]).forEach(function(c){SC.rank(psG.filter(function(p){return p.cls===c}),k).forEach(function(x){B.push([BNX[k],SC.cname(c),x.rk,x.id,nm(x.id),x.v])})})});
  var C=[['班級','有做的人','班級人數','參與率','平均正確率','平均總分','作答總次數','平均進步','練習時間（平均每一個人，分鐘）','練習分數（平均每一個人）']].concat(SC.classes(psG,F.g,SIZES).map(function(c){
    return [c.cls,c.n,c.size||'',c.size?Math.round(c.n/c.size*100)/100:'',c.acc==null?'':c.acc,c.s==null?'':c.s,c.count,c.prog==null?'':c.prog,c.secP==null?'':Math.round(c.secP/6)/10,c.careP==null?'':c.careP]}));
  var W=[['題組','第幾題','題型','題目','正確答案','答錯率','答錯','作答人次','選正解','選項 2','選項 2 人次','選項 3','選項 3 人次','選項 4','選項 4 人次','時間到','為什麼']];
  SC.questions(S.C).forEach(function(x){var o=qOf(x.k);if(!o)return;var q=o.q;W.push([o.set.name,x.i+1,kn(q),isLsn(q)?'🔊 '+q.say+'　'+(q.k==='listen'?q.q:''):qText(q),q.o[0],x.rate/100,x.bad,x.n,x.p[0]||0,q.o[1],x.p[1]||0,q.o[2],x.p[2]||0,q.o[3],x.p[3]||0,x.p[-1]||0,q.h])});
  var r=range(),RAW=[SC.COLS.slice(0,2).concat(['姓名'],SC.COLS.slice(2))].concat(ALL.filter(function(x){return x.g===F.g&&(!F.cls||x.cls===F.cls)&&(r.from==null||x.t>=r.from)&&(r.to==null||x.t<r.to)&&(!F.src||SC.when(x)===F.src)&&(!F.cat||SC.cat(x.set).k===F.cat)})
    .sort(function(a,b){return a.t-b.t}).map(function(x){var row=SC.toRow(x);row[0]=dt(x.t);row[SC.CI['題組名稱']]=(bankOf(x.set)||{}).name||x.name;
      row[SC.CI['來源']]=SC.when(x)==='out'?'課後時間':'上課時間';row[SC.CI['作廢']]=x.x?'作廢':'';row.splice(2,0,nm(x.id));return row}));
  var b=XLSX.make([{name:'個人',rows:P},{name:'個人排行榜',rows:B},{name:'班際',rows:C},{name:'錯題',rows:W},{name:'原始紀錄',rows:RAW}]);
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
var LKC=null,LKMSG='',LKM='t',LKW=null;
function lkCls(){var all=SC.CLASSES[F.g];if(!LKC||LKC.g!==F.g)LKC={g:F.g,c:F.cls?[F.cls]:all.slice()};return LKC.c}
function lkSt(k){var L=DATA.locks||{},T=DATA.lockt||{},cs=lkCls(),f=function(c){return (L[c]||[]).indexOf(k)>=0},n=cs.filter(f),G=SC.CLASSES[F.g].filter(f);
  var tw=cs.map(function(c){return (T[c]||{})[k]||null}),t1=tw.filter(Boolean);
  return {n:n.length,all:cs.length,who:G,gall:G.length===SC.CLASSES[F.g].length,tw:t1.length?t1[0]:null,tn:t1.length,tsame:t1.length===cs.length&&t1.every(function(w){return w[0]===t1[0][0]&&w[1]===t1[0][1]})}}
/* 開放時間（2026-10-17 第八次 第 10 題 甲＋乙）：常用的一按就填好；預設 ＝ 現在 到 今天 16:00（過了 ＝ 明天 16:00） */
function wPre(k){var d=new Date(),a=Math.floor(Date.now()/6e4)*6e4,b=new Date();b.setHours(16,0,0,0);
  if(k==='today'){if(b.getTime()<=a)b.setDate(b.getDate()+1);return [a,b.getTime()]}
  var wd=(d.getDay()+6)%7,fri=new Date();fri.setHours(16,0,0,0);fri.setDate(fri.getDate()+(4-wd+(wd>4?7:0)));
  if(k==='week'){if(fri.getTime()<=a){fri.setDate(fri.getDate()+2);fri.setHours(23,59,0,0)}return [a,fri.getTime()]}   /* 2026-10-23：星期五 16:00 以後按「這一週」＝ 開到 星期日 23:59（以前 會 變成 空的） */
  var mon=new Date();mon.setHours(8,0,0,0);mon.setDate(mon.getDate()+(7-wd));var nf=new Date(mon.getTime());nf.setDate(nf.getDate()+4);nf.setHours(16,0,0,0);return [mon.getTime(),nf.getTime()]}
function wGet(){if(!LKW)LKW=wPre('today');return LKW}
function wSt(w,now){return !w?'':now<w[0]?'⏳ 還沒開始':now>w[1]?'⛔ 結束了':'🟢 開放中'}
function wRow(pre){var w=wGet();return '<div class="lkrow"><span>從</span><input type="datetime-local" id="'+pre+'1" value="'+tkV(w[0])+'"><span>到</span><input type="datetime-local" id="'+pre+'2" value="'+tkV(w[1])+'"></div>'+
  '<div class="lkrow"><button data-wpre="today">今天 放學前</button><button data-wpre="week">這一週</button><button data-wpre="next">下一週</button><span class="note" style="margin:0">（常用的 一按 就填好）</span></div>'}
function wRead(pre){var a=Date.parse(($('#'+pre+'1')||{}).value),b=Date.parse(($('#'+pre+'2')||{}).value);if(a>0&&b>a){LKW=[a,b];return LKW}return null}
/* ══ 🎁 全班 獎勵（2026-10-25 第二十五次 老師 2(1)：選擇題「4 張大卡，點一張開一整頁」＋🎯 小測驗 ＝ 5 張）══
   A 每一個重點 ＝ 一張大卡 ➜ 點了 ＝ 一整頁（大字、秒懂圖示、動畫）；B 做到／沒做到 一律寫 班級＋號碼＋中文全名；
   C 做到的人〔🏆 頒獎〕＝ 全螢幕 正式 頒獎典禮（開場 ➜ 一個人一幕：獎牌落下、名字放大、做到的事一樣一樣亮 ➜ 榮譽牆）；
   D 做到的人：做到了哪些好事（📅 哪幾天、⏰ 幾分鐘、👀 看完才按、✏️ 錯了會改、🎁 拿到多少）；沒做到的人：還差什麼。規格 score/CLAUDE.md 最上面「第二十五次」 */
var RWK=[['cw','🎁','全班獎勵'],['ch','👑','冠軍寶箱'],['cp','🎮','每班冠軍 選遊戲'],['qz','📜','看懂 獎勵規則'],['cq','🎯','看懂 全班獎勵']],RWP={k:'',wk:'now',c:''},RWC=null;
var WDN=['一','二','三','四','五','六','日'];
function rwWin(wk){var w=SC.weekStart(DATA.now);return wk==='last'?[w-7*864e5,w]:[w,null]}
function rwPs(wk,g){var W=rwWin(wk),G=SC.pick(ALL,{g:g||F.g,from:W[0],to:W[1]}),ps=SC.students(G),by={},dd={},d0=SC.day(W[0]);ps.forEach(function(p){by[p.id]=p});
  G.forEach(function(r){var k=SC.day(r.t)-d0;if(k>=0&&k<7){(dd[r.id]=dd[r.id]||{})[k]=1}});return {ps:ps,by:by,dd:dd,W:W}}
function rwCls(){var L=SC.CLASSES[F.g]||[];if(L.indexOf(RWP.c)<0)RWP.c=(L.indexOf(F.cls)>=0?F.cls:L[0])||'';return RWP.c}
function rwIds(c,extra){var L=(RCLS[c]||[]).slice();(extra||[]).forEach(function(id){if(id.slice(0,3)===c&&L.indexOf(id)<0)L.push(id)});return L.sort()}
function rwWho(id){var n=nm(id);return '<span class="rwq"><span class="cid" style="color:'+ccol(id.slice(0,3))+'">'+esc(id.slice(0,3))+'</span><span class="rwsn">'+(+id.slice(3))+' 號</span><b class="rwnm">'+(n?esc(n):'<small>（名單 沒有 這個 號碼）</small>')+'</b></span>'}
function rwDays(dd){var h='<span class="rwdd">';for(var i=0;i<7;i++)h+='<i class="'+(dd&&dd[i]?'on':'')+'">'+WDN[i]+'</i>';return h+'</span>'}
function rwMin(s){return Math.round((+s||0)/60)}
/* 一張卡的資料：{t 標題, ic, rule 規則（圖示一步一步）, sum 上面的大數字, done:[{id, L:[做到的事]}], todo:[{id, L:[還差什麼]}], wk 有沒有 這週／上週, cls 有沒有 選班級, cer 典禮的字} */
function rwData(k){var c=rwCls(),T=RWK.filter(function(x){return x[0]===k})[0],o={k:k,t:T[2],ic:T[1],done:[],todo:[],wk:false,cls:true,sum:'',rule:[]};
  var CW=SC.RPCW,ok=function(t){return '<em class="ok">'+t+' ✅</em>'},no=function(t){return '<em class="no">'+t+'</em>'};
  if(k==='cw'){o.wk=true;var R=rwPs(RWP.wk),L=rwIds(c,R.ps.map(function(p){return p.id})),nd={},W0=rwWin(RWP.wk),OD=SC.cwDays(SC.pick(ALL,{g:F.g}),W0[0],W0[1]);L.forEach(function(id){nd[id]=OD[id]||0});   /* 第二十九次 第 10 點：只 算 非上課時間 練 的 天數（跟 伺服器 一樣 SC.cwDays） */
    var lv=SC.cwLv(nd,(RCLS[c]||[]).length?RCLS[c]:[]),N=(RCLS[c]||[]).length,need=Math.ceil(N*CW.pct/100-1e-9),n2=L.filter(function(id){return nd[id]>=CW.d1}).length,n3=L.filter(function(id){return nd[id]>=CW.d2}).length;
    o.rule=[['👥','全班 '+CW.pct/10+' 成 的 人'],['📅','這週 在 非上課時間 練 '+CW.d1+' 天（下午 4 點 以後、早上 上學 前、週末；課後班 5:30 以後）'],['🎁','自己 練 '+CW.d1+' 天 以上 ➜ 照 天數 拿'],['🚀','全班 每一位 練 '+CW.d2+' 天 ➜ 每個人 拿 更多']];
    o.sum=N?'<div class="rwgo"><div class="'+(lv>=1?'ok':'')+'"><b>目標 ①</b>練 '+CW.d1+' 天 的 人：<span class="big">'+n2+'</span> ／ '+N+' 人（要 '+need+' 人）'+(lv>=1?' ✅ 達到':' ⏳ 還差 '+Math.max(0,need-n2)+' 人')+rwBar(n2,N,need)+'</div>'+
      '<div class="'+(lv>=2?'ok':'')+'"><b>目標 ②</b>全班 每一位 練 '+CW.d2+' 天：<span class="big">'+n3+'</span> ／ '+N+' 人'+(lv>=2?' ✅ 達到':' ⏳ 還差 '+Math.max(0,N-n3)+' 人')+rwBar(n3,N,N)+'</div>'+
      '<div class="rwnote">'+(RWP.wk==='last'?'📅 上週：星期一 已經 自動 發 了（學生 打開 戰神之路 就 拿到）':'📅 這週 到 現在：下 星期一 0:00 自動 發')+'</div></div>':'<div class="rwnote">要先 在 試算表 貼「名單」才 知道 全班 有 誰</div>';
    L.forEach(function(id){var d=nd[id]||0,a=SC.cwAmt(lv||1,d),L2=[rwDays(R.dd[id])+'<em>📅 練了 '+d+' 天</em>'];
      if(d>=CW.d1){L2.push(lv?ok('🎁 🪙 '+a.c+'　⭐ '+a.x):'<em>🎁 全班 達到 目標 ① 就 拿到 🪙 '+a.c+'　⭐ '+a.x+'</em>');if(d<CW.d2)L2.push('<em class="tip">🚀 目標 ②：再 練 '+(CW.d2-d)+' 天</em>');else if(d<7)L2.push('<em class="tip">📈 再 多 練 1 天 ➜ 拿 更多</em>');else L2.push(ok('👑 每一天 都 練'));o.done.push({id:id,L:L2,d:d,a:a})}
      else{L2.push(no('⏳ 還差 '+(CW.d1-d)+' 天'));L2.push('<em class="tip">練到 '+CW.d1+' 天 ➜ 🪙 '+CW.t1[CW.d1][0]+'　⭐ '+CW.t1[CW.d1][1]+'</em>');o.todo.push({id:id,L:L2})}});
    o.cer={rb:'🎁 全班獎勵',sb:'這週 練 '+CW.d1+' 天 以上',cl:SC.cname(c)}}
  else if(k==='ch'||k==='cp'){var wk=k==='cp'?'last':RWP.wk;o.wk=k==='ch';var R2=rwPs(wk),top,C={};
    if(k==='ch'){o.cls=false;top=SC.rank(R2.ps,'sec').filter(function(x){return x.rk<=5});o.rule=[['⏰','練習 時間 最多'],['👀','看完 題目 才 按：每 10 題 至少 '+SC.DILI/10+' 題'],['✏️','答錯 的 題目 會 改對：每 10 題 至少 改對 '+SC.DILI/10+' 題'],['👑','全年級 前 5 名 ➜ 🪙 '+SC.RPCH.c+'　⭐ '+SC.RPCH.x]];
      o.sum='<div class="rwgo"><div class="ok"><b>'+(wk==='last'?'上週':'這週 到 現在')+'</b>'+(F.g===3?'三':'四')+'年級 前 5 名：<span class="big">'+top.length+'</span> 人</div><div class="rwnote">'+(wk==='last'?'📅 星期一 已經 自動 發 了':'📅 下 星期一 0:00 自動 發')+'</div></div>'}
    else{C=SC.champs(ALL,DATA.now);top=[];(SC.CLASSES[F.g]||[]).forEach(function(cc){var x=C[cc];if(x)x.ids.forEach(function(id){top.push({id:id,rk:1,v:x.sec,cls:cc})})});o.cls=true;
      o.rule=[['📅','上週'],['⏰','本班 練習 時間 最多'],['👀✏️','兩個 好習慣 ≧ '+SC.DILI+'%'],['🎮','這週 上台 選 1 次 現場任務 遊戲']];
      o.sum='<div class="rwgo"><div class="ok"><b>上週</b>每一班 第 1 名：<span class="big">'+top.length+'</span> 人</div><div class="rwnote">⚡ 開 現場任務 大螢幕 ➜ 選 這一班 ➜〔👑 請 冠軍 上台 選〕</div></div>'}
    var tids=top.map(function(x){return x.id}),last5=top.length?top[top.length-1]:null;
    top.forEach(function(x){var p=R2.by[x.id]||{},d=SC.dili(p);o.done.push({id:x.id,L:[(k==='ch'?'<em class="gd">🏅 第 '+x.rk+' 名</em>':'<em class="gd">👑 '+esc(SC.cname(x.cls))+' 第 1 名</em>'),
      '<em>⏰ 練了 '+rwMin(p.sec)+' 分鐘</em>',ok('👀 看完才按 '+(d.a==null?'-':d.a)+'%'),ok('✏️ 錯了會改 '+d.b+'%'),k==='ch'?ok('🎁 🪙 '+SC.RPCH.c+'　⭐ '+SC.RPCH.x):ok('🎮 選 1 次 遊戲')],rk:x.rk,sec:p.sec||0})});
    var ref=k==='ch'?(last5?rwMin(R2.by[last5.id].sec):0):(C[c]?rwMin(C[c].sec):0);
    rwIds(c,R2.ps.map(function(p){return p.id})).filter(function(id){return tids.indexOf(id)<0}).forEach(function(id){var p=R2.by[id],L2=[];
      if(!p||!p.sec){L2.push(no('⏳ 還沒 練習'));L2.push('<em class="tip">先 練習，兩個 好習慣 一起 做到</em>')}
      else{var d=SC.dili(p);L2.push('<em>⏰ 練了 '+rwMin(p.sec)+' 分鐘</em>'+(ref>rwMin(p.sec)?no('還差 '+(ref-rwMin(p.sec))+' 分鐘'):''));
        L2.push(d.a==null?no('👀 還沒 作答 題目'):d.okA?ok('👀 看完才按 '+d.a+'%'):no('👀 看完才按 '+d.a+'%（要 '+SC.DILI+'%）'));L2.push(d.okB?ok('✏️ 錯了會改 '+d.b+'%'):no('✏️ 錯了會改 '+d.b+'%（要 '+SC.DILI+'%）'))}
      o.todo.push({id:id,L:L2})});
    o.cer={rb:k==='ch'?'👑 冠軍寶箱':'👑 每班冠軍',sb:k==='ch'?'全年級 最認真練習 前 5 名':'上週 本班 最認真練習 第 1 名',cl:(F.g===3?'三':'四')+'年級'}}
  else{var Q=k==='qz'?(DATA.quiz||{}):(DATA.cwq||{}),ns=k==='qz'?[tutN(),5]:[4,3],L3=rwIds(c,Object.keys(Q));
    o.rule=k==='qz'?[['👀','看完 '+ns[0]+' 幕 動畫'],['📝','答對 '+ns[1]+' 題'],['⚔','開始 戰神之路']]:[['👀','看完 '+ns[0]+' 幕 動畫'],['📝','答對 '+ns[1]+' 題'],['🎯','懂 全班獎勵 怎麼 拿']];
    var dn=L3.filter(function(id){return Q[id]}),N3=(RCLS[c]||[]).length||L3.length;
    o.sum='<div class="rwgo"><div class="'+(dn.length&&dn.length>=N3?'ok':'')+'"><b>'+esc(SC.cname(c))+'</b>已經 通過：<span class="big">'+dn.length+'</span> ／ '+N3+' 人'+rwBar(dn.length,N3,N3)+'</div></div>';
    L3.forEach(function(id){if(Q[id])o.done.push({id:id,L:[ok('👀 看完 '+ns[0]+' 幕'),ok('📝 '+ns[1]+' 題 都 答對'),'<em>🕒 '+rwT(Q[id])+'</em>']});else o.todo.push({id:id,L:[no('⏳ 還沒 通過'),'<em class="tip">打開 戰神之路 ➜ 看完 '+ns[0]+' 幕 ➜ 答對 '+ns[1]+' 題</em>']})});
    o.cer={rb:k==='qz'?'📜 看懂 獎勵規則':'🎯 看懂 全班獎勵',sb:'看完 動畫＋題目 都 答對',cl:SC.cname(c)}}
  return o}
function tutN(){return 14}
function rwT(t){if(!(t>1))return '';var d=new Date(+t);return (d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours()+':'+('0'+d.getMinutes()).slice(-2)}
function rwBar(v,n,need){var p=n?Math.min(100,v/n*100):0,q=n?Math.min(100,need/n*100):0;return '<span class="rwbar"><i style="width:'+p.toFixed(1)+'%"></i><b style="left:'+q.toFixed(1)+'%" title="目標"></b></span>'}
/* 分頁：5 張大卡（每一張：大圖示、名字、一句話、做到 幾 人） */
/* 2026-10-26 第二十七次 第 4-(1)(2)：選到 的 按鈕 發光（.bsel、.on 金色 光暈）；2026-10-26 第二十九次 第 5 點（老師：一直 閃 看了 不舒服）➜ 不 閃、光 減小（金框＋淡淡 的 光，停住 不動）；老師 看不懂〔⚙ 照 下面 的 設定〕➜〔🎯 只 加倍 我 勾 的〕＋小字「照 下面 ① 班級 ② 時間 ③ 任務 ④ 幾倍」 */
/* ══ 🎉 金幣／經驗值 加倍 時段（2026-10-26 第二十六次 第 2-4 點，老師選 B 簡單版）══ 〔🟢 全開〕全部 班級、全部 任務／〔⛔ 全關〕／〔⚙ 照 下面 的 設定〕勾 的 班級、勾 的 任務；都 只在 從～到 這段 時間 */
var BOM=null,BOMSG='',BOCAT=[['game','🎮 遊戲'],['tq','📝 複習題'],['mt','📝 四年級 複習'],['r1','📘 Review 1'],['l','🎧 聽完字卡'],['lv','⚡ 現場任務'],['g3c','🏫 三年級 複習／課堂複習']];
function boInit(){var b=DATA.boost||{};BOM={k:b.k>1?b.k:1.5,x:b.x>1?b.x:1.5,cls:(b.cls||[]).slice(),cats:(b.cats||[]).slice()}}
function boSt(b){var now=Date.now();if(!b||b.m==='off'||!b.to)return '<b class="bo0">⛔ 現在 沒有 加倍</b>';
  var w=now<b.from?'⏳ 還沒 開始':now>=b.to?'⛔ 已經 結束':'🟢 加倍 中';
  return '<b class="'+(now>=b.from&&now<b.to?'bo1':'bo0')+'">'+w+'</b>　🪙 金幣 ✖'+b.k+'　⭐ 經驗值 ✖'+b.x+'<br>'+(b.m==='all'?'全部 班級、全部 任務':'班級：'+(b.cls.length?b.cls.map(function(c){return esc(SC.cname(c))}).join('、'):'（沒有 勾）')+'<br>任務：'+(b.cats.length?BOCAT.filter(function(x){return b.cats.indexOf(x[0])>=0}).map(function(x){return x[1]}).join('、'):'全部'))+'<br>'+rwT(b.from)+' ➜ '+rwT(b.to)}
function boHTML(){if(!BOM)boInit();var B=DATA.boost;
  return '<div class="bo"><h3>🎉 金幣、經驗值 加倍 時段</h3><div class="bost">'+boSt(B)+'</div>'+
   '<div class="lkrow">'+[['all','bog','🟢 全開','全部 班級、全部 任務'],['off','bor','⛔ 全關','都 不 加倍'],['set','bob','🎯 只 加倍 我 勾 的','照 下面 ① 班級 ② 時間 ③ 任務 ④ 幾倍']].map(function(x){var on=(B&&B.m||'off')===x[0];return '<button data-bo="'+x[0]+'" class="'+x[1]+(on?' bsel':'')+'">'+(on?'✔ ':'')+x[2]+'<small>'+x[3]+'</small></button>'}).join('')+'</div>'+
   '<div class="bof"><div class="bor1"><b>① 班級</b>'+(SC.CLASSES[F.g]||[]).map(function(c){var on=BOM.cls.indexOf(c)>=0;return '<button data-boc="'+c+'" class="'+(on?'on':'')+'" style="--cc:'+ccol(c)+'">'+(on?'☑ ':'☐ ')+esc(SC.cname(c))+'</button>'}).join('')+'</div>'+
   '<div class="bor1"><b>② 時間</b></div>'+wRow('bo')+
   '<div class="bor1"><b>③ 任務</b>'+BOCAT.map(function(x){var on=BOM.cats.indexOf(x[0])>=0;return '<button data-bok="'+x[0]+'" class="'+(on?'on':'')+'">'+(on?'☑ ':'☐ ')+x[1]+'</button>'}).join('')+'<small>（都 不 勾 ＝ 全部 任務）</small></div>'+
   '<div class="bor1"><b>④ 🪙 金幣</b>'+[1.5,2].map(function(k){return '<button data-bk="'+k+'" class="'+(BOM.k===k?'on':'')+'">✖ '+k+'</button>'}).join('')+'<b style="margin-left:18px">⭐ 經驗值</b>'+[1.5,2].map(function(k){return '<button data-bx="'+k+'" class="'+(BOM.x===k?'on':'')+'">✖ '+k+'</button>'}).join('')+'</div>'+
   '<div class="note">只 多 給 金幣、經驗值（答對 賺 的）；正確率、分數、排行榜 不會 變。<span id="bomsg">'+BOMSG+'</span></div></div></div>'}
function boSave(m){var w=wRead('bo')||wGet(),C=SC.CLASSES[F.g]||[],old=((DATA.boost||{}).cls||[]).filter(function(c){return C.indexOf(c)<0});
  var b={m:m,k:BOM.k,x:BOM.x,from:w[0],to:w[1],cls:old.concat(BOM.cls.filter(function(c){return C.indexOf(c)>=0})),cats:BOM.cats};
  if(m==='set'&&!b.cls.length){BOMSG='❌ 先 勾 班級';draw();return}BOMSG='⏳ 存起來 中…';draw();
  post({a:'boost',pw:PW,b:b}).then(function(j){if(j&&j.ok){DATA.boost=j.boost;BOMSG='✔ 存好了'}else BOMSG='❌ 存不起來（'+((j&&j.err)||'伺服器 還沒 重新部署')+'）';draw()},function(){BOMSG='❌ 沒有 網路';draw()})}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b,v;if(!BOM)return;
  if((b=c('[data-bo]'))){boSave(b.getAttribute('data-bo'));return}
  if((b=c('[data-boc]'))){v=b.getAttribute('data-boc');var i=BOM.cls.indexOf(v);if(i>=0)BOM.cls.splice(i,1);else BOM.cls.push(v);draw();return}
  if((b=c('[data-bok]'))){v=b.getAttribute('data-bok');var j=BOM.cats.indexOf(v);if(j>=0)BOM.cats.splice(j,1);else BOM.cats.push(v);draw();return}
  if((b=c('[data-bk]'))){BOM.k=+b.getAttribute('data-bk');draw();return}
  if((b=c('[data-bx]'))){BOM.x=+b.getAttribute('data-bx');draw();return}});
function paneR(){var h=boHTML()+'<div class="rwhd">👆 點 一張 卡 ➜ 整頁 看：✅ 誰 做到（班級、號碼、名字）、⏳ 誰 還沒、還差 什麼；做到 的 人 可以〔🏆 頒獎〕</div><div class="rwcards">';
  RWK.forEach(function(x,i){var o=rwData(x[0]);h+='<button class="rwcard" data-rwk="'+x[0]+'" style="animation-delay:'+(i*.08)+'s"><span class="rwi">'+x[1]+'</span><b>'+x[2]+'</b><span class="rws">'+o.rule.map(function(r){return r[0]}).join(' ➜ ')+'</span>'+
    '<span class="rwn2"><em class="ok">✅ '+o.done.length+' 人</em>'+(o.todo.length?'<em class="no">⏳ '+o.todo.length+' 人</em>':'')+'</span><small>'+(o.cls?esc(SC.cname(rwCls())):(F.g===3?'三':'四')+'年級')+(o.wk?'．'+(RWP.wk==='last'?'上週':'這週'):'')+'</small></button>'});
  return h+'</div>'+(RWP.k?'':'')}
/* 一整頁 */
function rwOpen(k){RWP.k=k;$('#rwp').classList.add('on');rwDraw()}
function rwDraw(){var o=rwData(RWP.k),c=rwCls();
  var h='<div class="rwtop"><span class="rwi2">'+o.ic+'</span><h2>'+o.t+'</h2><button id="rwx" class="rwbtn">✕ 關閉</button></div>'+
    '<div class="rwrule">'+o.rule.map(function(r,i){return (i?'<i class="rwa" style="animation-delay:'+(i*.5-.25)+'s">➜</i>':'')+'<span style="animation-delay:'+(i*.5)+'s"><b>'+r[0]+'</b><small>'+r[1]+'</small></span>'}).join('')+'</div>'+
    '<div class="rwsel">'+(o.cls?(SC.CLASSES[F.g]||[]).map(function(x){return '<button data-rwc="'+x+'" class="'+(x===c?'on':'')+'" style="--cc:'+ccol(x)+'">'+esc(SC.cname(x))+'</button>'}).join(''):'')+
    (o.wk?'<span class="rwsp"></span><button data-rww="now" class="'+(RWP.wk==='now'?'on':'')+'">📅 這週 到 現在</button><button data-rww="last" class="'+(RWP.wk==='last'?'on':'')+'">📅 上週</button>':'')+'</div>'+o.sum+
    '<div class="rwcols"><section class="rwok"><h3>✅ 做到 了（'+o.done.length+' 人）'+(o.done.length?'<button id="rwcer" class="rwbtn gd">🏆 頒獎</button>':'')+'</h3>'+(o.done.length?o.done.map(rwPer).join(''):'<div class="rwnone">還沒有 人 做到</div>')+'</section>'+
    '<section class="rwno"><h3>⏳ 還沒 做到（'+o.todo.length+' 人）</h3>'+(o.todo.length?o.todo.map(rwPer).join(''):'<div class="rwnone">🎉 全部 都 做到 了！</div>')+'</section></div>';
  $('#rwpb').innerHTML=h;$('#rwpb').scrollTop=0}
function rwPer(x,i){return '<div class="rwper" style="animation-delay:'+Math.min(i*.05,1.2)+'s">'+rwWho(x.id)+'<div class="rwl">'+x.L.join('')+'</div></div>'}
/* 🏆 頒獎典禮：開場 ➜ 一個人一幕 ➜ 榮譽牆。6 種 風格 輪流（每一次 不一樣） */
var RWST=[['黃金殿堂','#FFD54A','#3A2A06'],['星空','#9FD8FF','#06123A'],['紅毯','#FF6B6B','#2A0610'],['翡翠','#5DE89A','#062A18'],['紫晶','#C79BFF','#1E0A3A'],['旭日','#FF9F1C','#3A1A04']];
function rwCer(){var o=rwData(RWP.k);if(!o.done.length)return;var st=(lsg0('rwst',-1)+1)%RWST.length;lss0('rwst',st);
  RWC={o:o,i:0,st:st,tm:null,pz:false};$('#rwc').classList.add('on');if(HSND)HON.ac();rwcShow()}
function rwcShow(){clearTimeout(RWC.tm);var o=RWC.o,i=RWC.i,S=RWST[RWC.st],n=o.done.length,st=$('#rwcs'),ms=5200;
  st.style.setProperty('--c1',S[1]);st.style.setProperty('--c2',S[2]);st.className='rwcs';void st.offsetWidth;
  $('#rwcpg').textContent=(i+1)+'／'+(n+2);$('#rwcst').textContent='🎨 '+S[0];
  var cf='';for(var k=0;k<36;k++)cf+='<i class="cfz" style="left:'+(k*2.8+Math.random()*2).toFixed(1)+'%;animation-delay:'+(1.2+Math.random()*1.4).toFixed(2)+'s;background:'+['#FFD54A','#FF6B6B','#7FD4FF','#5DE89A','#FF9FD2'][k%5]+'"></i>';
  if(i===0){st.innerHTML='<div class="cur l"></div><div class="cur r"></div><div class="beam"></div><div class="rwc0"><div class="tro">🏆</div><div class="rb">'+esc(o.cer.rb)+' 頒獎典禮</div><div class="sb">'+esc(o.cer.cl)+'．'+esc(o.cer.sb)+'</div><div class="nn">🌟 '+n+' 位 同學 做到 了！</div></div>';ms=5200;
    if(HSND){try{HON.snd.drum(1.6);setTimeout(function(){try{HON.snd.horn()}catch(e){}},1700)}catch(e){}}}
  else if(i<=n){var x=o.done[i-1],id=x.id;st.innerHTML='<div class="beam sw"></div><div class="rwc1"><div class="med"><span>🏅</span></div><div class="who">'+rwWho(id)+'</div><div class="rwl">'+x.L.map(function(t,j){return '<span style="animation-delay:'+(2+j*.55).toFixed(2)+'s">'+t+'</span>'}).join('')+'</div><div class="cg">🎉 恭喜！</div></div>'+cf;
    ms=Math.max(5200,2600+x.L.length*550+1800);if(HSND){try{HON.snd.ding();setTimeout(function(){try{HON.snd.clap(1.8)}catch(e){}},1500)}catch(e){}}}
  else{st.innerHTML='<div class="rwc2"><div class="rb">🏆 '+esc(o.cer.rb)+' 榮譽榜</div><div class="wall">'+o.done.map(function(x,j){return '<span style="animation-delay:'+Math.min(j*.12,3).toFixed(2)+'s"><i>🏅</i>'+rwWho(x.id)+'</span>'}).join('')+'</div><div class="nx">⏳ 還沒 做到 的 同學：下一個 就是 你！加油！</div></div>'+cf;ms=0;
    if(HSND){try{HON.snd.horn();setTimeout(function(){try{HON.snd.clap(2.4)}catch(e){}},900)}catch(e){}}}
  rwcFit();$('#rwcnx').textContent=i<=n?'⏭ 下一個':'⏮ 從頭 再演';
  if(ms&&!RWC.pz)RWC.tm=setTimeout(function(){if(RWC){RWC.i++;rwcShow()}},ms)}
/* ══ 2026-10-26 第二十七次 第 4-(3) 點：🎁 全班獎勵、👑 冠軍寶箱 的 頒獎典禮 ＝ 🏆 榮譽榜 同一套（score/_glory_rt.js）══
   老師：太 簡陋 ➜ 最 震撼、最 閃耀、最 尊榮；名次 從 最低 排 到 最高（老師 選 A：全班獎勵 ＝ 練 的 天數 少 ➜ 多；冠軍寶箱 ＝ 第 5 名 ➜ 第 1 名）；
   第 1 名 ＝ 頒獎台 最高 的 冠軍 寶座＋發光 皇冠；**每一次 動畫 和 配樂 都 不一樣**（10 種 風格 洗牌 輪流、每一場 再 隨機 移調、換 旋律）。
   一場：開場 ➜ 比較 少 的 一排 一排 從下 往上 翻開 ➜ 🥉 ➜ 🥈 ➜ 🥇（最長 鼓聲、全白 閃光、皇冠、煙火）➜ 頒獎台。〔🖨 印 獎狀〕一樣 可以 用 */
function rwGlory(){var o=rwData(RWP.k);if(!o.done.length)return;if(HN)clearTimeout(HN.tm);var k=RWP.k,T={},rows=[],lab={},cert=[];
  if(k==='cw'){var D=o.done.slice().sort(function(a,b){return a.d-b.d}),vs=[];D.forEach(function(x){if(vs.indexOf(x.d)<0)vs.push(x.d)});vs.sort(function(a,b){return b-a});
    var tv=vs.slice(0,3),rest=D.filter(function(x){return tv.indexOf(x.d)<0}).reverse(),per=Math.max(3,Math.ceil(rest.length/8));
    tv.forEach(function(v,i){lab[i+1]='練 '+v+' 天';var G=D.filter(function(x){return x.d===v});
      /* 同一階 超過 3 個 人 ➜ 名字 排成 一塊（會 換行、字 小 一點），台子 上 放得下 */
      T[i+1]=G.length>3?[{w:'<span class="glmany">'+G.map(function(x){return '<span>'+hwhoC(x.id)+'</span>'}).join('')+'</span>',v:'📅 練 '+v+' 天　'+G.length+' 位　🎁 🪙 '+G[0].a.c+' ⭐ '+G[0].a.x}]:
        G.map(function(x){return {w:hwhoC(x.id),v:'📅 練 '+v+' 天　🎁 🪙 '+x.a.c+' ⭐ '+x.a.x}})});
    for(var i=0;i<rest.length;){var v=rest[i].d,g=[];while(i<rest.length&&rest[i].d===v&&g.length<per)g.push(rest[i++]);rows.push({rk:0,lab:'📅 練 '+v+' 天',w:g.map(function(x){return hwhoC(x.id)}).join('　'),v:'🎁 🪙 '+g[0].a.c})}
    D.forEach(function(x){cert.push({id:x.id,aw:SC.cname(rwCls())+' 🎁 全班獎勵',l:'這週 練了 '+x.d+' 天'})})}
  else{var C=o.done.slice().sort(function(a,b){return a.rk-b.rk});
    C.forEach(function(x){var e={rk:x.rk,w:hwhoC(x.id),v:'⏰ 練了 '+rwMin(x.sec)+' 分鐘'};if(x.rk<=3)(T[x.rk]=T[x.rk]||[]).push(e);else rows.push(e);
      cert.push({id:x.id,aw:(F.g===3?'三':'四')+'年級 👑 冠軍寶箱 第 '+x.rk+' 名',l:'練了 '+rwMin(x.sec)+' 分鐘'})});
    rows.sort(function(a,b){return a.rk-b.rk})}
  HN={i:0,tm:null,key:'rw',st:HON.pick('t'),gst:GLORY.pick(),cert:cert};
  HN.gd={kick:esc(o.cer.cl),aw:esc(o.cer.rb),per:RWP.wk==='last'?'上週':'這週',ic:o.ic,title:o.cer.rb+' 頒獎典禮',rows:rows,top:T,lab:k==='cw'?lab:null};
  var P=[{g:0,t:5600}];if(rows.length)P.push({g:1,t:1800+rows.length*1250+1600});if(T[3])P.push({g:2,t:6800});if(T[2])P.push({g:3,t:7400});if(T[1])P.push({g:4,t:11500});P.push({g:5,t:9000});
  HN.P=P;$('#honov').classList.add('on');hCtl();hShow()}
/* 一幕 太高（直的 iPad）➜ 整塊 等比 縮小，不 超出 畫面 */
function rwcFit(){var st=$('#rwcs'),el=st&&st.querySelector('.rwc0,.rwc1,.rwc2');if(!el)return;el.style.transform='';var H=st.clientHeight-16,W=st.clientWidth-16,h=el.offsetHeight,w=el.offsetWidth,k=Math.min(1,H/h,W/w);if(k<1)el.style.transform='scale('+k.toFixed(3)+')'}
addEventListener('resize',function(){if(RWC)rwcFit()});
function rwcClose(){if(RWC)clearTimeout(RWC.tm);RWC=null;$('#rwc').classList.remove('on');$('#rwcs').innerHTML=''}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if((b=c('[data-rwk]'))){rwOpen(b.getAttribute('data-rwk'));return}
  if(c('#rwx')){$('#rwp').classList.remove('on');RWP.k='';return}
  if((b=c('[data-rwc]'))){RWP.c=b.getAttribute('data-rwc');rwDraw();return}
  if((b=c('[data-rww]'))){RWP.wk=b.getAttribute('data-rww');rwDraw();return}
  if(c('#rwcer')){if(RWP.k==='cw'||RWP.k==='ch'){rwGlory();return}rwCer();$('#rwcsd').textContent='🔊 聲音：'+(HSND?'開':'關');return}
  if(c('#rwcnx')){if(RWC){RWC.i=RWC.i<=RWC.o.done.length?RWC.i+1:0;rwcShow()}return}
  if(c('#rwcpv')){if(RWC&&RWC.i>0){RWC.i--;rwcShow()}return}
  if(c('#rwcps')){if(RWC){RWC.pz=!RWC.pz;$('#rwcps').textContent=RWC.pz?'▶ 繼續':'⏸ 停';if(RWC.pz)clearTimeout(RWC.tm);else{RWC.i++;rwcShow()}}return}
  if(c('#rwcsd')){HSND=HSND?0:1;lss0('hsnd',HSND);if(HSND)HON.ac();$('#rwcsd').textContent='🔊 聲音：'+(HSND?'開':'關');return}
  if(c('#rwcx')){rwcClose();return}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(RWC)rwcClose();else if(RWP.k){$('#rwp').classList.remove('on');RWP.k=''}}});
/* ══ 📊 最受歡迎（2026-10-25 第二十五次 老師 2(3)；選擇題「兩種都要，用切換按鈕」）：伺服器 DATA.own ＝ {年級:{o:{編號:買過的人數}, e:{編號:正在用的人數}}}（只有人數）
   👦 男戰士、👧 女戰士、⚔ 武器、🐾 寵物、🏪 商城寶物：第 1 名 ➜ 最後一名（0 人的也列出來 ➜ 老師知道誰沒人要），長條一條一條長出來 */
var FAVM='o',FAVK='b';
var FAVG=[['b','👦 男 戰士'],['g','👧 女 戰士'],['w','⚔ 武器'],['p','🐾 寵物'],['s','🏪 商城 寶物']];
/* 2026-10-26 第二十六次 第 2-3 點（老師：已下架 的 圖片 也要 算入，旁邊 註明「已下架」）：下架 的 戰士、武器、寵物、舊寶物（t01～t10）、限時 下架 的 商城 寶物 都 列進來 */
function favIds(k){var o=[],R=SC.RPR||{},i;if(k==='b'||k==='g'){for(var id in R.h)if(id.charAt(0)===k)o.push(id)}
  else if(k==='w'||k==='p'){for(var id2 in (R[k]||{}))o.push(id2)}
  else{for(var c=1;c<=10;c++)if(SC.RPSON[c])for(i=1;i<=20;i++)o.push('s'+(c<10?'0':'')+c+(i<10?'0':'')+i);(SC.RPT||[]).forEach(function(t){o.push(t[0])})}
  return o}
function favOff(id){return !!(SC.RPHIDE[id]||(SC.RPEND&&SC.RPEND[id]&&Date.now()>=SC.RPEND[id]))}
function favNm(id){var k=id.charAt(0),n=+id.slice(1);if(k==='t'){var T=(SC.RPT||[]).filter(function(x){return x[0]===id})[0];return '舊寶物 '+(T?T[1]:n)}if(k==='s'){var S=SC.rpSC(id);return S?SC.RPS[S.c-1][1]+' '+S.n:id}return ({b:'男 ',g:'女 ',w:'武器 ',p:'寵物 '}[k]||'')+n}
/* ══ 🏫 課堂複習（2026-10-26 第二十七次 第 1 點，老師選 A「一張 大表」）══
   三年級 複習（g3m）、課堂複習 1～3（c1～c3）的 10 種 遊戲：一列 一位 學生（號碼＋姓名），10 欄 ＝ 每一種 遊戲 的 正確率（百分制），最後 一欄 ＝ 這位 學生 的 平均；
   最下面 一列 ＝ 全班 每一種 遊戲 的 平均。**只 算 已經 作答 的 題目**（答 了 幾題 就 算 幾題；時間 到 ＝ 答錯）＝ 答對 題數 ÷ 作答 題數 ✕ 100。時間 ＝ 上面 選 的 時間。 */
var G3S='all',G3C='';
var G3SETS=[['g3m','📝 三年級 複習'],['c1','🏫 課堂複習 1'],['c2','🏫 課堂複習 2'],['c3','🏫 課堂複習 3'],['all','三年級 全部'],['mt','📝 四年級 複習']];
/* 2026-10-26 第二十九次 第 7 點（老師）：(1) 欄 的 順序 ＝ 關卡 順序（第 9 關 夾娃娃、第 10 關 小精靈）(2) 每一個 遊戲 的 平均 正確率 放 最上面 一格（每班 1 號 的 正上方）
   (3) 底色：59 以下 紅、60～80 黃、81～100 綠；多〔📝 四年級 複習〕（12 種 遊戲，四年級 的 班） */
var G3ORD=['q1','q4','q5','q6','q7','q8','q9','q10','q3','q2'];
/* 2026-10-27 第三十一次（老師 選 D 回到以前）：🪤 陷阱 偵測器（m12）放回 四年級 複習 ＝ 12 種（關卡 順序 ＝ 大廳 順序）；不再 有「四年級 複習 0」*/
var MTORD=['m1','m2','m3','m4','m5','m6','m8','m9','m11','m7','m10','m12'];
function g3Games(){if(G3S==='mt'){return MTORD.map(function(id){var c=BANK['g4gm_mt-'+id];return [id,c?String(c.name).replace(/^.*｜/,''):id]})}
  return G3ORD.map(function(id){var b=BANK['g3gm_g3m-'+id];return [id,b?String(b.name).replace(/^.*｜/,''):id]})}
function g3Col(v){return v<=59?'p0':v<=80?'p1':'p2'}
function paneG(){var g4=G3S==='mt',CC=SC.CLASSES[g4?4:3]||[],c=G3C&&CC.indexOf(G3C)>=0?G3C:(F.g===(g4?4:3)&&F.cls?F.cls:CC[0]);G3C=c;var r=range(),GM=g3Games();
  var RS=ALL.filter(function(x){var m=g4?/^g4gm_(mt)-(m\\d+)$/.exec(x.set):/^g3gm_(g3m|c[123])-(q\\d+)$/.exec(x.set);return m&&!x.x&&x.cls===c&&(g4||G3S==='all'||m[1]===G3S)&&(r.from==null||x.t>=r.from)&&(r.to==null||x.t<r.to)});
  var P={},T={};RS.forEach(function(x){var g=/-([qm]\\d+)$/.exec(x.set)[1],p=P[x.id]=P[x.id]||{};(x.qs||[]).forEach(function(q){var a=p[g]=p[g]||[0,0],b=T[g]=T[g]||[0,0];a[0]+=q[0]?1:0;a[1]++;b[0]+=q[0]?1:0;b[1]++})});
  var ids=(RCLS[c]||[]).slice();Object.keys(P).forEach(function(id){if(ids.indexOf(id)<0)ids.push(id)});ids.sort();
  var cell=function(a,av){var x=av?' av':'';if(!a||!a[1])return '<td class="'+x+'">—</td>';var v=Math.round(a[0]/a[1]*100);return '<td class="'+g3Col(v)+x+'">'+v+'<small>'+a[1]+' 題</small></td>'};
  var sum=function(o){var a=[0,0];GM.forEach(function(g){var x=o[g[0]];if(x){a[0]+=x[0];a[1]+=x[1]}});return a};
  var h='<div class="fvhd g3h">'+(g4?'📝 四年級 複習：12 種':'🏫 三年級 課堂 複習：10 種')+' 遊戲 的 平均 正確率<small>（百分制；只 算 已經 作答 的 題目；時間 到 沒有 選 ＝ 答錯；時間 ＝ 上面 選 的）</small></div>'+
    '<div class="g3sw">'+G3SETS.map(function(x){return '<button data-g3s="'+x[0]+'" class="'+(G3S===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div>'+
    '<div class="g3sw">'+CC.map(function(x){return '<button data-g3c="'+x+'" class="'+(x===c?'on':'')+'" style="border-color:'+ccol(x)+'">'+esc(SC.cname(x))+'</button>'}).join('')+'</div>'+
    '<div class="note"><span class="g3k p2">🟢 81～100</span> <span class="g3k p1">🟡 60～80</span> <span class="g3k p0">🔴 59 以下</span>　—　還沒 做；小字 ＝ 作答 幾題。</div><div class="g3w"><table class="g3t"><tr><th>號碼</th><th>姓名</th>'+
    GM.map(function(g,i){var t=g[1].split(' '),ic=t.shift();return '<th><small class="g3n">第 '+(i+1)+' 關</small><b>'+ic+'</b>'+esc(t.join(' '))+'</th>'}).join('')+'<th class="av"><b>⭐</b>平均</th></tr>';
  h+='<tr class="all"><td colspan="2">🏫 全班 平均</td>'+GM.map(function(g){return cell(T[g[0]])}).join('')+cell(sum(T),1)+'</tr>';
  ids.forEach(function(id){var p=P[id]||{};h+='<tr><td>'+id.slice(3)+'</td><td class="nm">'+esc(nm(id)||'')+'</td>'+GM.map(function(g){return cell(p[g[0]])}).join('')+cell(sum(p),1)+'</tr>'});
  h+='</table></div>';
  if(!RS.length)h+='<div class="note">這個 時間、這一班 還沒有 人 做'+(G3S==='all'?'':'「'+G3SETS.filter(function(x){return x[0]===G3S})[0][1]+'」')+'。</div>';
  return h}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-g3s],[data-g3c]');if(!b||TAB!=='g')return;if(b.hasAttribute('data-g3s'))G3S=b.getAttribute('data-g3s');else G3C=b.getAttribute('data-g3c');draw()});
/* ══ 📱 給家長 的 週報（2026-10-26 第二十七次 第 2 點，老師 選 C30 第 2 題 第 3 件）══
   一鍵 產生 每一個 學生 一則 短訊（期間 ＝ 上面 選 的，預設 本週）➜〔📋 複製〕貼到 LINE；〔📋 全班 一次 複製〕。
   研究：自動 傳 簡訊 給 家長（缺交、成績）不及格 少 27%、出席 多 12%（Bergman & Chan 2021）。寫 孩子 做到 的 事＋請 家長 稱讚 哪一點（具體 的 稱讚；不寫 聰明）。
   給 家長 看 的 是 一般 中文（不 空格）；不寫 他／她（用「孩子」）；姓名 只有 老師 看得到（名單 只在 試算表） */
var PMC='';
function pmText(id,p,per){var n=nm(id)||(id.slice(3)+' 號'),d=p?p.days||0:0,c=p?p.count||0:0,mi=p?Math.round((p.sec||0)/60):0,dl=p?SC.dili(p):null,acc=p&&p.acc!=null?Math.round(p.acc):null,pr;
  if(!p||(!c&&!d))return '【英語練習'+per+'】'+n+per.replace('週報','')+'還沒有在英語網站練習。請鼓勵孩子每天練 5 分鐘：打開「在家複習」➜ 選 1 個 遊戲 玩 一次 😊';
  if(dl&&dl.W&&dl.F)pr='答錯的題目會再改對（改對了 '+dl.F+' 題）';else if(d>=3)pr='練了好幾天，很有恆心';else if(acc!=null&&acc>=80)pr='答題很專心，正確率 '+acc+' 分';else pr='願意開始練習';
  return '【英語練習'+per+'】'+n+per.replace('週報','')+'練了 '+d+' 天、做完 '+c+' 次'+(mi?'、練習 '+mi+' 分鐘':'')+(acc!=null?'，正確率 '+acc+' 分':'')+'。請您稱讚孩子：'+pr+'！每天 5 分鐘，分開好幾天練，記得最久 👍'}
function paneM(psG){var C=SC.CLASSES[F.g]||[],c=PMC&&C.indexOf(PMC)>=0?PMC:(F.cls||C[0]);PMC=c;var per=F.p==='lw'?'上週週報':F.p==='w'?'本週週報':'週報',P={};psG.forEach(function(p){P[p.id]=p});
  var ids=(RCLS[c]||[]).slice();psG.forEach(function(p){if(p.cls===c&&ids.indexOf(p.id)<0)ids.push(p.id)});ids.sort();
  var h='<div class="fvhd g3h">📱 給 家長 的 週報<small>（每一個 學生 一則；按〔📋 複製〕貼到 LINE；時間 ＝ 上面 選 的）</small></div>'+
    '<div class="g3sw">'+C.map(function(x){return '<button data-pmc="'+x+'" class="'+(x===c?'on':'')+'" style="border-color:'+ccol(x)+'">'+esc(SC.cname(x))+'</button>'}).join('')+'<button class="pmall" data-pma="1">📋 全班 一次 複製（'+ids.length+' 則）</button></div><span id="pmmsg" class="note"></span>';
  if(!ids.length)return h+'<div class="note">先 在 試算表 貼「名單」，才 知道 全班 有 誰。</div>';
  return h+ids.map(function(id){var p=P[id];return '<div class="pmsg'+(p&&(p.count||p.days)?'':' no')+'"><div><div class="pn">'+cidH(id)+' '+esc(nm(id)||'')+'</div><div class="pt" id="pm'+id+'">'+esc(pmText(id,p,per))+'</div></div><button data-pmid="'+id+'">📋 複製</button></div>'}).join('')}
function pmCopy(t,b){var ok=function(){if(b){var o=b.textContent;b.textContent='✅ 複製 好了';setTimeout(function(){b.textContent=o},1800)}};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,function(){fb()});else fb();
  function fb(){var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove();ok()}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-pmc],[data-pmid],[data-pma]');if(!b||TAB!=='m')return;
  if(b.hasAttribute('data-pmc')){PMC=b.getAttribute('data-pmc');draw();return}
  if(b.hasAttribute('data-pmid')){pmCopy($('#pm'+b.getAttribute('data-pmid')).textContent,b);return}
  pmCopy([].map.call(document.querySelectorAll('.pmsg .pt'),function(x){return x.textContent}).join('\\n\\n'),b)});
/* ══ ⚔ 階級 能力（2026-10-26 第二十七次 第 2 點，老師 選 C30 第 4 題「照 表 做」）══
   ★★ 精英戰士 🔥 挑戰關（在家複習〔📅 今日任務〕；答對 金幣 ✖1.5；2026-10-27 第三十一次：暫時 下架）｜★★★ 烈焰戰將 ✍ 出 1 題 給 全班（老師 這裡 按〔✔ 可以〕才 進 現場任務）｜
   ★★★★ 雷霆戰神 🧑‍🏫 小老師（現場任務 公布 答案 的 時候〔🧑‍🏫 請 小老師〕）｜★★★★★ 傳說戰神 ⭐ 一個月 1 次 幫 全班 選 現場任務 遊戲＋🏛 名人堂 */
var QSMSG='';
function paneA(){var T=DATA.tiers||{},Q=(DATA.qsub||[]).filter(function(x){return String(x.id).charAt(0)===String(F.g)}).slice().sort(function(a,b){return (a.st===0?0:1)-(b.st===0?0:1)||b.t-a.t});
  var h='<div class="fvhd g3h">⚔ 階級 愈高 能力 愈強<small>（不加 分數、不讓 題目 變 簡單）</small></div><div class="abl">'+
    [['★ 見習戰士','練習 金幣 多 5%'],['★★ 精英戰士','🔥 挑戰關：在家〔📅 今日任務〕，更難、10 秒，答對 金幣 ✖1.5（暫時 下架）'],['★★★ 烈焰戰將','✍ 出 1 題 給 全班（一週 1 題；老師 下面 按〔✔ 可以〕才 進 現場任務）'],['★★★★ 雷霆戰神','🧑‍🏫 小老師：現場任務 公布 答案 時，老師 可以 請 上台 說 一次 為什麼'],['★★★★★ 傳說戰神','⭐ 一個月 1 次 幫 全班 選 現場任務 遊戲＋🏛 名人堂']]
    .map(function(x){return '<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>'}).join('')+'</div>';
  h+='<h3>✍ 學生 出 的 題（'+(F.g===3?'三':'四')+'年級）<span id="qsmsg" class="note">'+QSMSG+'</span></h3>';
  if(!DATA.qsub)h+='<div class="note">伺服器 還沒有 重新部署（第二十七次）：部署 好了 才 收得到 學生 出 的 題。</div>';
  else if(!Q.length)h+='<div class="note">還沒有 學生 出題（要 ★★★ 烈焰戰將 才 能 出）。</div>';
  h+=Q.map(function(x){return '<div class="qsc'+(x.st===1?' ok':x.st===-1?' no':'')+'"><div>'+cidH(x.id)+' '+esc(nm(x.id)||'')+'　<span class="note">'+dt(x.t)+'　'+(x.st===1?'✅ 已經 放進 現場任務':x.st===-1?'✕ 不要':'⏳ 等 老師 看')+'</span></div>'+
    '<div class="qz">「'+esc(x.zh)+'」的 英文 是？</div><div class="qo">'+x.o.map(function(o,i){return '<span class="'+(i?'':'a')+'">'+(i?'':'✅ ')+esc(o)+'</span>'}).join('')+'</div>'+
    (x.st===1?'<button data-qk="'+x.k+'" data-qv="0">↩ 拿掉</button>':'<button class="y" data-qk="'+x.k+'" data-qv="1">✔ 可以</button>'+(x.st===-1?'':'<button class="n" data-qk="'+x.k+'" data-qv="-1">✕ 不要</button>'))+'</div>'}).join('');
  var byT=function(n){var o={};Object.keys(T).forEach(function(id){if(T[id]>=n&&id.charAt(0)===String(F.g))(o[id.slice(0,3)]=o[id.slice(0,3)]||[]).push(id)});return o};
  [[4,'🧑‍🏫 小老師（★★★★ 以上）'],[5,'🏛 名人堂（★★★★★ 傳說戰神）']].forEach(function(z){var o=byT(z[0]);h+='<h3>'+z[1]+'</h3>'+((SC.CLASSES[F.g]||[]).map(function(c){var L=(o[c]||[]).sort();return L.length?'<div class="qsc">'+esc(SC.cname(c))+'：'+L.map(function(id){return cidH(id)+' '+esc(nm(id)||'')}).join('　')+'</div>':''}).join('')||'<div class="note">還沒有 人</div>')});
  return h}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-qk]');if(!b||TAB!=='a')return;QSMSG='⏳ 存起來 中…';draw();
  post({a:'qok',pw:PW,k:b.getAttribute('data-qk'),v:+b.getAttribute('data-qv')}).then(function(j){if(j&&j.ok){DATA.qsub=j.qsub;QSMSG='✔ 存好了'}else QSMSG='❌ 存不起來（'+((j&&j.err)||'伺服器 還沒 重新部署')+'）';draw()},function(){QSMSG='📶 沒有 網路';draw()})});
function paneF(){var D=(DATA.own||{})[F.g]||{o:{},e:{}},M=D[FAVM]||{},L=favIds(FAVK).map(function(id){return {id:id,v:M[id]||0}});
  L.sort(function(a,b){return b.v-a.v||(a.id<b.id?-1:1)});var mx=L.length?Math.max(1,L[0].v):1,tot=0;L.forEach(function(x){tot+=x.v});var rk=0;
  var h='<div class="fvhd">📊 '+(F.g===3?'三':'四')+'年級 學生 最喜歡 什麼？<small>（第 1 名 ➜ 最後一名；以後 上架 參考）</small></div>'+
    '<div class="fvsw"><button data-fvm="o" class="'+(FAVM==='o'?'on':'')+'">🛒 買過 的 人數</button><button data-fvm="e" class="'+(FAVM==='e'?'on':'')+'">✋ 現在 正在 用 的 人數</button></div>'+
    '<div class="fvsw">'+FAVG.map(function(x){return '<button data-fvk="'+x[0]+'" class="'+(FAVK===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div>'+
    (DATA.own?'':'<div class="note">伺服器 還沒有 重新部署（第二十五次）：部署 好了 才 看得到 排行榜。</div>')+'<div class="fvl">';
  L.forEach(function(x,i){if(!i||x.v!==L[i-1].v)rk=i+1;var st=SC.rpStar(x.id);
    h+='<div class="fvr'+(rk<=3&&x.v?' t'+rk:'')+(x.v?'':' z')+'" style="animation-delay:'+Math.min(i*.04,2).toFixed(2)+'s"><b class="fvk">'+(rk<=3&&x.v?['','🥇','🥈','🥉'][rk]:'第 '+rk+' 名')+'</b><img src="'+hEqI(x.id)+'" alt="" loading="lazy"><span class="fvn">'+esc(favNm(x.id))+(favOff(x.id)?'<em class="fvoff">已下架</em>':'')+'<small>'+'★★★★★'.slice(0,st)+'</small></span>'+
      '<span class="fvt"><i style="width:'+(x.v/mx*100).toFixed(1)+'%;animation-delay:'+Math.min(i*.04,2).toFixed(2)+'s"></i></span><b class="fvv">'+x.v+' 人</b></div>'});
  return h+'</div>'}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-fvm],[data-fvk]');if(!b||TAB!=='f')return;if(b.hasAttribute('data-fvm'))FAVM=b.getAttribute('data-fvm');else FAVK=b.getAttribute('data-fvk');draw()});
function paneL(){var T=RVT[F.g]||[],cs=lkCls(),G={},h;
  T.forEach(function(x){(G[x.grp]=G[x.grp]||[]).push(x)});
  h='<div class="note">在家複習網站（'+(F.g===3?'三':'四')+'年級複習）：<b class="lkg">🔓 綠色 ＝ 開</b>、<b class="lkr">🔒 紅色 ＝ 鎖</b>。按一下就換、馬上存好。鎖住的主題連任務也打不開；學生只看到「🔒 請先登入」或「🔒 還沒開放」，看不到鎖了哪幾班。教學網站（老師上課用）不鎖。</div>'+
   '<h3>① 哪幾班</h3><div class="lkrow">'+SC.CLASSES[F.g].map(function(c){return '<button data-lkc="'+c+'" class="'+(cs.indexOf(c)>=0?'on':'')+'">'+(cs.indexOf(c)>=0?'☑ ':'☐ ')+esc(SC.cname(c))+'</button>'}).join('')+'<button data-lkc="*">✅ 全年級</button></div>'+
   '<h3>② 按主題 要做什麼</h3><div class="lkrow"><button data-lkm="t" class="'+(LKM==='t'?'on':'')+'">🔓🔒 按一下 ＝ 開／鎖</button><button data-lkm="d" class="'+(LKM==='d'?'on':'')+'">📅 按一下 ＝ 設定 開放時間</button></div>'+
   (LKM==='d'?'<div class="lkw">'+wRow('lkw')+'<div class="lkrow"><button data-lkdall="1" class="lkt">📅 全部主題 都用這段時間</button></div><div class="note">在這段時間 🟢 開放；之前 ⏳ 還沒開始、之後 ⛔ 結束了（都鎖住）。同一個主題 再按一次 ＝ 時間拿掉。</div></div>':
     '<div class="lkrow"><button data-lka="0" class="lkg">🔓 全部開</button><button data-lka="1" class="lkr">🔒 全部鎖</button></div>')+
   '<div class="lkrow"><span id="lkmsg">'+LKMSG+'</span></div><h3>③ 一個一個（按一下 ＝ '+(LKM==='d'?'設定 開放時間':'換')+'）</h3>';
  var now=Date.now();
  Object.keys(G).forEach(function(gr){h+='<h4 class="lkh">'+esc(gr)+'</h4><div class="lkgrid">'+G[gr].map(function(x){var st=lkSt(x.k),on=st.n===st.all&&st.all>0,part=st.n&&!on;
    var tm=st.tw?'<em class="lktm">📅 '+tkT(st.tw[0])+' ～ '+tkT(st.tw[1])+'　'+wSt(st.tw,now)+(st.tn<st.all?'（只有幾班）':'')+'</em>':'';
    return '<button data-lk="'+x.k+'" class="lkb '+(st.tw&&!st.n?'lkt':on?'lkr':part?'lky':'lkg')+'"><span class="lki">'+(st.tw&&!st.n?'📅':on||part?'🔒':'🔓')+'</span><span class="lkt0">'+esc(x.t)+'</span>'+
      (st.who.length&&!st.gall?'<em>只有 '+st.who.map(function(c){return esc(c)}).join('、')+' 鎖</em>':'')+tm+'</button>'}).join('')+'</div>'});
  return h}
function lkPost(keys,on){var cs=lkCls();if(!cs.length){LKMSG='❗ 請先選班級';draw();return}
  var old=DATA.locks||{};DATA.locks=SC.lkSet(old,cs,keys,on);DATA.lockt=SC.lktSet(DATA.lockt||{},cs,keys,null,null);LKMSG='⏳ 存起來中…';draw();
  post({a:'lock',pw:PW,cls:cs,keys:keys,on:on}).then(function(j){if(j&&j.ok){DATA.locks=j.locks;if(j.lockt)DATA.lockt=j.lockt;LKMSG='✔ 存好了'}else{DATA.locks=old;LKMSG='❌ 存不起來（'+((j&&j.err)||'')+'）'}if(TAB==='l')draw()},
    function(){DATA.locks=old;LKMSG='📶 連不到伺服器，沒有存';if(TAB==='l')draw()})}
/* 開放時間：w ＝ [從, 到]（null ＝ 拿掉時間） */
function lktPost(keys,w,cb,cls){var cs=cls||lkCls();if(!cs.length){LKMSG='❗ 請先選班級';draw();return}
  LKMSG='⏳ 存起來中…';if(TAB==='l')draw();
  return post({a:'lockt',pw:PW,cls:cs,keys:keys,from:w?w[0]:null,to:w?w[1]:null}).then(function(j){if(j&&j.ok){DATA.locks=j.locks;DATA.lockt=j.lockt;LKMSG='✔ 存好了'}else LKMSG='❌ 存不起來（'+((j&&j.err)||'')+'）';if(TAB==='l')draw();if(cb)cb(j)},
    function(){LKMSG='📶 連不到伺服器，沒有存';if(TAB==='l')draw();if(cb)cb(null)})}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;if(TAB!=='l')return;
  if((b=c('[data-lkc]'))){var k=b.getAttribute('data-lkc'),cs=lkCls();LKMSG='';
    if(k==='*')LKC.c=SC.CLASSES[F.g].slice();else{var i=cs.indexOf(k);if(i>=0)cs.splice(i,1);else cs.push(k)}draw();return}
  if((b=c('[data-lka]'))){lkPost((RVT[F.g]||[]).map(function(x){return x.k}),b.getAttribute('data-lka')==='1');return}
  if((b=c('[data-lkm]'))){LKM=b.getAttribute('data-lkm');LKMSG='';draw();return}
  if((b=c('[data-lkdall]'))){var w0=wRead('lkw');if(!w0){LKMSG='❗ 請填好時間（截止要比開始晚）';draw();return}lktPost((RVT[F.g]||[]).map(function(x){return x.k}),w0);return}
  if((b=c('#pane [data-lk]'))){var kk=b.getAttribute('data-lk'),st=lkSt(kk);
    if(LKM==='d'){var w1=wRead('lkw');if(!w1){LKMSG='❗ 請填好時間（截止要比開始晚）';draw();return}
      lktPost([kk],st.tsame&&st.tw[0]===w1[0]&&st.tw[1]===w1[1]?null:w1);return}
    lkPost([kk],!(st.n===st.all&&st.all>0));return}
});
/* ══ 2026-10-17 老師看完 C9（第八次）第 10 題 甲＋乙：〔📅 一鍵設定〕＝〔🔒 開關〕＋〔📌 任務〕合併成一頁（原本兩頁照樣留著）══
   ① 哪幾班 ➜ ② 哪些（🏠 在家複習 的主題＋🎮 遊戲／📝 複習題／📘 Review 1／💼 職業單字）➜ ③ 什麼時候（🔓 現在開／🔒 現在關／📅 從～到）➜〔✅ 一鍵設定〕
   做法（用原本的兩套，學生端不用改）：
     🏠 在家複習的主題 ＝〔🔒 開關〕：🔓 開、🔒 鎖、📅 開放時間（LOCKT）
     其他 ＝〔📌 任務〕：📅 ＝ 派一個任務「📅 一鍵設定」（那段時間只開這些、看得到誰做完）；🔓 ＝ 從這幾班的任務拿掉（自由練習）；🔒 ＝ 一個已經截止的任務「🔒 現在關」（刪掉才再開）
   下面「📋 現在的設定」：任務（🟢 開放中／⏳ 還沒開始／⛔ 結束了＋✅ 幾個人做完）、開放時間、鎖住的主題 */
var OK0=null,OKMSG='',OKOPEN={};
function okS(){if(!OK0||OK0.g!==F.g)OK0={g:F.g,c:F.cls?[F.cls]:SC.CLASSES[F.g].slice(),it:{},w:'d'};return OK0}
function okGroups(){var G=[],rv={};(RVT[F.g]||[]).forEach(function(x){(rv[x.grp]=rv[x.grp]||[]).push([x.k,x.t])});
  Object.keys(rv).forEach(function(gr){G.push({t:'🏠 在家複習：'+gr,L:rv[gr],rv:1})});
  var T=tkItems(F.g);Object.keys(T).forEach(function(gr){G.push({t:gr,L:T[gr].map(function(x){return [x[0],x[1].replace(/^[三四]年級 ?/,'')]})})});return G}
function paneO(){var S=okS(),G=okGroups(),now=Date.now(),n=Object.keys(S.it).length;
  var h='<div class="note">一個地方設定完：<b>選班 ➜ 選項目 ➜ 選時間 ➜〔✅ 一鍵設定〕</b>。時間到 自動開、自動關。原本的〔📌 任務〕〔🔒 開關〕也都還在。</div>'+
   '<h3>① 哪幾班</h3><div class="lkrow">'+SC.CLASSES[F.g].map(function(c){var on=S.c.indexOf(c)>=0;return '<button data-okc="'+c+'" class="'+(on?'on':'')+'">'+(on?'☑ ':'☐ ')+esc(SC.cname(c))+'</button>'}).join('')+'<button data-okc="*">✅ 全年級</button></div>'+
   '<h3>② 哪些 <span class="okn">已選 '+n+' 個</span>'+(n?'<button data-okclr="1" class="okclr">✕ 全部不選</button>':'')+'</h3>';
  G.forEach(function(g,gi){var sel=g.L.filter(function(x){return S.it[x[0]]}).length;
    h+='<details class="okg" data-gi="'+gi+'"'+(sel||OKOPEN[gi]?' open':'')+'><summary>'+esc(g.t)+' <span class="okn">'+(sel?'已選 '+sel+'／':'')+g.L.length+'</span></summary><div class="lkrow"><button data-okall="'+gi+'">'+(sel===g.L.length?'☐ 這一組 全部不選':'☑ 這一組 全選')+'</button></div><div class="okgrid">'+
      g.L.map(function(x){var on=!!S.it[x[0]];return '<button data-oki="'+esc(x[0])+'" data-nm="'+esc(x[1])+'" class="oki'+(on?' on':'')+'">'+(on?'☑ ':'☐ ')+esc(x[1])+'</button>'}).join('')+'</div></details>'});
  h+='<h3>③ 什麼時候</h3><div class="lkrow"><button data-okw="open" class="'+(S.w==='open'?'on ':'')+'lkg">🔓 現在 開</button><button data-okw="close" class="'+(S.w==='close'?'on ':'')+'lkr">🔒 現在 關</button><button data-okw="d" class="'+(S.w==='d'?'on ':'')+'lkt">📅 從 ～ 到</button></div>'+
   (S.w==='d'?wRow('okw'):'')+
   '<div class="lkrow" style="margin-top:12px"><button id="okgo" class="okgo">✅ 一鍵設定</button><span id="okmsg">'+OKMSG+'</span></div>';
  /* 📋 現在的設定 */
  var L=tkList().sort(function(a,b){var st=function(t){return t.from<=now&&now<=t.to?0:(t.from>now?1:2)};return st(a)-st(b)||a.from-b.from});
  h+='<h3>📋 現在的設定（'+(F.g===3?'三':'四')+'年級'+(F.cls?' '+esc(SC.cname(F.cls)):'')+'）</h3><div class="oklst">';
  L.forEach(function(t){var st=t.from<=now&&now<=t.to?'🟢 開放中':(t.from>now?'⏳ 還沒開始':'⛔ 結束了'),dn=0,tot=0;
    (F.cls?[F.cls]:t.cls).forEach(function(c){var done={};ALL.forEach(function(r){if(!r.x&&r.cls===c&&r.t>=t.from&&r.t<=t.to+SC.TKGRACE&&t.items.indexOf(r.set)>=0)(done[r.id]=done[r.id]||{})[r.set]=1});
      dn+=Object.keys(done).filter(function(id){return Object.keys(done[id]).length>=t.items.length}).length;tot+=(RCLS[c]||[]).length});
    h+='<div class="okl"><b>'+st+'</b><span>📌 '+esc(t.name)+'</span><span>'+t.cls.map(function(c){return esc(c)}).join('、')+'</span><span>'+t.items.length+' 個：'+t.items.slice(0,3).map(function(k){return esc(t.nm&&t.nm[k]||k)}).join('、')+(t.items.length>3?'…':'')+'</span>'+
      '<span>⏰ '+tkT(t.from)+' ～ '+tkT(t.to)+'</span><span>✅ '+dn+(tot?'／'+tot:'')+' 人做完</span><span class="okb"><button data-tke="'+esc(t.id)+'">✏️</button><button data-tkd="'+esc(t.id)+'">🗑</button></span></div>'});
  var T=DATA.lockt||{},Lk=DATA.locks||{},nmOf={};(RVT[F.g]||[]).forEach(function(x){nmOf['g'+F.g+'rv_'+x.k.replace(/^g\drv_/,'')]=x.t;nmOf[x.k]=x.t});
  (F.cls?[F.cls]:SC.CLASSES[F.g]).forEach(function(c){var m=T[c]||{};Object.keys(m).forEach(function(k){
    h+='<div class="okl"><b>'+wSt(m[k],now)+'</b><span>🏠 '+esc(nmOf[k]||k)+'</span><span>'+esc(c)+'</span><span>📅 開放時間</span><span>⏰ '+tkT(m[k][0])+' ～ '+tkT(m[k][1])+'</span><span></span><span class="okb"><button data-okdt="'+esc(c)+'|'+esc(k)+'">🗑</button></span></div>'});
    var lk=Lk[c]||[];if(lk.length)h+='<div class="okl"><b>🔒 關著</b><span>🏠 '+lk.slice(0,4).map(function(k){return esc(nmOf[k]||k)}).join('、')+(lk.length>4?'…（'+lk.length+' 個）':'')+'</span><span>'+esc(c)+'</span><span>〔🔒 開關〕</span><span></span><span></span><span class="okb"></span></div>'});
  if(h.lastIndexOf('<div class="oklst">')===h.length-19)h+='<div class="note">還沒有設定 ➜ 學生全部都可以自由練習。</div>';
  return h+'</div>'}
function okGo(){var S=okS(),keys=Object.keys(S.it),cs=S.c.slice();OKMSG='';
  if(!cs.length){OKMSG='❗ ① 請選至少一班';draw();return}if(!keys.length){OKMSG='❗ ② 請選至少一個';draw();return}
  var w=null;if(S.w==='d'){w=wRead('okw');if(!w){OKMSG='❗ ③ 請填好時間（截止要比開始晚）';draw();return}}
  var rv=keys.filter(function(k){return SC.LKRE.test(k)}),tk=keys.filter(function(k){return !SC.LKRE.test(k)}),nm={};tk.forEach(function(k){nm[k]=S.it[k]});
  var jobs=[],now=Date.now();
  if(rv.length){if(S.w==='d')jobs.push({a:'lockt',pw:PW,cls:cs,keys:rv,from:w[0],to:w[1]});else jobs.push({a:'lock',pw:PW,cls:cs,keys:rv,on:S.w==='close'})}
  if(tk.length){
    if(S.w==='d')jobs.push({a:'task',pw:PW,op:'set',t:{id:'t'+now,name:'📅 一鍵設定',g:F.g,cls:cs,items:tk,nm:nm,from:w[0],to:w[1]}});
    else if(S.w==='close')jobs.push({a:'task',pw:PW,op:'set',t:{id:'c'+now,name:'🔒 現在關',g:F.g,cls:cs,items:tk,nm:nm,from:now-6e4,to:now-1000}});
    else (DATA.tasks||[]).filter(function(t){return t.g===F.g&&t.cls.some(function(c){return cs.indexOf(c)>=0})&&t.items.some(function(k){return tk.indexOf(k)>=0})}).forEach(function(t,i){
      var rest=t.cls.filter(function(c){return cs.indexOf(c)<0}),mine=t.cls.filter(function(c){return cs.indexOf(c)>=0}),left=t.items.filter(function(k){return tk.indexOf(k)<0});
      if(rest.length)jobs.push({a:'task',pw:PW,op:'set',t:{id:t.id,name:t.name,g:t.g,cls:rest,items:t.items,nm:t.nm,from:t.from,to:t.to}});
      else jobs.push({a:'task',pw:PW,op:'del',id:t.id});
      if(left.length)jobs.push({a:'task',pw:PW,op:'set',t:{id:'s'+now+i,name:t.name,g:t.g,cls:mine,items:left,nm:t.nm,from:t.from,to:t.to}})})}
  if(!jobs.length){OKMSG='✔ 本來就開著（沒有任務鎖住它們）';draw();return}
  OKMSG='⏳ 存起來中…';draw();
  (function next(i){if(i>=jobs.length){OKMSG='✔ 設定好了（'+(S.w==='open'?'🔓 開了':S.w==='close'?'🔒 關了':'📅 '+tkT(w[0])+' ～ '+tkT(w[1]))+'）';S.it={};draw();return}
    post(jobs[i]).then(function(j){if(!j||!j.ok){OKMSG='❌ 存不起來（'+((j&&j.err)||'')+'）';draw();return}
      if(j.tasks)DATA.tasks=j.tasks;if(j.locks)DATA.locks=j.locks;if(j.lockt)DATA.lockt=j.lockt;next(i+1)},function(){OKMSG='📶 連不到伺服器，沒有存完';draw()})})(0)}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if((b=c('[data-wpre]'))){LKW=wPre(b.getAttribute('data-wpre'));draw();return}
  if(TAB!=='o')return;var S=okS();
  if((b=c('[data-okc]'))){var k=b.getAttribute('data-okc');if(k==='*')S.c=SC.CLASSES[F.g].slice();else{var i=S.c.indexOf(k);if(i>=0)S.c.splice(i,1);else S.c.push(k)}draw();return}
  if((b=c('[data-oki]'))){var kk=b.getAttribute('data-oki');if(S.it[kk])delete S.it[kk];else S.it[kk]=b.getAttribute('data-nm');draw();return}
  if((b=c('[data-okall]'))){var g=okGroups()[+b.getAttribute('data-okall')],all=g.L.every(function(x){return S.it[x[0]]});g.L.forEach(function(x){if(all)delete S.it[x[0]];else S.it[x[0]]=x[1]});draw();return}
  if(c('[data-okclr]')){S.it={};draw();return}
  if((b=c('[data-okw]'))){S.w=b.getAttribute('data-okw');draw();return}
  if(c('#okgo')){okGo();return}
  if((b=c('[data-okdt]'))){var a=b.getAttribute('data-okdt').split('|');if(!confirm('拿掉這個開放時間？（拿掉以後 ＝ 開著）'))return;lktPost([a[1]],null,function(){draw()},[a[0]]);return}
});
/* 打開的組記住（重畫以後不會收起來） */
document.addEventListener('toggle',function(e){var d=e.target;if(d&&d.classList&&d.classList.contains('okg'))OKOPEN[d.getAttribute('data-gi')]=d.open},true);
/* 時間格子改了要記住（換頁、重畫不會跑回預設） */
document.addEventListener('change',function(e){var id=e.target.id;if(/^(lkw|okw)[12]$/.test(id))wRead(id.slice(0,3))});
/* 這一個年級可以派的項目：老師看板的題庫（遊戲、📝 複習題、📘 Review 1、💼 職業單字） */
/* 〔📱 現場 QR〕（2026-10-18 第十二次 老師 2）：一鍵 複製 網址；點 班級 ➜ 每 2 秒 問 一次 Firebase 的 rooms/0班級/p（學生 平板 每 20 秒 寫 一次 ＝ 在線上）➜ 座號 亮 */
var LVQ={cls:'',seen:{},t:null,u:''};
function lvOpen(){var g=+(($('#fg .on')||{}).getAttribute?$('#fg .on').getAttribute('data-g'):3)||3,fc=($('#fc')||{}).value||'';LVQ.cls=SC.CLASSES[g].indexOf(fc)>=0?fc:(LVQ.cls||SC.CLASSES[g][0]);LVQ.seen={};lvCls();lvPoll()}
function lvCls(){$('#lvcls').innerHTML=[3,4].map(function(g){return SC.CLASSES[g].map(function(c){return '<button data-lvc="'+c+'" class="'+(c===LVQ.cls?'on':'')+'">'+c+(c==='400'?' 課後班':' 班')+'</button>'}).join('')}).join('<span style="width:14px"></span>');lvSeat({})}
function lvPoll(){clearTimeout(LVQ.t);if($('#lvov').hidden)return;var U=String(window.LIVE_DB||'').replace(/[/]+$/,''),cls=LVQ.cls;
  if(!U){$('#lvseat').innerHTML='<div class="lvn">⚠ 現場任務 還沒有 設定 Firebase</div>';return}
  fetch(U+'/rooms/0'+cls+'/p.json',{cache:'no-store'}).then(function(r){return r.json()}).then(function(v){if(cls===LVQ.cls)lvSeat(v||{})},function(){}).then(function(){LVQ.t=setTimeout(lvPoll,2000)})}
function lvSeat(P){var now=Date.now(),on=[];for(var id in P){var at=+(P[id]||{}).at||0,s=LVQ.seen[id];if(!s)LVQ.seen[id]={at:at,t:Math.abs(now-at)<3e5?now:0};else if(s.at!==at){s.at=at;s.t=now}}
  for(var k in LVQ.seen)if(now-LVQ.seen[k].t<60000)on.push(+k.slice(3));
  var h='';for(var i=1;i<=30;i++)h+='<span class="'+(on.indexOf(i)>=0?'on':'')+'">'+(i<10?'0':'')+i+'</span>';
  $('#lvseat').innerHTML='<div class="lvn">'+LVQ.cls+' 班：已經 加入 <b>'+on.length+'</b> 人</div><div class="lvs">'+h+'</div>'}
function lvCopy(){var b=$('#lvcp'),u=LVQ.u,ok=function(){b.textContent='✅ 複製 好了';setTimeout(function(){b.textContent='📋 複製 遊戲 網址'},2000)};
  var fb=function(){var t=document.createElement('textarea');t.value=u;document.body.appendChild(t);t.select();try{document.execCommand('copy');ok()}catch(e){}t.remove()};
  try{navigator.clipboard.writeText(u).then(ok,fb)}catch(e){fb()}}
function tkItems(g){var G={};Object.keys(BANK).forEach(function(k){if(k.indexOf('g'+g)!==0&&k.indexOf('g*')!==0)return;if(BANK[k].lm)return;   /* ⚡ 等人小遊戲 只在 現場任務 等人 的 時候 玩，不派 任務 */
  var key=k.replace('g*','g'+g),c=SC.cat(key),gr=/^g.(gm|l)_job-/.test(key)?'💼 職業單字':c.t;if(g===3&&gr==='💼 職業單字')return;   /* 職業單字是四年級 Unit 2 的主題 */(G[gr]=G[gr]||[]).push([key,BANK[k].name])});return G}
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
  if(c('#lvqr')){var u=String(location.href).split('#')[0].split('?')[0].replace(/teacher[/](index[.]html)?$/,'live/');try{var q=qrcode(0,'M');q.addData(u);q.make();$('#lvq').innerHTML=q.createSvgTag({cellSize:8,margin:2,scalable:true})}catch(e){$('#lvq').textContent='QR Code 做不出來'}
    $('#lvu').textContent=u.replace(/^https?:[/][/]/,'');$('#lvov').hidden=false;LVQ.u=u;lvOpen();return}
  if(c('#lvcp')){lvCopy();return}
  if((b=c('[data-lvc]'))){LVQ.cls=b.getAttribute('data-lvc');LVQ.seen={};lvCls();lvPoll();return}
  if(c('#lvx')||e.target.id==='lvov'){$('#lvov').hidden=true;clearTimeout(LVQ.t);return}
  if(c('#more')){var mp=$('#morep');mp.hidden=!mp.hidden;$('#more').classList.toggle('on',!mp.hidden);$('#more').setAttribute('aria-expanded',String(!mp.hidden));mpFit();return}
  if(!c('#morep')&&$('#morep')&&!$('#morep').hidden){$('#morep').hidden=true;$('#more').classList.remove('on')}
  if(c('#khelp')){KHELP=KHELP?0:1;draw();return}
  if((b=c('[data-kac]'))){KAC=b.getAttribute('data-kac');draw();return}
  if((b=c('[data-kgo]'))){var sec=b.closest('.kgrp');if(sec)sec.classList.toggle('open');return}
  if(c('#thelp')){THELP=THELP?0:1;draw();return}
  if(c('.alert1')){TAB='k';$$('#tabs button').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-t')==='k')});draw();return}
  if(c('#zi')||c('#zo')){zoom(c('#zi')?.1:-.1);mpFit();return}
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
  if((b=c('[data-kan2]'))){var k2=b.getAttribute('data-kan2');if(k2==='z')KAN.pz=!KAN.pz;else{KAN.i+=k2==='n'?1:-1;}kanShow();return}   /* 第二十一次 第 11 點 */
  if(c('#hx')){hClose();return}
  if(c('#hnx')){if(HN&&HN.i<HN.P.length-1){HN.i++;hShow()}return}
  if(c('#hpv')){if(HN&&HN.i>0){HN.i--;hShow()}return}
  if(c('#hre')){if(HN){HN.i=0;HN.st=HON.pick('t');HN.gst=GLORY.pick();hShow()}return}
  if(c('#hsd')){HSND=HSND?0:1;lss0('hsnd',HSND);if(HSND)HON.ac();hCtl();return}
  if(c('#hnmb')){HNM=HNM?0:1;lss0('hnm',HNM);hCtl();if(HN){var k=HN.key,i=HN.i,g0=HN.gst;hOpen(k);HN.i=i;HN.gst=g0;hShow()}return}
  if(c('#heqb')){HEQ=HEQ?0:1;lss0('heq',HEQ);hCtl();if(HN){var k2=HN.key,i2=HN.i,g2=HN.gst;hOpen(k2);HN.i=i2;HN.gst=g2;hShow()}return}
  if(c('#hpr')){if(HN)hPrint();return}
  if(c('#cerGo')){cerOpen();$('#csd').textContent='🔊 聲音：'+(HSND?'開':'關');return}
  if(c('#cx')){cerClose();return}
  if(c('#cnx')){if(CER){CER.i=CER.i<CER.D.length?CER.i+1:0;cerShow()}return}
  if(c('#cps')){if(CER){CER.pause=!CER.pause;$('#cps').textContent=CER.pause?'▶ 繼續':'⏸ 停';if(CER.pause)clearTimeout(CER.tm);else CER.tm=setTimeout(function(){if(CER){CER.i++;cerShow()}},2500)}return}
  if(c('#csd')){HSND=HSND?0:1;lss0('hsnd',HSND);if(HSND)HON.ac();$('#csd').textContent='🔊 聲音：'+(HSND?'開':'關');return}
  if(c('#delp')){$('#delc').hidden=false;$('#delp').hidden=true;$('#deli').value='';$('#deli').focus();return}
  if(c('#delno')){$('#delc').hidden=true;$('#delp').hidden=false;return}
  if(c('#delgo')){var did=$('#delp').getAttribute('data-id');if($('#deli').value.trim()!==did)return;$('#delgo').disabled=true;$('#delm').textContent='⏳ 刪除中…';
    post({a:'delp',pw:PW,id:did}).then(function(j){if(j.ok){ALL=ALL.filter(function(x){return x.id!==did});$('#modal').classList.remove('on');draw();toast('🗑 已刪除 '+did+' 的成績（'+j.n+' 筆）')}
      else{$('#delm').textContent='❌ 沒有刪掉（'+(j.err||'')+'），請再試一次';$('#delgo').disabled=false}},function(){$('#delm').textContent='❌ 連不上，請再試一次';$('#delgo').disabled=false});return}
  if(c('#pmb')){pMore($('#pmore').hidden);return}
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
    post({a:'void',pw:PW,u:u,v:v}).then(function(j){if(j.ok){ALL.forEach(function(x){if(x.u===u)x.x=v});var op=!$('#pdet').hidden;draw();person(PID);if(op){pMore(true);$('#pdet').hidden=false;$('#pdb').classList.add('on')}}else b.disabled=false},function(){b.disabled=false});return}
  if(c('#rf')){$('#morep').hidden=true;$('#more').classList.remove('on');post({a:'teacher',pw:PW}).then(load);return}   /* 按了就收起選單（2026-10-17：選單蓋住〔📌 任務〕分頁） */
  if(c('#dl')){excel();return}
});
document.addEventListener('input',function(e){if(e.target.id==='deli'){$('#delgo').disabled=e.target.value.trim()!==$('#delp').getAttribute('data-id')}});
function toast(m){var t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(toast.tm);toast.tm=setTimeout(function(){t.classList.remove('on')},3500)}
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
