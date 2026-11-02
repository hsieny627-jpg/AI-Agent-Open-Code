/* g3mid/_duo.js — 👥 兩人 輪流 的 秒懂 說明＋誰 先（2026-11-01 第三十八次 第 5 點；三年級 g3mid、四年級 midterm 共用）
 * 老師：選「兩人輪流」以後 先 看 秒懂 動畫（兩人 怎麼 登入、怎麼 輪流、怎麼 計分、誰 先）➜ 勾「我懂了」才 開始。
 *   第 1 次：號碼 小 的 先；〔🔁 再 挑戰 一次〕第 2 次：號碼 大 的 先；第 3 次 又 小 的 先 …（一人 一題，秒懂 動畫 裡 的 突擊 測驗 也 一人 一題）
 * DUOI.first(A, B) ➜ 這一次 先 答 的 人（localStorage duo_n_小_大 ＝ 這 兩 個 人 在 這台 平板 已經 一起 開始 幾次）；DUOI.bump(A, B) ＝ 次數 ＋1
 * DUOI.intro(A, B, first, done) ➜ 蓋 一整頁 秒懂 動畫（⏸️ 🔁 🐢：score/_actl.js）＋☐ 我懂了 ➜〔▶ 開始〕*/
function DUOSRC() {
  var D = {};
  function k(A, B) { var a = [String(A), String(B)].sort(); return 'duo_n_' + a[0] + '_' + a[1]; }
  function nm(id) { id = String(id || ''); return id.slice(0, 3) + ' 班 ' + (+id.slice(3)) + ' 號'; }
  D.nm = nm;
  D.count = function (A, B) { try { return +localStorage.getItem(k(A, B)) || 0; } catch (e) { return 0; } };
  D.first = function (A, B) { var lo = String(A) < String(B) ? A : B, hi = lo === A ? B : A; return D.count(A, B) % 2 ? hi : lo; };
  D.bump = function (A, B) { try { localStorage.setItem(k(A, B), String(D.count(A, B) + 1)); } catch (e) { } };
  D.intro = function (A, B, first, done) {
    var sec = first === A ? B : A, n = D.count(A, B) + 1, o = document.getElementById('duoi');
    if (!o) { o = document.createElement('div'); o.id = 'duoi'; document.body.appendChild(o); }
    o.innerHTML = '<div class="dui"><div class="duit">👥 兩人 輪流：怎麼 玩？</div><div class="duis" id="duis"></div>' +
      '<label class="duik" id="duik"><input type="checkbox" id="duic"> <span>☑ 我懂了</span></label><button class="duigo" id="duigo" disabled>▶ 開始（請 ' + nm(first) + ' 先 答）</button></div>';
    o.classList.add('on');
    var S = [
      ['🔑', '兩個 人 都 <b>登入 好了</b>', '<span class="dup p1">' + nm(A) + ' ✅</span><span class="dup p2">' + nm(B) + ' ✅</span>'],
      ['🔁', '<b>一人 一題</b>，輪流 答', '<span class="dup p1">' + nm(first) + '</span><span class="dua">➜</span><span class="dup p2">' + nm(sec) + '</span><span class="dua">➜</span><span class="dup p1">' + nm(first) + '</span><span class="dua">…</span>'],
      (typeof RVA !== 'undefined' && RVA && (RVA.QON || window.__RVQ)) ? ['⚡', '動畫 裡 的 <b>突擊 測驗</b> 也 一人 一題', '<span class="dub">畫面 寫「請 ○○ 號 作答」＝ 輪到 那個 人</span>'] : null,   /* 第三十九次：突擊 題 暫時 移除 ➜ 這一句 不 演 */
      ['💯', '<b>各 算 各 的 分數</b>（自己 的 正確率），成績 各 記 各 的', '<span class="dup p1">' + nm(A) + '：自己 的 分數</span><span class="dup p2">' + nm(B) + '：自己 的 分數</span>'],
      ['👉', '這是 第 <b>' + n + '</b> 次：<b>' + nm(first) + ' 先</b>', '<span class="dub">' + (n % 2 ? '第 1、3、5 … 次 ＝ 號碼 小 的 先' : '第 2、4、6 … 次 ＝ 號碼 大 的 先') + '</span>']
    ].filter(Boolean);
    var box = document.getElementById('duis'), T = (window.ACTL && ACTL.T) || function (f, ms) { return setTimeout(f, ms); };
    function play() { box.innerHTML = ''; S.forEach(function (s, i) { T(function () { var d = document.createElement('div'); d.className = 'dur'; d.innerHTML = '<span class="dui0">' + s[0] + '</span><div><div class="dur1">' + s[1] + '</div><div class="dur2">' + s[2] + '</div></div>'; box.appendChild(d); }, window.__NOGO ? 5 : 300 + i * 1700); });
      T(function () { document.getElementById('duik').classList.add('rdy'); }, window.__NOGO ? 10 : 300 + S.length * 1700); }
    if (window.ACTL) ACTL.on(o.querySelector('.dui'), play); play();
    var c = document.getElementById('duic'), g = document.getElementById('duigo');
    c.onchange = function () { g.disabled = !c.checked; g.classList.toggle('rdy', c.checked); };
    g.onclick = function () { if (g.disabled) return; if (window.ACTL) ACTL.off(); o.classList.remove('on'); o.innerHTML = ''; D.bump(A, B); done(); };
  };
  /* 2026-11-02 第四十次 第 4-(2) 點（老師：學生 第一次 兩人 輪流，一直 問「現在 要 做 什麼？誰 要 先 輸入 密碼？」）
     ➜ 第 2 個 人 登入 以前，先 一步 一步 演：誰 是 第 1 個 人（兩個 人 商量／猜拳）➜ 第 1 個 人 已經 登入 ➜ 平板 交給 第 2 個 人 ➜ 第 2 個 人 打 自己 的 班級、座號、密碼（第 1 個 人 不 偷看）➜ 下一頁 才 說 誰 先 答。
     每 一步：左邊 大 號碼、中間 會 動 的 小 劇場（🧒 第 1 個 人 藍、👧 第 2 個 人 粉紅、📱 平板 在 誰 手上）、一句 話。⏸️ 🔁 🐢（score/_actl.js）＋☑ 我懂了 ➜〔▶ 換 第 2 個 人 登入〕 */
  D.login = function (A, done) {
    var o = document.getElementById('duoi');
    if (!o) { o = document.createElement('div'); o.id = 'duoi'; document.body.appendChild(o); }
    o.innerHTML = '<div class="dui"><div class="duit">👥 兩個 人 一台 平板：一步 一步 來</div><div class="duis" id="duis"></div>' +
      '<label class="duik" id="duik"><input type="checkbox" id="duic"> <span>☑ 我懂了</span></label><button class="duigo" id="duigo" disabled>▶ 換 第 2 個 人 登入</button></div>';
    o.classList.add('on');
    var P1 = '<span class="dkid k1">🧒<i>第 1 個 人</i></span>', P2 = '<span class="dkid k2">👧<i>第 2 個 人</i></span>', TAB = '<span class="dtab">📱</span>';
    var S = [
      ['1', '兩個 人 先 <b>商量</b>：誰 是 <b class="c1">第 1 個 人</b>？', P1 + '<span class="drps">✊ ✌️ ✋</span>' + P2, '猜拳 ✊✌️✋ 贏 的 ＝ 第 1 個 人（也 可以 說好：號碼 小 的）'],
      ['2', '<b class="c1">第 1 個 人</b> 先 拿 平板，打 <b>自己 的</b> 班級＋座號＋密碼', '<span class="dhold">' + P1 + TAB + '</span><span class="dpw">🔑 ●●●●●●●●</span>', A ? '✅ 已經 做好 了：' + nm(A) + ' 登入 了' : '打好 ＝ 按〔✅〕'],
      ['3', '<b class="c1">第 1 個 人</b> 按〔👥 兩個人 輪流〕➜〔📝 開始〕', '<span class="dbtn">👥 兩個人 輪流</span><span class="dua">➜</span><span class="dbtn">📝 開始</span>', '✅ 已經 做好 了'],
      ['4', '把 平板 <b>交給</b> <b class="c2">第 2 個 人</b> 🤝', P1 + '<span class="dpass">' + TAB + '</span>' + P2, '平板 從 第 1 個 人 ➜ 第 2 個 人'],
      ['5', '<b class="c2">第 2 個 人</b> 打 <b>自己 的</b> 班級＋座號＋密碼', '<span class="dhold">' + P2 + TAB + '</span><span class="dpw p2">🔑 ●●●●●●●●</span><span class="dno">' + '🧒🙈' + '</span>', '第 1 個 人 不 偷看 密碼 🙈'],
      ['6', '兩個 人 都 登入 好 ➜ <b>下一頁</b> 告訴 你們 <b>誰 先 答</b>', P1 + '<span class="dok">✅</span>' + P2 + '<span class="dok">✅</span>', '一人 一題 輪流，各 算 各 的 分數']
    ];
    var box = document.getElementById('duis'), T = (window.ACTL && ACTL.T) || function (f, ms) { return setTimeout(f, ms); };
    function play() { box.innerHTML = ''; S.forEach(function (s, i) { T(function () { [].forEach.call(box.querySelectorAll('.dur'), function (x) { x.classList.remove('cur'); });
        var d = document.createElement('div'); d.className = 'dur dls cur'; d.innerHTML = '<span class="dun">' + s[0] + '</span><div><div class="dur1">' + s[1] + '</div><div class="dur2 dst">' + s[2] + '</div><div class="dub">' + s[3] + '</div></div>'; box.appendChild(d);
        try { d.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { } }, window.__NOGO ? 5 : 300 + i * 2600); });
      T(function () { [].forEach.call(box.querySelectorAll('.dur'), function (x) { x.classList.remove('cur'); }); document.getElementById('duik').classList.add('rdy'); }, window.__NOGO ? 10 : 300 + S.length * 2600); }
    if (window.ACTL) ACTL.on(o.querySelector('.dui'), play); play();
    var c = document.getElementById('duic'), g = document.getElementById('duigo');
    c.onchange = function () { g.disabled = !c.checked; g.classList.toggle('rdy', c.checked); };
    g.onclick = function () { if (g.disabled) return; if (window.ACTL) ACTL.off(); o.classList.remove('on'); o.innerHTML = ''; done(); };
  };
  /* 突擊 測驗 第 k 題 ＝ 誰（從 現在 輪到 的 人 開始，一人 一題；另一個 人 已經 做完 ＝ 都 是 現在 這個 人）*/
  D.turn = function (DUO, k) { if (!DUO) return ''; var o = (DUO.cur + k) % 2; if (DUO.done[o]) o = DUO.cur; return DUO.id[o]; };
  return D;
}
const CSS = '#duoi{position:fixed;inset:0;z-index:120;display:none;align-items:center;justify-content:center;background:rgba(4,8,20,.94);padding:16px}#duoi.on{display:flex}' +
  '.dui{width:min(980px,100%);max-height:100%;overflow:auto;background:#101A33;border:4px solid #7FD4FF;border-radius:28px;padding:18px 20px;text-align:center;font-family:inherit}' +
  '.duit{font-size:clamp(30px,4.6vh,46px);color:#FFE07A;margin-bottom:8px}.duis{display:flex;flex-direction:column;gap:10px;min-height:120px}' +
  '.dur{display:flex;align-items:center;gap:14px;text-align:left;background:#16264A;border:3px solid #3E5C88;border-radius:20px;padding:10px 14px;animation:durIn .5s ease both}' +
  '@keyframes durIn{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:none}}' +
  '.dui0{font-size:clamp(40px,6vh,58px)}.dur1{font-size:clamp(24px,3.4vh,34px);color:#fff}.dur1 b{color:#FFE07A}.dur2{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:6px}' +
  '.dup{font-size:clamp(20px,2.8vh,28px);padding:4px 14px;border-radius:999px;border:3px solid}.dup.p1{background:#0E3A6E;border-color:#5BB8FF}.dup.p2{background:#5A1E4A;border-color:#FF8AD0}' +
  '.dua{font-size:28px;color:#FFE07A}.dub{font-size:clamp(20px,2.8vh,26px);color:#CFE3F5}' +
  '.duik{display:inline-flex;align-items:center;gap:12px;margin:14px auto 6px;padding:8px 22px;border-radius:18px;border:3px dashed #5E7FA8;font-size:clamp(26px,3.6vh,36px);color:#fff;opacity:.35;pointer-events:none}' +
  '.duik.rdy{opacity:1;pointer-events:auto;border-color:#FFE07A}.duik input{width:36px;height:36px}' +
  '.duigo{display:block;margin:8px auto 0;min-height:72px;padding:6px 30px;font:inherit;font-size:clamp(26px,3.6vh,36px);font-weight:700;border-radius:20px;border:4px solid #5E7FA8;background:#1B2633;color:#8796A8}' +
  '.duigo.rdy{background:#1E9E55;border-color:#7CFFB0;color:#fff}' +
  '.rvwho{display:inline-block;margin-left:10px;padding:2px 14px;border-radius:999px;background:#5A1E4A;border:3px solid #FF8AD0;color:#fff}' +
  /* 第四十次 4-(2)：一步 一步 小 劇場 */
  '.dur.dls{opacity:.55}.dur.dls.cur{opacity:1;border-color:#FFE07A;box-shadow:0 0 0 4px rgba(255,224,122,.25)}' +
  '.dun{flex:none;width:1.6em;height:1.6em;border-radius:50%;background:#7C5CFF;color:#fff;display:flex;align-items:center;justify-content:center;font-size:clamp(30px,4.4vh,44px);font-weight:800}' +
  '.dst{gap:14px;font-size:clamp(34px,5vh,52px);min-height:1.6em}.dkid{display:inline-flex;flex-direction:column;align-items:center;line-height:1}.dkid i{font-style:normal;font-size:clamp(16px,2.2vh,22px);padding:2px 8px;border-radius:999px;margin-top:4px}' +
  '.dkid.k1 i{background:#0E3A6E;border:2px solid #5BB8FF}.dkid.k2 i{background:#5A1E4A;border:2px solid #FF8AD0}.c1{color:#7FC8FF!important}.c2{color:#FF9AD8!important}' +
  '.drps{animation:dRps .5s steps(1) infinite}@keyframes dRps{0%{opacity:1}50%{opacity:.4}}' +
  '.dhold{display:inline-flex;align-items:center;gap:4px}.dtab{display:inline-block;animation:dTab 1s ease-in-out infinite}@keyframes dTab{50%{transform:translateY(-6px) rotate(-6deg)}}' +
  '.dpw{font-size:clamp(22px,3vh,30px);padding:4px 14px;border-radius:14px;background:#0E3A6E;border:3px solid #5BB8FF;letter-spacing:2px}.dpw.p2{background:#5A1E4A;border-color:#FF8AD0}' +
  '.dbtn{font-size:clamp(20px,2.8vh,28px);padding:6px 14px;border-radius:14px;background:#2B3D6E;border:3px solid #9FB4FF;animation:dBt 1.4s infinite}@keyframes dBt{50%{transform:scale(1.08)}}' +
  '.dpass{display:inline-block;animation:dPass 2s ease-in-out infinite}@keyframes dPass{0%,15%{transform:translateX(-60px)}55%,100%{transform:translateX(60px)}}' +
  '.dno{font-size:.8em}.dok{font-size:.8em;margin-right:10px}' +
  '@media (prefers-reduced-motion:reduce){.drps,.dtab,.dbtn,.dpass{animation:none}}';
module.exports = { css: CSS, js: 'var DUOI=(' + DUOSRC.toString() + ')();' };
