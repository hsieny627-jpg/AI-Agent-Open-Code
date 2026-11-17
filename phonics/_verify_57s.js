/* phonics/_verify_57s.js — 第五十七次 聲音（老師 聽 P56 的 回答）：a ＝ 老師 音檔、K 吹氣 加長、字尾 d ＝ 舊 的、字尾 k ＝ B、n 大聲、gr 刪 尾音；試聽頁 P57（node phonics/_verify_57s.js；只 印 失敗）
 * ＋新 的 聲音：進階版 新 字尾、拼音 地圖 每 一個 合 規則 的 組合、課本 兩 音節 字 w_c57_*、s_oy */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname, LI = path.join(D, '..', 'listen', '2026-11-17_P57'), P56 = path.join(D, '..', 'listen', '2026-11-16_P56'); const E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const dur = f => +execFileSync('ffprobe', ['-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const vol = f => { const o = execFileSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], { stdio: ['ignore', 'ignore', 'pipe'] }).toString(); return 0; };
const same = (a, b) => fs.readFileSync(a).equals(fs.readFileSync(b)), AU = c => path.join(D, 'au', c + '.mp3');
ok(same(AU('s_ae'), path.join(LI, 's_ae_A.mp3')), 'a 網站 不是 老師 的 音檔（A）'); { const d = dur(AU('s_ae')); ok(d > .3 && d < .8, 'a 長度 ' + d); }
for (const v of ['A', 'B']) ok(fs.existsSync(path.join(LI, 's_k_' + v + '.mp3')), 'K ' + v + ' 沒有'); ok(same(AU('s_k'), path.join(LI, 's_k_A.mp3')), 'K 網站 不是 A');
{ const a = dur(path.join(LI, 's_k_A.mp3')), b = dur(path.join(LI, 's_k_B.mp3')), o = dur(path.join(LI, 'v56', 's_k.mp3')); ok(a > o + .015 && b > a, 'K 吹氣 沒有 加長 ' + [o, a, b]); }
ok(same(AU('s_ed'), path.join(P56, 'v55', 's_ed.mp3')), '字尾 d 網站 不是 舊 的（v55）'); for (const v of ['A', 'B', 'C']) ok(fs.existsSync(path.join(LI, 's_ed_' + v + '.mp3')), '字尾 d ' + v + ' 沒有');
ok(same(AU('s_ek'), path.join(P56, 's_ek_B.mp3')), '字尾 k 網站 不是 B');
ok(same(AU('s_en'), path.join(LI, 's_en_A.mp3')) && fs.statSync(AU('s_en')).size > 0, '字尾 n 網站 不是 新 的 A');
ok(same(AU('cl_angry_1_2'), path.join(LI, 'cl_angry_1_2_A.mp3')), 'gr 網站 不是 A'); { const a = dur(path.join(LI, 'cl_angry_1_2_A.mp3')), o = dur(path.join(P56, 'cl_angry_1_2_A.mp3')); ok(a < o, 'gr 尾音 沒有 變 短 ' + [o, a]); }
for (const c of ['s_ae', 's_k', 's_ed', 's_ek', 's_en', 'cl_angry_1_2']) ok(fs.existsSync(path.join(LI, 'v56', c + '.mp3')), c + ' 上一次 的 沒 留');
const h = fs.readFileSync(path.join(LI, 'index.html'), 'utf8'); ok(['s_ae_A', 's_k_A', 's_k_B', 's_ed_A', 's_ed_B', 's_ed_C', 's_ek_site', 's_en_A', 'cl_angry_1_2_A', 'cl_angry_1_2_B'].every(f => h.indexOf(f) >= 0 && fs.existsSync(path.join(LI, f + '.mp3'))), '試聽頁 不 完整');
/* 新 的 聲音 都 在 */
const L57 = require('./_codes57.json'), miss = L57.filter(x => !fs.existsSync(AU(x[0]))); ok(!miss.length, '新 組合 沒 聲音 ' + miss.length + '：' + miss.slice(0, 6).map(x => x[0]).join(' '));
for (const w of ['seven', 'letter', 'doctor', 'number', 'sister', 'farmer']) ok(fs.existsSync(AU('w_c57_' + w)), w + ' 沒 聲音'); ok(fs.existsSync(AU('s_oy')), 's_oy 沒 聲音');
let bad = {}; for (let k = 0; k < 4; k++) { const f = path.join(D, '_asrbad57_' + k + '.json'); if (fs.existsSync(f)) Object.assign(bad, JSON.parse(fs.readFileSync(f, 'utf8'))); }
console.log(E.join('\n') + (E.length ? '\n' : '') + 'phonics 第五十七次 聲音：' + n + ' 項，' + E.length + ' 個 失敗（真的 字 聽寫 不 對 的 ' + Object.keys(bad).length + ' 個 記 在 _asrbad57_*.json）'); process.exit(E.length ? 1 : 0);
