/* g3mid/_pool.js — 📝 三年級 複習 第三十三次 新 題庫（2026-10-28 老師：每一套 200 題）
 *
 * 老師 的 決定（需求檔 第四節 最下面「第三十三次」）：
 *   ① 25／50 題 ＝ 題庫 A 200 題：10 種 遊戲 ✕ 14 題（原本 _exam_data.js 的 8 題 ＋ 這裡 PA 的 6 題）＋ 🧩 中文 拖拖樂 60 題；🔁 類似 60 題（30%）。
 *   ② 新 25／新 50 題 ＝ 題庫 B 200 題：10 種 遊戲 ✕ 14 題（這裡 PB）＋ 🧩 60 題；🔁 類似 100 題（50%）。
 *   🔁 類似 ＝ 考 的 重點 跟 期中考 某一題 一樣，但 字、句子、選項、問法 不一樣（嚴禁 100% 一樣）；🆕 全新 ＝ 考卷 沒有 考 的 字、句子、問法。
 *   🧩 中文 拖拖樂（考卷 沒有 這種 題型 ➜ 算 🆕）：一句 英文，把 中文 方塊 拖到 每一個 英文 字 正下方；一半 多 2 個 錯 的 方塊（3-4 A 50%＋B 50%）。
 *   名字 也 要 拖（3-1 B：中文 格子 ＝ 英文 名字）；isn’t ＝ 不是（3-3 A）；brother ＝ 哥哥、sister ＝ 姊姊（3-2 A）。
 * 格式 跟 _exam_data.js 的 X1～X10 一模一樣（_data.js 照樣 轉）。題目、選項 全 英文（🔒 永久 原則 1）。
 * 人名：題庫 A ＝ Bill Mark Luke Adam Sally Helen Molly Ruby（第二十八次 那一組）；題庫 B ＝ 新 的 一組 Jake Fred Nate Rick Bella Daisy Penny Holly（考卷、課本、舊 題庫 都 沒用過，build 的 LEAK 會 檢查）。 */

var BA = ['Bill', 'Mark', 'Luke', 'Adam'], GA = ['Sally', 'Helen', 'Molly', 'Ruby'];
var BB = ['Jake', 'Fred', 'Nate', 'Rick'], GB = ['Bella', 'Daisy', 'Penny', 'Holly'];
var NUMW = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
var NUMZ = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

