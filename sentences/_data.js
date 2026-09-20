/* sentences/_data.js — Unit 1／Unit 2 句型的唯一真相來源
 * 改句型、改中文、改圖示、改替換字，只改這一個檔，然後 node sentences/_build.js
 *
 * token 欄位
 *   en   英文（含 ' 的字會自動把 ' 上紅色）
 *   zh   這個字正下方的中文
 *   ic   這個字正下方的秒懂圖示（emoji）。標點符號一律不給圖示——版面才清爽
 *   tight  true = 黏在前一個字後面，中間不留空白（'s、? 、. 用）
 *   hl   'b' 藍底（he）／'p' 粉底（she）／'y' 黃底（be 動詞）
 *   slot 'he' | 'she' | 'job' = 這個位置可以被下面的替換字換掉
 *
 * 'S 的發音：不用寫 say，產生器會自動把 's 唸成「前一個字＋'s」
 * （Who's → /huːz/、He's → /hiːz/），學生聽到的就是 /z/，不是「ess」。
 */

var ICON = {
  /* 功能字（Who 用純問號，不用人形——才不會跟 he 👦 撞在一起） */
  who:'❓', is:'🟰', my:'🙋', a:'1️⃣',
  q:'', dot:'', comma:'',            /* 標點沒有圖示（使用者指定：圖示太多很亂） */
  yes:'✅', no:'❌', not:'🚫',
  he:'👦', she:'👧',
  what:'📦', how:'🌡',
  /* 家人 */
  father:'👨', mother:'👩', brother:'🧒', sister:'👧',
  grandfather:'👴', grandmother:'👵', dad:'👨', mom:'👩',
  grandpa:'👴', grandma:'👵', uncle:'🧔', aunt:'👩‍🦱',
  cousin:'🧑‍🤝‍🧑', nephew:'👦', niece:'👧',
  /* 職業 */
  doctor:'👨‍⚕️', teacher:'👩‍🏫', nurse:'👩‍⚕️',
  cook:'👨‍🍳', farmer:'👨‍🌾', student:'🧑‍🎓'
};

