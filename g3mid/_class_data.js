/* g3mid/_class_data.js — 🏫 三年級 課堂複習 1、2、3（2026-10-26 老師第二十七次 第 1 點）題目「草稿」
 *
 * ⚠ 老師說「對」才做進網站。現在只給預覽頁用（listen/2026-10-26_C31/）。
 * 規則（老師原文）：
 *   ① 跟「三年級 複習」（g3mid）同樣 10 種遊戲類型、全新類似題目；
 *   ② 每一套：30% 跟期中考題相類似（🔁，題型不可以 100% 一樣）、70% 跟期中考題完全不同（🆕）；
 *   ③ 課堂複習 2、3 的題目 ＝ 跟 課堂複習 1 完全不同（也跟 2、3 彼此不同）；
 *   ④ 只能 老師 在學校〔⚡ 現場任務 大螢幕〕開；絕對不可以放在在家複習；成績進老師看板。
 * 🔁 類似 ＝ 考的「重點」跟期中考某一題一樣（同一個字母、同一個句型、同一種情境），但題目、問法、選項、遊戲不一樣。
 * 🆕 全新 ＝ 期中考卷沒有考的字、字母、句子、數字、情境（還是在期中考範圍：Phonics Fun 1～4、Numbers 1～10、Classroom English、Topic 1 New Friends）。
 * 人名：考卷、課本、三年級複習用過的都不用；每一套自己一組名字（_check 會檢查）。
 * 一套 ＝ 10 種遊戲 ✕ 8 題（跟 三年級 複習 一樣 一回 8 題）。每一題第一格 s ＝ 1 ➜ 🔁 類似、0 ➜ 🆕 全新。 */

var NAMES = {
  c1: { b: ['Nick', 'Andy', 'Ted'], g: ['Ella', 'Rose', 'Jill'] },
  c2: { b: ['Paul', 'Kevin', 'Gary'], g: ['Judy', 'Tina', 'Pam'] },
  c3: { b: ['Bob', 'Jim', 'Rex'], g: ['Sue', 'Kim', 'Meg'] }
};
/* 考卷、課本、三年級複習 已經 用過 的 名字（一個 都 不 可以 出現） */
var BAN = ['Mike', 'Emma', 'Wendy', 'Roy', 'Sam', 'Ann', 'Lily', 'Ken', 'Alan', 'Harry',
  'Eric', 'Ryan', 'Ben', 'Tom', 'Max', 'Leo', 'Cody', 'Jack', 'Tim', 'Dan', 'Amy', 'Mia', 'Kate', 'Lucy', 'Ivy', 'Nina', 'Jane', 'Zoe'];

/* ════ 1 🔨 字母 打地鼠：聽 單字 ➜ 敲 第一個 字母（4 隻 地鼠）════
   [s, 單字, 正解, 誘答3, 地鼠 上 寫 大寫(U)／小寫(l)]；考卷 A 的「字＋誘答」（bag-d、girl-k、fish-h、egg-i、kite-l）不出現
   課堂複習 1 ＝ 小寫 地鼠；2 ＝ 大寫 地鼠（敲 大寫 第一個 字母）；3 ＝ 聲音 很像 的 字母（不是 形狀 像） */
var Q1 = {
  c1: [[1, 'bag', 'b', 'pqh', 'l'], [1, 'kite', 'k', 'cgx', 'l'], [0, 'dog', 'd', 'bpq', 'l'], [0, 'pig', 'p', 'bqd', 'l'],
    [0, 'queen', 'q', 'gpy', 'l'], [0, 'nose', 'n', 'mhu', 'l'], [0, 'window', 'w', 'vmu', 'l'], [0, 'zebra', 'z', 'sxc', 'l']],
  c2: [[1, 'girl', 'G', 'CQO', 'U'], [1, 'fish', 'F', 'EPT', 'U'], [0, 'hat', 'H', 'NKA', 'U'], [0, 'jet', 'J', 'ILT', 'U'],
    [0, 'monkey', 'M', 'NWH', 'U'], [0, 'rabbit', 'R', 'PBK', 'U'], [0, 'vest', 'V', 'WYU', 'U'], [0, 'ox', 'O', 'QCD', 'U']],
  c3: [[1, 'egg', 'e', 'aou', 'l'], [0, 'ant', 'a', 'eou', 'l'], [0, 'insect', 'i', 'eya', 'l'], [0, 'up', 'u', 'aoi', 'l'],
    [0, 'cat', 'c', 'sgt', 'l'], [0, 'six', 's', 'zxf', 'l'], [0, 'lion', 'l', 'rni', 'l'], [0, 'ten', 't', 'dfl', 'l']]
};

