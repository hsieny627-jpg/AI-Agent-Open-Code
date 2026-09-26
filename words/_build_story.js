/* words/_build_story.js — 故事頁的產生器（why.html / why-2.html / why-more.html）
 *
 * 用法： node words/_build_story.js
 *
 * why.html      = 家人單字的故事①：開場 ＋ 前 9 個字（family…grandfather）
 * why-2.html    = 家人單字的故事②：開場 ＋ 後 8 個字（grandmother…wife）＋ 結尾
 * why-more.html = 附加補充：六個學生認識的日常單字
 *
 * 17 個單字的場景都在 FAM 陣列裡，兩頁用 slice 切開——改文案只改 FAM 一個地方。
 *
 * 這兩頁是「通則頁」，不是單字頁：可以講字的來源，但事實必須正確。
 * 17 個單字頁仍然維持三幕、不加演變幕（見 CLAUDE.md）。
 * 字母逐格變形永遠禁止——動畫動的是人、時間、聲音、零件，不是整個單字的拼法。
 */
const fs=require('fs'),path=require('path'),DIR=__dirname;
const SRC=require('./_sources');
const PH=require('./_phonics');
const WD=require('./_world');

/* FAM[0]=開場、FAM[1..17]=17 個家人單字、FAM[18]=結尾 */
const FAM=[
 {emoji:'👨‍👩‍👧‍👦',mid:'這些家人單字，為什麼長這樣？',
  lines:['每一個字，都有自己的故事']},

 {tag:'以前算的人更多',emoji:'👨‍👩‍👧‍👦<span class="extra">👴🧑‍🌾🧹</span>',say:'family',
  h:'<div class="en in d1">{{family}}</div>',
  lines:['很久以前的 <b>family</b>，<b>連家裡幫忙做事的人都算</b>',
         '（它不是 Father And Mother I Love You 拼出來的）']},

 {tag:'最早的意思',emoji:'👨‍👩',say:'parent',
  h:'<div class="en in d1">{{parent}}</div>'+
    '<div class="emoji emerge" style="font-size:clamp(40px,7.4vh,66px)">👶</div>',
  lines:['最早寫成 <b class="nosay">parens</b>，意思是「<b>把孩子生下來的人</b>」',
         '一位是 a parent，兩位以上是 parents']},

 {tag:'寶寶最先會的音',emoji:'👶',say:'mother',
  h:'<div class="en"><span class="bub b1">ma</span><span class="bub b2">ma</span><span class="bub b3">ma</span></div>'+
    '<div class="en pop" style="animation-delay:1.3s">{{mom}}</div>',
  lines:['全世界的寶寶，最先發得出來的音就是 <b>ma</b>',
         '媽媽的英文 <b>mother</b>、<b>mom</b>，都從 <b>m</b> 開頭']},

 {tag:'寶寶先叫出來的',emoji:'👶',say:'dad',
  h:'<div class="en"><span class="bub b1">da</span><span class="bub b2">da</span><span class="bub b3">da</span></div>'+
    '<div class="en pop" style="animation-delay:1.3s">{{dad}}</div>',
  lines:['小寶寶還不會說 <b>father</b>','先叫出 <b>da-da</b>，就變成 <b>dad</b>']},

 {tag:'不見了的字母',emoji:'🧒👦',say:'brother',
  h:'<div class="en in d1"><span class="flag">þ</span> <span class="ar">就是</span> th</div>',
  lines:['以前英文有一個字母 <b class="nosay">þ</b>，像一面小旗子',
         '<b>brother</b> 以前寫成 <b class="nosay">brōþor</b>']},

 /* 2026-09-20 訂正：原本寫「住進同一個村子」——**查不到任何一個村子的紀錄**，
    史料講的是一整片地區（丹麥區 Danelaw），不是單一村子，那句是編的，已刪。
    留下來的都是查得到的：維京人住在英格蘭東北邊，地名到今天還是維京話（-by ＝ 村子）。 */
 {tag:'兩邊人唸得不一樣',emoji:'👧',say:'sister',
  h:'<div class="en in d1" style="font-size:clamp(17px,3vh,28px);line-height:1.6">'+
    '<span class="fromL">🏴 英國人唸 sweostor</span><br>'+
    '<span class="fromR">⛵ 維京人唸 systir</span></div>'+
    '<div class="en pop" style="animation-delay:1.3s">{{sister}}</div>',
  lines:['<b>同一個姊姊</b>，英國人唸 <b class="nosay">sweostor</b>，坐船來的維京人唸 <b class="nosay">systir</b>',
         '維京人<b>住在英格蘭東北邊</b>，後來大家都唸 <b>sister</b>']},

 {tag:'唸起來一樣',emoji:'☀️👦',say:'son',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.8vh,46px)">'+
    '<span class="fromL">{{sun}} ☀️</span> <span class="ar">🔊</span> <span class="fromR">👦 {{son}}</span></div>',
  lines:['<b>sun</b>（太陽）和 <b>son</b>（兒子），<b>唸起來一模一樣</b>',
         '可是<b>拼法不一樣，意思也不一樣</b>']},

 {tag:'後來不唸了',emoji:'👧',say:'daughter',
  h:'<div class="en in d1"><span class="sp" data-say="daughter">dau<span class="mute">gh</span>ter</span></div>',
  lines:['以前的人，<b>gh</b> 會唸出來','後來<b>不唸了，字母還是留著</b>']},

 {tag:'借來的 grand',emoji:'👴',say:'grandfather',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.8vh,48px)">'+
    '<span class="fromL hi">grand</span> <span class="ar">＋</span> <span class="fromR">father</span></div>'+
    '<div class="en pop" style="animation-delay:1.2s;font-size:clamp(26px,4.8vh,48px)">{{grandfather}}</div>',
  lines:['<b>grand</b> ＝ <b>大</b>（從法國借來的）','裝在 father 前面 ＝ <b>爸爸的爸爸</b>']},

 {tag:'同一個 grand',emoji:'👵',say:'grandmother',
  h:'<div class="en in d1" style="font-size:clamp(24px,4.4vh,42px)">'+
    '<span class="hi">grand</span> ＋ mother</div>'+
    '<div class="en pop" style="animation-delay:1.2s;font-size:clamp(24px,4.4vh,42px)">'+
    '{{grandmother}}　{{grandma}}</div>',
  lines:['同一個 <b>grand</b>（<b>大</b>），可以一直裝','裝在 mother 前面 ＝ <b>媽媽的媽媽</b>']},

 {tag:'以前只有一種',emoji:'🧓<span class="plus">👨👴</span>',say:'uncle',
  h:'<div class="en in d1">{{uncle}}</div>',
  lines:['uncle 最早只有一個意思：<b>媽媽的兄弟</b>（舅舅）',
         '現在叔叔、伯伯、姑丈、姨丈，<b>全都是 uncle</b>']},

 {tag:'以前只有一種',emoji:'👩‍🦰<span class="plus">👩👵</span>',say:'aunt',
  h:'<div class="en in d1">{{aunt}}</div>',
  lines:['aunt 最早也只有一個意思：<b>爸爸的姊妹</b>（姑姑）',
         '現在阿姨、伯母、舅媽，<b>全都是 aunt</b>']},

 {tag:'以前只有一種',emoji:'🧑<span class="plus">🧒👧👦</span>',say:'cousin',
  h:'<div class="en in d1">{{cousin}}</div>',
  lines:['cousin 以前只有一種：<b>阿姨的小孩</b>',
         '現在堂哥、表姊、堂弟、表妹，<b>全都是 cousin</b>']},

 {tag:'以前用的人更多',emoji:'👦<span class="extra">👴👶🧒</span>',say:'nephew',
  h:'<div class="en in d1">{{nephew}}</div>',
  lines:['<b class="nosay">nepos</b> 以前很好用，孫子、姪子、外甥<b>都可以用這個字</b>',
         '現在只剩一種：<b>兄弟姊妹的兒子</b>']},

 {tag:'和 nephew 一樣',emoji:'👧<span class="extra">👵👶👩</span>',say:'niece',
  h:'<div class="en in d1">{{niece}}</div>',
  lines:['<b class="nosay">neptia</b> 以前也一樣，<b>一大群人都可以用這個字</b>',
         '現在只剩一種：<b>兄弟姊妹的女兒</b>']},

 {tag:'藏在字裡的房子',emoji:'🏠',say:'husband',
  h:'<div class="en in d1"><span class="sp" data-say="husband"><span class="hi">hus</span>band</span></div>',
  lines:['<b>hus</b> 就是 <b>house</b>（房子）',
         'husband 以前的意思是「<b>管這個家的人</b>」']},

 {tag:'以前用的人更多',emoji:'👰<span class="extra">👩👩‍🦰👵</span>',say:'wife',
  h:'<div class="en in d1">{{wife}}</div>',
  lines:['以前的 <b class="nosay">wīf</b>，<b>每個女生都可以用這個字</b>',
         '現在只剩一種：<b>太太</b>']},

 {tag:'所以',emoji:'🗣️⏳',mid:'字會變，就像綽號',
  lines:['<b>沒有人規定</b>，是大家一直這樣<b>發音</b>','<b>發音慢慢變，字就跟著變</b>']}
];

/* 每一個字的故事先來一題猜猜看（使用者 2026-09-26 指定：故事融入暖身題，要有趣、顛覆認知）
   o[0] 一定是正確答案，畫面上會打散。答了（或按「直接看答案」）才揭曉故事動畫。 */
