/* phonics/_qwords_build.js — 第五十六次 🗺️ 拼音 地圖＋🎮 拼音 闖關 的 字 ➜ _qwords.json（node phonics/_qwords_build.js）
 * 來源：_realreg.json（照 規則 的 真的 字、CMU 字典 唸法 一樣、音檔 電腦 聽寫 聽 對 過）；常見（wordfreq Zipf ≧ 3.8）；拿掉 人名、不雅、暴力、太 難 的（NO）。
 * 每 個 字：on 字首 字母 塊、v 母音 字母、co 字尾 字母 塊、mg 最後 的 不 發音 e；P ＝ 每 一個 聲音 [字母, 碼]；pat ＝ 子母 結構（CCVC…）；n ＝ 幾 個 聲音 */
const fs = require('fs'), path = require('path'), D = __dirname;
const R = require('./_realreg.json'), BAD = new Set(Object.keys(require('./_asrbad.json'))), have = new Set(fs.readdirSync(path.join(D, 'au')).map(f => f.replace('.mp3', '')));
const NO = new Set(('bob ben beth bert blake brad chad chen dan dale dame dee del des du dutch thee thou drake drug drunk fuck phil ford fred frank greg greek gay god gosh gal han hon hong hart jon josh jan jay jake jane jean gen jim jin joan jun cock cox com comp con kong cos cal cam kay kane kate carl ken kent kurt kim corp cum cunt lang lee lil lin liz lol luke mon mel mitch mick nash nate nope pee perth piss pope porn ross ron rand rep rex rape rome sam san sex sen sep seth sim sin shit smith spain stan stat tel til tim trent trump von yang yale yep yup wee whoa woo babe bitch dick dope dumb suck nude bust bomb gun crime pub ref med prep max nor hate rob shoot kill bully beast breed tee boo damn hell cod mob mock lord gel hub mum sir punk jazz hon spam vibe lad bot cant dat das dos dis')
  .split(' '));
const TOK = ['ch', 'sh', 'th', 'dh', 'ng', 'kw', 'ks', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'w', 'r', 's', 'z', 'v', 'y'];
const tok = c => { const o = []; let s = c === '0' ? '' : c; while (s) { const t = TOK.find(x => s.startsWith(x)); if (!t) return null; o.push(t); s = s.slice(t.length); } return o; };
/* 字母 塊：一個 聲音 一塊（th sh ch ph ng ck tch qu x ＝ 一塊）*/
const CH = ['tch', 'sch', 'ch', 'sh', 'th', 'ph', 'wh', 'ng', 'ck', 'qu', 'ss', 'll', 'ff', 'zz'];
const chunks = s => { const o = []; while (s) { const c = CH.find(x => s.startsWith(x)) || s[0]; o.push(c); s = s.slice(c.length); } return o; };
const out = [];
R.forEach(([code, w, z]) => {
  if (z < 3.8 || !have.has(code) || BAD.has(code) || NO.has(w)) return;
  const [oc, vc, cc] = code.split('-'); if (vc === undefined) return;
  if (/^(ar|or|er|ou|oo)$/.test(vc)) return;   /* 母音＋r、ou 先 不 放（另一 組 規則）*/
  const m = /^(qu|[bcdfghjklmnprstvwxyz]*)(ai|ay|ee|ea|oa|ow|oo|[aeiou])([bcdfghjklmnprstvwxz]*)(e?)$/.exec(w); if (!m) return;
  const long = /^(ai|ee|ii|oa|uu|yu)$/.test(vc); if (m[4] && !long) return; if (m[4] && m[2].length > 1) return;
  const ot = tok(oc), ct = tok(cc || '0'); if (!ot || !ct) return;
  const oC = chunks(m[1]), cC = chunks(m[3]);
  /* 塊 ↔ 聲音：qu ＝ 一塊 兩 聲音（k w），x ＝ 一塊 兩 聲音（k s），nk ＝ n k 兩塊（ŋ k）*/
  const nIn = c => c === 'qu' || c === 'x' ? 2 : 1;
  if (oC.reduce((a, c) => a + nIn(c), 0) !== ot.length || cC.reduce((a, c) => a + nIn(c), 0) !== ct.length) return;
  out.push({ w, c: code, z: Math.round(z * 10) / 10, on: oC, ot, v: m[2], vc, co: cC, ct, mg: m[4] ? 1 : 0,
    pat: 'C'.repeat(ot.length) + 'V' + 'C'.repeat(ct.length), n: ot.length + 1 + ct.length, long: long ? 1 : 0 });
});
fs.writeFileSync(path.join(D, '_qwords.json'), JSON.stringify(out));
const by = k => { const o = {}; out.forEach(x => o[x[k]] = (o[x[k]] || 0) + 1); return o; };
console.log('拼音 闖關 字：', out.length, '個；結構', JSON.stringify(by('pat')), '；聲音 數', JSON.stringify(by('n')));
