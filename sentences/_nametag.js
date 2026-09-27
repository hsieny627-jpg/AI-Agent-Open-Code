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
module.exports = { SVG, TAG: SVG() };
