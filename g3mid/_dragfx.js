/* g3mid/_dragfx.js — 拖曳題 不 無聊（2026-11-01 第三十九次 第 1 點；三年級 g3mid、四年級 midterm 共用；跟 _decode.js 一起 進 網頁）
 *
 * 老師：三年級、四年級 期中複習，只要 有 拖曳 題目，一律 加上
 *   🎁 神秘 方塊：每一題 隨機 1 個 方塊 是 寶箱，放對 ＝ 打開（🪙、這一題 ✖2、1 秒 透視 一格 …）
 *   🧩 每一題 換 一種 樣子：格子 輪流 變成 火車 車廂、太空艙、寶石、鍵盤 …（同樣 拖曳，外觀 每一題 不一樣）
 *   ＋ 我 建議 的 其他 元素：👻 跟 自己 的 影子 賽跑（只 跟 自己 比）、寶箱 稀有度（木／銀／金／💎 彩虹）、🔥 連對 火焰 小 HUD、每一種 樣子 自己 的 過關 特效
 * 公平（第三十七次 第 9 點 照舊）：寶箱、影子 只 給「遊戲 積分」（🔓 解碼 積分／🎁 寶箱 金幣），**老師看板 的 100 分 只 看 放對 幾個**，不會 因為 運氣 加分 或 扣分；
 *   打開 寶箱 的 動畫 演 的 時候 倒數 停住（不 吃 作答 時間）。
 * 用 在：🔓 句子 解碼（g3mid、midterm `decRender`）。2026-11-02 第四十次：🌱 皮克敏、📋 資料表 改回 單純 拖曳（老師）。教學（#dcl）不 加。
 * 量測 window.__NODFX ＝ 1 ＝ 全部 不 加（舊 量測 用）；window.__DFXR ＝ 0～1 ＝ 固定 隨機（量測 用）。 */
