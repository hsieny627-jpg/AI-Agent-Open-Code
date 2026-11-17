/* live/_verify_57.js — 第五十七次 第 2～4 點：頒獎 典禮 更 緊湊＋進步 之星 第 1 名 最 高（node live/_verify_57.js；只 印 失敗）
 * ① 🌟 進步 之星（score/_grow.js）：5 個 星光 頒獎台，台子 高度 1 > 2 > 3 > 4 > 5、第 1 名 的 人 站 得 最 高；全部 演完 ≦ 30 秒（原本 約 47 秒）
 * ② 🏆 前 10 名（score/_awd.js）：全部 演完 ≦ 42 秒（原本 約 60 秒）；新 特效（探照燈、衝擊波、金色 光爆）都 在、不 擋 人（在 人物 後面、不 混色）
 * 兩種 螢幕；__GROWFAST／__AWDFAST ＝ 時間 ✕ 0.05 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright'), fs = require('fs'), path = require('path');
const G = require('../score/_grow.js'), A = require('../score/_awd.js'), E = []; let n = 0; const ok = (c, m) => { n++; if (!c) E.push(m); };
const rows = [1, 2, 3, 4, 5].map(k => ({ rk: k, nm: '4020' + k + ' 小' + k, hero: '', pr: 20 - k * 3, ds: '＋' + (20 - k * 3), dg: '＋5' }));
const arows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => ({ rk: k, code: '402' + String(k).padStart(2, '0'), nm: '小' + k, sc: (100 - k) + ' 分', ln: '' }));
const html = '<!doctype html><meta charset=utf-8><style>' + G.CSS + A.CSS + '</style><div id=h></div><div id=a></div><script>' + G.JS + A.JS + '</script>';
(async () => { const b = await chromium.launch(); fs.writeFileSync('/tmp/_v57c.html', html);
  for (const [w, h] of [[1024, 768], [1920, 1080]]) { const tag = w + '×' + h, p = await b.newPage({ viewport: { width: w, height: h } }), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file:///tmp/_v57c.html');
    const g = await p.evaluate(rows => new Promise(res => { window.__GROWFAST = 1; const t0 = performance.now(); GROW.play(document.getElementById('h'), { kick: '402', rows, keep: [] }, { done: () => { const ms = (performance.now() - t0) / .05; setTimeout(() => res({ ms,
      ped: [1, 2, 3, 4, 5].map(k => document.querySelector('.grslot.s' + k + ' .grped').getBoundingClientRect().height), top: [1, 2, 3, 4, 5].map(k => { const c = document.querySelector('.grslot.s' + k + ' .grc'); return c ? c.getBoundingClientRect().top : 1e9; }),
      first: document.querySelector('.grslot.s1').getBoundingClientRect().left > document.querySelector('.grslot.s2').getBoundingClientRect().left && document.querySelector('.grslot.s1').getBoundingClientRect().left < document.querySelector('.grslot.s3').getBoundingClientRect().left }), 400) } }); }), rows);
    ok(g.ms <= 30000, tag + ' 進步 之星 太 長 ' + Math.round(g.ms / 1000) + ' 秒'); ok(g.ped.every((x, i) => i === 0 || x < g.ped[i - 1]), tag + ' 頒獎台 高度 不是 1>2>3>4>5 ' + g.ped.map(Math.round));
    ok(g.top.every((x, i) => i === 0 || x > g.top[i - 1]), tag + ' 第 1 名 沒 站 得 最 高 ' + g.top.map(Math.round)); ok(g.first, tag + ' 第 1 名 不在 中間');
    await p.evaluate(() => GROW.stop(document.getElementById('h')));
    const a = await p.evaluate(rows => new Promise(res => { window.__AWDFAST = 1; const t0 = performance.now(), hst = document.getElementById('a'); let seen = { beam: 0, shock: 0, nova: 0 };
      const iv = setInterval(() => { if (hst.classList.contains('beam')) seen.beam = 1; if (hst.querySelector('.awshk')) seen.shock = 1; if (hst.classList.contains('nova')) seen.nova = 1; }, 5);
      AWD.play(hst, { kick: '402', title: '🏆 測驗', rows }, { done: () => { clearInterval(iv); const z = [...hst.querySelectorAll('.awbeams,.awnova,.awshk')].map(e => getComputedStyle(e)); res({ ms: (performance.now() - t0) / .05, seen, blend: z.filter(c => c.mixBlendMode !== 'normal' || c.pointerEvents !== 'none').length }); } }); }), arows);
    ok(a.ms <= 42000, tag + ' 前 10 名 頒獎 太 長 ' + Math.round(a.ms / 1000) + ' 秒'); ok(a.seen.beam && a.seen.shock && a.seen.nova, tag + ' 新 特效 沒 出現 ' + JSON.stringify(a.seen)); ok(!a.blend, tag + ' 新 特效 會 混色／擋 點擊');
    ok(!errs.length, tag + ' 程式 錯誤 ' + errs.join('|')); await p.close(); }
  await b.close(); E.forEach(e => console.log('✗ ' + e)); console.log((E.length ? '❌' : '✅') + ' 第五十七次 頒獎 典禮：' + n + ' 項，' + E.length + ' 個 失敗'); process.exit(E.length ? 1 : 0); })();
