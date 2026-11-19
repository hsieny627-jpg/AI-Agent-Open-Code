/* ══ 2026-11-19 第六十二次 老師 2-(3)：🔤 字母 和 聲音（44 音 字卡）＝ 拼音 地圖 的 地基 ══
 * 老師：學生 操作 字首／字中／字尾 以前，一定 要 非常 熟悉 每 一個 字母 的 聲音 ↔ 字母（看 e ➜ 唸 ㄝ；聽 一 ➜ ea、ee、e_e）。
 * 每 一張 母音 字卡、子音 字卡 ＝ 一部 秒懂 動畫（照 老師 SoR 44 音 投影片：上面 注音 方塊、下面 字母、b_d 例字）；
 * 13 個 學習 主題（資料 _snd.js 的 TH）由 基礎 到 進階；每 一個 主題 一個 量身 打造 的 遊戲（開始 前 30 秒 複習 動畫；玩 過 以後 學生 自己 選 要不要 看）；
 * 遊戲 ＝ GM 的 sd0～sd12 ＝ 一樣 記 成績（g年級gm_ph-sdN）、一樣 放進〔⚡ 現場任務〕🗺️ 拼音 地圖 遊戲（live/_cr_host.js PMG）。*/
TT.ear={zh:'ㄦ',sup:'一',kk:'ɪr',ipa:'ɪɹ'};TT.air={zh:'ㄦ',sup:'ㄝ',kk:'ɛr',ipa:'ɛɹ'};TT.zh={zh:'ʒ',sup:'',kk:'ʒ',ipa:'ʒ'};
let SDT=LS.g('sdt',0),SDP=0,SDDONE=LS.g('sdd',{});
const SDLIST=(()=>{const L=[];SND.TH.forEach((t,ti)=>{if(!t.items.length){L.push({ti,intro:1,n:'英文 有 44 個 聲音'});L.push({ti,intro:2,n:'聲音 ⇄ 字母'})}else t.items.forEach(k=>L.push({ti,k,n:SND.BY[k].sp.join('、')+'（'+sdZy(SND.BY[k])+'）'}))});return L})();
function sdZy(x){const o=tileOf(x.t);return MD==='zh'?(o.sup||'')+o.zh:MD==='kk'?o.kk:o.ipa}
/* 2026-11-19 第六十四次 老師 2-A：雙語 注音 正下方 一律 加 小字 KK（/æ/，注音 的 3 成、淡色）＝ 證明 注音 是 照 KK 轉 來 的；學習 重點 還是 注音 */
function sdTile(x,big){const o=tileOf(x.t);const tx=MD==='zh'?'<span class="zgrp"><span class="zrow"><b class="zm">'+o.zh+'</b>'+(o.sup?'<sup class="zc">'+o.sup+'</sup>':'')+'</span>'+(o.kk?'<em class="kkm">/'+o.kk+'/</em>':'')+'</span>':'<b class="zm en">'+(MD==='kk'?o.kk:o.ipa)+'</b>';
  return '<span class="sdtile '+(x.v?'v':'c')+(big?' big':'')+'" data-sda="'+x.au+'">'+tx+'</span>'}
/* 字母 顏色（全站 規則）：母音 紅、唸 名字 的 第一個 黃底＋第二個 灰、magic e 的 e 灰、兩個 母音 一個 聲音 粉紅、母音 後面 的 r 藍、子音 藍、兩個 字母 一個 聲音 水藍、ck 的 c 灰、弱化音 淡紅 */
function sdSp(s,x){const NM=['ai','ay','ee','ea','oa','ow'],nm=x&&['ai','ee','oa'].indexOf(x.k)>=0,V=/[aeiou]/;let h='';
  if(/_e$/.test(s))return '<span class="sp"><i class="ny">'+s[0]+'</i><i class="us">_</i><i class="gr">e</i></span>';
  if(x&&x.weak)return '<span class="sp"><i class="vw">'+s+'</i></span>';
  if(nm&&NM.indexOf(s)>=0)return '<span class="sp"><i class="ny">'+s[0]+'</i><i class="gr">'+s[1]+'</i></span>';
  if(/^(ear|air)$/.test(s))return '<span class="sp"><i class="pk">'+s.slice(0,2)+'</i><i class="rb">r</i></span>';
  if(/^[aeiou]r$/.test(s))return '<span class="sp"><i class="vr">'+s[0]+'</i><i class="rb">r</i></span>';
  if(/^(ou|ow|oi|oy|oo)$/.test(s))return '<span class="sp"><i class="pk">'+s+'</i></span>';
  if(s==='ck')return '<span class="sp"><i class="gr">c</i><i class="cb">k</i></span>';
  if(/^(sh|ch|th|ng|ph|si|ge)$/.test(s))return '<span class="sp"><i class="cy">'+s+'</i></span>';
  for(const c of s)h+='<i class="'+(V.test(c)?'vr':'cb')+'">'+c+'</i>';return '<span class="sp">'+h+'</span>'}
