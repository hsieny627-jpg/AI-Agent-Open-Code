/* review1/_index.js — Review 1 單字首頁（review1/index.html）；使用者 2026-10-03 指定兩種排法
 *
 *  按鈕一「📊 依性質分類」：每一組（物品 1、物品 2、活動 1、活動 2）再分成小類（零食、飲料……），
 *    同一類裡「最受歡迎的先出現」：台灣的證據先；有名次的照名次（第 1 名先），名次一樣比百分比；只有百分比的照百分比；
 *    只有一句話說明的放後面；老師選的字（dolls、play dodgeball、play with LEGO）放最後（2026-10-03 Q9）。
 *    每一類下面都列出這一類用到的調查（名稱、年份）和網址：網址只取 sentences/review1_單字名單_查證.md
 *    那一個字那一列裡、屬於這份調查的網址（2026-09-29～10-01 逐條打開核對過的）；對不到網址 build 就失敗。
 *  按鈕二「🔤 A～Z」：先分三段 ⭐ 簡單（1～2 個音節）／⭐⭐ 中等（3 個）／⭐⭐⭐ 難（4 個以上；片語把每個字的音節加起來），
 *    音節一樣多再比字母數；每一段裡照 A～Z。
 */
const fs = require('fs'), path = require('path');
const ROW = fs.readFileSync(path.join(__dirname, '..', 'sentences', 'review1_單字名單_查證.md'), 'utf8').split('\n').filter(l => /^\| \d+ \|/.test(l));
/* 調查名稱 ➜ 網址（2026-10-03 對照 sentences/review1_單字名單_查證.md 整理；全部是那份查證檔裡打開核對過的網址）
 *   row:/…/ ＝ 這份調查有好幾頁，取「那一個字那一列」裡符合的網址（例：學研白書每一個主題一頁） */
