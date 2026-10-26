/* midterm/_data.js — 四年級 期中複習（2026-10-19 老師第十三次 3(11)）：題庫的唯一真相來源
 *
 * 老師的要求：把期中考卷（1ESSF000001 題目卷、115 學年度上學期四年級期中評量＋聽力稿）的**每一種題型**變成複習遊戲；
 * **嚴禁洩題、嚴禁一模一樣的題目**：換字、換問法、換題型。至少 10 種；只放在老師的教學總首頁「四年級 期中複習」；
 * Classroom English 的照片一律用老師給的截圖（midterm/img/，_crop 寫在 midterm/CLAUDE.md）。
 *
 * 考卷題型 ➜ 這裡的遊戲（考卷的字、句子都換掉了；對照表在 midterm/CLAUDE.md）：
 *   聽 圈字首 b d p t ＝ m1 🎈 字首音 氣球　　聽 兩個字首音 O／X ＝ m2 👯 聲音 雙胞胎
 *   聽 句子 勾圖 ＝ m3 📸 聽句 找照片　　聽 Classroom English 排順序 ＝ m4 🏫 教室 指令王　　聽 數字 排順序 ＝ m5 🎯 數字 神射手
 *   讀 對話 選答句 ＝ m6 💬 聊天室 接話　　看圖 寫單字 ＝ m7 ✍️ 拼字 救援　　讀 短文 回答 ＝ m8 🕵️ 短文 偵探
 *   看 家庭樹 選 ＝ m9 🌳 家族樹 尋人　　看 字庫 寫 對話 ＝ m10 🧩 對話 工廠　　看圖 回答 Yes／No ＝ m11 ✅ 是不是 快問快答
 *   容易 錯 的 地方（He’s／His、Who’s／What’s、Is／Are、he is／she is、twelve／twenty）＝ m12 🪤 陷阱 偵測器
 *
 * 每一題：o ＝ 選項（o[0] ＝ 正解）、q ＝ 題目（老師看板錯題分析看的字）、z ＝ 正解的中文、say ＝ 要唸的英文（聽力題）。
 * 圖（人物 ＋ 職業小圖示）：P(人, 職業) ＝ 'mom|doctor' 這種代號，網頁畫成卡片（聽力題不寫字）。 */
const P = (who, job) => who + (job ? '|' + job : '');
const WHO = { dad: ['👨', '爸爸'], mom: ['👩', '媽媽'], brother: ['👦', '哥哥'], sister: ['👧', '姊姊'], grandpa: ['👴', '爺爺'], grandma: ['👵', '奶奶'], me: ['🙋', '我'] };
const JOB = { doctor: ['🩺', '醫生'], nurse: ['💉', '護理師'], teacher: ['📚', '老師'], cook: ['🍳', '廚師'], farmer: ['🌾', '農夫'], student: ['🎒', '學生'] };
const picZh = p => { const [w, j] = p.split('|'); return WHO[w][1] + (j ? '・' + JOB[j][1] : ''); };

/* 🎈 m1 字首音 氣球：聽一個字，點它的第一個字母（b／d／p／t）。考卷的字（bed、tod、pit、dan）一個都不用 */
const W1 = [['bag', '👜', '包包'], ['bell', '🔔', '鈴'], ['box', '📦', '盒子'], ['ball', '⚽', '球'], ['dog', '🐶', '狗'], ['doll', '🪆', '娃娃'], ['door', '🚪', '門'], ['desk', '🗄️', '書桌'],
  ['pen', '🖊️', '筆'], ['pig', '🐷', '豬'], ['panda', '🐼', '貓熊'], ['pot', '🍲', '鍋子'], ['ten', '🔟', '十'], ['tiger', '🐯', '老虎'], ['tent', '⛺', '帳篷'], ['toy', '🧸', '玩具']];
const LET = ['b', 'd', 'p', 't'];
const M1 = W1.map(([w, ic, zh]) => ({ say: w, ic, w, q: '🔊 聽：' + w + '　第一個字母是？', o: [w[0]].concat(LET.filter(x => x !== w[0])), z: w + '（' + zh + '）', h: '第一個 音 ＝ ' + w[0] }));

/* 👯 m2 聲音 雙胞胎：聽兩個字，第一個音一樣 ⭕、不一樣 ❌（考卷的 bus／bod、pit／big… 不用） */
const W1M = {}; W1.forEach(x => { W1M[x[0]] = x; });
const PAIRS = [['bell', 'ball'], ['dog', 'desk'], ['pig', 'pen'], ['tent', 'toy'], ['panda', 'pot'], ['box', 'bag'], ['door', 'doll'],
  ['bag', 'dog'], ['door', 'tiger'], ['pot', 'box'], ['ten', 'desk'], ['doll', 'ball'], ['pig', 'tent'], ['bell', 'pen']];
