/* score/_deploy_page.js — 部署步驟的「大字秒懂」網頁 score/deploy.html（使用者 2026-10-07：說明太複雜、視力不佳 ➜ 字放大、秒懂圖表、秒懂動畫）
 *
 * 一頁一步、一步一句話；每一步畫一張「示意圖」（Google 畫面的簡圖），👆 手指一格一格點給你看要按哪裡。
 * 〔📋 複製程式〕按一下就把 Code.gs 複製好（build 時放進網頁，不用去 GitHub 找）。
 * 字：標題 ≧ 48px、內文 ≧ 30px；右上角 A＋／A－ 可以再放大。score/_build.js 呼叫，不要手改 deploy.html。
 */
module.exports = function (CODE) {
  /* 每一步：t ＝ 一句話、m ＝ 示意圖（data-tap="1"、"2"… ＝ 手指點的順序；data-say ＝ 手指旁邊的小字）、tip ＝ 小提醒（可以沒有） */
  const STEPS = [
    { t: '開一個新的 Google 試算表', m: `
      <div class="win"><div class="url">sheets.google.com</div>
        <div class="row"><div class="tile plus" data-tap="1" data-say="按這裡">＋<small>空白試算表</small></div><div class="tile ghost"></div><div class="tile ghost"></div></div></div>
      <a class="big go" href="https://sheets.google.com" target="_blank" rel="noopener">🌐 打開 Google 試算表</a>` },
    { t: '按「擴充功能」➜「Apps Script」', m: `
      <div class="win"><div class="menu"><span>檔案</span><span>編輯</span><span>插入</span><span class="hot" data-tap="1" data-say="① 先按">擴充功能</span><span>說明</span></div>
        <div class="drop"><div>外掛程式</div><div class="hot" data-tap="2" data-say="② 再按">Apps Script</div></div></div>`, tip: '會開一個新分頁' },
    { t: '把裡面的程式全部刪掉', m: `
      <div class="win"><div class="code"><div class="file">📄 程式碼.gs</div>
        <div class="lines sel" data-tap="1" data-say="按一下這裡">function myFunction() {<br>&nbsp;&nbsp;…<br>}</div></div></div>
      <div class="keys"><span class="key" data-tap="2" data-say="② 全選">Ctrl</span>＋<span class="key">A</span>　<span class="key" data-tap="3" data-say="③ 刪掉">Delete</span></div>`, tip: 'Mac：⌘ ＋ A' },
    { t: '複製程式 ➜ 貼上 ➜ 存檔', m: `
      <button class="big gold" id="copy" data-tap="1" data-say="① 按這顆">📋 複製程式</button>
      <div class="keys"><span class="key" data-tap="2" data-say="② 回到 Apps Script 貼上">Ctrl</span>＋<span class="key">V</span></div>
      <div class="win"><div class="bar"><span class="ico hot" data-tap="3" data-say="③ 存檔">💾</span><span class="ico">▶ 執行</span></div></div>`, tip: 'Mac：⌘ ＋ V' },
    { t: '設定老師看板的密碼', m: `
      <div class="win split"><div class="side"><span>&lt; &gt;</span><span class="hot" data-tap="1" data-say="① 齒輪">⚙️</span></div>
        <div class="pane2"><div class="btn" data-tap="2" data-say="② 往下捲，按這個">新增指令碼屬性</div>
          <div class="kv"><span class="box" data-tap="3" data-say="③ 貼上">TEACHER_PW</span><span class="box" data-tap="4" data-say="④ 打你的密碼（只打在這裡）">●●●●●●●●</span></div>
          <div class="btn blue" data-tap="5" data-say="⑤ 儲存">儲存指令碼屬性</div></div></div>
      <button class="big" id="copyk">📋 複製 TEACHER_PW</button>` },
    { t: '按「部署」➜「新增部署作業」', m: `
      <div class="win"><div class="bar"><span class="sp"></span><span class="btn blue" data-tap="1" data-say="① 右上角">部署 ▾</span></div>
        <div class="drop r"><div class="hot" data-tap="2" data-say="② 再按">新增部署作業</div><div>管理部署作業</div></div></div>` },
    { t: '選「網頁應用程式」，誰可以存取選「所有人」', m: `
      <div class="win"><div class="kv2"><span class="hot gear" data-tap="1" data-say="① 齒輪">⚙️</span><span class="hot" data-tap="2" data-say="② 選這個">網頁應用程式</span></div>
        <div class="form"><div><b>執行身分</b><span class="sel2" data-tap="3" data-say="③ 選「我」">我</span></div>
          <div><b>誰可以存取</b><span class="sel2" data-tap="4" data-say="④ 選「所有人」">所有人</span></div></div>
        <div class="btn blue" data-tap="5" data-say="⑤ 部署">部署</div></div>` },
    { t: '按「允許」（Google 要你同意）', m: `
      <div class="flow"><span class="u"><div class="card" data-tap="1" data-say="①">審查權限</div></span>
        <span class="u"><span class="ar">➜</span><div class="card" data-tap="2" data-say="②">選你的帳號</div></span>
        <span class="u"><span class="ar">➜</span><div class="card" data-tap="3" data-say="③ 左下角">進階</div></span>
        <span class="u"><span class="ar">➜</span><div class="card" data-tap="4" data-say="④">前往（不安全）</div></span>
        <span class="u"><span class="ar">➜</span><div class="card ok" data-tap="5" data-say="⑤">允許</div></span></div>`, tip: '看到「不安全」別擔心：這是你自己的程式，Google 不認識它' },
    { t: '複製網址，貼給 Claude', m: `
      <div class="win"><div class="sec">網頁應用程式</div><div class="kv"><span class="box url2">https://script.google.com/…/exec</span><span class="btn" data-tap="1" data-say="① 複製">複製</span>
        <span class="btn blue" data-tap="2" data-say="② 完成">完成</span></div></div>
      <div class="chat" data-tap="3" data-say="③ 貼給 Claude">💬 貼到和 Claude 的對話</div>`, tip: 'Claude 放上網站，📝 複習題、🎮 遊戲、📘 Review 1 的成績就開始記' }
  ];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>成績紀錄 部署步驟</title>
<!-- 本檔由 score/_build.js 產生（score/_deploy_page.js），不要手改。 -->
<style>
@font-face{font-family:Andika;font-weight:400;src:url(../words/fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-weight:700;src:url(../words/fonts/andika-700.woff2) format("woff2")}
:root{--z:1;--gold:#FFD24A;--ok:#5BE39A;--acc:#7FBFFF}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;background:#000;color:#fff;font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif;font-weight:700}
body{min-height:100vh;display:flex;flex-direction:column;padding:calc(env(safe-area-inset-top) + 12px) 16px calc(env(safe-area-inset-bottom) + 16px)}
header{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
#dots{display:flex;gap:8px;flex:1;flex-wrap:wrap}
#dots i{width:calc(18px*var(--z));height:calc(18px*var(--z));border-radius:50%;background:#333;cursor:pointer}
#dots i.on{background:var(--gold)}#dots i.done{background:#3A8F5E}
.zb button{font-size:calc(24px*var(--z));min-width:60px;min-height:48px;border-radius:16px;background:#1A1A1A;border:2px solid #555;color:#fff;font-family:inherit;font-weight:700;cursor:pointer}
main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(min(18px,2vh)*var(--z));text-align:center;padding:8px 0}
.n{font-size:calc(34px*var(--z));color:var(--gold)}
h1{margin:0;font-size:calc(clamp(34px,min(5.6vw,6.6vh),60px)*var(--z));line-height:1.25;max-width:1100px}
.tip{font-size:calc(clamp(24px,min(3vw,3.8vh),32px)*var(--z));color:#CFE3F5;background:#0F2236;border:2px solid #3A5266;border-radius:18px;padding:10px 20px;max-width:1000px}
.stage{position:relative;display:flex;flex-direction:column;align-items:center;gap:calc(min(16px,1.5vh)*var(--z));width:100%;max-width:1000px;}
.win{background:#F4F6F8;color:#222;border-radius:18px;border:4px solid #888;padding:calc(min(14px,1.5vh)*var(--z));width:100%;max-width:900px;font-size:calc(clamp(24px,min(3vw,3.9vh),34px)*var(--z));text-align:left;position:relative}
.win::before{content:'示意圖';position:absolute;right:12px;top:-1.4em;font-size:.6em;color:#9E9E9E}
.url{background:#fff;border:2px solid #ccc;border-radius:999px;padding:4px 16px;color:#555;margin-bottom:12px;font-size:.8em}
.row{display:flex;gap:14px}.tile{width:30%;aspect-ratio:3/2;border-radius:12px;background:#fff;border:2px solid #ccc;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:2em;color:#1A73E8}
.tile small{font-size:.38em;color:#222}.tile.ghost{opacity:.4}
.menu{display:flex;gap:18px;flex-wrap:wrap;border-bottom:2px solid #ccc;padding-bottom:8px}
.drop{background:#fff;border:2px solid #ccc;border-radius:12px;padding:8px;margin:10px 0 0 30%;width:fit-content;display:flex;flex-direction:column;gap:8px}
.drop.r{margin-left:auto}
.drop div{padding:6px 16px;border-radius:8px}
.hot{border-radius:10px;padding:2px 10px}
.code .file{font-size:.8em;color:#555;margin-bottom:6px}.lines{background:#fff;border:2px solid #ccc;border-radius:10px;padding:10px 14px;font-family:monospace;color:#1A73E8}
.keys{font-size:calc(clamp(30px,min(4vw,5vh),44px)*var(--z));display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center}
.key{display:inline-block;min-width:2.2em;padding:6px 16px;border-radius:14px;background:#222;border:3px solid #888;box-shadow:0 6px 0 #555}
.bar{display:flex;gap:16px;align-items:center}.bar .sp{flex:1}.ico{padding:4px 12px;border-radius:10px;background:#fff;border:2px solid #ccc}
.split{display:flex;gap:16px;padding-top:8px;padding-bottom:8px}.split .pane2{gap:6px}.side{display:flex;flex-direction:column;gap:14px;padding-right:12px;border-right:2px solid #ccc;font-size:1.2em}
.pane2{flex:1;display:flex;flex-direction:column;gap:12px}.sec{font-size:.9em;color:#555}
.btn{display:inline-block;width:fit-content;padding:6px 18px;border-radius:12px;background:#fff;border:2px solid #1A73E8;color:#1A73E8}
.btn.blue{background:#1A73E8;color:#fff}
.kv,.kv2{display:flex;gap:12px;flex-wrap:wrap;align-items:center}.box{max-width:100%;overflow-wrap:anywhere;background:#fff;border:2px solid #999;border-radius:10px;padding:6px 14px;font-family:monospace}
.url2{font-size:.8em;color:#1A73E8;word-break:break-all}
.form{display:flex;flex-direction:column;gap:10px;margin:12px 0}.form div{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.sel2{background:#fff;border:2px solid #999;border-radius:10px;padding:4px 16px}
.gear{font-size:1.2em}
.flow{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;font-size:calc(clamp(24px,3vw,34px)*var(--z))}
.card{background:#F4F6F8;color:#222;border:4px solid #888;border-radius:16px;padding:12px 18px}.card.ok{background:#1A73E8;color:#fff}
.ar{color:var(--gold);font-size:1.3em}.flow .u{display:inline-flex;align-items:center;gap:10px}
.flow{row-gap:calc(52px*var(--z))}
.chat{font-size:calc(clamp(26px,3.4vw,38px)*var(--z));background:#2A2208;border:3px solid var(--gold);border-radius:18px;padding:12px 24px}
.big{font-size:calc(clamp(28px,min(3.8vw,4.8vh),42px)*var(--z));font-family:inherit;font-weight:700;border-radius:999px;padding:10px 32px;min-height:64px;cursor:pointer;
 background:#141A20;border:3px solid #5A6A78;color:#fff;text-decoration:none;display:inline-block}
.big.gold{background:#2A2208;border-color:var(--gold);color:#FFE9A8}.big.go{background:#0F3323;border-color:var(--ok)}
.big.done{background:#0F3323;border-color:var(--ok);color:#fff}
/* 👆 手指：一格一格點給你看 */
.tap{outline:6px solid var(--gold)!important;outline-offset:4px;animation:pulse .9s ease-in-out infinite}
@keyframes pulse{50%{outline-color:rgba(255,210,74,.25)}}
#fing{position:absolute;z-index:5;pointer-events:none;font-size:calc(64px*var(--z));line-height:1;transition:left .6s cubic-bezier(.3,.9,.3,1),top .6s cubic-bezier(.3,.9,.3,1);filter:drop-shadow(0 4px 6px #000)}
#fing.press{animation:press .5s ease-out}
@keyframes press{40%{transform:scale(.8) translateY(6px)}}
/* 現在要按哪裡：固定在示意圖上面一行（不會蓋到任何按鈕） */
#say{display:block;min-height:1.3em;line-height:1.3;background:var(--gold);color:#000;border-radius:16px;padding:2px 22px;font-size:calc(clamp(24px,min(3.4vw,3.6vh),36px)*var(--z));animation:sayIn .35s ease-out}
#say:empty{visibility:hidden}
@keyframes sayIn{from{transform:scale(.85);opacity:.3}}
/* 字放大以後一頁放不下：〔下一步〕永遠黏在最下面看得到 */
nav{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;position:sticky;bottom:0;background:#000;padding:10px 0 4px;z-index:9}
nav button{font-size:calc(clamp(28px,min(3.6vw,4.6vh),40px)*var(--z));font-family:inherit;font-weight:700;min-height:min(72px,8.4vh);padding:8px 40px;border-radius:999px;cursor:pointer;background:#1A1A1A;border:3px solid #666;color:#fff}
nav #nx{background:#0F3323;border-color:var(--ok)}
nav button:disabled{opacity:.3}
.end h1{color:var(--ok)}
.end ol{font-size:calc(clamp(26px,3.2vw,36px)*var(--z));text-align:left;line-height:1.6;margin:0}
</style></head><body>
<header><div id="dots"></div><span class="zb"><button id="zm" aria-label="字變小">A－</button> <button id="zp" aria-label="字變大">A＋</button></span></header>
<main id="main"></main>
<nav><button id="pv">◀ 上一步</button><button id="rp">🔁 再看一次</button><button id="nx">下一步 ▶</button></nav>
<script>
var STEPS=${JSON.stringify(STEPS)};
var CODE=${JSON.stringify(CODE).replace(/</g, '\\u003c')};
var K=0,TT=[],Z=1;
try{K=Math.max(0,Math.min(STEPS.length,+(localStorage.getItem('dep_k')||0)));Z=+(localStorage.getItem('dep_z')||1)||1}catch(e){}
function $(s){return document.querySelector(s)}
function zoom(z){Z=Math.max(.8,Math.min(1.6,z));document.documentElement.style.setProperty('--z',Z);try{localStorage.setItem('dep_z',Z)}catch(e){};play()}
function draw(){
  TT.forEach(clearTimeout);TT=[];
  $('#dots').innerHTML=STEPS.map(function(s,n){return '<i data-k="'+n+'" class="'+(n===K?'on':n<K?'done':'')+'"></i>'}).join('')+'<i data-k="'+STEPS.length+'" class="'+(K===STEPS.length?'on':'')+'" style="border-radius:6px"></i>';
  if(K===STEPS.length){
    $('#main').innerHTML='<div class="end"><div class="n">🎉 完成了！</div><h1>做完以後試一次</h1><ol><li>平板打開句型頁，按〔📝 複習題 5 題〕</li><li>看到「🔢 輸入你的號碼」＝ 成功</li><li>打 30401，做完 5 題</li><li>試算表「紀錄」多一列 ✅</li><li>🎮 玩一個遊戲到時間到 ➜ 再多一列 ✅</li></ol></div>';
  }else{
    var s=STEPS[K];
    $('#main').innerHTML='<div class="n">第 '+(K+1)+' 步　／　共 '+STEPS.length+' 步</div><h1>'+s.t+'</h1><div class="stage" id="stage"><span id="say"></span>'+s.m+'<span id="fing">👆</span></div>'+(s.tip?'<div class="tip">💡 '+s.tip+'</div>':'');
  }
  $('#pv').disabled=K===0;$('#nx').disabled=K===STEPS.length;$('#rp').hidden=K===STEPS.length;
  try{localStorage.setItem('dep_k',K)}catch(e){}
  play();
}
/* 手指照 data-tap 的順序一格一格點，點到的那一格亮金框，旁邊寫要做什麼；點完停一下再重來 */
function play(){
  TT.forEach(clearTimeout);TT=[];
  var st=$('#stage'),f=$('#fing'),sy=$('#say');if(!st)return;
  var L=[].slice.call(st.querySelectorAll('[data-tap]')).sort(function(a,b){return a.getAttribute('data-tap')-b.getAttribute('data-tap')});
  var go=function(n){
    L.forEach(function(x){x.classList.remove('tap')});
    if(n>=L.length){TT.push(setTimeout(function(){go(0)},1800));return}
    var x=L[n];
    /* 先換字再量位置（手機上字變兩行，下面的東西會往下移） */
    sy.textContent='👆 '+(x.getAttribute('data-say')||'');sy.style.animation='none';void sy.offsetWidth;sy.style.animation='';
    var r=x.getBoundingClientRect(),b=st.getBoundingClientRect();
    f.style.left=(r.left-b.left+r.width/2-f.offsetWidth*.35)+'px';f.style.top=(r.top-b.top+r.height*.55)+'px';

    TT.push(setTimeout(function(){x.classList.add('tap');f.classList.remove('press');void f.offsetWidth;f.classList.add('press')},650));
    TT.push(setTimeout(function(){go(n+1)},2300));
  };
  go(0);
}
function copy(t,b,ok){
  var done=function(){var o=b.textContent;b.textContent=ok;b.classList.add('done');setTimeout(function(){b.textContent=o;b.classList.remove('done')},2500)};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,function(){fb()})}else fb();
  function fb(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();
    try{document.execCommand('copy');done()}catch(e){}document.body.removeChild(a)}
}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#nx')&&K<STEPS.length){K++;draw();return}
  if(c('#pv')&&K>0){K--;draw();return}
  if(c('#rp')){play();return}
  if((b=c('#dots i'))){K=+b.getAttribute('data-k');draw();return}
  if((b=c('#copy'))){copy(CODE,b,'✅ 複製好了！');return}
  if((b=c('#copyk'))){copy('TEACHER_PW',b,'✅ 複製好了！');return}
  if(c('#zp')){zoom(Z+.15);return}
  if(c('#zm')){zoom(Z-.15);return}
});
document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'&&K<STEPS.length){K++;draw()}else if(e.key==='ArrowLeft'&&K>0){K--;draw()}});
window.addEventListener('resize',play);
document.documentElement.style.setProperty('--z',Z);
draw();
</script>
</body></html>`;
};
