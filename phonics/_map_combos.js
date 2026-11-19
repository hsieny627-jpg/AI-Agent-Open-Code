/* phonics/_map_combos.js — 🗺️ 拼音 地圖 的 字首／母音／字尾 清單＋「合 英文 拼字 習慣」規則＋碼（_map.js 和 _codes57_build.js 共用；2026-11-17 第五十七次）*/
(function (root) {
  var ON = { b: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z', 'qu', 'sh', 'ch', 'th', 'th2', 'wh'], a2: ['bl', 'cl', 'fl', 'gl', 'pl', 'sl', 'br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'sk', 'sm', 'sn', 'sp', 'st', 'sw'], a3: ['scr', 'spl', 'spr', 'str'] };
  var VV = { b: ['a', 'e', 'i', 'o', 'u'], a: ['a_e', 'e_e', 'i_e', 'o_e', 'u_e', 'ai', 'ay', 'ee', 'ea', 'oa', 'ow'], t: ['ou', 'ow2', 'oi', 'oy', 'au', 'aw', 'oo', 'oo2', 'ar', 'or', 'er', 'ir', 'ur'] };
  var CO = { b: ['無', 'b', 'd', 'g', 'k', 'l', 'm', 'n', 'p', 't', 'x', 's', 'f', 'z'], d: ['sh', 'ch', 'tch', 'th', 'ng', 'll', 'ff', 'ss', 'dge', 've'], a2: ['nd', 'nt', 'mp', 'st', 'sk', 'ft', 'nk'], n2: ['pt', 'ct', 'xt', 'lp', 'lf', 'lt', 'sp', 'mb', 'ld', 'lk'], a3: ['nch'] };
  var VC = { a: 'ae', e: 'eh', i: 'ih', o: 'aa', u: 'uh', a_e: 'ai', e_e: 'ee', ai: 'ai', ay: 'ai', i_e: 'ii', o_e: 'oa', oa: 'oa', ow: 'oa', ee: 'ee', ea: 'ee', u_e: 'yu', ou: 'ou', ow2: 'ou', oi: 'oy', oy: 'oy', au: 'ao', aw: 'ao', oo: 'uu', oo2: 'oo', ar: 'ar', or: 'or', er: 'er', ir: 'er', ur: 'er' };
  var CC = { x: 'ks', ct: 'kt', xt: 'kst', mb: 'm', tch: 'ch', ll: 'l', ff: 'f', ss: 's', dge: 'j', ve: 'v' };   /* 第六十一次 老師 4：dge ＝ ㄓ（badge edge bridge）、ve ＝ v（have give）*/
  var ONC = function (o) { return { th2: 'dh', c: 'k', qu: 'kw', wh: 'w', sc: 'sk', scr: 'skr', cl: 'kl', cr: 'kr' }[o] || o; };
  var MAGIC = ['無', 'b', 'd', 'k', 'l', 'm', 'n', 'p', 't'], TEAM = ['無', 'd', 'k', 'l', 'm', 'n', 'p', 't', 'st', 'ch', 'f', 's', 'th'], SHORTONLY = ['ck', 'tch', 'x', 'ng', 'nk', 'g', 'b', 'nd', 'mp', 'sk', 'ft', 'pt', 'ct', 'xt', 'lp', 'lf', 'lt', 'sp', 'mb', 'ld', 'lk', 'nch', 'sh', 'z'];
  /* 合不合 英文 拼字 習慣：不合 ＝ 地圖 上 那 一顆 變 暗（點 了 會 說 為什麼）*/
  function ok(o, v, c) {
    var sh = VV.b.indexOf(v) >= 0;
    /* 2026-11-18 第六十次 老師 4-(4)：字尾 加 ll ff ss（兩個 字母 一個 聲音）；短 母音 後面 的 l f s 照 FLoSS 規則 寫 兩個 ➜ 單 一個 l f s 變 暗 */
    if (c === 'dge') return sh;   /* 短 母音 後面 的 ㄓ 寫 dge（跟 ck、tch 同 一個 規則）*/
    if (c === 've') return v === 'a' || v === 'i';   /* 英文 字 不 用 v 結尾；have give live 是 短 母音（很多 ve 字 母音 唸 名字：gave five ➜ 那 是 magic e）*/
    if (c === 'll' || c === 'ff' || c === 'ss') return sh && !(c === 'll' && v === 'o') && !(c === 'ff' && v === 'e');
    if (v === 'oo2') return ['d', 'k', 't'].indexOf(c) >= 0;   /* 短 的 oo（good book foot）*/
    if (sh) { if (c === '無') return false; if (c === 'l' || c === 'f' || c === 's') return false; if ((c === 'ld' || c === 'lk') && (v === 'a' || v === 'o')) return false; if (c === 'mb' && 'aiu'.indexOf(v) < 0) return false; if (c === 'ng' && v === 'e') return false; if (c === 'nk' && v === 'e') return false; return true; }
    if (v === 'ay' || v === 'ow' || v === 'oy' || v === 'aw') return c === '無' || (v === 'aw' && (c === 'n' || c === 'l' || c === 'k')) || (v === 'ow' && c === 'n');
    if (v === 'ow2') return c === '無' || c === 'n' || c === 'l';
    if (/_e$/.test(v)) return MAGIC.indexOf(c) >= 0 && c !== '無';
    if (v === 'ou') return ['d', 't', 'n', 'nd', 'nt', 'ch', 'th', 's'].indexOf(c) >= 0;
    if (v === 'oi') return ['l', 'n', 'nt', 's', 'st'].indexOf(c) >= 0;
    if (v === 'au') return ['l', 'nch', 't', 'th', 'lt'].indexOf(c) >= 0;
    if (/^(ar|or|er|ir|ur)$/.test(v)) return ['無', 'b', 'd', 'k', 'm', 'n', 'p', 't', 'st', 'sh', 'ch', 'th', 'f', 'l', 'g', 'nt', 'nd'].indexOf(c) >= 0;
    if (v === 'oo') return ['無', 'd', 'k', 'l', 'm', 'n', 'p', 't', 'f', 'th', 'st', 'ch'].indexOf(c) >= 0;
    return TEAM.indexOf(c) >= 0 && SHORTONLY.indexOf(c) < 0;
  }
  function code(o, v, c) { var cc = c === '無' ? '' : (CC[c] || c), vc = VC[v];
    if (v === 'a' && c === 'll') vc = 'ao';   /* ball tall fall：all 的 a ＝ ㄛ */
    if (!o || o === '無') return '0-' + vc + (cc ? '-' + cc : '');
    if (v === 'u_e' && /(r|l|j|ch|sh|t|d|n|s|z|th)$/.test(o)) vc = 'uu';
    return ONC(o) + '-' + vc + (cc ? '-' + cc : ''); }
  /* 拼字：短 母音 後 ll ss ff zz、ck；ch 不 自動 變 tch（老師：點 ch 就 是 ch，tch 另外 一顆）*/
  function spell(o, v, c) { var sh = VV.b.indexOf(v) >= 0, cc = c === '無' ? '' : c, cs = cc; if (o === '無') o = ''; if (o === 'th2') o = 'th';   /* 第六十三次：有聲 th（this、that）拼 起來 一樣 是 th */
    if (sh) { if (cc === 'k') cs = 'ck'; else if (cc === 'z') cs = 'zz'; }
    if (/_e$/.test(v)) return o + v[0] + cs + 'e'; if (v === 'ow2') return o + 'ow' + cs; if (v === 'oo2') return o + 'oo' + cs; return o + v + cs; }
  function all() { var out = [];
    ON.b.concat(ON.a2, ON.a3).forEach(function (o) { VV.b.concat(VV.a, VV.t).forEach(function (v) { CO.b.concat(CO.d, CO.a2, CO.n2, CO.a3).forEach(function (c) { if (ok(o, v, c)) out.push({ o: o, v: v, c: c, code: code(o, v, c), w: spell(o, v, c) }); }); }); });
    return out; }
  var M = { ON: ON, VV: VV, CO: CO, VC: VC, ok: ok, code: code, spell: spell, all: all, ONC: ONC };
  if (typeof module !== 'undefined') module.exports = M; else root.MAPC = M;
})(this);
