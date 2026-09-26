/* sentences/_gloss.js — 答錯頁／火眼金睛頁要的「逐字中文」和「整句翻譯」（使用者 2026-09-26 指定）
 *
 * 使用者：正確答案的每一個英文單字正下方，呈現該單字的繁體中文意思；再加整句的中文翻譯。
 *   What 什麼　's 是　your 你的　name 名字　➜ 你的 名字 是 什麼？
 *
 * 不另外手打一份字典：全部從這個網站自己的資料自動收集（改了資料，字典自己跟著改）——
 *   GL（一個字 ➜ 中文）：字卡上每一個 token 的 en／zh、替換字 SUB
 *   TR（一整句 ➜ 中文）：句型卡的 zh、一問一答的 qzh／azh（連替換字換進去的每一句）、
 *                         遊戲題庫的 zh（他還是她、語序、火眼金睛、填空、記憶配對）
 * 資料裡沒有的少數幾個字，寫在下面的 BASE。
 * 名字不翻譯（G3 使用者 2026-09-25 指定）：Ken 的中文就是 Ken。
 */
const SITE = require('./_site');
const fs = require('fs');

/* 資料裡沒有、但題目選項會出現的字（使用者 2026-09-26：How ＝ 如何） */
const BASE = {
  'how':'如何', 'how old':'幾歲', 'years old':'歲', 'year old':'歲', 'year':'年', 'years':'年', 'old':'老的',
  'i':'我', 'my':'我的', 'you':'你', 'your':'你的', 'he':'他', 'she':'她', 'his':'他的', 'her':'她的', 'him':'他',
  'is':'是', 'am':'是', 'are':'是', "'s":'是', "'m":'是', "'re":'是', 'not':'不', "isn't":'不是', "n't":'不',
  'what':'什麼', 'who':'誰', 'where':'哪裡', 'when':'什麼時候', 'why':'為什麼', 'whose':'誰的',
  'name':'名字', 'a':'一位', 'an':'一個', 'yes':'是的', 'no':'不', 'and':'和', 'but':'但是',
  'this':'這', 'my name':'我的 名字', 'like':'喜歡', 'likes':'喜歡', 'to':'去', 'can':'會',
  'hi':'嗨', 'it':'它', "it's":'它是', 'book':'書', 'gh':'（不發音）', 'many':'多少', 'the':'這個', 'one':'一', 'me':'我', 'hello':'哈囉', 'about':'關於', 'family':'家人', 'was':'是（過去）', 'has':'有', 'have':'有', 'do':'做', 'does':'做'
};

function key(s) {
  return String(s).replace(/<[^>]+>/g, '').replace(/[’‘]/g, "'").replace(/\s+/g, ' ')
    .replace(/\s+([?.!,])/g, '$1').replace(/\s+'/g, "'").trim().toLowerCase();
}
function plain(tk) {
  return tk.map((t, i) => (i && !t.tight ? ' ' : '') + t.en).join('').replace(/[’]/g, "'");
}

function collect() {
  const GL = Object.assign({}, BASE), TR = {};
  const addW = (en, zh) => { if (!en || !zh || /[?.!,]/.test(en)) return; const k = key(en);
    if (/_{2,}/.test(zh)) return; GL[k] = String(zh).replace(/<[^>]+>/g, ''); };
  const addS = (en, zh) => { if (!en || !zh || !/[A-Za-z]/.test(en) || /_{2,}|＿/.test(en + zh)) return;
    TR[key(en)] = String(zh).replace(/<[^>]+>/g, '').trim(); };
  let D = {}, G = {};
  try { D = SITE.load('_data.js'); } catch (e) {}
  try { G = SITE.load('_game_data.js'); } catch (e) {}
  const SUB = D.SUB || {};
  /* 1. token */
  const walk = o => { if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (typeof o.en === 'string' && typeof o.zh === 'string') addW(o.en, o.zh);
    for (const k in o) if (o[k] && typeof o[k] === 'object') walk(o[k]); };
  walk(D.U1); walk(D.U2);
  for (const s in SUB) ['basic', 'adv'].forEach(b => (SUB[s][b] || []).forEach(w => addW(w[0], w[1])));
  /* 2. 句子：句型卡、一問一答（替換字全部換進去） */
  const sentOf = (tk, zh) => {
    if (!tk || !zh) return;
    addS(plain(tk), zh);
    tk.forEach((t, i) => { if (!t.slot || !SUB[t.slot]) return;
      ['basic', 'adv'].forEach(b => (SUB[t.slot][b] || []).forEach(w => {
        const tk2 = tk.slice(); tk2[i] = Object.assign({}, t, { en: w[0] });
        if (zh.indexOf(t.zh) >= 0) addS(plain(tk2), zh.replace(t.zh, w[1]));
      })); });
  };
  [].concat(D.U1 || [], D.U2 || []).forEach(c => {
    if (c.type === 'sent') sentOf(c.tk, c.zh);
    if (c.type === 'pair') { sentOf(c.qtk, c.qzh); sentOf(c.atk, c.azh); }
    if (c.type === 'echo') (c.rows || []).forEach(r => { addS(r.q, r.qzh); });
  });
  /* 3. 遊戲題庫 */
  const J = a => a.join(' ').replace(/ ([?.,!])/g, '$1').replace(/ (['’]s|['’]m|['’]re)/g, '$1');
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const fill = (txt, w) => String(txt).replace(/___/g, (m, off, all) => {
    const pre = all.slice(0, off); return (/^\s*$/.test(pre) || /[.?!]\s*$/.test(pre)) ? cap(w) : w; });
  (G.G2 || []).forEach(c => { if (!/___/.test(c.txt)) return; addS(fill(c.txt, c.a), c.zh); });
  (G.G3 || []).forEach(c => addS(J(c.s), c.zh));
  (G.G6 || []).forEach(c => addS(c[0], c[1]));
  (G.G7 || []).forEach(c => { const w = c.w.slice(); if (c.b >= 0) w[c.b] = c.fix; addS(J(w), c.zh); });
  (G.G8 || []).forEach(c => addS((c.b + ' ' + c.o[0] + ' ' + c.a).replace(/ ([?.,])/g, '$1').replace(/ '/g, "'"), c.zh));
  if (D.TRX) for (const k in D.TRX) addS(k, D.TRX[k]);
  if (D.GLX) for (const k in D.GLX) addW(k, D.GLX[k]);
  return { GL, TR };
}

let CACHE = null;
function JS() {
  if (!CACHE) { const c = collect(); CACHE = 'var GL=' + JSON.stringify(c.GL) + ',TR=' + JSON.stringify(c.TR) + ';'; }
  return CACHE;
}
module.exports = { JS, collect, key };
