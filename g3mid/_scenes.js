/* g3mid/_scenes.js — 三年級 對話 情境 圖（2026-10-31 第三十五次 第 5 點）
 * 老師：「A: Thank you. B: You're welcome.」「Nice to meet you. / Nice to meet you, too.」這種 題目 的 圖示 學生 看不懂，一直 跑來 問。
 * 原本 ＝ 一排 3 個 emoji（🎁➡️🥰、🧒🤝👧…）➜ 學生 要 自己 猜 是 什麼 事。
 * 現在 ＝ 一格 漫畫：兩個 小朋友 真的 在 做 那一件 事（畫面 上 沒有 英文 字，不 洩題），會 動 一次：
 *   thank  女生 把 禮物 遞給 男生 ➜ 男生 收到、開心、冒 愛心          （Thank you. ／ You're welcome.）
 *   meet   兩個 第一次 見面 的 小朋友 握手、另一隻 手 揮 一揮、星星    （Nice to meet you. ／ …too.）
 *   help   女生 哭、想著 狗＋紅色 問號；男生 拿 放大鏡 舉手 要 幫忙    （I can't find my dog. ／ I can help you.）
 *   come   男生 一隻 手 招手、張嘴 叫；狗 往 他 跑 過來（速度 線）      （Come here.）
 *   morn   太陽 從 山 後面 升起來、兩個 背 書包 的 小朋友 揮手         （Good morning.）
 * 只用 SVG（不 需要 圖片 檔，離線 也 有）；同一份 給 網頁（字串）和 量測 用。 */
