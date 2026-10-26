/* g3mid/_class_preview.js — 產生 給 老師 看 的 題目 預覽頁 listen/2026-10-26_C31/index.html（老師 說「對」才 做進 網站）
 *   node g3mid/_class_preview.js
 * 內容：三年級 課堂複習 1、2、3（g3mid/_class_data.js）＋ 四年級 短文 偵探 兩篇 新 對話（midterm/_pas_draft.js）。
 * 檢查（不過 ＝ 失敗、不產生）：每一套 10 種 ✕ 8 題；三套 之間 沒有 一樣 的 題目；人名 不在 BAN；每一套 🔁 類似 約 30%（25%～35%）。 */
const fs = require('fs'), path = require('path');
const C = require('./_class_data.js'), D = require('./_data.js'), P = require('../midterm/_pas_draft.js');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '’');
const ERR = [];
const NUMW = D.NUMW, NUMZ = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const PHM = D.PHM, CEM = {}; D.CE.forEach(c => { CEM[c.k] = c; });
const SCN = { thank: '🎁 謝謝／不客氣', meet: '🤝 很高興認識你', help: '🔍 找不到狗，幫忙', come: '👋 過來這裡', morn: '🌅 早安' };
const card = c => /:/.test(c) ? '🏷 ' + c.split(':')[0] + '　🎂 ' + c.split(':')[1] : SCN[c];
const pic = k => /^w:/.test(k) ? (PHM[k.slice(2)] ? PHM[k.slice(2)][2] + ' ' + k.slice(2) : '？' + k) : '📷 ' + (CEM[k] ? CEM[k].zh.replace('。', '') : k);
const T9 = { A: (n, a) => 'Hi. My name is ' + n + '. I’m ' + NUMW[a] + ' years old.', B: (n, a) => 'I’m ' + n + '. I’m ' + NUMW[a] + ' years old. Nice to meet you.',
  C: (n, a) => 'My name is ' + n + '. I’m ' + NUMW[a] + '.', D: (n, a) => 'Hello. I’m ' + n + '. I’m ' + NUMW[a] + ' years old, too.' };
