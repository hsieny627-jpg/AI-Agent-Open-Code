/* phonics/_verify_59s.js — 第五十九次 聲音（老師 聽 P58 的 回答）。node phonics/_verify_59s.js（只 印 失敗 項＋一行 總結）
 * 網站 ＝ K／c A（ㄎㄚ）、gr B、字尾 d A（C 大聲）、ball 的 a／or 的 o A（ɑ）、字母 i ＝ 老師 的 錄音；舊 的 留 在 v58/；試聽頁 有 每 一個；長度、音量 合理 */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname, LI = path.join(D, '..', 'listen', '2026-11-18_P59'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const dur = f => +execFileSync('ffprobe', ['-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const vol = f => require('child_process').spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-']).stderr.toString();
const same = (a, b) => fs.existsSync(a) && fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b)), AU = c => path.join(D, 'au', c + '.mp3');
const SITE = { s_k: 's_k_A', cl_angry_1_2: 'cl_angry_1_2_B', s_ed: 's_ed_A', s_ao: 's_ao_A', s_ih: 's_ih_T' };
const LEN = { s_k: [0.03, 0.16], cl_angry_1_2: [0.08, 0.45], s_ed: [0.05, 0.35], s_ao: [0.3, 0.9], s_ih: [0.3, 0.9] };
for (const c in SITE) { ok(same(AU(c), path.join(LI, SITE[c] + '.mp3')), c + ' 網站 不是 ' + SITE[c]); ok(fs.existsSync(path.join(LI, 'v58', c + '.mp3')), c + ' 上一次 的 沒 留'); const d = dur(AU(c)); ok(d >= LEN[c][0] && d <= LEN[c][1], c + ' 長度 ' + d); }
ok(fs.existsSync(path.join(D, '..', 'ref', 'audio', 'teacher_i.mp3')), '老師 的 i 錄音 沒 存 進 ref/audio');
const h = fs.readFileSync(path.join(LI, 'index.html'), 'utf8');
['s_k_A', 's_k_B', 'cl_angry_1_2_B', 's_ed_A', 's_ed_B', 's_ao_A', 's_ao_B', 's_ih_T'].forEach(f => { ok(h.indexOf("'" + f + "'") >= 0, '試聽頁 沒有 ' + f); ok(fs.existsSync(path.join(LI, f + '.mp3')), '試聽 檔 沒有 ' + f); });
/* 字尾 d 比 上次 大聲（d 要 更 明顯）、K 比 上次 大聲 */
const mx = f => { const m = /max_volume: (-?[\d.]+) dB/.exec(vol(f)); return m ? +m[1] : -99; }, mean = f => { const m = /mean_volume: (-?[\d.]+) dB/.exec(vol(f)); return m ? +m[1] : -99; };
ok(mean(AU('s_ed')) > mean(path.join(LI, 'v58', 's_ed.mp3')) + 1, '字尾 d 沒有 比 上次 大聲');
ok(mean(AU('s_k')) > mean(path.join(LI, 'v58', 's_k.mp3')), 'K 沒有 比 上次 大聲');
E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' phonics 第五十九次 聲音：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0);
