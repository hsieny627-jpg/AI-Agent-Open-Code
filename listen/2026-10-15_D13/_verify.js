// 量測 D13：5 種尺寸；字 ≧ 20px、不超出右邊、每一條都有「現在 ➜ 建議改成」
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());let fail=0,n=0;
for(const [w,hh] of [[390,844],[768,1024],[1024,768],[1366,1024],[1920,1080]]){const p=await b.newPage({viewport:{width:w,height:hh}});
await p.goto('file://'+require('path').resolve(process.argv[2]));await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const o={ov:document.documentElement.scrollWidth-innerWidth,small:[]};
document.querySelectorAll('body *').forEach(e=>{const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).length;if(!t)return;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<20)o.small.push(e.tagName+fs+':'+e.textContent.slice(0,20))});
document.querySelectorAll('.row,.q,table').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>innerWidth+1)o.small.push('超出右邊 '+e.className)});
o.rows=[...document.querySelectorAll('.row')].filter(x=>x.querySelector('.now')&&x.querySelector('.new')).length;return o});
n+=3;if(r.ov>0||r.small.length){fail++;console.log(w,'字太小或超出',r.ov,r.small.slice(0,5))}
if(r.rows<15){fail++;console.log(w,'條數不對',r.rows)}
await p.close()}
console.log('量測',n,'項，失敗',fail);await b.close()})();
