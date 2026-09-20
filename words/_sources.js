/* words/_sources.js — 出處來源（單一真相來源）
 *
 * 使用者 2026-09-19 指定：所有字卡、補充動畫、暖身題都要附註「100% 正確證據的出處」，
 * 但**附註在最下方、嚴禁佔據版面**，以免學習失焦。
 *
 * 做法：每一頁最下方放一個 <footer id="src">，平常 display:none（完全不佔版面），
 * 由 #bar 的「📖 出處」按鈕打開成一張覆蓋卡。學生質疑時老師才開。
 *
 * 這個檔同時被 _build.js / _build_story.js / _build_quiz.js require，
 * 改出處只改這一個地方（省額度規則：重複的東西寫成一份）。
 *
 * 引用原則：只列**查得到的標準工具書與條目名稱**，不寫「我查過了」這種空話。
 * 老師在課堂被學生追問時，照著條目名稱就查得到。
 */

/* 單字 → 出處條目。每一筆是一行字（可含 <b>）。 */
const W = {
family:[
 '<b>OED</b>（牛津英語詞典）「family, n.」：源自拉丁文 <b>familia</b>，原指整個家戶，<b>包含家中僕役與幫傭</b>，不只血親。',
 '<b>Lewis &amp; Short《A Latin Dictionary》</b>「familia」：第一義即「一家的僕役總稱」。',
 '「Father And Mother, I Love You」<b>查無任何一手出處</b>，只出現在縮寫收集網站，是後人倒推的順口溜（backronym），<b>不是 family 的來源</b>。'],
parent:[
 '<b>OED</b>「parent, n.」：源自拉丁文 <b>parens</b>，動詞 <b>parere</b>「生下、產出」的分詞，意思是「把孩子生下來的人」。',
 '<b>Cambridge Dictionary</b>「parent」：單數 a parent，複數 parents。'],
mother:[
 '<b>OED</b>「mother, n.1」：古英文 <b>mōdor</b>。',
 '<b>Roman Jakobson (1960)《Why “Mama” and “Papa”?》</b>：全世界語言的「媽媽」多半用 <b>m</b> 起頭的唇音，因為那是嬰兒最早發得出來的音。',
 '<b>OED</b>「mum, n.4」「mom, n.」：mum 通行於英國，mom 通行於美國。'],
father:[
 '<b>OED</b>「father, n.」：古英文 <b>fæder</b>。',
 '<b>OED</b>「dad, n.1」：約 1500 年就有紀錄，屬於 <b>nursery word（育兒語）</b>，<b>不是 father 的縮寫</b>。',
 '<b>Roman Jakobson (1960)《Why “Mama” and “Papa”?》</b>：da／pa 同樣是嬰兒最早發得出來的音。'],
brother:[
 '<b>OED</b>「brother, n.」：古英文 <b>brōþor</b>。',
  '<b>Cambridge Dictionary</b>「brother」「sister」：定義本身<b>不含年齡</b>——英文這兩個字不分長幼。',
  '<b>Oxford Learner’s Dictionaries</b>「brother」「sister」例句作 <b>my older brother</b>／<b>my younger sister</b>：要分長幼就加 <b>older</b>／<b>younger</b>。',
  '<b>Merriam-Webster</b>「big brother」＝ an older brother；「little brother」＝ a younger brother；「big sister」「little sister」同理。<b>口語常用，完全正確</b>。',
  '<b>Cambridge Dictionary</b> 文法頁「elder or older?」：<b>elder</b> 只能放在名詞前面（elder brother），<b>不可以</b>寫 He is <s>elder</s> than me——要用 <b>older than</b>。elder 偏英式、偏正式。',
  '⚠️ <b>誠實註記</b>：「最常用」指的是<b>辭典與英語教材一致採用</b>的說法（older／younger 用於書面與教學，big／little 用於口語）。要做精確的<b>使用次數排名</b>需要查 COCA／BNC 語料庫，本次製作環境連不上那些網站，<b>沒有做過次數統計</b>，所以教材上沒有寫「第幾名」這種話。',
 '<b>Wikipedia「Thorn (letter)」</b>／<b>Unicode U+00FE</b>：<b>þ</b>（thorn，荊棘）是古英文與古北歐文的字母，相當於今天的 <b>th</b>。',
 '<b>Cambridge Dictionary</b>「older brother／younger brother」：英文不用不同的字分長幼，靠 older／younger。'],
sister:[
 '<b>OED</b>「sister, n.」：古英文本來是 <b>sweostor</b>；今天的 <b>sister</b> 帶有<b>古北歐文 systir</b> 的影響。',
  '<b>Cambridge Dictionary</b>「brother」「sister」：定義本身<b>不含年齡</b>——英文這兩個字不分長幼。',
  '<b>Oxford Learner’s Dictionaries</b>「brother」「sister」例句作 <b>my older brother</b>／<b>my younger sister</b>：要分長幼就加 <b>older</b>／<b>younger</b>。',
  '<b>Merriam-Webster</b>「big brother」＝ an older brother；「little brother」＝ a younger brother；「big sister」「little sister」同理。<b>口語常用，完全正確</b>。',
  '<b>Cambridge Dictionary</b> 文法頁「elder or older?」：<b>elder</b> 只能放在名詞前面（elder brother），<b>不可以</b>寫 He is <s>elder</s> than me——要用 <b>older than</b>。elder 偏英式、偏正式。',
  '⚠️ <b>誠實註記</b>：「最常用」指的是<b>辭典與英語教材一致採用</b>的說法（older／younger 用於書面與教學，big／little 用於口語）。要做精確的<b>使用次數排名</b>需要查 COCA／BNC 語料庫，本次製作環境連不上那些網站，<b>沒有做過次數統計</b>，所以教材上沒有寫「第幾名」這種話。',
 '<b>Wikipedia「Old Norse influence on English」</b>／<b>Danelaw（丹麥區）</b>：九至十一世紀北歐人（維京人）在英格蘭東北部定居，兩群人長期混居，英語吸收了大量北歐詞形。'],
son:[
 '<b>OED</b>「son, n.」：古英文 <b>sunu</b>。',
 '<b>Cambridge Dictionary</b>：son 與 sun 的音標同為 /sʌn/，是<b>同音異義詞（homophone）</b>。'],
daughter:[
 '<b>OED</b>「daughter, n.」：古英文 <b>dohtor</b>。',
 '<b>Wikipedia「Gh (digraph)」</b>／<b>「Yogh」</b>：中古英語的 <b>gh</b> 代表喉嚨後方的摩擦音 <b>/x/</b>，大約 1500–1700 年間在多數英語方言中消失，<b>字母留了下來</b>。',
 '<b>Duden</b>（德語權威詞典）「Tochter」：音標 /ˈtɔxtɐ/，<b>ch 仍發 /x/</b>。',
 '<b>Van Dale</b>（荷蘭語權威詞典）「dochter」：音標 /ˈdɔxtər/，<b>ch 仍發 /x/</b>。',
 '<b>Dictionaries of the Scots Language</b>（dsl.ac.uk）「dochter」「nicht」：蘇格蘭語至今保留 <b>/x/</b>。'],
grandfather:[
 '<b>OED</b>「grand-, comb. form」：親屬稱謂的 <b>grand-</b> 來自<b>法語（Anglo-French）grand</b>，比照 grandpère 的構詞造出 grandfather。',
 '<b>OED</b>「grandpa, n.」：口語簡稱。'],
grandmother:[
 '<b>OED</b>「grand-, comb. form」：同一個從<b>法語</b>借來的 <b>grand-</b>，裝在 mother 前面。',
 '<b>OED</b>「grandma, n.」：口語簡稱。'],
uncle:[
 '<b>OED</b>「uncle, n.」：經古法語 <b>oncle</b>，源自拉丁文 <b>avunculus</b>，<b>原義專指「母親的兄弟」（舅舅）</b>。',
 '<b>Cambridge Dictionary</b>「uncle」：今天叔、伯、舅、姑丈、姨丈<b>一律是 uncle</b>。'],
aunt:[
 '<b>OED</b>「aunt, n.」：經法語 <b>aunte</b>，源自拉丁文 <b>amita</b>，<b>原義專指「父親的姊妹」（姑姑）</b>。',
 '<b>OED</b>「auntie, n.」：親暱形。'],
cousin:[
 '<b>OED</b>「cousin, n.」：經古法語 <b>cosin</b>，源自拉丁文 <b>consobrinus</b>，<b>原義是「母親的姊妹的孩子」</b>。',
 '<b>Cambridge Dictionary</b>「cousin」：今天堂、表、男、女<b>一律是 cousin</b>。'],
nephew:[
 '<b>OED</b>「nephew, n.」：經古法語 <b>neveu</b>，源自拉丁文 <b>nepos</b>，<b>原義涵蓋孫子、姪子、外甥</b>。',
 '<b>Cambridge Dictionary</b>「nephew」：今天只剩「兄弟姊妹的兒子」一種。'],
niece:[
 '<b>OED</b>「niece, n.」：經古法語 <b>niece</b>，源自晚期拉丁文 <b>neptia</b>，原義同樣涵蓋孫女、姪女、外甥女。',
 '<b>Cambridge Dictionary</b>「niece」：今天只剩「兄弟姊妹的女兒」一種。'],
husband:[
 '<b>OED</b>「husband, n.」：古英文 <b>hūsbonda</b>，借自古北歐文 <b>húsbóndi</b> ＝ <b>hús</b>（house，房子）＋ <b>bóndi</b>（住在裡面、管這個家的人）。',
 '<b>OED</b>「husbandry, n.」：同一個字根留下的詞，意思是「經營、管理（田產）」。'],
wife:[
 '<b>OED</b>「wife, n.」：古英文 <b>wīf</b>，<b>原義就是「女人」</b>，不限已婚。',
 '旁證：<b>midwife</b>（助產士，字面「與女人同在」）、<b>old wives’ tale</b>（老婦人的說法）、<b>fishwife</b>（賣魚婦）都留著「女人」的舊意思。']
};

