/* g3mid/_decode.js — 🔓 句子 解碼 任務（2026-10-29 第三十三次 第三個 對話 第 2 件；三年級 g3mid、四年級 midterm 共用 引擎）
 *
 * 老師 C35 第 3 題（需求檔 第四節「第三十三次」）：
 *   一句 英文，把 中文 方塊 拖到 每一個 英文 字 的 正下方（點 方塊 再 點 格子 也 可以；先 點 格子 再 點 方塊 也 可以）。
 *   3-1 B 名字 也 要 拖（格子 寫 英文 名字）；3-3 A isn’t ＝ 一個 格子「不是」；3-4 一半 的 題目 多 2 個 錯 方塊（跟 答案 相近，🔒 3）。
 *   3(1) 不發音 字母 灰色（100% 照 句型卡 的 SIL）、’ 紅色。
 *   3(3) 每一課 題目 前 ≧ 20 秒 秒懂 動畫：每一個 字 的 中文、整句 中文、美式 發音，唸到 哪一個 字，那個 字 和 正下方 中文 稍微 放大、放亮；
 *        同一位 學生 同一課 第一次 一定 看完，第二次 以後〔⏭ 跳過〕。
 *   3(4) 拖對 以後：唸 一次 整句（唸到 哪 亮到 哪）＋ 最下面 整句 中文。
 *   一個 字 一個 字 算（C 30%）：放對 幾個 就 拿 幾成（3／4 對 ＝ 這一題 的 3／4 分）。
 *
 * 網頁 端 的 程式 ＝ JS（字串，樣板 裡 的 正規 表示式 一律 兩條 斜線），用 一個 轉接 物件 A 接 上 各 網站 自己 的 東西：
 *   A.aud(英文, 聲音) ➜ 語音檔 路徑（沒有 ＝ ''）、A.stop() 停 聲音、A.pause()／A.go() 倒數 停／走、
 *   A.ok(元素) 全對、A.bad(你放的, 對了 幾成) 有 錯、A.busy() 現在 不能 動、A.sid ＝ 這一位 學生 的 代號（記 看過 動畫 沒）。 */
