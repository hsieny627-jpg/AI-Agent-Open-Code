/* G3 - L1 + L2/_build_words.js — 三年級：🔢 數字單字 ＋ 👀 Sight Words 常見字（使用者 2026-09-25 指定）
 *
 *   node "G3 - L1 + L2/_build_words.js"
 *
 * 100% 照家人單字的學習架構（words/_section.js）：
 *   單字卡（三幕）＋ 單字結構 ＋ 故事 ＋ 環遊世界 ＋ 出處（每一張、每一幕都直接跳到證據）
 *   numbers/ ：zero～twelve（13 張）
 *   sight/   ：I, My, You, Your, I am, You are, name, is, What, What is ＝ What’s, How, old, How old, year, years old（15 張）
 *
 * 字母的顏色（使用者指定，資料在 words/_phonics.js 的 RAW）：
 *   母音紅色；不發音淺灰：one 的 e、three 字尾 e、four 的 u、five 的 e、eight 的 gh、nine 的 e、twelve 字尾 e；
 *   You 的 o、Your 的 o、are 的 e、name 的 e、What 的 h、year 的 a。兩個音節的字用「．」切開（按 ✂️ 音節看動畫）。
 * 事實判準跟家人單字一樣：只放查得到的；學者沒有定論的，畫面上不寫。
 */
const fs = require('fs'), path = require('path');
const { build } = require('../words/_section');
const { e, warn, ev, I } = require('../words/_sources');
const WD = require('../words/_world');

const SV = fs.existsSync(path.join(__dirname, '..', 'words', 'audio', 'sv', 'aud.js'))
  ? '<script src="../../words/audio/sv/aud.js"></script><script>window.SVDIR="../../words/audio/sv/"</script>' : '';
const tw = (w, zh) => '<span class="tw"><span class="sp" data-say="' + w + '">' + w + '</span><em>' + zh + '</em></span>';
const sp = (w, lang) => '<span class="sp" data-say="' + w + '"' + (lang ? ' data-lang="' + lang + '"' : '') + '>' + w + '</span>';
const table = (cap, cls, head, rows, langs) => '<table class="st ' + cls + '"><caption>' + cap + '</caption><tr>' +
  head.map(h => '<th>' + h + '</th>').join('') + '</tr>' +
  rows.map(r => '<tr>' + r.map((x, k) => '<td>' + sp(x, langs[k]) + '</td>').join('') + '</tr>').join('') + '</table>';

