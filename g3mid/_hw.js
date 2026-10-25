/* g3mid/_hw.js — 手指寫字母、電腦自動改（2026-10-25 老師第二十四次：選「電腦自動改」）
 * 做法：$P 點雲辨識（Vatavu、Anthony、Wobbrock 2012，筆順、筆畫數都不影響）＋ 寫在四線格的哪裡（分大小寫：c／C、o／O、p／P…）。
 * 座標：四線格單位 —— y 0 ＝ 最上面的線、1 ＝ 中間的線、2 ＝ 紅色底線（基準線）、3 ＝ 最下面的線。
 *   大寫 0～2；小寫 1～2；有長上去的（b d f h k l t）0～2；有長下來的（g j p q y）1～3。
 * 同一份程式：網頁（HW.js 字串）和量測（node require）都用。只寫 ES5。 */
var HWSRC = function () {
  function L(x1, y1, x2, y2) { var r = [], n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) * 12)); for (var i = 0; i <= n; i++) r.push([x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n]); return r; }
  function A(cx, cy, rx, ry, a0, a1) { var r = [], n = Math.max(6, Math.round(Math.abs(a1 - a0) / 12)); for (var i = 0; i <= n; i++) { var t = (a0 + (a1 - a0) * i / n) * Math.PI / 180; r.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); } return r; }
  function S() { var r = []; for (var i = 0; i < arguments.length; i++) r = r.concat(arguments[i]); return r; }
  function D(x, y) { return [[x, y - .04], [x, y + .04]]; }
  /* 每一個字母：好幾種寫法（小朋友常見的筆順），一種寫法 ＝ 好幾筆 */
  var T = {
    A: [[S(L(0, 2, .6, 0), L(.6, 0, 1.2, 2)), L(.3, 1.25, .9, 1.25)], [L(.6, 0, 0, 2), L(.6, 0, 1.2, 2), L(.3, 1.25, .9, 1.25)]],
    B: [[L(0, 0, 0, 2), S(L(0, 0, .55, 0), A(.55, .5, .45, .5, -90, 90), L(.55, 1, 0, 1), L(0, 1, .6, 1), A(.6, 1.5, .5, .5, -90, 90), L(.6, 2, 0, 2))],
        [S(L(0, 2, 0, 0), L(0, 0, .55, 0), A(.55, .5, .45, .5, -90, 90), L(.55, 1, .6, 1), A(.6, 1.5, .5, .5, -90, 90), L(.6, 2, 0, 2))]],
    C: [[A(.7, 1, .7, 1, -40, -320)]],
    D: [[L(0, 0, 0, 2), S(L(0, 0, .35, 0), A(.35, 1, .8, 1, -90, 90), L(.35, 2, 0, 2))], [S(L(0, 2, 0, 0), L(0, 0, .35, 0), A(.35, 1, .8, 1, -90, 90), L(.35, 2, 0, 2))]],
    E: [[L(0, 0, 0, 2), L(0, 0, 1, 0), L(0, 1, .8, 1), L(0, 2, 1, 2)], [S(L(1, 0, 0, 0), L(0, 0, 0, 2), L(0, 2, 1, 2)), L(0, 1, .8, 1)]],
    F: [[L(0, 0, 0, 2), L(0, 0, 1, 0), L(0, 1, .8, 1)], [S(L(1, 0, 0, 0), L(0, 0, 0, 2)), L(0, 1, .8, 1)]],
    G: [[S(A(.7, 1, .7, 1, -40, -360), L(1.4, 1, .8, 1))], [S(A(.7, 1, .7, 1, -40, -360), L(1.4, 1, .8, 1)), L(1.4, 1, 1.4, 2)], [S(A(.7, 1, .7, 1, -40, -355), L(1.38, 1.1, 1.38, 2)), L(.85, 1.1, 1.38, 1.1)]],
    H: [[L(0, 0, 0, 2), L(1.1, 0, 1.1, 2), L(0, 1, 1.1, 1)]],
    I: [[L(.5, 0, .5, 2)], [L(0, 0, 1, 0), L(.5, 0, .5, 2), L(0, 2, 1, 2)]],
    J: [[S(L(.9, 0, .9, 1.5), A(.5, 1.5, .4, .5, 0, 180))], [L(.4, 0, 1.3, 0), S(L(.9, 0, .9, 1.5), A(.5, 1.5, .4, .5, 0, 180))]],
    K: [[L(0, 0, 0, 2), S(L(1, 0, 0, 1.1), L(0, 1.1, 1.05, 2))], [L(0, 0, 0, 2), L(1, 0, .05, 1.1), L(.35, .85, 1.05, 2)]],
    L: [[S(L(0, 0, 0, 2), L(0, 2, .9, 2))]],
    M: [[S(L(0, 2, 0, 0), L(0, 0, .65, 1.3), L(.65, 1.3, 1.3, 0), L(1.3, 0, 1.3, 2))], [L(0, 0, 0, 2), S(L(0, 0, .65, 1.3), L(.65, 1.3, 1.3, 0)), L(1.3, 0, 1.3, 2)]],
    N: [[S(L(0, 2, 0, 0), L(0, 0, 1.1, 2), L(1.1, 2, 1.1, 0))], [L(0, 0, 0, 2), L(0, 0, 1.1, 2), L(1.1, 0, 1.1, 2)]],
    O: [[A(.7, 1, .7, 1, -90, -450)], [A(.7, 1, .7, 1, -90, 270)]],
    P: [[L(0, 0, 0, 2), S(L(0, 0, .55, 0), A(.55, .5, .5, .5, -90, 90), L(.55, 1, 0, 1))], [S(L(0, 2, 0, 0), L(0, 0, .55, 0), A(.55, .5, .5, .5, -90, 90), L(.55, 1, 0, 1))]],
    Q: [[A(.7, 1, .7, 1, -90, -450), L(.85, 1.45, 1.4, 2.1)]],
    R: [[L(0, 0, 0, 2), S(L(0, 0, .55, 0), A(.55, .5, .5, .5, -90, 90), L(.55, 1, 0, 1), L(0, 1, 1.05, 2))], [S(L(0, 2, 0, 0), L(0, 0, .55, 0), A(.55, .5, .5, .5, -90, 90), L(.55, 1, .3, 1), L(.3, 1, 1.05, 2))]],
    S: [[S(A(.6, .5, .55, .5, -25, -270), A(.6, 1.5, .6, .5, -90, 155))]],
    T: [[L(0, 0, 1.2, 0), L(.6, 0, .6, 2)]],
    U: [[S(L(0, 0, 0, 1.4), A(.55, 1.4, .55, .6, 180, 0), L(1.1, 1.4, 1.1, 0))]],
    V: [[S(L(0, 0, .6, 2), L(.6, 2, 1.2, 0))]],
    W: [[S(L(0, 0, .4, 2), L(.4, 2, .8, .5), L(.8, .5, 1.2, 2), L(1.2, 2, 1.6, 0))]],
    X: [[L(0, 0, 1.1, 2), L(1.1, 0, 0, 2)]],
    Y: [[L(0, 0, .6, 1), L(1.2, 0, .6, 1), L(.6, 1, .6, 2)], [S(L(0, 0, .6, 1), L(.6, 1, .6, 2)), L(1.2, 0, .6, 1)]],
    Z: [[S(L(0, 0, 1.1, 0), L(1.1, 0, 0, 2), L(0, 2, 1.1, 2))]],
    a: [[S(A(.4, 1.5, .4, .5, -15, -360), L(.8, 1.5, .8, 1), L(.8, 1, .8, 2))], [A(.4, 1.5, .4, .5, -15, -360), L(.8, 1, .8, 2)]],
    b: [[L(0, 0, 0, 2), A(.4, 1.5, .4, .5, 180, 540)], [S(L(0, 0, 0, 2), L(0, 2, 0, 1.6), A(.4, 1.5, .4, .5, 190, 530))]],
    c: [[A(.4, 1.5, .4, .5, -40, -320)]],
    d: [[S(A(.4, 1.5, .4, .5, -15, -360), L(.8, 1.5, .8, 0), L(.8, 0, .8, 2))], [A(.4, 1.5, .4, .5, -15, -360), L(.8, 0, .8, 2)]],
    e: [[S(L(0, 1.5, .8, 1.5), A(.4, 1.5, .4, .5, 0, -320))]],
    f: [[S(A(.65, .4, .3, .4, -20, -180), L(.35, .4, .35, 2)), L(0, 1, .75, 1)]],
    g: [[S(A(.4, 1.5, .4, .5, -15, -360), L(.8, 1.5, .8, 1), L(.8, 1, .8, 2.6), A(.4, 2.6, .4, .4, 0, 165))], [A(.4, 1.5, .4, .5, -15, -360), S(L(.8, 1, .8, 2.6), A(.4, 2.6, .4, .4, 0, 165))]],
    h: [[L(0, 0, 0, 2), S(L(0, 1.5, 0, 1.5), A(.4, 1.5, .4, .45, 180, 360), L(.8, 1.5, .8, 2))], [S(L(0, 0, 0, 2), L(0, 2, 0, 1.5), A(.4, 1.5, .4, .45, 180, 360), L(.8, 1.5, .8, 2))]],
    i: [[L(.2, 1, .2, 2), D(.2, .55)], [L(.2, 1, .2, 2)]],
    j: [[S(L(.5, 1, .5, 2.6), A(.2, 2.6, .3, .4, 0, 165)), D(.5, .55)], [S(L(.5, 1, .5, 2.6), A(.2, 2.6, .3, .4, 0, 165))]],
    k: [[L(0, 0, 0, 2), S(L(.7, 1, 0, 1.6), L(0, 1.6, .75, 2))], [L(0, 0, 0, 2), L(.7, 1, .05, 1.6), L(.25, 1.45, .75, 2)]],
    l: [[L(.2, 0, .2, 2)]],
    m: [[S(L(0, 1, 0, 2), L(0, 2, 0, 1.4), A(.3, 1.4, .3, .4, 180, 360), L(.6, 1.4, .6, 2), L(.6, 2, .6, 1.4), A(.9, 1.4, .3, .4, 180, 360), L(1.2, 1.4, 1.2, 2))]],
    n: [[S(L(0, 1, 0, 2), L(0, 2, 0, 1.4), A(.4, 1.4, .4, .4, 180, 360), L(.8, 1.4, .8, 2))], [L(0, 1, 0, 2), S(A(.4, 1.4, .4, .4, 180, 360), L(.8, 1.4, .8, 2))]],
    o: [[A(.4, 1.5, .4, .5, -90, -450)], [A(.4, 1.5, .4, .5, -90, 270)]],
    p: [[L(0, 1, 0, 3), A(.4, 1.5, .4, .5, 180, 540)], [S(L(0, 3, 0, 1.1), A(.4, 1.5, .4, .5, -130, 210))]],
    q: [[S(A(.4, 1.5, .4, .5, -15, -360), L(.8, 1.5, .8, 1), L(.8, 1, .8, 3))], [A(.4, 1.5, .4, .5, -15, -360), L(.8, 1, .8, 3)]],
    r: [[S(L(0, 1, 0, 2), L(0, 2, 0, 1.5), A(.4, 1.5, .4, .45, 180, 300))], [L(0, 1, 0, 2), A(.4, 1.5, .4, .45, 180, 300)]],
    s: [[S(A(.4, 1.25, .35, .25, -25, -270), A(.4, 1.75, .4, .25, -90, 155))]],
    t: [[L(.35, .3, .35, 2), L(0, 1, .75, 1)], [S(L(.35, .3, .35, 1.8), A(.6, 1.8, .25, .2, 180, 60)), L(0, 1, .75, 1)]],
    u: [[S(L(0, 1, 0, 1.6), A(.4, 1.6, .4, .4, 180, 0), L(.8, 1.6, .8, 1), L(.8, 1, .8, 2))], [S(L(0, 1, 0, 1.6), A(.4, 1.6, .4, .4, 180, 0), L(.8, 1.6, .8, 1)), L(.8, 1, .8, 2)]],
    v: [[S(L(0, 1, .4, 2), L(.4, 2, .8, 1))]],
    w: [[S(L(0, 1, .3, 2), L(.3, 2, .6, 1.25), L(.6, 1.25, .9, 2), L(.9, 2, 1.2, 1))]],
    x: [[L(0, 1, .8, 2), L(.8, 1, 0, 2)]],
    y: [[L(0, 1, .45, 2), L(.9, 1, .2, 3)], [S(L(0, 1, .45, 2)), L(.9, 1, .25, 3)], [S(L(0, 1, 0, 1.6), A(.4, 1.6, .4, .4, 180, 0)), S(L(.8, 1, .8, 2.6), A(.4, 2.6, .4, .4, 0, 165))]],
    z: [[S(L(0, 1, .8, 1), L(.8, 1, 0, 2), L(0, 2, .8, 2))]]
  };
  var N = 40;
  function len(p) { var d = 0; for (var i = 1; i < p.length; i++) if (p[i][2] === p[i - 1][2]) d += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return d; }
  function flat(strokes) { var r = []; strokes.forEach(function (s, k) { s.forEach(function (q) { r.push([q[0], q[1], k]); }); }); return r; }
  function resample(p) {
    var I = len(p) / (N - 1), D = 0, out = [p[0].slice()], q = p.slice();
    for (var i = 1; i < q.length; i++) {
      if (q[i][2] !== q[i - 1][2]) continue;
      var d = Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]);
      if (D + d >= I && d > 0) { var t = (I - D) / d, n = [q[i - 1][0] + t * (q[i][0] - q[i - 1][0]), q[i - 1][1] + t * (q[i][1] - q[i - 1][1]), q[i][2]]; out.push(n); q.splice(i, 0, n); D = 0; }
      else D += d;
    }
    while (out.length < N) out.push(q[q.length - 1].slice());
    return out.slice(0, N);
  }
  function norm(p) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, cx = 0, cy = 0;
    p.forEach(function (q) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); });
    var s = Math.max(x1 - x0, y1 - y0) || 1;
    var r = p.map(function (q) { return [(q[0] - x0) / s, (q[1] - y0) / s]; });
    r.forEach(function (q) { cx += q[0]; cy += q[1]; }); cx /= r.length; cy /= r.length;
    return r.map(function (q) { return [q[0] - cx, q[1] - cy]; });
  }
  function cloud(a, b, st) {
    var n = a.length, m = [], sum = 0, i = st;
    for (var k = 0; k < n; k++) m.push(false);
    do {
      var md = 1e9, idx = -1;
      for (var j = 0; j < n; j++) if (!m[j]) { var d = Math.hypot(a[i][0] - b[j][0], a[i][1] - b[j][1]); if (d < md) { md = d; idx = j; } }
      m[idx] = true; sum += (1 - ((i - st + n) % n) / n) * md; i = (i + 1) % n;
    } while (i !== st);
    return sum;
  }
  function pdist(a, b) { var step = Math.floor(Math.pow(a.length, .5)), best = 1e9; for (var i = 0; i < a.length; i += step) best = Math.min(best, cloud(a, b, i), cloud(b, a, i)); return best; }
  function box(strokes) { var y0 = 1e9, y1 = -1e9, x0 = 1e9, x1 = -1e9; strokes.forEach(function (s) { s.forEach(function (q) { y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); }); }); return { t: y0, b: y1, w: x1 - x0, h: y1 - y0 }; }
  /* 大字的點（i、j 的點）不算進高度 */
  function body(strokes) { var b = box(strokes); return strokes.length > 1 ? box(strokes.filter(function (s) { var q = box([s]); return q.h + q.w > .25 * (b.h || 1); })) : b; }
  var TP = [];
  Object.keys(T).forEach(function (ch) { T[ch].forEach(function (st) { var bb = body(st); TP.push({ ch: ch, p: norm(resample(flat(st))), t: bb.t, b: bb.b }); }); });
  /* strokes：[[x,y],…] 的陣列（四線格單位）。回傳 [{ch, d}] 由像到不像 */
  function rank(strokes, noPos) {
    strokes = strokes.filter(function (s) { return s.length > 0; });
    if (!strokes.length) return [];
    var f = flat(strokes.map(function (s) { return s.length === 1 ? [s[0], [s[0][0], s[0][1] + .02]] : s; }));
    if (len(f) < .15) return [];
    var p = norm(resample(f)), bb = body(strokes), best = {};
    TP.forEach(function (t) {
      var pos = noPos ? 0 : Math.abs(bb.t - t.t) + Math.abs(bb.b - t.b);
      var d = pdist(p, t.p) + 1.2 * pos;
      if (!(t.ch in best) || d < best[t.ch]) best[t.ch] = d;
    });
    return Object.keys(best).map(function (k) { return { ch: k, d: best[k] }; }).sort(function (a, b) { return a.d - b.d; });
  }
  /* 對不對：第一名 ＝ 要寫的字 ➜ 對；寫成另一個大小寫（g 寫成 G）一定錯；
     第一名是別的字但「要寫的字」幾乎一樣像（差不到 12%）➜ 也算對（小朋友寫得歪一點，不冤枉） */
  /* noPos ＝ 只看 形狀、不看 寫在 哪一條 線（2026-10-25：形狀 對 但是 沒有 頂天立地 ➜ 告訴 學生 是 線 的 問題）*/
  function judge(strokes, want, noPos) {
    var r = rank(strokes, noPos); if (!r.length) return { ok: false, got: '', r: r };
    var top = r[0], mine = null;
    r.forEach(function (x) { if (x.ch === want) mine = x; });
    var partner = want === want.toUpperCase() ? want.toLowerCase() : want.toUpperCase();
    var ok = top.ch === want || (mine && (noPos || top.ch !== partner) && mine.d <= top.d * 1.12);
    return { ok: !!ok, got: ok ? want : top.ch, r: r.slice(0, 4) };
  }
  /* ══ 頂天立地、不超線（2026-10-25 第二十五次 老師第 4、5 點）══
     字母的最高點、最低點、中間的部分（g 的圓圈上下、b d p q 的圓圈、h n m r 的拱、k 的手、t f 的橫線…）都要碰到線，而且不可以超出線。
     做法：從標準寫法（T）自動找出「碰到線」的點（曲線碰到線的最高／最低點、筆畫的頭尾剛好在線上；直直穿過去的不算），
     學生的字左右照比例對齊（左右寬窄、寫在格子的哪裡都沒關係），上下不動（看真的寫在哪一條線）：每一個碰線點附近，學生的筆畫要碰到同一條線（差 TOL 以內）；
     最高點、最低點不可以超過標準寫法外面的那兩條線。 */
  var TOL = .13, LN = ['最上面的線', '中間的線', '紅線（底線）', '最下面的線'];
  function contacts(st) { var o = [];
    st.forEach(function (s) { for (var i = 0; i < s.length; i++) { var p = s[i], a = s[i - 1], b = s[i + 1];
      for (var L = 0; L < 4; L++) if (Math.abs(p[1] - L) <= .06) { var ext = !a || !b || (p[1] <= a[1] + 1e-9 && p[1] <= b[1] + 1e-9) || (p[1] >= a[1] - 1e-9 && p[1] >= b[1] - 1e-9);
        if (ext && !o.some(function (q) { return q[1] === L && Math.abs(q[0] - p[0]) < .25; })) o.push([p[0], L]); } } });
    return o; }
  function xbox(strokes) { var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; strokes.forEach(function (s) { s.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }); }); return { x0: x0, x1: x1, y0: y0, y1: y1 }; }
  function lineOne(strokes, st) { var C = contacts(st), tb = xbox(st), sb = xbox(strokes), tw = Math.max(.05, tb.x1 - tb.x0), sw = sb.x1 - sb.x0, P = [], miss = [], over = [];
    strokes.forEach(function (s) { for (var i = 0; i < s.length; i++) { P.push(s[i]); var n = s[i + 1]; if (n) { var d = Math.hypot(n[0] - s[i][0], n[1] - s[i][1]), k = Math.ceil(d / .04); for (var j = 1; j < k; j++) P.push([s[i][0] + (n[0] - s[i][0]) * j / k, s[i][1] + (n[1] - s[i][1]) * j / k]); } } });
    var mx = function (x) { return sw < .05 ? (tb.x0 + tb.x1) / 2 : tb.x0 + (x - sb.x0) / sw * tw; }, wx = Math.max(.18, tw * .2);
    C.forEach(function (c) { var best = 9; P.forEach(function (q) { if (Math.abs(mx(q[0]) - c[0]) <= wx && Math.abs(q[1] - c[1]) <= .55) best = Math.min(best, Math.abs(q[1] - c[1])); });
      if (best > TOL) miss.push({ x: c[0], L: c[1], d: best }); });
    var top = Math.floor(tb.y0 + .06), bot = Math.ceil(tb.y1 - .06);
    if (sb.y0 < top - TOL) over.push({ L: top, d: top - sb.y0 }); if (sb.y1 > bot + TOL) over.push({ L: bot, d: sb.y1 - bot });
    return { ok: !miss.length && !over.length, miss: miss, over: over, C: C, map: { tx0: tb.x0, tw: tw, sx0: sb.x0, sw: sw } }; }
  /* 要寫 want：每一種標準寫法都試，挑問題最少的那一種。words ＝ 給小朋友看的一句話 */
  function lines(strokes, want) { strokes = (strokes || []).filter(function (s) { return s.length > 0; }); if (!strokes.length || !T[want]) return { ok: false, miss: [], over: [], words: '' };
    var best = null; T[want].forEach(function (st) { var r = lineOne(strokes, st), k = r.miss.length + r.over.length; if (!best || k < best.k) { best = r; best.k = k; } });
    var ms = [], os = []; best.miss.forEach(function (m) { if (ms.indexOf(LN[m.L]) < 0) ms.push(LN[m.L]); }); best.over.forEach(function (m) { if (os.indexOf(LN[m.L]) < 0) os.push(LN[m.L]); });
    best.words = (ms.length ? '沒有 碰到 ' + ms.join('、') : '') + (ms.length && os.length ? '；' : '') + (os.length ? '超出 ' + os.join('、') : ''); return best; }
  return { T: T, rank: rank, judge: judge, body: body, lines: lines, contacts: contacts, TOL: TOL, LN: LN };
};
var HW = HWSRC();
module.exports = { HW: HW, js: 'var HW=(' + HWSRC.toString() + ')();' };
