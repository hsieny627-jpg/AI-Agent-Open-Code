/* score/_wrev.js — 📒 錯題 總複習（2026-10-31 第三十七次 第 10 點；三年級 複習 g3mid、四年級 複習 midterm 共用）
 * 老師：25 題 闖關、期中／期末 25 題、50 題 做完 的 最後 一頁 ＝ 放大 字體 統整 這一次 全部 答錯 的 題目：
 *   (1) 英文、中文、圖示 放大　(2) 自動 唸 每一題 正確 答案 的 英文 一次、中文 一次；每一題 旁邊〔🔊〕可以 重複 聽
 *   (3) 每一個 英文 字 正下方 ＝ 中文（跟 答錯頁 同一個 做法，各 網站 自己 給 卡片 的 HTML）
 *   (4) 原來 的 題目 有 圖 ＝ 題目 和 正確 選項 的 圖 一起 放　(5) 全部 錯題 的 英文、中文 都 聽完 才 解鎖〔🔁 再 挑戰 一次〕〔🎮 回 大廳〕
 * 用法（網頁）：WREV.run(host, items, btnsHTML)
 *   items[k] ＝ { head: '第 3 題｜🔨 打地鼠', body: 卡片 HTML（圖＋逐字 中文）, zh: '整句 中文', en: function(done){ 唸 英文，唸完 done() }, post: function(el){ 畫 canvas 之類 } }
 *   btnsHTML 裡 的 <button> 一開始 鎖住（disabled），全部 聽完 才 打開。沒有 錯題 ＝ 直接 打開。
 * 中文 ＝ 瀏覽器 的 中文 語音（zh-TW；iPad 內建）；沒有 中文 語音 ＝ 照 字數 等 一下 再 接 下一個（不會 卡住）。
 * 量測：window.__WRVFAST ＝ 英文、中文 都 只 等 0.2 秒。 */
