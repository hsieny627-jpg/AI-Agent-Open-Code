/* score/_build.js — 成績紀錄（2026-10-07 對話 C）：產生兩個檔
 *   score/Code.gs        老師整份複製、貼進 Google Apps Script（＝ score/_calc.js ＋ score/_server.js）
 *   teacher/index.html   老師看板（＝ score/_teacher.js 樣板 ＋ _calc.js ＋ _xlsx.js ＋ 全部題庫）
 *   node score/_build.js
 *
 * 題庫（錯題分析要看題目和選項）2026-10-08 對話 D 起自動收：score/_sites.js 登記的每一個資料夾裡
 *   _tq_data.js（📝 複習題）、_game_data.js（遊戲）、_data.js 的 XPAGES[].rv（Review 1 頁的 📝 複習）。
 *   題組代號跟網頁送出來的一樣；三、四年級共用的（Review 1 遊戲）存成 g*r1_…，看板兩個年級都查得到。
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const SITES = require('./_sites.js').SITES;
const strip = f => fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/\nif \(typeof module !== 'undefined'\) module\.exports = \w+;\s*$/, '\n');
const CALC = strip('_calc.js'), XL = strip('_xlsx.js');
fs.writeFileSync(path.join(__dirname, 'Code.gs'),
  '/* 成績紀錄（英文句型網站：📝 複習題、遊戲、Review 1）— Google Apps Script\n' +
  ' * 本檔由 score/_build.js 產生（_calc.js ＋ _server.js），不要手改；要改就改那兩個檔再跑 node score/_build.js。\n' +
  ' * 部署步驟：score/deploy.html（大字版）。密碼放在「專案設定 ➜ 指令碼屬性」的 TEACHER_PW，不要寫在這裡。 */\n\n' +
  CALC + '\n' + fs.readFileSync(path.join(__dirname, '_server.js'), 'utf8'));

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
    case 'g9': { const d = B.DUO9 || duo(M('g9')) || [{ v: 'q', t: '❓ 問句' }, { v: 's', t: '🙋 直述句' }], lab = v => (d.filter(x => x.v === v)[0] || {}).t || v;
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
  }
  /* 📘 Review 1 頁的 📝 複習：g年級＋rv tag_rv第幾組 */
  if (S.rv && has('_data.js')) {
    (require(path.join(DIR, '_data.js')).XPAGES || []).filter(P => P.rv).forEach(P => P.rv.forEach((G, i) => {
      put(gp + S.rv + '_rv' + (i + 1), { name: gn + ' ' + P.unit + '｜📝 複習・' + txt(G.t),
        qs: G.q.map(q => ({ k: 'rv', kn: '📝 複習', q: txt(q.q), o: q.o.map(txt), h: txt(q.h) })) });
    }));
  }
});
/* 💼 職業單字（English-Jobs-New，2026-10-09 E 使用者第 4 點）：三、四年級共用 ➜ g*gm_job-遊戲；題庫由 score/_jobs_bank.js 從那一頁讀出來 */
if (fs.existsSync(path.join(__dirname, '_jobs_bank.json'))) {
  const JB = JSON.parse(fs.readFileSync(path.join(__dirname, '_jobs_bank.json'), 'utf8'));
  Object.keys(JB).forEach(id => put('g*gm_job-' + id, { name: '💼 職業單字｜' + JB[id].name, qs: JB[id].qs }));
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
Object.keys(BANK).forEach(k => {
  const dir = SITEOF(k), G = glossOf(dir), A = audOf(dir), au = t => { const x = t && A[akey(t)]; return x ? '../' + dir + '/audio/' + x[0] : ''; };
  BANK[k].qs.forEach(q => {
    const e = ansEn(q); if (e) { q.ae = e; q.ag = gUnits(e, G.GL).map((t, i, a) => [t, /^[?.!,]$/.test(t) ? '' : gZh(t, G.GL, a[i + 1])]);
      const qz = txt(q.q).replace(/〔[^〕]*〕/g, '').replace(/[^\u3400-\u9fff]/g, '');   /* 題目只有中文（例「🩺 醫生」）＝ 那個字的中文 */
      q.az = G.TR[gKey(e)] || (isEn(txt(q.o[0])) ? (!/[A-Za-z]/.test(txt(q.q)) && qz ? qz : '') : txt(q.o[0]));
      /* 一個字、一個詞（沒有句點、問號）：每一個字都查不到中文 ＝ 整個詞一格，下面寫整個的中文 */
      if (q.az && !/[.?!]/.test(e) && q.ag.every(x => !x[1])) q.ag = [[e, q.az]];
      q.au = au(e); }
    const L = q.say || (q.k === 'read' ? q.show : ''); if (q.say) q.al = au(q.say);
    if (q.k === 'read') q.ao = q.o.map(au);
  });
});
/* 代號一定要是 _calc.js 認得的（以後新的教材登記錯了 build 就失敗） */
const SC = require('./_calc.js');
Object.keys(BANK).forEach(k => { if (!SC.cat(k.replace('g*', 'g3')).k) throw new Error('老師看板：題組代號 ' + k + ' 不合規則（score/_calc.js 的 SETRE）'); });
fs.mkdirSync(path.join(ROOT, 'teacher'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'teacher', 'index.html'), require('./_teacher.js')(CALC, XL, BANK));
/* 部署步驟的大字秒懂網頁（使用者 2026-10-07：說明看不懂、視力不佳） */
fs.writeFileSync(path.join(__dirname, 'deploy.html'), require('./_deploy_page.js')(fs.readFileSync(path.join(__dirname, 'Code.gs'), 'utf8')));
fs.writeFileSync(path.join(__dirname, 'update.html'), require('./_deploy_page.js')(fs.readFileSync(path.join(__dirname, 'Code.gs'), 'utf8'), 'update'));   /* 2026-10-09 程式更新＋貼名單 */
module.exports = BANK;
console.log('score ok  Code.gs、teacher/index.html、score/deploy.html、update.html（題組 ' + Object.keys(BANK).length + ' 組）');