/* ══════════════ 🔢 數字單字 ══════════════ */
const NUM = [
 {f:'zero',zh:'零',icon:'0️⃣',old:'ṣifr',now:'zero',src:[0,0,1],
  e1:'🈳 最早的意思是「<b>空的</b>」',e2:'從印度、阿拉伯，一路傳到英國'},
 {f:'one',zh:'一',icon:'1️⃣',old:'ān',now:'one',src:[0,0,1],
  e1:'{{a}}、{{an}}（一個）都是從 <b>one</b> 變來的',e2:'{{only}} ＝ one ＋ ly'},
 {f:'two',zh:'二',icon:'2️⃣',old:'twā',now:'two',src:[0,0,1],
  e1:'👯 {{twin}} 雙胞胎、{{twice}} 兩次',e2:'<b>tw</b> 開頭的字，常常跟「<b>二</b>」有關'},
 {f:'three',zh:'三',icon:'3️⃣',old:'þrēo',now:'three',src:[0,0,0],
  e1:'{{third}} 第三、{{thirteen}} 十三',e2:'都是 <b>three</b> 的家人'},
 {f:'four',zh:'四',icon:'4️⃣',old:'fēower',now:'four',src:[0,0,1],
  e1:'{{fourteen}} 十四',e2:'{{forty}} 四十 <b>沒有 u</b>！'},
 {f:'five',zh:'五',icon:'5️⃣',old:'fīf',now:'five',src:[0,0,1],
  e1:'{{fifteen}} 十五、{{fifty}} 五十',e2:'<b>v</b> 變回 <b>f</b>'},
 {f:'six',zh:'六',icon:'6️⃣',old:'siex',now:'six',src:[0,0,0],
  e1:'{{sixteen}} 十六、{{sixty}} 六十',e2:'法文的「六」<b>也寫 six</b>'},
 {f:'seven',zh:'七',icon:'7️⃣',old:'seofon',now:'seven',src:[0,0,1],
  e1:'📅 {{September}} 以前是<b>第 7 個月</b>',e2:'兩個音節：<b>se．ven</b>'},
 {f:'eight',zh:'八',icon:'8️⃣',old:'eahta',now:'eight',src:[0,0,1],
  e1:'🤫 <b>gh</b> 不唸',e2:'🐙 {{octopus}} 有 8 隻腳、{{October}} 以前是第 8 個月'},
 {f:'nine',zh:'九',icon:'9️⃣',old:'nigon',now:'nine',src:[0,0,1],
  e1:'🤫 字尾 <b>e</b> 不唸',e2:'📅 {{November}} 以前是<b>第 9 個月</b>'},
 {f:'ten',zh:'十',icon:'🔟',old:'tīen',now:'ten',src:[0,0,1],
  e1:'📅 {{December}} 以前是<b>第 10 個月</b>',e2:'<b>-teen</b> 就是 ten：thirteen ＝ 3 ＋ 10'},
 {f:'eleven',zh:'十一',icon:'1️⃣1️⃣',old:'endleofan',now:'eleven',src:[0,0,0],
  parts:{href:'numbers-parts.html#2'},
  e1:'🖐🖐☝️ 數完十，<b>還剩一</b>',e2:'三個音節：<b>e．le．ven</b>'},
 {f:'twelve',zh:'十二',icon:'1️⃣2️⃣',old:'twelf',now:'twelve',src:[0,0,0],
  parts:{href:'numbers-parts.html#2'},
  e1:'🖐🖐✌️ 數完十，<b>還剩二</b>',e2:'🤫 字尾 <b>e</b> 不唸'}
];
const NUMW = {
 zero:[e('zero 的旅行','OED「zero, n.」；Wikipedia「0」「Fibonacci」',
   '阿拉伯文 <b>ṣifr</b>（空的）➜ 義大利文 <b>zefiro／zero</b> ➜ 英文 zero。1202 年義大利人 <b>Fibonacci</b> 把它寫進書裡，歐洲人才開始用。'),
  e('「零」這個想法從哪裡來','Wikipedia「0」；Ifrah《The Universal History of Numbers》(2000)',
   '把 0 當成一個數字來算，最早在<b>印度</b>（梵文 <b>śūnya</b> ＝ 空的），再傳到<b>阿拉伯</b>。')],
 one:[e('one 的來源','OED「one, adj.」','古英文 <b>ān</b>。'),
  e('a、an、only 都是 one 的家人','OED「a, adj.」「an, adj.」「only, adj.」',
   '<b>a／an</b> 是 ān 變短的；<b>only</b> 是古英文 <b>ānlic</b>（one ＋ -ly）。')],
 two:[e('two 的來源','OED「two, adj.」','古英文 <b>twā</b>，那時候 <b>w 有唸出來</b>；後來 w 不唸了，字母留著。'),
  e('tw- 的家人','OED「twin, n.」「twice, adv.」「between, prep.」','<b>twin</b>、<b>twice</b>、<b>between</b> 都跟「二」有關，w 還在唸。')],
 three:[e('three 的家人','OED「three」「third」「thirteen」「thirty」','古英文 <b>þrēo</b>；third、thirteen、thirty 都是它的家人。')],
 four:[e('four 的來源','OED「four, adj.」','古英文 <b>fēower</b>。'),
  e('forty 沒有 u','Cambridge Dictionary「forty」','四十拼成 <b>forty</b>，<b>不是 fourty</b>（fourteen 有 u）。')],
 five:[e('five 的來源','OED「five, adj.」','古英文 <b>fīf</b>。'),
  e('fifteen、fifty','OED「fifteen」「fifty」','f 開頭、中間也是 <b>f</b>：古英文 fīftēne、fīftig。')],
 six:[e('six 的家人','OED「six, adj.」；Larousse「six」','古英文 <b>siex</b>；法文的六<b>也拼成 six</b>。')],
 seven:[e('seven 的來源','OED「seven, adj.」','古英文 <b>seofon</b>。'),
  e('September 是第 7 個月？','OED「September, n.」；Wikipedia「Roman calendar」',
   '羅馬人最早的曆法<b>從三月開始算</b>，所以 September（拉丁文 septem ＝ 7）是<b>第 7 個月</b>。')],
 eight:[e('eight 的來源','OED「eight, adj.」；Duden「acht」','古英文 <b>eahta</b>，<b>h 那個音以前有唸</b>（就像德文 acht 的 ch）；後來不唸了，gh 留著。'),
  e('octopus、October','OED「octopus, n.」「October, n.」','希臘文 <b>oktō</b>、拉丁文 <b>octo</b> ＝ 8：octopus 八隻腳；October 以前是第 8 個月。')],
 nine:[e('nine 的來源','OED「nine, adj.」','古英文 <b>nigon</b>。'),
  e('November','OED「November, n.」','拉丁文 <b>novem</b> ＝ 9，以前是<b>第 9 個月</b>。')],
 ten:[e('ten 的來源','OED「ten, adj.」','古英文 <b>tīen／tēn</b>。'),
  e('December、-teen','OED「December, n.」「-teen, suffix」','拉丁文 <b>decem</b> ＝ 10；thirteen～nineteen 的 <b>-teen</b> 就是 ten。')],
 eleven:[e('eleven ＝ 剩下一','OED「eleven, adj.」；Kroonen《Etymological Dictionary of Proto-Germanic》(2013)「*ainalif」',
   '古英文 <b>endleofan</b>，最早是 <b>*ain-lif</b> ＝ <b>one ＋ 剩下</b>：數完十根手指，<b>還剩一</b>。')],
 twelve:[e('twelve ＝ 剩下二','OED「twelve, adj.」；Kroonen (2013)「*twalif」',
   '古英文 <b>twelf</b>，最早是 <b>*twa-lif</b> ＝ <b>two ＋ 剩下</b>：數完十，<b>還剩二</b>。')]
};
const NUMPARTS = [
 I('cant', e('one～ten 拆不開', 'OED 各詞條',
   'one 到 ten 在英文裡<b>拆不出零件</b>，整個背起來。')),
 I('lif', ev('eleven、twelve：數完十，還剩下幾個', 'OED「eleven」「twelve」；Kroonen (2013)「*ainalif」「*twalif」；Watkins 詞根 leikw-（留下）',
   '<b>lif</b> ＝「<b>剩下</b>」：數完十，<b>還剩一個、還剩兩個</b>。',
   '<div class="ev"><span class="st" style="animation-delay:.2s"><b><span class="new">e</span>leven</b><em>one ＋ 剩下</em></span>' +
   '<span class="st" style="animation-delay:.6s"><b><span class="new">tw</span>elve</b><em>two ＋ 剩下</em></span>' +
   '<span class="st" style="animation-delay:1s"><b>🖐🖐 ＋ ☝️</b><em>十 ＋ 一</em></span></div>')),
 I('fam', e('one、two 的家人', 'OED「only」「alone」「twin」「twice」「between」',
   '<b>only</b>、<b>alone</b> 裡面有 one；<b>twin</b>、<b>twice</b>、<b>between</b> 裡面有 tw（二）。')),
 I('teen', e('十三以後：-teen、-ty', 'OED「-teen, suffix」「-ty, suffix2」',
   '<b>-teen</b> ＝ ten（十幾），<b>-ty</b> ＝ 幾十：thirteen 13、thirty 30。')),
 I('de', e('德文數字', 'Duden「eins」「zwei」「drei」「vier」「fünf」', 'eins zwei drei vier fünf。')),
 I('sv', e('瑞典文數字', 'SAOL「en」「två」「tre」「fyra」「fem」', 'en två tre fyra fem。')),
 warn('瑞典文的聲音', '瑞典文用的是<b>預先做好的語音檔</b>：瑞典國家圖書館（KBLab）用<b>瑞典母語者的錄音</b>（NST 語料，CC0）訓練的神經語音 Piper sv_SE-nst。')
];
const NUMWHY = [
 I('zero', NUMW.zero[0]), I('months', NUMW.seven[1]), I('eight', NUMW.eight[0]), I('two', NUMW.two[0]), I('lif', NUMW.eleven[0])
];
const NUMWORLD = [
 ...require('../words/_sources').P.world.filter(r => r.id === 'map' || r.id === 'why5'),
 I('w-one', e('one 家族', 'Duden「eins」；Van Dale「een」；SAOL「en」；Larousse「un」；RAE「uno」', '德 eins、荷 een、瑞典 en、法 un、西 uno。')),
 I('w-two', e('two 家族', 'Duden「zwei」；Van Dale「twee」；SAOL「två」；Larousse「deux」；RAE「dos」', '荷蘭文 <b>twee</b> 跟 two 最像，還留著 w。')),
 I('w-three', e('three 家族', 'Duden「drei」；Van Dale「drie」；SAOL「tre」；Larousse「trois」；RAE「tres」', '五國都長得很像。')),
 I('w-eight', e('eight 家族', 'Duden「acht」；Van Dale「acht」；SAOL「åtta」；Larousse「huit」；RAE「ocho」', '德、荷 <b>acht</b>：ch 還在唸，就是英文 gh 以前的聲音。')),
 I('w-eleven', e('eleven、twelve 家族', 'Duden「elf」「zwölf」；Van Dale「elf」「twaalf」；SAOL「elva」「tolv」；Larousse「onze」「douze」；RAE「once」「doce」',
   '日耳曼家族（德、荷、瑞典）都是「<b>剩下一、剩下二</b>」；法、西是「一 ＋ 十、二 ＋ 十」。')),
 I('w-zero', e('zero 家族', 'Duden「Null」；Van Dale「nul」；SAOL「noll」；Larousse「zéro」；RAE「cero」', '法、西 <b>zéro、cero</b> 跟英文一樣從阿拉伯文 ṣifr 來。')),
 warn('瑞典文的聲音', '瑞典文用的是<b>預先做好的語音檔</b>（Piper sv_SE-nst，瑞典母語者錄音 NST 訓練，CC0）。')
];
/* 2026-09-26 使用者指定改版（第 12～17、21、23、24 點）：內容全部在 _num_pages.js */
const NP = require('./_num_pages');
const NUMPAGES = [
{file:'numbers-parts.html',title:'數字拆開來看',sayAll:1,big:1,css:NP.CSS,srcRows:NP.PARTS,
 fwd:{href:'numbers-world.html',label:'🌍 環遊世界 →'}, S:NP.numP},
{file:'numbers-why.html',title:'數字的故事',big:1,css:NP.CSS,srcRows:NP.WHYR, S:NP.numW},
...NP.worldPages.map(p => Object.assign({ css: NP.CSS }, p))
];

