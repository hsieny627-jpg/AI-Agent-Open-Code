/* score/_c25.js — 2026-11-01 第三十八次 ①：🏠 25 題 闖關「英語複習任務」11 月 4 日（三）晚上 11:59 截止、11 月 5 日（四）凌晨 12:00 準時 下架
 *   老師：學生、家長 點 原來 的 網址 再也 看不到 原來 的 全部 內容；原來 的 25 題 闖關 換成 新 網址 給 老師 自己 用。
 *   老師 選 甲：新 網址（g3mid/t25.html、midterm/t25.html）只有「在 這台 電腦 登入過 老師看板」才 打得開（localStorage t25ok，老師看板 登入 就 寫、登出 就 清，30 天）。
 *   時間 用 GitHub 網頁 伺服器 的 時間（回應 的 Date），學生 改 平板 時鐘 也 沒有 用；網頁 開著 過了 12:00 也 會 自己 關。
 *   build 的 時候 已經 過了 截止 ＝ home.html 直接 換成 下架 頁（原來 的 內容 整個 不 在 檔案 裡）。
 *   window.__C25NOW ＝ 量測 用 的 假 時間。 */
const END = Date.UTC(2026, 10, 4, 16, 0, 0);   // 台灣 2026-11-05 00:00
const DUE = '11 月 4 日 週三 晚上 11:59 前 完成';
const core = `var C25={END:${END},off:0,now:function(){return (window.__C25NOW||Date.now())+C25.off},closed:function(){return C25.now()>=C25.END},
 tok:function(){try{return +localStorage.getItem('t25ok')>Date.now()}catch(e){return false}},
 srv:function(cb){if(window.__C25NOW||!window.fetch){cb&&cb();return}try{fetch(location.href.split('#')[0],{method:'HEAD',cache:'no-store'}).then(function(r){var d=Date.parse(r.headers.get('Date')||'');if(d)C25.off=d-Date.now();cb&&cb()},function(){cb&&cb()})}catch(e){cb&&cb()}}};`;
/* 學生 的 25 題 闖關（home.html）：最 前面 就 擋 */
function gateHome(g) {
  return `<script>${core}(function(){var go=function(){if(!C25.closed())return;try{window.stop()}catch(e){}location.replace('../go25/closed.html?g=${g}')};go();C25.srv(go);
 var w=function(){go();if(!C25.closed())setTimeout(w,20000)};setTimeout(w,20000)})();</script>`;
}
/* 老師 專用（t25.html）*/
function gateTeacher(g) {
  return `<script>${core}if(!C25.tok()&&!window.__T25OK){try{window.stop()}catch(e){}location.replace('../go25/closed.html?t=1&g=${g}')}window.T25=1;</script>`;
}
/* 連結、按鈕：截止 以後 自己 收起來（class c25）*/
function hideLinks() {
  return `<script>${core}(function(){var h=function(){if(C25.closed()){var s=document.createElement('style');s.textContent='.c25{display:none!important}';document.head.appendChild(s)}};h();C25.srv(h)})();</script>`;
}
/* 下架 頁（build 時 已經 過了 截止 ＝ home.html 就是 這一頁）*/
function closedPage(g) {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>英語複習任務 已經 結束</title>
<script>location.replace('../go25/closed.html?g=${g}')</script></head><body style="background:#070A16;color:#fff;font:700 28px sans-serif;text-align:center;padding:40px">🔒 英語複習任務 已經 結束</body></html>`;
}
module.exports = { END, DUE, core, gateHome, gateTeacher, hideLinks, closedPage, closed: () => Date.now() >= END };
