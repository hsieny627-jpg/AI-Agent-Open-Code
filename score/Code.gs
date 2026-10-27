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
  var MT = { q: '題目', g: '遊戲', mem: '記憶配對', v: '看字卡', l: '聽完字卡', lv: '現場任務' }, TM = { '題目': 'q', '遊戲': 'g', '記憶配對': 'mem', '看字卡': 'v', '聽完字卡': 'l', '現場任務': 'lv' };
  var SETRE = /^g([34])(u\d{1,2}|gm|r\d{1,2}|v|lv|l|td)_[\w-]{1,16}$/;   /* td ＝ 📅 今日任務（2026-10-26 第二十七次）：g3td_day 今日任務、g3td_ch 🔥 挑戰關（★★ 以上） */
  function noQ(m) { return m === 'mem' || m === 'v' || m === 'l' || m === 'lv'; }   /* 沒有題目（沒有正確率、總分） */
  /* 題組代號 ➜ 類別（老師看板的篩選）：u ＝ 📝 複習題、gm ＝ 🎮 遊戲、r1 ＝ 📘 Review 1 */
  function cat(set) {
    var m = SETRE.exec(String(set)); if (!m) return { k: '', t: '' };
    var x = m[2];
    if (x.charAt(0) === 'u') return { k: 'tq', t: '📝 複習題' };
    if (x === 'gm' && /_mt-/.test(String(set))) return { k: 'mt', t: '📝 四年級 複習' };   /* 2026-10-27 第三十次 2-(2)：改名 */   /* 2026-10-19 第十三次 3(11) */
    if (x === 'gm' && /_(g3m|c[123])-/.test(String(set))) return { k: 'g3c', t: '🏫 三年級 複習' };   /* 2026-10-26 第二十七次 第 1 點：三年級 複習（g3m）、課堂複習 1～3（c1～c3） */
    if (x === 'gm') return { k: 'game', t: '🎮 遊戲' };
    if (x === 'v') return { k: 'v', t: '👀 看字卡' };
    if (x === 'l') return { k: 'l', t: '🎧 聽完字卡' };
    if (x === 'lv') return { k: 'lv', t: '⚡ 現場任務' };
    if (x === 'td') return { k: 'td', t: /_ch$/.test(String(set)) ? '🔥 挑戰關' : '📅 今日任務' };
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
  function counts(ok, n, m, fast) { if (m === 'v') return false; if (m === 'mem' || m === 'l' || m === 'lv') return true; if (m === 'g' && n < GMIN) return false; return n > 0 && (+fast || 0) * 2 <= n; }
  /* 一筆紀錄練了幾秒 */
  function secOf(r) { if (r.m === 'l' || r.m === 'lv') return 0; if (r.m === 'mem' || r.m === 'v') return +r.sec || 0; if ((+r.fast || 0) * 2 > r.n) return 0;
    var s = 0; for (var i = 0; i < (r.qs || []).length; i++) if (!r.qs[i][3]) s += +r.qs[i][2] || 0; return s; }
  function need(n) { return Math.ceil(n * 2 / 3); }                     /* 至少要對幾題 */
  function day(t) { return Math.floor((t + TZ) / DAY); }
  function weekStart(t) { var d = day(t), wd = (d + 3) % 7; return (d - wd) * DAY - TZ; }   /* 1970-01-01 是星期四 ➜ +3 ＝ 星期一是 0 */
  function r1(x) { return Math.round(x * 10) / 10; }
  function mean(a) { if (!a.length) return null; var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }

  /* 一題的紀錄：[答對 1/0, 選了第幾個（0 ＝ 正解，-1 ＝ 時間到）, 用了幾秒, 秒按 1/0, 剩下秒數 ÷ 總秒數] */
  function xN(set) { var m = /_(g3m|mt)-x(25|50)$/.exec(String(set)); return m ? +m[2] : 0; }   /* 📝 25／50 題 挑戰 的 題數 */
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
    if (sm[2] === 'lv' || o.m === 'lv') return null;   /* ⚡ 現場任務的紀錄只有伺服器（老師〔🎁 發獎勵〕）寫得進去，平板送不進來 */
    var m = o.m === 'g' || o.m === 'mem' || o.m === 'v' || o.m === 'l' ? o.m : 'q', qs = o.qs || [];
    if ((m === 'v') !== (sm[2] === 'v') || (m === 'l') !== (sm[2] === 'l')) return null;   /* 看字卡只能用 g年級v_、聽完字卡只能用 g年級l_ 的代號 */
    if (noQ(m)) qs = [];
    else if (!qs.length || qs.length > (m === 'g' ? 150 : 10)) return null;
    var Q = [];
    for (var i = 0; i < qs.length; i++) { var q = qs[i];
      Q.push([q[0] ? 1 : 0, Math.max(-1, Math.min(3, Math.round(+q[1] || 0))), Math.max(0, Math.min(60, r1(+q[2] || 0))), q[3] ? 1 : 0,
        Math.max(0, Math.min(1, Math.round((+q[4] || 0) * 1000) / 1000)), lim(q[5] == null ? i : q[5], 0, 999)]);
      /* 📅 今日任務：每一題 從 哪一個 題組 來（第 7 格；錯題 分析、「答錯 改對」用）*/
      if (sm[2] === 'td' && typeof q[6] === 'string' && SETRE.test(q[6].replace(/^g\*/, 'g' + c.g)) && !/td_/.test(q[6])) Q[Q.length - 1].push(q[6].slice(0, 40)); }
    var ok = 0, f = 0; for (i = 0; i < Q.length; i++) { ok += Q[i][0]; f += Q[i][3]; }
    var t = +o.t; if (!(t > now - 30 * DAY && t < now + 5 * 6e4)) t = now;   /* 平板時間不對就用伺服器時間；沒網路補送的照當時 */
    return { t: t, id: c.id, g: c.g, cls: c.cls, seat: c.seat, set: set, name: String(o.name || '').slice(0, 60), m: m, n: Q.length, ok: ok,
      acc: noQ(m) ? null : Math.round(ok / Q.length * 100), s: noQ(m) ? null : xN(set) ? Math.min(100, Math.round(ok * 1000 / xN(set)) / 10) : s100(Q),   /* 2026-10-26 第二十八次：📝 25／50 題 挑戰 ＝ 答對 一題 4／2 分（沒 做完 的 算 0 分）*/ fix: lim(o.fix, 0, 999),
      mp: m === 'mem' ? lim(o.mp, 0, 999) : 0, mw: m === 'mem' ? lim(o.mw, 0, 9999) : 0, sec: m === 'l' ? 0 : lim(o.sec, 0, 3600),
      raw: lim(o.raw, 0, 1e8), fast: f,
      src: o.src === 'home' ? 'home' : 'school', dev: String(o.dev || '').replace(/[^\w]/g, '').slice(0, 12), u: String(o.u || '').replace(/[^\w]/g, '').slice(0, 24), qs: Q, x: false };
  }
  /* 🕘 上課 時間／課後 時間（2026-10-26 第二十七次 第 2 點，老師 選 C30 第 1 題 A）：不再 看「用 哪一個 網站」，看「什麼 時候 做 的」（台灣 時間）
     星期一～五 7:40～16:00 ＝ 上課 時間（in）；課後班 400 ＝ 7:40～17:30（老師：下午 5:30 以後 才 算 在家）；其他 ＝ 課後 時間（out） */
  var SCH0 = 7 * 60 + 40, SCH1 = { '': 16 * 60, '400': 17 * 60 + 30 };
  function when(r) { var d = new Date((+r.t || 0) + TZ), wd = d.getUTCDay(), m = d.getUTCHours() * 60 + d.getUTCMinutes(), end = SCH1[String(r.cls)] || SCH1[''];
    return wd >= 1 && wd <= 5 && m >= SCH0 && m < end ? 'in' : 'out'; }
  function pick(rs, f) { /* f: {g, cls, from, to, src, cat} */
    var out = [];
    for (var i = 0; i < rs.length; i++) { var r = rs[i];
      if (r.x) continue; if (f.g && r.g !== +f.g) continue; if (f.cls && r.cls !== f.cls) continue;
      if (f.from != null && r.t < f.from) continue; if (f.to != null && r.t >= f.to) continue; if (f.src && (f.src === 'in' || f.src === 'out' ? when(r) !== f.src : r.src !== f.src)) continue;
      if (f.cat && cat(r.set).k !== f.cat) continue;
      out.push(r); }
    return out;
  }
  /* 每一個人：🎯 正確率、⚡ 總分、🔁 次數、🚀 進步、🔥 保持滿分 */
  function students(rs) {
    var by = {}, ids = [];
    rs.slice().sort(function (a, b) { return a.t - b.t; }).forEach(function (r) {
      var p = by[r.id]; if (!p) { p = by[r.id] = { id: r.id, g: r.g, cls: r.cls, seat: r.seat, sets: {}, all: 0, last: 0, fastQ: 0, q: 0, fix: 0, sec: 0, vsec: 0, lc: 0, lvc: 0, dd: {}, nd: 0, wk: {}, W: 0, F: 0 }; ids.push(r.id); }
      if (r.m === 'v') { p.sec += secOf(r); p.vsec += secOf(r); return; }   /* 👀 看字卡：只加練習時間 */
      (p.sets[r.set] = p.sets[r.set] || []).push(r); p.all++; p.last = r.t; p.fastQ += r.fast; p.q += r.n; p.fix += r.fix || 0; p.sec += secOf(r);
      var d0 = day(r.t); if (!p.dd[d0]) { p.dd[d0] = 1; p.nd++; }
      if (r.m === 'l') { p.lc++; return; }   /* 🎧 聽完字卡：算天數、練習次數（下面照題組一天最多 3 次） */
      if (r.m === 'lv') { p.lvc++; return; }   /* ⚡ 現場任務（2026-10-18 C10 第 3 題 B）：一場 ＝ 練習次數 ＋1、那一天算練了 1 天；正確率不算 */
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
        sec: Math.round(p.sec), vsec: Math.round(p.vsec), days: p.nd, W: p.W, F: p.F, lc: p.lc, lvc: p.lvc };
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
    /* 2026-10-21 第十六次 第 6 點＋老師再加第 1 點：最認真練習 ＝ 練習時間最多，而且 A、B 都做到才上榜（diligent） */
    sec: { v: function (p) { return p.sec; }, cmp: function (a, b) { return b.sec - a.sec; }, eq: function (a, b) { return a.sec === b.sec; }, ok: function (p) { return p.sec > 0 && dili(p).ok; } },
    /* 📅 練習分數，同分比練習時間（原本「❤ 最用心」的榜；2026-10-16 C5 第 3 題 A 不再是最高榮譽，只給老師看板排序） */
    care: { v: function (p) { return p.care; }, cmp: function (a, b) { return (b.care - a.care) || (b.sec - a.sec); }, eq: function (a, b) { return a.care === b.care && a.sec === b.sec; }, ok: function (p) { return p.care > 0; } }
  };
  /* 🏆 最認真練習 的 條件（2026-10-21 老師：這段期間「到目前為止」全部題目合起來）：
     A 👀 不是太快亂按 ≧ 90%（作答的題目裡，太快亂按的 ≦ 10%）；B ✗➜✓ 答錯，改對 ≧ 90%（題目 ＝ 同一題錯過、後來又答對；遊戲 ＝ ✨ 訂正成功；一題都沒錯 ＝ 100%）。
     這段期間一題都沒作答（只看字卡、只聽字卡、只玩現場任務）＝ A 算不出來 ➜ 不上榜。a、b ＝ 給人看的 %（無條件捨去：89.6% 寫 89%，不會寫成 90% 卻沒上榜） */
  var DILI = 90;
  function dili(p) { p = p || {}; var q = +p.q || 0, fq = +p.fastQ || 0, W = +p.W || 0, F = Math.min(+p.F || 0, W);
    var okA = q > 0 && (q - fq) * 100 >= DILI * q, okB = !W || F * 100 >= DILI * W;
    return { a: q ? Math.floor((q - fq) / q * 100) : null, b: W ? Math.floor(F / W * 100) : 100, q: q, fq: fq, W: W, F: F, okA: okA, okB: okB, ok: okA && okB }; }
  /* 👑 每一班 上一週 最認真練習 第 1 名（A、B 都做到；同分比正確率、再比總分；還是一樣 ＝ 一起）➜ 現場任務 選 1 次 遊戲（2026-10-21 老師再加第 3 點） */
  function champs(rs, now) { var w = weekStart(now), w0 = w - 7 * DAY, o = {};
    [3, 4].forEach(function (g) { var ps = students(pick(rs, { g: g, from: w0, to: w }));
      CLASSES[g].forEach(function (c) { var L = ps.filter(function (p) { return p.cls === c && BOARDS.sec.ok(p); }).sort(function (a, b) { return (b.sec - a.sec) || ((b.acc || 0) - (a.acc || 0)) || ((b.s || 0) - (a.s || 0)); });
        if (L.length) o[c] = { w: w, ids: L.filter(function (p) { return p.sec === L[0].sec && (p.acc || 0) === (L[0].acc || 0) && (p.s || 0) === (L[0].s || 0); }).map(function (p) { return p.id; }), sec: L[0].sec }; }); });
    return o; }
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
      var st = q[6] || r.set; if (/^g[34]td_/.test(st)) return;   /* 📅 今日任務：算回 原本 的 題組 */
      var i = q[5] == null ? j : +q[5], k = st + '#' + i, o = Q[k] = Q[k] || { k: k, set: st, i: i, n: 0, bad: 0, p: { '-1': 0, 0: 0, 1: 0, 2: 0, 3: 0 }, fast: 0 };
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
      me: { acc: me.acc, s: me.s, count: me.count, prog: me.prog, pf: me.pf, pt: me.pt, keep: !!me.keep, sec: me.sec || 0, days: me.days || 0, secPrev: lw ? lw.sec : 0, care: care(me), dl: dili(me) } };
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
  var RPX = { rec: 10, day: 20 }, RPC = { fix: 3, prog: 10, cap: 100, chest: 60, chestDays: 3 }, RPCHAL = 1.5;
  /* 📅 今日任務、📈 我的 進步（2026-10-26 第二十七次 第 2 點，老師 選 C30 第 2 題「1、2、3」）：只 給 自己 的（沒有 姓名）
     s ＝ { 題組: [第一次 做, 最好 正確率, 一週 以後 還 ≧ 80, 做了 幾次, 最後 一次] } ➜ ⭐ 做過、⭐⭐ 會了（≧ 80）、⭐⭐⭐ 一週 以後 還 會（第一次 做 7 天 以後 又 ≧ 80）
     w ＝ 答錯 還沒 改對 的 題目 [[題組, 第幾題, 什麼 時候]]（最後 一次 是 錯的；45 天 內；最多 60 題；最近 的 在 前面） */
  var STAR = 80, WDAYS = 45;
  function me(rs, now) { var S = {}, W = {};
    (rs || []).filter(function (r) { return !r.x && !noQ(r.m); }).sort(function (a, b) { return a.t - b.t; }).forEach(function (r) {
      var td = /^g[34]td_/.test(r.set);
      if (!td && r.acc != null) { var x = S[r.set] = S[r.set] || [r.t, 0, 0, 0, 0]; x[1] = Math.max(x[1], r.acc); x[3]++; x[4] = r.t; if (r.t - x[0] >= 7 * DAY && r.acc >= STAR) x[2] = 1; }
      (r.qs || []).forEach(function (q, j) { var st = q[6] || (td ? '' : r.set); if (!st) return; W[st + '#' + (q[5] == null ? j : q[5])] = [st, q[5] == null ? j : q[5], r.t, q[0] ? 1 : 0]; }); });
    var w = Object.keys(W).map(function (k) { return W[k]; }).filter(function (x) { return !x[3] && x[2] > now - WDAYS * DAY; }).sort(function (a, b) { return b[2] - a[2]; }).slice(0, 60).map(function (x) { return [x[0], x[1], x[2]]; });
    return { s: S, w: w, now: now }; }
  /* 🎁 全班獎勵（2026-10-25 第二十五次，老師：暫時規定＋「練得愈多天、拿愈多」，取代第二十二次的「全班每一個人都練 3 天 ➜ 每人 🪙200 ⭐100」）：
     每個星期一自動發「上一週」：① 基本目標 ＝ 名單上 8 成的人（無條件進位：30 人 ➜ 24 人）練 2 天以上 ➜ 自己練 2 天以上的人照天數拿 t1；
     ② 進階目標 ＝ 名單上每一位都練 3 天以上 ➜ 每一個人照天數拿 t2（比 t1 多）；完全沒練、只練 1 天的人拿不到。編號 cw|那一週星期一|班級（同一班同一週只發一次） */
  var RPCW = { pct: 80, d1: 2, d2: 3,
    t1: { 2: [150, 100], 3: [175, 110], 4: [200, 120], 5: [225, 130], 6: [250, 140], 7: [275, 150] },
    t2: { 3: [200, 120], 4: [250, 140], 5: [300, 160], 6: [350, 180], 7: [400, 200] } };
  /* {5碼: 那一段時間「非上課時間」練了幾天}
     2026-10-26 第二十九次 第 10 點（老師：全班獎勵 ＝ 在 非上課時間 登入 練習 才 算；選擇題 B：早上 上學 前 也 算）：
     只 算 when(r) ＝ 'out' 的 紀錄（星期一～五 7:40～16:00 以外、課後班 400 到 17:30、週末 整天）；上課時間 練 的 不算 天數 */
  function cwDays(rs, from, to) { var nd = {}; students(pick(rs, { from: from, to: to, src: 'out' })).forEach(function (p) { nd[p.id] = +p.days || 0; }); return nd; }
  /* 這一班達到哪一個目標：0 沒有、1 基本、2 進階 */
  function cwLv(nd, ids) { if (!ids || !ids.length) return 0; nd = nd || {};
    if (ids.every(function (id) { return (nd[id] || 0) >= RPCW.d2; })) return 2;
    var n = ids.filter(function (id) { return (nd[id] || 0) >= RPCW.d1; }).length; return n >= Math.ceil(ids.length * RPCW.pct / 100 - 1e-9) ? 1 : 0; }
  /* 一個人拿多少：{c 金幣, x 經驗值} 或 null */
  function cwAmt(lv, d) { d = Math.min(7, Math.floor(+d || 0)); var T = lv === 2 ? RPCW.t2 : lv === 1 ? RPCW.t1 : null; return T && T[d] ? { c: T[d][0], x: T[d][1] } : null; }
  function cwOk(rs, ids, from, to) { return cwLv(cwDays(rs, from, to), ids); }
  /* 🎯 全班獎勵 小測驗（2026-10-25 第二十五次：老師「獨立一個小測驗」）：版本，規則改了 ＋1；3 題都答對 ＝ 伺服器記 cq ＝ RPCQV */
  var RPCQV = 1; var RPCQB = [50, 25];
  function rpCwq(st, v, now) { st = rpClean(st); if (+v === RPCQV) { st.cq = RPCQV; st.cqt = now || Date.now(); } return st; }
  /* 👑 冠軍寶箱（2026-10-25 第二十五次，老師：只發金幣和經驗值；選 🪙 ＋250、⭐ ＋150，固定） */
  var RPCH = { c: 250, x: 150 };
  var RPP = [0, 50, 150, 400, 900, 2000], RPL = [0, 1, 1, 5, 10, 20];   /* 稀有度 ★1～★5 的價錢、要幾級 */
  /* 稀有度（30 個：★1 8 個、★2 8 個、★3 7 個、★4 4 個、★5 3 個；老師 C10 第 2 題 A：照這樣） */
  function rpStars(a) { var o = {}; for (var i = 0; i < a.length; i++) for (var j = 0; j < a[i].length; j++) o[a[i][j]] = i + 1; return o; }
  function rpSeq(p, a, b) { var o = []; for (var i = a; i <= b; i++) o.push(p + (i < 10 ? '0' : '') + i); return o; }
  var RPR = {
    h: (function () { var o = {}, k; [['b', 'h'], ['g', 'h']].forEach(function (x) { var r = rpStars([rpSeq(x[0], 1, 8), rpSeq(x[0], 9, 16), rpSeq(x[0], 17, 23), rpSeq(x[0], 24, 27), rpSeq(x[0], 28, 30)]); for (k in r) o[k] = r[k]; }); return o; })(),
    w: rpStars([['w03', 'w05', 'w12', 'w13', 'w21', 'w27', 'w28', 'w30'], ['w01', 'w07', 'w09', 'w14', 'w15', 'w20', 'w24', 'w26'], ['w06', 'w10', 'w11', 'w16', 'w19', 'w22', 'w25'], ['w04', 'w08', 'w18', 'w23'], ['w02', 'w17', 'w29']]),
    p: rpStars([['p03', 'p06', 'p07', 'p08', 'p10', 'p13', 'p14', 'p15'], ['p01', 'p02', 'p04', 'p05', 'p09', 'p11', 'p12', 'p28'], ['p16', 'p22', 'p23', 'p24', 'p25', 'p27', 'p30'], ['p17', 'p19', 'p20', 'p29'], ['p18', 'p21', 'p26']])
  };
  RPR.h.g31 = 5;   /* 2026-10-18 第九次（老師：藍色 Celestial Aurora Princess ＝ 女 29、粉紅 Sakura Moonlight Princess ＝ 女 31）：女 31 跟 28～30 一樣 ★★★★★ */
  /* 2026-10-23 第二十二次（老師上傳 5 張、25 個女戰士；老師同意的位置 listen/2026-10-23_C26/）：女 32～41 ★★ 稀有、42～51 ★★★ 史詩、52～56 ★★★★ 傳說（圖 rpg/newg ➜ rpg/chars） */
  (function () { for (var i = 32; i <= 56; i++) RPR.h['g' + i] = i <= 41 ? 2 : i <= 51 ? 3 : 4; })();
  /* 2026-10-24 第二十三次（老師上傳 3 張、6 個男戰士，左上角 01 ＝ ★ 基本；老師同意的位置 listen/2026-10-24_C27/）：男 31～36 ★ 基本（圖 rpg/newm ➜ rpg/chars）；舊的男 01～08 下架 */
  (function () { for (var i = 31; i <= 36; i++) RPR.h['b' + i] = 1; })();
  /* 2026-10-25 第二十五次（老師上傳 5 張、8 個男戰士＋2 個女戰士，左上角 02 ＝ ★★ 稀有；老師同意的位置 listen/2026-10-25_C28/）：男 37～44 ★★ 稀有（圖 rpg/newm2 ➜ rpg/chars）；舊的男 09～16 下架；2 個女戰士這次不用 */
  (function () { for (var i = 37; i <= 44; i++) RPR.h['b' + i] = 2; })();
  /* 先不放的（商店不賣；老師 2026-10-23：已經買了的人還可以繼續用 ➜ 換裝 rpEquip 不看這裡）：
     女 11～21（機甲女戰士 11～20、Phoenix Dancer 21）、舊寶物 t01～t10（Claude 畫的）暫時下架 */
  var RPHIDE = {}; (function () { for (var i = 11; i <= 21; i++) RPHIDE['g' + i] = 1; for (i = 1; i <= 10; i++) RPHIDE['t' + (i < 10 ? '0' : '') + i] = 1; for (i = 1; i <= 8; i++) RPHIDE['b0' + i] = 1; for (i = 9; i <= 16; i++) RPHIDE['b' + (i < 10 ? '0' : '') + i] = 1; })();   /* 第二十三次：男 01～08（舊 ★ 基本）下架，已經選的照舊用 */
  /* 10 種外觀寶物（C9 第 7 題 A：只換外觀，公平） */
  var RPT = [['t01', '✨ 光環', 100], ['t02', '🧥 披風', 150], ['t03', '👣 閃亮腳印', 120], ['t04', '🎆 登場煙火', 200], ['t05', '🖼 金色名字框', 100],
    ['t06', '😎 戰士表情', 80], ['t07', '🙌 勝利姿勢', 150], ['t08', '🌌 星空背景', 250], ['t09', '🎩 寵物帽子', 80], ['t10', '💠 發光武器框', 120]];
  var RPTP = {}; RPT.forEach(function (t) { RPTP[t[0]] = t[2]; });
  /* 🏪 榮耀寶物商城（2026-10-18 第九次，老師的「商城自動切圖與金幣兌換指令」；規格 rpg/CLAUDE.md）：10 類 ✕ 20 種，編號 s＋類＋號（s0101 ＝ 覺醒光環 01）
     價錢、等級照「第幾排」：01～05 500（Lv 1）、06～10 1200（Lv 5）、11～15 2500（Lv 10）、16～20 5000（Lv 20 學霸限定）；看起來的星等 ＝ 第幾排 ＋1（★★～★★★★★）
     位置（老師選「同一個位置換著戴」）：光環、披風、名字框、背景、寵物服裝 跟舊的寶物 t01、t02、t05、t08、t09 同一個位置（身上同時只戴 1 個）；
     魔法武器 ＝ 武器（拿 1 把）、新寵物 ＝ 寵物（帶 1 隻）；翅膀、坐騎、必殺特效 各 1 個。RPSON ＝ 老師上傳了圖、可以買的類（其他顯示「🔜 即將上架」） */
  var RPS = [['au', '✨ 覺醒光環', 'auras', 't01'], ['cp', '👑 王者披風', 'capes', 't02'], ['fx', '💥 必殺武功特效', 'skills', ''], ['nf', '🖼 榮耀名字框', 'frames', 't05'],
    ['bg', '🌌 史詩戰士背景', 'backgrounds', 't08'], ['po', '🎀 寵物專屬服裝', 'petwear', 't09'], ['w', '🪄 傳說魔法武器', 'weapons', ''], ['p', '🐾 神話新寵物', 'pets', ''],
    ['wg', '🦅 神聖機甲翅膀', 'wings', ''], ['mt', '🐉 傳說飛行坐騎', 'mounts', '']];
  var RPSON = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1 };   /* 2026-10-18 第十二次：06～10 也傳了 ➜ 10 類全部上架。2026-10-18：老師只傳到 1 張（覺醒光環）；第十次：再傳 披風、必殺特效、名字框、背景 4 張。傳了圖就在這裡加 */
  var RPSP = [500, 1200, 2500, 5000], RPSL = [1, 5, 10, 20];
  var RPSLOT = { t01: 'au', t02: 'cp', t05: 'nf', t08: 'bg', t09: 'po' };   /* 舊寶物 ➜ 跟哪一類同一個位置 */
  function rpSC(id) { var m = /^s(\d\d)(\d\d)$/.exec(String(id)); return m && +m[1] >= 1 && +m[1] <= 10 && +m[2] >= 1 && +m[2] <= 20 ? { c: +m[1], n: +m[2], row: Math.floor((+m[2] - 1) / 5), slot: RPS[+m[1] - 1][0] } : null; }
  /* 📖 圖鑑：集滿一套 ＝ 稱號（只顯示） */
  var RPSET = [['🤖 機械軍團', ['p16', 'p19', 'p30']], ['🔥 火焰守護者', ['p05', 'p21', 'p24', 'w08']], ['🌌 星河旅人', ['p01', 'p18', 'w03', 'w15', 'w29']],
    ['⏳ 時間魔法師', ['w06', 'w18', 'w23']], ['⚡ 雷電之王', ['p03', 'p20', 'w04']], ['❄ 冰雪守護者', ['p13', 'p26', 'p29', 'w09']], ['🌙 夜之守護者', ['p08', 'p09', 'p22', 'p25']]];
  function rpKind(id) { id = String(id); var S = rpSC(id); if (S) return S.slot === 'w' || S.slot === 'p' ? S.slot : 's';
    return /^[bg]\d\d$/.test(id) ? 'h' : /^w\d\d$/.test(id) ? 'w' : /^p\d\d$/.test(id) ? 'p' : /^t\d\d$/.test(id) ? 't' : ''; }
  function rpStar(id) { var S = rpSC(id); if (S) return S.row + 2; var k = rpKind(id); return k === 't' ? 0 : ((RPR[k] || {})[id] || 0); }
  function rpPrice(id) { var S = rpSC(id); if (S) return RPSP[S.row]; var k = rpKind(id); return k === 't' ? (RPTP[id] || 0) : RPP[rpStar(id)]; }
  function rpNeed(id) { var S = rpSC(id); if (S) return RPSL[S.row]; return rpKind(id) === 't' ? 1 : RPL[rpStar(id)]; }
  function rpOk(id) { var S = rpSC(id); if (S) return !!RPSON[S.c]; var k = rpKind(id); return !!k && !RPHIDE[id] && (k === 't' ? !!RPTP[id] : !!rpStar(id)); }
  /* 戴上一個 → 同一個位置的拿下來（商城 ↔ 舊寶物） */
  function rpWear(st, id) { var S = rpSC(id);
    if (S && S.slot !== 'w' && S.slot !== 'p') { st.eq.s[S.slot] = id; RPS[S.c - 1][3] && (st.eq.t = st.eq.t.filter(function (t) { return t !== RPS[S.c - 1][3]; })); }
    else if (RPSLOT[id]) delete st.eq.s[RPSLOT[id]]; }
  /* 📜 理解小考（2026-10-21）：規則的版本，規則改了 ＋1 ➜ 每個人要重看重答；學生答對 5 題 ＝ 伺服器記 qz ＝ RPQV */
  var RPQV = 2;   /* 2026-10-21 第十八次 第 1 點：已經答對 5 題的人 再看一次 新的 規則（第十七次 14 幕）＋再答 5 題 */
  function rpQuiz(st, v, now) { st = rpClean(st); if (+v === RPQV) { st.qz = RPQV; st.qzt = now || Date.now(); } return st; }
  function rpLv(xp) { return Math.floor(Math.sqrt((+xp || 0) / 16)) + 1; }
  function rpClean(st) { st = st || {}; var o = { own: { h: [], w: [], p: [], t: [], s: [] }, eq: { h: '', w: '', p: '', t: [], s: {} }, spent: 0, pt: 0, free: {} }, own = st.own || {}, eq = st.eq || {};
    ['h', 'w', 'p', 't', 's'].forEach(function (k) { (own[k] || []).forEach(function (id) { id = String(id); if (rpKind(id) === k && (rpStar(id) || k === 't') && o.own[k].indexOf(id) < 0) o.own[k].push(id); }); });
    ['h', 'w', 'p'].forEach(function (k) { var v = String(eq[k] || ''); if (o.own[k].indexOf(v) >= 0) o.eq[k] = v; });
    (eq.t || []).forEach(function (id) { id = String(id); if (o.own.t.indexOf(id) >= 0 && o.eq.t.indexOf(id) < 0) o.eq.t.push(id); });
    var es = eq.s || {}; RPS.forEach(function (x) { var v = String(es[x[0]] || ''), S = rpSC(v); if (S && S.slot === x[0] && o.own.s.indexOf(v) >= 0) rpWear(o, v); });
    o.spent = Math.max(0, Math.round(+st.spent || 0)); o.pt = Math.max(0, Math.round(+st.pt || 0));
    ['h', 'w', 'p'].forEach(function (k) { if (st.free && st.free[k]) o.free[k] = 1; });
    /* ⚡ 現場任務 老師發的獎勵（rpBonus）：bc 金幣、bx 經驗值、snack 寵物零食（陪伴天數 ＋1）、medal 勳章、lt 稱號 */
    o.bc = Math.max(0, Math.round(+st.bc || 0)); o.bx = Math.max(0, Math.round(+st.bx || 0)); o.snack = Math.max(0, Math.round(+st.snack || 0)); o.medal = Math.max(0, Math.round(+st.medal || 0));
    o.lt = []; (st.lt || []).forEach(function (t) { t = String(t).slice(0, 20); if (t && o.lt.indexOf(t) < 0 && o.lt.length < 20) o.lt.push(t); });
    /* 2026-10-20 第十四次：👾 怪物（i ＝ 打倒幾隻、hp ＝ 現在這一隻已經被打掉多少）、👑 冠軍寶箱（ch ＝ 還沒開幾個、chl ＝ 開到什麼）、老師獎勵發過的（bk，同一個不會發兩次） */
    var mo = st.mon || {}; o.mon = { i: Math.max(0, Math.round(+mo.i || 0)), hp: Math.max(0, Math.round(+mo.hp || 0)) }; if (o.mon.hp >= rpMonHp(o.mon.i)) o.mon.hp = rpMonHp(o.mon.i) - 1;
    o.ch = Math.max(0, Math.min(20, Math.round(+st.ch || 0)));
    o.chl = (st.chl || []).filter(function (x) { return x && (x.c > 0 || rpSC(x.s)); }).slice(-5).map(function (x) { return x.c > 0 ? (x.x > 0 ? { c: Math.round(+x.c), x: Math.round(+x.x) } : { c: Math.round(+x.c) }) : { s: String(x.s) }; });
    o.bk = (st.bk || []).map(String).filter(function (k) { return /^[\w|-]{1,40}$/.test(k); }).slice(-60);
    o.tr = Math.max(0, Math.min(RPTIER.length, Math.round(+st.tr || 0)));
    /* 2026-10-21 第十六次 第 5 點：trt[i] ＝ 第一次到第 i＋1 階的時間（金幣加成「升階以後才多」；舊的階級沒有時間 ＝ 等 rpTierUp 填上「現在」） */
    o.trt = []; for (var ti = 0; ti < o.tr; ti++) { var tv = Math.round(+((st.trt || [])[ti]) || 0); if (tv > 0) o.trt.push(tv); else break; }
    /* 理解小考（2026-10-21）：qz ＝ 看懂了哪一版規則（RPQV）、qzt ＝ 什麼時候 */
    o.qz = Math.max(0, Math.round(+st.qz || 0)); o.qzt = Math.max(0, Math.round(+st.qzt || 0)); o.cq = Math.max(0, Math.round(+st.cq || 0)); o.cqt = Math.max(0, Math.round(+st.cqt || 0));   /* 2026-10-25：🎯 全班獎勵小測驗 */   /* 2026-10-20 第十五次：⚔ 戰力階級 最高到過第幾階（升一階 🪙＋100 一次，拿下裝備也不會收回） */
    return o; }
  /* 🎉 加倍 時段（2026-10-26 第二十六次 第 2-4 點，老師選 B 簡單版：班級＋時間＋✖＋任務，不挑學生）：
     老師看板〔🎁 全班 獎勵〕最上面：〔🟢 全開〕＝ 全部班級、全部任務；〔⛔ 全關〕；〔⚙ 照 我 的 設定〕＝ 勾 的 班級、勾 的 任務（類別）。都 只在 從～到 這段 時間。
     答對 賺 的 練習 金幣 ✖ k（多出來 的 不算 進「一天 最多」）、做完 一次 的 經驗值 ✖ x。正確率、分數、排行榜 不變。伺服器 存 在 指令碼屬性 BOOST */
  var BOOST = null, BOK = [1, 1.5, 2], BCAT = ['game', 'tq', 'mt', 'r1', 'l', 'lv', 'g3c'];
  function bstClean(b) { b = b || {}; var m = b.m === 'all' || b.m === 'set' ? b.m : 'off', f = Math.round(+b.from || 0), t = Math.round(+b.to || 0);
    return { m: m, k: BOK.indexOf(+b.k) >= 0 ? +b.k : 1, x: BOK.indexOf(+b.x) >= 0 ? +b.x : 1, from: f, to: t > f ? t : 0,
      cls: (b.cls || []).map(String).filter(function (c) { return /^\d{3}$/.test(c); }).slice(0, 40), cats: (b.cats || []).map(String).filter(function (c) { return BCAT.indexOf(c) >= 0; }) }; }
  function rpBoostSet(b) { BOOST = b ? bstClean(b) : null; }
  /* 這一筆（或 這一班、這個 時間）有沒有 加倍：回傳 [金幣 倍數, 經驗值 倍數] */
  function bstAt(cls, t, set, B) { B = B || BOOST; if (!B || B.m === 'off' || !B.to || t < B.from || t >= B.to) return [1, 1];
    if (B.m === 'set') { if (B.cls.indexOf(String(cls)) < 0) return [1, 1]; if (set != null && B.cats.length && B.cats.indexOf(cat(set).k) < 0) return [1, 1]; }
    return [B.k, B.x]; }
  /* 平板 的 金色 橫幅：這一班 現在 有沒有 加倍 */
  function bstFor(id, now, B) { B = B || BOOST; var c = String(id || '').slice(0, 3), a = bstAt(c, now || Date.now(), null, B); return a[0] > 1 || a[1] > 1 ? { k: a[0], x: a[1], to: B.to, cats: B.m === 'set' ? B.cats : [] } : null; }
  /* 這個人全部的紀錄 ➜ 經驗值、金幣（只算沒作廢的） */
  function rpEarn(rs, st) {
    var trt = (st && st.trt) || [];   /* 那一筆的時候是第幾階（升階以後才多，老師 2026-10-21） */
    var tierAt = function (t) { var k = 0; while (k < trt.length && trt[k] <= t) k++; return k; };
    var L = (rs || []).filter(function (r) { return !r.x && r.m !== 'v'; }).sort(function (a, b) { return a.t - b.t; });
    var xp = 0, days = {}, dayCoin = {}, cnt = {}, prev = {}, wk = {}, coin = 0, wkq = {};
    L.forEach(function (r) {
      var d = day(r.t), ck = d + '|' + r.set, fast = (+r.fast || 0) * 2 > r.n;
      var bo = bstAt(r.cls || String(r.id || '').slice(0, 3), r.t, r.set);   /* 🎉 加倍 時段 */
      if (r.m !== 'lv' && counts(r.ok, r.n, r.m, r.fast)) { cnt[ck] = (cnt[ck] || 0) + 1; if (cnt[ck] <= CAP) xp += Math.round(RPX.rec * bo[1]); }
      if (!days[d]) { days[d] = 1; xp += RPX.day; var w0 = weekStart(r.t); wk[w0] = (wk[w0] || 0) + 1; }
      if (r.m === 'l' || r.m === 'lv' || r.m === 'mem' || fast) return;
      var c = 0;
      if (r.m === 'g') c += (+r.ok || 0) + RPC.fix * (+r.fix || 0);
      else (r.qs || []).forEach(function (q, j) { var k = (q[6] || r.set) + '#' + (q[5] == null ? j : q[5]); if (q[0]) { c += wkq[k] === 1 ? RPC.fix : 1; if (wkq[k] === 1) wkq[k] = 2; } else if (!wkq[k]) wkq[k] = 1; });
      if (r.acc != null) { if (prev[r.set] != null && r.acc > prev[r.set]) c += RPC.prog; prev[r.set] = r.acc; }
      var tk = tierAt(r.t); if (tk >= 2 && /td_ch$/.test(r.set)) c = Math.round(c * RPCHAL);   /* 🔥 挑戰關（★★ 精英戰士 以上）：金幣 ✖1.5 */
      if (tk) c = Math.round(c * (100 + RPTB[tk][0]) / 100);
      var room = RPTB[tk][1] - (dayCoin[d] || 0), g = Math.max(0, Math.min(room, c)); dayCoin[d] = (dayCoin[d] || 0) + g; coin += g;
      if (bo[0] > 1) coin += Math.round(g * (bo[0] - 1));   /* 🎉 加倍 多出來 的 不算 進 一天 最多 */
    });
    var chests = 0; for (var w in wk) if (wk[w] >= RPC.chestDays) chests++;
    return { xp: xp, coin: coin + chests * RPC.chest, chests: chests, days: Object.keys(days).length, dd: days };
  }
  /* ⚔ 戰力階級（2026-10-20 第十五次 老師 C17 第 5 題 B）：每升一階 🪙＋100 一次。2026-10-21 第十六次 第 5 點 改名＋真的能力（不加分數、不讓題目變簡單）：
     ★ 見習戰士 300 ➜ ★★ 精英戰士 600 ➜ ★★★ 烈焰戰將 1000 ➜ ★★★★ 雷霆戰神 1500 ➜ ★★★★★ 傳說戰神 2200
     RPTB[階] ＝ [練習賺的金幣多幾 %, 一天最多幾個金幣]（老師選 5% 一階、上限 120～200；0 ＝ 還沒有階級）；RPTX ＝ 這一階才買得到的寶物（價錢、等級照原本） */
  var RPTIER = [[300, '見習戰士'], [600, '精英戰士'], [1000, '烈焰戰將'], [1500, '雷霆戰神'], [2200, '傳說戰神']], RPTIERC = 100;
  var RPTB = [[0, 100], [5, 120], [10, 140], [15, 160], [20, 180], [25, 200]];
  var RPTX = { s0213: 1, s0912: 1, s0118: 2, s0418: 2, s0813: 3, s0913: 3, s0318: 4, s0715: 4, s0220: 5, s0420: 5 };
  function rpTier(pow) { var t = 0; for (var i = 0; i < RPTIER.length; i++) if ((+pow || 0) >= RPTIER[i][0]) t = i + 1; return t; }
  /* 伺服器存檔以前：最高到過的階級記下來（rpView 的金幣照最高的算） */
  function rpTierUp(rs, st, now) { st = rpClean(st); var t = now || Date.now(); st.tr = Math.max(st.tr, rpTier(rpView(rs, st).power)); while (st.trt.length < st.tr) st.trt.push(t); return st; }
  /* 平板看的：等級、經驗值條、金幣、寵物陪了幾天（裝上以後練了幾天：3 天長大、7 天進化）、戰力、稱號 */
  function rpView(rs, st) { st = rpClean(st); var E = rpEarn(rs, st), pd = 0; E.xp += st.bx; E.coin += st.bc; if (+st.cq >= 1) { E.coin += RPCQB[0]; E.xp += RPCQB[1]; }   /* 2026-10-27 第三十二次 第 9-(3) 點：🎯 全班獎勵 3 題 答對 ＝ 🪙＋50 ⭐＋25（只有一次；以前 答對 的 也 算） */ var lv = rpLv(E.xp);
    if (st.eq.p) { for (var d in E.dd) if (+d >= day(st.pt)) pd++; pd += st.snack; }
    var ps = pd >= 7 ? 2 : pd >= 3 ? 1 : 0, all = st.own.h.concat(st.own.w, st.own.p);
    var pow = lv * 10 + ps * 50; ['h', 'w', 'p'].forEach(function (k) { if (st.eq[k]) pow += rpStar(st.eq[k]) * 100; }); pow += st.eq.t.length * 20; for (var sk in st.eq.s) pow += rpStar(st.eq.s[sk]) * 20;
    var tier = rpTier(pow), tm = Math.max(st.tr, tier); E.coin += tm * RPTIERC;
    var titles = RPSET.filter(function (x) { return x[1].every(function (id) { return all.indexOf(id) >= 0; }); }).map(function (x) { return x[0]; }).concat(st.lt);
    return { xp: E.xp, lv: lv, lvAt: 16 * (lv - 1) * (lv - 1), lvNext: 16 * lv * lv, earned: E.coin, coins: E.coin - st.spent, chests: E.chests, days: E.days,
      petDays: pd, petStage: ps, power: pow, titles: titles, medal: st.medal, st: st,
      hit: rpDmg(pow), petHit: st.eq.p ? RPPET[ps] : 0, mon: rpMonAt(st.mon), ch: st.ch, tier: tier, tmax: tm,
      tnow: st.trt.length, pct: RPTB[st.trt.length][0], cap: RPTB[st.trt.length][1], qz: st.qz, cq: st.cq };   /* 現在金幣多幾 %、一天最多（照已經記下時間的階） */
  }
  /* 這一次（編號 u）拿到多少：全部 − 沒有這一筆 */
  function rpGain(rs, st, u) { var a = rpView(rs, st), b = rpView((rs || []).filter(function (r) { return r.u !== u; }), st);
    return { lv: a.lv, lv0: b.lv, xp: a.xp, gx: a.xp - b.xp, coins: a.coins, gc: a.earned - b.earned, lvAt: a.lvAt, lvNext: a.lvNext, h: a.st.eq.h, w: a.st.eq.w, p: a.st.eq.p, t: a.st.eq.t, s: a.st.eq.s, ps: a.petStage, pow: a.power,
      hit: a.hit, petHit: a.petHit, mon: a.mon }; }
  /* ⚡ 現場任務結束，老師大螢幕發的獎勵（要老師密碼）：b ＝ {c 金幣, x 經驗值, tre:[寶物], title, snack, medal}；寶物已經有了 ＝ 40 金幣 */
  function rpBonus(st, b) { st = rpClean(st); b = b || {};
    /* 2026-10-20 第十四次：老師的全班獎勵、冠軍寶箱有編號 k（例 wk|2026-10-19|402）➜ 同一個編號只發一次（老師按兩次也不會多） */
    if (b.k) { var bk = String(b.k).slice(0, 40); if (st.bk.indexOf(bk) >= 0) return st; st.bk.push(bk); st.bk = st.bk.slice(-60); }
    st.ch = Math.min(20, st.ch + Math.max(0, Math.min(3, Math.round(+b.chest || 0))));
    st.bc += Math.max(0, Math.min(500, Math.round(+b.c || 0))); st.bx += Math.max(0, Math.min(500, Math.round(+b.x || 0)));
    st.snack += Math.max(0, Math.min(5, Math.round(+b.snack || 0))); st.medal += Math.max(0, Math.min(5, Math.round(+b.medal || 0)));
    (b.tre || []).forEach(function (t) { t = String(t); if (!RPTP[t]) return; if (st.own.t.indexOf(t) >= 0 || RPHIDE[t]) st.bc += 40;   /* 第二十二次：下架 的 舊寶物 ＝ 換成 🪙 40 */ else { st.own.t.push(t); st.eq.t.push(t); rpWear(st, t); } });
    if (b.title) { var tt = String(b.title).slice(0, 20); if (st.lt.indexOf(tt) < 0) st.lt.push(tt); }
    return st; }
  /* ⚡ 現場任務 結束〔🎁 發獎勵〕：每一個參加的人 一筆紀錄（2026-10-18 C10 第 3 題 B）＝ 練習次數 ＋1、那一天算練了 1 天；沒有題目、正確率不算
     編號 ＝ lv＋房間＋5碼＋開始時間（同一場按兩次也只記一次）；只有伺服器寫得進去（clean() 擋平板送的） */
  function lvRec(id, room, t0, now) { var c = checkId(id); if (c.err) return null; room = String(room || '').replace(/\D/g, '').slice(0, 4);
    return { t: now, id: c.id, g: c.g, cls: c.cls, seat: c.seat, set: 'g' + c.g + 'lv_live', name: '⚡ 現場任務', m: 'lv', n: 0, ok: 0, acc: null, s: null, fix: 0, mp: 0, mw: 0, sec: 0,
      raw: 0, fast: 0, src: 'school', dev: 'live', u: 'lv' + room + '_' + c.id + '_' + Math.max(0, Math.round(+t0 || 0)).toString(36).slice(-8), qs: [], x: false }; }
  /* ══ 2026-10-20 第十四次（老師：武器、寵物真的能打怪；限量、限時；全班獎勵、冠軍寶箱；規格 rpg/CLAUDE.md 最上面）══ */
  /* 🐾 寵物跟著出招（老師選「只在遊戲裡幫」）：寶寶 ＋3、長大 ＋5、進化 ＋8（現場任務打魔王、做完練習打怪） */
  var RPPET = [3, 5, 8];
  /* 👾 怪物：被黑暗附身的神獸（寵物 16～30 的圖變暗），打倒 ＝ 淨化、收進圖鑑；第 i 隻（從 0 數）血量 80 ＋ 40 ✕ i；15 隻打完從頭再來（血量照樣加） */
  var RPMON = ['p16', 'p22', 'p23', 'p24', 'p25', 'p27', 'p30', 'p17', 'p19', 'p20', 'p29', 'p28', 'p18', 'p21', 'p26'];
  function rpMonHp(i) { return 80 + 40 * Math.max(0, +i || 0); }
  function rpMonAt(m) { m = m || { i: 0, hp: 0 }; return { i: m.i, m: RPMON[m.i % RPMON.length], hp: m.hp, max: rpMonHp(m.i), round: Math.floor(m.i / RPMON.length) + 1 }; }
  /* 做完一次練習（伺服器存好那一筆以後）：答對幾題 ＝ 打幾下；一下 ＝ 一擊（武器愈強愈痛）＋ 寵物；一次最多打倒 2 隻；太快亂按、不算練習次數的 ＝ 不打 */
  function rpFight(rs, st, R) { st = rpClean(st); if (!R || R.m === 'v' || R.m === 'l' || R.m === 'lv' || !counts(R.ok, R.n, R.m, R.fast) || (+R.fast || 0) * 2 > R.n) return { st: st, f: null };
    var hits = Math.max(0, Math.min(60, Math.round(+R.ok || 0))); if (!hits) return { st: st, f: null };
    var V = rpView(rs, st), d = V.hit, pd = V.petHit, tot = hits * (d + pd), f = { hits: hits, d: d, pd: pd, from: rpMonAt(st.mon), kill: [] };
    while (tot > 0) { var need = rpMonHp(st.mon.i) - st.mon.hp; if (tot >= need && f.kill.length < 2) { tot -= need; f.kill.push(RPMON[st.mon.i % RPMON.length]); st.mon.i++; st.mon.hp = 0; } else { st.mon.hp = Math.min(rpMonHp(st.mon.i) - 1, st.mon.hp + tot); tot = 0; } }
    f.to = rpMonAt(st.mon); return { st: st, f: f }; }
  /* 🏷 限量（老師：全部學生一共 5 個，先換先得）、⏳ 限時（10 月 31 號 下架 ＝ 台灣 11 月 1 日 0:00） */
  var RPLIM = { s0713: 5, s0812: 5, s0815: 5 };
  /* 2026-10-20 第十五次（老師 C17 第 7 題 A、第 8 題 甲、第 8 點）：s0805 金色獅鷲寶寶、s0907 噴射翅膀 變回一般商品；新的 10 月 31 號下架 ＝ s0301 金龍（必殺）、s0804 星空小龍、s0908 雷電翅膀 */
  var RPEND0 = Date.UTC(2026, 9, 31, 16, 0, 0), RPEND = { s0301: RPEND0, s0804: RPEND0, s0710: RPEND0, s0908: RPEND0, s1005: RPEND0 };
  /* 👑 冠軍寶箱（每週全年級「最認真練習」前 5 名）：2026-10-25 第二十五次 ➜ 只發金幣和經驗值：固定 🪙 ＋250、⭐ ＋150（RPCH；以前 ＝ 55% 金幣 300～500、45% 商城第 2 排） */
  function rpOpen(st, rnd, rnd2) { st = rpClean(st); if (st.ch <= 0) return { err: 'none' }; st.ch--;
    var r = { c: RPCH.c, x: RPCH.x }; st.bc += r.c; st.bx += r.x;
    st.chl.push(r); st.chl = st.chl.slice(-5); return { st: st, r: r }; }
  /* 合作打魔王的傷害（C9 第 6 題 B）：答對一題 10 ＋ 戰力 ÷ 100（最多 ＋20）；只用在全班一起的血條 */
  function rpDmg(power) { return 10 + Math.min(20, Math.floor((+power || 0) / 100)); }
  /* 買：第一個 ★1 英雄、★1 武器、★1 寵物 各送一個（免費選）；其他要金幣夠、等級夠 */
  function rpBuy(rs, st, id, now, sold) { st = rpClean(st); id = String(id); var k = rpKind(id);
    if (!rpOk(id)) return { err: 'item' };
    if (st.own[k].indexOf(id) >= 0) return { err: 'own' };
    if (RPEND[id] && (+now || 0) >= RPEND[id]) return { err: 'end' };              /* ⏳ 下架了 */
    if (RPLIM[id] && (+sold || 0) >= RPLIM[id]) return { err: 'sold' };            /* 🏷 換完了 */
    if (RPTX[id] && Math.max(st.tr, rpTier(rpView(rs, st).power)) < RPTX[id]) return { err: 'tier', need: RPTX[id] };   /* ⚔ 這一階才買得到 */
    var V = rpView(rs, st), free = k !== 't' && rpStar(id) === 1 && !st.free[k] && !st.own[k].length, pr = free ? 0 : rpPrice(id);
    if (V.lv < rpNeed(id)) return { err: 'lv', need: rpNeed(id) };
    if (V.coins < pr) return { err: 'coin', need: pr - V.coins };
    st.own[k].push(id); st.spent += pr; if (free) st.free[k] = 1;
    if (k === 's') rpWear(st, id); else if (k === 't') { st.eq.t.push(id); rpWear(st, id); } else { st.eq[k] = id; if (k === 'p') st.pt = now || 0; }
    return { st: st, paid: pr, free: free }; }
  /* 換裝（買過的才可以）；寶物 ＝ 開／關 */
  function rpEquip(st, id, now) { st = rpClean(st); id = String(id); var k = rpKind(id);
    if (!k || st.own[k].indexOf(id) < 0) return { err: 'own' };
    if (k === 's') { var S = rpSC(id); if (st.eq.s[S.slot] === id) delete st.eq.s[S.slot]; else rpWear(st, id); }   /* 商城：再點 ＝ 拿下來 */
    else if (k === 't') { var i = st.eq.t.indexOf(id); if (i >= 0) st.eq.t.splice(i, 1); else { st.eq.t.push(id); rpWear(st, id); } }
    else { if (k === 'p' && st.eq.p !== id) st.pt = now || 0; st.eq[k] = id; }
    return { st: st }; }
  return { CLASSES: CLASSES, AFTER: AFTER, cname: cname, SEAT: SEAT, COLS: COLS, CI: CI, CAP: CAP, TOP: TOP, GMIN: GMIN, MT: MT, checkId: checkId, cat: cat, when: when, me: me, STAR: STAR, RPCHAL: RPCHAL, counts: counts, need: need, day: day, weekStart: weekStart,
    AW: AW, care: care, CAREMAX: CAREMAX, s100: s100, xN: xN, fromRow: fromRow, toRow: toRow, clean: clean, pick: pick, students: students, rank: rank, classes: classes, clsAwards: clsAwards, secOf: secOf, questions: questions, gtop: gtop, view: view,
    lkClean: lkClean, lkSet: lkSet, lkAny: lkAny, lkFor: lkFor, LKRE: LKRE, lktClean: lktClean, lktSet: lktSet, lkNow: lkNow,
    tkClean: tkClean, tkFor: tkFor, tkDone: tkDone, tkLock: tkLock, TKGRACE: TKGRACE,
    RPCW: RPCW, cwOk: cwOk, cwDays: cwDays, cwLv: cwLv, cwAmt: cwAmt, RPCQV: RPCQV, RPCQB: RPCQB, rpCwq: rpCwq, RPCH: RPCH, RPR: RPR, RPP: RPP, RPL: RPL, RPT: RPT, RPS: RPS, RPSON: RPSON, RPSP: RPSP, RPSL: RPSL, RPSLOT: RPSLOT, rpSC: rpSC, RPSET: RPSET, RPHIDE: RPHIDE, RPX: RPX, RPC: RPC, rpKind: rpKind, rpStar: rpStar, rpPrice: rpPrice, rpNeed: rpNeed, rpOk: rpOk, rpLv: rpLv,
    RPPET: RPPET, RPMON: RPMON, rpMonHp: rpMonHp, rpMonAt: rpMonAt, rpFight: rpFight, RPLIM: RPLIM, RPEND: RPEND, rpOpen: rpOpen, RPTIER: RPTIER, RPTIERC: RPTIERC, rpBoostSet: rpBoostSet, bstClean: bstClean, bstAt: bstAt, bstFor: bstFor, BCAT: BCAT, RPTB: RPTB, RPTX: RPTX, DILI: DILI, dili: dili, champs: champs, RPQV: RPQV, rpQuiz: rpQuiz, rpTier: rpTier, rpTierUp: rpTierUp,
    rpClean: rpClean, rpEarn: rpEarn, rpView: rpView, rpBuy: rpBuy, rpEquip: rpEquip, rpDmg: rpDmg, rpGain: rpGain, rpBonus: rpBonus, lvRec: lvRec };
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
/* ⚔ 戰力階級（2026-10-20 第十五次）：{5碼: 最高到過第幾階}（老師看板 排行榜 名字旁邊的徽章；學生平板 本班前 10 名也用） */
/* 排行榜上出現的 5 碼 ➜ 那個人的 ⚔ 戰力階級（只給有出現的） */
function tierOf(v) { try { var T = rpTiers(), j = JSON.stringify(v), o = {}; for (var id in T) if (j.indexOf('"' + id + '"') >= 0) o[id] = T[id]; v.tiers = o; } catch (e) { } return v; }
/* ✍ ★★★ 烈焰戰將 出 1 題 給 全班（2026-10-26 第二十七次 第 2 點，老師 選 C30 第 4 題＋選擇題 A 點選）：指令碼屬性 QSUB ＝ [{k, id, t, zh, o:[正解, 錯, 錯, 錯], st: 0 等老師／1 可以／-1 不要}]
   學生：一週 1 題（老師 還沒 看 ＝ 可以 換）；老師〔✔ 可以〕才 進 現場任務（大螢幕 寫「出題人：304 班 12 號」）；沒有 姓名 */
