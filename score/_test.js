/* score/_test.js — 成績紀錄的規則和 Apps Script（用 _gas_stub.js 跑真的 Code.gs），只印失敗項和一行總結
 *   node score/_test.js
 */
const SC = require('./_calc.js'), { make } = require('./_gas_stub.js');
let n = 0, bad = 0;
const eq = (a, b, m) => { n++; const A = JSON.stringify(a), B = JSON.stringify(b); if (A !== B) { bad++; console.log('✗ ' + m + '：得到 ' + A + '，應該 ' + B); } };
const ok = (c, m) => { n++; if (!c) { bad++; console.log('✗ ' + m); } };
/* 時間：2026-10-07（星期三）台灣 10:00 */
const NOW = Date.parse('2026-10-07T10:00:00+08:00'), MON = Date.parse('2026-10-05T00:00:00+08:00');
eq(SC.weekStart(NOW), MON, '本週從星期一 00:00（台灣）開始');
eq(SC.weekStart(MON - 1), MON - 7 * 864e5, '星期日 23:59 是上一週');
/* 登入防呆 */
eq(SC.checkId('30405').cls, '304', '30405 ＝ 304 班'); eq(SC.checkId('30405').seat, 5, '30405 ＝ 5 號');
eq(SC.checkId('30505').err, 'cls', '沒有 305 班'); eq(SC.checkId('30400').err, 'seat', '座號 00 不行'); eq(SC.checkId('30441').err, 'seat', '座號 41 不行');
eq(SC.checkId('3040').err, 'len', '要 5 碼'); eq(SC.checkId('40205', 3).err, 'grade', '三年級網站擋四年級'); eq(SC.checkId('41005').g, 4, '410 班');
/* 2/3 門檻：5 題對 4 題才算；6 題對 4 題算 */
ok(!SC.counts(3, 5) && SC.counts(4, 5) && SC.counts(4, 6) && !SC.counts(3, 6), '答對 2/3 以上才算 1 次（5 題要對 4 題）'); eq(SC.need(5), 4, '5 題要對 4 題');
/* 總分百分制：答對 60 ＋ 速度 40（Q1-A） */
eq(SC.s100([[1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1]]), 100, '全對又最快 ＝ 100');
eq(SC.s100([[1, 0, 10, 0, 1 / 3], [1, 0, 10, 0, 1 / 3], [1, 0, 10, 0, 1 / 3], [1, 0, 10, 0, 1 / 3], [1, 0, 10, 0, 1 / 3]]), 73.3, '全對但每題剩 1/3 時間 ＝ 60＋13.3');
eq(SC.s100([[0, 1, 1, 1, 0], [0, 2, 1, 1, 0], [1, 0, 1, 1, .9], [1, 0, 1, 1, .9], [0, 3, 1, 1, 0]]), 38.4, '亂猜對 2 題 ＝ 24＋14.4');
/* 個人：每一組取最近一次再平均；次數一天最多 3；進步 ＝ 最近一次 − 上一次 */
let u = 0;
const rec = (id, set, ok5, t, o) => Object.assign({ t: t, id: id, g: +id[0], cls: id.slice(0, 3), seat: +id.slice(3), set: set, name: '', n: 5, ok: ok5, acc: ok5 * 20, s: ok5 * 12,
  raw: ok5 * 600, fast: 0, src: 'school', dev: 'd', u: 'u' + (u++), qs: [0, 1, 2, 3, 4].map(i => [i < ok5 ? 1 : 0, i < ok5 ? 0 : 1, 3, 0, i < ok5 ? .5 : 0]), x: false }, o || {});
