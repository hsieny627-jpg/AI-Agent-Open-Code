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

/* FAM[0]=開場、FAM[1..17]=17 個家人單字、FAM[18]=結尾 */
const FAM=[
 {emoji:'👨‍👩‍👧‍👦',mid:'這些家人單字，為什麼長這樣？',
  lines:['每一個字，都有自己的故事']},

 {tag:'以前算的人更多',emoji:'👨‍👩‍👧‍👦<span class="extra">👴🧑‍🌾🧹</span>',say:'family',
  h:'<div class="en in d1">family</div>',
  lines:['很久以前的 family，<b>連家裡幫忙做事的人都算</b>',
         '（它不是 Father And Mother I Love You 拼出來的）']},

 {tag:'最早的意思',emoji:'👨‍👩',say:'parent',
  h:'<div class="en in d1">parent</div>'+
    '<div class="emoji emerge" style="font-size:clamp(40px,7.4vh,66px)">👶</div>',
  lines:['最早寫成 <b>parens</b>，意思是「<b>把孩子生下來的人</b>」',
         '一位是 a parent，兩位以上是 parents']},

 {tag:'寶寶最先會的音',emoji:'👶',say:'mother',
  h:'<div class="en"><span class="bub b1">ma</span><span class="bub b2">ma</span><span class="bub b3">ma</span></div>'+
    '<div class="en pop" style="animation-delay:1.3s">mom</div>',
  lines:['全世界的寶寶，最先發得出來的音就是 <b>ma</b>',
         '媽媽的英文 <b>mother</b>、<b>mom</b>，都從 <b>m</b> 開頭']},

 {tag:'不是剪短的',emoji:'👶',say:'father',
  h:'<div class="en"><span class="bub b1">da</span><span class="bub b2">da</span><span class="bub b3">da</span></div>'+
    '<div class="en pop" style="animation-delay:1.3s">dad</div>',
  lines:['<b>dad</b> 是寶寶自己先叫出來的','<b>不是</b>把 father 剪短的']},

 {tag:'不見了的字母',emoji:'🧒👦',say:'brother',
  h:'<div class="en in d1"><span class="flag">þ</span> <span class="ar">就是</span> th</div>',
  lines:['以前英文有一個字母 <b>þ</b>，像一面小旗子',
         'brother 以前寫成 <b>brōþor</b>']},

 {tag:'兩邊人唸得不一樣',emoji:'👧',say:'sister',
  h:'<div class="en in d1" style="font-size:clamp(17px,3vh,28px);line-height:1.6">'+
    '<span class="fromL">🏴 英國人唸 sweostor</span><br>'+
    '<span class="fromR">⛵ 維京人唸 systir</span></div>'+
    '<div class="en pop" style="animation-delay:1.3s">sister</div>',
  lines:['<b>同一個姊姊</b>，英國人唸 <b>sweostor</b>，坐船來的維京人唸 <b>systir</b>',
         '住在一起久了，<b>唸成今天的 sister</b>']},

 {tag:'唸起來一樣',emoji:'☀️👦',say:'son',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.8vh,46px)">'+
    '<span class="fromL">sun ☀️</span> <span class="ar">🔊</span> <span class="fromR">👦 son</span></div>',
  lines:['<b>sun</b>（太陽）和 <b>son</b>（兒子），<b>唸起來一模一樣</b>',
         '可是<b>拼法不一樣，意思也不一樣</b>']},

 {tag:'後來不唸了',emoji:'👧',say:'daughter',
  h:'<div class="en in d1">dau<span class="mute">gh</span>ter</div>',
  lines:['以前的人，<b>gh</b> 會唸出來','後來<b>不唸了，字母還是留著</b>']},

 {tag:'借來的 grand',emoji:'👴',say:'grandfather',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.8vh,48px)">'+
    '<span class="fromL hi">grand</span> <span class="ar">＋</span> <span class="fromR">father</span></div>'+
    '<div class="en pop" style="animation-delay:1.2s;font-size:clamp(26px,4.8vh,48px)">grandfather</div>',
  lines:['<b>grand</b> 是從法國借來的','裝在 father 前面，就變成<b>爸爸的爸爸</b>']},

 {tag:'同一個 grand',emoji:'👵',say:'grandmother',
  h:'<div class="en in d1" style="font-size:clamp(24px,4.4vh,42px)">'+
    '<span class="hi">grand</span> ＋ mother</div>'+
    '<div class="en pop" style="animation-delay:1.2s;font-size:clamp(24px,4.4vh,42px)">'+
    '<span class="hi">grand</span> ＋ ma</div>',
  lines:['同一個 <b>grand</b>，可以一直裝','裝在 mother 前面，就是<b>媽媽的媽媽</b>']},

 {tag:'以前只有一種',emoji:'🧓<span class="plus">👨👴</span>',say:'uncle',
  h:'<div class="en in d1">uncle</div>',
  lines:['uncle 最早只有一個意思：<b>媽媽的兄弟</b>（舅舅）',
         '現在叔叔、伯伯、姑丈、姨丈，<b>全都是 uncle</b>']},

 {tag:'以前只有一種',emoji:'👩‍🦰<span class="plus">👩👵</span>',say:'aunt',
  h:'<div class="en in d1">aunt</div>',
  lines:['aunt 最早也只有一個意思：<b>爸爸的姊妹</b>（姑姑）',
         '現在阿姨、伯母、舅媽，<b>全都是 aunt</b>']},

 {tag:'以前只有一種',emoji:'🧑<span class="plus">🧒👧👦</span>',say:'cousin',
  h:'<div class="en in d1">cousin</div>',
  lines:['cousin 以前只有一種：<b>阿姨的小孩</b>',
         '現在堂哥、表姊、堂弟、表妹，<b>全都是 cousin</b>']},

 {tag:'以前用的人更多',emoji:'👦<span class="extra">👴👶🧒</span>',say:'nephew',
  h:'<div class="en in d1">nephew</div>',
  lines:['<b>nepos</b> 以前很好用，孫子、姪子、外甥<b>都可以用這個字</b>',
         '現在只剩一種：<b>兄弟姊妹的兒子</b>']},

 {tag:'和 nephew 一樣',emoji:'👧<span class="extra">👵👶👩</span>',say:'niece',
  h:'<div class="en in d1">niece</div>',
  lines:['<b>neptia</b> 以前也一樣，<b>一大群人都可以用這個字</b>',
         '現在只剩一種：<b>兄弟姊妹的女兒</b>']},

 {tag:'藏在字裡的房子',emoji:'🏠',say:'husband',
  h:'<div class="en in d1"><span class="hi">hus</span>band</div>',
  lines:['<b>hus</b> 就是 <b>house</b>（房子）',
         'husband 以前的意思是「<b>管這個家的人</b>」']},

 {tag:'以前用的人更多',emoji:'👰<span class="extra">👩👩‍🦰👵</span>',say:'wife',
  h:'<div class="en in d1">wife</div>',
  lines:['以前的 <b>wīf</b>，<b>每個女生都可以用這個字</b>',
         '現在只剩一種：<b>太太</b>']},

 {tag:'所以',emoji:'🗣️⏳',mid:'字會變，就像綽號',
  lines:['<b>沒有人規定</b>，是大家一直這樣<b>發音</b>','<b>發音慢慢變，字就跟著變</b>']}
];

