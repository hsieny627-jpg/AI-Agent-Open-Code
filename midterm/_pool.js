/* midterm/_pool.js — 📝 四年級 複習 第三十三次 新 題庫（2026-10-28 老師：每一套 200 題）
 *
 * 老師 的 決定（需求檔 第四節 最下面「第三十三次」）：
 *   ① 25／50 題 ＝ 題庫 A 200 題：12 種 遊戲 ✕ 12 題（原本 _exam_data.js 7 題 ＋ 這裡 PA 5 題）＋ 🔓 句子 解碼 任務 56 題；🔁 類似 60 題（30%）。
 *   ② 新 25／新 50 題 ＝ 題庫 B 200 題：**6 種 全新 遊戲** ✕ 24 題（這裡 NB；設計 先 給 老師 看，同意 才 做）＋ 🧩 56 題；🔁 類似 102 題（51%）。
 *   🔓 句子 解碼 任務 算 🆕（考卷 沒有 這種 題型）；名字 不在 四年級 句子 裡；isn’t ＝ 不是（3-3 A）；brother ＝ 哥哥、sister ＝ 姊姊（3-2 A）。
 * 題目、選項 全 英文（🔒 永久 原則）。人名：題庫 A ＝ Owen Jason Emily Nora（第二十八次）；題庫 B ＝ Ethan Lucas Chloe Olivia（新）。
 * 考卷 原題（C 大題 4 句、E 大題 6 題、F 大題 6 個 字、G 短文、H 家庭樹、D 大題 數字 12 20 18 17）一題 都 不 一樣（_pool_preview.js 會 檢查）。 */
const P = (who, job) => who + (job ? '|' + job : '');

