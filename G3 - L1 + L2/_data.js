/* G3 - L1 + L2/_data.js — 三年級 第一冊 Unit 1／Unit 2 句型卡的唯一真相來源
 * 改句型、改中文、改圖示、改替換字、改複習題、改情境，只改這一個檔，然後 node "G3 - L1 + L2/_build.js"
 *
 * 引擎（發音、配色、字體、按鈕列、卡片產生器）跟 sentences 共用，欄位意思一模一樣：
 *   en 英文 ｜ zh 這個字正下方的中文 ｜ ic 秒懂圖示（標點不給）｜ tight 黏住前一個字（'s 'm 're ? .）
 *   hl 'b' 藍底 ／ 'lp' 淺粉底 ｜ ri 紅色字母（等一下會被 ’ 藏起來）｜ slot 可以被替換字換掉
 *
 * 這一課的兩個顏色（全課的重點，使用者 2026-09-24 指定的「學生容易搞混」）：
 *   🔵 藍底：your 你的 ➜ 答 My 我的　（問「你的」，答「我的」）
 *   🩷 淺粉底：you 你 ➜ 答 I 我　　　（問「你」，答「我」）
 *
 * 不發音的字母（使用者指定）一律淺灰：寫在 SIL，引擎自動上色，一個字一個字查。
 * 縮寫（使用者指定）：What is ＝ What’s、I am ＝ I’m、You are ＝ You’re。
 *   'm、're 跟 's 一樣是獨立的 token，底下標「是」，唸的時候自動變成「前一個字＋縮寫」（I’m、You’re）。
 */

/* 不發音的字母：字 ➜ 第幾個字母（從 0 開始數）。使用者 2026-09-24 指定的全部在這裡 */
var SIL = {
  what:[1],            /* W(h)at      */
  name:[3],            /* nam(e)      */
  are:[2],             /* ar(e)       */
  you:[1],             /* y(o)u       */
  year:[2], years:[2], /* ye(a)r(s)   */
  eight:[2,3],         /* ei(gh)t     */
  nine:[3],            /* nin(e)      */
  twelve:[5],          /* twelv(e)    */
  mike:[3]             /* Mik(e)      */
};
var CONTR = ['s', 'm', 're'];

var ICON = {
  what:'📦', how:'🤔', howold:'🎂', name:'📛', is:'＝',
  i:'🙋', my:'🙋🎒', you:'👉', your:'👉🎒', yold:'🎂',
  q:'', dot:'', yes:'✅', no:'❌',
  ken:'👦', alan:'🧑', wendy:'👧', mike:'👦🏻', emma:'👧🏻',
  six:'6️⃣', seven:'7️⃣', eight:'8️⃣', nine:'9️⃣', ten:'🔟', eleven:'1️⃣1️⃣', twelve:'1️⃣2️⃣'
};

/* 替換字（使用者指定）：名字 5 個、歲數 6～12。放在卡片最下面，點一下整句（連發音）跟著換 */
var SUB = {
  name: {
    basic:[['Ken','肯恩',ICON.ken],['Alan','艾倫',ICON.alan],['Wendy','溫蒂',ICON.wendy],
           ['Mike','麥克',ICON.mike],['Emma','艾瑪',ICON.emma]],
    adv:[]
  },
  age: {
    basic:[['six','六',ICON.six],['seven','七',ICON.seven],['eight','八',ICON.eight],
           ['nine','九',ICON.nine],['ten','十',ICON.ten],['eleven','十一',ICON.eleven],
           ['twelve','十二',ICON.twelve]],
    adv:[]
  }
};

