/* ══ 2026-11-19 第六十四次 老師 2-B：🎮 44 音 練習 路線 ＝ 每 一關 一個 完全 不同 的 遊戲（真的 操作；英文 就是 玩法）══
 * 🔒 永久：一次 只 練 4～5 個 新 的 音（工作 記憶 約 4 個 單位，Cowan 2001）；學 A ➜ 學 B ➜ 複習 A＋B ➜ … ➜ 全部 總複習（交錯 練習 Brunmair & Richter 2019）。
 * 每 一關：聽 一個 聲音 ➜ 用 這 一關 自己 的 操作 選 對 的（基礎 ＝ 注音（下面 小字 KK）＋字母；進階 ＝ 只 有 字母）。
 * 題目 和 選項 共用 第六十三次 的 scPickX／scOpts（由 易 到 難 2 ➜ 3 ➜ 4 個、每 個 音 都 考 到、錯 的 隔 1 題 再 考）；答完 ＝ sdAns（綠底 答錯頁、成績）。
 * 測試 用：G.hk.ok()／G.hk.no()。*/
const SGQ={};
function sgSet(gi,l){if(!G.N)G.N=sgN(gi);gHud();const x=scPickX(gi),O=scOpts(x,gi,l);G.sgO=O;G.sgQ=G.q;return {x,O,me:G,q:G.q,l}}
function sgLab(y){return y.sp.join('、')+'（'+sdZy(y)+'）'}
function sgLive(S){return G===S.me&&G.q===S.q&&G.lock!==G.q}
function sgAsk(t){return '<div class="gq sgask">'+t+(G.combo>=2?'　<span class="scfire">🔥 連對 '+G.combo+'</span>':'')+'</div>'+reTag()}
function sgMsg(t){const m=$('#sgmsg');if(!m)return;m.innerHTML=t;m.classList.remove('pop');void m.offsetWidth;m.classList.add('pop')}
function sgShake(){const a=$('#sgA');if(!a)return;a.classList.remove('shk');void a.offsetWidth;a.classList.add('shk')}
function sgRel(el,A){const r=el.getBoundingClientRect(),a=A.getBoundingClientRect();return {l:r.left-a.left,t:r.top-a.top,r:r.right-a.left,b:r.bottom-a.top,cx:r.left-a.left+r.width/2,cy:r.top-a.top+r.height/2}}
function sgEnd(S,ok,y,delay){if(!sgLive(S))return;G.lock2=1;setTimeout(()=>{if(G===S.me&&G.q===S.q)sdAns(ok,S.x,sgLab(y))},window.__PHFAST?5:(delay||450))}

