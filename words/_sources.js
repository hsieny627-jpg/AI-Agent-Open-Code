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
/* 有秒懂動畫的出處（v ＝ 放在中間的動畫 HTML，使用者 2026-09-24 指定） */
const ev   = (t, s, d, v) => ({ t, s, d, v });
/* 給這一條一個 id：頁面上的「📖 出處」按鈕直接跳到這一條（使用者 2026-09-25 指定） */
const I    = (id, r) => Object.assign(r, { id });

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
 I('grand', e('grand ＝ 大', 'OED「grand, adj.」「grand-, comb. form」',
   'grand 原本就是「<b>大的</b>」，從<b>法文</b>借來（grand-père）。旁證：<b>Grand Canyon</b> 大峽谷。')),
 I('hus', e('hus ＝ house', 'OED「husband, n.」',
   '古北歐文 <b>hús</b>（房子）＋ <b>bóndi</b>（管家的人）。')),
 I('tails', ev('這四個字，尾巴是同一條',
   'Watkins《American Heritage Dictionary of Indo-European Roots》詞根 māter-、pəter-、bhrāter-、dhughəter-',
   '四個字最早的樣子都帶著 <b>-ter</b>。今天唸成 ther／ter，是<b>聲音後來變了</b>。',
   '<div class="ev">'+
   '<span class="st" style="animation-delay:.2s"><b>*mā<span class="new">ter</span></b><em>媽媽</em></span>'+
   '<span class="st" style="animation-delay:.45s"><b>*pə<span class="new">ter</span></b><em>爸爸</em></span>'+
   '<span class="st" style="animation-delay:.7s"><b>*bhrā<span class="new">ter</span></b><em>兄弟</em></span>'+
   '<span class="st" style="animation-delay:.95s"><b>*dhughə<span class="new">ter</span></b><em>女兒</em></span></div>')),
 ev('sister 的 ter，來源不一樣',
   'Watkins 詞根 <b>swesor-</b>；Kroonen《Etymological Dictionary of Proto-Germanic》(2013)「*swester-」；OED「sister, n.」',
   '最早是 <b>swesor</b>，<b>沒有 t</b>。s 和 r 中間<b>後來才擠進一個 t</b>，所以只是<b>長得像</b>。',
   '<div class="ev">'+
   '<span class="st" style="animation-delay:.2s"><b>*swe<span class="no">s</span>or</b><em>最早：沒有 t</em></span>'+
   '<span class="ar" style="animation-delay:.6s">➜</span>'+
   '<span class="st" style="animation-delay:.9s"><b>*swes<span class="new">t</span>er</b><em>t 擠進來</em></span>'+
   '<span class="ar" style="animation-delay:1.2s">➜</span>'+
   '<span class="st" style="animation-delay:1.5s"><b>sis<span class="new">t</span>er</b><em>今天</em></span></div>'),
 ev('證據：別的語言裡，姊妹沒有 t',
   'Lewis &amp; Short《A Latin Dictionary》「soror」；Watkins 詞根 swesor-',
   '拉丁文 <b>soror</b>、梵文 <b>svasar</b>：同一個祖先，<b>都沒有 t</b>。',
   '<div class="ev">'+
   '<span class="st" style="animation-delay:.2s"><b>soror</b><em>拉丁文</em></span>'+
   '<span class="st" style="animation-delay:.5s"><b>svasar</b><em>梵文</em></span>'+
   '<span class="st" style="animation-delay:.8s"><b>sis<span class="new">t</span>er</b><em>英文</em></span></div>'),
 I('terwhy', e('-ter 最早是什麼意思？', 'Mallory &amp; Adams《The Oxford Introduction to Proto-Indo-European》(2006) 第 12 章「Kinship」',
   '它是很久以前<b>家人稱呼共用的尾巴</b>；最早還有沒有別的意思，<b>學者到今天還沒有定論</b>。')),
 I('de', e('德文', 'Duden「Mutter」「Vater」「Bruder」「Tochter」「Schwester」', '尾巴一樣是 <b>-ter／-der</b>。')),
 I('nl', e('荷蘭文', 'Van Dale「moeder」「vader」「broer」「dochter」「zus」',
   '<b>broer</b> 以前是 broeder，<b>zus</b> 是 zuster 的簡短說法。')),
 /* 前面那一半：證據要讓學生信服（使用者 2026-09-25 指定）——全世界的寶寶都先叫 ma、pa */
 I('mofa', ev('mo、fa 從哪裡來？寶寶最早的音',
   'Roman Jakobson (1960)《Why “Mama” and “Papa”?》；各語言辭典「媽媽／爸爸」',
   '<b>m</b>、<b>p</b>、<b>b</b> 只要嘴唇一合一開就發得出來，<b>寶寶最早會的就是它們</b>。所以很多語言的媽媽、爸爸都長這樣。',
   '<div class="ev">'+
   '<span class="st" style="animation-delay:.2s"><b><span class="new">m</span>ama <span class="new">p</span>apa</b><em>英文（小孩說）</em></span>'+
   '<span class="st" style="animation-delay:.5s"><b><span class="new">M</span>ama <span class="new">P</span>apa</b><em>德文</em></span>'+
   '<span class="st" style="animation-delay:.8s"><b><span class="new">m</span>amá <span class="new">p</span>apá</b><em>西班牙文</em></span>'+
   '<span class="st" style="animation-delay:1.1s"><b><span class="new">m</span>aman <span class="new">p</span>apa</b><em>法文</em></span>'+
   '<span class="st" style="animation-delay:1.4s"><b>媽媽 爸爸</b><em>中文 māma bàba</em></span></div>')),
 I('brosis', e('bro-／sis- 沒有意思', 'OED「brother, n.」「sister, n.」「bro, n.」「sis, n.」',
   'OED 沒有替 bro-、sis- 列任何意思。口語的 bro、sis 是<b>後來剪短的</b>。')),
 I('parent', e('parent ＋ s', 'Cambridge Dictionary「parent」', '這是<b>文法</b>（複數加 s），不是字源。'))],

