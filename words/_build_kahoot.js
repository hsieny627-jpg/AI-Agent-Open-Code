/* words/_build_kahoot.js — Kahoot 匯入檔的產生器
 *
 * 用法： node words/_build_kahoot.js
 * 產出： kahoot_family_20.xlsx（放在專案根目錄，覆蓋舊檔）
 *
 * 題目來源是 words/_quiz_data.js，和網頁版 quiz.html 同一份，兩邊不會走鐘。
 *
 * Kahoot 官方「Import spreadsheet」樣板的硬規定（超過就會被退件）：
 *   - 題目最多 95 字、每個選項最多 60 字
 *   - 時間只能選 5 / 10 / 20 / 30 / 60 / 90 / 120 秒 —— **沒有 50 秒這個選項**
 *     課堂用的網頁版是 50 秒；Kahoot 這邊只能選最接近的 60 秒。
 *   - 匯入檔**帶不進「雙倍分數」**，6 題挑戰題要在 Kahoot 編輯器裡手動設定
 *     （做法寫在 kahoot_20_題目與上架說明.md）
 * 本腳本會在超過字數時直接報錯，不會默默產出一個匯不進去的檔。
 *
 * xlsx 就是一個 zip，為了零相依，下面自己寫了一個最小的 ZIP 產生器（store，不壓縮）。
 */
const fs = require('fs'), path = require('path');
const { Q, shuffle } = require('./_quiz_data');

const OUT = path.join(__dirname, '..', 'kahoot_family_20.xlsx');
const TIME = 60;   // Kahoot 沒有 50 秒；60 秒是最接近的合法值

/* ---------- 檢查 Kahoot 的字數上限 ---------- */
const ALL = shuffle(Q);
const bad = [];
ALL.forEach((q, n) => {
 if ([...q.q].length > 95) bad.push('第 ' + (n + 1) + ' 題題目 ' + [...q.q].length + ' 字（上限 95）');
 q.o.forEach((o, k) => { if ([...o].length > 60) bad.push('第 ' + (n + 1) + ' 題選項 ' + (k + 1) + ' 共 ' + [...o].length + ' 字（上限 60）'); });
});
if (bad.length) { console.error('Kahoot 字數超過上限：\n' + bad.join('\n')); process.exit(1); }

/* ---------- 產生 sheet1.xml ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const str = (ref, v) => `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
const num = (ref, v) => `<c r="${ref}"><v>${v}</v></c>`;

const HEAD = [
 [2, 'A', 'Quiz template'],
 [3, 'A', '家人單字 暖身 20 題（由 words/_build_kahoot.js 產生，勿手改）'],
 [4, 'A', '題目上限 95 字、選項上限 60 字。時間只能是 5/10/20/30/60/90/120 秒。'],
 [5, 'A', '匯入後，請到編輯器把第 2、5、6、9、12、18 題的 Points 改成 Double points（雙倍分數）。'],
 [6, 'A', '若不是用 Excel 編輯，上傳前要先另存成 .xlsx。']
];

let rows = '<row r="1"></row>';
HEAD.forEach(([r, c, v]) => { rows += `<row r="${r}">${str(c + r, v)}</row>`; });
rows += '<row r="7"></row>';
rows += '<row r="8">' +
 str('A8', 'Question - max 95 characters') +
 str('C8', 'Answer 1 - max 60 characters') +
 str('D8', 'Answer 2 - max 60 characters') +
 str('E8', 'Answer 3 - max 60 characters') +
 str('F8', 'Answer 4 - max 60 characters') +
 str('G8', 'Time limit (sec) - 5,10,20,30,60,90 or 120 secs') +
 str('H8', 'Correct answer(s) - choose at least one') + '</row>';

ALL.forEach((q, n) => {
 const r = 9 + n;
 rows += `<row r="${r}">` + str('A' + r, q.q) +
  ['C', 'D', 'E', 'F'].map((col, k) => str(col + r, q.o[k])).join('') +
  num('G' + r, TIME) + str('H' + r, String(q.a + 1)) + '</row>';
});

const SHEET = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
 '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
 '<sheetData>' + rows + '</sheetData></worksheet>';

const CT = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
 '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
 '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
 '<Default Extension="xml" ContentType="application/xml"/>' +
 '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
 '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
 '</Types>';

const RELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
 '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
 '</Relationships>';

const WB = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
 '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
 '<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>';

const WBRELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
 '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
 '</Relationships>';

/* ---------- 最小 ZIP（store，不壓縮；xlsx 讀得懂） ---------- */
const TAB = (() => { const t = new Int32Array(256);
 for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
const crc32 = buf => { let c = -1; for (let i = 0; i < buf.length; i++) c = TAB[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); return (c ^ -1) >>> 0; };

function zip(entries) {
 const locals = [], central = []; let off = 0;
 for (const [name, text] of entries) {
  const nb = Buffer.from(name, 'utf8'), db = Buffer.from(text, 'utf8'), c = crc32(db);
  const lh = Buffer.alloc(30);
  lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x0800, 6);
  lh.writeUInt16LE(0, 8); lh.writeUInt16LE(0, 10); lh.writeUInt16LE(0x2821, 12);
  lh.writeUInt32LE(c, 14); lh.writeUInt32LE(db.length, 18); lh.writeUInt32LE(db.length, 22);
  lh.writeUInt16LE(nb.length, 26); lh.writeUInt16LE(0, 28);
  locals.push(lh, nb, db);
  const ch = Buffer.alloc(46);
  ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6);
  ch.writeUInt16LE(0x0800, 8); ch.writeUInt16LE(0, 10); ch.writeUInt16LE(0, 12);
  ch.writeUInt16LE(0x2821, 14); ch.writeUInt32LE(c, 16);
  ch.writeUInt32LE(db.length, 20); ch.writeUInt32LE(db.length, 24);
  ch.writeUInt16LE(nb.length, 28); ch.writeUInt16LE(0, 36); ch.writeUInt32LE(0, 38); ch.writeUInt32LE(off, 42);
  central.push(ch, nb);
  off += lh.length + nb.length + db.length;
 }
 const cd = Buffer.concat(central), lo = Buffer.concat(locals);
 const end = Buffer.alloc(22);
 end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8);
 end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(cd.length, 12);
 end.writeUInt32LE(lo.length, 16);
 return Buffer.concat([lo, cd, end]);
}

