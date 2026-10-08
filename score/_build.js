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
      const fill = v => /___/.test(c.txt) ? c.txt.replace(/^___/, cap(lab(v))).replace(/___/, lab(v)) : lab(v);
      return { q: txt(c.zh) + '　' + c.txt, o: [fill(c.a)].concat(d.filter(x => x.v !== c.a).map(x => fill(x.v))), h, sp: /___/.test(c.txt) ? fill(c.a) : '' }; }
    case 'g3': return { q: txt(c.zh) + '　排出順序', o: [joinS(c.s), '❌ 順序排錯'], h, sp: joinS(c.s) };
    case 'g7': { const f = c.w.slice(); if (c.b >= 0) f[c.b] = c.fix;
      return { q: txt(c.zh) + '　' + joinS(c.w) + '（哪裡錯？）', o: [c.b < 0 ? '✅ 這句沒錯' : '錯在 ' + c.w[c.b] + ' ➜ 改成 ' + c.fix, '❌ 沒找對'], h, sp: joinS(f) }; }
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
/* 代號一定要是 _calc.js 認得的（以後新的教材登記錯了 build 就失敗） */
const SC = require('./_calc.js');
Object.keys(BANK).forEach(k => { if (!SC.cat(k.replace('g*', 'g3')).k) throw new Error('老師看板：題組代號 ' + k + ' 不合規則（score/_calc.js 的 SETRE）'); });
fs.mkdirSync(path.join(ROOT, 'teacher'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'teacher', 'index.html'), require('./_teacher.js')(CALC, XL, BANK));
/* 部署步驟的大字秒懂網頁（使用者 2026-10-07：說明看不懂、視力不佳） */
fs.writeFileSync(path.join(__dirname, 'deploy.html'), require('./_deploy_page.js')(fs.readFileSync(path.join(__dirname, 'Code.gs'), 'utf8')));
module.exports = BANK;
console.log('score ok  Code.gs、teacher/index.html、score/deploy.html（題組 ' + Object.keys(BANK).length + ' 組）');