function t(en,zh,ic,o){var x={en:en,zh:zh,ic:ic};if(o)for(var k in o)x[k]=o[k];return x;}
/* 常用的字，寫一次就好 */
var W = {
  What:function(){return t('What','什麼',ICON.what)},
  s:function(){return t("'s",'是',ICON.is,{tight:1})},
  m:function(){return t("'m",'是',ICON.is,{tight:1})},
  re:function(){return t("'re",'是',ICON.is,{tight:1})},
  your:function(){return t('your','你的',ICON.your,{hl:'b'})},
  My:function(){return t('My','我的',ICON.my,{hl:'b'})},
  I:function(){return t('I','我',ICON.i,{hl:'lp'})},
  you:function(){return t('you','你',ICON.you,{hl:'lp'})},
  You:function(){return t('You','你',ICON.you,{hl:'lp'})},
  name:function(){return t('name','名字',ICON.name)},
  is:function(o){return t('is','是',ICON.is,o)},
  are:function(o){return t('are','是',ICON.is,o)},
  am:function(o){return t('am','是',ICON.is,o)},
  HowOld:function(){return t('How old','幾歲',ICON.howold)},
  yo:function(){return t('years old','歲',ICON.yold)},
  q:function(){return t('?','？',ICON.q,{tight:1})},
  dot:function(){return t('.','。',ICON.dot,{tight:1})},
  nm:function(en,zh,ic){return t(en,zh,ic,{slot:'name'})},
  age:function(en,zh,ic){return t(en,zh,ic,{slot:'age'})}
};

/* ---------------- Unit 1：What’s your name? ---------------- */
var U1 = [
 /* 1 What ＝ 什麼 */
 {type:'focus', eqRow:1, title:'What ＝ 問「什麼」',
  rows:[['What','什麼',ICON.what],['name','名字',ICON.name],['your','你的',ICON.your]]},

 /* 2 */
 {type:'sent', zh:'你的名字是什麼？',
  tk:[W.What(),W.s(),W.your(),W.name(),W.q()]},

 /* 3 縮寫變身：What is ➜ What’s */
 {type:'morph', a:[W.What(),W.is({ri:'i'})], b:[W.What(),W.s()], say:"What's"},

 /* 4 */
 {type:'eq',
  a:[W.What(),W.is({ri:'i'}),W.your(),W.name(),W.q()],
  b:[W.What(),W.s(),W.your(),W.name(),W.q()]},

 /* 5 中英語序：中文「什麼」在最後，英文 What 在最前面 */
 {type:'order', zhRow:[['你的',ICON.your,'b'],['名字',ICON.name,'p'],['是',ICON.is,'y'],['什麼',ICON.what,'r'],['？','','g']],
  enRow:[['What',ICON.what,'r'],["'s",ICON.is,'y'],['your',ICON.your,'b'],['name',ICON.name,'p'],['?','','g']],
  say:"What's your name?"},

 /* 6 回答 (1)：My name is ___. */
 {type:'sent', zh:'我的名字是肯恩。', slot:'name',
  tk:[W.My(),W.name(),W.is(),W.nm('Ken','肯恩',ICON.ken),W.dot()]},

 /* 7 回答 (2)：I’m ___. */
 {type:'sent', zh:'我是麥克。', slot:'name',
  tk:[W.I(),W.m(),W.nm('Mike','麥克',ICON.mike),W.dot()]},

 /* 8 縮寫變身：I am ➜ I’m */
 {type:'morph', a:[W.I(),W.am({ri:'a'})], b:[W.I(),W.m()], say:"I'm"},

 /* 9 */
 {type:'eq',
  a:[W.I(),W.am({ri:'a'}),W.nm('Mike','麥克',ICON.mike),W.dot()],
  b:[W.I(),W.m(),W.nm('Mike','麥克',ICON.mike),W.dot()]},

 /* 10 I／My、You／Your（使用者指定：學生最容易搞混） */
 {type:'focus', eqRow:1, title:'I 我 ／ My 我的',
  rows:[['I','我',ICON.i],['My','我的',ICON.my],['You','你',ICON.you],['Your','你的',ICON.your]]},

 /* 11 your 問 ➜ My 答：藍底自己飛下去 */
 {type:'echo',
  rows:[{q:'What’s your name?', qk:'your', qzh:'你的 名字 是 什麼？', a:'My name is ______.', ak:'My', azh:'我的 名字 是 ______。', cls:'b'},
        {q:'What’s your name?', qk:'', qzh:'你的 名字 是 什麼？', a:'I’m ______.', ak:'', azh:'我 是 ______。', cls:''}]},

 /* 12 問名字，要答名字（使用者指定：學生容易答錯的問答） */
 {type:'focus', title:'What’s your name? 要答什麼？',
  rows:[['My name is Ken.','✅ 名字',ICON.yes],['I’m Ken.','✅ 名字',ICON.yes],['I’m eight.','❌ 這是幾歲',ICON.no]]},

 /* 13 一問一答 (1) */
 {type:'pair', cls:'b', slot:'name', qic:ICON.name, aic:ICON.wendy,
  qtk:[W.What(),W.s(),W.your(),W.name(),W.q()],
  atk:[W.My(),W.name(),W.is(),W.nm('Wendy','溫蒂',ICON.wendy),W.dot()],
  qzh:'你的 名字 是 什麼？', azh:'我的 名字 是 溫蒂。'},

 /* 14 一問一答 (2) */
 {type:'pair', cls:'b', slot:'name', qic:ICON.name, aic:ICON.emma,
  qtk:[W.What(),W.s(),W.your(),W.name(),W.q()],
  atk:[W.I(),W.m(),W.nm('Emma','艾瑪',ICON.emma),W.dot()],
  qzh:'你的 名字 是 什麼？', azh:'我 是 艾瑪。'},

 /* 15 淺灰色 ＝ 不發音（使用者指定：有些字母不發音） */
 {type:'focus', title:'淺灰色的字母 ＝ 不發音',
  rows:[['What','h 不唸','🤫'],['name','e 不唸','🤫'],['Mike','e 不唸','🤫']]}
];

