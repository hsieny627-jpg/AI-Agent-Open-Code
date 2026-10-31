/* g3mid/_rva.js — 🎬 秒懂 複習 動畫 ＋ ⚡ 隨時 突擊 測驗（2026-10-31 老師 第三十六次 第 1 點；三、四年級 共用）
 *
 * 25 題／50 題 挑戰、新 25／新 50、🏠 25 題 闖關：每 換 一關（一個 題型）先 演 這個 題型 的 秒懂 複習 動畫：
 *   ① 開場 一頁：👀 專心 看 ➜ ⚡ 動畫 會 隨時 跳出 突擊 測驗 ➜ ✅ 答對 答錯 都 列入 成績
 *   ② 一頁 一個 重點：圖 ➜ 英文 一個 字 一個 字 跳出來（每個 字 正下方 中文）➜ 唸 第 1 次（唸到 哪 個 字 那個 字 放大 變亮）
 *      ➜ 最下面 整句 中文＋💡 一句 重點 ➜ 唸 第 2 次 ➜ 下一頁
 *   ③ ⚡ 突擊 測驗（每 一部 3 題）：隨機 插 在「這一頁 唸完 第 1 次」或「唸完 第 2 次」後面；考 這一頁 或 前面 頁 的 重點（題目 的 at ＝ 最早 第幾頁 以後 才 可以 考）
 *      同 一個 學生 再 看 一次 ＝ 先 出 還沒 考過 的 題目（rva_年級_題型_5碼）➜ 每 一次 都 不一樣
 *      題型：mc 四選一、hear 聽 了 選、tf 對 或 錯、dec 中文 方塊 放到 英文 字 下面、ord 排 句子、spot 找 錯 的 字
 *      答對 ＝ 綠光＋唸 一次 正確 答案；答錯／時間 到 ＝ 綠底 答錯頁（你 的 答案、正確 答案 逐字 中文、整句、💡、唸 3 次 唸到 哪 亮到 哪、〔🔊 再聽一次〕）
 *   ④ 下面 一排〔⏸️ 暫停〕〔🐢 放慢〕〔🔁 再一次〕（測驗 的 時候 收起來）
 *   ⑤ 看完：答對 幾題 ➜ 送 成績（A.send：題組 g3gm_g3m-rv／g4gm_mt-rv，每題 [對, 選 第幾個, 秒, 秒按, 0, 題庫 第幾題]）
 * 頁面 要 先 給 RVA.A = { aud(text, v) ➜ 語音檔 網址｜null, sid() ➜ 5 碼, gr ➜ 'g3'｜'g4', send(rows, spec, secs), stop() }
 * 只寫 ES5（用 toString 放進 網頁）。 */
