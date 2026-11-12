/* phonics/_codes_build.js — 要 做 語音 的 碼 ＝ 字卡 會 出現（不 跳過）的 每 一種 唸法＋單獨 一個 音（拉霸機 停 一格 唸 一個 音）➜ _codes.json [[碼, 音標]] */
const PH = require('./_ph.js'), fs = require('fs'), path = require('path');
Object.assign(PH.EXC, require('./_exc.json'));
const { all } = require('./_enum.js');
const use = new Set(); all().forEach(x => { const V = PH.VLIST[x[3]]; if (!PH.skip(x[2], V, x[4])) use.add(x[1]); });
const L = [...use].sort().map(c => [c, PH.ipaOf(c)]);
/* 單獨 一個 音：s_<碼>（子音 只 唸 子音，母音 只 唸 母音）*/
const SI = { b: 'b', p: 'p', m: 'mː', f: 'fː', d: 'd', t: 't', n: 'nː', l: 'lː', k: 'k', h: 'h', s: 'sː', j: 'dʒ', w: 'w', r: 'ɹ', z: 'zː', g: 'ɡ', kw: 'kw', ch: 'tʃ', sh: 'ʃː', th: 'θː', dh: 'ðː', x: 'ks', ck: 'k' };
const SV = { ae: 'ˈæ', eh: 'ˈɛ', ih: 'ˈɪ', aa: 'ˈɑː', uh: 'ˈʌ', ar: 'ˈɑːɹ', er: 'ˈɜː', or: 'ˈɔːɹ', ai: 'ˈeɪ', ee: 'ˈiː', oa: 'ˈoʊ', uu: 'ˈuː', oo: 'ˈʊ', ou: 'ˈaʊ' };
Object.keys(SI).forEach(k => L.push(['s_' + k, SI[k] + '.'])); Object.keys(SV).forEach(k => L.push(['s_' + k, SV[k] + '.']));
fs.writeFileSync(path.join(__dirname, '_codes.json'), JSON.stringify(L));
console.log('語音 碼', L.length, '個');
