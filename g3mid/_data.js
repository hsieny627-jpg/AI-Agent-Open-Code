/* g3mid/_data.js — 📝 三年級 複習（期中考範圍）題庫唯一真相（2026-10-25 老師第二十四次；規格 g3mid/CLAUDE.md）
 *
 * 範圍：課本 Classroom English 8 句、Numbers one～ten、Phonics Fun 1～4（26 個字）、Topic 1 New Friends（句型、Daily Talk、Story Time）。
 * 嚴禁洩題（老師第 3、8 點＋選擇題「考卷的字可以用，但問法不一樣」）：
 *   ① 每一個遊戲的題型都跟考卷不一樣（打地鼠、小精靈、夾娃娃、挖礦、魔鏡、金幣磚、皮克敏、英文對決擂台、連連看、空投）；
 *   ② 考卷的原題「字＋選項配對」不出現：A 大題 bag 配 d、girl 配 k、fish 配 h、egg 配 i、kite 配 l（打地鼠不用這 5 組）；
 *      D 大題 ant、monkey、cat、lion、jet（挖礦寫字母不考這 5 個）；E 大題 G→g、k→K、P→p、Q→q、J→j、e→E、h→H、Y→y（魔鏡不考這 8 組）；
 *      考卷的人名、歲數（Mike、Emma、Wendy、Roy 7、Sam 4、Ann 10、Lily 3）不用；build 時檢查（_build.js 的 LEAK）。
 * 每一題 o[0] ＝ 正確答案（畫面上會洗牌）。en ＝ 答錯頁的正確英文、zh ＝ 整句翻譯、say ＝ 要唸的英文。 */

/* ── 逐字中文（答錯頁：每一個英文字正下方 ＝ 中文）── */
var GL = {
  i: '我', "'m": '是', am: '是', is: '是', are: '是', my: '我的', your: '你的', you: '你', "you're": '你是', "'re": '是', name: '名字',
  what: '什麼', "what's": '什麼是', "'s": '是', how: '如何', old: '老的', years: '歲', year: '年', hi: '嗨', hello: '哈囉', hey: '嘿',
  nice: '很高興', to: '', meet: '認識', too: '也', thank: '謝謝', welcome: '受歡迎的', good: '好的', morning: '早上',
  can: '可以', "can't": '不能', find: '找到', dog: '狗', help: '幫忙', we: '我們', come: '來', here: '這裡',
  stand: '站', up: '起來', sit: '坐', down: '下', be: '要', quiet: '安靜的', please: '請', line: '排隊', open: '打開', close: '闔上',
  book: '書', raise: '舉起', put: '放', hand: '手', age: '年齡',
  one: '一', two: '二', three: '三', four: '四', five: '五', six: '六', seven: '七', eight: '八', nine: '九', ten: '十',
  ant: '螞蟻', bag: '袋子', cat: '貓', egg: '蛋', fish: '魚', girl: '女孩', hat: '帽子', insect: '昆蟲', jet: '噴射機', kite: '風箏',
  lion: '獅子', monkey: '猴子', nose: '鼻子', ox: '公牛', pig: '豬', queen: '女王', rabbit: '兔子', vest: '背心', window: '窗戶',
  fox: '狐狸', 'yo-yo': '溜溜球', zebra: '斑馬'
};
/* 2026-10-26 第二十六次：考卷 H 大題 的 Ken、Alan 也是 考卷 人名 ➜ 換成 Eric、Ryan（老師：人名 不可以 跟 期中考卷 一樣） */
var BOYS = ['Eric', 'Ryan', 'Ben', 'Tom', 'Max', 'Leo', 'Cody', 'Jack', 'Tim', 'Dan'];
var GIRLS = ['Amy', 'Mia', 'Kate', 'Lucy', 'Ivy', 'Nina', 'Jane', 'Zoe'];
var NAMES = BOYS.concat(GIRLS);
var NUMW = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
var NUMZ = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

/* ── 課本 Phonics Fun 1～4 的 26 個字（老師給的課本截圖）── */
var PH = [
  ['ant', '螞蟻', '🐜'], ['bag', '袋子', '👜'], ['cat', '貓', '🐱'], ['dog', '狗', '🐶'], ['egg', '蛋', '🥚'], ['fish', '魚', '🐟'],
  ['girl', '女孩', '👧'], ['hat', '帽子', '👒'], ['insect', '昆蟲', '🐞'], ['jet', '噴射機', '🛩️'], ['kite', '風箏', '🪁'], ['lion', '獅子', '🦁'],
  ['monkey', '猴子', '🐒'], ['nose', '鼻子', '👃'], ['ox', '公牛', '🐂'], ['pig', '豬', '🐷'], ['queen', '女王', '👸'], ['rabbit', '兔子', '🐰'],
  ['six', '六', '6️⃣'], ['ten', '十', '🔟'], ['up', '向上', '⬆️'], ['vest', '背心', '🦺'], ['window', '窗戶', '🪟'], ['fox', '狐狸', '🦊'],
  ['yo-yo', '溜溜球', '🪀'], ['zebra', '斑馬', '🦓']
];
var PHM = {}; PH.forEach(function (w) { PHM[w[0]] = w; });
/* 第三十三次 新 題庫 B 的 打地鼠、挖礦 多 用 三個 數字 字（課本 Numbers）*/
[['four', '四', '4️⃣'], ['five', '五', '5️⃣'], ['eight', '八', '8️⃣']].forEach(function (w) { PHM[w[0]] = w; });

/* ── 課本 Classroom English 8 句（照片 ＝ 老師給的截圖，img/）── */
var CE = [
  { k: 'standup', en: 'Stand up.', zh: '起立。', op: 'sitdown' },
  { k: 'sitdown', en: 'Sit down.', zh: '坐下。', op: 'standup' },
  { k: 'quiet', en: 'Be quiet, please.', zh: '請安靜。', op: 'lineup' },
  { k: 'lineup', en: 'Line up, please.', zh: '請排隊。', op: 'quiet' },
  { k: 'openbook', en: 'Open your book.', zh: '打開你的書。', op: 'closebook' },
  { k: 'closebook', en: 'Close your book.', zh: '闔上你的書。', op: 'openbook' },
  { k: 'raisehand', en: 'Raise your hand.', zh: '舉起你的手。', op: 'puthand' },
  { k: 'puthand', en: 'Put down your hand.', zh: '放下你的手。', op: 'raisehand' }
];

/* 容易聽錯／看錯的字母（打地鼠的誘答選項）*/
var LOOK = { a: 'eou', b: 'dpq', c: 'kse', d: 'bpt', e: 'aio', f: 'vth', g: 'qjy', h: 'nkf', i: 'ejy', j: 'gyi', k: 'cgq', l: 'itr', m: 'nwu', n: 'mhu', o: 'aue', p: 'bqd', q: 'gpk', r: 'lwn', s: 'zcx', t: 'dfl', u: 'oan', v: 'fwb', w: 'vmu', x: 'zsk', y: 'jig', z: 'sxc' };
/* 考卷 A 大題的原題（字 ＋ 那一個誘答字母）：打地鼠 不可以 出現 這一組 */
var EXAM_A = { bag: 'd', girl: 'k', fish: 'h', egg: 'i', kite: 'l' };

