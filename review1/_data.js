/* review1/_data.js — Review 1 物品／活動單字卡的唯一真相來源（三、四年級共用；使用者 2026-10-01 指定）
 *
 * 名單、類別、證據數字：**只能照** sentences/review1_單字名單_查證.md 那一列的備註（已打開核對的出處），
 * 不再上網找、不改名單。字源／字的結構另外查證，每一條附出處；不確定的不放。
 *
 * 一個字一筆：
 *   f    檔名（片語用 - 連起來：play-basketball.html）
 *   en   英文（片語照查證檔的寫法，例：play with LEGO）
 *   zh   中文
 *   g    組別：i1 物品1、i2 物品2、a1 活動1、a2 活動2
 *   cat  類別（查證檔那一格）
 *   ic   幕① 的大圖示（emoji 或 ICON 裡自己畫的 SVG）
 *   tk   逐字：[英文, 中文（'' ＝ 下面空白）, 圖示（'' ＝ 沒有）]；物品只有一格
 *   pt   幕② 的「字的結構」一行（{{單字}} ＝ 可以點來聽；沒有查證的字不寫）
 *   ex   幕③ 的整句中文
 *   ev   出處第 1 條：人氣證據（小圖表）
 *   et   出處第 2 條：字源／結構（Etymonline 等，有查證才放）
 */

/* ── 音標／音節（跟 words/_phonics.js 的 RAW 同一種寫法；build 會檢查字母接得回去、一個音節一個母音）──
 * 音標：Cambridge Dictionary 美式；KK：台灣課本標法。
 * 音節：開音節切法（母音後面切）；**合成字、加字尾的字照零件切**（basket．ball、stick．ers），
 * 讓學生看得到「字的結構」（2026-10-01 樣品，等使用者確認）。 */
const RAW = {
 i:          'i|aɪ|aɪ',
 like:       'l|l|l i|aɪ|aɪ k|k|k e|-|-',
 to:         't|t|t o|ə|ə',
 play:       'p|p|p l|l|l ay|eɪ|e',
 stick:      's|s|s t|t|t i|ɪ|ɪ ck|k|k',
 sticker:    's|s|s t|t|t i|ɪ|ɪ ck|k|k / er|ɚ|ɚ',
 stickers:   's|s|s t|t|t i|ɪ|ɪ ck|k|k / er|ɚ|ɚ s|z|z',
 basket:     'b|b|b a|æ|æ s|s|s / k|k|k e|ə|ə t|t|t',
 ball:       'b|b|b a|ɑː|ɔ ll|l|l',
 basketball: 'b|b|b a|æ|æ s|s|s / k|k|k e|ə|ə t|t|t / b|b|b a|ɑː|ɔ ll|l|l'
};

/* ── 自己畫的圖示（品牌不放官方 logo；emoji 沒有的東西也自己畫）── */
const ICON = {
 /* 貼紙：一張貼紙紙，上面星星、愛心、圓點，右下角一張正在撕起來 */
 stickers: '<svg class="r1i" viewBox="0 0 100 100" aria-hidden="true">' +
  '<rect x="8" y="10" width="84" height="80" rx="10" fill="#F4F1E8" stroke="#C9C2AE" stroke-width="2"/>' +
  '<path d="M30 20l5.3 10.8 11.9 1.7-8.6 8.4 2 11.8L30 47.1l-10.6 5.6 2-11.8-8.6-8.4 11.9-1.7z" fill="#FFC93C" stroke="#fff" stroke-width="2.5"/>' +
  '<path d="M70 34c-6-9-18-4-14 6 2 5 14 13 14 13s12-8 14-13c4-10-8-15-14-6z" fill="#FF6B8A" stroke="#fff" stroke-width="2.5"/>' +
  '<circle cx="28" cy="70" r="11" fill="#4FC3F7" stroke="#fff" stroke-width="2.5"/>' +
  '<path d="M52 60h30v22H60z" fill="#7ED957" stroke="#fff" stroke-width="2.5"/>' +
  '<path d="M60 82l22-22c-4 12-10 18-22 22z" fill="#DCD6C4" stroke="#B5AD95" stroke-width="1.5"/></svg>'
};

const WORDS = [
 {f:'stickers', en:'stickers', zh:'貼紙', g:'i1', cat:'玩具', ic:ICON.stickers,
  tk:[['stickers','貼紙',ICON.stickers]],
  pt:'🧩 {{stick}} 黏住 ＋ <b class="nosay">er</b> ＝ <b>會黏住的東西</b>',
  ex:'我喜歡貼紙。',
  ev:{t:'📊 小學生真的愛貼紙嗎？', flag:'jp', who:'日本小學生',
      bars:[{p:77.5,l:'正熱衷<b>收集貼紙</b>'},{p:90,l:'有貼紙本的：<b>會跟朋友交換</b>',txt:'9 成'}], kids:8, kw:'小學生',
      s:'ニフティキッズ「シール」調查（日本小中學生 2,484 人，2025-12-23～2026-01-26）；共同通信 OVO 報導 2026-03-02',
      d:'<b>77.5%</b> 的小學生<b>正熱衷收集貼紙</b>；有貼紙本的，<b>九成</b>會交換。'},
  et:{t:'🧩 sticker ＝ stick ＋ er',
      eq:[['🩹','stick','黏住'],['👤','er','會做這件事的'],[ICON.stickers,'sticker','會黏住的東西 ＝ 貼紙']],
      s:'Etymonline「sticker (n.)」',
      d:'<b>stick</b>（黏住）＋ <b>-er</b> ＝ <b>會黏住的東西</b>。「貼紙」這個意思從 <b>1871 年</b>開始用（<b>大約 150 年前</b>）。'}},
 {f:'play-basketball', en:'play basketball', zh:'打籃球', g:'a1', cat:'球類運動', ic:'⛹️',
  tk:[['play','打','⛹️'],['basketball','籃球','🏀']],
  pt:'🧩 {{basket}} 籃子 ＋ {{ball}} 球',
  ex:'我喜歡打籃球。',
  ev:{t:'📊 台灣小朋友愛打籃球嗎？', flag:'tw', who:'台灣國中小男生',
      bars:[{p:59.4,l:'<b>最喜歡籃球</b>'}], kids:6, kw:'男生',
      s:'金車教育基金會 國中小學生運動調查；聯合報報導 2026-05-27',
      d:'<b>59.4%</b> 的男生<b>最喜歡籃球</b>。'},
  et:{t:'🧩 basketball ＝ basket ＋ ball',
      eq:[['🧺','basket','籃子'],['⚽','ball','球'],['🏀','basketball','籃球']],
      s:'Etymonline「basketball (n.)」',
      d:'<b>basket</b>（籃子）＋ <b>ball</b>（球）。<b>1891 年</b>，在美國教體育的 <b>James Naismith</b> 發明這個運動，<b>1892 年</b>開始叫 basketball（<b>大約 130 年前</b>）。'}}
];

module.exports = { RAW, ICON, WORDS };