function qsGet() { try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('QSUB') || '[]') || []; } catch (x) { return []; } }
function qsPut(a) { PropertiesService.getScriptProperties().setProperty('QSUB', JSON.stringify(a.slice(-300))); }
function qsClean(o) { var zh = String((o && o.zh) || '').replace(/[<>]/g, '').trim().slice(0, 60), L = ((o && o.o) || []).slice(0, 4).map(function (x) { return String(x || '').replace(/[<>]/g, '').trim().slice(0, 80); });
  if (!zh || L.length !== 4 || L.some(function (x) { return !x; }) || L.filter(function (x, i) { return L.indexOf(x) === i; }).length !== 4) return null; return { zh: zh, o: L }; }
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
/* 2026-10-26 第二十九次 第 11 點（老師 選 A：一 登入 就 演）：拿到 冠軍寶箱 的 學生 ➜ 告訴 平板「上週 第幾名、練了 幾秒」（只有 自己 的；沒有 姓名）
   {k 寶箱 編號, rk 名次, sec 練習 秒數, g 年級}；不在 前 5 名 ＝ null。名次 第一次 算好 存在 指令碼 屬性 CHR_編號 */
function chestInfo(id) { var c = SC.checkId(id); if (c.err) return null; var T = chestTop(c.g, Date.now()); if (T.ids.indexOf(c.id) < 0) return null;
  var P = PropertiesService.getScriptProperties(), M = null; try { M = JSON.parse(P.getProperty('CHR_' + T.k) || 'null'); } catch (e) { }
  if (!M) { var w = SC.weekStart(Date.now()), w0 = w - 7 * 864e5; M = {}; SC.rank(SC.students(SC.pick(records(), { g: c.g, from: w0, to: w })), 'sec').filter(function (x) { return x.rk <= 5; }).forEach(function (x) { M[x.id] = [x.rk, Math.round(+x.v || 0)]; });
    try { P.setProperty('CHR_' + T.k, JSON.stringify(M)); } catch (e) { } }
  var m = M[c.id]; return m ? { k: T.k, rk: m[0], sec: m[1], g: c.g } : { k: T.k, rk: 0, sec: 0, g: c.g }; }
