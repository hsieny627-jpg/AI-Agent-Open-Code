/* live/_build.js — ⚡ 現場任務（2026-10-17 老師看完 C9（第八次）；規格 live/CLAUDE.md）
 *   node live/_build.js  ➜  live/host.html（老師大螢幕）、live/index.html（學生平板）、live/setup.html（大字版 Firebase 設定頁）
 * 2026-10-18 第十一次 重做：🏆 經典搶答＋10 種、🔥 挑戰題（CHAL）、等人 的 小遊戲（WORDS、_mini.js）、QR Code（score/qr.js）、不用 打 號碼（0＋班級）
 * 題目：live/_qbank.js（2026-10-18 第十二次：老師 選 三／四年級；10 種 句型遊戲 ＋ Review 1 遊戲 全部；錯題 分析 的 逐字中文、翻譯、語音 ＝ score/_bank.js 同一份）。同步 ＝ 輪詢（live/_db.js）。
 * 即時資料：Firebase Realtime Database（live/fb.js 的 LIVE_DB；空白 ＝ 關著）。老師密碼：成績系統同一個（{a:'pw'}）。獎勵：{a:'rpgb'}（要老師密碼）。 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), R = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const CL = require('../score/_client.js');
const strip = h => String(h == null ? '' : h).replace(/\s+/g, ' ').trim();
/* ── 題目（2026-10-18 第十二次：老師 自己 選 三／四年級；10 種 句型遊戲 ＋ Review 1 遊戲 全部；live/_qbank.js）── */
const QB = require('./_qbank.js')(), BK = require('../score/_bank.js');
/* 🔥 挑戰題（老師 第十一次：拼字、排句子 ✖2）：🔤 拼字 ＝ 這個 年級 學過 的 字（只要 英文 字母、3～10 個）；🧩 排句子 ＝ 那個 年級 🧩 語序大挑戰 */
const G3D = require(path.join(ROOT, 'G3 - L1 + L2/_data.js')), G4D = require(path.join(ROOT, 'sentences/_data.js'));
const w3 = (en, zh, ic) => ({ en, zh, ic });
const NUM = [['one', '一', '1️⃣'], ['two', '二', '2️⃣'], ['three', '三', '3️⃣'], ['four', '四', '4️⃣'], ['five', '五', '5️⃣']].concat(G3D.SUB.age.basic || G3D.SUB.age);
const WORDS = {
  3: NUM.map(x => w3(x[0], x[1], x[2])).concat([w3('name', '名字', '🏷️'), w3('old', '…歲', '🎂'), w3('what', '什麼', '❓'), w3('how', '怎樣', '🤔'), w3('your', '你的', '👉'), w3('you', '你', '🫵')]),
  4: [].concat(G4D.SUB.fam.basic, G4D.SUB.fam.adv, G4D.SUB.job4.basic, G4D.SUB.job4.adv).map(x => w3(x[0], x[1], x[2])).concat([w3('who', '誰', '❓'), w3('she', '她', '👧')])
};
const DIR = { 3: 'G3 - L1 + L2', 4: 'sentences' };
[3, 4].forEach(g => { const seen = new Set(); WORDS[g] = WORDS[g].filter(w => typeof w.en === 'string' && /^[a-z]{3,10}$/.test(w.en) && !seen.has(w.en.toLowerCase()) && seen.add(w.en.toLowerCase()))
  .map(w => Object.assign(w, { au: BK.enrich(DIR[g], { q: w.en, o: [w.zh], sp: w.en }).au || '' })); });
