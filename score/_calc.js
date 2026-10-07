/* score/_calc.js — 成績紀錄的「怎麼算」：唯一真相來源（2026-10-07 對話 C，使用者決定在 sentences/2026-10-07_C_設計與研究清單.md，Q1～Q18 全部照建議）
 *
 * 同一份程式用在三個地方：① Google Apps Script（score/_build.js 把它接進 Code.gs）② 老師看板（teacher/index.html）③ 量測（node）。
 * 寫法只用 ES5（iPad iOS 14 也跑得動；Apps Script V8 也可以）。不要用 ?? ?. 箭頭函式。
 *
 * 規則（照使用者的決定）：
 *   🎯 正確率（百分制）   一組 ＝ 答對 ÷ 題數 ✕ 100
 *   ⚡ 總分（百分制）     一組 ＝ 每題答對 60 ÷ 題數 ＋ 速度 40 ÷ 題數 ✕（剩下秒數 ÷ 總秒數）（Q1-A：答對 60 ＋ 速度 40）
 *   個人成績             每一組取「最近一次」，再把做過的組平均（Q8-A）
 *   🔁 作答次數           答對數 ≧ 題數 ✕ 2/3 才算 1 次（5 題至少對 4 題）；同一組一天最多算 3 次（Q11-A）
 *   🚀 進步               每一組：最近一次 − 上一次（所有作答都算，但「⚡ 秒按」超過一半的那一次不拿來比）；
 *                        個人 ＝ 這段期間做過兩次以上的組平均；上次、這次都 100 ＝「🔥 保持滿分」，不算進平均（Q3-A）
 *   ⚡ 秒按               開始作答 1 秒內就按（Q10-A），只給老師看
 *   同分                 正確率同分比總分，總分也同 ＝ 同名次；其他榜同分 ＝ 同名次（Q14-A）
 *   本週                 台灣時間星期一 00:00 開始（Q12-A）
 *   班級                 三年級 304、307、311；四年級 402、406、409、410；座號 01～40；只跟同年級比（Q9-A）
 */
