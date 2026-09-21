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
           ['dad','爸比',ICON.dad],['grandpa','阿公',ICON.grandpa]],
    adv:  [['uncle','叔叔',ICON.uncle],['nephew','姪子',ICON.nephew],
           ['cousin','表哥',ICON.cousin]]
  },
  she: {
    basic:[['sister','姊姊',ICON.sister],['grandmother','奶奶',ICON.grandmother],
           ['grandma','阿嬤',ICON.grandma],['mom','媽咪',ICON.mom]],
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

function t(en,zh,ic,o){var x={en:en,zh:zh,ic:ic};if(o)for(var k in o)x[k]=o[k];return x;}

/* ---------------- Unit 1 ---------------- */
var U1 = [
 /* 1 */
 {type:'focus', eqRow:1, title:'Who ＝ 問「人」',
  rows:[['Who','誰',ICON.who],['What','什麼',ICON.what],['How','怎麼樣',ICON.how]]},

 /* 2 */
 {type:'sent', zh:'他是誰？', say:'Who is he?',
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
 {type:'sent', zh:'他是我的爸爸。', say:'He is my father.', slot:'he',
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
  say:'Who is he?'},

 /* 9 */
 {type:'sent', zh:'她是誰？', say:'Who is she?',
  tk:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),
      t('she','她',ICON.she,{hl:'lp'}),t('?','？',ICON.q,{tight:1})]},

 /* 10 */
 {type:'sent', zh:'她是我的媽媽。', say:'She is my mother.', slot:'she',
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
  say:'Who is she?'},

 /* 14 秒懂重點改成會動的：he 問 ➜ He 答，兩個都是藍底（使用者 2026-09-21 指定） */
 {type:'echo',
  rows:[{q:'Who’s he?', qk:'he', qzh:'他 是 誰？', a:'He’s ______.', ak:'He', azh:'他 是 ______。', cls:'b'},
        {q:'Who’s she?', qk:'she', qzh:'她 是 誰？', a:'She’s ______.', ak:'She', azh:'她 是 ______。', cls:'lp'}]},

 /* 15 */
 {type:'pair', q:'Who’s he?', qk:'he', qzh:'他 是 誰？',
  a:'He’s my {w}.', ak:'He', azh:'他 是 我的 {z}。', cls:'b',
  slot:'he', w:'father', z:'爸爸', qic:ICON.who, aic:ICON.father},

 /* 16 */
 {type:'pair', q:'Who’s she?', qk:'she', qzh:'她 是 誰？',
  a:'She’s my {w}.', ak:'She', azh:'她 是 我的 {z}。', cls:'lp',
  slot:'she', w:'mother', z:'媽媽', qic:ICON.who, aic:ICON.mother}
];

