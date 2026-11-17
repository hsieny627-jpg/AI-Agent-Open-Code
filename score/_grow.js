/* score/_grow.js — 🌟 進步 之星 頒獎 典禮（2026-11-14 第五十四次；老師：進步 排行榜 比 全班 排行榜 更 重要，風格 必須 完全 不同）
 * 全班 排行榜 頒獎（score/_awd.js）＝ 3D 舞台、頒獎台、金色、號角；這一個 ＝ 夜空 ➜ 日出（成長 的 比喻）、流星、星座、溫暖 的 豎琴 琶音，沒有 頒獎台。
 * 第 5 ➜ 1 名：流星 從 下面 飛 上來 ➜ 變成 一顆 大 星星 卡（戰士 圖、班級 號碼＋中文 全名、📈 ＋分數 一格 一格 數 上去、💯／⚡ 各 進步 幾 分、一句 肯定 努力 的 話）
 * ➜ 最後 五顆 星 連成 星座「🌟 進步 之星：超越 自己」＋「🛡 保持 滿分」名字。**只 寫 進步 了 幾 分，不 寫 上次 幾 分**（保護 尊嚴）。
 * 稱讚 努力、方法，不 稱讚 聰明（Mueller & Dweck 1998）。
 * GROW.play(host, {kick, rows:[{rk, nm, hero, pr, ds, dg}], keep:[nm…]}, {done}) ／ GROW.stop(host)（ds、dg ＝ 已經 帶 ＋／－ 的 字）
 * 量測 window.__GROWFAST（時間 ✕ 0.05）。 */
