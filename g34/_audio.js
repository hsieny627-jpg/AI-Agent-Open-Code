/* g34/_audio.js — 「縮寫動畫」「比較」會唸到的英文全部做成語音檔（Kokoro v1.0，女聲 af_bella、男生名字的句子多做男聲 am_michael）
 *   TTS_MODELS=<模型資料夾> node g34/_audio.js
 * 收集方法跟兩個句型網站一樣（sentences/_audio_collect.js）。 */
const path = require('path');
const D = require('./_data');
const { pack } = require('../tools/audio_pack');
const T = require('../sentences/_audio_collect').collect(D, null, null, null);
/* 比較卡（cmp）：每一行（例句）照網頁唸的樣子（空格不唸） */
const spoken = tk => { const g = []; tk.forEach(t => { if (t.tight && g.length) g[g.length - 1] += t.en; else g.push(t.en); });
  return g.filter(x => /[A-Za-z]/.test(x.replace(/_+/g, ''))).join(' '); };
const BOY = new RegExp('\\b(' + D.BOYS.join('|') + ')\\b');
D.CMP.filter(c => c.type === 'cmp').forEach(c => c.rows.concat(c.ex || []).forEach(r => {
  const s = spoken(r); T.push(s); if (BOY.test(s)) T.push('m:' + s);
  r.forEach(k => { if (/[A-Za-z]/.test(k.en) && !k.blank) T.push(k.en); });
}));
D.CON.forEach(c => { T.push(spoken(c.a), spoken(c.b)); });
/* 一兩個字單獨唸（It is、They、Who’s）：開頭大寫、加句點唸，語音才自然、聽寫才聽得出來（2026-10-07 量過：
   it is ➜ 聽成 There is、It is. ➜ It is.；They ➜ thy、They. ➜ They；who’s ➜ Hose、Who’s. ➜ Who’s）。
   years old 照三年級的唸法（old 不可以太弱）。鑰匙不變 */
const SPK = { 'years old': 'years !old.' };
const speak = s => SPK[s] || (/^[A-Za-z']+( [A-Za-z']+)?$/.test(s) ? s.charAt(0).toUpperCase() + s.slice(1) + '.' : s);
const r = pack({ texts: T, dir: path.join(__dirname, 'audio'), lang: 'en', varName: 'AUD', speak });
console.log('g34 語音檔：' + r.total + ' 句（這次新做 ' + r.made + ' 句）');
