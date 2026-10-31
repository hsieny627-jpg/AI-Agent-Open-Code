/* midterm/_rva_data.js — 📝 四年級 複習：每一個 題型（關）前面 的 🎬 秒懂 複習 動畫＋⚡ 突擊 測驗 題庫（2026-10-31 老師 第三十六次 第 1 點）
 * 設計 原則 寫在 g3mid/CLAUDE.md 最上面「🔒 秒懂 複習 動畫＋突擊 測驗」（三、四年級 一樣）；格式 見 g3mid/_rva_lib.js。
 * 嚴禁 洩題：考卷 的 名字 Amy、考卷 的 字（m1 bed tod pit dan、m2 bus／bod pit／big、m7 sister father teacher nurse cook twenty）不 當 測驗 的 答案；
 *   名字 也 不 用 四年級 複習（Ken Mia Tom）、短文（Frank Lisa Peter Grace）、挑戰 題庫（Owen Jason Emily Nora Chloe Ethan Lucas Olivia）用過 的 ➜ Sean、Hannah、Daisy、Dylan。
 * 新 25／新 50 的 6 種 新 遊戲 ＝ 用 一樣 重點 的 那一部（NMAP）。 */
const D = require('./_data.js');
const GL = Object.assign({}, D.GL, { aunt: '阿姨', bear: '熊', thirty: '三十', who: '誰', sean: '（名字）', 'he’s': '他是' });
const PH = { 'how old': '幾歲', 'years old': '歲', 'turn on': '打開', 'turn off': '關掉', 'hurry up': '快一點', 'have a seat': '請坐', 'come in': '進來', 'good morning': '早安' };
const T3 = [['Time', '時間'], ['’s', '是'], ['up.', '到了']];
const ANI = [
{ id: 'dc', ic: '🔓', nm: '句子 解碼', sc: [
  { h: '問是誰', pic: '❓👦', en: "Who's he?", z: '他是誰？', n: '英文 Who（誰）在最前面；中文「誰」在最後面' },
  { h: '縮寫', pic: '✂️', en: 'Who is', en2: "Who's", z: 'Who is ＝ Who’s（誰是）', n: '’s ＝ is（是）' },
  { h: '說是誰', pic: '👨', en: "He's my father.", v: 'm', z: '他是我的爸爸。', n: 'He’s ＝ He is（他是）' },
  { h: '不是', pic: '🙅‍♀️', en: "No, she isn't.", z: '不，她不是。', n: 'isn’t ＝ is not（不是）' }],
 qz: [
  { at: 0, ty: 'dec', en: "Who's he?", x: ['她', '什麼'], z: '他是誰？', why: '中文說「他是誰」；英文先說 Who（誰）' },
  { at: 2, ty: 'dec', en: "She's my mother.", x: ['他', '你的'], z: '她是我的媽媽。', why: 'She ＝ 她、my ＝ 我的' },
  { at: 3, ty: 'dec', en: 'Is he your uncle?', x: ['她', '我的'], z: '他是你的叔叔嗎？', why: '問句 Is 放最前面；中文「嗎」在最後' },
  { at: 1, ty: 'mc', q: "Who's ＝ ?", o: ['Who is', 'Who are', 'Whose', 'What is'], en: "Who's he?", z: '他是誰？', why: 'Who’s ＝ Who is（’ 藏住了 i）' },
  { at: 2, ty: 'mc', q: "He's ＝ ?", o: ['He is', 'His', 'He am', 'She is'], en: "He's my father.", v: 'm', z: '他是我的爸爸。', why: 'He’s ＝ He is；His ＝ 他的' },
  { at: 3, ty: 'mc', q: "isn't ＝ ?", o: ['is not', 'is no', 'not is', 'am not'], en: "No, she isn't.", z: '不，她不是。', why: 'isn’t ＝ is not（’ 藏住了 o）' },
  { at: 2, ty: 'ord', w: ["She's", 'my', 'grandma.'], x: ['his'], en: "She's my grandma.", z: '她是我的奶奶。', why: '她是 ➜ 我的 ➜ 奶奶' },
  { at: 2, ty: 'spot', w: ['His', 'my', 'brother.'], bad: 0, fix: "He's", en: "He's my brother.", v: 'm', z: '他是我的哥哥。', why: 'His ＝ 他的；他是 ＝ He’s' },
  { at: 3, ty: 'spot', w: ['No,', 'he', 'is.'], bad: 2, fix: "isn't.", en: "No, he isn't.", v: 'm', z: '不，他不是。', why: 'No 後面要 isn’t（不是）' },
  { at: 1, ty: 'tf', q: "Who's he? ＝ Who is he?", ok: true, en: 'Who is he?', z: '他是誰？', why: 'Who’s ＝ Who is，意思一樣' },
  { at: 3, ty: 'tf', q: "Is she a nurse? — Yes, she's.", ok: false, en: 'Is she a nurse? Yes, she is.', z: '她是護理師嗎？是的，她是。', why: '句子最後的 is 不可以縮寫' }] },
{ id: 'm1', ic: '🎈', nm: '字首音 氣球', sc: [
  { h: 'b', pic: '⚽', big: 'b', en: 'ball', z: '球', n: 'b 肚子在右邊；第一個音 /b/' },
  { h: 'd', pic: '🪑', big: 'd', en: 'desk', z: '書桌', n: 'd 肚子在左邊；第一個音 /d/' },
  { h: 'p', pic: '🐼', big: 'p', en: 'panda', z: '貓熊', n: 'p 尾巴往下；只吹氣、喉嚨不震動' },
  { h: 't', pic: '🐯', big: 't', en: 'tiger', z: '老虎', n: 't 上面一小橫；舌頭碰牙齒後面' }],
 qz: [
  { at: 1, ty: 'hear', s: 'duck', o: ['d', 'b', 'p', 't'], en: 'duck', z: '鴨子', why: 'duck 第一個音 /d/ ➜ d' },
  { at: 2, ty: 'hear', s: 'potato', o: ['p', 'b', 'd', 't'], en: 'potato', z: '馬鈴薯', why: 'potato 第一個音 /p/ ➜ p' },
  { at: 3, ty: 'hear', s: 'turtle', o: ['t', 'd', 'p', 'b'], en: 'turtle', z: '烏龜', why: 'turtle 第一個音 /t/ ➜ t' },
  { at: 0, ty: 'hear', s: 'bird', o: ['b', 'd', 'p', 't'], en: 'bird', z: '鳥', why: 'bird 第一個音 /b/ ➜ b' },
  { at: 1, ty: 'mc', q: 'd ➜ ?', o: ['🐬 dolphin', '🐻 bear', '🐼 panda', '🐯 tiger'], en: 'dolphin', z: '海豚', why: 'dolphin 是 d 開頭' },
  { at: 3, ty: 'mc', q: 't ➜ ?', o: ['🍅 tomato', '🍕 pizza', '🍌 banana', '🍩 donut'], en: 'tomato', z: '番茄', why: 'tomato 是 t 開頭' },
  { at: 1, ty: 'spot', q: '🐶', w: ['b', 'o', 'g'], bad: 0, fix: 'd', en: 'dog', atk: [['dog', '狗']], z: '狗', why: 'dog 第一個字母 d，不是 b' },
  { at: 2, ty: 'spot', q: '🍑', w: ['b', 'e', 'a', 'c', 'h'], bad: 0, fix: 'p', en: 'peach', atk: [['peach', '桃子']], z: '桃子', why: 'peach 是 p 開頭（只吹氣）' },
  { at: 0, ty: 'tf', q: 'b ➜ 🍌 banana', ok: true, en: 'banana', z: '香蕉', why: 'banana 是 b 開頭' },
  { at: 3, ty: 'tf', q: 't ➜ 🦆 duck', ok: false, en: 'duck', z: '鴨子', why: 'duck 是 d 開頭' }] },
{ id: 'm2', ic: '👯', nm: '聲音 雙胞胎', sc: [
  { h: '一樣', pic: '🚌 ⚽', en: 'bus, ball.', z: 'b、b ➜ 一樣 ⭕', n: '只聽第一個音' },
  { h: '不一樣', pic: '🐶 🐷', en: 'dog, pig.', z: 'd、p ➜ 不一樣 ❌', n: '後面的音一樣也不算' },
  { h: 'b 和 p', pic: '👍 🐷', en: 'big, pig.', z: 'b、p ➜ 不一樣 ❌', n: 'b 喉嚨震動；p 只吹氣' },
  { h: 'd 和 t', pic: '🏠 🔟', en: 'den, ten.', z: 'd、t ➜ 不一樣 ❌', n: 'd 喉嚨震動；t 只吹氣' }],
 qz: [
  { at: 0, ty: 'tf', s: 'pen, pot.', q: 'Same first sound?', ok: true, en: 'pen, pot.', z: 'p、p ➜ 一樣', why: '兩個都是 /p/' },
  { at: 3, ty: 'tf', s: 'tip, dip.', q: 'Same first sound?', ok: false, en: 'tip, dip.', z: 't、d ➜ 不一樣', why: 't 只吹氣；d 喉嚨震動' },
  { at: 2, ty: 'tf', s: 'bat, pat.', q: 'Same first sound?', ok: false, en: 'bat, pat.', z: 'b、p ➜ 不一樣', why: 'b 喉嚨震動；p 只吹氣' },
  { at: 1, ty: 'tf', s: 'doll, desk.', q: 'Same first sound?', ok: true, en: 'doll, desk.', z: 'd、d ➜ 一樣', why: '兩個都是 /d/' },
  { at: 3, ty: 'hear', s: 'top', q: 'Same first sound?', o: ['🐯 tiger', '🍩 donut', '🐼 panda', '🦆 duck'], en: 'top, tiger.', z: 't、t ➜ 一樣', why: 'top、tiger 都是 /t/' },
  { at: 0, ty: 'hear', s: 'bird', q: 'Same first sound?', o: ['⚽ ball', '🐼 panda', '🐶 dog', '🍅 tomato'], en: 'bird, ball.', z: 'b、b ➜ 一樣', why: 'bird、ball 都是 /b/' },
  { at: 2, ty: 'mc', q: 'pig ➜ ?', o: ['pen', 'big', 'dig', 'tip'], en: 'pig, pen.', z: 'p、p ➜ 一樣', why: 'pig、pen 都是 /p/；big 是 /b/' },
  { at: 1, ty: 'spot', q: 'Same first sound!', w: ['bus', 'ball', 'pen', 'box'], bad: 2, fix: 'bag', en: 'bus, ball, bag, box.', z: '都是 b', why: 'pen 是 /p/，不一樣' },
  { at: 3, ty: 'spot', q: 'Same first sound!', w: ['ten', 'toy', 'den', 'top'], bad: 2, fix: 'tent', en: 'ten, toy, tent, top.', z: '都是 t', why: 'den 是 /d/，不一樣' }] },
{ id: 'm3', ic: '📸', nm: '聽句 找照片', sc: [
  { h: '問職業', pic: '👩‍🏫', en: 'Is your mom a teacher?', z: '你的媽媽是老師嗎？', n: 'Is 放最前面 ➜ 問句' },
  { h: '是 ➜ Yes', pic: '✅', en: 'Yes, she is.', z: '是的，她是。', n: '媽媽 ➜ she' },
  { h: '不是 ➜ No', pic: '👨‍🍳', en: "No, he isn't. He's a cook.", v: 'm', z: '不，他不是。他是廚師。', n: '聽最後一句 ➜ 真正的職業' },
  { h: '聽人和職業', pic: '👴 🧑‍🌾', en: 'Is your grandpa a farmer?', z: '你的爺爺是農夫嗎？', n: '👤 聽是誰、💼 聽什麼職業' }],
 qz: [
  { at: 2, ty: 'hear', s: "Is your dad a doctor? No, he isn't. He's a nurse.", o: ['👨 dad · nurse', '👨 dad · doctor', '👩 mom · nurse', '👴 grandpa · nurse'], en: "Is your dad a doctor? No, he isn't. He's a nurse.", z: '你的爸爸是醫生嗎？不，他不是。他是護理師。', why: 'No 後面那一句才是答案：nurse' },
  { at: 1, ty: 'hear', s: 'Is your aunt a nurse? Yes, she is.', o: ['👩 aunt · nurse', '👨 uncle · nurse', '👩 aunt · cook', '👵 grandma · nurse'], en: 'Is your aunt a nurse? Yes, she is.', z: '你的阿姨是護理師嗎？是的，她是。', why: 'aunt ＝ 阿姨；Yes ＝ 是護理師' },
  { at: 3, ty: 'hear', s: "Is your uncle a cook? No, he isn't. He's a farmer.", o: ['👨 uncle · farmer', '👨 uncle · cook', '👴 grandpa · farmer', '👩 aunt · farmer'], en: "Is your uncle a cook? No, he isn't. He's a farmer.", z: '你的叔叔是廚師嗎？不，他不是。他是農夫。', why: '答案在最後：farmer' },
  { at: 2, ty: 'mc', q: "No, he isn't. He's a cook. ➜ ?", o: ['👨‍🍳 cook', '👨‍🌾 farmer', '👨‍⚕️ doctor', '👨‍🏫 teacher'], en: "No, he isn't. He's a cook.", v: 'm', z: '不，他不是。他是廚師。', why: 'He’s a cook. ＝ 他是廚師' },
  { at: 1, ty: 'tf', q: 'Is your mom a teacher? — Yes, he is.', ok: false, en: 'Is your mom a teacher? Yes, she is.', z: '你的媽媽是老師嗎？是的，她是。', why: 'mom 是女生 ➜ she' },
  { at: 3, ty: 'tf', q: 'grandpa ➜ he', ok: true, en: 'Is your grandpa a farmer? Yes, he is.', z: '你的爺爺是農夫嗎？是的，他是。', why: 'grandpa 是男生 ➜ he' },
  { at: 0, ty: 'dec', en: 'Is your mom a nurse?', x: ['他的', '誰'], z: '你的媽媽是護理師嗎？', why: 'Is 是、your 你的、mom 媽媽' },
  { at: 0, ty: 'ord', w: ['Is', 'your', 'dad', 'a', 'cook?'], en: 'Is your dad a cook?', z: '你的爸爸是廚師嗎？', why: '問句 Is 放最前面' },
  { at: 2, ty: 'spot', w: ['No,', 'he', 'is.', "He's", 'a', 'cook.'], bad: 2, fix: "isn't.", en: "No, he isn't. He's a cook.", v: 'm', z: '不，他不是。他是廚師。', why: 'No 後面要 isn’t' }] },
{ id: 'm4', ic: '🏫', nm: '教室 指令王', sc: [
  { h: '走吧、快一點', pic: '🚶 ⏩', en: "Let's go.", en2: 'Hurry up.', sym: '＋', z: '我們走吧。快一點。', n: 'Let’s ＝ 我們…吧' },
  { h: '不要', pic: '🤐 🚫🏃', en: "Don't talk.", en2: "Don't run.", sym: '＋', z: '不要說話。不要跑。', n: 'Don’t ＝ 不要' },
  { h: '開燈、關燈', pic: '💡 🌑', en: 'Turn on the light.', en2: 'Turn off the light.', vs: 1, z: '打開燈。關掉燈。', n: 'on ＝ 開；off ＝ 關' },
  { h: '時間到', pic: '⏰ 📒', en: "Time's up.", tk: T3, en2: 'Show me your homework.', sym: '＋', z: '時間到了。給我看你的作業。', n: 'Time’s up. ＝ 時間到了' }],
 qz: [
  { at: 2, ty: 'mc', pic: '💡', q: 'Turn ___ the light.', o: ['on', 'off', 'up', 'in'], en: 'Turn on the light.', z: '打開燈。', why: '開燈 ＝ turn on' },
  { at: 2, ty: 'mc', pic: '🌑', q: 'Turn ___ the light.', o: ['off', 'on', 'of', 'up'], en: 'Turn off the light.', z: '關掉燈。', why: '關燈 ＝ turn off（兩個 f）' },
  { at: 1, ty: 'mc', pic: '🤐', q: '___ talk.', o: ["Don't", 'Do', 'No', 'Not'], en: "Don't talk.", z: '不要說話。', why: '不要 ＝ Don’t' },
  { at: 0, ty: 'hear', s: 'Hurry up.', o: ['⏩🏃', '🤐', '💡', '📒'], en: 'Hurry up.', z: '快一點。', why: 'Hurry up. ＝ 快一點' },
  { at: 3, ty: 'hear', s: "Time's up.", o: ['⏰', '💡', '🚶', '🤐'], en: "Time's up.", atk: T3, z: '時間到了。', why: 'Time’s up. ＝ 時間到了' },
  { at: 1, ty: 'tf', pic: '🏃🚫', q: "Don't run.", ok: true, en: "Don't run.", z: '不要跑。', why: '🚫🏃 ＝ 不要跑' },
  { at: 2, ty: 'tf', pic: '💡 ➜ 🌑', q: 'Turn on the light.', ok: false, en: 'Turn off the light.', z: '關掉燈。', why: '燈變暗 ＝ 關掉 ➜ off' },
  { at: 3, ty: 'spot', w: ['Show', 'me', 'you', 'homework.'], bad: 2, fix: 'your', en: 'Show me your homework.', z: '給我看你的作業。', why: '你的 ＝ your' },
  { at: 2, ty: 'ord', w: ['Turn', 'off', 'the', 'light.'], en: 'Turn off the light.', z: '關掉燈。', why: 'Turn off ➜ the light' },
  { at: 1, ty: 'dec', en: "Don't run.", x: ['走', '說話'], z: '不要跑。', why: 'run ＝ 跑' }] },
{ id: 'm5', ic: '🎯', nm: '數字 神射手', sc: [
  { h: '11 和 12', pic: '1️⃣1️⃣ 1️⃣2️⃣', en: 'eleven, twelve.', z: '11、12', n: '11、12 要背：eleven、twelve' },
  { h: '-teen', pic: '1️⃣3️⃣', en: 'thirteen', z: '13', n: '13～19 都是 -teen：thir-TEEN 重音在後面' },
  { h: '13 和 30', pic: '1️⃣3️⃣ 3️⃣0️⃣', en: 'thirteen, thirty.', z: '13、30', n: 'thirteen 尾巴 teen；thirty 尾巴 ty' },
  { h: '20', pic: '2️⃣0️⃣', en: 'twenty', z: '20', n: 'twenty 是 -ty（二十）' }],
 qz: [
  { at: 1, ty: 'hear', s: 'fifteen', o: ['15', '50', '5', '16'], en: 'fifteen', z: '十五', why: 'fif-TEEN ＝ 15' },
  { at: 1, ty: 'hear', s: 'seventeen', o: ['17', '70', '7', '71'], en: 'seventeen', z: '十七', why: '-teen ＝ 十幾' },
  { at: 2, ty: 'hear', s: 'eighteen', o: ['18', '80', '8', '13'], en: 'eighteen', z: '十八', why: 'eigh-TEEN ＝ 18' },
  { at: 2, ty: 'hear', s: 'forty', o: ['40', '14', '4', '44'], en: 'forty', z: '四十', why: '-ty ＝ 幾十：forty ＝ 40' },
  { at: 1, ty: 'mc', pic: '1️⃣9️⃣', q: '?', o: ['nineteen', 'ninety', 'nine', 'ninteen'], en: 'nineteen', z: '十九', why: '19 ＝ nine＋teen（中間有 e）' },
  { at: 0, ty: 'mc', q: '12 ➜ ?', o: ['twelve', 'twenty', 'two', 'eleven'], en: 'twelve', z: '十二', why: '12 ＝ twelve；20 ＝ twenty' },
  { at: 0, ty: 'spot', q: '11 12 13', w: ['eleven,', 'twenty,', 'thirteen.'], bad: 1, fix: 'twelve,', en: 'eleven, twelve, thirteen.', z: '11、12、13', why: '12 ＝ twelve；twenty 是 20' },
  { at: 3, ty: 'tf', pic: '2️⃣0️⃣', q: 'twelve', ok: false, en: 'twenty', z: '二十', why: '20 ＝ twenty' },
  { at: 1, ty: 'tf', pic: '1️⃣6️⃣', q: 'sixteen', ok: true, en: 'sixteen', z: '十六', why: '16 ＝ sixteen' },
  { at: 1, ty: 'ord', pic: '1️⃣3️⃣', w: ['thir', 'teen'], x: ['ty'], en: 'thirteen', atk: [['thirteen', '十三']], z: '十三', why: '13 ＝ thir＋teen；thirty 才是 30' }] },
{ id: 'm6', ic: '💬', nm: '聊天室 接話', sc: [
  { h: '問誰 ➜ 說誰', pic: '👴', en: "Who's he?", en2: "He's my grandpa.", sym: '➜', v2: 'm', z: '他是誰？他是我的爺爺。', n: 'Who’s he? ➜ He’s my ___.' },
  { h: '遲到 ➜ 請進', pic: '🚪', en: "Sorry, I'm late.", en2: 'Come in, please.', sym: '➜', v2: 'm', z: '對不起，我遲到了。請進。', n: '遲到說 Sorry；老師說 Come in.' },
  { h: '請坐 ➜ 謝謝', pic: '🪑', en: 'Have a seat, please.', en2: 'Thank you.', sym: '➜', v2: 'm', z: '請坐。謝謝你。', n: 'Have a seat ＝ 請坐' },
  { h: '介紹家人', pic: '👩', en: 'This is my mom.', en2: 'Nice to meet you.', sym: '➜', v2: 'm', z: '這是我的媽媽。很高興認識你。', n: '第一次見面 ➜ Nice to meet you.' }],
 qz: [
  { at: 0, ty: 'mc', q: "Who's she?", o: ["She's my aunt.", "He's my aunt.", 'Yes, she is.', 'She my aunt.'], en: "She's my aunt.", z: '她是我的阿姨。', why: '問 Who（誰）➜ 說是誰；女生 ➜ She’s' },
  { at: 2, ty: 'mc', q: 'Have a seat, please.', o: ['Thank you.', 'Come in, please.', "I'm sorry.", "Who's she?"], en: 'Thank you.', v: 'm', z: '謝謝你。', why: '別人請你坐 ➜ 說謝謝' },
  { at: 3, ty: 'mc', q: 'This is my dad.', o: ['Nice to meet you.', 'Nice to meet you, too.', 'Thank you.', 'Come in, please.'], en: 'Nice to meet you.', v: 'm', z: '很高興認識你。', why: '第一次見面先說 Nice to meet you.' },
  { at: 1, ty: 'hear', s: "Sorry, I'm late.", o: ['Come in, please.', 'Nice to meet you.', 'Yes, she is.', 'Thank you.'], en: 'Come in, please.', v: 'm', z: '請進。', why: '遲到 ➜ 老師說請進' },
  { at: 3, ty: 'tf', q: 'Nice to meet you. — Nice to meet you, too.', ok: true, en: 'Nice to meet you. Nice to meet you, too.', z: '很高興認識你。我也很高興認識你。', why: '回答要加 too' },
  { at: 0, ty: 'tf', q: "Who's he? — Yes, he is.", ok: false, en: "Who's he? He's my uncle.", z: '他是誰？他是我的叔叔。', why: '問 Who（誰）要說是誰，不是 Yes' },
  { at: 0, ty: 'spot', w: ["He's", 'my', 'grandma.'], bad: 0, fix: "She's", en: "She's my grandma.", z: '她是我的奶奶。', why: 'grandma 是女生 ➜ She’s' },
  { at: 2, ty: 'ord', w: ['Have', 'a', 'seat,', 'please.'], en: 'Have a seat, please.', z: '請坐。', why: 'Have a seat ➜ please' },
  { at: 1, ty: 'dec', en: 'Come in, please.', x: ['出去', '謝謝'], z: '請進。', why: 'Come in ＝ 進來；please ＝ 請' }] },
{ id: 'm8', ic: '🕵️', nm: '短文 偵探', sc: [
  { h: '先找是誰', pic: '📖', en: "Hi, I'm Dylan. I'm twelve.", v: 'm', z: '嗨，我是 Dylan。我十二歲。', n: '先找名字、再找數字' },
  { h: 'He’s ＝ 男生', pic: '👦', en: "He's my brother. He's a student.", v: 'm', z: '他是我的哥哥。他是學生。', n: '找「他」是誰、做什麼' },
  { h: '答案在 No 後面', pic: '🔍', en: "Is she a teacher? No, she isn't. She's a nurse.", z: '她是老師嗎？不，她不是。她是護理師。', n: 'No 後面那一句才是答案' },
  { h: '找證據', pic: '🖍️', en: "She's my aunt.", z: '她是我的阿姨。', n: '題目問什麼 ➜ 回去找那一句畫線' }],
 qz: [
  { at: 0, ty: 'mc', q: 'Dylan is ___ years old.', o: ['twelve', 'twenty', 'eleven', 'two'], en: "Hi, I'm Dylan. I'm twelve.", v: 'm', z: '嗨，我是 Dylan。我十二歲。', why: '證據：I’m twelve.' },
  { at: 2, ty: 'mc', q: 'She is a ___.', o: ['nurse', 'teacher', 'student', 'cook'], en: "No, she isn't. She's a nurse.", z: '不，她不是。她是護理師。', why: '證據在 No 後面：She’s a nurse.' },
  { at: 1, ty: 'mc', q: "Dylan's brother is a ___.", o: ['student', 'teacher', 'nurse', 'farmer'], en: "He's my brother. He's a student.", v: 'm', z: '他是我的哥哥。他是學生。', why: '證據：He’s a student.' },
  { at: 2, ty: 'tf', q: 'She is a teacher.', ok: false, en: "Is she a teacher? No, she isn't. She's a nurse.", z: '她是老師嗎？不，她不是。她是護理師。', why: 'No, she isn’t. ➜ 不是老師' },
  { at: 3, ty: 'tf', q: "She's Dylan's aunt.", ok: true, en: "She's my aunt.", z: '她是我的阿姨。', why: '證據：She’s my aunt.' },
  { at: 1, ty: 'dec', en: "He's my brother.", x: ['她', '你的'], z: '他是我的哥哥。', why: 'He ＝ 他、brother ＝ 哥哥' },
  { at: 2, ty: 'spot', w: ['Is', 'she', 'a', 'teacher?', 'No,', 'she', 'is.'], bad: 6, fix: "isn't.", en: "Is she a teacher? No, she isn't.", z: '她是老師嗎？不，她不是。', why: 'No 後面要 isn’t' },
  { at: 3, ty: 'ord', w: ["She's", 'my', 'aunt.'], x: ['his'], en: "She's my aunt.", z: '她是我的阿姨。', why: '她是 ➜ 我的 ➜ 阿姨' },
  { at: 2, ty: 'hear', s: "Is your brother a cook? No, he isn't. He's a farmer.", q: 'He is a ___.', o: ['farmer', 'cook', 'nurse', 'doctor'], en: "Is your brother a cook? No, he isn't. He's a farmer.", z: '你的哥哥是廚師嗎？不，他不是。他是農夫。', why: '答案在 No 後面：farmer' }] },
{ id: 'm9', ic: '🌳', nm: '家族樹 尋人', sc: [
  { h: '爺爺、奶奶', pic: '👴 👵', en: 'grandpa, grandma.', z: '爺爺、奶奶', n: 'grandpa 男生（he）；grandma 女生（she）' },
  { h: '爸爸、媽媽', pic: '👨 👩', en: 'father, mother.', z: '爸爸、媽媽', n: 'father ＝ dad；mother ＝ mom' },
  { h: '哥哥、姊姊', pic: '👦 👧', en: 'brother, sister.', z: '哥哥、姊姊', n: 'brother 男生；sister 女生' },
  { h: 'He’s 還是 She’s', pic: '🌳', en: "She's my grandmother.", z: '她是我的奶奶。', n: '女生 ➜ She’s；男生 ➜ He’s' }],
 qz: [
  { at: 0, ty: 'mc', pic: '👵', q: "She's my ___.", o: ['grandma', 'grandpa', 'mother', 'sister'], en: "She's my grandma.", z: '她是我的奶奶。', why: '👵 ＝ grandma' },
  { at: 1, ty: 'mc', pic: '👨', q: "He's my ___.", o: ['father', 'mother', 'brother', 'grandpa'], en: "He's my father.", v: 'm', z: '他是我的爸爸。', why: '👨 ＝ father' },
  { at: 3, ty: 'mc', pic: '👧', q: '___ my sister.', o: ["She's", "He's", 'His', 'Her'], en: "She's my sister.", z: '她是我的姊姊。', why: '女生 ➜ She’s' },
  { at: 0, ty: 'hear', s: "He's my grandfather.", v: 'm', o: ['👴', '👨', '👦', '👵'], en: "He's my grandfather.", z: '他是我的爺爺。', why: 'grandfather ＝ 爺爺' },
  { at: 1, ty: 'hear', s: "She's my mother.", o: ['👩', '👵', '👧', '👨'], en: "She's my mother.", z: '她是我的媽媽。', why: 'mother ＝ 媽媽' },
  { at: 3, ty: 'tf', pic: '👦', q: "She's my brother.", ok: false, en: "He's my brother.", v: 'm', z: '他是我的哥哥。', why: 'brother 是男生 ➜ He’s' },
  { at: 0, ty: 'tf', pic: '👴', q: "He's my grandpa.", ok: true, en: "He's my grandpa.", v: 'm', z: '他是我的爺爺。', why: '👴 ＝ grandpa' },
  { at: 2, ty: 'spot', w: ["He's", 'my', 'sister.'], bad: 0, fix: "She's", en: "She's my sister.", z: '她是我的姊姊。', why: 'sister 是女生 ➜ She’s' },
  { at: 1, ty: 'ord', w: ["He's", 'my', 'father.'], x: ['his'], en: "He's my father.", v: 'm', z: '他是我的爸爸。', why: '他是 ➜ 我的 ➜ 爸爸' },
  { at: 3, ty: 'dec', en: "She's my grandma.", x: ['他', '爺爺'], z: '她是我的奶奶。', why: 'She ＝ 她、grandma ＝ 奶奶' }] },
{ id: 'm11', ic: '✅', nm: '是不是 快問快答', sc: [
  { h: '是 ➜ Yes', pic: '👩‍⚕️', en: 'Is she a doctor?', en2: 'Yes, she is.', sym: '➜', z: '她是醫生嗎？是的，她是。', n: '是 ➜ Yes, she is.' },
  { h: '不是 ➜ No', pic: '👨‍🍳', en: 'Is he a farmer?', en2: "No, he isn't.", sym: '➜', v2: 'm', z: '他是農夫嗎？不，他不是。', n: '不是 ➜ No, he isn’t.' },
  { h: 'he 還是 she', pic: '🧑‍🎓', en: 'Is she a student?', en2: 'Yes, she is.', sym: '➜', z: '她是學生嗎？是的，她是。', n: '問句用 she，回答也用 she' },
  { h: '最後的 is', pic: '✋', en: 'Yes, he is.', en2: "No, he isn't.", vs: 1, v: 'm', z: '是的，他是。不，他不是。', n: 'Yes, he is.（不可以說 Yes, he’s.）' }],
 qz: [
  { at: 1, ty: 'mc', pic: '👨‍🌾', q: 'Is he a farmer?', o: ['Yes, he is.', "No, he isn't.", 'Yes, she is.', "Yes, he's."], en: 'Yes, he is.', v: 'm', z: '是的，他是。', why: '圖是農夫 ➜ Yes, he is.' },
  { at: 1, ty: 'mc', pic: '👩‍🍳', q: 'Is she a nurse?', o: ["No, she isn't.", 'Yes, she is.', "No, he isn't.", 'No, she is.'], en: "No, she isn't.", z: '不，她不是。', why: '圖是廚師 ➜ 不是護理師' },
  { at: 2, ty: 'mc', pic: '👦🎒', q: 'Is he a student?', o: ['Yes, he is.', 'Yes, she is.', "No, he isn't.", "Yes, he's."], en: 'Yes, he is.', v: 'm', z: '是的，他是。', why: '問 he ➜ 回答 he' },
  { at: 0, ty: 'tf', pic: '👩‍🏫', q: 'Is she a teacher? — Yes, she is.', ok: true, en: 'Is she a teacher? Yes, she is.', z: '她是老師嗎？是的，她是。', why: '圖是老師 ➜ Yes' },
  { at: 3, ty: 'tf', pic: '👨‍⚕️', q: "Is he a doctor? — Yes, he's.", ok: false, en: 'Is he a doctor? Yes, he is.', v: 'm', z: '他是醫生嗎？是的，他是。', why: '最後的 is 不可以縮寫' },
  { at: 2, ty: 'spot', w: ['Is', 'she', 'a', 'cook?', 'Yes,', 'he', 'is.'], bad: 5, fix: 'she', en: 'Is she a cook? Yes, she is.', z: '她是廚師嗎？是的，她是。', why: '問 she ➜ 回答 she' },
  { at: 1, ty: 'ord', w: ['No,', 'she', "isn't."], en: "No, she isn't.", z: '不，她不是。', why: 'No ➜ she ➜ isn’t' },
  { at: 1, ty: 'dec', en: "No, he isn't.", x: ['是', '她'], z: '不，他不是。', why: 'isn’t ＝ 不是' },
  { at: 2, ty: 'hear', s: 'Is your dad a cook?', pic: '👨‍🍳', o: ['Yes, he is.', 'Yes, she is.', "No, he isn't.", "Yes, he's."], en: 'Yes, he is.', v: 'm', z: '是的，他是。', why: 'dad 是男生 ➜ he；圖是廚師 ➜ Yes' }] },
{ id: 'm7', ic: '✍️', nm: '拼字 救援', sc: [
  { h: '-er 結尾', pic: '👦', en: 'brother', z: '哥哥', n: 'brother、mother、farmer 都是 -er' },
  { h: '-or 結尾', pic: '👨‍⚕️', en: 'doctor', z: '醫生', n: 'doctor 是 -or（不是 -er）' },
  { h: 'th 一起', pic: '👩', en: 'mother', z: '媽媽', n: 'th 兩個字母一起唸一個音' },
  { h: '長的字拆開', pic: '👵', en: 'grandma', z: '奶奶', n: 'grand ＋ ma ＝ grandma' }],
 qz: [
  { at: 1, ty: 'spot', pic: '👨‍⚕️', w: ['d', 'o', 'c', 't', 'e', 'r'], bad: 4, fix: 'o', en: 'doctor', z: '醫生', why: 'doctor 是 -or' },
  { at: 0, ty: 'spot', pic: '👨‍🌾', w: ['f', 'a', 'r', 'm', 'o', 'r'], bad: 4, fix: 'e', en: 'farmer', z: '農夫', why: 'farmer 是 -er' },
  { at: 2, ty: 'ord', pic: '👦', w: ['b', 'r', 'o', 'th', 'er'], en: 'brother', atk: [['brother', '哥哥']], z: '哥哥', why: 'b-r-o-th-er' },
  { at: 3, ty: 'ord', pic: '👵', w: ['g', 'r', 'a', 'n', 'd', 'm', 'a'], en: 'grandma', atk: [['grandma', '奶奶']], z: '奶奶', why: 'grand ＋ ma' },
  { at: 0, ty: 'ord', pic: '🧑‍🎓', w: ['s', 't', 'u', 'd', 'e', 'n', 't'], en: 'student', atk: [['student', '學生']], z: '學生', why: 's-t-u-d-e-n-t' },
  { at: 1, ty: 'mc', pic: '👨‍⚕️', q: '?', o: ['doctor', 'docter', 'dokter', 'doctar'], en: 'doctor', z: '醫生', why: 'doctor ＝ d-o-c-t-o-r' },
  { at: 0, ty: 'mc', pic: '👨‍🌾', q: '?', o: ['farmer', 'farmor', 'famer', 'farmar'], en: 'farmer', z: '農夫', why: 'farm ＋ er' },
  { at: 2, ty: 'mc', pic: '👩', q: '?', o: ['mother', 'muther', 'mather', 'mothr'], en: 'mother', z: '媽媽', why: 'm-o-th-er' },
  { at: 3, ty: 'tf', pic: '👴', q: 'grandpa', ok: true, en: 'grandpa', z: '爺爺', why: 'grand ＋ pa' },
  { at: 0, ty: 'tf', pic: '🧑‍🎓', q: 'studant', ok: false, en: 'student', z: '學生', why: 'student 的 e：-dent' },
  { at: 0, ty: 'hear', s: 'uncle', o: ['uncle', 'uncel', 'ancle', 'unkle'], en: 'uncle', z: '叔叔', why: 'u-n-c-l-e' }] },
{ id: 'm10', ic: '🧩', nm: '對話 工廠', sc: [
  { h: '問人 ➜ Who’s', pic: '👩', en: "Who's she?", en2: "She's my aunt.", sym: '➜', z: '她是誰？她是我的阿姨。', n: '問人用 Who’s；回答用 She’s' },
  { h: '是不是 ➜ Is', pic: '👨', en: 'Is he your uncle?', en2: 'Yes, he is.', sym: '➜', v2: 'm', z: '他是你的叔叔嗎？是的，他是。', n: '問「是不是」➜ Is 放最前面' },
  { h: '不是 ➜ isn’t', pic: '👩‍⚕️', en: 'Is she a cook?', en2: "No, she isn't. She's a nurse.", sym: '➜', z: '她是廚師嗎？不，她不是。她是護理師。', n: 'No 後面一定是 isn’t' },
  { h: 'He’s 和 His', pic: '👨', en: "He's my dad.", en2: 'His name is Sean.', sym: '＋', v: 'm', z: '他是我的爸爸。他的名字是 Sean。', n: 'He’s ＝ 他是；His ＝ 他的' }],
 qz: [
  { at: 0, ty: 'mc', q: "A: ___ he? B: He's my uncle.", o: ["Who's", "What's", 'Who', 'Is'], en: "Who's he? He's my uncle.", z: '他是誰？他是我的叔叔。', why: '問人 ➜ Who’s' },
  { at: 1, ty: 'mc', q: 'A: ___ your mom a doctor? B: Yes, she is.', o: ['Is', 'Are', "Who's", 'Am'], en: 'Is your mom a doctor? Yes, she is.', z: '你的媽媽是醫生嗎？是的，她是。', why: '一個人 ➜ Is' },
  { at: 2, ty: 'mc', q: 'A: Is he a cook? B: No, he ___.', o: ["isn't", 'is', 'not', 'no'], en: "Is he a cook? No, he isn't.", z: '他是廚師嗎？不，他不是。', why: 'No 後面 ➜ isn’t' },
  { at: 0, ty: 'mc', q: "A: Who's she? B: ___ my sister.", o: ["She's", "He's", 'Her', 'She'], en: "Who's she? She's my sister.", z: '她是誰？她是我的姊姊。', why: '她是 ＝ She’s' },
  { at: 3, ty: 'spot', w: ['His', 'a', 'farmer.'], bad: 0, fix: "He's", en: "He's a farmer.", v: 'm', z: '他是農夫。', why: '他是 ＝ He’s；His ＝ 他的' },
  { at: 1, ty: 'spot', w: ['Is', 'your', 'dad', 'a', 'nurse?', 'Yes,', 'she', 'is.'], bad: 6, fix: 'he', en: 'Is your dad a nurse? Yes, he is.', z: '你的爸爸是護理師嗎？是的，他是。', why: 'dad 是男生 ➜ he' },
  { at: 1, ty: 'ord', w: ['Is', 'she', 'your', 'aunt?'], en: 'Is she your aunt?', z: '她是你的阿姨嗎？', why: '問句 Is 放最前面' },
  { at: 1, ty: 'tf', q: "A: Is she your sister? B: Yes, she's.", ok: false, en: 'Is she your sister? Yes, she is.', z: '她是你的姊姊嗎？是的，她是。', why: '最後的 is 不可以縮寫' },
  { at: 3, ty: 'dec', en: 'His name is Sean.', x: ['他是', '我的'], z: '他的名字是 Sean。', why: 'His ＝ 他的（不是「他是」）' },
  { at: 0, ty: 'hear', s: "Who's he?", o: ["He's my grandpa.", 'Yes, he is.', 'His my grandpa.', "She's my grandpa."], en: "He's my grandpa.", v: 'm', z: '他是我的爺爺。', why: '問誰 ➜ He’s my ___.' }] },
{ id: 'm12', ic: '🪤', nm: '陷阱 偵測器', sc: [
  { h: 'He’s ≠ His', pic: '👨‍🍳', en: "He's a cook.", v: 'm', z: '他是廚師。', n: 'He’s ＝ He is（他是）；His ＝ 他的' },
  { h: 'Who’s ≠ What’s', pic: '❓', en: "Who's he?", en2: "What's his name?", sym: '＋', z: '他是誰？他的名字是什麼？', n: '問人 ➜ Who’s；問名字 ➜ What’s' },
  { h: '一個人 ➜ Is', pic: '☝️', en: 'Is your dad a nurse?', z: '你的爸爸是護理師嗎？', n: '一個人 ➜ Is（不是 Are）' },
  { h: '最後的 is', pic: '✂️🚫', en: 'Yes, she is.', z: '是的，她是。', n: '最後的 is 不可以縮寫成 she’s' }],
 qz: [
  { at: 0, ty: 'mc', q: 'Look! ___ a farmer.', o: ["He's", 'His', 'He', "Who's"], en: "Look! He's a farmer.", v: 'm', z: '看！他是農夫。', why: '他是 ＝ He’s' },
  { at: 1, ty: 'mc', q: "___ she? She's my mom.", o: ["Who's", "What's", 'Who', 'Is'], en: "Who's she? She's my mom.", z: '她是誰？她是我的媽媽。', why: '問人 ➜ Who’s' },
  { at: 2, ty: 'mc', q: '___ your sister a student?', o: ['Is', 'Are', 'Am', "Who's"], en: 'Is your sister a student?', z: '你的姊姊是學生嗎？', why: '一個人 ➜ Is' },
  { at: 3, ty: 'mc', q: 'Is he a doctor? Yes, ___.', o: ['he is', "he's", 'she is', 'his is'], en: 'Is he a doctor? Yes, he is.', v: 'm', z: '他是醫生嗎？是的，他是。', why: '最後的 is 不縮寫' },
  { at: 0, ty: 'spot', w: ['His', 'my', 'uncle.'], bad: 0, fix: "He's", en: "He's my uncle.", v: 'm', z: '他是我的叔叔。', why: '他是 ＝ He’s' },
  { at: 2, ty: 'spot', w: ['Are', 'your', 'mom', 'a', 'cook?'], bad: 0, fix: 'Is', en: 'Is your mom a cook?', z: '你的媽媽是廚師嗎？', why: '一個人 ➜ Is' },
  { at: 1, ty: 'tf', q: "What's he? — He's my brother.", ok: false, en: "Who's he? He's my brother.", z: '他是誰？他是我的哥哥。', why: '問人用 Who’s' },
  { at: 3, ty: 'tf', q: 'Is she a nurse? — Yes, she is.', ok: true, en: 'Is she a nurse? Yes, she is.', z: '她是護理師嗎？是的，她是。', why: '最後的 is 不縮寫 ✔' },
  { at: 1, ty: 'ord', w: ["What's", 'his', 'name?'], x: ["he's"], en: "What's his name?", z: '他的名字是什麼？', why: '他的 ＝ his' },
  { at: 0, ty: 'hear', s: "He's my brother.", v: 'm', o: ["He's my brother.", 'His my brother.', 'He my brother.', "She's my brother."], en: "He's my brother.", v: 'm', z: '他是我的哥哥。', why: 'He’s ＝ He is' }] }
];
const BAN = /\b(Amy|Ken|Mia|Tom|Frank|Lisa|Peter|Grace|Owen|Jason|Emily|Nora|Chloe|Ethan|Lucas|Olivia)\b/;
const R = require('../g3mid/_rva_lib.js').mk(GL, PH, BAN, null)(ANI);
const EXW = ['bed', 'tod', 'pit', 'dan', 'sister', 'father', 'teacher', 'nurse', 'cook', 'twenty'];
R.list.forEach(a => a.qz.forEach((q, i) => { if ((a.id === 'm1' || a.id === 'm7') && EXW.indexOf(q.en) >= 0) R.err.push(a.nm + ' 測驗 ' + (i + 1) + '：用了 考卷 的 字 ' + q.en); }));
/* 新 25／新 50 的 6 種 新 遊戲 ➜ 一樣 重點 的 那一部 */
R.NMAP = { n1: 'm1', n2: 'm3', n3: 'm3', n4: 'm6', n5: 'm7', n6: 'm8' };
module.exports = R;
