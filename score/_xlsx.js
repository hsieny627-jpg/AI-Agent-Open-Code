/* score/_xlsx.js — 最小的 Excel（.xlsx）產生器：老師看板「⬇ 一鍵下載 Excel」用（Q16-A：一個檔、五張工作表）
 * 不用外部函式庫（網站零外部相依）。zip 用「不壓縮（stored）」＋ CRC32，Excel、Google 試算表、Numbers 都打得開。
 * XLSX.make([{name:'個人', rows:[['5碼','正確率'],['30405',80]]}, …]) ➜ Uint8Array */
var XLSX = (function () {
  var T = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; T[n] = c >>> 0; }
  function crc(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = T[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function utf8(s) { return typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s) : new Uint8Array(Buffer.from(s, 'utf8')); }
  function x(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ''); }
  function col(i) { var s = ''; i++; while (i) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function sheet(rows) {
    var w = [], o = '';
    rows.forEach(function (r) { r.forEach(function (v, j) { var l = String(v == null ? '' : v).length; w[j] = Math.max(w[j] || 6, Math.min(60, l * 1.6 + 2)); }); });
    o += '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
    o += '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';
    if (w.length) o += '<cols>' + w.map(function (v, j) { return '<col min="' + (j + 1) + '" max="' + (j + 1) + '" width="' + Math.round(v) + '" customWidth="1"/>'; }).join('') + '</cols>';
    o += '<sheetData>';
    rows.forEach(function (r, i) {
      o += '<row r="' + (i + 1) + '">';
      r.forEach(function (v, j) {
        var ref = col(j) + (i + 1), st = i === 0 ? ' s="1"' : '';
        if (v == null || v === '') return;
        if (typeof v === 'number' && isFinite(v)) o += '<c r="' + ref + '"' + st + '><v>' + v + '</v></c>';
        else o += '<c r="' + ref + '" t="inlineStr"' + st + '><is><t xml:space="preserve">' + x(v) + '</t></is></c>';
      });
      o += '</row>';
    });
    return o + '</sheetData></worksheet>';
  }
  function zip(files) {
    var parts = [], cen = [], off = 0;
    files.forEach(function (f) {
      var nm = utf8(f.n), d = utf8(f.d), c = crc(d), h = new Uint8Array(30 + nm.length), v = new DataView(h.buffer);
      v.setUint32(0, 0x04034b50, true); v.setUint16(4, 20, true); v.setUint16(6, 0x0800, true); v.setUint16(8, 0, true);
      v.setUint32(14, c, true); v.setUint32(18, d.length, true); v.setUint32(22, d.length, true); v.setUint16(26, nm.length, true); h.set(nm, 30);
      var e = new Uint8Array(46 + nm.length), w = new DataView(e.buffer);
      w.setUint32(0, 0x02014b50, true); w.setUint16(4, 20, true); w.setUint16(6, 20, true); w.setUint16(8, 0x0800, true);
      w.setUint32(16, c, true); w.setUint32(20, d.length, true); w.setUint32(24, d.length, true); w.setUint16(28, nm.length, true); w.setUint32(42, off, true); e.set(nm, 46);
      parts.push(h, d); cen.push(e); off += h.length + d.length;
    });
    var cs = 0; cen.forEach(function (e) { cs += e.length; });
    var end = new Uint8Array(22), q = new DataView(end.buffer);
    q.setUint32(0, 0x06054b50, true); q.setUint16(8, files.length, true); q.setUint16(10, files.length, true); q.setUint32(12, cs, true); q.setUint32(16, off, true);
    var all = parts.concat(cen, [end]), n = 0; all.forEach(function (a) { n += a.length; });
    var out = new Uint8Array(n), p = 0; all.forEach(function (a) { out.set(a, p); p += a.length; });
    return out;
  }
  function make(sheets) {
    var ws = sheets.map(function (s, i) { return '<sheet name="' + x(s.name.slice(0, 31)) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('');
    var files = [
      { n: '[Content_Types].xml', d: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        sheets.map(function (s, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('') + '</Types>' },
      { n: '_rels/.rels', d: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { n: 'xl/workbook.xml', d: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' + ws + '</sheets></workbook>' },
      { n: 'xl/_rels/workbook.xml.rels', d: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        sheets.map(function (s, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') +
        '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
      { n: 'xl/styles.xml', d: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        '<fonts count="2"><font><sz val="12"/><name val="Calibri"/></font><font><b/><sz val="12"/><name val="Calibri"/></font></fonts>' +
        '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/></patternFill></fill></fills>' +
        '<borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs>' +
        '<cellXfs count="2"><xf xfId="0"/><xf xfId="0" fontId="1" fillId="2" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>' }
    ];
    sheets.forEach(function (s, i) { files.push({ n: 'xl/worksheets/sheet' + (i + 1) + '.xml', d: sheet(s.rows) }); });
    return zip(files);
  }
  return { make: make };
})();
if (typeof module !== 'undefined') module.exports = XLSX;