/* ════ 1 🔨 字母 打地鼠（考卷 A：聽單字 ➜ 第一個字母）════ */
var G1 = PH.filter(function (w) { return w[0] !== 'yo-yo'; }).map(function (w) {
  var f = w[0][0], ds = LOOK[f].split('').filter(function (c) { return EXAM_A[w[0]] !== c; }).slice(0, 3);
  return { say: w[0], o: [f].concat(ds), en: w[0], zh: w[0] + ' ＝ ' + w[1] + '，第一個字母是 ' + f + '。', ic: w[2], hl: 0 };
});

/* ════ 2 🟡 小精靈 聽句（考卷 B：聽句子 ➜ 找圖）════
   卡片：{t:名字, a:歲數}（名牌＋生日蛋糕）或 {sc:情境} */
/* 2026-10-26 第二十九次 第 3 點（老師：學生 看不懂 Good morning、Nice to meet you、Thank you、You're welcome 的 圖示，要 想 半天）➜ 每一張 一看 就 懂 的 小 場景：
   ic ＝ 一排 最多 3 個 大 圖（左 ➜ 右 一件 事）、b ＝ 右上角 小 泡泡
   thank 禮物 ➜ 收到 的 人 好開心（謝謝／不客氣）；meet 第一次 見面 握手（🆕 新 朋友）；morn 太陽 剛 出來＋揮手（🕖 早上 7 點）；help 哭、狗、❓ 找不到（🔍 找）；come 男生 舉手 叫、狗 跑過來 */
var SC = {
  thank: { ic: ['🎁', '➡️', '🥰'], b: '💖', fx: '' },
  meet: { ic: ['🧒', '🤝', '👧'], b: '🆕', fx: '' },
  help: { ic: ['😢', '🐶', '❓'], b: '🔍', fx: '' },
  come: { ic: ['🙋‍♂️', '⬅️', '🐕'], b: '', fx: '' },
  morn: { ic: ['🌅', '👋'], b: '🕖', fx: '' }
};
var G2 = [
  { say: [['m', "Hi, I'm Tom. I'm nine years old."]], o: [{ t: 'Tom', a: 9 }, { t: 'Tom', a: 5 }, { t: 'Ben', a: 9 }], zh: '嗨，我是 Tom。我九歲。' },
  { say: [['', "Hello, I'm Amy. I'm six."]], o: [{ t: 'Amy', a: 6 }, { t: 'Amy', a: 7 }, { t: 'Mia', a: 6 }], zh: '哈囉，我是 Amy。我六歲。' },
  { say: [['m', "Hi, I'm Ben. I'm eight years old."]], o: [{ t: 'Ben', a: 8 }, { t: 'Eric', a: 8 }, { t: 'Ben', a: 6 }], zh: '嗨，我是 Ben。我八歲。' },
  { say: [['', "Hello, I'm Kate. I'm ten."]], o: [{ t: 'Kate', a: 10 }, { t: 'Kate', a: 2 }, { t: 'Mia', a: 10 }], zh: '哈囉，我是 Kate。我十歲。' },
  { say: [['m', "Hi, I'm Max. I'm seven years old."]], o: [{ t: 'Max', a: 7 }, { t: 'Max', a: 6 }, { t: 'Jack', a: 7 }], zh: '嗨，我是 Max。我七歲。' },
  { say: [['', "Hello, I'm Mia. I'm four."]], o: [{ t: 'Mia', a: 4 }, { t: 'Mia', a: 5 }, { t: 'Amy', a: 4 }], zh: '哈囉，我是 Mia。我四歲。' },
  { say: [['', "Hi, I'm Lucy. I'm three years old."]], o: [{ t: 'Lucy', a: 3 }, { t: 'Lucy', a: 10 }, { t: 'Kate', a: 3 }], zh: '嗨，我是 Lucy。我三歲。' },
  { say: [['m', "Hello, I'm Leo. I'm five."]], o: [{ t: 'Leo', a: 5 }, { t: 'Leo', a: 9 }, { t: 'Ben', a: 5 }], zh: '哈囉，我是 Leo。我五歲。' },
  { say: [['', 'Thank you.'], ['m', "You're welcome."]], o: [{ sc: 'thank' }, { sc: 'meet' }, { sc: 'help' }], zh: '謝謝你。不客氣。' },
  { say: [['m', 'Nice to meet you.'], ['', 'Nice to meet you, too.']], o: [{ sc: 'meet' }, { sc: 'thank' }, { sc: 'morn' }], zh: '很高興認識你。我也很高興認識你。' },
  { say: [['', "I can't find my dog."], ['m', 'I can help you.']], o: [{ sc: 'help' }, { sc: 'come' }, { sc: 'thank' }], zh: '我找不到我的狗。我可以幫你。' },
  { say: [['m', 'Good morning.'], ['', 'Good morning.']], o: [{ sc: 'morn' }, { sc: 'meet' }, { sc: 'come' }], zh: '早安。早安。' },
  { say: [['m', 'Hey, Cody. Come here.']], o: [{ sc: 'come' }, { sc: 'help' }, { sc: 'morn' }], zh: '嘿，Cody。過來這裡。' }
];
G2.forEach(function (q) { q.en = q.say.map(function (s) { return s[1]; }).join(' '); });

/* ════ 3 🧸 教室 夾娃娃（考卷 C：Classroom English）════ 聽一句 ➜ 夾老師照片 */
var G3 = CE.map(function (c, i) {
  var others = CE.filter(function (x) { return x.k !== c.k && x.k !== c.op; }), pick = [others[(i * 3) % 6], others[(i * 3 + 2) % 6]];
  return { say: c.en, o: [c.k, c.op, pick[0].k, pick[1].k], en: c.en, zh: c.zh };
});

/* ════ 4 ⛏️ 挖礦 寫字母（考卷 D：聽單字 ➜ 寫第一個字母，小寫）════ 考卷的 ant monkey cat lion jet 不考 */
var EXAM_D = ['ant', 'monkey', 'cat', 'lion', 'jet'];
var G4 = PH.filter(function (w) { return EXAM_D.indexOf(w[0]) < 0; }).map(function (w) {
  return { say: w[0], want: w[0][0], ic: w[2], en: w[0], zh: w[0] + ' ＝ ' + w[1] + '，第一個字母是小寫 ' + w[0][0] + '。', hl: 0 };
});

