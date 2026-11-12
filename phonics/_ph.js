/* phonics/_ph.js — 🔤 Phonics Master 共用 資料＋發音 碼（字卡 頁、遊戲 頁、node build 都 用 這一份）
 * 2026-11-12 第四十七次 第 2 點（老師 的 Phonics Master，原本 在 claude.ai 字卡 頁）：
 *   ① 發音 ＝ 照 字卡 下面 的 雙語 注音 唸：每一張 卡 ＝ 字首 碼＋母音 碼＋字尾 碼（例 k-ae-d），音檔 ＝ phonics/au/<碼>.mp3
 *      （tools/ph_gen.py 把 碼 的 音標 直接 送進 HiFi-Captain 女聲；不 經過 拼字 ➜ Ced 不會 唸 C-E-D、kad 的 a 一定 /æ/、kod 的 o 一定 /ɑ/）
 *   ② 母音 o、ar 右上角 的 愛心 暫時 拿掉（老師）
 *   ③ 真的 英文 字 但是 唸法 跟 字卡 規則 不一樣（said、word、ward、good…，phonics/_exc.json，CMU 發音 字典 自動 找）＝ 暫時 不放；
 *      唸起來 像 不雅 字 的 組合（BAD）＝ 永遠 不放
 */
(function (root) {
  'use strict';
  var VC = 'var(--vowel)', CC = 'var(--cons)';
  var CONS = {
    'b': { zh: 'ㄅ', kk: 'b', ipa: 'b' }, 'p': { zh: 'ㄆ', kk: 'p', ipa: 'p' },
    'm': { zh: 'ㄇ', kk: 'm', ipa: 'm' }, 'f': { zh: 'ㄈ', kk: 'f', ipa: 'f' },
    'd': { zh: 'ㄉ', kk: 'd', ipa: 'd' }, 't': { zh: 'ㄊ', kk: 't', ipa: 't' },
    'n': { zh: 'ㄋ', kk: 'n', ipa: 'n' }, 'l': { zh: 'ㄌ', kk: 'l', ipa: 'l' },
    'k': { zh: 'ㄎ', kk: 'k', ipa: 'k' }, 'h': { zh: 'ㄏ', kk: 'h', ipa: 'h' },
    's': { zh: 'ㄙ', kk: 's', ipa: 's' },
    'g_hard': { zh: 'ㄍ', kk: 'g', ipa: 'ɡ' }, 'g_soft': { zh: 'ㄓ', kk: 'dʒ', ipa: 'dʒ' },
    'c_hard': { zh: 'ㄎ', kk: 'k', ipa: 'k' }, 'c_soft': { zh: 'ㄙ', kk: 's', ipa: 's' },
    'j': { zh: 'ㄓ', kk: 'dʒ', ipa: 'dʒ' },
    'w': { zh: 'ㄨ', kk: 'w', ipa: 'w' },
    'z': { zh: 'z', kk: 'z', ipa: 'z' },
    'ch': { zh: 'ㄔ', kk: 'tʃ', ipa: 'tʃ' }, 'sh': { zh: 'ㄕ', kk: 'ʃ', ipa: 'ʃ' },
    'th(無聲)': { zh: 'θ', kk: 'θ', ipa: 'θ' },
    'th(有聲)': { zh: 'ð', kk: 'ð', ipa: 'ð' },
    'ph': { zh: 'ㄈ', kk: 'f', ipa: 'f' },
    'wh': { zh: 'ㄨ', kk: 'hw', ipa: 'w' },
    'qu': { zh: ['ㄎ', 'ㄨ'], kk: ['k', 'w'], ipa: ['k', 'w'] },
    'r': { zh: ['ㄖ', 'ㄨ'], kk: 'r', ipa: 'ɹ', stack: true },
    'r_end': { zh: 'ㄦ', kk: 'r', ipa: 'ɹ' },
    'ck': { zh: 'ㄎ', sup: '〃', kk: 'k', ipa: 'k' },
    'x': { zh: ['ㄎ', 'ㄙ'], kk: ['k', 's'], ipa: ['k', 's'] },
    'm_end': { zh: 'ㄇ', sup: '~', kk: 'm', ipa: 'm' },
    'mb': { zh: 'ㄇ', sup: '~', kk: 'm', ipa: 'm' },
    'mp': { zh: ['ㄇ', 'ㄆ'], sup: ['~', '〃'], kk: ['m', 'p'], ipa: ['m', 'p'] },
    'n_end': { zh: 'ㄋ', sup: '~', kk: 'n', ipa: 'n' },
    'nd': { zh: ['ㄋ', 'ㄉ'], sup: ['~', '〃'], kk: ['n', 'd'], ipa: ['n', 'd'] },
    'nt': { zh: ['ㄋ', 'ㄊ'], sup: ['~', '〃'], kk: ['n', 't'], ipa: ['n', 't'] },
    'tch': { zh: 'ㄔ', kk: 'tʃ', ipa: 'tʃ' },
    'ss': { zh: 'ㄙ', kk: 's', ipa: 's' }, 'zz': { zh: 'z', kk: 'z', ipa: 'z' },
    'l_end': { zh: 'ㄛ', kk: 'l', ipa: 'l' },
    'd_end': { zh: 'ㄉ', sup: '〃', kk: 'd', ipa: 'd' },
    'p_end': { zh: 'ㄆ', sup: '〃', kk: 'p', ipa: 'p' },
    'f_end': { zh: 'ㄈ', sup: '〃', kk: 'f', ipa: 'f' },
    't_end': { zh: 'ㄊ', sup: '〃', kk: 't', ipa: 't' },
    'g_end': { zh: 'ㄍ', sup: '〃', kk: 'g', ipa: 'ɡ' },
    'sion': { zh: 'ʒən', kk: 'ʒən', ipa: 'ʒən' }
  };
  /* 第四十七次：o、ar 右上角 的 愛心 拿掉（老師：暫時 刪除）*/
  var VOW = {
    'a': { zh: 'ㄚ', sup: 'ㄝ', kk: 'æ', ipa: 'æ', bg: VC },
    'e': { zh: 'ㄝ', kk: 'ɛ', ipa: 'ɛ', bg: VC },
    'i': { zh: 'ㄜ', sup: '一', kk: 'ɪ', ipa: 'ɪ', bg: VC },
    'o': { zh: 'ㄚ', kk: 'ɑ', ipa: 'ɑ', bg: VC },
    'u': { zh: 'ㄜ', kk: 'ʌ', ipa: 'ʌ', bg: VC },
    'ai': { zh: '一', sup: 'ㄝ', kk: 'e', ipa: 'eɪ', bg: VC },
    'ee': { zh: '一', kk: 'i', ipa: 'i', bg: VC },
    'oa': { zh: 'ㄨ', sup: 'ㄜ', kk: 'o', ipa: 'oʊ', bg: VC },
    'oo_long': { zh: 'ㄨ', kk: 'u', ipa: 'u', bg: 'var(--red)' },
    'oo_short': { zh: 'ㄛ', sup: 'ㄨ', kk: 'ʊ', ipa: 'ʊ', bg: 'var(--amber)' },
    'ou': { zh: 'ㄠ', sup: 'ㄝ', kk: 'aʊ', ipa: 'aʊ', bg: VC }
  };
  var RVOW = {
    'ar': { zh: 'ㄚ', bg: VC, vkk: 'ɑ', vipa: 'ɑ', rkk: 'r', ripa: 'ɹ' },
    'er': { zh: 'ㄜ', bg: 'var(--yellow)', vkk: 'ɚ', vipa: 'ɚ', rkk: '', ripa: '', dark: true },
    'ir': { zh: 'ㄜ', bg: 'var(--yellow-d)', vkk: 'ɚ', vipa: 'ɚ', rkk: '', ripa: '', dark: true },
    'ur': { zh: 'ㄜ', bg: 'var(--yellow-d)', vkk: 'ɝ', vipa: 'ɝ', rkk: '', ripa: '', dark: true },
    'or': { zh: 'ㄛ', bg: VC, vkk: 'ɔ', vipa: 'ɔ', rkk: 'r', ripa: 'ɹ' }
  };
  var TRIPLE = {
    zh: [{ t: 'ㄕ' }, { t: 'ㄜ', v: true }, { t: 'ㄋ', sup: '~' }],
    kk: [{ t: 'ʃ' }, { t: 'ə', v: true }, { t: 'n' }],
    ipa: [{ t: 'ʃ' }, { t: 'ə', v: true }, { t: 'n' }]
  };
  var INITIALS = {
    basic: ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'c', 'k', 'h', 'j', 'qu', 'w', 'r', 's', 'z'],
    adv: ['j', 'ch', 'sh', 'th(無聲)', 'th(有聲)', 'ph', 'wh', 'qu']
  };
  var ENDINGS = {
    g1: ['無', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'ck', 'r', 's', 'z', 'x'],
    g2: ['b', 'p', 'm', 'f', 'ph', 'd', 't', 'n', 'l', 'g', 'ck', 'mb', 'mp', 'nd', 'nt', 'ch', 'tch', 'sh', 'th', 's', 'ss', 'zz', 'tion', 'sion', 'ssion'],
    g3: ['s', 'ss', 'b', 'p', 'd', 't', 'g', 'ck', 'm', 'mb', 'mp', 'n', 'nd', 'nt', 'ph', 'ch', 'sh', 'th']
  };
  var VLIST = [
    { t: 'a' }, { t: 'e' }, { t: 'i' }, { t: 'o' }, { t: 'u' },
    { t: 'ar' }, { t: 'er' }, { t: 'ir' }, { t: 'or' }, { t: 'ur' },
    { t: 'ai', name: true }, { t: 'ee', name: true }, { t: 'oa', name: true },
    { t: 'oo', key: 'oo_long', mark: '長' }, { t: 'oo', key: 'oo_short', mark: '短' },
    { t: 'ou' }
  ];
  var SOFT = ['e', 'i', 'ee', 'er', 'ir'];

  /* ── 發音 碼 ── */
  function initCode(I, vt) {
    if (I === 'g') return SOFT.indexOf(vt) >= 0 ? 'j' : 'g';
    if (I === 'c') return SOFT.indexOf(vt) >= 0 ? 's' : 'k';
    return { qu: 'kw', 'th(無聲)': 'th', 'th(有聲)': 'dh', ph: 'f', wh: 'w' }[I] || I;
  }
  function vowCode(V) { return { a: 'ae', e: 'eh', i: 'ih', o: 'aa', u: 'uh', ar: 'ar', er: 'er', ir: 'er', ur: 'er', or: 'or', ai: 'ai', ee: 'ee', oa: 'oa', ou: 'ou' }[V.t] || (V.key === 'oo_long' ? 'uu' : 'oo'); }
  function endCode(E) { if (E === '無') return ''; return { g: 'g', ck: 'k', x: 'ks', ph: 'f', mb: 'm', tch: 'ch', ss: 's', zz: 'z', tion: 'shn', ssion: 'shn', sion: 'zhn' }[E] || E; }
  /* 母音 是 ar／er／ir／or／ur 時 字尾 r 不 顯示、不 發音（原本 的 規則：barr ➜ bar）*/
  function effEnd(V, E) { return (E === 'r' && RVOW[V.t]) ? '無' : E; }
  function code(I, V, E) { E = effEnd(V, E); var e = endCode(E); return initCode(I, V.t) + '-' + vowCode(V) + (e ? '-' + e : ''); }
  /* 碼 ➜ 音標（送進 語音 模型；z 開頭 拉長 一點，跟 s 分得 出來）*/
  var IPA_I = { b: 'b', p: 'p', m: 'm', f: 'f', d: 'd', t: 't', n: 'n', l: 'l', k: 'k', h: 'h', s: 's', j: 'dʒ', w: 'w', r: 'ɹ', z: 'z', g: 'ɡ', kw: 'kw', ch: 'tʃ', sh: 'ʃ', th: 'θ', dh: 'ð' };
  var IPA_V = { ae: 'æ', eh: 'ɛ', ih: 'ɪ', aa: 'ɑː', uh: 'ʌ', ar: 'ɑːɹ', er: 'ɜː', or: 'ɔːɹ', ai: 'eɪ', ee: 'iː', oa: 'oʊ', uu: 'uː', oo: 'ʊ', ou: 'aʊ' };
  var IPA_E = { b: 'b', p: 'p', m: 'm', f: 'f', d: 'd', t: 't', n: 'n', l: 'l', g: 'ɡ', k: 'k', r: 'ɹ', s: 's', z: 'z', ks: 'ks', mp: 'mp', nd: 'nd', nt: 'nt', ch: 'tʃ', sh: 'ʃ', th: 'θ', shn: 'ʃən', zhn: 'ʒən' };
  function ipaOf(c) { var p = c.split('-'); return IPA_I[p[0]] + 'ˈ' + IPA_V[p[1]] + (p[2] ? IPA_E[p[2]] : '') + '.'; }
  /* 拼字（字卡 上 的 字）*/
  function spell(I, V, E) { E = effEnd(V, E); return I.replace('(無聲)', '').replace('(有聲)', '') + V.t + (E === '無' ? '' : E); }
  /* 唸起來 像 不雅 的 字（碼）＝ 永遠 不放（字卡、遊戲 都 不 出現）*/
  var BAD = ['f-uh-k', 'sh-ih-t', 'd-ih-k', 'k-aa-k', 'k-uh-m', 't-ih-t', 'f-ae-g', 'n-ih-g', 'n-ih-g-r', 'p-ih-s', 'b-ih-ch', 'k-uh-nt', 'j-ih-z', 'p-or-n', 't-er-d',
    'f-ar-t', 's-eh-ks', 'h-oa', 'h-or', 'sh-ae-g', 'f-ae-p', 'b-uu-b', 'p-uu-p', 'p-uu', 'p-ee', 'w-ee-d', 'k-uu-n', 'l-eh-z', 'b-uh-m', 'd-ae-m', 'j-ae-p',
    'p-uh-s', 'k-uh-k', 'k-ih-l', 'p-ih-mp', 'h-eh-l', 't-ih-ts', 'b-ar-f', 'p-uu-k'];
  var EXC = {};   /* 真的 英文 字、唸法 不一樣（build 從 _exc.json 填）*/
  function skip(I, V, E) { var c = code(I, V, E); return BAD.indexOf(c) >= 0 || !!EXC[spell(I, V, E).toLowerCase() + '|' + c]; }
  var PH = { CONS: CONS, VOW: VOW, RVOW: RVOW, TRIPLE: TRIPLE, INITIALS: INITIALS, ENDINGS: ENDINGS, VLIST: VLIST, SOFT: SOFT, VC: VC, CC: CC,
    initCode: initCode, vowCode: vowCode, endCode: endCode, effEnd: effEnd, code: code, ipaOf: ipaOf, spell: spell, BAD: BAD, EXC: EXC, skip: skip };
  if (typeof module !== 'undefined' && module.exports) module.exports = PH; else root.PH = PH;
})(this);
