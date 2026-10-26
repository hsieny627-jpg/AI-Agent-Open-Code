/* g3mid/_exam_data.js — 📝 三年級 複習 25 題／50 題 挑戰 的 題庫（2026-10-26 老師第二十八次 第 1、2 點）
 *
 * 老師原文：題目 30% 和期中考題相似（不可以 100% 一樣）、70% 跟期中考題完全不同；10 個遊戲平均抽 25 題（每題 4 分）／50 題（每題 2 分），
 *   第 1 關玩完直接到第 2 關…一直到第 10 關。
 * 老師的選擇題（全部照建議）：全新出題（跟考卷、「三年級 複習」、課堂複習 1～3 草稿都不一樣）、每一次重新抽（保持 30%／70%、每關題數平均）、
 *   大廳最上面〔📝 25 題〕〔📝 50 題〕、要登入、成績進老師看板（100 分制）。
 * 每一種遊戲 8 題：s ＝ 1 ➜ 🔁 類似（考的「重點」跟期中考某一題一樣，但題目、問法、選項、遊戲不一樣）、s ＝ 0 ➜ 🆕 全新（考卷沒有考的字、句子、情境、問法）。
 * 人名：考卷、課本、三年級複習、課堂複習 1～3 用過的都不用（_build.js 的 LEAK 會檢查）。
 * 新的問法（「三年級 複習」、課堂複習都沒有）：打地鼠 敲「大寫」第一個字母、夾娃娃 聽單字 夾圖、挖礦 寫「大寫」第一個字母、
 *   魔鏡 聽 字母 寫（不給看）、金幣磚 🎂 蠟燭／🎲 骰子、空投 4 個數字。 */

var XBOYS = ['Bill', 'Mark', 'Luke', 'Adam'], XGIRLS = ['Sally', 'Helen', 'Molly', 'Ruby'];

/* ════ 1 🔨 打地鼠：聽 單字 ➜ 敲「大寫」第一個 字母 ════ [s, 單字, 正解, 誘答3]
   🔁 ＝ 考卷 A 的 字（bag、egg、kite：聽 字 找 第一個 字母），這裡 敲 大寫、誘答 跟 考卷 不一樣 */
var X1 = [[1, 'bag', 'B', 'PRE'], [1, 'egg', 'E', 'FBL'], [1, 'kite', 'K', 'XRY'],
  [0, 'dog', 'D', 'BOP'], [0, 'nose', 'N', 'MHW'], [0, 'pig', 'P', 'RBF'], [0, 'queen', 'Q', 'OGC'], [0, 'zebra', 'Z', 'NSX']];

/* ════ 2 🟡 小精靈：聽 ➜ 走進 對的 房間 ════ [s, 要唸的 [[聲音, 英文]…], 正解卡, 誘答卡, 誘答卡]；卡 ＝ '名字:歲數' 或 情境
   🔁 ＝ 聽 自我介紹 找 名字＋歲數（考卷 B 的 重點）；🆕 ＝ 謝謝、認識、早安、過來、找狗 的 對話 */
var X2 = [[1, [['m', "Hello, I'm Bill. I'm six years old."]], 'Bill:6', 'Bill:7', 'Mark:6'],
  [1, [['', "Hi, I'm Helen. I'm nine."]], 'Helen:9', 'Helen:5', 'Molly:9'],
  [1, [['m', "My name is Luke. I'm four years old."]], 'Luke:4', 'Luke:5', 'Adam:4'],
  [0, [['', 'Thank you, Mark.'], ['m', "You're welcome, Sally."]], 'thank', 'help', 'meet'],
  [0, [['m', 'Hello, Ruby. Nice to meet you.'], ['', 'Nice to meet you, too.']], 'meet', 'morn', 'thank'],
  [0, [['', 'Good morning, Adam.'], ['m', 'Good morning, Molly.']], 'morn', 'come', 'meet'],
  [0, [['m', 'Ruby! Come here, please.']], 'come', 'help', 'morn'],
  [0, [['m', "I can't find my dog."], ['', 'We can help you, Luke.']], 'help', 'thank', 'come']];

