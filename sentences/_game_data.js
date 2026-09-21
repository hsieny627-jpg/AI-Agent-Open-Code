/* sentences/_game_data.js — 10 個複習遊戲的題庫（唯一真相來源）
 *
 * 判準（跟字卡同一套）：每一題都要幫學生記住 Unit 1／Unit 2 的句型。
 * 只考卡片上教過的東西；嚴禁冷僻、刁鑽、湊題數。
 * 每一題都有 hint ＝ 答錯時給的鷹架（一句話講完，讓他下次答得出來）。
 */

/* ── 共用材料 ───────────────────────────────────────────── */
const FAM = [
 ['father','爸爸','he'],['mother','媽媽','she'],['brother','哥哥','he'],['sister','姊姊','she'],
 ['grandfather','爺爺','he'],['grandmother','奶奶','she'],['dad','爸比','he'],['mom','媽咪','she'],
 ['grandpa','阿公','he'],['grandma','阿嬤','she'],['uncle','叔叔','he'],['aunt','阿姨','she'],
 ['nephew','姪子','he'],['niece','姪女','she']
];
const JOB = [
 ['doctor','醫生'],['teacher','老師'],['nurse','護理師'],
 ['cook','廚師'],['farmer','農夫'],['student','學生']
];

/* ── ⚡ G1 閃電四選一（24 題）──────────────────────────── */
const G1 = [
 {q:'Who’s ＝ ?', o:['Who is','Who are','Whose','Who was'], h:'’ 就是把 is 的 i 藏起來。'},
 {q:'He’s ＝ ?', o:['He is','His','He has','He was'], h:'He’s ＝ He is。His 是「他的」。'},
 {q:'She’s ＝ ?', o:['She is','Her','She has','Hers'], h:'She’s ＝ She is。'},
 {q:'isn’t ＝ ?', o:['is not','is now','it not','in not'], h:'’ 藏起來的是 not 的 o。'},
 {q:'問「人」要用哪一個字？', o:['Who','What','How','Where'], h:'Who 問人，答案一定是一個人。'},
 {q:'問「東西」要用哪一個字？', o:['What','Who','How','When'], h:'What 問東西，Who 問人。'},
 {q:'"Who’s he?" 答句第一個字是？', o:['He','She','Him','Who'], h:'問 he 就答 He。'},
 {q:'"Who’s she?" 答句第一個字是？', o:['She','He','Her','Who'], h:'問 she 就答 She。'},
 {q:'「他是誰？」英文第一個字是？', o:['Who','He','Is','My'], h:'中文最後問「誰」，英文最前面就是 Who。'},
 {q:'"He’s my father." 是什麼意思？', o:['他是我的爸爸。','她是我的爸爸。','他是我的媽媽。','他有爸爸。'], h:'He 他、’s 是、my 我的、father 爸爸。'},
 {q:'"She’s my grandmother." 是什麼意思？', o:['她是我的奶奶。','她是我的爺爺。','他是我的奶奶。','她是我的媽媽。'], h:'grandmother 是奶奶，也可以是外婆。'},
 {q:'「爺爺」的英文是？', o:['grandfather','grandmother','father','uncle'], h:'grand ＝ 大，grandfather ＝ 爸爸的爸爸。'},
 {q:'「阿姨、姑姑、舅媽」的英文都是？', o:['aunt','uncle','niece','sister'], h:'英文一個 aunt，管中文好幾個稱呼。'},
 {q:'「叔叔、伯伯、舅舅」的英文都是？', o:['uncle','aunt','nephew','cousin'], h:'英文一個 uncle，管中文好幾個稱呼。'},
 {q:'"He is a doctor." 改成問句是？', o:['Is he a doctor?','He is a doctor?','Does he a doctor?','Is a doctor he?'], h:'he 和 is 換位置，句號換問號。'},
 {q:'"Is she a teacher?" 改成直述句是？', o:['She is a teacher.','Is she a teacher.','Her is a teacher.','She a teacher is.'], h:'Is 和 she 換回來就變直述句。'},
 {q:'直述句變問句，動的是哪兩個字？', o:['主詞和 is','is 和 a','a 和職業','完全不用動'], h:'只動最前面兩個字，後面一個都不動。'},
 {q:'"Is he a cook?" 回答「是的」要說？', o:['Yes, he is.','Yes, he’s.','Yes, she is.','Yes, he isn’t.'], h:'句尾的 is 不可以縮寫。'},
 {q:'"Is she a nurse?" 回答「不是」要說？', o:['No, she isn’t.','No, she is.','No, he isn’t.','No, she not.'], h:'問 she 就答 she；不是用 isn’t。'},
 {q:'「他是一位農夫。」英文是？', o:['He’s a farmer.','He’s farmer.','He a farmer.','Is he a farmer?'], h:'職業前面一定要有 a。'},
 {q:'"a nurse" 是什麼意思？', o:['一位護理師','一位醫生','一位廚師','一位老師'], h:'nurse 護理師，doctor 醫生。'},
 {q:'"a cook" 是什麼意思？', o:['一位廚師','一位農夫','一位學生','一位老師'], h:'cook 廚師，farmer 農夫。'},
 {q:'哪一句完全正確？', o:['He’s my dad.','His my dad.','He my dad.','He is my dad?'], h:'He’s ＝ He is；His 是「他的」。'},
 {q:'哪一句完全正確？', o:['She’s my aunt.','She my aunt.','Her’s my aunt.','She is my aunt?'], h:'She’s ＝ She is。'}
];