const M2 = PAIRS.map(([a, b]) => { const same = a[0] === b[0];
  return { say: a + '. ' + b + '.', pair: [a, b], q: '🔊 聽：' + a + '、' + b + '　第一個音？', o: same ? ['⭕ 一樣', '❌ 不一樣'] : ['❌ 不一樣', '⭕ 一樣'],
    z: a + ' 是 ' + a[0] + '，' + b + ' 是 ' + b[0] + ' ➜ ' + (same ? '一樣' : '不一樣'), h: a[0] + ' ／ ' + b[0] }; });

/* 📸 m3 聽句 找照片：聽一段對話，點對的那一張（三張圖，不寫字）。考卷的 6 句一句都不用 */
const M3 = [
  ['Is your mom a teacher? Yes, she is.', P('mom', 'teacher'), [P('dad', 'teacher'), P('mom', 'cook')], '你的 媽媽 是 老師 嗎？是的，她 是。'],
  ['Is your grandpa a farmer? No, he isn’t. He’s a cook.', P('grandpa', 'cook'), [P('grandpa', 'farmer'), P('grandma', 'cook')], '你的 爺爺 是 農夫 嗎？不，他 不是。他 是 廚師。'],
  ['Is your sister a student? Yes, she is.', P('sister', 'student'), [P('brother', 'student'), P('sister', 'doctor')], '你的 姊姊 是 學生 嗎？是的，她 是。'],
  ['Who’s she? She’s my mother.', P('mom'), [P('grandma'), P('sister')], '她 是 誰？她 是 我的 媽媽。'],
  ['Is your brother a doctor? No, he isn’t. He’s a nurse.', P('brother', 'nurse'), [P('brother', 'doctor'), P('sister', 'nurse')], '你的 哥哥 是 醫生 嗎？不，他 不是。他 是 護理師。'],
  ['Is your dad a farmer? Yes, he is.', P('dad', 'farmer'), [P('dad', 'cook'), P('mom', 'farmer')], '你的 爸爸 是 農夫 嗎？是的，他 是。'],
  ['Who’s he? He’s my grandfather.', P('grandpa'), [P('dad'), P('grandma')], '他 是 誰？他 是 我的 爺爺。'],
  ['Is your grandma a doctor? Yes, she is.', P('grandma', 'doctor'), [P('grandma', 'nurse'), P('grandpa', 'doctor')], '你的 奶奶 是 醫生 嗎？是的，她 是。'],
  ['Is your mom a nurse? No, she isn’t. She’s a farmer.', P('mom', 'farmer'), [P('mom', 'nurse'), P('dad', 'farmer')], '你的 媽媽 是 護理師 嗎？不，她 不是。她 是 農夫。'],
  ['Who’s she? She’s my sister.', P('sister'), [P('brother'), P('mom')], '她 是 誰？她 是 我的 姊姊。'],
  ['Is your brother a cook? Yes, he is.', P('brother', 'cook'), [P('sister', 'cook'), P('brother', 'farmer')], '你的 哥哥 是 廚師 嗎？是的，他 是。'],
  ['Is your father a teacher? No, he isn’t. He’s a doctor.', P('dad', 'doctor'), [P('dad', 'teacher'), P('mom', 'doctor')], '你的 爸爸 是 老師 嗎？不，他 不是。他 是 醫生。']
].map(([s, a, b, zh]) => ({ say: s, pic: 1, q: '🔊 聽：' + s, o: [a].concat(b), oz: [a].concat(b).map(picZh), z: zh, ae: s }));

/* 🏫 m4 教室 指令王：聽老師說的話，點對的照片（老師給的 Classroom English 照片 8 張） */
const CE = [['Let’s go.', 'letsgo', '我們 走 吧。'], ['Hurry up.', 'hurryup', '快 一點。'], ['Don’t talk.', 'donttalk', '不要 說話。'], ['Don’t run.', 'dontrun', '不要 跑。'],
  ['Show me your homework.', 'homework', '給 我 看 你的 作業。'], ['Time’s up.', 'timesup', '時間 到 了。'], ['Turn on the light.', 'lighton', '打開 燈。'], ['Turn off the light.', 'lightoff', '關掉 燈。']];
