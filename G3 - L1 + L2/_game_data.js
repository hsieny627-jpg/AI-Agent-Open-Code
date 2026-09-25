/* G3 - L1 + L2/_game_data.js — 10 個複習遊戲的題庫 ＋ 每個遊戲 30 張驚喜卡（唯一真相來源）
 *
 * 判準（使用者 2026-09-24 指定）：每一題都要幫學生記住 What’s your name?／How old are you?。
 * 題目有鑑別度、不刁鑽；錯的選項有誘答力；題目和選項每一場都重洗（引擎負責）。
 * 每一題都有 h ＝ 答錯時的鷹架（一句話講完）。o[0] 一定是正確答案。
 */

/* 名字不翻譯（使用者 2026-09-25 指定）：中文句子裡一樣寫英文名字 */
const NAMES = [['Ken','Ken'],['Alan','Alan'],['Wendy','Wendy'],['Mike','Mike'],['Emma','Emma']];
const AGES = [['six','六'],['seven','七'],['eight','八'],['nine','九'],['ten','十'],['eleven','十一'],['twelve','十二']];

/* ── ⚡ G1 閃電四選一（24 題）── */
const G1 = [
 {q:'What’s ＝ ?', o:['What is','What are','What am','What your'], h:'’ 藏起來的是 is 的 i。'},
 {q:'I’m ＝ ?', o:['I am','I is','I are','My am'], h:'’ 藏起來的是 am 的 a。'},
 {q:'You’re ＝ ?', o:['You are','Your','You is','You am'], h:'You’re ＝ You are；Your 是「你的」。'},
 {q:'What 的中文是？', o:['什麼','幾歲','怎麼樣','誰'], h:'What ＝ 什麼。'},
 {q:'How old 在問什麼？', o:['幾歲','名字','什麼','怎麼樣'], h:'How old ＝ 問年紀。'},
 {q:'How 的中文是？', o:['怎麼樣','幾歲','什麼','名字'], h:'How 問程度（怎麼樣）；加上 old 才是問幾歲。'},
 {q:'name 的中文是？', o:['名字','年紀','數字','朋友'], h:'name ＝ 名字。'},
 {q:'My 的中文是？', o:['我的','我','你的','你'], h:'I 我，My 我的。'},
 {q:'Your 的中文是？', o:['你的','你','我的','我'], h:'You 你，Your 你的。'},
 {q:'「我」的英文是？', o:['I','My','You','Your'], h:'I ＝ 我（永遠大寫）。'},
 {q:'「你」的英文是？', o:['You','Your','I','My'], h:'You ＝ 你。'},
 {q:'"What’s your name?" 的回答？', o:['My name is Emma.','I’m nine.','Your name is Emma.','I’m nine years old.'], h:'問名字，答名字。'},
 {q:'"How old are you?" 的回答？', o:['I’m ten.','I’m Ken.','My name is ten.','You’re ten.'], h:'問幾歲，答幾歲。'},
 {q:'「你的名字是什麼？」', o:['What’s your name?','What’s my name?','How old are you?','What your name?'], h:'your ＝ 你的。'},
 {q:'「你幾歲？」', o:['How old are you?','How are you?','How old you are?','What’s your name?'], h:'How old ＋ are ＋ you。'},
 {q:'「我八歲。」', o:['I’m eight years old.','I’m eight year old.','My eight years old.','I eight years old.'], h:'years 有 s，I’m 不能少。'},
 {q:'「我的名字是 Mike。」', o:['My name is Mike.','I name is Mike.','My name Mike.','Your name is Mike.'], h:'My name is ＋ 名字。'},
 {q:'eleven 是多少？', o:['十一','七','十二','十'], h:'eleven 11，twelve 12。'},
 {q:'twelve 是多少？', o:['十二','十一','二十','十'], h:'twelve ＝ 12。'},
 {q:'seven 是多少？', o:['七','十一','六','九'], h:'seven ＝ 7。'},
 {q:'「九」的英文是？', o:['nine','night','five','ten'], h:'nine 最後的 e 不發音。'},
 {q:'「六」的英文是？', o:['six','seven','sick','ten'], h:'six ＝ 6。'},
 {q:'years old 的中文是？', o:['歲','年','老','名字'], h:'years old ＝ 歲。'},
 {q:'I’m ten. 省略了什麼？', o:['years old','name','my','are'], h:'I’m ten years old. 的 years old 可以省略。'}
];

/* ── 🙋 G2 I 還是 My（24 題）：看到就按：左邊 I（我）、右邊 My（我的）──
 * a ＝ 'I' 或 'my'（句子開頭引擎會自動大寫） */
