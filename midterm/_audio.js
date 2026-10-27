/* midterm/_audio.js — 四年級 期中複習 會唸的英文，全部預先做成語音檔（HiFi-Captain 美式女聲／男聲，跟全站一樣）
 *   TTS_MODELS=<模型資料夾> node midterm/_audio.js     然後再跑一次 node midterm/_build.js
 * 只會做新的，舊的不重做；不再用到的會刪掉（tools/audio_pack.js）。
 * 2026-10-26 第二十七次 第 6 點（老師：字首音氣球、聲音雙胞胎 單字 模糊、太快、字首音 聽不清楚；原則 ＝ 清晰、稍微 放慢、美式 正確）
 *   照「三年級 複習」（g3mid/_audio.js）量過 的 做法：
 *   單字 ＝ 男聲 慢 0.8 ➜ audio/m1（ENAUDM）；〔🐢 慢慢 唸〕＝ 男聲 0.65 ➜ audio/m2（ENAUDSL）；電腦 聽寫（tools/asr_check.py）不對 的 字 個別 換 速度（ALT1、ALT2）
 *   句子（答錯頁、短文 偵探）＝ 語速 0.85 ➜ audio/s（ENAUDF；男聲 'm:'）*/
const path = require('path'), fs = require('fs'), os = require('os'), crypto = require('crypto');
const { pack } = require('../tools/audio_pack');
const D = require('./_data');
const r = pack({ texts: D.SAY, dir: path.join(__dirname, 'audio'), varName: 'ENAUD' });
const s = pack({ texts: D.SAYS, dir: path.join(__dirname, 'audio/s'), varName: 'ENAUDF', speed: 0.85 });
/* 2026-10-26 第二十八次：句子（I’m seventeen.）也 用 男聲 慢 ➜ 鑰匙 要 跟 網頁 的 akey 一樣（’ ➜ '、小寫）*/
const AK = w => String(w).replace(/[’]/g, "'").replace(/[=＝≠➜→⇒…＿_　]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
function slowM(dir, varName, base, alt) {
  const out = path.join(__dirname, 'audio', dir), man = {}, need = {};
  fs.mkdirSync(out, { recursive: true });
  /* alt 的 值：數字 ＝ 男聲 換 速度；'f0.9' ＝ 換 女聲 0.9（twelve、twenty 的 tw 男聲 慢 唸 電腦 一直 聽成 wealth、wenty） */
  D.SAYM.forEach(w => { const sp = String(alt[w] || base), nm = crypto.createHash('sha1').update('hfc_m|' + sp + '|' + w).digest('hex').slice(0, 12) + '.mp3';
    man[AK(w)] = [nm, +sp.replace(/^f/, '')]; if (!fs.existsSync(path.join(out, nm))) (need[sp] = need[sp] || []).push(w); });
  Object.keys(need).forEach(sp => { const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mt-'));
    const fv = /^f/.test(sp), pf = fv ? '' : 'm:';
    pack({ texts: need[sp].map(w => pf + w), dir: tmp, varName: 'X', speed: +sp.replace(/^f/, '') });
    const M = JSON.parse(/=\s*(\{[\s\S]*\});/.exec(fs.readFileSync(path.join(tmp, 'aud.js'), 'utf8'))[1]);
    need[sp].forEach(w => { const k = pf + AK(w); fs.copyFileSync(path.join(tmp, M[k][0]), path.join(out, man[AK(w)][0])); man[AK(w)][1] = M[k][1]; }); });
  fs.readdirSync(out).forEach(f => { if (/\.mp3$/.test(f) && !Object.values(man).some(x => x[0] === f)) fs.unlinkSync(path.join(out, f)); });
  const old = fs.existsSync(path.join(out, 'aud.js')) ? JSON.parse(/=\s*(\{[\s\S]*\});/.exec(fs.readFileSync(path.join(out, 'aud.js'), 'utf8'))[1]) : {};
  Object.keys(man).forEach(w => { if (!need[man[w][1]] && old[w] && old[w][0] === man[w][0]) man[w][1] = old[w][1]; });
  fs.writeFileSync(path.join(out, 'aud.js'), '/* midterm/_audio.js 產生：單字（男聲 慢）*/\nwindow.' + varName + '=' + JSON.stringify(man) + ';\n');
  return Object.keys(man).length; }
const ALT1 = { twelve: 'f0.9', twenty: 'f0.9', pot: 0.75, pen: 0.8, mom: 'f0.72' }, ALT2 = { twelve: 'f0.9', twenty: 'f0.9', brother: 0.75, dad: 0.75, pen: 0.65, pot: 0.56, ten: 0.64, tent: 0.65, eleven: 0.56 };   /* 2026-10-27 第三十二次：放慢 以後 聽寫 聽錯 的 再 換（tools/asr_check.py 全對 才 算） */   /* 電腦 聽寫 聽錯 的 字 ➜ 換 速度（量過 再 填） */
/* 2026-10-27 第三十二次 第 2-(2) 點（老師：b／p、d／t 聽不清楚）：再 放慢（0.8 ➜ 0.72、0.65 ➜ 0.6），第一個 音 比較 清楚；電腦 聽寫 每一個 都 要 對 */
console.log('單字 慢 ' + slowM('m1', 'ENAUDM', 0.72, ALT1) + ' 個、更慢 ' + slowM('m2', 'ENAUDSL', 0.6, ALT2) + ' 個（男聲）');
console.log('midterm 語音檔：' + r.total + ' 個（新做 ' + r.made + '）、慢句子 ' + s.total + ' 個（新做 ' + s.made + '）');