async function sdW(ms,me){await wait(ms);return me===TOK}
async function sdSay(a,me,el){if(me!==TOK)return false;while(PAUSED&&me===TOK)await wait(100);if(me!==TOK)return false;if(el)el.classList.add('on');await say(a);if(el)el.classList.remove('on');return me===TOK}
function sdCap(root,t){const c=root.querySelector('.sdcap');if(c){c.innerHTML=t;c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}}
/* ── 一部 動畫 ── */
async function sdPlay(p,root,fast){root=root||$('#sdStage');const me=++TOK,it=SDLIST[p];if(!it)return;PAUSED=false;if(root===$('#sdStage')){SDP=p;LS.s('sdp',p);sdNav()}
  const th=SND.TH[it.ti];
  if(it.intro===1){root.innerHTML='<div class="sdh">第 '+(p+1)+' 部｜'+th.ic+' '+th.n+'</div><div class="sd44"><div class="sdrow" id="sdV"></div><div class="sdrow" id="sdC"></div></div><div class="sdn" id="sdN">0</div><div class="sdcap"></div>';
    sdCap(root,'英文 有 <b>44</b> 個 聲音');if(!await sdW(900,me))return;
    const N=root.querySelector('#sdN');let n=0;sdCap(root,'🔴 <b>20</b> 個 母音：嘴巴 打開，聲音 自由 出來');
    for(const x of SND.V){root.querySelector('#sdV').insertAdjacentHTML('beforeend',sdTile(x));N.textContent=++n;if(!await sdW(fast?40:130,me))return}
    if(!await sdSay('s_eh',me))return;sdCap(root,'🔵 <b>24</b> 個 子音：嘴唇、舌頭、牙齒 擋 一下');
    for(const x of SND.C){root.querySelector('#sdC').insertAdjacentHTML('beforeend',sdTile(x));N.textContent=++n;if(!await sdW(fast?40:110,me))return}
    if(!await sdSay('s_b',me))return;sdCap(root,'20 ＋ 24 ＝ <b>44</b> 個 聲音　👆 點 任何 一個 聽聽看');return sdDone(p,root)}
  if(it.intro===2){const E=SND.BY.ee,EH=SND.BY.eh;root.innerHTML='<div class="sdh">第 '+(p+1)+' 部｜'+th.ic+' '+th.n+'</div><div class="sdlane" id="sdL1"><span class="sdl">👀 看 字 ➜ 🔊 唸</span><span class="sdq"></span></div><div class="sdlane" id="sdL2"><span class="sdl">👂 聽 ➜ ✏️ 哪些 字母？</span><span class="sdq"></span></div><div class="sdcap"></div>';
    const q1=root.querySelector('#sdL1 .sdq'),q2=root.querySelector('#sdL2 .sdq');
    sdCap(root,'看到 字母 <b class="en">e</b> ➜ 唸 出 它 的 聲音');q1.innerHTML=sdSp('e')+'<span class="sdar">➜</span>';if(!await sdW(700,me))return;q1.insertAdjacentHTML('beforeend',sdTile(EH,1));if(!await sdSay(EH.au,me,q1.lastChild))return;if(!await sdSay(EH.au,me,q1.lastChild))return;
    sdCap(root,'聽到 <b>'+sdZy(E)+'</b> ➜ 可能 是 好幾種 字母');q2.innerHTML=sdTile(E,1)+'<span class="sdar">➜</span>';if(!await sdSay(E.au,me,q2.firstChild))return;
    for(const s of E.sp){q2.insertAdjacentHTML('beforeend',sdSp(s,E));if(!await sdSay(E.au,me,q2.lastChild))return;if(!await sdW(250,me))return}
    sdCap(root,'💪 這 是 最 重要 的 基本 能力：<b>看 字 ➜ 唸</b>、<b>聽 聲音 ➜ 知道 有 哪些 字母</b>');return sdDone(p,root)}
  const x=SND.BY[it.k],multi=x.sp.length>1;
  root.innerHTML='<div class="sdh">第 '+(p+1)+' 部｜'+th.ic+' '+th.n+'</div><div class="sdcard '+(x.v?'v':'c')+'"><div class="sdtop">'+sdTile(x,1)+'<span class="sdbub">🔊</span></div><div class="sddn">⬇ <span>字母</span></div><div class="sdsps"></div></div><div class="sdcue" hidden>👄 '+x.cue+'</div><div class="sdex" hidden></div><div class="sdcap"></div>';
  const tile=root.querySelector('.sdtile'),sps=root.querySelector('.sdsps');
  sdCap(root,'🔊 聽：<b>'+sdZy(x)+'</b>');tile.classList.add('in');if(!await sdSay(x.au,me,tile))return;if(!await sdW(300,me))return;if(!await sdSay(x.au,me,tile))return;
  root.querySelector('.sddn').classList.add('in');
  for(const s of x.sp){sps.insertAdjacentHTML('beforeend',sdSp(s,x));const el=sps.lastChild;el.classList.add('in');if(!await sdSay(x.au,me,el))return;if(!await sdW(250,me))return}
  sdCap(root,multi?'👂 聽到 <b>'+sdZy(x)+'</b> ➜ 可能 是 <b class="en">'+x.sp.join('、')+'</b>':'👀 看到 <b class="en">'+x.sp[0]+'</b> ➜ 唸 <b>'+sdZy(x)+'</b>');if(!await sdW(900,me))return;
  const cu=root.querySelector('.sdcue');cu.hidden=false;cu.classList.add('in');if(!await sdW(1200,me))return;
  const ex=root.querySelector('.sdex');ex.hidden=false;ex.innerHTML='<div class="wrow">'+wordHTML(x.ex[0],{dots:1})+'</div><button class="wsay" data-sdw="'+p+'">🔊 '+x.ex[2]+'</button>';ex.classList.add('in');
  sdCap(root,'例字：<b class="en">'+x.ex[2]+'</b>'+(x.weak?'（第二個 e 唸 得 很 輕 ＝ 弱化音）':''));
  if(!await sdRead(x,ex,me))return;
  if(multi){sdCap(root,'👀 看 <b class="en">'+x.sp.join('、')+'</b> ➜ 都 唸 <b>'+sdZy(x)+'</b>　　👂 聽 <b>'+sdZy(x)+'</b> ➜ 想 到 '+x.sp.length+' 種 拼法')}
  return sdDone(p,root)}
async function sdRead(x,ex,me){const S=parse(x.ex[0]),cks=qsa(ex,'.ck');let k=0;for(const Bx of S)for(const b of Bx)for(const c of b.ch){const el=cks[k++];if(!c.t||b.type==='g'||!el)continue;const hit=c.t===x.t||(x.k==='ax'&&c.t==='ah');if(hit)el.classList.add('sdhit');if(!await sdSay(auOf(c.t,b.coda)==='s_ah'&&x.k==='ax'?'s_ax':auOf(c.t,b.coda),me,el))return false}
  if(!await sdW(250,me))return false;await sayWhole(ex.querySelector('.wrow'),x.ex[1],me);return me===TOK}
