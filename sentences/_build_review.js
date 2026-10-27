/* sentences/_build_review.js — 「三年級複習」「四年級複習」兩個獨立網站（使用者 2026-10-03 指定）
 *
 *   node sentences/_build_review.js        （兩個都做；sentences/_build.js 和 G3 的 _build.js 最後也會跑）
 *
 * 給學生在家複習 Unit 1、Unit 2 的句型和句型替換單字。網址：g3-review/、g4-review/（各自獨立）。
 * 網站上不出現「精簡版」三個字（使用者指定）。首頁三區：① 句型（進階句型、中英語序、縮寫動畫）② 遊戲（三種）③ 補充（單字結構、單字故事）。
 *   句型頁：u1.html／u2.html（卡片引擎同一套，資料在各自 _data.js 的 RPAGES）
 *   遊戲頁：games.html（遊戲引擎同一套，GAMES_ONLY 只放挑出來的三種；網址 #g3 直接開那一個遊戲）
 * 為什麼挑這三種遊戲（2026-10-03，使用者同意）：
 *   🧩 語序大挑戰：要自己把整句排出來（不是認得而已），中文「誰／什麼」在最後、英文 Who／What 在最前面，是最常錯的地方。
 *   🎧 聽力狙擊：在家沒有老師唸，聽得懂才會用；每一題都是預錄的美式發音。
 *   三年級 🗂 問名字還是問幾歲：Unit 1、Unit 2 最常答錯的就是「問什麼答什麼」。
 *   四年級 🔄 變身術：直述句 ⇄ 問句（is 跑到最前面）是 Unit 2 的核心。
 *   沒選：閃電四選一、記憶配對、填空偏「認得」；火眼金睛、魔王挑戰比較難，在家沒有老師解說容易卡住。
 * 2026-10-16 C4 第 8 題（老師照建議）：再放三種 ➜ 三年級 🙋 I 還是 My、🪄 縮寫變身術、⚡ 閃電四選一；四年級 🔵 他還是她、🗂 分類大師、⚡ 閃電四選一。
 * 2026-10-16 C4 第 7 題：首頁多一區「📘 Review 1」（r1.html 句型卡、r1/ 字卡＋遊戲，見 r1Home）；四年級〔💼 職業單字網站 ↗〕（那個網站不動）。
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const NAMETAG = require('./_nametag').TAG;
const { SITES, topics, FUN_ON } = require('./_review_sites.js');
/* 2026-10-27 第三十次 2-(1)：📅 今日任務、📈 我的 進步 暫時 下架（老師）；檔案 照樣 產生，要 放回來 改成 true */
const TODAY_ON = false;
function indexHTML(S, META) {
  const T = topics(S), lk = href => { const x = T.filter(o => o.href === href)[0]; if (!x) throw new Error('在家複習首頁的 ' + href + ' 沒有〔🔒 開關〕代號'); return x.k; };
  const btn = (href, ic, t, d) => '<a class="b" data-lk="' + lk(href) + '" href="' + href + '"><span class="i">' + ic + '</span><span class="x"><b>' + t + '</b>' + (d ? '<em>' + d + '</em>' : '') + '</span></a>';
  return `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${S.g}</title>
<!-- 本檔由 sentences/_build_review.js 產生，不要手改。 -->
<style>
@font-face{font-family:Andika;font-weight:400;src:url(../words/fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-weight:700;src:url(../words/fonts/andika-700.woff2) format("woff2")}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;background:#000;color:#F2F2F2;font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif;
 padding:clamp(12px,2.4vh,26px) clamp(14px,3vw,32px) 80px;display:flex;flex-direction:column;align-items:center}
h1{margin:0 0 clamp(8px,1.6vh,16px);font-size:clamp(28px,5vh,46px);letter-spacing:.06em}
section{width:100%;max-width:1000px;border:1px solid #1F1F1F;border-radius:20px;background:#070707;padding:clamp(10px,1.6vh,16px);margin-bottom:clamp(10px,1.6vh,16px)}
h2{margin:0 0 10px;font-size:clamp(21px,3.2vh,30px);color:#FFD66B;display:flex;align-items:center;gap:10px}
h2 span{display:inline-flex;align-items:center;justify-content:center;width:1.5em;height:1.5em;border-radius:50%;background:#1A2530;color:#9FB4C8;font-size:.8em}
.u{margin:6px 0 12px}.u h3{margin:0 0 8px;font-size:clamp(17px,2.5vh,22px);display:flex;align-items:center;gap:8px}
.u h3 svg{height:1.1em;width:auto}
.g{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:10px}
.b{display:flex;align-items:center;gap:10px;text-decoration:none;color:#F2F2F2;background:#111;border:1px solid #2E2E2E;border-radius:16px;
 padding:12px 14px;min-height:64px}
.b:active{transform:scale(.98);border-color:#9FB4C8}
.b .i{font-size:clamp(26px,4vh,36px);line-height:1}
.b .x{display:flex;flex-direction:column;gap:2px;min-width:0}
.b b{font-size:clamp(17px,2.5vh,22px)}
.b em{font-style:normal;color:#9E9E9E;font-size:clamp(13px,1.8vh,16px)}
.td2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:8px 0 14px}.tdb{display:flex;align-items:center;gap:12px;text-decoration:none;color:#fff;border-radius:20px;padding:12px 16px;min-height:84px;background:linear-gradient(135deg,#1E7A45,#0B4A28);border:3px solid #5DE89A}
.tdb.st{background:linear-gradient(135deg,#7A5A06,#3A2A04);border-color:#FFD54A}.tdb .i{font-size:clamp(34px,5vh,46px)}.tdb b{display:block;font-size:clamp(22px,3vh,30px)}.tdb em{font-style:normal;font-size:clamp(17px,2.2vh,20px);color:#E0F5E8}
@media (max-width:520px){.td2{grid-template-columns:1fr}}
#bar{position:fixed;left:0;right:0;bottom:0;display:flex;justify-content:center;padding:10px;background:linear-gradient(180deg,transparent,#000 40%)}
#bar a{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;text-decoration:none;font-size:16px;padding:11px 20px}
</style></head><body>
${require('../score/_client.js').home(S.out === 'g3-review' ? 3 : 4, '../', 'home')}
<h1>🏠 ${S.g}</h1>
<!-- 2026-10-27 第三十次 2-(1)：老師「暫時下架」➜ TODAY_ON ＝ false（要放回來改成 true）-->
<!-- 2026-10-26 第二十七次 第 2 點（老師 選 C30 第 2 題 1、2）：📅 今日任務（每天 5 題）、📈 我的 進步（⭐ 星星）：score/_today_build.js -->
${TODAY_ON ? `<div class="td2"><a class="tdb" href="today.html"><span class="i">📅</span><span class="x"><b>今日 任務</b><em>每天 5 題、大約 5 分鐘</em></span></a><a class="tdb st" href="stars.html"><span class="i">📈</span><span class="x"><b>我的 進步</b><em>每一個 主題 ⭐⭐⭐</em></span></a></div>` : ''}
<section><h2><span>1</span>📖 句型</h2>
${S.units.map(u => '<div class="u"><h3>' + u.ic + ' ' + u.t + '</h3><div class="g">' +
    /* 2026-10-07 對話 C（使用者需求第 5 題、Q15-A）：加基礎句型；分頁 1、2 都有〔基礎｜進階〕 */
    btn(u.f + '#t0-0', '🌱', '基礎句型 ①', u.tabs[0]) + btn(u.f + '#t0-1', '⭐', '進階句型 ①', u.tabs[0]) +
    btn(u.f + '#t1-0', '🌱', '基礎句型 ②', u.tabs[1]) + btn(u.f + '#t1-1', '⭐', '進階句型 ②', u.tabs[1]) +
    btn(u.f + '#t2', '🔀', '中英語序動畫', '中文和英文的順序不一樣') + btn(u.f + '#t3', '✂️', '縮寫動畫', '兩個字黏成一個字') + btn(u.f + '#t4', '💬', '一問一答', '一個人問、一個人答') + '</div></div>').join('')}
</section>
<section><h2><span>2</span>🎮 遊戲</h2><div class="g">
${META.map(m => btn('games.html#' + m.id, m.ic, m.name, m.rule)).join('')}
${/* 2026-10-26 第二十九次 第 3 點：🏰 守城、🎣 釣魚（fun/_build.js 做 的 castle.html、fish.html）；2026-10-27 第三十一次 暫時 下架（FUN_ON）*/ !FUN_ON ? '' : btn('castle.html', '🏰', '守城 大作戰', '答對 ＝ 大砲 打 怪物，守住 城堡') + btn('fish.html', '🎣', '英文 釣魚 大賽', '答對 ＝ 魚餌，釣 稀有 魚')}
</div></section>
${S.r1 ? `<section><h2><span>3</span>📘 Review 1</h2><div class="g">
${btn('r1/index.html', '🃏', 'Review 1 字卡', '物品、活動單字 98 張')}${btn('r1.html', '📖', 'Review 1 句型卡', '全部的句子＋📝 複習')}${btn('r1/games.html', '🎮', 'Review 1 遊戲', '20 種＋' + (S.r1 === 'x3' ? '三' : '四') + '年級進階')}
</div></section>` : ''}
<section><h2><span>${S.r1 ? 4 : 3}</span>📚 補充</h2><div class="g">
${S.more.map(x => btn(path.basename(x.from), x.ic, x.t, '')).join('')}${S.jobs ? '<a class="b" href="' + S.jobs + '"><span class="i">💼</span><span class="x"><b>職業單字網站 ↗</b><em>回來按瀏覽器〔◀ 上一頁〕</em></span></a>' : ''}
</div></section>
</body></html>`;
}
/* 2026-10-07 使用者第 12 點：學生在家複習的網站要獨立，不可以連到老師教學用的頁面 ➜ 補充的單字結構、單字故事複製一份進來。
   ① 字體、語音檔、圖片這些資源照舊用原本的檔案（相對路徑換成從複習網站算）
   ② 🏠 首頁 ➜ 回複習首頁；🔤 單字首頁、🌍 環遊世界（老師網站的頁面）藏起來
   ③ 換完以後還有任何連到別的頁面的地方 ➜ build 失敗 */
