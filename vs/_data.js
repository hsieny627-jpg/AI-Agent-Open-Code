/* vs/_data.js — ⚔️ 左右 對戰（兩人 一台 iPad，左半 給 左邊 的 人、右半 給 右邊 的 人）的 題庫（2026-11-14 第五十四次）
 *
 * 老師 決定（需求檔 sentences/2026-10-16_C_需求與問題.md 第四節 最下面「第五十四次」）：
 *   預設「戊 各自 闖關 PK」＝ 左右「同 一個 句型、只 換 一個 字」的 配對 題（正確 答案 一定 不一樣 ➜ 偷瞄 沒有 用）；
 *   乙／丙 ＝ 同 一題、選項 位置 不同（丙 再 加 防抄：按了 只 顯示 🔒、兩 人 都 答完 才 同時 公布）。
 * 🔒 題目、選項 全 英文（Andika）；錯 的 選項 一律 跟 答案 相近（每 一個 錯 選項 只 錯 一個 點，h ＝ 那一個 點 的 秒懂 說明）。
 * 每 一題：{ f 句型 代號, w 換 的 那個 字, cue 圖示（大）, cuet 圖示 下面 的 英文, q 題目, o [正解, 錯1, 錯2, 錯3], h [null, 錯1 為什麼, …],
 *           say 要 唸 的 英文（要 有 預錄 語音，_build.js 查 不到 ＝ build 失敗）, ag 逐字 中文 [[英文, 中文]…], az 整句 中文（詞 和 詞 空 一格）}
 * ⚠ 題目 的 順序（第幾題）＝ 老師看板 錯題 分析 用 的 編號 ➜ **只 可以 接 在 後面 加，不可以 刪、不可以 換 順序**。
 * 人名 ＝ 三年級 題庫 B 已經 檢查 過（不是 考卷、課本 用 的）的 名字。 */
const ZH = { one: '一', two: '二', three: '三', four: '四', five: '五', six: '六', seven: '七', eight: '八', nine: '九', ten: '十', eleven: '十一', twelve: '十二',
  thirteen: '十三', fourteen: '十四', fifteen: '十五', sixteen: '十六', seventeen: '十七', eighteen: '十八', nineteen: '十九', twenty: '二十' };
const NUMV = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20 };
/* 數字 拼法／聲音 相近 的 錯 選項（三年級 只用 one～twelve）*/
const NEAR3 = { two: ['ten', 'three', 'twelve'], three: ['two', 'ten', 'eight'], four: ['five', 'nine', 'one'], five: ['four', 'nine', 'six'], six: ['seven', 'five', 'ten'],
  seven: ['eleven', 'six', 'ten'], eight: ['eleven', 'nine', 'three'], nine: ['five', 'one', 'ten'], ten: ['two', 'twelve', 'eleven'], eleven: ['seven', 'twelve', 'ten'], twelve: ['two', 'eleven', 'ten'] };
const NEAR4 = { eleven: ['seven', 'twelve', 'seventeen'], twelve: ['twenty', 'two', 'eleven'], thirteen: ['three', 'fourteen', 'eighteen'], nineteen: ['nine', 'eighteen', 'twenty'], fifteen: ['five', 'fourteen', 'sixteen'] };
const WHO = { brother: ['👦', '哥哥', 'sister'], dad: ['👨', '爸爸', 'mom'], grandpa: ['👴', '爺爺', 'grandma'], sister: ['👧', '姊姊', 'brother'], mom: ['👩', '媽媽', 'dad'], grandma: ['👵', '奶奶', 'grandpa'] };
const JOB = { doctor: ['🩺', '醫生'], nurse: ['💉', '護理師'], teacher: ['📚', '老師'], cook: ['🍳', '廚師'], farmer: ['🌾', '農夫'], student: ['🎒', '學生'] };
const JNEAR = { doctor: 'nurse', nurse: 'doctor', teacher: 'student', student: 'teacher', cook: 'farmer', farmer: 'cook' };
const AP = '’';

