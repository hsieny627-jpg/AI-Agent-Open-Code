/* phonics/_build.js — 🔤 Phonics Master（字卡 index.html＋基礎版 basic.html＋進階版 advanced.html＋例外 字 exceptions.html）＋ 🎮 遊戲（games.html）。node phonics/_build.js
 *   ① 例外 字：python3 tools/ph_exc.py（要 先 node phonics/_enum.js）➜ _exc.json；第四十八次 python3 tools/ph_exc2.py（要 先 node phonics/_enum2.js）➜ _excshow.json、_exc2.json、_realreg.json
 *   ② 語音 碼：node phonics/_codes_build.js ➜ _codes.json；第四十八次 node phonics/_codes2_build.js ➜ _codes2.json ③ 音檔：TTS_MODELS=… python3 tools/ph_gen.py、tools/ph_gen2.py
 *   這一支 把 _ph.js＋_ph2.js＋例外 字 放進 頁面，檢查 每 一個 遊戲 單字 都 有 音檔、不是 例外。 */
const fs = require('fs'), path = require('path'), D = __dirname;
const PH = require('./_ph.js'), PH2 = require('./_ph2.js'), EXC = require('./_exc.json'), W = require('./_words.js');
const EXSHOW = require('./_excshow.json'), EXC2 = require('./_exc2.json'), BOOK = require('./_book.js');
Object.assign(PH.EXC, EXC);
const phJS = fs.readFileSync(path.join(D, '_ph.js'), 'utf8') + '\nObject.assign(PH.EXC,' + JSON.stringify(EXC) + ');';
const ph2JS = fs.readFileSync(path.join(D, '_ph2.js'), 'utf8');
const exJS = 'window.EXSHOW=' + JSON.stringify(EXSHOW) + ';window.EXC2=' + JSON.stringify(EXC2) + ';';
const have = new Set(fs.existsSync(path.join(D, 'au')) ? fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, '')) : []);
const need = require('./_codes.json').map(x => x[0]).concat(fs.existsSync(path.join(D, '_codes2.json')) ? require('./_codes2.json').map(x => x[0]) : []);
const miss = need.filter(c => !have.has(c)); if (miss.length) console.log('⚠ 還 沒有 音檔：', miss.length, '個（先 跑 tools/ph_gen.py、tools/ph_gen2.py）');
const VO = { a: PH.VLIST[0], e: PH.VLIST[1], i: PH.VLIST[2], o: PH.VLIST[3], u: PH.VLIST[4] }, bad = [];
W.forEach(([w]) => { const m = /^([bcdfghjklmnprstwz])([aeiou])([bdgmnptx])$/.exec(w); if (!m) { bad.push(w + ' 不是 CVC'); return; }
  if (PH.skip(m[1], VO[m[2]], m[3])) bad.push(w + ' 是 例外 字'); const c = PH.code(m[1], VO[m[2]], m[3]); if (!have.has(c)) bad.push(w + ' 沒有 音檔 ' + c);
  if ((m[1] === 'c' || m[1] === 'g') && 'aou'.indexOf(m[2]) < 0) bad.push(w + ' c／g 不在 a o u 前面'); if (m[1] === 'k' && 'ei'.indexOf(m[2]) < 0) bad.push(w + ' k 不在 e i 前面'); });
if (new Set(W.map(x => x[0])).size !== W.length) bad.push('單字 重複');
if (bad.length) { console.error('✗ ' + bad.join('；')); process.exit(1); }
/* 遊戲 要 的 碼：CVC（短 母音）＋ 部位 ＋ 單獨 的 音 ＋ 課本 */
const cvc = [...have].filter(c => /^s_|^bk_|^bc_|^[a-z0]+-(ae|eh|ih|aa|uh)(-[a-z]+)?$/.test(c)).sort();
const put = (f, o, rep) => { let s = fs.readFileSync(path.join(D, f), 'utf8'); for (const k in rep) s = s.split(k).join(rep[k]); fs.writeFileSync(path.join(D, o), s); };
put('_card.html', 'index.html', { '/*__PH__*/': phJS, '/*__PH2__*/': ph2JS, '/*__DECK__*/': exJS });
for (const id in PH2.DECKS) { const dk = Object.assign({ id, adv: id === 'advanced' }, PH2.DECKS[id]);
  put('_card.html', dk.file, { '/*__PH__*/': phJS, '/*__PH2__*/': ph2JS, '/*__DECK__*/': exJS + 'window.DECK=' + JSON.stringify(dk) + ';' }); }
/* ⚠ 例外 字 清單 頁 */
const exRows = Object.keys(EXSHOW).map(k => { const [w, c] = k.split('|'); return { w, c, ph: EXSHOW[k][0] }; }).filter((x, i, a) => a.findIndex(y => y.w === x.w) === i).sort((a, b) => a.w < b.w ? -1 : 1);
const exHTML = fs.readFileSync(path.join(D, '_exc.html'), 'utf8').split('/*__PH__*/').join(phJS).split('/*__PH2__*/').join(ph2JS).split('/*__ROWS__*/').join('var ROWS=' + JSON.stringify(exRows) + ';');
fs.writeFileSync(path.join(D, 'exceptions.html'), exHTML.replace('</body>', '<script>' + require('../score/_dsp.js').js('') + '</script></body>'));
/* 遊戲 頁：成績（score/_client.js 的 home：登入 畫面＋送 成績；年級 看 登入 的 5 碼）、遊戲 樣子 _games.css、程式 _games.js */
const CL = require('../score/_client.js'), PSE = require('./_pseudo.json');
put('_games.html', 'games.html', { '/*__PH__*/': phJS, '/*__PH2__*/': ph2JS, '/*__WORDS__*/': 'var WORDS=' + JSON.stringify(W) + ',CODES=' + JSON.stringify(cvc) + ',BOOK=' + JSON.stringify(BOOK) + ',PSE=' + JSON.stringify(PSE) + ';',
  '/*__SCORE__*/': CL.home(0, '../', 'school') + '<script>' + require('../score/_dsp.js').js('') + '</script>' +
    /* 第四十九次：〔⚡ 現場任務〕🏁 CVC 單字 25 題 闖關（Firebase 網址、讀寫、時間 到 自動 送）*/
    '<script src="../live/fb.js"></script><script>' + fs.readFileSync(path.join(D, '..', 'live', '_db.js'), 'utf8') + '</script><script>' + fs.readFileSync(path.join(D, '..', 'live', '_xlive_rt.js'), 'utf8') + '</script>', '/*__GAMECSS__*/': fs.readFileSync(path.join(D, '_games.css'), 'utf8'), '/*__GAMEJS__*/': fs.readFileSync(path.join(D, '_games.js'), 'utf8') });
console.log('phonics ok：字卡＋基礎版＋進階版＋例外 字', exRows.length, '個（放回 字卡 的 組合', Object.keys(EXSHOW).length, '）＋遊戲；遊戲 單字', W.length, '個；遊戲 用 的 音檔', cvc.length, '個');