/* ── 🏹 星弓 神射手（第 2 關）：手指 按住 弓 往 後 拉（拉 愈 長 箭 愈 快）➜ 放開，箭 照 方向 飛；符文 盾 在 天上 飄。射 偏 ＝ 再 拉 一次（不 扣分）── */
SGQ.bow=(gi,l)=>{const S=sgSet(gi,l),{x,O}=S;
  B().innerHTML=sgAsk('🔊 聽 ➜ 按住 弓 <b>往 後 拉</b> 瞄準，放開 射 中 對 的 符文 盾')+'<div class="sgA sgBow" id="sgA"><div class="sgstar"></div>'+O.map((y,i)=>'<div class="sgrune" data-i="'+i+'">'+kqFace(y,l)+'</div>').join('')+
    '<div class="sgaim" id="sgaim"></div><div class="sgbowc" id="sgbw"><svg viewBox="0 0 120 60"><path d="M6 54 Q60 -14 114 54" fill="none" stroke="#FFD54A" stroke-width="7" stroke-linecap="round"/><path id="sgstr" d="M6 54 L114 54" fill="none" stroke="#E0F2FF" stroke-width="2.5"/></svg><b>✋ 按住 往 後 拉</b></div><div class="sgmsg" id="sgmsg"></div></div>';
  B().appendChild(earBtn(x.au));
  const A=$('#sgA'),aim=$('#sgaim'),bw=$('#sgbw'),R0=[...A.querySelectorAll('.sgrune')].map((e,i)=>({e,y:O[i],bx:(i+.5)/O.length,by:.18+(i%2)*.15,ph:Math.random()*6.28})),sp=(.55+.9*S.q/(G.N||10))/(SLOW>1?1.6:1);
  let raf,t0=performance.now(),last=t0,arrow=null,pull=null;
  const bc=()=>{const r=sgRel(bw,A);return [r.cx,r.t+r.b*0+ (r.b-r.t)*.75]};
  const hitRune=(px,py)=>R0.find(r=>{const q=sgRel(r.e,A);return px>=q.l-6&&px<=q.r+6&&py>=q.t-6&&py<=q.b+6});
  const fire=(dx,dy,pw)=>{const n=Math.hypot(dx,dy);if(n<1)return;const c=bc(),v=(900+1300*pw);arrow={x:c[0],y:c[1],vx:dx/n*v,vy:dy/n*v,e:H('div','sgarrow')};arrow.e.style.transform='rotate('+(Math.atan2(dy,dx)*180/Math.PI+90)+'deg)';A.appendChild(arrow.e)};
  const resolve=(r)=>{if(!sgLive(S))return;const ok=r.y===x;cancelAnimationFrame(raf);r.e.classList.add(ok?'hit':'no');const q=sgRel(r.e,A),a=A.getBoundingClientRect();sparks(a.left+q.cx,a.top+q.cy,ok?34:10,ok?'#FFE07A':'#888');if(ok){fx('💥',a.left+q.cx-20,a.top+q.cy-40,'#FFE07A');sgShake()}sgEnd(S,ok,r.y)};
  const step=now=>{if(!sgLive(S))return;const dt=Math.min(.05,(now-last)/1000);last=now;const t=(now-t0)/1000,w=A.clientWidth,h=A.clientHeight;
    R0.forEach(r=>{const rw=r.e.offsetWidth,rh=r.e.offsetHeight,cx=w*(r.bx+Math.sin(t*sp+r.ph)*(.32/O.length)),cy=h*(r.by+Math.sin(t*sp*1.4+r.ph)*.05);r.e.style.left=Math.max(4,Math.min(w-rw-4,cx-rw/2))+'px';r.e.style.top=Math.max(4,cy-rh/2)+'px'});
    if(arrow){arrow.x+=arrow.vx*dt;arrow.y+=arrow.vy*dt;arrow.e.style.left=arrow.x+'px';arrow.e.style.top=arrow.y+'px';const r=hitRune(arrow.x,arrow.y);
      if(r){arrow.e.remove();arrow=null;resolve(r);return}if(arrow.x<-40||arrow.x>w+40||arrow.y<-40){arrow.e.remove();arrow=null;sgMsg('💨 沒 射中！再 拉 一次（不 扣分）')}}
    raf=requestAnimationFrame(step)};
  A.style.touchAction='none';
  A.onpointerdown=e=>{if(!sgLive(S)||arrow)return;const a=A.getBoundingClientRect();if(e.clientY-a.top<A.clientHeight*.5)return;pull={x:e.clientX,y:e.clientY};A.setPointerCapture(e.pointerId);bw.classList.add('pull')};
  A.onpointermove=e=>{if(!pull)return;const c=bc(),a=A.getBoundingClientRect(),dx=pull.x-e.clientX,dy=pull.y-e.clientY,len=Math.min(160,Math.hypot(dx,dy));if(len<6)return;
    const ang=Math.atan2(dy,dx)*180/Math.PI;aim.style.left=c[0]+'px';aim.style.top=c[1]+'px';aim.style.width=(120+len*3)+'px';aim.style.transform='rotate('+ang+'deg)';aim.style.opacity=1;
    const st=$('#sgstr');if(st)st.setAttribute('d','M6 54 L60 '+(54+len*.4)+' L114 54')};
  A.onpointerup=e=>{if(!pull)return;const dx=pull.x-e.clientX,dy=pull.y-e.clientY,len=Math.hypot(dx,dy);pull=null;aim.style.opacity=0;bw.classList.remove('pull');const st=$('#sgstr');if(st)st.setAttribute('d','M6 54 L114 54');
    if(len<20){sgMsg('✋ 按住 弓 <b>往 下 拉</b> 遠 一點 再 放開');return}if(dy>-5){sgMsg('⬇ 往 <b>下</b> 拉，箭 才 會 往 上 飛');return}fire(dx,dy,Math.min(1,len/150))};
  G.hk={ok:()=>resolve(R0.find(r=>r.y===x)),no:()=>resolve(R0.find(r=>r.y!==x))};
  raf=requestAnimationFrame(step);begin(GM['sc'+SND.GS[gi].id+l].T,()=>{cancelAnimationFrame(raf);return sdInfo(x)});play1(x.au)};