/* 每一句兩題、錯的照片不一樣（容易混的放在一起：開燈／關燈、不要說話／不要跑、走吧／快一點） */
const NEAR = { lighton: 'lightoff', lightoff: 'lighton', donttalk: 'dontrun', dontrun: 'donttalk', letsgo: 'hurryup', hurryup: 'letsgo', homework: 'timesup', timesup: 'homework' };
const M4 = [];
CE.forEach(([s, im, zh], i) => [0, 1].forEach(t => {
  const others = CE.map(x => x[1]).filter(x => x !== im && x !== NEAR[im]), k = (i * 3 + t * 2) % others.length;
  const o = [im, NEAR[im], others[k], others[(k + 3) % others.length]];
  M4.push({ say: s, photo: 1, q: '🔊 聽：' + s, o, oz: o.map(x => CE.filter(y => y[1] === x)[0][0]), z: s + '　' + zh, ae: s });
}));

/* 🎯 m5 數字 神射手：聽數字，射中對的靶（11～20；容易混的：twelve／twenty、thirteen／fourteen、seventeen／eighteen） */
const NUM = [[11, 'eleven'], [12, 'twelve'], [13, 'thirteen'], [14, 'fourteen'], [15, 'fifteen'], [16, 'sixteen'], [17, 'seventeen'], [18, 'eighteen'], [19, 'nineteen'], [20, 'twenty']];
const NTRAP = { 11: [12, 7, 17], 12: [20, 2, 11], 13: [14, 3, 15], 14: [13, 4, 15], 15: [16, 5, 14], 16: [15, 6, 17], 17: [18, 7, 16], 18: [17, 8, 19], 19: [18, 9, 20], 20: [12, 2, 19] };
const M5 = NUM.map(([n, w]) => ({ say: w, num: 1, q: '🔊 聽：' + w, o: [String(n)].concat(NTRAP[n].map(String)), z: w + ' ＝ ' + n, ae: w }));

/* 💬 m6 聊天室 接話：A 說了一句，選 B 最對的回答（考卷、題目卷的對話一句都不用） */
const M6 = [
  ['A', 'Who’s he?', ['He’s my grandpa.', 'Yes, he is.', 'She’s my grandma.'], '他 是 誰？➜ 他 是 我的 爺爺。'],
  ['A', 'Is she your sister?', ['Yes, she is.', 'Yes, he is.', 'She’s a teacher.'], '她 是 你的 姊姊 嗎？➜ 是的，她 是。'],
  ['A', 'Sorry, I’m late.', ['Come in, please.', 'Nice to meet you.', 'Yes, he is.'], '對不起，我 遲到 了。➜ 請 進。'],
  ['A', 'Have a seat, please.', ['Thank you.', 'I’m sorry.', 'Who’s she?'], '請 坐。➜ 謝謝 你。'],
  ['A', 'This is my mom.', ['Nice to meet you.', 'Come in, please.', 'Yes, she is.'], '這 是 我的 媽媽。➜ 很 高興 認識 你。'],
  ['A', 'Nice to meet you.', ['Nice to meet you, too.', 'Come in, please.', 'I’m sorry.'], '很 高興 認識 你。➜ 我 也 很 高興 認識 你。'],
  ['B', 'She’s my mom.', ['Who’s she?', 'Who’s he?', 'Is she a cook?'], '她 是 誰？➜ 她 是 我的 媽媽。'],
  ['A', 'Is he a farmer? No, he isn’t.', ['He’s a cook.', 'She’s a cook.', 'He’s a farmer.'], '他 是 農夫 嗎？不，他 不是。➜ 他 是 廚師。'],
  ['A', 'Is your dad a student?', ['No, he isn’t. He’s a teacher.', 'No, she isn’t. She’s a teacher.', 'Yes, he isn’t.'], '你的 爸爸 是 學生 嗎？➜ 不，他 不是。他 是 老師。'],
  ['A', 'Is your sister a nurse?', ['Yes, she is.', 'Yes, he is.', 'Yes, she isn’t.'], '你的 姊姊 是 護理師 嗎？➜ 是的，她 是。'],
  ['B', 'Yes, he is.', ['Is your grandpa a cook?', 'Who’s he?', 'Is your grandma a cook?'], '你的 爺爺 是 廚師 嗎？➜ 是的，他 是。']
].map(([who, line, o, zh]) => ({ chat: who, line, q: who === 'A' ? 'A：' + line + '　B 要 回答？' : 'B 回答：' + line + '　A 問了 什麼？', o, z: zh, ae: o[0] }));

