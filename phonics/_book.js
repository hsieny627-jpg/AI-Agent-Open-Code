/* phonics/_book.js — 2026-11-12 第四十八次 第 7 點：從 CVC 到 課本 單字（老師 給 的 課本 截圖：Topic 2 My Home、Topic 2 We Can Help）
 *   每 一個 字 ＝ 幾 塊（chunk）：已經 會 的 CVC 塊（✔）＋ 這個 字 新 的 地方（💡 一句 話）➜ 合 起來 ＝ 整個 字。
 *   ph ＝ CMU 美式 發音 字典 的 音素（數字 ＝ 重音），雙語 注音／KK／IPA 都 從 這裡 算（phonics/_ph2.js realTiles）；音檔 ＝ 電腦 聽寫 聽 對 才 用（tools/ph_gen2.py）
 *   k：cvc ＝ 三個 字母 子音＋短 母音＋子音（你 已經 會）、cv ＝ 兩個 字母（an、he 這種）、new ＝ 新 的 規則、sight ＝ 不照 規則 的 常見 字（要 記 起來）
 *   s 裡 的 大寫 ＝ 不發音 的 字母（畫 灰色）。
 *   2026-11-13 第四十九次（老師 第 6 點，照 老師 的 bathroom 截圖）：g ＝ 一個 字母（或 一組 字母）對 一個 聲音（CMU 音素）：
 *     'th:TH' 兩個 字母 一個 音、'h:-' 不發音（灰色）、'l:AH0+L' 一個 字母 兩個 音；sy ＝ 音節（· 分開，老師：ra·bbit、ha·ppy）
 *   2026-11-14 第五十次：ERV ＝ ir／ur 的 i、u（注音 ㄜ、IPA ɜ、KK ɝ）；RC ＝ 母音 字母 後面 的 r（注音 ㄦ 藍底、IPA ɹ）；pi ＝ 每 一個 音節 自己 的 [圖, 中文]（〔🖼 圖示〕〔中 中文〕）
 *     字母 正下方 對齊 那 一個 聲音 的 雙語 注音／KK／IPA；母音 字母 紅色、兩個 母音 一個 音（oo）粉紅、th sh ch ng 水藍、不發音 灰色 */