/* ---------------- Unit 2 ---------------- */
var U2 = [
 /* 1 */
 {type:'sent', zh:'他是一位醫生。', say:'He is a doctor.', slot:'job',
  tk:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y',ri:'i'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 2 秒懂動畫：He is ➜ He's（使用者 2026-09-21 指定新增） */
 {type:'morph',
  a:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{ri:'i'})],
  b:[t('He','他',ICON.he,{hl:'b'}),t("'s",'是',ICON.is,{tight:1})],
  say:"He's"},

 /* 3 */
 {type:'eq',
  a:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{ri:'i'}),t('a','一位',ICON.a),
     t('doctor','醫生',ICON.doctor),t('.','。',ICON.dot,{tight:1})],
  b:[t('He','他',ICON.he,{hl:'b'}),t("'s",'是',ICON.is,{tight:1}),t('a','一位',ICON.a),
     t('doctor','醫生',ICON.doctor),t('.','。',ICON.dot,{tight:1})]},

 /* 4 */
 {type:'swap', subj:'he', slot:'job',
  st:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),t('.','。',ICON.dot,{tight:1})],
  qu:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),t('?','？',ICON.q,{tight:1})],
  stzh:'他是一位醫生。', quzh:'他是一位醫生嗎？',
  note:'🔵 he 和 🟡 is 換位置，。變成 ？'},

 /* 5 */
 {type:'sent', zh:'他是一位醫生嗎？', say:'Is he a doctor?', slot:'job',
  tk:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),
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
      t('a','一位',ICON.a),t('______','______','',{slot:'job',blank:1}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 10 */
 {type:'sent', zh:'她是一位老師。', say:'She is a teacher.', slot:'job',
  tk:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y',ri:'i'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 11 秒懂動畫：She is ➜ She's */
 {type:'morph',
  a:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{ri:'i'})],
  b:[t('She','她',ICON.she,{hl:'p'}),t("'s",'是',ICON.is,{tight:1})],
  say:"She's"},

 /* 12 */
 {type:'eq',
  a:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{ri:'i'}),t('a','一位',ICON.a),
     t('teacher','老師',ICON.teacher),t('.','。',ICON.dot,{tight:1})],
  b:[t('She','她',ICON.she,{hl:'p'}),t("'s",'是',ICON.is,{tight:1}),t('a','一位',ICON.a),
     t('teacher','老師',ICON.teacher),t('.','。',ICON.dot,{tight:1})]},

 /* 13 */
 {type:'swap', subj:'she', slot:'job',
  st:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),t('.','。',ICON.dot,{tight:1})],
  qu:[t('Is','是',ICON.is,{hl:'y'}),t('she','她',ICON.she,{hl:'p'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),t('?','？',ICON.q,{tight:1})],
  stzh:'她是一位老師。', quzh:'她是一位老師嗎？',
  note:'💗 she 和 🟡 is 換位置，。變成 ？'},

 /* 14 */
 {type:'sent', zh:'她是一位老師嗎？', say:'Is she a teacher?', slot:'job',
  tk:[t('Is','是',ICON.is,{hl:'y'}),t('she','她',ICON.she,{hl:'p'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),
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
      t('a','一位',ICON.a),t('______','______','',{slot:'job',blank:1}),
      t('.','。',ICON.dot,{tight:1})]},

 /* 19 秒懂重點改成會動的：直述句 ⇄ 問句 自己演一遍（使用者 2026-09-21 指定） */
 {type:'swapdemo',
  st:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor),t('.','。',ICON.dot,{tight:1})],
  qu:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor),t('?','？',ICON.q,{tight:1})],
  stzh:'他 是 一位 醫生。', quzh:'他 是 一位 醫生 嗎？',
  note:'短答不縮寫：Yes, he is. ✅　Yes, he’s. ❌'},

 /* 20 */
 {type:'pair', q:'Is he a {w}?', qk:'he', qzh:'他 是 一位 {z} 嗎？',
  a:'Yes, he is.', ak:'he', azh:'是的，他 是。', cls:'b',
  slot:'job', w:'doctor', z:'醫生', qic:ICON.doctor, aic:ICON.yes},

 /* 21 */
 {type:'pair', q:'Is she a {w}?', qk:'she', qzh:'她 是 一位 {z} 嗎？',
  a:'No, she isn’t.', ak:'she', azh:'不，她 不是。', cls:'p',
  slot:'job', w:'nurse', z:'護理師', qic:ICON.nurse, aic:ICON.no}
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

module.exports = { ICON:ICON, SUB:SUB, U1:U1, U2:U2, RV1:RV1, RV2:RV2 };

/* ── 真實情境（使用者 2026-09-20 指定，2026-09-21 補上新卡片）──────────────
 * 老師按「🎞 情境」才出現，平常不佔版面。
 * 一張卡一個情境，三行講完，而且每一行都要短：
 *   at  場景（在哪裡）——最多 8 個字
 *   pic 秒懂畫面：用 ➜ 分段，產生器會一段一段跳出來（秒懂動畫）。最多三段
 *   use 什麼時候會這樣說——一句話，最多 12 個字
 * 做法是 emoji 情境畫面，不是照片（離線也要能上課，教室網路常斷）。
 * 英文一律正確：sister 是女生，主詞只能用 She。
 */
