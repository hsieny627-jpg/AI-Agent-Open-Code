/* words/_verify_talk.js — 只量一件事：小組討論的鎖，到底鎖幾秒
 *
 * 用法： node words/_verify_talk.js            （預設量 quiz-demo.html，期望 20 秒）
 *        node words/_verify_talk.js quiz.html  （量正式版）
 *        node words/_verify_talk.js 12         （改規格時，換期望秒數）
 *
 * _verify.js 只量「一開始有沒有鎖住、按提前作答有沒有解鎖」，
 * 量不到「自己等會等幾秒」。改 TALK 的時候要用這一支確認真的是那個秒數。
 *
 * 量七件事：
 *   1. 出題當下選項是鎖住的
 *   2. 螢幕上那句話寫的秒數 ＝ 期望秒數（老師唸得出來的那個數字）
 *   3. 自動解鎖時，倒數秒數 ＝ 總秒數 − 討論秒數
 *   4. 解鎖前一秒仍然是鎖住的（不可以早一秒放行）
 *   5. 真實經過時間 ≈ 期望秒數（容許 ±2 秒，setInterval 本來就會飄）
 *   6. 解鎖後四個選項真的按得下去
 *   7. 解鎖後提示改成「可以作答了」、「提前作答」按鈕收起來
 *
 * 只印失敗項與一行總結。
 */
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const DIR=__dirname+'/';
const args=process.argv.slice(2);
const FILE=args.find(a=>a.endsWith('.html'))||'quiz-demo.html';
const WANT=+(args.find(a=>/^\d+$/.test(a))||20);

(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1024,height:768},offline:true});
 const p=await ctx.newPage();
 await p.goto('file://'+DIR+FILE);await p.waitForTimeout(400);

 const snap=()=>p.evaluate(()=>{
  const opts=[...document.querySelectorAll('.opt')];
  const t=document.getElementById('talk'),o=document.getElementById('opts');
  return{SEC:window.SEC,TALK:window.TALK,
   secs:+document.getElementById('secs').textContent,
   locked:opts.length>0&&opts.every(b=>b.disabled),
   lockClass:!!(o&&o.classList.contains('lock')),
   talk:t?t.textContent:'',
   unlockHidden:document.getElementById('unlock').classList.contains('hide')}});

 const e=[];
 await p.click('#go');
 const t0=Date.now();
 await p.waitForTimeout(120);

 const s0=await snap();
 if(s0.TALK!==WANT)e.push('程式裡的 TALK ＝ '+s0.TALK+'，不是 '+WANT);
 if(!s0.locked||!s0.lockClass)e.push('出題當下選項沒有鎖住');
 if(!s0.talk.includes(WANT+' 秒'))e.push('畫面上寫的不是「'+WANT+' 秒後開放作答」：'+s0.talk.trim());

 /* 等自動解鎖，順手記下「還鎖著」的最後一個秒數 */
 let lastLocked=s0.secs,hit=null;
 for(let i=0;i<(WANT+15)*7;i++){
  const s=await snap();
  if(s.locked&&s.secs<lastLocked)lastLocked=s.secs;
  if(!s.locked){hit={s,ms:Date.now()-t0};break}
  await p.waitForTimeout(150);
 }

 if(!hit){e.push('等了 '+(WANT+15)+' 秒還是沒有自動解鎖')}
 else{
  const want=hit.s.SEC-WANT, sec=hit.ms/1000;
  if(hit.s.secs!==want)e.push('解鎖時倒數是 '+hit.s.secs+' 秒，應該是 '+want+' 秒（'+hit.s.SEC+'−'+WANT+'）');
  if(lastLocked!==want+1)e.push('解鎖前最後鎖住的秒數是 '+lastLocked+'，應該是 '+(want+1));
  if(Math.abs(sec-WANT)>2)e.push('真實等待 '+sec.toFixed(1)+' 秒，偏離 '+WANT+' 秒超過 2 秒');
  if(hit.s.lockClass)e.push('解鎖了但 #opts 還留著 lock');
  if(!hit.s.talk.includes('可以作答'))e.push('解鎖後提示沒改成「可以作答了」：'+hit.s.talk.trim());
  if(!hit.s.unlockHidden)e.push('解鎖後「提前作答」按鈕沒有收起來');
  /* 真的按一下，確認選項活了 */
  await p.click('.opt');await p.waitForTimeout(250);
  const done=await p.evaluate(()=>({
   answered:[...document.querySelectorAll('.opt')].some(b=>b.classList.contains('right')||b.classList.contains('wrong')),
   next:!document.getElementById('next').classList.contains('hide')}));
  if(!done.answered)e.push('解鎖後按選項沒有反應（沒判對錯）');
  if(!done.next)e.push('作答後沒有出現「下一題」');
  console.log('　解鎖時倒數 '+hit.s.secs+' 秒｜真實等待 '+sec.toFixed(1)+' 秒｜解鎖前最後鎖住 '+lastLocked+' 秒');
 }

 await b.close();
 if(e.length){console.log('=== '+FILE+' 失敗 '+e.length+' 項');e.forEach(x=>console.log('  ✗ '+x));process.exit(1)}
 console.log('=== 全部通過：'+FILE+' 的小組討論鎖 ＝ '+WANT+' 秒（共 9 個檢查點）');
})();
