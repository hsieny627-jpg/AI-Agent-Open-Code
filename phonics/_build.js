/* phonics/_build.js — 🔤 Phonics Master（字卡 index.html）＋ 🎮 CVC 遊戲（games.html）。node phonics/_build.js
 *   ① 例外 字：python3 tools/ph_exc.py（要 先 node phonics/_enum.js）➜ _exc.json ② 語音 碼：node phonics/_codes_build.js ➜ _codes.json ③ 音檔：TTS_MODELS=… python3 tools/ph_gen.py
 *   這一支 把 _ph.js＋_exc.json 放進 兩頁，檢查 每 一個 遊戲 單字 都 有 音檔、不是 例外。 */
const fs = require('fs'), path = require('path'), D = __dirname;
const PH = require('./_ph.js'), EXC = require('./_exc.json'), W = require('./_words.js');
Object.assign(PH.EXC, EXC);
const phJS = fs.readFileSync(path.join(D, '_ph.js'), 'utf8') + '\nObject.assign(PH.EXC,' + JSON.stringify(EXC) + ');';
const CODES = require('./_codes.json').map(x => x[0]);
const have = new Set(fs.existsSync(path.join(D, 'au')) ? fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, '')) : []);
const miss = CODES.filter(c => !have.has(c)); if (miss.length) console.log('⚠ 還 沒有 音檔：', miss.length, '個（先 跑 tools/ph_gen.py）');
const VO = { a: PH.VLIST[0], e: PH.VLIST[1], i: PH.VLIST[2], o: PH.VLIST[3], u: PH.VLIST[4] }, bad = [];
W.forEach(([w]) => { const m = /^([bcdfghjklmnprstwz])([aeiou])([bdgmnptx])$/.exec(w); if (!m) { bad.push(w + ' 不是 CVC'); return; }
  if (PH.skip(m[1], VO[m[2]], m[3])) bad.push(w + ' 是 例外 字'); const c = PH.code(m[1], VO[m[2]], m[3]); if (!have.has(c)) bad.push(w + ' 沒有 音檔 ' + c);
  if ((m[1] === 'c' || m[1] === 'g') && 'aou'.indexOf(m[2]) < 0) bad.push(w + ' c／g 不在 a o u 前面'); if (m[1] === 'k' && 'ei'.indexOf(m[2]) < 0) bad.push(w + ' k 不在 e i 前面'); });
if (new Set(W.map(x => x[0])).size !== W.length) bad.push('單字 重複');
if (bad.length) { console.error('✗ ' + bad.join('；')); process.exit(1); }
/* 遊戲 只 要 CVC（短 母音）的 碼 ＋ 單獨 的 音 */
const cvc = [...have].filter(c => /^s_|^[a-z]+-(ae|eh|ih|aa|uh)-[a-z]+$/.test(c)).sort();
const put = (f, o, rep) => { let s = fs.readFileSync(path.join(D, f), 'utf8'); for (const k in rep) s = s.split(k).join(rep[k]); fs.writeFileSync(path.join(D, o), s); };
put('_card.html', 'index.html', { '/*__PH__*/': phJS });
put('_games.html', 'games.html', { '/*__PH__*/': phJS, '/*__WORDS__*/': 'var WORDS=' + JSON.stringify(W) + ',CODES=' + JSON.stringify(cvc) + ';' });
console.log('phonics ok：字卡＋遊戲；例外 字', Object.keys(EXC).length, '個；遊戲 單字', W.length, '個；遊戲 用 的 音檔', cvc.length, '個');
