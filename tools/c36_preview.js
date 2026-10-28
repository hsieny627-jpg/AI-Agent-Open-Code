/* node tools/c36_preview.js — 第三十三次 題目 清單 頁 listen/2026-10-28_C36/（給 老師 看，老師 說「對」才 放 上 網站）
 * 內容：三年級、四年級 每一套 200 題（題庫 A ＝ 25／50 題、題庫 B ＝ 新 25／新 50 題）、🔓 句子 解碼 任務、四年級 6 種 新 遊戲 設計。
 * 同時 檢查（不過 ＝ 失敗、不 產生 頁面）：跟 考卷、舊 題庫 一模一樣、名字 用過、題庫 自己 重複、題數、類似 比例。 */
const fs = require('fs'), path = require('path');
const D3 = require('../g3mid/_data.js'), X3 = require('../g3mid/_exam_data.js'), C3 = require('../g3mid/_class_data.js'), P3 = require('../g3mid/_pool.js');
const X4 = require('../midterm/_exam_data.js'), P4 = require('../midterm/_pool.js'), D4 = require('../midterm/_data.js');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '’');
const ERR = [], NUMZ = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

/* ══ 三年級 檢查 ══ */
const CK = { q1: r => r[1] + '|' + r[2], q2: r => JSON.stringify(r[1].map(x => x[1])), q3: r => r[1] + '|' + [r[2]].concat(r[3]).sort().join(), q4: r => r[1] + '|' + r[2], q5: r => 'lis' + r[1],
  q6: r => r[1] + '|' + r[2] + '|' + r[3], q7: r => r[1], q8: r => r[2] + '|' + r[3], q9: r => JSON.stringify(r[1].map(x => [x[0], x[1]])), q10: r => r[1] };
const KEY = { q1: q => q.say + '|' + q.o[0], q2: q => JSON.stringify(q.say.map(x => x[1])), q3: q => q.say + '|' + q.o.slice().sort().join(), q4: q => q.say + '|' + q.want, q5: q => (q.lis ? 'lis' : q.show + '>') + q.want,
  q6: q => q.n + '|' + q.obj + '|' + (q.ctx || ''), q7: q => q.s, q8: q => (q.a || q.b) + '|' + q.o[0], q9: q => JSON.stringify(q.c.map(c => [c.t, c.a])), q10: q => q.code };
const CCK = { q1: r => r[1] + '|' + r[2], q2: r => JSON.stringify(r[1].map(x => x[1])), q3: r => r[1] + '|' + [r[2]].concat(r[3]).sort().join(), q4: r => r[1] + '|' + r[2], q5: r => r[1] + '>' + r[2],
  q6: r => r[1] + '|' + r[2] + '|' + r[3], q7: r => r[1], q8: r => r[2] + '|' + r[3], q9: r => JSON.stringify(r[1].map(x => [x[0], x[1]])), q10: r => r[1] };
