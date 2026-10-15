/* score/_calc.js — 成績紀錄的「怎麼算」：唯一真相來源（2026-10-07 對話 C，使用者決定在 sentences/2026-10-07_C_設計與研究清單.md，Q1～Q18 全部照建議）
 *
 * 同一份程式用在三個地方：① Google Apps Script（score/_build.js 把它接進 Code.gs）② 老師看板（teacher/index.html）③ 量測（node）。
 * 寫法只用 ES5（iPad iOS 14 也跑得動；Apps Script V8 也可以）。不要用 ?? ?. 箭頭函式。
 *
 * 規則（照使用者的決定）：
 *   🎯 正確率（百分制）   一組 ＝ 答對 ÷ 題數 ✕ 100
 *   ⚡ 總分（百分制）     一組 ＝ 每題答對 60 ÷ 題數 ＋ 速度 40 ÷ 題數 ✕（剩下秒數 ÷ 總秒數）（Q1-A：答對 60 ＋ 速度 40）
 *   個人成績             每一組取「最近一次」，再把做過的組平均（Q8-A）
 *   練習次數             做完就算（使用者 2026-10-12 F4：不用對 2/3）；只有「太快亂按」超過一半的那一次不算；同一組一天最多算 3 次（Q11-A）
 *   ⏱ 練習時間           每一題從出現到按下去的秒數加起來（記憶配對 ＝ 整場秒數）（使用者 2026-10-12 第 4 題 A；第 8 件再加看字卡、按聆聽）
 *                        太快亂按不算時間（使用者 2026-10-12 D8）：太快亂按超過一半的那一次整次不算；其他次只算沒有太快亂按的題目
 *   🏆 榮譽（使用者 2026-10-12 D6～D8 定案）只有三種：最認真練習 ＝ 練習時間最多（sec）、成績最優 ＝ 正確率（acc，同分比總分）、進步最多（prog）；
 *                        個人 ＝ 班內前 10 名、全年級前 10 名；班級 ＝ 同年級的班互相比（平均每一個人）。做完幾乎都拿得到的小獎全部拿掉
 *   📅 天天練             這段期間有練的天數
 *   ❤ 用心程度（使用者 2026-10-15 D10～D12 定案）五項，每項最多 20 分，加起來最多 100 分（care）：
 *                        📅 這週 練了 幾天（4 天以上 20，少 1 天 −5）｜📝 做完 幾次 題目、遊戲（練習次數，5 次以上 20，少 1 次 −4）｜
 *                        看完、聽完 才選（太快亂按 0 題 20，每多 5% −4）｜答錯的 改對了（全部改對或沒有答錯 20，改對幾成 ＝ 20 ✕ 幾成）｜
 *                        這週 練習 幾分鐘（30 分鐘以上 20，照比例）；這週 沒有作答 ＝ 第 3、4 項 0 分。第 4 種最高榮譽「最用心」（同分比練習時間）
 *   👀 看字卡（m:'v'，使用者 2026-10-15 D12 ②）句型卡、Review 1 頁、在家複習的每一頁：登入才記；兩次點之間最多算 2 分鐘、3 分鐘沒點不算、換分頁不算；
 *                        只加進「練習時間」（最認真練習、時鐘、用心程度第 5 項），不算練了幾天、不算練習次數、不算正確率
 *   班際（G2-A）          練習次數、練習時間 ＝ 全班加起來 ÷ 全班人數（班級人數 ＞ 名單人數 ＞ 有做的人）；每一班都有自己最強的一項（clsAwards）
 *   🚀 進步               每一組：最近一次 − 上一次（所有作答都算，但「⚡ 秒按」超過一半的那一次不拿來比）；
 *                        個人 ＝ 這段期間做過兩次以上的組平均；上次、這次都 100 ＝「🔥 保持滿分」，不算進平均（Q3-A）
 *   ⚡ 秒按               開始作答 1 秒內就按（Q10-A），只給老師看
 *   同分                 正確率同分比總分，總分也同 ＝ 同名次；其他榜同分 ＝ 同名次（Q14-A）
 *   本週                 台灣時間星期一 00:00 開始（Q12-A）
 *   班級                 三年級 304、307、311；四年級 402、406、409、410；座號 01～30（使用者 2026-10-09，原本 01～40）；只跟同年級比（Q9-A）
 *
 * 2026-10-08 對話 D（使用者決定在 score/2026-10-08_D_全部遊戲納入成績_需求.md 最下面那張表）：遊戲、Review 1 也記
 *   三種紀錄（m）       q ＝ 題目（📝 複習題、Review 1 頁的 📝 複習）；g ＝ 遊戲；mem ＝ 🃏 記憶配對
 *   遊戲的 🎯 正確率     只算每一題「第一次作答」（🔁 類似題、⭐ 加分題、再出一次的題目不算，另外記 ✨ 訂正成功）
 *   遊戲的 ⚡ 總分       一樣是答對 60 ＋ 速度 40（s100）；🎁 驚喜卡、連對加成不算（原始分數照存，只給老師看）
 *   遊戲算 1 次          玩完整場（時間到或打倒魔王；中途離開不送）、第一次作答 ≧ 6 題（使用者 2026-10-09：遊戲改 1 分 30 秒，原本 10 題）、正確率 ≧ 2/3；同一個遊戲一天最多 3 次
 *   🃏 記憶配對          不算正確率、不算總分；只記配完幾對、用幾秒、翻錯幾次（給老師看）；玩完整場就算 1 次
 *
 * 2026-10-09 E（使用者決定在 score/2026-10-09_E_任務期限_課後班_聲音_複習題時機_需求.md 最下面）：老師派任務
 *   任務                 老師看板派：名稱、年級、哪幾班（可以一鍵全年級）、項目（遊戲、📝 複習題、Review 1 的 📝 複習、💼 職業單字遊戲）、
 *                        從幾月幾日幾點 到 幾月幾日幾點。存在試算表「任務」分頁
 *   鎖（tkLock）          這一班「沒有任何正在進行的任務」＝ 全部開放（E2-A，跟以前一樣）；
 *                        有任務正在進行 ＝ 只開任務裡的，其他 🔒；任務裡的東西只在它的時段開（還沒到 ＝ 🔒 幾點開放、過了 ＝ 🔒 已經截止，
 *                        老師把任務刪掉或改期限才會再開）；在家複習同一個代號，一樣管（E3-A）
 *   做到一半截止          讓他做完、成績照記（E4）；截止以後才不能「開始」；做完 ＝ 時段裡（截止後 10 分鐘內送到也算）有一筆紀錄
 *   排行榜               四種榜照舊合在一起（複習題＋遊戲都算）；遊戲結束另外給「這個遊戲本班前 10 名」（gtop）
 *   題組代號             g年級＋教材＋_＋題組：u1／u2 ＝ 📝 複習題、gm ＝ 🎮 句型遊戲、r1 ＝ 📘 Review 1（遊戲和頁面的 📝 複習）
 *                        以後新的教材在 score/_sites.js 登記一行，代號自動產生（例 u3、r2）
 */
