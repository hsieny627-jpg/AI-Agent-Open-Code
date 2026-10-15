// 量測 D12：5 種尺寸；字 ≧ 20px、不超出右邊、兩個動畫跑完（87、愛心裝滿的有 3 顆、最少那一項閃、火箭在上面）
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());let fail=0,n=0;
for(const [w,hh] of [[390,844],[768,1024],[1024,768],[1366,1024],[1920,1080]]){const p=await b.newPage({viewport:{width:w,height:hh}});
await p.goto('file://'+require('path').resolve(process.argv[2]));await p.waitForTimeout(6000);
const r=await p.evaluate(()=>{const o={ov:document.documentElement.scrollWidth-innerWidth,small:[]};
document.querySelectorAll('body *').forEach(e=>{const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).length;if(!t)return;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<20)o.small.push(e.tagName+fs+':'+e.textContent.slice(0,20))});
document.querySelectorAll('.hc,.ch div').forEach(e=>{const r=e.getBoundingClientRect(),d=e.closest('.dev').getBoundingClientRect();if(r.right>d.right-6||r.left<d.left+6)o.small.push('超出平板 '+e.className)});document.querySelectorAll('.dev,.cert,table,.opt,.hc,.rk').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>innerWidth+1)o.small.push('超出右邊 '+e.className)});
const A=document.getElementById('hA');o.a=A.querySelector('.n').textContent;o.full=A.querySelectorAll('.hc.full').length;o.wk=A.querySelectorAll('.hc.wk').length;
const lq=A.querySelectorAll('.lq');o.lq=[...lq].map(l=>Math.round(l.getBoundingClientRect().top-l.closest('svg').getBoundingClientRect().top));
const B=document.getElementById('rkB');o.b=B.querySelector('.n').textContent;o.bot=parseFloat(B.querySelector('.ship').style.bottom);o.tip=document.querySelectorAll('.tipx.on').length;
const hw=A.querySelector('.hc svg').getBoundingClientRect().width;o.hw=hw;return o});
n+=5;
if(r.a!=='87'||r.b!=='87'){fail++;console.log(w,'數字沒到 87',r.a,r.b)}
if(r.full!==2||r.wk!==1||r.tip!==2){fail++;console.log(w,'裝滿／閃／提示不對',r.full,r.wk,r.tip)}
if(!(r.bot>100)){fail++;console.log(w,'火箭沒飛上去',r.bot)}
if(r.hw<44){fail++;console.log(w,'愛心太小',r.hw)}
if(r.ov>0||r.small.length){fail++;console.log(w,'橫向捲軸',r.ov,r.small.slice(0,5))}
await p.close()}
console.log('量測',n,'項，失敗',fail);await b.close()})();
