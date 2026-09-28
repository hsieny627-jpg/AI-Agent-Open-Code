/* words/_pages2.js — 使用者 2026-09-28 第 12(1)(5) 點的兩頁獨立動畫（三年級、四年級都用，內容一樣、回首頁的地方不一樣）
 *
 *   map-story.html  🗺 英文的大旅行：放大版地圖，一站一站演「拼法和發音為什麼變成今天這樣」
 *                   （坐船來 ➜ 維京人 ➜ 1066 法文抄書人 ➜ 1476 印刷機 ➜ 1400～1700 母音大搬家 ➜ 今天）
 *   en-de-nl.html   為什麼英文、德文、荷蘭文這麼像？（同一個媽媽 ➜ 一模一樣的字 ➜ 四組字母密碼 ➜ 不一樣的地方）
 *
 * 每一幕先猜再揭曉（故事頁樣板）；每一個外國字下面有中文；要強調的字母用顏色＋粗體；國家一律「國旗＋中文」。
 * 事實只用查得到的：High German consonant shift（t ➜ z、p ➜ pf／f）、th ➜ d、gh ＝ ch、Norman scribes、
 * Caxton 1476、Great Vowel Shift 1400～1700。出處都寫在每一幕自己的那一條。
 */
const WD = require('./_world');
const { e, ev, warn, I } = require('./_sources');
const { txt, dot, arrow, boat, names, M, flag: F } = WD;

const L = { gb: 'en-US', de: 'de-DE', nl: 'nl-NL', sv: 'sv-SE', fr: 'fr-FR' };
const sp = (w, c) => '<span class="sp" data-say="' + w.replace(/<[^>]+>/g, '') + '"' + (c && c !== 'gb' ? ' data-lang="' + L[c] + '"' : '') + '>' + w + '</span>';
const K = s => '<b class="k1">' + s + '</b>', K2 = s => '<b class="k2">' + s + '</b>';

/* 放大版地圖（一幕一張，字、國名、國旗都放大） */
const bigMap = (inner, chips) => '<div class="bigm fo">' + M.svg(names() + inner, 'bigmap') + '</div>' +
  (chips ? '<div class="mchips">' + chips.map((c, k) => '<span style="animation-delay:' + (1.6 + k * 0.5).toFixed(1) + 's">' + c + '</span>').join('') + '</div>' : '');

const MAPSRC = [
  I('ms-boat', e('坐船到英國', 'Wikipedia「Anglo-Saxon settlement of Britain」', '<b>大約 1500 年前</b>（400～500 年代），德國北部、丹麥一帶的盎格魯人、撒克遜人坐船到英國，帶來了英文。')),
  I('ms-viking', e('維京人來了', 'Wikipedia「Danelaw」；Etymonline「sister」', '<b>800～900 年代</b>，維京人住進英格蘭東北部；sister 就是跟著維京人的 <b>systir</b> 唸的。')),
  I('ms-1066', e('1066：法國來的抄書人', 'Britannica「Norman Conquest」；Wikipedia「Gh (digraph)」「Pronunciation of English ⟨wh⟩」「O」', '法國來的抄書人照法文的習慣寫英文：h ➜ <b>gh</b>（niht ➜ night）、hw ➜ <b>wh</b>（hwæt ➜ what）、u ➜ <b>o</b>（sunu ➜ son）、ū ➜ <b>ou</b>（hūs ➜ house）。')),
  I('ms-print', e('1476：印刷機', 'Wikipedia「William Caxton」「Thorn (letter)」', '<b>1476 年</b> Caxton 在倫敦西敏開了英國第一家印刷店；鉛字是從荷蘭、比利時一帶來的，<b>沒有 þ</b>，就改用 th。印刷讓拼法<b>慢慢固定下來</b>。')),
  I('ms-gvs', e('1400～1700：母音大搬家', 'Wikipedia「Great Vowel Shift」', '長母音全部換了聲音：name（ㄋㄚ-m ➜ ㄋㄟm）、five（fiiv ➜ faiv）、house（huus ➜ haus）。<b>拼法已經印好了，沒有跟著改。</b>')),
  I('ms-today', e('所以今天的拼法', 'Wikipedia「English orthography」', '今天的拼法大多是 <b>1500 年左右</b>定下來的，保留了<b>以前的聲音</b>：gh、字尾 e、wh 的 h 都是以前唸過的。')),
  warn('地圖是示意圖', '路線和年代是<b>簡化過的示意</b>，實際是好幾百年、很多批人慢慢搬的。')
];