const FQ={
 family:{q:'很久以前的 <b>family</b>，連誰都算「家裡的人」？',o:['幫忙做事的僕人','隔壁鄰居','學校老師','路過的客人']},
 parent:{q:'<b>parent</b> 最早的意思是？',o:['把孩子生下來的人','家裡最老的人','會煮飯的人','住在隔壁的人']},
 mother:{q:'全世界的寶寶，<b>最先</b>發得出來的音是？',o:['ma','ka','sa','la']},
 dad:{q:'寶寶還不會說 father，<b>先叫出</b>什麼？',o:['da-da','fa-fa','ka-ka','sa-sa']},
 brother:{q:'英文以前有一個像小旗子的字母 <b>þ</b>，今天變成了？',o:['th','b','p','f']},
 sister:{q:'<b>sister</b> 這樣唸，是誰帶來的？',o:['坐船來的維京人','法國國王','美國人','羅馬人']},
 son:{q:'哪一個字跟 <b>son</b> 唸起來<b>一模一樣</b>？',o:['sun 太陽','sing 唱歌','soon 很快','song 歌']},
 daughter:{q:'daughter 的 <b>gh</b>，以前的人？',o:['會唸出來','從來不唸','唸成 f','根本沒寫']},
 grandfather:{q:'<b>grand</b> 的意思是？',o:['大','老','好','爺爺']},
 grandmother:{q:'grandma 的 grand，跟哪一個 grand <b>意思一樣</b>？',o:['Grand Canyon 大峽谷','grab 抓','grade 年級','grass 草']},
 uncle:{q:'<b>uncle</b> 最早只能叫誰？',o:['媽媽的兄弟（舅舅）','爸爸的兄弟（叔叔）','爸爸的爸爸','鄰居先生']},
 aunt:{q:'<b>aunt</b> 最早只能叫誰？',o:['爸爸的姊妹（姑姑）','媽媽的姊妹（阿姨）','媽媽的媽媽','女老師']},
 cousin:{q:'<b>cousin</b> 以前只能叫誰的小孩？',o:['阿姨的小孩','叔叔的小孩','哥哥的小孩','鄰居的小孩']},
 nephew:{q:'nephew 以前的樣子 <b>nepos</b>，還可以叫誰？',o:['孫子','爺爺','爸爸','老師']},
 niece:{q:'<b>niece</b> 跟哪一個字是一對？',o:['nephew 姪子','nice 很好','nine 九','name 名字']},
 husband:{q:'<b>husband</b> 裡面藏著哪一個東西？',o:['house 房子','horse 馬','hat 帽子','hand 手']},
 wife:{q:'以前的 <b>wīf</b>，指的是誰？',o:['每一個女生','只有媽媽','只有皇后','每一個小孩']}
};
FAM.forEach(s=>{if(s.say&&FQ[s.say])s.q=FQ[s.say]});
FAM.forEach(s=>{if(s.say==='dad')s.q=FQ.dad});

/* 第二頁的開場 */
const OPEN2={emoji:'👨‍👩‍👧‍👦',mid:'還有八個家人單字',
 lines:['故事也都不一樣']};

const PAGES=[
/* 19 幕一次放太長，拆成兩頁：前 9 個字／後 8 個字，各 10 幕 */
{file:'why.html',title:'家人單字的故事 ①',src:'why',big:1,S:FAM.slice(0,10)},
{file:'why-2.html',title:'家人單字的故事 ②',src:'why',big:1,S:[OPEN2].concat(FAM.slice(10,18),[FAM[18]])},

/* 哥哥／姊姊／弟弟／妹妹的說法（使用者 2026-09-19 指定要務必補充）。
   **2026-09-20 使用者指定改寫**：原本文字太囉嗦，學生看不懂。
   規則：一幕最多兩行、一行最多一件事，**看動畫就懂，文字只是補一句**。
   每一個英文字都寫成 {{單字}}，由 _phonics.js 畫出來：
   母音紅色、不發音淺灰、點下去唸標準美式英語、可切 IPA／KK 音標。
   最重要的一句仍然在第 1 幕：平常就說 my brother，**不用講大小**。
   「最常用」沒有做過語料庫次數統計（環境連不上 COCA／BNC），所以畫面上不寫排名。 */
{file:'older-younger.html',title:'哥哥還是弟弟',src:'older-younger',
 back:{href:'brother.html',label:'← 回 單字卡'},
 S:[
 {emoji:'🧒👦👧👩',mid:'哥哥？弟弟？',
  lines:['英文<b>都是 brother</b>']},

 /* 動畫：「大的？小的？」自己掉下去不見了 → 平常根本不用講 */
 {tag:'平常這樣說',emoji:'🗣️',say:'my brother',
  h:'<div class="en big1 in d1">my {{brother}}</div>'+
    '<div class="drop" style="font-size:clamp(20px,3.4vh,32px);color:#8A8A8A;margin-top:.25em">大的？小的？</div>',
  lines:['<b>不用講大小</b>']},

 /* 一幕只講一個講法，字才放得大（使用者 2026-09-20 指定：最後一排要看得清楚） */
 {tag:'哥哥',emoji:'<span class="eBig">👦</span>',say:'older brother',
  h:'<div class="en big1 in d1">{{older}} {{brother}}</div>'+
    '<div class="mean pop">＝ 哥哥</div>',
  lines:['<b>older</b> ＝ 年紀比較大']},

 {tag:'弟弟',emoji:'<span class="eSml">👦</span>',say:'younger brother',
  h:'<div class="en big1 in d1">{{younger}} {{brother}}</div>'+
    '<div class="mean pop">＝ 弟弟</div>',
  lines:['<b>younger</b> ＝ 年紀比較小']},

 {tag:'姊姊',emoji:'<span class="eBig">👧</span>',say:'older sister',
  h:'<div class="en big1 in d1">{{older}} {{sister}}</div>'+
    '<div class="mean pop">＝ 姊姊</div>',
  lines:['姊姊妹妹<b>完全一樣</b>，前面加 older']},

 {tag:'妹妹',emoji:'<span class="eSml">👧</span>',say:'younger sister',
  h:'<div class="en big1 in d1">{{younger}} {{sister}}</div>'+
    '<div class="mean pop">＝ 妹妹</div>',
  lines:['前面加 <b>younger</b> 就是妹妹']},

 {tag:'聊天的時候',emoji:'💬',say:'big brother',
  h:'<div class="en big2 in d1"><span class="grow">{{big}}</span> {{brother}} <span class="ar">＝</span> 哥哥</div>'+
    '<div class="en big2 in d2"><span class="shrink">{{little}}</span> {{brother}} <span class="ar">＝</span> 弟弟</div>',
  lines:['聊天這樣說<b>也對</b>','<b>big</b> ＝ 大　<b>little</b> ＝ 小']},

 /* 11：elder 要註明哪個國家的用法 */
 {tag:'課本上會看到',emoji:'🇬🇧',say:'elder brother',
  h:'<div class="en big2 in d1"><span class="stamp">✅</span> {{elder}} {{brother}} <span class="ar">＝</span> 哥哥</div>',
  lines:['<b>elder</b> 是<b>英國</b>的寫法，意思一樣',
         '（證據在右下角 <b>📖 出處</b>：Cambridge「elder or older?」）']},

 /* 11：錯的句子要標清楚錯在哪，並給出正確句 ＋ 中文意思 */
 {tag:'這樣寫是錯的',emoji:'⚠️',say:'He is older than me.',
  h:'<div class="en big3 in d1 wrong"><span class="stamp">❌</span> He is <span class="bad">elder</span> than me.</div>'+
    '<div class="en big3 in d2"><span class="stamp">✅</span> He is <span class="hi">older</span> than me.</div>'+
    '<div class="mean pop">他年紀比我大</div>',
  lines:['<b>elder</b> 只能放在 <b>brother</b>、<b>sister</b> 前面',
         '<b>than</b> 前面一定要用 <b>older</b>']},

 {tag:'記住這個',emoji:'🧒👦👧👩',mid:'四個中文字，兩個英文字',
  lines:['哥哥、弟弟 → <b>brother</b>','姊姊、妹妹 → <b>sister</b>']}
]},

/* 單字結構頁（使用者 2026-09-19 指定）：grand 是什麼意思？mo／fa／bro／sis／-ther 呢？
   只放**查得到一手證據**的結構。查不到的（mo、bro、sis 單獨的意思）就誠實說沒有，
   不編一個出來——編出來學生會記錯，而且違反 CLAUDE.md「事實要正確」。
   幕號就是 daughter.html 等字卡「🧩 結構」按鈕的錨點，改順序要一起改 _build.js 的 parts.href。 */
{file:'parts.html',title:'單字拆開來看',src:'parts',sayAll:1,
 /* 2026-09-25 使用者指定：「🌍 環遊世界」要真的連到 world.html（原本按下去是「上一頁」，回不去也到不了） */
 fwd:{href:'world.html',label:'🌍 環遊世界 →'},
 S:[
 {emoji:'🧩',mid:'家人單字，拆得開嗎？',
  lines:['有的拆得開，有的<b>拆不開</b>']},

 /* #1 grand ＝ 大 */
 {tag:'grand 是什麼意思',emoji:'🏜️',src:'grand',
  h:'<div class="en in d1">{{grand}} <span class="ar">＝</span> 大</div>',
  lines:['<b>grand</b> ＝ <b>大</b>','<b>Grand Canyon</b> ＝ 大峽谷']},

 /* #2 grand ＋ father（grandfather／grandmother 的錨點） */
 {tag:'裝上去',emoji:'👴',src:'grand',
  h:'<div class="en in d1" style="font-size:clamp(24px,4.4vh,44px)">'+
    '<span class="fromL hi sp" data-say="grand">grand</span> <span class="ar">＋</span> <span class="fromR">{{father}}</span></div>'+
    '<div class="en pop" style="animation-delay:1.2s;font-size:clamp(24px,4.4vh,44px)">{{grandfather}}</div>',
  lines:['大的 father ＝ <b>爸爸的爸爸</b>']},

 /* #3 hus ＝ house（husband 的錨點） */
 {tag:'藏在字裡的房子',emoji:'🏠',src:'hus',
  h:'<div class="en in d1"><span class="sp" data-say="husband"><span class="hi">hus</span>band</span></div>'+
    '<div class="en pop" style="animation-delay:1.1s;font-size:clamp(26px,4.6vh,46px)">'+
    '<span class="hi">hus</span> ＝ {{house}}</div>',
  lines:['husband ＝ <b>管這間房子的人</b>']},

 /* #4 一樣的尾巴（mother/father/brother/sister/daughter 的錨點）
    2026-09-25 使用者指定：標題、英文、中文都放大；每一個字底下就是它的中文 */
 {tag:'一樣的尾巴',src:'tails',
  h:'<div class="tl4 fo">'+
    [['mo','ther','mother','媽媽'],['fa','ther','father','爸爸'],['bro','ther','brother','兄弟'],['daugh','ter','daughter','女兒']]
     .map(function(x){return '<span class="tw"><span class="sp" data-say="'+x[2]+'">'+x[0]+'<span class="hi">'+x[1]+'</span></span><em>'+x[3]+'</em></span>'}).join('')+
    '</div>'+
    '<div class="odd pop" style="animation-delay:1s"><span class="tw"><span class="sp" data-say="sister">sis<span class="hi2">ter</span></span><em>姊妹</em></span>'+
    '<span class="oddtag">⚠️ 長得像，來源不一樣</span></div>',
  lines:['四個家人字，<b>尾巴是同一條</b>']},

 /* #5 德文：先猜是哪一國（使用者 2026-09-24 指定：一開始不可以出現「德文」兩個字） */
 Object.assign(WD.guessOne({c:'de',w:[
   ['Mut<span class="hi">ter</span>','Mutter','媽媽','mother'],
   ['Va<span class="hi">ter</span>','Vater','爸爸','father'],
   ['Bru<span class="hi">der</span>','Bruder','兄弟','brother'],
   ['Toch<span class="hi">ter</span>','Tochter','女兒','daughter'],
   ['Schwes<span class="hi2">ter</span>','Schwester','姊妹','sister']],
   lines:['<b>先聽、先猜</b>：這是哪一國的話？']}),{src:'de'}),

 /* #6 荷蘭文：一樣先猜，右邊多一個「德文」可以對照 */
 Object.assign(WD.guessOne({c:'nl',de:1,w:[
   ['moe<span class="hi">der</span>','moeder','媽媽','mother','Mutter'],
   ['va<span class="hi">der</span>','vader','爸爸','father','Vater'],
   ['broer','broer','兄弟','brother','Bruder'],
   ['doch<span class="hi">ter</span>','dochter','女兒','daughter','Tochter'],
   ['zus','zus','姊妹','sister','Schwester']],
   lines:['再猜一次：<b>這又是哪一國？</b>']}),{src:'nl'}),

 /* #7 為什麼尾巴都一樣？（使用者 2026-09-24 指定的動畫頁；2026-09-25 主標題、次標題放大） */
 {tag:'為什麼尾巴都一樣',sayAll:1,src:'terwhy',
  h:'<div class="tails fo">'+
    '<em class="tcap">很久很久以前</em>'+
    '<span class="old">mā<i>ter</i></span><span class="old">pə<i>ter</i></span><span class="old">bhrā<i>ter</i></span><span class="old">dhughə<i>ter</i></span>'+
    '<span class="tarr">⬇</span><span class="tarr">⬇</span><span class="tarr">⬇</span><span class="tarr">⬇</span>'+
    '<em class="tcap en2">今天的英文</em>'+
    '<span class="sp en2" data-say="mother">mo<i>ther</i></span><span class="sp en2" data-say="father">fa<i>ther</i></span>'+
    '<span class="sp en2" data-say="brother">bro<i>ther</i></span><span class="sp en2" data-say="daughter">daugh<i>ter</i></span>'+
    '<em class="tcap de2">今天的德文</em>'+
    '<span class="sp de2" data-say="Mutter" data-lang="de-DE">Mut<i>ter</i></span><span class="sp de2" data-say="Vater" data-lang="de-DE">Va<i>ter</i></span>'+
    '<span class="sp de2" data-say="Bruder" data-lang="de-DE">Bru<i>der</i></span><span class="sp de2" data-say="Tochter" data-lang="de-DE">Toch<i>ter</i></span>'+
  '</div>',
  lines:['<b>-ter</b> ＝ 很久以前<b>家人字共用的尾巴</b>',
         '它最早有沒有別的意思？<b>還沒有定論</b>']},

 /* #8 前面那一半：mo、fa（2026-09-25 使用者指定：出處直接跳到證據） */
 {tag:'前面那一半',emoji:'👶',src:'mofa',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.6vh,46px)">'+
    '<span class="bub b1">ma</span> <span class="ar">→</span> <span class="sp" data-say="mother"><span class="bub b2">mo</span>ther</span>　'+
    '<span class="bub b3">pa</span> <span class="ar">→</span> <span class="sp" data-say="father"><span class="bub b3">fa</span>ther</span></div>',
  lines:['<b>ma</b>、<b>pa</b> ＝ <b>寶寶最早會發的音</b>']},

 /* #9 誠實幕：bro、sis 沒有意思 */
 {tag:'拆到這裡就好',emoji:'✋',src:'brosis',
  h:'<div class="en in d1" style="font-size:clamp(24px,4.4vh,42px)">'+
    '{{bro}}　{{sis}}</div>',
  lines:['<b>bro</b>、<b>sis</b> 單獨拿出來，<b>沒有意思</b>']},

 /* #10 parent ＋ s（parent 的錨點）：s 紅色（使用者 2026-09-25 指定） */
 {tag:'一位、兩位',emoji:'👨‍👩',src:'parent',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.8vh,48px)">{{parent}} <span class="ar">➜</span> '+
    '<span class="sp" data-say="parents">parent<b class="rs">s</b></span></div>',
  lines:['兩位以上，<b>加 <b class="rs">s</b></b>']},

 /* 收尾：下一頁真的連得過去（使用者 2026-09-25 指定） */
 {tag:'記住這件事',emoji:'🧩',
  h:'<div class="en in d1" style="font-size:clamp(17px,3vh,30px);line-height:1.7">'+
    '<span class="hi">拆得開</span>　{{grandfather}}　{{grandmother}}　{{husband}}<br>'+
    '<span class="mute">拆不開</span>　{{family}}　{{son}}　{{uncle}}　{{aunt}}<br>'+
    '<span class="mute">拆不開</span>　{{cousin}}　{{nephew}}　{{niece}}　{{wife}}</div>'+
    '<a class="golink pop" href="world.html">🌍 下一頁：家人單字環遊世界 ➜</a>',
  lines:['<b>拆不開的字，就整個背起來</b>']}
]},

