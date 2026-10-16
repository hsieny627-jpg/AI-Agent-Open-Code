/* sentences/_route.js — 在家複習句型頁最上面的「闖關路線」（2026-10-16 第三批 C 組第 2、3 題：老師選 甲）
 *
 * 只有在家複習（RPAGES：file 寫 '../g3-review/…'）才用；老師的教學網站照舊是一排分頁＋〔基礎｜進階〕。
 *   一站 ＝ 一組卡片：1 基礎 ➜ 1 進階 ➜ 2 基礎 ➜ 2 進階 ➜ 3 中英語序 ➜ 4 縮寫動畫 ➜ 5 一問一答
 *   ① 現在在哪一個：金色、放大、慢慢發光，寫「現在在這裡」
 *   ② 下一步點哪一個：藍色虛線框，寫「👆 下一個」（手指上下點）
 *   ③ 看完的打 ✔：看到這一站的最後一張卡（＝ 📝 複習題出現的時間，_tq.js 的 TQSEEN，這台平板記住）
 *   最左邊〔🏠 回首頁〕（老師 2026-10-16：學生找不到回首頁的按鈕）
 * 引擎（_build_cards.js）原本的 setDeck／TCUR／LCUR 照用：〔基礎｜進階〕那一顆藏起來，站就是級別。
 */
function html(TABM) {
  const st = [];
  TABM.forEach((tb, t) => (tb.sub ? tb.sub.map((x, l) => [l, x.lb]) : [[0, tb.lb]]).forEach(([l, lb]) =>
    st.push('<button class="st" data-t="' + t + '" data-l="' + l + '"><span class="n">' + tb.n + '</span><span class="lb">' + lb + '</span><span class="tg"></span></button>')));
  return '<nav id="tabs" class="route"><a class="rh" href="index.html"><span class="i">🏠</span><span class="lb">回首頁</span></a>' + st.join('') +
    '<span class="lv" id="lvGrp" hidden><button data-l="0">基礎</button><button data-l="1">進階</button></span></nav>';
}
const CSS = `
/* 闖關路線（在家複習，2026-10-16 C 組） */
#tabs.route{padding:8px clamp(8px,1.2vw,16px) 0;gap:clamp(6px,.8vw,10px);flex-wrap:wrap;align-items:stretch}
#tabs.route .lv{display:none!important}
#tabs.route .st,#tabs.route .rh{position:relative;flex:1 1 0;min-width:clamp(100px,11vw,124px);max-width:170px;min-height:clamp(62px,9vh,80px);
 border:3px solid #34404C;border-radius:16px;background:#111820;color:#E6EDF3;font-family:inherit;cursor:pointer;
 display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:6px 6px;text-align:center;line-height:1.1;text-decoration:none}
#tabs.route .n{font-size:clamp(22px,3.4vh,30px);font-weight:700;color:#FFD54A;line-height:1}
#tabs.route .lb{font-size:clamp(17px,2.5vh,22px);white-space:nowrap}
#tabs.route .rh{border-color:#FFD54A;background:#221B05;color:#FFE9A8;flex:0 0 auto;min-width:clamp(84px,9vw,110px)}
#tabs.route .rh .i{font-size:clamp(24px,3.6vh,32px);line-height:1}
#tabs.route .rh .lb{font-weight:700}
#tabs.route .tg{display:block;visibility:hidden;min-height:1.3em;line-height:1.3;font-size:clamp(15px,2vh,18px);font-weight:700;border-radius:999px;padding:1px 9px;margin-top:3px;white-space:nowrap;color:#05070A}
#tabs.route .st.done{border-color:#2EB85C;background:#0D1B12}
#tabs.route .st.done::after{content:'✔';position:absolute;top:-7px;right:-6px;background:#2EB85C;color:#fff;border-radius:50%;
 width:30px;height:30px;font-size:19px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px #000}
#tabs.route .st.now{border-color:#FFD54A;background:#2A2208;transform:scale(1.05);z-index:1;animation:rtGlow 1.8s ease-in-out infinite}
#tabs.route .st.now .tg{visibility:visible;background:#FFD54A}
#tabs.route .st.now .tg::after{content:'現在在這裡'}
#tabs.route .st.next{border-color:#7FD4FF;border-style:dashed}
#tabs.route .st.next .tg{visibility:visible;background:#7FD4FF}
#tabs.route .st.next .tg::after{content:'下一個'}
#tabs.route .st.next .tg::before{content:'👆';display:inline-block;margin-right:3px;animation:rtTap 1.2s ease-in-out infinite}
@keyframes rtGlow{50%{box-shadow:0 0 0 5px rgba(255,213,74,.3),0 0 22px rgba(255,213,74,.55)}}
@keyframes rtTap{50%{transform:translateY(-5px)}}
/* 直放 iPad：七站排一排（上面〔🏠 回首頁〕收起來，下面按鈕列那一顆金色的還在），字卡才不會被壓矮 */
@media (max-width:900px){#tabs.route .rh{display:none}#tabs.route .st{min-width:90px}}
body.reduce #tabs.route .st.now,body.reduce #tabs.route .st.next .tg::before{animation:none}
/* 〔🏠 回首頁〕（下面按鈕列那一顆也放大、金色） */
#bar a.rvhome{border:3px solid #FFD54A!important;background:#221B05!important;color:#FFE9A8!important;font-weight:700;font-size:clamp(18px,2.6vh,22px)!important;min-height:48px;display:inline-flex;align-items:center}
`;
/* 放在 📝 複習題那一段後面：TQSEEN 變了（看到最後一張卡）、換站都重畫 */
const JS = `
/* ══════════ 闖關路線（在家複習，2026-10-16 C 組）══════════ */
function routeMark(){var S=window.TQSEEN||{},cur=-1,ss=$$('#tabs .st');
  ss.forEach(function(b,k){var t=+b.getAttribute('data-t'),l=+b.getAttribute('data-l'),now=t===TCUR&&l===LCUR;if(now)cur=k;
    b.classList.toggle('now',now);b.classList.toggle('done',!!S[t+'_'+l]);b.classList.remove('next')});
  if(cur>=0&&ss[cur+1])ss[cur+1].classList.add('next');var h0=$('#tabs').offsetHeight;tabH();if(routeMark.h!==undefined&&routeMark.h!==h0&&typeof fit==='function')fit();routeMark.h=h0}
$('#tabs').addEventListener('click',function(e){var b=e.target.closest?e.target.closest('.st'):null;if(b)setDeck(+b.getAttribute('data-t'),+b.getAttribute('data-l'))});
(function(){var sd=setDeck;setDeck=function(){var r=sd.apply(this,arguments);routeMark();return r};
  if(typeof tqMark==='function'){var tm=tqMark;tqMark=function(){var r=tm.apply(this,arguments);routeMark();return r}}})();
routeMark();
`;
/* 只要〔🏠 回首頁〕金色那一行（沒有闖關路線的在家複習頁：Review 1 句型卡，2026-10-16 C4 第 7 題） */
const HOMECSS = CSS.split('\n').filter(l => /^#bar a\.rvhome/.test(l)).join('\n') + '\n';
if (!HOMECSS.trim()) throw new Error('_route.js：找不到 #bar a.rvhome');
module.exports = { html, CSS, HOMECSS, JS };