/* ════ 題庫 A：12 種 遊戲 各 再 加 5 題（🔁 3＋🆕 2），格式 跟 _exam_data.js 一樣 ════ */
const PA = {
  X1: [[1, 'pencil', '✏️', '鉛筆'], [1, 'dad', '👨', '爸爸'], [1, 'bus', '🚌', '公車'],   /* 2026-10-28：pin、pat 電腦 聽寫 一直 聽錯（thin、hat）➜ pencil、bus */
    [0, 'banana', '🍌', '香蕉'], [0, 'tomato', '🍅', '番茄']],
  X2: [[1, 'pencil', 'pot'], [1, 'dad', 'tub'], [1, 'bus', 'pencil'], [0, 'banana', 'bird'], [0, 'tomato', 'dinosaur']],
  X3: [[1, 'Is your mom a doctor? Yes, she is.', P('mom', 'doctor'), [P('dad', 'doctor'), P('mom', 'farmer')], '你的 媽媽 是 醫生 嗎？是的，她 是。'],
    [1, 'Is your grandpa a teacher? No, he isn’t. He’s a cook.', P('grandpa', 'cook'), [P('grandpa', 'teacher'), P('dad', 'cook')], '你的 爺爺 是 老師 嗎？不，他 不是。他 是 廚師。'],
    [1, 'Is your sister a farmer? No, she isn’t. She’s a student.', P('sister', 'student'), [P('sister', 'farmer'), P('brother', 'student')], '你的 姊姊 是 農夫 嗎？不，她 不是。她 是 學生。'],
    [0, 'This is my mom. She’s a teacher.', P('mom', 'teacher'), [P('grandma', 'teacher'), P('mom', 'cook')], '這 是 我的 媽媽。她 是 老師。'],
    [0, 'Look! He’s my grandpa. He’s a nurse.', P('grandpa', 'nurse'), [P('brother', 'nurse'), P('grandpa', 'doctor')], '看！他 是 我的 爺爺。他 是 護理師。']],
  X4: [[1, 'Time’s up.', 'timesup', ['hurryup', 'letsgo', 'lightoff'], '時間 到。'], [1, 'Don’t talk.', 'donttalk', ['dontrun', 'homework', 'lighton'], '不要 說話。'],
    [1, 'Let’s go.', 'letsgo', ['timesup', 'dontrun', 'homework'], '我們 走 吧。'],
    [0, 'Come on! Let’s go.', 'letsgo', ['hurryup', 'donttalk', 'lighton'], '快 來！我們 走 吧。'], [0, 'It’s dark. Turn on the light, please.', 'lighton', ['lightoff', 'timesup', 'letsgo'], '好 暗。請 打開 燈。']],
  X5: [[1, 'sixteen', '16', ['60', '6', '17'], 'sixteen ＝ 16'], [1, 'thirteen', '13', ['30', '3', '14'], 'thirteen ＝ 13'], [1, 'nineteen', '19', ['90', '9', '20'], 'nineteen ＝ 19'],
    [0, 'My sister is sixteen.', '16', ['60', '6', '15'], '我的 姊姊 十六 歲。'], [0, 'He’s twelve.', '12', ['20', '2', '11'], '他 十二 歲。']],
  X6: [[1, 'A', 'Who’s he?', ['He’s my brother.', 'She’s my sister.', 'Yes, he is.'], '他 是 誰？➜ 他 是 我的 哥哥。'],
    [1, 'A', 'Is she your mom?', ['Yes, she is.', 'Yes, he is.', 'She’s a nurse.'], '她 是 你的 媽媽 嗎？➜ 是的，她 是。'],
    [1, 'A', 'Is your sister a doctor?', ['No, she isn’t. She’s a cook.', 'No, he isn’t. He’s a cook.', 'Yes, she isn’t.'], '你的 姊姊 是 醫生 嗎？➜ 不，她 不是。她 是 廚師。'],
    [0, 'A', 'Sorry, I’m late.', ['That’s OK. Come in, please.', 'Nice to meet you.', 'Yes, he is.'], '抱歉，我 遲到 了。➜ 沒關係。請 進。'],
    [0, 'B', 'Yes, she is.', ['Is she your grandma?', 'Who’s she?', 'Is he your grandpa?'], '她 是 你的 奶奶 嗎？➜ 是的，她 是。']],
  X7: [[1, 'uncle', '🧔', '叔叔'], [1, 'grandfather', '👴', '爺爺'], [1, 'grandmother', '👵', '奶奶'], [0, 'family', '👨‍👩‍👧‍👦', '家人'], [0, 'seventeen', '17', '十七']],   /* 2026-10-28 放上 網站：brother doctor farmer eighteen 跟「四年級 複習」拼字 一樣 ➜ 換 */
  X8: [[1, 'xowen', 'Owen’s grandpa is ___.', ['a cook', 'a farmer', 'a doctor'], 1], [1, 'xowen', 'Owen’s sister is ___ years old.', ['thirteen', 'thirty', 'three'], 3],
    [0, 'xowen', 'Who’s she? She’s Owen’s ___.', ['sister', 'mom', 'grandma'], 3], [0, 'xowen', 'Emily: Is she a student?　Owen: ___', ['Yes, she is.', 'No, she isn’t.', 'Yes, he is.'], 5],
    [0, 'xowen', 'Who’s he? He’s Owen’s ___.', ['grandpa', 'dad', 'brother'], 1]],
  X9: [[1, 'This is my mother.', 'mom'], [1, 'This is my brother.', 'brother'], [1, 'This is my grandpa.', 'grandpa'],
    [0, 'Who’s she? She’s my grandma. She’s a farmer.', 'grandma'], [0, 'Look! He’s my brother.', 'brother']],
  X10: [[1, 'A: Who’s he? B: ___ my grandpa.', ['He’s', 'His', 'She’s', 'He'], '', '他 是 誰？他 是 我的 爺爺。'],
    [1, 'A: Is she a teacher? B: No, she ___. She’s a doctor.', ['isn’t', 'is', 'not', 'he'], '', '她 是 老師 嗎？不，她 不是。她 是 醫生。'],
    [1, 'A: Is your dad a farmer? B: Yes, ___ is.', ['he', 'she', 'his', 'him'], '', '你的 爸爸 是 農夫 嗎？是的，他 是。'],
    [0, 'A: ___ she? B: She’s my mom.', ['Who’s', 'What’s', 'Is', 'How'], '', '她 是 誰？她 是 我的 媽媽。'],
    [0, 'This is my brother. ___ a student.', ['He’s', 'His', 'She’s', 'He'], '', '這 是 我的 哥哥。他 是 學生。']],
  X11: [[1, P('mom', 'nurse'), 'Is she a nurse?', ['Yes, she is.', 'No, she isn’t.', 'Yes, he is.', 'No, he isn’t.'], '她 是 護理師 嗎？是的，她 是。'],
    [1, P('brother', 'student'), 'Is he a teacher?', ['No, he isn’t.', 'Yes, he is.', 'Yes, she is.', 'No, she isn’t.'], '他 是 老師 嗎？不，他 不是。'],
    [1, P('dad', 'farmer'), 'Is he a farmer?', ['Yes, he is.', 'No, he isn’t.', 'Yes, she is.', 'No, she isn’t.'], '他 是 農夫 嗎？是的，他 是。'],
    [0, P('dad'), 'Who’s he?', ['He’s my dad.', 'He’s my brother.', 'She’s my mom.'], '他 是 誰？他 是 我的 爸爸。'],
    [0, P('sister'), 'Is she your mom?', ['No, she isn’t.', 'Yes, she is.', 'No, he isn’t.', 'Yes, he is.'], '她 是 你的 媽媽 嗎？不，她 不是。']],
  X12: [[1, 'Who’s he? ___ my brother.', ['He’s', 'His', 'Her'], '他 是 誰？他 是 我的 哥哥。', 'He’s ＝ He is（他 是）；His ＝ 他的'],
    [1, 'eighteen ＝ ?', ['18', '80', '8'], 'eighteen ＝ 18', '-teen ＝ 十幾：eighteen ＝ 18；eighty ＝ 80'],
    [1, 'sixteen ＝ ?', ['16', '60', '6'], 'sixteen ＝ 16', '-teen ＝ 十幾：sixteen ＝ 16；sixty ＝ 60'],
    [0, 'Is your mom a nurse? Yes, ___ is.', ['she', 'he', 'her'], '你的 媽媽 是 護理師 嗎？是的，她 是。', '媽媽 是 女生 ➜ she；her ＝ 她的'],
    [0, 'Is she ___ teacher?', ['a', 'an', 'is'], '她 是 一位 老師 嗎？', 'teacher 第一個 音 不是 母音 ➜ a teacher']]
};
/* 題庫 A 第 3 篇 短文（對話）：一次 只 抽 一篇 */
const PASA = {
  xowen: { title: 'My Family', sp: ['Emily', 'Owen', 'Emily', 'Owen', 'Emily', 'Owen'],
    t: ['Owen, who’s he?', 'He’s my grandpa. He’s a cook.', 'Who’s she? Is she your mother?', 'No, she isn’t. She’s my sister. She’s thirteen.', 'Is she a student?', 'Yes, she is.'],
    z: ['Owen，他 是 誰？', '他 是 我的 爺爺。他 是 廚師。', '她 是 誰？她 是 你的 媽媽 嗎？', '不，她 不是。她 是 我的 姊姊。她 十三 歲。', '她 是 學生 嗎？', '是的，她 是。'] }
};

/* ════ 題庫 B（新 25／新 50）：6 種 全新 遊戲 ✕ 24 題 ════ */
const FAMS = { dad: ['he', '爸爸'], mom: ['she', '媽媽'], father: ['he', '爸爸', 'dad'], mother: ['she', '媽媽', 'mom'], brother: ['he', '哥哥'], sister: ['she', '姊姊'],
  grandpa: ['he', '爺爺'], grandma: ['she', '奶奶'], grandfather: ['he', '爺爺', 'grandpa'], grandmother: ['she', '奶奶', 'grandma'] };
