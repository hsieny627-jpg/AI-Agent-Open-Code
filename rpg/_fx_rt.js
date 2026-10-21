/* rpg/_fx_rt.js — ⚔ 戰神之路 特效引擎（2026-10-20 第十四次；規格 rpg/CLAUDE.md 最上面「第十四次」）。只寫 ES5。
   老師：戰士登場要震撼；武器要有跟圖相關的特效、真的能打怪（愈強愈猛）；寵物長大進化要逼真、真的幫忙打怪；每一個人、每一次出招都不一樣；賺到金幣要有秒懂的動畫。
   score/_client.js 帶進每一頁（跟 _wear_rt.js 一樣），〔戰神之路〕、做完一次的最後一幕、⚡ 現場任務 都用這一份。
   RPFX.attack(容器, 選項)  出招：蓄力 ➜ 放招（照武器的「元素」和「招式」）➜ 命中（爆炸、震動、傷害數字）➜ 寵物跟著打；★5 ＝ 核彈級
   RPFX.summon(選項)        戰士／武器／寵物 登場（魔法陣、光柱、閃電、卡片轉出來、星星一顆一顆亮）
   RPFX.evolve(選項)        寵物 長大／進化（白色剪影一大一小閃，愈閃愈快 ➜ 白光 ➜ 變大、光芒）
   RPFX.chest(選項)         👑 冠軍寶箱 打開
   RPFX.coins(從, 到, 個數)  金幣飛進去、數字一個一個加
   RPFX.fight(容器, 選項)    做完練習打怪：答對幾題 ＝ 打幾下，怪物的血條一直掉，打倒 ＝ 淨化 */
