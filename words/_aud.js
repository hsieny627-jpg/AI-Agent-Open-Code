/* words/_aud.js — 單字網站的英文預錄語音檔（2026-10-03 使用者指定：全站單字和句型的發音要最高品質）
 * 語音檔在 words/audio/en/（Kokoro v1.0 美式女聲，node words/_audio.js 產生），網頁先查 window.ENAUD，查不到才用瀏覽器語音。
 * head(輸出資料夾) ＝ 那一頁 <head> 要放的兩行（相對路徑自己算；語音檔還沒做就是空字串） */
const fs = require('fs'), path = require('path');
const EN = path.join(__dirname, 'audio', 'en');
function head(dir) {
  if (!fs.existsSync(path.join(EN, 'aud.js'))) return '';
  const rel = path.relative(dir, EN).split(path.sep).join('/') + '/';
  return '<script src="' + rel + 'aud.js" onerror="window.ENAUD=null"></script><script>window.ENDIR="' + rel + '";</script>';
}
module.exports = { head, EN };