/* 家人單字環遊世界（使用者 2026-09-24 指定新增）：
   語言也有家人 ➜ 地圖演語言怎麼搬家 ➜ 別的國家怎麼叫每一個家人 ➜ 為什麼這麼像。
   原本在 parts.html 最後的「別的國家怎麼叫媽媽／爸爸」搬來這裡，改成先猜再公布。
   一頁一個主題：parts.html 講「字怎麼拆」，這一頁講「字從哪裡來」。 */
{file:'world.html',title:'家人單字環遊世界',src:'world',sayAll:1,
 back:{href:'parts.html',label:'← 字的結構'},
 S:[
 {emoji:'🌍',mid:'家人單字，環遊世界',lines:['為什麼<b>別的國家</b>的家人單字，<b>跟英文這麼像</b>？']},
 /* 2026-09-25 使用者指定：四年級看不懂地圖和歷史 ➜ 先說歐洲在哪裡、今天是哪六國、為什麼挑這五國，再進地圖 */
 WD.WHERE, WD.SIX, WD.WHY5,
 WD.TREE
].concat(WD.MAPS,[
 WD.guessMany({src:'w-mother',en:'mother',zh:'媽媽',r:[['de','Mutter'],['nl','moeder'],['sv','mor'],['fr','mère'],['es','madre']],
   near:['de','nl','sv'],why:'德、荷、瑞典最像 ＝ <b>同一個日耳曼家族</b>'}),
 WD.guessMany({src:'w-father',en:'father',zh:'爸爸',r:[['de','Vater'],['nl','vader'],['sv','far'],['fr','père'],['es','padre']],
   near:['de','nl','sv'],why:'德、荷、瑞典最像 ＝ <b>同一個日耳曼家族</b>'}),
 WD.guessMany({src:'w-family',en:'family',zh:'家人',r:[['de','Familie'],['nl','familie'],['sv','familj'],['fr','famille'],['es','familia']],
   near:['fr','es'],why:'family 來自<b>拉丁文 familia</b>，所以法文、西班牙文最像'}),
 WD.guessMany({src:'w-brother',en:'brother',zh:'兄弟',r:[['de','Bruder'],['nl','broer'],['sv','bror'],['fr','frère'],['es','hermano']],
   near:['de','nl','sv'],why:'日耳曼家族最像；西班牙文 <b>hermano</b> 是另一個字'}),
 WD.guessMany({src:'w-brother',en:'sister',zh:'姊妹',r:[['de','Schwester'],['nl','zus'],['sv','syster'],['fr','sœur'],['es','hermana']],
   near:['de','sv'],why:'德文 Schwester、瑞典文 syster 最像 ＝ <b>日耳曼家族</b>'}),
 WD.guessMany({src:'w-grand',en:'grandfather',zh:'爺爺、外公',r:[['de','Großvater'],['nl','grootvader'],['sv','farfar／morfar'],['fr','grand-père'],['es','abuelo']],
   near:['fr','de'],why:'<b>grand</b> 來自法文，<b>father</b> 來自日耳曼家族'}),
 WD.guessMany({src:'w-grandfather',en:'grandmother',zh:'奶奶、外婆',r:[['de','Großmutter'],['nl','grootmoeder'],['sv','farmor／mormor'],['fr','grand-mère'],['es','abuela']],
   near:['fr','de','sv'],why:'瑞典文分兩邊：<b>farmor</b> 爸爸的媽媽、<b>mormor</b> 媽媽的媽媽'}),
 WD.guessMany({src:'w-uncle',en:'uncle',zh:'叔叔、舅舅',r:[['de','Onkel'],['nl','oom'],['sv','farbror／morbror'],['fr','oncle'],['es','tío']],
   near:['fr'],why:'uncle 是 <b>1066 年從法文 oncle</b> 借來的'}),
 WD.guessMany({src:'w-uncle',en:'aunt',zh:'阿姨、姑姑',r:[['de','Tante'],['nl','tante'],['sv','faster／moster'],['fr','tante'],['es','tía']],
   near:['fr'],why:'aunt 也是 <b>1066 年以後從法文</b>借來的'}),
 WD.guessMany({src:'w-uncle',en:'cousin',zh:'堂表兄弟姊妹',r:[['de','Cousin／Cousine'],['nl','neef／nicht'],['sv','kusin'],['fr','cousin／cousine'],['es','primo／prima']],
   near:['fr'],why:'cousin 跟法文<b>一模一樣</b>——從法文借來的'}),
/* 記住這件事（2026-09-25 使用者指定：原本單字擠在一起又有音標，太亂 ➜ 改成兩張簡單的表，字放大、顏色清楚） */
 {tag:'記住這件事',sayAll:1,src:'sum',
  h:'<div class="sumt fo">'+
    '<table class="st g"><caption>🌲 跟德文、荷蘭文像</caption><tr><th>英文</th><th>德文</th><th>荷蘭文</th></tr>'+
    [['mother','Mutter','moeder'],['father','Vater','vader'],['brother','Bruder','broer'],['daughter','Tochter','dochter']]
     .map(function(r){return '<tr><td><span class="sp" data-say="'+r[0]+'">'+r[0]+'</span></td>'+
       '<td><span class="sp" data-say="'+r[1]+'" data-lang="de-DE">'+r[1]+'</span></td>'+
       '<td><span class="sp" data-say="'+r[2]+'" data-lang="nl-NL">'+r[2]+'</span></td></tr>'}).join('')+'</table>'+
    '<table class="st l"><caption>🏰 跟法文像（1066 年借來）</caption><tr><th>英文</th><th>法文</th></tr>'+
    [['uncle','oncle'],['aunt','tante'],['cousin','cousin']]
     .map(function(r){return '<tr><td><span class="sp" data-say="'+r[0]+'">'+r[0]+'</span></td>'+
       '<td><span class="sp" data-say="'+r[1]+'" data-lang="fr-FR">'+r[1]+'</span></td></tr>'}).join('')+'</table></div>',
  lines:['<b>看一個字像誰</b>，就知道它從哪裡來']}
])},

