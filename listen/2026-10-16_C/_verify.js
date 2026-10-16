// 量測 C 組問題頁：5 種尺寸；字 ≧ 20px、不超出右邊、圖片載得到、兩個動畫跑完（87）、沒有 JS 錯誤
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();let fail=0,n=0;
for(const [w,hh] of [[390,844],[768,1024],[1024,768],[1366,1024],[1920,1080]]){const p=await b.newPage({viewport:{width:w,height:hh}});const er=[];p.on('pageerror',e=>er.push(e.message));
await p.goto('file://'+require('path').resolve(process.argv[2]||__dirname+'/index.html'));await p.waitForTimeout(3500);
const r=await p.evaluate(()=>{const o={ov:document.documentElement.scrollWidth-innerWidth,small:[],img:0};
document.querySelectorAll('body *').forEach(e=>{if(e.closest('script,style'))return;const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).length;if(!t||!e.getBoundingClientRect().width)return;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<20)o.small.push(fs+':'+e.textContent.slice(0,16))});
document.querySelectorAll('.mock,.opt,.q,table,img').forEach(e=>{if(e.closest('.mock[style*="overflow-x"]'))return;const r=e.getBoundingClientRect();if(r.right>innerWidth+1)o.small.push('超出右邊 '+e.className+e.tagName)});
document.querySelectorAll('img').forEach(i=>{if(!i.naturalWidth)o.img++});
o.a=document.getElementById('nA').textContent;o.t=[...document.querySelectorAll('#themes .tn')].filter(x=>x.textContent==='87').length;o.on=document.querySelectorAll('#themes .seg.on').length;return o});
n+=5;
if(er.length){fail++;console.log(w,'JS 錯誤',er)}
if(r.img){fail++;console.log(w,'圖片載不到',r.img)}
if(r.a!=='87'||r.t!==10||r.on!==50){fail++;console.log(w,'動畫沒跑完',r.a,r.t,r.on)}
if(r.ov>0||r.small.length){fail++;console.log(w,'太小／超出',r.ov,r.small.slice(0,5))}
await p.close()}
console.log('量測',n*5/5,'項，失敗',fail);await b.close();process.exit(fail?1:0)})();