const G2 = [].concat(
 NAMES.map(n => ({txt:'___ name is ' + n[0] + '.', zh:'我的名字是 ' + n[1] + '。', a:'my', h:'後面有 name（名字）➜ 我的名字 ➜ My。'})),
 NAMES.map(n => ({txt:'___’m ' + n[0] + '.', zh:'我是 ' + n[1] + '。', a:'I', h:'’m ＝ am，I am ➜ I’m。'})),
 AGES.map(n => ({txt:'___’m ' + n[0] + ' years old.', zh:'我' + n[1] + '歲。', a:'I', h:'我是幾歲 ➜ I’m ＋ 數字 ＋ years old。'})),
 [
  {txt:'___ am Ken.', zh:'我是 Ken。', a:'I', h:'am 前面用 I：I am。'},
  {txt:'___ am nine.', zh:'我九歲。', a:'I', h:'am 前面用 I：I am。'},
  {txt:'Hi! ___ name is Alan.', zh:'嗨！我的名字是 Alan。', a:'my', h:'name 前面用 My（我的）。'},
  {txt:'___’m twelve.', zh:'我十二歲。', a:'I', h:'I’m ＝ I am ＝ 我是。'},
  {txt:'Hello! ___ name is Wendy.', zh:'哈囉！我的名字是 Wendy。', a:'my', h:'name 前面用 My（我的）。'},
  {txt:'___ am seven years old.', zh:'我七歲。', a:'I', h:'am 前面用 I：I am。'},
  {txt:'___ name is Emma.', zh:'我的名字是 Emma。', a:'my', h:'My name ＝ 我的名字。'}
 ]);

/* ── 🧩 G3 語序大挑戰（22 題）：照順序點字 ── */
const G3 = [
 {s:['What’s','your','name','?'], zh:'你的名字是什麼？', h:'中文「什麼」在最後，英文 What 在最前面。'},
 {s:['What','is','your','name','?'], zh:'你的名字是什麼？', h:'What ➜ is ➜ your ➜ name。'},
 {s:['How','old','are','you','?'], zh:'你幾歲？', h:'How old 一起放最前面。'},
 {s:['My','name','is','Ken','.'], zh:'我的名字是 Ken。', h:'My ➜ name ➜ is ➜ 名字。'},
 {s:['My','name','is','Wendy','.'], zh:'我的名字是 Wendy。', h:'跟中文一樣：我的 名字 是 Wendy。'},
 {s:['My','name','is','Mike','.'], zh:'我的名字是 Mike。', h:'My name is ＋ 名字。'},
 {s:['I’m','Alan','.'], zh:'我是 Alan。', h:'I’m ＋ 名字。'},
 {s:['I','am','Emma','.'], zh:'我是 Emma。', h:'I ➜ am ➜ 名字。'},
 {s:['I’m','eight','years','old','.'], zh:'我八歲。', h:'I’m ➜ 數字 ➜ years old。'},
 {s:['I’m','nine','years','old','.'], zh:'我九歲。', h:'數字放在 years old 前面。'},
 {s:['I’m','ten','years','old','.'], zh:'我十歲。', h:'years 在 old 前面。'},
 {s:['I','am','seven','years','old','.'], zh:'我七歲。', h:'I ➜ am ➜ 數字 ➜ years ➜ old。'},
 {s:['I’m','eleven','.'], zh:'我十一歲。', h:'years old 可以省略。'},
 {s:['I’m','twelve','.'], zh:'我十二歲。', h:'I’m ＋ 數字。'},
 {s:['I','am','six','.'], zh:'我六歲。', h:'I am ＋ 數字。'},
 {s:['My','name','is','Emma','.'], zh:'我的名字是 Emma。', h:'My name is ＋ 名字。'},
 {s:['I’m','Wendy','.'], zh:'我是 Wendy。', h:'I’m ＋ 名字。'},
 {s:['I','am','Ken','.'], zh:'我是 Ken。', h:'I ➜ am ➜ 名字。'},
 {s:['I’m','twelve','years','old','.'], zh:'我十二歲。', h:'I’m ➜ 數字 ➜ years old。'},
 {s:['What’s','your','name','?'], zh:'你叫什麼名字？', h:'What’s 放第一個。'},
 {s:['How','old','are','you','?'], zh:'你今年幾歲？', h:'are 放在 you 前面。'},
 {s:['I’m','six','years','old','.'], zh:'我六歲。', h:'數字放在 I’m 後面。'}
];

