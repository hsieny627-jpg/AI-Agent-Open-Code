/* score/_server.js — Google Apps Script 那一半（score/_build.js 把 _calc.js 和這一份接成 score/Code.gs，老師整份貼進 Apps Script）
 *
 * 試算表三張工作表（第一次執行 setup 自動建立）：
 *   紀錄       一次作答一列（欄位 ＝ SC.COLS）；最後一欄「作廢」打勾 ＝ 不算（Q7-A：有人冒用別人的 5 碼）
 *   班級人數   班級｜人數（只填數字，不填名字；算參與率用，Q13-A）
 *   名單       班級｜座號｜姓名（「名單」開關預設關；使用者 2026-10-07：暫時不用名單，只用 5 碼）
 * 指令碼屬性（專案設定 ➜ 指令碼屬性）：
 *   TEACHER_PW  老師看板的密碼（只放在這裡，網頁和 GitHub 上都沒有）
 *   BOARDS      on／off：學生看不看得到排行榜（老師看板可以切，S8／Q4-A）
 *   ROSTER      on／off：名單開關（預設 off）
 */
var SHEET = '紀錄', SIZES = '班級人數', ROSTER = '名單';
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var a = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (a.getLastRow() < 1) { a.appendRow(SC.COLS); a.setFrozenRows(1); }
  var b = ss.getSheetByName(SIZES) || ss.insertSheet(SIZES);
  if (b.getLastRow() < 1) { b.appendRow(['班級', '人數']); [3, 4].forEach(function (g) { SC.CLASSES[g].forEach(function (c) { b.appendRow([c, '']); }); }); }
  var c = ss.getSheetByName(ROSTER) || ss.insertSheet(ROSTER);
  if (c.getLastRow() < 1) c.appendRow(['班級', '座號', '姓名']);
  var P = PropertiesService.getScriptProperties();
  if (!P.getProperty('BOARDS')) P.setProperty('BOARDS', 'on');
  if (!P.getProperty('ROSTER')) P.setProperty('ROSTER', 'off');
  return '✅ 設定好了';
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function prop(k) { return PropertiesService.getScriptProperties().getProperty(k); }
function sheet(n) { var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(n); if (!s) { setup(); s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(n); } return s; }
function rows() {
  var s = sheet(SHEET), n = s.getLastRow();
  if (n < 2) return [];
  return s.getRange(2, 1, n - 1, SC.COLS.length).getValues();
}
function records() { return rows().map(SC.fromRow).filter(function (r) { return r.id && !isNaN(r.t); }); }
function sizes() {
  var s = sheet(SIZES), n = s.getLastRow(), o = {};
  if (n >= 2) s.getRange(2, 1, n - 1, 2).getValues().forEach(function (r) { o[String(r[0])] = +r[1] || 0; });
  return o;
}
function boardsOn() { return prop('BOARDS') !== 'off'; }
function pwOk(pw) { var p = prop('TEACHER_PW'); return !!p && String(pw) === String(p); }
function who(id) {
  if (prop('ROSTER') !== 'on') return null;
  var c = SC.checkId(id); if (c.err) return null;
  var s = sheet(ROSTER), n = s.getLastRow(); if (n < 2) return null;
  var L = s.getRange(2, 1, n - 1, 3).getValues();
  for (var i = 0; i < L.length; i++) if (String(L[i][0]) === c.cls && +L[i][1] === c.seat) return String(L[i][2]);
  return null;
}
/* 學生：GET ?a=view&id=30509&set=g3u1_1-1b ／ ?a=who&id=30509 */
function doGet(e) {
  var q = (e && e.parameter) || {};
  try {
    if (q.a === 'view') return out(SC.view(records(), { id: q.id, set: q.set }, Date.now(), boardsOn()));
    if (q.a === 'who') { var c = SC.checkId(q.id); return out(c.err ? { err: c.err } : { roster: prop('ROSTER') === 'on', name: who(q.id) }); }
    return out({ ok: true, app: 'score' });
  } catch (x) { return out({ err: 'server', msg: String(x) }); }
}
/* 學生：POST {a:'rec', r:{…}}（存一筆，回傳 view）／老師：POST {a:'teacher', pw}、{a:'void', pw, u, v}、{a:'set', pw, boards} */
function doPost(e) {
  var o = {};
  try { o = JSON.parse(e.postData.contents); } catch (x) { return out({ err: 'json' }); }
  try {
    if (o.a === 'rec') {
      var now = Date.now(), R = SC.clean(o.r || {}, now);
      if (!R) return out({ err: 'bad' });
      var lock = LockService.getScriptLock(); lock.waitLock(20000);
      try {
        var s = sheet(SHEET), n = s.getLastRow(), dup = false;
        if (R.u && n >= 2) { var us = s.getRange(2, 16, n - 1, 1).getValues(); for (var i = 0; i < us.length; i++) if (String(us[i][0]) === R.u) { dup = true; break; } }
        if (!dup) s.appendRow(SC.toRow(R));
      } finally { lock.releaseLock(); }
      var v = SC.view(records(), { id: R.id, set: R.set, u: R.u }, now, boardsOn()); v.saved = true; v.dup = dup;
      return out(v);
    }
    if (o.a === 'teacher' || o.a === 'void' || o.a === 'set') {
      if (!pwOk(o.pw)) return out({ err: 'pw' });
      if (o.a === 'void') {
        var s2 = sheet(SHEET), m = s2.getLastRow(), done = false;
        if (m >= 2) { var u2 = s2.getRange(2, 16, m - 1, 1).getValues();
          for (var j = 0; j < u2.length; j++) if (String(u2[j][0]) === String(o.u)) { s2.getRange(j + 2, 18).setValue(!!o.v); done = true; break; } }
        return out({ ok: done });
      }
      if (o.a === 'set') { if (o.boards != null) PropertiesService.getScriptProperties().setProperty('BOARDS', o.boards ? 'on' : 'off'); return out({ ok: true, boards: boardsOn() }); }
      return out({ ok: true, now: Date.now(), cols: SC.COLS, rows: rows().map(function (r) { return r.map(function (x) { return x instanceof Date ? x.getTime() : x; }); }), sizes: sizes(), boards: boardsOn() });
    }
    return out({ err: 'a' });
  } catch (x) { return out({ err: 'server', msg: String(x) }); }
}