/* 第二頁的開場 */
const OPEN2={emoji:'👨‍👩‍👧‍👦',mid:'還有八個家人單字',
 lines:['故事也都不一樣']};

const PAGES=[
/* 19 幕一次放太長，拆成兩頁：前 9 個字／後 8 個字，各 10 幕 */
{file:'why.html',title:'家人單字的故事 ①',src:'why',S:FAM.slice(0,10)},
{file:'why-2.html',title:'家人單字的故事 ②',src:'why',S:[OPEN2].concat(FAM.slice(10,18),[FAM[18]])},

/* 哥哥／姊姊／弟弟／妹妹的說法（使用者 2026-09-19 指定要務必補充）。
   最重要的一句在第 1 幕：平常就說 my brother，**不用講大小**。
   older／younger 是辭典與教材採用的說法，big／little 是口語說法，兩個都對。
   「最常用」沒有做過語料庫次數統計（環境連不上 COCA／BNC），所以畫面上不寫排名。 */
{file:'older-younger.html',title:'哥哥還是弟弟',src:'older-younger',
 back:{href:'brother.html',label:'← 回 單字卡'},
 S:[
 {emoji:'🧒👦',mid:'哥哥？弟弟？',
  lines:['英文<b>都是 brother</b>']},

 {tag:'最常說的',emoji:'🗣️',say:'my brother',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.8vh,48px)">my brother　my sister</div>',
  lines:['平常就說 <b>my brother</b>、<b>my sister</b>',
         '<b>不用講大小</b> —— 英文人最常這樣說']},

 {tag:'要分大小',emoji:'🧒👦',say:'older brother',
  h:'<div class="en in d1" style="font-size:clamp(22px,4vh,38px);line-height:1.6">'+
    '<span class="fromL"><span class="hi">older</span> brother</span><br>'+
    '<span class="fromR"><span class="hi">younger</span> brother</span></div>',
  lines:['哥哥 ＝ <b>older brother</b>','弟弟 ＝ <b>younger brother</b>']},

 {tag:'姊姊妹妹一樣',emoji:'👧👩',say:'older sister',
  h:'<div class="en in d1" style="font-size:clamp(22px,4vh,38px);line-height:1.6">'+
    '<span class="fromL"><span class="hi">older</span> sister</span><br>'+
    '<span class="fromR"><span class="hi">younger</span> sister</span></div>',
  lines:['姊姊 ＝ <b>older sister</b>','妹妹 ＝ <b>younger sister</b>']},

 {tag:'聊天的時候',emoji:'💬',say:'big brother',
  h:'<div class="en in d1" style="font-size:clamp(20px,3.6vh,34px);line-height:1.6">'+
    '<span class="hi">big</span> brother　<span class="hi">little</span> brother<br>'+
    '<span class="hi">big</span> sister　<span class="hi">little</span> sister</div>',
  lines:['聊天的時候也很常這樣說','<b>big</b> ＝ 大的，<b>little</b> ＝ 小的，一樣對']},

 {tag:'課本上看到的話',emoji:'📖',
  h:'<div class="en in d1" style="font-size:clamp(24px,4.4vh,42px)"><span class="hi">elder</span> brother</div>',
  lines:['<b>elder</b> 是<b>英國</b>的說法，意思一樣',
         '但<b>只能放在名詞前面</b>：He is <b>older</b> than me ✅']},

 {tag:'記住這個',emoji:'🧒👦👧👩',mid:'四個中文字，兩個英文字',
  lines:['哥哥、弟弟 → <b>brother</b>；姊姊、妹妹 → <b>sister</b>',
         '要分大小，前面加 <b>older</b> 或 <b>younger</b>']}
]},