function chestAuto(id, st) { var c = SC.checkId(id); if (c.err) return null; var T = chestTop(c.g, Date.now());
  if (T.ids.indexOf(c.id) < 0 || (st.bk || []).indexOf(T.k) >= 0) return null; return SC.rpBonus(st, { chest: 1, k: T.k }); }
/* 🎁 全班獎勵 自動發（2026-10-23 第二十二次；2026-10-25 第二十五次 改成兩個目標＋照天數多給）：學生打開戰神之路 ➜ 這一班「上一週」
   ① 名單上 8 成的人練 2 天以上 ＝ 基本、② 每一位都練 3 天以上 ＝ 進階（SC.cwLv）➜ 這個學生自己上一週練幾天 ➜ SC.cwAmt（練不到 2 天 ＝ 沒有）。
   編號 cw|上一週星期一|班級（同一班同一週只發一次）；這一班達到哪一個目標，算好就存在指令碼屬性 CWX_編號（之後不再算） */
function cwAuto(id, st, rs) { var c = SC.checkId(id); if (c.err) return null; var w = SC.weekStart(Date.now()), w0 = w - 7 * 864e5, k = 'cw|' + new Date(w0 + 288e5).toISOString().slice(0, 10) + '|' + c.cls;
  if ((st.bk || []).indexOf(k) >= 0) return null; var P = PropertiesService.getScriptProperties(), v = P.getProperty('CWX_' + k);
  if (v !== '0' && v !== '1' && v !== '2') { var ids = roster().filter(function (r) { return r[0] === c.cls; }).map(function (r) { return r[0] + (r[1] < 10 ? '0' : '') + r[1]; });
    v = String(SC.cwOk(records(), ids, w0, w)); if (ids.length) try { P.setProperty('CWX_' + k, v); } catch (e) { } }
  var a = SC.cwAmt(+v, SC.cwDays(rs || mine(c.id), w0, w)[c.id]); return a ? SC.rpBonus(st, { c: a.c, x: a.x, k: k }) : null; }
