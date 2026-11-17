/* g3mid/_verify_58.js — 第五十八次 第 11 點 量測（成長測驗 400 班 試用 以後）。只 印 失敗 項＋一行 總結。node g3mid/_verify_58.js
 * 不 連 真的 成績 伺服器、不 連 Firebase。
 * ① 錯題 總複習：一張 一張 按 🔊（打斷 上一張）也 會 全部 算 聽完 ➜ 解鎖；正在 唸 的 那 一張 再 按 ＝ 不 重來
 * ② 最 上面 秒懂 步驟 條：現場任務 ＝「👂 聽 錯題 ➜ 👀 看 大螢幕」；聽完 ＝ 第 1 步 ✔、第 2 步 亮
 * ③ 寫字 題 答錯 原因 ~draw／~line／~jbar：伺服器（_calc.js clean）留著、questions() 數 原因；老師看板 ✍️ 字母 書寫 分析（第 1 次 ➜ 第 2 次）
 * ④ 400 班 等人 小遊戲 每題 秒數 ✕ 1.6（其他 班 不 變） */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), ROOT = path.join(__dirname, '..');
const E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
(async () => {
  /* ③ 伺服器 計算 */
  const SC = require('../score/_calc.js');
  const rec = { id: '40001', set: 'g4gm_g3m-g25', qs: [[0, 1, 5, 0, 0, 0, '~line'], [0, 1, 5, 0, 0, 1, '~draw'], [0, -1, 45, 0, 0, 2], [1, 0, 5, 0, .5, 3], [0, 1, 5, 0, 0, 4, '~jbar'], [0, 1, 3, 0, 0, 30, '~hack']], raw: 10, t: Date.now(), u: 'v58' };
  let cl = null; try { cl = SC.clean(rec, Date.now()); } catch (e) { E.push('clean 壞了 ' + e.message); }
  const q = cl && (cl.r || cl).qs;
  if (q) { ok(q[0][6] === '~line' && q[1][6] === '~draw' && q[4][6] === '~jbar', '伺服器 沒 留 寫字 原因 ' + JSON.stringify(q.map(x => x[6])));
    ok(q[5][6] === undefined, '伺服器 留了 奇怪 的 第 7 格');
    const Q = SC.questions([Object.assign({ set: 'g4gm_g3m-g25' }, cl.r || cl)]); const w = Q.find(x => x.i === 0);
    ok(w && w.wy && w.wy.line === 1 && !w.sl, 'questions() 沒 數 寫字 原因'); }
  else E.push('clean 沒有 回傳 qs ' + JSON.stringify(cl).slice(0, 120));
  const br = await chromium.launch();
  for (const vp of [[1024, 768], [768, 1024], [1920, 1080]]) { const tag = vp.join('×');
    const ctx = await br.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: true });
    await ctx.route(/firebaseio\.com|firebasedatabase\.app|script\.google\.com/, r => { E.push('想 連 真的：' + r.request().url().slice(0, 60)); r.abort(); });
    const p = await ctx.newPage(), er = []; p.on('pageerror', e => er.push(e.message));
    await p.goto('file://' + path.join(ROOT, 'g3mid', 'index.html')); await p.waitForTimeout(500);
    /* ① ② 錯題 總複習 */
    const r = await p.evaluate(async () => { window.__WRVFAST = 1; window.WRNX = 'live'; const host = document.createElement('div'); document.body.appendChild(host);
      const it = [0, 1, 2].map(k => ({ head: '第 ' + k, body: '<b>x</b>', zh: '中文', en: d => setTimeout(d, 400) }));
      WREV.run(host, it, '<button id="zz">ok</button>'); const S = WREV._s, sl = ms => new Promise(s => setTimeout(s, ms));
      const g = host.querySelector('.wrnx'), first = g && g.firstElementChild.nextElementSibling.className;
      /* 學生 一張 一張 快 按 喇叭（每 一張 唸 英文 中途 就 按 下一張）*/
      await sl(80); for (let k = 0; k < 3; k++) { host.querySelector('[data-wrp="' + k + '"]').click(); await sl(450); }
      const cur = S.cur; host.querySelector('[data-wrp="' + cur + '"]') && host.querySelector('[data-wrp="' + cur + '"]').click();   /* 正在 唸 的 再 按 */
      for (let t = 0; t < 60 && S.heard.filter(Boolean).length < 3; t++) await sl(100);
      const ns = [...host.querySelectorAll('.wrnx .ns')].map(e => e.className);
      return { first, heard: S.heard.filter(Boolean).length, dis: host.querySelector('#zz').disabled, ns, txt: g && g.innerText, top: host.firstElementChild === g };
    });
    ok(r.first === 'ns now', tag + ' 第 1 步 一開始 沒有 亮 ' + r.first); ok(r.top, tag + ' 步驟 條 不在 最 上面');
    ok(r.heard === 3 && !r.dis, tag + ' 一張 一張 按 喇叭 沒有 全部 算 聽完（' + r.heard + '）');
    ok(r.ns[0] === 'ns ok' && r.ns[1] === 'ns now', tag + ' 聽完 以後 步驟 條 沒 換 ' + r.ns.join('|')); ok(/大螢幕/.test(r.txt) && /不用 按/.test(r.txt), tag + ' 步驟 條 文字 不對');
    /* 步驟 條 不 超出 畫面、字 夠 大 */
    const lay = await p.evaluate(() => { const g = document.querySelector('.wrnx'); g.scrollIntoView(); const R = g.getBoundingClientRect(); return { w: R.right <= innerWidth + 1 && R.left >= -1, fs: Math.min(...[...g.querySelectorAll('.ns')].map(e => parseFloat(getComputedStyle(e).fontSize))) }; });
    ok(lay.w, tag + ' 步驟 條 超出 畫面'); ok(lay.fs >= 22, tag + ' 步驟 條 字 太 小 ' + lay.fs);
    ok(!er.length, tag + ' 錯誤 ' + er.join('|'));
    await ctx.close(); }
  /* ③ 老師看板 ✍️ 分析 */
  const ctx = await br.newContext({ viewport: { width: 1366, height: 900 } }); await ctx.route(/script\.google\.com|firebase/, r => r.abort());
  const p = await ctx.newPage(), er = []; p.on('pageerror', e => er.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'teacher', 'index.html')); await p.waitForTimeout(500);
  const h = await p.evaluate(() => { const t0 = Date.now() - 3600e3, mk = (id, t, okN) => ({ id, set: 'g4gm_g3m-g25', t, qs: Array.from({ length: 15 }, (_, i) => i < okN ? [1, 0, 5, 0, .5, i] : [0, i % 3 ? 1 : -1, 5, 0, 0, i].concat(i % 3 === 1 ? ['~line'] : i % 3 === 2 ? ['~draw'] : [])).concat([[1, 0, 3, 0, .5, 30]]) });
    const RS = [mk('40001', t0, 6), mk('40001', t0 + 1800e3, 12), mk('40002', t0, 9)]; return hwHTML(RS); });
  ok(/1 位 做 了 兩次/.test(h) && /40%<\/b> ➜ <b>80%/.test(h) && /＋40/.test(h), '老師看板 進步 算錯 ' + h.slice(0, 300));
  ok(/📏 沒 碰到 線/.test(h) && /✏️ 字形 寫錯/.test(h) && /⏰ 時間 到/.test(h), '老師看板 沒有 錯 的 原因');
  ok(!er.length, '老師看板 錯誤 ' + er.join('|'));
  await br.close();
  /* ④ 等人 小遊戲 400 班 ✕ 1.6 */
  const mj = fs.readFileSync(path.join(ROOT, 'live', '_mini.js'), 'utf8');
  ok(/\^400\/\.test/.test(mj) && /1\.6:1/.test(mj) && /2600\*SLW\(\)/.test(mj), '400 班 小遊戲 沒有 放慢');
  if (E.length) console.log(E.map(x => '✗ ' + x).join('\n'));
  console.log((E.length ? '❌' : '✅') + ' 第五十八次 成長測驗（錯題 解鎖、步驟 條、寫字 原因、400 班 放慢）：' + n + ' 項，' + E.length + ' 個 失敗');
  process.exit(E.length ? 1 : 0);
})();
