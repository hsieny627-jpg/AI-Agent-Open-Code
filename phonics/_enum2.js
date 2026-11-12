/* phonics/_enum2.js — 2026-11-12 第四十八次：基礎版、進階版 字卡 會 出現 的 每 一個 組合 ➜ _all2.json（[拼字, 碼, 哪一副]），給 tools/ph_exc2.py 找 例外 字
 *   進階版 只 放 合 英文 拼字 習慣 的（PH2.fits）；不雅 的（PH2.bad2）不放。node phonics/_enum2.js */
const PH = require('./_ph.js'), PH2 = require('./_ph2.js'), fs = require('fs'), path = require('path');
function all2() { const out = [];
  for (const dk in PH2.DECKS) { const D = PH2.DECKS[dk], I = [...new Set([].concat(...Object.values(D.INITIALS)))], E = [...new Set([].concat(...Object.values(D.ENDINGS)))];
    I.forEach(i => D.VLIST.forEach((v, vi) => E.forEach(e => { if (dk === 'advanced' && !PH2.fits(i, v, e)) return; const c = PH2.code2(i, v, e); if (PH2.bad2(c)) return;
      out.push([PH2.spell2(i, v, e), c, dk, i, vi, e]); }))); }
  return out; }
module.exports = { all2 };
if (require.main === module) { const A = all2(); fs.writeFileSync(path.join(__dirname, '_all2.json'), JSON.stringify(A.map(x => [x[0], x[1], x[2]])));
  console.log('基礎版＋進階版 組合', A.length, '、不同 唸法', new Set(A.map(x => x[1])).size); }
