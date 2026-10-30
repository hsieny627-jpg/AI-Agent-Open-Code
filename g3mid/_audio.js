/* g3mid/_audio.js — 三年級 複習 會唸的英文，全部預先做成語音檔（HiFi-Captain 美式女聲／男聲，跟全站一樣）
 * 老師第 4 點「聽力速度稍微放慢、發音清晰」➜ 句子 語速 0.85（全站 1）；
 * 單獨一個字 語速 0.92（2026-10-25 量過：0.85 的 pig、vest 電腦聽寫 8 次 聽成 egg、fest；0.92 聽得對）➜ audio/w/（ENAUDW）。
 *   TTS_MODELS=<模型資料夾> node g3mid/_audio.js     然後再跑一次 node g3mid/_build.js
 * 只會做新的，舊的不重做；不再用到的會刪掉（tools/audio_pack.js）。 */
const path = require('path');
const { pack } = require('../tools/audio_pack');
const SAY = require('./_data').SAY, one = t => typeof t === 'string' && !/[\s.,?!]/.test(t.replace(/^m:/, ''));
const r = pack({ texts: SAY.filter(t => !one(t)), dir: path.join(__dirname, 'audio'), varName: 'ENAUD', speed: 0.85 });
const w = pack({ texts: SAY.filter(one), dir: path.join(__dirname, 'audio/w'), varName: 'ENAUDW', speed: 0.92 });
/* 2026-10-26 第二十六次 第 1-1 點（老師：打地鼠 單字 模糊、太快，學生 聽不懂）——試過 再 用 電腦 聽寫（Whisper）比：
   女聲 放慢（0.78、0.85）、女聲 拉長 時間（atempo）都 會 糊掉（egg ➜ a、girl ➜ purl、cat ➜ hat）；**男聲 0.8 最 清楚**（只有 vest 聽成 Fest）。
   每個 字 挑 聽寫 對 的 速度：m1（打地鼠 平常 唸、數字 金幣磚 答對）＝ 男聲 0.8，vest 用 0.7、two 用 0.72（0.8 聽成 do）；m2（〔🐢 慢慢 唸〕）＝ 男聲 0.65，pig 用 0.75。ant 聽成 and（美式 同音，全站 一樣）。
   做 一次 存 在 audio/m1、audio/m2（檔名 ＝ 聲音＋速度＋字），已經 有 的 不 重做（沒有 TTS 模型 也 可以 build） */
const fs = require('fs'), os = require('os'), crypto = require('crypto');
function slowM(dir, varName, base, alt) {
  const out = path.join(__dirname, 'audio', dir), man = {}, need = {};
  fs.mkdirSync(out, { recursive: true });
  require('./_data').SAYM.forEach(w => { const sp = alt[w] || base, nm = crypto.createHash('sha1').update('hfc_m|' + sp + '|' + w).digest('hex').slice(0, 12) + '.mp3';
    man[w] = [nm, sp]; if (!fs.existsSync(path.join(out, nm))) (need[sp] = need[sp] || []).push(w); });
  Object.keys(need).forEach(sp => { const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'g3m-'));
    pack({ texts: need[sp].map(w => 'm:' + w), dir: tmp, varName: 'X', speed: +sp });
    const M = JSON.parse(/=\s*(\{[\s\S]*\});/.exec(fs.readFileSync(path.join(tmp, 'aud.js'), 'utf8'))[1]);
    need[sp].forEach(w => { fs.copyFileSync(path.join(tmp, M['m:' + w][0]), path.join(out, man[w][0])); man[w][1] = M['m:' + w][1]; }); });
  fs.readdirSync(out).forEach(f => { if (/\.mp3$/.test(f) && !Object.values(man).some(x => x[0] === f)) fs.unlinkSync(path.join(out, f)); });
  if (Object.keys(need).length || !fs.existsSync(path.join(out, 'aud.js'))) {
    const old = fs.existsSync(path.join(out, 'aud.js')) ? JSON.parse(/=\s*(\{[\s\S]*\});/.exec(fs.readFileSync(path.join(out, 'aud.js'), 'utf8'))[1]) : {};
    Object.keys(man).forEach(w => { if (!need[man[w][1]] && old[w] && old[w][0] === man[w][0]) man[w][1] = old[w][1]; });
    fs.writeFileSync(path.join(out, 'aud.js'), '/* g3mid/_audio.js 產生：打地鼠 的 字（男聲 慢）*/\nwindow.' + varName + '=' + JSON.stringify(man) + ';\n'); }
  return Object.keys(man).length; }
console.log('打地鼠 慢 ' + slowM('m1', 'ENAUDM', 0.8, { vest: 0.7, two: 0.72 }) + ' 個、更慢 ' + slowM('m2', 'ENAUDS', 0.65, { pig: 0.75 }) + ' 個（男聲）');
console.log('g3mid 語音檔：句子 ' + r.total + ' 個（新做 ' + r.made + '）、單字 ' + w.total + ' 個（新做 ' + w.made + '）');