/* ── 🪄 G4 縮寫變身術（20 題）：拆開 ⇄ 縮寫 ⇄ 省略 ── */
const G4 = [
 {f:'What is your name?', d:'→ 縮寫', o:['What’s your name?','Whats your name?','What’is your name?','What your name?'], h:'is 的 i 換成 ’。'},
 {f:'What’s your name?', d:'→ 拆開', o:['What is your name?','What are your name?','What am your name?','What his your name?'], h:'What’s ＝ What is。'},
 {f:'I am Ken.', d:'→ 縮寫', o:['I’m Ken.','Im Ken.','I’am Ken.','My Ken.'], h:'am 的 a 換成 ’。'},
 {f:'I’m Mike.', d:'→ 拆開', o:['I am Mike.','I is Mike.','I are Mike.','My am Mike.'], h:'I’m ＝ I am。'},
 {f:'I am nine years old.', d:'→ 縮寫', o:['I’m nine years old.','Im nine years old.','I’am nine years old.','I’s nine years old.'], h:'I am ➜ I’m。'},
 {f:'I’m ten years old.', d:'→ 拆開', o:['I am ten years old.','I is ten years old.','I are ten years old.','My am ten years old.'], h:'I’m ＝ I am。'},
 {f:'You are eight.', d:'→ 縮寫', o:['You’re eight.','Your eight.','Youre eight.','You’are eight.'], h:'are 的 a 換成 ’。Your 是「你的」。'},
 {f:'You’re seven.', d:'→ 拆開', o:['You are seven.','You is seven.','Your are seven.','You am seven.'], h:'You’re ＝ You are。'},
 {f:'I’m eight years old.', d:'→ 省略 years old', o:['I’m eight.','I’m eight years.','I’m eight old.','I’m years old.'], h:'years 和 old 一起省略。'},
 {f:'I’m eleven years old.', d:'→ 省略 years old', o:['I’m eleven.','I’m eleven years.','I’m eleven old.','I eleven.'], h:'years old 一起拿掉。'},
 {f:'I’m six.', d:'→ 說完整', o:['I’m six years old.','I’m six year old.','I’m six years.','I’m six old.'], h:'加回 years old，years 有 s。'},
 {f:'I’m twelve.', d:'→ 說完整', o:['I’m twelve years old.','I’m twelve year old.','I’m twelve old.','I’m twelve years.'], h:'加回 years old。'},
 {f:'What is your name?', d:'→ 回答（用 My）', o:['My name is Wendy.','Your name is Wendy.','I name is Wendy.','My name Wendy.'], h:'問 your，答 My。'},
 {f:'What is your name?', d:'→ 回答（用 I’m）', o:['I’m Emma.','My Emma.','I Emma.','You’re Emma.'], h:'I’m ＋ 名字。'},
 {f:'How old are you?', d:'→ 回答（用 I’m）', o:['I’m nine.','I’m Mike.','My nine.','You’re nine.'], h:'問 you，答 I。'},
 {f:'My name is Ken.', d:'→ 換成 I’m', o:['I’m Ken.','I’m name is Ken.','My’m Ken.','I Ken.'], h:'My name is ___. ＝ I’m ___.'},
 {f:'I’m Alan.', d:'→ 換成 My name is', o:['My name is Alan.','My name Alan.','I name is Alan.','My is Alan.'], h:'I’m ___. ＝ My name is ___.'},
 {f:'I am seven.', d:'→ 縮寫', o:['I’m seven.','Im seven.','I’am seven.','I’s seven.'], h:'I am ➜ I’m。'},
 {f:'What is your name?', d:'→ 問幾歲', o:['How old are you?','What old are you?','How old is your name?','How are you?'], h:'問年紀用 How old。'},
 {f:'How old are you?', d:'→ 問名字', o:['What’s your name?','How’s your name?','What old are you?','What’s you name?'], h:'問名字用 What。'}
];

/* ── 🎧 G5 聽力狙擊（20 題）── */
const G5 = [
 {s:"What's your name?", o:["What's your name?","What's my name?","What is name?","How old are you?"], h:'聽中間：your（你的）。'},
 {s:'How old are you?', o:['How old are you?','How are you?',"What's your name?",'How old am I?'], h:'聽到 old ➜ 問幾歲。'},
 {s:'My name is Ken.', o:['My name is Ken.',"I'm ten.",'My name is Alan.',"I'm Ken."], h:'Ken 的 k 像「ㄎ」，ten 的 t 像「ㄊ」。'},
 {s:"I'm ten.", o:["I'm ten.","I'm Ken.","I'm seven.","I'm twelve."], h:'ten 開頭是 t（ㄊ）。'},
 {s:"I'm seven.", o:["I'm seven.","I'm eleven.","I'm six.","I'm Ken."], h:'eleven 前面多一個「ㄧ」。'},
 {s:"I'm eleven.", o:["I'm eleven.","I'm seven.","I'm twelve.","I'm Alan."], h:'eleven 十一，e-lev-en 三拍。'},
 {s:"I'm six years old.", o:["I'm six years old.","I'm seven years old.","I'm six.","I'm sixty years old."], h:'six 只有一拍。'},
 {s:"I'm nine years old.", o:["I'm nine years old.","I'm nine.","I'm eight years old.","I'm ten years old."], h:'nine 最後的 e 不發音。'},
 {s:"I'm eight.", o:["I'm eight.","I'm eight years old.","I'm nine.","I'm ten."], h:'eight 的 gh 不發音，像 ate。'},
 {s:"I'm twelve years old.", o:["I'm twelve years old.","I'm eleven years old.","I'm twelve.","I'm ten years old."], h:'twelve 開頭 tw。'},
 {s:'My name is Emma.', o:['My name is Emma.','My name is Wendy.',"I'm Emma.",'My name is Alan.'], h:'Emma 開頭是 E。'},
 {s:"I'm Wendy.", o:["I'm Wendy.",'My name is Wendy.',"I'm Emma.","I'm eight."], h:'短短的，只有 I’m ＋ 名字。'},
 {s:'My name is Mike.', o:['My name is Mike.',"I'm Mike.",'My name is Ken.','My name is Alan.'], h:'Mike 的 e 不發音。'},
 {s:"I'm Alan.", o:["I'm Alan.","I'm Emma.",'My name is Alan.',"I'm eleven."], h:'Alan 開頭是 A。'},
 {s:'What is your name?', o:['What is your name?',"What's your name?",'What is my name?','How old are you?'], h:'這一次是 What is，沒有縮寫。'},
 {s:'I am ten years old.', o:['I am ten years old.',"I'm ten years old.",'I am ten.','I am Ken.'], h:'這一次是 I am，沒有縮寫。'},
 {s:"You're seven.", o:["You're seven.","I'm seven.","You're eleven.","Your seven."], h:'開頭是 You’re（你是）。'},
 {s:"I'm nine.", o:["I'm nine.","I'm five.","I'm Mike.","I'm nine years old."], h:'短答，沒有 years old。'},
 {s:'My name is Wendy.', o:['My name is Wendy.','Your name is Wendy.',"I'm Wendy.",'My name is Emma.'], h:'開頭是 My（我的）。'},
 {s:"I'm six.", o:["I'm six.","I'm seven.","I'm Mike.","I'm sixty."], h:'six 一拍，seven 兩拍。'}
];