/* ✍️ m7 拼字 救援：看圖、看中文，把中間的字母點出來（考卷的 sister、father、teacher、nurse、cook、twenty 不考） */
const M7 = [['brother', '👦', '哥哥'], ['mother', '👩', '媽媽'], ['doctor', '🩺', '醫生'], ['farmer', '🌾', '農夫'], ['student', '🎒', '學生'], ['grandma', '👵', '奶奶'],
  ['grandpa', '👴', '爺爺'], ['twelve', '12', '十二'], ['fifteen', '15', '十五'], ['eighteen', '18', '十八'], ['eleven', '11', '十一'], ['dad', '👨', '爸爸']]
  .map(([w, ic, zh]) => ({ spell: w, ic, zhw: zh, q: '✍️ 拼字：' + zh + '（' + w[0] + '＿' + w.slice(-1) + '）', o: [w, '（拼錯）'], z: w + ' ＝ ' + zh, ae: w }));

/* 🕵️ m8 短文 偵探：讀一段短文，回答；答完那一句「證據」會亮起來（考卷的 Amy 短文不用，人、歲數、職業都換掉） */
const PAS = {
  ken: { t: ['Hi, I’m Ken. I’m eleven.', 'This is my grandma. She’s a cook.', 'This is my dad. He’s a nurse.', 'This is my sister. She’s fifteen. She’s a student.'],
    z: ['嗨，我 是 Ken。我 十一 歲。', '這 是 我的 奶奶。她 是 廚師。', '這 是 我的 爸爸。他 是 護理師。', '這 是 我的 姊姊。她 十五 歲。她 是 學生。'] },
  mia: { t: ['Hello, I’m Mia. I’m twelve.', 'This is my father. He’s a farmer.', 'This is my grandma. She’s a doctor.', 'This is my brother. He’s nineteen. He’s a cook.'],
    z: ['哈囉，我 是 Mia。我 十二 歲。', '這 是 我的 爸爸。他 是 農夫。', '這 是 我的 奶奶。她 是 醫生。', '這 是 我的 哥哥。他 十九 歲。他 是 廚師。'] }
};
const M8 = [
  ['ken', 'Ken 幾 歲？', ['eleven', 'fifteen', 'twelve'], 0], ['ken', 'Ken 的 奶奶 是 ___。', ['a cook', 'a nurse', 'a student'], 1],
  ['ken', 'Ken 的 爸爸 是 ___。', ['a nurse', 'a cook', 'a doctor'], 2], ['ken', 'Ken 的 姊姊 幾 歲？', ['fifteen', 'eleven', 'fifty'], 3],
  ['ken', '誰 是 學生？', ['Ken 的 姊姊', 'Ken 的 爸爸', 'Ken 的 奶奶'], 3],
  ['mia', 'Mia 幾 歲？', ['twelve', 'twenty', 'nineteen'], 0], ['mia', 'Mia 的 爸爸 是 ___。', ['a farmer', 'a doctor', 'a cook'], 1],
  ['mia', '誰 是 醫生？', ['Mia 的 奶奶', 'Mia 的 爸爸', 'Mia 的 哥哥'], 2], ['mia', 'Mia 的 哥哥 幾 歲？', ['nineteen', 'nine', 'ninety'], 3],
  ['mia', 'Mia 的 哥哥 是 ___。', ['a cook', 'a farmer', 'a student'], 3]
].map(([p, q, o, ev]) => ({ pas: p, ev, q: '📖 ' + q, o, z: PAS[p].t[ev] + '　' + PAS[p].z[ev], ae: PAS[p].t[ev] }));

/* 🌳 m9 家族樹 尋人：讀一句，點家族樹上對的那一個人（考卷是看人選字，這裡反過來：看字點人） */
const TREE = ['grandpa', 'grandma', 'dad', 'mom', 'brother', 'sister'];
const M9 = [['She’s my grandma.', 'grandma'], ['He’s my father.', 'dad'], ['She’s my mother.', 'mom'], ['He’s my grandfather.', 'grandpa'], ['She’s my sister.', 'sister'],
  ['He’s my brother.', 'brother'], ['She’s my grandmother.', 'grandma'], ['He’s my dad.', 'dad'], ['She’s my mom.', 'mom'], ['He’s my grandpa.', 'grandpa']]
  .map(([s, who]) => { const M = { grandpa: 1, dad: 1, brother: 1 }, gen = { grandpa: 0, grandma: 0, dad: 1, mom: 1, brother: 2, sister: 2 };
    /* 四個 選項（老師看板 錯題 分析 用）：同 性別 的 另外 兩個 ＋ 同一代 的 異性；點到 家族樹 上 其他 人 ＝ 算 選 第 4 個 */
    const o = [who].concat(TREE.filter(x => x !== who && !!M[x] === !!M[who]), TREE.filter(x => gen[x] === gen[who] && x !== who));
    return { tree: 1, line: s, q: '🌳 ' + s + '　點 這一個 人', o, oz: o.map(x => WHO[x][1]), z: s + '　' + (s.charAt(0) === 'H' ? '他' : '她') + ' 是 我的 ' + WHO[who][1] + '。', ae: s }; });