'world': [
 /* 古日耳曼語是什麼（使用者 2026-09-25 指定：學生不懂，秒懂動畫放在出處） */
 I('gmc', ev('古日耳曼語是什麼？',
   'Wikipedia「Proto-Germanic language」；Ringe《From Proto-Indo-European to Proto-Germanic》(2006)',
   '大約 <b>2000 多年前</b>，住在<b>北歐和德國北部</b>的人說的話。<b>沒有留下書</b>，是學者把英文、德文、荷蘭文、瑞典文<b>拿來比對</b>，推回去的。',
   '<div class="ev">'+
   '<span class="st" style="animation-delay:.2s"><b>👵 古日耳曼語</b><em>2000 多年前，沒有留下書</em></span>'+
   '<span class="ar" style="animation-delay:.6s">➜</span>'+
   '<span class="st" style="animation-delay:.9s"><b>mother</b><em>英文</em></span>'+
   '<span class="st" style="animation-delay:1.1s"><b>Mutter</b><em>德文</em></span>'+
   '<span class="st" style="animation-delay:1.3s"><b>moeder</b><em>荷蘭文</em></span>'+
   '<span class="st" style="animation-delay:1.5s"><b>mor</b><em>瑞典文</em></span></div>')),
 I('where', e('歐洲在台灣的哪裡', '任何一本世界地圖／Google 地圖',
   '歐洲在台灣的<b>西北邊</b>；台北飛倫敦、法蘭克福的直飛班機，大約要飛<b>十幾個小時</b>。')),
 I('map', e('語言也有家人', 'Wikipedia「Germanic languages」「Indo-European languages」',
   '英文、德文、荷蘭文、瑞典文都是<b>日耳曼語族</b>——像兄弟姊妹。')),
 I('why5', e('為什麼挑這五國', 'Wikipedia「Germanic languages」「Norman Conquest」「Romance languages」',
   '德、荷、瑞典：<b>日耳曼家族</b>，跟英文最像；法文：<b>1066 年</b>以後借給英文很多字；西班牙文：跟法文同一個<b>拉丁家族</b>，拿來比較。')),
 I('steppe', e('大約 6000 年前', 'Mallory &amp; Adams (2006)；Wikipedia「Kurgan hypothesis」',
   '很多學者認為：這一大家族最早在<b>黑海北邊的草原</b>。這是<b>目前最多人支持的說法</b>，不是百分之百確定。')),
 I('boat', e('大約 1500 年前，坐船到英國', 'Bede《英吉利教會史》(731)；Wikipedia「Anglo-Saxon settlement of Britain」',
   '<b>盎格魯人、撒克遜人</b>從今天的<b>德國北部、丹麥</b>坐船到英國，帶去的話就是英文的老祖先。')),
 I('latin', e('拉丁家族', 'Wikipedia「Romance languages」；Larousse「mère」；RAE「madre」',
   '法文、西班牙文、義大利文都從<b>拉丁文</b>來：拉丁文 <b>māter</b> ➜ 法文 <b>mère</b>、西班牙文 <b>madre</b>。')),
 I('1066', e('1066 年，法文進來了', 'Wikipedia「Norman Conquest」；OED「uncle」「aunt」「cousin」「nephew」「niece」',
   '<b>講法文的諾曼人</b>打贏英國。<b>uncle、aunt、cousin、nephew、niece</b> 都是那之後從法文借來的。')),
 I('w-mother', e('mother 家族', 'Duden「Mutter」；Van Dale「moeder」；SAOL「mor」；Larousse「mère」；RAE《DLE》「madre」',
   '德 <b>Mutter</b>、荷 <b>moeder</b>、瑞典 <b>mor</b>、法 <b>mère</b>、西 <b>madre</b>。')),
 I('w-father', e('father 家族', 'Duden「Vater」；Van Dale「vader」；SAOL「far」；Larousse「père」；RAE《DLE》「padre」',
   '德 <b>Vater</b>、荷 <b>vader</b>、瑞典 <b>far</b>、法 <b>père</b>、西 <b>padre</b>。')),
 I('w-family', e('family', 'OED「family, n.」；Larousse「famille」；RAE「familia」',
   '英文 family 來自<b>拉丁文 familia</b>，所以跟法文、西班牙文最像。')),
 I('w-brother', e('brother／sister', 'Duden／Van Dale／SAOL 各詞條；RAE「hermano」',
   '德荷瑞都像英文。西班牙文 <b>hermano</b> 不像，因為它來自另一個拉丁字 germanus。')),
 I('w-grandfather', e('瑞典文分爸爸那邊、媽媽那邊', 'SAOL（瑞典學院詞表）「farfar」「morfar」「farbror」「morbror」「faster」「moster」',
   '<b>farfar</b> ＝ 爸爸的爸爸，<b>morfar</b> ＝ 媽媽的爸爸——<b>跟中文一樣分兩邊</b>。')),
 I('w-grand', e('grandfather 一半一半', 'OED「grand-, comb. form」；Larousse「grand-père」',
   '<b>grand</b> 從法文 grand-père 借來，<b>father</b> 是日耳曼家族的字。')),
 I('w-uncle', e('uncle／aunt／cousin', 'OED「uncle」「aunt」「cousin」；Larousse「oncle」「tante」「cousin」',
   '三個都是 1066 年以後<b>從法文借來的</b>，所以跟法文最像。')),
 I('sum', warn('地圖是示意圖', '地圖上的路線與年代是<b>簡化過的示意</b>，實際是好幾百年、很多批人慢慢搬的。')),
 warn('瑞典文的聲音', '瑞典文用的是<b>預先做好的語音檔</b>：瑞典國家圖書館（KBLab）用<b>瑞典母語者的錄音</b>（NST 語料，CC0）訓練的神經語音 Piper sv_SE-nst。很多電腦沒有瑞典文語音，瀏覽器會用英文腔亂唸，所以改用音檔。')],

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
 e('音標（美式）', 'Cambridge Dictionary 各詞條的 US 發音；Oxford Learner’s Dictionaries（NAmE）',
   '本教材的 IPA 一律用<b>美式</b>。'),
 e('KK 音標', 'Kenyon &amp; Knott《A Pronouncing Dictionary of American English》(1944)',
   '台灣課本用的標法。例：bed 的 e ＝ IPA <b>/e/</b> ＝ KK <b>/ɛ/</b>。'),
 e('音節怎麼切', 'Louisa Moats《Speech to Print》',
   '母音後面切：<b>fa．mi．ly</b>。<b>一個出聲的母音 ＝ 一個音節</b>。'),
 warn('辭典的 fam·i·ly 也對', '那是<b>排版斷行</b>用的；本教材教的是<b>唸的時候</b>怎麼切。兩種都對。'),
 warn('淺灰色的字母不算', '不出聲的字母（淺灰色）<b>不算母音</b>，數紅色的就對了。'),
 e('唸出來的聲音', 'Web Speech API（瀏覽器內建語音，en-US）',
   '不用連網。<b>嗓音由這台電腦決定</b>。外語另外指定：德 de-DE、荷 nl-NL、瑞典 sv-SE、法 fr-FR、西 es-ES。')
];

