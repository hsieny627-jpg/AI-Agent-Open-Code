/* words/_audio_sv.js — 瑞典文的語音檔（使用者 2026-09-25 指定：要附上真實正確的瑞典語發音）
 *
 *   TTS_MODELS=<模型資料夾> node words/_audio_sv.js
 *
 * 很多電腦沒有瑞典文語音，瀏覽器會用英文腔亂唸。所以把網頁上所有 data-lang="sv-SE" 的字，
 * 用 Piper sv_SE-nst（瑞典國家圖書館 KBLab 用瑞典母語者錄音訓練的神經語音，CC0）先做成 mp3，
 * 放在 words/audio/sv/，網頁唸瑞典文時先查 audio/sv/aud.js（_phonics.js 的 say()）。
 * 掃的是「已經產生好的 .html」，所以改完頁面要先 build，再跑這一支，再 build 一次（讓頁面載入 aud.js）。
 */
const fs = require('fs'), path = require('path');
const { pack } = require('../tools/audio_pack');
const ROOT = path.join(__dirname, '..');
const dirs = [__dirname, path.join(ROOT, 'G3 - L1 + L2', 'numbers'), path.join(ROOT, 'G3 - L1 + L2', 'sight')];
const T = [];
dirs.filter(d => fs.existsSync(d)).forEach(d => fs.readdirSync(d).filter(f => /\.html$/.test(f)).forEach(f => {
  const h = fs.readFileSync(path.join(d, f), 'utf8');
  /* data-say="…" data-lang="sv-SE"（屬性順序兩種都抓） */
  const re = /data-say="([^"]+)"\s+data-lang="sv-SE"|data-lang="sv-SE"\s+data-say="([^"]+)"/g; let m;
  while ((m = re.exec(h))) T.push((m[1] || m[2]).replace(/&amp;/g, '&'));
  /* JSON 裡的（猜猜看的幕是 JSON 寫進頁面的） */
  const rj = /data-say=\\"([^\\"]+)\\" data-lang=\\"sv-SE\\"/g;
  while ((m = rj.exec(h))) T.push(m[1]);
}));
const r = pack({ texts: T, dir: path.join(__dirname, 'audio', 'sv'), lang: 'sv', varName: 'SVAUD' });
console.log('瑞典文語音檔：' + r.total + ' 個（這次新做 ' + r.made + ' 個）');
