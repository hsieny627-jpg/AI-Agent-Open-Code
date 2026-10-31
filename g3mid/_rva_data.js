/* g3mid/_rva_data.js — 📝 三年級 複習：每一個 題型（關）前面 的 🎬 秒懂 複習 動畫＋⚡ 突擊 測驗 題庫（2026-10-31 老師 第三十六次 第 1 點）
 * 設計 原則 寫在 g3mid/CLAUDE.md 最上面「🔒 秒懂 複習 動畫＋突擊 測驗」；格式 見 g3mid/_rva_lib.js 最上面。
 * 嚴禁 洩題：考卷 的 名字（BAN）、考卷 的 打地鼠／挖礦／魔鏡 那幾個 字 不 用 在 測驗（build 檢查）；重點 可以 教，但是 句子、字、形式 都 換。
 * 題目、選項 一律 全 英文（中文 只 出現 在 dec 的 中文 方塊 ＝ 跟 🔓 句子 解碼 一樣 的 做法、和 答錯頁）。中文 不 空格（學生 頁面）。 */
const D = require('./_data.js');
const GL = Object.assign({}, D.GL, { bus: '公車', pen: '筆', van: '廂型車', duck: '鴨子', panda: '貓熊', dog: '狗', sit: '坐', fox: '狐狸', queen: '女王', ox: '公牛', hat: '帽子', rabbit: '兔子', window: '窗戶', 'yo-yo': '溜溜球', nose: '鼻子', zebra: '斑馬', one: '一', won: '贏了' });
const PH = { 'how old': '幾歲', 'years old': '歲', "you're welcome": '不客氣', 'good morning': '早安' };
const L = (a, b) => [[a, '大寫'], [b, '小寫']];
const ANI = [
/* 🔓 句子 解碼：What’s your name?／How old are you?／中英 順序／縮寫 */
{ id: 'dc', ic: '🔓', nm: '句子 解碼', sc: [
  { h: '問名字', pic: '📛', en: "What's your name?", z: '你叫什麼名字？', n: '英文先說 What（什麼）；中文「什麼」在後面' },
  { h: '縮寫', pic: '✂️', en: 'What is', en2: "What's", z: 'What is ＝ What’s（什麼是）', n: '’s ＝ is（是）' },
  { h: '問幾歲', pic: '🎂', en: 'How old are you?', z: '你幾歲？', n: 'How old ＝ 幾歲（兩個字一起看）' },
  { h: '說幾歲', pic: '🙋', en: "I'm nine years old.", z: '我九歲。', n: 'years old ＝ 歲；可以省略：I’m nine.' }],
 qz: [
  { at: 2, ty: 'dec', en: 'How old are you?', x: ['歲', '老的'], z: '你幾歲？', why: 'How old ＝ 幾歲（問別人）；years old 才是「歲」' },
  { at: 3, ty: 'dec', en: "I'm ten years old.", x: ['幾歲', '年'], z: '我十歲。', why: 'years old ＝ 歲（說自己）；How old ＝ 幾歲（問別人）' },
  { at: 0, ty: 'dec', en: "What's your name?", x: ['我的', '誰'], z: '你叫什麼名字？', why: 'What ＝ 什麼、’s ＝ 是、your ＝ 你的' },
  { at: 1, ty: 'mc', q: "What's ＝ ?", o: ['What is', 'What are', 'What am', 'What I'], en: "What's your name?", z: '你叫什麼名字？', why: 'What’s ＝ What is（’ 藏住了 i）' },
  { at: 3, ty: 'mc', q: "I'm ＝ ?", o: ['I am', 'I is', 'I are', 'I my'], en: "I'm nine years old.", z: '我九歲。', why: 'I’m ＝ I am（’ 藏住了 a）' },
  { at: 2, ty: 'ord', w: ['How', 'old', 'are', 'you?'], en: 'How old are you?', z: '你幾歲？', why: '英文 How old 在最前面；中文「幾歲」在最後面' },
  { at: 0, ty: 'ord', w: ["What's", 'your', 'name?'], x: ['my'], en: "What's your name?", z: '你叫什麼名字？', why: '問別人 ➜ your（你的）' },
  { at: 3, ty: 'spot', w: ["I'm", 'nine', 'year', 'old.'], bad: 2, fix: 'years', en: "I'm nine years old.", z: '我九歲。', why: '九歲 ➜ years old（要有 s）' },
  { at: 2, ty: 'spot', w: ['How', 'old', 'is', 'you?'], bad: 2, fix: 'are', en: 'How old are you?', z: '你幾歲？', why: 'you 要配 are' },
  { at: 3, ty: 'mc', q: 'How old are you?', o: ["I'm nine.", "I'm Oscar.", "I'm nine year.", 'My nine years old.'], en: "I'm nine.", z: '我九歲。', why: '問 How old（幾歲）➜ 回答數字' },
  { at: 3, ty: 'tf', q: "I'm eight. ＝ I'm eight years old.", ok: true, en: "I'm eight years old.", z: '我八歲。', why: 'years old 可以省略，意思一樣' }] },
/* 🔨 字母 打地鼠：聽 第一個 音 ➜ 第一個 字母；b／d／p／q、f／v 最 容易 搞錯 */
{ id: 'q1', ic: '🔨', nm: '字母 打地鼠', sc: [
  { h: '聽第一個音', pic: '🐶', big: 'd', en: 'dog', z: '狗：第一個字母 d', n: '先聽第一個音 /d/ ➜ 字母 d' },
  { h: 'b 和 d', pic: '🚌', big: 'b', en: 'bus', z: '公車：第一個字母 b', n: 'b 肚子在右邊；d 肚子在左邊' },
  { h: 'p 尾巴往下', pic: '🐷', big: 'p', en: 'pig', z: '豬：第一個字母 p', n: 'p 的尾巴往下掉；b 的棒子往上長' },
  { h: 'f 和 v', pic: '🦊', big: 'f', en: 'fox', z: '狐狸：第一個字母 f', n: 'f、v 都是上牙碰下唇；v 喉嚨會震動，f 不會' }],
 qz: [
  { at: 0, ty: 'hear', s: 'duck', o: ['d', 'b', 't', 'g'], en: 'duck', z: '鴨子', why: 'duck 第一個音 /d/ ➜ d（肚子在左邊）' },
  { at: 1, ty: 'hear', s: 'bus', o: ['b', 'd', 'p', 'v'], en: 'bus', z: '公車', why: 'bus 第一個音 /b/ ➜ b（肚子在右邊）' },
  { at: 2, ty: 'hear', s: 'pen', o: ['p', 'b', 'd', 'q'], en: 'pen', z: '筆', why: 'pen 第一個音 /p/ ➜ p（尾巴往下）' },
  { at: 3, ty: 'hear', s: 'van', o: ['v', 'f', 'b', 'w'], en: 'van', z: '廂型車', why: 'van 第一個音 /v/（喉嚨震動）➜ v' },
  { at: 1, ty: 'mc', q: 'b ➜ ?', o: ['🚌 bus', '🦆 duck', '🐷 pig', '🦊 fox'], en: 'bus', z: '公車', why: 'bus 是 b 開頭' },
  { at: 2, ty: 'mc', q: 'p ➜ ?', o: ['🐼 panda', '🦆 duck', '🚌 bus', '🦊 fox'], en: 'panda', z: '貓熊', why: 'panda 是 p 開頭' },
  { at: 1, ty: 'spot', q: '🐶', w: ['b', 'o', 'g'], bad: 0, fix: 'd', en: 'dog', atk: [['dog', '狗']], z: '狗', why: 'dog 第一個字母是 d，不是 b' },
  { at: 2, ty: 'spot', q: '🐷', w: ['q', 'i', 'g'], bad: 0, fix: 'p', en: 'pig', atk: [['pig', '豬']], z: '豬', why: 'p 的尾巴在左邊；q 的尾巴在右邊' },
  { at: 3, ty: 'tf', q: '🦊 fox ➜ v', ok: false, en: 'fox', z: '狐狸', why: 'fox 第一個音 /f/ ➜ f；v 喉嚨會震動' },
  { at: 1, ty: 'tf', q: '🚌 bus ➜ b', ok: true, en: 'bus', z: '公車', why: 'bus 是 b 開頭' }] },
/* 🟡 小精靈 聽句：自我介紹 ➜ 名字、歲數 */
{ id: 'q2', ic: '🟡', nm: '小精靈 聽句', sc: [
  { h: '說名字', pic: '👦', en: "Hi, I'm Oscar.", v: 'm', z: '嗨，我是 Oscar。', n: 'I’m 後面是名字' },
  { h: '說幾歲', pic: '🎂', en: "I'm nine years old.", v: 'm', z: '我九歲。', n: 'I’m 後面是數字 ➜ 幾歲' },
  { h: 'years old 可以省略', pic: '👧', en: "Hello, I'm Chloe. I'm eight.", z: '哈囉，我是 Chloe。我八歲。', n: 'I’m eight. ＝ I’m eight years old.' },
  { h: '聽兩件事', pic: '👂', en: "I'm Danny. I'm ten.", v: 'm', z: '我是 Danny。我十歲。', n: '👤 聽名字、🎂 聽數字' }],
 qz: [
  { at: 1, ty: 'hear', s: "Hi, I'm Henry. I'm seven.", v: 'm', o: ['Henry · 7', 'Henry · 6', 'Oscar · 7', 'Danny · 7'], en: "Hi, I'm Henry. I'm seven.", z: '嗨，我是 Henry。我七歲。', why: '先聽名字 Henry，再聽數字 seven ＝ 7' },
  { at: 2, ty: 'hear', s: "Hello, I'm Sophie. I'm six years old.", o: ['Sophie · 6', 'Sophie · 7', 'Chloe · 6', 'Sophie · 9'], en: "Hello, I'm Sophie. I'm six years old.", z: '哈囉，我是 Sophie。我六歲。', why: 'six ＝ 6' },
  { at: 3, ty: 'hear', s: "Hi, I'm Felix. I'm ten.", v: 'm', o: ['Felix · 10', 'Felix · 2', 'Henry · 10', 'Felix · 9'], en: "Hi, I'm Felix. I'm ten.", z: '嗨，我是 Felix。我十歲。', why: 'ten ＝ 10（不是 two ＝ 2）' },
  { at: 2, ty: 'mc', q: 'Chloe is ___.', o: ['eight', 'nine', 'ten', 'seven'], en: "Hello, I'm Chloe. I'm eight.", z: '哈囉，我是 Chloe。我八歲。', why: '動畫裡 Chloe 說 I’m eight.（我八歲）' },
  { at: 1, ty: 'mc', q: 'Oscar is ___.', o: ['nine', 'five', 'ten', 'eight'], en: "I'm nine years old.", v: 'm', z: '我九歲。', why: '動畫裡 Oscar 說 I’m nine years old.' },
  { at: 3, ty: 'tf', q: 'Danny is ten.', ok: true, en: "I'm Danny. I'm ten.", v: 'm', z: '我是 Danny。我十歲。', why: 'Danny 說 I’m ten.' },
  { at: 1, ty: 'dec', en: "I'm seven years old.", x: ['幾歲', '年'], z: '我七歲。', why: 'years old ＝ 歲' },
  { at: 0, ty: 'spot', w: ['I', 'is', 'Henry.'], bad: 1, fix: 'am', en: 'I am Henry.', v: 'm', z: '我是 Henry。', why: 'I 要配 am（I am ＝ I’m）' },
  { at: 3, ty: 'ord', w: ["I'm", 'ten', 'years', 'old.'], en: "I'm ten years old.", z: '我十歲。', why: '我 是 十 歲：I’m ➜ ten ➜ years old' },
  { at: 2, ty: 'tf', q: "I'm Chloe. ➜ Chloe is my age.", ok: false, en: "I'm Chloe.", z: '我是 Chloe。', why: 'Chloe 是名字，不是歲數' }] },
/* 🧸 教室 夾娃娃：教室 英語（相反 的 兩句 一起 記）*/
{ id: 'q3', ic: '🧸', nm: '教室 夾娃娃', sc: [
  { h: '起立、坐下', pic: '🧍 🪑', en: 'Stand up.', en2: 'Sit down.', vs: 1, z: '起立。坐下。', n: 'up ＝ 往上、down ＝ 往下' },
  { h: '打開、闔上', pic: '📖 📕', en: 'Open your book.', en2: 'Close your book.', vs: 1, z: '打開你的書。闔上你的書。', n: 'open 和 close 意思相反' },
  { h: '舉手、放下', pic: '🙋 🙇', en: 'Raise your hand.', en2: 'Put down your hand.', vs: 1, z: '舉起你的手。放下你的手。', n: 'raise 往上舉；put down 放下來' },
  { h: '安靜、排隊', pic: '🤫 🚶', en: 'Be quiet, please.', en2: 'Line up, please.', vs: 1, z: '請安靜。請排隊。', n: 'please ＝ 請（有禮貌）' }],
 qz: [
  { at: 0, ty: 'mc', pic: '🪑⬇️', q: '?', o: ['Sit down.', 'Stand up.', 'Sit up.', 'Stand down.'], en: 'Sit down.', z: '坐下。', why: '坐 ＝ sit、往下 ＝ down' },
  { at: 1, ty: 'mc', pic: '📕 ➜ 📖', q: '___ your book.', o: ['Open', 'Close', 'Raise', 'Put'], en: 'Open your book.', z: '打開你的書。', why: '書打開 ＝ open' },
  { at: 1, ty: 'mc', pic: '📖 ➜ 📕', q: '___ your book.', o: ['Close', 'Open', 'Line', 'Stand'], en: 'Close your book.', z: '闔上你的書。', why: '書闔上 ＝ close' },
  { at: 2, ty: 'mc', pic: '🙋', q: '___ your hand.', o: ['Raise', 'Put', 'Open', 'Close'], en: 'Raise your hand.', z: '舉起你的手。', why: '手往上舉 ＝ raise' },
  { at: 1, ty: 'spot', w: ['Open', 'you', 'book.'], bad: 1, fix: 'your', en: 'Open your book.', z: '打開你的書。', why: '你的 ＝ your；you 是「你」' },
  { at: 3, ty: 'spot', w: ['Line', 'down,', 'please.'], bad: 1, fix: 'up,', en: 'Line up, please.', z: '請排隊。', why: '排隊 ＝ line up' },
  { at: 2, ty: 'ord', w: ['Put', 'down', 'your', 'hand.'], en: 'Put down your hand.', z: '放下你的手。', why: 'Put down（放下）➜ your hand（你的手）' },
  { at: 3, ty: 'ord', w: ['Be', 'quiet,', 'please.'], en: 'Be quiet, please.', z: '請安靜。', why: 'please 放在最後面' },
  { at: 0, ty: 'tf', pic: '🧍', q: 'Sit down.', ok: false, en: 'Stand up.', z: '起立。', why: '圖是站起來 ➜ Stand up.' },
  { at: 3, ty: 'tf', pic: '🤫', q: 'Be quiet, please.', ok: true, en: 'Be quiet, please.', z: '請安靜。', why: '🤫 ＝ 安靜' },
  { at: 3, ty: 'hear', s: 'Line up, please.', o: ['🚶🚶🚶', '🤫', '🙋', '📖'], en: 'Line up, please.', z: '請排隊。', why: 'line up ＝ 排成一排' },
  { at: 1, ty: 'dec', en: 'Close your book.', x: ['打開', '我的'], z: '闔上你的書。', why: 'close ＝ 闔上；open 才是打開' }] },
/* ⛏️ 挖礦 寫字母：聽 字 ➜ 找 圖 ➜ 寫 第一個 字母（小寫，頂天、立地、不超線）*/
{ id: 'q4', ic: '⛏️', nm: '挖礦 寫字母', sc: [
  { h: '聽、找圖、寫', pic: '🐷', big: 'p', en: 'pig', z: '豬', n: '聽 pig ➜ 找 🐷 ➜ 寫第一個字母 p' },
  { h: '頂天、立地', pic: '👒', big: 'h', en: 'hat', z: '帽子', n: 'h 頭碰到最上面的線（頂天），腳站在紅線上（立地）' },
  { h: '往下長', pic: '👸', big: 'q', en: 'queen', z: '女王', n: 'q 頭碰中間的線，尾巴碰到最下面的線' },
  { h: '不超線', pic: '🐂', big: 'o', en: 'ox', z: '公牛', n: '小寫 o 住在中間那一層：上碰中間的線、下碰紅線' }],
 qz: [
  { at: 0, ty: 'hear', s: 'rabbit', o: ['r', 'n', 'h', 'l'], en: 'rabbit', z: '兔子', why: 'rabbit 第一個音 /r/ ➜ r' },
  { at: 1, ty: 'hear', s: 'window', o: ['w', 'v', 'm', 'u'], en: 'window', z: '窗戶', why: 'window 第一個音 /w/ ➜ w' },
  { at: 3, ty: 'hear', s: 'zebra', o: ['z', 's', 'x', 'c'], en: 'zebra', z: '斑馬', why: 'zebra 第一個音 /z/ ➜ z' },
  { at: 1, ty: 'mc', q: 'h ➜ ?', o: ['👒 hat', '🐂 ox', '🐷 pig', '🦊 fox'], en: 'hat', z: '帽子', why: 'hat 是 h 開頭' },
  { at: 2, ty: 'tf', q: 'q ➜ 👸 queen', ok: true, en: 'queen', z: '女王', why: 'queen 是 q 開頭' },
  { at: 0, ty: 'tf', q: 'n ➜ 👃 nose', ok: true, en: 'nose', z: '鼻子', why: 'nose 是 n 開頭' },
  { at: 1, ty: 'tf', q: 'v ➜ 🪟 window', ok: false, en: 'window', z: '窗戶', why: 'window 是 w 開頭' },
  { at: 2, ty: 'spot', q: '👸', w: ['p', 'u', 'e', 'e', 'n'], bad: 0, fix: 'q', en: 'queen', atk: [['queen', '女王']], z: '女王', why: 'q 尾巴在右邊；p 尾巴在左邊' },
  { at: 0, ty: 'spot', q: '🐷', w: ['q', 'i', 'g'], bad: 0, fix: 'p', en: 'pig', atk: [['pig', '豬']], z: '豬', why: 'pig 第一個字母 p（尾巴在左邊）' },
  { at: 0, ty: 'ord', pic: '🐷', w: ['p', 'i', 'g'], en: 'pig', atk: [['pig', '豬']], z: '豬', why: 'p ➜ i ➜ g' },
  { at: 3, ty: 'ord', pic: '🦊', w: ['f', 'o', 'x'], en: 'fox', atk: [['fox', '狐狸']], z: '狐狸', why: 'f ➜ o ➜ x' }] },
/* 🪞 大小寫 魔鏡 */
{ id: 'q5', ic: '🪞', nm: '大小寫 魔鏡', sc: [
  { h: '大寫、小寫', big: 'T t', en: 'T t', tk: L('T', 't'), z: 'T 的小寫是 t', n: '名字一樣（都唸 T），樣子不一樣' },
  { h: '只差大小', big: 'C c', en: 'C c', tk: L('C', 'c'), z: 'C 的小寫是 c', n: 'C c、O o、S s、W w：小寫住在中間那一層' },
  { h: '樣子不一樣', big: 'D d', en: 'D d', tk: L('D', 'd'), z: 'D 的小寫是 d', n: 'D d、R r、N n：樣子不一樣，要記' },
  { h: '小心方向', big: 'b d', en: 'B b, D d', tk: [['B', '大寫'], ['b', '小寫'], ['D', '大寫'], ['d', '小寫']], z: 'b 的大寫 B；d 的大寫 D', n: 'b 肚子在右；d 肚子在左' }],
 qz: [
  { at: 2, ty: 'mc', q: 'R ➜ ?', o: ['r', 'n', 'h', 'b'], en: 'R r', atk: L('R', 'r'), z: 'R 的小寫是 r', why: 'R 的小寫 r 只有一個小彎' },
  { at: 3, ty: 'mc', q: 'b ➜ ?', o: ['B', 'D', 'P', 'R'], en: 'B b', atk: L('B', 'b'), z: 'b 的大寫是 B', why: 'b 肚子在右邊 ➜ 大寫 B' },
  { at: 3, ty: 'mc', q: 'd ➜ ?', o: ['D', 'B', 'P', 'O'], en: 'D d', atk: L('D', 'd'), z: 'd 的大寫是 D', why: 'd 肚子在左邊 ➜ 大寫 D' },
  { at: 2, ty: 'mc', q: 'N ➜ ?', o: ['n', 'm', 'h', 'u'], en: 'N n', atk: L('N', 'n'), z: 'N 的小寫是 n', why: 'n 一個拱；m 兩個拱' },
  { at: 1, ty: 'tf', q: 'S ➜ s', ok: true, en: 'S s', atk: L('S', 's'), z: 'S 的小寫是 s', why: 'S 的小寫 s 只是小一號' },
  { at: 3, ty: 'tf', q: 'B ➜ d', ok: false, en: 'B b', atk: L('B', 'b'), z: 'B 的小寫是 b', why: 'B 的小寫是 b（肚子在右邊）' },
  { at: 2, ty: 'spot', w: ['A a', 'B b', 'D b', 'E e'], bad: 2, fix: 'D d', en: 'D d', atk: L('D', 'd'), z: 'D 的小寫是 d', why: 'D 配 d；b 是 B 的小寫' },
  { at: 1, ty: 'spot', w: ['M m', 'S s', 'W m', 'O o'], bad: 2, fix: 'W w', en: 'W w', atk: L('W', 'w'), z: 'W 的小寫是 w', why: 'W 的小寫 w 只是小一號' },
  { at: 3, ty: 'dec', en: 'b d n', tk: [['b', 'B'], ['d', 'D'], ['n', 'N']], x: ['P'], atk: [['b', 'B'], ['d', 'D'], ['n', 'N']], z: 'b ➜ B、d ➜ D、n ➜ N', why: '小寫下面放它的大寫' }] },
/* 🧱 數字 金幣磚：數一數 ➜ 拼 數字 */
{ id: 'q6', ic: '🧱', nm: '數字 金幣磚', sc: [
  { h: '數一數', pic: '🍎🍎🍎', en: 'three', z: '三', n: 'three 有兩個 e' },
  { h: '不發音的 e', pic: '🖐️', en: 'five', z: '五', n: 'five 最後的 e 不發音（灰色）' },
  { h: '都是 s 開頭', pic: '6️⃣ 7️⃣', en: 'six, seven', z: '六、七', n: 'six 一拍；seven 兩拍（sev-en）' },
  { h: '會唸不會寫', pic: '8️⃣', en: 'eight', z: '八', n: 'eight 的 g h 不發音（灰色）' }],
 qz: [
  { at: 0, ty: 'mc', pic: '🍌🍌', q: '?', o: ['two', 'too', 'to', 'ten'], en: 'two', z: '二', why: 'two、too、to 唸起來一樣；數字 2 拼 t-w-o' },
  { at: 1, ty: 'mc', pic: '9️⃣', q: '?', o: ['nine', 'mine', 'line', 'none'], en: 'nine', z: '九', why: 'nine ＝ n-i-n-e' },
  { at: 2, ty: 'spot', pic: '7️⃣', w: ['s', 'e', 'v', 'a', 'n'], bad: 3, fix: 'e', en: 'seven', z: '七', why: 'seven 兩個 e：s-e-v-e-n' },
  { at: 3, ty: 'spot', pic: '🔟', w: ['t', 'i', 'n'], bad: 1, fix: 'e', en: 'ten', z: '十', why: 'ten ＝ t-e-n' },
  { at: 3, ty: 'ord', pic: '8️⃣', w: ['e', 'i', 'g', 'h', 't'], en: 'eight', z: '八', why: 'e-i-g-h-t，g h 不發音' },
  { at: 0, ty: 'ord', pic: '🍎🍎🍎', w: ['t', 'h', 'r', 'e', 'e'], en: 'three', z: '三', why: 't-h-r-e-e，兩個 e' },
  { at: 2, ty: 'tf', pic: '6️⃣', q: 'six', ok: true, en: 'six', z: '六', why: '6 ＝ six' },
  { at: 1, ty: 'tf', pic: '1️⃣', q: 'won', ok: false, en: 'one', z: '一', why: 'one 唸起來像 won，數字 1 拼 o-n-e' },
  { at: 3, ty: 'hear', s: 'four', o: ['4', '5', '9', '2'], en: 'four', z: '四', why: 'four ＝ 4' },
  { at: 2, ty: 'hear', s: 'seven', o: ['7', '6', '1', '11'], en: 'seven', z: '七', why: 'seven ＝ 7（兩拍）' }] },
/* 🌱 皮克敏 搬字：I am、you are、my／your、too */
{ id: 'q7', ic: '🌱', nm: '皮克敏 搬字', sc: [
  { h: 'I 配 am', pic: '🙋', en: 'I am Oscar.', v: 'm', z: '我是 Oscar。', n: 'I 一定配 am（I am ＝ I’m）' },
  { h: 'you 配 are', pic: '👉', en: 'How old are you?', z: '你幾歲？', n: 'you 一定配 are' },
  { h: 'my 和 your', pic: '📛', en: 'My name is Chloe.', z: '我的名字是 Chloe。', n: 'my ＝ 我的、your ＝ 你的；name 配 is' },
  { h: 'too ＝ 也', pic: '🤝', en: 'Nice to meet you, too.', z: '我也很高興認識你。', n: 'too ＝ 也（two ＝ 二）' }],
 qz: [
  { at: 0, ty: 'mc', q: 'I ___ ten.', o: ['am', 'is', 'are', 'be'], en: 'I am ten.', z: '我十歲。', why: 'I 配 am' },
  { at: 2, ty: 'mc', q: '___ name is Henry.', o: ['My', 'I', 'Am', "I'm"], en: 'My name is Henry.', z: '我的名字是 Henry。', why: '我的 ＝ My' },
  { at: 1, ty: 'mc', q: 'How old ___ you?', o: ['are', 'is', 'am', 'be'], en: 'How old are you?', z: '你幾歲？', why: 'you 配 are' },
  { at: 2, ty: 'mc', q: "What's ___ name?", o: ['your', 'you', 'I', "you're"], en: "What's your name?", z: '你叫什麼名字？', why: '你的 ＝ your' },
  { at: 2, ty: 'spot', w: ['My', 'name', 'are', 'Danny.'], bad: 2, fix: 'is', en: 'My name is Danny.', z: '我的名字是 Danny。', why: 'name 配 is' },
  { at: 3, ty: 'spot', w: ['Nice', 'to', 'meet', 'you,', 'two.'], bad: 4, fix: 'too.', en: 'Nice to meet you, too.', z: '我也很高興認識你。', why: '也 ＝ too；two 是數字 2' },
  { at: 2, ty: 'dec', en: 'My name is Sophie.', x: ['你的', '我'], z: '我的名字是 Sophie。', why: 'My ＝ 我的（不是「我」）' },
  { at: 0, ty: 'tf', q: 'I is nine.', ok: false, en: 'I am nine.', z: '我九歲。', why: 'I 配 am' },
  { at: 1, ty: 'tf', q: 'You are ten.', ok: true, en: 'You are ten.', z: '你十歲。', why: 'you 配 are' },
  { at: 2, ty: 'ord', w: ['My', 'name', 'is', 'Felix.'], en: 'My name is Felix.', v: 'm', z: '我的名字是 Felix。', why: '我的 名字 是 Felix' },
  { at: 1, ty: 'hear', s: "I'm eight years old.", o: ["I'm eight years old.", "I'm eight year old.", 'I eight years old.', "I'm eight years."], en: "I'm eight years old.", z: '我八歲。', why: 'years old 要有 s；I’m 不可以少' }] },
/* ⚔️ 英文 對決 擂台：問 ➜ 答 */
{ id: 'q8', ic: '⚔️', nm: '英文 對決 擂台', sc: [
  { h: '問名字 ➜ 說名字', pic: '📛', en: "What's your name?", en2: "I'm Felix.", vs: 1, v2: 'm', z: '你叫什麼名字？我是 Felix。', n: '回答：I’m ＋ 名字' },
  { h: '問幾歲 ➜ 說數字', pic: '🎂', en: 'How old are you?', en2: "I'm seven.", vs: 1, v2: 'm', z: '你幾歲？我七歲。', n: 'How old ➜ 回答數字（不是名字）' },
  { h: '謝謝 ➜ 不客氣', pic: '🎁', en: 'Thank you.', en2: "You're welcome.", vs: 1, v2: 'm', z: '謝謝你。不客氣。', n: 'You’re welcome. ＝ 不客氣' },
  { h: '很高興認識你', pic: '🤝', en: 'Nice to meet you.', en2: 'Nice to meet you, too.', vs: 1, v2: 'm', z: '很高興認識你。我也很高興認識你。', n: '回答要加 too（也）' },
  { h: '我可以幫你', pic: '🐶 ❓', en: "I can't find my dog.", en2: 'I can help you.', vs: 1, v2: 'm', z: '我找不到我的狗。我可以幫你。', n: 'can’t ＝ 不能；can ＝ 可以' }],
 qz: [
  { at: 2, ty: 'mc', q: 'Thank you.', o: ["You're welcome.", 'Thank you, too.', 'Good morning.', "I'm welcome."], en: "You're welcome.", v: 'm', z: '不客氣。', why: '別人說謝謝 ➜ You’re welcome.' },
  { at: 1, ty: 'mc', q: 'How old are you?', o: ["I'm eight.", "I'm Oscar.", "You're eight.", 'Good morning.'], en: "I'm eight.", v: 'm', z: '我八歲。', why: '問幾歲 ➜ 回答數字' },
  { at: 3, ty: 'mc', q: 'Nice to meet you.', o: ['Nice to meet you, too.', 'Nice to meet you, two.', 'Thank you, too.', "You're welcome."], en: 'Nice to meet you, too.', v: 'm', z: '我也很高興認識你。', why: '回答要加 too（也）' },
  { at: 0, ty: 'hear', s: "What's your name?", o: ["I'm Chloe.", "I'm ten.", 'Thank you.', 'Good morning.'], en: "I'm Chloe.", z: '我是 Chloe。', why: '問名字 ➜ I’m ＋ 名字' },
  { at: 3, ty: 'hear', s: 'Good morning.', o: ['Good morning.', 'Thank you.', "You're welcome.", 'I can help you.'], en: 'Good morning.', v: 'm', z: '早安。', why: '別人說早安 ➜ 也說 Good morning.' },
  { at: 1, ty: 'tf', q: "How old are you? — I'm Henry.", ok: false, en: "How old are you? I'm nine.", z: '你幾歲？我九歲。', why: '問幾歲要回答數字' },
  { at: 4, ty: 'tf', q: "I can't find my dog. — I can help you.", ok: true, en: "I can't find my dog. I can help you.", z: '我找不到我的狗。我可以幫你。', why: '找不到 ➜ 我可以幫你' },
  { at: 4, ty: 'ord', w: ['I', 'can', 'help', 'you.'], en: 'I can help you.', v: 'm', z: '我可以幫你。', why: '我 可以 幫 你' },
  { at: 2, ty: 'spot', w: ['Your', 'welcome.'], bad: 0, fix: "You're", en: "You're welcome.", v: 'm', z: '不客氣。', why: 'You’re ＝ You are；Your 是「你的」' },
  { at: 4, ty: 'dec', en: "I can't find my dog.", x: ['可以', '你的'], z: '我找不到我的狗。', why: 'can’t ＝ 不能；my ＝ 我的' }] },
/* 📋 資料表 小幫手：讀 自我介紹 ➜ 名字、歲數 填 表 */
{ id: 'q9', ic: '📋', nm: '資料表 小幫手', sc: [
  { h: '找名字', pic: '📋', en: 'My name is Henry.', v: 'm', z: '我的名字是 Henry。', n: 'name 後面 ➜ 填在 Name' },
  { h: '找歲數', pic: '🎂', en: "I'm nine years old.", v: 'm', z: '我九歲。', n: 'years old 前面的數字 ➜ 填在 Age' },
  { h: 'too ＝ 一樣', pic: '👫', en: "I'm nine, too.", z: '我也九歲。', n: 'too ＝ 也：跟前面的人一樣大' },
  { h: '對照表格', pic: '🧾', en: 'Chloe is ten.', z: 'Chloe 十歲。', n: '先找名字，再往右找 Age' }],
 qz: [
  { at: 1, ty: 'mc', q: "I'm Danny. I'm ten. ➜ Age?", o: ['10', '9', '2', 'Danny'], en: "I'm Danny. I'm ten.", v: 'm', z: '我是 Danny。我十歲。', why: 'ten ＝ 10 ➜ 填在 Age' },
  { at: 0, ty: 'mc', q: "Hi, I'm Sophie. I'm eight years old. ➜ Name?", o: ['Sophie', '8', 'Chloe', 'Old'], en: "Hi, I'm Sophie. I'm eight years old.", z: '嗨，我是 Sophie。我八歲。', why: 'I’m 後面的 Sophie ＝ 名字' },
  { at: 2, ty: 'mc', q: "I'm nine, too. ➜ Age?", o: ['9', '10', '2', '8'], en: "I'm nine, too.", z: '我也九歲。', why: 'too ＝ 也，一樣是 9 歲' },
  { at: 3, ty: 'tf', q: 'Chloe is ten. ➜ Age: 10', ok: true, en: 'Chloe is ten.', z: 'Chloe 十歲。', why: 'ten ＝ 10' },
  { at: 1, ty: 'tf', q: "I'm Henry. I'm seven. ➜ Name: Seven", ok: false, en: "I'm Henry. I'm seven.", v: 'm', z: '我是 Henry。我七歲。', why: '名字是 Henry；seven 是歲數' },
  { at: 1, ty: 'dec', en: "I'm nine years old.", x: ['名字', '幾歲'], z: '我九歲。', why: 'years old ＝ 歲' },
  { at: 0, ty: 'spot', w: ['My', 'name', 'am', 'Henry.'], bad: 2, fix: 'is', en: 'My name is Henry.', v: 'm', z: '我的名字是 Henry。', why: 'name 配 is' },
  { at: 1, ty: 'ord', w: ['My', 'name', 'is', 'Chloe.'], en: 'My name is Chloe.', z: '我的名字是 Chloe。', why: '我的 名字 是 Chloe' },
  { at: 0, ty: 'hear', s: "Hello. My name is Chloe. I'm ten years old.", o: ['Chloe · 10', 'Chloe · 2', 'Henry · 10', 'Chloe · 9'], en: "Hello. My name is Chloe. I'm ten years old.", z: '哈囉。我的名字是 Chloe。我十歲。', why: '名字 Chloe；ten ＝ 10' }] },
/* 🪂 空投 密碼箱：聽 3 個 數字（照 順序）*/
{ id: 'q10', ic: '🪂', nm: '空投 密碼箱', sc: [
  { h: '照順序聽', pic: '🔢', en: 'three, five, one.', z: '3、5、1', n: '先 3、再 5、最後 1' },
  { h: 'two 和 ten', pic: '2️⃣ 🔟', en: 'two, ten.', z: '2、10', n: 'two 的 t 後面是 oo；ten 的 t 後面是 en' },
  { h: 'six 和 seven', pic: '6️⃣ 7️⃣', en: 'six, seven.', z: '6、7', n: 'six 一拍；seven 兩拍' },
  { h: 'nine 和 five', pic: '9️⃣ 5️⃣', en: 'nine, five.', z: '9、5', n: '後面的音很像；開頭 n 和 f 不一樣' }],
 qz: [
  { at: 0, ty: 'hear', s: 'two, six, nine.', o: ['269', '296', '629', '259'], en: 'two, six, nine.', z: '2、6、9', why: '照順序：two ➜ six ➜ nine' },
  { at: 2, ty: 'hear', s: 'seven, one, four.', o: ['714', '741', '174', '614'], en: 'seven, one, four.', z: '7、1、4', why: 'seven 兩拍 ＝ 7' },
  { at: 1, ty: 'hear', s: 'eight, three, ten.', o: ['8 3 10', '8 3 2', '3 8 10', '8 10 3'], en: 'eight, three, ten.', z: '8、3、10', why: 'ten ＝ 10（不是 two）' },
  { at: 3, ty: 'hear', s: 'five, nine, two.', o: ['592', '952', '599', '492'], en: 'five, nine, two.', z: '5、9、2', why: 'five ＝ 5；nine ＝ 9' },
  { at: 1, ty: 'tf', pic: '🔟', q: 'two', ok: false, en: 'ten', z: '十', why: '10 ＝ ten；two ＝ 2' },
  { at: 2, ty: 'tf', pic: '6️⃣', q: 'six', ok: true, en: 'six', z: '六', why: '6 ＝ six' },
  { at: 2, ty: 'mc', q: '7 ➜ ?', o: ['seven', 'six', 'sevan', 'five'], en: 'seven', z: '七', why: 'seven ＝ 7' },
  { at: 3, ty: 'spot', q: '4 2 9', w: ['four,', 'two,', 'five.'], bad: 2, fix: 'nine.', en: 'four, two, nine.', z: '4、2、9', why: '9 ＝ nine；five ＝ 5' },
  { at: 0, ty: 'ord', q: '3 8 1', w: ['three,', 'eight,', 'one.'], en: 'three, eight, one.', z: '3、8、1', why: '照順序：3 ➜ 8 ➜ 1' },
  { at: 3, ty: 'dec', en: 'six, two, seven.', x: ['九', '十'], z: '6、2、7', why: 'six 六、two 二、seven 七' }] }
];
const C = require('./_class_data.js');
const BAN = new RegExp('\\b(' + ['Mike', 'Emma', 'Wendy', 'Roy', 'Sam', 'Ann', 'Lily', 'Ken', 'Alan', 'Harry'].concat(C.BAN || []).join('|') + ')\\b');
const R = require('./_rva_lib.js').mk(GL, PH, BAN, null)(ANI);
/* 考卷 的 字：打地鼠（EXAM_A）、挖礦（EXAM_D）的 字 不 當 測驗 的 答案；魔鏡（EXAM_E）的 大小寫 配對 不 考 */
R.list.forEach(a => a.qz.forEach((q, i) => { const w = a.nm + ' 測驗 ' + (i + 1);
  if ((a.id === 'q1' || a.id === 'q4') && (D.EXAM_A[q.en] || D.EXAM_D.indexOf(q.en) >= 0)) R.err.push(w + '：用了 考卷 的 字 ' + q.en);
  if (a.id === 'q5') D.EXAM_E.forEach(p => { const [x, y] = p.split('>'); if ((q.q || '').indexOf(x + ' ➜') === 0 && q.o[0] === y) R.err.push(w + '：考卷 的 魔鏡 ' + p); }); }));
module.exports = R;