/* ── 🃏 G6 記憶配對（20 對）── */
const G6 = [
 ["What's your name?",'你的名字是什麼？'], ['How old are you?','你幾歲？'],
 ['My name','我的名字'], ["I'm",'我是'],   /* 名字不翻譯以後，含名字的句子一看就配得出來，所以換成不含名字的 */
 ["I'm eight years old.",'我八歲。'], ["I'm ten.",'我十歲。'],
 ['What','什麼'], ['How old','幾歲'], ['name','名字'], ['years old','歲'],
 ['I','我'], ['My','我的'], ['You','你'], ['Your','你的'],
 ['six','六'], ['seven','七'], ['nine','九'], ['eleven','十一'], ['twelve','十二'], ["You're",'你是']
];

/* ── 🔍 G7 火眼金睛（22 題）：挑出錯字，全對按「✅ 這句沒錯」── */
const G7 = [
 {w:['What’s','your','name','?'], b:-1, zh:'你的名字是什麼？', h:'這一句完全正確，別被騙了。'},
 {w:['What’s','you','name','?'], b:1, fix:'your', zh:'你的名字是什麼？', h:'「你的」名字要用 your。'},
 {w:['What’s','my','name','?'], b:1, fix:'your', zh:'你的名字是什麼？', h:'問別人的名字用 your。'},
 {w:['How','your','name','?'], b:0, fix:'What’s', zh:'你的名字是什麼？', h:'問名字用 What。'},
 {w:['How','old','are','you','?'], b:-1, zh:'你幾歲？', h:'這一句完全正確。'},
 {w:['What','old','are','you','?'], b:0, fix:'How', zh:'你幾歲？', h:'問幾歲是 How old，不是 What old。'},
 {w:['How','old','is','you','?'], b:2, fix:'are', zh:'你幾歲？', h:'you 要配 are。'},
 {w:['How','old','are','your','?'], b:3, fix:'you', zh:'你幾歲？', h:'問「你」幾歲，用 you。'},
 {w:['My','name','is','Ken','.'], b:-1, zh:'我的名字是 Ken。', h:'這一句完全正確。'},
 {w:['I','name','is','Ken','.'], b:0, fix:'My', zh:'我的名字是 Ken。', h:'「我的」名字要用 My。'},
 {w:['Your','name','is','Wendy','.'], b:0, fix:'My', zh:'我的名字是 Wendy。', h:'說自己的名字用 My。'},
 {w:['My','name','Emma','.'], b:2, fix:'is Emma', zh:'我的名字是 Emma。', h:'My name 後面要有 is。'},
 {w:['I’m','Mike','.'], b:-1, zh:'我是 Mike。', h:'這一句完全正確。'},
 {w:['My','Mike','.'], b:0, fix:'I’m', zh:'我是 Mike。', h:'「我是」要用 I’m。'},
 {w:['I’m','eight','years','old','.'], b:-1, zh:'我八歲。', h:'這一句完全正確。'},
 {w:['I’m','eight','year','old','.'], b:2, fix:'years', zh:'我八歲。', h:'years 要有 s。'},
 {w:['My','nine','years','old','.'], b:0, fix:'I’m', zh:'我九歲。', h:'說自己幾歲用 I’m。'},
 {w:['I’m','ten','years','.'], b:2, fix:'years old', zh:'我十歲。', h:'years 後面還要有 old。'},
 {w:['I’m','eleven','.'], b:-1, zh:'我十一歲。', h:'years old 可以省略，這一句正確。'},
 {w:['I','twelve','years','old','.'], b:0, fix:'I’m', zh:'我十二歲。', h:'I 後面要有 am：I’m。'},
 {w:['I’m','seven','old','.'], b:2, fix:'years old', zh:'我七歲。', h:'old 前面要有 years。'},
 {w:['Your','six','.'], b:0, fix:'You’re', zh:'你六歲。', h:'「你是」是 You’re；Your 是「你的」。'}
];