/* ════ 題庫 A：再 加 6 題（🔁 3＋🆕 3）════ */
var PA = {
  /* 1 🔨 打地鼠 [s, 單字, 大寫, 誘答 3]：🔁 ＝ 字首 是 考卷 A 那幾組 容易 搞混 的 字母（b d g k h f i e l）；🆕 ＝ 其他 字母 */
  X1: [[1, 'insect', 'I', 'EJY'], [1, 'lion', 'L', 'ITR'], [1, 'fox', 'F', 'VTH'],
    [0, 'cat', 'C', 'KSE'], [0, 'window', 'W', 'VMU'], [0, 'yo-yo', 'Y', 'JIG']],
  /* 2 🟡 小精靈 [s, 唸 的 [[聲音, 英文]], 正解 卡, 誘答, 誘答]：🔁 ＝ 自我介紹 名字＋歲數（考卷 B）；🆕 ＝ 情境 對話 */
  X2: [[1, [['', "Hi, I'm Sally. I'm three years old."]], 'Sally:3', 'Sally:8', 'Ruby:3'],
    [1, [['m', "My name is Adam. I'm seven."]], 'Adam:7', 'Adam:2', 'Luke:7'],
    [1, [['', "Hello, I'm Molly. I'm ten years old."]], 'Molly:10', 'Molly:6', 'Helen:10'],
    [0, [['m', 'Thank you, Ruby.'], ['', "You're welcome, Bill."]], 'thank', 'meet', 'come'],
    [0, [['', 'Good morning, Luke.'], ['m', 'Good morning, Helen.']], 'morn', 'thank', 'help'],
    [0, [['', 'Mark! Come here, please.']], 'come', 'morn', 'meet']],
  /* 3 🧸 夾娃娃 [s, 英文, 正解, 誘答 3]：🔁 ＝ Classroom English（考卷 C 的 重點；考卷 是 排 順序）；🆕 ＝ 聽 單字 夾 圖 */
  X3: [[1, 'Stand up.', 'standup', ['sitdown', 'lineup', 'puthand']], [1, 'Be quiet, please.', 'quiet', ['lineup', 'openbook', 'raisehand']],
    [1, 'Put down your hand.', 'puthand', ['raisehand', 'standup', 'closebook']],
    [0, 'pig', 'w:pig', ['w:bag', 'w:six', 'w:fox']], [0, 'zebra', 'w:zebra', ['w:queen', 'w:up', 'w:hat']], [0, 'kite', 'w:kite', ['w:cat', 'w:vest', 'w:ox']]],
  /* 4 ⛏️ 挖礦 [s, 單字, 大寫]：🔁 ＝ 考卷 A 的 字／容易 搞混 的 字首；🆕 ＝ 其他（考卷 D 的 ant monkey cat lion jet 不考） */
  X4: [[1, 'bag', 'B'], [1, 'egg', 'E'], [1, 'dog', 'D'], [0, 'nose', 'N'], [0, 'pig', 'P'], [0, 'queen', 'Q']],
  /* 5 🪞 魔鏡 [s, 要寫]：🔁 ＝ 考卷 E 的 字母（改 成 聽）；🆕 ＝ 其他 */
  X5: [[1, 'q'], [1, 'J'], [1, 'E'], [0, 'a'], [0, 'M'], [0, 't']],
  /* 6 🧱 金幣磚 [s, 數字, 東西, 情境, 誘答 字母]：🔁 ＝ 數 東西 拼 英文（考卷 F）；🆕 ＝ 🎂 蠟燭、🎲 骰子 */
  X6: [[1, 7, '🍓', '', 'ia'], [1, 9, '⭐', '', 'om'], [1, 2, '🍩', '', 'ea'],
    [0, 3, '🕯️', 'cake', 'ia'], [0, 6, '⚫', 'dice', 'ex'], [0, 4, '⚫', 'dice', 'ea']],
  /* 7 🌱 皮克敏 [s, 句子, 正解, 誘答, 誘答, 中文]：🔁 ＝ 考卷 G 的 考點（years／year、My／I、I am）；🆕 ＝ 其他 */
  X7: [[1, "I'm nine ___ old.", 'years', 'year', 'yes', '我 九 歲。'], [1, 'Hi! ___ name is Mark.', 'My', 'I', 'Me', '嗨！我的 名字 是 Mark。'],
    [1, 'Hello, I ___ Luke.', 'am', 'is', 'are', '哈囉，我 是 Luke。'],
    [0, "What's your ___?", 'name', 'old', 'years', '你 叫 什麼 名字？'], [0, 'Good ___, Luke.', 'morning', 'name', 'welcome', '早安，Luke。'],
    [0, 'Nice to meet ___.', 'you', 'your', 'my', '很 高興 認識 你。']],
  /* 8 ⚔️ 擂台 [s, rev, 反派 那一句, 正解, 誘答 3, 中文 [反派, 正解]]：🔁 ＝ 考卷 H 的 重點；🆕 ＝ 早安、反過來 問 */
  X8: [[1, 0, 'Thank you, Helen.', "You're welcome.", ['Good morning.', "I'm Helen.", 'Nice to meet you.'], ['謝謝 你，Helen。', '不客氣。']],
    [1, 0, "Oh no! I can't find my dog.", 'I can help you.', ['Thank you.', "I'm nine.", 'Good morning.'], ['噢 不！我 找不到 我的 狗。', '我 可以 幫 你。']],
    [1, 0, "Hi, I'm Sally. What's your name?", "I'm Bill.", ["I'm ten.", 'Thank you.', 'Good morning.'], ['嗨，我是 Sally。你 叫 什麼 名字？', '我是 Bill。']],
    [0, 1, "You're welcome, Luke.", 'Thank you.', ['How old are you?', 'Good morning.', "What's your name?"], ['不客氣，Luke。', '謝謝 你。']],
    [0, 1, "I'm Luke. I'm seven.", "What's your name? How old are you?", ['Thank you.', 'Good morning.', 'Nice to meet you.'], ['我是 Luke。我 七 歲。', '你 叫 什麼 名字？你 幾 歲？']],
    [0, 0, 'Good morning, Adam.', 'Good morning, Molly.', ["You're welcome.", "I'm seven.", 'Thank you.'], ['早安，Adam。', '早安，Molly。']]],
  /* 9 📋 資料表 [s, [[名字, 歲數, 說法]×3], 空格, [誘答 名字, 誘答 歲數]]：🔁 ＝ 空 的 大多 是 歲數（考卷 I）；🆕 ＝ 空 的 大多 是 名字 */
  X9: [[1, [['Luke', 9, 'B'], ['Ruby', 3, 'A'], ['Adam', 3, 'D']], 'aaa', ['Mark', 6]],
    [1, [['Helen', 6, 'C'], ['Bill', 8, 'A'], ['Sally', 8, 'D']], 'aan', ['Molly', 4]],
    [1, [['Mark', 2, 'A'], ['Molly', 9, 'C'], ['Luke', 9, 'D']], 'naa', ['Ruby', 5]],
    [0, [['Sally', 5, 'B'], ['Adam', 10, 'C'], ['Bill', 10, 'D']], 'nnn', ['Helen', 7]],
    [0, [['Ruby', 8, 'C'], ['Luke', 6, 'B'], ['Molly', 6, 'D']], 'nna', ['Mark', 2]],
    [0, [['Adam', 7, 'A'], ['Helen', 5, 'B'], ['Mark', 5, 'D']], 'ann', ['Sally', 3]]],
  /* 10 🪂 空投 [s, 密碼]：🔁 ＝ 3 個 數字；🆕 ＝ 4 個 數字（0 沒 教 ➜ 不用） */
  X10: [[1, '364'], [1, '715'], [1, '928'], [0, '5172'], [0, '3846'], [0, '8291']]
};