/* 📊 最受歡迎排行榜（2026-10-25 第二十五次 老師 2(3)）：每一個年級 {o: {編號: 買過的人數}, e: {編號: 現在正在用的人數}}（戰士 h、武器 w、寵物 p、商城寶物 s；只有人數，沒有誰） */
function rpOwn() { var s = sheet(RPG), n = s.getLastRow(), o = { 3: { o: {}, e: {} }, 4: { o: {}, e: {} } }; if (n < 2) return o;
  s.getRange(2, 1, n - 1, 2).getValues().forEach(function (v) { var id = String(v[0]).replace(/\D/g, ''), q = {}; try { q = JSON.parse(String(v[1] || '{}')); } catch (x) { }
    var g = id.charAt(0), G = o[g]; if (!G || !/^\d{5}$/.test(id)) return; var ow = q.own || {}, e = q.eq || {}, ok = function (x) { return /^[bgwpst]\d{2,4}$/.test(String(x || '')); };   /* 2026-10-26 第 2-3 點：舊寶物 t01～t10（已下架）也 算 */
    ['h', 'w', 'p', 's', 't'].forEach(function (k) { (ow[k] || []).forEach(function (x) { if (ok(x)) G.o[x] = (G.o[x] || 0) + 1; }); });
    [e.h, e.w, e.p].concat(Array.isArray(e.t) ? e.t : [], e.s && typeof e.s === 'object' ? Object.keys(e.s).map(function (k) { return e.s[k]; }) : []).forEach(function (x) { if (ok(x)) G.e[x] = (G.e[x] || 0) + 1; }); }); return o; }