const JOBS = { doctor: '醫生', nurse: '護理師', teacher: '老師', cook: '廚師', farmer: '農夫', student: '學生' };
const pic = f => FAMS[f][2] || f;
const HE = f => FAMS[f][0] === 'he';

/* N1 🚀 太空 字首音 射擊（考卷 A＋B）：L ＝ 聽 一個 字 ➜ 射 它 的 第一個 字母（b d p t）；S ＝ 聽 兩個 字 ➜ 第一個 音 一樣 射 ⭕、不一樣 射 ❌ */
const N1 = [[1, 'L', 'pat', '🤚', '輕拍'], [1, 'L', 'pig', '🐷', '豬'], [1, 'L', 'pin', '📌', '大頭針'], [1, 'L', 'pot', '🍲', '鍋子'], [1, 'L', 'ten', '🔟', '十'],
  [1, 'L', 'dip', '🫕', '浸泡'], [1, 'L', 'tip', '✏️', '尖端'], [1, 'L', 'dad', '👨', '爸爸'], [1, 'L', 'top', '🔝', '頂端'],
  [0, 'L', 'dolphin', '🐬', '海豚'], [0, 'L', 'donut', '🍩', '甜甜圈'], [0, 'L', 'potato', '🥔', '馬鈴薯'],
  [1, 'S', 'pat', 'pot'], [1, 'S', 'dip', 'tip'], [1, 'S', 'ten', 'top'], [1, 'S', 'dad', 'den'], [1, 'S', 'pin', 'big'], [1, 'S', 'bat', 'pat'], [1, 'S', 'tub', 'dad'], [1, 'S', 'pig', 'pot'],
  [0, 'S', 'donut', 'dolphin'], [0, 'S', 'potato', 'banana'], [0, 'S', 'tiger', 'table'], [0, 'S', 'bird', 'panda']];

/* N2 🏎️ 聽力 賽車（考卷 C）：聽 對話 ➜ 開進 對 的 那一條 跑道（3 張 圖）[s, 英文, 正解 圖, [誘答 2], 中文] */
const EXAMC = ['Is your brother a teacher? Yes, he is.', 'Is your dad a nurse? No, he isn’t. He’s a doctor.', 'Is your father a cook? No, he isn’t. He’s a farmer.', 'Is your sister a nurse? Yes, she is.',
  'Is your brother a student? Yes, he is.'];
const yes = (f, j) => 'Is your ' + f + ' a ' + j + '? Yes, ' + FAMS[f][0] + ' is.';
const no = (f, j, k) => 'Is your ' + f + ' a ' + j + '? No, ' + FAMS[f][0] + ' isn’t. ' + (HE(f) ? 'He’s' : 'She’s') + ' a ' + k + '.';
const oth = f => ({ dad: 'mom', mom: 'dad', father: 'grandpa', mother: 'grandma', brother: 'sister', sister: 'brother', grandpa: 'dad', grandma: 'mom', grandfather: 'brother', grandmother: 'sister' }[f]);
const N2 = [
  [1, yes('mom', 'nurse'), P('mom', 'nurse'), [P('mom', 'cook'), P('dad', 'nurse')], '你的 媽媽 是 護理師 嗎？是的，她 是。'],
  [1, yes('grandpa', 'farmer'), P('grandpa', 'farmer'), [P('grandpa', 'doctor'), P('grandma', 'farmer')], '你的 爺爺 是 農夫 嗎？是的，他 是。'],
  [1, yes('sister', 'student'), P('sister', 'student'), [P('sister', 'teacher'), P('brother', 'student')], '你的 姊姊 是 學生 嗎？是的，她 是。'],
  [1, yes('father', 'teacher'), P('dad', 'teacher'), [P('dad', 'farmer'), P('mom', 'teacher')], '你的 爸爸 是 老師 嗎？是的，他 是。'],
  [1, yes('grandmother', 'cook'), P('grandma', 'cook'), [P('grandma', 'nurse'), P('grandpa', 'cook')], '你的 奶奶 是 廚師 嗎？是的，她 是。'],
  [1, yes('brother', 'doctor'), P('brother', 'doctor'), [P('brother', 'student'), P('dad', 'doctor')], '你的 哥哥 是 醫生 嗎？是的，他 是。'],
  [1, no('mom', 'teacher', 'doctor'), P('mom', 'doctor'), [P('mom', 'teacher'), P('grandma', 'doctor')], '你的 媽媽 是 老師 嗎？不，她 不是。她 是 醫生。'],
  [1, no('grandpa', 'cook', 'teacher'), P('grandpa', 'teacher'), [P('grandpa', 'cook'), P('dad', 'teacher')], '你的 爺爺 是 廚師 嗎？不，他 不是。他 是 老師。'],
  [1, no('sister', 'cook', 'nurse'), P('sister', 'nurse'), [P('sister', 'cook'), P('mom', 'nurse')], '你的 姊姊 是 廚師 嗎？不，她 不是。她 是 護理師。'],
  [1, no('dad', 'farmer', 'cook'), P('dad', 'cook'), [P('dad', 'farmer'), P('brother', 'cook')], '你的 爸爸 是 農夫 嗎？不，他 不是。他 是 廚師。'],
  [1, no('grandma', 'doctor', 'farmer'), P('grandma', 'farmer'), [P('grandma', 'doctor'), P('mom', 'farmer')], '你的 奶奶 是 醫生 嗎？不，她 不是。她 是 農夫。'],
  [1, no('brother', 'teacher', 'student'), P('brother', 'student'), [P('brother', 'teacher'), P('sister', 'student')], '你的 哥哥 是 老師 嗎？不，他 不是。他 是 學生。'],
  [1, no('mother', 'farmer', 'nurse'), P('mom', 'nurse'), [P('mom', 'farmer'), P('sister', 'nurse')], '你的 媽媽 是 農夫 嗎？不，她 不是。她 是 護理師。'],
  [1, 'Who’s he? He’s my grandfather.', P('grandpa'), [P('dad'), P('brother')], '他 是 誰？他 是 我的 爺爺。'],
  [1, 'Who’s she? She’s my mother.', P('mom'), [P('grandma'), P('sister')], '她 是 誰？她 是 我的 媽媽。'],
  [1, 'Who’s he? He’s my brother.', P('brother'), [P('grandpa'), P('dad')], '他 是 誰？他 是 我的 哥哥。'],
  [1, 'Who’s she? She’s my grandma.', P('grandma'), [P('mom'), P('sister')], '她 是 誰？她 是 我的 奶奶。'],
  [0, 'This is my dad. He’s a nurse.', P('dad', 'nurse'), [P('dad', 'doctor'), P('grandpa', 'nurse')], '這 是 我的 爸爸。他 是 護理師。'],
  [0, 'Look! She’s my sister. She’s a teacher.', P('sister', 'teacher'), [P('sister', 'student'), P('grandma', 'teacher')], '看！她 是 我的 姊姊。她 是 老師。'],
  [0, 'This is my grandma. She’s a doctor.', P('grandma', 'doctor'), [P('grandma', 'cook'), P('mom', 'doctor')], '這 是 我的 奶奶。她 是 醫生。'],
  [0, 'Look! He’s my brother. He’s a cook.', P('brother', 'cook'), [P('brother', 'farmer'), P('grandpa', 'cook')], '看！他 是 我的 哥哥。他 是 廚師。'],
  [0, 'Good morning. This is my mom. She’s a farmer.', P('mom', 'farmer'), [P('mom', 'teacher'), P('sister', 'farmer')], '早安。這 是 我的 媽媽。她 是 農夫。'],
  [0, 'Who’s he? He’s my grandpa. He’s a doctor.', P('grandpa', 'doctor'), [P('dad', 'doctor'), P('grandpa', 'nurse')], '他 是 誰？他 是 我的 爺爺。他 是 醫生。'],
  [0, 'This is my sister. She’s a farmer.', P('sister', 'farmer'), [P('sister', 'nurse'), P('mom', 'farmer')], '這 是 我的 姊姊。她 是 農夫。']];

