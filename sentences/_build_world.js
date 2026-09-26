/* sentences/_build_world.js — 四年級 Unit 1／Unit 2 句型環遊世界（使用者 2026-09-26 指定，第 22 點）
 *   node sentences/_build_world.js   ➜ sentences/world.html
 *
 * 樣板跟家人單字環遊世界同一套（words/_build_story.js 的 tpl、words/_world.js 的猜猜看與地圖）。
 * 教學原則（使用者指定）：看別的國家怎麼說，一定要幫學生記住英文句型，
 *   所以每一句公布以後都有「為什麼像、哪裡不一樣」的真實故事：
 *   德文 Wer ist er? 一個字對一個字 ＝ Who is he?（wer 長得像 where，其實是 who！）；
 *   cousin、aunt 是 1066 年法文送給英文的，德文、瑞典文也跟法文借；瑞典文 moster ＝ 媽媽的姊妹；
 *   德、荷、瑞典、法、西說職業都不用 a（Er ist Arzt.）——只有英文要 a；
 *   問句：德、荷、瑞典、法 一樣把「是」搬到最前面，跟 Is he…? 一模一樣。
 * 外國字全部查字典（Duden／Van Dale／SAOL／Larousse／RAE），出處在 📖。
 */
const fs = require('fs'), path = require('path');
const { tpl } = require('../words/_build_story');
const { e, warn, ev, I } = require('../words/_sources');
const WD = require('../words/_world');
const NP = require('../G3 - L1 + L2/_num_pages');
const F = WD.flag, { cx, E, Dd, N, rem, BRO3, REMLINE } = NP;

const SVA = fs.existsSync(path.join(__dirname, '..', 'words', 'audio', 'sv', 'aud.js'))
  ? '<script src="../words/audio/sv/aud.js"></script><script>window.SVDIR="../words/audio/sv/"</script>' : '';
