// 量測 C3「老師再選一次」頁：5 種尺寸；字 ≧ 20px、不超出右邊、沒有 JS 錯誤；三個男老師圖示畫出來；頒獎典禮四個獎每一個演完（獎盃、班級、一句話都出來、不跑出舞台）
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();let fail=0,n=0;const F=(w,m,x)=>{fail++;console.log(w,m,x||'')};
for(const [w,hh] of [[390,844],[768,1024],[1024,768],[1366,1024],[1920,1080]]){const p=await b.newPage({viewport:{width:w,height:hh}});const er=[];p.on('pageerror',e=>er.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname+'/index.html'));await p.waitForTimeout(500);
n++;const ic=await p.evaluate(()=>[...document.querySelectorAll('svg[data-t]')].map(s=>s.querySelectorAll('path,ellipse,rect').length));if(ic.length!==6||ic.some(x=>x<20))F(w,'男老師圖示沒有畫好',ic);
for(let k=0;k<4;k++){await p.click('#sw4 button[data-k="'+k+'"]');await p.waitForTimeout(4200);n++;
 const r=await p.evaluate(()=>{const s=document.getElementById('stage4'),R=s.getBoundingClientRect(),o=[];
  ['r4','c4','y4','s4'].forEach(id=>{const e=document.getElementById(id),q=e.getBoundingClientRect();if(+getComputedStyle(e).opacity<.9)o.push(id+' 沒有出來');if(q.left<R.left-1||q.right>R.right+1)o.push(id+' 跑出舞台')});
  if(+getComputedStyle(s.querySelector('.cup')).opacity<.9)o.push('獎盃沒有出來');
  const c=document.getElementById('c4').getBoundingClientRect(),y=document.getElementById('y4').getBoundingClientRect();if(c.bottom>y.top+2)o.push('班級壓到那一句');return o});
 if(r.length)F(w,'頒獎 '+(k+1),r)}
n++;const r=await p.evaluate(()=>{const o={ov:document.documentElement.scrollWidth-innerWidth,small:[]};
document.querySelectorAll('body *').forEach(e=>{if(e.closest('script,style,svg'))return;const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).length;if(!t||!e.getBoundingClientRect().width)return;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<20)o.small.push(fs+':'+e.textContent.slice(0,16))});
document.querySelectorAll('.mock,.opt,.q,table,.card3,#stage4,.tch').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>innerWidth+1)o.small.push('超出右邊 '+e.className+e.tagName)});return o});
if(r.ov>0||r.small.length)F(w,'太小／超出',[r.ov,r.small.slice(0,5)]);
if(er.length)F(w,'JS 錯誤',er);
await p.close()}
console.log('量測',n,'項，失敗',fail);await b.close();process.exit(fail?1:0)})();
