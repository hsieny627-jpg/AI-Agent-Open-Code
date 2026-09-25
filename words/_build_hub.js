/* words/_build_hub.js — 首頁的產生器（產出專案根目錄的 index.html）
 *
 * 使用者 2026-09-20 指定：這一頁一律叫「首頁」，不再叫「課堂總入口」。
 *
 * 用法： node words/_build_hub.js
 *
 * 為什麼要這一頁（使用者 2026-09-19 指定，CLAUDE.md 待辦第 1 項）：
 * 各頁原本各自獨立，老師上課要記一堆網址。這一頁把整套課程照**上課順序**排好，
 * 老師只要記一個網址、一個 QR code：
 *   https://hsieny627-jpg.github.io/AI-Agent-Open-Code/
 * 其他每一頁右下角都有一顆「🏠 首頁」連回這裡（使用者 2026-09-20 指定）。
 *
 * 界線（不要跨過去）：
 *  - **這是一頁純連結頁**，只放連結與一句說明，不放任何教學內容。
 *  - **不要去改 `family-time-machine-ipad.html`**。那支 84KB 單檔 app 本來就能跑，
 *    動它風險高、花的額度也最多。總入口只是連過去。
 *  - 17 個單字的清單讀 `words/_words.json`（由 `_build.js` 產出），
 *    所以**新增或刪掉單字，跑一次 _build.js 再跑本檔就同步了**，不會走鐘。
 *
 * 版面規則：關著的時候（老師投影出來的樣子）**不可以出現捲軸**；
 * 按開「17 張單字卡」之後可以往下捲。`_verify.js` 會照這個規則量。
 */
const fs = require('fs'), path = require('path');
const DIR = __dirname, ROOT = path.join(__dirname, '..');
const WORDS = JSON.parse(fs.readFileSync(path.join(DIR, '_words.json'), 'utf8'));

/* 上課順序。href 一律相對於專案根目錄。 */
const STEPS = [
 { n: '1', ic: '🎯', t: '暖身 20 題', href: 'words/quiz.html',
   d: '四選一，倒數 50 秒，小組討論後作答。6 題挑戰題 分數 ✕ 2' },
 { n: '2', ic: '📖', t: '家人單字時光機', href: 'family-time-machine-ipad.html',
   d: '主課程：17 站「學習」＋「遊戲」兩種模式' },
 { n: '3', ic: '🃏', t: '17 張單字卡', href: '#cards',
   d: '一個單字一張卡，翻卡換頁。點這裡展開' },
 { n: '4', ic: '🌳', t: 'family tree 家庭樹', href: 'words/family-tree.html',
   d: '一次只亮一個家人。六種顯示切換：圖示／中文／英文／英＋圖／英＋中／全部' },
 { n: '5', ic: '🧩', t: '單字結構', href: 'words/parts.html',
   d: 'grand ＝ 大、hus ＝ house、-ther 是家人字的尾巴' },
 { n: '6', ic: '📜', t: '單字故事', href: 'words/why.html',
   d: '家人單字為什麼長這樣，一個字一幕' },
 { n: '7', ic: '🎬', t: 'About My Family', href: 'about-my-family/index.html',
   d: '用英文介紹我的家人（影片）' }
,
 /* 2026-09-25 使用者指定：次標題改成「四年級 Unit 1, Unit 2」 */
 { n: '8', ic: '💬', t: '英文句型　秒懂教室　四年級', href: 'sentences/index.html',
   d: 'Unit 1 Who’s he? ／ Unit 2 Is he a doctor?　暖身題 ＋ 句型卡 ＋ 10 種複習遊戲' },
 /* 2026-09-24 新增：三年級第一冊 L1＋L2（引擎跟 sentences 共用，規格在 G3 - L1 + L2/CLAUDE.md） */
 { n: '9', ic: '📛', t: '三年級 L1 ＋ L2 句型', href: 'G3%20-%20L1%20+%20L2/index.html',
   d: 'Unit 1 What’s your name? ／ Unit 2 How old are you?　句型卡 ＋ 遊戲 ＋ 🔢 數字單字 ＋ 👀 Sight Words' },
 /* 2026-09-25 使用者指定新增：職業單字（照家人單字的架構：字卡、結構、故事、環遊世界、出處） */
 { n: '10', ic: '💼', t: '職業單字', href: 'words/jobs.html',
   d: 'student teacher doctor farmer nurse　字卡 ＋ 結構 ＋ 故事 ＋ 環遊世界' }
];