const DICT = 'Duden；Van Dale；SAOL（瑞典學院詞典）；Larousse；RAE（西班牙皇家學院詞典）';
const SRC = [
  ...require('../words/_sources').P.world.filter(r => ['map', 'why5', 'boat', 'gmc', 'where', '1066'].indexOf(r.id) >= 0),
  I('s-who', e('Who’s he? 家族', DICT + '「wer」「wie」「vem」「qui」「quién」',
    '德 Wer ist er?、荷 Wie is hij?、瑞典 Vem är han?：一個字對一個字。德文 <b>wer ＝ who</b>（長得像 where！）、荷蘭文 <b>wie ＝ who</b>。')),
  I('s-cousin', e('cousin 家族', 'OED「cousin」；Duden「Cousin」；SAOL「kusin」；Larousse「cousin」；Van Dale「neef」',
    '英文 cousin 是 1066 年以後從法文來的；德文 Cousin、瑞典文 kusin 也是跟法文借的。荷蘭文 neef ＝ 表哥、也 ＝ 姪子（跟 nephew 是一家）。')),
  I('s-aunt', e('aunt 家族', 'OED「aunt」；Duden「Tante」；Van Dale「tante」；SAOL「moster」「faster」；Larousse「tante」；RAE「tía」',
    'aunt 從古法文 ante 來；德、荷 Tante 從法文 tante 來。瑞典文：<b>moster</b> ＝ mor ＋ syster（媽媽的姊妹）、<b>faster</b> ＝ far ＋ syster（爸爸的姊妹）。')),
  I('s-job', ev('只有英文要 a', DICT + '「Arzt」「dokter」「läkare」「médecin」「médico」；Cambridge Grammar「a/an with jobs」',
    '說「他是醫生」：德 Er ist Arzt.、荷 Hij is dokter.、瑞典 Han är läkare.、法 Il est médecin.、西 Él es médico.——<b>都不用「一位」</b>；英文一定要 <b>a</b>：He is a doctor.',
    '<div class="ev"><span class="st"><b>He is a doctor.</b><em>英文：要 a</em></span><span class="st" style="animation-delay:.5s"><b>Er ist Arzt.</b><em>德文：不用</em></span></div>')),
  I('s-q', e('問句：「是」搬到最前面', DICT, '德 Ist er Arzt?、荷 Is hij dokter?、瑞典 Är han läkare?、法 Est-il médecin ?：跟英文 Is he a doctor? 一樣，<b>「是」搬到最前面</b>。')),
  I('s-yes', e('Yes、No 家族', DICT + '「ja」「nein」「nee」「nej」「oui」「non」「sí」「no」',
    'Yes ＝ 德、荷、瑞典 <b>Ja</b>；No ＝ Nein／Nee／Nej：都是 n 開頭。')),
  warn('瑞典文的聲音', '瑞典文用的是<b>預先做好的語音檔</b>（Piper sv_SE-nst，瑞典母語者錄音 NST 訓練，CC0）；還沒做成語音檔的句子用電腦的瑞典文語音。')
];
const R = (de, nl, sv, fr, es) => [['de', de], ['nl', nl], ['sv', sv], ['fr', fr], ['es', es]];
const g = o => WD.guessMany(o);
const S = [
  { emoji: '🌍', mid: '句型，環遊世界', lines: ['別的國家怎麼說 <b>他是誰？</b>、<b>他是一位醫生嗎？</b>'] },
  WD.WHERE, WD.SIX, WD.WHY5, WD.TREE, Object.assign({}, WD.MAPS[2], { lines: REMLINE }),
  { emoji: '👨‍👩‍👧', mid: 'Unit 1　Who’s he?', lines: ['<b>先猜</b>是哪一國，再按「公布答案」'] },
  g({ src: 's-who', en: 'Who is he?', zh: '他是誰？', tz: '他 是 誰？', r: R('Wer ist er?', 'Wie is hij?', 'Vem är han?', 'Qui est-il ?', '¿Quién es él?'), near: ['de', 'nl'],
    why: '德文<b>一個字對一個字</b>！wer 長得像 where，其實是 <b>who</b>', story: cx('🇬🇧 ' + E('Who') + ' is he?', F('de') + ' ' + Dd('Wer') + ' ist er?', F('nl') + ' ' + Dd('Wie') + ' is hij?') }),
  g({ src: 's-who', en: 'Who is she?', zh: '她是誰？', tz: '她 是 誰？', r: R('Wer ist sie?', 'Wie is zij?', 'Vem är hon?', 'Qui est-elle ?', '¿Quién es ella?'), near: ['de', 'nl'],
    why: '荷蘭文 <b>Wie is</b>：wie ＝ who、is ＝ is', story: cx('🇬🇧 Who ' + E('is') + ' she?', F('nl') + ' Wie ' + Dd('is') + ' zij?<em>is 一模一樣</em>') }),
  g({ src: 's-cousin', en: 'He is my cousin.', zh: '他是我的表哥。', tz: '他 是 我的 表哥。', r: R('Er ist mein Cousin.', 'Hij is mijn neef.', 'Han är min kusin.', 'C’est mon cousin.', 'Él es mi primo.'), near: ['de', 'sv', 'fr'],
    why: 'cousin 是<b>法文</b>送的：德、瑞典也跟法文借！', story: cx(F('fr') + ' ' + N('cousin') + '<em>1066 年</em>', '🇬🇧 ' + E('cousin'), F('de') + ' ' + Dd('Cousin'), F('sv') + ' ' + Dd('kusin')) }),
  g({ src: 's-aunt', en: 'She is my aunt.', zh: '她是我的阿姨。', tz: '她 是 我的 阿姨。', r: R('Sie ist meine Tante.', 'Zij is mijn tante.', 'Hon är min moster.', 'C’est ma tante.', 'Ella es mi tía.'), near: ['de', 'nl', 'fr'],
    why: '瑞典文 <b>moster</b> ＝ 媽媽的姊妹，跟中文一樣分兩邊！', story: cx(F('fr') + ' ' + N('tante'), F('de') + ' ' + Dd('Tante'), '🇬🇧 ' + E('aunt')) + cx(F('sv') + ' ' + Dd('mo') + 'ster<em>媽媽 ＋ 姊妹</em>') }),
  { emoji: '👨‍⚕️', mid: 'Unit 2　Is he a doctor?', lines: ['<b>先猜</b>是哪一國，再按「公布答案」'] },
  g({ src: 's-job', en: 'He is a doctor.', zh: '他是一位醫生。', tz: '他 是 一位 醫生。', r: R('Er ist Arzt.', 'Hij is dokter.', 'Han är läkare.', 'Il est médecin.', 'Él es médico.'), near: ['nl'],
    why: '五國<b>都不用「一位」</b>！只有英文要 <b>a</b>', story: cx('🇬🇧 He is ' + E('a') + ' doctor.', F('de') + ' Er ist Arzt.<em>沒有 a</em>') }),
  g({ src: 's-q', en: 'Is he a doctor?', zh: '他是一位醫生嗎？', tz: '他 是 一位 醫生 嗎？', r: R('Ist er Arzt?', 'Is hij dokter?', 'Är han läkare?', 'Est-il médecin ?', '¿Es él médico?'), near: ['de', 'nl', 'sv', 'fr'],
    why: '四國都把「<b>是</b>」搬到最前面，跟 <b>Is he…?</b> 一樣', story: cx('🇬🇧 ' + E('Is') + ' he', F('de') + ' ' + Dd('Ist') + ' er', F('nl') + ' ' + Dd('Is') + ' hij', F('sv') + ' ' + Dd('Är') + ' han') }),
  g({ src: 's-yes', en: 'Yes, he is.', zh: '對，他是。', tz: '對，他 是。', r: R('Ja, das ist er.', 'Ja, dat is hij.', 'Ja, det är han.', 'Oui, il l’est.', 'Sí, lo es.'), near: ['de', 'nl', 'sv'],
    why: 'Yes ＝ <b>Ja</b>：德、荷、瑞典都一樣', story: cx('🇬🇧 ' + E('Yes'), F('de') + ' ' + Dd('Ja'), F('nl') + ' ' + Dd('Ja'), F('sv') + ' ' + Dd('Ja')) }),
  g({ src: 's-yes', en: 'No, she isn’t.', zh: '不，她不是。', tz: '不，她 不是。', r: R('Nein, das ist sie nicht.', 'Nee, dat is ze niet.', 'Nej, det är hon inte.', 'Non, elle ne l’est pas.', 'No, ella no lo es.'), near: ['de', 'nl', 'sv', 'fr', 'es'],
    why: 'No：六國都是 <b>n</b> 開頭！', story: cx('🇬🇧 ' + E('N') + 'o', F('de') + ' ' + Dd('N') + 'ein', F('nl') + ' ' + Dd('N') + 'ee', F('fr') + ' ' + Dd('N') + 'on') }),
  { tag: '記住這件事', sayAll: 1, src: 'boat',
    h: rem([['Who is he?', 'Wer ist er?', 'Wie is hij?', '他是誰？'], ['Is he a doctor?', 'Ist er Arzt?', 'Is hij dokter?', '他是醫生嗎？'],
      ['Yes, he is.', 'Ja, das ist er.', 'Ja, dat is hij.', '對，他是。'], ['He is ' + E('a') + ' doctor.', 'Er ist Arzt.', 'Hij is dokter.', '只有英文要 a']]) + BRO3,
    lines: ['句子的順序也很像：<b>Is he…? ＝ Ist er…?</b>'] }
];
const CSS = NP.CSS + `
.rem td{font-size:clamp(15px,min(3vh,3.2vw),30px)}`;
fs.writeFileSync(path.join(__dirname, 'world.html'), tpl({
  file: 'world.html', title: '句型環遊世界', suffix: '四年級 句型', sayAll: 1, big: 1, css: CSS, topic: '🌍 句型環遊世界',
  font: '../words/fonts/', home: 'index.html', svjs: SVA, srcRows: SRC, S
}), 'utf8');
console.log('world ok  ' + S.length + ' 幕');