module.exports = {
  topics: [
    { id: 'home', t: 'My Home', zt: '我的 家', gr: 4, lb: '四年級 第三、四 課', ls: [
      { l: 'Lesson 3', w: ['bathroom', 'bedroom', 'kitchen', 'dining room', 'living room', 'where'] },
      { l: 'Lesson 4', w: ['bird', 'rabbit', 'turtle', 'cat', 'dog', 'fish'] }] },
    { id: 'help', t: 'We Can Help', zt: '我們 可以 幫忙', gr: 3, lb: '三年級 第三、四 課', ls: [
      { l: 'Lesson 3', w: ['strong', 'thin', 'short', 'tall', 'he', 'she'] },
      { l: 'Lesson 4', w: ['tired', 'angry', 'happy', 'sad', 'yes', 'no', 'not'] }] }],
  /* 一個 字：zh 課本 中文、ic 圖、ph 整個 字 的 音素、c ＝ 塊 [拼字, 音素, 種類, 💡]、tip ＝ 整個 字 的 一句 話 */
  W: {
    cat: { g: 'c:K a:AE t:T', sy: 'cat', zh: '貓', ic: '🐱', ph: 'K AE1 T', c: [['cat', 'K AE1 T', 'cvc']], tip: 'c ＋ a ＋ t：你 已經 會 了！' },
    dog: { g: 'd:D o:AA g:G', sy: 'dog', zh: '狗', ic: '🐶', ph: 'D AA1 G', c: [['dog', 'D AA1 G', 'cvc']], tip: 'd ＋ o ＋ g：你 已經 會 了！' },
    sad: { g: 's:S a:AE d:D', sy: 'sad', zh: '難過 的', ic: '😢', ph: 'S AE1 D', c: [['sad', 'S AE1 D', 'cvc']], tip: 's ＋ a ＋ d：你 已經 會 了！' },
    not: { g: 'n:N o:AA t:T', sy: 'not', zh: '不是', ic: '🚫', ph: 'N AA1 T', c: [['not', 'N AA1 T', 'cvc']], tip: 'n ＋ o ＋ t：你 已經 會 了！' },
    yes: { g: 'y:Y e:EH s:S', sy: 'yes', zh: '是 的', ic: '✅', ph: 'Y EH1 S', c: [['yes', 'Y EH1 S', 'cvc', 'y ＝ 一']], tip: 'y 在 前面 ＝ 一（yes、yo-yo）' },
    fish: { g: 'f:F i:IH sh:SH', sy: 'fish', zh: '魚', ic: '🐟', ph: 'F IH1 SH', c: [['fi', 'F IH1', 'cv'], ['sh', 'SH', 'new', 's＋h ＝ 一個 音 ㄕ']], tip: 'sh 兩個 字母，只 唸 一個 音 ㄕ' },
    thin: { g: 'th:TH i:IH n:N', sy: 'thin', zh: '瘦 的', ic: 'svg:thin', ph: 'TH IH1 N', c: [['th', 'TH', 'new', '舌頭 輕輕 咬 住，吹 氣'], ['in', 'IH1 N', 'cv']], tip: 'th ＝ 舌頭 輕輕 咬，吹 出 氣' },
    he: { g: 'h:HH e:IY', sy: 'he', zh: '他', ic: '👦', ph: 'HH IY1', c: [['he', 'HH IY1', 'new', 'e 在 最後 ＝ 長 長 的 一']], tip: '母音 在 最後 ＝ 唸 它 的 名字（e ＝ 一）' },
    she: { g: 'sh:SH e:IY', sy: 'she', zh: '她', ic: '👧', ph: 'SH IY1', c: [['sh', 'SH', 'new', 's＋h ＝ ㄕ'], ['e', 'IY1', 'new', 'e 在 最後 ＝ 一']], tip: 'sh ＝ ㄕ；e 在 最後 ＝ 一' },
    no: { g: 'n:N o:OW', sy: 'no', zh: '不', ic: '❌', ph: 'N OW1', c: [['no', 'N OW1', 'new', 'o 在 最後 ＝ 唸 它 的 名字']], tip: '母音 在 最後 ＝ 唸 它 的 名字（o ＝ ㄛㄨ）' },
    bedroom: { pi: [['🛏️', '床'], ['svg:room', '房間']], g: 'b:B e:EH d:D r:R oo:UW m:M', sy: 'bed·room', zh: '臥室', ic: '🛏️', ph: 'B EH1 D R UW2 M', c: [['bed', 'B EH1 D', 'cvc'], ['room', 'R UW1 M', 'new', 'oo ＝ 長 長 的 ㄨ']], tip: 'bed（床）＋ room（房間）＝ 睡覺 的 房間' },
    bathroom: { pi: [['🛀', '洗澡'], ['svg:room', '房間']], g: 'b:B a:AE th:TH r:R oo:UW m:M', sy: 'bath·room', zh: '浴室；廁所', ic: '🛁', ph: 'B AE1 TH R UW2 M', c: [['bath', 'B AE1 TH', 'new', 'th ＝ 舌頭 輕輕 咬'], ['room', 'R UW1 M', 'new', 'oo ＝ 長 長 的 ㄨ']], tip: 'bath（洗澡）＋ room（房間）' },
    rabbit: { g: 'r:R a:AE bb:B i:IH t:T', sy: 'ra·bbit', zh: '兔子', ic: '🐰', ph: 'R AE1 B IH0 T', c: [['rab', 'R AE1 B', 'cvc'], ['bit', 'B IH0 T', 'cvc', '輕輕 唸']], tip: '兩個 CVC 黏 在 一起：rab ＋ bit（中間 的 bb 只 唸 一次）' },
    kitchen: { g: 'k:K i:IH t:- ch:CH e:AH0 n:N', sy: 'ki·tchen', zh: '廚房', ic: '🍳', ph: 'K IH1 CH AH0 N', c: [['kiT', 'K IH1', 'cvc', 't 不 唸，跟 ch 黏 成 ㄔ'], ['chen', 'CH AH0 N', 'new', 'ch ＝ ㄔ；e 輕輕 的 ㄜ']], tip: 'kit ＋ chen：tch ＝ ㄔ（t 不 唸）' },
    dining: { g: 'd:D i:AY n:N i:IH ng:NG', sy: 'di·ning', zh: '吃飯 的', ic: '🍽️', ph: 'D AY1 N IH0 NG', c: [['di', 'D AY1', 'new', 'dine 的 i ＝ ㄞ（magic e）'], ['ning', 'N IH0 NG', 'new', 'ing ＝ ㄜ一ㄥ']], tip: 'dine（吃飯）把 e 拿掉 ＋ ing' },
    living: { g: 'l:L i:IH v:V i:IH ng:NG', sy: 'li·ving', zh: '生活 的', ic: '🛋️', ph: 'L IH1 V IH0 NG', c: [['liv', 'L IH1 V', 'cvc'], ['ing', 'IH0 NG', 'new', 'ing ＝ ㄜ一ㄥ']], tip: 'live（住）把 e 拿掉 ＋ ing' },
    room: { g: 'r:R oo:UW m:M', sy: 'room', zh: '房間', ic: 'svg:room', ph: 'R UW1 M', c: [['room', 'R UW1 M', 'new', 'oo ＝ 長 長 的 ㄨ']], tip: '' },
    'dining room': { zh: '飯廳', ic: '🍽️', ph: 'D AY1 N IH0 NG R UW2 M', parts: ['dining', 'room'], tip: '吃飯 的 ＋ 房間' },
    'living room': { zh: '客廳', ic: '🛋️', ph: 'L IH1 V IH0 NG R UW2 M', parts: ['living', 'room'], tip: '生活 的 ＋ 房間' },
    where: { g: 'w:W h:- e:EH r:RC e:-', sy: 'where', zh: '哪裡', ic: 'svg:where', ph: 'W EH1 R', c: [['wHere', 'W EH1 R', 'sight', 'wh ＝ ㄨ（h 不 唸）；ere ＝ ㄝㄦ']], tip: '⭐ 常見 字：不 照 規則，看 一眼 就 要 認得' },
    bird: { g: 'b:B i:ERV r:RC d:D', sy: 'bird', zh: '鳥', ic: '🐦', ph: 'B ER1 D', c: [['b', 'B', 'cvc'], ['ir', 'ER1', 'new', 'ir ＝ ㄜㄦ（跟 er、ur 一樣）'], ['d', 'D', 'cvc']], tip: 'ir ＝ ㄜㄦ' },
    turtle: { g: 't:T u:ERV r:RC t:T l:AH0+L e:-', sy: 'tur·tle', zh: '烏龜', ic: '🐢', ph: 'T ER1 T AH0 L', c: [['tur', 'T ER1', 'new', 'ur ＝ ㄜㄦ'], ['tle', 'T AH0 L', 'new', 'tle ＝ 輕輕 的 ㄊㄜㄛ']], tip: 'tur ＋ tle' },
    strong: { g: 's:S t:T r:R o:AO ng:NG', sy: 'strong', zh: '強壯 的', ic: '💪', ph: 'S T R AO1 NG', c: [['str', 'S T R', 'new', '三個 子音 連 著 唸'], ['ong', 'AO1 NG', 'new', 'ng ＝ ㄥ']], tip: 'str ＋ ong' },
    short: { g: 'sh:SH o:AO r:RC t:T', sy: 'short', zh: '矮 的', ic: 'svg:short', ph: 'SH AO1 R T', c: [['sh', 'SH', 'new', 's＋h ＝ ㄕ'], ['or', 'AO1 R', 'new', 'or ＝ ㄛㄦ'], ['t', 'T', 'cvc']], tip: 'sh ＋ or ＋ t' },
    tall: { g: 't:T a:AO ll:L', sy: 'tall', zh: '高 的', ic: 'svg:tall', ph: 'T AO1 L', c: [['t', 'T', 'cvc'], ['all', 'AO1 L', 'new', 'all ＝ ㄛㄛ（ball、call 也是）']], tip: 't ＋ all（ball、call、tall 一家人）' },
    tired: { g: 't:T i:AY r:ER0 e:- d:D', sy: 'tired', zh: '疲累 的', ic: '🥱', ph: 'T AY1 ER0 D', c: [['ti', 'T AY1', 'new', 'i ＝ ㄞ（tire 的 e 讓 i 唸 名字）'], ['rEd', 'ER0 D', 'new', 'r ＝ ㄜㄦ；e 不 唸']], tip: 'tire（累）＋ d' },
    angry: { g: 'a:AE n:NG g:G r:R y:IY0', sy: 'an·gry', zh: '生氣 的', ic: '😠', ph: 'AE1 NG G R IY0', c: [['an', 'AE1 NG', 'cv', 'n 在 g 前面 ＝ ㄥ'], ['gry', 'G R IY0', 'new', 'y 在 最後 ＝ 一']], tip: 'an ＋ gry（y 在 最後 ＝ 一）' },
    happy: { g: 'h:HH a:AE pp:P y:IY0', sy: 'ha·ppy', zh: '快樂 的', ic: '😄', ph: 'HH AE1 P IY0', c: [['hap', 'HH AE1 P', 'cvc'], ['py', 'P IY0', 'new', 'y 在 最後 ＝ 一']], tip: 'hap ＋ py（pp 只 唸 一次）' }
  }
};
