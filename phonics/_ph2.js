/* phonics/_ph2.js — 2026-11-12 第四十八次：Phonics Master 的 新 東西（_ph.js 原本 的 資料 一個 字 都 不改，這裡 只 「加」）
 *   ① 基礎版、進階版 字卡（老師：嚴禁 更動 原本 字卡 ➜ 另外 兩頁 basic.html、advanced.html；內容 ＝ 第四十七次 我的 建議，老師 2026-11-12「暫時 完全 依 建議」）
 *   ② 字首 v、y；雙子音 bl cl fl pl sl、br cr dr fr gr pr tr、sk sm sn sp st sw；三子音 scr spl spr str
 *   ③ magic e（a_e、i_e、o_e、u_e）、ai ay、ee ea、oa ow；字尾 st sk ft、ng nk（老師：ng ＝ ㄥ、nk ＝ ㄥㄎ）、tch、k、l
 *      老師 2026-11-12：i_e ＝ ㄞ；u_e 兩種 都 放：/ju/（cute）寫 一ㄨ、/u/（rule）寫 ㄨ
 *   ④ 部位〔字首＋母音〕、〔母音＋字尾〕的 聲音 碼（例 b-ae、0-ae-d）
 *   ⑤ 例外 字（真的 英文 字、唸法 跟 規則 不一樣）：真的 唸法 的 音標 ➜ 真的 雙語 注音（PH2.realTiles）
 */