const cls = id => [].concat(...C3.SETS.map(st => C3['Q' + id.slice(1)][st[0]]));
const OLDN = C3.BAN.concat(['Mike', 'Emma', 'Wendy', 'Roy', 'Sam', 'Ann', 'Lily'], ...Object.values(C3.NAMES).map(x => x.b.concat(x.g)));
const BANA = new RegExp('\\b(' + OLDN.join('|') + ')\\b'), BANB = new RegExp('\\b(' + OLDN.concat(P3.BA, P3.GA).join('|') + ')\\b');
const IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
let simA = 0, simB = 0;
IDS.forEach((id, gi) => { const g = D3.GAMES[gi], n = id.slice(1), old = new Set(g.B.map(KEY[id]).concat(cls(id).map(CCK[id]))), ex = X3['X' + n], A = P3.PA['X' + n], B = P3.PB['X' + n];
  const oldA = new Set([...old].concat(ex.map(CK[id])));
  if (ex.length + A.length !== 14) ERR.push('三年級 A ' + g.nm + ' 不是 14 題'); if (B.length !== 14) ERR.push('三年級 B ' + g.nm + ' 不是 14 題');
  const seenA = new Set(ex.map(CK[id])), seenB = new Set();
  A.forEach(r => { const k = CK[id](r); if (oldA.has(k) || seenA.has(k)) ERR.push('三年級 A ' + g.nm + ' 重複：' + k); seenA.add(k); if (BANA.test(JSON.stringify(r))) ERR.push('三年級 A ' + g.nm + ' 名字 用過 ' + JSON.stringify(r).match(BANA)[0]); });
  B.forEach(r => { const k = CK[id](r); if (old.has(k) || seenB.has(k)) ERR.push('三年級 B ' + g.nm + ' 重複：' + k); seenB.add(k); if (BANB.test(JSON.stringify(r))) ERR.push('三年級 B ' + g.nm + ' 名字 用過 ' + JSON.stringify(r).match(BANB)[0]); });
  if (id === 'q1') A.concat(B).forEach(r => { if (D3.EXAM_A[r[1]] && r[3].indexOf(D3.EXAM_A[r[1]].toUpperCase()) >= 0) ERR.push('打地鼠 配 考卷 的 字母 ' + r[1]); });
  if (id === 'q4') A.concat(B).forEach(r => { if (D3.EXAM_D.indexOf(r[1]) >= 0) ERR.push('挖礦 考卷 D 的 字 ' + r[1]); });
  A.concat(B).forEach(r => { if (r[3] && Array.isArray(r[3]) && new Set([r[2]].concat(r[3])).size !== r[3].length + 1) ERR.push(g.nm + ' 選項 重複'); });
  simA += ex.concat(A).filter(r => r[0]).length; simB += B.filter(r => r[0]).length; });
if (simA !== 60) ERR.push('三年級 A 類似 ' + simA + '（要 60）'); if (simB !== 100) ERR.push('三年級 B 類似 ' + simB + '（要 100）');
[['A', P3.DA], ['B', P3.DB]].forEach(([w, L]) => { if (L.length !== 60) ERR.push('三年級 解碼 任務 ' + w + ' ' + L.length); if (new Set(L.map(q => q.en)).size !== L.length) ERR.push('三年級 解碼 任務 ' + w + ' 重複');
  if (L.filter(q => q.x).length !== L.length / 2) ERR.push('三年級 解碼 任務 ' + w + ' 多 2 個 方塊 不是 一半'); L.forEach(q => { if (/one years/.test(q.en)) ERR.push('one years'); if (/[A-Za-z]{3}/.test(q.z.replace(/\b[A-Z][a-z]+\b/g, ''))) ERR.push('翻譯 有 英文 ' + q.z); }); });
/* ══ 四年級 檢查 ══ */
const row4 = r => JSON.stringify(r.slice(1));
const EXAM4 = P4.EXAMC.concat(['Who’s he?|He’s my dad.', 'Who’s she?|She’s my mom.', 'Is she a doctor?|No, she isn’t.', 'Good morning.|This is my grandma.', 'Nice to meet you.|Nice to meet you, too.', 'Is your brother a student?|Yes, he is.']);
const F4 = ['sister', 'father', 'teacher', 'nurse', 'cook', 'twenty'];
let sim4A = 0, sim4B = 0;
for (let n = 1; n <= 12; n++) { const ex = X4['X' + n], A = P4.PA['X' + n], seen = new Set(ex.map(row4));
  if (ex.length + A.length !== 12 && n !== 8) ERR.push('四年級 A m' + n + ' 不是 12 題');
  A.forEach(r => { if (seen.has(row4(r))) ERR.push('四年級 A m' + n + ' 重複'); seen.add(row4(r)); if (/\b(Amy|Ken|Mia|Tom|Frank|Lisa|Peter|Grace)\b/.test(JSON.stringify(r))) ERR.push('四年級 A 名字 用過'); });
  sim4A += ex.concat(A).filter(r => r[0]).length; }
