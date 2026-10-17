// 量測 C9：5 種尺寸；字 ≧ 20px（動畫裡 ≧ 16px）、不超出右邊、沒有 JS 錯誤、每一題有建議、圖全部載得到；練習報告甲、乙演完：5 行都出來、蓋章、最後兩行、字不超出
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();let fail=0,n=0;const F=(w,m,x)=>{fail++;console.log(w,m,x||'')};
for(const [w,hh] of [[390,844],[768,1024],[820,1180],[1024,768],[1920,1080]]){const p=await b.newPage({viewport:{width:w,height:hh}});const er=[];p.on('pageerror',e=>er.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname+'/index.html'));await p.waitForTimeout(6000);
for(const k of [0,1]){if(k){await p.click('#swR [data-r="1"]');await p.waitForTimeout(6800)}n++;
 const r=await p.evaluate(k=>{const s=document.getElementById('sR'),S=s.getBoundingClientRect(),o={};
  o.rows=k?s.querySelectorAll('.stn.on').length:s.querySelectorAll('.rr.on.st').length;o.sum=!!s.querySelector('.rs.on');
  o.ov=[].filter.call(s.querySelectorAll('.rr,.stn,.rs div,.rt'),x=>{const r=x.getBoundingClientRect();return r.left<S.left-1||r.right>S.right+1}).map(x=>x.className+':'+x.textContent.slice(0,10));
  o.small=[].filter.call(s.querySelectorAll('*'),x=>[...x.childNodes].some(c=>c.nodeType===3&&c.textContent.trim())&&x.getBoundingClientRect().width&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent.slice(0,10));
  if(k){const st=[...s.querySelectorAll('.stn')].map(x=>x.getBoundingClientRect());o.hit=0;for(let i=0;i<st.length;i++)for(let j=i+1;j<st.length;j++){const a=st[i],c=st[j];if(a.left<c.right-2&&c.left<a.right-2&&a.top<c.bottom-2&&c.top<a.bottom-2)o.hit++}}
  return o},k);
 if(r.rows!==5||!r.sum||r.ov.length||r.small.length||r.hit)F(w,'練習報告 '+(k?'乙':'甲'),r)}
const im=await p.evaluate(()=>[...document.querySelectorAll('img')].filter(x=>x.naturalWidth===0).map(x=>x.alt));
if(im.length)F(w,'圖載不到',im);
n++;const r=await p.evaluate(()=>{const o={ov:document.documentElement.scrollWidth-innerWidth,small:[]};
document.querySelectorAll('body *').forEach(e=>{if(e.closest('script,style,svg,.stage'))return;const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).length;if(!t||!e.getBoundingClientRect().width)return;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<20)o.small.push(fs+':'+e.textContent.slice(0,16))});
document.querySelectorAll('.q,.opt,table,.stage,.gal,.mock,.shop').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>innerWidth+1)o.small.push('超出右邊 '+e.className+e.tagName)});
o.q=[...document.querySelectorAll('.q')].filter(q=>!q.querySelector('.opt.rec')).length;return o});
if(r.ov>0||r.small.length)F(w,'太小／超出',[r.ov,r.small.slice(0,5)]);
if(r.q)F(w,'有一題沒有建議',r.q);
if(er.length)F(w,'JS 錯誤',er);await p.close()}
console.log('量測',n,'項，失敗',fail);await b.close();process.exit(fail?1:0)})();
