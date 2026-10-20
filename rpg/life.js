/* rpg/_life_rt.js — ⚔ 戰神之路：立體 3D 舞台（2026-10-20 第十六次；規格 rpg/CLAUDE.md 最上面「第十六次」）。只寫 ES5。
   老師（第十六次）：1 ＝ 眨眼、眼睛閃光、寵物 ^^ 開心臉 三種全部刪；2 ＝ 戰神之路（＋在家練習做完最後一幕）的音效、動物叫聲、〔🔊 音效〕全部刪；
   3 ＝「立體 3D 舞台」：戰士、武器、寵物 ＝ 有厚度、會轉的立體卡片，前後分層，鏡頭慢慢繞；四周立體光點風暴、光束從遠處射來；出招鏡頭衝近、震動、核彈級爆光。
   rpg/_build.js 把這一份做成 rpg/life.js（GitHub Pages 不給 _ 開頭的檔）；〔戰神之路〕直接載入，做完一次的最後一幕（score/_client.js）要用的時候才載入。
   RPLIFE.wrap(圖, 編號)          ＝ 圖外面包一層（反光）的 HTML
   RPLIFE.mount(容器)             ＝ 舊的名字（不做事，留給還沒重 build 的網頁）
   RPLIFE.stage(大方框, {c, tier}) ＝ 大方框 變成 3D 舞台（鏡頭繞、手指 拖 會 轉、立體光點風暴、魔法環）
   RPLIFE.strike(大方框, o)       ＝ 3D 出招（鏡頭衝近、戰士往前衝、武器 飛出去 轉、寵物 跳、蓄力 漩渦、命中 立體 爆炸；★5 核彈級）
   RPLIFE.burst(容器, o)          ＝ 一次 立體 爆炸（別的地方 也 可以 用：登場、最後一幕 打怪）
   RPLIFE.vortex(容器, o)         ＝ 立體 漩渦 往中間 收 ➜ 爆開（登場、進化）
   RPLIFE.hearts／nuzzle／swing／charge（一個動作）
   RPLIFE.combo(選項)             ＝ 🌟 全部 合體 出招（全螢幕 約 8 秒，3D 鏡頭） */