/* ════ 2 🟡 小精靈 聽句：聽 ➜ 小精靈 走到 對的 卡（名牌＋生日蛋糕 或 情境）════
   [s, 要唸的 [[聲音, 英文]…], 正解卡, 誘答卡, 誘答卡]；卡 ＝ '名字:歲數' 或 情境（thank／meet／help／come／morn）
   🔁 ＝ 聽 自我介紹 找 名字＋歲數（考卷 B 的 重點）；🆕 ＝ 考卷 沒有 的 對話、情境 */
var Q2 = {
  c1: [[1, [['m', "Hi, I'm Nick. I'm six."]], 'Nick:6', 'Nick:7', 'Andy:6'],
    [1, [['', "Hello, I'm Ella. I'm nine."]], 'Ella:9', 'Ella:5', 'Rose:9'],
    [0, [['', "What's your name?"], ['', "My name is Rose. I'm four."]], 'Rose:4', 'Ella:4', 'Jill:4'],
    [0, [['m', 'Thank you.'], ['', "You're welcome."]], 'thank', 'meet', 'morn'],
    [0, [['', 'Good morning, Andy.'], ['m', 'Good morning.']], 'morn', 'come', 'thank'],
    [0, [['m', 'Come here, Ted.']], 'come', 'help', 'meet'],
    [0, [['', "I can't find my dog."], ['m', 'We can help, too.']], 'help', 'thank', 'come'],
    [0, [['m', 'Nice to meet you, Jill.']], 'meet', 'morn', 'help']],
  c2: [[1, [['m', "Hi, I'm Paul. I'm eight years old."]], 'Paul:8', 'Paul:3', 'Kevin:8'],
    [1, [['', "Hello, I'm Judy. I'm ten."]], 'Judy:10', 'Judy:2', 'Tina:10'],
    [1, [['m', "I'm Kevin. I'm seven."]], 'Kevin:7', 'Kevin:9', 'Gary:7'],
    [0, [['m', 'How old are you, Tina?'], ['', "I'm five."]], 'Tina:5', 'Tina:9', 'Pam:5'],
    [0, [['', 'Thank you, Gary.'], ['m', "You're welcome."]], 'thank', 'help', 'morn'],
    [0, [['m', 'Nice to meet you, Pam.'], ['', 'Nice to meet you, too.']], 'meet', 'thank', 'come'],
    [0, [['', 'Hey, Kevin. Come here.']], 'come', 'morn', 'help'],
    [0, [['m', 'Good morning, Judy.']], 'morn', 'meet', 'thank']],
  c3: [[1, [['m', "Hi, I'm Bob. I'm three."]], 'Bob:3', 'Bob:10', 'Jim:3'],
    [1, [['', "My name is Sue. I'm six years old."]], 'Sue:6', 'Sue:7', 'Kim:6'],
    [0, [['m', "What's your name?"], ['', "I'm Meg. I'm two."]], 'Meg:2', 'Kim:2', 'Meg:8'],
    [0, [['m', "I can't find my dog."], ['', 'I can help you, Rex.']], 'help', 'come', 'meet'],
    [0, [['', 'Thank you, Bob.'], ['m', "You're welcome, Kim."]], 'thank', 'morn', 'meet'],
    [0, [['m', 'Good morning, Sue.'], ['', 'Good morning, Jim.']], 'morn', 'thank', 'help'],
    [0, [['', 'Nice to meet you, Rex.'], ['m', 'Nice to meet you, too.']], 'meet', 'come', 'thank'],
    [0, [['m', 'Come here, please.']], 'come', 'meet', 'morn']]
};