var RPFX = (function () {
  var RM = false; try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
  /* ── 元素：c ＝ [核心, 光, 深色]；sh ＝ 碎片的形狀 ── */
  var EL = {
    fire: { nm: '烈焰', c: ['#FFF4B8', '#FF8A1A', '#FF2A00'], sh: 'flame', w: ['爆炎', '火龍', '流星火雨', '熔岩'] },
    ice: { nm: '冰霜', c: ['#FFFFFF', '#8FE6FF', '#2A6BFF'], sh: 'shard', w: ['冰晶', '絕對零度', '暴風雪', '冰龍'] },
    thunder: { nm: '雷霆', c: ['#FFFFFF', '#FFE34A', '#3FA9FF'], sh: 'bolt', w: ['萬雷', '雷神之怒', '閃電風暴', '天雷'] },
    plasma: { nm: '電漿', c: ['#FFFFFF', '#FF4FD8', '#3FF2FF'], sh: 'dot', w: ['霓虹', '電漿風暴', '光速', '量子'] },
    void: { nm: '虛空', c: ['#F3DBFF', '#B04BFF', '#3A0070'], sh: 'ring', w: ['黑洞', '暗影', '虛空裂縫', '深淵'] },
    time: { nm: '時空', c: ['#FFF7D6', '#FFC94A', '#B07800'], sh: 'gear', w: ['時間暫停', '時空迴旋', '齒輪風暴', '永恆'] },
    star: { nm: '星光', c: ['#FFFFFF', '#FFE680', '#B57BFF'], sh: 'star', w: ['流星雨', '星辰', '天狼', '北極星'] },
    cosmic: { nm: '銀河', c: ['#FFFFFF', '#A07BFF', '#FF5FD2'], sh: 'star', w: ['銀河', '星雲', '超新星', '宇宙'] },
    gravity: { nm: '重力', c: ['#EEDDFF', '#8A4BFF', '#1E0050'], sh: 'ring', w: ['重力崩壞', '引力漩渦', '萬有引力', '奇點'] },
    wind: { nm: '疾風', c: ['#F2FFF6', '#5CFFB0', '#14A070'], sh: 'leaf', w: ['颶風', '風刃', '龍捲', '疾風'] },
    toxic: { nm: '劇毒', c: ['#F6FFD6', '#A6FF3B', '#2E7A00'], sh: 'bubble', w: ['毒霧', '腐蝕', '劇毒爪', '酸雨'] },
    tech: { nm: '機甲', c: ['#FFFFFF', '#42F2FF', '#0A6CFF'], sh: 'hex', w: ['雷射', '飛彈齊射', '軌道砲', '機甲'] },
    shield: { nm: '守護', c: ['#FFFFFF', '#FFD54A', '#3FA9FF'], sh: 'hex', w: ['聖盾', '反擊', '壁壘', '守護'] },
    light: { nm: '聖光', c: ['#FFFFFF', '#FFF0A0', '#FFB52E'], sh: 'star', w: ['聖光', '天使', '審判', '黎明'] }
  };
  /* ── 武器 ➜ [元素, 招式, 星等]（照圖上的名字：例 Thunder Hammer ＝ 雷霆＋重擊；星等 ＝ score/_calc.js 的 RPR.w，商城 ＝ 第幾排 ＋1）── */
  var W = { w01: ['plasma', 'slash', 2], w02: ['fire', 'beam', 5], w03: ['star', 'arrow', 1], w04: ['thunder', 'smash', 4], w05: ['void', 'slash', 1], w06: ['time', 'slash', 3],
    w07: ['void', 'pierce', 2], w08: ['fire', 'slash', 4], w09: ['ice', 'pierce', 2], w10: ['shield', 'nova', 3], w11: ['gravity', 'smash', 3], w12: ['wind', 'arrow', 1],
    w13: ['light', 'orb', 1], w14: ['toxic', 'claw', 2], w15: ['cosmic', 'claw', 2], w16: ['tech', 'orb', 3], w17: ['cosmic', 'orb', 5], w18: ['time', 'nova', 4],
    w19: ['shield', 'nova', 3], w20: ['tech', 'smash', 2], w21: ['tech', 'orb', 1], w22: ['cosmic', 'orb', 3], w23: ['time', 'nova', 4], w24: ['shield', 'nova', 2],
    w25: ['thunder', 'smash', 3], w26: ['fire', 'slash', 2], w27: ['star', 'arrow', 1], w28: ['plasma', 'beam', 1], w29: ['cosmic', 'nova', 5], w30: ['gravity', 'orb', 1],
    s0701: ['cosmic', 'slash'], s0702: ['fire', 'beam'], s0703: ['time', 'orb'], s0704: ['star', 'arrow'], s0705: ['light', 'slash'], s0706: ['fire', 'pierce'], s0707: ['ice', 'nova'],
    s0708: ['thunder', 'smash'], s0709: ['fire', 'claw'], s0710: ['tech', 'beam'], s0711: ['cosmic', 'orb'], s0712: ['light', 'pierce'], s0713: ['void', 'slash'], s0714: ['shield', 'nova'],
    s0715: ['light', 'pierce'], s0716: ['cosmic', 'claw'], s0717: ['toxic', 'claw'], s0718: ['wind', 'arrow'], s0719: ['gravity', 'smash'], s0720: ['fire', 'arrow'] };
  /* 寵物 ➜ 元素（跟 📖 圖鑑的套裝一樣：火焰、星河、雷電、冰雪、夜、機械） */
  var PE = { p05: 'fire', p21: 'fire', p24: 'fire', p01: 'star', p18: 'cosmic', p03: 'thunder', p20: 'thunder', p13: 'ice', p26: 'ice', p29: 'ice', p08: 'void', p09: 'void', p22: 'void', p25: 'void',
    p16: 'tech', p19: 'tech', p30: 'tech', p17: 'fire', p23: 'gravity', p27: 'wind', p28: 'light', s0801: 'cosmic', s0802: 'ice', s0803: 'light', s0804: 'cosmic', s0805: 'light', s0806: 'fire', s0807: 'tech',
    s0808: 'light', s0809: 'wind', s0810: 'fire', s0811: 'tech', s0812: 'thunder', s0813: 'fire', s0814: 'cosmic', s0815: 'ice', s0816: 'tech', s0817: 'fire', s0818: 'void', s0819: 'thunder', s0820: 'time' };
  var FORM = { slash: '連斬', beam: '光砲', arrow: '箭雨', smash: '重擊', orb: '法球', nova: '爆發', claw: '利爪', pierce: '突刺' };
  /* 🗡 每一把 武器 自己的 招牌 3D 特效（2026-10-21 第十七次 老師第 10-(2) 點：每一種 武器 獨一無二）：12 種 招牌 ✕ 14 種 元素，
     照 招式 挑 最像 的 招牌（斬 ➜ 新月／十字／綻放；砲 ➜ 天柱／彗星／螺旋…），同一個 元素 不重複 ➜ 50 把 武器 的「元素＋招牌」兩兩 不一樣（rpg/_verify.js 量） */
  var SIGN = ['雙龍螺旋', '新月三連斬', '天降流星', '大地裂刺', '五星環繞', '十字審判', '星門', '連鎖雷', '天柱', '萬花綻放', '震地波', '彗星'];
  var SIGP = { slash: [1, 5, 9], beam: [8, 11, 0], arrow: [2, 11, 7], smash: [3, 10, 8], orb: [4, 6, 0], nova: [10, 9, 6], claw: [5, 1, 3], pierce: [11, 7, 0] }, WSIG = {};
  (function () { var used = {}; Object.keys(W).forEach(function (id) { var e = W[id][0], L = SIGP[W[id][1]].concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    for (var i = 0; i < L.length; i++) if (!used[e + L[i]]) { used[e + L[i]] = 1; WSIG[id] = L[i]; return; } WSIG[id] = L[0]; }); })();
  function wSig(id) { var k = WSIG[id] != null ? WSIG[id] : 8; return { k: k, nm: SIGN[k] }; }
  function wInfo(id) { var x = W[id], m = /^s07(\d\d)$/.exec(id || ''); return x ? { e: x[0], f: x[1], s: x[2] || (m ? Math.floor((+m[1] - 1) / 5) + 2 : 1) } : { e: 'light', f: 'slash', s: 1 }; }
  function pEl(id) { return PE[id] || ['star', 'wind', 'light', 'plasma', 'ice'][(parseInt(String(id).replace(/\D/g, ''), 10) || 0) % 5]; }
  /* 每一個人不一樣：5 碼 ➜ 固定的「招牌」；每一次不一樣：再加上次數 */
  function hash(s) { s = String(s || ''); var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul ? Math.imul(h, 16777619) : (h * 16777619) | 0; } return h >>> 0; }
  function rnd(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) | 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  if (!Math.imul) Math.imul = function (a, b) { return ((a & 0xffff) * b + ((((a >>> 16) * b) & 0xffff) << 16)) | 0; };
  var SIG = ['無雙', '王者', '破曉', '天命', '極光', '星辰', '霸王', '疾影', '神域', '聖焰', '蒼穹', '幻影'];
  var NCNT = 0; try { NCNT = +(sessionStorage.getItem('rpfx_n') || 0); } catch (e) { }
  function nextSeed(id) { NCNT++; try { sessionStorage.setItem('rpfx_n', String(NCNT)); } catch (e) { } return hash(id) ^ (NCNT * 2654435761) ^ (Date.now() & 0xffff); }

  /* ── 畫布：粒子、圓環、閃電、刀光、光束 ── */
  var SPR = {};
  function glow(col) { if (SPR[col]) return SPR[col]; var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, '#fff'); r.addColorStop(.22, col); r.addColorStop(.6, hexA(col, .35)); r.addColorStop(1, hexA(col, 0)); g.fillStyle = r; g.fillRect(0, 0, 64, 64); SPR[col] = c; return c; }
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function Stage(host, full) {
    var cv = document.createElement('canvas'); cv.className = 'fxcv' + (full ? ' full' : ''); cv.setAttribute('aria-hidden', 'true'); host.appendChild(cv);
    var R = host.getBoundingClientRect(), Wd = Math.max(10, full ? window.innerWidth : R.width), Ht = Math.max(10, full ? window.innerHeight : R.height), d = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(Wd * d); cv.height = Math.round(Ht * d); var g = cv.getContext('2d'); g.scale(d, d);
    var P = [], E = [], t0 = 0, last = 0, done = false, end = 0, S = { w: Wd, h: Ht, g: g, add: function (p) { if (P.length < 900) P.push(p); return p; }, at: function (ms, f) { E.push({ t: ms, f: f }); }, flash: 0, fc: '#fff',
      stop: function (ms) { end = ms; }, cv: cv };
    function step(now) { if (done) return; if (!t0) { t0 = now; last = now; } var t = now - t0, dt = Math.min(50, now - last) / 1000; last = now;
      E = E.filter(function (e) { if (t >= e.t) { try { e.f(t); } catch (x) { } return false; } return true; });
      g.setTransform(d, 0, 0, d, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, Wd, Ht);
      if (S.flash > 0) { g.fillStyle = hexA(S.fc, Math.min(1, S.flash)); g.fillRect(0, 0, Wd, Ht); S.flash -= dt * 2.4; }
      g.globalCompositeOperation = 'lighter';
      for (var i = P.length - 1; i >= 0; i--) { var p = P[i]; p.a += dt; if (p.a >= p.l) { P.splice(i, 1); continue; } draw(g, p, dt, S); }
      if ((end && t >= end && !P.length) || t > 12000) { done = true; if (cv.parentNode) cv.parentNode.removeChild(cv); return; }
      requestAnimationFrame(step); }
    requestAnimationFrame(step); return S;
  }
  function draw(g, p, dt, S) {
    var k = p.a / p.l, al = p.fo === 0 ? 1 : (1 - k);
    if (p.home) { var dx = p.home.x - p.x, dy = p.home.y - p.y, dd = Math.sqrt(dx * dx + dy * dy) || 1; p.vx += dx / dd * p.hs * dt; p.vy += dy / dd * p.hs * dt; if (dd < 18 && !p.hit) { p.hit = 1; p.a = p.l; if (p.onHit) p.onHit(); } }
    var ox = p.x, oy = p.y; p.vx *= (1 - (p.dr || 0) * dt); p.vy *= (1 - (p.dr || 0) * dt); p.vy += (p.gv || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.spin) p.rot = (p.rot || 0) + p.spin * dt;
    g.globalAlpha = Math.max(0, al);
    if (p.t === 'dot') { var s = p.s * (p.gr ? 1 + k * p.gr : 1); g.drawImage(glow(p.c), p.x - s, p.y - s, s * 2, s * 2); }
    else if (p.t === 'streak') { g.strokeStyle = p.c; g.lineWidth = p.s; g.lineCap = 'round'; g.beginPath(); g.moveTo(p.x - p.vx * (p.tl || .05), p.y - p.vy * (p.tl || .05)); g.lineTo(p.x, p.y); g.stroke();
      g.drawImage(glow(p.c), p.x - p.s * 3, p.y - p.s * 3, p.s * 6, p.s * 6); }
    else if (p.t === 'ring') { var r = p.r0 + (p.r1 - p.r0) * (1 - Math.pow(1 - k, 2)); g.strokeStyle = p.c; g.lineWidth = Math.max(.5, p.s * (1 - k)); g.beginPath(); g.arc(p.x, p.y, Math.max(0, r), 0, Math.PI * 2); g.stroke(); }
    else if (p.t === 'arc') { var sw = Math.min(1, k * 2.2); g.strokeStyle = p.c; g.lineCap = 'round'; for (var j = 0; j < 3; j++) { g.lineWidth = p.s * (1 - j * .35) * (1 - k * .6); g.globalAlpha = al * (j === 0 ? .55 : 1);
        g.strokeStyle = j === 2 ? '#fff' : p.c; g.beginPath(); g.arc(p.x, p.y, p.r, p.a0, p.a0 + (p.a1 - p.a0) * sw, p.a1 < p.a0); g.stroke(); } }
    else if (p.t === 'beam') { var w = p.s * (1 - k * .5) * (0.85 + Math.random() * .3); g.lineCap = 'round';
      [[w * 2.2, p.c2, .35], [w, p.c, 1], [w * .38, '#fff', 1]].forEach(function (L) { g.globalAlpha = al * L[2]; g.strokeStyle = L[1]; g.lineWidth = L[0]; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x2, p.y2); g.stroke(); }); }
    else if (p.t === 'bolt') { g.strokeStyle = p.c; g.lineWidth = p.s; g.lineJoin = 'round'; g.beginPath(); g.moveTo(p.x, p.y); var n = 9; for (var b = 1; b <= n; b++) { var q = b / n, jx = b < n ? (Math.random() - .5) * p.j : 0;
        g.lineTo(p.x + (p.x2 - p.x) * q + jx, p.y + (p.y2 - p.y) * q + (b < n ? (Math.random() - .5) * p.j * .4 : 0)); } g.stroke(); g.lineWidth = p.s * .35; g.strokeStyle = '#fff'; g.stroke(); }
    else { /* 形狀碎片 */ g.save(); g.translate(p.x, p.y); g.rotate(p.rot || 0); var z = p.s * (1 - k * .4); g.fillStyle = p.c; g.strokeStyle = p.c; g.lineWidth = 2; shape(g, p.t, z); g.restore();
      g.globalAlpha = al * .6; g.drawImage(glow(p.c), p.x - z * 1.6, p.y - z * 1.6, z * 3.2, z * 3.2); }
    g.globalAlpha = 1;
  }
  function shape(g, t, z) { var i;
    if (t === 'star') { g.beginPath(); for (i = 0; i < 10; i++) { var r = i % 2 ? z * .42 : z, a = i / 10 * Math.PI * 2 - Math.PI / 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); }
    else if (t === 'hex') { g.beginPath(); for (i = 0; i < 6; i++) { var b = i / 6 * Math.PI * 2; g.lineTo(Math.cos(b) * z, Math.sin(b) * z); } g.closePath(); g.stroke(); }
    else if (t === 'gear') { g.beginPath(); for (i = 0; i < 16; i++) { var c = i / 16 * Math.PI * 2, rr = i % 2 ? z * .72 : z; g.lineTo(Math.cos(c) * rr, Math.sin(c) * rr); } g.closePath(); g.stroke(); g.beginPath(); g.arc(0, 0, z * .3, 0, 7); g.stroke(); }
    else if (t === 'shard') { g.beginPath(); g.moveTo(0, -z); g.lineTo(z * .35, 0); g.lineTo(0, z * .6); g.lineTo(-z * .35, 0); g.closePath(); g.fill(); }
    else if (t === 'flame') { g.beginPath(); g.moveTo(0, -z); g.quadraticCurveTo(z * .7, -z * .1, 0, z * .7); g.quadraticCurveTo(-z * .7, -z * .1, 0, -z); g.fill(); }
    else if (t === 'leaf') { g.beginPath(); g.ellipse ? g.ellipse(0, 0, z, z * .32, 0, 0, Math.PI * 2) : g.arc(0, 0, z * .5, 0, 7); g.fill(); }
    else if (t === 'bubble' || t === 'ring2') { g.beginPath(); g.arc(0, 0, z * .7, 0, Math.PI * 2); g.stroke(); }
    else { g.beginPath(); g.arc(0, 0, z * .5, 0, Math.PI * 2); g.fill(); } }
  /* 碎片的形狀：元素 sh ➜ 畫布的 t */
  function sht(e) { var s = EL[e].sh; return s === 'dot' || s === 'bolt' || s === 'ring' ? 'dot' : s; }
  function burst(S, x, y, e, n, sp, big) { var C = EL[e].c, t = sht(e);
    for (var i = 0; i < n; i++) { var a = Math.random() * Math.PI * 2, v = sp * (.3 + Math.random()), sh = i % 3 === 0 && t !== 'dot';
      S.add({ t: sh ? t : 'dot', x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, dr: 2.2, gv: e === 'fire' ? -120 : (e === 'ice' || e === 'toxic' ? 160 : 40), l: .5 + Math.random() * .7 * (big || 1), a: 0,
        s: sh ? 6 + Math.random() * 7 : 5 + Math.random() * 9 * (big || 1), c: C[i % 3 === 0 ? 0 : (i % 3 === 1 ? 1 : 2)], rot: Math.random() * 6, spin: (Math.random() - .5) * 12 }); }
    S.add({ t: 'ring', x: x, y: y, r0: 6, r1: 60 + sp * .12 * (big || 1), s: 7, c: C[1], l: .55, a: 0 }); }
  function bolt(S, x, y, x2, y2, c, s, l) { S.add({ t: 'bolt', x: x, y: y, x2: x2, y2: y2, c: c, s: s || 4, j: 40, l: l || .22, a: 0 }); }
  /* 容器要震 */
  function shake(el, lv) { if (!el || RM) return; el.classList.remove('fxshk', 'fxshk2', 'fxshk3'); void el.offsetWidth; el.classList.add(lv >= 5 ? 'fxshk3' : lv >= 3 ? 'fxshk2' : 'fxshk');
    setTimeout(function () { el.classList.remove('fxshk', 'fxshk2', 'fxshk3'); }, 700); }
  function dom(host, cls, html, ms, css) { var o = document.createElement('div'); o.className = cls; o.setAttribute('aria-hidden', 'true'); if (css) o.setAttribute('style', css); o.innerHTML = html; host.appendChild(o);
    if (ms) setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, ms); return o; }
  function pos(host, el, fx, fy) { var a = host.getBoundingClientRect(), b = el.getBoundingClientRect(); return { x: b.left - a.left + b.width * (fx == null ? .5 : fx), y: b.top - a.top + b.height * (fy == null ? .5 : fy) }; }

  /* ════ ⚔ 出招 ════
     o ＝ {from:{x,y}, to:{x,y}, w:武器, star:武器星等(沒寫 ＝ 照表), id:5 碼, p:寵物, pFrom:{x,y}, pImg:寵物圖, dmg:一擊, pd:寵物, hero:英雄的元素 DOM, quick:快一點, name:要不要寫招式名字, noNum:不寫數字}
     回傳 {ms:總共幾毫秒, hit:命中的時間} */
  function attack(host, o) {
    o = o || {}; if (!host) return { ms: 0 }; if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var I = wInfo(o.w), e = I.e, f = I.f, tier = Math.max(1, Math.min(5, o.star || I.s)), C = EL[e].c, R = rnd(o.seed || nextSeed(o.id)), sig = rnd(hash(o.id || 'x'));
    var S = Stage(host), F = o.from || { x: S.w * .3, y: S.h * .55 }, T = o.to || { x: S.w * .78, y: S.h * .45 }, q = o.quick ? .6 : 1;
    if (RM) { burst(S, T.x, T.y, e, 18, 260, 1); S.stop(400); if (o.dmg != null && !o.noNum) num(host, T, o.dmg, false, 0); return { ms: 900, hit: 0 }; }
    /* 招式：武器本來的 ＋ 這一次隨機換（每一次不一樣）；個人招牌決定第二招 */
    var forms = ['slash', 'beam', 'arrow', 'smash', 'orb', 'nova', 'claw', 'pierce'], f2 = forms[Math.floor(sig() * forms.length)], use = R() < .62 ? f : (R() < .5 ? f2 : forms[Math.floor(R() * forms.length)]);
    var crit = o.crit != null ? o.crit : R() < .18 + tier * .03;
    var ch0 = Math.round(380 * q), hit0 = ch0 + Math.round(420 * q);
    /* 2026-10-20 第十五次：音效、戰士揮武器（rpg/_life_rt.js）跟著這一招的時間 */
    if (o.hook) try { o.hook({ e: e, f: use, tier: tier, crit: crit, ch: ch0, hit: hit0, q: q }); } catch (x) { }
    /* 蓄力 */
    var ch = Math.round(380 * q);
    for (var i = 0; i < 14 + tier * 6; i++) { (function (i) { var a = R() * Math.PI * 2, r = 70 + R() * 70; S.add({ t: 'dot', x: F.x + Math.cos(a) * r, y: F.y + Math.sin(a) * r, vx: 0, vy: 0, home: F, hs: 1400 + R() * 900, l: .6, a: 0, s: 4 + R() * 5, c: C[i % 3], dr: 3 }); })(i); }
    S.add({ t: 'ring', x: F.x, y: F.y, r0: 70, r1: 6, s: 4, c: C[1], l: ch / 1000, a: 0 });
    if (o.hero && !RM) { o.hero.classList.remove('fxlunge'); void o.hero.offsetWidth; o.hero.classList.add('fxlunge'); setTimeout(function () { o.hero.classList.remove('fxlunge'); }, 900); }
    if (o.name !== false) { var nm = SIG[Math.floor(sig() * SIG.length)] + '．' + EL[e].w[Math.floor(R() * EL[e].w.length)] + ' ' + FORM[use];
      dom(host, 'fxname t' + tier, '<b style="--c1:' + C[1] + ';--c2:' + C[2] + '">' + nm + '</b><small>' + EL[e].nm + '．' + ['', '★', '★★', '★★★', '★★★★', '★★★★★'][tier] + '</small>', 1700 * q); }
    var hitT = ch + Math.round(420 * q), n = 2 + tier;
    S.at(ch, function () {
      if (use === 'slash' || use === 'claw') { for (var k = 0; k < (use === 'claw' ? 3 : Math.min(6, n)); k++) (function (k) { S.at(ch + k * 80 * q, function () {
          var rot = use === 'claw' ? -.9 + k * .12 : (R() - .5) * 2.4, rr = 46 + R() * 50 + tier * 6;
          S.add({ t: 'arc', x: T.x + (use === 'claw' ? (k - 1) * 18 : (R() - .5) * 30), y: T.y + (R() - .5) * 20, r: rr, a0: rot - 1.1, a1: rot + 1.1, s: 10 + tier * 2, c: C[1], l: .42, a: 0 });
          for (var j = 0; j < 6; j++) S.add({ t: 'streak', x: T.x, y: T.y, vx: (R() - .5) * 900, vy: (R() - .5) * 900, dr: 4, l: .35, a: 0, s: 2.5, c: C[0], tl: .04 }); }); })(k); }
      else if (use === 'beam' || use === 'pierce') { var bw = use === 'beam' ? 10 + tier * 5 : 6 + tier * 2;
        S.add({ t: 'beam', x: F.x, y: F.y, x2: T.x, y2: T.y, s: bw, c: C[1], c2: C[2], l: use === 'beam' ? .55 * q + tier * .06 : .22, a: 0 });
        for (var b = 0; b < 10 + tier * 4; b++) { var u = R(); S.add({ t: 'dot', x: F.x + (T.x - F.x) * u, y: F.y + (T.y - F.y) * u, vx: (R() - .5) * 220, vy: (R() - .5) * 220, dr: 3, l: .5, a: 0, s: 4 + R() * 6, c: C[b % 3] }); } }
      else if (use === 'arrow' || use === 'orb') { var m = use === 'orb' ? 2 + tier : 3 + tier * 2;
        for (var a2 = 0; a2 < m; a2++) (function (a2) { S.at(ch + a2 * (use === 'orb' ? 70 : 35) * q, function () { var ang = Math.atan2(T.y - F.y, T.x - F.x) + (R() - .5) * 1.6, sp = 500 + R() * 300;
          S.add({ t: use === 'orb' ? 'dot' : 'streak', x: F.x, y: F.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - (use === 'arrow' ? 220 : 0), home: T, hs: 4200, dr: 1.2, l: 1.2, a: 0, fo: 0, s: use === 'orb' ? 9 + tier * 2 : 3.5, c: C[a2 % 2 ? 0 : 1], tl: .06,
            onHit: function () { burst(S, T.x + (R() - .5) * 20, T.y + (R() - .5) * 20, e, 4 + tier, 260, .6); } }); }); })(a2); }
      else if (use === 'smash') { S.at(ch + 160 * q, function () { bolt(S, T.x + (R() - .5) * 30, -10, T.x, T.y, C[1], 5 + tier, .3); if (e === 'thunder' || tier >= 3) bolt(S, T.x - 40, -10, T.x + 10, T.y, C[0], 3, .25);
          for (var r = 0; r < 1 + Math.ceil(tier / 2); r++) S.add({ t: 'ring', x: T.x, y: T.y + 20, r0: 10, r1: 90 + r * 50 + tier * 10, s: 8, c: C[r % 2 ? 2 : 1], l: .6 + r * .12, a: 0 }); }); }
      else { /* nova */ for (var r2 = 0; r2 < 2 + Math.floor(tier / 2); r2++) S.add({ t: 'ring', x: F.x, y: F.y, r0: 20, r1: Math.hypot ? Math.hypot(T.x - F.x, T.y - F.y) + 40 + r2 * 40 : 300, s: 9, c: C[r2 % 2 ? 2 : 1], l: .55 + r2 * .1, a: 0 });
        for (var hx = 0; hx < 8 + tier * 2; hx++) { var aa = hx / (8 + tier * 2) * Math.PI * 2; S.add({ t: sht(e) === 'dot' ? 'hex' : sht(e), x: F.x, y: F.y, vx: Math.cos(aa) * 520, vy: Math.sin(aa) * 520, dr: 1.5, l: .7, a: 0, s: 10, c: C[1], spin: 4 }); } }
    });
    /* 命中 */
    S.at(hitT, function () { burst(S, T.x, T.y, e, 16 + tier * 8, 300 + tier * 60, 1 + tier * .15); S.flash = .08 + tier * .05; S.fc = C[1]; shake(o.shk || host, tier);
      if (e === 'thunder' || e === 'plasma') for (var z = 0; z < tier; z++) bolt(S, T.x, T.y, T.x + (R() - .5) * 240, T.y + (R() - .5) * 200, C[z % 2], 3, .3);
      if (o.dmg != null && !o.noNum) num(host, T, o.dmg, crit, tier);
      if (o.onHit) try { o.onHit(); } catch (x) { } });
    /* ★5 核彈級：白光 ➜ 三圈衝擊波 ➜ 光柱往上衝 */
    if (tier >= 5) S.at(hitT + 160, function () { S.flash = .85; S.fc = '#FFFFFF'; shake(o.shk || host, 5);
      for (var r3 = 0; r3 < 3; r3++) S.add({ t: 'ring', x: T.x, y: T.y, r0: 10, r1: Math.max(S.w, S.h) * (.5 + r3 * .25), s: 14 - r3 * 3, c: C[r3], l: .8 + r3 * .2, a: 0 });
      for (var u2 = 0; u2 < 70; u2++) S.add({ t: 'dot', x: T.x + (R() - .5) * 60, y: T.y, vx: (R() - .5) * 160, vy: -200 - R() * 520, dr: 1.4, gv: 60, l: 1 + R() * .8, a: 0, s: 8 + R() * 12, c: C[u2 % 3] });
      dom(host, 'fxnuke', '<b>★★★★★ 神話 爆發</b>', 1400); });
    /* 🐾 寵物 跟著 打 */
    var pT = hitT + 260;
    if (o.p) S.at(pT, function () { var pe = pEl(o.p), PF = o.pFrom || { x: F.x - 40, y: F.y + 40 };
      if (o.pImg) { var pi = dom(host, 'fxpet', '<img src="' + o.pImg + '" alt="">', 900 * q, 'left:' + PF.x + 'px;top:' + PF.y + 'px;--dx:' + (T.x - PF.x) + 'px;--dy:' + (T.y - PF.y) + 'px'); }
      S.at(pT + 300 * q, function () { burst(S, T.x + 16, T.y + 10, pe, 14, 260, .8); if (o.pd && !o.noNum) num(host, { x: T.x + 40, y: T.y + 30 }, o.pd, false, 1, '🐾 ＋'); }); });
    var ms = (o.p ? pT + 700 : hitT + 700) + (tier >= 5 ? 900 : 0); S.stop(ms); return { ms: ms, hit: hitT, crit: crit };
  }
  function num(host, T, v, crit, tier, pre) { var o = dom(host, 'fxnum' + (crit ? ' crit' : '') + (pre ? ' pet' : ''), (crit ? '<small>暴擊！</small>' : '') + (pre || '💥 ') + v, 1500, 'left:' + T.x + 'px;top:' + T.y + 'px;font-size:' + (40 + (tier || 1) * 6) + 'px'); return o; }

  /* ════ 登場（戰士、武器、寵物）════ o ＝ {img, star, kind:'h'|'w'|'p', title, sub, w:武器編號} */
  function overlay(cls) { var o = document.createElement('div'); o.className = 'fxov ' + (cls || ''); o.setAttribute('role', 'dialog'); document.body.appendChild(o); return o; }
  function close(o, ms, cb) { var tm = setTimeout(go, ms); function go() { clearTimeout(tm); if (!o.parentNode) return; o.classList.add('out'); setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); if (cb) cb(); }, 380); }
    o.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.fxok')) go(); }); return go; }
  function stars(n) { var s = ''; for (var i = 0; i < n; i++) s += '<i style="--i:' + i + '">★</i>'; return s; }
  function summon(o) {
    o = o || {}; var tier = Math.max(1, Math.min(5, o.star || 1)), e = o.kind === 'w' ? wInfo(o.w).e : o.kind === 'p' ? pEl(o.w) : ['light', 'tech', 'thunder', 'cosmic', 'fire', 'light'][tier], C = EL[e].c;
    var ov = overlay('sum t' + tier);
    ov.innerHTML = '<div class="fxsc"><div class="fxcard ' + (o.kind || 'h') + '" style="--c1:' + C[1] + ';--c2:' + C[2] + '"><img src="' + o.img + '" alt=""><div class="fxrays"></div></div>' +
      '<div class="fxst">' + stars(tier) + '</div><div class="fxtt">' + (o.title || '') + '</div><div class="fxsub">' + (o.sub || '') + '</div><button class="fxok">👌 好</button></div>';
    var S = Stage(ov, true), cx = S.w / 2, cy = S.h * .5, rad = Math.min(S.w, S.h) * .32;
    if (RM) { S.stop(100); close(ov, 3200, o.done); return; }
    /* 魔法陣：另外一張畫布，三圈一直轉（中間一圈有七芒星） */
    var mc = document.createElement('canvas'), dp = Math.min(2, window.devicePixelRatio || 1); mc.className = 'fxcv full'; mc.setAttribute('aria-hidden', 'true'); mc.width = Math.round(S.w * dp); mc.height = Math.round(S.h * dp); ov.insertBefore(mc, ov.firstChild);
    var mg = mc.getContext('2d'), rot = 0;
    (function loop() { if (!ov.parentNode) return; mg.setTransform(dp, 0, 0, dp, 0, 0); mg.clearRect(0, 0, S.w, S.h); mg.globalCompositeOperation = 'lighter'; mg.save(); mg.translate(cx, cy + rad * .55); mg.scale(1, .36); rot += .02;
      [[rad, 3, 1], [rad * .78, 2, -1.6], [rad * .55, 2, 2.4]].forEach(function (r, i) { mg.save(); mg.rotate(rot * r[2]); mg.strokeStyle = hexA(C[1], .25); mg.lineWidth = r[1] * 4; mg.beginPath(); mg.arc(0, 0, r[0], 0, Math.PI * 2); mg.stroke();   /* 外面 一圈 淡的 ＝ 發光（不用 shadowBlur：很耗電、iPad 會卡） */
        mg.strokeStyle = hexA(C[i === 0 ? 1 : 0], .85); mg.lineWidth = r[1];
        mg.beginPath(); mg.arc(0, 0, r[0], 0, Math.PI * 2); mg.stroke();
        for (var k = 0; k < 24; k++) { var a = k / 24 * Math.PI * 2; mg.beginPath(); mg.moveTo(Math.cos(a) * r[0], Math.sin(a) * r[0]); mg.lineTo(Math.cos(a) * (r[0] - 12), Math.sin(a) * (r[0] - 12)); mg.stroke(); }
        if (i === 1) { mg.beginPath(); for (var h = 0; h <= 7; h++) { var b = h * 3 / 7 * Math.PI * 2; mg.lineTo(Math.cos(b) * r[0], Math.sin(b) * r[0]); } mg.stroke(); } mg.restore(); });
      mg.restore(); requestAnimationFrame(loop); })();
    for (var i = 0; i < 40 + tier * 20; i++) (function (i) { S.at(i * 22, function () { var a = Math.random() * Math.PI * 2, r = Math.random() * rad; S.add({ t: 'dot', x: cx + Math.cos(a) * r, y: cy + rad * .55 + Math.sin(a) * r * .36, vx: 0, vy: -180 - Math.random() * 380, dr: .4, l: 1.4, a: 0, s: 3 + Math.random() * 6, c: C[i % 3] }); }); })(i);
    if (tier >= 3) for (var b = 0; b < tier * 2; b++) (function (b) { S.at(500 + b * 140, function () { var x = cx + (Math.random() - .5) * rad * 1.6; bolt(S, x, 0, cx + (Math.random() - .5) * 40, cy + rad * .5, C[b % 2], 4, .25); }); })(b);
    S.at(1150, function () { S.add({ t: 'beam', x: cx, y: -20, x2: cx, y2: cy + rad * .6, s: 60 + tier * 16, c: C[1], c2: C[2], l: .9, a: 0 }); S.flash = .5 + tier * .08; S.fc = '#FFFFFF'; });
    S.at(1350, function () { burst(S, cx, cy, e, 50 + tier * 14, 520 + tier * 60, 1.6); for (var r = 0; r < 3; r++) S.add({ t: 'ring', x: cx, y: cy, r0: 20, r1: Math.max(S.w, S.h) * (.45 + r * .2), s: 10, c: C[r], l: .9 + r * .15, a: 0 }); shake(ov.querySelector('.fxsc'), tier); });
    /* 2026-10-20 第十六次 老師第 3 點：立體 光點 漩渦 從 四面八方 收進 卡片 ➜ 卡片 出來 的 那一下 立體 爆開（rpg/life.js 有 載入 才 有） */
    if (window.RPLIFE && RPLIFE.vortex) RPLIFE.vortex(ov, { x: cx, y: cy, c: C, e: e, tier: tier, ms: 1250 });
    S.stop(4200); return close(ov, tier >= 5 ? 6500 : 5400, o.done);
  }
  /* ════ 🐾 長大／進化 ════ o ＝ {img, to:1|2, name} */
  function evolve(o) { o = o || {}; var e = pEl(o.w), C = EL[e].c, ov = overlay('evo s' + (o.to || 1));
    ov.innerHTML = '<div class="fxsc"><div class="fxevo" style="--c1:' + C[1] + ';--c2:' + C[2] + '"><img src="' + o.img + '" alt=""><div class="fxrays"></div></div><div class="fxtt">' + (o.to >= 2 ? pg(2) + ' 進化了！' : pg(1) + ' 長大了！') + '</div>' +
      '<div class="fxsub">' + (o.sub || (o.to >= 2 ? '陪你 練了 7 天 ➜ 變得 更強' : '陪你 練了 3 天 ➜ 長大 了')) + '</div><button class="fxok">👌 好</button></div>';
    var S = Stage(ov, true), cx = S.w / 2, cy = S.h * .44; if (RM) { S.stop(100); return close(ov, 3200, o.done); }
    for (var i = 0; i < 90; i++) (function (i) { S.at(i * 26, function () { var a = Math.random() * Math.PI * 2, r = 160 + Math.random() * 160; S.add({ t: 'dot', x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, vx: -Math.sin(a) * 260, vy: Math.cos(a) * 260, home: { x: cx, y: cy }, hs: 900, dr: 1, l: 1.3, a: 0, s: 4 + Math.random() * 5, c: C[i % 3] }); }); })(i);
    S.at(2500, function () { S.flash = 1; S.fc = '#FFFFFF'; burst(S, cx, cy, e, 80, 640, 1.8); for (var r = 0; r < 3; r++) S.add({ t: 'ring', x: cx, y: cy, r0: 20, r1: 500 + r * 160, s: 10, c: C[r], l: 1 + r * .2, a: 0 }); });
    /* 2026-10-21 第十七次 老師第 12 點：3D 光繭 包住 ➜ 破開 ➜ 長大 ＝ 腳下 藍色 光環、進化 ＝ 金色 光環＋一對 光翼（不再 只是 一張 貼紙 變大） */
    if (window.RPLIFE && RPLIFE.cocoon) RPLIFE.cocoon(ov, { x: cx, y: cy, c: C, e: e, ms: 2450, r: Math.min(S.w, S.h) * .26 });
    else if (window.RPLIFE && RPLIFE.vortex) RPLIFE.vortex(ov, { x: cx, y: cy, c: C, e: e, tier: o.to >= 2 ? 5 : 3, ms: 2450 });
    S.at(2500, function () { ov.classList.add('evd'); });
    S.stop(4200); return close(ov, 6400, o.done); }
  /* ════ 👑 冠軍寶箱 ════ o ＝ {html:打開以後看到的, done} */
  function chest(o) { o = o || {}; var ov = overlay('chs');
    ov.innerHTML = '<div class="fxsc"><div class="fxchest"><i class="lid"></i><i class="box"></i><i class="lock"></i></div><div class="fxprize">' + (o.html || '') + '</div><div class="fxtt">👑 冠軍 寶箱</div><button class="fxok">👌 好</button></div>';
    var S = Stage(ov, true), cx = S.w / 2, cy = S.h * .5; if (RM) { ov.classList.add('open'); S.stop(100); return close(ov, 4000, o.done); }
    S.at(1500, function () { ov.classList.add('open'); S.flash = .7; S.fc = '#FFF2B0'; burst(S, cx, cy, 'light', 90, 600, 1.8); burst(S, cx, cy, 'time', 30, 400, 1.2); });
    for (var i = 0; i < 26; i++) (function (i) { S.at(1600 + i * 60, function () { S.add({ t: 'star', x: cx + (Math.random() - .5) * 200, y: cy, vx: (Math.random() - .5) * 300, vy: -300 - Math.random() * 300, gv: 380, l: 1.6, a: 0, s: 8 + Math.random() * 8, c: ['#FFE680', '#FFFFFF', '#FFB52E'][i % 3], spin: 6 }); }); })(i);
    S.stop(4000); return close(ov, 7000, o.done); }
  /* ════ 🪙 金幣 飛進去 ════ from、to ＝ 元素；n ＝ 拿到幾個；tick(加到幾) */
  function coins(from, to, n, tick, total0) { if (!from || !to || !(n > 0)) return; var k = Math.min(14, Math.max(3, Math.ceil(n / 3))), a = from.getBoundingClientRect(), b = to.getBoundingClientRect(), got = 0, base = total0 || 0;
    var lay = document.createElement('div'); lay.className = 'fxcoins'; lay.setAttribute('aria-hidden', 'true'); document.body.appendChild(lay);
    for (var i = 0; i < k; i++) (function (i) { var c = document.createElement('i'); c.className = 'cnI fxc'; lay.appendChild(c);
      var x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, ang = Math.random() * Math.PI * 2, r = 50 + Math.random() * 70, x1 = x0 + Math.cos(ang) * r, y1 = y0 + Math.sin(ang) * r - 40, x2 = b.left + b.width / 2, y2 = b.top + b.height / 2;
      c.style.left = x0 + 'px'; c.style.top = y0 + 'px';
      var done = function () { if (c.parentNode) c.parentNode.removeChild(c); got++; var v = Math.round(base + n * got / k); if (tick) tick(v); to.classList.remove('fxpop'); void to.offsetWidth; to.classList.add('fxpop'); if (got === k && lay.parentNode) lay.parentNode.removeChild(lay); };
      if (RM || !c.animate) { setTimeout(done, 200 + i * 40); return; }
      var an = c.animate([{ transform: 'translate(-50%,-50%) scale(.3) rotateY(0)', opacity: 0 }, { transform: 'translate(calc(-50% + ' + (x1 - x0) + 'px),calc(-50% + ' + (y1 - y0) + 'px)) scale(1.3) rotateY(360deg)', opacity: 1, offset: .35 },
        { transform: 'translate(calc(-50% + ' + (x2 - x0) + 'px),calc(-50% + ' + (y2 - y0) + 'px)) scale(.7) rotateY(900deg)', opacity: 1 }], { duration: 1000 + i * 45, delay: i * 70, easing: 'cubic-bezier(.5,0,.6,1)', fill: 'forwards' });
      an.onfinish = done; })(i); }
  /* ════ 👾 做完練習打怪 ════
     box ＝ 容器（裡面有 .fxh 英雄、.fxp 寵物、會放怪物）；F ＝ 伺服器算好的 {hits, d, pd, from:{i,m,hp,max}, to:{…}, kill:[…]}；o ＝ {base:網址開頭, w, p, id, done} */
  function monImg(base, m) { return base + 'rpg/pets/' + m + '.jpg'; }
  function fight(box, F, o) {
    o = o || {}; if (!box || !F) return; var base = o.base || '../', hero = box.querySelector('.fxh'), pet = box.querySelector('.fxp');
    var mon = dom(box, 'fxmon', '<div class="fxmi"><img src="' + monImg(base, F.from.m) + '" alt="怪物"></div><div class="fxhp"><i></i><span></span></div><div class="fxmn"></div>', 0);
    var img = mon.querySelector('img'), bar = mon.querySelector('.fxhp i'), lab = mon.querySelector('.fxhp span'), mn = mon.querySelector('.fxmn');
    var per = F.d + F.pd, vis = Math.min(F.hits, RM ? 1 : 6), KL = (F.kill || []).slice(), ML = ['p16', 'p22', 'p23', 'p24', 'p25', 'p27', 'p30', 'p17', 'p19', 'p20', 'p29', 'p28', 'p18', 'p21', 'p26'];
    var mx = function (i) { return 80 + 40 * i; }, cur = { i: F.from.i, hp: F.from.hp };
    /* 跟伺服器（score/_calc.js rpFight）一樣的算法，一下一下演出來 */
    var plan = [], st = { i: cur.i, hp: cur.hp }, kl = KL.length;
    for (var k = 0; k < vis; k++) { var dmg = (Math.round(F.hits * (k + 1) / vis) - Math.round(F.hits * k / vis)) * per, ev = { dmg: dmg, kills: [] };
      while (dmg > 0) { var need = mx(st.i) - st.hp; if (dmg >= need && kl > 0) { dmg -= need; ev.kills.push(ML[st.i % 15]); st.i++; st.hp = 0; kl--; } else { st.hp = Math.min(mx(st.i) - 1, st.hp + dmg); dmg = 0; } }
      ev.end = { i: st.i, hp: st.hp }; plan.push(ev); }
    if (F.to) plan[plan.length - 1].end = { i: F.to.i, hp: F.to.hp };
    function show(c) { var m = mx(c.i), r = Math.max(0, (m - c.hp) / m); bar.style.width = (r * 100).toFixed(1) + '%'; lab.textContent = '❤ ' + (m - c.hp) + ' ／ ' + m; mn.textContent = '👾 第 ' + (c.i + 1) + ' 隻　暗黑神獸'; img.src = monImg(base, ML[c.i % 15]); }
    show(cur);
    function strike(k) {
      if (k >= plan.length) { if (o.done) setTimeout(o.done, 400); return; }
      var ev = plan[k], a = attack(box, { from: pos(box, hero || box, .5, .45), to: pos(box, mon.querySelector('.fxmi'), .5, .5), w: o.w, id: o.id, p: k % 2 === 0 ? o.p : null, pImg: pet ? pet.getAttribute('src') : '', pFrom: pet ? pos(box, pet) : null,
        dmg: ev.dmg, quick: true, name: k === 0, hero: hero, shk: box, hook: o.hook,
        onHit: function () { mon.classList.remove('hit'); void mon.offsetWidth; mon.classList.add('hit');
          if (ev.kills.length) { var m = mx(cur.i); bar.style.width = '0%'; lab.textContent = '❤ 0 ／ ' + m; kill(ev.kills[ev.kills.length - 1], ev.end); } else { cur = ev.end; show(cur); } } });
      setTimeout(function () { strike(k + 1); }, Math.max(900, a.ms - 200) + (ev.kills.length ? 900 : 0));
    }
    function kill(m0, end) { if (o.onKill) try { o.onKill(); } catch (x) { } mon.classList.add('ko'); var S = Stage(box), c = pos(box, mon); burst(S, c.x, c.y, 'light', 60, 520, 1.6); S.stop(1600);
      dom(box, 'fxpure', '<img src="' + monImg(base, m0) + '" alt=""><b>✨ 打倒了！<br>淨化 ➜ 收進 👾 怪物圖鑑</b>', 2600);
      setTimeout(function () { cur = end; mon.classList.remove('ko'); show(cur); }, 1300); }
    setTimeout(function () { strike(0); }, 500);
  }
  /* 小特效（戰神之路 舞台上 戰士 和 寵物 的 互動）：spark ＝ 一團光點、beam ＝ 一道光 */
  function spark(host, x, y, e, n) { if (!host || RM) return; var S = Stage(host); burst(S, x, y, e || 'light', n || 18, 220, .7); S.stop(300); }
  function beam(host, a, b, e) { if (!host || RM) return; var S = Stage(host), C = EL[e || 'light'].c; S.add({ t: 'beam', x: a.x, y: a.y, x2: b.x, y2: b.y, s: 7, c: C[1], c2: C[2], l: .5, a: 0 });
    S.at(250, function () { burst(S, b.x, b.y, e || 'light', 14, 200, .6); }); S.stop(600); }
  /* ⚔ 戰力階級 徽章（2026-10-20 第十五次 老師 C17 第 5 題 B）：自己畫的盾牌（不用 🥇🥈🥉：排行榜第 1、2、3 名已經用了，會搞混）
     2026-10-21 第十六次 第 5 點 改名：1 ★ 見習戰士（鋼）2 ★★ 精英戰士（藍）3 ★★★ 烈焰戰將（火）4 ★★★★ 雷霆戰神（雷）5 ★★★★★ 傳說戰神（金＋皇冠）；tb(階, 'big') ＝ 大的、有星星＋名字 */
  var TN = ['', '見習戰士', '精英戰士', '烈焰戰將', '雷霆戰神', '傳說戰神'], TC = ['', ['#FFFFFF', '#B8C4D4', '#5A6678'], ['#E8FFFF', '#5AB8FF', '#1A4AB0'], ['#FFE08A', '#FF6A1A', '#8A1A00'], ['#F0E8FF', '#8A6BFF', '#2A0A8A'], ['#FFF3B0', '#FFC21A', '#8A5A00']];
  function ts(n) { return new Array(Math.max(0, Math.min(5, +n || 0)) + 1).join('★'); }
  function tb(n, big) { n = Math.max(0, Math.min(5, +n || 0)); if (!n) return ''; var c = TC[n], id = 'tbg' + n;
    var svg = '<svg viewBox="0 0 40 46" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".5" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient></defs>' +
      '<path d="M20 2L37 8V22Q37 36 20 44Q3 36 3 22V8Z" fill="url(#' + id + ')" stroke="' + c[2] + '" stroke-width="2.4"/><path d="M20 7L32 11.5V22Q32 32 20 38.5Q8 32 8 22V11.5Z" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.4"/>' +
      (n >= 5 ? '<path d="M11 13l4 4 5-7 5 7 4-4-2 10H13z" fill="#FFE07A" stroke="#6A3A00" stroke-width="1"/>' : '') +
      '<path d="M20 ' + (n >= 5 ? 24 : 14) + 'l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill="#fff" fill-opacity=".92"/>' + (n >= 4 ? '<circle cx="20" cy="' + (n >= 5 ? 31 : 21) + '" r="2" fill="' + c[1] + '"/>' : '') + '</svg>';
    return '<span class="tbI t' + n + (big ? ' big' : '') + '" role="img" aria-label="' + ts(n) + ' ' + TN[n] + '">' + svg + (big ? '<b><i class="tbS">' + ts(n) + '</i>' + TN[n] + '</b>' : '') + '</span>'; }
  /* 🐾 寵物 長大／進化 徽章（2026-10-21 第十七次 老師第 11 點：🐥 🐲 太幼稚 ➜ 選擇題「光環徽章」）：0 寶寶 ＝ 一圈 灰色 虛線；1 長大 ＝ 一圈 藍色 光環；2 進化 ＝ 兩圈 金色 光環＋光翼 */
  function pg(n) { n = Math.max(0, Math.min(2, +n || 0)); var id = 'pgg' + n, c = [['#C8D0DA', '#6A7686'], ['#E8FBFF', '#4FC3FF'], ['#FFF6C8', '#FFC21A']][n];
    var svg = '<svg viewBox="0 0 56 36" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + c[1] + '"/><stop offset=".5" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs>' +
      (n >= 2 ? '<path d="M18 20Q6 6 1 12Q5 16 3 21Q9 19 10 25Q14 21 18 23Z" fill="url(#' + id + ')" opacity=".9"/><path d="M38 20Q50 6 55 12Q51 16 53 21Q47 19 46 25Q42 21 38 23Z" fill="url(#' + id + ')" opacity=".9"/>' : '') +
      '<ellipse cx="28" cy="' + (n >= 2 ? 24 : 18) + '" rx="' + (n >= 2 ? 15 : 17) + '" ry="5.5" fill="none" stroke="url(#' + id + ')" stroke-width="' + (n ? 3.2 : 2) + '"' + (n ? '' : ' stroke-dasharray="3 3"') + '/>' +
      (n >= 2 ? '<ellipse cx="28" cy="12" rx="11" ry="4" fill="none" stroke="url(#' + id + ')" stroke-width="2.6"/>' : '') +
      (n ? '<path d="M28 ' + (n >= 2 ? 13 : 9) + 'l1.6 3.6 3.6.4-2.7 2.5.8 3.7-3.3-1.9-3.3 1.9.8-3.7-2.7-2.5 3.6-.4z" fill="#fff"/>' : '<circle cx="28" cy="18" r="3" fill="' + c[1] + '"/>') + '</svg>';
    return '<span class="pgI p' + n + '" role="img" aria-label="' + ['寶寶', '長大', '進化'][n] + '">' + svg + '</span>'; }
  return { attack: attack, spark: spark, beam: beam, summon: summon, evolve: evolve, chest: chest, coins: coins, fight: fight, wInfo: wInfo, pEl: pEl, EL: EL, hash: hash, pos: pos, tb: tb, TN: TN, ts: ts, pg: pg, wSig: wSig, SIGN: SIGN };
})();
/* 🪙 金幣圖示：老師的電腦（舊的 Windows）沒有 🪙 這個字 ➜ 一律換成自己畫的金幣（2026-10-20 第十四次 2） */
(function () {
  var CN = '🪙', SKIP = /^(SCRIPT|STYLE|TEXTAREA|TITLE|OPTION|CANVAS)$/;
  function fixText(t) { if (!t.parentNode || SKIP.test(t.parentNode.nodeName) || t.nodeValue.indexOf(CN) < 0) return; var parts = t.nodeValue.split(CN), f = document.createDocumentFragment();
    for (var i = 0; i < parts.length; i++) { if (i) { var s = document.createElement('i'); s.className = 'cnI'; s.setAttribute('role', 'img'); s.setAttribute('aria-label', '金幣'); f.appendChild(s); } if (parts[i]) f.appendChild(document.createTextNode(parts[i])); }
    t.parentNode.replaceChild(f, t); }
  function fix(n) { if (!n) return; if (n.nodeType === 3) { fixText(n); return; } if (n.nodeType !== 1 || SKIP.test(n.nodeName) || (n.textContent || '').indexOf(CN) < 0) return;
    var w = document.createTreeWalker(n, 4, null, false), L = [], x; while ((x = w.nextNode())) if (x.nodeValue.indexOf(CN) >= 0) L.push(x); L.forEach(fixText); }
  function go() { fix(document.body); if (window.MutationObserver) new MutationObserver(function (M) { M.forEach(function (m) { if (m.type === 'characterData') fixText(m.target); else for (var i = 0; i < m.addedNodes.length; i++) fix(m.addedNodes[i]); }); })
    .observe(document.body, { childList: true, subtree: true, characterData: true }); }
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
})();
