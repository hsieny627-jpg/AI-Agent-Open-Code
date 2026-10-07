/* g34/_data.js — 三年級、四年級共用的兩個主題：「縮寫動畫」「比較」（使用者 2026-10-07 第 11、13、14 點）
 * 改內容只改這一個檔，然後 node g34/_build.js（會先做語音檔，再寫出四頁）。
 *
 * 使用者 2026-10-07 決定：兩個年級內容一樣，各自一頁，按鈕回各自的年級首頁：
 *   三年級  G3 - L1 + L2/contract.html（縮寫動畫）、G3 - L1 + L2/compare.html（比較）
 *   四年級  sentences/contract.html、sentences/compare.html
 * 語音檔放在 g34/audio/（兩個年級共用一份），頭像用三年級的 avatars/（fix 換路徑）。
 *
 * 顏色規則（使用者 2026-10-07 指定）：
 *   縮寫的母音字母（am 的 a、is 的 i、are 的 a）＋ ’ 一律紅色（ri）
 *   不發音 ＝ 淡灰色（SIL）：are 的 e、’re 的 e、What 的 h、Who 的 W、Where 的 h 和最後的 e；
 *   另外照三年級的規則（name 的 e、you／your 的 o、years 的 a…），兩個年級看到的一樣。
 *   When、Why 的 h 照四年級「wh 的 h 淡灰」的規則（美式英語 wh 唸 /w/）。
 */
var G3 = require('../G3 - L1 + L2/_data.js');
var G4 = require('../sentences/_data.js');
var ICON = G3.ICON;

var SIL = Object.assign({}, G3.SIL, {
  who: [0],            /* (W)ho              */
  where: [1, 4],       /* W(h)er(e)          */
  when: [1],           /* W(h)en             */
  why: [1],            /* W(h)y              */
  re: [1]              /* ’r(e)：You’re、We’re、They’re */
});
var CONTR = ['s', 'm', 're'];
var BOYS = ['Ken', 'Alan', 'Mike'];

function t(en, zh, ic, o) { var x = { en: en, zh: zh, ic: ic }; if (o) for (var k in o) x[k] = o[k]; return x; }
var K = { kw: 1 };   /* 比較卡的重點字：唸到的時候這個字和它的中文稍微放大、稍微變亮 */
var BL = function () { return t('______', '______', '', { blank: 1 }); };
var DOT = function () { return t('.', '。', '', { tight: 1 }); };
var Q = function () { return t('?', '？', '', { tight: 1 }); };
var IS = function (o) { return t('is', '是', ICON.is, o); };
var S_ = function () { return t("'s", '是', ICON.is, { tight: 1 }); };
var M_ = function () { return t("'m", '是', ICON.is, { tight: 1 }); };
var RE_ = function () { return t("'re", '是', ICON.is, { tight: 1 }); };
var AM = function (o) { return t('am', '是', ICON.is, o); };
var ARE = function (o) { return t('are', '是', ICON.is, o); };

/* 主詞（顏色跟兩個年級原本的一樣：I 淺粉底、You 藍底、He 藍底、She 淺粉底） */
var P = {
  I: function (o) { return t('I', '我', ICON.i, Object.assign({ hl: 'lp' }, o)); },
  You: function (o) { return t('You', '你', ICON.you, Object.assign({ hl: 'b' }, o)); },
  He: function (o) { return t('He', '他', '👦', Object.assign({ hl: 'b' }, o)); },
  She: function (o) { return t('She', '她', '👧', Object.assign({ hl: 'lp' }, o)); },
  It: function (o) { return t('It', '它', '🧸', o); },
  We: function (o) { return t('We', '我們', '👫', o); },
  They: function (o) { return t('They', '他們', '👨‍👩‍👦', o); },
  What: function (o) { return t('What', '什麼', '📦', o); },
  Who: function (o) { return t('Who', '誰', '❓', o); },
  Where: function (o) { return t('Where', '哪裡', '📍', o); },
  When: function (o) { return t('When', '什麼時候', '⏰', o); },
  Why: function (o) { return t('Why', '為什麼', '💡', o); },
  How: function (o) { return t('How', '怎麼樣', '🤔', o); }
};