/* ══ 三年級（Unit 1 What’s your name?／Unit 2 How old are you?）══ */
const G3 = [];
/* ① 🎂 How old are you? ➜ I’m ___ years old.（整句 的 樣子：years 要 有 s、要 有 old）*/
['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'].forEach(w => G3.push({ f: 'age', w, cue: '🎂', cuet: String(NUMV[w]), q: 'How old are you?',
  o: ['I' + AP + 'm ' + w + ' years old.', 'I' + AP + 'm ' + w + ' year old.', 'I' + AP + 'm ' + w + ' old.', 'I' + AP + 'm ' + w + ' years.'],
  h: [null, '兩歲 以上 ＝ years（要 有 s）', '少了 years：數字 ＋ years old', '少了 old：數字 ＋ years old'],
  say: 'I' + AP + 'm ' + w + ' years old.', ag: [['I' + AP + 'm', '我 是'], [w, ZH[w]], ['years old', '歲']], az: '我 ' + ZH[w] + ' 歲。' }));
/* ② 🔢 I’m ___ years old.（看 數字 選 英文 字）*/
Object.keys(NEAR3).forEach(w => G3.push({ f: 'num', w, cue: '🎂', cuet: String(NUMV[w]), q: 'I' + AP + 'm ___ years old.',
  o: [w].concat(NEAR3[w]), h: [null].concat(NEAR3[w].map(x => x + ' ＝ ' + NUMV[x] + '，' + w + ' ＝ ' + NUMV[w])),
  say: 'I' + AP + 'm ' + w + ' years old.', ag: [['I' + AP + 'm', '我 是'], [w, ZH[w]], ['years old', '歲']], az: '我 ' + ZH[w] + ' 歲。' }));
/* ③ 🏷️ What’s your name? ➜ I’m ___.（I’m ＝ I am）*/
['Bella', 'Daisy', 'Holly', 'Penny', 'Nate'].forEach(n => G3.push({ f: 'name', w: n, cue: '🏷️', cuet: n, q: 'What' + AP + 's your name?',
  o: ['I' + AP + 'm ' + n + '.', 'I' + AP + 'm is ' + n + '.', 'My name ' + n + '.', 'I ' + n + '.'],
  h: [null, 'I' + AP + 'm ＝ I am，後面 不 再 加 is', 'My name 後面 要 有 is', 'I 後面 要 有 ' + AP + 'm（I' + AP + 'm ＝ 我 是）'],
  say: 'I' + AP + 'm ' + n + '.', ag: [['I' + AP + 'm', '我 是'], [n, n]], az: '我 是 ' + n + '。' }));
/* ④ 💬 看 回答 ➜ 選 問句（幾歲 的 回答、名字 的 回答 配對：兩邊 的 正確 答案 一定 不一樣）*/
['ten', 'nine', 'eight', 'seven'].forEach(w => G3.push({ f: 'ask', w: 'a-' + w, cue: '💬', cuet: 'I' + AP + 'm ' + w + '.', q: 'Which question?',
  o: ['How old are you?', 'What' + AP + 's your name?', 'How old is you?', 'How are you?'],
  h: [null, 'What' + AP + 's your name? 問 名字', 'you 要 配 are：How old are you?', 'How are you? 問 你 好 嗎'],
  say: 'How old are you? I' + AP + 'm ' + w + '.', ag: [['How old', '幾 歲'], ['are', '是'], ['you', '你']], az: '你 幾 歲？' }));
['Daisy', 'Holly', 'Penny', 'Bella'].forEach(n => G3.push({ f: 'ask', w: 'n-' + n, cue: '💬', cuet: 'I' + AP + 'm ' + n + '.', q: 'Which question?',
  o: ['What' + AP + 's your name?', 'How old are you?', 'What' + AP + 's you name?', 'What' + AP + 's your names?'],
  h: [null, 'How old are you? 問 幾 歲', 'you ＝ 你，your ＝ 你的：your name', 'name 只有 一個，不 加 s'],
  say: 'What' + AP + 's your name?', ag: [['What', '什麼'], [AP + 's', '是'], ['your', '你的'], ['name', '名字']], az: '你的 名字 是 什麼？' }));

