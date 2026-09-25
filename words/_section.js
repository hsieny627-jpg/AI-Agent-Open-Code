/* words/_section.js — 一組新單字，照「家人單字」的學習架構一次做好（使用者 2026-09-25 指定）
 *
 * 家人單字的架構 ＝ 單字卡（三幕：中文 ➜ 以前 ➜ 現在）＋ 單字結構 ＋ 單字故事 ＋ 環遊世界 ＋ 出處。
 * 職業單字（words/）、G3 的數字單字、Sight Words 都用這一支：
 *   build({
 *     dir      輸出資料夾
 *     font     字體路徑（words/ 是 'fonts/'；G3 的子資料夾是 '../../words/fonts/'）
 *     home     「🏠 首頁」連到哪裡
 *     words    單字卡（欄位跟 _build.js 的 WORDS 一樣：f zh sub icon old now e1 e2 build src）
 *     srcW     單字 ➜ 出處（跟 _sources.js 的 W 一樣）
 *     pages    故事頁（欄位跟 _build_story.js 的 PAGES 一樣，另外 srcRows ＝ 這一頁的出處）
 *     index    這一組的首頁：{ file, title, sub, links:[{ic,t,d,href}] }
 *   })
 * 樣板全部共用：改 _build.js 的 tpl()／_build_story.js 的 tpl()，全部同步。
 */
const fs = require('fs'), path = require('path');
const { buildSet } = require('./_build');
const { tpl } = require('./_build_story');

function indexHTML(o) {
  const cards = o.links.map((l, k) => l.cards
    ? `<button class="card" id="cardsBtn"><span class="n">${k + 1}</span><span class="ic">${l.ic}</span>` +
      `<span class="t">${l.t} ▾</span><span class="d">${l.d}</span></button>` +
      `<div id="cards">${l.cards.map(w => `<a href="${w.href}"><span>${w.icon}</span><b>${w.f}</b><em>${w.zh}</em></a>`).join('')}</div>`
    : `<a class="card" href="${l.href}"><span class="n">${k + 1}</span><span class="ic">${l.ic}</span>` +
      `<span class="t">${l.t}</span><span class="d">${l.d}</span></a>`).join('');
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${o.title}</title>
<!-- 本檔由 words/_section.js 產生，不要手改。 -->
<style>
@font-face{font-family:Andika;font-style:normal;font-weight:400;font-display:swap;src:url(${o.font}andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-style:normal;font-weight:700;font-display:swap;src:url(${o.font}andika-700.woff2) format("woff2")}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;background:#000;color:#F2F2F2;font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif}
body{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:clamp(14px,3vh,34px) clamp(12px,3vw,34px) 90px}
h1{margin:0;font-size:clamp(28px,5.4vh,52px);text-align:center}
.sub{margin:6px 0 clamp(12px,2.4vh,26px);color:#9FB4C8;font-size:clamp(15px,2.3vh,21px);letter-spacing:.12em;text-align:center}
#grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:clamp(8px,1.6vh,16px);width:100%;max-width:1060px}
.card{position:relative;display:flex;flex-direction:column;gap:4px;text-align:left;background:linear-gradient(180deg,#0E0E0E,#050505);
 border:1px solid #272727;border-radius:20px;color:#F2F2F2;text-decoration:none;font-family:inherit;cursor:pointer;
 padding:clamp(12px,2vh,20px) clamp(14px,1.8vw,22px);min-height:clamp(110px,16vh,150px)}
.card:active{transform:scale(.985)}
.card .n{position:absolute;top:10px;right:16px;font-size:clamp(20px,3.2vh,30px);font-weight:700;color:#262626}
.card .ic{font-size:clamp(30px,5vh,46px);line-height:1.1}
.card .t{font-size:clamp(20px,3.2vh,28px);font-weight:700}
.card .d{font-size:clamp(14px,2vh,18px);color:#9E9E9E;line-height:1.45}
#cards{display:none;grid-column:1/-1;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
#cards.on{display:grid}
#cards a{display:flex;flex-direction:column;align-items:center;gap:2px;background:#0C0C0C;border:1px solid #2A2A2A;border-radius:14px;
 color:#F2F2F2;text-decoration:none;padding:10px 6px}
#cards a span{font-size:30px}#cards a b{font-size:clamp(18px,2.6vh,24px)}#cards a em{font-style:normal;color:#9FB4C8;font-size:15px}
#bar{position:fixed;left:0;right:0;bottom:0;display:flex;justify-content:center;gap:10px;padding:12px;background:linear-gradient(180deg,transparent,#000 40%)}
#bar a{background:#1E1E1E;border:1px solid #4A4A4A;color:#F2F2F2;border-radius:99px;text-decoration:none;font-size:16px;padding:11px 20px}
</style>
</head>
<body>
<h1>${o.title}</h1>
<div class="sub">${o.sub}</div>
<div id="grid">${cards}</div>
<nav id="bar"><a href="${o.home}">🏠 首頁</a></nav>
<script>
(function(){var b=document.getElementById("cardsBtn"),c=document.getElementById("cards");if(!b||!c)return;
 b.addEventListener("click",function(){c.classList.toggle("on")});})();
</script>
</body>
</html>
`;
}

function build(o) {
  fs.mkdirSync(o.dir, { recursive: true });
  const WL = buildSet(o.words, { dir: o.dir, font: o.font, home: o.home, srcW: o.srcW, title: o.suffix, head: o.head || '' });
  o.pages.forEach(p => fs.writeFileSync(path.join(o.dir, p.file),
    tpl(Object.assign({ font: o.font, home: o.home, suffix: o.suffix, svjs: o.svjs || '' }, p)), 'utf8'));
  if (o.index) {
    const links = o.index.links.map(l => l.cards === true ? Object.assign({}, l, { cards: WL.map(w => ({ f: w.f, zh: w.zh, icon: w.icon, href: w.f + '.html' })) }) : l);
    fs.writeFileSync(path.join(o.dir, o.index.file), indexHTML(Object.assign({ font: o.font, home: o.home }, o.index, { links })), 'utf8');
  }
  return [o.index ? o.index.file : null].concat(WL.map(w => w.f + '.html'), o.pages.map(p => p.file)).filter(Boolean);
}
module.exports = { build };