const CTX = { '': '數一數 東西', cake: '🎂 生日 蠟燭：I’m ___ years old.', hand: '✋ 數 手指', dice: '🎲 骰子 點數' };
/* 每一種 遊戲：名字、怎麼玩、一題 ➜ [題目, 正解, 誘答, 這一題 的「身分」（三套 之間 不可以 一樣）] */
const G = [
  ['q1', '🔨 字母 打地鼠', '聽 單字 ➜ 敲 第一個 字母', C.Q1, q => ['🔊 ' + q[1] + '（' + (PHM[q[1]] || ['', '', ''])[2] + '）' + (q[4] === 'U' ? '　地鼠 寫 大寫' : ''), q[2], q[3].split('').join('　'), q[1] + '>' + q[2]]],
  ['q2', '🟡 小精靈 聽句', '聽 ➜ 小精靈 走到 對的 卡', C.Q2, q => ['🔊 ' + q[1].map(x => x[1]).join('　'), card(q[2]), card(q[3]) + '<br>' + card(q[4]), q[1].map(x => x[1]).join(' ')]],
  ['q3', '🧸 教室 夾娃娃', '聽 ➜ 夾 對的 照片／圖', C.Q3, q => ['🔊 ' + q[1], pic(q[2]), q[3].map(pic).join('<br>'), q[1]]],
  ['q4', '⛏️ 挖礦 寫字母', '聽 單字 ➜ ① 點 圖 ➜ ② 手指 寫 第一個 字母', C.Q4, q => ['🔊 ' + q[1] + '（' + (PHM[q[1]] || ['', '', ''])[2] + '）', '✍️ ' + q[2] + (q[2] === q[2].toUpperCase() ? '（大寫）' : '（小寫）'), '（圖 另外 2 個）', q[1] + '>' + q[2]]],
  ['q5', '🪞 大小寫 魔鏡', '看 鏡子 裡 的 字母 ➜ 寫 另一半', C.Q5, q => ['🪞 ' + q[1], '✍️ ' + q[2], '—', q[1] + '>' + q[2]]],
  ['q6', '🧱 數字 金幣磚', '數一數 ➜ 敲 字母磚 拼 英文', C.Q6, q => [CTX[q[3]] + '：' + q[2] + ' ✕ ' + q[1], NUMW[q[1]] + '（' + NUMZ[q[1]] + '）', '（磚 裡 多 2～3 個 字母）', q[1] + q[2] + q[3]]],
  ['q7', '🌱 皮克敏 搬字', '把 對的 字 拖到 空格', C.Q7, q => [esc(q[1]) + '<br><small>' + q[5] + '</small>', esc(q[2]), esc(q[3]) + '　' + esc(q[4]), q[1]]],
  ['q8', '⚔️ 英文 對決 擂台', '反派 說 ➜ 選 對的 回答（↩ ＝ 反派 回答 ➜ 選 他 被 問 什麼）', C.Q8, q => [(q[1] ? '↩ 反派 回答：' : '反派：') + esc(q[2]), esc(q[3]), q[4].map(esc).join('<br>'), q[1] + q[2]]],
  ['q9', '📋 資料表 小幫手', '讀 3 個人 的 自我介紹 ➜ 名字、歲數 拖進 資料表', C.Q9, q => [q[1].map(p => esc(T9[p[2]](p[0], p[1]))).join('<br>'), q[1].map((p, i) => (q[2][i] === 'n' ? '<b>' + p[0] + '</b>' : p[0]) + ' ' + (q[2][i] === 'a' ? '<b>' + p[1] + '</b>' : p[1])).join('<br>') + '<br><small>（粗字 ＝ 空格）</small>', '多 放：' + q[3][0] + '、' + q[3][1], q[1].map(p => p[0] + p[1]).join('')]],
  ['q10', '🪂 空投 密碼箱', '聽 數字 ➜ 打開 對的 空投箱', C.Q10, q => ['🔊 ' + q[1].split('').map(d => NUMW[+d] || 'zero').join(', '), q[1], (q[1].length === 3 ? [q[1][0] + q[1][2] + q[1][1], q[1][1] + q[1][0] + q[1][2]] : [q[1][1] + q[1][0] + q[1].slice(2), q[1].slice(0, 2) + q[1][3] + q[1][2]]).join('　'), q[1]]]
];
/* 檢查 */
const allNames = new Set(); C.SETS.forEach(([k]) => [].concat(C.NAMES[k].b, C.NAMES[k].g).forEach(n => { if (C.BAN.indexOf(n) >= 0) ERR.push('名字 不可以 用：' + n); if (allNames.has(n)) ERR.push('名字 重複：' + n); allNames.add(n); }));
const txt = JSON.stringify([C.Q2, C.Q7, C.Q8, C.Q9]); C.BAN.forEach(n => { if (new RegExp('\\b' + n + '\\b').test(txt)) ERR.push('題目 用到 不可以 用 的 名字：' + n); });
const stat = {};
G.forEach(([id, nm, , B, f]) => { const seen = {};
  C.SETS.forEach(([k]) => { if ((B[k] || []).length !== 8) ERR.push(k + ' ' + nm + ' 不是 8 題');
    (B[k] || []).forEach((q, i) => { const r = f(q), key = r[3].replace(/\s+/g, ' ').toLowerCase(); if (seen[key]) ERR.push(nm + '：' + k + ' 第 ' + (i + 1) + ' 題 跟 ' + seen[key] + ' 一樣'); seen[key] = k + ' 第 ' + (i + 1) + ' 題';
      stat[k] = stat[k] || [0, 0]; stat[k][0]++; if (q[0]) stat[k][1]++; }); }); });
C.SETS.forEach(([k]) => { const p = stat[k][1] / stat[k][0]; if (p < .25 || p > .35) ERR.push(k + ' 🔁 類似 ' + Math.round(p * 100) + '%（要 約 30%）'); });
if (ERR.length) { ERR.forEach(e => console.log('✗ ' + e)); process.exit(1); }

