// 量測 C10：4 種尺寸；字 ≧ 20px（圖下面的小字 ≧ 18px）、不左右捲、沒有 JS 錯誤、每一題有建議、圖和語音檔都找得到
const fs=require('fs'),path=require('path');const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();let fail=0,n=0;const F=m=>{fail++;console.log('✗ '+m)};
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
[...html.matchAll(/data-au="([^"]+)"/g)].forEach(m=>{n++;if(!fs.existsSync(path.join(__dirname,m[1])))F('找不到語音檔 '+m[1])});
for(const [w,h] of [[390,844],[820,1180],[1024,768],[1920,1080]]){const p=await b.newPage({viewport:{width:w,height:h}});const er=[];p.on('pageerror',e=>er.push(e.message));
 await p.goto('file://'+path.join(__dirname,'index.html'));await p.evaluate(()=>document.querySelectorAll('img').forEach(i=>i.loading='eager'));await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>({ox:document.documentElement.scrollWidth-innerWidth,
  sm:[].filter.call(document.querySelectorAll('body *'),x=>[...x.childNodes].some(c=>c.nodeType===3&&c.textContent.trim())&&x.getBoundingClientRect().width&&parseFloat(getComputedStyle(x).fontSize)<(x.closest('figcaption,small')?18:20)).map(x=>x.textContent.trim().slice(0,10)),
  bad:[].filter.call(document.querySelectorAll('img'),i=>!i.naturalWidth).length,q:document.querySelectorAll('.q').length,rec:document.querySelectorAll('.q .opt.rec').length}));
 n+=5;if(r.ox>1)F(w+' 左右捲 '+r.ox);if(r.sm.length)F(w+' 字太小 '+r.sm.slice(0,3).join('、'));if(r.bad)F(w+' 圖載不到 '+r.bad);if(r.q!==4||r.rec!==4)F(w+' 題目或建議不對');if(er.length)F(w+' JS 錯誤 '+er[0]);await p.close()}
await b.close();console.log('C10 量測 '+n+' 項，'+fail+' 個失敗');process.exit(fail?1:0)})();