function GROWSRC() {
  var G = {}, K = function () { return window.__GROWFAST ? .05 : 1; };
  var PRAISE = ['你 比 上次 的 自己 更 強 了！', '你 的 努力，大家 都 看見 了！', '一步 一步 練習，你 做到 了！', '專心 想、仔細 選 ➜ 進步 看得見！', '勇敢 挑戰，超越 自己！',
    '錯 了 再 試，就是 最 好 的 方法！', '你 的 用心 讓 你 往上 飛！', '每 一次 練習 都 算數！'];
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  /* 🎵 豎琴 琶音（WebAudio 現場 合成，每 一場 隨機 調性）*/
  var AC = null; function snd() { try { return localStorage.getItem('grow_snd') !== '0'; } catch (e) { return true; } }
  function ac() { if (!snd()) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
  function note(f, t, d, v) { var a = ac(); if (!a) return; var o = a.createOscillator(), g = a.createGain(), o2 = a.createOscillator(), t0 = a.currentTime + t;
    o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = f; o2.frequency.value = f * 2; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v || .12, t0 + .02); g.gain.exponentialRampToValueAtTime(.0008, t0 + d);
    o.connect(g); o2.connect(g); g.connect(a.destination); o.start(t0); o2.start(t0); o.stop(t0 + d + .05); o2.stop(t0 + d + .05); }
  var ROOT = 261.63; function pen(i) { var s = [0, 2, 4, 7, 9]; return ROOT * Math.pow(2, (s[i % 5] + 12 * Math.floor(i / 5)) / 12); }
  function arp(level) { for (var i = 0; i < 6 + level; i++) note(pen(i + level), i * .09, 1.6, .09); }
  function chord() { [0, 4, 7, 12, 16].forEach(function (s, i) { note(ROOT * Math.pow(2, s / 12), i * .05, 3.2, .1); }); }
  G.play = function (host, data, opt) { G.stop(host); opt = opt || {}; var my = {}; host._gr = my; my.tm = [];
    ROOT = [261.63, 293.66, 329.63, 349.23, 392][Math.floor(Math.random() * 5)];
    var T = function (f, ms) { my.tm.push(setTimeout(function () { if (host._gr === my) f(); }, ms * K())); };
    var rows = (data.rows || []).slice().sort(function (a, b) { return b.rk - a.rk; }), P = shuf(PRAISE);
    host.className = 'grw'; host.innerHTML = '<div class="grsky"></div><div class="grsun"></div><canvas class="grst"></canvas>' +
      '<div class="grtop"><div class="grk">' + esc(data.kick || '') + '</div><div class="grt">🌟 進步 之星 頒獎 典禮</div><div class="grs">今天 的 主角：比 最近 的 自己 進步 最多 的 人</div></div>' +
      '<div class="grstage"></div><div class="grkeep"></div><div class="grsw"><button class="grsnd">' + (snd() ? '🎵 配樂 開' : '🔇 配樂 關') + '</button></div>';
    host.querySelector('.grsnd').onclick = function () { try { localStorage.setItem('grow_snd', snd() ? '0' : '1'); } catch (e) { } this.textContent = snd() ? '🎵 配樂 開' : '🔇 配樂 關'; };
    stars(host, my);
    /* 2026-11-17 第五十七次 第 2～4 點（老師）：節奏 更 緊湊（每 一名 約 4 秒，全部 約 25 秒）；
     * 第 1 名 視覺 位階 最 高 ＝ 星光 頒獎台（一開始 就 看得到 5 個 台：中間 第 1 名 最 高、左 第 2、右 第 3、外 側 第 4、5 愈 外 愈 低）；
     * 每 一名：先 在 中間 大 卡（聚光燈＋衝擊波）➜ 飛 到 自己 的 台 上；第 1 名 ＝ 全場 暗 ➜ 探照燈 掃 ➜ 心跳 3 2 1 ➜ 金色 光爆＋兩圈 衝擊波＋畫面 震動。 */
    var st = host.querySelector('.grstage'), big = document.createElement('div'), SLOT = [4, 2, 1, 3, 5], step = 4200, t = 1700;
    big.className = 'grbig'; host.appendChild(big);
    st.innerHTML = '<div class="grbeam"><i></i><i></i><i></i></div>' + SLOT.map(function (k) { return '<div class="grslot s' + k + '"><div class="grseat"></div><div class="grped"><b>' + (k === 1 ? '👑 1' : k) + '</b></div></div>'; }).join('');
    if (!rows.length) st.innerHTML = '<div class="grnone">這 一場 還 沒有 人 可以 比 進步（第一次 玩、或 答 不到 5 題）<br>下 一次 就 會 有！</div>';
    var has = {}; rows.forEach(function (r) { has[r.rk] = 1; }); [].forEach.call(st.querySelectorAll('.grslot'), function (x) { var k = +x.className.replace(/\D/g, ''); if (!has[k]) x.classList.add('none'); });
    rows.forEach(function (r, i) {
      var k1 = r.rk === 1, pre = k1 ? 2600 : 0;
      if (k1) T(function () { host.classList.add('sus'); big.className = 'grbig cd'; big.innerHTML = '<div class="grcd">👑 第 1 名 是……</div>'; [3, 2, 1].forEach(function (n, j) { T(function () { big.innerHTML = '<div class="grcd n">' + n + '</div>'; note(pen(j * 2), 0, .5, .14); }, 900 + j * 560); }); }, t);
      T(function () {
        host.classList.remove('sus'); host.style.setProperty('--dawn', String((i + 1) / Math.max(1, rows.length)));
        var info = '<div class="grstar">' + (k1 ? '👑' : '🌟') + '</div><div class="grrk">第 ' + r.rk + ' 名</div><div class="grhero">' + (r.hero || '') + '</div><div class="grnm">' + (r.nm || '') + '</div>' +
          '<div class="grpr">📈 ＋<b data-v="' + r.pr + '">0</b> 分</div>';
        big.className = 'grbig on r' + r.rk; big.innerHTML = '<div class="grc on r' + r.rk + (k1 ? ' king' : '') + '"><div class="grmeteor"></div>' + info +
          '<div class="grd"><span>💯 ' + esc(r.ds) + '</span>' + (r.dg ? '<span>⚡ ' + esc(r.dg) + '</span>' : '') + '</div><div class="grp">「' + esc(P[i % P.length]) + '」</div></div>';
        ring(host, k1); arp(5 - r.rk); if (k1) { ring(host, 1, 1); chord(); burst(host, my); host.classList.add('quake', 'nova'); T(function () { host.classList.remove('quake'); }, 700); T(function () { host.classList.remove('nova'); }, 2400); }
        var b = big.querySelector('.grpr b'), v = +b.getAttribute('data-v'), t0 = Date.now(), D = 900 * K();
        (function tk() { var q = Math.min(1, (Date.now() - t0) / Math.max(1, D)); b.textContent = (Math.round(v * q * 10) / 10); if (q < 1 && host._gr === my) requestAnimationFrame(tk); })();
        T(function () { big.className = 'grbig'; var seat = st.querySelector('.grslot.s' + r.rk); if (!seat) return; seat.classList.add('lit');
          seat.querySelector('.grseat').innerHTML += '<div class="grc mini on r' + r.rk + (k1 ? ' king' : '') + '">' + info.replace(/data-v="[^"]*">0</, '>' + esc(r.pr) + '<') + '</div>'; }, k1 ? 3000 : 2700);
      }, t + pre); t += step + pre;
    });
    T(function () { st.classList.add('sky');
      var k = host.querySelector('.grkeep'); if (data.keep && data.keep.length) k.innerHTML = '🛡 保持 滿分（本來 就 100 分，又 做到 了）：' + data.keep.join('、');
      host.querySelector('.grt').textContent = '🌟 進步 之星：超越 自己'; host.classList.add('fin'); chord(); burst(host, my); if (opt.done) opt.done(); }, t + 200);
  };
  function ring(host, gold, late) { var w = document.createElement('div'); w.className = 'grring' + (gold ? ' g' : ''); if (late) w.style.animationDelay = '.25s'; host.appendChild(w); setTimeout(function () { if (w.parentNode) w.parentNode.removeChild(w); }, 1800); }
  function stars(host, my) { var c = host.querySelector('.grst'), x = c.getContext && c.getContext('2d'); if (!x) return; var W, H, S = [];
    var fit = function () { W = c.width = host.clientWidth || 1280; H = c.height = host.clientHeight || 720; }; fit();
    for (var i = 0; i < 160; i++) S.push({ x: Math.random(), y: Math.random() * .8, r: Math.random() * 1.8 + .3, p: Math.random() * 6 });
    my.P = []; (function fr() { if (host._gr !== my) return; if (c.width !== host.clientWidth) fit(); x.clearRect(0, 0, W, H); var t = Date.now() / 1000;
      S.forEach(function (s) { x.globalAlpha = .35 + .65 * Math.abs(Math.sin(t + s.p)); x.fillStyle = '#fff'; x.beginPath(); x.arc(s.x * W, s.y * H, s.r, 0, 7); x.fill(); });
      my.P = my.P.filter(function (p) { p.x += p.vx; p.y += p.vy; p.vy += .03; p.l -= .012; if (p.l <= 0) return false; x.globalAlpha = p.l; x.fillStyle = p.c; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill(); return true; });
      x.globalAlpha = 1; requestAnimationFrame(fr); })(); }
  function burst(host, my) { var W = host.clientWidth || 1280, H = host.clientHeight || 720, C = ['#FFE38A', '#FFB6E1', '#9EF0FF', '#C9B6FF', '#FFFFFF'];
    for (var i = 0; i < 140; i++) { var a = Math.random() * 6.28, v = Math.random() * 6 + 2; my.P.push({ x: W / 2, y: H * .45, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, r: Math.random() * 3 + 1, l: 1, c: C[i % 5] }); } }
  G.stop = function (host) { if (!host || !host._gr) return; host._gr.tm.forEach(clearTimeout); host._gr = null; };
  return G;
}
const CSS = `
.grw{position:fixed;inset:0;z-index:120;overflow:hidden;color:#fff;font-family:system-ui,-apple-system,"PingFang TC","Microsoft JhengHei",sans-serif;--dawn:0}
.grw .grsky{position:absolute;inset:0;background:linear-gradient(180deg,#05061E 0%,#141A4A 45%,#2A1F5E 75%,#3B2366 100%)}
.grw .grsun{position:absolute;left:0;right:0;bottom:0;height:70%;background:radial-gradient(70% 60% at 50% 105%,rgba(255,190,120,.95),rgba(255,120,170,.55) 40%,rgba(120,90,255,0) 75%);opacity:calc(.15 + var(--dawn) * .85);transition:opacity 2.5s}
.grw .grst{position:absolute;inset:0;width:100%;height:100%}
.grtop{position:absolute;top:2.5vh;left:0;right:0;text-align:center}.grk{font-size:clamp(18px,2.4vh,28px);color:#C9D6FF;letter-spacing:.1em}
.grt{font-size:clamp(34px,6.4vh,74px);font-weight:900;background:linear-gradient(90deg,#9EF0FF,#FFE38A,#FFB6E1);-webkit-background-clip:text;background-clip:text;color:transparent;animation:grT 2s both}
.grs{font-size:clamp(16px,2.4vh,26px);color:#E8E2FF;opacity:.9}
.grstage{position:absolute;left:3vw;right:3vw;top:20vh;bottom:9vh;display:flex;align-items:center;justify-content:center;gap:2vw}
.grc{position:relative;width:min(34vw,460px);display:flex;flex-direction:column;align-items:center;gap:.8vh;padding:2vh 2vw;border-radius:28px;background:linear-gradient(160deg,rgba(255,255,255,.18),rgba(255,255,255,.05));border:2px solid rgba(255,255,255,.35);box-shadow:0 0 40px rgba(158,240,255,.35);opacity:0;transform:translateY(60vh) scale(.4);transition:transform 1s cubic-bezier(.2,1.2,.3,1),opacity .6s,width .8s}
.grc.on{opacity:1;transform:none}.grc.mini{width:min(17vw,230px);padding:1.2vh 1vw;gap:.3vh}
.grc.mini .grp,.grc.mini .grd{display:none}.grc.mini .grhero{height:9vh}.grc.mini .grpr{font-size:clamp(22px,2.6vh,30px)}
.grmeteor{position:absolute;left:50%;top:100%;width:6px;height:40vh;margin-left:-3px;background:linear-gradient(180deg,rgba(255,255,255,.9),rgba(158,240,255,0));border-radius:3px;opacity:0}
.grc.on .grmeteor{animation:grM 1s ease-out}
.grstar{font-size:clamp(40px,7vh,76px);filter:drop-shadow(0 0 18px #FFE38A);animation:grTw 2.4s ease-in-out infinite}
.grrk{font-size:clamp(20px,3vh,32px);color:#FFE38A}
.grhero{height:16vh;display:flex;align-items:flex-end;justify-content:center}.grhero img{max-height:100%;max-width:100%;object-fit:contain;filter:drop-shadow(0 8px 16px rgba(0,0,0,.5))}
.grnm{font-size:clamp(24px,3.4vh,40px);font-weight:900;text-align:center}
.grpr{font-size:clamp(28px,5vh,56px);font-weight:900;color:#9EF0FF;text-shadow:0 0 16px rgba(158,240,255,.8)}
.grd{display:flex;gap:1vw;font-size:clamp(16px,2.2vh,24px)}.grd span{background:rgba(0,0,0,.3);border-radius:999px;padding:2px 12px}
.grp{font-size:clamp(18px,2.6vh,28px);color:#FFF3C4;text-align:center}
.grc.king{border-color:#FFE38A;box-shadow:0 0 0 4px rgba(255,227,138,.5),0 0 80px rgba(255,190,120,.8);animation:grK 2.6s ease-in-out infinite}
.grstage.sky{align-items:flex-start;padding-top:2vh}.grstage.sky .grc{animation:grF 4s ease-in-out infinite}.grstage.sky .grc:nth-child(2n){animation-delay:-2s;margin-top:6vh}
.grkeep{position:absolute;left:4vw;right:4vw;bottom:2.5vh;text-align:center;font-size:clamp(18px,2.6vh,28px);color:#E8FFE8}
.grsw{position:absolute;right:1.5vw;top:1.5vh}.grsw button{min-height:48px;padding:4px 16px;border-radius:16px;border:2px solid rgba(255,255,255,.4);background:rgba(0,0,0,.35);color:#fff;font-size:18px}
.grnone{font-size:clamp(24px,3.6vh,40px);text-align:center;line-height:1.6}
@keyframes grT{0%{opacity:0;letter-spacing:.6em}100%{opacity:1;letter-spacing:.02em}}@keyframes grM{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-30vh)}}
@keyframes grTw{50%{transform:scale(1.15) rotate(8deg)}}@keyframes grK{50%{box-shadow:0 0 0 8px rgba(255,227,138,.3),0 0 120px rgba(255,190,120,1)}}@keyframes grF{50%{transform:translateY(-1.4vh)}}
@media (prefers-reduced-motion:reduce){.grw *{animation:none!important;transition:none!important}}
/* ── 2026-11-17 第五十七次：星光 頒獎台（第 1 名 最 高）＋中間 大 卡＋衝擊波＋探照燈＋金色 光爆 ── */
.grstage{display:grid;grid-template-columns:1fr 1.05fr 1.25fr 1.05fr 1fr;align-items:end;gap:1.2vw;top:16vh;bottom:7vh}
.grslot{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;transition:filter .6s}
.grslot.none{visibility:hidden}.grslot .grseat{min-height:2vh;display:flex;justify-content:center;width:100%}
.grslot .grped{width:100%;border-radius:14px 14px 0 0;display:flex;justify-content:center;padding-top:.8vh;font-weight:900;font-size:clamp(30px,5.5vh,64px);color:rgba(255,255,255,.55);
  background:linear-gradient(180deg,rgba(158,240,255,.35),rgba(120,90,255,.18) 60%,rgba(20,20,60,.4));border:2px solid rgba(158,240,255,.35);box-shadow:inset 0 0 30px rgba(158,240,255,.25);transform:perspective(600px) rotateX(8deg);transform-origin:50% 100%;transition:all .6s}
.grslot.s1 .grped{height:30vh;background:linear-gradient(180deg,rgba(255,227,138,.75),rgba(255,160,90,.35) 60%,rgba(60,30,10,.5));border-color:#FFE38A;color:#FFF6D0}
.grslot.s2 .grped{height:21vh}.grslot.s3 .grped{height:15vh}.grslot.s4 .grped{height:9vh}.grslot.s5 .grped{height:6vh}
.grslot.lit .grped{color:#fff;box-shadow:inset 0 0 40px rgba(255,255,255,.5),0 0 40px rgba(158,240,255,.6)}.grslot.s1.lit .grped{box-shadow:inset 0 0 50px rgba(255,255,255,.6),0 0 90px rgba(255,200,90,.9)}
.grslot .grc.mini{width:100%;max-width:240px;animation:grIn .7s cubic-bezier(.2,1.5,.4,1) both}.grslot .grc.mini .grd,.grslot .grc.mini .grp,.grslot .grc.mini .grmeteor{display:none}
.grslot .grc.mini .grhero{height:8vh}.grslot.s1 .grc.mini .grhero{height:11vh}.grslot .grc.mini .grstar{font-size:clamp(26px,4vh,44px)}.grslot .grc.mini .grrk{font-size:clamp(16px,2.2vh,24px)}
.grslot .grc.mini .grnm{font-size:clamp(18px,2.6vh,30px)}.grslot .grc.mini .grpr{font-size:clamp(20px,3vh,34px)}
@keyframes grIn{0%{opacity:0;transform:translateY(-40vh) scale(1.8)}100%{opacity:1;transform:none}}
.grbig{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0;transition:opacity .35s;z-index:3}
.grbig.on,.grbig.cd{opacity:1}.grbig.on::before{content:'';position:absolute;inset:0;background:radial-gradient(42% 55% at 50% 50%,rgba(255,255,255,.18),rgba(0,0,0,.55) 70%)}
.grbig .grc{position:relative;width:min(44vw,560px);animation:grPop .6s cubic-bezier(.2,1.6,.4,1) both}
@keyframes grPop{0%{transform:scale(.2) rotateY(90deg);opacity:0}100%{transform:none;opacity:1}}
.grcd{font-size:clamp(40px,8vh,96px);font-weight:900;color:#FFE38A;text-shadow:0 0 30px #FFB000}.grcd.n{font-size:clamp(120px,26vh,300px);animation:grCd .56s ease-out both}
@keyframes grCd{0%{transform:scale(2.6);opacity:0}40%{opacity:1}100%{transform:scale(1)}}
.grw.sus .grsky{filter:brightness(.35)}.grw.sus .grstage{filter:brightness(.45)}
.grbeam{position:absolute;inset:-10vh 0 0;pointer-events:none;opacity:0;transition:opacity .4s}.grw.sus .grbeam,.grw.fin .grbeam{opacity:.6}
.grbeam i{position:absolute;bottom:0;width:16vw;height:120%;left:calc(var(--x) - 8vw);transform-origin:50% 100%;clip-path:polygon(42% 100%,58% 100%,100% 0,0 0);background:linear-gradient(0deg,rgba(255,240,200,.7),transparent 85%)}
.grbeam i:nth-child(1){--x:12%;animation:grSw 1.1s ease-in-out infinite alternate}.grbeam i:nth-child(2){--x:50%;animation:grSw 1.4s -.5s ease-in-out infinite alternate-reverse}.grbeam i:nth-child(3){--x:88%;animation:grSw 1.2s -.3s ease-in-out infinite alternate}
@keyframes grSw{0%{transform:rotate(-22deg)}100%{transform:rotate(22deg)}}
.grring{position:absolute;left:50%;top:52%;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:6px solid #9EF0FF;box-shadow:0 0 30px #9EF0FF,inset 0 0 24px #9EF0FF;pointer-events:none;z-index:2;animation:grRing 1.3s cubic-bezier(.1,.7,.3,1) both}
.grring.g{border-color:#FFE38A;box-shadow:0 0 60px #FFD54A,inset 0 0 30px #FFD54A}
@keyframes grRing{0%{transform:scale(1);opacity:1}100%{transform:scale(70);opacity:0}}
.grw.quake{animation:grQk .7s}@keyframes grQk{10%,50%,90%{transform:translate(-10px,6px)}30%,70%{transform:translate(10px,-6px)}}
.grw::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:0;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,227,138,.5) 0 4deg,transparent 4deg 14deg)}
.grw.nova::after{animation:grNova 2.4s ease-out both}@keyframes grNova{0%{opacity:0;transform:scale(.3)}15%{opacity:1}100%{opacity:0;transform:scale(1.35) rotate(35deg)}}
.grstage.sky{align-items:end;padding-top:0}.grstage.sky .grc{animation:none}.grstage.sky .grc:nth-child(2n){margin-top:0}
@media (prefers-reduced-motion:reduce){.grw.quake,.grring,.grw.nova::after,.grbeam i{animation:none!important}}`;
module.exports = { CSS, JS: '\n/* ══ 🌟 進步 之星 頒獎 典禮（score/_grow.js）══ */\nvar GROW=(' + GROWSRC.toString() + ')();\n' };
