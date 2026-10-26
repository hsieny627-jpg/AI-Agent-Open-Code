/* midterm/_exam_data.js — 📝 四年級 複習 25 題／50 題 挑戰 的 題庫（2026-10-26 老師第二十八次 第 3、4 點）
 *
 * 老師原文：題目 30% 和期中考題相似（不可以 100% 一樣）、70% 跟期中考題完全不同；遊戲平均抽 25 題（每題 4 分）／50 題（每題 2 分），一關一關連著玩。
 * 老師的選擇題：全新出題（跟考卷、「四年級 複習」（_data.js）、短文偵探草稿（_pas_draft.js）都不一樣）、每一次重新抽、12 種都玩
 *   （25 題 ＝ 1 關 3 題、11 關 2 題；50 題 ＝ 2 關 5 題、10 關 4 題）、大廳最上面〔📝 25 題〕〔📝 50 題〕、記成績。
 * 每一題第一格 s：1 ➜ 🔁 類似（考的重點跟期中考某一題一樣，但字、句子、選項、問法不一樣）、0 ➜ 🆕 全新（考卷沒有考的字、句子、問法）。
 * 人名：考卷（Amy）、四年級複習（Ken、Mia、Tom）、短文草稿（Frank、Lisa、Peter、Grace）都不用 ➜ Owen、Jason、Emily、Nora。
 * 格式跟 _data.js 一樣（o[0] ＝ 正解），_data.js 的 XB 再算 fe／fz／fs（答錯頁）。 */
const P = (who, job) => who + (job ? '|' + job : '');

/* 🎈 m1 字首音 氣球 [s, 字, 圖, 中文]（字首 b／d／p／t）
   🔁 ＝ 像 考卷 的 短 字（bed、pit 那一種：b-a-t）；🆕 ＝ 長 一點 的 新 字 */
const X1 = [[1, 'bat', '🦇', '蝙蝠'], [1, 'tub', '🛁', '浴缸'],
  [0, 'bird', '🐦', '鳥'], [0, 'duck', '🦆', '鴨子'], [0, 'pizza', '🍕', '披薩'], [0, 'turtle', '🐢', '烏龜'], [0, 'dinosaur', '🦖', '恐龍']];

/* 👯 m2 聲音 雙胞胎 [s, 字1, 字2]：第一個 音 一樣 ⭕／不一樣 ❌
   🔁 ＝ 短 字（像 考卷 bus、pit）；🆕 ＝ 新 的 長 字 */
const X2 = [[1, 'bat', 'pig'], [1, 'tub', 'ten'],
  [0, 'duck', 'dinosaur'], [0, 'pizza', 'turtle'], [0, 'bird', 'duck'], [0, 'turtle', 'tub'], [0, 'dinosaur', 'pizza']];

/* 📸 m3 聽句 找照片 [s, 英文, 正解圖, [誘答圖 2], 中文]
   🔁 ＝ Is your … a …? Yes／No（考卷 聽 句子 勾 圖 的 重點）；🆕 ＝ Who’s she?／This is my …／Look! 說 家人 ＋ 職業 */
const X3 = [[1, 'Is your grandma a farmer? Yes, she is.', P('grandma', 'farmer'), [P('grandpa', 'farmer'), P('grandma', 'cook')], '你的 奶奶 是 農夫 嗎？是的，她 是。'],
  [1, 'Is your dad a cook? No, he isn’t. He’s a teacher.', P('dad', 'teacher'), [P('dad', 'cook'), P('mom', 'teacher')], '你的 爸爸 是 廚師 嗎？不，他 不是。他 是 老師。'],
  [0, 'Who’s she? She’s my grandmother. She’s a nurse.', P('grandma', 'nurse'), [P('mom', 'nurse'), P('grandma', 'teacher')], '她 是 誰？她 是 我的 奶奶。她 是 護理師。'],
  [0, 'This is my brother. He’s a farmer.', P('brother', 'farmer'), [P('sister', 'farmer'), P('brother', 'student')], '這 是 我的 哥哥。他 是 農夫。'],
  [0, 'Look! She’s my sister. She’s a cook.', P('sister', 'cook'), [P('sister', 'nurse'), P('mom', 'cook')], '看！她 是 我的 姊姊。她 是 廚師。'],
  [0, 'Who’s he? He’s my father. He’s a nurse.', P('dad', 'nurse'), [P('grandpa', 'nurse'), P('dad', 'doctor')], '他 是 誰？他 是 我的 爸爸。他 是 護理師。'],
  [0, 'This is my grandpa. He’s a doctor.', P('grandpa', 'doctor'), [P('grandma', 'doctor'), P('grandpa', 'farmer')], '這 是 我的 爺爺。他 是 醫生。']];