/* ---------------- Unit 2：How old are you? ---------------- */
var U2 = [
 /* 1 What／How／How old（使用者指定：What ＝ 什麼，How ＝ 問程度，How old ＝ 問年紀） */
 {type:'focus', eqRow:1, title:'How old ＝ 問「幾歲」',
  rows:[['What','什麼',ICON.what],['How','怎麼樣',ICON.how],['How old','幾歲',ICON.howold]]},

 /* 2 */
 {type:'sent', zh:'你幾歲？',
  tk:[W.HowOld(),W.are(),W.you(),W.q()]},

 /* 3 中英語序：中文「幾歲」在最後，英文 How old 在最前面 */
 {type:'order', zhRow:[['你',ICON.you,'lp'],['是',ICON.is,'y'],['幾歲',ICON.howold,'r'],['？','','g']],
  enRow:[['How old',ICON.howold,'r'],['are',ICON.is,'y'],['you',ICON.you,'lp'],['?','','g']],
  say:'How old are you?'},

 /* 4 回答 (1)：I’m ___ years old. */
 {type:'sent', zh:'我是八歲。', slot:'age',
  tk:[W.I(),W.m(),W.age('eight','八',ICON.eight),W.yo(),W.dot()]},

 /* 5 縮寫變身：I am ➜ I’m */
 {type:'morph', a:[W.I(),W.am({ri:'a'})], b:[W.I(),W.m()], say:"I'm"},

 /* 6 */
 {type:'eq',
  a:[W.I(),W.am({ri:'a'}),W.age('nine','九',ICON.nine),W.yo(),W.dot()],
  b:[W.I(),W.m(),W.age('nine','九',ICON.nine),W.yo(),W.dot()]},

 /* 7 回答 (2)：I’m ___.（years old 可以省略） */
 {type:'sent', zh:'我是十歲。', slot:'age',
  tk:[W.I(),W.m(),W.age('ten','十',ICON.ten),W.dot()]},

 /* 8 years old 可以省略：兩句意思一樣 */
 {type:'eq',
  a:[W.I(),W.m(),W.age('ten','十',ICON.ten),W.yo(),W.dot()],
  b:[W.I(),W.m(),W.age('ten','十',ICON.ten),W.dot()],
  note:'years old 可以省略'},

 /* 9 縮寫變身：You are ➜ You’re（使用者指定的學習重點） */
 {type:'morph', a:[W.You(),W.are({ri:'a'})], b:[W.You(),W.re()], say:"You're"},

 /* 10 */
 {type:'eq',
  a:[W.You(),W.are({ri:'a'}),W.age('seven','七',ICON.seven),W.dot()],
  b:[W.You(),W.re(),W.age('seven','七',ICON.seven),W.dot()]},

 /* 11 you 問 ➜ I 答：淺粉底自己飛下去 */
 {type:'echo',
  rows:[{q:'How old are you?', qk:'you', qzh:'你 幾歲？', a:'I’m ______ years old.', ak:'I', azh:'我 是 ______ 歲。', cls:'lp'},
        {q:'How old are you?', qk:'you', qzh:'你 幾歲？', a:'I’m ______.', ak:'I', azh:'我 是 ______ 歲。', cls:'lp'}]},

 /* 12 問幾歲，要答幾歲（使用者指定：學生容易答錯的問答） */
 {type:'focus', title:'How old are you? 要答什麼？',
  rows:[['I’m nine years old.','✅ 幾歲',ICON.yes],['I’m nine.','✅ 幾歲',ICON.yes],
        ['I’m Mike.','❌ 這是名字',ICON.no],['I’m nine year old.','❌ years 要有 s',ICON.no]]},

 /* 13 問什麼，就答什麼：What ➜ 名字、How old ➜ 幾歲 */
 {type:'focus', title:'問什麼，就答什麼',
  rows:[['What’s your name?','📛 答名字',ICON.name],['How old are you?','🎂 答幾歲',ICON.howold]]},

 /* 14 一問一答 (1) */
 {type:'pair', cls:'lp', slot:'age', qic:ICON.howold, aic:ICON.eleven,
  qtk:[W.HowOld(),W.are(),W.you(),W.q()],
  atk:[W.I(),W.m(),W.age('eleven','十一',ICON.eleven),W.yo(),W.dot()],
  qzh:'你 幾歲？', azh:'我 是 十一 歲。'},

 /* 15 一問一答 (2) */
 {type:'pair', cls:'lp', slot:'age', qic:ICON.howold, aic:ICON.twelve,
  qtk:[W.HowOld(),W.are(),W.you(),W.q()],
  atk:[W.I(),W.m(),W.age('twelve','十二',ICON.twelve),W.dot()],
  qzh:'你 幾歲？', azh:'我 是 十二 歲。'},

 /* 16 淺灰色 ＝ 不發音 */
 {type:'focus', title:'淺灰色的字母 ＝ 不發音',
  rows:[['are','e 不唸','🤫'],['you','o 不唸','🤫'],['years','a 不唸','🤫'],
        ['eight','gh 不唸','🤫'],['nine','e 不唸','🤫'],['twelve','e 不唸','🤫']]}
];

