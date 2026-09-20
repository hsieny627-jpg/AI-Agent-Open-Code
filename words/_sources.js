/* words/_sources.js — 出處來源（單一真相來源）
 *
 * 使用者 2026-09-19 指定：所有字卡、補充動畫、暖身題都要附「100% 可查證的出處」，
 * 但附註在最下方、嚴禁佔據版面。
 * 使用者 2026-09-20 追加：**出處版面太凌亂，要統整成「秒懂圖表 ＋ 秒懂動畫」，
 * 並且標示清楚證據來源出處，讓學生信服。**
 *
 * 做法：每一條出處都是一個物件，**三欄分開寫**——
 *   t ＝ 這一條在講什麼（主題）
 *   s ＝ 證據出處（工具書 ＋ 條目名稱，老師照著就查得到）
 *   d ＝ 說明（查到以後會看到什麼）
 * 畫出來就是一張三欄的秒懂圖表；⚠️ 誠實註記用 warn() 另外上色。
 * 最上面有一條秒懂動畫：「課堂上教的 ➜ 出自這一本 ➜ 你也查得到」。
 *
 * 這個檔被 _build.js / _build_story.js / _build_quiz.js / _build_tree.js require，
 * 改出處只改這一個地方。
 *
 * 引用原則：只列**查得到的標準工具書與條目名稱**，不寫「我查過了」這種空話。
 * 查不到的就誠實寫「查無一手出處」，不要編。
 */

const e    = (t, s, d) => ({ t, s, d });
const warn = (t, d)    => ({ t, s: '', d, w: 1 });

/* ── 好幾個字共用的區塊 ── */
const BROSIS = [
 e('英文不分長幼', 'Cambridge Dictionary「brother」「sister」',
   '定義本身<b>不含年齡</b>——英文這兩個字不分哥哥弟弟、姊姊妹妹。'),
 e('要分長幼怎麼說', 'Oxford Learner’s Dictionaries「brother」「sister」',
   '例句作 <b>my older brother</b>／<b>my younger sister</b>：前面加 older／younger。'),
 e('聊天的說法', 'Merriam-Webster「big brother」「little brother」',
   'big brother ＝ an older brother；little brother ＝ a younger brother。<b>口語常用，完全正確</b>。'),
 e('elder 是哪一國的用法', 'Cambridge Dictionary 文法頁「elder or older?」',
   '<b>elder 偏英式、偏正式</b>，而且<b>只能放在名詞前面</b>（elder brother ✅）；'+
   '<b>不可以</b>寫 He is <s>elder</s> than me ❌，要用 <b>older than</b> ✅。'),
 warn('沒有做過次數統計',
   '「最常用」指的是<b>辭典與英語教材一致採用</b>的說法（older／younger 用於書面與教學，'+
   'big／little 用於口語）。要做精確的<b>使用次數排名</b>得查 COCA／BNC 語料庫，'+
   '本次製作環境連不上那些網站，<b>沒有做過次數統計</b>，所以教材上沒有寫「第幾名」。')
];

