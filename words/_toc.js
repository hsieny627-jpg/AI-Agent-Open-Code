/* words/_toc.js — 📑 目次（使用者 2026-09-25 指定：每一個主題的字卡、故事頁、出處都要有目次）
 * 故事頁（一幕一格）用 TOCJS；字卡（一個字一格，連到那一頁）用 linksHTML()。
 * 按了才蓋上整頁，平常完全不佔版面；Esc／✕ 關掉。 */
/* 📑 目次（使用者 2026-09-25 指定：每一個主題都要有目次）：一幕一格，點了直接跳過去 */
const TOCB='<button id="tocb">📑 目次</button>';
const TOCHTML='<div id="toc"><div class="thd"><b>📑 目次</b><button id="tocx">✕ 關閉</button></div><div class="tgd" id="tocg"></div></div>';
const TOCJS=`(function(){var T=document.getElementById("toc");
 function lbl(s,k){var t=(s.tag||s.k||s.mid||(k===0?"開場":"第 "+(k+1)+" 幕"));return String(t).replace(/<[^>]+>/g,"")}
 function open(){document.getElementById("tocg").innerHTML=S.map(function(s,k){
   return '<button data-k="'+k+'"'+(k===i?' class="cur"':'')+'><b>'+(k+1)+'</b><span>'+lbl(s,k)+'</span></button>'}).join("");
  T.classList.add("on")}
 document.getElementById("tocb").addEventListener("click",open);
 document.getElementById("tocx").addEventListener("click",function(){T.classList.remove("on")});
 T.addEventListener("click",function(e){var b=e.target.closest?e.target.closest("[data-k]"):null;if(!b)return;
  T.classList.remove("on");show(+b.getAttribute("data-k"))});
 document.addEventListener("keydown",function(e){if(T.classList.contains("on")){if(e.key==="Escape")T.classList.remove("on");
  e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation()}},true);
})();`;
const TOCCSS=`#toc{position:fixed;inset:0;z-index:45;background:#000;display:none;flex-direction:column;
 padding:max(10px,env(safe-area-inset-top)) clamp(12px,3vw,34px) max(10px,env(safe-area-inset-bottom));overflow:auto}
#toc.on{display:flex}
#toc .thd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
#toc .thd b{font-size:clamp(20px,3.4vh,30px);color:#9FB4C8}
#toc .thd button,#toc .tgd button{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;font-family:inherit;
 font-size:clamp(15px,2.3vh,21px);padding:8px 18px;min-height:46px;cursor:pointer}
#toc .tgd{display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(200px,26vw,300px),1fr));gap:8px}
#toc .tgd button{display:flex;align-items:center;gap:10px;text-align:left;border-radius:14px;background:#0C0C0C;border-color:#2A2A2A}
#toc .tgd button b{flex:0 0 auto;width:2em;height:2em;border-radius:50%;background:#1E2A36;display:flex;align-items:center;justify-content:center}
#toc .tgd button.cur{border-color:#FFD24A;background:#1D1908}`;
/* 字卡的目次：同一組的每一個單字一格，點了就到那一張 */
const linksHTML=(items,cur)=>'<div id="toc"><div class="thd"><b>📑 目次</b><button id="tocx">✕ 關閉</button></div><div class="tgd">'+
 items.map((w,k)=>'<a href="'+w.href+'"'+((w.k||w.f)===cur?' class="cur"':'')+'><b>'+(k+1)+'</b><span>'+(w.icon||'')+' '+w.f+'　'+w.zh+'</span></a>').join('')+'</div></div>';
const LINKJS=`(function(){var T=document.getElementById("toc");
 document.getElementById("tocb").addEventListener("click",function(){T.classList.add("on")});
 document.getElementById("tocx").addEventListener("click",function(){T.classList.remove("on")});
 document.addEventListener("keydown",function(e){if(T.classList.contains("on")){if(e.key==="Escape")T.classList.remove("on");
  e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation()}},true);
})();`;
module.exports={TOCB,TOCHTML,TOCJS,TOCCSS:TOCCSS+`
#toc .tgd a{display:flex;align-items:center;gap:10px;text-align:left;border-radius:14px;background:#0C0C0C;border:1px solid #2A2A2A;
 color:#F2F2F2;text-decoration:none;font-size:clamp(15px,2.3vh,21px);padding:8px 14px;min-height:50px}
#toc .tgd a b{flex:0 0 auto;width:2em;height:2em;border-radius:50%;background:#1E2A36;display:flex;align-items:center;justify-content:center}
#toc .tgd a.cur{border-color:#FFD24A;background:#1D1908}`,linksHTML,LINKJS};