/* ── 🏃 極速 跑酷 傳送門（第 3 關 複習）：傳送門 從 遠方 衝 過來；按 ◀ ▶／左右 滑／點 跑道 換 跑道，傳送門 到 腳 下 時 站 在 哪 一條 ＝ 穿過 哪 一個 ── */
SGQ.run=(gi,l)=>{const S=sgSet(gi,l),{x,O}=S,n=O.length;let lane=Math.floor((n-1)/2);
  B().innerHTML=sgAsk('🔊 聽 ➜ <b>換 跑道</b>，穿過 對 的 傳送門')+'<div class="sgA sgRun" id="sgA"><div class="sgsun"></div><div class="sgroad"><i></i></div>'+O.map((y,i)=>'<div class="sggate" data-i="'+i+'"><div class="sgring"></div>'+kqFace(y,l)+'</div>').join('')+
    '<div class="sghero" id="sghr"><span>🏃</span></div><div class="sgmsg" id="sgmsg"></div></div><div class="sgrc"><button class="btn sgmv" data-d="-1">◀</button><span class="sgdist" id="sgds"></span><button class="btn sgmv" data-d="1">▶</button></div>';
  B().appendChild(earBtn(x.au));
  const A=$('#sgA'),hr=$('#sghr'),gs=[...A.querySelectorAll('.sggate')],ARR=(window.__PHFAST?999:7.5)*(SLOW>1?1.4:1);let raf,t0=0,sx=null;
  const lx=i=>A.clientWidth*(i+.5)/n,place=()=>{hr.style.left=(lx(lane)-hr.offsetWidth/2)+'px'};place();
  const mv=d=>{if(!sgLive(S))return;const L=Math.max(0,Math.min(n-1,lane+d));if(L!==lane){lane=L;place();hr.classList.remove('dash');void hr.offsetWidth;hr.classList.add('dash')}};
  B().querySelectorAll('.sgmv').forEach(b=>b.onclick=()=>mv(+b.dataset.d));
  A.style.touchAction='none';A.onpointerdown=e=>{sx=e.clientX};A.onpointerup=e=>{if(sx==null)return;const d=e.clientX-sx;sx=null;if(Math.abs(d)>40){mv(d>0?1:-1);return}const a=A.getBoundingClientRect(),L=Math.floor((e.clientX-a.left)/A.clientWidth*n);mv(L-lane)};
  const kd=e=>{if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1)};addEventListener('keydown',kd);
  const pass=i=>{if(!sgLive(S))return;removeEventListener('keydown',kd);cancelAnimationFrame(raf);const ok=O[i]===x,g=gs[i];g.classList.add(ok?'hit':'no');hr.classList.add(ok?'warp':'bonk');const q=g.getBoundingClientRect();sparks(q.left+q.width/2,q.top+q.height/2,ok?36:10,ok?'#7CF7FF':'#888');if(!ok)sgShake();sgEnd(S,ok,O[i],600)};
  const step=now=>{if(!sgLive(S)){removeEventListener('keydown',kd);return}if(!t0)t0=now;if(PAUSED){t0+=16}const z=Math.min(1,(now-t0)/1000/ARR),w=A.clientWidth,h=A.clientHeight,vx=w/2,hy=h*.1,gy=h*.62;
    gs.forEach((g,i)=>{const sc=.28+.72*z*z,cx=vx+(lx(i)-vx)*(.25+.75*z),cy=hy+(gy-hy)*z*z;g.style.transform='translate('+(cx-g.offsetWidth/2)+'px,'+(cy-g.offsetHeight/2)+'px) scale('+sc+')'});
    const ds=$('#sgds');if(ds)ds.textContent='傳送門 '+Math.max(0,Math.ceil((1-z)*ARR))+' 秒 後 到';
    if(z>=1){pass(lane);return}raf=requestAnimationFrame(step)};
  G.hk={ok:()=>{lane=O.indexOf(x);place();pass(lane)},no:()=>{lane=O.findIndex(y=>y!==x);place();pass(lane)}};
  addEventListener('resize',place,{once:true});begin(GM['sc'+SND.GS[gi].id+l].T+ARR,()=>{cancelAnimationFrame(raf);removeEventListener('keydown',kd);return sdInfo(x)});play1(x.au).then(()=>{if(sgLive(S))raf=requestAnimationFrame(step)})};