function sdDone(p,root){if(root!==$('#sdStage'))return;SDDONE[p]=1;LS.s('sdd',SDDONE);const it=SDLIST[p],th=SND.TH[it.ti],last=!SDLIST[p+1]||SDLIST[p+1].ti!==it.ti;
  root.insertAdjacentHTML('beforeend','<div class="sdend">'+(last?'<button class="btn go sdgo" data-sdg="'+it.ti+'">🎮 練習 這個 主題：'+SND.GN[th.g][0]+' '+SND.GN[th.g][1]+'</button>':'')+(SDLIST[p+1]?'<button class="btn gold" data-sdp="'+(p+1)+'">▶ 下 一部：'+SDLIST[p+1].n+'</button>':'')+'</div>');sdNav()}
/* ── 分頁 畫面 ── */
function sdNav(){const t=$('#sdThs');if(!t)return;const cur=SDLIST[SDP]?SDLIST[SDP].ti:SDT;
  t.innerHTML=SND.TH.map((x,i)=>{const ps=SDLIST.map((y,j)=>[y,j]).filter(z=>z[0].ti===i),dn=ps.every(z=>SDDONE[z[1]]);return '<button class="sdthb'+(i===cur?' on':'')+(dn?' dn':'')+'" data-sdt="'+i+'"><b>'+(i+1)+'</b> '+x.ic+' '+x.n+'<small>動畫 第 '+(ps[0][1]+1)+(ps.length>1?'～'+(ps[ps.length-1][1]+1):'')+' 部'+(dn?' ✔':'')+'</small></button>'}).join('');
  const th=SND.TH[cur],ps=SDLIST.map((y,j)=>[y,j]).filter(z=>z[0].ti===cur);
  $('#sdInfo').innerHTML='<div class="sdgoal">🎯 <b>'+th.goal+'</b>　💪 '+th.why+'</div><div class="sdps">'+ps.map(z=>'<button class="sdpb'+(z[1]===SDP?' on':'')+(SDDONE[z[1]]?' dn':'')+'" data-sdp="'+z[1]+'">'+(z[0].k?sdTile(SND.BY[z[0].k]):'<span class="sdtile c">'+(z[0].intro===1?'44':'⇄')+'</span>')+'<span>第 '+(z[1]+1)+' 部</span></button>').join('')+
    '<button class="btn go sdgo" data-sdg="'+cur+'">🎮 '+SND.GN[th.g][0]+' '+SND.GN[th.g][1]+'</button></div>'}
function sdTab(){SDP=Math.min(LS.g('sdp',0),SDLIST.length-1);sdNav();sdCard(SDP)}
function sdCard(p){TOK++;const it=SDLIST[p];SDP=p;sdNav();const x=it.k&&SND.BY[it.k];
  $('#sdStage').innerHTML='<div class="sdh">第 '+(p+1)+' 部｜'+SND.TH[it.ti].ic+' '+SND.TH[it.ti].n+'</div><div class="sdstart">'+(x?'<div class="sdcard '+(x.v?'v':'c')+'"><div class="sdtop">'+sdTile(x,1)+'</div><div class="sdsps">'+x.sp.map(s=>sdSp(s,x)).join('')+'</div></div>':'<div style="font-size:64px">'+(it.intro===1?'🔤 44':'👀 ⇄ 👂')+'</div>')+'<div class="cap">'+it.n+'</div><button class="btn go" data-sdplay="'+p+'" style="font-size:30px;min-height:70px">▶ 播放 動畫</button></div>'}
function sdIdx(){let o=$('#sdIdxP');if(!o){o=H('div','');o.id='sdIdxP';document.body.appendChild(o)}o.hidden=false;
  o.innerHTML='<div class="pnl"><div class="ctl"><b style="font-size:26px">📑 目次：44 音 字卡 '+SDLIST.length+' 部 動畫</b><button class="btn" id="sdIdxX">✖ 關閉</button></div>'+SND.TH.map((t,i)=>'<h3>'+(i+1)+'. '+t.ic+' '+t.n+'</h3><div class="sdps">'+SDLIST.map((y,j)=>[y,j]).filter(z=>z[0].ti===i).map(z=>'<button class="sdpb'+(SDDONE[z[1]]?' dn':'')+'" data-sdp="'+z[1]+'">'+(z[0].k?sdTile(SND.BY[z[0].k]):'')+'<span>第 '+(z[1]+1)+' 部 '+z[0].n+(SDDONE[z[1]]?' ✔':'')+'</span></button>').join('')+'</div>').join('')+'</div>';
  $('#sdIdxX').onclick=()=>{o.hidden=true}}
document.addEventListener('click',e=>{const sc=e.target.closest('[data-sdc]');if(sc){const c=sc.dataset.sdc;
    if(c==='idx')sdIdx();else if(c==='pause'){PAUSED=!PAUSED;sc.textContent=PAUSED?'▶ 繼續':'⏸️ 暫停'}else if(c==='slow'){SLOW=SLOW>1?1:1.6;sc.classList.toggle('on',SLOW>1)}
    else if(c==='again')sdPlay(SDP);else if(c==='prev'&&SDP>0){sdCard(SDP-1);sdPlay(SDP)}else if(c==='next'&&SDP<SDLIST.length-1){sdCard(SDP+1);sdPlay(SDP)}return}
  const t=e.target.closest('[data-sdt]');if(t){const i=+t.dataset.sdt;const p=SDLIST.findIndex(y=>y.ti===i);SDT=i;LS.s('sdt',i);sdCard(p);return}
  const p=e.target.closest('[data-sdp]');if(p){const o=$('#sdIdxP');if(o)o.hidden=true;sdCard(+p.dataset.sdp);sdPlay(+p.dataset.sdp);return}
  const pl=e.target.closest('[data-sdplay]');if(pl){sdPlay(+pl.dataset.sdplay);return}
  const g=e.target.closest('[data-sdg]');if(g){start('sd'+g.dataset.sdg);return}
  const a=e.target.closest('[data-sda]');if(a&&!e.target.closest('#game')){a.classList.add('on');say(a.dataset.sda).then(()=>a.classList.remove('on'));return}
  const w=e.target.closest('[data-sdw]');if(w){const x=SND.BY[SDLIST[+w.dataset.sdw].k];sayWhole(w.parentNode.querySelector('.wrow'),x.ex[1],++TOK)}});
