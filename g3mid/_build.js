/* g3mid/_build.js — 📝 三年級 複習（期中考範圍 10 種限時遊戲；2026-10-25 老師第二十四次；規格 g3mid/CLAUDE.md）
 *   node g3mid/_build.js  ➜  g3mid/index.html（一頁：大廳 ＋ 10 種遊戲）
 * 題庫：g3mid/_data.js（唯一真相）。手寫辨識：g3mid/_hw.js。語音：g3mid/audio/（node g3mid/_audio.js）。照片：g3mid/img/（老師給的 Classroom English 截圖切的）。
 * 只放在老師的教學總首頁（words/_build_hub.js 的〔📝 三年級 複習〕）；在家複習沒有。
 * 2026-10-26 第二十七次 第 1-(3) 點（老師：「三年級複習」成績 也 進 老師看板）：要 登入；跟 四年級 期中複習（midterm/）一樣 送 成績：
 *   題組 g3gm_g3m-遊戲（老師看板 類別「🏫 三年級 複習」、〔🏫 課堂複習〕大表），每題 [答對, 選了 第幾個, 秒數, 秒按, 剩下, 題庫 第幾題]；
 *   中途 離開 也 送（老師：平均 正確率 只 算 已經 作答 的 題目）。 */
const fs = require('fs'), path = require('path');
const DECX = require('./_decode.js'), D = require('./_data.js'), HW = require('./_hw.js'), CL = require('../score/_client.js');
/* 2026-10-30 第三十四次 第 7 點：數字 金幣磚 母音 字母 紅、不發音 字母 灰（照 words/_phonics.js 的 音標：s ＝ 不發音、n ＝ 有 母音 的 聲音）*/
const PHX = require('../words/_phonics.js'), NUMC = {};
[].concat(...[D.GAMES.find(g => g.id === 'q6').B, (D.XB || {}).q6 || [], (D.XB2 || {}).q6 || []]).forEach(q => { const w = q.want, d = PHX.DATA[w]; if (!d) throw new Error('數字 金幣磚：' + w + ' 沒有 音標（words/_phonics.js）');
  let c = ''; d.forEach(sy => sy.forEach(g => { for (const ch of g.L) c += g.s ? 's' : g.n && /[aeiouy]/.test(ch) ? 'v' : '-'; })); if (c.length !== w.length) throw new Error('數字 金幣磚 顏色 對不上：' + w); NUMC[w] = c; });
const J = o => JSON.stringify(o).replace(/</g, '\\u003c');
const AUD = fs.existsSync(path.join(__dirname, 'audio/aud.js'));

/* ── 嚴禁洩題：考卷的原題不可以出現（build 失敗）── */
const LEAK = [];
D.GAMES[0].B.forEach(q => { if (D.EXAM_A[q.say] && q.o.indexOf(D.EXAM_A[q.say]) >= 0) LEAK.push('打地鼠 ' + q.say + ' 配 ' + D.EXAM_A[q.say]); });
D.GAMES[3].B.forEach(q => { if (D.EXAM_D.indexOf(q.say) >= 0) LEAK.push('挖礦 ' + q.say); });
D.GAMES[4].B.forEach(q => { if (D.EXAM_E.indexOf(q.show + '>' + q.want) >= 0) LEAK.push('魔鏡 ' + q.show + '>' + q.want); });
const BAN = /\b(Mike|Emma|Wendy|Roy|Sam|Ann|Lily|Ken|Alan|Harry)\b/;   /* 2026-10-26：考卷 H 的 Ken、Alan、老師 截圖（課本）的 Harry 也 不用 */
D.GAMES.forEach(g => g.B.forEach(q => { if (BAN.test(JSON.stringify(q))) LEAK.push(g.nm + '：' + JSON.stringify(q).match(BAN)[0]); }));
D.GAMES.forEach(g => { if (g.B.length < 8) LEAK.push(g.nm + ' 題庫不到 8 題');
  g.B.forEach(q => { if (q.o && new Set(q.o.map(x => JSON.stringify(x))).size !== q.o.length) LEAK.push(g.nm + ' 選項重複 ' + JSON.stringify(q.o)); }); });
/* 2026-10-26 第二十八次：📝 25／50 題 挑戰 的 題庫（D.XB）：跟 考卷、「三年級 複習」、課堂複習 1～3 草稿 一題 都 不 一樣；30% 類似；人名 沒 用過 */
{ const C = require('./_class_data.js'), XB = D.XB, cls = id => [].concat(...C.SETS.map(st => C['Q' + id.slice(1)][st[0]])),
    KEY = { q1: q => q.say + '|' + q.o[0], q2: q => JSON.stringify(q.say.map(x => x[1])), q3: q => q.say + '|' + q.o.slice().sort().join(), q4: q => q.say + '|' + q.want, q5: q => (q.lis ? 'lis' : q.show + '>') + q.want,
      q6: q => q.n + '|' + q.obj + '|' + (q.ctx || ''), q7: q => q.s, q8: q => (q.a || q.b) + '|' + q.o[0], q9: q => JSON.stringify(q.c.map(c => [c.t, c.a])) + (q.k ? q.k + q.r : ''), q10: q => q.code },
    CK = { q1: r => r[1] + '|' + r[2], q2: r => JSON.stringify(r[1].map(x => x[1])), q3: r => r[1] + '|' + [r[2]].concat(r[3]).sort().join(), q4: r => r[1] + '|' + r[2], q5: r => r[1] + '>' + r[2],
      q6: r => r[1] + '|' + r[2] + '|' + r[3], q7: r => r[1], q8: r => r[2] + '|' + r[3], q9: r => JSON.stringify(r[1].map(x => [x[0], x[1]])), q10: r => r[1] },
    XBAN = new RegExp('\\b(' + C.BAN.concat(['Mike', 'Emma', 'Wendy', 'Roy', 'Sam', 'Ann', 'Lily'], C.NAMES.c1.b, C.NAMES.c1.g, C.NAMES.c2.b, C.NAMES.c2.g, C.NAMES.c3.b, C.NAMES.c3.g).join('|') + ')\\b');
  /* 2026-10-28 第三十三次：題庫 A（XB）、題庫 B（XB2，新 25／新 50）都 檢查；題庫 B 不用 題庫 A 的 名字（跟 題庫 A 同 一個 考點 可以：老師 C36「對」）；類似 A ≦ 45%、B ≦ 75% */
  [['', XB, .45, XBAN], ['新 ', D.XB2, .75, new RegExp('\\b(' + XBAN.source.slice(3, -3) + '|Bill|Mark|Luke|Adam|Sally|Helen|Molly|Ruby)\\b')]].forEach(([pre, XB, mx, XBAN]) =>
  D.GAMES.forEach(g => { const L = XB[g.id], k = KEY[g.id], old = new Set(g.B.map(k).concat(cls(g.id).map(CK[g.id])));
    if (!L || L.length < 5) LEAK.push(pre + '25／50 題 ' + g.nm + ' 題庫 不到 5 題');
    L.forEach(q => { if (old.has(k(q))) LEAK.push(pre + '25／50 題 ' + g.nm + ' 跟 三年級複習／課堂複習 一樣：' + k(q)); const j = JSON.stringify(q); if (XBAN.test(j)) LEAK.push(pre + '25／50 題 ' + g.nm + ' 用了 用過 的 名字 ' + j.match(XBAN)[0]);
      if (q.o && new Set(q.o.map(x => JSON.stringify(x))).size !== q.o.length) LEAK.push(pre + '25／50 題 ' + g.nm + ' 選項重複');
      if (g.id === 'q1' && D.EXAM_A[q.say] && q.o.indexOf(D.EXAM_A[q.say].toUpperCase()) >= 0) LEAK.push('25／50 題 打地鼠 ' + q.say + ' 配 考卷 的 ' + D.EXAM_A[q.say]); });
    if (new Set(L.map(k)).size !== L.length) LEAK.push(pre + '25／50 題 ' + g.nm + ' 自己 有 一樣 的 題目');
    const sm = L.filter(q => q.sim).length; if (sm < 2 || sm > L.length * mx) LEAK.push(pre + '25／50 題 ' + g.nm + ' 類似 題 ' + sm + '／' + L.length); })); }
if (LEAK.length) { console.error('✗ ' + LEAK.join('\n✗ ')); process.exit(1); }

const SCC = require('../score/_calc.js');
/* ⚔ 英文 對決 擂台 的 戰士（2026-10-25 老師：你 ＝ 學生 選 的 戰士）：戰神之路 現在 上架 的 戰士（RPR.h、不在 RPHIDE），照 稀有度 排 */
const WAR = Object.keys(SCC.RPR.h).filter(id => !SCC.RPHIDE[id] && fs.existsSync(path.join(__dirname, '..', 'rpg', 'chars', id + '.jpg'))).sort((a, b) => SCC.RPR.h[a] - SCC.RPR.h[b] || (a < b ? -1 : 1)).map(id => [id, SCC.RPR.h[id]]);
/* 2026-10-26 第二十六次 第 1-5A 點（老師：學生 沿用 之前 已經 選好 的 戰士）：戰神之路 打開 的 時候 記下 戴著 的 戰士（localStorage rp_hero，rpg/_build.js drawStage）➜ 這裡 直接 用；下架 的 也 可以（學生 自己 的） */
const WARALL = Object.keys(SCC.RPR.h).filter(id => fs.existsSync(path.join(__dirname, '..', 'rpg', 'chars', id + '.jpg')));
if (WAR.length < 20) { console.error('✗ 戰士 圖 太少：' + WAR.length); process.exit(1); }
const GM = D.ORD.map(id => D.GAMES.filter(g => g.id === id)[0]).map(g => ({ id: g.id, ic: g.ic, nm: g.nm, how: g.how, t: g.t, w: g.w || 0, B: g.B, c1: g.c1, c2: g.c2 }));