/* ══ 四年級（Unit 1 Who’s he?／Unit 2 Is he a doctor?）══ */
const G4 = [];
/* ⑤ 👦 Who’s he? ➜ He’s my ___.*/
['brother', 'dad', 'grandpa'].forEach(w => G4.push({ f: 'whoh', w, cue: WHO[w][0], cuet: '', q: 'Who' + AP + 's he?',
  o: ['He' + AP + 's my ' + w + '.', 'She' + AP + 's my ' + w + '.', 'His my ' + w + '.', 'He' + AP + 's my ' + WHO[w][2] + '.'],
  h: [null, '男生 ＝ He' + AP + 's（他 是），She' + AP + 's ＝ 她 是', 'His ＝ 他的；他 是 ＝ He' + AP + 's', '圖 是 ' + WHO[w][1] + '（' + w + '），' + WHO[w][2] + ' ＝ ' + WHO[WHO[w][2]][1]],
  say: 'He' + AP + 's my ' + w + '.', ag: [['He' + AP + 's', '他 是'], ['my', '我的'], [w, WHO[w][1]]], az: '他 是 我的 ' + WHO[w][1] + '。' }));
/* ⑥ 👧 Who’s she? ➜ She’s my ___.*/
['sister', 'mom', 'grandma'].forEach(w => G4.push({ f: 'whos', w, cue: WHO[w][0], cuet: '', q: 'Who' + AP + 's she?',
  o: ['She' + AP + 's my ' + w + '.', 'He' + AP + 's my ' + w + '.', 'She my ' + w + '.', 'She' + AP + 's my ' + WHO[w][2] + '.'],
  h: [null, '女生 ＝ She' + AP + 's（她 是），He' + AP + 's ＝ 他 是', 'She 後面 要 有 ' + AP + 's（She' + AP + 's ＝ She is）', '圖 是 ' + WHO[w][1] + '（' + w + '），' + WHO[w][2] + ' ＝ ' + WHO[WHO[w][2]][1]],
  say: 'She' + AP + 's my ' + w + '.', ag: [['She' + AP + 's', '她 是'], ['my', '我的'], [w, WHO[w][1]]], az: '她 是 我的 ' + WHO[w][1] + '。' }));
/* ⑦ 🩺 He’s / She’s ___.（職業 前面 a）*/
[['he', '👨', 'He'], ['she', '👩', 'She']].forEach(([s, ic, S]) => ['doctor', 'nurse', 'teacher', 'cook', 'farmer', 'student'].forEach(w => G4.push({ f: 'job' + s, w, cue: ic + JOB[w][0], cuet: '', q: S + AP + 's ___.',
  o: ['a ' + w, w, 'an ' + w, 'a ' + JNEAR[w]],
  h: [null, '職業 前面 要 有 a（一位）', w + ' 第一個 字母 不是 a e i o u ➜ 用 a', '圖 是 ' + JOB[w][1] + '（' + w + '），' + JNEAR[w] + ' ＝ ' + JOB[JNEAR[w]][1]],
  say: S + AP + 's a ' + w + '.', ag: [[S + AP + 's', (s === 'he' ? '他' : '她') + ' 是'], ['a', '一位'], [w, JOB[w][1]]], az: (s === 'he' ? '他' : '她') + ' 是 一位 ' + JOB[w][1] + '。' })));
