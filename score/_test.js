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
/* 課後班 400（使用者 2026-10-09 E9～E11）：四年級、座號 01～30、不放進班際比較 */
eq(SC.checkId('40001').g, 4, '40001 ＝ 四年級課後班'); eq(SC.checkId('40030').cls, '400', '40030 可以'); eq(SC.checkId('40031').err, 'seat', '課後班 31 號擋下來');
eq(SC.checkId('40019', 3).err, 'grade', '三年級網站擋課後班 400（只有四年級）'); eq(SC.checkId('39001').err, 'cls', '沒有 390 班');
eq(SC.cname('400'), '400 課後班', '400 叫「課後班」'); eq(SC.cname('402'), '402 班', '402 班');
ok(SC.classes([{ id: '40001', cls: '400', acc: 90, s: 80, count: 1, prog: null }], 4, null).every(x => x.cls !== '400'), '班際比較沒有課後班');
{ const v = SC.view([{ id: '40001', cls: '400', g: 4, set: 'g4u1_1-1b', m: 'q', acc: 80, s: 70, n: 5, ok: 4, fast: 0, raw: 3000, t: NOW, u: 'x', qs: [] }], { id: '40001', set: 'g4u1_1-1b', u: 'y' }, NOW, true);
  ok(v && !v.err && v.delta === null, '課後班學生看自己的成績不會壞（沒有 delta）'); }
eq(SC.checkId('30430').seat, 30, '座號 30 可以'); eq(SC.checkId('30431').err, 'seat', '座號 31 擋下來（01～30，使用者 2026-10-09）');
/* 2026-10-12 D 第 4 件：練習時間、天天練、班際平均每一個人、每一班都有最強的一項 */
{ const q = (ok, sec) => [ok, 0, sec, 0, 1, 0];
  const R = [{ id: '30401', cls: '304', g: 3, set: 'g3u1_a', m: 'q', acc: 40, s: 30, n: 5, ok: 2, fast: 0, t: NOW - 864e5, u: 'a', qs: [q(1, 8), q(1, 8), q(0, 8), q(0, 8), q(0, 8)] },
    { id: '30401', cls: '304', g: 3, set: 'g3u1_a', m: 'q', acc: 80, s: 70, n: 5, ok: 4, fast: 0, t: NOW, u: 'b', qs: [q(1, 6), q(1, 6), q(1, 6), q(1, 6), q(0, 6)] },
    { id: '30701', cls: '307', g: 3, set: 'g3u1_a', m: 'q', acc: 100, s: 90, n: 5, ok: 5, fast: 3, t: NOW, u: 'c', qs: [q(1, 1), q(1, 1), q(1, 1), q(1, 2), q(1, 2)] },
    { id: '30702', cls: '307', g: 3, set: 'g3gm_g6', m: 'mem', acc: null, s: null, n: 0, ok: 0, fast: 0, sec: 90, t: NOW, u: 'd', qs: [] }];
  const P = SC.students(R), a = P.filter(p => p.id === '30401')[0], b = P.filter(p => p.id === '30701')[0], m = P.filter(p => p.id === '30702')[0];
  eq([a.count, a.sec, a.days, a.prog], [2, 70, 2, 40], '小華：對 2 題也算 ＋1（F4）、練習時間 70 秒、練了 2 天、進步 ＋40');
  eq(b.count, 0, '太快亂按超過一半（5 題按了 3 題）不算練習次數');
  eq(m.sec, 90, '記憶配對的練習時間 ＝ 整場秒數');
  const C = SC.classes(P, 3, { '304': 25, '307': 2 }), c4 = C.filter(c => c.cls === '304')[0], c7 = C.filter(c => c.cls === '307')[0];
  eq([c4.cntP, c7.cntP, c7.secP], [0.1, 0.5, 45], '班際平均每一個人：除以全班人數（304 班 25 人練 2 次 ＝ 0.1、307 班 2 人練 1 次 ＝ 0.5；307 班太快亂按那一次不算時間 ＝ 90 秒 ÷ 2）');
  eq(SC.secOf(R[2]), 0, '太快亂按超過一半：這一次的練習時間不算（D8）');
  eq(SC.secOf({ m: 'q', n: 5, fast: 1, qs: [q(1, 8), q(1, 8), [1, 0, 0.5, 1, 1, 0], q(1, 8), q(1, 8)] }), 32, '只有一題太快亂按：那一題的秒數不算');
  const A = SC.clsAwards(C);
  eq(Object.keys(A.rk), ['sec', 'acc', 'prog'], '班級只有三種：最認真練習的班、成績最優的班、進步最多的班（D6～D8）');
  eq([A.rk.sec.map(x => x.cls), A.rk.prog.map(x => x.cls)], [['307', '304'], ['304']], '最認真練習的班 ＝ 平均每一個人練習時間；進步最多只有進步的班');
  ok(!A.best['311'], '沒有人做的班沒有獎');
  const v2 = SC.view(R, { id: '30401' }, NOW, true, { '304': 25 });
  eq([v2.me.sec, v2.me.days, v2.me.pf, v2.me.pt, v2.cls1.prog, v2.crk.prog.rk], [70, 2, 40, 80, '304', 1], '學生拿到：練習時間、天數、進步從 40 分到 80 分、班級名次');
  ok(v2.top.sec && v2.rk.sec, '學生也有 ⏱ 練習時間榜');
  /* 第一次進榜或名次上升才演（rk0 ＝ 這一次以前的名次） */
  const v3 = SC.view(R, { id: '30401', u: 'b' }, NOW, true, { '304': 25 });
  eq([v3.rk.sec.cls, v3.rk0.sec.cls, v3.rk.prog.cls, v3.rk0.prog.cls], [1, 1, 1, null], '小華這一次：最認真練習 名次沒變（1 ➜ 1，不演）、進步最多 第一次進榜（演）');
  /* 上週的練習時間（比上週多 練習 N 分鐘） */
  const LW = R.concat([{ id: '30401', cls: '304', g: 3, set: 'g3u1_b', m: 'q', acc: 60, s: 50, n: 5, ok: 3, fast: 0, t: MON - 864e5, u: 'e', qs: [q(1, 4), q(1, 4), q(1, 4), q(0, 4), q(0, 4)] }]);
  eq(SC.view(LW, { id: '30401' }, NOW, true).me.secPrev, 20, '上週練了 20 秒（這週 70 秒 ➜ 比上週多）'); }
