/* live/_qbank.js — ⚡ 現場任務 的 題目（2026-10-18 第十二次 老師 4(3)：老師 自己 選 三年級 或 四年級；題目 ＝ 那個 年級 10 種 句型遊戲 ＋ Review 1 遊戲 全部）
 * build 的時候 跑（node live/_build.js 會 require 這一支）。
 * 一題：{ ty:'mc'|'or', t 題目 HTML, o 選項 HTML（第 0 個 ＝ 正解，2～4 個）, ot 選項 純文字, h 為什麼,
 *         ae 正確答案 的 英文, ag 逐字中文 [[英文, 中文]…], az 整句翻譯, au 正確答案 的 語音檔, al 聽力題 要 聽 的 語音檔, i 在 那個 遊戲 第幾題 }
 * 錯題分析 的 ae／ag／az／au 跟 老師看板 同一份（score/_bank.js 的 enrich ＝ 學生 答錯頁 同一個 字典 sentences/_gloss.js）。
 * Review 1 自己畫 的 圖示（SVG）很大、很多題 重複 ➜ 換成 §i:字§，網頁 再 換回來（ICON） */
const path = require('path'), ROOT = path.join(__dirname, '..');
const BANK = require('../score/_bank.js'), txt = BANK.txt, enrich = BANK.enrich, LMN = BANK.LMN;
const SITE = { 3: 'G3 - L1 + L2', 4: 'sentences' };
const R1 = require(path.join(ROOT, 'review1', '_game_data.js'));
const ICON = {}; Object.keys(R1.OIC).forEach(k => { ICON[k] = R1.OIC[k]; });
const ICONS = Object.keys(ICON).filter(k => /<svg/.test(ICON[k])).sort((a, b) => ICON[b].length - ICON[a].length);
const pack = h => { h = String(h == null ? '' : h); ICONS.forEach(k => { if (h.indexOf(ICON[k]) >= 0) h = h.split(ICON[k]).join('§i:' + k + '§'); }); return h; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const joinS = a => a.join(' ').replace(/ ([?.,!])/g, '$1').replace(/ ([’']s|[’']m|[’']re)/g, '$1');
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const plain = h => txt(h).replace(/〔[^〕]*〕/g, '').trim();
/* Review 1 的 選項：看 英文 選 圖（pic）＝ 圖示 ＋ 中文；其他 ＝ 英文 字 */
const r1opt = (c, x) => c.pic ? '<span class="opic"><span class="oi">' + (R1.OIC[x] || '') + '</span><span class="oz">' + (R1.OZH[x] || '') + '</span></span>' : esc(x);
const r1ot = (c, x) => c.pic ? (R1.OZH[x] || x) : x;
/* 一題 ➜ 現場任務 的 格式（c ＝ 遊戲 題庫 那一題、b ＝ score/_bank.js 那一題〔有 ae／ag…〕、r1 ＝ Review 1） */
function one(ty, c, b, m, B, r1, dir) {
  const meta = q => ({ ae: q.ae || '', ag: q.ag || [], az: q.az || '', au: q.au || '' });
  const h = b ? b.h : txt(c.h || '');
  let q = null;
  switch (ty) {
    case 'g1': case 'g10':
      q = { t: c.q, o: c.o.map(x => r1 ? r1opt(c, x) : esc(x)), ot: c.o.map(x => r1 ? r1ot(c, x) : x) }; break;
    case 'g4': q = { t: esc(c.f) + '<br><small>' + esc(c.d) + '</small>', o: c.o.map(esc), ot: c.o }; if (c.t) q.dg = { f: c.f, t: c.t, fz: c.fz, tz: c.tz }; break;   /* 四年級：等人小遊戲 用 拖曳 變身（2026-10-19 第十三次 1-A） */
    case 'g5': q = { t: '🎧 聽 大螢幕，選 你 聽到 的', o: c.o.map(x => r1 ? '<span class="opic"><span class="oi">' + (R1.OIC[x] || '') + '</span><span class="oz">' + esc(x) + '</span></span>' : esc(x)), ot: c.o, ls: 1 }; break;
    case 'g8': q = { t: (c.b === '___' ? '' : esc(c.b) + ' ') + '<span class="blk">＿＿</span>' + (/^[.?!,]/.test(c.a) ? '' : ' ') + esc(c.a) + (c.zh ? '<br><small>' + c.zh + '</small>' : ''), o: c.o.map(esc), ot: c.o }; break;
    case 'g2': q = { t: esc(c.txt) + '<br><small>' + esc(c.zh) + '</small>', o: b.o.map(esc), ot: b.o }; break;
    case 'g9': { const w = Array.isArray(c) ? c[0] : ''; q = { t: (r1 && R1.OIC[w] ? '<span class="qic">' + R1.OIC[w] + '</span>' : '') + '「' + esc(w) + '」<br><small>' + esc(m.rule) + '</small>', o: b.o.map(esc), ot: b.o }; break; }
    case 'g7': { const fx = String(c.fix || '').replace(/^改成\s*/, ''), ok = c.b < 0 ? '✅ 這一句 沒錯' : c.w[c.b], seen = new Set([ok]), d = [];
      c.w.forEach(w => { if (!seen.has(w) && /[A-Za-z]/.test(w)) { seen.add(w); d.push(w); } });
      const pick = d.sort(() => 0).slice(0, c.b < 0 ? 3 : 2); if (c.b >= 0) pick.push('✅ 這一句 沒錯');
      if (pick.length < (c.b < 0 ? 3 : 3)) return null;
      const O = [ok].concat(pick).slice(0, 4); q = { t: esc(joinS(c.w)) + '<br><small>哪一個 字 錯了？' + (c.zh ? '（' + esc(c.zh) + '）' : '') + '</small>', o: O.map(x => /^✅/.test(x) ? esc(x) : '「' + esc(x) + '」'), ot: O, fx }; break; }
    case 'g6': { const L = B, en = c[0], zh = r1 ? c[2] : c[1], others = L.filter(x => x !== c).map(x => r1 ? x[2] : x[1]).filter((v, i, a) => v !== zh && a.indexOf(v) === i);
      const O = [zh].concat(others.slice(0, 3)); if (O.length < 4) return null;
      const e = enrich(dir, { q: en, o: O, sp: en });
      q = { t: '<span class="qen">' + esc(en) + '</span><br><small>中文 是 哪一個？</small>', o: O.map(esc), ot: O }; Object.assign(q, meta(e)); if (!q.az) q.az = zh; if (!q.ag.length) q.ag = [[en, zh]];
      return Object.assign(q, { ty: 'mc', h: esc(en) + ' ＝ ' + esc(zh) }); }
    case 'g3': { const s = c.s, p = /^[.?!]$/.test(s[s.length - 1]) ? s[s.length - 1] : '', w = p ? s.slice(0, -1) : s.slice();
      if (w.length > 8 || w.some(x => /,/.test(x))) return null;
      return Object.assign({ ty: 'or', t: '🧩 排出 這一句 英文', zh: c.zh, tiles: w, a: w.join('|'), p, h }, meta(b || {})); }
  }
  if (!q || new Set(q.ot).size !== q.ot.length || !q.ot[0]) return null;
  Object.assign(q, meta(b || {}), { ty: 'mc', h });
  if (ty === 'g5' && b) q.al = b.al || b.au;
  return q;
}
/* 一個 年級 的 題目 組：句型遊戲 10 種（這個 年級 的 網站）＋ Review 1 遊戲（三、四年級 共用 ＋ 自己 年級 的 進階） */
function groups(g) {
  const out = [], dir = SITE[g], B = require(path.join(ROOT, dir, '_game_data.js'));
  B.GAMES.forEach(m => { const L = B[m.id.toUpperCase()] || [], key = 'g' + g + 'gm_' + m.id, SB = BANK[key];
    const qs = L.map((c, i) => { const x = one(m.id, c, SB && SB.qs[i], m, L, false, dir); return x && Object.assign(x, { i }); }).filter(Boolean);
    if (qs.length) out.push({ k: 's' + m.id, sec: '句型遊戲', nm: m.ic + ' ' + m.name, qs }); });
  R1.GAMES.forEach(m => { if (m.sec === 'x' && m.id !== 'x' + g) return;
    const L = R1.BANK[m.id] || [], SB = BANK['g*r1_' + m.id], ty = m.ty;
    const qs = L.map((c, i) => { const x = one(ty, c, SB && SB.qs[i], m, L, true, 'review1'); return x && Object.assign(x, { i }); }).filter(Boolean);
    if (qs.length) out.push({ k: 'r' + m.id, sec: 'Review 1 遊戲', nm: String(R1.SEC[m.sec]).split('　')[0] + '｜' + m.ic + ' ' + m.name, qs }); });
  out.forEach(G => G.qs.forEach(q => { ['t', 'o', 'zh'].forEach(k => { if (Array.isArray(q[k])) q[k] = q[k].map(pack); else if (q[k] != null) q[k] = pack(q[k]); }); }));
  return out;
}
/* ⚡ 等人小遊戲（老師 6）：這個 年級 句型遊戲 的 題目（第幾題 ＝ 成績系統 g年級gm_lm-遊戲 的 第幾題）*/
function mini(g, G) { const o = {}; Object.keys(LMN).forEach(id => { const x = G.filter(y => y.k === 's' + id)[0]; if (x) o[id] = { nm: LMN[id], qs: x.qs.filter(q => !q.ls) }; }); return o; }
const ICONUSE = {};
module.exports = function () {
  const G3 = groups(3), G4 = groups(4), GR = {}, LIST = { 3: [], 4: [] };
  /* Review 1 兩個 年級 共用 ➜ 只放 一份（GR ＝ 每一組；LIST ＝ 那個 年級 有 哪幾組） */
  [[3, G3], [4, G4]].forEach(([g, L]) => L.forEach(x => { const k = x.k.charAt(0) === 's' ? g + x.k : x.k; if (!GR[k]) GR[k] = x; LIST[g].push(k); }));
  const used = JSON.stringify(GR).match(/§i:[^§]+§/g) || []; used.forEach(x => { const k = x.slice(3, -1); ICONUSE[k] = ICON[k]; });
  return { GR, LIST, MINI: { 3: mini(3, G3), 4: mini(4, G4) }, ICON: ICONUSE };
};