/* 🧩 m10 對話 工廠：對話少一個字，從字庫點一個填進去（題目卷是字庫寫對話，這裡換句子、一次一格） */
const M10 = [
  ['A: Is she a cook? B: No, she ___. She’s a nurse.', ['isn’t', 'is', 'he', 'not'], '', '她 是 廚師 嗎？不，她 不是。她 是 護理師。'],
  ['A: Who’s he? B: ___ my father.', ['He’s', 'His', 'She’s', 'He'], '', '他 是 誰？他 是 我的 爸爸。'],
  ['A: ___ she your mom? B: Yes, she is.', ['Is', 'Are', 'Who’s', 'Am'], '', '她 是 你的 媽媽 嗎？是的，她 是。'],
  ['A: Is your brother a farmer? B: Yes, ___ is.', ['he', 'she', 'his', 'him'], '', '你的 哥哥 是 農夫 嗎？是的，他 是。'],
  ['A: ___ she? B: She’s my grandma.', ['Who’s', 'What’s', 'Is', 'How'], '', '她 是 誰？她 是 我的 奶奶。'],
  ['A: Is he a teacher? B: No, he isn’t. He’s a ___.', ['doctor', 'teacher', 'nurse', 'cook'], P('dad', 'doctor'), '他 是 老師 嗎？不，他 不是。他 是 醫生。'],
  ['This is my brother. ___ name is Tom.', ['His', 'He’s', 'He', 'She’s'], '', '這 是 我的 哥哥。他的 名字 是 Tom。'],
  ['A: Is your grandpa a ___? B: Yes, he is.', ['farmer', 'cook', 'student', 'teacher'], P('grandpa', 'farmer'), '你的 爺爺 是 農夫 嗎？是的，他 是。'],
  ['My mom ___ a nurse.', ['is', 'are', 'am', 'be'], '', '我的 媽媽 是 護理師。'],
  ['A: Is your sister a student? B: ___, she is.', ['Yes', 'No', 'Is', 'She'], '', '你的 姊姊 是 學生 嗎？是的，她 是。'],
  ['A: Is he a cook? B: ___, he isn’t. He’s a farmer.', ['No', 'Yes', 'Is', 'He'], '', '他 是 廚師 嗎？不，他 不是。他 是 農夫。'],
  ['He’s a student. ___ eleven.', ['He’s', 'His', 'She’s', 'He'], '', '他 是 學生。他 十一 歲。']
].map(([s, o, pic, zh]) => ({ blank: s, pic: pic || '', q: '🧩 ' + s, o, z: zh, ae: s.replace('___', o[0]) }));

/* ✅ m11 是不是 快問快答：看圖，選對的回答（he／she 要跟著人；職業對不對） */
const M11 = [
  [P('mom', 'doctor'), 'Is she a nurse?', 'No, she isn’t.'], [P('dad', 'cook'), 'Is he a cook?', 'Yes, he is.'], [P('grandpa', 'farmer'), 'Is he a teacher?', 'No, he isn’t.'],
  [P('sister', 'student'), 'Is she a student?', 'Yes, she is.'], [P('brother', 'nurse'), 'Is he a nurse?', 'Yes, he is.'], [P('grandma', 'teacher'), 'Is she a cook?', 'No, she isn’t.'],
  [P('mom', 'farmer'), 'Is she a farmer?', 'Yes, she is.'], [P('dad', 'doctor'), 'Is he a farmer?', 'No, he isn’t.'], [P('brother', 'student'), 'Is he a student?', 'Yes, he is.'],
  [P('grandma', 'doctor'), 'Is she a doctor?', 'Yes, she is.'], [P('sister', 'cook'), 'Is she a nurse?', 'No, she isn’t.'], [P('grandpa', 'cook'), 'Is he a cook?', 'Yes, he is.']
].map(([pic, qq, a]) => { const he = /\bhe\b/i.test(qq), all = he ? ['Yes, he is.', 'No, he isn’t.', 'Yes, she is.', 'No, she isn’t.'] : ['Yes, she is.', 'No, she isn’t.', 'Yes, he is.', 'No, he isn’t.'];
  return { yn: 1, pic, line: qq, q: '✅ 看圖：' + qq, o: [a].concat(all.filter(x => x !== a)), z: qq + ' ➜ ' + a + '（圖：' + picZh(pic) + '）', ae: a }; });