/* ══════════════ 👀 Sight Words 常見字 ══════════════ */
const SIGHT = [
 {f:'i',zh:'我',icon:'🙋',old:'ic',now:'I',src:[0,0,1],
  e1:'✍️ <b>I</b> 永遠大寫',e2:'一個小小的 i 太容易看漏，<b>寫大一點</b>'},
 {f:'my',zh:'我的',icon:'🙋🎒',old:'mīn',now:'My',src:[0,0,1],
  e1:'{{my}} 是 {{mine}} 變短的',e2:'my ＋ 東西：my name、my bag'},
 {f:'you',zh:'你',icon:'👉',old:'ēow',now:'You',src:[0,0,1],
  e1:'🤫 <b>o</b> 不唸',e2:'以前的 you 是「<b>你們</b>」'},
 {f:'your',zh:'你的',icon:'👉🎒',old:'ēower',now:'Your',src:[0,0,1],
  parts:{href:'sight-parts.html#1'},
  e1:'{{you}} ＋ <b>r</b> ＝ 你的',e2:'your name ＝ 你的名字'},
 {f:'i-am',zh:'我 是',zhp:[['我','🙋'],['是','＝']],icon:'🙋＝',old:'ic eom',now:'I am',src:[0,0,1],
  parts:{href:'sight-parts.html#3'},
  e1:'I am ＝ <b>I<b class="rs">’</b>m</b>',e2:'紅色的 <b class="rs">’</b> ＝ 藏起來的 a'},
 {f:'you-are',zh:'你 是',zhp:[['你','👉'],['是','＝']],icon:'👉＝',now:'You are',src:[0,0,1],
  build:{a:'You',b:'are',note:'<b>You</b> 你 ＋ <b>are</b> 是 ＝ 你是'},
  parts:{href:'sight-parts.html#3'},
  e1:'You are ＝ <b>You<b class="rs">’</b>re</b>',e2:'🤫 are 的 <b>e</b> 不唸'},
 {f:'name',zh:'名字',icon:'📛',old:'nama',now:'name',src:[0,0,1],
  e1:'🤫 字尾 <b>e</b> 不唸',e2:'以前 e 有唸，後來不唸了，<b>字母留著</b>'},
 {f:'is',zh:'是',icon:'＝',old:'is',now:'is',src:[0,0,0],
  e1:'一千多年，<b>拼法都沒有變</b>',e2:'荷蘭文的「是」<b>也寫 is</b>'},
 {f:'what',zh:'什麼',icon:'❓',old:'hwæt',now:'What',src:[0,0,1],
  e1:'以前寫成 <b>hw</b>：h 在前面',e2:'🤫 今天 <b>h</b> 不唸'},
 {f:'whats',zh:'什麼 是',zhp:[['什麼','❓'],['是','＝']],icon:'❓＝',now:'What’s',src:[0,0,0],
  build:{a:'What',b:'is',note:'<b>What is</b> ＝ <b>What<b class="rs">’</b>s</b>　紅色的 <b class="rs">’</b> ＝ 藏起來的 i'},
  parts:{href:'sight-parts.html#3'},
  e1:'What’s your name?',e2:'你的名字是什麼？'},
 {f:'how',zh:'怎麼樣',icon:'🤔',old:'hū',now:'How',src:[0,0,1],
  e1:'問「<b>程度</b>」、問「<b>方式</b>」',e2:'How old? ＝ 多老 ＝ <b>幾歲</b>'},
 {f:'old',zh:'老的；…歲',icon:'👴',old:'ald',now:'old',src:[0,0,0],
  e1:'ten years <b>old</b> ＝ 十歲',e2:'{{older}} 年紀比較大'},
 {f:'how-old',zh:'幾歲',icon:'🎂',now:'How old',src:[0,0,0],
  build:{a:'How',b:'old',note:'<b>How</b> 多 ＋ <b>old</b> 老 ＝ <b>幾歲</b>'},
  parts:{href:'sight-parts.html#4'},
  e1:'How old are you?',e2:'你幾歲？'},
 {f:'year',zh:'年',icon:'📅',old:'gēar',now:'year',src:[0,0,1],
  e1:'🤫 <b>a</b> 不唸',e2:'以前寫成 <b>g</b> 開頭，g 唸成 y'},
 {f:'years-old',zh:'…歲',icon:'🎂',now:'years old',src:[0,0,0],
  build:{a:'years',b:'old',note:'<b>ten years old</b> ＝ 十「年」那麼「老」＝ <b>十歲</b>'},
  parts:{href:'sight-parts.html#5'},
  e1:'I’m ten years old. ＝ I’m ten.',e2:'<b>years old</b> 可以省略'}
,
 /* 2026-09-26 使用者指定新增【進階】：Who, Where, When, Why */
 {f:'who',zh:'誰',icon:'👤❓',old:'hwā',now:'Who',src:[0,0,1],adv:1,
  e1:'🤫 <b>W</b> 不唸：唸 /huː/',e2:'以前寫成 <b>hwā</b>：h 在前面'},
 {f:'where',zh:'哪裡',icon:'📍❓',old:'hwǣr',now:'Where',src:[0,0,1],adv:1,
  e1:'🤫 <b>h</b>、字尾 <b>e</b> 不唸',e2:'{{here}} 這裡、{{there}} 那裡、{{where}} 哪裡'},
 {f:'when',zh:'什麼時候',icon:'⏰❓',old:'hwanne',now:'When',src:[0,0,1],adv:1,
  e1:'🤫 <b>h</b> 不唸',e2:'{{then}} 那時候 ↔ {{when}} 什麼時候'},
 {f:'why',zh:'為什麼',icon:'🤔❓',old:'hwȳ',now:'Why',src:[0,0,1],adv:1,
  e1:'🤫 <b>h</b> 不唸',e2:'Why? ➜ <b>Because</b>……（因為）'}
];
const SIGHTW = {
 i:[e('I 為什麼永遠大寫','OED「I, pron.」；Merriam-Webster「Why Is ‘I’ Capitalized?」',
   '古英文 <b>ic</b> 慢慢變成一個字母 <b>i</b>；小小的一筆<b>太容易看漏</b>，大約 700 年前，抄書的人開始把它寫成大寫。'),
  e('今天的用法','Cambridge Dictionary「I」','說「我」的時候用 <b>I</b>，放在句子哪裡都大寫。')],
 my:[e('my 的來源','OED「my, adj.」「mine, pron.」','古英文 <b>mīn</b>；放在名詞前面的時候變短，就是 <b>my</b>。'),
  e('my ＋ 東西','Cambridge Dictionary「my」','my name、my bag：<b>我的</b>。')],
 you:[e('you 的來源','OED「you, pron.」','古英文 <b>ēow</b>，最早是「<b>你們</b>」；一個人的「你」以前是 <b>thou</b>。'),
  e('o 不唸','Cambridge Dictionary「you」','you 唸 <b>/juː/</b>，o 不發音（淺灰色）。')],
 your:[e('your 的來源','OED「your, adj.」','古英文 <b>ēower</b>（你們的）。'),
  e('your 和 you’re','Cambridge Dictionary「your」「you’re」','<b>your</b> ＝ 你的；<b>you’re</b> ＝ you are ＝ 你是。唸起來很像，意思不一樣。')],
 'i-am':[e('am 的來源','OED「be, v.」','古英文 <b>eom</b>（我是）。'),
  e('I’m','Cambridge Dictionary「I’m」','I am 說快一點 ＝ <b>I’m</b>，紅色的 ’ ＝ 藏起來的 a。')],
 'you-are':[e('are','OED「be, v.」','are 是「是」在 you、we、they 後面的樣子。'),
  e('You’re','Cambridge Dictionary「you’re」','You are ＝ <b>You’re</b>。')],
 name:[e('name 的來源','OED「name, n.」','古英文 <b>nama</b>，有兩個音節（na-ma）。'),
  e('字尾 e 不唸了','Wikipedia「Silent e」「Great Vowel Shift」','大約 600 年前，字尾的 e <b>慢慢不唸了</b>，字母留下來；a 也從 /aː/ 變成今天的 /eɪ/。')],
 is:[e('is 一千多年沒變','OED「is」（be, v. 的形）；Van Dale「is」','古英文就寫成 <b>is</b>；荷蘭文的「是」到今天也寫 <b>is</b>。')],
 what:[e('what 的來源','OED「what, pron.」','古英文 <b>hwæt</b>：<b>h 寫在 w 前面</b>，也有唸出來。'),
  e('h 不唸了','Wikipedia「Pronunciation of English ⟨wh⟩」；Cambridge Dictionary「what」','後來抄書的人把 hw 改寫成 <b>wh</b>；今天大部分的人不唸 h，唸 <b>/wɑt/</b>。')],
 whats:[e('What’s ＝ What is','Cambridge Dictionary「what’s」','What is 說快一點 ＝ <b>What’s</b>。')],
 how:[e('how 的來源','OED「how, adv.」','古英文 <b>hū</b>。'),
  e('How 問什麼','Cambridge Dictionary「how」','問<b>方式</b>（怎麼做）、問<b>程度</b>（多…）：How old ＝ 多老 ＝ 幾歲。')],
 old:[e('old 的來源','OED「old, adj.」','古英文 <b>ald／eald</b>；older、elder 都是它的家人。')],
 'how-old':[e('How old','Cambridge Dictionary「old」','How old are you? ＝ 你幾歲？')],
 year:[e('year 的來源','OED「year, n.」','古英文 <b>gēar</b>：那時候 <b>g 唸成 y</b>（跟德文 Jahr 的 J 一樣）。'),
  e('a 不唸','Cambridge Dictionary「year」','year 唸 <b>/jɪr/</b>，a 不發音（淺灰色）。')],
 'years-old':[e('years old','Cambridge Dictionary「old」「year」','I’m ten years old. ＝ I’m ten.：<b>years old 可以省略</b>。')]
};
/* 進階 Who, Where, When, Why 的出處（2026-09-26） */
Object.assign(SIGHTW, {
 who:[e('who 的來源','OED「who, pron.」','古英文 <b>hwā</b>：h 寫在 w 前面。'),e('W 不唸','Cambridge Dictionary「who」','who 唸 <b>/huː/</b>，W 不發音（淺灰色）。')],
 where:[e('where 的來源','OED「where, adv.」','古英文 <b>hwǣr</b>。'),e('here、there、where','OED「here」「there」「where」','三個字都是 -ere 結尾：這裡、那裡、哪裡。')],
 when:[e('when 的來源','OED「when, adv.」','古英文 <b>hwanne／hwænne</b>。'),e('then、when','OED「then」「when」','then 那時候、when 什麼時候。')],
 why:[e('why 的來源','OED「why, adv.」','古英文 <b>hwȳ／hwī</b>。'),e('Why? Because…','Cambridge Dictionary「why」「because」','問「為什麼」用 Why，回答用 Because。')]
});
const SIGHTPARTS = [
 I('r', e('you ＋ r ＝ your', 'Cambridge Dictionary「your」', '拼法上：<b>you</b> 多一個 <b>r</b> ＝ <b>your</b>（你的）。這是看拼字的記法。')),
 I('my', e('my ← mine', 'OED「my」「mine」', '<b>my</b> 是 <b>mine</b> 變短的。')),
 I('ap', e('’ ＝ 藏起來的字母', 'Cambridge Dictionary「apostrophe」', 'I’m（a 藏起來）、You’re（a 藏起來）、What’s（i 藏起來）。')),
 I('howold', e('How ＋ old', 'Cambridge Dictionary「how」「old」', 'How old ＝ <b>多老</b> ＝ 幾歲。')),
 I('s', e('year ＋ s', 'Cambridge Dictionary「year」', '一年 <b>a year</b>，兩年以上加 <b>s</b>：ten years。')),
 I('de', e('德文', 'Duden「ich」「mein」「du」「Name」「ist」「was」', 'ich、mein、du、Name、ist、was。')),
 I('nl', e('荷蘭文', 'Van Dale「ik」「mijn」「jij」「naam」「is」「wat」', 'ik、mijn、jij、naam、is、wat。'))
];
const SIGHTWHY = [ I('i', SIGHTW.i[0]), I('you', SIGHTW.you[0]), I('name', SIGHTW.name[1]), I('what', SIGHTW.what[1]), I('year', SIGHTW.year[0]) ];
const SIGHTWORLD = [
 ...require('../words/_sources').P.world.filter(r => r.id === 'map' || r.id === 'why5'),
 I('w-i', e('I 家族', 'Duden「ich」；Van Dale「ik」；SAOL「jag」；Larousse「je」；RAE「yo」', '德 ich、荷 ik、瑞典 jag、法 je、西 yo。')),
 I('w-my', e('my 家族', 'Duden「mein」；Van Dale「mijn」；SAOL「min」；Larousse「mon」；RAE「mi」', '五國都用 <b>m</b> 開頭。')),
 I('w-name', e('name 家族', 'Duden「Name」；Van Dale「naam」；SAOL「namn」；Larousse「nom」；RAE「nombre」', '五國都像：<b>n ＋ m</b>。')),
 I('w-is', e('is 家族', 'Duden「ist」；Van Dale「is」；SAOL「är」；Larousse「est」；RAE「es」', '荷蘭文<b>一模一樣</b>：is。')),
 I('w-what', e('what 家族', 'Duden「was」；Van Dale「wat」；SAOL「vad」；Larousse「que／quoi」；RAE「qué」', '德 was、荷 wat、瑞典 vad：w／v 開頭。')),
 I('w-name-s', e('My name is Ken.', 'Van Dale「naam」；Duden「heißen」；SAOL「heta」；Larousse「s’appeler」；RAE「llamarse」',
   '荷蘭文 <b>Mijn naam is Ken.</b> 幾乎一模一樣；法、西說「我叫自己 Ken」。')),
 I('w-age', e('I’m ten years old.', 'Duden「alt」；Van Dale「oud」；SAOL「gammal」；Larousse「avoir … ans」；RAE「tener … años」',
   '德 Ich bin zehn Jahre alt.（跟英文一樣「十年老」）；法 J’ai dix ans.、西 Tengo diez años.（<b>我有十年</b>）。')),
 warn('瑞典文的聲音', '瑞典文用的是<b>預先做好的語音檔</b>（Piper sv_SE-nst，瑞典母語者錄音 NST 訓練，CC0）。')
];
const SP = require('./_sight_pages'), NPG = require('./_num_pages');
const SIGHTPAGES = [
{file:'sight-parts.html',title:'常見字拆開來看',sayAll:1,srcRows:SIGHTPARTS,
 fwd:{href:'sight-world.html',label:'🌍 環遊世界 →'},
 S:[
 {emoji:'👀',mid:'常見字，拆得開嗎？',lines:['有的<b>多一個字母</b>，有的<b>藏起一個字母</b>']},
 {tag:'you ＋ r ＝ 你的',src:'r',
  h:'<div class="tl4 fo" style="grid-template-columns:repeat(2,auto)">' + tw('you', '你') +
    '<span class="tw"><span class="sp" data-say="your">you<span class="hi2">r</span></span><em>你的</em></span></div>',
  lines:['多一個 <b>r</b> ＝ <b>的</b>']},
 {tag:'mine 變短 ＝ my',src:'my',
  h:'<div class="tl4 fo" style="grid-template-columns:repeat(2,auto)">' + tw('mine', '我的') + tw('my', '我的') + '</div>',
  lines:['<b>my</b> ＝ <b>mine</b> 變短']},
 {tag:'’ ＝ 藏起來的字母',src:'ap',
  h:'<div class="en in d1" style="font-size:clamp(22px,4vh,40px);line-height:1.6">I <span class="rs">a</span>m ➜ I’m<br>You <span class="rs">a</span>re ➜ You’re<br>What <span class="rs">i</span>s ➜ What’s</div>',
  lines:['紅色的字母，被 <b class="rs">’</b> 藏起來']},
 {tag:'How ＋ old ＝ 幾歲',src:'howold',
  h:'<div class="en in d1"><span class="fromL">{{How}}</span> <span class="ar">＋</span> <span class="fromR">{{old}}</span></div>' +
    '<div class="mean pop" style="font-size:clamp(24px,4.4vh,44px)">多 ＋ 老 ＝ 幾歲</div>',
  lines:['How old ＝ <b>多老</b> ＝ 幾歲']},
 {tag:'year ＋ s',src:'s',
  h:'<div class="tl4 fo" style="grid-template-columns:repeat(2,auto)">' + tw('year', '一年') +
    '<span class="tw"><span class="sp" data-say="years">year<b class="rs">s</b></span><em>兩年以上</em></span></div>',
  lines:['兩年以上，<b>加 <b class="rs">s</b></b>']},
 Object.assign(WD.guessOne({c:'nl',w:[['ik','ik','我','I'],['mijn','mijn','我的','my'],['naam','naam','名字','name'],['is','is','是','is'],['wat','wat','什麼','what']],
   tag:'🕵️ 這是哪一國的【常見字】？',lines:['<b>先聽、先猜</b>：這是哪一國的【常見字】？']}),{src:'nl'}),
 Object.assign(WD.guessOne({c:'de',w:[['ich','ich','我','I'],['mein','mein','我的','my'],['Name','Name','名字','name'],['ist','ist','是','is'],['was','was','什麼','what']],
   tag:'🕵️ 這又是哪一國的【常見字】？',lines:['再猜一次：<b>這又是哪一國的【常見字】？</b>']}),{src:'de'}),
 {tag:'記住這件事',sayAll:1,
  h:'<div class="sumt fo">' + table('🧩 多一個、藏一個', 'g', ['單字', '怎麼變'],
     [['your', 'you ＋ r'], ['years', 'year ＋ s'], ['I’m', 'I am'], ['What’s', 'What is']], ['', '']) + '</div>' +
    '<a class="golink pop" href="sight-world.html">🌍 下一頁：常見字環遊世界 ➜</a>',
  lines:['看得懂零件，<b>拼字就不會錯</b>']}
]},

/* 2026-09-26 使用者指定改版（第 19、20、23、24 點）：內容在 _sight_pages.js */
{file:'sight-why.html',title:'常見字的故事',big:1,css:NPG.CSS,srcRows:SP.WHYR,S:SP.whyS},
{file:'sight-world.html',title:'常見字環遊世界',sayAll:1,big:1,css:NPG.CSS,srcRows:SP.SRCW,
 back:{href:'sight-parts.html',label:'← 字的結構'}, S:SP.worldS}
];