/* ── 30 秒 複習 動畫（遊戲 開始 前）：這 個 主題 每 一張 卡 的 關鍵 一幕（注音 ➜ 字母 ➜ 聲音）── */
async function sndReview(ti,root){const me=++TOK,th=SND.TH[ti],L=th.items.length?th.items.map(k=>SND.BY[k]):[SND.BY.eh,SND.BY.ee,SND.BY.b];
  root.innerHTML='<div class="sdrev"></div><div class="sdcap"></div>';const R0=root.querySelector('.sdrev');
  if(!th.items.length){sdCap(root,'🔴 母音：嘴巴 打開　🔵 子音：嘴唇、舌頭、牙齒 擋 一下')}
  for(const x of L){if(me!==TOK)return;R0.innerHTML='<div class="sdcard '+(x.v?'v':'c')+' sm"><div class="sdtop">'+sdTile(x,1)+'</div><div class="sdsps">'+x.sp.map(s=>sdSp(s,x)).join('')+'</div></div><div class="sdcue">👄 '+x.cue+'</div>';
    if(th.items.length)sdCap(root,(x.sp.length>1?'👂 聽到 <b>'+sdZy(x)+'</b> ➜ <b class="en">'+x.sp.join('、')+'</b>':'👀 <b class="en">'+x.sp[0]+'</b> ➜ 🔊 <b>'+sdZy(x)+'</b>'));
    if(!await sdSay(x.au,me,R0.querySelector('.sdtile')))return;if(!await sdW(250,me))return;if(!await sdSay(x.au,me,R0.querySelector('.sdsps')))return;if(!await sdW(Math.max(900,Math.round(24000/L.length)-2200),me))return}
  sdCap(root,'✔ 複習 完 了！按〔▶ 開始〕')}
/* ══ 遊戲：sd0～sd12（每 個 主題 一個；名字 ＝ 真的 玩法）══ */
SND.TH.forEach((t,i)=>{const g=SND.GN[t.g];GM['sd'+i]={ic:g[0],nm:'44 音 '+(i+1)+'｜'+g[1],goal:t.goal,how:g[2],T:t.g==='catch'?20:t.g==='sort'?12:15,q:()=>sdQ(i)};GREV['sd'+i]=['snd'+i,t.why]});
function sdPool(ti){const t=SND.TH[ti];return (t.items.length?t.items:SND.ALL.map(x=>x.k)).map(k=>SND.BY[k]).filter(x=>t.g==='sort'||t.g==='pick'||!x.weak)}
function sdPick(ti){G.sdr=G.sdr||[];const k=G.sdr.findIndex(r=>r.at<=G.q);if(k>=0){G.re=1;return G.sdr.splice(k,1)[0].x}G.re=0;const L=sdPool(ti);let x;for(let i=0;i<6;i++){x=R(L);if(x!==G.sdl)break}G.sdl=x;return x}
function sdInfo(x,yours){return {spec:x.ex[0],au:x.ex[1],zh:'',idx:x.i,yours,tip:'<b>'+sdZy(x)+'</b> ＝ <span class="en">'+x.sp.join('、')+'</span>　👄 '+x.cue,sdx:x}}
function sdAns(ok,x,yours){if(!ok&&!G.re&&G.q<(G.N||NQ)-1){G.sdr=G.sdr||[];G.sdr.push({x,at:G.q+2})}answer(ok,sdInfo(x,ok?undefined:yours))}
function sdDist(x,n){const own=new Set(x.sp);let L=[];x.cf.forEach(k=>SND.BY[k].sp.forEach(s=>{if(!own.has(s)&&L.indexOf(s)<0)L.push(s)}));
  SND.ALL.filter(y=>y.v===x.v&&y!==x&&!y.weak).forEach(y=>y.sp.forEach(s=>{if(!own.has(s)&&L.indexOf(s)<0)L.push(s)}));return L.slice(0,Math.max(n,3)).slice(0,n)}
function sdQ(ti){const t=SND.TH[ti],x=sdPick(ti);return ({sort:sdSort,catch:sdCatch,shoot:sdShoot,pick:sdPickG})[t.g](x,ti)}
/* 拖 的 共用：手指／滑鼠 拖 一個 東西，放開 時 回傳 碰到 的 目標 */
function sdDrag(el,targets,onDrop){let sx,sy,ox,oy,dn=false;el.style.touchAction='none';
  el.onpointerdown=e=>{if(G&&G.lock===G.q)return;dn=true;el.setPointerCapture(e.pointerId);const r=el.getBoundingClientRect();sx=e.clientX;sy=e.clientY;ox=0;oy=0;el.classList.add('drag')};
  el.onpointermove=e=>{if(!dn)return;ox=e.clientX-sx;oy=e.clientY-sy;el.style.transform='translate('+ox+'px,'+oy+'px) scale(1.08)';const r=el.getBoundingClientRect();targets.forEach(t=>t.classList.toggle('hov',sdHit(r,t)))};
  el.onpointerup=()=>{if(!dn)return;dn=false;el.classList.remove('drag');const r=el.getBoundingClientRect(),hit=targets.find(t=>sdHit(r,t));targets.forEach(t=>t.classList.remove('hov'));if(hit)onDrop(hit);else el.style.transform=''}}