/* ── 單字 → 出處 ── */
const W = {
family: [
 e('family 的來源', 'OED「family, n.」；Lewis &amp; Short《A Latin Dictionary》「familia」',
   '源自拉丁文 <b>familia</b>，原指整個家戶，<b>連家裡幫忙做事的僕役都算</b>，不只血親。'),
 warn('這個說法是假的',
   '「Father And Mother, I Love You」<b>查無任何一手出處</b>，只出現在縮寫收集網站，'+
   '是後人倒推的順口溜（backronym），<b>不是 family 的來源</b>。')],

parent: [
 e('parent 的來源', 'OED「parent, n.」',
   '源自拉丁文 <b>parens</b>（動詞 parere「生下、產出」的分詞），意思是「<b>把孩子生下來的人</b>」。'),
 e('一位還是很多位', 'Cambridge Dictionary「parent」',
   '一位是 <b>a parent</b>，兩位以上是 <b>parents</b>。')],

mother: [
 e('mother 的來源', 'OED「mother, n.1」', '古英文寫成 <b>mōdor</b>。'),
 e('為什麼從 m 開頭', 'Roman Jakobson (1960)《Why “Mama” and “Papa”?》',
   '全世界語言的「媽媽」多半用 <b>m</b> 起頭的唇音——那是<b>嬰兒最早發得出來的音</b>。'),
 e('mom 還是 mum', 'OED「mom, n.」「mum, n.4」',
   '<b>mom</b> 通行於美國，<b>mum</b> 通行於英國。')],

father: [
 e('father 的來源', 'OED「father, n.」', '古英文寫成 <b>fæder</b>。'),
 e('dad 不是縮寫', 'OED「dad, n.1」',
   '約 <b>1500 年</b>就有紀錄，屬於 <b>nursery word（育兒語）</b>，<b>不是 father 剪短來的</b>。'),
 e('為什麼從 d／p 開頭', 'Roman Jakobson (1960)《Why “Mama” and “Papa”?》',
   '<b>da</b>／<b>pa</b> 同樣是嬰兒最早發得出來的音。')],

brother: [
 e('brother 的來源', 'OED「brother, n.」', '古英文寫成 <b>brōþor</b>。'),
 e('þ 是什麼', 'Wikipedia「Thorn (letter)」／Unicode U+00FE',
   '<b>þ</b>（thorn，荊棘）是古英文與古北歐文的字母，相當於今天的 <b>th</b>。')
].concat(BROSIS),

sister: [
 e('sister 的來源', 'OED「sister, n.」',
   '古英文本來寫成 <b>sweostor</b>；<b>今天 sister 這個形帶有古北歐文 systir 的影響</b>。'),
 e('維京人住在哪裡', 'Anglo-Saxon Chronicle 876–877 年條；「Danelaw（丹麥區）」條目',
   '九至十一世紀北歐人（維京人）在<b>英格蘭東北部</b>定居。'+
   '史料講的是<b>一整片地區</b>，不是某一個村子。'),
 e('他們真的住下來了（地名就是證據）', 'OED／Cambridge Dictionary「-by, suffix」',
   '<b>-by</b> 是古北歐文的「<b>村子、聚落</b>」。<b>Grimsby、Whitby、Derby</b>、'+
   '<b>Scunthorpe</b>（-thorpe）這些地名到今天還在用，就是維京人住過的證據。'),
 warn('2026-09-20 訂正',
   '教材原本寫「英國人和維京人<b>住進同一個村子</b>」——<b>查不到任何一個村子的紀錄</b>，'+
   '那句是編的，<b>已經刪掉</b>。現在畫面上寫的是「維京人<b>住在英格蘭東北邊</b>」，'+
   '這一條查得到（上面兩列）。')
].concat(BROSIS),

son: [
 e('son 的來源', 'OED「son, n.」', '古英文寫成 <b>sunu</b>。'),
 e('和 sun 同音', 'Cambridge Dictionary「son」「sun」',
   '兩個字的音標同為 <b>/sʌn/</b>，是<b>同音異義詞（homophone）</b>。')],

daughter: [
 e('daughter 的來源', 'OED「daughter, n.」', '古英文寫成 <b>dohtor</b>。'),
 e('gh 以前有聲音', 'Wikipedia「Gh (digraph)」／「Yogh」',
   '中古英語的 <b>gh</b> 代表喉嚨後方的摩擦音 <b>/x/</b>，約 <b>1500–1700 年</b>'+
   '在多數英語方言中消失，<b>字母留了下來</b>。'),
 e('德文到今天還在發', 'Duden（德語權威詞典）「Tochter」', '音標 /ˈtɔxtɐ/，<b>ch 仍發 /x/</b>。'),
 e('荷蘭文到今天還在發', 'Van Dale（荷語權威詞典）「dochter」', '音標 /ˈdɔxtər/，<b>ch 仍發 /x/</b>。'),
 e('蘇格蘭語也還在發', 'Dictionaries of the Scots Language (dsl.ac.uk)「dochter」「nicht」',
   '蘇格蘭語至今保留 <b>/x/</b>。')],

grandfather: [
 e('grand 是什麼意思', 'OED「grand, adj.」',
   '原義就是「<b>大的</b>」。課堂旁證：<b>Grand Canyon</b>（大峽谷）、<b>grand piano</b>（大鋼琴）。'),
 e('grand- 從哪裡來', 'OED「grand-, comb. form」',
   '親屬稱謂的 <b>grand-</b> 來自<b>法語（Anglo-French）grand</b>，'+
   '比照 grand-père 的構詞造出 grandfather。'),
 e('grandfather ＝ grandpa', 'OED「grandpa, n.」', '口語簡稱，意思完全一樣。')],

grandmother: [
 e('grand 是什麼意思', 'OED「grand, adj.」',
   '原義就是「<b>大的</b>」。課堂旁證：<b>Grand Canyon</b>（大峽谷）。'),
 e('grand- 從哪裡來', 'OED「grand-, comb. form」',
   '同一個從<b>法語</b>借來的 <b>grand-</b>，裝在 mother 前面。'),
 e('grandmother ＝ grandma', 'OED「grandma, n.」', '口語簡稱，意思完全一樣。')],

uncle: [
 e('uncle 的來源', 'OED「uncle, n.」',
   '經古法語 <b>oncle</b>，源自拉丁文 <b>avunculus</b>，<b>原義專指「母親的兄弟」（舅舅）</b>。'),
 e('今天的用法', 'Cambridge Dictionary「uncle」',
   '叔、伯、舅、姑丈、姨丈<b>一律是 uncle</b>。')],

aunt: [
 e('aunt 的來源', 'OED「aunt, n.」',
   '經法語 <b>aunte</b>，源自拉丁文 <b>amita</b>，<b>原義專指「父親的姊妹」（姑姑）</b>。'),
 e('親暱形', 'OED「auntie, n.」', '親一點可以叫 <b>auntie</b>。')],

cousin: [
 e('cousin 的來源', 'OED「cousin, n.」',
   '經古法語 <b>cosin</b>，源自拉丁文 <b>consobrinus</b>，<b>原義是「母親的姊妹的孩子」</b>。'),
 e('今天的用法', 'Cambridge Dictionary「cousin」', '堂、表、男、女<b>一律是 cousin</b>。')],

nephew: [
 e('nephew 的來源', 'OED「nephew, n.」',
   '經古法語 <b>neveu</b>，源自拉丁文 <b>nepos</b>，<b>原義涵蓋孫子、姪子、外甥</b>。'),
 e('今天的用法', 'Cambridge Dictionary「nephew」', '只剩「<b>兄弟姊妹的兒子</b>」一種。')],

niece: [
 e('niece 的來源', 'OED「niece, n.」',
   '經古法語 <b>niece</b>，源自晚期拉丁文 <b>neptia</b>，原義同樣涵蓋孫女、姪女、外甥女。'),
 e('今天的用法', 'Cambridge Dictionary「niece」', '只剩「<b>兄弟姊妹的女兒</b>」一種。')],

husband: [
 e('husband 裡面藏了房子', 'OED「husband, n.」',
   '古英文 <b>hūsbonda</b>，借自古北歐文 <b>húsbóndi</b> ＝ <b>hús</b>（house 房子）'+
   '＋ <b>bóndi</b>（住在裡面、管這個家的人）。'),
 e('同一個字根留下的字', 'OED「husbandry, n.」', '意思是「經營、管理（田產）」。')],

wife: [
 e('wife 的來源', 'OED「wife, n.」', '古英文 <b>wīf</b>，<b>原義就是「女人」</b>，不限已婚。'),
 e('舊意思留在這些字裡', 'OED「midwife, n.」「old wives’ tale」「fishwife, n.」',
   '<b>midwife</b>（助產士，字面「與女人同在」）、<b>old wives’ tale</b>、'+
   '<b>fishwife</b>（賣魚婦）都留著「女人」的舊意思。')]
};