/* ════ 3 🧸 教室 夾娃娃：聽 ➜ 夾 對的 照片／圖 ════
   [s, 英文, 正解, 誘答3]；照片 ＝ 老師 的 Classroom English 截圖（k 代號）、圖 ＝ 課本 Phonics 字（w:字）
   🔁 ＝ Classroom English（考卷 C 的 重點，考卷 是 排順序，這裡 是 聽了 夾）；🆕 ＝ 考卷 沒有 的：聽 課本 Phonics 的 字 夾 對的 圖 */
var Q3 = {
  c1: [[1, 'Stand up.', 'standup', ['sitdown', 'raisehand', 'lineup']], [1, 'Open your book.', 'openbook', ['closebook', 'quiet', 'puthand']],
    [1, 'Be quiet, please.', 'quiet', ['lineup', 'standup', 'openbook']],
    [0, 'cat', 'w:cat', ['w:hat', 'w:rabbit', 'w:dog']], [0, 'lion', 'w:lion', ['w:fox', 'w:zebra', 'w:monkey']], [0, 'fox', 'w:fox', ['w:ox', 'w:dog', 'w:lion']],
    [0, 'rabbit', 'w:rabbit', ['w:cat', 'w:pig', 'w:fox']], [0, 'zebra', 'w:zebra', ['w:ox', 'w:monkey', 'w:lion']]],
  c2: [[1, 'Sit down.', 'sitdown', ['standup', 'puthand', 'closebook']], [1, 'Close your book.', 'closebook', ['openbook', 'lineup', 'raisehand']],
    [1, 'Line up, please.', 'lineup', ['quiet', 'sitdown', 'closebook']],
    [0, 'hat', 'w:hat', ['w:cat', 'w:vest', 'w:bag']], [0, 'vest', 'w:vest', ['w:hat', 'w:bag', 'w:window']], [0, 'kite', 'w:kite', ['w:jet', 'w:yo-yo', 'w:window']],
    [0, 'yo-yo', 'w:yo-yo', ['w:kite', 'w:bag', 'w:egg']], [0, 'window', 'w:window', ['w:vest', 'w:jet', 'w:hat']]],
  c3: [[1, 'Raise your hand.', 'raisehand', ['puthand', 'standup', 'openbook']], [1, 'Put down your hand.', 'puthand', ['raisehand', 'sitdown', 'quiet']],
    [0, 'pig', 'w:pig', ['w:ox', 'w:monkey', 'w:egg']], [0, 'ox', 'w:ox', ['w:fox', 'w:pig', 'w:insect']], [0, 'monkey', 'w:monkey', ['w:lion', 'w:queen', 'w:pig']],
    [0, 'insect', 'w:insect', ['w:ant', 'w:fish', 'w:egg']], [0, 'queen', 'w:queen', ['w:girl', 'w:monkey', 'w:insect']], [0, 'girl', 'w:girl', ['w:queen', 'w:egg', 'w:fish']]]
};

/* ════ 4 ⛏️ 挖礦 寫字母：聽 單字 ➜ ① 點 對的 圖 ➜ ② 手指 寫 第一個 字母 ════
   [s, 單字, 要寫 的 字母]；考卷 D（ant monkey cat lion jet，寫 小寫）
   🔁 ＝ 考卷 D 的 字，這裡 改 寫 大寫（題型 不一樣）；🆕 ＝ 考卷 沒有 的 字，寫 小寫 */
