/* G3 - L1 + L2/_audio.js — 把這一課會唸到的英文全部做成語音檔（使用者 2026-09-25 指定：美式英語自然正確的語調）
 *
 *   TTS_MODELS=<模型資料夾> node "G3 - L1 + L2/_audio.js"
 *
 * 瀏覽器內建語音的語調常常不自然（一個字一個字、句尾沒有上揚或下降），
 * 所以這一課的句子、單字、題目答案，全部先用神經語音（Kokoro，美式女聲）做成 mp3，放在 audio/。
 * 網頁唸英文時先查 audio/aud.js，查得到就播音檔；查不到（例如以後新加的句子還沒重做）才用瀏覽器語音。
 * 改了 _data.js／_quiz_data.js／_game_data.js 以後要重跑這一支（只會做新的句子，舊的不重做）。
 */
const path = require('path');
const D = require('./_data'), Q = require('./_quiz_data'), G = require('./_game_data');
const { pack } = require('../tools/audio_pack');

const T = [];
const add = s => { if (s && /[A-Za-z]/.test(String(s))) T.push(String(s)); };
const CON = /^['’](s|m|re)$/;
const plain = tk => tk.map(t => t.tight ? t.en : ' ' + t.en).join('').trim();
const words = tk => tk.forEach((t, i) => add(CON.test(t.en) && i ? tk[i - 1].en + "'" + t.en.slice(1) : (t.say || t.en)));
const spk = s => String(s).replace(/[➜…]/g, ' ');
/* 一串 token：整句、每一個字，再加上每一個替換字換進去以後的整句 */
function list(tk) {
  if (!tk) return;
  add(plain(tk)); words(tk);
  const sl = tk.filter(t => t.slot)[0];
  if (sl && D.SUB[sl.slot]) D.SUB[sl.slot].basic.concat(D.SUB[sl.slot].adv).forEach(w => {
    const tt = tk.map(t => t.slot ? Object.assign({}, t, { en: w[0] }) : t);
    add(plain(tt)); add(w[0]);
  });
}
D.U1.concat(D.U2).forEach(c => {
  ['tk', 'a', 'b', 'c', 'qtk', 'atk', 'st', 'qu'].forEach(k => list(c[k]));
  if (c.type === 'pair') { add(plain(c.qtk) + ' ' + plain(c.atk)); }
  if (c.type === 'morph') add(c.say);
  if (c.type === 'focus') { c.rows.forEach(r => add(spk(r[0]))); add(c.rows.map(r => spk(r[0])).join(' ')); add(c.rows.map(r => spk(r[0])).join(', ')); }
  if (c.type === 'echo') c.rows.forEach(r => { add(r.q); add(r.a); add(r.q + ' ' + r.a); r.q.split(' ').concat(r.a.split(' ')).forEach(add); });
  if (c.type === 'order') { add(c.say); c.enRow.forEach((x, n) => add(CON.test(x[0]) && n ? c.enRow[n - 1][0] + "'" + x[0].slice(1) : x[0])); }
  const s = c.scene; if (s) { if (!s.bzh) add(s.b); add(s.b2); }
});
/* 複習題：答錯頁會唸正確答案 */
D.RV1.concat(D.RV2).forEach(g => g.q.forEach(q => add(q.o[0])));
/* 暖身題：聽力題的句子、正確答案 */
Q.Q.forEach(q => { add(q.say); add(q.o[q.a != null ? q.a : 0]); });
/* 遊戲：每一種遊戲會唸出來的東西 */
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const fillBl = (txt, w) => String(txt).replace(/___/g, (m, off, all) => {
  const pre = all.slice(0, off); return (/^\s*$/.test(pre) || /[.?!]\s*$/.test(pre)) ? cap(w) : w; });
const joinS = a => a.join(' ').replace(/ ([?.,!])/g, '$1').replace(/ (['’]s)/g, '$1');
G.G1.concat(G.G10).forEach(c => c.o.forEach(add));
G.G2.forEach(c => { add(fillBl(c.txt, c.a)); add(fillBl(c.txt, c.a === 'I' ? 'my' : 'I')); });
G.G3.forEach(c => { c.s.forEach(add); add(joinS(c.s)); });
G.G4.forEach(c => { add(c.f); c.o.forEach(add); });
G.G5.forEach(c => { add(c.s); c.o.forEach(add); });
G.G6.forEach(p => add(p[0]));
G.G7.forEach(c => { add(joinS(c.w)); if (c.b >= 0) { const w = c.w.slice(); w[c.b] = c.fix; add(joinS(w)); } });
G.G8.forEach(c => c.o.forEach(o => add((c.b + ' ' + o + ' ' + c.a).replace(/ ([?.,])/g, '$1'))));
G.G9.forEach(c => add(c[0]));

/* 句子重音（使用者 2026-09-26 指定）：數字是 content word，音高比較高（stressed）；years old 是 function words，唸得比較輕。
   + ＝ 重音、- ＝ 輕讀，做法見 tools/stress.py */
['six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'].forEach(n => {
  T.push("I'm +" + n + ' -years -old.', 'I am +' + n + ' -years -old.', "I'm +" + n + '.', 'I am +' + n + '.');
});
/* Review 1（2026-09-26 新增）：每一句、每一個替換字換進去的句子 */
(D.XPAGES || []).forEach(P => (P.cards || []).forEach(c => {
  list(c.tk); const s = c.scene; if (s) { add(s.b); add(s.b2); }
}));
(D.XPAGES || []).forEach(P => (P.rv || []).forEach(g => g.q.forEach(q => add(q.o[0]))));
const r = pack({ texts: T, dir: path.join(__dirname, 'audio'), lang: 'en', varName: 'AUD' });
console.log('語音檔：' + r.total + ' 句（這次新做 ' + r.made + ' 句）');
