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
    /* 2026-10-21 第十七次 老師第 12 點：寵物 不要 像 貼紙 ➜ 地上 影子（跟著 浮 一大一小）、身體 邊緣 光、呼吸；長大 ＝ 腳下 一圈 藍色 立體 光環；進化 ＝ 兩圈 金色 光環＋背後 一對 光翼（慢慢 拍） */
    var pc = team.querySelector('#pcard');
    if (pc && !pc.querySelector(':scope>.p3sh')) { var sg = pc.classList.contains('s2') ? 2 : pc.classList.contains('s1') ? 1 : 0; pc.classList.add('p3');
      pc.insertBefore(el('i', 'p3sh'), pc.firstChild);
      if (sg >= 1) pc.insertBefore(el('i', 'p3ring r1'), pc.firstChild);
      if (sg >= 2) { pc.insertBefore(el('i', 'p3ring r2'), pc.firstChild); pc.insertBefore(el('i', 'p3wg l'), pc.firstChild); pc.insertBefore(el('i', 'p3wg r'), pc.firstChild); } }
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
      /* 寵物 身邊 的 立體 光點（長大、進化 愈多；繞著 寵物 轉、會 跑到 寵物 後面） */
      var pq = T.team.querySelector('#pcard'); if (pq) { var pr = pq.getBoundingClientRect(), ps = pq.classList.contains('s2') ? 2 : pq.classList.contains('s1') ? 1 : 0;
        T.ps = (T.ps || 0) + dt * (3 + ps * 6); while (T.ps > 1) { T.ps--; S.add({ k: 'o', ox: pr.left - mr.left + pr.width / 2, oy: pr.top - mr.top + pr.height * .6, ang: Math.random() * 6.28, r: rnd(pr.width * .45, pr.width * .75), w: rnd(.8, 1.6), y: rnd(pr.height * .3, 0), vy: -rnd(12, 30), x: 0, z: 0, l: rnd(2.5, 4), s: rnd(1.8, 3.2) + ps * .6, c: ps >= 2 ? ['#FFE07A', '#FFFFFF', T.C[1]][Math.floor(Math.random() * 3)] : ps ? ['#7FD4FF', '#FFFFFF'][Math.floor(Math.random() * 2)] : T.C[2] }); } }
      /* 從 很遠 的 地方 飛過來 的 光（穿過 鏡頭） */
      if (Math.random() < dt * (0.8 + T.tier * .5)) S.add({ k: 'st', x: rnd(-mr.width * .6, mr.width * .6), y: rnd(-hr.height * .9, hr.height * .4), z: -900, vx: 0, vy: 0, vz: rnd(700, 1100), l: 1.4, s: rnd(2, 3.5), c: T.C[Math.floor(Math.random() * 3)], dr: 0 });
      /* 兩圈 斜斜 的 魔法環（立體：有 一半 在 戰士 後面） */
      if (!T.ring || T.ring < t) { T.ring = t + 99999; ring(S, 'a', R0 * 1.15, .42, T.C[1]); ring(S, 'b', R0 * .95, -.3, T.C[2]); }
    };
  }
  /* 魔法環：40 顆 點 繞 一圈、斜 tilt、一直 轉（每一顆 自己 是 繞圈 的 點） */
  function ring(S, id, R, tilt, c) { for (var i = 0; i < 40; i++) S.add({ k: 'o', ang: i / 40 * 6.283, r: R, w: tilt > 0 ? .55 : -.42, y: 0, vy: 0, x: 0, z: 0, l: 0, s: i % 5 ? 2.2 : 4.2, c: i % 5 ? c : '#FFFFFF', al: .8, tilt: tilt, ring: id }); }

  /* 🗡 武器 招牌 3D 特效（2026-10-21 第十七次 老師第 10-(2) 點）：k ＝ RPFX.wSig(武器).k；H ＝ 戰士、T ＝ 靶（畫面位置）、C ＝ 元素 3 色、t ＝ 星等 1～5（愈高 愈多 愈大）、sc ＝ 大小 倍數 */
  function sigFx(S, k, H, T, C, t, sc) { sc = sc || 1; var dx = T.x - H.x, dy = T.y - H.y, N = 1 + t * .35, i, j;
    function at(ms, f) { setTimeout(f, ms); }
    function dot(ox, oy, x, y, z, o) { var p = { k: 'd', ox: ox, oy: oy, fx: 1, x: x, y: y, z: z, vx: 0, vy: 0, vz: 0, l: .7, s: 4, c: C[1], fi: 1 }; for (var q in o) p[q] = o[q]; return S.add(p); }
    if (k === 0) { /* 雙龍螺旋：兩條 光 繞著 彼此 轉 飛 過去 */
      for (i = 0; i < 46 * N; i++) (function (i) { at(i * 9, function () { var u = i / (46 * N); for (var s = 0; s < 2; s++) { var ph = u * Math.PI * 5 + s * Math.PI, R = 34 * sc * (1 - u * .4);
        dot(H.x, H.y, dx * u, dy * u + Math.cos(ph) * R, Math.sin(ph) * R * 1.6, { l: .55, s: (5 + t) * sc * (1 - u * .3), c: C[s ? 2 : 1] }); } }); })(i); }
    else if (k === 1) { /* 新月三連斬：三道 彎月 一道一道 斜 著 飛 */
      for (j = 0; j < 3; j++) (function (j) { at(j * 150, function () { var tl = (j - 1) * .7, v = 1.9; for (var a = 0; a < 28; a++) { var an = -1.25 + a / 27 * 2.5, R = 70 * sc;
        S.add({ k: 'st', ox: H.x, oy: H.y, fx: 1, x: Math.cos(an) * R * .45, y: Math.sin(an) * R * Math.cos(tl), z: Math.sin(an) * R * Math.sin(tl) * 2, vx: dx * v, vy: dy * v, vz: 0, l: 1 / v, s: (3 + t * .8) * sc * (1 - Math.abs(an) / 2), c: a % 4 ? C[1] : '#FFFFFF', dr: 0 }); } }); })(j); }
    else if (k === 2) { /* 天降流星：從 天上 斜 斜 砸 下來 */
      for (i = 0; i < 18 * N; i++) (function (i) { at(i * 40, function () { var x0 = (Math.random() - .5) * 260 * sc, z0 = (Math.random() - .5) * 300, sp = 900 + Math.random() * 300;
        S.add({ k: 'st', ox: T.x, oy: T.y, fx: 1, x: x0 + 120, y: -T.y - 60, z: z0, vx: -120 * sp / 1000, vy: sp, vz: -z0 * .9, l: (T.y + 60) / sp, s: (4 + t) * sc, c: C[i % 3], dr: 0 }); }); })(i); }
    else if (k === 3) { /* 大地裂刺：地上 一根一根 光刺 從 戰士 衝 到 靶 */
      for (i = 0; i < 9; i++) (function (i) { at(i * 55, function () { var u = (i + 1) / 9, gx = dx * u, gy = dy * u + 70 * sc;
        for (var q = 0; q < 6 + t; q++) S.add({ k: 'st', ox: H.x, oy: H.y, fx: 1, x: gx + (Math.random() - .5) * 16, y: gy, z: (Math.random() - .5) * 40, vx: 0, vy: -(260 + q * 60) * sc, vz: 0, l: .38, s: (3 + t * .6) * sc, c: C[q % 3], dr: 2 }); }); })(i); }
    else if (k === 4) { /* 五星環繞：五顆 法球 繞著 戰士 轉，再 一顆一顆 射出去 */
      var O = []; for (i = 0; i < 5; i++) O.push(S.add({ k: 'o', ox: H.x, oy: H.y, fx: 1, ang: i / 5 * 6.283, r: 70 * sc, w: 7, y: 0, vy: 0, x: 0, z: 0, l: .62 + i * .09, s: (9 + t) * sc, c: C[i % 3], tilt: .3 }));
      for (i = 0; i < 5; i++) (function (i) { at(600 + i * 90, function () { var o = O[i], v = 2.4; S.add({ k: 'st', ox: H.x, oy: H.y, fx: 1, x: o.x, y: o.y + (o.yt || 0), z: o.z, vx: (dx - o.x) * v, vy: (dy - o.y) * v, vz: -o.z * v, l: 1 / v, s: (8 + t) * sc, c: o.c, dr: 0 }); }); })(i); }
    else if (k === 5) { /* 十字審判：靶 上 兩道 斜 的 光 交叉 成 X */
      for (j = 0; j < 2; j++) (function (j) { at(j * 160, function () { var sg = j ? 1 : -1; for (var a = 0; a < 34; a++) { var u = a / 33 - .5;
        dot(T.x, T.y, u * 240 * sc, u * 240 * sc * sg, 0, { l: .75, s: (6 + t) * sc * (1 - Math.abs(u)), c: a % 3 ? C[1] : '#FFFFFF', grow: .8 }); } }); })(j); }
    else if (k === 6) { /* 星門：靶 後面 打開 一圈 直 的 門，光 被 吸進去 */
      S.add({ k: 'rg', ox: T.x, oy: T.y, fx: 1, x: 0, y: 0, z: -40, r0: 10, r1: 120 * sc, l: .9, s: 6 + t, c: C[1] });
      for (i = 0; i < 50 * N; i++) { var th = Math.random() * 6.283, r = (150 + Math.random() * 120) * sc; dot(T.x, T.y, Math.cos(th) * r, Math.sin(th) * r, -40, { home: 4, l: .8, s: (3 + t * .6) * sc, c: C[i % 3], fo: 0 }); } }
    else if (k === 7) { /* 連鎖雷：三道 閃電 從 戰士 劈 到 靶 */
      for (j = 0; j < 2 + Math.ceil(t / 2); j++) (function (j) { at(j * 90, function () { var jt = []; for (var q = 0; q < 20; q++) jt.push((Math.random() - .5) * 40 * sc);
        S.add({ k: 'bt', ox: H.x, oy: H.y, fx: 1, x: 0, y: 0, z: 0, x2: dx, y2: dy, z2: 0, l: .28, s: (3 + t * .5) * sc, c: C[j % 3], jit: jt }); }); })(j); }
    else if (k === 8) { /* 天柱：一道 光柱 從 天上 慢慢 壓 下來 */
      S.add({ k: 'pl', ox: T.x, oy: T.y, fx: 1, x: 0, y: 0, z: 0, l: 1.1, s: (40 + t * 8) * sc, c: C[1] });
      for (i = 0; i < 30 * N; i++) dot(T.x, T.y, (Math.random() - .5) * 80 * sc, -Math.random() * 300, (Math.random() - .5) * 80, { vy: 260, l: .9, s: (3 + t * .5) * sc, c: C[i % 3] }); }
    else if (k === 9) { /* 萬花綻放：靶 前面 一朵 立體 的 光 花 打開 */
      for (j = 0; j < 8; j++) { var an = j / 8 * 6.283; for (var a = 0; a < 7 + t; a++) { var sp = (60 + a * 26) * sc; dot(T.x, T.y, 0, 0, 0, { vx: Math.cos(an) * sp, vy: Math.sin(an) * sp * .6, vz: Math.sin(an) * sp * .8, dr: 2.4, l: 1, s: (6 - a * .3 + t * .5) * sc, c: a % 2 ? C[1] : C[2] }); } } }
    else if (k === 10) { /* 震地波：地上 一圈一圈 光環 從 戰士 滾 到 靶 */
      for (i = 0; i < 6; i++) (function (i) { at(i * 70, function () { var u = (i + 1) / 6; S.add({ k: 'rg', ox: H.x + dx * u, oy: H.y + dy * u + 50 * sc, fx: 1, x: 0, y: 0, z: 0, r0: 8, r1: (50 + i * 10) * sc, l: .5, s: 4 + t * .6, c: C[i % 3], flat: 1 }); }); })(i); }
    else { /* 彗星：一顆 大 光球 拖著 長 尾巴 畫 一道 弧 */
      for (i = 0; i < 40; i++) (function (i) { at(i * 11, function () { var u = i / 39, ax = dx * u, ay = dy * u - Math.sin(u * Math.PI) * 120 * sc;
        dot(H.x, H.y, ax, ay, Math.sin(u * Math.PI) * 80, { l: .5, s: (10 + t * 2) * sc * (.5 + u * .5), c: i % 3 ? C[1] : '#FFFFFF' }); }); })(i); } }
  /* ⚔ 戰士 階級 的 專屬 3D 特效（2026-10-21 第十八次 第 4-1 點：不一樣 的 階級 不一樣；愈 高階 愈 強大、愈 華麗）
     k ＝ 階級 1～5（0 ＝ 還沒有）；X,Y ＝ 戰士 的 位置；sc ＝ 大小 倍數
     1 見習戰士 ＝ 鋼鐵 火花 一圈／2 精英戰士 ＝ 藍色 雙環＋交叉 劍光／3 烈焰戰將 ＝ 火柱 沖天＋火星 往上 噴／
     4 雷霆戰神 ＝ 天雷 劈下＋雷電 光翼／5 傳說戰神 ＝ 黃金 光柱＋巨大 光翼＋頭上 皇冠 光環＋三圈 衝擊波（核彈級） */
  var TCOL = [null, ['#FFFFFF', '#C8D4E4', '#7A8698'], ['#E8FFFF', '#5AB8FF', '#1A6AFF'], ['#FFF4B8', '#FF8A1A', '#FF2A00'], ['#FFFFFF', '#FFE34A', '#8A6BFF'], ['#FFF6C8', '#FFC21A', '#FF8AE0']];
  function wings(S, X, Y, C, W, ms) { for (var s = -1; s <= 1; s += 2) for (var f = 0; f < 7; f++) { var tx = s * W * (.55 + f * .08), ty = -W * (.75 - f * .2), n = 14;
      for (var i = 0; i < n; i++) (function (s, f, i) { setTimeout(function () { var u = i / (n - 1); S.add({ k: 'd', ox: X, oy: Y, fx: 1, x: s * 18 + tx * u, y: -30 + (ty + 30) * u - Math.sin(u * Math.PI) * W * .12, z: -40 - f * 6, vx: 0, vy: 0, vz: 0, l: (ms || 1800) / 1000, s: 4.5 - f * .35 + (u > .85 ? 2 : 0), c: f % 3 ? C[1] : '#FFFFFF', fi: 1 }); }, f * 40 + i * 12); })(s, f, i); } }
  function tierFx(S, k, X, Y, sc) { k = clamp(k || 0, 0, 5); if (!k) return; sc = sc || 1; var C = TCOL[k], i;
    S.add({ k: 'rg', ox: X, oy: Y + 60 * sc, fx: 1, x: 0, y: 0, z: 0, r0: 10, r1: (120 + k * 40) * sc, l: .8, s: 4 + k, c: C[1], flat: 1 });
    for (i = 0; i < 30 + k * 30; i++) { var th = Math.random() * 6.283, sp = rnd(160, 300 + k * 60) * sc; S.add({ k: 'st', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, vx: Math.cos(th) * sp, vy: Math.sin(th) * sp * .6, vz: Math.sin(th) * sp, dr: 2.6, l: rnd(.4, .8), s: rnd(2, 3.5) + k * .4, c: C[i % 3] }); }
    if (k >= 2) { S.add({ k: 'rg', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, r0: 30, r1: 200 * sc, l: .9, s: 5, c: C[2] }); for (var j = 0; j < 2; j++) for (var a = 0; a < 30; a++) { var u = a / 29 - .5, sg = j ? 1 : -1; S.add({ k: 'd', ox: X, oy: Y, fx: 1, x: u * 260 * sc, y: u * 260 * sc * sg, z: 20, vx: 0, vy: 0, vz: 0, l: .7, s: (7 - Math.abs(u) * 8) * sc + 1, c: a % 3 ? C[1] : '#FFFFFF', fi: 1, grow: .6 }); } }
    if (k >= 3) { S.add({ k: 'pl', ox: X, oy: Y + 40 * sc, fx: 1, x: 0, y: 0, z: 0, l: 1.2, s: (46 + k * 10) * sc, c: C[1] }); for (i = 0; i < 80 + k * 20; i++) S.add({ k: 'd', ox: X, oy: Y + 60 * sc, fx: 1, x: rnd(-70, 70) * sc, y: 0, z: rnd(-70, 70), vx: rnd(-30, 30), vy: -rnd(200, 520) * sc, vz: 0, gv: 120, dr: .6, l: rnd(.8, 1.6), s: rnd(3, 6), c: C[i % 3] }); }
    if (k >= 4) { for (i = 0; i < 4 + k * 2; i++) (function (i) { setTimeout(function () { bolt(S, X + rnd(-120, 120) * sc, Y, C[i % 3]); }, i * 70); })(i); wings(S, X, Y, C, 170 * sc, 1600 + k * 200); }
    if (k >= 5) { S.flash = Math.max(S.flash, .55); S.fc = C[0];
      for (i = 0; i < 48; i++) S.add({ k: 'o', ox: X, oy: Y - 150 * sc, fx: 1, ang: i / 48 * 6.283, r: 60 * sc, w: 2.4, y: 0, vy: 0, x: 0, z: 0, l: 2.4, s: i % 6 ? 3.4 : 7, c: i % 6 ? C[1] : '#FFFFFF', tilt: .25, fi: 1 });
      for (var r = 0; r < 3; r++) S.add({ k: 'rg', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, r0: 20, r1: Math.max(S.w, S.h) * (.5 + r * .2), l: 1 + r * .25, s: 7, c: r % 2 ? '#FFFFFF' : C[1], flat: r === 1 });
      for (i = 0; i < 240; i++) { var t2 = Math.random() * 6.283, p2 = Math.acos(rnd(-1, 1)), s2 = rnd(380, 700) * sc; S.add({ k: i % 3 ? 'd' : 'st', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, vx: Math.sin(p2) * Math.cos(t2) * s2, vy: Math.cos(p2) * s2, vz: Math.sin(p2) * Math.sin(t2) * s2, dr: 2.4, gv: 50, l: rnd(1, 1.8), s: rnd(4, 9), c: i % 4 ? C[i % 3] : '#FFFFFF' }); } } }
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
    /* 2026-10-21 第十八次 第 2～4 點：上一版 的 光束 回來（一定 有）＋ 這一把 武器 自己的 招牌（疊 上去）＋ 戰士 階級 的 專屬 特效（o.cls）；
       威力 ＝ 武器 星等 和 階級 取 大的（愈 高 愈 猛：★4／★★★★ 以上 天雷、★5／★★★★★ 核彈級） */
    var G = o.wid && window.RPFX && RPFX.wSig ? RPFX.wSig(o.wid) : null, K = clamp(o.cls || 0, 0, 5), P = Math.max(t, K);
    if (K) setTimeout(function () { tierFx(S, K, H.x, H.y, .8); }, 60);
    if (G) { setTimeout(function () { sigFx(S, G.k, H, { x: T.x, y: T.cy }, C, P, 1 + K * .08); var nm = el('div', 'd3sig', '⚔ ' + G.nm); nm.style.left = T.x + 'px'; nm.style.top = Math.max(10, T.cy - 120) + 'px'; nm.style.setProperty('--c', C[1]); m.appendChild(nm); setTimeout(function () { if (nm.parentNode) nm.parentNode.removeChild(nm); }, 1900); }, o.ch || 380); }
    setTimeout(function () { for (var k = 0; k < 26 + P * 8; k++) (function (k) { setTimeout(function () { var dx = T.x - H.x, dy = T.cy - H.y, s = rnd(1.3, 1.9);
      S.add({ k: 'st', ox: H.x, oy: H.y, fx: 1, x: rnd(-8, 8), y: rnd(-8, 8), z: rnd(-30, 60), vx: dx * s, vy: dy * s, vz: rnd(-60, 120), l: 1 / s, s: rnd(3, 6) + P * .5, c: C[k % 3], dr: 0 }); }, k * 9); })(k); }, o.ch || 380);
    setTimeout(function () { boom(S, { x: T.x, y: T.cy, e: o.e, c: C, tier: P, crit: o.crit, big: 1 + K * .1 }); if (P >= 5) nuke(S, { x: T.x, y: T.cy, e: o.e, c: C }); else { S.flash = .12 + P * .06; S.fc = C[1]; }
      if (K >= 4) for (var b = 0; b < K * 2; b++) bolt(S, T.x + rnd(-60, 60), T.cy, TCOL[K][b % 3]); }, o.hit || 800);
    /* 第二十二次（疊 上去）：武器 3D 螺旋 環繞 戰神（階級 愈高 愈多 把）➜ 一起 射出；命中 ＝ 魔幻 大招（8 種 每次 換）＋ 名字 */
    var wi = w && w.querySelector && w.querySelector('img'); if (wi) orbit(m, S, H, wi.getAttribute('src'), K, C, { ms: Math.max(500, (o.hit || 800) - 120), to: { x: T.x, y: T.cy } });
    var uk = ultPick(); setTimeout(function () { ult(S, uk, H, { x: T.x, y: T.cy }, C, P); var nm2 = el('div', 'd3sig d3ult', '✦ ' + ULTN[uk]); nm2.style.left = T.x + 'px'; nm2.style.top = Math.min(S.h - 60, T.cy + 70) + 'px'; nm2.style.setProperty('--c', C[0]); m.appendChild(nm2); setTimeout(function () { if (nm2.parentNode) nm2.parentNode.removeChild(nm2); }, 1900); }, (o.hit || 800) + 60); }
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
  /* 🐾 進化 的 3D 光繭（2026-10-21 第十七次 老師第 12 點）：光點 排成 一顆 立體 的 球 慢慢 轉、慢慢 縮小 ➜ 破開 ➜ 光 往外 爆 */
  function cocoon(host, o) { if (!host || RM) return; o = o || {}; var S = Space(host, { ms: (o.ms || 2400) + 2600 }), C = o.c || EC(o.e), x = o.x, y = o.y, R = o.r || 150, ms = o.ms || 2400, L = [];
    for (var la = -5; la <= 5; la++) { var cl = Math.cos(la / 6 * 1.5708), n = Math.max(6, Math.round(28 * cl)); for (var i = 0; i < n; i++) L.push(S.add({ k: 'o', ox: x, oy: y, ang: i / n * 6.283 + la, r: R * cl, w: .9 + la * .04, y: R * Math.sin(la / 6 * 1.5708), vy: 0, x: 0, z: 0, l: ms / 1000, s: 3.4, c: C[(la + 6) % 3], al: .9, fi: 1, fo: 0 })); }
    S.tick = function (dt, t) { S.cam.ry += dt * .5; var k = Math.min(1, t / ms); L.forEach(function (p) { if (p.r0 == null) { p.r0 = p.r; p.y0 = p.y; } p.r = p.r0 * (1 - k * .55); p.y = p.y0 * (1 - k * .55); }); };
    setTimeout(function () { S.flash = .5; S.fc = '#FFFFFF'; for (var i = 0; i < 220; i++) { var th = Math.random() * 6.283, ph = Math.acos(rnd(-1, 1)), sp = rnd(260, 520);
      S.add({ k: i % 3 ? 'd' : 'st', ox: x, oy: y, fx: 1, x: 0, y: 0, z: 0, vx: Math.sin(ph) * Math.cos(th) * sp, vy: Math.cos(ph) * sp, vz: Math.sin(ph) * Math.sin(th) * sp, dr: 2.2, l: rnd(1, 1.8), s: rnd(3, 7), c: i % 4 ? C[i % 3] : '#FFFFFF' }); }
      for (var r = 0; r < 3; r++) S.add({ k: 'rg', ox: x, oy: y, fx: 1, x: 0, y: 0, z: 0, r0: 20, r1: 260 + r * 120, l: 1.2 + r * .2, s: 5, c: C[r], flat: r === 1 }); }, ms); }
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
  /* 🌟 合體 必殺 的 收尾 主題（2026-10-21 第十七次 10-(3)；第十八次 第 2～4 點：不再 低調 ➜ 跟 上一版 一樣 猛，再 照 合體 等級 G 一層一層 疊 更 大）
     6 種 主題 每一次 換一種（v）；G ＝ 合體 等級 1～5（階級＋收集 愈強 愈高） */
  var FINN = ['天柱降臨', '星河漩渦', '雙龍升天', '流星審判', '極光帷幕', '太陽核心', '萬劍歸宗', '鳳凰展翅', '雷龍環繞', '星門開啟', '黑洞吞噬', '光之神殿'];   /* 2026-10-23 第二十二次：6 ➜ 12 種（每一次 合體 完全 不一樣） */
  /* 第二十二次 新的 6 種 合體 主題（v 6～11）：每一種 的 形狀 都 不一樣；G 愈高 愈多 */
  function fin2(S, v, G, X, Y, C, Hh) { var i, N = 1 + G * .35;
    if (v === 6) { for (i = 0; i < 36 * N; i++) { var a = i / (36 * N) * 6.283, r = 360 + (i % 3) * 60; S.add({ k: 'st', ox: X, oy: Y, fx: 1, x: Math.cos(a) * r, y: Math.sin(a) * r * .55 - 60, z: Math.sin(a) * 200, vx: -Math.cos(a) * r / .7, vy: -(Math.sin(a) * r * .55 - 60) / .7, vz: -Math.sin(a) * 200 / .7, l: .7, s: 6 + G, c: C[i % 3], dr: 0 }); }
      setTimeout(function () { boom(S, { x: X, y: Y, c: C, tier: 5, crit: true, big: 1.3 }); }, 700); }
    else if (v === 7) { wings(S, X, Y - Hh * .15, [C[0], '#FF8A1A', '#FF2A00'], Math.min(S.w * .42, 380), 2200);
      for (i = 0; i < 160 * N; i++) S.add({ k: 'd', ox: X, oy: Y + Hh * .3, fx: 1, x: rnd(-260, 260), y: 0, z: rnd(-160, 160), vx: rnd(-40, 40), vy: -rnd(200, 620), vz: 0, gv: 120, l: rnd(1.2, 2.4), s: rnd(3, 7), c: ['#FFF4B8', '#FF8A1A', '#FF2A00'][i % 3] }); }
    else if (v === 8) { for (i = 0; i < 140 * N; i++) (function (i) { setTimeout(function () { var u = i / (140 * N), ph = u * 30; S.add({ k: 'd', ox: X, oy: Y + Hh * .4, fx: 1, x: Math.cos(ph) * (150 + G * 12), y: -u * Hh * 1.5, z: Math.sin(ph) * (150 + G * 12), vx: 0, vy: 0, vz: 0, l: 1.3, s: 8 + G, c: i % 5 ? C[1] : '#FFFFFF', fi: 1 }); if (i % 18 === 0) bolt(S, X + rnd(-180, 180), Y, C[i % 3]); }, i * 7); })(i); }
    else if (v === 9) { for (i = 0; i < 5 + G; i++) S.add({ k: 'rg', ox: X, oy: Y - Hh * .1, fx: 1, x: 0, y: 0, z: 0, r0: 20 + i * 30, r1: 220 + i * 70, l: 1.4 + i * .15, s: 6, c: C[i % 3] });
      for (i = 0; i < 160 * N; i++) { var th = Math.random() * 6.283; S.add({ k: 'st', ox: X, oy: Y - Hh * .1, fx: 1, x: Math.cos(th) * 20, y: Math.sin(th) * 20, z: 0, vx: Math.cos(th) * rnd(500, 1100), vy: Math.sin(th) * rnd(500, 1100), vz: rnd(-200, 600), l: rnd(.6, 1.1), s: rnd(2, 4) + G * .5, c: C[i % 3], dr: 0 }); } }
    else if (v === 10) { for (i = 0; i < 260 * N; i++) { var t2 = Math.random() * 6.283, r2 = rnd(220, Math.max(S.w, S.h) * .6); S.add({ k: 'd', ox: X, oy: Y, fx: 1, x: Math.cos(t2) * r2, y: rnd(-160, 160), z: Math.sin(t2) * r2, home: 3.2, l: 1.1, s: rnd(3, 6), c: i % 4 ? C[i % 3] : '#FFFFFF', fo: 0 }); }
      S.add({ k: 'rg', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, r0: 300, r1: 6, l: 1, s: 10, c: '#000000' });
      setTimeout(function () { nuke(S, { x: X, y: Y, c: C }); }, 1050); }
    else { for (var p = 0; p < 5; p++) { var px = X + (p - 2) * Math.min(S.w * .16, 150); S.add({ k: 'pl', ox: px, oy: Y, fx: 1, x: 0, y: 0, z: 0, l: 2, s: 30 + G * 8, c: C[p % 3] }); S.add({ k: 'rg', ox: px, oy: Y + Hh * .35, fx: 1, x: 0, y: 0, z: 0, r0: 10, r1: 120, l: 1.2, s: 5, c: C[1], flat: 1 }); }
      for (i = 0; i < 70; i++) S.add({ k: 'o', ox: X, oy: Y - Hh * .7, fx: 1, ang: i / 70 * 6.283, r: 160, w: 1.6, y: 0, vy: 0, x: 0, z: 0, l: 2.6, s: i % 5 ? 4 : 9, c: i % 5 ? C[1] : '#FFFFFF', tilt: .2, fi: 1 }); } }
  function finale(S, v, G, X, Y, C, hh) { var i, n = 120 + G * 70, Hh = hh || 300;
    if (v === 0) { S.add({ k: 'pl', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, l: 2.2, s: 70 + G * 22, c: C[1] });
      for (i = 0; i < 2 + G; i++) S.add({ k: 'rg', ox: X, oy: Y + Hh * .3, fx: 1, x: 0, y: 0, z: 0, r0: 20, r1: 220 + i * 110, l: 1.2 + i * .3, s: 7, c: C[i % 3], flat: 1 }); }
    else if (v === 1) { for (i = 0; i < n * 2; i++) S.add({ k: 'o', ox: X, oy: Y, fx: 1, ang: Math.random() * 6.283, r: 30 + Math.pow(Math.random(), .7) * (200 + G * 60), w: 2.4 + Math.random() * 1.6, y: (Math.random() - .5) * 20, vy: 0, x: 0, z: 0, l: 2.2 + Math.random(), s: rnd(3, 6) + G * .6, c: C[i % 3], tilt: .32 }); }
    else if (v === 2) { for (i = 0; i < n; i++) (function (i) { setTimeout(function () { for (var s = 0; s < 2; s++) { var u = i / n, ph = u * 11 + s * Math.PI; S.add({ k: 'd', ox: X, oy: Y + Hh * .45, fx: 1, x: Math.cos(ph) * (90 + G * 14), y: -u * Hh * 1.6, z: Math.sin(ph) * (110 + G * 16), vx: 0, vy: -40, vz: 0, l: 1.4, s: 6 + G, c: C[s ? 2 : 1], fi: 1 }); } }, i * 8); })(i); }
    else if (v === 3) { for (i = 0; i < 24 + G * 12; i++) (function (i) { setTimeout(function () { var x0 = (Math.random() - .5) * S.w * .8, sp = 900 + Math.random() * 300;
        S.add({ k: 'st', ox: X, oy: Y, fx: 1, x: x0 + 160, y: -Y - 40, z: (Math.random() - .5) * 300, vx: -160 * sp / 700, vy: sp, vz: 0, l: (Y + 40) / sp, s: 7 + G * 1.5, c: C[i % 3], dr: 0 }); setTimeout(function () { boom(S, { x: X + x0 * .3, y: Y, c: C, tier: 2, big: .5 }); }, 200); }, i * 45); })(i); }
    else if (v === 4) { for (var b = 0; b < 3 + G; b++) for (i = 0; i < 50; i++) S.add({ k: 'd', ox: 0, oy: Y - Hh * (.55 + b * .1), fx: 1, x: i / 49 * S.w, y: Math.sin(i / 49 * 6.283 + b) * 30, z: 0, vx: 30 + b * 8, vy: Math.cos(i / 6 + b) * 10, vz: 0, l: 2.4, s: 14 + G * 3, c: C[(b + 1) % 3], al: .7, fi: 1 }); }
    else if (v >= 6) fin2(S, v, G, X, Y, C, Hh);
    else if (v === 5) { S.flash = Math.max(S.flash, .6); S.fc = C[0]; for (i = 0; i < n * 2; i++) { var th = Math.random() * 6.283, ph = Math.acos(Math.random() * 2 - 1), sp = 260 + G * 60; S.add({ k: i % 3 ? 'd' : 'st', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, vx: Math.sin(ph) * Math.cos(th) * sp, vy: Math.cos(ph) * sp, vz: Math.sin(ph) * Math.sin(th) * sp, dr: 1.4, l: 1.8, s: 5 + G, c: i % 4 ? C[i % 3] : '#FFFFFF', fi: 1 }); } }
    /* 一層一層 疊：G2 地上 衝擊波、G3 天雷＋光點 噴泉、G4 頭上 金色 王冠 光環＋第二顆 核彈、G5 全白 閃光＋第二種 主題＋巨大 光翼 */
    if (G >= 2) for (i = 0; i < 2; i++) S.add({ k: 'rg', ox: X, oy: Y + Hh * .42, fx: 1, x: 0, y: 0, z: 0, r0: 30, r1: Math.max(S.w, S.h) * (.5 + i * .3), l: 1.4 + i * .3, s: 6, c: i ? '#FFFFFF' : C[1], flat: 1 });
    if (G >= 3) { for (i = 0; i < 6 + G * 2; i++) (function (i) { setTimeout(function () { bolt(S, X + rnd(-200, 200), Y, C[i % 3]); }, i * 60); })(i);
      for (i = 0; i < 140; i++) S.add({ k: 'd', ox: X, oy: Y + Hh * .4, fx: 1, x: (Math.random() - .5) * 200, y: 0, z: (Math.random() - .5) * 200, vx: rnd(-60, 60), vy: -rnd(300, 700), vz: rnd(-60, 60), gv: 260, l: rnd(1.4, 2.4), s: rnd(3, 6), c: C[i % 3] }); }
    if (G >= 4) { for (i = 0; i < 60; i++) S.add({ k: 'o', ox: X, oy: Y - Hh * .62, fx: 1, ang: i / 60 * 6.283, r: 80, w: 2.2, y: 0, vy: 0, x: 0, z: 0, l: 3, s: i % 6 ? 4 : 8, c: i % 6 ? '#FFD54A' : '#FFFFFF', tilt: .25, fi: 1 });
      setTimeout(function () { nuke(S, { x: X, y: Y - Hh * .1, c: [C[2], '#FFFFFF', C[1]] }); }, 900); }
    if (G >= 5) { setTimeout(function () { S.flash = 1; S.fc = '#FFFFFF'; finale(S, (v + 3) % 6, 3, X, Y, C, hh); wings(S, X, Y - Hh * .1, TCOL[5], Math.min(S.w * .45, 420), 2600); }, 1500); } }

  /* ══════════ 🌟 全部 合體 出招（全螢幕 約 9～11 秒，3D 鏡頭）══════════
     o ＝ {base:'../', h:戰士圖, w:武器圖, wid, p:寵物圖, pid, au/cp/wg/mt/bg: 商城 寶物 的 圖, ids:{au,cp,wg,mt}: 寶物 編號, power, tier, cls: 階級, star, id:5碼, title, grade: 合體 等級, v: 主題}
     2026-10-21 第十八次 第 2、3 點（老師：只請 調 三條 光束，沒有 請 降級）：上一版 全部 回來 ── 2D 必殺 RPFX.attack、立體 大爆炸（威力 5）、★5 核彈級、整個 畫面 震動；
     再 疊上：三條 直 的 光束（不轉）、戰士 階級 專屬 特效、每一樣 寶物 自己的 專屬 必殺（上身 的 時候）、武器 招牌、6 種 主題、合體 等級 愈高 疊 愈多 層 */
  function combo(o) { o = o || {}; var ov = el('div', 'lfcb'); ov.setAttribute('role', 'dialog');
    var W = o.wid && window.RPFX ? RPFX.wInfo(o.wid) : { e: 'light', f: 'nova', s: 1 }, C = EC(W.e), K = clamp(o.cls || 0, 0, 5), ids = o.ids || {};
    var parts = [['au', '光環'], ['wg', '翅膀'], ['cp', '披風'], ['mt', '坐騎']].filter(function (x) { return o[x[0]]; });
    ov.innerHTML = '<div class="cbbg"' + (o.bg ? ' style="background-image:url(' + o.bg + ')"' : '') + '></div><div class="cbray" style="--c1:' + C[1] + ';--c2:' + C[2] + '"><i></i><i></i><i></i></div><div class="cbtt">🌟 全部 合體！</div>' +
      '<div class="cb3"><div class="cbst" id="cbst" style="--c1:' + C[1] + '">' + parts.map(function (x) { return '<img class="cbp cb-' + x[0] + '" src="' + o[x[0]] + '" alt="">'; }).join('') +
      (o.h ? '<div class="cbh">' + wrap('<img src="' + o.h + '" alt="">') + '<i class="d3g foil"></i></div>' : '') + (o.w ? '<img class="cbw" src="' + o.w + '" alt="">' : '') + (o.p ? '<div class="cbpet">' + wrap('<img src="' + o.p + '" alt="">') + '<i class="d3g"></i></div>' : '') + '</div></div>' +
      '<div class="cblab" id="cblab"></div><div class="cbpow" id="cbpow"></div><button class="cbok">👌 好</button>';
    document.body.appendChild(ov); var st = ov.querySelector('#cbst'), lab = ov.querySelector('#cblab'), T = [], S = RM ? null : Space(ov, { keep: 1 });
    if (S) { var sp = 0; S.tick = function (dt, t) { var ry = Math.sin(t / 7000 * 6.283) * 16, r = st.getBoundingClientRect(), orr = ov.getBoundingClientRect();
        st.style.setProperty('--ry', ry.toFixed(2) + 'deg'); ov.style.setProperty('--sx', (-ry / 4).toFixed(2)); S.cam.ry = ry * Math.PI / 180; S.ox = r.left - orr.left + r.width / 2; S.oy = r.top - orr.top + r.height * .5;
        sp += dt * (30 + K * 10); while (sp > 1) { sp--; S.add({ k: 'o', ang: Math.random() * 6.28, r: rnd(r.width * .6, r.width * 1.2), w: rnd(.6, 1.3), y: rnd(r.height * .5, -r.height * .1), vy: -rnd(30, 70), x: 0, z: 0, l: rnd(3, 5), s: rnd(2.5, 5), c: C[Math.floor(Math.random() * 3)] }); } }; }
    function at(ms, f) { T.push(setTimeout(f, RM ? Math.min(ms, 300) : ms)); }
    function say(t) { lab.innerHTML = '<b>' + t + '</b>'; lab.classList.remove('go'); void lab.offsetWidth; lab.classList.add('go'); }
    function done() { T.forEach(clearTimeout); ov.classList.add('out'); setTimeout(function () { if (S) S.kill(); if (ov.parentNode) ov.parentNode.removeChild(ov); if (o.done) o.done(); }, 380); }
    ov.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.cbok')) done(); });
    at(60, function () { ov.classList.add('s1'); say('⚔ 你的 戰士'); });
    /* 戰士 到了 ➜ 階級 專屬 特效（★ 鋼鐵 火花 ➜ ★★★★★ 黃金 光翼＋核彈） */
    var t = 1300; if (K && window.RPFX) { at(t, function () { say(RPFX.tb(K) + ' ' + RPFX.ts(K) + ' ' + RPFX.TN[K] + ' 登場！'); var h = ov.querySelector('.cbh'); if (h) { h.classList.add('on2'); } if (S) { var r = rel(ov, st); tierFx(S, K, r.x, r.cy, 1); } }); t += 1000 + K * 120; }
    parts.forEach(function (x, i) { at(t, function () { ov.classList.add('p-' + x[0]); var G0 = window.RPFX && RPFX.iSig ? RPFX.iSig(ids[x[0]] || x[0]) : null;
      say({ au: '✨ 光環', wg: '🪽 翅膀', cp: '👑 披風', mt: '🐉 坐騎' }[x[0]] + ' 上身！' + (G0 ? '　' + G0.nm : ''));
      var h = ov.querySelector('.cbh'); if (h) { h.classList.remove('on2'); void h.offsetWidth; h.classList.add('on2'); }
      if (S) { var r = rel(ov, st), C0 = G0 ? EC(G0.e) : C; boom(S, { x: r.x, y: r.cy, e: G0 ? G0.e : W.e, c: C0, tier: 2 + Math.min(2, K >> 1), big: .8 });
        if (G0) sigFx(S, G0.k, { x: r.x - r.w * .9, y: r.cy + r.h * .2 }, { x: r.x, y: r.cy }, C0, 3, 1); } }); t += 900; });
    if (o.p) { at(t, function () { ov.classList.add('s-pet'); say('🐾 寵物 來 幫忙！'); setTimeout(function () { var q = ov.querySelector('.cbpet'); if (q) { var r = rel(ov, q); hearts(ov, r.x, r.y, 5); } }, 400); }); t += 900; }
    if (o.w) { at(t, function () { ov.classList.add('s-w'); say('⚔ ' + (window.RPFX ? RPFX.EL[W.e].nm : '') + ' 武器 覺醒！'); var wc = ov.querySelector('.cbw'); if (S && wc) { var r = rel(ov, wc); boom(S, { x: r.x, y: r.cy, e: W.e, c: C, tier: 3, big: .8 }); } }); t += 900; }
    var G = clamp(o.grade || 1, 1, 5), v = o.v != null ? o.v % FINN.length : Math.floor(Math.random() * FINN.length);
    at(t, function () { ov.classList.add('s-go', 'g' + G); say('💥 合體 必殺：' + FINN[v]); var hc = ov.querySelector('.cbh'), wc = ov.querySelector('.cbw');
      swing(hc, wc, C[1], 900);
      /* 上一版 的 必殺（原封不動）：2D 必殺 ＋ 命中 的 時候 立體 大爆炸（威力 5）＋ 核彈級 ＋ 整個 畫面 震動 */
      if (window.RPFX) { var tg = el('div', 'cbtg'); st.appendChild(tg);
        RPFX.attack(ov, { from: RPFX.pos(ov, wc || hc || st, .5, .4), to: RPFX.pos(ov, tg, .5, .5), w: o.wid, id: o.id, star: Math.max(3, o.star || W.s), crit: true, p: o.pid, pImg: o.p, pFrom: o.p ? RPFX.pos(ov, ov.querySelector('.cbpet')) : null, dmg: null, noNum: true, name: true,
          hook: function (x) { if (S) setTimeout(function () { var r = rel(ov, st); boom(S, { x: r.x, y: r.cy, e: x.e, c: C, tier: 5, crit: true, big: 1.4 + G * .1 }); nuke(S, { x: r.x, y: r.cy, e: x.e, c: C }); ov.classList.add('s-shk'); }, x.hit); } }); }
      /* 再 疊上去：武器 招牌、階級 特效、這一次 的 主題（合體 等級 愈高 疊 愈多） */
      if (S) { var r = rel(ov, st), hr = hc ? rel(ov, hc) : r, Sg = o.wid && window.RPFX && RPFX.wSig ? RPFX.wSig(o.wid) : { k: 8 };
        sigFx(S, Sg.k, { x: hr.x, y: hr.cy }, { x: r.x + r.w * .1, y: r.cy - r.h * .1 }, C, Math.max(G, K, 3), 1.3 + G * .1);
        if (K) setTimeout(function () { tierFx(S, K, r.x, r.cy, 1.2); }, 300);
        setTimeout(function () { finale(S, v, G, r.x, r.cy, C, r.h); }, 900);
        /* 第二十二次（疊 上去）：武器 3D 螺旋 環繞 戰神 ＋ 階級 ★★★ 以上 寵物 也 一起 繞（反方向）＋ 魔幻 大招 兩招（地位 愈高 愈強） */
        var P2 = Math.max(G, K, W.s || 1); if (o.w) orbit(ov, S, { x: hr.x, y: hr.cy }, o.w, Math.max(K, G - 1), C, { ms: 1100 + K * 160, to: { x: r.x, y: r.cy } });
        if (o.p && K >= 3) orbit(ov, S, { x: hr.x, y: hr.cy + 30 }, o.p, K - 2, EC('light'), { ms: 1300 + K * 120 });
        var u1 = ultPick(), u2 = ultPick(); setTimeout(function () { ult(S, u1, { x: hr.x, y: hr.cy }, { x: r.x, y: r.cy }, C, P2); say('💥 合體 必殺：' + FINN[v] + '　✦ ' + ULTN[u1]); }, 1300 + K * 160);
        if (P2 >= 3) setTimeout(function () { ult(S, u2, { x: hr.x, y: hr.cy }, { x: r.x, y: r.cy - r.h * .2 }, C, P2); }, 2000 + K * 160);
        if (K >= 5) setTimeout(function () { wings(S, r.x, r.cy - r.h * .1, TCOL[5], Math.min(S.w * .48, 460), 2400); nuke(S, { x: r.x, y: r.cy, c: TCOL[5] }); }, 2400); } });
    t += 2600 + (G >= 4 ? 600 : 0) + (G >= 5 ? 900 : 0); at(t, function () { var p = ov.querySelector('#cbpow'), n = +o.power || 0, k = 0, N = 24; ov.classList.add('s-end');
      p.innerHTML = '<span>⚔ 合體 威力</span><b id="cbn">0</b>' + (o.tier && window.RPFX ? RPFX.tb(o.tier, 1) : '') + '<span class="cbg">合體 等級 ' + new Array(G + 1).join('★') + '<small>' + FINN[v] + '</small></span>';
      var iv = setInterval(function () { k++; var b = ov.querySelector('#cbn'); if (b) b.textContent = Math.round(n * k / N).toLocaleString(); if (k >= N) clearInterval(iv); }, 45); T.push(iv); say(o.title || '🎆 你 收集 的 全部 力量！'); });
    at(t + 4000, function () { ov.classList.add('s-ok'); });
    return done; }

  /* ⏫ 升階 典禮（2026-10-21 第十八次 第 4-1(3) 點 B：升到 不一樣 的 階級，每一階 的 動畫 都 不一樣、愈高 愈 華麗）
     o ＝ {k: 新 的 階級, pct: 金幣 ＋N%, cap, done} ：遠遠 飛來 的 新 徽章 ➜ 這一階 專屬 的 3D 特效 ➜ 星星 一顆一顆 亮 ➜「升階！」 */
  function tierUp(o) { o = o || {}; var k = clamp(o.k || 1, 1, 5), C = TCOL[k], ov = el('div', 'lftu t' + k); ov.setAttribute('role', 'dialog');
    ov.innerHTML = '<div class="tubg" style="--c1:' + C[1] + ';--c2:' + C[2] + '"></div><div class="tuic">' + (window.RPFX ? RPFX.tb(k) : '') + '</div><div class="tutt"><small>⏫ 升階！</small><b>' + (window.RPFX ? RPFX.ts(k) + ' ' + RPFX.TN[k] : '') + '</b></div>' +
      '<div class="tusub">' + (o.pct ? '<span>🪙 練習 金幣 ＋' + o.pct + '%</span>' : '') + (o.cap ? '<span>一天 最多 ' + o.cap + '</span>' : '') + '<span>🛍 2 樣 專屬 寶物 解鎖</span></div><button class="cbok">👌 好</button>' +
      /* 第二十二次 第 3(7) 點：授予 這一階 的 專屬 裝備（★ 2 樣 ➜ ★★★★★ 8 樣：盔甲、武器、盾牌、披風、光環、光翼、皇冠、寶座），左右 兩邊 一樣一樣 飛來 */
      '<div class="tureg">' + REG[k].map(function (x, i) { var L = i % 2 === 0, row = Math.floor(i / 2), n2 = Math.ceil(REG[k].length / 2); return '<span class="' + (L ? 'l' : 'r') + '" style="--y:' + (20 + row * (n2 > 1 ? 46 / (n2 - 1) : 0)).toFixed(1) + '%">' + regSvg(x[0], C) + '<small>' + x[1] + '</small></span>'; }).join('') + '</div><div class="tusay"></div>' + tuMore(k, C);
    document.body.appendChild(ov); var S = RM ? null : Space(ov, { keep: 1 }), T = [];
    function at(ms, f) { T.push(setTimeout(f, RM ? Math.min(ms, 200) : ms)); }
    function done() { T.forEach(clearTimeout); ov.classList.add('out'); setTimeout(function () { if (S) S.kill(); if (ov.parentNode) ov.parentNode.removeChild(ov); if (o.done) o.done(); }, 380); }
    ov.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.cbok')) done(); });
    if (S) { S.tick = function (dt) { S.cam.ry += dt * .4; }; }
    at(80, function () { ov.classList.add('s1'); if (S) vortexIn(S, S.w / 2, S.h * .42, C, 900 + k * 120); });
    at(1100 + k * 120, function () { ov.classList.add('s2'); if (S) { tierFx(S, k, S.w / 2, S.h * .42, 1.2 + k * .08); boom(S, { x: S.w / 2, y: S.h * .42, c: C, tier: k, big: 1.2 }); } });
    /* 授予 裝備：一樣 一個 爆炸＋名字；愈 高階 愈多 樣、愈 華麗（★★★ 以上 加 合體 主題、★★★★ 天雷、★★★★★ 核彈＋黃金 光翼＋寶座 光柱） */
    var R0 = 2100 + k * 150, n = REG[k].length, sayE = ov.querySelector('.tusay');
    REG[k].forEach(function (x, i) { at(R0 + i * 480, function () { var sp = ov.querySelectorAll('.tureg span')[i]; if (!sp) return; sp.classList.add('on'); sayE.innerHTML = '<b>授予：' + x[1] + '</b>'; sayE.classList.remove('go'); void sayE.offsetWidth; sayE.classList.add('go');
      if (S) { var r = rel(ov, sp); boom(S, { x: r.x, y: r.cy, c: C, tier: Math.min(5, 1 + (k >> 1) + (i >> 2)), big: .45 + k * .06 }); if (x[0] === 'throne') S.add({ k: 'pl', ox: r.x, oy: r.cy, fx: 1, x: 0, y: 0, z: 0, l: 2, s: 60, c: C[1] }); } }); });
    var R1 = R0 + n * 480 + 200;
    if (S && k >= 3) at(R1 - 300, function () { finale(S, Math.floor(Math.random() * FINN.length), k, S.w / 2, S.h * .42, C, S.h * .5); });
    if (S && k >= 4) at(R1, function () { for (var b = 0; b < k * 3; b++) bolt(S, S.w / 2 + rnd(-S.w * .4, S.w * .4), S.h * .42, C[b % 3]); });
    if (S && k >= 5) at(R1 + 300, function () { nuke(S, { x: S.w / 2, y: S.h * .42, c: C }); wings(S, S.w / 2, S.h * .4, C, Math.min(S.w * .46, 480), 2600); });
    at(R1, function () { ov.classList.add('s3'); sayE.classList.remove('go'); });
    at(R1 + 1000 + k * 180, function () { ov.classList.add('s-ok'); });
    /* 第二十九次：最後 ＝ 正式 的「晉階 證書」慢慢 浮上來（愈 高階 邊框 愈 華麗） */
    at(R1 + 1700 + k * 220, function () { ov.classList.add('s-cert'); });
    return done; }
  /* 2026-10-26 第二十九次 第 9(a) 點（老師：最尊榮、最閃耀、最正式、最震撼；愈 高階 愈 隆重，但 柔和 不 刺眼）＝ 只 疊上去，原本 的 特效 一個 都 不動：
     ★ 紅地毯＋兩排 金色 燈 ｜ ★★ ＋ 兩邊 掛 旗幟、金色 紙花 慢慢 飄 ｜ ★★★ ＋ 徽章 後面 兩圈 光環 慢慢 轉 ｜ ★★★★ ＋ 三圈 光環、天上 柔和 光柱 ｜ ★★★★★ ＋ 星空 皇冠 星座、四圈 光環、金色 光雨
     最後 ＝ 晉階 證書（班級 號碼、新 的 稱號、日期；★ 越多 邊框 越 華麗）；動畫 用 opacity／transform，亮度 柔和（不 閃爍） */
  function tuMore(k, C) { var h = '<div class="tucar"><i></i></div>', i;
    if (k >= 2) { h += '<div class="tuban l"><span>' + (window.RPFX ? RPFX.tb(k) : '') + '</span></div><div class="tuban r"><span>' + (window.RPFX ? RPFX.tb(k) : '') + '</span></div><div class="tucf">'; for (i = 0; i < 10 + k * 8; i++) h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 4).toFixed(2) + 's;animation-duration:' + (4 + Math.random() * 3).toFixed(2) + 's;background:' + C[i % 3] + '"></i>'; h += '</div>'; }
    if (k >= 3) { h += '<div class="turing">'; for (i = 0; i < k - 1; i++) h += '<i style="--r:' + (1 + i * .32) + ';animation-duration:' + (14 + i * 6) + 's;border-color:' + C[i % 3] + '"></i>'; h += '</div>'; }
    if (k >= 4) h += '<div class="tupil"></div>';
    if (k >= 5) { h += '<div class="tusky">'; for (i = 0; i < 40; i++) h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 55).toFixed(1) + '%;animation-delay:' + (Math.random() * 3).toFixed(2) + 's"></i>'; h += '</div>'; }
    var id = window.SCID ? String(window.SCID) : '', who = id.length === 5 ? id.slice(0, 3) + ' 班 ' + (+id.slice(3)) + ' 號' : '', d = new Date();
    h += '<div class="tucert c' + k + '" style="--c1:' + C[0] + ';--c2:' + C[1] + '"><div class="tcin"><div class="tchd">⚔ 晉 階 證 書 ⚔</div>' + (who ? '<div class="tcwho">' + who + '</div>' : '') +
      '<div class="tcsub">恭喜 你 晉升 為</div><div class="tcname">' + (window.RPFX ? RPFX.ts(k) + ' ' + RPFX.TN[k] : '') + '</div><div class="tcdt">' + d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日</div>' +
      '<div class="tcft">' + ['', '認真 練習，踏出 第一步', '每天 練習，愈來愈 強', '堅持 練習，大家 的 榜樣', '努力 不懈，光榮 的 英雄', '最高 榮耀，全校 的 傳說'][k] + '</div></div></div>';
    return h; }
  function vortexIn(S, x, y, C, ms) { for (var i = 0; i < 160; i++) { var th = Math.random() * 6.283, r = rnd(200, Math.max(S.w, S.h) * .6); S.add({ k: 'd', ox: x, oy: y, fx: 1, x: Math.cos(th) * r, y: rnd(-200, 200), z: Math.sin(th) * r, home: 3.6, l: ms / 1000, s: rnd(2.5, 5), c: C[i % 3], fo: 0, fi: 1 }); } }
  /* 📖 秒懂 動畫 用（〔❓ 階級 愈高 特效 愈強〕）：在 host 裡面 一直 演 那一階 的 特效（每 2.8 秒 一次），host 不在 畫面 上 就 停 */
  function demo(host, k, o) { if (!host || RM) return null; o = o || {}; var S = Space(host, { keep: 1 }), run = true;
    function go() { if (!run || !host.isConnected) { S.kill(); return; } var r = host.getBoundingClientRect(); if (r.width && host.offsetParent !== null) {
        var X = S.w * (o.x || .5), Y = S.h * (o.y || .55); if (o.g) { finale(S, o.v || 0, o.g, X, Y, TCOL[Math.max(1, Math.min(5, o.g))], S.h * .5); boom(S, { x: X, y: Y, c: TCOL[Math.max(1, o.g)], tier: o.g, big: .8 }); }
        else { tierFx(S, k, X, Y, .55 + k * .05); boom(S, { x: X, y: Y, c: TCOL[k], tier: k, big: .6 }); } }
      setTimeout(go, o.g ? 3400 : 2800); }
    setTimeout(go, 250); return { stop: function () { run = false; } }; }


  /* ══════════ 2026-10-23 第二十二次 第 3(5)(6)(7) 點（老師：每一次 合體 完全 不一樣、但 一樣 核彈級；地位 愈高 愈 立體 愈 華麗；武器 繞著 戰神 3D 螺旋 ➜ 使出 專屬 招數；
     升階 典禮 愈 高階 愈 尊榮，授予 每一階 的 專屬 裝備）══════════
     ⚠ 第十八次 的 教訓：原本 的 特效 一個 都 不拿掉，下面 全部 是「疊 上去」 */
  var ULTN = ['劍雨天降', '螺旋龍捲', '星爆十字', '光刃風暴', '隕石墜落', '能量光炮', '次元裂縫', '萬劍歸宗'], ULTL = -1;
  function ultPick() { var k; do { k = Math.floor(Math.random() * ULTN.length); } while (k === ULTL && ULTN.length > 1); ULTL = k; return k; }
  /* 武器 魔幻 大招（8 種，每一次 隨機、跟 上一次 不一樣）：S 畫布、H 戰士、T 靶、C 顏色、P 威力 1～5 */
  function ult(S, k, H, T, C, P) { P = clamp(P || 1, 1, 5); var N = .6 + P * .4, i, X = T.x, Y = T.y, dx = T.x - H.x, dy = T.y - H.y;
    function at(ms, f) { setTimeout(f, ms); }
    if (k === 0) { for (i = 0; i < 30 * N; i++) (function (i) { at(i * 28, function () { var x0 = rnd(-220, 220), sp = rnd(900, 1300);
        S.add({ k: 'st', ox: X, oy: Y, fx: 1, x: x0, y: -Y - 60, z: rnd(-200, 200), vx: -x0 * .4, vy: sp, vz: 0, l: (Y + 60) / sp, s: 4 + P, c: C[i % 3], dr: 0 }); }); })(i);
      at(30 * N * 28, function () { boom(S, { x: X, y: Y, c: C, tier: P, big: .9 }); }); }
    else if (k === 1) { for (i = 0; i < 90 * N; i++) (function (i) { at(i * 9, function () { var u = i / (90 * N), ph = u * 26; S.add({ k: 'd', ox: X, oy: Y + 90, fx: 1, x: Math.cos(ph) * (30 + u * 140), y: -u * 360, z: Math.sin(ph) * (30 + u * 140), vx: 0, vy: -60, vz: 0, l: 1.1, s: 4 + P * .8, c: C[i % 3], fi: 1 }); }); })(i); }
    else if (k === 2) { for (var a = 0; a < 4 + (P >= 4 ? 4 : 0); a++) for (i = 0; i < 26; i++) { var an = a * Math.PI / (P >= 4 ? 4 : 2), v = 120 + i * 22 * N; S.add({ k: 'd', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, vx: Math.cos(an) * v, vy: Math.sin(an) * v, vz: 0, dr: 2.2, l: .9, s: 7 - i * .15 + P * .5, c: i % 4 ? C[1] : '#FFFFFF' }); }
      S.flash = Math.max(S.flash || 0, .25); S.fc = C[1]; }
    else if (k === 3) { for (i = 0; i < 60 * N; i++) S.add({ k: 'o', ox: X, oy: Y, fx: 1, ang: i / (60 * N) * 6.283, r: 60 + (i % 3) * 40, w: 6 + P, y: (i % 3 - 1) * 20, vy: 0, x: 0, z: 0, l: 1.3, s: 5 + P * .6, c: C[i % 3], tilt: .5 }); }
    else if (k === 4) { for (i = 0; i < 2 + Math.ceil(P / 2); i++) (function (i) { at(i * 260, function () { var x0 = rnd(-80, 80), sp = 1100;
        S.add({ k: 'st', ox: X, oy: Y, fx: 1, x: x0 - 300, y: -Y - 80, z: 0, vx: 300 * sp / (Y + 80), vy: sp, vz: 0, l: (Y + 80) / sp, s: 16 + P * 3, c: C[0], dr: 0 });
        at((Y + 80) / sp * 1000, function () { boom(S, { x: X + x0, y: Y, c: C, tier: P, big: .8 + P * .1 }); S.add({ k: 'rg', ox: X + x0, oy: Y + 30, fx: 1, x: 0, y: 0, z: 0, r0: 10, r1: 260, l: .8, s: 6, c: C[1], flat: 1 }); }); }); })(i); }
    else if (k === 5) { for (i = 0; i < 70 * N; i++) (function (i) { at(i * 6, function () { var u = Math.random(); S.add({ k: 'd', ox: H.x, oy: H.y, fx: 1, x: dx * u + rnd(-10, 10), y: dy * u + rnd(-10, 10), z: rnd(-20, 20), vx: dx * .2, vy: dy * .2, vz: 0, l: .5, s: 8 + P * 1.5, c: i % 3 ? C[1] : '#FFFFFF', fi: 1 }); }); })(i);
      at(420, function () { for (var r = 0; r < 2 + (P >> 1); r++) S.add({ k: 'rg', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, r0: 10, r1: 160 + r * 90, l: .7 + r * .15, s: 8, c: C[r % 3] }); boom(S, { x: X, y: Y, c: C, tier: P, big: 1 }); }); }
    else if (k === 6) { for (i = 0; i < 40; i++) S.add({ k: 'd', ox: X, oy: Y, fx: 1, x: rnd(-6, 6), y: (i / 39 - .5) * 420, z: 0, vx: 0, vy: 0, vz: 0, l: 1.2, s: 9 + P, c: i % 2 ? '#FFFFFF' : C[2], fi: 1 });
      at(300, function () { for (var r = 0; r < 3; r++) S.add({ k: 'rg', ox: X, oy: Y, fx: 1, x: 0, y: 0, z: 0, r0: 10, r1: 300 + r * 120, l: 1 + r * .2, s: 7, c: C[r] }); S.flash = .5; S.fc = C[2]; }); }
    else { for (i = 0; i < 24 + P * 6; i++) { var a2 = i / (24 + P * 6) * 6.283, r0 = 320; S.add({ k: 'st', ox: X, oy: Y, fx: 1, x: Math.cos(a2) * r0, y: Math.sin(a2) * r0 * .6, z: Math.sin(a2) * 120, vx: -Math.cos(a2) * r0 / .6, vy: -Math.sin(a2) * r0 * .6 / .6, vz: 0, l: .6, s: 5 + P, c: C[i % 3], dr: 0 }); }
      at(620, function () { boom(S, { x: X, y: Y, c: C, tier: P, crit: true, big: 1.1 }); if (P >= 4) nuke(S, { x: X, y: Y, c: C }); }); } }
  /* 武器 帥氣 3D 螺旋 環繞 戰神（真的 武器 圖，照 遠近 縮放、轉到 後面 變暗）：階級 k 0～5 ➜ 1～6 把、半徑、圈數、光點 拖尾 愈多；最後 一起 射向 靶 */
  function orbit(host, S, H, src, k, C, o) { if (!host || RM || !src) return 0; o = o || {}; k = clamp(k || 0, 0, 5); var n = 1 + k, R = 70 + k * 16, turns = 1.5 + k * .3, ms = o.ms || (1000 + k * 140), L = [], t0 = null, T = o.to;
    for (var i = 0; i < n; i++) { var im = el('img', 'lfob'); im.src = src; im.alt = ''; im.style.setProperty('--oc', C[1]); host.appendChild(im); L.push(im); }
    function f(now) { if (!t0) t0 = now; var u = Math.min(1, (now - t0) / ms), e = ease(u);
      L.forEach(function (im, i) { var ph = i / n * 6.283 + e * turns * 6.283, r = R * (1 - .25 * u), x = H.x + Math.cos(ph) * r * 1.35, z = Math.sin(ph) * r, y = H.y + 40 - e * 120 + Math.sin(ph * 2) * 10, sc = (1 + z / 420) * (.85 + k * .07);
        if (u >= 1 && T) { x = T.x; y = T.y; }
        im.style.transform = 'translate(' + (x - 28).toFixed(1) + 'px,' + (y - 28).toFixed(1) + 'px) scale(' + sc.toFixed(3) + ') rotate(' + (ph * 57.3 + 90).toFixed(0) + 'deg)'; im.style.zIndex = z > 0 ? 6 : 1; im.style.opacity = u >= 1 ? 0 : (.55 + .45 * (z + R) / (2 * R)).toFixed(2);
        if (S && Math.random() < .5 + k * .1) S.add({ k: 'd', ox: x, oy: y, fx: 1, x: 0, y: 0, z: z * .3, vx: 0, vy: -20, vz: 0, l: .45, s: 3 + k * .6, c: C[i % 3] }); });
      if (u < 1) requestAnimationFrame(f); else { if (T && S) for (var j = 0; j < n; j++) (function (j) { setTimeout(function () { var a = L[j], dx = T.x - H.x, dy = T.y - H.y; S.add({ k: 'st', ox: H.x, oy: H.y, fx: 1, x: 0, y: 0, z: 0, vx: dx * 3, vy: dy * 3, vz: 0, l: .33, s: 6 + k, c: C[j % 3], dr: 0 }); }, j * 50); })(j);
        setTimeout(function () { L.forEach(function (im) { if (im.parentNode) im.parentNode.removeChild(im); }); }, 120); } }
    requestAnimationFrame(f); return ms; }
  /* 每一階 的 專屬 裝備（升階 典禮 授予、秒懂 動畫 用）：愈 高階 愈多 樣 */
  var REGN = { armor: '盔甲', sword: '武器', shield: '盾牌', cape: '披風', halo: '光環', wing: '光翼', crown: '皇冠', throne: '寶座' };
  var REG = [null, [['armor', '鋼鐵 盔甲'], ['sword', '鋼鐵 長劍']], [['armor', '銀藍 盔甲'], ['sword', '雙子 銀劍'], ['shield', '蒼藍 盾牌']],
    [['armor', '烈焰 盔甲'], ['sword', '烈焰 巨劍'], ['shield', '火紋 盾牌'], ['cape', '烈焰 披風']],
    [['armor', '雷霆 戰甲'], ['sword', '雷霆 神劍'], ['shield', '雷紋 聖盾'], ['cape', '雷雲 披風'], ['halo', '雷霆 光環'], ['wing', '雷電 光翼']],
    [['armor', '黃金 神甲'], ['sword', '創世 神劍'], ['shield', '太陽 聖盾'], ['cape', '至尊 披風'], ['halo', '神聖 光環'], ['wing', '黃金 光翼'], ['crown', '傳說 皇冠'], ['throne', '黃金 寶座']]];
  var RGN = 0;
  function regSvg(t, C) { var a = C[0], b = C[1], c = C[2], u = t + (++RGN), g = '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="rg' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset=".55" stop-color="' + b + '"/><stop offset="1" stop-color="' + c + '"/></linearGradient></defs><g fill="url(#rg' + u + ')" stroke="#1A1206" stroke-width="2.5" stroke-linejoin="round">';
    var P = { armor: '<path d="M30 18l20 8 20-8 14 12-6 18-8-4v38H30V44l-8 4-6-18z"/><path d="M50 26v56" fill="none"/><path d="M38 52h24M38 64h24" fill="none"/>',
      sword: '<path d="M47 10h6l3 56h-12z"/><path d="M30 64h40v7H30z"/><path d="M46 71h8v16h-8z"/><circle cx="50" cy="91" r="5"/>',
      shield: '<path d="M50 10l34 12c0 34-12 56-34 68C28 78 16 56 16 22z"/><path d="M50 24v56M30 40h40" fill="none" stroke-width="4"/>',
      cape: '<path d="M30 14h40l6 10-4 66-12-10-10 12-10-12-12 10-4-66z"/><path d="M36 24h28" fill="none"/>',
      halo: '<ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke="url(#rg' + u + ')" stroke-width="9"/><ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke-width="1.5"/>',
      wing: '<path d="M48 70C30 66 10 48 6 18c12 10 22 12 30 12-4 6-2 10 4 12-6 4-4 10 2 12-4 6 0 12 6 16z"/><path d="M52 70c18-4 38-22 42-52-12 10-22 12-30 12 4 6 2 10-4 12 6 4 4 10-2 12 4 6 0 12-6 16z"/>',
      crown: '<path d="M14 72l-4-46 22 18 18-28 18 28 22-18-4 46z"/><path d="M14 72h72v12H14z"/><circle cx="50" cy="16" r="5"/><circle cx="10" cy="26" r="4"/><circle cx="90" cy="26" r="4"/>',
      throne: '<path d="M28 8h44v50H28z"/><path d="M20 50h60v14H20z"/><path d="M24 64h8v28h-8zM68 64h8v28h-8z"/><path d="M40 16l10-6 10 6v20H40z" fill="#FFFFFF" opacity=".5"/>' };
    return g + (P[t] || '') + '</g></svg>'; }
  function regHTML(k, cls) { k = clamp(k || 1, 1, 5); return '<div class="' + (cls || 'lfreg') + '">' + REG[k].map(function (x, i) { return '<span style="--i:' + i + '">' + regSvg(x[0], TCOL[k]) + '<small>' + x[1] + '</small></span>'; }).join('') + '</div>'; }
  RPLIFE = { wrap: wrap, mount: mount, stage: stage, strike: strike, burst: burst, vortex: vortex, charge: charge, hearts: hearts, nuzzle: nuzzle, swing: swing, mini: mini, combo: combo, Space: Space, sigFx: sigFx, FINN: FINN, cocoon: cocoon, tierFx: tierFx, tierUp: tierUp, demo: demo, TCOL: TCOL, d3: true, ult: ult, ULTN: ULTN, orbit: orbit, REG: REG, regHTML: regHTML };
})();