const mapStory = {
  title: '英文的大旅行', topic: '🗺 英文的大旅行', big: 1, sayAll: 1, srcRows: MAPSRC,
  S: [
    { emoji: '🗺', mid: '英文的大旅行', lines: ['英文的<b>拼法</b>和<b>發音</b>，是一路旅行變出來的'] },
    { tag: '① 坐船到英國（大約 1500 年前）', src: 'ms-boat',
      q: { q: '英文最早是誰坐船帶到英國的？', o: ['德國北部、丹麥一帶的人', '美國人', '法國國王', '羅馬人'] },
      h: bigMap(boat([8.5, 55.2], [0.6, 53.4], .4, '') + txt(-10.4, 49.2, 'mother', 'big e', 2.2),
        [F('de') + ' ' + sp('Mutter', 'de'), F('nl') + ' ' + sp('moeder', 'nl'), F('gb') + ' ' + sp('mother')]),
      lines: ['德國北部、丹麥一帶的人<b>坐船</b>來，帶來了英文', '所以英文、德文、荷蘭文<b>是兄弟姊妹</b>'] },
    { tag: '② 維京人來了（大約 1100 年前）', src: 'ms-viking',
      q: { q: '坐船來的維京人說 <b>systir</b>，英文後來變成？', o: ['sister', 'sweostor', 'sis', 'star'] },
      h: bigMap(boat([9.5, 58.5], [-0.8, 54.8], .4, '') + dot(10, 60.5, 'pulse', .2),
        ['⛵ 維京人：<span class="nosay">' + K2('sys') + 'tir</span>', F('gb') + ' ' + sp(K('sis') + 'ter')]),
      lines: ['維京人住進英格蘭<b>東北邊</b>', '大家學他們唸 <b>sis</b>：' + K('sis') + 'ter'] },
    { tag: '③ 1066：法國來的抄書人（大約 960 年前）', src: 'ms-1066',
      q: { q: 'night 的 <b>gh</b>，是誰寫出來的？', o: ['法國來的抄書人', '維京人', '印刷工人', '美國人'] },
      h: bigMap(dot(0.2, 49.2, 'pulse l', .2) + boat([-0.3, 49.8], [-1.8, 51.2], .6, ''),
        ['<span class="nosay">niht</span> ➜ ' + sp('ni' + K('gh') + 't'), '<span class="nosay">hwæt</span> ➜ ' + sp(K('wh') + 'at')]),
      lines: ['法國來的抄書人，照<b>法文的習慣</b>寫英文'] },
    { tag: '④ 1476：印刷機（大約 550 年前）', src: 'ms-print',
      q: { q: '印刷機的鉛字裡沒有 <b>þ</b>，印刷工人改用什麼？', o: ['th', 'p', 'b', 'd'] },
      h: bigMap(arrow([3.2, 51.2], [-0.1, 51.5], 'g', .3) + dot(-0.1, 51.5, 'pulse', .2),
        ['🖨 1476 倫敦', '鉛字從比利時一帶來：<b>沒有 þ</b>']),
      lines: ['鉛字<b>沒有 þ</b>：' + K('þ') + 'e ➜ ' + K2('th') + 'e', '印刷以後，<b>拼法慢慢固定下來</b>'] },
    { tag: '⑤ 母音大搬家（大約 600～300 年前）', src: 'ms-gvs',
      q: { q: '拼法已經印好了，<b>聲音</b>卻一直變。結果呢？', o: ['拼法跟唸法不一樣了', '全部重新印', '大家不說英文了', '字母變多了'] },
      h: '<div class="gvs fo">' + [['name', 'ㄋㄚ-m', 'ㄋㄟm'], ['five', 'fiiv', 'faiv'], ['house', 'huus', 'haus']].map((r, k) =>
        '<div class="gv" style="animation-delay:' + (0.3 + k * 0.7).toFixed(1) + 's">' + sp(r[0]) + '<span class="o nosay">🔊 以前 ' + r[1] + '</span><span class="ar">➜</span><span class="n">🔊 今天 ' + r[2] + '</span></div>').join('') + '</div>',
      lines: ['<b>聲音變了</b>，拼法<b>沒有跟著改</b>', '所以英文的拼法，常常跟唸法不一樣'] },
    { tag: '所以', emoji: '🔑', mid: '拼法記住了以前的聲音', lines: ['看到不唸的 ' + K('gh') + '、字尾 ' + K('e') + '，就是<b>以前唸過</b>的證據'] }
  ]
};

