/* live/_db.js — ⚡ 現場任務的「即時資料庫」：Firebase Realtime Database（老師 C8 第 16 題：Firebase）。只寫 ES5（iPad iOS 14）。
   不用 Firebase 的程式庫（離線、版本都不怕）：讀 ＝ EventSource（REST 串流，Firebase 官方支援）、寫 ＝ fetch PUT／PATCH／DELETE。
   網址在 live/fb.js 的 window.LIVE_DB（老師照大字版 live/setup.html 設定好，把網址交給 Claude 貼上；空白 ＝ 現場任務關著）。
   量測（live/_verify.js）：LIVE_DB 指到量測自己開的假伺服器（同樣的 REST＋串流），**絕對不連真的 Firebase**。
   資料只有：房間號碼（4 碼）、5 碼、答了第幾個、分數、英雄圖的代號。**沒有姓名**。 */
var LDB=(function(){
  var URL=String(window.LIVE_DB||'').replace(/\/+$/,''),L={};
  function on(){return !!URL}
  function seg(p){return String(p).replace(/^\/+|\/+$/g,'').split('/').filter(function(x){return x!==''})}
  function getIn(t,p){var a=seg(p);for(var i=0;i<a.length;i++){if(t==null||typeof t!=='object')return null;t=t[a[i]]}return t==null?null:t}
  function setIn(t,p,v){var a=seg(p);if(!a.length)return v;var r=t&&typeof t==='object'?t:{},o=r;
    for(var i=0;i<a.length-1;i++){if(!o[a[i]]||typeof o[a[i]]!=='object')o[a[i]]={};o=o[a[i]]}
    if(v==null)delete o[a[a.length-1]];else o[a[a.length-1]]=v;return r}
  function clone(v){return v==null?null:JSON.parse(JSON.stringify(v))}
  /* ── 真的（Firebase REST）── */
  var ES={};
  function listen(p,cb){p=seg(p).join('/');(L[p]=L[p]||[]).push(cb);
    if(!URL)return function(){};
    if(!ES[p]){var M={v:null},src=new EventSource(URL+'/'+p+'.json');ES[p]={src:src,M:M};
      var up=function(e,patch){var d;try{d=JSON.parse(e.data)}catch(x){return}if(!d)return;
        if(patch){for(var k in d.data||{})M.v=setIn(M.v,d.path+'/'+k,d.data[k])}else M.v=setIn(M.v,d.path,d.data);
        (L[p]||[]).forEach(function(f){f(clone(M.v))})};
      src.addEventListener('put',function(e){up(e,false)});src.addEventListener('patch',function(e){up(e,true)})}
    else setTimeout(function(){cb(clone(ES[p].M.v))},0);
    return function(){off(p,cb)}}
  function off(p,cb){L[p]=(L[p]||[]).filter(function(f){return f!==cb});if(!L[p].length&&ES[p]){ES[p].src.close();delete ES[p]}}
  function req(m,p,v){if(!URL)return Promise.resolve(false);
    return fetch(URL+'/'+seg(p).join('/')+'.json',{method:m,body:m==='DELETE'?undefined:JSON.stringify(v)}).then(function(r){return r.ok},function(){return false})}
  function get(p){if(!URL)return Promise.resolve(null);
    return fetch(URL+'/'+seg(p).join('/')+'.json').then(function(r){return r.json()},function(){return null})}
  return {on:on,listen:listen,set:function(p,v){return req('PUT',p,v)},patch:function(p,v){return req('PATCH',p,v)},del:function(p){return req('DELETE',p)},get:get}
})();