/* ---------------- 複習題（每 4 張一組；o[0] 一定是正確答案，引擎每一次都重洗）---------------- */
var RV1 = [
 {t:'第 1～4 張', q:[
  {q:'What 的中文是？', o:['什麼','誰','幾歲','怎麼樣'], h:'What ＝ 什麼。'},
  {q:'What’s your name? 的中文是？', o:['你的名字是什麼？','你幾歲？','我的名字是什麼？','他是誰？'], h:'your ＝ 你的，name ＝ 名字。'},
  {q:'What’s 是哪兩個字合起來的？', o:['What is','What are','What am','What his'], h:'紅色的 ’ 就是被藏起來的 i：What is ➜ What’s。'},
  {q:'What 的哪一個字母不發音（淺灰色）？', o:['h','W','a','t'], h:'What 的 h 淺灰色，不發音。'}
 ]},
 {t:'第 5～8 張', q:[
  {q:'「你的名字是什麼？」英文第一個字是？', o:['What','Your','Name','My'], h:'中文「什麼」在最後，英文 What 在最前面。'},
  {q:'What’s your name? 可以怎麼回答？', o:['My name is Ken.','I’m eight.','Your name is Ken.','How old are you?'], h:'問名字，就答名字。'},
  {q:'I am 縮寫成？', o:['I’m','Im','I’am','Me'], h:'am 的 a 被紅色的 ’ 藏起來：I am ➜ I’m。'},
  {q:'I’m Mike. 的中文是？', o:['我是麥克。','我的名字是什麼？','你是麥克。','他是麥克。'], h:'I ＝ 我，’m ＝ 是。'}
 ]},
 {t:'第 9～12 張', q:[
  {q:'My 的中文是？', o:['我的','我','你的','你'], h:'I ＝ 我，My ＝ 我的。'},
  {q:'Your 的中文是？', o:['你的','你','我的','我'], h:'You ＝ 你，Your ＝ 你的。'},
  {q:'問 your name（你的名字），答句開頭用哪一個？', o:['My','Your','You','Me'], h:'問「你的」，就答「我的」：your ➜ My。'},
  {q:'哪一句「不是」在回答 What’s your name?', o:['I’m eight.','I’m Ken.','My name is Ken.','My name is Emma.'], h:'I’m eight. 是在說幾歲，不是名字。'}
 ]},
 {t:'第 13～15 張', q:[
  {q:'「我的名字是溫蒂。」英文是？', o:['My name is Wendy.','I name is Wendy.','My name Wendy.','Your name is Wendy.'], h:'My name is ___.，is 不能少。'},
  {q:'name 的哪一個字母不發音？', o:['e','n','a','m'], h:'name 的 e 淺灰色，不發音。'},
  {q:'Mike 的哪一個字母不發音？', o:['e','M','i','k'], h:'Mike 的 e 淺灰色，不發音。'},
  {q:'I’m Emma. 和哪一句意思一樣？', o:['My name is Emma.','Your name is Emma.','I’m Emma’s.','How old is Emma?'], h:'I’m ___. ＝ My name is ___.，都是在說名字。'}
 ]}
];

