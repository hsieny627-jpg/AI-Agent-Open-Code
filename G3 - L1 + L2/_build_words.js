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
const NUMPAGES = [
{file:'numbers-parts.html',title:'數字拆開來看',sayAll:1,srcRows:NUMPARTS,
 fwd:{href:'numbers-world.html',label:'🌍 環遊世界 →'},
 S:[
 {emoji:'🔢',mid:'數字單字，拆得開嗎？',lines:['one 到 ten <b>拆不開</b>，eleven、twelve <b>拆得開</b>']},
 {tag:'拆不開：整個背',emoji:'✋',src:'cant',
  h:'<div class="en in d1" style="font-size:clamp(22px,4vh,40px);line-height:1.6">{{one}} {{two}} {{three}} {{four}} {{five}}<br>{{six}} {{seven}} {{eight}} {{nine}} {{ten}}</div>',
  lines:['one 到 ten <b>拆不開</b>，整個背起來']},
 {tag:'數完十，還剩下幾個',src:'lif',
  h:'<div class="tl4 fo" style="grid-template-columns:repeat(2,auto)">' +
    '<span class="tw"><span class="sp" data-say="eleven"><span class="hi2">e</span><span class="hi">leven</span></span><em>🖐🖐 ＋ ☝️</em></span>' +
    '<span class="tw"><span class="sp" data-say="twelve"><span class="hi2">tw</span><span class="hi">elve</span></span><em>🖐🖐 ＋ ✌️</em></span></div>',
  lines:['<b>e</b> ＝ one、<b>tw</b> ＝ two、後面 ＝ <b>剩下</b>']},
 {tag:'one、two 的家人',src:'fam',
  h:'<div class="tl4 fo" style="grid-template-columns:repeat(3,auto)">' + tw('only', '只有一個') + tw('twin', '雙胞胎') + tw('twice', '兩次') + '</div>',
  lines:['字裡面藏著 <b>one</b>、<b>tw</b>（二）']},
 {tag:'下一步：十三以後',src:'teen',
  h:'<div class="tl4 fo" style="grid-template-columns:repeat(2,auto)">' +
    '<span class="tw"><span class="sp" data-say="thirteen">thir<span class="hi">teen</span></span><em>13</em></span>' +
    '<span class="tw"><span class="sp" data-say="thirty">thir<span class="hi">ty</span></span><em>30</em></span></div>',
  lines:['<b>-teen</b> ＝ 十幾，<b>-ty</b> ＝ 幾十']},
 Object.assign(WD.guessOne({c:'de',w:[['eins','eins','一','one'],['zwei','zwei','二','two'],['drei','drei','三','three'],['vier','vier','四','four'],['fünf','fünf','五','five']],
   lines:['<b>先聽、先猜</b>：這是哪一國的數字？']}),{src:'de'}),
 Object.assign(WD.guessOne({c:'sv',w:[['en','en','一','one'],['två','två','二','two'],['tre','tre','三','three'],['fyra','fyra','四','four'],['fem','fem','五','five']],
   lines:['再猜一次：<b>這又是哪一國？</b>']}),{src:'sv'}),
 {tag:'記住這件事',sayAll:1,
  h:'<div class="sumt fo">' + table('🧩 拆得開的', 'g', ['單字', '拆開', '意思'],
     [['eleven', 'e ＋ leven', '十 ＋ 一'], ['twelve', 'tw ＋ elve', '十 ＋ 二']], ['', '', '']) + '</div>' +
    '<a class="golink pop" href="numbers-world.html">🌍 下一頁：數字環遊世界 ➜</a>',
  lines:['其他的數字，<b>整個背起來</b>']}
]},

{file:'numbers-why.html',title:'數字的故事',srcRows:NUMWHY,
 S:[
 {emoji:'🔢',mid:'數字單字，有什麼故事？',lines:['每一個數字，<b>都走過很長的路</b>']},
 {tag:'zero 的旅行',emoji:'🇮🇳 ➜ 🕌 ➜ 🇮🇹 ➜ 🇬🇧',say:'zero',src:'zero',
  h:'<div class="en in d1">{{zero}}</div>',
  lines:['「<b>空的</b>」：印度 ➜ 阿拉伯 ➜ 義大利 ➜ 英國','1202 年，義大利人寫進書裡，歐洲人才開始用 0']},
 {tag:'月份的祕密',emoji:'📅',say:'September',src:'months',
  h:'<div class="en in d1" style="font-size:clamp(20px,3.6vh,34px);line-height:1.6">' +
    '<span class="sp" data-say="September"><span class="hi">Sept</span>ember</span> ＝ 7　<span class="sp" data-say="October"><span class="hi">Oct</span>ober</span> ＝ 8<br>' +
    '<span class="sp" data-say="November"><span class="hi">Nov</span>ember</span> ＝ 9　<span class="sp" data-say="December"><span class="hi">Dec</span>ember</span> ＝ 10</div>',
  lines:['羅馬人以前一年<b>從三月開始算</b>','所以 September 是<b>第 7 個月</b>']},
 {tag:'gh 以前會唸',emoji:'8️⃣',say:'eight',src:'eight',
  h:'<div class="en in d1">ei<span class="mute">gh</span>t</div>' +
    '<div class="en pop" style="animation-delay:1.2s;font-size:clamp(24px,4.4vh,44px)"><span class="sp" data-say="acht" data-lang="de-DE">a<span class="keep">ch</span>t</span> 🇩🇪</div>',
  lines:['以前的人，gh <b>會唸出來</b>','德文 <b>acht</b> 到今天還在唸']},
 {tag:'two 的 w',emoji:'👯',say:'two',src:'two',
  h:'<div class="en in d1">{{two}}　{{twin}}　{{twice}}</div>',
  lines:['以前 two 的 <b>w 有唸</b>','twin、twice 的 w <b>到今天還在唸</b>']},
 {tag:'數手指',emoji:'🖐🖐☝️',say:'eleven',src:'lif',
  h:'<div class="en in d1">{{eleven}}　{{twelve}}</div>',
  lines:['數完十根手指，<b>還剩一</b> ➜ eleven','<b>還剩二</b> ➜ twelve']},
 {tag:'所以',emoji:'🗣️⏳',mid:'數字也有故事',lines:['記住故事，<b>拼字就記得住</b>']}
]},

{file:'numbers-world.html',title:'數字環遊世界',sayAll:1,srcRows:NUMWORLD,
 back:{href:'numbers-parts.html',label:'← 字的結構'},
 S:[
 {emoji:'🌍',mid:'數字，環遊世界',lines:['別的國家怎麼數 1、2、3？']},
 WD.SIX, WD.WHY5,
 WD.guessMany({src:'w-one',en:'one',zh:'一',r:[['de','eins'],['nl','een'],['sv','en'],['fr','un'],['es','uno']],near:['de','nl','sv'],why:'日耳曼家族（德、荷、瑞典）最像'}),
 WD.guessMany({src:'w-two',en:'two',zh:'二',r:[['de','zwei'],['nl','twee'],['sv','två'],['fr','deux'],['es','dos']],near:['nl','sv'],why:'荷蘭文 <b>twee</b> 還留著 <b>w</b>'}),
 WD.guessMany({src:'w-three',en:'three',zh:'三',r:[['de','drei'],['nl','drie'],['sv','tre'],['fr','trois'],['es','tres']],near:['de','nl','sv','fr','es'],why:'五國都像！都是 <b>t／d ＋ r</b>'}),
 WD.guessMany({src:'w-eight',en:'eight',zh:'八',r:[['de','acht'],['nl','acht'],['sv','åtta'],['fr','huit'],['es','ocho']],near:['de','nl'],why:'德、荷的 <b>ch</b>，就是英文 <b>gh</b> 以前的聲音'}),
 WD.guessMany({src:'w-eleven',en:'eleven',zh:'十一',r:[['de','elf'],['nl','elf'],['sv','elva'],['fr','onze'],['es','once']],near:['de','nl','sv'],why:'德、荷、瑞典也是「<b>數完十，剩下一</b>」'}),
 WD.guessMany({src:'w-eleven',en:'twelve',zh:'十二',r:[['de','zwölf'],['nl','twaalf'],['sv','tolv'],['fr','douze'],['es','doce']],near:['de','nl','sv'],why:'「<b>數完十，剩下二</b>」'}),
 WD.guessMany({src:'w-zero',en:'zero',zh:'零',r:[['de','Null'],['nl','nul'],['sv','noll'],['fr','zéro'],['es','cero']],near:['fr','es'],why:'法、西跟英文一樣，從阿拉伯文 <b>ṣifr</b>（空的）來'}),
 {tag:'記住這件事',sayAll:1,
  h:'<div class="sumt fo">' + table('🌲 跟德文、荷蘭文像', 'g', ['英文', '德文', '荷蘭文'],
     [['one', 'eins', 'een'], ['two', 'zwei', 'twee'], ['eight', 'acht', 'acht'], ['eleven', 'elf', 'elf']], ['', 'de-DE', 'nl-NL']) + '</div>',
  lines:['<b>數字最能看出：誰是英文的兄弟姊妹</b>']}
]}
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
 {f:'i-am',zh:'我是',icon:'🙋＝',old:'ic eom',now:'I am',src:[0,0,1],
  parts:{href:'sight-parts.html#3'},
  e1:'I am ＝ <b>I<b class="rs">’</b>m</b>',e2:'紅色的 <b class="rs">’</b> ＝ 藏起來的 a'},
 {f:'you-are',zh:'你是',icon:'👉＝',now:'You are',src:[0,0,1],
  build:{a:'You',b:'are',note:'<b>You</b> 你 ＋ <b>are</b> 是 ＝ 你是'},
  parts:{href:'sight-parts.html#3'},
  e1:'You are ＝ <b>You<b class="rs">’</b>re</b>',e2:'🤫 are 的 <b>e</b> 不唸'},
 {f:'name',zh:'名字',icon:'📛',old:'nama',now:'name',src:[0,0,1],
  e1:'🤫 字尾 <b>e</b> 不唸',e2:'以前 e 有唸，後來不唸了，<b>字母留著</b>'},
 {f:'is',zh:'是',icon:'＝',old:'is',now:'is',src:[0,0,0],
  e1:'一千多年，<b>拼法都沒有變</b>',e2:'荷蘭文的「是」<b>也寫 is</b>'},
 {f:'what',zh:'什麼',icon:'❓',old:'hwæt',now:'What',src:[0,0,1],
  e1:'以前寫成 <b>hw</b>：h 在前面',e2:'🤫 今天 <b>h</b> 不唸'},
 {f:'whats',zh:'什麼是',icon:'❓＝',now:'What’s',src:[0,0,0],
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
   lines:['<b>先聽、先猜</b>：這是哪一國的話？']}),{src:'nl'}),
 Object.assign(WD.guessOne({c:'de',w:[['ich','ich','我','I'],['mein','mein','我的','my'],['Name','Name','名字','name'],['ist','ist','是','is'],['was','was','什麼','what']],
   lines:['再猜一次：<b>這又是哪一國？</b>']}),{src:'de'}),
 {tag:'記住這件事',sayAll:1,
  h:'<div class="sumt fo">' + table('🧩 多一個、藏一個', 'g', ['單字', '怎麼變'],
     [['your', 'you ＋ r'], ['years', 'year ＋ s'], ['I’m', 'I am'], ['What’s', 'What is']], ['', '']) + '</div>' +
    '<a class="golink pop" href="sight-world.html">🌍 下一頁：常見字環遊世界 ➜</a>',
  lines:['看得懂零件，<b>拼字就不會錯</b>']}
]},