(function (root) {
  'use strict';
  var PH = root.PH || (typeof require !== 'undefined' ? require('./_ph.js') : null);
  var CC = PH.CC, VC = PH.VC;
  /* ── 新 的 子音（字首 v、y；字尾 st sk ft ng nk k）── */
  var CONS2 = {
    'v': { zh: 'v', kk: 'v', ipa: 'v' },
    'y': { zh: '一', kk: 'j', ipa: 'j' },
    'k_end': { zh: 'ㄎ', sup: '〃', kk: 'k', ipa: 'k' },
    'st': { zh: ['ㄙ', 'ㄊ'], sup: [null, '〃'], kk: ['s', 't'], ipa: ['s', 't'] },
    'sk': { zh: ['ㄙ', 'ㄎ'], sup: [null, '〃'], kk: ['s', 'k'], ipa: ['s', 'k'] },
    'ft': { zh: ['ㄈ', 'ㄊ'], sup: ['〃', '〃'], kk: ['f', 't'], ipa: ['f', 't'] },
    'ng': { zh: 'ㄥ', kk: 'ŋ', ipa: 'ŋ' },
    'nk': { zh: ['ㄥ', 'ㄎ'], sup: [null, '〃'], kk: ['ŋ', 'k'], ipa: ['ŋ', 'k'] }
  };
  /* 雙子音、三子音 ＝ 一個 一個 子音 的 方塊 接 起來（r 一樣 是 疊 起來 的 ㄖ／ㄨ）*/
  var BLEND = { bl: ['b', 'l'], cl: ['c_hard', 'l'], fl: ['f', 'l'], pl: ['p', 'l'], sl: ['s', 'l'],
    br: ['b', 'r'], cr: ['c_hard', 'r'], dr: ['d', 'r'], fr: ['f', 'r'], gr: ['g_hard', 'r'], pr: ['p', 'r'], tr: ['t', 'r'],
    sk: ['s', 'k'], sm: ['s', 'm'], sn: ['s', 'n'], sp: ['s', 'p'], st: ['s', 't'], sw: ['s', 'w'],
    scr: ['s', 'c_hard', 'r'], spl: ['s', 'p', 'l'], spr: ['s', 'p', 'r'], str: ['s', 't', 'r'] };
  var BCODE = { cl: 'kl', cr: 'kr', scr: 'skr' };
  /* ── 新 的 母音 ── */
  var VOW2 = {
    'a_e': { zh: '一', sup: 'ㄝ', kk: 'e', ipa: 'eɪ', bg: 'var(--yellow)', magic: 1 },
    'i_e': { zh: 'ㄞ', kk: 'aɪ', ipa: 'aɪ', bg: 'var(--yellow)', magic: 1 },
    'o_e': { zh: 'ㄨ', sup: 'ㄜ', kk: 'o', ipa: 'oʊ', bg: 'var(--yellow)', magic: 1 },
    'u_e': { zh: '一ㄨ', kk: 'ju', ipa: 'ju', bg: 'var(--yellow)', magic: 1, uu: { zh: 'ㄨ', kk: 'u', ipa: 'u' } },
    'ay': { zh: '一', sup: 'ㄝ', kk: 'e', ipa: 'eɪ', bg: 'var(--yellow)', team: 1 },
    'ea': { zh: '一', kk: 'i', ipa: 'i', bg: 'var(--yellow)', team: 1 },
    'ow': { zh: 'ㄨ', sup: 'ㄜ', kk: 'o', ipa: 'oʊ', bg: 'var(--yellow)', team: 1 }
  };
  /* u_e 唸 /u/（不是 /ju/）：前面 最後 一個 子音 是 r l j ch sh t d n s z th（美國 英語 這些 後面 沒有 y 的 聲音：rule、flute、June、tube、dune）*/
  var UU_AFTER = /(r|l|j|ch|sh|t|d|n|s|z|th|無聲\)|有聲\))$/;
  function uIsU(I) { return UU_AFTER.test(I); }
  var VLIST_SHORT = [{ t: 'a' }, { t: 'e' }, { t: 'i' }, { t: 'o' }, { t: 'u' }];
  var VLIST_ADV = VLIST_SHORT.concat([{ t: 'a_e', key: 'a_e' }, { t: 'i_e', key: 'i_e' }, { t: 'o_e', key: 'o_e' }, { t: 'u_e', key: 'u_e' },
    { t: 'ai', name: true }, { t: 'ay', key: 'ay' }, { t: 'ee', name: true }, { t: 'ea', key: 'ea' }, { t: 'oa', name: true }, { t: 'ow', key: 'ow' }]);
  /* ── 兩個 新 的 字卡 頁 ── */
  var DECKS = {
    basic: { title: '基礎版', file: 'basic.html',
      INITIALS: { basic: ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'c', 'k', 'h', 'j', 'qu', 'w', 'r', 's', 'z', 'v', 'y'] },
      IG: [['basic', '單 子音']],
      VLIST: VLIST_SHORT,
      ENDINGS: { g1: ['b', 'd', 'g', 'm', 'n', 'p', 't', 'x'], g2: ['s', 'ck'] },
      EG: [['g1', '1'], ['g2', '2']], end0: 'd' },
    advanced: { title: '進階版', file: 'advanced.html',
      INITIALS: { blend: ['bl', 'cl', 'fl', 'pl', 'sl', 'br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'sk', 'sm', 'sn', 'sp', 'st', 'sw'], trip: ['scr', 'spl', 'spr', 'str'],
        basic: ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'c', 'k', 'h', 'j', 'w', 'r', 's', 'v', 'y'] },
      IG: [['blend', '雙 子音'], ['trip', '三 子音'], ['basic', '單 子音']],
      VLIST: VLIST_ADV,
      ENDINGS: { g1: ['無', 'b', 'd', 'g', 'k', 'l', 'm', 'n', 'p', 't', 'x'], g2: ['nd', 'nt', 'mp', 'st', 'sk', 'ft'], g3: ['sh', 'ch', 'th', 'ck', 'tch', 'ng', 'nk'] },
      EG: [['g1', '1'], ['g2', '2'], ['g3', '3']], end0: 't' }
  };
  var MAGIC_END = ['b', 'd', 'k', 'l', 'm', 'n', 'p', 't'];   /* magic e 後面 只 放 一個 子音 的 聲音（g、s、r 加 e 會 變 音：age、rose、care）*/
  var TEAM_END = ['d', 'k', 'l', 'm', 'n', 'p', 't', 'st', 'ch'];
  var SHORT_ONLY = ['g', 'x', 'ck', 'tch', 'sh', 'ng', 'nk', 'nd', 'mp', 'sk', 'ft', 'b'];
  /* 進階版 組合 合不合 英文 拼字 習慣（不合 ＝ 這一張 不 出現）*/
  function fits(I, V, E) {
    var t = V.key || V.t, sh = /^[aeiou]$/.test(t);
    if (t === 'ay' || t === 'ow') return E === '無';
    if (sh) { if (E === '無' || E === 'k' || E === 'l') return false; if ((E === 'ng' || E === 'nk') && t === 'e') return false; return true; }
    if (VOW2[t] && VOW2[t].magic) { if (MAGIC_END.indexOf(E) < 0) return false; if (t === 'u_e' && (I === 'qu' || I === 'w' || I === 'y')) return false; return true; }
    return TEAM_END.indexOf(E) >= 0;   /* ai ee ea oa */
  }
  /* ── 碼 ── */
  function initCode2(I, V) { if (BLEND[I]) return BCODE[I] || I; if (I === 'v' || I === 'y') return I; return PH.initCode(I, V.t.charAt(0) === 'e' || V.t.charAt(0) === 'i' ? 'e' : V.t); }
  function vowCode2(I, V) { var t = V.key || V.t; if (t === 'a_e' || t === 'ay') return 'ai'; if (t === 'i_e') return 'ii'; if (t === 'o_e' || t === 'ow') return 'oa'; if (t === 'ea') return 'ee'; if (t === 'u_e') return uIsU(I) ? 'uu' : 'yu'; return PH.vowCode(V); }
  function endCode2(E) { if (E === 'k') return 'k'; if (E === 'ng' || E === 'nk' || E === 'st' || E === 'sk' || E === 'ft') return E; return PH.endCode(E); }
  function code2(I, V, E) { var e = endCode2(E); return initCode2(I, V) + '-' + vowCode2(I, V) + (e ? '-' + e : ''); }
  /* 拼字（例 bl＋a_e＋k ＝ blake、b＋ay ＝ bay）*/
  function spell2(I, V, E) { var t = V.key || V.t, i = I.replace('(無聲)', '').replace('(有聲)', ''), e = E === '無' ? '' : E;
    if (VOW2[t] && VOW2[t].magic) return i + t.charAt(0) + e + 'e'; return i + t + e; }
  var IPA_I2 = { v: 'v', y: 'j', bl: 'bl', kl: 'kl', fl: 'fl', pl: 'pl', sl: 'sl', br: 'bɹ', kr: 'kɹ', dr: 'dɹ', fr: 'fɹ', gr: 'ɡɹ', pr: 'pɹ', tr: 'tɹ',
    sk: 'sk', sm: 'sm', sn: 'sn', sp: 'sp', st: 'st', sw: 'sw', skr: 'skɹ', spl: 'spl', spr: 'spɹ', str: 'stɹ', '0': '' };
  var IPA_V2 = { ii: 'aɪ', yu: 'juː' }, IPA_E2 = { st: 'st', sk: 'sk', ft: 'ft', ng: 'ŋ', nk: 'ŋk', k: 'k', l: 'l' };
  function ipa2(c) { var p = c.split('-'), V = Object.assign({ ae: 'æ', eh: 'ɛ', ih: 'ɪ', aa: 'ɑː', uh: 'ʌ', ar: 'ɑːɹ', er: 'ɜː', or: 'ɔːɹ', ai: 'eɪ', ee: 'iː', oa: 'oʊ', uu: 'uː', oo: 'ʊ', ou: 'aʊ' }, IPA_V2),
    I = Object.assign({ b: 'b', p: 'p', m: 'm', f: 'f', d: 'd', t: 't', n: 'n', l: 'l', k: 'k', h: 'h', s: 's', j: 'dʒ', w: 'w', r: 'ɹ', z: 'z', g: 'ɡ', kw: 'kw', ch: 'tʃ', sh: 'ʃ', th: 'θ', dh: 'ð' }, IPA_I2),
    E = Object.assign({ b: 'b', p: 'p', m: 'm', f: 'f', d: 'd', t: 't', n: 'n', l: 'l', g: 'ɡ', k: 'k', r: 'ɹ', s: 's', z: 'z', ks: 'ks', mp: 'mp', nd: 'nd', nt: 'nt', ch: 'tʃ', sh: 'ʃ', th: 'θ', shn: 'ʃən', zhn: 'ʒən' }, IPA_E2);
    return I[p[0]] + 'ˈ' + V[p[1]] + (p[2] ? E[p[2]] : '') + '.'; }
  /* 部位 的 聲音：〔字首＋母音〕＝ 字首 碼-母音 碼；〔母音＋字尾〕＝ 0-母音 碼-字尾 碼 */
  function partCode(full, part) { var p = full.split('-'); if (part === 'iv') return p[0] + '-' + p[1]; if (part === 've') return p[2] ? '0-' + p[1] + '-' + p[2] : 's_' + p[1]; return full; }
  /* 唸起來 像 不雅 字 的（新 的 組合）＝ 永遠 不放 */
  var BAD2 = ['sl-uh-t', 'pr-ih-k', 'kr-ae-p', 'sp-uh-nk', 'kl-ih-t', 'sm-uh-t', 'gr-oa-p', 'sp-ih-k', 'sn-ae-ch', 'bl-oa', 'sl-ae-g', 'tr-ae-mp', 'st-ih-ft',
    'sk-uh-nk', 'sh-ih-t', '0-ae-s', 'k-uh-nt', 'f-ae-g', 'sl-oa-b', 'sk-ae-nk', 'kr-uh-k', 'b-uh-t', 'tw-ae-t', 'd-ih-k', 'p-ih-s', 'k-ae-nk', 'h-oa', 'p-ee', 'p-uu', 'p-oa-n', 'p-ih-nk',
    'ch-ih-nk', 'g-uu-k', 'k-oa-k', 'j-ih-z', 'sp-uu-ch', 'kr-ae-k', 'st-ae-nk', 'sk-ae-nk', 'gr-ih-ng', 'b-ae-ng', 'sh-ae-g', 'n-ih-g', 'f-ae-nk', 'j-ae-p', 'v-ae-j', 'f-uh-ks', 's-uh-ks', 'f-ae-ks'];
  function bad2(c) { return PH.BAD.indexOf(c) >= 0 || BAD2.indexOf(c) >= 0; }
  /* ── 例外 字：CMU 美式 發音 字典 的 音素 ➜ 真的 雙語 注音／KK／IPA（老師 2026-11-12：例外 字 ＝ 唸 真的＋寫 真的 注音＋標 ⚠）──
     子音 照 字卡 的 寫法（字尾 塞音 右上角 〃、字尾 m n ～、字尾 l ＝ ㄛ、字尾 r ＝ ㄦ），母音：老師 的 母音 表＋i_e ＝ ㄞ；沒有 寫法 的 音（OY、ZH 開頭）＝ 這個 字 不放 */
  var RC = { B: ['ㄅ', 'b', 'b'], P: ['ㄆ', 'p', 'p'], M: ['ㄇ', 'm', 'm'], F: ['ㄈ', 'f', 'f'], D: ['ㄉ', 'd', 'd'], T: ['ㄊ', 't', 't'], N: ['ㄋ', 'n', 'n'], L: ['ㄌ', 'l', 'l'],
    K: ['ㄎ', 'k', 'k'], G: ['ㄍ', 'g', 'ɡ'], HH: ['ㄏ', 'h', 'h'], S: ['ㄙ', 's', 's'], Z: ['z', 'z', 'z'], JH: ['ㄓ', 'dʒ', 'dʒ'], CH: ['ㄔ', 'tʃ', 'tʃ'], SH: ['ㄕ', 'ʃ', 'ʃ'],
    TH: ['θ', 'θ', 'θ'], DH: ['ð', 'ð', 'ð'], W: ['ㄨ', 'w', 'w'], R: [['ㄖ', 'ㄨ'], 'r', 'ɹ'], Y: ['一', 'j', 'j'], V: ['v', 'v', 'v'], NG: ['ㄥ', 'ŋ', 'ŋ'] };
  var RV = { AE: ['ㄚ', 'ㄝ', 'æ', 'æ'], EH: ['ㄝ', null, 'ɛ', 'ɛ'], IH: ['ㄜ', '一', 'ɪ', 'ɪ'], AA: ['ㄚ', null, 'ɑ', 'ɑ'], AO: ['ㄛ', null, 'ɔ', 'ɔ'], AH: ['ㄜ', null, 'ʌ', 'ʌ'],
    EY: ['一', 'ㄝ', 'e', 'eɪ'], IY: ['一', null, 'i', 'i'], OW: ['ㄨ', 'ㄜ', 'o', 'oʊ'], UW: ['ㄨ', null, 'u', 'u'], UH: ['ㄛ', 'ㄨ', 'ʊ', 'ʊ'], AW: ['ㄠ', 'ㄝ', 'aʊ', 'aʊ'], AY: ['ㄞ', null, 'aɪ', 'aɪ'], ER: ['ㄜ', null, 'ɝ', 'ɝ'] };
  var STOPS = { B: 1, P: 1, D: 1, T: 1, G: 1, K: 1, F: 1 };
  /* ph ＝ 'S EH1 D' ➜ [{t, sup, bg, v, stack, dark}]（mode ＝ zh／kk／ipa）；不能 寫 ＝ null */
  function realTiles(ph, mode, fin) {   /* 只有 子音 的 一塊（bird 的 b、d）：fin ＝ 在 字 的 最後 ➜ 字尾 寫法 */
    var P = ph.split(' ').map(function (x) { return x.replace(/\d/g, ''); }), vi = -1, out = [];
    for (var k = 0; k < P.length; k++) if (RV[P[k]]) { if (vi >= 0) return null; vi = k; }
    if (vi < 0) vi = fin ? -1 : P.length;
    for (k = 0; k < P.length; k++) {
      var x = P[k], last = k === P.length - 1, m = mode === 'zh' ? 0 : mode === 'kk' ? 1 : 2;
      if (k === vi) { var v = RV[x]; if (!v) return null;
        if (mode === 'zh') out.push({ pi: k, t: v[0], sup: v[1], bg: x === 'ER' ? 'var(--yellow)' : VC, dark: x === 'ER', v: 1 });
        else out.push({ pi: k, t: mode === 'kk' ? v[2] : v[3], bg: x === 'ER' ? 'var(--yellow)' : VC, dark: x === 'ER', v: 1 });
        if (x === 'ER' && mode === 'zh') out.push({ pi: k, t: 'ㄦ', bg: CC });
        continue; }
      var c = RC[x]; if (!c) return null;
      if (k < vi) { if (x === 'R' && mode === 'zh') out.push({ pi: k, t: c[0], bg: CC, stack: 1 }); else out.push({ pi: k, t: c[m], bg: CC }); continue; }
      /* 字尾 */
      if (mode === 'zh') {
        if (x === 'L') out.push({ pi: k, t: 'ㄛ', bg: CC });
        else if (x === 'R') out.push({ pi: k, t: 'ㄦ', bg: CC });
        else out.push({ pi: k, t: c[0], bg: CC, sup: (x === 'M' || x === 'N') ? '~' : (STOPS[x] && last) ? '〃' : null });
      } else out.push({ pi: k, t: c[m], bg: CC });
    }
    return out;
  }
  /* 真的 唸法 ➜ 音標（給 語音 模型）*/
  var RI = { B: 'b', P: 'p', M: 'm', F: 'f', D: 'd', T: 't', N: 'n', L: 'l', K: 'k', G: 'ɡ', HH: 'h', S: 's', Z: 'z', JH: 'dʒ', CH: 'tʃ', SH: 'ʃ', TH: 'θ', DH: 'ð', W: 'w', R: 'ɹ', Y: 'j', V: 'v', NG: 'ŋ', ZH: 'ʒ',
    AE: 'æ', EH: 'ɛ', IH: 'ɪ', AA: 'ɑː', AO: 'ɔː', AH: 'ʌ', EY: 'eɪ', IY: 'iː', OW: 'oʊ', UW: 'uː', UH: 'ʊ', AW: 'aʊ', AY: 'aɪ', ER: 'ɜː', OY: 'ɔɪ' };
  function realIpa(ph) { var P = ph.split(' '), s = ''; P.forEach(function (x) { var b = x.replace(/\d/g, ''); if (/1/.test(x)) s += 'ˈ'; s += RI[b] || ''; }); return s + '.'; }
  /* 2026-11-14 第五十次（老師 第 2、3 點）：例外 字 的 每 一個 字母 正下方 對齊 它 的 音標 ＝ 把 真的 唸法 的 音 分 給 字母（動態 規劃，挑 最 合理 的 分法）
     align(字, 音素, 固定 的 字母 塊?) ➜ [{l: 字母, p: [第幾 個 音…]}]；沒有 音 ＝ 不 發音（灰色）*/
  var GP = { a: 'AE EY AA AO AH EH IH', e: 'EH IY IH AH', i: 'IH AY IY AH', o: 'AA OW AH AO UW UH', u: 'AH UW UH|Y UW', y: 'Y IY AY IH', w: 'W', b: 'B', c: 'K S', d: 'D', f: 'F', g: 'G JH', h: 'HH', j: 'JH', k: 'K', l: 'L', m: 'M', n: 'N NG', p: 'P', q: 'K', r: 'R', s: 'S Z SH', t: 'T SH CH', v: 'V', x: 'K S|G Z', z: 'Z',
    ai: 'EY EH', ay: 'EY', ee: 'IY IH', ea: 'IY EH EY', ei: 'EY IY', ey: 'EY IY', ie: 'IY AY', oa: 'OW', oe: 'OW UW', oo: 'UW UH AH', ou: 'AW UW AH OW UH', ow: 'OW AW', au: 'AO AA', aw: 'AO AA', ew: 'UW|Y UW', ue: 'UW', ui: 'UW IH', oy: 'OY', oi: 'OY',
    ch: 'CH K', sh: 'SH', th: 'TH DH', ph: 'F', wh: 'W HH', ck: 'K', ng: 'NG', nk: 'NG K', tch: 'CH', dge: 'JH', qu: 'K W', igh: 'AY', augh: 'AO', ough: 'AO|OW|UW|AW', al: 'AO L|AA L|AO', all: 'AO L', ould: 'UH D', gh: '', 
    ll: 'L', ss: 'S', ff: 'F', zz: 'Z', tt: 'T', dd: 'D', pp: 'P', bb: 'B', mm: 'M', nn: 'N', gg: 'G', rr: 'R' };
  var VS = 'AE EY AA AO AH EH IH IY AY OW UW UH AW OY ER';
  function gpCost(ch, P, last) {
    var t = GP[ch], key = P.join(' ');
    if (!P.length) { if (ch === 'e' && last) return 0.2; if (ch === 'gh' || ch === 'h' || ch === 'e' || ch === 'u' || ch === 'w' || ch === 'k' || ch === 'b' || ch === 'l' || ch === 't') return 1.2; if (/^[aeiouy]$/.test(ch)) return 1.6; return 4; }
    if (t !== undefined && t !== '') { var alts = t.indexOf('|') >= 0 ? t.split('|') : (t.split(' ').length > 1 && P.length === 1 ? t.split(' ') : [t]); if (alts.indexOf(key) >= 0) return 0.05 * ch.length; }
    if (ch === 'r' && key === 'ER') return 0.3;   /* her、girl、word 的 r ＝ ㄦ（前面 的 母音 一起 用 ER）*/
    var c = 0, isV = /^[aeiouy]+$/.test(ch);
    P.forEach(function (x) { var pv = VS.indexOf(x) >= 0 && x.length > 1; c += isV ? (pv ? 1 : 2.5) : (pv ? 3 : 1.6); });
    return c + 0.8 * (P.length - 1) + (ch.length > 1 && t === undefined ? 0.6 : 0);
  }
  function align(word, ph, units) {
    var P = ph.split(' ').map(function (x) { return x.replace(/\d/g, ''); }), W = word.toLowerCase();
    var U = units || null, n = U ? U.length : W.length, m = P.length, INF = 1e9, D = [], B = [];
    for (var i = 0; i <= n; i++) { D.push([]); B.push([]); for (var j = 0; j <= m; j++) { D[i].push(INF); B[i].push(null); } }
    D[0][0] = 0;
    for (i = 0; i < n; i++) for (j = 0; j <= m; j++) { if (D[i][j] >= INF) continue;
      var chs = U ? [[U[i], i + 1]] : [];
      if (!U) for (var L = 1; L <= 4 && i + L <= n; L++) { var cc = W.substr(i, L); if (L === 1 || GP[cc] !== undefined) chs.push([cc, i + L]); }
      chs.forEach(function (o) { for (var k = 0; k <= 3 && j + k <= m; k++) { var sub = P.slice(j, j + k), c = D[i][j] + gpCost(o[0], sub, o[1] === n);
        if (c < D[o[1]][j + k]) { D[o[1]][j + k] = c; B[o[1]][j + k] = [i, j, o[0]]; } } }); }
    var out = [], x = n, y = m; if (D[n][m] >= INF) return null;
    while (x > 0) { var b = B[x][y], idx = []; for (var q = b[1]; q < y; q++) idx.push(q); out.unshift({ l: b[2], p: idx }); x = b[0]; y = b[1]; }
    /* 母音 字母＋r ＝ ER（ㄜㄦ）：母音 字母 和 r 一起 用 這 一個 音（注音 ㄜ 在 母音 下面、ㄦ 在 r 下面）*/
    for (var z = 1; z < out.length; z++) if (out[z].l === 'r' && out[z].p.length === 1 && P[out[z].p[0]] === 'ER' && /^[aeiou]+$/.test(out[z - 1].l) && !out[z - 1].p.length) out[z - 1].p = out[z].p.slice();
    return out;
  }
  /* 把 realTiles 的 方塊 分 給 align 的 每 一塊（同 一個 音 給 兩塊 ＝ 第一 塊 拿 第一 個 方塊，最後 一塊 拿 剩下 的）*/
  function tilesFor(al, rt) {
    var used = {}; return al.map(function (u, k) {
      return rt.filter(function (x) { if (u.p.indexOf(x.pi) < 0) return false; var sh = al.filter(function (v) { return v.p.indexOf(x.pi) >= 0; });
        if (sh.length < 2) return true; var mine = rt.filter(function (y) { return y.pi === x.pi; }), at = mine.indexOf(x), first = sh[0] === u;
        return first ? at === 0 : at > 0; }); }); }
  var PH2 = { align: align, tilesFor: tilesFor, CONS2: CONS2, BLEND: BLEND, VOW2: VOW2, VLIST_ADV: VLIST_ADV, DECKS: DECKS, fits: fits, code2: code2, spell2: spell2, ipa2: ipa2, partCode: partCode, bad2: bad2, BAD2: BAD2,
    uIsU: uIsU, realTiles: realTiles, realIpa: realIpa, initCode2: initCode2, vowCode2: vowCode2, endCode2: endCode2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = PH2; else root.PH2 = PH2;
})(this);