/* 延伸與老師專用，放最下面一排小字，不搶版面 */
const EXTRA = [
 { t: '單字故事 ②', href: 'words/why-2.html' },
 { t: '更多字的故事', href: 'words/why-more.html' },
 { t: 'daughter 的 gh', href: 'words/daughter-gh.html' },
 { t: '哥哥還是弟弟', href: 'words/older-younger.html' },
 { t: '家庭樹 進階版（親戚）', href: 'words/family-tree-2.html' },
 { t: '🌍 家人單字環遊世界', href: 'words/world.html' }
];
const TEACHER = [
 { t: '📋 Kahoot 20 題與上架說明',
   href: 'https://github.com/hsieny627-jpg/AI-Agent-Open-Code/blob/main/kahoot_20_%E9%A1%8C%E7%9B%AE%E8%88%87%E4%B8%8A%E6%9E%B6%E8%AA%AA%E6%98%8E.md' },
 { t: '🎮 暖身題試玩一題', href: 'words/quiz-demo.html' },
 { t: '💾 離線版：沒有網路也能上課', href: 'offline.html' }
];

const card = (s) => s.href === '#cards'
 ? `<button class="card" id="cardsBtn" aria-expanded="false" aria-controls="cards">
   <span class="n">${s.n}</span><span class="ic">${s.ic}</span>
   <span class="t">${s.t} <span class="caret">▾</span></span><span class="d">${s.d}</span></button>`
 : `<a class="card" href="${s.href}">
   <span class="n">${s.n}</span><span class="ic">${s.ic}</span>
   <span class="t">${s.t}</span><span class="d">${s.d}</span></a>`;

const HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>家人單字｜首頁</title>
<!-- 本檔由 words/_build_hub.js 產生，不要手改。 -->
<style>
@font-face{font-family:Andika;font-style:normal;font-weight:400;font-display:swap;
 src:url(words/fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-style:normal;font-weight:700;font-display:swap;
 src:url(words/fonts/andika-700.woff2) format("woff2")}

*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{min-height:100%}
body{margin:0;background:#000;color:#F2F2F2;
 font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif;
 display:flex;flex-direction:column;align-items:center;justify-content:center;
 padding:clamp(14px,3vh,28px) clamp(14px,3vw,30px);overflow-x:hidden}

header{text-align:center;margin-bottom:clamp(10px,2vh,20px)}
h1{margin:0;font-size:clamp(26px,4.4vh,42px);font-weight:700;letter-spacing:.04em}
.sub{margin-top:6px;font-size:clamp(13px,1.9vh,17px);color:#9FB4C8;letter-spacing:.16em}
/* 首頁網址：老師只要記這一個（使用者 2026-09-20 指定寫在畫面上） */
.url{margin-top:5px;font-size:clamp(11.5px,1.6vh,14px);color:#6F6F6F;letter-spacing:.02em}
.url b{color:#9E9E9E;font-weight:400}

/* 236px（原本 268）：第 9 張卡加進來以後，直式 iPad 排成三欄才不會有捲軸（2026-09-24 量測）
   2026-09-25 第 10 張卡（職業單字）加進來 ➜ 180px：橫的排五欄、直的排四欄，還是不會有捲軸 */
#hub{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));
 gap:clamp(9px,1.5vh,15px);width:100%;max-width:1000px}

.card{position:relative;display:flex;flex-direction:column;align-items:flex-start;
 gap:clamp(3px,.6vh,7px);text-align:left;text-decoration:none;cursor:pointer;
 background:linear-gradient(180deg,#0E0E0E 0%,#050505 100%);
 border:1px solid #2A2A2A;border-radius:18px;color:#F2F2F2;font-family:inherit;
 padding:clamp(10px,1.7vh,18px) clamp(11px,1.5vw,18px);
 min-height:clamp(100px,14vh,140px);transition:border-color .2s,transform .12s}
.card:hover{border-color:#9FB4C8}
.card:active{transform:scale(.985)}
.n{position:absolute;top:clamp(9px,1.5vh,15px);right:clamp(12px,1.6vw,18px);
 font-size:clamp(20px,3.2vh,30px);font-weight:700;color:#242424;line-height:1}
.ic{font-size:clamp(28px,4.4vh,40px);line-height:1.1}
.t{font-size:clamp(18px,2.8vh,25px);font-weight:700;letter-spacing:.02em}
.d{font-size:clamp(12.5px,1.85vh,16px);color:#9E9E9E;line-height:1.45}
.caret{color:#9FB4C8;font-size:.8em}
#cardsBtn[aria-expanded="true"] .caret{color:#F2F2F2}

#cards{display:none;grid-template-columns:repeat(auto-fit,minmax(min(100%,132px),1fr));
 gap:clamp(6px,1vh,10px);width:100%;max-width:1000px;margin-top:clamp(9px,1.5vh,15px)}
#cards.on{display:grid}
#cards a{display:flex;align-items:center;gap:8px;text-decoration:none;color:#F2F2F2;
 background:#101010;border:1px solid #2A2A2A;border-radius:13px;
 padding:clamp(8px,1.3vh,13px) clamp(9px,1.2vw,14px);min-height:52px}
#cards a:hover{border-color:#9FB4C8}
#cards .w{font-size:clamp(14px,2vh,18px);font-weight:700}
#cards .z{font-size:clamp(11px,1.5vh,13px);color:#8E8E8E;margin-left:auto}

footer{width:100%;max-width:1000px;margin-top:clamp(12px,2.2vh,22px);
 display:flex;flex-wrap:wrap;gap:8px 16px;justify-content:center;align-items:center}
footer a{color:#7E7E7E;text-decoration:none;font-size:clamp(12px,1.7vh,14.5px);
 border-bottom:1px solid #242424;padding-bottom:1px}
footer a:hover{color:#9FB4C8;border-bottom-color:#9FB4C8}
footer .sep{color:#2A2A2A;font-size:12px}
</style>
</head>
<body>
<header>
 <h1>家人單字　首頁</h1>
 <div class="sub">照順序上，從 1 到 7</div>
 <div class="url">🔗 <b>hsieny627-jpg.github.io/AI-Agent-Open-Code</b></div>
</header>

<main id="hub">
${STEPS.map(card).join('\n')}
</main>

<section id="cards">
${WORDS.map(w => `<a href="words/${w.f}.html"><span class="w">${w.f}</span><span class="z">${w.zh}</span></a>`).join('\n')}
</section>

<footer>
${EXTRA.map(x => `<a href="${x.href}">${x.t}</a>`).join('<span class="sep">·</span>\n')}
<span class="sep">|</span>
${TEACHER.map(x => `<a href="${x.href}">${x.t}</a>`).join('<span class="sep">·</span>\n')}
</footer>

<script>
(function(){
 var b=document.getElementById("cardsBtn"),g=document.getElementById("cards");
 b.addEventListener("click",function(){
  var on=g.classList.toggle("on");
  b.setAttribute("aria-expanded",on?"true":"false");
  if(on)g.scrollIntoView({block:"nearest",behavior:"smooth"});
 });
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'index.html'), HTML, 'utf8');
console.log('已產生 index.html（首頁）：' + STEPS.length + ' 個步驟 ＋ ' +
 WORDS.length + ' 張單字卡 ＋ ' + (EXTRA.length + TEACHER.length) + ' 個延伸連結');