/* 2/3 門檻：5 題對 4 題才算；6 題對 4 題算 */
ok(SC.counts(2, 5, 'q', 0) && SC.counts(0, 5, 'q', 2) && !SC.counts(5, 5, 'q', 3) && !SC.counts(0, 0, 'q', 0), '練習次數做完就算（F4）；太快亂按超過一半不算'); eq(SC.need(5), 4, '5 題要對 4 題');
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
/* 2026-10-12 D 第 7 件：〔🔒 開關〕 */
{ eq(G.post({ a: 'lock', pw: 'wrong', cls: ['304'], keys: ['g3rv_u1-t0-0'], on: true }).err, 'pw', '〔🔒 開關〕要老師密碼');
  const L1 = G.post({ a: 'lock', pw: 'pw-test', cls: ['304', '307'], keys: ['g3rv_u1-t0-0', 'g3rv_gm-g3', 'g4rv_u1-t0-0', 'x<b>'], on: true }).locks;
  eq(L1, { '304': ['g3rv_gm-g3', 'g3rv_u1-t0-0'], '307': ['g3rv_gm-g3', 'g3rv_u1-t0-0'] }, '鎖 304、307 兩班；別的年級、亂寫的代號不收');
  eq(G.post({ a: 'lock', pw: 'pw-test', cls: ['307'], keys: ['g3rv_gm-g3'], on: false }).locks['307'], ['g3rv_u1-t0-0'], '307 班開一個，其他照舊');
  const an = G.get({ a: 'locks', g: '3' }); eq(an.any, ['g3rv_gm-g3', 'g3rv_u1-t0-0'], '沒登入：只知道任何一班鎖了哪些主題');
  ok(!/30[47]/.test(JSON.stringify(an)), '沒登入拿到的不寫哪幾班（D6 第 13 題）');
  eq([G.get({ a: 'tasks', id: '30405' }).locks, G.get({ a: 'tasks', id: '30701' }).locks, G.get({ a: 'tasks', id: '31101' }).locks], [['g3rv_gm-g3', 'g3rv_u1-t0-0'], ['g3rv_u1-t0-0'], []], '登入了：只拿自己班的');
  eq(G.post({ a: 'teacher', pw: 'pw-test' }).locks['304'].length, 2, '老師看板拿得到全部');
  G.post({ a: 'lock', pw: 'pw-test', cls: ['304', '307'], keys: ['g3rv_u1-t0-0', 'g3rv_gm-g3'], on: false }); eq(G.get({ a: 'locks', g: '3' }).any, [], '全部開'); }
