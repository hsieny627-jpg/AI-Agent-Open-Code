/* g3mid/_hw_test.js — 手指寫字的電腦改作業 量測：每一個字母、每一種寫法，做 歪一點／大一點小一點／抖一點 的 假手寫，看 改得對不對
 *   node g3mid/_hw_test.js     只印 失敗 的 字母 和 一行 總結 */
const { HW } = require('./_hw.js');
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function kid(strokes, lv) {
  const sc = 1 + (rnd() - .5) * .3 * lv, sl = (rnd() - .5) * .3 * lv, dy = (rnd() - .5) * .3 * lv, dx = rnd() * 2, sx = 1 + (rnd() - .5) * .4 * lv;
  const cy = 1.5;
  return strokes.map(s => s.map(([x, y]) => { const yy = cy + (y - cy) * sc + dy; return [dx + x * sc * sx + (cy - yy) * sl + (rnd() - .5) * .06 * lv, yy + (rnd() - .5) * .06 * lv]; }).filter(() => rnd() > .1 * lv));
}
const letters = Object.keys(HW.T); let n = 0, bad = 0; const fails = {};
for (const lv of [1, 2]) for (const ch of letters) HW.T[ch].forEach(v => { for (let k = 0; k < 12; k++) { const s = kid(v, lv); n++; const j = HW.judge(s, ch); if (!j.ok) { bad++; fails[ch] = (fails[ch] || []); fails[ch].push(j.got + '(lv' + lv + ')'); } } });
/* 寫成另一個大小寫 一定 要 判錯（大小寫 只差 位置 的字） */
let n2 = 0, bad2 = 0; const f2 = [];
for (const ch of letters) { const P = ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase(); HW.T[ch].forEach(v => { for (let k = 0; k < 6; k++) { n2++; if (HW.judge(kid(v, 1), P).ok) { bad2++; f2.push(ch + '→要' + P); } } }); }
/* 寫了別的字母（不是大小寫）卻判對 ＝ 冤枉 的 反面：放水 */
let n3 = 0, bad3 = 0; const f3 = {};
for (const ch of letters) for (const w of letters) { if (w === ch || w.toLowerCase() === ch.toLowerCase() || (w + ch === 'Il' || w + ch === 'lI')) continue;  /* 大寫 I 和 小寫 l 都是 一條直線、一樣高，本來就 一模一樣 */ for (let k = 0; k < 2; k++) { n3++; if (HW.judge(kid(HW.T[ch][0], 1), w).ok) { bad3++; f3[ch + '→' + w] = 1; } } }
Object.keys(fails).forEach(k => console.log('✗ ' + k + ' 被看成 ' + fails[k].slice(0, 8).join(' ') + (fails[k].length > 8 ? ' …共' + fails[k].length : '')));
if (f2.length) console.log('✗ 大小寫寫錯卻判對：' + f2.slice(0, 30).join(' ') + (f2.length > 30 ? ' …' : ''));
if (bad3) console.log('✗ 寫成別的字母卻判對：' + Object.keys(f3).join(' '));
console.log('改作業：寫對的 ' + (n - bad) + '／' + n + ' 判對（' + (100 * (n - bad) / n).toFixed(1) + '%）；大小寫寫錯 ' + (n2 - bad2) + '／' + n2 + ' 判錯；寫成別的字母 ' + (n3 - bad3) + '／' + n3 + ' 判錯');
/* 2026-10-25 第二十五次（老師第 4、5 點）頂天立地、不超線：標準寫法＋左右寬窄不一樣＋抖一點 要 過；整個 浮起來／沉下去 0.25 格、上下 壓扁 7 成 要 不過 */
let n4 = 0, bad4 = 0; const f4 = [];
for (const ch of letters) HW.T[ch].forEach((v, vi) => {
  for (let k = 0; k < 6; k++) { n4++; const sx = .8 + rnd() * .6, dx = rnd() * 2, j = v.map(s => s.map(([x, y]) => [x * sx + dx + (rnd() - .5) * .05, y + (rnd() - .5) * .1])); if (!HW.lines(j, ch).ok) { bad4++; f4.push(ch + vi + ' 對的 不過：' + HW.lines(j, ch).words); } }
  for (const f of [s => s.map(([x, y]) => [x, y - .6]), s => s.map(([x, y]) => [x, y + .6]), s => s.map(([x, y]) => [x, 1.5 + (y - 1.5) * .3])])   /* 2026-10-31 第三十五次 第 4 點：放寬 以後 ＝ 0.6 格、壓扁 3 成 才 一定 錯 */ { n4++; if (HW.lines(v.map(f), ch).ok) { bad4++; f4.push(ch + vi + ' 浮起來／沉下去／壓扁 還 過'); } } });
