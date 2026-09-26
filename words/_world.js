/* words/_world.js — 「這是哪一國的話？」猜猜看 ＋ 語言搬家地圖（使用者 2026-09-24 指定）
 *
 * 給 _build_story.js 用，產生 parts.html 與 world.html 的幕。
 *
 * 使用者指定的四件事：
 *  1. **一開始不可以出現「德文」這兩個字**：先讀、先看、先聽、再猜，按「🔍 公布答案」才亮出國旗＋國名。
 *  2. 德文右邊有「中文／英文」切換；荷蘭文右邊有「中文／英文／德文」切換。
 *  3. 用地圖演語言怎麼搬家（6000 年前 ➜ 分兩大家族 ➜ 坐船到英國 ➜ 1066 年法文進來）。
 *  4. 每一個英文家人單字，都演一次「為什麼跟別的國家的字這麼像」。
 *
 * 國旗一律用 SVG 畫，**不用國旗 emoji**：Windows 電腦的國旗 emoji 只會顯示兩個英文字母（DE、NL），
 * 跟 🟰 在使用者電腦上變白框是同一類問題。
 *
 * 事實全部查得到，出處寫在 _sources.js 的 P.parts／P.world。
 */
const M = require('./_map');

/* ── 國旗（3:2）── */
const bars = (dir, cols, w) => {
  const n = cols.length; let h = '', pos = 0;
  const tot = (w || cols.map(() => 1)).reduce((a, b) => a + b, 0);
  cols.forEach((c, k) => {
    const sz = (w ? w[k] : 1) / tot * (dir === 'h' ? 20 : 30);
    h += dir === 'h' ? '<rect x="0" y="' + pos + '" width="30" height="' + sz + '" fill="' + c + '"/>'
                     : '<rect x="' + pos + '" y="0" width="' + sz + '" height="20" fill="' + c + '"/>';
    pos += sz;
  });
  return h;
};
const FL = {
  de: bars('h', ['#000', '#DD0000', '#FFCE00']),
  nl: bars('h', ['#AE1C28', '#FFF', '#21468B']),
  fr: bars('v', ['#0055A4', '#FFF', '#EF4135']),
  es: bars('h', ['#AA151B', '#F1BF00', '#AA151B'], [1, 2, 1]),
  sv: '<rect width="30" height="20" fill="#006AA7"/><rect x="9" width="4" height="20" fill="#FECC00"/>' +
      '<rect y="8" width="30" height="4" fill="#FECC00"/>',
  gb: '<rect width="30" height="20" fill="#012169"/><path d="M0,0L30,20M30,0L0,20" stroke="#FFF" stroke-width="4"/>' +
      '<path d="M0,0L30,20M30,0L0,20" stroke="#C8102E" stroke-width="1.6"/>' +
      '<path d="M15,0V20M0,10H30" stroke="#FFF" stroke-width="6"/><path d="M15,0V20M0,10H30" stroke="#C8102E" stroke-width="3.4"/>',
  it: bars('v', ['#009246', '#FFF', '#CE2B37'])
};
const flag = c => '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true">' + FL[c] +
  '<rect width="30" height="20" fill="none" stroke="#555" stroke-width="1"/></svg>';
const NAME = { de: ['德文', '德國'], nl: ['荷蘭文', '荷蘭'], sv: ['瑞典文', '瑞典'], fr: ['法文', '法國'],
  es: ['西班牙文', '西班牙'], gb: ['英文', '英國'], it: ['義大利文', '義大利'] };
const LANG = { de: 'de-DE', nl: 'nl-NL', sv: 'sv-SE', fr: 'fr-FR', es: 'es-ES', gb: 'en-US', it: 'it-IT' };
const ans = c => '<span class="gans">' + flag(c) + '<b>' + NAME[c][0] + '</b><em>（' + NAME[c][1] + '）</em></span>';
const q = '<span class="gunk">❓ 哪一國？</span>';

/* ── ① 一種語言、五個字：先猜是哪一國，右邊可以切意思 ──
   w：[畫面上的字（可含尾巴上色）, 要唸的字, 中文, 英文, 德文(選填)] */
