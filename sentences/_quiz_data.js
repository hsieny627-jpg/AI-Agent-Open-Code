/* sentences/_quiz_data.js — 句型暖身題的唯一真相來源（22 題）
 *
 * 網頁版（_build.js → warmup.html）與 Kahoot 匯入檔（_build_kahoot.js）都從這裡拿題目。
 *
 * 出題原則（使用者指定，不要放寬）：
 *  - 全部出自 Unit 1／Unit 2 兩課的句型，不考卡片上沒教過的東西
 *  - 每題都要打中學生真正會卡住的地方（who 的用法、縮寫、答句開頭、中英語序、主詞與 be 換位）
 *  - 錯的選項要有誘答性（看起來都很像真的）
 *  - 嚴禁瑣碎、無關、冷僻、刁鑽、湊題數
 *  - x2:true ＝ 挑戰題，答對 分數 ✕ 2（共 6 題）
 *  - why ＝ 答錯時的秒懂說明（一句話講完）
 *
 * 題型 t：
 *  'hear-en' 聽英文，選英文 ｜ 'hear-zh' 聽英文，選中文
 *  'see-en'  看英文，選中文 ｜ 'see-zh'  看中文，選英文
 *  'think'   觀念題
 * say = 聽力題要唸出來的句子（只有 hear-* 用得到）
 * a 一律 0；產生時用固定種子打散，每次 build 出來的順序一樣。
 */