/* 頁面用的出處（非單字頁） */
const P = {
 'daughter-gh': W.daughter,
 'why': [
  '本頁每一幕的出處，與該單字字卡頁的出處相同（見各字卡的「📖 出處」）。',
  '<b>OED</b>（牛津英語詞典）為主要依據；拉丁文詞義另據 <b>Lewis &amp; Short《A Latin Dictionary》</b>。',
  '<b>Wikipedia「Thorn (letter)」「Gh (digraph)」「Old Norse influence on English」</b>可作為課堂上最快查到的旁證。',
  '<b>Roman Jakobson (1960)《Why “Mama” and “Papa”?》</b>：ma／da 是嬰兒最早發得出來的音。',
  '「Father And Mother, I Love You」<b>查無一手出處</b>，教材只說「它不是 family 的來源」。'],
 'why-more': [
  '<b>OED</b>「tea, n.」：經荷蘭文 thee，源自<b>閩南語（廈門話）的 tê</b>。',
  '<b>OED</b>「ketchup, n.」：源自<b>閩南語 kê-tsiap（鮭汁）</b>，原是魚醬。',
  '<b>OED</b>「hamburger, n.」：源自<b>德國漢堡市（Hamburg）</b>，與 ham（火腿）無關；後被誤切為 ham＋burger，才生出 cheeseburger。',
  '<b>OED</b>「sandwich, n.」：得名自<b>第四代 Sandwich 伯爵 John Montagu（1718–1792）</b>。',
  '<b>OED</b>「breakfast, n.」：<b>break</b>（打破）＋ <b>fast</b>（禁食）。',
  '<b>OED</b>「goodbye, int.」：是 <b>God be with ye</b> 的縮合。'],
 'older-younger': [
  '<b>Cambridge Dictionary</b>「brother」「sister」：定義本身<b>不含年齡</b>——英文這兩個字不分長幼。',
  '<b>Oxford Learner’s Dictionaries</b>「brother」「sister」例句作 <b>my older brother</b>／<b>my younger sister</b>：要分長幼就加 <b>older</b>／<b>younger</b>。',
  '<b>Merriam-Webster</b>「big brother」＝ an older brother；「little brother」＝ a younger brother；「big sister」「little sister」同理。<b>口語常用，完全正確</b>。',
  '<b>Cambridge Dictionary</b> 文法頁「elder or older?」：<b>elder</b> 只能放在名詞前面（elder brother），<b>不可以</b>寫 He is <s>elder</s> than me——要用 <b>older than</b>。elder 偏英式、偏正式。',
  '⚠️ <b>誠實註記</b>：「最常用」指的是<b>辭典與英語教材一致採用</b>的說法（older／younger 用於書面與教學，big／little 用於口語）。要做精確的<b>使用次數排名</b>需要查 COCA／BNC 語料庫，本次製作環境連不上那些網站，<b>沒有做過次數統計</b>，所以教材上沒有寫「第幾名」這種話。'],
 'parts': [
  '<b>grand</b>：<b>OED</b>「grand, adj.」原義是「<b>大的</b>」；親屬稱謂的 <b>grand-</b> 來自<b>法語 grand</b>（grand-père、grand-mère），法語 grand 源自拉丁文 <b>grandis</b>「大的」。課堂旁證：<b>Grand Canyon</b>（大峽谷）、<b>grand piano</b>（大鋼琴）。',
  '<b>hus</b>：<b>OED</b>「husband, n.」古英文 hūsbonda，借自古北歐文 <b>húsbóndi</b> ＝ <b>hús</b>（house 房子）＋ <b>bóndi</b>（住在裡面、管這個家的人）。',
  '<b>-ther／-ter 的家人字尾</b>：<b>OED</b>「mother, n.1」「father, n.」「brother, n.」「daughter, n.」各詞條所列的日耳曼語與印歐語同源詞；<b>Calvert Watkins《The American Heritage Dictionary of Indo-European Roots》</b>詞根 *māter-、*pəter-、*bhrāter-、*dhugəter-：這四個字的 <b>-ter</b> 來自<b>同一個古老的家人字尾</b>。',
  '⚠️ <b>誠實註記（給老師，不必跟學生講）</b>：<b>sister</b> 的 -t- 來源不一樣，是 s 和 r 中間<b>後來插進去的音</b>（Watkins 詞根 *swesor-），只是結果看起來跟其他四個一樣。所以教材上寫的是「<b>五個字尾巴長得一樣</b>」這個<b>看得到的事實</b>，沒有說它們來源全部相同。',
  '<b>德文旁證</b>：<b>Duden</b>「Mutter」「Vater」「Bruder」「Tochter」「Schwester」—— 尾巴同樣都是 <b>-ter</b>。',
  '<b>mo-／fa-</b>：<b>Roman Jakobson (1960)《Why “Mama” and “Papa”?》</b>：<b>ma</b>、<b>pa</b> 是嬰兒最早發得出來的音，全世界的「媽媽」「爸爸」多半由這兩個音來。',
  '<b>bro-／sis- 沒有獨立意思</b>：<b>OED</b> 沒有為 bro-、sis- 列出任何獨立詞義；brother、sister 在英文裡是<b>不可再分的整個字</b>。今天口語的 <b>bro</b>、<b>sis</b> 是<b>後來從整個字剪下來的簡稱</b>（OED「bro, n.」「sis, n.」），<b>不是原本的零件</b>。',
  '<b>parent ＋ s</b>：這是<b>文法</b>（複數加 s），不是字源。<b>Cambridge Dictionary</b>「parent」。'],
 'quiz': [
  '本卷 20 題全部出自 17 張家人單字卡與故事頁的內容，出處與各字卡相同。',
  '<b>OED</b>（牛津英語詞典）各詞條為主要依據；拉丁文詞義另據 <b>Lewis &amp; Short《A Latin Dictionary》</b>。',
  '<b>Wikipedia「Thorn (letter)」「Gh (digraph)」「Old Norse influence on English」</b>：þ、gh、維京人混居三題的旁證。',
  '<b>Duden「Tochter」／Van Dale「dochter」／Dictionaries of the Scots Language「dochter」「nicht」</b>：gh 舊讀音仍存的證據。',
  '<b>Roman Jakobson (1960)《Why “Mama” and “Papa”?》</b>：ma／da 兩題的依據。',
  '「Father And Mother, I Love You」<b>查無一手出處</b>（backronym），這是第 2 題的依據。']
};

