const { chromium } = require('/opt/node22/lib/node_modules/playwright'); const path=require('path');
/* g3mid/_verify_duo.js — 👥 兩人 一台（2026-10-29 第三十三次 第 4 件）量測：node g3mid/_verify_duo.js
 * 三年級 x25、四年級 n25：第 2 個 人 登入 ➜ 一人 一題 輪流（甲 乙 甲 乙…）➜ 兩個 人 各 一筆 成績（自己 的 號碼）➜ 結束 頁 兩個 人 的 分數。假 伺服器，不送 真的 成績。 */
const ROOT=require('path').join(__dirname,'..');const E=[];let n=0;
async function one(SITE,SET){const br=await chromium.launch();const ctx=await br.newContext({viewport:{width:1024,height:768}});await ctx.route(/^https?:\/\//,r=>r.abort());
await ctx.route(/script\.test/,r=>r.fulfill({contentType:'application/json',body:'{"ok":true,"dup":[]}'}));
const ID=SITE==='g3mid'?'30401':'40201';
await ctx.addInitScript(ID=>{window.__NOTUT=1;window.__NOUNLOCK=1;window.__NOWB=1;Object.defineProperty(window,'SCORE_URL',{get:()=>'https://script.test/exec',set:()=>{}});localStorage.setItem('score_last','"'+ID+'"');localStorage.setItem('score_id_g'+ID[0],'"'+ID+'"');localStorage.setItem('score_act',String(Date.now()));sessionStorage.setItem('sc_ok',ID);
 window.__DCLK=0.05;window.__DCLMIN=0;window.__NOGO=1;window.__G2CALM=1;HTMLMediaElement.prototype.play=function(){const a=this;setTimeout(()=>a.onended&&a.onended(),60);return Promise.resolve()}},ID);
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join(' ')));await p.goto('file://'+path.join(ROOT,SITE,'index.html'));await p.waitForTimeout(500);
await p.evaluate((SET)=>{LDB.set=LDB.must=LDB.patch=()=>Promise.resolve(true);CR={room:SET[0]==='x'&&false?'':'0'+(location.pathname.indexOf('g3mid')>=0?'304':'402'),t:1,cfg:{on:1,t:1,set:SET,gs:[],m:'self'},acc:{},n:0,ok:0,q:-9,rd:{}};typeof hub==='function'?hub():lobby()},SET);
await p.waitForTimeout(300);await p.click('[data-duo="1"]');await p.waitForTimeout(100);
await p.click(SITE==='g3mid'?'#xrow .xb[data-x]:not([style*="none"])':'.xrow .xb');await p.waitForTimeout(2000);
const id2=SITE==='g3mid'?'30402':'40202';for(const k of id2.split('').concat(['ok'])){await p.click('[data-k="'+k+'"]').catch(()=>{});await p.waitForTimeout(120)}
await p.waitForTimeout(2500);
let st=await p.evaluate(()=>({duo:!!DUO,ids:DUO&&DUO.id,cur:DUO&&DUO.cur,scid:SCID}));n++;if(!st.duo||st.ids.join()!==(SITE==='g3mid'?'30401,30402':'40201,40202'))E.push(SITE+' 第 2 個 人 登入 失敗 '+JSON.stringify(st));
const turns=[];let guard=0;
while(guard++<400){const s=await p.evaluate(()=>({duo:!!DUO,cur:DUO?DUO.cur:-1,k:R&&R.k,id:(typeof G!=='undefined'&&G&&R.x&&!R.g?G.id:R&&R.g?R.g.id:G&&G.id),dcl:document.getElementById('dcl').classList.contains('on'),db:document.getElementById('duob').classList.contains('on'),scid:SCID}));
 if(!s.duo)break; if(s.db){await p.waitForTimeout(200);continue} if(s.dcl){await p.waitForSelector('#dlgo,#dlsk',{timeout:20000}).catch(()=>{});await p.click('#dlgo,#dlsk').catch(()=>{});await p.waitForTimeout(300);continue}
 const wp=await p.$('#wp.on [data-wr]');if(wp){await wp.click();await p.waitForTimeout(300);continue}   /* 擂台 第一次 先 選 戰士 */
 turns.push(s.cur+':'+s.scid.slice(-1));
 await p.waitForTimeout(700);
 // cheat-answer correctly via internal state
 const did=await p.evaluate(()=>{try{if(typeof good==='function'){if(BUSY)return 'busy';good(document.body);return 'g'}else{if(R.lock)return 'busy';pick(0);return 'p'}}catch(e){return 'err '+e.message}});
 await p.waitForTimeout(600);await p.waitForFunction(()=>!DUO||document.getElementById('duob').classList.contains('on')||(typeof good==='function'?!BUSY:!(R&&R.lock)),null,{timeout:12000}).catch(()=>{});   /* 2026-10-30 第三十四次：答對 先 唸完 正確 答案 才 下一題 ➜ 等 下一題 出現 */
}
n++;if(turns.length!==50||turns.some((t,i)=>+t[0]!==i%2))E.push(SITE+' 沒有 一人 一題 輪流：'+turns.join(' '));
const end=await p.evaluate(()=>document.body.innerText.match(/👥 兩個人 輪流[\s\S]{0,200}/));n++;if(!end||(end[0].match(/記進 成績 了/g)||[]).length!==2)E.push(SITE+' 結束 頁 沒有 兩個 人：'+(end&&end[0].slice(0,80)));
const rq=await p.evaluate(()=>JSON.parse(localStorage.getItem('score_q')||'[]').concat(JSON.parse(localStorage.getItem('score_sent')||'[]')).map(x=>x.id+':'+x.set+':'+x.qs.length));n++;const want=SITE==='g3mid'?['30401','30402']:['40201','40202'];if(want.some(id=>!rq.some(x=>x.indexOf(id+':')===0&&/:25$/.test(x))))E.push(SITE+' 兩個 人 沒有 各 記 一筆：'+rq.join(' '));
 n++;if(errs.length)E.push(SITE+' 程式 錯誤 '+errs.slice(0,2).join('｜'));await br.close()}
(async()=>{await one('g3mid','x25');await one('midterm','n25');E.forEach(e=>console.log('✗ '+e));console.log((E.length?'❌':'✅')+' 兩人 一台：'+n+' 項，'+E.length+' 個 失敗');process.exit(E.length?1:0)})();