/* ---- 給樣板用的三段（CSS／HTML／JS），五個產生器共用 ---- */

/* 出處：**一條一頁**（使用者 2026-09-24 指定改版）。
 * 原本是一整張三欄表格，字小、一次塞十幾列，學生不想看也看不懂。
 * 現在一條出處就是一整頁：
 *   ① 最上面一行大字：這一條在講什麼（t）
 *   ② 有秒懂動畫的條目，動畫放在中間（v）
 *   ③ 📖 證據在這本書（s）⬇ ✅ 翻開會看到（d）—— 一步一步跳出來
 * 左右翻頁（◀ ▶、鍵盤 ← →），Esc 或 ✕ 關閉。
 * 平常 display:none，完全不佔版面，所以 _verify.js 量到的溢出不受影響。 */
const CSS = `
#src{position:fixed;inset:0;z-index:40;background:#000;display:none;flex-direction:column;
 padding:max(10px,env(safe-area-inset-top)) clamp(12px,3vw,34px) max(10px,env(safe-area-inset-bottom));text-align:left}
#src.on{display:flex}
#src .shd{display:flex;align-items:center;justify-content:space-between;gap:10px;flex:0 0 auto}
#src .sttl{color:#9FB4C8;font-size:clamp(17px,2.6vh,24px);font-weight:700;letter-spacing:.2em}
#src .scnt{color:#D8D3C5;font-size:clamp(16px,2.4vh,22px);font-weight:700}
#src .sbody{flex:1 1 auto;min-height:0;overflow:auto;display:flex}
#src .sl{display:none;flex-direction:column;justify-content:center;gap:clamp(10px,2vh,22px);
 width:100%;max-width:980px;margin:auto}
#src .sl.on{display:flex}
#src .lt{font-size:clamp(28px,5.6vh,54px);font-weight:700;color:#F2F2F2;line-height:1.3;text-align:center;
 animation:srcIn .45s cubic-bezier(.2,1.3,.4,1) both}
#src .sl.w .lt{color:#F0B45C}
#src .lt .wtag{display:inline-block;font-size:.5em;vertical-align:middle;background:#3A2A0C;color:#F0B45C;
 border:1px solid #6B4E1A;border-radius:99px;padding:4px 12px;margin-right:10px;letter-spacing:.1em}
#src .vis{display:flex;justify-content:center;animation:srcIn .45s cubic-bezier(.2,1.3,.4,1) .15s both}
#src .ck{display:flex;align-items:center;gap:clamp(10px,1.6vw,20px);border-radius:18px;
 padding:clamp(10px,1.8vh,18px) clamp(14px,2vw,24px);animation:srcIn .5s cubic-bezier(.2,1.3,.4,1) both}
#src .ck .ci{font-size:clamp(30px,5.4vh,52px);flex:0 0 auto}
#src .ck .cl{display:block;font-size:clamp(13px,1.9vh,17px);letter-spacing:.14em;margin-bottom:4px;font-weight:700}
#src .ck .cv{display:block;line-height:1.5}
#src .ck.s{background:#17140C;border:1px solid #3A3018;animation-delay:.35s}
#src .ck.s .cl{color:#B79A5C}
#src .ck.s .cv{color:#EBD9A8;font-size:clamp(18px,3vh,30px);font-weight:700}
#src .ck.d{background:#0E1A12;border:1px solid #21402B;animation-delay:.75s}
#src .ck.d .cl{color:#6FAE7C}
#src .ck.d .cv{color:#E6E6E6;font-size:clamp(20px,3.4vh,34px)}
#src .ck.d .cv b{color:#FFD24A}
#src .sl.w .ck.d{background:#1A1206;border-color:#4A3510}
#src .car{text-align:center;color:#5A5A5A;font-size:clamp(20px,3vh,30px);line-height:1;
 animation:srcIn .4s ease .6s both}
@keyframes srcIn{0%{opacity:0;transform:translateY(16px) scale(.94)}100%{opacity:1;transform:none}}
#src .snav{display:flex;align-items:center;justify-content:center;gap:clamp(8px,1.6vw,18px);flex:0 0 auto;
 padding-top:8px}
#src .snav button,#src .shd button{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;
 font-size:clamp(16px,2.4vh,22px);padding:10px 22px;min-height:50px;font-family:inherit;cursor:pointer}
#src .snav button:disabled{opacity:.3}
#src .sdots{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;max-width:46vw}
#src .sdots i{width:10px;height:10px;border-radius:50%;background:#2A2A2A}
#src .sdots i.on{background:#FFD24A}
/* 出處裡的秒懂動畫（字母一格一格跳出來、插進來的字母會發光） */
#src .ev{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:clamp(8px,1.4vw,18px)}
#src .ev .st{display:flex;flex-direction:column;align-items:center;gap:4px;opacity:0;
 animation:srcIn .5s cubic-bezier(.2,1.3,.4,1) both}
#src .ev .st b{font-size:clamp(24px,4.6vh,46px);color:#F2F2F2;letter-spacing:.02em}
#src .ev .st em{font-style:normal;font-size:clamp(12px,1.8vh,16px);color:#8E8E8E;white-space:nowrap}
#src .ev .ar{color:#5A5A5A;font-size:clamp(20px,3vh,30px);padding-bottom:1.1em;opacity:0;animation:srcIn .4s ease both}
#src .ev .new{color:#FFD24A;display:inline-block;animation:newT 1.2s ease-in-out 1.6s 3}
#src .ev .no{color:#FF6B6B}
@keyframes newT{0%,100%{transform:none;text-shadow:none}50%{transform:translateY(-.25em) scale(1.5);text-shadow:0 0 18px rgba(255,210,74,.9)}}
#src .stoc{display:none;position:absolute;left:0;right:0;top:calc(max(10px,env(safe-area-inset-top)) + 64px);bottom:0;
 background:#000;z-index:2;overflow:auto;padding:10px clamp(12px,3vw,34px) 20px;
 grid-template-columns:repeat(auto-fill,minmax(clamp(220px,28vw,320px),1fr));gap:8px;align-content:start}
#src .stoc.on{display:grid}
#src .stoc button{display:flex;align-items:center;gap:10px;text-align:left;background:#0C0C0C;border:1px solid #2A2A2A;
 border-radius:14px;color:#F2F2F2;font-family:inherit;font-size:clamp(15px,2.3vh,21px);padding:10px 14px;min-height:54px;cursor:pointer}
#src .stoc button b{flex:0 0 auto;width:2em;height:2em;border-radius:50%;background:#1E2A36;display:flex;align-items:center;justify-content:center}
#src .stoc button.w b{background:#3A2A0C;color:#F0B45C}
#src .stoc button.cur{border-color:#FFD24A;background:#1D1908}
#src .shd button#srct{margin-left:auto}
.reduce #src *{animation:none!important;opacity:1!important}`;