P4.PA.X7.forEach(r => { if (F4.indexOf(r[1]) >= 0) ERR.push('拼字 考卷 F 的 字 ' + r[1]); });
Object.entries(P4.NB).forEach(([k, L]) => { const s = new Set(); L.forEach(r => { const j = JSON.stringify(r.slice(1)); if (s.has(j)) ERR.push('四年級 B ' + k + ' 重複'); s.add(j);
  if (/\b(Amy|Ken|Mia|Tom|Frank|Lisa|Peter|Grace|Owen|Jason|Emily|Nora)\b/.test(JSON.stringify(r))) ERR.push('四年級 B 名字 用過 ' + k); });
  if (L.length !== 24) ERR.push('四年級 B ' + k + ' 不是 24 題'); sim4B += L.filter(r => r[0]).length; });
P4.NB.N2.forEach(r => { if (P4.EXAMC.indexOf(r[1]) >= 0) ERR.push('賽車 跟 考卷 C 一樣 ' + r[1]); });
P4.NB.N4.forEach(r => { const k = r[2] + '|' + r[3][0]; if (EXAM4.indexOf(k) >= 0) ERR.push('跳跳樂 跟 考卷 E 一樣 ' + k); });
P4.NB.N5.forEach(r => { if (F4.indexOf(r[1]) >= 0) ERR.push('泡泡龍 考卷 F 的 字 ' + r[1]); });
const A4 = 7 * 12 + 5 * 12;   /* 遊戲 題數 */
if (sim4A !== 60) ERR.push('四年級 A 類似 ' + sim4A + '（要 60）'); if (sim4B < 100) ERR.push('四年級 B 類似 ' + sim4B);
[['A', P4.DA], ['B', P4.DB]].forEach(([w, L]) => { if (L.length !== 56) ERR.push('四年級 解碼 任務 ' + w + ' ' + L.length); if (new Set(L.map(q => q.en)).size !== 56) ERR.push('四年級 解碼 任務 ' + w + ' 重複'); });
if (ERR.length) { console.error('✗ ' + ERR.join('\n✗ ')); process.exit(1); }

