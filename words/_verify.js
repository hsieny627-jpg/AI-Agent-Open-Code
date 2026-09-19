/* words/_verify.js — 逐頁量測，不用目視，不用截圖
 *
 * 用法： node words/_verify.js              （量 words/ 底下全部 .html）
 *        node words/_verify.js son.html     （只量指定的頁，改一句文案時用這個）
 *        node words/_verify.js --text son.html   （順便印出每一幕的文字）
 *
 * 檢查項（對應 words/CLAUDE.md 的「驗證」）：
 *   1024×768 與 820×1180 兩種尺寸，offline:true 開檔
 *   - Andika 有載到（measureText 與 sans-serif 不同）
 *   - 每一幕：進度點對應、無橫向／縱向溢出、內容沒有被左右箭頭壓到
 *   - 首幕 ← 停用、末幕 → 停用
 *   - 停 6 秒不可自動換頁
 * 只印失敗項與一行總結（印全部量測資料很貴）。
 */
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'),DIR=__dirname+'/';
const args=process.argv.slice(2);
const showText=args.includes('--text');
const files=args.filter(a=>a!=='--text');
const FILES=files.length?files:fs.readdirSync(DIR).filter(f=>f.endsWith('.html')).sort();
const VPS=[{n:'1024x768',width:1024,height:768},{n:'820x1180',width:820,height:1180}];

(async()=>{
const b=await chromium.launch();const bad=[];let acts=0;
for(const vp of VPS){
 const ctx=await b.newContext({viewport:{width:vp.width,height:vp.height},offline:true});
 for(const f of FILES){
  const p=await ctx.newPage();await p.goto('file://'+DIR+f);await p.waitForTimeout(400);
  const e=[];
  const font=await p.evaluate(async()=>{await document.fonts.ready;
   const c=document.createElement('canvas').getContext('2d');
   c.font='700 48px Andika';const a=c.measureText('brother daughter').width;
   c.font='700 48px sans-serif';const s=c.measureText('brother daughter').width;
   return{ok:document.fonts.check('700 48px Andika')&&document.fonts.check('400 48px Andika'),d:Math.abs(a-s)}});
  if(!font.ok||font.d<0.5)e.push('Andika 未生效');
  const snap=()=>p.evaluate(()=>{const de=document.documentElement,st=document.getElementById('stage');
   const navs=[...document.querySelectorAll('.nav')].map(n=>n.getBoundingClientRect());let hit=null;
   for(const el of st.querySelectorAll('*')){const r=el.getBoundingClientRect();if(!r.width)continue;
    for(const n of navs)if(r.left<n.right&&r.right>n.left&&r.top<n.bottom&&r.bottom>n.top)hit=(el.className||el.tagName)+' 壓到箭頭'}
   return{t:st.innerText.replace(/\n+/g,' | '),
    on:[...document.querySelectorAll('#dots i')].findIndex(x=>x.className==='on'),
    n:document.querySelectorAll('#dots i').length,
    pd:document.getElementById('prev').disabled,nd:document.getElementById('next').disabled,
    ox:(de.scrollWidth-de.clientWidth)+(st.scrollWidth-st.clientWidth),
    oy:(de.scrollHeight-de.clientHeight)+(st.scrollHeight-st.clientHeight),h:hit}});
  const first=await snap();const N=first.n;
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
  if(e.length)bad.push(f+' @'+vp.n+'：'+e.join('；'));
  await p.close();
 }
 await ctx.close();
}
await b.close();
if(bad.length){console.log(bad.join('\n'));console.log('=== 失敗 '+bad.length+' 項');process.exit(1)}
console.log('=== 全部通過：'+FILES.length+' 頁 × '+VPS.length+' 尺寸 × 共 '+acts+' 幕');
})();