/* 🏫 m4 教室 指令王 [s, 英文, 正解 照片, [誘答 3], 中文]
   🔁 ＝ Classroom English 原句（考卷 是 排順序，這裡 是 聽了 點，誘答 組合 不一樣）；🆕 ＝ 新 的 情境 句子（前面 多 一句，聽懂 才 點得對） */
const X4 = [[1, 'Turn on the light.', 'lighton', ['lightoff', 'donttalk', 'homework'], '打開 燈。'],
  [1, 'Show me your homework.', 'homework', ['lightoff', 'hurryup', 'donttalk'], '給 我 看 你的 作業。'],
  [0, 'Shh! Don’t talk, please.', 'donttalk', ['dontrun', 'timesup', 'letsgo'], '噓！請 不要 說話。'],
  [0, 'Stop! Don’t run.', 'dontrun', ['donttalk', 'hurryup', 'lighton'], '停！不要 跑。'],
  [0, 'Come on! Hurry up!', 'hurryup', ['letsgo', 'timesup', 'homework'], '快 來！快 一點！'],
  [0, 'Class, let’s go.', 'letsgo', ['hurryup', 'donttalk', 'lightoff'], '同學們，我們 走 吧。'],
  [0, 'Please turn off the light.', 'lightoff', ['lighton', 'homework', 'dontrun'], '請 關掉 燈。']];

/* 🎯 m5 數字 神射手 [s, 要唸 的, 正解, [誘答 3], 中文]
   🔁 ＝ 聽 一個 數字（考卷 聽 數字 的 重點），誘答 不一樣；🆕 ＝ 聽 一句 話 裡 的 歲數 */
const X5 = [[1, 'twelve', '12', ['20', '10', '13'], 'twelve ＝ 12'], [1, 'fifteen', '15', ['50', '5', '13'], 'fifteen ＝ 15'],
  [0, 'I’m seventeen.', '17', ['70', '7', '16'], '我 十七 歲。'], [0, 'My sister is fourteen.', '14', ['40', '4', '13'], '我的 姊姊 十四 歲。'],
  [0, 'He’s nineteen.', '19', ['90', '9', '18'], '他 十九 歲。'], [0, 'She’s eleven.', '11', ['12', '1', '17'], '她 十一 歲。'],
  [0, 'My brother is eighteen.', '18', ['80', '8', '17'], '我的 哥哥 十八 歲。']];

/* 💬 m6 聊天室 接話 [s, A／B, 那一句, [正解, 誘答 2], 中文]（A ＝ 選 B 的 回答；B ＝ B 回答了，選 A 問 什麼）
   🔁 ＝ Who’s she?／Is he your dad?（考卷 讀 對話 選 答句 的 重點）；🆕 ＝ 請進、反過來 問、兩句 一起 問 */
const X6 = [[1, 'A', 'Who’s she?', ['She’s my sister.', 'He’s my brother.', 'Yes, she is.'], '她 是 誰？➜ 她 是 我的 姊姊。'],
  [1, 'A', 'Is he your dad?', ['Yes, he is.', 'Yes, she is.', 'He’s a cook.'], '他 是 你的 爸爸 嗎？➜ 是的，他 是。'],
  [0, 'A', 'Come in, please.', ['Thank you.', 'Nice to meet you, too.', 'No, he isn’t.'], '請 進。➜ 謝謝 你。'],
  [0, 'B', 'Nice to meet you, too.', ['Nice to meet you.', 'Thank you.', 'Who’s he?'], '很 高興 認識 你。➜ 我 也 很 高興 認識 你。'],
  [0, 'A', 'Is your grandma a teacher?', ['No, she isn’t. She’s a doctor.', 'No, he isn’t. He’s a doctor.', 'Yes, she isn’t.'], '你的 奶奶 是 老師 嗎？➜ 不，她 不是。她 是 醫生。'],
  [0, 'B', 'He’s my brother.', ['Who’s he?', 'Who’s she?', 'Is he a cook?'], '他 是 誰？➜ 他 是 我的 哥哥。'],
  [0, 'A', 'Who’s he? Is he your brother?', ['No, he isn’t. He’s my dad.', 'No, she isn’t.', 'Yes, she is.'], '他 是 誰？他 是 你的 哥哥 嗎？➜ 不，他 不是。他 是 我的 爸爸。']];

/* ✍️ m7 拼字 救援 [s, 字, 圖, 中文]
   🔁 ＝ 考卷 看圖 寫 的 字（sister、teacher），這裡 給 頭 尾、點 字母；🆕 ＝ 考卷 沒有 的 字 */
const X7 = [[1, 'sister', '👧', '姊姊'], [1, 'teacher', '📚', '老師'],
  [0, 'mom', '👩', '媽媽'], [0, 'thirteen', '13', '十三'], [0, 'sixteen', '16', '十六'], [0, 'nineteen', '19', '十九'], [0, 'fourteen', '14', '十四']];

