/* score/_dsp.js — 學生 看到 的 中文 說明：字詞 和 字詞 中間 不 空格（2026-10-31 第三十五次 第 11 點）
 * 老師：「學生的頁面所有的中文說明，請刪除字詞與字詞中間的空格。例如：⏰ 時間 到！你 的 成績 已經 送 出 去 了，請 看 大螢幕」
 * 做法（跟 戰神之路 第十七次 一樣）：畫面 上 的 字（text node）兩個 中文 字 中間 的 空白 拿掉；中文 和 英文、數字 中間 的 空白 留著（例「第 2 題」「I’m 七歲」）。
 * 只 改 畫面，不改 資料（送 到 老師 成績表 的 名稱、題目 照舊）。input、textarea、<script>、<style>、class="keepsp" 裡面 不 動。
 *   all(root?)：整頁（期中複習、25 題 闖關、現場任務）；sel(css)：只 改 這些 地方 裡面（例 登入 框 #scov、#scbar）。 */
const CJK = '\\u3400-\\u9fff\\uff01-\\uff0f\\uff1a-\\uff20\\u3001-\\u303f\\u2026';
const RE = '([' + CJK + '])[ \\u00a0]+(?=[' + CJK + '])';
const fix = t => String(t).replace(new RegExp(RE, 'g'), '$1');
function js(sel) {
  /* 量測：舊 的 量測 程式 用「有 空格 的 字」找 東西 ➜ 自動 測試（navigator.webdriver）先 不 改；score/_verify_dsp.js 設 __DSPTEST 專門 量 這一件 */
  return '(function(){if(window.__NODSP||(navigator.webdriver&&!window.__DSPTEST))return;var R=new RegExp(' + JSON.stringify(RE) + ",'g'),SEL=" + JSON.stringify(sel || '') + ";\n" +
    "function skip(n){var e=n.parentElement;while(e){var t=e.tagName;if(t==='SCRIPT'||t==='STYLE'||t==='TEXTAREA'||t==='INPUT'||(e.classList&&e.classList.contains('keepsp')))return true;e=e.parentElement}return false}\n" +
    "function inSel(n){if(!SEL)return true;var e=n.nodeType===1?n:n.parentElement;return !!(e&&e.closest&&e.closest(SEL))}\n" +
    "function one(n){var v=n.nodeValue;if(!v||v.indexOf(' ')<0&&v.indexOf('\\u00a0')<0)return;if(skip(n)||!inSel(n))return;var u=v.replace(R,'$1');if(u!==v)n.nodeValue=u}\n" +
    "function walk(r){if(!r)return;if(r.nodeType===3){one(r);return}if(r.nodeType!==1)return;var w=document.createTreeWalker(r,4),n;while((n=w.nextNode()))one(n)}\n" +
    "function go(){walk(document.body);try{new MutationObserver(function(L){L.forEach(function(m){if(m.type==='characterData')one(m.target);else [].forEach.call(m.addedNodes,walk)})}).observe(document.body,{childList:true,subtree:true,characterData:true})}catch(x){}}\n" +
    "if(document.body)go();else document.addEventListener('DOMContentLoaded',go);\n" +
    "})();";
}
module.exports = { RE, fix, js };
