// 量測這一頁：5 種尺寸；字 ≧ 20px、不超出右邊、沒有 JS 錯誤、每一題有建議；角色圖全部載得到；愛心兩種、頒獎典禮 10 種都演一次（1024 演完再量）
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();let fail=0,n=0;const F=(w,m,x)=>{fail++;console.log(w,m,x||'')};
for(const [w,hh] of [[390,844],[768,1024],[1024,768],[1366,1024],[1920,1080]]){const p=await b.newPage({viewport:{width:w,height:hh}});const er=[];p.on('pageerror',e=>er.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname+'/index.html'));await p.waitForTimeout(400);
for(const s of ['#swH [data-h="1"]','#swH [data-h="0"]']){await p.click(s);await p.waitForTimeout(w===1024?5200:300)}
if(w===1024){const h=await p.evaluate(()=>({b:document.querySelectorAll('#sH .hc.on .tg').length,s:!!document.querySelector('#sH .hsum.on'),t:document.querySelector('#sH .hsum').textContent}));n++;
 if(h.b<4||!h.s||!/最棒/.test(h.t)||!/下次加強：看完聽完/.test(h.t))F(w,'愛心沒有看出最好／加強',h)}
for(let k=0;k<10;k++){await p.click('#swC [data-c="'+k+'"]');await p.waitForTimeout(w===1024?9300:150);
 if(w===1024){n++;const c=await p.evaluate(()=>{const st=document.getElementById('cst'),S=st.getBoundingClientRect(),H=r=>st.querySelector('.cp.p'+r+' .cb').getBoundingClientRect().height;
  const ov=[].filter.call(st.querySelectorAll('.ribbon,.sub,.cls,.say,.cp .ct,.cp .cb'),x=>{const r=x.getBoundingClientRect();return r.left<S.left-1||r.right>S.right+1||r.bottom>S.bottom+1||r.top<S.top-1}).map(x=>x.className);
  const op=[].filter.call(st.querySelectorAll('.cp .ct,.cp .cb'),x=>+getComputedStyle(x).opacity<.95).length;
  return {h:[H(1),H(2),H(3)],ov,op,hit:st.querySelector('.say').getBoundingClientRect().bottom>Math.min.apply(null,[].map.call(st.querySelectorAll('.cp .ct'),x=>x.getBoundingClientRect().top))+2}});
  if(c.ov.length||c.op||c.hit||c.h[0]<c.h[1]*1.8||c.h[0]<c.h[2]*3)F(w,'頒獎典禮 '+(k+1),c)}}
const im=await p.evaluate(()=>[...document.querySelectorAll('img')].filter(x=>x.complete&&x.getAttribute("src")&&x.naturalWidth===0).length);
await p.click('#swG [data-g="g"]');await p.waitForTimeout(600);await p.click('.gal .hero');await p.waitForTimeout(300);
const im2=await p.evaluate(()=>[...document.querySelectorAll('.gal img')].filter(x=>x.naturalWidth===0).map(x=>x.alt));
if(im||im2.length)F(w,'角色圖載不到',[im,im2]);
n++;const r=await p.evaluate(()=>{const o={ov:document.documentElement.scrollWidth-innerWidth,small:[]};
document.querySelectorAll('body *').forEach(e=>{if(e.closest('script,style,svg,.stage,.hero'))return;const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).length;if(!t||!e.getBoundingClientRect().width)return;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<20)o.small.push(fs+':'+e.textContent.slice(0,16))});
document.querySelectorAll('.stage *').forEach(e=>{if(e.closest('svg'))return;const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).length;if(!t||!e.getBoundingClientRect().width||+getComputedStyle(e).opacity<.5)return;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<16)o.small.push('動畫裡 '+fs+':'+e.textContent.slice(0,12))});
document.querySelectorAll('.q,.opt,table,.stage,.gal,.show').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>innerWidth+1)o.small.push('超出右邊 '+e.className+e.tagName)});
o.q=[...document.querySelectorAll('.q')].filter(q=>!q.querySelector('.opt.rec')).length;return o});
if(r.ov>0||r.small.length)F(w,'太小／超出',[r.ov,r.small.slice(0,5)]);
if(r.q)F(w,'有一題沒有建議',r.q);
if(er.length)F(w,'JS 錯誤',er);await p.close()}
console.log('量測',n,'項，失敗',fail);await b.close();process.exit(fail?1:0)})();