const H = 36e5, R = [
  rec('30405', 'g3u1_1-1b', 3, MON + H), rec('30405', 'g3u1_1-1b', 4, MON + 2 * H), rec('30405', 'g3u1_1-1b', 5, MON + 3 * H), rec('30405', 'g3u1_1-1b', 5, MON + 4 * H), rec('30405', 'g3u1_1-1b', 5, MON + 5 * H),
  rec('30405', 'g3u1_2b', 4, MON + 6 * H),
  rec('30407', 'g3u1_1-1b', 5, MON + H), rec('30407', 'g3u1_1-1b', 5, MON + 30 * H),
  rec('30409', 'g3u1_1-1b', 2, MON + H), rec('30409', 'g3u1_1-1b', 5, MON + 2 * H, { fast: 3 }),
  rec('31101', 'g3u1_1-1b', 3, MON + H), rec('31101', 'g3u1_1-1b', 5, MON + 2 * H), rec('31101', 'g3u1_2b', 2, MON + H), rec('31101', 'g3u1_2b', 3, MON + 2 * H),
  rec('30701', 'g3u1_1-1b', 4, MON + H), rec('30701', 'g3u1_1-1b', 4, MON + 2 * H, { x: true })
];
const P = {}; SC.students(R).forEach(p => { P[p.id] = p; });
eq(P['30405'].acc, 90, '個人正確率 ＝ 每組最近一次（100、80）的平均');
eq(P['30405'].count, 4, '同一組一天最多算 3 次（4 次算 3）＋另一組 1 次；對 3 題那次不算');
eq([P['30405'].prog, P['30405'].keep], [null, true], '保持 100 不算進平均（另一組只做 1 次）➜ 沒有進步數字、🔥 保持滿分');
eq(P['30407'].keep, true, '上次 100、這次 100 ＝ 🔥 保持滿分'); eq(P['30407'].prog, null, '保持滿分沒有進步數字');
eq(P['30409'].prog, null, '秒按超過一半的那一次不拿來比');
eq(P['30701'].acc, 80, '作廢的不算');
eq(P['31101'].prog, 30, '進步 ＝ 每組（最近一次 − 上一次）的平均：(+40 ＋ +20) ÷ 2');
/* 排名：同分同名次；正確率同分比總分 */
const rk = SC.rank([{ id: 'a', acc: 90, s: 50 }, { id: 'b', acc: 90, s: 60 }, { id: 'c', acc: 90, s: 60 }, { id: 'd', acc: 80, s: 99 }], 'acc');
eq(rk.map(x => x.id + x.rk), ['b1', 'c1', 'a3', 'd4'], '同分比總分，總分也同 ＝ 同名次');
/* ── Apps Script（真的 Code.gs） ── */
const G = make({ TEACHER_PW: 'pw-test' });
eq(G.get({}).app, 'score', 'doGet 有回應');
const body = (id, set, ok5, extra) => ({ a: 'rec', r: Object.assign({ id, set, name: 'x', raw: 3000, src: 'school', dev: 'abc', u: id + set + ok5 + (extra && extra.k || ''), t: Date.now(),
  qs: [0, 1, 2, 3, 4].map(i => [i < ok5 ? 1 : 0, i < ok5 ? 0 : 2, 4.2, 0, i < ok5 ? .6 : 0]) }, extra || {}) });