/* ════ 題庫 B（新 25／新 50）：每 種 14 題（🔁 10＋🆕 4）════ */
var PB = {
  X1: [[1, 'four', 'F', 'VTH'], [1, 'five', 'F', 'VEH'], [1, 'fox', 'F', 'VPT'], [1, 'eight', 'E', 'AIO'], [1, 'insect', 'I', 'EJL'],
    [1, 'lion', 'L', 'IRT'], [1, 'bag', 'B', 'PQR'], [1, 'egg', 'E', 'AOU'], [1, 'dog', 'D', 'BPT'], [1, 'kite', 'K', 'CGQ'],
    [0, 'ant', 'A', 'EOU'], [0, 'six', 'S', 'ZCX'], [0, 'ten', 'T', 'DFL'], [0, 'up', 'U', 'OAN']],
  X2: [[1, [['m', "Hello, I'm Jake. I'm eight years old."]], 'Jake:8', 'Jake:3', 'Fred:8'],
    [1, [['', "Hi, I'm Bella. I'm two."]], 'Bella:2', 'Bella:10', 'Daisy:2'],
    [1, [['m', "My name is Fred. I'm five years old."]], 'Fred:5', 'Fred:9', 'Nate:5'],
    [1, [['', "I'm Daisy. I'm nine years old."]], 'Daisy:9', 'Daisy:5', 'Penny:9'],
    [1, [['m', "Hi, my name is Nate. I'm four."]], 'Nate:4', 'Nate:5', 'Rick:4'],
    [1, [['', "Hello, I'm Penny. I'm six years old."]], 'Penny:6', 'Penny:7', 'Holly:6'],
    [1, [['m', "I'm Rick. I'm ten."]], 'Rick:10', 'Rick:2', 'Jake:10'],
    [1, [['', "My name is Holly. I'm seven years old."]], 'Holly:7', 'Holly:8', 'Bella:7'],
    [1, [['m', "Hello, my name is Jake. I'm three."]], 'Jake:3', 'Jake:8', 'Nate:3'],
    [1, [['', "Hi, I'm Daisy. I'm one."]], 'Daisy:1', 'Daisy:7', 'Holly:1'],
    [0, [['m', 'Thank you, Bella.'], ['', "You're welcome, Fred."]], 'thank', 'help', 'morn'],
    [0, [['', 'Hello, Nate. Nice to meet you.'], ['m', 'Nice to meet you, too.']], 'meet', 'come', 'thank'],
    [0, [['m', "I can't find my dog."], ['', 'We can help you, Rick.']], 'help', 'meet', 'come'],
    [0, [['', 'Good morning, Jake.'], ['m', 'Good morning, Penny.']], 'morn', 'help', 'meet']],
  X3: [[1, 'Sit down, please.', 'sitdown', ['standup', 'quiet', 'puthand']], [1, 'Stand up, please.', 'standup', ['sitdown', 'raisehand', 'closebook']],
    [1, 'Open your book, please.', 'openbook', ['closebook', 'quiet', 'standup']], [1, 'Close your book, please.', 'closebook', ['openbook', 'lineup', 'raisehand']],
    [1, 'Raise your hand, please.', 'raisehand', ['puthand', 'openbook', 'sitdown']], [1, 'Put down your hand, please.', 'puthand', ['raisehand', 'lineup', 'quiet']],
    [1, 'Line up.', 'lineup', ['quiet', 'standup', 'openbook']], [1, 'Be quiet.', 'quiet', ['lineup', 'closebook', 'sitdown']],
    [1, 'Open your book.', 'openbook', ['raisehand', 'sitdown', 'lineup']], [1, 'Line up, please.', 'lineup', ['standup', 'puthand', 'closebook']],
    [0, 'rabbit', 'w:rabbit', ['w:zebra', 'w:monkey', 'w:egg']], [0, 'window', 'w:window', ['w:vest', 'w:queen', 'w:ten']],
    [0, 'lion', 'w:lion', ['w:fox', 'w:cat', 'w:yo-yo']], [0, 'queen', 'w:queen', ['w:girl', 'w:kite', 'w:pig']]],
  X4: [[1, 'girl', 'G'], [1, 'fish', 'F'], [1, 'kite', 'K'], [1, 'hat', 'H'], [1, 'insect', 'I'], [1, 'fox', 'F'], [1, 'bag', 'B'], [1, 'egg', 'E'], [1, 'dog', 'D'], [1, 'four', 'F'],
    [0, 'ox', 'O'], [0, 'rabbit', 'R'], [0, 'zebra', 'Z'], [0, 'yo-yo', 'Y']],
  X5: [[1, 'G'], [1, 'k'], [1, 'p'], [1, 'Q'], [1, 'j'], [1, 'e'], [1, 'H'], [1, 'Y'], [1, 'P'], [1, 'h'],
    [0, 'b'], [0, 'D'], [0, 'w'], [0, 'F']],
  X6: [[1, 5, '🍎', '', 'ia'], [1, 6, '🚗', '', 'ex'], [1, 1, '🌞', '', 'au'], [1, 10, '🎈', '', 'an'], [1, 2, '🐸', '', 'ea'],
    [1, 7, '🌸', '', 'ia'], [1, 9, '🍪', '', 'eo'], [1, 3, '🐣', '', 'ia'], [1, 8, '🍩', '', 'ae'], [1, 4, '🍇', '', 'ea'],
    [0, 4, '⚫', 'dice', 'ea'], [0, 5, '⚫', 'dice', 'ia'], [0, 6, '⚫', 'dice', 'ex'], [0, 1, '⚫', 'dice', 'au']],
  X7: [[1, "I'm seven ___ old.", 'years', 'year', 'yes', '我 七 歲。'], [1, "I'm three ___ old.", 'years', 'year', 'yes', '我 三 歲。'],
    [1, "I'm four ___ old, too.", 'years', 'year', 'yes', '我 也是 四 歲。'], [1, "Hi, I'm five ___ old.", 'years', 'year', 'yes', '嗨，我 五 歲。'],
    [1, '___ name is Jake.', 'My', 'I', 'Am', '我的 名字 是 Jake。'], [1, 'Hello! ___ name is Daisy.', 'My', 'I', 'Me', '哈囉！我的 名字 是 Daisy。'],
    [1, 'I ___ Bella.', 'am', 'is', 'are', '我 是 Bella。'], [1, "Hi! I ___ Fred. I'm six.", 'am', 'is', 'my', '嗨！我 是 Fred。我 六 歲。'],
    [1, "___ name is Penny. I'm nine.", 'My', 'I', 'You', '我的 名字 是 Penny。我 九 歲。'], [1, "I'm two ___ old.", 'years', 'year', 'yes', '我 兩 歲。'],
    [0, 'Stand ___, please.', 'up', 'open', 'close', '請 起立。'], [0, '___ your book.', 'Open', 'Raise', 'Sit', '打開 你的 書。'],
    [0, 'Nice to ___ you, Bella.', 'meet', 'name', 'old', '很 高興 認識 你，Bella。'], [0, 'Thank ___, Nate.', 'you', 'your', 'I', '謝謝 你，Nate。']],
  X8: [[1, 0, "Hello! What's your name?", "I'm Holly.", ["I'm two.", "You're welcome.", 'Good morning.'], ['哈囉！你 叫 什麼 名字？', '我是 Holly。']],
    [1, 0, 'How old are you, Jake?', "I'm eight.", ["I'm Jake.", 'Thank you.', 'Good morning.'], ['Jake，你 幾 歲？', '我 八 歲。']],
    [1, 0, 'Nice to meet you, Daisy.', 'Nice to meet you, too.', ["You're welcome.", "I'm Daisy.", "I'm three."], ['很 高興 認識 你，Daisy。', '我 也 很 高興 認識 你。']],
    [1, 0, 'Thank you, Fred.', "You're welcome.", ['Nice to meet you.', "I'm Fred.", 'How old are you?'], ['謝謝 你，Fred。', '不客氣。']],
    [1, 0, "Help! I can't find my dog.", 'We can help you.', ["You're welcome.", "I'm ten.", 'Nice to meet you.'], ['救命！我 找不到 我的 狗。', '我們 可以 幫 你。']],
    [1, 0, "Hello, I'm Rick. Nice to meet you.", 'Nice to meet you, too.', ['Thank you.', "I'm five.", 'Good morning.'], ['哈囉，我是 Rick。很 高興 認識 你。', '我 也 很 高興 認識 你。']],
    [1, 0, "Hi, I'm Penny. What's your name?", "I'm Nate.", ["I'm six.", "You're welcome.", 'Thank you.'], ['嗨，我是 Penny。你 叫 什麼 名字？', '我是 Nate。']],
    [1, 0, 'How old are you?', "I'm six years old.", ["I'm Bella.", 'Nice to meet you.', "You're welcome."], ['你 幾 歲？', '我 六 歲。']],
    [1, 1, "I'm nine.", 'How old are you?', ["What's your name?", 'Thank you.', 'Good morning.'], ['我 九 歲。', '你 幾 歲？']],
    [1, 1, 'My name is Holly.', "What's your name?", ['How old are you?', "You're welcome.", 'Nice to meet you.'], ['我的 名字 是 Holly。', '你 叫 什麼 名字？']],
    [0, 0, 'Good morning, Bella.', 'Good morning, Rick.', ['Thank you.', "I'm Bella.", 'How old are you?'], ['早安，Bella。', '早安，Rick。']],
    [0, 1, 'Good morning, Nate.', 'Good morning, Daisy.', ["You're welcome.", "I'm seven.", 'Nice to meet you.'], ['早安，Nate。', '早安，Daisy。']],
    [0, 1, "You're welcome, Jake.", 'Thank you, Penny.', ['Good morning, Penny.', "I'm Penny.", 'How old are you?'], ['不客氣，Jake。', '謝謝 你，Penny。']],
    [0, 1, 'We can help you, Fred.', "I can't find my dog.", ['Thank you.', 'Good morning.', "I'm Fred."], ['我們 可以 幫 你，Fred。', '我 找不到 我的 狗。']]],
  X9: [[1, [['Jake', 4, 'A'], ['Bella', 7, 'B'], ['Rick', 7, 'D']], 'aaa', ['Daisy', 9]],
    [1, [['Daisy', 10, 'C'], ['Fred', 2, 'A'], ['Penny', 2, 'D']], 'aan', ['Nate', 6]],
    [1, [['Nate', 6, 'B'], ['Holly', 9, 'C'], ['Jake', 9, 'D']], 'naa', ['Bella', 3]],
    [1, [['Penny', 3, 'A'], ['Rick', 5, 'C'], ['Daisy', 5, 'D']], 'aaa', ['Fred', 8]],
    [1, [['Fred', 8, 'C'], ['Daisy', 4, 'B'], ['Nate', 4, 'D']], 'ana', ['Holly', 2]],
    [1, [['Holly', 2, 'B'], ['Jake', 10, 'A'], ['Bella', 10, 'D']], 'aaa', ['Penny', 5]],
    [1, [['Rick', 9, 'A'], ['Penny', 8, 'C'], ['Fred', 8, 'D']], 'naa', ['Jake', 4]],
    [1, [['Bella', 5, 'C'], ['Nate', 3, 'A'], ['Holly', 3, 'D']], 'aan', ['Rick', 10]],
    [1, [['Daisy', 7, 'A'], ['Fred', 6, 'B'], ['Jake', 6, 'D']], 'aaa', ['Penny', 1]],
    [1, [['Nate', 1, 'B'], ['Holly', 4, 'C'], ['Penny', 4, 'D']], 'aan', ['Bella', 8]],
    [0, [['Rick', 6, 'C'], ['Bella', 9, 'A'], ['Daisy', 9, 'D']], 'nnn', ['Fred', 5]],
    [0, [['Penny', 10, 'B'], ['Jake', 5, 'C'], ['Nate', 5, 'D']], 'nna', ['Holly', 7]],
    [0, [['Holly', 8, 'A'], ['Rick', 2, 'B'], ['Fred', 2, 'D']], 'nan', ['Daisy', 6]],
    [0, [['Fred', 3, 'C'], ['Daisy', 8, 'A'], ['Bella', 8, 'D']], 'ann', ['Nate', 9]]],
  X10: [[1, '549'], [1, '173'], [1, '682'], [1, '914'], [1, '257'], [1, '738'], [1, '461'], [1, '895'], [1, '326'], [1, '619'],
    [0, '7483'], [0, '2965'], [0, '6138'], [0, '4719']]
};

