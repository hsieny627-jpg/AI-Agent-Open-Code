/* score/_server.js — Google Apps Script 那一半（score/_build.js 把 _calc.js 和這一份接成 score/Code.gs，老師整份貼進 Apps Script）
 *
 * 試算表三張工作表（第一次執行 setup 自動建立）：
 *   紀錄       一次作答（或一場遊戲）一列（欄位 ＝ SC.COLS）；最後一欄「作廢」打勾 ＝ 不算（Q7-A：有人冒用別人的 5 碼）
 *   班級人數   班級｜人數（只填數字，不填名字；算參與率用，Q13-A）
 *   任務       老師看板派的任務（2026-10-09 E）：編號｜名稱｜年級｜班級｜開始｜截止｜項目。**請用老師看板改**，不要在這裡手改
 *   已刪除     老師看板〔🗑 刪除這個人全部的成績〕刪掉的列先搬到這裡（2026-10-17 C8 另 4；刪錯可以從這裡抄回「紀錄」）
 *   角色       🦸 學生的英雄、武器、寵物、寶物（2026-10-17 第八次）：5碼｜狀態（JSON：買了什麼、裝了什麼、花了多少金幣）｜更新時間。經驗值、金幣不存：每一次從「紀錄」算
 *   名單       班級｜座號｜姓名（使用者 2026-10-09：只留這三欄，不要性別）。**只給老師看板**（要密碼）；學生端永遠拿不到姓名（Q4）
 * 指令碼屬性（專案設定 ➜ 指令碼屬性）：
 *   TEACHER_PW  老師看板的密碼（只放在這裡，網頁和 GitHub 上都沒有）
 *   BOARDS      （2026-10-17 起不用了：學生平板永遠看得到排行榜，C9 第 9 題 B）
 *   ROSTER      （2026-10-09 起不用了：學生端一律不問「你是 ○○○ 嗎？」）
 *   LOCKS       〔🔒 開關〕（2026-10-12 D 第 7 件）：每一班鎖住的在家複習主題（JSON）。**請用老師看板改**
 *   LOCKT       〔🔒 開關〕的開放時間（2026-10-17 第八次）：每一班每一個主題 [從, 到]（JSON）。**請用老師看板改**
 */
var RPG = '角色', DELETED = '已刪除', SHEET = '紀錄', SIZES = '班級人數', ROSTER = '名單', TASKS = '任務', TKCOLS = ['編號', '名稱', '年級', '班級', '開始', '截止', '項目'];
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
  var e = ss.getSheetByName(RPG) || ss.insertSheet(RPG);
  if (e.getLastRow() < 1) { e.appendRow(['5碼', '狀態', '更新時間']); e.setFrozenRows(1); }
  var P = PropertiesService.getScriptProperties();

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
/* 🦸 角色（2026-10-17 第八次）：一個人一列；找不到 ＝ 還沒有英雄 */
function rpRow(id) { var s = sheet(RPG), n = s.getLastRow(); if (n < 2) return { s: s, r: 0, st: SC.rpClean({}) };
  var v = s.getRange(2, 1, n - 1, 2).getValues();
  for (var i = 0; i < v.length; i++) if (String(v[i][0]).replace(/\D/g, '') === id) { var st = {}; try { st = JSON.parse(String(v[i][1] || '{}')); } catch (x) { st = {}; } return { s: s, r: i + 2, st: SC.rpClean(st) }; }
  return { s: s, r: 0, st: SC.rpClean({}) }; }