/* ════════ 縮寫動畫（第 13 點）：10 組，每一組 ＝ 一張「縮寫變身」卡（五拍：唸 I am ➜ 紅色的 a 飛走、紅色的 ’ 站上去 ➜
   黏成一個字 ➜ 唸 I’m ➜ 亮出兩行：I am ______. ／ ＝ I’m ______.，＝ 在第二行第一個字母的左邊）════════ */
var mor = function (S, be, ri, tail, end) {
  return { type: 'morph', rows: 1, a: [S(), be({ ri: ri }), BL(), end()], b: [S(), tail(), BL(), end()] };
};
var CON = [
  mor(P.I, AM, 'a', M_, DOT),
  mor(P.You, ARE, 'a', RE_, DOT),
  mor(P.He, IS, 'i', S_, DOT),
  mor(P.She, IS, 'i', S_, DOT),
  mor(P.It, IS, 'i', S_, DOT),
  mor(P.We, ARE, 'a', RE_, DOT),
  mor(P.They, ARE, 'a', RE_, DOT),
  mor(P.What, IS, 'i', S_, Q),
  mor(P.Who, IS, 'i', S_, Q),
  mor(P.Where, IS, 'i', S_, Q)
];

/* ════════ 比較（第 14 點）A～F ════════ */
var USE = {
  what: G4.USE.what, who: G4.USE.who, how: G4.USE.how,
  where: { u: '問「地方」', v: '<i>📍</i><i>🏫</i><i>🏠</i>' },
  when: { u: '問「時間」', v: '<i class="spin">⏰</i><i>📅</i><i>🌙</i>' },
  why: { u: '問「原因」', v: '<i>☔</i><i>➜</i><i>💡</i>' }
};
var CMP = [
  /* A. I／My／You／Your：一次出現一個字，英文、＝、中文三欄對齊，第一個字母上下對齊 */
  { type: 'focus', eqRow: 1, left: 1, title: 'I ／ My ／ You ／ Your',
    rows: [['I', '我', ICON.i], ['My', '我的', ICON.my], ['You', '你', ICON.you], ['Your', '你的', ICON.your]] },
  /* B. I am ／ You are：唸到 I am、are you，這四個字和中文稍微放大、稍微變亮 */
  { type: 'cmp', title: 'I am ／ You are',
    rows: [[P.I(K), AM(K), BL(), DOT()], [P.You(K), ARE(K), BL(), DOT()]],
    ex: [[P.I(K), AM(K), t('Ken', 'Ken', ICON.ken), DOT()],
         [t('How old', '幾歲', ICON.howold), ARE(K), t('you', '你', ICON.you, { hl: 'b', kw: 1 }), Q()]] },
  /* C. My name ／ Your name */
  { type: 'cmp', title: 'My name ／ Your name',
    rows: [[t('My', '我的', ICON.my, { hl: 'b', kw: 1 }), t('name', '名字', ICON.name, K)],
           [t('Your', '你的', ICON.your, { hl: 'b', kw: 1 }), t('name', '名字', ICON.name, K)]],
    ex: [[t('My', '我的', ICON.my, { hl: 'b', kw: 1 }), t('name', '名字', ICON.name, K), IS(), t('Ken', 'Ken', ICON.ken), DOT()],
         [P.What(), S_(), t('your', '你的', ICON.your, { hl: 'b', kw: 1 }), t('name', '名字', ICON.name, K), Q()]] },
  /* D. How old ／ years old */
  { type: 'cmp', title: 'How old ／ years old',
    rows: [[t('How old', '幾歲', ICON.howold, K), BL(), Q()], [BL(), t('years old', '歲', ICON.yold, K), DOT()]],
    ex: [[t('How old', '幾歲', ICON.howold, K), ARE(), t('you', '你', ICON.you, { hl: 'b' }), Q()],
         [P.I(), M_(), t('ten', '十', ICON.ten), t('years old', '歲', ICON.yold, K), DOT()]] },
  /* E. He is ＝ He’s、She is ＝ She’s、It is ＝ It’s：一組一頁（縮寫變身），最後一頁三個放在一起比較 他／她／它 */
  CON[2], CON[3], CON[4],
  { type: 'cmp', title: 'He’s ／ She’s ／ It’s',
    rows: [[P.He(K), S_(), BL(), DOT()], [P.She(K), S_(), BL(), DOT()], [P.It(K), S_(), BL(), DOT()]],
    ex: [[P.He(K), S_(), t('my', '我的', ICON.my), t('father', '爸爸', '👨'), DOT()],
         [P.She(K), S_(), t('my', '我的', ICON.my), t('mother', '媽媽', '👩'), DOT()],
         [P.It(K), S_(), t('my', '我的', ICON.my), t('book', '書', '📕'), DOT()]] },
  /* F(1). What／Who／How ______? */
  { type: 'cmp', title: 'What ／ Who ／ How',
    rows: [[P.What(K), BL(), Q()], [P.Who(K), BL(), Q()], [P.How(K), BL(), Q()]] },
  { type: 'focus', eqRow: 1, left: 1, title: 'What？Who？How？',
    rows: [['What', '什麼', '📦', USE.what], ['Who', '誰', '❓', USE.who], ['How', '怎麼樣', '🤔', USE.how]] },
  /* F(2). What／Who／Where／When／Why／How ______? */
  { type: 'cmp', title: 'What ／ Who ／ Where ／ When ／ Why ／ How',
    rows: [[P.What(K), BL(), Q()], [P.Who(K), BL(), Q()], [P.Where(K), BL(), Q()],
           [P.When(K), BL(), Q()], [P.Why(K), BL(), Q()], [P.How(K), BL(), Q()]] },
  { type: 'focus', eqRow: 1, left: 1, title: '問什麼？',
    rows: [['What', '什麼', '📦', USE.what], ['Who', '誰', '❓', USE.who], ['Where', '哪裡', '📍', USE.where],
           ['When', '什麼時候', '⏰', USE.when], ['Why', '為什麼', '💡', USE.why], ['How', '怎麼樣', '🤔', USE.how]] }
];