function RVASRC() {
  var RVA = { A: null, S: null, N: 3, QT: 20 };
  function $id(i) { return document.getElementById(i); }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function ap(s) { return esc(String(s).replace(/'/g, '’')).replace(/’/g, '<span class="rvap">’</span>'); }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ── 計時（暫停 ＝ 全部 停住；放慢 ＝ 每一步 ✕1.5、聲音 0.75 倍）── */
  function T(fn, ms) { var S = RVA.S; if (!S) return; var my = S.gen, it = { fn: fn, ms: ms * (S.slow ? 1.5 : 1) };
    function run() { if (!RVA.S || RVA.S.gen !== my) return; var k = S.tm.indexOf(it); if (k >= 0) S.tm.splice(k, 1); fn(); }
    it.run = run; S.tm.push(it); if (!S.pause) { it.t0 = Date.now(); it.id = setTimeout(run, it.ms); } }
  function pauseAll() { var S = RVA.S; S.tm.forEach(function (it) { clearTimeout(it.id); it.ms = Math.max(0, it.ms - (Date.now() - (it.t0 || Date.now()))); }); }
  function resumeAll() { var S = RVA.S; S.tm.forEach(function (it) { it.t0 = Date.now(); it.id = setTimeout(it.run, it.ms); }); }

  /* ── 聲音：一個 播放器（iPad 第一次 碰 已經 解鎖）；唸到 哪 那一格 亮 ── */
  function el() { if (typeof decEl === 'function') return decEl(); if (!RVA.au) RVA.au = new Audio(); return RVA.au; }
  function stopAu() { var S = RVA.S; if (S) S.rid++; try { var a = el(); a.onended = null; a.onerror = null; a.pause(); } catch (e) { } try { speechSynthesis.cancel(); } catch (e) { } }
  /* text 一句；cells 要 亮 的 格子（照 字母 數 分 時間）；done 唸完 */
  function read(text, v, cells, done, rate) {
    var S = RVA.S; stopAu(); var my = S.rid, f = RVA.A.aud(text, v || ''), w = cells.map(function (c) { return Math.max(1, (c.getAttribute('data-w') || '').replace(/[^A-Za-z0-9]/g, '').length) + 1; }), tot = w.reduce(function (a, b) { return a + b; }, 0) || 1;
    function hl(r) { var acc = 0, k = -1; for (var i = 0; i < w.length; i++) { acc += w[i]; if (r * tot < acc) { k = i; break; } } cells.forEach(function (c, i) { c.classList.toggle('spk', i === k); }); }
    var fin = function () { if (!RVA.S || my !== RVA.S.rid) return; cells.forEach(function (c) { c.classList.remove('spk'); }); if (done) done(); };
    var est = function () { var s = performance.now(), D = Math.max(1200, tot * 95) * (S.slow ? 1.4 : 1); try { var u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = S.slow ? .6 : .82; speechSynthesis.speak(u); } catch (e) { }
      (function lp() { if (!RVA.S || my !== RVA.S.rid) return; if (S.pause) { s += 16; requestAnimationFrame(lp); return; } var r = (performance.now() - s) / D; if (r >= 1) { fin(); return; } hl(r); requestAnimationFrame(lp); })(); };
    if (!f) { est(); return; }
    var a = el(); try { a.pause(); } catch (e) { } a.onended = null; a.onerror = null; a.src = f; try { a.defaultPlaybackRate = a.playbackRate = rate || (S.slow ? .75 : 1); } catch (e) { }
    a.onended = function () { fin(); }; a.onerror = function () { est(); };
    (function lp() { if (!RVA.S || my !== RVA.S.rid) return; if (a.duration > 0 && !a.paused) hl(Math.min(.999, a.currentTime / a.duration)); requestAnimationFrame(lp); })();
    var p = a.play(); if (p && p.catch) p.catch(function (e) { if (!RVA.S || my !== RVA.S.rid || (e && e.name === 'AbortError')) return; est(); }); }

  /* ── 一排 英文 字（每個 字 正下方 中文）── */
  function row(t, cls) { var r = h('div', 'rvrow' + (cls ? ' ' + cls : '')); t.forEach(function (p) { var c = h('span', 'rvk' + (/^'/.test(p[0]) ? ' ct' : ''), '<b>' + ap(p[0]) + '</b><i>' + esc(p[1] || '　') + '</i>'); c.setAttribute('data-w', p[0]); r.appendChild(c); }); return r; }
  function fit(box) { if (!box) return; box.style.removeProperty('--rz'); var z = 1; for (var i = 0; i < 8 && (box.scrollHeight > box.clientHeight + 2 || box.scrollWidth > box.clientWidth + 2); i++) { z *= .9; box.style.setProperty('--rz', z.toFixed(3)); } }

  /* ══ 開始 ══ spec ＝ {id, ic, nm, sc:[…], qz:[…]}；done() ＝ 看完（或 跳過） */
  RVA.play = function (spec, done) {
    if (RVA.S) RVA.close();
    var o = $id('rva'); if (!o) { o = h('div', '', ''); o.id = 'rva'; document.body.appendChild(o); }
    var S = RVA.S = { spec: spec, done: done, i: -1, tm: [], gen: 1, rid: 0, pause: false, slow: false, rows: [], t0: Date.now(), plan: {}, nq: 0 };
    /* 這一次 要 考 的 3 題：先 出 這個 學生 還沒 考過 的（每 一次 都 不一樣）；題型 盡量 不 重複 */
    var key = 'rva_' + RVA.A.gr + '_' + spec.id + '_' + (RVA.A.sid() || '0'), seen = []; try { seen = JSON.parse(ls(key) || '[]'); } catch (e) { }
    var all = spec.qz.map(function (q, i) { return i; }), un = shuf(all.filter(function (i) { return seen.indexOf(i) < 0; }));
    if (un.length < RVA.N) { var last = seen.slice(-RVA.N); seen = []; un = un.concat(shuf(all.filter(function (i) { return un.indexOf(i) < 0 && last.indexOf(i) < 0; }))).concat(shuf(last)); }
    var pick = [], ty = {}; un.forEach(function (i) { if (pick.length < RVA.N && !ty[spec.qz[i].ty]) { pick.push(i); ty[spec.qz[i].ty] = 1; } }); un.forEach(function (i) { if (pick.length < RVA.N && pick.indexOf(i) < 0) pick.push(i); });
    S.key = key; S.seen = seen.concat(pick);
    /* 插 在 哪裡：第 i 頁 唸完 第 1 次（2i）或 第 2 次（2i＋1），而且 ≧ 題目 的 at */
    var nS = spec.sc.length, used = {};
    pick.sort(function (a, b) { return (spec.qz[b].at || 0) - (spec.qz[a].at || 0); }).forEach(function (qi) { var a = Math.min(nS - 1, spec.qz[qi].at || 0), c = [];
      for (var s = 2 * a; s < 2 * nS; s++) if (!used[s]) c.push(s); if (!c.length) for (s = 2 * nS - 1; s >= 0; s--) if (!used[s]) { c.push(s); break; }
      var sl = c[Math.floor(Math.random() * c.length)]; used[sl] = 1; S.plan[sl] = qi; });
    S.nq = pick.length;
    o.innerHTML = '<div class="rvw"><div class="rvtop"><span class="rvt">🎬 秒懂 複習：' + esc(spec.ic + ' ' + spec.nm) + '</span><span class="rvp" id="rvp"></span><span class="rvr">⚡ 突擊 測驗 <b id="rvn">0 ／ ' + S.nq + '</b></span></div>' +
      '<div class="rvst" id="rvs"></div><div class="rvc" id="rvc"><button data-rv="pause">⏸️ 暫停</button><button data-rv="slow">🐢 放慢</button><button data-rv="again">🔁 再一次</button></div></div>';
    o.classList.add('on'); document.body.classList.add('rvon'); intro(); };

  RVA.close = function () { var S = RVA.S; if (!S) return; S.gen++; S.tm.forEach(function (it) { clearTimeout(it.id); }); stopAu(); RVA.S = null; var o = $id('rva'); if (o) { o.classList.remove('on'); o.innerHTML = ''; } document.body.classList.remove('rvon'); };

  /* ① 開場：一句 一句 跳出來，2.6 秒 才 能 按 */
  function intro() { var S = RVA.S, st = $id('rvs'); $id('rvc').classList.add('hid');
    st.innerHTML = '<div class="rvin"><div class="rvi0">🎬</div><div class="rvi1">秒懂 複習 動畫：' + esc(S.spec.ic + ' ' + S.spec.nm) + '</div>' +
      '<div class="rvl"><span style="--d:.3s">👀 專心 看、專心 聽</span><span style="--d:1s">⚡ 動畫 會 <b>隨時</b> 跳出 突擊 測驗（' + S.nq + ' 題）</span><span style="--d:1.7s">✅ 答對、答錯 都 <b>列入 成績</b></span></div>' +
      '<button class="rvgo" id="rvgo" disabled>▶ 開始 看</button></div>';
    T(function () { var b = $id('rvgo'); if (b) { b.disabled = false; b.classList.add('rdy'); } }, 2600); }

  /* ② 一頁 一個 重點 */
  function scene(i) { var S = RVA.S, sp = S.spec, c = sp.sc[i]; S.i = i; S.part = 0; $id('rvc').classList.remove('hid');
    $id('rvp').textContent = '📍 ' + (i + 1) + ' ／ ' + sp.sc.length;
    var st = $id('rvs'); st.innerHTML = ''; var card = h('div', 'rvcard' + (c.t2 ? ' eq' : ''), '');
    card.appendChild(h('div', 'rvh', '<span>重點 ' + (i + 1) + '</span>' + esc(c.h)));
    if (c.pic) card.appendChild(h('div', 'rvpic', c.pic));
    if (c.big) card.appendChild(h('div', 'rvbig', ap(c.big)));
    var r1 = row(c.t), r2 = c.t2 ? row(c.t2, 'r2') : null; card.appendChild(r1); if (r2) { var w2 = h('div', 'rveq'); w2.appendChild(h('span', 'rveqs', c.sym || (c.vs ? '⇄' : '＝'))); w2.appendChild(r2); card.appendChild(w2); }
    card.appendChild(h('div', 'rvz', esc(c.z)));
    if (c.n) card.appendChild(h('div', 'rvn', '💡 ' + c.n));
    card.appendChild(h('div', 'rvcnt', '🔊 <i>1</i><i>2</i>'));
    st.appendChild(card); fit(card);
    var ks = [].slice.call(card.querySelectorAll('.rvk')), k = 0;
    (function pop() { if (k < ks.length) { ks[k].classList.add('in'); k++; T(pop, 330); return; } T(function () { readS(i, 0); }, 350); })(); }
  /* 唸 第 n 次（等句 ＝ 上面 一行 再 下面 一行）*/
  function readS(i, n) { var S = RVA.S, c = S.spec.sc[i], card = $id('rvs').querySelector('.rvcard'); if (!card) return;
    var cnt = card.querySelectorAll('.rvcnt i'); cnt[n] && cnt[n].classList.add('on');
    var rows = card.querySelectorAll('.rvrow'), c1 = [].slice.call(rows[0].children), fin = function () { if (n === 0) { card.classList.add('z'); } T(function () { slot(2 * i + n, function () { if (n === 0) T(function () { readS(i, 1); }, 650); else T(function () { nextS(); }, 1100); }); }, n === 0 ? 900 : 500); };
    read(c.en, c.v, c1, function () { if (rows[1]) T(function () { read(c.en2, c.v2 != null ? c.v2 : c.v, [].slice.call(rows[1].children), fin); }, 450); else fin(); }); }
  function nextS() { var S = RVA.S; if (S.i + 1 < S.spec.sc.length) scene(S.i + 1); else finish(); }
  /* 這個 位置 有 排 突擊 測驗 嗎？ */
  function slot(s, go) { var S = RVA.S; if (S.plan[s] == null) { go(); return; } var qi = S.plan[s]; delete S.plan[s]; quiz(qi, go); }

  /* ③ ⚡ 突擊 測驗 */
  function quiz(qi, go) { var S = RVA.S, q = S.spec.qz[qi], st = $id('rvs'); stopAu(); $id('rvc').classList.add('hid'); S.qn = (S.qn || 0) + 1; S.qgo = go; S.q = q; S.qi = qi; S.ans = false;
    var w = h('div', 'rvqz'), PR = { mc: 'Choose!', hear: 'Listen and choose!', tf: 'True or false?', dec: 'Match!', ord: 'Put in order!', spot: 'Find the mistake!' },
      HOW = { mc: '👆 點 一個 答案', hear: '🔊 聽 ➜ 👆 點 一個 答案', tf: '👆 對 ⭕ 還是 錯 ❌', dec: '👆 把 中文 方塊 放到 英文 字 下面（可以 拖、可以 互相 交換）', ord: '👆 照 順序 點 字（放好 的 字 可以 拖 來 交換）', spot: '👆 點 那一個 錯 的 字' };
    w.innerHTML = '<div class="rvqh"><span class="rvqf">⚡ 突擊 測驗！</span><span>第 ' + S.qn + ' ／ ' + S.nq + ' 題 · 列入 成績</span></div><div class="rvqb"><i id="rvqt"></i></div>' +
      '<div class="rvqp">' + esc(PR[q.ty] || 'Choose!') + '</div><div class="rvqhow">' + HOW[q.ty] + '</div><div class="rvqa" id="rvqa"></div>';
    st.innerHTML = ''; st.appendChild(w); var A = $id('rvqa');
    if (q.pic) A.appendChild(h('div', 'rvqpic', q.pic));
    if (q.q) A.appendChild(h('div', 'rvqq', ap(q.q).replace(/___/g, '<u>　　　</u>')));
    if (q.s) { var hb = h('button', 'rvhear', '🔊 再聽一次'); hb.onclick = function () { read(q.s, q.v, [], null); }; A.appendChild(hb); T(function () { read(q.s, q.v, [], null); }, 500); }
    if (q.ty === 'mc' || q.ty === 'hear') { var ob = h('div', 'rvopts'); shuf(q.o.map(function (x, i) { return i; })).forEach(function (i) { var b = h('button', 'rvo', ap(q.o[i])); b.onclick = function () { judge(i === 0, i, q.o[i]); }; ob.appendChild(b); }); A.appendChild(ob); }
    if (q.ty === 'tf') { var tb = h('div', 'rvopts tf'); [[true, '⭕ True'], [false, '❌ False']].forEach(function (x) { var b = h('button', 'rvo', x[1]); b.onclick = function () { judge(x[0] === q.ok, x[0] === q.ok ? 0 : 1, x[1]); }; tb.appendChild(b); }); A.appendChild(tb); }
    if (q.ty === 'spot') { var sb = h('div', 'rvspot'); q.w.forEach(function (x, i) { var b = h('button', 'rvsw', ap(x)); b.onclick = function () { judge(i === q.bad, i === q.bad ? 0 : 1, x); }; sb.appendChild(b); }); A.appendChild(sb); }
    if (q.ty === 'dec') decQ(q, A);
    if (q.ty === 'ord') ordQ(q, A);
    fit(w);
    /* 每題 20 秒（放慢 ＝ 30 秒）；暫停 鈕 收起來，時間 不停 */
    var qt = RVA.QT * (S.slow ? 1.5 : 1) * 1000, t0 = Date.now(), my = S.gen, qn = S.qn; S.qt0 = t0;
    (function tk() { if (!RVA.S || RVA.S.gen !== my || S.ans || S.qn !== qn) return; var l = 1 - (Date.now() - t0) / qt, b = $id('rvqt'); if (b) b.style.transform = 'scaleX(' + Math.max(0, l) + ')'; if (l <= 0) { judge(false, -1, null); return; } requestAnimationFrame(tk); })(); }
  /* dec：中文 方塊 ➜ 英文 字 下面 的 空格（點 方塊 ＝ 放到 第一個 空格；點 格子 ＝ 拿 回去；拖 ＝ 放到 那一格；格子 ↔ 格子 互相 交換）*/
  function decQ(q, A) { var r = h('div', 'rvdrow'), tr = h('div', 'rvtray'), sl = [];
    q.t.forEach(function (p, i) { var c = h('div', 'rvdc' + (/^'/.test(p[0]) ? ' ct' : ''), '<b>' + ap(p[0]) + '</b>'), s = h('div', 'rvds', ''); s._i = i; c.appendChild(s); r.appendChild(c); sl.push(s); });
    A.appendChild(r); A.appendChild(tr);
    shuf(q.t.map(function (p) { return p[1]; }).concat(q.x || [])).forEach(function (z) { var b = h('div', 'rvtl', esc(z)); b._z = z; tr.appendChild(b); });
    function put(b, s) { if (RVA.S.ans) return; if (s._t) back(s); s._t = b; s.textContent = b._z; s.classList.add('fill'); b.classList.add('used'); chk(); }
    function back(s) { if (!s._t) return; s._t.classList.remove('used'); s._t = null; s.textContent = ''; s.classList.remove('fill'); }
    function chk() { if (sl.every(function (s) { return s._t; })) T(function () { var got = sl.map(function (s) { return s._t._z; }), ok = got.every(function (z, i) { return z === q.t[i][1]; }); judge(ok, ok ? 0 : 1, got); }, 300); }
    drag(tr, r, '.rvtl', '.rvds', function (b, s) { if (b.classList.contains('used')) return; if (s) put(b, s); else { for (var i = 0; i < sl.length; i++) if (!sl[i]._t) { put(b, sl[i]); return; } } },
      function (s, s2) { if (!s._t) return; if (!s2) { back(s); return; } if (s2 === s) return; var a = s._t, b = s2._t; s._t = b || null; s2._t = a; s.textContent = b ? b._z : ''; s.classList.toggle('fill', !!b); s2.textContent = a._z; s2.classList.add('fill'); [s, s2].forEach(function (x) { x.classList.remove('swp'); void x.offsetWidth; x.classList.add('swp'); }); chk(); }); }
  /* ord：照 順序 點 字 ➜ 下面 一排；放好 的 字 可以 拖 來 交換；點 ＝ 拿 回去 */
  function ordQ(q, A) { var ans = h('div', 'rvans'), tr = h('div', 'rvtray'), n = q.w.length, sl = [];
    for (var i = 0; i < n; i++) { var s = h('div', 'rvds w', ''); s._i = i; ans.appendChild(s); sl.push(s); }
    A.appendChild(ans); A.appendChild(tr);
    shuf(q.w.concat(q.x || [])).forEach(function (z) { var b = h('div', 'rvtl en', ap(z)); b._z = z; tr.appendChild(b); });
    function put(b, s) { if (RVA.S.ans) return; if (s._t) back(s); s._t = b; s.innerHTML = ap(b._z); s.classList.add('fill'); b.classList.add('used'); chk(); }
    function back(s) { if (!s._t) return; s._t.classList.remove('used'); s._t = null; s.innerHTML = ''; s.classList.remove('fill'); }
    function chk() { if (sl.every(function (s) { return s._t; })) T(function () { var got = sl.map(function (s) { return s._t._z; }), ok = got.join(' ') === q.w.join(' '); judge(ok, ok ? 0 : 1, got.join(' ')); }, 300); }
    drag(tr, ans, '.rvtl', '.rvds', function (b, s) { if (b.classList.contains('used')) return; if (s) put(b, s); else { for (var i = 0; i < sl.length; i++) if (!sl[i]._t) { put(b, sl[i]); return; } } },
      function (s, s2) { if (!s._t) return; if (!s2) { back(s); return; } if (s2 === s) return; var a = s._t, b = s2._t; s._t = b || null; s2._t = a; s.innerHTML = b ? ap(b._z) : ''; s.classList.toggle('fill', !!b); s2.innerHTML = ap(a._z); s2.classList.add('fill'); [s, s2].forEach(function (x) { x.classList.remove('swp'); void x.offsetWidth; x.classList.add('swp'); }); chk(); }); }
  /* 拖：方塊（tile）點 一下 ＝ onTile(b, null)、拖到 格子 ＝ onTile(b, 格子)；格子 裡 的 點 一下 ＝ onSlot(s, null) 拿 回去、拖到 別的 格子 ＝ onSlot(s, 那一格) 交換 */
  function drag(tray, area, tsel, ssel, onTile, onSlot) {
    function over(x, y) { var best = null; [].forEach.call(area.querySelectorAll(ssel), function (s) { var r = s.getBoundingClientRect(); if (x > r.left - 20 && x < r.right + 20 && y > r.top - 34 && y < r.bottom + 34) best = s; }); return best; }
    function bind(root, sel, isSlot) { root.addEventListener('pointerdown', function (e) { var t = e.target.closest ? e.target.closest(sel) : null; if (!t || RVA.S.ans || (isSlot && !t._t) || (!isSlot && t.classList.contains('used'))) return; e.preventDefault();
      var x0 = e.clientX, y0 = e.clientY, gh = null, hov = null, pid = e.pointerId;
      function mv(ev) { if (ev.pointerId !== pid) return; if (!gh && Math.abs(ev.clientX - x0) + Math.abs(ev.clientY - y0) > 10) { var r = t.getBoundingClientRect(); gh = h('div', 'rvtl rvgh' + (t.classList.contains('en') || isSlot && t.classList.contains('w') ? ' en' : ''), t._t ? (isSlot && t.classList.contains('w') ? ap(t._t._z) : esc(t._t._z)) : t.innerHTML); gh.style.left = r.left + 'px'; gh.style.top = r.top + 'px'; gh.style.width = r.width + 'px'; gh._ox = x0 - r.left; gh._oy = y0 - r.top; document.body.appendChild(gh); t.classList.add('lift'); }
        if (gh) { gh.style.left = (ev.clientX - gh._ox) + 'px'; gh.style.top = (ev.clientY - gh._oy) + 'px'; var o = over(ev.clientX, ev.clientY); if (o !== hov) { if (hov) hov.classList.remove('hot'); hov = o; if (hov && hov !== t) hov.classList.add('hot'); } } }
      function up(ev) { if (ev.pointerId !== pid) return; document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); t.classList.remove('lift'); if (hov) hov.classList.remove('hot');
        if (gh) { if (gh.parentNode) gh.parentNode.removeChild(gh); var o = ev.type === 'pointercancel' ? null : over(ev.clientX, ev.clientY); if (isSlot) { if (o) onSlot(t, o); else { var tr2 = tray.getBoundingClientRect(); if (ev.clientY > tr2.top - 30) onSlot(t, null); } } else if (o) onTile(t, o); return; }
        if (isSlot) onSlot(t, null); else onTile(t, null); }
      document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up); }); }
    bind(tray, tsel, false); bind(area, ssel, true); }

  /* 對 不 對 */
  function judge(ok, ci, pick) { var S = RVA.S; if (!S || S.ans) return; S.ans = true; var q = S.q, sec = (Date.now() - S.qt0) / 1000;
    S.rows.push([ok ? 1 : 0, ci, Math.round(sec * 10) / 10, pick != null && sec < 1 ? 1 : 0, 0, S.qi]);
    var n = $id('rvn'); if (n) n.textContent = S.rows.filter(function (x) { return x[0]; }).length + ' ✅ ／ ' + S.nq;
    if (ok) { var st = $id('rvs'), g = h('div', 'rvok', '<b>✅ 答對了！</b>' + (q.a.t ? '' : '')); st.appendChild(g);
      var gr = row(q.a.t, 'okr'); g.appendChild(gr); T(function () { read(q.a.en, q.a.v, [].slice.call(gr.children), function () { T(back2, 600); }); }, 400); return; }
    T(function () { fb(q, ci, pick); }, 500); }
  function back2() { var S = RVA.S; if (!S) return; var go = S.qgo; S.qgo = null; $id('rvc').classList.remove('hid'); if (S.i >= 0 && S.i < S.spec.sc.length) redraw(); go && go(); }
  /* 回到 動畫：這一頁 重新 畫（字 都 已經 出來）*/
  function redraw() { var S = RVA.S, i = S.i, c = S.spec.sc[i], st = $id('rvs'); st.innerHTML = ''; var card = h('div', 'rvcard z' + (c.t2 ? ' eq' : ''), '');
    card.appendChild(h('div', 'rvh', '<span>重點 ' + (i + 1) + '</span>' + esc(c.h))); if (c.pic) card.appendChild(h('div', 'rvpic', c.pic)); if (c.big) card.appendChild(h('div', 'rvbig', ap(c.big)));
    card.appendChild(row(c.t)); if (c.t2) { var w2 = h('div', 'rveq'); w2.appendChild(h('span', 'rveqs', c.sym || (c.vs ? '⇄' : '＝'))); w2.appendChild(row(c.t2, 'r2')); card.appendChild(w2); }
    card.appendChild(h('div', 'rvz', esc(c.z))); if (c.n) card.appendChild(h('div', 'rvn', '💡 ' + c.n)); card.appendChild(h('div', 'rvcnt', '🔊 <i class="on">1</i><i>2</i>'));
    [].forEach.call(card.querySelectorAll('.rvk'), function (k) { k.classList.add('in'); }); st.appendChild(card); fit(card); }

  /* 答錯頁（照 正式 題目 的 答錯頁：綠底、你 的 答案、正確 答案 逐字 中文、整句、💡、唸 3 次 唸到 哪 亮到 哪、〔🔊 再聽一次〕）*/
  function fb(q, ci, pick) { var S = RVA.S, o = h('div', 'rvfb', ''), you = pick == null ? '' : Array.isArray(pick) ? pick.join('　') : String(pick);
    o.innerHTML = '<div class="rvfx"><div class="hd">' + (ci === -1 ? '⏰ 時間到' : '❌ 答錯了') + '</div>' + (you ? '<div class="yp">你的答案：<s>' + ap(you) + '</s></div>' : '') +
      '<div class="ca">✅ 正確答案</div><div class="gl" id="rvgl"></div><div class="tr">整句：' + esc(q.a.z) + '</div>' + (q.a.why ? '<div class="why">💡 ' + esc(q.a.why) + '</div>' : '') +
      '<div class="ft"><span class="n3"><i>1</i><i>2</i><i>3</i></span><button class="say" id="rvfs">🔊 再聽一次</button><span id="rvnx"></span></div></div>';
    $id('rva').appendChild(o); var gl = $id('rvgl'), r = row(q.a.t, 'fbr'); gl.appendChild(r); [].forEach.call(r.children, function (k) { k.classList.add('in'); });
    var cells = [].slice.call(r.children), c = 0, gen = S.gen;
    o.querySelector('#rvfs').onclick = function () { read(q.a.en, q.a.v, cells, null); };
    function one() { if (!RVA.S || RVA.S.gen !== gen) return; if (c >= 3) { var b = h('button', 'nx', '▶ 繼續 看 動畫'); $id('rvnx').appendChild(b); b.onclick = function () { o.remove(); back2(); }; return; }
      o.querySelectorAll('.n3 i')[c].classList.add('on'); c++; read(q.a.en, q.a.v, cells, function () { T(one, 650); }); }
    T(one, 500); }

  /* ⑤ 看完 */
  function finish() { var S = RVA.S, ok = S.rows.filter(function (x) { return x[0]; }).length, st = $id('rvs'); $id('rvc').classList.add('hid'); $id('rvp').textContent = '';
    try { ls(S.key, JSON.stringify(S.seen.slice(-60))); } catch (e) { }
    try { if (S.rows.length && RVA.A.send) RVA.A.send(S.rows, S.spec, Math.round((Date.now() - S.t0) / 1000)); } catch (e) { }
    st.innerHTML = '<div class="rvend"><div class="rve0">🎉</div><div class="rve1">看完 了！</div><div class="rve2">⚡ 突擊 測驗：答對 <b>' + ok + '</b> ／ ' + S.rows.length + '</div><div class="rve3">' + (ok === S.rows.length ? '👀 全部 答對：你 真的 很 專心！' : '📌 答錯 的 重點，等一下 的 題目 會 用到！') + '</div><button class="rvgo rdy" id="rvend">▶ 開始 這一關</button></div>';
    var go = function () { var d = S.done; RVA.close(); d && d(); }; $id('rvend').onclick = go; }

  /* 按鈕 */
  document.addEventListener('click', function (e) { var S = RVA.S; if (!S) return; var t = e.target.closest ? e.target.closest('[data-rv],#rvgo') : null; if (!t) return;
    if (t.id === 'rvgo') { if (t.disabled) return; scene(0); return; }
    var k = t.getAttribute('data-rv');
    if (k === 'pause') { S.pause = !S.pause; t.textContent = S.pause ? '▶ 繼續' : '⏸️ 暫停'; t.classList.toggle('on', S.pause); document.body.classList.toggle('rvpz', S.pause);
      if (S.pause) { pauseAll(); try { el().pause(); } catch (x) { } try { speechSynthesis.pause(); } catch (x) { } } else { resumeAll(); try { var a = el(); if (a.src && a.currentTime > 0 && !a.ended) a.play(); } catch (x) { } try { speechSynthesis.resume(); } catch (x) { } } }
    if (k === 'slow') { S.slow = !S.slow; t.textContent = S.slow ? '🐇 正常' : '🐢 放慢'; t.classList.toggle('on', S.slow); try { el().playbackRate = S.slow ? .75 : 1; } catch (x) { } }
    if (k === 'again') { if (S.pause) { S.pause = false; document.body.classList.remove('rvpz'); var pb = document.querySelector('[data-rv="pause"]'); if (pb) { pb.textContent = '⏸️ 暫停'; pb.classList.remove('on'); } }
      S.tm.forEach(function (it) { clearTimeout(it.id); }); S.tm = []; S.gen++; stopAu(); /* 這一頁 還沒 出 的 測驗 照舊 會 出 */ scene(Math.max(0, S.i)); } });
  window.RVA = RVA;
}
const CSS = `
#rva{position:fixed;inset:0;z-index:9000;display:none;background:radial-gradient(120% 90% at 50% 0%,#132A4A 0%,#081324 60%,#040910 100%);color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif}
#rva.on{display:block}body.rvon{overflow:hidden}
.rvw{position:absolute;inset:0;display:flex;flex-direction:column;padding:max(10px,env(safe-area-inset-top)) clamp(10px,2.4vw,28px) max(10px,env(safe-area-inset-bottom))}
.rvtop{display:flex;align-items:center;gap:10px 18px;flex-wrap:wrap;font-size:clamp(17px,2.3vh,24px);font-weight:700}
.rvt{color:#FFE07A;flex:1 1 auto}.rvp{color:#BFD8FF}.rvr{background:#3A1458;border:2px solid #C08BFF;border-radius:999px;padding:2px 14px;animation:rvRad 2s infinite}.rvr b{color:#FFE07A}
@keyframes rvRad{50%{box-shadow:0 0 0 6px rgba(192,139,255,.25)}}
.rvst{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;position:relative}
.rvc{display:flex;justify-content:center;gap:clamp(10px,2vw,22px);padding-top:8px}.rvc.hid{visibility:hidden}
.rvc button{min-height:58px;min-width:150px;font:inherit;font-size:clamp(19px,2.5vh,25px);font-weight:700;border-radius:16px;border:3px solid #5E7FA8;background:#14263F;color:#fff;cursor:pointer}
.rvc button.on{background:#FFB300;color:#2A1A00;border-color:#FFE07A}
body.rvpz .rvcard *{animation-play-state:paused!important}
.rvcard{--rz:1;width:min(100%,1180px);max-height:100%;overflow:hidden;background:linear-gradient(180deg,#0E1E36,#0A1628);border:3px solid #2F4E78;border-radius:26px;padding:clamp(10px,2vh,22px) clamp(12px,2.4vw,30px);display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.4vh,14px);font-size:calc(var(--rz) * 1px * 1);animation:rvIn .5s cubic-bezier(.3,1.4,.6,1)}
@keyframes rvIn{from{transform:scale(.85) translateY(20px);opacity:0}}
.rvh{font-size:calc(var(--rz) * clamp(20px,3vh,32px));font-weight:700;color:#BFE3FF}.rvh span{background:#FFB300;color:#2A1A00;border-radius:10px;padding:0 10px;margin-right:10px}
.rvpic{font-size:calc(var(--rz) * clamp(54px,9vh,104px));line-height:1.1;animation:rvBob 2.4s ease-in-out infinite}@keyframes rvBob{50%{transform:translateY(-6px) rotate(-3deg)}}
.rvpic svg{height:1.2em;width:auto}
.rvbig{font-size:calc(var(--rz) * clamp(70px,13vh,140px));line-height:1;font-weight:700;color:#FFE07A;text-shadow:0 0 22px rgba(255,224,122,.5)}
.rvrow{display:flex;flex-wrap:nowrap;justify-content:center;align-items:flex-start;gap:0 calc(var(--rz) * clamp(10px,1.6vw,22px))}
.rvk{display:flex;flex-direction:column;align-items:center;opacity:0;transform:translateY(16px) scale(.8);transition:opacity .3s,transform .35s cubic-bezier(.3,1.6,.6,1)}
.rvk.in{opacity:1;transform:none}
.rvk b{font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(40px,7.4vh,78px));font-weight:700;line-height:1.15;white-space:nowrap;transition:transform .15s,color .15s,text-shadow .15s}
.rvk i{font-style:normal;font-size:calc(var(--rz) * clamp(22px,3.5vh,36px));color:#FFE9A8;font-weight:700;white-space:nowrap;min-height:1.2em}
.rvk.ct{margin-left:calc(var(--rz) * -1 * clamp(8px,1.4vw,20px))}
.rvk.spk b{transform:scale(1.14);color:#FFF6C8;text-shadow:0 0 18px rgba(255,236,150,.9)}.rvk.spk i{color:#fff}
.rvap{color:#FF5252}
.rveq{display:flex;align-items:flex-start;gap:calc(var(--rz) * 12px)}.rveqs{font-size:calc(var(--rz) * clamp(40px,7vh,72px));color:#FFB300;font-weight:700;line-height:1.15}
.rvz,.rvn{opacity:0;transition:opacity .5s}.rvcard.z .rvz,.rvcard.z .rvn{opacity:1}
.rvz{font-size:calc(var(--rz) * clamp(24px,3.8vh,40px));font-weight:700;color:#9FF0B5}
.rvn{font-size:calc(var(--rz) * clamp(20px,3vh,30px));font-weight:700;color:#FFD6A0;background:#2A1A08;border:2px solid #A8661C;border-radius:14px;padding:4px 14px;text-align:center}
.rvcnt{font-size:clamp(17px,2.2vh,22px);color:#9AB}.rvcnt i{font-style:normal;display:inline-block;width:1.6em;height:1.6em;line-height:1.6em;text-align:center;border-radius:50%;border:2px solid #456;margin-left:6px}.rvcnt i.on{background:#3BD16F;border-color:#3BD16F;color:#002}
.rvin,.rvend{display:flex;flex-direction:column;align-items:center;gap:clamp(10px,2vh,22px);text-align:center}
.rvi0,.rve0{font-size:clamp(70px,12vh,130px);animation:rvBob 1.6s infinite}.rvi1,.rve1{font-size:clamp(28px,4.6vh,48px);font-weight:700;color:#FFE07A}
.rvl{display:flex;flex-direction:column;gap:12px;font-size:clamp(23px,3.6vh,38px);font-weight:700}.rvl span{opacity:0;animation:rvUp .5s forwards;animation-delay:var(--d)}.rvl b{color:#FFE07A}
@keyframes rvUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.rve2{font-size:clamp(26px,4vh,42px);font-weight:700}.rve2 b{color:#3BD16F;font-size:1.3em}.rve3{font-size:clamp(20px,3vh,30px);color:#FFD6A0;font-weight:700}
.rvgo{min-height:70px;min-width:260px;font:inherit;font-size:clamp(24px,3.6vh,36px);font-weight:700;border-radius:20px;border:4px solid #7A8A9A;background:#2A3542;color:#9AB;cursor:pointer}
.rvgo.rdy{background:linear-gradient(#5BE38A,#22A84F);border-color:#B6FFCB;color:#022;animation:rvGlow 1.6s infinite}@keyframes rvGlow{50%{box-shadow:0 0 0 10px rgba(91,227,138,.25)}}
.rvqz{--rz:1;width:min(100%,1180px);max-height:100%;overflow:hidden;background:linear-gradient(180deg,#2A0F44,#16082A);border:4px solid #C08BFF;border-radius:26px;padding:clamp(10px,1.8vh,20px) clamp(12px,2.2vw,28px);display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.2vh,12px);animation:rvZap .6s}
@keyframes rvZap{0%{transform:scale(1.25);opacity:0;filter:brightness(3)}40%{transform:scale(.96);opacity:1}60%{transform:translateX(-8px)}80%{transform:translateX(6px)}}
.rvqh{display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center;font-size:clamp(17px,2.4vh,24px);font-weight:700;color:#E6D2FF}
.rvqf{font-size:clamp(26px,4.2vh,44px);color:#FFE07A;text-shadow:0 0 16px rgba(255,200,0,.7);animation:rvFl .5s 3}@keyframes rvFl{50%{opacity:.35}}
.rvqb{width:100%;height:12px;background:#33204A;border-radius:6px;overflow:hidden}.rvqb i{display:block;height:100%;background:linear-gradient(90deg,#3BD16F,#FFE07A);transform-origin:left}
.rvqp{font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(30px,5vh,52px));font-weight:700;color:#fff}
.rvqhow{font-size:clamp(18px,2.4vh,24px);color:#D6C2F2;font-weight:700}
.rvqa{display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,16px);width:100%}
.rvqpic{font-size:calc(var(--rz) * clamp(54px,9vh,96px));line-height:1.1}.rvqpic svg{height:1.2em;width:auto}
.rvqq{font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(34px,6vh,64px));font-weight:700;text-align:center;line-height:1.25}.rvqq u{text-decoration:none;border-bottom:4px solid #FFE07A;display:inline-block;min-width:2.4em}
.rvopts{display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,1.4vh,14px);width:min(100%,960px)}.rvopts.tf{width:min(100%,640px)}
.rvo{min-height:clamp(64px,10vh,96px);font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(26px,4.4vh,44px));font-weight:700;border-radius:18px;border:4px solid #8A6BC8;background:#24123E;color:#fff;cursor:pointer;padding:4px 12px}
.rvo:active{transform:scale(.97)}
.rvhear,.rvfb .say{min-height:56px;font:inherit;font-size:clamp(20px,2.8vh,26px);font-weight:700;border-radius:16px;border:3px solid #5EC8FF;background:#0E2A44;color:#fff;padding:4px 20px;cursor:pointer}
.rvspot{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}.rvsw{min-height:clamp(70px,11vh,104px);min-width:90px;font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(34px,6vh,62px));font-weight:700;border-radius:18px;border:4px dashed #FF8A80;background:#2A1020;color:#fff;cursor:pointer;padding:0 18px}
.rvdrow,.rvans{display:flex;flex-wrap:nowrap;justify-content:center;gap:clamp(8px,1.4vw,16px)}
.rvdc{display:flex;flex-direction:column;align-items:center;gap:6px}.rvdc b{font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(36px,6.4vh,66px));white-space:nowrap}
.rvds{min-width:clamp(90px,10vw,140px);min-height:clamp(58px,8.5vh,82px);border:4px dashed #6F86A6;border-radius:16px;background:#0E1A2C;display:flex;align-items:center;justify-content:center;font-size:clamp(24px,3.8vh,38px);font-weight:700;color:#FFE9A8;padding:0 8px}
.rvds.w{color:#fff;font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(28px,4.8vh,48px))}
.rvds.fill{border-style:solid;border-color:#C9A227;background:#2A2208;touch-action:none;cursor:grab}.rvds.hot{border-color:#5EC8FF;background:#123049;transform:scale(1.05)}.rvds.lift{opacity:.35}
.rvds.swp{animation:rvSwp .45s}@keyframes rvSwp{40%{transform:scale(1.14);box-shadow:0 0 0 4px #FFE07A}}
.rvtray{display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(8px,1.4vw,14px);min-height:70px}
.rvtl{min-width:clamp(84px,9vw,130px);min-height:clamp(58px,8.5vh,80px);padding:4px 16px;border-radius:16px;border:4px solid #C9A227;background:linear-gradient(#FFE58A,#F5B829);color:#3A2600;display:flex;align-items:center;justify-content:center;font-size:clamp(24px,3.8vh,38px);font-weight:700;cursor:grab;touch-action:none;user-select:none}
.rvtl.en{font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(28px,4.8vh,48px))}
.rvtl.used{visibility:hidden}.rvtl.lift{opacity:.35}.rvgh{position:fixed;z-index:9600;pointer-events:none;box-shadow:0 14px 24px rgba(0,0,0,.5);transform:scale(1.08)}
.rvok{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:rgba(6,40,20,.94);border-radius:26px;animation:rvIn .4s}
.rvok>b{font-size:clamp(40px,7vh,72px);color:#5BE38A}
.rvfb{position:absolute;inset:0;z-index:9500;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);padding:12px}
.rvfx{width:min(100%,1180px);max-height:100%;overflow:auto;background:#0B3D1E;border:4px solid #3BD16F;border-radius:26px;padding:clamp(12px,2vh,24px) clamp(14px,2.4vw,30px);display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.4vh,14px);text-align:center}
.rvfx .hd{font-size:clamp(30px,5vh,52px);font-weight:700;color:#FFD0D0;animation:rvShk .5s}@keyframes rvShk{25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
.rvfx .yp{font-size:clamp(22px,3.2vh,32px);font-weight:700}.rvfx .yp s{color:#FF8A80;font-family:Andika,sans-serif}
.rvfx .ca{font-size:clamp(24px,3.6vh,36px);font-weight:700;color:#9FF0B5}.rvfx .tr{font-size:clamp(24px,3.6vh,38px);font-weight:700;color:#FFF4C2}.rvfx .why{font-size:clamp(20px,3vh,30px);font-weight:700;color:#FFD6A0}
.rvfx .ft{display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center}
.rvfx .n3 i{font-style:normal;display:inline-block;width:1.8em;height:1.8em;line-height:1.8em;border-radius:50%;border:3px solid #3BD16F;margin:0 4px;font-size:clamp(17px,2.4vh,22px)}.rvfx .n3 i.on{background:#3BD16F;color:#002}
.rvfx .nx{min-height:64px;min-width:240px;font:inherit;font-size:clamp(22px,3.2vh,32px);font-weight:700;border-radius:18px;border:4px solid #B6FFCB;background:linear-gradient(#5BE38A,#22A84F);color:#022;cursor:pointer}
@media (max-aspect-ratio:1/1){.rvopts{grid-template-columns:1fr}.rvk b{font-size:calc(var(--rz) * clamp(34px,5.4vh,64px))}}
@media (prefers-reduced-motion:reduce){.rvcard,.rvqz,.rvpic,.rvi0,.rve0,.rvr,.rvgo.rdy{animation:none!important}}
`;
/* 網頁 的 轉接：gr 'g3'／'g4'、set 成績 題組、name 名稱、R ＝ _rva_data.js 的 結果（list、NMAP）*/
function page(o) { const map = {}, off = {}; let k = 0; o.R.list.forEach(a => { map[a.id] = a; off[a.id] = k; k += a.qz.length; });
  const J = x => JSON.stringify(x).replace(/</g, '\\u003c');
  return 'var RVD=' + J(map) + ',RVOFF=' + J(off) + ',RVMAP=' + J(o.R.NMAP || {}) + ';' +
    'RVA.A={gr:' + J(o.gr) + ',sid:function(){return (typeof SCID!=="undefined"&&SCID)||""},stop:function(){try{stopSay()}catch(e){}},' +
    'aud:function(t,v){var k=akey(t),X=window.ENAUDR||{},W=window.ENAUDRW||{},p=(v==="m"?"m:":""),f=X[p+k]||X[k];if(f)return "audio/rv/"+f[0];f=W[p+k]||W[k];if(f)return "audio/rvw/"+f[0];var a=aud(t,v);return a||null},' +
    'send:function(rows,spec,secs){try{if(typeof scLive!=="function"||!scLive()||!SCID)return;var o=RVOFF[spec.id]||0,u=SCID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);' +
    'var Rr={id:SCID,set:' + J(o.set) + ',name:' + J(o.name) + ',m:"g",qs:rows.map(function(r){return [r[0],r[1],r[2],r[3],r[4],o+r[5]]}),raw:rows.filter(function(r){return r[0]}).length,fix:0,mp:0,mw:0,sec:secs,src:"school",dev:SCDEV,u:u,t:Date.now()};' +
    'var QQ=scGet("q")||[];QQ.push(Rr);scPut("q",QQ.slice(-200));scFlush()}catch(e){}}};' +
    /* 每 換 一關（一個 題型）先 演；量測 設 window.__NORVA 跳過 */
    'function rvaGo(id,done){var s=RVD[id]||RVD[RVMAP[id]];if(!s||window.__NORVA){done();return}RVA.play(s,done)}' +
    'var _rvDc=decClose;decClose=function(){if(window.RVA)RVA.close();_rvDc()};'; }
module.exports = { page: page, css: CSS, js: 'var RVA=(function(){' + RVASRC.toString() + ';RVASRC();return window.RVA})();', SRC: RVASRC };
