/* sentences/_audio_collect.js — 句型網站（三年級 G3、四年級 sentences）會唸到的英文，全部收集起來交給 tools/audio_pack.js
 *
 * 兩個網站共用（2026-10-03 使用者指定：四年級也改成預錄語音檔、問句和答句聽得出是不同人）。
 * 收：每一張卡（原本的 U1／U2、上方分頁的每一組卡片、Review 1）整句、每一個字、每一個替換字換進去以後的整句；
 *     一問一答、他問他答、情境小劇場：問句和答句分兩種聲音（qaV：答句說女生名字 ➜ 問句男聲、答句女聲；其他 ➜ 問句女聲、答句男聲），
 *     男聲的文字前面加 'm:'；複習題、暖身題、遊戲會唸的句子（照 _build_games.js 組句子的方法）。
 */
const FEM = /\b(Emma|Wendy|Amy|Mia)\b/;
const qaV = ans => FEM.test(String(ans)) ? ['m', ''] : ['', 'm'];
const V = (v, s) => (v ? v + ':' : '') + s;

function collect(D, Q, G, TQ) {
  const T = [];
  /* 有中文的（遊戲選項「主詞和 is」這種）不做成英文語音檔：Kokoro 會跳過中文，唸出來不完整 */
  const add = s => { if (s && /[A-Za-z]/.test(String(s).replace(/^m:/, '')) && !/[\u3400-\u9fff]/.test(String(s))) T.push(String(s)); };
  /* 2026-10-09 使用者：最後一張卡再按 ➡ 的「完成 All done!」頁（sentences/_tq.js tqFin）會唸 All done! */
  if (TQ) add('All done!');
  const CON = /^['’](s|m|re)$/;
  /* ifSlot（2026-10-10）：藏著的字（my）要等那一個 slot 換了字才唸 */
  const vis = tk => tk.filter(t => !(t.ifSlot && !t.on));
  const plain = tk => vis(tk).map(t => t.tight ? t.en : ' ' + t.en).join('').trim();
  const words = tk => tk.forEach((t, i) => add(CON.test(t.en) && i ? tk[i - 1].en + "'" + t.en.slice(1) : (t.say || t.en)));
  const spk = s => String(s).replace(/[➜…]/g, ' ');
  /* 一個替換位置（slot）可以換成哪些字（含 Review 1 的物品／活動切換） */
  const choices = k => {
    const S = D.SUB[k]; if (!S) return [];
    const more = S.sets ? [].concat(...S.sets.slice(1).map(x => [].concat(...x.rows.map(r => r[1])))) : [];
    return S.basic.concat(S.adv).concat(more);
  };
  /* 一串 token 的每一種樣子：原本的、每一個 slot 換成每一個字的（一次只換一個 slot） */
  const variants = tk => {
    const out = [tk];
    const ks = [...new Set(tk.filter(t => t.slot).map(t => t.slot))];
    ks.forEach(k => choices(k).forEach(w => out.push(tk.map(t => t.slot === k ? Object.assign({}, t, { en: w[0], blank: 0 }) : t.ifSlot === k ? Object.assign({}, t, { on: 1 }) : t))));
    return out;
  };
  const list = (tk, v) => {
    if (!tk) return;
    words(tk);
    /* 男生名字的句子（不是一問一答）另外做一份男聲（2026-10-04 使用者指定：I am Alan／Ken／Mike ＝ 男聲） */
    variants(tk).forEach(x => { add(V(v, plain(x))); if (BOY && !v && BOY.test(plain(x))) add(V('m', plain(x))); });
    /* 有空格的卡（My name is ______.）網頁上唸的是「My name is」（空格和後面黏著的句點不唸）：照網頁的唸法也做一份（2026-10-04 量到原本用瀏覽器語音） */
    if (tk.some(t => t.blank)) add(V(v, spoken(tk)));
    tk.filter(t => t.slot).forEach(t => choices(t.slot).forEach(w => add(w[0])));
  };
  const BOY = D.BOYS ? new RegExp('\\b(' + D.BOYS.join('|') + ')\\b') : null;
  /* 網頁上真的唸出來的樣子：空格（______）和黏在空格後面的句點、問號不唸 */
  const spoken = tk => { const g = []; vis(tk).forEach(t => { if (t.tight && g.length) g[g.length - 1] += t.en; else g.push(t.en); });
    return g.filter(x => /[A-Za-z]/.test(x.replace(/_+/g, ''))).join(' '); };
  const cards = [];
  const seen = new Set();
  const take = c => { if (c && !seen.has(c)) { seen.add(c); cards.push(c); } };
  (D.U1 || []).concat(D.U2 || []).forEach(take);
  [D.TABS1, D.TABS2].forEach(TB => (TB || []).forEach(tb => (tb.cards || []).concat(...(tb.sub || []).map(x => x.cards)).forEach(take)));
  (D.XPAGES || []).forEach(P => (P.cards || []).forEach(take));
  cards.forEach(c => {
    ['tk', 'a', 'b', 'c', 'st', 'qu'].forEach(k => list(c[k]));
    if (c.type === 'pair') {
      variants(c.atk).forEach(a => { const vv = qaV(plain(a)); add(V(vv[1], plain(a))); if (a.some(t => t.blank)) add(V(vv[1], spoken(a))); });
      /* 問句的聲音跟著「這一張的答句」：答句可能被換成女生名字 */
      const vs = new Set(variants(c.atk).map(a => qaV(plain(a))[0]));
      variants(c.qtk).forEach(q => vs.forEach(v => add(V(v, plain(q)))));
      words(c.qtk); words(c.atk);
      add(plain(c.qtk) + ' ' + plain(c.atk));
    }
    if (c.type === 'morph') { add(c.say); add(plain(c.a)); }
    if (c.type === 'focus') { c.rows.forEach(r => add(spk(r[0]))); add(c.rows.map(r => spk(r[0])).join(' ')); add(c.rows.map(r => spk(r[0])).join(', ')); }
    if (c.type === 'echo') c.rows.forEach(r => { const vv = qaV(r.a); add(V(vv[0], r.q)); add(V(vv[1], r.a)); add(r.q); add(r.a); r.q.split(' ').concat(r.a.split(' ')).forEach(add); });
    if (c.type === 'order') { add(c.say); c.enRow.forEach((x, n) => add(CON.test(x[0]) && n ? c.enRow[n - 1][0] + "'" + x[0].slice(1) : x[0])); }
    const s = c.scene;
    if (s) { const vv = s.b2 ? qaV(s.b2) : ['', '']; if (!s.bzh) { add(s.b); add(V(vv[0], s.b)); } if (s.b2) { add(s.b2); add(V(vv[1], s.b2)); } }
  });
  /* 複習題：答錯頁會唸正確答案 */
  (D.RV1 || []).concat(D.RV2 || []).forEach(g => g.q.forEach(q => add(q.o[0])));
  (D.XPAGES || []).forEach(P => (P.rv || []).forEach(g => g.q.forEach(q => add(q.o[0]))));
  /* 📝 複習題 5 題（2026-10-04 對話 B，_tq_data.js）：聽力題唸的句子、認讀題的四個 🔊 選項、答錯頁唸的正解（sp）。
     錯的英文不唸：認讀題的選項全部是正確的英文；看中文選英文、易錯的錯句只寫在畫面上，不做語音檔。
     男生名字（Ken、Alan、Mike）的句子用男聲（引擎 say(…,{v:boyV(t)})） */
  if (TQ) Object.keys(TQ).forEach(u => Object.keys(TQ[u]).forEach(k => TQ[u][k].forEach(q => {
    const both = s => { add(s); if (BOY && BOY.test(s)) add(V('m', s)); };
    if (q.say) both(q.say);
    if (q.k === 'read') q.o.forEach(both);
    if (q.k === 'en2zh') { const m = /「([^」]*[A-Za-z][^」]*)」/.exec(q.q); if (m) both(m[1]); }
    const sp = q.sp != null ? q.sp : (/[A-Za-z]{2}/.test(q.o[0]) && !/[\u3400-\u9fff]/.test(q.o[0]) ? q.o[0] : '');
    if (sp) both(sp.replace(/➜/g, ' '));
  })));
  /* 暖身題：聽力題的句子、正確答案 */
  if (Q) Q.Q.forEach(q => { add(q.say); add(q.o[q.a != null ? q.a : 0]); });
  /* 遊戲：照 _build_games.js 組句子的方法 */
  if (G) {
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    const fillBl = (txt, w) => String(txt).replace(/___/g, (m, off, all) => {
      const pre = all.slice(0, off); return (/^\s*$/.test(pre) || /[.?!]\s*$/.test(pre)) ? cap(w) : w; });
    const joinS = a => a.join(' ').replace(/ ([?.,!])/g, '$1').replace(/ (['’]s)/g, '$1');
    const f8 = (c, w) => ((c.b === '___' ? '' : c.b + ' ') + w + ' ' + c.a).replace(/ ([?.,])/g, '$1').replace(/ (['’](s|m|re)\b)/g, '$1');
    (G.G1 || []).concat(G.G10 || []).forEach(c => c.o.forEach(add));
    (G.G2 || []).forEach(c => { if (c.txt && /___/.test(c.txt)) { add(fillBl(c.txt, c.a)); add(fillBl(c.txt, c.a === 'I' ? 'my' : 'I')); } });
    add('He'); add('She');
    (G.G3 || []).forEach(c => { c.s.forEach(add); add(joinS(c.s)); });
    (G.G4 || []).forEach(c => { add(c.f); c.o.forEach(add); });
    (G.G5 || []).forEach(c => { add(c.s); c.o.forEach(add); });
    (G.G6 || []).forEach(p => add(p[0]));
    (G.G7 || []).forEach(c => { add(joinS(c.w)); if (c.b >= 0) { const w = c.w.slice(); w[c.b] = c.fix; add(joinS(w)); } });
    (G.G8 || []).forEach(c => c.o.forEach(o => add(f8(c, o))));
    (G.G9 || []).forEach(c => add(c[0]));
  }
  return T;
}
module.exports = { collect, qaV };
