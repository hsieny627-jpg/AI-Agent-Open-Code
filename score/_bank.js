/* score/_bank.js — 全部題庫（2026-10-18 第十二次 從 score/_build.js 搬出來：老師看板的錯題分析 和 ⚡ 現場任務 用 同一份）
 *   require('./_bank.js') ➜ { 題組代號: { name, qs:[{ q, o（第 0 個 ＝ 正解）, h, ae 正確答案的英文, ag 逐字中文, az 整句翻譯, au 語音檔, al 聽力題的語音檔 }] } }
 *   ⚡ 等人小遊戲（第十二次 老師 6：答對 計入 平時成績）：g年級gm_lm-遊戲（題目 ＝ 那一個 句型遊戲 同一份，第幾題 一樣）➜ LMN */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const SITES = require('./_sites.js').SITES;
/* ⚡ 等人小遊戲 8 種（live/_mini.js 同一份 名稱；用 哪一個 句型遊戲 的 題目） */
const LMN = { g1: '⚡ 閃電 連擊', g10: '👑 魔王 對決', g2: '🎯 二選一 快手', g3: '🧩 句子 拼圖', g4: '🔄 變身術', g7: '🔍 偵探 找錯字', g8: '🧱 填空 衝刺', g9: '🗂 分類 快遞' };
/* 題目裡的 HTML ➜ 純文字（自己畫的圖示 svg ➜〔它的名字〕） */
const txt = h => String(h == null ? '' : h).replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, '〔$1〕').replace(/<br\s*\/?>/g, ' ')
  .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const joinS = a => a.join(' ').replace(/ ([?.,!])/g, '$1').replace(/ ([’']s)/g, '$1');
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const GN = { 3: '三年級', 4: '四年級' };
const BANK = {}, put = (k, v) => { if (BANK[k]) throw new Error('老師看板：題組代號重複 ' + k); BANK[k] = v; };

/* 一個遊戲的一題 ➜ 老師看得懂的題目＋選項（第 0 個 ＝ 正解；沒有四個選項的玩法：[正解, 錯的那一邊]，跟網頁記的「選了第幾個」對得起來） */
function gameQ(ty, c, B, meta) {
  const duo = m => (m && m.duo) || null, M = id => B.GAMES.filter(x => (x.ty || x.id) === id)[0];
  const h = txt(c.h != null ? c.h : (Array.isArray(c) ? c[2] : ''));
  switch (ty) {
    case 'g1': case 'g10': return { q: txt(c.q), o: c.o.map(txt), h };
    case 'g4': return { q: txt(c.f) + '　' + txt(c.d), o: c.o.map(txt), h };
    case 'g5': return { q: '🔊 ' + c.s, o: c.o.map(txt), h, say: c.s };
    case 'g8': return { q: (c.b === '___' ? '' : c.b + ' ') + '＿＿' + (/^[.?!,]/.test(c.a) ? '' : ' ') + c.a + '　' + txt(c.zh), o: c.o.map(txt), h };
    case 'g2': { const d = duo(M('g2')) || [{ v: 'he', t: 'He' }, { v: 'she', t: 'She' }], lab = v => (d.filter(x => x.v === v)[0] || {}).t || v;
      /* 每一個 ___ 都填（句子開頭大寫）；括號裡給學生看的中文提示（例「(爸爸)」）不唸（2026-10-15 第 9 件：原本第二個 ___ 沒有填） */
      const fill = v => /___/.test(c.txt) ? c.txt.replace(/___/g, (m, off, all) => /^\s*$|[.?!]\s*$/.test(all.slice(0, off)) ? cap(lab(v)) : lab(v)) : lab(v);
      const spk = t => t.replace(/\s*[（(][^）)]*[）)]\s*/g, ' ').trim();
      return { q: txt(c.zh) + '　' + c.txt, o: [fill(c.a)].concat(d.filter(x => x.v !== c.a).map(x => fill(x.v))), h, sp: /___/.test(c.txt) ? spk(fill(c.a)) : '' }; }
    case 'g3': return { q: txt(c.zh) + '　排出順序', o: [joinS(c.s), '❌ 順序排錯'], h, sp: joinS(c.s) };
    case 'g7': { const fx = String(c.fix || '').replace(/^改成\s*/, ''), f = c.w.slice(); if (c.b >= 0) f[c.b] = fx;   /* 有的題庫 fix 自己寫了「改成」，不要變成「改成 改成」 */
      return { q: txt(c.zh) + '　' + joinS(c.w) + '（哪裡錯？）', o: [c.b < 0 ? '✅ 這句沒錯' : '錯在 ' + c.w[c.b] + ' ➜ 改成 ' + fx, '❌ 沒找對'], h, sp: /^[A-Z]/.test(fx) && c.w[c.b] === '?' ? fx : joinS(f) }; }
    case 'g9': { const d = B.DUO9 || duo(M('g9')) || [{ v: 'q', t: '❓ 句尾是 ?' }, { v: 's', t: '🙋 句尾是 .' }], lab = v => (d.filter(x => x.v === v)[0] || {}).t || v;
      return { q: '「' + txt(c[0]) + '」', o: [lab(c[1])].concat(d.filter(x => x.v !== c[1]).map(x => lab(x.v))), h, sp: txt(c[3] || c[0]) }; }
  }
  return null;
}
Object.keys(SITES).forEach(dir => {
  const S = SITES[dir], DIR = path.join(ROOT, dir), has = f => fs.existsSync(path.join(DIR, f));
  const gp = S.g ? 'g' + S.g : 'g*', gn = S.g ? GN[S.g] : '';
  /* 📝 複習題：g年級u單元_分頁 */
  if (has('_tq_data.js')) {
    const T = require(path.join(DIR, '_tq_data.js')), D = require(path.join(DIR, '_data.js'));
    Object.keys(T).forEach(uk => {
      const u = +uk.slice(1), TB = D['TABS' + u], nm = {};
      TB.forEach(tb => { if (tb.sub) tb.sub.forEach((x, n) => { nm[tb.n + (n ? 'a' : 'b')] = tb.n + ' ' + tb.lb + '・' + x.lb; }); else nm[tb.n] = tb.n + ' ' + tb.lb; });
      nm.r4 = '縮寫動畫（在家複習）';
      Object.keys(T[uk]).forEach(k => {
        if (!nm[k]) throw new Error('老師看板：' + dir + ' Unit ' + u + ' 的題組 ' + k + ' 沒有名稱');
        put(gp + 'u' + u + '_' + k, { name: gn + ' Unit ' + u + '｜' + nm[k],
          qs: T[uk][k].map(q => ({ k: q.k, q: q.q, show: q.show, say: q.say, sp: q.sp, o: q.o, h: q.h })) });
      });
    });
  }
  /* 🎮 遊戲：g年級＋tag_遊戲（記憶配對沒有題目，只有配對數） */
  if (has('_game_data.js')) {
    const B = require(path.join(DIR, '_game_data.js'));
    const bank = B.BANK || { g1: B.G1, g2: B.G2, g3: B.G3, g4: B.G4, g5: B.G5, g6: B.G6, g7: B.G7, g8: B.G8, g9: B.G9, g10: B.G10 };
    B.GAMES.forEach(m => {
      const ty = m.ty || m.id, sec = B.SEC && m.sec ? txt(B.SEC[m.sec]).split('　')[0] + '・' : '';
      put(gp + S.game + '_' + m.id, { name: (S.g ? gn + ' 句型遊戲' : 'Review 1 遊戲') + '｜' + sec + m.ic + ' ' + m.name, mem: ty === 'g6',
        qs: ty === 'g6' ? [] : bank[m.id].map(c => Object.assign({ k: 'g', kn: m.ic + ' ' + m.name }, gameQ(ty, c, B, m))) });
    });
    if (S.g) Object.keys(LMN).forEach(id => { if (!bank[id]) return; const m = B.GAMES.filter(x => x.id === id)[0];
      put(gp + S.game + '_lm-' + id, { name: gn + ' ⚡ 等人小遊戲｜' + LMN[id], lm: 1, qs: bank[id].map(c => Object.assign({ k: 'g', kn: LMN[id] }, gameQ(id, c, B, m))) }); });
  }
  /* 📘 Review 1 頁的 📝 複習：g年級＋rv tag_rv第幾組 */
  if (S.rv && has('_data.js')) {
    (require(path.join(DIR, '_data.js')).XPAGES || []).filter(P => P.rv).forEach(P => P.rv.forEach((G, i) => {
      put(gp + S.rv + '_rv' + (i + 1), { name: gn + ' ' + P.unit + '｜📝 複習・' + txt(G.t),
        qs: G.q.map(q => ({ k: 'rv', kn: '📝 複習', q: txt(q.q), o: q.o.map(txt), h: txt(q.h) })) });
    }));
  }
});
/* 📝 四年級 期中複習（2026-10-19 第十三次 3(11)）：g4gm_mt-遊戲（midterm/_data.js；o[0] ＝ 正解，跟 網頁 送 的「選了 第幾個」一樣） */
{ const MT = require(path.join(__dirname, '..', 'midterm', '_data.js'));
  MT.GAMES.forEach(g => put('g4gm_mt-' + g.id, { name: '四年級 📝 期中複習｜' + g.ic + ' ' + g.nm, qs: g.B.map(c => ({ k: 'g', kn: '📝 期中複習', q: txt(c.q), o: (c.oz || c.o).map(txt), h: txt(c.z || ''), ae: c.ae || '' })) }));
  /* 2026-10-26 第二十八次：📝 25／50 題 挑戰（g4gm_mt-x25／x50）：題庫 ＝ 12 種 遊戲 的 挑戰 題庫 照 順序 接起來（跟 網頁 的 XOFF 一樣）*/
  [25, 50].forEach(N => put('g4gm_mt-x' + N, { name: '四年級 📝 期中複習｜📝 ' + N + ' 題 挑戰', qs: [].concat(...MT.GAMES.map(g => MT.XB[g.id].map(c => ({ k: 'g', kn: '📝 期中複習', q: txt(g.ic + ' ' + c.q), o: (c.oz || c.o).map(txt), h: txt(c.z || ''), ae: c.ae || '' })))) })); }
/* 🏫 三年級 複習（2026-10-26 第二十七次 第 1-(3) 點：成績 進 老師看板）：g3gm_g3m-遊戲（g3mid/_data.js；o[0] ＝ 正解；寫字題 o ＝ [要寫 的 字母]） */
{ const G3 = require(path.join(__dirname, '..', 'g3mid', '_data.js')), NW = G3.NUMW;
  const SCZ = { thank: '謝謝／不客氣', meet: '很高興認識你', help: '找不到狗／幫忙', come: '過來這裡', morn: '早安' }, CEZ = {}; G3.CE.forEach(c => { CEZ[c.k] = c.zh; });
  const qOf = (id, c) => id === 'q1' ? '🔊 ' + c.say + '：第一個 字母' + (c.up ? '（大寫）' : '') + ' 是？' : id === 'q2' || id === 'q3' || id === 'q10' ? '🔊 ' + c.en : id === 'q4' ? '🔊 ' + c.say + '：寫 第一個 字母（' + (c.want === c.want.toUpperCase() ? '大寫' : '小寫') + '）' :
    id === 'q5' ? (c.lis ? '🔊 聽 字母 ' + c.say + '：寫 ' + (c.want === c.want.toUpperCase() ? '大寫' : '小寫') : '🪞 ' + c.show + '：寫 另一半') : id === 'q6' ? '數一數 ' + c.n + ' 個：拼 英文' : id === 'q7' ? c.s : id === 'q8' ? (c.rev ? '↩ ' + c.b : c.a) : '📋 ' + c.lines.join(' ');
  const oOf = (id, c) => id === 'q2' ? c.o.map(x => x.sc ? SCZ[x.sc] : x.t + ' ' + x.a + ' 歲') : id === 'q3' ? c.o.map(k => CEZ[k] || (/^w:/.test(k) ? k.slice(2) + ' 的 圖' : k)) : id === 'q4' || id === 'q5' ? [c.want, '❌ 寫錯 了'] : id === 'q6' ? [c.want, '❌ 拼錯 了'] : id === 'q9' ? [c.c.map(x => x.t + ' ' + x.a + ' 歲').join('、'), '❌ 放錯 了'] : c.o;   /* 沒有 四個 選項 的 玩法：[正解, 錯的 那一邊]（跟 網頁 記 的「1 ＝ 錯」對得起來） */
  G3.GAMES.forEach(g => put('g3gm_g3m-' + g.id, { name: '🏫 三年級 複習｜' + g.ic + ' ' + g.nm, qs: g.B.map(c => ({ k: 'g', kn: '🏫 三年級 複習', q: txt(qOf(g.id, c)), o: oOf(g.id, c).map(x => txt(String(x))), h: txt(c.zh || ''), ae: c.en || '' })) }));
  /* 2026-10-26 第二十九次 第 1 點：🏫 課堂複習 1、2、3（g3gm_c1-q1…；只在 ⚡ 現場任務 開）*/
  G3.CSETS.forEach(x => G3.GAMES.forEach(g => put('g3gm_' + x[0] + '-' + g.id, { name: '🏫 ' + x[1].replace('三年級 ', '') + '｜' + g.ic + ' ' + g.nm, qs: G3.CB[x[0]][g.id].map(c => ({ k: 'g', kn: '🏫 三年級 複習', q: txt(qOf(g.id, c)), o: oOf(g.id, c).map(y => txt(String(y))), h: txt(c.zh || ''), ae: c.en || '' })) })));
  /* 2026-10-26 第二十八次：📝 25／50 題 挑戰（g3gm_g3m-x25／x50）：題庫 ＝ 10 種 遊戲 的 挑戰 題庫 照 順序 接起來（跟 網頁 的 XALL 一樣）*/
  [25, 50].forEach(N => put('g3gm_g3m-x' + N, { name: '🏫 三年級 複習｜📝 ' + N + ' 題 挑戰', qs: [].concat(...G3.GAMES.map(g => G3.XB[g.id].map(c => ({ k: 'g', kn: '🏫 三年級 複習', q: txt(g.ic + ' ' + qOf(g.id, c)), o: oOf(g.id, c).map(x => txt(String(x))), h: txt(c.zh || ''), ae: c.en || '' })))) })); }
/* 🏰 守城、🎣 釣魚（2026-10-26 第二十九次 第 3 點；在家複習 版）：題目 ＝ fun/_pool.json（fun/_build.js 做 的，第幾題 跟 網頁 一樣）*/
if (fs.existsSync(path.join(__dirname, '..', 'fun', '_pool.json'))) { const FP = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fun', '_pool.json'), 'utf8'));
  [3, 4].forEach(g => [['fun-castle', '🏰 守城 大作戰（在家）'], ['fun-fish', '🎣 英文 釣魚 大賽（在家）']].forEach(x => put('g' + g + 'gm_' + x[0], { name: x[1], qs: (FP[g] || []).map(q => ({ k: 'g', kn: '🎮 遊戲', q: txt(q.q), o: q.o.map(y => txt(String(y))), h: '', ae: q.ae || '', ag: q.ag || [], az: q.az || '', au: q.au || '' })) }))); }
/* 💼 職業單字（English-Jobs-New，2026-10-09 E 使用者第 4 點）：三、四年級共用 ➜ g*gm_job-遊戲；題庫由 score/_jobs_bank.js 從那一頁讀出來 */
if (fs.existsSync(path.join(__dirname, '_jobs_bank.json'))) {
  const JB = JSON.parse(fs.readFileSync(path.join(__dirname, '_jobs_bank.json'), 'utf8'));
  Object.keys(JB).forEach(id => put('g*gm_job-' + id, { name: '💼 職業單字｜' + JB[id].name, qs: JB[id].qs }));
  /* 2026-10-17 第八次（使用者：職業單字網站 全部連到成績系統 ➜ 字卡也要算）：story.html 36 張單字卡，6 張一站（English-Jobs-New/_score_cards.js）；老師〔📌〕〔📅〕派得到 */
  for (let k = 1; k <= 6; k++) put('g*l_job-s' + k, { name: '💼 職業單字｜📇 字卡 第 ' + k + ' 站（第 ' + (k * 6 - 5) + '～' + k * 6 + ' 張）', qs: [], nq: 1 });   /* nq ＝ 沒有題目（聽完字卡） */
}
/* ❌ 錯題分析（2026-10-15 D 第 9 件，第三批 四-3 (2)(3)、四-4）：每一題先算好
 *   ae ＝ 正確答案的英文（唸、放大變亮的那一句）：sp ＞ 認讀題畫面上的英文 ＞ 英文的正解 ＞ 題目裡的英文（正解是中文的時候）
 *   ag ＝ 那一句每一個英文字正下方的中文（sentences/_gloss.js 從那一個網站自己的資料收集，跟學生答錯頁同一份）、az ＝ 整句中文
 *   au ＝ 那一句的語音檔（那一個網站 audio/ 預先錄好的美式語音）；al ＝ 聽力題聽的那一句的語音檔（〔🔊 再聽一次〕）；ao ＝ 認讀題四個選項的語音檔
 *   沒有語音檔的（💼 職業單字在別的網站）用瀏覽器的英文語音 */
const { execFileSync } = require('child_process');
const GLS = {}, AUDS = {};
function glossOf(dir) { if (!GLS[dir]) GLS[dir] = JSON.parse(execFileSync(process.execPath, ['-e', "process.stdout.write(JSON.stringify(require('./sentences/_gloss.js').collect()))"],
  { cwd: ROOT, env: Object.assign({}, process.env, { SITE_DIR: path.join(ROOT, dir) }), maxBuffer: 1 << 26 }).toString()); return GLS[dir]; }
function audOf(dir) { if (!AUDS[dir]) { const f = path.join(ROOT, dir, 'audio', 'aud.js'); AUDS[dir] = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8').replace(/^[\s\S]*?window\.\w*AUD=/, '').replace(/;\s*$/, '')) : {}; } return AUDS[dir]; }
const gKey = t => String(t).replace(/<[^>]+>/g, '').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').replace(/\s+([?.!,])/g, '$1').replace(/\s+'/g, "'").trim().toLowerCase();
const akey = t => String(t).replace(/[’]/g, "'").replace(/[=＝≠➜→⇒…＿_　]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
/* Review 1 的單字（review1/_data.js）：兩、三個字的（potato chips、ice cream）算一格，下面寫整個的中文；
   play ＋ 球類 ＝ 玩（2026-10-11 B 組決定）。其他 Review 1 逐字中文等 B3（這次不碰） */
const R1W = {}; try { require(path.join(ROOT, 'review1', '_data.js')).WORDS.forEach(w => { R1W[gKey(w.en)] = w.zh; }); } catch (e) {}
const BALL = /^(basketball|badminton|soccer|baseball|dodgeball)$/i;
function gUnits(s, GL) { let r = [], re = /[A-Za-zÀ-ÿ]+n[’']t\b|[A-Za-zÀ-ÿ]+|[’'][A-Za-z]+|[?.!,]/g, m;
  while ((m = re.exec(s))) r.push(m[0]);
  for (let i = 0; i < r.length; i++) for (let n = 3; n >= 2; n--) { const ph = r.slice(i, i + n); if (ph.length === n && R1W[gKey(ph.join(' '))]) { r.splice(i, n, ph.join(' ')); break; } }
  for (let i = 0; i + 1 < r.length; i++) { const two = gKey(r[i] + ' ' + r[i + 1]); if (/[a-z]/.test(r[i + 1]) && GL[two] && /^(how old|years old|year old)$/.test(two)) r.splice(i, 2, r[i] + ' ' + r[i + 1]); }
  return r; }
function gZh(t, GL, nx) { const k = gKey(t); if (GL[k] != null && GL[k] !== '') return GL[k]; if (R1W[k]) return R1W[k]; if (k === 'play' && BALL.test(nx || '')) return '玩'; if (GL[k] != null) return GL[k]; if (/^[a-z]+n't$/.test(k) && GL[k.replace(/n't$/, '')]) return GL[k.replace(/n't$/, '')] + ' 不'; return ''; }
const isEn = a => /[A-Za-z]/.test(a) && !/[㐀-鿿]/.test(a);
function ansEn(q) {
  if (typeof q.sp === 'string') return isEn(q.sp) || !q.sp ? q.sp : ((q.sp.match(/[A-Za-z][A-Za-z’' ,]*[A-Za-z.?!]/g) || []).sort((x, y) => y.length - x.length)[0] || '');
  if (q.k === 'read') return q.show;
  const a = txt(q.o[0]); if (isEn(a)) return a.replace(/^[^A-Za-z’']+/, '');
  const Q = txt(q.q), m = Q.match(/[「“"]([^」”"]*[A-Za-z][^」”"]*)[」”"]/); if (m && isEn(m[1])) return m[1];
  const L = (Q.match(/[A-Za-z][A-Za-z’' ,]*[A-Za-z.?!]/g) || []).filter(x => /[A-Za-z]{2,}/.test(x)).sort((x, y) => y.length - x.length);
  return L[0] || '';
}
const SITEOF = k => /^g3/.test(k) ? 'G3 - L1 + L2' : /^g4/.test(k) ? 'sentences' : /^g\*r1_/.test(k) ? 'review1' : 'sentences';
/* 一題 ➜ 加上 ae（正確答案的英文）、ag（逐字中文）、az（整句翻譯）、au（語音檔）、al（聽力題）；⚡ 現場任務（live/_build.js）也用這一個 */
function enrich(dir, q) {
  const G = glossOf(dir), A = audOf(dir), au = t => { const x = t && A[akey(t)]; return x ? '../' + dir + '/audio/' + x[0] : ''; };
    const e = ansEn(q); if (e) { q.ae = e; q.ag = gUnits(e, G.GL).map((t, i, a) => [t, /^[?.!,]$/.test(t) ? '' : gZh(t, G.GL, a[i + 1])]);
      const qz = txt(q.q).replace(/〔[^〕]*〕/g, '').replace(/[^\u3400-\u9fff]/g, '');   /* 題目只有中文（例「🩺 醫生」）＝ 那個字的中文 */
      q.az = G.TR[gKey(e)] || (isEn(txt(q.o[0])) ? (!/[A-Za-z]/.test(txt(q.q)) && qz ? qz : '') : txt(q.o[0]));
      /* 一個字、一個詞（沒有句點、問號）：每一個字都查不到中文 ＝ 整個詞一格，下面寫整個的中文 */
      if (q.az && !/[.?!]/.test(e) && q.ag.every(x => !x[1])) q.ag = [[e, q.az]];
      q.au = au(e); }
    const L = q.say || (q.k === 'read' ? q.show : ''); if (q.say) q.al = au(q.say);
    if (q.k === 'read') q.ao = q.o.map(au);
  return q;
}
Object.keys(BANK).forEach(k => { const dir = SITEOF(k); BANK[k].qs.forEach(q => enrich(dir, q)); });
/* 🏫 三年級 複習（第二十七次）：錯題 分析 的 英文、逐字 中文、整句、語音 ＝ g3mid 自己 的（跟 學生 答錯頁 同一份） */
{ const G3 = require(path.join(ROOT, 'g3mid', '_data.js')), A3 = audOf('g3mid'), W3 = (() => { const f = path.join(ROOT, 'g3mid', 'audio', 'w', 'aud.js'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8').replace(/^[\s\S]*?window\.\w*=/, '').replace(/;\s*$/, '')) : {}; })();
  const tk = e => { const r = [], re = /([A-Za-z][A-Za-z\-]*)(’|')(s|m|re)\b|[A-Za-z][A-Za-z\-’']*|\d+|[.,?!]/g; let m; while ((m = re.exec(e))) { if (m[2]) r.push(m[1], "'" + m[3]); else r.push(m[0]); } return r; };
  const zh = w => { const k = w.replace(/’/g, "'").toLowerCase(); return G3.GL[k] !== undefined ? G3.GL[k] : /^[.,?!]$/.test(w) ? '' : /^[A-Z][a-z]+$/.test(w) ? '（名字）' : ''; };
  const XC = [].concat(...G3.GAMES.map(g => G3.XB[g.id]));
  G3.GAMES.map(g => ['g3m-' + g.id, g.B]).concat([['g3m-x25', XC], ['g3m-x50', XC]]).concat([].concat(...G3.CSETS.map(x => G3.GAMES.map(g => [x[0] + '-' + g.id, G3.CB[x[0]][g.id]])))).forEach(([id, B]) => (BANK['g3gm_' + id] || { qs: [] }).qs.forEach((q, i) => { const c = B[i], e = String(c.en || ''); if (!e) return;
    q.ae = e; q.ag = tk(e).map(t => [t.replace(/'/g, '’'), zh(t)]); q.az = c.zh || ''; const say = typeof c.say === 'string' ? c.say : e, k3 = A3[akey(say)] ? akey(say) : A3['m:' + akey(say)] ? 'm:' + akey(say) : '', f = k3 ? A3[k3] : W3[akey(say)];
    q.au = f ? '../g3mid/audio/' + (k3 ? '' : 'w/') + f[0] : ''; })); }
/* 代號一定要是 _calc.js 認得的（以後新的教材登記錯了 build 就失敗） */
const SC = require('./_calc.js');
Object.keys(BANK).forEach(k => { if (!SC.cat(k.replace('g*', 'g3')).k) throw new Error('老師看板：題組代號 ' + k + ' 不合規則（score/_calc.js 的 SETRE）'); });
module.exports = BANK;
/* 工具（不可以 變成 題組：不可以 列舉） */
['LMN', 'enrich', 'gameQ', 'txt'].forEach((k, i) => Object.defineProperty(BANK, k, { value: [LMN, enrich, gameQ, txt][i], enumerable: false }));