function guessOne(o) {
  const modes = [['0', '🙈 藏'], ['zh', '中文'], ['en', '英文']].concat(o.de ? [['de', '德文']] : []);
  return {
    tag: o.tag || '🕵️ 這是哪一國的話？', say: '', sayAll: 1,
    h: '<div class="guess one fo" data-m="0">' +
      '<div class="gtop">' + q + ans(o.c) + '</div>' +
      '<div class="gmode">右邊看：' + modes.map(m => '<button data-m="' + m[0] + '"' + (m[0] === '0' ? ' class="on"' : '') + '>' + m[1] + '</button>').join('') + '</div>' +
      '<div class="glist">' + o.w.map((x, k) =>
        '<div class="grow" style="animation-delay:' + (0.15 + k * 0.12).toFixed(2) + 's">' +
        '<span class="sp gw" data-say="' + x[1] + '" data-lang="' + LANG[o.c] + '">' + x[0] + '</span>' +
        '<span class="gm"><span class="m0">？</span><span class="mzh sp" data-say="' + x[2] + '" data-lang="zh-TW">' + x[2] + '</span>' +
        '<span class="men sp" data-say="' + x[3] + '">' + x[3] + '</span>' +
        (o.de ? '<span class="mde sp" data-say="' + x[4] + '" data-lang="de-DE">' + x[4] + '</span>' : '') +
        '</span></div>').join('') + '</div>' +
      '<button class="grev">🔍 公布答案</button></div>',
    lines: o.lines || []
  };
}

/* ── ② 一個英文字、五個國家：先猜每一個是哪一國，公布以後最像的那幾個會亮起來 ──
   r：[國家代碼, 那一國的字（可以有兩個，用／隔開）] */
function guessMany(o) {
  return {
    /* 2026-09-26 使用者指定：一律寫成「別的國家怎麼說 ＿＿」（說後面空一格） */
    tag: '🌍 別的國家怎麼說 ' + (o.tz || o.zh), sayAll: 1, src: o.src || 'w-' + o.en, q: o.q,
    h: '<div class="guess many fo">' +
      '<div class="gen">英文 <span class="sp gbig" data-say="' + o.en + '">' + o.en + '</span><em>' + o.zh + '</em></div>' +
      '<div class="glist">' + o.r.map((x, k) =>
        '<div class="grow' + (o.near.indexOf(x[0]) >= 0 ? ' near' : '') + '" style="animation-delay:' + (0.2 + k * 0.12).toFixed(2) + 's">' +
        '<span class="sp gw" data-say="' + x[1].replace(/／/g, ', ') + '" data-lang="' + LANG[x[0]] + '">' + x[1] + '</span>' +
        q + ans(x[0]) + '</div>').join('') + '</div>' +
      '<button class="grev">🔍 公布答案</button>' +
      '<div class="gwhy">' + o.why + '</div>' +
      /* 公布以後才出現的「為什麼這麼像」小動畫（使用者 2026-09-26 指定：每一張都要有語言演變的真實故事） */
      (o.story ? '<div class="gstory">' + o.story + '</div>' : '') + '</div>'
  };
}

/* ── ③ 地圖：語言怎麼搬家 ── */
const pt = (lon, lat) => M.P(lon, lat);
const txt = (lon, lat, s, cls, d) => { const [x, y] = pt(lon, lat);
  return '<text class="mt ' + (cls || '') + '" x="' + x + '" y="' + y + '" style="animation-delay:' + (d || 0) + 's">' + s + '</text>'; };
const dot = (lon, lat, cls, d) => { const [x, y] = pt(lon, lat);
  return '<circle class="md ' + (cls || '') + '" cx="' + x + '" cy="' + y + '" r="6" style="animation-delay:' + (d || 0) + 's"/>'; };
const arrow = (a, b, cls, d) => { const [x1, y1] = pt(a[0], a[1]), [x2, y2] = pt(b[0], b[1]);
  const mx = (x1 + x2) / 2 + (y2 - y1) * 0.18, my = (y1 + y2) / 2 - (x2 - x1) * 0.18;
  return '<path class="ma ' + (cls || '') + '" d="M' + x1 + ',' + y1 + 'Q' + mx.toFixed(1) + ',' + my.toFixed(1) + ' ' + x2 + ',' + y2 +
    '" pathLength="100" style="animation-delay:' + (d || 0) + 's"/>'; };
/* 會沿著路線移動的小船 */
const boat = (a, b, d, lbl) => { const [x1, y1] = pt(a[0], a[1]), [x2, y2] = pt(b[0], b[1]);
  return '<g class="mb" style="--dx:' + (x2 - x1) + 'px;--dy:' + (y2 - y1) + 'px;animation-delay:' + d + 's">' +
    '<text x="' + x1 + '" y="' + y1 + '" class="mboat">⛵</text>' +
    (lbl ? '<text x="' + (x1 + 12) + '" y="' + (y1 + 16) + '" class="mt small">' + lbl + '</text>' : '') + '</g>'; };

const STEPPE = [40, 48.5], NORTH = [10, 55], ROME = [12.5, 42], ENG = [-1.2, 52.4], NORM = [0.2, 49.2],
  DE = [10.5, 51], NL = [5.6, 52.3], SE = [15.5, 60.5], FR = [2.4, 46.8], ES = [-3.7, 40.3];