/* N3 🐍 英文 貪食蛇（考卷 D）：聽 ➜ 蛇 去 吃 對 的 照片／數字 [s, 唸 的, 正解, [誘答 3], 中文]（照片 ＝ 老師 給 的 Classroom English 截圖） */
const N3 = [[1, 'Don’t talk.', 'donttalk', ['dontrun', 'timesup', 'hurryup'], '不要 說話。'], [1, 'Time’s up.', 'timesup', ['letsgo', 'lightoff', 'donttalk'], '時間 到。'],
  [1, 'Turn on the light.', 'lighton', ['lightoff', 'homework', 'letsgo'], '打開 燈。'], [1, 'Let’s go.', 'letsgo', ['hurryup', 'dontrun', 'lighton'], '我們 走 吧。'],
  [1, 'Show me your homework.', 'homework', ['donttalk', 'timesup', 'lightoff'], '給 我 看 你的 作業。'], [1, 'Don’t run.', 'dontrun', ['donttalk', 'letsgo', 'homework'], '不要 跑。'],
  [1, 'Turn off the light.', 'lightoff', ['lighton', 'hurryup', 'timesup'], '關掉 燈。'], [1, 'Hurry up.', 'hurryup', ['letsgo', 'dontrun', 'lightoff'], '快 一點。'],
  [1, 'Hurry up, please.', 'hurryup', ['timesup', 'homework', 'lighton'], '請 快 一點。'], [1, 'Please don’t run.', 'dontrun', ['hurryup', 'lightoff', 'donttalk'], '請 不要 跑。'],
  [1, 'Show me your homework, please.', 'homework', ['letsgo', 'lighton', 'dontrun'], '請 給 我 看 你的 作業。'],
  [0, 'Come on! Let’s go.', 'letsgo', ['timesup', 'donttalk', 'homework'], '快 來！我們 走 吧。'],
  [1, 'eleven', '11', ['7', '17', '12'], 'eleven ＝ 11'], [1, 'thirteen', '13', ['30', '3', '14'], 'thirteen ＝ 13'], [1, 'fourteen', '14', ['40', '4', '15'], 'fourteen ＝ 14'],
  [1, 'fifteen', '15', ['50', '5', '16'], 'fifteen ＝ 15'], [1, 'sixteen', '16', ['60', '6', '19'], 'sixteen ＝ 16'], [1, 'nineteen', '19', ['90', '9', '17'], 'nineteen ＝ 19'],
  [0, 'My brother is thirteen.', '13', ['30', '3', '18'], '我的 哥哥 十三 歲。'], [0, 'She’s fifteen.', '15', ['50', '5', '14'], '她 十五 歲。'],
  [0, 'My grandpa is eighty.', '80', ['18', '8', '70'], '我的 爺爺 八十 歲。'], [0, 'He’s eleven.', '11', ['12', '1', '17'], '他 十一 歲。'],
  [0, 'My sister is fourteen.', '14', ['40', '4', '13'], '我的 姊姊 十四 歲。'], [0, 'I’m twelve.', '12', ['20', '2', '13'], '我 十二 歲。']];