/* ── 🔵🩷 G2 他還是她（24 題）────────────────────────────── */
const G2 = FAM.map(f => ({txt:'my ' + f[0], zh:'我的' + f[1], a:f[2],
  h:f[1] + '是' + (f[2] === 'he' ? '男生 → He' : '女生 → She')}))
 .concat([
  {txt:'Who’s ___? ___’s my father.', zh:'他是我的爸爸。', a:'he', h:'father 是男生 → He。'},
  {txt:'Who’s ___? ___’s my mother.', zh:'她是我的媽媽。', a:'she', h:'mother 是女生 → She。'},
  {txt:'Who’s ___? ___’s my grandma.', zh:'她是我的阿嬤。', a:'she', h:'grandma 是女生 → She。'},
  {txt:'Who’s ___? ___’s my grandpa.', zh:'他是我的阿公。', a:'he', h:'grandpa 是男生 → He。'},
  {txt:'___ is a doctor. (爸爸)', zh:'爸爸是一位醫生。', a:'he', h:'爸爸是男生 → He is a doctor.'},
  {txt:'___ is a nurse. (媽媽)', zh:'媽媽是一位護理師。', a:'she', h:'媽媽是女生 → She is a nurse.'},
  {txt:'Is ___ a teacher? (姊姊)', zh:'姊姊是一位老師嗎？', a:'she', h:'姊姊是女生 → Is she a teacher?'},
  {txt:'Is ___ a farmer? (叔叔)', zh:'叔叔是一位農夫嗎？', a:'he', h:'叔叔是男生 → Is he a farmer?'},
  {txt:'Yes, ___ is. (問 my uncle)', zh:'是的，他是。', a:'he', h:'uncle 是男生 → Yes, he is.'},
  {txt:'No, ___ isn’t. (問 my niece)', zh:'不，她不是。', a:'she', h:'niece 是女生 → No, she isn’t.'}
 ]);

/* ── 🧩 G3 語序大挑戰（20 題）──────────────────────────── */
const G3 = [
 {s:['Who',"'s",'he','?'], zh:'他是誰？', h:'中文最後問「誰」，英文最前面放 Who。'},
 {s:['Who',"'s",'she','?'], zh:'她是誰？', h:'Who 一定放第一個。'},
 {s:['He',"'s",'my','father','.'], zh:'他是我的爸爸。', h:'他 → 是 → 我的 → 爸爸，順序跟中文一樣。'},
 {s:['She',"'s",'my','mother','.'], zh:'她是我的媽媽。', h:'She ’s my mother.'},
 {s:['He',"'s",'my','grandfather','.'], zh:'他是我的爺爺。', h:'my 放在人的前面。'},
 {s:['She',"'s",'my','grandmother','.'], zh:'她是我的奶奶。', h:'my 放在人的前面。'},
 {s:['He',"'s",'my','uncle','.'], zh:'他是我的叔叔。', h:'uncle 是叔叔、伯伯、舅舅。'},
 {s:['She',"'s",'my','aunt','.'], zh:'她是我的阿姨。', h:'aunt 是阿姨、姑姑、舅媽。'},
 {s:['He','is','a','doctor','.'], zh:'他是一位醫生。', h:'職業前面要有 a。'},
 {s:['She','is','a','teacher','.'], zh:'她是一位老師。', h:'職業前面要有 a。'},
 {s:['Is','he','a','doctor','?'], zh:'他是一位醫生嗎？', h:'問句把 Is 放最前面。'},
 {s:['Is','she','a','teacher','?'], zh:'她是一位老師嗎？', h:'問句把 Is 放最前面。'},
 {s:['Is','he','a','farmer','?'], zh:'他是一位農夫嗎？', h:'Is → he → a → farmer。'},
 {s:['Is','she','a','nurse','?'], zh:'她是一位護理師嗎？', h:'Is → she → a → nurse。'},
 {s:['Yes',',','he','is','.'], zh:'是的，他是。', h:'句尾的 is 不縮寫。'},
 {s:['Yes',',','she','is','.'], zh:'是的，她是。', h:'句尾的 is 不縮寫。'},
 {s:['No',',','he',"isn't",'.'], zh:'不，他不是。', h:'isn’t ＝ is not。'},
 {s:['No',',','she',"isn't",'.'], zh:'不，她不是。', h:'isn’t ＝ is not。'},
 {s:['He',"'s",'my','cousin','.'], zh:'他是我的表哥。', h:'cousin 是叔叔阿姨的小孩。'},
 {s:['She','is','a','student','.'], zh:'她是一位學生。', h:'a student 一位學生。'}
];

/* ── 🔄 G4 變身術（20 題）──────────────────────────────── */
const G4 = [
 {f:'He is a doctor.', d:'→ 問句', o:['Is he a doctor?','He is a doctor?','Is a doctor he?','Does he a doctor?'], h:'he 和 is 換位置。'},
 {f:'She is a teacher.', d:'→ 問句', o:['Is she a teacher?','She is a teacher?','Is a teacher she?','Do she a teacher?'], h:'she 和 is 換位置。'},
 {f:'He is a student.', d:'→ 問句', o:['Is he a student?','He is student?','Is he student?','He a student is?'], h:'只換前兩個字，a 不能掉。'},
 {f:'She is a nurse.', d:'→ 問句', o:['Is she a nurse?','She is nurse?','Is a she nurse?','She nurse is?'], h:'Is 放最前面。'},
 {f:'He is a cook.', d:'→ 問句', o:['Is he a cook?','He is a cook!','Is cook he?','He is cook?'], h:'Is he a cook?'},
 {f:'She is a farmer.', d:'→ 問句', o:['Is she a farmer?','She is farmer?','Is farmer she?','She a farmer?'], h:'Is she a farmer?'},
 {f:'He is my father.', d:'→ 問句', o:['Is he my father?','He is my father?','Is my father he?','Does he my father?'], h:'一樣只換前兩個字。'},
 {f:'She is my mother.', d:'→ 問句', o:['Is she my mother?','She is my mother?','Is my mother she?','Do she my mother?'], h:'一樣只換前兩個字。'},
 {f:'Is he a doctor?', d:'→ 直述句', o:['He is a doctor.','Is he a doctor.','He a doctor is.','Him is a doctor.'], h:'Is 和 he 換回來。'},
 {f:'Is she a teacher?', d:'→ 直述句', o:['She is a teacher.','Is she a teacher.','Her is a teacher.','She a teacher is.'], h:'Is 和 she 換回來。'},
 {f:'Is he a farmer?', d:'→ 直述句', o:['He is a farmer.','He a farmer.','Is he a farmer.','He is farmer.'], h:'問號換句號。'},
 {f:'Is she a nurse?', d:'→ 直述句', o:['She is a nurse.','She a nurse.','Is she a nurse.','She is nurse.'], h:'問號換句號。'},
 {f:'Is he a student?', d:'→ 直述句', o:['He is a student.','He is student.','Is he student.','He student is.'], h:'a 不能掉。'},
 {f:'Is she a cook?', d:'→ 直述句', o:['She is a cook.','She is cook.','Is she cook.','She a cook is.'], h:'a 不能掉。'},
 {f:'Is he my uncle?', d:'→ 直述句', o:['He is my uncle.','Is he my uncle.','Him is my uncle.','He my uncle is.'], h:'Is 和 he 換回來。'},
 {f:'Is she my aunt?', d:'→ 直述句', o:['She is my aunt.','Is she my aunt.','Her is my aunt.','She my aunt is.'], h:'Is 和 she 換回來。'},
 {f:'He’s a doctor.', d:'→ 問句', o:['Is he a doctor?','Is he’s a doctor?','He’s a doctor?','Is a doctor he?'], h:'先把 He’s 拆回 He is，再換位置。'},
 {f:'She’s a teacher.', d:'→ 問句', o:['Is she a teacher?','Is she’s a teacher?','She’s a teacher?','Is a teacher she?'], h:'先把 She’s 拆回 She is。'},
 {f:'Is he a doctor?', d:'→ 回答「是的」', o:['Yes, he is.','Yes, he’s.','Yes, she is.','Yes, he isn’t.'], h:'句尾的 is 不縮寫。'},
 {f:'Is she a doctor?', d:'→ 回答「不是」', o:['No, she isn’t.','No, she is.','No, he isn’t.','No, she not.'], h:'isn’t ＝ is not。'}
];