/* ---- 給樣板用的三段（CSS／HTML／JS），三個產生器共用 ---- */

/* display:none ＝ 完全不佔版面，_verify.js 量到的溢出不受影響 */
const CSS = `
/* 放大字級之後條目會超過一個螢幕，所以**不可以再用 flex 置中**——
   flex 置中一旦內容超出高度，上面那幾條會被切掉而且捲不回去。
   改成 display:block ＋ overflow:auto，從最上面開始，捲得到每一條。 */
#src{position:fixed;inset:0;z-index:20;background:rgba(0,0,0,.95);
 display:none;padding:clamp(16px,4vh,40px);overflow:auto;text-align:left}
#src.on{display:block}
#src h4{max-width:900px;margin:0 auto 16px;color:#9FB4C8;font-size:clamp(19px,2.6vh,26px);letter-spacing:.24em;font-weight:700}
/* 字級：使用者 2026-09-20 指定放大到「最後一排學生看得清楚」。#src 平常 display:none，
   完全不佔版面，所以放大不會影響任何一頁的溢出量測。 */
#src p{margin:0 auto 13px;max-width:900px;color:#C2C2C2;line-height:1.7;
 font-size:clamp(17px,2.35vh,23px)}
#src p b{color:#F2F2F2;font-weight:700}
#src button{display:block;margin:22px auto 0;background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;
 border-radius:99px;font-size:19px;padding:13px 28px;min-height:52px;font-family:inherit;cursor:pointer}`;

