/* score/_server.js — Google Apps Script 那一半（score/_build.js 把 _calc.js 和這一份接成 score/Code.gs，老師整份貼進 Apps Script）
 *
 * 試算表三張工作表（第一次執行 setup 自動建立）：
 *   紀錄       一次作答（或一場遊戲）一列（欄位 ＝ SC.COLS）；最後一欄「作廢」打勾 ＝ 不算（Q7-A：有人冒用別人的 5 碼）
 *   班級人數   班級｜人數（只填數字，不填名字；算參與率用，Q13-A）
 *   任務       老師看板派的任務（2026-10-09 E）：編號｜名稱｜年級｜班級｜開始｜截止｜項目。**請用老師看板改**，不要在這裡手改
 *   名單       班級｜座號｜姓名（使用者 2026-10-09：只留這三欄，不要性別）。**只給老師看板**（要密碼）；學生端永遠拿不到姓名（Q4）
 * 指令碼屬性（專案設定 ➜ 指令碼屬性）：
 *   TEACHER_PW  老師看板的密碼（只放在這裡，網頁和 GitHub 上都沒有）
 *   BOARDS      on／off：學生看不看得到排行榜（老師看板可以切，S8／Q4-A）
 *   ROSTER      （2026-10-09 起不用了：學生端一律不問「你是 ○○○ 嗎？」）
 */