/* N4 🥷 對話 忍者跑酷（2026-10-31 第三十六次 第 2 點：原本 🦘 對話 跳跳樂，老師 說 太 幼稚）（考卷 E）：讀 A 說 的 ➜ 跳 到 B 對 的 回答（rev ＝ 讀 B 的 回答 ➜ 跳 到 A 問 的 那一句）[s, A／B, 那一句, [正解, 誘答 2], 中文] */
const N4 = [[1, 'A', '___ she? — She’s my sister.', ['Who’s', 'What’s', 'Is'], '她 是 誰？她 是 我的 姊姊。'],
  [1, 'A', 'Who’s he?', ['He’s my brother.', 'She’s my sister.', 'Yes, he is.'], '他 是 誰？➜ 他 是 我的 哥哥。'],
  [1, 'A', 'Who’s she?', ['She’s my grandma.', 'He’s my grandpa.', 'No, she isn’t.'], '她 是 誰？➜ 她 是 我的 奶奶。'],
  [1, 'A', 'Is he a farmer?', ['No, he isn’t. He’s a cook.', 'No, she isn’t. She’s a cook.', 'Yes, he isn’t.'], '他 是 農夫 嗎？➜ 不，他 不是。他 是 廚師。'],
  [1, 'A', 'Is she a teacher?', ['Yes, she is.', 'Yes, he is.', 'She’s my mom.'], '她 是 老師 嗎？➜ 是的，她 是。'],
  [1, 'A', 'Is she a nurse?', ['No, she isn’t. She’s a doctor.', 'No, he isn’t. He’s a doctor.', 'Yes, she is. She’s a doctor.'], '她 是 護理師 嗎？➜ 不，她 不是。她 是 醫生。'],
  [1, 'A', 'Good morning. This is my grandpa.', ['Nice to meet you.', 'Thank you.', 'Who’s he?'], '早安。這 是 我的 爺爺。➜ 很 高興 認識 你。'],
  [1, 'A', 'Good morning, Ethan. This is my mom.', ['Nice to meet you.', 'Yes, she is.', 'Sorry, I’m late.'], '早安，Ethan。這 是 我的 媽媽。➜ 很 高興 認識 妳。'],
  [1, 'A', 'Nice to meet you, Chloe.', ['Nice to meet you, too.', 'Thank you.', 'Yes, he is.'], '很 高興 認識 你，Chloe。➜ 我 也 很 高興 認識 你。'],
  [1, 'A', 'Is your sister a student?', ['Yes, she is.', 'Yes, he is.', 'No, he isn’t.'], '你的 姊姊 是 學生 嗎？➜ 是的，她 是。'],
  [1, 'A', 'Is your dad a doctor?', ['Yes, he is.', 'Yes, she is.', 'She’s a doctor.'], '你的 爸爸 是 醫生 嗎？➜ 是的，他 是。'],
  [1, 'A', 'Is your grandma a cook?', ['No, she isn’t. She’s a farmer.', 'No, he isn’t. He’s a farmer.', 'Yes, she isn’t.'], '你的 奶奶 是 廚師 嗎？➜ 不，她 不是。她 是 農夫。'],
  [1, 'A', 'Is he your brother?', ['Yes, he is.', 'Yes, she is.', 'He’s a student.'], '他 是 你的 哥哥 嗎？➜ 是的，他 是。'],
  [1, 'A', 'Is she your mom?', ['No, she isn’t. She’s my sister.', 'No, he isn’t. He’s my brother.', 'Yes, he is.'], '她 是 你的 媽媽 嗎？➜ 不，她 不是。她 是 我的 姊姊。'],
  [1, 'B', 'He’s my dad.', ['Who’s he?', 'Who’s she?', 'Is she your mom?'], '他 是 誰？➜ 他 是 我的 爸爸。'],
  [1, 'B', 'No, she isn’t. She’s a nurse.', ['Is she a teacher?', 'Is he a teacher?', 'Who’s she?'], '她 是 老師 嗎？➜ 不，她 不是。她 是 護理師。'],
  [1, 'B', 'Nice to meet you, too.', ['Nice to meet you.', 'Thank you.', 'Have a seat, please.'], '很 高興 認識 你。➜ 我 也 很 高興 認識 你。'],
  [0, 'A', 'Sorry, I’m late.', ['That’s OK. Come in, please.', 'Nice to meet you, too.', 'Yes, she is.'], '抱歉，我 遲到 了。➜ 沒關係。請 進。'],
  [0, 'A', 'Have a seat, please.', ['Thank you.', 'Sorry, I’m late.', 'Who’s she?'], '請 坐。➜ 謝謝 你。'],
  [0, 'A', 'Come in, please.', ['Thank you.', 'Nice to meet you, too.', 'No, he isn’t.'], '請 進。➜ 謝謝 你。'],
  [0, 'B', 'Thank you.', ['Have a seat, please.', 'Who’s he?', 'Is she your sister?'], '請 坐。➜ 謝謝 你。'],
  [0, 'B', 'That’s OK. Come in, please.', ['Sorry, I’m late.', 'Thank you.', 'Nice to meet you.'], '抱歉，我 遲到 了。➜ 沒關係。請 進。'],
  [0, 'A', 'Who’s she? Is she your grandma?', ['No, she isn’t. She’s my mom.', 'No, he isn’t. He’s my dad.', 'Yes, he is.'], '她 是 誰？她 是 你的 奶奶 嗎？➜ 不，她 不是。她 是 我的 媽媽。'],
  [0, 'B', 'Yes, he is. He’s a teacher.', ['Is he your grandpa?', 'Is she your grandma?', 'Who’s she?'], '他 是 你的 爺爺 嗎？➜ 是的，他 是。他 是 老師。']];