function rpSave(o, id, st) { var row = [id, JSON.stringify(st), new Date()]; if (o.r) o.s.getRange(o.r, 1, 1, 3).setValues([row]); else o.s.appendRow(row); }
function mine(id) { return records().filter(function (r) { return r.id === id; }); }
function records() { return rows().map(SC.fromRow).filter(function (r) { return r.id && !isNaN(r.t); }); }
function sizes() {
  var s = sheet(SIZES), n = s.getLastRow(), o = {};
  if (n >= 2) s.getRange(2, 1, n - 1, 2).getValues().forEach(function (r) { o[String(r[0])] = +r[1] || 0; });
  return o;
}
/* 班際「平均每一個人」要除以全班人數（G2-A）：班級人數有填用那個，沒填用名單人數（只給人數，不給名字） */
function clsSizes() { var o = {}; roster().forEach(function (r) { o[r[0]] = (o[r[0]] || 0) + 1; }); var z = sizes(); for (var k in z) if (+z[k] > 0) o[k] = +z[k]; return o; }
function locks() { try { return SC.lkClean(JSON.parse(prop('LOCKS') || '{}')); } catch (x) { return {}; } }
/* 〔🔒 開關〕的開放時間（2026-10-17 第八次）：每一班每一個主題 [從, 到] */
function lockt() { try { return SC.lktClean(JSON.parse(prop('LOCKT') || '{}')); } catch (x) { return {}; } }
/* 〔🏆 學生排行榜 開／關〕2026-10-17 老師 C9 第 9 題 B 刪掉：學生平板永遠看得到本班前 10 名 */
function boardsOn() { return true; }
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
      var rs = records(); return out({ ok: true, now: Date.now(), locks: SC.lkFor(locks(), c0.id, lockt(), Date.now()), tasks: SC.tkFor(tasks(), c0.id).map(function (t) { t.done = SC.tkDone(rs, t, c0.id); return t; }) }); }
    /* 〔🔒 開關〕沒登入的學生：這個年級有沒有任何一班鎖住（只給代號，不給哪幾班，D6 第 13 題） */
    /* 🦸 我的英雄：等級、經驗值、金幣、買了什麼（只有自己的；沒有姓名） */
    if (q.a === 'rpg') { var c1 = SC.checkId(q.id); if (c1.err) return out({ err: c1.err }); return out({ ok: true, now: Date.now(), v: SC.rpView(mine(c1.id), rpRow(c1.id).st) }); }
    if (q.a === 'locks') return out({ ok: true, any: SC.lkAny(locks(), +q.g === 4 ? 4 : 3, lockt(), Date.now()) });
    if (q.a === 'view') return out(SC.view(records(), { id: q.id, set: q.set, gt: q.gt === '1' }, Date.now(), boardsOn(), clsSizes()));
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
      if (R.m === 'v' || R.m === 'l') return out({ saved: true, dup: dup });   /* 👀 看字卡（2026-10-15 D 第 8 件）、🎧 聽完字卡（2026-10-16 C4 第 6 題）：只存，不用算排行 */
      var all5 = records(), v = SC.view(all5, { id: R.id, set: R.set, u: R.u, gt: R.m === 'g' }, now, boardsOn(), clsSizes()); v.saved = true; v.dup = dup;
      try { v.rpg = SC.rpGain(all5.filter(function (r) { return r.id === R.id; }), rpRow(R.id).st, R.u); } catch (x) { }   /* 🦸 這一次拿到多少經驗值、金幣（平板最後一幕） */
      return out(v);
    }
    /* 🦸 買、換裝（2026-10-17 第八次）：伺服器算金幣、等級，平板改不了 */
    if (o.a === 'rpg') {
      var c2 = SC.checkId(o.id); if (c2.err) return out({ err: c2.err });
      var lk5 = LockService.getScriptLock(); lk5.waitLock(20000);
      try { var R5 = rpRow(c2.id), rs5 = mine(c2.id), r5 = o.op === 'buy' ? SC.rpBuy(rs5, R5.st, o.item, Date.now()) : o.op === 'eq' ? SC.rpEquip(R5.st, o.item, Date.now()) : { err: 'op' };
        if (r5.err) return out({ err: r5.err, need: r5.need, v: SC.rpView(rs5, R5.st) });
        rpSave(R5, c2.id, r5.st); return out({ ok: true, paid: r5.paid, free: r5.free, v: SC.rpView(rs5, r5.st) });
      } finally { lk5.releaseLock(); }
    }
    if (o.a === 'teacher' || o.a === 'void' || o.a === 'set' || o.a === 'task' || o.a === 'lock' || o.a === 'lockt' || o.a === 'delp' || o.a === 'pw' || o.a === 'rpgb') {
      if (!pwOk(o.pw)) return out({ err: 'pw' });
      /* ⚡ 現場任務 大螢幕：只檢查老師密碼（2026-10-17 第八次） */
      if (o.a === 'pw') return out({ ok: true });
      /* ⚡ 現場任務 結束：老師大螢幕一次發獎勵（list ＝ [{id, c, x, tre, title, snack, medal}]） */
      if (o.a === 'rpgb') {
        var lk6 = LockService.getScriptLock(), nb = 0; lk6.waitLock(20000);
        try { var now6 = Date.now(), s6 = sheet(SHEET), n6 = s6.getLastRow(), us6 = {};
          if (n6 >= 2) s6.getRange(2, SC.CI['編號'] + 1, n6 - 1, 1).getValues().forEach(function (x) { us6[String(x[0])] = 1; });
          (o.list || []).slice(0, 60).forEach(function (b) { var c6 = SC.checkId(b && b.id); if (c6.err) return; var R6 = rpRow(c6.id); rpSave(R6, c6.id, SC.rpBonus(R6.st, b)); nb++;
            /* 2026-10-18 C10 第 3 題 B：現場任務 一場 ＝ 練習次數 ＋1、練了 1 天（正確率不算） */
            var L6 = SC.lvRec(c6.id, o.room, o.t0, now6); if (L6 && !us6[L6.u]) { s6.appendRow(SC.toRow(L6)); us6[L6.u] = 1; } });
        } finally { lk6.releaseLock(); }
        return out({ ok: true, n: nb });
      }
      if (o.a === 'void') {
        var s2 = sheet(SHEET), m = s2.getLastRow(), done = false;
        if (m >= 2) { var u2 = s2.getRange(2, SC.CI['編號'] + 1, m - 1, 1).getValues();
          for (var j = 0; j < u2.length; j++) if (String(u2[j][0]) === String(o.u)) { s2.getRange(j + 2, SC.COLS.length).setValue(!!o.v); done = true; break; } }
        return out({ ok: done });
      }
      /* 刪除一個人全部的成績（老師 2026-10-17 C8 另 4：例 30430 是老師自己測試）：先整列搬到「已刪除」工作表（萬一刪錯，老師可以從那裡抄回來），再從「紀錄」刪掉 */
      if (o.a === 'delp') {
        var cd = SC.checkId(o.id); if (cd.err) return out({ err: cd.err });
        var lk3 = LockService.getScriptLock(), nd = 0; lk3.waitLock(20000);
        try {
          var s3 = sheet(SHEET), m3 = s3.getLastRow(), del = [];
          if (m3 >= 2) { var V3 = s3.getRange(2, 1, m3 - 1, SC.COLS.length).getValues(); for (var r3 = 0; r3 < V3.length; r3++) if (String(V3[r3][SC.CI['5碼']]) === cd.id) del.push(r3); }
          if (del.length) {
            var ss3 = SpreadsheetApp.getActiveSpreadsheet(), bk = ss3.getSheetByName(DELETED) || ss3.insertSheet(DELETED);
            if (bk.getLastRow() < 1) bk.appendRow(SC.COLS.concat(['刪除時間']));
            del.forEach(function (r) { bk.appendRow(V3[r].concat([new Date()])); });
            for (var q3 = del.length - 1; q3 >= 0; q3--) s3.deleteRows(del[q3] + 2, 1);
            nd = del.length;
          }
        } finally { lk3.releaseLock(); }
        return out({ ok: true, n: nd, id: cd.id });
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
      /* 〔🔒 開關〕哪幾班 × 哪些主題 鎖／開（老師看板） */
      if (o.a === 'lock') {
        var lk2 = LockService.getScriptLock(); lk2.waitLock(20000);
        try { var P2 = PropertiesService.getScriptProperties(); P2.setProperty('LOCKS', JSON.stringify(SC.lkSet(locks(), o.cls, o.keys, !!o.on)));
          P2.setProperty('LOCKT', JSON.stringify(SC.lktSet(lockt(), o.cls, o.keys, null, null))); } finally { lk2.releaseLock(); }   /* 🔒／🔓 ＝ 開放時間拿掉 */
        return out({ ok: true, locks: locks(), lockt: lockt() });
      }
      /* 〔🔒 開關〕開放時間（2026-10-17 第八次）：哪幾班 × 哪些主題 從～到（from 空白 ＝ 拿掉時間）；有時間 ＝ 不再「一直鎖」 */
      if (o.a === 'lockt') {
        var lk4 = LockService.getScriptLock(); lk4.waitLock(20000);
        try { var P4 = PropertiesService.getScriptProperties(); P4.setProperty('LOCKT', JSON.stringify(SC.lktSet(lockt(), o.cls, o.keys, o.from, o.to)));
          if (o.from) P4.setProperty('LOCKS', JSON.stringify(SC.lkSet(locks(), o.cls, o.keys, false))); } finally { lk4.releaseLock(); }
        return out({ ok: true, locks: locks(), lockt: lockt() });
      }
      if (o.a === 'set') return out({ ok: true, boards: true });   /* 排行榜開關刪掉了（C9 第 9 題 B）；舊的老師看板按了也不會關 */
      return out({ ok: true, now: Date.now(), cols: SC.COLS, rows: rows().map(function (r) { return r.map(function (x) { return x instanceof Date ? x.getTime() : x; }); }), sizes: sizes(), roster: roster(), boards: boardsOn(), tasks: tasks(), locks: locks(), lockt: lockt() });
    }
    return out({ err: 'a' });
  } catch (x) { return out({ err: 'server', msg: String(x) }); }
}
