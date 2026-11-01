/* 2026-11-01 第三十八次 ① 量測：🏠 25 題 闖關 11/5（四）00:00 下架＋老師 專用 t25.html。只 印 失敗 項。不連 網路、不送 成績。node g3mid/_verify_c25.js */
const { chromium } = require('playwright'), path = require('path'), ROOT = path.join(__dirname, '..'), E = []; let n = 0;
const END = require('../score/_c25.js').END;
(async () => {
  const br = await chromium.launch();
  const open = async (file, t, tok) => { const ctx = await br.newContext({ viewport: { width: 1024, height: 768 } }); await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.addInitScript(([t, tok]) => { window.__C25NOW = t; if (tok) localStorage.setItem('t25ok', String(Date.now() + 864e5)); }, [t, tok]);
    const p = await ctx.newPage(); await p.goto('file://' + path.join(ROOT, file)); await p.waitForTimeout(700); return [p, ctx]; };
  const before = END - 60000, after = END + 1000;
  for (const [site, g] of [['g3mid', 3], ['midterm', 4]]) {
    let [p, c] = await open(site + '/home.html', before); n++; if (/closed/.test(p.url())) E.push(site + ' 截止 前 home.html 不可以 下架'); 
    n++; if (!/11 月 4 日 週三 晚上 11:59 前/.test(await p.content())) E.push(site + ' 截止 前 沒有 大字 期限'); await c.close();
    [p, c] = await open(site + '/home.html', after); n++; if (!/go25\/closed\.html\?g=/.test(p.url()) || !/英語複習任務 已經 結束/.test(await p.textContent('body'))) E.push(site + ' 11/5 00:00 以後 home.html 沒有 下架：' + p.url()); await c.close();
    [p, c] = await open(site + '/t25.html', after, 0); n++; if (!/closed\.html\?t=1/.test(p.url())) E.push(site + ' 沒 登入過 老師看板 也 打得開 t25.html'); await c.close();
    [p, c] = await open(site + '/t25.html', after, 1); n++; if (/closed/.test(p.url()) || !(await p.evaluate(() => window.T25 && window.HOME25))) E.push(site + ' 老師 打不開 t25.html'); 
    n++; if (!/老師 專用/.test(await p.evaluate(() => document.body.innerText))) { await p.evaluate(() => { try { hmCover() } catch (e) {} }); if (!/老師 專用/.test(await p.evaluate(() => document.body.innerText))) E.push(site + ' t25 封面 沒有「老師 專用」'); } await c.close();
  }
  for (const rv of ['g3-review', 'g4-review']) {
    let [p, c] = await open(rv + '/index.html', before); n++; let v = await p.evaluate(() => [getComputedStyle(document.getElementById('go25')).display, document.getElementById('due25').innerText]);
    if (v[0] === 'none' || !/11 月 4 日 週三 晚上 11:59 前/.test(v[1]) || !/請優先完成這一個任務！/.test(await p.textContent('#go25'))) E.push(rv + ' 截止 前 大按鈕／期限 不對'); await c.close();
    [p, c] = await open(rv + '/index.html', after); n++; v = await p.evaluate(() => [getComputedStyle(document.getElementById('go25')).display, getComputedStyle(document.getElementById('due25')).display]);
    if (v[0] !== 'none' || v[1] !== 'none') E.push(rv + ' 11/5 以後 按鈕 還 看得到'); await c.close();
  }
  let [p, c] = await open('go25/index.html', after); n++; if (!/closed\.html/.test(p.url())) E.push('go25 11/5 以後 學生 還 看得到 QR'); await c.close();
  [p, c] = await open('go25/index.html', after, 1); n++; if (!/t25\.html/.test(await p.content()) || /home\.html/.test(await p.evaluate(() => document.getElementById('cards').innerHTML))) E.push('go25 老師 看到 的 不是 t25 網址'); await c.close();
  [p, c] = await open('index.html', after); n++; if (await p.evaluate(() => [...document.querySelectorAll('a.h25')].some(a => getComputedStyle(a).display !== 'none'))) E.push('總首頁 11/5 以後 還有 25 題 闖關 連結'); await c.close();
  await br.close(); E.forEach(x => console.log('✗ ' + x)); console.log((E.length ? '✗ ' : '✓ ') + '25 題 闖關 下架：' + n + ' 項，' + E.length + ' 個 失敗');
})();