/* 單字結構頁（使用者 2026-09-19 指定）：grand 是什麼意思？mo／fa／bro／sis／-ther 呢？
   只放**查得到一手證據**的結構。查不到的（mo、bro、sis 單獨的意思）就誠實說沒有，
   不編一個出來——編出來學生會記錯，而且違反 CLAUDE.md「事實要正確」。
   幕號就是 daughter.html 等字卡「🧩 結構」按鈕的錨點，改順序要一起改 _build.js 的 parts.href。 */
{file:'parts.html',title:'單字拆開來看',src:'parts',
 S:[
 {emoji:'🧩',mid:'家人單字，拆得開嗎？',
  lines:['有的拆得開，有的<b>拆不開</b>']},

 /* #1 grand ＝ 大 */
 {tag:'grand 是什麼意思',emoji:'🏜️',say:'grand',
  h:'<div class="en in d1"><span class="hi">grand</span> <span class="ar">＝</span> 大</div>',
  lines:['<b>grand</b> 的意思就是「<b>大</b>」',
         '美國的 <b>Grand Canyon</b>，就是「<b>大</b>峽谷」']},

 /* #2 grand ＋ father（grandfather／grandmother 的錨點） */
 {tag:'裝上去',emoji:'👴',say:'grandfather',
  h:'<div class="en in d1" style="font-size:clamp(24px,4.4vh,44px)">'+
    '<span class="fromL hi">grand</span> <span class="ar">＋</span> <span class="fromR">father</span></div>'+
    '<div class="en pop" style="animation-delay:1.2s;font-size:clamp(24px,4.4vh,44px)">grandfather</div>',
  lines:['「<b>大</b>」的 father ＝ <b>爸爸的爸爸</b>',
         'grand ＋ mother，就是<b>媽媽的媽媽</b>']},

 /* #3 hus ＝ house（husband 的錨點） */
 {tag:'藏在字裡的房子',emoji:'🏠',say:'husband',
  h:'<div class="en in d1"><span class="hi">hus</span>band</div>'+
    '<div class="en pop" style="animation-delay:1.1s;font-size:clamp(26px,4.6vh,46px)">'+
    '<span class="hi">hus</span> ＝ <span class="hi">house</span></div>',
  lines:['<b>hus</b> 就是 <b>house</b>（房子）',
         'husband ＝ <b>管這間房子的人</b>']},

 /* #4 -ther／-ter 的尾巴（mother/father/brother/sister/daughter 的錨點） */
 {tag:'一樣的尾巴',
  h:'<div class="en in d1" style="font-size:clamp(17px,3vh,30px);line-height:1.75">'+
    'mo<span class="hi">ther</span><br>fa<span class="hi">ther</span><br>bro<span class="hi">ther</span><br>'+
    'daugh<span class="hi">ter</span><br>sis<span class="hi">ter</span></div>',
  lines:['五個家人字，<b>尾巴長得一模一樣</b>',
         '看到 <b>-ther</b>、<b>-ter</b>，很可能就是<b>家人</b>']},

 /* #5 德文旁證 */
 {tag:'德文也一樣',emoji:'🇩🇪',
  h:'<div class="en in d1" style="font-size:clamp(16px,2.8vh,28px);line-height:1.75">'+
    'Mut<span class="hi">ter</span><br>Va<span class="hi">ter</span><br>Bru<span class="hi">der</span><br>'+
    'Toch<span class="hi">ter</span><br>Schwes<span class="hi">ter</span></div>',
  lines:['德文的媽媽、爸爸、哥哥、女兒、姊姊',
         '<b>尾巴也都一樣</b> —— 這不是巧合']},

 /* #6 前面那一半：mo、fa */
 {tag:'前面那一半',emoji:'👶',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.6vh,46px)">'+
    '<span class="bub b1">ma</span> <span class="ar">→</span> <span class="bub b2">mo</span>ther　'+
    '<span class="bub b3">pa</span> <span class="ar">→</span> <span class="bub b3">fa</span>ther</div>',
  lines:['<b>mo</b> 來自 <b>ma</b>，<b>fa</b> 來自 <b>pa</b>',
         '都是<b>寶寶最早發得出來的音</b>']},

 /* #7 誠實幕：bro、sis 沒有意思 */
 {tag:'拆到這裡就好',emoji:'✋',
  h:'<div class="en in d1" style="font-size:clamp(24px,4.4vh,42px)">'+
    '<span class="mute">bro</span>　<span class="mute">sis</span></div>',
  lines:['<b>bro</b>、<b>sis</b> 單獨拿出來，<b>沒有意思</b>',
         '今天的 bro、sis 是<b>後來剪短的</b>，不是原本的零件']},

 /* #8 parent ＋ s（parent 的錨點） */
 {tag:'這個不是字源，是文法',emoji:'👨‍👩',say:'parents',
  h:'<div class="en in d1" style="font-size:clamp(26px,4.8vh,48px)">parent <span class="hi">＋ s</span></div>',
  lines:['一位是 <b>a parent</b>','兩位以上<b>加 s</b>：<b>parents</b>']},

 /* #9 收尾 */
 {tag:'記住這件事',emoji:'🧩',
  h:'<div class="en in d1" style="font-size:clamp(17px,3vh,30px);line-height:1.7">'+
    '<span class="hi">拆得開</span>　grandfather　grandmother　husband<br>'+
    '<span class="mute">拆不開</span>　family　son　uncle　aunt<br>'+
    '<span class="mute">拆不開</span>　cousin　nephew　niece　wife</div>',
  lines:['<b>拆不開的字，就整個背起來</b>',
         '硬拆只會背錯']}
]},

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
  h:'<div class="en in d1">tea</div>',
  lines:['台灣話的「茶」唸 <b>tê</b>','坐船到外國，就變成 <b>tea</b>']},

 {tag:'也是台灣話',emoji:'🍅',say:'ketchup',
  h:'<div class="en in d1">ketchup</div>',
  lines:['台灣話的 <b>kê-tsiap</b>（鮭汁）是魚做的醬','英文借去用，今天變成番茄醬']},

 {tag:'城市的名字',emoji:'🍔',say:'hamburger',
  h:'<div class="en in d1">hamburger</div>',
  lines:['來自德國的<b>漢堡市</b>，不是火腿','後來被切成 ham＋burger，才有 cheeseburger']},

 {tag:'人的名字',emoji:'🥪',say:'sandwich',
  h:'<div class="en in d1">sandwich</div>',
  lines:['這是一位<b>伯爵的名字</b>','他請人把肉夾在麵包中間，不用停下手邊的事']},

 {tag:'兩個字黏起來',emoji:'🍳',say:'breakfast',
  h:'<div class="en"><span class="fromL">break</span> ＋ <span class="fromR">fast</span></div>',
  lines:['合起來就是 <b>breakfast</b>（早餐）','睡了一整晚沒吃，早上<b>打破</b>它']},

 {tag:'一句話縮起來',emoji:'👋',say:'goodbye',
  h:'<div class="en squeeze">goodbye</div>',
  lines:['本來是一整句 <b>God be with ye</b>','（願神與你同在）說久了，縮成一個字']},

 {tag:'看出來了嗎',emoji:'🗣️⏳',mid:'每個字，都是這樣來的',
  lines:['從外國借來、兩個字黏起來、一句話縮起來']}
]}
];