{file:'sight-why.html',title:'常見字的故事',srcRows:SIGHTWHY,
 S:[
 {emoji:'👀',mid:'天天用的字，也有故事',lines:['<b>為什麼</b>長這樣？']},
 {tag:'I 為什麼大寫',emoji:'✍️',say:'I',src:'i',
  h:'<div class="en in d1"><span class="fromL" style="font-size:.5em;color:#6A6A6A">i</span> <span class="ar">➜</span> <span class="fromR">{{I}}</span></div>',
  lines:['小小的 i <b>太容易看漏</b>','抄書的人就把它<b>寫成大寫</b>']},
 {tag:'以前是「你們」',emoji:'👉👉👉',say:'you',src:'you',
  h:'<div class="en in d1">{{you}}</div>',
  lines:['最早的 you ＝ <b>你們</b>','今天一個人、很多人，<b>都說 you</b>']},
 {tag:'e 不唸了',emoji:'📛',say:'name',src:'name',
  h:'<div class="en in d1">nam<span class="mute">e</span></div>',
  lines:['以前的人唸 <b>na-ma</b>','後來 e <b>不唸了</b>，字母還留著']},
 {tag:'h 跑到後面',emoji:'❓',say:'what',src:'what',
  h:'<div class="en in d1"><span class="flag">hw</span>æt <span class="ar">➜</span> {{what}}</div>',
  lines:['以前寫成 <b class="nosay">hwæt</b>，h 在前面','今天寫 <b>wh</b>，h <b>不唸</b>']},
 {tag:'g 變成 y',emoji:'📅',say:'year',src:'year',
  h:'<div class="en in d1"><span class="nosay">gēar</span> <span class="ar">➜</span> {{year}}</div>',
  lines:['以前寫成 <b>g</b> 開頭，<b>唸 y</b>','德文 <b>Jahr</b> 的 J 也唸 y']},
 {tag:'所以',emoji:'🗣️⏳',mid:'灰色的字母，以前都唸過',lines:['<b>聲音變了，字母留下來</b>']}
]},

