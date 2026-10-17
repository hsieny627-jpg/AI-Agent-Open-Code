/* live/_setup_page.js — ⚡ 現場任務的大字版 Firebase 設定頁 live/setup.html（老師視力不佳：一頁一步、一步一句話、👆 手指一格一格點給你看）
 *   live/_build.js 呼叫（樣子跟 score/deploy.html 一樣：CSS 直接拿那一頁的）。最後一步可以當場〔✅ 測試〕網址通不通。 */
const fs = require('fs'), path = require('path');
const dep = fs.readFileSync(path.join(__dirname, '..', 'score', 'deploy.html'), 'utf8');
const CSS = (/<style>([\s\S]*?)<\/style>/.exec(dep) || [])[1];
if (!CSS) throw new Error('live/setup.html：拿不到 score/deploy.html 的樣子');
const RULES = JSON.stringify({ rules: { '.read': false, '.write': false, rooms: { $code: { '.read': '$code.matches(/^[0-9]{4}$/)', '.write': '$code.matches(/^[0-9]{4}$/)' } } } }, null, 2);
const STEPS = [
  { t: '打開 Firebase，用 Google 帳號 登入', m: `<div class="win"><div class="url">console.firebase.google.com</div><div class="row"><div class="tile plus" data-tap="1" data-say="按這裡">＋<small>建立專案</small></div><div class="tile ghost"></div></div></div>
    <a class="big go" href="https://console.firebase.google.com" target="_blank" rel="noopener">🌐 打開 Firebase</a>`, tip: '免費（Spark 方案），不用信用卡' },
  { t: '專案名稱 隨便打（例：english-live）➜ 繼續', m: `<div class="win"><div class="form"><div><b>專案名稱</b><span class="box" data-tap="1" data-say="① 打名字">english-live</span></div></div><div class="btn blue" data-tap="2" data-say="② 繼續">繼續</div></div>` },
  { t: 'Google Analytics：關掉 ➜ 建立專案', m: `<div class="win"><div class="form"><div><span class="sel2" data-tap="1" data-say="① 關掉">⬤ ➜ ◯ 關閉</span><b>Google Analytics</b></div></div><div class="btn blue" data-tap="2" data-say="② 建立專案">建立專案</div></div>`, tip: '等它轉完，按「繼續」' },
  { t: '左邊「建構」➜「Realtime Database」', m: `<div class="win split"><div class="side"><span class="hot" data-tap="1" data-say="① 建構">建構 ▾</span><span class="hot" data-tap="2" data-say="② 這個">Realtime Database</span><span>Firestore</span></div><div class="pane2"><div class="btn blue" data-tap="3" data-say="③ 建立資料庫">建立資料庫</div></div></div>`, tip: '不是 Firestore，是 Realtime Database' },
  { t: '位置選「新加坡」➜ 下一步 ➜「鎖定模式」➜ 啟用', m: `<div class="win"><div class="form"><div><b>位置</b><span class="sel2" data-tap="1" data-say="① 新加坡（離台灣最近）">新加坡 (asia-southeast1)</span></div></div>
    <div class="btn blue" data-tap="2" data-say="② 下一步">下一步</div><div class="form"><div><span class="sel2" data-tap="3" data-say="③ 選這個">⬤ 以鎖定模式啟動</span></div></div><div class="btn blue" data-tap="4" data-say="④ 啟用">啟用</div></div>` },
  { t: '上面「規則」➜ 全部刪掉 ➜ 貼上 ➜ 發布', m: `<div class="win"><div class="menu"><span>資料</span><span class="hot" data-tap="1" data-say="① 規則">規則</span><span>備份</span></div><div class="code"><div class="lines sel" data-tap="2" data-say="② 全選 刪掉">{ "rules": { … } }</div></div></div>
    <button class="big gold" id="copyr" data-tap="3" data-say="③ 按這顆，再貼上（Ctrl＋V）">📋 複製規則</button><div class="win"><div class="bar"><span class="sp"></span><span class="btn blue" data-tap="4" data-say="④ 發布">發布</span></div></div>`, tip: '規則的意思：只有 4 位數 的 房間 可以 讀寫；沒有 姓名、沒有 成績' },
  { t: '上面「資料」➜ 複製 最上面的 網址', m: `<div class="win"><div class="menu"><span class="hot" data-tap="1" data-say="① 資料">資料</span><span>規則</span></div><div class="kv"><span class="box url2" data-tap="2" data-say="② 這一串 網址 旁邊 有 複製">https://english-live-xxxx-default-rtdb.asia-southeast1.firebasedatabase.app</span></div></div>` },
  { t: '貼在下面 ➜ 按〔✅ 測試〕', m: `<input id="u" class="box" style="font-size:24px;width:min(900px,92vw);min-height:60px" placeholder="https://….firebasedatabase.app" autocomplete="off">
    <button class="big go" id="test" data-tap="1" data-say="按這顆 測試">✅ 測試</button><div id="tm" class="tip" style="min-height:1.4em"></div>`, tip: '測試 成功 ➜ 把 網址 貼在 跟 Claude 的 對話 裡，Claude 會 放進 網站（live/fb.js）' }];
