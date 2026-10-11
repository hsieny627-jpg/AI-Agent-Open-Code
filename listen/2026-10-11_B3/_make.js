// 產生 listen/2026-10-11_B3/r1.html（B3 選擇題的大字頁）
const fs=require('fs');
// 一格： [英文, 中文, 連在一起?]
const W=(parts,join)=>'<span class="wd'+(join?' j':'')+'">'+parts.map(p=>'<span class="pc"><span class="e">'+p[0]+'</span><span class="z">'+p[1]+'</span></span>').join('')+'</span>';
const span=(en,zh)=>'<span class="wd sp"><span class="e">'+en+'</span><span class="br"></span><span class="z">'+zh+'</span></span>';
const OK=[
 ['basketball 籃球',W([['basket','籃'],['ball','球']],1)],
 ['dodgeball 躲避球',W([['dodge','躲避'],['ball','球']],1)],
 ['strawberries 草莓',W([['straw','草'],['berries','莓']],1)],
 ['smartphones 智慧型手機',W([['smart','智慧型'],['phones','手機']],1)],
 ['Pokémon cards 寶可夢卡',W([['Pokémon','寶可夢'],['cards','卡']])],
 ['Switch games Switch 遊戲',W([['Switch','Switch'],['games','遊戲']])],
 ['potato chips 洋芋片',W([['potato','洋芋'],['chips','片']])],
 ['ice cream 冰淇淋',W([['ice','冰'],['cream','淇淋']])],
 ['fried chicken 炸雞',W([['fried','炸'],['chicken','雞']])],
 ['hot dogs 熱狗',W([['hot','熱'],['dogs','狗']])],
 ['picture books 繪本',W([['picture','繪'],['books','本']])],
 ['Mario Kart 瑪利歐賽車',W([['Mario','瑪利歐'],['Kart','賽車']])],
 ['mobile games 手遊',W([['mobile','手'],['games','遊']])],
];
const BAD=[
 ['instant noodles','泡麵','instant 馬上的、noodles 麵'],
 ['bubble tea','珍珠奶茶','bubble 泡泡、tea 茶'],
 ['French fries','薯條','French 法國的、fries 炸的東西'],
 ['stuffed animals','絨毛娃娃','stuffed 塞滿的、animals 動物'],
 ['video games','電玩','video 影像、games 遊戲'],
 ['Animal Crossing','動物森友會','Animal 動物、Crossing 穿越'],
];
const css=`
@font-face{font-family:Andika;src:url(../../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark}
body{margin:0;background:#05070A;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 80px;font-size:24px;line-height:1.5}
h1{font-size:34px;color:#FFD54A;margin:18px 0 6px}
h2{font-size:30px;color:#FFD54A;margin:34px 0 8px;border-top:3px solid #24303C;padding-top:18px}
.q{background:#0B0F14;border:2px solid #24303C;border-radius:18px;padding:12px 18px;margin:14px 0}
.q b.n{color:#7FD4FF}
.op{display:block;margin:8px 0 0 12px}
.rec{color:#8DFF9E;font-weight:700}
table{border-collapse:collapse;margin:10px 0;width:100%}
td,th{border:2px solid #2A3540;padding:8px 12px;vertical-align:middle;text-align:left}
th{background:#14202B;color:#CFE6FF}
.wd{display:inline-flex;align-items:flex-start;gap:22px;font-weight:700}
.wd.j{gap:0}
.pc{display:inline-flex;flex-direction:column;align-items:center}
.wd.j .pc+.pc .e{border-left:0}
.wd.j .pc .z{border-top:4px solid #FFD54A;margin:0 4px;padding-top:2px}
.e{font-size:44px;line-height:1.1}
.z{font-size:34px;color:#FFE9A8;min-width:1em;text-align:center}
.sp{flex-direction:column;align-items:center}
.br{display:block;width:92%;height:12px;border:3px solid #6E7F8F;border-top:0;border-radius:0 0 10px 10px}
.op .wd{display:flex;width:fit-content;margin:10px 0 6px 20px}
.small{font-size:20px;color:#B9C4CE}
.sent{font-size:36px;font-weight:700}
.big{font-size:40px;color:#FFE9A8;font-weight:700}
`;
let h=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>B3 選擇題</title><style>${css}</style></head><body>
<h1>B3：要先問老師的選擇題</h1>
<p>每一題有 <span class="rec">⭐ 建議</span>。可以回覆「全部照建議」，或寫「Q3 選 ②」。</p>

