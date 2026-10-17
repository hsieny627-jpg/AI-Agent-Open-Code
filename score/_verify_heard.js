/* score/_verify_heard.js — 🎧 聽完字卡（2026-10-16 老師 C4 第 6 題 A、6-2 A；C5「1 乙」算進 📅 練習）
 * node score/_verify_heard.js：只印失敗項＋一行總結。假伺服器 ＝ score/_gas_stub.js 跑真的 Code.gs（絕對不送到真的成績表）。
 * 量：① 在家複習的句型卡（u1、r1.html）：一張卡唸完才算、唸到一半換卡不算、一站每一張都聽完 ＝ 送一筆 m:'l'（g年級l_站）、送完重來；
 *     沒登入／👀 先練習 不記；教學網站的句型卡沒有接（只算在家複習）
 *   ② 在家複習的 Review 1 字卡：一個字每一幕都唸完 ＝ 這個字聽完；一組最後一個字聽完 ＝ 送一筆（r1w-i1…）
 *   ③ 補充頁（單字結構 sayAll、單字故事）：一幕唸完 ＝ 這一幕聽完；沒有字的幕看到就算；全部聽完 ＝ 送一筆（mo-…）
 */
const path = require('path'), { chromium } = require('playwright');
const { make } = require('./_gas_stub.js'), SC = require('./_calc.js');
const ROOT = path.join(__dirname, '..'), URL0 = 'https://script.test/exec';
let fails = 0, n = 0;
const out = (w, e) => { if (e.length) { fails += e.length; console.log('✗ ' + w); e.forEach(x => console.log('   ' + x)); } };
async function ctxOf(br, G) {
  const ctx = await br.newContext({ viewport: { width: 1024, height: 768 } });
  await ctx.addInitScript(u => { Object.defineProperty(window, 'SCORE_URL', { get: () => u, set: () => {}, configurable: true }); }, URL0);
  await ctx.route(URL0 + '**', async r => {
    const q = Object.fromEntries(new URL(r.request().url()).searchParams);
    const body = r.request().method() === 'POST' ? G.post(r.request().postData()) : G.get(q);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
  });
  await ctx.route(/^https?:\/\/(?!script\.test)/, r => r.abort());   /* 量測只碰假伺服器 */
  return ctx;
}
const recs = G => G.books['紀錄'] ? G.books['紀錄'].d.map(SC.fromRow).filter(r => r.m === 'l') : [];
const login = (p, id) => p.evaluate(id => { SCID = id; SCGUEST = false; try { scOk(); scAct(); } catch (e) {} ['scwho', 'scidle'].forEach(k => { const o = document.getElementById(k); if (o) o.classList.remove('on'); }); }, id);
async function open(br, G, f, id) {
  const ctx = await ctxOf(br, G), p = await ctx.newPage(), errs = [];
  p.on('pageerror', x => errs.push(String(x.message)));
  await p.goto('file://' + path.join(ROOT, f)); await p.waitForTimeout(900);
  if (id) await login(p, id);
  return { ctx, p, errs };
}
/* ① 句型卡：聲音換成「馬上唸完」（只量算法，不量語音檔） */
async function cards(br, f, g, st, id) {
  const e = [], G = make({ TEACHER_PW: 'x' }), { ctx, p, errs } = await open(br, G, f, id);
  const r = await p.evaluate(() => { if (typeof hdKey !== 'function') return null;
    window.say = function (t, l, o) { o = o || {}; setTimeout(function () { if (o.done) o.done(); }, 5); }; window.sayStop = function () {};
    return { key: hdKey(), n: CARDS.length }; });
  if (!r) { out(f, ['在家複習的句型卡沒有接上聽完字卡（hdKey）']); await ctx.close(); return; }
  if (r.key !== st) e.push('站的代號不對：' + r.key + '（要 ' + st + '）');
  /* 唸到一半換卡（done 還沒回來就換）＝ 不算 */
  await p.evaluate(() => { window.say = function () {}; i = 0; draw(0); sayCard(); i = 1; draw(1); });
  await p.waitForTimeout(100);
  const h0 = await p.evaluate(() => (JSON.parse(localStorage.getItem('score_hd') || '{}').s || {})[hdKey()] || []);
  if (h0.length) e.push('唸到一半就換卡也算聽 1 次：' + JSON.stringify(h0));
  await p.evaluate(() => { window.say = function (t, l, o) { o = o || {}; setTimeout(function () { if (o.done) o.done(); }, 5); }; });
  const heard = () => p.evaluate(() => (JSON.parse(localStorage.getItem('score_hd') || '{}').s || {})[hdKey()] || []);
  for (let k = 0; k < r.n - 1; k++) { await p.evaluate(k => { i = k; draw(0); sayCard(); }, k);
    for (let t = 0; t < 60 && (await heard()).indexOf(k) < 0; t++) await p.waitForTimeout(100);   /* 一張卡好幾句：每一句之間會停一下 */
    if ((await heard()).indexOf(k) < 0) e.push('第 ' + (k + 1) + ' 張唸完了還沒有算聽 1 次（' + await p.evaluate(() => CARDS[i].type) + '）'); }
  await p.waitForTimeout(600);
  if (recs(G).length) e.push('還沒聽完最後一張就送了');
  await p.evaluate(k => { i = k; draw(0); sayCard(); }, r.n - 1); await p.waitForTimeout(1500);
  let L = recs(G);
  if (L.length !== 1 || L[0].set !== 'g' + g + 'l_' + st || L[0].src !== 'home' || L[0].id !== id || L[0].acc !== null) e.push('每一張都聽完 要送一筆 g' + g + 'l_' + st + '（在家）：' + JSON.stringify(L.map(x => [x.set, x.src, x.id])));
  if (!/^🎧 聽完字卡/.test((L[0] || {}).name || '')) e.push('名字要寫「🎧 聽完字卡 …」：' + (L[0] || {}).name);
  const rest = await p.evaluate(() => (JSON.parse(localStorage.getItem('score_hd') || '{}').s || {})[hdKey()] || []);
  if (rest.length) e.push('送完那一站沒有重來');
  /* 👀 先練習 不記 */
  await p.evaluate(() => { SCGUEST = true; });
  for (let k = 0; k < r.n; k++) { await p.evaluate(k => { i = k; draw(0); sayCard(); }, k); await p.waitForTimeout(1500); }
  await p.waitForTimeout(800);
  if (recs(G).length !== 1) e.push('👀 先練習（不記成績）也送了聽完字卡');
  if (errs.length) e.push('JS 錯誤：' + errs[0]);
  n += 7; out(f, e); await ctx.close();
}
/* ② Review 1 字卡：真的語音檔（一幕一句），先把同一組其他字標成聽完 */
async function word(br, f, g, st, id) {
  const e = [], G = make({ TEACHER_PW: 'x' }), { ctx, p, errs } = await open(br, G, f, id);
  const ok = await p.evaluate(st => { if (typeof scHeard !== 'function' || typeof SCENES === 'undefined') return false;
    var d = Math.floor((Date.now() + 288e5) / 864e5), a = []; for (var k = 0; k < 60; k++) a.push(k);
    localStorage.setItem('score_hd', JSON.stringify({ d: d, id: SCID, s: { [st]: a } })); return true; }, st);
  if (!ok) { out(f, ['字卡沒有接上聽完字卡']); await ctx.close(); return; }
  /* 只唸第一幕 ＝ 還沒聽完 */
  await p.evaluate(() => { show(0); say(); }); await p.waitForTimeout(4500);
  if (recs(G).length) e.push('只唸第一幕就算這個字聽完了');
  for (let k = 1; k < 3; k++) { await p.evaluate(k => { if (k < SCENES.length) show(k); }, k); await p.waitForTimeout(5500); }
  await p.waitForTimeout(1500);
  const L = recs(G);
  if (L.length !== 1 || L[0].set !== 'g' + g + 'l_' + st) e.push('每一幕都唸完 ＋ 同一組其他字都聽過 要送一筆 g' + g + 'l_' + st + '：' + JSON.stringify(L.map(x => x.set)));
  if (errs.length) e.push('JS 錯誤：' + errs[0]);
  n += 3; out(f, e); await ctx.close();
}
/* ③ 補充頁：先把其他幕標成聽完，再按〔🔊 唸一次〕把這一幕唸完 */
async function story(br, f, g, st, id) {
  const e = [], G = make({ TEACHER_PW: 'x' }), { ctx, p, errs } = await open(br, G, f, id);
  const r = await p.evaluate(st => { if (typeof scHeard !== 'function' || typeof S === 'undefined') return null;
    var k = -1; for (var j = 0; j < S.length; j++) { show(j); var em = SAYALL ? ![].filter.call(stage.querySelectorAll('.phw,.sp'), function (el) { return visible(el); }).length : !S[j].say; if (!em) { k = j; break; } }
    var d = Math.floor((Date.now() + 288e5) / 864e5), a = []; for (j = 0; j < S.length; j++) if (j !== k) a.push(j);
    localStorage.setItem('score_hd', JSON.stringify({ d: d, id: SCID, s: { [st]: a } }));
    show(k); return { k: k, n: S.length, all: SAYALL }; }, st);
  if (!r || r.k < 0) { out(f, ['補充頁沒有接上聽完字卡（或找不到有字的幕）']); await ctx.close(); return; }
  await p.click('#say'); await p.waitForTimeout(400);
  await p.evaluate(() => show(i));   /* 唸到一半換幕 ＝ 不算 */
  await p.waitForTimeout(6000);
  if (recs(G).length) e.push('唸到一半換幕也算聽完');
  await p.click('#say');
  for (let t = 0; t < 60 && !recs(G).length; t++) await p.waitForTimeout(500);
  const L = recs(G);
  if (L.length !== 1 || L[0].set !== 'g' + g + 'l_' + st) e.push('最後一幕唸完 要送一筆 g' + g + 'l_' + st + '：' + JSON.stringify(L.map(x => x.set)));
  if (errs.length) e.push('JS 錯誤：' + errs[0]);
  n += 3; out(f + '（第 ' + (r.k + 1) + ' 幕）', e); await ctx.close();
}
(async () => {
  const br = await chromium.launch();
  const safe = async (w, fn) => { try { await fn(); } catch (x) { fails++; console.log('✗ ' + w + '\n   量測卡住：' + String(x.message).split('\n')[0]); } };
  /* 教學網站：不接（只算在家複習） */
  await safe('教學網站', async () => { const e = [];
    for (const f of ['sentences/unit1.html', 'G3 - L1 + L2/unit2.html', 'sentences/review1.html']) {
      const G = make({ TEACHER_PW: 'x' }), { ctx, p } = await open(br, G, f, f.charAt(0) === 'G' ? '30405' : '40205');
      if (await p.evaluate(() => typeof hdKey === 'function')) e.push(f + ' 是教學網站，不可以算聽完字卡');
      await ctx.close(); n++; }
    out('教學網站', e); });
  await safe('g4-review/u1.html', () => cards(br, 'g4-review/u1.html', 4, 'u1-t0-0', '40205'));
  await safe('g3-review/u2.html', () => cards(br, 'g3-review/u2.html', 3, 'u2-t0-0', '30405'));
  await safe('g3-review/r1.html', () => cards(br, 'g3-review/r1.html', 3, 'r1s', '30405'));
  await safe('g4-review/r1/stickers.html', () => word(br, 'g4-review/r1/stickers.html', 4, 'r1w-i1', '40205'));
  await safe('g3-review/r1/play-basketball.html', () => word(br, 'g3-review/r1/play-basketball.html', 3, 'r1w-a1', '30405'));
  await safe('g4-review/parts.html', () => story(br, 'g4-review/parts.html', 4, 'mo-parts', '40205'));
  await safe('g3-review/numbers-why.html', () => story(br, 'g3-review/numbers-why.html', 3, 'mo-numbers-why', '30405'));
  await br.close();
  console.log((fails ? '✗ ' : '✓ ') + '聽完字卡 量了 ' + n + ' 項，失敗 ' + fails + ' 項');
  process.exit(fails ? 1 : 0);
})();