const CSS = `
@font-face{font-family:Andika;src:url(../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark;--gold:#FFD54A;--ok:#2BD46A;--no:#FF5A5A;--line:#2E4058}
*{box-sizing:border-box}
html,body{margin:0;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;font-weight:700;-webkit-tap-highlight-color:transparent;overflow-x:hidden}
body{min-height:100vh;touch-action:manipulation;background:#070A16 radial-gradient(1200px 700px at 12% -10%,#1E1650 0,transparent 60%) no-repeat;user-select:none;-webkit-user-select:none}
button{font:inherit;font-weight:700;color:#fff;cursor:pointer;touch-action:manipulation}
.scr{max-width:1320px;margin:0 auto;padding:10px 16px 24px}
/* ── 👥 兩人 一台（2026-10-29 第 4 件）── */
.duo{grid-column:1/-1;display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;font-size:clamp(20px,2.6vh,26px);color:#BFD3E6}
.duo button{min-height:60px;padding:6px 22px;border-radius:18px;border:3px solid #4A5A6C;background:#1B2633;font-size:clamp(22px,3vh,28px)}.duo button.on{border-color:#FFD54A;background:#3A3010;color:#FFE38A}
#duob{position:fixed;inset:0;z-index:96;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:rgba(5,8,20,.9);font-size:clamp(40px,7vh,72px);color:#fff;text-align:center;padding:16px}
#duob.on{display:flex;animation:pop .3s}#duob b{font-size:.6em;color:#FFD54A}#duob .p2,.duoe .p2 b{color:#80D8FF}#duob .p1,.duoe .p1 b{color:#FFD54A}
#duot{display:none}body.duoon #duot{display:inline-flex;font-size:clamp(18px,2.4vh,24px);padding:2px 12px;border-radius:999px;border:2px solid #FFD54A;margin-left:8px}
.duoe{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin:16px 0}.duoe>div{display:flex;flex-direction:column;gap:6px;align-items:center;min-width:260px;padding:16px;border-radius:22px;background:#111A28;border:3px solid #2E4058}
.duoe .big{font-size:clamp(36px,6vh,60px);color:#fff}
/* ── 大廳 ── */
.top{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:4px 0}
.top h1{font-size:clamp(34px,5vh,56px);color:var(--gold);margin:0;letter-spacing:.04em;text-shadow:0 4px 0 #6B4A00}
.top .sub{font-size:clamp(20px,2.6vh,26px);color:#BFD3E6}
.home{margin-left:auto;display:inline-flex;align-items:center;min-height:52px;padding:4px 20px;border-radius:16px;background:#1B2633;border:3px solid #4A5A6C;color:#fff;text-decoration:none;font-size:22px}
.xrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}
/* 第三十二次 3-(1)：離開 先 問、繼續 上次 的 */
#crgo{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;background:rgba(5,10,25,.9)}.crgob{text-align:center;color:#fff;border:4px solid #FFD54A;border-radius:28px;padding:28px 40px;background:linear-gradient(#24364D,#13203A)}.crgot{font-size:clamp(34px,5vh,54px);font-weight:900;color:#FFE07A;margin:8px 0}
.xoff{grid-column:1/-1;text-align:center;font-size:clamp(18px,2.4vh,24px);color:#9FB3C8;padding:6px;border:2px dashed #3F6386;border-radius:16px}
#xq{position:fixed;inset:0;z-index:90;display:none;align-items:center;justify-content:center;background:rgba(5,10,25,.82)}#xq.on{display:flex}
.xqb{width:min(92vw,720px);border-radius:28px;border:4px solid #FFD54A;background:linear-gradient(#24364D,#13203A);padding:22px 20px;text-align:center;box-shadow:0 20px 60px #000a}
.xqi{font-size:64px}.xqh{font-size:clamp(32px,4.6vh,46px);font-weight:900;color:#FFE07A}.xqt{font-size:clamp(22px,3vh,30px);line-height:1.5;margin:10px 0 16px}.xqt b{color:#7BF0A8}
.xqbtn{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}.xqbtn button{min-height:72px;min-width:240px;border-radius:20px;border:0;font-size:clamp(24px,3vh,30px);font-weight:900;color:#fff}
#xstay{background:linear-gradient(#22C766,#128A43)}#xleave{background:#3A4A66}
.xbw{display:flex;flex-direction:column;gap:8px}.xbw .xb{border-color:#2BD46A;background:linear-gradient(#0E5A2E,#06301A);box-shadow:0 0 24px #2BD46A66}
.xb2{min-height:52px;border-radius:16px;border:2px solid #FFD54A88;background:#2A2A3A;color:#FFE07A;font-size:22px;font-weight:800}
.xb{display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 10px;border-radius:24px;border:4px solid #FFD54A;background:linear-gradient(#5A3A00,#2A1A00);box-shadow:0 0 24px #FFD54A55;min-height:110px}
.xb b{font-size:clamp(28px,4vh,40px);color:#FFE07A}.xb small{font-size:clamp(18px,2.4vh,22px);color:#FFF3C4}
@media (max-width:640px){.xrow{grid-template-columns:1fr}}
.xpg{font-size:clamp(18px,2.4vh,22px);color:#FFE07A;margin-right:8px;white-space:nowrap}#go .glv{font-size:clamp(30px,5vh,52px);color:#FFE07A;background:#2A1A00;border:3px solid #FFD54A;border-radius:999px;padding:2px 28px;margin-bottom:6px;animation:gpop .6s both}
.xtb{margin:8px auto;border-collapse:collapse;font-size:clamp(20px,2.6vh,26px)}.xtb td,.xtb th{border:2px solid #2E4058;padding:4px 14px}.xtb td.ok{color:#2BD46A}.xsc b{font-size:1.5em;color:#FFE07A}
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
.lawn{position:relative;width:min(980px,100%);height:clamp(280px,44vh,440px);perspective:900px}
/* 2026-10-26 第 1-1 點：上面 一排 ＝ 圖（這個 字 是 什麼）＋ 說明 ＋〔🔊 再聽一次〕〔🐢 慢慢 唸〕 */
.q1top{display:flex;align-items:center;justify-content:center;gap:clamp(10px,2vw,24px);flex-wrap:wrap;width:min(980px,100%)}
.q1pic{font-size:clamp(64px,10vh,104px);line-height:1;background:#FFF8E1;border-radius:24px;padding:6px 18px;box-shadow:0 6px 0 #C9A04A;animation:q1p 1.6s ease-in-out infinite}
@keyframes q1p{50%{transform:scale(1.06) rotate(-3deg)}}
.q1t{font-size:clamp(22px,3vh,30px);font-weight:900;line-height:1.35;text-align:left}.q1t b{color:#FFE07A}
.q1btn{display:flex;flex-direction:column;gap:10px}.q1btn .hear{min-height:60px;font-size:clamp(22px,3vh,30px)}.hear.slow{background:linear-gradient(#2BB673,#16804C);box-shadow:0 6px 0 #0B5A33}
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
.q2sc{position:relative;font-size:clamp(46px,8vh,78px);display:flex;gap:2px;align-items:center;padding-top:.5em}.q2b{position:absolute;right:-.1em;top:-.15em;font-size:max(20px,.48em);background:#fff;border-radius:1em;padding:.08em .35em;box-shadow:0 2px 0 rgba(0,0,0,.25)}.q2b:after{content:'';position:absolute;left:30%;bottom:-.3em;border:.18em solid transparent;border-top-color:#fff}.q2sc .fx{font-size:.55em;align-self:flex-start}
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
.cap .cw{display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:4/3;border-radius:18px;border:5px solid #fff;background:#FFF6E0;font-size:clamp(50px,9vh,96px);box-shadow:0 8px 0 rgba(0,0,0,.3),0 0 0 4px #B0306A}
.prz .pin .cw{width:clamp(110px,16vh,170px);aspect-ratio:4/3;border-radius:12px;border:4px solid #2BD46A;background:#FFF6E0;display:flex;align-items:center;justify-content:center;font-size:clamp(60px,10vh,100px)}
.q1up{color:#FF6B6B;font-size:1.15em}.mirror.lis{display:flex;align-items:center;justify-content:center}.mlis{width:72%;aspect-ratio:1;border:0;border-radius:50%;background:radial-gradient(#7FD4FF,#1452C4);box-shadow:0 0 30px #7FD4FF;font-size:clamp(60px,10vh,110px)}
.cake6{display:flex;flex-direction:column;align-items:center}.cake6 .objs{gap:2px}.ckb{width:clamp(200px,30vh,300px);height:clamp(70px,11vh,110px);border-radius:14px 14px 22px 22px;background:linear-gradient(#FFB6D5 0 30%,#F7E1B5 30% 60%,#E8A36A 60%);box-shadow:0 8px 0 rgba(0,0,0,.25);position:relative}.ckb i{position:absolute;left:-6%;right:-6%;bottom:-10px;height:14px;border-radius:50%;background:#fff}   /* 蛋糕 自己 畫（🎂 圖示 上面 已經 有 一根 蠟燭，會 數錯）*/
.objs.xdice .dv{width:1em}.objs.xdice{display:grid;grid-template-columns:repeat(3,auto);gap:10px;padding:18px;background:#fff;border-radius:24px;box-shadow:0 8px 0 rgba(0,0,0,.3);width:max-content;margin:0 auto}
.cap img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:18px;border:5px solid #fff;box-shadow:0 8px 0 rgba(0,0,0,.3),0 0 0 4px #B0306A}
.cap.ok img{border-color:#2BD46A;box-shadow:0 0 0 6px #2BD46A,0 0 30px #7BF0A8}.cap.no img{filter:grayscale(.7);opacity:.6}
.chute{position:absolute;right:3%;top:22%;font-size:clamp(28px,4vh,40px);color:#fff;text-shadow:0 2px 0 #B0306A}
/* ══ 4・5 寫字 ══ */
.wrow{display:flex;align-items:center;justify-content:center;gap:clamp(12px,3vw,40px);width:100%}
.wleft{display:flex;flex-direction:column;align-items:center;gap:12px}.wrt{position:relative}
.ltr{display:flex;align-items:flex-end;justify-content:center;gap:clamp(10px,2vw,26px);flex-wrap:wrap}.ltf{display:flex;flex-direction:column;align-items:center;gap:4px}.ltf>span{font-size:clamp(20px,2.8vh,28px);font-weight:900;color:#C8FFD9}.ltf>span b{color:#FFE07A}.ltr .ar{align-self:center;font-size:clamp(34px,5vh,50px)}
.pad{position:relative;background:#FFFDF6;border-radius:22px;box-shadow:0 0 0 6px #5FAE3B,0 12px 0 rgba(0,0,0,.4);touch-action:none}
.pad canvas{display:block;border-radius:22px;touch-action:none}
.pad .lnlb{position:absolute;left:10px;font-size:clamp(18px,2.2vh,21px);color:#C62828;background:#fff;padding:0 6px;border-radius:6px;pointer-events:none}
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
.slot b{animation:fly .35s backwards}.n6w{font-size:clamp(54px,8.6vh,90px);font-weight:700;letter-spacing:.06em;color:#fff}.n6w .n6v{color:#FF6B6B}.slot b.n6v,.n6v{color:#D62828}.slot b.n6s,.n6s{color:#9AA4B2}.qb.n6v{color:#C1121F}@keyframes fly{from{transform:translateY(-120px) scale(.4)}}
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
/* ══ 8 舊 的 對戰 畫面（2026-10-25 換成 ⚔ 英文 對決 擂台，下面 .duel）══ */
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
.flow8{display:flex;align-items:center;justify-content:center;gap:clamp(6px,1vw,14px);width:min(980px,100%);margin:0 auto}
.f8c{display:flex;align-items:center;gap:8px;padding:6px 14px 6px 6px;border-radius:999px;background:rgba(255,255,255,.08);border:3px solid #5A6A8A;min-width:0;animation:f8in .5s both}
.f8foe{border-color:#FF6B6B;background:rgba(176,16,48,.28)}.f8you{border-color:#5EC8FF;background:rgba(30,110,200,.28)}.flow8 .f8c:last-child{animation-delay:.9s}
.f8p{position:relative;flex:none}.f8p img{width:clamp(44px,6vh,60px);height:clamp(44px,6vh,60px);border-radius:50%;object-fit:cover;object-position:50% 15%;border:3px solid #fff;display:block}
.f8p em{position:absolute;left:50%;bottom:-14px;transform:translateX(-50%);font-style:normal;font-size:18px;line-height:1.1;background:#000;border-radius:6px;padding:0 4px;white-space:nowrap;color:#FFD6D6}.f8p.me em{color:#CFEFFF}
.f8r{font-size:clamp(26px,3.8vh,38px);white-space:nowrap}.f8foe .f8r{color:#FFB0B0}.f8you .f8r{color:#9EDCFF}
.f8l{font-size:clamp(26px,3.8vh,36px);color:#fff;white-space:nowrap;animation:f8q 1s ease-in-out infinite alternate}
.f8q{font-size:clamp(26px,3.8vh,36px);color:#FFE07A;animation:f8q 1s ease-in-out infinite alternate;max-width:none}
.f8a{position:relative;flex:none;width:clamp(40px,6vw,80px);height:8px;border-radius:4px;background:repeating-linear-gradient(90deg,#FFE07A 0 10px,transparent 10px 16px)}.f8a:after{content:'';position:absolute;right:-12px;top:-8px;border:12px solid transparent;border-left:16px solid #FFE07A;border-right:0}
.f8a i{position:absolute;top:-6px;left:0;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 0 14px #FFE07A;animation:f8run 1.4s .5s ease-in-out infinite}
@keyframes f8in{0%{opacity:0;transform:scale(.6)}100%{opacity:1;transform:none}}@keyframes f8run{0%{left:0;opacity:0}15%{opacity:1}100%{left:calc(100% - 10px);opacity:0}}@keyframes f8q{to{transform:scale(1.18)}}
@media (prefers-reduced-motion:reduce){.f8c,.f8a i,.f8q{animation:none}}
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
/* ══ 2026-10-25 第二十五次：開場 3 2 1 GO、連對 🔥、彩帶 ══ */
#go{position:fixed;inset:0;z-index:90;display:none;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(20,30,70,.94),rgba(0,0,0,.96));text-align:center;padding:16px}#go.on{display:flex}
#go .gi{font-size:clamp(80px,15vh,150px);animation:gpop .6s both}#go .gn{font-size:clamp(36px,6vh,64px);color:var(--gold);text-shadow:0 4px 0 #6B4A00;animation:gpop .6s .15s both}
#go .gh{font-size:clamp(22px,3.2vh,32px);color:#DDE8F3;margin-top:8px;animation:gpop .6s .3s both}#go .g3{font-size:clamp(110px,22vh,220px);color:#fff;text-shadow:0 0 40px #3E8BFF;margin-top:10px;animation:gpop .5s both}
#go .g3.pp{animation:gpop .5s both}#go .g3.gogo{color:#FFE07A;text-shadow:0 0 50px #FFD54A;animation:ggo .6s both}
@keyframes gpop{from{transform:scale(.2);opacity:0}70%{transform:scale(1.15)}to{transform:none;opacity:1}}@keyframes ggo{from{transform:scale(.3) rotate(-12deg)}60%{transform:scale(1.35) rotate(4deg)}to{transform:scale(1)}}
.cmb{font-size:clamp(22px,3vh,30px);color:#FFB74A;opacity:0;transition:opacity .2s}.cmb.on{opacity:1;animation:cmbp .5s}.cmb.hot{color:#FF5A2A;text-shadow:0 0 14px #FF7A2A;animation:cmbp .5s,cmbf .8s .5s infinite alternate}
@keyframes cmbp{50%{transform:scale(1.4)}}@keyframes cmbf{to{transform:scale(1.12)}}
#cfz{position:fixed;inset:0;pointer-events:none;z-index:95;overflow:hidden}#cfz i{position:absolute;top:-20px;width:12px;height:18px;border-radius:3px;animation:cfz 3s linear forwards}@keyframes cfz{to{transform:translateY(110vh) rotate(720deg)}}
/* 1 打地鼠：被打到 ＝ 壓扁 ➜ 眼睛 ✖ ➜ 頭上 星星 轉圈 ➜ 沉下去；打錯 ＝ 吐舌頭 */
.hole .mth{position:absolute;top:56%;left:40%;width:20%;height:7%;border-radius:0 0 50% 50%;background:#5A2A10}
.hole.hit .mb{animation:whk 1.4s forwards}
@keyframes whk{0%{transform:translateY(0)}12%{transform:translateY(10%) scale(1.32,.52)}30%{transform:translateY(0) scale(.9,1.12)}45%{transform:translateY(2%) scale(1.04,.96) rotate(-7deg)}60%{transform:translateY(3%) rotate(7deg)}75%{transform:translateY(4%) rotate(-5deg)}100%{transform:translateY(55%) rotate(0)}}
.hole.hit .eye{background:none}.hole.hit .eye::before{content:'✖';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:#111;font-size:clamp(16px,2.6vh,28px);font-weight:900}
.hole.hit .mth{height:12%;border-radius:50%;background:#3A1A08}
.hole .dz{position:absolute;left:50%;top:4%;width:0;height:0;z-index:4;display:none}.hole.hit .dz{display:block}
.hole .dz i{position:absolute;font-style:normal;font-size:clamp(22px,3.6vh,36px);margin:-.6em 0 0 -.5em;animation:orb 1.1s linear infinite}.hole .dz i:nth-child(2){animation-delay:-.37s}.hole .dz i:nth-child(3){animation-delay:-.74s}
@keyframes orb{0%{transform:translate(-46px,0) scale(.8)}25%{transform:translate(0,-16px) scale(.65)}50%{transform:translate(46px,0) scale(.8)}75%{transform:translate(0,16px) scale(1.1)}100%{transform:translate(-46px,0) scale(.8)}}
.hole.miss .mth{height:16%;width:26%;left:37%;background:#3A0A0A;border-radius:0 0 60% 60%}.hole.miss .mth::after{content:'';position:absolute;left:30%;bottom:-40%;width:40%;height:70%;background:#FF6F91;border-radius:0 0 50% 50%}
.hole .hh{position:absolute;left:50%;top:-8%;transform:translateX(-50%) scale(0);background:#fff;color:#C62828;border:4px solid #C62828;border-radius:16px;padding:2px 12px;font-size:clamp(20px,3vh,30px);white-space:nowrap;z-index:5;transition:transform .25s}.hole.miss .hh{transform:translateX(-50%) scale(1)}
.hole.miss .mb{animation:laugh .25s 4 alternate}@keyframes laugh{to{transform:translateY(0) rotate(5deg)}}
.pow{position:absolute;z-index:7;pointer-events:none;transform:translate(-50%,-50%);width:clamp(120px,18vh,180px);height:clamp(120px,18vh,180px);display:flex;align-items:center;justify-content:center;
 background:#FFE07A;clip-path:polygon(50% 0,61% 32%,98% 22%,70% 50%,98% 78%,61% 68%,50% 100%,39% 68%,2% 78%,30% 50%,2% 22%,39% 32%);animation:pow .7s forwards}
.pow b{font-size:clamp(28px,4.6vh,46px);color:#C62828;font-weight:900;transform:rotate(-10deg)}@keyframes pow{0%{transform:translate(-50%,-50%) scale(.2) rotate(-20deg)}30%{transform:translate(-50%,-50%) scale(1.15)}80%{opacity:1}100%{transform:translate(-50%,-50%) scale(1) rotate(8deg);opacity:0}}
.lawn.quake{animation:quake .35s}@keyframes quake{25%{transform:translate(-6px,4px)}50%{transform:translate(6px,-3px)}75%{transform:translate(-3px,2px)}}
/* 2 小精靈（2026-10-26 第二十八次 第 5 點：照 老師 給 的 Wordwall「迷宮 追逐」影片 重做）
   先 看 整張 迷宮（3 張 圖 在 3 個 房間）➜ 3、2、1、GO ➜ 鏡頭 放大 2 倍 跟著 小精靈；右邊 ＝ 🔊、小 地圖、方向鍵 */
.pmrow{display:flex;align-items:stretch;justify-content:center;gap:clamp(10px,1.6vw,22px);width:100%}
.pmv{position:relative;flex:1 1 auto;min-width:0;height:calc(100vh - 235px);min-height:300px;border-radius:20px;background:#03051E;box-shadow:0 0 0 5px #1F2A8C,0 0 30px #3E5BFF66;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none}
.pmv canvas{position:absolute;left:0;top:0}
.pmside{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;flex:0 0 auto}
.pmside .hear{min-height:64px;padding:6px 18px;font-size:clamp(22px,3vh,30px)}
.mmap{display:block;border-radius:12px;background:#03051E;box-shadow:0 0 0 3px #3E5BFF;cursor:pointer;touch-action:none}
@media (orientation:portrait){.pmrow{flex-direction:column}.pmv{flex:0 0 auto;width:100%;height:calc(100vh - 560px)}.pmside{flex-direction:row;flex-wrap:wrap}}
.rmc{position:absolute;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2cqh;container-type:size;border-radius:14px;background:#FFFBEF;color:#111;box-shadow:0 0 0 4px #FFD23F,0 0 18px #FFD23F99;overflow:hidden;cursor:pointer}
.rmc .tag{width:92%;border-width:2px;border-radius:8px}.rmc .tag .tt{font-size:max(18px,12cqh);line-height:1.1;padding:1px 0;white-space:nowrap}.rmc .tag .tt b{display:inline;font-size:1em;margin-right:.25em}.rmc .tag .tn{font-size:max(18px,26cqh);line-height:1.1;padding:0}
.pmv.ov .rmc .tag .tt{display:none}   /* 看 整張 迷宮 的 時候 卡片 很小：只 留 名字 和 歲數 */
.rmc .cake{display:flex;align-items:center;gap:4px;font-size:max(18px,30cqh)}.rmc .cake .cn{position:static;transform:none;font-size:max(18px,.85em)}
.rmc .q2sc{font-size:max(20px,min(36cqh,17cqw))}.rmc .q2sc .fx{font-size:max(18px,.5em)}
.rmc.aim{box-shadow:0 0 0 6px #3EC5FF,0 0 26px #3EC5FF}.rmc.eat{animation:rmeat .6s forwards;z-index:7}@keyframes rmeat{40%{transform:scale(1.25)}100%{transform:scale(1.12)}}
.rmc.ok{box-shadow:0 0 0 7px #2BD46A,0 0 34px #2BD46A}.rmc.no{box-shadow:0 0 0 7px #FF5A5A,0 0 34px #FF5A5A}
.pmgo{position:absolute;inset:0;z-index:8;display:flex;align-items:center;justify-content:center;pointer-events:none;font-size:clamp(90px,18vh,190px);font-weight:900;color:#FFD23F;text-shadow:0 0 30px #FFB300,0 8px 0 #7A4A00}
.pmgo:empty{display:none}.pmgo.pp{animation:gpop .5s both}
.pmtip{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:6;background:rgba(3,5,30,.86);border:3px solid #FFD23F;border-radius:14px;padding:4px 16px;font-size:clamp(20px,2.8vh,28px);white-space:nowrap;pointer-events:none}
.pmtip:empty{display:none}
.q2how{position:fixed;inset:0;z-index:30;background:rgba(3,5,30,.92);display:flex;align-items:center;justify-content:center;padding:16px}
.q2hb{width:min(860px,100%);background:#0B1250;border:5px solid #FFD23F;border-radius:26px;padding:clamp(14px,2.4vh,28px);display:flex;flex-direction:column;gap:clamp(10px,1.8vh,18px)}
.q2hb h2{margin:0;text-align:center;font-size:clamp(32px,5vh,52px);color:#FFD23F}
.q2s{display:flex;align-items:center;gap:16px;font-size:clamp(24px,3.4vh,36px);font-weight:900;line-height:1.3}.q2s>span{flex:none;width:1.6em;height:1.6em;border-radius:50%;background:#FFD23F;color:#111;display:flex;align-items:center;justify-content:center}.q2s>b{flex:none;font-size:1.6em}.q2s small{font-size:.7em;color:#C8D2FF}.q2s u{color:#7BF0A8}
.q2s .tx{flex:1;min-width:0}.q2demo{position:relative;width:2.4em;height:1.4em;display:inline-block}.q2demo i{position:absolute;font-style:normal;font-size:.7em}.q2demo .dc{right:0;top:0}.q2demo .dp{left:0;bottom:0;animation:q2p 2.4s infinite}.q2demo .dh{right:-.1em;top:.6em;animation:q2h 2.4s infinite}
@keyframes q2p{0%,30%{transform:none}80%,100%{transform:translate(1.9em,-.6em)}}@keyframes q2h{0%{transform:translateY(.5em);opacity:0}15%,30%{transform:none;opacity:1}40%,100%{opacity:0}}
.q2go{align-self:center;min-height:76px;padding:0 44px;border:0;border-radius:999px;background:linear-gradient(#FFE07A,#FFB300);color:#111;font-size:clamp(28px,4vh,40px);font-weight:900;box-shadow:0 7px 0 #9A6A00;animation:hr 1.2s ease-in-out infinite}
.pac2{position:absolute;z-index:4;transition:none}.pac2 i{position:absolute;inset:0;border-radius:50%;background:#FFD23F;box-shadow:0 0 16px #FFD23F;animation:chomp .22s linear infinite alternate}
.pac2.dl i{transform:scaleX(-1)}.pac2.du i{transform:rotate(-90deg)}.pac2.dd i{transform:rotate(90deg)}.pac2.inv{animation:blink .2s infinite}.pac2.hurt i{animation:none;background:#FF5A5A}@keyframes blink{50%{opacity:.25}}
.pac2.gulp{animation:gulp .45s}@keyframes gulp{50%{transform:scale(1.5)}}
.gst{position:absolute;z-index:3;display:flex;align-items:center;justify-content:center;font-size:clamp(30px,5vh,52px);line-height:1;filter:drop-shadow(0 0 8px #B46BFF)}.gst.g2{filter:drop-shadow(0 0 8px #FF5A8A) hue-rotate(120deg)}
.pmt{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);z-index:6;background:rgba(0,0,0,.8);border:3px solid #FF5A8A;border-radius:16px;padding:6px 16px;font-size:clamp(22px,3vh,30px);white-space:nowrap;opacity:0;pointer-events:none}.pmt.on{animation:pmt 1.8s forwards}@keyframes pmt{10%,80%{opacity:1}100%{opacity:0}}
.dpad{display:grid;grid-template-columns:repeat(3,clamp(84px,12vh,124px));grid-template-rows:repeat(3,clamp(84px,12vh,124px));gap:6px;flex:0 0 auto;padding:8px;border-radius:50%;background:radial-gradient(circle,#26307A 0 40%,#151B46 70%);touch-action:none;user-select:none;-webkit-user-select:none}   /* 2026-10-30 第三十四次 第 5 點：方向鍵 放大＋整塊 都 可以 按、手指 滑 就 換 方向 */
.dpad button{border:0;border-radius:22px;background:linear-gradient(#3E5BFF,#1F2A8C);box-shadow:0 6px 0 #0B1250;font-size:clamp(40px,6.4vh,62px);touch-action:none}.dpad button.on{transform:translateY(4px);box-shadow:0 2px 0 #0B1250;background:#5D7BFF}
.dpad [data-d=u]{grid-column:2;grid-row:1}.dpad [data-d=l]{grid-column:1;grid-row:2}.dpad [data-d=r]{grid-column:3;grid-row:2}.dpad [data-d=d]{grid-column:2;grid-row:3}
/* 3 夾娃娃 */
.claw .hd3 .ey{position:absolute;left:50%;top:-30px;transform:translateX(-50%);font-size:28px;transition:transform .3s}.claw .hd3.lk .ey{transform:translateX(-62%) scaleX(-1)}.claw .hd3.rk .ey{transform:translateX(-38%)}
.claw .arm{animation:sw3 2s ease-in-out infinite}@keyframes sw3{50%{transform:rotate(3deg)}}.claw.dn .rope{transition:height .9s cubic-bezier(.3,1.4,.5,1)}.claw.dn .hd3{transition:top .9s cubic-bezier(.3,1.4,.5,1)}
.cap.aim img{box-shadow:0 0 0 6px #3EC5FF,0 0 24px #3EC5FF}.cap.wob{animation:wob .5s 2 alternate}@keyframes wob{to{rotate:6deg}}.cap.slip{animation:slip .8s ease-in}@keyframes slip{0%{transform:translateY(-40%) rotate(-10deg)}70%{transform:translateY(4%) rotate(8deg)}85%{transform:translateY(-6%)}100%{transform:none}}
.claw.shake .hd3{animation:shk .4s 2}.chute{display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.25);border:4px dashed #fff;border-radius:14px;padding:4px 8px;font-size:clamp(18px,2.4vh,22px)}.chute span{font-size:clamp(28px,4vh,40px)}
.coin3{position:absolute;right:4%;top:4%;font-size:clamp(26px,3.6vh,36px);color:#fff;animation:coin3 1.2s both}.coin3 b{color:#FFE07A}@keyframes coin3{0%{transform:translateY(-60px);opacity:0}40%{transform:none;opacity:1}80%{opacity:1}100%{opacity:0}}
.oops{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%) scale(0);z-index:8;background:#fff;color:#B0306A;border:5px solid #B0306A;border-radius:20px;padding:8px 20px;font-size:clamp(28px,4.4vh,44px);white-space:nowrap;transition:transform .3s}
.oops.on,.oops.win{transform:translate(-50%,-50%) scale(1)}.oops.win{color:#139447;border-color:#2BD46A;display:flex;align-items:center;gap:12px}.oops.win img{height:clamp(80px,14vh,140px);border-radius:12px;border:4px solid #2BD46A}
.ctl3{display:flex;gap:14px;justify-content:center}.ctl3 button{min-height:clamp(60px,8vh,80px);min-width:clamp(80px,11vh,110px);border:0;border-radius:18px;background:linear-gradient(#FF8FC0,#D03C7E);box-shadow:0 6px 0 #8A1E50;font-size:clamp(26px,4vh,40px)}
.ctl3 .gr3{background:linear-gradient(#FFD54A,#E0A800);color:#3A2A00;box-shadow:0 6px 0 #7A5A00;padding:0 26px}.ctl3 button:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(0,0,0,.4)}
/* 4 挖礦：3 塊 礦石 配 圖 */
.ores{display:flex;gap:clamp(8px,1.4vw,16px);justify-content:center}.ore{width:clamp(96px,14vh,140px);height:clamp(96px,14vh,140px);border:5px solid #555;border-radius:14px;background:repeating-linear-gradient(45deg,#8B8B8B 0 14px,#7A7A7A 14px 28px);box-shadow:0 7px 0 #3A3A3A;display:flex;align-items:center;justify-content:center}
.ore .oi{font-size:clamp(54px,8.6vh,86px);background:rgba(255,255,255,.75);border-radius:14px;padding:2px 6px}.ore.ok{border-color:#2BD46A;box-shadow:0 0 0 5px #2BD46A,0 0 26px #7BF0A8;animation:bump .4s}.ore.no{border-color:#FF5A5A;animation:shk .4s}
.ore.gone{animation:gone .5s forwards}@keyframes gone{to{transform:scale(0) rotate(30deg);opacity:0}}.ore.crack{animation:bump .3s}.ore.brk{animation:gone .5s forwards}
.pad.lk{opacity:.35;filter:grayscale(1)}.pad.lk::after{content:'先 點 對的 圖';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:clamp(26px,4vh,40px);color:#333}
.ask small{display:block;font-size:clamp(18px,2.4vh,24px);color:#FFE07A}
#fb .lnw{background:#7A1020;border-radius:12px;padding:4px 12px;color:#fff}#fb .lnw b{color:#FFE07A}#fb .lnh{font-size:clamp(20px,2.6vh,26px);color:#FFF4C2}#fb .lnh b{color:#FFB300}
#fb #mysk canvas{height:clamp(90px,13vh,130px)}
#fb .q9f .gw b{font-size:clamp(28px,4vh,44px)}#fb .q9f .gw i{font-size:clamp(18px,2.4vh,24px)}#fb .q9f .gls{margin:2px 0}
.mirror.magic{animation:mag 1s}@keyframes mag{50%{transform:rotateY(180deg) scale(1.1);box-shadow:0 0 0 5px #8A6400,0 0 80px #FFE07A}}
/* 6 金幣磚 */
.q6h{font-size:clamp(28px,4.6vh,46px);color:#0B1A33;background:#FFF7DE;border-radius:18px;padding:4px 16px;text-align:center;line-height:1.3}.q6h b{color:#C62828}.q6h small{display:block;font-size:clamp(18px,2.4vh,23px);color:#5A4A2A}.q6h .o1{font-size:1.2em}
.q6ex{font-size:clamp(19px,2.6vh,26px);color:#0B1A33;background:rgba(255,255,255,.75);border-radius:14px;padding:4px 12px;text-align:center}.q6ex b{color:#1452C4}
.objs span{position:relative;cursor:pointer}.objs span.cnt::after{content:attr(data-c);position:absolute;right:-6px;top:-6px;min-width:1.2em;height:1.2em;border-radius:50%;background:#E21B3C;color:#fff;font-size:clamp(18px,2.6vh,26px);display:flex;align-items:center;justify-content:center;line-height:1}
.qbw{position:relative;padding-bottom:clamp(54px,8vh,80px)}.hero6{position:absolute;bottom:0;left:50%;pointer-events:none;font-size:clamp(46px,7vh,70px);transform:translateX(-50%);transition:left .25s}.hero6.jp{animation:jp .35s}@keyframes jp{50%{transform:translate(-50%,-55%)}}
/* 7 皮克敏 */
.pk.cheer{animation:cheer .4s 3 alternate}@keyframes cheer{to{transform:translateY(-22px) rotate(-6deg)}}.pk.trip{animation:trip .6s forwards}@keyframes trip{to{transform:rotate(80deg) translateY(10px)}}
.pk .ow{position:absolute;top:-34px;left:50%;transform:translateX(-50%) scale(0);background:#fff;color:#C62828;border:3px solid #C62828;border-radius:12px;padding:0 10px;font-size:clamp(20px,2.8vh,28px);white-space:nowrap;transition:transform .2s}.pk.trip .ow{transform:translateX(-50%) scale(1) rotate(-80deg)}
.sent .gap{position:relative}.bloom{position:absolute;left:50%;top:50%;font-size:clamp(26px,4vh,40px);animation:bloom .9s forwards;pointer-events:none}@keyframes bloom{from{transform:translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(.2)}to{transform:translate(-50%,-50%) rotate(var(--a)) translateY(-70px) scale(1);opacity:0}}
/* 8 ⚔ 英文 對決 擂台 */
.duel{position:relative;width:min(1000px,100%);height:clamp(270px,40vh,390px);border-radius:26px;overflow:hidden;background:linear-gradient(#1A1030 0,#2A1A3A 55%,#3A2A2A 55%,#1A1212);box-shadow:0 10px 0 rgba(0,0,0,.45),inset 0 0 60px #000}
.duel .dbg i{position:absolute;bottom:45%;width:10px;height:60px;background:#5A4A3A}.duel .dbg i::after{content:'🔥';position:absolute;left:50%;top:-34px;transform:translateX(-50%);font-size:30px;animation:fl .4s infinite alternate}.duel .dbg i:nth-child(1){left:6%}.duel .dbg i:nth-child(2){right:6%}@keyframes fl{to{transform:translateX(-50%) scale(1.15)}}
.fig{position:absolute;bottom:6%;display:flex;flex-direction:column;align-items:center;gap:6px;transition:transform .25s}.fig.me{left:6%}.fig.dk{right:6%}
.fcard{width:clamp(110px,17vh,170px);aspect-ratio:3/4.2;border-radius:16px;overflow:hidden;border:4px solid #FFD54A;box-shadow:0 0 24px #FFD54A88;background:#000}.fcard img{width:100%;height:100%;object-fit:cover}
.dksv{width:clamp(120px,19vh,190px);height:auto;filter:drop-shadow(0 0 14px #B01030)}.dkey{animation:dkey 1.4s infinite alternate}@keyframes dkey{to{opacity:.45}}
.hpb{background:rgba(0,0,0,.65);border-radius:12px;padding:2px 10px;min-width:clamp(130px,19vh,190px);font-size:clamp(18px,2.4vh,23px);text-align:center}.hpb .bar{display:block;height:14px;border-radius:7px;background:#333;overflow:hidden;margin-top:3px}.hpb .bar i{display:block;height:100%;background:linear-gradient(90deg,#FF3B3B,#FFB300,#2BD46A);transition:width .5s}
.vs{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);font-size:clamp(44px,8vh,80px);color:#FFE07A;text-shadow:0 0 20px #FF7A2A;font-weight:900;animation:vs 1.2s ease-in-out infinite alternate}@keyframes vs{to{transform:translate(-50%,-50%) scale(1.15)}}
.bub8{position:absolute;left:24%;right:24%;top:4%;background:#fff;color:#111;border-radius:18px;padding:6px 14px;font-size:clamp(26px,4.2vh,40px);text-align:center;border:4px solid #B01030;line-height:1.25;z-index:3}
.bub8 small{display:block;font-size:clamp(18px,2.2vh,22px);color:#B01030}.bub8 button{border:0;background:#1452C4;border-radius:10px;font-size:22px;min-height:48px;min-width:52px;vertical-align:middle;margin-left:6px}
.fig.me.dash{animation:dash .55s}@keyframes dash{40%{transform:translateX(min(46vw,420px)) scale(1.1)}100%{transform:none}}.fig.dk.lunge{animation:lunge .55s}@keyframes lunge{40%{transform:translateX(max(-46vw,-420px)) scale(1.1)}100%{transform:none}}
.fig.hurt{animation:hurt8 .6s}@keyframes hurt8{20%,60%{filter:brightness(3) saturate(0);transform:translateX(8px)}40%,80%{filter:none;transform:translateX(-8px)}}.fig.dk.ko{animation:ko 1s forwards}@keyframes ko{to{transform:rotate(80deg) translateY(30%);opacity:.5}}
.slash{position:absolute;right:8%;bottom:20%;width:clamp(160px,26vh,260px);height:clamp(160px,26vh,260px);border-radius:50%;border-top:12px solid #9FE8FF;filter:drop-shadow(0 0 14px #3EC5FF);animation:slash .5s .15s both;z-index:5;pointer-events:none}
.slash.dark{left:8%;right:auto;border-top-color:#B01030;filter:drop-shadow(0 0 14px #FF3B3B)}@keyframes slash{from{transform:rotate(-120deg) scale(.4);opacity:1}to{transform:rotate(60deg) scale(1.1);opacity:0}}
.dmg{position:absolute;right:16%;top:30%;font-size:clamp(40px,7vh,70px);color:#FFE07A;text-shadow:0 0 16px #FF7A2A;font-weight:900;animation:dmg 1s .2s both;z-index:6}@keyframes dmg{from{transform:translateY(20px) scale(.4);opacity:0}30%{transform:scale(1.3);opacity:1}to{transform:translateY(-60px);opacity:0}}
.ko8{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:clamp(70px,14vh,140px);color:#FFE07A;text-shadow:0 0 30px #FF3B3B,0 6px 0 #7A1020;font-weight:900;animation:ggo .7s both;z-index:7}
.mv{background:linear-gradient(#3A2A5A,#1E1430)!important;border:3px solid #B46BFF!important;display:flex;align-items:center;justify-content:center;gap:10px}.mv .mi{font-size:1.1em}
#wp{position:fixed;inset:0;z-index:92;display:none;background:rgba(4,6,16,.96);overflow:auto;padding:14px}#wp.on{display:block}
.wpb{max-width:1200px;margin:0 auto;text-align:center}.wpb h2{font-size:clamp(32px,5vh,52px);color:var(--gold);margin:6px 0}
.wpt{display:flex;gap:12px;justify-content:center;margin:8px 0}.wpt button{min-height:60px;padding:4px 22px;border-radius:16px;border:3px solid #4A6A9A;background:#16243C;font-size:clamp(22px,3vh,30px)}.wpt button.on{background:#FFD54A;color:#2A1C00;border-color:#FFD54A}
.wpg{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}.wpg button{border:3px solid #2A3A5A;border-radius:14px;background:#0A0E1A;padding:4px;display:flex;flex-direction:column;align-items:center;gap:2px}.wpg button.on{border-color:#FFD54A;box-shadow:0 0 16px #FFD54A}
.wpg img{width:100%;aspect-ratio:3/4.2;object-fit:cover;border-radius:10px}.wpg span{color:#FFD54A;font-size:18px}
/* 9 證件 連連看（聽力） */
.q9h{display:flex;align-items:center;gap:14px;font-size:clamp(26px,3.8vh,38px)}.q9h b{color:var(--gold);font-size:1.3em}
.id b{font-size:1.25em;color:#0B2A44}.id.bad{box-shadow:0 0 0 6px #FF5A5A}#fb .q9f{border-radius:14px;padding:4px 8px}#fb .q9f.hot{background:rgba(255,224,122,.18);box-shadow:0 0 0 4px #FFE07A}
/* 10 空投 */
.plane{position:absolute;top:3%;left:-15%;font-size:clamp(50px,8vh,80px);animation:plane 1.6s linear forwards;z-index:2}@keyframes plane{to{left:110%}}
.loot2{position:absolute;left:50%;bottom:50%;font-size:clamp(40px,7vh,70px);animation:loot2 1s both}@keyframes loot2{from{transform:translate(-50%,0) scale(.3);opacity:0}50%{opacity:1}to{transform:translate(calc(-50% + var(--dx)),-120px) scale(1.1);opacity:0}}
.smk b{display:block;font-size:clamp(26px,4vh,40px);color:#fff;text-shadow:0 2px 0 #000}
/* 直的 iPad、手機 */
@media (orientation:portrait){.holes{grid-template-columns:repeat(2,1fr);grid-template-rows:1fr 1fr}.lawn{height:clamp(380px,52vh,620px)}.caps{grid-template-columns:repeat(2,1fr)}.claw{height:clamp(440px,58vh,700px)}
 .wrow{flex-direction:column}.wleft{flex-direction:row;flex-wrap:wrap;justify-content:center}.mc{width:120px;height:120px;margin:10px 24px}.mc .fc{font-size:56px}.mc .f1,.mc .f2,.mc .f3{--h:60px}
 .mirror{width:170px;height:220px}.wbtn button{white-space:nowrap}}
@media (orientation:portrait){.mc .f1{transform:translateZ(60px)}.mc .f2{transform:rotateY(90deg) translateZ(60px)}.mc .f3{transform:rotateX(90deg) translateZ(60px)}}
@media (orientation:portrait){.dpad{grid-template-columns:repeat(3,88px);grid-template-rows:repeat(3,88px)}}
@media (max-width:760px){.moves{grid-template-columns:1fr}.bub{left:4%;right:4%;top:auto;bottom:4%}.bub::after{display:none}}
.wbtn button{white-space:nowrap}
/* 第二十七次：記成績 的 那一行 */
body.ing #scbar{display:none!important}
.rcn{font-size:clamp(20px,2.6vh,26px);color:#BFD3E6;text-align:center;margin:4px 0}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01s!important;animation-iteration-count:1!important}}

/* 2026-10-26 第 1-3 點：真的 夾娃娃機 */
.claw{padding:10px 14px 14px;height:clamp(360px,54vh,540px);display:flex;flex-direction:column;gap:8px}.claw .glass{flex:1;height:auto}
.claw .mq{display:flex;align-items:center;justify-content:center;gap:10px;background:#3A0B24;border-radius:14px;padding:4px 10px;box-shadow:inset 0 0 0 3px #FFD23F}.claw .mq b{font-size:clamp(22px,3.4vh,34px);letter-spacing:.08em;color:#FFE07A;text-shadow:0 0 10px #FF6FAE;white-space:nowrap}
.claw .mq .mqb{display:flex;gap:6px;overflow:hidden;flex:1;justify-content:center}.claw .mq .mqb i{flex:none;width:10px;height:10px;border-radius:50%;background:#FFE07A;box-shadow:0 0 8px #FFE07A;animation:bulb .8s steps(1) infinite}@keyframes bulb{50%{background:#FF6FAE;box-shadow:0 0 8px #FF6FAE}}
.claw .caps{right:19%}
.claw .hole{position:absolute;right:2.5%;top:18%;width:14%;height:15%;border-radius:12px;background:rgba(40,0,20,.55);border:4px solid #FFE07A;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#FFE07A;z-index:3}.claw .hole b{font-size:clamp(18px,2.4vh,24px);letter-spacing:.06em}.claw .hole span{font-size:clamp(20px,3vh,30px);animation:hr 1s ease-in-out infinite}
.claw .tube{position:absolute;right:6.5%;width:6%;top:33%;bottom:17%;border-radius:0 0 10px 10px;background:linear-gradient(90deg,rgba(255,255,255,.55),rgba(255,255,255,.12) 40%,rgba(255,255,255,.45));border:3px solid rgba(255,255,255,.8);border-top:0;overflow:hidden}
.claw .tube i{position:absolute;left:10%;right:10%;height:30%;top:-35%;border-radius:50%;background:radial-gradient(#FFF,#FFE07A 50%,transparent 70%)}.claw.drop .tube i{animation:tubei .7s ease-in forwards}@keyframes tubei{to{top:110%}}
.claw .door{position:absolute;right:2%;bottom:3%;width:15%;height:14%;border-radius:12px;background:#2A0A1A;border:4px solid #C9C9C9;display:flex;align-items:flex-end;justify-content:center;perspective:300px;overflow:visible}
.claw .door span{display:flex;align-items:center;justify-content:center;width:100%;height:70%;background:linear-gradient(#E8E8E8,#9A9A9A);color:#B0306A;font-weight:900;font-size:clamp(18px,2.4vh,24px);border-radius:6px;transform-origin:bottom;transition:transform .35s}.claw.open .door span{transform:rotateX(-75deg)}
.claw .coin3{right:auto;left:3%;top:20px;font-size:clamp(18px,2.6vh,26px);background:rgba(58,11,36,.75);border-radius:12px;padding:2px 10px}
.claw .oops{font-weight:900}
.duel .fcard.foe{border-color:#7A3AB8;box-shadow:0 0 26px #B46BFF}.duel .fcard.foe img{object-position:50% 0}
.rnd8{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);z-index:5;background:#3A1A5A;border:3px solid #FFD23F;border-radius:999px;padding:2px 16px;font-size:clamp(18px,2.4vh,24px);font-weight:900;color:#FFE07A;letter-spacing:.06em}
.nw8{position:absolute;inset:0;z-index:9;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(20,0,30,.82);animation:nw8 1.6s forwards;pointer-events:none}.nw8 b{font-size:clamp(34px,6vh,64px);color:#FF5AD8;text-shadow:0 0 20px #B46BFF}.nw8 span{font-size:clamp(26px,4vh,40px);color:#fff}@keyframes nw8{0%{opacity:0;transform:scale(1.4)}15%,75%{opacity:1;transform:none}100%{opacity:0}}
.rtry{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);z-index:9;background:#FFF3C4;color:#7A3A00;border:5px solid #FF9800;border-radius:20px;padding:12px 26px;font-size:clamp(28px,4.4vh,44px);font-weight:900;text-align:center;line-height:1.3;animation:rtry .3s cubic-bezier(.3,1.6,.5,1)}.rtry small{display:block;font-size:.55em}@keyframes rtry{from{transform:translate(-50%,-50%) scale(.3)}}.claw.shake .hd3 .ey{font-size:34px}
.ctl3 button{padding:0 18px;font-weight:900;font-size:clamp(22px,3.2vh,32px)}
.przz{position:fixed;inset:0;z-index:40;pointer-events:none;background:rgba(0,0,0,.35);animation:przf .3s}@keyframes przf{from{opacity:0}}
.prz{position:fixed;width:clamp(80px,12vh,120px);height:clamp(80px,12vh,120px);transform:translate(-50%,-50%) scale(.4);transition:left .8s cubic-bezier(.3,1.3,.5,1),top .8s cubic-bezier(.3,1.3,.5,1),transform .8s}
.prz.fly{left:50%!important;top:46%!important;transform:translate(-50%,-50%) scale(1.6) rotate(720deg)}
.prz .ph1,.prz .ph2{position:absolute;left:0;right:0;height:50%;transition:transform .5s}.prz .ph1{top:0;border-radius:999px 999px 0 0;background:linear-gradient(#FF8FC0,#E0408A)}.prz .ph2{bottom:0;border-radius:0 0 999px 999px;background:linear-gradient(#FFF,#DDD)}
.prz.pop .ph1{transform:translateY(-140%) rotate(-30deg)}.prz.pop .ph2{transform:translateY(140%) rotate(20deg)}
.prz .pin{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(0);display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform .45s cubic-bezier(.3,1.6,.5,1)}.prz.pop .pin{transform:translate(-50%,-50%) scale(1)}
.prz .pin img{width:clamp(110px,16vh,170px);border-radius:12px;border:4px solid #2BD46A;box-shadow:0 0 30px #7BF0A8}.prz .pin b{font-size:clamp(20px,3vh,30px);color:#FFE07A;text-shadow:0 2px 0 #B0306A;white-space:nowrap}

/* 2026-10-26 第 1-6 點：📋 資料表 小幫手 */
.bb9{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(8px,1.4vw,16px);width:min(1100px,100%)}
.bub9{position:relative;display:flex;align-items:flex-start;gap:6px;background:#fff;color:#111;border-radius:18px;padding:8px 10px;box-shadow:0 5px 0 rgba(0,0,0,.3);transition:transform .2s,box-shadow .2s}.bub9.hl{transform:scale(1.04);box-shadow:0 0 0 6px #2BD46A,0 0 24px #7BF0A8}
.av9{font-size:clamp(34px,5vh,50px);line-height:1}.tx9{flex:1;font-size:clamp(20px,2.7vh,27px);line-height:1.3;font-weight:700}.sp9{flex:none;min-width:52px;min-height:52px;border:0;border-radius:14px;background:#2F7BFF;font-size:24px}
.fm9{position:relative;width:min(640px,100%);background:#C67A2A;border-radius:22px;padding:30px 16px 14px;box-shadow:0 8px 0 #7A4610}
.clip9{position:absolute;left:50%;top:-16px;transform:translateX(-50%);width:120px;height:34px;border-radius:10px;background:linear-gradient(#EEE,#AAA);border:3px solid #777}
.ft9{background:#fff;border-radius:12px 12px 0 0;text-align:center;font-weight:900;color:#1E88E5;font-size:clamp(24px,3.4vh,34px);padding:4px}
.fm9 table{width:100%;border-collapse:collapse;background:#fff;color:#111;font-size:clamp(24px,3.4vh,34px)}.fm9 th{background:#F8C8DC;padding:4px}.fm9 th:last-child{background:#D7EBC3}.fm9 td{border:2px solid #888;text-align:center;padding:3px;height:clamp(48px,6.6vh,70px)}.fm9 td.n9{width:2em;color:#1E88E5;font-weight:900}.fm9 td.g9v{font-weight:700}
.sl9{display:inline-flex;align-items:center;justify-content:center;min-width:3.6em;min-height:1.6em;border:3px dashed #1E88E5;border-radius:10px;background:#EAF4FF;font-weight:900}.sl9.ok{border:3px solid #2BD46A;background:#DFFBE9;color:#0A6B33}.sl9.no{border:3px solid #FF5A5A;background:#FFE3E3;color:#B00020}
.tl9{display:flex;gap:clamp(10px,1.6vw,18px);justify-content:center;flex-wrap:wrap}.tile9{min-width:88px;min-height:64px;padding:0 18px;border-radius:16px;background:linear-gradient(#FFE07A,#FFB300);color:#3A2A00;font-size:clamp(26px,3.8vh,38px);font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 0 #9A6A00;touch-action:none;user-select:none;cursor:grab}
.tw9{display:flex;flex-direction:column;align-items:center;gap:2px;background:rgba(255,224,122,.12);border:3px solid rgba(255,224,122,.55);border-radius:20px;padding:6px 14px 4px;width:min(860px,100%)}.tdn9{font-size:clamp(20px,2.6vh,26px);color:#FFE07A;font-weight:700}
.sl9.sel{box-shadow:0 0 0 6px #3EC5FF;background:#D9F2FF}.sl9.k9want{border:3px solid #FF6B6B;background:#FFF1F1;color:#B00020}
.k9{border-radius:9px;padding:0 4px;box-shadow:0 0 0 3px var(--k),0 0 9px var(--k);transition:box-shadow .5s,transform .5s}.k9on .k9{animation:k9in .6s ease-out both}@keyframes k9in{from{box-shadow:0 0 0 0 transparent}}
.k9.k9go{transform:scale(1.12);box-shadow:0 0 0 4px var(--k),0 0 16px var(--k)}.k9.k9ans{background:rgba(255,107,107,.18)}
.ar9{position:fixed;inset:0;pointer-events:none;z-index:30}.ar9 path:first-of-type{}.ar9 svg>path{stroke-dasharray:1400;stroke-dashoffset:1400;animation:ar9 1s ease-out forwards;filter:drop-shadow(0 0 5px rgba(255,107,107,.7))}@keyframes ar9{to{stroke-dashoffset:0}}
.fm9k table{max-width:520px;margin:0 auto}.fm9k .sl9{min-width:3em}.k9g{display:inline-block;padding:0 6px}
.ob9{display:flex;gap:clamp(12px,2vw,22px);justify-content:center;flex-wrap:wrap;margin-top:clamp(8px,1.6vh,16px)}
.o9{min-width:clamp(110px,13vw,170px);min-height:clamp(64px,8.4vh,84px);padding:0 22px;border-radius:18px;border:4px solid #C9A227;background:linear-gradient(#FFE07A,#FFB300);color:#3A2A00;font-size:clamp(30px,4.4vh,44px);box-shadow:0 6px 0 #9A6A00}
.o9.ok{background:linear-gradient(#7BF0A8,#2BD46A);border-color:#BFFFD0}.o9.no{background:linear-gradient(#FF9A9A,#FF5A5A);border-color:#FFC2C2;animation:dcsh .45s}
#wb9{position:fixed;inset:0;z-index:96;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 30%,#0E5C8A,#04121F 72%);padding:12px}#wb9.on{display:flex}
.wbw{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.4vh,14px);text-align:center;max-width:100%}
.wbh{font-size:clamp(30px,4.6vh,48px);color:#FFE07A}
.wbp{position:relative;animation:wbin .9s cubic-bezier(.3,1.5,.5,1) both}.wbp img{display:block;height:clamp(220px,46vh,520px);max-width:92vw;object-fit:contain;border-radius:14px;box-shadow:0 0 0 6px #fff,0 18px 40px rgba(0,0,0,.6)}
.wbt{position:absolute;top:-14px;right:-14px;background:#FF5A5A;color:#fff;font-size:clamp(20px,2.8vh,28px);padding:4px 14px;border-radius:999px;transform:rotate(6deg);box-shadow:0 4px 0 #A01818;animation:wbtg 1.2s .9s ease-in-out infinite alternate}
@keyframes wbin{0%{opacity:0;transform:translateY(60px) rotate(-8deg) scale(.6)}100%{opacity:1;transform:none}}@keyframes wbtg{to{transform:rotate(-4deg) scale(1.08)}}
.wbs{font-size:clamp(28px,4.4vh,46px);color:#fff;display:flex;flex-wrap:wrap;justify-content:center;gap:0 .3em}.wbs span{opacity:0;animation:wbw .45s both}.wbs b{color:#FFE07A}
@keyframes wbw{0%{opacity:0;transform:translateY(16px) scale(.8)}100%{opacity:1;transform:none}}
.wbk{display:flex;gap:18px;flex-wrap:wrap;justify-content:center;opacity:0;animation:wbw .5s 2.8s both}.wbk span{font-size:clamp(22px,3vh,30px);background:#fff;color:#0B2A44;border-radius:14px;padding:4px 16px;box-shadow:0 4px 0 #7A4610}.wbk b{color:#C2185B}
.wbb{min-height:72px}.wbgo{min-height:72px;padding:0 44px;border-radius:20px;border:4px solid #7BF0A8;background:linear-gradient(#36D27A,#1E9E55);color:#06210F;font-size:clamp(26px,3.6vh,36px);animation:wbw .4s both}
@media (prefers-reduced-motion:reduce){.wbp,.wbt,.wbs span,.wbk,.wbgo{animation:none;opacity:1}}

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
@keyframes hmgo{to{transform:scale(1.05)}}@media (prefers-reduced-motion:reduce){.hmb button{animation:none}}
.tile9.sel{box-shadow:0 0 0 6px #3EC5FF,0 6px 0 #9A6A00}.tile9.drag{z-index:20;position:relative}.tile9.used{visibility:hidden}
.fb9{display:flex;flex-direction:column;gap:6px}
@media (orientation:portrait){.bb9{grid-template-columns:1fr}}
#crw{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(6,10,24,.94)}#crw.on{display:flex}.crb{text-align:center;display:flex;flex-direction:column;align-items:center;gap:14px;padding:20px}.cri{font-size:clamp(70px,12vh,120px)}.crt{font-size:clamp(30px,5vh,52px);font-weight:900;line-height:1.35}.crt small{font-size:.6em;color:#B8C4D2;font-weight:700}.crbk{display:inline-flex;align-items:center;min-height:64px;padding:0 30px;border-radius:999px;background:linear-gradient(#FFE07A,#E0A800);color:#3A2A00;font-size:clamp(22px,3vh,30px);font-weight:900;text-decoration:none}
body.crm #lobby .home{display:none}
`;

