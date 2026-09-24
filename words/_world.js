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
    tag: '🕵️ 這是哪一國的話？', say: '', sayAll: 1,
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
    tag: '🌍 別的國家怎麼叫' + o.zh, sayAll: 1,
    h: '<div class="guess many fo">' +
      '<div class="gen">英文 <span class="sp gbig" data-say="' + o.en + '">' + o.en + '</span><em>' + o.zh + '</em></div>' +
      '<div class="glist">' + o.r.map((x, k) =>
        '<div class="grow' + (o.near.indexOf(x[0]) >= 0 ? ' near' : '') + '" style="animation-delay:' + (0.2 + k * 0.12).toFixed(2) + 's">' +
        '<span class="sp gw" data-say="' + x[1].replace(/／/g, ', ') + '" data-lang="' + LANG[x[0]] + '">' + x[1] + '</span>' +
        q + ans(x[0]) + '</div>').join('') + '</div>' +
      '<button class="grev">🔍 公布答案</button>' +
      '<div class="gwhy">' + o.why + '</div></div>'
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

const mapScene = (tag, inner, lines, below) => ({ tag, map: 1,
  h: '<div class="mapbox fo">' + M.svg(inner) + '</div>' + (below ? '<div class="mbelow">' + below + '</div>' : ''), lines });

const MAPS = [
  mapScene('🗺 大約 6000 年前',
    dot(STEPPE[0], STEPPE[1], 'pulse', .3) + txt(STEPPE[0] - 5, STEPPE[1] + 3.2, '👨‍👩‍👧 草原', 'big', .5) +
    txt(STEPPE[0] - 7, STEPPE[1] - 3.2, '「mā-ter！」', 'say', 1.1),
    ['大約 <b>6000 年前</b>，有一群人住在<b>黑海北邊的草原</b>',
     '很多家人字，<b>最早從這裡出發</b>']),
  mapScene('🗺 搬家，分成兩大家族',
    dot(STEPPE[0], STEPPE[1], '', 0) + arrow(STEPPE, NORTH, 'g', .3) + arrow(STEPPE, ROME, 'l', 1.1) +
    txt(NORTH[0] - 8, NORTH[1] + 2.4, '🌲 日耳曼家族', 'big g', 1.2) + txt(ROME[0] - 7, ROME[1] - 2.2, '🏛 拉丁家族', 'big l', 2),
    ['他們慢慢<b>搬家</b>，分成好幾個家族', '往北：<b>日耳曼家族</b>　往南：<b>拉丁家族</b>']),
  mapScene('🗺 日耳曼家族：坐船到英國',
    txt(DE[0] - 1, DE[1] - 1.2, 'Mutter', 'g', .2) + txt(1.5, 54.6, 'moeder', 'g', .5) +
    txt(SE[0] - 3, SE[1], 'mor', 'g', .8) +
    boat([7.5, 55.5], [-0.5, 53.6], 1.2, '') + txt(-3.6, 51.6, 'mother', 'big e', 2.6),
    ['大約 <b>1500 年前</b>，有人從<b>德國北部、丹麥</b>坐船到英國',
     '所以 mother、Mutter、moeder <b>像兄弟姊妹</b>']),
  mapScene('🗺 拉丁家族',
    dot(ROME[0], ROME[1], 'pulse l', .2) + txt(ROME[0] + .8, ROME[1] + .6, 'māter', 'l', .4) +
    arrow(ROME, FR, 'l', .8) + arrow(ROME, ES, 'l', 1.2) +
    txt(FR[0] - 2, FR[1], 'mère', 'big l', 1.6) + txt(ES[0] - 1.5, ES[1], 'madre', 'big l', 2),
    ['拉丁家族：法文 <b>mère</b>、西班牙文 <b>madre</b>', '一樣是 <b>m</b> 開頭，但<b>跟英文比較不像</b>']),
  mapScene('🗺 1066 年：法文坐船進英國',
    txt(1.2, 47.9, '🏰 諾曼第', 'l', .2) + dot(NORM[0], NORM[1], 'pulse l', .2) +
    boat([NORM[0] - .5, NORM[1] + .6], [-1.8, 51.2], .6, ''),
    ['<b>1066 年</b>，講法文的<b>諾曼人</b>打贏英國',
     '<b>uncle、aunt、cousin</b> 就是那時候從法文來的'],
    '<span style="animation-delay:2.2s">oncle ➜ uncle</span><span style="animation-delay:2.6s">ante ➜ aunt</span>' +
    '<span style="animation-delay:3s">cosin ➜ cousin</span>')
];

/* ── ④ 語言也有家人：一個祖先，四個兄弟姊妹 ── */
const TREE = {
  tag: '🌳 語言也有家人',
  h: '<div class="ltree fo">' +
    '<div class="lroot">👵 古日耳曼語<em>很久以前的一種話</em></div>' +
    '<svg class="llines" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">' +
    [50, 150, 250, 350].map((x, k) => '<path d="M200,0 L' + x + ',40" pathLength="100" style="animation-delay:' + (0.4 + k * 0.2) + 's"/>').join('') +
    '</svg><div class="lkids">' +
    [['gb', 'mother'], ['de', 'Mutter'], ['nl', 'moeder'], ['sv', 'mor']].map((x, k) =>
      '<div class="lkid" style="animation-delay:' + (0.9 + k * 0.25).toFixed(2) + 's">' + flag(x[0]) + '<b>' + NAME[x[0]][0] + '</b>' +
      '<span class="sp" data-say="' + x[1] + '" data-lang="' + LANG[x[0]] + '">' + x[1] + '</span></div>').join('') +
    '</div></div>',
  lines: ['英文、德文、荷蘭文、瑞典文 ＝ <b>同一個家族的兄弟姊妹</b>', '所以家人單字<b>長得很像</b>']
};

module.exports = { flag, guessOne, guessMany, MAPS, TREE, NAME };