var RPLIFE;
(function () {
  var RM = false; try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(k) { return k < 0 ? 0 : k > 1 ? 1 : 1 - Math.pow(1 - k, 3); }
  function rel(host, e) { var a = host.getBoundingClientRect(), b = e.getBoundingClientRect(); return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height * .3, w: b.width, h: b.height, cy: b.top - a.top + b.height / 2 }; }
  var EC = function (e) { return window.RPFX && RPFX.EL[e] ? RPFX.EL[e].c : ['#FFFFFF', '#FFE07A', '#B57BFF']; };

  /* ══════════ 發光的點（一張小圖，畫很多次：不用 shadowBlur，iPad 才不會卡）══════════ */
  var SPR = {};
  function glow(col) { if (SPR[col]) return SPR[col]; var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.18, col); r.addColorStop(.45, hexA(col, .35)); r.addColorStop(1, hexA(col, 0)); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return (SPR[col] = c); }
  function hexA(h, a) { if (h.charAt(0) !== '#') return h; var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }

  /* ══════════ 3D 畫布：兩張（後面 ＝ 在卡片後面、前面 ＝ 在卡片前面），立體的點 照 遠近 放大縮小 ══════════
     點 p ＝ {x,y,z 立體位置（px，以 原點 為 中心）, vx,vy,vz, l 活多久, a 活了多久, s 大小, c 顏色, k 種類, dr 阻力, gv 重力}
     k：'d' 光點、'st' 拖尾（碎片）、'o' 繞圈（a 角度 r 半徑 w 角速度）、'rg' 光環（擴大的圓）、'bt' 閃電 */
  var F = 900;
  function Space(host, o) { o = o || {};
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var bk = el('canvas', 'd3cv bk'), ft = el('canvas', 'd3cv ft'); bk.setAttribute('aria-hidden', 'true'); ft.setAttribute('aria-hidden', 'true');
    if (o.bkIn) o.bkIn.insertBefore(bk, o.bkIn.firstChild); else host.insertBefore(bk, host.firstChild); host.appendChild(ft);
    var S = { host: host, P: [], cam: { ry: 0, rx: 0 }, ox: 0, oy: 0, w: 0, h: 0, d: Math.min(2, window.devicePixelRatio || 1), tick: null, dead: false, keep: !!o.keep, life: o.ms || 0, t: 0, flash: 0, fc: '#fff' };
    function size() { var r = host.getBoundingClientRect(); if (Math.abs(r.width - S.w) < 1 && Math.abs(r.height - S.h) < 1) return; S.w = Math.max(10, r.width); S.h = Math.max(10, r.height);
      [bk, ft].forEach(function (c) { c.width = Math.round(S.w * S.d); c.height = Math.round(S.h * S.d); }); }
    size(); S.ox = S.w / 2; S.oy = S.h / 2;
    var gb = bk.getContext('2d'), gf = ft.getContext('2d'), last = 0;
    S.add = function (p) { if (S.P.length < 1100) { p.a = p.a || 0; S.P.push(p); } return p; };
    S.kill = function () { S.dead = true; [bk, ft].forEach(function (c) { if (c.parentNode) c.parentNode.removeChild(c); }); };
    /* 立體 ➜ 畫面：先 照 鏡頭 轉（左右 ry、上下 rx），再 照 遠近 縮放；fx ＝ 不跟 鏡頭 轉 */
    function proj(p, out) { var x = p.x, y = p.y + (p.yt || 0), z = p.z;
      if (!p.fx) { var cy = Math.cos(S.cam.ry), sy = Math.sin(S.cam.ry), x2 = x * cy + z * sy, z2 = -x * sy + z * cy, cx = Math.cos(S.cam.rx), sx = Math.sin(S.cam.rx), y2 = y * cx - z2 * sx, z3 = y * sx + z2 * cx; x = x2; y = y2; z = z3; }
      var k = F / Math.max(80, F - z); out.x = (p.ox != null ? p.ox : S.ox) + x * k; out.y = (p.oy != null ? p.oy : S.oy) + y * k; out.k = k; out.z = z; return out; }
    var Q = {}, Q2 = {};
    function step(now) { if (S.dead) return; if (!host.isConnected && host.parentNode == null) { S.kill(); return; }
      var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now; S.t += dt * 1000;
      if (document.hidden) { requestAnimationFrame(step); return; }
      size(); if (S.tick) try { S.tick(dt, S.t); } catch (x) { }
      [gb, gf].forEach(function (g) { g.setTransform(S.d, 0, 0, S.d, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, S.w, S.h); g.globalCompositeOperation = 'lighter'; });
      if (S.flash > 0) { gf.globalCompositeOperation = 'source-over'; gf.fillStyle = hexA(S.fc, Math.min(1, S.flash)); gf.fillRect(0, 0, S.w, S.h); gf.globalCompositeOperation = 'lighter'; S.flash -= dt * 1.8; }
      for (var i = S.P.length - 1; i >= 0; i--) { var p = S.P[i]; p.a += dt; if (p.l && p.a >= p.l) { S.P.splice(i, 1); continue; }
        var kk = p.l ? p.a / p.l : 0, al = p.l ? (kk < .15 && p.fi ? kk / .15 : 1) * (p.fo === 0 ? 1 : 1 - kk * kk) : 1;
        if (p.k === 'o') { p.ang += p.w * dt; p.y += p.vy * dt; p.x = Math.cos(p.ang) * p.r; p.z = Math.sin(p.ang) * p.r; if (p.tilt) p.yt = p.z * p.tilt; if (p.l) al = Math.sin(Math.PI * kk); }
        else if (p.k !== 'rg' && p.k !== 'bt' && p.k !== 'pl') { if (p.home) { p.x += (0 - p.x) * Math.min(1, dt * p.home); p.y += (0 - p.y) * Math.min(1, dt * p.home); p.z += (0 - p.z) * Math.min(1, dt * p.home); }
          else { var dr = p.dr ? Math.pow(1 - Math.min(.9, p.dr * dt), 1) : 1; p.vx *= dr; p.vy *= dr; p.vz *= dr; p.vy += (p.gv || 0) * dt; p.px = p.x; p.py = p.y; p.pz = p.z; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; } }
        var g, q = proj(p, Q);
        if (p.k === 'rg') { var R = p.r0 + (p.r1 - p.r0) * ease(kk), n = 56; g = gf; for (var j = 0; j < n; j++) { var an = j / n * Math.PI * 2, pt = { x: p.x + Math.cos(an) * R, y: p.y + (p.flat ? Math.sin(an) * R : 0), z: p.z + (p.flat ? 0 : Math.sin(an) * R), fx: p.fx, ox: p.ox, oy: p.oy }, qq = proj(pt, Q2);
            var gg = qq.z >= 0 ? gf : gb, sz = p.s * qq.k; gg.globalAlpha = al * .9; gg.drawImage(glow(j % 4 ? p.c : '#FFFFFF'), qq.x - sz, qq.y - sz, sz * 2, sz * 2); } continue; }
        if (p.k === 'bt') { g = gf; g.globalAlpha = al; var q2 = proj({ x: p.x2, y: p.y2, z: p.z2, fx: p.fx, ox: p.ox, oy: p.oy }, Q2), segs = 9, x0 = q.x, y0 = q.y;
          [[p.s * 3, hexA(p.c, .35)], [p.s, p.c], [Math.max(1, p.s * .4), '#FFFFFF']].forEach(function (L, li) { g.strokeStyle = L[1]; g.lineWidth = L[0]; g.beginPath(); g.moveTo(x0, y0);
            for (var s = 1; s <= segs; s++) { var f = s / segs, jx = s === segs ? 0 : (p.jit[s] || 0); g.lineTo(x0 + (q2.x - x0) * f + jx, y0 + (q2.y - y0) * f + (s === segs ? 0 : (p.jit[s + 9] || 0))); } g.stroke(); }); continue; }
        if (p.k === 'pl') { g = gf; var wv = p.s * (1 - kk * .4); g.globalAlpha = al; var lg = g.createLinearGradient(q.x - wv, 0, q.x + wv, 0); lg.addColorStop(0, hexA(p.c, 0)); lg.addColorStop(.35, hexA(p.c, .7)); lg.addColorStop(.5, 'rgba(255,255,255,.95)'); lg.addColorStop(.65, hexA(p.c, .7)); lg.addColorStop(1, hexA(p.c, 0));
          g.fillStyle = lg; g.fillRect(q.x - wv, -20, wv * 2, q.y + 20 + wv * .6); continue; }
        g = q.z >= 0 ? gf : gb; var s2 = p.s * q.k * (p.grow ? 1 + kk * p.grow : 1);
        if (p.k === 'st' && p.px != null) { var qp = proj({ x: p.x - p.vx * .05, y: p.y - p.vy * .05, z: p.z - p.vz * .05, fx: p.fx, ox: p.ox, oy: p.oy }, Q2); g.globalAlpha = al; g.strokeStyle = p.c; g.lineCap = 'round'; g.lineWidth = Math.max(1, s2 * .55);
          g.beginPath(); g.moveTo(qp.x, qp.y); g.lineTo(q.x, q.y); g.stroke(); g.strokeStyle = '#FFFFFF'; g.lineWidth = Math.max(.6, s2 * .2); g.stroke(); continue; }
        g.globalAlpha = al * (p.al || 1); g.drawImage(glow(p.c), q.x - s2, q.y - s2, s2 * 2, s2 * 2); }
      gb.globalAlpha = gf.globalAlpha = 1;
      if (!S.keep && S.life && S.t > S.life && !S.P.length) { S.kill(); return; }
      requestAnimationFrame(step); }
    requestAnimationFrame(step); return S; }

  /* 一次 立體 爆炸（o ＝ {x, y 畫面位置, e 元素, c 顏色 3 個, tier 1～5, crit, big 倍數}）：照 元素 不一樣
     碎片（冰、科技、電漿、雷）／往上 飄 的 火星（火、毒、光、盾）／先 吸進去 再 爆開（虛空、重力、時間、宇宙）／旋風（風）／星星 球（星光、其他） */
  var KIND = { ice: 'sh', tech: 'sh', plasma: 'sh', thunder: 'sh', fire: 'up', toxic: 'up', light: 'up', shield: 'up', void: 'im', gravity: 'im', time: 'im', cosmic: 'im', wind: 'sp', star: 'sb' };
  function boom(S, o) { var C = o.c || EC(o.e), t = clamp(o.tier || 1, 1, 5), big = (o.big || 1) * (o.crit ? 1.3 : 1), kd = KIND[o.e] || 'sb', X = o.x, Y = o.y, n = Math.round((40 + t * 26) * big), sp = (260 + t * 70) * big;
    function one(i, dir, v) { var th = Math.random() * Math.PI * 2, ph = Math.acos(rnd(-1, 1)), s = v || sp * rnd(.35, 1);
      return { k: kd === 'sh' ? 'st' : 'd', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, vx: Math.sin(ph) * Math.cos(th) * s, vy: Math.cos(ph) * s * (kd === 'up' ? .6 : 1) - (kd === 'up' ? sp * .5 : 0), vz: Math.sin(ph) * Math.sin(th) * s, dr: 2.2, gv: kd === 'up' ? -60 : 40,
        l: rnd(.6, 1.2) + t * .08, s: rnd(3, 7) + t, c: C[i % 3], fi: 0 }; }
    if (kd === 'im') { for (var a = 0; a < 40 + t * 10; a++) (function (a) { var th = Math.random() * Math.PI * 2, r = rnd(120, 220) * big; S.add({ k: 'd', ox: X, oy: Y, fx: 1, x: Math.cos(th) * r, y: rnd(-80, 80), z: Math.sin(th) * r, home: 7, l: .32, s: rnd(3, 6), c: C[a % 3], fo: 0 }); })(a); }
    var go = function () { for (var i = 0; i < n; i++) S.add(one(i));
      if (kd === 'sp') for (var w = 0; w < 50 + t * 10; w++) S.add({ k: 'o', ox: X, oy: Y, fx: 1, ang: Math.random() * 6.28, r: rnd(30, 150) * big, w: rnd(6, 11), y: rnd(40, -40), vy: -rnd(60, 180), x: 0, z: 0, l: rnd(.8, 1.4), s: rnd(3, 6), c: C[w % 3] });
      if (kd === 'sb') for (var k = 0; k < 18 + t * 4; k++) S.add(one(k, 0, sp * 1.15));
      /* 立體 光環：一圈 平 的（地上）＋ 一圈 直 的（對著 你），愈 強 愈多 圈 */
      for (var r = 0; r < Math.min(3, 1 + Math.floor(t / 2)); r++) S.add({ k: 'rg', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, r0: 10, r1: (130 + r * 70) * big, l: .7 + r * .15, s: 4 + t * .6, c: C[(r + 1) % 3], flat: r % 2 === 1 });
      if (o.e === 'thunder' || t >= 4) for (var b = 0; b < 2 + t; b++) bolt(S, X, Y, C[b % 3]);
      if (o.crit) S.add({ k: 'rg', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, r0: 30, r1: 260 * big, l: .55, s: 6, c: '#FFFFFF' }); };
    if (kd === 'im') setTimeout(go, 300); else go(); }
  function bolt(S, X, Y, c) { var j = []; for (var i = 0; i < 20; i++) j.push(rnd(-26, 26)); S.add({ k: 'bt', ox: X, oy: Y, fx: 1, x: rnd(-160, 160), y: -Y - 40, z: rnd(-300, 100), x2: rnd(-20, 20), y2: rnd(-10, 10), z2: 0, l: rnd(.18, .3), s: rnd(2.5, 4.5), c: c, jit: j }); }
  /* ★5 核彈級：白光 蓋滿 ➜ 光柱 衝上去 ➜ 三圈 衝擊波 ➜ 一大顆 光球 爆開 ➜ 火星 慢慢 掉 */
  function nuke(S, o) { var C = o.c || EC(o.e), X = o.x, Y = o.y; S.flash = 1; S.fc = '#FFFFFF';
    S.add({ k: 'pl', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, l: 1.4, s: 70, c: C[1] });
    for (var r = 0; r < 4; r++) S.add({ k: 'rg', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, r0: 20, r1: Math.max(S.w, S.h) * (.55 + r * .22), l: 1 + r * .22, s: 7, c: r % 2 ? '#FFFFFF' : C[r % 3], flat: r % 2 === 0 });
    for (var i = 0; i < 360; i++) { var th = Math.random() * 6.28, ph = Math.acos(rnd(-1, 1)), s = rnd(420, 760); S.add({ k: i % 3 ? 'd' : 'st', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, vx: Math.sin(ph) * Math.cos(th) * s, vy: Math.cos(ph) * s, vz: Math.sin(ph) * Math.sin(th) * s, dr: 2.6, gv: 60, l: rnd(1, 1.8), s: rnd(4, 9), c: i % 5 ? C[i % 3] : '#FFFFFF' }); }
    setTimeout(function () { for (var k = 0; k < 90; k++) S.add({ k: 'd', ox: X, oy: Y, fx: 1, x: rnd(-S.w * .5, S.w * .5), y: -Y - rnd(0, 120), z: rnd(-300, 200), vx: rnd(-20, 20), vy: rnd(120, 240), vz: 0, l: rnd(1.6, 2.6), s: rnd(3, 6), c: C[k % 3] }); }, 500); }

  /* ══════════ 3D 舞台（〔戰神之路〕的 大方框）══════════ */
  var ST = null;
  function stage(m, o) { if (!m) return; o = o || {}; if (ST && ST.m !== m) { try { ST.S.kill(); } catch (e) { } ST = null; }
    var team = m.querySelector('.team'), C = o.c || ['#FFE07A', '#B57BFF', '#5AD8FF'], tier = clamp(o.tier || 1, 1, 5);
    m.classList.add('d3'); if (!team) return;
    /* 戰士 後面 的 光（離 鏡頭 很遠 ➜ 鏡頭 繞 的 時候 會 錯開 ＝ 有 深度） */
    if (!team.querySelector('.d3ray')) { var ry = el('i', 'd3ray'); ry.style.setProperty('--c1', C[1]); ry.style.setProperty('--c2', C[2]); team.insertBefore(ry, team.firstChild); }
    [].forEach.call(team.querySelectorAll('.hc,.wc,.pc'), function (c) { c.classList.add('d3c'); if (!c.querySelector(':scope>.d3g')) c.appendChild(el('i', 'd3g' + (c.classList.contains('r5') || c.classList.contains('r4') ? ' foil' : ''))); });
    if (RM) return;
    var hc = m.querySelector('#hcard') || team, run = m.querySelector('.mfrun'), S;
    if (ST && ST.m === m) { S = ST.S; ST.team = team; ST.hc = hc; ST.run = run; ST.C = C; ST.tier = tier; return; }
    S = Space(m, { keep: 1 }); ST = { m: m, S: S, team: team, hc: hc, run: run, C: C, tier: tier, tx: 0, ty: 0, px: 0, py: 0, kick: null };
    /* 手指 拖、滑鼠 移 ＝ 鏡頭 跟著 轉 */
    m.addEventListener('pointermove', function (e) { var r = m.getBoundingClientRect(); ST.tx = clamp((e.clientX - r.left) / r.width - .5, -.5, .5); ST.ty = clamp((e.clientY - r.top) / r.height - .5, -.5, .5); }, { passive: true });
    m.addEventListener('pointerleave', function () { ST.tx = ST.ty = 0; }, { passive: true });
    var spawn = 0;
    S.tick = function (dt, t) { var T = ST; if (!T.team.isConnected) { var nt = m.querySelector('.team'); if (!nt) return; T.team = nt; T.hc = m.querySelector('#hcard') || nt; T.run = m.querySelector('.mfrun'); }
      T.px += (T.tx - T.px) * Math.min(1, dt * 4); T.py += (T.ty - T.py) * Math.min(1, dt * 4);
      /* 鏡頭：慢慢 左右 繞（14 秒 一趟）＋ 上下 一點點 ＋ 手指 */
      var ryD = Math.sin(t / 14000 * 6.283) * 13 + T.px * 26, rxD = 5 + Math.sin(t / 9000 * 6.283) * 2.5 - T.py * 14, tz = 0, sh = 0;
      if (T.kick) { var K = T.kick, kt = (t - K.t0) / K.ms; if (kt >= 1) T.kick = null; else {
          var a = kt < .35 ? ease(kt / .35) : 1 - ease((kt - .35) / .65); tz = K.tz * a; ryD += K.ry * a; rxD += K.rx * a;
          if (K.hit && t >= K.hit && t < K.hit + K.shk) { var sk = 1 - (t - K.hit) / K.shk; sh = K.amp * sk; } } }
      var sx = sh ? rnd(-sh, sh) : 0, sy = sh ? rnd(-sh, sh) : 0;
      T.team.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,' + tz.toFixed(1) + 'px) rotateX(' + rxD.toFixed(2) + 'deg) rotateY(' + ryD.toFixed(2) + 'deg)';
      m.style.setProperty('--sx', (-ryD / 4).toFixed(2)); m.style.setProperty('--sy', (rxD / 5).toFixed(2));
      if (T.run) T.run.style.transform = 'translateX(-58%) rotateX(' + (68 + rxD).toFixed(1) + 'deg) rotateZ(' + (ryD * 1.4).toFixed(1) + 'deg)';
      S.cam.ry = ryD * Math.PI / 180; S.cam.rx = -rxD * Math.PI / 180 * .6;
      var mr = m.getBoundingClientRect(), hr = T.hc.getBoundingClientRect(); S.ox = hr.left - mr.left + hr.width / 2; S.oy = hr.top - mr.top + hr.height * .55;
      /* 立體 光點 風暴：繞著 戰士 轉、慢慢 往上 飄（★ 愈多 愈多 點） */
      spawn += dt * (14 + T.tier * 7); var R0 = Math.max(90, hr.width * .62);
      while (spawn > 1) { spawn--; S.add({ k: 'o', ang: Math.random() * 6.28, r: rnd(R0 * .8, R0 * 1.45), w: rnd(.5, 1.1), y: rnd(hr.height * .45, hr.height * .1), vy: -rnd(16, 44), x: 0, z: 0, l: rnd(4, 7), s: rnd(2, 4.5), c: T.C[Math.floor(Math.random() * 3)] }); }
      /* 從 很遠 的 地方 飛過來 的 光（穿過 鏡頭） */
      if (Math.random() < dt * (0.8 + T.tier * .5)) S.add({ k: 'st', x: rnd(-mr.width * .6, mr.width * .6), y: rnd(-hr.height * .9, hr.height * .4), z: -900, vx: 0, vy: 0, vz: rnd(700, 1100), l: 1.4, s: rnd(2, 3.5), c: T.C[Math.floor(Math.random() * 3)], dr: 0 });
      /* 兩圈 斜斜 的 魔法環（立體：有 一半 在 戰士 後面） */
      if (!T.ring || T.ring < t) { T.ring = t + 99999; ring(S, 'a', R0 * 1.15, .42, T.C[1]); ring(S, 'b', R0 * .95, -.3, T.C[2]); }
    };
  }
  /* 魔法環：40 顆 點 繞 一圈、斜 tilt、一直 轉（每一顆 自己 是 繞圈 的 點） */
  function ring(S, id, R, tilt, c) { for (var i = 0; i < 40; i++) S.add({ k: 'o', ang: i / 40 * 6.283, r: R, w: tilt > 0 ? .55 : -.42, y: 0, vy: 0, x: 0, z: 0, l: 0, s: i % 5 ? 2.2 : 4.2, c: i % 5 ? c : '#FFFFFF', al: .8, tilt: tilt, ring: id }); }

  /* ⚔ 3D 出招（〔戰神之路〕大方框）：o ＝ {hero, w:武器卡, p:寵物卡, to:靶, e, tier, crit, ch:蓄力好 的 時間, hit:打中 的 時間} */
  function strike(m, o) { if (!m || RM) return; o = o || {}; var C = EC(o.e), t = clamp(o.tier || 1, 1, 5), S = ST && ST.m === m ? ST.S : Space(m, { ms: 2600 }), now = S.t;
    if (ST && ST.m === m) ST.kick = { t0: now, ms: (o.hit || 800) + 900, tz: 110 + t * 18, ry: -16, rx: -3, hit: now + (o.hit || 800), shk: 380 + t * 90, amp: 3 + t * 2.2 };
    var hero = o.hero, w = o.w, p = o.p;
    if (hero) { hero.classList.remove('d3lg'); void hero.offsetWidth; hero.classList.add('d3lg'); setTimeout(function () { hero.classList.remove('d3lg'); }, 1300); }
    if (w) { w.style.setProperty('--wc', C[1]); w.classList.remove('d3ws'); void w.offsetWidth; w.classList.add('d3ws'); setTimeout(function () { w.classList.remove('d3ws'); }, 1500); }
    if (p) { setTimeout(function () { p.classList.remove('d3ph'); void p.offsetWidth; p.classList.add('d3ph'); setTimeout(function () { p.classList.remove('d3ph'); }, 1100); }, 260); }
    /* 蓄力：光點 從 四面八方 吸進 戰士（立體 漩渦） */
    var hr = hero ? rel(m, hero) : { x: S.w * .35, cy: S.h * .55, w: 100 }, H = { x: hr.x, y: hr.cy };
    for (var i = 0; i < 40 + t * 12; i++) { var th = Math.random() * 6.28, r = rnd(110, 240); S.add({ k: 'd', ox: H.x, oy: H.y, fx: 1, x: Math.cos(th) * r, y: rnd(-120, 120), z: Math.sin(th) * r, home: 5.5, l: (o.ch || 380) / 1000 + .15, s: rnd(2.5, 5), c: C[i % 3], fo: 0 }); }
    S.add({ k: 'rg', ox: H.x, oy: H.y, fx: 1, x: 0, y: 0, z: 0, r0: 200, r1: 10, l: (o.ch || 380) / 1000, s: 4, c: C[1], flat: 1 });
    var T = o.to ? rel(m, o.to) : { x: S.w * .78, cy: S.h * .45 };
    /* 光束 從 戰士 射 到 靶（立體 的 點 一顆一顆 飛過去） */
    setTimeout(function () { for (var k = 0; k < 26 + t * 6; k++) (function (k) { setTimeout(function () { var dx = T.x - H.x, dy = T.cy - H.y, s = rnd(1.3, 1.9);
      S.add({ k: 'st', ox: H.x, oy: H.y, fx: 1, x: rnd(-8, 8), y: rnd(-8, 8), z: rnd(-30, 60), vx: dx * s, vy: dy * s, vz: rnd(-60, 120), l: 1 / s, s: rnd(3, 6) + t * .4, c: C[k % 3], dr: 0 }); }, k * 9); })(k); }, o.ch || 380);
    setTimeout(function () { boom(S, { x: T.x, y: T.cy, e: o.e, c: C, tier: t, crit: o.crit, big: 1 }); if (t >= 5) nuke(S, { x: T.x, y: T.cy, e: o.e, c: C }); else { S.flash = .12 + t * .06; S.fc = C[1]; } }, o.hit || 800); }
  /* 一次 立體 爆炸（別的 地方 用：做完 一次 的 最後一幕 打怪、登場、合體）：o ＝ {at 元素 或 x,y, e, tier, crit, big} */
  function burst(host, o) { if (!host || RM) return; o = o || {}; var S = Space(host, { ms: 2400 }), x = o.x, y = o.y; if (o.at) { var r = rel(host, o.at); x = r.x; y = r.cy; }
    if (x == null) { x = S.w / 2; y = S.h / 2; } var C = o.c || EC(o.e); boom(S, { x: x, y: y, e: o.e, c: C, tier: o.tier, crit: o.crit, big: o.big || 1 });
    if ((o.tier || 1) >= 5 || o.nuke) nuke(S, { x: x, y: y, e: o.e, c: C }); else { S.flash = .1 + (o.tier || 1) * .05; S.fc = C[1]; } return S; }
  /* 立體 漩渦：o ＝ {x,y, c, tier, ms 收進來 要 多久} ➜ 光點 從 很遠、四面八方 轉著 收進 中間 ➜ 爆開 */
  function vortex(host, o) { if (!host || RM) return; o = o || {}; var S = Space(host, { ms: (o.ms || 1200) + 2200 }), C = o.c || EC(o.e), x = o.x == null ? S.w / 2 : o.x, y = o.y == null ? S.h / 2 : o.y, t = clamp(o.tier || 1, 1, 5), ms = o.ms || 1200;
    for (var i = 0; i < 90 + t * 30; i++) (function (i) { setTimeout(function () { var r = rnd(220, Math.max(S.w, S.h) * .6); S.add({ k: 'o', ox: x, oy: y, fx: 0, ang: Math.random() * 6.28, r: r, w: rnd(2, 4), y: rnd(-200, 200), vy: 0, x: 0, z: 0, l: ms / 1000 * rnd(.5, 1), s: rnd(2.5, 6), c: C[i % 3], shrink: r / (ms / 1000) }); }, i * (ms * .5 / (90 + t * 30))); })(i);
    S.tick = function (dt) { S.cam.ry += dt * .9; S.P.forEach(function (p) { if (p.shrink) { p.r = Math.max(4, p.r - p.shrink * dt * 1.4); p.y *= Math.pow(.2, dt); } }); };
    setTimeout(function () { boom(S, { x: x, y: y, e: o.e, c: C, tier: t, big: 1.4 }); if (t >= 5) nuke(S, { x: x, y: y, e: o.e, c: C }); }, ms);
    return S; }
  /* 戰士 蓄力（互動 用）：戰士 身邊 一圈 立體 光 收進去、亮一下 */
  function charge(m, hero, col) { if (!m || !hero || RM) return; var S = ST && ST.m === m ? ST.S : null; if (!S) return; var r = rel(m, hero), C = [col || '#FFE07A', '#FFFFFF', col || '#FFE07A'];
    for (var i = 0; i < 46; i++) { var th = Math.random() * 6.28, rr = rnd(90, 170); S.add({ k: 'd', ox: r.x, oy: r.cy, fx: 1, x: Math.cos(th) * rr, y: rnd(-140, 140), z: Math.sin(th) * rr, home: 3.2, l: .9, s: rnd(2, 4.5), c: C[i % 3], fo: 0 }); }
    setTimeout(function () { S.add({ k: 'rg', ox: r.x, oy: r.cy, fx: 1, x: 0, y: 0, z: 0, r0: 10, r1: 160, l: .6, s: 4, c: col || '#FFE07A', flat: 1 }); }, 800); }

  /* ══════════ 卡片：反光（3D 轉 的 時候 光 會 跑）══════════ */
  function wrap(imgHTML, id) { return '<span class="lfw">' + imgHTML + '</span>'; }
  function mount(host) { }
  /* 愛心 往上飄（寵物 撒嬌） */
  function hearts(host, x, y, n) { if (!host || RM) return; for (var i = 0; i < (n || 5); i++) (function (i) { var h = el('i', 'lfh', ['💗', '💖', '💕', '✨'][i % 4]); h.style.left = (x + rnd(-24, 24)) + 'px'; h.style.top = y + 'px'; h.style.setProperty('--dx', rnd(-30, 30) + 'px'); h.style.animationDelay = (i * .12) + 's';
      host.appendChild(h); setTimeout(function () { if (h.parentNode) h.parentNode.removeChild(h); }, 2000 + i * 120); })(i); }
  /* 🐾 寵物 蹭 戰士（撒嬌依偎）＋ 戰士 摸摸 寵物：寵物 跑過去、靠著 戰士 磨蹭、愛心；戰士 往 寵物 那邊 彎一下 */
  function nuzzle(host, hero, pet) { if (!host || !hero || !pet || RM) return; var a = rel(host, hero), b = rel(host, pet), dx = (a.x + a.w * .32) - b.x;
    pet.style.setProperty('--nx', dx + 'px'); pet.classList.remove('lfnz'); void pet.offsetWidth; pet.classList.add('lfnz');
    hero.classList.remove('lfpat'); void hero.offsetWidth; hero.classList.add('lfpat');
    setTimeout(function () { hearts(host, a.x + a.w * .3, a.y + a.h * .25, 6); }, 520);
    setTimeout(function () { pet.classList.remove('lfnz'); hero.classList.remove('lfpat'); }, 2300); }
  /* ⚔ 戰士 揮 武器（合體、最後一幕 用）：戰士 往前 衝；武器 揮出去（轉一大圈、留下 光的 殘影） */
  function swing(hero, wcard, col, ms) { if (RM) return; if (hero) { hero.classList.remove('lfatk'); void hero.offsetWidth; hero.classList.add('lfatk'); setTimeout(function () { hero.classList.remove('lfatk'); }, 1000); }
    if (wcard) { wcard.style.setProperty('--wc', col || '#FFE07A'); wcard.classList.remove('lfsw'); void wcard.offsetWidth; wcard.classList.add('lfsw'); setTimeout(function () { wcard.classList.remove('lfsw'); }, (ms || 900) + 200); } }

  /* ══════════ 做完 一次 的 最後一幕（score/_client.js）：打怪 的 場地 變 3D（鏡頭 慢慢 轉、卡片 反光）══════════ */
  function mini(box) { if (!box || box.classList.contains('d3m')) return; box.classList.add('d3m');
    [].forEach.call(box.querySelectorAll('.shimg,.fxp,.fxmon'), function (c) { if (!c.querySelector(':scope>.d3g')) c.appendChild(el('i', 'd3g')); });
    if (RM) return; var t0 = 0;
    (function loop(now) { if (!box.isConnected) return; if (!t0) t0 = now; var t = now - t0, ry = Math.sin(t / 9000 * 6.283) * 9;
      box.style.setProperty('--sx', (-ry / 4).toFixed(2)); var a = box.querySelector('.shimg'); if (a) a.style.transform = 'rotateY(' + ry.toFixed(2) + 'deg) rotateX(4deg)';
      requestAnimationFrame(loop); })(performance.now()); }

  /* ══════════ 🌟 全部 合體 出招（全螢幕 約 8 秒，3D 鏡頭）══════════
     o ＝ {base:'../', h:戰士圖, w:武器圖, wid, p:寵物圖, pid, au/cp/wg/mt/bg: 商城 寶物 的 圖（穿在身上 的 i.webp）, power, tier, star, id:5碼, title} */
  function combo(o) { o = o || {}; var ov = el('div', 'lfcb'); ov.setAttribute('role', 'dialog');
    var W = o.wid && window.RPFX ? RPFX.wInfo(o.wid) : { e: 'light', f: 'nova', s: 1 }, C = EC(W.e);
    var parts = [['au', '光環'], ['wg', '翅膀'], ['cp', '披風'], ['mt', '坐騎']].filter(function (x) { return o[x[0]]; });
    ov.innerHTML = '<div class="cbbg"' + (o.bg ? ' style="background-image:url(' + o.bg + ')"' : '') + '></div><div class="cbray" style="--c1:' + C[1] + ';--c2:' + C[2] + '"></div><div class="cbtt">🌟 全部 合體！</div>' +
      '<div class="cb3"><div class="cbst" id="cbst">' + parts.map(function (x) { return '<img class="cbp cb-' + x[0] + '" src="' + o[x[0]] + '" alt="">'; }).join('') +
      (o.h ? '<div class="cbh">' + wrap('<img src="' + o.h + '" alt="">') + '<i class="d3g foil"></i></div>' : '') + (o.w ? '<img class="cbw" src="' + o.w + '" alt="">' : '') + (o.p ? '<div class="cbpet">' + wrap('<img src="' + o.p + '" alt="">') + '<i class="d3g"></i></div>' : '') + '</div></div>' +
      '<div class="cblab" id="cblab"></div><div class="cbpow" id="cbpow"></div><button class="cbok">👌 好</button>';
    document.body.appendChild(ov); var st = ov.querySelector('#cbst'), lab = ov.querySelector('#cblab'), T = [], S = RM ? null : Space(ov, { keep: 1 });
    if (S) { var sp = 0; S.tick = function (dt, t) { var ry = Math.sin(t / 7000 * 6.283) * 16, r = st.getBoundingClientRect(), orr = ov.getBoundingClientRect();
        st.style.setProperty('--ry', ry.toFixed(2) + 'deg'); ov.style.setProperty('--sx', (-ry / 4).toFixed(2)); S.cam.ry = ry * Math.PI / 180; S.ox = r.left - orr.left + r.width / 2; S.oy = r.top - orr.top + r.height * .5;
        sp += dt * 30; while (sp > 1) { sp--; S.add({ k: 'o', ang: Math.random() * 6.28, r: rnd(r.width * .6, r.width * 1.2), w: rnd(.6, 1.3), y: rnd(r.height * .5, -r.height * .1), vy: -rnd(30, 70), x: 0, z: 0, l: rnd(3, 5), s: rnd(2.5, 5), c: C[Math.floor(Math.random() * 3)] }); } }; }
    function at(ms, f) { T.push(setTimeout(f, RM ? Math.min(ms, 300) : ms)); }
    function say(t) { lab.innerHTML = '<b>' + t + '</b>'; lab.classList.remove('go'); void lab.offsetWidth; lab.classList.add('go'); }
    function done() { T.forEach(clearTimeout); ov.classList.add('out'); setTimeout(function () { if (S) S.kill(); if (ov.parentNode) ov.parentNode.removeChild(ov); if (o.done) o.done(); }, 380); }
    ov.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.cbok')) done(); });
    at(60, function () { ov.classList.add('s1'); say('⚔ 你的 戰士'); });
    var t = 1500; parts.forEach(function (x, i) { at(t, function () { ov.classList.add('p-' + x[0]); say({ au: '✨ 光環', wg: '🪽 翅膀', cp: '👑 披風', mt: '🐉 坐騎' }[x[0]] + ' 上身！'); if (S) { var r = rel(ov, st); boom(S, { x: r.x, y: r.cy, e: W.e, c: C, tier: 1, big: .6 }); } }); t += 650; });
    if (o.p) { at(t, function () { ov.classList.add('s-pet'); say('🐾 寵物 來 幫忙！'); setTimeout(function () { var q = ov.querySelector('.cbpet'); if (q) { var r = rel(ov, q); hearts(ov, r.x, r.y, 5); } }, 400); }); t += 900; }
    if (o.w) { at(t, function () { ov.classList.add('s-w'); say('⚔ ' + (window.RPFX ? RPFX.EL[W.e].nm : '') + ' 武器 覺醒！'); var wc = ov.querySelector('.cbw'); if (S && wc) { var r = rel(ov, wc); boom(S, { x: r.x, y: r.cy, e: W.e, c: C, tier: 2, big: .7 }); } }); t += 900; }
    at(t, function () { ov.classList.add('s-go'); say('💥 合體 必殺！'); var hc = ov.querySelector('.cbh'), wc = ov.querySelector('.cbw');
      swing(hc, wc, C[1], 900);
      if (window.RPFX) { var tg = el('div', 'cbtg'); st.appendChild(tg);
        RPFX.attack(ov, { from: RPFX.pos(ov, wc || hc || st, .5, .4), to: RPFX.pos(ov, tg, .5, .5), w: o.wid, id: o.id, star: Math.max(3, o.star || W.s), crit: true, p: o.pid, pImg: o.p, pFrom: o.p ? RPFX.pos(ov, ov.querySelector('.cbpet')) : null, dmg: null, noNum: true, name: true,
          hook: function (x) { if (S) setTimeout(function () { var r = rel(ov, st); boom(S, { x: r.x, y: r.cy, e: x.e, c: C, tier: 5, crit: true, big: 1.4 }); nuke(S, { x: r.x, y: r.cy, e: x.e, c: C }); ov.classList.add('s-shk'); }, x.hit); } }); } });
    t += 2200; at(t, function () { var p = ov.querySelector('#cbpow'), n = +o.power || 0, k = 0, N = 24; ov.classList.add('s-end');
      p.innerHTML = '<span>⚔ 合體 威力</span><b id="cbn">0</b>' + (o.tier && window.RPFX ? RPFX.tb(o.tier, 1) : '');
      var iv = setInterval(function () { k++; var b = ov.querySelector('#cbn'); if (b) b.textContent = Math.round(n * k / N).toLocaleString(); if (k >= N) clearInterval(iv); }, 45); T.push(iv); say(o.title || '🎆 你 收集 的 全部 力量！'); });
    at(t + 4000, function () { ov.classList.add('s-ok'); });
    return done; }

  RPLIFE = { wrap: wrap, mount: mount, stage: stage, strike: strike, burst: burst, vortex: vortex, charge: charge, hearts: hearts, nuzzle: nuzzle, swing: swing, mini: mini, combo: combo, Space: Space, d3: true };
})();
