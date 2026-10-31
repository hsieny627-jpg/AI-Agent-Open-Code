/* score/_actl.js — 題目 開始 前 的 秒懂 動畫：〔⏸️ 暫停〕〔🔁 再播一次〕〔🐢 慢速〕（2026-10-31 C42 Q2 乙：全部 題目 開始 前 的 動畫 都 要 有）
 * 用法（網頁 端，ES5）：
 *   var c = ACTL.on(host, replay)   ➜ host 下面 加 一排 三顆 鈕；replay() ＝ 從頭 再 演 一次
 *   ACTL.T(fn, ms)                  ➜ 取代 setTimeout：暫停 ＝ 停住、慢速 ＝ ✕1.6
 *   ACTL.off()                      ➜ 動畫 結束（關掉 這一排、清掉 計時）
 * 暫停 ＝ host 裡面 全部 CSS 動畫 停住（Web Animations：getAnimations）＋ 計時 停住；慢速 ＝ CSS 動畫 0.6 倍 速、計時 ✕1.6。
 * 已經 有 自己 一排 鈕 的（🔓 解碼 decCtl、🎬 秒懂 複習 動畫 RVA）不 用 這個。 */
function ACTLSRC() {
  var A = { host: null, pz: false, slow: false, tm: [], rf: null, iv: 0 };
  function anims() { var h = A.host; if (!h) return []; try { return h.getAnimations ? h.getAnimations({ subtree: true }) : []; } catch (e) { return []; } }
  function apply() { anims().forEach(function (a) { try { a.playbackRate = A.slow ? .6 : 1; if (A.pz && a.playState === 'running') a.pause(); if (!A.pz && a.playState === 'paused') a.play(); } catch (e) { } }); }
  A.T = function (fn, ms) { var it = { fn: fn, ms: ms * (A.slow ? 1.6 : 1) }; it.run = function () { var k = A.tm.indexOf(it); if (k >= 0) A.tm.splice(k, 1); fn(); };
    A.tm.push(it); if (!A.pz) { it.t0 = Date.now(); it.id = setTimeout(it.run, it.ms); } return it; };
  function stopT() { A.tm.forEach(function (it) { clearTimeout(it.id); it.ms = Math.max(0, it.ms - (Date.now() - (it.t0 || Date.now()))); }); }
  function goT() { A.tm.forEach(function (it) { it.t0 = Date.now(); it.id = setTimeout(it.run, it.ms); }); }
  function lab() { var b = A.bar; if (!b) return; var p = b.querySelector('[data-ac="p"]'), s = b.querySelector('[data-ac="s"]'); p.textContent = A.pz ? '▶ 繼續' : '⏸️ 暫停'; p.classList.toggle('on', A.pz); s.textContent = A.slow ? '🐇 正常' : '🐢 慢速'; s.classList.toggle('on', A.slow); }
  A.on = function (host, replay) { A.off(); A.host = host; A.rf = replay; var b = document.createElement('div'); b.className = 'actl';
    b.innerHTML = '<button data-ac="p">⏸️ 暫停</button><button data-ac="r">🔁 再播一次</button><button data-ac="s">🐢 慢速</button>';
    b.onclick = function (e) { var t = e.target.closest ? e.target.closest('[data-ac]') : null; if (!t) return; var k = t.getAttribute('data-ac');
      if (k === 'p') { A.pz = !A.pz; if (A.pz) stopT(); else goT(); apply(); try { speechSynthesis[A.pz ? 'pause' : 'resume'](); } catch (x) { } }
      if (k === 's') { A.slow = !A.slow; A.tm.forEach(function (it) { it.ms = it.ms * (A.slow ? 1.6 : 1 / 1.6); if (!A.pz) { clearTimeout(it.id); it.t0 = Date.now(); it.id = setTimeout(it.run, it.ms); } }); apply(); }
      if (k === 'r') { var f = A.rf, sl = A.slow; A.pz = false; stopT(); A.tm = []; if (f) f(); A.slow = sl; apply(); }
      lab(); };
    host.appendChild(b); A.bar = b; A.iv = setInterval(apply, 250); lab(); return A; };
  A.off = function () { A.tm.forEach(function (it) { clearTimeout(it.id); }); A.tm = []; A.pz = false; clearInterval(A.iv); if (A.bar && A.bar.parentNode) A.bar.parentNode.removeChild(A.bar); A.bar = null; A.host = null; };
  return A;
}
const CSS = '.actl{display:flex;justify-content:center;flex-wrap:wrap;gap:clamp(8px,1.6vw,18px);margin-top:clamp(8px,1.4vh,14px)}' +
  '.actl button{min-height:56px;min-width:140px;font:inherit;font-size:clamp(19px,2.5vh,24px);font-weight:700;border-radius:16px;border:3px solid #5E7FA8;background:#14263F;color:#fff;cursor:pointer;padding:0 14px}' +
  '.actl button.on{background:#FFB300;color:#2A1A00;border-color:#FFE07A}';
module.exports = { css: CSS, js: 'var ACTL=(' + ACTLSRC.toString() + ')();' };