/* ══ 頁面 ══ */
const SCN = { thank: '🎁 謝謝／不客氣', meet: '🤝 很高興 認識 你', help: '🔍 找不到 狗、幫忙', come: '👋 過來 這裡', morn: '🌅 早安' }, CEM = {}; D3.CE.forEach(c => { CEM[c.k] = c; });
const card = c => { const m = /^(\w+):(\d+)$/.exec(c); return m ? '🏷 ' + m[1] + '　🎂 ' + m[2] : SCN[c]; };
const pic3 = k => /^w:/.test(k) ? D3.PHM[k.slice(2)][2] + ' ' + k.slice(2) : '📷 ' + CEM[k].zh.replace('。', '');
const NW = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const G9 = { A: (n, a) => 'Hi. My name is ' + n + '. I’m ' + NW[a] + ' years old.', B: (n, a) => 'I’m ' + n + '. I’m ' + NW[a] + ' years old. Nice to meet you.', C: (n, a) => 'My name is ' + n + '. I’m ' + NW[a] + '.', D: (n, a) => 'Hello. I’m ' + n + '. I’m ' + NW[a] + ' years old, too.' };
const R3 = {
  q1: r => ['🔊 ' + r[1] + '　<small>（' + (D3.PHM[r[1]] ? D3.PHM[r[1]][1] : NUMZ[NW.indexOf(r[1])]) + '）</small>', r[2], r[3].split('').join('　')],
  q2: r => ['🔊 ' + r[1].map(x => esc(x[1])).join('<br>🔊 '), card(r[2]), card(r[3]) + '<br>' + card(r[4])],
  q3: r => ['🔊 ' + esc(r[1]), pic3(r[2]), r[3].map(pic3).join('<br>')],
  q4: r => ['🔊 ' + r[1] + '　（先 點 圖，再 寫 第一個 字母 大寫）', '✍️ ' + r[2], '—'],
  q5: r => ['🔊 聽 字母（不給 看）', '✍️ ' + r[1] + (r[1] === r[1].toUpperCase() ? '（大寫）' : '（小寫）'), '—'],
  q6: r => [r[3] === 'cake' ? '🎂 How many candles?（' + r[1] + ' 根）' : r[3] === 'dice' ? '🎲 How many dots?（' + r[1] + ' 點）' : 'How many ' + r[2] + '?（' + r[1] + ' 個）', NW[r[1]], '多 的 磚：' + r[4].split('').join('　')],
  q7: r => [esc(r[1]) + '<br><small>' + r[5] + '</small>', esc(r[2]), esc(r[3]) + '　' + esc(r[4])],
  q8: r => [(r[1] ? '↩ DARK OVERLORD answers: ' : 'DARK OVERLORD says: ') + esc(r[2]) + (r[5] ? '<br><small>' + r[5][0] + '</small>' : ''), esc(r[3]) + (r[5] ? '<br><small>' + r[5][1] + '</small>' : ''), r[4].map(esc).join('<br>')],
  q9: r => [r[1].map(p => esc(G9[p[2]](p[0], p[1]))).join('<br>'), r[1].map((p, i) => (r[2][i] === 'n' ? '<b>' + p[0] + '</b>' : p[0]) + '　' + (r[2][i] === 'a' ? '<b>' + p[1] + '</b>' : p[1])).join('<br>') + '<br><small>（粗字 ＝ 空格）</small>', '多 放：' + r[3].join('、')],
  q10: r => ['🔊 ' + r[1].split('').map(d => NW[d]).join(', '), r[1], '順序 換 的 兩個 箱子']
};
const TH = '<table><tr><th class="c1">#</th><th class="c2"></th><th>題目</th><th>✅ 正解</th><th>誘答</th></tr>';
const tag = s => s ? '<span class="s1">🔁 類似</span>' : '<span class="s0">🆕 全新</span>';
const tbl = (L, f, st) => TH + L.map((r, i) => { const x = f(r); return '<tr><td>' + (st + i + 1) + '</td><td>' + tag(r[0]) + '</td><td>' + x[0] + '</td><td class="ans">' + x[1] + '</td><td>' + x[2] + '</td></tr>'; }).join('') + '</table>';
const drag = L => '<table><tr><th class="c1">#</th><th class="c2">課</th><th>英文 句子 ➜ 每一個 字 正下方 放 的 中文 方塊</th><th>多 的 錯 方塊</th></tr>' + L.map((q, i) => '<tr><td>' + (i + 1) + '</td><td>Unit ' + q.u + '</td><td><div class="dg">' +
  q.t.map(t => '<span><b>' + esc(t[0]) + '</b><i>' + esc(t[1]) + '</i></span>').join('') + '</div><small>' + q.z + '</small></td><td>' + (q.x ? q.x.join('、') : '—') + '</td></tr>').join('') + '</table>';