const KEY = 'lvsetup';
const html = `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex">
<title>現場任務 設定</title>
<style>${CSS}
textarea.rules{display:none}</style></head><body>
<header><div id="dots"></div><span class="zb"><button id="zm" aria-label="字變小">A－</button> <button id="zp" aria-label="字變大">A＋</button></span></header>
<main id="main"></main>
<nav><button id="pv">◀ 上一步</button><button id="rp">🔁 再看一次</button><button id="nx">下一步 ▶</button></nav>
<script>
var STEPS=${JSON.stringify(STEPS)},RULES=${JSON.stringify(RULES)};
var K=0,TT=[],Z=1;
try{K=Math.max(0,Math.min(STEPS.length,+(localStorage.getItem('${KEY}_k')||0)));Z=+(localStorage.getItem('${KEY}_z')||1)||1}catch(e){}
document.documentElement.style.setProperty('--z',Z);
function $(s){return document.querySelector(s)}
function zoom(z){Z=Math.max(.8,Math.min(1.6,z));document.documentElement.style.setProperty('--z',Z);try{localStorage.setItem('${KEY}_z',Z)}catch(e){};play()}
function draw(){TT.forEach(clearTimeout);TT=[];
  $('#dots').innerHTML=STEPS.map(function(s,n){return '<i data-k="'+n+'" class="'+(n===K?'on':n<K?'done':'')+'"></i>'}).join('')+'<i data-k="'+STEPS.length+'" class="'+(K===STEPS.length?'on':'')+'" style="border-radius:6px"></i>';
  if(K===STEPS.length)$('#main').innerHTML='<div class="end"><div class="n">🎉 完成了！</div><h1>最後一件事</h1><ol><li>把 第 8 步 的 網址 <b>貼給 Claude</b></li><li>Claude 放進 網站 以後：老師 打開 <a href="host.html" style="color:var(--acc)">⚡ 現場任務 大螢幕</a></li><li>學生 打開 首頁 的〔⚡ 現場任務〕</li></ol></div>';
  else{var s=STEPS[K];$('#main').innerHTML='<div class="n">第 '+(K+1)+' 步　／　共 '+STEPS.length+' 步</div><h1>'+s.t+'</h1><div class="stage" id="stage"><span id="say"></span>'+s.m+'<span id="fing">👆</span></div>'+(s.tip?'<div class="tip">💡 '+s.tip+'</div>':'');
    var u=$('#u');if(u){try{u.value=localStorage.getItem('${KEY}_u')||''}catch(e){}}}
  $('#pv').disabled=K===0;$('#nx').disabled=K===STEPS.length;$('#rp').hidden=K===STEPS.length;try{localStorage.setItem('${KEY}_k',K)}catch(e){}play()}
function play(){TT.forEach(clearTimeout);TT=[];var st=$('#stage'),f=$('#fing'),sy=$('#say');if(!st)return;
  var L=[].slice.call(st.querySelectorAll('[data-tap]')).sort(function(a,b){return a.getAttribute('data-tap')-b.getAttribute('data-tap')});
  var go=function(n){L.forEach(function(x){x.classList.remove('tap')});if(n>=L.length){TT.push(setTimeout(function(){go(0)},1800));return}
    var x=L[n];sy.textContent='👆 '+(x.getAttribute('data-say')||'');var r=x.getBoundingClientRect(),b=st.getBoundingClientRect();
    f.style.left=(r.left-b.left+r.width/2-f.offsetWidth*.35)+'px';f.style.top=(r.top-b.top+r.height*.55)+'px';
    TT.push(setTimeout(function(){x.classList.add('tap');f.classList.remove('press');void f.offsetWidth;f.classList.add('press')},650));TT.push(setTimeout(function(){go(n+1)},2300))};go(0)}
function copy(t,b,ok){var done=function(){var o=b.textContent;b.textContent=ok;b.classList.add('done');setTimeout(function(){b.textContent=o;b.classList.remove('done')},2500)};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,fb)}else fb();
  function fb(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(e){}document.body.removeChild(a)}}
/* 測試：寫一筆到 rooms/0000、讀回來、刪掉（規則對了才會成功） */
function test(){var u=String($('#u').value||'').trim().replace(/\\/+$/,''),m=$('#tm');try{localStorage.setItem('${KEY}_u',u)}catch(e){}
  if(!/^https:\\/\\/[\\w.-]+\\.(firebasedatabase\\.app|firebaseio\\.com)$/.test(u)){m.textContent='❌ 網址 不對：要 https:// 開頭、firebasedatabase.app 結尾';return}
  m.textContent='⏳ 測試中…';var v=Date.now();
  fetch(u+'/rooms/0000/m.json',{method:'PUT',body:JSON.stringify({t:v})}).then(function(r){if(!r.ok)throw new Error('w'+r.status);return fetch(u+'/rooms/0000/m.json')}).then(function(r){return r.json()})
   .then(function(j){if(!j||j.t!==v)throw new Error('r');return fetch(u+'/rooms/0000.json',{method:'DELETE'})}).then(function(){m.textContent='✅ 成功！把 這個 網址 貼給 Claude：'+u},
    function(e){m.textContent=/w40/.test(String(e&&e.message))?'❌ 被擋住了：第 6 步 的 規則 再貼 一次、按 發布':'❌ 連不到：網址 再 看一次（'+(e&&e.message||'')+'）'})}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#nx')&&K<STEPS.length){K++;draw();return}if(c('#pv')&&K>0){K--;draw();return}if(c('#rp')){play();return}
  if((b=c('#dots i'))){K=+b.getAttribute('data-k');draw();return}
  if((b=c('#copyr'))){copy(RULES,b,'✅ 複製好了');return}if(c('#test')){test();return}
  if(c('#zp')){zoom(Z+.1);return}if(c('#zm')){zoom(Z-.1);return}});
window.addEventListener('resize',function(){play()});
draw();
</script></body></html>`;
fs.writeFileSync(path.join(__dirname, 'setup.html'), html);
module.exports = { RULES };