/* N5 🫧 拼字 泡泡龍（考卷 F）：看 圖＋中文 ➜ 射 字母 泡泡 補 空格（給 頭 尾）[s, 字, 圖, 中文]；考卷 F 的 sister father teacher nurse cook twenty 一個 都 不用 */
const N5 = [[1, 'brother', '👦', '哥哥'], [1, 'mother', '👩', '媽媽'], [1, 'grandpa', '👴', '爺爺'], [1, 'grandma', '👵', '奶奶'], [1, 'doctor', '🩺', '醫生'],
  [1, 'farmer', '🌾', '農夫'], [1, 'student', '🎒', '學生'], [1, 'dad', '👨', '爸爸'], [1, 'mom', '👩', '媽媽'], [1, 'sixteen', '16', '十六'], [1, 'seventeen', '17', '十七'],
  [1, 'eighteen', '18', '十八'], [1, 'nineteen', '19', '十九'], [1, 'eleven', '11', '十一'], [1, 'twelve', '12', '十二'], [1, 'thirteen', '13', '十三'], [1, 'fourteen', '14', '十四'],
  [0, 'fifteen', '15', '十五'], [0, 'grandfather', '👴', '爺爺'], [0, 'grandmother', '👵', '奶奶'], [0, 'who', '❓', '誰'], [0, 'seat', '🪑', '座位'], [0, 'light', '💡', '燈'], [0, 'late', '⏰', '遲到的']];

/* N6 🚪 密室 逃脫（考卷 G＋H）：讀 短文 對話 回答 ／ 看 家族樹（有 職業 小圖）點 人 ➜ 開 一道 門
   P ＝ [s, 哪一篇, 問題, [正解, 誘答 2], 證據 在 第幾行]；T ＝ [s, 英文, 正解 的 人]（家族樹：爺爺 農夫、奶奶 廚師、爸爸 醫生、媽媽 老師、哥哥 學生、姊姊 學生） */
const PASB = {
  xethan: { title: 'Who’s He?', sp: ['Chloe', 'Ethan', 'Chloe', 'Ethan', 'Chloe', 'Ethan'],
    t: ['Ethan, who’s he?', 'He’s my grandpa. He’s a doctor.', 'Who’s she? Is she your grandma?', 'No, she isn’t. She’s my sister. She’s sixteen.', 'Is she a student?', 'Yes, she is.'],
    z: ['Ethan，他 是 誰？', '他 是 我的 爺爺。他 是 醫生。', '她 是 誰？她 是 你的 奶奶 嗎？', '不，她 不是。她 是 我的 姊姊。她 十六 歲。', '她 是 學生 嗎？', '是的，她 是。'] },
  xolivia: { title: 'Good Morning, Olivia', sp: ['Lucas', 'Olivia', 'Lucas', 'Olivia', 'Lucas', 'Olivia'],
    t: ['Good morning, Olivia. Who’s she?', 'Good morning, Lucas. She’s my mom. She’s a cook.', 'Who’s he? Is he your brother?', 'No, he isn’t. He’s my dad.', 'Is he a farmer?', 'Yes, he is.'],
    z: ['早安，Olivia。她 是 誰？', '早安，Lucas。她 是 我的 媽媽。她 是 廚師。', '他 是 誰？他 是 你的 哥哥 嗎？', '不，他 不是。他 是 我的 爸爸。', '他 是 農夫 嗎？', '是的，他 是。'] }
};
const N6 = [[1, 'P', 'xethan', 'Ethan’s grandpa is ___.', ['a doctor', 'a cook', 'a nurse'], 1], [1, 'P', 'xethan', 'Who’s he? He’s Ethan’s ___.', ['grandpa', 'dad', 'brother'], 1],
  [1, 'P', 'xethan', 'Chloe: Is she your grandma?　Ethan: ___', ['No, she isn’t.', 'Yes, she is.', 'No, he isn’t.'], 3], [1, 'P', 'xethan', 'Ethan’s sister is ___ years old.', ['sixteen', 'sixty', 'six'], 3],
  [1, 'P', 'xethan', 'Ethan’s sister is ___.', ['a student', 'a teacher', 'a farmer'], 5], [1, 'P', 'xethan', 'Who’s she? She’s Ethan’s ___.', ['sister', 'mom', 'grandma'], 3],
  [1, 'P', 'xolivia', 'Olivia’s mom is ___.', ['a cook', 'a nurse', 'a farmer'], 1], [1, 'P', 'xolivia', 'Who’s she? She’s Olivia’s ___.', ['mom', 'sister', 'grandma'], 1],
  [1, 'P', 'xolivia', 'Lucas: Is he your brother?　Olivia: ___', ['No, he isn’t.', 'Yes, he is.', 'No, she isn’t.'], 3], [1, 'P', 'xolivia', 'Who’s he? He’s Olivia’s ___.', ['dad', 'brother', 'grandpa'], 3],
  [1, 'P', 'xolivia', 'Olivia’s dad is ___.', ['a farmer', 'a cook', 'a doctor'], 5], [1, 'P', 'xolivia', 'Lucas: Is he a farmer?　Olivia: ___', ['Yes, he is.', 'No, he isn’t.', 'Yes, she is.'], 5],
  [1, 'T', 'Look! She’s my grandmother.', 'grandma'], [1, 'T', 'This is my dad.', 'dad'], [1, 'T', 'He’s my brother. He’s eleven.', 'brother'], [1, 'T', 'She’s my mom.', 'mom'], [1, 'T', 'This is my sister.', 'sister'],
  [0, 'T', 'He’s a farmer. Who’s he?', 'grandpa'], [0, 'T', 'She’s a teacher. Who’s she?', 'mom'], [0, 'T', 'He’s a doctor. Who’s he?', 'dad'], [0, 'T', 'She’s a cook. Who’s she?', 'grandma'],
  [0, 'T', 'He’s a student. Who’s he?', 'brother'], [0, 'T', 'She’s my sister. Is she a student? Yes, she is.', 'sister'], [0, 'T', 'He’s my grandpa. Is he a farmer? Yes, he is.', 'grandpa']];
