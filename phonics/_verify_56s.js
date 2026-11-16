/* phonics/_verify_56s.js — 第五十六次 聲音（老師 聽 P55 的 回答）：試聽頁 P56 每 個 A／B 都 有、網站 用 A、長度 合理（node phonics/_verify_56s.js；只 印 失敗）*/
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname, LI = path.join(D, '..', 'listen', '2026-11-16_P56'); const E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const dur = f => +execFileSync('ffprobe', ['-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const L = { s_ae: [0.25, 0.7], s_k: [0.02, 0.12], s_ed: [0.02, 0.2], s_ek: [0.05, 0.3], s_em: [0.15, 0.45], s_en: [0.15, 0.45], cl_strong_0_3: [0.2, 0.9], cl_angry_1_2: [0.1, 0.5] };
for (const c in L) { for (const v of ['A', 'B']) ok(fs.existsSync(path.join(LI, c + '_' + v + '.mp3')), c + '_' + v + ' 沒有');
  ok(fs.existsSync(path.join(LI, 'v55', c + '.mp3')), c + ' 舊 的 沒 留');
  ok(fs.readFileSync(path.join(D, 'au', c + '.mp3')).equals(fs.readFileSync(path.join(LI, c + '_A.mp3'))), c + ' 網站 不是 A');
  const d = dur(path.join(D, 'au', c + '.mp3')); ok(d >= L[c][0] && d <= L[c][1], c + ' 長度 ' + d); }
const h = fs.readFileSync(path.join(LI, 'index.html'), 'utf8'); ok((h.match(/\],?\n?\['|\]\];/g) || []).length >= 1 && /s_ae/.test(h) && /cl_angry_1_2/.test(h), '試聽頁 不 完整');
console.log(E.join('\n') + (E.length ? '\n' : '') + 'phonics 第五十六次 聲音：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0);