/* ═════ 為什麼英文、德文、荷蘭文這麼像？ ═════ */
const ROW = (en, de, nl, zh, d) => '<tr style="animation-delay:' + d + 's"><td>' + sp(en) + '</td><td>' + sp(de, 'de') + '</td><td>' + sp(nl, 'nl') + '</td><td class="z">' + zh + '</td></tr>';
const TAB = (rows) => '<table class="t3 fo"><tr><th>' + F('gb') + ' 英文</th><th>' + F('de') + ' 德文</th><th>' + F('nl') + ' 荷蘭文</th><th>中文</th></tr>' +
  rows.map((r, k) => ROW(r[0], r[1], r[2], r[3], (0.3 + k * 0.5).toFixed(1))).join('') + '</table>';

const ENSRC = [
  I('en-tree', e('同一個媽媽', 'Wikipedia「West Germanic languages」「Proto-Germanic language」', '英文、德文、荷蘭文都是從<b>古日耳曼語</b>分出來的西日耳曼語。')),
  I('en-same', e('一模一樣的字', 'Duden「Hand」「Arm」「Name」「warm」；Van Dale「hand」「arm」「naam」「warm」', 'hand ＝ Hand ＝ hand、arm ＝ Arm ＝ arm、warm ＝ warm ＝ warm。')),
  I('en-tz', e('密碼①：t ⇄ z', 'Wikipedia「High German consonant shift」；Duden「zehn」「zwei」「Zunge」；Van Dale「tien」「twee」「tong」', '<b>500～800 年代</b>（大約 1500～1200 年前），<b>德國南部</b>的人把 t 唸成 ts（寫成 z）；荷蘭文、英文沒有變。')),
  I('en-thd', e('密碼②：th ⇄ d', 'Wikipedia「Voiceless dental fricative」「Proto-Germanic language」；Duden「drei」「danken」「denken」；Van Dale「drie」「danken」「denken」', '英文留著 <b>th</b> 的聲音；德文、荷蘭文變成 <b>d</b>。')),
  I('en-ghch', e('密碼③：gh ⇄ ch', 'Wikipedia「Gh (digraph)」；Duden「Nacht」「acht」「Licht」；Van Dale「nacht」「acht」「licht」', '英文 gh 以前唸成喉嚨呼氣的聲音；德文、荷蘭文寫成 <b>ch</b>，<b>到今天還在唸</b>。')),
  I('en-ppf', e('密碼④：p ⇄ pf／f', 'Wikipedia「High German consonant shift」；Duden「Apfel」「Pfeffer」「Schiff」；Van Dale「appel」「peper」「schip」', '德國南部的人把 p 唸成 <b>pf</b> 或 <b>f</b>；荷蘭文跟英文一樣留著 <b>p</b>。')),
  I('en-diff', e('不一樣的地方', 'Duden「Großschreibung」；Wikipedia「Capitalization」', '德文的名詞<b>一律大寫</b>（Hand、Name）；英文、荷蘭文不用。'))
];

