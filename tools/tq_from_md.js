/* tools/tq_from_md.js — 把使用者確認過的題目清單（sentences/2026-10-04_B_複習題_題目清單.md）
 * 一字不改轉成兩個網站的資料檔（2026-10-04 對話 B）：
 *   node tools/tq_from_md.js   ➜  G3 - L1 + L2/_tq_data.js、sentences/_tq_data.js
 * 題目要改：改清單檔 ➜ 跑這支 ➜ build。不要手改 _tq_data.js。
 *
 * 一題：{k:'read'|'listen'|'zh2en'|'en2zh'|'trap', q:題目, show:畫面上的英文（認讀）, say:要唸的英文（聽力）,
 *        o:[正解, 誘答 ×3], h:為什麼, sp:答錯頁唸什麼（''＝不唸；沒有這一欄 ＝ 唸正解）}
 * 錯的英文不唸（使用者 2026-10-04）：認讀題的 🔊 選項必須全部是正確的英文（清單已照這樣寫）；
 *   答錯頁只唸正確答案；正解是字母（h、gh）或混了中文的，不唸（sp:''），例外寫在 SP。
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const md = fs.readFileSync(path.join(ROOT, 'sentences/2026-10-04_B_複習題_題目清單.md'), 'utf8');
const KIND = { '認讀': 'read', '聽力': 'listen', '看中文選英文': 'zh2en', '看英文選中文': 'en2zh', '易錯': 'trap' };
const SP = { 'Yes, he is. 的 he is': 'Yes, he is.' };
const out = { g3: {}, g4: {} };
let site = null, cur = null;
const B = s => s.replace(/\*\*([^*]+)\*\*/g, '<b class="em">$1</b>');
md.split('\n').forEach(line => {
  if (/^## 三、/.test(line)) site = 'g3';
  else if (/^## 四、/.test(line)) site = 'g4';
  else if (/^## (五|六)、/.test(line)) site = null;
  let m;
  if ((m = /^### Unit (\d) · (\d(?:-\d)?)/.exec(line)) && site) {
    const lv = /· 基礎/.test(line) ? 'b' : (/· 進階/.test(line) ? 'a' : '');
    const u = 'u' + m[1]; out[site][u] = out[site][u] || {};
    cur = out[site][u][m[2] + lv] = [];
  } else if ((m = /^### (三|四)年級 Unit (\d) 縮寫動畫/.exec(line))) {
    const s = m[1] === '三' ? 'g3' : 'g4', u = 'u' + m[2]; out[s][u] = out[s][u] || {};
    cur = out[s][u].r4 = [];
  } else if (/^### /.test(line)) cur = null;
  if (!cur || !/^\| (認讀|聽力|看中文選英文|看英文選中文|易錯) \|/.test(line)) return;
  const c = line.split('|').slice(1, -1).map(x => x.trim());
  const k = KIND[c[0]], p = c[1], ok = c[2].replace(/^🔊 /, ''), bad = c[3].split('／').map(x => x.replace(/^🔊 /, '').trim());
  if (bad.length !== 3) throw new Error('誘答不是 3 個：' + line);
  const q = { k, o: [ok].concat(bad), h: c[4] };
  if (k === 'read') {
    const s = /\*\*(.+?)\*\*/.exec(p); if (!s) throw new Error('認讀題沒有粗體英文：' + line);
    q.show = s[1]; q.q = '🔊 聽 1～4，哪一個唸的是它？';
  } else if (k === 'listen') {
    const s = /^🔊 ([^，（]+?)(（[^）]*）)?(，(.+))?$/.exec(p); if (!s) throw new Error('聽力題格式：' + line);
    q.say = s[1].replace(/\*\*/g, '').trim(); q.q = s[4] ? (s[2] ? s[2].replace(/[（）]/g, '') + '，' : '') + B(s[4]) : '你聽到哪一句？';
  } else if (k === 'zh2en') q.q = /[？?]$/.test(p) && !/」$/.test(p) ? B(p) : B(p) + '　英文是？';
  else if (k === 'en2zh') q.q = /[㐀-鿿]/.test(p) ? B(p) : '「' + p + '」　中文是？';
  else q.q = B(p);
  if (SP[ok] != null) q.sp = SP[ok];
  else if (/➜/.test(ok)) q.sp = ok.replace(/ ➜ /g, ' ').replace(/ ’/g, '’');   /* 語序題的正解（What’s ➜ your ➜ name?）照整句唸 */
  else if ((k !== 'en2zh' && /[㐀-鿿]/.test(ok)) || /字母/.test(p)) q.sp = '';
  cur.push(q);
});
const ORDER = ['read', 'listen', 'zh2en', 'en2zh', 'trap'];
[['g3', 'G3 - L1 + L2'], ['g4', 'sentences']].forEach(([s, dir]) => {
  let n = 0;
  Object.keys(out[s]).forEach(u => Object.keys(out[s][u]).forEach(key => {
    const a = out[s][u][key];
    if (a.length !== 5 || a.some((q, i) => q.k !== ORDER[i])) throw new Error(s + ' ' + u + ' ' + key + '：不是五種題型各一題');
    a.forEach(q => { if (new Set(q.o).size !== 4) throw new Error('選項重複：' + q.o.join(' / ')); });
    n += 5;
  }));
  fs.writeFileSync(path.join(ROOT, dir, '_tq_data.js'),
    '/* 由 tools/tq_from_md.js 從 sentences/2026-10-04_B_複習題_題目清單.md 產生，不要手改。\n' +
    ' * 每個分頁最後面的 5 題複習題（2026-10-04 使用者確認）：u1／u2 ➜ 分頁（1-1b ＝ 1-1 基礎、1-1a ＝ 1-1 進階、r4 ＝ 在家複習的縮寫動畫） */\n' +
    'module.exports = ' + JSON.stringify(out[s], null, 1) + ';\n');
  console.log(dir + '/_tq_data.js：' + n + ' 題');
});