let v = G.post(body('30405', 'g3u1_1-1b', 4));
ok(v.saved && !v.dup, '存了一筆'); eq(G.books['紀錄'].d.length, 2, '紀錄表多一列');
v = G.post(body('30405', 'g3u1_1-1b', 4)); ok(v.dup, '同一個編號再送一次不會重複存（沒網路補送）'); eq(G.books['紀錄'].d.length, 2, '重複的沒有存');
eq(G.books['紀錄'].d[1][SC.CI['總分百分制']], 67.2, '伺服器自己算總分百分制（對 4 題 48 ＋ 速度 4 ✕ 8 ✕ 0.6 ＝ 19.2）');
eq(G.post({ a: 'rec', r: { id: '30505', set: 'g3u1_1-1b', qs: [[1, 0, 1, 0, 1]] } }).err, 'bad', '沒有這一班 ➜ 不存');
eq(G.post({ a: 'rec', r: { id: '30405', set: 'x<script>', qs: [[1, 0, 1, 0, 1]] } }).err, 'bad', '題組代號不對 ➜ 不存');
for (let s = 1; s <= 12; s++) G.post(body('304' + String(s + 10).padStart(2, '0'), 'g3u1_1-1b', s % 2 ? 5 : 4));
G.post(body('30701', 'g3u1_1-1b', 3)); G.post(body('40205', 'g4u1_1-1b', 5));
v = G.get({ a: 'view', id: '30405', set: 'g3u1_1-1b' });
ok(v.boards && v.top.acc.cls.length >= 10 && v.top.acc.cls.every(x => x.rk <= 10), '學生只看得到前 10 名');
ok(v.top.acc.grade.every(x => x.id[0] === '3'), '全年級榜只有三年級');
ok(v.rk.acc.cls === null || v.rk.acc.cls <= 10, '自己不在前 10 名 ➜ 沒有名次數字');
eq(Object.keys(v).sort(), ['boards', 'classes', 'cls', 'cut', 'g', 'id', 'keep', 'me', 'rk', 'set', 'top', 'week'], '學生看得到的只有這些（沒有別人的名次）');
ok(v.set.others.length <= 10 && v.set.others.every(x => typeof x === 'number'), '作答中名次只拿到別人前 10 個分數（沒有 5 碼）');
eq(v.classes.map(c => c.cls), ['304', '307', '311'], '班級長條 ＝ 同年級三班');
eq(G.post({ a: 'teacher', pw: 'wrong' }).err, 'pw', '老師密碼錯 ➜ 拒絕');
const T = G.post({ a: 'teacher', pw: 'pw-test' }); ok(T.ok && T.rows.length === 15, '老師密碼對 ➜ 全部紀錄（' + (T.rows && T.rows.length) + '）');
eq(G.post({ a: 'set', pw: 'pw-test', boards: false }).boards, false, '老師關掉學生排行榜');
v = G.get({ a: 'view', id: '30405', set: 'g3u1_1-1b' }); ok(!v.boards && !v.top && v.set.others.length === 0, '排行榜關掉 ➜ 學生拿不到任何排行');
G.post({ a: 'set', pw: 'pw-test', boards: true });
const uu = G.books['紀錄'].d[1][SC.CI['編號']]; eq(G.post({ a: 'void', pw: 'pw-test', u: uu, v: true }).ok, true, '老師作廢一筆');
eq(SC.fromRow(G.books['紀錄'].d[1]).x, true, '作廢那一筆打勾了');
eq(G.post({ a: 'void', pw: 'nope', u: uu, v: false }).err, 'pw', '沒密碼不能作廢');
eq(G.get({ a: 'who', id: '30405' }).name, null, '名單開關預設關 ➜ 不給名字');
G.P.ROSTER = 'on'; G.books['名單'].d.push(['304', 5, '測試']); eq(G.get({ a: 'who', id: '30405' }).name, '測試', '名單開關打開才給名字');
const noPw = make({}); eq(noPw.post({ a: 'teacher', pw: '' }).err, 'pw', '沒設定密碼 ➜ 看板打不開');