var SHEET = '紀錄', SIZES = '班級人數', ROSTER = '名單', TASKS = '任務', TKCOLS = ['編號', '名稱', '年級', '班級', '開始', '截止', '項目'];
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var a = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (a.getLastRow() < 1) { a.appendRow(SC.COLS); a.setFrozenRows(1); }
  var b = ss.getSheetByName(SIZES) || ss.insertSheet(SIZES);
  if (b.getLastRow() < 1) { b.appendRow(['班級', '人數']); [3, 4].forEach(function (g) { SC.CLASSES[g].forEach(function (c) { b.appendRow([c, '']); }); }); }
  var c = ss.getSheetByName(ROSTER) || ss.insertSheet(ROSTER);
  if (c.getLastRow() < 1) c.appendRow(['班級', '座號', '姓名']);
  var d = ss.getSheetByName(TASKS) || ss.insertSheet(TASKS);
  if (d.getLastRow() < 1) { d.appendRow(TKCOLS); d.setFrozenRows(1); }
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
/* 名單（只給老師看板）：讀前三欄 班級｜座號｜姓名；班級寫 304 或「304班」都可以、座號 5 或 05 都可以；第一列是標題 */
function roster() {
  var s = sheet(ROSTER), n = s.getLastRow(), out = [];
  if (n < 2) return out;
  s.getRange(2, 1, n - 1, 3).getValues().forEach(function (r) {
    var cls = String(r[0]).replace(/\D/g, ''), seat = parseInt(String(r[1]).replace(/\D/g, ''), 10), nm = String(r[2] == null ? '' : r[2]).replace(/^\s+|\s+$/g, '');
    if (!nm || isNaN(seat)) return;
    var c = SC.checkId(cls + (seat < 10 ? '0' : '') + seat); if (c.err) return;
    out.push([c.cls, c.seat, nm.slice(0, 20)]);
  });
  return out;
}
/* 任務（2026-10-09 E）：一列一個；項目 ＝ JSON（代號和名稱）。讀不懂的列跳過 */
function tasks() {
  var s = sheet(TASKS), n = s.getLastRow(), out = [];
  if (n < 2) return out;
  s.getRange(2, 1, n - 1, TKCOLS.length).getValues().forEach(function (r) {
    var it = {}; try { it = JSON.parse(String(r[6] || '{}')); } catch (x) { it = {}; }
    var tm = function (v) { return v instanceof Date ? v.getTime() : +v || Date.parse(v); };
    var t = SC.tkClean({ id: r[0], name: r[1], g: r[2], cls: String(r[3]).split(/[^\d]+/), from: tm(r[4]), to: tm(r[5]), items: it.items || [], nm: it.nm || {} }, 0);
    if (t) out.push(t);
  });
  return out;
}
function tasksSave(T) {
  var s = sheet(TASKS), n = s.getLastRow();
  if (n >= 2) s.getRange(2, 1, n - 1, TKCOLS.length).clearContent();
  if (T.length) s.getRange(2, 1, T.length, TKCOLS.length).setValues(T.map(function (t) {
    return [t.id, t.name, t.g, t.cls.join('、'), new Date(t.from), new Date(t.to), JSON.stringify({ items: t.items, nm: t.nm })]; }));
}
/* 學生：GET ?a=view&id=30509&set=g3u1_1-1b（遊戲加 &gt=1 ＝ 要這個遊戲本班前 10 名）／ ?a=who&id=30509 */
function doGet(e) {
  var q = (e && e.parameter) || {};
  try {
    /* 任務：這一班的任務＋我做完了哪些（不用密碼：只有班級的任務，沒有姓名）；now ＝ 伺服器時間（平板時鐘不準也鎖得對） */
    if (q.a === 'tasks') { var c0 = SC.checkId(q.id); if (c0.err) return out({ err: c0.err });
      var rs = records(); return out({ ok: true, now: Date.now(), tasks: SC.tkFor(tasks(), c0.id).map(function (t) { t.done = SC.tkDone(rs, t, c0.id); return t; }) }); }
    if (q.a === 'view') return out(SC.view(records(), { id: q.id, set: q.set, gt: q.gt === '1' }, Date.now(), boardsOn()));
    /* 學生端不給姓名（使用者 2026-10-09 Q4：不用密碼就查得到姓名太危險）；舊的平板還會問，一律回「沒有名單」 */
    if (q.a === 'who') { var c = SC.checkId(q.id); return out(c.err ? { err: c.err } : { roster: false, name: null }); }
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
        if (R.u && n >= 2) { var us = s.getRange(2, SC.CI['編號'] + 1, n - 1, 1).getValues(); for (var i = 0; i < us.length; i++) if (String(us[i][0]) === R.u) { dup = true; break; } }
        if (!dup) s.appendRow(SC.toRow(R));
      } finally { lock.releaseLock(); }
      var v = SC.view(records(), { id: R.id, set: R.set, u: R.u, gt: R.m === 'g' }, now, boardsOn()); v.saved = true; v.dup = dup;
      return out(v);
    }
    if (o.a === 'teacher' || o.a === 'void' || o.a === 'set' || o.a === 'task') {
      if (!pwOk(o.pw)) return out({ err: 'pw' });
      if (o.a === 'void') {
        var s2 = sheet(SHEET), m = s2.getLastRow(), done = false;
        if (m >= 2) { var u2 = s2.getRange(2, SC.CI['編號'] + 1, m - 1, 1).getValues();
          for (var j = 0; j < u2.length; j++) if (String(u2[j][0]) === String(o.u)) { s2.getRange(j + 2, SC.COLS.length).setValue(!!o.v); done = true; break; } }
        return out({ ok: done });
      }
      /* 派任務／改時間／刪掉（老師看板） */
      if (o.a === 'task') {
        var lk = LockService.getScriptLock(); lk.waitLock(20000);
        try {
          var T = tasks();
          if (o.op === 'del') T = T.filter(function (t) { return t.id !== String(o.id); });
          else { var t = SC.tkClean(o.t, Date.now()); if (!t) return out({ err: 'task' });
            var k = -1; T.forEach(function (x, j) { if (x.id === t.id) k = j; }); if (k >= 0) T[k] = t; else T.push(t); }
          tasksSave(T);
        } finally { lk.releaseLock(); }
        return out({ ok: true, tasks: tasks() });
      }
      if (o.a === 'set') { if (o.boards != null) PropertiesService.getScriptProperties().setProperty('BOARDS', o.boards ? 'on' : 'off'); return out({ ok: true, boards: boardsOn() }); }
      return out({ ok: true, now: Date.now(), cols: SC.COLS, rows: rows().map(function (r) { return r.map(function (x) { return x instanceof Date ? x.getTime() : x; }); }), sizes: sizes(), roster: roster(), boards: boardsOn(), tasks: tasks() });
    }
    return out({ err: 'a' });
  } catch (x) { return out({ err: 'server', msg: String(x) }); }
}
