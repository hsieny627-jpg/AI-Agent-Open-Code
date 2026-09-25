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
const files=args.filter(a=>a!=='--text');
/* 2026-09-25：G3 的數字單字、Sight Words 也是這一套樣板產生的，一起量 */
const G3W=['numbers','sight'].map(d=>'../G3 - L1 + L2/'+d+'/').filter(d=>fs.existsSync(DIR+d))
 .map(d=>fs.readdirSync(DIR+d).filter(f=>f.endsWith('.html')).sort().map(f=>d+f)).reduce((a,b)=>a.concat(b),[]);
const FILES=files.length?files:
 fs.readdirSync(DIR).filter(f=>f.endsWith('.html')).sort().concat(['../index.html']).concat(G3W);
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
   open:document.getElementById('cards').classList.contains('on'),
   nCard:document.querySelectorAll('#cards a').length,
   links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))}});
 let acts=0;
 let s=await snap();acts++;
 if(s.ox>0)e.push('關著時橫向溢出'+s.ox);
 if(s.oy>0)e.push('關著時有捲軸（投影會被切掉）'+s.oy);
 if(s.open)e.push('17 張卡一開始就是展開的');

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

 await p.click('#cardsBtn');await p.waitForTimeout(350);
 s=await snap();acts++;
 if(!s.open)e.push('按了「17 張單字卡」沒有展開');
 if(s.nCard!==17)e.push('展開後不是 17 張（'+s.nCard+'）');
 if(s.ox>0)e.push('展開後橫向溢出'+s.ox);
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
   ox:box.ox,oy:box.oy,h:box.h}},BOX.toString());
 const first=await snap();const N=first.n;let acts=0;
 if(N<3)e.push('幕數只有 '+N);
 for(let i=0;i<N;i++){
  if(i){await p.click('#next');await p.waitForTimeout(650)}
  const s=await snap();acts++;
  if(showText&&vp.n===VPS[0].n)console.log('  '+f+' 幕'+(i+1)+'  '+s.t);
  if(s.on!==i)e.push('幕'+(i+1)+'進度點錯');
  if(s.ox>0)e.push('幕'+(i+1)+'橫向溢出'+s.ox);
  if(s.oy>0)e.push('幕'+(i+1)+'縱向溢出'+s.oy);
  if(s.h)e.push('幕'+(i+1)+' '+s.h);
  if(i===0&&(!s.pd||s.nd))e.push('幕1箭頭狀態錯');
  if(i===N-1&&(!s.nd||s.pd))e.push('末幕箭頭狀態錯');
 }
 const b4=(await snap()).on;await p.waitForTimeout(6000);
 if((await snap()).on!==b4)e.push('停 6 秒自動換頁');

 /* 2026-09-24 新增的四項（使用者指定）───────────────────────────── */
 const NEW=/(^|[\/-])(parts|world)\.html$/.test(f);
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
  if(!/world\.html$/.test(p.url()))e.push('按「'+want+'」沒有到環遊世界（'+p.url().split('/').pop()+'）');
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
console.log('=== 全部通過：'+FILES.length+' 頁 × '+VPS.length+' 尺寸 × 共 '+acts+' 個檢查點');
})();