/* 🪤 m12 陷阱 偵測器：最容易錯的地方，三個裡面兩個是陷阱 */
/* 2026-10-26 第二十七次 6-(5)：答錯頁 ＝ 整句 翻譯（fz）＋ 💡 為什麼（tip）分開 寫 */
const M12Z = [['看！他 是 一位 廚師。', 'He’s ＝ He is（他 是）；His ＝ 他的'], ['他 是 誰？他 是 我的 哥哥。', '問「誰」用 Who’s；What’s ＝ 什麼 是'], ['你的 爸爸 是 護理師 嗎？', '一個 人 ➜ 用 Is'],
  ['她 是 老師 嗎？是的，她 是。', '句子 最後 的 she is 不可以 縮寫 成 she’s'], ['你的 爺爺 是 農夫 嗎？不，他 不是。', '爺爺 是 男生 ➜ he；No ➜ isn’t'], ['我的 姊姊 是 一位 學生。', 'student 第一個 音 不是 母音 ➜ a student'],
  ['他 是 你的 哥哥 嗎？', '哥哥 是 男生 ➜ he'], ['她 是 誰？她 是 我的 奶奶。', '奶奶 是 女生 ➜ She’s'], ['twelve ＝ 12', 'twelve ＝ 12；twenty ＝ 20'],
  ['seventeen ＝ 17', '-teen ＝ 十幾：seventeen ＝ 17；seventy ＝ 70'], ['你的 媽媽 是 廚師 嗎？是的，她 是。', '媽媽 ➜ she；Yes ➜ is'], ['他 是 誰？他 是 我的 叔叔。', 'He’s ＝ He is（他 是）']];
const M12 = [
  ['Look! ___ a cook.', ['He’s', 'His', 'He'], '看！他 是 廚師。He’s ＝ He is；His ＝ 他的。'],
  ['___ he? He’s my brother.', ['Who’s', 'What’s', 'Who'], '他 是 誰？問 人 用 Who’s。'],
  ['___ your dad a nurse?', ['Is', 'Are', 'Who’s'], '你的 爸爸 是 護理師 嗎？一個 人 用 Is。'],
  ['Is she a teacher? Yes, ___.', ['she is', 'she’s', 'he is'], '句子 最後 的 is 不可以 縮寫。'],
  ['Is your grandpa a farmer? No, ___.', ['he isn’t', 'she isn’t', 'he is'], '爺爺 是 男生 ➜ he；No ➜ isn’t。'],
  ['My sister is ___ student.', ['a', 'an', 'is'], '一位 學生 ＝ a student。'],
  ['Is ___ your brother?', ['he', 'she', 'his'], '哥哥 是 男生 ➜ he。'],
  ['Who’s she? ___ my grandma.', ['She’s', 'He’s', 'Her'], '奶奶 是 女生 ➜ She’s。'],
  ['twelve ＝ ?', ['12', '20', '2'], 'twelve ＝ 12；twenty ＝ 20。'],
  ['seventeen ＝ ?', ['17', '70', '7'], '-teen ＝ 十幾。'],
  ['Is your mom a cook? Yes, ___.', ['she is', 'he is', 'she isn’t'], '媽媽 ➜ she；Yes ➜ is。'],
  ['Who’s he? ___ my uncle. ', ['He’s', 'His', 'He'], '他 是 我的 叔叔。He’s ＝ He is。']
].map(([s, o, h], i) => ({ blank: s.trim(), q: '🪤 ' + s.trim(), o, z: h, h, ae: /[A-Za-z]/.test(o[0]) && /___/.test(s) ? s.trim().replace('___', o[0]) : '', fz: M12Z[i][0], tip: M12Z[i][1] }));