/* ════ 5 🪞 大小寫 魔鏡（考卷 E：寫對應的大寫／小寫）════ 考卷那 8 組不考（反過來的可以） */
var EXAM_E = ['G>g', 'k>K', 'P>p', 'Q>q', 'J>j', 'e>E', 'h>H', 'Y>y'];
var G5 = [];
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (c, i) {
  var C = c.toUpperCase(), up = i % 2 === 0;   /* 一半 看大寫 寫小寫，一半 看小寫 寫大寫 */
  var show = up ? C : c, want = up ? c : C;
  if (EXAM_E.indexOf(show + '>' + want) >= 0) { show = up ? c : C; want = up ? C : c; }
  G5.push({ show: show, want: want, say: c, en: want, zh: (want === C ? '小寫 ' + c + ' 的大寫是 ' + C : '大寫 ' + C + ' 的小寫是 ' + c) + '。' });
});

/* ════ 6 ❓ 數字 金幣磚（考卷 F：看數字寫英文）════ 數一數圖 ➜ 照順序敲字母磚 */
var OBJ = ['🍄', '⭐', '🪙', '🍎', '🐢', '🌸', '🎈', '🐤', '🍓', '⚽'];
var EXTRA = { one: 'aw', two: 'wo', three: 'ea', four: 'ou', five: 'vi', six: 'cz', seven: 'vn', eight: 'ai', nine: 'ie', ten: 'ae' };
var G6 = [];
for (var n = 1; n <= 10; n++) for (var k = 0; k < 2; k++) {
  var w = NUMW[n], ex = EXTRA[w].split('');
  G6.push({ n: n, obj: OBJ[(n * 3 + k * 5) % OBJ.length], want: w, extra: k ? ex.concat(['r']) : ex, say: w, en: w, zh: n + ' ＝ ' + w + '（' + NUMZ[n] + '）。' });
}

/* ════ 7 🌱 皮克敏 搬字（考卷 G：選對的字填空）════ 拖一隻皮克敏（扛著字）到空格 */
var G7 = [
  { s: "I'm eight ___ old.", o: ['years', 'year', 'yes'], zh: '我八歲。' },
  { s: 'I ___ seven.', o: ['am', 'is', 'are'], zh: '我七歲。' },
  { s: '___ name is Ben.', o: ['My', 'I', 'Am'], zh: '我的名字是 Ben。' },
  { s: "What's ___ name?", o: ['your', 'you', 'I'], zh: '你叫什麼名字？' },
  { s: 'How old ___ you?', o: ['are', 'is', 'am'], zh: '你幾歲？' },
  { s: 'Nice to meet you, ___.', o: ['too', 'two', 'to'], zh: '我也很高興認識你。' },
  { s: '___ welcome.', o: ["You're", 'Your', 'You'], zh: '不客氣。' },
  { s: 'I can ___ you.', o: ['help', 'name', 'old'], zh: '我可以幫你。' },
  { s: "I can't ___ my dog.", o: ['find', 'name', 'old'], zh: '我找不到我的狗。' },
  { s: 'My name ___ Kate.', o: ['is', 'am', 'are'], zh: '我的名字是 Kate。' },
  { s: '___ old are you?', o: ['How', 'What', 'My'], zh: '你幾歲？' },
  { s: '___ your name?', o: ["What's", 'How', 'What'], zh: '你叫什麼名字？' },
  { s: 'Good ___.', o: ['morning', 'meet', 'name'], zh: '早安。' },
  { s: 'Thank ___.', o: ['you', 'your', 'too'], zh: '謝謝你。' },
  { s: '___ can help, too.', o: ['We', 'My', 'Your'], zh: '我們也可以幫忙。' },
  { s: "I'm Max. I'm nine ___ old.", o: ['years', 'year', 'yes'], zh: '我是 Max。我九歲。' }
];
G7.forEach(function (q) { q.en = q.s.replace('___', q.o[0]); q.say = q.en; });

/* ════ 8 ⚔ 英文 對決 擂台（考卷 H：選回應；2026-10-25 老師：「寶可夢」刪掉 ➜ 黑暗騎士 vs 學生 選 的 戰士）════ 對手說一句 ➜ 選出招（回答）；也有反過來：對手回答 ➜ 選他剛剛被問什麼 */
var G8 = [
  { a: "What's your name?", o: ["I'm Amy.", "I'm nine.", "You're welcome.", 'Good morning.'] },
  { a: 'How old are you?', o: ["I'm eight.", "I'm Eric.", 'Thank you.', 'Nice to meet you, too.'] },
  { a: 'Thank you.', o: ["You're welcome.", 'Thank you.', 'Nice to meet you.', 'I can help you.'] },
  { a: 'Nice to meet you.', o: ['Nice to meet you, too.', "You're welcome.", "I'm ten.", 'I can help you.'] },
  { a: "I can't find my dog.", o: ['I can help you.', "You're welcome.", 'Good morning.', "I'm nine."] },
  { a: 'Good morning.', o: ['Good morning.', "You're welcome.", 'Nice to meet you, too.', "I'm six."] },
  { a: "Hi, I'm Ben. What's your name?", o: ["I'm Mia.", "I'm seven.", 'Nice to meet you, too.', "You're welcome."] },
  { a: 'How old are you, Eric?', o: ["I'm ten.", "I'm Eric.", 'Good morning.', 'Thank you.'] },
  { a: 'I can help you.', o: ['Thank you.', "You're welcome.", 'Good morning.', "I'm six."] },
  { rev: 1, b: "I'm nine years old.", o: ['How old are you?', "What's your name?", 'Nice to meet you.', 'Good morning.'] },
  { rev: 1, b: 'My name is Max.', o: ["What's your name?", 'How old are you?', 'Thank you.', 'I can help you.'] },
  { rev: 1, b: "You're welcome.", o: ['Thank you.', 'Good morning.', 'How old are you?', "What's your name?"] },
  { rev: 1, b: 'Nice to meet you, too.', o: ['Nice to meet you.', 'Thank you.', 'I can help you.', 'How old are you?'] },
  { rev: 1, b: 'I can help you.', o: ["I can't find my dog.", 'Thank you.', 'Nice to meet you.', 'Good morning.'] }
];
var G8Z = {
  "What's your name?": '你叫什麼名字？', "I'm Amy.": '我是 Amy。', "I'm nine.": '我九歲。', "You're welcome.": '不客氣。', 'Good morning.': '早安。',
  'How old are you?': '你幾歲？', "I'm eight.": '我八歲。', "I'm Eric.": '我是 Eric。', 'Thank you.': '謝謝你。', 'Nice to meet you, too.': '我也很高興認識你。',
  'Nice to meet you.': '很高興認識你。', 'I can help you.': '我可以幫你。', "I'm ten.": '我十歲。', "I can't find my dog.": '我找不到我的狗。',
  "I'm six.": '我六歲。', "Hi, I'm Ben. What's your name?": '嗨，我是 Ben。你叫什麼名字？', "I'm Mia.": '我是 Mia。', "I'm seven.": '我七歲。',
  'How old are you, Eric?': 'Eric，你幾歲？', "I'm nine years old.": '我九歲。', 'My name is Max.': '我的名字是 Max。'
};
G8.forEach(function (q) {
  var A = q.rev ? q.o[0] : q.a, B = q.rev ? q.b : q.o[0];
  q.en = A + ' ' + B; q.zh = G8Z[A] + G8Z[B]; q.say = q.rev ? q.b : q.a;
});

