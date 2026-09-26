/* sentences/_data.js — Unit 1／Unit 2 句型的唯一真相來源
 * 改句型、改中文、改圖示、改替換字、改複習題，只改這一個檔，然後 node sentences/_build.js
 *
 * token 欄位
 *   en   英文
 *   zh   這個字正下方的中文
 *   ic   這個字正下方的秒懂圖示（emoji）。標點符號一律不給圖示——版面才清爽
 *   tight true = 黏在前一個字後面，中間不留空白（'s、? 、. 用）
 *   hl   'b' 藍底（he／He）／'p' 桃紅底（Unit 2 的 she）／'lp' 淺粉底（Unit 1 的 she）／'y' 黃底（be 動詞）
 *   ri   把這個字母上紅色：is 的 i、not 的 o ——學生一眼看到「紅色的字母等一下會被 ’ 藏起來」
 *   slot 'he' | 'she' | 'job' = 這個位置可以被下面的替換字換掉
 *   blank true = 這個位置一開始是 ______，點下面的替換字才填進去
 *   say  點這個字（逐字動畫）時要唸的聲音；a 寫 'uh'：單獨唸 a 瀏覽器會唸成字母 /eɪ/，
 *        使用者 2026-09-25 指定要接近注音「ㄜ」（整句唸的時候不受影響，本來就是 /ə/）
 *
 * 三個顏色規則（使用者 2026-09-21 指定，不要改回去）
 *   ① Who 的 W 淺灰色（不發音）——enHTML() 自動處理，資料裡不用寫
 *   ② is 的 i ／ ’ 一律紅色：紅色的 ’ 就是被藏起來的 i
 *   ③ he／He 一律藍底（問 he，答 He）；Unit 1 的 she／She 淺粉底（跟 Who 的紅色分得開）
 *
 * 'S 的發音：不用寫 say，產生器會自動把 's 唸成「前一個字＋'s」
 * （Who's → /huːz/、He's → /hiːz/），學生聽到的就是 /z/，不是「ess」。
 */

var ICON = {
  /* is 的圖示用「＝」這個字，不用 🟰 emoji——使用者的電腦看 🟰 是一個白框（2026-09-21） */
  who:'❓', is:'＝', my:'🙋', a:'1️⃣',
  q:'', dot:'', comma:'',            /* 標點沒有圖示（使用者指定：圖示太多很亂） */
  yes:'✅', no:'❌', not:'🚫',
  he:'👦', she:'👧',
  what:'📦', how:'🤔',               /* How 原本用 🌡 看不懂，改成「在想怎麼樣」的 🤔 */
  /* 家人 */
  father:'👨', mother:'👩', brother:'🧒', sister:'👧',
  grandfather:'👴', grandmother:'👵', dad:'👨', mom:'👩',
  grandpa:'👴', grandma:'👵', uncle:'🧔', aunt:'👩‍🦱',
  cousin:'🧑‍🤝‍🧑', nephew:'👦', niece:'👧',
  /* 職業 */
  doctor:'👨‍⚕️', teacher:'👩‍🏫', nurse:'👩‍⚕️',
  cook:'👨‍🍳', farmer:'👨‍🌾', student:'🧑‍🎓'
};

/* 替換字（點一下就換進句子裡；版面放在卡片最下面，不擋住中間的英文句子）
   換完以後整句的發音一定跟著換（setSlot() 負責） */
var SUB = {
  he: {
    basic:[['brother','哥哥',ICON.brother],['grandfather','爺爺',ICON.grandfather],
           ['dad','爸爸',ICON.dad],['grandpa','爺爺',ICON.grandpa]],
    adv:  [['uncle','叔叔',ICON.uncle],['nephew','姪子',ICON.nephew],
           ['cousin','表哥',ICON.cousin]]
  },
  she: {
    basic:[['sister','姊姊',ICON.sister],['grandmother','奶奶',ICON.grandmother],
           ['grandma','奶奶',ICON.grandma],['mom','媽媽',ICON.mom]],
    adv:  [['aunt','阿姨',ICON.aunt],['cousin','表姊',ICON.cousin],
           ['niece','姪女',ICON.niece]]
  },
  job: {
    basic:[['student','學生',ICON.student],['cook','廚師',ICON.cook],
           ['farmer','農夫',ICON.farmer],['teacher','老師',ICON.teacher],
           ['nurse','護理師',ICON.nurse],['doctor','醫生',ICON.doctor]],
    adv:  []
  }
};

/* 「💡 問什麼？」按下去才出現的用法（u ＝ 一句話，v ＝ 會動的秒懂圖示）——G3 也用這一組 */
var USE = {
  who: {u:'問「人」', v:'<i>👦</i><i>👧</i><i>👵</i>'},
  what:{u:'問「東西」、「事情」', v:'<i class="spin">📦</i><i>🍎</i><i>🎉</i>'},
  how: {u:'問「程度」、「方式」', v:'<span class="bars"><u></u><u></u><u></u><u></u></span><i>🚲</i><i>🚌</i>'}
};

function t(en,zh,ic,o){var x={en:en,zh:zh,ic:ic};if(o)for(var k in o)x[k]=o[k];return x;}