const BODY = `
<div class="scr" id="lobby">
 <div class="top"><h1>📝 三年級 複習</h1><span class="sub">期中考 範圍 · 10 種 限時 遊戲</span><a class="home" href="../index.html">🏠 首頁</a></div>
 <div class="xrow" id="xrow"></div>
 <div class="grid" id="grid"></div>
 <div class="rule">一回 8 題 · 每題 15 秒（寫字 20 秒）· 答對 而且 愈快 ＝ 分數 愈高</div>
</div>
<div class="scr" id="game" hidden>
 <div class="hud"><span class="nm" id="gnm"></span><span id="duot"></span><span class="dots" id="dots"></span><span class="cmb" id="cmb"></span><span class="sc" id="sc">0</span><button class="qx" id="wsw" hidden>🔄 換 戰士</button><button class="qx" id="qx">⬅ 大廳</button></div>
 <div class="tmw"><div class="tm"><i id="tmb"></i></div><span class="tsec" id="tsec">15</span></div>
 <div class="how" id="how"></div>
 <div class="stage" id="stage"></div>
</div>
<div class="scr" id="endv" hidden><div class="end" id="end"></div></div>
<div id="gain"></div>
<div id="fb"><div class="box" id="fbx"></div></div>
<div id="go"></div><div id="wb9"></div><div id="duob"></div><div id="dcl"></div><div id="wp"></div><div id="cfz"></div><div id="crw"></div><div id="xq"><div class="xqb"><div class="xqi">🛑</div><div class="xqh">真的 要 離開 嗎？</div><div class="xqt" id="xqt"></div><div class="xqbtn"><button id="xstay">▶ 繼續 作答</button><button id="xleave">🚪 先 離開</button></div></div></div>`;

