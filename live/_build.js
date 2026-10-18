/* live/_build.js — ⚡ 現場任務（2026-10-17 老師看完 C9（第八次）；規格 live/CLAUDE.md）
 *   node live/_build.js  ➜  live/host.html（老師大螢幕）、live/index.html（學生平板）、live/setup.html（大字版 Firebase 設定頁）
 * 題目：兩個句型網站的四選一（⚡ 閃電四選一 G1、👑 魔王 G10、✏️ 填空高手 G8）＋ Review 1 的閃電四選一；正解一律在 o[0]，大螢幕每一題重洗。
 * 即時資料：Firebase Realtime Database（live/fb.js 的 LIVE_DB；空白 ＝ 關著）。老師密碼：成績系統同一個（{a:'pw'}）。獎勵：{a:'rpgb'}（要老師密碼）。 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), R = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const CL = require('../score/_client.js');
const strip = h => String(h == null ? '' : h).replace(/\s+/g, ' ').trim();
/* ── 題目 ── */
function fromGames(file, nm) {
  const B = require(path.join(ROOT, file)), out = [];
  const add = (t, list) => { const qs = (list || []).filter(c => c && c.o && c.o.length === 4).map(c => ({ q: strip(c.q != null ? c.q : (c.b === '___' ? '' : c.b + ' ') + '＿＿' + (/^[.?!,'’]/.test(c.a) ? '' : ' ') + c.a + (c.zh ? '<br><small>' + c.zh + '</small>' : '')), o: c.o.map(strip), h: strip(c.h) }));
    if (qs.length) out.push({ nm: nm + t, qs }); };
  add('⚡ 閃電四選一', B.G1); add('✏️ 填空高手', B.G8); add('👑 魔王挑戰', B.G10);
  return out;
}
const BANK = { 3: fromGames('G3 - L1 + L2/_game_data.js', '三年級 '), 4: fromGames('sentences/_game_data.js', '四年級 ') };
/* 每一組：四個選項不可以重複、正解不可以空白（不然大螢幕會出錯） */
[3, 4].forEach(g => BANK[g].forEach(b => b.qs.forEach(q => { if (new Set(q.o).size !== 4 || !q.o[0]) throw new Error('現場任務題目有重複選項：' + q.q); })));
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
const host = head('現場任務 大螢幕') + `<body class="host">
<script src="../score/url.js"></script><script src="fb.js"></script>
<div class="scr" id="hpw" hidden><div class="in center"><h1>⚡ 現場任務</h1><div class="note">老師 密碼（跟 老師看板 一樣）</div>
 <input type="password" id="pw" autocomplete="current-password"><button id="pwgo" class="big">🔑 進去</button><div id="pwm" class="note"></div>
 <div class="note">還沒 設定 Firebase？➜ <a href="setup.html">大字版 設定頁</a></div></div></div>
<div class="scr" id="hset" hidden><div class="in"></div></div>
<div class="scr" id="hlob" hidden><div class="in center"><div class="note big2">學生 打開 <b>⚡ 現場任務</b>（首頁 的 大按鈕）➜ 輸入：</div><div id="code" class="code"></div><div id="lgame" class="note big2"></div>
 <div class="note big2">👥 已經 加入 <b id="lcnt">0</b> 人</div><div id="lpl" class="pls"></div><button id="go" class="big">▶ 開始</button><div id="lmsg" class="note"></div><button id="close" class="ghost">✕ 關掉 房間</button></div></div>
<div class="scr" id="hq" hidden><div class="qwrap"><div class="qmain"><div class="qtop"><span id="qn"></span><span class="qtm">⏱ <b id="qt">15</b></span><span id="qa"></span></div><div class="qbar"><i id="qbar"></i></div>
 <div id="qq" class="qq"></div><div id="qo" class="qos"></div>
 <div class="qctl"><button id="hn">⏭ 下一步</button><button id="hp">⏸ 停在 這一題</button><button id="hint">😆 干擾：開</button></div></div><div class="qside" id="gv"></div></div></div>
<div class="scr" id="hend" hidden><div class="in center"><h1>🏁 任務 完成！</h1><div id="eres" class="eres"></div><div id="epod" class="kpod epod"></div><div id="efw" class="efw"></div>
 <div id="erw" class="note big2"></div><button id="give" class="big">🎁 發獎勵 ＋ 記 練習次數</button><div id="gm" class="note big2"></div><button id="close2" class="ghost" onclick="closeRoom()">✕ 關掉 房間，再開 一場</button></div></div>
<script>var BASE='../',BANK=${JSON.stringify(BANK)};
${RT}
${R('_host_rt.js')}
</script></body></html>`;
/* ── 學生平板 ── */
const stu = head('現場任務') + `<body class="stu">
${CL.home(0, '../', 'school')}
<script src="fb.js"></script>
<div class="scr" id="soff" hidden><div class="in center"><div class="big2">⚡ 現場任務 還沒有 開</div><div class="note">（老師 設定好 就 可以 玩）</div><a class="ghost" href="../index.html">🏠 回首頁</a></div></div>
<div class="scr" id="sout" hidden><div class="in center"><div class="big2">⚡ 現場任務</div><div class="note big2">先 🔑 登入，再 輸入 大螢幕 上的 號碼</div><button id="sIn" class="big">🔑 登入</button></div></div>
<div class="scr" id="scode" hidden><div class="in center"><div class="big2">⚡ 輸入 大螢幕 上的 <b>房間 號碼</b></div><div id="cbox" class="cbox"></div><div id="cmsg" class="note big2"></div>
 <div class="kpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0].map(k => `<button data-ck="${k}">${k}</button>`).join('')}</div></div></div>
<div class="scr" id="swait" hidden><div class="in center"><div id="wt" class="big2"></div><div id="wh"></div></div></div>
<div class="scr" id="sq" hidden><div class="sqw"><div class="qtop"><span id="sqn"></span><span class="qtm">⏱ <b id="sqt">15</b></span></div><div class="qbar"><i id="sqbar"></i></div>
 <div id="sqq" class="sqq"></div><div id="sqh" class="sqh" hidden></div><div id="sqm" class="note sqm"></div><div id="sqo" class="sos"></div><div id="sqr"></div><button id="kch" class="kch" hidden>📣 加油！</button></div></div>
<div class="scr" id="send" hidden><div class="in center"><h1>🏁 任務 完成！</h1><div id="ew"></div><a class="big" style="text-decoration:none;display:inline-flex" href="../rpg/index.html"><img src="../rpg/cover_icon.webp" alt="" style="height:1.2em;width:2.4em;object-fit:cover;border-radius:.25em;border:2px solid #FFD54A;margin-right:.3em">戰神之路</a></div></div>
<div id="gift"></div><div id="fxo"></div>
<script>var BASE='../';
${RT}
${R('_stu_rt.js')}
</script></body></html>`;
fs.writeFileSync(path.join(__dirname, 'host.html'), host);
fs.writeFileSync(path.join(__dirname, 'index.html'), stu);
if (!fs.existsSync(path.join(__dirname, 'fb.js'))) fs.writeFileSync(path.join(__dirname, 'fb.js'), "/* live/fb.js — ⚡ 現場任務的 Firebase Realtime Database 網址（老師照大字版 live/setup.html 做好，把網址交給 Claude 貼在兩個引號中間）\n * 空白 ＝ 現場任務關著。這裡只放網址，沒有密碼、沒有姓名。 */\nwindow.LIVE_DB = '';\n");
require('./_setup_page.js');
console.log('live ok：題目 三年級 ' + BANK[3].map(b => b.qs.length).join('＋') + '、四年級 ' + BANK[4].map(b => b.qs.length).join('＋'));
