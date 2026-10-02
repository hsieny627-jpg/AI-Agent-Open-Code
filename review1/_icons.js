/* review1/_icons.js — Review 1 字卡自己畫的圖示（使用者 2026-10-01 決定 8：品牌圖示自己畫、不像 logo）
 *
 * emoji 沒有的東西、或是新 emoji（Windows 舊版顯示成白框：🧋🫧🪆🛝🪄）也自己畫。
 * 一律 viewBox 0 0 100 100、class="r1i"（大小跟著字級走）。
 */
const S = (body, label) => '<svg class="r1i" viewBox="0 0 100 100" role="img" aria-label="' + label + '">' + body + '</svg>';

const ICON = {
 /* 貼紙：一張貼紙紙，上面星星、愛心、圓點，右下角一張正在撕起來 */
 stickers: S(
  '<rect x="8" y="10" width="84" height="80" rx="10" fill="#F4F1E8" stroke="#C9C2AE" stroke-width="2"/>' +
  '<path d="M30 20l5.3 10.8 11.9 1.7-8.6 8.4 2 11.8L30 47.1l-10.6 5.6 2-11.8-8.6-8.4 11.9-1.7z" fill="#FFC93C" stroke="#fff" stroke-width="2.5"/>' +
  '<path d="M70 34c-6-9-18-4-14 6 2 5 14 13 14 13s12-8 14-13c4-10-8-15-14-6z" fill="#FF6B8A" stroke="#fff" stroke-width="2.5"/>' +
  '<circle cx="28" cy="70" r="11" fill="#4FC3F7" stroke="#fff" stroke-width="2.5"/>' +
  '<path d="M52 60h30v22H60z" fill="#7ED957" stroke="#fff" stroke-width="2.5"/>' +
  '<path d="M60 82l22-22c-4 12-10 18-22 22z" fill="#DCD6C4" stroke="#B5AD95" stroke-width="1.5"/>', '貼紙'),
 /* 洋芋片：鋸齒封口的一包，前面掉出兩片 */
 chips: S(
  '<path d="M22 12h56l-4 8 4 8v44l-4 8 4 8H22l4-8-4-8V28l4-8z" fill="#F5C518" stroke="#C9971A" stroke-width="2"/>' +
  '<path d="M22 12l4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4M22 88l4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4" fill="none" stroke="#C9971A" stroke-width="2"/>' +
  '<ellipse cx="50" cy="44" rx="18" ry="11" fill="#E53935"/><text x="50" y="49" font-size="13" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif">CHIPS</text>' +
  '<path d="M30 70c6-8 20-8 24 0-5 6-18 7-24 0z" fill="#FFE08A" stroke="#D9A520" stroke-width="1.5"/>' +
  '<path d="M52 76c7-7 19-5 22 2-6 6-17 5-22-2z" fill="#FFD966" stroke="#D9A520" stroke-width="1.5"/>', '洋芋片'),
 /* 泡麵：紙杯＋蓋子掀開＋冒煙 */
 cupnoodles: S(
  '<path d="M24 38h52l-7 52H31z" fill="#FFFFFF" stroke="#BDBDBD" stroke-width="2"/>' +
  '<path d="M26 50h48l-1.6 12H27.6z" fill="#E53935"/>' +
  '<path d="M20 34h60v6H20z" fill="#F0F0F0" stroke="#BDBDBD" stroke-width="2"/>' +
  '<path d="M30 34c2-6 6-6 8 0M40 34c2-6 6-6 8 0M50 34c2-6 6-6 8 0M60 34c2-6 6-6 8 0" fill="none" stroke="#F2C14E" stroke-width="3"/>' +
  '<path d="M38 26c-4-5 4-8 0-14M50 24c-4-5 4-8 0-14M62 26c-4-5 4-8 0-14" fill="none" stroke="#B0BEC5" stroke-width="3" stroke-linecap="round"/>', '泡麵'),
 /* 軟糖：一隻小熊軟糖（半透明） */
 gummy: S(
  '<g fill="#FF5A7A" fill-opacity=".88" stroke="#C2185B" stroke-width="2">' +
  '<circle cx="34" cy="20" r="8"/><circle cx="66" cy="20" r="8"/><circle cx="50" cy="30" r="17"/>' +
  '<ellipse cx="50" cy="64" rx="22" ry="25"/><ellipse cx="25" cy="54" rx="8" ry="10"/><ellipse cx="75" cy="54" rx="8" ry="10"/>' +
  '<ellipse cx="34" cy="86" rx="10" ry="8"/><ellipse cx="66" cy="86" rx="10" ry="8"/></g>' +
  '<ellipse cx="42" cy="56" rx="5" ry="9" fill="#fff" fill-opacity=".45"/>' +
  '<circle cx="44" cy="28" r="2.4" fill="#7A0E2E"/><circle cx="56" cy="28" r="2.4" fill="#7A0E2E"/>', '小熊軟糖'),
 /* 珍珠奶茶：圓頂蓋＋粗吸管＋杯底黑珍珠 */
 bubbletea: S(
  '<path d="M28 34h44l-6 56H34z" fill="#D9B48F" stroke="#A47148" stroke-width="2"/>' +
  '<path d="M24 34c0-12 52-12 52 0z" fill="#F5F5F5" stroke="#BDBDBD" stroke-width="2"/><rect x="22" y="32" width="56" height="5" rx="2" fill="#E0E0E0"/>' +
  '<rect x="52" y="6" width="7" height="58" rx="3" fill="#EF5350" transform="rotate(12 55 35)"/>' +
  '<g fill="#3E2723"><circle cx="40" cy="82" r="4.5"/><circle cx="50" cy="84" r="4.5"/><circle cx="60" cy="82" r="4.5"/><circle cx="45" cy="75" r="4.5"/><circle cx="55" cy="75" r="4.5"/><circle cx="38" cy="72" r="4"/><circle cx="62" cy="72" r="4"/></g>', '珍珠奶茶'),
 /* 娃娃：綁辮子、穿裙子的女孩娃娃 */
 doll: S(
  '<path d="M30 30c-8 10-6 26-2 34l8-6M70 30c8 10 6 26 2 34l-8-6" fill="#6D4C41"/>' +
  '<circle cx="50" cy="30" r="17" fill="#FFD7B5" stroke="#E0A97E" stroke-width="1.5"/>' +
  '<path d="M33 28c2-14 32-14 34 0-8-6-26-6-34 0z" fill="#6D4C41"/>' +
  '<circle cx="44" cy="31" r="2.2" fill="#3E2723"/><circle cx="56" cy="31" r="2.2" fill="#3E2723"/><path d="M45 38q5 4 10 0" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round"/>' +
  '<circle cx="40" cy="36" r="2.6" fill="#FF8A80" fill-opacity=".7"/><circle cx="60" cy="36" r="2.6" fill="#FF8A80" fill-opacity=".7"/>' +
  '<path d="M40 48h20l14 32H26z" fill="#EC407A" stroke="#AD1457" stroke-width="1.5"/><path d="M26 80h48" stroke="#fff" stroke-width="3" stroke-dasharray="4 3"/>' +
  '<rect x="40" y="80" width="6" height="12" fill="#FFD7B5"/><rect x="54" y="80" width="6" height="12" fill="#FFD7B5"/>' +
  '<path d="M41 50l-12 14M59 50l12 14" stroke="#FFD7B5" stroke-width="5" stroke-linecap="round"/>', '娃娃'),
 /* 戰鬥陀螺：從上面看的陀螺（刀刃一圈）＋旋轉線 */
 beyblade: S(
  '<path d="M18 50a32 32 0 0 1 10-23M82 50a32 32 0 0 1-10 23M50 14a36 36 0 0 1 30 14M50 86a36 36 0 0 1-30-14" fill="none" stroke="#90CAF9" stroke-width="3" stroke-linecap="round"/>' +
  '<g transform="translate(50 50)"><path d="M0-30l9 12 20-2-10 13 10 13-20-2-9 12-9-12-20 2 10-13-10-13 20 2z" fill="#B0BEC5" stroke="#546E7A" stroke-width="2"/>' +
  '<circle r="16" fill="#1E88E5" stroke="#0D47A1" stroke-width="2"/><circle r="7" fill="#FFCA28" stroke="#F57F17" stroke-width="2"/></g>', '戰鬥陀螺'),
 /* 平板：橫放的平板，螢幕上有幾個 App 格子 */
 tablet: S(
  '<rect x="8" y="20" width="84" height="60" rx="8" fill="#263238" stroke="#90A4AE" stroke-width="2"/>' +
  '<rect x="15" y="26" width="70" height="48" rx="3" fill="#4FC3F7"/>' +
  '<g fill="#fff" fill-opacity=".9"><rect x="21" y="32" width="12" height="12" rx="3"/><rect x="38" y="32" width="12" height="12" rx="3"/><rect x="55" y="32" width="12" height="12" rx="3"/>' +
  '<rect x="21" y="52" width="12" height="12" rx="3"/><rect x="38" y="52" width="12" height="12" rx="3"/></g><circle cx="88.5" cy="50" r="1.6" fill="#90A4AE"/>', '平板'),
 /* YouTube 影片（決定 8）：一個螢幕＋播放三角形，灰白色 */
 youtube: S(
  '<rect x="10" y="20" width="80" height="54" rx="8" fill="#ECEFF1" stroke="#90A4AE" stroke-width="2.5"/>' +
  '<path d="M42 34v26l22-13z" fill="#78909C"/>' +
  '<rect x="18" y="80" width="64" height="5" rx="2.5" fill="#CFD8DC"/><rect x="18" y="80" width="26" height="5" rx="2.5" fill="#90A4AE"/>', '影片'),
 /* Minecraft（決定 8）：像素方塊（上面草地、側面泥土） */
 minecraft: S(
  '<path d="M50 12l36 18-36 18-36-18z" fill="#6BBF59"/>' +
  '<path d="M14 30l36 18v40L14 70z" fill="#8D5A3B"/><path d="M86 30L50 48v40l36-18z" fill="#6F4529"/>' +
  '<path d="M14 30l36 18 36-18v8L50 56 14 38z" fill="#5AA04A"/>' +
  '<g fill="#5B3A22"><rect x="20" y="48" width="7" height="7"/><rect x="32" y="62" width="7" height="7"/><rect x="22" y="66" width="6" height="6"/></g>' +
  '<g fill="#4E3119"><rect x="60" y="58" width="7" height="7"/><rect x="72" y="50" width="7" height="7"/><rect x="66" y="70" width="6" height="6"/></g>' +
  '<g fill="#7FD06A"><rect x="44" y="20" width="7" height="5"/><rect x="62" y="28" width="7" height="5"/><rect x="32" y="27" width="7" height="5"/></g>', '像素方塊'),
 /* Roblox（決定 8）：方塊人（方頭、方身體） */
 roblox: S(
  '<rect x="30" y="8" width="40" height="34" rx="4" fill="#FFD54F" stroke="#C49000" stroke-width="2"/>' +
  '<rect x="39" y="20" width="6" height="8" fill="#212121"/><rect x="55" y="20" width="6" height="8" fill="#212121"/><path d="M41 33h18" stroke="#212121" stroke-width="3"/>' +
  '<rect x="28" y="44" width="44" height="30" fill="#42A5F5" stroke="#1565C0" stroke-width="2"/>' +
  '<rect x="14" y="44" width="12" height="28" fill="#FFD54F" stroke="#C49000" stroke-width="2"/><rect x="74" y="44" width="12" height="28" fill="#FFD54F" stroke="#C49000" stroke-width="2"/>' +
  '<rect x="30" y="74" width="19" height="20" fill="#66BB6A" stroke="#2E7D32" stroke-width="2"/><rect x="51" y="74" width="19" height="20" fill="#66BB6A" stroke="#2E7D32" stroke-width="2"/>', '方塊人'),
 /* 寶可夢卡（決定 8）：一張黃框卡片＋閃電（不畫官方的球） */
 card: S(
  '<rect x="22" y="8" width="56" height="84" rx="6" fill="#FFD84D" stroke="#C9A100" stroke-width="2"/>' +
  '<rect x="28" y="20" width="44" height="34" rx="2" fill="#7EC8E3" stroke="#3E8EB0" stroke-width="1.5"/>' +
  '<path d="M54 24L42 40h8l-4 12 12-17h-8z" fill="#FFF176" stroke="#F57F17" stroke-width="1.5"/>' +
  '<rect x="28" y="60" width="44" height="5" rx="2" fill="#E8C33A"/><rect x="28" y="70" width="34" height="4" rx="2" fill="#E8C33A"/><rect x="28" y="79" width="40" height="4" rx="2" fill="#E8C33A"/>' +
  '<text x="70" y="17" font-size="8" font-weight="700" text-anchor="end" fill="#B71C1C" font-family="Arial,sans-serif">HP 60</text>', '卡片'),
 /* 寶可夢卡牌手遊：手機螢幕上一張卡 */
 cardapp: S(
  '<rect x="26" y="6" width="48" height="88" rx="9" fill="#263238" stroke="#90A4AE" stroke-width="2"/>' +
  '<rect x="31" y="14" width="38" height="70" rx="3" fill="#E3F2FD"/>' +
  '<rect x="37" y="22" width="26" height="40" rx="3" fill="#FFD84D" stroke="#C9A100" stroke-width="1.5"/>' +
  '<path d="M53 27l-7 10h5l-2 8 7-11h-5z" fill="#F57F17"/><rect x="40" y="50" width="20" height="3" rx="1.5" fill="#E8C33A"/>' +
  '<rect x="38" y="68" width="24" height="8" rx="4" fill="#42A5F5"/>', '卡牌手遊'),
 /* Splatoon（決定 8）：油漆潑灑 */
 splat: S(
  '<path d="M50 14c6 0 6 12 12 12s10-8 15-3-3 12 2 16 13 1 13 8-11 6-11 12 9 11 4 15-12-3-16 2-2 14-9 14-7-10-13-10-10 9-15 4 1-11-4-15-14 1-15-6 9-9 7-14-11-8-7-13 13 0 16-5-2-14 4-16 9 4 13 0 3-11 9-11z" fill="#FF7A00"/>' +
  '<circle cx="84" cy="22" r="5" fill="#FF7A00"/><circle cx="14" cy="80" r="6" fill="#FF7A00"/><circle cx="20" cy="18" r="3.5" fill="#FF7A00"/>' +
  '<path d="M38 40c4-8 22-8 26 2 3 10-8 20-14 18s-16-10-12-20z" fill="#8E24AA" fill-opacity=".85"/>', '油漆潑灑'),
 /* 瑪利歐賽車：卡丁車 */
 kart: S(
  '<path d="M14 62h62l10-10v-6H64l-8-12H36l-6 12H14z" fill="#E53935" stroke="#8E1B1B" stroke-width="2"/>' +
  '<rect x="38" y="36" width="16" height="10" rx="2" fill="#90CAF9"/><path d="M28 34v-12M22 22h12" stroke="#424242" stroke-width="3" stroke-linecap="round"/>' +
  '<circle cx="28" cy="68" r="11" fill="#212121"/><circle cx="28" cy="68" r="4.5" fill="#BDBDBD"/>' +
  '<circle cx="72" cy="68" r="11" fill="#212121"/><circle cx="72" cy="68" r="4.5" fill="#BDBDBD"/>' +
  '<path d="M4 54h8M2 62h8M6 46h8" stroke="#FFCA28" stroke-width="3" stroke-linecap="round"/>', '卡丁車'),
 /* 動物森友會：一座小島，有樹和小房子 */
 island: S(
  '<ellipse cx="50" cy="78" rx="44" ry="12" fill="#4FC3F7"/><ellipse cx="50" cy="72" rx="34" ry="10" fill="#FFE082"/>' +
  '<path d="M20 70c4-14 56-14 60 0z" fill="#81C784"/>' +
  '<rect x="26" y="38" width="5" height="26" fill="#795548"/><circle cx="28" cy="34" r="12" fill="#43A047"/><circle cx="22" cy="40" r="4" fill="#E53935"/>' +
  '<path d="M48 46l14-12 14 12v18H48z" fill="#FFF3E0" stroke="#8D6E63" stroke-width="2"/><path d="M45 47l17-15 17 15" fill="none" stroke="#6D4C41" stroke-width="4" stroke-linejoin="round"/>' +
  '<rect x="58" y="52" width="8" height="12" fill="#8D6E63"/>', '小島'),
 /* Switch 遊戲：掌上型遊戲機，兩邊的手把 */
 console: S(
  '<rect x="24" y="26" width="52" height="48" rx="3" fill="#37474F"/><rect x="28" y="30" width="44" height="40" rx="2" fill="#80DEEA"/>' +
  '<rect x="6" y="26" width="18" height="48" rx="9" fill="#29B6F6"/><rect x="76" y="26" width="18" height="48" rx="9" fill="#EF5350"/>' +
  '<circle cx="15" cy="40" r="4.5" fill="#263238"/><g fill="#263238"><circle cx="85" cy="36" r="2.5"/><circle cx="85" cy="46" r="2.5"/><circle cx="80" cy="41" r="2.5"/><circle cx="90" cy="41" r="2.5"/></g>' +
  '<circle cx="85" cy="60" r="4.5" fill="#263238"/><g fill="#263238"><rect x="13" y="54" width="4" height="12"/><rect x="9" y="58" width="12" height="4"/></g>', '遊戲機'),
 /* 樂高：一塊積木（上面有凸點，不畫商標字） */
 lego: S(
  '<path d="M10 46l40-18 40 18v26L50 90 10 72z" fill="#E53935"/>' +
  '<path d="M10 46l40 18v26L10 72z" fill="#C62828"/><path d="M90 46L50 64v26l40-18z" fill="#B71C1C"/>' +
  '<g fill="#EF5350" stroke="#B71C1C" stroke-width="1.5"><ellipse cx="34" cy="44" rx="8" ry="4"/><ellipse cx="50" cy="37" rx="8" ry="4"/><ellipse cx="50" cy="51" rx="8" ry="4"/><ellipse cx="66" cy="44" rx="8" ry="4"/></g>' +
  '<g fill="#F26B67"><path d="M26 44v-6a8 4 0 0 1 16 0v6a8 4 0 0 1-16 0z"/><path d="M42 37v-6a8 4 0 0 1 16 0v6a8 4 0 0 1-16 0z"/><path d="M42 51v-6a8 4 0 0 1 16 0v6a8 4 0 0 1-16 0z"/><path d="M58 44v-6a8 4 0 0 1 16 0v6a8 4 0 0 1-16 0z"/></g>' +
  '<g fill="#FF8A80"><ellipse cx="34" cy="38" rx="8" ry="4"/><ellipse cx="50" cy="31" rx="8" ry="4"/><ellipse cx="50" cy="45" rx="8" ry="4"/><ellipse cx="66" cy="38" rx="8" ry="4"/></g>', '積木'),
 /* 打棒球：球棒＋球 */
 bat: S(
  '<path d="M18 86l6 6 52-56c6-6 10-14 6-18s-12 0-18 6z" fill="#C8955C" stroke="#8D6238" stroke-width="2"/>' +
  '<rect x="12" y="80" width="10" height="16" rx="3" fill="#5D4037" transform="rotate(-45 17 88)"/>' +
  '<circle cx="76" cy="74" r="13" fill="#FAFAFA" stroke="#BDBDBD" stroke-width="2"/><path d="M68 64c5 5 5 15 0 20M84 64c-5 5-5 15 0 20" fill="none" stroke="#E53935" stroke-width="2" stroke-dasharray="3 2"/>', '球棒和球'),
 /* 羽毛球（名詞）：一顆羽球 */
 shuttle: S(
  '<path d="M30 14h40L60 66H40z" fill="#FAFAFA" stroke="#B0BEC5" stroke-width="2"/>' +
  '<path d="M40 14l3 52M50 14v52M60 14l-3 52M35 30h30M37 46h26" stroke="#CFD8DC" stroke-width="2"/>' +
  '<rect x="38" y="64" width="24" height="6" fill="#90A4AE"/><path d="M38 70h24c0 14-24 14-24 0z" fill="#ECEFF1" stroke="#90A4AE" stroke-width="2"/>', '羽毛球'),
 /* 打鼓：兩支交叉的鼓棒 */
 sticks: S(
  '<path d="M18 22l58 58M82 22L24 80" stroke="#D7A86E" stroke-width="7" stroke-linecap="round"/>' +
  '<circle cx="16" cy="20" r="6" fill="#F3D9B1"/><circle cx="84" cy="20" r="6" fill="#F3D9B1"/>', '鼓棒'),
 /* 躲避球（名詞）：一顆紅色軟球＋飛過去的線 */
 dball: S(
  '<path d="M6 40h22M4 52h22M8 64h20" stroke="#FFCA28" stroke-width="4" stroke-linecap="round"/>' +
  '<circle cx="62" cy="52" r="30" fill="#E53935" stroke="#B71C1C" stroke-width="2"/>' +
  '<path d="M38 40c14 6 34 6 48 0M38 64c14-6 34-6 48 0" fill="none" stroke="#B71C1C" stroke-width="2"/>' +
  '<ellipse cx="52" cy="38" rx="9" ry="5" fill="#fff" fill-opacity=".35"/>', '躲避球'),
 /* 漫畫：分成格子的一頁 */
 comic: S(
  '<rect x="16" y="8" width="68" height="84" rx="4" fill="#FFFDE7" stroke="#8D6E63" stroke-width="2"/>' +
  '<rect x="22" y="14" width="56" height="26" fill="#FFE082" stroke="#5D4037" stroke-width="1.5"/>' +
  '<rect x="22" y="44" width="26" height="42" fill="#90CAF9" stroke="#5D4037" stroke-width="1.5"/><rect x="52" y="44" width="26" height="42" fill="#EF9A9A" stroke="#5D4037" stroke-width="1.5"/>' +
  '<path d="M28 18h28a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H40l-6 5v-5h-6a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4z" fill="#fff" stroke="#5D4037" stroke-width="1.2"/>' +
  '<path d="M60 54l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#FFF176" stroke="#F57F17"/>', '漫畫')
};

module.exports = { ICON };