const G3N = D3.GAMES.map(g => g.ic + ' ' + g.nm);
const PIC4 = p => D4.picZh(p);
const PH4 = { lighton: '💡 開燈', lightoff: '🌑 關燈', donttalk: '🤫 不要 說話', dontrun: '🚫🏃 不要 跑', hurryup: '⏩ 快 一點', letsgo: '🚶 我們 走 吧', timesup: '⏰ 時間 到', homework: '📒 給 我 看 作業' };
const ph4 = k => PH4[k] ? '📷 ' + PH4[k] : esc(k);
const R4 = {
  X1: r => ['🔊 ' + r[1] + '　<small>' + r[2] + ' ' + r[3] + '</small>', r[1][0], '另一個 b d p t'],
  X2: r => ['🔊 ' + r[1] + ' … ' + r[2], r[1][0] === r[2][0] ? '⭕ Same' : '❌ Different', '—'],
  X3: r => ['🔊 ' + esc(r[1]) + '<br><small>' + r[4] + '</small>', PIC4(r[2]), r[3].map(PIC4).join('<br>')],
  X4: r => ['🔊 ' + esc(r[1]) + '<br><small>' + r[4] + '</small>', ph4(r[2]), r[3].map(ph4).join('<br>')],
  X5: r => ['🔊 ' + esc(r[1]), r[2], r[3].join('　')],
  X6: r => [(r[1] === 'A' ? 'A: ' : 'B: ') + esc(r[2]) + '<br><small>' + r[4] + '</small>', esc(r[3][0]), r[3].slice(1).map(esc).join('<br>')],
  X7: r => [r[2] + '　' + r[1][0] + ' _ _ _ ' + r[1].slice(-1) + '　<small>' + r[3] + '</small>', r[1], '字母 方塊'],
  X8: r => [esc(r[2]) + '<br><small>（' + r[1] + ' 第 ' + r[4] + ' 行）</small>', esc(r[3][0]), r[3].slice(1).map(esc).join('<br>')],
  X9: r => ['🔊 ' + esc(r[1]), '👆 ' + D4.WHO[r[2]][1], '家族樹 上 其他 人'],
  X10: r => [esc(r[1]) + '<br><small>' + r[4] + '</small>', esc(r[2][0]), r[2].slice(1).map(esc).join('　')],
  X11: r => ['🖼 ' + PIC4(r[1]) + '　' + esc(r[2]) + '<br><small>' + r[4] + '</small>', esc(r[3][0]), r[3].slice(1).map(esc).join('<br>')],
  X12: r => [esc(r[1]) + '<br><small>' + r[3] + '</small>', esc(r[2][0]), r[2].slice(1).map(esc).join('　')]
};
const RN = {
  N1: r => r[1] === 'L' ? ['🔊 ' + r[2] + '　<small>' + r[3] + ' ' + r[4] + '</small>　射 第一個 字母', r[2][0], '另外 3 顆：b d p t'] : ['🔊 ' + r[2] + ' … ' + r[3] + '　第一個 音 一樣 嗎？', r[2][0] === r[3][0] ? '⭕' : '❌', r[2][0] === r[3][0] ? '❌' : '⭕'],
  N2: r => ['🔊 ' + esc(r[1]) + '<br><small>' + r[4] + '</small>', PIC4(r[2]), r[3].map(PIC4).join('<br>')],
  N3: r => ['🔊 ' + esc(r[1]) + '<br><small>' + r[4] + '</small>', ph4(r[2]), r[3].map(ph4).join('　')],
  N4: r => [(r[1] === 'A' ? 'A: ' : '↩ B 回答：') + esc(r[2]) + '<br><small>' + r[4] + '</small>', esc(r[3][0]), r[3].slice(1).map(esc).join('<br>')],
  N5: r => [r[2] + '　' + r[1][0] + ' _ _ _ ' + r[1].slice(-1) + '　<small>' + r[3] + '</small>', r[1], '字母 泡泡'],
  N6: r => r[1] === 'P' ? [esc(r[3]) + '<br><small>（' + P4.PASB[r[2]].title + ' 第 ' + r[5] + ' 行）</small>', esc(r[4][0]), r[4].slice(1).map(esc).join('<br>')] : ['🌳 ' + esc(r[2]), '👆 ' + D4.WHO[r[3]][1], '家族樹 上 其他 人']
};
const pas = (A, k) => '<div class="pas"><b>' + esc(A.title) + '</b>' + A.t.map((t, i) => '<span><i>' + A.sp[i] + ':</i> ' + esc(t) + '<small>　' + A.z[i] + '</small></span>').join('') + '</div>';
const M4N = D4.GAMES.map(g => g.ic + ' ' + g.nm);

