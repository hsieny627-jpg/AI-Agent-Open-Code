/* phonics/_map_build.js — 第五十六次 🗺️ 拼音 地圖（map.html）：node phonics/_map_build.js（_build.js 最後 也 會 跑）
 * 資料：_qwords.json（node phonics/_qwords_build.js）、_realreg.json、au/ 有 的 音檔；樣子 _map.html、程式 _map.js＋_map_games.js */
const fs = require('fs'), path = require('path'), D = __dirname;
const PH = require('./_ph.js'), PH2 = require('./_ph2.js'), QW = require('./_qwords.json'), REAL = require('./_realreg.json');
const have = fs.readdirSync(path.join(D, 'au')).map(f => f.replace(/\.mp3$/, ''));
const AVL = have.filter(c => /^(s_|w_|zy_|bk_|sy_|cv_)/.test(c) || /^([a-z]+|0)-(ae|eh|ih|aa|uh|ai|ee|ii|oa|uu|oo|yu|or|ou|oy|ao|ar|er)(-[a-z]+)?$/.test(c));   /* 第五十七次：多 ou oy ao ar er */
const J = a => Array.isArray(a) ? a.join('') : a, C = PH.CONS, V = PH.VOW, V2 = PH2.VOW2, C2 = PH2.CONS2 || {};
const t = (o, sup) => ({ zh: J(o.zh), sup: sup != null ? sup : (Array.isArray(o.sup) ? '' : o.sup || ''), kk: J(o.kk), ipa: J(o.ipa) });
const TT = {};
['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'k', 'h', 's', 'j', 'w', 'z', 'ch', 'sh'].forEach(k => TT[k] = t(C[k]));
TT.g = t(C.g_hard); TT.th = t(C['th(無聲)']); TT.dh = t(C['th(有聲)']); TT.ks = t(C.x); TT.kw = t(C.qu); TT.r = t(C.r); TT.v = { zh: 'v', sup: '', kk: 'v', ipa: 'v' };
TT.y = { zh: '一', sup: '', kk: 'j', ipa: 'j' }; TT.oo = t(V.oo_short); TT.dj = { zh: 'ㄓ', sup: '', kk: 'dʒ', ipa: 'dʒ' };   /* 第六十一次 老師：dge 的 雙語 注音 ＝ ㄓ */   /* 第六十次 短 的 oo（good）*/ TT.ng = C2.ng ? t(C2.ng) : { zh: 'ㄥ', sup: '', kk: 'ŋ', ipa: 'ŋ' };
Object.assign(TT, { ae: t(V.a), eh: t(V.e), ih: t(V.i), aa: t(V.o), uh: t(V.u), ai: t(V.ai), ee: t(V.ee), oa: t(V.oa), ii: t(V2.i_e), uu: t(V.oo_long), yu: t(V2.u_e),
  ao: { zh: 'ㄛ', sup: '', kk: 'ɔ', ipa: 'ɔ' }, or: { zh: 'ㄛㄦ', sup: '', kk: 'ɔr', ipa: 'ɔɹ' }, ar: { zh: 'ㄚㄦ', sup: '', kk: 'ɑr', ipa: 'ɑɹ' }, er: { zh: 'ㄜㄦ', sup: '', kk: 'ɝ', ipa: 'ɜɹ' },
  el: { zh: 'ㄜㄛ', sup: '', kk: 'əl', ipa: 'əl' }, ah: { zh: 'ㄜ', sup: '', kk: 'ə', ipa: 'ə' },
  /* 第五十七次：母音＋r 的 r ＝ 子音 ㄦ（bird 的 ɜ＋ɹ：KK 空白，照 課本 字卡）、ou ㄠ、oy ㄛ一 */
  rr: { zh: 'ㄦ', sup: '', kk: 'r', ipa: 'ɹ' }, rr2: { zh: 'ㄦ', sup: '', kk: '', ipa: 'ɹ' }, er1: { zh: 'ㄜ', sup: '', kk: 'ɝ', ipa: 'ɜ' }, ou: { zh: 'ㄠ', sup: '', kk: 'aʊ', ipa: 'aʊ' }, oy: { zh: 'ㄛ一', sup: '', kk: 'ɔɪ', ipa: 'ɔɪ' } });
const REALC = {}; REAL.forEach(r => REALC[r[0]] = r[1]); Object.assign(REALC, { 'k-oy': 'coy', 't-oy': 'toy', 'b-oy-s': 'boys' });   /* 第五十八次：真的 字 ✅ */
/* 第五十七次：真的 英文 字 但 電腦 聽寫 照 規則 唸 不 對（wild、bolt、sword…＝ 例外 字）➜ 地圖 上 說「例外」、不 放 照 規則 的 聲音 */
const XBAD = {}; for (let k = 0; k < 4; k++) { const f = path.join(D, '_asrbad57_' + k + '.json'); if (fs.existsSync(f)) Object.assign(XBAD, JSON.parse(fs.readFileSync(f, 'utf8'))); }
/* 2026-11-17 第五十八次 老師 (6)-9：coy 是 真的 字、也 照 規則 唸 ➜ 有 聲音（電腦 聽寫 聽 不 準 不 代表 唸 錯）；toy、boys 同 一種 */
['k-oy', 't-oy', 'b-oy-s'].forEach(c => { delete XBAD[c]; });
/* 檢查：動畫、遊戲 要 的 聲音 都 有 */
const js = fs.readFileSync(path.join(D, '_map.js'), 'utf8'), gjs = fs.readFileSync(path.join(D, '_map_games.js'), 'utf8');
const want = [...new Set((js + gjs).match(/'(w_[a-z0-9_]+|zy_[a-z]+|bk_[a-z_]+|sy_[a-z]+_\d|[a-z]+-[a-z]+(?:-[a-z]+)?)'/g).map(x => x.slice(1, -1)))].filter(c => !/^(no|ok|on|lo|go|fl)$/.test(c) && !/_$/.test(c));
const miss = want.filter(c => /^(w_|zy_|bk_|sy_)/.test(c) || /^[a-z]+-(ae|eh|ih|aa|uh|ai|ee|oa|or|ii|uu|ou|oy|ao|ar|er)/.test(c)).filter(c => have.indexOf(c) < 0);
QW.forEach(x => { if (have.indexOf(x.c) < 0) miss.push(x.c); });
['s_ae', 's_eh', 's_ih', 's_aa', 's_uh', 's_ai', 's_ee', 's_ii', 's_oa', 's_uu', 's_ao', 's_or', 's_ar', 's_er', 's_el'].forEach(c => { if (have.indexOf(c) < 0) miss.push(c); });
if (miss.length && !process.env.PH_LAX) { console.error('✗ 沒有 音檔：', [...new Set(miss)].join(' ')); process.exit(1); }
const CL = require('../score/_client.js');
let html = fs.readFileSync(path.join(D, '_map.html'), 'utf8');
const MAPCJS = fs.readFileSync(path.join(D, '_map_combos.js'), 'utf8');
html = html.split('/*__DATA__*/').join('var QW=' + JSON.stringify(QW) + ',TT=' + JSON.stringify(TT) + ',REALC=' + JSON.stringify(REALC) + ',XBAD=' + JSON.stringify(Object.keys(XBAD)) + ',BADC=' + JSON.stringify(require('./_map_combos.js').all().filter(x => PH2.bad2(x.code)).map(x => x.code)) + ',AVL=' + JSON.stringify(AVL) + ';')
  .split('/*__SCORE__*/').join(CL.home(0, '../', 'school') + '<script>' + require('../score/_dsp.js').js('') + '</script>' +
    /* 2026-11-18 第六十次：〔⚡ 現場任務〕🗺️ 拼音 地圖 遊戲（Firebase 網址、讀寫、時間 到 自動 送）*/
    '<script src="../live/fb.js"></script><script>' + fs.readFileSync(path.join(D, '..', 'live', '_db.js'), 'utf8') + '</script><script>' + fs.readFileSync(path.join(D, '..', 'live', '_xlive_rt.js'), 'utf8') + '</script>')
  .split('/*__JS__*/').join(MAPCJS + '\n' + js.split('/*__GAMES__*/').join(gjs));
fs.writeFileSync(path.join(D, 'map.html'), html);
/* 第五十七次 老師 4-20：新 版本 拼音 地圖 map2.html（同 一套 程式，window.MAP2 ＝ 每 一個 方框 正下方 ▲▼ 直接 換）*/
fs.writeFileSync(path.join(D, 'map2.html'), html.replace('<title>拼音 地圖</title>', '<title>新版 拼音 地圖</title>').replace('<body>', '<body class="m2"><script>window.MAP2=1</script>').replace('🗺️ 拼音 地圖：從 CVC 到 課本', '🗺️ 新版 拼音 地圖（▲▼ 直接 換）'));
/* 2026-11-17 第五十八次 老師 (7)：第三 版 map3.html ＝ 聲音 積木 拼字台（window.MAP3）*/
fs.writeFileSync(path.join(D, 'map3.html'), html.replace('<title>拼音 地圖</title>', '<title>聲音 積木 拼字台</title>').replace('<body>', '<body class="m3"><script>window.MAP3=1</script>').replace('🗺️ 拼音 地圖：從 CVC 到 課本', '🧱 聲音 積木 拼字台（第三 版）'));
console.log('map.html ok：字', QW.length, '個、音檔 名單', AVL.length, '個、', Math.round(html.length / 1024), 'KB');