function sdHit(r,t){const q=t.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;return cx>q.left&&cx<q.right&&cy>q.top&&cy<q.bottom}
/* 🔀 分類 閘門（主題 1）：聲音 方塊 飛 進來 ➜ 拖 進 🔴 母音 門 或 🔵 子音 門 */
function sdSort(x){B().innerHTML='<div class="gq">🔊 這 是 <b>母音</b> 還是 <b>子音</b>？把 方塊 <b>拖</b> 進 門</div><div class="sdsort"><div class="sdgate v" data-v="1">🔴<b>母音</b><small>嘴巴 打開</small></div><div class="sdmid"><div class="sdblk">'+sdTile(x,1)+'<div class="sdsps">'+x.sp.map(s=>sdSp(s,x)).join('')+'</div></div></div><div class="sdgate c" data-v="0">🔵<b>子音</b><small>擋 一下</small></div></div>';
  B().appendChild(earBtn(x.au));const blk=B().querySelector('.sdblk'),gs=[...B().querySelectorAll('.sdgate')];
  const go=v=>{const ok=v===x.v;const gt=B().querySelector('.sdgate[data-v="'+(v?1:0)+'"]');gt.classList.add(ok?'ok':'no');const c=ctr(gt);if(ok)sparks(c[0],c[1],18);sdAns(ok,x,v?'母音':'子音')};
  sdDrag(blk,gs,t=>go(t.dataset.v==='1'));G.hk={ok:()=>go(x.v),no:()=>go(!x.v)};begin(GM['sd'+0].T,()=>sdInfo(x));play1(x.au)}
/* 🧺 拼法 接接樂：聽 ➜ 字母 塊 掉 下來 ➜ 拖 籃子 接住 每 一個 對 的 拼法、躲開 錯 的 */
function sdCatch(x,ti){const good=x.sp.slice(),bad=sdDist(x,Math.max(2,5-good.length)),tiles=SH(good.map(s=>[s,1]).concat(bad.map(s=>[s,0])));
  B().innerHTML='<div class="gq">🔊 聽 ➜ <b>接住 每 一個</b> 會 唸 <b>'+sdZy(x)+'</b> 的 拼法（'+good.length+' 個），躲開 錯 的</div><div class="sdsky"><div class="sdbask">🧺<span class="sdgot"></span></div></div>';B().appendChild(earBtn(x.au));
  const sky=B().querySelector('.sdsky'),bk=B().querySelector('.sdbask'),got=bk.querySelector('.sdgot'),me=G;let bx=.5,caught=0,fin=false;
  const place=()=>{bk.style.left=(bx*100)+'%'};place();sky.style.touchAction='none';
  sky.onpointerdown=sky.onpointermove=e=>{if(e.type==='pointermove'&&!e.buttons&&e.pointerType==='mouse')return;const r=sky.getBoundingClientRect();bx=Math.max(.08,Math.min(.92,(e.clientX-r.left)/r.width));place()};
  const finish=(ok,yours)=>{if(fin||G!==me)return;fin=true;cancelAnimationFrame(raf);sdAns(ok,x,yours)};
  const F=tiles.map((t,i)=>{const e=H('div','sdfall'+(t[1]?' g':''),sdSp(t[0],x));e.dataset.s=t[0];sky.appendChild(e);return {e,s:t[0],good:t[1],x:.1+(i%5)*.2+Math.random()*.03,t0:i*(window.__PHFAST?0:1.15),y:-.15,done:0}});
  const t0=performance.now(),dur=window.__PHFAST?.2:3.4*(SLOW>1?1.4:1);let raf;
  const step=now=>{if(fin||G!==me)return;const s=(now-t0)/1000,H0=sky.clientHeight,W0=sky.clientWidth;let left=0;
    F.forEach(f=>{if(f.done)return;const p=(s-f.t0)/dur;if(p<0){f.e.style.opacity=0;left++;return}f.y=p;f.e.style.opacity=1;f.e.style.left=(f.x*100)+'%';f.e.style.top=(p*(H0-70))+'px';
      if(p>=.86){const cx=f.x,near=Math.abs(cx-bx)<.13;f.done=1;if(near){f.e.classList.add(f.good?'okc':'noc');if(f.good){caught++;got.textContent=caught+' / '+good.length;const c=ctr(f.e);sparks(c[0],c[1],12)}else{finish(false,'接到 '+f.s);return}}else{f.e.classList.add('miss');if(f.good){finish(false,'漏 接 '+f.s);return}}}else left++});
    if(!left&&!fin){finish(caught===good.length,'');return}raf=requestAnimationFrame(step)};
  G.hk={ok:()=>finish(true),no:()=>finish(false,bad[0]?'接到 '+bad[0]:'')};begin(GM['sd'+ti].T,()=>{fin=true;cancelAnimationFrame(raf);return sdInfo(x)});play1(x.au).then(()=>{if(G===me&&!fin&&!window.__PHFAST)raf=requestAnimationFrame(step)})}