/* ── ✏️ G8 填空高手（22 題）── */
const G8 = [
 {b:'___', a:"'s your name?", zh:'你的名字是什麼？', o:['What','How','Who','My'], h:'問名字用 What。'},
 {b:"What's", a:'name?', zh:'你的名字是什麼？', o:['your','you','my','I'], h:'你的 ＝ your。'},
 {b:"What's your", a:'?', zh:'你的名字是什麼？', o:['name','old','years','nine'], h:'名字 ＝ name。'},
 {b:'How', a:'are you?', zh:'你幾歲？', o:['old','name','years','is'], h:'How old ＝ 幾歲。'},
 {b:'How old', a:'you?', zh:'你幾歲？', o:['are','is','am','do'], h:'you 配 are。'},
 {b:'How old are', a:'?', zh:'你幾歲？', o:['you','your','I','my'], h:'你 ＝ you。'},
 {b:'___', a:'name is Ken.', zh:'我的名字是 Ken。', o:['My','I','Your','Me'], h:'我的 ＝ My。'},
 {b:'My name', a:'Alan.', zh:'我的名字是 Alan。', o:['is','am','are','’m'], h:'name 配 is。'},
 {b:'My', a:'is Wendy.', zh:'我的名字是 Wendy。', o:['name','old','years','you'], h:'名字 ＝ name。'},
 {b:'___', a:"'m Mike.", zh:'我是 Mike。', o:['I','My','You','Me'], h:'I’m ＝ I am ＝ 我是。'},
 {b:'I', a:'Emma.', zh:'我是 Emma。', o:['am','is','are','my'], h:'I 配 am。'},
 {b:"I'm eight", a:'old.', zh:'我八歲。', o:['years','year','name','is'], h:'years 要有 s。'},
 {b:"I'm nine years", a:'.', zh:'我九歲。', o:['old','name','nine','you'], h:'years old ＝ 歲。'},
 {b:"I'm", a:'years old.', zh:'我十歲。', o:['ten','Ken','two','tea'], h:'十 ＝ ten。'},
 {b:"I'm", a:'.', zh:'我十一歲。', o:['eleven','seven','twelve','even'], h:'十一 ＝ eleven。'},
 {b:"I'm", a:'years old.', zh:'我十二歲。', o:['twelve','eleven','twenty','two'], h:'十二 ＝ twelve。'},
 {b:"I'm", a:'.', zh:'我七歲。', o:['seven','six','eleven','nine'], h:'七 ＝ seven。'},
 {b:"I'm", a:'years old.', zh:'我六歲。', o:['six','sick','seven','sixty'], h:'六 ＝ six。'},
 {b:"I'm", a:'.', zh:'我九歲。', o:['nine','night','five','ten'], h:'九 ＝ nine。'},
 {b:'___', a:"'re seven.", zh:'你七歲。', o:['You','Your','I','My'], h:'You’re ＝ You are ＝ 你是。'},
 {b:'___', a:'old are you?', zh:'你幾歲？', o:['How','What','Who','My'], h:'問幾歲用 How old。'},
 {b:"I'm", a:'.', zh:'我八歲。', o:['eight','eat','ten','Ken'], h:'八 ＝ eight。'}
];

/* ── 🗂 G9 問名字 還是 問幾歲（24 題）：這一句是在回答哪一個問題？──
 * [句子, 'n' 名字 | 'a' 幾歲, 答錯提示] */
const G9 = [].concat(
 NAMES.map(n => ['My name is ' + n[0] + '.', 'n', n[0] + ' 是名字 ➜ 在回答 What’s your name?']),
 NAMES.map(n => ['I’m ' + n[0] + '.', 'n', n[0] + ' 是名字 ➜ 在回答 What’s your name?']),
 AGES.map(n => ['I’m ' + n[0] + '.', 'a', n[0] + ' 是數字（' + n[1] + '）➜ 在回答 How old are you?']),
 AGES.map(n => ['I’m ' + n[0] + ' years old.', 'a', 'years old ＝ 歲 ➜ 在回答 How old are you?'])
);