v = G.get({ a: 'view', id: '30405', set: 'g3u1_1-1b' });
ok(v.boards && v.top.acc.cls.length >= 10 && v.top.acc.cls.every(x => x.rk <= 10), '學生只看得到前 10 名');
ok(v.top.acc.grade.every(x => x.id[0] === '3'), '全年級榜只有三年級');
ok(v.rk.acc.cls === null || v.rk.acc.cls <= 10, '自己不在前 10 名 ➜ 沒有名次數字');
eq(Object.keys(v).sort(), ['boards', 'caw', 'classes', 'cls', 'cls1', 'crk', 'cut', 'g', 'id', 'keep', 'me', 'mycls', 'rk', 'set', 'top', 'week'], '學生看得到的只有這些（沒有別人的名次；crk ＝ 自己班的名次）');
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
/* 2026-10-09 名單：只給老師（要密碼）；學生端就算 ROSTER 開著也拿不到姓名（Q4） */
G.P.ROSTER = 'on'; G.books['名單'].d.push(['304', 5, '測試'], ['304班', '06', ' 王小明 '], [307, 1, '李大華'], ['304', 31, '座號超過'], ['305', 2, '沒有這班'], ['304', 7, ''], ['', '', '']);
eq(G.get({ a: 'who', id: '30405' }).name, null, '學生端拿不到姓名（ROSTER 開著也一樣）');
ok(JSON.stringify(G.get({ a: 'view', id: '30405', set: 'g3u1_1-1b' })).indexOf('測試') < 0, '學生看排行榜也拿不到姓名');
eq(G.post({ a: 'teacher', pw: 'wrong' }).roster, undefined, '密碼錯 ➜ 沒有名單');
eq(G.post({ a: 'teacher', pw: 'pw-test' }).roster, [['304', 5, '測試'], ['304', 6, '王小明'], ['307', 1, '李大華']], '老師拿到名單（304班／06／前後空白都讀得懂；座號 31、沒有的班、空白姓名不收）');
const noPw = make({}); eq(noPw.post({ a: 'teacher', pw: '' }).err, 'pw', '沒設定密碼 ➜ 看板打不開');

/* ══ 2026-10-08 對話 D：遊戲、Review 1 也記成績 ══ */
eq(SC.COLS[SC.COLS.length - 1], '作廢', '「作廢」還是最後一欄（老師在試算表打 TRUE）');
ok(!SC.counts(5, 5, 'g', 0) && SC.counts(4, 6, 'g', 0) && SC.counts(1, 6, 'g', 3) && !SC.counts(6, 6, 'g', 4), '遊戲練習次數 ＋1：第一次作答 ≧ 6 題、太快亂按不超過一半');
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