/* ── 頁面用的出處（非單字頁） ── */
const P = {
'daughter-gh': W.daughter,

'why': [
 e('本頁各幕的出處', '見各單字卡的「📖 出處」',
   '每一幕的依據與該單字字卡頁完全相同，這裡只列共通的幾本。'),
 e('主要依據', 'OED（牛津英語詞典）；Lewis &amp; Short《A Latin Dictionary》',
   '字源以 OED 為準，拉丁文詞義另據 Lewis &amp; Short。'),
 e('課堂上最快查到的旁證', 'Wikipedia「Thorn (letter)」「Gh (digraph)」「Danelaw」',
   '學生當場質疑時，這三個條目手機就查得到。'),
 e('寶寶的 ma／da', 'Roman Jakobson (1960)《Why “Mama” and “Papa”?》',
   'ma／da 是嬰兒最早發得出來的音。'),
 e('維京人住在哪裡', 'Anglo-Saxon Chronicle 876–877 年條；「Danelaw（丹麥區）」；OED「-by, suffix」',
   '住的是<b>英格蘭東北部一整片地區</b>，不是某一個村子。'+
   '證據是地名：<b>-by</b>（古北歐文的村子）Grimsby、Whitby、Derby。'),
 warn('這個說法是假的',
   '「Father And Mother, I Love You」<b>查無一手出處</b>，教材只說「它不是 family 的來源」。')],

'why-more': [
 e('tea', 'OED「tea, n.」', '經荷蘭文 thee，源自<b>閩南語（廈門話）的 tê</b>。'),
 e('ketchup', 'OED「ketchup, n.」', '源自<b>閩南語 kê-tsiap（鮭汁）</b>，原是魚醬。'),
 e('hamburger', 'OED「hamburger, n.」',
   '源自<b>德國漢堡市（Hamburg）</b>，與 ham（火腿）無關；後被誤切為 ham＋burger，才生出 cheeseburger。'),
 e('sandwich', 'OED「sandwich, n.」',
   '得名自<b>第四代 Sandwich 伯爵 John Montagu（1718–1792）</b>。'),
 e('breakfast', 'OED「breakfast, n.」', '<b>break</b>（打破）＋ <b>fast</b>（禁食）。'),
 e('goodbye', 'OED「goodbye, int.」', '是 <b>God be with ye</b> 的縮合。')],

'older-younger': BROSIS.slice(),

'parts': [
 e('grand ＝ 大', 'OED「grand, adj.」；OED「grand-, comb. form」',
   '原義是「<b>大的</b>」；親屬稱謂的 grand- 來自<b>法語 grand</b>（grand-père、grand-mère），'+
   '法語 grand 源自拉丁文 <b>grandis</b>「大的」。旁證：<b>Grand Canyon</b>、<b>grand piano</b>。'),
 e('hus ＝ house', 'OED「husband, n.」',
   '古英文 hūsbonda，借自古北歐文 <b>húsbóndi</b> ＝ <b>hús</b>（house 房子）＋ <b>bóndi</b>（管這個家的人）。'),
 e('-ther／-ter 是家人字的尾巴',
   'OED「mother, n.1」「father, n.」「brother, n.」「daughter, n.」；'+
   'Calvert Watkins《The American Heritage Dictionary of Indo-European Roots》',
   '詞根 *māter-、*pəter-、*bhrāter-、*dhugəter-：這四個字的 <b>-ter</b> 來自<b>同一個古老的家人字尾</b>。'),
 warn('誠實界線（給老師，不必跟學生講）',
   '<b>sister</b> 的 -t- 來源不一樣，是 s 和 r 中間<b>後來插進去的音</b>（Watkins 詞根 *swesor-），'+
   '只是結果看起來跟其他四個一樣。所以教材上寫的是「<b>五個字尾巴長得一樣</b>」這個'+
   '<b>看得到的事實</b>，沒有說它們來源全部相同。'),
 e('德文旁證', 'Duden「Mutter」「Vater」「Bruder」「Tochter」「Schwester」',
   '尾巴同樣都是 <b>-ter</b>／<b>-der</b>。'),
 e('別的國家怎麼叫媽媽',
   'Duden「Mutter」；Van Dale「moeder」；Real Academia Española《DLE》「madre」；Larousse「mère」',
   '德 <b>Mutter</b>／荷 <b>moeder</b>／西 <b>madre</b>／法 <b>mère</b>——<b>都從 m 開頭</b>。'),
 e('別的國家怎麼叫爸爸',
   'Duden「Vater」；Van Dale「vader」；Real Academia Española《DLE》「padre」；Larousse「père」',
   '德 <b>Vater</b>／荷 <b>vader</b>／西 <b>padre</b>／法 <b>père</b>——都從 <b>f／v／p</b> 開頭。'),
 e('mo-／fa- 從哪裡來', 'Roman Jakobson (1960)《Why “Mama” and “Papa”?》',
   '<b>ma</b>、<b>pa</b> 是嬰兒最早發得出來的音，全世界的「媽媽」「爸爸」多半由這兩個音來。'),
 e('bro-／sis- 沒有獨立意思', 'OED（查無 bro-／sis- 詞義）；OED「bro, n.」「sis, n.」',
   'OED <b>沒有</b>為 bro-、sis- 列出任何獨立詞義；brother、sister 在英文裡是<b>不可再分的整個字</b>。'+
   '今天口語的 <b>bro</b>、<b>sis</b> 是<b>後來從整個字剪下來的簡稱</b>，不是原本的零件。'),
 e('parent ＋ s', 'Cambridge Dictionary「parent」',
   '這是<b>文法</b>（複數加 s），<b>不是字源</b>。')],

'family-tree': [
 e('family tree 是正式說法', 'Cambridge Dictionary「family tree」；Merriam-Webster「family tree」',
   '英文辭典收錄的固定說法，指「畫出來的家族關係圖」。'),
 e('樹上十二個人的定義', 'Cambridge Dictionary 各詞條',
   'me／father／mother／brother／sister／grandfather／grandmother／'+
   'uncle／aunt／cousin／nephew／niece，每一個都查得到。'),
 e('英文一個字管中文好幾個', 'Cambridge Dictionary「uncle」「aunt」「cousin」',
   '叔伯舅姑丈姨丈<b>都是 uncle</b>；阿姨姑姑舅媽<b>都是 aunt</b>；堂表男女<b>都是 cousin</b>。'),
 e('grandfather ＝ grandpa、grandmother ＝ grandma', 'OED「grandpa, n.」「grandma, n.」',
   '口語簡稱，意思完全一樣。')],

'quiz': [
 e('題目來源', '17 張家人單字卡與故事頁',
   '本卷 20 題全部出自教材內容，出處與各字卡相同。'),
 e('主要依據', 'OED（牛津英語詞典）；Lewis &amp; Short《A Latin Dictionary》', '字源與拉丁文詞義。'),
 e('þ、gh、維京人三題的旁證', 'Wikipedia「Thorn (letter)」「Gh (digraph)」「Danelaw」', ''),
 e('gh 舊讀音仍存的證據', 'Duden「Tochter」／Van Dale「dochter」／Dictionaries of the Scots Language', ''),
 e('ma／da 兩題的依據', 'Roman Jakobson (1960)《Why “Mama” and “Papa”?》', ''),
 warn('第 2 題的依據',
   '「Father And Mother, I Love You」<b>查無一手出處</b>（backronym）。')]
};