const icoOf = (s) => /OED|牛津/.test(s) ? '📕' : /Cambridge|Oxford Learner/.test(s) ? '📘' :
  /Duden/.test(s) ? '📗' : /Van Dale/.test(s) ? '📙' : /Wikipedia/.test(s) ? '🌐' : '📖';

const slide = (r, k, n) =>
 '<section class="sl' + (r.w ? ' w' : '') + (k === 0 ? ' on' : '') + '" data-k="' + k + '"' + (r.id ? ' data-id="' + r.id + '"' : '') + '>' +
 '<div class="lt">' + (r.w ? '<span class="wtag">⚠️ 誠實註記</span>' : '') + r.t + '</div>' +
 (r.v ? '<div class="vis">' + r.v + '</div>' : '') +
 (r.s ? '<div class="ck s"><span class="ci">' + icoOf(r.s) + '</span><span><span class="cl">證據在這本書</span>' +
   '<span class="cv">' + r.s + '</span></span></div><div class="car">⬇</div>' : '') +
 '<div class="ck d"><span class="ci">' + (r.w ? '⚠️' : '✅') + '</span><span><span class="cl">' +
   (r.s ? '翻開會看到' : '要知道的事') + '</span><span class="cv">' + r.d + '</span></span></div>' +
 '</section>';