var Q4 = {
  c1: [[1, 'cat', 'C'], [1, 'lion', 'L'], [0, 'bag', 'b'], [0, 'dog', 'd'], [0, 'pig', 'p'], [0, 'queen', 'q'], [0, 'girl', 'g'], [0, 'yo-yo', 'y']],
  c2: [[1, 'monkey', 'M'], [1, 'jet', 'J'], [0, 'hat', 'h'], [0, 'kite', 'k'], [0, 'nose', 'n'], [0, 'rabbit', 'r'], [0, 'fish', 'f'], [0, 'window', 'w']],
  c3: [[1, 'ant', 'A'], [0, 'egg', 'e'], [0, 'insect', 'i'], [0, 'ox', 'o'], [0, 'up', 'u'], [0, 'vest', 'v'], [0, 'zebra', 'z'], [0, 'six', 's']]
};

/* ════ 5 🪞 大小寫 魔鏡：看 鏡子 裡 的 字母 ➜ 寫 它 的 另一半 ════
   [s, 鏡子 裡, 要寫]；考卷 E 那 8 組（G→g、k→K、P→p、Q→q、J→j、e→E、h→H、Y→y）不出現
   🔁 ＝ 考卷 E 的 字母 反過來 寫；🆕 ＝ 考卷 沒有 的 18 個 字母，方向 跟「三年級 複習」相反（三年級 複習 沒 考過） */
var Q5 = {
  c1: [[1, 'g', 'G'], [1, 'K', 'k'], [1, 'p', 'P'], [0, 'a', 'A'], [0, 'B', 'b'], [0, 'c', 'C'], [0, 'D', 'd'], [0, 'F', 'f']],
  c2: [[1, 'q', 'Q'], [1, 'E', 'e'], [1, 'H', 'h'], [0, 'i', 'I'], [0, 'L', 'l'], [0, 'm', 'M'], [0, 'N', 'n'], [0, 'o', 'O']],
  c3: [[1, 'j', 'J'], [1, 'y', 'Y'], [0, 'R', 'r'], [0, 's', 'S'], [0, 'T', 't'], [0, 'u', 'U'], [0, 'V', 'v'], [0, 'w', 'W']]
};

/* ════ 6 🧱 數字 金幣磚：數一數 ➜ 敲 字母磚 拼出 英文 ════
   [s, 數字, 東西, 情境]；情境：'' ＝ 數 東西（🔁 考卷 F 看 數字 寫 英文 的 重點）、'cake' ＝ 🎂 蠟燭「I'm ___ years old.」、'hand' ＝ ✋ 手指、'dice' ＝ 🎲 骰子 點數（🆕） */
var Q6 = {
  c1: [[1, 3, '🍎', ''], [1, 5, '⭐', ''], [0, 7, '🕯️', 'cake'], [0, 2, '🕯️', 'cake'], [0, 4, '☝️', 'hand'], [0, 1, '🎲', 'dice'], [0, 9, '🐟', ''], [0, 10, '🪁', '']],
  c2: [[1, 6, '🐞', ''], [1, 8, '🎈', ''], [0, 4, '🕯️', 'cake'], [0, 9, '🕯️', 'cake'], [0, 3, '☝️', 'hand'], [0, 6, '🎲', 'dice'], [0, 2, '🐶', ''], [0, 7, '🦓', '']],
  c3: [[1, 10, '🍓', ''], [1, 1, '🐷', ''], [0, 5, '🕯️', 'cake'], [0, 8, '🕯️', 'cake'], [0, 2, '☝️', 'hand'], [0, 4, '🎲', 'dice'], [1, 6, '🐱', ''], [0, 3, '🥚', '']]
};

/* ════ 7 🌱 皮克敏 搬字：把 扛著 對的 字 的 皮克敏 拖到 空格 ════
   [s, 句子（___ ＝ 空格）, 正解, 誘答, 誘答, 中文]；🔁 ＝ 考卷 G 的 考點（years／year、am／is／are、My／I、too／two／to、You’re／Your），句子 全 新；
   🆕 ＝ 考卷 沒有 的 考點（How、morning、meet、here、Classroom English 的 up／down／book／quiet／hand、can） */
