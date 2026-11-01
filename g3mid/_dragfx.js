/* g3mid/_dragfx.js — 拖曳題 不 無聊（2026-11-01 第三十九次 第 1 點；三年級 g3mid、四年級 midterm 共用；跟 _decode.js 一起 進 網頁）
 *
 * 老師：三年級、四年級 期中複習，只要 有 拖曳 題目，一律 加上
 *   🎁 神秘 方塊：每一題 隨機 1 個 方塊 是 寶箱，放對 ＝ 打開（🪙、這一題 ✖2、1 秒 透視 一格 …）
 *   🧩 每一題 換 一種 樣子：格子 輪流 變成 火車 車廂、太空艙、寶石、鍵盤 …（同樣 拖曳，外觀 每一題 不一樣）
 *   ＋ 我 建議 的 其他 元素：👻 跟 自己 的 影子 賽跑（只 跟 自己 比）、寶箱 稀有度（木／銀／金／💎 彩虹）、🔥 連對 火焰 小 HUD、每一種 樣子 自己 的 過關 特效
 * 公平（第三十七次 第 9 點 照舊）：寶箱、影子 只 給「遊戲 積分」（🔓 解碼 積分／🎁 寶箱 金幣），**老師看板 的 100 分 只 看 放對 幾個**，不會 因為 運氣 加分 或 扣分；
 *   打開 寶箱 的 動畫 演 的 時候 倒數 停住（不 吃 作答 時間）。
 * 用 在：🔓 句子 解碼（g3mid、midterm `decRender`：寶箱＋樣子＋影子）、🌱 皮克敏 搬字（寶箱＋樣子）、📋 資料表 小幫手（寶箱＋樣子）。教學（#dcl）不 加。
 * 量測 window.__NODFX ＝ 1 ＝ 全部 不 加（舊 量測 用）；window.__DFXR ＝ 0～1 ＝ 固定 隨機（量測 用）。 */
