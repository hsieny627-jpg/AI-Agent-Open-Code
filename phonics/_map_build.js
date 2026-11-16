/* phonics/_map_build.js — 第五十六次 🗺️ 拼音 地圖（map.html）：node phonics/_map_build.js（_build.js 最後 也 會 跑）
 * 資料：_qwords.json（node phonics/_qwords_build.js）、_realreg.json、au/ 有 的 音檔；樣子 _map.html、程式 _map.js＋_map_games.js */
const fs = require('fs'), path = require('path'), D = __dirname;
const PH = require('./_ph.js'), PH2 = require('./_ph2.js'), QW = require('./_qwords.json'), REAL = require('./_realreg.json');
const have = fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, ''));
const AVL = have.filter(c => /^(s_|w_|zy_|bk_|sy_)/.test(c) || /^[a-z]+-(ae|eh|ih|aa|uh|ai|ee|ii|oa|uu|yu|or)(-[a-z]+)?$/.test(c));
const J = a => Array.isArray(a) ? a.join('') : a, C = PH.CONS, V = PH.VOW, V2 = PH2.VOW2, C2 = PH2.CONS2 || {};
const t = (o, sup) => ({ zh: J(o.zh), sup: sup != null ? sup : (Array.isArray(o.sup) ? '' : o.sup || ''), kk: J(o.kk), ipa: J(o.ipa) });
const TT = {};
['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'k', 'h', 's', 'j', 'w', 'z', 'ch', 'sh'].forEach(k => TT[k] = t(C[k]));
TT.g = t(C.g_hard); TT.th = t(C['th(無聲)']); TT.dh = t(C['th(有聲)']); TT.ks = t(C.x); TT.kw = t(C.qu); TT.r = t(C.r); TT.v = { zh: 'v', sup: '', kk: 'v', ipa: 'v' };
TT.y = { zh: '一', sup: '', kk: 'j', ipa: 'j' }; TT.ng = C2.ng ? t(C2.ng) : { zh: 'ㄥ', sup: '', kk: 'ŋ', ipa: 'ŋ' };
Object.assign(TT, { ae: t(V.a), eh: t(V.e), ih: t(V.i), aa: t(V.o), uh: t(V.u), ai: t(V.ai), ee: t(V.ee), oa: t(V.oa), ii: t(V2.i_e), uu: t(V.oo_long), yu: t(V2.u_e),
  ao: { zh: 'ㄛ', sup: '', kk: 'ɔ', ipa: 'ɔ' }, or: { zh: 'ㄛㄦ', sup: '', kk: 'ɔr', ipa: 'ɔɹ' }, ar: { zh: 'ㄚㄦ', sup: '', kk: 'ɑr', ipa: 'ɑɹ' }, er: { zh: 'ㄜㄦ', sup: '', kk: 'ɝ', ipa: 'ɜɹ' },
  el: { zh: 'ㄜㄛ', sup: '', kk: 'əl', ipa: 'əl' }, ah: { zh: 'ㄜ', sup: '', kk: 'ə', ipa: 'ə' } });
const REALC = {}; REAL.forEach(r => REALC[r[0]] = r[1]);
/* 檢查：動畫、遊戲 要 的 聲音 都 有 */
const js = fs.readFileSync(path.join(D, '_map.js'), 'utf8'), gjs = fs.readFileSync(path.join(D, '_map_games.js'), 'utf8');
const want = [...new Set((js + gjs).match(/'(w_[a-z0-9_]+|zy_[a-z]+|bk_[a-z_]+|sy_[a-z]+_\d|[a-z]+-[a-z]+(?:-[a-z]+)?)'/g).map(x => x.slice(1, -1)))].filter(c => !/^(no|ok|on|lo|go|fl)$/.test(c) && !/_$/.test(c));
const miss = want.filter(c => /^(w_|zy_|bk_|sy_)/.test(c) || /^[a-z]+-(ae|eh|ih|aa|uh|ai|ee|oa|or|ii|uu)/.test(c)).filter(c => have.indexOf(c) < 0);
QW.forEach(x => { if (have.indexOf(x.c) < 0) miss.push(x.c); });
['s_ae', 's_eh', 's_ih', 's_aa', 's_uh', 's_ai', 's_ee', 's_ii', 's_oa', 's_uu', 's_ao', 's_or', 's_ar', 's_er', 's_el'].forEach(c => { if (have.indexOf(c) < 0) miss.push(c); });
if (miss.length) { console.error('✗ 沒有 音檔：', [...new Set(miss)].join(' ')); process.exit(1); }
const CL = require('../score/_client.js');
let html = fs.readFileSync(path.join(D, '_map.html'), 'utf8');
html = html.split('/*__DATA__*/').join('var QW=' + JSON.stringify(QW) + ',TT=' + JSON.stringify(TT) + ',REALC=' + JSON.stringify(REALC) + ',AVL=' + JSON.stringify(AVL) + ';')
  .split('/*__SCORE__*/').join(CL.home(0, '../', 'school') + '<script>' + require('../score/_dsp.js').js('') + '</script>')
  .split('/*__JS__*/').join(js.split('/*__GAMES__*/').join(gjs));
fs.writeFileSync(path.join(D, 'map.html'), html);
console.log('map.html ok：字', QW.length, '個、音檔 名單', AVL.length, '個、', Math.round(html.length / 1024), 'KB');