/* 🎯 聽音 射擊：聽 ➜ 字母 靶 飛 來 飛 去 ➜ 打中 對 的 */
function sdShoot(x,ti){const good=R(x.sp),opts=SH([good].concat(sdDist(x,3)));
  B().innerHTML='<div class="gq">🔊 聽 ➜ <b>打中</b> 會 唸 這個 聲音 的 靶</div><div class="sdfield"><div class="sdgun">🔫</div></div>';B().appendChild(earBtn(x.au));
  const fd=B().querySelector('.sdfield'),me=G;let fin=false,raf;const T=opts.map((s,i)=>{const e=H('button','sdtgt',sdSp(s,x));e.dataset.s=s;fd.appendChild(e);return {e,s,x:[.22,.78,.22,.78][i]+(Math.random()-.5)*.1,y:[.22,.22,.6,.6][i]+(Math.random()-.5)*.08,vx:(Math.random()<.5?-1:1)*(.10+.08*Math.random()),vy:(Math.random()<.5?-1:1)*(.07+.06*Math.random())}});
  const shoot=s=>{if(fin||G!==me)return;fin=true;cancelAnimationFrame(raf);const t=T.find(q=>q.s===s),ok=s===good,c=ctr(t.e),g=ctr(fd.querySelector('.sdgun'));const L=H('div','sdlaser');L.style.left=g[0]+'px';L.style.top=g[1]+'px';L.style.width=Math.hypot(c[0]-g[0],c[1]-g[1])+'px';L.style.transform='rotate('+Math.atan2(c[1]-g[1],c[0]-g[0])+'rad)';document.body.appendChild(L);setTimeout(()=>L.remove(),350);
    t.e.classList.add(ok?'hit':'no');if(ok)sparks(c[0],c[1],26);sdAns(ok,x,s)};
  T.forEach(t=>t.e.onclick=()=>shoot(t.s));let last=performance.now();
  const step=now=>{if(fin||G!==me)return;const dt=Math.min(.05,(now-last)/1000)/(SLOW>1?1.6:1);last=now;T.forEach(t=>{t.x+=t.vx*dt;t.y+=t.vy*dt;if(t.x<.08||t.x>.92)t.vx*=-1;if(t.y<.06||t.y>.74)t.vy*=-1;t.x=Math.max(.08,Math.min(.92,t.x));t.y=Math.max(.06,Math.min(.74,t.y));t.e.style.left=(t.x*100)+'%';t.e.style.top=(t.y*100)+'%'});raf=requestAnimationFrame(step)};
  raf=requestAnimationFrame(step);G.hk={ok:()=>shoot(good),no:()=>shoot(opts.find(s=>s!==good))};begin(GM['sd'+ti].T,()=>{fin=true;cancelAnimationFrame(raf);return sdInfo(x)});play1(x.au)}
/* 🔊 看字 選聲：看 字母（同 一個 拼法 有 兩種 聲音 的 ＝ 看 例字）➜ 點 三顆 聲音 球 聽 ➜ 把 字母 拖 進 聲音 一樣 的 球 */
function sdPickG(x,ti){const s=R(x.sp),amb=SND.ALL.some(y=>y!==x&&y.sp.indexOf(s)>=0);let others=x.cf.map(k=>SND.BY[k]).filter(y=>y.au!==x.au&&!y.weak);others=SH(others).slice(0,2);const orbs=SH([x].concat(others));
  B().innerHTML='<div class="gq">👀 看 ➜ 點 <b>聲音 球</b> 聽聽看 ➜ 把 字母 <b>拖</b> 進 聲音 一樣 的 那 一顆</div><div class="sdpick"><div class="sdgem">'+(amb?'<div class="wrow">'+wordHTML(x.ex[0],{hideT:1})+'</div><small>（看 '+s+' 在 這個 字 裡）</small>':sdSp(s,x))+'</div><div class="sdorbs">'+orbs.map((y,i)=>'<div class="sdorb" data-o="'+i+'"><b>'+'ABC'[i]+'</b><span>🔊</span></div>').join('')+'</div></div>';
  const gem=B().querySelector('.sdgem'),os=[...B().querySelectorAll('.sdorb')];
  os.forEach((o,i)=>o.onclick=()=>{if(o.classList.contains('drag'))return;os.forEach(q=>q.classList.remove('on'));o.classList.add('on');say(orbs[i].au).then(()=>o.classList.remove('on'))});
  const go=i=>{const ok=orbs[i]===x;os[i].classList.add(ok?'ok':'no');const c=ctr(os[i]);if(ok)sparks(c[0],c[1],20);sdAns(ok,x,'選了 '+'ABC'[i]+'（'+sdZy(orbs[i])+'）')};
  sdDrag(gem,os,t=>go(+t.dataset.o));G.hk={ok:()=>go(orbs.indexOf(x)),no:()=>go(orbs.findIndex(y=>y!==x))};begin(GM['sd'+ti].T,()=>sdInfo(x))}
window.PHSND={SDLIST,sdPlay,sdCard,sndReview,sdTab,sdIdx,start:k=>start(k),G:()=>G,get SDP(){return SDP}};

/* ══ 2026-11-19 第六十三次 老師 1、2：🃏 聽音 卡牌 對決（6 關 ✕ 🟢 基礎／🔵 進階）══
 * 基礎 ＝ 聽 一個 音 ➜ 選「注音／KK／IPA 方塊＋字母」卡（老師 截圖 1）；進階 ＝ 同樣 的 音 ➜ 選「只有 字母」卡（老師 截圖 2）。
 * 一場 10 題，**由 易 到 難**（認知 心理學：先 好 分 的 再 難 分 的、選項 慢慢 變多）：第 1～3 題 2 張 卡（差 很 多 的 音）➜ 第 4～6 題 3 張 ➜ 第 7～10 題 4 張（一定 有 容易 搞混 的 音）；
 * 這 一關 每 一個 音 都 會 考 到，錯 的 隔 1 題 再 考。玩法：聽 ➜ 點 卡 ＝ 卡牌 飛 出去 打 反派（老師 的 DARK OVERLORD／SHADOW SCHEMER 圖），10 題 打 光 血條 ＝ 擊敗；🔥 連對、⚡ 愈 快 愈 痛。
 * 進階：拼法 有 一樣 的 兩個 音（長 oo／短 oo、ow）不 會 一起 出現（只 看 字母 分 不 出來）。*/
