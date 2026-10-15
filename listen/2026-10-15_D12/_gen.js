// 產生 listen/2026-10-15_D12/index.html（老師回答 D11：1A 2甲 3A；第 4 題 甲 乙 動畫都不好 ➜ 新的秒懂有趣動畫）
// 用小華（30412）把第 8 件「用心程度」全部再對一次，老師說「對」才改網站。
// 用法：node listen/2026-10-15_D12/_gen.js listen/2026-10-15_D12/index.html ；量測：node listen/2026-10-15_D12/_verify.js listen/2026-10-15_D12/index.html
const fs = require('fs'), SP = __dirname + '/../2026-10-12_D6';
const head = fs.readFileSync(SP + '/head.html', 'utf8').replace(/\n<style>\n/, '\n');

/* 自己畫的圖示（D10 第 2、3 題 A） */
const EYE = (h) => `<svg viewBox="0 0 200 100" style="height:${h};vertical-align:middle" aria-label="看完、聽完"><path d="M8 50Q50 6 92 50Q50 94 8 50Z" fill="#fff" stroke="#333" stroke-width="5"/><circle cx="50" cy="50" r="17" fill="#2F7BE8"/><circle cx="50" cy="50" r="8" fill="#111"/><circle cx="55" cy="44" r="4" fill="#fff"/><path d="M122 52C118 14 182 8 186 46C188 70 162 70 160 88C158 100 138 100 134 88" fill="#FFD3B0" stroke="#B86B3C" stroke-width="6" stroke-linecap="round"/><path d="M142 48C142 30 168 28 168 46C168 58 154 56 154 68" fill="none" stroke="#B86B3C" stroke-width="6" stroke-linecap="round"/></svg>`;
const FIX = (h) => `<svg viewBox="0 0 200 100" style="height:${h};vertical-align:middle" aria-label="答錯的改對了"><circle cx="38" cy="50" r="32" fill="#E8453C"/><path d="M26 38l24 24M50 38L26 62" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M80 50h34" stroke="#FFD54A" stroke-width="9" stroke-linecap="round"/><path d="M108 36l16 14-16 14z" fill="#FFD54A"/><circle cx="162" cy="50" r="32" fill="#2EB85C"/><path d="M146 51l11 11 21-23" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CLK = (h) => `<svg viewBox="0 0 100 100" style="height:${h};vertical-align:middle" aria-label="時鐘"><circle cx="50" cy="50" r="44" fill="#FFF8E6" stroke="#FFB300" stroke-width="8"/>${[0,90,180,270].map(a=>`<rect x="48" y="12" width="4" height="10" fill="#8A5A00" transform="rotate(${a} 50 50)"/>`).join('')}<rect x="47" y="24" width="6" height="28" rx="3" fill="#333"/><rect x="47" y="34" width="6" height="18" rx="3" fill="#D84315" transform="rotate(60 50 50)"/><circle cx="50" cy="50" r="6" fill="#333"/></svg>`;
const HRT = (h) => `<svg viewBox="0 0 120 150" style="height:${h};vertical-align:middle" aria-label="最用心"><path d="M30 0h22l18 52H48z" fill="#2F7BE8"/><path d="M90 0H68L50 52h22z" fill="#E8453C"/><circle cx="60" cy="95" r="46" fill="#B8860B"/><circle cx="60" cy="95" r="40" fill="#FFC928"/><path d="M60 122C30 102 34 74 48 72C55 71 59 76 60 80C61 76 65 71 72 72C86 74 90 102 60 122Z" fill="#E8453C" stroke="#FFFDF0" stroke-width="4" stroke-linejoin="round"/></svg>`;
const EFF = (h) => `<svg viewBox="0 0 120 150" style="height:${h};vertical-align:middle" aria-label="最認真練習"><path d="M30 0h22l18 52H48z" fill="#2F7BE8"/><path d="M90 0H68L50 52h22z" fill="#E8453C"/><circle cx="60" cy="95" r="46" fill="#B8860B"/><circle cx="60" cy="95" r="40" fill="#FFC928"/><path d="M60 68l8 17 18 2-13 12 4 18-17-9-17 9 4-18-13-12 18-2z" fill="#FFFDF0"/></svg>`;
const UPA = (h) => `<svg viewBox="0 0 100 100" style="height:${h};vertical-align:middle" aria-label="進步最多"><path d="M50 6L90 50H66V94H34V50H10Z" fill="#2EB85C" stroke="#0B5A2A" stroke-width="5" stroke-linejoin="round"/></svg>`;
const emo = (e) => (h) => `<span style="font-size:${h};line-height:1;vertical-align:middle">${e}</span>`;

/* 五項（D10 第 1、2 題 A、第 8 題 A）＋小華這週 */
const ITEMS = [
  { ic: emo('📅'), n: '這週 練了 幾天', full: '4 天以上', minus: '少 1 天 −5 分', zero: '0 天 ＝ 0 分', x: '3 天', s: 15, tip: '請 再多練 1 天' },
  { ic: emo('📝'), n: '做完 幾次 題目、遊戲', full: '5 次以上', minus: '少 1 次 −4 分', zero: '0 次 ＝ 0 分', x: '6 次', s: 20, tip: '請 再做完 1 次' },
  { ic: EYE, n: '看完、聽完 才選', full: '太快亂按 0 題', minus: '每多 5% −4 分', zero: '這週 沒有作答 ＝ 0 分', x: '100 題 裡 5 題 太快亂按（5%）', s: 16, tip: '請 看完、聽完 再選' },
  { ic: FIX, n: '答錯的 改對了', full: '答錯的 全部改對（沒有答錯 也是 20 分）', minus: '改對幾成 ＝ 20 ✕ 幾成', zero: '這週 沒有作答 ＝ 0 分', x: '答錯 5 題，改對 4 題', s: 16, tip: '請 把答錯的 再做一次' },
  { ic: CLK, n: '這週 練習 幾分鐘', full: '30 分鐘以上', minus: '照比例（15 分鐘 ＝ 10 分）', zero: '0 分鐘 ＝ 0 分', x: '48 分鐘', s: 20, tip: '請 再多練 幾分鐘' },
];
const TOT = ITEMS.reduce((a, b) => a + b.s, 0);                 // 87
const WK = ITEMS.indexOf(ITEMS.reduce((a, b) => (b.s < a.s ? b : a)));
const COL = ['#2F7BE8', '#9B59D0', '#00A6A6', '#2EB85C', '#FF9F1C'];

const opt = (k, title, rec, body, pro, con) => `<div class="opt${rec ? ' rec' : ''}"><div class="hd"><b class="k">${k}</b>${title}${rec ? ' <span class="tag" style="display:inline-block;background:#3BD16F;color:#05210F;border-radius:999px;padding:0 14px;font-size:22px">建議</span>' : ''}</div>${body}${pro ? `<div class="pro">👍 ${pro}</div>` : ''}${con ? `<div class="con">⚠️ ${con}</div>` : ''}</div>`;
const tab = (inner, lab) => `<div class="dev"><div class="lab">📱 ${lab || '學生平板（小華 ＝ 30412）'}</div>${inner}</div>`;
const pj = (inner, lab) => `<div class="dev pj"><div class="lab">📺 ${lab}</div>${inner}</div>`;
const cert = (a, b, c) => `<div class="cert"><div class="c0">榮譽狀</div><div class="c1">${a}</div><div class="c2">${b}</div><div class="c3">${c}</div></div>`;

const css = `
.mk{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}
@media (max-width:900px){.mk{grid-template-columns:1fr}}
.dev{border:6px solid #3A4650;border-radius:26px;background:#000;padding:10px 12px 14px;text-align:center;overflow:hidden}
.dev.pj{border-color:#5B4A12;border-radius:8px;background:radial-gradient(circle at 50% 30%,#2A2000,#000 75%)}
.dev .lab{font-size:22px;color:#B9C4CE;text-align:left;margin-bottom:6px}
.dev .t1{font-size:36px;color:#FFE07A;line-height:1.3}.dev .t2{font-size:28px;color:#fff;line-height:1.4}.dev .t3{font-size:24px;color:#CFE3F5;line-height:1.4}
.ev td,.ev th{font-size:24px;overflow-wrap:anywhere}
.ev td.ic{white-space:nowrap;text-align:center}
@media (max-width:900px){.ev,.ev tbody,.ev tr,.ev td,.ev th{display:block;width:100%}.ev tr:first-child{display:none}.ev tr{margin-bottom:12px;border:3px solid #2A3540;border-radius:12px}.ev td.ic{text-align:left}}
.ans{background:#1A1400;border:4px solid #FFD54A;border-radius:20px;padding:14px 20px;margin:30px 0;font-size:28px}
.ok{color:#9FF0B8}
.cert{background:#FFF8E6;color:#3A2A00;border:10px double #C9A227;border-radius:6px;padding:14px;text-align:center}
.cert .c0{font-size:40px;color:#8A5A00;letter-spacing:.3em}.cert .c1{font-size:44px;color:#3A2A00}.cert .c2{font-size:30px}.cert .c3{font-size:24px;color:#6A5A3A}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media (max-width:760px){.cg{grid-template-columns:1fr}}
.kc{display:inline-block;background:#0B1A10;border:4px solid #3BD16F;border-radius:14px;padding:8px 14px;text-align:left;min-width:220px;margin:6px}
.kc .a{font-size:26px;color:#fff}.kc .b{font-size:24px;color:#9FF0B8}.kc .c{font-size:24px;color:#FFD54A}
.flow{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:26px;margin:10px 0}
.flow span{background:#14202B;border:3px solid #2A3540;border-radius:14px;padding:6px 12px}
.flow span.nw{border-color:#FFD54A;background:#2A2000;color:#FFE07A}
.flow i{font-style:normal;color:#FFD54A}
.tb{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.tb span{background:#14202B;border:3px solid #2A3540;border-radius:12px;padding:4px 12px;font-size:24px}.tb span.nw{border-color:#FFD54A;color:#FFE07A}
.rp{display:inline-block;background:#2A3540;color:#fff;border:0;border-radius:12px;font:inherit;font-size:24px;padding:6px 18px;margin-top:8px;cursor:pointer;min-height:48px}
.tipx{font-size:30px;color:#FFD54A;margin-top:6px;opacity:0;transform:scale(.6);transition:.5s cubic-bezier(.3,1.6,.5,1)}.tipx.on{opacity:1;transform:none}
.big2{font-size:30px;color:#FFE07A}
/* 甲 五顆愛心裝滿：一顆 ＝ 20 分，五顆 ＝ 100 分 */
.hsum{font-size:30px;color:#CFE3F5;margin:2px 0}.hsum b{font-size:72px;color:#FFE07A;display:inline-block;line-height:1}.hsum b.pop{animation:pop .6s}
@keyframes pop{50%{transform:scale(1.35)}}
.hrow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(4px,1.5vw,16px);max-width:680px;margin:6px auto 0;align-items:end}
.hc{display:flex;flex-direction:column;align-items:center;gap:2px}
.hc .v{font-size:30px;color:#fff;opacity:0;transform:translateY(10px);transition:.4s}.hc.on .v{opacity:1;transform:none}
.hc svg.h{width:100%;max-width:120px;overflow:visible}
.hc .lq{transition:transform 1s cubic-bezier(.3,1.25,.5,1)}
.hc .wv{animation:wave 1.2s linear infinite}
@keyframes wave{to{transform:translateX(-40px)}}
.hc .fc{opacity:0;transition:opacity .3s}.hc.full .fc{opacity:1}
.hc.full svg.h{animation:beat .5s 2}
@keyframes beat{40%{transform:scale(1.18)}}
.hc .gap{fill:none;stroke:#FFD54A;stroke-width:4;opacity:0}
.hc.wk .gap{animation:gp .8s ease-in-out infinite}
@keyframes gp{50%{opacity:1}}
.hc .icn{min-height:46px;display:flex;align-items:center;justify-content:center;max-width:100%}.hc .icn svg{max-width:100%}
@media (max-width:520px){.hc .icn span{font-size:34px!important}}
.hc.wk .icn{animation:wig .5s ease-in-out infinite}
@keyframes wig{0%,100%{transform:rotate(-12deg) scale(1.15)}50%{transform:rotate(12deg) scale(1.15)}}
.hnote{font-size:24px;color:#B9C4CE;margin-top:6px}
.spk{position:absolute;width:10px;height:10px;border-radius:50%;pointer-events:none;animation:spk .8s ease-out forwards}
@keyframes spk{to{transform:translate(var(--x),var(--y)) scale(.2);opacity:0}}
/* 乙 小火箭飛向月亮 */
.rk{display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:10px;max-width:560px;margin:6px auto;align-items:stretch}
.rk .ch{display:flex;flex-direction:column;justify-content:flex-end;gap:6px}
.rk .ch div{display:flex;align-items:center;gap:8px;font-size:30px;color:#fff;background:#14202B;border-radius:12px;padding:2px 10px;white-space:nowrap;opacity:0;transform:translateX(-30px);transition:.4s}
.rk .ch div.on{opacity:1;transform:none}.rk .ch div.wk{animation:wig2 .5s ease-in-out infinite;background:#3A2A00}
@keyframes wig2{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
.rk .tr{position:relative;height:420px;border-left:4px dashed #3A4650}
.rk .moon{position:absolute;top:0;left:50%;transform:translateX(-50%);text-align:center;font-size:24px;color:#FFE07A}
.rk .ship{position:absolute;left:50%;bottom:0;width:70px;margin-left:-35px;transition:bottom .7s cubic-bezier(.3,1.3,.5,1)}
.rk .ship .fl{transform-origin:35px 96px;transform:scaleY(0);transition:transform .2s}.rk .ship.go .fl{transform:scaleY(1);animation:flk .15s infinite alternate}
@keyframes flk{to{transform:scaleY(.7)}}
`;

/* 甲：愛心（viewBox 0 0 100 92，心的高度 y 4～88） */
const HP = 'M50 88C20 66 4 48 4 28C4 13 15 4 28 4C38 4 45 10 50 18C55 10 62 4 72 4C85 4 96 13 96 28C96 48 80 66 50 88Z';
const heart = (k, i, pre) => `<div class="hc" data-k="${k}"><div class="v">${i.s}</div>
<svg class="h" viewBox="0 0 100 92"><defs><clipPath id="${pre}c${k}"><path d="${HP}"/></clipPath></defs>
<path d="${HP}" fill="#1A2230" stroke="#55606A" stroke-width="3"/>
<g clip-path="url(#${pre}c${k})"><g class="lq" data-y="${(84 * (1 - i.s / 20)).toFixed(1)}" style="transform:translateY(92px)"><g class="wv"><path d="M-40 6Q-30 0 -20 6T0 6T20 6T40 6T60 6T80 6T100 6T120 6T140 6V100H-40Z" fill="${COL[k]}"/></g></g></g>
<path class="gap" d="${HP}"/>
<g class="fc" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"><path d="M32 38q5-6 10 0M58 38q5-6 10 0"/><path d="M40 52q10 9 20 0"/></g>
<path d="${HP}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/></svg>
<div class="icn">${i.ic(k >= 2 ? '40px' : '42px')}</div></div>`;
const hearts = (id) => `<div id="${id}" style="position:relative"><div class="t1">這週 用心程度</div><div class="hsum"><b class="n">0</b> ／100</div>
<div class="hrow">${ITEMS.map((i, k) => heart(k, i, id)).join('')}</div><div class="hnote">❤ 1 顆 裝滿 ＝ 20 分</div><div class="tipx">💡 ${ITEMS[WK].tip}</div></div>`;

/* 乙：小火箭 */
const SHIP = `<svg viewBox="0 0 70 120" style="width:70px"><path class="fl" d="M24 92Q35 124 46 92Z" fill="#FF7A00"/><path d="M35 4C54 22 56 60 50 92H20C14 60 16 22 35 4Z" fill="#F4F7FA" stroke="#3A4650" stroke-width="3"/><circle cx="35" cy="44" r="10" fill="#2F7BE8" stroke="#3A4650" stroke-width="3"/><path d="M20 70L6 96H22ZM50 70L64 96H48Z" fill="#E8453C"/></svg>`;
const MOON = `<svg viewBox="0 0 60 60" style="width:60px"><circle cx="30" cy="30" r="26" fill="#FFE07A"/><circle cx="20" cy="22" r="5" fill="#E8C35A"/><circle cx="38" cy="38" r="7" fill="#E8C35A"/></svg>`;
const rocket = `<div id="rkB"><div class="t1">這週 用心程度</div><div class="hsum"><b class="n">0</b> ／100</div><div class="rk"><div class="ch">${ITEMS.map((i, k) => `<div>${i.ic(k >= 2 ? '30px' : '34px')} ＋${i.s}</div>`).join('')}</div>
<div class="tr"><div class="moon">${MOON}<br>100</div><div class="ship">${SHIP}</div></div></div><div class="tipx">💡 ${ITEMS[WK].tip}</div></div>`;

let h = head.replace('<title>榮譽榜怎麼給</title>', '<title>用心程度再對一次</title>').replace('</style>', css + '</style></head><body><div class="wrap">');
h += `<h1>✅ 「用心程度」：用小華再對一次</h1>
<div class="lead">老師回答 D11：<b>1A　2甲　3A</b>；第 4 題 甲、乙 動畫都不好 ➜ 下面換成<b>兩個新的有趣動畫</b>。<br>
下面是小華（30412）這週 在網站上會看到的<b>全部樣子</b>。<b>老師說「對」才改網站。</b></div>`;

/* 一、五項怎麼算 */
h += `<h2>① 五項怎麼算（每項最多 20 分，加起來最多 100 分）</h2>
<table class="ev"><tr><th>圖示</th><th>名字</th><th>拿滿 20 分</th><th>沒滿</th><th>小華 這週</th><th>得分</th></tr>
${ITEMS.map(i => `<tr><td class="ic">${i.ic('50px')}</td><td>${i.n}</td><td>${i.full}</td><td>${i.minus}<br><span class="small">${i.zero}</span></td><td>${i.x}</td><td style="font-size:30px;color:#FFE07A">${i.s}</td></tr>`).join('')}
<tr><td></td><td colspan="4" style="text-align:right">加起來</td><td style="font-size:34px;color:#FFE07A">${TOT}</td></tr></table>
<div class="why">「太快亂按」＝ 還沒看完、聽完就按（1 秒內）。一次裡面太快亂按超過一半 ＝ 那一次不算「做完」、不算時間。<br>
「這週」＝ 星期一 00:00 開始（台灣時間），跟排行榜一樣。</div>`;

/* 二、看字卡、按 🔊 */
h += `<h2>② 看字卡、按 🔊 聽，也算練習時間（D10 第 7 題 A）</h2>
<table class="ev"><tr><th>規則</th><th>小華</th></tr>
<tr><td>要<b>登入</b>才記（沒登入、👀 先練習 不記）</td><td rowspan="3">作答 30 分鐘 ＋ 看字卡、聽 18 分鐘<br>➜ <b class="big2">這週 練習 48 分鐘</b></td></tr>
<tr><td>一張卡 停超過 2 分鐘，只算 2 分鐘</td></tr>
<tr><td>開著 不動（3 分鐘 沒點）不算；換到別的分頁 不算</td></tr></table>
<div class="why">算在哪裡：<b>三年級、四年級 教學網站的句型卡、兩個在家複習的句型卡、Review 1 字卡</b>（都已經接上成績系統的網頁）。<br>
單字網站（時光機、職業單字、數字、Sight Words）這次<b>不算</b>，以後要算再加。<br>
加進去的時間：「最認真練習」排行榜、時鐘那一幕、用心程度第 5 項 都一起算。</div>`;

/* 三、平板 */
h += `<h2>③ 學生平板：做完以後的順序</h2>
<div class="flow"><span>🎯 正確率</span><i>➜</i><span>${CLK('34px')} 這週你已經練習 48 分鐘</span><i>➜</i><span class="nw">❤ 這週 用心程度（新）</span><i>➜</i><span>🏆 名次上升 才演</span><i>➜</i><span>📌 答錯整理</span></div>
<div class="why">「用心程度」那一幕：<b>每一次做完都演</b>（題目、遊戲都一樣），約 5 秒，可以〔⏭ 跳過〕，不放聲音。</div>
<h2>❓ 新動畫：老師選一個（第 4 題 再選一次）</h2>
<div class="why">按〔▶ 再看一次〕。畫面上的字只有：「這週 用心程度」、數字、最後一句「💡 請 …」。</div>`;
h += opt('甲', '五顆愛心 裝滿：一顆 ＝ 20 分，五顆 ＝ 100 分', 1,
  tab(`${hearts('hA')}<button class="rp" onclick="playA()">▶ 再看一次</button>`),
  '愛心 ＝ 用心（跟「最用心」獎牌同一個愛心）；水一顆一顆倒進去、會晃；<b>裝滿的愛心會笑、會跳</b>；沒裝滿的那一顆，空的地方閃金光 ＝ 這裡還能加分', '');
h += opt('乙', '小火箭 飛向月亮：每一項 推火箭一下，月亮 ＝ 100 分', 0,
  tab(`${rocket}<button class="rp" onclick="playB()">▶ 再看一次</button>`),
  '飛得愈高 ＝ 愈用心，很好玩', '看不出每一項最多 20 分');

/* 四、最用心 榮譽 */
h += `<h2>④ 第 4 種最高榮譽「最用心」（名次上升才演）</h2>
<div class="mk">${tab(`${HRT('130px')}<div class="t1">🏆 本週 榮譽榜</div><div class="t1">最用心</div><div class="t2">304 班 第 2 名</div><div class="t3">用心程度 ${TOT} 分</div>`)}
${pj(`<div class="t2">🏆 本週 榮譽榜</div><div class="tb"><span>${EFF('30px')} 最認真練習</span><span>🎯 成績最優</span><span>${UPA('30px')} 進步最多</span><span class="nw">${HRT('30px')} 最用心</span></div><div class="t1" style="margin-top:8px">${HRT('70px')} 最用心 第 1 名</div><div class="t2">小美</div><div class="t3">用心程度 96 分</div>`, '老師投影：排行榜多〔🏆 最用心〕')}</div>
<table class="ev"><tr><th>榮譽</th><th>誰拿得到</th></tr>
<tr><td>${HRT('40px')} 最用心（個人）</td><td>班內 前 10 名、全年級 前 10 名（用心程度 一樣多 ＝ 再比練習時間）</td></tr>
<tr><td>${HRT('40px')} 最用心的班</td><td>全班每一個人的用心程度 加起來 ÷ 全班人數（沒練的人 ＝ 0 分）；課後班 不比</td></tr></table>`;

/* 五、獎狀 */
h += `<h2>⑤ 獎狀（D11 第 2 題 甲、第 3 題 A：四種都一樣精簡，班級也是）</h2>
<div class="cg">${cert('小華', '304 班 最用心 第 2 名', `用心程度 ${TOT} 分`)}${cert('小華', '304 班 最認真練習 第 2 名', '這週 練習 48 分鐘')}
${cert('小華', '304 班 成績最優 第 3 名', '正確率 96 分')}${cert('小華', '304 班 進步最多 第 1 名', '從 70 分 進步到 92 分')}
${cert('304 班', '三年級 最用心的班 第 1 名', '平均每一個人 用心程度 75 分')}</div>
<div class="why">刪掉：三年級（個人獎狀）、30412、榮獲、引號、「：全班一起努力。」。名字（班名）放最大。</div>`;

/* 六、老師看板 */
h += `<h2>⑥ 老師看板</h2>
<table class="ev"><tr><th>哪裡</th><th>改之後</th></tr>
<tr><td>🔔 要關心 每一格</td><td><div class="kc"><div class="a">12 小華</div><div class="b">🟢 正確率 85</div><div class="c">${HRT('34px')} 用心 ${TOT}</div></div><br>只多一行；哪一項最少，點格子看成績卡</td></tr>
<tr><td>點一個學生 ＝ 成績卡</td><td>多一塊「${HRT('34px')} 用心程度 ${TOT}」：<b>跟學生平板同一個動畫</b>（老師選的那一個），最少的那一項閃</td></tr>
<tr><td>🏆 排行榜</td><td>多〔${HRT('30px')} 最用心〕（有〔🏆 榮譽榜〕投影、〔🖨 印獎狀〕）；🏫 班際 也多「最用心的班」</td></tr>
<tr><td>📥 下載 Excel</td><td>個人、排行榜 多一欄「用心程度」＋五項各幾分</td></tr></table>`;

/* 七、研究 */
h += `<h2>📚 研究證據（D10 已經打開原文核對）</h2>
<table class="ev"><tr><th>項目</th><th>研究</th></tr>
<tr><td>📅 這週 練了 幾天</td><td>Cepeda 等 2006（Psychological Bulletin 132(3)）：分開幾天練，比一次練完記得更好</td></tr>
<tr><td>📝 做完 幾次</td><td>Roediger & Karpicke 2006（Psychological Science 17(3)）：考自己，比再讀一遍記得多</td></tr>
<tr><td>${EYE('36px')} 看完、聽完 才選</td><td>Ivanova & Michaelides 2023（PARE 28(15)）：作答時間是看「有沒有用心作答」最可靠的方法</td></tr>
<tr><td>${FIX('36px')} 答錯的 改對了</td><td>Hattie & Timperley 2007（Review of Educational Research 77(1)）：自己發現錯誤再改，非常有用</td></tr>
<tr><td>${CLK('36px')} 練習 幾分鐘</td><td>Fredricks 等 2004（Review of Educational Research 74(1)）：投入 ＝ 努力、堅持、專心</td></tr></table>`;

h += `<div class="ans">✍️ 請回答：「<b>對，動畫 甲</b>」或「<b>對，動畫 乙</b>」；哪裡不對，直接寫「第幾段 ➜ 改成什麼」。</div></div>
<script>
const ITS=${JSON.stringify(ITEMS.map(i => i.s))},WK=${WK},RD=matchMedia('(prefers-reduced-motion: reduce)').matches,GAP=RD?0:800;
function up(el,from,to){const t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/500);el.textContent=Math.round(from+(to-from)*p);if(p<1)requestAnimationFrame(f)})(t0)}
function spark(box,el){if(RD)return;const b=box.getBoundingClientRect(),r=el.getBoundingClientRect();for(let i=0;i<10;i++){const s=document.createElement('i');s.className='spk';s.style.left=(r.left-b.left+r.width/2)+'px';s.style.top=(r.top-b.top+r.height/2)+'px';s.style.background=['#FFD54A','#fff','#FF7AA8'][i%3];const a=i/10*6.28;s.style.setProperty('--x',Math.cos(a)*60+'px');s.style.setProperty('--y',Math.sin(a)*60+'px');box.appendChild(s);setTimeout(()=>s.remove(),900)}}
let tA=[],tB=[];
function playA(){tA.forEach(clearTimeout);tA=[];const box=document.getElementById('hA'),hc=box.querySelectorAll('.hc'),n=box.querySelector('.n'),tp=box.querySelector('.tipx');
hc.forEach(c=>{c.classList.remove('on','full','wk');const l=c.querySelector('.lq');l.style.transition='none';l.style.transform='translateY(92px)'});n.classList.remove('pop');tp.classList.remove('on');n.textContent='0';void box.offsetWidth;let s=0;
ITS.forEach((v,k)=>tA.push(setTimeout(()=>{const c=hc[k],l=c.querySelector('.lq');l.style.transition=RD?'none':'';l.style.transform='translateY('+l.dataset.y+'px)';c.classList.add('on');up(n,s,s+v);s+=v;
if(v>=20)tA.push(setTimeout(()=>{c.classList.add('full');spark(box,c.querySelector('svg'))},RD?0:700))},300+k*GAP)));
tA.push(setTimeout(()=>{n.classList.add('pop');hc[WK].classList.add('wk');tp.classList.add('on')},300+5*GAP+500))}
function playB(){tB.forEach(clearTimeout);tB=[];const box=document.getElementById('rkB'),ch=box.querySelectorAll('.ch div'),sh=box.querySelector('.ship'),nb=box.querySelector('.n'),tr=box.querySelector('.tr'),tp=box.querySelector('.tipx');
ch.forEach(c=>c.classList.remove('on','wk'));nb.classList.remove('pop');sh.style.transition='none';sh.style.bottom='0px';nb.textContent='0';tp.classList.remove('on');void box.offsetWidth;sh.style.transition='';let s=0;
const top=()=>tr.clientHeight-130;
ITS.forEach((v,k)=>tB.push(setTimeout(()=>{ch[k].classList.add('on');sh.classList.add('go');up(nb,s,s+v);s+=v;sh.style.bottom=(top()*s/100)+'px';tB.push(setTimeout(()=>sh.classList.remove('go'),RD?0:600))},300+k*GAP)));
tB.push(setTimeout(()=>{nb.classList.add('pop');ch[WK].classList.add('wk');tp.classList.add('on')},300+5*GAP+500))}
playA();playB();
</script></body></html>`;
fs.writeFileSync(process.argv[2], h);
console.log('ok', h.length);