/* ════ 9 📋 資料表 小幫手（2026-10-26 第二十六次 第 1-6 點，老師選 A：照 老師 截圖 的 題目「讀 自我介紹 ➜ 填 資料表」出 類似 的 題目）════
   3 個人 的 對話框（可以 點 🔊 聽）➜ 把 名字、歲數 的 方塊 拖進 資料表 的 空格。名字、歲數 全部 新的（考卷、課本 的 人名 都 不用；build 檢查）。
   對話框 4 種 說法（跟 截圖 一樣 多樣）：A Hi. My name is X. I'm N years old.／B I'm X. I'm N years old. Nice to meet you.／C My name is X. I'm N.／D Hello. I'm X. I'm N years old, too.（too ＝ 跟 上一個人 一樣 歲數）
   bl ＝ 每一列 空 哪一格（n ＝ 名字、a ＝ 歲數）；x ＝ 多 放 的 誘答 方塊（一個 名字、一個 數字） */
var G9T = { A: function (n, a) { return 'Hi. My name is ' + n + ". I'm " + NUMW[a] + ' years old.'; }, B: function (n, a) { return "I'm " + n + ". I'm " + NUMW[a] + ' years old. Nice to meet you.'; },
  C: function (n, a) { return 'My name is ' + n + ". I'm " + NUMW[a] + '.'; }, D: function (n, a) { return "Hello. I'm " + n + ". I'm " + NUMW[a] + ' years old, too.'; } };
var G9Z = { A: function (n, a) { return '嗨。我的 名字 是 ' + n + '。我 ' + NUMZ[a] + ' 歲。'; }, B: function (n, a) { return '我是 ' + n + '。我 ' + NUMZ[a] + ' 歲。很高興 認識 你。'; },
  C: function (n, a) { return '我的 名字 是 ' + n + '。我 ' + NUMZ[a] + ' 歲。'; }, D: function (n, a) { return '哈囉。我是 ' + n + '。我 也是 ' + NUMZ[a] + ' 歲。'; } };
var G9 = [
  [[['Ben', 9, 'A'], ['Kate', 10, 'B'], ['Max', 9, 'D']], 'ana', ['Mia', 8]],
  [[['Amy', 7, 'C'], ['Leo', 6, 'B'], ['Ivy', 6, 'D']], 'nan', ['Zoe', 9]],
  [[['Tom', 8, 'A'], ['Mia', 5, 'C'], ['Jack', 8, 'D']], 'aan', ['Dan', 3]],
  [[['Lucy', 10, 'B'], ['Dan', 4, 'A'], ['Zoe', 4, 'D']], 'naa', ['Nina', 7]],
  [[['Tim', 3, 'C'], ['Nina', 9, 'A'], ['Eric', 9, 'D']], 'ana', ['Kate', 5]],
  [[['Jane', 5, 'B'], ['Ryan', 7, 'C'], ['Cody', 7, 'D']], 'nna', ['Tim', 2]],
  [[['Ivy', 2, 'A'], ['Ben', 8, 'B'], ['Kate', 8, 'D']], 'ana', ['Amy', 6]],
  [[['Max', 6, 'C'], ['Amy', 10, 'A'], ['Leo', 10, 'D']], 'nan', ['Jack', 4]],
  [[['Zoe', 4, 'B'], ['Tom', 3, 'C'], ['Lucy', 3, 'D']], 'aan', ['Ryan', 9]],
  [[['Jack', 7, 'A'], ['Jane', 2, 'C'], ['Tim', 2, 'D']], 'naa', ['Eric', 5]]
].map(function (f) {
  var c = f[0].map(function (p) { return { t: p[0], a: p[1], w: NUMW[p[1]], s: p[2] }; }), lines = c.map(function (p) { return G9T[p.s](p.t, p.a); }),
    bl = f[1].split(''), need = c.map(function (p, i) { return bl[i] === 'n' ? p.t : String(p.a); });
  return { c: c, bl: bl, lines: lines, tl: need.concat([f[2][0], String(f[2][1])]), en: lines.join(' '),
    zh: c.map(function (p) { return G9Z[p.s](p.t, p.a); }).join(''), say: lines.join(' ') };
});

/* ════ 10 🪂 空投 密碼箱（1ESSF 鑰匙、車牌、座位號碼：聽數字）════ 聽 3 個數字 ➜ 點對的空投箱 */
var G10 = [[7, 2, 9], [3, 8, 6], [5, 1, 4], [9, 6, 2], [4, 7, 1], [8, 3, 5], [6, 9, 3], [2, 5, 8], [1, 4, 7], [9, 5, 7], [3, 6, 1], [8, 2, 4]].map(function (d) {
  var c = d.join(''), sw = [d[0] + '' + d[2] + d[1], d[1] + '' + d[0] + d[2], d[2] + '' + d[1] + d[0]];
  return { code: c, o: [c, sw[0], sw[1]], say: d.map(function (x) { return NUMW[x]; }).join(', ') + '.', en: d.map(function (x) { return NUMW[x]; }).join(' '),
    zh: c + ' ＝ ' + d.map(function (x) { return NUMZ[x]; }).join(' ') + '。' };
});

var GAMES = [
  { id: 'q1', ic: '🔨', nm: '字母 打地鼠', how: '聽單字 ➜ 敲 第一個字母 的 地鼠', t: 15, B: G1, c1: '#7B4A12', c2: '#C98A3A' },
  { id: 'q2', ic: '🟡', nm: '小精靈 聽句', how: '聽一聽 ➜ 🕹 方向鍵（按 一下 就 一直 走）帶 小精靈 走進 對的 房間；👻 碰到 ＝ 回 起點，不算 錯', t: 25, B: G2, c1: '#1F2A8C', c2: '#3E5BFF' },
  { id: 'q3', ic: '🧸', nm: '教室 夾娃娃', how: '聽 老師 說 ➜ ◀ LEFT／RIGHT ▶ 移動 夾子 ➜ ⬇ DROP 夾下去（也可以 直接 點 照片）', t: 15, B: G3, c1: '#B0306A', c2: '#FF6FAE' },
  { id: 'q4', ic: '⛏️', nm: '挖礦 寫字母', how: '聽單字 ➜ ① 點 對的 圖 ➜ ② 用手指 寫 第一個字母（小寫，頂天立地）', t: 20, B: G4, w: 1, c1: '#2E6B1F', c2: '#5FAE3B' },
  { id: 'q5', ic: '🪞', nm: '大小寫 魔鏡', how: '看 鏡子 裡 的 字母 ➜ 用手指 寫 它 的 另一半（頂天立地、不超線）', t: 20, B: G5, w: 1, c1: '#4A2C8C', c2: '#9C6BFF' },
  { id: 'q6', ic: '🧱', nm: '數字 金幣磚', how: '數一數 東西 一共 有 幾個 ➜ 照順序 敲 字母磚，用 英文 拼出 那個 數字', t: 20, B: G6, c1: '#A3420E', c2: '#F28C28' },
  { id: 'q7', ic: '🌱', nm: '皮克敏 搬字', how: '把 扛著 對的字 的 皮克敏 拖到 空格', t: 15, B: G7, c1: '#1D6B5A', c2: '#38C7A3' },
  { id: 'q8', ic: '⚔️', nm: '英文 對決 擂台', how: '反派 用 英文 出招 ➜ 你 選 對的 回答 ⚔ 反擊！打倒 DARK OVERLORD，再 打倒 SHADOW SCHEMER', t: 15, B: G8, c1: '#3A1A5A', c2: '#B01030' },
  { id: 'q9', ic: '📋', nm: '資料表 小幫手', how: '讀 3 個人 的 自我介紹（也可以 點 🔊 聽）➜ 把 名字、歲數 拖進 資料表 的 空格', t: 30, B: G9, c1: '#0E5C8A', c2: '#35A7E8' },
  { id: 'q10', ic: '🪂', nm: '空投 密碼箱', how: '聽 3 個 數字 ➜ 打開 對的 空投箱', t: 15, B: G10, c1: '#4D5B2A', c2: '#93A84A' }
];