const SCL={b:'🟢 基礎',a:'🔵 進階'};
/* 第六十四次：10 關（_snd.js GS），每 一關 一個 完全 不同 的 遊戲（SGI ＝ 名字＋玩法；遊戲 本身 在 _map_snd2.js）*/
const SGI={card:['🃏','聽音 卡牌 對決','點 對 的 卡 ➜ 卡牌 飛 出去 打 反派',12],bow:['🏹','星弓 神射手','手指 按住 弓 <b>往 後 拉</b> 瞄準 ➜ 放開 射 中 對 的 符文 盾',18],run:['🏃','極速 跑酷 傳送門','按 ◀ ▶（或 左右 滑）<b>換 跑道</b>，穿過 對 的 傳送門',14],
  beat:['🥁','雷霆 節奏','音符 掉 進 <b>光圈</b> 的 那 一刻 按〔💥 打擊〕，只 打 對 的 音符',18],orb:['🔮','共鳴 水晶','把 中間 的 聲音 光球 <b>拖</b> 進 對 的 水晶',15],orbit:['🛰️','軌道 狙擊','盾牌 繞著 魔王 轉 ➜ 點 哪裡 雷射 就 射 到 哪裡，<b>要 打 在 它 轉 到 的 地方</b>',16],
  jump:['🌋','熔岩 跳躍 總決戰','浮石 在 岩漿 上 漂 ➜ 對 的 浮石 漂 到 <b>腳 前面 的 光圈</b> 時 按〔🦘 跳〕',16]};
/* 總複習 24 題：19 個 母音 每 個 都 考 到，還 留 位子 給 答錯 的 隔 1 題 再 考 */
function sgN(gi){const g=SND.GS[gi];return g.rev===2?24:Math.max(10,g.items.length+1)}
SND.GS.forEach((g,i)=>['b','a'].forEach(l=>{const s=SGI[g.g];GM['sc'+g.id+l]={N:sgN(i),ic:s[0],nm:'44 音 第 '+(i+1)+' 關 '+SCL[l]+'｜'+s[1],goal:g.n+(l==='b'?'：聽 ➜ 選 注音＋字母':'：聽 ➜ 只 看 字母 選'),how:'🔊 聽 一個 聲音 ➜ '+s[2]+(l==='b'?'（上面 有 注音 和 字母）':'（只 有 字母）'),T:s[3],q:()=>(g.g==='card'?scQ:SGQ[g.g])(i,l)};
  GREV['sc'+g.id+l]=['sndS'+i,g.rev===2?'全部 母音 都 分 得 出來 ＝ 看 到 任何 字 都 唸 得 出 母音':g.rev?'學過 的 混 在 一起 也 分 得 出來 ＝ 真的 記住 了':'聽到 聲音 就 想到 字母 ＝ 拼字、唸 字 的 地基']}));
function scConf(a,b,l){if(a===b)return true;if(l==='a'&&a.sp.some(s=>b.sp.indexOf(s)>=0))return true;if(l==='b'&&sdZy(a)===sdZy(b))return true;return false}
function scPickX(gi){const L=SND.GS[gi].items.map(k=>SND.BY[k]);G.sdr=G.sdr||[];const k=G.sdr.findIndex(r=>r.at<=G.q);if(k>=0){G.re=1;return G.sdr.splice(k,1)[0].x}G.re=0;
  if(!G.scq||!G.scq.length){G.scq=SH(L);if(G.sdl&&G.scq[0]===G.sdl)G.scq.push(G.scq.shift())}const x=G.scq.shift();G.sdl=x;return x}
function scOpts(x,gi,l){const NN=G.N||10,n=G.q<Math.round(NN*.3)?2:G.q<Math.round(NN*.6)?3:4,L=SND.GS[gi].items.map(k=>SND.BY[k]).filter(y=>!scConf(x,y,l)&&!L0(y)),cf=SH(L.filter(y=>x.cf.indexOf(y.k)>=0)),far=SH(L.filter(y=>x.cf.indexOf(y.k)<0&&y.v===x.v));
  function L0(y){return y.weak}let pick;if(n===2)pick=(far.length?far:SH(L)).slice(0,1);else{pick=(n===4?cf.slice(0,2):cf.slice(0,1)).filter((y,i,A)=>!A.slice(0,i).some(z=>scConf(y,z,l)));for(const y of SH(L))if(pick.length<n-1&&pick.indexOf(y)<0&&!pick.some(z=>scConf(y,z,l)))pick.push(y)}   /* 第六十四次：補 的 也 不可以 跟 已經 選 的 分不出來（進階 uu／oo 都 拼 oo）*/
  /* 選項 之間 也 不可以 分不出來（進階：拼法 重複）*/pick=pick.filter((y,i)=>!pick.slice(0,i).some(z=>scConf(y,z,l)));return SH([x].concat(pick))}