var Q7 = {
  c1: [[1, "I'm five ___ old.", 'years', 'year', 'yes', '我 五 歲。'], [1, 'My name ___ Andy.', 'is', 'am', 'are', '我的 名字 是 Andy。'],
    [0, 'Good ___, Ella.', 'morning', 'meet', 'name', '早安，Ella。'], [0, 'Stand ___.', 'up', 'my', 'is', '起立。'],
    [0, 'Nice to ___ you.', 'meet', 'name', 'old', '很高興 認識 你。'], [0, 'Open your ___.', 'book', 'old', 'name', '打開 你的 書。'],
    [0, 'Come ___, Nick.', 'here', 'old', 'my', 'Nick，過來 這裡。'], [0, '___ old are you, Rose?', 'How', 'What', 'My', 'Rose，你 幾 歲？']],
  c2: [[1, '___ name is Judy.', 'My', 'I', 'Am', '我的 名字 是 Judy。'], [1, 'Nice to meet you, ___.', 'too', 'two', 'to', '我 也 很高興 認識 你。'],
    [1, 'I ___ Paul.', 'am', 'is', 'are', '我 是 Paul。'], [0, 'Thank ___, Tina.', 'you', 'your', 'too', '謝謝 你，Tina。'],
    [0, 'Sit ___, please.', 'down', 'old', 'name', '請 坐下。'], [0, 'We can ___, too.', 'help', 'name', 'old', '我們 也 可以 幫忙。'],
    [0, 'Be ___, please.', 'quiet', 'old', 'name', '請 安靜。'], [0, 'Raise your ___.', 'hand', 'name', 'old', '舉起 你的 手。']],
  c3: [[1, "Thank you. — ___ welcome, Sue.", "You're", 'Your', 'You', '謝謝 你。— 不客氣，Sue。'], [1, "I'm ten ___ old, too.", 'years', 'year', 'yes', '我 也 十 歲。'],
    [0, 'Line ___, please.', 'up', 'name', 'old', '請 排隊。'], [0, 'Close your ___.', 'book', 'name', 'old', '闔上 你的 書。'],
    [0, 'Put ___ your hand.', 'down', 'old', 'name', '放下 你的 手。'], [0, '___ morning, Jim.', 'Good', 'Nice', 'My', '早安，Jim。'],
    [0, 'How ___ are you?', 'old', 'name', 'years', '你 幾 歲？'], [0, 'We ___ help you.', 'can', 'am', 'is', '我們 可以 幫 你。']]
};

/* ════ 8 ⚔️ 英文 對決 擂台：反派 說 一句 ➜ 選 對的 回答（rev ＝ 反派 回答 ➜ 選 他 剛剛 被 問 什麼）════
   [s, rev, 反派 那一句, 正解, 誘答3]；🔁 ＝ 考卷 H 的 重點（問 名字、問 幾歲、謝謝、很高興認識你），句子、人名 全 新；🆕 ＝ 早安、找不到狗、打招呼、反過來 */
