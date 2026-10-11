// 產生 listen/2026-10-11_B3/index.html（第二輪確認題；第一輪在 r1.html）
const fs=require('fs');
const css=fs.readFileSync(__dirname+'/r1.html','utf8').match(/<style>([\s\S]*?)<\/style>/)[1]+`
.zh{font-size:34px;font-weight:700;color:#FFE9A8;white-space:nowrap}
.was{font-size:26px;color:#B9C4CE}
td.n{color:#7FD4FF;font-weight:700;width:2em}`;
const S=[ // [現在, 改之後]
['我喜歡 ______。','我 喜歡 ______。'],['我的名字是 ______。','我的 名字 是 ______。'],['你的名字是什麼？','你的 名字 是 什麼？'],
['我是 Emma。','我 是 Emma。'],['你幾歲？','你 幾歲？'],['我是十歲。','我 是 十 歲。'],['我是 ______ 歲。','我 是 ______ 歲。'],
['他是誰？','他 是 誰？'],['他是我的爸爸。','他 是 我的 爸爸。'],['這是我的 ______。','這 是 我的 ______。'],
['他是一位醫生。','他 是 一位 醫生。'],['他是一位醫生嗎？','他 是 一位 醫生 嗎？'],['是的，他是。','是的，他 是。'],
['不，他不是。她是一位 ______。','不，他 不是。他 是 一位 ______。'],['他喜歡 ______，','他 喜歡 ______，'],
['而且我喜歡 ______。','而且 我 喜歡 ______。'],['他會 ______，','他 會 ______，'],['而且我會 ______。','而且 我 會 ______。'],
['我喜歡籃球。','我 喜歡 籃球。'],['我喜歡打籃球。','我 喜歡 打 籃球。'],['我喜歡收集寶可夢卡。','我 喜歡 收集 寶可夢卡。'],
];
S[13][0]='不，他不是。他是一位 ______。';
const Q=(n,t,ops,extra)=>`<h2>${n}　${t}</h2>${extra||''}<div class="q">${ops.map((o,k)=>'<span class="op">'+(k?'':'<span class="rec">⭐ </span>')+'<b>'+'①②③'[k]+'</b> '+o+'</span>').join('')}</div>`;
let h=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>B3 第二輪確認</title><style>${css}</style></head><body>
<h1>B3 第二輪：動手前再確認一次</h1>
<p>老師上一輪的回覆：<b>Q3</b> mobile 不是「手」；<b>Q7</b> Review 1 和 Unit 1、Unit 2 全部句型卡都要改空格；<b>Q9</b> 全站英文都要有男聲和切換按鈕。<br>
下面每一題有 <span class="rec">⭐ 建議</span>，可以回覆「全部照建議」，或寫「R3 選 ②」。第一輪的題目在 <a href="r1.html" style="color:#7FD4FF">這裡</a>。</p>
${Q('R1','第一輪沒有提到的題（Q1、Q2、Q4、Q5、Q6、Q8、Q10）照建議做嗎？',['照建議（Review 1 全部、basketball 英文不切開、薯條放兩個字正中間、棒球不拆、寶可夢卡不切、中文放大約 1.5 倍）','要改（請寫出哪一題）'])}
${Q('R2','mobile games（手遊）怎麼放？',['「手遊」一整格放在 mobile games 兩個字的正中間下方，跟「薯條」一樣：<br><span class="wd sp" style="display:inline-flex;margin:8px 0 0 20px"><span class="e">mobile games</span><span class="br"></span><span class="z">手遊</span></span>','每個字下面放直譯：mobile「手機的」、games「遊戲」'])}
<h2>R3　空格的寫法：一個英文字 ＝ 一個中文詞，詞和詞中間空一格</h2>
<p>三、四年級全部句型卡的整句中文，改成下表（右邊）。</p>
<table><tr><th></th><th>現在</th><th>改了以後</th></tr>
${S.map((r,k)=>'<tr><td class="n">'+(k+1)+'</td><td class="was">'+r[0]+'</td><td class="zh">'+r[1]+'</td></tr>').join('')}
</table>
<div class="q"><span class="op"><span class="rec">⭐ </span><b>①</b> 照上表</span><span class="op"><b>②</b> 要改哪幾句（請寫號碼）</span></div>
${Q('R4','「我的」（my）、「你的」（your）要不要切開？',['不切開，因為一個英文字 my ＝「我的」：<span class="zh">他 是 我的 爸爸。</span>','切開：<span class="zh">他 是 我 的 爸爸。</span>'])}
${Q('R5','「你呢？」（How about you?）要不要切開？',['不切開：<span class="zh">你呢？</span>（How about you? 三個字合起來才是「你呢」，對不起來）','切開：<span class="zh">你 呢？</span>'])}
${Q('R6','空格要改到哪裡？',['句型卡英文下面的整句中文、「全部的句子」那一頁、中英語序卡、選單字頁','① 再加上暖身題、複習題、遊戲裡的中文句子（例：「他是我的爸爸。」英文是？ ➜「他 是 我的 爸爸。」英文是？）'])}
${Q('R7','中文放大：Unit 1、Unit 2 句型卡也要放大嗎？',['只放大 Review 1（第一輪 Q8 那張表）；Unit 1、Unit 2 句型卡的中文現在是 30～35 點，不動','Unit 1、Unit 2 句型卡的中文也放大約 1.5 倍（30 ➜ 40、35 ➜ 46）'])}
${Q('R8','男聲要做到哪些網站？',['全部：三年級網站、四年級網站、在家複習（三、四年級）、Review 1 單字卡和遊戲、單字網站（家人、職業、數字、Sight Words、單字故事、時光機、家庭樹、環遊世界的英文字）、縮寫動畫、比較、暖身題、複習題、遊戲。<br><span class="small">不做：瑞典文、德文等外國話，和時光機裡「以前」的古英文（它們不是英文）。職業單字網站 English-Jobs-New 是另一個網站，這次不改。</span>','① 再加上職業單字網站 English-Jobs-New（要另外開一個對話做）'])}
${Q('R9','一問一答（現在已經一男一女）：按了〔👨 男聲〕會怎樣？',['照現在一男一女，不受按鈕影響','兩句都變男聲'])}
${Q('R10','按鈕放哪裡、怎麼記住？',['每一頁的按鈕列都有一顆〔👩 女聲〕，按一下變〔👨 男聲〕。<b>全站一起記住</b>：在單字卡選了男聲，打開句型卡、遊戲也是男聲（這台平板）','每個網站各自記住（單字卡選男聲，句型卡還是女聲）'])}
<h2>回覆以後</h2>
<p>1. 我用老師的例子再對一次（basketball、他 是 誰？）。<br>2. 先做「男聲試聽頁」（女聲 vs 男聲 12 句），老師聽過 OK，才做全站約 2,000 個男聲語音檔。</p>
</body></html>`;
fs.writeFileSync(__dirname+'/index.html',h);
