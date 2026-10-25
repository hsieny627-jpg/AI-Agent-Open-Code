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
process.exit(bad / n > .03 || bad2 / n2 > .03 || bad3 / n3 > .01 ? 1 : 0);