const out = [];
out.push.apply(out, build({
  dir: path.join(__dirname, 'numbers'), font: '../../words/fonts/', home: '../index.html', suffix: '數字單字',
  words: NUM, srcW: NUMW, pages: NUMPAGES, head: SV, svjs: SV,
  index: { file: 'index.html', title: '🔢 數字單字', sub: 'zero　one　two …… eleven　twelve',
    links: [
      { ic: '🃏', t: '13 張數字卡', d: '母音紅色、不發音淺灰、兩個音節切開', cards: true },
      { ic: '🧩', t: '數字的結構', d: 'eleven ＝ 數完十，剩下一', href: 'numbers-parts.html' },
      { ic: '📜', t: '數字的故事', d: '先猜再看：zero 的旅行、September、four and twenty', href: 'numbers-why.html' },
      { ic: '🌍', t: '數字環遊世界　基礎', d: '0～10：猜猜看是哪一國；字母密碼 t ＝ z、gh ＝ ch', href: 'numbers-world.html' },
      { ic: '🌍', t: '數字環遊世界　進階 1', d: '11～20：-teen ＝ -zehn ＝ -tien', href: 'numbers-world-2.html' },
      { ic: '🌍', t: '數字環遊世界　進階 2', d: '30～100：法國人 80 ＝ 4 個 20！', href: 'numbers-world-3.html' }
    ] }
}).map(f => 'numbers/' + f));
out.push.apply(out, build({
  dir: path.join(__dirname, 'sight'), font: '../../words/fonts/', home: '../index.html', suffix: 'Sight Words',
  words: SIGHT, srcW: SIGHTW, pages: SIGHTPAGES, head: SV, svjs: SV,
  index: { file: 'index.html', title: '👀 Sight Words 常見字', sub: 'I　My　You　Your　name　is　What　How　old　year',
    links: [
      { ic: '🃏', t: '19 張常見字卡', d: '母音紅色、不發音淺灰；進階：Who、Where、When、Why', cards: true },
      { ic: '🧩', t: '常見字的結構', d: 'you ＋ r ＝ your、’ ＝ 藏起來的字母', href: 'sight-parts.html' },
      { ic: '📜', t: '常見字的故事', d: '先猜再看：I 為什麼大寫？wh 家族、德文 Jahr', href: 'sight-why.html' },
      { ic: '🌍', t: '常見字環遊世界', d: '別的國家怎麼說 你、你的、你幾歲？別國的「我」也大寫嗎？', href: 'sight-world.html' }
    ] }
}).map(f => 'sight/' + f));
console.log('G3 單字：' + out.length + ' 頁');