/* ── 🥁 雷霆 節奏（第 4 關）：音符 一個 一個 往 下 掉；掉 進 光圈 的 那 一刻 按〔💥 打擊〕（或 點 軌道）＝ 打 那 一個。太 早／太 晚 不 扣分 ── */
SGQ.beat=(gi,l)=>{const S=sgSet(gi,l),{x,O}=S;
  B().innerHTML=sgAsk('🔊 聽 ➜ <b>對 的</b> 音符 掉 進 <b>光圈</b> 時 按〔💥 打擊〕')+'<div class="sgA sgBeat" id="sgA"><div class="sgeq">'+Array.from({length:14},(_,i)=>'<i style="animation-delay:'+(i*.07)+'s"></i>').join('')+'</div><div class="sgtrack" id="sgtk"><div class="sghit" id="sghit"></div></div><div class="sgmsg" id="sgmsg"></div></div><div class="sgrc"><button class="btn sgbang" id="sgbang">💥 打擊</button></div>';
  B().appendChild(earBtn(x.au));
  const A=$('#sgA'),tk=$('#sgtk'),ring=$('#sghit'),sl=SLOW>1?1.5:1,DUR=(3-.8*S.q/(G.N||10))*sl,GAP=1.25*sl,seq=[];let notes=[],raf,t0=0,k=0;
  /* 對 的 音符 一定 會 出現：順序 洗牌，一輪 一輪 重複 */
  const nextY=()=>{if(!seq.length)seq.push(...SH(O));return seq.shift()};
  const spawn=t=>{const y=nextY(),e=H('div','sgnote',kqFace(y,l));tk.appendChild(e);notes.push({e,y,t})};
  const ringY=()=>tk.clientHeight*.8;
  const hit=()=>{if(!sgLive(S))return;const ry=ringY(),tol=Math.max(46,tk.clientHeight*.1);const nn=notes.find(n=>Math.abs(n.cy-ry)<=tol+n.e.offsetHeight*.3);ring.classList.remove('flash');void ring.offsetWidth;ring.classList.add('flash');
    if(!nn){sgMsg('⏱️ 光圈 裡 沒有 音符：等 它 掉 進 光圈 再 打');return}cancelAnimationFrame(raf);const ok=nn.y===x;nn.e.classList.add(ok?'hit':'no');const q=nn.e.getBoundingClientRect();sparks(q.left+q.width/2,q.top+q.height/2,ok?40:10,ok?'#FF4FD8':'#777');if(ok){A.classList.add('boom');fx('PERFECT!',q.left,q.top-30,'#FF9BF0')}else sgShake();sgEnd(S,ok,nn.y,550)};
  $('#sgbang').onclick=hit;tk.onpointerdown=hit;const kd=e=>{if(e.code==='Space'){e.preventDefault();hit()}};addEventListener('keydown',kd);
  const step=now=>{if(!sgLive(S)){removeEventListener('keydown',kd);return}if(!t0){t0=now;spawn(0)}const t=(now-t0)/1000;if(t>=(k+1)*GAP){k++;spawn(t)}const H0=tk.clientHeight;
    notes=notes.filter(n=>{const p=(t-n.t)/DUR;n.cy=p*H0;n.e.style.transform='translate(-50%,'+(n.cy-n.e.offsetHeight/2)+'px)';if(p>1.15){n.e.remove();return false}return true});raf=requestAnimationFrame(step)};
  G.hk={ok:()=>{const e=H('div','sgnote',kqFace(x,l));tk.appendChild(e);notes=[{e,y:x,cy:ringY()}];hit()},no:()=>{const y=O.find(z=>z!==x),e=H('div','sgnote',kqFace(y,l));tk.appendChild(e);notes=[{e,y,cy:ringY()}];hit()}};
  begin(GM['sc'+SND.GS[gi].id+l].T,()=>{cancelAnimationFrame(raf);removeEventListener('keydown',kd);return sdInfo(x)});play1(x.au).then(()=>{if(sgLive(S))raf=requestAnimationFrame(step)})};