var SC = (function () {
  var CLASSES = { 3: ['304', '307', '311'], 4: ['402', '406', '409', '410', '400'] };
  /* 課後班（使用者 2026-10-09 E9・E10・E11）：400 ＝ 四年級課後班（只有四年級、座號 01～30）；不放進班際比較（人數、上課時間都不一樣） */
  var AFTER = { '400': '課後班' };
  function cname(c) { return AFTER[c] ? c + ' ' + AFTER[c] : c + ' 班'; }
  /* 試算表的欄位（「作廢」一定在最後一欄：老師在試算表打 TRUE ＝ 不算） */
  var COLS = ['時間', '5碼', '年級', '班級', '座號', '類別', '題組', '題組名稱', '玩法', '題數', '答對', '正確率', '總分百分制', '訂正成功',
    '配對', '翻錯', '秒數', '原始分數', '秒按', '來源', '平板', '編號', '每題', '作廢'];
  var CI = {}; for (var ci = 0; ci < COLS.length; ci++) CI[COLS[ci]] = ci;
  var SEAT = 30;                                                     /* 座號 01～30（使用者 2026-10-09） */
  var DAY = 864e5, TZ = 8 * 36e5, CAP = 3, TOP = 10, GMIN = 6;
  var MT = { q: '題目', g: '遊戲', mem: '記憶配對', v: '看字卡' }, TM = { '題目': 'q', '遊戲': 'g', '記憶配對': 'mem', '看字卡': 'v' };
  var SETRE = /^g([34])(u\d{1,2}|gm|r\d{1,2}|v)_[\w-]{1,16}$/;
  /* 題組代號 ➜ 類別（老師看板的篩選）：u ＝ 📝 複習題、gm ＝ 🎮 遊戲、r1 ＝ 📘 Review 1 */
  function cat(set) {
    var m = SETRE.exec(String(set)); if (!m) return { k: '', t: '' };
    var x = m[2];
    if (x.charAt(0) === 'u') return { k: 'tq', t: '📝 複習題' };
    if (x === 'gm') return { k: 'game', t: '🎮 遊戲' };
    if (x === 'v') return { k: 'v', t: '👀 看字卡' };
    return { k: x, t: '📘 Review ' + x.slice(1) };
  }

  /* 5 碼 ➜ 班級、座號；不對就回報原因（登入防呆，Q17：年級網站互相擋） */
  function checkId(id, g) {
    id = String(id || '');
    if (!/^\d{5}$/.test(id)) return { err: 'len' };
    var c = id.slice(0, 3), s = +id.slice(3);
    var gg = c.charAt(0) === '3' ? 3 : (c.charAt(0) === '4' ? 4 : 0);
    if (!gg || CLASSES[gg].indexOf(c) < 0) return { err: 'cls', cls: c };
    if (g && gg !== +g) return { err: 'grade', g: gg };
    if (s < 1 || s > SEAT) return { err: 'seat', seat: s };
    return { id: id, g: gg, cls: c, seat: s };
  }
  /* 練習次數 ＋1 嗎（2026-10-12 F4）：做完就算；太快亂按超過一半不算；遊戲還要第一次作答 ≧ GMIN 題；記憶配對 ＝ 玩完整場就算（ok 留著給舊的呼叫） */
  function counts(ok, n, m, fast) { if (m === 'v') return false; if (m === 'mem') return true; if (m === 'g' && n < GMIN) return false; return n > 0 && (+fast || 0) * 2 <= n; }
  /* 一筆紀錄練了幾秒 */
  function secOf(r) { if (r.m === 'mem' || r.m === 'v') return +r.sec || 0; if ((+r.fast || 0) * 2 > r.n) return 0;
    var s = 0; for (var i = 0; i < (r.qs || []).length; i++) if (!r.qs[i][3]) s += +r.qs[i][2] || 0; return s; }
  function need(n) { return Math.ceil(n * 2 / 3); }                     /* 至少要對幾題 */
  function day(t) { return Math.floor((t + TZ) / DAY); }
  function weekStart(t) { var d = day(t), wd = (d + 3) % 7; return (d - wd) * DAY - TZ; }   /* 1970-01-01 是星期四 ➜ +3 ＝ 星期一是 0 */
  function r1(x) { return Math.round(x * 10) / 10; }
  function mean(a) { if (!a.length) return null; var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }

  /* 一題的紀錄：[答對 1/0, 選了第幾個（0 ＝ 正解，-1 ＝ 時間到）, 用了幾秒, 秒按 1/0, 剩下秒數 ÷ 總秒數] */
  function s100(qs) {
    var n = qs.length, s = 0;
    for (var i = 0; i < n; i++) if (qs[i][0]) s += 60 / n + 40 / n * Math.max(0, Math.min(1, +qs[i][4] || 0));
    return Math.round(s * 10) / 10;
  }
  function num(x) { return x === '' || x == null || isNaN(+x) ? null : +x; }   /* 空白 ＝ 沒有（記憶配對沒有正確率） */
  /* 一列（試算表）➜ 一筆紀錄 */
  function fromRow(r) {
    var c = function (k) { return r[CI[k]]; }, q = c('每題'), qs = [];
    try { qs = typeof q === 'string' ? JSON.parse(q || '[]') : (q || []); } catch (e) { qs = []; }
    var t = r[0] instanceof Date ? r[0].getTime() : (typeof r[0] === 'number' ? r[0] : Date.parse(r[0]));
    var id = String(c('5碼')).replace(/\D/g, ''); while (id.length < 5 && id.length) id = '0' + id;
    var x = c('作廢');
    return { t: t, id: id, g: +c('年級'), cls: String(c('班級')), seat: +c('座號'), set: String(c('題組')), name: String(c('題組名稱')),
      m: TM[c('玩法')] || 'q', n: +c('題數') || 0, ok: +c('答對') || 0, acc: num(c('正確率')), s: num(c('總分百分制')), fix: +c('訂正成功') || 0,
      mp: +c('配對') || 0, mw: +c('翻錯') || 0, sec: +c('秒數') || 0, raw: +c('原始分數') || 0, fast: +c('秒按') || 0,
      src: String(c('來源')), dev: String(c('平板')), u: String(c('編號')), qs: qs,
      x: x === true || String(x).toUpperCase() === 'TRUE' || x === '✔' || x === 'v' || x === 'V' };
  }
  function toRow(R) {
    var o = { '時間': new Date(R.t), '5碼': R.id, '年級': R.g, '班級': R.cls, '座號': R.seat, '類別': cat(R.set).t, '題組': R.set, '題組名稱': R.name,
      '玩法': MT[R.m], '題數': R.m === 'mem' || R.m === 'v' ? '' : R.n, '答對': R.m === 'mem' || R.m === 'v' ? '' : R.ok, '正確率': R.acc == null ? '' : R.acc, '總分百分制': R.s == null ? '' : R.s,
      '訂正成功': R.fix || 0, '配對': R.m === 'mem' ? R.mp : '', '翻錯': R.m === 'mem' ? R.mw : '', '秒數': R.sec || '', '原始分數': R.raw, '秒按': R.fast,
      '來源': R.src, '平板': R.dev, '編號': R.u, '每題': JSON.stringify(R.qs), '作廢': false };
    return COLS.map(function (k) { return o[k]; });
  }
  function lim(x, a, b) { x = Math.round(+x || 0); return Math.max(a, Math.min(b, x)); }
  /* 學生端送來的一筆 ➜ 檢查＋算好欄位（不相信學生端算的分數）
     每題 ＝ [答對 1/0, 選了第幾個（0 ＝ 正解，-1 ＝ 時間到）, 用了幾秒, 秒按 1/0, 剩下秒數 ÷ 總秒數, 題庫裡第幾題] */
  function clean(o, now) {
    var c = checkId(o.id); if (c.err) return null;
    var set = String(o.set), sm = SETRE.exec(set); if (!sm || +sm[1] !== c.g) return null;   /* 題組的年級 ＝ 登入的年級 */
    var m = o.m === 'g' || o.m === 'mem' || o.m === 'v' ? o.m : 'q', qs = o.qs || [];
    if ((m === 'v') !== (sm[2] === 'v')) return null;   /* 看字卡只能用 g年級v_ 的代號 */
    if (m === 'mem' || m === 'v') qs = [];
    else if (!qs.length || qs.length > (m === 'g' ? 150 : 10)) return null;
    var Q = [];
    for (var i = 0; i < qs.length; i++) { var q = qs[i];
      Q.push([q[0] ? 1 : 0, Math.max(-1, Math.min(3, Math.round(+q[1] || 0))), Math.max(0, Math.min(60, r1(+q[2] || 0))), q[3] ? 1 : 0,
        Math.max(0, Math.min(1, Math.round((+q[4] || 0) * 1000) / 1000)), lim(q[5] == null ? i : q[5], 0, 999)]); }
    var ok = 0, f = 0; for (i = 0; i < Q.length; i++) { ok += Q[i][0]; f += Q[i][3]; }
    var t = +o.t; if (!(t > now - 30 * DAY && t < now + 5 * 6e4)) t = now;   /* 平板時間不對就用伺服器時間；沒網路補送的照當時 */
    return { t: t, id: c.id, g: c.g, cls: c.cls, seat: c.seat, set: set, name: String(o.name || '').slice(0, 60), m: m, n: Q.length, ok: ok,
      acc: m === 'mem' || m === 'v' ? null : Math.round(ok / Q.length * 100), s: m === 'mem' || m === 'v' ? null : s100(Q), fix: lim(o.fix, 0, 999),
      mp: m === 'mem' ? lim(o.mp, 0, 999) : 0, mw: m === 'mem' ? lim(o.mw, 0, 9999) : 0, sec: lim(o.sec, 0, 3600),
      raw: lim(o.raw, 0, 1e8), fast: f,
      src: o.src === 'home' ? 'home' : 'school', dev: String(o.dev || '').replace(/[^\w]/g, '').slice(0, 12), u: String(o.u || '').replace(/[^\w]/g, '').slice(0, 24), qs: Q, x: false };
  }
  function pick(rs, f) { /* f: {g, cls, from, to, src, cat} */
    var out = [];
    for (var i = 0; i < rs.length; i++) { var r = rs[i];
      if (r.x) continue; if (f.g && r.g !== +f.g) continue; if (f.cls && r.cls !== f.cls) continue;
      if (f.from != null && r.t < f.from) continue; if (f.to != null && r.t >= f.to) continue; if (f.src && r.src !== f.src) continue;
      if (f.cat && cat(r.set).k !== f.cat) continue;
      out.push(r); }
    return out;
  }
  /* 每一個人：🎯 正確率、⚡ 總分、🔁 次數、🚀 進步、🔥 保持滿分 */
  function students(rs) {
    var by = {}, ids = [];
    rs.slice().sort(function (a, b) { return a.t - b.t; }).forEach(function (r) {
      var p = by[r.id]; if (!p) { p = by[r.id] = { id: r.id, g: r.g, cls: r.cls, seat: r.seat, sets: {}, all: 0, last: 0, fastQ: 0, q: 0, fix: 0, sec: 0, vsec: 0, dd: {}, nd: 0, wk: {}, W: 0, F: 0 }; ids.push(r.id); }
      if (r.m === 'v') { p.sec += secOf(r); p.vsec += secOf(r); return; }   /* 👀 看字卡：只加練習時間 */
      (p.sets[r.set] = p.sets[r.set] || []).push(r); p.all++; p.last = r.t; p.fastQ += r.fast; p.q += r.n; p.fix += r.fix || 0; p.sec += secOf(r);
      var d0 = day(r.t); if (!p.dd[d0]) { p.dd[d0] = 1; p.nd++; }
      /* 答錯的 改對了：題目 ＝ 同一題（題組＃第幾題）錯過、後來又答對；遊戲 ＝ 第一次答錯幾題、✨ 訂正成功幾題；太快亂按超過一半的那一次不算 */
      if (r.fast * 2 > r.n) return;
      if (r.m === 'g') { var bad = r.n - r.ok; p.W += bad; p.F += Math.min(bad, r.fix || 0); return; }
      (r.qs || []).forEach(function (q, j) { var k = r.set + '#' + (q[5] == null ? j : q[5]);
        if (!q[0]) { if (!p.wk[k]) { p.wk[k] = 1; p.W++; } } else if (p.wk[k] === 1) { p.wk[k] = 2; p.F++; } });
    });
    return ids.map(function (id) {
      var p = by[id], A = [], S = [], D = [], PF = [], PT = [], keep = false, cnt = 0, nsets = 0;
      for (var k in p.sets) { var a = p.sets[k], L = a[a.length - 1]; nsets++;
        if (L.acc != null) A.push(L.acc); if (L.s != null) S.push(L.s);   /* 記憶配對沒有正確率、總分 */
        var perDay = {}; a.forEach(function (r) { if (counts(r.ok, r.n, r.m, r.fast)) { var d = day(r.t); perDay[d] = (perDay[d] || 0) + 1; if (perDay[d] <= CAP) cnt++; } });
        var v = a.filter(function (r) { return r.acc != null && r.fast * 2 <= r.n; });
        if (v.length >= 2) { var x = v[v.length - 1].acc, y = v[v.length - 2].acc; if (x === 100 && y === 100) keep = true; else { D.push(x - y); PF.push(y); PT.push(x); } }
      }
      var acc = mean(A), s = mean(S), pr = mean(D);
      return { id: id, g: p.g, cls: p.cls, seat: p.seat, acc: acc == null ? null : r1(acc), s: s == null ? null : r1(s), count: cnt,
        prog: pr == null ? null : r1(pr), pf: pr == null ? null : Math.round(mean(PF)), pt: pr == null ? null : Math.round(mean(PT)), keep: keep && pr == null ? true : keep, sets: nsets, all: p.all, last: p.last, fastQ: p.fastQ, q: p.q, fix: p.fix,
        sec: Math.round(p.sec), vsec: Math.round(p.vsec), days: p.nd, W: p.W, F: p.F };
    }).map(function (o) { o.care = care(o).tot; return o; });
  }
  /* ❤ 用心程度（使用者 2026-10-15 D10 第 8 題 A、D12 ①）：五項各 0～20 分 ➜ { it:[天, 次, 看完聽完, 改對, 分鐘], tot, raw } */
  var CAREMAX = { days: 4, count: 5, sec: 1800 };
  function care(p) {
    p = p || {}; var days = +p.days || 0, cnt = +p.count || 0, q = +p.q || 0, fq = +p.fastQ || 0, W = +p.W || 0, F = +p.F || 0, sec = +p.sec || 0;
    var fp = q ? Math.round(fq / q * 100) : 0;
    var it = [Math.min(20, 5 * days), Math.min(20, 4 * cnt), q ? Math.max(0, Math.round(20 - 0.8 * (fq / q * 100))) : 0,
      q ? (W ? Math.round(20 * Math.min(F, W) / W) : 20) : 0, Math.min(20, Math.round(20 * sec / CAREMAX.sec))];
    return { it: it, tot: it[0] + it[1] + it[2] + it[3] + it[4], raw: { days: days, count: cnt, q: q, fq: fq, fp: fp, W: W, F: Math.min(F, W), sec: sec } };
  }
  /* 排名：同分同名次（1、1、3）；正確率同分比總分 */
  var BOARDS = {
    acc: { v: function (p) { return p.acc; }, cmp: function (a, b) { return (b.acc - a.acc) || (b.s - a.s); }, eq: function (a, b) { return a.acc === b.acc && a.s === b.s; }, ok: function (p) { return p.acc != null; } },
    s: { v: function (p) { return p.s; }, cmp: function (a, b) { return b.s - a.s; }, eq: function (a, b) { return a.s === b.s; }, ok: function (p) { return p.s != null; } },
    count: { v: function (p) { return p.count; }, cmp: function (a, b) { return b.count - a.count; }, eq: function (a, b) { return a.count === b.count; }, ok: function (p) { return p.count > 0; } },
    prog: { v: function (p) { return p.prog; }, cmp: function (a, b) { return b.prog - a.prog; }, eq: function (a, b) { return a.prog === b.prog; }, ok: function (p) { return p.prog != null && p.prog > 0; } },
    sec: { v: function (p) { return p.sec; }, cmp: function (a, b) { return b.sec - a.sec; }, eq: function (a, b) { return a.sec === b.sec; }, ok: function (p) { return p.sec > 0; } },
    /* ❤ 最用心：用心程度，同分比練習時間（D12 ④） */
    care: { v: function (p) { return p.care; }, cmp: function (a, b) { return (b.care - a.care) || (b.sec - a.sec); }, eq: function (a, b) { return a.care === b.care && a.sec === b.sec; }, ok: function (p) { return p.care > 0; } }
  };
  function rank(ps, key) {
    var B = BOARDS[key], L = ps.filter(B.ok).sort(function (a, b) { return B.cmp(a, b) || (a.id < b.id ? -1 : 1); });
    var out = [], rk = 0;
    for (var i = 0; i < L.length; i++) { if (!i || !B.eq(L[i], L[i - 1])) rk = i + 1; out.push({ id: L[i].id, cls: L[i].cls, v: B.v(L[i]), rk: rk }); }
    return out;
  }
  /* ── 老師派任務（2026-10-09 E）── */
  var TKGRACE = 10 * 6e4, TKMAXI = 80;
  function tkClean(t, now) {
    t = t || {}; var g = +t.g; if (g !== 3 && g !== 4) return null;
    var cls = [], items = [], nm = {}, i;
    for (i = 0; i < (t.cls || []).length; i++) { var c = String(t.cls[i]); if (CLASSES[g].indexOf(c) >= 0 && cls.indexOf(c) < 0) cls.push(c); }
    for (i = 0; i < (t.items || []).length && items.length < TKMAXI; i++) { var k = String(t.items[i]), m = SETRE.exec(k);
      if (m && +m[1] === g && items.indexOf(k) < 0) { items.push(k); nm[k] = String((t.nm || {})[k] || k).slice(0, 60); } }
    var from = Math.round(+t.from), to = Math.round(+t.to);
    if (!cls.length || !items.length || !(from > 0) || !(to > from)) return null;
    var id = String(t.id || '').replace(/[^\w]/g, '').slice(0, 24) || ('t' + now);
    return { id: id, name: String(t.name || '任務').replace(/^\s+|\s+$/g, '').slice(0, 30) || '任務', g: g, cls: cls, items: items, nm: nm, from: from, to: to };
  }
  /* 這個學生（5 碼）的班有哪些任務（給學生端：不給別班的） */
  function tkFor(T, id) {
    var c = checkId(id); if (c.err) return [];
    return T.filter(function (t) { return t.g === c.g && t.cls.indexOf(c.cls) >= 0; })
      .map(function (t) { return { id: t.id, name: t.name, items: t.items, nm: t.nm, from: t.from, to: t.to }; });
  }
  /* 做完了沒有：時段裡（截止後 10 分鐘內送到也算，E4）有一筆這個項目的紀錄 */
  function tkDone(rs, t, id) {
    var d = [];
    rs.forEach(function (r) { if (!r.x && r.id === id && r.t >= t.from && r.t <= t.to + TKGRACE && t.items.indexOf(r.set) >= 0 && d.indexOf(r.set) < 0) d.push(r.set); });
    return d;
  }
  /* 鎖：T ＝ 這一班的任務、key ＝ 題組代號、now ＝ 現在
     回傳 k：free 沒有任務（全部開放）｜open 任務裡、正在開（to ＝ 截止）｜soon 還沒到（from）｜end 已經截止（to）｜off 老師現在指定別的（act ＝ 正在進行的任務） */
  function tkLock(T, key, now) {
    var act = [], mine = [], i, t;
    for (i = 0; i < (T || []).length; i++) { t = T[i]; var on = t.from <= now && now <= t.to;
      if (on) act.push(t); if (t.items.indexOf(key) >= 0) mine.push(t); }
    var a = mine.filter(function (x) { return x.from <= now && now <= x.to; });
    if (a.length) return { k: 'open', to: Math.max.apply(null, a.map(function (x) { return x.to; })), task: a[0] };
    if (mine.length) {
      var f = mine.filter(function (x) { return x.from > now; });
      if (f.length) return { k: 'soon', from: Math.min.apply(null, f.map(function (x) { return x.from; })), task: f[0] };
      return { k: 'end', to: Math.max.apply(null, mine.map(function (x) { return x.to; })), task: mine[0] };
    }
    if (act.length) return { k: 'off', act: act };
    return { k: 'free' };
  }
  /* ── 〔🔒 開關〕（2026-10-12 D 第 7 件，使用者 D16 A）：老師一鍵鎖住在家複習網站的任何主題（句型卡每一個分頁、遊戲、補充頁；裡面的 📝 複習題跟著鎖）──
     存法 L ＝ { '304': ['g3rv_u1-t0-0', …], … }（伺服器的指令碼屬性 LOCKS）；鎖住的連任務也打不開；教學網站不鎖（老師上課要用）
     學生端：沒登入 ＝ 只知道「有沒有任何一班鎖住」（lkAny，不給班級，D6 第 13 題）；登入了 ＝ 只拿自己班的（lkFor） */
  var LKRE = /^g([34])rv_[\w-]{1,30}$/;
  function lkClean(L) { var o = {}; L = L || {};
    for (var c in L) { var cc = String(c), g = cc.charAt(0) === '3' ? 3 : (cc.charAt(0) === '4' ? 4 : 0); if (!g || CLASSES[g].indexOf(cc) < 0) continue;
      var a = []; (L[c] || []).forEach(function (k) { k = String(k); var m = LKRE.exec(k); if (m && +m[1] === g && a.indexOf(k) < 0 && a.length < 200) a.push(k); });
      if (a.length) o[cc] = a.sort(); }
    return o; }
  /* 鎖（on true）或開（false）：哪幾班 × 哪些代號 */
  function lkSet(L, cls, keys, on) { L = lkClean(L);
    (cls || []).forEach(function (c) { c = String(c); var a = (L[c] || []).filter(function (k) { return (keys || []).indexOf(k) < 0; }); if (on) a = a.concat(keys || []); L[c] = a; });
    return lkClean(L); }
  function lkAny(L, g) { var a = []; L = lkClean(L); for (var c in L) if (c.charAt(0) === String(g)) L[c].forEach(function (k) { if (a.indexOf(k) < 0) a.push(k); }); return a.sort(); }
  function lkFor(L, id) { var c = checkId(id); if (c.err) return []; return lkClean(L)[c.cls] || []; }
  /* 班級：有做的人的平均（Q13-A）＋參與率（要老師填人數） */
  function classes(ps, g, sizes) {
    return CLASSES[g].filter(function (c) { return !AFTER[c]; }).map(function (c) {
      var m = ps.filter(function (p) { return p.cls === c; });
      var nn = function (k) { return m.filter(function (p) { return p[k] != null; }).map(function (p) { return p[k]; }); };
      var a = mean(nn('acc')), s = mean(nn('s')), pr = mean(nn('prog')), cnt = 0, sec = 0, cr = 0;
      m.forEach(function (p) { cnt += p.count; sec += p.sec || 0; cr += p.care || 0; });
      var size = sizes && +sizes[c] > 0 ? +sizes[c] : null, per = Math.max(size || 0, m.length) || 1;   /* G2-A：平均每一個人（除以全班人數） */
      return { cls: c, n: m.length, size: size, acc: a == null ? null : r1(a), s: s == null ? null : r1(s), count: cnt, prog: pr == null ? null : r1(pr),
        sec: sec, cntP: m.length ? r1(cnt / per) : null, secP: m.length ? Math.round(sec / per) : null, careP: m.length ? Math.round(cr / per) : null };   /* 最用心的班：沒練的人 ＝ 0 分（D12 ④） */
    });
  }
  /* 班際榮譽（使用者 2026-10-12 D6～D8 定案）：3 種（最認真練習的班 ＝ 平均每一個人練習時間、成績最優的班 ＝ 平均正確率、進步最多的班 ＝ 平均進步）。
     best ＝ 每一班名次最前面的那一種（只給老師看板參考；學生平板、投影不再演「每一班都有自己最強的一項」） */
  var AW = ['sec', 'acc', 'prog', 'care'];
  var CB = [['sec', 'secP'], ['acc', 'acc'], ['prog', 'prog'], ['care', 'careP']];
  function clsAwards(cl) {
    var R = {}, best = {};
    CB.forEach(function (b) {
      var L = cl.filter(function (c) { return c.n > 0 && c[b[1]] != null && (b[0] !== 'prog' || c.prog > 0) && (b[0] === 'acc' || c[b[1]] > 0); })
        .sort(function (x, y) { return (y[b[1]] - x[b[1]]) || (x.cls < y.cls ? -1 : 1); });
      var rk = 0; R[b[0]] = L.map(function (c, i) { if (!i || c[b[1]] !== L[i - 1][b[1]]) rk = i + 1; return { cls: c.cls, v: c[b[1]], rk: rk }; });
      R[b[0]].forEach(function (x) { if (!best[x.cls] || x.rk < best[x.cls].rk) best[x.cls] = { k: b[0], rk: x.rk, v: x.v }; });
    });
    return { rk: R, best: best };
  }
  /* 錯題：每一題答了幾次、錯幾次、四個選項各被選幾次（選項 0 ＝ 正解，-1 ＝ 時間到）
     題目 ＝ 題組＋題庫裡第幾題（每題第 6 格；舊紀錄沒有 ＝ 第幾個） */
  function questions(rs) {
    var Q = {};
    rs.forEach(function (r) { r.qs.forEach(function (q, j) {
      var i = q[5] == null ? j : +q[5], k = r.set + '#' + i, o = Q[k] = Q[k] || { k: k, set: r.set, i: i, n: 0, bad: 0, p: { '-1': 0, 0: 0, 1: 0, 2: 0, 3: 0 }, fast: 0 };
      o.n++; if (!q[0]) o.bad++; o.p[q[1]] = (o.p[q[1]] || 0) + 1; o.fast += q[3]; }); });
    var L = []; for (var k in Q) { Q[k].rate = Math.round(Q[k].bad / Q[k].n * 100); L.push(Q[k]); }
    return L.sort(function (a, b) { return (b.rate - a.rate) || (b.bad - a.bad); });
  }
  /* 學生看得到的（Q2、Q4、使用者 2026-10-07：只公開前 10 名；自己不在前 10 名只給差距，不給名次數字） */
  function top(list) { return list.filter(function (x) { return x.rk <= TOP; }); }
  function gtop(rs, me) {
    var b = {};
    rs.forEach(function (r) { var x = b[r.id]; if (!x || r.acc > x.acc || (r.acc === x.acc && r.s > x.s)) b[r.id] = { id: r.id, acc: r.acc, s: r.s }; });
    var ps = []; for (var k in b) ps.push(b[k]);
    var L = rank(ps, 'acc'), mm = mine(L, me), bm = b[me];
    return { list: top(L).map(function (x) { return { id: x.id, rk: x.rk, acc: b[x.id].acc, s: b[x.id].s }; }),
      rk: mm && mm.rk <= TOP ? mm.rk : null, best: bm ? { acc: bm.acc, s: bm.s } : null, cut: L.length >= TOP ? b[top(L)[top(L).length - 1].id].acc : null };
  }
  function mine(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function view(all, o, now, boardsOn, sizes) {
    var c = checkId(o.id); if (c.err) return { err: c.err };
    var from = weekStart(now), W = pick(all, { g: c.g, from: from });
    var ps = students(W), me = mine(ps, c.id) || { id: c.id, acc: null, s: null, count: 0, prog: null, keep: false };
    var lw = students(pick(all, { g: c.g, from: from - 7 * DAY, to: from }).filter(function (r) { return r.id === c.id; }))[0];
    var out = { id: c.id, cls: c.cls, g: c.g, week: from, boards: !!boardsOn,
      me: { acc: me.acc, s: me.s, count: me.count, prog: me.prog, pf: me.pf, pt: me.pt, keep: !!me.keep, sec: me.sec || 0, days: me.days || 0, secPrev: lw ? lw.sec : 0, care: care(me) } };
    /* 這一組（作答中右上角的名次）：本班別人這週在這一組最好的原始分數，前 10 個 */
    if (o.set) {
      var best = {}; W.forEach(function (r) { if (r.set === o.set && r.cls === c.cls && r.id !== c.id) best[r.id] = Math.max(best[r.id] || 0, r.raw); });
      var v = []; for (var k in best) v.push(best[k]); v.sort(function (a, b) { return b - a; });
      var mineSet = W.filter(function (r) { return r.set === o.set && r.id === c.id; });
      out.set = { others: boardsOn ? v.slice(0, TOP) : [], tries: mineSet.length,
        prev: mineSet.length ? mineSet[mineSet.length - 1].acc : null,
        prevValid: (function () { var a = mineSet.filter(function (r) { return r.fast * 2 <= r.n; }); return a.length ? a[a.length - 1].acc : null; })(),
        best: mineSet.length ? Math.max.apply(null, mineSet.map(function (r) { return r.acc; })) : null,
        today: mineSet.filter(function (r) { return day(r.t) === day(now) && counts(r.ok, r.n, r.m, r.fast); }).length };
      /* 遊戲：這個遊戲本班前 10 名（這週，每個人最好的一次：正確率，同分比總分） */
      if (o.gt && boardsOn) out.gtop = gtop(W.filter(function (r) { return r.set === o.set && r.cls === c.cls && r.acc != null; }), c.id);
    }
    /* 班級長條（我幫全班）：這週各班平均正確率 */
    var cl = classes(ps, c.g, sizes || null);
    out.classes = cl.map(function (x) { return { cls: x.cls, acc: x.acc, n: x.n, count: x.count }; });
    var myc = ps.filter(function (p) { return p.cls === c.cls; }), tot = 0; myc.forEach(function (p) { tot += p.count; });
    out.mycls = { n: myc.length, count: tot };   /* 本班這週一起練了幾次（全班合照） */
    if (o.u) { var ps0 = students(W.filter(function (r) { return r.u !== o.u; }));
      var b0 = classes(ps0, c.g, null).filter(function (x) { return x.cls === c.cls; })[0], b1 = cl.filter(function (x) { return x.cls === c.cls; })[0];
      out.delta = !b0 || !b1 || b0.acc == null || b1.acc == null ? null : r1(b1.acc - b0.acc); }   /* 課後班不在班際比較 ➜ 沒有 delta */
    if (boardsOn) {
      out.top = {}; out.cut = {}; out.rk = {};
      /* 這一次（o.u）以前的名次：第一次進榜或名次上升，平板才演榮譽動畫（使用者 2026-10-12 D6 第 4 題 A） */
      if (!o.u) ps0 = null;   /* ps0 ＝ 上面算好的「不算這一次」 */
      if (ps0) { out.rk0 = {}; AW.forEach(function (k) {
        var a0 = mine(rank(ps0.filter(function (p) { return p.cls === c.cls; }), k), c.id), b0 = mine(rank(ps0, k), c.id);
        out.rk0[k] = { cls: a0 && a0.rk <= TOP ? a0.rk : null, grade: b0 && b0.rk <= TOP ? b0.rk : null }; }); }
      ['acc', 's', 'count', 'prog', 'sec', 'care'].forEach(function (k) {
        var g = rank(ps, k), cc = rank(ps.filter(function (p) { return p.cls === c.cls; }), k);
        out.top[k] = { cls: top(cc), grade: top(g) };
        /* 第 10 名的分數（給「再多 N 就進前 10」）；人數不到 10 個 ＝ 有做就進得去 */
        var cut = function (L) { var t = top(L); return t.length >= TOP ? t[t.length - 1].v : null; };
        out.cut[k] = { cls: cut(cc), grade: cut(g) };
        var a = mine(cc, c.id), b = mine(g, c.id);
        out.rk[k] = { cls: a && a.rk <= TOP ? a.rk : null, grade: b && b.rk <= TOP ? b.rk : null };   /* 只有前 10 名才給名次 */
      });
      out.keep = ps.filter(function (p) { return p.keep && p.cls === c.cls; }).map(function (p) { return p.id; });
      if (!AFTER[c.cls]) { var ca = clsAwards(cl), ca0 = ps0 ? clsAwards(classes(ps0, c.g, sizes || null)) : null, f = function (L) { for (var i = 0; i < L.length; i++) if (L[i].cls === c.cls) return L[i]; return null; };
        out.caw = ca.best[c.cls] || null; out.cls1 = {}; out.crk = {}; if (ca0) out.crk0 = {};
        CB.forEach(function (b) { var k = b[0], x = f(ca.rk[k]); out.cls1[k] = (ca.rk[k][0] || {}).cls || null; out.crk[k] = x ? { rk: x.rk, v: x.v } : null;
          if (ca0) { var y = f(ca0.rk[k]); out.crk0[k] = y ? y.rk : null; } }); }
    }
    return out;
  }
  return { CLASSES: CLASSES, AFTER: AFTER, cname: cname, SEAT: SEAT, COLS: COLS, CI: CI, CAP: CAP, TOP: TOP, GMIN: GMIN, MT: MT, checkId: checkId, cat: cat, counts: counts, need: need, day: day, weekStart: weekStart,
    AW: AW, care: care, CAREMAX: CAREMAX, s100: s100, fromRow: fromRow, toRow: toRow, clean: clean, pick: pick, students: students, rank: rank, classes: classes, clsAwards: clsAwards, secOf: secOf, questions: questions, gtop: gtop, view: view,
    lkClean: lkClean, lkSet: lkSet, lkAny: lkAny, lkFor: lkFor, LKRE: LKRE,
    tkClean: tkClean, tkFor: tkFor, tkDone: tkDone, tkLock: tkLock, TKGRACE: TKGRACE };
})();
if (typeof module !== 'undefined') module.exports = SC;
