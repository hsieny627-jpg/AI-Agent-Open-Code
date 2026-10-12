const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());let fail=0,n=0;
for(const [w,hh] of [[390,844],[768,1024],[1024,768],[1366,1024],[1920,1080]]){const p=await b.newPage({viewport:{width:w,height:hh}});
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const o={ov:document.documentElement.scrollWidth-innerWidth,small:[]};
document.querySelectorAll('body *').forEach(e=>{if(!e.childNodes.length)return;const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).length;if(!t)return;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<20)o.small.push(e.tagName+fs+':'+e.textContent.slice(0,20))});
document.querySelectorAll('.dev,.cert,table,.opt').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>innerWidth+1)o.small.push('超出右邊 '+e.className)});return o});
n+=2;if(r.ov>0){fail++;console.log(w,'橫向捲軸',r.ov)}if(r.small.length){fail++;console.log(w,r.small.slice(0,5))}await p.close()}
console.log('量測',n,'項，失敗',fail);await b.close()})();