/* ── 🔮 共鳴 水晶（第 5 關）：中間 的 聲音 光球（點 ＝ 再 聽）用 手指 拖 進 對 的 水晶；水晶 慢慢 繞 圈 ── */
SGQ.orb=(gi,l)=>{const S=sgSet(gi,l),{x,O}=S;
  B().innerHTML=sgAsk('🔊 聽 ➜ 把 中間 的 <b>聲音 光球 拖</b> 進 對 的 水晶')+'<div class="sgA sgOrb" id="sgA"><div class="sgrune2"></div>'+O.map((y,i)=>'<div class="sgcry" data-i="'+i+'"><div class="sgcg"></div>'+kqFace(y,l)+'</div>').join('')+'<div class="sgball" id="sgball"><b>🔊</b><small>拖 我</small></div><div class="sgmsg" id="sgmsg"></div></div>';
  const A=$('#sgA'),ball=$('#sgball'),cs=[...A.querySelectorAll('.sgcry')],w0=.09/(SLOW>1?1.6:1)*(1+S.q/(G.N||10));let raf,t0=performance.now(),dn=null;
  const place=now=>{const t=(now-t0)/1000,w=A.clientWidth,h=A.clientHeight,n=cs.length;cs.forEach((c,i)=>{const a=-Math.PI/2+i*2*Math.PI/n+t*w0,cx=w/2+Math.cos(a)*w*.34,cy=h/2+Math.sin(a)*h*.34;c.style.left=(cx-c.offsetWidth/2)+'px';c.style.top=(cy-c.offsetHeight/2)+'px'})};
  const step=now=>{if(!sgLive(S))return;if(!dn)place(now);raf=requestAnimationFrame(step)};
  const go=i=>{if(!sgLive(S))return;cancelAnimationFrame(raf);const ok=O[i]===x,c=cs[i];c.classList.add(ok?'hit':'no');ball.classList.add(ok?'in':'out');const q=c.getBoundingClientRect();sparks(q.left+q.width/2,q.top+q.height/2,ok?40:12,ok?'#C4B5FD':'#666');if(ok)A.classList.add('reso');else sgShake();sgEnd(S,ok,O[i],600)};
  ball.addEventListener('pointerdown',e=>{dn={x:e.clientX,y:e.clientY}});ball.addEventListener('click',e=>{if(dn&&Math.hypot(e.clientX-dn.x,e.clientY-dn.y)<8){ball.classList.add('on');say(x.au).then(()=>ball.classList.remove('on'))}dn=null});
  sdDrag(ball,cs,t=>go(+t.dataset.i));
  G.hk={ok:()=>go(O.indexOf(x)),no:()=>go(O.findIndex(y=>y!==x))};raf=requestAnimationFrame(step);
  begin(GM['sc'+SND.GS[gi].id+l].T,()=>{cancelAnimationFrame(raf);return sdInfo(x)});ball.classList.add('on');say(x.au).then(()=>ball.classList.remove('on'))};

