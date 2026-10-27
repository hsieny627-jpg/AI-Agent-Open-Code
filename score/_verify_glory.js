/* score/_verify_glory.js — 第三十二次 第 7 點：冠軍寶箱／全班獎勵 頒獎（GLORY）一定 演到 第 1 名、頒獎台（只印 失敗項 和 一行 總結）
 *   node score/_verify_glory.js
 * 電腦 慢（CPU 慢 6 倍）也 要 自己 演完；一幕 出錯 也 要 接 下一幕；10 種 風格 每一種 都 演到 最後 */
const path = require('path'), { chromium } = require('/opt/node22/lib/node_modules/playwright');
const E = []; let n = 0;
(async () => { const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } }), p = await ctx.newPage();
  await p.route(/^https?:/, r => r.abort());
  await p.goto('file://' + path.join(__dirname, '..', 'teacher/index.html')); await p.waitForTimeout(800);
  const run = (s, fast, bad) => p.evaluate(([s, fast, bad]) => { const W = i => '<b>30' + i + '</b>';
    HN = { i: 0, tm: null, key: 'rw', st: HON.pick('t'), gst: s, cert: [] };
    HN.gd = { kick: '三年級', aw: '👑 冠軍寶箱', per: '上週', ic: '👑', title: '冠軍寶箱 頒獎典禮', rows: [{ rk: 4, w: W(4), v: 'x' }, { rk: 5, w: W(5), v: 'y' }], top: { 1: [{ rk: 1, w: W(1), v: 'a' }], 2: [{ rk: 2, w: W(2), v: 'b' }], 3: [{ rk: 3, w: W(3), v: 'c' }] }, lab: null };
    HN.P = fast ? [0, 1, 2, 3, 4, 5].map(g => ({ g, t: 700 })) : [{ g: 0, t: 5600 }, { g: 1, t: 5900 }, { g: 2, t: 6800 }, { g: 3, t: 7400 }, { g: 4, t: 11500 }, { g: 5, t: 9000 }];
    if (bad) { const o = GLORY.scene; GLORY.scene = function (el, st, g) { if (g === 3) { GLORY.scene = o; throw new Error('x'); } return o.apply(this, arguments); }; }
    HSND = 0; document.getElementById('honov').classList.add('on'); hShow(); }, [s, fast, bad]);
  const wait = async ms => { const t0 = Date.now(); while (Date.now() - t0 < ms) { await p.waitForTimeout(1000); if (await p.evaluate(() => HN && HN.i === 5)) return true; } return false; };
  for (let s = 0; s < 10; s++) { await run(s, 1, 0); n++; if (!(await wait(12000))) E.push('風格 ' + s + ' 沒有 演到 頒獎台'); }
  await run(0, 1, 1); n++; if (!(await wait(12000))) E.push('第 2 名 那一幕 出錯 以後 停住了');
  const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  await p.evaluate(() => GLORY.lite(0)); await run(4, 0, 0); n += 2;
  if (!(await wait(90000))) E.push('電腦 慢 6 倍：沒有 演到 頒獎台（第 1 名）');
  if (!(await p.evaluate(() => GLORY.lite()))) E.push('電腦 慢：沒有 換成 輕量 模式');
  await b.close();
  E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '✗' : '✓') + ' 頒獎 一定 演完 量了 ' + n + ' 項，失敗 ' + E.length + ' 項'); process.exit(E.length ? 1 : 0); })();
