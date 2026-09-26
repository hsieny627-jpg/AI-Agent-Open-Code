/* G3 - L1 + L2/_sight_pages.js — 👀 Sight Words 的「故事／環遊世界」（使用者 2026-09-26 指定改版，第 18～20、23、24 點）
 *
 * 教學原則跟數字一樣（見 _num_pages.js 最上面）：看別國的字，一定要幫學生記住英文。
 * 用的是查得到的真實故事：
 *   以前英文的「你」是 thou（＝ 德文、瑞典文 du），「你的」是 thine（＝ dein、din）；you 以前只用在「你們」
 *   德文 heißen、荷蘭文 heten（叫做）＝ 以前英文的 hight（叫做）
 *   How old are you? ＝ Wie alt bist du?（德）＝ Hoe oud ben je?（荷）：一個字對一個字
 *   六種語言裡，只有英文的「我」永遠大寫（德文反而是「您 Sie」和每一個名詞大寫）
 *   Who What Where When Why 以前都是 hw 開頭：hwā、hwæt、hwǣr、hwanne、hwȳ
 */
const { e, warn, ev, I } = require('../words/_sources');
const WD = require('../words/_world');
const NP = require('./_num_pages');
const F = WD.flag, { cx, E, Dd, rem, BRO3, REMLINE } = NP;

/* ═════════ 出處 ═════════ */
const SRCW = [
  ...require('../words/_sources').P.world.filter(r => ['map', 'why5', 'boat', 'gmc', 'where'].indexOf(r.id) >= 0),
  I('w-i', e('I 家族', 'Duden「ich」；Van Dale「ik」；SAOL「jag」；Larousse「je」；RAE「yo」；OED「I, pron.」', '德 ich、荷 ik、瑞典 jag、法 je、西 yo；古英文 ic。')),
  I('w-my', e('my 家族', 'Duden「mein」；Van Dale「mijn」；SAOL「min」；Larousse「mon」；RAE「mi」；OED「mine」', '古英文 mīn ＝ 德 mein、荷 mijn、瑞典 min。')),
  I('w-you', e('you 家族：以前的 thou', 'OED「thou, pron.」「you, pron.」；Duden「du」；SAOL「du」；Van Dale「jij」',
    '以前英文一個人的「你」是 <b>thou</b>，跟德文、瑞典文 <b>du</b> 是同一個字；you 以前只用在「你們」。')),
  I('w-your', e('your 家族：以前的 thine', 'OED「thine」「your」；Duden「dein」；SAOL「din」；Van Dale「jouw」', '以前「你的」是 <b>thine／thy</b> ＝ 德文 dein、瑞典文 din。')),
  I('w-name', e('name 家族', 'Duden「Name」；Van Dale「naam」；SAOL「namn」；Larousse「nom」；RAE「nombre」', '五國都像：<b>n ＋ m</b>。')),
  I('w-is', e('is 家族', 'Duden「ist」；Van Dale「is」；SAOL「är」；Larousse「est」；RAE「es」', '荷蘭文<b>一模一樣</b>：is。')),
  I('w-what', e('what 家族', 'Duden「was」；Van Dale「wat」；SAOL「vad」；Larousse「que／quoi」；RAE「qué」', '德 was、荷 wat、瑞典 vad：w／v 開頭。')),
  I('w-name-s', e('My name is Ken.', 'Van Dale「naam」；Duden「heißen」；SAOL「heta」；Larousse「s’appeler」；RAE「llamarse」',
    '荷蘭文 <b>Mijn naam is Ken.</b> 幾乎一模一樣；法、西說「我叫自己 Ken」。')),
  I('w-whats', e('What’s your name?', 'Duden「heißen」；Van Dale「heten」；SAOL「heta」；Larousse「s’appeler」；RAE「llamarse」；OED「hight, v.」',
    '德 Wie heißt du?、荷 Hoe heet je?、瑞典 Vad heter du?：問「你<b>叫</b>什麼」。heißen、heten、heta ＝ 以前英文的 <b>hight</b>（叫做）。')),
  I('w-howold', e('How old are you?', 'Duden「alt」；Van Dale「oud」；SAOL「gammal」；Larousse「avoir … ans」；RAE「tener … años」',
    '德 Wie alt bist du?、荷 Hoe oud ben je?：一個字對一個字；法 Quel âge as-tu?、西 ¿Cuántos años tienes?：你「有」幾歲。')),
  I('w-age', e('I’m ten years old.', 'Duden「alt」；Van Dale「oud」；SAOL「gammal」；Larousse「avoir … ans」；RAE「tener … años」',
    '德 Ich bin zehn Jahre alt.（跟英文一樣「十年老」）；法 J’ai dix ans.、西 Tengo diez años.（<b>我有十年</b>）。')),
  I('w-cap', ev('別的國家的「我」也大寫嗎？', 'Duden（Groß- und Kleinschreibung：Substantive、Anrede „Sie“）；Van Dale「ik」；SAOL「jag」；Larousse「je」；RAE「yo」；Merriam-Webster「Why Is ‘I’ Capitalized?」；OED「I, pron.」',
    '這六種語言裡，<b>只有英文的「我」永遠大寫</b>。德文反而把<b>每一個名詞</b>（der Name）和<b>「您」Sie</b> 大寫。英文 I 為什麼大寫：最多學者支持的說法是「一個小小的 i 太容易看漏」。',
    '<div class="ev"><span class="st"><b>Ken and I</b><em>英文：I 大寫</em></span><span class="st" style="animation-delay:.5s"><b>Ken und ich</b><em>德文：ich 小寫</em></span></div>')),
  warn('瑞典文的聲音', '瑞典文用的是<b>預先做好的語音檔</b>（Piper sv_SE-nst，瑞典母語者錄音 NST 訓練，CC0）；還沒做成語音檔的句子用電腦的瑞典文語音。')
];

