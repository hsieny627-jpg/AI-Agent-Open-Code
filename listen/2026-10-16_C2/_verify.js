// 量測 C2「小華再對一次」頁：5 種尺寸；字 ≧ 20px（真的「原本」動畫除外，它在 score/_verify.js 量）、不超出右邊、沒有 JS 錯誤；
// 第 18 題 6 種主題每一種演完：92、五項都在、💡 那一句、最後一句；第 16 題三顆按鈕各演一次
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();let fail=0,n=0;const F=(w,m,x)=>{fail++;console.log(w,m,x||'')};
for(const [w,hh] of [[390,844],[768,1024],[1024,768],[1366,1024],[1920,1080]]){const p=await b.newPage({viewport:{width:w,height:hh}});const er=[];p.on('pageerror',e=>er.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname+'/index.html'));await p.waitForTimeout(800);
for(let k=0;k<6;k++){await p.click('#sw18 button[data-k="'+k+'"]');await p.waitForTimeout(5600);n++;
 const r=await p.evaluate(()=>{const s=document.getElementById('ts'),R=s.getBoundingClientRect(),t=s.innerText,o=[];
  const dv=s.querySelector('.dgs');if(dv){const c=[...dv.querySelectorAll('.col')].map(x=>{const m=new DOMMatrix(getComputedStyle(x).transform),h=x.firstChild.getBoundingClientRect().height;return Math.round(-m.m42/h)%10}).join('');if(c!=='92')o.push('大螢幕轉到 '+c)}else if(!/92/.test(t))o.push('沒有 92');if(!/看完、聽完/.test(t))o.push('沒有 💡');if(!/老師 看見了/.test(t)&&!s.querySelector('.sig'))o.push('沒有最後一句');
  s.querySelectorAll('.ic').forEach(e=>{const q=e.getBoundingClientRect();if(q.right>R.right+1||q.left<R.left-1||q.bottom>R.bottom+1)o.push('圖示跑出舞台')});
  const ics=s.querySelectorAll('.ic').length;if(ics<5)o.push('五項不夠 '+ics);
  s.querySelectorAll('.tip,.seen').forEach(e=>{if(getComputedStyle(e).display==='none')return;const q=e.getBoundingClientRect();if(q.width&&(q.right>R.right+1||q.left<R.left-1))o.push('字跑出舞台')});return o});
 if(r.length)F(w,'主題 '+(k+1),r)}
for(const m of ['A','O','B']){await p.click('#sw16 button[data-m="'+m+'"]');await p.waitForTimeout(m==='O'?6200:2600);n++;
 const r=await p.evaluate(m=>{const e=document.getElementById('m16');if(m==='A')return document.getElementById('nA').textContent==='92'&&/看完/.test(e.innerText);
  if(m==='O')return e.querySelectorAll('.chc').length===5&&/92/.test(e.querySelector('.cn').textContent);return e.querySelectorAll('.h5').length===5&&/看完/.test(e.innerText)},m);
 if(!r)F(w,'16 切換沒演完',m)}
n++;const r=await p.evaluate(()=>{const o={ov:document.documentElement.scrollWidth-innerWidth,small:[]};
document.querySelectorAll('body *').forEach(e=>{if(e.closest('script,style,[data-real]'))return;const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).length;if(!t||!e.getBoundingClientRect().width)return;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<20)o.small.push(fs+':'+e.textContent.slice(0,16))});
document.querySelectorAll('.mock,.opt,.q,table,.ts').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>innerWidth+1)o.small.push('超出右邊 '+e.className+e.tagName)});return o});
if(r.ov>0||r.small.length)F(w,'太小／超出',[r.ov,r.small.slice(0,5)]);
if(er.length)F(w,'JS 錯誤',er);
await p.close()}
console.log('量測',n,'項，失敗',fail);await b.close();process.exit(fail?1:0)})();