/* 今天的國家名字：每一張地圖都標出來（使用者 2026-09-25 指定：學生不知道地圖上的地方是哪一國） */
const CTRY = [['gb', -2.2, 53.2, '英國'], ['de', 10.2, 51.2, '德國'], ['nl', 5.4, 52.4, '荷蘭'], ['sv', 15.2, 62.2, '瑞典'],
  ['fr', 2.3, 46.6, '法國'], ['es', -3.8, 40.0, '西班牙'], ['it', 12.8, 43.2, '義大利']];
const names = () => CTRY.map(c => { const [x, y] = pt(c[1], c[2]); return '<text class="mc" x="' + x + '" y="' + y + '">' + c[3] + '</text>'; }).join('');
/* 時間軸：現在演到哪一段（使用者 2026-09-25 指定：學生搞不清楚歷史，用一條看得到的時間線帶著走） */
const TL = ['6000 年前', '分成兩家', '1500 年前', '拉丁家族', '1066 年', '今天'];
const tline = k => '<div class="tline">' + TL.map((t, j) => '<span class="' + (j < k ? 'past' : j === k ? 'now' : '') + '">' + t + '</span>').join('<i>➜</i>') + '</div>';
const mapScene = (tag, inner, lines, below, k, src) => ({ tag, map: 1, src: src || 'map',
  h: tline(k) + '<div class="mapbox fo">' + M.svg(names() + inner) + '</div>' + (below ? '<div class="mbelow">' + below + '</div>' : ''), lines });

const MAPS = [
  mapScene('🗺 很久很久以前（6000 年前）',
    dot(STEPPE[0], STEPPE[1], 'pulse', .3) + txt(STEPPE[0] - 5, STEPPE[1] + 3.2, '👨‍👩‍👧 草原', 'big', .5) +
    txt(STEPPE[0] - 7, STEPPE[1] - 3.2, '「mā-ter！」', 'say', 1.1),
    ['有一群人住在<b>黑海北邊的草原</b>', '很多家人字，<b>從這裡出發</b>'], '', 0, 'steppe'),
  mapScene('🗺 搬家，分成兩大家族',
    dot(STEPPE[0], STEPPE[1], '', 0) + arrow(STEPPE, NORTH, 'g', .3) + arrow(STEPPE, ROME, 'l', 1.1) +
    txt(NORTH[0] - 8, NORTH[1] + 2.4, '🌲 日耳曼家族', 'big g', 1.2) + txt(ROME[0] - 7, ROME[1] - 2.2, '🏛 拉丁家族', 'big l', 2),
    ['往北：<b>🌲 日耳曼家族</b>', '往南：<b>🏛 拉丁家族</b>'], '', 1, 'steppe'),
  mapScene('🗺 坐船到英國（1500 年前）',
    txt(DE[0] - 1, DE[1] - 1.2, 'Mutter', 'g', .2) + txt(1.5, 54.6, 'moeder', 'g', .5) +
    txt(SE[0] - 3, SE[1] - 1.4, 'mor', 'g', .8) +
    boat([7.5, 55.5], [-0.5, 53.6], 1.2, '') + txt(-3.6, 51.2, 'mother', 'big e', 2.6),
    ['德國北部、丹麥的人<b>坐船到英國</b>', 'mother、Mutter、moeder <b>是兄弟姊妹</b>'], '', 2, 'boat'),
  mapScene('🗺 拉丁家族',
    dot(ROME[0], ROME[1], 'pulse l', .2) + txt(ROME[0] + .8, ROME[1] + .6, 'māter', 'l', .4) +
    arrow(ROME, FR, 'l', .8) + arrow(ROME, ES, 'l', 1.2) +
    txt(FR[0] - 2, FR[1] - 1.4, 'mère', 'big l', 1.6) + txt(ES[0] - 1.5, ES[1] - 1.4, 'madre', 'big l', 2),
    ['法國 <b>mère</b>、西班牙 <b>madre</b>', '一樣 <b>m</b> 開頭，<b>跟英文比較不像</b>'], '', 3, 'latin'),
  mapScene('🗺 1066 年：法文坐船進英國',
    txt(1.2, 47.9, '🏰 諾曼第', 'l', .2) + dot(NORM[0], NORM[1], 'pulse l', .2) +
    boat([NORM[0] - .5, NORM[1] + .6], [-1.8, 51.2], .6, ''),
    ['講法文的<b>諾曼人</b>打贏英國', '<b>uncle、aunt、cousin</b> 從法文來'],
    '<span style="animation-delay:2.2s">oncle ➜ uncle</span><span style="animation-delay:2.6s">ante ➜ aunt</span>' +
    '<span style="animation-delay:3s">cosin ➜ cousin</span>', 4, '1066')
];