var RV2 = [
 {t:'第 1～4 張', q:[
  {q:'How old 是在問什麼？', o:['幾歲','名字','什麼東西','在哪裡'], h:'How old ＝ 問年紀（幾歲）。'},
  {q:'How old are you? 的中文是？', o:['你幾歲？','你的名字是什麼？','你好嗎？','我幾歲？'], h:'How old ＝ 幾歲，you ＝ 你。'},
  {q:'「你幾歲？」英文第一個字是？', o:['How','You','Are','Old'], h:'中文「幾歲」在最後，英文 How old 在最前面。'},
  {q:'I’m eight years old. 的中文是？', o:['我是八歲。','我是八年。','你是八歲。','我的名字是八。'], h:'years old ＝ 歲。'}
 ]},
 {t:'第 5～8 張', q:[
  {q:'I am nine years old. 縮寫成？', o:['I’m nine years old.','Im nine years old.','I’am nine years old.','My nine years old.'], h:'I am ➜ I’m，紅色的 ’ 藏起來的是 a。'},
  {q:'I’m ten. 的意思跟哪一句一樣？', o:['I’m ten years old.','I’m ten year.','My name is ten.','How old are you?'], h:'years old 可以省略，意思一樣。'},
  {q:'How old are you? 可以怎麼回答？', o:['I’m ten.','I’m Ken.','My name is ten.','You’re ten.'], h:'問幾歲，就答幾歲。'},
  {q:'eight 的哪兩個字母不發音？', o:['gh','ei','ht','eg'], h:'eight 的 gh 淺灰色，不發音。'}
 ]},
 {t:'第 9～12 張', q:[
  {q:'You are 縮寫成？', o:['You’re','Your','Youre','You’are'], h:'are 的 a 被紅色的 ’ 藏起來：You are ➜ You’re。'},
  {q:'問 you（你），答句開頭用哪一個？', o:['I','You','My','Your'], h:'問「你」，就答「我」：you ➜ I。'},
  {q:'哪一句「不是」在回答 How old are you?', o:['I’m Mike.','I’m nine.','I’m nine years old.','I’m twelve.'], h:'I’m Mike. 是在說名字，不是幾歲。'},
  {q:'哪一句是對的？', o:['I’m nine years old.','I’m nine year old.','I’m nine years.','I nine years old.'], h:'years 要有 s，old 不能少。'}
 ]},
 {t:'第 13～16 張', q:[
  {q:'What’s your name? 要答什麼？', o:['名字','幾歲','天氣','東西'], h:'What’s your name? ➜ 答名字。'},
  {q:'「我十一歲。」英文是？', o:['I’m eleven years old.','I’m eleven year old.','My eleven years old.','I eleven years old.'], h:'I’m ＋ 數字 ＋ years old。'},
  {q:'twelve 的哪一個字母不發音？', o:['最後的 e','t','w','v'], h:'twelve 最後的 e 淺灰色，不發音。'},
  {q:'you 的哪一個字母不發音？', o:['o','y','u','都要發音'], h:'you 的 o 淺灰色，不發音。'}
 ]}
];