const JS = `
${DECX.JS}
var LES=${J(D.LES)},DTUT=${J(D.DTUT)},DCG={id:'dc',ic:'🔓',nm:'句子 解碼 任務',how:'👇 把 中文 方塊 拖到 英文 字 的 正下方（也 可以 先 點 方塊、再 點 格子）· 放對 幾個 ＝ 拿 幾成 分數',t:45,B:[],c1:'#5A2A8C',c2:'#E0A030'};DEC.SIL=${J(D.SIL)};
var CB=${J(D.CB)},CSETS=${J(D.CSETS)},XB=${J(D.XB)},XALL=${J(D.XORD)}.map(function(x){return XB[x[0]][x[1]]}),LVS=null,XB2=${J(D.XB2)},XALL2=${J(D.XORD2)}.map(function(x){return XB2[x[0]][x[1]]}),XBK='A',   /* 2026-10-29 第 3 件：題庫 B ＝ 新 25／新 50（XBK ＝ 'B'）；存 進度、做過 的、最高分、成績 代號 都 分開 */
XA=function(){return XBK==='B'?XALL2:XALL},XBX=function(){return XBK==='B'?XB2:XB},XS=function(){return XBK==='B'?'n':XBK==='H'?'h':''},XNM=function(n){return XBK==='H'?n+' 題 闖關':(XBK==='B'?'新 ':'')+n+' 題 挑戰'},GM=${J(GM)}, WAR=${J(WAR)}, WARALL=${J(WARALL)}, GL=${J(D.GL)}, PHM=${J(D.PHM)}, CE=${J(D.CE)}, SC=${J(D.SC)}, BOYS=${J(D.BOYS)}, NUMW=${J(D.NUMW)};
${HW.js}
function $(s){return document.querySelector(s)}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
/* ── 聲音：先用預錄的語音檔（慢一點的美式發音），沒有才用瀏覽器語音 ── */
function akey(s){return String(s).replace(/[’]/g,"'").replace(/[=＝≠➜→⇒…＿_　]+/g,' ').replace(/\\s+/g,' ').trim().toLowerCase()}
var AU=null,ST=null,SID=0,PD=null;
/* 2026-10-26 第二十六次 第 1-7 點（老師：答錯頁 正在 唸 的 時候 點〔再聽〕就 當機）：原因 ＝ 新的 唸 把 舊的 停掉，舊的「唸完 以後 要做 的 事」（數 第幾次、出現〔▶ 下一題〕、倒數 繼續）就 不見 了。
   現在 ＝ 被 打斷 的 那一件 事 交給 新的 唸，唸完 一樣 會 做（PD）；換題、回大廳 才 真的 丟掉 */
function stopSay(){if(typeof decStop==='function')decStop();PD=null;SID++;clearTimeout(ST);if(AU){try{AU.pause()}catch(e){}AU=null}try{speechSynthesis.cancel()}catch(e){}}
function aud(t,v){if(v==='M1'||v==='M2'){var X=window[v==='M1'?'ENAUDM':'ENAUDS']||{},y=X[akey(t)];if(y)return 'audio/'+(v==='M1'?'m1/':'m2/')+y[0]}var k=akey(t),A=window.ENAUD||{},W=window.ENAUDW||{},f=A[(v==='m'?'m:':'')+k]||A[k];if(f)return 'audio/'+f[0];f=W[k];return f?'audio/w/'+f[0]:''}
function say1(t,v,done){var my=SID,f=aud(t,v),fin=function(){if(my===SID&&done)done()};
 if(f){AU=new Audio(f);AU.onended=fin;AU.onerror=function(){tts(t,fin)};var p=AU.play();if(p&&p.catch)p.catch(function(){tts(t,fin)});return}
 tts(t,fin)}
function tts(t,fin){try{var u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.8;u.onend=fin;u.onerror=fin;speechSynthesis.speak(u)}catch(e){setTimeout(fin,800)}}
function sayList(L,done){var pv=PD;stopSay();var cb=pv||done?function(){if(pv)pv();if(done)done()}:null;PD=cb;var i=0,my=SID;(function nx(){if(my!==SID)return;if(i>=L.length){PD=null;if(cb)cb();return}var x=L[i++];say1(x[1],x[0],function(){ST=setTimeout(nx,450)})})()}
function sayT(t,done){var v=/^(Hi|Hello), I'm (\\w+)/.exec(t);sayList([[v&&BOYS.indexOf(v[2])>=0?'m':'',t]],done)}
/* ── 狀態 ── */
var G=null,R=null,TM={t0:0,used:0,run:false,T:15,raf:0},BUSY=false;
function lobby(){if(CR&&CR.cfg&&CR.cfg.m==='sync')return;decClose();$('#xq').classList.remove('on');if(R&&!R.sent&&R.Q&&R.Q.length&&!(R.x&&!R.crs))rec1();   /* 25／50 題 中途 離開 ＝ 存 進度（xSave），做完 才 送 */
 /* 2026-10-26 第二十八次 第 1、2 點：大廳 最上面〔📝 25 題〕〔📝 50 題〕（10 關 連著 玩）*/
 var xk0=XBK;$('#xrow').innerHTML=[[25,'A'],[50,'A'],[25,'B'],[50,'B']].map(function(a){XBK=a[1];var n=a[0],bk=' data-bk="'+a[1]+'"',b=ls('g3m_bx'+XS()+n),v=xLoad(n),nm=XNM(n);if(v)return '<div class="xbw"><button class="xb xr" data-xr="'+n+'"'+bk+'><b>▶ 繼續 '+nm+'</b><small>已經 做到 第 '+v.Q.length+' ／ '+n+' 題 · 從 第 '+(v.Q.length+1)+' 題 接著 做</small></button><button class="xb2" data-x="'+n+'"'+bk+'>🔄 重新 開始</button></div>';
   return '<button class="xb" data-x="'+n+'"'+bk+'><b>📝 '+nm+'</b><small>11 關 連著 玩 · 每題 '+(100/n)+' 分 · 滿分 100</small>'+(b?'<span class="best">🏆 最高 '+b+' 分</span>':'')+'</button>'}).join('');XBK=xk0;document.body.classList.remove('ing');QID++;stopSay();cancelAnimationFrame(TM.raf);TM.run=false;$('#stage').innerHTML='';$('#go').classList.remove('on');$('#wp').classList.remove('on');$('#game').hidden=true;$('#endv').hidden=true;$('#lobby').hidden=false;$('#fb').classList.remove('on');
 $('#grid').innerHTML=GM.map(function(g,i){var b=ls('g3m_best_'+g.id);return '<button class="gc" data-g="'+i+'" style="--c1:'+g.c1+';--c2:'+g.c2+'"><span class="bd">'+g.ic+'</span><span><b>'+(i+1)+'　'+g.nm+'</b><small>'+g.how+'</small>'+(b?'<span class="best">🏆 最高 '+b+' 分</span>':'')+'</span></button>'}).join('');
 window.scrollTo(0,0)}
function start(i){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();start(i)});return}
 document.body.classList.add('ing');   /* 玩 的 時候 登入 那一條 收起來（畫面 不 被 往下 推）*/
 FHP=4;G=GM[i];var qs=shuf(G.B).slice(0,8);R={i:i,qs:qs,k:-1,score:0,streak:0,res:[],wrong:[],Q:[],t0:Date.now()};
 $('#lobby').hidden=true;$('#endv').hidden=true;$('#game').hidden=false;$('#gnm').textContent=G.ic+' '+G.nm;$('#how').textContent=G.how;$('#sc').textContent='0';$('#cmb').className='cmb';$('#cmb').textContent='';$('#stage').innerHTML='';
 $('#wsw').hidden=G.id!=='q8';$('#tmb').style.transform='scaleX(1)';$('#tsec').textContent=G.t;var go=function(){goSplash(next)};if(G.id==='q8'&&!ls('g3m_war')&&!rpHero())warPick(go);else go()}
/* ══ 2026-10-29 第三十三次 第 4 件：👥 兩人 一台（老師 1-8）：兩個 人 各 打 自己 的 5 碼＋密碼 ➜ 一人 一題 輪流、題目 不一樣 ➜ 成績、錯題 各 記 各 的 ══
   DUO ＝ {R:[甲 的 R, 乙 的 R], id:[甲, 乙], cur ＝ 現在 輪到 誰, done}；換人 ＝ R、SCID 一起 換（成績、做過 的 題目 都 跟著 人 走）；兩人 一台 不 存 中途 進度 */
var DUO=null,DUOM=0,XQUIET=0;
function duoRow(){return '<div class="duo"><span>這台 平板：</span><button data-duo="0" class="'+(DUOM?'':'on')+'">🙋 一個人</button><button data-duo="1" class="'+(DUOM?'on':'')+'">👥 兩個人 輪流</button></div>'}
function duoNm(id){id=String(id||'');return id.slice(0,3)+' 班 '+(+id.slice(3))+' 號'}
function duoStart(N){var go=function(){var A=SCID;$('#duob').innerHTML='<b>👥 第 2 個 人</b>請 登入（打 自己 的 5 碼＋密碼）';$('#duob').classList.add('on');
   setTimeout(function(){$('#duob').classList.remove('on');scLogin(function(){SCH.close();var B=SCID;SCID=A;scPut('id_g3',A);scPut('last',A);scBar();
     if(!B||B===A){$('#duob').innerHTML='<b>⚠️ 兩個 人 要 不一樣</b>第 2 個 人 請 打 自己 的 號碼';$('#duob').classList.add('on');setTimeout(function(){$('#duob').classList.remove('on')},2200);return}
     XQUIET=1;startX(N);var RA=R;SCID=B;startX(N);var RB=R;XQUIET=0;SCID=A;R=RA;DUO={R:[RA,RB],id:[A,B],cur:0,done:[0,0],st:0};
     document.body.classList.add('ing','duoon');$('#lobby').hidden=true;$('#endv').hidden=true;$('#game').hidden=false;$('#sc').textContent='0';$('#cmb').className='cmb';$('#stage').innerHTML='';duoTag();duoShow(next)})},1500)};
 if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();go()});return}go()}
function duoTag(){var t=$('#duot');if(t)t.innerHTML='<span class="'+(DUO.cur?'p2':'p1')+'">👤 '+duoNm(DUO.id[DUO.cur])+'</span>'}
function duoShow(done){var b=$('#duob');b.innerHTML='<b class="'+(DUO.cur?'p2':'p1')+'">👉 輪到</b>'+duoNm(DUO.id[DUO.cur]);b.classList.add('on');setTimeout(function(){b.classList.remove('on');done()},window.__NOGO?50:1300)}
/* 答完 一題 ➜ 換 另一個 人（另一個 人 做完 了 就 不 換）*/
function duoSw(){if(!DUO.st){DUO.st=1;return false}var o=1-DUO.cur;if(DUO.done[o]||DUO.sw){DUO.sw=0;return false}
 R.hp8=HP8;R.fhp=FHP;DUO.cur=o;R=DUO.R[o];SCID=DUO.id[o];HP8=R.hp8||HP8;FHP=R.fhp||FHP;var nk=R.k+1;if(nk<R.qs.length&&R.lvOf[nk]===R.lv){G=(LVS||GM)[R.lv];hudX()}
 $('#sc').textContent=R.score;$('#cmb').className='cmb';duoTag();DUO.sw=1;duoShow(next);return true}
/* 一個 人 做完 ＝ 先 記 他 的 成績（自己 的 號碼）；兩個 人 都 做完 ＝ 兩個 人 的 分數 一起 看 */
function duoEnd1(){var c=DUO.cur;DUO.done[c]=1;DUO.rc=DUO.rc||[];DUO.rc[c]=rec1();var o=1-c;
 if(!DUO.done[o]){R.hp8=HP8;R.fhp=FHP;DUO.cur=o;R=DUO.R[o];SCID=DUO.id[o];HP8=R.hp8||HP8;FHP=R.fhp||FHP;var nk=R.k+1;if(nk<R.qs.length&&R.lvOf[nk]===R.lv){G=(LVS||GM)[R.lv];hudX()}$('#sc').textContent=R.score;duoTag();DUO.sw=1;duoShow(next);return}
 stopSay();cancelAnimationFrame(TM.raf);var D=DUO;DUO=null;SCID=D.id[0];document.body.classList.remove('duoon');$('#game').hidden=true;$('#endv').hidden=false;
 $('#end').innerHTML='<div class="big xsc">👥 兩個人 輪流：📝 '+XNM(D.R[0].x)+'</div><div class="duoe">'+[0,1].map(function(k){var r=D.R[k],ok=r.res.filter(function(x){return x===1}).length;
   return '<div class="'+(k?'p2':'p1')+'"><b>👤 '+duoNm(D.id[k])+'</b><span class="big">'+Math.min(100,Math.round(r.score*10)/10)+' 分 ／ 100</span><span>答對 '+ok+' ／ '+r.x+'</span><small>'+(D.rc[k]?'📝 記進 成績 了':'⚠️ 沒有 記 成績')+'</small></div>'}).join('')+'</div>'+
  '<div class="btns"><button class="b2" id="tolob">🎮 回 大廳</button></div>';window.scrollTo(0,0);confetti()}
/* 開場：遊戲 圖示＋名字＋怎麼玩 ➜ 3、2、1、GO!（2026-10-25 第二十五次：比較 刺激；window.__NOGO ＝ 量測 跳過）*/
/* 2026-10-30 第三十四次 第 6 點（老師：資料表 小幫手 一開始 獨立 頁「這一關 的 題目 是 根據 習作 21 頁 改編」＋習作 21 頁 截圖）：
   每一次 進 這一關（大廳 玩、25／50 題 第 N 關、現場任務）都 先 這一頁；倒數 還 沒 開始；圖 飛進來 ➜ 字 一個 詞 一個 詞 亮 ➜ 2.6 秒 才 有〔▶ 開始〕。window.__NOWB ＝ 量測 跳過 */
function wb9(done){if(window.__NOWB){done();return}var o=$('#wb9'),my=R;o.innerHTML='<div class="wbw"><div class="wbh">📋 資料表 小幫手</div><div class="wbp"><img src="img/workbook_p21.webp" alt="習作 21 頁"><span class="wbt">📖 習作 第 21 頁</span></div>'+
  '<div class="wbs">'+['這一關','的','題目','是','根據','<b>習作 21 頁</b>','改編'].map(function(w,i){return '<span style="animation-delay:'+(1.1+i*.22)+'s">'+w+'</span>'}).join('')+'</div>'+
  '<div class="wbk"><span>Name ➜ <b>Age</b></span><span>Age ➜ <b>Name</b></span></div><div class="wbb" id="wbb"></div></div>';o.classList.add('on');
 setTimeout(function(){if(R!==my||!o.classList.contains('on'))return;var b=H('button','wbgo','▶ 開始');b.onclick=function(){o.classList.remove('on');o.innerHTML='';done()};$('#wbb').appendChild(b)},window.__WBK!=null?window.__WBK:2600)}
function goSplash(done){if(G&&G.id==='q9'&&!R.wbDone){R.wbDone=1;wb9(function(){goSplash(done)});return}if(window.__NOGO){done();return}var o=$('#go'),my=R;o.innerHTML='<div class="gw0">'+(R.x?'<div class="glv">第 '+(R.lv+1)+' 關 ／ '+(LVS||GM).length+'</div>':'')+'<div class="gi">'+G.ic+'</div><div class="gn">'+esc(G.nm)+'</div><div class="gh">'+esc(G.how)+'</div><div class="g3" id="g3">3</div></div>';o.classList.add('on');var n=3;
 var t=setInterval(function(){var c=$('#g3');if(R!==my||!c||$('#game').hidden){clearInterval(t);o.classList.remove('on');return}n--;if(n>0){c.textContent=n;c.classList.remove('pp');void c.offsetWidth;c.classList.add('pp')}else if(n===0){c.textContent='GO!';c.classList.add('gogo')}else{clearInterval(t);o.classList.remove('on');done()}},650)}
function RK(){return R.gk!=null?R.gk:R.k}   /* 這一關 的 第幾題（25／50 題 挑戰 一關 一關 算）*/
function dots(){$('#dots').innerHTML=(R.x?'<span class="xpg">📝 '+(R.k+1)+' ／ '+R.x+'</span>':'')+R.qs.map(function(q,k){if(R.x&&R.lvOf[k]!==R.lv)return '';return '<i class="'+(R.res[k]===1?'ok':R.res[k]===0?'no':k===R.k?'cur':'')+'"></i>'}).join('')}
/* 換 題目、回 大廳 ＝ QID ＋1：上一題 還沒 跑完 的 動畫（夾娃娃、打地鼠…）不會 算到 下一題 */
var QID=0;function later(fn,ms){var id=QID;return setTimeout(function(){if(id===QID)fn()},ms)}
function next(){if(DUO&&duoSw())return;QID++;PD=null;R.retry=0;R.k++;BUSY=false;R.ts=Date.now();if(R.k>=R.qs.length){end();return}R.q=R.qs[R.k];
 /* 25／50 題：換 關 ＝ 換 遊戲 ➜ 第 N 關 的 開場 3 2 1 GO（第一次 玩 擂台 先 選 戰士）*/
 if(R.x){var lv=R.lvOf[R.k];if(lv!==R.lv){R.lv=lv;R.gk=0;for(var j=0;j<R.k;j++)if(R.lvOf[j]===lv)R.gk++;R.q2how=0;G=(R.x&&LVS?LVS:GM)[lv];$('#stage').innerHTML='';hudX();var go=function(){goSplash(nextR)};
   if(G.id==='q8'){FHP=Math.max(1,Math.ceil(R.cnt[lv]/2));if(!ls('g3m_war')&&!rpHero()){warPick(go);return}}go();return}R.gk++}
 nextR()}
function nextR(){if(G.id==='dc'&&R.q.u!==R.dcu){var tut=R.dcu==null;R.dcu=R.q.u;$('#stage').innerHTML='';var les=function(){decLesson(LES[R.bk==='B'?'B':'A'][R.q.u],nextR)};if(tut&&!window.__NOTUT)decTut(DTUT,les);else les();return}   /* 2026-10-30 第 9-(5) 點：這一場 第一題 解碼 前 ＝ 先 教 怎麼 拖、中英 順序（decTut）*/
R.ts=Date.now();R.pre=null;R.frac=0;dots();$('#stage').innerHTML='';$('#how').textContent=R.q.how||G.how;REN[G.id](R.q,$('#stage'));tStart(G.t)}   /* q.how ＝ 這一題 問法 不一樣（大寫、用 聽 的）*/
function hudX(){$('#gnm').textContent='第 '+(R.lv+1)+' 關 · '+G.ic+' '+G.nm;$('#how').textContent=G.how;$('#wsw').hidden=G.id!=='q8';$('#tmb').style.transform='scaleX(1)';$('#tsec').textContent=G.t}
/* ══ 2026-10-27 第三十二次 第 3-(1) 點（老師：點〔離開〕就 前功盡棄）══
   25／50 題：每 答 一題 自動 存 在 這台 平板（g3m_xs25_5碼）；按〔✕ 離開〕先 問「真的 要 離開 嗎？」；
   大廳〔▶ 繼續 25 題 挑戰〕＝ 從 下一題 接著 做（分數、答對 幾題 接著 算），做完 才 送 成績；〔🔄 重新 開始〕＝ 丟掉 存 的。
   3-(2)：這一位 做過 的 題目（g3m_seen_5碼）先 不出，全部 做過 才 重新 洗 */
function xKey(n){return 'g3m_xs'+n+XS()+'_'+((typeof SCID!=='undefined'&&SCID)||'0')}
function xSave(){if(!R||!R.x||R.crs||DUO)return;try{ls(xKey(R.x),JSON.stringify({x:R.x,qi:R.qs.map(function(q){return XA().indexOf(q)}),lvOf:R.lvOf,cnt:R.cnt,nsim:R.nsim,score:R.score,res:R.res,wrong:R.wrong,Q:R.Q,t0:R.t0,t:Date.now()}))}catch(e){}}
function xLoad(n){try{var v=JSON.parse(ls(xKey(n))||'null');if(!v||v.x!==n||!v.Q||v.Q.length>=v.qi.length||Date.now()-v.t>14*864e5||v.qi.some(function(i){return i<0||!XA()[i]}))return null;return v}catch(e){return null}}
function xDel(n){try{localStorage.removeItem(xKey(n))}catch(e){}}
function xSeen(){try{var a=JSON.parse(ls('g3m_seen'+XS()+'_'+((typeof SCID!=='undefined'&&SCID)||'0'))||'[]'),o={};if(a.length>=XA().length)a=[];a.forEach(function(i){o[i]=1});return o}catch(e){return {}}}
function xSeenAdd(i){if(i<0)return;try{var k='g3m_seen'+XS()+'_'+((typeof SCID!=='undefined'&&SCID)||'0'),a=JSON.parse(ls(k)||'[]');if(a.length>=XA().length)a=[];if(a.indexOf(i)<0)a.push(i);ls(k,JSON.stringify(a))}catch(e){}}
function resumeX(n){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();resumeX(n)});return}var v=xLoad(n);if(!v){startX(n);return}
 document.body.classList.add('ing');DCG.B=XBX().dc;LVS=v.cnt.length>GM.length?[DCG].concat(GM):GM;R={x:v.x,bk:XBK,pt:100/v.x,i:-1,qs:v.qi.map(function(i){return XA()[i]}),lvOf:v.lvOf,cnt:v.cnt,nsim:v.nsim,k:v.Q.length-1,lv:-1,gk:-1,score:v.score,streak:0,res:v.res,wrong:v.wrong||[],Q:v.Q,t0:v.t0};
 $('#lobby').hidden=true;$('#endv').hidden=true;$('#game').hidden=false;$('#sc').textContent=R.score;$('#cmb').className='cmb';$('#cmb').textContent='';$('#stage').innerHTML='';next()}
function xAsk(){if(DUO){var D=DUO;DUO=null;SCID=D.id[0];document.body.classList.remove('duoon');lobby();return}if(!R||!R.x||R.crs){lobby();return}xSave();tPause();var n=R.Q.length;$('#xqt').innerHTML='已經 做 了 <b>'+n+'</b> 題，都 <b>存好 了</b>。<br>下次 按〔▶ 繼續 '+XNM(R.x)+'〕，從 第 '+(n+1)+' 題 接著 做。';$('#xq').classList.add('on')}
/* 25／50 題 挑戰：10 種 遊戲 平均 抽（25 ＝ 5 關 3 題、5 關 2 題；50 ＝ 每關 5 題）；🔁 類似 ＝ 30%（25 題 8 題、50 題 15 題），平均 分 在 各 關；每一次 重新 抽 */
function startX(N){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();startX(N)});return}
 /* 2026-10-29 第 2 件：第 1 關 ＝ 🔓 句子 解碼 任務（25 題 裡 8 題、50 題 裡 15 題；Unit 1 一半 ➜ Unit 2 一半），其他 10 關 平均 分 剩下 的 */
 var XB=XBX();DCG.B=XB.dc;LVS=[DCG].concat(GM);var DN=N===25?8:N===50?15:Math.round(N*.3),M=N-DN;
 document.body.classList.add('ing');var n=GM.length,c=GM.map(function(){return Math.floor(M/n)}),s=c.map(function(){return 0});shuf(GM.map(function(g,i){return i})).slice(0,M-c[0]*n).forEach(function(i){c[i]++});
 var SIM=GM.map(function(g){return XB[g.id].filter(function(q){return q.sim})}),NEW=GM.map(function(g){return XB[g.id].filter(function(q){return !q.sim})}),left=XBK==='H'?0:Math.round(N*(XBK==='B'?.5:.3)),ord=shuf(GM.map(function(g,i){return i}));   /* 新 25／新 50 ＝ 50% 類似（老師 第三十三次）*/
 while(left>0){var mv=0;ord.forEach(function(i){if(left>0&&s[i]<c[i]&&s[i]<SIM[i].length){s[i]++;left--;mv=1}});if(!mv)break}
 ord.forEach(function(i){while(c[i]-s[i]>NEW[i].length)s[i]++});
 var SEEN=xSeen(),un=function(L){L=shuf(L);return L.filter(function(q){return !SEEN[XA().indexOf(q)]}).concat(L.filter(function(q){return SEEN[XA().indexOf(q)]}))};   /* 第三十二次 3-(2)：做過 的 題目 先 不出（全部 做過 才 重新 洗）*/
 var qs=[],lvOf=[],d1=Math.ceil(DN/2);un(XB.dc.filter(function(q){return q.u===1})).slice(0,d1).concat(un(XB.dc.filter(function(q){return q.u===2})).slice(0,DN-d1)).forEach(function(q){qs.push(q);lvOf.push(0)});
 GM.forEach(function(g,i){shuf(un(SIM[i]).slice(0,s[i]).concat(un(NEW[i]).slice(0,c[i]-s[i]))).forEach(function(q){qs.push(q);lvOf.push(i+1)})});c=[DN].concat(c);s=[0].concat(s);
 R={x:N,bk:XBK,pt:100/N,i:-1,qs:qs,lvOf:lvOf,cnt:c,nsim:s,k:-1,lv:-1,gk:-1,score:0,streak:0,res:[],wrong:[],Q:[],t0:Date.now()};if(XQUIET)return;xDel(N);xSave();
 $('#lobby').hidden=true;$('#endv').hidden=true;$('#game').hidden=false;$('#sc').textContent='0';$('#cmb').className='cmb';$('#cmb').textContent='';$('#stage').innerHTML='';next()}
/* ── 倒數（錯題回饋、動畫時暫停：老師第 6 點「不算在限時裡」）── */
function tStart(T){TM.T=T;TM.used=0;TM.t0=performance.now();TM.run=true;tick()}
function tPause(){if(TM.run){TM.used+=(performance.now()-TM.t0)/1000;TM.run=false}}
function tGo(){if(!TM.run&&tLeft()>0){TM.t0=performance.now();TM.run=true}}
function tLeft(){return Math.max(0,TM.T-TM.used-(TM.run?(performance.now()-TM.t0)/1000:0))}
function tick(){cancelAnimationFrame(TM.raf);var l=tLeft();$('#tmb').style.transform='scaleX('+(l/TM.T)+')';var s=$('#tsec');s.textContent=Math.ceil(l);s.classList.toggle('low',l<=5&&TM.run);
 if(TM.run&&l<=0){TM.run=false;if(!BUSY){BUSY=true;miss(null)}return}TM.raf=requestAnimationFrame(tick)}
/* ── 對了：100 ＋ 速度 900 ＋ 連對（最多 ＋250）── */
/* 成績（第二十七次）：一題 一筆 [答對, 選了 第幾個（0 ＝ 正解、-1 ＝ 時間到、1 ＝ 其他 錯的）, 秒數, 1 秒 內 就 按, 剩下, 題庫 第幾題] */
function qRec(ok,pick){if(!R||R.Q.length>R.k)return;var ms=Date.now()-(R.ts||Date.now()),o=R.q.o,ci=ok?0:pick==null?-1:1;
  if(!ok&&o&&pick!=null){try{var pj=JSON.stringify(pick);for(var i=1;i<o.length;i++)if(JSON.stringify(o[i])===pj||o[i]===pick){ci=Math.min(3,i);break}}catch(e){}}   /* 寫字題 的 pick 有 畫布（不能 轉 文字）➜ 算 1 */
  R.Q.push([ok?1:0,ci,Math.round(ms/100)/10,pick!=null&&ms<1000?1:0,ok?Math.round(tLeft()/TM.T*1000)/1000:R.x&&G.id==='dc'?Math.round((R.frac||0)*1000)/1000:0,R.x?XA().indexOf(R.q):G.B.indexOf(R.q)]);   /* 🔓 解碼 任務 答錯 ＝ 第 5 格 放 放對 幾成（伺服器 照 這個 算 分）*/crProg(ok);if(R.x&&!R.crs){xSeenAdd(XA().indexOf(R.q));setTimeout(xSave,0)}}   /* 25／50 題：題庫 ＝ 挑戰 題庫（10 種 接起來）*/
function rec1(){try{if(!R||R.sent||!R.Q.length||typeof scLive!=='function'||!scLive())return false;var fast=0;R.Q.forEach(function(x){fast+=x[3]});if(fast*2>R.Q.length)return false;R.sent=1;
  var u=SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  var Rr={id:SCID,set:R.x?'g3gm_g3m-'+(R.bk==='B'?'n':R.bk==='H'?'h':'x')+R.x:'g3gm_'+crSet()+'-'+G.id,name:R.x?'📝 三年級 複習｜📝 '+XNM(R.x):crName()+'｜'+G.ic+' '+G.nm,m:'g',qs:R.Q,raw:R.score,fix:0,mp:0,mw:0,sec:Math.round((Date.now()-R.t0)/1000),src:'school',dev:SCDEV,u:u,t:Date.now()};
  var QQ=scGet('q')||[];QQ.push(Rr);scPut('q',QQ.slice(-200));scFlush();return true}catch(e){return false}}
function good(el,hold){if(BUSY)return;qRec(1);BUSY=true;tPause();var l=tLeft(),sp=Math.round(900*l/TM.T),cb=Math.min(250,R.streak*50),p=R.x?R.pt:100+sp+cb;   /* 25／50 題：答對 一題 ＝ 4／2 分 */
 R.streak++;R.score=Math.round((R.score+p)*10)/10;R.res[R.k]=1;dots();$('#sc').textContent=R.score;var cm=$('#cmb');if(R.streak>=2){cm.textContent='🔥 連對 '+R.streak;cm.className='cmb on'+(R.streak>=4?' hot':'');void cm.offsetWidth}
 var g=$('#gain');g.innerHTML=R.x?'<b>＋'+p+' 分</b><span>✅ 答對 一題 ＝ '+p+' 分</span>':'<b>＋'+p+'</b><span>✅ 100 ＋ ⚡ 快 '+sp+(cb?' ＋ 🔥 連對 '+cb:'')+'</span>';g.classList.remove('on');void g.offsetWidth;g.classList.add('on');
 boom(el);if(hold)return;
 /* 2026-10-30 第三十四次 第 5 點：挑戰（25／50、新 25／新 50、25 題 闖關）答對 ＝ 先 慢慢 唸 一次 正確 答案（跟 答錯頁 同一句），唸完 才 下一題 */
 if(R.x&&G.id!=='dc'){var o0=null;try{o0=FB[G.id](R.q,null)}catch(e){}if(o0){var my=QID;setTimeout(function(){if(my!==QID)return;sayList(o0.sl||[['',o0.say||R.q.en]],function(){if(my===QID)setTimeout(next,450)})},400);return}}
 setTimeout(next,1500)}   /* hold ＝ 這個 遊戲 自己 決定 什麼 時候 下一題（夾娃娃 唸完 那一句 才 走）*/
function boom(el){var r=el&&el.getBoundingClientRect?el.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0},E=['⭐','✨','🎉','💥','🪙'];
 for(var i=0;i<12;i++){var b=document.createElement('div');b.className='boom';b.textContent=E[i%E.length];b.style.left=(r.left+r.width/2)+'px';b.style.top=(r.top+r.height/2)+'px';
  b.style.setProperty('--dx',(Math.cos(i/12*6.28)*160)+'px');b.style.setProperty('--dy',(Math.sin(i/12*6.28)*160)+'px');b.style.setProperty('--r',(i*40)+'deg');document.body.appendChild(b);setTimeout(function(x){x.remove()}.bind(null,b),1100)}}
/* ── 錯了／時間到 ➜ 綠底 詳細解說：每一個英文字下面 中文、最下面 整句翻譯、自動唸 3 次 才能 下一題（不做類似題）── */
function toks(s){var r=[],re=/([A-Za-z][A-Za-z\\-]*)(’|')(s|m|re)\\b|[A-Za-z][A-Za-z\\-’']*|\\d+|[.,?!]/g,m;
 while((m=re.exec(s))){if(m[2])r.push(m[1],"'"+m[3]);else r.push(m[0])}return r}
function zhOf(w){var k=w.replace(/’/g,"'").toLowerCase();if(GL[k]!==undefined)return GL[k];if(/^[A-Z][a-z]+$/.test(w))return '（名字）';return ''}
function gloss(s){var T=toks(s),h='';for(var i=0;i<T.length;i++){var w=T[i];if(/^[.,?!]$/.test(w))continue;var p='';while(/^[.,?!]$/.test(T[i+1]||'')){p+=T[++i]}
  h+='<span class="gw'+(/^'/.test(w)?' ct':'')+'"><b>'+esc(w.replace(/'/g,'’'))+esc(p)+'</b><i>'+esc(zhOf(w))+'</i></span>'}return '<div class="gls" id="gls">'+h+'</div>'}
function miss(pick){if(R.pre){var pf=R.pre;R.pre=null;BUSY=true;tPause();pf(pick,function(){miss(pick)});return}qRec(0,pick);if(R.x&&G.id==='dc'&&R.frac>0){R.score=Math.round((R.score+R.pt*R.frac)*10)/10;$('#sc').textContent=R.score}BUSY=true;tPause();R.streak=0;$('#cmb').className='cmb';R.res[R.k]=0;dots();var q=R.q,o=FB[G.id](q,pick);R.wrong.push({en:o.say||q.en,show:o.show||q.en});
 var x=$('#fbx');x.innerHTML='<div class="hd">'+(pick==null?'⏰ 時間到':'❌ 答錯了')+'</div>'+(o.you?'<div class="yp">你的答案：'+o.you+'</div>':'')+
  '<div class="ca">✅ 正確答案</div>'+o.body+'<div><span class="tr">整句：'+esc(q.zh)+'</span></div>'+
  '<div class="ft"><span class="n3" id="n3">'+(o.rep===1?'<span>1</span>':'<span>1</span><span>2</span><span>3</span>')+'</span><button class="say" id="fbs">🔊 再聽</button><span id="nxw"></span></div>';
 $('#fb').classList.add('on');if(o.after)o.after();fbFit();
 var c=0,my=++FBN,REP=o.rep||3;function one(){if(my!==FBN)return;if(c>=REP){var w=$('#nxw');w.innerHTML='<button class="nx" id="fbn">▶ 下一題</button>';
   var n=3,b=$('#fbn');b.textContent='▶ 下一題 '+n;var t=setInterval(function(){if(my!==FBN){clearInterval(t);return}n--;if(n<=0){clearInterval(t);fbGo()}else b.textContent='▶ 下一題 '+n},1000);return}
  c++;var s=$('#n3').children[c-1];s.classList.add('on');var g=$('#gls');if(g){g.classList.remove('spk');void g.offsetWidth;g.classList.add('spk')}
  sayList(o.sl||[['',o.say||q.en]],function(){setTimeout(one,700)})}
 setTimeout(one,500)}
var FBN=0;
function fbFit(){var b=$('#fbx');b.classList.remove('f1','f2');['f1','f2'].forEach(function(c){if(b.scrollHeight>b.clientHeight+2)b.classList.add(c)})}
addEventListener('resize',function(){if($('#fb').classList.contains('on'))fbFit()});
function fbGo(){FBN++;stopSay();$('#fb').classList.remove('on');next()}
document.addEventListener('click',function(e){var t=e.target;if(t.id==='fbn')fbGo();if(t.id==='fbs'){var q=R.q,o=FB[G.id](q,R.pick||null);sayList(o.sl||[['',o.say||q.en]])}});
/* ── 結束 ── */
function end(){if(DUO){duoEnd1();return}if(R.crs){crDone();return}if(R.x){endX();return}stopSay();cancelAnimationFrame(TM.raf);$('#game').hidden=true;$('#endv').hidden=false;var ok=R.res.filter(function(x){return x===1}).length,st=ok>=7?3:ok>=5?2:1;
 var b=+(ls('g3m_best_'+G.id)||0),nb=R.score>b;if(nb)ls('g3m_best_'+G.id,R.score);
 var rc=rec1(),fq=0;R.Q.forEach(function(x){fq+=x[3]});var rn='<div class="rcn">'+(rc?'📝 記進 成績 了（練習次數 ＋1）':fq*2>R.Q.length?'⚠️ 太快 亂按 超過 一半：這一回 不算 成績':(typeof SCID!=='undefined'&&SCID?'📶 沒有 網路：先 存 在 平板':'（沒有 登入：沒有 記 成績）'))+'</div>';
 $('#end').innerHTML=rn+'<div class="st">'+[0,1,2].map(function(k){return '<i>'+(k<st?'⭐':'☆')+'</i>'}).join('')+'</div><div class="big">答對 '+ok+' ／ 8　·　'+R.score+' 分'+(nb?'　🏆 新紀錄':'')+'</div>'+
  (R.wrong.length?'<div class="wl">'+R.wrong.map(function(w,k){return '<div>📌 '+esc(w.show)+'<button data-w="'+k+'">🔊</button></div>'}).join('')+'</div>':'<div class="big">🎉 全部答對！</div>')+
  (G.id==='q8'?'<div class="big">'+(HP8.ko>=2?'🏆 你 擊敗了 DARK OVERLORD 和 SHADOW SCHEMER！':HP8.ko===1?'⚔ 你 打倒了 DARK OVERLORD！SHADOW SCHEMER 還剩 '+HP8.e+' 滴血，再 挑戰 一次！':'💀 DARK OVERLORD 還剩 '+HP8.e+' 滴血，再 挑戰 一次！')+'</div>':'')+'<div class="btns"><button class="b1" id="again">🔁 再玩一次</button><button class="b2" id="tolob">🎮 換一個遊戲</button></div>';window.scrollTo(0,0);if(st>=2)confetti()}
/* 25／50 題 結束：得分 ／ 100、每一關 答對 幾題、答錯 的 題目 */
function endX(){xDel(R.x);stopSay();cancelAnimationFrame(TM.raf);$('#game').hidden=true;$('#endv').hidden=false;var ok=R.res.filter(function(x){return x===1}).length,sc=Math.min(100,Math.round(R.score*10)/10),st=sc>=90?3:sc>=70?2:1;   /* 🔓 解碼 任務 放對 幾成 就 拿 幾成 ➜ 分數 ＝ R.score */
 var b=+(ls('g3m_bx'+XS()+R.x)||0),nb=sc>b;if(nb)ls('g3m_bx'+XS()+R.x,sc);var rc=rec1(),fq=0;R.Q.forEach(function(x){fq+=x[3]});
 var rn='<div class="rcn">'+(rc?'📝 記進 成績 了':fq*2>R.Q.length?'⚠️ 太快 亂按 超過 一半：這一回 不算 成績':(typeof SCID!=='undefined'&&SCID?'📶 沒有 網路：先 存 在 平板':'（沒有 登入：沒有 記 成績）'))+'</div>';
 var tb='<table class="xtb"><tr><th>關</th><th>遊戲</th><th>答對</th></tr>'+(LVS||GM).map(function(g,i){var a=0,n=0;R.lvOf.forEach(function(l,k){if(l===i){n++;if(R.res[k]===1)a++}});return '<tr><td>'+(i+1)+'</td><td>'+g.ic+' '+esc(g.nm)+'</td><td class="'+(a===n?'ok':'')+'">'+a+' ／ '+n+'</td></tr>'}).join('')+'</table>';
 $('#end').innerHTML=rn+'<div class="st">'+[0,1,2].map(function(k){return '<i>'+(k<st?'⭐':'☆')+'</i>'}).join('')+'</div><div class="big xsc">📝 '+XNM(R.x)+'：<b>'+sc+'</b> 分 ／ 100'+(nb?'　🏆 新紀錄':'')+'</div><div class="big">答對 '+ok+' ／ '+R.x+'（每題 '+R.pt+' 分）</div>'+tb+
  (R.wrong.length?'<div class="wl">'+R.wrong.map(function(w,k){return '<div>📌 '+esc(w.show)+'<button data-w="'+k+'">🔊</button></div>'}).join('')+'</div>':'<div class="big">🎉 全部答對！</div>')+
  '<div class="btns"><button class="b1" id="again">🔁 再 挑戰 一次</button><button class="b2" id="tolob">🎮 回 大廳</button></div>';window.scrollTo(0,0);if(st>=2)confetti()}
function confetti(){var c=$('#cfz');c.innerHTML='';for(var i=0;i<60;i++){var e=document.createElement('i');e.style.left=(Math.random()*100)+'%';e.style.background=['#FFD54A','#FF6B6B','#7FD4FF','#2BD46A','#FF9FD2'][i%5];e.style.animationDelay=(Math.random()*1.2)+'s';e.style.animationDuration=(2.2+Math.random()*1.6)+'s';c.appendChild(e)}setTimeout(function(){c.innerHTML=''},4500)}
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('button'):null;if(!t)return;
 if(t.dataset.g!=null)start(+t.dataset.g);else if(t.dataset.x!=null){XBK=t.dataset.bk||'A';if(DUOM)duoStart(+t.dataset.x);else startX(+t.dataset.x)}else if(t.dataset.duo!=null){DUOM=+t.dataset.duo;[].forEach.call(document.querySelectorAll('[data-duo]'),function(b){b.classList.toggle('on',+b.dataset.duo===DUOM)})}else if(t.dataset.xr!=null){XBK=t.dataset.bk||'A';resumeX(+t.dataset.xr)}else if(t.id==='again'){if(R.x)startX(R.x);else start(R.i)}else if(t.id==='qx')xAsk();else if(t.id==='xstay'){$('#xq').classList.remove('on');if(!BUSY)tGo()}else if(t.id==='xleave'||t.id==='tolob')lobby();else if(t.id==='wsw')warPick();else if(t.dataset.w!=null)sayT(R.wrong[+t.dataset.w].en)});
function hearBtn(fn){var b=document.createElement('button');b.className='hear';b.id='hear';b.textContent='🔊 再聽一次';b.onclick=function(){b.classList.add('on');fn();setTimeout(function(){b.classList.remove('on')},1500)};return b}
function H(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}

/* ═══════ 手寫板（四線格：紅線 ＝ 底線）═══════ */
function Pad(host,opt){var self=this,u=0,W=0,Hh=0,cv=document.createElement('canvas'),wrap=H('div','pad'),cx=cv.getContext('2d'),strokes=[],cur=null,dpr=Math.min(2,window.devicePixelRatio||1);
 wrap.appendChild(cv);var lg=H('span','lnlb','紅線 ＝ 底線');wrap.appendChild(lg);host.appendChild(wrap);
 function size(){var r=host.getBoundingClientRect(),avH=opt.h||Math.max(280,Math.min(innerHeight*(innerHeight>innerWidth?.46:.58),560)),avW=Math.min(r.width||innerWidth,opt.w||560);u=avH/3.5;Hh=avH;W=Math.min(avW,u*3.4);
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
function letterCanvas(ch,hpx,col,mk){var st=HW.T[ch][0],u=hpx/3.5,xs=[];st.forEach(function(s){s.forEach(function(p){xs.push(p[0])})});var x0=Math.min.apply(0,xs),x1=Math.max.apply(0,xs),W=Math.max(u*2.2,(x1-x0)*u+u*1.2),ox=(W-(x1-x0)*u)/2-x0*u;
 var c=document.createElement('canvas'),d=2;c.width=W*d;c.height=hpx*d;c.style.height=hpx+'px';var cx=c.getContext('2d');cx.scale(d,d);cx.fillStyle='#fff';cx.fillRect(0,0,W,hpx);
 function Y(g){return u*(g+.25)}[[0,'#9AA7B5',2,[8,6]],[1,'#9AA7B5',2,[8,6]],[2,'#E53935',4,[]],[3,'#9AA7B5',2,[8,6]]].forEach(function(l){cx.beginPath();cx.setLineDash(l[3]);cx.strokeStyle=l[1];cx.lineWidth=l[2];cx.moveTo(4,Y(l[0]));cx.lineTo(W-4,Y(l[0]));cx.stroke()});
 cx.setLineDash([]);cx.strokeStyle=col||'#1A237E';cx.lineWidth=Math.max(6,u*.1);cx.lineCap='round';cx.lineJoin='round';st.forEach(function(s){cx.beginPath();s.forEach(function(p,i){if(i)cx.lineTo(ox+p[0]*u,Y(p[1]));else cx.moveTo(ox+p[0]*u,Y(p[1]))});cx.stroke()});
 if(mk)HW.contacts(st).forEach(function(p){cx.beginPath();cx.fillStyle='#FFB300';cx.strokeStyle='#7A4A00';cx.lineWidth=2;cx.arc(ox+p[0]*u,Y(p[1]),Math.max(6,u*.12),0,7);cx.fill();cx.stroke()});return c}
/* 學生 寫的 字 ＋ 四線格；沒 碰到 的 地方 畫 紅色 圓圈、超出 的 線 畫 紅色（2026-10-25 頂天立地）*/
function skCanvas(sk,hpx,ln){var u=hpx/3.5,xs=[];sk.forEach(function(s){s.forEach(function(p){xs.push(p[0])})});var x0=Math.min.apply(0,xs),x1=Math.max.apply(0,xs),W=Math.max(u*2.4,(x1-x0)*u+u*1.6),ox=(W-(x1-x0)*u)/2-x0*u;
 var c=document.createElement('canvas'),d=2;c.width=W*d;c.height=hpx*d;c.style.height=hpx+'px';c.style.background='#fff';c.style.borderRadius='10px';var cx=c.getContext('2d');cx.scale(d,d);cx.fillStyle='#fff';cx.fillRect(0,0,W,hpx);function Y(g){return u*(g+.25)}
 [[0,'#9AA7B5',2,[8,6]],[1,'#9AA7B5',2,[8,6]],[2,'#E53935',4,[]],[3,'#9AA7B5',2,[8,6]]].forEach(function(l){cx.beginPath();cx.setLineDash(l[3]);cx.strokeStyle=l[1];cx.lineWidth=l[2];cx.moveTo(4,Y(l[0]));cx.lineTo(W-4,Y(l[0]));cx.stroke()});
 cx.setLineDash([]);cx.strokeStyle='#1A237E';cx.lineWidth=Math.max(5,u*.09);cx.lineCap='round';cx.lineJoin='round';sk.forEach(function(s){cx.beginPath();s.forEach(function(p,i){if(i)cx.lineTo(ox+p[0]*u,Y(p[1]));else cx.moveTo(ox+p[0]*u,Y(p[1]))});if(s.length===1)cx.lineTo(ox+s[0][0]*u+.1,Y(s[0][1]));cx.stroke()});
 var M=ln.map;ln.miss.forEach(function(m){var x=M.sw<.05?(x0+x1)/2:M.sx0+(m.x-M.tx0)/M.tw*M.sw;cx.beginPath();cx.strokeStyle='#FF1744';cx.lineWidth=4;cx.arc(ox+x*u,Y(m.L),Math.max(10,u*.28),0,7);cx.stroke()});
 ln.over.forEach(function(m){cx.beginPath();cx.strokeStyle='#FF1744';cx.lineWidth=6;cx.moveTo(4,Y(m.L));cx.lineTo(W-4,Y(m.L));cx.stroke()});return c}
function writeUI(stage,q,left,lk){var row=H('div','wrow'),L=H('div','wleft'),Rt=H('div','wrt');row.appendChild(L);row.appendChild(Rt);stage.appendChild(row);left(L);
 var pad=new Pad(Rt,{lock:function(){return BUSY||(lk&&lk())}}),bt=H('div','wbtn','<button class="er">🧽 擦掉</button><button class="go">✅ 寫好了</button>');Rt.appendChild(bt);
 bt.querySelector('.er').onclick=function(){if(!BUSY)pad.clear()};
 bt.querySelector('.go').onclick=function(){if(BUSY||pad.empty()||(lk&&lk()))return;var sk=pad.strokes(),j=HW.judge(sk,q.want);R.lastImg=pad.img();R.lastGot=j.got;R.lastSk=JSON.parse(JSON.stringify(sk));R.lastLn=null;
   var ln=HW.lines(sk,q.want),yy=[];sk.forEach(function(t){t.forEach(function(p){yy.push(p[1])})});var outG=Math.min.apply(0,yy)<-.15||Math.max.apply(0,yy)>3.15;   /* 超出 整個 四線格（最上面、最下面 的 線 外面）＝ 超出 格子 */
   if(outG&&!R.retry){R.retry=1;BUSY=true;tPause();var tt=H('div','rtry','✋ 超出 格子 了！<br>再 寫 一次<small>（不扣 時間，一題 一次）</small>');Rt.appendChild(tt);later(function(){tt.remove();pad.clear();BUSY=false;tGo()},1800);return}
   if(!j.ok){var j2=HW.judge(sk,q.want,1);if(j2.ok&&!ln.ok){R.lastLn=ln;miss('line');return}miss('draw');return}R.lastLn=ln;if(!ln.ok){miss('line');return}WOK(q,L)};return pad}

/* ═══════ 10 種 遊戲 的 畫面（2026-10-25 第二十五次 老師第 3 點：每一個遊戲 更好玩、更刺激、更有 回饋；規格 g3mid/CLAUDE.md 最上面）═══════ */
var REN={},FB={},WOK=null;
/* 1 🔨 字母 打地鼠：打到 ＝ 鎚子 落下 ➜ POW! ➜ 地鼠 被 壓扁 ➜ 眼睛 變 ✖、頭上 星星 轉圈圈（昏頭）➜ 慢慢 沉 下去；打錯 ＝ 那一隻 地鼠 吐舌頭「嘿嘿！」 */
REN.q1=function(q,st){var lw=H('div','lawn','<div class="gr"></div><div class="holes"></div>'),hs=lw.querySelector('.holes');
  /* 2026-10-26 第二十六次 第 1-1 點（老師：單字 模糊、太快，學生 聽不懂）：① 圖 ＝ 這個 字 是 什麼（看 圖 就 知道 是 哪一個 字，不會 洩漏 字母）② 慢的 語音檔（語速 0.78）自動 唸 2 次，唸 的 時候 倒數 停住 ③〔🐢 慢慢 唸〕更慢（0.62）*/
  var say2=function(sl,done){sayList([[sl?'M2':'M1',q.say],[sl?'M2':'M1',q.say]],done)},tp=H('div','q1top','<span class="q1t">🔊 What’s the <b>first letter</b>?'+(q.up?'<br><b class="q1up">( A B C … )</b>':'')+'</span>'),bt=H('div','q1btn');
  var hb=hearBtn(function(){say2(0)}),sb=H('button','hear slow','🐢 慢慢 唸');sb.onclick=function(){sb.classList.add('on');say2(1);setTimeout(function(){sb.classList.remove('on')},1500)};bt.appendChild(hb);bt.appendChild(sb);tp.appendChild(bt);st.appendChild(tp);st.appendChild(lw);
  shuf(q.o).forEach(function(c,i){var h=H('button','hole','<span class="pit"></span><span class="mole"><span class="mb" style="animation-delay:'+(-i*.7)+'s"><span class="sign">'+c+'</span><span class="body"><span class="eye l"></span><span class="eye r"></span><span class="nose"></span><span class="mth"></span></span></span></span><span class="dz"><i>⭐</i><i>💫</i><i>⭐</i></span><span class="hh">Hee-hee! 😝</span>');h.dataset.v=c;
   h.onclick=function(){if(BUSY)return;BUSY=true;tPause();var hm=H('div','hammer','🔨'),r=h.getBoundingClientRect(),lr=lw.getBoundingClientRect();hm.style.left=(r.left-lr.left+r.width*.35)+'px';hm.style.top=(r.top-lr.top+r.height*.05)+'px';lw.appendChild(hm);
    setTimeout(function(){if(c===q.o[0]){h.classList.add('hit');lw.classList.add('quake');var pw=H('div','pow','<b>POW!</b>');pw.style.left=(r.left-lr.left+r.width/2)+'px';pw.style.top=(r.top-lr.top+r.height*.3)+'px';lw.appendChild(pw);BUSY=false;good(h)}
     else{h.classList.add('miss');R.pick=c;later(function(){miss(c)},1000)}},200)};hs.appendChild(h)});
  setTimeout(function(){if(R.q!==q)return;tPause();say2(0,function(){if(R.q===q&&!BUSY)tGo()})},350)};
FB.q1=function(q,p){var w=PHM[q.say];return {you:p?'<b style="font-size:1.5em">'+esc(p)+'</b>':'',body:'<div style="font-size:clamp(60px,10vh,100px)">'+w[2]+(q.up?'<span style="font-size:.7em;color:#FFE07A;margin-left:.4em">➜ 大寫 '+esc(q.o[0])+'</span>':'')+'</div>'+gloss(q.say).replace('<b>'+q.say,'<b><u style="color:#FFE07A">'+q.say[0]+'</u>'+q.say.slice(1)),sl:[['M1',q.say]]}};
/* 2 🟡 小精靈 聽句（2026-10-26 第二十八次 重做，下面 REN.q2）*/
function card2(c){if(c.sc){var s=SC[c.sc];return '<div class="q2sc">'+s.ic.map(function(x){return '<span>'+x+'</span>'}).join('')+(s.fx?'<span class="fx">'+s.fx+'</span>':'')+(s.b?'<span class="q2b">'+s.b+'</span>':'')+'</div>'}
  return '<div class="tag"><div class="tt"><b>HELLO</b>my name is</div><div class="tn">'+esc(c.t)+'</div></div><div class="cake">🎂<span class="cn">'+c.a+'</span></div>'}
/* 2026-10-26 第二十八次 第 5 點（老師：介面 太小、不好 操控、很快 被 抓到、影響 作答 權益 ➜ 照 Wordwall「迷宮 追逐」影片）：
   ① 先 看 整張 迷宮（3 張 圖 在 3 個 大 房間）＋ 唸 句子 ＋ 3、2、1、GO（鬼 不 動、時間 停）➜ ② GO 以後 鏡頭 放大 2 倍 跟著 小精靈；
   ③ 按 一下 方向 就 一直 走（轉彎 可以 先 按，走到 路口 自己 轉）；走進 房間 ＝ 選 那 一張；④ 👻 走得 比 小精靈 慢，被 抓到 ＝ 回 起點、
   鬼 退回 角落 等 2 秒，不 扣 時間、不 算 錯；⑤ 一題 25 秒（GO 才 開始 算；〔🔊 再聽一次〕的 時候 時間 停）。
   點 畫面 上 的 圖、或 點 右邊 小 地圖 的 房間 ＝ 小精靈 自己 走過去（還是 要 小心 👻）。 */
var MZ=['###############','#AAA#.....#BBB#','#AAA#.###.#BBB#','#.............#','#.##.##.##.##.#','#.#....P....#.#','#.#.##.#.##.#.#','#......#......#','###.#.###.#.###','#...#.....#...#','#.#.##.#.##.#.#','#.#...CCC...#.#','#...#.CCC.#...#','###############'],
  MZW=15,MZH=14,MZR={A:[1,1],B:[11,1],C:[6,11]},MZP=[7,5],MZG=[[1,12],[13,12]],P2=null,DIRS={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]},OPP={u:'d',d:'u',l:'r',r:'l'};
function mzCh(x,y){return y>=0&&y<MZH&&x>=0&&x<MZW?MZ[y].charAt(x):'#'}
function mzOk(x,y,gh){var c=mzCh(x,y);return c!=='#'&&!(gh&&/[ABC]/.test(c))}   /* 鬼 不 進 房間 */
function mzPath(sx,sy,rm){var Q=[[sx,sy]],pr={},k=function(x,y){return x+','+y};pr[k(sx,sy)]=null;
  while(Q.length){var c=Q.shift();if(mzCh(c[0],c[1])===rm){var o=[],n=k(c[0],c[1]);while(pr[n]){o.unshift(pr[n][1]);n=pr[n][0]}return o}
   if(/[ABC]/.test(mzCh(c[0],c[1])))continue;
   for(var d in DIRS){var nx=c[0]+DIRS[d][0],ny=c[1]+DIRS[d][1];if(mzOk(nx,ny)&&!(k(nx,ny) in pr)){pr[k(nx,ny)]=[k(c[0],c[1]),d];Q.push([nx,ny])}}}return null}
REN.q2=function(q,st){var row=H('div','pmrow'),vw=H('div','pmv'),cv=document.createElement('canvas'),pac=H('div','pac2','<i></i>'),toast=H('div','pmt',''),gol=H('div','pmgo',''),tip=H('div','pmtip',''),
   gh=[H('div','gst','👻'),H('div','gst g2','👻')],side=H('div','pmside'),mm=document.createElement('canvas'),
   pad=H('div','dpad','<button data-d="u" aria-label="上">⬆</button><button data-d="l" aria-label="左">⬅</button><button data-d="d" aria-label="下">⬇</button><button data-d="r" aria-label="右">➡</button>');
  mm.className='mmap';vw.appendChild(cv);vw.appendChild(pac);gh.forEach(function(g){vw.appendChild(g)});vw.appendChild(toast);vw.appendChild(gol);vw.appendChild(tip);
  var S=P2={q:q,p:{cx:MZP[0],cy:MZP[1],tx:MZP[0],ty:MZP[1],f:0,d:''},nd:null,auto:null,goal:'',eat:{},g:[],gw:0,last:0,ph:'ov',hold:0,cs:30,cs0:30,csZ:60,cam:[MZW/2,MZH/2],vw:0,vh:0,z:0,cards:{}};
  function gReset(){S.g=MZG.map(function(p,i){return {cx:p[0],cy:p[1],tx:p[0],ty:p[1],f:0,d:i?'l':'r'}})}gReset();
  /* 3 張 圖 ➜ 3 個 房間（洗牌）*/
  shuf(q.o.map(function(c,k){return {c:c,k:k}})).forEach(function(o,i){var rm='ABC'.charAt(i),b=H('div','rmc',card2(o.c));b.dataset.k=o.k;b.dataset.rm=rm;b.setAttribute('role','button');
   b.onclick=function(){goRoom(rm)};S.cards[rm]=b;vw.appendChild(b)});
  side.appendChild(hearBtn(function(){S.hold=1;tPause();sayList(q.say,function(){S.hold=0;if(S.ph==='go'&&!BUSY)tGo()})}));side.appendChild(mm);side.appendChild(pad);
  row.appendChild(vw);row.appendChild(side);st.appendChild(row);
  function goRoom(rm){if(BUSY||S.ph==='end')return;S.goal=rm;S.nd=null;S.auto=mzPath(S.p.tx,S.p.ty,rm);for(var r in S.cards)S.cards[r].classList.toggle('aim',r===rm)}
  S.goK=function(k){for(var r in S.cards)if(+S.cards[r].dataset.k===k)goRoom(r)};
  function setD(d){if(BUSY)return;S.auto=null;S.goal='';S.nd=d;for(var r in S.cards)S.cards[r].classList.remove('aim');var p=S.p;if(p.tx===p.cx&&p.ty===p.cy){if(mzOk(p.cx+DIRS[d][0],p.cy+DIRS[d][1]))p.d=d;return}
   if(d===OPP[p.d]){var x0=p.cx,y0=p.cy;p.cx=p.tx;p.cy=p.ty;p.tx=x0;p.ty=y0;p.f=1-p.f;p.d=d;S.nd=null}else if(d!==p.d&&p.f<.4&&mzOk(p.cx+DIRS[d][0],p.cy+DIRS[d][1])){p.tx=p.cx;p.ty=p.cy;p.f=0}}
  /* 2026-10-30 第三十四次 第 5 點（老師：上下左右 不好 操作、很 容易 被 抓）：整塊 方向鍵 ＝ 一個 搖桿（按 哪一邊 就 往 哪一邊，手指 不用 放開 滑過去 就 換）；
     往 回 走 ＝ 馬上 掉頭；剛 離開 路口 一點點 就 按 轉彎 ＝ 退回 路口 馬上 轉（不會 錯過 路口） */
  var pdn=0,pd='';function padDir(e){var bt=e.type==='pointerdown'&&e.target.closest&&e.target.closest('[data-d]');if(bt)return bt.dataset.d;var r=pad.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);if(Math.max(Math.abs(dx),Math.abs(dy))<r.width*.1)return '';return Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u')}
  function padHi(d){[].forEach.call(pad.children,function(b){b.classList.toggle('on',b.dataset.d===d)})}
  pad.addEventListener('pointerdown',function(e){e.preventDefault();pdn=1;try{pad.setPointerCapture(e.pointerId)}catch(x){}pd=padDir(e);if(pd)setD(pd);padHi(pd)});
  pad.addEventListener('pointermove',function(e){if(!pdn)return;var d=padDir(e);if(d&&d!==pd){pd=d;setD(d);padHi(d)}});
  ['pointerup','pointercancel','lostpointercapture'].forEach(function(k){pad.addEventListener(k,function(){pdn=0;pd='';padHi('')})});
  var sw=null;vw.addEventListener('pointerdown',function(e){sw=[e.clientX,e.clientY]});
  vw.addEventListener('pointerup',function(e){if(!sw)return;var dx=e.clientX-sw[0],dy=e.clientY-sw[1];sw=null;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;setD(Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u'))});
  mm.addEventListener('click',function(e){var r=mm.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*MZW),y=Math.floor((e.clientY-r.top)/r.height*MZH);
   for(var k in MZR){var o=MZR[k];if(x>=o[0]-1&&x<=o[0]+3&&y>=o[1]-1&&y<=o[1]+2){goRoom(k);return}}});
  S.key=function(e){var m={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r'}[e.key];if(m&&P2===S&&R.q===q){e.preventDefault();setD(m)}};
  /* 大小：整張 迷宮 剛好 放進 畫面（cs0）；玩 的 時候 放大 2 倍（csZ，最大 130px 一格）*/
  function size(){var d=Math.min(2,window.devicePixelRatio||1),mw=Math.round(Math.min(230,Math.max(150,innerWidth*.16)));if(innerHeight>innerWidth)mw=150;   /* 小 地圖 先 定 大小，再 量 迷宮 有 多大 */
   mm.width=mw*d;mm.height=Math.round(mw*MZH/MZW)*d;mm.style.width=mw+'px';mm.style.height=Math.round(mw*MZH/MZW)+'px';
   var w=vw.clientWidth,h=vw.clientHeight;S.vw=w;S.vh=h;cv.width=w*d;cv.height=h*d;cv.style.width=w+'px';cv.style.height=h+'px';
   S.cs0=Math.min(w/MZW,h/MZH);S.csZ=Math.min(130,Math.max(S.cs0*2,Math.min(w,h)/7))}
  function pos(e){return [e.cx+(e.tx-e.cx)*e.f,e.cy+(e.ty-e.cy)*e.f]}
  function sx(x){return (x-S.cam[0])*S.cs+S.vw/2}function sy(y){return (y-S.cam[1])*S.cs+S.vh/2}
  function camT(){var pp=pos(S.p),cs=S.cs,hx=S.vw/2/cs,hy=S.vh/2/cs,x=pp[0]+.5,y=pp[1]+.5;
   x=MZW<=2*hx?MZW/2:Math.max(hx,Math.min(MZW-hx,x));y=MZH<=2*hy?MZH/2:Math.max(hy,Math.min(MZH-hy,y));return [x,y]}
  function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
  function draw(){var c=cv.getContext('2d'),d=cv.width/(S.vw||1),cs=S.cs;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,S.vw,S.vh);
   var x0=Math.max(0,Math.floor(S.cam[0]-S.vw/2/cs)-1),x1=Math.min(MZW-1,Math.ceil(S.cam[0]+S.vw/2/cs)+1),y0=Math.max(0,Math.floor(S.cam[1]-S.vh/2/cs)-1),y1=Math.min(MZH-1,Math.ceil(S.cam[1]+S.vh/2/cs)+1);
   for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++){var ch=MZ[y].charAt(x),X=sx(x),Y=sy(y);
    if(ch==='#'){c.fillStyle='#0B1250';c.strokeStyle='#3E5BFF';c.lineWidth=Math.max(2,cs*.07);rr(c,X+cs*.1,Y+cs*.1,cs*.8,cs*.8,cs*.2);c.fill();c.stroke()}
    else if(/[.P]/.test(ch)&&!S.eat[x+','+y]){c.fillStyle='#FFE6A8';c.beginPath();c.arc(X+cs/2,Y+cs/2,Math.max(3,cs*.08),0,7);c.fill()}}
   for(var k in MZR){var o=MZR[k];c.fillStyle='#FFD23F33';c.strokeStyle='#FFD23F';c.lineWidth=Math.max(3,cs*.08);rr(c,sx(o[0])+2,sy(o[1])+2,cs*3-4,cs*2-4,cs*.3);c.fill();c.stroke()}}
  function drawMM(){var c=mm.getContext('2d'),u=mm.width/MZW;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,mm.width,mm.height);
   for(var y=0;y<MZH;y++)for(var x=0;x<MZW;x++){var ch=MZ[y].charAt(x);if(ch==='#'){c.fillStyle='#2C3FBF';c.fillRect(x*u+u*.08,y*u+u*.08,u*.84,u*.84)}}
   for(var k in MZR){var o=MZR[k],b=S.cards[k];c.fillStyle=b.classList.contains('aim')?'#3EC5FF':'#FFD23F';c.fillRect(o[0]*u,o[1]*u,3*u,2*u);c.fillStyle='#111';c.font='bold '+Math.round(u*1.3)+'px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('ABC'.indexOf(k)+1,(o[0]+1.5)*u,(o[1]+1)*u)}
   if(S.ph!=='ov'){var vx=(S.cam[0]-S.vw/2/S.cs)*u,vy=(S.cam[1]-S.vh/2/S.cs)*u;c.strokeStyle='#fff';c.lineWidth=Math.max(2,u*.18);c.strokeRect(vx,vy,S.vw/S.cs*u,S.vh/S.cs*u)}
   S.g.forEach(function(g){var p=pos(g);c.fillStyle='#E9B8FF';c.beginPath();c.arc((p[0]+.5)*u,(p[1]+.5)*u,u*.45,0,7);c.fill()});
   var pp=pos(S.p);c.fillStyle='#FFD23F';c.beginPath();c.arc((pp[0]+.5)*u,(pp[1]+.5)*u,u*.6,0,7);c.fill()}
  function place(el,e,sc){var p=pos(e),cs=S.cs;el.style.width=el.style.height=(cs*sc)+'px';el.style.left=(sx(p[0]+.5)-cs*sc/2)+'px';el.style.top=(sy(p[1]+.5)-cs*sc/2)+'px'}
  function move(e,sp,dt,choose,gh){var rem=sp*dt;while(rem>0){if(e.tx===e.cx&&e.ty===e.cy){var d=choose(e);if(!d)return;var n=[e.cx+DIRS[d][0],e.cy+DIRS[d][1]];if(!mzOk(n[0],n[1],gh))return;e.d=d;e.tx=n[0];e.ty=n[1];e.f=0}
    var need=1-e.f;if(rem<need){e.f+=rem;rem=0}else{rem-=need;e.cx=e.tx;e.cy=e.ty;e.f=0;if(!gh&&arrive())return}}}
  /* 小精靈：先 照 自動 路線；按了 方向 ＝ 到 路口 能 轉 就 轉（先 按 先 記著）；不然 一直 往前 走，撞牆 停 */
  function pChoose(e){if(S.auto&&S.auto.length)return S.auto.shift();if(S.nd&&mzOk(e.cx+DIRS[S.nd][0],e.cy+DIRS[S.nd][1])){var d=S.nd;S.nd=null;return d}if(e.d&&mzOk(e.cx+DIRS[e.d][0],e.cy+DIRS[e.d][1]))return e.d;return null}   /* 一開始 不 動，按了 方向 才 走 */
  function gChoose(e){var o=[];for(var d in DIRS)if(mzOk(e.cx+DIRS[d][0],e.cy+DIRS[d][1],1)&&d!==OPP[e.d])o.push(d);if(!o.length)o=[OPP[e.d]];
   if(Math.random()<.3){var pp=pos(S.p);o.sort(function(a,b){return Math.hypot(e.cx+DIRS[a][0]-pp[0],e.cy+DIRS[a][1]-pp[1])-Math.hypot(e.cx+DIRS[b][0]-pp[0],e.cy+DIRS[b][1]-pp[1])});return o[0]}return o[Math.floor(Math.random()*o.length)]}
  function arrive(){var p=S.p,rm=mzCh(p.cx,p.cy);S.eat[p.cx+','+p.cy]=1;if(!/[ABC]/.test(rm))return false;
   var b=S.cards[rm];BUSY=true;S.ph='end';tPause();pac.classList.add('gulp');b.classList.add('eat');
   later(function(){var k=+b.dataset.k;if(k===0){b.classList.add('ok');BUSY=false;good(b)}else{b.classList.add('no');var o=q.o[k];R.pick=o;miss(o)}},650);return true}
  function say2(t){toast.textContent=t;toast.classList.remove('on');void toast.offsetWidth;toast.classList.add('on')}
  /* 被 抓到：回 起點、鬼 退回 角落 等 2 秒；不 扣 時間（停 1.2 秒）、不 算 錯 */
  function caught(){say2('👻 被抓到了！回到 起點（不算 錯）');pac.classList.add('hurt');setTimeout(function(){pac.classList.remove('hurt')},500);
   S.p={cx:MZP[0],cy:MZP[1],tx:MZP[0],ty:MZP[1],f:0,d:''};gReset();S.gw=2;S.nd=null;S.auto=S.goal?mzPath(MZP[0],MZP[1],S.goal):null;
   S.hold=1;tPause();setTimeout(function(){if(P2===S&&S.ph==='go'){S.hold=0;if(!BUSY)tGo()}},1200)}
  function loop(t){if(P2!==S||R.q!==q||!document.body.contains(vw))return;var dt=S.last?Math.min(.05,(t-S.last)/1000):0;S.last=t;
   if(S.ph==='go'&&!BUSY&&TM.run&&!S.hold){move(S.p,4.6,dt,pChoose,0);S.gw=Math.max(0,S.gw-dt);if(!window.__G2CALM&&!S.gw){S.g.forEach(function(g){move(g,2,dt,gChoose,1)})}
    var pp=pos(S.p);if(S.ph==='go'&&S.g.some(function(g){var gp=pos(g);return Math.hypot(gp[0]-pp[0],gp[1]-pp[1])<.6}))caught()}
   /* 鏡頭：整張 ➜ 放大（0.8 秒）➜ 跟著 小精靈 */
   vw.classList.toggle('ov',S.ph==='ov'&&S.cs0<60);if(S.ph==='ov'){S.cs=S.cs0;S.cam=[MZW/2,MZH/2]}
   else{S.z=Math.min(1,S.z+dt/.8);var e=S.z*S.z*(3-2*S.z);S.cs=S.cs0+(S.csZ-S.cs0)*e;var tg=camT(),a=S.z<1?e:Math.min(1,dt*9);
    if(S.z<1)S.cam=[MZW/2+(tg[0]-MZW/2)*a,MZH/2+(tg[1]-MZH/2)*a];else S.cam=[S.cam[0]+(tg[0]-S.cam[0])*a,S.cam[1]+(tg[1]-S.cam[1])*a]}
   draw();drawMM();for(var k in S.cards){var o=MZR[k],b=S.cards[k];b.style.left=(sx(o[0])+5)+'px';b.style.top=(sy(o[1])+5)+'px';b.style.width=(S.cs*3-10)+'px';b.style.height=(S.cs*2-10)+'px'}
   place(pac,S.p,.86);pac.className='pac2 d'+S.p.d+(pac.classList.contains('gulp')?' gulp':'')+(pac.classList.contains('hurt')?' hurt':'');S.g.forEach(function(g,i){place(gh[i],g,.82)});requestAnimationFrame(loop)}
  S.caught=caught;S.rs=function(){if(P2===S)size()};setTimeout(function(){size();requestAnimationFrame(loop)},0);try{new ResizeObserver(function(){if(P2===S)size()}).observe(vw)}catch(e){}
  /* 開始：時間 停 ➜ 看 整張 迷宮、唸 句子 ➜ 3、2、1、GO（鬼 不 動）➜ 放大 ➜ 時間 才 開始 走 */
  function cd(){if(window.__NOGO){play();return}var n=3;gol.textContent=n;gol.classList.add('pp');var tm=setInterval(function(){if(P2!==S||R.q!==q){clearInterval(tm);return}n--;
    gol.classList.remove('pp');void gol.offsetWidth;gol.classList.add('pp');if(n>0)gol.textContent=n;else if(n===0)gol.textContent='GO!';else{clearInterval(tm);gol.textContent='';play()}},650)}
  function play(){if(P2!==S||R.q!==q)return;S.ph='go';S.z=0;tip.textContent='';tGo()}
  function go(){tip.textContent='👀 先 看：3 張 圖 在 3 個 房間';sayList(q.say,function(){cd()})}
  setTimeout(function(){tPause()},0);
  if(RK()===0&&!R.q2how){R.q2how=1;var hw=H('div','q2how','<div class="q2hb"><h2>🟡 怎麼 玩？</h2><div class="q2s"><span>1</span><b>🔊</b><span class="tx">聽 一句 英文，看 整張 迷宮：<u>3 張 圖 在 3 個 房間</u></span></div>'+
     '<div class="q2s"><span>2</span><b>🕹</b><span class="tx">按 ⬆⬇⬅➡（或 手指 滑）<u>按 一下 就 一直 走</u>，走進 <u>對的 房間</u><br><small>（也可以 點 圖、點 小 地圖 的 房間 ➜ 小精靈 自己 走過去）</small></span></div>'+
     '<div class="q2s"><span>3</span><b>👻</b><span class="tx">碰到 鬼 ＝ 回 起點，<u>不算 錯、不扣 時間</u></span></div><button class="q2go" id="q2go">▶ 我 懂了，開始！</button></div>');st.appendChild(hw);
   hw.querySelector('#q2go').onclick=function(){hw.remove();go()}}
  else setTimeout(go,350)};
addEventListener('keydown',function(e){if(P2&&P2.key)P2.key(e)});addEventListener('resize',function(){if(P2&&P2.rs)P2.rs()});
FB.q2=function(q,p){return {you:p?'<span class="pc" style="display:inline-flex;min-height:0;animation:none;transform:scale(.62);margin:-30px -20px;position:static">'+card2(p)+'</span>':'',
  body:'<div style="display:flex;justify-content:center"><span class="pc" style="animation:none;min-height:0;padding:10px 20px;position:static">'+card2(q.o[0])+'</span></div>'+q.say.map(function(s){return gloss(s[1])}).join('').replace(/id="gls"/g,'').replace('class="gls"','class="gls" id="gls"'),sl:q.say}};
/* 3 🧸 教室 夾娃娃：投幣 叮！➜ ◀ ▶ 移動 夾子（夾子 有 眼睛 會 看）➜ ⬇ 夾！（也可以 直接 點 照片）➜ 繩子 放下去 彈一下 ➜ 夾子 合起來 ➜
   對 ＝ 拎起來 晃一晃 ➜ 搬到 出口 掉下去 ➜ 🎉 夾到了！；錯 ＝ 拎到 一半「哎呀！滑掉了 😵」掉回去、夾子 抖一抖 */
/* 2026-10-26 第二十六次 第 1-3 點（老師：介面、按鈕 全部 100% 道地 英文；夾到 ＝ 獎品 真的 從 出口 掉出來 拿到 獎勵；夾錯 ＝ 有趣 的 失敗 動畫）：
   機台 上面 跑馬燈「CLAW MACHINE」、投幣「INSERT COIN ➜ CREDIT 1」、按鈕〔◀ LEFT〕〔⬇ DROP〕〔RIGHT ▶〕、右邊 PRIZE 洞口 ＋ 透明 管子 ＋ 下面 PUSH 出貨門；
   夾到 ＝ 搬到 洞口 鬆開 ➜ 掉進 管子（管子 一路 亮）➜ 出貨門 打開 ➜ 扭蛋 滾出來 飛到 畫面 中間、打開 ➜ 照片 ＋「YOU WIN!」＋ 金幣 噴出來；
   夾錯 ＝ 拎到 一半 滑掉、彈兩下、夾子 眼睛 變 😵 搖頭、「OOPS! SO CLOSE!」 */
REN.q3=function(q,st){var bl='';for(var i=0;i<14;i++)bl+='<i style="animation-delay:'+(i%2*.4)+'s"></i>';
  var cw=H('div','claw','<div class="mq"><span class="mqb">'+bl+'</span><b>✦ CLAW MACHINE ✦</b><span class="mqb">'+bl+'</span></div><div class="glass"><div class="rail"></div><div class="arm"><div class="rope"></div><div class="hd3"><span class="ey">👀</span><span class="f l"></span><span class="f r"></span></div></div>'+
   '<div class="hole"><b>PRIZE</b><span>⬇</span></div><div class="tube"><i></i></div><div class="door"><span>PUSH</span></div><div class="coin3">🪙 INSERT COIN ➜ <b>CREDIT 1</b></div><div class="oops"></div><div class="caps"></div></div>'),
   caps=cw.querySelector('.caps'),arm=cw.querySelector('.arm'),rope=cw.querySelector('.rope'),hd=cw.querySelector('.hd3'),gl=cw.querySelector('.glass'),ey=cw.querySelector('.ey'),
   ct=H('div','ctl3','<button data-c="l" aria-label="LEFT">◀ LEFT</button><button data-c="g" class="gr3">⬇ DROP</button><button data-c="r" aria-label="RIGHT">RIGHT ▶</button>'),ix=-1;
  st.appendChild(hearBtn(function(){sayT(q.say)}));st.appendChild(cw);st.appendChild(ct);
  function aim(i){ix=i;var b=caps.children[i],r=b.getBoundingClientRect(),g=gl.getBoundingClientRect();hd.classList.remove('lk','rk');hd.classList.add(r.left+r.width/2-g.left>parseFloat(arm.style.left||0)?'rk':'lk');arm.style.left=(r.left+r.width/2-g.left)+'px';
   [].forEach.call(caps.children,function(c,k){c.classList.toggle('aim',k===i)})}
  function grab(b){if(BUSY)return;BUSY=true;tPause();var k=b.dataset.k,r=b.getBoundingClientRect(),g=gl.getBoundingClientRect(),dy=Math.max(40,r.top-g.top-40);cw.classList.remove('grab');
   setTimeout(function(){rope.style.height=dy+'px';hd.style.top=dy+'px';cw.classList.add('dn')},150);
   setTimeout(function(){cw.classList.add('grab')},1050);
   if(k===q.o[0]){setTimeout(function(){rope.style.height='40px';hd.style.top='40px';b.style.transform='translateY(-'+(dy-10)+'px) scale(.8)';b.classList.add('wob')},1450);
    var hl=function(){return cw.querySelector('.hole').getBoundingClientRect()};
    setTimeout(function(){var h=hl(),dx=h.left+h.width/2-(r.left+r.width/2);arm.style.left=(h.left+h.width/2-g.left)+'px';b.style.transform='translate('+dx+'px,-'+(dy-10)+'px) scale(.8)'},2300);
    setTimeout(function(){var h=hl();cw.classList.remove('grab');b.style.transition='transform .45s ease-in,opacity .45s';b.style.transform='translate('+(h.left+h.width/2-(r.left+r.width/2))+'px,'+(h.top+h.height-(r.top+r.height/2))+'px) scale(.15)';b.style.opacity='0';cw.classList.add('drop')},3150);
    setTimeout(function(){cw.classList.add('open')},3900);
    later(function(){prize(k,cw.querySelector('.door').getBoundingClientRect())},4150)}
   else{setTimeout(function(){rope.style.height=(dy*.55)+'px';hd.style.top=(dy*.55)+'px';b.style.transform='translateY(-'+(dy*.45)+'px) scale(.85) rotate(-8deg)'},1450);
    setTimeout(function(){b.style.transform='';b.classList.add('slip');cw.classList.remove('grab');cw.classList.add('shake');ey.textContent='😵';var o=cw.querySelector('.oops');o.innerHTML='OOPS! SO CLOSE! 😵';o.className='oops on'},2250);
    later(function(){b.classList.add('no');R.pick=k;miss(k)},3400)}}
  /* 扭蛋 從 出貨門 滾出來 ➜ 飛到 畫面 中間 ➜ 上下 兩半 打開 ➜ 照片 ＋ YOU WIN! ＋ 金幣 */
  function prize(k,d){var z=H('div','przz','<div class="prz"><span class="ph1"></span><span class="ph2"></span><div class="pin">'+capH(k)+'<b>YOU WIN!</b></div></div>');document.body.appendChild(z);var p=z.firstChild;
   p.style.left=(d.left+d.width/2)+'px';p.style.top=(d.top+d.height/2)+'px';requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('fly')})});
   later(function(){p.classList.add('pop');boom(p.querySelector('.pin'));
    /* 2026-10-26 第二十八次 第 6 點：夾到 對的 照片 ➜ 再 唸 一次 那一句（唸完 才 下一題）*/
    sayT(q.say,function(){later(function(){z.remove();next()},600)})},900);
   later(function(){BUSY=false;good(p.querySelector('.pin'),1)},1500);setTimeout(function(){z.remove()},12000)}
  shuf(q.o).forEach(function(k,i){var b=H('button','cap',capH(k));b.dataset.k=k;b.onclick=function(){if(BUSY)return;aim(i);setTimeout(function(){grab(b)},850)};caps.appendChild(b)});
  ct.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-c]');if(!b||BUSY)return;var c=b.dataset.c,n=caps.children.length;
   if(c==='g'){if(ix<0)aim(0);setTimeout(function(){grab(caps.children[ix])},ix<0?850:0);return}aim(ix<0?(c==='l'?0:n-1):(ix+(c==='l'?-1:1)+n)%n)});
  setTimeout(function(){sayT(q.say)},350)};
FB.q3=function(q,p){return {you:p?(/^w:/.test(p)?'<span style="font-size:1.8em">'+PHM[p.slice(2)][2]+'</span>':'<img src="img/'+p+'.jpg" style="height:clamp(60px,9vh,90px);border-radius:10px;border:3px solid #FF8A8A">'):'',
  body:(/^w:/.test(q.o[0])?'<div style="font-size:clamp(80px,14vh,140px);line-height:1.1">'+PHM[q.o[0].slice(2)][2]+'</div>':'<img class="ph" src="img/'+q.o[0]+'.jpg">')+gloss(q.say),say:q.say}};
/* 2026-10-26 第二十八次：夾娃娃 的 扭蛋 也 可以 是 課本 單字 的 圖（'w:字'）*/
function capH(k){return /^w:/.test(k)?'<span class="cw">'+PHM[k.slice(2)][2]+'</span>':'<img src="img/'+k+'.jpg" alt="">'}
/* 4 ⛏️ 挖礦 寫字母：聽單字 ➜ ① 點 對的 圖（3 塊 礦石，單字 跟 圖 配對）➜ ② 用手指 寫 第一個 字母（小寫）；形狀 對 ＋ 頂天立地、不超線（HW.lines）才 得分 */
REN.q4=function(q,st){var mc,picked=false;R.pic=null;writeUI(st,q,function(L){L.appendChild(hearBtn(function(){sayT(q.say)}));
   var ores=H('div','ores'),D=shuf(Object.keys(PHM).filter(function(w){return w!==q.say&&w.charAt(0)!==q.say.charAt(0)&&w!=='yo-yo'})).slice(0,2),all=shuf([q.say].concat(D));
   all.forEach(function(w){var b=H('button','ore','<span class="oi">'+PHM[w][2]+'</span>');b.dataset.ow=w;b.onclick=function(){if(BUSY||picked)return;
     if(w===q.say){picked=true;R.pic=w;b.classList.add('ok');[].forEach.call(ores.children,function(x){if(x!==b)x.classList.add('gone')});var p4=$('#pad4'),a4=$('#ask4');if(p4)p4.classList.remove('lk');if(a4)a4.innerHTML='② 寫 <b>第一個字母</b>（'+(q.want===q.want.toUpperCase()&&q.want!==q.want.toLowerCase()?'<b class="q1up">大寫</b>':'小寫')+'）<small>頂天立地、不超線</small>';sayT(q.say)}
     else{b.classList.add('no');R.pick='pic:'+w;BUSY=true;tPause();later(function(){miss('pic:'+w)},450)}};ores.appendChild(b)});
   L.appendChild(ores);L.appendChild(H('div','ask','<span id="ask4">① 點 <b>對的 圖</b></span>'))},function(){return !picked});
  setTimeout(function(){var p=document.querySelector('.pad');if(p){p.id='pad4';p.classList.add('lk')}},0);
  WOK=function(q,L){var o=L.querySelector('.ore.ok');if(o){o.classList.add('crack');setTimeout(function(){o.classList.add('brk')},350)}good(o||L)};
  setTimeout(function(){sayT(q.say)},350)};
/* 寫字 的 答錯頁：電腦 看到 的 字、頂天立地 沒 做到 的 地方（紅圈）、正確 的 字（● ＝ 要 碰到 線 的 地方） */
function fbWrite(q){var big=Math.round(Math.min(innerHeight*.2,220)),ln=R.lastLn&&!R.lastLn.ok?R.lastLn:null;return {you:R.lastImg&&R.lastImg.length?(ln?'<span id="mysk"></span>':'<img src="'+R.lastImg+'" style="height:clamp(70px,11vh,110px);background:#fff;border-radius:10px">')+(ln?'<span class="lnw">📏 形狀 對了，但是 <b>'+esc(ln.words)+'</b></span>':R.lastGot&&R.lastGot!==q.want?'<span>（電腦看到的是 <b>'+esc(R.lastGot)+'</b>）</span>':''):'',
  body:'<div class="ltr" id="ltr"></div><div class="lnh">📏 頂天立地：<b>●</b> 的 地方 都 要 碰到 線，不可以 超出</div>',after:function(){var l=$('#ltr'),fig=function(t,c){var f=H('div','ltf','<span>'+t+'</span>');f.appendChild(c);return f},up=function(c){return c===c.toUpperCase()},nm=function(c){return (up(c)?'大寫 ':'小寫 ')+'<b>'+esc(c)+'</b>'};
   /* 2026-10-26 第二十六次 第 1-4B 點（老師：用 正確 的 格線 呈現 題目 的 字母 和 正確答案 的 字母，比較 大寫 小寫 在 格線 的 位置）*/
   if(G.id==='q5'){l.appendChild(fig((q.lis?'比一比：':'題目：')+nm(q.show),letterCanvas(q.show,big,'#3A1A80')));l.appendChild(H('span','ar','➜'));l.appendChild(fig('✅ 正確答案：'+nm(q.want),letterCanvas(q.want,big,'#0A5E2D',1)))}
   else{var U=up(q.want)?q.want.toLowerCase():q.want.toUpperCase();l.appendChild(fig('✅ 正確答案：'+nm(q.want),letterCanvas(q.want,big,'#0A5E2D',1)));if(HW.T[U]&&U!==q.want){l.appendChild(H('span','ar','↔'));l.appendChild(fig('比一比：'+nm(U),letterCanvas(U,big,'#3A1A80')))}}
   l.appendChild(H('div','',''));if(ln&&R.lastSk){var m=$('#mysk');if(m)m.appendChild(skCanvas(R.lastSk,Math.round(Math.min(innerHeight*.13,130)),ln))}
   }}}
FB.q4=function(q,p){var w=PHM[q.say];if(typeof p==='string'&&p.indexOf('pic:')===0){var y=PHM[p.slice(4)];return {you:'<span style="font-size:1.8em">'+y[2]+'</span>',body:'<div style="font-size:clamp(60px,10vh,100px)">'+w[2]+'</div>'+gloss(q.say),say:q.say}}
  var o=fbWrite(q);o.body+='<div style="display:flex;align-items:center;justify-content:center;gap:16px"><span style="font-size:clamp(44px,7vh,70px)">'+w[2]+'</span>'+gloss(q.say).replace('<b>'+q.say,'<b><u style="color:#FFE07A">'+q.say[0]+'</u>'+q.say.slice(1))+'</div>';o.say=q.say;return o};
/* 5 🪞 大小寫 魔鏡：形狀 對 ＋ 頂天立地、不超線 才 得分；對了 ＝ 鏡子 轉一圈 發光 */
REN.q5=function(q,st){var mi;writeUI(st,q,function(L){mi=H('div','mirror');L.appendChild(mi);var up=q.show===q.show.toUpperCase();
   /* 2026-10-26 第二十八次：🔊 聽 字母（不給 看）➜ 寫 大寫／小寫（q.lis）*/
   if(q.lis){var wu=q.want===q.want.toUpperCase(),sy=function(){sayList([['',q.say+'.'],['',q.say+'.']])};mi.classList.add('lis');mi.innerHTML='<button class="mlis" aria-label="聽">🔊</button>';mi.firstChild.onclick=sy;
    L.appendChild(H('div','ask','🔊 聽 一個 字母 ➜ 寫 它 的 '+(wu?'<b class="q1up">大寫</b>':'<b>小寫</b>')+'<small>頂天立地、不超線</small>'));setTimeout(function(){if(R.q!==q)return;tPause();sayList([['',q.say+'.'],['',q.say+'.']],function(){if(R.q===q&&!BUSY)tGo()})},350);return}
   L.appendChild(H('div','ask','鏡子裡 是 '+(up?'<b>大寫</b>':'<b>小寫</b>')+' ➜ 寫 '+(up?'<b>小寫</b>':'<b>大寫</b>')+'<small>頂天立地、不超線</small>'));setTimeout(function(){var h=Math.min(mi.clientHeight*.86,320);mi.appendChild(letterCanvas(q.show,h,'#3A1A80'))},0)});
  WOK=function(q,L){mi.classList.add('magic');sayList([['',q.want+'.']]);good(mi)}};
FB.q5=function(q){var o=fbWrite(q);o.say=q.want+'.';o.body+=gloss(q.want).replace('<i></i>','<i>'+(q.want===q.want.toUpperCase()?'大寫':'小寫')+'</i>');return o};
/* 6 🧱 數字 金幣磚：題目 一看 就懂 ＝「🍄 一共 有 幾個？」＋ 例子（🍎🍎 ＝ two）＋ 點 東西 會 數 1、2、3…；小 瑪利歐 跑到 磚 下面 跳起來 頂 磚，金幣 跳出來 */
REN.q6=function(q,st){var sk=H('div','sky'),ob=H('div','objs'+(q.ctx?' x'+q.ctx:'')),sl=H('div','slots'),qb=H('div','qbs'),hr=H('div','hero6','🏃'),cnt=0,ex=q.n===2?3:2,eo=q.obj==='🍎'?'⭐':'🍎';
  for(var i=0;i<q.n;i++){var s=H('span','',q.obj);s.style.animationDelay=(i*.06)+'s';s.onclick=function(){if(this.dataset.c)return;cnt++;this.dataset.c=cnt;this.classList.add('cnt')};ob.appendChild(s)}
  if(q.ctx==='dice'){var DP={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]}[q.n],sp=[].slice.call(ob.children);ob.innerHTML='';for(var c9=0;c9<9;c9++)ob.appendChild(DP.indexOf(c9)>=0?sp.shift():H('i','dv',''))}   /* 骰子 的 點 排法 跟 真的 一樣 */
  /* 2026-10-26 第二十八次：🎂 蛋糕 上 的 蠟燭（I'm ___ years old.）、🎲 骰子 的 點 */
  var HD={cake:'🎂 How many <b>candles</b>?　「I’m ___ years old.」<small>👆 點 一下 蠟燭 ＝ 數 1、2、3…</small>',dice:'🎲 How many <b>dots</b>?<small>👆 點 一下 點 ＝ 數 1、2、3…</small>'};
  sk.appendChild(H('div','q6h',q.ctx?HD[q.ctx]:'How many <span class="o1">'+q.obj+'</span>?<small>👆 點 一下 東西 ＝ 數 1、2、3…</small>'));if(q.ctx==='cake'){var ck=H('div','cake6');ck.appendChild(ob);ck.appendChild(H('div','ckb','<i></i>'));sk.appendChild(ck)}else sk.appendChild(ob);
  sk.appendChild(H('div','q6ex','例：<span>'+new Array(ex+1).join(eo)+'</span> ＝ <b>'+NUMW[ex]+'</b>　➜　敲 字母磚，用 英文 拼出 '+(q.ctx==='cake'?'蠟燭 的 根數':q.ctx==='dice'?'點 的 個數':'<span>'+q.obj+'</span> 的 個數')));
  sk.appendChild(sl);st.appendChild(sk);var gd=H('div','qbw');gd.appendChild(qb);gd.appendChild(hr);st.appendChild(gd);var k=0,W=q.want;
  for(var i=0;i<W.length;i++)sl.appendChild(H('div','slot'+(i?'':' on')));
  var NC=NUMC[W]||'';shuf(W.split('').concat(q.extra)).forEach(function(c){var b=H('button','qb'+(/[aeiou]/.test(c)?' n6v':''),c);b.onclick=function(){if(BUSY||b.classList.contains('used'))return;var r=b.getBoundingClientRect(),gr=gd.getBoundingClientRect();
    hr.style.left=(r.left-gr.left+r.width/2)+'px';hr.classList.remove('jp');void hr.offsetWidth;hr.classList.add('jp');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');
    if(c===W[k]){b.classList.add('used');var cn=H('div','coin','🪙');cn.style.left=r.left+'px';cn.style.top=(r.top-30)+'px';document.body.appendChild(cn);setTimeout(function(){cn.remove()},800);
     var s=sl.children[k];s.innerHTML='<b class="'+(NC.charAt(k)==='v'?'n6v':NC.charAt(k)==='s'?'n6s':'')+'">'+c+'</b>';s.classList.remove('on');k++;if(sl.children[k])sl.children[k].classList.add('on');if(k>=W.length){if(!R.x)sayList(n6sl(W));good(sl)}}
    else{b.classList.add('bad');R.pick=W.slice(0,k)+c;BUSY=true;tPause();later(function(){miss(W.slice(0,k)+c)},450)}};qb.appendChild(b)})};
FB.q6=function(q,p){return {you:p?'<s>'+esc(p)+'</s>':'',body:'<div style="font-size:clamp(34px,5vh,50px)">'+(q.ctx==='cake'?'🎂 ':q.ctx==='dice'?'🎲 ':'')+new Array(q.n+1).join(q.obj)+'</div><div style="font-size:clamp(50px,8vh,80px);color:#FFE07A">'+q.n+(q.ctx==='cake'?' 根 蠟燭 ＝ '+q.n+' 歲':' 個')+'</div>'+'<div class="n6w">'+n6c(q.want)+'</div>'+gloss(q.ctx==='cake'?q.en:q.want),say:q.ctx==='cake'?q.en:q.want,sl:q.ctx==='cake'?null:n6sl(q.want)}};
var NUMC=${JSON.stringify(NUMC)};function n6c(w){var c=NUMC[w]||'';return w.split('').map(function(ch,i){var k=c.charAt(i);return '<span class="'+(k==='v'?'n6v':k==='s'?'n6s':'')+'">'+ch+'</span>'}).join('')}
function n6sl(w){return [[(window.ENAUDM||{})[akey(w)]?'M1':'',w]]}   /* 第三十四次 第 7 點：清晰、慢速（有 男聲 0.78 慢 的 就 用 它）*/
/* 7 🌱 皮克敏 搬字（拖曳；點一下也可以）：對 ＝ 字 放進去、花 開出來、其他 皮克敏 跳起來 歡呼；錯 ＝ 那一隻 跌倒「哎唷！」 */
/* 🔓 句子 解碼 任務（2026-10-29 第 2 件；引擎 _decode.js）：全對 ＝ 唸 一次 整句（唸到 哪 亮到 哪）＋ 最下面 整句 中文 ➜ 得分；有 錯 ＝ 答錯頁（放對 幾成 拿 幾成）*/
DEC.A={aud:aud,stop:stopSay,pause:tPause,go:tGo,busy:function(){return BUSY},sid:function(){return (typeof SCID!=='undefined'&&SCID)||''},ok:function(el){good(el)},bad:function(got,f){R.pick=got;R.frac=f;miss(got)}};
REN.dc=function(q,st){st.appendChild(H('div','dcu','📘 Unit '+q.u));decRender(q,st)};
FB.dc=function(q,p){return {you:decYou(q,p)+(R.x&&R.frac>0?'<div class="yp">✅ 放對 '+Math.round(R.frac*q.t.length)+' ／ '+q.t.length+' 個 ➜ 拿 '+(Math.round(R.pt*R.frac*10)/10)+' 分</div>':''),
  body:'<div class="gls" id="gls">'+q.t.map(function(t){return '<span class="gw'+(/^'/.test(t[0])?' ct':'')+'"><b>'+decEN(t[0])+'</b><i>'+esc(t[1])+'</i></span>'}).join('')+'</div>',say:q.en,sl:[[q.v||'',q.en]]}};
REN.q7=function(q,st){var parts=q.s.split('___'),se=H('div','sent',esc(parts[0])+'<span class="gap" id="gap">　</span>'+esc(parts[1])),fd=H('div','field');st.appendChild(se);st.appendChild(fd);st.appendChild(H('div','ask','👆 拖 一隻 皮克敏 到 空格'));
  var C=['#E53935','#1E88E5','#FDD835'];shuf(q.o).forEach(function(w,i){var p=H('div','pk','<span class="wd">'+esc(w)+'</span><span class="bdy" style="--pc:'+C[i]+'"><span class="lf">🌱</span><span class="hd"></span><span class="tr"></span></span><span class="ow">Oops!</span>');fd.appendChild(p);
   var sx,sy,mv=false;p.addEventListener('pointerdown',function(e){if(BUSY)return;e.preventDefault();sx=e.clientX;sy=e.clientY;mv=false;p.classList.add('drag');p.classList.remove('back');try{p.setPointerCapture(e.pointerId)}catch(x){}});
   p.addEventListener('pointermove',function(e){if(!p.classList.contains('drag'))return;var dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>8)mv=true;p.style.transform='translate('+dx+'px,'+dy+'px) scale(1.08)';$('#gap').classList.toggle('hot',over(e))});
   function over(e){var g=$('#gap').getBoundingClientRect();return e.clientX>g.left-40&&e.clientX<g.right+40&&e.clientY>g.top-60&&e.clientY<g.bottom+80}
   function drop(e){if(!p.classList.contains('drag'))return;p.classList.remove('drag');$('#gap').classList.remove('hot');if(!mv||over(e))put();else{p.classList.add('back');p.style.transform=''}}
   p.addEventListener('pointerup',drop);p.addEventListener('pointercancel',function(){p.classList.remove('drag');p.classList.add('back');p.style.transform=''});
   function put(){if(BUSY)return;var g=$('#gap');if(w===q.o[0]){g.textContent=w;p.style.visibility='hidden';g.classList.add('fill');[].forEach.call(fd.querySelectorAll('.pk'),function(x){x.classList.add('cheer')});
     for(var f=0;f<6;f++){var fl=H('span','bloom',['🌸','🌼','🌷'][f%3]);fl.style.setProperty('--a',(f*60)+'deg');g.appendChild(fl)}sayT(q.say);good(g)}
    else{R.pick=w;BUSY=true;tPause();p.style.transform='';p.classList.add('trip');later(function(){miss(w)},800)}}})};
FB.q7=function(q,p){return {you:p?'<s>'+esc(q.s.replace('___',p))+'</s>':'',body:gloss(q.en),say:q.en}};
/* 8 ⚔ 英文 對決 擂台（老師：「寶可夢」刪掉；你 ＝ 自己 選 的 戰士（戰神之路 的 圖）、對手 ＝ 黑暗騎士）：
   黑暗騎士 用 英文 出招 ➜ 你 選 對的 回答 ➜ 戰士 衝過去 斬擊 ⚔、騎士 血條 掉；選錯 ＝ 騎士 反擊。騎士 7 滴血：答對 7 題 ＝ K.O. */
var HP8={e:7,m:7},DKSV='<svg class="dksv" viewBox="0 0 200 260" aria-label="黑暗騎士"><defs><linearGradient id="dkA" x1="0" x2="1"><stop offset="0" stop-color="#15151F"/><stop offset=".5" stop-color="#5A5A7A"/><stop offset="1" stop-color="#101018"/></linearGradient><radialGradient id="dkE"><stop offset="0" stop-color="#FFF"/><stop offset=".35" stop-color="#FF3B3B"/><stop offset="1" stop-color="#FF3B3B" stop-opacity="0"/></radialGradient><linearGradient id="dkS" x1="0" x2="1"><stop offset="0" stop-color="#7A86B0"/><stop offset=".5" stop-color="#E8ECFF"/><stop offset="1" stop-color="#6A74A0"/></linearGradient></defs>'+
  '<path d="M36 96Q100 66 164 96L190 252Q100 232 10 252Z" fill="#3A0A18"/><path d="M36 96Q100 66 164 96L176 140Q100 120 24 140Z" fill="#5A0E22"/>'+
  '<g class="dksw"><rect x="168" y="38" width="9" height="150" rx="3" fill="url(#dkS)"/><rect x="156" y="182" width="33" height="9" rx="3" fill="#8A6A2A"/><rect x="168" y="190" width="9" height="30" fill="#3A2A1A"/><path d="M172 30L168 40H177Z" fill="#E8ECFF"/><rect x="170" y="44" width="5" height="138" fill="#B46BFF" opacity=".35"/></g>'+
  '<path d="M62 116Q100 100 138 116L150 206Q100 222 50 206Z" fill="url(#dkA)" stroke="#8A8AB8" stroke-width="3"/><path d="M100 112V214M66 150H134M70 182H130" stroke="#2A2A3A" stroke-width="3"/><circle cx="100" cy="150" r="9" fill="#B01030" stroke="#FFB0B0" stroke-width="2"/>'+
  '<ellipse cx="56" cy="118" rx="28" ry="17" fill="url(#dkA)" stroke="#8A8AB8" stroke-width="3"/><ellipse cx="144" cy="118" rx="28" ry="17" fill="url(#dkA)" stroke="#8A8AB8" stroke-width="3"/><path d="M34 112L22 96L44 106ZM166 112L178 96L156 106Z" fill="#C8C8E0"/>'+
  '<rect x="62" y="206" width="30" height="46" rx="6" fill="url(#dkA)" stroke="#8A8AB8" stroke-width="3"/><rect x="108" y="206" width="30" height="46" rx="6" fill="url(#dkA)" stroke="#8A8AB8" stroke-width="3"/>'+
  '<path d="M68 42Q100 8 132 42L134 96Q100 112 66 96Z" fill="url(#dkA)" stroke="#9A9AC8" stroke-width="3"/><path d="M70 46Q46 22 54 0Q64 26 84 36ZM130 46Q154 22 146 0Q136 26 116 36Z" fill="#D8D8EE" stroke="#6A6A8A" stroke-width="2"/>'+
  '<path d="M76 60H124V70H76Z" fill="#05050A"/><path d="M100 70V94" stroke="#05050A" stroke-width="5"/><circle class="dkey" cx="88" cy="65" r="8" fill="url(#dkE)"/><circle class="dkey" cx="112" cy="65" r="8" fill="url(#dkE)"/></svg>';
function rpHero(){var h=ls('rp_hero');return h&&WARALL.indexOf(h)>=0?h:''}
function warImg(){var h=rpHero();if(h&&!ls('g3m_war'))return '../rpg/chars/'+h+'.jpg';var w=ls('g3m_war');return '../rpg/chars/'+(w&&WARALL.indexOf(w)>=0?w:h||WAR[0][0])+'.jpg'}
/* 2026-10-26 第二十六次 第 1-5B 點（老師選 A：兩位 都 上場）：反派 ＝ 老師 給 的 圖（img/foe1 DARK OVERLORD 反派領袖、img/foe2 SHADOW SCHEMER 影之謀士）。
   第 1 回合 DARK OVERLORD 4 滴血 ➜ 打倒（K.O.!）➜ 第 2 回合 SHADOW SCHEMER 出場 4 滴血；8 題 全對 ＝ 兩位 都 打倒 */
var FOE=[{img:'img/foe1.webp',en:'DARK OVERLORD',zh:'反派領袖'},{img:'img/foe2.webp',en:'SHADOW SCHEMER',zh:'影之謀士'}],FHP=4;
REN.q8=function(q,st){if(RK()===0)HP8={b:0,e:FHP,m:8,ko:0};if(HP8.e<=0&&HP8.b===0){HP8.b=1;HP8.e=FHP;HP8.nw=1}var F=FOE[HP8.b],line=q.rev?q.b:q.a;
  var ar=H('div','duel','<div class="dbg"><i></i><i></i></div><div class="fig me"><div class="fcard"><img src="'+warImg()+'" alt="你的戰士"></div><div class="hpb"><b>🛡 YOU</b><span class="bar"><i style="width:'+(HP8.m/8*100)+'%"></i></span></div></div><div class="vs">VS</div>'+
   '<div class="fig dk"><div class="fcard foe"><img src="'+F.img+'" alt="'+F.en+'"></div><div class="hpb"><b>💀 '+F.en+'</b><span class="bar"><i style="width:'+(HP8.e/FHP*100)+'%"></i></span></div></div><div class="bub8"><small>'+F.en+(q.rev?' answers:':' says:')+'</small>'+esc(line)+' <button id="b8" aria-label="再聽">🔊</button></div>'+
   '<div class="rnd8">ROUND '+(HP8.b+1)+' ／ 2</div>'+(HP8.nw?'<div class="nw8"><b>⚠ '+F.en+'</b><span>is coming!</span></div>':''));HP8.nw=0;
  st.appendChild(ar);/* 2026-10-30 第三十四次 第 8 點（老師：「誰 問、誰 被 問」看不懂）➜ 秒懂 對話 條：頭像＋大字「❓ 問」「💬 答」＋箭頭 一顆 光點 跑過去；已經 說了 的 ＝ 👆（上面 那一句），要 你 選 的 ＝ 會 閃 的「？ 👇」 */
  $('#how').textContent=q.rev?'你 先 ❓ 問、反派 💬 答 了 👆 ➜ 你 剛剛 問 了 什麼？選 對的 問句 ⚔':'反派 ❓ 問 👆 ➜ 你 💬 答：選 對的 回答 ⚔';
  var fA='<span class="f8p"><img src="'+F.img+'" alt=""><em>'+F.en.split(' ')[1]+'</em></span>',fY='<span class="f8p me"><img src="'+warImg()+'" alt=""><em>YOU</em></span>',
   said='<span class="f8l">👆</span>',pk='<span class="f8l f8q">？ 👇</span>';
  st.appendChild(H('div','ask8 flow8'+(q.rev?' rev':''),q.rev?'<div class="f8c f8you">'+fY+'<b class="f8r">❓ 問</b>'+pk+'</div><div class="f8a"><i></i></div><div class="f8c f8foe">'+fA+'<b class="f8r">💬 答</b>'+said+'</div>':
   '<div class="f8c f8foe">'+fA+'<b class="f8r">❓ 問</b>'+said+'</div><div class="f8a"><i></i></div><div class="f8c f8you">'+fY+'<b class="f8r">💬 答</b>'+pk+'</div>'));var mv=H('div','moves');st.appendChild(mv);
  var play=function(){sayT(line)};ar.querySelector('#b8').onclick=play;
  shuf(q.o).forEach(function(o,i){var b=H('button','mv','<span class="mi">'+['⚔️','🔥','⚡','❄️'][i]+'</span>'+esc(o));b.dataset.o=o;b.onclick=function(){if(BUSY)return;var me=ar.querySelector('.fig.me'),dk=ar.querySelector('.fig.dk');
   if(o===q.o[0]){b.classList.add('ok');me.classList.add('dash');var sl=H('div','slash');ar.appendChild(sl);var dm=H('div','dmg','−1 💥');ar.appendChild(dm);setTimeout(function(){dk.classList.add('hurt')},180);
    HP8.e=Math.max(0,HP8.e-1);ar.querySelector('.fig.dk .bar i').style.width=(HP8.e/FHP*100)+'%';if(!HP8.e){HP8.ko++;setTimeout(function(){dk.classList.add('ko');ar.appendChild(H('div','ko8','K.O.!'))},400)}good(b)}
   else{b.classList.add('no');dk.classList.add('lunge');var sl=H('div','slash dark');ar.appendChild(sl);setTimeout(function(){me.classList.add('hurt')},200);HP8.m=Math.max(0,HP8.m-1);ar.querySelector('.fig.me .bar i').style.width=(HP8.m/8*100)+'%';R.pick=o;BUSY=true;tPause();later(function(){miss(o)},900)}};mv.appendChild(b)});
  setTimeout(play,HP8.b&&RK()&&ar.querySelector('.nw8')?1600:350)};
FB.q8=function(q,p){var A=q.rev?q.o[0]:q.a,B=q.rev?q.b:q.o[0];return {you:p?'<s>'+esc(p)+'</s>':'',body:'<div style="font-size:clamp(20px,2.6vh,26px);color:#C8FFD9">A：</div>'+gloss(A).replace('id="gls"','')+'<div style="font-size:clamp(20px,2.6vh,26px);color:#C8FFD9">B：</div>'+gloss(B),sl:[['',A],['m',B]]}};
/* 選 戰士（英文 對決 擂台 第一次 玩 先 選；〔🔄 換 戰士〕）：戰神之路 的 戰士 圖（下架的 不放） */
function warPick(done){var o=$('#wp'),sex=(ls('g3m_war')||'b').charAt(0)==='g'?'g':'b';
  function draw(){o.innerHTML='<div class="wpb"><h2>⚔ 選 你 的 戰士</h2><div class="wpt"><button data-sx="b" class="'+(sex==='b'?'on':'')+'">👦 男生 戰士</button><button data-sx="g" class="'+(sex==='g'?'on':'')+'">👧 女生 戰士</button></div><div class="wpg">'+
    WAR.filter(function(x){return x[0].charAt(0)===sex}).map(function(x){return '<button data-wr="'+x[0]+'" class="'+(ls('g3m_war')===x[0]?'on':'')+'"><img loading="lazy" src="../rpg/chars/'+x[0]+'.jpg" alt=""><span>'+'★★★★★'.slice(0,x[1])+'</span></button>'}).join('')+'</div></div>'}
  draw();o.classList.add('on');o.onclick=function(e){var b=e.target.closest&&e.target.closest('button');if(!b)return;if(b.dataset.sx){sex=b.dataset.sx;draw();return}if(b.dataset.wr){ls('g3m_war',b.dataset.wr);o.classList.remove('on');o.onclick=null;
    var im=document.querySelector('.fig.me img');if(im)im.src=warImg();if(done)done()}}}
/* 9 📋 資料表 小幫手（2026-10-26 第二十六次 第 1-6 點，老師選 A：照 老師 截圖 的 題目 出 類似 的 ＝ 讀 3 個人 的 自我介紹 ➜ 把 名字、歲數 拖進 資料表）：
   對話框 可以 點 🔊 聽（男生 男聲）；方塊 拖到 空格；放對 ＝ 格子 變 綠、唸 那個人 的 那一句（唸 的 時候 倒數 停住）；放錯 ＝ 答錯頁
   2026-10-26 第二十九次 第 8 點（老師）：(a) 每題 30 秒（_data.js t）(b) 先 點 空格 再 點 方塊 也 可以（先 點 方塊 再 點 空格 照舊）
   (c) 學生 常 找不到 方塊（在 最下面）➜ 老師 選 A：方塊 搬到 資料表 正上方（對話框 ➜ 一排 金色 大 方塊＋「👇 拖到 下面 的 空格」➜ 資料表）
   答錯／時間到 ➜ 先 停 在 題目 畫面（R.pre）：三個 人 各 一種 顏色 的 微微 發光 方框（答錯 的 那一位 ＝ 紅色，另外 兩位 藍、紫；名字 和 歲數 同一個 顏色；
   資料表 跟 對話框 同一個 人 同一個 顏色）➜ 先 框 資料表 那一列 題目 給 的 關鍵字（名字 或 歲數）➜ 箭頭 從 那個 字 拉到 上面 對話框 裡 同一個 字 ➜ 框出 答案 ➜ 約 4.6 秒 ➜ 綠底 答錯頁（老師 選 A） */
var K9C=['#FF6B6B','#5AA9FF','#C08BFF'];
function k9line(q,i,col){var c=q.c[i],t=esc(q.lines[i]);
  t=t.replace(c.t,'<span class="k9 k9n" data-k="n'+i+'" style="--k:'+col+'">'+esc(c.t)+'</span>');var j=t.lastIndexOf(' '+c.w);if(j>=0)t=t.slice(0,j+1)+'<span class="k9 k9a" data-k="a'+i+'" style="--k:'+col+'">'+c.w+'</span>'+t.slice(j+1+c.w.length);return t}
/* 2026-10-30 第三十四次 第 6 點：新題型（q.k）＝ 同樣 3 個人 的 自我介紹 ➜ 一列 資料表（na：Name 給了 ➜ 選 Age；an：Age 給了 ➜ 選 Name）➜ 四選一 */
function ren9k(q,st){var bb=H('div','bb9'),fm=H('div','fm9 fm9k'),ob=H('div','ob9'),c=q.c[q.r],na=q.k==='na';R.q9=null;
  q.c.forEach(function(x,i){var b=H('div','bub9','<span class="av9">'+(BOYS.indexOf(x.t)>=0?'👦':'👧')+'</span><div class="tx9">'+esc(q.lines[i])+'</div><button class="sp9" aria-label="聽">🔊</button>');
   b.querySelector('.sp9').onclick=function(){sayList([[BOYS.indexOf(x.t)>=0?'m':'',q.lines[i]]])};bb.appendChild(b)});
  fm.innerHTML='<div class="clip9"></div><div class="ft9">✏️ New Friends</div><table><tr><th>Name</th><th>Age</th></tr><tr>'+(na?'<td class="g9v"><span class="k9g">'+esc(c.t)+'</span></td><td><span class="sl9 k9q">?</span></td>':'<td><span class="sl9 k9q">?</span></td><td class="g9v"><span class="k9g">'+c.a+'</span></td>')+'</tr></table>';
  st.appendChild(bb);st.appendChild(fm);st.appendChild(ob);
  shuf(q.o).forEach(function(v){var b=H('button','o9',esc(v));b.onclick=function(){if(BUSY)return;var sl=fm.querySelector('.k9q');sl.textContent=v;
   if(v===q.o[0]){sl.classList.add('ok');b.classList.add('ok');BUSY=true;tPause();bb.children[q.r].classList.add('hl');sayList([[BOYS.indexOf(c.t)>=0?'m':'',q.lines[q.r]]],function(){if(R.q!==q)return;bb.children[q.r].classList.remove('hl');BUSY=false;good(fm)})}
   else{sl.classList.add('no');b.classList.add('no');BUSY=true;tPause();R.pick={r:q.r,v:v};later(function(){miss(v)},700)}};ob.appendChild(b)});
  /* 答錯／時間到：框 資料表 給 的 那個 字 ➜ 紅 箭頭 指到 對話框 同一個 字 ➜ 框出 答案（跟 原本 的 資料表 題 一樣）*/
  R.pre=function(pick,go){var r=q.r,col=[0,1,2].map(function(i){return i===r?K9C[0]:K9C[i===(r+1)%3?1:2]});
   q.c.forEach(function(x,i){bb.children[i].querySelector('.tx9').innerHTML=k9line(q,i,col[i])});
   var gv=fm.querySelector('.k9g');gv.classList.add('k9');gv.style.setProperty('--k',K9C[0]);
   var dk=bb.children[r].querySelector(na?'.k9n':'.k9a'),ans=bb.children[r].querySelector(na?'.k9a':'.k9n'),sl=fm.querySelector('.k9q');st.classList.add('k9on');gv.classList.add('k9go');
   later(function(){if(!dk){go();return}var a=gv.getBoundingClientRect(),b=dk.getBoundingClientRect(),x1=a.left+a.width/2,y1=a.top,x2=b.left+b.width/2,y2=b.bottom+4,mx=(x1+x2)/2+(x1<x2?-60:60),my=(y1+y2)/2;
    st.appendChild(H('div','ar9','<svg width="100%" height="100%"><defs><marker id="ah9" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#FF6B6B"/></marker></defs><path d="M'+x1+','+y1+' Q'+mx+','+my+' '+x2+','+y2+'" fill="none" stroke="#FF6B6B" stroke-width="7" stroke-linecap="round" marker-end="url(#ah9)"/></svg>'));
    later(function(){dk.classList.add('k9go');later(function(){if(ans)ans.classList.add('k9go','k9ans');sl.classList.remove('no');sl.classList.add('k9want');sl.textContent=q.o[0];later(go,1900)},900)},1100)},1000)}}
REN.q9=function(q,st){if(q.k){ren9k(q,st);return}var bb=H('div','bb9'),fm=H('div','fm9'),tw=H('div','tw9'),tl=H('div','tl9'),sel=null,ssl=null,done=0,need=q.bl.length;R.q9=null;
  q.c.forEach(function(c,i){var b=H('div','bub9','<span class="av9">'+(BOYS.indexOf(c.t)>=0?'👦':'👧')+'</span><div class="tx9">'+esc(q.lines[i])+'</div><button class="sp9" aria-label="聽">🔊</button>');
   b.querySelector('.sp9').onclick=function(){sayList([[BOYS.indexOf(c.t)>=0?'m':'',q.lines[i]]])};bb.appendChild(b)});
  var h='<div class="clip9"></div><div class="ft9">✏️ New Friends</div><table><tr><th></th><th>Name</th><th>Age</th></tr>';
  q.c.forEach(function(c,i){h+='<tr><td class="n9">'+(i+1)+'</td>'+(q.bl[i]==='n'?'<td><span class="sl9" data-r="'+i+'"></span></td><td class="g9v" data-r="'+i+'">'+c.a+'</td>':'<td class="g9v" data-r="'+i+'">'+esc(c.t)+'</td><td><span class="sl9" data-r="'+i+'"></span></td>')+'</tr>'});
  fm.innerHTML=h+'</table>';tw.appendChild(tl);tw.appendChild(H('div','tdn9','👇 拖到 下面 的 空格（也可以 先 點 空格，再 點 方塊）'));st.appendChild(bb);st.appendChild(tw);st.appendChild(fm);
  function want(r){return q.bl[r]==='n'?q.c[r].t:String(q.c[r].a)}
  function clr(){sel=null;ssl=null;[].forEach.call(tl.children,function(x){x.classList.remove('sel')});[].forEach.call(fm.querySelectorAll('.sl9'),function(x){x.classList.remove('sel')})}
  function put(t,sl){if(BUSY||!sl||sl.classList.contains('ok')||t.classList.contains('used'))return;var r=+sl.dataset.r,v=t.dataset.v;clr();
   if(v===want(r)){sl.textContent=v;sl.classList.add('ok');t.classList.add('used');done++;BUSY=true;tPause();var c=q.c[r];bb.children[r].classList.add('hl');
    sayList([[BOYS.indexOf(c.t)>=0?'m':'',q.lines[r]]],function(){if(R.q!==q)return;bb.children[r].classList.remove('hl');BUSY=false;if(done>=need)good(fm);else tGo()})}
   else{sl.textContent=v;sl.classList.add('no');BUSY=true;tPause();R.pick={r:r,v:v};later(function(){miss(R.pick)},700)}}
  shuf(q.tl).forEach(function(v){var t=H('div','tile9',esc(v));t.dataset.v=v;tl.appendChild(t);var sx,sy,mv=false;
   t.addEventListener('pointerdown',function(e){if(BUSY||t.classList.contains('used'))return;e.preventDefault();sx=e.clientX;sy=e.clientY;mv=false;t.classList.add('drag');try{t.setPointerCapture(e.pointerId)}catch(x){}});
   t.addEventListener('pointermove',function(e){if(!t.classList.contains('drag'))return;var dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>8)mv=true;t.style.transform='translate('+dx+'px,'+dy+'px) scale(1.08)'});
   t.addEventListener('pointerup',function(e){if(!t.classList.contains('drag'))return;t.classList.remove('drag');t.style.transform='';
    if(!mv){if(ssl){put(t,ssl);return}sel=t;[].forEach.call(tl.children,function(x){x.classList.toggle('sel',x===t)});return}
    t.style.visibility='hidden';var el=document.elementFromPoint(e.clientX,e.clientY);t.style.visibility='';var sl=el&&el.closest?el.closest('.sl9'):null;if(sl)put(t,sl)});
   t.addEventListener('pointercancel',function(){t.classList.remove('drag');t.style.transform=''})});
  /* 點 空格：手上 有 方塊 ＝ 放進去；沒有 ＝ 先 選 這個 空格（亮 藍框），再 點 方塊 */
  fm.addEventListener('click',function(e){var sl=e.target.closest&&e.target.closest('.sl9');if(!sl||BUSY||sl.classList.contains('ok'))return;if(sel){put(sel,sl);return}
   var on=ssl===sl;clr();if(!on){ssl=sl;sl.classList.add('sel')}});
  /* 答錯／時間到：先 在 題目 畫面 演 框框＋箭頭（R.pre），演完 才 到 綠底 答錯頁 */
  R.pre=function(pick,go){var r=pick&&pick.r!=null?pick.r:(function(){for(var i=0;i<3;i++){var s=fm.querySelector('.sl9[data-r="'+i+'"]');if(s&&!s.classList.contains('ok'))return i}return 0})();
   var col=[0,1,2].map(function(i){return i===r?K9C[0]:K9C[i===(r+1)%3?1:2]});
   q.c.forEach(function(c,i){bb.children[i].querySelector('.tx9').innerHTML=k9line(q,i,col[i]);var g=fm.querySelector('.g9v[data-r="'+i+'"]');if(g){g.innerHTML='<span class="k9" style="--k:'+col[i]+'">'+g.innerHTML+'</span>'}});
   var gv=fm.querySelector('.g9v[data-r="'+r+'"] .k9'),dk=bb.children[r].querySelector(q.bl[r]==='n'?'.k9a':'.k9n'),ans=bb.children[r].querySelector(q.bl[r]==='n'?'.k9n':'.k9a'),sl=fm.querySelector('.sl9[data-r="'+r+'"]');
   st.classList.add('k9on');if(gv)gv.classList.add('k9go');
   later(function(){if(!gv||!dk){go();return}var a=gv.getBoundingClientRect(),b=dk.getBoundingClientRect(),x1=a.left+a.width/2,y1=a.top,x2=b.left+b.width/2,y2=b.bottom+4,mx=(x1+x2)/2+(x1<x2?-60:60),my=(y1+y2)/2;
    var sv=H('div','ar9','<svg width="100%" height="100%"><defs><marker id="ah9" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#FF6B6B"/></marker></defs><path d="M'+x1+','+y1+' Q'+mx+','+my+' '+x2+','+y2+'" fill="none" stroke="#FF6B6B" stroke-width="7" stroke-linecap="round" marker-end="url(#ah9)"/></svg>');st.appendChild(sv);
    later(function(){dk.classList.add('k9go');later(function(){if(ans)ans.classList.add('k9go','k9ans');if(sl){sl.classList.add('k9want');sl.textContent=want(r)}later(go,1900)},900)},1100)},1000)};
};
FB.q9=function(q,p){if(q.k){var pv=typeof p==='string'?p:'';p={r:q.r,v:pv}}var bad=p&&p.r!=null?p.r:-1;return {you:q.k?(p.v?'<span>'+(q.k==='na'?esc(q.c[q.r].t)+' 的 Age：':'Age '+q.c[q.r].a+' 的 Name：')+'<s style="font-size:1.3em">'+esc(p.v)+'</s></span>':''):p&&p.r!=null?'<span>第 '+(p.r+1)+' 列 放了 <s style="font-size:1.3em">'+esc(p.v)+'</s></span>':'',rep:1,
  /* 答錯 的 那一列 ＝ 每個 字 下面 中文；另外 兩列 ＝ 一行 英文（畫面 不用 捲）*/
  body:'<div class="fb9">'+q.c.map(function(c,i){var hot=i===(bad<0?0:bad);return '<div class="q9f'+(hot?' hot':'')+'"><div style="font-size:clamp(22px,3vh,30px)">'+(i+1)+'. '+(BOYS.indexOf(c.t)>=0?'👦':'👧')+' Name: <b style="color:#FFE07A">'+esc(c.t)+'</b>　Age: <b style="color:#FFE07A;font-size:1.3em">'+c.a+'</b>'+(hot?'':'　<span style="color:#E8FFF0">'+esc(q.lines[i].replace(/'/g,'’'))+'</span>')+'</div>'+(hot?gloss(q.lines[i]):'')+'</div>'}).join('')+'</div>',
  sl:[0,1,2].map(function(i){return [BOYS.indexOf(q.c[i].t)>=0?'m':'',q.lines[i]]})}};
/* 10 🪂 空投 密碼箱：運輸機 飛過去 丟下 箱子 ➜ 降落傘 晃 ➜ 打開 對的 ＝ 寶物 噴出來；錯的 ＝ 💨「空的！」 */
REN.q10=function(q,st){var a=H('div','air','<div class="plane">✈️</div><div class="crates"></div>'),cr=a.querySelector('.crates');st.appendChild(hearBtn(function(){sayT(q.say)}));st.appendChild(a);
  shuf(q.o).forEach(function(c){var b=H('button','crt','<span class="fall"><span class="chu">🪂</span><span class="box3"><span class="t"></span><span class="f"><b>'+c+'</b></span></span></span>');b.dataset.c=c;b.onclick=function(){if(BUSY)return;
   if(c===q.o[0]){b.classList.add('open','ok');['💎','🪙','⭐','🪙','💎'].forEach(function(x,k){var lt=H('div','loot2',x);lt.style.setProperty('--dx',((k-2)*48)+'px');lt.style.animationDelay=(k*.06)+'s';b.querySelector('.fall').appendChild(lt)});good(b)}
   else{b.classList.add('open','no');var s=H('div','smk','💨<b>空的！</b>');b.appendChild(s);R.pick=c;BUSY=true;tPause();later(function(){miss(c)},800)}};cr.appendChild(b)});
  setTimeout(function(){sayT(q.say)},1300)};
FB.q10=function(q,p){return {you:p?'<s style="font-size:1.6em">'+esc(p)+'</s>':'',body:'<div style="font-size:clamp(60px,11vh,110px);color:#FFE07A;letter-spacing:.1em">'+q.code+'</div>'+gloss(q.en),say:q.say}};
lobby();
/* ══ 2026-10-26 第二十九次 第 1 點：🏫 三年級 課堂複習 1、2、3（＋三年級 複習）在〔⚡ 現場任務〕開（老師 C31 說「對」）══
   只有 網址 ?live=0304（現場任務 平板 自己 帶 過來）才 是 課堂 模式；老師 大螢幕 寫 Firebase rooms/0304/cr ＝ {on, t, set:'c1'…'g3m', gs:[遊戲], m:'self'|'sync', q, deck:[[遊戲,第幾題]…]}
   〔🙋 學生 自己 答〕＝ 大廳 只 剩 老師 選 的 遊戲（沒有 25／50 題、沒有 🏠），每個人 自己 玩；進度 寫 crp/5碼（老師 看 每一個 座號 答了 幾題、對 幾題）
   〔👥 全班 同步〕＝ 老師 按〔▶ 下一題〕全班 一起 做 同一題；答完 ＝「✅ 答好了，等 老師」；答案 寫 cra/編號/5碼（老師 看 幾個人 答、幾個人 對）
   成績：g3gm_c1-q1…（課堂複習 1）、g3gm_g3m-q1…（三年級 複習）➜ 老師看板〔🏫 課堂複習〕大表；在家複習 沒有 這個 模式 */
var CR=null;GM.forEach(function(g){g.B0=g.B});
function crSet(){return CR&&CR.cfg?CR.cfg.set:'g3m'}
function crName(){var s=crSet();if(s==='g3m')return '📝 三年級 複習';for(var i=0;i<CSETS.length;i++)if(CSETS[i][0]===s)return '🏫 '+CSETS[i][1].replace('三年級 ','');return s}
function crWait(t,extra){var o=$('#crw');if(!t){o.classList.remove('on');return}o.innerHTML='<div class="crb"><div class="cri">🏫</div><div class="crt">'+t+'</div>'+(extra||'')+'</div>';o.classList.add('on')}
/* 2026-10-27 第三十二次（老師：現場任務 試過 完全 失敗，學生 看不到 任務）：學生 如果 已經 在 這一頁（不是 從 ⚡ 現場任務 進來 的），
   登入 以後 每 2 秒 看 一次 自己 班 的 rooms/0班/cr：老師 一 開 ＝ 蓋 一整頁「老師 開了 …！馬上 進去」➜ 自己 換到 ?live=0班（不用 再 掃 QR）*/
function crAuto(){if(/[?&]live=/.test(location.search)||typeof LDB==='undefined'||!LDB.on())return;var room='',stop=null,go=0;
  setInterval(function(){var id=typeof SCID!=='undefined'?String(SCID||''):'';var r=/^\\d{5}$/.test(id)?'0'+id.slice(0,3):'';if(r===room)return;room=r;if(stop){stop();stop=null}if(!r)return;
    stop=LDB.poll('rooms/'+r+'/cr',2000,function(v){if(go||!v||!v.on||Date.now()-(+v.t||0)>4*36e5)return;go=1;var o=document.createElement('div');o.id='crgo';
      o.innerHTML='<div class="crgob"><div style="font-size:clamp(70px,12vh,120px)">📢</div><div class="crgot">老師 開了 三年級 複習！</div><div style="font-size:28px">⏳ 馬上 進去…</div></div>';document.body.appendChild(o);
      setTimeout(function(){location.replace(location.pathname+'?live='+r)},1400)})},2000)}
function crInit(){var m=/[?&]live=(\\d{4})/.exec(location.search);if(!m){crAuto();return}CR={room:m[1],t:0,cfg:null,acc:{},n:0,ok:0,q:-9};document.body.classList.add('crm');
  if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();crInit2()});return}crInit2()}
function crInit2(){crWait('⏳ 等 老師 開始 課堂複習…');if(typeof LDB==='undefined'||!LDB.on()){crWait('📶 現場任務 還沒 開（老師 要 先 設定 Firebase）');return}LDB.poll('rooms/'+CR.room+'/cr',900,crOn)}
function crBanks(set){GM.forEach(function(g){g.B=set==='g3m'||!CB[set]?g.B0:CB[set][g.id]})}
function crOn(v){if(!CR)return;XLV.cfg(v);if(!v||!v.on){if(CR.cfg){crFlush();CR.cfg=null;R=null;stopSay();cancelAnimationFrame(TM.raf);$('#game').hidden=true;$('#endv').hidden=true;$('#fb').classList.remove('on');
      crWait('✅ 老師 結束 了，謝謝！','<a class="crbk" href="../live/index.html">⬅ 回 現場任務</a>')}else crWait('⏳ 等 老師 開始 課堂複習…');return}
  if(v.t!==CR.t){if(CR.cfg)crFlush();CR.t=v.t;CR.cfg=v;CR.acc={};CR.n=0;CR.ok=0;CR.q=-9;CR.sc=0;crBanks(v.set);$('#lobby h1').textContent=crName();
    if(v.m==='self'){crWait('');R=null;$('#qx').hidden=false;lobby();if(/^[xn]\\d+$/.test(v.set||''))XLV.intro(Math.round((+v.d||0)/60000),function(){})}else{$('#lobby').hidden=true;crWait('⏳ 等 老師 出 第 1 題…')}}
  if(v.m==='sync'&&v.q!==CR.q){CR.q=v.q;if(v.q>=0&&v.deck&&v.deck[v.q])crQ(v.deck[v.q]);else if(v.q>=0)crWait('⏳ 等 老師…')}}
/* 全班 同步：一題 ＝ 一次 小 回合（答完 不 自己 走，等 老師 按 下一題）*/
function crQ(d){var i=-1;GM.forEach(function(g,j){if(g.id===d[0])i=j});if(i<0)return;var q=GM[i].B[d[1]];if(!q)return;crWait('');
  if(R&&R.crs&&R.k<R.qs.length&&R.Q.length<=R.k)qRec(0,null);   /* 上一題 還沒 答 老師 就 換 ＝ 算 答錯（時間 到 沒有 選 ＝ 答錯，老師 第二十九次 ③ A）*/
  if(R&&R.crs)crKeep();
  QID++;stopSay();cancelAnimationFrame(TM.raf);$('#fb').classList.remove('on');document.body.classList.add('ing');G=GM[i];FHP=4;
  R={i:i,qs:[q],k:-1,score:CR.sc||0,streak:CR.st||0,res:[],wrong:[],Q:[],t0:Date.now(),crs:1};
  $('#lobby').hidden=true;$('#endv').hidden=true;$('#game').hidden=false;$('#gnm').textContent=G.ic+' '+G.nm+'　第 '+(CR.q+1)+' ／ '+CR.cfg.deck.length+' 題';$('#how').textContent=G.how;$('#sc').textContent=String(R.score);
  $('#qx').hidden=true;$('#wsw').hidden=G.id!=='q8';$('#stage').innerHTML='';var go=function(){next()};if(G.id==='q8'&&!ls('g3m_war')&&!rpHero())warPick(go);else go()}
function crKeep(){if(!R||!R.Q.length)return;var a=CR.acc[G.id]=CR.acc[G.id]||[];R.Q.forEach(function(x){a.push(x)});R.Q=[]}
function crDone(){CR.sc=R.score;CR.st=R.streak;var ok=R.Q.length?R.Q[0][0]:0;crKeep();R.k=R.qs.length;
  if(typeof LDB!=='undefined'&&SCID)LDB.set('rooms/'+CR.room+'/cra/'+CR.t+'_'+CR.q+'/'+SCID,ok?1:0);
  $('#game').hidden=true;crWait(ok?'✅ 答對 了！<br><small>等 老師 按 下一題…</small>':'💪 答好 了！<br><small>等 老師 按 下一題…</small>')}
/* 送 成績：每一種 遊戲 一筆（同步 模式 結束、換 一場 的 時候）*/
function crFlush(){if(!CR||!CR.cfg)return;if(R&&R.crs){if(R.Q.length<=R.k&&R.k<R.qs.length)qRec(0,null);crKeep()}
  if(R&&!R.crs&&!R.sent&&R.Q&&R.Q.length)rec1();
  Object.keys(CR.acc).forEach(function(id){var Q=CR.acc[id];if(!Q.length||typeof scLive!=='function'||!scLive())return;var g=GM.filter(function(x){return x.id===id})[0],u=SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    var QQ=scGet('q')||[];QQ.push({id:SCID,set:'g3gm_'+CR.cfg.set+'-'+id,name:crName()+'｜'+g.ic+' '+g.nm,m:'g',qs:Q,raw:0,fix:0,mp:0,mw:0,sec:0,src:'school',dev:SCDEV,u:u,t:Date.now()});scPut('q',QQ.slice(-200))});
  CR.acc={};try{scFlush()}catch(e){}}
/* 自己 答：進度 給 老師 看（答了 幾題、對 幾題、現在 玩 哪一種）*/
function crProg(ok){if(!CR||!CR.cfg||CR.cfg.m!=='self'||typeof LDB==='undefined'||!SCID)return;var P=CR.pn=CR.pn||{},c=P[SCID]=P[SCID]||{n:0,ok:0};c.n++;if(ok)c.ok++;CR.n++;if(ok)CR.ok++;xPub(c)}   /* 2026-10-30 第三十四次：兩人 一台 各 算 各 的＋分數 s＋另一個 人 p（大螢幕 即時 排行榜） */
function xPub(c){if(!CR||!CR.cfg||!SCID)return;c=c||(CR.pn||{})[SCID]||{n:0,ok:0};var o={n:c.n,ok:c.ok,g:G?G.id:'',s:R&&R.x?Math.min(100,Math.round((R.score||0)*10)/10):0};if(DUO)o.p=DUO.id[1-DUO.cur];XLV.prog(CR.room,CR.t,SCID,o)}
/* 2026-10-30 第三十四次 第 10、12-(4) 點：老師 大螢幕 時間 到 ➜ 答了 幾題 就 送 幾題（沒 答 的 0 分；兩人 一台 兩個 人 都 送）*/
window.xForce=function(){if(!R||!R.x||R.crs||R.fz)return false;var sent=false;QID++;stopSay();try{decClose()}catch(e){}cancelAnimationFrame(TM.raf);TM.run=false;BUSY=true;$('#fb').classList.remove('on');
  var one=function(){R.fz=1;if(R.Q.length){var a=rec1();if(a)sent=true}xDel(R.x);xPub()};
  if(DUO){var D=DUO;[0,1].forEach(function(k){if(D.done[k])return;R=D.R[k];SCID=D.id[k];D.done[k]=1;one()});DUO=null;SCID=D.id[0];document.body.classList.remove('duoon')}else one();
  $('#game').hidden=true;return sent};
/* 自己 答 的 大廳：只 剩 老師 選 的 遊戲 */
/* 2026-10-27 第三十二次 3-(3)（老師 A）：📝 25／50 題 挑戰 只 在 英文課〔⚡ 現場任務〕開：平常 打開 這一頁 沒有 那 兩顆；老師 開了 x25／x50 ＝ 只 有 那一顆（可以 繼續 上次 的）、沒有 遊戲 格子 */
var lobby0=lobby;lobby=function(){lobby0();if(!CR||!CR.cfg){$('#xrow').innerHTML='<div class="xoff">📝 25 題／50 題 挑戰：英文課 老師 在〔⚡ 現場任務〕開</div>';return}
  var xm=/^([xn])(\\d+)$/.exec(CR.cfg.set||'');if(xm){[].forEach.call(document.querySelectorAll('#xrow [data-x],#xrow [data-xr]'),function(b){var n=b.getAttribute('data-x')||b.getAttribute('data-xr'),bk=b.getAttribute('data-bk')||'A';var w=b.closest('.xbw')||b;if(n!==xm[2]||bk!==(xm[1]==='n'?'B':'A'))w.style.display='none'});   /* 2026-10-29：n25／n50 ＝ 新 25／新 50（題庫 B）*/
    [].forEach.call(document.querySelectorAll('#grid .gc'),function(b){b.style.display='none'});$('#xrow').insertAdjacentHTML('afterbegin',duoRow());return}
  $('#xrow').innerHTML='';var gs=CR.cfg.gs||[];
  [].forEach.call(document.querySelectorAll('#grid .gc'),function(b){var g=GM[+b.dataset.g];if(gs.indexOf(g.id)<0)b.style.display='none'})};

/* ══ 2026-10-30 第三十四次 第 1～4 點：🏠 三年級 25 題 闖關（回家 練習；只有 home.html 才 開：window.HOME25）══
   老師 的 決定：每個 年級 一個 專屬 網址＋QR（放 總首頁、老師看板）➜ 掃了 ➜ 打 班級號碼＋密碼 ➜ 馬上 第 1 題；
   題目 ＝ 25 題 挑戰 的 題庫 A 裡「全新 題」（跟 兩個 年級 期中考卷 100% 不一樣、不用 類似 題）、每次 先 出 沒 做過 的（XBK 'H'：存 進度、做過 的、最高分 都 分開，成績 g?gm_…-h25）；
   第一頁 大字「老師依課本、習作自己設計的練習題。」（可以 給 家長 看）；不限 總 時間（每一題 自己 的 倒數 照舊）；答對 唸完 正確 答案 才 下一題（第一批 規則）；不 自動 跳進 現場任務 */
if(window.HOME25){XBK='H';document.title='三年級 25 題 闖關';crAuto=function(){};
 var HMS='老師依課本、習作自己設計的練習題。';
 var hmEl=function(){var o=document.getElementById('hm25');if(!o){o=document.createElement('div');o.id='hm25';document.body.appendChild(o)}return o};
 var hmBanner=function(){try{var h=SCH.box().querySelector('h2');if(h)h.innerHTML='📝 三年級 25 題 闖關<br><span style="color:#FFE07A">'+HMS+'</span>'}catch(e){}};
 var hmGo=function(){if(typeof SCON!=='undefined'&&SCON&&!SCID){scLogin(function(){SCH.close();scBar();hmGo()});hmBanner();return}XBK='H';hmEl().hidden=true;if(xLoad(25))resumeX(25);else startX(25)};
 var hmCover=function(){XBK='H';$('#lobby').hidden=true;var o=hmEl(),v=xLoad(25),b=ls('g3m_bxh25');
   o.innerHTML='<div class="hmw"><div class="hmt">📝 三年級 25 題 闖關</div><div class="hms">'+HMS+'</div>'+
    '<div class="hmk"><span>🔓 句子 解碼 8 題</span><span>🎮 10 種 遊戲 17 題</span><span>⏳ 不限 時間</span><span>🔁 每次 題目 不一樣</span></div>'+
    '<div class="hmb">'+(v?'<button id="hmgo">▶ 繼續 第 '+(v.Q.length+1)+' 題<small>已經 做 了 '+v.Q.length+' ／ 25 題</small></button><button class="b2" id="hmnew">🔄 重新 開始</button>':'<button id="hmgo">▶ 開始 第 1 題</button>')+'</div>'+
    (b?'<div class="hmbest">🏆 我的 最高 '+b+' 分</div>':'')+'</div>';o.hidden=false;
   $('#hmgo').onclick=hmGo;var nw=$('#hmnew');if(nw)nw.onclick=function(){xDel(25);hmGo()}};
 var lobbyH=lobby;lobby=function(){lobbyH.apply(this,arguments);hmCover()};
 setTimeout(function(){if(typeof SCON!=='undefined'&&SCON&&!SCID)hmGo()},50)}
if(!/[?&]live=/.test(location.search))lobby();   /* 第三十二次：一 打開 就 照 新 的 大廳（沒有 25／50 題） */
crInit();

`;