/* 2026-10-26 第二十九次 第 7-(1) 點（老師）：關卡 順序 ＝ 第 9 關 夾娃娃、第 10 關 小精靈（其他 照 原本 的 順序）。
   GAMES 照 q1～q10 不動（題庫 第幾題、成績 代號、挑戰 題庫 XALL 都 照 這個）；大廳、25／50 題 挑戰、老師看板 大表 照 ORD 排 */
var ORD = ['q1', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q3', 'q2'];

/* 會唸的英文（語音檔）：'m:' ＝ 男聲 */
var SAY = [];
function addS(t, v) { SAY.push((v === 'm' ? 'm:' : '') + t); }
G1.forEach(function (q) { addS(q.say); });
G2.forEach(function (q) { q.say.forEach(function (s) { addS(s[1], s[0]); }); });
CE.forEach(function (c) { addS(c.en); });
G4.forEach(function (q) { addS(q.say); });
/* 字母名稱：照音標唸（2026-10-25 量過：直接唸「a.」會變 ㄜ（句子裡 a 一律 ㄜ 的規則）、「e.」聽成 eye）*/
var LN = { a: 'ˈeɪ', b: 'bˈiː', c: 'sˈiː', d: 'dˈiː', e: 'ˈiː', f: 'ˈɛf', g: 'dʒˈiː', h: 'ˈeɪtʃ', i: 'ˈaɪ', j: 'dʒˈeɪ', k: 'kˈeɪ', l: 'ˈɛl', m: 'ˈɛm',
  n: 'ˈɛn', o: 'ˈoʊ', p: 'pˈiː', q: 'kˈjuː', r: 'ˈɑːɹ', s: 'ˈɛs', t: 'tˈiː', u: 'jˈuː', v: 'vˈiː', w: 'dˈʌbəljuː', x: 'ˈɛks', y: 'wˈaɪ', z: 'zˈiː' };
Object.keys(LN).forEach(function (c) { SAY.push({ k: c + '.', ph: LN[c].split('').join(' ') + ' .' }); });
G6.forEach(function (q) { addS(q.say); });
G7.forEach(function (q) { addS(q.say); });
G8.forEach(function (q) { addS(q.a || q.b); addS(q.o[0]); addS(q.en); });
G9.forEach(function (q) { q.lines.forEach(function (l, i) { addS(l, BOYS.indexOf(q.c[i].t) >= 0 ? 'm' : ''); }); });
G10.forEach(function (q) { addS(q.say); });

/* ══ 2026-10-26 第二十八次 第 1、2 點：📝 25 題／50 題 挑戰 的 題庫（_exam_data.js）➜ 跟 上面 一樣 的 樣子（每一題 多 s：1 🔁 類似／0 🆕 全新）══ */
var XD0 = require('./_exam_data.js'), PL = require('./_pool.js');
XD0.XBOYS.concat(PL.BB).forEach(function (n) { if (BOYS.indexOf(n) < 0) BOYS.push(n); });
var NUMZ2 = NUMZ;
/* 2026-10-28 第三十三次（老師 C36「對」）：新 題目 的 整句 翻譯（小精靈、擂台）＝ 先 查 舊 的 字典，沒有 ＝ 照 句型 翻；翻 不出來 ＝ build 失敗 */
var ZS1 = [[/^(Hi|Hello)(,| !|!)? ?(my name is|I'm) (\w+)\.$/, function (m) { return (m[1] === 'Hi' ? '嗨' : '哈囉') + '，' + (m[3] === "I'm" ? '我是 ' : '我的名字是 ') + m[4] + '。'; }],
  [/^(Hi|Hello)!$/, function (m) { return m[1] === 'Hi' ? '嗨！' : '哈囉！'; }], [/^Oh no!$/, function () { return '噢，不！'; }], [/^Help!$/, function () { return '救命！'; }],
  [/^I'm (\w+) years old\.$/, function (m) { var k = NUMW.indexOf(m[1]); return k > 0 ? '我' + (k === 2 ? '兩' : NUMZ[k]) + '歲。' : null; }],
  [/^I'm (\w+)\.$/, function (m) { var k = NUMW.indexOf(m[1]); return k > 0 ? '我' + (k === 2 ? '兩' : NUMZ[k]) + '歲。' : '我是 ' + m[1] + '。'; }],
  [/^My name is (\w+)\.$/, function (m) { return '我的名字是 ' + m[1] + '。'; }], [/^Thank you(, (\w+))?\.$/, function (m) { return '謝謝你' + (m[2] ? '，' + m[2] : '') + '。'; }],
  [/^You're welcome(, (\w+))?\.$/, function (m) { return '不客氣' + (m[2] ? '，' + m[2] : '') + '。'; }], [/^Good morning(, (\w+))?\.$/, function (m) { return '早安' + (m[2] ? '，' + m[2] : '') + '。'; }],
  [/^Nice to meet you(, (\w+))?\.$/, function (m) { return '很高興認識你' + (m[2] ? '，' + m[2] : '') + '。'; }], [/^Nice to meet you, too\.$/, function () { return '我也很高興認識你。'; }],
  [/^(Hello|Hi), (\w+)\.$/, function (m) { return (m[1] === 'Hi' ? '嗨' : '哈囉') + '，' + m[2] + '。'; }], [/^(\w+)! Come here, please\.$/, function (m) { return m[1] + '！請過來這裡。'; }],
  [/^Come here, please\.$/, function () { return '請過來這裡。'; }], [/^I can't find my dog\.$/, function () { return '我找不到我的狗。'; }],
  [/^(We|I) can help you(, (\w+))?\.$/, function (m) { return (m[3] ? m[3] + '，' : '') + (m[1] === 'We' ? '我們' : '我') + '可以幫你。'; }],
  [/^How old are you(, (\w+))?\?$/, function (m) { return (m[2] ? m[2] + '，' : '') + '你幾歲？'; }], [/^What's your name\?$/, function () { return '你叫什麼名字？'; }]];
function ZS(s, D) { if (D && D[s]) return D[s];
  var parts = s.match(/[^.!?]+[.!?]+/g) || [s];
  if (parts.length > 1 && !/^(Nice to meet you, too\.|Hi|Hello)/.test(s) || parts.length > 1) { var out = parts.map(function (p) { p = p.trim(); for (var i = 0; i < ZS1.length; i++) { var m = ZS1[i][0].exec(p); if (m) { var z = ZS1[i][1](m); if (z) return z; } } return null; });
    if (out.every(Boolean)) return out.join(''); }
  for (var i = 0; i < ZS1.length; i++) { var m = ZS1[i][0].exec(s); if (m) { var z = ZS1[i][1](m); if (z) return z; } }
  throw new Error('三年級 複習 新 題目 翻 不出來：' + s); }
var CARD, X2Z, X8Z;
function mkXB(XD) { var XB = {};
XB.q1 = XD.X1.map(function (r) { var w = PHM[r[1]];
  return { s: r[0], say: r[1], up: 1, how: '聽單字 ➜ 敲 第一個字母（大寫）的 地鼠', o: [r[2]].concat(r[3].split('')), en: r[1], zh: r[1] + ' ＝ ' + w[1] + '，第一個字母 的 大寫 是 ' + r[2] + '。', ic: w[2], hl: 0 }; });
CARD = function (c) { var m = /^(\w+):(\d+)$/.exec(c); return m ? { t: m[1], a: +m[2] } : { sc: c }; };
X2Z = { "Hello, I'm Bill. I'm six years old.": '哈囉，我是 Bill。我六歲。', "Hi, I'm Helen. I'm nine.": '嗨，我是 Helen。我九歲。', "My name is Luke. I'm four years old.": '我的名字是 Luke。我四歲。',
  'Thank you, Mark.': '謝謝你，Mark。', "You're welcome, Sally.": '不客氣，Sally。', 'Hello, Ruby. Nice to meet you.': '哈囉，Ruby。很高興認識你。', 'Nice to meet you, too.': '我也很高興認識你。',
  'Good morning, Adam.': '早安，Adam。', 'Good morning, Molly.': '早安，Molly。', 'Ruby! Come here, please.': 'Ruby！請過來這裡。', "I can't find my dog.": '我找不到我的狗。', 'We can help you, Luke.': 'Luke，我們可以幫你。' };
XB.q2 = XD.X2.map(function (r) { return { s: r[0], say: r[1], o: [r[2], r[3], r[4]].map(CARD), en: r[1].map(function (x) { return x[1]; }).join(' '), zh: r[1].map(function (x) { return ZS(x[1], X2Z); }).join('') }; });
XB.q3 = XD.X3.map(function (r) { var ce = CE.filter(function (c) { return c.k === r[2]; })[0], w = /^w:/.test(r[2]) ? PHM[r[2].slice(2)] : null;
  return { s: r[0], say: r[1], o: [r[2]].concat(r[3]), en: r[1], zh: ce ? ce.zh : r[1] + ' ＝ ' + w[1] + '。' }; });
XB.q4 = XD.X4.map(function (r) { var w = PHM[r[1]]; return { s: r[0], say: r[1], want: r[2], ic: w[2], en: r[1], how: '聽單字 ➜ ① 點 對的 圖 ➜ ② 用手指 寫 第一個字母 的 大寫（頂天立地）', zh: r[1] + ' ＝ ' + w[1] + '，第一個字母 的 大寫 是 ' + r[2] + '。', hl: 0 }; });
XB.q5 = XD.X5.map(function (r) { var c = r[1], lo = c.toLowerCase(), U = c.toUpperCase(), up = c === U;
  return { s: r[0], lis: 1, how: '🔊 聽 一個 字母 ➜ 用手指 寫 它（大寫 還是 小寫 看 下面；頂天立地、不超線）', show: up ? lo : U, want: c, say: lo, en: c, zh: '聽到 字母 ' + lo + ' ➜ 寫 ' + (up ? '大寫 ' + U : '小寫 ' + lo) + '。' }; });
XB.q6 = XD.X6.map(function (r) { var n = r[1], w = NUMW[n];
  return { s: r[0], n: n, obj: r[2], ctx: r[3], want: w, extra: r[4].split(''), say: w, en: r[3] === 'cake' ? "I'm " + w + ' years old.' : w,
    zh: r[3] === 'cake' ? '我 ' + NUMZ2[n] + ' 歲。（' + n + ' ＝ ' + w + '）' : n + ' ＝ ' + w + '（' + NUMZ2[n] + '）。' }; });
XB.q7 = XD.X7.map(function (r) { var q = { s: r[0], s0: r[1], o: [r[2], r[3], r[4]], zh: r[5] }; q.en = r[1].replace('___', r[2]).replace(' — ', ' '); q.say = q.en; q.s = r[1]; q.sim = r[0]; return q; });
X8Z = { "Hello! What's your name?": '哈囉！你叫什麼名字？', "I'm Ruby.": '我是 Ruby。', 'How old are you, Adam?': 'Adam，你幾歲？', "I'm ten years old.": '我十歲。',
  'Nice to meet you, Mark.': '很高興認識你，Mark。', 'Nice to meet you, too.': '我也很高興認識你。', 'Good morning, Sally.': '早安，Sally。', 'Good morning, Luke.': '早安，Luke。',
  "I'm nine.": '我九歲。', 'How old are you?': '你幾歲？', 'My name is Molly.': '我的名字是 Molly。', "What's your name?": '你叫什麼名字？',
  'Good morning, Mark.': '早安，Mark。', 'Good morning, Ruby.': '早安，Ruby。', "Hello, I'm Mark.": '哈囉，我是 Mark。', "Hi, Mark. I'm Ruby.": '嗨，Mark。我是 Ruby。' };
XB.q8 = XD.X8.map(function (r) { var q = r[1] ? { rev: 1, b: r[2], o: [r[3]].concat(r[4]) } : { a: r[2], o: [r[3]].concat(r[4]) }, A = q.rev ? q.o[0] : q.a, B = q.rev ? q.b : q.o[0];
  q.sim = r[0]; q.en = A + ' ' + B; q.zh = ZS(A, X8Z) + ZS(B, X8Z); q.say = q.rev ? q.b : q.a; return q; });
XB.q9 = XD.X9.map(function (f) { var c = f[1].map(function (p) { return { t: p[0], a: p[1], w: NUMW[p[1]], s: p[2] }; }), lines = c.map(function (p) { return G9T[p.s](p.t, p.a); }),
    bl = f[2].split(''), need = c.map(function (p, i) { return bl[i] === 'n' ? p.t : String(p.a); });
  return { s: f[0], c: c, bl: bl, lines: lines, tl: need.concat([f[3][0], String(f[3][1])]), en: lines.join(' '), zh: c.map(function (p) { return G9Z[p.s](p.t, p.a); }).join(''), say: lines.join(' ') }; });
XB.q10 = XD.X10.map(function (r) { var d = r[1].split('').map(Number), c = r[1], L = d.length,
    sw = L === 3 ? [d[0] + '' + d[2] + d[1], d[1] + '' + d[0] + d[2]] : [d[1] + '' + d[0] + d[2] + d[3], d[0] + '' + d[1] + d[3] + d[2]];
  return { s: r[0], code: c, o: [c].concat(sw), say: d.map(function (x) { return NUMW[x]; }).join(', ') + '.', en: d.map(function (x) { return NUMW[x]; }).join(' '),
    zh: c + ' ＝ ' + d.map(function (x) { return NUMZ2[x]; }).join(' ') + '。' }; });
/* q7、q8 的 s 是 句子／反派 那一句，類似 標記 用 sim */
['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q9', 'q10'].forEach(function (id) { XB[id].forEach(function (q) { q.sim = q.s; }); });
['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q9', 'q10'].forEach(function (id) { XB[id].forEach(function (q) { if (id !== 'q9') delete q.s; else delete q.s; }); });
/* 要唸 的 */
XB.q2.forEach(function (q) { q.say.forEach(function (x) { addS(x[1], x[0]); }); });
XB.q3.forEach(function (q) { addS(q.say); });
XB.q6.forEach(function (q) { addS(q.say); if (q.ctx === 'cake') addS(q.en); });
XB.q7.forEach(function (q) { addS(q.say); });
XB.q8.forEach(function (q) { addS(q.a || q.b); addS(q.o[0]); addS(q.en); });
XB.q9.forEach(function (q) { q.lines.forEach(function (l, i) { addS(l, BOYS.indexOf(q.c[i].t) >= 0 ? 'm' : ''); }); });
XB.q10.forEach(function (q) { addS(q.say); });
XB.q4.forEach(function (q) { addS(q.say); });
  return XB; }
/* 題庫 A（25／50 題）＝ 原本 _exam_data.js 8 題 ＋ _pool.js PA 6 題 ＝ 每種 14 題（老師 C36「對」）；題庫 B（新 25／新 50）＝ PB 每種 14 題 */
var XDA = { XBOYS: XD0.XBOYS }, XN0 = {};
for (var xn = 1; xn <= 10; xn++) { XN0['q' + xn] = XD0['X' + xn].length; XDA['X' + xn] = XD0['X' + xn].concat(PL.PA['X' + xn]); }
var XB = mkXB(XDA), XB2 = mkXB(PL.PB);
/* 挑戰 題庫 的「第幾題」（成績 用）：原本 80 題 的 順序 不變（舊 成績 對得上），新 的 60 題 接在 後面 ＝ [遊戲, 那一種 的 第幾題] */
var XORD = [];
['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'].forEach(function (id) { for (var j = 0; j < XN0[id]; j++) XORD.push([id, j]); });
['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'].forEach(function (id) { for (var j = XN0[id]; j < XB[id].length; j++) XORD.push([id, j]); });
var XORD2 = [];
['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'].forEach(function (id) { for (var j = 0; j < XB2[id].length; j++) XORD2.push([id, j]); });

/* ══ 2026-10-26 第二十九次 第 1 點：🏫 三年級 課堂複習 1、2、3（_class_data.js，老師 C31 說「對」）➜ 跟 G1～G10 一樣 的 樣子（CB.c1.q1…）══
   只能 在〔⚡ 現場任務〕開（g3mid/index.html?cr=…，老師 大螢幕 選），在家複習 沒有；成績 g3gm_c1-q1…（老師看板〔🏫 課堂複習〕大表）。
   整句 翻譯（答錯頁 用）：CZH 一句 一句 翻（名字、數字 自動 換）；翻 不出來 ＝ build 失敗（_build.js 檢查） */
var CD = require('./_class_data.js'), CB = {};
CD.SETS.forEach(function (x) { var nm = CD.NAMES[x[0]]; nm.b.forEach(function (n) { if (BOYS.indexOf(n) < 0) BOYS.push(n); }); });
var CZT = [[/^Hi, I'm (\w+)\.$/, '嗨，我是 $1。'], [/^Hello, I'm (\w+)\.$/, '哈囉，我是 $1。'], [/^Hello\.$/, '哈囉。'], [/^Hi\.$/, '嗨。'],
  [/^I'm (\w+)\.$/, function (m, a) { var n = NUMW.indexOf(a); return n > 0 ? '我 ' + NUMZ[n] + ' 歲。' : '我是 ' + a + '。'; }], [/^I'm (\w+) years old\.$/, function (m, a) { return '我 ' + NUMZ[NUMW.indexOf(a)] + ' 歲。'; }],
  [/^What's your name\?$/, '你叫什麼名字？'], [/^What's your name, please\?$/, '請問 你叫什麼名字？'], [/^My name is (\w+)\.$/, '我的 名字 是 $1。'], [/^How old are you\?$/, '你 幾 歲？'], [/^How old are you, (\w+)\?$/, '$1，你 幾 歲？'],
  [/^Thank you\.$/, '謝謝 你。'], [/^Thank you, (\w+)\.$/, '謝謝 你，$1。'], [/^You're welcome\.$/, '不客氣。'], [/^You're welcome, (\w+)\.$/, '不客氣，$1。'],
  [/^Good morning\.$/, '早安。'], [/^Good morning, (\w+)\.$/, '早安，$1。'], [/^Come here, please\.$/, '請 過來 這裡。'], [/^Come here, (\w+)\.$/, '$1，過來 這裡。'], [/^Hey, (\w+)\.$/, '嘿，$1。'], [/^Come here\.$/, '過來 這裡。'],
  [/^I can't find my dog\.$/, '我 找不到 我的 狗。'], [/^Hi, (\w+)\.$/, '嗨，$1。'], [/^We can help, too\.$/, '我們 也 可以 幫忙。'], [/^We can help you\.$/, '我們 可以 幫 你。'], [/^I can help you\.$/, '我 可以 幫 你。'], [/^I can help you, (\w+)\.$/, '$1，我 可以 幫 你。'],
  [/^Nice to meet you\.$/, '很高興 認識 你。'], [/^Nice to meet you, too\.$/, '我 也 很高興 認識 你。'], [/^Nice to meet you, (\w+)\.$/, '很高興 認識 你，$1。']];
function CZH(t) { var L = String(t).match(/[^.?!]+[.?!]/g) || [t]; return L.map(function (c) { c = c.trim(); for (var i = 0; i < CZT.length; i++) if (CZT[i][0].test(c)) return c.replace(CZT[i][0], CZT[i][1]); throw new Error('課堂複習 翻不出來：' + c); }).join(''); }
var CEZ = {}; CE.forEach(function (c) { CEZ[c.k] = c.zh; });
CD.SETS.forEach(function (x) { var k = x[0], B = CB[k] = {};
  B.q1 = CD.Q1[k].map(function (r) { var w = PHM[r[1]], up = r[4] === 'U';
    return { sim: r[0], say: r[1], up: up ? 1 : 0, how: up ? '聽單字 ➜ 敲 第一個字母（大寫）的 地鼠' : undefined, o: [r[2]].concat(r[3].split('')), en: r[1], zh: r[1] + ' ＝ ' + w[1] + '，第一個字母' + (up ? ' 的 大寫' : '') + ' 是 ' + r[2] + '。', ic: w[2], hl: 0 }; });
  B.q2 = CD.Q2[k].map(function (r) { return { sim: r[0], say: r[1], o: [r[2], r[3], r[4]].map(CARD), en: r[1].map(function (y) { return y[1]; }).join(' '), zh: r[1].map(function (y) { return CZH(y[1]); }).join('') }; });
  B.q3 = CD.Q3[k].map(function (r) { var w = /^w:/.test(r[2]) ? PHM[r[2].slice(2)] : null; return { sim: r[0], say: r[1], o: [r[2]].concat(r[3]), en: r[1], zh: CEZ[r[2]] || r[1] + ' ＝ ' + w[1] + '。' }; });
  B.q4 = CD.Q4[k].map(function (r) { var w = PHM[r[1]], up = r[2] !== r[2].toLowerCase();
    return { sim: r[0], say: r[1], want: r[2], ic: w[2], en: r[1], how: up ? '聽單字 ➜ ① 點 對的 圖 ➜ ② 用手指 寫 第一個字母 的 大寫（頂天立地）' : undefined, zh: r[1] + ' ＝ ' + w[1] + '，第一個字母' + (up ? ' 的 大寫' : '（小寫）') + ' 是 ' + r[2] + '。', hl: 0 }; });
  B.q5 = CD.Q5[k].map(function (r) { var lo = r[1].toLowerCase(), U = r[1].toUpperCase(); return { sim: r[0], show: r[1], want: r[2], say: lo, en: r[2], zh: (r[2] === U ? '小寫 ' + lo + ' 的大寫是 ' + U : '大寫 ' + U + ' 的小寫是 ' + lo) + '。' }; });
  B.q6 = CD.Q6[k].map(function (r) { var n = r[1], w = NUMW[n], cx = r[3] === 'hand' ? '' : r[3];
    return { sim: r[0], n: n, obj: r[2], ctx: cx, want: w, extra: EXTRA[w].split(''), say: w, en: cx === 'cake' ? "I'm " + w + ' years old.' : w, zh: cx === 'cake' ? '我 ' + NUMZ[n] + ' 歲。（' + n + ' ＝ ' + w + '）' : n + ' ＝ ' + w + '（' + NUMZ[n] + '）。' }; });
  B.q7 = CD.Q7[k].map(function (r) { var q = { sim: r[0], s: r[1], o: [r[2], r[3], r[4]], zh: r[5] }; q.en = r[1].replace('___', r[2]).replace(' — ', ' '); q.say = q.en; return q; });
  B.q8 = CD.Q8[k].map(function (r) { var q = r[1] ? { rev: 1, b: r[2], o: [r[3]].concat(r[4]) } : { a: r[2], o: [r[3]].concat(r[4]) }, A = q.rev ? q.o[0] : q.a, Bq = q.rev ? q.b : q.o[0];
    q.sim = r[0]; q.en = A + ' ' + Bq; q.zh = CZH(A) + CZH(Bq); q.say = q.rev ? q.b : q.a; return q; });
  B.q9 = CD.Q9[k].map(function (f) { var c = f[1].map(function (p) { return { t: p[0], a: p[1], w: NUMW[p[1]], s: p[2] }; }), lines = c.map(function (p) { return G9T[p.s](p.t, p.a); }),
      bl = f[2].split(''), need = c.map(function (p, i) { return bl[i] === 'n' ? p.t : String(p.a); });
    return { sim: f[0], c: c, bl: bl, lines: lines, tl: need.concat([f[3][0], String(f[3][1])]), en: lines.join(' '), zh: c.map(function (p) { return G9Z[p.s](p.t, p.a); }).join(''), say: lines.join(' ') }; });
  B.q10 = CD.Q10[k].map(function (r) { var d = r[1].split('').map(Number), c = r[1], L = d.length, sw = L === 3 ? [d[0] + '' + d[2] + d[1], d[1] + '' + d[0] + d[2]] : [d[1] + '' + d[0] + d[2] + d[3], d[0] + '' + d[1] + d[3] + d[2]];
    return { sim: r[0], code: c, o: [c].concat(sw), say: d.map(function (x) { return NUMW[x]; }).join(', ') + '.', en: d.map(function (x) { return NUMW[x]; }).join(' '), zh: c + ' ＝ ' + d.map(function (x) { return NUMZ[x]; }).join(' ') + '。' }; });
  B.q1.concat(B.q4).forEach(function (q) { if (q.how === undefined) delete q.how; });
  /* 要唸 的 */
  B.q1.forEach(function (q) { addS(q.say); }); B.q2.forEach(function (q) { q.say.forEach(function (y) { addS(y[1], y[0]); }); }); B.q3.forEach(function (q) { addS(q.say); }); B.q4.forEach(function (q) { addS(q.say); });
  B.q6.forEach(function (q) { addS(q.say); if (q.ctx === 'cake') addS(q.en); }); B.q7.forEach(function (q) { addS(q.say); }); B.q8.forEach(function (q) { addS(q.a || q.b); addS(q.o[0]); addS(q.en); });
  B.q9.forEach(function (q) { q.lines.forEach(function (l, i) { addS(l, BOYS.indexOf(q.c[i].t) >= 0 ? 'm' : ''); }); }); B.q10.forEach(function (q) { addS(q.say); }); });

/* 2026-10-26 第二十六次 第 1-1 點（老師：打地鼠 單字 模糊、太快）：打地鼠 的 字 另外 做 慢的（audio/m1 語速 0.78）、更慢的（audio/m2 語速 0.62，〔🐢 慢慢 唸〕）*/
var SAYM = G1.map(function (q) { return q.say; }).concat(XB.q1.concat(XB2.q1).map(function (q) { return q.say; })).concat([].concat.apply([], Object.keys(CB).map(function (k) { return CB[k].q1.map(function (q) { return q.say; }); }))).filter(function (x, i, a) { return a.indexOf(x) === i; });
module.exports = { XB2: XB2, XORD: XORD, XORD2: XORD2, XN0: XN0, CB: CB, CSETS: CD.SETS, CZH: CZH, ORD: ORD, XB: XB, SAYM: SAYM, GL: GL, PH: PH, PHM: PHM, CE: CE, SC: SC, GAMES: GAMES, SAY: SAY, BOYS: BOYS, GIRLS: GIRLS, NUMW: NUMW,
  EXAM_A: EXAM_A, EXAM_D: EXAM_D, EXAM_E: EXAM_E };