/* ── 🎧 G5 聽力狙擊（20 題）────────────────────────────── */
const G5 = [
 {s:"Who's he?", o:["Who's he?","Who's she?","He's here.","Whose hat?"], h:'最後一個字是 he 還是 she。'},
 {s:"Who's she?", o:["Who's she?","Who's he?","She's here.","Whose shoe?"], h:'she 前面多一個「ㄕ」的氣音。'},
 {s:"He's my father.", o:["He's my father.","She's my father.","He's my brother.","He's my grandfather."], h:'開頭 He，結尾 father。'},
 {s:"She's my mother.", o:["She's my mother.","He's my mother.","She's my grandmother.","She's my sister."], h:'開頭 She，結尾 mother。'},
 {s:"He's my brother.", o:["He's my brother.","He's my father.","She's my sister.","He's my grandfather."], h:'brother 哥哥、弟弟都用這個字。'},
 {s:"She's my sister.", o:["She's my sister.","She's my mother.","He's my brother.","She's my grandma."], h:'sister 姊姊、妹妹都用這個字。'},
 {s:"He's my grandfather.", o:["He's my grandfather.","He's my father.","She's my grandmother.","He's my grandpa."], h:'grand ＝ 大，爸爸的爸爸。'},
 {s:"She's my grandmother.", o:["She's my grandmother.","She's my mother.","He's my grandfather.","She's my grandma."], h:'grandmother 奶奶，也可以是外婆。'},
 {s:"He's my uncle.", o:["He's my uncle.","She's my aunt.","He's my nephew.","He's my cousin."], h:'uncle 叔叔、伯伯、舅舅。'},
 {s:"She's my aunt.", o:["She's my aunt.","He's my uncle.","She's my niece.","She's my cousin."], h:'aunt 阿姨、姑姑、舅媽。'},
 {s:"He is a doctor.", o:['He is a doctor.','Is he a doctor?','She is a doctor.','He is a teacher.'], h:'第一個字是 He → 直述句。'},
 {s:"Is he a doctor?", o:['Is he a doctor?','He is a doctor.','Is she a doctor?','Is he a teacher?'], h:'第一個字是 Is → 問句。'},
 {s:"She is a teacher.", o:['She is a teacher.','Is she a teacher?','He is a teacher.','She is a student.'], h:'第一個字是 She → 直述句。'},
 {s:"Is she a teacher?", o:['Is she a teacher?','She is a teacher.','Is he a teacher?','Is she a student?'], h:'第一個字是 Is → 問句。'},
 {s:"Is he a farmer?", o:['Is he a farmer?','He is a farmer.','Is she a farmer?','Is he a father?'], h:'farmer 農夫，father 爸爸，尾巴不一樣。'},
 {s:"Is she a nurse?", o:['Is she a nurse?','She is a nurse.','Is he a nurse?','Is she a doctor?'], h:'nurse 護理師。'},
 {s:"Yes, he is.", o:['Yes, he is.','Yes, she is.','No, he isn’t.','Yes, he isn’t.'], h:'Yes 後面接 he is。'},
 {s:"No, she isn't.", o:['No, she isn’t.','No, he isn’t.','Yes, she is.','No, she is.'], h:'isn’t 的 n’t 很短，要聽尾巴。'},
 {s:"He's a student.", o:["He's a student.","He's a teacher.","She's a student.","Is he a student?"], h:'student 學生。'},
 {s:"She's a cook.", o:["She's a cook.","He's a cook.","She's a doctor.","Is she a cook?"], h:'cook 廚師。'}
];

/* ── 🃏 G6 記憶配對（20 對）────────────────────────────── */
const G6 = [
 ["Who's he?",'他是誰？'], ["Who's she?",'她是誰？'],
 ["He's my father.",'他是我的爸爸。'], ["She's my mother.",'她是我的媽媽。'],
 ['grandfather','爺爺'], ['grandmother','奶奶'],
 ['brother','哥哥'], ['sister','姊姊'],
 ['uncle','叔叔'], ['aunt','阿姨'],
 ['nephew','姪子'], ['niece','姪女'],
 ['doctor','醫生'], ['teacher','老師'],
 ['nurse','護理師'], ['cook','廚師'],
 ['farmer','農夫'], ['student','學生'],
 ['Is he a doctor?','他是一位醫生嗎？'], ["No, she isn't.",'不，她不是。']
];