/* 🕵️ m8 短文 偵探：兩篇 新 的 對話（老師 第二十七次 6-(4)：對話式、兩篇 完全 不同、測得出 期中考 短文 的 目標：幾 歲、家裡 的 誰、做 什麼 工作、Yes／No）
   [s, 哪一篇, 問題, [正解, 誘答 2], 證據 在 第幾行] */
const PAS = {
  xjason: { title: '看 家人 的 照片', sp: ['Nora', 'Jason', 'Nora', 'Jason', 'Nora', 'Jason'],
    t: ['Jason, who’s she?', 'She’s my grandma. She’s a farmer.', 'Who’s he? Is he your grandpa?', 'No, he isn’t. He’s my uncle. He’s a doctor.', 'Is he twenty?', 'No, he isn’t. He’s nineteen.'],
    z: ['Jason，她 是 誰？', '她 是 我的 奶奶。她 是 農夫。', '他 是 誰？他 是 你的 爺爺 嗎？', '不，他 不是。他 是 我的 叔叔。他 是 醫生。', '他 二十 歲 嗎？', '不，他 不是。他 十九 歲。'] },
  xemily: { title: '在 公園 遇到 朋友', sp: ['Owen', 'Emily', 'Owen', 'Emily', 'Owen', 'Emily'],
    t: ['Good morning, Emily. Who’s she?', 'Good morning, Owen. She’s my sister.', 'Is she a student?', 'Yes, she is. She’s fourteen.', 'Who’s he? Is he your dad?', 'Yes, he is. He’s a nurse.'],
    z: ['早安，Emily。她 是 誰？', '早安，Owen。她 是 我的 姊姊。', '她 是 學生 嗎？', '是的，她 是。她 十四 歲。', '他 是 誰？他 是 你的 爸爸 嗎？', '是的，他 是。他 是 護理師。'] }
};
const X8 = [[1, 'xjason', 'Jason 的 奶奶 做 什麼 工作？', ['a farmer', 'a doctor', 'a cook'], 1],
  [0, 'xjason', '照片 上 的 男生 是 Jason 的 誰？', ['叔叔', '爺爺', '爸爸'], 3],
  [0, 'xjason', 'Jason 的 叔叔 做 什麼 工作？', ['a doctor', 'a farmer', 'a nurse'], 3],
  [0, 'xjason', 'Nora 問「Is he twenty?」，Jason 怎麼 回答？', ['No, he isn’t.', 'Yes, he is.', 'No, she isn’t.'], 5],
  [1, 'xjason', 'Jason 的 叔叔 幾 歲？', ['nineteen', 'twenty', 'ninety'], 5],
  [1, 'xemily', 'Emily 的 姊姊 幾 歲？', ['fourteen', 'forty', 'four'], 3],
  [0, 'xemily', '跟 Emily 在 一起 的 女生 是 誰？', ['Emily 的 姊姊', 'Emily 的 媽媽', 'Emily 的 奶奶'], 1],
  [0, 'xemily', 'Emily 的 姊姊 是 ___。', ['a student', 'a teacher', 'a nurse'], 3],
  [0, 'xemily', 'Emily 的 爸爸 做 什麼 工作？', ['a nurse', 'a doctor', 'a cook'], 5],
  [0, 'xemily', 'Owen 問「Is he your dad?」，Emily 怎麼 回答？', ['Yes, he is.', 'No, he isn’t.', 'Yes, she is.'], 5]];

/* 🌳 m9 家族樹 尋人 [s, 英文, 正解 的 人]
   🔁 ＝ This is my …（考卷 看 家庭樹 選 字 的 重點，這裡 反過來 點 人）；🆕 ＝ 兩句 話、Look!、Who’s he? */
const X9 = [[1, 'This is my grandmother.', 'grandma'], [1, 'This is my father.', 'dad'],
  [0, 'She’s my mother. She’s a cook.', 'mom'], [0, 'He’s my brother. He’s a student.', 'brother'], [0, 'Look! This is my sister.', 'sister'],
  [0, 'Who’s he? He’s my grandfather.', 'grandpa'], [0, 'He’s my dad. He’s a farmer.', 'dad']];

/* 🧩 m10 對話 工廠 [s, 句子, [正解, 誘答 3], 圖, 中文]
   🔁 ＝ Who’s she? She’s…／No, he isn’t.（考卷 字庫 寫 對話 的 重點）；🆕 ＝ 其他 空格 */
