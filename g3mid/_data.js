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
var SC = {
  thank: { ic: ['👦', '🎁', '👧'], fx: '💖' },
  meet: { ic: ['👦', '🤝', '👧'], fx: '✨' },
  help: { ic: ['👧', '🔍', '🐶❓'], fx: '' },
  come: { ic: ['👦', '👋', '🐕'], fx: '💨' },
  morn: { ic: ['🌅', '👋', '👋'], fx: '' }
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

/* 2026-10-26 第二十六次 第 1-1 點（老師：打地鼠 單字 模糊、太快）：打地鼠 的 字 另外 做 慢的（audio/m1 語速 0.78）、更慢的（audio/m2 語速 0.62，〔🐢 慢慢 唸〕）*/
var SAYM = G1.map(function (q) { return q.say; });
module.exports = { SAYM: SAYM, GL: GL, PH: PH, PHM: PHM, CE: CE, SC: SC, GAMES: GAMES, SAY: SAY, BOYS: BOYS, GIRLS: GIRLS, NUMW: NUMW,
  EXAM_A: EXAM_A, EXAM_D: EXAM_D, EXAM_E: EXAM_E };