/* ── 🔍 G7 火眼金睛（20 題）────────────────────────────── */
const G7 = [
 {w:['Who',"'s",'he','?'], b:-1, zh:'他是誰？', h:'這一句完全正確，別被騙了。'},
 {w:['Who',"'s",'him','?'], b:2, fix:'he', zh:'他是誰？', h:'句子裡當主詞要用 he，不是 him。'},
 {w:['His','my','father','.'], b:0, fix:"He's", zh:'他是我的爸爸。', h:'His 是「他的」，He’s 才是「他是」。'},
 {w:['He',"'s",'my','mother','.'], b:3, fix:'father', zh:'他是我的爸爸。', h:'He 是男生，後面不會接 mother。'},
 {w:['She',"'s",'my','grandfather','.'], b:3, fix:'grandmother', zh:'她是我的奶奶。', h:'She 是女生，要配 grandmother。'},
 {w:['Her',"'s",'my','aunt','.'], b:0, fix:"She's", zh:'她是我的阿姨。', h:'Her 不能放句子開頭當主詞。'},
 {w:['He','is','doctor','.'], b:2, fix:'a doctor', zh:'他是一位醫生。', h:'職業前面一定要有 a。'},
 {w:['She','is','a','teacher','.'], b:-1, zh:'她是一位老師。', h:'這一句完全正確。'},
 {w:['Is','he','doctor','?'], b:2, fix:'a doctor', zh:'他是一位醫生嗎？', h:'問句裡的 a 也不能掉。'},
 {w:['He','is','a','doctor','?'], b:4, fix:'改成 Is he a doctor?', zh:'他是一位醫生嗎？', h:'只加問號不算問句，要把 he 和 is 換位置。'},
 {w:['Is','him','a','farmer','?'], b:1, fix:'he', zh:'他是一位農夫嗎？', h:'Is 後面接 he。'},
 {w:['Is','her','a','nurse','?'], b:1, fix:'she', zh:'她是一位護理師嗎？', h:'Is 後面接 she。'},
 {w:['Yes',',','he',"'s",'.'], b:3, fix:'is', zh:'是的，他是。', h:'句尾的 is 不可以縮寫。'},
 {w:['Yes',',','she','is','.'], b:-1, zh:'是的，她是。', h:'這一句完全正確。'},
 {w:['No',',','he','not','.'], b:3, fix:"isn't", zh:'不，他不是。', h:'不是要用 isn’t ＝ is not。'},
 {w:['No',',','she',"isn't",'.'], b:-1, zh:'不，她不是。', h:'這一句完全正確。'},
 {w:['What',"'s",'he','?'], b:0, fix:'Who', zh:'他是誰？', h:'問「人」要用 Who，不是 What。'},
 {w:['Who','is','he','?'], b:-1, zh:'他是誰？', h:'Who is ＝ Who’s，兩種寫法都對。'},
 {w:['She','is','a','doctors','.'], b:3, fix:'doctor', zh:'她是一位醫生。', h:'a 後面只能接一個人，不加 s。'},
 {w:['He','are','a','cook','.'], b:1, fix:'is', zh:'他是一位廚師。', h:'He 後面用 is，不用 are。'}
];

/* ── ✏️ G8 填空高手（20 題）────────────────────────────── */
const G8 = [
 {b:'___', a:"'s he?", zh:'他是誰？', o:['Who','What','How','Where'], h:'問人用 Who。'},
 {b:'Who', a:'he?', zh:'他是誰？', o:["'s",'are','am','do'], h:'Who’s ＝ Who is。'},
 {b:'He', a:'my father.', zh:'他是我的爸爸。', o:["'s",'are','am','have'], h:'He’s ＝ He is。'},
 {b:'She', a:'my mother.', zh:'她是我的媽媽。', o:["'s",'are','am','have'], h:'She’s ＝ She is。'},
 {b:"He's my", a:'.', zh:'他是我的爺爺。', o:['grandfather','grandmother','aunt','niece'], h:'He 是男生 → grandfather。'},
 {b:"She's my", a:'.', zh:'她是我的奶奶。', o:['grandmother','grandfather','uncle','nephew'], h:'She 是女生 → grandmother。'},
 {b:'He is', a:'doctor.', zh:'他是一位醫生。', o:['a','the','an','is'], h:'職業前面用 a。'},
 {b:'She is a', a:'.', zh:'她是一位護理師。', o:['nurse','doctor','cook','farmer'], h:'nurse 護理師。'},
 {b:'___', a:'he a doctor?', zh:'他是一位醫生嗎？', o:['Is','He','Are','Does'], h:'問句把 Is 放最前面。'},
 {b:'Is', a:'a teacher?', zh:'她是一位老師嗎？', o:['she','her','he','hers'], h:'Is 後面接 she。'},
 {b:'Is he a', a:'?', zh:'他是一位農夫嗎？', o:['farmer','father','nurse','teacher'], h:'farmer 農夫。'},
 {b:'Yes, he', a:'.', zh:'是的，他是。', o:['is',"'s",'are','be'], h:'句尾的 is 不縮寫。'},
 {b:'No, she', a:'.', zh:'不，她不是。', o:["isn't",'is','not','aren’t'], h:'isn’t ＝ is not。'},
 {b:'Yes,', a:'is.', zh:'是的，她是。', o:['she','her','he','hers'], h:'問 she 就答 she。'},
 {b:'No,', a:"isn't.", zh:'不，他不是。', o:['he','him','she','his'], h:'問 he 就答 he。'},
 {b:'He is a', a:'.', zh:'他是一位學生。', o:['student','teacher','doctor','cook'], h:'student 學生。'},
 {b:'She', a:'a cook.', zh:'她是一位廚師。', o:['is','are','am','be'], h:'She 後面用 is。'},
 {b:'___', a:"'s she?", zh:'她是誰？', o:['Who','What','How','When'], h:'問人用 Who。'},
 {b:"She's my", a:'.', zh:'她是我的阿姨。', o:['aunt','uncle','nephew','grandpa'], h:'aunt 阿姨、姑姑、舅媽。'},
 {b:"He's my", a:'.', zh:'他是我的叔叔。', o:['uncle','aunt','niece','grandma'], h:'uncle 叔叔、伯伯、舅舅。'}
];