/* 音標、音節、發音是每一頁都會用到的，自動附在每一頁出處的最後面。 */
const COMMON = [
 e('音標（美式）', 'Cambridge Dictionary 各詞條的 US 發音；Oxford Learner’s Dictionaries 的 NAmE 發音',
   '本教材的 IPA 一律採<b>美式</b>標法。'),
 e('KK 音標', 'Kenyon &amp; Knott《A Pronouncing Dictionary of American English》(1944)',
   '台灣中小學課本採用的標法。同一個音兩套寫法不同：'+
   'bed 的 e ＝ IPA <b>/e/</b>、KK <b>/ɛ/</b>；boat 的 o ＝ IPA <b>/oʊ/</b>、KK <b>/o/</b>。'),
 e('音節怎麼切', 'Louisa Moats《Speech to Print》；National Reading Panel (2000)',
   '本教材用<b>開音節切法</b>（母音後面切）：<b>fa．mi．ly</b>、mo．ther、fa．ther、'+
   'bro．ther、daugh．ter、un．cle。<b>一個出聲的母音 ＝ 一個音節</b>。'),
 warn('和辭典的連字號不一樣，兩種都對',
   '辭典（如 <b>Merriam-Webster</b>）印的是<b>排版斷行用</b>的連字號，family 寫成 <b>fam·i·ly</b>；'+
   '本教材教的是<b>唸的時候怎麼切</b>，所以是 <b>fa．mi．ly</b>。'+
   '<b>兩種都對，用途不同</b>——一個是給排版看的，一個是給嘴巴唸的。'),
 warn('數音節數的是「還在出聲的母音」',
   '畫面上<b>淺灰色的字母不出聲，不算</b>（niece 的 e、wife 的 e、daughter 的 gh、little 的第二個 t）；'+
   '<b>au／ou／ie／ew</b> 兩個字母一起發一個音，畫面上本來就是一格。照畫面數，這條規則<b>全部成立</b>。'),
 e('唸出來的聲音', 'Web Speech API（瀏覽器內建語音合成），語系 en-US',
   '不需要連網也不需要帳號。<b>實際嗓音由老師那台電腦或平板決定</b>。'+
   '外語單字另外指定語系：德 de-DE、荷 nl-NL、西 es-ES、法 fr-FR。')
];

