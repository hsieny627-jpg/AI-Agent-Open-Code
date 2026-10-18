/* live/_db.js — ⚡ 現場任務的「即時資料庫」：Firebase Realtime Database（老師 C8 第 16 題：Firebase）。只寫 ES5（iPad iOS 14）。
   網址在 live/fb.js 的 window.LIVE_DB（空白 ＝ 現場任務關著）。量測（live/_verify.js）：LIVE_DB 指到量測自己開的假伺服器，**絕對不連真的 Firebase**。
   資料只有：班級的遊戲（0＋班級）、5 碼、答了第幾個、分數、英雄圖的代號。**沒有姓名**。

   2026-10-18 第十二次（老師：學生 等不到 第一題、老師 收不到 答案、兩邊 不同步）：
   原本 用「一直 連著 的 線」（EventSource）聽。一台 電腦 連 同一個 網站 最多 同時 6 條 線；大螢幕 自己 就 佔 4 條，
   老師 再 多 開 一個 分頁（老師看板、自己 試 學生頁）就 滿了 ➜「送 題目」那一條 排不進去。
   ➜ 改成「每 0.7 秒 問 一次」（輪詢）：每一次 問 完 就 放掉 線，永遠 不會 塞住；量測 跟 真的 Firebase 一模一樣（只用 GET／PUT／PATCH）。
   大螢幕 每 寫 一次 遊戲 狀態（m）就 把 版本號（v）＋1；平板 只 問 很小 的 v，變了 才 拿 m（省 流量）。
   寫 失敗（網路 一下 斷掉）＝ 自己 重試；連續 失敗 ➜ LDB.bad ＝ true（畫面 上 寫「📶 重新 連線 中…」） */
var LDB=(function(){
  var URL=String(window.LIVE_DB||'').replace(/\/+$/,''),FAIL=0,ST=[];
  function on(){return !!URL}
  function seg(p){return String(p).replace(/^\/+|\/+$/g,'').split('/').filter(function(x){return x!==''})}
  function u(p){return URL+'/'+seg(p).join('/')+'.json'}
  function mark(ok){FAIL=ok?0:FAIL+1;var b=FAIL>=3;if(b!==LDB.bad){LDB.bad=b;ST.forEach(function(f){f(b)})}}
  function req(m,p,v){if(!URL)return Promise.resolve(false);
    return fetch(u(p),{method:m,cache:'no-store',body:m==='DELETE'?undefined:JSON.stringify(v)}).then(function(r){mark(r.ok);return r.ok},function(){mark(false);return false})}
  function get(p){if(!URL)return Promise.resolve(null);
    return fetch(u(p),{cache:'no-store'}).then(function(r){mark(r.ok);if(!r.ok)throw 0;return r.json()}).catch(function(){mark(false);throw 0})}
  /* 一定 要 寫進去：失敗 就 每 0.8 秒 再 試（最多 n 次）*/
  function must(m,p,v,n){n=n==null?12:n;return req(m,p,v).then(function(ok){if(ok||n<=0)return ok;return new Promise(function(r){setTimeout(r,800)}).then(function(){return must(m,p,v,n-1)})})}
  /* 輪詢：每 ms 毫秒 問 一次（上一次 回來 才 問 下一次，不會 疊起來）；內容 變了 才 叫 cb */
  function poll(p,ms,cb){var stop=false,last='\u0000',t=null;
    function go(){if(stop)return;get(p).then(function(v){if(stop)return;var s=JSON.stringify(v);if(s!==last){last=s;cb(v)}},function(){}).then(function(){if(!stop)t=setTimeout(go,ms)})}
    go();return function(){stop=true;clearTimeout(t)}}
  /* 遊戲 狀態：問 rooms/班/v（很小），變了 才 拿 m */
  function watch(room,ms,cb){var stop=false,lv='\u0000',t=null;
    function go(){if(stop)return;get('rooms/'+room+'/v').then(function(v){if(stop)return;var s=JSON.stringify(v);if(s===lv)return;
        return get('rooms/'+room+'/m').then(function(m){if(stop)return;lv=s;cb(m)})},function(){}).then(function(){if(!stop)t=setTimeout(go,ms)},function(){if(!stop)t=setTimeout(go,ms)})}
    go();return function(){stop=true;clearTimeout(t)}}
  return {on:on,get:get,set:function(p,v){return req('PUT',p,v)},patch:function(p,v){return req('PATCH',p,v)},del:function(p){return req('DELETE',p)},
    must:must,poll:poll,watch:watch,bad:false,onBad:function(f){ST.push(f)}}
})();