/* ── 🗂 G9 分類大師（24 題）問句 ❓ ／ 直述句 🙋 ──────────── */
const G9 = [
 ["Who's he?",'q'], ["Who's she?",'q'], ["He's my father.",'s'], ["She's my mother.",'s'],
 ['Is he a doctor?','q'], ['He is a doctor.','s'], ['Is she a teacher?','q'], ['She is a teacher.','s'],
 ['Yes, he is.','s'], ['No, she isn’t.','s'], ['Is he your uncle?','q'], ['He is my uncle.','s'],
 ['Who is she?','q'], ['She is my aunt.','s'], ['Is she a nurse?','q'], ['She’s a nurse.','s'],
 ['Is he a farmer?','q'], ['He’s a farmer.','s'], ['Who’s your father?','q'], ['My father is a cook.','s'],
 ['Is she a student?','q'], ['She’s a student.','s'], ['Is he my brother?','q'], ['He’s my brother.','s']
];

/* ── 👑 G10 魔王挑戰（24 題，混合題型）──────────────────── */
const G10 = [
 {q:'魔王問：Who’s ＝ ?', o:['Who is','Whose','Who are','Who has'], h:'’ 藏起來的是 is 的 i。'},
 {q:'魔王問：「他是誰？」英文第一個字？', o:['Who','He','Is','My'], h:'中文最後問誰，英文最前面 Who。'},
 {q:'魔王問："Who’s she?" 答句開頭？', o:['She','He','Her','Who'], h:'問 she 就答 She。'},
 {q:'魔王問：He’s ＝ ?', o:['He is','His','He has','Him is'], h:'He’s ＝ He is。'},
 {q:'魔王問："He is a cook." 的問句？', o:['Is he a cook?','He is a cook?','Is a cook he?','Do he a cook?'], h:'he 和 is 換位置。'},
 {q:'魔王問："Is she a nurse?" 的直述句？', o:['She is a nurse.','Is she a nurse.','Her is a nurse.','She a nurse is.'], h:'Is 和 she 換回來。'},
 {q:'魔王問："Is he a teacher?" 答「是的」？', o:['Yes, he is.','Yes, he’s.','Yes, she is.','Yes, he isn’t.'], h:'句尾的 is 不縮寫。'},
 {q:'魔王問："Is she a doctor?" 答「不是」？', o:['No, she isn’t.','No, she is.','No, he isn’t.','No, she not.'], h:'isn’t ＝ is not。'},
 {q:'魔王問：「奶奶」的英文？', o:['grandmother','grandfather','aunt','mother'], h:'grandmother 奶奶，也可以是外婆。'},
 {q:'魔王問：「姪女」的英文？', o:['niece','nephew','aunt','cousin'], h:'niece 姪女，外甥女也是。'},
 {q:'魔王問：「姪子」的英文？', o:['nephew','niece','uncle','cousin'], h:'nephew 姪子，外甥也是。'},
 {q:'魔王問：aunt 是誰？', o:['阿姨、姑姑、舅媽','奶奶','姊姊','姪女'], h:'英文一個字管中文好幾個稱呼。'},
 {q:'魔王問：哪一句是對的？', o:['He’s my dad.','His my dad.','He my dad.','Him is my dad.'], h:'He’s ＝ He is。'},
 {q:'魔王問：哪一句是對的？', o:['She is a doctor.','She is doctor.','She are a doctor.','She a doctor.'], h:'is ＋ a 兩個都不能少。'},
 {q:'魔王問：問「東西」用哪個字？', o:['What','Who','How','Where'], h:'What 問東西，Who 問人。'},
 {q:'魔王問：isn’t ＝ ?', o:['is not','it not','in not','is now'], h:'’ 藏起來的是 not 的 o。'},
 {q:'魔王問：直述句變問句要動幾個字？', o:['兩個（主詞和 is）','一個','三個','全部'], h:'只動最前面兩個字。'},
 {q:'魔王問："She’s a farmer." 的問句？', o:['Is she a farmer?','She’s a farmer?','Is she’s a farmer?','Is a farmer she?'], h:'先把 She’s 拆回 She is。'},
 {q:'魔王問：a student 是什麼？', o:['一位學生','一位老師','一位醫生','一位廚師'], h:'student 學生。'},
 {q:'魔王問：「他是一位農夫。」', o:['He’s a farmer.','He’s farmer.','He a farmer.','Is he a farmer?'], h:'職業前面要有 a。'},
 {q:'魔王問："Who’s he?" 不可以怎麼回答？', o:['It’s a book.','He’s my dad.','He’s my uncle.','He’s my brother.'], h:'Who 問人，答案一定是一個人。'},
 {q:'魔王問：Who’s 和 Whose 唸起來？', o:['一模一樣，但意思不同','完全不同','Whose 不存在','兩個都是「誰是」'], h:'聽起來一樣，Who’s ＝ Who is，Whose ＝ 誰的。'},
 {q:'魔王問："He is my grandfather." 的問句？', o:['Is he my grandfather?','He is my grandfather?','Is my grandfather he?','Does he my grandfather?'], h:'一樣只換前兩個字。'},
 {q:'魔王問：cook 是什麼？', o:['廚師','農夫','護理師','學生'], h:'cook 廚師，farmer 農夫。'}
];


/* ── 🎁 正向驚喜回饋（使用者 2026-09-21 指定）────────────────────────
 * 十個遊戲各有 20 種，而且十個遊戲的驚喜「完全不一樣」——
 * 學生摸不透、猜不著，才會一直想玩下一題。
 * 每一場都重新洗牌、抽過不重複，同一個遊戲玩兩次也不一樣。
 *
 * k ＝ 效果種類（_build_games.js 的 fire() 負責執行）
 *   pts    直接加 v 分
 *   x2／x3 接下來 v 題，分數 ✕2／✕3
 *   time   這一題的倒數 ＋v 秒
 *   fast   這一題 5 秒內答對，再加 v 分
 *   streak 連對直接 ＋v
 *   shield 護盾：下一題答錯，連對不會歸零
 */
