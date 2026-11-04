/* 2026-11-04 第四十三次 量測：中途 離開 ➜〔▶ 繼續〕從 每一關 的 第 2 題 開始，題目 一定 出得來（家長 截圖：三年級 第 7 關 擂台 第 2 題 卡住）。
   三年級、四年級 25 題 闖關（home.html）；假 的 成績 伺服器、不連 Firebase。只 印 失敗 項。node g3mid/_verify_43.js */
const { chromium } = require('playwright'), path = require('path');
const ROOT = path.join(__dirname, '..'), E = []; let n = 0;
(async () => {
  const br = await chromium.launch();
  for (const site of ['g3mid', 'midterm']) for (const vp of [[1024, 768], [820, 1180]]) {
    const tag = site + ' ' + vp.join('×'), id = site === 'g3mid' ? '30401' : '40201';
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] } });
    await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.route(/script\.test/, r => r.fulfill({ contentType: 'application/json', body: '{"ok":true,"dup":[]}' }));
    await ctx.addInitScript(id => { Object.defineProperty(window, 'SCORE_URL', { get: () => 'https://script.test/exec', set: () => {} }); Object.assign(window, { __NOUNLOCK: 1, __NODFXI: 1, __NOSNH: 1, __NOGO: 1, __NORVA: 1, __NOWB: 1, __NOTUT: 1, __DCLK: .05 });
      HTMLMediaElement.prototype.play = function () { const a = this; setTimeout(() => a.onended && a.onended(), 40); return Promise.resolve(); };
      localStorage.setItem('score_last', '"' + id + '"'); localStorage.setItem('score_id_g' + id[0], '"' + id + '"'); localStorage.setItem('score_act', String(Date.now())); sessionStorage.setItem('sc_ok', id); localStorage.setItem('g3m_war', '"b01"'); }, id);
    const p = await ctx.newPage(); let errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, site, 'home.html')); await p.waitForTimeout(900);
    await p.evaluate(() => document.querySelectorAll('.scfull').forEach(x => x.remove()));
    await p.click('#hmgo', { force: true }); await p.waitForTimeout(500);
    await p.evaluate(() => { try { decClose(); } catch (e) {} });
    const lv = await p.evaluate(() => { const L = LVS || GM, o = []; L.forEach((g, i) => { const f = R.lvOf.indexOf(i); if (f >= 0 && R.lvOf[f + 1] === i) o.push([i, g.id, f]); }); return o; });
    for (const [i, gid, f] of lv) {
      errs = []; n++;
      const r = await p.evaluate(async ([i, f]) => {
        if (typeof QID !== 'undefined') QID++; try { stopSay(); } catch (e) {} R.Q = []; for (let j = 0; j <= f; j++) R.Q.push([j % 2, 0, 3, 0, .5, 0]);
        if (R.qs) { R.res = R.qs.map((q, j) => j <= f ? (j % 2) : undefined); R.k = f; } else { R.k = f + 1; }
        xSave(); const bk = R.bk, x = R.x;
        if (typeof HP8 !== 'undefined') HP8 = { e: 7, m: 7 };   /* 網頁 剛 打開 的 樣子 */
        R = null; XBK = bk; resumeX(x);
        await new Promise(s => setTimeout(s, 1600));
        const st = document.getElementById('stage') || document.querySelector('#stg,#st'), t1 = (document.getElementById('tsec') || {}).textContent;
        await new Promise(s => setTimeout(s, 1200));
        const t2 = (document.getElementById('tsec') || {}).textContent, G0 = (LVS || GM)[i];
        const dcl = document.getElementById('dcl'), dcOn = !!(dcl && dcl.classList.contains('on') && dcl.querySelectorAll('button').length);
        return { dcOn, k: R.k, lv: R.lv, want: i, kids: st ? st.children.length : -1, btn: st ? st.querySelectorAll('button').length : -1, t1, t2, mv8: document.querySelectorAll('.mv8').length, how: (document.getElementById('how') || {}).textContent, ghow: G0.how };
      }, [i, f]);
      const bad = gid === 'dc' ? (!r.dcOn || r.lv !== i) : r.lv !== i || r.k !== f + 1 || r.kids < 1 || (r.t1 === r.t2 && r.t1 != null) || (gid === 'q8' && (r.mv8 < 2 || r.how === r.ghow));
      if (bad || errs.length) E.push(tag + ' 第 ' + (i + 1) + ' 關（' + gid + '）從 第 2 題 繼續：題目 沒 出來 ' + JSON.stringify(r) + ' ' + errs.slice(0, 2).join(' | '));
    }
    await ctx.close();
  }
  /* 小精靈 迷宮：👻 ➜ 🐝（老師 不 喜歡 👻）*/
  for (const f of ['index.html', 'home.html', 't25.html']) { n++; const h = require('fs').readFileSync(path.join(__dirname, f), 'utf8');
    if (/gst','👻|class="gh">👻|👻 碰到|👻 被抓到/.test(h) || !/gst','🐝/.test(h)) E.push('g3mid/' + f + ' 小精靈 迷宮 還有 👻（要 換成 🐝）'); }
  await br.close();
  E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 中途 離開 再 繼續（第四十三次）：' + n + ' 項，' + E.length + ' 個失敗'); process.exit(E.length ? 1 : 0);
})();
