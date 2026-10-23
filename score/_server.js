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
/* ⚔ 戰力階級（2026-10-20 第十五次）：{5碼: 最高到過第幾階}（老師看板 排行榜 名字旁邊的徽章；學生平板 本班前 10 名也用） */
/* 排行榜上出現的 5 碼 ➜ 那個人的 ⚔ 戰力階級（只給有出現的） */
function tierOf(v) { try { var T = rpTiers(), j = JSON.stringify(v), o = {}; for (var id in T) if (j.indexOf('"' + id + '"') >= 0) o[id] = T[id]; v.tiers = o; } catch (e) { } return v; }
function rpTiers() { var s = sheet(RPG), n = s.getLastRow(), o = {}; if (n < 2) return o;
  s.getRange(2, 1, n - 1, 2).getValues().forEach(function (v) { var id = String(v[0]).replace(/\D/g, ''), t = 0; try { t = +(JSON.parse(String(v[1] || '{}')).tr) || 0; } catch (x) { } if (t > 0 && /^\d{5}$/.test(id)) o[id] = Math.min(5, t); }); return o; }
/* 🏆 榮譽榜的戰士、寵物、武器（2026-10-23 第二十二次 第 4 點）：{5碼: [戰士, 武器, 寵物]}（只給老師；只有編號，不會有姓名） */
function rpEqs() { var s = sheet(RPG), n = s.getLastRow(), o = {}; if (n < 2) return o;
  s.getRange(2, 1, n - 1, 2).getValues().forEach(function (v) { var id = String(v[0]).replace(/\D/g, ''), q = {}; try { q = JSON.parse(String(v[1] || '{}')); } catch (x) { } var e = q.eq || {};
    if (/^\d{5}$/.test(id) && (e.h || e.w || e.p)) o[id] = [String(e.h || '').slice(0, 8), String(e.w || '').slice(0, 8), String(e.p || '').slice(0, 8)]; }); return o; }
/* 📜 誰看懂了獎勵規則（2026-10-21）：{5碼: 答對 5 題的時間}（只有這一版規則；只給老師） */
function rpQz() { var s = sheet(RPG), n = s.getLastRow(), o = {}; if (n < 2) return o;
  s.getRange(2, 1, n - 1, 2).getValues().forEach(function (v) { var id = String(v[0]).replace(/\D/g, ''), q = {}; try { q = JSON.parse(String(v[1] || '{}')); } catch (x) { } if (+q.qz === SC.RPQV && /^\d{5}$/.test(id)) o[id] = +q.qzt || 1; }); return o; }
/* 🏷 限量（2026-10-20 第十四次，老師：全部學生一共 5 個）：數「角色」每一列買了沒 ➜ {編號: 已經換走幾個} */
function rpSold() { var s = sheet(RPG), n = s.getLastRow(), o = {}; for (var k in SC.RPLIM) o[k] = 0; if (n < 2) return o;
  s.getRange(2, 2, n - 1, 1).getValues().forEach(function (v) { var st = {}; try { st = JSON.parse(String(v[0] || '{}')); } catch (x) { } var a = (st.own && st.own.s) || [];
    for (var k in o) if (a.indexOf(k) >= 0) o[k]++; }); return o; }
function rpStock() { var z = rpSold(), o = {}; for (var k in SC.RPLIM) o[k] = Math.max(0, SC.RPLIM[k] - (z[k] || 0)); return o; }
function rpSave(o, id, st) { var row = [id, JSON.stringify(st), new Date()]; if (o.r) o.s.getRange(o.r, 1, 1, 3).setValues([row]); else o.s.appendRow(row); }
/* 👑 冠軍寶箱 自動發（2026-10-20 第十五次，老師：「老師忘了按怎麼辦？」➜ 選擇題「自動發」）：
   每個星期一 0:00 以後，「上一週」全年級「最認真練習」（練習時間）前 5 名（同分一起）＝ 自動一個寶箱；學生打開戰神之路就拿到。
   編號 ch|上一週星期一|g年級（跟老師看板以前的按鈕同一種編號 ➜ 老師那一週按過的人不會拿兩個）；前 5 名第一次算好就存在指令碼屬性 CHW_編號（之後不再算）。
   回傳 新的狀態（有發）或 null（沒有） */