const SK = '#F6C9A0', SK2 = '#E9B48A', LN = '#3A2A1E';
/* 一個 小朋友：x 中心、g 女生、shirt 上衣 顏色、hair 頭髮 顏色、face smile／happy／cry／open、aL aR ＝ 左右 手 的 手掌 位置 [x,y]（相對 肩膀 的 絕對 座標） */
function kid(x, o) {
  const y = 64, sh = o.shirt || '#4A90E2', hr = o.hair || '#3B2414', fx = o.flip ? -1 : 1;
  const sl = [x - 11, y + 4], sr = [x + 11, y + 4], aL = o.aL || [x - 18, y + 30], aR = o.aR || [x + 18, y + 30];
  const arm = (s, h, c) => `<path d="M${s[0]},${s[1]} Q${(s[0] + h[0]) / 2 + (h[0] < s[0] ? -4 : 4)},${(s[1] + h[1]) / 2 + 4} ${h[0]},${h[1]}" stroke="${sh}" stroke-width="7" fill="none" stroke-linecap="round"${c ? ` class="${c}"` : ''}/><circle cx="${h[0]}" cy="${h[1]}" r="4.2" fill="${SK}" stroke="${SK2}" stroke-width="1"${c ? ` class="${c}"` : ''}/>`;
  const face = {
    smile: `<path d="M${x - 5},${y - 13} q5,5 10,0" stroke="${LN}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    happy: `<path d="M${x - 6},${y - 14} q6,8 12,0 z" fill="#C0392B" stroke="${LN}" stroke-width="1.2"/><circle cx="${x - 9}" cy="${y - 16}" r="2.6" fill="#FF8FA3" opacity=".7"/><circle cx="${x + 9}" cy="${y - 16}" r="2.6" fill="#FF8FA3" opacity=".7"/>`,
    cry: `<path d="M${x - 5},${y - 10} q5,-5 10,0" stroke="${LN}" stroke-width="1.8" fill="none" stroke-linecap="round"/><path class="tear" d="M${x - 7},${y - 18} q-2,5 0,7 q2,-2 0,-7z" fill="#5DADE2"/><path class="tear t2" d="M${x + 7},${y - 18} q-2,5 0,7 q2,-2 0,-7z" fill="#5DADE2"/>`,
    open: `<ellipse cx="${x + 1 * fx}" cy="${y - 12}" rx="3.6" ry="4.2" fill="#C0392B" stroke="${LN}" stroke-width="1.2"/>`
  }[o.face || 'smile'];
  const eyes = o.face === 'cry'
    ? `<path d="M${x - 8},${y - 22} q3,2 6,0 M${x + 2},${y - 22} q3,2 6,0" stroke="${LN}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
    : `<circle cx="${x - 5}" cy="${y - 21}" r="2.1" fill="${LN}"/><circle cx="${x + 5}" cy="${y - 21}" r="2.1" fill="${LN}"/>`;
  const hair = o.g
    ? `<path d="M${x - 15},${y - 18} q0,-20 15,-20 q15,0 15,20 q-4,-10 -15,-11 q-11,1 -15,11z" fill="${hr}"/><path d="M${x - 15},${y - 20} q-4,14 2,22 M${x + 15},${y - 20} q4,14 -2,22" stroke="${hr}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="${x + 13}" cy="${y - 34}" r="3.5" fill="#FF6FA8"/>`
    : `<path d="M${x - 14},${y - 20} q0,-18 14,-18 q14,0 14,18 q-6,-9 -14,-9 q-8,0 -14,9z" fill="${hr}"/>`;
  const legs = `<path d="M${x - 5},${y + 34} v18 M${x + 5},${y + 34} v18" stroke="#2C3E50" stroke-width="6" stroke-linecap="round"/><ellipse cx="${x - 6}" cy="${y + 53}" rx="5" ry="2.6" fill="#222"/><ellipse cx="${x + 6}" cy="${y + 53}" rx="5" ry="2.6" fill="#222"/>`;
  const body = o.g
    ? `<path d="M${x - 11},${y + 1} h22 l6,34 h-34z" fill="${sh}"/>`
    : `<rect x="${x - 11}" y="${y + 1}" width="22" height="34" rx="6" fill="${sh}"/>`;
  const bag = o.bag ? `<rect x="${x - 19 * fx - (fx < 0 ? 0 : 0)}" y="${y + 4}" width="9" height="20" rx="3" fill="${o.bag}" transform="translate(${fx < 0 ? -9 : 0},0)"/>` : '';
  return `<g class="${o.c || ''}">${bag}${legs}${body}${arm(sl, aL, o.cL)}${arm(sr, aR, o.cR)}<circle cx="${x}" cy="${y - 18}" r="15" fill="${SK}" stroke="${SK2}" stroke-width="1"/>${hair}${eyes}${face}</g>`;
}
const dog = (x, y, c) => `<g class="${c || ''}"><ellipse cx="${x}" cy="${y}" rx="17" ry="10" fill="#C98B4E"/><circle cx="${x - 17}" cy="${y - 9}" r="9" fill="#C98B4E"/><ellipse cx="${x - 19}" cy="${y - 11}" rx="4" ry="7" fill="#7A4A22" transform="rotate(20 ${x - 19} ${y - 11})"/><circle cx="${x - 20}" cy="${y - 10}" r="1.6" fill="#222"/><circle cx="${x - 25.5}" cy="${y - 7}" r="2" fill="#222"/><path d="M${x - 22},${y - 3} q2,4 4,0" fill="#E74C3C"/><path d="M${x + 16},${y - 4} q9,-8 8,-14" stroke="#C98B4E" stroke-width="4" fill="none" stroke-linecap="round" class="wag"/><path d="M${x - 10},${y + 8} v9 M${x - 3},${y + 8} v9 M${x + 6},${y + 8} v9 M${x + 12},${y + 8} v9" stroke="#C98B4E" stroke-width="4" stroke-linecap="round"/></g>`;
const heart = (x, y, s, c) => `<path class="${c || ''}" d="M${x},${y + 6 * s} c-${9 * s},-${6 * s} -${9 * s},-${14 * s} -${3 * s},-${15 * s} c${2 * s},0 ${3 * s},${2 * s} ${3 * s},${3 * s} c0,-${1 * s} ${1 * s},-${3 * s} ${3 * s},-${3 * s} c${6 * s},${1 * s} ${6 * s},${9 * s} -${3 * s},${15 * s}z" fill="#FF4D79"/>`;
const star = (x, y, r, c) => `<path class="${c || ''}" d="M${x},${y - r} L${x + r * .3},${y - r * .3} L${x + r},${y} L${x + r * .3},${y + r * .3} L${x},${y + r} L${x - r * .3},${y + r * .3} L${x - r},${y} L${x - r * .3},${y - r * .3}z" fill="#FFD54A"/>`;
const floor = (c1, c2) => `<rect x="0" y="0" width="200" height="130" rx="12" fill="${c1}"/><rect x="0" y="110" width="200" height="20" fill="${c2}"/>`;
const SVG = {
  thank: floor('#E8F4FF', '#CFE3F5') +
    kid(52, { g: 1, shirt: '#FF8FB1', face: 'smile', aR: [84, 84], aL: [40, 94] }) +
    kid(150, { shirt: '#4A90E2', face: 'happy', aL: [122, 82], aR: [162, 92] }) +
    `<g class="gift"><rect x="88" y="72" width="26" height="20" rx="3" fill="#E74C3C"/><rect x="99" y="72" width="5" height="20" fill="#FFD54A"/><rect x="86" y="68" width="30" height="7" rx="2" fill="#C0392B"/><path d="M101,68 q-10,-10 -12,-2 q2,4 12,2 q10,2 12,-2 q-2,-8 -12,2" fill="#FFD54A"/></g>` +
    heart(150, 16, 1.1, 'pop') + heart(168, 28, .7, 'pop p2'),
  meet: floor('#FFF6E0', '#F2E2B8') +
    kid(62, { g: 1, shirt: '#9B59B6', face: 'happy', aR: [98, 80], aL: [36, 26], cL: 'wave' }) +
    kid(138, { shirt: '#27AE60', face: 'happy', aL: [102, 80], aR: [164, 26], cR: 'wave w2' }) +
    `<g class="shake"><circle cx="100" cy="80" r="6" fill="${SK}" stroke="${SK2}"/></g>` + star(100, 60, 7, 'tw') + star(84, 66, 4, 'tw t2') + star(116, 66, 4, 'tw t3'),
  help: floor('#EAF7EE', '#CFE9D6') +
    kid(50, { g: 1, shirt: '#F39C12', face: 'cry', aL: [36, 50], aR: [64, 50] }) +
    `<g class="think"><circle cx="70" cy="30" r="3" fill="#fff" stroke="#9AA"/><circle cx="78" cy="22" r="4.5" fill="#fff" stroke="#9AA"/><ellipse cx="102" cy="22" rx="24" ry="17" fill="#fff" stroke="#9AA" stroke-width="1.5"/><g transform="translate(100,25) scale(.62) translate(-100,-25)">${dog(100, 25)}</g><text x="117" y="20" font-size="22" font-weight="700" fill="#E53935" font-family="Arial">?</text></g>` +
    kid(152, { shirt: '#2E86DE', face: 'smile', aL: [128, 74], aR: [168, 22], cR: 'wave' }) +
    `<g class="mag"><circle cx="124" cy="66" r="8" fill="#CFEFFF" fill-opacity=".6" stroke="#555" stroke-width="3"/><path d="M118,72 l-7,8" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/></g>`,
  come: floor('#EEF3FF', '#D3DEF5') +
    kid(46, { shirt: '#16A085', face: 'open', aR: [72, 40], aL: [30, 94], cR: 'beck' }) +
    `<path d="M66,30 q6,-4 10,0 M68,22 q8,-5 13,1" stroke="#16A085" stroke-width="2.5" fill="none" stroke-linecap="round" class="call"/>` +
    `<g class="run">${dog(142, 96)}<path d="M166,86 h18 M168,94 h22 M166,102 h16" stroke="#8FA4C8" stroke-width="3" stroke-linecap="round"/></g>`,
  morn: `<defs><linearGradient id="smg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB37A"/><stop offset="1" stop-color="#FFE9B8"/></linearGradient></defs><rect x="0" y="0" width="200" height="130" rx="12" fill="url(#smg)"/>` +
    `<g class="sun"><circle cx="100" cy="56" r="20" fill="#FFC93C"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M${100 + 25 * Math.cos(a * Math.PI / 180)},${56 + 25 * Math.sin(a * Math.PI / 180)} L${100 + 33 * Math.cos(a * Math.PI / 180)},${56 + 33 * Math.sin(a * Math.PI / 180)}" stroke="#FFC93C" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>` +
    `<path d="M0,84 q50,-26 100,-6 q50,-22 100,2 v50 h-200z" fill="#7BC67E"/><rect x="0" y="110" width="200" height="20" fill="#5DAA61"/>` +
    kid(42, { g: 1, shirt: '#E84393', face: 'happy', aR: [64, 26], aL: [30, 94], cR: 'wave', bag: '#2E86DE' }) +
    kid(158, { shirt: '#0984E3', face: 'happy', aL: [136, 26], aR: [170, 94], cL: 'wave w2', bag: '#E17055', flip: 1 })
};
const CSS = `.scv{display:block;width:100%;height:auto;max-height:100%;border-radius:12px;overflow:visible}
.scv .gift{animation:scgift 2.4s ease-in-out infinite}@keyframes scgift{0%,15%{transform:translateX(-14px)}45%,100%{transform:translateX(16px)}}
.scv .pop{transform-box:fill-box;transform-origin:center;animation:scpop 2.4s ease-in-out infinite}.scv .p2{animation-delay:.25s}@keyframes scpop{0%,45%{transform:scale(0);opacity:0}60%{transform:scale(1.3);opacity:1}75%,100%{transform:scale(1);opacity:1}}
.scv .shake{animation:scshake .7s ease-in-out infinite}@keyframes scshake{0%,100%{transform:translateY(-3px)}50%{transform:translateY(3px)}}
.scv .wave{transform-box:fill-box;transform-origin:50% 100%;animation:scwave .9s ease-in-out infinite alternate}.scv .w2{animation-delay:.45s}@keyframes scwave{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
.scv .tw{transform-box:fill-box;transform-origin:center;animation:sctw 1.2s ease-in-out infinite}.scv .t2{animation-delay:.4s}.scv .t3{animation-delay:.8s}@keyframes sctw{0%,100%{transform:scale(.6);opacity:.5}50%{transform:scale(1.2);opacity:1}}
.scv .tear{animation:sctear 1.1s ease-in infinite}.scv .tear.t2{animation-delay:.5s}@keyframes sctear{0%{transform:translateY(0);opacity:1}100%{transform:translateY(9px);opacity:0}}
.scv .mag{transform-box:fill-box;transform-origin:center;animation:scmag 1.4s ease-in-out infinite}@keyframes scmag{0%,100%{transform:rotate(-8deg) translate(0,0)}50%{transform:rotate(8deg) translate(-3px,-3px)}}
.scv .think{animation:scthink 2s ease-in-out infinite}@keyframes scthink{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.scv .beck{transform-box:fill-box;transform-origin:0% 100%;animation:scbeck .6s ease-in-out infinite alternate}@keyframes scbeck{from{transform:rotate(-12deg)}to{transform:rotate(12deg)}}
.scv .call{animation:sccall .8s ease-in-out infinite}@keyframes sccall{0%,100%{opacity:.2}50%{opacity:1}}
.scv .run{animation:scrun 1.6s ease-in-out infinite}@keyframes scrun{0%{transform:translateX(24px)}100%{transform:translateX(-18px)}}
.scv .wag{transform-box:fill-box;transform-origin:0% 100%;animation:scwag .25s ease-in-out infinite alternate}@keyframes scwag{from{transform:rotate(-15deg)}to{transform:rotate(15deg)}}
.scv .sun{animation:scsun 2.6s ease-out infinite}@keyframes scsun{0%{transform:translateY(26px)}60%,100%{transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){.scv *{animation:none!important}}`;
const svg = k => SVG[k] ? `<svg class="scv sc-${k}" viewBox="0 0 200 130" role="img" aria-label="${k}" xmlns="http://www.w3.org/2000/svg">${SVG[k]}</svg>` : '';
module.exports = { SVG, CSS, svg, KEYS: Object.keys(SVG) };
