/* vs/_vs.js — ⚔️ 左右 對戰 平板（2026-11-14 第五十四次；規格 vs/CLAUDE.md）
 * 兩人 一台 iPad：左半 ＝ 坐 左邊 的 人、右半 ＝ 坐 右邊 的 人。一回合 兩邊 同時 出 題，兩個 人 都 答完（或 15 秒 到）才 一起 公布。
 * 模式（老師 大螢幕 選，rooms/0班/cr 的 vm）：e 戊 各自 闖關 PK（同 句型、只 換 一個 字、正確 答案 不一樣）／b 乙 同 一題 選項 位置 不同／c 丙 乙＋防抄（按了 只 顯示 🔒）。
 * 分數：💯 正確率 ＝ 答對 ÷ 答了；⚡ 遊戲 百分制 ＝ 每題 答錯 0、答對 600＋速度 最多 300＋⚡ 比 對方 先 答對 100 ➜ 總分 ÷（題數 ✕ 1000）✕ 100。
 * 換 字 再 考：答錯 的 句型，隔 至少 1 回合 換 一個 字 再 考 一次（🔁），答對 ＝ ✨ 學會 了（成績 fix）。
 * 📈 進步：跟「最近 3 次 的 平均」比（伺服器 view 的 set.h；還沒 部署 ＝ 這台 平板 記 的）。
 * 測試 開關：window.__VSLIVE（假 資料庫）、__VSFAST（時間 變短）。只 用 iOS 14 Safari 看得懂 的 寫法（沒有 ?.、??）。 */