/* ── 歐洲在哪裡：從台灣飛過去（使用者 2026-09-25 指定：四年級看得懂的地理）── */
const WHERE = {
  tag: '🌏 這些國家在哪裡？', src: 'where',
  h: '<div class="where fo"><div class="wtw"><span class="wic">🏝️</span><b>台灣</b><em>我們在這裡</em></div>' +
    '<div class="wfly"><span class="plane">✈️</span><i></i></div>' +
    '<div class="weu"><span class="wic">🏰</span><b>歐洲</b><em>很遠的西邊</em></div></div>',
  lines: ['從台灣坐飛機，要飛<b>十幾個小時</b>', '歐洲有很多國家，<b>每一國說的話都不一樣</b>']
};
/* ── 今天的六個國家：一國一國跳出來 ── */
const SIX = {
  tag: '🗺 今天的六個國家', map: 1, src: 'map',
  h: '<div class="mapbox fo">' + M.svg(CTRY.filter(c => c[0] !== 'it').map((c, k) => {
      const [x, y] = pt(c[1], c[2]);
      return '<g class="cpop" style="animation-delay:' + (0.3 + k * 0.45).toFixed(2) + 's">' +
        '<circle cx="' + x + '" cy="' + (y - 4) + '" r="5" class="md" style="opacity:1"/>' +
        '<text class="mt big" x="' + (x + 8) + '" y="' + y + '" style="opacity:1">' + c[3] + '</text></g>';
    }).join('')) + '</div>' +
    '<div class="flags6">' + ['gb', 'de', 'nl', 'sv', 'fr', 'es'].map((c, k) =>
      '<span style="animation-delay:' + (0.3 + k * 0.45).toFixed(2) + 's">' + flag(c) + '<b>' + NAME[c][1] + '</b></span>').join('') + '</div>',
  lines: ['英國在最左邊的<b>小島</b>上']
};
/* ── 為什麼挑這 5 個國家（使用者 2026-09-25 指定）── */
const WHY5 = {
  tag: '🤔 為什麼挑這 5 國？', src: 'why5',
  h: '<div class="why5 fo">' +
    '<div class="w5 g" style="animation-delay:.2s"><span class="w5f">' + flag('de') + flag('nl') + flag('sv') + '</span>' +
      '<b>德國・荷蘭・瑞典</b><em>🌲 英文的兄弟姊妹 ➜ 字最像</em></div>' +
    '<div class="w5 l" style="animation-delay:1s"><span class="w5f">' + flag('fr') + '</span>' +
      '<b>法國</b><em>🏰 1066 年送很多字給英文</em></div>' +
    '<div class="w5 l2" style="animation-delay:1.8s"><span class="w5f">' + flag('es') + '</span>' +
      '<b>西班牙</b><em>🏛 法文的兄弟 ➜ 比比看哪裡不一樣</em></div></div>',
  lines: ['<b>瑞典文</b>還跟中文一樣：<b>分爸爸那邊、媽媽那邊</b>']
};

/* ── ④ 語言也有家人：一個祖先，四個兄弟姊妹 ──
   2026-09-25 使用者指定：學生不懂「古日耳曼語」是什麼 ➜ 畫面上用一句話講，詳細的秒懂動畫放在 📖 出處 */
const TREE = {
  tag: '🌳 語言也有家人', src: 'gmc',
  h: '<div class="ltree fo">' +
    '<div class="lroot">👵 古日耳曼語<em>2000 多年前，北歐和德國北部的人說的話</em></div>' +
    '<svg class="llines" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">' +
    [50, 150, 250, 350].map((x, k) => '<path d="M200,0 L' + x + ',40" pathLength="100" style="animation-delay:' + (0.4 + k * 0.2) + 's"/>').join('') +
    '</svg><div class="lkids">' +
    [['gb', 'mother'], ['de', 'Mutter'], ['nl', 'moeder'], ['sv', 'mor']].map((x, k) =>
      '<div class="lkid" style="animation-delay:' + (0.9 + k * 0.25).toFixed(2) + 's">' + flag(x[0]) + '<b>' + NAME[x[0]][0] + '</b>' +
      '<span class="sp" data-say="' + x[1] + '" data-lang="' + LANG[x[0]] + '">' + x[1] + '</span></div>').join('') +
    '</div></div>',
  lines: ['英文、德文、荷蘭文、瑞典文 ＝ <b>同一個媽媽生的兄弟姊妹</b>']
};

module.exports = { flag, guessOne, guessMany, MAPS, TREE, NAME, LANG, WHERE, SIX, WHY5 };
