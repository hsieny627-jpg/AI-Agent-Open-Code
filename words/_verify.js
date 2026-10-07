/* words/_verify.js — 逐頁量測，不用目視，不用截圖
 *
 * 用法： node words/_verify.js              （量 words/ 底下全部 .html）
 *        node words/_verify.js son.html     （只量指定的頁，改一句文案時用這個）
 *        node words/_verify.js --text son.html   （順便印出每一幕的文字）
 *
 * 兩種頁型，自動判斷：
 *
 * A. 幕頁（有 #dots）＝ 17 張單字卡 ＋ 故事頁
 *   - Andika 有載到（measureText 與 sans-serif 不同）
 *   - 每一幕：進度點對應、無橫向／縱向溢出、內容沒有被左右箭頭壓到
 *   - 首幕 ← 停用、末幕 → 停用
 *   - 停 6 秒不可自動換頁
 *
 * C. 首頁（有 #hub）＝ 專案根目錄的 index.html（用 ../index.html 指定）
 *   - Andika 有載到
 *   - **每一個站內連結都要真的存在**（連壞了老師上課才發現最慘）
 *   - 關著的時候（投影出來的樣子）不可以有捲軸；按開 17 張卡之後可以往下捲
 *   - 按「17 張單字卡」要真的展開，而且剛好 17 個連結
 *
 * B. 暖身題頁（沒有 #dots，有 #go）＝ quiz.html / quiz-demo.html
 *   - Andika 有載到
 *   - 閘門畫面 → 出題 → 解鎖 → 作答 → 回饋，四個狀態都不可溢出
 *   - 一開始選項必須是鎖住的（小組討論），按「提前作答」才解鎖
 *   - 倒數秒數要真的在減少
 *   - 作答後停 6 秒不可自動跳下一題
 *
 * 兩種尺寸（1024×768、820×1180）、offline:true 開檔。
 * 只印失敗項與一行總結（印全部量測資料很貴）。
 */
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'),DIR=__dirname+'/';
const args=process.argv.slice(2);
const showText=args.includes('--text');
/* 2026-09-29：全部量一次超過 40 分鐘會被切斷 ➜ --group=1/4 只量第 1 組（輪流分，慢頁會平均分散），四組同時跑 */
const grp=(args.find(a=>a.startsWith('--group='))||'').slice(8).split('/').map(Number);
const files=args.filter(a=>a!=='--text'&&!a.startsWith('--group='));
/* 2026-09-25：G3 的數字單字、Sight Words 也是這一套樣板產生的，一起量 */
const G3W=['numbers','sight'].map(d=>'../G3 - L1 + L2/'+d+'/').filter(d=>fs.existsSync(DIR+d))
 .map(d=>fs.readdirSync(DIR+d).filter(f=>f.endsWith('.html')).sort().map(f=>d+f)).reduce((a,b)=>a.concat(b),[]);
const ALL=files.length?files:
 fs.readdirSync(DIR).filter(f=>f.endsWith('.html')).sort().concat(['../index.html']).concat(G3W);
const FILES=grp.length===2&&grp[1]>0?ALL.filter((f,i)=>i%grp[1]===grp[0]-1):ALL;
const VPS=[{n:'1024x768',width:1024,height:768},{n:'820x1180',width:820,height:1180}];

/* 共用：量溢出與「被箭頭壓到」 */
const BOX=()=>{
 const de=document.documentElement,st=document.getElementById('stage');
 /* 2026-09-20 起，字卡的箭頭改成貼在卡片自己的左右邊、住在 #stage 裡面。
    容器（#stage、#card）本來就蓋住箭頭，那不是「壓到」，而且翻卡動畫跑到一半
    量到的是被 rotateY 轉過的矩形，會時對時錯。
    所以只量**葉節點**——真正看得到的那幾行字與圖示，這才是「會被箭頭擋住」的東西。 */
 const navEls=[...document.querySelectorAll('.nav')];
 const navs=navEls.map(n=>n.getBoundingClientRect());let hit=null;
 for(const el of st.querySelectorAll('*')){const r=el.getBoundingClientRect();if(!r.width)continue;
  if(el.children.length||navEls.includes(el))continue;
  if(!el.textContent.trim())continue;
  for(const n of navs)if(r.left<n.right&&r.right>n.left&&r.top<n.bottom&&r.bottom>n.top)hit=(el.className||el.tagName)+' 壓到箭頭'}
 return{ox:(de.scrollWidth-de.clientWidth)+(st.scrollWidth-st.clientWidth),
        oy:(de.scrollHeight-de.clientHeight)+(st.scrollHeight-st.clientHeight),h:hit};
};

const fontOk=p=>p.evaluate(async()=>{await document.fonts.ready;
 const c=document.createElement('canvas').getContext('2d');
 c.font='700 48px Andika';const a=c.measureText('brother daughter').width;
 c.font='700 48px sans-serif';const s=c.measureText('brother daughter').width;
 return{ok:document.fonts.check('700 48px Andika')&&document.fonts.check('400 48px Andika'),d:Math.abs(a-s)}});