let h = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>課堂複習 題目 C31</title><style>
:root{color-scheme:dark}*{box-sizing:border-box}
body{margin:0;background:#05070A;color:#fff;font-family:"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 140px;font-size:26px;line-height:1.55;font-weight:700}
.wrap{max-width:1280px;margin:0 auto}h1{font-size:42px;color:#FFD54A;margin:22px 0 6px}
h2{font-size:38px;color:#FFD54A;margin:60px 0 10px;border-top:4px solid #24303C;padding-top:22px}h3{font-size:30px;color:#7FD4FF;margin:30px 0 6px}
.box{background:#0B0F14;border:3px solid #24303C;border-radius:22px;padding:16px 20px;margin:18px 0}.ask{background:#0B1630;border-color:#7FD4FF}.ok{background:#0D1B12;border-color:#3BD16F}
table{border-collapse:collapse;width:100%;margin:8px 0}td,th{border:2px solid #2A3540;padding:8px 10px;text-align:left;vertical-align:top;word-break:break-word}
th{background:#14202B;color:#CFE6FF}td small{color:#BFD3E6;font-size:22px}td b{color:#FFE07A}
.s1{display:inline-block;background:#FFB300;color:#111;border-radius:10px;padding:0 10px;white-space:nowrap}.s0{display:inline-block;background:#3BD16F;color:#062;border-radius:10px;padding:0 10px;white-space:nowrap}
.ans{color:#7BF0A8}.how{font-size:22px;color:#BFD3E6}.nav a{display:inline-block;margin:6px 10px 6px 0;padding:6px 16px;border-radius:14px;background:#14202B;color:#FFE07A;text-decoration:none}
.pas{background:#FFF8E6;color:#2A2010;border-radius:18px;padding:10px 18px;font-size:28px}.pas span{display:block}.pas i{font-style:normal;color:#8A5A00;display:inline-block;min-width:4em}
@media (max-width:700px){body{font-size:22px}h1{font-size:32px}h2{font-size:30px}td,th{padding:6px}}
</style></head><body><div class="wrap">
<h1>🏫 三年級 課堂複習 1、2、3 ＋ 🕵️ 四年級 短文偵探：題目 給 老師 看</h1>
<div class="box">老師 說 <b>「對」</b> 才 做進 網站。要 改 的 題目：請 寫「課堂複習 幾、哪一個 遊戲、第 幾 題、改 成 什麼」。</div>
<div class="box ok"><b>怎麼 分 🔁 和 🆕</b><br>
<span class="s1">🔁 類似</span>：考 的 <b>重點</b> 跟 期中考 某一題 一樣（同一個 字母、同一個 句型、同一種 情境），但是 題目、問法、選項、遊戲 都 不一樣。<br>
<span class="s0">🆕 全新</span>：期中考卷 <b>沒有 考</b> 的 字、字母、句子、數字、情境（還是 在 期中考 範圍：Phonics Fun 1～4、Numbers 1～10、Classroom English、Topic 1 New Friends）。<br>
每一套 ＝ 10 種 遊戲 ✕ 8 題 ＝ 80 題（跟「三年級 複習」一樣 一回 8 題）。<br>
${C.SETS.map(([k, n]) => n + '：🔁 ' + stat[k][1] + ' 題（' + Math.round(stat[k][1] / stat[k][0] * 100) + '%）、🆕 ' + (stat[k][0] - stat[k][1]) + ' 題（' + Math.round((1 - stat[k][1] / stat[k][0]) * 100) + '%）').join('<br>')}<br>
✔ 電腦 檢查 過：三套 之間 <b>沒有 一樣 的 題目</b>；人名 跟 期中考卷、課本、三年級 複習 <b>都 不一樣</b>（每一套 自己 一組：${C.SETS.map(([k, n]) => n.replace('三年級 ', '') + ' ＝ ' + [].concat(C.NAMES[k].b, C.NAMES[k].g).join('、')).join('；')}）。</div>
<div class="box">⚠ 老實 說：期中考 範圍 只有 26 個 Phonics 字、1～10、8 句 Classroom English、Topic 1 的 句子，所以「挖礦 寫字母」🆕 的 字 跟「三年級 複習」有 一樣 的 字（題目 的 圖、選項 不一樣）。其他 9 種 遊戲 的 題目 都 是 新的。</div>
<div class="nav">${C.SETS.map(([k, n]) => '<a href="#' + k + '">' + n + '</a>').join('')}<a href="#pas">🕵️ 四年級 短文偵探</a><a href="#ask">❓ 請 老師 回答</a></div>`;
C.SETS.forEach(([k, n]) => {
  h += '<h2 id="' + k + '">' + n + '</h2>';
  G.forEach(([id, nm, how, B, f]) => {
    h += '<h3>' + nm + '　<span class="how">' + how + '</span></h3><table><tr><th style="width:3em">#</th><th style="width:5.5em"></th><th>題目</th><th>✅ 正解</th><th>誘答</th></tr>';
    B[k].forEach((q, i) => { const r = f(q); h += '<tr><td>' + (i + 1) + '</td><td>' + (q[0] ? '<span class="s1">🔁 類似</span>' : '<span class="s0">🆕 全新</span>') + '</td><td>' + r[0] + '</td><td class="ans">' + r[1] + '</td><td>' + r[2] + '</td></tr>'; });
    h += '</table>'; });
});
h += '<h2 id="pas">🕵️ 四年級 複習「短文 偵探」：兩篇 新的 對話</h2><div class="box">一開始 只 有 對話，<b>20 秒</b> 先 讀（〔▶ 開始 回答〕鎖住）➜ 上面 對話、下面 題目，<b>每題 30 秒</b>；答錯 ＝ 原文 那一句 <b>綠底</b> ➜ 唸 一次 ➜ 獨立 的 秒懂 頁（每一個 字 下面 中文、最下面 整句 翻譯）再 唸 一次 ➜ 才 有〔▶ 下一題〕；答對 ＝ 那一句 亮 黃色 ＋〔▶ 下一題〕。<br>（這個 流程 已經 做好 了，現在 用 舊的 短文；老師 說「對」就 換成 下面 兩篇。）</div>';
Object.keys(P.PAS).forEach((k, j) => { const A = P.PAS[k];
  h += '<h3>第 ' + (j + 1) + ' 篇：' + A.title + '</h3><div class="pas">' + A.t.map((t, i) => '<span><i>' + A.sp[i] + ':</i> ' + esc(t) + '</span>').join('') + '</div><div class="box">' + A.z.map((z, i) => A.sp[i] + '：' + z).join('<br>') + '</div>';
  h += '<table><tr><th>#</th><th>題目</th><th>✅ 正解</th><th>誘答</th><th>證據（第 幾 行）</th><th>考 什麼</th></tr>' + P.Q.filter(q => q[0] === k).map((q, i) => '<tr><td>' + (i + 1) + '</td><td>' + esc(q[1]) + '</td><td class="ans">' + esc(q[2][0]) + '</td><td>' + q[2].slice(1).map(esc).join('<br>') + '</td><td>' + q[3].map(x => x + 1).join('、') + '</td><td>' + q[4] + '</td></tr>').join('') + '</table>'; });
h += '<h2 id="ask">❓ 請 老師 回答</h2><div class="box ask">① 三年級 課堂複習 1、2、3 的 題目：<b>對</b>／要 改 哪幾題<br>② 四年級 短文偵探 兩篇 對話＋10 題：<b>對</b>／要 改 哪裡<br>③ 老師看板〔🏫 課堂複習〕的 平均 正確率「只 算 已經 作答 的 題目」：<b>⏰ 時間 到 沒有 選</b>的 那一題 算 不 算？　A 算 答錯（現在 這樣）　B 不算（當作 沒有 作答）</div></div></body></html>';
const out = path.join(__dirname, '..', 'listen', '2026-10-26_C31'); fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'index.html'), h);
console.log('預覽頁 ok：' + C.SETS.map(([k, n]) => n + ' 🔁 ' + stat[k][1] + '／' + stat[k][0]).join('、'));