function chestTop(g, now) { var w = SC.weekStart(now), w0 = w - 7 * 864e5, k = 'ch|' + new Date(w0 + 288e5).toISOString().slice(0, 10) + '|g' + g, P = PropertiesService.getScriptProperties(), c = P.getProperty('CHW_' + k);
  if (c) { try { return { k: k, ids: JSON.parse(c) }; } catch (e) { } }
  var ps = SC.students(SC.pick(records(), { g: g, from: w0, to: w })), ids = SC.rank(ps, 'sec').filter(function (x) { return x.rk <= 5; }).map(function (x) { return x.id; });
  try { P.setProperty('CHW_' + k, JSON.stringify(ids)); } catch (e) { } return { k: k, ids: ids }; }
function chestAuto(id, st) { var c = SC.checkId(id); if (c.err) return null; var T = chestTop(c.g, Date.now());
  if (T.ids.indexOf(c.id) < 0 || (st.bk || []).indexOf(T.k) >= 0) return null; return SC.rpBonus(st, { chest: 1, k: T.k }); }
/* 🎁 全班獎勵 自動發（2026-10-23 第二十二次）：學生打開戰神之路 ➜ 這一班「上一週」名單上每一個人都練 3 天 ➜ 🪙 ＋200、⭐ ＋100（編號 cw|上一週星期一|班級，
   跟老師看板以前的按鈕同一種編號 ➜ 老師按過的不會拿兩次）；算好就存在指令碼屬性 CWW_編號（之後不再算） */
