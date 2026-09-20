/* words/_verify_talk.js — 只量一件事：小組討論的鎖，到底鎖幾秒
 *
 * 用法： node words/_verify_talk.js                  （量 quiz-demo.html 第 1 題，期望 20 秒）
 *        node words/_verify_talk.js quiz.html        （量正式版第 1 題）
 *        node words/_verify_talk.js quiz.html --q 1,2,20   （**抽題實測**，約 1.5 分鐘）
 *        node words/_verify_talk.js quiz.html --all        （20 題全部，約 7 分鐘）
 *        node words/_verify_talk.js 12               （改規格時，換期望秒數）
 *
 * _verify.js 只量「一開始有沒有鎖住、按提前作答有沒有解鎖」，
 * 量不到「自己等會等幾秒」。改 TALK 的時候要用這一支確認真的是那個秒數。
 *
 * 每一題量八件事：
 *   1. 出題當下倒數從總秒數重新開始（上一題不可以吃掉這一題的時間）
 *   2. 出題當下選項是鎖住的
 *   3. 螢幕上那句話寫的秒數 ＝ 期望秒數（老師唸得出來的那個數字）
 *   4. 自動解鎖時，倒數秒數 ＝ 總秒數 − 討論秒數
 *   5. 解鎖前一秒仍然是鎖住的（不可以早一秒放行）
 *   6. 真實經過時間 ≈ 期望秒數（容許 ±2 秒，setInterval 本來就會飄）
 *   7. 解鎖後提示改成「可以作答了」、「提前作答」按鈕收起來、lock 樣式拿掉
 *   8. 解鎖後選項真的按得下去（有判對錯、出現「下一題」）
 *
 * 秒數是全域變數 TALK，20 題共用同一段程式碼，所以**抽題就夠**：
 * `--q 1,2,20` 量頭兩題與最後一題，沒抽到的題目按「提前作答」直接跳過（不等滿秒數），
 * 這樣仍然走完 20 題的流程，抓得到「按下一題後倒數沒有重來」這種跨題的錯。
 * 逐題印一行「解鎖倒數／真實秒數」，最後一行總結。只印量到的數字與失敗項。
 */
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const DIR=__dirname+'/';
const args=process.argv.slice(2);
const FILE=args.find(a=>a.endsWith('.html'))||'quiz-demo.html';
const WANT=+(args.find(a=>/^\d+$/.test(a))||20);
const ALL=args.includes('--all');
const QI=args.indexOf('--q');
const PICK=QI>=0&&args[QI+1]?args[QI+1].split(',').map(Number):null;  /* 只量這幾題 */

const SNAP=()=>{
 const opts=[...document.querySelectorAll('.opt')];
 const t=document.getElementById('talk'),o=document.getElementById('opts');
 return{SEC:window.SEC,TALK:window.TALK,N:window.Q.length,
  qn:+document.getElementById('qn').textContent,
  secs:+document.getElementById('secs').textContent,
  locked:opts.length>0&&opts.every(b=>b.disabled),
  nOpt:opts.length,
  lockClass:!!(o&&o.classList.contains('lock')),
  talk:t?t.textContent:'',
  unlockHidden:document.getElementById('unlock').classList.contains('hide')};
};