const X10 = [[1, 'A: Who’s she? B: ___ my sister.', ['She’s', 'Her', 'He’s', 'She'], '', '她 是 誰？她 是 我的 姊姊。'],
  [1, 'A: Is he a nurse? B: No, he ___. He’s a doctor.', ['isn’t', 'is', 'not', 'she'], '', '他 是 護理師 嗎？不，他 不是。他 是 醫生。'],
  [0, 'A: Is your mom a teacher? B: Yes, ___ is.', ['she', 'he', 'her', 'his'], '', '你的 媽媽 是 老師 嗎？是的，她 是。'],
  [0, 'A: ___ he your grandpa? B: Yes, he is.', ['Is', 'Are', 'Who’s', 'Am'], '', '他 是 你的 爺爺 嗎？是的，他 是。'],
  [0, 'This is my sister. ___ a nurse.', ['She’s', 'Her', 'He’s', 'She'], '', '這 是 我的 姊姊。她 是 護理師。'],
  [0, 'A: Is she a farmer? B: No, she isn’t. She’s a ___.', ['cook', 'farmer', 'nurse', 'teacher'], P('mom', 'cook'), '她 是 農夫 嗎？不，她 不是。她 是 廚師。'],
  [0, 'My brother ___ fourteen.', ['is', 'are', 'am', 'be'], '', '我的 哥哥 十四 歲。']];

/* ✅ m11 是不是 快問快答 [s, 圖, 問句, [正解, 誘答…], 中文]
   🔁 ＝ 看圖 Is he／she a …? Yes／No（考卷 看圖 回答 的 重點）；🆕 ＝ 看圖 Who’s he／she?、Is he your …?（問 家人） */
const YN = { he: ['Yes, he is.', 'No, he isn’t.', 'Yes, she is.', 'No, she isn’t.'], she: ['Yes, she is.', 'No, she isn’t.', 'Yes, he is.', 'No, he isn’t.'] };
const yn = (a, he) => [a].concat(YN[he ? 'he' : 'she'].filter(x => x !== a));
const X11 = [[1, P('grandma', 'farmer'), 'Is she a farmer?', yn('Yes, she is.'), '她 是 農夫 嗎？是的，她 是。'],
  [1, P('dad', 'teacher'), 'Is he a doctor?', yn('No, he isn’t.', 1), '他 是 醫生 嗎？不，他 不是。'],
  [0, P('grandpa'), 'Who’s he?', ['He’s my grandpa.', 'She’s my grandma.', 'He’s my dad.'], '他 是 誰？他 是 我的 爺爺。'],
  [0, P('sister'), 'Who’s she?', ['She’s my sister.', 'He’s my brother.', 'She’s my mom.'], '她 是 誰？她 是 我的 姊姊。'],
  [0, P('mom'), 'Who’s she?', ['She’s my mom.', 'She’s my grandma.', 'He’s my dad.'], '她 是 誰？她 是 我的 媽媽。'],
  [0, P('brother'), 'Is he your dad?', yn('No, he isn’t.', 1), '他 是 你的 爸爸 嗎？不，他 不是。'],
  [0, P('grandma'), 'Is she your grandma?', yn('Yes, she is.'), '她 是 你的 奶奶 嗎？是的，她 是。']];

/* 🪤 m12 陷阱 偵測器 [s, 題目, [正解, 陷阱 2], 整句 翻譯, 💡 為什麼]
   🔁 ＝ He’s／His、twelve／twenty（考卷 的 陷阱）；🆕 ＝ she／he／her、-teen／-ty、a／an、Is／Are 的 新 句子 */
const X12 = [[1, 'This is my dad. ___ a farmer.', ['He’s', 'His', 'He'], '這 是 我的 爸爸。他 是 農夫。', 'He’s ＝ He is（他 是）；His ＝ 他的'],
  [1, 'twenty ＝ ?', ['20', '12', '2'], 'twenty ＝ 20', 'twenty ＝ 20；twelve ＝ 12'],
  [0, 'Who’s ___? She’s my mom.', ['she', 'he', 'her'], '她 是 誰？她 是 我的 媽媽。', '媽媽 是 女生 ➜ she；her ＝ 她的'],
  [0, 'fourteen ＝ ?', ['14', '40', '4'], 'fourteen ＝ 14', '-teen ＝ 十幾：fourteen ＝ 14；forty ＝ 40'],
  [0, 'My grandpa is ___ farmer.', ['a', 'an', 'is'], '我的 爺爺 是 一位 農夫。', 'farmer 第一個 音 不是 母音 ➜ a farmer'],
  [0, 'thirteen ＝ ?', ['13', '30', '3'], 'thirteen ＝ 13', '-teen ＝ 十幾：thirteen ＝ 13；thirty ＝ 30'],
  [0, '___ he your brother? Yes, he is.', ['Is', 'Are', 'His'], '他 是 你的 哥哥 嗎？是的，他 是。', '一個 人（he）➜ 用 Is']];

module.exports = { X1, X2, X3, X4, X5, X6, X7, X8, X9, X10, X11, X12, PAS };
