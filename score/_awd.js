/* score/_awd.js — 🏆 頒獎 典禮 引擎（2026-11-03 老師 第四十二次 第 4 點；這次 先 用 在 ⚡ 現場任務 的 兩種 頒獎：期中 挑戰／字母 書寫、一般 現場任務）
 *
 * 老師：最 震撼、最 尊榮、最 精緻、最 華麗、最 閃耀；3D；高潮迭起：第 5 名 ➜ 第 4 名 ➜ 第 3 名 一層 一層 揭開，愈 後面 愈 懸疑；
 *       配樂 跟著 高潮 走；**每一次 的 動畫 和 配樂 完全 不同**；寫 班級 號碼＋中文 全名；下面 一排 按鈕 讓 老師 決定 要 不要 顯示 戰士、寵物、武器。
 *
 * 用法（網頁 端，ES5）：
 *   AWD.play(host, data, opt)   data ＝ { kick:'402 班', title:'📝 25 題 挑戰', rows:[{rk, code:'40203', nm:'高天宇', sc:'98 分', ln:'答對 24 題', h, p, w}] }（rk 由 小 到 大，同 分 同 名次）
 *                               opt ＝ { done:function(){} }；名次 1～5 才 上台，6～10 名 開場 一起 唸出來
 *   AWD.stop(host)             AWD.skip(host) ＝ 直接 到 最後 的 頒獎台
 *   AWD.bar()                  ＝ 下面 一排〔🦸 戰士〕〔🐾 寵物〕〔⚔ 武器〕〔🎵 配樂〕的 HTML（開／關 存 在 這台 電腦 localStorage awd_show）
 *
 * 每一次 都 不一樣：10 種 舞台 主題（顏色、粒子、燈光）✕ 8 種 揭曉 特效（每 一場 隨機 分給 第 5、4、3、2 名，不 重複）✕ 配樂（WebAudio 現場 合成：
 *   每 一場 隨機 調性 12 種、速度、和弦 進行 6 種、音色、旋律 動機 都 不一樣；鼓聲 滾奏 ➜ 揭曉 重擊 ➜ 心跳 懸疑 ➜ 冠軍 號角 ➜ 終曲）。
 *   跟 上一場 一定 不 同 一個 主題（localStorage awd_last）。沒有 音效 檔、不用 網路。量測：window.__AWDFAST ＝ 時間 ✕0.05。 */
