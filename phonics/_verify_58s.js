/* phonics/_verify_58s.js — 第五十八次 聲音（老師 聽 P57 的 回答）。node phonics/_verify_58s.js（只 印 失敗 項＋一行 總結）
 * 網站 ＝ K／c A、gr A、字尾 d C、有聲 th B、blame 新、ball 的 a 新；舊 的 留 在 v57/；試聽頁 有 每 一個；長度 合理；
 * 多 音節 進階 12 個 字＋音節；進階版 字尾 ＋s（ts ps ks ds gs）每 一張 卡 都 有 聲音 */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname, LI = path.join(D, '..', 'listen', '2026-11-17_P58'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const dur = f => +execFileSync('ffprobe', ['-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const same = (a, b) => fs.existsSync(a) && fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b)), AU = c => path.join(D, 'au', c + '.mp3');
const SITE = { s_dh: 's_dh_B', 'bl-ai-m': 'bl-ai-m' };   /* 第五十九次：s_k、gr、字尾 d、s_ao 換 了 ➜ _verify_59s.js 量 */
const LEN = { s_k: [0.04, 0.16], cl_angry_1_2: [0.08, 0.4], s_ed: [0.03, 0.3], s_dh: [0.15, 0.6], 'bl-ai-m': [0.3, 0.9], s_ao: [0.3, 0.8] };
for (const c in SITE) { ok(same(AU(c), path.join(LI, SITE[c] + '.mp3')), c + ' 網站 不是 ' + SITE[c]); ok(fs.existsSync(path.join(LI, 'v57', c + '.mp3')), c + ' 上一次 的 沒 留'); const d = dur(AU(c)); ok(d >= LEN[c][0] && d <= LEN[c][1], c + ' 長度 ' + d); }
const h = fs.readFileSync(path.join(LI, 'index.html'), 'utf8');
['s_k_A', 's_k_B', 'cl_angry_1_2_A', 'cl_angry_1_2_B', 's_ed_C', 's_ed_D', 's_ed_E', 's_dh_A', 's_dh_B', 'bl-ai-m', 's_ao_A'].forEach(f => { ok(h.indexOf("'" + f + "'") >= 0, '試聽頁 沒有 ' + f); ok(fs.existsSync(path.join(LI, f + '.mp3')), '試聽 檔 沒有 ' + f); });
['banana', 'umbrella', 'tomato', 'hamburger', 'fantastic', 'family', 'animal', 'elephant', 'watermelon', 'caterpillar', 'alligator', 'helicopter'].forEach(w => { const k = /water|cater|alli|heli/.test(w) ? 4 : 3; ok(fs.existsSync(AU('w_c58_' + w)), w + ' 沒有 聲音'); for (let i = 0; i < k; i++) { ok(fs.existsSync(AU('sy_' + w + '_' + i)), w + ' 第 ' + (i + 1) + ' 音節 沒有'); const d = dur(AU('sy_' + w + '_' + i)); ok(d > 0.08 && d < 0.8, w + ' 第 ' + (i + 1) + ' 音節 長度 ' + d); } });
/* 字尾 ＋s：進階版 每 一張 卡 都 有 聲音 */
const PH2 = require('./_ph2.js'), { all2 } = require('./_enum2.js'); const L = all2().filter(x => /-(ts|ps|ks|ds|gs)$/.test(x[1]) && /(ts|ps|ks|ds|gs)$/.test(x[0].toLowerCase()));
ok(L.length > 100, '字尾 ＋s 的 卡 太 少 ' + L.length); const miss = L.filter(x => !fs.existsSync(AU(x[1])) && !PH2.bad2(x[1])).map(x => x[0]); ok(!miss.length, '字尾 ＋s 沒 聲音 ' + miss.length + '：' + miss.slice(0, 8).join(' '));
E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' phonics 第五十八次 聲音：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0);