/* ══ 2026-10-08 對話 D：遊戲、Review 1 也記成績 ══ */
eq(SC.COLS[SC.COLS.length - 1], '作廢', '「作廢」還是最後一欄（老師在試算表打 TRUE）');
ok(!SC.counts(5, 5, 'g') && SC.counts(4, 6, 'g') && !SC.counts(3, 6, 'g') && SC.counts(7, 10, 'g'), '遊戲算 1 次：第一次作答 ≧ 6 題、正確率 ≧ 2/3');
ok(SC.counts(0, 0, 'mem'), '🃏 記憶配對：玩完整場就算 1 次');
eq(['g3u1_1-1b', 'g4gm_g1', 'g3r1_i1_1', 'g4r1_rv2', 'g3x_1'].map(k => SC.cat(k).t), ['📝 複習題', '🎮 遊戲', '📘 Review 1', '📘 Review 1', ''], '題組代號 ➜ 類別');
const GQ = (n, okN, extra) => Array.from({ length: n }, (_, i) => [i < okN ? 1 : 0, i < okN ? 0 : 2, 3, 0, i < okN ? .8 : 0, i]);
const G2 = make({ TEACHER_PW: 'pw' });
const grec = (id, set, n, okN, o) => G2.post({ a: 'rec', r: Object.assign({ id, set, name: 'g', m: 'g', raw: 99999, fix: 2, src: 'school', dev: 'd', u: id + set + n + okN + Math.random(), t: Date.now(), qs: GQ(n, okN) }, o || {}) });
v = grec('30405', 'g3gm_g1', 30, 27);
ok(v.saved && v.gtop && v.gtop.list.length === 1 && v.gtop.rk === 1, '遊戲送出去 ➜ 回傳這個遊戲本班前 10 名（' + JSON.stringify(v.gtop) + '）');
let row = SC.fromRow(G2.books['紀錄'].d[1]);
eq([row.m, row.n, row.ok, row.acc, row.fix, row.raw], ['g', 30, 27, 90, 2, 99999], '遊戲一筆：30 題第一次作答、對 27 題、90 分、訂正成功 2、原始分數照存（驚喜卡的大分數不算進成績）');
eq(G2.books['紀錄'].d[1][SC.CI['類別']], '🎮 遊戲', '試算表「類別」欄 ＝ 🎮 遊戲');
eq(row.s, SC.s100(GQ(30, 27)), '遊戲的總分 ＝ 答對 60 ＋ 速度 40（跟複習題同一個算法）');
eq(grec('30405', 'g3gm_g1', 11, 11, { m: 'q' }).err, 'bad', '題目（不是遊戲）超過 10 題 ➜ 不存');
eq(grec('30405', 'g4gm_g1', 12, 12).err, 'bad', '題組的年級跟登入的年級不一樣 ➜ 不存');
v = G2.post({ a: 'rec', r: { id: '30405', set: 'g3gm_g6', name: 'm', m: 'mem', mp: 13, mw: 5, sec: 180, raw: 4000, src: 'school', dev: 'd', u: 'mem1', t: Date.now(), qs: [[1, 0, 1, 0, 1]] } });
ok(v.saved && !v.gtop, '🃏 記憶配對存得進去（沒有前 10 名）');
const mrow = G2.books['紀錄'].d[G2.books['紀錄'].d.length - 1], mr = SC.fromRow(mrow);
eq([mr.m, mr.acc, mr.s, mr.mp, mr.mw, mr.sec, mr.qs.length, mrow[SC.CI['正確率']]], ['mem', null, null, 13, 5, 180, 0, ''], '記憶配對：沒有正確率、總分（試算表空白），只有配完幾對、翻錯幾次、用幾秒');
grec('30406', 'g3gm_g1', 20, 20); grec('30406', 'g3gm_g1', 20, 10); grec('30407', 'g3gm_g1', 15, 9);
v = G2.get({ a: 'view', id: '30407', set: 'g3gm_g1', gt: '1' });
eq(v.gtop.list.map(x => x.id + ':' + x.rk + ':' + x.acc), ['30406:1:100', '30405:2:90', '30407:3:60'], '這個遊戲本班前 10 名：每個人最好的一次，正確率高的在前');
let PS = {}; SC.students(G2.books['紀錄'].d.slice(1).map(SC.fromRow)).forEach(p => { PS[p.id] = p; });
eq([PS['30405'].acc, PS['30405'].count, PS['30405'].fix], [90, 2, 2], '個人：記憶配對不算進正確率；遊戲 1 次＋記憶配對 1 次 ＝ 2 次；訂正成功加起來');
eq(PS['30406'].acc, 50, '個人：同一個遊戲取最近一次（20 題對 10 題 ＝ 50）');
const QQ = SC.questions(G2.books['紀錄'].d.slice(1).map(SC.fromRow).filter(r => r.set === 'g3gm_g1'));
ok(QQ.some(q => q.k === 'g3gm_g1#29' && q.bad > 0), '錯題用「題庫第幾題」當鑰匙（遊戲的題目順序每次都不一樣）');
for (let d = 0; d < 4; d++) grec('31101', 'g3r1_i1_1', 12, 12);
eq(SC.students(G2.books['紀錄'].d.slice(1).map(SC.fromRow)).filter(p => p.id === '31101')[0].count, 3, '同一個遊戲一天最多算 3 次');
eq(grec('40205', 'g4r1_i1_1', 12, 12).saved, true, 'Review 1 遊戲三、四年級共用：成績算在登入的年級（g4r1_…）');
ok(G2.post({ a: 'rec', r: { id: '30405', set: 'g3r1_rv1', name: 'rv', m: 'q', raw: 3000, src: 'school', dev: 'd', u: 'rv1', t: Date.now(), qs: GQ(4, 3) } }).saved, 'Review 1 頁的 📝 複習存得進去（g3r1_rv1）');
eq(SC.pick(G2.books['紀錄'].d.slice(1).map(SC.fromRow), { g: 3, cat: 'game' }).length, 5, '老師看板「類別」篩選：🎮 遊戲');
const T2 = G2.post({ a: 'void', pw: 'pw', u: 'mem1', v: true }); ok(T2.ok && SC.fromRow(G2.books['紀錄'].d.filter(r => r[SC.CI['編號']] === 'mem1')[0]).x, '作廢打勾在最後一欄（新的欄位）');

