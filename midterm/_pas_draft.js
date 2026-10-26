/* midterm/_pas_draft.js — 🕵️ 短文 偵探 兩篇 新的 對話（2026-10-26 老師第二十七次 6-(4)）「草稿」
 * ⚠ 老師說「對」才換進 midterm/_data.js 的 PAS、M8（現在 只 給 預覽頁 listen/2026-10-26_C31/ 用）。
 * 老師：原本 的 短文 跟 期中考 太像 ➜ 改成 對話式 的 兩篇，兩篇 內容 完全 不同、有 鑑別度，測得出 期中考 短文 要 測 的 學習 目標
 *   （讀 對話 找：幾 歲、是 家裡 的 誰、做 什麼 工作、Is … ? 的 Yes／No 回答）。人名：考卷（Amy）、原本 的 Ken、Mia 都 不用。
 * t ＝ 每一行、sp ＝ 誰 說 的、z ＝ 每一行 的 中文；題目 [問題, 選項（第一個 ＝ 正解）, 證據 在 第幾行（可以 多行）] */
const PAS = {
  lisa: { title: '看 全家福 照片', sp: ['Frank', 'Lisa', 'Frank', 'Lisa', 'Frank', 'Lisa'],
    t: ['Who’s he, Lisa?', 'He’s my brother. He’s thirteen.', 'Is he a student?', 'Yes, he is.', 'Who’s she? Is she your mom?', 'No, she isn’t. She’s my grandma. She’s a doctor.'],
    z: ['Lisa，他 是 誰？', '他 是 我的 哥哥。他 十三 歲。', '他 是 學生 嗎？', '是的，他 是。', '她 是 誰？她 是 你的 媽媽 嗎？', '不，她 不是。她 是 我的 奶奶。她 是 醫生。'] },
  grace: { title: '認識 新 朋友', sp: ['Peter', 'Grace', 'Peter', 'Grace', 'Peter', 'Grace'],
    t: ['Hi, I’m Peter. I’m eleven.', 'Hello, Peter. I’m Grace. I’m twelve. Nice to meet you.', 'Nice to meet you, too. Is your dad a farmer?', 'No, he isn’t. He’s a cook.', 'Who’s she?', 'She’s my sister. She’s nineteen. She’s a nurse.'],
    z: ['嗨，我 是 Peter。我 十一 歲。', '哈囉，Peter。我 是 Grace。我 十二 歲。很高興 認識 你。', '我 也 很高興 認識 你。你的 爸爸 是 農夫 嗎？', '不，他 不是。他 是 廚師。', '她 是 誰？', '她 是 我的 姊姊。她 十九 歲。她 是 護理師。'] }
};
const Q = [
  ['lisa', 'Lisa 的 哥哥 幾 歲？', ['thirteen', 'thirty', 'fourteen'], [1], '讀 數字（-teen／-ty）'],
  ['lisa', 'Lisa 的 哥哥 是 ___。', ['a student', 'a teacher', 'a doctor'], [2, 3], '讀 Is he …? Yes, he is.'],
  ['lisa', '照片 上 的 女生 是 Lisa 的 誰？', ['奶奶', '媽媽', '姊姊'], [5], '讀 家人（不是 媽媽！）'],
  ['lisa', 'Lisa 的 奶奶 做 什麼 工作？', ['a doctor', 'a nurse', 'a student'], [5], '讀 職業'],
  ['lisa', 'Frank 問「Is she your mom?」，Lisa 怎麼 回答？', ['No, she isn’t.', 'Yes, she is.', 'No, he isn’t.'], [5], 'Yes／No、he／she'],
  ['grace', 'Grace 幾 歲？', ['twelve', 'twenty', 'eleven'], [1], '讀 數字（twelve／twenty）'],
  ['grace', 'Peter 幾 歲？', ['eleven', 'seven', 'twelve'], [0], '分清楚 兩個 人'],
  ['grace', 'Grace 的 爸爸 是 ___。', ['a cook', 'a farmer', 'a nurse'], [3], '讀 No, he isn’t. 後面 那一句'],
  ['grace', 'Grace 的 姊姊 幾 歲？', ['nineteen', 'nine', 'ninety'], [5], '讀 數字（-teen／-ty）'],
  ['grace', '誰 是 護理師？', ['Grace 的 姊姊', 'Grace 的 爸爸', 'Grace'], [5], '讀 職業＋家人']
];
module.exports = { PAS, Q };
