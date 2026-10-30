/* score/_verify_g3c.js — 2026-10-26 第二十七次 第 1 點：老師看板〔🏫 課堂複習〕大表（三年級 複習、課堂複習 1～3 的 10 種 遊戲 平均 正確率）。只印失敗項和一行總結。
 *   node score/_verify_g3c.js
 * 假伺服器：score/_gas_stub.js 跑「真的」score/Code.gs；名單 是 假的（測試NN）；不連真的成績表。三種尺寸。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const { make } = require('./_gas_stub.js'), SC = require('./_calc.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec', PW = 'pw-verify';
let fails = 0, n = 0;
const out = (w, e) => { if (e.length) { fails += e.length; console.log('✗ ' + w); e.forEach(x => console.log('   ' + x)); } };
const NOW = Date.now();
const Q = (ok, all) => Array.from({ length: all }, (_, i) => [i < ok ? 1 : 0, i < ok ? 0 : 1, 3, 0, i < ok ? .5 : 0, i]);
/* 304：01 號 打地鼠 8 題 對 6、02 號 打地鼠 8 題 對 4＋小精靈 中途 離開 3 題 全對；01 號 課堂複習 1 打地鼠 8 題 對 8；307 班 03 號 打地鼠 8 題 對 2（不在 304） */
function seed() { const G = make({ TEACHER_PW: PW });
  for (let s = 1; s <= 30; s++) G.books['名單'].d.push(['304', s, '測試' + String(s).padStart(2, '0')]);
  const rec = (id, set, qs, k) => G.post({ a: 'rec', r: { id, set, name: 'x', m: 'g', qs, raw: 1, src: 'school', dev: 'x', u: 'g3c' + id + k, t: NOW - 6e4 } });
  G.books['角色'].d.push(['30401', JSON.stringify({ tr: 3, trt: [1, 2, 3] }), new Date()], ['30402', JSON.stringify({ tr: 5, trt: [1, 2, 3, 4, 5] }), new Date()]);
  G.post({ a: 'qsub', id: '30401', zh: '我 是 Amy。', o: ["I'm Amy.", "I'm nine.", "You're Amy.", 'My Amy.'] });
  rec('30401', 'g3gm_g3m-q1', Q(6, 8), 'a'); rec('30402', 'g3gm_g3m-q1', Q(4, 8), 'b'); rec('30402', 'g3gm_g3m-q2', Q(3, 3), 'c'); rec('30401', 'g3gm_c1-q1', Q(8, 8), 'd'); rec('30703', 'g3gm_g3m-q1', Q(2, 8), 'e');
  /* 2026-10-29 第 6 件：期中 挑戰：01 號 25 題 對 24（96 分）、02 號 新 25 題 對 20（80 分）*/ rec('30401', 'g3gm_g3m-x25', Q(24, 25), 'f'); rec('30402', 'g3gm_g3m-n25', Q(20, 25), 'g');
  /* 2026-10-30 第三十四次：🏠 25 題 闖關（h25）：01 號 對 20（80 分）、再 一次 對 23（92 分）*/ rec('30401', 'g3gm_g3m-h25', Q(20, 25), 'h'); rec('30401', 'g3gm_g3m-h25', Q(23, 25), 'i');
  return G; }
