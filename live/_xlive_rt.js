/* live/_xlive_rt.js — 📝 期中 挑戰（25／50 題、新 25／新 50）在〔⚡ 現場任務〕的 學生 平板 共用（2026-10-30 第三十四次 第 10、12 點）。只寫 ES5。
 * g3mid/index.html、midterm/index.html 都 帶 這一份（放在 live/_db.js 後面）。網頁 自己 要 有：window.xForce()（時間 到 ＝ 答了 幾題 就 送 幾題）。
 * ① XLV.intro(done)：第一次 進來 先 看 一頁 秒懂 步驟 動畫（一個人／兩個人 怎麼 做），看完〔✅ 我 懂了〕才 能 按
 * ② XLV.cfg(v)：每一次 讀到 rooms/0班/cr 就 呼叫：v.left ＝ 老師 大螢幕 算 的 還剩 幾毫秒 ➜ 平板 上面 大大 的 ⏱ 倒數；v.fin ＝ 時間 到 ➜ xForce()＋「⏰ 時間 到」
 * ③ XLV.prog(room, t, id, o)：crp/5碼 ＝ {n 答了 幾題, ok 對 幾題, s 分數, p 兩人 一台 的 另一個 人, g 現在 哪一關, t}（大螢幕 即時 排行榜 用） */
