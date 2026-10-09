/* score/_gas_stub.js — 在 node 裡假裝成 Google Apps Script（試算表、指令碼屬性、鎖），跑真正的 score/Code.gs。
 * 量測用（score/_test.js、score/_verify.js 的假伺服器）：網站送出去的每一筆，都由「同一份 Code.gs」處理。 */
const fs = require('fs'), path = require('path'), vm = require('vm');
function make(props) {
  const books = {};
  function Sheet(name) { this.name = name; this.d = []; }
  Sheet.prototype = {
    getLastRow() { return this.d.length; },
    appendRow(r) { this.d.push(r.slice()); },
    setFrozenRows() {},
    getRange(r, c, nr, nc) { const S = this; nr = nr || 1; nc = nc || 1;
      return { getValues() { const o = []; for (let i = 0; i < nr; i++) { const row = S.d[r - 1 + i] || []; const x = []; for (let j = 0; j < nc; j++) x.push(row[c - 1 + j] === undefined ? '' : row[c - 1 + j]); o.push(x); } return o; },
        setValue(v) { (S.d[r - 1] = S.d[r - 1] || [])[c - 1] = v; },
        setValues(V) { V.forEach((row, i) => row.forEach((v, j) => { (S.d[r - 1 + i] = S.d[r - 1 + i] || [])[c - 1 + j] = v; })); },
        /* 跟真的 Apps Script 一樣：清掉以後，最後面的空白列不算（getLastRow 只算有內容的） */
        clearContent() { for (let i = 0; i < nr; i++) { const row = S.d[r - 1 + i]; if (row) for (let j = 0; j < nc; j++) row[c - 1 + j] = ''; }
          while (S.d.length && S.d[S.d.length - 1].every(v => v === '' || v == null)) S.d.pop(); } }; }
  };
  const ss = { getSheetByName: n => books[n] || null, insertSheet: n => (books[n] = new Sheet(n)) };
  const P = Object.assign({}, props || {});
  const ctx = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ss },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in P ? P[k] : null), setProperty: (k, v) => { P[k] = String(v); } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: s => ({ s, setMimeType() { return this; }, getContent() { return this.s; } }) },
    Date, JSON, Math, String, Number, Object, Array, isNaN, console
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'Code.gs'), 'utf8'), ctx, { filename: 'Code.gs' });
  ctx.setup();
  return {
    ctx, books, P,
    get: q => JSON.parse(ctx.doGet({ parameter: q }).getContent()),
    post: o => JSON.parse(ctx.doPost({ postData: { contents: typeof o === 'string' ? o : JSON.stringify(o) } }).getContent())
  };
}
module.exports = { make };
