/* live/_build.js — ⚡ 現場任務（2026-10-17 老師看完 C9（第八次）；規格 live/CLAUDE.md）
 *   node live/_build.js  ➜  live/host.html（老師大螢幕）、live/index.html（學生平板）、live/setup.html（大字版 Firebase 設定頁）
 * 2026-10-18 第十一次 重做：🏆 經典搶答＋10 種、🔥 挑戰題（CHAL）、等人 的 小遊戲（WORDS、_mini.js）、QR Code（score/qr.js）、不用 打 號碼（0＋班級）
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
/* 🔥 挑戰題（2026-10-18 第十一次 老師：輸入正確英文、英文拼字，分數 ✖2；點 大字母 方塊）＋ 等人 的 小遊戲 用 的 字
 *   🔤 拼字：這個年級 學過 的 字（只要 英文 字母、3～10 個）；🧩 排句子：兩個 句型網站 的 🧩 語序大挑戰（G3）題目（有 逗號 的 不放：方塊 太 碎） */
const G3D = require(path.join(ROOT, 'G3 - L1 + L2/_data.js')), G4D = require(path.join(ROOT, 'sentences/_data.js'));
const w3 = (en, zh, ic) => ({ en, zh, ic });
const NUM = [['one', '一', '1️⃣'], ['two', '二', '2️⃣'], ['three', '三', '3️⃣'], ['four', '四', '4️⃣'], ['five', '五', '5️⃣']].concat(G3D.SUB.age.basic || G3D.SUB.age);
const WORDS = {
  3: NUM.map(x => w3(x[0], x[1], x[2])).concat([w3('name', '名字', '🏷️'), w3('old', '…歲', '🎂'), w3('what', '什麼', '❓'), w3('how', '怎樣', '🤔'), w3('your', '你的', '👉'), w3('you', '你', '🫵')]),
  4: [].concat(G4D.SUB.fam.basic, G4D.SUB.fam.adv, G4D.SUB.job4.basic, G4D.SUB.job4.adv).map(x => w3(x[0], x[1], x[2])).concat([w3('who', '誰', '❓'), w3('she', '她', '👧')])
};
[3, 4].forEach(g => { const seen = new Set(); WORDS[g] = WORDS[g].filter(w => typeof w.en === 'string' && /^[a-z]{3,10}$/.test(w.en) && !seen.has(w.en.toLowerCase()) && seen.add(w.en.toLowerCase())); });
const orOf = file => { const B = require(path.join(ROOT, file)), seen = new Set();
  return B.G3.filter(x => x.s.indexOf(',') < 0 && x.s.length <= 7).map(x => { const p = /^[.?!]$/.test(x.s[x.s.length - 1]) ? x.s[x.s.length - 1] : ''; return { w: p ? x.s.slice(0, -1) : x.s, p, zh: x.zh.replace(/[。？！]$/, ''), h: x.h || '' }; })
    .filter(x => { const k = x.w.join('|'); return !seen.has(k) && seen.add(k); }); };