var Q8 = {
  c1: [[1, 0, "What's your name?", 'My name is Nick.', ["I'm nine.", 'Thank you.', 'Good morning.']],
    [1, 0, 'How old are you, Ella?', "I'm five years old.", ["I'm Ella.", "You're welcome.", 'Nice to meet you.']],
    [0, 0, 'Good morning, Andy.', 'Good morning.', ["You're welcome.", "I'm six.", 'Nice to meet you, too.']],
    [0, 0, "I can't find my dog.", 'We can help you.', ['Thank you.', "I'm Rose.", 'Good morning.']],
    [0, 0, "Hi, I'm Ted.", "Hi, I'm Jill.", ["I'm eight.", "You're welcome.", 'Thank you.']],
    [0, 1, 'My name is Rose.', "What's your name?", ['How old are you?', 'Thank you.', 'Good morning.']],
    [0, 1, 'Nice to meet you, too.', 'Nice to meet you.', ['Thank you.', 'How old are you?', "I can't find my dog."]],
    [0, 1, "I'm seven.", 'How old are you?', ["What's your name?", 'Nice to meet you.', 'Good morning.']]],
  c2: [[1, 0, 'Thank you, Paul.', "You're welcome.", ['Thank you.', 'Good morning.', "I'm Paul."]],
    [1, 0, 'Nice to meet you, Judy.', 'Nice to meet you, too.', ["You're welcome.", "I'm ten.", 'I can help you.']],
    [1, 0, "Hello. I'm Gary. What's your name?", "I'm Tina.", ["I'm seven.", "You're welcome.", 'Good morning.']],
    [0, 0, 'Good morning, Kevin.', 'Good morning, Pam.', ['Thank you.', "I'm nine.", "You're welcome."]],
    [0, 0, 'We can help you.', 'Thank you.', ["You're welcome.", "I'm six.", 'Good morning.']],
    [0, 1, "I'm eight years old.", 'How old are you?', ["What's your name?", 'Thank you.', 'Nice to meet you.']],
    [0, 1, "I'm Kevin.", "What's your name?", ['How old are you?', 'Good morning.', 'I can help you.']],
    [0, 1, "You're welcome, Judy.", 'Thank you.', ['Nice to meet you.', 'How old are you?', 'Good morning.']]],
  c3: [[1, 0, 'How old are you, Bob?', "I'm ten.", ["I'm Bob.", 'Good morning.', 'Thank you.']],
    [1, 0, "What's your name, please?", "I'm Meg.", ["I'm two.", "You're welcome.", 'Nice to meet you.']],
    [0, 0, "Hi, Sue. I can't find my dog.", 'I can help you.', ["You're welcome.", "I'm Sue.", 'Good morning.']],
    [0, 0, 'Good morning, Rex.', 'Good morning, Kim.', ["I'm Rex.", "You're welcome.", 'How old are you?']],
    [1, 0, 'I can help you, Jim.', 'Thank you.', ['Good morning.', "I'm four.", 'Nice to meet you, too.']],
    [0, 1, 'My name is Jim.', "What's your name?", ['How old are you?', 'Thank you.', 'I can help you.']],
    [0, 1, "I'm three years old.", 'How old are you?', ["What's your name?", 'Good morning.', 'Thank you.']],
    [0, 1, 'Good morning, Meg.', 'Good morning, Bob.', ["You're welcome.", 'Nice to meet you, too.', 'How old are you?']]]
};

/* ════ 9 📋 資料表 小幫手：讀 3 個人 的 自我介紹 ➜ 把 名字、歲數 拖進 資料表 ════
   [s, [[名字, 歲數, 說法]×3], 空格（n 名字／a 歲數）, [誘答 名字, 誘答 歲數]]；說法 A／B／C／D ＝ 三年級 複習 的 4 種
   🔁 ＝ 空 的 大多 是 歲數（考卷 I 讀 證件 填 年齡 的 重點）；🆕 ＝ 空 的 大多 是 名字 */
