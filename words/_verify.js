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
const FILES=files.length?files:fs.readdirSync(DIR).filter(f=>f.endsWith('.html')).sort();
const VPS=[{n:'1024x768',width:1024,height:768},{n:'820x1180',width:820,height:1180}];

/* 共用：量溢出與「被箭頭壓到」 */
const BOX=()=>{
 const de=document.documentElement,st=document.getElementById('stage');
 const navs=[...document.querySelectorAll('.nav')].map(n=>n.getBoundingClientRect());let hit=null;
 for(const el of st.querySelectorAll('*')){const r=el.getBoundingClientRect();if(!r.width)continue;
  for(const n of navs)if(r.left<n.right&&r.right>n.left&&r.top<n.bottom&&r.bottom>n.top)hit=(el.className||el.tagName)+' 壓到箭頭'}
 return{ox:(de.scrollWidth-de.clientWidth)+(st.scrollWidth-st.clientWidth),
        oy:(de.scrollHeight-de.clientHeight)+(st.scrollHeight-st.clientHeight),h:hit};
};

const fontOk=p=>p.evaluate(async()=>{await document.fonts.ready;
 const c=document.createElement('canvas').getContext('2d');
 c.font='700 48px Andika';const a=c.measureText('brother daughter').width;
 c.font='700 48px sans-serif';const s=c.measureText('brother daughter').width;
 return{ok:document.fonts.check('700 48px Andika')&&document.fonts.check('400 48px Andika'),d:Math.abs(a-s)}});

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

 await p.click('#unlock');await p.waitForTimeout(250);
 s=await snap();acts++;chk(s,'解鎖：');
 if(s.lockedAll)e.push('解鎖：按了「提前作答」選項還是鎖著');

 await p.click('.opt');await p.waitForTimeout(600);
 s=await snap();acts++;chk(s,'作答：');
 if(!s.lockedAll)e.push('作答：作答後選項沒有全部鎖住');
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
  const p=await ctx.newPage();await p.goto('file://'+DIR+f);await p.waitForTimeout(400);
  const e=[];
  const font=await fontOk(p);
  if(!font.ok||font.d<0.5)e.push('Andika 未生效');
  const kind=await p.evaluate(()=>document.getElementById('dots')?'scene':
   (document.getElementById('go')?'quiz':'unknown'));
  if(kind==='unknown')e.push('頁型不明（沒有 #dots 也沒有 #go）');
  else acts+=await (kind==='scene'?scenePage:quizPage)(p,f,vp,e);
  if(e.length)bad.push(f+' @'+vp.n+'：'+e.join('；'));
  await p.close();
 }
 await ctx.close();
}
await b.close();
if(bad.length){console.log(bad.join('\n'));console.log('=== 失敗 '+bad.length+' 項');process.exit(1)}
console.log('=== 全部通過：'+FILES.length+' 頁 × '+VPS.length+' 尺寸 × 共 '+acts+' 個檢查點');
})();
