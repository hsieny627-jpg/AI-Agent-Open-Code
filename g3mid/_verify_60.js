/* g3mid/_verify_60.js — 2026-11-18 第六十次 老師 6：Apple Pencil 寫字 退步（手掌 碰到 螢幕）
 *   ① 每 一個 字母 的 標準 寫法＋手掌 碰到 的 小 點／小 線（在 格子 外面）＝ 還是 判 對、不會 說「超出」
 *   ② i j 的 點 不會 被 拿掉　③ 網頁 的 手寫板 有 防 手掌（用 過 筆 以後 手指 不 算、同 時間 只 收 一個 指頭）
 *   node g3mid/_verify_60.js   只 印 失敗 */
const { HW } = require('./_hw.js'); const fs = require('fs'); let n = 0, bad = [];
const ok = (c, m) => { n++; if (!c) bad.push(m); };
const palms = [[[0.4, 3.55], [0.45, 3.6]], [[1.2, 3.7]], [[0.2, -0.6], [0.3, -0.62]]];
Object.keys(HW.T).forEach(ch => { const st = HW.T[ch][0].map(s => s.map(p => p.slice()));
  const j0 = HW.judge(st, ch), l0 = HW.lines(st, ch);
  palms.forEach((pm, i) => { const sk = st.concat([pm]); const j = HW.judge(sk, ch), l = HW.lines(sk, ch);
    ok(j.ok === j0.ok, ch + ' 手掌' + i + ' 字形 判斷 變了'); ok(l.ok === l0.ok && !l.over.length, ch + ' 手掌' + i + ' 被 說 超出：' + l.words); }); });
['i', 'j'].forEach(ch => { const st = HW.T[ch][0]; ok(HW.clean(st).length === st.length, ch + ' 的 點 被 拿掉 了'); });
const B = fs.readFileSync(__dirname + '/_build.js', 'utf8');
ok(/pointerType==='pen'\)window\.__HWPEN=1/.test(B) && /__HWPEN&&e\.pointerType==='touch'\)return/.test(B), '手寫板 沒有 防 手掌');
ok(/e\.pointerId!==pid\)return/.test(B), '手寫板 沒有 只 收 一個 指頭');
bad.slice(0, 20).forEach(m => console.log('✗ ' + m));
console.log((bad.length ? '❌' : '✅') + ' 第六十次 字母 書寫 防 手掌：' + n + ' 項，' + bad.length + ' 個 失敗');
