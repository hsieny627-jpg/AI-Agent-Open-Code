/* G3 - L1 + L2/_quiz_data.js — 暖身題的唯一真相來源（24 題）
 * 網頁版 warmup.html 和 Kahoot 匯入檔都從這裡拿題目。
 *
 * 出題原則（使用者 2026-09-24 指定）：
 *  - 只考 Unit 1 What’s your name?／Unit 2 How old are you? 教過的東西
 *  - 有鑑別度：打中學生真正會搞混的地方（What／How old、I／My、You／Your、
 *    What’s／I’m／You’re 縮寫、問名字答名字、問幾歲答幾歲、years 的 s、不發音的字母）
 *  - 避免刁鑽和艱澀；錯的選項要有誘答力（都是學生真的會寫錯的樣子）
 *  - 題目和選項：網頁版每一次開始都重洗（CFG.random），不能背位置
 *  - x2:true ＝ 挑戰題，答對 分數 ✕ 2（6 題）；why ＝ 答錯時的秒懂說明（一句話）
 *
 * 題型 t： 'hear-en' 聽英選英｜'hear-zh' 聽英選中｜'see-en' 看英選中｜'see-zh' 看中選英｜'think' 觀念題
 * o[0] 一定是正確答案（a:0），產生器會打散。
 */
