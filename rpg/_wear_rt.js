/* rpg/_wear_rt.js — 🏪 榮耀寶物商城：穿在英雄身上（2026-10-18 第九次；規則 score/_calc.js 的 RPS；樣子 rpg/_wear.css）
   〔🦸 我的英雄〕舞台、平板最後一幕 🦸、⚡ 現場任務 都用這一份（score/_client.js 帶進每一頁）。s ＝ 身上戴的 {au 光環, cp 披風, fx 必殺, nf 名字框, bg 背景, po 寵物服裝, wg 翅膀, mt 坐騎}
   rwSrc(圖)、rwBack(英雄卡後面：翅膀、披風、光環)、rwFront(腳下：坐騎)、rwPo(寵物服裝)、rwNf(名字框)、rwBg(背景的 style)、rwFx(必殺武功特效：蓋滿畫面 1.4 秒) */
function rwSrc(b,id,ic){return b+'rpg/'+(/^s\d{4}$/.test(id)?'shop/'+id+(ic?'i.webp':'.jpg'):(/^[bg]/.test(id)?'chars':/^w/.test(id)?'weapons':'pets')+'/'+id+'.jpg')}
function rwI(b,id,c){return id?'<img class="'+c+'" src="'+rwSrc(b,id,1)+'" alt="" aria-hidden="true">':''}
function rwBack(b,s){s=s||{};return rwI(b,s.wg,'rw-wg')+rwI(b,s.cp,'rw-cp')+rwI(b,s.au,'rw-au')}
function rwFront(b,s){s=s||{};return rwI(b,s.au,'rw-au2')+rwI(b,s.mt,'rw-mt')}   /* 光環：後面一圈大的＋前面一層半透明發光（只放後面會被英雄卡擋住） */
function rwPo(b,s){return rwI(b,(s||{}).po,'rw-po')}
function rwNf(b,s){return rwI(b,(s||{}).nf,'rw-nf')}
function rwBg(b,s){return s&&s.bg?"background-image:linear-gradient(rgba(5,7,13,.25),rgba(5,7,13,.6)),url('"+rwSrc(b,s.bg,1)+"');background-size:cover;background-position:center":''}
function rwFx(b,id){if(!id||!document.body)return;var o=document.createElement('div');o.className='rw-fx';o.setAttribute('aria-hidden','true');
  o.innerHTML='<img src="'+rwSrc(b,id,1)+'" alt="">';document.body.appendChild(o);setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o)},1500)}
