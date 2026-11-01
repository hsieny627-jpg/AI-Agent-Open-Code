/* sentences/_nametag.js — 「name」的秒懂圖示（使用者 2026-09-27 指定：更有質感、更好認）
 * 一張真的「HELLO my name is」名牌貼紙：紅底白字 HELLO、下面白色的寫名字區。
 * SVG 向量圖，跟著字的大小（em）縮放，放多大都清楚；所有 name 的圖示一律用這一個。 */
const SVG = (nm = 'Ken') => '<svg class="nmsvg" viewBox="0 0 140 100" role="img" aria-label="name" ' +
  'style="width:1.4em;height:1em;vertical-align:-.14em;overflow:visible;filter:drop-shadow(0 .05em .08em rgba(0,0,0,.35))">' +
  '<rect x="3" y="3" width="134" height="94" rx="14" fill="#E53935" stroke="#9F1B1B" stroke-width="3"/>' +
  '<path d="M9 12q0-6 6-6h110q6 0 6 6v8H9z" fill="#fff" opacity=".16"/>' +
  '<text x="70" y="31" text-anchor="middle" font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900" font-size="27" letter-spacing="2" fill="#fff">HELLO</text>' +
  '<text x="70" y="45" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="11.5" fill="#FFE3E0">my name is</text>' +
  '<rect x="12" y="51" width="116" height="38" rx="6" fill="#fff"/>' +
  '<text x="70" y="80" text-anchor="middle" font-family="Chalkboard SE,Comic Sans MS,Marker Felt,cursive" font-weight="700" font-size="27" fill="#1B3A8A">' + nm + '</text>' +
  '</svg>';
/* 2026-11-01 第三十九次 第 3 點（老師：What’s your name? 秒懂 動畫 的 name 圖示 ➜ 更 精緻、更 有 代表性、更 合適）：
 * 掛 在 脖子 上 的 「HELLO my name is」名牌（掛繩＋金屬 夾子＋透明 套子 反光＋紅色 漸層 HELLO＋手寫 名字＋筆 寫 底線）。
 * 只 用 在 🎬 秒懂 複習 動畫、🌟 生活 情境（g3mid）；其他 地方 照舊 用 上面 的 SVG（2026-09-27 老師 指定）。nm ＝ '?' ＝ 問 名字。 */
const BADGE = (nm = '?') => { const q = nm === '?'; return '<svg class="nmbadge" viewBox="0 0 160 190" role="img" aria-label="name" ' +
  'style="width:.95em;height:1.15em;vertical-align:-.2em;overflow:visible;filter:drop-shadow(0 .04em .07em rgba(0,0,0,.4))">' +
  '<defs><linearGradient id="nbR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF5A4E"/><stop offset="1" stop-color="#C62828"/></linearGradient>' +
  '<linearGradient id="nbS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
  '<linearGradient id="nbL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1E5BD8"/><stop offset="1" stop-color="#3D8BFF"/></linearGradient></defs>' +
  /* 掛繩 */ '<path d="M38 4 L66 58 M122 4 L94 58" stroke="url(#nbL)" stroke-width="13" stroke-linecap="round" fill="none"/>' +
  '<path d="M38 4 L66 58 M122 4 L94 58" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="5 6" fill="none"/>' +
  /* 夾子 */ '<rect x="66" y="50" width="28" height="20" rx="5" fill="#B8C2CC" stroke="#6E7A86" stroke-width="2.5"/><rect x="73" y="66" width="14" height="12" rx="3" fill="#8D99A6"/>' +
  /* 套子 */ '<rect x="10" y="74" width="140" height="110" rx="14" fill="#EEF4FA" stroke="#9FB2C4" stroke-width="3"/>' +
  /* 名牌 */ '<rect x="18" y="82" width="124" height="94" rx="9" fill="url(#nbR)"/>' +
  '<text x="80" y="108" text-anchor="middle" font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900" font-size="25" letter-spacing="2" fill="#fff">HELLO</text>' +
  '<text x="80" y="122" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="11.5" fill="#FFE3E0">my name is</text>' +
  '<rect x="26" y="128" width="108" height="40" rx="5" fill="#fff"/>' +
  '<text x="80" y="' + (q ? 160 : 157) + '" text-anchor="middle" font-family="Chalkboard SE,Comic Sans MS,Marker Felt,cursive" font-weight="700" font-size="' + (q ? 32 : (nm.length > 5 ? 22 : 26)) + '" fill="' + (q ? '#E53935' : '#1B3A8A') + '">' + nm + '</text>' +
  (q ? '' : '<path d="M40 162 q40 5 80 0" stroke="#1B3A8A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>') +
  /* 反光 */ '<path d="M14 78 h70 l-40 102 h-30 a8 8 0 0 1-0-0z" fill="url(#nbS)"/>' +
  '</svg>'; };
module.exports = { SVG, TAG: SVG(), BADGE };