/* 🎯 全班獎勵 小測驗（2026-10-25）：{5碼: 3 題都答對的時間}（只有這一版；只給老師） */
function rpCq() { var s = sheet(RPG), n = s.getLastRow(), o = {}; if (n < 2) return o;
  s.getRange(2, 1, n - 1, 2).getValues().forEach(function (v) { var id = String(v[0]).replace(/\D/g, ''), q = {}; try { q = JSON.parse(String(v[1] || '{}')); } catch (x) { } if (+q.cq === SC.RPCQV && /^\d{5}$/.test(id)) o[id] = +q.cqt || 1; }); return o; }
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
/* 🎉 加倍 時段（2026-10-26 第二十六次 第 2-4 點）：老師 看板 存 在 指令碼屬性 BOOST；每一次 收到 要求 先 交給 _calc.js（金幣、經驗值 照 這個 算） */
function boost() { try { return SC.bstClean(JSON.parse(prop('BOOST') || '{}')); } catch (x) { return SC.bstClean({}); } }
function doGet(e) {
  var q = (e && e.parameter) || {};
  try { SC.rpBoostSet(boost()); } catch (x) { }
  try {
    /* 任務：這一班的任務＋我做完了哪些（不用密碼：只有班級的任務，沒有姓名）；now ＝ 伺服器時間（平板時鐘不準也鎖得對） */
    if (q.a === 'tasks') { var c0 = SC.checkId(q.id); if (c0.err) return out({ err: c0.err });
      var rs = records(); return out({ ok: true, now: Date.now(), locks: SC.lkFor(locks(), c0.id, lockt(), Date.now()), tasks: SC.tkFor(tasks(), c0.id).map(function (t) { t.done = SC.tkDone(rs, t, c0.id); return t; }) }); }
    /* 〔🔒 開關〕沒登入的學生：這個年級有沒有任何一班鎖住（只給代號，不給哪幾班，D6 第 13 題） */
    /* 🦸 我的英雄：等級、經驗值、金幣、買了什麼（只有自己的；沒有姓名） */
    if (q.a === 'rpg') { var c1 = SC.checkId(q.id); if (c1.err) return out({ err: c1.err }); var rs1 = mine(c1.id), R1 = rpRow(c1.id);
      /* 2026-10-20 第十五次：⚔ 戰力階級 第一次到 ➜ 記下來（🪙＋100 不會因為拿下裝備被收回）；👑 冠軍寶箱 上一週的前 5 名 自動發（老師忘了按也拿得到） */
      var T1 = SC.rpTierUp(rs1, R1.st), ch1 = chestAuto(c1.id, T1), cw1 = cwAuto(c1.id, JSON.parse(JSON.stringify(T1)), rs1); if (T1.tr !== R1.st.tr || T1.trt.length !== R1.st.trt.length || ch1 || cw1) { var lk1 = LockService.getScriptLock(); lk1.waitLock(20000); try { R1 = rpRow(c1.id); T1 = SC.rpTierUp(rs1, R1.st); T1 = chestAuto(c1.id, T1) || T1; T1 = cwAuto(c1.id, T1, rs1) || T1; rpSave(R1, c1.id, T1); } finally { lk1.releaseLock(); } }
      var TT = rpTiers(), hall = Object.keys(TT).filter(function (k) { return TT[k] >= 5 && k.charAt(0) === c1.id.charAt(0); }).sort();   /* 🏛 名人堂（★★★★★ 傳說戰神，同一個 年級；只有 5 碼） */
      var chi1 = null; try { chi1 = chestInfo(c1.id); } catch (x) { }
      return out({ ok: true, now: Date.now(), v: SC.rpView(rs1, T1), stock: rpStock(), bo: SC.bstFor(c1.id, Date.now()), hall: hall, chi: chi1 }); }
    /* 📅 今日任務、📈 我的 進步（2026-10-26 第二十七次）：只 有 自己 的（沒有 姓名）*/
    if (q.a === 'me') { var c9 = SC.checkId(q.id); if (c9.err) return out({ err: c9.err }); var st9 = {}; try { st9 = rpRow(c9.id).st || {}; } catch (x) { } return out({ ok: true, me: SC.me(mine(c9.id), Date.now()), tr: +st9.tr || 0 }); }
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
  try { SC.rpBoostSet(boost()); } catch (x) { }
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
          o.op === 'qz' ? { st: SC.rpQuiz(R5.st, o.v, Date.now()) } : o.op === 'cq' ? { st: SC.rpCwq(R5.st, o.v, Date.now()) } : { err: 'op' };   /* 📜 理解小考 5 題都答對（2026-10-21） */
        if (r5.err) return out({ err: r5.err, need: r5.need, v: SC.rpView(rs5, R5.st), stock: rpStock() });
        r5.st = SC.rpTierUp(rs5, r5.st); rpSave(R5, c2.id, r5.st); return out({ ok: true, paid: r5.paid, free: r5.free, r: r5.r, v: SC.rpView(rs5, r5.st), stock: rpStock() });
      } finally { lk5.releaseLock(); }
    }
    if (o.a === 'qsub') { var cq = SC.checkId(o.id); if (cq.err) return out({ err: cq.err }); var qq = qsClean(o); if (!qq) return out({ err: 'bad' });
      if ((+(rpRow(cq.id).st || {}).tr || 0) < 3) return out({ err: 'tier' });
      var lkQ = LockService.getScriptLock(); lkQ.waitLock(20000);
      try { var A = qsGet(), nq = Date.now(), w0 = SC.weekStart(nq), mineQ = A.filter(function (x) { return x.id === cq.id && x.t >= w0; });
        if (mineQ.some(function (x) { return x.st === 1; })) return out({ err: 'week' });
        A = A.filter(function (x) { return !(x.id === cq.id && x.t >= w0); }); A.push({ k: cq.id + nq.toString(36), id: cq.id, t: nq, zh: qq.zh, o: qq.o, st: 0 }); qsPut(A); } finally { lkQ.releaseLock(); }
      return out({ ok: true }); }
    if (o.a === 'teacher' || o.a === 'qok' || o.a === 'void' || o.a === 'set' || o.a === 'task' || o.a === 'lock' || o.a === 'lockt' || o.a === 'delp' || o.a === 'pw' || o.a === 'rpgb' || o.a === 'rpgw' || o.a === 'boost') {
      if (!pwOk(o.pw)) return out({ err: 'pw' });
      /* 🎉 加倍 時段：{m: off／all／set, k, x, from, to, cls, cats}（2026-10-26） */
      if (o.a === 'boost') { var lkB = LockService.getScriptLock(); lkB.waitLock(20000); try { PropertiesService.getScriptProperties().setProperty('BOOST', JSON.stringify(SC.bstClean(o.b))); } finally { lkB.releaseLock(); } return out({ ok: true, boost: boost() }); }
      /* ⚡ 現場任務 大螢幕：只檢查老師密碼（2026-10-17 第八次） */
      /* 2026-10-21：每一班 上一週 最認真練習 第 1 名（👑 選 1 次 現場任務 的 遊戲） */
      if (o.a === 'pw') { var cp = {}; try { cp = SC.champs(records(), Date.now()); } catch (x) { }
        /* 2026-10-26 第二十七次：✍ 老師 說 可以 的 學生 出題、每一個 人 的 階級（★★★★ 小老師、★★★★★ 傳說戰神 一個月 選 1 次 遊戲）——只有 5 碼，沒有 姓名 */
        return out({ ok: true, champs: cp, sq: qsGet().filter(function (x) { return x.st === 1; }).slice(-80).map(function (x) { return { k: x.k, id: x.id, zh: x.zh, o: x.o }; }), tiers: rpTiers() }); }
      if (o.a === 'qok') { var lkO = LockService.getScriptLock(); lkO.waitLock(20000); try { var A2 = qsGet(); A2.forEach(function (x) { if (x.k === o.k) x.st = +o.v === 1 ? 1 : +o.v === 0 ? 0 : -1; }); qsPut(A2); } finally { lkO.releaseLock(); } return out({ ok: true, qsub: qsGet() }); }
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
      return out({ ok: true, now: Date.now(), cols: SC.COLS, rows: rows().map(function (r) { return r.map(function (x) { return x instanceof Date ? x.getTime() : x; }); }), sizes: sizes(), roster: roster(), boards: boardsOn(), tasks: tasks(), locks: locks(), lockt: lockt(), tiers: rpTiers(), quiz: rpQz(), rqv: SC.RPQV, eqs: rpEqs(), cwq: rpCq(), own: rpOwn(), boost: boost(), qsub: qsGet() });
    }
    return out({ err: 'a' });
  } catch (x) { return out({ err: 'server', msg: String(x) }); }
}