/* ════ 3 🧸 夾娃娃：聽 ➜ 夾 對的 ════ [s, 英文, 正解, 誘答3]；照片 ＝ Classroom English（老師的截圖）、'w:字' ＝ 課本 Phonics 的 圖
   🔁 ＝ Classroom English（考卷 C 的 重點，考卷 是 排順序，這裡 是 聽了 夾）；🆕 ＝ 聽 課本 的 單字 夾 對的 圖 */
var X3 = [[1, 'Sit down.', 'sitdown', ['quiet', 'raisehand', 'openbook']], [1, 'Close your book.', 'closebook', ['standup', 'puthand', 'lineup']],
  [1, 'Raise your hand.', 'raisehand', ['sitdown', 'closebook', 'quiet']],
  [0, 'bag', 'w:bag', ['w:egg', 'w:dog', 'w:jet']], [0, 'fish', 'w:fish', ['w:six', 'w:egg', 'w:ant']], [0, 'jet', 'w:jet', ['w:ten', 'w:dog', 'w:nose']],
  [0, 'nose', 'w:nose', ['w:up', 'w:ant', 'w:fish']], [0, 'egg', 'w:egg', ['w:bag', 'w:ten', 'w:six']]];

/* ════ 4 ⛏️ 挖礦：聽 單字 ➜ ① 點 對的 圖 ➜ ② 手指 寫「大寫」第一個 字母 ════ [s, 單字, 要寫 的 字母]
   🔁 ＝ 考卷 A 的 字（girl、fish、kite 的 第一個 字母），這裡 寫 大寫；🆕 ＝ 其他 字 寫 大寫 */
var X4 = [[1, 'girl', 'G'], [1, 'fish', 'F'], [1, 'kite', 'K'], [0, 'hat', 'H'], [0, 'rabbit', 'R'], [0, 'window', 'W'], [0, 'vest', 'V'], [0, 'insect', 'I']];

/* ════ 5 🪞 魔鏡：🔊 聽 一個 字母（不給 看）➜ 寫 大寫／小寫 ════ [s, 要寫]
   🔁 ＝ 考卷 E 要 寫 的 字母（g、K、y），但是 考卷 是「看」另一半，這裡 是「聽」；🆕 ＝ 其他 字母（b／d 最容易 搞混） */
var X5 = [[1, 'g'], [1, 'K'], [1, 'y'], [0, 'd'], [0, 'B'], [0, 'n'], [0, 'R'], [0, 'u']];

/* ════ 6 🧱 金幣磚：數一數 ➜ 敲 字母磚 拼出 英文 ════ [s, 數字, 東西, 情境, 誘答 字母]
   情境：'' ＝ 數 東西（🔁 考卷 F 看 數字 寫 英文 的 重點）、'cake' ＝ 🎂 蠟燭 I'm ___ years old.、'dice' ＝ 🎲 骰子 的 點（🆕；歲數、點數 都 跟 課堂複習 草稿 不一樣） */
var X6 = [[1, 4, '🐟', '', 'ru'], [1, 8, '🧁', '', 'te'], [1, 3, '🦋', '', 'ia'],
  [0, 6, '🕯️', 'cake', 'ek'], [0, 10, '🕯️', 'cake', 'an'], [0, 5, '⚫', 'dice', 'ia'], [0, 2, '⚫', 'dice', 'ea'], [0, 3, '⚫', 'dice', 'ia']];

/* ════ 7 🌱 皮克敏：把 扛著 對的 字 的 皮克敏 拖到 空格 ════ [s, 句子, 正解, 誘答, 誘答, 中文]
   🔁 ＝ 考卷 G 的 考點（years／year、My／I、too／two／to），句子 全 新；🆕 ＝ Classroom English、your／you、welcome（考卷 沒有） */
var X7 = [[1, "I'm six ___ old.", 'years', 'year', 'yes', '我 六 歲。'], [1, 'Hello! ___ name is Sally.', 'My', 'I', 'Am', '哈囉！我的 名字 是 Sally。'],
  [1, "I'm eight, ___.", 'too', 'two', 'to', '我 也 八 歲。'],
  [0, 'Open ___ book.', 'your', 'you', 'I', '打開 你的 書。'], [0, 'Please ___ down.', 'sit', 'line', 'open', '請 坐下。'],
  [0, '___ your hand.', 'Raise', 'Line', 'Sit', '舉起 你的 手。'], [0, 'We can help ___.', 'you', 'your', 'I', '我們 可以 幫 你。'],
  [0, "Thank you. — You're ___.", 'welcome', 'meet', 'morning', '謝謝 你。— 不客氣。']];