function cwAuto(id, st) { var c = SC.checkId(id); if (c.err) return null; var w = SC.weekStart(Date.now()), w0 = w - 7 * 864e5, k = 'cw|' + new Date(w0 + 288e5).toISOString().slice(0, 10) + '|' + c.cls;
  if ((st.bk || []).indexOf(k) >= 0) return null; var P = PropertiesService.getScriptProperties(), v = P.getProperty('CWW_' + k);
  if (v !== '1' && v !== '0') { var ids = roster().filter(function (r) { return r[0] === c.cls; }).map(function (r) { return r[0] + (r[1] < 10 ? '0' : '') + r[1]; });
    v = SC.cwOk(records(), ids, w0, w) ? '1' : '0'; if (ids.length) try { P.setProperty('CWW_' + k, v); } catch (e) { } }
  return v === '1' ? SC.rpBonus(st, { c: SC.RPCW.c, x: SC.RPCW.x, k: k }) : null; }
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
    if (q.a === 'rpg') { var c1 = SC.checkId(q.id); if (c1.err) return out({ err: c1.err }); var rs1 = mine(c1.id), R1 = rpRow(c1.id);
      /* 2026-10-20 第十五次：⚔ 戰力階級 第一次到 ➜ 記下來（🪙＋100 不會因為拿下裝備被收回）；👑 冠軍寶箱 上一週的前 5 名 自動發（老師忘了按也拿得到） */
      var T1 = SC.rpTierUp(rs1, R1.st), ch1 = chestAuto(c1.id, T1), cw1 = cwAuto(c1.id, JSON.parse(JSON.stringify(T1))); if (T1.tr !== R1.st.tr || T1.trt.length !== R1.st.trt.length || ch1 || cw1) { var lk1 = LockService.getScriptLock(); lk1.waitLock(20000); try { R1 = rpRow(c1.id); T1 = SC.rpTierUp(rs1, R1.st); T1 = chestAuto(c1.id, T1) || T1; T1 = cwAuto(c1.id, T1) || T1; rpSave(R1, c1.id, T1); } finally { lk1.releaseLock(); } }
      return out({ ok: true, now: Date.now(), v: SC.rpView(rs1, T1), stock: rpStock() }); }
    if (q.a === 'locks') return out({ ok: true, any: SC.lkAny(locks(), +q.g === 4 ? 4 : 3, lockt(), Date.now()) });
    if (q.a === 'view') return out(tierOf(SC.view(records(), { id: q.id, set: q.set, gt: q.gt === '1' }, Date.now(), boardsOn(), clsSizes())));
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
      var all5 = records(), v = SC.view(all5, { id: R.id, set: R.set, u: R.u, gt: R.m === 'g' }, now, boardsOn(), clsSizes()); v.saved = true; v.dup = dup; tierOf(v);
      try { var mineR = all5.filter(function (r) { return r.id === R.id; }), RR = rpRow(R.id), FF = dup ? { st: RR.st, f: null } : SC.rpFight(mineR, RR.st, R);
        if (FF.f) { var lk7 = LockService.getScriptLock(); lk7.waitLock(20000); try { RR = rpRow(R.id); FF = SC.rpFight(mineR, RR.st, R); if (FF.f) rpSave(RR, R.id, SC.rpTierUp(mineR, FF.st)); } finally { lk7.releaseLock(); } }
        /* 2026-10-21：這一次讓戰力升階 ＝ 馬上記下時間（金幣加成從這一刻開始） */
        if (!FF.f && !dup) { var T7 = SC.rpTierUp(mineR, RR.st); if (T7.trt.length !== RR.st.trt.length) { var lk8 = LockService.getScriptLock(); lk8.waitLock(20000); try { RR = rpRow(R.id); FF.st = SC.rpTierUp(mineR, RR.st); rpSave(RR, R.id, FF.st); } finally { lk8.releaseLock(); } } }
        v.rpg = SC.rpGain(mineR, FF.st, R.u); v.rpg.f = FF.f; } catch (x) { }   /* 🦸 這一次拿到多少經驗值、金幣（平板最後一幕）＋ 👾 打怪（2026-10-20 第十四次） */
      return out(v);
    }
    /* 🦸 買、換裝（2026-10-17 第八次）：伺服器算金幣、等級，平板改不了 */
    if (o.a === 'rpg') {
      var c2 = SC.checkId(o.id); if (c2.err) return out({ err: c2.err });
      var lk5 = LockService.getScriptLock(); lk5.waitLock(20000);
      try { var R5 = rpRow(c2.id), rs5 = mine(c2.id), it5 = String(o.item || ''), sold5 = SC.RPLIM[it5] ? (rpSold()[it5] || 0) : 0;
        var r5 = o.op === 'buy' ? SC.rpBuy(rs5, R5.st, it5, Date.now(), sold5) : o.op === 'eq' ? SC.rpEquip(R5.st, it5, Date.now()) : o.op === 'open' ? SC.rpOpen(R5.st, Math.random(), Math.random()) :
          o.op === 'qz' ? { st: SC.rpQuiz(R5.st, o.v, Date.now()) } : { err: 'op' };   /* 📜 理解小考 5 題都答對（2026-10-21） */
        if (r5.err) return out({ err: r5.err, need: r5.need, v: SC.rpView(rs5, R5.st), stock: rpStock() });
        r5.st = SC.rpTierUp(rs5, r5.st); rpSave(R5, c2.id, r5.st); return out({ ok: true, paid: r5.paid, free: r5.free, r: r5.r, v: SC.rpView(rs5, r5.st), stock: rpStock() });
      } finally { lk5.releaseLock(); }
    }
    if (o.a === 'teacher' || o.a === 'void' || o.a === 'set' || o.a === 'task' || o.a === 'lock' || o.a === 'lockt' || o.a === 'delp' || o.a === 'pw' || o.a === 'rpgb' || o.a === 'rpgw') {
      if (!pwOk(o.pw)) return out({ err: 'pw' });
      /* ⚡ 現場任務 大螢幕：只檢查老師密碼（2026-10-17 第八次） */
      /* 2026-10-21：每一班 上一週 最認真練習 第 1 名（👑 選 1 次 現場任務 的 遊戲） */
      if (o.a === 'pw') { var cp = {}; try { cp = SC.champs(records(), Date.now()); } catch (x) { } return out({ ok: true, champs: cp }); }
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
      /* 🎁 老師的全班獎勵（2026-10-20 第十四次）：① 全班目標（全班每一個人這週都練 3 天）、③ 冠軍寶箱（全年級最認真練習前 5 名）。
         list ＝ [{id, c, x, chest, k}]；k ＝ 編號（同一個人同一個編號只發一次）；不寫練習紀錄 */
      if (o.a === 'rpgw') {
        var lk8 = LockService.getScriptLock(), nw = 0, sk = 0; lk8.waitLock(20000);
        try { (o.list || []).slice(0, 200).forEach(function (b) { var c8 = SC.checkId(b && b.id); if (c8.err || !b.k) return; var R8 = rpRow(c8.id); if (R8.st.bk.indexOf(String(b.k).slice(0, 40)) >= 0) { sk++; return; }
            var n8 = SC.rpBonus(R8.st, b); rpSave(R8, c8.id, n8); nw++; }); } finally { lk8.releaseLock(); }
        return out({ ok: true, n: nw, skip: sk });
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
      return out({ ok: true, now: Date.now(), cols: SC.COLS, rows: rows().map(function (r) { return r.map(function (x) { return x instanceof Date ? x.getTime() : x; }); }), sizes: sizes(), roster: roster(), boards: boardsOn(), tasks: tasks(), locks: locks(), lockt: lockt(), tiers: rpTiers(), quiz: rpQz(), rqv: SC.RPQV, eqs: rpEqs() });
    }
    return out({ err: 'a' });
  } catch (x) { return out({ err: 'server', msg: String(x) }); }
}