let HTTP = '';
function serve() { return new Promise(ok => { const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.css': 'text/css' };
  const s = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (er, b) => { if (er) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
  s.listen(0, '127.0.0.1', () => { HTTP = 'http://127.0.0.1:' + s.address().port; ok(s); }); }); }
async function teacher(br, vp) {
  const G = seed(), e = [], big = vp[0] >= 1900 ? 22 : 18;
  const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); }, URL0);
  await ctx.route(/firebasedatabase\.app|firebaseio\.com/, r => r.abort());
  await ctx.route(URL0 + '**', async r => { const q = Object.fromEntries(new URL(r.request().url()).searchParams); const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  const p = await ctx.newPage(); p.on('pageerror', x => e.push('JS 例外：' + x.message));
  await p.goto(HTTP + '/teacher/index.html'); await p.waitForTimeout(300); await p.fill('#pw', PW); await p.click('#go'); await p.waitForTimeout(600);
  await p.click('#tabs button[data-t="g"]'); await p.waitForTimeout(400);
  /* 2026-10-30 第三十四次 第 11 點：先 選 年級 ➜ 三張 大卡（有 新 成績 的 亮）➜ 點 一張 才 出 表 */
  n++; const cr0 = await p.evaluate(() => ({ g: [].map.call(document.querySelectorAll('[data-crg]'), b => b.textContent + (b.classList.contains('on') ? '*' : '')).join(), k: [].map.call(document.querySelectorAll('[data-crk]'), b => b.getAttribute('data-crk') + (b.classList.contains('new') ? '!' : '') + ':' + Math.round(b.getBoundingClientRect().height)).join(), t: document.querySelectorAll('.g3t').length,
    sm: [].filter.call(document.querySelectorAll('.crnav *,.crcards *'), x => [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(x).fontSize) < 18).length }));
  if (!/三年級\*/.test(cr0.g) || !/四年級/.test(cr0.g) || !/^x!:\d+,h!:\d+,g!:\d+$/.test(cr0.k) || cr0.t || cr0.sm || cr0.k.split(',').some(x => +x.split(':')[1] < 100)) e.push('〔課堂複習〕先 選 年級＋三張 大卡（有 新 成績 亮）不對 ' + JSON.stringify(cr0));
  await p.click('[data-crk="g"]'); await p.waitForTimeout(250);
  n++; const cr1 = await p.evaluate(() => [].map.call(document.querySelectorAll('[data-crk]'), b => b.getAttribute('data-crk') + (b.classList.contains('new') ? '!' : '') + (b.classList.contains('on') ? '*' : '')).join());
  if (cr1 !== 'x!,h!,g*') e.push('點 遊戲 卡：那一張 不再 亮、其他 兩張 還 亮 ' + cr1);
  const cellOf = () => p.evaluate(() => { const rows = [].map.call(document.querySelectorAll('.g3t tr'), tr => [].map.call(tr.children, td => td.childNodes[0] ? td.childNodes[0].textContent.trim() : ''));
    const sm = [].filter.call(document.querySelectorAll('#pane *'), x => [].some.call(x.childNodes, c => c.nodeType === 3 && c.textContent.trim()) && x.getBoundingClientRect().width && parseFloat(getComputedStyle(x).fontSize) < 17).map(x => x.textContent.trim().slice(0, 8));
    const lo = [].filter.call(document.querySelectorAll('.g3sw button'), b => b.getBoundingClientRect().height < 48).length;
    return { rows, sm, lo, ox: document.documentElement.scrollWidth - innerWidth, hd: (document.querySelector('.g3t tr') || {}).textContent || '' }; });
  let c = await cellOf(); n++;
  const r1 = c.rows.find(r => r[0] === '01'), r2 = c.rows.find(r => r[0] === '02'), all = c.rows[1];   /* 2026-10-26 第二十九次 第 7-(2)：全班 平均 在 最上面（1 號 正上方）；欄 ＝ 關卡 順序（小精靈 第 10 關 ＝ 第 12 欄） */
  /* 全部：01 號 打地鼠 (6＋8)/16 ＝ 88；02 號 打地鼠 50、小精靈 100、平均 (4＋3)/11 ＝ 64；全班 打地鼠 (6＋8＋4)/24 ＝ 75 */
  if (!r1 || r1[1] !== '測試01' || r1[2] !== '88' || r1[12] !== '88') e.push('01 號 不對 ' + JSON.stringify(r1));
  if (!r2 || r2[2] !== '50' || r2[11] !== '100' || r2[12] !== '64') e.push('02 號 不對（只 算 已作答：中途 離開 3 題）' + JSON.stringify(r2));
  if (!all || !/全班/.test(all[0]) || all[1] !== '75') e.push('全班 平均 不對 ' + JSON.stringify(all));
  if (c.rows[2][0] !== '01') e.push('全班 平均 不在 1 號 正上方');
  if (c.rows.length !== 32) e.push('304 班 不是 30 位 學生（' + (c.rows.length - 2) + '）');
  if (!/打地鼠/.test(c.hd) || !/平均/.test(c.hd)) e.push('表頭 沒有 10 種 遊戲＋平均 ' + c.hd.slice(0, 60));
  if (c.sm.length || c.lo || c.ox > 1) e.push('字 太小／按鈕 太小／左右 捲：' + JSON.stringify({ sm: c.sm.slice(0, 4), lo: c.lo, ox: c.ox }));
  /* 第 7-(1)(3)：第 9 關 夾娃娃、第 10 關 小精靈；底色 59↓ 紅、60～80 黃、81↑ 綠 */
  n++; const cl = await p.evaluate(() => { const th = [].map.call(document.querySelectorAll('.g3t tr:first-child th'), x => x.textContent), tr = [].filter.call(document.querySelectorAll('.g3t tr'), x => x.children[0].textContent.trim() === '02' || x.children[0].textContent.trim() === '01');
      return { t9: th[10], t10: th[11], c1: tr.map(x => x.children[2].className), cAll: document.querySelector('.g3t tr.all').children[1].className }; });
  if (!/第 9 關/.test(cl.t9) || !/夾娃娃/.test(cl.t9) || !/第 10 關/.test(cl.t10) || !/小精靈/.test(cl.t10)) e.push('關卡 順序 不對 ' + JSON.stringify(cl));
  if (cl.c1[0] !== 'p2' || cl.c1[1] !== 'p0' || cl.cAll !== 'p1') e.push('底色 不對（88 綠、50 紅、75 黃）' + JSON.stringify(cl));
  n++; await p.click('[data-crg="4"]'); await p.waitForTimeout(150); await p.click('[data-crk="g"]'); await p.waitForTimeout(200); const mt = await p.evaluate(() => ({ th: document.querySelectorAll('.g3t tr:first-child th').length, last: [].slice.call(document.querySelectorAll('.g3t tr:first-child th')).slice(-2).map(x => x.textContent).join('|'), sw: [].map.call(document.querySelectorAll('[data-g3s]'), b => b.dataset.g3s).join(','), h: document.querySelector('.g3h').textContent, c: [].map.call(document.querySelectorAll('[data-g3c]'), x => x.dataset.g3c).join(',') }));
  if (mt.th !== 15 || !/陷阱/.test(mt.last) || /mt0/.test(mt.sw) || !/12 種/.test(mt.h) || !/402/.test(mt.c) || /304/.test(mt.c)) e.push('〔📝 四年級 複習〕不是 12 種 遊戲（陷阱 偵測器 在 最後、沒有〔四年級 複習 0〕）／四年級 的 班 ' + JSON.stringify(mt));
  n++; const hm = await p.evaluate(() => { const a = document.querySelector('a.thome'); return a ? { h: a.getAttribute('href'), y: a.getBoundingClientRect().height, f: parseFloat(getComputedStyle(a).fontSize) } : null; });
  if (!hm || hm.h !== '../index.html' || hm.y < 48 || hm.f < 18) e.push('沒有〔🏠 回 總首頁〕按鈕 ' + JSON.stringify(hm));
  n++; await p.click('#tabs button[data-t="c"]'); await p.waitForTimeout(300); await p.click('.cbgo.big'); await p.waitForTimeout(3200);
  const cb = await p.evaluate(() => { const o = document.getElementById('cbx'), r = [].slice.call(o.querySelectorAll('.cbr'));
    return { on: o.classList.contains('on'), n: r.length, top: o.querySelectorAll('.cbr.top').length, w: r.map(x => x.querySelector('.cbt i').getBoundingClientRect().width), s: (o.querySelector('.cbs') || {}).textContent || '',
      sm: [].filter.call(o.querySelectorAll('.cbr span,.cbs,.cbnv button'), x => x.getBoundingClientRect().width && parseFloat(getComputedStyle(x).fontSize) < 18).length, oy: o.scrollHeight - o.clientHeight }; });
  if (!cb.on || cb.n !== 3 || cb.top !== 1 || !(cb.w[0] > 0) || !/最好/.test(cb.s) || cb.sm || cb.oy > 4) e.push('班級 排行榜 動畫 頁 ' + JSON.stringify(cb));
  n++; await p.click('[data-cbn="1"]'); await p.waitForTimeout(300); const t2 = await p.textContent('#cbx .cbh'); if (!/2 ／ 7/.test(t2)) e.push('〔下一項 ▶〕沒有 換 ' + t2); await p.click('[data-cbn="x"]');
  n++; await p.click('#tabs button[data-t="r"]').catch(() => {}); await p.waitForTimeout(200);
  await p.click('#tabs button[data-t="g"]'); await p.waitForTimeout(200); await p.click('[data-crg="3"]'); await p.waitForTimeout(150); await p.click('[data-crk="g"]'); await p.waitForTimeout(150); await p.click('[data-g3s="all"]'); await p.waitForTimeout(150);
  n++; await p.click('[data-g3s="g3m"]'); await p.waitForTimeout(200); c = await cellOf(); const a1 = c.rows.find(r => r[0] === '01'); if (!a1 || a1[2] !== '75') e.push('〔三年級 複習〕只 算 g3m：01 號 要 75 ' + JSON.stringify(a1));
  n++; await p.click('[data-g3s="c1"]'); await p.waitForTimeout(200); c = await cellOf(); const b1 = c.rows.find(r => r[0] === '01'), b2 = c.rows.find(r => r[0] === '02'); if (!b1 || b1[2] !== '100' || !b2 || b2[2] !== '—') e.push('〔課堂複習 1〕不對 ' + JSON.stringify([b1, b2]));
  n++; await p.click('[data-g3s="all"]'); await p.click('[data-g3c="307"]'); await p.waitForTimeout(200); c = await cellOf(); const d3 = c.rows.find(r => r[0] === '03'); if (!d3 || d3[2] !== '25') e.push('307 班 03 號 要 25 ' + JSON.stringify(d3));
  /* 2026-10-29 第 6 件：〔📝 三年級 期中 挑戰〕＝ 學生 成績＋錯題 分析＋錯題 排行榜（點 ＝ 詳解＋全班 訂正）*/
  n++; await p.click('[data-crk="x"]'); await p.click('[data-g3c="304"]'); await p.waitForTimeout(250);
  const x3 = await p.evaluate(() => { const rows = [].map.call(document.querySelectorAll('.g3t tr'), tr => [].map.call(tr.children, td => td.childNodes[0] ? td.childNodes[0].textContent.trim() : ''));
    return { r1: rows.find(r => r[0] === '01'), r2: rows.find(r => r[0] === '02'), an: document.querySelectorAll('.xan>div').length, wq: document.querySelectorAll('.wq[data-qx]').length, h: [].map.call(document.querySelectorAll('.xh'), x => x.textContent).join('|'),
      sm: [].filter.call(document.querySelectorAll('#pane .xan *, #pane .xh, #pane .wq b'), x => x.getBoundingClientRect().width && parseFloat(getComputedStyle(x).fontSize) < 17).length, ox: document.documentElement.scrollWidth - innerWidth }; });
  if (!x3.r1 || x3.r1[2] !== '96' || !x3.r2 || x3.r2[4] !== '80' || !x3.an || x3.wq < 5 || !/學生 成績/.test(x3.h) || !/錯題 分析/.test(x3.h) || !/錯題 排行榜/.test(x3.h) || x3.sm || x3.ox > 1) e.push('〔期中 挑戰〕不對 ' + JSON.stringify(x3).slice(0, 300));
  n++; await p.click('.wq[data-qx]'); await p.waitForTimeout(300); const md = await p.evaluate(() => ({ on: document.getElementById('modal').classList.contains('on'), o: document.querySelectorAll('#mbox .opt').length, sh: !!document.getElementById('sh') }));
  if (!md.on || md.o < 2 || !md.sh) e.push('〔期中 挑戰〕錯題 詳解 打不開 ' + JSON.stringify(md));
  await p.click('#mx').catch(() => {}); await p.waitForTimeout(150);
  /* 🏠 25 題 闖關（h25）：01 號 最近 92、最高 92、做 了 2 次；有〔📱 QR〕、〔⬇ 下載 Excel〕*/
  n++; await p.click('[data-crk="h"]'); await p.waitForTimeout(250);
  const h25 = await p.evaluate(() => { const rows = [].map.call(document.querySelectorAll('.g3t tr'), tr => [].map.call(tr.children, td => td.childNodes[0] ? td.childNodes[0].textContent.trim() : '')), r = rows.find(x => x[0] === '01');
    return { r, n: (document.querySelector('.g3t tr:nth-child(2) td:nth-child(4) small') || {}).textContent, qr: (document.querySelector('a.crqr') || {}).getAttribute && document.querySelector('a.crqr').getAttribute('href'), dl: !!document.querySelector('[data-crdl]'), wq: document.querySelectorAll('.wq[data-qx]').length }; });
  if (!h25.r || h25.r[2] !== '92' || h25.r[3] !== '92' || h25.qr !== '../go25/index.html?g=3' || !h25.dl || !h25.wq) e.push('〔🏠 25 題 闖關〕表 不對 ' + JSON.stringify(h25));
  n++; await p.evaluate(() => { window.LASTXLSX = null; }); await p.click('[data-crdl]'); await p.waitForTimeout(400); if (!(await p.evaluate(() => window.LASTXLSX && window.LASTXLSX.length > 200))) e.push('〔⬇ 下載 Excel〕沒有 下載');
  n++; if (SC.cat('g3gm_g3m-q1').k !== 'g3c' || SC.cat('g3gm_c2-q10').k !== 'g3c' || SC.cat('g4gm_mt-m1').k !== 'mt') e.push('類別 不對');
  if (process.env.SHOT) await p.screenshot({ path: path.join(process.env.SHOT, 'g3c_' + vp[0] + '.png'), fullPage: true });
  /* ⚔ 階級 能力（第二十七次）：學生 出 的 題 ➜〔✔ 可以〕存好；小老師、名人堂 有 名字 */
  /* 2026-10-27 第三十二次 第 1 點：〔⚔ 階級 能力〕暫時 拿掉 ➜ 分頁 在 才 量 */
  if (await p.$('#tabs button[data-t="a"]')) {
  await p.click('#tabs button[data-t="a"]'); await p.waitForTimeout(300);
  n++; const a0 = await p.evaluate(() => ({ q: document.querySelectorAll('.qsc [data-qv="1"]').length, t: document.getElementById('pane').textContent, sm: [].filter.call(document.querySelectorAll('.qsc, .abl div'), x => parseFloat(getComputedStyle(x).fontSize) < 20).length }));
  if (a0.q !== 1 || !/我 是 Amy/.test(a0.t) || !/測試02/.test(a0.t) || !/名人堂/.test(a0.t) || a0.sm) e.push('階級 能力 分頁 ' + JSON.stringify(a0).slice(0, 200));
  await p.click('.qsc [data-qv="1"]'); await p.waitForTimeout(500);
  n++; const q1 = await p.evaluate(() => document.getElementById('pane').textContent); if (!/已經 放進 現場任務/.test(q1) || !/存好了/.test(q1)) e.push('〔✔ 可以〕沒有 存好');
  }
  /* 📱 給家長（第二十七次 第 2 點）：一人 一則、有 練 ＝ 天數 次數＋請 稱讚；沒 練 ＝ 請 鼓勵；字 夠大；〔📋 複製〕 */
  await p.click('#tabs button[data-t="m"]'); await p.waitForTimeout(300); await p.click('[data-pmc="304"]'); await p.waitForTimeout(200);
  n++; const pm = await p.evaluate(() => ({ n: document.querySelectorAll('.pmsg').length, t1: (document.getElementById('pm30401') || {}).textContent || '', t5: (document.getElementById('pm30405') || {}).textContent || '',
    sm: [].filter.call(document.querySelectorAll('.pmsg .pt,.pmsg button'), x => parseFloat(getComputedStyle(x).fontSize) < 20).length, ox: document.documentElement.scrollWidth - innerWidth }));
  if (pm.n !== 30 || !/^【英語練習本週週報】測試01本週練了 1 天、做完 \d+ 次/.test(pm.t1) || !/請您稱讚孩子：/.test(pm.t1) || !/測試05本週還沒有/.test(pm.t5) || / [他她]/.test(pm.t1) || pm.sm || pm.ox > 1) e.push('給家長 不對 ' + JSON.stringify(pm).slice(0, 300));
  n++; await p.click('[data-pmid="30401"]'); await p.waitForTimeout(300); if (!/複製 好了/.test(await p.textContent('[data-pmid="30401"]'))) e.push('〔📋 複製〕沒有 反應');
  await ctx.close(); out('老師看板〔🏫 課堂複習〕@' + vp.join('x'), e); }
(async () => { const s = await serve(), br = await chromium.launch();
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) await teacher(br, vp);
  await br.close(); s.close(); console.log((fails ? '✗' : '✓') + ' 課堂複習 大表 量了 ' + n + ' 項，失敗 ' + fails + ' 項'); process.exit(fails ? 1 : 0); })();