/* 出處的 📑 目次（使用者 2026-09-25 指定）：一條一格，點了直接跳過去 */
const strip = h => String(h).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
const html = (rows) => {
 const all = rows.concat(COMMON);
 return '<footer id="src" aria-label="出處"><div class="shd"><span class="sttl">📖 出處</span>' +
  '<span class="scnt"><span id="srcn">1</span> ／ ' + all.length + '</span>' +
  '<button id="srct">📑 目次</button><button id="srcx">✕ 關閉</button></div>' +
  '<div class="stoc" id="stoc">' + all.map((r, k) => '<button data-k="' + k + '"' + (r.w ? ' class="w"' : '') + '><b>' + (k + 1) +
    '</b><span>' + strip(r.t) + '</span></button>').join('') + '</div>' +
  '<div class="sbody">' + all.map((r, k) => slide(r, k, all.length)).join('') + '</div>' +
  '<div class="snav"><button id="srcp">◀ 上一條</button><span class="sdots">' +
  all.map((r, k) => '<i' + (k === 0 ? ' class="on"' : '') + '></i>').join('') + '</span>' +
  '<button id="srcf">下一條 ▶</button></div></footer>';
};

const btn = '<button id="srcb">📖 出處</button>';

const JS = `
(function(){var s=document.getElementById("src");if(!s)return;
 var L=s.querySelectorAll(".sl"),D=s.querySelectorAll(".sdots i"),k=0;
 function go(n){k=Math.max(0,Math.min(L.length-1,n));
  for(var j=0;j<L.length;j++){L[j].classList.toggle("on",j===k);D[j].classList.toggle("on",j===k)}
  /* 換頁時動畫重播一次 */
  var c=L[k];c.style.display="none";void c.offsetWidth;c.style.display="";
  document.getElementById("srcn").textContent=k+1;
  document.getElementById("srcp").disabled=(k===0);
  document.getElementById("srcf").disabled=(k===L.length-1)}
 /* 從哪一條開始：這一幕／這一張字卡對應的那一條（window.SRCAT：出處的 id 或第幾條），
    沒有對應就從第一條開始（使用者 2026-09-25 指定：按「出處」直接跳到這一張的證據） */
 function at(v){if(v==null||v==="")return 0;if(typeof v==="number")return v;
  for(var j=0;j<L.length;j++)if(L[j].getAttribute("data-id")===v)return j;return 0}
 var T=document.getElementById("stoc");
 function toc(v){T.classList.toggle("on",v);if(v){[].forEach.call(T.querySelectorAll("button"),function(b,j){b.classList.toggle("cur",j===k)})}}
 function t(v,from){s.classList.toggle("on",v);toc(false);if(v)go(at(from))}
 window.SRCOPEN=function(id){t(true,id)};
 document.getElementById("srcb").addEventListener("click",function(){
  if(s.classList.contains("on"))t(false);else t(true,window.SRCAT)});
 document.getElementById("srcx").addEventListener("click",function(){t(false)});
 document.getElementById("srct").addEventListener("click",function(){toc(!T.classList.contains("on"))});
 T.addEventListener("click",function(e){var b=e.target.closest?e.target.closest("button"):null;if(!b)return;
  toc(false);go(+b.getAttribute("data-k")||0)});
 document.getElementById("srcp").addEventListener("click",function(){go(k-1)});
 document.getElementById("srcf").addEventListener("click",function(){go(k+1)});
 /* 出處開著的時候，← → 翻的是出處，不是後面那一頁（先攔下來） */
 document.addEventListener("keydown",function(e){
  if(!s.classList.contains("on"))return;
  if(e.key==="Escape"){if(T.classList.contains("on"))toc(false);else t(false)}
  else if(e.key==="ArrowRight"||e.key===" "){go(k+1)}
  else if(e.key==="ArrowLeft"){go(k-1)}
  else return;
  e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
 },true);})();`;

module.exports = { W, P, COMMON, CSS, html, btn, JS, e, warn, ev, I };
