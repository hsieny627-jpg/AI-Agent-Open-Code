/* tools/syl_ph.js — 音節動畫「一段一段唸」的聲音（使用者 2026-10-03 指定：唸到哪一個音節，那個音節放大變亮）
 *
 * 每一個音節照 words/_phonics.js（或 review1/_data.js）的 RAW 音標，換成 Kokoro 模型用的音標，
 * 交給 tools/audio_pack.js 做成語音檔（鑰匙「syl 單字 第幾段」，第幾段從 0 開始）。
 * 不是看字母猜（sti·ckers 的 sti 唸 /stɪ/，不會變成 sty）。
 * 一段單獨唸的時候一律當重音唸（老師拍手數音節也是這樣），所以輕音 /ə/ ➜ /ʌ/、/ɚ/ ➜ /ɝ/。
 */
const MAP = {
  'aɪ': 'I', 'aʊ': 'W', 'eɪ': 'A', 'oʊ': 'O', 'ɔɪ': 'Y', 'e': 'ɛ', 'iː': 'i', 'uː': 'u', 'juː': 'j u', 'ks': 'k s',
  'dʒ': 'ʤ', 'tʃ': 'ʧ', 'r': 'ɹ', 'ɑː': 'ɑ', 'ɑːr': 'ɑ ɹ', 'ɔː': 'ɔ', 'ɜːr': 'ɜ ɹ', 'ɝː': 'ɜ ɹ', 'ɚ': 'ɜ ɹ',
  'ə': 'ʌ', 'əl': 'ʌ l', 'wʌ': 'w ʌ'
};
const VOW = /[aæɑʌəɚɜɝeɛɪioɔʊuɒAIOWY]/;
/* 一個音節（字母群陣列）➜ Kokoro 音標字串，重音記號放在母音前面 */
function one(sy) {
  const out = [];
  let st = false;
  sy.forEach(g => {
    if (!g.i || g.i === '-') return;
    const ph = (MAP[g.i] || g.i.split('').join(' ')).split(' ');
    ph.forEach(p => {
      if (!st && VOW.test(p)) { out.push('ˈ'); st = true; }
      out.push(p);
    });
  });
  return out.join(' ');
}
/* 回傳 [{k:'syl 單字 0', ph:'…'}, …]（只收兩個音節以上的字） */
function texts(DATA, words) {
  const T = [];
  (words || Object.keys(DATA)).forEach(w => {
    const d = DATA[String(w).toLowerCase()];
    if (!d || d.length < 2) return;
    d.forEach((sy, k) => T.push({ k: 'syl ' + String(w).toLowerCase() + ' ' + k, ph: one(sy) }));
  });
  return T;
}
module.exports = { texts, one };