/* 遊戲：id、圖示、名字、一句話怎麼玩、哪一區、每一題幾秒、題庫 */
const GAMES = [
  { id: 'm1', ic: '🎈', nm: '字首音 氣球', how: '聽 一個 字，射破 它 第一個 字母 的 氣球。', sec: 'lis', t: 12, B: M1 },
  { id: 'm2', ic: '👯', nm: '聲音 雙胞胎', how: '聽 兩個 字：第一個 音 一樣 ⭕，不一樣 ❌。', sec: 'lis', t: 12, B: M2 },
  { id: 'm3', ic: '📸', nm: '聽句 找照片', how: '聽 一段 對話，點 對 的 那一張 圖。', sec: 'lis', t: 20, B: M3 },
  { id: 'm4', ic: '🏫', nm: '教室 指令王', how: '聽 老師 說 的 話，點 對 的 照片。', sec: 'lis', t: 15, B: M4 },
  { id: 'm5', ic: '🎯', nm: '數字 神射手', how: '聽 數字，射中 對 的 靶。', sec: 'lis', t: 10, B: M5 },
  { id: 'm6', ic: '💬', nm: '聊天室 接話', how: '看 聊天 訊息，選 最對 的 那一句。', sec: 'read', t: 18, B: M6 },
  { id: 'm8', ic: '🕵️', nm: '短文 偵探', how: '讀 短文 找 證據，回答 問題。', sec: 'read', t: 25, B: M8 },
  { id: 'm9', ic: '🌳', nm: '家族樹 尋人', how: '讀 一句 英文，點 家族樹 上 的 那一個 人。', sec: 'read', t: 12, B: M9 },
  { id: 'm11', ic: '✅', nm: '是不是 快問快答', how: '看 圖，選 對 的 回答。', sec: 'read', t: 15, B: M11 },
  { id: 'm7', ic: '✍️', nm: '拼字 救援', how: '看 圖，照 順序 點 字母，把 單字 救回來。', sec: 'write', t: 25, B: M7 },
  { id: 'm10', ic: '🧩', nm: '對話 工廠', how: '從 字庫 選 一個 字，填進 對話 的 空格。', sec: 'write', t: 18, B: M10 },
  { id: 'm12', ic: '🪤', nm: '陷阱 偵測器', how: '三個 答案，兩個 是 陷阱，找出 對 的！', sec: 'write', t: 15, B: M12 }
];
const SEC = { lis: ['🎧', '聽力'], read: ['📖', '閱讀'], write: ['✍️', '寫寫看'] };
const PHOTO = {}; CE.forEach(x => { PHOTO[x[1]] = x[0]; });
/* 要唸的英文（node midterm/_audio.js 做成語音檔） */

/* ══ 2026-10-26 第二十七次 6-(5)：答錯頁 100% 照「三年級 複習」（g3mid）──
   綠底 一整頁：❌ 你的答案 ➜ ✅ 正確答案（每一個 英文字 正下方 ＝ 中文）➜ 整句：翻譯 ➜ 自動 唸 3 次（① ② ③）➜〔▶ 下一題 3〕。
   每一題 算好：fe ＝ 要 逐字 對照 的 英文、fz ＝ 整句 翻譯、fs ＝ 要 唸 的（[聲音, 英文]：'' 女聲 0.85、'm' 男聲 0.85、'M1' 單字 男聲 慢 0.8）。 */
const GL = {
  a: '一位', bag: '包包', ball: '球', bell: '鈴', box: '盒子', brother: '哥哥', come: '來', cook: '廚師', dad: '爸爸', desk: '書桌', doctor: '醫生', dog: '狗', doll: '娃娃',
  "don't": '不要', door: '門', eighteen: '十八', eleven: '十一', farmer: '農夫', father: '爸爸', fifteen: '十五', fourteen: '十四', go: '走', grandfather: '爺爺', grandma: '奶奶',
  grandmother: '奶奶', grandpa: '爺爺', have: '有', he: '他', his: '他的', homework: '作業', hurry: '趕快', i: '我', "'m": '是', "'s": '是', in: '進', is: '是', "isn't": '不是',
  late: '遲到的', "let's": '我們…吧', light: '燈', look: '看', me: '我', meet: '認識', mom: '媽媽', mother: '媽媽', my: '我的', name: '名字', nice: '很高興', nineteen: '十九',
  no: '不', nurse: '護理師', off: '關', on: '開', panda: '貓熊', pen: '筆', pig: '豬', please: '請', pot: '鍋子', run: '跑', seat: '座位', seventeen: '十七', she: '她',
  show: '給…看', sister: '姊姊', sixteen: '十六', sorry: '對不起', student: '學生', talk: '說話', teacher: '老師', ten: '十', tent: '帳篷', thank: '謝謝', the: '', thirteen: '十三',
  this: '這', tiger: '老虎', time: '時間', to: '', too: '也', toy: '玩具', turn: '轉', twelve: '十二', twenty: '二十', uncle: '叔叔', up: '起來', who: '誰', yes: '是的', you: '你', your: '你的',
  seventy: '七十', what: '什麼', are: '是', am: '是', be: '是', an: '一個', her: '她的'
};
/* 一句話 裡 同一個 字 意思 不一樣 ➜ 這一題 自己 的 對照（gx） */
const GX = { 'Have a seat, please.': { have: '坐', a: '一個', seat: '位子' }, 'Hurry up.': { hurry: '快', up: '一點' }, 'Time’s up.': { up: '到 了' }, 'Come in, please.': { in: '進來' },
  'Show me your homework.': { show: '給…看' } };