const Q = [
{t:'see-zh', q:'「你的名字是什麼？」英文怎麼說？', x2:true,
 o:["What's your name?","What's my name?","How old are you?","What your name is?"], a:0,
 why:'中文「<b>什麼</b>」在最後，英文 <b>What</b> 放第一個；「你的」是 <b>your</b>。'},

{t:'think', q:'"What’s your name?" 要怎麼回答？', x2:true,
 o:['My name is Ken.','I’m eight.','Your name is Ken.','I’m eight years old.'], a:0,
 why:'問<b>名字</b>，就答<b>名字</b>。I’m eight. 是在說<b>幾歲</b>。'},

{t:'think', q:'"How old are you?" 要怎麼回答？', x2:true,
 o:['I’m nine years old.','I’m Mike.','My name is nine.','How old are you?'], a:0,
 why:'問<b>幾歲</b>，就答<b>幾歲</b>：I’m ＋ 數字 ＋ years old。I’m Mike. 是在說名字。'},

{t:'think', q:'What’s 是哪兩個字合起來的？',
 o:['What is','What are','What am','What your'], a:0,
 why:'<b>What’s ＝ What is</b>。紅色那一撇 ’ 就是把 <b>i</b> 藏起來的地方。'},

{t:'think', q:'I’m 是哪兩個字合起來的？',
 o:['I am','I is','I are','My am'], a:0,
 why:'<b>I’m ＝ I am</b>。’ 藏起來的是 am 的 <b>a</b>。'},

{t:'think', q:'You’re 是哪兩個字合起來的？',
 o:['You are','You is','Your are','You am'], a:0,
 why:'<b>You’re ＝ You are</b>。’ 藏起來的是 are 的 <b>a</b>。'},

{t:'see-en', q:'"How old are you?" 的中文意思是？',
 o:['你幾歲？','你的名字是什麼？','你好嗎？','我幾歲？'], a:0,
 why:'<b>How old</b> ＝ 幾歲，<b>you</b> ＝ 你：<b>你幾歲？</b>'},

{t:'see-en', q:'"My name is Wendy." 的中文意思是？',
 o:['我的名字是溫蒂。','你的名字是溫蒂。','溫蒂幾歲？','我是溫蒂的。'], a:0,
 why:'<b>My</b> ＝ 我的，<b>name</b> ＝ 名字。'},

{t:'see-en', q:'"I’m twelve years old." 的中文意思是？',
 o:['我十二歲。','我十一歲。','我二十歲。','你十二歲。'], a:0,
 why:'<b>twelve</b> ＝ 十二，<b>years old</b> ＝ 歲。eleven 才是十一。'},

{t:'see-zh', q:'「你幾歲？」英文怎麼說？', x2:true,
 o:['How old are you?','How are you?','How old you are?',"What's your name?"], a:0,
 why:'問年紀要用 <b>How old</b>，而且 <b>are</b> 要放在 you 前面。'},

{t:'see-zh', q:'「我九歲。」英文怎麼說？', x2:true,
 o:["I'm nine years old.","I'm nine year old.","My nine years old.","I'm nine years."], a:0,
 why:'<b>years</b> 要有 <b>s</b>，後面的 <b>old</b> 也不能少。'},

{t:'see-zh', q:'「我是艾倫。」英文怎麼說？',
 o:["I'm Alan.","My Alan.","I Alan.","You're Alan."], a:0,
 why:'我是 ＝ <b>I’m</b>（I am）。You’re 是「你是」。'},

{t:'think', q:'I ＝ 我，那 My ＝ ？',
 o:['我的','我','你的','你'], a:0,
 why:'<b>I ＝ 我</b>，<b>My ＝ 我的</b>。'},

{t:'think', q:'Your 的中文是？',
 o:['你的','你','我的','我'], a:0,
 why:'<b>You ＝ 你</b>，<b>Your ＝ 你的</b>。'},

{t:'think', q:'問 your name（你的名字），答句要用哪一個字開頭？', x2:true,
 o:['My','Your','You','Me'], a:0,
 why:'問「<b>你的</b>」名字，就答「<b>我的</b>」名字：your ➜ <b>My</b> name is …'},

{t:'think', q:'哪一個是用來問「幾歲」的？',
 o:['How old','What','How','Who'], a:0,
 why:'<b>How old</b> 問年紀；What 問「什麼」；How 問「怎麼樣」。'},

{t:'think', q:'What 的哪一個字母不發音（淺灰色）？',
 o:['h','W','a','t'], a:0,
 why:'What 的 <b>h</b> 淺灰色，不發音。'},

{t:'think', q:'eight 裡面哪兩個字母不發音？',
 o:['gh','ei','ht','et'], a:0,
 why:'eight 的 <b>gh</b> 淺灰色，不發音，唸起來像 ate。'},

{t:'hear-en', q:'聽一聽，你聽到的是哪一句？', say:"What's your name?",
 o:["What's your name?","What's my name?","What is name?","What's you name?"], a:0,
 why:'中間聽到的是 <b>your</b>（你的），不是 my。'},

{t:'hear-en', q:'聽一聽，你聽到的是哪一句？', say:"I'm seven.",
 o:["I'm seven.","I'm eleven.","I'm ten.","I'm Ken."], a:0,
 why:'<b>seven</b> 七；eleven 十一前面多了一個「ㄧ」的音。'},

{t:'hear-en', q:'聽一聽，你聽到的是哪一句？', say:"I'm ten years old.",
 o:["I'm ten years old.","I'm Ken.","I'm twelve years old.","I'm ten."], a:0,
 why:'聽到 <b>ten</b> 又聽到 <b>years old</b>。Ken 是名字。'},

{t:'hear-en', q:'聽一聽，你聽到的是哪一句？', say:'My name is Emma.',
 o:['My name is Emma.','My name is Wendy.',"I'm Emma.",'Your name is Emma.'], a:0,
 why:'開頭是 <b>My name is</b>，最後是 <b>Emma</b>。'},

{t:'hear-zh', q:'聽一聽，這一句是什麼意思？', say:'How old are you?',
 o:['你幾歲？','你的名字是什麼？','我幾歲？','你好嗎？'], a:0,
 why:'聽到 <b>How old</b> 就是在問<b>幾歲</b>。'},

{t:'hear-zh', q:'聽一聽，這一句是什麼意思？', say:"I'm eight years old.",
 o:['我八歲。','我十一歲。','我九歲。','你八歲。'], a:0,
 why:'<b>eight</b> ＝ 八（gh 不發音），<b>I’m</b> ＝ 我是。'}
];

/* 網頁版的設定：random 每一次開始都重洗題序和選項；speed 愈快答對分數愈高（100 ＋ 最多 900） */
const CFG = { random: true, speed: true,
  gate: '<br>題目和選項<b>每一次都重新洗牌</b>；<b>愈快答對，分數愈高</b>（最多 1000 分）。' };

/* Kahoot 匯入檔：放在這個資料夾裡 */
const KAHOOT = { name: 'kahoot_G3_L1L2_24', dir: __dirname, where: '「G3 - L1 + L2」資料夾',
  src: 'G3 - L1 + L2', cmd: 'node "G3 - L1 + L2/_build.js"', title: '三年級 L1＋L2 句型',
  range: "Unit 1 What's your name?　Unit 2 How old are you?" };

/* 固定種子打散（Kahoot 匯入檔用；網頁版開始時會再重洗） */
function shuffle(arr, seed) {
  const a = arr.slice(); let s = seed;
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; }
  return a;
}

module.exports = { Q, shuffle, CFG, KAHOOT };