/* ── 🛰️ 軌道 狙擊（第 6 關 複習）：盾牌 繞著 魔王 轉；點 畫面 ＝ 雷射 從 砲台 射 到 那 一點（要 0.25 秒）➜ 盾牌 那 時候 在 那裡 才 打 得 到。打 偏 不 扣分 ── */
SGQ.orbit=(gi,l)=>{const S=sgSet(gi,l),{x,O}=S,foe=gi%2?'foe2':'foe1';
  B().innerHTML=sgAsk('🔊 聽 ➜ <b>點</b> 畫面 發射 雷射，打 中 繞 圈 的 <b>對 的 盾牌</b>')+'<div class="sgA sgOrbit" id="sgA"><div class="sgsp"></div><div class="sgboss"><img src="../g3mid/img/'+foe+'.webp" alt=""></div><div class="sgellip"></div>'+O.map((y,i)=>'<div class="sgshd" data-i="'+i+'">'+kqFace(y,l)+'</div>').join('')+'<div class="sgcan" id="sgcan">🛰️</div><div class="sgmsg" id="sgmsg"></div></div>';
  B().appendChild(earBtn(x.au));
  const A=$('#sgA'),ss=[...A.querySelectorAll('.sgshd')],can=$('#sgcan'),om=(.32+.55*S.q/(G.N||10))/(SLOW>1?1.7:1);let raf,t0=performance.now(),busy=0;
  const step=now=>{if(!sgLive(S))return;const t=(now-t0)/1000,w=A.clientWidth,h=A.clientHeight,n=ss.length;ss.forEach((s,i)=>{const a=i*2*Math.PI/n+t*om,cx=w/2+Math.cos(a)*w*.33,cy=h*.46+Math.sin(a)*h*.27;s.style.left=(cx-s.offsetWidth/2)+'px';s.style.top=(cy-s.offsetHeight/2)+'px';s.style.zIndex=Math.sin(a)>0?6:3});raf=requestAnimationFrame(step)};
  const go=i=>{if(!sgLive(S))return;cancelAnimationFrame(raf);const ok=O[i]===x,s=ss[i];s.classList.add(ok?'hit':'no');const q=s.getBoundingClientRect();sparks(q.left+q.width/2,q.top+q.height/2,ok?40:10,ok?'#7CFF9E':'#777');if(ok){A.querySelector('.sgboss').classList.add('hurt');sgShake()}sgEnd(S,ok,O[i],600)};
  A.style.touchAction='none';
  A.onpointerdown=e=>{if(!sgLive(S)||busy||e.target.closest('.ear'))return;busy=1;const a=A.getBoundingClientRect(),px=e.clientX-a.left,py=e.clientY-a.top,c=sgRel(can,A),dx=px-c.cx,dy=py-c.t,L=H('div','sglaser');L.style.left=c.cx+'px';L.style.top=c.t+'px';L.style.width=Math.hypot(dx,dy)+'px';L.style.transform='rotate('+Math.atan2(dy,dx)*180/Math.PI+'deg)';A.appendChild(L);
    setTimeout(()=>{L.remove();busy=0;if(!sgLive(S))return;const i=ss.findIndex(s=>{const q=sgRel(s,A);return px>=q.l-4&&px<=q.r+4&&py>=q.t-4&&py<=q.b+4});if(i<0){sgMsg('💨 打 偏 了！盾牌 在 動，<b>點 它 等一下 會 到 的 地方</b>');return}go(i)},window.__PHFAST?1:250)};
  G.hk={ok:()=>go(O.indexOf(x)),no:()=>go(O.findIndex(y=>y!==x))};raf=requestAnimationFrame(step);
  begin(GM['sc'+SND.GS[gi].id+l].T,()=>{cancelAnimationFrame(raf);return sdInfo(x)});play1(x.au)};