fs.writeFileSync(OUT, zip([
 ['[Content_Types].xml', CT],
 ['_rels/.rels', RELS],
 ['xl/workbook.xml', WB],
 ['xl/_rels/workbook.xml.rels', WBRELS],
 ['xl/worksheets/sheet1.xml', SHEET]
]));

const x2 = ALL.map((q, n) => q.x2 ? n + 1 : 0).filter(Boolean);
console.log('已產生 kahoot_family_20.xlsx：' + ALL.length + ' 題，每題 ' + TIME + ' 秒（Kahoot 沒有 50 秒）');
console.log('要手動設「雙倍分數」的挑戰題：第 ' + x2.join('、') + ' 題');

/* ---------- 順便產生說明文件（跟題庫同一份資料，不會走鐘） ---------- */
const DOC = path.join(__dirname, '..', 'kahoot_20_題目與上架說明.md');
const list = ALL.map((q, n) => {
 const head = '### ' + (n + 1) + '. ' + (q.x2 ? '⭐雙倍　' : '') + q.q;
 const opts = q.o.map((o, k) => (k === q.a ? '- ✅ ' : '- ') + o).join('\n');
 return head + '\n' + opts + '\n\n> 秒懂說明：' + q.why.replace(/<\/?b>/g, '**');
}).join('\n\n');

fs.writeFileSync(DOC, `# 家人單字 — Kahoot 暖身 20 題

> 本檔由 \`node words/_build_kahoot.js\` 產生，**不要手改**（改題目請改 \`words/_quiz_data.js\`）。
> 題目與網頁版 \`words/quiz.html\` 完全相同，同一份資料產出，不會走鐘。

| 項目 | 內容 |
|---|---|
| 對象 | 國小中年級（四年級） |
| 題數 | 20 題，四選一 |
| 挑戰題 | **第 ${x2.join('、')} 題**，共 ${x2.length} 題，答對**雙倍分數** |
| 匯入檔 | \`kahoot_family_20.xlsx\`（專案根目錄） |
| 每題秒數 | **${TIME} 秒**（見下方「兩個 Kahoot 限制」） |
| 課堂網頁版 | \`words/quiz.html\`（50 秒、含小組討論鎖、答錯秒懂說明） |

---

## 一、兩個 Kahoot 限制（不是漏做，是 Kahoot 本身做不到）

1. **Kahoot 沒有 50 秒這個選項。**
   它只能選 5／10／20／30／60／90／120 秒。匯入檔用**最接近的 60 秒**。
   要剛好 50 秒，就用課堂網頁版 \`words/quiz.html\`。
2. **匯入試算表帶不進「雙倍分數」。**
   ${x2.length} 題挑戰題要在 Kahoot 編輯器裡**手動設定**，做法見第三節。

---

## 二、20 題全文（✅ 是正確答案）

${list}

---

## 三、上架步驟（約 5 分鐘）

1. 開 **kahoot.com**，登入帳號。
2. 右上角 **Create** → 選 **Quiz**。
3. 選 **Blank canvas**（空白），不要套版。
4. 打標題：**家人單字 暖身 20 題**。
5. 左邊 **Add question** → **Import spreadsheet**。
6. **Select file** → 選 \`kahoot_family_20.xlsx\` → **Upload**。
7. 左邊列表跑出 **20 題**就成功了。

### 把 ${x2.length} 題挑戰題設成雙倍分數

1. 點開**第 ${x2[0]} 題**。
2. 右邊 **Points** 下拉選單 → 選 **Double points**。
3. 對**第 ${x2.join('、')} 題**各做一次。
4. **Save**。

---

## 四、上架後一定要自己檢驗（打勾才算完成）

- [ ] 左邊列表剛好 **20 題**，沒有多也沒有少。
- [ ] 每題 **4 個選項**，正確答案有打勾（對照上面第二節）。
- [ ] 第 ${x2.join('、')} 題的 Points 顯示 **Double points**。
- [ ] 每題時間顯示 **${TIME} 秒**。
- [ ] 按右上角 **Preview**（或 Play → Teach）**實際玩過一輪**：
      題目讀得到、選項按得到、答對會加分、挑戰題加的是雙倍。
- [ ] 中文沒有變成亂碼（若亂碼，用 Excel 另存一次 .xlsx 再上傳）。

> ⚠️ 這一節必須由**老師本人在自己的 Kahoot 帳號上操作並確認**。
> Kahoot 需要登入個人帳號，協助你的 AI 沒有你的帳號，**無法代你上傳與試玩**。
`, 'utf8');
console.log('已產生 kahoot_20_題目與上架說明.md');
