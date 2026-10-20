/* rpg/_tre_art.js — 舊的 10 種寶物（t01～t10）的圖（2026-10-20 第十五次：老師「先用 AI 畫的，老師的圖來了再換」）
 *   node rpg/_tre_art.js   ➜ rpg/tre/t01.svg … t10.svg
 * 老師的圖（一張 5 欄 ✕ 2 列，順序 t01～t10）來了 ➜ 存成 rpg/tre_sheet.jpg ➜ python3 -I rpg/_crop_shop.py 會切成 rpg/tre/tNN.jpg，
 * rpg/_build.js 的 treImg() 有 .jpg 就用 .jpg（老師的），沒有才用這裡的 .svg。 */
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'tre'); fs.mkdirSync(OUT, { recursive: true });
/* 共用：深色卡片＋那一種顏色的光暈＋一圈細金線 */
function card(id, glow, body, defs) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">
<defs>
<radialGradient id="bg" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="${glow}" stop-opacity=".55"/><stop offset=".55" stop-color="#141B33" stop-opacity="1"/><stop offset="1" stop-color="#05070E"/></radialGradient>
<linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".35" stop-color="#FFD54A"/><stop offset=".65" stop-color="#C98A1A"/><stop offset="1" stop-color="#FFE58A"/></linearGradient>
<filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="gl2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
${defs || ''}
</defs>
<rect x="2" y="2" width="196" height="196" rx="26" fill="url(#bg)"/>
<rect x="6" y="6" width="188" height="188" rx="22" fill="none" stroke="url(#gd)" stroke-width="2.2" opacity=".85"/>
${body}
${spark(28, 32, 5)}${spark(172, 40, 4)}${spark(166, 168, 5)}${spark(34, 162, 3.5)}
</svg>`;
}
function spark(x, y, r) { return `<path d="M${x} ${y - r * 2}L${x + r * .45} ${y - r * .45}L${x + r * 2} ${y}L${x + r * .45} ${y + r * .45}L${x} ${y + r * 2}L${x - r * .45} ${y + r * .45}L${x - r * 2} ${y}L${x - r * .45} ${y - r * .45}Z" fill="#FFF8D8" filter="url(#gl)" opacity=".9"/>`; }
function rays(cx, cy, n, r0, r1, col, op) { let s = ''; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, b = a + Math.PI / n * .45;
  s += `<path d="M${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0}L${cx + Math.cos(a) * r1} ${cy + Math.sin(a) * r1}L${cx + Math.cos(b) * r1} ${cy + Math.sin(b) * r1}Z" fill="${col}" opacity="${op}"/>`; } return s; }
const A = {
  /* ① ✨ 光環 Golden Halo：頭上的金色光圈 */
  t01: card('t01', '#FFD54A', `${rays(100, 92, 16, 20, 92, '#FFE9A8', .16)}
<ellipse cx="100" cy="92" rx="62" ry="20" fill="none" stroke="#FFE07A" stroke-width="16" filter="url(#gl2)" opacity=".8"/>
<ellipse cx="100" cy="92" rx="62" ry="20" fill="none" stroke="url(#gd)" stroke-width="11"/>
<ellipse cx="100" cy="89" rx="58" ry="17" fill="none" stroke="#FFFBE6" stroke-width="2.5" opacity=".9"/>
<path d="M60 150q40-22 80 0" stroke="#FFE9A8" stroke-width="3" fill="none" opacity=".35"/>
${spark(100, 66, 6)}${spark(150, 104, 4)}${spark(52, 80, 3.5)}`),
  /* ② 🧥 披風 Hero Cape：紅色英雄披風＋金色扣子 */
  t02: card('t02', '#FF4A3A', `<defs><linearGradient id="cp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF5A4A"/><stop offset=".5" stop-color="#C21A1A"/><stop offset="1" stop-color="#5A0606"/></linearGradient></defs>
