// 產生 listen/2026-10-15_D11/index.html（老師回答 D10：4 甲；獎狀精簡；平板動畫 A＋B 合在一起、有趣、字少；第 1、2、3、5、7、8 題還沒回答）
// 用法：node listen/2026-10-15_D11/_gen.js listen/2026-10-15_D11/index.html
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
const opt = (k, title, rec, body, pro, con) => `<div class="opt${rec ? ' rec' : ''}"><div class="hd"><b class="k">${k}</b>${title}${rec ? ' <span class="tag" style="display:inline-block;background:#3BD16F;color:#05210F;border-radius:999px;padding:0 14px;font-size:22px">建議</span>' : ''}</div>${body}${pro ? `<div class="pro">👍 ${pro}</div>` : ''}${con ? `<div class="con">⚠️ ${con}</div>` : ''}</div>`;
const tab = (inner, lab) => `<div class="dev"><div class="lab">📱 ${lab || '學生平板（小華 ＝ 30412）'}</div>${inner}</div>`;
const COL = ['#2F7BE8', '#9B59D0', '#00A6A6', '#2EB85C', '#FFB300'];
const TIPS = ['請 再多練 1 天', '請 再做完 1 次', '請 看完、聽完 再選', '請 把答錯的 再做一次', '請 再多練 幾分鐘'];
const WK = ITEMS.indexOf(WEAK);
const css = `
.mk{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}.mk.one{grid-template-columns:1fr}
@media (max-width:900px){.mk{grid-template-columns:1fr}}
.dev{border:6px solid #3A4650;border-radius:26px;background:#000;padding:10px 12px 14px;text-align:center}
.dev .lab{font-size:22px;color:#B9C4CE;text-align:left;margin-bottom:6px}
.dev .t1{font-size:36px;color:#FFE07A;line-height:1.3}
.ev td,.ev th{font-size:24px;overflow-wrap:anywhere}
@media (max-width:900px){.ev,.ev tbody,.ev tr,.ev td,.ev th{display:block;width:100%}.ev tr:first-child{display:none}.ev tr{margin-bottom:12px;border:3px solid #2A3540;border-radius:12px}}
.ans{background:#1A1400;border:4px solid #FFD54A;border-radius:20px;padding:14px 20px;margin:30px 0;font-size:28px}
.now{color:#FFB38A}.new{color:#9FF0B8}
.cert{background:#FFF8E6;color:#3A2A00;border:10px double #C9A227;border-radius:6px;padding:14px;text-align:center}
.cert .c0{font-size:40px;color:#8A5A00;letter-spacing:.3em}.cert .c1{font-size:44px;color:#3A2A00}.cert .c2{font-size:30px}.cert .c3{font-size:24px;color:#6A5A3A}
.rp{display:inline-block;background:#2A3540;color:#fff;border:0;border-radius:12px;font:inherit;font-size:24px;padding:6px 18px;margin-top:8px;cursor:pointer;min-height:48px}
.tipx{font-size:30px;color:#FFD54A;margin-top:6px;opacity:0;transform:scale(.6);transition:.5s cubic-bezier(.3,1.6,.5,1)}.tipx.on{opacity:1;transform:none}
/* 甲 花：五片花瓣（一片最多 20），長滿 ＝ 100 */
.flw{position:relative;width:min(380px,calc(100% - 100px));aspect-ratio:1;margin:56px auto 50px;container-type:inline-size}
.flw>svg{position:absolute;inset:0;width:100%;height:100%}
.flw .gh{fill:none;stroke:#55606A;stroke-width:3;stroke-dasharray:8 7}
.flw .pt{transform-box:view-box;transform-origin:200px 150px;transform:scale(0)}
.flw.go .pt{transition:transform .9s cubic-bezier(.3,1.7,.5,1)}
.flw .sway{transform-box:view-box;transform-origin:200px 200px}
.flw.done .sway{animation:sway 2.4s ease-in-out infinite}
@keyframes sway{50%{transform:rotate(4deg)}}
.flw .cen{position:absolute;left:50%;top:50%;width:34%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:#FFD54A;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#3A2A00;box-shadow:0 0 0 6px #B8860B}
.flw .cen b{font-size:max(30px,14cqw);line-height:1}.flw .cen span{font-size:max(20px,6cqw)}
.flw.done .cen{animation:pop .6s}
@keyframes pop{50%{transform:translate(-50%,-50%) scale(1.25)}}
.flw .ic{position:absolute;transform:translate(-50%,-50%) scale(0);text-align:center;transition:transform .5s cubic-bezier(.3,1.7,.5,1);line-height:1}
.flw .ic.on{transform:translate(-50%,-50%) scale(1)}
.flw .ic b{display:block;font-size:24px;color:#fff;margin-top:2px}
.flw .ic.wk{animation:wig .5s ease-in-out infinite}
@keyframes wig{0%,100%{transform:translate(-50%,-50%) rotate(-10deg) scale(1.15)}50%{transform:translate(-50%,-50%) rotate(10deg) scale(1.15)}}
/* 乙 瓶子：五層一層一層掉進來，倒滿 ＝ 100 */
.btl{display:flex;justify-content:center;align-items:flex-end;gap:10px;margin:10px auto}
.bt{position:relative;width:170px;height:360px;border:6px solid #CFE3F5;border-top:0;border-radius:0 0 30px 30px;overflow:hidden;background:#0B1118}
.bt .top{position:absolute;left:0;right:0;top:0;border-top:4px dashed #FFD54A}
.bt .ly{position:absolute;left:0;right:0;display:flex;align-items:center;justify-content:center;border-top:3px solid #000;transform:translateY(-420px);opacity:0}
.btl.go .ly{transition:transform .8s cubic-bezier(.3,1.4,.5,1),opacity .2s}
.bt .ly.on{transform:none;opacity:1}
.bt .ly.wk{animation:blk .6s ease-in-out infinite}
@keyframes blk{50%{filter:brightness(1.6)}}
.bsc{display:flex;flex-direction:column;justify-content:space-between;height:360px;font-size:24px;color:#FFD54A;text-align:left}
.bnum{font-size:48px;color:#FFE07A}
`;
const FC = 200, R_IC = 182;
const petal = 'M200 150C160 122 166 70 200 48C234 70 240 122 200 150Z';
const flower = () => `<div class="flw" id="fl"><svg viewBox="0 0 400 400"><g class="sway">${ITEMS.map((i, k) => `<g transform="rotate(${k * 72} 200 200)"><path class="gh" d="${petal}"/><path class="pt" d="${petal}" fill="${COL[k]}" data-s="${(i.s / 20).toFixed(2)}"/></g>`).join('')}</g></svg>
${ITEMS.map((i, k) => { const a = k * 72 * Math.PI / 180, x = 50 + R_IC / 4 * Math.sin(a), y = 50 - R_IC / 4 * Math.cos(a); return `<div class="ic" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%">${i.ic(k >= 2 ? '40px' : '46px')}<b>${i.s}</b></div>`; }).join('')}
<div class="cen"><b id="fn">0</b><span>／100</span></div></div>`;
const H = 360;
let acc = 0;
const bottle = () => `<div class="btl" id="bl"><div class="bt">${ITEMS.map((i, k) => { const hh = i.s / 100 * H, b = acc; acc += hh; return `<div class="ly" style="bottom:${b}px;height:${hh}px;background:${COL[k]}">${i.ic(k >= 2 ? '34px' : '38px')}</div>`; }).join('')}<div class="top"></div></div><div class="bsc"><span>100</span><span class="bnum" id="bn">0</span><span>0</span></div></div>`;

let h = head.replace('<title>榮譽榜怎麼給</title>', '<title>用心程度動畫</title>').replace('</style>', css + '</style></head><body><div class="wrap">');
h += `<h1>❓ 「用心程度」：再問老師 4 題</h1>
<div class="lead">老師回答 D10：第 4 題 甲、獎狀要精簡、動畫要把 A 和 B 合在一起、有趣、字少。<b>老師選好，再用小華（30412）對一次，老師說「對」才改網站。</b></div>
<div class="howto">✅ 已經決定：「最用心」下面寫「<b>用心程度 ${TOT} 分</b>」（D10 第 4 題 甲）。</div>`;

/* 1 其他 6 題 */
h += `<h2>❓ 第 1 題：D10 的第 1、2、3、5、7、8 題，老師還沒回答</h2>
<table class="ev"><tr><th>題</th><th>建議</th></tr>
<tr><td>1 五項的名字</td><td>這週 練了 幾天／做完 幾次 題目、遊戲／看完、聽完 才選／答錯的 改對了／這週 練習 幾分鐘</td></tr>
<tr><td>2 換掉 🐢 ✨ 🕒</td><td>${EYE('44px')}　${FIX('44px')}　${CLK('44px')}（自己畫的）</td></tr>
<tr><td>3 最用心的圖示</td><td>${HRT('60px')} 獎牌上面有愛心</td></tr>
<tr><td>5 要關心格子</td><td>只多一行「${HRT('30px')} 用心 ${TOT}」</td></tr>
<tr><td>7 看字卡、按 🔊</td><td>要記（小華 這週 練習 30 分鐘 ➜ 48 分鐘）</td></tr>
<tr><td>8 五項怎麼算</td><td>每項最多 20 分；小華 15＋20＋16＋16＋20 ＝ ${TOT} 分</td></tr></table>`;
h += opt('A', '全部照建議', 1, '', '', '');
h += opt('B', '我要改（寫「第幾題 ➜ 改成什麼」）', 0, '', '', '');

/* 2 獎狀 */
const cert = (inner) => `<div class="cert">${inner}</div>`;
h += `<h2>❓ 第 2 題：獎狀怎麼精簡？</h2>
<table class="ev"><tr><th>現在（D10）</th><th>改之後（甲）</th></tr><tr><td>${cert(`<div class="c0">榮譽狀</div><div class="c2">三年級 304 班 30412 小華</div><div class="c2">榮獲 304 班「最用心」第 2 名</div><div class="c3">用心程度 ${TOT} 分</div>`)}</td>
<td>${cert(`<div class="c0">榮譽狀</div><div class="c1">小華</div><div class="c2">304 班 最用心 第 2 名</div><div class="c3">用心程度 ${TOT} 分</div>`)}</td></tr></table>
<div class="why">刪掉「三年級」（304 就是三年級）、「30412」、「榮獲」和引號；名字放最大。</div>`;
h += opt('甲', '名字一行放最大＋「304 班 最用心 第 2 名」＋「用心程度 87 分」（右邊那一張）', 1, '', '一眼看到名字和名次', '');
h += opt('乙', '再少一行：不寫「用心程度 87 分」', 0, `<div style="max-width:420px">${cert(`<div class="c0">榮譽狀</div><div class="c1">小華</div><div class="c2">304 班 最用心 第 2 名</div>`)}</div>`, '最短', '看不到他做到了什麼');

/* 3 套用到哪幾種 */
h += `<h2>❓ 第 3 題：精簡的寫法，要用在哪幾種獎狀？</h2>
<div class="why">「原本的寫法太囉唆」有兩種意思，所以要問：</div>`;
h += opt('A', '四種獎狀都改成一樣精簡', 1, `<div class="mk">${cert(`<div class="c0">榮譽狀</div><div class="c1">小華</div><div class="c2">304 班 最認真練習 第 2 名</div><div class="c3">這週 練習 48 分鐘</div>`)}${cert(`<div class="c0">榮譽狀</div><div class="c1">小華</div><div class="c2">304 班 最用心 第 2 名</div><div class="c3">用心程度 ${TOT} 分</div>`)}</div>`, '四種獎狀長得一樣（最認真練習、成績最優、進步最多、最用心）；班級獎狀也一樣精簡', '');
h += opt('B', '只有「最用心」精簡，另外三種照現在', 0, '', '', '四種獎狀長得不一樣');

/* 4 動畫 */
h += `<h2>❓ 第 4 題：平板動畫（A＋B 合在一起：看得出每一項幾分，也看得出滿分 100）</h2>
<div class="why">畫面上只有：「這週 用心程度」、圖示、數字、最後一句「💡 請 …」。按〔▶ 再看一次〕。</div>`;
h += opt('甲', '開花：一片花瓣 ＝ 一項，一片一片長出來；虛線 ＝ 長滿的樣子；五片都長滿 ＝ 100', 1,
  tab(`<div class="t1">這週 用心程度</div>${flower()}<div class="tipx" id="ft">💡 ${TIPS[WK]}</div><button class="rp" onclick="playF()">▶ 再看一次</button>`),
  '每一片長多長 ＝ 那一項幾分（B 的優點）；整朵花 ＝ 100，缺哪一片一看就知道（A 的優點）；花會彈出來、會搖', '');
h += opt('乙', '倒滿瓶子：五層一層一層掉進瓶子；倒到金色虛線 ＝ 100', 0,
  tab(`<div class="t1">這週 用心程度</div>${bottle()}<div class="tipx" id="bt">💡 ${TIPS[WK]}</div><button class="rp" onclick="playB()">▶ 再看一次</button>`),
  '離 100 還差多少很清楚', '每一層的數字要看高度，比較不明顯');

h += `<div class="ans">✍️ 例：「<b>1A 2甲 3A 4甲</b>」。看不懂哪一題，直接說「第幾題看不懂」。</div></div>
<script>
const ITS=${JSON.stringify(ITEMS.map(i => i.s))},WK=${WK},RD=matchMedia('(prefers-reduced-motion: reduce)').matches,GAP=RD?0:650;
let tF=[],tB=[];
function up(el,from,to){const t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/500);el.textContent=Math.round(from+(to-from)*p);if(p<1)requestAnimationFrame(f)})(t0)}
function playF(){tF.forEach(clearTimeout);tF=[];const fl=document.getElementById('fl'),pts=fl.querySelectorAll('.pt'),ics=fl.querySelectorAll('.ic'),fn=document.getElementById('fn'),ft=document.getElementById('ft');
fl.classList.remove('go','done');pts.forEach(p=>p.style.transform='scale(0)');ics.forEach(i=>i.classList.remove('on','wk'));ft.classList.remove('on');fn.textContent='0';void fl.offsetWidth;fl.classList.add('go');let s=0;
ITS.forEach((v,k)=>tF.push(setTimeout(()=>{pts[k].style.transform='scale('+pts[k].dataset.s+')';ics[k].classList.add('on');up(fn,s,s+v);s+=v},300+k*GAP)));
tF.push(setTimeout(()=>{fl.classList.add('done');ics[WK].classList.add('wk');ft.classList.add('on')},300+5*GAP+500))}
function playB(){tB.forEach(clearTimeout);tB=[];const bl=document.getElementById('bl'),ls=bl.querySelectorAll('.ly'),bn=document.getElementById('bn'),bt=document.getElementById('bt');
bl.classList.remove('go');ls.forEach(l=>l.classList.remove('on','wk'));bt.classList.remove('on');bn.textContent='0';void bl.offsetWidth;bl.classList.add('go');let s=0;
ITS.forEach((v,k)=>tB.push(setTimeout(()=>{ls[k].classList.add('on');up(bn,s,s+v);s+=v},300+k*GAP)));
tB.push(setTimeout(()=>{ls[WK].classList.add('wk');bt.classList.add('on')},300+5*GAP+500))}
playF();playB();
</script></body></html>`;
fs.writeFileSync(process.argv[2], h);
console.log('ok', h.length);