const enDeNl = {
  title: '英德荷為什麼這麼像', topic: '👪 英德荷三兄弟', big: 1, sayAll: 1, srcRows: ENSRC,
  S: [
    { emoji: F('gb') + ' ' + F('de') + ' ' + F('nl'), mid: '英文、德文、荷蘭文，為什麼這麼像？', lines: ['<b>先猜</b>，再看答案'] },
    Object.assign({}, WD.TREE, { src: 'en-tree', q: { q: '英文、德文、荷蘭文是什麼關係？', o: ['同一個媽媽生的兄弟姊妹', '完全沒有關係', '英文是德文的爸爸', '荷蘭文是英文的老師'] } }),
    { tag: '一模一樣的字', src: 'en-same', q: { q: '德文的「手」怎麼寫？', o: ['Hand', 'Mano', 'Main', 'Te'] },
      h: TAB([['hand', 'Hand', 'hand', '手'], ['arm', 'Arm', 'arm', '手臂'], ['name', 'Name', 'naam', '名字'], ['warm', 'warm', 'warm', '溫暖']]),
      lines: ['有的字<b>一模一樣</b>，有的<b>只差一點點</b>'] },
    { tag: '🔑 密碼①：t ⇄ z', src: 'en-tz', q: { q: '德文 <b>z</b>ehn 是「十」。把 z 換成 t，就是英文的？', o: ['ten', 'zen', 'tea', 'two'] },
      h: TAB([[K('t') + 'en', K2('z') + 'ehn', K('t') + 'ien', '十'], [K('t') + 'wo', K2('z') + 'wei', K('t') + 'wee', '二'], [K('t') + 'ongue', K2('Z') + 'unge', K('t') + 'ong', '舌頭']]),
      lines: ['德文的 ' + K2('z') + '，換成 ' + K('t') + ' 就是英文', '荷蘭文<b>跟英文一樣</b>留著 t'] },
    { tag: '🔑 密碼②：th ⇄ d', src: 'en-thd', q: { q: '德文 <b>d</b>rei 是「三」。英文是？', o: ['three', 'dry', 'tree', 'free'] },
      h: TAB([[K('th') + 'ree', K2('d') + 'rei', K2('d') + 'rie', '三'], [K('th') + 'ank', K2('d') + 'anken', K2('d') + 'anken', '謝謝'], [K('th') + 'ink', K2('d') + 'enken', K2('d') + 'enken', '想']]),
      lines: ['英文的 ' + K('th') + '，德文、荷蘭文變成 ' + K2('d')] },
    { tag: '🔑 密碼③：gh ⇄ ch', src: 'en-ghch', q: { q: '英文 night 的 gh 不唸。德文 Na<b>ch</b>t 的 ch 呢？', o: ['還在唸', '也不唸', '唸成 g', '唸成 f'] },
      h: TAB([['ni' + K('gh') + 't', 'Na' + K2('ch') + 't', 'na' + K2('ch') + 't', '晚上'], ['ei' + K('gh') + 't', 'a' + K2('ch') + 't', 'a' + K2('ch') + 't', '八'], ['li' + K('gh') + 't', 'Li' + K2('ch') + 't', 'li' + K2('ch') + 't', '光']]),
      lines: ['英文 ' + K('gh') + ' ＝ 德文、荷蘭文 ' + K2('ch'), '他們<b>到今天還在唸</b>，英文不唸了'] },
    { tag: '🔑 密碼④：p ⇄ pf／f', src: 'en-ppf', q: { q: '德文 A<b>pf</b>el 是哪一種水果？', o: ['apple 蘋果', 'orange 橘子', 'pear 梨', 'grape 葡萄'] },
      h: TAB([['a' + K('pp') + 'le', 'A' + K2('pf') + 'el', 'a' + K('pp') + 'el', '蘋果'], [K('p') + 'e' + K('pp') + 'er', K2('Pf') + 'e' + K2('ff') + 'er', K('p') + 'e' + K('p') + 'er', '胡椒'], ['shi' + K('p'), 'Schi' + K2('ff'), 'schi' + K('p'), '船']]),
      lines: ['德文把 ' + K('p') + ' 唸成 ' + K2('pf') + ' 或 ' + K2('f'), '荷蘭文<b>跟英文一樣</b>留著 p'] },
    { tag: '不一樣的地方', src: 'en-diff', q: { q: '德文的「名字」Name，為什麼第一個字母大寫？', o: ['德文的名詞一律大寫', '因為是人名', '寫錯了', '句子的第一個字'] },
      h: '<div class="gvs fo"><div class="gv" style="animation-delay:.3s">' + F('de') + ' ' + sp(K2('N') + 'ame', 'de') + '　' + sp(K2('H') + 'and', 'de') + '<span class="n">德文：名詞<b>大寫</b></span></div>' +
        '<div class="gv" style="animation-delay:1s">' + F('gb') + ' ' + sp('name') + '　' + sp('hand') + '<span class="n">英文：<b>小寫</b></span></div></div>',
      lines: ['德文的名詞<b>一律大寫</b>，英文、荷蘭文不用'] },
    { tag: '所以', emoji: '🔑', mid: '看到德文、荷蘭文，就想到英文', lines: [K2('z') + ' ➜ ' + K('t') + '　' + K2('d') + ' ➜ ' + K('th') + '　' + K2('ch') + ' ➜ ' + K('gh') + '　' + K2('pf') + ' ➜ ' + K('p')] }
  ]
};

