/* 成績紀錄（英文句型網站：📝 複習題、遊戲、Review 1）— Google Apps Script
 * 本檔由 score/_build.js 產生（_calc.js ＋ _server.js），不要手改；要改就改那兩個檔再跑 node score/_build.js。
 * 部署步驟：score/deploy.html（大字版）。密碼放在「專案設定 ➜ 指令碼屬性」的 TEACHER_PW，不要寫在這裡。 */

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
 *   📅 練習分數（2026-10-16 老師 C5「1 乙」：原本的「❤ 用心程度」整個合併成「📅 練習」，❤ 用心這兩個字全網站拿掉；程式裡還叫 care）
 *                        五項，每項最多 20 分，加起來最多 100 分（care）：
 *                        📅 這週 練了 幾天（4 天以上 20，少 1 天 −5）｜📝 做完 幾次 題目、遊戲（練習次數，5 次以上 20，少 1 次 −4）｜
 *                        看完、聽完 才選（太快亂按 0 題 20，每多 5% −4）｜答錯的 改對了（全部改對或沒有答錯 20，改對幾成 ＝ 20 ✕ 幾成）｜
 *                        這週 練習 幾分鐘（30 分鐘以上 20，照比例）；這週 沒有作答 ＝ 第 3、4 項 0 分。
 *                        ~~第 4 種最高榮譽「最用心」~~ ➜ 2026-10-16 C5 第 3 題 A 拿掉，最高榮譽回到 3 種（最認真練習 照舊比分鐘：C5 第 2 題 A）
 *   🎧 聽完字卡（m:'l'，2026-10-16 C4 第 6 題 A、6-2 A、C5「1 乙」）在家複習的字卡：一張卡的單字和句子從頭到尾唸完 ＝ 聽 1 次；
 *                        一站（一組卡）每一張都聽完 ＝ 學生端送一筆（代號 g年級l_站）＝ 練習次數 ＋1（同一站一天最多 3 次，跟題目一樣用 CAP）；
 *                        那一天有一筆 ＝ 練了 1 天。不算正確率、總分、進步、練習時間（時間已經在 👀 看字卡裡）
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
  var MT = { q: '題目', g: '遊戲', mem: '記憶配對', v: '看字卡', l: '聽完字卡' }, TM = { '題目': 'q', '遊戲': 'g', '記憶配對': 'mem', '看字卡': 'v', '聽完字卡': 'l' };
  var SETRE = /^g([34])(u\d{1,2}|gm|r\d{1,2}|v|l)_[\w-]{1,16}$/;
  function noQ(m) { return m === 'mem' || m === 'v' || m === 'l'; }   /* 沒有題目（沒有正確率、總分） */
  /* 題組代號 ➜ 類別（老師看板的篩選）：u ＝ 📝 複習題、gm ＝ 🎮 遊戲、r1 ＝ 📘 Review 1 */
  function cat(set) {
    var m = SETRE.exec(String(set)); if (!m) return { k: '', t: '' };
    var x = m[2];
    if (x.charAt(0) === 'u') return { k: 'tq', t: '📝 複習題' };
    if (x === 'gm') return { k: 'game', t: '🎮 遊戲' };
    if (x === 'v') return { k: 'v', t: '👀 看字卡' };
    if (x === 'l') return { k: 'l', t: '🎧 聽完字卡' };
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
  function counts(ok, n, m, fast) { if (m === 'v') return false; if (m === 'mem' || m === 'l') return true; if (m === 'g' && n < GMIN) return false; return n > 0 && (+fast || 0) * 2 <= n; }
  /* 一筆紀錄練了幾秒 */
  function secOf(r) { if (r.m === 'l') return 0; if (r.m === 'mem' || r.m === 'v') return +r.sec || 0; if ((+r.fast || 0) * 2 > r.n) return 0;
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
      '玩法': MT[R.m], '題數': noQ(R.m) ? '' : R.n, '答對': noQ(R.m) ? '' : R.ok, '正確率': R.acc == null ? '' : R.acc, '總分百分制': R.s == null ? '' : R.s,
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
    var m = o.m === 'g' || o.m === 'mem' || o.m === 'v' || o.m === 'l' ? o.m : 'q', qs = o.qs || [];
    if ((m === 'v') !== (sm[2] === 'v') || (m === 'l') !== (sm[2] === 'l')) return null;   /* 看字卡只能用 g年級v_、聽完字卡只能用 g年級l_ 的代號 */
    if (noQ(m)) qs = [];
    else if (!qs.length || qs.length > (m === 'g' ? 150 : 10)) return null;
    var Q = [];
    for (var i = 0; i < qs.length; i++) { var q = qs[i];
      Q.push([q[0] ? 1 : 0, Math.max(-1, Math.min(3, Math.round(+q[1] || 0))), Math.max(0, Math.min(60, r1(+q[2] || 0))), q[3] ? 1 : 0,
        Math.max(0, Math.min(1, Math.round((+q[4] || 0) * 1000) / 1000)), lim(q[5] == null ? i : q[5], 0, 999)]); }
    var ok = 0, f = 0; for (i = 0; i < Q.length; i++) { ok += Q[i][0]; f += Q[i][3]; }
    var t = +o.t; if (!(t > now - 30 * DAY && t < now + 5 * 6e4)) t = now;   /* 平板時間不對就用伺服器時間；沒網路補送的照當時 */
    return { t: t, id: c.id, g: c.g, cls: c.cls, seat: c.seat, set: set, name: String(o.name || '').slice(0, 60), m: m, n: Q.length, ok: ok,
      acc: noQ(m) ? null : Math.round(ok / Q.length * 100), s: noQ(m) ? null : s100(Q), fix: lim(o.fix, 0, 999),
      mp: m === 'mem' ? lim(o.mp, 0, 999) : 0, mw: m === 'mem' ? lim(o.mw, 0, 9999) : 0, sec: m === 'l' ? 0 : lim(o.sec, 0, 3600),
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
      var p = by[r.id]; if (!p) { p = by[r.id] = { id: r.id, g: r.g, cls: r.cls, seat: r.seat, sets: {}, all: 0, last: 0, fastQ: 0, q: 0, fix: 0, sec: 0, vsec: 0, lc: 0, dd: {}, nd: 0, wk: {}, W: 0, F: 0 }; ids.push(r.id); }
      if (r.m === 'v') { p.sec += secOf(r); p.vsec += secOf(r); return; }   /* 👀 看字卡：只加練習時間 */
      (p.sets[r.set] = p.sets[r.set] || []).push(r); p.all++; p.last = r.t; p.fastQ += r.fast; p.q += r.n; p.fix += r.fix || 0; p.sec += secOf(r);
      var d0 = day(r.t); if (!p.dd[d0]) { p.dd[d0] = 1; p.nd++; }
      if (r.m === 'l') { p.lc++; return; }   /* 🎧 聽完字卡：算天數、練習次數（下面照題組一天最多 3 次） */
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
        sec: Math.round(p.sec), vsec: Math.round(p.vsec), days: p.nd, W: p.W, F: p.F, lc: p.lc };
    }).map(function (o) { o.care = care(o).tot; return o; });
  }
  /* 📅 練習分數（原本的 ❤ 用心程度，2026-10-16 C5 合併改名；使用者 2026-10-15 D10 第 8 題 A、D12 ①）：五項各 0～20 分 ➜ { it:[天, 次, 看完聽完, 改對, 分鐘], tot, raw }
     天、次 也算 🎧 聽完字卡（2026-10-16 C4 第 6 題 A） */
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
    /* 📅 練習分數，同分比練習時間（原本「❤ 最用心」的榜；2026-10-16 C5 第 3 題 A 不再是最高榮譽，只給老師看板排序） */
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
  /* ── 〔🔒 開關〕的開放時間（2026-10-17 老師看完 C9（第八次）第 10 題 甲＋乙）：LT ＝ { '304': { 'g3rv_u1-t0-0': [從, 到], … }, … }（指令碼屬性 LOCKT）
     有時間的主題：從～到 之間開，之前 ＝ 還沒開放、之後 ＝ 結束了（都是鎖住）；同一個主題又按 🔒／🔓 ＝ 時間拿掉 */
  function lktClean(T) { var o = {}; T = T || {};
    for (var c in T) { var cc = String(c), g = cc.charAt(0) === '3' ? 3 : (cc.charAt(0) === '4' ? 4 : 0); if (!g || CLASSES[g].indexOf(cc) < 0) continue;
      var m = {}, n = 0, x = T[c] || {};
      for (var k in x) { var kk = String(k), r = LKRE.exec(kk), w = x[k] || [], a = Math.round(+w[0]), b = Math.round(+w[1]);
        if (r && +r[1] === g && a > 0 && b > a && n < 200) { m[kk] = [a, b]; n++; } }
      if (n) o[cc] = m; }
    return o; }
  /* 設定（from、to 都有）或拿掉（from 空白）：哪幾班 × 哪些代號 */
  function lktSet(T, cls, keys, from, to) { T = lktClean(T); from = Math.round(+from); to = Math.round(+to);
    (cls || []).forEach(function (c) { c = String(c); var m = T[c] || {}; (keys || []).forEach(function (k) { if (from > 0 && to > from) m[String(k)] = [from, to]; else delete m[String(k)]; }); T[c] = m; });
    return lktClean(T); }
  /* 這一班現在鎖住的代號：🔒 一直鎖的＋有時間、現在不在時間裡的 */
  function lkNow(L, T, cls, now) { var a = (lkClean(L)[cls] || []).slice(), m = lktClean(T)[cls] || {};
    for (var k in m) { var w = m[k]; if ((now < w[0] || now > w[1]) && a.indexOf(k) < 0) a.push(k); }
    return a.sort(); }
  function lkAny(L, g, T, now) { var a = [], cs = CLASSES[g] || []; now = now || Date.now();
    cs.forEach(function (c) { lkNow(L, T, c, now).forEach(function (k) { if (a.indexOf(k) < 0) a.push(k); }); }); return a.sort(); }
  function lkFor(L, id, T, now) { var c = checkId(id); if (c.err) return []; return lkNow(L, T, c.cls, now || Date.now()); }
  /* 班級：有做的人的平均（Q13-A）＋參與率（要老師填人數） */
  function classes(ps, g, sizes) {
    return CLASSES[g].filter(function (c) { return !AFTER[c]; }).map(function (c) {
      var m = ps.filter(function (p) { return p.cls === c; });
      var nn = function (k) { return m.filter(function (p) { return p[k] != null; }).map(function (p) { return p[k]; }); };
      var a = mean(nn('acc')), s = mean(nn('s')), pr = mean(nn('prog')), cnt = 0, sec = 0, cr = 0;
      m.forEach(function (p) { cnt += p.count; sec += p.sec || 0; cr += p.care || 0; });
      var size = sizes && +sizes[c] > 0 ? +sizes[c] : null, per = Math.max(size || 0, m.length) || 1;   /* G2-A：平均每一個人（除以全班人數） */
      return { cls: c, n: m.length, size: size, acc: a == null ? null : r1(a), s: s == null ? null : r1(s), count: cnt, prog: pr == null ? null : r1(pr),
        sec: sec, cntP: m.length ? r1(cnt / per) : null, secP: m.length ? Math.round(sec / per) : null, careP: m.length ? Math.round(cr / per) : null };   /* 📅 練習分數 平均每一個人：沒練的人 ＝ 0 分 */
    });
  }
  /* 班際榮譽（使用者 2026-10-12 D6～D8 定案）：3 種（最認真練習的班 ＝ 平均每一個人練習時間、成績最優的班 ＝ 平均正確率、進步最多的班 ＝ 平均進步）。
     best ＝ 每一班名次最前面的那一種（只給老師看板參考；學生平板、投影不再演「每一班都有自己最強的一項」） */
  var AW = ['sec', 'acc', 'prog'];   /* 2026-10-16 C5 第 3 題 A：拿掉 ❤ 最用心，回到 3 種 */
  var CB = [['sec', 'secP'], ['acc', 'acc'], ['prog', 'prog']];
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
      ['acc', 's', 'count', 'prog', 'sec'].forEach(function (k) {
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
  /* ══ 🦸 角色、武器、寵物、寶物（2026-10-17 老師看完 C9（第八次）：C8 第 12 題 A＋C9 第 6 題 A＋B、第 7 題 A；規格 rpg/CLAUDE.md）══
     公平（老師 C8-12 A、C9-6）：經驗值、金幣 **全部由伺服器從成績紀錄算出來**（平板改不了）；買到的東西 **不加分數、不改題目**，老師看板、排行榜照舊只看練習和答題。
     「更強」＝ 看起來更強（★ 稀有度、光芒、登場特效、⚔ 戰力數字）＋ 現場任務「全班打魔王」打得比較痛（只幫全班，不算個人成績）。
     ⭐ 經驗值（只會升，不會被花掉）：做完一次（練習次數 ＋1 的那一次）＋10、聽完一站字卡 ＋10、那一天第一次練 ＋20
     🪙 金幣：第一次就答對 1 題 ＋1、答錯以後改對 1 題 ＋3、同一組比自己上一次正確率高 ＋10；一天最多 100（保護沒時間的孩子）；
             每週保底寶箱：那一週練了 3 天以上 ＋60（跟成績好不好無關）
     等級 Lv ＝ ⌊√(經驗值 ÷ 16)⌋ ＋ 1（Lv 5 ＝ 256、Lv 10 ＝ 1296、Lv 20 ＝ 5776 經驗值；一週練 4 天約 200 經驗值） */
  var RPX = { rec: 10, day: 20 }, RPC = { fix: 3, prog: 10, cap: 100, chest: 60, chestDays: 3 };
  var RPP = [0, 50, 150, 400, 900, 2000], RPL = [0, 1, 1, 5, 10, 20];   /* 稀有度 ★1～★5 的價錢、要幾級 */
  /* 稀有度（30 個：★1 8 個、★2 8 個、★3 7 個、★4 4 個、★5 3 個）；女 29 等老師換新圖（C9 第 5 題 A：上傳的「新女 29」跟女 17 是同一張） */
  function rpStars(a) { var o = {}; for (var i = 0; i < a.length; i++) for (var j = 0; j < a[i].length; j++) o[a[i][j]] = i + 1; return o; }
  function rpSeq(p, a, b) { var o = []; for (var i = a; i <= b; i++) o.push(p + (i < 10 ? '0' : '') + i); return o; }
  var RPR = {
    h: (function () { var o = {}, k; [['b', 'h'], ['g', 'h']].forEach(function (x) { var r = rpStars([rpSeq(x[0], 1, 8), rpSeq(x[0], 9, 16), rpSeq(x[0], 17, 23), rpSeq(x[0], 24, 27), rpSeq(x[0], 28, 30)]); for (k in r) o[k] = r[k]; }); return o; })(),
    w: rpStars([['w03', 'w05', 'w12', 'w13', 'w21', 'w27', 'w28', 'w30'], ['w01', 'w07', 'w09', 'w14', 'w15', 'w20', 'w24', 'w26'], ['w06', 'w10', 'w11', 'w16', 'w19', 'w22', 'w25'], ['w04', 'w08', 'w18', 'w23'], ['w02', 'w17', 'w29']]),
    p: rpStars([['p03', 'p06', 'p07', 'p08', 'p10', 'p13', 'p14', 'p15'], ['p01', 'p02', 'p04', 'p05', 'p09', 'p11', 'p12', 'p28'], ['p16', 'p22', 'p23', 'p24', 'p25', 'p27', 'p30'], ['p17', 'p19', 'p20', 'p29'], ['p18', 'p21', 'p26']])
  };
  var RPHIDE = { g29: 1 };
  /* 10 種外觀寶物（C9 第 7 題 A：只換外觀，公平） */
  var RPT = [['t01', '✨ 光環', 100], ['t02', '🦸 披風', 150], ['t03', '👣 閃亮腳印', 120], ['t04', '🎆 登場煙火', 200], ['t05', '🖼 金色名字框', 100],
    ['t06', '😎 英雄表情', 80], ['t07', '🙌 勝利姿勢', 150], ['t08', '🌌 星空背景', 250], ['t09', '🎩 寵物帽子', 80], ['t10', '💠 發光武器框', 120]];
  var RPTP = {}; RPT.forEach(function (t) { RPTP[t[0]] = t[2]; });
  /* 📖 圖鑑：集滿一套 ＝ 稱號（只顯示） */
  var RPSET = [['🤖 機械軍團', ['p16', 'p19', 'p30']], ['🔥 火焰守護者', ['p05', 'p21', 'p24', 'w08']], ['🌌 星河旅人', ['p01', 'p18', 'w03', 'w15', 'w29']],
    ['⏳ 時間魔法師', ['w06', 'w18', 'w23']], ['⚡ 雷電之王', ['p03', 'p20', 'w04']], ['❄ 冰雪守護者', ['p13', 'p26', 'p29', 'w09']], ['🌙 夜之守護者', ['p08', 'p09', 'p22', 'p25']]];
  function rpKind(id) { id = String(id); return /^[bg]\d\d$/.test(id) ? 'h' : /^w\d\d$/.test(id) ? 'w' : /^p\d\d$/.test(id) ? 'p' : /^t\d\d$/.test(id) ? 't' : ''; }
  function rpStar(id) { var k = rpKind(id); return k === 't' ? 0 : ((RPR[k] || {})[id] || 0); }
  function rpPrice(id) { var k = rpKind(id); return k === 't' ? (RPTP[id] || 0) : RPP[rpStar(id)]; }
  function rpNeed(id) { return rpKind(id) === 't' ? 1 : RPL[rpStar(id)]; }
  function rpOk(id) { var k = rpKind(id); return !!k && !RPHIDE[id] && (k === 't' ? !!RPTP[id] : !!rpStar(id)); }
  function rpLv(xp) { return Math.floor(Math.sqrt((+xp || 0) / 16)) + 1; }
  function rpClean(st) { st = st || {}; var o = { own: { h: [], w: [], p: [], t: [] }, eq: { h: '', w: '', p: '', t: [] }, spent: 0, pt: 0, free: {} }, own = st.own || {}, eq = st.eq || {};
    ['h', 'w', 'p', 't'].forEach(function (k) { (own[k] || []).forEach(function (id) { id = String(id); if (rpKind(id) === k && (rpStar(id) || k === 't') && o.own[k].indexOf(id) < 0) o.own[k].push(id); }); });
    ['h', 'w', 'p'].forEach(function (k) { var v = String(eq[k] || ''); if (o.own[k].indexOf(v) >= 0) o.eq[k] = v; });
    (eq.t || []).forEach(function (id) { id = String(id); if (o.own.t.indexOf(id) >= 0 && o.eq.t.indexOf(id) < 0) o.eq.t.push(id); });
    o.spent = Math.max(0, Math.round(+st.spent || 0)); o.pt = Math.max(0, Math.round(+st.pt || 0));
    ['h', 'w', 'p'].forEach(function (k) { if (st.free && st.free[k]) o.free[k] = 1; });
    /* ⚡ 現場任務 老師發的獎勵（rpBonus）：bc 金幣、bx 經驗值、snack 寵物零食（陪伴天數 ＋1）、medal 勳章、lt 稱號 */
    o.bc = Math.max(0, Math.round(+st.bc || 0)); o.bx = Math.max(0, Math.round(+st.bx || 0)); o.snack = Math.max(0, Math.round(+st.snack || 0)); o.medal = Math.max(0, Math.round(+st.medal || 0));
    o.lt = []; (st.lt || []).forEach(function (t) { t = String(t).slice(0, 20); if (t && o.lt.indexOf(t) < 0 && o.lt.length < 20) o.lt.push(t); });
    return o; }
  /* 這個人全部的紀錄 ➜ 經驗值、金幣（只算沒作廢的） */
  function rpEarn(rs) {
    var L = (rs || []).filter(function (r) { return !r.x && r.m !== 'v'; }).sort(function (a, b) { return a.t - b.t; });
    var xp = 0, days = {}, dayCoin = {}, cnt = {}, prev = {}, wk = {}, coin = 0, wkq = {};
    L.forEach(function (r) {
      var d = day(r.t), ck = d + '|' + r.set, fast = (+r.fast || 0) * 2 > r.n;
      if (counts(r.ok, r.n, r.m, r.fast)) { cnt[ck] = (cnt[ck] || 0) + 1; if (cnt[ck] <= CAP) xp += RPX.rec; }
      if (!days[d]) { days[d] = 1; xp += RPX.day; var w0 = weekStart(r.t); wk[w0] = (wk[w0] || 0) + 1; }
      if (r.m === 'l' || r.m === 'mem' || fast) return;
      var c = 0;
      if (r.m === 'g') c += (+r.ok || 0) + RPC.fix * (+r.fix || 0);
      else (r.qs || []).forEach(function (q, j) { var k = r.set + '#' + (q[5] == null ? j : q[5]); if (q[0]) { c += wkq[k] === 1 ? RPC.fix : 1; if (wkq[k] === 1) wkq[k] = 2; } else if (!wkq[k]) wkq[k] = 1; });
      if (r.acc != null) { if (prev[r.set] != null && r.acc > prev[r.set]) c += RPC.prog; prev[r.set] = r.acc; }
      var room = RPC.cap - (dayCoin[d] || 0), g = Math.max(0, Math.min(room, c)); dayCoin[d] = (dayCoin[d] || 0) + g; coin += g;
    });
    var chests = 0; for (var w in wk) if (wk[w] >= RPC.chestDays) chests++;
    return { xp: xp, coin: coin + chests * RPC.chest, chests: chests, days: Object.keys(days).length, dd: days };
  }
  /* 平板看的：等級、經驗值條、金幣、寵物陪了幾天（裝上以後練了幾天：3 天長大、7 天進化）、戰力、稱號 */
  function rpView(rs, st) { st = rpClean(st); var E = rpEarn(rs), pd = 0; E.xp += st.bx; E.coin += st.bc; var lv = rpLv(E.xp);
    if (st.eq.p) { for (var d in E.dd) if (+d >= day(st.pt)) pd++; pd += st.snack; }
    var ps = pd >= 7 ? 2 : pd >= 3 ? 1 : 0, all = st.own.h.concat(st.own.w, st.own.p);
    var pow = lv * 10 + ps * 50; ['h', 'w', 'p'].forEach(function (k) { if (st.eq[k]) pow += rpStar(st.eq[k]) * 100; }); pow += st.eq.t.length * 20;
    var titles = RPSET.filter(function (x) { return x[1].every(function (id) { return all.indexOf(id) >= 0; }); }).map(function (x) { return x[0]; }).concat(st.lt);
    return { xp: E.xp, lv: lv, lvAt: 16 * (lv - 1) * (lv - 1), lvNext: 16 * lv * lv, earned: E.coin, coins: E.coin - st.spent, chests: E.chests, days: E.days,
      petDays: pd, petStage: ps, power: pow, titles: titles, medal: st.medal, st: st };
  }
  /* 這一次（編號 u）拿到多少：全部 − 沒有這一筆 */
  function rpGain(rs, st, u) { var a = rpView(rs, st), b = rpView((rs || []).filter(function (r) { return r.u !== u; }), st);
    return { lv: a.lv, lv0: b.lv, xp: a.xp, gx: a.xp - b.xp, coins: a.coins, gc: a.earned - b.earned, lvAt: a.lvAt, lvNext: a.lvNext, h: a.st.eq.h, w: a.st.eq.w, p: a.st.eq.p, t: a.st.eq.t, ps: a.petStage, pow: a.power }; }
  /* ⚡ 現場任務結束，老師大螢幕發的獎勵（要老師密碼）：b ＝ {c 金幣, x 經驗值, tre:[寶物], title, snack, medal}；寶物已經有了 ＝ 40 金幣 */
  function rpBonus(st, b) { st = rpClean(st); b = b || {};
    st.bc += Math.max(0, Math.min(500, Math.round(+b.c || 0))); st.bx += Math.max(0, Math.min(500, Math.round(+b.x || 0)));
    st.snack += Math.max(0, Math.min(5, Math.round(+b.snack || 0))); st.medal += Math.max(0, Math.min(5, Math.round(+b.medal || 0)));
    (b.tre || []).forEach(function (t) { t = String(t); if (!RPTP[t]) return; if (st.own.t.indexOf(t) >= 0) st.bc += 40; else { st.own.t.push(t); st.eq.t.push(t); } });
    if (b.title) { var tt = String(b.title).slice(0, 20); if (st.lt.indexOf(tt) < 0) st.lt.push(tt); }
    return st; }
  /* 合作打魔王的傷害（C9 第 6 題 B）：答對一題 10 ＋ 戰力 ÷ 100（最多 ＋20）；只用在全班一起的血條 */
  function rpDmg(power) { return 10 + Math.min(20, Math.floor((+power || 0) / 100)); }
  /* 買：第一個 ★1 英雄、★1 武器、★1 寵物 各送一個（免費選）；其他要金幣夠、等級夠 */
  function rpBuy(rs, st, id, now) { st = rpClean(st); id = String(id); var k = rpKind(id);
    if (!rpOk(id)) return { err: 'item' };
    if (st.own[k].indexOf(id) >= 0) return { err: 'own' };
    var V = rpView(rs, st), free = k !== 't' && rpStar(id) === 1 && !st.free[k] && !st.own[k].length, pr = free ? 0 : rpPrice(id);
    if (V.lv < rpNeed(id)) return { err: 'lv', need: rpNeed(id) };
    if (V.coins < pr) return { err: 'coin', need: pr - V.coins };
    st.own[k].push(id); st.spent += pr; if (free) st.free[k] = 1;
    if (k === 't') st.eq.t.push(id); else { st.eq[k] = id; if (k === 'p') st.pt = now || 0; }
    return { st: st, paid: pr, free: free }; }
  /* 換裝（買過的才可以）；寶物 ＝ 開／關 */
  function rpEquip(st, id, now) { st = rpClean(st); id = String(id); var k = rpKind(id);
    if (!k || st.own[k].indexOf(id) < 0) return { err: 'own' };
    if (k === 't') { var i = st.eq.t.indexOf(id); if (i >= 0) st.eq.t.splice(i, 1); else st.eq.t.push(id); }
    else { if (k === 'p' && st.eq.p !== id) st.pt = now || 0; st.eq[k] = id; }
    return { st: st }; }
  return { CLASSES: CLASSES, AFTER: AFTER, cname: cname, SEAT: SEAT, COLS: COLS, CI: CI, CAP: CAP, TOP: TOP, GMIN: GMIN, MT: MT, checkId: checkId, cat: cat, counts: counts, need: need, day: day, weekStart: weekStart,
    AW: AW, care: care, CAREMAX: CAREMAX, s100: s100, fromRow: fromRow, toRow: toRow, clean: clean, pick: pick, students: students, rank: rank, classes: classes, clsAwards: clsAwards, secOf: secOf, questions: questions, gtop: gtop, view: view,
    lkClean: lkClean, lkSet: lkSet, lkAny: lkAny, lkFor: lkFor, LKRE: LKRE, lktClean: lktClean, lktSet: lktSet, lkNow: lkNow,
    tkClean: tkClean, tkFor: tkFor, tkDone: tkDone, tkLock: tkLock, TKGRACE: TKGRACE,
    RPR: RPR, RPP: RPP, RPL: RPL, RPT: RPT, RPSET: RPSET, RPHIDE: RPHIDE, RPX: RPX, RPC: RPC, rpKind: rpKind, rpStar: rpStar, rpPrice: rpPrice, rpNeed: rpNeed, rpOk: rpOk, rpLv: rpLv,
    rpClean: rpClean, rpEarn: rpEarn, rpView: rpView, rpBuy: rpBuy, rpEquip: rpEquip, rpDmg: rpDmg, rpGain: rpGain, rpBonus: rpBonus };
})();

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
        try { (o.list || []).slice(0, 60).forEach(function (b) { var c6 = SC.checkId(b && b.id); if (c6.err) return; var R6 = rpRow(c6.id); rpSave(R6, c6.id, SC.rpBonus(R6.st, b)); nb++; }); } finally { lk6.releaseLock(); }
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