<h2>Q1　範圍：哪些頁要改？</h2>
<div class="q">
<span class="op"><span class="rec">⭐ ①</span> Review 1 的全部：98 張單字卡、三年級和四年級 Review 1 的句型卡、〔🔤 選單字〕頁、Review 1 遊戲答錯頁的逐字中文</span>
<span class="op">② 只有 98 張單字卡</span>
<span class="op">③ 單字卡＋句型卡＋選單字頁（遊戲不改）</span>
</div>

<h2>Q2　(A) 一個英文字拆兩半：英文要不要切開？</h2>
<div class="q">
<span class="op"><span class="rec">⭐ ①</span> 英文<b>照樣連在一起</b>（拼字不變），只把中文「籃」「球」分別放在 basket、ball 正下方：<br>${W([['basket','籃'],['ball','球']],1)}</span>
<span class="op">② 英文也切開，中間空一格：<br>${W([['basket','籃'],['ball','球']])}（缺點：學生可能以為 basketball 是兩個字）</span>
</div>

<h2>Q3　中文可以拆開對齊的字（建議這 13 個）</h2>
<p>中文剛好可以切開、一段對一段的字。對不對？要不要加減？</p>
<table><tr><th>單字</th><th>改了以後</th></tr>
${OK.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')}
</table>
<p class="small">說明：ice cream 的「淇淋」是 cream 的聲音翻過來的（動手時再查證附出處）；mobile games「手遊」＝ 手機遊戲。<br>
現在畫面上 potato 寫「馬鈴薯」、chips「薄片」、ice「冰」cream「奶油」、picture「圖畫」books「書」。改了以後，原本的意思（奶油、薄片…）放進〔💡 補充〕。</p>
<div class="q"><span class="op"><span class="rec">⭐ ①</span> 這 13 個照上表</span><span class="op">② 要改哪幾個（請寫出來）</span></div>

<h2>Q4　中文拆不開的字，句子裡怎麼放？</h2>
<p>這幾個中文名字跟英文對不起來（例：French fries ＝ 薯條，「薯」不是 French）：</p>
<table><tr><th>單字</th><th>中文</th><th>一個字一個字的意思</th></tr>
${BAD.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td class="small">'+r[2]+'</td></tr>').join('')}
</table>
<div class="q">
<span class="op"><span class="rec">⭐ ①</span> 句子裡：一整個「薯條」放在兩個英文字的<b>正中間下方</b>，用括號連起來：<br>
<span class="sent">I like </span>${span('French fries','薯條')}<br>
單字卡第 ② 幕（教這個字的那一幕）照現在：French 法國的、fries 炸的東西 ➜ 合起來 薯條</span>
<span class="op">② 句子裡也照現在：French 下面「法國的」、fries 下面「炸的東西」</span>
</div>

<h2>Q5　baseball（棒球）怎麼辦？</h2>
<p>base ＝ 壘，不是「棒」，所以「棒」「球」對不起來。</p>
<div class="q">
<span class="op"><span class="rec">⭐ ①</span> 「棒球」一整格放在 baseball 正下方（不拆）；〔💡 補充〕照現在寫 base 壘 ＋ ball 球</span>
<span class="op">② 拆成 base 下面「壘」、ball 下面「球」</span>
</div>

<h2>Q6　(C) 整句中文斷詞：一個中文「詞」要不要切開？</h2>
<div class="q">
<span class="op"><span class="rec">⭐ ①</span> 一個詞不切開：<span class="big">我 喜歡 收集 寶可夢卡。</span>　<span class="big">我 喜歡 冰淇淋。</span></span>
<span class="op">② 照英文一個字切一次：<span class="big">我 喜歡 收集 寶可夢 卡。</span>　<span class="big">我 喜歡 冰 淇淋。</span></span>
</div>

<h2>Q7　(C) 斷詞要改哪些地方？</h2>
<div class="q">
<span class="op"><span class="rec">⭐ ①</span> Review 1 全部：單字卡第 ③ 幕（我 喜歡 打 籃球。）、第 ② 幕金色那一行（打 籃球）、三年級句型卡（我 喜歡 ______。）、四年級句型卡（這 是 我的 ______。／他 是 一位 ______。／他 喜歡 ______，／而且 我 喜歡 ______。／他 會 ______，／而且 我 會 ______。）、Review 1 第一頁、選單字頁</span>
<span class="op">② ① 再加上三、四年級 Unit 1、Unit 2 全部句型卡（現在有的有空格、有的沒有，例：「他 是 誰？」「他是誰？」都有）</span>
</div>

<h2>Q8　(D) 中文放大多少？</h2>
<table><tr><th>地方（iPad 橫放）</th><th>現在</th><th>⭐ 建議（約 1.5 倍）</th></tr>
<tr><td>單字卡第 ② 幕：每個字下面的中文</td><td>23</td><td>34</td></tr>
<tr><td>單字卡第 ② 幕：金色合起來的中文</td><td>38</td><td>48</td></tr>
<tr><td>單字卡第 ③ 幕：每個字下面的中文</td><td>20</td><td>30</td></tr>
<tr><td>單字卡第 ③ 幕：整句中文</td><td>22</td><td>34</td></tr>
<tr><td>句型卡：每個字下面的中文</td><td>30</td><td>40</td></tr>
<tr><td>選單字頁：方塊裡的中文</td><td>21</td><td>30</td></tr>
</table>
<p class="small">單位：畫面上的點（px）。長的句子（I like to go to an amusement park.）放不下一行時，整句會自動縮小一點，量過才交。</p>
<div class="q">
<span class="op"><span class="rec">⭐ ①</span> 約 1.5 倍（上表）</span>
<span class="op">② 約 1.3 倍（比較保守）</span>
<span class="op">③ 約 2 倍（很大，長句子會縮回去）</span>
</div>

<h2>Q9　男聲按鈕：放在哪些頁？</h2>
<div class="q">
<span class="op"><span class="rec">⭐ ①</span> Review 1 的 98 張單字卡（單字、片語、例句、音節動畫全部有男聲）＋〔🔤 選單字〕頁的大字整句</span>
<span class="op">② 只有 98 張單字卡</span>
<span class="op">③ ① 再加上 Review 1 句型卡（句型卡現在問句、答句已經是一男一女，按了全部變男聲）</span>
</div>

<h2>Q10　男聲按鈕：長什麼樣子、記不記住？</h2>
<div class="q">
<span class="op"><span class="rec">⭐ ①</span> 按鈕列〔🔊 唸 1 次〕左邊一顆〔👩 女聲〕，按一下變〔👨 男聲〕；<b>這台平板記住</b>（換下一個字、重新打開都還是男聲，再按一下回女聲）</span>
<span class="op">② 一樣的按鈕，但每次打開網頁都回到女聲</span>
</div>

<h2>還有：男聲要先試聽</h2>
<p>回覆以後，先做「男聲試聽頁」（12 個字和句子：女聲 vs 男聲），您聽過說 OK，才做 98 張卡全部的男聲。</p>
</body></html>`;
fs.writeFileSync('listen/2026-10-11_B3/r1.html',h);