const U = {
  nico: 'https://www.nicopuchi.jp/article/detail/41075', nate: 'https://news.nate.com/view/20240306n27710',
  gk7: 'https://www.gakken.jp/kyouikusouken/whitepaper/202511/chapter4/07.html', kids: 'https://www.children.org.tw/news/news_detail/3484',
  hug: 'https://hugkum.sho.jp/668458', yj: 'https://news.yahoo.co.jp/expert/articles/1454e5042eddb8fd25003b0e5f50609f903126d8',
  tvbs26: 'https://news.tvbs.com.tw/esg/3207840', sg: 'https://prtimes.jp/main/html/rd/p/000000018.000140019.html',
  ovo: 'https://ovo.kyodo.co.jp/news/culture/a-2078237', bandai: 'https://www.bandainamco.co.jp/files/E29885webE38090E38390E383B3E38380E382A4E38193E381A_2.pdf',
  cna: 'https://udn.com/news/story/6898/8201104', baha: 'https://gnn.gamer.com.tw/detail.php?sn=296886',
  kscr: 'https://kidscreen.com/2025/10/17/which-roblox-games-are-kids-favorites/',
  ysbr: 'https://youthsportsbusinessreport.com/survey-shows-45-of-kids-prefer-unstructured-play-over-organized-sports-activities/',
  gp: 'https://blog.google/intl/zh-tw/products/android-chrome-play/googleplay-best-of-2025/',
  wiki: 'https://en.wikipedia.org/wiki/List_of_best-selling_Nintendo_Switch_2_games', udn26: 'https://udn.com/news/story/6885/9529187',
  nl: 'https://nlab.itmedia.co.jp/research/articles/3163692/', ob: 'https://www.openbook.org.tw/article/p-71149',
  nmus: 'https://prtimes.jp/main/html/rd/p/000000314.000023383.html', coro: 'https://prtimes.jp/main/html/rd/p/000000016.000140019.html',
  npet: 'https://prtimes.jp/main/html/rd/p/000000346.000023383.html',
  dodge: 'https://tw.news.yahoo.com/%E6%A0%A1%E5%9C%92%E5%86%B7%E7%9F%A5%E8%AD%98%E4%B9%8B-%E7%82%BA%E4%BB%80%E9%BA%BC%E5%B0%8F%E5%AD%B8%E9%AB%94%E8%82%B2%E8%AA%B2%E8%A6%81%E4%B8%8A%E8%BA%B2%E9%81%BF%E7%90%83-001303875.html',
  oia: 'https://material-civet.files.svdcdn.com/production/images/documents/2025-OIA_Participation_Trends_Full_Report_2025-12-15-211912_fchj.pdf',
  tvbs24: 'https://news.tvbs.com.tw/life/2486448', npo: 'https://npoafterschool.org/wp-content/uploads/2025/06/ab79fb745d6583fa98fcb7132dff32e9.pdf',
  cz: 'https://www.citizen.co.jp/research/20250610/05.html', nlpt: 'https://nlab.itmedia.co.jp/research/articles/3736419/',
  ngram: 'https://books.google.com/ngrams/graph?content=playing+with+Lego%2Cbuilding+Lego%2Cplay+with+Lego%2Cbuild+Lego&year_start=2000&year_end=2022&corpus=en&smoothing=0&case_insensitive=true',
  lego: 'https://www.lego.com/en-us/legal/notices-and-policies/fair-play'
};
const SRCMAP = [
  [/^ニコ☆プチ「小學生好きなものランキング 2025 食物篇」/, [U.nico]], [/^JTBC 2024-03-06/, [U.nate]],
  [/^學研教育總研《小学生白書》2025 年 11 月調查/, { row: /gakken\.jp\/kyouikusouken\/whitepaper\/202511\//, home: 'https://www.gakken.jp/kyouikusouken/whitepaper/202511/' }],
  [/^學研《小学生白書》2025 調查$/, [U.gk7]], [/^兒福聯盟 學童飲食調查記者會/, [U.kids]], [/HugKum/, [U.hug]],
  [/^Yahoo! ニュース 2026-03-16/, [U.yj]], [/^TVBS 2026-05-22/, [U.tvbs26]], [/^小學館 2025 小學生年度趨勢調查/, [U.sg]],
  [/^ニフティキッズ「シール」/, [U.ovo]], [/^共同通信 OVO/, [U.ovo]], [/^萬代/, [U.bandai]],
  [/^教育部 112 年/, [U.cna]], [/^中央社 2024-09-02/, [U.cna]], [/^巴哈姆特/, [U.baha]], [/^Kidscreen/, [U.kscr]],
  [/^Youth Sports Business Report/, [U.ysbr]], [/^Google Play 台灣 2025/, [U.gp]], [/^維基百科「Mario Kart World」/, [U.wiki]],
  [/^金車文教基金會/, [U.udn26]], [/^聯合報 2026-05-27/, [U.udn26]], [/^學研 2024-11 才藝課調查/, [U.nl]], [/^ねとらぼ報導$/, [U.nl]],
  [/^親子天下 樂讀少年調查/, [U.ob]], [/^Openbook 閱讀誌 2025-06-16/, [U.ob]],
  [/^學研教育總研《小学生白書》2024 年 11 月調查/, { row: /gakken\.jp\/kyouikusouken\/whitepaper\/202411\//, home: 'https://www.gakken.jp/kyouikusouken/whitepaper/202411/' }],
  [/^ニフティキッズ 影音/, [U.nmus]], [/コロコロコミック/, [U.coro]], [/^ニフティキッズ 寵物/, [U.npet]],
  [/^親子天下〈為什麼小學體育課要上躲避球〉/, [U.dodge]], [/^Outdoor Foundation/, [U.oia]], [/^TVBS 2024-05-17/, [U.tvbs24]],
  [/アフタースクール/, [U.npo]], [/^CITIZEN/, [U.cz]], [/^ねとらぼ「小學生女生將來想做的職業」/, [U.nlpt]],
  [/^Google Books Ngram/, [U.ngram]], [/^LEGO 官方 Fair Play/, [U.lego]]
];
/* 一個字用了哪幾份調查（；分開，但括號裡的；不算），每一份配上網址 */
function srcOf(w) {
  const row = ROW.find(l => l.split('|')[3].trim().toLowerCase() === w.en.toLowerCase()) || '';
  const urls = (row.match(/https?:\/\/[^\s<|）)：*]+/g) || []);
  const parts = []; let cur = '', dep = 0;
  for (const ch of String(w.ev && w.ev.s || '')) {
    if (ch === '（' || ch === '(') dep++; if (ch === '）' || ch === ')') dep--;
    if (ch === '；' && dep <= 0) { parts.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts.map(s => {
    const m = SRCMAP.find(x => x[0].test(s));
    if (!m) return { s, u: [] };
    let u = Array.isArray(m[1]) ? m[1] : urls.filter(x => m[1].row.test(x));
    /* 那一列沒有寫到那一頁的網址：放這份白書的官方首頁（同一份調查，只是不是那一頁） */
    if (!u.length && m[1].home) u = [m[1].home];
    return { s, u: [...new Set(u)] };
  });
}
function pop(w) {   /* 小的先排：台灣的證據先，再看別的國家；同一層裡有名次的照名次、名次一樣比百分比；只有百分比的照百分比；只有一句話的放後面；老師選的字最後 */
  const b = (w.ev && w.ev.bars) || [];
  if (b.some(x => x.tp)) return [9, 0];
  const tier = w.ev && w.ev.flag === 'tw' ? 0 : 1;
  const rk = b.filter(x => x.rk).map(x => x.rk), p = b.filter(x => x.p).map(x => x.p);
  const P = p.length ? Math.max(...p) : 0;
  if (rk.length) return [tier, Math.min(...rk) * 1000 - P];
  if (p.length) return [tier, 500000 - P * 1000];
  return [tier, 900000];
}
const CATORD = { i1: ['美食', '零食', '水果', '飲料', '玩具'], i2: ['3C', '電玩', '手遊', '球類', '書', '漫畫', '生活愛用品'],
  a1: ['球類運動', '個人運動', '才藝', '戶外玩耍'], a2: ['3C 和電玩', '競賽', '靜態活動', '家裡的活動', '假日出遊'] };
const CATIC = { 美食: '🍔', 零食: '🍿', 水果: '🍓', 飲料: '🧋', 玩具: '🧸', '3C': '📱', 電玩: '🎮', 手遊: '📲', 球類: '⚽', 書: '📚', 漫畫: '💭',
  生活愛用品: '🎒', 球類運動: '🏀', 個人運動: '🏊', 才藝: '🎹', 戶外玩耍: '🌳', '3C 和電玩': '🕹️', 競賽: '🏆', 靜態活動: '🎧', 家裡的活動: '🏠', 假日出遊: '🎡' };
const GROUP = [['i1', '🍟', '物品 1', 'I like ___.'], ['i2', '🎮', '物品 2', 'I like ___.'], ['a1', '⛹️', '活動 1', 'I like to ___.'], ['a2', '🎧', '活動 2', 'I like to ___.']];

function build(WORDS, DATA) {
  const syl = w => w.en.split(/\s+/).reduce((a, x) => { const d = DATA[x.toLowerCase()]; return a + (d ? d.length : Math.max(1, (x.match(/[aeiouy]+/gi) || []).length)); }, 0);
  const lv = n => n <= 2 ? 0 : n === 3 ? 1 : 2;
  const LV = ['⭐ 簡單', '⭐⭐ 中等', '⭐⭐⭐ 難'];
  const chip = (w, k) => '<a class="w" href="' + w.f + '.html">' + (k != null ? '<span class="rk">' + k + '</span>' : '') +
    '<span class="i">' + w.ic + '</span><b>' + w.en + '</b><em>' + w.zh.replace(/\s+/g, '') + '</em></a>';
  const miss = [];
  const pane = (g) => {
    const L = WORDS.filter(w => w.g === g);
    const cats = CATORD[g].filter(c => L.some(w => w.cat === c));
    L.forEach(w => { if (cats.indexOf(w.cat) < 0) throw new Error('review1 首頁：' + w.en + ' 的類別 ' + w.cat + ' 沒有排順序（CATORD）'); });
    const A = cats.map(c => {
      const ws = L.filter(w => w.cat === c).sort((a, b) => { const x = pop(a), y = pop(b); return x[0] - y[0] || x[1] - y[1]; });
      const S = {};
      ws.forEach(w => srcOf(w).forEach(x => { if (!x.u.length) miss.push(w.en + '：' + x.s); S[x.s] = S[x.s] || new Set(); x.u.forEach(u => S[x.s].add(u)); }));
      return '<section class="cat"><h3><span>' + (CATIC[c] || '•') + '</span>' + c + '<i>' + ws.length + ' 個・最受歡迎的排前面</i></h3>' +
        '<div class="ws">' + ws.map((w, k) => chip(w, k + 1)).join('') + '</div>' +
        '<details class="ev"><summary>📊 證據（' + Object.keys(S).length + ' 份調查）</summary><ul>' +
        Object.keys(S).map(s => '<li>' + s + [...S[s]].map(u => '<br><a href="' + u + '" target="_blank" rel="noopener">' + u.replace(/^https?:\/\//, '').slice(0, 70) + (u.length > 78 ? '…' : '') + '</a>').join('') + '</li>').join('') +
        '</ul></details></section>';
    }).join('');
    const B = [0, 1, 2].map(n => {
      const ws = L.filter(w => lv(syl(w)) === n).sort((a, b) => a.en.toLowerCase().localeCompare(b.en.toLowerCase()) || syl(a) - syl(b) || a.en.length - b.en.length);
      if (!ws.length) return '';
      return '<section class="cat"><h3><span>' + LV[n].split(' ')[0] + '</span>' + LV[n].split(' ')[1] + '<i>' + ws.length + ' 個・A～Z</i></h3><div class="ws">' +
        ws.map(w => chip(w)).join('') + '</div></section>';
    }).join('');
    return '<div class="pane" data-g="' + g + '"><div class="m m0">' + A + '</div><div class="m m1">' + B + '</div></div>';
  };
  const body = GROUP.map(x => pane(x[0])).join('');
  if (miss.length) throw new Error('review1 首頁：這些調查在查證檔裡對不到網址\n' + miss.join('\n'));
  return `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Review 1 單字卡</title>
<!-- 本檔由 review1/_index.js 產生（node review1/_build.js），不要手改。 -->
<style>
@font-face{font-family:Andika;font-weight:400;src:url(../words/fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-weight:700;src:url(../words/fonts/andika-700.woff2) format("woff2")}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;background:#000;color:#F2F2F2;font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif;
 padding:clamp(10px,2vh,22px) clamp(12px,3vw,32px) 90px;display:flex;flex-direction:column;align-items:center}
h1{margin:0 0 6px;font-size:clamp(24px,4vh,38px);text-align:center}
.r1i{width:1em;height:1em;vertical-align:middle}
nav.g,nav.md{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:6px 0}
nav button,nav a{font-family:inherit;font-size:clamp(16px,2.4vh,21px);background:#141414;border:1px solid #333;color:#E8E8E8;
 border-radius:14px;padding:9px 16px;cursor:pointer;text-decoration:none;min-height:46px;display:inline-flex;align-items:center;gap:6px}
nav button.on{background:#22303A;border-color:#9FB4C8;color:#fff;font-weight:700}
nav.md button.on{background:#9FB4C8;color:#000}
.say{color:#9FB4C8;font-size:clamp(14px,2vh,18px);margin:2px 0 8px}
.pane{display:none;width:100%;max-width:1100px}.pane.on{display:block}
.m{display:none}.pane.m0on .m0,.pane.m1on .m1{display:block}
.cat{border:1px solid #1F1F1F;border-radius:16px;background:#070707;padding:10px 12px;margin:10px 0}
.cat h3{margin:0 0 8px;display:flex;align-items:baseline;gap:8px;font-size:clamp(19px,2.8vh,26px);color:#FFD66B}
.cat h3 i{font-style:normal;font-size:clamp(12px,1.7vh,15px);color:#8E8E8E;font-weight:400}
.ws{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,190px),1fr));gap:8px}
.w{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;text-decoration:none;color:#F2F2F2;
 background:#101010;border:1px solid #2A2A2A;border-radius:14px;padding:10px 6px 8px}
.w:active{transform:scale(.97)}
.w .i{font-size:clamp(30px,4.4vh,40px);line-height:1.1}
.w b{font-size:clamp(18px,2.6vh,24px);text-align:center}
.w em{font-style:normal;color:#9FB4C8;font-size:clamp(14px,2vh,17px)}
.w .rk{position:absolute;top:6px;left:8px;font-size:13px;color:#FFD66B;font-weight:700}
.ev{margin-top:8px;font-size:clamp(13px,1.8vh,15px);color:#B8B8B8}
.ev summary{cursor:pointer;color:#9FB4C8;font-size:clamp(14px,2vh,17px)}
.ev ul{margin:6px 0 0;padding-left:20px;line-height:1.5}
.ev a{color:#7FA7C9;word-break:break-all}
#bar{position:fixed;left:0;right:0;bottom:0;display:flex;justify-content:center;gap:10px;padding:10px;background:linear-gradient(180deg,transparent,#000 40%)}
#bar a{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;text-decoration:none;font-size:16px;padding:11px 20px}
</style></head><body>
<h1>🃏 Review 1 單字卡</h1>
<nav class="g">${GROUP.map((x, k) => '<button data-g="' + x[0] + '"' + (k ? '' : ' class="on"') + '>' + x[1] + ' ' + x[2] + '（' + WORDS.filter(w => w.g === x[0]).length + '）</button>').join('')}<a href="games.html">🕹️ 遊戲</a></nav>
<nav class="md"><button data-m="0" class="on">📊 依性質分類（最受歡迎先）</button><button data-m="1">🔤 A～Z（先簡單後難）</button></nav>
<div class="say" id="say"></div>
${body}
<nav id="bar"><a href="../index.html">🏠 總首頁</a></nav>
<script>
(function(){var G='i1',M=0,SAY=${JSON.stringify(Object.fromEntries(GROUP.map(x => [x[0], x[3]])))};
 function set(){[].forEach.call(document.querySelectorAll('.pane'),function(p){var on=p.getAttribute('data-g')===G;p.classList.toggle('on',on);p.classList.toggle('m0on',M===0);p.classList.toggle('m1on',M===1)});
  [].forEach.call(document.querySelectorAll('nav.g button'),function(b){b.classList.toggle('on',b.getAttribute('data-g')===G)});
  [].forEach.call(document.querySelectorAll('nav.md button'),function(b){b.classList.toggle('on',+b.getAttribute('data-m')===M)});
  document.getElementById('say').textContent='句型：'+SAY[G];
  try{history.replaceState(null,'','#'+G+'-'+M)}catch(e){}}
 var m=/#(i1|i2|a1|a2)-([01])/.exec(location.hash);if(m){G=m[1];M=+m[2]}
 document.querySelector('nav.g').addEventListener('click',function(e){var b=e.target.closest('button');if(b){G=b.getAttribute('data-g');set()}});
 document.querySelector('nav.md').addEventListener('click',function(e){var b=e.target.closest('button');if(b){M=+b.getAttribute('data-m');set()}});
 set()})();
</script></body></html>`;
}
module.exports = { build, srcOf, pop };
