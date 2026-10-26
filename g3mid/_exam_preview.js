/* g3mid/_exam_preview.js — 產生 給 老師 看 的 題目 清單 listen/2026-10-26_C33/index.html（2026-10-26 第二十八次 第 1～4 點）
 *   node g3mid/_exam_preview.js
 * 內容：📝 三年級 複習、📝 四年級 複習 的「25 題／50 題 挑戰」題庫（g3mid/_exam_data.js、midterm/_exam_data.js），每一題 標 🔁 類似／🆕 全新。
 * 老師 選「全新出題（建議）」：已經 做進 網站，老師 看到 要 改 的 再 說。 */
const fs = require('fs'), path = require('path');
const D3 = require('./_data.js'), D4 = require('../midterm/_data.js');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '’');
const NUMZ = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const SCN = { thank: '🎁 謝謝／不客氣', meet: '🤝 很高興認識你', help: '🔍 找不到狗，幫忙', come: '👋 過來這裡', morn: '🌅 早安' }, CEM = {}; D3.CE.forEach(c => { CEM[c.k] = c; });
const card = c => c.sc ? SCN[c.sc] : '🏷 ' + c.t + '　🎂 ' + c.a;
const pic = k => /^w:/.test(k) ? D3.PHM[k.slice(2)][2] + ' ' + k.slice(2) : '📷 ' + CEM[k].zh.replace('。', '');
/* 三年級：一題 ➜ [題目, 正解, 誘答] */
const F3 = {
  q1: q => ['🔊 ' + q.say + '（' + q.ic + '）　敲 <b>大寫</b>', q.o[0], q.o.slice(1).join('　')],
  q2: q => ['🔊 ' + q.say.map(x => esc(x[1])).join('　'), card(q.o[0]), q.o.slice(1).map(card).join('<br>')],
  q3: q => ['🔊 ' + esc(q.say), pic(q.o[0]), q.o.slice(1).map(pic).join('<br>')],
  q4: q => ['🔊 ' + q.say + '（' + q.ic + '）', '✍️ ' + q.want + '（大寫）', '（點 圖：另外 2 個 圖）'],
  q5: q => ['🔊 聽 字母「' + q.say + '」（不給 看）', '✍️ ' + q.want + (q.want === q.want.toUpperCase() ? '（大寫）' : '（小寫）'), '—'],
  q6: q => [(q.ctx === 'cake' ? '🎂 蛋糕 上 ' + q.n + ' 根 蠟燭（I’m ___ years old.）' : q.ctx === 'dice' ? '🎲 骰子 ' + q.n + ' 點' : q.obj + ' ✕ ' + q.n), q.want + '（' + NUMZ[q.n] + '）', '多 的 磚：' + q.extra.join('　')],
  q7: q => [esc(q.s) + '<br><small>' + q.zh + '</small>', esc(q.o[0]), esc(q.o[1]) + '　' + esc(q.o[2])],
  q8: q => [(q.rev ? '↩ 反派 回答：' + esc(q.b) : '反派：' + esc(q.a)), esc(q.o[0]), q.o.slice(1).map(esc).join('<br>')],
  q9: q => [q.lines.map(esc).join('<br>'), q.c.map((p, i) => (q.bl[i] === 'n' ? '<b>' + p.t + '</b>' : p.t) + ' ' + (q.bl[i] === 'a' ? '<b>' + p.a + '</b>' : p.a)).join('<br>') + '<br><small>（粗字 ＝ 空格）</small>', '多 放：' + q.tl.slice(3).join('、')],
  q10: q => ['🔊 ' + esc(q.say), q.code, q.o.slice(1).join('　')]
};
const F4 = q => [esc(q.q) + (q.pic && q.pic !== 1 ? '<br><small>圖：' + D4.picZh(q.pic) + '</small>' : ''), esc(q.oz ? q.oz[0] : q.o[0]), (q.oz || q.o).slice(1).map(esc).join('<br>')];
let h = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>25／50 題 題目 C33</title><style>
:root{color-scheme:dark}*{box-sizing:border-box}
body{margin:0;background:#05070A;color:#fff;font-family:"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 140px;font-size:26px;line-height:1.55;font-weight:700}
.wrap{max-width:1280px;margin:0 auto}h1{font-size:42px;color:#FFD54A;margin:22px 0 6px}
h2{font-size:38px;color:#FFD54A;margin:60px 0 10px;border-top:4px solid #24303C;padding-top:22px}h3{font-size:30px;color:#7FD4FF;margin:30px 0 6px}
.box{background:#0B0F14;border:3px solid #24303C;border-radius:22px;padding:16px 20px;margin:18px 0}.ok{background:#0D1B12;border-color:#3BD16F}
table{border-collapse:collapse;width:100%;margin:8px 0}td,th{border:2px solid #2A3540;padding:8px 10px;text-align:left;vertical-align:top;word-break:break-word}
th{background:#14202B;color:#CFE6FF}td small{color:#BFD3E6;font-size:22px}td b{color:#FFE07A}
.s1{display:inline-block;background:#FFB300;color:#111;border-radius:10px;padding:0 10px;white-space:nowrap}.s0{display:inline-block;background:#3BD16F;color:#062;border-radius:10px;padding:0 10px;white-space:nowrap}
.ans{color:#7BF0A8}.how{font-size:22px;color:#BFD3E6}.nav a{display:inline-block;margin:6px 10px 6px 0;padding:6px 16px;border-radius:14px;background:#14202B;color:#FFE07A;text-decoration:none}
.pas{background:#FFF8E6;color:#2A2010;border-radius:18px;padding:10px 18px;font-size:28px}.pas span{display:block}.pas i{font-style:normal;color:#8A5A00;display:inline-block;min-width:4em}
@media (max-width:700px){body{font-size:22px}h1{font-size:32px}h2{font-size:30px}td,th{padding:6px}}
</style></head><body><div class="wrap">
<h1>📝 25 題／50 題 挑戰：全部 題目</h1>
<div class="box ok"><b>已經 放進 網站</b>（總首頁〔📝 三年級 複習〕〔📝 四年級 複習〕➜ 大廳 最上面 兩顆 金色 按鈕）。老師 看到 要 改 的 題目，請 寫「幾 年級、哪一個 遊戲、第 幾 題、改 成 什麼」。<br>
<span class="s1">🔁 類似</span>：考 的 <b>重點</b> 跟 期中考 某一題 一樣，但是 字、句子、選項、問法 不一樣。<span class="s0">🆕 全新</span>：期中考 <b>沒有 考</b> 的 字、句子、問法（還是 在 期中考 範圍）。<br>
每一次 玩 都 <b>重新 抽</b>：25 題 ＝ 🔁 8 題（32%）＋ 🆕 17 題；50 題 ＝ 🔁 15 題（30%）＋ 🆕 35 題；每一關 題數 平均（三年級 25 題 ＝ 5 關 3 題、5 關 2 題；50 題 ＝ 每關 5 題｜四年級 25 題 ＝ 1 關 3 題、11 關 2 題；50 題 ＝ 2 關 5 題、10 關 4 題）。<br>
✔ 電腦 檢查 過：跟「三年級／四年級 複習」、課堂複習 草稿、短文偵探 草稿 <b>沒有 一樣 的 題目</b>；人名 都 是 新的（三年級 Bill、Mark、Luke、Adam、Sally、Helen、Molly、Ruby；四年級 Owen、Jason、Emily、Nora）。</div>
<div class="nav"><a href="#g3">📝 三年級（10 種 ✕ 8 題）</a><a href="#g4">📝 四年級（12 種 ✕ 7 題）</a></div>`;
const row = (i, sim, r) => '<tr><td>' + (i + 1) + '</td><td>' + (sim ? '<span class="s1">🔁 類似</span>' : '<span class="s0">🆕 全新</span>') + '</td><td>' + r[0] + '</td><td class="ans">' + r[1] + '</td><td>' + r[2] + '</td></tr>';
const TH = '<table><tr><th style="width:3em">#</th><th style="width:5.5em"></th><th>題目</th><th>✅ 正解</th><th>誘答</th></tr>';
h += '<h2 id="g3">📝 三年級 複習　25 題／50 題</h2>';
D3.GAMES.forEach(g => { const L = D3.XB[g.id]; h += '<h3>' + g.ic + ' ' + g.nm + '　<span class="how">🔁 ' + L.filter(q => q.sim).length + '　🆕 ' + L.filter(q => !q.sim).length + '</span></h3>' + TH + L.map((q, i) => row(i, q.sim, F3[g.id](q))).join('') + '</table>'; });
h += '<h2 id="g4">📝 四年級 複習　25 題／50 題</h2>';
D4.GAMES.forEach(g => { const L = D4.XB[g.id];
  if (g.id === 'm8') Object.keys(D4.PAS).filter(k => /^x/.test(k)).forEach((k, j) => { const A = D4.PAS[k];
    h += '<h3>🕵️ 短文 偵探 第 ' + (j + 1) + ' 篇：' + A.title + '（一次 只 抽 一篇，先 讀 20 秒）</h3><div class="pas">' + A.t.map((t, i) => '<span><i>' + A.sp[i] + ':</i> ' + esc(t) + '</span>').join('') + '</div><div class="box">' + A.z.map((z, i) => A.sp[i] + '：' + z).join('<br>') + '</div>'; });
  h += '<h3>' + g.ic + ' ' + g.nm + '　<span class="how">🔁 ' + L.filter(q => q.sim).length + '　🆕 ' + L.filter(q => !q.sim).length + '</span></h3>' + TH + L.map((q, i) => row(i, q.sim, F4(q))).join('') + '</table>'; });
h += '</div></body></html>';
const out = path.join(__dirname, '..', 'listen', '2026-10-26_C33'); fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'index.html'), h);
console.log('題目 清單 ok：listen/2026-10-26_C33/（三年級 ' + Object.values(D3.XB).reduce((a, b) => a + b.length, 0) + ' 題、四年級 ' + Object.values(D4.XB).reduce((a, b) => a + b.length, 0) + ' 題）');
