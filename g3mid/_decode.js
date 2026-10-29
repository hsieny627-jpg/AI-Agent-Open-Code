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
.dcs.fill{border-style:solid;border-color:#FFD54A;background:#2A2410}
.dcs.ok{border-color:#2BD46A;background:#0F3A1F;color:#BFFFD0}.dcs.no{border-color:#FF5A5A;background:#3A1010;color:#FFC2C2;animation:dcsh .45s}
@keyframes dcsh{20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
.dcc.spk{transform:scale(1.12);filter:brightness(1.35) drop-shadow(0 0 10px rgba(255,230,140,.55))}
.dct{display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(10px,1.4vw,18px);margin:clamp(14px,3vh,34px) auto 0;max-width:1100px;min-height:clamp(70px,10vh,96px)}
.dctl{min-width:clamp(92px,10vw,140px);min-height:clamp(62px,9vh,84px);padding:4px 16px;border-radius:16px;border:4px solid #C9A227;background:linear-gradient(#FFE58A,#F5B829);color:#3A2600;
  font-size:clamp(26px,4.4vh,40px);display:flex;align-items:center;justify-content:center;touch-action:none;cursor:grab;box-shadow:0 6px 0 #9A6B00;transition:transform .15s}
.dctl.sel{transform:translateY(-6px) scale(1.06);border-color:#5EC8FF;box-shadow:0 0 0 5px rgba(94,200,255,.45),0 6px 0 #9A6B00}
.dctl.drag{z-index:60;position:relative;transition:none;box-shadow:0 14px 24px rgba(0,0,0,.5)}
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
function decRead(text,v,cells,done){var A=DEC.A;A.stop();var my=++DEC.rid,f=A.aud(text,v),w=cells.map(function(c){return Math.max(1,(c.getAttribute('data-w')||'').replace(/[^A-Za-z]/g,'').length)+1}),tot=w.reduce(function(a,b){return a+b},0);
 function hl(r){var acc=0,k=-1;for(var i=0;i<w.length;i++){acc+=w[i];if(r*tot<acc){k=i;break}}cells.forEach(function(c,i){c.classList.toggle('spk',i===k)})}
 function fin(){if(my!==DEC.rid)return;cells.forEach(function(c){c.classList.remove('spk')});if(done)done()}
 if(f){var au=new Audio(f);DEC.au=au;var raf=0,t0=0;au.onended=function(){cancelAnimationFrame(raf);fin()};au.onerror=function(){cancelAnimationFrame(raf);est()};
  (function lp(){if(my!==DEC.rid){try{au.pause()}catch(e){}return}if(au.duration>0&&!au.paused)hl(Math.min(.999,au.currentTime/au.duration));raf=requestAnimationFrame(lp)})();
  var p=au.play();if(p&&p.catch)p.catch(function(){cancelAnimationFrame(raf);est()});return}
 est();
 function est(){var T=Math.max(1.2,tot*.085)*1000,s=performance.now();try{var u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.8;speechSynthesis.speak(u)}catch(e){}
  (function lp(){if(my!==DEC.rid)return;var r=(performance.now()-s)/T;if(r>=1){fin();return}hl(r);requestAnimationFrame(lp)})()}}
DEC.rid=0;
function decClose(){DEC.lid++;decStop();var o=document.getElementById('dcl');if(o){o.classList.remove('on');o.innerHTML=''}}   /* 回 大廳、老師 結束 ＝ 動畫 收起來 */
function decStop(){DEC.rid++;if(DEC.au){try{DEC.au.pause()}catch(e){}DEC.au=null}}
/* 一題：q ＝ {en, t:[[英文, 中文]…], x:[錯 方塊…], z 整句 中文, v 聲音} */
function decRender(q,st0){var A=DEC.A,st=H('div','dcbox');st0.appendChild(st);var row=H('div','dcw'),tray=H('div','dct'),zh=H('div','dcz',esc(q.z)),sel=null,selS=null;
  var cells=q.t.map(function(p,i){var c=H('div','dcc'+(/^['\u2019]/.test(p[0])?' ct':'')+(q.t[i+1]&&/^['\u2019]/.test(q.t[i+1][0])?' pre':''),'<div class="dce">'+decEN(p[0])+'</div>');c.setAttribute('data-w',p[0]);var s=H('div','dcs','');s.setAttribute('data-i',i);c.appendChild(s);row.appendChild(c);
   s.addEventListener('click',function(){if(A.busy()||DEC.lock)return;if(s._t){back(s);return}if(sel){put(sel,s);return}row.querySelectorAll('.dcs.sel').forEach(function(x){x.classList.remove('sel')});selS=s;s.classList.add('sel')});return c});
 st.appendChild(row);st.appendChild(tray);st.appendChild(zh);
 var tiles=shuf(q.t.map(function(p){return p[1]}).concat(q.x||[]));
 tiles.forEach(function(z){var b=H('div','dctl',esc(z));b._z=z;tray.appendChild(b);var sx,sy,mv,dn=false;
  b.addEventListener('pointerdown',function(e){if(A.busy()||DEC.lock||b.classList.contains('used'))return;e.preventDefault();dn=true;sx=e.clientX;sy=e.clientY;mv=false;try{b.setPointerCapture(e.pointerId)}catch(x){}});
  b.addEventListener('pointermove',function(e){if(!dn)return;var dx=e.clientX-sx,dy=e.clientY-sy;if(!mv&&Math.abs(dx)+Math.abs(dy)>10){mv=true;b.classList.add('drag')}if(mv){b.style.transform='translate('+dx+'px,'+dy+'px) scale(1.08)';var o=over(e);row.querySelectorAll('.dcs').forEach(function(s){s.classList.toggle('hot',s===o)})}});
  function up(e){if(!dn)return;dn=false;b.classList.remove('drag');b.style.transform='';row.querySelectorAll('.dcs.hot').forEach(function(s){s.classList.remove('hot')});
   if(!mv){if(selS){put(b,selS);return}tray.querySelectorAll('.dctl.sel').forEach(function(x){x.classList.remove('sel')});if(sel===b){sel=null;return}sel=b;b.classList.add('sel');return}
   var o=e?over(e):null;if(o)put(b,o)}
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',function(){dn=false;b.classList.remove('drag');b.style.transform=''})});
 function over(e){var best=null;row.querySelectorAll('.dcs').forEach(function(s){var r=s.getBoundingClientRect();if(e.clientX>r.left-24&&e.clientX<r.right+24&&e.clientY>r.top-40&&e.clientY<r.bottom+40)best=s});return best}
 function put(b,s){if(s._t)back(s);s._t=b;s.textContent=b._z;s.classList.add('fill');s.classList.remove('sel','hot');b.classList.add('used');b.classList.remove('sel');sel=null;selS=null;
  decFit(st);if([].every.call(row.querySelectorAll('.dcs'),function(x){return x._t}))setTimeout(check,350)}
 function back(s){if(!s._t)return;s._t.classList.remove('used');s._t=null;s.textContent='';s.classList.remove('fill')}
 function check(){if(A.busy()||DEC.lock)return;var ss=[].slice.call(row.querySelectorAll('.dcs')),got=ss.map(function(s){return s._t?s._t._z:''}),okN=0;
  ss.forEach(function(s,i){var y=got[i]===q.t[i][1];if(y)okN++;s.classList.add(y?'ok':'no')});DEC.lock=true;A.pause();
  if(okN===ss.length){var cs=[].slice.call(row.querySelectorAll('.dcc'));zh.classList.add('on');decRead(q.en,q.v||'',cs,function(){DEC.lock=false;A.ok(row)});return}
  setTimeout(function(){DEC.lock=false;A.bad(got,okN/ss.length)},900)}
 DEC.lock=false;decFit(st)}
/* 畫面 放不下（四年級 句子 長、方塊 多）＝ 一級 一級 縮小，不用 捲動 */
function decFit(b){var lv=b.classList.contains('dz4')?4:b.classList.contains('dz3')?3:b.classList.contains('dz2')?2:b.classList.contains('dz1')?1:0;while(lv<4&&document.documentElement.scrollHeight>innerHeight+1){b.classList.remove('dz'+lv);lv++;b.classList.add('dz'+lv)}}
addEventListener('resize',function(){var b=document.querySelector('.dcbox');if(b){b.classList.remove('dz1','dz2','dz3','dz4');decFit(b)}});
/* 答錯頁 的「你 放的」：每一格 英文 下面 你 放 的 中文（錯 的 劃掉） */
function decYou(q,got){if(!got||!got.length)return '';return '<div class="dcy">'+q.t.map(function(p,i){var y=got[i]===p[1];return '<span>'+esc(p[0].replace(/'/g,'\\u2019'))+'<i class="'+(y?'':'no')+'">'+esc(got[i]||'　')+'</i></span>'}).join('')+'</div>'}
/* ── 每一課 開始 前 的 秒懂 動畫（老師 3(3)：≧ 20 秒；第一次 一定 看完）── */
function decLesson(L,done){var A=DEC.A,o=$('#dcl'),k='dcl_seen_'+L.key+'_'+(A.sid()||'0'),seen=false;try{seen=!!localStorage.getItem(k)}catch(e){}
 var my=++DEC.lid,t0=Date.now(),MIN=window.__DCLMIN!=null?window.__DCLMIN:20000,K=window.__DCLK||1;A.pause();   /* __DCLK、__DCLMIN ＝ 量測 用（快轉） */
 o.innerHTML='<div class="dlt">🔓 '+esc(L.title)+'</div><div class="dls">'+esc(L.sub)+'</div><div class="dlp">'+L.s.map(function(){return '<i></i>'}).join('')+'</div><div class="dlw" id="dlw"></div><div class="dlz" id="dlz"></div><div class="dlsec" id="dlsec"></div><div class="dlb" id="dlb">'+(seen?'<button class="sk" id="dlsk">⏭ 跳過</button>':'')+'</div>';o.classList.add('on');
 var sk=$('#dlsk');if(sk)sk.onclick=fin;
 var i=0;function one(){if(my!==DEC.lid)return;if(i>=L.s.length){wait();return}var S=L.s[i],dots=o.querySelectorAll('.dlp i');[].forEach.call(dots,function(d,j){d.className=j<i?'ok':j===i?'on':''});
  var w=$('#dlw'),z=$('#dlz');w.innerHTML='';z.classList.remove('on');z.textContent=S.z;
  var cs=S.t.map(function(p){var c=H('div','dlc'+(/^['\u2019]/.test(p[0])?' ct':''),'<div class="ic">'+(p[2]||'')+'</div><div class="en">'+decEN(p[0])+'</div><div class="zh">'+esc(p[1])+'</div>');c.setAttribute('data-w',p[0]);w.appendChild(c);return c});
  var j=0;(function pop(){if(my!==DEC.lid)return;if(j<cs.length){cs[j].classList.add('in');j++;setTimeout(pop,420*K);return}
   setTimeout(function(){if(my!==DEC.lid)return;decRead(S.en,S.v||'',cs,function(){if(my!==DEC.lid)return;z.classList.add('on');
     setTimeout(function(){if(my!==DEC.lid)return;decRead(S.en,S.v||'',cs,function(){setTimeout(function(){i++;one()},900*K)})},1100*K)})},300*K)})()}
 function wait(){if(my!==DEC.lid)return;[].forEach.call(o.querySelectorAll('.dlp i'),function(d){d.className='ok'});var left=MIN-(Date.now()-t0);if(left>0){$('#dlsec').textContent='';setTimeout(wait,Math.min(left,500));return}
  try{localStorage.setItem(k,'1')}catch(e){}$('#dlb').innerHTML='<button class="go" id="dlgo">▶ 開始 解碼！</button>';$('#dlgo').onclick=fin}
 function fin(){if(my!==DEC.lid)return;DEC.lid++;decStop();o.classList.remove('on');o.innerHTML='';done()}
 one()}
DEC.lid=0;
`;