/* 替換字（點一下就換進句子裡；版面放在卡片最下面，不擋住中間的英文句子） */
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
  rows:[['Who','誰',ICON.who],['What','什麼',ICON.what],['How','怎麼樣',ICON.how]],
  note:'看到 Who，答案一定是人。'},

 {type:'sent', zh:'他是誰？', say:'Who is he?',
  tk:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),
      t('he','他',ICON.he),t('?','？',ICON.q,{tight:1})]},

 {type:'eq',
  a:[t('Who','誰',ICON.who),t('is','是',ICON.is),t('he','他',ICON.he),t('?','？',ICON.q,{tight:1})],
  b:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),t('he','他',ICON.he),t('?','？',ICON.q,{tight:1})],
  note:'紅色的 ’ ＝ 被藏起來的 i。'},

 {type:'sent', zh:'他是我的爸爸。', say:'He is my father.', slot:'he',
  tk:[t('He','他',ICON.he),t("'s",'是',ICON.is,{tight:1}),
      t('my','我的',ICON.my),t('father','爸爸',ICON.father,{slot:'he'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'eq',
  a:[t('He','他',ICON.he),t('is','是',ICON.is),t('my','我的',ICON.my),
     t('father','爸爸',ICON.father),t('.','。',ICON.dot,{tight:1})],
  b:[t('He','他',ICON.he),t("'s",'是',ICON.is,{tight:1}),t('my','我的',ICON.my),
     t('father','爸爸',ICON.father),t('.','。',ICON.dot,{tight:1})]},

 {type:'order', zhRow:[['他',ICON.he,'b'],['是',ICON.is,'y'],['誰',ICON.who,'r'],['？',ICON.q,'g']],
  enRow:[['Who',ICON.who,'r'],["'s",ICON.is,'y'],['he',ICON.he,'b'],['?',ICON.q,'g']],
  say:'Who is he?'},

 {type:'sent', zh:'她是誰？', say:'Who is she?',
  tk:[t('Who','誰',ICON.who),t("'s",'是',ICON.is,{tight:1}),
      t('she','她',ICON.she),t('?','？',ICON.q,{tight:1})]},

 {type:'sent', zh:'她是我的媽媽。', say:'She is my mother.', slot:'she',
  tk:[t('She','她',ICON.she),t("'s",'是',ICON.is,{tight:1}),
      t('my','我的',ICON.my),t('mother','媽媽',ICON.mother,{slot:'she'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'eq',
  a:[t('She','她',ICON.she),t('is','是',ICON.is),t('my','我的',ICON.my),
     t('mother','媽媽',ICON.mother),t('.','。',ICON.dot,{tight:1})],
  b:[t('She','她',ICON.she),t("'s",'是',ICON.is,{tight:1}),t('my','我的',ICON.my),
     t('mother','媽媽',ICON.mother),t('.','。',ICON.dot,{tight:1})]},

 {type:'order', zhRow:[['她',ICON.she,'p'],['是',ICON.is,'y'],['誰',ICON.who,'r'],['？',ICON.q,'g']],
  enRow:[['Who',ICON.who,'r'],["'s",ICON.is,'y'],['she',ICON.she,'p'],['?',ICON.q,'g']],
  say:'Who is she?'},

 {type:'focus', title:'問 he 就答 He，問 she 就答 She',
  rows:[['Who’s he? ➜ He’s …','問 他 ➜ 答 他',ICON.he],
        ['Who’s she? ➜ She’s …','問 她 ➜ 答 她',ICON.she]]},

 {type:'pair', q:'Who’s he?', qzh:'他 是 誰？', a:'He’s my father.', azh:'他 是 我的 爸爸。',
  qic:ICON.who, aic:ICON.father},
 {type:'pair', q:'Who’s she?', qzh:'她 是 誰？', a:'She’s my mother.', azh:'她 是 我的 媽媽。',
  qic:ICON.who, aic:ICON.mother}
];

/* ---------------- Unit 2 ---------------- */
var U2 = [
 {type:'sent', zh:'他是一位醫生。', say:'He is a doctor.', slot:'job',
  tk:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'eq',
  a:[t('He','他',ICON.he),t('is','是',ICON.is),t('a','一位',ICON.a),
     t('doctor','醫生',ICON.doctor),t('.','。',ICON.dot,{tight:1})],
  b:[t('He','他',ICON.he),t("'s",'是',ICON.is,{tight:1}),t('a','一位',ICON.a),
     t('doctor','醫生',ICON.doctor),t('.','。',ICON.dot,{tight:1})]},

 {type:'swap', subj:'he', slot:'job',
  st:[t('He','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),t('.','。',ICON.dot,{tight:1})],
  qu:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),t('?','？',ICON.q,{tight:1})],
  stzh:'他是一位醫生。', quzh:'他是一位醫生嗎？',
  note:'🔵 he 和 🟡 is 換位置。'},

 {type:'sent', zh:'他是一位醫生嗎？', say:'Is he a doctor?', slot:'job',
  tk:[t('Is','是',ICON.is,{hl:'y'}),t('he','他',ICON.he,{hl:'b'}),
      t('a','一位',ICON.a),t('doctor','醫生',ICON.doctor,{slot:'job'}),
      t('?','？',ICON.q,{tight:1})]},

 {type:'sent', zh:'是的，他是。', say:'Yes, he is.',
  tk:[t('Yes','是的',ICON.yes),t(',','，',ICON.comma,{tight:1}),
      t('he','他',ICON.he,{hl:'b'}),t('is','是',ICON.is,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'sent', zh:'不，他不是。', say:"No, he isn't.",
  tk:[t('No','不',ICON.no),t(',','，',ICON.comma,{tight:1}),
      t('he','他',ICON.he,{hl:'b'}),t("isn't",'不是',ICON.not,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'sent', zh:'她是一位老師。', say:'She is a teacher.', slot:'job',
  tk:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'eq',
  a:[t('She','她',ICON.she),t('is','是',ICON.is),t('a','一位',ICON.a),
     t('teacher','老師',ICON.teacher),t('.','。',ICON.dot,{tight:1})],
  b:[t('She','她',ICON.she),t("'s",'是',ICON.is,{tight:1}),t('a','一位',ICON.a),
     t('teacher','老師',ICON.teacher),t('.','。',ICON.dot,{tight:1})]},

 {type:'swap', subj:'she', slot:'job',
  st:[t('She','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),t('.','。',ICON.dot,{tight:1})],
  qu:[t('Is','是',ICON.is,{hl:'y'}),t('she','她',ICON.she,{hl:'p'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),t('?','？',ICON.q,{tight:1})],
  stzh:'她是一位老師。', quzh:'她是一位老師嗎？',
  note:'💗 she 和 🟡 is 換位置。'},

 {type:'sent', zh:'她是一位老師嗎？', say:'Is she a teacher?', slot:'job',
  tk:[t('Is','是',ICON.is,{hl:'y'}),t('she','她',ICON.she,{hl:'p'}),
      t('a','一位',ICON.a),t('teacher','老師',ICON.teacher,{slot:'job'}),
      t('?','？',ICON.q,{tight:1})]},

 {type:'sent', zh:'是的，她是。', say:'Yes, she is.',
  tk:[t('Yes','是的',ICON.yes),t(',','，',ICON.comma,{tight:1}),
      t('she','她',ICON.she,{hl:'p'}),t('is','是',ICON.is,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'sent', zh:'不，她不是。', say:"No, she isn't.",
  tk:[t('No','不',ICON.no),t(',','，',ICON.comma,{tight:1}),
      t('she','她',ICON.she,{hl:'p'}),t("isn't",'不是',ICON.not,{hl:'y'}),
      t('.','。',ICON.dot,{tight:1})]},

 {type:'focus', title:'交換位置 ➜ 變問句',
  rows:[['He is a doctor.','他 是 一位 醫生。','🔵'],
        ['Is he a doctor?','他 是 一位 醫生 嗎？','🟡']],
  note:'短答不縮寫：Yes, he is. ✅　Yes, he’s. ❌'},

 {type:'pair', q:'Is he a doctor?', qzh:'他 是 一位 醫生 嗎？', a:'Yes, he is.', azh:'是的，他 是。',
  qic:ICON.doctor, aic:ICON.yes},
 {type:'pair', q:'Is she a nurse?', qzh:'她 是 一位 護理師 嗎？', a:"No, she isn't.", azh:'不，她 不是。',
  qic:ICON.nurse, aic:ICON.no}
];

module.exports = { ICON:ICON, SUB:SUB, U1:U1, U2:U2 };

/* ── 真實情境（使用者 2026-09-20 指定，2026-09-20 再次精簡）──────────────
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
 {at:'📺 聽外國人講話', pic:'Who is ➜ ⚡ ➜ Who’s', use:'講快就黏成 Who’s。'},
 {at:'🏫 校門口', pic:'👦 ➜ 🤝 ➜ 👨', use:'介紹他是我爸爸。'},
 {at:'✏️ 寫　vs　🗣️ 說', pic:'📝 He is ➜ 🗣️ He’s', use:'寫 He is，講 He’s。'},
 {at:'🔁 中文 vs 英文', pic:'🇹🇼 他是誰？ ➜ 🇺🇸 Who’s he?', use:'「誰」跑到最前面。'},
 {at:'🛒 超市', pic:'👦 ➜ ❓ ➜ 👧', use:'不認識的女生，問她是誰。'},
 {at:'🛒 超市', pic:'👧 ➜ 🤝 ➜ 👩', use:'介紹她是我媽媽。'},
 {at:'✏️ 寫　vs　🗣️ 說', pic:'📝 She is ➜ 🗣️ She’s', use:'寫 She is，講 She’s。'},
 {at:'🔁 中文 vs 英文', pic:'🇹🇼 她是誰？ ➜ 🇺🇸 Who’s she?', use:'「誰」跑到最前面。'},
 {at:'🎤 兩個人對話', pic:'❓ he ➜ ✅ He', use:'問誰就答誰。'},
 {at:'🏫 爸爸來接你', pic:'👦 ➜ ❓ ➜ 👨', use:'問一句，答一句。'},
 {at:'🛒 媽媽在旁邊', pic:'👧 ➜ ❓ ➜ 👩', use:'問一句，答一句。'}
];

var SC2 = [
 {at:'🏥 醫院', pic:'👦 ➜ 👉 ➜ 👨‍⚕️', use:'介紹他的工作。'},
 {at:'✏️ 寫　vs　🗣️ 說', pic:'📝 He is ➜ 🗣️ He’s', use:'寫 He is，講 He’s。'},
 {at:'🍳 餐廳', pic:'🔵 he 🟡 is ➜ 🔄 ➜ 🟡 Is 🔵 he', use:'換位置就變問句。'},
 {at:'🏥 醫院', pic:'👦 ➜ ❓ ➜ 👨‍⚕️', use:'不確定就用問的。'},
 {at:'✅ 猜對了', pic:'👧 ➜ 👍 ➜ 👨‍⚕️', use:'猜對就說 Yes。'},
 {at:'❌ 猜錯了', pic:'👧 ➜ 🙅 ➜ 🧑‍🎓', use:'猜錯就說 No。'},
 {at:'🏫 學校', pic:'👧 ➜ 👉 ➜ 👩‍🏫', use:'介紹她的工作。'},
 {at:'✏️ 寫　vs　🗣️ 說', pic:'📝 She is ➜ 🗣️ She’s', use:'寫 She is，講 She’s。'},
 {at:'🏫 走廊', pic:'💗 she 🟡 is ➜ 🔄 ➜ 🟡 Is 💗 she', use:'換位置就變問句。'},
 {at:'🏫 走廊', pic:'👦 ➜ ❓ ➜ 👩‍🏫', use:'不確定就用問的。'},
 {at:'✅ 猜對了', pic:'👦 ➜ 👍 ➜ 👩‍🏫', use:'猜對就說 Yes。'},
 {at:'❌ 猜錯了', pic:'👦 ➜ 🙅 ➜ 👩‍⚕️', use:'猜錯就說 No。'},
 {at:'🎨 用顏色記', pic:'🔵🟡 ➜ 🔄 ➜ 🟡🔵', use:'前兩個字換位置。'},
 {at:'🏥 醫院', pic:'👦 ➜ ❓ ➜ 👍', use:'問一句，答一句。'},
 {at:'🏥 醫院', pic:'👧 ➜ ❓ ➜ 🙅', use:'問一句，答一句。'}
];

U1.forEach(function (c, i) { c.scene = SC1[i]; });
U2.forEach(function (c, i) { c.scene = SC2[i]; });
