/* sentences/_data.js — Unit 1／Unit 2 句型的唯一真相來源
 * 改句型、改中文、改圖示、改替換字，只改這一個檔，然後 node sentences/_build.js
 *
 * token 欄位
 *   en   英文（含 ' 的字會自動把 ' 上紅色）
 *   zh   這個字正下方的中文
 *   ic   這個字正下方的秒懂圖示（emoji）
 *   tight  true = 黏在前一個字後面，中間不留空白（'s、? 、. 用）
 *   hl   'b' 藍底（he）／'p' 粉底（she）／'y' 黃底（be 動詞）
 *   slot 'fam' | 'job' = 這個位置可以被下面的替換字換掉
 */

var ICON = {
  /* 功能字 */
  who:'❓🧑', is:'🟰', my:'🙋', a:'1️⃣', q:'❓', dot:'⏹',
  yes:'✅', no:'❌', not:'🚫',
  he:'👦', she:'👧',
  what:'❓📦', how:'❓🌡',
  /* 家人 */
  father:'👨', mother:'👩', brother:'🧒', sister:'👧',
  grandfather:'👴', grandmother:'👵', dad:'👨', mom:'👩',
  grandpa:'👴', grandma:'👵', uncle:'🧔', aunt:'👩‍🦱',
  cousin:'🧑‍🤝‍🧑', nephew:'👦', niece:'👧',
  /* 職業 */
  doctor:'👨‍⚕️', teacher:'👩‍🏫', nurse:'👩‍⚕️',
  cook:'👨‍🍳', farmer:'👨‍🌾', student:'🧑‍🎓'
};