/* ---------------- Unit 1 ---------------- */
var U1 = [
 /* 1 */
/* 2026-09-25 使用者指定：一次一個字（英文先出來，再出中文）、英文／＝／中文上下對齊、
    「💡 問什麼？」按了才用動畫演出三個字的用法、字放大 */
 {type:'focus', eqRow:1, title:'Who？What？How？',
  rows:[['Who','誰',ICON.who,USE.who],['What','什麼',ICON.what,USE.what],['How','怎麼樣',ICON.how,USE.how]]},

 /* 2 */
 {type:'sent', zh:'他是誰？', say:"Who's he?",
  tk:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),
      t('he','他',ICON.he,{hl:'b'}),t('?','？',ICON.q,{tight:1})]},

 /* 3 秒懂動畫：Who is ➜ Who's（使用者 2026-09-21 指定新增） */
 {type:'morph',
  a:[t('Who','誰',ICON.who),t('is','是',ICON.is,{ri:'i'})],
  b:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1})],
  say:"Who's"},

 /* 4 */
 {type:'eq',
  a:[t('Who','誰',ICON.who),t('is','是',ICON.is,{ri:'i'}),t('he','他',ICON.he,{hl:'b'}),t('?','？',ICON.q,{tight:1})],
  b:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),t('he','他',ICON.he,{hl:'b'}),t('?','？',ICON.q,{tight:1})],
  note:'紅色的 ’ ＝ 被藏起來的 [i]。'},

 /* 5 */
 {type:'sent', zh:'他是我的爸爸。', say:"He's my father.", slot:'he',
  tk:[t('He','他',ICON.he,{hl:'b'}),t("'s",'是',ICON.is,{tight:1}),
      t('my','我的',ICON.my),t('father','爸爸',ICON.father,{slot:'he'}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 6 秒懂動畫：He is ➜ He's */
 {type:'morph',
  a:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{ri:'i'})],
  b:[t('He','他',ICON.he,{hl:'b'}),t("'s",'是',ICON.is,{tight:1})],
  say:"He's"},

 /* 7 */
 {type:'eq',
  a:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{ri:'i'}),t('my','我的',ICON.my),
     t('father','爸爸',ICON.father),t('.','。',ICON.dot,{tight:1})],
  b:[t('He','他',ICON.he,{hl:'b'}),t("'s",'是',ICON.is,{tight:1}),t('my','我的',ICON.my),
     t('father','爸爸',ICON.father),t('.','。',ICON.dot,{tight:1})]},

 /* 8 */
 {type:'order', zhRow:[['他',ICON.he,'b'],['是',ICON.is,'y'],['誰',ICON.who,'r'],['？',ICON.q,'g']],
  enRow:[['Who',ICON.who,'r'],["'s",ICON.is,'y'],['he',ICON.he,'b'],['?',ICON.q,'g']],
  say:"Who's he?"},

 /* 9 */
 {type:'sent', zh:'她是誰？', say:"Who's she?",
  tk:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),
      t('she','她',ICON.she,{hl:'lp'}),t('?','？',ICON.q,{tight:1})]},

 /* 10 */
 {type:'sent', zh:'她是我的媽媽。', say:"She's my mother.", slot:'she',
  tk:[t('She','她',ICON.she,{hl:'lp'}),t("'s",'是',ICON.is,{tight:1}),
      t('my','我的',ICON.my),t('mother','媽媽',ICON.mother,{slot:'she'}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 11 秒懂動畫：She is ➜ She's */
 {type:'morph',
  a:[t('She','她',ICON.she,{hl:'lp'}),t('is','是',ICON.is,{ri:'i'})],
  b:[t('She','她',ICON.she,{hl:'lp'}),t("'s",'是',ICON.is,{tight:1})],
  say:"She's"},

 /* 12 */
 {type:'eq',
  a:[t('She','她',ICON.she,{hl:'lp'}),t('is','是',ICON.is,{ri:'i'}),t('my','我的',ICON.my),
     t('mother','媽媽',ICON.mother),t('.','。',ICON.dot,{tight:1})],
  b:[t('She','她',ICON.she,{hl:'lp'}),t("'s",'是',ICON.is,{tight:1}),t('my','我的',ICON.my),
     t('mother','媽媽',ICON.mother),t('.','。',ICON.dot,{tight:1})]},

 /* 13 she 改成淺粉底：原本 she 的桃紅跟 Who 的紅太接近，學生分不出來（使用者 2026-09-21） */
 {type:'order', zhRow:[['她',ICON.she,'lp'],['是',ICON.is,'y'],['誰',ICON.who,'r'],['？',ICON.q,'g']],
  enRow:[['Who',ICON.who,'r'],["'s",ICON.is,'y'],['she',ICON.she,'lp'],['?',ICON.q,'g']],
  say:"Who's she?"},

 /* 14 秒懂重點改成會動的：he 問 ➜ He 答，兩個都是藍底（使用者 2026-09-21 指定） */
 {type:'echo',
  rows:[{q:'Who’s he?', qk:'he', qzh:'他 是 誰？', a:'He’s ______.', ak:'He', azh:'他 是 ______。', cls:'b'},
        {q:'Who’s she?', qk:'she', qzh:'她 是 誰？', a:'She’s ______.', ak:'She', azh:'她 是 ______。', cls:'lp'}]},

 /* 15 一問一答：每一個英文字的正下方就是那個字的中文（使用者 2026-09-21 指定） */
 {type:'pair', cls:'b', slot:'he', qic:ICON.who, aic:ICON.father,
  qtk:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),
       t('he','他',ICON.he,{hl:'b'}),t('?','？',ICON.q,{tight:1})],
  atk:[t('He','他',ICON.he,{hl:'b'}),t("'s",'是',ICON.is,{tight:1}),
       t('my','我的',ICON.my),t('father','爸爸',ICON.father,{slot:'he'}),
       t('.','。',ICON.dot,{tight:1})],
  qzh:'他 是 誰？', azh:'他 是 我的 爸爸。'},

 /* 16 */
 {type:'pair', cls:'lp', slot:'she', qic:ICON.who, aic:ICON.mother,
  qtk:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),
       t('she','她',ICON.she,{hl:'lp'}),t('?','？',ICON.q,{tight:1})],
  atk:[t('She','她',ICON.she,{hl:'lp'}),t("'s",'是',ICON.is,{tight:1}),
       t('my','我的',ICON.my),t('mother','媽媽',ICON.mother,{slot:'she'}),
       t('.','。',ICON.dot,{tight:1})],
  qzh:'她 是 誰？', azh:'她 是 我的 媽媽。'}
];

