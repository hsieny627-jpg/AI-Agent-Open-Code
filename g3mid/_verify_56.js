/* g3mid/_verify_56.js — 第五十六次：大寫 J 沒有 一橫 ＝ 算 錯（老師 第五十五次 問題 3 選 乙）。只 印 失敗 項 */
const { HW } = require('./_hw.js'); const fs = require('fs');
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const kid = (st, lv) => st.map(s => s.map(([x, y]) => [x * (1 + (rnd() - .5) * .2 * lv) + (rnd() - .5) * .05 * lv, y + (rnd() - .5) * .05 * lv]));
let n = 0, f = 0; const ok = (c, m) => { n++; if (!c) { f++; console.log('✗', m); } };
const [bar, plain] = HW.T.J;
for (let lv = 1; lv <= 2; lv++) for (let k = 0; k < 40; k++) { ok(HW.jbar(kid(bar, lv)), '有 橫 的 J 被 判 沒 橫 lv' + lv); ok(!HW.jbar(kid(plain, lv)), '沒 橫 的 J 被 判 有 橫 lv' + lv); }
const B = fs.readFileSync(__dirname + '/_build.js', 'utf8');
ok(/q\.want==='J'&&!HW\.jbar\(sk\)/.test(B)||/want==='J'&&!HW\.jbar\(sk\)/.test(B), '寫字 判斷 沒有 接 J 一橫');
ok(/大寫 <b>J<\/b> 上面 少了 <b>一橫<\/b>/.test(B), '答錯頁 沒有 說 少了 一橫');
console.log(`g3mid 第五十六次 J 一橫：${n} 項，${f} 個 失敗`); process.exit(f ? 1 : 0);