function DFXSRC() {
  var D = { n: 0, off: -1, gold: 0, open: 0 };
  function rnd() { return window.__DFXR != null ? +window.__DFXR : Math.random(); }
  function H(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  D.on = function (el) { return !window.__NODFX && !(el && el.closest && el.closest('#dcl')); };
  /* ── 🧩 樣子：8 種，一題 換 一種（一回 開始 隨機 從 第幾種 起）── */
  D.SK = [['train', '🚂', '解碼 列車', '💨'], ['rocket', '🚀', '太空艙 發射', '🔥'], ['gem', '💎', '寶石 鑲嵌', '✨'], ['key', '⌨️', '魔法 鍵盤', '🎵'],
    ['sushi', '🍣', '迴轉 壽司', '🍙'], ['brick', '🧱', '積木 城堡', '⭐'], ['sea', '🫧', '海底 泡泡', '🐠'], ['card', '🃏', '魔法 卡牌', '🌟']];
  D.round = function () { var r = window.R; if (D.rr !== r) { D.rr = r; D.n = 0; D.off = Math.floor(rnd() * D.SK.length); D.gold = 0; D.open = 0; } };
  /* 舞台 是 同一個 元素（皮克敏、資料表）➜ 換 題目 先 把 上一題 的 樣子 拿掉 */
  D.clean = function (box) { if (!box) return; [].slice.call(box.classList).forEach(function (c) { if (/^sk-|^dfx/.test(c) || c === 'win') box.classList.remove(c); }); box._sk = null; };
  D.skin = function (box) { D.clean(box); if (!D.on(box)) return null; D.round(); var s = D.SK[(D.off + D.n) % D.SK.length]; D.n++;
    box.classList.add('dfx', 'sk-' + s[0]); var b = H('div', 'dfxban', '<span class="i">' + s[1] + '</span>' + s[2]); box.insertBefore(b, box.firstChild); box._sk = s; return s; };
  /* 過關：這一種 樣子 自己 的 特效（不 移動 英文，唸 的 時候 照樣 看得清楚）*/
  D.win = function (box) { if (!box || !box._sk) return; var s = box._sk; box.classList.add('win'); var r = box.getBoundingClientRect();
    for (var i = 0; i < 12; i++) { var p = H('span', 'dfxpt', i % 3 ? s[3] : s[1]); p.style.left = (r.left + r.width * (.08 + .84 * (i / 11))) + 'px'; p.style.top = (r.top + r.height * .45) + 'px';
      p.style.setProperty('--dx', (Math.round((rnd() - .5) * 160)) + 'px'); p.style.setProperty('--dy', (-80 - Math.round(rnd() * 160)) + 'px'); p.style.animationDelay = (i * 40) + 'ms'; document.body.appendChild(p);
      (function (p) { setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 1700); })(p); }
    setTimeout(function () { box.classList.remove('win'); }, 1600); };
  /* ── 🎁 神秘 寶箱：稀有度 木 55%／銀 28%／金 13%／💎 彩虹 4%；愈 稀有 獎品 愈 好 ── */
  D.TIER = [['wood', '木頭 寶箱', .55], ['silver', '銀 寶箱', .28], ['gold', '金 寶箱', .13], ['rainbow', '💎 彩虹 寶箱', .04]];
  D.pickTier = function () { var x = rnd(), a = 0; for (var i = 0; i < D.TIER.length; i++) { a += D.TIER[i][2]; if (x < a) return i; } return 0; };
  D.mark = function (el, tier) { el.classList.add('dfxch', 'ch-' + D.TIER[tier][0]); el._ch = tier; el.appendChild(H('i', 'dfxbg', D.CHEST(tier, 0))); };
  /* 寶箱 圖（SVG）：箱子＋蓋子（open ＝ 蓋子 掀開、光 射出來）*/
  D.CHEST = function (t, open) { var C = [['#8D5A2B', '#5E3A17', '#C99A5B'], ['#AEB8C4', '#6E7A86', '#E6EEF6'], ['#F5B829', '#9A6B00', '#FFE58A'], ['#B66BFF', '#3A6BFF', '#7CFFE0']][t];
    var g = t === 3 ? '<defs><linearGradient id="dfxRb" x1="0" x2="1"><stop offset="0" stop-color="#FF5A8A"/><stop offset=".33" stop-color="#FFD54A"/><stop offset=".66" stop-color="#5EF0B0"/><stop offset="1" stop-color="#5E9BFF"/></linearGradient></defs>' : '';
    var f = t === 3 ? 'url(#dfxRb)' : C[0];
    return '<svg viewBox="0 0 64 56" aria-hidden="true">' + g + (open ? '<path d="M32 26 L10 0 L54 0 Z" fill="#FFF6C0" opacity=".85"/>' : '') +
      '<rect x="6" y="24" width="52" height="28" rx="4" fill="' + f + '" stroke="' + C[1] + '" stroke-width="3"/>' +
      '<rect x="6" y="34" width="52" height="5" fill="' + C[1] + '" opacity=".55"/>' +
      (open ? '<path d="M6 22 Q32 2 58 22 L58 16 Q32 -4 6 16 Z" fill="' + f + '" stroke="' + C[1] + '" stroke-width="3" transform="rotate(-24 6 22)"/>'
        : '<path d="M6 24 Q6 8 32 8 Q58 8 58 24 Z" fill="' + f + '" stroke="' + C[1] + '" stroke-width="3"/>') +
      '<rect x="27" y="' + (open ? 26 : 20) + '" width="10" height="13" rx="2" fill="' + C[2] + '" stroke="' + C[1] + '" stroke-width="2"/></svg>'; };
  /* 獎品 表：k ＝ 'pts' 加 遊戲 積分、'x' 這一題 ✖N、'see' 透視 一格、'shield' 盾牌；解碼 以外 的 遊戲 只 給 🪙 */
  D.PRZ = [
    [['pts', 200, '🪙 ＋200'], ['pts', 300, '🪙 ＋300'], ['see', 0, '🔦 透視 一格'], ['shield', 0, '🛡 盾牌']],
    [['pts', 400, '🪙 ＋400'], ['x', 2, '🔥 這一題 ✖2'], ['see', 0, '🔦 透視 一格'], ['shield', 0, '🛡 盾牌']],
    [['pts', 800, '🪙 ＋800'], ['x', 2, '🔥 這一題 ✖2'], ['pts', 600, '🪙 ＋600']],
    [['x', 3, '🌈 這一題 ✖3'], ['pts', 1500, '🪙 ＋1500']]];
  D.COIN = [[100, 150], [250, 300], [500, 600], [1000, 1200]];
  /* 打開：pos ＝ 打開 的 那一格（動畫 從 那裡 跳 出來）；dec ＝ 解碼（有 積分、透視）；pause/go ＝ 倒數 停／走；done(prize) */
  D.openAt = function (pos, tier, dec, ctl) { var pz; if (dec) { var L = D.PRZ[tier]; pz = L[Math.floor(rnd() * L.length)]; if (pz[0] === 'see' && !(ctl && ctl.canSee && ctl.canSee())) pz = ['pts', tier ? 400 : 250, '🪙 ＋' + (tier ? 400 : 250)]; }
    else { var c = D.COIN[tier]; var v = c[Math.floor(rnd() * c.length)]; pz = ['gold', v, '🪙 ＋' + v]; }
    D.open++; if (ctl && ctl.pause) ctl.pause();
    var r = pos.getBoundingClientRect(), o = H('div', 'dfxop ch-' + D.TIER[tier][0], '<div class="rays"></div><div class="bx">' + D.CHEST(tier, 1) + '</div><div class="nm">🎁 ' + D.TIER[tier][1] + '</div><div class="pz">' + pz[2] + '</div>');
    o.style.left = Math.max(150, Math.min(innerWidth - 150, r.left + r.width / 2)) + 'px'; o.style.top = Math.max(150, Math.min(innerHeight - 170, r.top + r.height / 2 - 40)) + 'px'; document.body.appendChild(o);
    for (var i = 0; i < (tier === 3 ? 18 : 10); i++) { var cn = H('span', 'dfxcn', tier === 3 && i % 2 ? '💎' : '🪙'); cn.style.setProperty('--a', (i * (360 / (tier === 3 ? 18 : 10))) + 'deg'); cn.style.animationDelay = (380 + i * 25) + 'ms'; o.appendChild(cn); }
    var ms = window.__NOGO ? 30 : 1500; setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); if (ctl && ctl.go) ctl.go(); if (ctl && ctl.done) ctl.done(pz); }, ms);
    return pz; };
  /* 🎁 小 HUD：打開 幾個、🪙 */
  D.chip = function (box, html) { var c = box.querySelector('.dfxhud'); if (!c) { c = H('div', 'dfxhud'); var b = box.querySelector('.dfxban'); if (b) b.appendChild(c); else box.insertBefore(c, box.firstChild); } c.innerHTML = html; };
  /* ── 👻 跟 自己 的 影子 賽跑（解碼）：影子 ＝ 你 前 5 題 平均 每一格 幾 秒；這一題 比 影子 快 ＝ 超越！（只 跟 自己 比）── */
  D.gk = function () { var A = window.DEC && DEC.A; return 'dfx_gh_' + (location.pathname.indexOf('midterm') >= 0 ? 'g4' : 'g3') + '_' + ((A && A.sid && A.sid()) || '0'); };
  D.ghost = function () { try { var a = JSON.parse(localStorage.getItem(D.gk()) || '[]'); if (a.length < 2) return 0; return a.reduce(function (x, y) { return x + y; }, 0) / a.length; } catch (e) { return 0; } };
  D.ghostAdd = function (v) { try { var a = JSON.parse(localStorage.getItem(D.gk()) || '[]'); a.push(Math.round(v * 10) / 10); localStorage.setItem(D.gk(), JSON.stringify(a.slice(-5))); } catch (e) { } };
  return D;
}
const CSS = `
/* ══ 2026-11-01 第三十九次 第 1 點：🎁 神秘 寶箱、🧩 每一題 換 樣子、👻 影子（g3mid/_dragfx.js）══ */
.dfxban{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px 14px;margin:0 auto 4px;font-size:clamp(20px,2.8vh,28px);font-weight:700;color:#FFE9A8;animation:dfxBan .6s cubic-bezier(.2,1.5,.4,1) both}
.dfxban .i{font-size:1.4em;line-height:1;display:inline-block;animation:dfxBob 1.6s ease-in-out infinite}
@keyframes dfxBan{from{opacity:0;transform:translateY(-14px) scale(.7)}to{opacity:1;transform:none}}@keyframes dfxBob{50%{transform:translateY(-4px) rotate(-6deg)}}
.dfxhud{display:inline-flex;gap:10px;font-size:clamp(18px,2.4vh,24px);color:#fff;background:rgba(0,0,0,.35);border:2px solid rgba(255,255,255,.18);border-radius:999px;padding:0 12px}
.dfxhud b{color:#FFD54A}
/* 🎁 寶箱 方塊：方塊 右上角 一個 小 寶箱、金光 一閃 一閃（文字 照樣 清楚）*/
.dctl.dfxch,.wd.dfxch,.tile9.dfxch{position:relative;overflow:visible}
.dfxbg{position:absolute;right:-16px;top:-22px;width:clamp(40px,5.6vh,56px);pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.5));animation:dfxWig 1.4s ease-in-out infinite}
.dfxbg svg{display:block;width:100%;height:auto}
@keyframes dfxWig{0%,70%,100%{transform:rotate(0)}76%{transform:rotate(-14deg)}84%{transform:rotate(12deg)}92%{transform:rotate(-6deg)}}
.dctl.dfxch{box-shadow:0 0 0 4px rgba(255,213,74,.55),0 0 18px rgba(255,213,74,.6),0 6px 0 #9A6B00;animation:dfxGlow 1.6s ease-in-out infinite}
.dctl.dfxch.ch-rainbow{box-shadow:0 0 0 4px #B66BFF,0 0 22px #7CFFE0,0 6px 0 #5A2A9A}
@keyframes dfxGlow{50%{box-shadow:0 0 0 6px rgba(255,213,74,.85),0 0 30px rgba(255,213,74,.9),0 6px 0 #9A6B00}}
.dcs.dfxhold{box-shadow:0 0 0 3px rgba(255,213,74,.7) inset}
/* 打開 寶箱 */
.dfxop{position:fixed;z-index:9300;transform:translate(-50%,-50%);width:300px;text-align:center;pointer-events:none;animation:dfxIn .45s cubic-bezier(.2,1.6,.4,1) both,dfxOut .35s 1.15s ease-in forwards}
.dfxop .bx{width:120px;margin:0 auto;animation:dfxShake .35s 2 ease-in-out}.dfxop .bx svg{display:block;width:100%;height:auto}
.dfxop .rays{position:absolute;left:50%;top:60px;width:260px;height:260px;transform:translate(-50%,-50%);background:repeating-conic-gradient(rgba(255,240,170,.75) 0 10deg,transparent 10deg 24deg);border-radius:50%;-webkit-mask:radial-gradient(circle,#000 30%,transparent 70%);mask:radial-gradient(circle,#000 30%,transparent 70%);animation:dfxRay 1.5s linear both;z-index:-1}
.dfxop.ch-rainbow .rays{background:repeating-conic-gradient(#FF5A8A 0 8deg,#FFD54A 8deg 16deg,#5EF0B0 16deg 24deg,#5E9BFF 24deg 32deg,transparent 32deg 40deg)}
.dfxop .nm{margin-top:4px;font-size:24px;font-weight:700;color:#fff;text-shadow:0 2px 6px #000}
.dfxop .pz{display:inline-block;margin-top:4px;padding:4px 20px;border-radius:999px;background:linear-gradient(#FFE58A,#F5B829);color:#3A2600;font-size:34px;font-weight:900;box-shadow:0 6px 18px rgba(0,0,0,.5);animation:dfxPz .5s .35s cubic-bezier(.2,1.8,.4,1) both}
.dfxop.ch-rainbow .pz{background:linear-gradient(90deg,#FF8AB0,#FFE07A,#8CF5C8,#8CB8FF)}
.dfxcn{position:absolute;left:50%;top:60px;font-size:30px;animation:dfxCn .9s ease-out both}
@keyframes dfxCn{0%{transform:translate(-50%,-50%) rotate(var(--a)) translateY(0);opacity:1}100%{transform:translate(-50%,-50%) rotate(var(--a)) translateY(-130px);opacity:0}}
@keyframes dfxIn{from{opacity:0;transform:translate(-50%,-50%) scale(.3)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}@keyframes dfxOut{to{opacity:0;transform:translate(-50%,-80%) scale(.8)}}
@keyframes dfxShake{25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}@keyframes dfxRay{from{transform:translate(-50%,-50%) rotate(0) scale(.4)}to{transform:translate(-50%,-50%) rotate(90deg) scale(1)}}@keyframes dfxPz{from{transform:scale(0)}to{transform:none}}
/* 🔦 透視：那一格 淡淡 出現 正確 的 中文 1 秒 */
.dcs .dfxsee{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#7CFFE0;opacity:.85;font-size:inherit;text-shadow:0 0 10px #00E0B0;pointer-events:none;animation:dfxSee 1.2s ease-in-out both}
.dcs{position:relative}@keyframes dfxSee{0%,100%{opacity:0}20%,80%{opacity:.9}}
/* 過關 特效 */
.dfxpt{position:fixed;z-index:9250;font-size:clamp(30px,4.6vh,46px);pointer-events:none;animation:dfxPt 1.4s ease-out both}
@keyframes dfxPt{0%{transform:translate(-50%,-50%) scale(.3);opacity:0}20%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(.8);opacity:0}}
/* ── 🧩 8 種 樣子（框 的 粗細、大小 都 不變；只 換 顏色、形狀、裝飾；放對／放錯 的 綠／紅 永遠 最 優先）── */
.dcbox.dfx .dcs{transition:border-color .15s,background .15s,transform .15s,border-radius .2s}
.dcbox.dfx .dcs.ok{border-color:#2BD46A!important;background:#0F3A1F!important;color:#BFFFD0!important}
.dcbox.dfx .dcs.no{border-color:#FF5A5A!important;background:#3A1010!important;color:#FFC2C2!important}
.dcbox.dfx .dcs.hot,.dcbox.dfx .dcs.sel{border-color:#5EC8FF!important;border-style:solid!important}
/* 🚂 火車：格子 ＝ 車廂（下面 兩個 輪子），整排 下面 一條 鐵軌，最 前面 一個 火車頭 */
.sk-train .dcw{background:linear-gradient(transparent calc(100% - 10px),#6B5A4A calc(100% - 10px),#6B5A4A calc(100% - 6px),transparent calc(100% - 6px));padding-bottom:16px}
.sk-train .dcw:before{content:'🚂';align-self:flex-end;font-size:clamp(40px,7vh,72px);line-height:1;margin-bottom:8px;transform:scaleX(-1)}
.sk-train .dcs{border-radius:10px;border-style:solid;border-color:#C0392B;background:linear-gradient(#3A1A1A,#25100F);box-shadow:inset 0 -8px 0 #7A1F17}
.sk-train .dcs:after{content:'';position:absolute;left:12%;right:12%;bottom:-13px;height:16px;background:radial-gradient(circle at 8px 8px,#222 6px,#999 7px,transparent 8px) left/16px 16px no-repeat,radial-gradient(circle at 8px 8px,#222 6px,#999 7px,transparent 8px) right/16px 16px no-repeat}
.sk-train .dctl{border-color:#8D5A2B;background:linear-gradient(#E8C38A,#C9954E);color:#3A2200;box-shadow:0 6px 0 #6B4220;border-radius:8px}
.sk-train.win .dcw:before{animation:dfxChoo .5s 3}@keyframes dfxChoo{50%{transform:scaleX(-1) translateY(-6px)}}
/* 🚀 太空艙：格子 ＝ 圓角 艙門（小 窗戶），星空 底 */
.sk-rocket{background:radial-gradient(1px 1px at 10% 20%,#fff,transparent),radial-gradient(1.5px 1.5px at 70% 30%,#fff,transparent),radial-gradient(1px 1px at 40% 80%,#fff,transparent),radial-gradient(1px 1px at 90% 70%,#cdf,transparent);border-radius:24px}
.sk-rocket .dcs{border-radius:999px;border-style:solid;border-color:#9FB2C4;background:radial-gradient(circle at 30% 30%,#2E4A6E,#0E1A2C)}
.sk-rocket .dcs:before{content:'';position:absolute;right:10px;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;background:#7CFFE0;box-shadow:0 0 8px #7CFFE0;opacity:.7}
.sk-rocket .dctl{border-color:#5E9BFF;background:linear-gradient(#E6F0FF,#A9C6FF);color:#0E2350;box-shadow:0 6px 0 #3A5BA8;border-radius:999px}
/* 💎 寶石：格子 ＝ 金 底座，方塊 ＝ 切面 寶石 */
.sk-gem .dcs{border-style:solid;border-color:#E0B23A;background:linear-gradient(135deg,#2A2008,#14100A);clip-path:polygon(8% 0,92% 0,100% 50%,92% 100%,8% 100%,0 50%);border-radius:0}
.sk-gem .dctl{border-color:#2AA7C9;background:linear-gradient(135deg,#B8FFF6,#5ED7F0 50%,#2AA7C9);color:#05303A;box-shadow:0 6px 0 #176A80;clip-path:polygon(8% 0,92% 0,100% 50%,92% 100%,8% 100%,0 50%);border-radius:0}
.sk-gem .dctl.dfxch{clip-path:none;border-radius:16px}
/* ⌨️ 鍵盤：格子 ＝ 凹 下去 的 鍵位，方塊 ＝ 鍵帽（按下去 會 凹）*/
.sk-key .dcs{border-style:solid;border-color:#3A4656;border-radius:12px;background:#11161D;box-shadow:inset 0 4px 8px #000}
.sk-key .dctl{border-color:#C9D2DC;background:linear-gradient(#FFFFFF,#D9DFE6);color:#1A2230;border-radius:12px;box-shadow:0 7px 0 #8A96A4}
.sk-key .dctl:active{transform:translateY(4px);box-shadow:0 3px 0 #8A96A4}
/* 🍣 迴轉 壽司：格子 ＝ 盤子（圓），方塊 ＝ 壽司 */
.sk-sushi .dcw{background:linear-gradient(transparent 70%,rgba(255,255,255,.06) 70%);border-radius:20px}
.sk-sushi .dcs{border-style:solid;border-color:#E9E2D0;background:radial-gradient(ellipse at 50% 60%,#2A2A2A 55%,#E9E2D0 57%,#C9C0AA 64%,#2A2A2A 66%);border-radius:50%/40%}
.sk-sushi .dctl{border-color:#E8502E;background:linear-gradient(#FFFFFF 0 35%,#FF8A5C 35% 70%,#FFFFFF 70%);color:#3A1A10;border-radius:20px;box-shadow:0 6px 0 #B23A1E}
/* 🧱 積木：方塊 上面 兩顆 凸點 */
.sk-brick .dcs{border-style:solid;border-color:#3D7BFF;background:#0F1E40;border-radius:6px}
.sk-brick .dctl{border-color:#C62828;background:#F44336;color:#fff;border-radius:6px;box-shadow:0 6px 0 #9A1C1C}
.sk-brick .dctl:before{content:'';position:absolute;top:-10px;left:16%;right:16%;height:10px;border-radius:4px 4px 0 0;background:linear-gradient(90deg,#F44336 0 30%,transparent 30% 70%,#F44336 70%)}
.sk-brick .dctl{position:relative}
/* 🫧 海底 泡泡：格子 ＝ 泡泡，方塊 ＝ 魚 鱗 色 */
.sk-sea{background:linear-gradient(#06304A,#04182A);border-radius:24px}
.sk-sea .dcs{border-style:solid;border-color:#7FD4FF;border-radius:999px;background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.35),rgba(127,212,255,.08) 40%,rgba(4,24,42,.6))}
.sk-sea .dctl{border-color:#00A58A;background:linear-gradient(#7CFFE0,#2BC9A8);color:#033A30;border-radius:999px;box-shadow:0 6px 0 #00705E}
/* 🃏 魔法 卡牌：格子 ＝ 卡槽，方塊 ＝ 紫色 卡牌 */
.sk-card .dcs{border-style:solid;border-color:#B66BFF;background:repeating-linear-gradient(45deg,#1E1030 0 10px,#2A1640 10px 20px);border-radius:12px}
.sk-card .dctl{border-color:#7A3FD0;background:linear-gradient(160deg,#F3E6FF,#C9A6FF);color:#2A0E50;border-radius:12px;box-shadow:0 6px 0 #4A2280}
.sk-card.win .dcs.ok{animation:dfxFlip .6s}@keyframes dfxFlip{50%{transform:rotateY(90deg)}}
.dcbox.dfx .dcs.fill{color:#FFE38A}
/* 皮克敏、資料表：格子 換 顏色 */
.dfxq.sk-gem .gap,.dfxq.sk-gem .sl9{border-color:#E0B23A}.dfxq.sk-rocket .gap,.dfxq.sk-rocket .sl9{border-radius:999px;border-color:#9FB2C4}.dfxq.sk-sea .gap,.dfxq.sk-sea .sl9{border-radius:999px;border-color:#7FD4FF}
.dfxq.sk-card .tile9{background:linear-gradient(160deg,#F3E6FF,#C9A6FF);color:#2A0E50}.dfxq.sk-key .tile9{background:linear-gradient(#fff,#D9DFE6);color:#1A2230;border-radius:12px}.dfxq.sk-train .tile9{background:linear-gradient(#E8C38A,#C9954E);color:#3A2200}
.dfxq.sk-sushi .tile9{background:linear-gradient(#fff 0 35%,#FF8A5C 35% 70%,#fff 70%);color:#3A1A10}.dfxq.sk-brick .tile9{background:#F44336;color:#fff}.dfxq.sk-sea .tile9{background:linear-gradient(#7CFFE0,#2BC9A8);color:#033A30;border-radius:999px}
@media (prefers-reduced-motion:reduce){.dfxban,.dfxban .i,.dfxbg,.dctl.dfxch,.dfxop,.dfxop *,.dfxpt{animation:none!important}}
`;
module.exports = { CSS, JS: '\n/* ══ 🎁🧩👻 拖曳題 不 無聊（g3mid/_dragfx.js）══ */\nvar DFX=(' + DFXSRC.toString() + ')();\n', DFXSRC };