(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1024,height:768},offline:true});
 const p=await ctx.newPage();
 await p.goto('file://'+DIR+FILE);await p.waitForTimeout(400);
 const snap=()=>p.evaluate(SNAP);

 const e=[],rows=[];
 await p.click('#go');await p.waitForTimeout(120);

 const TOTAL=(await snap()).N;
 const N=(ALL||PICK)?TOTAL:1;
 const mine=q=>PICK?PICK.includes(q):true;
 let measured=0;

 for(let q=1;q<=N;q++){
  if(!mine(q)){                      /* 沒抽到：按「提前作答」跳過，不等滿秒數 */
   const s=await snap();
   if(s.qn!==q)e.push('第 '+q+' 題：題號顯示 '+s.qn+'，應該是 '+q);
   if(s.secs!==s.SEC)e.push('第 '+q+' 題：出題當下倒數是 '+s.secs+' 秒，沒有從 '+s.SEC+' 秒重新開始');
   if(!s.locked)e.push('第 '+q+' 題：出題當下選項沒有鎖住');
   await p.click('#unlock');await p.waitForTimeout(150);
   await p.click('.opt');await p.waitForTimeout(200);
   if(q<N){await p.click('#next');await p.waitForTimeout(250)}
   continue;
  }
  const t0=Date.now();          /* 這一題出題的時間點 */
  const s0=await snap();
  const tag='第 '+q+' 題：';

  if(s0.qn!==q)e.push(tag+'題號顯示 '+s0.qn+'，應該是 '+q);
  if(s0.TALK!==WANT)e.push(tag+'程式裡的 TALK ＝ '+s0.TALK+'，不是 '+WANT);
  if(s0.secs!==s0.SEC)e.push(tag+'出題當下倒數是 '+s0.secs+' 秒，沒有從 '+s0.SEC+' 秒重新開始');
  if(s0.nOpt!==4)e.push(tag+'選項不是 4 個（'+s0.nOpt+'）');
  if(!s0.locked||!s0.lockClass)e.push(tag+'出題當下選項沒有鎖住');
  if(!s0.talk.includes(WANT+' 秒'))e.push(tag+'畫面上寫的不是「'+WANT+' 秒後開放作答」：'+s0.talk.trim());

  /* 等自動解鎖，順手記下「還鎖著」的最後一個秒數 */
  let lastLocked=s0.secs,hit=null;
  for(let k=0;k<(WANT+15)*7;k++){
   const s=await snap();
   if(s.locked&&s.secs<lastLocked)lastLocked=s.secs;
   if(!s.locked){hit={s,ms:Date.now()-t0};break}
   await p.waitForTimeout(150);
  }

  if(!hit){e.push(tag+'等了 '+(WANT+15)+' 秒還是沒有自動解鎖');break}

  const want=hit.s.SEC-WANT, sec=hit.ms/1000;
  if(hit.s.secs!==want)e.push(tag+'解鎖時倒數是 '+hit.s.secs+' 秒，應該是 '+want+' 秒（'+hit.s.SEC+'−'+WANT+'）');
  if(lastLocked!==want+1)e.push(tag+'解鎖前最後鎖住的秒數是 '+lastLocked+'，應該是 '+(want+1));
  if(Math.abs(sec-WANT)>2)e.push(tag+'真實等待 '+sec.toFixed(1)+' 秒，偏離 '+WANT+' 秒超過 2 秒');
  if(hit.s.lockClass)e.push(tag+'解鎖了但 #opts 還留著 lock');
  if(!hit.s.talk.includes('可以作答'))e.push(tag+'解鎖後提示沒改成「可以作答了」：'+hit.s.talk.trim());
  if(!hit.s.unlockHidden)e.push(tag+'解鎖後「提前作答」按鈕沒有收起來');

  /* 真的按一下，確認選項活了；再進下一題 */
  await p.click('.opt');await p.waitForTimeout(250);
  const done=await p.evaluate(()=>({
   answered:[...document.querySelectorAll('.opt')].some(b=>b.classList.contains('right')||b.classList.contains('wrong')),
   next:!document.getElementById('next').classList.contains('hide')}));
  if(!done.answered)e.push(tag+'解鎖後按選項沒有反應（沒判對錯）');
  if(!done.next)e.push(tag+'作答後沒有出現「下一題」');

  measured++;
  rows.push('  第 '+String(q).padStart(2)+' 題　解鎖倒數 '+hit.s.secs+' 秒　真實等待 '+sec.toFixed(1)+' 秒　解鎖前最後鎖住 '+lastLocked+' 秒');
  console.log(rows[rows.length-1]);

  if(q<N){await p.click('#next');await p.waitForTimeout(300)}
 }

 await b.close();
 if(e.length){console.log('=== '+FILE+' 失敗 '+e.length+' 項');e.forEach(x=>console.log('  ✗ '+x));process.exit(1)}
 console.log('=== 全部通過：'+FILE+' 走完 '+N+' 題，實測 '+measured+' 題的小組討論鎖都是 '+WANT+' 秒'
  +(PICK?'（抽第 '+PICK.join('、')+' 題實測，其餘按「提前作答」跳過，仍檢查題號與倒數重置）':'')
  +'　共 '+(measured*10+(N-measured)*3)+' 個檢查點');
})();