/* 2026-10-30 第三十四次 第 9 點：解碼 縮寫 動畫 要 唸 的「What is」「What’s」「I am」「I’m」＝ 三年級 教學 網站（G3 - L1 + L2）同一個 聲音 已經 做好 的 檔 ➜ 複製 到 audio/x/（這裡 沒有 語音 模型；以後 重做 語音 也 照 這張 表）。
   教學、縮寫 動畫 要 唸 的 句子 一句 都 不可以 沒有 語音檔 ➜ build 失敗 */
const BORROW = ['what is', "what's", 'i am', "i'm"], AK = t => String(t).replace(/[’]/g, "'").replace(/[=＝≠➜→⇒…＿_　]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const rdAud = f => { const c = { window: {} }; require('vm').runInNewContext(fs.readFileSync(f, 'utf8'), c); return Object.assign({}, ...Object.values(c.window).filter(x => x && typeof x === 'object')); };
const MYA = AUD ? rdAud(path.join(__dirname, 'audio', 'aud.js')) : {}, G3A = rdAud(path.join(__dirname, '..', 'G3 - L1 + L2', 'audio', 'aud.js')), BX = {};
BORROW.forEach(k => { const f = G3A[k]; if (!f) { console.error('✗ 三年級 教學 網站 沒有 語音檔：' + k); process.exit(1); } fs.mkdirSync(path.join(__dirname, 'audio', 'x'), { recursive: true });
  fs.copyFileSync(path.join(__dirname, '..', 'G3 - L1 + L2', 'audio', f[0]), path.join(__dirname, 'audio', 'x', f[0])); BX[k] = ['x/' + f[0], f[1]]; });
const BORROWJS = 'window.ENAUD=window.ENAUD||{};(function(X){for(var k in X)if(!ENAUD[k])ENAUD[k]=X[k]})(' + JSON.stringify(BX) + ');';
{ const need = []; ['A', 'B'].forEach(b => [1, 2].forEach(u => D.LES[b][u].s.forEach(S => { if (S.eq) need.push([S.eq.a.say], [S.eq.b.say]); else need.push([S.en, S.v]); })));
  [D.DTUT.demo, D.DTUT.ord].concat(D.DTUT.quiz).forEach(q => need.push([q.en, q.v]));
  const miss = need.filter(([t, v]) => AUD && !MYA[(v === 'm' ? 'm:' : '') + AK(t)] && !MYA[AK(t)] && !BX[AK(t)]).map(x => x[0]); if (miss.length) { console.error('✗ 解碼 動畫 沒有 語音檔：' + miss.join('、')); process.exit(1); } }
const html = `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>三年級 複習</title>
<style>${CSS}${DECX.CSS}</style></head>
<body>
${CL.home(3, '../', 'school')}
${BODY}
<script src="../live/fb.js"></script><script>${fs.readFileSync(path.join(__dirname, '..', 'live', '_db.js'), 'utf8')}</script><script>${fs.readFileSync(path.join(__dirname, '..', 'live', '_xlive_rt.js'), 'utf8')}</script>
${AUD ? '<script src="audio/aud.js"></script><script src="audio/w/aud.js"></script>' : ''}${['m1', 'm2'].filter(d => fs.existsSync(path.join(__dirname, 'audio', d, 'aud.js'))).map(d => '<script src="audio/' + d + '/aud.js"></script>').join('')}
<script>${BORROWJS}</script>
<script>${JS}</script>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
/* 2026-10-30 第三十四次 第 1～4 點：🏠 三年級 25 題 闖關 的 專屬 網址（同一個 網頁，多 一個 HOME25）*/
fs.writeFileSync(path.join(__dirname, 'home.html'), html.replace('<title>三年級 複習</title>', '<title>三年級 25 題 闖關</title>').replace('<script>' + JS + '</script>', '<script>window.HOME25=1</script><script>' + JS + '</script>'));
console.log('g3mid/index.html：10 種遊戲、題庫 ' + D.GAMES.map(g => g.B.length).reduce((a, b) => a + b) + ' 題' + (AUD ? '' : '（還沒有語音檔，先用瀏覽器語音）'));
