// 男聲試聽頁（B3）：女聲 vs 男聲，各 13 個字和句子（tools/tts_gen.py 的 hf，跟全站一樣的做法）
const fs=require('fs');
const L=[['w1','basketball','單字卡的速度'],['w2','strawberries','單字卡的速度'],['w3','grandmother','單字卡的速度'],['w4','three','單字卡的速度'],
['w5','taekwondo','單字卡的速度'],['w6','ice cream','單字卡的速度'],['w7','Pokémon cards','單字卡的速度'],
['s1','I like to play basketball.','句子'],['s2','He’s my father.','句子'],['s3','Is she a nurse?','句子'],['s4','What’s your name?','句子'],
['s5','I like Pokémon cards.','句子'],['s6','I’m ten years old.','句子']];
const h=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>男聲試聽</title><style>
@font-face{font-family:Andika;src:url(../../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark}body{margin:0;background:#05070A;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 80px;font-size:24px;line-height:1.5}
h1{font-size:34px;color:#FFD54A;margin:18px 0 6px}
.row{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:14px 0;border-bottom:2px dashed #2A3540}
.no{font-size:30px;font-weight:700;color:#7FD4FF;min-width:1.6em}.en{font-size:40px;font-weight:700;flex:1;min-width:9em}
.k{font-size:20px;color:#B9C4CE;display:block}
button{font:inherit;font-size:28px;font-weight:700;min-height:60px;padding:0 22px;border-radius:16px;border:3px solid #3A4650;cursor:pointer}
.f{background:#FFD6E5;color:#111}.m{background:#CFE6FF;color:#111}button.on{outline:5px solid #FFD54A}
</style></head><body><h1>男聲試聽（女聲 vs 男聲）</h1>
<p>每一行按〔女聲〕〔男聲〕各聽一次。請回覆：男聲 OK／哪幾號唸得不對或不自然。<br>男聲 ＝ HiFi-Captain 男聲（跟現在的女聲同一套，專業配音員錄的）。</p>
${L.map((r,k)=>`<div class="row"><span class="no">${k+1}</span><span class="en">${r[1]}<span class="k">${r[2]}</span></span><button class="f" data-a="f_${r[0]}.mp3">👧 女聲</button><button class="m" data-a="m_${r[0]}.mp3">👦 男聲</button></div>`).join('')}
<script>var A=new Audio(),B=null;document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
if(B)B.classList.remove('on');B=b;b.classList.add('on');A.pause();A.src=b.getAttribute('data-a');A.play();A.onended=function(){b.classList.remove('on')}});</script>
</body></html>`;
fs.writeFileSync(__dirname+'/index.html',h);