/* daughter 的重要補充：英文丟掉的聲音，德文／荷蘭文還留著。
   使用者 2026-09-19 指定要做成秒懂動畫，並附 100% 可查證的出處。
   不放進 daughter.html（三幕結構不動），獨立成一頁，由 daughter 頁的「✨ 補充」進來。 */
{file:'daughter-gh.html',title:'daughter 的 gh 去哪了',src:'daughter-gh',
 back:{href:'daughter.html',label:'← 回 單字卡'},
 S:[
 {tag:'重要補充',emoji:'👧',mid:'daughter 的 gh，以前唸得出來',
  lines:['怎麼知道？<b>去聽德文就知道了</b>']},

 {tag:'德文',emoji:'🇩🇪',say:'Tochter',sayLang:'de-DE',
  h:'<div class="en in d1">To<span class="keep">ch</span>ter</div>',
  lines:['德文的「女兒」寫成 <b>Tochter</b>','中間的 <b>ch</b> 到今天<b>還在發音</b>（喉嚨後面的摩擦音）']},

 {tag:'荷蘭文',emoji:'🇳🇱',say:'dochter',sayLang:'nl-NL',
  h:'<div class="en in d1">do<span class="keep">ch</span>ter</div>',
  lines:['荷蘭文的「女兒」寫成 <b>dochter</b>','<b>ch</b> 也<b>還在發音</b>']},

 {tag:'英文',emoji:'👧',say:'daughter',
  h:'<div class="en in d1">dau<span class="mute">gh</span>ter</div>',
  lines:['英文 daughter 和它們是<b>同一個字的不同分支</b>',
         '<b>聲音只有英文丟掉了，字母還留著</b>']},

 {tag:'自己聽聽看',emoji:'🔊',mid:'用 Google 翻譯放一次 Tochter',
  lines:['<b>蘇格蘭腔</b>的 <b>dochter</b>、<b>nicht</b>（night）也還留著這個音',
         '（出處按右下角「📖 出處」）']}
]},

{file:'why-more.html',title:'更多字的故事',src:'why-more',
 S:[
 {emoji:'🌍',mid:'不只家人單字',lines:['很多你認識的字，也有故事']},

 {tag:'從台灣出海',emoji:'🍵🚢',emojiCls:'fly',say:'tea',
  h:'<div class="en in d1">{{tea}}</div>',
  lines:['台灣話的「茶」唸 <b class="nosay">tê</b>','坐船到外國，就變成 <b>tea</b>']},

 {tag:'也是台灣話',emoji:'🍅',say:'ketchup',
  h:'<div class="en in d1">{{ketchup}}</div>',
  lines:['台灣話的 <b class="nosay">kê-tsiap</b>（鮭汁）是魚做的醬','英文借去用，今天變成番茄醬']},

 {tag:'城市的名字',emoji:'🍔',say:'hamburger',
  h:'<div class="en in d1">{{hamburger}}</div>',
  lines:['來自德國的<b>漢堡市</b>，不是火腿','後來被切成 ham＋burger，才有 cheeseburger']},

 {tag:'人的名字',emoji:'🥪',say:'sandwich',
  h:'<div class="en in d1">{{sandwich}}</div>',
  lines:['這是一位<b>伯爵的名字</b>','他請人把肉夾在麵包中間，不用停下手邊的事']},

 {tag:'兩個字黏起來',emoji:'🍳',say:'breakfast',
  h:'<div class="en"><span class="fromL">{{break}}</span> ＋ <span class="fromR">{{fast}}</span></div>'+
    '<div class="en pop" style="animation-delay:1.2s;font-size:clamp(28px,5vh,52px)">{{breakfast}}</div>',
  lines:['合起來就是 <b>breakfast</b>（早餐）','睡了一整晚沒吃，早上<b>打破</b>它']},

 {tag:'一句話縮起來',emoji:'👋',say:'goodbye',
  h:'<div class="en squeeze">{{goodbye}}</div>',
  lines:['本來是一整句 <b>God be with ye</b>','（願神與你同在）說久了，縮成一個字']},

 {tag:'看出來了嗎',emoji:'🗣️⏳',mid:'每個字，都是這樣來的',
  lines:['從外國借來、兩個字黏起來、一句話縮起來']}
]}
];

const {TOCB,TOCHTML,TOCJS,TOCCSS}=require('./_toc');
/* 瑞典文語音檔（_audio_sv.js 做的）：有才載入，沒有就用瀏覽器語音 */
const SVJS=fs.existsSync(path.join(DIR,'audio','sv','aud.js'))?'<script src="audio/sv/aud.js"></script>':'';

