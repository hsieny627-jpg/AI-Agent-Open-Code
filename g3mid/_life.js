/* g3mid/_life.js — 🔓 句子 解碼：答對 以後 的「🌟 生活 裡 怎麼 用？」獨立 一頁（2026-11-01 第三十八次 C44 ⑥-(2)；三年級 g3mid、四年級 midterm 共用）
 * 老師：每一題 答對 以後，用 獨立 頁面 的 動畫 呈現 這一句（或 這一段 對話）在 日常 生活 怎麼 用；標準 美式 發音；唸到 哪 個 字 那個 字 稍微 放大、放亮。
 * 做法：照 句子 認 情境（8 種，一句 一句 換 不同 的 圖），舞台 上 小朋友 會 動、東西 會 跳 出來；對話 ＝ 左邊 A 問、右邊 B 答（兩個 對話框）；
 *       用 解碼 引擎 的 decRead（同一個 語音檔、唸到 哪 亮到 哪），A 的 字 唸完 B 的 對話框 才 亮；最上面 一行 中文 情境、最下面 整句 中文（詞 和 詞 空 一格）。
 *       唸完 停 1.2 秒 自己 下一題（也 可以 按〔▶ 下一題〕）。window.__NOLIFE ＝ 量測 跳過。 */
function LIFESRC() {
  var F = { dad: '👨', father: '👨', mom: '👩', mother: '👩', grandpa: '👴', grandfather: '👴', grandma: '👵', grandmother: '👵', brother: '👦', sister: '👧', uncle: '🧔', aunt: '👩‍🦰',
    teacher: '🧑‍🏫', student: '🧑‍🎓', doctor: '🧑‍⚕️', nurse: '🧑‍⚕️', cook: '🧑‍🍳', farmer: '🧑‍🌾', friend: '🧒' };
  var NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20 };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function lines(en) { var p = String(en).match(/[^.?!]+[.?!]+/g) || [en]; return p.map(function (x) { return x.trim(); }); }
  /* 情境：[一行 中文, 舞台 圖, 誰 說] */
  function ctx(en) { var t = String(en).toLowerCase(), w = t.match(/[a-z]+/g) || [], fam = w.filter(function (x) { return F[x] && !/teacher|student|doctor|nurse|cook|farmer/.test(x); })[0],
      job = w.filter(function (x) { return /^(teacher|student|doctor|nurse|cook|farmer)$/.test(x); })[0], n = 0; w.forEach(function (x) { if (NUM[x]) n = NUM[x]; });
    if (/sorry|late/.test(t)) return ['⏰ 上課 遲到 了，在 教室 門口', '<span class="lf door">🚪</span><span class="lf clk">⏰</span>', 'door'];
    if (/come in|have a seat|sit down/.test(t)) return ['🏫 在 教室：老師 請 同學 進來、坐下', '<span class="lf door">🚪</span><span class="lf chair">🪑</span>', 'door'];
    if (/thank|welcome/.test(t)) return ['🎁 收到 禮物 的 時候', '<span class="lf gift">🎁</span><span class="lf heart">💖</span>', 'gift'];
    if (/nice to meet/.test(t)) return ['🤝 第一次 見面、認識 新 朋友', '<span class="lf shake">🤝</span><span class="lf star">✨</span>', 'meet'];
    if (/good morning/.test(t)) return ['🌅 早上 到 學校 的 時候', '<span class="lf sun">🌅</span><span class="lf bag">🎒</span>', 'morn'];
    if (/find my|help/.test(t)) return ['🔍 東西 不見 了、朋友 來 幫忙', '<span class="lf dog">🐶</span><span class="lf mag">🔍</span>', 'help'];
    if (job) return ['💼 職業 日：介紹 家人 的 工作', '<span class="lf job">' + (/\bshe\b|her\b|mom|mother|grandma|aunt|sister/.test(t) && job === 'nurse' ? '👩‍⚕️' : F[job]) + '</span><span class="lf badge">🏷️</span>', 'job'];
    if (/who|this is/.test(t) || fam) return ['📸 拿 全家福 照片 給 朋友 看', '<span class="lf photo">🖼️<i>' + (fam ? F[fam] : (/\bshe\b/.test(t) ? '👩' : '👨')) + '</i></span><span class="lf point">👉</span>', 'fam'];
    if (n || /how old|years old/.test(t)) return ['🎂 生日 派對：朋友 問 你 幾歲', '<span class="lf cake">🎂<i>' + (n ? n : '?') + '</i></span><span class="lf bal">🎈</span>', 'age'];
    return ['📛 開學 第一天：認識 新 同學', '<span class="lf tag">📛</span><span class="lf hand">👋</span>', 'name']; }
  var L = {};
  L.go = function (q, done) {
    if (window.__NOLIFE || !q || !q.en) { done(); return; }
    var ls = lines(q.en), c = ctx(q.en), two = ls.length > 1 && /\?$/.test(ls[0]), o = document.getElementById('lifev');
    if (!o) { o = document.createElement('div'); o.id = 'lifev'; document.body.appendChild(o); }
    var bub = function (txt, k) { return '<div class="lb ' + (k ? 'r' : 'l') + (two && k ? ' dim' : '') + '">' + txt.split(' ').map(function (w) { return '<span class="lw" data-w="' + esc(w) + '">' + esc(w.replace(/'/g, '’')) + '</span>'; }).join(' ') + '</div>'; };
    var bubs = two ? bub(ls[0], 0) + bub(ls.slice(1).join(' '), 1) : bub(ls.join(' '), 0);
    o.innerHTML = '<div class="lfw lf-' + c[2] + '"><div class="lft">🌟 生活 裡 怎麼 用？</div><div class="lfc">' + c[0] + '</div>' +
      '<div class="lfs"><span class="kid a">🧒</span>' + c[1] + (two ? '<span class="kid b">👧</span>' : '') + '<div class="lbs">' + bubs + '</div></div>' +
      '<div class="lfz keepsp">' + esc(window.ZSP ? ZSP(q.z || '') : (q.z || '')) + '</div><button class="lfgo" id="lfgo" hidden>▶ 下一題</button></div>';
    o.classList.add('on'); var fin = false, go = function () { if (fin) return; fin = true; o.classList.remove('on'); o.innerHTML = ''; done(); };
    document.getElementById('lfgo').onclick = go;
    var cells = [].slice.call(o.querySelectorAll('.lw')), B = o.querySelector('.lb.r.dim');
    var wb = B ? setInterval(function () { if (B.querySelector('.spk')) { B.classList.remove('dim'); clearInterval(wb); } }, 60) : 0;
    setTimeout(function () { if (fin) return; decRead(q.en, q.v || '', cells, function () { clearInterval(wb); if (B) B.classList.remove('dim'); var b = document.getElementById('lfgo'); if (b) b.hidden = false; setTimeout(go, window.__NOGO ? 30 : 1600); }); }, window.__NOGO ? 30 : 900);
  };
  return L;
}
const CSS = '#lifev{position:fixed;inset:0;z-index:9300;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 30%,#1B3A66,#06101F 80%);padding:12px}#lifev.on{display:flex}' +
  '.lfw{width:min(100%,1100px);max-height:100%;overflow:auto;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,16px);text-align:center;animation:lfIn .45s ease}@keyframes lfIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}' +
  '.lft{font-size:clamp(30px,5vh,48px);font-weight:700;color:#FFE07A}.lfc{font-size:clamp(24px,3.6vh,36px);font-weight:700;color:#CFEFFF;background:#0E2A44;border:3px solid #5EC8FF;border-radius:999px;padding:4px 22px}' +
  '.lfs{position:relative;width:100%;min-height:clamp(260px,44vh,440px);border-radius:28px;background:linear-gradient(#27507F,#163052);border:4px solid #4A79B5;overflow:hidden}' +
  '.kid{position:absolute;bottom:4%;font-size:clamp(80px,16vh,150px);line-height:1;animation:lfBob 1.6s ease-in-out infinite}.kid.a{left:4%}.kid.b{right:4%;animation-delay:.5s}@keyframes lfBob{50%{transform:translateY(-8px)}}' +
  '.lf{position:absolute;font-size:clamp(70px,13vh,130px);line-height:1;animation:lfPop .7s cubic-bezier(.2,1.6,.4,1) both}.lf i{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);font-style:normal;font-size:.5em;font-weight:900;color:#fff;text-shadow:0 0 6px #000}' +
  '.lf:nth-of-type(2){animation-delay:.25s}@keyframes lfPop{from{opacity:0;transform:scale(.2) rotate(-15deg)}to{opacity:1;transform:none}}' +
  '.lfs .lf:nth-child(2){left:40%;bottom:8%}.lfs .lf:nth-child(3){left:58%;bottom:42%;font-size:clamp(46px,8vh,80px)}' +
  '.lf.heart,.lf.star,.lf.bal{animation:lfPop .7s .3s both,lfFloat 2s 1s ease-in-out infinite}@keyframes lfFloat{50%{transform:translateY(-14px)}}.lf.clk{animation:lfPop .7s both,lfShake .25s 1s 6 alternate}@keyframes lfShake{from{transform:rotate(-12deg)}to{transform:rotate(12deg)}}' +
  '.lbs{position:absolute;left:0;right:0;top:4%;display:flex;flex-direction:column;align-items:stretch;gap:10px;padding:0 3%}' +
  '.lb{max-width:78%;background:#fff;color:#111;border-radius:22px;padding:6px 18px;font-family:Andika,sans-serif;font-weight:700;font-size:clamp(30px,5.6vh,58px);line-height:1.25;box-shadow:0 6px 0 rgba(0,0,0,.25);animation:lfPop .5s .4s both;transition:opacity .3s}' +
  '.lb.l{align-self:flex-start}.lb.r{align-self:flex-end;background:#FFF2C2}.lb.dim{opacity:.35}' +
  '.lw{display:inline-block;transition:transform .15s,color .15s,text-shadow .15s}.lw.spk{transform:scale(1.14);color:#C2410C;text-shadow:0 0 12px rgba(255,190,90,.9)}' +
  '.lfz{font-size:clamp(26px,4vh,40px);font-weight:700;color:#FFF4C2}.lfgo{min-height:64px;padding:0 34px;font:inherit;font-size:clamp(24px,3.4vh,34px);font-weight:700;border-radius:18px;border:4px solid #B6FFCB;background:linear-gradient(#5BE38A,#22A84F);color:#022;cursor:pointer}' +
  '@media (prefers-reduced-motion:reduce){.kid,.lf,.lb,.lfw{animation:none!important}}';
module.exports = { css: CSS, js: 'var LIFE=(' + LIFESRC.toString() + ')();' };