{file:'sight-world.html',title:'常見字環遊世界',sayAll:1,srcRows:SIGHTWORLD,
 back:{href:'sight-parts.html',label:'← 字的結構'},
 S:[
 {emoji:'🌍',mid:'常見字，環遊世界',lines:['別的國家怎麼說「我」「名字」？']},
 WD.SIX, WD.WHY5,
 WD.guessMany({src:'w-i',en:'I',zh:'我',r:[['de','ich'],['nl','ik'],['sv','jag'],['fr','je'],['es','yo']],near:['de','nl'],why:'德 <b>ich</b>、荷 <b>ik</b> 最像以前的英文 <b>ic</b>'}),
 WD.guessMany({src:'w-my',en:'my',zh:'我的',r:[['de','mein'],['nl','mijn'],['sv','min'],['fr','mon'],['es','mi']],near:['de','nl','sv','fr','es'],why:'五國都用 <b>m</b> 開頭'}),
 WD.guessMany({src:'w-name',en:'name',zh:'名字',r:[['de','Name'],['nl','naam'],['sv','namn'],['fr','nom'],['es','nombre']],near:['de','nl','sv','fr','es'],why:'五國都像：<b>n ＋ m</b>'}),
 WD.guessMany({src:'w-is',en:'is',zh:'是',r:[['de','ist'],['nl','is'],['sv','är'],['fr','est'],['es','es']],near:['nl','de'],why:'荷蘭文<b>一模一樣</b>：is'}),
 WD.guessMany({src:'w-what',en:'what',zh:'什麼',r:[['de','was'],['nl','wat'],['sv','vad'],['fr','quoi'],['es','qué']],near:['de','nl','sv'],why:'德、荷、瑞典都是 <b>w／v</b> 開頭'}),
 WD.guessMany({src:'w-name-s',en:'My name is Ken.',zh:'我的名字是 Ken。',r:[['de','Mein Name ist Ken.'],['nl','Mijn naam is Ken.'],['sv','Jag heter Ken.'],['fr','Je m’appelle Ken.'],['es','Me llamo Ken.']],
   near:['nl','de'],why:'荷蘭文<b>幾乎一模一樣</b>！法、西說「我叫自己 Ken」'}),
 WD.guessMany({src:'w-age',en:'I’m ten years old.',zh:'我十歲。',r:[['de','Ich bin zehn Jahre alt.'],['nl','Ik ben tien jaar oud.'],['sv','Jag är tio år gammal.'],['fr','J’ai dix ans.'],['es','Tengo diez años.']],
   near:['de','nl'],why:'法、西說「<b>我有十年</b>」！'}),
 {tag:'記住這件事',sayAll:1,
  h:'<div class="sumt fo">' + table('🌲 跟德文、荷蘭文像', 'g', ['英文', '德文', '荷蘭文'],
     [['name', 'Name', 'naam'], ['is', 'ist', 'is'], ['what', 'was', 'wat'], ['my', 'mein', 'mijn']], ['', 'de-DE', 'nl-NL']) + '</div>',
  lines:['<b>天天用的字</b>，最像英文的兄弟姊妹']}
]}
];