/* ════ 8 ⚔️ 英文 對決 擂台：反派 說 一句 ➜ 選 對的 回答（rev ＝ 反派 回答 ➜ 選 他 剛剛 被 問 什麼）════ [s, rev, 反派 那一句, 正解, 誘答3]
   🔁 ＝ 考卷 H 的 重點（問 名字、問 幾歲、很高興認識你）；🆕 ＝ 早安、反過來 問 */
var X8 = [[1, 0, "Hello! What's your name?", "I'm Ruby.", ["I'm eight.", 'Good morning.', "You're welcome."]],
  [1, 0, 'How old are you, Adam?', "I'm ten years old.", ["I'm Adam.", 'Thank you.', 'Nice to meet you.']],
  [1, 0, 'Nice to meet you, Mark.', 'Nice to meet you, too.', ["I'm six.", "You're welcome.", 'Good morning.']],
  [0, 0, 'Good morning, Sally.', 'Good morning, Luke.', ["I'm Sally.", 'Thank you.', 'How old are you?']],
  [0, 1, "I'm nine.", 'How old are you?', ["What's your name?", 'Good morning.', 'Thank you.']],
  [0, 1, 'My name is Molly.', "What's your name?", ['How old are you?', 'Nice to meet you.', "You're welcome."]],
  [0, 1, 'Good morning, Mark.', 'Good morning, Ruby.', ['Thank you.', 'Nice to meet you.', 'How old are you?']],
  [0, 0, "Hello, I'm Mark.", "Hi, Mark. I'm Ruby.", ["You're welcome.", 'Thank you.', 'How old are you?']]];

/* ════ 9 📋 資料表：讀 3 個人 的 自我介紹 ➜ 把 名字、歲數 拖進 資料表 ════ [s, [[名字, 歲數, 說法]×3], 空格（n 名字／a 歲數）, [誘答 名字, 誘答 歲數]]
   🔁 ＝ 空 的 大多 是 歲數（考卷 I 讀 證件 填 年齡 的 重點）；🆕 ＝ 空 的 大多 是 名字 */
var X9 = [[1, [['Bill', 7, 'A'], ['Helen', 2, 'C'], ['Mark', 2, 'D']], 'aan', ['Ruby', 6]],
  [1, [['Sally', 9, 'B'], ['Luke', 5, 'A'], ['Molly', 5, 'D']], 'aaa', ['Adam', 3]],
  [1, [['Adam', 6, 'C'], ['Ruby', 10, 'B'], ['Bill', 10, 'D']], 'naa', ['Helen', 4]],
  [0, [['Molly', 3, 'A'], ['Mark', 8, 'B'], ['Luke', 8, 'D']], 'nnn', ['Sally', 9]],
  [0, [['Luke', 10, 'C'], ['Sally', 4, 'A'], ['Helen', 4, 'D']], 'nna', ['Bill', 7]],
  [0, [['Ruby', 5, 'B'], ['Adam', 9, 'C'], ['Mark', 9, 'D']], 'nan', ['Molly', 2]],
  [0, [['Helen', 8, 'A'], ['Bill', 3, 'C'], ['Adam', 3, 'D']], 'ann', ['Luke', 10]],
  [0, [['Mark', 4, 'B'], ['Molly', 7, 'A'], ['Ruby', 7, 'D']], 'nnn', ['Bill', 5]]];

/* ════ 10 🪂 空投：聽 數字 ➜ 打開 對的 空投箱（三個 箱子 ＝ 同樣 的 數字、不同 的 順序）════ [s, 密碼]
   🔁 ＝ 3 個 數字（考卷 鑰匙、車牌、座位 號碼 的 重點）；🆕 ＝ 4 個 數字 */
var X10 = [[1, '836'], [1, '491'], [1, '257'], [0, '6183'], [0, '2749'], [0, '9315'], [0, '4826'], [0, '7592']];

module.exports = { XBOYS: XBOYS, XGIRLS: XGIRLS, X1: X1, X2: X2, X3: X3, X4: X4, X5: X5, X6: X6, X7: X7, X8: X8, X9: X9, X10: X10 };