const tpl=(P)=>`<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${P.title}｜${P.suffix||'單字小故事'}</title>
<!-- 本檔由 words/_build_story.js 產生，不要手改。 -->
<style>
@font-face{font-family:Andika;font-style:normal;font-weight:400;font-display:swap;
 src:url(${P.font||'fonts/'}andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-style:normal;font-weight:700;font-display:swap;
 src:url(${P.font||'fonts/'}andika-700.woff2) format("woff2")}

*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%}
body{margin:0;background:#000;color:#F2F2F2;
 font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif;
 display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;user-select:none}

#dots{display:flex;gap:9px;position:fixed;top:max(18px,env(safe-area-inset-top))}
#dots i{width:22px;height:4px;border-radius:99px;background:#2A2A2A;transition:background .3s}
#dots i.on{background:#9FB4C8}

.nav{position:fixed;top:0;bottom:0;width:clamp(68px,10vw,120px);border:0;background:none;
 color:#9FB4C8;font-size:clamp(38px,5.4vw,58px);font-family:inherit;line-height:1;
 display:flex;align-items:center;justify-content:center;cursor:pointer}
.nav:disabled{color:#202020;cursor:default}
.nav:active:not(:disabled){background:rgba(255,255,255,.05)}
#prev{left:0}#next{right:0}

#stage{width:100%;max-width:760px;padding:0 clamp(76px,11vw,130px);text-align:center;
 min-height:clamp(320px,62vh,560px);display:flex;flex-direction:column;align-items:center;justify-content:center;
 gap:clamp(8px,1.6vh,18px)}
.tag{font-size:clamp(13px,1.6vh,16px);color:#9FB4C8;letter-spacing:.4em;font-weight:700;padding-left:.4em}
.emoji{font-size:clamp(62px,12.4vh,112px);line-height:1.05}
.mid{font-size:clamp(25px,4.2vh,38px);font-weight:700;line-height:1.45;letter-spacing:.04em}
.en{font-size:clamp(38px,7vh,68px);font-weight:700;letter-spacing:.01em}
.sub{font-size:clamp(17px,2.4vh,23px);color:#D8D3C5;line-height:1.55}
.sub b{color:#F2F2F2;font-weight:700}
.hi{color:#9FB4C8}
.ar{color:#9FB4C8;font-size:.58em;vertical-align:middle}

#bar{position:fixed;bottom:max(20px,env(safe-area-inset-bottom));display:flex;gap:12px}
#bar button{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;
 font-size:16px;padding:11px 20px;min-height:48px;font-family:inherit;cursor:pointer}
#bar button:active{background:#2A2A2A}

.in{animation:rise .5s cubic-bezier(.2,.9,.3,1) both}
.d1{animation-delay:.10s}.d2{animation-delay:.28s}.d3{animation-delay:.46s}
@keyframes rise{0%{opacity:0;transform:translateY(20px) scale(.92)}100%{opacity:1;transform:none}}
.pop{animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
@keyframes pop{0%{opacity:0;transform:scale(.4)}100%{opacity:1;transform:scale(1)}}
/* 多出來的人淡掉（意思變窄） */
.extra{display:inline-block;animation:vanish 2.6s ease-in-out both}
@keyframes vanish{0%,45%{opacity:1;transform:none}100%{opacity:.10;transform:scale(.72)}}
/* þ 像一面小旗子 */
.flag{display:inline-block;color:#9FB4C8;animation:flag 1.8s ease-in-out both}
@keyframes flag{0%{opacity:0;transform:rotate(-14deg) scale(.5)}45%{opacity:1;transform:rotate(9deg) scale(1)}
 72%{transform:rotate(-6deg)}100%{opacity:1;transform:none}}
/* gh 的聲音慢慢消失 */
.mute{animation:mute 2.4s ease-in-out both}
@keyframes mute{0%,38%{color:#9FB4C8}100%{color:#2E2E2E}}
/* 多出來的人跑進來（意思變寬） */
.plus{display:inline-block;animation:plusin .8s cubic-bezier(.2,1.5,.4,1) both;animation-delay:1.1s}
@keyframes plusin{0%{opacity:0;transform:scale(.3)}100%{opacity:1;transform:none}}
/* 寶寶的 ma-ma / da-da */
.bub{display:inline-block;color:#9FB4C8;margin:0 .12em;
 animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
.b1{animation-delay:.15s}.b2{animation-delay:.52s}.b3{animation-delay:.89s}
/* 小孩從字裡冒出來 */
.emerge{animation:emerge .9s cubic-bezier(.2,1.2,.3,1) both;animation-delay:.55s}
@keyframes emerge{0%{opacity:0;transform:translateY(34px) scale(.5)}100%{opacity:1;transform:none}}
/* 坐船飄過來 */
.fly{animation:fly 1.2s cubic-bezier(.3,.8,.3,1) both}
@keyframes fly{0%{opacity:0;transform:translateX(-52px)}60%{opacity:1}100%{opacity:1;transform:none}}
/* 一整句話縮成一個字 */
.squeeze{animation:squeeze 1.3s cubic-bezier(.3,.9,.3,1) both}
@keyframes squeeze{0%{opacity:0;letter-spacing:.40em}100%{opacity:1;letter-spacing:.01em}}
/* 兩邊靠攏，黏成一個字 */
.fromL{display:inline-block;animation:fromL .9s cubic-bezier(.2,.9,.3,1) both}
.fromR{display:inline-block;animation:fromR .9s cubic-bezier(.2,.9,.3,1) both}
@keyframes fromL{0%{opacity:0;transform:translateX(-58px)}100%{opacity:1;transform:none}}
@keyframes fromR{0%{opacity:0;transform:translateX(58px)}100%{opacity:1;transform:none}}
/* 還在發音的 ch：聲音一直在震（德文／荷蘭文） */
.keep{display:inline-block;color:#9FB4C8;animation:throat 1.5s ease-in-out infinite}
@keyframes throat{0%,100%{transform:scale(1);text-shadow:0 0 0 rgba(159,180,200,0)}
 50%{transform:scale(1.13);text-shadow:0 0 26px rgba(159,180,200,.6)}}
/* 翻卡換頁 */
.turnR{animation:turnR .42s cubic-bezier(.25,.85,.3,1) both}
.turnL{animation:turnL .42s cubic-bezier(.25,.85,.3,1) both}
@keyframes turnR{0%{opacity:.2;transform:perspective(1500px) rotateY(50deg) translateX(22px) scale(.95)}
 100%{opacity:1;transform:none}}
@keyframes turnL{0%{opacity:.2;transform:perspective(1500px) rotateY(-50deg) translateX(-22px) scale(.95)}
 100%{opacity:1;transform:none}}
/* older 長大、younger 縮小（哥哥弟弟那一頁的主要動畫）。
   **動 font-size 不要動 transform**：transform 放大的字會壓到隔壁那個字，
   font-size 會讓旁邊的字跟著讓開，投影出來才不會黏在一起。 */
.grow{display:inline-block;animation:grow 1.4s cubic-bezier(.2,1.2,.3,1) both;animation-delay:.3s}
@keyframes grow{0%{font-size:.80em}62%{font-size:1.30em}100%{font-size:1.22em}}
.shrink{display:inline-block;animation:shrink 1.4s cubic-bezier(.2,1.2,.3,1) both;animation-delay:.3s}
@keyframes shrink{0%{font-size:1.24em}62%{font-size:.74em}100%{font-size:.80em}}
/* 用不到的東西自己掉下去（平常不用講大小） */
.drop{animation:drop 2.4s cubic-bezier(.4,.1,.7,1) both}
@keyframes drop{0%,38%{opacity:1;transform:none}100%{opacity:0;transform:translateY(46px) rotate(-13deg)}}
/* 哥哥弟弟那一頁：一幕一個重點，字要大到最後一排看得清楚（使用者 2026-09-20） */
.en.big1{font-size:clamp(30px,min(5.6vh,7vw),62px);line-height:1.25}
.en.big2{font-size:clamp(20px,min(3.6vh,4.4vw),38px);line-height:1.9}
.en.big3{font-size:clamp(19px,min(3.4vh,4.2vw),36px);line-height:1.8}
.mean{font-size:clamp(26px,min(4.6vh,5.6vw),50px);font-weight:700;color:#F2F2F2;
 letter-spacing:.06em;animation-delay:.9s}
.eBig{font-size:1.28em;display:inline-block}
.eSml{font-size:.62em;display:inline-block;vertical-align:middle}
.bad{color:#E07A6B;text-decoration:line-through;text-decoration-thickness:.09em}
.en.wrong{color:#9A8A86}
/* ✅ ❌ 蓋章 */
.stamp{display:inline-block;animation:stamp .6s cubic-bezier(.2,1.8,.4,1) both;animation-delay:.3s}
@keyframes stamp{0%{opacity:0;transform:scale(2.4) rotate(-18deg)}100%{opacity:1;transform:none}}
/* ── 2026-09-24 使用者指定：猜猜看／地圖／語言家族 ─────────────────── */
.hi2{color:#F0B45C}
.odd{display:flex;align-items:center;gap:.6em;justify-content:center;opacity:.95}
.oddtag{font-size:.5em;color:#F0B45C;border:1px dashed #6B4E1A;border-radius:99px;padding:3px 10px;font-weight:700}
.flag{width:1.5em;height:1em;vertical-align:-.12em;border-radius:2px;flex:0 0 auto}
.guess{display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1.2vh,12px);width:100%}
.gtop{min-height:1.4em;font-size:clamp(20px,3.3vh,32px);font-weight:700}
.gunk{color:#8E8E8E;font-weight:700}
.gans{display:none;align-items:center;gap:.35em;font-weight:700;color:#FFD24A;white-space:nowrap}
.gans em{font-style:normal;font-size:.72em;color:#D8D3C5;font-weight:400}
.guess.rev .gans{display:inline-flex;animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
.guess.rev .gunk{display:none}
.gmode{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;
 font-size:clamp(13px,1.9vh,17px);color:#8E8E8E}
.gmode button{background:#141414;border:1px solid #333;color:#D8D3C5;border-radius:99px;font-family:inherit;
 font-size:clamp(14px,2vh,18px);padding:4px 14px;min-height:36px;cursor:pointer}
.gmode button.on{background:#9FB4C8;border-color:#9FB4C8;color:#0A0A0A;font-weight:700}
.glist{display:flex;flex-direction:column;gap:clamp(3px,.6vh,7px);width:100%;max-width:640px}
.grow{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#0C0C0C;
 border:1px solid #232323;border-radius:14px;padding:clamp(2px,.5vh,6px) clamp(12px,1.8vw,20px);
 animation:fadeOnly .45s ease both}
.grow .gw{font-size:clamp(22px,3.7vh,38px);font-weight:700;color:#F2F2F2;border-bottom:0}
.gm{font-size:clamp(18px,3vh,30px);font-weight:700;color:#9FB4C8;white-space:nowrap}
.gm>span{display:none;border-bottom:0}
.guess[data-m="0"] .gm .m0,.guess[data-m="zh"] .gm .mzh,.guess[data-m="en"] .gm .men,.guess[data-m="de"] .gm .mde{display:inline;
 animation:pop .45s cubic-bezier(.2,1.5,.4,1) both}
.gm .m0{color:#4A4A4A}
.grev{background:#2A2208;border:1px solid #FFD24A;color:#FFD24A;border-radius:99px;font-family:inherit;
 font-weight:700;font-size:clamp(16px,2.3vh,21px);padding:6px 20px;min-height:42px;cursor:pointer}
.guess.rev .grev{background:#141414;border-color:#444;color:#8E8E8E}
.gen{font-size:clamp(20px,3.2vh,30px);color:#D8D3C5;display:flex;align-items:baseline;gap:.4em}
.gen .gbig{font-size:1.7em;font-weight:700;color:#F2F2F2;border-bottom:0}
.gen em{font-style:normal;color:#9FB4C8;font-weight:700}
.guess.many .grow .gw{font-size:clamp(21px,3.7vh,36px)}
.guess.many .gunk,.guess.many .gans{font-size:clamp(17px,2.8vh,26px)}
.guess.many.rev .grow.near{border-color:#FFD24A;background:#1D1908;animation:nearGlow 1.2s ease-in-out .5s 2}
@keyframes nearGlow{0%,100%{transform:none}50%{transform:scale(1.04);box-shadow:0 0 22px rgba(255,210,74,.45)}}
.gwhy{display:none;font-size:clamp(16px,2.6vh,24px);color:#F2F2F2;text-align:center}
.mbelow{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:8px}
.mbelow span{background:#1A1208;border:1px solid #5A3E1C;color:#F3B06B;border-radius:99px;font-weight:700;
 font-size:clamp(14px,2.2vh,20px);padding:3px 10px;white-space:nowrap;animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
.gwhy b{color:#FFD24A}
.guess.rev .gwhy{display:block;animation:fadeOnly .5s ease .4s both}
/* 公布以後：為什麼這麼像（2026-09-26）——字母密碼 t ⇄ z、th ⇄ d、gh ⇄ ch 一格一格亮 */
.gstory{display:none;flex-wrap:wrap;gap:clamp(4px,.8vw,10px);justify-content:center;align-items:center;margin-top:2px}
.cx>span{display:inline-flex;align-items:baseline;gap:.2em;white-space:nowrap}
/* 公布答案以後，清單排緊一點，字母密碼才放得下 */
.guess.many.rev .grow{padding-top:0;padding-bottom:0}
.guess.many.rev .gen{font-size:clamp(17px,2.6vh,26px)}
.guess.rev .gstory{display:flex}
.cx{display:inline-flex;align-items:center;gap:.35em;background:#0B1620;border:1px solid #29465E;border-radius:14px;
 padding:.08em .5em;font-size:clamp(16px,2.8vh,28px);font-weight:700;color:#F2F2F2;opacity:0;animation:cxIn .6s cubic-bezier(.2,1.4,.4,1) forwards}
.cx:nth-child(2){animation-delay:.5s}.cx:nth-child(3){animation-delay:1s}.cx:nth-child(4){animation-delay:1.5s}
.cx .e{color:#FFD24A}.cx .d{color:#5AD1FF}.cx .n{color:#FF9EC7}.cx .x{color:#8CF08A}
.cx i{font-style:normal;color:#5E7A8E;font-size:.8em;animation:cxAr 1.2s ease-in-out infinite}
.cx em{font-style:normal;font-size:.62em;color:#BFD3E6;font-weight:400}
@keyframes cxIn{from{opacity:0;transform:translateY(14px) scale(.8)}to{opacity:1;transform:none}}
@keyframes cxAr{0%,100%{transform:none}50%{transform:translateX(4px)}}
/* 記住這件事：字放大、每一個字底下有中文（2026-09-26） */
.rem{border-collapse:separate;border-spacing:clamp(4px,.8vw,10px) clamp(3px,.6vh,8px);margin:0 auto}
.rem th{font-size:clamp(16px,2.6vh,24px);color:#9FB4C8;font-weight:700;padding:0 .4em}
.rem th .flag{width:1.4em;vertical-align:-.2em;margin-right:.2em}
.rem td{font-size:clamp(24px,4.4vh,44px);font-weight:700;text-align:center;background:#0C0C0C;border:1px solid #232323;
 border-radius:14px;padding:.08em .5em;line-height:1.15;opacity:0;animation:cxIn .5s ease forwards}
.rem td em{display:block;font-style:normal;font-size:.5em;color:#D8D3C5;font-weight:700}
.rem td.z{color:#FFE9A8;font-size:clamp(22px,4vh,40px)}
.rem td .e{color:#FFD24A}.rem td .d{color:#5AD1FF}
/* 三兄弟坐船：1500 年前 德國北部、荷蘭一帶的人坐船到英國 ➜ 英文、德文、荷蘭文是一家人 */
.bro3{display:flex;align-items:center;justify-content:center;gap:clamp(8px,1.6vw,20px);font-size:clamp(17px,2.8vh,26px);
 color:#F2F2F2;font-weight:700;flex-wrap:wrap}
.bro3 .b3{display:inline-flex;align-items:center;gap:.3em;background:#0C1A10;border:1px solid #2B5236;border-radius:99px;
 padding:.15em .7em;opacity:0;animation:cxIn .6s ease forwards}
.bro3 .b3 .flag{width:1.5em}
.bro3 .b3:nth-child(1){animation-delay:.2s}.bro3 .b3:nth-child(3){animation-delay:.8s}.bro3 .b3:nth-child(5){animation-delay:1.4s}
.bro3 .sail{display:inline-block;animation:sail 2.4s ease-in-out infinite}
@keyframes sail{0%,100%{transform:translateX(-6px) rotate(-4deg)}50%{transform:translateX(6px) rotate(4deg)}}
/* 字母對照的大卡：一個字母一個字母比 */
.lk{display:grid;grid-template-columns:auto auto auto;align-items:center;justify-content:center;column-gap:clamp(10px,2vw,26px);
 row-gap:clamp(4px,1vh,10px)}
.lk .w{font-size:clamp(30px,6vh,60px);font-weight:700;opacity:0;animation:cxIn .6s ease forwards;border-bottom:0}
.lk .w .e{color:#FFD24A;display:inline-block;animation:lkGlow 1.6s ease-in-out 1.2s 2}
.lk .w .d{color:#5AD1FF;display:inline-block;animation:lkGlow 1.6s ease-in-out 1.2s 2}
.lk .w .n{color:#FF9EC7;display:inline-block;animation:lkGlow 1.6s ease-in-out 1.2s 2}
.lk .fl{font-size:clamp(14px,2vh,19px);color:#9FB4C8;text-align:center;opacity:0;animation:cxIn .5s ease forwards}
.lk .fl .flag{width:1.6em;display:block;margin:0 auto 2px}
.lk .zz{grid-column:1/-1;text-align:center;font-size:clamp(18px,3vh,28px);color:#D8D3C5;font-weight:700;opacity:0;animation:cxIn .5s ease 1.8s forwards}
@keyframes lkGlow{0%,100%{transform:none;text-shadow:none}50%{transform:scale(1.35) translateY(-4px);text-shadow:0 0 18px currentColor}}
/* 為什麼尾巴都一樣：四欄對齊，一欄 ＝ 一個家人（以前 ➜ 英文 ➜ 德文） */
.tails{display:grid;grid-template-columns:repeat(4,auto);justify-content:center;align-items:baseline;
 column-gap:clamp(12px,2vw,24px);row-gap:clamp(2px,.6vh,6px);font-size:clamp(20px,3.6vh,32px);font-weight:700}
.tails .tcap{grid-column:1/-1;font-style:normal;font-size:clamp(13px,1.9vh,17px);color:#8E8E8E;font-weight:400;
 text-align:center;margin-top:clamp(2px,.8vh,8px)}
.tails i{font-style:normal;color:#FFD24A;display:inline-block;animation:tglow 1.4s ease-in-out 1.2s 2}
.tails .old{color:#8E8E8E}
.tails .en2{animation:fadeOnly .5s ease .7s both}.tails .de2{animation:fadeOnly .5s ease 1.1s both}
.tails .sp{border-bottom:0;text-align:center}.tails .old{text-align:center}
.tarr{color:#4A4A4A;font-size:.7em;text-align:center;animation:fadeOnly .4s ease .4s both}
@keyframes tglow{0%,100%{transform:none;text-shadow:none}50%{transform:translateY(-.15em) scale(1.25);text-shadow:0 0 16px rgba(255,210,74,.9)}}
/* 新增的幕一律「只淡入、不位移」：位移到一半 #stage 會暫時變高，_verify.js 會判定溢出（家庭樹踩過同一個坑） */
@keyframes fadeOnly{from{opacity:0}to{opacity:1}}
.fo{animation:fadeOnly .5s ease .1s both}
/* 內容很滿的兩頁（parts／world）：最下面那行字是從下面滑上來的，滑到一半會多 20px，先讓出來 */
.sa #stage{padding-bottom:24px}
.sa #stage .in{animation-name:fadeOnly}
/* 地圖 */
.mapbox{width:min(92vw,500px,calc(40vh * 1.08))}
.map{display:block;width:100%;height:auto}
.map .mt{font-size:13px;font-weight:700;fill:#F2F2F2;opacity:0;animation:mtIn .5s ease both}
.map .mt.big{font-size:16px}.map .mt.small{font-size:9px}
.map .mt.g{fill:#8FD19E}.map .mt.l{fill:#F3B06B}.map .mt.e{fill:#FFD24A}.map .mt.say{fill:#FFD24A;font-size:12px}
.map .mt.chip{fill:#F3B06B;font-size:12px}
@keyframes mtIn{from{opacity:0}to{opacity:1}}
.map .md{fill:#FFD24A;opacity:0;animation:mtIn .4s ease both}
.map .md.pulse{animation:mtIn .4s ease both,mdP 1.4s ease-in-out infinite}
.map .md.l{fill:#F3B06B}
@keyframes mdP{0%,100%{r:6}50%{r:11}}
.map .ma{fill:none;stroke-width:3.2;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100;
 animation:maDraw 1.2s ease forwards}
.map .ma.g{stroke:#8FD19E}.map .ma.l{stroke:#F3B06B}
@keyframes maDraw{to{stroke-dashoffset:0}}
.map .mboat{font-size:18px}
.map .mb{opacity:0;animation:mbGo 2s ease-in-out both}
@keyframes mbGo{0%{opacity:0;transform:none}10%{opacity:1}90%{opacity:1;transform:translate(var(--dx),var(--dy))}
 100%{opacity:1;transform:translate(var(--dx),var(--dy))}}
/* 語言也有家人 */
.ltree{display:flex;flex-direction:column;align-items:center;width:100%;max-width:660px}
.lroot{font-size:clamp(20px,3.4vh,32px);font-weight:700;color:#FFD24A;display:flex;flex-direction:column;align-items:center}
.lroot em{font-style:normal;font-size:.55em;color:#8E8E8E;font-weight:400}
.llines{width:100%;height:clamp(26px,4.5vh,44px)}
.llines path{fill:none;stroke:#5A6E7E;stroke-width:3;stroke-dasharray:100;stroke-dashoffset:100;
 animation:maDraw .7s ease forwards;vector-effect:non-scaling-stroke}
.lkids{display:grid;grid-template-columns:repeat(4,1fr);width:100%;gap:8px}
.lkid{display:flex;flex-direction:column;align-items:center;gap:4px;background:#0C0C0C;border:1px solid #232323;
 border-radius:14px;padding:8px 4px;animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
.lkid b{font-size:clamp(14px,2.2vh,20px);color:#D8D3C5}
.lkid .sp{font-size:clamp(20px,3.4vh,32px);font-weight:700;color:#F2F2F2;border-bottom:0}
.lkid .flag{width:2.4em;height:1.6em}
/* 2026-09-25：地圖放大、國名、時間軸、歐洲在哪裡、為什麼五國、統整表 */
.sa .mapbox{width:min(94vw,680px,calc(50vh * 1.08))}
.map .mc{font-size:11px;fill:#6F8797;font-weight:700;letter-spacing:.05em}
.map .cpop{opacity:0;animation:mtIn .5s ease both}
.tline{display:flex;align-items:center;gap:3px;flex-wrap:wrap;justify-content:center;font-size:clamp(11px,1.7vh,15px)}
.tline span{color:#4A4A4A;border:1px solid #2A2A2A;border-radius:99px;padding:1px 7px;white-space:nowrap}
.tline span.past{color:#8E8E8E;border-color:#3A3A3A}
.tline span.now{color:#000;background:#FFD24A;border-color:#FFD24A;font-weight:700;animation:pop .5s cubic-bezier(.2,1.5,.4,1) both}
.tline i{font-style:normal;color:#3A3A3A;font-size:.8em}
.where{display:flex;align-items:center;justify-content:center;gap:clamp(10px,2vw,26px);width:100%}
.where>div{display:flex;flex-direction:column;align-items:center;gap:4px}
.where .wic{font-size:clamp(56px,11vh,110px);line-height:1}
.where b{font-size:clamp(26px,4.6vh,46px)}
.where em{font-style:normal;color:#9FB4C8;font-size:clamp(15px,2.4vh,22px)}
.wfly{position:relative;width:clamp(160px,34vw,380px);height:clamp(60px,10vh,100px)}
.wfly i{position:absolute;left:0;right:0;top:50%;border-top:3px dashed #3A4E5E}
.wfly .plane{position:absolute;right:0;top:50%;font-size:clamp(34px,6vh,58px);transform:translate(0,-50%) scaleX(-1);
 animation:plane 2.6s ease-in-out .4s both}
@keyframes plane{0%{right:0}100%{right:calc(100% - 1.2em)}}
.flags6{display:flex;gap:clamp(6px,1.2vw,14px);flex-wrap:wrap;justify-content:center}
.flags6 span{display:inline-flex;align-items:center;gap:6px;background:#0C0C0C;border:1px solid #2A2A2A;border-radius:99px;
 padding:4px 12px;font-size:clamp(16px,2.6vh,24px);animation:pop .5s cubic-bezier(.2,1.5,.4,1) both}
.why5{display:flex;flex-direction:column;gap:clamp(8px,1.6vh,16px);width:100%;max-width:720px}
.w5{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:14px;align-items:center;text-align:left;
 border-radius:16px;padding:clamp(8px,1.4vh,14px) 18px;animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
.w5 .w5f{grid-row:1/3;display:flex;gap:4px}.w5 .w5f .flag{width:2.2em;height:1.5em}
.w5 b{font-size:clamp(22px,3.8vh,36px)}.w5 em{font-style:normal;font-size:clamp(17px,2.8vh,26px);color:#D8D3C5}
.w5.g{background:#0C1A10;border:1px solid #2B5236}.w5.l{background:#1A1208;border:1px solid #5A3E1C}.w5.l2{background:#1A0E0E;border:1px solid #5A2A2A}
.sumt{display:flex;gap:clamp(10px,2vw,24px);flex-wrap:wrap;justify-content:center;align-items:flex-start;width:100%}
.st{border-collapse:separate;border-spacing:0;border-radius:16px;overflow:hidden;font-size:clamp(17px,3.1vh,30px);font-weight:700}
.st caption{font-size:clamp(16px,2.5vh,24px);padding-bottom:4px;font-weight:700;white-space:nowrap}
.st th{font-size:clamp(12px,1.8vh,16px);font-weight:400;color:#9A9A9A;padding:2px 10px}
.st td{padding:clamp(1px,.4vh,5px) clamp(8px,1.4vw,16px);text-align:center}
.st td .sp{border-bottom:0}
.st.g{background:#0C1A10;border:2px solid #3E8A55}.st.g caption{color:#8FF0A8}.st.g td{color:#EFFFF3}
.st.g td:nth-child(n+2){color:#8FF0A8}
.st.l{background:#1A1208;border:2px solid #9A6A2A}.st.l caption{color:#FFC27A}.st.l td{color:#FFF6EA}
.st.l td:nth-child(2){color:#FFC27A}
.st tr:nth-child(even) td{background:rgba(255,255,255,.04)}
/* 記住這件事：兩個家族 */
.sumg{display:flex;flex-direction:column;gap:clamp(8px,1.6vh,16px);width:100%;max-width:700px}
.sg{display:flex;flex-direction:column;gap:4px;border-radius:16px;padding:clamp(8px,1.4vh,14px) 18px;text-align:center}
.sg b{font-size:clamp(18px,2.8vh,26px)}.sg em{font-style:normal;color:#8E8E8E;font-size:clamp(14px,2vh,18px)}
.sg span{font-size:clamp(20px,3.2vh,32px);font-weight:700;display:flex;gap:.5em;flex-wrap:wrap;justify-content:center}
.sg.g{background:#0C1A10;border:1px solid #2B5236}.sg.g b{color:#8FD19E}
.sg.l{background:#1A1208;border:1px solid #5A3E1C}.sg.l b{color:#F3B06B}
/* 📑 目次放在左上角：底部按鈕列已經滿了，再塞一顆「唸一次」就不在正中央（直式 iPad） */
.tocfix{position:fixed;top:max(10px,env(safe-area-inset-top));left:12px;z-index:30;background:#1E1E1E;border:1px solid #4A4A4A;
 color:#F2F2F2;border-radius:99px;font-family:inherit;font-size:15px;padding:8px 14px;cursor:pointer}
/* 直式：一樣的尾巴排兩欄 */
@media (max-aspect-ratio:1/1){.tl4{grid-template-columns:repeat(2,auto)!important}}
/* 2026-09-25 使用者指定：單字結構／環遊世界的主標題、次標題放大 */
.sa .tag{font-size:clamp(22px,3.6vh,34px);letter-spacing:.14em;color:#BFD3E6}
.sa .sub{font-size:clamp(19px,2.8vh,27px)}
/* 一樣的尾巴：每一個字底下就是它的中文 */
.tl4{display:grid;grid-template-columns:repeat(4,auto);justify-content:center;column-gap:clamp(14px,2.4vw,30px);row-gap:8px}
.tw{display:inline-flex;flex-direction:column;align-items:center;gap:2px}
.tw .sp{font-size:clamp(28px,5.4vh,54px);font-weight:700;border-bottom:0}
.tw em{font-style:normal;font-size:clamp(20px,3.4vh,34px);color:#D8D3C5;font-weight:700}
.odd .tw .sp{font-size:clamp(26px,5vh,50px)}
.rs{color:#FF5A5A!important}
.golink{display:inline-block;margin-top:6px;background:#10301F;border:2px solid #39D98A;color:#F2F2F2;border-radius:99px;
 text-decoration:none;font-weight:700;font-size:clamp(17px,2.6vh,24px);padding:10px 22px}
/* 念到哪一個字，那一個字就亮 */
.speak{color:#FFD24A!important;text-shadow:0 0 16px rgba(255,210,74,.8);transform:scale(1.12);display:inline-block;transition:transform .15s}
/* 底部按鈕列：「🔊 唸一次」放在正中央（使用者 2026-09-24 指定） */
#bar.c3{left:0;right:0;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;
 gap:clamp(6px,1vw,12px);padding:0 clamp(8px,1.5vw,16px)}
#bar.c3 .bl,#bar.c3 .br{display:flex;gap:clamp(5px,.8vw,10px);align-items:center}
#bar.c3 .bl{justify-content:flex-end}#bar.c3 .br{justify-content:flex-start}
#bar.c3 .bl button,#bar.c3 .br button{font-size:clamp(12.5px,1.65vw,16px);padding:10px clamp(9px,1.3vw,18px);white-space:nowrap}
#bar.c3 #say{font-size:clamp(17px,2.2vw,21px);font-weight:700;padding:12px clamp(18px,2.6vw,30px);
 background:#10301F;border-color:#39D98A;min-height:54px;white-space:nowrap}
.reduce *{animation:none!important;transition:none!important}
/* 2026-09-26 使用者指定：畫面左上方寫這一頁的主題（例：🧩 單字結構） */
.topicfix{position:fixed;top:max(10px,env(safe-area-inset-top));left:112px;z-index:30;color:#FFD66B;font-weight:700;
 font-size:clamp(16px,2.4vh,22px);letter-spacing:.08em;padding:8px 4px;pointer-events:none;white-space:nowrap}
/* 每一幕先來一題「猜猜看」（使用者 2026-09-26 指定：故事融入暖身題），答了才揭曉故事 */
.qz{display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,16px);width:100%;max-width:980px}
.qz .qq{font-size:clamp(24px,4.6vh,44px);font-weight:700;line-height:1.35;text-align:center;color:#FFF}
.qz .qq b{color:#FFD24A}
.qz .qo{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(8px,1.4vh,14px);width:100%}
.qz .qo button{background:#0C0C0C;border:2px solid #2E2E2E;border-radius:18px;color:#F2F2F2;font-family:inherit;
 font-size:clamp(20px,3.8vh,36px);font-weight:700;line-height:1.25;padding:clamp(10px,1.8vh,18px) 14px;cursor:pointer;
 animation:qIn .45s cubic-bezier(.2,1.3,.4,1) both}
.qz .qo button:nth-child(2){animation-delay:.08s}.qz .qo button:nth-child(3){animation-delay:.16s}.qz .qo button:nth-child(4){animation-delay:.24s}
@keyframes qIn{from{opacity:0;transform:translateY(16px) scale(.9)}to{opacity:1;transform:none}}
.qz .qo button.ok{background:#0F3323;border-color:#39D98A;animation:qOk .6s ease}
.qz .qo button.bad{background:#3A1111;border-color:#FF5E5E;animation:qNo .45s}
.qz .qo button.dim{opacity:.35}
@keyframes qOk{50%{transform:scale(1.08)}}
@keyframes qNo{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
.qz .qskip{background:none;border:0;color:#7E8A94;font-family:inherit;font-size:clamp(14px,2vh,18px);text-decoration:underline;cursor:pointer}
.qz .qres{font-size:clamp(26px,5vh,48px);font-weight:700;animation:qIn .5s cubic-bezier(.2,1.6,.4,1) both}
.qz .qres.ok{color:#39D98A}.qz .qres.no{color:#FFB35A}
.qwait .rv{display:none}
.qdone .qz .qo,.qdone .qz .qskip{display:none}
.qdone .qz{gap:4px}
.qdone .qz .qq{font-size:clamp(17px,2.6vh,24px);color:#9E9E9E}
/* 故事頁字放大（使用者 2026-09-26：標題和說明文字放大） */
.big .tag{font-size:clamp(22px,3.6vh,34px);letter-spacing:.14em;color:#BFD3E6}
.big .sub{font-size:clamp(21px,3.4vh,32px);line-height:1.45}
.big .mid{font-size:clamp(34px,6.4vh,60px)}
${TOCCSS}
${PH.CSS}
${SRC.CSS}
${P.css||''}
</style>
${P.svjs!=null?P.svjs:SVJS}
</head>
<body class="${[P.sayAll?'sa':'',P.big?'big':''].join(' ').trim()}">
<div id="dots"></div>
<button class="nav" id="prev" aria-label="上一頁">&#8592;</button>
<div id="stage"></div>
<button class="nav" id="next" aria-label="下一頁">&#8594;</button>
${P.sayAll?`<div id="bar" class="c3"><span class="bl">${PH.btnSlow}${PH.btnMode}<button id="again">▶ 從頭看</button></span><button id="say">🔊 唸一次</button><span class="br">${P.back?`<button id="back">${P.back.label}</button>`:''}${P.fwd?`<button id="fwd">${P.fwd.label}</button>`:''}<button id="home">🏠 首頁</button>${SRC.btn}</span></div>`:
`<div id="bar"><button id="say">🔊 念一次</button>${PH.btnSlow}${PH.btnMode}<button id="again">▶ 從頭看</button>${P.back?`<button id="back">${P.back.label}</button>`:''}${P.fwd?`<button id="fwd">${P.fwd.label}</button>`:''}<button id="home">🏠 首頁</button>${SRC.btn}</div>`}
<button id="tocb" class="tocfix">📑 目次</button>
<div class="topicfix">${P.topic||(/parts/.test(P.file)?'🧩 單字結構':/why/.test(P.file)?'📜 單字故事':/world/.test(P.file)?'🌍 環遊世界':'📖 '+P.title)}</div>
${TOCHTML}
${SRC.html(P.srcRows||SRC.P[P.src||'why'])}

<script>
${PH.JS}

var S=${JSON.stringify(P.S,null,1)};


function draw(s){
 var h="";
 if(s.emoji)h+='<div class="emoji '+(s.emojiCls||"pop")+'">'+s.emoji+'</div>';
 if(s.mid)h+='<div class="mid in d1">'+s.mid+'</div>';
 if(s.h)h+=s.h;
 (s.lines||[]).forEach(function(t,k){h+='<div class="sub in d'+(k+2)+'">'+t+'</div>'});
 var t=s.tag?'<div class="tag in">'+s.tag+'</div>':'';
 /* 猜猜看：先答題，答了（或按「直接看答案」）才揭曉 */
 if(s.q){var o=s.q.o.map(function(x,n){return{x:x,n:n}});
  for(var a=o.length-1;a>0;a--){var b=Math.floor(Math.random()*(a+1)),c=o[a];o[a]=o[b];o[b]=c}
  return PH.expand(t+'<div class="qz"><div class="qq">🤔 '+s.q.q+'</div><div class="qo">'+
   o.map(function(x){return '<button data-ok="'+(x.n===0?1:0)+'">'+x.x+'</button>'}).join('')+
   '</div><button class="qskip">👀 直接看答案</button><div class="qresw"></div></div><div class="rv">'+h+'</div>')}
 return PH.expand(t+h);
}
function qAns(b){
 if(!stage.classList.contains("qwait"))return;
 var s=S[i];if(!s.q)return;
 var ok=b&&b.getAttribute("data-ok")==="1";
 [].forEach.call(stage.querySelectorAll(".qo button"),function(x){
  x.classList.add(x.getAttribute("data-ok")==="1"?"ok":(x===b?"bad":"dim"))});
 var r=stage.querySelector(".qresw");
 var right=s.q.o[0].replace(/<[^>]+>/g,"");
 if(r)r.innerHTML='<div class="qres '+(ok?'ok':'no')+'">'+(b?(ok?'🎉 答對了！':'😮 答案是：'+s.q.o[0]):'✅ 答案是：'+s.q.o[0])+'</div>';
 setTimeout(function(){stage.classList.remove("qwait");stage.classList.add("qdone");PH.autoSay(stage)},b?900:200);
}

var i=0,reduce=false;
try{reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}
if(reduce)document.body.classList.add("reduce");

var dots=document.getElementById("dots");
for(var k=0;k<S.length;k++)dots.appendChild(document.createElement("i"));

/* 唸一次：這一幕看得到的每一個字，一個一個唸完，念到哪個字那個字就亮
   （使用者 2026-09-24 指定，parts.html／world.html）。外語照各自的語言唸。 */
var SAYALL=${P.sayAll?1:0},chainId=0;
function visible(el){if(!el.getClientRects().length)return false;
 for(var p=el;p&&p!==document.body;p=p.parentElement){var cs=getComputedStyle(p);
  if(cs.display==="none"||cs.visibility==="hidden")return false}return true}
function sayAll(){
 var els=[].filter.call(stage.querySelectorAll(".phw,.sp"),function(el){
  return visible(el)&&!(el.parentElement&&el.parentElement.closest(".phw,.sp"))});
 PH.sayChain(els);    /* 瑞典文會先查預先做好的語音檔（_phonics.js） */
}
function say(){if(SAYALL){sayAll();return}
 var w=S[i].say;if(!w)return;
 var el=stage.querySelector('.phw[data-say="'+w+'"]');
 if(el){PH.sayWord(el,S[i].sayLang)}else{PH.say(w,S[i].sayLang)}}

var stage=document.getElementById("stage");
function show(n){
 chainId++;PH.chainStop();
 var back=(n<i);
 i=Math.max(0,Math.min(S.length-1,n));
 window.SRCAT=S[i].src||"";   /* 按「📖 出處」直接跳到這一幕的證據（使用者 2026-09-25 指定） */
 stage.innerHTML=draw(S[i]);
 stage.classList.toggle("qwait",!!S[i].q);stage.classList.remove("qdone");
 PH.autoSay(stage);      // 補充單字、字詞、用法都可以點來聽
 if(!reduce){stage.classList.remove("turnR","turnL");void stage.offsetWidth;
  stage.classList.add(back?"turnL":"turnR")}
 var d=dots.children;
 for(var k=0;k<d.length;k++)d[k].className=(k===i?"on":"");
 document.getElementById("prev").disabled=(i===0);
 document.getElementById("next").disabled=(i===S.length-1);
}

document.getElementById("prev").addEventListener("click",function(){show(i-1)});
document.getElementById("next").addEventListener("click",function(){show(i+1)});
document.getElementById("again").addEventListener("click",function(){show(0)});
document.getElementById("say").addEventListener("click",say);
/* 猜猜看：公布答案／藏起來、右邊看中文／英文／德文 */
stage.addEventListener("click",function(e){
 var t=e.target;
 var qb=t.closest?t.closest(".qo button"):null;if(qb){qAns(qb);return}
 if(t.closest&&t.closest(".qskip")){qAns(null);return}
 var r=t.closest?t.closest(".grev"):null;
 if(r){var g=r.closest(".guess");var on=!g.classList.contains("rev");g.classList.toggle("rev",on);
  r.textContent=on?"🙈 藏起來再猜一次":"🔍 公布答案";return}
 var m=t.closest?t.closest(".gmode button"):null;
 if(m){var g2=m.closest(".guess");g2.setAttribute("data-m",m.getAttribute("data-m"));
  [].forEach.call(g2.querySelectorAll(".gmode button"),function(b){b.classList.toggle("on",b===m)});}
});
document.addEventListener("keydown",function(e){
 if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();show(i+1)}
 if(e.key==="ArrowLeft")show(i-1);
});

var jump=0;
try{var hh=parseInt((location.hash||"").slice(1),10);if(!isNaN(hh))jump=hh}catch(e){}
show(jump);
${P.back?`document.getElementById("back").addEventListener("click",function(){
 if(history.length>1){history.back()}else{location.href=${JSON.stringify(P.back.href)}}});`:''}
${P.fwd?`document.getElementById("fwd").addEventListener("click",function(){location.href=${JSON.stringify(P.fwd.href)}});`:''}
document.getElementById("home").addEventListener("click",function(){location.href=${JSON.stringify(P.home||'../index.html')}});
${TOCJS}
${SRC.JS}
</script>
</body>
</html>
`;

module.exports={tpl};
if(require.main===module){
 PAGES.forEach(p=>fs.writeFileSync(path.join(DIR,p.file),tpl(p),'utf8'));
 console.log('已產生：'+PAGES.map(p=>p.file).join('  '));
}