/* 替換字（點一下就換進句子裡） */
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
 {type:'focus', title:'Who ＝ 問「人」',
  rows:[['Who','誰',ICON.who,'問的是「人」'],
        ['What','什麼',ICON.what,'問的是「東西」'],
        ['How','怎麼樣',ICON.how,'問的是「好不好」']],
  note:'看到 Who，答案一定是一個人。'},

 {type:'sent', zh:'他是誰？', say:'Who is he?',
  tk:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),
      t('he','他',ICON.he),t('?','？',ICON.q,{tight:1})]},

 {type:'eq', zh:'兩句一模一樣，Who’s 只是把 is 縮起來。',
  a:[t('Who','誰',ICON.who),t('is','是',ICON.is)],
  b:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1})],
  note:'紅色那一撇 ’ 就是把 i 藏起來的地方。'},

 {type:'sent', zh:'他是我的爸爸。', say:'He is my father.', slot:'he',
  tk:[t('He','他',ICON.he),t("'s",'是',ICON.is,{tight:1}),
      t('my','我的',ICON.my),t('father','爸爸',ICON.father,{slot:'he'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'eq', zh:'兩句一模一樣。',
  a:[t('He','他',ICON.he),t('is','是',ICON.is),t('my','我的',ICON.my),t('father','爸爸',ICON.father)],
  b:[t('He','他',ICON.he),t("'s",'是',ICON.is,{tight:1}),t('my','我的',ICON.my),t('father','爸爸',ICON.father)],
  note:'He is ＝ He’s。'},

 {type:'order', zhRow:[['他',ICON.he,'b'],['是',ICON.is,'y'],['誰',ICON.who,'r'],['？',ICON.q,'g']],
  enRow:[['Who',ICON.who,'r'],["'s",ICON.is,'y'],['he',ICON.he,'b'],['?',ICON.q,'g']],
  say:'Who is he?',
  note:'「誰」在中文的最後一個字，Who 在英文的第一個字。'},

 {type:'sent', zh:'她是誰？', say:'Who is she?',
  tk:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),
      t('she','她',ICON.she),t('?','？',ICON.q,{tight:1})]},

 {type:'sent', zh:'她是我的媽媽。', say:'She is my mother.', slot:'she',
  tk:[t('She','她',ICON.she),t("'s",'是',ICON.is,{tight:1}),
      t('my','我的',ICON.my),t('mother','媽媽',ICON.mother,{slot:'she'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'eq', zh:'兩句一模一樣。',
  a:[t('She','她',ICON.she),t('is','是',ICON.is),t('my','我的',ICON.my),t('mother','媽媽',ICON.mother)],
  b:[t('She','她',ICON.she),t("'s",'是',ICON.is,{tight:1}),t('my','我的',ICON.my),t('mother','媽媽',ICON.mother)],
  note:'She is ＝ She’s。'},

 {type:'order', zhRow:[['她',ICON.she,'p'],['是',ICON.is,'y'],['誰',ICON.who,'r'],['？',ICON.q,'g']],
  enRow:[['Who',ICON.who,'r'],["'s",ICON.is,'y'],['she',ICON.she,'p'],['?',ICON.q,'g']],
  say:'Who is she?',
  note:'中文最後問「誰」，英文最前面就問 Who。'},

 {type:'focus', title:'問 he 就答 He，問 she 就答 She',
  rows:[['Who’s he?','他是誰？',ICON.he,'答句開頭 → He’s …'],
        ['Who’s she?','她是誰？',ICON.she,'答句開頭 → She’s …']],
  note:'問句最後一個字是誰，答句第一個字就是誰。'},

 {type:'pair', q:'Who’s he?', qzh:'他是誰？', a:'He’s my father.', azh:'他是我的爸爸。',
  qic:ICON.who, aic:ICON.father},
 {type:'pair', q:'Who’s she?', qzh:'她是誰？', a:'She’s my mother.', azh:'她是我的媽媽。',
  qic:ICON.who, aic:ICON.mother}
];

/* ---------------- Unit 2 ---------------- */
var U2 = [
 {type:'sent', zh:'他是一位醫生。', say:'He is a doctor.', slot:'job',
  tk:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'eq', zh:'兩句一模一樣。',
  a:[t('He','他',ICON.he),t('is','是',ICON.is),t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor)],
  b:[t('He','他',ICON.he),t("'s",'是',ICON.is,{tight:1}),t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor)],
  note:'He is ＝ He’s。'},

 {type:'swap', subj:'he', slot:'job',
  st:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),t('.','。',ICON.dot,{tight:1})],
  qu:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),t('?','？',ICON.q,{tight:1})],
  stzh:'他是一位醫生。', quzh:'他是一位醫生嗎？',
  note:'藍色的 he 和黃色的 is 換位置，句號換成問號。'},

 {type:'sent', zh:'他是一位醫生嗎？', say:'Is he a doctor?', slot:'job',
  tk:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),
      t('?','？',ICON.q,{tight:1})]},

 {type:'sent', zh:'是的，他是。', say:'Yes, he is.',
  tk:[t('Yes','是的',ICON.yes),t(',','，','',{tight:1}),
      t('he','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'sent', zh:'不，他不是。', say:"No, he isn't.",
  tk:[t('No','不',ICON.no),t(',','，','',{tight:1}),
      t('he','他',ICON.he,{hl:'b'}),t("isn't",'不是',ICON.not,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'sent', zh:'她是一位老師。', say:'She is a teacher.', slot:'job',
  tk:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'eq', zh:'兩句一模一樣。',
  a:[t('She','她',ICON.she),t('is','是',ICON.is),t('a','一位',ICON.a),t('teacher','老師',ICON.teacher)],
  b:[t('She','她',ICON.she),t("'s",'是',ICON.is,{tight:1}),t('a','一位',ICON.a),t('teacher','老師',ICON.teacher)],
  note:'She is ＝ She’s。'},

 {type:'swap', subj:'she', slot:'job',
  st:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),t('.','。',ICON.dot,{tight:1})],
  qu:[t('Is','是',ICON.is,{hl:'y'}),t('she','她',ICON.she,{hl:'p'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),t('?','？',ICON.q,{tight:1})],
  stzh:'她是一位老師。', quzh:'她是一位老師嗎？',
  note:'粉色的 she 和黃色的 is 換位置，句號換成問號。'},

 {type:'sent', zh:'她是一位老師嗎？', say:'Is she a teacher?', slot:'job',
  tk:[t('Is','是',ICON.is,{hl:'y'}),t('she','她',ICON.she,{hl:'p'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),
      t('?','？',ICON.q,{tight:1})]},

 {type:'sent', zh:'是的，她是。', say:'Yes, she is.',
  tk:[t('Yes','是的',ICON.yes),t(',','，','',{tight:1}),
      t('she','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'sent', zh:'不，她不是。', say:"No, she isn't.",
  tk:[t('No','不',ICON.no),t(',','，','',{tight:1}),
      t('she','她',ICON.she,{hl:'p'}),t("isn't",'不是',ICON.not,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'focus', title:'交換位置就變問句',
  rows:[['He is a doctor.','他是一位醫生。',ICON.he,'藍 → 黃'],
        ['Is he a doctor?','他是一位醫生嗎？',ICON.is,'黃 → 藍'],
        ['短答不可以縮寫','Yes, he is. ✅　Yes, he’s. ❌',ICON.yes,'句尾的 is 不縮']],
  note:'只有前面兩個字換位置，後面完全不動。'},

 {type:'pair', q:'Is he a doctor?', qzh:'他是一位醫生嗎？', a:'Yes, he is.', azh:'是的，他是。',
  qic:ICON.doctor, aic:ICON.yes},
 {type:'pair', q:'Is she a nurse?', qzh:'她是一位護理師嗎？', a:"No, she isn't.", azh:'不，她不是。',
  qic:ICON.nurse, aic:ICON.no}
];

module.exports = { ICON:ICON, SUB:SUB, U1:U1, U2:U2 };