const NB = { N1, N2, N3, N4, N5, N6 };
const NGAME = [
  { id: 'n1', ic: '🚀', nm: '字首音 太空 射擊', ex: 'A＋B 聽 字首音、聲音 一樣 嗎', how: '太空船 在 下面 左右 移動；隕石 上 寫 b d p t（或 ⭕ ❌）一顆一顆 飛下來；聽 到 字 ➜ 對準 對 的 隕石 按〔🔥 發射〕。打中 ＝ 爆炸＋能量 條 變長；打錯 ＝ 隕石 撞 過來 防護罩 閃。', fun: '🔥 連對 ＝ 雷射 變 粗、變 雙發；每 4 關 👾 外星 母艦 魔王' },
  { id: 'n2', ic: '🏎️', nm: '聽力 賽車', ex: 'C 聽 對話 勾 圖', how: '賽車 往前 衝，前面 3 條 跑道 各 有 一個 拱門（家人＋職業 圖）；聽 對話 ➜ 手指 左右 滑（或 按 ◀ ▶）開進 對 的 拱門。對 ＝ 加速 火焰＋名次 往前；錯 ＝ 撞到 三角錐 轉 一圈。', fun: '每關 一條 賽道（城市、沙漠、雪地…）；🆚 兩人 一台 ＝ 上下 兩條 賽道 比 誰 先 到' },
  { id: 'n3', ic: '🐍', nm: '英文 貪食蛇', ex: 'D 聽 教室 英文、數字', how: '格子 地圖 上 有 4 個 果實（照片 或 數字）；聽 一句 ➜ 用 方向 鍵（或 手指 滑）讓 蛇 去 吃 對 的 那一個（不 可以 撞到 自己 和 牆，撞到 ＝ 回到 中間、不算 錯）。吃 對 ＝ 蛇 變長 一節；吃 錯 ＝ 答錯頁。', fun: '蛇 愈 長 愈 帥（換 顏色、長 皇冠）；12 20 這種 容易 聽錯 的 數字 放 在 一起' },
  { id: 'n4', ic: '🥷', nm: '對話 忍者跑酷', ex: 'E 讀 對話 選 回答', how: '小人 站 在 雲 上，上面 3 朵 雲 寫 3 個 回答；讀 A 說 的 話 ➜ 點 對 的 雲，小人 跳 上去 往 高處 爬。對 ＝ 跳 上 去＋彈簧；錯 ＝ 雲 破掉 掉 回 原處。', fun: '爬 到 頂 ＝ 摘 星星；高度 尺 一直 往上（像 Doodle Jump）' },
  { id: 'n5', ic: '🫧', nm: '拼字 泡泡龍', ex: 'F 看圖 寫 單字', how: '上面 一個 字 有 空格（例 b _ _ _ _ e r）；下面 發射台 一顆一顆 字母 泡泡；手指 拖 瞄準線 射到 對 的 空格。母音 紅色、不發音 的 字母 灰色。全部 補完 ＝ 字 唸 一次、泡泡 全部 爆掉。', fun: '一次 補 完 全部 空格 ＝ 彩虹 泡泡 炸彈' },
  { id: 'n6', ic: '🚪', nm: '密室 逃脫', ex: 'G 讀 短文＋H 家庭樹', how: '一間 一間 上鎖 的 房間；讀 牆上 的 對話（或 看 家族樹）➜ 回答 一題 ＝ 拿到 一把 鑰匙 🗝，門 打開 走 到 下一間。答錯 ＝ 警報 燈 閃、答錯頁 指出 證據 在 第 幾 行。', fun: '6 道 門 打開 ＝ 逃出 密室、寶箱 打開' }
];

/* ════ 🔓 句子 解碼 任務（四年級）════ */
const GL4 = { Who: '誰', he: '他', she: '她', He: '他', She: '她', my: '我的', your: '你的', Is: '是', is: '是', a: '一位', Yes: '是的', No: '不', 'isn’t': '不是' };
Object.keys(FAMS).forEach(f => { GL4[f] = FAMS[f][1]; }); Object.keys(JOBS).forEach(j => { GL4[j] = JOBS[j]; });
/* 2026-10-28 第三十三次 老師 第 1 點（🔒 永久）：多 的 錯 方塊 ＝ 跟 某一個 正確 方塊 只 差 一點，不 放 一看 就 知道 錯 的 */
const NEAR4 = { 他: ['她', '他的'], 她: ['他', '她的'], 誰: ['誰的', '什麼'], 是: ['不是', '是的'], 我的: ['你的', '我'], 你的: ['我的', '你'], 一位: ['兩位', '這位'],
  是的: ['不是', '不'], 不: ['是的', '不是'], 不是: ['是', '不'], 爸爸: ['爺爺', '哥哥'], 媽媽: ['奶奶', '姊姊'], 哥哥: ['姊姊', '爸爸'], 姊姊: ['哥哥', '媽媽'],
  爺爺: ['奶奶', '爸爸'], 奶奶: ['爺爺', '媽媽'], 醫生: ['護理師', '老師'], 護理師: ['醫生', '廚師'], 老師: ['學生', '醫生'], 學生: ['老師', '農夫'], 廚師: ['農夫', '護理師'], 農夫: ['廚師', '爸爸'] };