var SC1 = [
 {at:'🎒 教室', pic:'❓ ➜ 👦 👧', use:'問「人」就用 Who。'},
 {at:'🏫 校門口', pic:'👦 ➜ ❓ ➜ 👨', use:'不認識的男生，問他是誰。'},
 {at:'⚡ 講快一點', pic:'Who is ➜ ⚡ ➜ Who’s', use:'兩個字黏成一個字。'},
 {at:'📺 聽外國人講話', pic:'📝 Who is ➜ 🗣️ Who’s', use:'寫兩個字，講一個字。'},
 {at:'🏫 校門口', pic:'👦 ➜ 🤝 ➜ 👨', use:'介紹他是我爸爸。'},
 {at:'⚡ 講快一點', pic:'He is ➜ ⚡ ➜ He’s', use:'i 躲起來，’ 站上去。'},
 {at:'✏️ 寫　vs　🗣️ 說', pic:'📝 He is ➜ 🗣️ He’s', use:'寫 He is，講 He’s。'},
 {at:'🔁 中文 vs 英文', pic:'🇹🇼 他是誰？ ➜ 🇺🇸 Who’s he?', use:'「誰」跑到最前面。'},
 {at:'🛒 超市', pic:'👦 ➜ ❓ ➜ 👧', use:'不認識的女生，問她是誰。'},
 {at:'🛒 超市', pic:'👧 ➜ 🤝 ➜ 👩', use:'介紹她是我媽媽。'},
 {at:'⚡ 講快一點', pic:'She is ➜ ⚡ ➜ She’s', use:'i 躲起來，’ 站上去。'},
 {at:'✏️ 寫　vs　🗣️ 說', pic:'📝 She is ➜ 🗣️ She’s', use:'寫 She is，講 She’s。'},
 {at:'🔁 中文 vs 英文', pic:'🇹🇼 她是誰？ ➜ 🇺🇸 Who’s she?', use:'「誰」跑到最前面。'},
 {at:'🎤 兩個人對話', pic:'❓ he ➜ ✅ He', use:'問誰就答誰。'},
 {at:'🏫 爸爸來接你', pic:'👦 ➜ ❓ ➜ 👨', use:'問一句，答一句。'},
 {at:'🛒 媽媽在旁邊', pic:'👧 ➜ ❓ ➜ 👩', use:'問一句，答一句。'}
];

var SC2 = [
 {at:'🏥 醫院', pic:'👦 ➜ 👉 ➜ 👨‍⚕️', use:'介紹他的工作。'},
 {at:'⚡ 講快一點', pic:'He is ➜ ⚡ ➜ He’s', use:'i 躲起來，’ 站上去。'},
 {at:'✏️ 寫　vs　🗣️ 說', pic:'📝 He is ➜ 🗣️ He’s', use:'寫 He is，講 He’s。'},
 {at:'🍳 餐廳', pic:'🔵 he 🟡 is ➜ 🔄 ➜ 🟡 Is 🔵 he', use:'換位置就變問句。'},
 {at:'🏥 醫院', pic:'👦 ➜ ❓ ➜ 👨‍⚕️', use:'不確定就用問的。'},
 {at:'✅ 猜對了', pic:'👧 ➜ 👍 ➜ 👨‍⚕️', use:'猜對就說 Yes。'},
 {at:'❌ 猜錯了', pic:'👧 ➜ 🙅 ➜ 🧑‍🎓', use:'猜錯就說 No。'},
 {at:'🚫 兩個字變一個', pic:'is not ➜ ⚡ ➜ isn’t', use:'o 躲起來，’ 站上去。'},
 {at:'🏥 猜錯以後', pic:'🙅 ➜ 👉 ➜ 🧑‍🎓', use:'不是醫生，那是什麼？'},
 {at:'🏫 學校', pic:'👧 ➜ 👉 ➜ 👩‍🏫', use:'介紹她的工作。'},
 {at:'⚡ 講快一點', pic:'She is ➜ ⚡ ➜ She’s', use:'i 躲起來，’ 站上去。'},
 {at:'✏️ 寫　vs　🗣️ 說', pic:'📝 She is ➜ 🗣️ She’s', use:'寫 She is，講 She’s。'},
 {at:'🏫 走廊', pic:'💗 she 🟡 is ➜ 🔄 ➜ 🟡 Is 💗 she', use:'換位置就變問句。'},
 {at:'🏫 走廊', pic:'👦 ➜ ❓ ➜ 👩‍🏫', use:'不確定就用問的。'},
 {at:'✅ 猜對了', pic:'👦 ➜ 👍 ➜ 👩‍🏫', use:'猜對就說 Yes。'},
 {at:'❌ 猜錯了', pic:'👦 ➜ 🙅 ➜ 👩‍⚕️', use:'猜錯就說 No。'},
 {at:'🚫 兩個字變一個', pic:'is not ➜ ⚡ ➜ isn’t', use:'o 躲起來，’ 站上去。'},
 {at:'🏫 猜錯以後', pic:'🙅 ➜ 👉 ➜ 👩‍⚕️', use:'不是老師，那是什麼？'},
 {at:'🎨 用顏色記', pic:'🔵🟡 。 ➜ 🔄 ➜ 🟡🔵 ？', use:'換位置，句號變問號。'},
 {at:'🏥 醫院', pic:'👦 ➜ ❓ ➜ 👍', use:'問一句，答一句。'},
 {at:'🏥 醫院', pic:'👧 ➜ ❓ ➜ 🙅', use:'問一句，答一句。'}
];

U1.forEach(function (c, i) { c.scene = SC1[i]; });
U2.forEach(function (c, i) { c.scene = SC2[i]; });