/* ══ 以後的新題目、新遊戲（使用者第 9 題）：每一個有題目或遊戲的網頁都要接上成績系統 ══ */
const fs = require('fs'), path = require('path'), ROOT = path.join(__dirname, '..');
const BANK = require('./_build.js'), SITES = require('./_sites.js');
const pages = [];
fs.readdirSync(ROOT).filter(d => fs.statSync(path.join(ROOT, d)).isDirectory() && !/^\.|node_modules/.test(d)).forEach(d =>
  fs.readdirSync(path.join(ROOT, d)).filter(f => /\.html$/.test(f)).forEach(f => pages.push(path.join(d, f))));
let nG = 0, nT = 0, nR = 0;
pages.forEach(f => {
  const h = fs.readFileSync(path.join(ROOT, f), 'utf8'), game = /<section id="gend">/.test(h), tq = /id="tqGo"/.test(h), rv = /id="rvBtn"/.test(h);
  if (!game && !tq && !rv) return;
  nG += game; nT += tq; nR += rv;
  ok(/<script src="\.\.\/score\/url\.js"><\/script>/.test(h) && /\nSCH=\{/.test(h) && /function scEnd\(/.test(h), f + '：有題目或遊戲，卻沒有接上成績系統');
  if (game) { const M = JSON.parse(h.match(/var BANK=[\s\S]*?, META=(\[[\s\S]*?\]), SURP=/)[1]), tag = h.match(/var SCTAG="(\w+)"/)[1], g = +h.match(/var SCG=(\d)/)[1];
    M.forEach(m => ok(BANK[(g ? 'g' + g : 'g*') + tag + '_' + m.id], f + '：遊戲 ' + m.id + ' 在老師看板的題庫找不到')); }
  if (rv) ok(/var SCRV="r\d"/.test(h), f + '：Review 1 頁的 📝 複習沒有代號');
  /* 網頁裡的程式要能跑（2026-10-08 抓到：註解裡寫了 </script>，整段程式被切斷） */
  (h.match(/<script>[\s\S]*?<\/script>/g) || []).forEach((x, i) => { try { new (require('vm').Script)(x.slice(8, -9)); } catch (er) { ok(false, f + '：第 ' + (i + 1) + ' 段程式有語法錯誤：' + er.message); } });
});
ok(nG >= 5 && nT >= 8 && nR >= 2, '找得到全部的遊戲頁（' + nG + '）、複習題頁（' + nT + '）、Review 1 複習頁（' + nR + '）');
Object.keys(BANK).forEach(k => { const b = BANK[k]; if (!b.mem) ok(b.qs.length && b.qs.every(q => q.q && q.o && q.o.length >= 2 && q.o.length <= 4 && q.o.every(x => x)), '題庫 ' + k + '：每一題都要有題目和 2～4 個選項'); });
console.log((bad ? '✗ ' : '✓ ') + '成績紀錄規則＋Apps Script 量了 ' + n + ' 項，失敗 ' + bad + ' 項');
process.exit(bad ? 1 : 0);