/* ══ 老師派任務（2026-10-09 E）══ */
{ const H = 36e5, N = Date.parse('2026-10-09T10:00:00+08:00');
  const A = { id: 'a', items: ['g4gm_g1', 'g4u1_1-1b'], from: N - H, to: N + H }, Bf = { id: 'b', items: ['g4gm_g2'], from: N + 2 * H, to: N + 3 * H }, C = { id: 'c', items: ['g4gm_g3'], from: N - 3 * H, to: N - 2 * H };
  eq(SC.tkLock([], 'g4gm_g1', N).k, 'free', '沒有任務 ➜ 全部開放（E2-A）');
  eq(SC.tkLock([A], 'g4gm_g1', N).k, 'open', '任務裡、時段裡 ➜ 開');
  eq(SC.tkLock([A], 'g4gm_g5', N).k, 'off', '有任務正在進行，沒被指定的 ➜ 🔒');
  eq(SC.tkLock([Bf], 'g4gm_g5', N).k, 'free', '任務還沒開始：其他的照常開放');
  eq(SC.tkLock([Bf], 'g4gm_g2', N).k, 'soon', '任務裡的還沒到時間 ➜ 🔒 幾點開放');
  eq(SC.tkLock([C], 'g4gm_g3', N).k, 'end', '過了截止時間 ➜ 🔒 已經截止（老師刪掉或改期限才開）');
  eq(SC.tkLock([C], 'g4gm_g5', N).k, 'free', '只有截止的任務：其他的照常開放');
  eq(SC.tkLock([A, C], 'g4gm_g3', N).k, 'end', '截止的不會因為別的任務正在進行就開');
  eq(SC.tkLock([A, Object.assign({}, A, { id: 'h', to: N + 5 * H })], 'g4gm_g1', N).to, N + 5 * H, '同時有兩個任務都有它 ➜ 截止照晚的');
  eq(SC.tkLock([A], 'g4gm_g1', N + H + 1).k, 'end', '截止那一刻以後就不能開始');
  eq(SC.tkClean({ g: 4, cls: ['402', '304', '400'], items: ['g4gm_g1', 'g3gm_g1', 'x'], from: 2, to: 1 }, N), null, '截止比開始早 ➜ 不收');
  const t = SC.tkClean({ g: 4, name: '  回家作業 ', cls: ['402', '304', '400', '402'], items: ['g4gm_g1', 'g3gm_g1', 'g4gm_job-memory'], nm: { g4gm_g1: '⚡ 閃電' }, from: N, to: N + H }, N);
  eq([t.name, t.cls, t.items], ['回家作業', ['402', '400'], ['g4gm_g1', 'g4gm_job-memory']], '派任務：別的年級的班、別的年級的題目不收；課後班 400、職業單字收');
  const G3 = make({ TEACHER_PW: 'pw' });
  eq(G3.post({ a: 'task', pw: 'x', op: 'set', t }).err, 'pw', '派任務要老師密碼');
  let j = G3.post({ a: 'task', pw: 'pw', op: 'set', t: Object.assign({}, t, { id: 't1', from: Date.now() - H, to: Date.now() + H }) });
  ok(j.ok && j.tasks.length === 1 && G3.books['任務'].d.length === 2, '任務存進試算表「任務」分頁（一個任務一列）');
  G3.post({ a: 'task', pw: 'pw', op: 'set', t: Object.assign({}, t, { id: 't2', name: '課堂', cls: ['406'], from: Date.now() - H, to: Date.now() + H }) });
  j = G3.post({ a: 'task', pw: 'pw', op: 'set', t: Object.assign({}, t, { id: 't1', from: Date.now() - H, to: Date.now() + 2 * H }) });
  ok(j.tasks.length === 2 && j.tasks.filter(x => x.id === 't1')[0].to > Date.now() + 1.9 * H, '改時間 ＝ 同一個任務換掉（不會變兩個）');
  G3.post({ a: 'rec', r: { id: '40205', set: 'g4gm_g1', name: 'g', m: 'g', raw: 1, src: 'school', dev: 'd', u: 'tk1', t: Date.now(), qs: GQ(8, 8) } });
  let v2 = G3.get({ a: 'tasks', id: '40205' });
  ok(v2.ok && v2.now > 0 && v2.tasks.length === 1 && v2.tasks[0].id === 't1', '學生只拿到自己班的任務（402 沒有 406 的）');
  eq(v2.tasks[0].done, ['g4gm_g1'], '學生拿到「我做完了哪些」');
  ok(!JSON.stringify(v2).match(/姓名|roster/), '學生拿任務不會拿到名單');
  eq(G3.get({ a: 'tasks', id: '40001' }).tasks.length, 1, '課後班 400 也拿得到任務');
  eq(G3.get({ a: 'tasks', id: '30405' }).tasks.length, 0, '三年級拿不到四年級的任務');
  ok(G3.post({ a: 'teacher', pw: 'pw' }).tasks.length === 2, '老師看板拿得到全部任務');
  j = G3.post({ a: 'task', pw: 'pw', op: 'del', id: 't2' }); ok(j.ok && j.tasks.length === 1 && G3.books['任務'].d.length === 2, '刪掉任務（試算表那一列也清掉）');
  eq(G3.post({ a: 'task', pw: 'pw', op: 'set', t: { g: 4, cls: [], items: ['g4gm_g1'], from: 1, to: 2 } }).err, 'task', '沒有班級的任務不收');
}

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