/* ---- 給樣板用的三段（CSS／HTML／JS），四個產生器共用 ---- */

/* display:none ＝ 完全不佔版面，_verify.js 量到的溢出不受影響 */
const CSS = `
/* 出處覆蓋卡：使用者 2026-09-20 指定改成「秒懂圖表」。
   **不可以用 flex 置中**——內容一超過一個螢幕，上面幾列會被切掉而且捲不回去。
   display:block ＋ overflow:auto，從最上面開始，每一列都捲得到。 */
#src{position:fixed;inset:0;z-index:20;background:#000;
 display:none;padding:clamp(14px,3.4vh,34px) clamp(12px,3vw,30px);overflow:auto;text-align:left}
#src.on{display:block}
#src .wrap{max-width:1000px;margin:0 auto}
#src h4{margin:0 0 10px;color:#9FB4C8;font-size:clamp(19px,2.6vh,26px);
 letter-spacing:.24em;font-weight:700}
/* 秒懂動畫：課堂上教的 ➜ 出自這一本 ➜ 你也查得到 */
#src .flow{display:flex;align-items:center;justify-content:flex-start;flex-wrap:wrap;
 gap:8px;margin:0 0 16px}
#src .flow span{font-size:clamp(13px,1.9vh,17px);border-radius:99px;padding:7px 14px;
 white-space:nowrap}
#src .f1{background:#16202A;color:#9FB4C8;border:1px solid #24323E}
#src .f2{background:#1E1A12;color:#D8C08A;border:1px solid #332C1C}
#src .f3{background:#13201A;color:#8FBE92;border:1px solid #1F3329}
#src .fa{color:#4A4A4A;font-size:clamp(14px,2vh,18px)}
#src.on .flow span,#src.on .flow .fa{animation:srcflow .5s cubic-bezier(.2,1.4,.4,1) both}
#src.on .flow > *:nth-child(1){animation-delay:.05s}
#src.on .flow > *:nth-child(2){animation-delay:.20s}
#src.on .flow > *:nth-child(3){animation-delay:.33s}
#src.on .flow > *:nth-child(4){animation-delay:.46s}
#src.on .flow > *:nth-child(5){animation-delay:.59s}
@keyframes srcflow{0%{opacity:0;transform:translateX(-14px) scale(.9)}100%{opacity:1;transform:none}}
/* 秒懂圖表：三欄——講什麼／證據出處／查到會看到什麼 */
#src table{width:100%;border-collapse:collapse}
#src th{text-align:left;color:#7E8B96;font-weight:700;letter-spacing:.06em;
 font-size:clamp(13px,1.8vh,16px);padding:0 10px 8px;border-bottom:1px solid #262626;white-space:nowrap}
#src td{vertical-align:top;padding:11px 10px;border-bottom:1px solid #1A1A1A;
 font-size:clamp(15px,2.05vh,20px);line-height:1.6}
#src td.t{color:#F2F2F2;font-weight:700;width:22%}
#src td.s{color:#D8C08A;width:36%}
#src td.d{color:#C2C2C2}
#src td b{color:#F2F2F2;font-weight:700}
#src td.s b{color:#EBD9A8}
#src tr.w td{background:#141008}
#src tr.w td.t{color:#E0B15C}
#src .foot{margin:14px 0 0;color:#6E6E6E;font-size:clamp(12px,1.7vh,15px);line-height:1.6}
#src button{display:block;margin:20px auto 0;background:#1E1E1E;border:1px solid #4A4A4A;
 color:#F2F2F2;border-radius:99px;font-size:18px;padding:12px 28px;min-height:52px;
 font-family:inherit;cursor:pointer}`;

