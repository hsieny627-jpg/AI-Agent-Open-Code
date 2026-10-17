/* score/_verify_report.js — 📅 練習報告（2026-10-17 第八次）自己量：10 種排法 ✕ 10 種新愛心 ✕ 三種螢幕（iPad 橫、iPad 直、教室觸控螢幕 1920✕1080）
 *   node score/_verify_report.js        只印失敗項和一行總結
 * 量：五行都出來、蓋章、最後兩行；數字跟 care() 一樣（小華 30412、什麼都沒做、全部做到）；字 ≧ 20px（觸控螢幕 ≧ 24px）；不超出框、不超出螢幕；
 *     10 種排法洗牌輪流、跟上一次不一樣；切換按鈕 12 顆 ≧ 48px；按〔❤ 原本的 愛心〕＝ 五顆愛心；10 種新愛心每一種：總分數到對、五格、最少的那一格金框、畫不超出 */
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SC = require('./_calc.js');
const R = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#000;color:#fff;font-family:"PingFang TC","Microsoft JhengHei",sans-serif;font-weight:700;padding:12px}${R('_honor.css')}${R('_report.css')}</style></head><body><div id="b"></div><script>${R('_honor_rt.js')}${R('_report_rt.js')}</script></body></html>`;
const OUT = path.join(require('os').tmpdir(), 'rpt_verify.html'); fs.writeFileSync(OUT, html);
const CASES = [
  ['小華 30412', SC.care({ days: 4, count: 7, q: 40, fastQ: 1, W: 5, F: 4, sec: 34 * 60 })],
  ['什麼都沒做', SC.care({})],
  ['全部做到', SC.care({ days: 5, count: 9, q: 30, fastQ: 0, W: 0, F: 0, sec: 4000 })]];
