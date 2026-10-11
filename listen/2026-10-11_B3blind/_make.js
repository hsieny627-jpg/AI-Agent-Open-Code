// 盲聽比較頁（B3）。聲音代號只寫在 sentences/2026-10-11_B3_需求與問題.md，頁面上不寫名字。
// 以後加雲端聲音：做好 3f_*.mp3、3m_*.mp3，把 V 改成 [1,2,3] 再跑一次。
const fs=require('fs');const V=[1,2];
const L=[['w1','basketball'],['w2','strawberries'],['w3','grandmother'],['w4','three'],['w5','taekwondo'],['w6','ice cream'],['w7','Pokémon cards'],
['s1','I like to play basketball.'],['s2','He’s my father.'],['s3','Is she a nurse?'],['s4','What’s your name?'],['s5','I like Pokémon cards.'],['s6','I’m ten years old.']];
const C=['','#FFD6E5','#CFE6FF','#D9F7C8'];
const row=(g,k)=>V.map(v=>`<button style="background:${C[v]}" data-a="${v}${g}_${k}.mp3">▶ 聲音 ${v}</button>`).join('');
const h=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>盲聽比較</title><style>
@font-face{font-family:Andika;src:url(../../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark}body{margin:0;background:#05070A;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 80px;font-size:26px;line-height:1.5}
h1{font-size:36px;color:#FFD54A;margin:18px 0 6px}h2{font-size:32px;color:#FFD54A;margin:30px 0 4px;border-top:3px solid #24303C;padding-top:14px}
.row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 0;border-bottom:2px dashed #2A3540}
.no{font-size:28px;font-weight:700;color:#7FD4FF;min-width:1.6em}.en{font-size:38px;font-weight:700;flex:1;min-width:8em}
button{font:inherit;font-size:28px;font-weight:700;min-height:60px;padding:0 22px;border-radius:16px;border:3px solid #3A4650;color:#111;cursor:pointer}
button.on{outline:6px solid #FFD54A}
table{border-collapse:collapse;margin:10px 0}td,th{border:2px solid #2A3540;padding:8px 14px}
</style></head><body><h1>盲聽比較：哪一個聲音最好？</h1>
<p>每一句都有 <b>${V.length} 個聲音</b>，頁面上<b>不寫名字</b>。同一個號碼一直是同一套聲音。<br>
請比：<b>標準、道地、自然、清楚</b>。最後回覆例如「女聲選 1、男聲選 2」，也可以寫哪幾號唸得不好。</p>
<h2>👧 女聲</h2>${L.map((r,n)=>`<div class="row"><span class="no">${n+1}</span><span class="en">${r[1]}</span>${row('f',r[0])}</div>`).join('')}
<h2>👦 男聲</h2>${L.map((r,n)=>`<div class="row"><span class="no">${n+1}</span><span class="en">${r[1]}</span>${row('m',r[0])}</div>`).join('')}
<h2>請回覆</h2><table><tr><th>女聲選哪一個？</th><td>聲音 ${V.join('／')}</td></tr><tr><th>男聲選哪一個？</th><td>聲音 ${V.join('／')}</td></tr><tr><th>哪幾號不好？</th><td>例：男聲 5 號 taekwondo 怪怪的</td></tr></table>
<script>var A=new Audio(),B=null;document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
if(B)B.classList.remove('on');B=b;b.classList.add('on');A.pause();A.src=b.getAttribute('data-a');A.play();A.onended=function(){b.classList.remove('on')}});</script>
</body></html>`;
fs.writeFileSync(__dirname+'/index.html',h);