function copyIn(file, dir) {
  const sd = path.dirname(file);
  /* 2026-10-20 第十四次：src="'+變數+'"（程式裡拼出來的網址，例 rwSrc、特效引擎）不是網址，不可以換 */
  const re = u => /^(https?:|data:|#|mailto:|javascript:|')/.test(u) || !u ? u :
    encodeURI(path.relative(dir, path.resolve(sd, decodeURIComponent(u))).split(path.sep).join('/')) + (/\/$/.test(u) ? '/' : '');
  let h = fs.readFileSync(file, 'utf8');
  const nav = { '../index.html': 'index.html' };
  h = h.replace(/location\.href="([^"]+)"/g, (m, u) => 'location.href="' + (nav[u] || 'index.html') + '"');
  h = h.replace(/(?<![.\w])(src|href)="([^"]+)"/g, (m, a, u) => a + '="' + re(u) + '"')
    .replace(/url\(([^)"']+)\)/g, (m, u) => 'url(' + re(u) + ')')
    .replace(/(window\.[A-Z]+DIR=")([^"]+)"/g, (m, a, u) => a + re(u) + '"');
  h = h.replace('</head>', '<style>#fwd,#whome{display:none!important}' +
    /* 2026-10-16 C 組：〔🏠 回首頁〕金色大按鈕 */
    '#home{border:3px solid #FFD54A!important;background:#221B05!important;color:#FFE9A8!important;font-weight:700!important;font-size:clamp(18px,2.6vh,22px)!important;min-height:48px}</style>\n</head>');
  if (h.split('<button id="home">🏠 首頁</button>').length !== 2) throw new Error('複習網站的 ' + path.basename(file) + ' 找不到〔🏠 首頁〕');
  h = h.replace('<button id="home">🏠 首頁</button>', '<button id="home">🏠 回首頁</button>');
  const bad = (h.match(/(?<![.\w])href="([^"#:]+\.html)"/g) || []).concat(h.match(/location\.href="(?!index\.html")[^"]*"/g) || []);
  if (bad.length) throw new Error('複習網站的 ' + path.basename(file) + ' 還連到別的頁面：' + bad.join(' '));
  return h;
}
/* 📘 Review 1（2026-10-16 C4 第 7 題，老師選 A）：字卡（review1/ 的單字首頁＋每一張字卡）、遊戲 20 種＋自己年級的進階，複製一份進 在家複習/r1/。
   ① 字卡之間、單字首頁照舊互連（都在 r1/ 裡）；〔🏠 總首頁〕➜ 金色〔🏠 回首頁〕＝ 在家複習首頁（../index.html）
   ② 字體、語音檔照舊用 review1/ 原本的檔案（路徑換成從 r1/ 算）
   ③ 遊戲：同一個引擎（review1/_build_games.js，GAMES_OUT＋SCORE_SRC=home），代號跟教學網站一樣（成績算在一起，來源 🏠 在家）；別的年級的進階藏起來
   ④ 登入（這是您嗎、3 分鐘）、〔🔒 開關〕（字卡 r1-w、遊戲 r1-g）、看字卡算練習時間
   ⑤ 換完以後還連到 r1/ 以外的網頁（../index.html 以外）➜ build 失敗 */
/* 🎧 聽完字卡（2026-10-16 老師 C4 第 6 題 A、6-2 A；C5「1 乙」算進 📅 練習）：score/_client.js 的 scHeard(站, 第幾張, 這一站幾張, 名字)
   ① 補充頁（單字結構、單字故事）：一頁 ＝ 一站、一幕 ＝ 一張。按〔🔊 唸一次〕這一幕看得到的字全部唸完（sayAll 那種頁）／這一幕的字唸完 ＝ 聽完；
      沒有字可以唸的幕，看到就算
   ② Review 1 字卡：一組（物品 1、物品 2、活動 1、活動 2）＝ 一站、一個字 ＝ 一張。這個字的每一幕都唸完（最後一幕 ＝ 句子）＝ 聽完 */
function hdStory(k, nm) {
  return `<script>(function(){if(typeof scHeard!=='function'||typeof S==='undefined'||!window.PH)return;
 var K=${JSON.stringify(k)},NM=${JSON.stringify(nm)},N=S.length,tok=0;
 function mark(n){scHeard(K,n,N,NM)}
 function els(){return [].filter.call(stage.querySelectorAll(".phw,.sp"),function(el){return visible(el)&&!(el.parentElement&&el.parentElement.closest(".phw,.sp"))})}
 function empty(){return SAYALL?!els().length:!S[i].say}
 function got(){var my=i,t=tok;PH.after(function(){if(i===my&&t===tok)mark(my)})}
 var oc=PH.sayChain;PH.sayChain=function(e,f){var my=i,t=tok;return oc.call(PH,e,function(){if(f)f();if(SAYALL&&i===my&&t===tok)mark(my)})};
 var ow=PH.sayWord;PH.sayWord=function(el){var my=i,r=ow.apply(PH,arguments);if(!SAYALL&&el&&el.getAttribute('data-say')===S[my].say)got();return r};
 var os=PH.say;PH.say=function(t){var my=i,r=os.apply(PH,arguments);if(!SAYALL&&t===S[my].say)got();return r};
 var oh=show;show=function(){tok++;var r=oh.apply(this,arguments);if(empty())mark(i);return r};
 if(empty())mark(i);
})()</script>\n`;
}
function hdWord(k, idx, n, nm) {
  return `<script>(function(){if(typeof scHeard!=='function'||typeof SCENES==='undefined'||typeof whenDone!=='function')return;
 var seen=[],N=SCENES.length,o=say;
 function got(my){whenDone(function(){if(i!==my)return;if(seen.indexOf(my)<0)seen.push(my);if(seen.length>=N)scHeard(${JSON.stringify(k)},${idx},${n},${JSON.stringify(nm)})})}
 say=function(){var my=i,r=o.apply(this,arguments);got(my);return r};
 if(spoke)got(i);
})()</script>\n`;
}
const R1G = { i1: '物品 1', i2: '物品 2', a1: '活動 1', a2: '活動 2' };
function r1Home(S, dir) {
  const R1 = path.join(ROOT, 'review1'), out = path.join(dir, 'r1'), g = S.out === 'g3-review' ? 3 : 4, SC1 = require('../score/_client.js');
  fs.mkdirSync(out, { recursive: true });
  const rel = u => encodeURI(path.relative(out, u).split(path.sep).join('/'));
  const re = u => { if (/^(https?:|data:|#|mailto:|javascript:|')/.test(u) || !u || /^sc\.(css|js)$/.test(u)) return u;   /* sc.css／sc.js ＝ r1/ 自己的 */
    const a = path.resolve(R1, decodeURIComponent(u.replace(/[?#].*$/, '')));
    if (a === path.join(ROOT, 'index.html')) return '../index.html';
    if (path.dirname(a) === R1 && /\.html$/.test(a)) return u;
    return rel(a) + (/\/$/.test(u) ? '/' : ''); };
  const fix = (h, f) => {
    h = h.replace(/(?<![.\w])(src|href)="([^"]+)"/g, (m, a, u) => a + '="' + re(u) + '"')
      .replace(/url\(([^)"'#]+)\)/g, (m, u) => 'url(' + re(u) + ')')
      .replace(/(window\.[A-Z]+DIR=")([^"]+)"/g, (m, a, u) => a + re(u) + '"');
    const dirs = '<script>window.AUDDIR="' + rel(path.join(R1, 'audio')) + '/";window.SCLKHOME="../index.html";</script>';
    h = h.replace('<head>', () => '<head>\n' + dirs);
    const bad = (h.match(/(?<![.\w])href="(?!https?:|#)[^"]*"/g) || []).filter(x => !/^href="(\.\.\/index\.html|[\w-]+\.html|sc\.css)"$/.test(x))
      .concat((h.match(/location\.href="[^"]*"/g) || []).filter(x => !/"(\.\.\/index\.html|index\.html)"/.test(x)));
    if (bad.length) throw new Error('在家複習 r1/' + f + ' 還連到別的頁面：' + bad.join(' '));
    if (h.indexOf('<head>\n' + dirs) < 0) throw new Error('在家複習 r1/' + f + '：找不到 <head>');
    return h;
  };
  const one = (x, a, b, f) => { if (x.split(a).length !== 2) throw new Error('在家複習 r1/' + f + '：找不到 ' + a); return x.replace(a, () => b); };
  const GOLD = '#home,a.rvhome{border:3px solid #FFD54A!important;background:#221B05!important;color:#FFE9A8!important;font-weight:700!important;min-height:48px}';
  /* 遊戲 */
  const gf = path.join(out, 'games.html');
  cp.execFileSync('node', [path.join(R1, '_build_games.js')], { stdio: 'ignore', env: Object.assign({}, process.env, { GAMES_OUT: gf, SCORE_SRC: 'home' }) });
  let h = fs.readFileSync(gf, 'utf8');
  h = one(h, '<a href="../index.html">🏠 總首頁</a>', '<a class="rvhome" href="../index.html">🏠 回首頁</a>', 'games.html');
  const other = S.r1 === 'x3' ? 'x4' : 'x3';
  h = one(h, '</head>', '<style>' + require('./_route').HOMECSS.replace(/#bar a\.rvhome/g, 'nav#bar a.rvhome') +
    '.gcard[data-g="' + other + '"]{display:none!important}</style>\n<script>window.SCLKPAGE="r1-g";</script>\n</head>', 'games.html');   /* 別的年級的進階不放 */
  fs.writeFileSync(gf, fix(h, 'games.html'));
  /* 登入程式（score/_client.js 的 home）：99 頁共用一份 r1/sc.css＋r1/sc.js（不要每一頁都放一份，網站才不會太大） */
  const SH = SC1.home(g, '../', 'home', 1), SM = /^(<script src="[^"]+"><\/script>)\n<style>\n([\s\S]*?)<\/style>\n<script>\n([\s\S]*)<\/script>\n$/.exec(SH);
  if (!SM) throw new Error('在家複習 r1/：score/_client.js 的 home() 變了，拆不開');
  fs.writeFileSync(path.join(out, 'sc.css'), SM[2]); fs.writeFileSync(path.join(out, 'sc.js'), SM[3]);
  const SCTAG = SM[1] + '\n<link rel="stylesheet" href="sc.css">\n<script src="sc.js"></script>\n';
  /* 單字首頁＋每一張字卡 */
  const files = fs.readdirSync(R1).filter(f => /\.html$/.test(f) && f !== 'games.html');
  const WL = require(path.join(R1, '_data.js')).WORDS;
  if (files.length < 99) throw new Error('在家複習 r1/：review1/ 的字卡只有 ' + files.length + ' 個檔');
  files.forEach(f => {
    let x = fs.readFileSync(path.join(R1, f), 'utf8');
    x = f === 'index.html' ? one(x, '<a href="../index.html">🏠 總首頁</a>', '<a class="rvhome" href="../index.html">🏠 回首頁</a>', f)
      : one(x, '<span class="blb">總首頁</span>', '<span class="blb">回首頁</span>', f);
    x = one(x, '</head>', '<style>' + GOLD + '</style>\n</head>', f);
    const wd = WL.filter(w => w.f + '.html' === f)[0], wg = wd ? WL.filter(w => w.g === wd.g) : null;
    if (f !== 'index.html' && !wd) throw new Error('在家複習 r1/' + f + '：review1/_data.js 找不到這個字（聽完字卡要知道它在哪一組）');
    x = one(x, '</body>', '<script>window.SCLKPAGE="r1-w"</script>\n' + SCTAG + "<script>scViewOn('r1w','👀 Review 1 字卡')</script>\n" +
      (wd ? hdWord('r1w-' + wd.g, wg.indexOf(wd), wg.length, '🎧 聽完字卡 Review 1・' + R1G[wd.g]) : '') + '</body>', f);
    fs.writeFileSync(path.join(out, f), fix(x, f));
  });
  return files.length;
}
SITES.forEach(S => {
  const dir = path.join(ROOT, S.out);
  fs.mkdirSync(dir, { recursive: true });
  const src = path.join(ROOT, S.src);
  const G = require(path.join(src, '_game_data'));
  const META = S.games.map(id => G.GAMES.filter(m => m.id === id)[0]);
  /* 遊戲頁：同一個引擎，只放三種；語音檔路徑換回那一課的 audio/ */
  const rel = path.relative(dir, src).split(path.sep).map(encodeURIComponent).join('/') + '/';
  const fix = path.join(dir, '_fix.tmp.js');
  fs.writeFileSync(fix, 'module.exports=h=>h;');
  cp.execFileSync('node', [path.join(__dirname, '_build_games.js')], { stdio: 'ignore', env: Object.assign({}, process.env, {
    SITE_DIR: src, GAMES_ONLY: S.games.join(','), GAMES_OUT: path.join(dir, 'games.html'), GAMES_TITLE: S.g + '｜遊戲',
    SCORE_SRC: 'home' }) });   /* 2026-10-08 對話 D：在家複習的遊戲也記成績（來源 🏠 在家，代號跟教學網站同一個遊戲一樣） */
  fs.unlinkSync(fix);
  let h = fs.readFileSync(path.join(dir, 'games.html'), 'utf8');
  const tag = '<script src="' + rel + 'audio/aud.js" onerror="window.AUD=null"></script><script>window.AUDDIR="' + rel + 'audio/";</script>';
  h = h.indexOf('<script src="audio/aud.js"></script>') >= 0 ? h.replace('<script src="audio/aud.js"></script>', tag) : h.replace('</head>', tag + '\n</head>');
  /* 2026-10-16 C 組：學生找不到回首頁 ➜ 下面按鈕列那一顆改成金色大按鈕〔🏠 回首頁〕；標題寫真的有幾種玩法（不是 10 種） */
  const one = (x, a, b) => { if (x.split(a).length !== 2) throw new Error('在家複習遊戲頁：找不到 ' + a); return x.replace(a, () => b); };
  h = one(h, '<a href="index.html">🏠 首頁</a>', '<a class="rvhome" href="index.html">🏠 回首頁</a>');
  h = one(h, '10 種玩法', S.games.length + ' 種玩法');
  h = one(h, '</head>', '<style>' + require('./_route').CSS.replace(/#bar a\.rvhome/g, 'nav#bar a.rvhome') + '</style>\n</head>');
  h = h.split('src="avatars/').join('src="' + rel + 'avatars/').split('src=\\"avatars/').join('src=\\"' + rel + 'avatars/');
  fs.writeFileSync(path.join(dir, 'games.html'), h);
  fs.writeFileSync(path.join(dir, 'index.html'), indexHTML(S, META));
  /* 補充頁也接登入（這是您嗎、3 分鐘）和〔🔒 開關〕（2026-10-12 D 第 6、7 件）：SCLKPAGE ＝ 這一頁的代號 */
  const T = topics(S), SC1 = require('../score/_client.js');
  S.more.forEach(x => { const f = path.basename(x.from), k = T.filter(o => o.href === f)[0].k.replace(/^g\drv_/, '');
    fs.writeFileSync(path.join(dir, f), copyIn(path.join(ROOT, x.from), dir).replace('</body>', () => '<script>window.SCLKPAGE=' + JSON.stringify(k) + '</script>\n' + SC1.home(S.out === 'g3-review' ? 3 : 4, '../', 'home', 1) + "<script>scViewOn('mo','👀 補充頁')</script>\n" + hdStory(k, '🎧 聽完字卡 ' + x.t) + '</body>')); });
  const r1n = S.r1 ? r1Home(S, dir) : 0;
  console.log(S.g + '：' + S.out + '/index.html、u1.html、u2.html、games.html（' + S.games.join('、') + '）' + (r1n ? '、r1.html、r1/（' + r1n + ' 頁＋遊戲）' : ''));
});
/* 2026-10-26 第二十七次：📅 今日任務、📈 我的 進步 */
require('../score/_today_build.js').build();