/* ── 👑 G10 魔王挑戰（24 題，混合）── */
const G10 = [
 {q:'魔王問：What’s ＝ ?', o:['What is','What are','Whats','What am'], h:'’ 藏起來的是 is 的 i。'},
 {q:'魔王問：I’m ＝ ?', o:['I am','I is','My am','I are'], h:'I’m ＝ I am。'},
 {q:'魔王問：You’re ＝ ?', o:['You are','Your','You is','You am'], h:'Your 是「你的」，You’re 是「你是」。'},
 {q:'魔王問：「你的名字是什麼？」', o:['What’s your name?','What’s you name?','How’s your name?','What your name?'], h:'What’s ＋ your ＋ name。'},
 {q:'魔王問：「你幾歲？」', o:['How old are you?','What old are you?','How are you?','How old is you?'], h:'How old are you?'},
 {q:'魔王問：What’s your name? 的回答？', o:['I’m Wendy.','I’m ten.','Your name is Wendy.','I’m ten years old.'], h:'問名字，答名字。'},
 {q:'魔王問：How old are you? 的回答？', o:['I’m eleven years old.','I’m Alan.','My name is eleven.','You’re eleven.'], h:'問幾歲，答幾歲。'},
 {q:'魔王問：問 your，要答？', o:['My','Your','You','I'], h:'your（你的）➜ My（我的）。'},
 {q:'魔王問：問 you，要答？', o:['I','You','My','Your'], h:'you（你）➜ I（我）。'},
 {q:'魔王問：哪一句是對的？', o:['I’m nine years old.','I’m nine year old.','I nine years old.','My nine years old.'], h:'I’m ＋ 數字 ＋ years old。'},
 {q:'魔王問：哪一句是對的？', o:['My name is Mike.','I name is Mike.','My name Mike.','Me name is Mike.'], h:'My name is ＋ 名字。'},
 {q:'魔王問：I’m eight. 等於？', o:['I’m eight years old.','I’m eight year.','My name is eight.','I eat.'], h:'years old 可以省略。'},
 {q:'魔王問：How old 問什麼？', o:['幾歲','名字','怎麼樣','什麼'], h:'How old ＝ 問年紀。'},
 {q:'魔王問：How 單獨是什麼？', o:['怎麼樣','幾歲','什麼','名字'], h:'How 問程度；How old 才是問幾歲。'},
 {q:'魔王問：What 的哪個字母不發音？', o:['h','W','a','t'], h:'What 的 h 淺灰色。'},
 {q:'魔王問：eight 的哪兩個字母不發音？', o:['gh','ei','ht','eg'], h:'eight 的 gh 淺灰色。'},
 {q:'魔王問：name 的哪個字母不發音？', o:['e','n','a','m'], h:'name 的 e 淺灰色。'},
 {q:'魔王問：twelve 是多少？', o:['十二','十一','二十','十'], h:'twelve ＝ 12。'},
 {q:'魔王問：eleven 是多少？', o:['十一','七','十二','十'], h:'eleven ＝ 11。'},
 {q:'魔王問：「我七歲。」', o:['I’m seven.','I’m eleven.','My seven.','You’re seven.'], h:'I’m ＋ seven。'},
 {q:'魔王問：「你是七歲。」', o:['You’re seven.','Your seven.','I’m seven.','You seven.'], h:'You’re ＝ You are ＝ 你是。'},
 {q:'魔王問：My 的中文？', o:['我的','我','你的','你'], h:'I 我，My 我的。'},
 {q:'魔王問：Your 的中文？', o:['你的','你','我的','我'], h:'You 你，Your 你的。'},
 {q:'魔王問：I’m Ken. 在回答哪一題？', o:['What’s your name?','How old are you?','How are you?','Who are you?'], h:'Ken 是名字 ➜ What’s your name?'}
];

/* ── 🎁 正向驚喜卡：十個遊戲各 30 張，300 張名字全部不重複（使用者 2026-09-24 指定；2026-09-25 改版）──
 * 效果和翻開的特效由 ../sentences/_surprise.js 分配：同一個遊戲 30 張的名字、效果、特效全部不一樣，
 * 只給好事（加分、✕2～✕5、加秒、刪錯的選項、免死金牌、連對挑戰……）。
 * 名字用空白隔開、30 個一組；第一個字（emoji）就是翻開時炸滿畫面的那一個 */
