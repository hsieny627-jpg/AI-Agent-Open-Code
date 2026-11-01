/* g3mid/_okv.js — 2026-11-01 第三十八次（三年級 g3mid、四年級 midterm 共用）
 * ① 第 11-(9) 點／第 8 點：唸到 哪 一個 英文 字，那個 字 稍微 放大、稍微 變亮（不閃）——OKV.say(放 字 的 地方, 要 唸 的 [[聲音, 英文], …], 唸完, 間隔)
 *    每一句 ↔ 照 順序 拿 .gls 裡 的 .gw（一個 英文 字 一格；’s 自己 一格）；時間 照 語音檔 播到 哪（AU.currentTime ÷ 全長），沒有 語音檔 ＝ 照 字數 估。
 * ② 第 8 點（老師：有的 學生 是 猜對 的）：答對 ➜「✅ 答對了！」獨立 一頁 ＋ 正確 答案（每個 英文 字 正下方 中文）＋ 整句 中文 ＋ 美式 發音 唸 一次（唸到 哪 亮到 哪）➜ 才 下一題
 *    OKV.ok(內容 HTML, 要 唸 的, 唸完, 畫完 以後 要 做 的 (例 寫字 的 四線格)) */
function OKVSRC() {
  var O = {}, tk = 0;
  function words(t) { return (String(t).replace(/’/g, "'").match(/[A-Za-z0-9]+|'[A-Za-z]+/g) || []).length; }
  function clear(box) { clearInterval(tk); if (box) [].forEach.call(box.querySelectorAll('.gw.hl'), function (c) { c.classList.remove('hl'); }); }
  function run(cells, text) { clearInterval(tk); if (!cells.length) return; var w = cells.map(function (c) { return Math.max(1, (c.textContent || '').replace(/[^A-Za-z0-9']/g, '').length + 1); }),
      tot = w.reduce(function (a, b) { return a + b; }, 0), t0 = Date.now(), est = Math.max(.7, words(text) * .45) * 1000, last = -1;
    tk = setInterval(function () { var a = window.AU, f; if (a && a.duration && isFinite(a.duration) && !a.paused) f = a.currentTime / a.duration; else f = (Date.now() - t0) / est;
      f = Math.max(0, Math.min(.999, f)); var acc = 0, k = 0; for (; k < w.length; k++) { acc += w[k]; if (acc / tot > f) break; }
      if (k !== last) { if (last >= 0 && cells[last]) cells[last].classList.remove('hl'); if (cells[k]) cells[k].classList.add('hl'); last = k; } }, 70); }
  O.say = function (box, L, done, gap, sel) { var cells = box ? [].slice.call(box.querySelectorAll(sel || '.gls .gw')) : [], i = 0, at = 0; stopSay(); var my = SID;
    (function nx() { if (my !== SID) { clear(box); return; } if (i >= L.length) { clear(box); if (done) done(); return; } var x = L[i++], n = words(x[1]);
      var part = cells.length ? (L.length === 1 ? cells : cells.slice(at, at + n)) : []; at += n; if (!part.length && cells.length) part = cells;
      run(part, x[1]); say1(x[1], x[0], function () { clear(box); ST = setTimeout(nx, x[2] || gap || 450); }); })(); };
  O.ok = function (html, L, done, after) { var o = document.getElementById('okv'); if (!o) { o = document.createElement('div'); o.id = 'okv'; document.body.appendChild(o); }
    o.innerHTML = '<div class="okb"><div class="okh">✅ 答對了！</div><div class="okc">🔊 再 聽 一次：正確 答案</div><div class="okw" id="okw">' + html + '</div></div>';
    o.classList.add('on'); if (after) try { after(); } catch (e) { }
    var b = o.querySelector('.okb'); for (var z = 1, k = 0; k < 10 && b.scrollHeight > b.clientHeight + 2; k++) { z *= .9; b.style.setProperty('--okz', z.toFixed(3)); }
    setTimeout(function () { O.say(document.getElementById('okw'), L, function () { setTimeout(function () { o.classList.remove('on'); o.innerHTML = ''; if (done) done(); }, window.__NOGO ? 30 : 700); }); }, window.__NOGO ? 30 : 500); };
  O.hide = function () { var o = document.getElementById('okv'); if (o) { o.classList.remove('on'); o.innerHTML = ''; } clear(); };
  return O;
}
const CSS = '.w9{display:inline-block;transition:transform .15s,color .15s,text-shadow .15s}.w9.hl{transform:scale(1.15);color:#B45309;text-shadow:0 0 10px rgba(255,200,90,.9)}.gw{transition:transform .18s,filter .18s}.gw.hl b{display:inline-block;transform:scale(1.16);color:#FFF6C8;text-shadow:0 0 14px rgba(255,236,150,.9)}.gw.hl i{color:#fff}' +
  '#okv{position:fixed;inset:0;z-index:9400;display:none;align-items:center;justify-content:center;background:rgba(0,20,8,.72);padding:12px}#okv.on{display:flex}' +
  '#okv .okb{--okz:1;width:min(100%,1180px);max-height:100%;overflow:auto;background:#0B3D1E;border:5px solid #5BE38A;border-radius:28px;padding:clamp(12px,2vh,24px) clamp(14px,2.4vw,30px);display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.4vh,14px);text-align:center;animation:okIn .35s ease}' +
  '@keyframes okIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}' +
  '#okv .okh{font-size:calc(var(--okz) * clamp(40px,7vh,72px));font-weight:700;color:#7CFFB0}#okv .okc{font-size:calc(var(--okz) * clamp(22px,3.2vh,32px));font-weight:700;color:#BFF5D0}' +
  '#okv .okw{font-size:calc(var(--okz) * 100%);display:flex;flex-direction:column;align-items:center;gap:10px}#okv .tr{font-size:clamp(24px,3.6vh,38px);font-weight:700;color:#FFF4C2}';
module.exports = { css: CSS, js: 'var OKV=(' + OKVSRC.toString() + ')();' };