function S(t,d,k,v){return {t:t,d:d,k:k,v:v}}

const SURP = {
 /* ⚡ 閃電四選一：電力主題 */
 g1:[
  S('⚡ 電力全開','接下來 3 題，分數 ✕ 2','x2',3),
  S('🔋 充飽電','直接加 300 分','pts',300),
  S('🌩 雷擊暴衝','下一題分數 ✕ 3','x3',1),
  S('💡 燈泡亮了','這一題 ＋8 秒','time',8),
  S('🏎 加速引擎','5 秒內答對，再加 400 分','fast',400),
  S('🛡 絕緣護盾','下一題答錯，連對不歸零','shield',1),
  S('🔥 連擊火焰','連對直接 ＋3','streak',3),
  S('🎆 煙火綻放','直接加 500 分','pts',500),
  S('🚀 火箭點火','接下來 2 題，分數 ✕ 2','x2',2),
  S('🌟 超新星','直接加 800 分','pts',800),
  S('🧲 磁力吸分','直接加 250 分','pts',250),
  S('⏰ 時間回流','這一題 ＋10 秒','time',10),
  S('💎 鑽石電池','下一題分數 ✕ 3','x3',1),
  S('🎯 精準射擊','5 秒內答對，再加 300 分','fast',300),
  S('🌈 彩虹電流','接下來 4 題，分數 ✕ 2','x2',4),
  S('🦾 鋼鐵手速','連對直接 ＋2','streak',2),
  S('🍀 幸運電波','直接加 400 分','pts',400),
  S('🛰 衛星連線','這一題 ＋6 秒','time',6),
  S('👑 電力之王','直接加 1000 分','pts',1000),
  S('🎁 神秘電箱','直接加 150 分','pts',150)
 ],
 /* 🔵🩷 他還是她：雙胞胎主題 */
 g2:[
  S('👦 男生應援團','接下來 3 題，分數 ✕ 2','x2',3),
  S('👧 女生應援團','直接加 300 分','pts',300),
  S('👬 雙胞胎出現','下一題分數 ✕ 3','x3',1),
  S('🎀 粉紅風暴','直接加 450 分','pts',450),
  S('💙 藍色風暴','直接加 450 分','pts',450),
  S('🤝 好朋友加持','連對直接 ＋3','streak',3),
  S('🧢 男生帽子','這一題 ＋8 秒','time',8),
  S('👒 女生帽子','這一題 ＋8 秒','time',8),
  S('🛡 友情護盾','下一題答錯，連對不歸零','shield',1),
  S('🎈 慶生氣球','直接加 200 分','pts',200),
  S('🏃 賽跑第一','5 秒內答對，再加 350 分','fast',350),
  S('🎪 大遊行','接下來 4 題，分數 ✕ 2','x2',4),
  S('🍭 棒棒糖','直接加 150 分','pts',150),
  S('🎂 生日蛋糕','直接加 600 分','pts',600),
  S('📸 全班合照','連對直接 ＋2','streak',2),
  S('🌼 花圈加冕','下一題分數 ✕ 3','x3',1),
  S('🎵 班歌響起','這一題 ＋6 秒','time',6),
  S('🏅 模範生','直接加 700 分','pts',700),
  S('🐣 小雞跟屁蟲','5 秒內答對，再加 250 分','fast',250),
  S('👑 班長加冕','直接加 900 分','pts',900)
 ],
 /* 🧩 語序大挑戰：拼圖主題 */
 g3:[
  S('🧩 拼圖合體','接下來 3 題，分數 ✕ 2','x2',3),
  S('🪄 一秒拼好','直接加 350 分','pts',350),
  S('🏗 積木高塔','下一題分數 ✕ 3','x3',1),
  S('🔧 萬能工具','這一題 ＋8 秒','time',8),
  S('📐 完美對齊','5 秒內答對，再加 300 分','fast',300),
  S('🛡 拼圖護盾','下一題答錯，連對不歸零','shield',1),
  S('🧱 蓋好城牆','連對直接 ＋3','streak',3),
  S('🎨 上色完成','直接加 400 分','pts',400),
  S('🚧 工程加速','接下來 2 題，分數 ✕ 2','x2',2),
  S('🏰 蓋出城堡','直接加 800 分','pts',800),
  S('🔩 螺絲鎖緊','直接加 200 分','pts',200),
  S('⌛ 沙漏翻面','這一題 ＋10 秒','time',10),
  S('💠 稀有拼片','下一題分數 ✕ 3','x3',1),
  S('🖇 完美接合','5 秒內答對，再加 400 分','fast',400),
  S('🌉 蓋好大橋','接下來 4 題，分數 ✕ 2','x2',4),
  S('🦺 工頭表揚','連對直接 ＋2','streak',2),
  S('🎁 工具寶箱','直接加 250 分','pts',250),
  S('🪜 再上一層','這一題 ＋6 秒','time',6),
  S('👑 總工程師','直接加 1000 分','pts',1000),
  S('📦 補給到貨','直接加 150 分','pts',150)
 ],
 /* 🔄 變身術：魔法主題 */
 g4:[
  S('🪄 魔法加倍','接下來 3 題，分數 ✕ 2','x2',3),
  S('🔮 水晶球','直接加 350 分','pts',350),
  S('🐉 召喚巨龍','下一題分數 ✕ 3','x3',1),
  S('🧪 時間藥水','這一題 ＋8 秒','time',8),
  S('✨ 瞬間移動','5 秒內答對，再加 400 分','fast',400),
  S('🛡 魔法護盾','下一題答錯，連對不歸零','shield',1),
  S('🔥 火焰咒語','連對直接 ＋3','streak',3),
  S('🌙 月光祝福','直接加 500 分','pts',500),
  S('🧙 大法師加持','接下來 2 題，分數 ✕ 2','x2',2),
  S('💫 流星許願','直接加 900 分','pts',900),
  S('🍄 魔法蘑菇','直接加 200 分','pts',200),
  S('⏳ 時光倒流','這一題 ＋10 秒','time',10),
  S('👻 隱形斗篷','下一題分數 ✕ 3','x3',1),
  S('🦄 獨角獸現身','5 秒內答對，再加 350 分','fast',350),
  S('🌀 傳送門','接下來 4 題，分數 ✕ 2','x2',4),
  S('🐸 變身青蛙','連對直接 ＋2','streak',2),
  S('🎩 帽子變兔子','直接加 300 分','pts',300),
  S('🕯 蠟燭祈福','這一題 ＋6 秒','time',6),
  S('👑 魔法之王','直接加 1000 分','pts',1000),
  S('🎁 魔法禮盒','直接加 150 分','pts',150)
 ],
 /* 🎧 聽力狙擊：狙擊主題 */
 g5:[
  S('🎯 連續命中','接下來 3 題，分數 ✕ 2','x2',3),
  S('🔭 鷹眼瞄準','直接加 350 分','pts',350),
  S('💥 一槍雙殺','下一題分數 ✕ 3','x3',1),
  S('🎧 超級耳機','這一題 ＋8 秒','time',8),
  S('🏹 神射手','5 秒內答對，再加 400 分','fast',400),
  S('🛡 防彈護盾','下一題答錯，連對不歸零','shield',1),
  S('🔊 擴音器','連對直接 ＋3','streak',3),
  S('🥇 狙擊冠軍','直接加 600 分','pts',600),
  S('🚁 空中支援','接下來 2 題，分數 ✕ 2','x2',2),
  S('🌟 傳說神槍','直接加 900 分','pts',900),
  S('🔋 備用彈匣','直接加 200 分','pts',200),
  S('⌚ 子彈時間','這一題 ＋10 秒','time',10),
  S('🎆 爆頭特效','下一題分數 ✕ 3','x3',1),
  S('👂 順風耳','5 秒內答對，再加 300 分','fast',300),
  S('🛸 高科技裝備','接下來 4 題，分數 ✕ 2','x2',4),
  S('🐺 狼耳朵','連對直接 ＋2','streak',2),
  S('📡 雷達鎖定','直接加 400 分','pts',400),
  S('🧊 冷靜下來','這一題 ＋6 秒','time',6),
  S('👑 狙擊之王','直接加 1000 分','pts',1000),
  S('🎁 補給空投','直接加 150 分','pts',150)
 ],
 /* 🃏 記憶配對：撲克牌主題 */
 g6:[
  S('🃏 鬼牌出現','接下來 3 題，分數 ✕ 2','x2',3),
  S('♠ 黑桃 A','直接加 350 分','pts',350),
  S('♥ 紅心同花','下一題分數 ✕ 3','x3',1),
  S('🧠 過目不忘','這一題 ＋10 秒','time',10),
  S('⚡ 閃電記憶','5 秒內配對成功，再加 400 分','fast',400),
  S('🛡 記憶護盾','下一題答錯，連對不歸零','shield',1),
  S('🔥 手氣正旺','連對直接 ＋3','streak',3),
  S('💰 通殺全場','直接加 600 分','pts',600),
  S('🎩 魔術師手法','接下來 2 題，分數 ✕ 2','x2',2),
  S('👑 同花大順','直接加 1000 分','pts',1000),
  S('♣ 梅花小禮','直接加 200 分','pts',200),
  S('⏳ 多看一眼','這一題 ＋8 秒','time',8),
  S('♦ 方塊閃光','下一題分數 ✕ 3','x3',1),
  S('🎲 骰到六點','5 秒內配對成功，再加 300 分','fast',300),
  S('🎰 拉霸中獎','接下來 4 題，分數 ✕ 2','x2',4),
  S('🐘 大象記憶','連對直接 ＋2','streak',2),
  S('🍀 幸運四葉草','直接加 400 分','pts',400),
  S('🔍 偷看一秒','這一題 ＋6 秒','time',6),
  S('💎 鑽石王牌','直接加 800 分','pts',800),
  S('🎁 神秘牌堆','直接加 150 分','pts',150)
 ],
 /* 🔍 火眼金睛：偵探主題 */
 g7:[
  S('🔍 名偵探出動','接下來 3 題，分數 ✕ 2','x2',3),
  S('🕵 找到線索','直接加 350 分','pts',350),
  S('🚨 破案警報','下一題分數 ✕ 3','x3',1),
  S('🔦 手電筒','這一題 ＋8 秒','time',8),
  S('👁 鷹眼掃描','5 秒內答對，再加 400 分','fast',400),
  S('🛡 真相護盾','下一題答錯，連對不歸零','shield',1),
  S('🧩 拼出真相','連對直接 ＋3','streak',3),
  S('🏆 破案獎金','直接加 600 分','pts',600),
  S('🐕 警犬幫忙','接下來 2 題，分數 ✕ 2','x2',2),
  S('👑 神探之王','直接加 1000 分','pts',1000),
  S('📎 小小證物','直接加 200 分','pts',200),
  S('⌛ 現場保留','這一題 ＋10 秒','time',10),
  S('💡 靈光一閃','下一題分數 ✕ 3','x3',1),
  S('🧤 指紋鑑定','5 秒內答對，再加 300 分','fast',300),
  S('📰 頭條新聞','接下來 4 題，分數 ✕ 2','x2',4),
  S('🦉 貓頭鷹視力','連對直接 ＋2','streak',2),
  S('🗝 找到鑰匙','直接加 400 分','pts',400),
  S('☕ 喝杯咖啡','這一題 ＋6 秒','time',6),
  S('🎖 警長表揚','直接加 800 分','pts',800),
  S('🎁 證物箱','直接加 150 分','pts',150)
 ],
 /* ✏️ 填空高手：文具主題 */
 g8:[
  S('✏️ 鉛筆全開','接下來 3 題，分數 ✕ 2','x2',3),
  S('🖍 彩色筆','直接加 350 分','pts',350),
  S('🖊 鋼筆簽名','下一題分數 ✕ 3','x3',1),
  S('🧽 橡皮擦救援','這一題 ＋8 秒','time',8),
  S('📏 一尺量準','5 秒內答對，再加 400 分','fast',400),
  S('🛡 筆袋護盾','下一題答錯，連對不歸零','shield',1),
  S('📚 課本加持','連對直接 ＋3','streak',3),
  S('💯 滿分貼紙','直接加 600 分','pts',600),
  S('🎒 書包補給','接下來 2 題，分數 ✕ 2','x2',2),
  S('👑 作業之王','直接加 1000 分','pts',1000),
  S('📎 迴紋針','直接加 200 分','pts',200),
  S('⏳ 多想一下','這一題 ＋10 秒','time',10),
  S('🌟 老師蓋章','下一題分數 ✕ 3','x3',1),
  S('🖌 一筆畫完','5 秒內答對，再加 300 分','fast',300),
  S('🗒 筆記整齊','接下來 4 題，分數 ✕ 2','x2',4),
  S('✒️ 字跡工整','連對直接 ＋2','streak',2),
  S('🎨 得獎作品','直接加 400 分','pts',400),
  S('🧃 喝口果汁','這一題 ＋6 秒','time',6),
  S('🏅 模範作業','直接加 800 分','pts',800),
  S('🎁 文具福袋','直接加 150 分','pts',150)
 ],
 /* 🗂 分類大師：整理主題 */
 g9:[
  S('🗂 分類神手','接下來 3 題，分數 ✕ 2','x2',3),
  S('📁 資料夾滿了','直接加 350 分','pts',350),
  S('🏷 貼上標籤','下一題分數 ✕ 3','x3',1),
  S('🧹 大掃除','這一題 ＋8 秒','time',8),
  S('⚡ 秒速整理','5 秒內答對，再加 400 分','fast',400),
  S('🛡 收納護盾','下一題答錯，連對不歸零','shield',1),
  S('📦 全部歸位','連對直接 ＋3','streak',3),
  S('✨ 房間變乾淨','直接加 600 分','pts',600),
  S('🧺 洗衣籃清空','接下來 2 題，分數 ✕ 2','x2',2),
  S('👑 收納之王','直接加 1000 分','pts',1000),
  S('📌 圖釘固定','直接加 200 分','pts',200),
  S('⌛ 慢慢整理','這一題 ＋10 秒','time',10),
  S('🗄 抽屜整齊','下一題分數 ✕ 3','x3',1),
  S('🧯 火速處理','5 秒內答對，再加 300 分','fast',300),
  S('🏠 全家誇獎','接下來 4 題，分數 ✕ 2','x2',4),
  S('🐈 貓咪來幫忙','連對直接 ＋2','streak',2),
  S('🧼 擦得發亮','直接加 400 分','pts',400),
  S('🍪 點心時間','這一題 ＋6 秒','time',6),
  S('🏆 整潔比賽第一','直接加 800 分','pts',800),
  S('🎁 收納箱','直接加 150 分','pts',150)
 ],
 /* 👑 魔王挑戰：勇者主題 */
 g10:[
  S('⚔️ 勇者之劍','接下來 3 題，分數 ✕ 2','x2',3),
  S('🛡 傳說盾牌','下一題答錯，連對不歸零','shield',1),
  S('🐲 召喚神龍','下一題分數 ✕ 3','x3',1),
  S('🧪 紅藥水','這一題 ＋8 秒','time',8),
  S('💨 迅捷之靴','5 秒內答對，再加 400 分','fast',400),
  S('🔥 必殺技','連對直接 ＋3','streak',3),
  S('💰 魔王掉寶','直接加 600 分','pts',600),
  S('🏹 精靈弓箭手','接下來 2 題，分數 ✕ 2','x2',2),
  S('👑 王者降臨','直接加 1000 分','pts',1000),
  S('🪙 金幣一袋','直接加 200 分','pts',200),
  S('⏳ 時之沙漏','這一題 ＋10 秒','time',10),
  S('🌟 覺醒時刻','下一題分數 ✕ 3','x3',1),
  S('🗡 暴擊一擊','5 秒內答對，再加 350 分','fast',350),
  S('🦁 獅心勇氣','接下來 4 題，分數 ✕ 2','x2',4),
  S('🧝 精靈祝福','連對直接 ＋2','streak',2),
  S('💎 傳說寶石','直接加 500 分','pts',500),
  S('🍖 補血烤肉','這一題 ＋6 秒','time',6),
  S('🏰 攻下城堡','直接加 800 分','pts',800),
  S('🎁 魔王寶箱','直接加 300 分','pts',300),
  S('🧿 破魔護符','下一題答錯，連對不歸零','shield',1)
 ]
};