const NPRI4 = ['他', '她', '我的', '你的', '爸爸', '媽媽', '哥哥', '姊姊', '爺爺', '奶奶', '醫生', '護理師', '老師', '學生', '廚師', '農夫', '誰', '是的', '不', '不是', '一位', '是'];
function near4(ans, k) {   /* 先 挑 最 重要 的 那一個 字 的 兩個 相近 字（他 ➜ 她、他的；家人、職業 輪流） */
  let has = NPRI4.filter(z => ans.includes(z)); const top = has.filter(z => NPRI4.indexOf(z) < 16), out = [];
  if (top.length > 1) { const t = top[k % top.length]; has = [t].concat(has.filter(z => z !== t)); }
  has.forEach(z => NEAR4[z].forEach(w => { if (out.length < 2 && !ans.includes(w) && !out.includes(w)) out.push(w); }));
  if (out.length < 2) throw new Error('解碼 任務 找不到 相近 的 錯 方塊：' + ans.join(' '));
  return out;
}
function sent4(s) {
  const out = [];
  s.split(' ').forEach(x => { const m = /^([A-Za-z’]+)([.,?!]*)$/.exec(x), c = m[1], p = m[2];
    if (/’s$/.test(c)) { out.push([c.slice(0, -2), GL4[c.slice(0, -2)]], ['’s' + p, '是']); return; }
    if (!GL4[c]) throw new Error('解碼 任務 沒有 中文：' + c);
    out.push([c + p, GL4[c]]); });
  return out;
}
const zh4 = s => s.split(/(?<=[.?!]) /).map(t => {
  let m;
  if (t === 'Who’s he?') return '他 是 誰？'; if (t === 'Who’s she?') return '她 是 誰？';
  if ((m = /^(He|She)’s my (\w+)\.$/.exec(t))) return (m[1] === 'He' ? '他' : '她') + ' 是 我的 ' + GL4[m[2]] + '。';
  if ((m = /^(He|She)’s a (\w+)\.$/.exec(t))) return (m[1] === 'He' ? '他' : '她') + ' 是 一位 ' + GL4[m[2]] + '。';
  if ((m = /^Is (he|she) a (\w+)\?$/.exec(t))) return (m[1] === 'he' ? '他' : '她') + ' 是 一位 ' + GL4[m[2]] + ' 嗎？';
  if ((m = /^Is (he|she) your (\w+)\?$/.exec(t))) return (m[1] === 'he' ? '他' : '她') + ' 是 你的 ' + GL4[m[2]] + ' 嗎？';
  if ((m = /^Is your (\w+) a (\w+)\?$/.exec(t))) return '你的 ' + GL4[m[1]] + ' 是 一位 ' + GL4[m[2]] + ' 嗎？';
  if ((m = /^Yes, (he|she) is\.$/.exec(t))) return '是的，' + (m[1] === 'he' ? '他' : '她') + ' 是。';
  if ((m = /^No, (he|she) isn’t\.$/.exec(t))) return '不，' + (m[1] === 'he' ? '他' : '她') + ' 不是。';
  throw new Error('解碼 任務 沒有 整句 翻譯：' + t);
}).join(' ');
const MALE = ['father', 'dad', 'brother', 'grandpa', 'grandfather'], FEM = ['mother', 'mom', 'sister', 'grandma', 'grandmother'], JL = Object.keys(JOBS);
const EXAMS = EXAMC.concat(['Who’s he? He’s my dad.', 'Who’s she? She’s my mom.', 'Is she a doctor? No, she isn’t. She’s a farmer.']);
function dragList(lines, seed) {
  let k = seed; const L = [];
  const seen = {};
  lines.forEach((s, i) => { if (EXAMS.indexOf(s) >= 0 || seen[s]) return; seen[s] = 1; const t = sent4(s), q = { u: /^Is |Yes|No/.test(s) && !/your (father|dad|brother|grandpa|grandfather|mother|mom|sister|grandma|grandmother)\?/.test(s) ? 2 : 1, en: s, t, z: zh4(s) };
    if (L.length % 2 === 0) { q.x = near4(t.map(p => p[1]), k); k++; }
    L.push(q); });
  return L;
}
const U1A = ['Who’s he?', 'Who’s she?'].concat(MALE.map(f => 'Who’s he? He’s my ' + f + '.'), FEM.map(f => 'Who’s she? She’s my ' + f + '.'), MALE.map(f => 'He’s my ' + f + '.'), FEM.map(f => 'She’s my ' + f + '.'));
const U2A = [].concat(JL.map(j => 'Is he a ' + j + '? Yes, he is.'), JL.map(j => 'Is she a ' + j + '? Yes, she is.'),
  JL.map((j, i) => 'Is he a ' + j + '? No, he isn’t. He’s a ' + JL[(i + 1) % 6] + '.'), JL.map((j, i) => 'Is he a ' + j + '? No, he isn’t. He’s a ' + JL[(i + 3) % 6] + '.'),
  JL.map((j, i) => 'Is she a ' + j + '? No, she isn’t. She’s a ' + JL[(i + 2) % 6] + '.'), JL.map((j, i) => 'Is she a ' + j + '? No, she isn’t. She’s a ' + JL[(i + 4) % 6] + '.'), ['Is she a farmer? No, she isn’t. She’s a doctor.', 'Is he a cook? No, he isn’t. He’s a nurse.', 'Is she a student? No, she isn’t. She’s a nurse.']);
const U1B = [].concat(MALE.map(f => 'Is he your ' + f + '? Yes, he is.'), FEM.map(f => 'Is she your ' + f + '? Yes, she is.'), MALE.map(f => 'Is he your ' + f + '? No, he isn’t.'), FEM.map(f => 'Is she your ' + f + '? No, she isn’t.'),
  ['Who’s he? Is he your brother?', 'Who’s she? Is she your sister?']);
const FAM10 = MALE.concat(FEM), KID = f => f === 'brother' || f === 'sister', JF = (f, n) => { const L = KID(f) ? JL : JL.filter(j => j !== 'student'); return L[n % L.length]; };
const U2B = [].concat(FAM10.map((f, i) => 'Is your ' + f + ' a ' + JF(f, i) + '? Yes, ' + FAMS[f][0] + ' is.'), FAM10.map((f, i) => 'Is your ' + f + ' a ' + JF(f, i + 2) + '? Yes, ' + FAMS[f][0] + ' is.'),
  FAM10.map((f, i) => no(f, JF(f, i + 4), JF(f, i + 1))), FAM10.map((f, i) => no(f, JF(f, i + 3), JF(f, i + 6))));
const DA = dragList(U1A.concat(U2A), 1).slice(0, 56);
const DB = dragList(U1B.concat(U2B), 2).slice(0, 56);
/* 「Who’s he? Is he your brother?」的 整句 翻譯 */

module.exports = { PA, PASA, NB, PASB, NGAME, DA, DB, EXAMC, P, sent4, zh4 };