const CSS = `
/* 2026-09-28：放大版地圖、三國對照表、母音大搬家 */
.bigm{width:min(94vw,860px,calc(42vh * 1.08));margin:0 auto}
.bigmap .mt{font-size:18px}.bigmap .mt.big{font-size:22px}.bigmap .mc{font-size:16px}.bigmap .mboat{font-size:30px}
.mchips{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.mchips span{display:inline-flex;align-items:center;gap:8px;background:#0C0C0C;border:2px solid #2E2E2E;border-radius:99px;padding:4px 14px;
 font-size:clamp(18px,3vh,28px);font-weight:700;opacity:0;animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
.mchips .flag,.t3 .flag,.gv .flag{height:.9em;width:auto;vertical-align:middle}
.k1{color:#FFD24A;font-weight:700}.k2{color:#5AD1FF;font-weight:700}
.t3{border-collapse:separate;border-spacing:clamp(6px,1vw,14px) clamp(4px,.8vh,10px);margin:0 auto}
.t3 th{font-size:clamp(16px,2.6vh,24px);color:#BFD3E6;white-space:nowrap}
.t3 td{font-size:clamp(24px,min(4.6vh,4.4vw),44px);font-weight:700;text-align:center;white-space:nowrap}
.t3 td.z{color:#A8B8C4;font-size:clamp(20px,min(3.6vh,3.6vw),34px)}
.t3 td .sp{border-bottom:0}
.t3 tr{opacity:0;animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
.t3 tr:first-child{opacity:1;animation:none}
.gvs{display:flex;flex-direction:column;gap:clamp(8px,1.4vh,14px);align-items:center}
.gv{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px;background:#0C0C0C;border:2px solid #2E2E2E;border-radius:18px;
 padding:6px 18px;font-size:clamp(26px,4.8vh,46px);font-weight:700;opacity:0;animation:pop .6s cubic-bezier(.2,1.5,.4,1) both}
.gv .sp{border-bottom:0}
.gv .o{font-size:.6em;color:#E0B868}.gv .n{font-size:.6em;color:#8FD0FF}.gv .ar{font-size:.6em;color:#6B7B88}`;

module.exports = { mapStory, enDeNl, CSS };