const THEME = {
 g1: '🚀火箭升空 🛸飛碟降落 🌕滿月能量 🌟超級新星 ☄️彗星撞地球 🪐土星光環 🌌銀河旋風 👽外星朋友 🛰️衛星連線 🌠流星許願 🔭望遠鏡發現 🌙彎彎月亮 ☀️太陽充電 🌍繞地球一圈 👩‍🚀太空人出任務 💫星星轉圈圈 ✨星塵閃閃 🌞太陽公公 🌛月亮小船 🪨月球寶石 🧭太空羅盤 📡雷達鎖定 🌑黑洞吸分 🎇星空煙火 🧑‍🚀無重力漂浮 🚀光速引擎 🌟北極星指路 🪐木星風暴 🌠流星雨 🛸外星禮物',
 g2: '🐼熊貓抱抱 🦁獅子吼 🐯老虎衝刺 🐘大象噴水 🦒長頸鹿看遠遠 🐬海豚跳躍 🦊狐狸妙計 🐰兔子蹦蹦跳 🐢烏龜穩穩走 🦉貓頭鷹智慧 🐧企鵝滑冰 🐨無尾熊午睡 🦘袋鼠跳高 🐝蜜蜂採蜜 🦋蝴蝶飛飛 🐿️松鼠藏堅果 🦄獨角獸魔法 🐶小狗搖尾巴 🐱小貓伸懶腰 🐸青蛙呱呱 🦜鸚鵡學說話 🐳鯨魚噴泉 🦔刺蝟縮成球 🐹倉鼠跑滾輪 🐮乳牛送牛奶 🐔小雞啾啾 🦩紅鶴單腳站 🐒猴子盪鞦韆 🐊鱷魚大口 🦥樹懶慢慢來',
 g3: '🍰草莓蛋糕 🍩甜甜圈 🍪巧克力餅乾 🧁杯子蛋糕 🍦霜淇淋 🍭彩虹棒棒糖 🍫巧克力磚 🍮布丁搖搖 🥞鬆餅塔 🍓草莓大豐收 🍉西瓜切片 🍬水果糖 🥧蘋果派 🍡糰子串串 🧇格子鬆餅 🍯蜂蜜罐 🎂生日蛋糕 🍿爆米花 🥤珍珠奶茶 🍧剉冰 🍒櫻桃雙胞胎 🍌香蕉船 🥐可頌麵包 🍨聖代 🍎紅蘋果 🥭芒果冰 🍋檸檬汽水 🍇葡萄一串 🥥椰子汁 🍑水蜜桃',
 g4: '🔮水晶球 🪄魔杖一揮 🎩帽子變兔子 ✨魔法亮粉 📜古老咒語 🧙巫師祝福 🧚小仙子 🌀傳送門 🕯️魔法蠟燭 🗝️金鑰匙 🧪變身藥水 📖魔法書 🦉魔法信差 🧹飛天掃帚 🪞魔鏡魔鏡 💍魔法戒指 🐉小龍守護 🌟許願星 🎴魔法卡牌 🧿幸運護符 🍄魔法蘑菇 🌈彩虹橋 🪶鳳凰羽毛 🏰魔法城堡 🎪魔術秀 🃏鬼牌翻轉 🧞神燈精靈 ⚗️煉金術 🔔魔法鈴鐺 🌙月光魔法',
 g5: '🎵音符跳跳 🎸電吉他 🥁鼓聲咚咚 🎺小喇叭 🎹鋼琴鍵 🎻小提琴 🎷薩克斯風 🪘非洲鼓 🎤麥克風 🎧耳機音樂 📻收音機 🪗手風琴 🎶合唱團 🔔叮噹鈴 🪇沙鈴沙沙 🎼五線譜 🪕斑鳩琴 💃跳舞時間 🕺迪斯可 🎙️廣播電台 📯號角響起 🪈直笛 🎚️音量開到最大 🔊超大聲 🎛️混音大師 🎟️演唱會門票 🏆金曲獎 👏全場鼓掌 🌟安可安可 💿黃金唱片',
 g6: '🐬海豚跳圈 🐙章魚八隻手 🦀螃蟹橫著走 🐠熱帶魚 🦈鯊魚衝刺 🐚貝殼寶藏 🦞龍蝦大餐 🪸珊瑚礁 🌊大浪來了 🏝️小島探險 ⚓船錨 🧜美人魚 🐡河豚膨膨 🦭海豹拍手 🐋藍鯨 🦑魷魚噴墨 🐟小魚群 🪼水母漂漂 ⛵帆船出航 🐢海龜回家 🏖️沙灘城堡 🦦海獺手牽手 🐳鯨魚唱歌 🌅海上日出 🔱海神三叉戟 🧭航海羅盤 🗺️藏寶地圖 🦐小蝦米 🐧冰上企鵝 🫧泡泡浴',
 g7: '💎閃亮鑽石 🔍放大鏡 🕵️名偵探 🧩破案線索 🗝️密室鑰匙 👣神秘腳印 📜藏寶紙條 🔦手電筒 🧤偵探手套 🕰️老時鐘 🪙金幣一枚 👑失落王冠 🏺古董花瓶 📦神秘包裹 🧲找到了 🗃️祕密檔案 🔐密碼鎖 🧿真相之眼 🐾貓咪偵探 🎩福爾摩斯帽 📸證據照片 🗺️尋寶路線 💰金幣滿袋 💍寶石戒指 🪞照妖鏡 🦴恐龍化石 🏴‍☠️海盜寶箱 ⛏️挖到寶 📿珍珠項鍊 🚪祕密通道',
 g8: '⚽射門得分 🏀三分球 ⚾全壘打 🏐排球殺球 🎾網球發球 🏓桌球連發 🏸羽球扣殺 🥅守門成功 🏊游泳衝刺 🚴騎車衝線 🏃接力棒 🤸後空翻 🥇金牌 🥈銀牌 🥉銅牌 🏆冠軍獎盃 🎯飛鏢紅心 🛹滑板特技 ⛸️花式溜冰 🏂滑雪板 🥋跆拳道 🏹射箭 🧗攀岩登頂 🤾手球 🏌️一桿進洞 🛼溜冰鞋 🪁放風箏 🏅運動會獎牌 📣啦啦隊加油 🎽運動背心',
 g9: '🌈雙彩虹 ☀️大晴天 ⛅太陽出來了 🌤️微風 🌸櫻花雨 🌻向日葵 🍀四葉草 🌳大樹爺爺 🍁楓葉飄 ❄️雪花片片 ⛄雪人 🌷鬱金香 🌼小雛菊 🍃清風 🌊海風 🌋火山 🏔️雪山 🌾稻田 🌺扶桑花 🌵仙人掌 🪴小盆栽 🌙安靜夜晚 ⭐滿天星 🌦️太陽雨 ⚡打雷閃電 🌪️龍捲風 🌅日出 🌄山頂日出 🍂秋天落葉 🌱新芽',
 g10: '⚔️勇者之劍 🛡️聖騎士盾 🏹神射手 👑國王賞賜 🐉屠龍英雄 🗡️雙刀流 🔥火焰魔法 ❄️冰凍魔法 ⚡雷電魔法 🧪回血藥水 💪力量加倍 🦸超級英雄 🏰攻進城堡 🐴騎士戰馬 🎖️勇氣勳章 🪖鋼鐵頭盔 🧙大魔法師 🔱海神之力 🌟勇者之星 🗺️冒險地圖 💥必殺技 🌀旋風斬 🦅老鷹偵察 🐺狼群助陣 🧝精靈弓箭 🤖機器戰士 🥷忍者閃現 🪓戰斧 🏆魔王獎盃 🎁魔王寶箱'
};
const SURP = require('../sentences/_surprise').buildAll(THEME);