/* ⑧ ❓ Is he a ___?（「不是」的 組合 ＝ 已經 有 預錄 語音 的 那些） ➜ Yes, he is.／No, he isn’t. He’s a ___.（是 跟 不是 配對：兩邊 正確 答案 不一樣）*/
[['he', '👨', 'He', 'She'], ['she', '👩', 'She', 'He']].forEach(([s, ic, S, O]) => {
  ['cook', 'doctor', 'farmer', 'nurse', 'student', 'teacher'].forEach(w => G4.push({ f: 'yn' + s, w: 'y-' + w, cue: ic + JOB[w][0], cuet: '', q: 'Is ' + s + ' a ' + w + '?',
    o: ['Yes, ' + s + ' is.', 'Yes, ' + s + AP + 's.', 'Yes, ' + O.toLowerCase() + ' is.', 'No, ' + s + ' isn' + AP + 't.'],
    h: [null, 'Yes 的 回答 不 縮寫：Yes, ' + s + ' is.', '問 ' + s + ' 就 答 ' + s, '圖 就是 ' + JOB[w][1] + ' ➜ Yes'],
    say: 'Is ' + s + ' a ' + w + '? Yes, ' + s + ' is.', ag: [['Yes', '是的'], [s, s === 'he' ? '他' : '她'], ['is', '是']], az: '是的，' + (s === 'he' ? '他' : '她') + ' 是。' }));
  (s === 'he' ? [['cook', 'doctor'], ['cook', 'farmer'], ['cook', 'nurse'], ['doctor', 'cook'], ['doctor', 'nurse'], ['farmer', 'nurse'], ['farmer', 'student'], ['nurse', 'doctor'], ['nurse', 'farmer'], ['nurse', 'teacher'],
    ['student', 'doctor'], ['student', 'teacher'], ['teacher', 'cook'], ['teacher', 'doctor'], ['teacher', 'student']]
   : [['cook', 'nurse'], ['cook', 'student'], ['doctor', 'teacher'], ['farmer', 'cook'], ['farmer', 'doctor'], ['farmer', 'teacher'], ['nurse', 'cook'], ['nurse', 'student'], ['student', 'cook'], ['student', 'nurse'],
    ['teacher', 'doctor'], ['teacher', 'farmer']]).forEach(([a, b]) => G4.push({ f: 'yn' + s, w: 'n-' + a + '-' + b, cue: ic + JOB[b][0], cuet: '', q: 'Is ' + s + ' a ' + a + '?',
    o: ['No, ' + s + ' isn' + AP + 't. ' + S + AP + 's a ' + b + '.', 'Yes, ' + s + ' is. ' + S + AP + 's a ' + b + '.', 'No, ' + s + ' is. ' + S + AP + 's a ' + b + '.', 'No, ' + s + ' isn' + AP + 't. ' + S + AP + 's a ' + a + '.'],
    h: [null, '圖 是 ' + JOB[b][1] + '，不是 ' + JOB[a][1] + ' ➜ No', 'No 要 配 isn' + AP + 't（不是）', (s === 'he' ? '他' : '她') + ' 不是 ' + JOB[a][1] + '，是 ' + JOB[b][1] + '（' + b + '）'],
    say: 'Is ' + s + ' a ' + a + '? No, ' + s + ' isn' + AP + 't. ' + S + AP + 's a ' + b + '.', ag: [['No', '不'], [s, s === 'he' ? '他' : '她'], ['isn' + AP + 't', '不是'], [S + AP + 's', (s === 'he' ? '他' : '她') + ' 是'], ['a', '一位'], [b, JOB[b][1]]],
    az: '不，' + (s === 'he' ? '他' : '她') + ' 不是。' + (s === 'he' ? '他' : '她') + ' 是 一位 ' + JOB[b][1] + '。' }));
});
/* ⑨ 🎂 He’s ___.（十幾 歲）*/
[['he', '👦', 'He', ['eleven', 'twelve', 'thirteen', 'nineteen']], ['she', '👧', 'She', ['eleven', 'fifteen']]].forEach(([s, ic, S, L]) => L.forEach(w => G4.push({ f: 'age4', w: s + '-' + w, cue: ic + '🎂', cuet: String(NUMV[w]), q: S + AP + 's ___.',
  o: [w].concat(NEAR4[w]), h: [null].concat(NEAR4[w].map(x => x + ' ＝ ' + NUMV[x] + '，' + w + ' ＝ ' + NUMV[w])),
  say: S + AP + 's ' + w + '.', ag: [[S + AP + 's', (s === 'he' ? '他' : '她') + ' 是'], [w, ZH[w] + ' 歲']], az: (s === 'he' ? '他' : '她') + ' ' + ZH[w] + ' 歲。' })));

/* 句型 的 名字（老師看板、平板 上面 小字）*/
const FN = { age: '🎂 幾 歲（整句）', num: '🔢 數字', name: '🏷️ 我 的 名字', ask: '💬 選 問句', whoh: '👦 他 是 誰', whos: '👧 她 是 誰', jobhe: '🩺 他 的 職業', jobshe: '🩺 她 的 職業', ynhe: '❓ Is he…?', ynshe: '❓ Is she…?', age4: '🎂 十幾 歲' };
/* 逐字 中文 的 英文 字 帶 上 標點（No, ／ teacher. ／ name?）：照 要 唸 的 句子 一個 一個 對 */
[G3, G4].forEach(L => L.forEach(q => { let at = 0; q.ag = q.ag.map(([w, z]) => { const i = q.say.indexOf(w, at); if (i < 0) return [w, z]; let j = i + w.length; while (/[,.?!]/.test(q.say.charAt(j))) j++; at = j; return [q.say.slice(i, j), z]; }); }));
module.exports = { BANK: { 3: G3, 4: G4 }, FN };