const css = `
.wrv{width:100%;max-width:1200px;margin:10px auto 0;text-align:center}
.wrv .wrt{font-size:clamp(30px,4.4vh,46px);font-weight:800;color:#FFE07A;margin:6px 0 4px}
.wrv .wrs{font-size:clamp(20px,2.8vh,28px);color:#CFE6FF;margin-bottom:10px}
.wrc{position:relative;margin:14px 0;padding:14px 16px 16px;border-radius:22px;background:#0E2A1A;border:4px solid #2E6B45;transition:border-color .3s,box-shadow .3s,transform .3s}
.wrc.on{border-color:#7BF0A8;box-shadow:0 0 0 4px rgba(123,240,168,.35),0 0 26px rgba(123,240,168,.45);transform:scale(1.01)}
.wrc.done{border-color:#3BD16F}
.wrc .wrh{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:clamp(22px,3vh,30px);font-weight:700;color:#BFF5D2}
.wrc .wrh .wrok{color:#7BF0A8;visibility:hidden}.wrc.done .wrh .wrok{visibility:visible}
.wrc .wrp{min-width:clamp(64px,8vh,84px);min-height:clamp(64px,8vh,84px);border-radius:50%;border:3px solid #7FD4FF;background:#0E2238;color:#fff;font-size:clamp(30px,4.4vh,44px);cursor:pointer;flex:none}
.wrc .wrp.spk{background:#7FD4FF;animation:wrpk .8s ease-in-out infinite alternate}@keyframes wrpk{from{transform:scale(1)}to{transform:scale(1.1)}}
.wrc .wrz{display:inline-block;margin-top:8px;padding:4px 16px;border-radius:14px;background:rgba(255,224,122,.12);font-size:clamp(28px,4.2vh,44px);font-weight:800;color:#FFE07A;transition:transform .2s}
.wrc .wrz.spk{transform:scale(1.08);background:rgba(255,224,122,.3)}
.wrc .wrb.spk .gw b{color:#FFF6B0;text-shadow:0 0 14px rgba(255,224,122,.7)}
.wrlk{position:sticky;bottom:0;z-index:5;margin-top:16px;padding:12px 10px calc(12px + env(safe-area-inset-bottom));background:linear-gradient(180deg,rgba(5,10,7,0),#050A07 30%)}
.wrlk .wrm{font-size:clamp(22px,3vh,30px);font-weight:700;color:#FFE07A;margin-bottom:8px}
.wrlk .wrbar{height:14px;border-radius:99px;background:#1E2A22;overflow:hidden;max-width:700px;margin:0 auto 10px}.wrlk .wrbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#3BD16F,#7BF0A8);transition:width .4s}
.wrlk button[disabled]{opacity:.38;filter:grayscale(1);cursor:not-allowed}
.wrlk.open .wrm{color:#7BF0A8}
@media (prefers-reduced-motion:reduce){.wrc,.wrc .wrp.spk{animation:none;transition:none}}
`;
/* 網站 原本 答錯頁（#fb、#wf）的 字、圖 樣式 ➜ 也 套到 總複習 的 卡片 上（build 的 時候 抄 一份，選擇器 換成 .wrc） */
function cssFrom(src, pre) {
  const out = [], re = /([^{}]+)\{([^{}]*)\}/g; let m;
  while ((m = re.exec(src))) {
    const sel = m[1].trim().split(',').map(x => x.trim());
    if (!sel.every(x => x.indexOf(pre + ' ') === 0) || sel.some(x => /\.box|\.ft|\.n3|\.nx|\.hd|\.say/.test(x))) continue;
    out.push(sel.map(x => '.wrc ' + x.slice(pre.length + 1)).join(',') + '{' + m[2] + '}');
  }
  return out.join('\n');
}
const js = `
var WREV=(function(){var S={my:0,it:[],k:-1,heard:[],host:null};
 function fast(){return !!window.__WRVFAST}
 function zh(t,cb){var done=false,f=function(){if(done)return;done=true;cb()};t=String(t||'').replace(/^整句：/,'').replace(/[\\s　]+/g,'');
   var est=fast()?200:Math.max(2200,600+t.length*330);setTimeout(f,est+(fast()?0:2500));
   if(fast()||!window.speechSynthesis||!window.SpeechSynthesisUtterance){setTimeout(f,fast()?200:est);return}
   try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t),V=speechSynthesis.getVoices()||[],v=V.filter(function(x){return /zh[-_]TW/i.test(x.lang)})[0]||V.filter(function(x){return /^zh/i.test(x.lang)})[0];
     u.lang='zh-TW';if(v)u.voice=v;u.rate=.9;u.onend=f;u.onerror=f;speechSynthesis.speak(u)}catch(e){setTimeout(f,est)}}
 function card(k){return S.host.querySelector('.wrc[data-k="'+k+'"]')}
 function bar(){var n=S.heard.filter(Boolean).length,N=S.it.length,L=S.host.querySelector('.wrlk');if(!L)return;var bi=L.querySelector('.wrbar i');if(bi)bi.style.width=(N?n/N*100:100)+'%';
   var open=n>=N;L.classList.toggle('open',open);L.querySelector('.wrm').textContent=!N?'🎉 全部 答對！':open?'✅ 全部 聽完 了！可以 按 下面 的 按鈕':'🔒 聽完 全部 錯題 的 英文 和 中文，下面 的 按鈕 才 會 打開（'+n+' ／ '+N+'）';
   [].forEach.call(L.querySelectorAll('button'),function(b){b.disabled=!open})}
 function play(k,my,cb){var c=card(k),it=S.it[k];if(!c||my!==S.my)return;[].forEach.call(S.host.querySelectorAll('.wrc.on'),function(x){x.classList.remove('on')});c.classList.add('on');
   try{c.scrollIntoView({behavior:fast()?'auto':'smooth',block:'center'})}catch(e){}
   var p=c.querySelector('.wrp'),b=c.querySelector('.wrb'),z=c.querySelector('.wrz');p.classList.add('spk');b.classList.add('spk');
   var en=function(d){if(fast()){setTimeout(d,200);return}try{it.en(d)}catch(e){setTimeout(d,800)}};
   en(function(){if(my!==S.my)return;b.classList.remove('spk');z.classList.add('spk');
     setTimeout(function(){if(my!==S.my)return;zh(it.zh,function(){if(my!==S.my)return;z.classList.remove('spk');p.classList.remove('spk');c.classList.remove('on');c.classList.add('done');S.heard[k]=1;bar();setTimeout(cb,fast()?50:600)})},fast()?50:350)})}
 function auto(k,my){if(my!==S.my)return;var N=S.it.length,j=-1;for(var i=0;i<N;i++){var x=(k+i)%N;if(!S.heard[x]){j=x;break}}if(j<0)return;play(j,my,function(){auto(j+1,my)})}
 function stopAll(){S.my++;try{if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}try{if(typeof stopSay==='function')stopSay()}catch(e){}
   if(S.host)[].forEach.call(S.host.querySelectorAll('.spk'),function(x){x.classList.remove('spk')})}
 function run(host,items,btns){stopAll();S.host=host;S.it=items||[];S.heard=S.it.map(function(){return 0});var N=S.it.length;
   var h=N?'<div class="wrv"><div class="wrt">📒 錯題 總複習：這一次 答錯 的 '+N+' 題</div><div class="wrs">👂 聽 英文 ➜ 聽 中文 ➜ 看 圖 ➜ 記住 它！（每一題 都 可以 按〔🔊〕再 聽）</div>'+
     S.it.map(function(it,k){return '<div class="wrc" data-k="'+k+'"><div class="wrh"><span>'+it.head+'</span><span class="wrok">✔ 聽完</span><button class="wrp" data-wrp="'+k+'" aria-label="再聽">🔊</button></div><div class="wrb">'+it.body+'</div><div class="wrz keepsp">'+esc0((window.ZSP?ZSP:String)(String(it.zh||'').replace(/^整句：/,'')))+'</div></div>'}).join('')+'</div>':'';
   var box=document.createElement('div');box.innerHTML=h+'<div class="wrlk"><div class="wrm"></div>'+(N?'<div class="wrbar"><i></i></div>':'')+btns+'</div>';host.appendChild(box);
   /* 卡片 裡 原本 答錯頁 的 id（#gls、#ltr…）會 重複 ➜ 先 只 留 這一張 的，畫完（post）就 拿掉 */
   S.it.forEach(function(it,k){var c=card(k);if(it.post)try{it.post(c)}catch(e){}[].forEach.call(c.querySelectorAll('[id]'),function(x){x.removeAttribute('id')})});
   bar();if(N){var my=S.my;setTimeout(function(){auto(0,my)},fast()?50:900)}}
 function esc0(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-wrp]');if(!b||!S.host)return;var k=+b.getAttribute('data-wrp');stopAll();var my=S.my;
   play(k,my,function(){auto(k+1,my)})});
 return {run:run,stop:stopAll,_s:S}})();
`;
module.exports = { css, js, cssFrom };