/* 頁面：標題、互相連結 */
var PAGES = [
  { file:'unit1.html', unit:1, title:'Unit 1 句型｜What’s your name?', other:'unit2.html', otherName:'➡ Unit 2' },
  { file:'unit2.html', unit:2, title:'Unit 2 句型｜How old are you?', other:'unit1.html', otherName:'⬅ Unit 1' }
];

/* ── 情境：兩個人演一次的小劇場（欄位跟 sentences 一樣）──
 *   at 左上角地點 ｜ bg 背景 emoji ｜ l／r 左右兩個人 ｜ ln／rn 名牌 ｜ rt 右邊頭上冒出來的
 *   b 左邊說的話（bzh:1 ＝ 中文）｜ b2 右邊說的話 ｜ use 什麼時候這樣說（一句話）
 * 縮寫卡一律 🐢「慢慢說」／🐇「說快一點」。 */
function sc(o){return o}
var SLOW = function(a,b,use){return sc({at:'⚡ 說快一點',bg:'💨',l:'🐢',ln:'慢慢說',b:a,r:'🐇',rn:'說快一點',b2:b,use:use})};
var SC1 = [
 sc({at:'🏫 開學第一天',bg:'🏫',l:'👩‍🏫',b:'What’s your name?',r:'👦',rt:'❓',use:'想知道對方叫什麼，就用 What。'}),
 sc({at:'🏫 開學第一天',bg:'🏫',l:'👧',b:'What’s your name?',r:'👦',rt:'❓',use:'遇到新同學，問他叫什麼名字。'}),
 SLOW('What is','What’s','說快一點，兩個字黏成一個字。'),
 SLOW('What is your name?','What’s your name?','意思一模一樣，只是說得比較快。'),
 sc({at:'🔁 中文 ➜ 英文',bg:'🔁',l:'🧒',ln:'中文',b:'你的名字是什麼？',bzh:1,r:'🧒',rn:'英文',b2:'What’s your name?',use:'中文「什麼」在最後，英文 What 在最前面。'}),
 sc({at:'🏫 教室',bg:'🏫',l:'👩‍🏫',b:'What’s your name?',r:'👦',b2:'My name is Ken.',use:'老師問你名字，這樣回答。'}),
 sc({at:'🛝 操場',bg:'🛝',l:'👧',b:'What’s your name?',r:'👦🏻',b2:'I’m Mike.',use:'更短的回答：I’m ＋ 名字。'}),
 SLOW('I am','I’m','說快一點，兩個字黏成一個字。'),
 SLOW('I am Mike.','I’m Mike.','意思一模一樣，只是說得比較快。'),
 sc({at:'🙋 我 ／ 👉 你',bg:'👉',l:'🙋',ln:'我',b:'I, My',r:'👉',rn:'你',b2:'You, Your',use:'說自己用 I、My；說對方用 You、Your。'}),
 sc({at:'🎤 一問一答',bg:'💬',l:'👧',b:'What’s your name?',r:'👦',b2:'My name is Alan.',use:'問 your（你的），答 My（我的）。'}),
 sc({at:'🎤 一問一答',bg:'💬',l:'👧',b:'What’s your name?',r:'👦',b2:'My name is Ken.',use:'問名字，就答名字。'}),
 sc({at:'🎂 生日派對',bg:'🎈',l:'👦',b:'What’s your name?',r:'👧',b2:'My name is Wendy.',use:'第一次見面，互相問名字。'}),
 sc({at:'🎂 生日派對',bg:'🎈',l:'👦',b:'What’s your name?',r:'👧🏻',b2:'I’m Emma.',use:'也可以只說 I’m ＋ 名字。'}),
 sc({at:'🤫 小聲一點',bg:'🤫',l:'🧒',b:'What',r:'🧒',b2:'name',use:'淺灰色的字母，唸的時候不發音。'})
];
var SC2 = [
 sc({at:'🎂 生日派對',bg:'🎈',l:'👧',b:'How old are you?',r:'👦',rt:'❓',use:'想知道對方幾歲，就用 How old。'}),
 sc({at:'🎂 生日派對',bg:'🎈',l:'👩',b:'How old are you?',r:'👦',rt:'🎂',use:'問對方「你幾歲？」'}),
 sc({at:'🔁 中文 ➜ 英文',bg:'🔁',l:'🧒',ln:'中文',b:'你幾歲？',bzh:1,r:'🧒',rn:'英文',b2:'How old are you?',use:'中文「幾歲」在最後，英文 How old 在最前面。'}),
 sc({at:'🎂 生日派對',bg:'🎈',l:'👩',b:'How old are you?',r:'👦',b2:'I’m eight years old.',use:'說自己幾歲：I’m ＋ 數字 ＋ years old。'}),
 SLOW('I am','I’m','說快一點，兩個字黏成一個字。'),
 SLOW('I am nine years old.','I’m nine years old.','意思一模一樣，只是說得比較快。'),
 sc({at:'🛝 操場',bg:'🛝',l:'👧',b:'How old are you?',r:'👦',b2:'I’m ten.',use:'更短的回答：I’m ＋ 數字。'}),
 sc({at:'✂️ 省略',bg:'✂️',l:'🐢',ln:'說完整',b:'I’m ten years old.',r:'🐇',rn:'省略',b2:'I’m ten.',use:'years old 可以省略，意思一樣。'}),
 SLOW('You are','You’re','說快一點，兩個字黏成一個字。'),
 SLOW('You are seven.','You’re seven.','意思一模一樣，只是說得比較快。'),
 sc({at:'🎤 一問一答',bg:'💬',l:'👧',b:'How old are you?',r:'👦',b2:'I’m nine.',use:'問 you（你），答 I（我）。'}),
 sc({at:'🎤 一問一答',bg:'💬',l:'👧',b:'How old are you?',r:'👦',b2:'I’m nine years old.',use:'問幾歲，就答幾歲。'}),
 sc({at:'🎤 問什麼答什麼',bg:'💬',l:'📛',ln:'問名字',b:'What’s your name?',r:'🎂',rn:'問幾歲',b2:'How old are you?',use:'兩個問題，答案不一樣。'}),
 sc({at:'🏫 教室',bg:'🏫',l:'👩‍🏫',b:'How old are you?',r:'👦',b2:'I’m eleven years old.',use:'老師問你幾歲，這樣回答。'}),
 sc({at:'🏫 教室',bg:'🏫',l:'👩‍🏫',b:'How old are you?',r:'👧',b2:'I’m twelve.',use:'也可以只說 I’m ＋ 數字。'}),
 sc({at:'🤫 小聲一點',bg:'🤫',l:'🧒',b:'eight',r:'🧒',b2:'nine',use:'淺灰色的字母，唸的時候不發音。'})
];

if (SC1.length !== U1.length || SC2.length !== U2.length) throw new Error('情境數量跟卡片數量對不起來');
U1.forEach(function (c, i) { c.scene = SC1[i]; });
U2.forEach(function (c, i) { c.scene = SC2[i]; });

/* 這一課自己加的版面：直式 iPad 的「他問他答」卡，問句和答句上下排
   （What’s your name? ➜ My name is ______. 左右排太長，會壓到翻頁箭頭——量測抓到的） */
var CSS = '@media (max-aspect-ratio:1/1){.erow{flex-direction:column;gap:clamp(4px,.8vh,10px)}' +
  '.erow .earr{transform:rotate(90deg)}.ebub{flex:0 0 auto;width:100%}}';

module.exports = { ICON:ICON, SUB:SUB, U1:U1, U2:U2, RV1:RV1, RV2:RV2, SIL:SIL, CONTR:CONTR, PAGES:PAGES, CSS:CSS };