<path d="M70 46Q100 58 130 46L162 168Q140 156 124 172Q110 156 100 174Q90 156 76 172Q60 156 38 168Z" fill="url(#cp)" stroke="#2A0000" stroke-width="2"/>
<path d="M84 60Q78 120 62 160M116 60Q122 120 138 160M100 62V166" stroke="#FF8A7A" stroke-width="2.5" fill="none" opacity=".45"/>
<path d="M66 44Q100 64 134 44" stroke="url(#gd)" stroke-width="7" fill="none" stroke-linecap="round"/>
<circle cx="100" cy="52" r="11" fill="url(#gd)" stroke="#6A3A00" stroke-width="2"/><path d="M100 45l2.4 5h5l-4 3.4 1.6 5.2-5-3-5 3 1.6-5.2-4-3.4h5z" fill="#B0161A"/>`),
  /* ③ 👣 閃亮腳印 Sparkle Footprints：一排發光的腳印 */
  t03: card('t03', '#FFB52E', ['M48 150', 'M82 122', 'M118 96', 'M152 70'].map((m, i) => { const x = [48, 82, 118, 152][i], y = [150, 122, 96, 70][i], s = .8 + i * .07;
    return `<g transform="translate(${x} ${y}) rotate(${i % 2 ? 18 : -10}) scale(${s})" filter="url(#gl)"><ellipse cx="0" cy="6" rx="10" ry="15" fill="#FFE07A"/><circle cx="-8" cy="-14" r="3.6" fill="#FFF0B0"/><circle cx="-2" cy="-17" r="3.8" fill="#FFF0B0"/><circle cx="5" cy="-16" r="3.4" fill="#FFF0B0"/><circle cx="10" cy="-11" r="3" fill="#FFF0B0"/></g>`; }).join('') + spark(66, 92, 4) + spark(138, 128, 4)),
  /* ④ 🎆 登場煙火 Entrance Fireworks */
  t04: card('t04', '#B57BFF', [[70, 78, 40, '#FF6B9A'], [134, 66, 32, '#7FD4FF'], [116, 132, 36, '#FFD54A']].map(([x, y, r, c]) => {
    let s = `<circle cx="${x}" cy="${y}" r="${r * .9}" fill="${c}" opacity=".18" filter="url(#gl2)"/>`;
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; s += `<path d="M${x + Math.cos(a) * r * .25} ${y + Math.sin(a) * r * .25}L${x + Math.cos(a) * r} ${y + Math.sin(a) * r}" stroke="${c}" stroke-width="3.2" stroke-linecap="round" filter="url(#gl)"/><circle cx="${x + Math.cos(a) * (r + 5)}" cy="${y + Math.sin(a) * (r + 5)}" r="2.4" fill="#FFF8E0"/>`; }
    return s + `<circle cx="${x}" cy="${y}" r="5" fill="#fff" filter="url(#gl)"/>`; }).join('') + '<path d="M116 186Q114 160 116 140" stroke="#FFE9A8" stroke-width="2.5" stroke-dasharray="4 5" fill="none" opacity=".7"/>'),
  /* ⑤ 🖼 金色名字框 Golden Name Frame */
  t05: card('t05', '#FFD54A', `<rect x="26" y="66" width="148" height="70" rx="14" fill="#1A1206" stroke="url(#gd)" stroke-width="9" filter="url(#gl)"/>
