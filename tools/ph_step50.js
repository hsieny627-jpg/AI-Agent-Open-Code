/* tools/ph_step50.js — 第五十次：〔🧩 逐步 拼音〕要 的 聲音 清單（cv_<字>_<音節> ＝ 字首＋母音，rm_<字>_<音節> ＝ 母音＋後面）➜ 印 JSON [[檔名, 音標]]
   跟 phonics/_games.js 的 sylParts 同 一套 規則；python3 tools/ph_step50.py 做 成 mp3 */
const B = require('../phonics/_book.js');
const VOW = new Set(['ERV', 'AE', 'EH', 'IH', 'AA', 'AO', 'AH', 'IY', 'UW', 'AY', 'OW', 'ER', 'UH', 'EY', 'AW']);
const RI = { B: 'b', P: 'p', M: 'm', F: 'f', D: 'd', T: 't', N: 'n', L: 'l', K: 'k', G: 'ɡ', HH: 'h', S: 's', Z: 'z', JH: 'dʒ', CH: 'tʃ', SH: 'ʃ', TH: 'θ', DH: 'ð', W: 'w', R: 'ɹ', RC: 'ɹ', Y: 'j', V: 'v', NG: 'ŋ',
  AE: 'æ', EH: 'ɛ', IH: 'ɪ', AA: 'ɑː', AO: 'ɔː', AH: 'ʌ', AH0: 'ə', EY: 'eɪ', IY: 'iː', IY0: 'i', OW: 'oʊ', UW: 'uː', UH: 'ʊ', AW: 'aʊ', AY: 'aɪ', ER: 'ɜː', ER0: 'ɚ', ERV: 'ɜː' };
const ip = p => { const b = p.replace(/[12]/g, ''); const k = RI[b] ? b : b.replace(/0/, ''); return (VOW.has(k) && /1/.test(p) ? 'ˈ' : '') + (RI[b] || RI[k]); };
const out = [];
for (const w in B.W) { const x = B.W[w]; if (x.parts) continue;
  const S = x.sy.split('·'); let si = 0, used = 0;
  const G = x.g.split(' ').map(t => { const i = t.indexOf(':'), l = t.slice(0, i), p = t.slice(i + 1), o = { l, P: p === '-' ? [] : p.split('+'), s: si }; used += l.length; if (used >= S[si].length) { si++; used = 0; } return o; });
  G.forEach(o => o.v = !!o.P.length && VOW.has(o.P[0].replace(/\d/g, '')));
  S.forEach((_, si) => { const gs = G.filter(g => g.s === si), vi = gs.findIndex(g => g.v); if (vi < 0) return;
    const on = gs.slice(0, vi), vw = gs[vi], cd = gs.slice(vi + 1), more = vw.P.length > 1 || cd.some(g => g.P.length), onS = on.some(g => g.P.length);
    const onI = on.map(g => g.P.map(ip).join('')).join(''), vI = (vw.P[0] === 'AH0' ? '' : 'ˈ') + RI[vw.P[0].replace(/[12]/g, '')], rest = vw.P.slice(1).map(ip).join('') + cd.map(g => g.P.map(ip).join('')).join('');
    if (onS && more) out.push(['cv_' + w + '_' + si, onI + vI]);
    if (onS && more) out.push(['rm_' + w + '_' + si, vI + rest]); });
}
out.push(['s_ir', 'ɜː']);
process.stdout.write(JSON.stringify(out));