function DFXSRC() {
  /* ══ 2026-11-02 第四十次 第 ③ 點 重做（老師：寶箱 先 出現 在 方塊 上 ＝ 不 神秘；每題 隨便 就 有 ＝ 不 珍惜；影子 看不懂）══
     🎁 寶箱：題目 上 看不到；**整題 一次 全對** 以後 才 可能 掉；**愈 難（格子 愈 多、錯 方塊 愈 多、🔦 記憶 解碼 沒 偷看）掉 的 機會 愈 大、寶箱 愈 好、獎勵 愈 多**；
             簡單 題（難度 ≦ 4）一定 不 掉（沒有 保底）。掉 下來 ＝ 大 寶箱 從 天上 掉 下來 ➜ 點 3 下 親手 打開（5 秒 沒 點 ＝ 自己 開）➜ 光 ＋ 金幣 ＋ 大字 獎品；只 給 遊戲 積分（100 分 不 變）。
     🏁 跟 上次 的 自己 賽跑（取代 👻 影子）：題目 上面 一條 跑道：👻「上次 的 你」照 你 前 5 題 的 平均 速度 往 🏁 跑；🏃「你」每 放 一格 往前 一格；
             你 先 到 🏁 而且 全對 ＝「🏆 你 贏了 上次 的 自己！」＋200（只 跟 自己 比）。還 沒有 紀錄 ＝ 跑道 寫「做 2 題 以後，👻 上次 的 你 會 出現」。
     🧩 8 種 樣子 更 立體、更 會 動：🚂 過關 ＝ 鐵軌 往後 跑、輪子 轉、冒煙、車身 晃 ＝ 火車 真的 開；🍣 輸送帶 一直 轉、盤子 上 是 握壽司 … */
  var D = { n: 0, off: -1, gold: 0, open: 0 };
  function rnd() { return window.__DFXR != null ? +window.__DFXR : Math.random(); }
  function H(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  D.on = function (el) { return !window.__NODFX && !(el && el.closest && el.closest('#dcl')); };
  D.SK = [['train', '🚂', '解碼 列車', '💨'], ['rocket', '🚀', '太空艙 發射', '🔥'], ['gem', '💎', '寶石 鑲嵌', '✨'], ['key', '⌨️', '魔法 鍵盤', '🎵'],
    ['sushi', '🍣', '迴轉 壽司', '🍙'], ['brick', '🧱', '積木 城堡', '⭐'], ['sea', '🫧', '海底 泡泡', '🐠'], ['card', '🃏', '魔法 卡牌', '🌟']];
  D.round = function () { var r = window.R; if (D.rr !== r) { D.rr = r; D.n = 0; D.off = Math.floor(rnd() * D.SK.length); D.gold = 0; D.open = 0; } };
  D.clean = function (box) { if (!box) return; [].slice.call(box.classList).forEach(function (c) { if (/^sk-|^dfx/.test(c) || c === 'win') box.classList.remove(c); }); box._sk = null; };
  D.skin = function (box) { D.clean(box); if (!D.on(box)) return null; D.round(); var s = D.SK[(D.off + D.n) % D.SK.length]; D.n++;
    box.classList.add('dfx', 'sk-' + s[0]); var b = H('div', 'dfxban', '<span class="i">' + s[1] + '</span>' + s[2]); box.insertBefore(b, box.firstChild); box._sk = s;
    if (s[0] === 'sea') for (var k = 0; k < 6; k++) { var bb = H('span', 'dfxbub', ''); bb.style.left = (8 + k * 16) + '%'; bb.style.animationDelay = (k * .7) + 's'; box.appendChild(bb); }
    if (s[0] === 'rocket') box.appendChild(H('span', 'dfxstar', ''));
    return s; };
  /* 過關：這一種 樣子 自己 的 特效（英文 不 移動）*/
  D.win = function (box) { if (!box || !box._sk) return; var s = box._sk; box.classList.add('win'); var r = box.getBoundingClientRect();
    for (var i = 0; i < 16; i++) { var p = H('span', 'dfxpt', i % 3 ? s[3] : s[1]); p.style.left = (r.left + r.width * (.06 + .88 * (i / 15))) + 'px'; p.style.top = (r.top + r.height * .45) + 'px';
      p.style.setProperty('--dx', (Math.round((rnd() - .5) * 200)) + 'px'); p.style.setProperty('--dy', (-90 - Math.round(rnd() * 180)) + 'px'); p.style.animationDelay = (i * 40) + 'ms'; document.body.appendChild(p);
      (function (p) { setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 1800); })(p); }
    setTimeout(function () { box.classList.remove('win'); }, s[0] === 'train' || s[0] === 'sushi' ? 2800 : 1700); };

  /* ── 🏁 跟 上次 的 自己 賽跑 ── */
  D.gk = function () { var A = window.DEC && DEC.A; return 'dfx_gh_' + (location.pathname.indexOf('midterm') >= 0 ? 'g4' : 'g3') + '_' + ((A && A.sid && A.sid()) || '0'); };
  /* 2026-11-03 第四十一次 第 1 點：🏁 跟 上次 的 自己 賽跑（👻）整個 刪除 */

  /* ── 🎁 難題 寶箱（全對 以後 才 掉）── */
  D.TIER = [['wood', '木頭 寶箱'], ['silver', '銀 寶箱'], ['gold', '金 寶箱'], ['rainbow', '💎 彩虹 寶箱'], ['legend', '👑 傳說 寶箱']];
  D.PTS = [400, 900, 1800, 3500, 8000];   /* 第四十二次 第 2 點：🔦 記憶 解碼（長 句子、沒 偷看、一次 全對）＝ 一定 掉 👑 傳說 寶箱 */
  /* 難度 ＝ 格子 數 ＋ 多 的 錯 方塊 數 ＋（記憶 解碼 沒 偷看 ＋3）；機會、稀有度、獎勵 都 跟著 難度 變 大 */
  D.drop = function (diff, mem) { if (mem) return { t: 4, p: Math.round((8000 + Math.max(0, diff - 8) * 600) / 100) * 100, mem: 1 }; var ch = diff <= 4 ? 0 : diff === 5 ? .25 : diff === 6 ? .45 : diff === 7 ? .6 : diff === 8 ? .75 : .9; if (rnd() >= ch) return null;
    var x = rnd(), t = diff >= 9 ? (x < .35 ? 3 : 2) : diff >= 8 ? (x < .12 ? 3 : x < .6 ? 2 : 1) : diff >= 7 ? (x < .35 ? 2 : 1) : diff >= 6 ? (x < .4 ? 1 : 0) : 0;
    return { t: t, p: Math.round(D.PTS[t] * (1 + Math.max(0, diff - 5) * .15) / 50) * 50 }; };
  D.CHEST = function (t, open) { var C = [['#8D5A2B', '#5E3A17', '#C99A5B'], ['#AEB8C4', '#6E7A86', '#E6EEF6'], ['#F5B829', '#9A6B00', '#FFE58A'], ['#B66BFF', '#3A6BFF', '#7CFFE0'], ['#FFC93C', '#7A2E00', '#FFFFFF']][t];
    var g = '<defs><linearGradient id="dfxS' + t + '" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>' + (t === 3 ? '<linearGradient id="dfxRb" x1="0" x2="1"><stop offset="0" stop-color="#FF5A8A"/><stop offset=".33" stop-color="#FFD54A"/><stop offset=".66" stop-color="#5EF0B0"/><stop offset="1" stop-color="#5E9BFF"/></linearGradient>' : '') + '</defs>';
    var f = t === 3 ? 'url(#dfxRb)' : C[0], crown = t === 4 ? '<path d="M20 8 L26 0 L32 7 L38 0 L44 8 Z" fill="#FFE58A" stroke="#7A2E00" stroke-width="1.6"/><circle cx="32" cy="5" r="1.8" fill="#FF3B6B"/>' : '';
    return '<svg viewBox="0 0 64 56" aria-hidden="true">' + g + (open ? '<path d="M32 28 L4 -6 L60 -6 Z" fill="#FFF6C0" opacity=".9"/>' : '') +
      '<rect x="6" y="24" width="52" height="28" rx="4" fill="' + f + '" stroke="' + C[1] + '" stroke-width="3"/><rect x="6" y="24" width="52" height="28" rx="4" fill="url(#dfxS' + t + ')"/>' +
      '<rect x="6" y="34" width="52" height="5" fill="' + C[1] + '" opacity=".55"/><rect x="14" y="24" width="5" height="28" fill="' + C[1] + '" opacity=".4"/><rect x="45" y="24" width="5" height="28" fill="' + C[1] + '" opacity=".4"/>' +
      (open ? '<path d="M6 22 Q32 2 58 22 L58 16 Q32 -4 6 16 Z" fill="' + f + '" stroke="' + C[1] + '" stroke-width="3" transform="rotate(-28 6 22)"/>'
        : '<path d="M6 24 Q6 8 32 8 Q58 8 58 24 Z" fill="' + f + '" stroke="' + C[1] + '" stroke-width="3"/><path d="M6 24 Q6 8 32 8 Q58 8 58 24 Z" fill="url(#dfxS' + t + ')"/>') +
      '<rect x="27" y="' + (open ? 26 : 20) + '" width="10" height="13" rx="2" fill="' + C[2] + '" stroke="' + C[1] + '" stroke-width="2"/>' + (open ? '' : crown) + '</svg>'; };
  /* 掉 下來 ➜ 點 3 下 打開；ctl.done(加 幾分) */
  D.chestBox = function (dr, diff, why, done) { if (!dr) { done(0); return; } D.open++; var t = dr.t, tap = 0, fin = 0;
    var o = H('div', 'dfxch2 ch-' + D.TIER[t][0], '<div class="dim"></div><div class="why">🔥 難題 <b>' + why + '</b> 一次 全對！</div><div class="drop"><div class="rays"></div><div class="bx">' + D.CHEST(t, 0) + '</div></div>' +
      '<div class="nm">🎁 ' + D.TIER[t][1] + ' 掉 下來 了！</div><div class="tap">👆 點 寶箱 3 下 打開！ <span class="d"><i></i><i></i><i></i></span></div><div class="pz"></div>');
    document.body.appendChild(o); var bx = o.querySelector('.bx'), dots = o.querySelectorAll('.tap i');
    function openIt() { if (fin) return; fin = 1; clearTimeout(au); o.classList.add('op'); bx.innerHTML = D.CHEST(t, 1); o.querySelector('.tap').style.visibility = 'hidden';
      for (var i = 0; i < (t >= 2 ? 22 : 14); i++) { var cn = H('span', 'dfxcn', t === 3 && i % 2 ? '💎' : '🪙'); cn.style.setProperty('--a', (i * (360 / (t >= 2 ? 22 : 14))) + 'deg'); cn.style.setProperty('--r', (120 + (i % 3) * 40) + 'px'); cn.style.animationDelay = (i * 22) + 'ms'; o.querySelector('.drop').appendChild(cn); }
      var pz = o.querySelector('.pz'); pz.innerHTML = '🪙 ＋' + dr.p + '<small>遊戲 積分</small>';
      setTimeout(function () { o.classList.add('out'); setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); done(dr.p); }, 380); }, window.__NOGO ? 40 : 2200); }
    bx.onclick = function () { if (fin) return; tap++; if (dots[tap - 1]) dots[tap - 1].classList.add('on'); bx.classList.remove('hit'); void bx.offsetWidth; bx.classList.add('hit', 'h' + Math.min(3, tap)); if (tap >= 3) setTimeout(openIt, 250); };
    var au = setTimeout(openIt, 6000); };

  /* ══ 2026-11-03 第四十二次 第 3-(4) 點（老師：每一題 都 是 寶箱 會 膩）＝ 掉 下來 的 驚喜 每一次 換 一種 玩法（同一回 不 連續 重複）：
     🎁 寶箱 點 3 下、🃏 翻牌 三選一、🪙 刮刮卡、🥚 龍蛋 孵化、🎰 扭蛋機、🎈 射 氣球、🚀 按住 發射；🔦 記憶 解碼 成功 ＝ 一定 是 👑 傳說 寶箱（最 華麗）。
     只 給 遊戲 積分（不 算進 100 分，🔒 11 第 3 條 照舊）；動畫 的 時候 倒數 停住；8 秒 沒 動 ＝ 自己 打開（不會 卡住） ══ */
  D.STY = ['box', 'card', 'scratch', 'egg', 'gacha', 'balloon', 'rocket'];
  D.nextSty = function () { if (window.__DFXSTY) return window.__DFXSTY; var L = D.STY.filter(function (x) { return x !== D.lastSty; }), k = L[Math.floor(rnd() * L.length) % L.length]; D.lastSty = k; return k; };
  D.chest = function (dr, diff, why, done) { if (!dr) { done(0); return; } if (dr.t === 4) { D.legend(dr, why, done); return; } var st = D.nextSty(); if (st === 'box') { D.chestBox(dr, diff, why, done); return; } D.open++; D.play(st, dr, why, done); };
  function coins(host, n, t) { for (var i = 0; i < n; i++) { var cn = H('span', 'dfxcn', t >= 3 && i % 2 ? '💎' : '🪙'); cn.style.setProperty('--a', (i * (360 / n)) + 'deg'); cn.style.setProperty('--r', (120 + (i % 3) * 45) + 'px'); cn.style.animationDelay = (i * 18) + 'ms'; host.appendChild(cn); } }
  D.play = function (st, dr, why, done) { var t = dr.t, fin = 0, pts = dr.p;
    var TT = { card: ['🃏 魔法 翻牌！', '👆 選 一張 牌 翻開！'], scratch: ['🪙 刮刮卡！', '👆 用 手指 在 銀色 上面 刮 一刮！'], egg: ['🥚 神秘 龍蛋！', '👆 點 蛋 4 下，讓 牠 孵 出來！'],
      gacha: ['🎰 扭蛋機！', '👆 轉 2 下 把手，再 點 扭蛋！'], balloon: ['🎈 驚喜 氣球！', '👆 點破 一顆 氣球！'], rocket: ['🚀 寶藏 火箭！', '👆 按住 火箭 蓄力，放開 發射！'] }[st];
    var o = H('div', 'dfxch2 dfxpl ps-' + st + ' ch-' + D.TIER[t][0], '<div class="dim"></div><div class="why">🔥 難題 <b>' + why + '</b> 一次 全對！</div><div class="nm">' + TT[0] + '<small>' + D.TIER[t][1] + ' 等級</small></div><div class="drop pst"></div><div class="tap">' + TT[1] + '</div><div class="pz"></div>');
    document.body.appendChild(o); var S = o.querySelector('.pst'), tap = o.querySelector('.tap'), au = setTimeout(function () { auto(); }, window.__NOGO ? 60 : 8000), auto = function () { };
    function open(p, extra) { if (fin) return; fin = 1; clearTimeout(au); pts = p; o.classList.add('op'); tap.style.visibility = 'hidden'; coins(S, t >= 2 ? 22 : 14, t);
      o.querySelector('.pz').innerHTML = (extra || '') + '🪙 ＋' + p + '<small>遊戲 積分</small>';
      setTimeout(function () { o.classList.add('out'); setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); done(pts); }, 380); }, window.__NOGO ? 40 : 2300); }
    var vr = function () { var a = [Math.round(pts * .8 / 50) * 50, pts, Math.round(pts * 1.3 / 50) * 50]; for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; };
    if (st === 'card' || st === 'balloon') { var A = vr(), it = A.map(function (v, i) { var e = H('button', st === 'card' ? 'dfxcd' : 'dfxbl', st === 'card' ? '<span class="f">✨</span><span class="b">🪙<b>' + v + '</b></span>' : '<span class="bl" style="--h:' + [350, 200, 50][i] + '">🎈</span><span class="v">🪙 ' + v + '</span>'); e.style.animationDelay = (i * .15) + 's'; S.appendChild(e); return e; });
      var pickI = function (k) { if (fin) return; it.forEach(function (e, i) { setTimeout(function () { e.classList.add('fl'); if (i !== k) e.classList.add('dim2'); }, i === k ? 0 : 500); }); it[k].classList.add('me'); setTimeout(function () { open(A[k]); }, 900); };
      it.forEach(function (e, i) { e.onclick = function () { pickI(i); }; }); auto = function () { pickI(1); }; }
    else if (st === 'scratch') { var w = H('div', 'dfxsc', '<div class="u">🪙 ＋' + pts + '</div><canvas></canvas>'); S.appendChild(w); var cv = w.querySelector('canvas'), cx, mv = 0, dn = false;
      setTimeout(function () { var r = w.getBoundingClientRect(); cv.width = r.width; cv.height = r.height; cx = cv.getContext('2d'); var g = cx.createLinearGradient(0, 0, r.width, r.height); g.addColorStop(0, '#C8CED6'); g.addColorStop(.5, '#F4F6F8'); g.addColorStop(1, '#9AA3AE'); cx.fillStyle = g; cx.fillRect(0, 0, r.width, r.height); cx.fillStyle = '#6E7783'; cx.font = 'bold 28px sans-serif'; cx.textAlign = 'center'; cx.fillText('✋ 刮 這裡', r.width / 2, r.height / 2 + 10); cx.globalCompositeOperation = 'destination-out'; }, 30);
      var sc = function (e) { if (!cx || fin) return; var r = cv.getBoundingClientRect(); cx.beginPath(); cx.arc(e.clientX - r.left, e.clientY - r.top, 30, 0, 7); cx.fill(); mv++; if (mv > 28) { cv.style.transition = 'opacity .4s'; cv.style.opacity = '0'; open(pts); } };
      cv.addEventListener('pointerdown', function (e) { dn = true; sc(e); }); cv.addEventListener('pointermove', function (e) { if (dn) sc(e); }); window.addEventListener('pointerup', function () { dn = false; });
      auto = function () { cv.style.opacity = '0'; open(pts); }; }
    else if (st === 'egg') { var eg = H('button', 'dfxeg', '<span class="e">🥚</span><span class="ck"></span>'), n = 0; S.appendChild(eg);
      eg.onclick = function () { if (fin) return; n++; eg.className = 'dfxeg c' + Math.min(4, n); if (n >= 4) { eg.innerHTML = '<span class="e dr">🐉</span>'; open(pts, '🐉 '); } }; auto = function () { eg.innerHTML = '<span class="e dr">🐉</span>'; open(pts, '🐉 '); }; }
    else if (st === 'gacha') { var gm = H('div', 'dfxga', '<div class="gl">🔴🟡🔵<br>🟢🟣🟠</div><button class="kn">⟳</button><div class="cap"></div>'), turns = 0; S.appendChild(gm); var kn = gm.querySelector('.kn'), cp = gm.querySelector('.cap');
      kn.onclick = function () { if (fin || turns >= 2) return; turns++; kn.classList.remove('sp'); void kn.offsetWidth; kn.classList.add('sp'); if (turns >= 2) { setTimeout(function () { cp.classList.add('in'); cp.innerHTML = '🟡'; tap.textContent = '👆 點 扭蛋 打開！'; }, 500); } };
      cp.onclick = function () { if (!cp.classList.contains('in') || fin) return; cp.classList.add('op'); open(pts); }; auto = function () { cp.classList.add('in', 'op'); open(pts); }; }
    else if (st === 'rocket') { var rk = H('button', 'dfxrk', '<span class="r">🚀</span><span class="pw"><i></i></span>'), hold = 0, t0 = 0, iv = 0; S.appendChild(rk); var bar = rk.querySelector('.pw i');
      var go = function () { if (fin) return; clearInterval(iv); rk.classList.add('go'); setTimeout(function () { S.appendChild(H('div', 'dfxfw', '🎆')); open(pts, '🎆 '); }, 700); };
      rk.addEventListener('pointerdown', function (e) { if (fin) return; e.preventDefault(); t0 = Date.now(); clearInterval(iv); iv = setInterval(function () { var r = Math.min(1, (Date.now() - t0) / 1200); bar.style.width = (r * 100) + '%'; rk.classList.toggle('sh', r > .3); if (r >= 1) go(); }, 40); });
      var up = function () { clearInterval(iv); if (fin) return; if (Date.now() - t0 >= 600) go(); else { bar.style.width = '0'; rk.classList.remove('sh'); } }; rk.addEventListener('pointerup', up); rk.addEventListener('pointercancel', up); auto = go; }
  };
  /* 👑 傳說 寶箱（只 有 🔦 記憶 解碼 長 句子 成功）：全 螢幕 金光、彩虹 光環、煙火、點 5 下、金幣 雨＋「你 的 努力 有 價值！」*/
  D.legend = function (dr, why, done) { D.open++; var tap = 0, fin = 0;
    var o = H('div', 'dfxch2 dfxlg ch-legend', '<div class="dim"></div><div class="lgfw"></div><div class="why">🔦 記憶 解碼：長 句子 憑 記憶 <b>一次 全對！</b></div><div class="nm lgn">👑 傳說 寶箱 降臨！</div>' +
      '<div class="drop"><div class="rays"></div><div class="ring"></div><div class="bx">' + D.CHEST(4, 0) + '</div></div><div class="tap">👆 點 寶箱 5 下 打開！ <span class="d"><i></i><i></i><i></i><i></i><i></i></span></div><div class="pz"></div><div class="lgw"></div>');
    document.body.appendChild(o); var bx = o.querySelector('.bx'), dots = o.querySelectorAll('.tap i'), fw = o.querySelector('.lgfw');
    for (var k = 0; k < 8; k++) { var f = H('span', 'lgb', ['🎆', '🎇', '✨', '🌟'][k % 4]); f.style.left = (8 + k * 12) + '%'; f.style.top = (10 + (k % 3) * 22) + '%'; f.style.animationDelay = (k * .35) + 's'; fw.appendChild(f); }
    function openIt() { if (fin) return; fin = 1; clearTimeout(au); o.classList.add('op'); bx.innerHTML = D.CHEST(4, 1); o.querySelector('.tap').style.visibility = 'hidden'; coins(o.querySelector('.drop'), 36, 4);
      for (var i = 0; i < 26; i++) { var r = H('span', 'lgrain', i % 3 ? '🪙' : '💎'); r.style.left = (Math.random() * 100) + '%'; r.style.animationDelay = (Math.random() * 1.4) + 's'; o.appendChild(r); }
      o.querySelector('.pz').innerHTML = '🪙 ＋' + dr.p + '<small>遊戲 積分（最 高 等級）</small>'; o.querySelector('.lgw').textContent = '💪 專心 記住 長 句子 ＝ 真 本事！你 的 努力 有 價值！';
      setTimeout(function () { o.classList.add('out'); setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); done(dr.p); }, 380); }, window.__NOGO ? 40 : 3600); }
    bx.onclick = function () { if (fin) return; tap++; if (dots[tap - 1]) dots[tap - 1].classList.add('on'); bx.classList.remove('hit'); void bx.offsetWidth; bx.classList.add('hit', 'h' + Math.min(3, tap)); if (tap >= 5) setTimeout(openIt, 250); };
    var au = setTimeout(openIt, window.__NOGO ? 60 : 9000); };

  /* ══ 2026-11-03 第四十二次 第 3-(1)(2)(3) 點：拖曳 題 開始 前 的 秒懂 動畫「🎁 寶箱 怎麼 拿？」（現場任務 也 演，老師 選）
     每一位 學生 第一次 ＝ 4 幕 完整（約 22 秒，有〔⏸️ 暫停〕〔🔁 再播一次〕〔🐢 慢速〕，演完 才 能 按）；之後 每 一回 ＝ 1 幕 重點（約 5 秒）。 ══ */
  D.inKey = function () { var A = window.DEC && DEC.A; return 'dfx_in_' + (location.pathname.indexOf('midterm') >= 0 ? 'g4' : 'g3') + '_' + ((A && A.sid && A.sid()) || '0'); };
  D.needIn = function () { if (window.__NODFXI) return false; return D.inR !== window.R; };
  D.intro = function (done) { D.inR = window.R; var seen = false; try { seen = !!localStorage.getItem(D.inKey()); } catch (e) { }
    var C = function (t) { return '<span class="ich">' + D.CHEST(t, 0) + '</span>'; };
    var SL = [
      ['🎁 怎麼 拿到 寶箱？', '<div class="i1"><span class="sl">我的</span><span class="sl">名字</span><span class="sl">是</span><span class="sl">Bill</span></div><div class="itm"><i></i></div><div class="i1c">' + C(2) + '</div>', '① 每一格 都 放對（一次 全對）＋ ② ⏱ 時間 到 以前 完成 ➜ 才 有 機會 掉 下 寶箱'],
      ['📈 愈 難 ＝ 獎勵 愈 豐盛', '<div class="i2"><span><b>短 句子</b><em>🙂</em><small>沒有 寶箱</small></span><span><b>中等</b>' + C(0) + '<small>小 獎勵</small></span><span><b>很 難</b>' + C(2) + '<small>大 獎勵</small></span><span class="lg"><b>🔦 長 句子 記憶</b>' + C(4) + '<small>👑 傳說 獎勵</small></span></div>', '格子 愈 多、陷阱 方塊 愈 多、憑 記憶 ➜ 寶箱 愈 好'],
      ['🚫 隨便 亂 放 ＝ 什麼 都 沒有', '<div class="i3"><span class="sl x">她</span><span class="sl x">是的</span><span class="sl x">年紀</span><span class="no">❌</span><span class="ich nob">' + D.CHEST(0, 0) + '<b>🚫</b></span></div>', '💪 想要 得到，先 付出 對等 的 努力：看 清楚、想 清楚，再 放'],
      ['🎉 每一次 驚喜 都 不一樣', '<div class="i4">' + ['🎁', '🃏', '🪙', '🥚', '🎰', '🎈', '🚀', '👑'].map(function (x, i) { return '<span style="animation-delay:' + (i * .35) + 's">' + x + '</span>'; }).join('') + '</div>', '答對 難題 才 知道 這一次 是 哪一種！（只 加 遊戲 積分，不 影響 100 分）']];
    var L = seen ? [['🎁 寶箱 的 規則', '<div class="i2"><span><b>簡單</b><em>🙂</em><small>沒有</small></span><span><b>難</b>' + C(2) + '<small>大 獎勵</small></span><span class="lg"><b>🔦 記憶</b>' + C(4) + '<small>👑 傳說</small></span></div>', '一次 全對＋時間 內 ➜ 愈 難 愈 豐盛；隨便 放 ＝ 沒有']] : SL;
    var o = H('div', 'dfxin', '<div class="ib"><div class="ip"></div><div class="iw"></div><div class="ia"></div><div class="ic"></div><button class="igo" disabled>🔒 看完 才 能 按</button></div>');
    document.body.appendChild(o); var ip = o.querySelector('.ip'), iw = o.querySelector('.iw'), ia = o.querySelector('.ia'), go = o.querySelector('.igo'), TM = window.ACTL ? ACTL.T : function (f, m) { return setTimeout(f, m); };
    var D1 = window.__NOGO ? 30 : 5600;
    function run() { go.disabled = true; go.className = 'igo'; go.textContent = '🔒 看完 才 能 按'; show(0); }
    function show(k) { var s = L[k]; ip.textContent = (k + 1) + ' ／ ' + L.length; iw.innerHTML = '<div class="ih">' + s[0] + '</div>'; ia.innerHTML = '<div class="iv iv' + (seen ? 2 : k + 1) + '">' + s[1] + '</div><div class="it">' + s[2] + '</div>';
      TM(function () { if (k + 1 < L.length) show(k + 1); else { go.disabled = false; go.className = 'igo rdy'; go.textContent = '▶ 我 懂了，開始！'; } }, seen ? Math.min(D1, 4200) : D1); }
    if (window.ACTL) ACTL.on(o.querySelector('.ic'), run); run();
    go.onclick = function () { if (go.disabled) return; try { localStorage.setItem(D.inKey(), '1'); } catch (e) { } if (window.ACTL) ACTL.off(); o.remove(); done(); }; };
  return D;
}
const CSS = `
/* ══ 拖曳題（g3mid/_dragfx.js）2026-11-02 第四十次 重做 ══ */
.dfxban{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px 14px;margin:0 auto 4px;font-size:clamp(20px,2.8vh,28px);font-weight:700;color:#FFE9A8;text-shadow:0 2px 8px rgba(0,0,0,.6);animation:dfxBan .6s cubic-bezier(.2,1.5,.4,1) both}
.dfxban .i{font-size:1.5em;line-height:1;display:inline-block;animation:dfxBob 1.6s ease-in-out infinite;filter:drop-shadow(0 4px 4px rgba(0,0,0,.5))}
@keyframes dfxBan{from{opacity:0;transform:translateY(-14px) scale(.7)}to{opacity:1;transform:none}}@keyframes dfxBob{50%{transform:translateY(-4px) rotate(-6deg)}}
.dcbox.dfx{position:relative;border-radius:26px;padding:6px 8px 10px;overflow:hidden}
/* 🏁 跑道 */
/* 🎁 難題 寶箱（全對 以後 才 掉）*/
.dfxch2{position:fixed;inset:0;z-index:9300;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;font-family:inherit}
.dfxch2 .dim{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,rgba(40,20,80,.55),rgba(0,0,0,.82));animation:dfxFade .3s both}
.dfxch2>*:not(.dim){position:relative}
.dfxch2 .why{font-size:clamp(24px,3.6vh,36px);font-weight:800;color:#FFE07A;text-shadow:0 3px 8px #000;animation:dfxBan .5s both}.dfxch2 .why b{color:#fff}
.dfxch2 .drop{width:clamp(180px,26vh,260px);height:clamp(170px,24vh,240px);perspective:600px;animation:dfxDrop .8s cubic-bezier(.3,1.5,.5,1) both}
.dfxch2 .bx{width:100%;cursor:pointer;transform-style:preserve-3d;transform:rotateX(14deg);filter:drop-shadow(0 18px 14px rgba(0,0,0,.6));animation:dfxIdle 1.2s ease-in-out infinite}
.dfxch2 .bx svg{display:block;width:100%;height:auto}
.dfxch2 .bx.hit{animation:dfxHit .3s}.dfxch2 .bx.h2{filter:drop-shadow(0 0 18px #FFE07A) drop-shadow(0 18px 14px rgba(0,0,0,.6))}.dfxch2 .bx.h3{filter:drop-shadow(0 0 34px #FFF3B0) brightness(1.3)}
.dfxch2 .rays{position:absolute;left:50%;top:50%;width:200%;height:200%;transform:translate(-50%,-50%);background:repeating-conic-gradient(rgba(255,240,170,.7) 0 9deg,transparent 9deg 22deg);border-radius:50%;-webkit-mask:radial-gradient(circle,#000 25%,transparent 68%);mask:radial-gradient(circle,#000 25%,transparent 68%);opacity:.25;animation:dfxSpin 8s linear infinite;pointer-events:none}
.dfxch2.op .rays{opacity:1;animation:dfxSpin 3s linear infinite}
.dfxch2.ch-rainbow .rays{background:repeating-conic-gradient(#FF5A8A 0 8deg,#FFD54A 8deg 16deg,#5EF0B0 16deg 24deg,#5E9BFF 24deg 32deg,transparent 32deg 40deg)}
.dfxch2.ch-gold .bx,.dfxch2.ch-rainbow .bx{filter:drop-shadow(0 0 22px #FFD54A) drop-shadow(0 18px 14px rgba(0,0,0,.6))}
.dfxch2 .nm{font-size:clamp(24px,3.6vh,36px);font-weight:800;color:#fff;text-shadow:0 3px 8px #000}
.dfxch2 .tap{font-size:clamp(22px,3.2vh,32px);color:#BFE8FF;animation:dfxBob 1s infinite}.dfxch2 .tap .d i{display:inline-block;width:.8em;height:.8em;margin:0 3px;border-radius:50%;border:3px solid #BFE8FF;vertical-align:middle}.dfxch2 .tap .d i.on{background:#FFD54A;border-color:#FFD54A}
.dfxch2 .pz{min-height:1.2em;font-size:clamp(46px,8vh,84px);font-weight:900;color:#FFE58A;text-shadow:0 0 18px #FFB300,0 4px 0 #7A4A00}.dfxch2 .pz small{display:block;font-size:.32em;color:#fff;text-shadow:0 2px 6px #000}
.dfxch2.op .pz{animation:dfxPz .6s cubic-bezier(.2,1.8,.4,1) both}.dfxch2.out{animation:dfxFade .38s reverse both}
.dfxcn{position:absolute;left:50%;top:45%;font-size:clamp(28px,4vh,40px);animation:dfxCn 1.1s ease-out both;pointer-events:none}
@keyframes dfxCn{0%{transform:translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(.4);opacity:1}100%{transform:translate(-50%,-50%) rotate(var(--a)) translateY(calc(-1 * var(--r))) scale(1.1);opacity:0}}
@keyframes dfxDrop{0%{transform:translateY(-70vh) rotate(-20deg)}70%{transform:translateY(10px) rotate(4deg)}100%{transform:none}}
@keyframes dfxIdle{50%{transform:rotateX(14deg) translateY(-6px) rotateZ(-2deg)}}@keyframes dfxHit{30%{transform:rotateX(14deg) scale(1.12) rotateZ(-8deg)}70%{transform:rotateX(14deg) scale(.95) rotateZ(6deg)}}
@keyframes dfxSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes dfxFade{from{opacity:0}to{opacity:1}}@keyframes dfxPz{from{transform:scale(0) rotate(-10deg)}to{transform:none}}
/* 過關 特效 */
.dfxpt{position:fixed;z-index:9250;font-size:clamp(30px,4.6vh,46px);pointer-events:none;animation:dfxPt 1.5s ease-out both}
@keyframes dfxPt{0%{transform:translate(-50%,-50%) scale(.3);opacity:0}20%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(.8);opacity:0}}
/* ── 🧩 8 種 樣子：框 大小 不變；綠／紅 永遠 最 優先；方塊 一律 立體（上 亮光、下 厚邊、光 掃過）── */
.dcbox.dfx .dcs{transition:border-color .15s,background .15s,transform .2s,border-radius .2s}
.dcbox.dfx .dcs.ok{border-color:#2BD46A!important;background:#0F3A1F!important;color:#BFFFD0!important;box-shadow:0 0 16px rgba(43,212,106,.6)!important}
.dcbox.dfx .dcs.no{border-color:#FF5A5A!important;background:#3A1010!important;color:#FFC2C2!important}
.dcbox.dfx .dcs.hot,.dcbox.dfx .dcs.sel{border-color:#5EC8FF!important;border-style:solid!important;transform:scale(1.06)}
.dcbox.dfx .dctl{position:relative;overflow:hidden}
.dcbox.dfx .dctl:after{content:'';position:absolute;top:0;bottom:0;left:-60%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:dfxShine 3.2s ease-in-out infinite;pointer-events:none}
.dcbox.dfx .dctl:nth-child(2n):after{animation-delay:1.1s}.dcbox.dfx .dctl:nth-child(3n):after{animation-delay:2.1s}
@keyframes dfxShine{0%,60%{left:-60%}100%{left:130%}}
.dcbox.dfx .dcs.fill{color:#FFE38A}
/* 🚂 列車：格子 ＝ 車廂（會 轉 的 輪子），下面 枕木 鐵軌，前面 火車頭；過關 ＝ 鐵軌 往後 跑、輪子 轉、冒煙、車身 晃 ＝ 開 走 */
.sk-train{background:linear-gradient(#5BA3D9 0 55%,#7BC67A 55%)}
.sk-train .dcw{position:relative;padding-bottom:22px;background:repeating-linear-gradient(90deg,#6B4A2A 0 10px,transparent 10px 34px) 0 calc(100% - 4px)/100% 12px no-repeat,linear-gradient(#9AA3AD,#9AA3AD) 0 calc(100% - 13px)/100% 4px no-repeat,linear-gradient(#9AA3AD,#9AA3AD) 0 calc(100% - 3px)/100% 4px no-repeat}
.sk-train .dcw:before{content:'🚂';align-self:flex-end;font-size:clamp(46px,8vh,82px);line-height:1;margin-bottom:10px;transform:scaleX(-1);filter:drop-shadow(0 6px 4px rgba(0,0,0,.4))}
.sk-train .dcs{border-radius:10px 10px 6px 6px;border-style:solid;border-color:#7A1F17;background:linear-gradient(#D84A3A,#A82A1F 60%,#7A1F17);box-shadow:inset 0 3px 0 rgba(255,255,255,.35),inset 0 -8px 0 #5A1510,0 6px 10px rgba(0,0,0,.35);color:#FFF4D8}
.sk-train .dcs:after{content:'';position:absolute;left:10%;right:10%;bottom:-15px;height:18px;background:radial-gradient(circle,#333 0 4px,#bbb 4px 6px,#333 6px 8px,transparent 9px) left/18px 18px no-repeat,radial-gradient(circle,#333 0 4px,#bbb 4px 6px,#333 6px 8px,transparent 9px) right/18px 18px no-repeat}
.sk-train .dctl{border-color:#8D5A2B;background:linear-gradient(#F3D7A6,#C9954E);color:#3A2200;box-shadow:inset 0 2px 0 rgba(255,255,255,.6),0 6px 0 #6B4220;border-radius:8px}
.sk-train.win .dcw{animation:dfxChug .25s linear 10;background-position:-68px calc(100% - 4px),0 calc(100% - 13px),0 calc(100% - 3px);transition:background-position 2.5s linear}
.sk-train.win .dcw:before{animation:dfxChoo .5s 5}.sk-train.win .dcs:after{animation:dfxWheel .3s linear 8}
.sk-train.win:after{content:'💨 💨';position:absolute;left:6%;top:20%;font-size:clamp(30px,5vh,50px);animation:dfxSmoke 1.2s ease-out 2;pointer-events:none}
@keyframes dfxChoo{50%{transform:scaleX(-1) translateY(-6px) rotate(3deg)}}@keyframes dfxChug{50%{transform:translateY(-2px)}}@keyframes dfxWheel{50%{filter:brightness(1.5)}}
@keyframes dfxSmoke{0%{opacity:0;transform:translate(0,10px) scale(.5)}40%{opacity:1}100%{opacity:0;transform:translate(-60px,-50px) scale(1.6)}}
/* 🚀 太空艙：星空 會 閃、格子 ＝ 金屬 圓 艙門＋燈；過關 ＝ 每一個 艙 噴火、星星 往後 飛 */
.sk-rocket{background:radial-gradient(ellipse at 50% 120%,#3A2A7A,#0A0A24 60%)}
.dfxstar{position:absolute;inset:0;pointer-events:none;background:radial-gradient(1.5px 1.5px at 10% 20%,#fff,transparent),radial-gradient(2px 2px at 70% 30%,#fff,transparent),radial-gradient(1.5px 1.5px at 40% 80%,#fff,transparent),radial-gradient(1.5px 1.5px at 90% 70%,#cdf,transparent),radial-gradient(2px 2px at 25% 55%,#ffe,transparent),radial-gradient(1.5px 1.5px at 60% 10%,#fff,transparent);animation:dfxTw 2.4s ease-in-out infinite}
@keyframes dfxTw{50%{opacity:.4}}.sk-rocket>*{position:relative}
.sk-rocket .dcs{border-radius:999px;border-style:solid;border-color:#C9D6E2;background:radial-gradient(circle at 30% 30%,#3E5E8E,#0E1A2C);box-shadow:inset 0 0 0 5px #6E7E90,0 0 14px rgba(124,255,224,.25)}
.sk-rocket .dcs:before{content:'';position:absolute;right:10px;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;background:#7CFFE0;box-shadow:0 0 10px #7CFFE0;animation:dfxTw 1.2s infinite}
.sk-rocket .dctl{border-color:#5E9BFF;background:linear-gradient(#FFFFFF,#A9C6FF);color:#0E2350;box-shadow:inset 0 2px 0 #fff,0 6px 0 #3A5BA8,0 0 12px rgba(94,155,255,.5);border-radius:999px}
.sk-rocket.win .dcs{animation:dfxLift 1.4s cubic-bezier(.5,0,.5,1)}.sk-rocket.win .dcs:after{content:'🔥';position:absolute;left:50%;bottom:-.9em;transform:translateX(-50%) rotate(180deg);font-size:1.1em;animation:dfxTw .15s infinite}
.sk-rocket.win .dfxstar{animation:dfxWarp .5s linear 3}
@keyframes dfxLift{40%{transform:translateY(-14px)}100%{transform:none}}@keyframes dfxWarp{to{background-position:0 60px}}
/* 💎 寶石：金 底座＋切面 寶石（彩光 流動）；過關 ＝ 一顆 一顆 閃亮 */
.sk-gem{background:radial-gradient(circle at 50% 0,#3A2A10,#120C04 70%)}
.sk-gem .dcs{border-style:solid;border-color:#E0B23A;background:linear-gradient(135deg,#3A2C08,#14100A);clip-path:polygon(8% 0,92% 0,100% 50%,92% 100%,8% 100%,0 50%);border-radius:0;box-shadow:inset 0 0 0 4px #8A6A1A}
.sk-gem .dctl{border-color:#2AA7C9;background:linear-gradient(135deg,#E6FFFC,#5ED7F0 35%,#2AA7C9 60%,#B8FFF6);background-size:200% 200%;color:#05303A;box-shadow:0 6px 0 #176A80;clip-path:polygon(8% 0,92% 0,100% 50%,92% 100%,8% 100%,0 50%);border-radius:0;animation:dfxGem 3s ease-in-out infinite}
@keyframes dfxGem{50%{background-position:100% 100%}}.sk-gem.win .dcs.ok{animation:dfxSpark .5s 3}@keyframes dfxSpark{50%{filter:brightness(1.8) drop-shadow(0 0 12px #fff)}}
/* ⌨️ 鍵盤：凹 鍵位＋鍵帽；過關 ＝ 一個 一個 按 下去 的 波浪 */
.sk-key{background:linear-gradient(#2A3240,#161B24)}
.sk-key .dcs{border-style:solid;border-color:#3A4656;border-radius:12px;background:#0B0F15;box-shadow:inset 0 5px 10px #000}
.sk-key .dctl{border-color:#C9D2DC;background:linear-gradient(#FFFFFF,#D9DFE6);color:#1A2230;border-radius:12px;box-shadow:0 7px 0 #8A96A4,0 9px 8px rgba(0,0,0,.4)}
.sk-key .dctl:active{transform:translateY(4px);box-shadow:0 3px 0 #8A96A4}
.sk-key.win .dcs{animation:dfxPress .3s ease-in-out 2}.sk-key.win .dcc:nth-child(2) .dcs{animation-delay:.1s}.sk-key.win .dcc:nth-child(3) .dcs{animation-delay:.2s}.sk-key.win .dcc:nth-child(4) .dcs{animation-delay:.3s}.sk-key.win .dcc:nth-child(5) .dcs{animation-delay:.4s}
@keyframes dfxPress{50%{transform:translateY(6px);box-shadow:inset 0 8px 12px #000,0 0 14px #5EC8FF}}
/* 🍣 迴轉 壽司：下面 輸送帶 一直 轉、格子 ＝ 盤子、方塊 ＝ 握壽司（白 飯＋魚）；過關 ＝ 輸送帶 加速 */
.sk-sushi{background:linear-gradient(#5A3A22,#3A2414)}
.sk-sushi .dcw{position:relative;padding:6px 6px 22px;border-radius:18px;background:repeating-linear-gradient(90deg,#B8B0A0 0 3px,#D8D2C4 3px 30px) 0 100%/100% 18px no-repeat;animation:dfxBelt 2.4s linear infinite}
@keyframes dfxBelt{to{background-position:60px 100%}}.sk-sushi.win .dcw{animation:dfxBelt .4s linear infinite}
.sk-sushi .dcs{border-style:solid;border-color:#2B5FA8;background:radial-gradient(ellipse at 50% 55%,#FFFFFF 0 52%,#2B5FA8 54% 60%,#F4F1EA 62%);border-radius:50%/42%;color:#3A1A10;box-shadow:0 5px 8px rgba(0,0,0,.4)}
.sk-sushi .dcs.fill{color:#3A1A10}
.sk-sushi .dctl{border-color:#E8502E;background:linear-gradient(#FF8A5C 0 48%,#FFFFFF 48% 52%,#FF8A5C 52% 58%,#FAF7EE 58%);color:#3A1A10;border-radius:22px 22px 12px 12px;box-shadow:0 6px 0 #C9BFA8,0 8px 8px rgba(0,0,0,.35)}
.sk-sushi .dctl:nth-child(3n+1){background:linear-gradient(#D0233A 0 50%,#FAF7EE 50%);border-color:#9A1428;color:#fff}.sk-sushi .dctl:nth-child(3n+2){background:linear-gradient(#FFD54A 0 50%,#1A1A1A 50% 58%,#FAF7EE 58%);border-color:#C99A00}
/* 🧱 積木：凸點 立體；過關 ＝ 一塊 一塊 蹦 起來 */
.sk-brick{background:linear-gradient(#2B4B8A,#152648)}
.sk-brick .dcs{border-style:solid;border-color:#3D7BFF;background:#0F1E40;border-radius:6px;box-shadow:inset 0 0 0 3px rgba(61,123,255,.3)}
.sk-brick .dctl{border-color:#C62828;background:linear-gradient(#FF6A5A,#E53935);color:#fff;border-radius:6px;box-shadow:inset 0 2px 0 rgba(255,255,255,.4),0 6px 0 #9A1C1C;overflow:visible!important}
.sk-brick .dctl:nth-child(4n+2){background:linear-gradient(#FFE07A,#FDD835);color:#3A2A00;border-color:#C9A800;box-shadow:inset 0 2px 0 rgba(255,255,255,.5),0 6px 0 #A88A00}.sk-brick .dctl:nth-child(4n+3){background:linear-gradient(#6FD08A,#2E9E4F);border-color:#1E7A3A;box-shadow:inset 0 2px 0 rgba(255,255,255,.4),0 6px 0 #1A6A32}
.sk-brick .dctl:before{content:'';position:absolute;top:-10px;left:18%;width:22%;height:10px;border-radius:6px 6px 0 0;background:inherit;box-shadow:inset 0 2px 0 rgba(255,255,255,.45);filter:brightness(1.05)}.sk-brick .dctl:after{content:'';position:absolute;top:-10px;right:18%;left:auto;width:22%;height:10px;border-radius:6px 6px 0 0;background:inherit;transform:none;animation:none;box-shadow:inset 0 2px 0 rgba(255,255,255,.45)}
.sk-brick.win .dcs{animation:dfxBrick .5s cubic-bezier(.3,1.8,.5,1) 2}@keyframes dfxBrick{40%{transform:translateY(-12px) scale(1.05)}}
/* 🫧 海底：泡泡 一直 往上 冒；格子 ＝ 泡泡；過關 ＝ 魚 游 過去 */
.sk-sea{background:linear-gradient(#0A4A6E,#04182A)}
.dfxbub{position:absolute;bottom:-20px;width:14px;height:14px;border-radius:50%;border:2px solid rgba(190,240,255,.7);background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.7),transparent 50%);animation:dfxBub 4.2s ease-in infinite;pointer-events:none}
@keyframes dfxBub{0%{transform:translateY(0) scale(.6);opacity:0}15%{opacity:1}100%{transform:translateY(-110%) translateY(-260px) scale(1.2);opacity:0}}.sk-sea>*:not(.dfxbub){position:relative}
.sk-sea .dcs{border-style:solid;border-color:#7FD4FF;border-radius:999px;background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.45),rgba(127,212,255,.1) 40%,rgba(4,24,42,.6));box-shadow:0 0 12px rgba(127,212,255,.4)}
.sk-sea .dctl{border-color:#00A58A;background:linear-gradient(#A8FFEA,#2BC9A8);color:#033A30;border-radius:999px;box-shadow:inset 0 2px 0 #fff,0 6px 0 #00705E}
.sk-sea.win:after{content:'🐠  🐟  🐡';position:absolute;left:-30%;top:40%;font-size:clamp(34px,5vh,52px);animation:dfxFish 1.6s ease-in-out;pointer-events:none}@keyframes dfxFish{to{left:110%}}
/* 🃏 魔法 卡牌：彩虹 全息 光、格子 ＝ 卡槽；過關 ＝ 一張 一張 翻 */
.sk-card{background:radial-gradient(circle at 50% 30%,#3A1A5A,#140822)}
.sk-card .dcs{border-style:solid;border-color:#B66BFF;background:repeating-linear-gradient(45deg,#1E1030 0 10px,#2A1640 10px 20px);border-radius:12px;box-shadow:0 0 12px rgba(182,107,255,.4)}
.sk-card .dctl{border-color:#7A3FD0;background:linear-gradient(120deg,#F3E6FF,#C9A6FF 40%,#FFD6F5 60%,#B6E0FF);background-size:250% 100%;color:#2A0E50;border-radius:12px;box-shadow:0 6px 0 #4A2280,0 0 14px rgba(182,107,255,.5);animation:dfxGem 3s ease-in-out infinite}
.sk-card.win .dcs.ok{animation:dfxFlip .6s 2}@keyframes dfxFlip{50%{transform:rotateY(180deg)}}

/* ══ 第四十二次：🎁 驚喜 7 種 玩法＋👑 傳說 寶箱＋寶箱 秒懂 動畫 ══ */
.dfxch2 .nm small{display:block;font-size:.6em;color:#FFE07A}
.dfxpl .pst{display:flex;align-items:center;justify-content:center;gap:clamp(12px,2vw,26px);width:auto;min-width:clamp(260px,40vw,560px);height:clamp(190px,30vh,300px)}
.dfxcd{width:clamp(110px,15vh,150px);height:clamp(150px,21vh,210px);border-radius:16px;border:4px solid #FFE07A;background:linear-gradient(135deg,#5E2BB8,#1E5BD8);color:#fff;font-size:44px;position:relative;cursor:pointer;animation:dfxDrop .6s cubic-bezier(.3,1.5,.5,1) both;transform-style:preserve-3d;transition:transform .6s}
.dfxcd .b{display:none;flex-direction:column;align-items:center;font-size:38px}.dfxcd .b b{font-size:32px;color:#FFE58A}.dfxcd.fl{transform:rotateY(180deg)}.dfxcd.fl .f{display:none}.dfxcd.fl .b{display:flex;transform:rotateY(180deg)}
.dfxcd.me{box-shadow:0 0 0 6px #FFE58A,0 0 40px #FFD54A}.dfxcd.dim2,.dfxbl.dim2{opacity:.5}
.dfxbl{background:none;border:0;display:flex;flex-direction:column;align-items:center;cursor:pointer;animation:dfxRise 2.2s ease-in-out infinite alternate}
.dfxbl .bl{font-size:clamp(80px,13vh,130px);filter:hue-rotate(calc(var(--h)*1deg)) drop-shadow(0 8px 6px rgba(0,0,0,.5))}.dfxbl .v{visibility:hidden;font-size:28px;color:#FFE58A}
.dfxbl.fl .bl{animation:dfxPop .35s forwards}.dfxbl.fl .v{visibility:visible}@keyframes dfxRise{to{transform:translateY(-22px)}}@keyframes dfxPop{60%{transform:scale(1.5)}100%{transform:scale(0);opacity:0}}
.dfxsc{position:relative;width:clamp(300px,42vw,460px);height:clamp(150px,22vh,200px);border-radius:18px;overflow:hidden;border:5px solid #FFE07A;background:linear-gradient(135deg,#FFF3B0,#FFC93C)}
.dfxsc .u{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:clamp(40px,7vh,64px);font-weight:900;color:#7A3B00}.dfxsc canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:pointer}
.dfxeg{background:none;border:0;position:relative;cursor:pointer;animation:dfxIdle 1.1s ease-in-out infinite}.dfxeg .e{font-size:clamp(130px,22vh,200px);display:block;filter:drop-shadow(0 0 20px #FFE07A)}
.dfxeg.c1{animation:dfxHit .3s}.dfxeg.c2 .e{filter:drop-shadow(0 0 30px #FFD54A) brightness(1.15)}.dfxeg.c3 .e{filter:drop-shadow(0 0 44px #FFF3B0) brightness(1.3);animation:dfxHit .25s infinite}
.dfxeg.c1 .ck,.dfxeg.c2 .ck,.dfxeg.c3 .ck{position:absolute;left:30%;top:40%;width:40%;height:4px;background:#5A3A10;transform:rotate(-12deg);box-shadow:0 14px 0 #5A3A10}
.dfxeg .e.dr{animation:dfxPz .7s cubic-bezier(.2,1.8,.4,1) both}
.dfxga{position:relative;width:clamp(200px,28vh,260px);height:clamp(220px,31vh,290px);border-radius:28px 28px 14px 14px;background:linear-gradient(#E53935,#9A1A1A);border:5px solid #FFE07A;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
.dfxga .gl{width:70%;border-radius:50%;background:rgba(255,255,255,.85);font-size:30px;line-height:1.3;padding:10px 0;text-align:center}
.dfxga .kn{width:70px;height:70px;border-radius:50%;border:5px solid #fff;background:#FFC93C;font-size:40px;color:#7A2E00;cursor:pointer}.dfxga .kn.sp{animation:dfxKn .6s}@keyframes dfxKn{to{transform:rotate(360deg)}}
.dfxga .cap{position:absolute;bottom:-50px;font-size:64px;opacity:0;cursor:pointer}.dfxga .cap.in{opacity:1;animation:dfxDrop .6s cubic-bezier(.3,1.5,.5,1) both}.dfxga .cap.op{animation:dfxPz .5s both}
.dfxrk{background:none;border:0;display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;touch-action:none}.dfxrk .r{font-size:clamp(110px,18vh,170px);transform:rotate(-45deg);display:block}
.dfxrk .pw{width:200px;height:18px;border-radius:9px;background:#22304A;border:3px solid #FFE07A;overflow:hidden}.dfxrk .pw i{display:block;height:100%;width:0;background:linear-gradient(90deg,#FFB300,#FF3D00)}
.dfxrk.sh .r{animation:dfxHit .15s infinite}.dfxrk.go .r{animation:dfxLaunch .8s ease-in forwards}@keyframes dfxLaunch{to{transform:translate(260px,-420px) rotate(-45deg) scale(.4);opacity:0}}
.dfxfw{position:absolute;font-size:120px;animation:dfxPz .7s both}
/* 👑 傳說 */
.dfxlg .dim{background:radial-gradient(circle at 50% 45%,rgba(255,200,60,.5),rgba(60,0,80,.85) 55%,rgba(0,0,0,.92))}
.dfxlg .lgn{font-size:clamp(34px,6vh,60px);background:linear-gradient(90deg,#FFE58A,#FF8AD8,#8AF0FF,#FFE58A);-webkit-background-clip:text;background-clip:text;color:transparent;background-size:300% 100%;animation:lgSh 2.4s linear infinite,dfxBan .6s both}
@keyframes lgSh{to{background-position:300% 0}}
.dfxlg .drop{width:clamp(240px,34vh,340px);height:clamp(220px,31vh,310px)}
.dfxlg .ring{position:absolute;left:50%;top:50%;width:150%;height:150%;transform:translate(-50%,-50%);border-radius:50%;border:8px solid transparent;background:conic-gradient(#FF5A8A,#FFD54A,#5EF0B0,#5E9BFF,#FF5A8A) border-box;-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 9px),#000 0);mask:radial-gradient(farthest-side,transparent calc(100% - 9px),#000 0);animation:dfxSpin 2.6s linear infinite;opacity:.9}
.dfxlg .rays{opacity:.8;background:repeating-conic-gradient(rgba(255,230,140,.85) 0 7deg,transparent 7deg 18deg);animation:dfxSpin 6s linear infinite}
.dfxlg .bx{filter:drop-shadow(0 0 40px #FFD54A) drop-shadow(0 0 80px #FF8AD8)}
.dfxlg .lgfw{position:absolute;inset:0;pointer-events:none}.dfxlg .lgb{position:absolute;font-size:clamp(40px,7vh,70px);animation:lgB 1.4s ease-out infinite}@keyframes lgB{0%{transform:scale(.2);opacity:0}40%{opacity:1}100%{transform:scale(1.6);opacity:0}}
.dfxlg .lgrain{position:absolute;top:-60px;font-size:40px;animation:lgR 1.9s ease-in forwards;pointer-events:none}@keyframes lgR{to{transform:translateY(115vh) rotate(540deg)}}
.dfxlg .lgw{min-height:1.2em;font-size:clamp(22px,3.4vh,34px);color:#fff;text-shadow:0 2px 8px #000}
.dfxlg .pz{font-size:clamp(60px,11vh,110px)}
/* 🎁 寶箱 秒懂 動畫 */
.dfxin{position:fixed;inset:0;z-index:9250;background:rgba(4,8,22,.94);display:flex;align-items:center;justify-content:center;padding:12px}
.dfxin .ib{width:min(980px,96vw);max-height:96vh;overflow:auto;background:linear-gradient(#17244A,#0C1430);border:4px solid #FFD54A;border-radius:24px;padding:clamp(12px,2vh,24px);text-align:center;color:#fff}
.dfxin .ip{font-size:20px;color:#9FB0C8}.dfxin .ih{font-size:clamp(30px,5vh,48px);font-weight:900;color:#FFE58A;animation:dfxBan .5s both}
.dfxin .iv{min-height:clamp(160px,26vh,250px);display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;margin:10px 0}
.dfxin .it{font-size:clamp(22px,3.2vh,32px);font-weight:700;line-height:1.5;animation:dfxBan .6s .6s both}
.dfxin .ich{display:inline-block;width:clamp(70px,10vh,100px)}.dfxin .ich svg{width:100%;height:auto;display:block}
.dfxin .i1{display:flex;gap:10px}.dfxin .sl{display:inline-block;min-width:80px;padding:10px 14px;border-radius:12px;background:#2E7D32;border:3px solid #7BF0A8;font-size:28px;animation:dfxDrop .5s both}
.dfxin .i1 .sl:nth-child(2){animation-delay:.4s}.dfxin .i1 .sl:nth-child(3){animation-delay:.8s}.dfxin .i1 .sl:nth-child(4){animation-delay:1.2s}
.dfxin .itm{width:220px;height:16px;border-radius:8px;background:#22304A;overflow:hidden}.dfxin .itm i{display:block;height:100%;background:#36D27A;animation:inTm 2.4s linear both}@keyframes inTm{from{width:100%}to{width:35%}}
.dfxin .i1c{animation:dfxDrop .8s 2.2s cubic-bezier(.3,1.5,.5,1) both}
.dfxin .i2{display:flex;align-items:flex-end;gap:clamp(8px,1.6vw,20px)}.dfxin .i2 span{display:flex;flex-direction:column;align-items:center;gap:4px;background:#1E2E52;border-radius:14px;padding:10px;animation:dfxDrop .6s both;font-size:22px}
.dfxin .i2 span:nth-child(1){height:120px;animation-delay:.2s}.dfxin .i2 span:nth-child(2){height:160px;animation-delay:.9s}.dfxin .i2 span:nth-child(3){height:200px;animation-delay:1.6s}.dfxin .i2 span:nth-child(4){height:240px;animation-delay:2.3s}
.dfxin .i2 em{font-style:normal;font-size:48px}.dfxin .i2 small{font-size:18px;color:#FFE58A}.dfxin .i2 .lg{border:3px solid #FFD54A;box-shadow:0 0 26px #FFD54A}
.dfxin .i3{display:flex;align-items:center;gap:10px}.dfxin .sl.x{background:#7A1A1A;border-color:#FF8A80;animation:inX 1s both}.dfxin .i3 .sl.x:nth-child(2){animation-delay:.3s}.dfxin .i3 .sl.x:nth-child(3){animation-delay:.6s}
@keyframes inX{0%{transform:translate(-120px,-80px) rotate(-30deg);opacity:0}70%{transform:rotate(8deg)}100%{transform:none;opacity:1}}
.dfxin .no{font-size:70px;animation:dfxPz .5s 1.3s both}.dfxin .nob{position:relative;opacity:.55;animation:dfxBan .5s 1.8s both}.dfxin .nob b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:60px}
.dfxin .i4 span{font-size:clamp(50px,8vh,76px);display:inline-block;animation:dfxPz .6s both}
.dfxin .ic{margin-top:6px}.dfxin .igo{margin-top:12px;min-height:64px;min-width:280px;border-radius:18px;border:3px solid #4A5A6E;background:#1A2230;color:#8C9AAE;font:inherit;font-size:clamp(22px,3vh,30px);font-weight:700}
.dfxin .igo.rdy{border-color:#7BF0A8;background:linear-gradient(#36D27A,#1E9E55);color:#06210F;box-shadow:0 0 22px rgba(57,217,138,.75);cursor:pointer}
@media (prefers-reduced-motion:reduce){.dfxban,.dfxban .i,.dfxch2 *,.dfxpt,.dcbox.dfx *,.dfxbub,.dfxstar{animation:none!important}}
`;
module.exports = { CSS, JS: '\n/* ══ 🎁🧩👻 拖曳題 不 無聊（g3mid/_dragfx.js）══ */\nvar DFX=(' + DFXSRC.toString() + ')();\n', DFXSRC };
