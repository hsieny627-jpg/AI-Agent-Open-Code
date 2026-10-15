// 產生 listen/2026-10-13_D10/index.html（D 組第 8 件 用心程度：名字、圖示、要關心格子、平板動畫、再問 D9 第 2、3 題）
// 用法：node listen/2026-10-13_D10/_gen.js listen/2026-10-13_D10/index.html
const fs = require('fs'), SP = __dirname + '/../2026-10-12_D6';
const head = fs.readFileSync(SP + '/head.html', 'utf8').replace(/\n<style>\n/, '\n');

/* 自己畫的圖示（取代 🐢 ✨ 🕒；用心程度＝愛心獎牌） */
const EYE = (h) => `<svg viewBox="0 0 200 100" style="height:${h};vertical-align:middle" aria-label="看完、聽完"><path d="M8 50Q50 6 92 50Q50 94 8 50Z" fill="#fff" stroke="#333" stroke-width="5"/><circle cx="50" cy="50" r="17" fill="#2F7BE8"/><circle cx="50" cy="50" r="8" fill="#111"/><circle cx="55" cy="44" r="4" fill="#fff"/><path d="M122 52C118 14 182 8 186 46C188 70 162 70 160 88C158 100 138 100 134 88" fill="#FFD3B0" stroke="#B86B3C" stroke-width="6" stroke-linecap="round"/><path d="M142 48C142 30 168 28 168 46C168 58 154 56 154 68" fill="none" stroke="#B86B3C" stroke-width="6" stroke-linecap="round"/></svg>`;
const FIX = (h) => `<svg viewBox="0 0 200 100" style="height:${h};vertical-align:middle" aria-label="答錯的改對了"><circle cx="38" cy="50" r="32" fill="#E8453C"/><path d="M26 38l24 24M50 38L26 62" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M80 50h34" stroke="#FFD54A" stroke-width="9" stroke-linecap="round"/><path d="M108 36l16 14-16 14z" fill="#FFD54A"/><circle cx="162" cy="50" r="32" fill="#2EB85C"/><path d="M146 51l11 11 21-23" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CLK = (h) => `<svg viewBox="0 0 100 100" style="height:${h};vertical-align:middle" aria-label="時鐘"><circle cx="50" cy="50" r="44" fill="#FFF8E6" stroke="#FFB300" stroke-width="8"/>${[0,90,180,270].map(a=>`<rect x="48" y="12" width="4" height="10" fill="#8A5A00" transform="rotate(${a} 50 50)"/>`).join('')}<rect x="47" y="24" width="6" height="28" rx="3" fill="#333"/><rect x="47" y="34" width="6" height="18" rx="3" fill="#D84315" transform="rotate(60 50 50)"/><circle cx="50" cy="50" r="6" fill="#333"/></svg>`;
const HRT = (h) => `<svg viewBox="0 0 120 150" style="height:${h};vertical-align:middle" aria-label="最用心"><path d="M30 0h22l18 52H48z" fill="#2F7BE8"/><path d="M90 0H68L50 52h22z" fill="#E8453C"/><circle cx="60" cy="95" r="46" fill="#B8860B"/><circle cx="60" cy="95" r="40" fill="#FFC928"/><path d="M60 122C30 102 34 74 48 72C55 71 59 76 60 80C61 76 65 71 72 72C86 74 90 102 60 122Z" fill="#E8453C" stroke="#FFFDF0" stroke-width="4" stroke-linejoin="round"/></svg>`;
const CAL = '📅', TST = '📝';

/* 五項（名字、圖示、小華的例子） */
const ITEMS = [
  { o: '📅 分天練', ic: (h) => `<span style="font-size:${h}">${CAL}</span>`, n: '這週 練了 幾天', full: '4 天以上', minus: '少 1 天 −5 分', x: '3 天', s: 15, tip: '請 這週 再多 1 天 來練習' },
  { o: '📝 自己考自己', ic: (h) => `<span style="font-size:${h}">${TST}</span>`, n: '做完 幾次 題目、遊戲', full: '5 次以上', minus: '少 1 次 −4 分', x: '6 次', s: 20, tip: '請 再做完 1 次' },
  { o: '🐢 不亂按', ic: EYE, n: '看完、聽完 才選', full: '太快亂按 0 題', minus: '太快亂按 每多 5% −4 分', x: '100 題裡 5 題太快亂按（5%）', s: 16, tip: '請 看完、聽完 再選' },
  { o: '✨ 訂正', ic: FIX, n: '答錯的 改對了', full: '答錯的 全部改對（沒有答錯 ＝ 20 分）', minus: '改對幾成 ＝ 20 ✕ 幾成', x: '答錯 5 題，改對 4 題', s: 16, tip: '請 把答錯的 再做一次' },
  { o: '🕒 真的在練', ic: CLK, n: '這週 練習 幾分鐘', full: '30 分鐘以上', minus: '照比例（15 分鐘 ＝ 10 分）', x: '48 分鐘', s: 20, tip: '請 再多練 幾分鐘' },
];
const TOT = ITEMS.reduce((a, b) => a + b.s, 0);              // 87
const WEAK = ITEMS.reduce((a, b) => (b.s < a.s ? b : a));    // 這週 練了 幾天

const css = `
.mk{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}.mk.one{grid-template-columns:1fr}
@media (max-width:900px){.mk{grid-template-columns:1fr}}
.dev{border:6px solid #3A4650;border-radius:26px;background:#000;padding:10px 12px 14px;text-align:center}
.dev.pj{border-color:#5B4A12;border-radius:8px;background:radial-gradient(circle at 50% 30%,#2A2000,#000 75%)}
.dev .lab{font-size:22px;color:#B9C4CE;text-align:left;margin-bottom:6px}
.dev .t1{font-size:36px;color:#FFE07A;line-height:1.3}.dev .t2{font-size:28px;color:#fff;line-height:1.4}.dev .t3{font-size:24px;color:#CFE3F5;line-height:1.4}
.ev td,.ev th{font-size:24px;overflow-wrap:anywhere}
.ev td.ic{white-space:nowrap;text-align:center}
@media (max-width:900px){.ev,.ev tbody,.ev tr,.ev td,.ev th{display:block;width:100%}.ev tr:first-child{display:none}.ev tr{margin-bottom:12px;border:3px solid #2A3540;border-radius:12px}.ev td.ic{text-align:left}}
.ans{background:#1A1400;border:4px solid #FFD54A;border-radius:20px;padding:14px 20px;margin:30px 0;font-size:28px}
.now{color:#FFB38A}.new{color:#9FF0B8}
.kc{display:inline-block;background:#0B1A10;border:4px solid #3BD16F;border-radius:14px;padding:8px 14px;text-align:left;min-width:220px;margin:6px}
.kc .a{font-size:26px;color:#fff}.kc .b{font-size:24px;color:#9FF0B8}.kc .c{font-size:22px;color:#FFD54A}
.cert{background:#FFF8E6;color:#3A2A00;border:10px double #C9A227;border-radius:6px;padding:12px;text-align:center}
.cert .c1{font-size:34px;color:#8A5A00}.cert .c2{font-size:26px}.cert .c3{font-size:22px;color:#6A5A3A}
/* 動畫 A：五塊拼成一個圓 */
.pie{position:relative;width:min(300px,70vw);margin:6px auto}
.pie svg{width:100%;display:block;transform:rotate(-90deg)}
.pie .num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.pie .num b{font-size:64px;color:#FFE07A;line-height:1}.pie .num span{font-size:22px;color:#CFE3F5}
.seg{fill:none;stroke-width:46;stroke-dasharray:0 1000}
.lg{display:grid;gap:6px;max-width:560px;margin:8px auto;text-align:left}
.lg div{display:grid;grid-template-columns:104px 1fr 3.4em;align-items:center;gap:8px;font-size:24px;opacity:0;transform:translateX(-30px);transition:.5s}
.lg div.on{opacity:1;transform:none}
.lg div b{text-align:right;color:#FFE07A}
.lg .wk{background:#3A1A00;border-radius:10px;animation:wk 1s ease-in-out infinite}
@keyframes wk{50%{background:#7A3A00}}
.tipx{font-size:28px;color:#FFD54A;margin-top:8px;opacity:0;transition:.6s}.tipx.on{opacity:1}
/* 動畫 B：五條長條 */
.bars{display:grid;gap:8px;max-width:600px;margin:8px auto;text-align:left}
.bars div{display:grid;grid-template-columns:104px 9.5em 1fr 3em;align-items:center;gap:8px;font-size:24px}
.bars i{display:block;height:26px;width:0;border-radius:999px;transition:width 1s ease-out}
.bars b{text-align:right;color:#FFE07A}
.sumB{font-size:40px;color:#FFE07A}
.rp{display:inline-block;background:#2A3540;color:#fff;border:0;border-radius:12px;font:inherit;font-size:24px;padding:6px 18px;margin-top:8px;cursor:pointer;min-height:48px}
@media (max-width:620px){.bars div{grid-template-columns:96px 1fr 2.6em}.bars div i{grid-column:1/-1;order:9}}
`;
const opt = (k, title, rec, body, pro, con) => `<div class="opt${rec ? ' rec' : ''}"><div class="hd"><b class="k">${k}</b>${title}${rec ? ' <span class="tag" style="display:inline-block;background:#3BD16F;color:#05210F;border-radius:999px;padding:0 14px;font-size:22px">建議</span>' : ''}</div>${body}${pro ? `<div class="pro">👍 ${pro}</div>` : ''}${con ? `<div class="con">⚠️ ${con}</div>` : ''}</div>`;
const tab = (inner, lab) => `<div class="dev"><div class="lab">📱 ${lab || '學生平板（小華 ＝ 30412）'}</div>${inner}</div>`;
const pj = (inner, lab) => `<div class="dev pj"><div class="lab">📺 ${lab}</div>${inner}</div>`;
const ba = (a, b, la, lb) => `<table class="ev"><tr><th>現在</th><th>改之後</th></tr><tr><td class="now">${la ? `<div class="small">${la}</div>` : ''}${a}</td><td class="new">${lb ? `<div class="small">${lb}</div>` : ''}${b}</td></tr></table>`;
const COL = ['#2F7BE8', '#9B59D0', '#00A6A6', '#2EB85C', '#FFB300'];

let h = head.replace('<title>榮譽榜怎麼給</title>', '<title>用心程度怎麼算</title>').replace('</style>', css + '</style></head><body><div class="wrap">');
h += `<h1>❓ 「用心程度」：再問老師 8 題</h1>
<div class="lead">老師說：五項的名字看不懂、✨ 🕒 看不懂、不喜歡 🐢、要關心格子看不懂，學生也要看懂怎麼算。<br>下面每一題都用<b>小華（30412）</b>當例子，寫出「現在 ➜ 改之後」。<b>老師選好，再用小華對一次，老師說「對」才改網站。</b></div>`;

h += `<div class="howto"><b>✅ 老師已經決定的（不用回答）</b><br>
・老師看板看得到「用心程度」。<br>
・多第 4 種最高榮譽「<b>最用心</b>」：班內前 10 名、全年級前 10 名、最用心的班（平均每一個人）。平板、投影、獎狀都有。<br>
・跟另外三種一樣：<b>名次上升才演</b>、只寫事實、不寫聰明。</div>`;

/* 1 五項的名字 */
h += `<h2>❓ 第 1 題：五項的名字（一看就懂的一句話）</h2>
<table class="ev"><tr><th>現在</th><th>圖示</th><th>改之後</th></tr>
${ITEMS.map(i => `<tr><td class="now">${i.o}</td><td class="ic">${i.ic('60px')}</td><td class="new" style="font-size:30px">${i.n}</td></tr>`).join('')}</table>
<div class="why">「分天練」「自己考自己」「真的在練」是研究的說法，學生不懂 ➜ 改成學生做的事，直接寫出來。</div>`;
h += opt('A', '照上面這張表', 1, '', '學生一看就知道要做什麼', '');
h += opt('B', '我要改（寫「第幾項 ➜ 改成什麼」）', 0, '', '', '');

/* 2 圖示 */
h += `<h2>❓ 第 2 題：換掉 🐢 ✨ 🕒</h2>`;
h += opt('A', '自己畫的', 1, `<table class="ev"><tr><th>現在</th><th>改之後</th><th>意思</th></tr>
<tr><td class="now" style="font-size:60px">🐢</td><td>${EYE('80px')}</td><td>眼睛看完、耳朵聽完</td></tr>
<tr><td class="now" style="font-size:60px">✨</td><td>${FIX('80px')}</td><td>紅色 ✗ 變成綠色 ✓</td></tr>
<tr><td class="now" style="font-size:60px">🕒</td><td>${CLK('80px')}</td><td>老師 D8 選的時鐘（跟「這週 練習 48 分鐘」同一個）</td></tr></table>`, '一看就懂；時鐘全站同一個', '');
h += opt('B', '換成別的表情符號', 0, `<div style="font-size:60px">👀　✅　⏰</div>`, '', '👀 只有看、沒有聽；✅ 看不出「本來錯」；⏰ 跟網站的時鐘不一樣');
h += opt('C', '不要圖示，只寫字', 0, '', '', '');

/* 3 用心程度的圖示＋最用心獎 */
h += `<h2>❓ 第 3 題：「用心程度」和「最用心」的圖示</h2>
<div class="why">另外三種獎都有圖示：最認真練習 ＝ 獎牌上面有星星、成績最優 ＝ 🎯、進步最多 ＝ 綠色箭頭。現在用心程度是 👆（老師說「👆 82」看不懂）。</div>`;
h += opt('A', '自己畫的：獎牌上面有愛心', 1, `<div style="text-align:center">${HRT('150px')}</div>`, '跟「最認真練習」的獎牌同一種畫法；愛心 ＝ 用心', '');
h += opt('B', '💖', 0, `<div style="font-size:90px;text-align:center">💖</div>`, '', '跟另外三個獎不像同一套');
h += opt('C', '👆（照現在）', 0, `<div style="font-size:90px;text-align:center">👆</div>`, '', '老師說看不懂');

/* 4 最用心獎下面那一句 */
h += `<h2>❓ 第 4 題：「最用心」下面寫什麼？</h2>
<div class="why">另外三種：「這週 練習 48 分鐘」「正確率 96 分」「從 70 分 進步到 92 分」——都是一句事實。</div>`;
const award = (line) => `<div class="mk">${tab(`${HRT('110px')}<div class="t1">最用心</div><div class="t2">304 班 第 2 名</div><div class="t3">${line}</div>`, '學生平板＋📺 投影')}<div class="cert"><div class="c1">榮 譽 狀</div><div class="c2">三年級 304 班 30412 小華</div><div class="c2">榮獲 304 班「最用心」第 2 名</div><div class="c3">${line}</div></div></div>`;
h += opt('甲', `「用心程度 ${TOT} 分」`, 1, award(`用心程度 ${TOT} 分`), '短、跟另外三種一樣一句；怎麼算，平板上的動畫（第 6 題）演給學生看', '');
h += opt('乙', '寫最好的兩項', 0, award('這週 練了 3 天，做完 6 次 題目、遊戲。'), '更具體', '句子長；每個人的兩項不一樣，投影時比較難比');

/* 5 要關心格子 */
h += `<h2>❓ 第 5 題：老師看板「🔔 要關心」每一格怎麼寫？</h2>
${ba(`<div class="kc"><div class="a">12 小華</div><div class="b">🟢 85</div><div class="c">👆 82</div><div class="c">最弱：🐢 不亂按</div></div>`, `<div class="kc"><div class="a">12 小華</div><div class="b">🟢 正確率 85</div><div class="c">${HRT('34px')} 用心 ${TOT}</div></div>`, 'D9 給老師看的樣子', '建議 A')}`;
h += opt('A', `格子只多一行「${HRT('34px')} 用心 ${TOT}」；哪一項最少，點格子看成績卡`, 1, `<div class="mk">${pj(`<div class="t2">點小華 ➜ 成績卡多一塊</div><div class="t3">五項長條（第 1 題的名字）＋最少的那一項發亮</div>`, '老師看板：成績卡')}</div>`, '格子小，一眼看完；細節在成績卡', '');
h += opt('B', `兩行：「${HRT('34px')} 用心 ${TOT}」＋「要加強：這週 練了 幾天」`, 0, '', '不用點就知道', '格子變大，一班 30 格要捲比較多');
h += opt('C', '格子不寫用心，只在成績卡', 0, '', '最簡單', '要一個一個點才看得到');

/* 6 平板動畫 */
h += `<h2>❓ 第 6 題：學生平板「用心程度怎麼算」的動畫</h2>
<div class="why">放在哪裡：做完以後，時鐘那一幕（這週你已經練習 48 分鐘）<b>的下一幕</b>，約 5 秒，可以〔⏭ 跳過〕。每一次做完都演，學生每次都看到自己哪一項還能加分。<br>下面是真的動畫，按〔▶ 再演一次〕看。</div>`;
const legend = (id) => `<div class="lg" id="${id}">${ITEMS.map((i, k) => `<div data-k="${k}"><span style="text-align:center">${i.ic('44px')}</span><span>${i.n}</span><b>${i.s}</b></div>`).join('')}</div>`;
const R = 70, C = 2 * Math.PI * R, SL = C / 5;
const pie = `<div class="pie"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="${R}" fill="none" stroke="#1E2830" stroke-width="46"/>${ITEMS.map((i, k) => `<circle class="seg" data-len="${(SL * i.s / 20 - 2).toFixed(1)}" style="stroke:${COL[k]};stroke-dashoffset:${(-SL * k).toFixed(1)}" cx="100" cy="100" r="${R}"/>`).join('')}</svg><div class="num"><b id="pn">0</b><span>用心程度</span></div></div>`;
h += opt('A', '五塊拼成一個圓：一塊一塊飛進來，中間數字加上去，最少的那一項閃＋一句「請 …」', 1,
  tab(`<div class="t1">${HRT('60px')} 這週 用心程度</div>${pie}${legend('lgA')}<div class="tipx" id="tpA">💡 ${WEAK.tip}</div><button class="rp" onclick="playA()">▶ 再演一次</button>`),
  '圓滿 ＝ 100 分，缺一塊一看就知道；學生知道下次怎麼加分', '');
h += opt('B', '五條長條一條一條長出來，最後加起來', 0,
  tab(`<div class="t1">${HRT('60px')} 這週 用心程度</div><div class="bars" id="bB">${ITEMS.map((i, k) => `<div><span style="text-align:center">${i.ic('44px')}</span><span>${i.n}</span><i style="background:${COL[k]}" data-w="${i.s * 5}%"></i><b>${i.s}</b></div>`).join('')}</div><div class="sumB" id="sB"></div><div class="tipx" id="tpB">💡 ${WEAK.tip}</div><button class="rp" onclick="playB()">▶ 再演一次</button>`),
  '每一項多少分很清楚', '加起來 ＝ 100 分比較看不出來');

/* 7 D9 第 2 題 */
h += `<h2>❓ 第 7 題（D9 第 2 題再問）：看字卡、按 🔊 聽，要不要記下來？</h2>
${ba('只算<b>作答</b>的時間：<br>小華 這週 作答 30 分鐘<br>➜ 平板寫「這週 練習 30 分鐘」', '<b>作答＋看字卡＋按 🔊 聽</b>都算：<br>作答 30 分鐘＋看字卡、聽 18 分鐘<br>➜ 平板寫「這週 練習 48 分鐘」', '', '選 A')}`;
h += opt('A', '要記（要登入才記；一張卡停超過 2 分鐘只算 2 分鐘；開著不動不算）', 1, '', '只看卡、聽發音的學生，努力也看得見；「最認真練習」和「用心」第 5 項都算進去', '在家沒登入照樣能看，只是不記');
h += opt('B', '不記，只算作答', 0, '', '最簡單', '看卡、聽發音的努力看不見');

/* 8 D9 第 3 題 */
h += `<h2>❓ 第 8 題（D9 第 3 題再問）：五項怎麼算（每項最多 20 分，加起來最多 100 分）</h2>
<table class="ev"><tr><th>圖示</th><th>名字</th><th>拿滿 20 分</th><th>沒滿</th><th>小華 這週</th><th>小華 得分</th></tr>
${ITEMS.map(i => `<tr><td class="ic">${i.ic('50px')}</td><td>${i.n}</td><td>${i.full}</td><td>${i.minus}</td><td>${i.x}</td><td style="font-size:30px;color:#FFE07A">${i.s}</td></tr>`).join('')}
<tr><td></td><td colspan="4" style="text-align:right">加起來</td><td style="font-size:34px;color:#FFE07A">${TOT}</td></tr></table>
<div class="why">「太快亂按」＝ 還沒看完、聽完就按（1 秒內）。一次裡面太快亂按超過一半 ＝ 那一次不算「做完」、不算時間。<br>「做完 幾次」只算做到最後（遊戲 6 題以上），一天同一組最多 3 次。</div>`;
h += opt('A', '照這張表', 1, '', '', '第 5 項「這週 練習 幾分鐘」跟「最認真練習」都看時間：時間多的人兩種獎都比較容易拿（只占用心 20 分）');
h += opt('B', '我要改（寫「第幾項 ➜ 改成什麼」）', 0, '', '', '');

/* 研究證據 */
h += `<h2>📚 五項的研究證據（這一次一篇一篇打開原文核對）</h2>
<table class="ev"><tr><th>項目</th><th>研究</th><th>原文寫什麼</th><th>核對</th></tr>
<tr><td>${CAL} 這週 練了 幾天</td><td>Cepeda、Pashler、Vul、Wixted、Rohrer 2006，Psychological Bulletin 132(3)，整理 317 個實驗</td><td>分開幾次練，比一次練完記得更好（spaced 比 massed 好）</td><td>✅ 打開原文</td></tr>
<tr><td>${TST} 做完 幾次 題目、遊戲</td><td>Roediger & Karpicke 2006，Psychological Science 17(3)</td><td>過 2 天、1 週再考：考過自己的人，記得比只再讀一遍的人多很多</td><td>✅ 打開原文</td></tr>
<tr><td>${EYE('40px')} 看完、聽完 才選</td><td>Wise & Kong 2005（Applied Measurement in Education 18(2)）；Ivanova & Michaelides 2023（PARE 28(15)，用 PISA 2018 的資料）</td><td>太快、來不及看題目就按 ＝ 沒有在想；作答時間是看「有沒有用心作答」最可靠的方法</td><td>🔶 Wise & Kong 原文要付費打不開（只核對到題目、期刊、頁數）；<b>改用打得開的 Ivanova 2023 原文當證據</b></td></tr>
<tr><td>${FIX('40px')} 答錯的 改對了</td><td>Hattie & Timperley 2007，Review of Educational Research 77(1)</td><td>告訴學生「跟上一次比改了什麼」的回饋效果大（0.55）；自己發現錯誤再改，非常有用</td><td>✅ 打開原文</td></tr>
<tr><td>${CLK('40px')} 這週 練習 幾分鐘</td><td>Fredricks、Blumenfeld、Paris 2004，Review of Educational Research 74(1)</td><td>「投入學習」包括努力、堅持、專心——願意花時間在學習上</td><td>✅ 打開原文</td></tr></table>`;

h += `<div class="ans">✍️ 例：「<b>1A 2A 3A 4甲 5A 6A 7A 8A</b>」。看不懂哪一題，直接說「第幾題看不懂」。</div></div>
<script>
const ITS=${JSON.stringify(ITEMS.map(i => i.s))},TOT=${TOT},WK=${ITEMS.indexOf(WEAK)},RD=matchMedia('(prefers-reduced-motion: reduce)').matches;
let tA=[],tB=[];
function playA(){tA.forEach(clearTimeout);tA=[];const segs=document.querySelectorAll('.seg'),ls=document.querySelectorAll('#lgA div'),pn=document.getElementById('pn'),tp=document.getElementById('tpA');
segs.forEach(s=>{s.style.transition='none';s.style.strokeDasharray='0 1000'});ls.forEach(l=>l.classList.remove('on','wk'));tp.classList.remove('on');pn.textContent='0';let sum=0;
ITS.forEach((v,k)=>tA.push(setTimeout(()=>{const s=segs[k];s.style.transition=RD?'none':'stroke-dasharray .8s ease-out';s.style.strokeDasharray=s.dataset.len+' 1000';ls[k].classList.add('on');const from=sum;sum+=v;const el=pn,to=sum,t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/600);el.textContent=Math.round(from+(to-from)*p);if(p<1)requestAnimationFrame(f)})(t0)},300+k*800)));
tA.push(setTimeout(()=>{ls[WK].classList.add('wk');tp.classList.add('on')},300+5*800+300))}
function playB(){tB.forEach(clearTimeout);tB=[];const is=document.querySelectorAll('#bB i'),sB=document.getElementById('sB'),tp=document.getElementById('tpB');
is.forEach(i=>{i.style.transition='none';i.style.width='0'});sB.textContent='';tp.classList.remove('on');
is.forEach((i,k)=>tB.push(setTimeout(()=>{i.style.transition=RD?'none':'width 1s ease-out';i.style.width=i.dataset.w},300+k*700)));
tB.push(setTimeout(()=>{sB.textContent='加起來 '+TOT+' 分';tp.classList.add('on')},300+5*700+500))}
playA();playB();
</script></body></html>`;
fs.writeFileSync(process.argv[2], h);
console.log('ok', h.length);