var VS = (function () {
  var T = window.__VSFAST ? 4000 : 15000;               /* 一題 15 秒（第五十五次 第 4 點：老師 大螢幕 先 選 10／12／15／20 秒 ＝ cfg.qs）*/
  var TOPIC = null;   /* 第五十五次 第 7 點：任何 一個 主題（vs/t/年級_主題.js）；null ＝ ⚔️ 左右 對戰 專用 題 */
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var shuf = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var LS = { g: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, s: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  /* 第五十五次 第 1～3 點：刪「戊」「丙」「・防抄」；乙（同 一題・位置 不同）刪除 ➜ 舊 的 b 當 c */
  var MODE = { e: '🎯 各自 闖關 PK', c: '🔒 同 一題' };
  var S = null;    /* 這一場 */
  var CRP = null;  /* {room, t} */
  var gr = function () { return CRP ? +String(CRP.room).charAt(1) : 3; };
  var setKey = function () { return 'g' + gr() + 'gm_vs-' + (TOPIC ? TOPIC.k : 'q1'); };
  var BK = function () { return TOPIC ? TOPIC.B : VSBANK[gr()]; };
  var A0 = function (i) { var q = BK()[i]; return (q.ot || q.o)[0]; };   /* 正確 答案（比較 用）*/
  var OT = function (q, j) { return (q.ot || q.o)[j]; };
  var DB = function () { return window.__VSLIVE || (typeof LDB !== 'undefined' && LDB.on && LDB.on() ? LDB : null); };
  var seat = function (id) { return id ? String(id).slice(0, 3) + ' 班 ' + (+String(id).slice(3)) + ' 號' : ''; };

  /* ── 聲音：預錄 語音（VSAUD：英文 ➜ [檔案, 秒]）；一次 唸 一句，唸到 哪 亮到 哪；平板 擋 聲音 也 不會 卡住（安全 計時）── */
  var AU = null, AUtok = 0;
  function akey(s) { return String(s).replace(/[’]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase(); }
  function say(text, spans, cb, au) {
    var a = au ? [au, Math.max(1, String(text).split(/\s+/).length * .42)] : VSAUD[akey(text)], my = ++AUtok, done = false, fin = function () { if (done) return; done = true; clearInterval(iv); spans.forEach(function (x) { x.classList.remove('rd'); }); if (my === AUtok) cb(); };
    if (window.__VSMUTE || !a) { setTimeout(fin, window.__VSFAST ? 80 : 900); return; }
    var dur = Math.max(.6, +a[1] || 1.2), t0 = Date.now(), iv = setInterval(function () {
      var k = Math.min(spans.length - 1, Math.floor((Date.now() - t0) / 1000 / dur * spans.length));
      spans.forEach(function (x, i) { x.classList.toggle('rd', i === k); });
    }, 90);
    try { if (!AU) AU = new Audio(); AU.onended = function () { setTimeout(fin, 150); }; AU.onloadedmetadata = function () { if (AU.duration > 0 && isFinite(AU.duration)) dur = AU.duration; }; AU.src = a[0]; var p = AU.play(); if (p && p.catch) p.catch(function () { }); } catch (e) { }
    setTimeout(fin, dur * 1000 + 1200);   /* 平板 擋 聲音 ＝ 照樣 往下 走 */
  }
  function stopSay() { AUtok++; try { if (AU) AU.pause(); } catch (e) { } }

  /* ── 出題 ── */
  function famBag() { var F = {}; BK().forEach(function (q, i) { (F[q.f] = F[q.f] || []).push(i); }); return F; }
  function pickFam() {
    var P = S.side.map(function (sd, k) { return sd && sd.pend.filter(function (p) { return S.r - p.r >= 2; })[0]; });
    var p = P[0] || P[1]; if (p) return p.f;
    if (!S.bag.length) { S.bag = shuf(Object.keys(S.F)); if (S.bag[0] === S.lastF && S.bag.length > 1) S.bag.push(S.bag.shift()); }
    return S.bag.shift();
  }
  function pickItem(f, not, avoidAns) { var L = S.F[f].filter(function (i) { return not.indexOf(i) < 0 && (!avoidAns || A0(i) !== avoidAns); }); if (!L.length) L = S.F[f].filter(function (i) { return not.indexOf(i) < 0; }); if (!L.length) L = S.F[f]; return L[Math.floor(Math.random() * L.length)]; }
  function derange(n, base) { for (var t = 0; t < 60; t++) { var p = shuf(base); if (p.every(function (v, i) { return v !== base[i]; })) return p; } return base.slice(1).concat(base[0]); }
  function round() {
    if (!S || S.over) return; S.r++; var f = pickFam(); S.lastF = f;
    var items = [null, null], rc = [false, false];
    [0, 1].forEach(function (k) { var sd = S.side[k]; if (!sd) return;
      var p = sd.pend.filter(function (x) { return x.f === f && S.r - x.r >= 2; })[0];
      if (p) { sd.pend.splice(sd.pend.indexOf(p), 1); rc[k] = true; items[k] = pickItem(f, [p.i].concat(items[1 - k] != null ? [items[1 - k]] : []), items[1 - k] != null ? A0(items[1 - k]) : null); } });
    if (S.vm === 'e') { [0, 1].forEach(function (k) { if (!S.side[k] || items[k] != null) return; var o = items[1 - k]; items[k] = pickItem(f, (o != null ? [o] : []).concat(S.side[k].seen.slice(-6)), o != null ? A0(o) : null); });
      if (items[0] != null && items[1] != null && A0(items[0]) === A0(items[1])) items[1] = pickItem(f, [items[0]], A0(items[0])); }
    else { var one = items[0] != null ? items[0] : items[1] != null ? items[1] : pickItem(f, S.side[0].seen.slice(-6)); items = [one, one]; }
    var nO = function (i) { return BK()[i].o.length; }, base = function (n) { var b = []; for (var j = 0; j < n; j++) b.push(j); return b; };
    var ordL = shuf(base(nO(items[0] != null ? items[0] : items[1]))), ordR = S.vm === 'e' ? shuf(base(nO(items[1] != null ? items[1] : items[0]))) : derange(ordL.length, ordL);
    S.cur = { f: f, t0: Date.now(), q: [0, 1].map(function (k) { return S.side[k] ? { i: items[k], ord: k ? ordR : ordL, pick: null, ms: null, rc: rc[k] } : null; }) };
    [0, 1].forEach(function (k) { if (S.side[k]) S.side[k].seen.push(items[k]); draw(k); });
    scores();
    clearInterval(S.tk); S.tk = setInterval(tick, 100); tick();
  }
  function tick() { if (!S || !S.cur || S.cur.rev) return; var l = Math.max(0, T - (Date.now() - S.cur.t0)); [0, 1].forEach(function (k) { var b = $('#h' + k + ' .vtb i'); if (b) b.style.width = (l / T * 100) + '%'; });
    var sc = $('#vsec'); if (sc) sc.textContent = Math.ceil(l / 1000); if (l <= 0) reveal(); }
  function draw(k) {
    var h = $('#h' + k), sd = S.side[k]; if (!sd) { h.innerHTML = '<div class="vsolo">🙋 這 一邊 沒有 人<br><small>（一個 人 練習）</small></div>'; h.className = 'vh off'; return; }
    var c = S.cur.q[k], q = BK()[c.i];
    h.className = 'vh'; h.innerHTML = '<div class="vtb"><i></i></div>' + (q.cue || q.cuet ? '' : '') + (c.rc ? '<div class="vrc">🔁 再 挑戰：剛剛 錯 的 句型</div>' : '') +
      (q.cue || q.cuet ? '<div class="vcue"><span class="vce">' + esc(q.cue) + '</span>' + (q.cuet ? '<span class="vct en">' + esc(q.cuet) + '</span>' : '') + '</div>' : '') +
      '<div class="vq en">' + (q.html ? q.q : esc(q.q)).replace('___', '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>') + '</div>' +
      '<div class="vo">' + c.ord.map(function (oi, j) { return '<button class="vb en" data-s="' + k + '" data-o="' + oi + '"><em>' + 'ABCD'.charAt(j) + '</em>' + (q.html ? q.o[oi] : esc(q.o[oi])) + '<i class="vlk">🔒</i></button>'; }).join('') + '</div>' +
      '<div class="vst" id="vst' + k + '">👆 選 一個 答案</div>';
  }
  function tap(k, oi) {
    if (!S || !S.cur || S.cur.rev) return; var c = S.cur.q[k]; if (!c || c.pick != null) return;
    c.pick = oi; c.ms = Date.now() - S.cur.t0; var ok = oi === 0, b = $('#h' + k + ' [data-o="' + oi + '"]');
    [].forEach.call(document.querySelectorAll('#h' + k + ' .vb'), function (x) { x.disabled = true; x.classList.add('dim'); });
    if (S.vm === 'b') { b.classList.remove('dim'); b.classList.add(ok ? 'ok' : 'no'); $('#vst' + k).innerHTML = ok ? '✅ 答對 了！等 對方…' : '❌ 答錯 了，等 對方…'; }
    else { b.classList.remove('dim'); b.classList.add('lock'); $('#vst' + k).innerHTML = '🔒 已 作答（對方 看不到 你 選 什麼）'; }   /* 第五十五次 第 1 點：按了 ＝ 那一格 出現 大大 的 🔒（不 變色）*/
    if (ok && !S.cur.first) S.cur.first = k + 1;
    if (S.cur.q.every(function (x) { return !x || x.pick != null; })) setTimeout(reveal, 250);
  }
  function pts(k) { var c = S.cur.q[k]; if (!c || c.pick !== 0) return 0; var p = 600 + Math.round(300 * Math.max(0, T - c.ms) / T);
    if (S.side[1 - k] ? S.cur.first === k + 1 : c.ms <= T / 3) p += 100; return p; }
  function reveal() {
    if (!S || !S.cur || S.cur.rev) return; S.cur.rev = 1; clearInterval(S.tk);
    var seq = [];
    [0, 1].forEach(function (k) { var sd = S.side[k], c = S.cur.q[k]; if (!sd) return; var q = BK()[c.i], ok = c.pick === 0, p = pts(k);
      sd.n++; if (ok) sd.ok++; sd.pt += p; if (c.rc && ok) sd.lr++;
      if (!ok) sd.pend.push({ f: S.cur.f, i: c.i, r: S.r });
      sd.Q.push([ok ? 1 : 0, c.pick == null ? -1 : c.pick, Math.round((c.ms == null ? T : c.ms) / 100) / 10, c.ms != null && c.ms < 1000 ? 1 : 0, ok ? Math.round(Math.max(0, T - c.ms) / T * 1000) / 1000 : 0, q.i != null ? q.i : c.i]);
      fb(k, q, c, ok, p); seq.push([k, q, ok]); });
    pub(); scores();
    var go = function (i) { if (!S || S.over) return; if (i >= seq.length) { setTimeout(round, window.__VSFAST ? 100 : 900); return; }
      var k = seq[i][0], q = seq[i][1], n = seq[i][2] ? 1 : 2, sp = [].slice.call(document.querySelectorAll('#h' + k + ' .vgl .w'));
      document.querySelectorAll('.vh').forEach(function (x) { x.classList.toggle('talk', x.id === 'h' + k); });
      var rep = function (j) { if (j >= n) { go(i + 1); return; } say(q.say, sp, function () { setTimeout(function () { rep(j + 1); }, 300); }, q.au); }; rep(0); };
    setTimeout(function () { go(0); }, 500);
  }
  /* 答對頁／答錯頁（🔒 永久 原則 10：逐字 中文、整句 中文 詞 空 一格、唸到 哪 亮到 哪；答錯 唸 兩次、答對 唸 一次）*/
  function fb(k, q, c, ok, p) {
    var gl = '<div class="vgl en">' + q.ag.map(function (x) { return '<span class="w"><b>' + esc(x[0]) + '</b><small class="keepsp">' + esc(x[1]) + '</small></span>'; }).join('') + '</div><div class="vaz keepsp">' + esc(q.az) + '</div>';
    var h = $('#h' + k);
    h.className = 'vh fb ' + (ok ? 'good' : 'bad');
    h.innerHTML = ok ? '<div class="vfh">✅ 答對 了！<b>＋' + p + '</b>' + (S.cur.first === k + 1 && S.side[1 - k] ? '<i>⚡ 搶先！</i>' : '') + (c.rc ? '<i>✨ 學會 了！</i>' : '') + '</div>' + gl
      : '<div class="vfh">' + (c.pick == null ? '⏰ 時間 到' : '❌ 再 想 一下') + '</div>' +
        (c.pick != null ? '<div class="vme en"><span>你 選 的</span><s>' + (q.html ? q.o[c.pick] : esc(q.o[c.pick])) + '</s></div>' + (q.h[c.pick] ? '<div class="vwhy">💡 ' + esc(q.h[c.pick]) + '</div>' : '') : '') +
        '<div class="vok">✅ 正確 答案</div>' + gl + '<div class="vnext">🔁 等一下 會 換 一個 字 再 考 一次</div>';
  }
  function scores() { [0, 1].forEach(function (k) { var sd = S.side[k], e = $('#vp' + k); if (!e) return; if (!sd) { e.innerHTML = ''; return; }
    e.innerHTML = '<b>' + (k ? '👉 ' : '👈 ') + esc(seat(sd.id)) + '</b><span>💯 ' + acc(sd) + '</span><span>⚡ ' + gp(sd) + '</span>'; });
    var r = $('#vrnd'); if (r) r.textContent = '第 ' + S.r + ' 題'; }
  function acc(sd) { return sd.n ? Math.round(sd.ok / sd.n * 1000) / 10 : 0; }
  function gp(sd) { return sd.n ? Math.round(sd.pt / (sd.n * 1000) * 1000) / 10 : 0; }
  /* 大螢幕 即時 排行榜：crp/5碼（一個 人 一行；兩 人 一台 也 各 算 各 的，不 寫 搭檔 ＝ 不 是 一組）*/
  function pub() { var D = DB(); if (!D || !CRP) return; S.side.forEach(function (sd) { if (!sd) return;
    var o = { n: sd.n, ok: sd.ok, s: acc(sd), gp: gp(sd), lr: sd.lr, g: 'vs' }; if (sd.b) { o.b0 = sd.b[0]; o.b1 = sd.b[1]; }
    if (typeof XLV !== 'undefined' && D === LDB) XLV.prog(CRP.room, CRP.t, sd.id, o); else D.set('rooms/' + CRP.room + '/crp/' + sd.id, Object.assign(o, { t: CRP.t })); }); }

  /* ── 📈 跟 自己 比：最近 3 次 的 平均 ── */
  function base(id, cb) { var loc = LS.g('vs_h_' + id, []), done = false, fin = function (h) { if (done) return; done = true; var L = (h && h.length ? h : loc).slice(-3); cb(L.length ? [avg(L, 0), avg(L, 1)] : null); };
    if (typeof scFetch !== 'function' || typeof SCURL === 'undefined' || !SCURL) { fin(null); return; }
    setTimeout(function () { fin(null); }, 5000);
    scFetch('a=view&id=' + id + '&set=' + encodeURIComponent(setKey()), null, 5000).then(function (j) { fin(j && j.set && j.set.h); }, function () { fin(null); }); }
  function avg(L, i) { var s = 0; L.forEach(function (x) { s += +x[i] || 0; }); return Math.round(s / L.length * 10) / 10; }

  /* ── 送 成績（兩 個 人 各 一筆）── */
  function send() { if (!S || S.sent) return false; S.sent = 1; var any = false;
    S.side.forEach(function (sd) { if (!sd || !sd.Q.length) return; any = true;
      LS.s('vs_h_' + sd.id, LS.g('vs_h_' + sd.id, []).concat([[acc(sd), gp(sd)]]).slice(-10));
      try { if (typeof scQAdd === 'function' && typeof SCON !== 'undefined' && SCON) scQAdd({ id: sd.id, set: setKey(), name: '⚔️ 左右 對戰｜' + (TOPIC ? TOPIC.nm : '⚔️ 左右 對戰 專用題') + '｜' + MODE[S.vm], m: 'q', qs: sd.Q, raw: gp(sd), fix: sd.lr, mp: 0, mw: 0,
        sec: Math.round((Date.now() - S.t0) / 1000), src: 'school', dev: typeof SCDEV !== 'undefined' ? SCDEV : '', lc: 1, u: sd.id + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), t: Date.now() }); } catch (e) { }
      if (window.__VSREC) window.__VSREC.push({ id: sd.id, set: setKey(), n: sd.Q.length, raw: gp(sd), fix: sd.lr }); });
    return any; }
  function endView(msg) { if (!S) return; S.over = 1; clearInterval(S.tk); stopSay();
    var who = S.side.filter(Boolean), win = who.length === 2 ? (gp(who[0]) === gp(who[1]) ? -1 : gp(who[0]) > gp(who[1]) ? 0 : 1) : null;
    [0, 1].forEach(function (k) { var sd = S.side[k], h = $('#h' + k); if (!sd) { h.innerHTML = ''; h.className = 'vh off'; return; }
      var pr = sd.b && sd.n >= 5 ? Math.round(((acc(sd) - sd.b[0]) + (gp(sd) - sd.b[1])) / 2 * 10) / 10 : null;
      h.className = 'vh endh'; h.innerHTML = '<div class="vet">' + (win === k ? '🏆 這 一場 PK 你 贏 了！' : win === -1 ? '🤝 平手！' : '🏁 完成！') + '</div>' +
        '<div class="vee"><span>💯 正確率</span><b>' + acc(sd) + '</b><small>答 ' + sd.n + ' 題・答對 ' + sd.ok + ' 題</small></div>' +
        '<div class="vee"><span>⚡ 正確＋速度</span><b>' + gp(sd) + '</b></div>' +
        '<div class="vee"><span>✨ 學會 了</span><b>' + sd.lr + '</b><small>錯 了 以後 換 字 再 考 答對</small></div>' +
        '<div class="vee"><span>📈 跟 最近 的 自己 比</span><b>' + (pr == null ? '—' : (pr > 0 ? '＋' : '') + pr) + '</b><small>' + (sd.b ? (sd.n < 5 ? '答 滿 5 題 才 比' : pr > 0 ? '你 比 自己 更 強 了！' : '下 一次 再 超越 自己！') : '第一次，下 一次 開始 跟 自己 比') + '</small></div>'; });
    var o = $('#vmsg'); o.innerHTML = msg || ''; o.hidden = !msg; }

  /* ── 登入：左 ➜ 右（自己 的 5 碼＋密碼；一樣 的 號碼 不行；要 是 這 一班）── */
  function cover(t, sub, btn) { var o = $('#vcv'); o.innerHTML = '<div class="vci">' + t + '</div>' + (sub ? '<div class="vcs">' + sub + '</div>' : '') + (btn || ''); o.hidden = false; }
  function login(after) {
    var room = CRP.room, cls = String(room).slice(1);
    var need = function (cb) { if (typeof SCON === 'undefined' || !SCON || typeof scLogin !== 'function') { cb(window.__VSID || null); return; } scLogin(function () { if (SCH && SCH.close) SCH.close(); cb(SCID); }); };
    var A = null;
    var stepA = function () { cover('👈 坐 <b>左邊</b> 的 人 先 登入', '打 自己 的 班級號碼', '<button id="vgoA" class="vbig">🔑 左邊 登入</button>'); };
    var stepB = function () { cover('👉 換 坐 <b>右邊</b> 的 人 登入', '左邊：' + esc(seat(A)) + ' ✅', '<button id="vgoB" class="vbig">🔑 右邊 登入</button><button id="vsolo" class="vghost">🙋 今天 只有 我 一個 人</button>'); };
    document.addEventListener('click', function h(e) { var t = e.target.closest && e.target.closest('#vgoA,#vgoB,#vsolo'); if (!t) return;
      if (t.id === 'vgoA') { need(function (id) { if (!id) { stepA(); return; } if (String(id).slice(0, 3) !== cls) { cover('⚠️ 這 是 ' + esc(cls) + ' 班 的 對戰', '請 打 自己 的 號碼（' + esc(seat(id)) + ' 不是 這 一班）', '<button id="vgoA" class="vbig">🔑 再 登入 一次</button>'); return; } A = id; stepB(); }); }
      else if (t.id === 'vgoB') { need(function (id) { if (typeof SCID !== 'undefined') SCID = A; if (!id || id === A) { cover('⚠️ 兩個 人 要 不一樣', '右邊 的 人 請 打 <b>自己</b> 的 號碼', '<button id="vgoB" class="vbig">🔑 右邊 登入</button><button id="vsolo" class="vghost">🙋 今天 只有 我 一個 人</button>'); return; }
        if (String(id).slice(0, 3) !== cls) { cover('⚠️ 這 是 ' + esc(cls) + ' 班 的 對戰', esc(seat(id)) + ' 不是 這 一班', '<button id="vgoB" class="vbig">🔑 右邊 登入</button>'); return; }
        document.removeEventListener('click', h); after(A, id); }); }
      else { document.removeEventListener('click', h); after(A, null); } });
    if (window.__VSIDS) { var P = window.__VSIDS; setTimeout(function () { after(P[0], P[1] || null); }, 10); return; }
    stepA(); }
  function intro(vm, done) {
    var L = [['👈👉', '左半邊 ＝ 坐 <b>左邊</b> 的 人；右半邊 ＝ 坐 <b>右邊</b> 的 人'],
      vm === 'e' ? ['🎯', '兩邊 的 題目 <b>不一樣</b>' + (TOPIC ? '、正確 答案 也 不一樣' : '（只 換 一個 字）') + ' ➜ 偷看 沒有 用'] : ['🔒', '同 一題、選項 位置 不一樣；按了 只 顯示 🔒，兩個 人 都 答完 才 公布'],
      ['⏱', '一題 <b>' + Math.round(T / 1000) + ' 秒</b>' + (TOPIC ? '・主題：' + TOPIC.nm : '')],
      ['🏆', '💯 正確率 ＋ ⚡ 答對 又 快 分數 高（答錯 0 分）'],
      ['🔁', '答錯 的 句型 等一下 換 一個 字 再 考 ➜ 答對 ＝ ✨ 學會 了'],
      ['📈', '排行榜 只 比 <b>自己</b>：跟 最近 的 自己 比，進步 最多 的 上 大螢幕']];
    cover('<span class="vih">⚔️ 左右 對戰：' + MODE[vm] + '</span>', '<ol class="vil">' + L.map(function (x) { return '<li><i>' + x[0] + '</i><span>' + x[1] + '</span></li>'; }).join('') + '</ol>', '<button id="vok" class="vbig" disabled>✅ 我們 懂 了，開始！</button>');
    var b = $('#vok'); setTimeout(function () { b.disabled = false; }, window.__VSFAST ? 50 : 3000);
    b.onclick = function () { if (b.disabled) return; $('#vcv').hidden = true; done(); };
  }
  function begin(vm, A, B) {
    var mk = function (id) { return id ? { id: id, n: 0, ok: 0, pt: 0, lr: 0, Q: [], pend: [], seen: [], b: null } : null; };
    S = { vm: vm, side: [mk(A), mk(B)], r: 0, F: famBag(), bag: [], t0: Date.now(), over: 0 };
    S.side.forEach(function (sd) { if (sd) base(sd.id, function (b) { sd.b = b; }); });
    document.body.classList.add('playing'); $('#vmode').textContent = MODE[vm] + (TOPIC ? '・' + TOPIC.nm : '') + '・' + Math.round(T / 1000) + ' 秒';
    intro(vm, function () { S.t0 = Date.now(); scores(); pub(); round(); });
  }
  /* ── 現場任務：rooms/0班/cr（set 'vs'）── */
  function crOn(v) { if (typeof XLV !== 'undefined') try { XLV.cfg(v); } catch (e) { }
    if (!v || !v.on || v.set !== 'vs' || Date.now() - (+v.t || 0) > 4 * 36e5) { if (S && !S.over) { send(); endView('✅ 老師 結束 了，成績 送 給 老師 了。<br>👀 請 看 大螢幕'); } else if (!S) cover('⏳ 等 老師 開始 ⚔️ 左右 對戰…'); return; }
    if (v.t !== CRP.t) { CRP.t = v.t; CRP.vm = v.vm === 'e' ? 'e' : 'c'; if (S && !S.over) { send(); } S = null;
      T = window.__VSFAST ? 4000 : Math.max(5, Math.min(60, +v.qs || 15)) * 1000;
      loadTopic(v.tp || '', function () { login(function (A, B) { begin(CRP.vm, A, B); }); }); } }
  /* 主題 題目：vs/t/年級_主題.js ➜ VST(資料)；載入 失敗 ＝ 用 專用 題 */
  function loadTopic(tp, cb) { TOPIC = null; if (!tp) { cb(); return; } var done = false, fin = function () { if (done) return; done = true; cb(); };
    window.VST = function (d) { TOPIC = { k: d.k, nm: d.nm, B: d.qs.map(function (q) { return { f: 't', html: 1, cue: '', q: q.t, o: q.o, ot: q.ot, h: q.h, ag: q.ag, az: q.az, say: q.ae, au: q.au, i: q.i }; }) }; fin(); };
    cover('⏳ 載入 題目…'); var sc = document.createElement('script'); sc.src = 't/' + gr() + '_' + tp + '.js'; sc.onerror = fin; document.head.appendChild(sc); setTimeout(fin, 8000); }
  function init() {
    document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.vb'); if (b) tap(+b.getAttribute('data-s'), +b.getAttribute('data-o')); });
    var m = /[?&]live=(\d{4})/.exec(location.search); if (!m) { cover('⚔️ 左右 對戰 只 在〔⚡ 現場任務〕開', '請 從 現場任務 進來', '<a class="vbig" href="../live/index.html">⚡ 去 現場任務</a>'); return; }
    CRP = { room: m[1], t: 0 }; var D = DB(); if (!D) { cover('📶 現場任務 還沒 開'); return; }
    cover('⏳ 等 老師 開始 ⚔️ 左右 對戰…'); D.poll('rooms/' + CRP.room + '/cr', 900, crOn); }
  window.xForce = function () { if (!S || S.over) return false; var did = send(); endView('⏰ 時間 到！成績 送 給 老師 了。<br>👀 請 看 大螢幕：排行榜 和 頒獎 典禮'); return did; };
  return { init: init, tap: tap, st: function () { return S; }, bk: function () { return BK(); }, T: function () { return T; }, topic: function () { return TOPIC && TOPIC.k; }, _round: round, _reveal: reveal };
})();