/* ════ 🧩 中文 拖拖樂 ════
   一題 ＝ 一句（或 一問一答 兩句）：t ＝ [[英文, 中文 方塊]…]（標點 黏 在 前一個 字、不 拖；名字 方塊 ＝ 英文 名字）；
   x ＝ 多 的 2 個 錯 方塊（一半 的 題目 有，3-4 A 50%＋B 50%）；u ＝ 1／2 哪一課；z ＝ 整句 中文。 */
var TOK = {
  "What's": [['What', '什麼'], ["'s", '是']], your: [['your', '你的']], name: [['name', '名字']], My: [['My', '我的']], my: [['my', '我的']], is: [['is', '是']],
  "I'm": [['I', '我'], ["'m", '是']], How: [['How old', '幾歲']], are: [['are', '是']], you: [['you', '你']], years: [['years old', '歲']], Hi: [['Hi', '嗨']], Hello: [['Hello', '哈囉']]
};
var WRONG = ['他', '她', '誰', '不是', '我們', '幾', '名字', '你的', '我的', '是', '十'];
function sent(str) {   /* "What's your name?" ➜ [[What,什麼],['s,是],[your,你的],[name?,名字]] */
  var out = [], w = str.split(' ');
  for (var i = 0; i < w.length; i++) { var x = w[i], m = /^([A-Za-z'’]+)([.,?!]*)$/.exec(x), core = m[1], p = m[2];
    if (core === 'How' && w[i + 1] && /^old/.test(w[i + 1])) { out.push(['How old', '幾歲']); i++; p = /[.,?!]+$/.test(w[i]) ? w[i].replace(/^old/, '') : ''; out[out.length - 1][0] += p; continue; }
    if (core === 'years' && w[i + 1] && /^old/.test(w[i + 1])) { i++; out.push(['years old' + w[i].replace(/^old/, ''), '歲']); continue; }
    var n = NUMW.indexOf(core.toLowerCase());
    if (n > 0) { out.push([x, NUMZ[n]]); continue; }
    if (TOK[core]) { TOK[core].forEach(function (t, j) { out.push([t[0] + (j === TOK[core].length - 1 ? p : ''), t[1]]); }); continue; }
    out.push([x, core]);   /* 名字：方塊 ＝ 英文 名字（3-1 B） */
  }
  return out;
}
var ZH = function (s) {
  return s.replace(/Hi, I'm (\w+)\./g, '嗨，我是 $1。').replace(/Hello, I'm (\w+)\./g, '哈囉，我是 $1。').replace(/Hi, my name is (\w+)\./g, '嗨，我的 名字 是 $1。').replace(/What's your name\?/g, '你 叫 什麼 名字？').replace(/How old are you\?/g, '你 幾 歲？').replace(/My name is (\w+)\./g, '我的 名字 是 $1。')
    .replace(/I'm (\w+) years old\./g, function (a, n) { return '我 ' + NUMZ[NUMW.indexOf(n)] + ' 歲。'; })
    .replace(/I'm (\w+)\./g, function (a, n) { var k = NUMW.indexOf(n); return k > 0 ? '我 ' + NUMZ[k] + ' 歲。' : '我是 ' + n + '。'; })
    .replace(/Hi, I'm (\w+)\./g, '嗨，我是 $1。').replace(/Hello, I'm (\w+)\./g, '哈囉，我是 $1。').replace(/我 二 歲/g, '我 兩 歲').replace(/ (?=[^ ]*$)/, ' ').trim();
};
function dragSet(names, ages, seed) {
  var L = [], k = seed;
  var pick2 = function (ans) { var c = WRONG.filter(function (w) { return ans.indexOf(w) < 0; }); var a = c[k % c.length], b = c[(k * 7 + 3) % c.length]; if (a === b) b = c[(k + 1) % c.length]; k++; return [a, b]; };
  var add = function (u, s) { var t = sent(s), q = { u: u, en: s, t: t, z: ZH(s) }; if (L.length % 2 === 0) q.x = pick2(t.map(function (p) { return p[1]; })); L.push(q); };
  /* Unit 1：What's your name? ／ My name is ___. ／ I'm ___. */
  names.forEach(function (n, i) { add(1, 'My name is ' + n + '.'); add(1, "I'm " + n + '.');
    add(1, i % 2 ? "What's your name? I'm " + n + '.' : "What's your name? My name is " + n + '.'); });
  add(1, "What's your name?"); add(1, "Hi, I'm " + names[0] + ". What's your name?"); add(1, "Hello, I'm " + names[6] + ". What's your name?");
  add(1, 'Hi, my name is ' + names[3] + '.');
  /* Unit 2：How old are you? ／ I'm ___ years old. ／ I'm ___.（one 不用：one years old 不對） */
  ages.forEach(function (a, i) { var w = NUMW[a]; add(2, "I'm " + w + ' years old.'); add(2, "I'm " + w + '.');
    add(2, (i + seed) % 2 ? 'How old are you? I\'m ' + w + '.' : 'How old are you? I\'m ' + w + ' years old.'); });
  add(2, 'How old are you?'); add(2, 'Hi, I\'m ' + names[1] + ". I'm " + NUMW[ages[0]] + '.'); add(2, 'Hello, I\'m ' + names[5] + ". I'm " + NUMW[ages[1]] + ' years old.');
  add(2, 'My name is ' + names[4] + ". I'm " + NUMW[ages[2]] + '.'); add(2, "I'm " + names[7] + ". I'm " + NUMW[ages[3]] + ' years old.');
  return L;
}
/* 題庫 A 60 題：名字 8 ✕ 3＋2 ＝ 26（Unit 1）、歲數 ✕ 3（Unit 2） */
var DA = dragSet(BA.concat(GA), [2, 3, 4, 5, 6, 7, 8, 9, 10], 1);
var DB = dragSet(BB.concat(GB), [10, 9, 8, 7, 6, 5, 4, 3, 2], 2);
/* ZH 的 Hi, I'm ＋ What's 一起 的 句子 補 翻譯 */

module.exports = { BA: BA, GA: GA, BB: BB, GB: GB, PA: PA, PB: PB, DA: DA, DB: DB };