<rect x="36" y="76" width="128" height="50" rx="8" fill="none" stroke="#FFF2B8" stroke-width="1.6" opacity=".7"/>
${[[26, 66], [174, 66], [26, 136], [174, 136]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="url(#gd)" stroke="#6A3A00" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="3.4" fill="#C21A6A"/>`).join('')}
<path d="M100 50l8 14h-16z" fill="url(#gd)"/><circle cx="100" cy="48" r="5" fill="#5AD8FF" filter="url(#gl)"/>
<text x="100" y="111" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="28" fill="#FFE9A8" letter-spacing="3">30412</text>`),
  /* ⑥ 😎 英雄表情 Cool Emote：戴墨鏡的表情泡泡 */
  t06: card('t06', '#5AD8FF', `<path d="M40 46h120a18 18 0 0 1 18 18v62a18 18 0 0 1-18 18H96l-26 22 4-22H40a18 18 0 0 1-18-18V64a18 18 0 0 1 18-18z" fill="#F7FAFF" stroke="#BFE6FF" stroke-width="3" filter="url(#gl)"/>
<circle cx="100" cy="95" r="36" fill="#FFCC33" stroke="#D9930A" stroke-width="3"/>
<path d="M70 86h60l-4 14q-8 8-20 0l-3-8h-6l-3 8q-12 8-20 0z" fill="#121212"/><path d="M76 90l8 0M108 90l8 0" stroke="#fff" stroke-width="2.5" opacity=".7"/>
<path d="M84 112q16 12 32 0" stroke="#7A3A00" stroke-width="4" fill="none" stroke-linecap="round"/>`),
  /* ⑦ 🙌 勝利姿勢 Victory Pose：舉手勝利的剪影＋光芒 */
  t07: card('t07', '#FFB52E', `${rays(100, 104, 18, 30, 96, '#FFD54A', .22)}
<circle cx="100" cy="104" r="40" fill="#FFE07A" opacity=".3" filter="url(#gl2)"/>
<g fill="#0B0F1A" stroke="#FFE07A" stroke-width="2.4" filter="url(#gl)"><circle cx="100" cy="72" r="13"/>
<path d="M88 88h24l6 46-6 4-4 34h-8l-2-30h-4l-2 30h-8l-4-34-6-4z"/><path d="M90 92L66 48l-7 5 22 46zM110 92l24-44 7 5-22 46z"/></g>
<path d="M58 44l4 6 6-4-2 7 7 2-7 2 2 7-6-4-4 6-1-7-7-1 6-4-4-6 7 2z" fill="#FFF0B0"/><path d="M142 44l4 6 6-4-2 7 7 2-7 2 2 7-6-4-4 6-1-7-7-1 6-4-4-6 7 2z" fill="#FFF0B0"/>`),
  /* ⑧ 🌌 星空背景 Starry Sky */
  t08: card('t08', '#7A4BFF', `<rect x="14" y="14" width="172" height="172" rx="18" fill="#090A2A"/>
<path d="M14 150Q70 110 120 92T186 40V70Q140 100 100 120T14 178Z" fill="#B57BFF" opacity=".28" filter="url(#gl2)"/>
<path d="M14 140Q70 100 120 84T186 34" stroke="#FFD3F5" stroke-width="10" opacity=".18" fill="none" filter="url(#gl2)"/>
${Array.from({ length: 34 }, (_, i) => `<circle cx="${18 + (i * 53) % 166}" cy="${18 + (i * 37 + i * i * 7) % 164}" r="${[.9, 1.4, 2][i % 3]}" fill="#fff" opacity="${.5 + (i % 4) * .15}"/>`).join('')}
<circle cx="146" cy="56" r="18" fill="#FFF3C4" filter="url(#gl)"/><circle cx="154" cy="50" r="16" fill="#090A2A"/>
<path d="M14 172q30-16 60-6t60-4 52 8v6H14z" fill="#05061A"/>${spark(60, 60, 4)}`),
  /* ⑨ 🎩 寵物帽子 Pet Top Hat */
  t09: card('t09', '#5AB0FF', `<defs><linearGradient id="ht" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14161E"/><stop offset=".45" stop-color="#3A3F52"/><stop offset="1" stop-color="#0B0C12"/></linearGradient></defs>
<ellipse cx="100" cy="146" rx="70" ry="16" fill="#0B0C12" stroke="#5A6078" stroke-width="2"/>
<path d="M62 64q38-12 76 0v80q-38 12-76 0z" fill="url(#ht)" stroke="#5A6078" stroke-width="2"/>
<ellipse cx="100" cy="64" rx="38" ry="9" fill="#2A2E3C" stroke="#6A7090" stroke-width="2"/>
<path d="M62 118q38 12 76 0v14q-38 12-76 0z" fill="#C21A3A"/>
<circle cx="120" cy="126" r="8" fill="url(#gd)" stroke="#6A3A00" stroke-width="1.5"/>
<path d="M76 70v66" stroke="#fff" stroke-width="3" opacity=".18"/>${spark(144, 70, 5)}`),
  /* ⑩ 💠 發光武器框 Glowing Weapon Frame：藍色發光菱形框＋劍 */
  t10: card('t10', '#42F2FF', `<path d="M100 22L178 100L100 178L22 100Z" fill="#06223A" stroke="#42F2FF" stroke-width="14" opacity=".45" filter="url(#gl2)"/>
<path d="M100 22L178 100L100 178L22 100Z" fill="none" stroke="#7FF6FF" stroke-width="6" filter="url(#gl)"/>
<path d="M100 40L160 100L100 160L40 100Z" fill="none" stroke="#BFFBFF" stroke-width="1.6" opacity=".7"/>
<g transform="rotate(45 100 100)" filter="url(#gl)"><path d="M96 42h8l2 78h-12z" fill="#E8FBFF" stroke="#5ACFFF" stroke-width="1.6"/><path d="M100 36l6 8h-12z" fill="#fff"/>
<rect x="80" y="118" width="40" height="8" rx="3" fill="url(#gd)"/><rect x="96" y="126" width="8" height="24" rx="2" fill="#3A2A12"/><circle cx="100" cy="154" r="6" fill="url(#gd)"/></g>`)
};
Object.keys(A).forEach(id => fs.writeFileSync(path.join(OUT, id + '.svg'), A[id]));
console.log('rpg/tre：' + Object.keys(A).length + ' 張');