/* 頁面寫到兩個年級的資料夾：語音檔改用 g34/audio/；四年級那一份的頭像改用三年級的 avatars/ */
var AUDT = '<script src="audio/aud.js"></script>';
function fixFor(g3) {
  return function (h) {
    if (h.split(AUDT).length !== 2) throw new Error('g34：找不到語音檔那一行（要先做語音檔：node g34/_build.js）');
    h = h.replace(AUDT, '<script src="../g34/audio/aud.js"></script><script>window.AUDDIR="../g34/audio/";</script>');
    if (!g3) { var G3D = '../G3%20-%20L1%20+%20L2/';
      h = h.split('src="avatars/').join('src="' + G3D + 'avatars/').split('src=\\"avatars/').join('src=\\"' + G3D + 'avatars/'); }
    return h;
  };
}
var PG = function (dir, g3) {
  return [
    { file: dir + 'contract.html', unit: '縮寫動畫', title: '縮寫動畫', other: 'compare.html', otherName: '➡ 比較', cards: CON, noRv: 1, fix: fixFor(g3) },
    { file: dir + 'compare.html', unit: '比較', title: '比較', other: 'contract.html', otherName: '⬅ 縮寫動畫', cards: CMP, noRv: 1, fix: fixFor(g3) }
  ];
};
var XPAGES = PG('../G3 - L1 + L2/', 1).concat(PG('../sentences/', 0));

module.exports = { SIL: SIL, CONTR: CONTR, BOYS: BOYS, ICON: ICON, SUB: {}, U1: [], U2: [], RV1: [], RV2: [], PAGES: [], XPAGES: XPAGES,
  CON: CON, CMP: CMP, CSS: G3.CSS, TRX: {}, GLX: {} };