/* ── 🌋 熔岩 跳躍 總決戰（第 7 關）：浮石 在 岩漿 上 從 右 往 左 漂；對 的 浮石 漂 到 腳 前面 的 光圈 時 按〔🦘 跳〕。跳 空 ＝ 彈 回來（不 扣分）；岩漿 會 一直 漲 ── */
SGQ.jump=(gi,l)=>{const S=sgSet(gi,l),{x,O}=S;
  B().innerHTML=sgAsk('🔊 聽 ➜ 對 的 浮石 漂 到 <b>光圈</b> 時 按〔🦘 跳〕')+'<div class="sgA sgJump" id="sgA"><div class="sgvol"></div><div class="sglava" id="sglv"><i></i></div><div class="sgbank"></div><div class="sgland" id="sgld"></div>'+
    O.map((y,i)=>'<div class="sgrock" data-i="'+i+'">'+kqFace(y,l)+'</div>').join('')+'<div class="sgjh" id="sgjh">🧗</div><div class="sgmsg" id="sgmsg"></div></div><div class="sgrc"><button class="btn sgbang" id="sgjb">🦘 跳！</button></div>';
  B().appendChild(earBtn(x.au));
  const A=$('#sgA'),rk=[...A.querySelectorAll('.sgrock')],ld=$('#sgld'),hero=$('#sgjh'),lv=$('#sglv'),T=GM['sc'+SND.GS[gi].id+l].T;let raf,last=0,busy=0;
  const w0=()=>A.clientWidth,SP=()=>Math.max(250,w0()*.36),V=()=>w0()*(.15+.07*S.q/(G.N||10))/(SLOW>1?1.6:1);
  const st=SH(rk.map((_,i)=>i)),RS=rk.map((e,i)=>({e,y:O[i],x:0}));st.forEach((i,k)=>{RS[i].x=w0()*.62+k*SP()});
  const lx=()=>w0()*.5;
  const step=now=>{if(!sgLive(S))return;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;const w=w0(),h=A.clientHeight,tot=SP()*RS.length;
    RS.forEach(r=>{if(!PAUSED)r.x-=V()*dt;if(r.x<-r.e.offsetWidth)r.x+=Math.max(tot,w+r.e.offsetWidth);r.e.style.left=(r.x-r.e.offsetWidth/2)+'px';r.e.style.top=(h*.56-r.e.offsetHeight/2+Math.sin(now/400+r.x/90)*5)+'px'});
    if(G.t){lv.style.height=(20+22*(1-G.t.left()))+'%'}raf=requestAnimationFrame(step)};
  const under=()=>RS.find(r=>{const hw=r.e.offsetWidth/2;return Math.abs(r.x-lx())<=hw*.8});
  const jump=r=>{if(!sgLive(S)||busy)return;busy=1;hero.classList.remove('back','hop');const hr0=hero.getBoundingClientRect(),ar0=A.getBoundingClientRect();hero.style.setProperty('--dx',(ar0.left+lx()-hr0.left-hr0.width/2)+'px');hero.style.setProperty('--dy',(ar0.top+A.clientHeight*.56-hr0.bottom+10)+'px');void hero.offsetWidth;hero.classList.add('hop');
    setTimeout(()=>{busy=0;if(!sgLive(S))return;r=r||under();if(!r){hero.classList.add('back');sgMsg('🌊 光圈 下面 沒有 浮石：等 對 的 浮石 漂 過來 再 跳');return}
      cancelAnimationFrame(raf);const ok=r.y===x;r.e.classList.add(ok?'hit':'no');hero.classList.add(ok?'land':'fall');const q=r.e.getBoundingClientRect();sparks(q.left+q.width/2,q.top,ok?40:16,ok?'#FFB000':'#FF4D4D');if(!ok)sgShake();sgEnd(S,ok,r.y,650)},window.__PHFAST?1:420)};
  $('#sgjb').onclick=()=>jump();A.onpointerdown=e=>{if(!e.target.closest('.ear'))jump()};const kd=e=>{if(e.code==='Space'){e.preventDefault();jump()}};addEventListener('keydown',kd);
  G.hk={ok:()=>jump(RS.find(r=>r.y===x)),no:()=>jump(RS.find(r=>r.y!==x))};
  raf=requestAnimationFrame(step);begin(T,()=>{cancelAnimationFrame(raf);removeEventListener('keydown',kd);return sdInfo(x)});play1(x.au)};
