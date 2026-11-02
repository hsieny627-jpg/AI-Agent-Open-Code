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
  D.ghost = function () { try { var a = JSON.parse(localStorage.getItem(D.gk()) || '[]'); if (a.length < 2) return 0; return a.reduce(function (x, y) { return x + y; }, 0) / a.length; } catch (e) { return 0; } };
  D.ghostAdd = function (v) { try { var a = JSON.parse(localStorage.getItem(D.gk()) || '[]'); a.push(Math.round(v * 10) / 10); localStorage.setItem(D.gk(), JSON.stringify(a.slice(-5))); } catch (e) { } };
  D.race = function (box, n) { var g = D.ghost(), o = H('div', 'dfxrc' + (g ? '' : ' none'), g ?
      '<div class="lab">🏁 跟 <b>上次 的 自己</b> 賽跑：🏃 比 👻 先 到 🏁 ＝ 贏！</div><div class="trk"><span class="ln"></span><span class="gh"><span class="f">👻</span><i>上次 的 你</i></span><span class="me"><span class="f">🏃</span><i>你</i></span><span class="fl">🏁</span></div>'
      : '<div class="lab">🏁 做 2 題 以後，<b>👻 上次 的 你</b> 會 出來 跟 你 賽跑</div>');
    var b = box.querySelector('.dfxban'); if (b && b.nextSibling) box.insertBefore(o, b.nextSibling); else box.insertBefore(o, box.firstChild);
    box._rc = { n: n, g: g, el: o, t0: 0, done: 0 }; return o; };
  D.raceGo = function (box) { var R0 = box && box._rc; if (!R0 || !R0.g || R0.t0) return; R0.t0 = Date.now(); var gh = R0.el.querySelector('.gh');
    gh.style.transition = 'left ' + (R0.g * R0.n).toFixed(1) + 's linear'; void gh.offsetWidth; gh.style.left = 'calc(100% - 3.4em)';
    R0.tm = setTimeout(function () { if (!R0.done) R0.el.classList.add('ghw'); }, R0.g * R0.n * 1000); };
  D.raceSet = function (box, k) { var R0 = box && box._rc; if (!R0 || !R0.g) return; var me = R0.el.querySelector('.me'); me.style.left = 'calc((100% - 3.4em) * ' + (k / R0.n).toFixed(3) + ')'; me.classList.remove('hop'); void me.offsetWidth; me.classList.add('hop'); };
  /* 全對 才 叫：回傳 true ＝ 贏 了 上次 的 自己 */
  D.raceEnd = function (box, avg) { var R0 = box && box._rc; D.ghostAdd(avg); if (!R0 || !R0.g) return false; R0.done = 1; clearTimeout(R0.tm); var gh = R0.el.querySelector('.gh'), cs = getComputedStyle(gh).left; gh.style.transition = 'none'; gh.style.left = cs;
    var won = avg < R0.g; R0.el.classList.add(won ? 'won' : 'lost'); var lab = R0.el.querySelector('.lab'); lab.innerHTML = won ? '🏆 你 贏了 上次 的 自己！<b>＋200</b>' : '👻 這次 上次 的 你 比較 快，下一題 追 回來！'; return won; };

  /* ── 🎁 難題 寶箱（全對 以後 才 掉）── */
  D.TIER = [['wood', '木頭 寶箱'], ['silver', '銀 寶箱'], ['gold', '金 寶箱'], ['rainbow', '💎 彩虹 寶箱']];
  D.PTS = [400, 900, 1800, 3500];
  /* 難度 ＝ 格子 數 ＋ 多 的 錯 方塊 數 ＋（記憶 解碼 沒 偷看 ＋3）；機會、稀有度、獎勵 都 跟著 難度 變 大 */
  D.drop = function (diff) { var ch = diff <= 4 ? 0 : diff === 5 ? .25 : diff === 6 ? .45 : diff === 7 ? .6 : diff === 8 ? .75 : .9; if (rnd() >= ch) return null;
    var x = rnd(), t = diff >= 9 ? (x < .35 ? 3 : 2) : diff >= 8 ? (x < .12 ? 3 : x < .6 ? 2 : 1) : diff >= 7 ? (x < .35 ? 2 : 1) : diff >= 6 ? (x < .4 ? 1 : 0) : 0;
    return { t: t, p: Math.round(D.PTS[t] * (1 + Math.max(0, diff - 5) * .15) / 50) * 50 }; };
  D.CHEST = function (t, open) { var C = [['#8D5A2B', '#5E3A17', '#C99A5B'], ['#AEB8C4', '#6E7A86', '#E6EEF6'], ['#F5B829', '#9A6B00', '#FFE58A'], ['#B66BFF', '#3A6BFF', '#7CFFE0']][t];
    var g = '<defs><linearGradient id="dfxS' + t + '" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>' + (t === 3 ? '<linearGradient id="dfxRb" x1="0" x2="1"><stop offset="0" stop-color="#FF5A8A"/><stop offset=".33" stop-color="#FFD54A"/><stop offset=".66" stop-color="#5EF0B0"/><stop offset="1" stop-color="#5E9BFF"/></linearGradient>' : '') + '</defs>';
    var f = t === 3 ? 'url(#dfxRb)' : C[0];
    return '<svg viewBox="0 0 64 56" aria-hidden="true">' + g + (open ? '<path d="M32 28 L4 -6 L60 -6 Z" fill="#FFF6C0" opacity=".9"/>' : '') +
      '<rect x="6" y="24" width="52" height="28" rx="4" fill="' + f + '" stroke="' + C[1] + '" stroke-width="3"/><rect x="6" y="24" width="52" height="28" rx="4" fill="url(#dfxS' + t + ')"/>' +
      '<rect x="6" y="34" width="52" height="5" fill="' + C[1] + '" opacity=".55"/><rect x="14" y="24" width="5" height="28" fill="' + C[1] + '" opacity=".4"/><rect x="45" y="24" width="5" height="28" fill="' + C[1] + '" opacity=".4"/>' +
      (open ? '<path d="M6 22 Q32 2 58 22 L58 16 Q32 -4 6 16 Z" fill="' + f + '" stroke="' + C[1] + '" stroke-width="3" transform="rotate(-28 6 22)"/>'
        : '<path d="M6 24 Q6 8 32 8 Q58 8 58 24 Z" fill="' + f + '" stroke="' + C[1] + '" stroke-width="3"/><path d="M6 24 Q6 8 32 8 Q58 8 58 24 Z" fill="url(#dfxS' + t + ')"/>') +
      '<rect x="27" y="' + (open ? 26 : 20) + '" width="10" height="13" rx="2" fill="' + C[2] + '" stroke="' + C[1] + '" stroke-width="2"/></svg>'; };
  /* 掉 下來 ➜ 點 3 下 打開；ctl.done(加 幾分) */
  D.chest = function (dr, diff, why, done) { if (!dr) { done(0); return; } D.open++; var t = dr.t, tap = 0, fin = 0;
    var o = H('div', 'dfxch2 ch-' + D.TIER[t][0], '<div class="dim"></div><div class="why">🔥 難題 <b>' + why + '</b> 一次 全對！</div><div class="drop"><div class="rays"></div><div class="bx">' + D.CHEST(t, 0) + '</div></div>' +
      '<div class="nm">🎁 ' + D.TIER[t][1] + ' 掉 下來 了！</div><div class="tap">👆 點 寶箱 3 下 打開！ <span class="d"><i></i><i></i><i></i></span></div><div class="pz"></div>');
    document.body.appendChild(o); var bx = o.querySelector('.bx'), dots = o.querySelectorAll('.tap i');
    function openIt() { if (fin) return; fin = 1; clearTimeout(au); o.classList.add('op'); bx.innerHTML = D.CHEST(t, 1); o.querySelector('.tap').style.visibility = 'hidden';
      for (var i = 0; i < (t >= 2 ? 22 : 14); i++) { var cn = H('span', 'dfxcn', t === 3 && i % 2 ? '💎' : '🪙'); cn.style.setProperty('--a', (i * (360 / (t >= 2 ? 22 : 14))) + 'deg'); cn.style.setProperty('--r', (120 + (i % 3) * 40) + 'px'); cn.style.animationDelay = (i * 22) + 'ms'; o.querySelector('.drop').appendChild(cn); }
      var pz = o.querySelector('.pz'); pz.innerHTML = '🪙 ＋' + dr.p + '<small>遊戲 積分</small>';
      setTimeout(function () { o.classList.add('out'); setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); done(dr.p); }, 380); }, window.__NOGO ? 40 : 2200); }
    bx.onclick = function () { if (fin) return; tap++; if (dots[tap - 1]) dots[tap - 1].classList.add('on'); bx.classList.remove('hit'); void bx.offsetWidth; bx.classList.add('hit', 'h' + Math.min(3, tap)); if (tap >= 3) setTimeout(openIt, 250); };
    var au = setTimeout(openIt, 6000); };
  return D;
}
const CSS = `
/* ══ 拖曳題（g3mid/_dragfx.js）2026-11-02 第四十次 重做 ══ */
.dfxban{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px 14px;margin:0 auto 4px;font-size:clamp(20px,2.8vh,28px);font-weight:700;color:#FFE9A8;text-shadow:0 2px 8px rgba(0,0,0,.6);animation:dfxBan .6s cubic-bezier(.2,1.5,.4,1) both}
.dfxban .i{font-size:1.5em;line-height:1;display:inline-block;animation:dfxBob 1.6s ease-in-out infinite;filter:drop-shadow(0 4px 4px rgba(0,0,0,.5))}
@keyframes dfxBan{from{opacity:0;transform:translateY(-14px) scale(.7)}to{opacity:1;transform:none}}@keyframes dfxBob{50%{transform:translateY(-4px) rotate(-6deg)}}
.dcbox.dfx{position:relative;border-radius:26px;padding:6px 8px 10px;overflow:hidden}
/* 🏁 跑道 */
.dfxrc{width:min(860px,100%);margin:0 auto 6px;text-align:center}.dfxrc .lab{font-size:clamp(17px,2.3vh,23px);color:#FFE9A8;font-weight:700}.dfxrc .lab b{color:#fff}
.dfxrc.none .lab{color:#BFD3E6;font-weight:400}
.dfxrc .trk{position:relative;height:clamp(52px,7vh,70px);margin-top:4px;border-radius:999px;background:linear-gradient(#3E2A1A,#2A1C10);box-shadow:inset 0 4px 10px rgba(0,0,0,.6),0 2px 0 rgba(255,255,255,.08)}
.dfxrc .ln{position:absolute;left:14px;right:14px;top:50%;border-top:3px dashed rgba(255,255,255,.35)}
.dfxrc .gh,.dfxrc .me{position:absolute;left:0;display:flex;flex-direction:column;align-items:center;line-height:1;width:3.4em}
.dfxrc .gh{top:0;opacity:.75}.dfxrc .me{bottom:0;transition:left .45s cubic-bezier(.3,1.5,.5,1)}
.dfxrc .f{font-size:clamp(24px,3.4vh,34px)}.dfxrc .gh .f{filter:drop-shadow(0 0 6px #BFE8FF)}.dfxrc .me .f{transform:scaleX(-1)}
.dfxrc i{font-style:normal;font-size:clamp(11px,1.5vh,14px);color:#fff;background:rgba(0,0,0,.5);border-radius:8px;padding:0 4px;white-space:nowrap}
.dfxrc .me.hop .f{animation:dfxHop .4s}@keyframes dfxHop{40%{transform:scaleX(-1) translateY(-10px)}}
.dfxrc .fl{position:absolute;right:6px;top:50%;transform:translateY(-50%);font-size:clamp(26px,3.6vh,36px)}
.dfxrc.won .trk{box-shadow:0 0 0 4px #FFD54A,0 0 24px #FFD54A}.dfxrc.won .lab{color:#FFD54A;font-size:clamp(20px,2.8vh,28px)}.dfxrc.ghw .gh .f{animation:dfxBob .8s infinite}
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
@media (prefers-reduced-motion:reduce){.dfxban,.dfxban .i,.dfxch2 *,.dfxpt,.dcbox.dfx *,.dfxbub,.dfxstar{animation:none!important}}
`;
module.exports = { CSS, JS: '\n/* ══ 🎁🧩👻 拖曳題 不 無聊（g3mid/_dragfx.js）══ */\nvar DFX=(' + DFXSRC.toString() + ')();\n', DFXSRC };