const GAMES = [
 {id:'g1',  ic:'⚡', name:'閃電四選一', rule:'看題目選答案，答得快分數高。隨機出現「雙倍時刻」。', n:G1.length},
 {id:'g2',  ic:'🔵', name:'他還是她',   rule:'看到就按：左邊 He（藍）、右邊 She（粉）。', n:G2.length},
 {id:'g3',  ic:'🧩', name:'語序大挑戰', rule:'照順序點英文字，把整句排出來。', n:G3.length},
 {id:'g4',  ic:'🔄', name:'變身術',     rule:'直述句 ⇄ 問句，選出變身後正確的句子。', n:G4.length},
 {id:'g5',  ic:'🎧', name:'聽力狙擊',   rule:'聽一句英文，射下正確的那一張卡。', n:G5.length},
 {id:'g6',  ic:'🃏', name:'記憶配對',   rule:'翻開兩張，英文配中文，配對成功就消失。', n:G6.length},
 {id:'g7',  ic:'🔍', name:'火眼金睛',   rule:'句子裡有一個字是錯的，點出來。全對的句子按「✅ 這句沒錯」。', n:G7.length},
 {id:'g8',  ic:'✏️', name:'填空高手',   rule:'句子少了一個字，選出正確的那一個。', n:G8.length},
 {id:'g9',  ic:'🗂', name:'分類大師',   rule:'問句丟右邊 ❓，直述句丟左邊 🙋。', n:G9.length},
 {id:'g10', ic:'👑', name:'魔王挑戰',   rule:'打倒魔王！答對扣血，答錯魔王放技能。', n:G10.length}
];

module.exports = { FAM, JOB, G1, G2, G3, G4, G5, G6, G7, G8, G9, G10, GAMES, SURP };