const noLab = t => String(t).replace(/(^|\s)[AB]:\s*/g, '$1').trim();
const gxOf = t => { const o = {}; Object.keys(GX).forEach(k => { if (t.indexOf(k) >= 0) Object.assign(o, GX[k]); }); return o; };
const zhClean = z => String(z).replace(/\s*➜\s*/g, '').trim();
M1.forEach(q => { q.fe = q.w; q.fz = q.z.replace('（', ' ＝ ').replace('）', '') + '；第一個 字母 ＝ ' + q.w[0]; q.fs = [['M1', q.w]]; });
M2.forEach(q => { q.fe = q.pair.join(' '); q.fz = q.z; q.fs = [['M1', q.pair[0]], ['M1', q.pair[1]]]; });
M3.forEach(q => { q.fe = q.say; q.fz = q.z; q.fs = [['', q.say]]; });
M4.forEach(q => { q.fe = q.say; q.fz = q.z.replace(q.say, '').trim(); q.fs = [['', q.say]]; });
M5.forEach(q => { q.fe = q.say; q.fz = q.z; q.fs = [['M1', q.say]]; });
M6.forEach(q => { const L = q.chat === 'A' ? [q.line, q.o[0]] : [q.o[0], q.line]; q.fe = L.join(' '); q.fz = zhClean(q.z); q.fs = [['', L[0]], ['m', L[1]]]; });
M7.forEach(q => { q.fe = q.spell; q.fz = q.spell + ' ＝ ' + q.zhw; q.fs = [['M1', q.spell]]; });
M8.forEach(q => { q.fe = q.ae; q.fz = PAS[q.pas].z[q.ev]; q.fs = [['', q.ae]]; });
M9.forEach(q => { q.fe = q.line; q.fz = q.z.replace(q.line, '').trim(); q.fs = [['', q.line]]; });
M10.forEach(q => { q.fe = noLab(q.ae); q.fz = q.z; q.fs = [['', q.fe]]; });
M11.forEach(q => { const he = /\bhe\b/i.test(q.line), yes = /^Yes/.test(q.o[0]), j = /a (\w+)\?$/.exec(q.line)[1];   /* 問句 裡 的 職業（不是 圖 上 的） */
  q.fe = q.line + ' ' + q.o[0]; q.fz = (he ? '他' : '她') + ' 是 ' + JOB[j][1] + ' 嗎？' + (yes ? '是的，' : '不，') + (he ? '他' : '她') + (yes ? ' 是。' : ' 不是。'); q.fs = [['', q.line], ['m', q.o[0]]]; });
M12.forEach(q => { q.fe = q.ae || ({ '12': 'twelve', '17': 'seventeen' })[q.o[0]]; q.fs = [[q.ae ? '' : 'M1', q.fe]]; });
GAMES.forEach(g => g.B.forEach(q => { q.gx = gxOf(q.fe); }));

const SAY = [];
GAMES.forEach(g => g.B.forEach(c => { [c.say, c.ae, c.line].forEach(x => { if (x) SAY.push(x); });
  if (c.pair) c.pair.forEach(x => SAY.push(x)); if (c.spell) SAY.push(c.spell); if (c.w) SAY.push(c.w); if (c.chat) c.o.forEach(x => SAY.push(x)); }));
Object.keys(PAS).forEach(k => PAS[k].t.forEach(x => SAY.push(x)));
/* 慢 一點 的 語音（0.85）：答錯頁、短文 偵探；單字 男聲 慢（M1）另外 做 */
const SAYS = [], SAYM = [];
GAMES.forEach(g => g.B.forEach(c => (c.fs || []).forEach(([v, t]) => { if (v === 'M1') SAYM.push(t); else SAYS.push((v === 'm' ? 'm:' : '') + t); })));
M2.forEach(c => c.pair.forEach(x => SAYM.push(x))); M1.forEach(c => SAYM.push(c.w)); M5.forEach(c => SAYM.push(c.say));
Object.keys(PAS).forEach(k => PAS[k].t.forEach(x => SAYS.push(x)));
/* 檢查：每一題 o[0] 是正解、選項不重複、題數 ≧ 10 */
GAMES.forEach(g => { if (g.B.length < 10) throw new Error(g.id + ' 題目 太少'); g.B.forEach((c, i) => { if (new Set(c.o).size !== c.o.length) throw new Error(g.id + ' 第 ' + (i + 1) + ' 題 選項 重複：' + c.o.join('／')); }); });
module.exports = { GAMES, SEC, WHO, JOB, PAS, PHOTO, TREE, SAY, SAYS: [...new Set(SAYS)], SAYM: [...new Set(SAYM)], GL, picZh };