const row = (r) =>
 '<tr' + (r.w ? ' class="w"' : '') + '>' +
 '<td class="t">' + r.t + '</td>' +
 '<td class="s">' + (r.s || '—') + '</td>' +
 '<td class="d">' + r.d + '</td></tr>';

const html = (rows) =>
 '<footer id="src"><div class="wrap"><h4>出處</h4>' +
 '<div class="flow">' +
   '<span class="f1">📺 課堂上教的</span><span class="fa">➜</span>' +
   '<span class="f2">📖 出自這一本</span><span class="fa">➜</span>' +
   '<span class="f3">✅ 你也查得到</span>' +
 '</div>' +
 '<table><thead><tr><th>這一條在講什麼</th><th>證據出處（照這個就查得到）</th><th>查到會看到什麼</th></tr></thead>' +
 '<tbody>' + rows.concat(COMMON).map(row).join('') + '</tbody></table>' +
 '<p class="foot">⚠️ 這些條目名稱都是<b>標準工具書</b>的正式條目，老師和學生照著查一定找得到。' +
 '製作環境連不上網，<b>沒有逐條開網頁核對過</b>——第一次上課前建議抽查兩三條。</p>' +
 '<button id="srcx">關閉</button></div></footer>';

const btn = '<button id="srcb">📖 出處</button>';

const JS = `
(function(){var s=document.getElementById("src");
 function t(v){s.classList.toggle("on",v);if(v)s.scrollTop=0}
 document.getElementById("srcb").addEventListener("click",function(){t(!s.classList.contains("on"))});
 document.getElementById("srcx").addEventListener("click",function(){t(false)});
 document.addEventListener("keydown",function(e){if(e.key==="Escape")t(false)});})();`;

module.exports = { W, P, COMMON, CSS, html, btn, JS, e, warn };