const CHAL = { 3: { sp: WORDS[3], or: QB.GR['3sg3'].qs }, 4: { sp: WORDS[4], or: QB.GR['4sg3'].qs } };
[3, 4].forEach(g => { if (CHAL[g].sp.length < 10 || CHAL[g].or.length < 8) throw new Error('挑戰題 太少：' + g); });
const CSS = R('_live.css');
const head = (t, extra) => `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${t}</title>
<style>
@font-face{font-family:Andika;src:url(../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
${CSS}${extra || ''}
</style></head>`;
const RT = R('_db.js') + '\n' + R('_common.js');
/* ── 老師大螢幕 ── */
const CER = fs.readFileSync(path.join(ROOT, 'score/_cer.css'), 'utf8') + fs.readFileSync(path.join(ROOT, 'rpg/_fx.css'), 'utf8'), CERRT = fs.readFileSync(path.join(ROOT, 'score/_cer_rt.js'), 'utf8') + fs.readFileSync(path.join(ROOT, 'rpg/_fx_rt.js'), 'utf8');   /* 2026-10-20 第十四次：特效引擎＋自己畫的 金幣（大螢幕） */
const J = o => JSON.stringify(o).replace(/</g, '\\u003c');
/* ── 老師大螢幕 ── 按鈕 永遠 在 右下角 同一個 位置（#hgo）；沒有 音樂、音效 */
const host = head('現場任務 大螢幕', CER) + `<body class="host">
<script src="../score/url.js"></script><script src="fb.js"></script><script src="../score/qr.js"></script>
<div id="net" class="net" hidden>📶 網路 不穩：重新 連線 中…（不用 按 任何 東西）</div>
<div id="hstp" class="hstp" hidden></div><div id="hqrc" class="sqrc hq2" hidden><div class="qrb"></div><span>📱 掃 我 登入</span></div>
<div class="scr" id="hpw" hidden><div class="in center"><h1>⚡ 現場任務</h1><div class="note">老師 密碼（跟 老師看板 一樣）</div>
 <input type="password" id="pw" autocomplete="current-password"><button id="pwgo" class="big">🔑 進去</button><div id="pwm" class="note"></div>
 <div class="note">還沒 設定 Firebase？➜ <a href="setup.html">大字版 設定頁</a></div></div></div>
<div class="scr" id="hset" hidden><div class="in"></div></div>
<div class="scr" id="hlob" hidden><div class="lob">
 <div class="lobl"><div class="lqrt">📱 學生 用 平板 掃 這個</div><div id="lqr" class="lqr"></div><div id="lurl" class="lurl"></div><button id="lcopy" class="ghost">📋 複製 網址</button></div>
 <div class="lobr"><div id="lgame" class="lgame"></div><div id="llog"></div>
  <div class="lcnt">👥 已經 加入 <b id="lcnt">0</b> 人<span class="note">（座號 亮 ＝ 已經 進來）</span></div><div id="lpl"></div>
  <div class="row cen"><button id="go" class="big go">▶ 開始</button><button id="close" class="ghost">✕ 結束 這一場</button></div><div id="lmsg" class="note big2"></div></div></div></div>
<div class="scr" id="hhow" hidden><div class="in center" id="hhw"></div></div>
<div class="scr" id="hq" hidden><div class="qwrap"><div class="qmain"><div class="qtop"><span id="qn"></span><span id="qtm" class="qtm"><span id="qring" class="ring"><b id="qt">20</b></span></span><span id="qa"></span></div>
 <div id="qq" class="qq"></div><div id="qo"></div><div id="qh" class="qh" hidden></div><div id="qs"></div></div><div class="qside" id="gv"></div></div>
 <div class="hbar"><span id="hctl2"><button id="hpz" class="ghost">⏸ 暫停</button><button id="hint" class="ghost">😆 干擾：開</button></span><button id="hsay" class="ghost hsay">🗣 自動 唸：開</button><button id="hgo" class="big go"></button></div></div>
<div class="scr" id="hlb" hidden><div id="lb" class="lb on"></div><div class="hbar"><button id="hgo2" class="big go"></button></div></div>
<div class="scr" id="hend" hidden><div id="cerw"><div class="cx" id="cerst"></div></div><div class="hbar"><span id="cstn" class="note"></span><button id="tana" class="big go">📊 全班 錯題 分析 ➜</button></div></div>
<div class="scr" id="hana" hidden><div class="in" id="hanab"></div><div class="hbar"><span id="erw" class="note"></span><span id="gm" class="note"></span><button id="tcer" class="ghost">🏆 再看 頒獎</button><button id="close2" class="ghost">✕ 結束 這一場</button><button id="give" class="big go">🎁 發獎勵 ＋ 記 練習次數</button></div></div>
<script>var BASE='../',GR=${J(QB.GR)},LIST=${J(QB.LIST)},CHAL=${J(CHAL)},ICON=${J(QB.ICON)};
${RT}
${CERRT}
${R('_host_rt.js')}
</script></body></html>`;
/* ── 學生平板 ── 最上面 永遠 一行 大字：現在 要 做 什麼（#now）；沒有 任何 音效 */
const stu = head('現場任務') + `<body class="stu">
<script>window.SCLIVE=1;</script>
${CL.home(0, '../', 'school')}
<script src="fb.js"></script><script src="../score/qr.js"></script>
<div id="stp" class="stpw" hidden></div><div id="now" class="now"></div><div id="net" class="net" hidden>📶 網路 不穩：重新 連線 中…</div>
<div class="scr" id="soff" hidden><div class="in center"><div class="big2">⚡ 現場任務 還沒有 開</div><div class="note">（老師 設定好 就 可以 玩）</div></div></div>
<div class="scr" id="sout" hidden><div class="in center"><h1>🔑 登入</h1><div class="big2">輸入：你的 班級號碼〔共 5 碼〕</div><button id="sIn" class="big go">🔢 輸入</button></div></div>
<div class="scr" id="sintro" hidden><div class="in center" id="sinb"></div></div>
<div class="scr" id="swait" hidden><div class="sqw"><div id="wbody" class="wbody"></div></div></div>
<div class="scr" id="show" hidden><div class="in center" id="shw"></div></div>
<div class="scr" id="sq" hidden><div class="sqw"><div class="qtop"><span id="sqn"></span><span class="qtm"><span id="sqring" class="ring sm"><b id="sqt">20</b></span></span></div>
 <div id="sqq" class="sqq"></div><div id="sqh" class="sqh" hidden></div><div id="sqm" class="note sqm"></div><div id="sqo"></div><div id="sqr"></div><button id="kch" class="kch" hidden>📣 加油！</button></div></div>
<div class="scr" id="send" hidden><div class="in"><h1>🏁 任務 完成！</h1><div id="ew"></div></div></div>
<div id="sqrc" class="sqrc" hidden><div class="qrb"></div><span>📱 掃 我<br>登入</span></div>
<div id="res"></div><div id="gift"></div><div id="fxo"></div>
<script>var BASE='../',MINIB=${J(QB.MINI)};
${RT}
${R('_mini.js')}
${R('_stu_rt.js')}
</script></body></html>`;
fs.writeFileSync(path.join(__dirname, 'host.html'), host);
fs.writeFileSync(path.join(__dirname, 'index.html'), stu);
if (!fs.existsSync(path.join(__dirname, 'fb.js'))) fs.writeFileSync(path.join(__dirname, 'fb.js'), "/* live/fb.js — ⚡ 現場任務的 Firebase Realtime Database 網址（老師照大字版 live/setup.html 做好，把網址交給 Claude 貼在兩個引號中間）\n * 空白 ＝ 現場任務關著。這裡只放網址，沒有密碼、沒有姓名。 */\nwindow.LIVE_DB = '';\n");
require('./_setup_page.js');
console.log('live ok：題目 三年級 ' + QB.LIST[3].length + ' 組、四年級 ' + QB.LIST[4].length + ' 組；挑戰題 ' + CHAL[3].sp.length + '／' + CHAL[4].sp.length + ' 字；大螢幕 ' + Math.round(host.length / 1024) + ' KB、平板 ' + Math.round(stu.length / 1024) + ' KB');