/* ---------- C. 首頁 ---------- */
async function hubPage(p,f,vp,e){
 const snap=()=>p.evaluate(()=>{
  const de=document.documentElement;
  return{ox:de.scrollWidth-de.clientWidth,oy:de.scrollHeight-de.clientHeight,
   grades:[...document.querySelectorAll('.gr h2')].map(h=>h.firstChild.textContent.trim()),
   rows:document.querySelectorAll('.gi').length,
   links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))}});
 let acts=0;
 let s=await snap();acts++;
 if(s.ox>0)e.push('關著時橫向溢出'+s.ox);
 if(s.oy>0&&vp.width>vp.height)e.push('橫放有捲軸（投影會被切掉）'+s.oy);
 /* 2026-10-03：三年級在上、四年級在下，每個年級 7 項（words/_grades.js） */
 if(s.grades.join(',')!=='三年級,四年級')e.push('年級順序不對：'+s.grades.join(','));
 if(s.rows!==18)e.push('首頁不是兩個年級各 9 項（'+s.rows+'）');   /* 2026-10-07 使用者第 11 點：9 項 */

 /* 每一個站內連結都要真的存在 */
 const root=require('path').resolve(DIR,'..');
 const miss=[];
 for(const h of s.links){
  if(!h||/^(https?:|mailto:|#)/.test(h))continue;
  const fp=require('path').resolve(root,decodeURIComponent(h.split('#')[0].split('?')[0]));  /* %20 ＝ 空白（G3 - L1 + L2） */
  if(!fs.existsSync(fp))miss.push(h);
 }
 acts++;
 if(miss.length)e.push('連結指到不存在的檔案：'+miss.join('、'));

 return acts;
}

/* ---------- D. 一組單字的首頁（jobs.html、numbers/index.html、sight/index.html）---------- */
async function secPage(p,f,vp,e){
 const s=await p.evaluate(()=>{const de=document.documentElement;
  return{ox:de.scrollWidth-de.clientWidth,links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))}});
 if(s.ox>0)e.push('橫向溢出'+s.ox);
 const base=require('path').dirname(require('path').resolve(DIR,f));
 const miss=s.links.filter(h=>h&&!/^(https?:|mailto:|#)/.test(h)&&!fs.existsSync(require('path').resolve(base,decodeURIComponent(h.split('#')[0]))));
 if(miss.length)e.push('連結指到不存在的檔案：'+miss.join('、'));
 await p.click('#cardsBtn');await p.waitForTimeout(300);
 const n=await p.$$eval('#cards a',a=>a.filter(x=>x.getClientRects().length).length);
 if(n<3)e.push('按了單字卡沒有展開（'+n+'）');
 return 3;
}

/* ---------- A. 幕頁 ---------- */
async function scenePage(p,f,vp,e){
 const snap=()=>p.evaluate(BOXSRC=>{
  const st=document.getElementById('stage');
  const box=eval('('+BOXSRC+')')();
  return{t:st.innerText.replace(/\n+/g,' | '),
   on:[...document.querySelectorAll('#dots i')].findIndex(x=>x.className==='on'),
   n:document.querySelectorAll('#dots i').length,
   pd:document.getElementById('prev').disabled,nd:document.getElementById('next').disabled,
   ox:box.ox,oy:box.oy,h:box.h,
   /* 2026-09-27：右上角「🔤 單字首頁」不可以蓋到這一幕的字 */
   wh:(()=>{const w=document.getElementById('whome');if(!w)return null;const r=w.getBoundingClientRect();
    for(const el of st.querySelectorAll('*')){if(el.children.length||!el.textContent.trim())continue;const q=el.getBoundingClientRect();
     if(q.width&&q.left<r.right&&q.right>r.left&&q.top<r.bottom&&q.bottom>r.top)return (el.className||el.tagName)+'「'+el.textContent.trim().slice(0,10)+'」'}
    return ''})()}},BOX.toString());
 const first=await snap();const N=first.n;let acts=0,qChecked=false;
 if(first.wh===null&&!/(^|\/)brother-why\.html$/.test(f)&&!/sentences\//.test(f)&&await p.evaluate(()=>/單字結構|單字故事|環遊世界/.test((document.querySelector('.topicfix')||{}).textContent||'')))e.push('沒有「🔤 單字首頁」按鈕');
 /* 2026-10-04：只有加號的那一頁刪掉了（You are、How old、years old）➜ 沒有「以前」的字卡可以只有兩幕（中文 ➜ 現在） */
 if(N<(await p.evaluate(()=>!!(window.W&&W.now&&!W.old&&!W.build&&!W.morph&&document.getElementById('say1')))?2:3))e.push('幕數只有 '+N);
 for(let i=0;i<N;i++){
  if(i){await p.click('#next');await p.waitForTimeout(650)}
  const s=await snap();acts++;
  if(showText&&vp.n===VPS[0].n)console.log('  '+f+' 幕'+(i+1)+'  '+s.t);
  if(s.on!==i)e.push('幕'+(i+1)+'進度點錯');
  if(s.wh)e.push('幕'+(i+1)+' 「單字首頁」按鈕蓋到 '+s.wh);
  if(s.ox>0)e.push('幕'+(i+1)+'橫向溢出'+s.ox);
  if(s.oy>0)e.push('幕'+(i+1)+'縱向溢出'+s.oy);
  if(s.h)e.push('幕'+(i+1)+' '+s.h);
  /* 2026-10-03：單字卡第一幕的左箭頭 ＝ 上一個單字、最後一幕的右箭頭 ＝ 下一個單字，兩個箭頭都不關 */
  const WC=!!(await p.$('#say1'));
  if(WC){if(s.pd||s.nd)e.push('幕'+(i+1)+' 單字卡的箭頭被關掉了');
   const tt=await p.evaluate(()=>[document.getElementById('prev').title,document.getElementById('next').title]);
   if(i===0&&tt[0]!=='上一個單字')e.push('幕1 左箭頭不是「上一個單字」');
   if(i===N-1&&tt[1]!=='下一個單字')e.push('末幕 右箭頭不是「下一個單字」');}
  else{
  if(i===0&&(!s.pd||s.nd))e.push('幕1箭頭狀態錯');
  if(i===N-1&&(!s.nd||s.pd))e.push('末幕箭頭狀態錯');}
  /* 2026-09-26：故事融入暖身題 ➜ 先有題目、故事藏起來；答了才揭曉，揭曉後也不可以溢出、不可以壓到按鈕 */
  if(await p.$('#stage.qwait')){
   const q0=await p.evaluate(()=>({n:document.querySelectorAll('#stage .qo button').length,
    rv:[...document.querySelectorAll('#stage .rv')].some(x=>x.getClientRects().length)}));
   if(q0.n!==4)e.push('幕'+(i+1)+' 猜猜看不是四個選項（'+q0.n+'）');
   if(q0.rv)e.push('幕'+(i+1)+' 還沒作答就看得到故事');
   /* 2026-09-27：思考時間 20 秒 ➜ 選項先鎖住；⏸ 暫停會停住倒數；✋ 提早回答馬上開放 */
   const lk=await p.evaluate(()=>{const z=document.querySelector('#stage .qz');return{lock:!!(z&&z.classList.contains('lock')),
    sec:+((document.querySelector('#stage .qsec')||{}).textContent||0),early:!!document.querySelector('#stage .qearly'),pause:!!document.querySelector('#stage .qpause')}});
   if(!lk.lock)e.push('幕'+(i+1)+' 猜猜看沒有先鎖住 20 秒');
   if(lk.sec<15||lk.sec>20)e.push('幕'+(i+1)+' 思考倒數不是 20 秒（'+lk.sec+'）');
   if(!lk.early||!lk.pause)e.push('幕'+(i+1)+' 沒有「提早回答」或「暫停」按鈕');
   if(!qChecked){qChecked=true;
    await p.click('#stage .qpause');const a1=await p.evaluate(()=>qLeft);await p.waitForTimeout(1200);const a2=await p.evaluate(()=>qLeft);
    if(a2!==a1)e.push('幕'+(i+1)+' 按了暫停，倒數還在走');
    await p.click('#stage .qpause');await p.waitForTimeout(1200);
    if(await p.evaluate(()=>qLeft)>=a2)e.push('幕'+(i+1)+' 按了繼續，倒數沒有走');
    await p.evaluate(()=>{qLeft=0.2});await p.waitForTimeout(600);
    if(await p.evaluate(()=>document.querySelector('#stage .qz').classList.contains('lock')))e.push('幕'+(i+1)+' 倒數到 0 沒有開放作答');
   }else await p.click('#stage .qearly');
   await p.waitForTimeout(200);
   await p.click('#stage .qo button:not([data-ok="1"])');await p.waitForTimeout(3800);
   const q1=await p.evaluate(BOXSRC=>{const box=eval('('+BOXSRC+')')();
    const bs=[...document.querySelectorAll('#bar button')].map(b=>b.getBoundingClientRect());let hit=null;
    for(const el of document.getElementById('stage').querySelectorAll('*')){
     if(el.children.length||!el.textContent.trim())continue;
     const r=el.getBoundingClientRect();if(!r.width)continue;
     for(const b of bs)if(r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top)hit=(el.className||el.tagName)+'「'+el.textContent.trim().slice(0,12)+'」'}
    return{done:document.getElementById('stage').classList.contains('qdone'),ok:!!document.querySelector('#stage .qo button.ok'),
     rv:[...document.querySelectorAll('#stage .rv')].some(x=>x.getClientRects().length),ox:box.ox,oy:box.oy,hit}},BOX.toString());
   acts++;
   if(!q1.done||!q1.rv)e.push('幕'+(i+1)+' 答了題目，故事沒有揭曉');
   if(!q1.ok)e.push('幕'+(i+1)+' 答錯了卻沒有標出正確答案');
   if(q1.ox>0)e.push('幕'+(i+1)+' 揭曉後橫向溢出'+q1.ox);
   if(q1.oy>0)e.push('幕'+(i+1)+' 揭曉後縱向溢出'+q1.oy);
   if(q1.hit)e.push('幕'+(i+1)+' 揭曉後 '+q1.hit+' 壓到下面的按鈕');
  }
 }
 const b4=(await snap()).on;await p.waitForTimeout(6000);
 if((await snap()).on!==b4)e.push('停 6 秒自動換頁');

 /* 2026-09-24 新增的四項（使用者指定）───────────────────────────── */
 const NEW=/(^|[\/-])(parts|world)(-\d)?\.html$/.test(f);
 const back=async()=>{await p.evaluate(()=>show(0));await p.waitForTimeout(600)};
 if(NEW){
  /* ① 字不可以壓到下面的按鈕列（動畫跑完才量） */
  await back();
  for(let i=0;i<N;i++){
   if(i){await p.click('#next')}
   await p.waitForTimeout(3600);
   const hit=await p.evaluate(()=>{
    const bs=[...document.querySelectorAll('#bar button')].map(b=>b.getBoundingClientRect());
    for(const el of document.getElementById('stage').querySelectorAll('*')){
     if(el.children.length||!el.textContent.trim())continue;
     const r=el.getBoundingClientRect();if(!r.width)continue;
     for(const b of bs)if(r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top)
      return (el.className||el.tagName)+'「'+el.textContent.trim().slice(0,12)+'」';
    }return null});
   acts++;
   if(hit)e.push('幕'+(i+1)+' '+hit+' 壓到下面的按鈕');
  }
  /* ② 「🔊 唸一次」在正下方的中央 */
  const c=await p.evaluate(()=>{const r=document.getElementById('say').getBoundingClientRect();
   return Math.round(r.left+r.width/2-innerWidth/2)});acts++;
  if(Math.abs(c)>3)e.push('「唸一次」沒有在正中央（偏 '+c+'px）');
  /* ③ 猜猜看：一開始看不到國名，按「公布答案」才出現 */
  await back();
  let seen=0;
  for(let i=0;i<N;i++){
   if(i){await p.click('#next');await p.waitForTimeout(500)}
   if(!await p.$('#stage .guess'))continue;
   seen++;
   const v0=await p.evaluate(()=>[...document.querySelectorAll('#stage .gans')].some(x=>x.getClientRects().length>0));
   if(v0)e.push('幕'+(i+1)+' 還沒公布就看得到國名');
   await p.click('#stage .grev');await p.waitForTimeout(400);
   const v1=await p.evaluate(()=>[...document.querySelectorAll('#stage .gans')].every(x=>x.getClientRects().length>0));
   if(!v1)e.push('幕'+(i+1)+' 按了公布答案，國名沒有出來');
   if(await p.$('#stage .gmode')){
    await p.click('#stage .gmode button[data-m="zh"]');await p.waitForTimeout(300);
    const z=await p.evaluate(()=>[...document.querySelectorAll('#stage .gm .mzh')].every(x=>x.getClientRects().length>0));
    if(!z)e.push('幕'+(i+1)+' 右邊切到中文沒有出來');
   }
   acts++;
  }
  if(!seen)e.push('找不到「這是哪一國的話？」猜猜看');
 }
 /* ⑤ 📑 目次（使用者 2026-09-25 指定）：按了才出來、一格一格、點了跳得過去（字卡是連到別張） */
 if(await p.$('#tocb')){
  await p.click('#tocb');await p.waitForTimeout(300);
  const t=await p.evaluate(()=>({on:document.getElementById('toc').classList.contains('on'),
   n:document.querySelectorAll('#toc .tgd button,#toc .tgd a').length}));acts++;
  if(!t.on)e.push('按了目次沒有打開');
  if(t.n<2)e.push('目次只有 '+t.n+' 格');
  const btn=await p.$('#toc .tgd button[data-k="1"]');
  if(btn){await btn.click();await p.waitForTimeout(700);
   if((await snap()).on!==1)e.push('目次點第 2 幕沒有跳過去');
   await p.evaluate(()=>show(0));await p.waitForTimeout(500);}
  else{await p.click('#tocx');await p.waitForTimeout(200)}
  if(await p.evaluate(()=>document.getElementById('toc').classList.contains('on')))e.push('目次關不掉');
 }else if(!/family-tree|brother-why|quiz/.test(f))e.push('沒有 📑 目次按鈕');
 /* ⑦ 2026-10-02 字卡（全站）：音節平常看不到、按了才切；按鈕一排、「唸 3 次」正中央、順序對；總首頁／單字首頁連得到；卡片不壓到按鈕 */
 if(await p.$('#say1')){
  await p.evaluate(()=>show(SCENES.length-1));await p.waitForTimeout(700);
  const c=await p.evaluate(()=>{const cuts=[...document.querySelectorAll('#card .phw .cut')];
   const vis=cuts.filter(x=>x.getBoundingClientRect().width>1||getComputedStyle(x.firstChild).visibility!=='hidden').length;
   const bs=[...document.querySelectorAll('#bar button')],r=bs.map(b=>b.getBoundingClientRect());
   const s3=document.getElementById('say1').getBoundingClientRect(),cd=document.getElementById('card').getBoundingClientRect(),
    bt=document.getElementById('bottom').getBoundingClientRect();
   return{n:cuts.length,vis,ids:bs.map(b=>b.id),rows:new Set(r.map(x=>Math.round(x.top/4))).size,
    out:r.some(x=>x.left<0||x.right>innerWidth)||r.some((x,k)=>k&&x.left<r[k-1].right-1),mid:Math.round(s3.left+s3.width/2-innerWidth/2),
    lap:Math.round(cd.bottom-bt.top),wrap:bs.filter(b=>b.querySelector('.blb')&&b.querySelector('.blb').getClientRects().length>1).map(b=>b.id)}});
  acts++;
  if(c.vis)e.push('字卡一開始就看得到音節切分（'+c.vis+' 處）');
  if(c.rows!==1)e.push('按鈕列不是一排（'+c.rows+' 排）');
  if(c.out)e.push('按鈕超出畫面或互相重疊');
  if(Math.abs(c.mid)>3)e.push('「唸 1 次」沒有在正中央（偏 '+c.mid+'px）');
  if(c.lap>0)e.push('字卡壓到下面的按鈕（'+c.lap+'px）');
  if(c.wrap.length)e.push('按鈕的字折行：'+c.wrap.join('、'));
  const L=c.ids,ix=x=>L.indexOf(x);
  /* 2026-10-04（清單 Q5）：最左 目次｜音節動畫｜看音節｜音標｜放慢；正中央 ＝ 唸 1 次；右 ＝ 唸 3 次｜自動播放｜（結構／時光機）｜出處｜單字首頁｜總首頁（最右） */
  if(L[0]!=='tocb'||ix('phsyl')!==1||ix('phsee')!==2||ix('phmode')!==3||ix('slow')!==4||ix('say1')!==5||ix('say3')!==6||ix('autob')!==7||L[L.length-3]!=='srcb'||L[L.length-2]!=='whome'||L[L.length-1]!=='home')
   e.push('按鈕順序不對：'+L.join(' '));
  /* 💡 補充：小字平常收起來，按了才出現、再按收回 */
  const SUP=await p.evaluate(()=>{for(let k=0;k<SCENES.length;k++){show(k);const b=document.querySelector('#card .supb');if(b)return k}return -1});
  if(SUP>=0){const vis=()=>p.evaluate(()=>[...document.querySelectorAll('#card .sub:not(.zfull)')].some(x=>x.getClientRects().length));
   const v0=await vis();await p.click('#card .supb');await p.waitForTimeout(200);const v1=await vis();await p.click('#card .supb');await p.waitForTimeout(200);const v2=await vis();acts++;
   if(v0)e.push('補充的小字一開始就看得到');if(!v1)e.push('按了「💡 補充」沒有出現');if(v2)e.push('再按一次「💡 補充」沒有收回');}
  if(await p.evaluate(()=>[...document.querySelectorAll('#card .tag')].some(t=>/^(英文|用在句子裡|怎麼組的)$/.test(t.textContent.trim()))))e.push('上方的小標題（英文／用在句子裡）沒有刪掉');
  /* 2026-10-04（清單 Q6）：有「以前」那一頁，下一頁上方寫「現在」；沒有「以前」的字不寫「現在」 */
  {const tg=await p.evaluate(()=>{const o=[];for(let k=0;k<SCENES.length;k++){show(k);o.push([...document.querySelectorAll('#card .tag')].map(t=>t.textContent.trim()).join('|'))}return o});
   tg.forEach((t,k)=>{if(t==='以前'&&tg[k+1]!=='現在')e.push('幕'+(k+1)+' 有「以前」，下一幕上方沒有「現在」');
    if(t==='現在'&&tg[k-1]!=='以前')e.push('幕'+(k+1)+' 寫了「現在」，前一幕卻不是「以前」')})}
  /* 2026-10-04 修（清單第 2 點）：「唸 1 次」唸的字 ＝ 卡片上的字（I am 原本只唸 I）。攔下播放的語音檔，對回鑰匙 */
  if(vp.n===VPS[0].n){
   const bad=await p.evaluate(async()=>{
    const rev={};for(const k in (window.ENAUD||{}))rev[ENAUD[k][0]]=k;
    const said=[];const op=HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play=function(){const me=this,f=(me.src||'').split('/').pop();said.push(rev[f]||('?'+f));setTimeout(()=>me.dispatchEvent(new Event('ended')),40);return Promise.resolve()};
    try{speechSynthesis.speak=u=>{said.push(u.text);setTimeout(()=>u.onend&&u.onend(),20)}}catch(x){}
    const nz=t=>String(t).toLowerCase().replace(/[\u2019]/g,"'").replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ').trim();
    const out=[];
    for(let k=0;k<SCENES.length;k++){show(k);await new Promise(r=>setTimeout(r,(window.W&&W.morph&&k===1)?6500:500));
     const mo=document.querySelector('#card .mor'),sn=document.querySelector('#card .r1ph[data-sent]'),g=document.querySelector('#card .word:not(.past),#card .parts');
     let exp;
     if(mo)exp=[W.morph.a+' '+W.morph.b,W.morph.res];
     else if(sn)exp=[sn.getAttribute('data-sent')];
     else if(g){const ws=[...g.querySelectorAll('.phw')].map(x=>x.getAttribute('data-say'));exp=g.classList.contains('parts')?ws:[ws.length>1?W.now:ws[0]]}
     else exp=[W.now];
     said.length=0;document.getElementById('say1').click();
     await new Promise(r=>setTimeout(r,mo?6500:900));
     const got=said.map(nz).join(' | '),want=exp.map(nz).join(' | ');
     if(got!==want)out.push('幕'+(k+1)+'：唸了「'+got+'」，卡片上是「'+want+'」')}
    HTMLMediaElement.prototype.play=op;return out});
   acts++;bad.forEach(x=>e.push('「唸 1 次」'+x))}
  await p.evaluate(()=>show(SCENES.length-1));await p.waitForTimeout(300);
  /* 2026-10-02：「✂️ 音節動畫」改名；「👀 看音節」點了立刻切好（不演動畫），再點收回去 */
  if(await p.evaluate(()=>{const b=document.querySelector('#phsyl .blb');return !b||b.textContent!=='音節動畫'}))e.push('「✂️ 音節動畫」的名字不對');
  if(c.n){const T=()=>{const ps=[...document.querySelectorAll('#card .c.t .phw')];const L=(ps.length?ps:[PH.main()]).filter(x=>x&&+x.getAttribute('data-n')>1);
    return{n:L.length,sp:L.filter(x=>x.classList.contains('split')).length,anim:document.querySelectorAll('#card .phn,#card .phsc,#card .syl.k0').length,
     on:document.getElementById('phsee').classList.contains('on')}};
   await p.click('#phsee');await p.waitForTimeout(150);const s1=await p.evaluate(T);
   await p.waitForTimeout(900);const s1b=await p.evaluate(T);
   await p.click('#phsee');await p.waitForTimeout(150);const s2=await p.evaluate(T);acts+=2;
   if(s1.sp!==s1.n||!s1.on)e.push('按了「👀 看音節」沒有馬上切好（'+s1.sp+'／'+s1.n+'）');
   if(s1.anim||s1b.anim)e.push('「👀 看音節」演了動畫');
   if(s2.sp||s2.on)e.push('再按一次「👀 看音節」沒有收回去');}
  if(c.n){await p.evaluate(()=>{window.__sy=0;new MutationObserver(()=>{if(document.querySelector('#card .syl.sayon'))window.__sy=1}).observe(document.getElementById('card'),{subtree:true,attributes:true,attributeFilter:['class']})});
   await p.click('#phsyl');
   const t=await p.evaluate(()=>{const ps=document.querySelectorAll('#card .c.t .phw');return ps.length?[].reduce.call(ps,(a,x)=>a+PH.sylTime(x)+3300,0):PH.sylTime(PH.main())});
   await p.waitForTimeout(t+600);
   const sp=await p.evaluate(()=>{const ps=[...document.querySelectorAll('#card .c.t .phw')];const L=ps.length?ps:[PH.main()];
    return L.filter(x=>x&&+x.getAttribute('data-n')>1).every(x=>x.classList.contains('split'))});
   acts++;if(!sp)e.push('按了「音節」沒有切開');
   /* 2026-10-03：唸到哪一個音節，那一段放大變亮（.sayon） */
   if(!await p.evaluate(()=>window.__sy))e.push('音節動畫沒有「唸到哪一段亮哪一段」');}
  if(vp.n===VPS[1].n){const h=fs.readFileSync(require('path').resolve(DIR,f),'utf8'),base=require('path').dirname(require('path').resolve(DIR,f));
   for(const id of ['home','whome']){const m=h.match(new RegExp('getElementById\\("'+id+'"\\)\\.addEventListener\\("click",function\\(\\)\\{location\\.href="([^"]+)"'));
    if(!m||!fs.existsSync(require('path').resolve(base,m[1])))e.push((id==='home'?'總首頁':'單字首頁')+'連不到（'+(m&&m[1])+'）')}
   if(/(^|\/)(family|seven|stickers|play-basketball)\.html$/.test(f)){
    /* 唸 3 次：真的唸三遍（數 Audio.play／speechSynthesis.speak 的次數） */
    await p.evaluate(()=>{window.__n=0;const sp=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{__n++;setTimeout(()=>u.onend&&u.onend(),300)};
     HTMLAudioElement.prototype.play=function(){__n++;setTimeout(()=>this.onended&&this.onended(),300);return Promise.resolve()};show(0)});
    await p.waitForTimeout(800);await p.evaluate(()=>{__n=0});await p.click('#say3');await p.waitForTimeout(4200);
    const n3=await p.evaluate(()=>__n);acts++;if(n3!==3)e.push('「唸 3 次」唸了 '+n3+' 次');
    /* 2026-10-03：到第二幕自動唸英文 */
    await p.evaluate(()=>{__n=0;show(1)});await p.waitForTimeout(900);if(await p.evaluate(()=>__n)<1)e.push('到第二幕沒有自動唸');}
  }
  await p.evaluate(()=>show(0));await p.waitForTimeout(300);
 }
 /* ⑥ 出處直接跳到這一幕的證據（使用者 2026-09-25 指定）：SRCAT 指到的那一條 */
 if(await p.$('#srcb')){
  let bad=[];
  for(let i=0;i<N;i++){
   await p.evaluate(k=>show(k),i);await p.waitForTimeout(250);
   const r=await p.evaluate(()=>{var v=window.SRCAT;if(v==null||v==='')return null;
    var L=[].slice.call(document.querySelectorAll('#src .sl')),want=typeof v==='number'?v:L.findIndex(x=>x.getAttribute('data-id')===v);
    document.getElementById('srcb').click();
    var got=+(document.getElementById('srcn').textContent)-1;document.getElementById('srcx').click();
    return{want,got,v}});
   if(r&&(r.want<0||r.want!==r.got))bad.push((i+1)+':'+r.v);
  }
  acts++;
  if(bad.length)e.push('出處沒有跳到這一幕的證據（'+bad.join('、')+'）');
  await p.evaluate(()=>show(0));await p.waitForTimeout(300);
 }
 /* ⑦ 「🌍 環遊世界 →」要真的連到環遊世界那一頁（使用者 2026-09-25 抓到按了到不了） */
 if(await p.$('#fwd')){
  const want=await p.evaluate(()=>document.getElementById('fwd').textContent);
  await Promise.all([p.waitForNavigation({timeout:5000}).catch(()=>null),p.click('#fwd')]);
  acts++;
  /* ⏳ 時光機（2026-09-28）的「🃏 回到字卡」要到那一個字的字卡；其他頁的 fwd 都是環遊世界 */
  const wantF=/-evo\.html$/.test(f)?f.split('/').pop().replace('-evo',''):null;
  if(wantF?p.url().split('/').pop()!==wantF:!/world\.html$/.test(p.url()))e.push('按「'+want+'」沒有到'+(wantF||'環遊世界')+'（'+p.url().split('/').pop()+'）');
  await p.goBack().catch(()=>null);await p.waitForTimeout(500);
 }
 /* ④ 出處：一條一頁、字要大、翻得動、關得掉（每一頁都量） */
 if(await p.$('#srcb')){
  await p.click('#srcb');await p.waitForTimeout(500);
  const s0=await p.evaluate(()=>{const on=document.querySelector('#src .sl.on');
   return{n:document.querySelectorAll('#src .sl').length,on:document.querySelectorAll('#src .sl.on').length,
    fs:on?parseFloat(getComputedStyle(on.querySelector('.lt')).fontSize):0,
    cnt:(document.getElementById('srcn')||{}).textContent,
    ox:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
  acts++;
  if(s0.n<2)e.push('出處只有 '+s0.n+' 頁');
  if(s0.on!==1)e.push('出處一次不是只顯示一條（'+s0.on+'）');
  if(s0.fs<24)e.push('出處的字太小（'+s0.fs+'px）');
  if(s0.ox>0)e.push('出處橫向溢出'+s0.ox);
  const d0=(await snap()).on;
  /* 出處會從「這一幕的證據」開始（2026-09-25），所以量「按 → 有沒有往後翻一條」 */
  const c0=+(await p.$eval('#srcn',x=>x.textContent));
  await p.keyboard.press('ArrowRight');await p.waitForTimeout(300);
  const c1=+(await p.$eval('#srcn',x=>x.textContent));
  if(c1!==Math.min(c0+1,s0.n))e.push('出處按 → 沒有往後翻一條（'+c0+'→'+c1+'）');
  if((await snap()).on!==d0)e.push('出處開著的時候按 →，後面那一頁也跟著翻了');
  await p.click('#srcx');await p.waitForTimeout(300);
  if(await p.$eval('#src',x=>getComputedStyle(x).display!=='none'))e.push('出處關不掉');
 }
 return acts;
}

/* ---------- B. 暖身題頁 ---------- */
async function quizPage(p,f,vp,e){
 const snap=()=>p.evaluate(BOXSRC=>{
  const box=eval('('+BOXSRC+')')();
  const opts=[...document.querySelectorAll('.opt')];
  return{ox:box.ox,oy:box.oy,h:box.h,
   nOpt:opts.length,lockedAll:opts.length>0&&opts.every(o=>o.disabled),
   secs:parseInt((document.getElementById('secs')||{}).textContent||'-1',10),
   qn:(document.getElementById('qn')||{}).textContent||'',
   talk:(document.getElementById('talk')||{}).innerText||'',
   nextHidden:document.getElementById('next').classList.contains('hide'),
   unlockHidden:document.getElementById('unlock').classList.contains('hide'),
   pauseHidden:document.getElementById('pause').classList.contains('hide'),
   pauseLabel:document.getElementById('pause').textContent,
   text:document.getElementById('stage').innerText.replace(/\n+/g,' | ')}},BOX.toString());
 const chk=(s,tag)=>{
  if(s.ox>0)e.push(tag+'橫向溢出'+s.ox);
  if(s.oy>0)e.push(tag+'縱向溢出'+s.oy);
  if(s.h)e.push(tag+s.h);
  if(showText&&vp.n===VPS[0].n)console.log('  '+f+' '+tag+'  '+s.text);
 };
 let acts=0;
 chk(await snap(),'閘門：');acts++;

 await p.click('#go');await p.waitForTimeout(500);
 let s=await snap();acts++;chk(s,'出題：');
 if(s.nOpt!==4)e.push('出題：選項不是 4 個（'+s.nOpt+'）');
 if(!s.lockedAll)e.push('出題：選項沒有先鎖住（小組討論）');
 if(!(s.secs>0&&s.secs<=50))e.push('出題：倒數秒數不對（'+s.secs+'）');
 if(s.unlockHidden)e.push('出題：沒有「提前作答」按鈕');
 if(s.nextHidden===false)e.push('出題：不該先出現「下一題」');

 const s0=s.secs;await p.waitForTimeout(1400);
 s=await snap();acts++;
 if(!(s.secs<s0))e.push('倒數沒有在減少（'+s0+'→'+s.secs+'）');

 /* 老師按「暫停」→ 秒數必須停住；再按一次 → 必須繼續走 */
 if(s.pauseHidden)e.push('出題：沒有「暫停」按鈕');
 await p.click('#pause');await p.waitForTimeout(150);
 const held0=(await snap()).secs;await p.waitForTimeout(2200);
 s=await snap();acts++;
 if(s.secs!==held0)e.push('按了暫停，倒數還在跑（'+held0+'→'+s.secs+'）');
 if(!/繼續/.test(s.pauseLabel))e.push('暫停後按鈕沒有變成「繼續」');
 await p.click('#pause');await p.waitForTimeout(1600);
 s=await snap();acts++;
 if(!(s.secs<held0))e.push('按了繼續，倒數沒有恢復（'+held0+'→'+s.secs+'）');

 await p.click('#unlock');await p.waitForTimeout(250);
 s=await snap();acts++;chk(s,'解鎖：');
 if(s.lockedAll)e.push('解鎖：按了「提前作答」選項還是鎖著');

 await p.click('.opt');await p.waitForTimeout(600);
 s=await snap();acts++;chk(s,'作答：');
 if(!s.lockedAll)e.push('作答：作答後選項沒有全部鎖住');
 if(!s.pauseHidden)e.push('作答：作答後「暫停」沒有收起來');
 if(s.nextHidden)e.push('作答：沒有出現「下一題」');
 if(!/答對|答錯|時間到/.test(s.talk))e.push('作答：沒有顯示對錯與秒懂說明');

 const qn=s.qn;await p.waitForTimeout(6000);
 s=await snap();acts++;
 if(s.qn!==qn)e.push('作答後停 6 秒自動跳題');
 return acts;
}

(async()=>{
const b=await chromium.launch();const bad=[];let acts=0;
for(const vp of VPS){
 const ctx=await b.newContext({viewport:{width:vp.width,height:vp.height},offline:true});
 for(const f of FILES){
  const p=await ctx.newPage();const e=[];
  p.on('pageerror',err=>e.push('JS 例外：'+err.message));
  p.on('console',m=>{if(m.type()==='error')e.push('console error：'+m.text().slice(0,120))});
  await p.goto(require('url').pathToFileURL(DIR+f).href);await p.waitForTimeout(400);
  const font=await fontOk(p);
  if(!font.ok||font.d<0.5)e.push('Andika 未生效');
  const kind=await p.evaluate(()=>document.getElementById('dots')?'scene':
   (document.getElementById('go')?'quiz':(document.getElementById('hub')?'hub':(document.getElementById('cardsBtn')?'sec':'unknown'))));
  if(kind==='unknown')e.push('頁型不明（沒有 #dots／#go／#hub）');
  else acts+=await ({scene:scenePage,quiz:quizPage,hub:hubPage,sec:secPage}[kind])(p,f,vp,e);
  if(e.length)bad.push(f+' @'+vp.n+'：'+e.join('；'));
  await p.close();
 }
 await ctx.close();
}
await b.close();
if(bad.length){console.log(bad.join('\n'));console.log('=== 失敗 '+bad.length+' 項');process.exit(1)}
console.log('=== 全部通過'+(grp.length===2?'（第 '+grp.join('/')+' 組）':'')+'：'+FILES.length+' 頁 × '+VPS.length+' 尺寸 × 共 '+acts+' 個檢查點');
})();