var Q9 = {
  c1: [[1, [['Nick', 6, 'A'], ['Ella', 9, 'B'], ['Andy', 9, 'D']], 'aan', ['Rose', 5]], [1, [['Jill', 4, 'C'], ['Ted', 7, 'A'], ['Rose', 7, 'D']], 'ana', ['Ella', 2]],
    [0, [['Rose', 8, 'B'], ['Andy', 3, 'C'], ['Ted', 3, 'D']], 'nna', ['Nick', 10]], [0, [['Ella', 10, 'A'], ['Nick', 2, 'B'], ['Jill', 2, 'D']], 'nan', ['Andy', 6]],
    [0, [['Ted', 5, 'C'], ['Jill', 8, 'A'], ['Ella', 8, 'D']], 'ann', ['Rose', 3]], [0, [['Andy', 7, 'B'], ['Rose', 10, 'C'], ['Nick', 10, 'D']], 'nnn', ['Ted', 4]],
    [0, [['Jill', 9, 'A'], ['Nick', 4, 'C'], ['Ted', 4, 'D']], 'nna', ['Ella', 7]], [0, [['Ella', 3, 'B'], ['Ted', 6, 'A'], ['Andy', 6, 'D']], 'nan', ['Jill', 9]]],
  c2: [[1, [['Paul', 8, 'A'], ['Judy', 3, 'C'], ['Gary', 3, 'D']], 'aan', ['Pam', 6]], [1, [['Tina', 10, 'B'], ['Kevin', 5, 'A'], ['Pam', 5, 'D']], 'naa', ['Paul', 2]],
    [0, [['Kevin', 9, 'C'], ['Pam', 2, 'B'], ['Judy', 2, 'D']], 'nnn', ['Gary', 7]], [0, [['Gary', 4, 'A'], ['Tina', 7, 'C'], ['Paul', 7, 'D']], 'nna', ['Judy', 9]],
    [0, [['Pam', 6, 'B'], ['Paul', 10, 'A'], ['Kevin', 10, 'D']], 'nan', ['Tina', 3]], [0, [['Judy', 7, 'C'], ['Gary', 9, 'B'], ['Tina', 9, 'D']], 'ann', ['Kevin', 4]],
    [0, [['Tina', 2, 'A'], ['Kevin', 6, 'C'], ['Gary', 6, 'D']], 'nna', ['Pam', 10]], [0, [['Paul', 5, 'B'], ['Pam', 8, 'C'], ['Judy', 8, 'D']], 'nan', ['Gary', 3]]],
  c3: [[1, [['Bob', 7, 'A'], ['Sue', 4, 'B'], ['Kim', 4, 'D']], 'aan', ['Meg', 9]], [1, [['Meg', 2, 'C'], ['Jim', 10, 'A'], ['Rex', 10, 'D']], 'ana', ['Sue', 6]],
    [0, [['Jim', 3, 'B'], ['Kim', 8, 'C'], ['Sue', 8, 'D']], 'nna', ['Bob', 5]], [0, [['Rex', 9, 'A'], ['Meg', 6, 'B'], ['Bob', 6, 'D']], 'nan', ['Jim', 2]],
    [0, [['Sue', 5, 'C'], ['Rex', 2, 'A'], ['Jim', 2, 'D']], 'ann', ['Kim', 7]], [0, [['Kim', 10, 'B'], ['Bob', 8, 'C'], ['Meg', 8, 'D']], 'nnn', ['Rex', 3]],
    [0, [['Bob', 4, 'A'], ['Jim', 7, 'C'], ['Kim', 7, 'D']], 'nna', ['Sue', 10]], [0, [['Meg', 6, 'B'], ['Sue', 3, 'A'], ['Rex', 3, 'D']], 'nan', ['Bob', 8]]]
};

/* ════ 10 🪂 空投 密碼箱：聽 數字 ➜ 打開 對的 空投箱 ════
   [s, 密碼]；🔁 ＝ 3 個 數字（考卷 鑰匙、車牌、座位 號碼 的 重點）；🆕 ＝ 4 個 數字 的 密碼（三年級 複習 沒有，比較 難）
   三個 箱子 ＝ 同樣 的 數字、不同 的 順序（聽 順序） */
var Q10 = {
  c1: [[1, '483'], [1, '617'], [0, '2951'], [0, '7394'], [0, '5168'], [0, '9247'], [0, '3815'], [0, '6592']],
  c2: [[1, '952'], [1, '274'], [1, '138'], [0, '8416'], [0, '1739'], [0, '4582'], [0, '6213'], [0, '9371']],
  c3: [[1, '365'], [1, '841'], [0, '5928'], [0, '2687'], [0, '7153'], [0, '3459'], [1, '927'], [0, '1576']]
};

var SETS = [['c1', '三年級 課堂複習 1'], ['c2', '三年級 課堂複習 2'], ['c3', '三年級 課堂複習 3']];
module.exports = { SETS: SETS, NAMES: NAMES, BAN: BAN, Q1: Q1, Q2: Q2, Q3: Q3, Q4: Q4, Q5: Q5, Q6: Q6, Q7: Q7, Q8: Q8, Q9: Q9, Q10: Q10 };