const CHAL = { 3: { sp: WORDS[3], or: orOf('G3 - L1 + L2/_game_data.js') }, 4: { sp: WORDS[4], or: orOf('sentences/_game_data.js') } };
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
const host = head('現場任務 大螢幕') + `<body class="host">
<script src="../score/url.js"></script><script src="fb.js"></script><script src="../score/qr.js"></script>
<div class="scr" id="hpw" hidden><div class="in center"><h1>⚡ 現場任務</h1><div class="note">老師 密碼（跟 老師看板 一樣）</div>
 <input type="password" id="pw" autocomplete="current-password"><button id="pwgo" class="big">🔑 進去</button><div id="pwm" class="note"></div>
 <div class="note">還沒 設定 Firebase？➜ <a href="setup.html">大字版 設定頁</a></div></div></div>
<div class="scr" id="hset" hidden><div class="in"></div></div>
<div class="scr" id="hlob" hidden><div class="lob">
 <div class="lobl"><div class="lqrt">📱 用 平板 掃 這個</div><div id="lqr" class="lqr"></div><div id="lurl" class="lurl"></div><div id="llog"></div></div>
 <div class="lobr"><div id="lgame" class="lgame"></div><div id="lhow"></div>
  <div class="lcnt">👥 已經 加入 <b id="lcnt">0</b> 人</div><div id="lpl" class="pls"></div>
  <div class="row cen"><button id="go" class="big">▶ 開始</button><button id="close" class="ghost">✕ 結束 這一場</button></div><div id="lmsg" class="note"></div></div></div></div>
<div class="scr" id="hhow" hidden><div class="in center" id="hhw"></div></div>
<div class="scr" id="hq" hidden><div class="qwrap"><div class="qmain"><div class="qtop"><span id="qn"></span><span id="qtm" class="qtm"><span id="qring" class="ring"><b id="qt">20</b></span></span><span id="qa"></span></div>
 <div id="qq" class="qq"></div><div id="qo" class="qos"></div><div id="qh" class="qh" hidden></div>
 <div class="qctl"><button id="hn">⏭ 下一步</button><button id="hp">⏸ 停在 這一題</button><button id="hint">😆 干擾：開</button><button id="hsnd">🔊 聲音：開</button></div></div><div class="qside" id="gv"></div></div><div id="lb" class="lb"></div></div>
<div class="scr" id="hend" hidden><div class="in center"><h1>🏁 頒獎！</h1><div id="eres" class="eres"></div><div id="epod" class="kpod epod"></div><div id="efw" class="efw"></div>
 <div id="erw" class="note big2"></div><button id="give" class="big">🎁 發獎勵 ＋ 記 練習次數</button><div id="gm" class="note big2"></div><button id="close2" class="ghost">✕ 結束 這一場，再 建立 一場</button></div></div>
<script>var BASE='../',BANK=${JSON.stringify(BANK)},CHAL=${JSON.stringify(CHAL)};
${RT}
${R('_host_rt.js')}
</script></body></html>`;
/* ── 學生平板 ── */
const stu = head('現場任務') + `<body class="stu">
${CL.home(0, '../', 'school')}
<script src="fb.js"></script>
<div class="scr" id="soff" hidden><div class="in center"><div class="big2">⚡ 現場任務 還沒有 開</div><div class="note">（老師 設定好 就 可以 玩）</div><a class="ghost" href="../index.html">🏠 回首頁</a></div></div>
<div class="scr" id="sout" hidden><div class="in center"><h1>⚡ 現場任務</h1><div id="slog"></div><button id="sIn" class="big">🔑 登入（打 5 碼）</button></div></div>
<div class="scr" id="swait" hidden><div class="sqw"><div id="wt" class="wt"></div>
 <div id="wtabs" class="wtabs"><button data-tab="mini">🎮 小遊戲</button><button data-tab="eq">⚔ 換 裝備</button><button data-tab="how">❓ 怎麼玩</button></div><div id="wbody" class="wbody"></div></div></div>
<div class="scr" id="show" hidden><div class="in center" id="shw"></div></div>
<div class="scr" id="sq" hidden><div class="sqw"><div class="qtop"><span id="sqn"></span><span class="qtm"><span id="sqring" class="ring sm"><b id="sqt">20</b></span></span></div>
 <div id="sqq" class="sqq"></div><div id="sqh" class="sqh" hidden></div><div id="sqm" class="note sqm"></div><div id="sqo"></div><div id="sqr"></div><button id="kch" class="kch" hidden>📣 加油！</button></div></div>
<div class="scr" id="send" hidden><div class="in center"><h1>🏁 任務 完成！</h1><div id="ew"></div><a class="big" style="text-decoration:none;display:inline-flex" href="../rpg/index.html"><img src="../rpg/cover_icon.webp" alt="" style="height:1.2em;width:2.4em;object-fit:cover;border-radius:.25em;border:2px solid #FFD54A;margin-right:.3em">戰神之路</a></div></div>
<div id="res"></div><div id="gift"></div><div id="fxo"></div>
<script>var BASE='../',WORDS=${JSON.stringify(WORDS)};
${RT}
${R('_mini.js')}
${R('_stu_rt.js')}
</script></body></html>`;
fs.writeFileSync(path.join(__dirname, 'host.html'), host);
fs.writeFileSync(path.join(__dirname, 'index.html'), stu);
if (!fs.existsSync(path.join(__dirname, 'fb.js'))) fs.writeFileSync(path.join(__dirname, 'fb.js'), "/* live/fb.js — ⚡ 現場任務的 Firebase Realtime Database 網址（老師照大字版 live/setup.html 做好，把網址交給 Claude 貼在兩個引號中間）\n * 空白 ＝ 現場任務關著。這裡只放網址，沒有密碼、沒有姓名。 */\nwindow.LIVE_DB = '';\n");
require('./_setup_page.js');
console.log('live ok：挑戰題 三年級 ' + CHAL[3].sp.length + ' 字＋' + CHAL[3].or.length + ' 句、四年級 ' + CHAL[4].sp.length + ' 字＋' + CHAL[4].or.length + ' 句；題目 三年級 ' + BANK[3].map(b => b.qs.length).join('＋') + '、四年級 ' + BANK[4].map(b => b.qs.length).join('＋'));
