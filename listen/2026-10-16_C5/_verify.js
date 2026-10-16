// 量測 C5「老師再對一次」頁：5 種尺寸；字 ≧ 20px、不超出右邊、沒有 JS 錯誤；建議（綠框）每一題都有
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();let fail=0,n=0;const F=(w,m,x)=>{fail++;console.log(w,m,x||'')};
for(const [w,hh] of [[390,844],[768,1024],[1024,768],[1366,1024],[1920,1080]]){const p=await b.newPage({viewport:{width:w,height:hh}});const er=[];p.on('pageerror',e=>er.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname+'/index.html'));await p.waitForTimeout(400);
n++;const r=await p.evaluate(()=>{const o={ov:document.documentElement.scrollWidth-innerWidth,small:[],rec:0};
document.querySelectorAll('body *').forEach(e=>{if(e.closest('script,style,svg'))return;const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).length;if(!t||!e.getBoundingClientRect().width)return;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<20)o.small.push(fs+':'+e.textContent.slice(0,16))});
document.querySelectorAll('.q,.opt,table,.card3,.box').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>innerWidth+1)o.small.push('超出右邊 '+e.className+e.tagName)});
o.q=[...document.querySelectorAll('.q')].filter(q=>!q.querySelector('.opt.rec')&&!q.querySelector('table')).length;return o});
if(r.ov>0||r.small.length)F(w,'太小／超出',[r.ov,r.small.slice(0,5)]);
if(r.q)F(w,'有一題沒有建議',r.q);
if(er.length)F(w,'JS 錯誤',er);await p.close()}
console.log('量測',n,'項，失敗',fail);await b.close();process.exit(fail?1:0)})();