var XLV=(function(){
  var css='#xlvT{position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:95;display:none;align-items:center;gap:10px;padding:6px 24px;border-radius:999px;background:#151B3A;border:3px solid #7C5CFF;color:#fff;font:700 clamp(28px,4.4vh,44px)/1.2 system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45)}'+
    '#xlvT.on{display:flex}#xlvT.lo{border-color:#FF5A5A;background:#3A1010;animation:xlvP 1s infinite}#xlvT small{font-size:.55em;color:#C9CFFF}'+
    '@keyframes xlvP{50%{transform:translateX(-50%) scale(1.08)}}'+
    '#xlvF,#xlvI{position:fixed;inset:0;z-index:99;display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:rgba(10,8,40,.96);color:#fff;text-align:center;padding:18px;font-family:system-ui,sans-serif}'+
    '#xlvF.on,#xlvI.on{display:flex}#xlvF .xf1{font-size:clamp(70px,13vh,140px);animation:xlvB 1s}#xlvF .xf2{font-size:clamp(40px,7vh,76px);font-weight:800;color:#FFD54A}#xlvF .xf3{font-size:clamp(26px,4vh,40px)}'+
    '@keyframes xlvB{0%{transform:scale(.2) rotate(-30deg)}60%{transform:scale(1.2)}100%{transform:scale(1)}}'+
    '#xlvI h2{margin:0;font-size:clamp(34px,5.4vh,56px);color:#FFD54A}#xlvI ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;width:min(980px,96vw)}'+
    '#xlvI li{display:flex;align-items:center;gap:16px;padding:10px 18px;border-radius:20px;background:#1E2550;border:3px solid #3A4590;font-size:clamp(22px,3.3vh,34px);text-align:left;opacity:0;transform:translateY(24px)}'+
    '#xlvI li.on{opacity:1;transform:none;transition:.45s}#xlvI li.cur{border-color:#FFD54A;box-shadow:0 0 0 4px rgba(255,213,74,.25)}#xlvI li .n{flex:none;width:1.7em;height:1.7em;border-radius:50%;background:#7C5CFF;display:flex;align-items:center;justify-content:center;font-weight:800}'+
    '#xlvI li .ic{flex:none;font-size:1.5em;animation:xlvH 1.6s infinite}#xlvI li b{color:#FFE38A}@keyframes xlvH{50%{transform:translateY(-6px) scale(1.1)}}'+
    '#xlvI .tw{display:inline-flex;gap:6px;align-items:center}#xlvI .tw i{font-style:normal;padding:2px 10px;border-radius:12px;background:#33407A}#xlvI .tw i.a{animation:xlvA 2.4s infinite}#xlvI .tw i.b{animation:xlvA 2.4s 1.2s infinite}'+
    '@keyframes xlvA{0%,45%{background:#FFD54A;color:#222}50%,100%{background:#33407A;color:#fff}}'+
    '#xlvI button{min-height:76px;min-width:300px;padding:8px 30px;border-radius:24px;border:0;background:#2BB673;color:#fff;font-size:clamp(28px,4vh,40px);font-weight:800}#xlvI button:disabled{background:#4A5070;color:#A8AFCF}'+
    /* 第 12-(1) 點：秒懂 動畫 看完 以後 ＝ 正上方〔🙋 一個人〕〔👥 兩個人〕、正下方〔📝 開始〕 */
    'body.crm .duo{order:-1;font-size:clamp(24px,3.4vh,34px)}body.crm .duo span{width:100%;text-align:center;color:#FFE38A}body.crm .duo button{min-height:84px;min-width:min(340px,44vw);font-size:clamp(28px,4vh,40px)}';
  var st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);
  var T=null,dl=0,lastLeft=null,fin=0,tick=null;
  function el(id,h){var o=document.getElementById(id);if(!o){o=document.createElement('div');o.id=id;document.body.appendChild(o)}if(h!=null)o.innerHTML=h;return o}
  function mm(ms){var s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+('0'+s%60).slice(-2)}
  function draw(){var o=el('xlvT');if(!dl||fin){o.classList.remove('on');return}var l=dl-Date.now();o.innerHTML='⏱ '+mm(l)+'<small>時間 到 自動 結束</small>';o.classList.add('on');o.classList.toggle('lo',l<60000)}
  function cfg(v){if(!v||!v.on||!v.d){dl=0;fin=0;lastLeft=null;draw();return}
    if(v.t!==T){T=v.t;fin=0;lastLeft=null}
    if(v.left!=null&&v.left!==lastLeft){lastLeft=v.left;dl=Date.now()+(+v.left)}
    if(!tick)tick=setInterval(draw,500);draw();
    if(v.fin&&!fin){fin=1;draw();var did=false;try{did=window.xForce?window.xForce():false}catch(e){}
      el('xlvF','<div class="xf1">⏰</div><div class="xf2">時間 到！</div><div class="xf3">'+(did?'📝 你 的 成績 已經 送 出 去 了':'這一場 結束 了')+'</div><div class="xf3">👀 請 看 大螢幕：排行榜 和 頒獎 典禮</div>').classList.add('on')}}
  function seen(k){try{return sessionStorage.getItem('xlv_in_'+k)}catch(e){return null}}
  function intro(min,done){var k=String(T||'0');if(seen(k)||window.__NOGO){done();return}
    var S=[['📺','老師 開 了 <b>'+(min?'⏱ '+min+' 分鐘':'')+' 期中 挑戰</b>'],
      ['🙋','<b>一個人 一台</b> ➜ 按〔🙋 一個人〕➜ 按〔📝 開始〕'],
      ['👥','<b>兩個人 一台</b> ➜ 按〔👥 兩個人〕➜ 按〔📝 開始〕➜ <b>第 2 個 人</b> 打 自己 的 班級號碼＋密碼'],
      ['🔁','一人 一題 輪流：<span class="tw"><i class="a">👉 第 1 個 人</i><i class="b">👉 第 2 個 人</i></span>'],
      ['⏰','時間 到 <b>自動 結束</b>，成績 自動 送 出 ➜ 👀 看 大螢幕']];
    var o=el('xlvI','<h2>📝 等一下 這樣 做</h2><ol>'+S.map(function(s,i){return '<li><span class="n">'+(i+1)+'</span><span class="ic">'+s[0]+'</span><span>'+s[1]+'</span></li>'}).join('')+'</ol><button disabled>✅ 我 懂了</button>');o.classList.add('on');
    var L=o.querySelectorAll('li'),b=o.querySelector('button'),i=0;
    (function nx(){if(i>0)L[i-1].classList.remove('cur');if(i>=L.length){b.disabled=false;return}L[i].classList.add('on','cur');i++;setTimeout(nx,1500)})();
    b.onclick=function(){if(b.disabled)return;try{sessionStorage.setItem('xlv_in_'+k,'1')}catch(e){}o.classList.remove('on');done()}}
  function prog(room,t,id,o){if(typeof LDB==='undefined'||!id)return;o.t=t;LDB.set('rooms/'+room+'/crp/'+id,o)}
  return {cfg:cfg,intro:intro,prog:prog,on:function(){return !!dl&&!fin}};
})();