const tpl=(P)=>`<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${P.title}｜單字小故事</title>
<!-- 本檔由 words/_build_story.js 產生，不要手改。 -->
<style>
@font-face{font-family:Andika;font-style:normal;font-weight:400;font-display:swap;
 src:url(fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-style:normal;font-weight:700;font-display:swap;
 src:url(fonts/andika-700.woff2) format("woff2")}

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
.reduce *{animation:none!important;transition:none!important}
${SRC.CSS}
</style>
</head>
<body>
<div id="dots"></div>
<button class="nav" id="prev" aria-label="上一頁">&#8592;</button>
<div id="stage"></div>
<button class="nav" id="next" aria-label="下一頁">&#8594;</button>
<div id="bar"><button id="say">🔊 念一次</button><button id="again">▶ 從頭看</button>${P.back?`<button id="back">${P.back.label}</button>`:''}${SRC.btn}</div>
${SRC.html(SRC.P[P.src||'why'])}

<script>
var S=${JSON.stringify(P.S,null,1)};

function draw(s){
 var h="";
 if(s.tag)h+='<div class="tag in">'+s.tag+'</div>';
 if(s.emoji)h+='<div class="emoji '+(s.emojiCls||"pop")+'">'+s.emoji+'</div>';
 if(s.mid)h+='<div class="mid in d1">'+s.mid+'</div>';
 if(s.h)h+=s.h;
 (s.lines||[]).forEach(function(t,k){h+='<div class="sub in d'+(k+2)+'">'+t+'</div>'});
 return h;
}

var i=0,reduce=false;
try{reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}
if(reduce)document.body.classList.add("reduce");

var dots=document.getElementById("dots");
for(var k=0;k<S.length;k++)dots.appendChild(document.createElement("i"));

function say(){try{var w=S[i].say;if(!w)return;
 var u=new SpeechSynthesisUtterance(w);u.lang=S[i].sayLang||"en-US";u.rate=.8;
 speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}

var stage=document.getElementById("stage");
function show(n){
 var back=(n<i);
 i=Math.max(0,Math.min(S.length-1,n));
 stage.innerHTML=draw(S[i]);
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
document.addEventListener("keydown",function(e){
 if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();show(i+1)}
 if(e.key==="ArrowLeft")show(i-1);
});

var jump=0;
try{var hh=parseInt((location.hash||"").slice(1),10);if(!isNaN(hh))jump=hh}catch(e){}
show(jump);
${P.back?`document.getElementById("back").addEventListener("click",function(){
 if(history.length>1){history.back()}else{location.href=${JSON.stringify(P.back.href)}}});`:''}
${SRC.JS}
</script>
</body>
</html>
`;

PAGES.forEach(p=>fs.writeFileSync(path.join(DIR,p.file),tpl(p),'utf8'));
console.log('已產生：'+PAGES.map(p=>p.file).join('  '));