exports.CSS = `
/* ── 🔓 句子 解碼 任務 ── */
.dcw{--dg:clamp(16px,2.4vw,34px);display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:clamp(10px,1.6vh,18px) var(--dg);margin:clamp(6px,2vh,22px) auto 0;max-width:1180px}
.dcc{display:flex;flex-direction:column;align-items:center;gap:8px;transition:transform .18s,filter .18s}
.dcc.pre{align-items:flex-end}.dcc.ct{align-items:flex-start;margin-left:calc(6px - var(--dg))}.dcc.ct .dcs{min-width:clamp(70px,8vw,110px)}   /* ’s、’m 黏 在 前一個 字 旁邊（前一個 字 靠右、’s 靠左；下面 一樣 有 自己 的 格子）*/
.dce{font-size:clamp(36px,6.8vh,74px);line-height:1.08;color:#fff;white-space:nowrap;letter-spacing:.01em}
.dce .dsl{color:#8C8C8C}.dce .dap{color:#FF5A5A}
.dcs{min-width:clamp(88px,10.5vw,150px);min-height:clamp(58px,8.2vh,80px);border:4px dashed #6F86A6;border-radius:16px;background:#0E1A2C;display:flex;align-items:center;justify-content:center;
  font-size:clamp(26px,4.4vh,40px);color:#FFE38A;padding:2px 10px;cursor:pointer;transition:border-color .15s,background .15s,transform .15s}
.dcs.hot,.dcs.sel{border-color:#5EC8FF;border-style:solid;background:#123049;transform:scale(1.05)}
.dcs.fill{touch-action:none;cursor:grab}
.dcs.fill{border-style:solid;border-color:#FFD54A;background:#2A2410}
.dcs.ok{border-color:#2BD46A;background:#0F3A1F;color:#BFFFD0}.dcs.no{border-color:#FF5A5A;background:#3A1010;color:#FFC2C2;animation:dcsh .45s}
@keyframes dcsh{20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
.dcc.spk{transform:scale(1.12);filter:brightness(1.35) drop-shadow(0 0 10px rgba(255,230,140,.55))}
.dct{display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(10px,1.4vw,18px);margin:clamp(14px,3vh,34px) auto 0;max-width:1100px;min-height:clamp(70px,10vh,96px)}
.dctl{min-width:clamp(92px,10vw,140px);min-height:clamp(62px,9vh,84px);padding:4px 16px;border-radius:16px;border:4px solid #C9A227;background:linear-gradient(#FFE58A,#F5B829);color:#3A2600;
  font-size:clamp(26px,4.4vh,40px);display:flex;align-items:center;justify-content:center;touch-action:none;cursor:grab;box-shadow:0 6px 0 #9A6B00;transition:transform .15s}
.dctl.sel{transform:translateY(-6px) scale(1.06);border-color:#5EC8FF;box-shadow:0 0 0 5px rgba(94,200,255,.45),0 6px 0 #9A6B00}
.dctl.drag{z-index:60;position:relative;transition:none;box-shadow:0 14px 24px rgba(0,0,0,.5)}
.dcs.lift{opacity:.35}.dcs.swp{animation:dcSwp .45s}@keyframes dcSwp{40%{transform:scale(1.14);box-shadow:0 0 0 4px #FFE07A}}
.dctl.used{visibility:hidden}
.dcbox.dz1 .dce{font-size:clamp(32px,5.8vh,64px)}.dcbox.dz1 .dcs,.dcbox.dz1 .dctl{min-height:clamp(52px,7.2vh,72px);font-size:clamp(24px,3.8vh,36px)}.dcbox.dz1 .dct{margin-top:clamp(8px,2vh,22px)}
.dcbox.dz2 .dce{font-size:clamp(28px,5vh,56px)}.dcbox.dz2 .dcs,.dcbox.dz2 .dctl{min-height:clamp(48px,6.4vh,64px);min-width:clamp(74px,9vw,120px);font-size:clamp(22px,3.4vh,32px)}.dcbox.dz2 .dcw{row-gap:6px}.dcbox.dz2 .dcz{margin-top:6px}
.dcbox.dz3 .dce{font-size:clamp(24px,4.4vh,48px)}.dcbox.dz3 .dcs,.dcbox.dz3 .dctl{min-height:44px;min-width:64px;font-size:clamp(20px,3vh,28px)}.dcbox.dz3 .dct{gap:8px;margin-top:8px}
.dcbox.dz4 .dce{font-size:clamp(22px,3.8vh,40px)}.dcbox.dz4 .dcs,.dcbox.dz4 .dctl{min-height:40px;min-width:56px;font-size:20px;padding:2px 8px}.dcbox.dz4 .dcw{row-gap:4px}.dcbox.dz4 .dct{gap:6px;margin-top:6px}.dcbox.dz4 .dcz{margin-top:4px;font-size:24px}.dcbox.dz4 .dcc{gap:4px}
.dcz{text-align:center;font-size:clamp(28px,4.6vh,44px);color:#BFFFD0;margin:clamp(10px,2.4vh,26px) 0 0;min-height:1.3em;opacity:0;transition:opacity .4s}.dcz.on{opacity:1}
.dcask{text-align:center;font-size:clamp(20px,2.7vh,26px);color:#BFD3E6;margin-top:clamp(8px,1.6vh,16px)}
.dcu{display:inline-block;margin:0 auto;font-size:clamp(18px,2.4vh,22px);color:#FFD54A;border:2px solid #6B5A20;border-radius:999px;padding:2px 14px}
/* 答錯頁：你 放的（錯 的 紅）*/
.dcy{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:6px 0}.dcy span{display:flex;flex-direction:column;align-items:center;font-size:clamp(22px,3vh,30px)}
.dcy span i{font-style:normal;font-size:.8em;color:#BFFFD0;border-top:2px solid #456;padding:0 6px}.dcy span i.no{color:#FF8A8A;text-decoration:line-through}
/* ── 每一課 開始 前 的 秒懂 動畫（≧ 20 秒）── */
#dcl{position:fixed;inset:0;z-index:95;display:none;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 30%,#18275A,#05070F 70%);padding:16px;text-align:center}
#dcl.on{display:flex}
#dcl .dlctl{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:clamp(6px,1.4vh,14px)}
#dcl .dlctl button{min-height:56px;padding:4px 20px;border-radius:16px;font-size:clamp(20px,2.6vh,26px);border:3px solid #6F86A6;background:#22324A;color:#fff}
#dcl .dlctl button.on{border-color:#FFD54A;background:#3A3010;color:#FFE38A}
#dcl.pz *{animation-play-state:paused!important}
#dcl.pz:before{content:'⏸️ 暫停中';position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:2;padding:4px 18px;border-radius:999px;background:#FFD54A;color:#2A1A00;font-size:clamp(20px,2.6vh,26px);font-weight:700}
#dcl .dlt{font-size:clamp(30px,5vh,52px);color:#FFD54A;margin:0 0 4px}
#dcl .dls{font-size:clamp(20px,2.8vh,28px);color:#BFD3E6;margin-bottom:clamp(8px,2vh,22px)}
#dcl .dlp{display:flex;gap:10px;justify-content:center;margin-bottom:clamp(8px,2vh,20px)}#dcl .dlp i{width:16px;height:16px;border-radius:50%;background:#2E4058}#dcl .dlp i.on{background:#FFD54A}#dcl .dlp i.ok{background:#2BD46A}
#dcl .dlw{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:clamp(10px,1.6vh,18px) clamp(18px,2.6vw,38px);min-height:clamp(150px,26vh,260px)}
#dcl .dlc{display:flex;flex-direction:column;align-items:center;gap:6px;opacity:0;transform:translateY(30px) scale(.7);transition:opacity .35s,transform .35s cubic-bezier(.3,1.6,.5,1),filter .18s}
#dcl .dlc.in{opacity:1;transform:none}#dcl .dlc.ct{margin-left:calc(-1 * clamp(12px,2vw,30px))}#dcl .dlc.spk{transform:scale(1.14);filter:brightness(1.4) drop-shadow(0 0 12px rgba(255,230,140,.6))}
#dcl .dlc .ic{font-size:clamp(34px,6vh,62px);line-height:1}
#dcl .dlc .en{font-size:clamp(46px,8.6vh,92px);line-height:1.04;white-space:nowrap}#dcl .dlc .en .dsl{color:#8C8C8C}#dcl .dlc .en .dap{color:#FF5A5A}
#dcl .dlc .zh{font-size:clamp(26px,4.4vh,42px);color:#FFE38A;border-top:3px solid #3A5070;padding-top:4px;min-width:1.6em}
#dcl .dlz{font-size:clamp(30px,5vh,50px);color:#BFFFD0;margin-top:clamp(10px,2.4vh,26px);min-height:1.3em;opacity:0;transition:opacity .5s}#dcl .dlz.on{opacity:1}
#dcl .dlb{display:flex;gap:16px;justify-content:center;margin-top:clamp(12px,3vh,30px);min-height:64px}
#dcl .dlb button{min-height:64px;padding:6px 28px;border-radius:18px;font-size:clamp(22px,3vh,30px);border:3px solid #4A5A6C;background:#1B2633}
#dcl .dlb .go{background:linear-gradient(#36D27A,#1E9E55);border-color:#7BF0A8;color:#06210F}
#dcl .dlb .sk{background:#2A2F3A}
#dcl .dlsec{font-size:clamp(18px,2.4vh,22px);color:#8FA3BC;margin-top:8px;min-height:1.3em}
@media (prefers-reduced-motion:reduce){#dcl .dlc{transition:none}.dcc,.dctl{transition:none}}

/* ══ 2026-10-30 第三十四次 第 9 點 ══ */
/* (4) 格子 變大、英文 字 對齊 正下方 的 中文 格（每一格 一樣 寬 ＝ 最寬 的 中文 方塊；英文 在 格子 正上方 置中）*/
.dcbox .dcc{align-items:stretch}.dcbox .dcc .dce{text-align:center}.dcbox .dcc.pre,.dcbox .dcc.ct{align-items:stretch}.dcbox .dcc.ct{margin-left:calc(10px - var(--dg))}
.dcbox .dcs{min-width:var(--tw,clamp(96px,11vw,160px));min-height:clamp(66px,9vh,92px);font-size:clamp(28px,4.6vh,44px)}.dcbox .dcc.ct .dcs{min-width:var(--tw,clamp(96px,11vw,160px))}
.dcbox .dctl{min-width:var(--tw,clamp(96px,11vw,160px));min-height:clamp(66px,9vh,92px);font-size:clamp(28px,4.6vh,44px)}
/* 縮寫／省略 等式（(2)(3)(6)）：兩行，第一個 字母 上下 對齊，＝ 在 下面 那一行 第一個 字母 的 左邊 */
#dcl .dleq{display:grid;grid-template-columns:auto auto;column-gap:clamp(8px,1.4vw,18px);row-gap:clamp(4px,1vh,12px);align-items:start;justify-content:center}
#dcl .dlw{flex-shrink:0}#dcl .dlw.eqm{flex-direction:column;align-items:center;flex-wrap:nowrap}#dcl .dleq .dlc .en{font-size:clamp(40px,7.4vh,80px)}#dcl .dleq .dlc .ic{font-size:clamp(28px,4.6vh,48px)}#dcl .dleq .dlc .zh{font-size:clamp(24px,3.8vh,38px)}#dcl .dleq .dqm{margin-top:calc(clamp(28px,4.6vh,48px) + 6px);font-size:clamp(40px,7.4vh,80px);line-height:1.04;color:#FFD54A;opacity:0;transition:opacity .3s,transform .3s}#dcl .dleq .dqm.in{opacity:1}#dcl .dleq .dqm.go{transform:scale(1.5)}
#dcl .dleq .dqr{display:flex;justify-content:flex-start;align-items:flex-start;gap:clamp(10px,1.6vh,18px) clamp(18px,2.6vw,38px)}
#dcl .dleq .dlc.ct{margin-left:calc(-1 * clamp(12px,2vw,30px))}
#dcl .dleq.go .dqr{filter:drop-shadow(0 0 14px rgba(255,213,74,.55))}
#dcl .dri{color:#FF5A5A;display:inline-block;transition:transform .8s,opacity .8s}#dcl .dri.fly{transform:translateY(-90px) rotate(-30deg) scale(1.4);opacity:0}
#dcl .dlc.om>div{transition:opacity .4s,filter .4s}#dcl .dlc.om.x>div{opacity:.45;filter:grayscale(1)}#dcl .dlc.om.x .en{text-decoration:line-through;text-decoration-color:#FF5A5A;text-decoration-thickness:6px}
#dcl .dlc .omt{position:absolute;top:100%;margin-top:8px;background:#FF5A5A;color:#fff;font-size:clamp(20px,2.8vh,28px);border-radius:999px;padding:2px 14px;white-space:nowrap;animation:dtpop .4s both}
#dcl .dleq .dlc{position:relative}#dcl .dltag{grid-column:1/-1;justify-self:center;margin-bottom:4px;font-size:clamp(22px,3vh,30px);color:#06210F;background:#FFD54A;border-radius:999px;padding:2px 16px}
@keyframes dtpop{0%{transform:scale(.4);opacity:0}100%{transform:none;opacity:1}}
/* (5A)(5B) 解碼 開始 前 的 教學：怎麼 拖 ➜ 中英 順序 不 一樣 ➜ 小 測驗 */
#dcl .dtcap{font-size:clamp(24px,3.6vh,36px);color:#fff;min-height:1.5em;margin:4px 0}#dcl .dtcap b{color:#FFD54A}
#dcl .dtnat{display:flex;gap:clamp(10px,1.4vw,18px);justify-content:center;margin:clamp(6px,1.4vh,14px) 0 clamp(14px,3vh,30px);min-height:clamp(62px,9vh,84px)}
#dcl .dtnat .dctl{cursor:default;box-shadow:0 6px 0 #9A6B00}#dcl .dtnat .lbl{align-self:center;font-size:clamp(22px,3vh,30px);color:#BFD3E6}
#dcl .dctl.fly{position:relative;z-index:70;transition:transform .9s cubic-bezier(.4,1.4,.5,1)}
#dcl .dthand{position:fixed;z-index:99;font-size:clamp(54px,8vh,80px);left:0;top:0;pointer-events:none;transition:transform .8s ease-in-out;filter:drop-shadow(0 6px 8px rgba(0,0,0,.6));opacity:0}
#dcl .dthand.on{opacity:1}#dcl .dthand.tap{animation:dttap .35s}
@keyframes dttap{50%{scale:.8}}
#dcl .dcbox{margin-top:4px}#dcl .dthi{animation:dthi 1s ease-in-out 3}@keyframes dthi{50%{box-shadow:0 0 0 8px rgba(94,200,255,.7)}}
#dcl .dtok{font-size:clamp(34px,6vh,60px);color:#7BF0A8;animation:dtok .5s both}@keyframes dtok{0%{transform:scale(.4);opacity:0}100%{transform:none;opacity:1}}
#dcl .dtz{font-size:clamp(28px,4.4vh,44px);color:#BFFFD0;margin-top:clamp(8px,2vh,20px);min-height:1.3em}
@media (prefers-reduced-motion:reduce){#dcl .dri,#dcl .dctl.fly,#dcl .dthand{transition:none}}
`;
exports.JS = `
/* ══ 🔓 句子 解碼 任務（g3mid/_decode.js）══ */
var DEC={SIL:{},A:null};
if(typeof H!=='function')var H=function(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};   /* 四年級 網頁 沒有 H() */
function decEN(w){var s=String(w).replace(/'/g,'\\u2019'),out='',sil={},re=/[A-Za-z]+/g,m;
 while((m=re.exec(s))){var L=DEC.SIL[m[0].toLowerCase()];if(L)L.forEach(function(k){sil[m.index+k]=1})}
 /* Who 的 W、What 的 h（句型卡 的 舊 規則；SIL 沒 寫 的 網站 用 這個） */
 if(!DEC.SIL.what){var mw=/^(W)(ho)|^(W)(h)(at)/i.exec(s);if(mw){if(mw[1])sil[0]=1;else sil[1]=1}}
 for(var n=0;n<s.length;n++){var c=s.charAt(n);if(sil[n])out+='<b class="dsl">'+c+'</b>';else if(c==='\\u2019')out+='<b class="dap">\\u2019</b>';else out+=esc(c)}return out}
/* 唸 一句，唸到 哪一個 字 那一格 亮（照 每一格 的 字母 數 分 時間；有 語音檔 照 真的 長度）*/
/* (1) 2026-10-30 第三十四次 第 9-(1) 點（老師：秒懂 動畫、答對 以後 有些 句子 沒有 聲音）：
   原因 ＝ 這些 句子 是 動畫 自己 接著 唸 的（不是 手指 剛 按 的 那一下），iPad 的 Safari 每一個 新 的 聲音 都 要 手指 按 過 才 准 放 ➜ 被 擋掉 ➜ 改用 電腦 語音（iPad 也 常 沒 聲音）。
   修法：解碼 只用 一個 聲音 播放器，第一次 手指 碰 畫面 就 先 用 它 放 一段 沒有 聲音 的 0.05 秒（解鎖），以後 換 句子 都 用 同一個（iPad 准 放）。 */
function decEl(){if(!DEC.el){DEC.el=new Audio();DEC.el.preload='auto'}return DEC.el}
function decSil(){var n=400,b=new Uint8Array(44+n),w=function(o,v,l){for(var i=0;i<l;i++)b[o+i]=(v>>(8*i))&255},t=function(o,x){for(var i=0;i<x.length;i++)b[o+i]=x.charCodeAt(i)};
 t(0,'RIFF');w(4,36+n,4);t(8,'WAVEfmt ');w(16,16,4);w(20,1,2);w(22,1,2);w(24,8000,4);w(28,8000,2);w(32,1,2);w(34,8,2);t(36,'data');w(40,n,4);for(var i=44;i<44+n;i++)b[i]=128;
 var r='';for(var j=0;j<b.length;j++)r+=String.fromCharCode(b[j]);return 'data:audio/wav;base64,'+btoa(r)}
function decUnlock(){var a=decEl();if(a._ok||a._try||DEC.au||window.__NOUNLOCK)return;a._try=1;try{a.src=decSil();var p=a.play();if(p&&p.then)p.then(function(){a._ok=1;a._try=0}).catch(function(){a._try=0});else{a._ok=1}}catch(e){a._try=0}}
['pointerdown','touchend','click','keydown'].forEach(function(ev){addEventListener(ev,decUnlock,true)});
function decRead(text,v,cells,done){var A=DEC.A;A.stop();var my=++DEC.rid,f=A.aud(text,v),w=cells.map(function(c){return Math.max(1,(c.getAttribute('data-w')||'').replace(/[^A-Za-z]/g,'').length)+1}),tot=w.reduce(function(a,b){return a+b},0);
 function hl(r){var acc=0,k=-1;for(var i=0;i<w.length;i++){acc+=w[i];if(r*tot<acc){k=i;break}}cells.forEach(function(c,i){c.classList.toggle('spk',i===k)})}
 function fin(){if(my!==DEC.rid)return;cells.forEach(function(c){c.classList.remove('spk')});if(done)done()}
 if(f){var au=decEl();au.onended=null;au.onerror=null;try{au.pause()}catch(e){}au.src=f;try{au.defaultPlaybackRate=au.playbackRate=DEC.slow?.75:1}catch(e){}DEC.au=au;var raf=0,t0=0;au.onended=function(){if(DEC.au===au)DEC.au=null;cancelAnimationFrame(raf);fin()};au.onerror=function(){cancelAnimationFrame(raf);est()};
  (function lp(){if(my!==DEC.rid){try{au.pause()}catch(e){}return}if(au.duration>0&&!au.paused)hl(Math.min(.999,au.currentTime/au.duration));raf=requestAnimationFrame(lp)})();
  var p=au.play();if(p&&p.catch)p.catch(function(e){if(my!==DEC.rid||(e&&e.name==='AbortError'))return;cancelAnimationFrame(raf);est()});return}
 est();
 function est(){var T=Math.max(1.2,tot*.085)*1000*(DEC.slow?1.35:1),s=performance.now();try{var u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=DEC.slow?.6:.8;speechSynthesis.speak(u)}catch(e){}
  (function lp(){if(my!==DEC.rid)return;var r=(performance.now()-s)/T;if(r>=1){fin();return}hl(r);requestAnimationFrame(lp)})()}}
DEC.rid=0;
function decClose(){DEC.lid++;decStop();decPause(false);var o=document.getElementById('dcl');if(o){o.classList.remove('on');o.innerHTML=''}}   /* 回 大廳、老師 結束 ＝ 動畫 收起來 */
function decStop(){DEC.rid++;if(DEC.au){try{DEC.au.onended=null;DEC.au.pause()}catch(e){}DEC.au=null}}
/* 一題：q ＝ {en, t:[[英文, 中文]…], x:[錯 方塊…], z 整句 中文, v 聲音} */
function decRender(q,st0){var A=DEC.A,st=H('div','dcbox');st0.appendChild(st);var row=H('div','dcw'),tray=H('div','dct'),zh=H('div','dcz',esc(q.z)),sel=null,selS=null;
  var cells=q.t.map(function(p,i){var c=H('div','dcc'+(/^['\u2019]/.test(p[0])?' ct':'')+(q.t[i+1]&&/^['\u2019]/.test(q.t[i+1][0])?' pre':''),'<div class="dce">'+decEN(p[0])+'</div>');c.setAttribute('data-w',p[0]);var s=H('div','dcs','');s.setAttribute('data-i',i);c.appendChild(s);row.appendChild(c);
   slotDrag(s);
   s.addEventListener('click',function(){if(s._nc){s._nc=0;return}if(A.busy()||DEC.lock)return;if(s._t){back(s);return}if(sel){put(sel,s);return}row.querySelectorAll('.dcs.sel').forEach(function(x){x.classList.remove('sel')});selS=s;s.classList.add('sel')});return c});
 st.appendChild(row);st.appendChild(tray);st.appendChild(zh);
 var tiles=shuf(q.t.map(function(p){return p[1]}).concat(q.x||[]));
 tiles.forEach(function(z){var b=H('div','dctl',esc(z));b._z=z;tray.appendChild(b);var sx,sy,mv,dn=false;
  b.addEventListener('pointerdown',function(e){if(A.busy()||DEC.lock||b.classList.contains('used'))return;e.preventDefault();dn=true;sx=e.clientX;sy=e.clientY;mv=false;try{b.setPointerCapture(e.pointerId)}catch(x){}});
  b.addEventListener('pointermove',function(e){if(!dn)return;var dx=e.clientX-sx,dy=e.clientY-sy;if(!mv&&Math.abs(dx)+Math.abs(dy)>10){mv=true;b.classList.add('drag')}if(mv){b.style.transform='translate('+dx+'px,'+dy+'px) scale(1.08)';var o=over(e);row.querySelectorAll('.dcs').forEach(function(s){s.classList.toggle('hot',s===o)})}});
  function up(e){if(!dn)return;dn=false;b.classList.remove('drag');b.style.transform='';row.querySelectorAll('.dcs.hot').forEach(function(s){s.classList.remove('hot')});
   if(!mv){if(selS){put(b,selS);return}tray.querySelectorAll('.dctl.sel').forEach(function(x){x.classList.remove('sel')});if(sel===b){sel=null;return}sel=b;b.classList.add('sel');return}
   var o=e?over(e):null;if(o)put(b,o)}
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',function(){dn=false;b.classList.remove('drag');b.style.transform=''})});
 /* (4) 每一格 ＝ 最寬 的 中文 方塊 那麼 寬（英文 字 在 格子 正上方 置中）*/
 decTW(st,tray);
 function over(e){var best=null;row.querySelectorAll('.dcs').forEach(function(s){var r=s.getBoundingClientRect();if(e.clientX>r.left-24&&e.clientX<r.right+24&&e.clientY>r.top-40&&e.clientY<r.bottom+40)best=s});return best}
 function put(b,s){if(s._t)back(s);s._t=b;s.textContent=b._z;s.classList.add('fill');s.classList.remove('sel','hot');b.classList.add('used');b.classList.remove('sel');sel=null;selS=null;
  decFit(st);if([].every.call(row.querySelectorAll('.dcs'),function(x){return x._t}))setTimeout(check,350)}
 /* 2026-10-31 第三十六次 第 3 點：格子 裡 的 方塊 可以 拖到 別的 格子 ＝ 互相 交換（空 的 格子 ＝ 搬 過去）；拖回 下面 ＝ 拿 回去。點 一下 照舊 ＝ 拿 回去 */
 function slotDrag(s){var sx,sy,mv,dn=false,gh=null;
  s.addEventListener('pointerdown',function(e){if(!s._t||A.busy()||DEC.lock)return;e.preventDefault();dn=true;mv=false;sx=e.clientX;sy=e.clientY;try{s.setPointerCapture(e.pointerId)}catch(x){}});
  s.addEventListener('pointermove',function(e){if(!dn)return;var dx=e.clientX-sx,dy=e.clientY-sy;if(!mv&&Math.abs(dx)+Math.abs(dy)>10){mv=true;var r=s.getBoundingClientRect();gh=H('div','dctl drag dcgh',esc(s._t._z));gh.style.cssText='position:fixed;left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;pointer-events:none;z-index:99';document.body.appendChild(gh);s.classList.add('lift')}
   if(mv){gh.style.transform='translate('+dx+'px,'+dy+'px) scale(1.08)';var o=over(e);row.querySelectorAll('.dcs').forEach(function(x){x.classList.toggle('hot',x===o&&x!==s)})}});
  function end(e){if(!dn)return;dn=false;s.classList.remove('lift');row.querySelectorAll('.dcs.hot').forEach(function(x){x.classList.remove('hot')});if(gh&&gh.parentNode)gh.parentNode.removeChild(gh);gh=null;if(!mv)return;s._nc=1;setTimeout(function(){s._nc=0},400);
   var o=e?over(e):null;if(o&&o!==s){swap(s,o);return}if(!o){var r=tray.getBoundingClientRect();if(e&&e.clientY>r.top-30)back(s)}}
  s.addEventListener('pointerup',end);s.addEventListener('pointercancel',function(){end(null)})}
 function swap(a,b){var ta=a._t,tb=b._t;a._t=tb||null;b._t=ta;a.textContent=tb?tb._z:'';a.classList.toggle('fill',!!tb);b.textContent=ta._z;b.classList.add('fill');[a,b].forEach(function(x){x.classList.remove('sel');x.classList.remove('swp');void x.offsetWidth;x.classList.add('swp')});
  decFit(st);if([].every.call(row.querySelectorAll('.dcs'),function(x){return x._t}))setTimeout(check,350)}
 function back(s){if(!s._t)return;s._t.classList.remove('used');s._t=null;s.textContent='';s.classList.remove('fill')}
 function check(){if(A.busy()||DEC.lock)return;var ss=[].slice.call(row.querySelectorAll('.dcs')),got=ss.map(function(s){return s._t?s._t._z:''}),okN=0;
  ss.forEach(function(s,i){var y=got[i]===q.t[i][1];if(y)okN++;s.classList.add(y?'ok':'no')});DEC.lock=true;A.pause();
  if(okN===ss.length){var cs=[].slice.call(row.querySelectorAll('.dcc'));zh.classList.add('on');decRead(q.en,q.v||'',cs,function(){DEC.lock=false;A.ok(row)});return}
  setTimeout(function(){DEC.lock=false;A.bad(got,okN/ss.length)},900)}
 DEC.lock=false;decFit(st)}
function decTW(st,tray){st.style.removeProperty('--tw');var m=0;[].forEach.call(tray.children,function(b){m=Math.max(m,b.scrollWidth)});if(m)st.style.setProperty('--tw',Math.ceil(m+8)+'px')}
/* 畫面 放不下（四年級 句子 長、方塊 多）＝ 一級 一級 縮小，不用 捲動 */
function decFit(b){var lv=b.classList.contains('dz4')?4:b.classList.contains('dz3')?3:b.classList.contains('dz2')?2:b.classList.contains('dz1')?1:0;var t=b.querySelector('.dct');while(lv<4&&document.documentElement.scrollHeight>innerHeight+1){b.classList.remove('dz'+lv);lv++;b.classList.add('dz'+lv);if(t)decTW(b,t)}}
addEventListener('resize',function(){var b=document.querySelector('.dcbox');if(b){b.classList.remove('dz1','dz2','dz3','dz4');var t=b.querySelector('.dct');if(t)decTW(b,t);decFit(b)}});
/* 答錯頁 的「你 放的」：每一格 英文 下面 你 放 的 中文（錯 的 劃掉） */
function decYou(q,got){if(!got||!got.length)return '';return '<div class="dcy">'+q.t.map(function(p,i){var y=got[i]===p[1];return '<span>'+esc(p[0].replace(/'/g,'\\u2019'))+'<i class="'+(y?'':'no')+'">'+esc(got[i]||'　')+'</i></span>'}).join('')+'</div>'}
/* ── 每一課 開始 前 的 秒懂 動畫（老師 3(3)：≧ 20 秒；第一次 一定 看完）── */
/* 2026-10-31 第三十五次 第 2 點（老師：題目 開始 之前，所有 秒懂 動畫 都 要 有〔暫停〕〔再撥一次〕〔慢速〕）：
   ⏸ 暫停 ＝ 聲音 停、動畫 停、下一步 等著（DEC.pq），▶ 繼續 ＝ 接著 演；🔁 再播一次 ＝ 這一段 從頭；🐢 慢速 ＝ 每一步 慢 1.6 倍、聲音 0.75 倍（再按 ＝ 🐇 正常速度） */
DEC.pz=false;DEC.pq=[];DEC.slow=false;
function decK(){return (window.__DCLK||1)*(DEC.slow?1.6:1)}
function decT(f,ms){return setTimeout(function(){if(DEC.pz)DEC.pq.push(f);else f()},ms)}
function decPause(on){var o=document.getElementById('dcl'),b=document.getElementById('dcP');DEC.pz=!!on;if(o)o.classList.toggle('pz',!!on);if(b){b.textContent=on?'▶️ 繼續':'⏸️ 暫停';b.classList.toggle('on',!!on)}
 if(on){if(DEC.au)try{DEC.au.pause()}catch(e){}try{speechSynthesis.pause()}catch(e){}return}
 if(DEC.au&&DEC.au.paused)try{var pp=DEC.au.play();if(pp&&pp.catch)pp.catch(function(){})}catch(e){}try{speechSynthesis.resume()}catch(e){}var q=DEC.pq;DEC.pq=[];q.forEach(function(f){f()})}
function decCtl(o,replay){decPause(false);var c=document.createElement('div');c.className='dlctl';
 c.innerHTML='<button id="dcP">⏸️ 暫停</button><button id="dcR">🔁 再播一次</button><button id="dcS" class="'+(DEC.slow?'on':'')+'">'+(DEC.slow?'🐇 正常速度':'🐢 慢速')+'</button>';o.appendChild(c);
 c.querySelector('#dcP').onclick=function(){decPause(!DEC.pz)};
 c.querySelector('#dcR').onclick=function(){DEC.pq=[];decStop();replay()};
 c.querySelector('#dcS').onclick=function(){DEC.slow=!DEC.slow;this.textContent=DEC.slow?'🐇 正常速度':'🐢 慢速';this.classList.toggle('on',DEC.slow);if(DEC.au)try{DEC.au.playbackRate=DEC.slow?.75:1}catch(e){}}}
function decLesson(L,done){var A=DEC.A,o=$('#dcl'),k='dcl_seen_'+L.key+'_'+(A.sid()||'0'),seen=false;try{seen=!!localStorage.getItem(k)}catch(e){}
 var my=++DEC.lid,t0=Date.now(),MIN=window.__DCLMIN!=null?window.__DCLMIN:20000,K=window.__DCLK||1;A.pause();   /* __DCLK、__DCLMIN ＝ 量測 用（快轉） */
 o.innerHTML='<div class="dlt">🔓 '+esc(L.title)+'</div><div class="dls">'+esc(L.sub)+'</div><div class="dlp">'+L.s.map(function(){return '<i></i>'}).join('')+'</div><div class="dlw" id="dlw"></div><div class="dlz" id="dlz"></div><div class="dlsec" id="dlsec"></div><div class="dlb" id="dlb">'+(seen?'<button class="sk" id="dlsk">⏭ 跳過</button>':'')+'</div>';o.classList.add('on');decCtl(o,function(){decLesson(L,done)});
 var sk=$('#dlsk');if(sk)sk.onclick=fin;
 var i=0;function one(){if(my!==DEC.lid)return;if(i>=L.s.length){wait();return}var S=L.s[i],dots=o.querySelectorAll('.dlp i');[].forEach.call(dots,function(d,j){d.className=j<i?'ok':j===i?'on':''});
  var w=$('#dlw'),z=$('#dlz');w.innerHTML='';z.classList.remove('on');z.textContent=S.z;
  w.classList.remove('eqm');if(S.eq){decEq(S,w,z,K,function(){return my===DEC.lid},function(){decT(function(){i++;one()},900*decK())});return}
  var cs=S.t.map(function(p){var c=H('div','dlc'+(/^['\u2019]/.test(p[0])?' ct':''),'<div class="ic">'+(p[2]||'')+'</div><div class="en">'+decEN(p[0])+'</div><div class="zh">'+esc(p[1])+'</div>');c.setAttribute('data-w',p[0]);w.appendChild(c);return c});
  var j=0;(function pop(){if(my!==DEC.lid)return;if(j<cs.length){cs[j].classList.add('in');j++;decT(pop,420*decK());return}
   decT(function(){if(my!==DEC.lid)return;decRead(S.en,S.v||'',cs,function(){if(my!==DEC.lid)return;z.classList.add('on');
     decT(function(){if(my!==DEC.lid)return;decRead(S.en,S.v||'',cs,function(){decT(function(){i++;one()},900*decK())})},1100*decK())})},300*decK())})()}
 function wait(){if(my!==DEC.lid)return;[].forEach.call(o.querySelectorAll('.dlp i'),function(d){d.className='ok'});var left=MIN-(Date.now()-t0);if(left>0){$('#dlsec').textContent='';setTimeout(wait,Math.min(left,500));return}
  try{localStorage.setItem(k,'1')}catch(e){}$('#dlb').innerHTML='<button class="go" id="dlgo">▶ 開始 解碼！</button>';$('#dlgo').onclick=fin}
 function fin(){if(my!==DEC.lid)return;DEC.lid++;decStop();decPause(false);o.classList.remove('on');o.innerHTML='';done()}
 one()}

/* ── (2)(3)(6) 縮寫／省略 等式（2026-10-30 第三十四次 第 9 點）──
   S.eq ＝ {a:{t:[[英文, 中文, 圖示, 紅 字母 位置]…], say}, b:{t, say}, om:[a 裡 可以 省略 的 格], tag, z}
   上面 一行 一個 字 一個 字 跳出來（每個 字 正下方 中文）➜ 唸 ➜ 紅色 字母 飛走（縮寫）／ years old 劃掉＋「可以 省略」➜ 下面 一行「＝ …」跳出來 ➜ 唸 ➜ 兩行 一起 亮、＝ 放大 ➜ 再 唸 一次 上、下 */
function decEqCell(p,cls){var en=p[3]!=null?String(p[0]).split('').map(function(c,i){return i===p[3]?'<b class="dri">'+esc(c)+'</b>':c==='’'?'<b class="dap">’</b>':esc(c)}).join(''):decEN(p[0]);
 var c=H('div','dlc'+(/^['’]/.test(p[0])?' ct':'')+(cls||''),'<div class="ic">'+(p[2]||'')+'</div><div class="en">'+en+'</div><div class="zh">'+(p[1]?esc(p[1]):'&nbsp;')+'</div>');c.setAttribute('data-w',/^_+[?.!]?$/.test(p[0])?'':p[0]);return c}   /* 2026-10-31：______? ______. 也 是 空格（不 亮、下面 沒有 中文）*/
function decEq(S,w,z,K,alive,next){var E=S.eq,g=H('div','dleq'),m1=H('div','dqm',''),r1=H('div','dqr'),m2=H('div','dqm','＝'),r2=H('div','dqr');
 w.classList.add('eqm');if(E.tag)g.appendChild(H('div','dltag',esc(E.tag)));g.appendChild(m1);g.appendChild(r1);g.appendChild(m2);g.appendChild(r2);w.appendChild(g);z.textContent=E.z||'';
 var c1=E.a.t.map(function(p,i){var c=decEqCell(p,(E.om||[]).indexOf(i)>=0?' om':'');r1.appendChild(c);return c}),c2=E.b.t.map(function(p){var c=decEqCell(p);r2.appendChild(c);return c});
 /* 2026-10-31 第三十五次 第 2 點：生活例句 比較 長（She is my mother.）➜ 放不下 就 整塊 等比 縮小（不 折行、不 超出 畫面）*/
 [].forEach.call(r1.children,function(c){c.classList.add('in')});[].forEach.call(r2.children,function(c){c.classList.add('in')});m2.classList.add('in');var gw=g.scrollWidth,ww=Math.min(innerWidth-24,w.clientWidth||innerWidth);[].forEach.call(r1.children,function(c){c.classList.remove('in')});[].forEach.call(r2.children,function(c){c.classList.remove('in')});m2.classList.remove('in');if(gw>ww){g.style.transform='scale('+(ww/gw).toFixed(3)+')';g.style.transformOrigin='50% 0'}
 function pop(cs,k,cb){if(!alive())return;if(k<cs.length){cs[k].classList.add('in');decT(function(){pop(cs,k+1,cb)},420*decK());return}decT(cb,300*decK())}
 function rd(t,cs,cb){decRead(t,'',cs.filter(function(c){return c.getAttribute('data-w')}),function(){if(alive())cb()})}
 pop(c1,0,function(){rd(E.a.say,c1,function(){
   var red=g.querySelectorAll('.dri');   /* 紅色 字母 的 分身 飛走（上面 那一行 還是 完整 的 What is）*/
   [].forEach.call(red,function(x){var r=x.getBoundingClientRect(),c=x.cloneNode(true),cs=getComputedStyle(x);c.style.cssText='position:fixed;left:'+r.left+'px;top:'+r.top+'px;font-size:'+cs.fontSize+';line-height:'+cs.lineHeight+';z-index:99;margin:0';document.getElementById('dcl').appendChild(c);void c.offsetWidth;c.classList.add('fly');decT(function(){c.remove()},900)});
   (E.om||[]).forEach(function(i){c1[i].classList.add('x');c1[i].appendChild(H('span','omt','✂️ 可以 省略'))});
   decT(function(){if(!alive())return;m2.classList.add('in');pop(c2,0,function(){rd(E.b.say,c2,function(){
     g.classList.add('go');m2.classList.add('go');z.classList.add('on');
     decT(function(){if(!alive())return;rd(E.a.say,c1,function(){decT(function(){if(!alive())return;rd(E.b.say,c2,function(){m2.classList.remove('go');next()})},500*decK())})},900*decK())})})},(red.length||(E.om||[]).length?1300:300)*decK())})})}

/* ── (5A)(5B) 解碼 開始 前 的 教學（2026-10-30 第三十四次 第 9 點）──
   ① 怎麼 拖：手指 示範 把 黃色 中文 方塊 拖到 英文 字 正下方 的 空格（也 可以 先 點 方塊、再 點 空格）
   ② 中英 順序 不 一樣：上面 真正 的 中文（他 是 誰？）一個 一個 飛到 英文 字 正下方 ➜ 變成「誰 是 他」；最下面 照樣 有 真正 的 中文
   ③ 小 測驗：自己 拖 2 題（錯 了 ＝ 看 正確 答案 再 做 一次，做對 才 開始）。第一次 一定 做完；做過 才 有〔⏭ 跳過〕
   T ＝ {key, demo:{en,t,x,z}, ord:{en,t,nat:[[中文, 第幾格]…],z,c1,c2}, quiz:[{en,t,x,z}…]} */
function decTut(T,done){var A0=DEC.A,o=$('#dcl'),k='dct_seen_'+T.key+'_'+(A0.sid()||'0'),seen=false;try{seen=!!localStorage.getItem(k)}catch(e){}
 var my=++DEC.lid,K=window.__DCLK||1,alive=function(){return my===DEC.lid};A0.pause();
 o.innerHTML='<div class="dlt">🔓 解碼 怎麼 玩？</div><div class="dlp"><i></i><i></i><i></i></div><div class="dtcap" id="dtcap"></div><div id="dtw"></div><div class="dtz" id="dtz"></div><div class="dlb" id="dlb">'+(seen?'<button class="sk" id="dlsk">⏭ 跳過</button>':'')+'</div><div class="dthand" id="dthand">👆</div>';o.classList.add('on');decCtl(o,function(){decTut(T,done)});
 var sk=$('#dlsk');if(sk)sk.onclick=fin;
 function dot(n){[].forEach.call(o.querySelectorAll('.dlp i'),function(d,j){d.className=j<n?'ok':j===n?'on':''})}
 function cap(h){$('#dtcap').innerHTML=h}
 function after(ms,f){decT(function(){if(alive())f()},ms*decK())}
 /* 一題 的 樣子（不 自己 檢查）*/
 function board(q,noTiles){var W=$('#dtw');W.innerHTML='';var st=H('div','dcbox'),row=H('div','dcw'),tray=H('div','dct');st.appendChild(row);st.appendChild(tray);W.appendChild(st);
  var cells=q.t.map(function(p,i){var c=H('div','dcc'+(/^['’]/.test(p[0])?' ct':'')+(q.t[i+1]&&/^['’]/.test(q.t[i+1][0])?' pre':''),'<div class="dce">'+decEN(p[0])+'</div>');c.setAttribute('data-w',p[0]);c.appendChild(H('div','dcs',''));row.appendChild(c);return c});
  var tiles=noTiles?[]:q.t.map(function(p){return p[1]}).concat(q.x||[]).map(function(zh){var b=H('div','dctl',esc(zh));b._z=zh;tray.appendChild(b);return b});
  [].forEach.call(tray.children,function(b,i){if(i%2)tray.appendChild(b)});decTW(st,tray);return {st:st,row:row,tray:tray,cells:cells,tiles:tiles}}
 var hand=$('#dthand');
 function handTo(el,cb){var r=el.getBoundingClientRect();hand.classList.add('on');hand.style.transform='translate('+(r.left+r.width/2-20)+'px,'+(r.top+r.height/2-10)+'px)';after(850,cb)}
 function fly(t,box,cb){var a=t.getBoundingClientRect(),b=box.getBoundingClientRect();t.classList.add('fly');t.style.transform='translate('+(b.left-a.left+(b.width-a.width)/2)+'px,'+(b.top-a.top+(b.height-a.height)/2)+'px)';
  var h=hand.getBoundingClientRect();hand.style.transform='translate('+(b.left+b.width/2-20)+'px,'+(b.top+b.height/2-10)+'px)';
  after(950,function(){box.textContent=t._z;box.classList.add('fill');t.classList.remove('fly');t.style.transform='';t.classList.add('used');cb()})}
 function tap(cb){hand.classList.remove('tap');void hand.offsetWidth;hand.classList.add('tap');after(400,cb)}
 /* ① 怎麼 拖 */
 function s1(){dot(0);var q=T.demo,B=board(q);$('#dtz').textContent='';cap('① <b>黃色 方塊</b> ＝ 中文');B.tray.classList.add('dthi');
  var tile=function(i){return B.tiles.filter(function(b){return b._z===q.t[i][1]&&!b.classList.contains('used')})[0]};
  after(1500,function(){cap('② 拖 到 <b>英文 字 正下方</b> 的 空格');B.row.querySelectorAll('.dcs').forEach(function(x){x.classList.add('dthi')});
   var t0=tile(0);handTo(t0,function(){tap(function(){fly(t0,B.cells[0].querySelector('.dcs'),function(){
    cap('③ 也 可以：<b>先 點 方塊</b>，<b>再 點 空格</b>');var t1=tile(1);handTo(t1,function(){tap(function(){t1.classList.add('sel');handTo(B.cells[1].querySelector('.dcs'),function(){tap(function(){t1.classList.remove('sel');fly(t1,B.cells[1].querySelector('.dcs'),function(){
      hand.classList.remove('on');for(var i=2;i<q.t.length;i++){var ti=tile(i),bx=B.cells[i].querySelector('.dcs');bx.textContent=ti._z;bx.classList.add('fill');ti.classList.add('used')}
      cap('④ 全部 放好 ➜ <b>自動 檢查</b> ✅');B.row.querySelectorAll('.dcs').forEach(function(x){x.classList.add('ok')});$('#dtz').textContent=q.z;
      decRead(q.en,q.v||'',B.cells,function(){if(alive())after(1000,s2)})})})})})})})})})})}
 /* ② 中英 順序 不 一樣 */
 function s2(){dot(1);var q=T.ord,B=board(q,true),W=$('#dtw'),nat=H('div','dtnat','<span class="lbl">中文：</span>');W.insertBefore(nat,W.firstChild);$('#dtz').textContent='';
  cap(q.c1);var chips=q.nat.map(function(p){var b=H('div','dctl',esc(p[0]));b._z=p[0];b._i=p[1];nat.appendChild(b);return b});
  after(2200,function(){cap(q.c2);var order=chips.slice().sort(function(a,b){return a._i-b._i}),k=0;
   (function one(){if(k>=order.length){after(500,function(){cap(q.c3);$('#dtz').textContent='👀 最下面 有 真正 的 中文：'+q.z;decRead(q.en,q.v||'',B.cells,function(){if(alive())after(700,function(){decRead(q.en,q.v||'',B.cells,function(){if(alive())after(1200,s3)})})})});return}
    var c=order[k++];fly(c,B.cells[c._i].querySelector('.dcs'),function(){c.classList.remove('used');c.style.opacity='.4';after(250,one)})})()})}
 /* ③ 小 測驗（自己 拖；用 正式 的 解碼 畫面）*/
 function s3(){dot(2);var n=0;
  (function ask(){if(!alive())return;if(n>=T.quiz.length){cap('');$('#dtw').innerHTML='<div class="dtok">✅ 你 學會 了！</div>';$('#dtz').textContent='';try{localStorage.setItem(k,'1')}catch(e){}after(1300,fin);return}
   var q=T.quiz[n],W=$('#dtw');W.innerHTML='';$('#dtz').textContent='';cap('✏️ 小 測驗 '+(n+1)+' ／ '+T.quiz.length+'：把 中文 方塊 放到 英文 字 正下方');
   DEC.A={aud:A0.aud,stop:A0.stop,sid:A0.sid,pause:function(){},go:function(){},busy:function(){return !alive()},
    ok:function(){DEC.A=A0;n++;after(900,ask)},
    bad:function(){DEC.A=A0;var ss=W.querySelectorAll('.dcs');[].forEach.call(ss,function(x,i){x.textContent=q.t[i][1];x.classList.remove('no');x.classList.add('ok')});
     cap('👀 看 正確 答案（每一個 英文 字 正下方）➜ <b>再 做 一次</b>');$('#dtz').textContent=q.z;decRead(q.en,q.v||'',[].slice.call(W.querySelectorAll('.dcc')),function(){if(alive())after(1400,ask)})}};
   decRender(q,W)})()}
 function fin(){if(my!==DEC.lid)return;DEC.lid++;DEC.A=A0;decStop();o.classList.remove('on');o.innerHTML='';done()}
 s1()}
DEC.lid=0;
`;