const Q = [
{t:'see-zh', q:'「他是誰？」英文怎麼說？',
 o:["Who's he?","He's who?","Who he is?","What's he?"], a:0, x2:true,
 why:'中文的「<b>誰</b>」在最後一個字，英文的 <b>Who</b> 要放<b>第一個</b>。順序剛好相反。'},

{t:'think', q:'Who’s 是哪兩個字合起來的？',
 o:['Who is','Who are','Whose','Who was'], a:0, x2:true,
 why:'<b>Who’s ＝ Who is</b>。紅色那一撇 ’ 就是把 <b>i</b> 藏起來的地方。'},

{t:'see-en', q:'"Who\'s she?" 的中文意思是？',
 o:['她是誰？','誰是她？','她是我的。','她好嗎？'], a:0,
 why:'英文 Who 在前面，翻成中文要搬到<b>最後面</b>：<b>她是誰？</b>'},

{t:'hear-en', q:'聽一聽，你聽到的是哪一句？', say:"Who's he?",
 o:["Who's he?","Who's she?","He's here.","Whose he?"], a:0,
 why:'聽最後一個字：<b>he</b>（他）還是 <b>she</b>（她）。she 前面多一個「ㄕ」的氣音。'},

{t:'think', q:'"Who’s he?" 的回答，第一個字要用哪一個？',
 o:['He','She','It','Who'], a:0,
 why:'問句最後問 <b>he</b>，答句第一個字就用 <b>He</b>：He’s my father.'},

{t:'think', q:'"Who’s she?" 的回答，第一個字要用哪一個？',
 o:['She','He','Her','Who'], a:0,
 why:'問 <b>she</b> 就答 <b>She</b>。Her 不能放句子開頭當主詞。'},

{t:'see-en', q:'"He\'s my father." 的中文意思是？',
 o:['他是我的爸爸。','她是我的爸爸。','他是我的媽媽。','他有一個爸爸。'], a:0,
 why:'<b>He ＝ 他</b>、<b>’s ＝ is ＝ 是</b>、<b>my ＝ 我的</b>。一個字一個字對下來就不會錯。'},

{t:'hear-zh', q:'聽一聽，這句話的中文意思是？', say:"She's my mother.",
 o:['她是我的媽媽。','他是我的媽媽。','她是我的姊姊。','她是我的奶奶。'], a:0,
 why:'開頭聽到 <b>She</b> 就是「她」，最後聽到 <b>mother</b> 就是「媽媽」。'},

{t:'see-zh', q:'「她是我的奶奶。」英文怎麼說？',
 o:["She's my grandmother.","He's my grandmother.","She's my grandfather.","She's my mother."], a:0,
 why:'奶奶是女生 → 用 <b>She</b>；<b>grandmother</b> 才是奶奶，grandfather 是爺爺。'},

{t:'think', q:'下面哪一句是完全正確的？',
 o:["He's my dad.","His my dad.","He my dad.","He's my dad?"], a:0, x2:true,
 why:'<b>He’s ＝ He is</b>；<b>His</b> 是「他的」，不能當「他是」。兩個唸起來很像，寫出來差很多。'},

{t:'hear-en', q:'聽一聽，你聽到的是哪一句？', say:"He's my brother.",
 o:["He's my brother.","She's my brother.","He's my father.","He's my grandfather."], a:0,
 why:'開頭是 <b>He</b>，最後是 <b>brother</b>（哥哥、弟弟都是這個字）。'},

{t:'see-en', q:'"grandfather" 是誰？',
 o:['爺爺（外公也是）','奶奶','叔叔','哥哥'], a:0,
 why:'英文<b>一個字管中文兩個稱呼</b>：爺爺和外公都叫 grandfather。'},

{t:'think', q:'"He is a student." 改成問句，要怎麼寫？',
 o:['Is he a student?','He is a student?','Is a student he?','Does he a student?'], a:0, x2:true,
 why:'把 <b>he</b> 和 <b>is</b> <b>換位置</b>，句號換問號。後面 a student 完全不動。'},

{t:'think', q:'"Is she a nurse?" 改成直述句，要怎麼寫？',
 o:['She is a nurse.','Is she a nurse.','She a nurse is.','Her is a nurse.'], a:0, x2:true,
 why:'把 <b>Is</b> 和 <b>she</b> 換回來：<b>She is</b> a nurse. 問號換句號。'},

{t:'think', q:'直述句變問句，是哪兩個字交換位置？',
 o:['he 和 is','he 和 a','is 和 a','a 和 doctor'], a:0,
 why:'只動<b>最前面兩個字</b>：藍色的 <b>he</b> 和黃色的 <b>is</b>。其他字一個都不動。'},

{t:'see-zh', q:'「他是一位醫生。」英文怎麼說？',
 o:["He's a doctor.","He's doctor.","He a doctor.","Is he a doctor?"], a:0,
 why:'職業前面<b>一定要有 a</b>。少了 a 就不是完整的句子。'},

{t:'hear-en', q:'聽一聽，你聽到的是哪一句？', say:"Is he a farmer?",
 o:['Is he a farmer?','He is a farmer.','Is she a farmer?','He is a father.'], a:0,
 why:'問句的第一個字是 <b>Is</b>，直述句的第一個字是 <b>He</b>。<b>聽第一個字就分得出來</b>。'},

{t:'think', q:'"Is he a teacher?" 要回答「是的」，哪一句才對？',
 o:['Yes, he is.',"Yes, he's.","Yes, he isn't.",'Yes, she is.'], a:0, x2:true,
 why:'句子<b>結尾的 is 不可以縮寫</b>。Yes, he’s. 是錯的，一定要說 <b>Yes, he is.</b>'},

{t:'think', q:'"Is she a doctor?" 要回答「不是」，哪一句才對？',
 o:["No, she isn't.",'No, she is.',"No, he isn't.",'No, she not.'], a:0,
 why:'問 <b>she</b> 就答 <b>she</b>；「不是」用 <b>isn’t</b>（＝ is not）。'},

{t:'hear-zh', q:'聽一聽，這句話的中文意思是？', say:"Is she a teacher?",
 o:['她是老師嗎？','她是老師。','他是老師嗎？','她不是老師。'], a:0,
 why:'第一個字聽到 <b>Is</b> 就是<b>在問問題</b>，中文要加「<b>嗎</b>」。'},

{t:'think', q:'下面哪一個字是用來問「人」的？',
 o:['Who','What','How','Where'], a:0,
 why:'<b>Who 問人</b>、What 問東西、How 問好不好、Where 問地方。看到 Who，答案一定是一個人。'},

{t:'see-en', q:'"She\'s my aunt." 的 aunt 是誰？',
 o:['阿姨（姑姑、舅媽也是）','奶奶','姊姊','姪女'], a:0,
 why:'英文的 <b>aunt</b> 一個字，管中文的<b>阿姨、姑姑、舅媽</b>好幾個稱呼。'}
];

/* 固定種子打散，每次 build 出來的順序一樣，老師對答案不會亂 */
function shuffle(arr, seed) {
  const a = arr.slice(); let s = seed;
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; }
  return a;
}

module.exports = { Q, shuffle };
