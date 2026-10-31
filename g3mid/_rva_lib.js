/* g3mid/_rva_lib.js — 🎬 秒懂 複習 動畫 的 資料 工具（build 的 時候 用；三、四年級 共用）
 * mk(GL, PH, BAN, EXAM)(ANI) ➜ { list: [{id, ic, nm, sc, qz}], say: [語音 句子], err: [] }
 *   GL ＝ 這個 網站 的 字 ➜ 中文；PH ＝ 片語（How old ＝ 幾歲、years old ＝ 歲…，先 比 長 的）；
 *   英文 句子 自動 切 成 一個 字 一個 字（’s ’m ’re 分開，正下方 ＝ 是），每個 字 都 要 查得到 中文（名字 ＝「（名字）」），查不到 ＝ build 失敗。
 *   BAN ＝ 考卷 的 名字；EXAM ＝ 考卷 的 原句（一模一樣 ＝ build 失敗：秒懂 動畫 可以 教 考卷 的 重點，但是 要 換 句子、換 形式）。
 * 一部 動畫：{ id, ic, nm, sc: [頁], qz: [突擊 測驗] }
 *   頁 ＝ { h 這一頁 的 重點（中文 短）, pic 圖, big 大字（字母）, en 英文, en2 等句 的 第二行, z 整句 中文, n 💡 一句, v 'm' 男聲 }
 *   測驗 ＝ { at 第幾頁（0 起）以後 才 可以 考, ty mc|hear|tf|dec|ord|spot, q 題目（英文）, o [正解, 錯…], s 聽 的 句子, ok（tf）, w 字（ord、spot）, bad 錯 的 是 第幾個（spot）,
 *            x 多 的 錯 方塊（dec 中文、ord 英文）, en 正確 的 整句（答對／答錯 頁 唸 這一句）, z 整句 中文, why 💡 為什麼, v }
 */
function mk(GL, PH, BAN, EXAM) {
  const err = [], say = new Set();
  const norm = s => String(s).replace(/[’]/g, "'");
  const keyOf = w => norm(w).toLowerCase().replace(/[.,?!]+$/, '');
  const SPLIT = /^([A-Za-z]+)('s|'m|'re)$/;   /* What's ➜ What ＋ 's；isn't、can't、Let's、don't 不 拆 */
  const KEEP = new Set(["let's"]);
  function zh(w) { const k = keyOf(w); if (GL[k] !== undefined) return GL[k]; if (/^[A-Z][a-z]+$/.test(w.replace(/[.,?!]+$/, ''))) return '（名字）'; if (/^\d+$/.test(k)) return k; return null; }
  function toks(en, where) {
    const W = norm(en).split(/\s+/).filter(Boolean), out = [];
    for (let i = 0; i < W.length; i++) {
      let hit = null;
      for (let L = 4; L >= 2; L--) { if (i + L > W.length) continue; const ph = W.slice(i, i + L).map(keyOf).join(' '); if (PH[ph] !== undefined) { hit = [W.slice(i, i + L).join(' '), PH[ph], L]; break; } }
      if (hit) { out.push([hit[0], hit[1]]); i += hit[2] - 1; continue; }
      const w = W[i], m = SPLIT.exec(w.replace(/[.,?!]+$/, '')), pu = (w.match(/[.,?!]+$/) || [''])[0];
      if (m && !KEEP.has(keyOf(w))) { const a = zh(m[1]); if (a == null) err.push(where + '：查不到 中文「' + m[1] + '」'); out.push([m[1], a || '']); out.push([m[2] + pu, GL[m[2]] != null ? GL[m[2]] : '是']); continue; }
      const z = zh(w); if (z == null) err.push(where + '：查不到 中文「' + w + '」'); out.push([w, z || '']);
    }
    return out.map(([a, b]) => [a.replace(/'/g, '’'), b]);
  }
  const chkBan = (s, where) => { if (BAN && BAN.test(s)) err.push(where + '：用了 考卷 的 名字 ' + s.match(BAN)[0]); if (EXAM && EXAM.has(norm(s).toLowerCase().replace(/\s+/g, ' ').trim())) err.push(where + '：跟 考卷 的 句子 一模一樣：' + s); };
  const sayAdd = (t, v) => { if (t) say.add((v === 'm' ? 'm:' : '') + norm(t).replace(/'/g, '’')); };
  return function (ANI) {
    const list = ANI.map(a => {
      const W = a.nm;
      const sc = a.sc.map((c, i) => { const w = W + ' 第 ' + (i + 1) + ' 頁'; chkBan(c.en, w); if (c.en2) chkBan(c.en2, w);
        if (!c.z || !c.h) err.push(w + '：少 z 或 h');
        sayAdd(c.en, c.v); if (c.en2) sayAdd(c.en2, c.v2 != null ? c.v2 : c.v);
        return Object.assign({}, c, { en: norm(c.en).replace(/'/g, '’'), en2: c.en2 ? norm(c.en2).replace(/'/g, '’') : undefined, t: c.tk || toks(c.en, w), t2: c.en2 ? (c.tk2 || toks(c.en2, w)) : undefined }); });
      const qz = a.qz.map((q, i) => { const w = W + ' 測驗 ' + (i + 1);
        if (!q.en || !q.z) err.push(w + '：少 en 或 z');
        if (q.at == null || q.at >= sc.length) err.push(w + '：at 不對');
        [q.q, q.s, q.en].concat(q.o || [], q.w || [], q.x && q.ty === 'ord' ? q.x : []).forEach(s => s && chkBan(String(s), w));
        if ((q.ty === 'mc' || q.ty === 'hear') && (!q.o || q.o.length < 3 || new Set(q.o).size !== q.o.length)) err.push(w + '：四選一 選項 不夠 或 重複');
        if (q.ty === 'hear' && !q.s) err.push(w + '：聽 的 句子 s'); if (q.s) sayAdd(q.s, q.v);
        if (q.ty === 'spot' && (q.bad == null || !q.fix)) err.push(w + '：spot 要 bad、fix');
        if (q.ty === 'ord' && !q.w) err.push(w + '：ord 要 w');
        if (q.ty === 'tf' && typeof q.ok !== 'boolean') err.push(w + '：tf 要 ok');
        if (/[一-鿿]/.test((q.q || '') + (q.o || []).join('') + (q.w || []).join(''))) err.push(w + '：題目、選項 一律 全 英文（🔒 永久 原則 1）');
        sayAdd(q.en, q.v);
        const r = Object.assign({}, q, { a: { en: norm(q.en).replace(/'/g, '’'), v: q.v, z: q.z, why: q.why || '', t: q.atk || toks(q.en, w) } });
        if (q.ty === 'dec') { r.t = q.tk || toks(q.en, w); if (q.x && q.x.some(x => r.t.some(p => p[1] === x))) err.push(w + '：錯 方塊 跟 答案 一樣'); }
        if (q.o) r.o = q.o.map(x => norm(x).replace(/'/g, '’')); if (q.w) r.w = q.w.map(x => norm(x).replace(/'/g, '’')); if (q.q) r.q = norm(q.q).replace(/'/g, '’');
        return r; });
      if (qz.length < 8) err.push(W + '：突擊 測驗 題庫 不到 8 題（每 一次 3 題，看 三次 都 不一樣）');
      const ty = new Set(qz.map(q => q.ty)); if (ty.size < 4) err.push(W + '：題型 不到 4 種（要 多元）');
      return { id: a.id, ic: a.ic, nm: a.nm, sc, qz }; });
    return { list, say: [...say], err };
  };
}
module.exports = { mk };