/* ---------------- Unit 2 ---------------- */
var U2 = [
 /* 1 */
 {type:'sent', zh:'他是一位醫生。', say:'He is a doctor.', slot:'job',
  tk:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y',ri:'i'}),
      t('a','一位',ICON.a,{say:'uh'}),t('doctor','醫生',ICON.doctor,{slot:'job'}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 2 秒懂動畫：He is ➜ He's（使用者 2026-09-21 指定新增） */
 {type:'morph',
  a:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{ri:'i'})],
  b:[t('He','他',ICON.he,{hl:'b'}),t("'s",'是',ICON.is,{tight:1})],
  say:"He's"},

 /* 3 */
 {type:'eq',
  a:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{ri:'i'}),t('a','一位',ICON.a,{say:'uh'}),
     t('doctor','醫生',ICON.doctor),t('.','。',ICON.dot,{tight:1})],
  b:[t('He','他',ICON.he,{hl:'b'}),t("'s",'是',ICON.is,{tight:1}),t('a','一位',ICON.a,{say:'uh'}),
     t('doctor','醫生',ICON.doctor),t('.','。',ICON.dot,{tight:1})]},

 /* 4 */
 {type:'swap', subj:'he', slot:'job',
  st:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a,{say:'uh'}),t('doctor','醫生',ICON.doctor,{slot:'job'}),t('.','。',ICON.dot,{tight:1})],
  qu:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
      t('a','一位',ICON.a,{say:'uh'}),t('doctor','醫生',ICON.doctor,{slot:'job'}),t('?','？',ICON.q,{tight:1})],
  stzh:'他是一位醫生。', quzh:'他是一位醫生嗎？',
  note:'🔵 he 和 🟡 is 換位置，。變成 ？'},

 /* 5 */
 {type:'sent', zh:'他是一位醫生嗎？', say:'Is he a doctor?', slot:'job',
  tk:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
      t('a','一位',ICON.a,{say:'uh'}),t('doctor','醫生',ICON.doctor,{slot:'job'}),
      t('?','？',ICON.q,{tight:1})]},

 /* 6 */
 {type:'sent', zh:'是的，他是。', say:'Yes, he is.',
  tk:[t('Yes','是的',ICON.yes),t(',','，',ICON.comma,{tight:1}),
      t('he','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 7 */
 {type:'sent', zh:'不，他不是。', say:"No, he isn't.",
  tk:[t('No','不',ICON.no),t(',','，',ICON.comma,{tight:1}),
      t('he','他',ICON.he,{hl:'b'}),t("isn't",'不是',ICON.not,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 8 秒懂動畫：is not ➜ isn't（使用者 2026-09-21 指定新增） */
 {type:'morph',
  a:[t('is','是',ICON.is),t('not','不',ICON.not,{ri:'o'})],
  b:[t("isn't",'不是',ICON.not)],
  say:"isn't"},

 /* 9 空格卡：答「不是」之後，補上真正的答案（使用者 2026-09-21 指定新增） */
 {type:'sent', zh:'不，他不是。他是一位 ______。', say:"No, he isn't. He's a ______.", slot:'job',
  tk:[t('No','不',ICON.no),t(',','，',ICON.comma,{tight:1}),
      t('he','他',ICON.he,{hl:'b'}),t("isn't",'不是',ICON.not,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1}),
      t('He','他',ICON.he,{hl:'b'}),t("'s",'是',ICON.is,{tight:1}),
      t('a','一位',ICON.a,{say:'uh'}),t('______','______','',{slot:'job',blank:1}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 10 */
 {type:'sent', zh:'她是一位老師。', say:'She is a teacher.', slot:'job',
  tk:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y',ri:'i'}),
      t('a','一位',ICON.a,{say:'uh'}),t('teacher','老師',ICON.teacher,{slot:'job'}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 11 秒懂動畫：She is ➜ She's */
 {type:'morph',
  a:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{ri:'i'})],
  b:[t('She','她',ICON.she,{hl:'p'}),t("'s",'是',ICON.is,{tight:1})],
  say:"She's"},

 /* 12 */
 {type:'eq',
  a:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{ri:'i'}),t('a','一位',ICON.a,{say:'uh'}),
     t('teacher','老師',ICON.teacher),t('.','。',ICON.dot,{tight:1})],
  b:[t('She','她',ICON.she,{hl:'p'}),t("'s",'是',ICON.is,{tight:1}),t('a','一位',ICON.a,{say:'uh'}),
     t('teacher','老師',ICON.teacher),t('.','。',ICON.dot,{tight:1})]},

 /* 13 */
 {type:'swap', subj:'she', slot:'job',
  st:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a,{say:'uh'}),t('teacher','老師',ICON.teacher,{slot:'job'}),t('.','。',ICON.dot,{tight:1})],
  qu:[t('Is','是',ICON.is,{hl:'y'}),t('she','她',ICON.she,{hl:'p'}),
      t('a','一位',ICON.a,{say:'uh'}),t('teacher','老師',ICON.teacher,{slot:'job'}),t('?','？',ICON.q,{tight:1})],
  stzh:'她是一位老師。', quzh:'她是一位老師嗎？',
  note:'💗 she 和 🟡 is 換位置，。變成 ？'},

 /* 14 */
 {type:'sent', zh:'她是一位老師嗎？', say:'Is she a teacher?', slot:'job',
  tk:[t('Is','是',ICON.is,{hl:'y'}),t('she','她',ICON.she,{hl:'p'}),
      t('a','一位',ICON.a,{say:'uh'}),t('teacher','老師',ICON.teacher,{slot:'job'}),
      t('?','？',ICON.q,{tight:1})]},

 /* 15 */
 {type:'sent', zh:'是的，她是。', say:'Yes, she is.',
  tk:[t('Yes','是的',ICON.yes),t(',','，',ICON.comma,{tight:1}),
      t('she','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 16 */
 {type:'sent', zh:'不，她不是。', say:"No, she isn't.",
  tk:[t('No','不',ICON.no),t(',','，',ICON.comma,{tight:1}),
      t('she','她',ICON.she,{hl:'p'}),t("isn't",'不是',ICON.not,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 17 秒懂動畫：is not ➜ isn't（她這一邊也要有，使用者 2026-09-21 指定） */
 {type:'morph',
  a:[t('is','是',ICON.is),t('not','不',ICON.not,{ri:'o'})],
  b:[t("isn't",'不是',ICON.not)],
  say:"isn't"},

 /* 18 空格卡（她） */
 {type:'sent', zh:'不，她不是。她是一位 ______。', say:"No, she isn't. She's a ______.", slot:'job',
  tk:[t('No','不',ICON.no),t(',','，',ICON.comma,{tight:1}),
      t('she','她',ICON.she,{hl:'p'}),t("isn't",'不是',ICON.not,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1}),
      t('She','她',ICON.she,{hl:'p'}),t("'s",'是',ICON.is,{tight:1}),
      t('a','一位',ICON.a,{say:'uh'}),t('______','______','',{slot:'job',blank:1}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 19 秒懂重點改成會動的：直述句 ⇄ 問句 自己演一遍（使用者 2026-09-21 指定） */
 {type:'swapdemo',
  st:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a,{say:'uh'}),t('doctor','醫生',ICON.doctor),t('.','。',ICON.dot,{tight:1})],
  qu:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
      t('a','一位',ICON.a,{say:'uh'}),t('doctor','醫生',ICON.doctor),t('?','？',ICON.q,{tight:1})],
  stzh:'他 是 一位 醫生。', quzh:'他 是 一位 醫生 嗎？',
  note:'短答不縮寫：Yes, he is. ✅　Yes, he’s. ❌'},

 /* 20 一問一答：每一個英文字的正下方就是那個字的中文（使用者 2026-09-21 指定） */
 {type:'pair', cls:'b', slot:'job', qic:ICON.doctor, aic:ICON.yes,
  qtk:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
       t('a','一位',ICON.a,{say:'uh'}),t('doctor','醫生',ICON.doctor,{slot:'job'}),
       t('?','嗎？',ICON.q,{tight:1})],
  atk:[t('Yes','是的',ICON.yes),t(',','，',ICON.comma,{tight:1}),
       t('he','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
       t('.','。',ICON.dot,{tight:1})],
  qzh:'他 是 一位 醫生 嗎？', azh:'是的，他 是。'},

 /* 21 */
 {type:'pair', cls:'p', slot:'job', qic:ICON.nurse, aic:ICON.no,
  qtk:[t('Is','是',ICON.is,{hl:'y'}),t('she','她',ICON.she,{hl:'p'}),
       t('a','一位',ICON.a,{say:'uh'}),t('nurse','護理師',ICON.nurse,{slot:'job'}),
       t('?','嗎？',ICON.q,{tight:1})],
  atk:[t('No','不',ICON.no),t(',','，',ICON.comma,{tight:1}),
       t('she','她',ICON.she,{hl:'p'}),t("isn't",'不是',ICON.not,{hl:'y'}),
       t('.','。',ICON.dot,{tight:1})],
  qzh:'她 是 一位 護理師 嗎？', azh:'不，她 不是。'}
];

/* ---------------- 複習題（使用者 2026-09-21 指定新增）----------------
 * 每 4 張卡一組，每組至少 3 題；20 秒限時，愈快答對分數愈高。
 * 題序與選項每一次都重洗（引擎負責），o[0] 一定是正確答案。
 * 出題只考這 4 張卡教過的東西，嚴禁瑣碎、冷僻、湊題數。
 */
var RV1 = [
 {t:'第 1～4 張', q:[
  {q:'看到 Who，答案一定是什麼？', o:['人 👦👧','東西 📦','天氣 🌤','地方 🏫'], h:'Who ＝ 問「人」。'},
  {q:'Who’s he? 等於下面哪一句？', o:['Who is he?','Who are he?','Who he is?','Who am he?'], h:'’ 就是被藏起來的 i：Who is ➜ Who’s。'},
  {q:'Who’s he? 的中文是？', o:['他是誰？','誰是他？','他好嗎？','他在哪裡？'], h:'中文問「他是誰？」，英文才是 Who 排最前面。'},
  {q:'Who’s 的紅色 ’ 藏起來的是哪一個字母？', o:['i','o','h','e'], h:'is 的 i 被 ’ 藏起來了。'},
  {q:'Who 的 W 為什麼是淺灰色？', o:['不發音','要唸很大聲','因為是大寫','唸成 wu'], h:'Who 的 w 不發音，整個字唸 /huː/。'}
 ]},
 {t:'第 5～8 張', q:[
  {q:'He is my father. 縮寫成哪一句？', o:['He’s my father.','Hes my father.','He’is my father.','His my father.'], h:'is 的 i 換成 ’，黏在 He 後面。'},
  {q:'「他是誰？」的英文，哪一個字排最前面？', o:['Who','He','is','my'], h:'中文「誰」在最後，英文 Who 要跑到最前面。'},
  {q:'Who’s he? 要怎麼回答？', o:['He’s my father.','She’s my mother.','Yes, he is.','Who is he?'], h:'問 he 就要答 He。'},
  {q:'Who’s 裡面的 s 要唸什麼音？', o:['/z/','/s/','/es/','不發音'], h:'Who’s 唸 /huːz/，s 唸 /z/。'}
 ]},
 {t:'第 9～12 張', q:[
  {q:'「她是我的媽媽。」的英文是？', o:['She’s my mother.','He’s my mother.','She’s my father.','My mother she is.'], h:'媽媽是女生，主詞用 She。'},
  {q:'She is my mother. 縮寫成哪一句？', o:['She’s my mother.','Shes my mother.','She’is my mother.','She my mother.'], h:'She is ➜ She’s，i 換成 ’。'},
  {q:'問女生要用哪一句？', o:['Who’s she?','Who’s he?','Who she is?','She’s who?'], h:'she ＝ 她，問女生用 Who’s she?。'},
  {q:'Who’s she? 的中文是？', o:['她是誰？','誰是她？','她是我的媽媽。','她好嗎？'], h:'英文問句 Who 在最前面，中文「誰」在最後。'}
 ]},
 {t:'第 13～16 張', q:[
  {q:'Who’s he? 的答句要用哪一個字開頭？', o:['He','She','Who','Yes'], h:'問 he 就答 He；問 she 就答 She。'},
  {q:'Who’s she? 要怎麼回答？', o:['She’s my sister.','He’s my brother.','Yes, she is.','Who is she?'], h:'問 she 就答 She。'},
  {q:'He’s my grandfather. 的中文是？', o:['他是我的爺爺。','她是我的奶奶。','他是我的哥哥。','他是我的叔叔。'], h:'grandfather ＝ 爺爺 👴。'},
  {q:'問 he 答 He，那問 she 要答什麼？', o:['She','He','It','Who'], h:'問誰就答誰，主詞要對得起來。'}
 ]}
];

var RV2 = [
 {t:'第 1～4 張', q:[
  {q:'He is a doctor. 縮寫成哪一句？', o:['He’s a doctor.','Hes a doctor.','He’is a doctor.','He are a doctor.'], h:'He is ➜ He’s，i 換成 ’。'},
  {q:'He is a doctor. 變成問句是？', o:['Is he a doctor?','He is a doctor?','Is a doctor he?','Does he a doctor?'], h:'he 和 is 換位置，Is 排最前面。'},
  {q:'變成問句的時候，句尾的 。 要變成什麼？', o:['?','!',',','不用變'], h:'英文問句句尾一定是問號 ?。'},
  {q:'He’s 的紅色 ’ 藏起來的是哪一個字母？', o:['i','a','e','s'], h:'is 的 i 被 ’ 藏起來了。'}
 ]},
 {t:'第 5～8 張', q:[
  {q:'Is he a doctor? 答「是」要怎麼說？', o:['Yes, he is.','Yes, he’s.','Yes, is he.','Yes, he isn’t.'], h:'句尾的 is 不可以縮寫，只能說 Yes, he is.。'},
  {q:'is not 縮寫成哪一個字？', o:['isn’t','is’nt','isnot','isn’t not'], h:'not 的 o 被 ’ 藏起來 ➜ isn’t。'},
  {q:'「不，他不是。」的英文是？', o:['No, he isn’t.','No, he is.','No, she isn’t.','Not, he isn’t.'], h:'否定短答用 No, he isn’t.。'},
  {q:'Yes, he is. 可以縮寫成 Yes, he’s. 嗎？', o:['不可以','可以','兩個都對','只有問句可以'], h:'is 在句尾不可以縮寫。'}
 ]},
 {t:'第 9～12 張', q:[
  {q:'isn’t 的 ’ 藏起來的是哪一個字母？', o:['o','i','n','t'], h:'is not ➜ isn’t，不見的是 not 的 o。'},
  {q:'She is a teacher. 縮寫成哪一句？', o:['She’s a teacher.','Shes a teacher.','She’is a teacher.','She are a teacher.'], h:'She is ➜ She’s。'},
  {q:'No, he isn’t. 後面接哪一句最順？', o:['He’s a cook.','She’s a cook.','Is he a cook?','Yes, he is.'], h:'先說不是，再說他真正的工作。'},
  {q:'「她是一位老師。」的英文是？', o:['She’s a teacher.','He’s a teacher.','She’s a student.','Teacher she is.'], h:'老師是 teacher 👩‍🏫，主詞是 She。'}
 ]},
 {t:'第 13～16 張', q:[
  {q:'Is she a teacher? 答「不是」要怎麼說？', o:['No, she isn’t.','No, he isn’t.','No, she is.','Not, she isn’t.'], h:'問 she 就答 she。'},
  {q:'Is she a nurse? 變回直述句是？', o:['She is a nurse.','Is she a nurse.','She a nurse is.','Nurse is she.'], h:'Is 和 she 換回來，? 變成 。'},
  {q:'英文問句最前面要放哪一個字？', o:['Is','She','a','nurse'], h:'be 動詞跑到最前面就變問句。'},
  {q:'Yes, she is. 的中文是？', o:['是的，她是。','不，她不是。','她是誰？','是的，他是。'], h:'she ＝ 她，Yes ＝ 是的。'}
 ]},
 {t:'第 17～21 張', q:[
  {q:'Is he a cook? 答「是」要怎麼說？', o:['Yes, he is.','Yes, he’s.','Yes, she is.','No, he isn’t.'], h:'問 he 就答 he，而且句尾 is 不縮寫。'},
  {q:'直述句變問句，換位置的是哪兩個？', o:['主詞和 is','is 和 a','主詞和職業','句號和問號'], h:'🔵 主詞 和 🟡 is 換位置。'},
  {q:'Is she a doctor? 答「不是」要怎麼說？', o:['No, she isn’t.','No, he isn’t.','No, she is.','Yes, she isn’t.'], h:'否定短答：No, she isn’t.。'},
  {q:'Is he a farmer? 的中文是？', o:['他是一位農夫嗎？','他是一位農夫。','她是一位農夫嗎？','他想當農夫。'], h:'句尾是 ?，中文要加「嗎？」。'},
  {q:'No, she isn’t. 後面接哪一句最順？', o:['She’s a cook.','He’s a cook.','Is she a cook?','Yes, she is.'], h:'先說不是，再說她真正的工作。'}
 ]}
];

/* ════════ 📝 Review 1　About My Family（使用者 2026-09-26 指定新增）════════
 * 學習目標：學以致用，真心並開心想用英文表達自我並介紹家人。一句一張卡，句子照課本截圖：
 *   My name is ___. ／ This is my ___. ／ (He’s／She’s) a ___. ／ (He／She) likes ___, ／ (and／but) I like ___.
 *   (He／She) can ___, ／ (and／but) I can ___.
 * 空格：課本 Word Bank（基礎）＋ 學生天天用得到、最想說的字（進階）：家人／親戚稱謂、friend、teacher；
 *   20 種最酷的夢想職業（全部子音開頭，a 不用變 an）；常見顏色；20 種學生真心喜歡、很酷的活動（不放幼稚的）。
 * 一張卡兩排替換字：slots（He／She ＋ 職業、and／but ＋ 顏色……），引擎 _build_cards.js 的 subsHTML(slots)。 */
SUB.nm4 = { basic:[['Ken','Ken','👦'],['Amy','Amy','👧'],['Leo','Leo','🧒'],['Mia','Mia','👧']], adv:[] };
SUB.fam = { lb:'📘 課本', la:'✨ 還有',
  basic:[['sister','姊姊',ICON.sister],['brother','哥哥',ICON.brother],['father','爸爸',ICON.father],
         ['mother','媽媽',ICON.mother],['grandfather','爺爺',ICON.grandfather],['grandmother','奶奶',ICON.grandmother]],
  adv:  [['dad','爸爸',ICON.dad],['mom','媽媽',ICON.mom],['grandpa','爺爺',ICON.grandpa],['grandma','奶奶',ICON.grandma],
         ['uncle','叔叔',ICON.uncle],['aunt','阿姨',ICON.aunt],['cousin','表哥',ICON.cousin],['friend','朋友','🤝'],
         ['best friend','最好的朋友','💛'],['teacher','老師',ICON.teacher],['classmate','同學','🧑‍🤝‍🧑']] };
SUB.pr = { lb:'他／她', basic:[['He','他',ICON.he],['She','她',ICON.she]], adv:[] };
SUB.job4 = { lb:'📘 課本', la:'🚀 夢想',
  basic:[['cook','廚師',ICON.cook],['nurse','護理師',ICON.nurse],['doctor','醫生',ICON.doctor],
         ['farmer','農夫',ICON.farmer],['teacher','老師',ICON.teacher],['student','學生',ICON.student]],
  adv:  [['YouTuber','YouTuber','📹'],['pilot','飛行員','✈️'],['police officer','警察','👮'],['firefighter','消防員','🚒'],
         ['scientist','科學家','🔬'],['game designer','遊戲設計師','🎮'],['programmer','程式設計師','💻'],['chef','主廚','👨‍🍳'],
         ['baker','麵包師傅','🥐'],['singer','歌手','🎤'],['dancer','舞者','💃'],['movie star','電影明星','🎬'],
         ['painter','畫家','🎨'],['photographer','攝影師','📷'],['basketball player','籃球員','🏀'],['baseball player','棒球員','⚾'],
         ['soccer player','足球員','⚽'],['vet','獸醫','🐾'],['dentist','牙醫','🦷'],['magician','魔術師','🎩']] };
SUB.color = { lb:'📘 課本', la:'🎨 還有',
  basic:[['red','紅色','🔴'],['blue','藍色','🔵'],['green','綠色','🟢'],['yellow','黃色','🟡'],['purple','紫色','🟣'],['orange','橘色','🟠']],
  adv:  [['pink','粉紅色','🩷'],['black','黑色','⚫'],['white','白色','⚪'],['brown','咖啡色','🟤'],['gray','灰色','🩶'],
         ['gold','金色','🥇'],['silver','銀色','🥈']] };
SUB.cj = { lb:'和／但', basic:[['and','而且','➕'],['but','但是','🔀']], adv:[] };
SUB.can = { lb:'📘 課本', la:'😎 還有',
  basic:[['sing','唱歌','🎤'],['read','閱讀','📖'],['draw','畫畫','✏️'],['write','寫字','✍️'],['dance','跳舞','💃']],
  adv:  [['swim','游泳','🏊'],['cook','做菜','🍳'],['play basketball','打籃球','🏀'],['play baseball','打棒球','⚾'],
         ['play dodgeball','打躲避球','🔴'],['play badminton','打羽毛球','🏸'],['play tag','玩鬼抓人','🏃'],['play the piano','彈鋼琴','🎹'],
         ['play the guitar','彈吉他','🎸'],['play video games','打電動','🎮'],['ride a bike','騎腳踏車','🚲'],['skateboard','溜滑板','🛹'],
         ['jump rope','跳繩','🪢'],['speak English','說英文','🗣️'],['do magic tricks','變魔術','🎩'],['make videos','拍影片','📹'],
         ['write code','寫程式','💻'],['take photos','拍照','📷'],['bake cakes','烤蛋糕','🎂'],['fly a kite','放風箏','🪁']] };
var R4 = '📝 Review 1';
var BL = function(k){return t('______','______','',{slot:k,blank:1})};
var HE = function(){return t('He','他',ICON.he,{slot:'pr'})};
var RV4C = [
 {type:'sent', kind:R4, zh:'我的名字是 ______。', slot:'nm4',
  tk:[t('My','我的',ICON.my),t('name','名字','📛'),t('is','是',ICON.is),BL('nm4'),t('.','。',ICON.dot,{tight:1})]},
 {type:'sent', kind:R4, zh:'這是我的 ______。', slot:'fam',
  tk:[t('This','這','👇'),t('is','是',ICON.is),t('my','我的',ICON.my),BL('fam'),t('.','。',ICON.dot,{tight:1})]},
 {type:'sent', kind:R4, zh:'他是一位 ______。', slots:['pr','job4'],
  tk:[HE(),t("'s",'是',ICON.is,{tight:1}),t('a','一位',ICON.a,{say:'uh'}),BL('job4'),t('.','。',ICON.dot,{tight:1})]},
 {type:'sent', kind:R4, zh:'他喜歡 ______，', slots:['pr','color'],
  tk:[HE(),t('likes','喜歡','❤️'),BL('color'),t(',','，','',{tight:1})]},
 {type:'sent', kind:R4, zh:'而且我喜歡 ______。', slots:['cj','color'],
  tk:[t('and','而且','➕',{slot:'cj'}),t('I','我','🙋'),t('like','喜歡','❤️'),BL('color'),t('.','。',ICON.dot,{tight:1})]},
 {type:'sent', kind:R4, zh:'他會 ______，', slots:['pr','can'],
  tk:[HE(),t('can','會','💪'),BL('can'),t(',','，','',{tight:1})]},
 {type:'sent', kind:R4, zh:'而且我會 ______。', slots:['cj','can'],
  tk:[t('and','而且','➕',{slot:'cj'}),t('I','我','🙋'),t('can','會','💪'),BL('can'),t('.','。',ICON.dot,{tight:1})]}
];
var SCR4 = [
 sc({at:'🎤 介紹我的家人',bg:'💬',l:'👦',b:'My name is Ken.',r:'👧',rt:'👂',use:'先說自己的名字。'}),
 sc({at:'🖼 拿出全家福',bg:'🖼',l:'👦',b:'This is my father.',r:'👨',rt:'👋',use:'指著照片：這是我的……'}),
 sc({at:'🖼 拿出全家福',bg:'🖼',l:'👦',b:'He’s a doctor.',r:'👨‍⚕️',rt:'🩺',use:'男生用 He’s，女生用 She’s。'}),
 sc({at:'🎨 最愛的顏色',bg:'🎨',l:'👦',b:'He likes blue,',r:'👨',rt:'🔵',use:'他／她 後面的 like 要加 s：likes。'}),
 sc({at:'🎨 最愛的顏色',bg:'🎨',l:'👦',b:'but I like red.',r:'👨',rt:'🔴',use:'一樣用 and，不一樣用 but。'}),
 sc({at:'💪 他會什麼',bg:'💪',l:'👦',b:'He can cook,',r:'👨',rt:'🍳',use:'can ＋ 動作：會做什麼。'}),
 sc({at:'💪 我會什麼',bg:'💪',l:'👦',b:'and I can cook, too.',r:'👨',rt:'😃',use:'一樣用 and，不一樣用 but。'})
];
RV4C.forEach(function (c, i) { c.scene = SCR4[i]; });
var RVR4 = [
 {t:'This is my ～ likes', q:[
  {q:'This is my father. 的中文是？', o:['這是我的爸爸。','他是我的爸爸。','這是你的爸爸。','那是我的爸爸嗎？'], h:'This ＝ 這，my ＝ 我的。'},
  {q:'「她是一位護理師。」英文是？', o:['She’s a nurse.','He’s a nurse.','She’s nurse.','She a nurse.'], h:'女生用 She’s，職業前面要有 a。'},
  {q:'He ___ blue.（他喜歡藍色）', o:['likes','like','liking','is like'], h:'He／She 後面的 like 要加 s：likes。'},
  {q:'He likes blue, ___ I like red.（我喜歡的不一樣）', o:['but','and','so','or'], h:'不一樣 ➜ but（但是）。'}
 ]},
 {t:'can ～ and／but', q:[
  {q:'He can draw, ___ I can draw, too.（我們都會）', o:['and','but','or','so'], h:'一樣 ➜ and（而且）。'},
  {q:'I can ___. 空格要放什麼？', o:['動作（swim）','顏色（red）','家人（mother）','職業（doctor）'], h:'can 後面接「動作」。'},
  {q:'He’s a pilot. 的中文是？', o:['他是一位飛行員。','她是一位飛行員。','他喜歡飛機。','他會開飛機嗎？'], h:'He’s ＝ 他是，pilot ＝ 飛行員。'},
  {q:'介紹媽媽：This is my mother. 下一句要說？', o:['She’s a teacher.','He’s a teacher.','I’m a teacher.','It’s a teacher.'], h:'媽媽是女生 ➜ She’s。'}
 ]}
];
var XPAGES = [
  { file:'review1.html', unit:'Review 1', title:'Review 1｜About My Family', other:'unit2.html', otherName:'⬅ Unit 2', cards:RV4C, rv:RVR4 }
];

/* 答錯頁「整句翻譯」：資料裡自動收集不到的幾句（使用者 2026-09-26 指定要整句中文，_gloss.js 讀這裡） */
var TRX = {
  "He's a farmer.":'他是一位農夫。', "He's a student.":'他是一位學生。', "She's a cook.":'她是一位廚師。',
  'Is he my father?':'他是我的爸爸嗎？', 'Is she my mother?':'她是我的媽媽嗎？', 'Is he my grandfather?':'他是我的爺爺嗎？',
  'He is my uncle.':'他是我的叔叔。', 'She is my aunt.':'她是我的阿姨。', "It's a book.":'它是一本書。'
};
module.exports = { ICON:ICON, SUB:SUB, U1:U1, U2:U2, RV1:RV1, RV2:RV2, USE:USE, TRX:TRX, XPAGES:XPAGES };

/* ── 真實情境：會動的小劇場（使用者 2026-09-24 指定改版）──────────────
 * 原本「地點＋三段 emoji＋一句話」學生完全看不懂，改成**兩個人演一次**：
 *   ① 背景（大大的、淡淡的）亮出來 ➜ ② 左邊的人走進來、右邊的人走進來
 *   ➜ ③ 左邊的人說話（對話框跳出來）➜ ④ 右邊的人回答（或頭上冒出 ❓ 👋）
 *   ➜ ⑤ 最下面一行 💡 告訴學生「什麼時候這樣說」。
 * 對話框可以點，點了就唸（念到哪亮到哪）。
 *
 *   at  左上角的小地點（emoji ＋ 最多 6 個字）
 *   bg  背景 emoji（會放很大、很淡）
 *   l／r   左邊／右邊的人（emoji）      ln／rn 人下面的小名牌（選填）
 *   rt  右邊那個人頭上冒出來的東西（選填，例如 ❓ 👋）
 *   b   左邊的人說的話（英文）；bzh:1 表示這一句是中文
 *   b2  右邊的人說的話（選填）
 *   use 什麼時候這樣說——一句話，最多 16 個字
 *
 * 🐢／🐇 ＝「慢慢說／說快一點」：縮寫卡用這一組，學生一看就懂「一樣的話，說得比較快」。
 * 英文一律正確：sister 是女生，主詞只能用 She。
 */
function sc(o){return o}
var SLOW1 = function(a,b,use){return sc({at:'⚡ 說快一點',bg:'💨',l:'🐢',ln:'慢慢說',b:a,r:'🐇',rn:'說快一點',b2:b,use:use})};
var SC1 = [
 sc({at:'🎒 教室',bg:'🏫',l:'👧',b:'Who’s he?',r:'🧑',rt:'❓',use:'想知道「是哪一個人」，就用 Who。'}),
 sc({at:'🏫 校門口',bg:'🏫',l:'👦',b:'Who’s he?',r:'👨',rt:'❓',use:'看到不認識的男生，問「他是誰？」'}),
 SLOW1('Who is','Who’s','說快一點，兩個字黏成一個字。'),
 SLOW1('Who is he?','Who’s he?','意思一模一樣，只是說得比較快。'),
 sc({at:'🏫 校門口',bg:'🏫',l:'👦',b:'He’s my father.',r:'👨',rt:'👋',use:'介紹身邊的男生：他是我爸爸。'}),
 SLOW1('He is','He’s','說快一點，兩個字黏成一個字。'),
 SLOW1('He is my father.','He’s my father.','意思一模一樣，只是說得比較快。'),
 sc({at:'🔁 中文 ➜ 英文',bg:'🔁',l:'🧒',ln:'中文',b:'他是誰？',bzh:1,r:'🧒',rn:'英文',b2:'Who’s he?',use:'中文「誰」在最後，英文 Who 在最前面。'}),
 sc({at:'🛒 超市',bg:'🛒',l:'👦',b:'Who’s she?',r:'👩',rt:'❓',use:'看到不認識的女生，問「她是誰？」'}),
 sc({at:'🛒 超市',bg:'🛒',l:'👧',b:'She’s my mother.',r:'👩',rt:'👋',use:'介紹身邊的女生：她是我媽媽。'}),
 SLOW1('She is','She’s','說快一點，兩個字黏成一個字。'),
 SLOW1('She is my mother.','She’s my mother.','意思一模一樣，只是說得比較快。'),
 sc({at:'🔁 中文 ➜ 英文',bg:'🔁',l:'🧒',ln:'中文',b:'她是誰？',bzh:1,r:'🧒',rn:'英文',b2:'Who’s she?',use:'中文「誰」在最後，英文 Who 在最前面。'}),
 sc({at:'🎤 一問一答',bg:'💬',l:'👧',b:'Who’s he?',r:'👦',b2:'He’s my brother.',use:'問 he，就用 He 回答。'}),
 sc({at:'🏫 爸爸來接你',bg:'🏫',l:'👧',b:'Who’s he?',r:'👦',b2:'He’s my father.',use:'同學問，你回答。'}),
 sc({at:'🛒 媽媽在旁邊',bg:'🛒',l:'👦',b:'Who’s she?',r:'👧',b2:'She’s my mother.',use:'同學問，你回答。'})
];

var SC2 = [
 sc({at:'🏥 醫院',bg:'🏥',l:'👧',b:'He is a doctor.',r:'👨‍⚕️',rt:'🩺',use:'介紹他的工作。'}),
 SLOW1('He is','He’s','說快一點，兩個字黏成一個字。'),
 SLOW1('He is a doctor.','He’s a doctor.','意思一模一樣，只是說得比較快。'),
 sc({at:'🏥 醫院',bg:'🏥',l:'🙋',ln:'我知道',b:'He is a doctor.',r:'🤔',rn:'不確定',b2:'Is he a doctor?',use:'不確定，就把 Is 搬到最前面來問。'}),
 sc({at:'🏥 醫院',bg:'🏥',l:'👦',b:'Is he a doctor?',r:'👨‍⚕️',rt:'❓',use:'不確定他的工作，就問一問。'}),
 sc({at:'✅ 猜對了',bg:'🏥',l:'👦',b:'Is he a doctor?',r:'👧',b2:'Yes, he is.',use:'猜對了，就說 Yes。'}),
 sc({at:'❌ 猜錯了',bg:'🏫',l:'👦',b:'Is he a doctor?',r:'👧',b2:'No, he isn’t.',use:'猜錯了，就說 No。'}),
 SLOW1('is not','isn’t','說快一點，兩個字黏成一個字。'),
 sc({at:'🏫 猜錯以後',bg:'🏫',l:'👦',b:'Is he a doctor?',r:'👧',b2:'No, he isn’t. He’s a student.',use:'先說「不是」，再說他真正的工作。'}),
 sc({at:'🏫 學校',bg:'🏫',l:'👦',b:'She is a teacher.',r:'👩‍🏫',rt:'📚',use:'介紹她的工作。'}),
 SLOW1('She is','She’s','說快一點，兩個字黏成一個字。'),
 SLOW1('She is a teacher.','She’s a teacher.','意思一模一樣，只是說得比較快。'),
 sc({at:'🏫 走廊',bg:'🏫',l:'🙋',ln:'我知道',b:'She is a teacher.',r:'🤔',rn:'不確定',b2:'Is she a teacher?',use:'不確定，就把 Is 搬到最前面來問。'}),
 sc({at:'🏫 走廊',bg:'🏫',l:'👧',b:'Is she a teacher?',r:'👩‍🏫',rt:'❓',use:'不確定她的工作，就問一問。'}),
 sc({at:'✅ 猜對了',bg:'🏫',l:'👧',b:'Is she a teacher?',r:'👦',b2:'Yes, she is.',use:'猜對了，就說 Yes。'}),
 sc({at:'❌ 猜錯了',bg:'🏥',l:'👧',b:'Is she a teacher?',r:'👦',b2:'No, she isn’t.',use:'猜錯了，就說 No。'}),
 SLOW1('is not','isn’t','說快一點，兩個字黏成一個字。'),
 sc({at:'🏥 猜錯以後',bg:'🏥',l:'👧',b:'Is she a teacher?',r:'👦',b2:'No, she isn’t. She’s a nurse.',use:'先說「不是」，再說她真正的工作。'}),
 sc({at:'🎨 用顏色記',bg:'🔄',l:'🙋',ln:'直述句',b:'He is a doctor.',r:'🤔',rn:'問句',b2:'Is he a doctor?',use:'換位置，句號變問號。'}),
 sc({at:'🏥 醫院',bg:'🏥',l:'👧',b:'Is he a doctor?',r:'👦',b2:'Yes, he is.',use:'問一句，答一句。'}),
 sc({at:'🏥 醫院',bg:'🏥',l:'👦',b:'Is she a nurse?',r:'👧',b2:'No, she isn’t.',use:'問一句，答一句。'})
];

if (SC1.length !== 16 || SC2.length !== 21) throw new Error('情境數量跟卡片數量對不起來');
U1.forEach(function (c, i) { c.scene = SC1[i]; });
U2.forEach(function (c, i) { c.scene = SC2[i]; });