const card = o => WD.guessMany(o);
const R = (de, nl, sv, fr, es) => [['de', de], ['nl', nl], ['sv', sv], ['fr', fr], ['es', es]];
const CAP = {
  tag: '🔠 別的國家的「我」也大寫嗎？', src: 'w-cap',
  q: { q: '德文的「我」<b>ich</b>，放在句子中間要大寫嗎？', o: ['不用，小寫 ich', '要，寫成 ICH', '要，寫成 Ich', '想大寫就大寫'] },
  h: '<div class="lk fo" style="grid-template-columns:auto auto">' +
    [['gb', 'Ken and ', 'I', 'en-US'], ['de', 'Ken und ', 'ich', 'de-DE'], ['nl', 'Ken en ', 'ik', 'nl-NL'], ['sv', 'Ken och ', 'jag', 'sv-SE'], ['fr', 'Ken et ', 'moi', 'fr-FR'], ['es', 'Ken y ', 'yo', 'es-ES']].map((r, k) =>
      '<span class="fl" style="animation-delay:' + (0.2 + k * 0.3).toFixed(1) + 's">' + F(r[0]) + WD.NAME[r[0]][0].replace('文', '') + '</span>' +
      '<span class="w sp" data-say="' + r[1] + r[2] + '"' + (k ? ' data-lang="' + r[3] + '"' : '') + ' style="font-size:clamp(20px,3.6vh,36px);animation-delay:' + (0.3 + k * 0.3).toFixed(1) + 's">' + r[1] +
      '<span class="' + (k ? 'd' : 'e') + '">' + r[2] + '</span></span>').join('') +
    '<span class="zz">「Ken 和<b>我</b>」：<b style="color:#FFD24A">只有英文的 I 大寫！</b></span></div>',
  lines: ['德文反而把<b>每一個名詞</b>大寫：<b>N</b>ame']
};
const worldS = [
  { emoji: '🌍', mid: '常見字，環遊世界', lines: ['別的國家怎麼說「我」「你」「你幾歲？」'] },
  WD.WHERE, WD.SIX, WD.WHY5, WD.TREE, Object.assign({}, WD.MAPS[2], { lines: REMLINE }),
  card({ src: 'w-i', en: 'I', zh: '我', r: R('ich', 'ik', 'jag', 'je', 'yo'), near: ['de', 'nl'],
    why: '德 <b>ich</b>、荷 <b>ik</b>，最像以前的英文 <b>ic</b>', story: cx('🇬🇧 ic<em>以前的「我」</em>', F('de') + ' ich', F('nl') + ' ik') }),
  CAP,
  card({ src: 'w-my', en: 'my', zh: '我的', r: R('mein', 'mijn', 'min', 'mon', 'mi'), near: ['de', 'nl', 'sv', 'fr', 'es'],
    why: '五國都用 <b>m</b> 開頭', story: cx('🇬🇧 ' + E('m') + 'y<em>以前 mīn</em>', F('de') + ' ' + Dd('m') + 'ein', F('nl') + ' ' + Dd('m') + 'ijn', F('sv') + ' ' + Dd('m') + 'in') }),
  card({ src: 'w-you', en: 'you', zh: '你', r: R('du', 'jij', 'du', 'tu', 'tú'), near: ['de', 'sv'],
    why: '以前英文的「你」是 <b>thou</b>，跟 <b>du</b> 是一家！', story: cx('🇬🇧 ' + E('th') + 'ou<em>以前的「你」</em>', F('de') + ' ' + Dd('d') + 'u', F('sv') + ' ' + Dd('d') + 'u') }),
  card({ src: 'w-your', en: 'your', zh: '你的', r: R('dein', 'jouw', 'din', 'ton', 'tu'), near: ['de', 'sv'],
    why: '以前英文的「你的」是 <b>thine</b>，跟 <b>dein、din</b> 是一家', story: cx('🇬🇧 ' + E('th') + 'ine<em>以前的「你的」</em>', F('de') + ' ' + Dd('d') + 'ein', F('sv') + ' ' + Dd('d') + 'in') }),
  card({ src: 'w-name', en: 'name', zh: '名字', r: R('Name', 'naam', 'namn', 'nom', 'nombre'), near: ['de', 'nl', 'sv', 'fr', 'es'],
    why: '五國都像：<b>n ＋ m</b>', story: cx('🇬🇧 ' + E('n') + 'a' + E('m') + 'e', F('de') + ' ' + Dd('N') + 'a' + Dd('m') + 'e<em>名詞都大寫</em>', F('nl') + ' ' + Dd('n') + 'aa' + Dd('m')) }),
  card({ src: 'w-is', en: 'is', zh: '是', r: R('ist', 'is', 'är', 'est', 'es'), near: ['nl', 'de'],
    why: '荷蘭文<b>一模一樣</b>：is', story: cx('🇬🇧 is', F('nl') + ' is<em>一模一樣</em>', F('de') + ' is' + Dd('t')) }),
  card({ src: 'w-what', en: 'what', zh: '什麼', r: R('was', 'wat', 'vad', 'quoi', 'qué'), near: ['de', 'nl', 'sv'],
    why: '德、荷、瑞典都是 <b>w／v</b> 開頭', story: cx('🇬🇧 ' + E('w') + 'hat', F('de') + ' ' + Dd('w') + 'as', F('nl') + ' ' + Dd('w') + 'at', F('sv') + ' ' + Dd('v') + 'ad') }),
  card({ src: 'w-whats', en: 'What’s your name?', zh: '你的名字是什麼？', tz: '你的名字是什麼？', r: R('Wie heißt du?', 'Hoe heet je?', 'Vad heter du?', 'Comment tu t’appelles ?', '¿Cómo te llamas?'), near: ['sv', 'de', 'nl'],
    why: '他們問「你<b>叫</b>什麼？」德文 heißt ＝ 以前英文的 <b>hight</b>（叫做）', story: cx(F('de') + ' ' + Dd('heiß') + 'en<em>叫做</em>', '🇬🇧 ' + E('hight') + '<em>以前的英文：叫做</em>') }),
  card({ src: 'w-name-s', en: 'My name is Ken.', zh: '我的名字是 Ken。', tz: '我的名字是 Ken。', r: R('Mein Name ist Ken.', 'Mijn naam is Ken.', 'Jag heter Ken.', 'Je m’appelle Ken.', 'Me llamo Ken.'), near: ['nl', 'de'],
    why: '荷蘭文<b>幾乎一模一樣</b>！法、西說「我叫自己 Ken」', story: cx('🇬🇧 My name is', F('nl') + ' Mijn naam is', F('de') + ' Mein Name ist') }),
  card({ src: 'w-howold', en: 'How old are you?', zh: '你幾歲？', tz: '你幾歲？', r: R('Wie alt bist du?', 'Hoe oud ben je?', 'Hur gammal är du?', 'Quel âge as-tu ?', '¿Cuántos años tienes?'), near: ['de', 'nl'],
    why: '德、荷<b>一個字對一個字</b>！法、西：你「<b>有</b>」幾歲？', story: cx('🇬🇧 ' + E('How') + ' ' + E('old'), F('de') + ' ' + Dd('Wie') + ' ' + Dd('alt'), F('nl') + ' ' + Dd('Hoe') + ' ' + Dd('oud')) }),
  card({ src: 'w-age', en: 'I’m ten years old.', zh: '我十歲。', tz: '我十歲。', r: R('Ich bin zehn Jahre alt.', 'Ik ben tien jaar oud.', 'Jag är tio år gammal.', 'J’ai dix ans.', 'Tengo diez años.'), near: ['de', 'nl'],
    why: '法、西說「<b>我有十年</b>」！', story: cx('🇬🇧 ten ' + E('years') + ' ' + E('old'), F('de') + ' zehn ' + Dd('Jahre') + ' ' + Dd('alt'), F('nl') + ' tien ' + Dd('jaar') + ' ' + Dd('oud')) }),
  { tag: '記住這件事', sayAll: 1, src: 'boat',
    h: rem([['I', 'ich', 'ik', '我'], ['my', 'mein', 'mijn', '我的'], ['name', 'Name', 'naam', '名字'], ['is', 'ist', 'is', '是'], ['what', 'was', 'wat', '什麼'], ['How old', 'Wie alt', 'Hoe oud', '幾歲']]) + BRO3,
    lines: [REMLINE[1]] }
];