/* duo ＝ 兩顆大按鈕：v 值、大字、小字（g9 的小字「　」前面那一段 ＝ 答錯頁上顯示的名字）、顏色 */
const GAMES = [
 {id:'g1', ic:'⚡', name:'閃電四選一', rule:'看題目選答案，答得快分數高。', st:'🚀 太空', n:G1.length},
 {id:'g2', ic:'🙋', name:'I 還是 My', rule:'看到就按：左邊 I（我）、右邊 My（我的）。', st:'🐼 動物', n:G2.length,
 duo:[{v:'I',t:'I',d:'我　🙋',c:'she'},{v:'my',t:'My',d:'我的　🙋🎒',c:'he'}]},
 {id:'g3', ic:'🧩', name:'語序大挑戰', rule:'照順序點英文字，把整句排出來。', st:'🍰 甜點', n:G3.length},
 {id:'g4', ic:'🪄', name:'縮寫變身術', rule:'What is ⇄ What’s、I am ⇄ I’m，選出變身後正確的句子。', st:'🔮 魔法', n:G4.length},
 {id:'g5', ic:'🎧', name:'聽力狙擊',  rule:'聽一句英文，射下正確的那一張卡。', st:'🎵 音樂', n:G5.length},
 {id:'g6', ic:'🃏', name:'記憶配對',  rule:'翻開兩張，英文配中文，配對成功就消失。', st:'🐬 海洋', n:G6.length},
 {id:'g7', ic:'🔍', name:'火眼金睛',  rule:'句子裡有一個字是錯的，點出來。全對的句子按「✅ 這句沒錯」。', st:'💎 尋寶', n:G7.length},
 {id:'g8', ic:'✏️', name:'填空高手',  rule:'句子少了一個字，選出正確的那一個。', st:'⚽ 運動', n:G8.length},
 {id:'g9', ic:'🗂', name:'問名字還是問幾歲', rule:'這一句在回答哪一題？📛 名字 ／ 🎂 幾歲。', st:'🌈 大自然', n:G9.length,
 duo:[{v:'n',t:'📛',d:'問名字　What’s your name?',c:'he'},{v:'a',t:'🎂',d:'問幾歲　How old are you?',c:'she'}]},
 {id:'g10', ic:'👑', name:'魔王挑戰',  rule:'打倒魔王！答對扣血，答錯魔王放技能。', st:'⚔️ 勇者', n:G10.length}
];

/* 引擎設定：每個遊戲至少 30 張驚喜卡（量測會檢查） */
const CFG = { minSurp: 30 };

module.exports = { G1, G2, G3, G4, G5, G6, G7, G8, G9, G10, GAMES, SURP, CFG };