/* 音標、音節、發音是每一頁都會用到的，所以獨立成一份，自動附在每一頁的出處最後面。
   （使用者 2026-09-20 指定加上音標與發音功能，出處同樣要 100% 查得到。） */
const COMMON = [
 '<b>音標（美式）</b>：<b>Cambridge Dictionary</b> 各詞條的 <b>US</b> 發音、<b>Oxford Learner’s Dictionaries</b> 的 <b>NAmE</b> 發音。',
 '<b>KK 音標</b>：<b>Kenyon &amp; Knott《A Pronouncing Dictionary of American English》(1944)</b> —— 台灣中小學課本採用的標法。同一個音兩套寫法不同（例：bed 的 e ＝ IPA <b>/e/</b>、KK <b>/ɛ/</b>；boat 的 o ＝ IPA <b>/oʊ/</b>、KK <b>/o/</b>）。',
 '<b>音節切分</b>：<b>Merriam-Webster</b> 各詞條的分音節（fam·i·ly、daugh·ter、un·cle、lit·tle）。',
 '<b>「一個母音 ＝ 一個音節」</b>：<b>Louisa Moats《Speech to Print》</b>、<b>National Reading Panel (2000)</b> 的音節教學原則。⚠️ <b>誠實註記</b>：數的是<b>還在出聲的母音</b>——畫面上<b>淺灰色的字母不出聲，不算</b>（niece 的 e、wife 的 e、daughter 的 gh、little 的第二個 t），au／ou／ie／ew 兩個字母一起發一個音，畫面上本來就是一格。照畫面數，這條規則對這些單字<b>全部成立</b>。',
 '<b>唸出來的聲音</b>：瀏覽器內建的語音合成（<b>Web Speech API</b>），語系設 <b>en-US</b>。實際嗓音由老師那台電腦或平板決定，不需要連網也不需要帳號。'
];

const html = (lines) =>
 '<footer id="src"><h4>出處</h4>' +
 lines.concat(COMMON).map(t => '<p>' + t + '</p>').join('') +
 '<button id="srcx">關閉</button></footer>';

const btn = '<button id="srcb">📖 出處</button>';

const JS = `
(function(){var s=document.getElementById("src");
 function t(v){s.classList.toggle("on",v)}
 document.getElementById("srcb").addEventListener("click",function(){t(!s.classList.contains("on"))});
 document.getElementById("srcx").addEventListener("click",function(){t(false)});
 document.addEventListener("keydown",function(e){if(e.key==="Escape")t(false)});})();`;

module.exports = { W, P, COMMON, CSS, html, btn, JS };