const out = [];
out.push.apply(out, build({
  dir: path.join(__dirname, 'numbers'), font: '../../words/fonts/', home: '../index.html', suffix: '數字單字',
  words: NUM, srcW: NUMW, pages: NUMPAGES, head: SV, svjs: SV,
  index: { file: 'index.html', title: '🔢 數字單字', sub: 'zero　one　two …… eleven　twelve',
    links: [
      { ic: '🃏', t: '13 張數字卡', d: '母音紅色、不發音淺灰、兩個音節切開', cards: true },
      { ic: '🧩', t: '數字的結構', d: 'eleven ＝ 數完十，剩下一', href: 'numbers-parts.html' },
      { ic: '📜', t: '數字的故事', d: 'zero 的旅行、September 為什麼是 9 月', href: 'numbers-why.html' },
      { ic: '🌍', t: '數字環遊世界', d: '猜猜看是哪一國；五國比一比', href: 'numbers-world.html' }
    ] }
}).map(f => 'numbers/' + f));
out.push.apply(out, build({
  dir: path.join(__dirname, 'sight'), font: '../../words/fonts/', home: '../index.html', suffix: 'Sight Words',
  words: SIGHT, srcW: SIGHTW, pages: SIGHTPAGES, head: SV, svjs: SV,
  index: { file: 'index.html', title: '👀 Sight Words 常見字', sub: 'I　My　You　Your　name　is　What　How　old　year',
    links: [
      { ic: '🃏', t: '15 張常見字卡', d: '母音紅色、不發音淺灰', cards: true },
      { ic: '🧩', t: '常見字的結構', d: 'you ＋ r ＝ your、’ ＝ 藏起來的字母', href: 'sight-parts.html' },
      { ic: '📜', t: '常見字的故事', d: 'I 為什麼大寫？you 以前是「你們」？', href: 'sight-why.html' },
      { ic: '🌍', t: '常見字環遊世界', d: '猜猜看是哪一國；五國比一比', href: 'sight-world.html' }
    ] }
}).map(f => 'sight/' + f));
console.log('G3 單字：' + out.length + ' 頁');