function kqIn(y,l){return (l==='b'?'<span class="scz">'+sdTile(y)+'</span>':'')+'<span class="kqL m'+y.sp.length+'">'+y.sp.map(s=>sdSp(s,y)).join('<i class="kqS">/</i>')+'</span>'}
function kqCard(y,l){return '<button class="scd '+(y.v?'v':'c')+'" data-sc="'+y.k+'">'+kqIn(y,l)+'</button>'}
/* 第六十四次：別的 遊戲 用 的 小 一點 的 牌面（一樣 的 樣子：基礎 ＝ 注音（小字 KK）＋字母、進階 ＝ 只有 字母）*/
function kqFace(y,l){return '<span class="kqf '+(y.v?'v':'c')+(l==='b'?'':' a')+'" data-sc="'+y.k+'">'+kqIn(y,l)+'</span>'}
function scQ(gi,l){if(!G.N)G.N=sgN(gi);gHud();const x=scPickX(gi),O=scOpts(x,gi,l),me=G;G.sgO=O;G.sgQ=G.q;G.bhp=G.bhp==null?100:G.bhp;G.foe=G.foe||(gi%2?'foe2':'foe1');
  B().innerHTML='<div class="scar"><div class="scfoe"><img src="../g3mid/img/'+G.foe+'.webp" alt=""><div class="kqHP"><i style="width:'+G.bhp+'%"></i><b>'+G.bhp+'</b></div></div>'+
    '<div class="scask">🔊 聽 ➜ 選 對 的 卡'+(G.combo>=2?'　<span class="scfire">🔥 連對 '+G.combo+'</span>':'')+'</div><div class="scrow n'+O.length+'">'+O.map(y=>kqCard(y,l)).join('')+'</div></div>';
  B().appendChild(earBtn(x.au));const cs=[...B().querySelectorAll('.scd')];cs.forEach((c,i)=>{c.style.animationDelay=(i*.09)+'s'});
  const go=k=>{if(G!==me||G.lock===G.q)return;const y=SND.BY[k],c=B().querySelector('[data-sc="'+k+'"]'),ok=y===x,f=B().querySelector('.scfoe');
    if(ok){const a=c.getBoundingClientRect(),b=f.getBoundingClientRect();c.style.transition='transform .35s cubic-bezier(.5,-0.3,.7,1)';c.style.transform='translate('+(b.left+b.width/2-a.left-a.width/2)+'px,'+(b.top+b.height/2-a.top-a.height/2)+'px) rotate(25deg) scale(.4)';
      const dmg=Math.min(G.bhp,10);setTimeout(()=>{f.classList.add('hit');G.bhp-=dmg;const h=f.querySelector('.kqHP i');if(h)h.style.width=G.bhp+'%';const bb=f.querySelector('.kqHP b');if(bb)bb.textContent=G.bhp;const cc=ctr(f);fx('−'+dmg,cc[0]-20,cc[1]-60,'#FF6B6B');sparks(cc[0],cc[1],26);if(G.bhp<=0)f.classList.add('ko')},330)}
    else{c.classList.add('no');f.classList.add('laugh')}
    setTimeout(()=>sdAns(ok,x,y.sp.join('、')+'（'+sdZy(y)+'）'),ok?520:380)};
  cs.forEach(c=>c.onclick=()=>go(c.dataset.sc));G.hk={ok:()=>go(x.k),no:()=>go(O.find(y=>y!==x).k)};begin(GM['sc'+SND.GS[gi].id+l].T,()=>sdInfo(x));play1(x.au)}
/* 遊戲 開始 前 30 秒 複習 ＝ 這 一關 的 每 一個 音（注音 ➜ 字母 ➜ 聲音）*/
const sndReview0=sndReview;
sndReview=async function(ti,root){if(typeof ti==='string'&&/^S\d+$/.test(ti)){const gi=+ti.slice(1),me=++TOK,L=SND.GS[gi].items.map(k=>SND.BY[k]);root.innerHTML='<div class="sdrev"></div><div class="sdcap"></div>';const R0=root.querySelector('.sdrev');
  for(const x of L){if(me!==TOK)return;R0.innerHTML='<div class="sdcard '+(x.v?'v':'c')+' sm"><div class="sdtop">'+sdTile(x,1)+'</div><div class="sdsps">'+x.sp.map(s=>sdSp(s,x)).join('')+'</div></div>';
    sdCap(root,'🔊 <b>'+sdZy(x)+'</b> ➜ <b class="en">'+x.sp.join('、')+'</b>');if(!await sdSay(x.au,me,R0.querySelector('.sdtile')))return;if(!await sdW(Math.max(900,Math.round(26000/L.length)-1600),me))return}
  sdCap(root,'✔ 複習 完 了！按〔▶ 開始〕');return}return sndReview0(ti,root)};
/* 44 音 分頁 最 上面：🃏 練習 路線（6 關 ✕ 基礎 ➜ 進階；玩 過 ＝ ✔）*/
/* 第六十四次：練習 路線 10 關（母音 7 關＝ 學 A ➜ 學 B ➜ 複習 ➜ 學 C ➜ 學 D ➜ 複習 ➜ 總複習；子音 3 關），每 一關 一個 完全 不同 的 遊戲 */
function scRoute(){const h=$('#scRoute');if(!h)return;const card=(g,i)=>{const s=SGI[g.g];return '<div class="scrc'+(g.rev?' rv'+g.rev:'')+'"><div class="scrn"><em>第 '+(i+1)+' 關</em>'+g.n+'<span class="scgm">'+s[0]+' '+s[1]+'</span><span>'+(g.rev?'<b class="scrcnt">'+g.items.length+' 個 音 混 在 一起</b>':g.items.map(k=>sdTile(SND.BY[k])).join(''))+'</span></div><div class="scrb">'+['b','a'].map(l=>'<button class="btn'+(l==='b'?' go':' gold')+(LS.g('pl_sc'+g.id+l,0)?' dn':'')+'" data-scg="'+g.id+l+'">'+SCL[l]+(LS.g('pl_sc'+g.id+l,0)?' ✔':'')+'</button>').join('')+'</div></div>'};
  h.innerHTML='<div class="scrt"><b>🎮 44 音 練習 路線</b><small>每 一關：先 看 動畫 ➜ 🟢 基礎（注音＋字母）➜ 🔵 進階（只 有 字母）；一次 只 練 4～5 個 新 的 音，學 兩 組 就 複習</small></div>'+
  '<div class="sckk">🔎 注音 下面 的 小字（例：<b>/æ/</b>）＝ <b>KK 音標</b>：雙語 注音 是 照 KK 音標 一個 一個 轉 出來 的</div>'+
  '<div class="scgh">🔴 母音</div><div class="scrs">'+SND.GS.map((g,i)=>[g,i]).filter(z=>z[0].items.every(k=>SND.BY[k].v)).map(z=>card(z[0],z[1])).join('')+'</div>'+
  '<div class="scgh">🔵 子音</div><div class="scrs">'+SND.GS.map((g,i)=>[g,i]).filter(z=>!z[0].items.every(k=>SND.BY[k].v)).map(z=>card(z[0],z[1])).join('')+'</div>'}
document.addEventListener('click',e=>{const b=e.target.closest('[data-scg]');if(b)start('sc'+b.dataset.scg)});
const sdTab0=sdTab;sdTab=function(){sdTab0();scRoute()};
