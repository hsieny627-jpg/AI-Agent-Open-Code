/* G3 - L1 + L2/_build_home.js — 這一課的首頁（index.html）
 * 版面跟 sentences 的首頁一樣（CSS 直接共用那一份），只換內容。
 */
process.env.SITE_DIR = process.env.SITE_DIR || __dirname;
const fs = require('fs'), DIR = __dirname;
const S = require('../sentences/_shared');
const { Q } = require('./_quiz_data');
const B = require('./_game_data');
const D = require('./_data');

const CSS = `
#stage{position:fixed;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch;
 display:flex;flex-direction:column;align-items:center;justify-content:center;
 padding:calc(var(--safeT) + clamp(16px,3vh,32px)) clamp(14px,3.4vw,40px)
         calc(clamp(50px,7.6vh,70px) + var(--safeB)) clamp(14px,3.4vw,40px)}
header{text-align:center;margin-bottom:clamp(10px,2vh,22px)}
h1{margin:0;font-size:clamp(25px,4.8vh,46px);font-weight:700;letter-spacing:.03em}
.sub{margin-top:6px;font-size:clamp(12.5px,1.95vh,17px);color:var(--acc);letter-spacing:.16em}
.url{margin-top:5px;font-size:clamp(11px,1.55vh,13.5px);color:#5F5F5F}
.url b{color:#8E8E8E;font-weight:400}

#menu{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,268px),1fr));
 gap:clamp(9px,1.5vh,15px);width:100%;max-width:1060px}
.card{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:clamp(3px,.6vh,7px);
 text-align:left;text-decoration:none;background:linear-gradient(180deg,#0E0E0E,#050505);
 border:1px solid #2A2A2A;border-radius:18px;color:var(--fg);
 padding:clamp(12px,2.1vh,20px) clamp(13px,1.8vw,20px);min-height:clamp(112px,16.5vh,150px)}
.card:active{transform:scale(.985);border-color:var(--acc)}
.card .n{position:absolute;top:clamp(9px,1.5vh,15px);right:clamp(12px,1.6vw,18px);
 font-size:clamp(20px,3.2vh,30px);font-weight:700;color:#232323;line-height:1}
.card .ic{font-size:clamp(27px,4.3vh,39px);line-height:1.1}
.card .t{font-size:clamp(17.5px,2.75vh,25px);font-weight:700;letter-spacing:.02em}
.card .d{font-size:clamp(12.5px,1.85vh,16px);color:var(--dim);line-height:1.45}
.card .f{margin-top:auto;font-size:clamp(11px,1.6vh,14px);color:#5C5C5C;letter-spacing:.06em}
.card.go{border-color:#2E4636}

#order{margin-top:clamp(10px,1.8vh,18px);width:100%;max-width:1060px;
 display:flex;flex-wrap:wrap;gap:clamp(5px,.9vw,10px);justify-content:center;align-items:center;
 font-size:clamp(11.5px,1.75vh,15px);color:#6A6A6A}
#order b{color:var(--acc);font-weight:400}
#order .ar{color:#333}
`;

const body = `
<main id="stage">
<header>
 <h1>三年級 英文句型　秒懂教室</h1>
 <div class="sub">第一冊　Unit 1 ・ Unit 2</div>
 <div class="url">🔗 <b>hsieny627-jpg.github.io/AI-Agent-Open-Code/G3%20-%20L1%20+%20L2/</b></div>
</header>

<nav id="menu">
 <a class="card" href="warmup.html">
  <span class="n">1</span><span class="ic">🎯</span>
  <span class="t">暖身題</span>
  <span class="d">四選一，倒數 50 秒，題目和選項每次都重新洗牌，<b>愈快答對分數愈高</b>。答錯的題目最後再考一次。</span>
  <span class="f">${Q.length} 題　其中 ${Q.filter(q => q.x2).length} 題 分數 ✕ 2</span></a>

 <a class="card" href="unit1.html">
  <span class="n">2</span><span class="ic">📛</span>
  <span class="t">Unit 1 句型</span>
  <span class="d">What’s your name?　My name is Ken.／I’m Ken.　逐字動畫、縮寫變身、中英語序、名字替換字，下面還有「📝 複習」。</span>
  <span class="f">${D.U1.length} 張字卡</span></a>

 <a class="card" href="unit2.html">
  <span class="n">3</span><span class="ic">🎂</span>
  <span class="t">Unit 2 句型</span>
  <span class="d">How old are you?　I’m eight years old.／I’m eight.　you 問 ➜ I 答、數字 6～12 替換字，下面還有「📝 複習」。</span>
  <span class="f">${D.U2.length} 張字卡</span></a>

 <a class="card go" href="games.html">
  <span class="n">4</span><span class="ic">🎮</span>
  <span class="t">複習遊戲</span>
  <span class="d">10 種玩法，<b>每一題 15 秒、愈快答對分數愈高</b>。每一個遊戲都有自己的 ${B.SURP.g1.length} 種驚喜卡，翻開會炸滿整個畫面。</span>
  <span class="f">${B.GAMES.length} 種　共 ${B.GAMES.reduce((a, g) => a + g.n, 0)} 題</span></a>
</nav>

<div id="order">
 上課順序：<b>暖身題</b><span class="ar">➜</span><b>Unit 1</b><span class="ar">➜</span>
 <b>Unit 2</b><span class="ar">➜</span><b>遊戲</b>
 <span class="ar">｜</span>暖身題老師可以跳過，直接上句型
</div>
</main>

<nav id="bar">
 <a href="../index.html">🏠 回總首頁</a>
</nav>

<script>
${S.UTIL}
${S.TTS}
</script>
</body>
</html>`;

fs.writeFileSync(DIR + '/index.html', S.HEAD('三年級 英文句型　秒懂教室', CSS) + body);
console.log('home ok');