/* 2026-10-31 第三十五次 第 4 點：像 真的 小朋友 用 手指 寫（整個 偏 上下 0.2 格、大一點 小一點 2 成、抖 0.25 格）➜ 至少 9 成 要 判 對（線 和 形狀 都 過）*/
let n5 = 0, ok5 = 0; const f5 = {};
/* 2026-10-31 第三十六次 第 6 點：頂天立地 改 嚴（頭、腳 0.17 格）➜ 這裡 量「有 碰到 線 的 手指 寫」（偏 ±0.07、大小 ±6%、形狀 歪、抖）至少 9 成 判 對 */
for (const ch of letters) HW.T[ch].forEach(v => { for (let k = 0; k < 8; k++) { n5++; const dy = (rnd() - .5) * .14, sy = .94 + rnd() * .12, sx = .8 + rnd() * .5, dx = rnd() * 2, cy = (HW.body(v).t + HW.body(v).b) / 2;
  const j = v.map(s => s.map(([x, y]) => [x * sx + dx + (rnd() - .5) * .12, cy + (y - cy) * sy + dy + (rnd() - .5) * .12]));
  const a = HW.judge(j, ch), b = HW.judge(j, ch, 1), l = HW.lines(j, ch), P = ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase();
  if ((a.ok || (b.ok && l.ok && a.got !== P)) && l.ok) ok5++; else f5[ch] = (f5[ch] || 0) + 1; } });
console.log('像 真的 手指 寫：' + ok5 + '／' + n5 + ' 判對（' + (100 * ok5 / n5).toFixed(1) + '%）' + (Object.keys(f5).length ? '　錯 最多：' + Object.entries(f5).sort((a, b) => b[1] - a[1]).slice(0, 8).map(x => x.join('×')).join(' ') : ''));
if (ok5 / n5 < .9) bad4++;
/* 2026-10-31 第三十六次 第 6 點：頭 和 腳 完全 沒 碰到 線（整個 字 縮小 到 7 成、縮 在 中間）、超出 線 太多（拉長 0.4 格）＝ 一定 要 判 錯，而且 要 說 出 頭／腳 */
let n6 = 0, ok6 = 0; const f6 = [];
for (const ch of letters) HW.T[ch].forEach(v => { const b = HW.body(v), cy = (b.t + b.b) / 2, hh = (b.b - b.t) / 2 || 1;
  [s => s.map(([x, y]) => [x, cy + (y - cy) * .7]), s => s.map(([x, y]) => [x, cy + (y - cy) * (1 + .4 / hh)])].forEach((f, fi) => { n6++; const l = HW.lines(v.map(f), ch);
    if (!l.ok && /頭|腳/.test(l.words)) ok6++; else f6.push(ch + (fi ? ' 超出' : ' 沒碰到') + '：' + (l.ok ? '判 對' : l.words)); }); });
console.log('沒 碰到／超出 太多：' + ok6 + '／' + n6 + ' 判錯 並 說出 頭／腳' + (f6.length ? '　✗ ' + f6.slice(0, 12).join('｜') : ''));
if (ok6 / n6 < .97) bad4++;
if (f4.length) console.log('✗ 頂天立地：' + f4.slice(0, 20).join('｜'));
console.log('頂天立地：' + (n4 - bad4) + '／' + n4 + ' 判對');
process.exit(bad4 || bad / n > .03 || bad2 / n2 > .03 || bad3 / n3 > .01 ? 1 : 0);