function AWDSRC() {
  var A = {}, $ = function (h, s) { return h.querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function H(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  var ls = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  /* ── 10 種 舞台 主題 ── */
  A.TH = [
    { k: 'galaxy', nm: '🌌 星河 銀河', bg: 'radial-gradient(ellipse at 50% 20%,#3A1C7A 0,#120A35 45%,#03020C 100%)', c1: '#B98CFF', c2: '#6FE3FF', fl: '#6A4CFF', pt: ['#FFFFFF', '#B98CFF', '#6FE3FF', '#FFE58A'], em: '✨' },
    { k: 'lava', nm: '🌋 熔岩 火山', bg: 'radial-gradient(ellipse at 50% 90%,#8A1A00 0,#2A0700 50%,#0A0200 100%)', c1: '#FF7A1A', c2: '#FFD54A', fl: '#FF4A00', pt: ['#FF3D00', '#FF9100', '#FFD54A', '#FFFFFF'], em: '🔥' },
    { k: 'aurora', nm: '❄️ 極光 冰原', bg: 'linear-gradient(180deg,#02142A 0,#06344A 45%,#0B5A6A 75%,#DFF6FF 100%)', c1: '#7BFFD8', c2: '#9AD8FF', fl: '#7BFFD8', pt: ['#FFFFFF', '#7BFFD8', '#9AD8FF', '#C4B5FF'], em: '❄️' },
    { k: 'palace', nm: '👑 黃金 宮殿', bg: 'radial-gradient(ellipse at 50% 30%,#6B4A00 0,#2A1A00 55%,#0A0600 100%)', c1: '#FFD54A', c2: '#FFF3B0', fl: '#FFB300', pt: ['#FFD54A', '#FFF3B0', '#FFB300', '#FFFFFF'], em: '👑' },
    { k: 'neon', nm: '🌃 霓虹 城市', bg: 'linear-gradient(180deg,#0A0020 0,#20004A 55%,#3A0060 100%)', c1: '#FF3BD4', c2: '#3BF0FF', fl: '#FF3BD4', pt: ['#FF3BD4', '#3BF0FF', '#FFF23B', '#7CFF4F'], em: '⚡' },
    { k: 'sakura', nm: '🌸 櫻花 祭典', bg: 'radial-gradient(ellipse at 50% 20%,#5A1A3A 0,#2A0A1F 55%,#0C0308 100%)', c1: '#FF9AC8', c2: '#FFE0EE', fl: '#FF6FAE', pt: ['#FF9AC8', '#FFE0EE', '#FFFFFF', '#FFD54A'], em: '🌸' },
    { k: 'ocean', nm: '🐉 深海 龍宮', bg: 'linear-gradient(180deg,#001A33 0,#003355 50%,#00526E 100%)', c1: '#3BD1FF', c2: '#7CFFC4', fl: '#00B8D4', pt: ['#7CFFC4', '#3BD1FF', '#FFFFFF', '#FFD54A'], em: '🫧' },
    { k: 'thunder', nm: '⚡ 雷電 天空', bg: 'radial-gradient(ellipse at 50% 0,#2A3A6A 0,#0E1430 55%,#04060E 100%)', c1: '#FFF23B', c2: '#9AB8FF', fl: '#5E7BFF', pt: ['#FFF23B', '#FFFFFF', '#9AB8FF', '#5E7BFF'], em: '⚡' },
    { k: 'forest', nm: '🌳 翡翠 森林', bg: 'radial-gradient(ellipse at 50% 30%,#0E4A22 0,#062A12 55%,#020C05 100%)', c1: '#7CFF8A', c2: '#FFE58A', fl: '#2BD46A', pt: ['#7CFF8A', '#FFE58A', '#FFFFFF', '#B8FF6A'], em: '🍀' },
    { k: 'royal', nm: '💜 皇家 紫晶', bg: 'radial-gradient(ellipse at 50% 30%,#4A0E6A 0,#22063A 55%,#0A0214 100%)', c1: '#D07CFF', c2: '#FFD54A', fl: '#A23BFF', pt: ['#D07CFF', '#FFD54A', '#FFFFFF', '#FF7AC8'], em: '💎' }];
  /* ── 8 種 揭曉 特效 ── */
  A.FX = [['flip', '🃏 魔法 卡 翻轉'], ['drop', '☄️ 流星 降落'], ['door', '🚪 黃金 大門'], ['cube', '🧊 光之 方塊'], ['rise', '🛗 升降台'], ['beam', '🛸 光束 傳送'], ['shatter', '💥 水晶 碎裂'], ['coin', '🪙 金幣 旋轉']];
  A.SH = function () { var d = { h: 1, p: 1, w: 1, m: 1 }; try { var v = JSON.parse(ls('awd_show') || 'null'); if (v) for (var k in d) if (v[k] != null) d[k] = v[k] ? 1 : 0; } catch (e) { } return d; };
  A.bar = function () { var s = A.SH(); return '<span class="awbar">' + [['h', '🦸 戰士'], ['p', '🐾 寵物'], ['w', '⚔ 武器'], ['m', '🎵 配樂']].map(function (x) { return '<button class="awt' + (s[x[0]] ? ' on' : '') + '" data-awt="' + x[0] + '">' + x[1] + '：' + (s[x[0]] ? '開' : '關') + '</button>'; }).join('') + '</span>'; };
  document.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('[data-awt]') : null; if (!b) return; var k = b.getAttribute('data-awt'), s = A.SH(); s[k] = s[k] ? 0 : 1; ls('awd_show', JSON.stringify(s));
    [].forEach.call(document.querySelectorAll('[data-awt="' + k + '"]'), function (x) { x.classList.toggle('on', !!s[k]); x.textContent = x.textContent.replace(/：.*$/, '') + '：' + (s[k] ? '開' : '關'); });
    [].forEach.call(document.querySelectorAll('.awd'), function (h) { h.classList.toggle('no-' + k, !s[k]); });
    if (k === 'm' && A.M) A.M.mute(!s.m); });

  /* ══ 🎵 配樂：WebAudio 現場 合成（每 一場 新 的 種子）══ */
  function Music(seed) {
    var M = {}, AC = window.AudioContext || window.webkitAudioContext, ctx = null, out = null, alive = true, sd = seed >>> 0;
    function r() { sd = (sd + 0x6D2B79F5) >>> 0; var t = sd; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
    try { if (AC && !window.__AWDMUTE) { ctx = new AC(); out = ctx.createGain(); out.gain.value = .55; var comp = ctx.createDynamicsCompressor(); out.connect(comp); comp.connect(ctx.destination); if (ctx.state === 'suspended') ctx.resume(); } } catch (e) { ctx = null; }
    var SC = [[0, 2, 4, 5, 7, 9, 11], [0, 2, 4, 5, 7, 9, 10], [0, 2, 4, 6, 7, 9, 11]][Math.floor(r() * 3)], root = 48 + Math.floor(r() * 12), bpm = 88 + Math.floor(r() * 38), beat = 60 / bpm;
    var PR = [[0, 5, 3, 4], [0, 3, 4, 0], [0, 4, 5, 3], [5, 3, 0, 4], [0, 2, 3, 4], [0, 5, 1, 4]][Math.floor(r() * 6)], LW = ['sawtooth', 'square', 'triangle'][Math.floor(r() * 3)], PW = ['sawtooth', 'triangle'][Math.floor(r() * 2)];
    var MOT = [0, 1, 2, 3, 4, 5].map(function () { return Math.floor(r() * 5); }), det = 4 + Math.floor(r() * 10);
    M.info = { root: root, bpm: bpm, pr: PR, lw: LW, mot: MOT.join('') };
    function hz(n) { return 440 * Math.pow(2, (n - 69) / 12); }
    function deg(d, oct) { var o = Math.floor(d / 7); return root + 12 * ((oct || 0) + o) + SC[((d % 7) + 7) % 7]; }
    function chord(d) { return [deg(d), deg(d + 2), deg(d + 4)]; }
    function T() { return ctx ? ctx.currentTime : 0; }
    function tone(n, t, d, o) { if (!ctx || !alive) return; o = o || {}; var g = ctx.createGain(), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.cut || 2400; f.Q.value = o.q || 1;
      [-1, 1].forEach(function (s) { var v = ctx.createOscillator(); v.type = o.w || LW; v.frequency.value = hz(n); v.detune.value = s * (o.det != null ? o.det : det); v.connect(f); v.start(t); v.stop(t + d + (o.rel || .3) + .05); });
      f.connect(g); g.connect(out); var a = o.a || .01, pk = (o.v || .18); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pk, t + a); g.gain.setTargetAtTime(pk * (o.sus != null ? o.sus : .6), t + a, .08); g.gain.setTargetAtTime(0, t + d, (o.rel || .3) / 3); }
    function noise(t, d, o) { if (!ctx || !alive) return; o = o || {}; var n = Math.floor(ctx.sampleRate * d), b = ctx.createBuffer(1, n, ctx.sampleRate), x = b.getChannelData(0); for (var i = 0; i < n; i++) x[i] = Math.random() * 2 - 1;
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = b; f.type = o.type || 'highpass'; f.frequency.value = o.f || 5000; s.connect(f); f.connect(g); g.connect(out);
      g.gain.setValueAtTime(o.v || .2, t); g.gain.exponentialRampToValueAtTime(.001, t + d); s.start(t); s.stop(t + d + .02); }
    function timp(t, n, v) { if (!ctx || !alive) return; var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(hz(n) * 1.6, t); o.frequency.exponentialRampToValueAtTime(hz(n), t + .12); o.connect(g); g.connect(out);
      g.gain.setValueAtTime(v || .5, t); g.gain.exponentialRampToValueAtTime(.001, t + 1.1); o.start(t); o.stop(t + 1.2); }
    M.pad = function (sec) { if (!ctx) return; var t = T() + .05, d = Math.max(beat * 4, sec / 4); for (var i = 0; i < 4 && i * d < sec; i++) chord(PR[i % PR.length]).forEach(function (n) { tone(n - 12, t + i * d, d * .95, { w: PW, a: .6, v: .06, cut: 1100, sus: .9, rel: 1.2 }); }); };
    M.roll = function (sec, up) { if (!ctx) return; var t = T() + .02, k = 0, dt = .11; while (k < sec) { noise(t + k, .06, { f: 2600, v: .08 + (up ? .22 * k / sec : 0) }); dt = up ? Math.max(.035, .11 - .075 * k / sec) : .07; k += dt; } };
    M.hit = function (lv) { if (!ctx) return; var t = T() + .02, c = chord(PR[(lv || 0) % PR.length]); c.concat([c[0] + 12]).forEach(function (n) { tone(n, t, .5 + (lv || 0) * .15, { v: .14, cut: 3200, rel: .8 }); }); timp(t, root - 12, .55); noise(t, 1.4, { f: 6500, v: .16 }); };
    M.beat = function (n) { if (!ctx) return; var t = T() + .02; for (var i = 0; i < n; i++) { timp(t + i * .85, root - 24, .7); timp(t + i * .85 + .22, root - 24, .4); } };
    M.fanfare = function () { if (!ctx) return; var t = T() + .02, b = beat / 2, ns = [0, 2, 4, 7, 4, 7, 9, 11].map(function (x, i) { return deg(i < 6 ? MOT[i] + (i > 2 ? 2 : 0) : 7 + MOT[i % 6] % 3, 1); });
      ns.forEach(function (n, i) { tone(n, t + i * b, b * .9, { v: .16, cut: 4200 }); }); var e = t + ns.length * b;
      [0, 3, 4, 0].forEach(function (d, i) { chord(PR[0] + d).forEach(function (n) { tone(n, e + i * beat * 2, beat * 1.9, { v: .1, cut: 2800, rel: .6 }); }); timp(e + i * beat * 2, root - 12, .6); });
      tone(deg(7, 1), e + 6 * beat, beat * 4, { v: .18, cut: 5000, rel: 1.5 }); noise(e + 6 * beat, 2.2, { f: 7000, v: .2 }); timp(e + 6 * beat, root - 12, .8); };
    M.finale = function (sec) { if (!ctx) return; var t = T() + .05, n = Math.floor(sec / beat); for (var i = 0; i < n; i++) { var d = PR[Math.floor(i / 4) % PR.length]; if (i % 2 === 0) timp(t + i * beat, deg(d) - 24, .35); if (i % 4 === 0) chord(d).forEach(function (x) { tone(x, t + i * beat, beat * 3.6, { v: .07, cut: 2400, a: .05, rel: .8 }); }); if (i % 2 === 1) noise(t + i * beat, .08, { f: 3000, v: .07 }); if (i % 4 === 2) tone(deg(d + MOT[i % 6], 1), t + i * beat, beat * .9, { v: .09 }); } };
    M.mute = function (m) { if (out) out.gain.setTargetAtTime(m ? 0 : .55, T(), .1); };
    M.stop = function () { alive = false; try { if (out) out.gain.setTargetAtTime(0, T(), .05); setTimeout(function () { try { ctx && ctx.close(); } catch (e) { } }, 400); } catch (e) { } };
    M.on = !!ctx; return M; }

  /* ══ 3D 粒子（彩帶＋煙火，有 遠近）══ */
  function Parts(cv, th) { var P = [], g = cv.getContext('2d'), run = true, W = 0, Hh = 0;
    function fit() { var r = cv.getBoundingClientRect(); W = cv.width = Math.max(1, r.width); Hh = cv.height = Math.max(1, r.height); } fit();
    var col = function () { return th.pt[rnd(th.pt.length)]; };
    var o = { conf: function (n, x) { for (var i = 0; i < n; i++) P.push({ k: 0, x: (x != null ? x : Math.random()) * W, y: -20 - Math.random() * Hh * .4, z: Math.random() * 600, vx: (Math.random() - .5) * 2, vy: 1.6 + Math.random() * 2.6, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: col(), l: 500 }); },
      burst: function (x, y, n) { var c = col(); for (var i = 0; i < n; i++) { var a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1), v = 3 + Math.random() * 5; P.push({ k: 1, x: x * W, y: y * Hh, z: 300, vx: v * Math.sin(b) * Math.cos(a), vy: v * Math.sin(b) * Math.sin(a), vz: v * Math.cos(b) * 40, c: Math.random() < .3 ? '#FFFFFF' : c, l: 70 + rnd(30) }); } },
      stop: function () { run = false; }, fit: fit };
    (function lp() { if (!run || !cv.isConnected) return; g.clearRect(0, 0, W, Hh); for (var i = P.length - 1; i >= 0; i--) { var p = P[i], s = 700 / Math.max(300, 700 + (p.z || 0));
        if (p.k === 0) { p.x += p.vx; p.y += p.vy; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.scale(s, s * Math.abs(Math.cos(p.r * 2))); g.fillStyle = p.c; g.fillRect(-6, -3, 12, 6); g.restore(); if (p.y > Hh + 20) P.splice(i, 1); }
        else { p.x += p.vx; p.y += p.vy; p.vy += .06; p.z += p.vz || 0; p.vx *= .985; p.vy *= .985; p.l--; g.globalAlpha = Math.max(0, p.l / 90); g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, 3 * s, 0, 7); g.fill(); g.globalAlpha = 1; if (p.l <= 0) P.splice(i, 1); } }
      requestAnimationFrame(lp); })();
    return o; }

  /* ══ 2026-11-09 第四十五次 第 2-(3) 點：背景 光效 全部 畫 在 一張 畫布（awbc，在 卡片 後面）══
     老師 截圖：前 三名 的 時候 上半部 一大片 灰白 方格（＝ 教室 電腦 的 瀏覽器 畫不動 超大 的 會動 圖層：1500px 旋轉 光芒、整個 畫面 的 濾鏡 動畫、混色 聚光燈、轉 74 度 的 3D 地板）。
     現在 這些 都 改 成 同一張 畫布 上 畫（一張 圖、不 會 分塊 畫不出來）：會 掃 的 聚光燈、立體 透視 地板、頒獎台 下 的 光暈、第 1 名 旋轉 金色 光芒（12 道 ＋ 光環）、前 三名 光柱。 */
  function BG(cv, host, th) { var g = cv.getContext('2d'), run = true, W = 0, Hh = 0, t0 = performance.now();
    function fit() { var r = cv.getBoundingClientRect(); W = cv.width = Math.max(1, Math.round(r.width)); Hh = cv.height = Math.max(1, Math.round(r.height)); } fit();
    function rect(sel) { var e = host.querySelector(sel), h = host.getBoundingClientRect(); if (!e) return null; var r = e.getBoundingClientRect(); return { x: r.left - h.left + r.width / 2, y: r.top - h.top + r.height / 2, w: r.width, h: r.height, t: r.top - h.top, b: r.bottom - h.top }; }
    function hexA(c, a) { var m = /^#?([0-9a-f]{6})$/i.exec(c || ''); if (!m) return 'rgba(255,213,74,' + a + ')'; var n = parseInt(m[1], 16); return 'rgba(' + (n >> 16) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
    (function lp(now) { if (!run || !cv.isConnected) return; if (cv.width !== Math.round(cv.getBoundingClientRect().width)) fit(); var t = ((now || performance.now()) - t0) / 1000, C = host.classList;
      g.clearRect(0, 0, W, Hh);
      /* 透視 地板（2D 畫，不 用 3D）*/
      var fy = Hh * .62, vx = W / 2; g.save(); var fg = g.createLinearGradient(0, fy, 0, Hh); fg.addColorStop(0, hexA(th.fl, 0)); fg.addColorStop(1, hexA(th.fl, .28)); g.fillStyle = fg; g.fillRect(0, fy, W, Hh - fy);
      g.strokeStyle = hexA(th.fl, .35); g.lineWidth = 1.5; for (var i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(vx + i * W * .02, fy); g.lineTo(vx + i * W * .16, Hh); g.stroke(); }
      for (var j = 0; j < 7; j++) { var yy = fy + (Hh - fy) * Math.pow(((j + (t * .25) % 1) / 7), 1.8); g.globalAlpha = .5; g.beginPath(); g.moveTo(0, yy); g.lineTo(W, yy); g.stroke(); } g.restore(); g.globalAlpha = 1;
      /* 三 道 會 掃 的 聚光燈（暗場 的 時候 更 亮）*/
      var dim = C.contains('dim') || C.contains('sus'); [[.12, 5, 0], [.5, 6.4, 2], [.88, 5.6, 1]].forEach(function (s, k) { var ang = Math.sin(t * 2 * Math.PI / s[1] + s[2]) * (C.contains('sus') ? .5 : .28), x0 = W * s[0], len = Hh * 1.15, wd = W * .09;
        g.save(); g.translate(x0, -10); g.rotate(ang); var lg = g.createLinearGradient(0, 0, 0, len); lg.addColorStop(0, hexA(k === 1 ? th.c1 : th.c2, dim ? .5 : .28)); lg.addColorStop(1, hexA(k === 1 ? th.c1 : th.c2, 0)); g.fillStyle = lg; g.beginPath(); g.moveTo(-8, 0); g.lineTo(8, 0); g.lineTo(wd, len); g.lineTo(-wd, len); g.closePath(); g.fill(); g.restore(); });
      /* 頒獎台 光柱＋光暈（升 起來 的 才 有）*/
      [1, 2, 3].forEach(function (rk) { var p = host.querySelector('.awpod.r' + rk + '.up'); if (!p) return; var r = rect('.awpod.r' + rk); if (!r) return; var pul = .75 + .25 * Math.sin(t * 3 + rk);
        var bw = r.w * (rk === 1 ? .9 : .7), lg = g.createLinearGradient(0, 0, 0, r.t); lg.addColorStop(0, hexA(th.c1, 0)); lg.addColorStop(1, hexA(rk === 1 ? th.c1 : '#ffffff', (rk === 1 ? .38 : .22) * pul)); g.fillStyle = lg; g.beginPath(); g.moveTo(r.x - bw * .25, 0); g.lineTo(r.x + bw * .25, 0); g.lineTo(r.x + bw / 2, r.t); g.lineTo(r.x - bw / 2, r.t); g.closePath(); g.fill();
        var rg = g.createRadialGradient(r.x, r.t, 2, r.x, r.t, r.w * .9); rg.addColorStop(0, hexA(rk === 1 ? th.c1 : '#ffffff', .55 * pul)); rg.addColorStop(1, hexA(th.c1, 0)); g.fillStyle = rg; g.beginPath(); g.ellipse(r.x, r.t, r.w * .9, r.w * .22, 0, 0, 7); g.fill(); });
      /* 第 1 名：旋轉 金色 光芒＋光環（在 卡片 後面）*/
      if (C.contains('king') || C.contains('fin')) { var c1 = rect('.awgrp.r1 .awp') || rect('.awgrp.r1'); if (c1) { var R0 = Math.max(c1.w, c1.h) * .55, R1 = Math.min(Math.max(W, Hh) * .6, R0 * 3.2), n = 16, k0 = C.contains('fin') ? .55 : .8;
        g.save(); g.translate(c1.x, c1.y); g.rotate(t * .35); for (var q = 0; q < n; q++) { g.rotate(Math.PI * 2 / n); var rl = g.createLinearGradient(0, 0, R1, 0); rl.addColorStop(0, hexA(th.c1, .55 * k0)); rl.addColorStop(1, hexA(th.c1, 0)); g.fillStyle = rl; g.beginPath(); g.moveTo(R0 * .4, 0); g.lineTo(R1, -R1 * .09); g.lineTo(R1, R1 * .09); g.closePath(); g.fill(); } g.restore();
        for (var h2 = 0; h2 < 2; h2++) { var rr = R0 * (1.05 + ((t * .6 + h2 * .5) % 1) * 1.4); g.strokeStyle = hexA('#FFF6C0', .6 * (1 - ((t * .6 + h2 * .5) % 1))); g.lineWidth = 4; g.beginPath(); g.arc(c1.x, c1.y, rr, 0, 7); g.stroke(); } } }
      requestAnimationFrame(lp); })();
    return { stop: function () { run = false; } }; }

  /* ══ 一個 名次（同 分 ＝ 一起）的 卡 ══ */
  function person(x) { var im = function (u, c, fb) { return u ? '<img class="' + c + '" src="' + esc(u) + '" alt="">' : (fb ? '<span class="' + c + ' noi">' + fb + '</span>' : ''); };
    return '<div class="awp"><div class="awav">' + im(x.h, 'aw-h', '👤') + im(x.p, 'aw-p', '') + im(x.w, 'aw-w', '') + '</div><div class="awcode">' + esc(x.code) + '</div><div class="awnm">' + esc(x.nm || '') + '</div><div class="awsc">' + esc(x.sc || '') + '</div>' + (x.ln ? '<div class="awln">' + esc(x.ln) + '</div>' : '') + '</div>'; }
  /* 卡 的 大小 照 螢幕 算（教室 1920、iPad 1024 都 放得下；同 名次 好幾 個 人 也 不 疊 在 一起）*/
  function fitG(ar, g, rk) { var w = g.offsetWidth || 1, h = g.offsetHeight || 1, W = ar.clientWidth, Hh = ar.clientHeight, ph = Hh * PODH[rk] / 100;
    g.style.setProperty('--sc', Math.min(1.25, W * .86 / w, Hh * .9 / h).toFixed(3));
    g.style.setProperty('--ss', Math.min(rk === 1 ? .85 : .7, W * (rk === 1 ? .23 : .185) / w, (Hh - ph - Hh * .03) / h).toFixed(3)); }
  function fitAll(host) { var ar = host.querySelector('.awar'); if (!ar) return; [].forEach.call(ar.querySelectorAll('.awgrp'), function (g) { fitG(ar, g, +g.getAttribute('data-rk')); }); }
  window.addEventListener('resize', function () { [].forEach.call(document.querySelectorAll('.awd'), fitAll); });
  /* 第四十五次：前 三名 一句 榮譽（正向、肯定 努力；每 場 隨機 一句）*/
  var HON = { 1: ['✨ 堅持 練習 的 光芒', '🔥 用心 讓 你 站 上 最 高 處', '🌟 全班 的 榜樣'], 2: ['💪 每 一題 都 很 拼', '🚀 再 一步 就 是 冠軍', '⭐ 進步 的 力量'], 3: ['🌱 努力 一定 被 看見', '👏 勇敢 挑戰 到底', '💎 專心 就 會 發光'] };
  var MED = { 1: '🥇', 2: '🥈', 3: '🥉', 4: '4', 5: '5' }, SLOT = { 1: 50, 2: 30, 3: 70, 4: 11, 5: 89 }, PODH = { 1: 32, 2: 25, 3: 19, 4: 13, 5: 10 };

  A.stop = function (host) { if (!host) return; var S = host._aw; if (S) { S.gen++; S.tm.forEach(clearTimeout); S.tm = []; if (S.pt) S.pt.stop(); if (S.bg) S.bg.stop(); } if (A.M) { A.M.stop(); A.M = null; } host._aw = null; host.classList.remove('awd'); host.innerHTML = ''; };
  A.skip = function (host) { var S = host && host._aw; if (!S || S.fin) return; S.gen++; S.tm.forEach(clearTimeout); S.tm = []; [].forEach.call(host.querySelectorAll('.awgrp'), function (g) { g.classList.add('seat', 'shown'); }); finale(host, S, 1); };
  A.play = function (host, data, opt) { A.stop(host); opt = opt || {};
    var last = +(ls('awd_last') || -1), ti = rnd(A.TH.length); if (ti === last) ti = (ti + 1 + rnd(A.TH.length - 1)) % A.TH.length; ls('awd_last', String(ti)); var th = A.TH[ti];
    var fx = shuf(A.FX.map(function (f) { return f[0]; })), sh = A.SH(), K = window.__AWDFAST ? .05 : 1;
    var S = { gen: 1, tm: [], th: th, fx: fx, fin: 0, rows: data.rows || [], data: data, opt: opt }; host._aw = S;
    host.className = (host.className.replace(/\bawd\b|\bno-\w\b|\bth-\w+/g, '') + ' awd th-' + th.k).trim(); ['h', 'p', 'w'].forEach(function (k) { if (!sh[k]) host.classList.add('no-' + k); });
    host.style.setProperty('--aw1', th.c1); host.style.setProperty('--aw2', th.c2); host.style.setProperty('--awf', th.fl);
    host.innerHTML = '<div class="awbg" style="background:' + th.bg + '"></div><canvas class="awbc"></canvas><canvas class="awcv"></canvas>' +   /* 第四十五次：聚光燈、地板、光芒 ＝ awbc 一張 畫布 */
      '<div class="awtop"><div class="awkick">' + esc(data.kick || '') + '</div><div class="awttl">' + esc(data.title || '🏆 頒獎 典禮').replace(/(\p{Extended_Pictographic}\uFE0F?)/gu, '<i class="awem">$1</i>') + '</div><div class="awthm">' + esc(th.nm) + '</div></div>' +
      '<div class="awar"></div><div class="awcap"></div><div class="awflash"></div>';
    var ar = $(host, '.awar'), cap = $(host, '.awcap'), cv = $(host, '.awcv'); S.pt = Parts(cv, th); S.bg = BG($(host, '.awbc'), host, th);
    var seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0; A.M = Music(seed); if (!sh.m) A.M.mute(true); S.music = A.M.info;
    var my = S.gen, at = 0, T = function (f, ms) { at += ms * K; var g = my; S.tm.push(setTimeout(function () { if (S.gen === g && host._aw === S) f(); }, at)); };
    var say = function (h, cls) { cap.className = 'awcap ' + (cls || ''); cap.innerHTML = h; void cap.offsetWidth; cap.classList.add('in'); };
    /* 名次 分組（同 分 同 名次 一起 上台）*/
    var G = {}; S.rows.forEach(function (x) { if (x.rk >= 1 && x.rk <= 5) (G[x.rk] = G[x.rk] || []).push(x); }); var ranks = Object.keys(G).map(Number).sort(function (a, b) { return b - a; }), rest = S.rows.filter(function (x) { return x.rk > 5 && x.rk <= 10; });
    S.ranks = ranks;
    /* 頒獎台（一開始 在 地板 下面，輪到 才 升 起來）*/
    ranks.forEach(function (rk) { var p = H('div', 'awpod r' + rk, '<div class="pf"><b>' + MED[rk] + '</b></div><div class="pt"></div><div class="ps"></div>'); p.style.left = SLOT[rk] + '%'; p.style.setProperty('--ph', PODH[rk] + '%'); ar.appendChild(p);
      var gp = H('div', 'awgrp r' + rk + ' n' + Math.min(3, G[rk].length), (rk === 1 ? '<div class="awcrown">👑</div><div class="awchamp">👑 冠軍</div>' : '') + '<div class="awmd">' + (rk <= 3 ? MED[rk] : '第 ' + rk + ' 名') + '</div><div class="awps">' + G[rk].map(person).join('') + '</div>' + (rk <= 3 ? '<div class="awhon">' + HON[rk][rnd(HON[rk].length)] + '</div>' : '')); gp.style.setProperty('--sx', SLOT[rk] + '%'); gp.style.setProperty('--ph', PODH[rk] + '%'); gp.setAttribute('data-rk', rk); ar.appendChild(gp); });
    fitAll(host); S.tm.push(setTimeout(function () { fitAll(host); }, 600));   /* 圖 載 好 以後 再 算 一次 */
    /* ① 開場 */
    host.classList.add('st0'); A.M.pad(6); A.M.roll(3.6, true); S.pt.conf(30);
    T(function () { A.M.hit(0); host.classList.add('st1'); S.pt.burst(.5, .3, 90); }, 3600);
    /* 2026-11-04 第四十四次 第 4-(3)(a) 點（老師）：第 10～6 名 ＝ 階梯，由下 往上 一階 一階 出現（最 下面 一階 第 10 名 ➜ 上面 第 9 名 … ➜ 最 上面 第 6 名；名次 愈 高 愈 亮、愈 尊榮）*/
    if (rest.length) { var RD = rest.slice().sort(function (a, b) { return b.rk - a.rk; }), stp = 1.05;
      T(function () { say('<div class="awst">' + RD.slice().reverse().map(function (x) { var i = RD.indexOf(x); return '<div class="aws" style="--i:' + i + ';--n:' + RD.length + ';animation-delay:' + (i * stp * K).toFixed(2) + 's"><b>第 ' + x.rk + ' 名</b><span class="awsc2">' + esc(x.code) + ' ' + esc(x.nm || '') + '</span><em>' + esc(x.sc || '') + '</em></div>'; }).join('') +
        '</div><div class="awrt" style="animation-delay:' + (RD.length * stp * K).toFixed(2) + 's">👏 第 10～6 名，恭喜！</div>', 'rest');
        RD.forEach(function (x, i) { S.tm.push(setTimeout(function () { if (host._aw === S && A.M) A.M.hit(i % 3); }, i * stp * 1000 * K)); }); }, 1800);
      T(function () { }, 1600 + RD.length * stp * 1000); }
    /* ② 第 5 ➜ 2 名：一層 一層 揭開 */
    ranks.forEach(function (rk, i) { if (rk === 1) return; var f = fx[i % fx.length], grp = ar.querySelector('.awgrp.r' + rk), pod = ar.querySelector('.awpod.r' + rk), pre = rk <= 3 ? 2600 : 1900;
      T(function () { say('<span class="awnum">第 ' + rk + ' 名</span><small>是……</small>', 'pre r' + rk); A.M.roll(pre / 1000 * K, true); host.classList.add('dim'); }, 2200);
      T(function () { host.classList.remove('dim'); cap.classList.remove('in'); pod.classList.add('up'); grp.classList.add('show', 'fx-' + f); A.M.hit(4 - rk + 2); S.pt.burst(SLOT[rk] / 100, .45, rk <= 3 ? 120 : 70); if (rk <= 3) S.pt.conf(40, SLOT[rk] / 100); }, pre);
      T(function () { grp.classList.add('seat'); }, rk <= 3 ? 3600 : 3000); });
    /* ③ 懸疑：第 1 名 是…… 心跳＋燈光 掃 ＋ 3 2 1 */
    if (G[1]) { T(function () { host.classList.add('sus'); say('<span class="awnum">第 1 名</span><small>是……</small>', 'pre r1'); A.M.beat(4); }, 2400);
      [3, 2, 1].forEach(function (n) { T(function () { say('<span class="awcd">' + n + '</span>', 'cd'); A.M.hit(n % 3); }, n === 3 ? 3400 : 1000); });
      T(function () { host.classList.remove('sus'); host.classList.add('boom'); cap.classList.remove('in'); var gp = ar.querySelector('.awgrp.r1'), pd = ar.querySelector('.awpod.r1'); pd.classList.add('up'); gp.classList.add('show', 'fx-king'); host.classList.add('king');   /* 第四十四次 4-(3)(a)：第 1 名 ＝ 最 尊榮 的 加冕：金色 光芒 轉、皇冠 從 天上 落下 戴 上、「👑 冠軍」金字 */
        A.M.fanfare(); for (var b = 0; b < 6; b++) (function (b) { S.tm.push(setTimeout(function () { if (host._aw === S) S.pt.burst(.15 + .14 * b, .2 + (b % 2) * .15, 110); }, b * 380 * K)); })(b); S.pt.conf(120); }, 1000);
      T(function () { ar.querySelector('.awgrp.r1').classList.add('seat'); host.classList.remove('boom'); }, 4200); }
    /* ④ 終曲：全部 站 在 頒獎台 上 */
    T(function () { finale(host, S, 0); }, 2600); };
  function finale(host, S, fast) { if (S.fin) return; S.fin = 1; var ar = $(host, '.awar'), cap = $(host, '.awcap'); host.classList.remove('dim', 'sus', 'boom'); host.classList.add('fin');
    [].forEach.call(ar.querySelectorAll('.awpod'), function (p) { p.classList.add('up'); }); [].forEach.call(ar.querySelectorAll('.awgrp'), function (g) { g.classList.add('show', 'seat'); });
    cap.className = 'awcap fin in'; cap.innerHTML = '🎉 恭喜！你們 的 用心 被 看見 了！';
    if (A.M) A.M.finale(fast ? 8 : 12); S.pt.conf(160);
    var my = S.gen; (function loop(k) { if (host._aw !== S || S.gen !== my) return; S.pt.burst(Math.random() * .8 + .1, Math.random() * .3 + .1, 70); if (k < 14) S.tm.push(setTimeout(function () { loop(k + 1); }, 900)); })(0);
    if (S.opt.done) S.opt.done(); }
  return A;
}
const CSS = `
/* ══ 🏆 頒獎 典禮（score/_awd.js）══ */
.awd{position:relative;overflow:hidden;width:100%;height:100%;min-height:520px;perspective:1300px;font-family:inherit;color:#fff;--aw1:#FFD54A;--aw2:#fff;--awf:#FFB300}
.awd .awbg{position:absolute;inset:0;animation:awBg 12s ease-in-out infinite alternate}@keyframes awBg{to{filter:hue-rotate(18deg) brightness(1.15)}}
.awd .awcv{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:6}
.awd .awfloor{position:absolute;left:-30%;right:-30%;bottom:-8%;height:46%;transform:rotateX(74deg);transform-origin:50% 100%;background:repeating-linear-gradient(90deg,transparent 0 58px,color-mix(in srgb,var(--awf) 45%,transparent) 58px 61px),repeating-linear-gradient(0deg,transparent 0 58px,color-mix(in srgb,var(--awf) 45%,transparent) 58px 61px);box-shadow:inset 0 0 160px rgba(0,0,0,.9);animation:awFl 4s linear infinite;opacity:.75}
@keyframes awFl{to{background-position:0 61px,0 61px}}
.awd .awspot{position:absolute;top:-10%;width:34%;height:120%;background:conic-gradient(from 168deg at 50% 0,transparent 0 0deg,color-mix(in srgb,var(--aw2) 34%,transparent) 8deg 16deg,transparent 24deg);transform-origin:50% 0;opacity:.75;mix-blend-mode:screen;z-index:1}
.awd .awspot.s1{left:4%;animation:awSp 5s ease-in-out infinite alternate}.awd .awspot.s2{left:33%;animation:awSp 6.4s ease-in-out -2s infinite alternate}.awd .awspot.s3{left:62%;animation:awSp 5.6s ease-in-out -1s infinite alternate}
@keyframes awSp{0%{transform:rotate(-24deg)}100%{transform:rotate(24deg)}}
.awd.sus .awspot{animation-duration:.9s}.awd.sus .awbg{filter:brightness(.45)}
.awd .awtop{position:absolute;left:0;right:0;top:2%;text-align:center;z-index:7;transform-style:preserve-3d}
.awd .awkick{font-size:clamp(20px,2.8vh,30px);color:var(--aw2);letter-spacing:.1em;opacity:0}
.awd .awttl{font-size:clamp(40px,7vh,84px);font-weight:900;background:linear-gradient(90deg,var(--aw1),#fff,var(--aw2),var(--aw1));background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 18px rgba(0,0,0,.7));opacity:0;transform:translateZ(-600px) rotateX(70deg)}
.awd .awttl .awem{font-style:normal;-webkit-text-fill-color:#fff;color:#fff;filter:none}
.awd .awthm{font-size:clamp(16px,2.2vh,22px);color:#fff;opacity:0}
.awd.st0 .awttl{animation:awT 2.6s cubic-bezier(.2,1.3,.4,1) .4s both,awSh 3s linear 3s infinite}.awd.st0 .awkick,.awd.st0 .awthm{animation:awF .8s 2s both}
@keyframes awT{0%{opacity:0;transform:translateZ(-600px) rotateX(70deg)}70%{opacity:1;transform:translateZ(60px) rotateX(-8deg)}100%{opacity:1;transform:none}}@keyframes awSh{to{background-position:300% 0}}@keyframes awF{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}
.awd.st1 .awtop{transform:scale(.7);top:0;transition:transform .8s,top .8s}
.awd .awar{position:absolute;left:0;right:0;top:20%;bottom:4%;z-index:4;transform-style:preserve-3d}
.awd .awpod{position:absolute;bottom:0;width:17%;height:var(--ph);transform:translate(-50%,105%);opacity:0;transform-style:preserve-3d;transition:transform 1.3s cubic-bezier(.3,1.4,.5,1),opacity .4s}
.awd .awpod.up{transform:translate(-50%,0);opacity:1}
.awd .awpod .pf{position:absolute;inset:0;border-radius:6px 6px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:6px;font-size:clamp(28px,5vh,54px);font-weight:900;background:linear-gradient(180deg,#5A6A86,#24304A);box-shadow:inset 0 3px 0 rgba(255,255,255,.4),0 0 30px rgba(0,0,0,.6)}
.awd .awpod .pt{position:absolute;left:-4%;right:-4%;top:-18px;height:18px;clip-path:polygon(6% 0,94% 0,100% 100%,0 100%);background:linear-gradient(#8A9AB6,#5A6A86)}
.awd .awpod.r1 .pf{background:linear-gradient(180deg,#FFE58A,#C98A00 60%,#7A5200);box-shadow:inset 0 3px 0 #FFF6C0,0 0 60px rgba(255,213,74,.8)}.awd .awpod.r1 .pt{background:linear-gradient(#FFF3B0,#FFD54A)}
.awd .awpod.r2 .pf{background:linear-gradient(180deg,#F4F7FB,#9AA6B8 60%,#566275)}.awd .awpod.r2 .pt{background:#FFFFFF}
.awd .awpod.r3 .pf{background:linear-gradient(180deg,#F2B27A,#B5652A 60%,#6E3A12)}.awd .awpod.r3 .pt{background:#FFD0A6}
.awd .awgrp{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%) scale(.2);opacity:0;z-index:5;text-align:center;transform-style:preserve-3d;transition:left 1.1s cubic-bezier(.4,1.3,.5,1),top 1.1s cubic-bezier(.4,1.3,.5,1),transform 1.1s cubic-bezier(.4,1.3,.5,1)}
.awd .awgrp.show{opacity:1;transform:translate(-50%,-50%) scale(var(--sc,1.25))}
.awd .awgrp.seat{left:var(--sx);top:calc(100% - var(--ph));transform:translate(-50%,-100%) scale(var(--ss,.62));transform-origin:50% 100%}
.awd .awmd{font-size:clamp(34px,6vh,70px);font-weight:900;color:var(--aw1);text-shadow:0 0 22px var(--aw1),0 4px 0 rgba(0,0,0,.5)}
.awd .awps{display:flex;gap:14px;justify-content:center}
.awd .awp{min-width:clamp(180px,20vw,280px);padding:12px 16px 14px;border-radius:24px;background:linear-gradient(160deg,rgba(40,50,80,.86),rgba(10,14,30,.8));border:3px solid var(--aw1);box-shadow:0 0 30px color-mix(in srgb,var(--aw1) 70%,transparent),inset 0 0 30px rgba(255,255,255,.12);}
.awd .awgrp.r1 .awp{border-width:5px;box-shadow:0 0 60px var(--aw1),0 0 120px color-mix(in srgb,var(--aw1) 60%,transparent),inset 0 0 40px rgba(255,255,255,.2)}
.awd .awav{position:relative;height:clamp(120px,19vh,210px);display:flex;align-items:flex-end;justify-content:center}
.awd .aw-h{height:100%;max-width:100%;object-fit:contain;filter:drop-shadow(0 8px 14px rgba(0,0,0,.6))}.awd .aw-h.noi{font-size:clamp(80px,13vh,140px);line-height:1}
.awd .aw-p{position:absolute;left:-4%;bottom:0;height:46%;filter:drop-shadow(0 4px 8px rgba(0,0,0,.6));animation:awBob 1.6s ease-in-out infinite alternate}
.awd .aw-w{position:absolute;right:-6%;bottom:8%;height:58%;transform:rotate(18deg);filter:drop-shadow(0 0 12px var(--aw2));animation:awSw 2.2s ease-in-out infinite alternate}
@keyframes awBob{to{transform:translateY(-8px)}}@keyframes awSw{to{transform:rotate(30deg) translateY(-6px)}}
.awd.no-h .aw-h{visibility:hidden}.awd.no-p .aw-p,.awd.no-w .aw-w{display:none}.awd.no-h.no-p.no-w .awav{display:none}
.awd .awcode{font-size:clamp(26px,4.4vh,48px);font-weight:900;letter-spacing:.04em;color:#fff;text-shadow:0 3px 0 rgba(0,0,0,.5)}
.awd .awnm{font-size:clamp(34px,6vh,66px);font-weight:900;color:var(--aw1);line-height:1.1;text-shadow:0 0 18px color-mix(in srgb,var(--aw1) 70%,transparent),0 4px 0 rgba(0,0,0,.5)}
.awd .awsc{font-size:clamp(24px,3.8vh,40px);font-weight:900;color:#fff}.awd .awln{font-size:clamp(16px,2.2vh,22px);color:#E8ECFF}
.awd .awcap{position:absolute;left:0;right:0;top:40%;transform:translateY(-50%);text-align:center;z-index:8;opacity:0;pointer-events:none}
.awd .awcap.in{animation:awCp .7s cubic-bezier(.2,1.6,.4,1) both}@keyframes awCp{0%{opacity:0;transform:translateY(-50%) scale(.3)}100%{opacity:1;transform:translateY(-50%)}}
.awd .awcap .awnum{display:block;font-size:clamp(70px,14vh,170px);font-weight:900;color:var(--aw1);text-shadow:0 0 40px var(--aw1),0 8px 0 rgba(0,0,0,.6)}.awd .awcap small{font-size:clamp(34px,6vh,64px);color:#fff}
.awd .awcap.pre.r1 .awnum{background:linear-gradient(90deg,#FFE58A,#fff,#FFD54A);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 30px #FFD54A)}
.awd .awcap.cd .awcd{font-size:clamp(140px,30vh,320px);font-weight:900;color:#fff;text-shadow:0 0 60px var(--aw1);display:inline-block;animation:awCd .95s both}@keyframes awCd{0%{transform:scale(2.4);opacity:0}30%{opacity:1}100%{transform:scale(.8);opacity:.2}}
.awd.fin .awtop{opacity:0;transition:opacity .6s}.awd .awcap.fin{top:9%;font-size:clamp(30px,5vh,54px);font-weight:900;color:#fff;text-shadow:0 0 20px var(--aw1),0 4px 0 rgba(0,0,0,.6)}
.awd .awcap.rest{top:46%}.awd .awrest{display:flex;flex-direction:column;align-items:center;gap:8px}.awd .awrest span{font-size:clamp(24px,3.6vh,38px);font-weight:900;background:rgba(0,0,0,.45);border:2px solid var(--aw1);border-radius:16px;padding:4px 22px;animation:awRs .6s both}
.awd .awrest b{color:var(--aw1);margin-right:.6em}.awd .awrest em{font-style:normal;color:#FFE58A;margin-left:.6em}.awd .awrt{margin-top:10px;font-size:clamp(26px,4vh,42px);font-weight:900;color:var(--aw2)}
@keyframes awRs{from{opacity:0;transform:translateY(40px) rotateX(70deg)}to{opacity:1;transform:none}}
.awd.dim .awbg,.awd.dim .awfloor{filter:brightness(.4)}
.awd .awflash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:9}.awd.boom .awflash{animation:awBm 1.2s both}@keyframes awBm{0%{opacity:0}8%{opacity:.95}100%{opacity:0}}
.awd.boom{animation:awQk .6s}@keyframes awQk{20%{transform:translate(-10px,6px)}40%{transform:translate(10px,-6px)}60%{transform:translate(-6px,4px)}80%{transform:translate(6px,-2px)}}
/* 8 種 揭曉 */
.awd .awgrp.fx-flip.show{animation:fxFlip 1.4s cubic-bezier(.3,1.3,.5,1) backwards}@keyframes fxFlip{0%{transform:translate(-50%,-50%) rotateY(-540deg) scale(.2)}100%{transform:translate(-50%,-50%) rotateY(0) scale(var(--sc,1.25))}}
.awd .awgrp.fx-drop.show{animation:fxDrop 1.2s cubic-bezier(.5,0,.6,1.6) backwards}@keyframes fxDrop{0%{transform:translate(-50%,-160%) scale(.6) rotate(-25deg);opacity:0}80%{transform:translate(-50%,-44%) scale(1.3)}100%{transform:translate(-50%,-50%) scale(var(--sc,1.25))}}
.awd .awgrp.fx-door.show{animation:fxDoor 1.5s ease backwards}@keyframes fxDoor{0%{clip-path:inset(0 50% 0 50%);transform:translate(-50%,-50%) scale(var(--sc,1.25))}100%{clip-path:inset(0 0 0 0);transform:translate(-50%,-50%) scale(var(--sc,1.25))}}
.awd .awgrp.fx-cube.show{animation:fxCube 1.5s cubic-bezier(.3,1.3,.5,1) backwards}@keyframes fxCube{0%{transform:translate(-50%,-50%) rotateX(270deg) rotateY(90deg) scale(.3)}100%{transform:translate(-50%,-50%) scale(var(--sc,1.25))}}
.awd .awgrp.fx-rise.show{animation:fxRise 1.4s cubic-bezier(.3,1.4,.5,1) backwards}@keyframes fxRise{0%{transform:translate(-50%,120%) scale(var(--sc,1.25));opacity:0}100%{transform:translate(-50%,-50%) scale(var(--sc,1.25));opacity:1}}
.awd .awgrp.fx-beam.show{animation:fxBeam 1.6s ease backwards}@keyframes fxBeam{0%{transform:translate(-50%,-50%) scaleX(.02) scaleY(1.5);filter:brightness(2.2)}60%{transform:translate(-50%,-50%) scaleX(1.4) scaleY(1.1);filter:brightness(2)}100%{transform:translate(-50%,-50%) scale(var(--sc,1.25));filter:none}}
.awd .awgrp.fx-shatter.show{animation:fxSh 1.3s ease backwards}@keyframes fxSh{0%{transform:translate(-50%,-50%) scale(calc(var(--sc,1.25) * 1.4));filter:brightness(2.2);opacity:0}40%{opacity:1}100%{filter:none;transform:translate(-50%,-50%) scale(var(--sc,1.25))}}
.awd .awgrp.fx-coin.show{animation:fxCoin 1.5s cubic-bezier(.3,1.3,.5,1) backwards}@keyframes fxCoin{0%{transform:translate(-50%,-50%) rotateY(0) scale(.2)}100%{transform:translate(-50%,-50%) rotateY(1080deg) scale(var(--sc,1.25))}}
.awd .awgrp.fx-king.show{animation:fxKing 2.2s cubic-bezier(.2,1.3,.4,1) backwards}@keyframes fxKing{0%{transform:translate(-50%,-50%) scale(.1) rotateY(720deg);filter:brightness(2.5)}60%{transform:translate(-50%,-50%) scale(calc(var(--sc,1.25) * 1.2));filter:brightness(1.6)}100%{transform:translate(-50%,-50%) scale(calc(var(--sc,1.25) * 1.08));filter:none}}
.awd .awgrp.r1:before{content:'👑';position:absolute;left:50%;top:-1.2em;font-size:clamp(50px,9vh,100px);transform:translateX(-50%);opacity:0}
.awd .awgrp.r1.show:before{animation:awCr 1.6s 1.1s cubic-bezier(.3,1.6,.5,1) both,awCw 2s 2.8s ease-in-out infinite alternate}@keyframes awCr{0%{opacity:0;transform:translate(-50%,-300%) rotate(-30deg)}100%{opacity:1;transform:translateX(-50%)}}@keyframes awCw{to{transform:translateX(-50%) translateY(-8px) rotate(6deg)}}
.awd.fin .awgrp.r1 .awp{animation:awGl 1.4s ease-in-out infinite alternate}@keyframes awGl{to{box-shadow:0 0 90px var(--aw1),0 0 160px color-mix(in srgb,var(--aw1) 60%,transparent)}}
.awbar{display:inline-flex;flex-wrap:wrap;gap:8px}.awbar .awt{min-height:52px;min-width:120px;border-radius:14px;border:3px solid #556;background:#1A1F33;color:#9AA3B8;font:inherit;font-size:clamp(17px,2.2vh,22px);font-weight:700;cursor:pointer}
.awbar .awt.on{border-color:#7BF0A8;background:#173A28;color:#fff}
.awd .awcap.rest{top:50%}.awd .awst{display:flex;flex-direction:column;align-items:center;gap:6px}
.awd .aws{display:grid;grid-template-columns:auto auto auto;align-items:center;gap:14px;min-width:min(78vw,720px);transform:translateX(calc((var(--i) - (var(--n) - 1) / 2) * -26px));padding:6px 22px;border-radius:12px 12px 4px 4px;font-size:clamp(22px,3.4vh,36px);font-weight:900;color:#fff;
  background:linear-gradient(180deg,color-mix(in srgb,var(--aw1) calc(20% + var(--i) * 12%),#1A2238),color-mix(in srgb,var(--aw1) calc(8% + var(--i) * 8%),#0A0E1E));border:2px solid color-mix(in srgb,var(--aw1) calc(45% + var(--i) * 11%),transparent);
  box-shadow:0 8px 0 rgba(0,0,0,.45),0 0 calc(6px + var(--i) * 7px) color-mix(in srgb,var(--aw1) 70%,transparent);opacity:0;animation:awStp .8s cubic-bezier(.2,1.5,.4,1) both}
.awd .aws b{color:var(--aw1);text-shadow:0 0 12px var(--aw1)}.awd .aws em{font-style:normal;color:#FFE58A}
@keyframes awStp{0%{opacity:0;transform:translateX(calc((var(--i) - (var(--n) - 1) / 2) * -26px)) translateY(60px) scaleY(.2)}100%{opacity:1}}
.awd .awrt{opacity:0;animation:awRs .6s both}
.awd .awrays{position:absolute;left:50%;top:45%;width:min(120vw,1500px);height:min(120vw,1500px);transform:translate(-50%,-50%);z-index:-1;pointer-events:none;opacity:0;background:repeating-conic-gradient(from 0deg,color-mix(in srgb,var(--aw1) 55%,transparent) 0 6deg,transparent 6deg 18deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 62%);mask:radial-gradient(circle,#000 0,transparent 62%)}
.awd.king .awgrp.r1 .awrays{animation:awRay 1s .3s both,awRot 18s linear infinite}@keyframes awRay{from{opacity:0}to{opacity:.9}}@keyframes awRot{to{transform:translate(-50%,-50%) rotate(360deg)}}
.awd .awcrown{position:absolute;left:50%;top:-6%;font-size:clamp(70px,12vh,140px);transform:translate(-50%,-140vh);z-index:3;filter:drop-shadow(0 0 30px #FFD54A);opacity:0}
.awd.king .awgrp.r1 .awcrown{animation:awCrown 1.6s 1s cubic-bezier(.4,0,.6,1.4) forwards}@keyframes awCrown{0%{opacity:1;transform:translate(-50%,-140vh) rotate(-30deg)}75%{opacity:1;transform:translate(-50%,0) rotate(8deg) scale(1.25)}100%{opacity:1;transform:translate(-50%,0) rotate(0) scale(1)}}
.awd .awchamp{position:absolute;left:50%;top:-24%;transform:translateX(-50%);white-space:nowrap;font-size:clamp(40px,7vh,84px);font-weight:900;opacity:0;background:linear-gradient(90deg,#FFE58A,#fff,#FFD54A,#fff,#FFE58A);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 22px #FFD54A)}
.awd.king .awgrp.r1 .awchamp{animation:awCh .8s 2.4s cubic-bezier(.2,1.6,.4,1) forwards,awSh 3s 3.2s linear infinite}@keyframes awCh{from{opacity:0;transform:translateX(-50%) scale(.2)}to{opacity:1;transform:translateX(-50%) scale(1)}}
.awd .awgrp.seat .awchamp{top:-42%}.awd.fin .awgrp.r1 .awrays{opacity:.5}
/* ══ 2026-11-09 第四十五次 第 2-(3) 點：不 會 遮住 畫面 的 版本（不用 3D 空間、不用 混色、不用 大 圖層 的 濾鏡 動畫；光效 在 awbc 畫布）══ */
.awd{perspective:none;isolation:isolate;contain:paint}.awd *{transform-style:flat!important}
.awd .awbg{animation:none}.awd .awspot,.awd .awfloor,.awd .awrays{display:none!important}
.awd .awbc{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}
@keyframes awT{0%{opacity:0;transform:scale(.2) translateY(40px)}70%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:none}}
@keyframes fxFlip{0%{transform:translate(-50%,-50%) scaleX(.02) scaleY(.3)}50%{transform:translate(-50%,-50%) scaleX(-.6) scaleY(.8)}100%{transform:translate(-50%,-50%) scale(var(--sc,1.25))}}
@keyframes fxCube{0%{transform:translate(-50%,-50%) scale(.3) rotate(-90deg);opacity:0}100%{transform:translate(-50%,-50%) scale(var(--sc,1.25)) rotate(0);opacity:1}}
@keyframes fxCoin{0%{transform:translate(-50%,-50%) scale(.2,.2)}25%{transform:translate(-50%,-50%) scale(-.6,.6)}50%{transform:translate(-50%,-50%) scale(.8,.8)}75%{transform:translate(-50%,-50%) scale(-1,1)}100%{transform:translate(-50%,-50%) scale(var(--sc,1.25))}}
@keyframes fxKing{0%{transform:translate(-50%,-50%) scale(.1) rotate(-20deg);opacity:0}60%{transform:translate(-50%,-50%) scale(calc(var(--sc,1.25) * 1.2)) rotate(3deg);opacity:1}100%{transform:translate(-50%,-50%) scale(var(--sc,1.25))}}
@keyframes fxBeam{0%{transform:translate(-50%,-50%) scaleX(.02) scaleY(1.5);opacity:.4}60%{transform:translate(-50%,-50%) scaleX(1.3) scaleY(1.05);opacity:1}100%{transform:translate(-50%,-50%) scale(var(--sc,1.25))}}
@keyframes fxSh{0%{transform:translate(-50%,-50%) scale(calc(var(--sc,1.25) * 1.4));opacity:0}40%{opacity:1}100%{transform:translate(-50%,-50%) scale(var(--sc,1.25))}}
/* 毛玻璃 的 樣子（不用 backdrop-filter）：半 透明 漸層＋上面 一條 亮邊＋斜 斜 的 光 掃過 */
.awd .awp{position:relative;overflow:hidden;background:linear-gradient(160deg,rgba(255,255,255,.22),rgba(255,255,255,.06) 38%,rgba(20,26,50,.82) 60%,rgba(10,14,30,.9));box-shadow:inset 0 2px 0 rgba(255,255,255,.55),inset 0 -10px 30px rgba(0,0,0,.35),0 14px 30px rgba(0,0,0,.5)}
.awd .awp::before{content:'';position:absolute;left:0;top:0;width:45%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transform:translateX(-120%) skewX(-18deg);animation:awGlass 3.2s ease-in-out infinite;pointer-events:none}
.awd .awgrp.r2 .awp::before{animation-delay:.6s}.awd .awgrp.r3 .awp::before{animation-delay:1.2s}
@keyframes awGlass{0%,55%{transform:translateX(-120%) skewX(-18deg)}100%{transform:translateX(330%) skewX(-18deg)}}
/* 立體 頒獎台：上 面（亮）＋正 面（漸層）＋右 側 面（暗、斜 的）＝ 2D 畫 出 3D */
.awd .awpod .pf{box-shadow:inset 6px 0 0 rgba(255,255,255,.25),inset -8px 0 0 rgba(0,0,0,.25)}
.awd .awpod .pt{height:22px;top:-22px;left:-3%;right:-9%;clip-path:polygon(0 100%,7% 0,100% 0,93% 100%)}
.awd .awpod .ps{position:absolute;top:-11px;right:-9%;width:9%;bottom:0;background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.55));clip-path:polygon(0 11px,100% 0,100% calc(100% - 11px),0 100%)}
.awd .awpod.r1 .pf{background:linear-gradient(180deg,#FFF3B0,#FFD54A 22%,#C98A00 65%,#7A5200)}
.awd .awpod.r1 .pf::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.55) 45%,transparent 60%);background-size:250% 100%;animation:awPg 2.6s linear infinite;border-radius:6px 6px 0 0}
@keyframes awPg{from{background-position:120% 0}to{background-position:-120% 0}}
/* 前 三名 一句 榮譽 */
.awd .awhon{display:inline-block;margin:8px 0 0;padding:3px 16px;border-radius:999px;font-size:clamp(18px,2.6vh,28px);font-weight:900;color:#3A2600;background:linear-gradient(90deg,#FFE58A,#fff,#FFD54A);box-shadow:0 0 16px var(--aw1);opacity:0;transform:scale(.4)}
.awd .awgrp.show .awhon{animation:awHon .6s .8s cubic-bezier(.2,1.6,.4,1) forwards}@keyframes awHon{to{opacity:1;transform:none}}
.awd .awgrp.r2 .awhon{background:linear-gradient(90deg,#E8EEF6,#fff,#B9C4D4)}.awd .awgrp.r3 .awhon{background:linear-gradient(90deg,#F7C89A,#fff,#E09A5A)}
/* 冠軍 卡 外面 一圈 金色 呼吸 光（用 透明度，不 用 大 圖層 濾鏡）*/
.awd .awgrp.r1 .awps{position:relative}.awd .awgrp.r1 .awps::after{content:'';position:absolute;inset:-12px;border-radius:30px;border:4px solid #FFE58A;box-shadow:0 0 30px #FFD54A;opacity:0;pointer-events:none}
.awd.king .awgrp.r1 .awps::after,.awd.fin .awgrp.r1 .awps::after{animation:awBr 1.6s ease-in-out infinite}@keyframes awBr{0%,100%{opacity:.25}50%{opacity:1}}
/* 第四十五次：全部 站 上 頒獎台 以後「👑 冠軍」字 收起來（不 跟 最上面 的「🎉 恭喜！」疊 在 一起；皇冠、金色 光芒、呼吸 光 留著）*/
.awd.fin .awgrp.seat .awchamp{display:none}
@media (prefers-reduced-motion:reduce){.awd *{animation-duration:.01s!important;transition-duration:.01s!important}}
`;
module.exports = { CSS, JS: '\n/* ══ 🏆 頒獎 典禮（score/_awd.js）══ */\nvar AWD=(' + AWDSRC.toString() + ')();\n', AWDSRC };