var SC = (function () {
  var CLASSES = { 3: ['304', '307', '311'], 4: ['402', '406', '409', '410'] };
  var COLS = ['時間', '5碼', '年級', '班級', '座號', '題組', '題組名稱', '題數', '答對', '正確率', '總分百分制', '原始分數', '秒按', '來源', '平板', '編號', '每題', '作廢'];
  var DAY = 864e5, TZ = 8 * 36e5, CAP = 3, TOP = 10;

  /* 5 碼 ➜ 班級、座號；不對就回報原因（登入防呆，Q17：年級網站互相擋） */
  function checkId(id, g) {
    id = String(id || '');
    if (!/^\d{5}$/.test(id)) return { err: 'len' };
    var c = id.slice(0, 3), s = +id.slice(3);
    var gg = c.charAt(0) === '3' ? 3 : (c.charAt(0) === '4' ? 4 : 0);
    if (!gg || CLASSES[gg].indexOf(c) < 0) return { err: 'cls', cls: c };
    if (g && gg !== +g) return { err: 'grade', g: gg };
    if (s < 1 || s > 40) return { err: 'seat', seat: s };
    return { id: id, g: gg, cls: c, seat: s };
  }
  function counts(ok, n) { return n > 0 && ok * 3 >= n * 2; }          /* 答對 2/3 以上才算 1 次 */
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
  /* 一列（試算表）➜ 一筆紀錄 */
  function fromRow(r) {
    var qs = []; try { qs = typeof r[16] === 'string' ? JSON.parse(r[16] || '[]') : (r[16] || []); } catch (e) { qs = []; }
    var t = r[0] instanceof Date ? r[0].getTime() : (typeof r[0] === 'number' ? r[0] : Date.parse(r[0]));
    var id = String(r[1]).replace(/\D/g, ''); while (id.length < 5 && id.length) id = '0' + id;
    return { t: t, id: id, g: +r[2], cls: String(r[3]), seat: +r[4], set: String(r[5]), name: String(r[6]), n: +r[7], ok: +r[8],
      acc: +r[9], s: +r[10], raw: +r[11], fast: +r[12], src: String(r[13]), dev: String(r[14]), u: String(r[15]), qs: qs,
      x: r[17] === true || String(r[17]).toUpperCase() === 'TRUE' || r[17] === '✔' || r[17] === 'v' || r[17] === 'V' };
  }
  function toRow(R) {
    return [new Date(R.t), R.id, R.g, R.cls, R.seat, R.set, R.name, R.n, R.ok, R.acc, R.s, R.raw, R.fast, R.src, R.dev, R.u, JSON.stringify(R.qs), false];
  }
  /* 學生端送來的一筆 ➜ 檢查＋算好欄位（不相信學生端算的分數） */
  function clean(o, now) {
    var c = checkId(o.id); if (c.err) return null;
    var qs = o.qs; if (!qs || !qs.length || qs.length > 10) return null;
    var Q = [];
    for (var i = 0; i < qs.length; i++) { var q = qs[i];
      Q.push([q[0] ? 1 : 0, Math.max(-1, Math.min(3, Math.round(+q[1] || 0))), Math.max(0, Math.min(30, r1(+q[2] || 0))), q[3] ? 1 : 0, Math.max(0, Math.min(1, Math.round((+q[4] || 0) * 1000) / 1000))]); }
    var ok = 0, f = 0; for (i = 0; i < Q.length; i++) { ok += Q[i][0]; f += Q[i][3]; }
    var t = +o.t; if (!(t > now - 30 * DAY && t < now + 5 * 6e4)) t = now;   /* 平板時間不對就用伺服器時間；沒網路補送的照當時 */
    if (!/^g[34]u[12]_[\w-]{1,8}$/.test(String(o.set))) return null;
    return { t: t, id: c.id, g: c.g, cls: c.cls, seat: c.seat, set: String(o.set), name: String(o.name || '').slice(0, 60), n: Q.length, ok: ok,
      acc: Math.round(ok / Q.length * 100), s: s100(Q), raw: Math.max(0, Math.min(10000, Math.round(+o.raw || 0))), fast: f,
      src: o.src === 'home' ? 'home' : 'school', dev: String(o.dev || '').replace(/[^\w]/g, '').slice(0, 12), u: String(o.u || '').replace(/[^\w]/g, '').slice(0, 24), qs: Q, x: false };
  }
  function pick(rs, f) { /* f: {g, cls, from, to, src} */
    var out = [];
    for (var i = 0; i < rs.length; i++) { var r = rs[i];
      if (r.x) continue; if (f.g && r.g !== +f.g) continue; if (f.cls && r.cls !== f.cls) continue;
      if (f.from != null && r.t < f.from) continue; if (f.to != null && r.t >= f.to) continue; if (f.src && r.src !== f.src) continue;
      out.push(r); }
    return out;
  }
  /* 每一個人：🎯 正確率、⚡ 總分、🔁 次數、🚀 進步、🔥 保持滿分 */
  function students(rs) {
    var by = {}, ids = [];
    rs.slice().sort(function (a, b) { return a.t - b.t; }).forEach(function (r) {
      var p = by[r.id]; if (!p) { p = by[r.id] = { id: r.id, g: r.g, cls: r.cls, seat: r.seat, sets: {}, all: 0, last: 0, fastQ: 0, q: 0 }; ids.push(r.id); }
      (p.sets[r.set] = p.sets[r.set] || []).push(r); p.all++; p.last = r.t; p.fastQ += r.fast; p.q += r.n;
    });
    return ids.map(function (id) {
      var p = by[id], A = [], S = [], D = [], keep = false, cnt = 0, nsets = 0;
      for (var k in p.sets) { var a = p.sets[k], L = a[a.length - 1]; nsets++;
        A.push(L.acc); S.push(L.s);
        var perDay = {}; a.forEach(function (r) { if (counts(r.ok, r.n)) { var d = day(r.t); perDay[d] = (perDay[d] || 0) + 1; if (perDay[d] <= CAP) cnt++; } });
        var v = a.filter(function (r) { return r.fast * 2 <= r.n; });
        if (v.length >= 2) { var x = v[v.length - 1].acc, y = v[v.length - 2].acc; if (x === 100 && y === 100) keep = true; else D.push(x - y); }
      }
      var acc = mean(A), s = mean(S), pr = mean(D);
      return { id: id, g: p.g, cls: p.cls, seat: p.seat, acc: acc == null ? null : r1(acc), s: s == null ? null : r1(s), count: cnt,
        prog: pr == null ? null : r1(pr), keep: keep && pr == null ? true : keep, sets: nsets, all: p.all, last: p.last, fastQ: p.fastQ, q: p.q };
    });
  }
  /* 排名：同分同名次（1、1、3）；正確率同分比總分 */
  var BOARDS = {
    acc: { v: function (p) { return p.acc; }, cmp: function (a, b) { return (b.acc - a.acc) || (b.s - a.s); }, eq: function (a, b) { return a.acc === b.acc && a.s === b.s; }, ok: function (p) { return p.acc != null; } },
    s: { v: function (p) { return p.s; }, cmp: function (a, b) { return b.s - a.s; }, eq: function (a, b) { return a.s === b.s; }, ok: function (p) { return p.s != null; } },
    count: { v: function (p) { return p.count; }, cmp: function (a, b) { return b.count - a.count; }, eq: function (a, b) { return a.count === b.count; }, ok: function (p) { return p.count > 0; } },
    prog: { v: function (p) { return p.prog; }, cmp: function (a, b) { return b.prog - a.prog; }, eq: function (a, b) { return a.prog === b.prog; }, ok: function (p) { return p.prog != null && p.prog > 0; } }
  };
  function rank(ps, key) {
    var B = BOARDS[key], L = ps.filter(B.ok).sort(function (a, b) { return B.cmp(a, b) || (a.id < b.id ? -1 : 1); });
    var out = [], rk = 0;
    for (var i = 0; i < L.length; i++) { if (!i || !B.eq(L[i], L[i - 1])) rk = i + 1; out.push({ id: L[i].id, cls: L[i].cls, v: B.v(L[i]), rk: rk }); }
    return out;
  }
  /* 班級：有做的人的平均（Q13-A）＋參與率（要老師填人數） */
  function classes(ps, g, sizes) {
    return CLASSES[g].map(function (c) {
      var m = ps.filter(function (p) { return p.cls === c; });
      var nn = function (k) { return m.filter(function (p) { return p[k] != null; }).map(function (p) { return p[k]; }); };
      var a = mean(nn('acc')), s = mean(nn('s')), pr = mean(nn('prog')), cnt = 0;
      m.forEach(function (p) { cnt += p.count; });
      var size = sizes && +sizes[c] > 0 ? +sizes[c] : null;
      return { cls: c, n: m.length, size: size, acc: a == null ? null : r1(a), s: s == null ? null : r1(s), count: cnt, prog: pr == null ? null : r1(pr) };
    });
  }
  /* 錯題：每一題答了幾次、錯幾次、四個選項各被選幾次（選項 0 ＝ 正解，-1 ＝ 時間到） */
  function questions(rs) {
    var Q = {};
    rs.forEach(function (r) { r.qs.forEach(function (q, i) {
      var k = r.set + '#' + i, o = Q[k] = Q[k] || { k: k, set: r.set, i: i, n: 0, bad: 0, p: { '-1': 0, 0: 0, 1: 0, 2: 0, 3: 0 }, fast: 0 };
      o.n++; if (!q[0]) o.bad++; o.p[q[1]] = (o.p[q[1]] || 0) + 1; o.fast += q[3]; }); });
    var L = []; for (var k in Q) { Q[k].rate = Math.round(Q[k].bad / Q[k].n * 100); L.push(Q[k]); }
    return L.sort(function (a, b) { return (b.rate - a.rate) || (b.bad - a.bad); });
  }
  /* 學生看得到的（Q2、Q4、使用者 2026-10-07：只公開前 10 名；自己不在前 10 名只給差距，不給名次數字） */
  function top(list) { return list.filter(function (x) { return x.rk <= TOP; }); }
  function mine(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function view(all, o, now, boardsOn) {
    var c = checkId(o.id); if (c.err) return { err: c.err };
    var from = weekStart(now), W = pick(all, { g: c.g, from: from });
    var ps = students(W), me = mine(ps, c.id) || { id: c.id, acc: null, s: null, count: 0, prog: null, keep: false };
    var out = { id: c.id, cls: c.cls, g: c.g, week: from, boards: !!boardsOn,
      me: { acc: me.acc, s: me.s, count: me.count, prog: me.prog, keep: !!me.keep } };
    /* 這一組（作答中右上角的名次）：本班別人這週在這一組最好的原始分數，前 10 個 */
    if (o.set) {
      var best = {}; W.forEach(function (r) { if (r.set === o.set && r.cls === c.cls && r.id !== c.id) best[r.id] = Math.max(best[r.id] || 0, r.raw); });
      var v = []; for (var k in best) v.push(best[k]); v.sort(function (a, b) { return b - a; });
      var mineSet = W.filter(function (r) { return r.set === o.set && r.id === c.id; });
      out.set = { others: boardsOn ? v.slice(0, TOP) : [], tries: mineSet.length,
        prev: mineSet.length ? mineSet[mineSet.length - 1].acc : null,
        prevValid: (function () { var a = mineSet.filter(function (r) { return r.fast * 2 <= r.n; }); return a.length ? a[a.length - 1].acc : null; })(),
        best: mineSet.length ? Math.max.apply(null, mineSet.map(function (r) { return r.acc; })) : null,
        today: mineSet.filter(function (r) { return day(r.t) === day(now) && counts(r.ok, r.n); }).length };
    }
    /* 班級長條（我幫全班）：這週各班平均正確率 */
    var cl = classes(ps, c.g, null);
    out.classes = cl.map(function (x) { return { cls: x.cls, acc: x.acc, n: x.n }; });
    if (o.u) { var ps0 = students(W.filter(function (r) { return r.u !== o.u; }));
      var b0 = classes(ps0, c.g, null).filter(function (x) { return x.cls === c.cls; })[0], b1 = cl.filter(function (x) { return x.cls === c.cls; })[0];
      out.delta = b0.acc == null || b1.acc == null ? null : r1(b1.acc - b0.acc); }
    if (boardsOn) {
      out.top = {}; out.cut = {}; out.rk = {};
      ['acc', 's', 'count', 'prog'].forEach(function (k) {
        var g = rank(ps, k), cc = rank(ps.filter(function (p) { return p.cls === c.cls; }), k);
        out.top[k] = { cls: top(cc), grade: top(g) };
        /* 第 10 名的分數（給「再多 N 就進前 10」）；人數不到 10 個 ＝ 有做就進得去 */
        var cut = function (L) { var t = top(L); return t.length >= TOP ? t[t.length - 1].v : null; };
        out.cut[k] = { cls: cut(cc), grade: cut(g) };
        var a = mine(cc, c.id), b = mine(g, c.id);
        out.rk[k] = { cls: a && a.rk <= TOP ? a.rk : null, grade: b && b.rk <= TOP ? b.rk : null };   /* 只有前 10 名才給名次 */
      });
      out.keep = ps.filter(function (p) { return p.keep && p.cls === c.cls; }).map(function (p) { return p.id; });
    }
    return out;
  }
  return { CLASSES: CLASSES, COLS: COLS, CAP: CAP, TOP: TOP, checkId: checkId, counts: counts, need: need, day: day, weekStart: weekStart,
    s100: s100, fromRow: fromRow, toRow: toRow, clean: clean, pick: pick, students: students, rank: rank, classes: classes, questions: questions, view: view };
})();
if (typeof module !== 'undefined') module.exports = SC;
