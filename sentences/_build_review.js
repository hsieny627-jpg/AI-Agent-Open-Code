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
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const NAMETAG = require('./_nametag').TAG;
const SITES = [
  { out: 'g3-review', src: 'G3 - L1 + L2', g: '三年級複習', games: ['g3', 'g5', 'g9'],
    units: [{ ic: NAMETAG, t: 'Unit 1　What’s your name?', f: 'u1.html', tabs: ['What’s your name?', 'My name is ___.'] },
            { ic: '🎂', t: 'Unit 2　How old are you?', f: 'u2.html', tabs: ['How old are you?', 'I’m ten years old.'] }],
    /* 補充（2026-10-07 使用者第 12 點）：複製一份進複習網站（from ＝ 老師網站的那一頁），按鈕只回複習首頁 */
    more: [{ ic: '🔢', t: '數字：單字結構', from: 'G3 - L1 + L2/numbers/numbers-parts.html' },
           { ic: '🔢', t: '數字：單字故事', from: 'G3 - L1 + L2/numbers/numbers-why.html' },
           { ic: '👀', t: 'Sight Words：單字結構', from: 'G3 - L1 + L2/sight/sight-parts.html' },
           { ic: '👀', t: 'Sight Words：單字故事', from: 'G3 - L1 + L2/sight/sight-why.html' }] },
  { out: 'g4-review', src: 'sentences', g: '四年級複習', games: ['g3', 'g4', 'g5'],
    units: [{ ic: '👪', t: 'Unit 1　Who’s he?', f: 'u1.html', tabs: ['Who’s he/she?', 'He’s/She’s my ___.'] },
            { ic: '💼', t: 'Unit 2　Is he a doctor?', f: 'u2.html', tabs: ['He/She is a ___.', 'Yes／No'] }],
    more: [{ ic: '👪', t: '家人：單字結構', from: 'words/parts.html' },
           { ic: '👪', t: '家人：單字故事', from: 'words/why.html' },
           { ic: '💼', t: '職業：單字結構', from: 'words/jobs-parts.html' },
           { ic: '💼', t: '職業：單字故事', from: 'words/jobs-why.html' }] }
];
function indexHTML(S, META) {
  const btn = (href, ic, t, d) => '<a class="b" href="' + href + '"><span class="i">' + ic + '</span><span class="x"><b>' + t + '</b>' + (d ? '<em>' + d + '</em>' : '') + '</span></a>';
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
#bar{position:fixed;left:0;right:0;bottom:0;display:flex;justify-content:center;padding:10px;background:linear-gradient(180deg,transparent,#000 40%)}
#bar a{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;text-decoration:none;font-size:16px;padding:11px 20px}
</style></head><body>
<h1>🏠 ${S.g}</h1>
<section><h2><span>1</span>📖 句型</h2>
${S.units.map(u => '<div class="u"><h3>' + u.ic + ' ' + u.t + '</h3><div class="g">' +
    btn(u.f + '#t0', '⭐', '進階句型 ①', u.tabs[0]) + btn(u.f + '#t1', '⭐', '進階句型 ②', u.tabs[1]) +
    btn(u.f + '#t2', '🔀', '中英語序動畫', '中文和英文的順序不一樣') + btn(u.f + '#t3', '✂️', '縮寫動畫', '兩個字黏成一個字') + '</div></div>').join('')}
</section>
<section><h2><span>2</span>🎮 遊戲</h2><div class="g">
${META.map(m => btn('games.html#' + m.id, m.ic, m.name, m.rule)).join('')}
</div></section>
<section><h2><span>3</span>📚 補充</h2><div class="g">
${S.more.map(x => btn(path.basename(x.from), x.ic, x.t, '')).join('')}
</div></section>
</body></html>`;
}
/* 2026-10-07 使用者第 12 點：學生在家複習的網站要獨立，不可以連到老師教學用的頁面 ➜ 補充的單字結構、單字故事複製一份進來。
   ① 字體、語音檔、圖片這些資源照舊用原本的檔案（相對路徑換成從複習網站算）
   ② 🏠 首頁 ➜ 回複習首頁；🔤 單字首頁、🌍 環遊世界（老師網站的頁面）藏起來
   ③ 換完以後還有任何連到別的頁面的地方 ➜ build 失敗 */
function copyIn(file, dir) {
  const sd = path.dirname(file);
  const re = u => /^(https?:|data:|#|mailto:|javascript:)/.test(u) || !u ? u :
    encodeURI(path.relative(dir, path.resolve(sd, decodeURIComponent(u))).split(path.sep).join('/')) + (/\/$/.test(u) ? '/' : '');
  let h = fs.readFileSync(file, 'utf8');
  const nav = { '../index.html': 'index.html' };
  h = h.replace(/location\.href="([^"]+)"/g, (m, u) => 'location.href="' + (nav[u] || 'index.html') + '"');
  h = h.replace(/(?<![.\w])(src|href)="([^"]+)"/g, (m, a, u) => a + '="' + re(u) + '"')
    .replace(/url\(([^)"']+)\)/g, (m, u) => 'url(' + re(u) + ')')
    .replace(/(window\.[A-Z]+DIR=")([^"]+)"/g, (m, a, u) => a + re(u) + '"');
  h = h.replace('</head>', '<style>#fwd,#whome{display:none!important}</style>\n</head>');
  const bad = (h.match(/(?<![.\w])href="([^"#:]+\.html)"/g) || []).concat(h.match(/location\.href="(?!index\.html")[^"]*"/g) || []);
  if (bad.length) throw new Error('複習網站的 ' + path.basename(file) + ' 還連到別的頁面：' + bad.join(' '));
  return h;
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
    SITE_DIR: src, GAMES_ONLY: S.games.join(','), GAMES_OUT: path.join(dir, 'games.html'), GAMES_TITLE: S.g + '｜遊戲' }) });
  fs.unlinkSync(fix);
  let h = fs.readFileSync(path.join(dir, 'games.html'), 'utf8');
  const tag = '<script src="' + rel + 'audio/aud.js" onerror="window.AUD=null"></script><script>window.AUDDIR="' + rel + 'audio/";</script>';
  h = h.indexOf('<script src="audio/aud.js"></script>') >= 0 ? h.replace('<script src="audio/aud.js"></script>', tag) : h.replace('</head>', tag + '\n</head>');
  h = h.split('src="avatars/').join('src="' + rel + 'avatars/').split('src=\\"avatars/').join('src=\\"' + rel + 'avatars/');
  fs.writeFileSync(path.join(dir, 'games.html'), h);
  fs.writeFileSync(path.join(dir, 'index.html'), indexHTML(S, META));
  S.more.forEach(x => fs.writeFileSync(path.join(dir, path.basename(x.from)), copyIn(path.join(ROOT, x.from), dir)));
  console.log(S.g + '：' + S.out + '/index.html、u1.html、u2.html、games.html（' + S.games.join('、') + '）');
});