(async () => {
  const br = await chromium.launch(), E = []; let n = 0;
  for (const vp of [[1024, 768], [820, 1180], [1920, 1080]]) {
    const p = await br.newPage({ viewport: { width: vp[0], height: vp[1] } }), tag = vp.join('✕');
    p.on('pageerror', x => E.push(tag + ' JS 錯誤：' + x.message));
    await p.goto('file://' + OUT); await p.emulateMedia({ reducedMotion: 'reduce' });
    const MIN = vp[0] >= 1900 ? 24 : 20;
    for (const [cn, c] of CASES) for (let L = 0; L < 10; L++) {
      const r = await p.evaluate(([c, L]) => new Promise(ok => { const b = document.getElementById('b'); b.innerHTML = '<div id="x"></div>'; const x = b.firstChild; RPT.report(x, c, { lay: L }); setTimeout(() => {
        const W = x.getBoundingClientRect(), rows = [].slice.call(x.querySelectorAll('.rpr'));
        const txt = rows.map(r => r.querySelector('.rpx').textContent + '｜' + r.querySelector('.rpst').textContent);
                const fs = Math.min.apply(null, [].map.call(x.querySelectorAll('.rph,.rpx,.rpst,.rps div'), y => parseFloat(getComputedStyle(y).fontSize)));
        const out = [].filter.call(x.querySelectorAll('.rpr *,.rps *'), y => { const q = y.getBoundingClientRect(); return q.width && (q.right > W.right + 1 || q.left < W.left - 1); }).map(y => y.className && y.className.baseVal == null ? y.className : y.tagName).slice(0, 3);
        const ov = [].filter.call(x.querySelectorAll('.rpx,.rpst'), y => { const pr = y.closest('.rpr').getBoundingClientRect(), q = y.getBoundingClientRect(); return q.right > pr.right + 1 || q.bottom > pr.bottom + 1; }).length;
        ok({ lay: x.className, on: rows.filter(r => r.classList.contains('on') && r.classList.contains('st')).length, s: (x.querySelector('.rps.on') || {}).textContent || '', txt, fs, out, ov, ws: document.documentElement.scrollWidth > innerWidth + 1, wk: x.querySelectorAll('.rpr.wk').length, best: x.querySelectorAll('.rpr.best').length }); }, 60); }), [c, L]);
      await p.waitForTimeout(30);
      const id = tag + ' ' + cn + ' 排法 ' + (L + 1);
      if (r.on !== 5) E.push(id + '：五行沒有全部出來蓋章（' + r.on + '）');
      if (!/⭐ 你最棒：/.test(r.s) || !/(🎯 下一步：|🎉 五項 都做到了)/.test(r.s)) E.push(id + '：最後兩行不對：' + r.s);
      if (r.fs < MIN) E.push(id + '：字太小 ' + r.fs + 'px');
      if (r.out.length || r.ov) E.push(id + '：有東西超出框 ' + r.out.join('、') + ' ' + r.ov);
      if (r.ws) E.push(id + '：整頁可以左右捲');
      const raw = c.raw, want = [String(raw.days), String(raw.count)];
      if (r.txt[0].indexOf('練了 ' + want[0] + ' 天') < 0 || r.txt[1].indexOf('做完 ' + want[1] + ' 次') < 0) E.push(id + '：天數、次數跟 care() 不一樣：' + r.txt.slice(0, 2).join('／'));
      const okN = c.it.filter(v => v >= 20).length, stOk = r.txt.filter(t => /✅ 做到了/.test(t)).length;
      if (okN !== stOk) E.push(id + '：蓋 ✅ 的數目（' + stOk + '）跟做到的項目（' + okN + '）不一樣');
      if (c.tot === 100 ? r.wk : r.wk !== 1) E.push(id + '：最少的那一項要框起來（' + r.wk + '）');
      n += 7;
    }
    /* 10 種排法輪流 */
    const q = await p.evaluate(() => { localStorage.removeItem('rpt_vl'); const a = [], b = document.getElementById('b'); for (let i = 0; i < 21; i++) { b.innerHTML = '<div></div>'; a.push(RPT.report(b.firstChild, { it: [0, 0, 0, 0, 0], tot: 0, raw: {} }, { key: 'vl' })); } return a; });
    if (new Set(q.slice(0, 10)).size !== 10 || q.some((x, i) => i && x === q[i - 1])) E.push(tag + '：10 種排法沒有輪流、或連續兩次一樣（' + q.join(',') + '）');
    /* 整塊＋切換按鈕 */
    const c = CASES[0][1];
    await p.evaluate(c => { const b = document.getElementById('b'); b.innerHTML = '<div id="x"></div>'; RPT.show(b.firstChild, c, { key: 'v' }); }, c);
    const bt = await p.evaluate(() => [].map.call(document.querySelectorAll('.rpsw button'), b => { const r = b.getBoundingClientRect(); return { t: b.textContent, h: r.height, f: parseFloat(getComputedStyle(b).fontSize), out: r.right > innerWidth + 1 }; }));
    if (bt.length !== 12) E.push(tag + '：切換按鈕不是 12 顆（' + bt.length + '）');
    bt.forEach(b => { if (b.h < 48 || b.f < 18 || b.out) E.push(tag + '：按鈕〔' + b.t + '〕太小或超出 ' + Math.round(b.h) + 'px／' + b.f + 'px'); });
    if (!await p.$('.rpstage .rpw')) E.push(tag + '：一打開不是 📋 練習報告');
    await p.click('.rpsw [data-v="h"]'); await p.waitForTimeout(400);
    const hh = await p.evaluate(() => { const c = document.querySelector('.rpstage .care'); return c ? { h: c.querySelectorAll('.chc').length, on: c.querySelectorAll('.chc.on').length, hb: !!c.querySelector('.chb') } : null; });
    if (!hh || hh.h !== 5 || hh.on !== 5 || !hh.hb) E.push(tag + '：〔❤ 原本的 愛心〕沒有五顆愛心或沒有〔📖 說明〕' + JSON.stringify(hh));
    for (let v = 0; v < 10; v++) {
      await p.click('.rpsw [data-v="' + v + '"]'); await p.waitForTimeout(500);
      const h = await p.evaluate(v => { const x = document.querySelector('.rpstage .hv'), W = x.getBoundingClientRect(), a = x.querySelector('.hvart'), A = a.getBoundingClientRect();
        const art = a.firstElementChild.getBoundingClientRect();
        return { cls: x.className, n: x.querySelector('.cn').textContent, lg: x.querySelectorAll('.lg').length, wk: x.querySelectorAll('.lg.wk').length, on: document.querySelector('.rpsw [data-v="' + v + '"]').classList.contains('on'),
          fs: Math.min.apply(null, [].map.call(x.querySelectorAll('.hvt,.hvhow,.lgn,.lg b,.hvtip'), y => parseFloat(getComputedStyle(y).fontSize))),
          out: art.right > W.right + 1 || art.left < W.left - 1 || art.height < 120, legOut: [].filter.call(x.querySelectorAll('.lg'), y => y.getBoundingClientRect().right > W.right + 1).length,
          other: !!document.querySelector('.rpstage .rpw,.rpstage .care') };
      }, v);
      const id = tag + ' 愛心 ' + (v + 1) + ' ' + RPT_NAME(v);
      if (h.cls.indexOf('hv' + (v + 1)) < 0 || !h.on || h.other) E.push(id + '：按了沒有換過去');
      if (+h.n !== c.tot) E.push(id + '：總分 ' + h.n + ' ≠ ' + c.tot);
      if (h.lg !== 5 || h.wk !== 1) E.push(id + '：下面五格不對（' + h.lg + '、最少 ' + h.wk + '）');
      if (h.fs < 17) E.push(id + '：字太小 ' + h.fs + 'px');
      if (h.out || h.legOut) E.push(id + '：畫或五格超出框、或畫太小');
      n += 4;
    }
    await p.click('.rpsw [data-v="r"]'); await p.waitForTimeout(200);
    if (!await p.$('.rpstage .rpw')) E.push(tag + '：按〔📋 練習 報告〕回不去');
    n += 6; await p.close();
  }
  await br.close();
  E.forEach(x => console.log('✗ ' + x));
  console.log('練習報告 量測 ' + n + ' 項，' + E.length + ' 個失敗');
  process.exit(E.length ? 1 : 0);
})();
function RPT_NAME(v) { return ['拼圖大愛心', '100 格愛心', '愛心電池', '愛心燈串', '愛心氣球', '畫一顆愛心', '愛心花園', '愛心寶石皇冠', '愛心樹', '愛心煙火'][v]; }
