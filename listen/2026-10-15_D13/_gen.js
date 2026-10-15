// 產生 listen/2026-10-15_D13/index.html：第 9 件「錯題分析」—— 全部網站題目和選項的中文一條一條審查（老師 2026-10-15：有問題的先列成大字網頁，老師說 OK 才改）
// 用法：node listen/2026-10-15_D13/_gen.js listen/2026-10-15_D13/index.html ；量測：node listen/2026-10-15_D13/_verify.js listen/2026-10-15_D13/index.html
// 題目從老師看板的題庫讀（teacher/index.html 的 BANK ＝ 網站上真的題目），「現在」那一欄一定是網站上現在的字。
const fs = require('fs'), path = require('path'), ROOT = path.join(__dirname, '..', '..');
const head = fs.readFileSync(path.join(__dirname, '..', '2026-10-12_D6', 'head.html'), 'utf8').replace(/\n<style>\n/, '\n');
const B = JSON.parse(/var BANK=(\{.*?\});\n/s.exec(fs.readFileSync(path.join(ROOT, 'teacher', 'index.html'), 'utf8'))[1]);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const at = (k, i) => { const q = B[k].qs[i - 1]; if (!q) throw new Error('沒有這一題 ' + k + ' #' + i); return Object.assign({ k, i, nm: B[k].name }, q); };
let total = { q: 0, o: 0 }; const cj = s => /[㐀-鿿]/.test(s || '');
Object.keys(B).filter(k => !/job-/.test(k)).forEach(k => B[k].qs.forEach(q => { if (cj(q.q)) total.q++; q.o.forEach(o => { if (cj(o)) total.o++; }); }));
/* 審查結果：每一條 ＝ 在哪裡、現在、建議、為什麼 */
const ISS = [
  { t: '題目沒有說要選什麼（英文？中文？）', why: '只有一句中文，學生不知道要做什麼；同一個網站別的題目都寫「英文是？」', rows: [
    [at('g3gm_g1', 14), '「你的名字是什麼？」英文是？'], [at('g3gm_g1', 15), '「你幾歲？」英文是？'], [at('g3gm_g1', 16), '「我八歲。」英文是？'], [at('g3gm_g1', 17), '「我的名字是 Mike。」英文是？'],
    [at('g3gm_g10', 4), '魔王問：「你的名字是什麼？」英文是？'], [at('g3gm_g10', 5), '魔王問：「你幾歲？」英文是？'], [at('g3gm_g10', 20), '魔王問：「我七歲。」英文是？'],
    [at('g4gm_g10', 20), '魔王問：「他是一位農夫。」英文是？']] },
  { t: '中文不自然', why: '中文不說「你是七歲」，說「你七歲」（四年級網站的複習題也是寫「你十歲。」）', rows: [[at('g3gm_g10', 21), '魔王問：「你七歲。」英文是？']] },
  { t: '題目太短，看不懂在問什麼', why: '「要答？」「單獨是什麼？」「唸起來？」「是哪一個？」句子沒有說完', rows: [
    [at('g3gm_g10', 8), '魔王問：問句用 your（你的），回答要用哪一個？'], [at('g3gm_g10', 9), '魔王問：問句用 you（你），回答要用哪一個？'],
    [at('g3gm_g10', 14), '魔王問：How 一個字的時候，中文是什麼？'], [at('g4gm_g10', 22), '魔王問：Who’s 和 Whose 唸起來怎麼樣？'],
    [at('g4u2_1-1b', 5), '「他是」的英文是哪一個？']] }
];
/* 認讀題（句子）：D18 A 是用一個字（she）舉例；句子要怎麼寫 ➜ 問老師 */
const RD = []; Object.keys(B).forEach(k => B[k].qs.forEach((q, i) => { if (q.k === 'read' && /\s/.test(q.show)) RD.push(at(k, i + 1)); }));
const css = `
.iss{margin:18px 0}.iss h3{font-size:32px;color:#FF9F9F;margin:8px 0}
.row{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:12px;align-items:center;background:#0B0F14;border:3px solid #24303C;border-radius:18px;padding:12px 16px;margin:10px 0}
.row .wh{grid-column:1/-1;font-size:22px;color:#B9C4CE}
.row .now{background:#2A1414;border:3px solid #FF6B6B;border-radius:14px;padding:8px 12px}.row .new{background:#0D1B12;border:3px solid #3BD16F;border-radius:14px;padding:8px 12px}
.row .now small,.row .new small{display:block;font-size:20px;color:#B9C4CE}
.row .ar{font-size:44px;color:#FFD54A}
.row .ops{grid-column:1/-1;font-size:22px;color:#CFE3F5}
@media (max-width:760px){.row{grid-template-columns:1fr}.row .ar{transform:rotate(90deg);text-align:center}}
.ok{background:#102016;border:3px solid #3BD16F;border-radius:20px;padding:14px 20px;margin:16px 0}
.ans{background:#1A1400;border:4px solid #FFD54A;border-radius:20px;padding:14px 20px;margin:30px 0;font-size:28px}
.mini{display:flex;flex-wrap:wrap;gap:8px}.mini span{background:#14202B;border:2px solid #2A3540;border-radius:12px;padding:2px 10px;font-size:22px}
`;
const row = (q, nw, why) => `<div class="row"><div class="wh">📍 ${esc(q.nm)}・第 ${q.i} 題</div><div class="now"><small>現在</small>${esc(q.q.replace(/<[^>]+>/g, ''))}</div><div class="ar">➜</div><div class="new"><small>建議改成</small>${esc(nw)}</div>
<div class="ops">選項：${q.o.map((o, j) => (j ? '' : '✅ ') + esc(o)).join('　／　')}</div></div>`;
let n = 0; ISS.forEach(x => n += x.rows.length);
let h = head.replace('<title>榮譽榜怎麼給</title>', '<title>題目中文審查</title>').replace('</style>', css + '</style></head><body><div class="wrap">');
h += `<h1>❌ 錯題分析：題目和選項的中文審查</h1>
<div class="lead">老師要的：<b>全部網站的題目和選項的中文，一條一條審查</b>，有問題的先列出來，<b>老師說 OK 才改</b>。</div>
<div class="ok">✅ 審查了：三年級、四年級網站的 📝 複習題、🎮 句型遊戲、📘 Review 1（遊戲、📝 複習）＝ <b>題目 ${total.q} 條、選項 ${total.o} 條</b>（有中文的）。<br>
大部分都通順、合乎語法；<b>下面 ${n} 條＋認讀題 ${RD.length} 條</b>要請老師決定。<br>
<span class="small">💼 職業單字（English-Jobs-New）是另一個網站，這次沒有審查。</span></div>`;
ISS.forEach((x, i) => { h += `<h2>${i + 1}. ${x.t}（${x.rows.length} 條）</h2><div class="why">💡 為什麼：${x.why}</div>` + x.rows.map(r => row(r[0], r[1])).join(''); });
h += `<h2>${ISS.length + 1}. 認讀題是「句子」的時候怎麼寫（${RD.length} 條）</h2>
<div class="why">老師 D18 選 A：「「she」哪一個唸的是它？」➜「👀 she　🔊 聽 1～4：哪一個是 she？」。一個字的認讀題已經照 A 改好了（平板題目 ＝「🔊 聽 1～4：哪一個是上面這個字？」）。<br>
<b>句子</b>（例 She’s my mother.）寫「上面這個字」不對，所以先照舊，請老師選：</div>
<div class="q"><div class="t">平板上的題目（上面是 👀 She’s my mother.）</div>
<label class="op rec"><b class="k">A</b>🔊 聽 1～4：哪一個是上面這<b>句話</b>？<span class="tag">建議</span></label>
<label class="op"><b class="k">B</b>照現在：🔊 聽 1～4，哪一個唸的是它？</label></div>
<div class="small">${RD.length} 條在：</div><div class="mini">${RD.map(q => `<span>${esc(q.nm.replace(/｜.*/, ''))} ${esc(q.show)}</span>`).join('')}</div>`;
h += `<h2>${ISS.length + 2}. 老師參考：刻意的，建議不改</h2>
<div class="row"><div class="wh">📍 ${esc(at('g3u2_1-2', 3).nm)}・第 3 題</div><div class="now"><small>現在</small>「你 是 幾歲？」英文的順序是？</div><div class="ar">✋</div>
<div class="new"><small>建議不改</small>這一題在教「are ＝ 是」的語序，中文故意一個字對一個英文字</div></div>`;
h += `<div class="ans">✍️ 請回答：「<b>全部 OK</b>」（第 1～3 段照建議改、第 4 段選 A），或寫「第幾段第幾條 ➜ 不要改／改成什麼」。</div></div></body></html>`;
fs.writeFileSync(process.argv[2], h);
console.log('ok', n, RD.length, total);