/* ═════════ 📜 常見字的故事（第 20、23、24 點）═════════ */
const WHYR = [
  I('i', e('I 為什麼永遠大寫', 'OED「I, pron.」；Merriam-Webster「Why Is ‘I’ Capitalized?」',
    '古英文 <b>ic</b> 慢慢變成一個字母 <b>i</b>；小小的一筆<b>太容易看漏</b>，大約 700 年前，抄書的人開始把它寫成大寫。這是最多學者支持的說法。')),
  I('you', e('you：你、你們', 'OED「you, pron.」「thou, pron.」', '以前一個人的「你」是 <b>thou</b>，<b>you</b> 是「你們」；今天兩個都說 you。')),
  I('name', e('name 以前唸兩個音節', 'OED「name, n.」；Wikipedia「Silent e」「Great Vowel Shift」', '古英文 <b>nama</b>（na-ma）；大約 600 年前，字尾的 e 慢慢不唸了，字母留下來。')),
  I('wh', e('wh 家族', 'OED「who」「what」「where」「when」「why」', '古英文 <b>hwā、hwæt、hwǣr、hwanne、hwȳ</b>：h 都寫在 w 前面，也有唸出來；後來抄書的人改寫成 wh。')),
  I('year', e('year ＝ 德文 Jahr', 'OED「year, n.」；Duden「Jahr」', '古英文 <b>gēar</b>：g 唸成 y；德文 <b>Jahr</b>（年）的 J 也唸 y。'))
];
const R2 = (w, d) => '<span class="cx" style="animation-delay:' + d + 's"><span>' + w + '</span></span>';
const whyS = [
  { emoji: '👀', mid: '天天用的字，也有故事', lines: ['<b>先猜一猜</b>，再看答案'] },
  { tag: 'I 為什麼永遠大寫', emoji: '✍️', say: 'I', src: 'i',
    q: { q: '英文的「我」<b>I</b>，為什麼永遠大寫？', o: ['小小的 i 太容易看漏，就寫大一點', '因為「我」最重要', '國王規定的', '電腦自動改的'] },
    h: '<div class="gstory" style="display:flex">' + R2('ic<em>古英文</em>', .2) + R2('<span style="font-size:.6em">i</span><em>太小了！</em>', .8) + R2('<span style="font-size:1.6em;color:#FFD24A">I</span><em>寫大一點</em>', 1.4) + '</div>',
    lines: ['小小的 i <b>太容易看漏</b>，抄書的人就把它<b>寫成大寫</b>', '（這是最多學者支持的說法）'] },
  { tag: '今天：你、你們 都是 you', emoji: '👉', say: 'you', src: 'you',
    q: { q: '英文的「<b>你們</b>」怎麼說？', o: ['也是 you', 'yous', 'you們', 'thou'] },
    h: '<div class="lk fo" style="grid-template-columns:auto auto">' +
      '<span class="w" style="animation-delay:.2s">👉🧒</span><span class="w sp" data-say="you" style="animation-delay:.5s">you<span class="fl" style="display:block;opacity:1">你</span></span>' +
      '<span class="w" style="animation-delay:.9s">👉🧒🧒🧒</span><span class="w sp" data-say="you" style="animation-delay:1.2s">you<span class="fl" style="display:block;opacity:1">你們</span></span></div>',
    lines: ['今天：<b>你</b>、<b>你們</b> 都是 <b>you</b>', '以前的「你」是 <b>thou</b>，you 只用在「你們」'] },
  { tag: 'name 以前唸兩個音節', emoji: '📛', say: 'name', src: 'name',
    q: { q: '<b>name</b> 字尾的 e 不唸。很久以前的人怎麼唸 name？', o: ['na-ma（兩個音節）', '跟今天一樣', 'nem', 'nam-ee-ee'] },
    h: '<div class="gstory" style="display:flex">' + R2('na-ma<em>以前</em>', .2) + R2('nam<span style="opacity:.35">e</span><em>今天：e 不唸</em>', .9) + '</div>',
    lines: ['以前的人唸 <b>na-ma</b>', '後來 e <b>不唸了</b>，字母還留著'] },
  { tag: 'Who What Where When Why', emoji: '❓', say: 'what', src: 'wh',
    q: { q: '<b>Who What Where When Why</b>，為什麼都是 wh 開頭？', o: ['以前都是 hw 開頭的一家人', '巧合', '為了押韻', '因為後面都有問號'] },
    h: '<div class="gstory" style="display:flex">' + [['hwā', 'who'], ['hwæt', 'what'], ['hwǣr', 'where'], ['hwanne', 'when'], ['hwȳ', 'why']].map((r, k) =>
      R2('<b class="e">hw</b>' + r[0].slice(2) + ' <i>➜</i> {{' + r[1] + '}}', (0.2 + k * 0.4).toFixed(1))).join('') + '</div>',
    lines: ['以前 h 寫在前面：<b>hw</b>', '後來改成 <b>wh</b>，h 也不唸了'] },
  { tag: 'year ＝ 德文 Jahr（年）', emoji: '📅', say: 'year', src: 'year',
    q: { q: '德文 <b>Jahr</b> 是什麼意思？', o: ['年', '耳朵', '是的', '一月'] },
    h: '<div class="lk fo" style="grid-template-columns:auto auto auto">' +
      '<span class="w" style="animation-delay:.2s"><span class="e">g</span>ēar</span><span class="w sp" data-say="year" style="animation-delay:.6s"><span class="e">y</span>ear</span>' +
      '<span class="w sp" data-say="Jahr" data-lang="de-DE" style="animation-delay:1s">' + F('de') + ' <span class="d">J</span>ahr</span>' +
      '<span class="fl" style="animation-delay:.3s">古英文</span><span class="fl" style="animation-delay:.7s">今天的英文</span><span class="fl" style="animation-delay:1.1s">德文：<b>年</b></span></div>',
    lines: ['以前寫成 <b>g</b> 開頭，<b>唸 y</b>', '德文 <b>Jahr ＝ 年</b>，J 也唸 y'] },
  { tag: '所以', emoji: '🗣️⏳', mid: '灰色的字母，以前都唸過', lines: ['<b>聲音變了，字母留下來</b>'] }
];

module.exports = { SRCW, worldS, WHYR, whyS };