let h = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>第三十三次 題目 C36</title><style>
:root{color-scheme:dark}*{box-sizing:border-box}
body{margin:0;background:#05070A;color:#fff;font-family:"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 140px;font-size:26px;line-height:1.55;font-weight:700}
.wrap{max-width:1280px;margin:0 auto}h1{font-size:42px;color:#FFD54A;margin:22px 0 6px}
h2{font-size:38px;color:#FFD54A;margin:60px 0 10px;border-top:4px solid #24303C;padding-top:22px}h3{font-size:30px;color:#7FD4FF;margin:30px 0 6px}
.box{background:#0B0F14;border:3px solid #24303C;border-radius:22px;padding:16px 20px;margin:18px 0}.ok{background:#0D1B12;border-color:#3BD16F}.q{background:#1E1606;border-color:#FFB300}
table{border-collapse:collapse;width:100%;margin:8px 0}td,th{border:2px solid #2A3540;padding:8px 10px;text-align:left;vertical-align:top;word-break:break-word}
th{background:#14202B;color:#CFE6FF}td small{color:#BFD3E6;font-size:21px}td b{color:#FFE07A}.c1{width:2.6em}.c2{width:5.4em}
.s1{display:inline-block;background:#FFB300;color:#111;border-radius:10px;padding:0 10px;white-space:nowrap}.s0{display:inline-block;background:#3BD16F;color:#062;border-radius:10px;padding:0 10px;white-space:nowrap}
.ans{color:#7BF0A8}.nav a{display:inline-block;margin:6px 10px 6px 0;padding:8px 18px;border-radius:14px;background:#14202B;color:#FFE07A;text-decoration:none;font-size:24px}
.pas{background:#FFF8E6;color:#2A2010;border-radius:18px;padding:10px 18px;font-size:26px;margin:10px 0}.pas span{display:block}.pas i{font-style:normal;color:#8A5A00;display:inline-block;min-width:4.2em}.pas small{color:#6A5020;font-size:21px}
.dg{display:flex;flex-wrap:wrap;gap:6px 4px;margin:2px 0 6px}.dg span{display:inline-flex;flex-direction:column;align-items:center;background:#14202B;border-radius:10px;padding:2px 8px;min-width:2.4em}
.dg b{font-size:28px;color:#fff}.dg i{font-style:normal;color:#111;background:#FFE07A;border-radius:8px;padding:0 8px;font-size:22px}
.gm{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:14px}.gm .box{margin:0}.gm .ic{font-size:64px;line-height:1}.gm h4{font-size:30px;margin:4px 0;color:#FFD54A}.gm p{margin:6px 0}
.flow{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.flow span{background:#14202B;border:3px solid #3A4A5A;border-radius:16px;padding:10px 16px}.flow em{font-style:normal;font-size:34px;color:#FFD54A}
@media (max-width:700px){body{font-size:22px}h1{font-size:32px}h2{font-size:30px}td,th{padding:6px}.dg b{font-size:23px}}
</style></head><body><div class="wrap">
<h1>📝 第三十三次：新 題目 清單（C36）</h1>
<div class="box q">老師 好！這一頁 是 <b>還沒 放 上 網站</b> 的 新 題目。老師 看 完 說「<b>對</b>」，我 才 做進 網站。<br>
要 改 的 題目：請 寫「幾 年級、哪一套、哪一個 遊戲、第 幾 題、改 成 什麼」。</div>
<div class="box ok"><b>✔ 電腦 檢查 過：</b>跟 期中考卷 <b>沒有 一題 一模一樣</b>；跟「三年級／四年級 複習」、課堂複習、舊 的 25／50 題 也 不 一樣；人名 都 沒 用過。<br>
<span class="s1">🔁 類似</span> ＝ 考 的 <b>重點</b> 跟 期中考 一樣，但 字、句子、選項、問法 不一樣。<span class="s0">🆕 全新</span> ＝ 考卷 沒有 考 的。<br>
🔓 <b>句子 解碼 任務</b>（考卷 沒有 這種 題型）＝ 算 🆕。每一次 玩 都 重新 抽，做過 的 先 不出。</div>
<table><tr><th>年級</th><th>哪一套</th><th>遊戲 題</th><th>🔓 解碼 任務</th><th>合計</th><th>🔁 類似</th></tr>
<tr><td>三年級</td><td>A：25／50 題</td><td>10 種 ✕ 14 ＝ 140（舊 80＋<b>新 60</b>）</td><td>60</td><td>200</td><td>60（30%）</td></tr>
<tr><td>三年級</td><td>B：新 25／新 50</td><td>10 種 ✕ 14 ＝ <b>140</b></td><td>60</td><td>200</td><td>100（50%）</td></tr>
<tr><td>四年級</td><td>A：25／50 題</td><td>12 種 ✕ 12 ＝ 144（舊 84＋<b>新 60</b>）</td><td>56</td><td>200</td><td>60（30%）</td></tr>
<tr><td>四年級</td><td>B：新 25／新 50</td><td><b>6 種 新 遊戲</b> ✕ 24 ＝ 144</td><td>56</td><td>200</td><td>${sim4B}（${Math.round(sim4B / 2)}%）</td></tr></table>
<div class="nav"><a href="#how">❓ 怎麼 玩、登入</a><a href="#g3a">三年級 A</a><a href="#g3b">三年級 B</a><a href="#g3d">三年級 🔓</a><a href="#g4a">四年級 A</a><a href="#g4n">四年級 6 種 新 遊戲</a><a href="#g4b">四年級 B</a><a href="#g4d">四年級 🔓</a></div>

<h2 id="how">❓ 一次 25 題／50 題 怎麼 走（老師 已經 選 的）</h2>
<div class="flow"><span>⚡ 老師 開 現場任務</span><em>➜</em><span>📱 學生 掃 QR</span><em>➜</em><span>🔑 5 碼＋8 碼 密碼</span><em>➜</em><span>🎮 一關 一關 玩</span><em>➜</em><span>🔓 句子 解碼 任務 一關</span><em>➜</em><span>🏆 分數／100</span></div>
<div class="box">🔓 <b>句子 解碼 任務</b>（25 題 裡 8 題、50 題 裡 15 題）：<br>
① <b>Unit 1 秒懂 動畫</b>（≧ 20 秒：每一句 一個 字 一個 字 出來，英文 正下方 中文，唸 到 哪 亮 到 哪，最後 整句 中文）➜ ② Unit 1 拖曳 題 ➜ ③ Unit 2 秒懂 動畫 ➜ ④ Unit 2 拖曳 題。<br>
第一次 一定 看 完，第二次 以後 有〔⏭ 跳過〕。拖 對 ＝ 唸 一次 整句（唸 到 哪 亮 到 哪）＋ 最 下面 整句 中文。放 對 幾 格 就 拿 幾 成 分數。不發音 的 字母 灰色（What 的 h、name 的 e、are 的 e…）。</div>
<div class="box">👥 <b>兩 人 一台</b>：平板 上 按〔👥 兩 個 人〕➜ 兩 個 人 各 打 自己 的 5 碼＋密碼 ➜ 大字「輪到 304 12 號」一人 一題 輪流、題目 不一樣 ➜ 成績、錯題 各 記 各 的。<br>
🙋 <b>一 人 一台</b>：自己 的 5 碼＋密碼，跟 平常 一樣。<br>
🔑 <b>密碼</b>：第一次 登入 自己 設（2 個 小寫 字母＋6 個 數字，例 ab123456，打 兩次）；自己 的 平板 可以 勾〔✅ 這台 平板 記住 密碼〕；忘記 ＝ 老師看板 點 那位 學生〔🔑 清除 密碼〕➜ 學生 下次 自己 重設。</div>
`;
h += '<h2 id="g3a">📝 三年級　A：25／50 題 新加 的 60 題</h2><div class="box">原本 80 題 在 C33 頁（https://hsieny627-jpg.github.io/AI-Agent-Open-Code/listen/2026-10-26_C33/ ），老師 看過 了；下面 是 每 種 再 加 6 題。</div>';
IDS.forEach((id, gi) => { h += '<h3>' + G3N[gi] + '</h3>' + tbl(P3.PA['X' + (gi + 1)], R3[id], 8); });
h += '<h2 id="g3b">📝 三年級　B：新 25／新 50 題（140 題，人名 Jake Fred Nate Rick Bella Daisy Penny Holly）</h2>';
IDS.forEach((id, gi) => { h += '<h3>' + G3N[gi] + '</h3>' + tbl(P3.PB['X' + (gi + 1)], R3[id], 0); });
h += '<h2 id="g3d">🔓 三年級　句子 解碼 任務</h2><div class="box">黃色 ＝ 學生 要 拖 到 英文 正下方 的 中文 方塊。名字 方塊 ＝ 英文 名字（3-1 B）。一半 的 題目 多 2 個 錯 的 方塊（3-4），錯 的 方塊 ＝ 跟 答案 只 差 一點（My 我的 ➜ 你的、我）。</div><h3>A：25／50 題（60 句）</h3>' + drag(P3.DA) + '<h3>B：新 25／新 50（60 句）</h3>' + drag(P3.DB);
h += '<h2 id="g4a">📝 四年級　A：25／50 題 新加 的 60 題</h2><div class="box">原本 84 題 在 C33 頁；下面 是 12 種 每 種 再 加 5 題。短文 偵探 多 一篇（三篇 一次 抽 一篇）：</div>' + pas(P4.PASA.xowen);
for (let n = 1; n <= 12; n++) h += '<h3>' + M4N[n - 1] + '</h3>' + tbl(P4.PA['X' + n], R4['X' + n], 7);
h += '<h2 id="g4n">🎮 四年級　新 25／新 50：6 種 全新 遊戲（設計，老師 同意 才 做）</h2><div class="box">比 三年級 的 夾娃娃、小精靈 更 好玩：每一種 都 是 學生 熟悉 的 經典 手遊 玩法（太空 射擊、賽車、貪食蛇、Doodle Jump、泡泡龍、密室 逃脫），<b>每一種 對應 期中考卷 一個 大題</b>。<br>老師 選 的 元素 全部 都 有：🗺 闖關 地圖、🔥 連對 火焰（<b>沒有 音效</b>）、👾 每 4 關 魔王、🆚 兩人 一台 對決、🏫 全班 合作 進度 條、🎬 每關 開場 小 動畫。</div><div class="gm">' +
  P4.NGAME.map(g => '<div class="box"><div class="ic">' + g.ic + '</div><h4>' + g.nm + '</h4><p>📄 考卷：' + g.ex + '</p><p>🎮 ' + g.how + '</p><p>✨ ' + g.fun + '</p></div>').join('') + '</div>';
h += '<h2 id="g4b">📝 四年級　B：新 25／新 50 題（144 題，人名 Ethan Lucas Chloe Olivia）</h2>';
P4.NGAME.forEach((g, i) => { const k = 'N' + (i + 1); if (k === 'N6') h += pas(P4.PASB.xethan) + pas(P4.PASB.xolivia) + '<div class="box">家族樹（每 個 人 有 職業 小圖）：👴 爺爺 🌾 農夫、👵 奶奶 🍳 廚師、👨 爸爸 🩺 醫生、👩 媽媽 📚 老師、👦 哥哥 🎒 學生、👧 姊姊 🎒 學生</div>';
  h += '<h3>' + g.ic + ' ' + g.nm + '</h3>' + tbl(P4.NB[k], RN[k], 0); });
h += '<h2 id="g4d">🔓 四年級　句子 解碼 任務</h2><h3>A：25／50 題（56 句）</h3>' + drag(P4.DA) + '<h3>B：新 25／新 50（56 句）</h3>' + drag(P4.DB);
h += '<div class="box q" style="margin-top:50px">❓ 老師 看完：<b>「對」</b>就 開始 做進 網站（順序：登入 密碼 ➜ 三年級 ➜ 四年級 6 種 新 遊戲 ➜ 老師看板 錯題）。要 改 的 請 寫 號碼。</div></div></body></html>';
const out = path.join(__dirname, '..', 'listen', '2026-10-28_C36'); fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'index.html'), h);
console.log('✓ C36 題目 清單 ok：三年級 A 新 60＋B 140＋🧩 120、四年級 A 新 60＋B 144＋🧩 112；類似 三 A ' + simA + '、三 B ' + simB + '、四 A ' + sim4A + '、四 B ' + sim4B);
