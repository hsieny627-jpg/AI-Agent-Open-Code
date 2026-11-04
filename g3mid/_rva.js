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
  /* 2026-11-01 第三十九次 第 2 點（老師：突擊 題 讓 答題 冗長、沉悶，學生 失去 耐心 ➜ 先 暫時 移除 全部 突擊 題）：QON ＝ false ➜ 動畫 照 演，一題 都 不 插、不 送 成績。
     要 加 回來：QON 改 true（量測 用 window.__RVQ ＝ 1 強制 打開 量 引擎）。 */
  var RVA = { A: null, S: null, N: 3, QT: 20, QON: false,
    /* 2026-11-02 第四十次 第 4-(4) 點（老師：暫時 刪除 字母 大小寫、字首音 的 動畫，讓 作答 更 流暢）＝ 這幾關 不 演；要 加 回來 ＝ 從 SKIP 拿掉。
       第 4-(5) 點：⚡ 現場任務（網址 ?live=）一律 不 演（rvaGo 看 CR.cfg）。 */
    SKIP: { q1: 1, q4: 1, q5: 1, m1: 1, m2: 1 } };
  function $id(i) { return document.getElementById(i); }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  /* 選項 前面 的 圖（emoji）放大 一倍（第三十八次 第 11-(3) 點：👴 太 小 看不清楚）*/
  function opi(t) { var m = /^((?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF])(?:\uFE0F|\u200D(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF])|[\uD83C][\uDFFB-\uDFFF])*)\s*/.exec(String(t)); return m ? '<span class="rvoi">' + m[1] + '</span>' + ap(String(t).slice(m[0].length)) : ap(t); }
  function ZS(s) { return window.ZSP ? ZSP(s) : s; }   /* 2026-11-01 第三十八次 第 11-(6) 點：整句 中文 詞 和 詞 空 一格（score/_zsp.js；keepsp ＝ _dsp.js 不 拿掉）*/
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
    var fired = 0, fin = function () { if (!RVA.S || my !== RVA.S.rid || fired) return; fired = 1; cells.forEach(function (c) { c.classList.remove('spk'); }); if (done) done(); };
    var est = function () { var s = performance.now(), D = Math.max(1200, tot * 95) * (S.slow ? 1.4 : 1); try { var u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = S.slow ? .6 : .82; speechSynthesis.speak(u); } catch (e) { }
      (function lp() { if (!RVA.S || my !== RVA.S.rid) return; if (S.pause) { s += 16; requestAnimationFrame(lp); return; } var r = (performance.now() - s) / D; if (r >= 1) { fin(); return; } hl(r); requestAnimationFrame(lp); })(); };
    if (!f) { est(); return; }
    var a = el(); try { a.pause(); } catch (e) { } a.onended = null; a.onerror = null; a.src = f; try { a.defaultPlaybackRate = a.playbackRate = rate || (S.slow ? .75 : 1); } catch (e) { }
    a.onended = function () { fin(); }; a.onerror = function () { est(); };
    var lt = -1, lw = performance.now(); (function lp() { if (!RVA.S || my !== RVA.S.rid) return; if (a.duration > 0 && !a.paused) hl(Math.min(.999, a.currentTime / a.duration)); var nw = performance.now(); if (S.pause || a.currentTime !== lt || a.ended) { lt = a.currentTime; lw = nw; if (a.ended) return; } else if (nw - lw > 4500) { a.onended = null; a.onerror = null; try { a.pause(); } catch (e) { } fin(); return; } requestAnimationFrame(lp); })();   /* 第四十一次 第 4 點：聲音 卡住 4.5 秒 ＝ 往下 走 */
    var p = a.play(); if (p && p.catch) p.catch(function (e) { if (!RVA.S || my !== RVA.S.rid || (e && e.name === 'AbortError')) return; est(); }); }

  /* ── 一排 英文 字（每個 字 正下方 中文）── */
  function row(t, cls) { var r = h('div', 'rvrow' + (cls ? ' ' + cls : '')); t.forEach(function (p) { var c = h('span', 'rvk' + (/^'/.test(p[0]) ? ' ct' : '') + (/\S\s+\S/.test(p[0]) ? ' ph' : ''), '<b>' + ap(p[0]) + '</b><i>' + esc(p[1] || '　') + '</i>'); c.setAttribute('data-w', p[0]); r.appendChild(c); }); return r; }
  function fit(box) { if (!box) return; box.style.removeProperty('--rz'); var z = 1; for (var i = 0; i < 14 && (box.scrollHeight > box.clientHeight + 2 || box.scrollWidth > box.clientWidth + 2); i++) { z *= .9; box.style.setProperty('--rz', z.toFixed(3)); } }

  /* ══ 開始 ══ spec ＝ {id, ic, nm, sc:[…], qz:[…]}；done() ＝ 看完（或 跳過） */
  RVA.play = function (spec, done) {
    if (RVA.S) RVA.close();
    /* 2026-11-03 第四十一次（老師 建議 1 第 2 點）：看過 一次 ＝ 只 留 重點 頁（spec.key）；突擊 題 的 at 換成 新 的 頁碼 */
    try { if (spec.key && spec.key.length && ls('rvv_' + RVA.A.gr + '_' + spec.id + '_' + (RVA.A.sid() || '0'))) { var K = spec.key, sp2 = {}; for (var kk in spec) sp2[kk] = spec[kk];
      sp2.sc = K.map(function (i) { return spec.sc[i]; }); sp2.qz = spec.qz.map(function (q) { var c = {}, a = q.at || 0, j = 0; for (var x in q) c[x] = q[x]; K.forEach(function (i, n) { if (i <= a) j = n; }); c.at = j; return c; }); sp2.short = 1; spec = sp2; } } catch (e) { }
    var o = $id('rva'); if (!o) { o = h('div', '', ''); o.id = 'rva'; document.body.appendChild(o); }
    var S = RVA.S = { spec: spec, done: done, i: -1, tm: [], gen: 1, rid: 0, pause: false, slow: false, rows: [], t0: Date.now(), plan: {}, nq: 0 };
    /* 這一次 要 考 的 3 題：先 出 這個 學生 還沒 考過 的（每 一次 都 不一樣）；題型 盡量 不 重複 */
    var key = 'rva_' + RVA.A.gr + '_' + spec.id + '_' + (RVA.A.sid() || '0'), seen = []; try { seen = JSON.parse(ls(key) || '[]'); } catch (e) { }
    var all = spec.qz.map(function (q, i) { return i; }), un = shuf(all.filter(function (i) { return seen.indexOf(i) < 0; }));
    if (un.length < RVA.N) { var last = seen.slice(-RVA.N); seen = []; un = un.concat(shuf(all.filter(function (i) { return un.indexOf(i) < 0 && last.indexOf(i) < 0; }))).concat(shuf(last)); }
    /* 2026-11-01 第三十八次 第 11-(2) 點：考 的 一定 是 那一頁 的 重點 ➜ 3 題 盡量 是 不同 頁（at 不一樣），再 盡量 不同 題型 */
    var pick = [], ty = {}, ats = {}, A = function (i) { return Math.min(spec.sc.length - 1, spec.qz[i].at || 0); };
    un.forEach(function (i) { if (pick.length < RVA.N && !ats[A(i)] && !ty[spec.qz[i].ty]) { pick.push(i); ty[spec.qz[i].ty] = 1; ats[A(i)] = 1; } });
    un.forEach(function (i) { if (pick.length < RVA.N && pick.indexOf(i) < 0 && !ats[A(i)]) { pick.push(i); ats[A(i)] = 1; } });
    un.forEach(function (i) { if (pick.length < RVA.N && pick.indexOf(i) < 0) pick.push(i); });
    if (!(RVA.QON || window.__RVQ)) pick = [];   /* 第三十九次：突擊 題 暫時 移除 */
    S.key = key; S.seen = seen.concat(pick);
    /* 2026-11-02 第四十次（老師 C46 ② 甲＋丙）：同一位 學生 第一次 看 ＝ 每一頁 唸 兩遍；看過 了 ＝ 每一頁 只 唸 一遍（短 一半，重點 一樣 全部 看到）*/
    S.vk = 'rvv_' + RVA.A.gr + '_' + spec.id + '_' + (RVA.A.sid() || '0'); try { S.once = !!ls(S.vk); } catch (e) { S.once = false; }
    /* 插 在 哪裡：第 i 頁 唸完 第 1 次（2i）或 第 2 次（2i＋1），而且 ≧ 題目 的 at */
    var nS = spec.sc.length, used = {};
    /* 2026-11-01 第三十八次 第 11-(2) 點（老師：還沒 看完、看清楚 這一頁 就 插 題目，打斷 專注；有的 題目 跟 這一頁 沒 關係）➜
       只 插 在「那一頁 唸完 第 2 次」以後（2a＋1），a ＝ 題目 考 的 那一頁；同一頁 已經 有 ＝ 下一頁（考 的 都 是 已經 看過 的） */
    pick.sort(function (a, b) { return (spec.qz[a].at || 0) - (spec.qz[b].at || 0); }).forEach(function (qi) { var a = Math.min(nS - 1, spec.qz[qi].at || 0);
      while (a < nS - 1 && used[2 * a + 1]) a++; if (used[2 * a + 1]) for (a = nS - 1; a >= 0 && used[2 * a + 1]; a--); if (a < 0) a = nS - 1;
      used[2 * a + 1] = 1; S.plan[2 * a + 1] = qi; });
    S.nq = pick.length;
    o.innerHTML = '<div class="rvw"><div class="rvtop"><span class="rvt">🎬 秒懂 複習：' + esc(spec.ic + ' ' + spec.nm) + '</span><span class="rvp" id="rvp"></span>' + (S.nq ? '<span class="rvr">⚡ 突擊 測驗 <b id="rvn">0 ／ ' + S.nq + '</b></span>' : '') + '</div>' +
      '<div class="rvst" id="rvs"></div><div class="rvc" id="rvc"><button data-rv="pause">⏸️ 暫停</button><button data-rv="slow">🐢 放慢</button><button data-rv="again">🔁 再一次</button><button data-rv="next" id="rvnext" class="rvnx" disabled>🔒 看完 才 能 按</button></div></div>';
    o.classList.add('on'); document.body.classList.add('rvon'); intro(); };

  RVA.close = function () { var S = RVA.S; if (!S) return; S.gen++; S.tm.forEach(function (it) { clearTimeout(it.id); }); stopAu(); RVA.S = null; var o = $id('rva'); if (o) { o.classList.remove('on'); o.innerHTML = ''; } document.body.classList.remove('rvon'); };

  /* ① 開場：一句 一句 跳出來，2.6 秒 才 能 按 */
  function intro() { var S = RVA.S, st = $id('rvs'); $id('rvc').classList.add('hid');
    st.innerHTML = '<div class="rvin"><div class="rvi0">🎬</div><div class="rvi1">秒懂 複習 動畫：' + esc(S.spec.ic + ' ' + S.spec.nm) + '</div>' +
      (S.nq ? '<div class="rvl"><span style="--d:.3s">👀 專心 看、專心 聽</span><span style="--d:1s">⚡ 動畫 會 <b>隨時</b> 跳出 突擊 測驗（' + S.nq + ' 題）</span><span style="--d:1.7s">✅ 答對、答錯 都 <b>列入 成績</b></span></div>'
        : '<div class="rvl"><span style="--d:.3s">👀 專心 看、專心 聽</span><span style="--d:1s">💡 看懂 重點，等一下 的 題目 會 用到</span></div>') +
      '<button class="rvgo" id="rvgo" disabled>▶ 開始 看</button></div>';
    T(function () { var b = $id('rvgo'); if (b) { b.disabled = false; b.classList.add('rdy'); } }, S.once ? 900 : 2600); }

  /* ② 一頁 一個 重點 */
  function scene(i) { var S = RVA.S, sp = S.spec, c = sp.sc[i]; S.i = i; S.part = 0; S.misd = 0; $id('rvc').classList.remove('hid'); nxLock();
    $id('rvp').textContent = '📍 ' + (i + 1) + ' ／ ' + sp.sc.length;
    if (c.mag) { magScene(i, c); return; }
    var st = $id('rvs'); st.innerHTML = ''; var card = h('div', 'rvcard' + (c.t2 ? ' eq' : ''), '');
    card.appendChild(h('div', 'rvh', '<span>重點 ' + (i + 1) + '</span>' + esc(c.h)));
    if (c.pic) card.appendChild(h('div', 'rvpic', c.pic));
    if (c.g4 && window.HW) card.appendChild(grid4(c)); else if (c.big) card.appendChild(h('div', 'rvbig', ap(c.big)));
    var r1 = row(c.t), r2 = c.t2 ? row(c.t2, 'r2') : null, w2 = null; card.appendChild(r1);
    if (c.mis) card.appendChild(h('div', 'rvmis', '<span class="rvmx">❌</span><span class="rvmb"><s>' + ap(c.mis) + '</s><i class="keepsp">' + esc(ZS(c.misz || '')) + '</i></span><span class="rvmw">' + esc(c.misw || '') + '</span>'));
    if (r2) { w2 = h('div', 'rveq' + (c.mis ? ' rvok' : '')); w2.appendChild(h('span', 'rveqs', c.mis ? '✅' : (c.sym || (c.vs ? '⇄' : '＝')))); w2.appendChild(r2); card.appendChild(w2); }
    card.appendChild(h('div', 'rvz keepsp', esc(ZS(c.z))));
    if (c.n) card.appendChild(h('div', 'rvn', '💡 ' + c.n));
    card.appendChild(h('div', 'rvcnt', S.once ? '🔊 <i>1</i>' : '🔊 <i>1</i><i>2</i>'));
    flMark(card, c); st.appendChild(card); fit(card);
    var ks = [].slice.call(card.querySelectorAll('.rvk')), k = 0, k1 = r1.children.length;
    if (c.mis && w2) w2.classList.add('rvwait');
    (function pop() { if (c.mis && k === k1 && !S.misd) { S.misd = 1; T(function () { misShow(card, c); T(function () { w2.classList.remove('rvwait'); pop(); }, 2600); }, 400); return; }
      if (k < ks.length) { ks[k].classList.add('in'); k++; T(pop, 330); return; } S.misd = 0; T(function () { readS(i, 0); }, 350); })(); }
  /* 2026-11-03 第四十二次 第 7 點（老師）：🪄 直述句 ➜ 問句 魔法 變身（He is a teacher. ➜ Is he a teacher?）
     ① 一個 字 一張 彩色 卡（英文＋正下方 中文）唸 直述句 ➜ ② 🪄 魔杖 掃過 He、is ➜ ③ is 跳到 最前面 變 Is（大寫 I 發亮）、He 變 he 緊跟 在 Is 後面
     ➜ ④ 句點 . 飛起來 轉 一圈 變成 ? ➜ ⑤ 中文 順序 不變，句點 變成「嗎？」➜ ⑥ 唸 問句（唸到 哪 亮到 哪）➜ ⑦ 三個 關鍵 一起 亮 */
  var MAGC = { he: '#1565C0', she: '#AD1457', is: '#C98A00', a: '#4E6E8E', p: '#5A5A66' };
  function magScene(i, c) { var TT = function (f, ms) { T(f, ms * (window.__RVAUTO ? .15 : 1)); }, S = RVA.S, sp = S.spec, st = $id('rvs'); st.innerHTML = '';
    var card = h('div', 'rvcard rvmag', ''); card.appendChild(h('div', 'rvh', '<span>重點 ' + (i + 1) + '</span>' + esc(c.h)));
    var t = c.t.map(function (p) { return [String(p[0]).replace(/[.?!]$/, ''), p[1]]; }), pn = /\?$/.test(c.en) ? '?' : '.';
    var stage = h('div', 'mgst', ''), en = h('div', 'mgen', ''), zh = h('div', 'mgzh keepsp', ''), cap = h('div', 'mgcap', ''), wand = h('div', 'mgwd', '🪄');
    var col = function (w) { w = w.toLowerCase(); return MAGC[w] || (w === 'a' || w === 'an' ? MAGC.a : '#6A3FB0'); };
    var cards = t.map(function (p) { var k = h('span', 'mgk', '<b>' + ap(p[0]) + '</b><i>' + esc(p[1]) + '</i>'); k.style.background = col(p[0]); k.setAttribute('data-w', p[0]); en.appendChild(k); return k; });
    var pc = h('span', 'mgk mgp', '<b>' + pn + '</b><i>　</i>'); pc.style.background = MAGC.p; en.appendChild(pc);
    var zs = t.map(function (p) { var z = h('span', 'mgz', esc(p[1])); z.style.color = col(p[0]); zh.appendChild(z); return z; }), zp = h('span', 'mgz mgzp', '。'); zh.appendChild(zp);
    stage.appendChild(cap); stage.appendChild(en); stage.appendChild(h('div', 'mgzl', '中文')); stage.appendChild(zh); stage.appendChild(wand); card.appendChild(stage);
    var sum = h('div', 'mgsum', '<span>① <b>Is</b> 跳到 最前面（I 大寫）</span><span>② <b>' + esc(t[0][0].toLowerCase()) + '</b> 緊跟 在 Is 後面</span><span>③ <b>.</b> 變成 <b>?</b>　中文 加「嗎」</span>'); card.appendChild(sum);
    card.appendChild(h('div', 'rvcnt', S.once ? '🔊 <i>1</i>' : '🔊 <i>1</i><i>2</i>'));
    st.appendChild(card); fit(card);
    var all = cards.concat([pc]), k = 0, say = function (m) { cap.innerHTML = m; cap.classList.remove('in'); void cap.offsetWidth; cap.classList.add('in'); };
    var cnt = function (n) { var q = card.querySelectorAll('.rvcnt i'); q[n] && q[n].classList.add('on'); };
    var iH = 0, iIs = 1;   /* 第 1 個 字 ＝ He／She、第 2 個 ＝ is */
    function flip(els, fn) { var a = els.map(function (e) { return e.getBoundingClientRect(); }); fn(); els.forEach(function (e, j) { var b = e.getBoundingClientRect(); e.style.transition = 'none'; e.style.transform = 'translate(' + (a[j].left - b.left).toFixed(1) + 'px,' + (a[j].top - b.top).toFixed(1) + 'px)'; void e.offsetWidth; e.style.transition = 'transform 1.1s cubic-bezier(.45,1.5,.5,1)'; e.style.transform = ''; }); }
    (function pop() { if (k < all.length) { all[k].classList.add('in'); if (zs[k]) zs[k].classList.add('in'); if (k === all.length - 1) zp.classList.add('in'); k++; TT(pop, 380); return; }
      say('📢 直述句：在 說 一件 事'); TT(step1, 400); })();
    function step1() { cnt(0); read(c.en, c.v, cards, function () { pc.classList.add('pp'); TT(step2, 900); }); }
    function step2() { say('🪄 加 一個 魔法 ➜ 變成 問句！'); stage.classList.add('wave');
      var a = cards[iH].getBoundingClientRect(), b = cards[iIs].getBoundingClientRect(), r = stage.getBoundingClientRect();
      wand.style.left = (a.left - r.left - 20) + 'px'; wand.style.top = (a.top - r.top - 50) + 'px'; wand.classList.add('go'); wand.style.setProperty('--dx', (b.right - a.left) + 'px');
      cards[iH].classList.add('glow'); cards[iIs].classList.add('glow');
      TT(step3, 1700); }
    function step3() { say('① <b>Is</b> 跳到 最前面　② <b>' + esc(t[iH][0].toLowerCase()) + '</b> 緊跟 在 Is 後面'); var A = cards[iH], B = cards[iIs];
      flip([A, B], function () { en.insertBefore(B, A); });
      TT(function () { var bA = A.querySelector('b'), bB = B.querySelector('b'); bA.innerHTML = ap(t[iH][0].charAt(0).toLowerCase() + t[iH][0].slice(1)); bB.innerHTML = '<span class="mgcp">' + esc(t[iIs][0].charAt(0).toUpperCase()) + '</span>' + esc(t[iIs][0].slice(1)); A.setAttribute('data-w', t[iH][0].toLowerCase()); B.setAttribute('data-w', 'Is'); B.classList.add('cap'); }, 650);
      TT(step4, 2600); }
    function step4() { say('③ 句點 <b>.</b> 變成 問號 <b>?</b>'); pc.classList.remove('pp'); pc.classList.add('fly'); TT(function () { pc.querySelector('b').textContent = '?'; pc.classList.add('q'); }, 600); TT(step5, 2400); }
    function step5() { say('中文：順序 不變，最後 加 <b>嗎</b>'); zp.innerHTML = '<b class="mgma">嗎</b>？'; zp.classList.add('ma'); TT(step6, 2400); }
    function step6() { cards.forEach(function (x) { x.classList.remove('glow'); }); say('🔊 ' + esc(c.en2));
      var ord = [].slice.call(en.querySelectorAll('.mgk')).filter(function (x) { return x !== pc; });
      cnt(0); read(c.en2, c.v2 != null ? c.v2 : c.v, ord, function () { pc.classList.add('pp'); if (S.once) { fin(); return; } TT(function () { cnt(1); read(c.en2, c.v2 != null ? c.v2 : c.v, ord, fin); }, 700); }); }
    function fin() { sum.classList.add('on'); card.classList.add('z'); say('✨ 變身 完成！'); card.appendChild(h('div', 'rvz keepsp', esc(ZS(c.z)))); if (c.n) card.appendChild(h('div', 'rvn', '💡 ' + c.n)); fit(card); TT(function () { slot(2 * i + 1, function () { nxOpen(); }); }, 900); } }
  /* 唸 第 n 次（等句 ＝ 上面 一行 再 下面 一行）*/
  function readS(i, n) { var S = RVA.S, c = S.spec.sc[i], card = $id('rvs').querySelector('.rvcard'); if (!card) return;
    var cnt = card.querySelectorAll('.rvcnt i'); cnt[n] && cnt[n].classList.add('on');
    var rows = card.querySelectorAll('.rvrow'), c1 = [].slice.call(rows[0].children), fin = function () { if (n === 0) { card.classList.add('z'); T(function () { order(card, c); }, 500); } T(function () { slot(2 * i + n, function () { if (n === 0 && !S.once) T(function () { readS(i, 1); }, 650); else T(function () { nxOpen(); }, 400); }); }, n === 0 ? 900 : 500); };
    read(c.en, c.v, c1, function () { if (rows[1]) T(function () { read(c.en2, c.v2 != null ? c.v2 : c.v, [].slice.call(rows[1].children), fin); }, 450); else fin(); }); }
  /* 2026-11-03 第四十一次（老師 建議 1 乙）：學生 自己 按〔▶ 進入 下一頁〕；這一頁 全部 演完、唸完 才 解鎖（不會 看 到 睡著，也 不能 跳過）*/
  function nxLock() { var b = $id('rvnext'); if (!b) return; b.disabled = true; b.classList.remove('rdy', 'nud'); clearInterval(b._nud); b.innerHTML = '🔒 看完 才 能 按'; }
  function nxOpen() { var S = RVA.S, b = $id('rvnext'); if (!S || !b) return; if (window.__RVAUTO) { nextS(); return; } b.disabled = false; b.classList.add('rdy'); b.innerHTML = S.i + 1 < S.spec.sc.length ? '▶ 進入 下一頁' : '✅ 看完 了';
    /* 2026-11-03 第四十二次（老師）：停 太 久 不 按〔▶ 進入 下一頁〕＝ 每 15 秒 輕輕 放大 一次 提醒（暫停 的 時候 不 提醒、不 自己 換頁）*/
    clearInterval(b._nud); b._nud = setInterval(function () { if (!b.isConnected) { clearInterval(b._nud); return; } if (!RVA.S || b.disabled || RVA.S.pause) return; b.classList.remove('nud'); void b.offsetWidth; b.classList.add('nud'); }, window.__RVNUD || 15000); }
  function nextS() { var S = RVA.S; if (S.i + 1 < S.spec.sc.length) scene(S.i + 1); else finish(); }
  /* 這個 位置 有 排 突擊 測驗 嗎？ */
  function slot(s, go) { var S = RVA.S; if (S.plan[s] == null) { go(); return; } var qi = S.plan[s]; delete S.plan[s]; S.qpg = (s - 1) / 2 + 1;
    T(function () { quiz(qi, go); }, 1200); }   /* 第三十八次 第 11-(2) 點：這一頁 唸完 兩次、再 停 1.2 秒 才 考 */

  /* ③ ⚡ 突擊 測驗 */
  function quiz(qi, go) { var S = RVA.S, q = S.spec.qz[qi], st = $id('rvs'); stopAu(); $id('rvc').classList.add('hid'); S.qn = (S.qn || 0) + 1; S.qgo = go; S.q = q; S.qi = qi; S.ans = false;
    S.qwho = RVA.A.turn ? RVA.A.turn(S.qn - 1) : '';   /* 2026-11-01 第三十八次 第 5 點：兩人 輪流 ＝ 一人 一題 */
    var w = h('div', 'rvqz'), PR = { mc: 'Choose!', hear: 'Listen and choose!', hear2: 'Listen and choose!', tf: 'True or false?', dec: 'Match!', ord: 'Put in order!', spot: 'Find the mistake!' },
      HOW = { mc: '👆 點 一個 答案', hear: '🔊 聽 ➜ 👆 點 一個 答案', hear2: '🔊 先 聽 ➜ ① 點 第一個 字母 ➜ ② 點 對 的 圖', tf: '👆 對 ⭕ 還是 錯 ❌', dec: '👆 把 中文 方塊 放到 英文 字 下面（可以 拖、可以 互相 交換）', ord: '👆 照 順序 點 字（放好 的 字 可以 拖 來 交換）', spot: '👆 點 那一個 錯 的 字' };
    w.innerHTML = '<div class="rvqh"><span class="rvqf">⚡ 突擊 測驗！</span><span>第 ' + S.qn + ' ／ ' + S.nq + ' 題 · 列入 成績</span>' + (S.qpg ? '<span class="rvqpg">📍 考 剛剛 第 ' + S.qpg + ' 頁 的 重點</span>' : '') + (S.qwho ? '<span class="rvwho">👤 請 ' + String(S.qwho).slice(0, 3) + ' 班 ' + (+String(S.qwho).slice(3)) + ' 號 作答</span>' : '') + '</div><div class="rvqb"><i id="rvqt"></i></div>' +
      '<div class="rvqp">' + esc(PR[q.ty] || 'Choose!') + '</div><div class="rvqhow">' + HOW[q.ty] + '</div><div class="rvqa" id="rvqa"></div>';
    st.innerHTML = ''; st.appendChild(w); var A = $id('rvqa');
    if (q.pic) A.appendChild(h('div', 'rvqpic', q.pic));
    if (q.q) A.appendChild(h('div', 'rvqq', ap(q.q).replace(/___/g, '<u>　　　</u>')));
    if (q.s) { var hb = h('button', 'rvhear', '🔊 再聽一次'); hb.onclick = function () { read(q.s, q.v, [], null); }; A.appendChild(hb); T(function () { read(q.s, q.v, [], null); }, 500); }
    if (q.ty === 'mc' || q.ty === 'hear') { var ob = h('div', 'rvopts'); shuf(q.o.map(function (x, i) { return i; })).forEach(function (i) { var b = h('button', 'rvo', opi(q.o[i])); b.onclick = function () { judge(i === 0, i, q.o[i]); }; ob.appendChild(b); }); A.appendChild(ob); }
    if (q.ty === 'tf') { var tb = h('div', 'rvopts tf'); [[true, '⭕ True'], [false, '❌ False']].forEach(function (x) { var b = h('button', 'rvo', x[1]); b.onclick = function () { judge(x[0] === q.ok, x[0] === q.ok ? 0 : 1, x[1]); }; tb.appendChild(b); }); A.appendChild(tb); }
    if (q.ty === 'spot') { var sb = h('div', 'rvspot'); q.w.forEach(function (x, i) { var b = h('button', 'rvsw', ap(x)); b.onclick = function () { judge(i === q.bad, i === q.bad ? 0 : 1, x); }; sb.appendChild(b); }); A.appendChild(sb); }
    if (q.ty === 'hear2') h2Q(q, A);
    if (q.ty === 'dec') decQ(q, A);
    if (q.ty === 'ord') ordQ(q, A);
    fit(w);
    /* 每題 20 秒（放慢 ＝ 30 秒）；暫停 鈕 收起來，時間 不停 */
    var qt = RVA.QT * (S.slow ? 1.5 : 1) * 1000, t0 = Date.now(), my = S.gen, qn = S.qn; S.qt0 = t0;
    (function tk() { if (!RVA.S || RVA.S.gen !== my || S.ans || S.qn !== qn) return; var l = 1 - (Date.now() - t0) / qt, b = $id('rvqt'); if (b) b.style.transform = 'scaleX(' + Math.max(0, l) + ')'; if (l <= 0) { judge(false, -1, null); return; } requestAnimationFrame(tk); })(); }
  /* hear2（2026-11-01 第三十八次 第 11-(10)-1 點）：字首音 一律 先 聽 ➜ ① 選 第一個 字母（q.o，第 0 個 對）➜ ② 再 選 這個 字 的 圖（q.p，第 0 個 對）；兩步 都 對 才 算 答對 */
  function h2Q(q, A) { var ob = h('div', 'rvopts h2'), st1 = h('div', 'rvh2s', '<b>①</b> 第一個 字母'); A.appendChild(st1);
    shuf(q.o.map(function (x, i) { return i; })).forEach(function (i) { var b = h('button', 'rvo rvol', ap(q.o[i])); b.onclick = function () { if (RVA.S.ans) return;
      if (i !== 0) { judge(false, i, q.o[i]); return; } b.classList.add('ok1'); [].forEach.call(ob.children, function (x) { x.disabled = true; });
      T(function () { st1.innerHTML = '<b>②</b> ' + esc(q.o[0]) + ' ✅ ➜ 這個 字 是 哪一個 圖？'; ob.innerHTML = ''; ob.className = 'rvopts h2p';
        shuf(q.p.map(function (x, j) { return j; })).forEach(function (j) { var c = h('button', 'rvo rvop', q.p[j]); c.onclick = function () { judge(j === 0, j === 0 ? 0 : j, q.p[j]); }; ob.appendChild(c); }); fit($id('rvs').querySelector('.rvqz')); }, 700); }; ob.appendChild(b); });
    A.appendChild(ob); }
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
    S.rows.push([ok ? 1 : 0, ci, Math.round(sec * 10) / 10, pick != null && sec < 1 ? 1 : 0, 0, S.qi]); (S.own = S.own || []).push(S.qwho || '');
    var n = $id('rvn'); if (n) n.textContent = S.rows.filter(function (x) { return x[0]; }).length + ' ✅ ／ ' + S.nq;
    if (ok) { var st = $id('rvs'), g = h('div', 'rvok', '<b>✅ 答對了！</b>' + (q.a.t ? '' : '')); st.appendChild(g);
      var gr = row(q.a.t, 'okr'); g.appendChild(gr); T(function () { read(q.a.en, q.a.v, [].slice.call(gr.children), function () { T(back2, 600); }); }, 400); return; }
    T(function () { fb(q, ci, pick); }, 500); }
  function back2() { var S = RVA.S; if (!S) return; var go = S.qgo; S.qgo = null; $id('rvc').classList.remove('hid'); if (S.i >= 0 && S.i < S.spec.sc.length) redraw(); go && go(); }
  /* 回到 動畫：這一頁 重新 畫（字 都 已經 出來）*/
  function redraw() { var S = RVA.S, i = S.i, c = S.spec.sc[i], st = $id('rvs'); st.innerHTML = ''; var card = h('div', 'rvcard z' + (c.t2 ? ' eq' : ''), '');
    card.appendChild(h('div', 'rvh', '<span>重點 ' + (i + 1) + '</span>' + esc(c.h))); if (c.pic) card.appendChild(h('div', 'rvpic', c.pic)); if (c.g4 && window.HW) card.appendChild(grid4(c, 1)); else if (c.big) card.appendChild(h('div', 'rvbig', ap(c.big)));
    card.appendChild(row(c.t)); if (c.mis) card.appendChild(h('div', 'rvmis on', '<span class="rvmx">❌</span><span class="rvmb"><s>' + ap(c.mis) + '</s><i class="keepsp">' + esc(ZS(c.misz || '')) + '</i></span><span class="rvmw">' + esc(c.misw || '') + '</span>'));
    if (c.t2) { var w2 = h('div', 'rveq' + (c.mis ? ' rvok' : '')); w2.appendChild(h('span', 'rveqs', c.mis ? '✅' : (c.sym || (c.vs ? '⇄' : '＝')))); w2.appendChild(row(c.t2, 'r2')); card.appendChild(w2); }
    card.appendChild(h('div', 'rvz keepsp', esc(ZS(c.z)))); if (c.n) card.appendChild(h('div', 'rvn', '💡 ' + c.n)); card.appendChild(h('div', 'rvcnt', '🔊 <i class="on">1</i><i>2</i>'));
    [].forEach.call(card.querySelectorAll('.rvk'), function (k) { k.classList.add('in'); }); flMark(card, c); st.appendChild(card); fit(card); T(function () { order(card, c); }, 200); }
  /* 2026-11-01 第三十八次 第 11-(10)-2 點 中英 語序：英文 What／Who／Is 在 最 前面，中文「什麼」「誰」「嗎」在 後面 ➜
     英文 那個 字 框 起來、整句 中文 的 那個 詞 框 起來、從 英文 拉 一條 箭頭 到 中文（What’s your name?、Who’s he?、Who’s she?、Is he a doctor?、Is she a nurse? 都 會）*/
  /* 2026-11-02 第四十次 第 3-(1) 點（老師：What／什麼 的 方框＋箭頭 沒有 學習 意義、干擾 視覺）➜ 拿掉 箭頭；
     換成 跟 三、四年級「中英 語序」卡 一樣 的 做法：英文 一個 字 一張 彩色 卡，中文 同 一個 意思 ＝ 同 一個 顏色；
     中文 卡 先 排 在 自己 的 英文 字 正下方 ➜ 再 滑 到 中文 的 順序（What’s your name? ➜ 你的 名字 是 什麼？；Who’s he? ➜ 他 是 誰？；Is he a doctor? ➜ 他 是 一位 醫生 嗎？）
     只 演 英文 和 中文 順序 不一樣 的 句子（第一個 字 What／Who／Is）。 */
  var SOC = ['#C62828', '#C98A00', '#1565C0', '#1E8A4C', '#7B3FB8', '#00838F', '#AD5A00'];
  var POSS = { your: 1, my: 1, his: 1, her: 1 };
  function zhOrder(t) { var w0 = String(t[0][0]).replace(/[?.!]/g, ''), n = t.length, ix = t.map(function (p, i) { return i; });
    if ((w0 === 'What' || w0 === 'Who') && n >= 3 && /^’s/.test(t[1][0])) return { o: ix.slice(2).concat([1, 0]), ma: 0 };
    if (w0 === 'Is' && n >= 3) { var e = POSS[String(t[1][0]).toLowerCase()] && n >= 4 ? 3 : 2, o = ix.slice(1, e).concat([0]).concat(ix.slice(e)); return { o: o, ma: 1 }; }
    return null; }
  function order(card, c) { if (!card.parentNode || card.querySelector('.rvso') || !c.t || c.mis) return; var Z = zhOrder(c.t); if (!Z) return;
    var t = c.t, so = h('div', 'rvso', ''), en = h('div', 'rvsr', '<span class="rvsl">英文</span>'), zh = h('div', 'rvsr', '<span class="rvsl">中文</span>'), qm = /\?$/.test(t[t.length - 1][0]);
    var ec = t.map(function (p, i) { var b = h('span', 'rvsc', '<b>' + ap(String(p[0]).replace(/[?.!]$/, '')) + '</b>'); b.style.background = SOC[i % SOC.length]; en.appendChild(b); return b; });
    if (qm) en.appendChild(h('span', 'rvsc q', '<b>?</b>'));
    var zc = Z.o.map(function (i) { var b = h('span', 'rvsc', '<b>' + esc(t[i][1]) + '</b>'); b.style.background = SOC[i % SOC.length]; b._i = i; zh.appendChild(b); return b; });
    var ma = Z.ma ? h('span', 'rvsc ma', '<b>嗎</b>') : null; if (ma) zh.appendChild(ma); if (qm) zh.appendChild(h('span', 'rvsc q', '<b>？</b>'));
    so.appendChild(en); so.appendChild(zh); so.appendChild(h('div', 'rvst2', '👀 中文 的 順序 不一樣！'));
    var zEl = card.querySelector('.rvz'); card.insertBefore(so, zEl); fit(card);
    /* 中文 卡 先 移到 自己 的 英文 字 正下方 ➜ 1 秒 後 滑 到 中文 順序 */
    zc.forEach(function (b) { var a = ec[b._i].getBoundingClientRect(), r = b.getBoundingClientRect(); b.style.transition = 'none'; b.style.transform = 'translateX(' + ((a.left + a.width / 2) - (r.left + r.width / 2)).toFixed(1) + 'px)'; });
    if (ma) { ma.style.opacity = '0'; ma.style.transform = 'scale(.3)'; }
    void so.offsetWidth; so.classList.add('in');
    T(function () { zc.forEach(function (b, k) { b.style.transition = 'transform .9s cubic-bezier(.5,1.4,.5,1) ' + (k * .12).toFixed(2) + 's'; b.style.transform = 'none'; });
      T(function () { if (ma) { ma.style.transition = 'opacity .3s,transform .5s cubic-bezier(.3,1.8,.5,1)'; ma.style.opacity = '1'; ma.style.transform = 'none'; } so.classList.add('done'); }, 1100); }, 1000); }
  /* 2026-11-02 第四十次 第 4-(3) 點：迷思 概念 頁（c.mis）＝ 問句 ➜ ❌ 常見 的 錯 回答（劃掉、抖、說 為什麼）➜ ✅ 對 的 回答 */
  function misShow(card, c) { var m = card.querySelector('.rvmis'); if (m) m.classList.add('on'); }
  /* 2026-11-01 第三十八次 第 11-(7) 點：字首音 的 頁（大 字母 c.big、聲音 雙胞胎 m2）＝ 每一個 英文 字 的 第一個 字母 稍微 放大、放亮、框 起來 */
  /* 2026-11-01 第三十八次 第 11-(10)-6 點：標準 四線格（底線 紅線）＋ 一筆 一筆 畫 出來 的 字母（筆畫 ＝ 手寫 改 字 同 一份 HW.T）
     c.g4 ＝ 要 畫 的 字母、c.g4f ＝ 左邊 標 2F／1F／B1（大寫 住 一樓 二樓；g j p q y 腳 住 地下一樓）、c.g4t ＝ 字母 下面 的 字（拒 絕 屁 股 歪）、c.g4x ＝ 超線 的 錯 示範 */
  function grid4(c, now) { var NS = 'http://www.w3.org/2000/svg', L = String(c.g4).split(''), xs = [], X = 0;
    L.forEach(function (ch) { var st = (HW.T[ch] || [[]])[0], mn = 9, mx = -9; st.forEach(function (s) { s.forEach(function (p) { mn = Math.min(mn, p[0]); mx = Math.max(mx, p[0]); }); }); if (mn > mx) { mn = 0; mx = .6; } xs.push([X - mn, ch, st]); X += (mx - mn) + .55; });
    var lw = c.g4f ? .9 : .3, W = lw + X + .2, Hh = 3.6, sv = document.createElementNS(NS, 'svg'); sv.setAttribute('viewBox', '0 -0.3 ' + W + ' ' + Hh); sv.setAttribute('class', 'rv4l');
    var g = '';[0, 1, 2, 3].forEach(function (y) { g += '<line x1="' + (lw - .1) + '" x2="' + (W - .05) + '" y1="' + y + '" y2="' + y + '" stroke="' + (y === 2 ? '#FF5A5A' : '#9FB4C8') + '" stroke-width="' + (y === 2 ? .07 : .04) + '"/>'; });
    if (c.g4f) [['2F', .5], ['1F', 1.5], ['B1', 2.5]].forEach(function (f) { g += '<text x="' + (lw / 2 - .05) + '" y="' + (f[1] + .14) + '" font-size=".42" text-anchor="middle" fill="' + (f[0] === 'B1' ? '#FFB347' : '#BFE8FF') + '" font-weight="700">' + f[0] + '</text>'; });
    var d = 0; xs.forEach(function (x, k) { var ox = lw + x[0], bad = c.g4x === k, dy = bad ? .45 : 0;
      x[2].forEach(function (s) { var p = s.map(function (q) { return (ox + q[0]).toFixed(3) + ',' + (q[1] + dy).toFixed(3); }).join(' ');
        g += '<polyline class="rv4s" style="--d:' + (d * .35).toFixed(2) + 's" points="' + p + '" fill="none" stroke="' + (bad ? '#FF5A5A' : '#FFFFFF') + '" stroke-width=".13" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>'; d++; });
      if (bad) g += '<text x="' + (ox + .3) + '" y="3.25" font-size=".4" fill="#FF5A5A" font-weight="700">❌ 超線</text>';
      if (c.g4t && c.g4t[k]) g += '<text x="' + (ox + .3) + '" y="3.32" font-size=".42" text-anchor="middle" fill="#FFE07A" font-weight="700">' + c.g4t[k] + '</text>'; });
    sv.innerHTML = g; if (now) [].forEach.call(sv.querySelectorAll('.rv4s'), function (p) { p.style.animation = 'none'; p.style.strokeDashoffset = 0; }); return sv; }
  /* 第三十八次 第 10-(1) 點：縮寫 頁（What is ＝ What’s、Who is ＝ Who’s …）is 的 i 紅色 */
  function isRed(card, c) { if (!c.en2 || !/’s|'s/.test(c.en2) || !/\bis\b/.test(c.en)) return; [].forEach.call(card.querySelectorAll('.rvrow:not(.r2) .rvk'), function (k) { if (k.getAttribute('data-w') === 'is') { var b = k.querySelector('b'); b.innerHTML = '<span class="rvri">i</span>s'; } }); }
  /* 第三十八次 第 11-(10)-3 點：📋 資料表 的 關鍵字 框 起來，不同 重點 不同 顏色（c.kw ＝ {字: 1 名字 藍、2 年齡 橘、3 also 綠}）*/
  function kwMark(card, c) { if (!c.kw) return; [].forEach.call(card.querySelectorAll('.rvk'), function (k) { var n = c.kw[k.getAttribute('data-w')]; if (n) k.classList.add('rvkw', 'kw' + n); }); }
  function flMark(card, c) { isRed(card, c); kwMark(card, c); var S = RVA.S; if (!S || !((c.big && /^[a-z]$/i.test(c.big)) || S.spec.id === 'm2')) return;
    [].forEach.call(card.querySelectorAll('.rvk b'), function (b) { b.innerHTML = b.innerHTML.replace(/^([A-Za-z])/, '<span class="rvfl">$1</span>'); }); }

  /* 答錯頁（照 正式 題目 的 答錯頁：綠底、你 的 答案、正確 答案 逐字 中文、整句、💡、唸 3 次 唸到 哪 亮到 哪、〔🔊 再聽一次〕）*/
  function fb(q, ci, pick) { var S = RVA.S, o = h('div', 'rvfb', ''), you = pick == null ? '' : Array.isArray(pick) ? pick.join('　') : String(pick);
    o.innerHTML = '<div class="rvfx"><div class="hd">' + (ci === -1 ? '⏰ 時間到' : '❌ 答錯了') + '</div>' + (you ? '<div class="yp">你的答案：<s>' + ap(you) + '</s></div>' : '') +
      '<div class="ca">✅ 正確答案</div><div class="gl" id="rvgl"></div><div class="tr keepsp">整句：' + esc(ZS(q.a.z)) + '</div>' + (q.a.why ? '<div class="why">💡 ' + esc(q.a.why) + '</div>' : '') +
      '<div class="ft"><span class="n3"><i>1</i><i>2</i></span><button class="say" id="rvfs">🔊 再聽一次</button><span id="rvnx"></span></div></div>';
    $id('rva').appendChild(o); var gl = $id('rvgl'), r = row(q.a.t, 'fbr'); gl.appendChild(r); [].forEach.call(r.children, function (k) { k.classList.add('in'); });
    var cells = [].slice.call(r.children), c = 0, gen = S.gen;
    o.querySelector('#rvfs').onclick = function () { read(q.a.en, q.a.v, cells, null); };
    function one() { if (!RVA.S || RVA.S.gen !== gen) return; if (c >= 2) { var b = h('button', 'nx', '▶ 繼續 看 動畫');   /* 第四十四次 第 2-(1) 點：答錯頁 只 唸 兩次 */ $id('rvnx').appendChild(b); b.onclick = function () { o.remove(); back2(); }; return; }
      o.querySelectorAll('.n3 i')[c].classList.add('on'); c++; read(q.a.en, q.a.v, cells, function () { T(one, 650); }); }
    T(one, 500); }

  /* ⑤ 看完 */
  function finish() { var S = RVA.S, ok = S.rows.filter(function (x) { return x[0]; }).length, st = $id('rvs'); $id('rvc').classList.add('hid'); $id('rvp').textContent = '';
    try { ls(S.key, JSON.stringify(S.seen.slice(-60))); ls(S.vk, '1'); } catch (e) { }
    RVA.odd = S.rows.length % 2;   /* 兩人 輪流：各 送 各 的 */
    try { if (S.rows.length && RVA.A.send) { var own = S.own || [], who = {}; own.forEach(function (w) { who[w] = 1; }); Object.keys(who).forEach(function (w) { var rr = S.rows.filter(function (r, i) { return (own[i] || '') === w; }); RVA.A.send(rr, S.spec, Math.round((Date.now() - S.t0) / 1000), w); }); } } catch (e) { }
    st.innerHTML = '<div class="rvend"><div class="rve0">🎉</div><div class="rve1">看完 了！</div>' + (S.nq ? '<div class="rve2">⚡ 突擊 測驗：答對 <b>' + ok + '</b> ／ ' + S.rows.length + '</div><div class="rve3">' + (ok === S.rows.length ? '👀 全部 答對：你 真的 很 專心！' : '📌 答錯 的 重點，等一下 的 題目 會 用到！') + '</div>' : '<div class="rve3">📌 剛剛 的 重點，等一下 的 題目 會 用到！</div>') + '<button class="rvgo rdy" id="rvend">▶ 開始 這一關</button></div>';
    var go = function () { var d = S.done; RVA.close(); d && d(); }; $id('rvend').onclick = go; }

  /* 按鈕 */
  document.addEventListener('click', function (e) { var S = RVA.S; if (!S) return; var t = e.target.closest ? e.target.closest('[data-rv],#rvgo') : null; if (!t) return;
    if (t.id === 'rvgo') { if (t.disabled) return; scene(0); return; }
    var k = t.getAttribute('data-rv');
    if (k === 'pause') { S.pause = !S.pause; t.textContent = S.pause ? '▶ 繼續' : '⏸️ 暫停'; t.classList.toggle('on', S.pause); document.body.classList.toggle('rvpz', S.pause);
      if (S.pause) { pauseAll(); try { el().pause(); } catch (x) { } try { speechSynthesis.pause(); } catch (x) { } } else { resumeAll(); try { var a = el(); if (a.src && a.currentTime > 0 && !a.ended) a.play(); } catch (x) { } try { speechSynthesis.resume(); } catch (x) { } } }
    if (k === 'slow') { S.slow = !S.slow; t.textContent = S.slow ? '🐇 正常' : '🐢 放慢'; t.classList.toggle('on', S.slow); try { el().playbackRate = S.slow ? .75 : 1; } catch (x) { } }
    if (k === 'next') { if (t.disabled) return; nxLock(); S.tm.forEach(function (it) { clearTimeout(it.id); }); S.tm = []; nextS(); return; }
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
.rvc button.rvnx{min-width:220px;border-color:#4A5A6E;background:#1A2230;color:#8C9AAE}
.rvmag .mgst{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:6px 4px 4px}
.rvmag .mgcap{min-height:1.4em;font-size:clamp(22px,3.3vh,34px);font-weight:700;color:#FFE58A;text-align:center;opacity:0}.rvmag .mgcap.in{animation:mgCap .5s both}.rvmag .mgcap b{color:#fff;font-size:1.15em}
@keyframes mgCap{0%{opacity:0;transform:translateY(10px) scale(.9)}100%{opacity:1;transform:none}}
.rvmag .mgen{display:flex;gap:clamp(8px,1.4vw,16px);align-items:flex-end;justify-content:center;flex-wrap:nowrap}
.rvmag .mgk{display:flex;flex-direction:column;align-items:center;border-radius:16px;padding:8px clamp(12px,1.6vw,22px) 6px;color:#fff;opacity:0;transform:scale(.4);box-shadow:inset 0 2px 0 rgba(255,255,255,.3),0 6px 0 rgba(0,0,0,.35)}
.rvmag .mgk.in{opacity:1;transform:none;transition:opacity .3s,transform .45s cubic-bezier(.3,1.7,.5,1)}
.rvmag .mgk b{font-size:calc(clamp(44px,8.5vh,88px)*var(--rz,1));line-height:1.1;font-weight:700}.rvmag .mgk i{font-style:normal;font-size:calc(clamp(22px,3.4vh,34px)*var(--rz,1));color:#FFF6D0;line-height:1.2}
.rvmag .mgk.spk{filter:brightness(1.3);transform:scale(1.1)}
.rvmag .mgk.glow{box-shadow:0 0 0 5px #FFE58A,0 0 30px #FFD54A,0 6px 0 rgba(0,0,0,.35)}
.rvmag .mgcp{display:inline-block;color:#FFF;text-shadow:0 0 12px #fff,0 0 24px #FFE58A;animation:mgCp 1.4s ease-in-out 2}@keyframes mgCp{50%{transform:scale(1.5)}}
.rvmag .mgp{min-width:1.4em}.rvmag .mgp.pp b{animation:mgPp .9s}@keyframes mgPp{50%{transform:scale(1.8);color:#FFE58A}}
.rvmag .mgp.fly{animation:mgFly 1.5s cubic-bezier(.4,1.4,.5,1)}@keyframes mgFly{0%{transform:none}40%{transform:translateY(-70px) rotate(360deg) scale(1.6)}100%{transform:none}}
.rvmag .mgp.q{background:#E0A030!important;box-shadow:0 0 0 5px #FFE58A,0 0 34px #FFD54A}.rvmag .mgp.q b{color:#3A2600}
.rvmag .mgzl{font-size:18px;color:#9FB0C8;margin-top:6px}
.rvmag .mgzh{display:flex;gap:.5em;font-size:calc(clamp(34px,6vh,60px)*var(--rz,1));font-weight:700}.rvmag .mgz{opacity:0}.rvmag .mgz.in{opacity:1;transition:opacity .4s}
.rvmag .mgzp.ma{color:#FFE58A}.rvmag .mgma{display:inline-block;padding:0 .15em;border-radius:10px;box-shadow:0 0 0 4px #FFE58A,0 0 22px #FFD54A;animation:mgMa .8s cubic-bezier(.3,1.8,.5,1)}@keyframes mgMa{0%{transform:scale(0)}100%{transform:none}}
.rvmag .mgwd{position:absolute;left:0;top:0;font-size:58px;opacity:0;pointer-events:none;filter:drop-shadow(0 0 12px #FFE58A)}
.rvmag .mgwd.go{animation:mgWd 1.6s ease-in-out both}@keyframes mgWd{0%{opacity:0;transform:rotate(-30deg)}15%{opacity:1}70%{opacity:1;transform:translateX(var(--dx,200px)) rotate(25deg)}100%{opacity:0;transform:translateX(var(--dx,200px)) rotate(25deg) scale(1.3)}}
.rvmag .mgst.wave:after{content:'✨ ✨ ✨';position:absolute;top:34%;left:0;right:0;text-align:center;font-size:40px;animation:mgSp 1.6s both;pointer-events:none}@keyframes mgSp{0%,100%{opacity:0}40%{opacity:1;transform:scale(1.3)}}
.rvmag .mgsum{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px;opacity:0}.rvmag .mgsum.on{opacity:1;transition:opacity .5s}
.rvmag .mgsum span{font-size:clamp(19px,2.6vh,26px);padding:6px 14px;border-radius:12px;background:#1B2A40;border:2px solid #FFD54A;color:#fff}.rvmag .mgsum b{color:#FFE58A;font-size:1.2em}
.rvc button.rvnx.nud{animation:rvNud 1.1s ease-in-out}@keyframes rvNud{0%,100%{transform:scale(1)}45%{transform:scale(1.14)}}
.rvc button.rvnx.rdy{border-color:#7BF0A8;background:linear-gradient(#36D27A,#1E9E55);color:#06210F;font-size:clamp(22px,3vh,30px);box-shadow:0 0 0 4px rgba(123,240,168,.35),0 0 22px rgba(57,217,138,.75)}
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
.rvfl{display:inline-block;padding:0 .06em;margin-right:.03em;border:.07em solid #FFD54A;border-radius:.16em;color:#FFE07A;font-size:1.16em;line-height:1;text-shadow:0 0 .25em rgba(255,214,90,.8);background:rgba(255,213,74,.12)}
.rvk.ct{margin-left:calc(var(--rz) * -1 * clamp(8px,1.4vw,20px))}
.rvk.spk b{transform:scale(1.14);color:#FFF6C8;text-shadow:0 0 18px rgba(255,236,150,.9)}.rvk.spk i{color:#fff}
.rvap{color:#FF5252}
.rveq{display:flex;align-items:flex-start;gap:calc(var(--rz) * 12px)}.rveqs{font-size:calc(var(--rz) * clamp(40px,7vh,72px));color:#FFB300;font-weight:700;line-height:1.15}
.rvz,.rvn{opacity:0;transition:opacity .5s}.rvcard{position:relative}.rvarw{position:absolute;left:0;top:0;pointer-events:none;overflow:visible;z-index:3}.rvri{color:#FF5A5A}.rv4l{display:block;width:min(96%,calc(var(--rz) * 640px));height:auto;max-height:calc(var(--rz) * clamp(140px,26vh,260px));background:#0B1424;border-radius:14px}.rv4s{stroke-dasharray:1;stroke-dashoffset:1;animation:rv4d .5s ease forwards;animation-delay:var(--d)}@keyframes rv4d{to{stroke-dashoffset:0}}.rvk.rvkw b{border-radius:.16em;padding:0 .08em;outline:.08em solid;outline-offset:.04em}.rvk.kw1 b{outline-color:#5EC8FF;color:#BFE8FF}.rvk.kw2 b{outline-color:#FFB347;color:#FFE0B8}.rvk.kw3 b{outline-color:#5BE38A;color:#C9FFD9}.rvk b.rvbx{outline:.07em solid #FFD54A;outline-offset:.06em;border-radius:.12em}.rvzb{display:inline-block;padding:0 .12em;border:.08em solid #FFD54A;border-radius:.2em;color:#FFE07A}.rvcard.z .rvz,.rvcard.z .rvn{opacity:1}
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
.rvqz{--rz:1;width:min(100%,1180px);max-height:100%;overflow-y:auto;background:linear-gradient(180deg,#2A0F44,#16082A);border:4px solid #C08BFF;border-radius:26px;padding:clamp(10px,1.8vh,20px) clamp(12px,2.2vw,28px);display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.2vh,12px);animation:rvZap .6s}
@keyframes rvZap{0%{transform:scale(1.25);opacity:0;filter:brightness(3)}40%{transform:scale(.96);opacity:1}60%{transform:translateX(-8px)}80%{transform:translateX(6px)}}
.rvqh{display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center;font-size:clamp(17px,2.4vh,24px);font-weight:700;color:#E6D2FF}
.rvqf{font-size:clamp(26px,4.2vh,44px);color:#FFE07A;text-shadow:0 0 16px rgba(255,200,0,.7);animation:rvFl .5s 3}@keyframes rvFl{50%{opacity:.35}}
.rvqb{width:100%;height:12px;background:#33204A;border-radius:6px;overflow:hidden}.rvqb i{display:block;height:100%;background:linear-gradient(90deg,#3BD16F,#FFE07A);transform-origin:left}
.rvqp{font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(30px,5vh,52px));font-weight:700;color:#fff}
.rvqhow{font-size:clamp(18px,2.4vh,24px);color:#D6C2F2;font-weight:700}
.rvqa{display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,16px);width:100%}
.rvqpic{font-size:calc(var(--rz) * clamp(80px,13vh,140px));line-height:1.1}.rvqpic svg{height:1.2em;width:auto}
.rvqq{font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(34px,6vh,64px));font-weight:700;text-align:center;line-height:1.25}.rvqq u{text-decoration:none;border-bottom:4px solid #FFE07A;display:inline-block;min-width:2.4em}
.rvopts{display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,1.4vh,14px);width:min(100%,960px)}.rvopts.tf{width:min(100%,640px)}
.rvo{min-height:clamp(64px,10vh,96px);font-family:Andika,sans-serif;font-size:calc(var(--rz) * clamp(26px,4.4vh,44px));font-weight:700;border-radius:18px;border:4px solid #8A6BC8;background:#24123E;color:#fff;cursor:pointer;padding:4px 12px}
.rvo:active{transform:scale(.97)}.rvh2s{font-size:calc(var(--rz) * clamp(24px,3.6vh,36px));font-weight:700;color:#FFE07A}.rvh2s b{display:inline-block;width:1.5em;height:1.5em;line-height:1.5em;border-radius:50%;background:#FFD54A;color:#2A1A00;text-align:center}.rvol{font-size:calc(var(--rz) * clamp(40px,7vh,70px))}.rvop{font-size:calc(var(--rz) * clamp(56px,10vh,100px));line-height:1.1}.rvo.ok1{background:#1E9E55;border-color:#7CFFB0}.rvoi{display:inline-block;font-size:2em;line-height:1;vertical-align:middle;margin-right:.15em}.rvqpg{display:inline-block;margin-left:10px;padding:2px 12px;border-radius:999px;background:#0E2A44;border:2px solid #5EC8FF;color:#CFEFFF}
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
.rvok{--rz:1;position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:rgba(6,40,20,.94);border-radius:26px;animation:rvIn .4s}
.rvok>b{font-size:clamp(40px,7vh,72px);color:#5BE38A}
.rvok .rvrow,.rvfx .rvrow{flex-wrap:wrap;gap:4px clamp(18px,2.4vw,34px)}.rvok .rvk b{font-size:clamp(44px,7.4vh,80px)}.rvok .rvk i{font-size:clamp(24px,3.8vh,40px)}.rvok .rvk.ct,.rvfx .rvk.ct{margin-left:calc(-1 * clamp(18px,2.4vw,34px))}
.rvfb{--rz:1;position:absolute;inset:0;z-index:9500;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);padding:12px}
.rvfx{width:min(100%,1180px);max-height:100%;overflow:auto;background:#0B3D1E;border:4px solid #3BD16F;border-radius:26px;padding:clamp(12px,2vh,24px) clamp(14px,2.4vw,30px);display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.4vh,14px);text-align:center}
.rvfx .hd{font-size:clamp(30px,5vh,52px);font-weight:700;color:#FFD0D0;animation:rvShk .5s}@keyframes rvShk{25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
.rvfx .yp{font-size:clamp(22px,3.2vh,32px);font-weight:700}.rvfx .yp s{color:#FF8A80;font-family:Andika,sans-serif}
.rvfx .ca{font-size:clamp(24px,3.6vh,36px);font-weight:700;color:#9FF0B5}.rvfx .tr{font-size:clamp(24px,3.6vh,38px);font-weight:700;color:#FFF4C2}.rvfx .why{font-size:clamp(20px,3vh,30px);font-weight:700;color:#FFD6A0}
.rvfx .rvrow{flex-wrap:wrap;gap:4px clamp(18px,2.4vw,34px)}.rvfx .rvk b{font-size:clamp(44px,7.4vh,80px)}.rvfx .rvk i{font-size:clamp(24px,3.8vh,40px)}   /* 2026-11-01 第三十八次 第 11-(8) 點：答錯頁 英文 字 放大、字 和 字 中間 空開 */
.rvfx .ft{display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center}
.rvfx .n3 i{font-style:normal;display:inline-block;width:1.8em;height:1.8em;line-height:1.8em;border-radius:50%;border:3px solid #3BD16F;margin:0 4px;font-size:clamp(17px,2.4vh,22px)}.rvfx .n3 i.on{background:#3BD16F;color:#002}
.rvfx .nx{min-height:64px;min-width:240px;font:inherit;font-size:clamp(22px,3.2vh,32px);font-weight:700;border-radius:18px;border:4px solid #B6FFCB;background:linear-gradient(#5BE38A,#22A84F);color:#022;cursor:pointer}
@media (max-aspect-ratio:1/1){.rvopts{grid-template-columns:1fr}.rvk b{font-size:calc(var(--rz) * clamp(34px,5.4vh,64px))}}
/* 第四十次 3-(2)：How old ＝ 幾歲、years old ＝ 歲：英文 一個 方框、正下方 中文 一個 方框 */
.rvk.ph b{outline:4px solid #FFD54A;outline-offset:2px;border-radius:12px;padding:0 8px}.rvk.ph i{outline:3px solid #FFD54A;outline-offset:2px;border-radius:10px;padding:0 8px;margin-top:8px;color:#FFE07A}
/* 第四十次 3-(1)：中英 語序 彩色 卡 */
.rvso{margin:10px auto 4px;padding:10px 14px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid #2C3A55;opacity:0;transform:translateY(10px);transition:opacity .4s,transform .4s;max-width:100%}
.rvso.in{opacity:1;transform:none}.rvsr{display:flex;align-items:center;justify-content:center;gap:calc(var(--rz,1) * 10px);margin:6px 0;flex-wrap:nowrap}
.rvsl{flex:none;width:2.6em;font-size:calc(var(--rz,1) * clamp(16px,2.2vh,22px));color:#BFD3E6;text-align:right;margin-right:6px}
.rvsc{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:2.2em;padding:calc(var(--rz,1) * 6px) calc(var(--rz,1) * 14px);border-radius:16px;box-shadow:0 5px 0 rgba(0,0,0,.35),inset 0 2px 0 rgba(255,255,255,.25);font-size:calc(var(--rz,1) * clamp(24px,3.6vh,40px));color:#fff;font-family:Andika,"Microsoft JhengHei",sans-serif;will-change:transform}
.rvsc.q{background:#3A3F48;color:#E8E8E8}.rvsc.ma{background:#455A64;outline:3px dashed #FFD54A}
.rvst2{text-align:center;font-size:calc(var(--rz,1) * clamp(18px,2.6vh,26px));color:#FFE07A;opacity:0;transition:opacity .4s}.rvso.done .rvst2{opacity:1}
/* 第四十次 4-(3)：迷思 概念 頁 */
.rvmis{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;margin:10px auto;padding:8px 16px;border-radius:18px;background:#3A1010;border:3px solid #FF5A5A;opacity:0;transform:scale(.6);transition:opacity .3s,transform .4s cubic-bezier(.3,1.6,.6,1);max-width:100%}
.rvmis.on{opacity:1;transform:none;animation:rvmS .5s .35s 2}@keyframes rvmS{25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
.rvmx{font-size:calc(var(--rz,1) * clamp(40px,6vh,64px))}.rvmb{display:flex;flex-direction:column;align-items:center}.rvmb s{font-family:Andika,sans-serif;font-size:calc(var(--rz,1) * clamp(30px,4.6vh,52px));color:#FFB4B4;text-decoration-thickness:4px;text-decoration-color:#FF5A5A}.rvmb i{font-style:normal;font-size:calc(var(--rz,1) * clamp(18px,2.6vh,26px));color:#FFC9C9}
.rvmw{font-size:calc(var(--rz,1) * clamp(20px,3vh,30px));color:#FFE07A;font-weight:700}
.rveq.rvwait{opacity:0}.rveq.rvok{transition:opacity .4s}.rveq.rvok .rveqs{font-size:calc(var(--rz,1) * clamp(34px,5vh,56px))}
@media (prefers-reduced-motion:reduce){.rvmis.on{animation:none}.rvsc{transition:none!important}}
@media (prefers-reduced-motion:reduce){.rvcard,.rvqz,.rvpic,.rvi0,.rve0,.rvr,.rvgo.rdy{animation:none!important}}
`;
/* 網頁 的 轉接：gr 'g3'／'g4'、set 成績 題組、name 名稱、R ＝ _rva_data.js 的 結果（list、NMAP）*/
function page(o) { const map = {}, off = {}; let k = 0; o.R.list.forEach(a => { map[a.id] = a; off[a.id] = k; k += a.qz.length; });
  const J = x => JSON.stringify(x).replace(/</g, '\\u003c');
  return 'var RVD=' + J(map) + ',RVOFF=' + J(off) + ',RVMAP=' + J(o.R.NMAP || {}) + ';' +
    'RVA.A={gr:' + J(o.gr) + ',sid:function(){return (typeof SCID!=="undefined"&&SCID)||""},stop:function(){try{stopSay()}catch(e){}},' +
    'aud:function(t,v){var k=akey(t),X=window.ENAUDR||{},W=window.ENAUDRW||{},p=(v==="m"?"m:":""),f=X[p+k]||X[k];if(f)return "audio/rv/"+f[0];f=W[p+k]||W[k];if(f)return "audio/rvw/"+f[0];var a=aud(t,v);return a||null},' +
    'turn:function(k){return typeof DUO!=="undefined"&&DUO&&window.DUOI?DUOI.turn(DUO,k):""},' +   /* 2026-11-01 第三十八次 第 5 點：兩人 輪流 ＝ 突擊 測驗 也 一人 一題 */
    'send:function(rows,spec,secs,who){try{var ID=who||SCID;if(typeof scLive!=="function"||!scLive()||!ID)return;var o=RVOFF[spec.id]||0,u=ID+Date.now().toString(36)+Math.random().toString(36).slice(2,6);' +
    'var Rr={id:ID,set:' + J(o.set) + ',name:' + J(o.name) + ',m:"g",qs:rows.map(function(r){return [r[0],r[1],r[2],r[3],r[4],o+r[5]]}),raw:rows.filter(function(r){return r[0]}).length,fix:0,mp:0,mw:0,sec:secs,src:"school",dev:SCDEV,u:u,t:Date.now()};' +
    'var QQ=scGet("q")||[];QQ.push(Rr);scPut("q",QQ.slice(-200));scFlush()}catch(e){}}};' +
    /* 每 換 一關（一個 題型）先 演；量測 設 window.__NORVA 跳過 */
    'function rvaGo(id,done){var s=RVD[id]||RVD[RVMAP[id]];if(!s||window.__NORVA||RVA.SKIP[s.id]||RVA.SKIP[id]||(typeof CR!=="undefined"&&CR&&CR.cfg&&!window.__RVLIVE)){done();return}if(typeof R!=="undefined"&&R&&R.qk){if(R.qkd){done();return}R.qkd=1}' +
    'var DU=typeof DUO!=="undefined"&&DUO;if(DU){DU.rv=DU.rv||{};if(DU.rv[s.id]){done();return}DU.rv[s.id]=1}' +   /* 兩人 輪流：同一部 動畫 只 演 一次；突擊 測驗 答了 單數 題 ＝ 下一題 換人 */
    'RVA.play(s,function(){if(DU&&RVA.odd&&typeof duoAfterRv==="function"&&duoAfterRv())return;done()})}' +
    'var _rvDc=decClose;decClose=function(){if(window.RVA)RVA.close();_rvDc()};'; }
module.exports = { page: page, css: CSS, js: 'var RVA=(function(){' + RVASRC.toString() + ';RVASRC();return window.RVA})();', SRC: RVASRC };
