/* phonics/_enum.js — 列出 字卡 會 出現 的 每 一個 組合（字首 ✕ 母音 ✕ 字尾）：node phonics/_enum.js ➜ _all.json（[拼字, 碼]），給 tools/ph_exc.py 找 例外 字 */
const PH = require('./_ph.js'), fs = require('fs'), path = require('path');
function all() { const I = [...new Set(PH.INITIALS.basic.concat(PH.INITIALS.adv))], E = [...new Set(PH.ENDINGS.g1.concat(PH.ENDINGS.g2, PH.ENDINGS.g3))], out = [];
  I.forEach(i => PH.VLIST.forEach(v => E.forEach(e => out.push([PH.spell(i, v, e), PH.code(i, v, e), i, PH.VLIST.indexOf(v), e])))); return out; }
module.exports = { all };
if (require.main === module) { const A = all(); fs.writeFileSync(path.join(__dirname, '_all.json'), JSON.stringify(A.map(x => [x[0], x[1]]))); console.log('組合', A.length, '、不同 唸法', new Set(A.map(x => x[1])).size); }
