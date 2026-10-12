// 產生 listen/2026-10-12_D8/index.html（老師看完 D7 的 10 點修改＋3 題：⏱ 換什麼、🚪 換什麼、「請問 您還在嗎？」刪到哪裡）
const fs = require('fs'), SP = __dirname + '/../2026-10-12_D6';
const head = fs.readFileSync(SP + '/head.html', 'utf8').replace(/\n<style>\n/, '\n');
const MS = fs.readFileSync(SP + '/ms.svg', 'utf8').trim();
const MSs = MS.replace('class="MS"', 'class="MS sm"');
const UP = '<svg class="UPA" viewBox="0 0 100 120" aria-label="進步"><path d="M50 4 92 52H66v62H34V52H8z" fill="#3BD16F" stroke="#0E5C2A" stroke-width="5" stroke-linejoin="round"/></svg>';
const css = `
.MS.sm{height:120px}.UPA{height:110px}
.mk{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}
.mk.one{grid-template-columns:1fr}
@media (max-width:900px){.mk{grid-template-columns:1fr}}
.dev{border:6px solid #3A4650;border-radius:26px;background:#000;padding:10px 12px 14px;text-align:center}
.dev.pj{border-color:#5B4A12;border-radius:8px;background:radial-gradient(circle at 50% 30%,#2A2000,#000 75%)}
.dev .lab{font-size:22px;color:#B9C4CE;text-align:left;margin-bottom:6px}
.dev .ic{font-size:96px;line-height:1.1}
.dev .t1{font-size:38px;color:#FFE07A;line-height:1.3}
.dev .t2{font-size:28px;color:#fff;line-height:1.4}
.dev .t3{font-size:24px;color:#CFE3F5;line-height:1.4}
.dev .no{opacity:.55}
.lst{text-align:left;font-size:26px;margin:6px auto;max-width:520px}
.lst div{border-bottom:2px solid #2A3540;padding:4px 6px}
.lst .me{background:#3A2E00;color:#FFE07A;border-radius:8px}
.cert{background:#FFF8E6;color:#3A2A00;border:10px double #C9A227;border-radius:6px;padding:12px;text-align:center}
.cert .c1{font-size:34px;color:#8A5A00}.cert .c2{font-size:26px}.cert .c3{font-size:22px;color:#6A5A3A}
.ev td{font-size:22px;overflow-wrap:anywhere}
@media (max-width:900px){.ev,.ev tbody,.ev tr,.ev td,.ev th{display:block;width:100%}.ev tr:first-child{display:none}.ev tr{margin-bottom:12px}}
.ev th{font-size:22px}
.ans{background:#1A1400;border:4px solid #FFD54A;border-radius:20px;padding:14px 20px;margin:30px 0;font-size:28px}
.nw{white-space:nowrap}
`;
const tab = (inner, lab) => `<div class="dev"><div class="lab">📱 ${lab || '學生平板（小華 ＝ 30412）'}</div>${inner}</div>`;
const pj = (inner, lab) => `<div class="dev pj"><div class="lab">📺 ${lab || '老師投影'}</div>${inner}</div>`;
const btn = (t, c) => `<b style="display:inline-block;background:${c};color:#000;border-radius:12px;padding:4px 16px;margin:4px">${t}</b>`;
const G = '#3BD16F', Y = '#FFD54A', R = '#FF7A7A';
const sec = (n, t, inner) => `<h2>${n}　${t}</h2>${inner}`;
const mk = (...a) => `<div class="mk${a.length === 1 ? ' one' : ''}">${a.join('')}</div>`;
const bar = (inner) => `<div style="background:#1A2A10;border:3px solid #3BD16F;border-radius:14px;padding:8px 12px;font-size:28px;text-align:left">${inner}</div>`;

const opt = (k, title, rec, body, pro, con) => `<div class="opt${rec ? ' rec' : ''}"><div class="hd"><b class="k">${k}</b>${title}${rec ? ' <span class="tag" style="display:inline-block;background:#3BD16F;color:#05210F;border-radius:999px;padding:0 14px;font-size:22px">建議</span>' : ''}</div>${body}${pro ? `<div class="pro">👍 ${pro}</div>` : ''}${con ? `<div class="con">⚠️ ${con}</div>` : ''}</div>`;
/* ⏱ 換成自己畫的時鐘（指針會轉）；🚪 換成 👋（老師選了再換） */
const CLK = (sz) => `<svg viewBox="0 0 100 100" style="height:${sz};vertical-align:middle" aria-label="時鐘"><circle cx="50" cy="50" r="44" fill="#FFF8E6" stroke="#FFB300" stroke-width="8"/>${[0,90,180,270].map(a=>`<rect x="48" y="12" width="4" height="10" fill="#8A5A00" transform="rotate(${a} 50 50)"/>`).join('')}<rect x="47" y="24" width="6" height="28" rx="3" fill="#333" class="mh"/><rect x="47" y="34" width="6" height="18" rx="3" fill="#D84315" transform="rotate(60 50 50)"/><circle cx="50" cy="50" r="6" fill="#333"/></svg>`;
const TI = CLK('110px'), TIs = CLK('1.1em'), LO = '👋', LOb = '<span style="font-size:96px">👋</span>';
const DOOR = (sz) => `<svg viewBox="0 0 100 100" style="height:${sz};vertical-align:middle" aria-label="走出門"><rect x="12" y="8" width="46" height="84" rx="4" fill="#8D5524" stroke="#5D3A1A" stroke-width="4"/><circle cx="48" cy="52" r="4" fill="#FFD54A"/><path d="M58 50h30M74 36l14 14-14 14" fill="none" stroke="#3BD16F" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
let h = head.replace('<title>榮譽榜怎麼給</title>', '<title>再對一次 2</title>').replace('</style>', css + '</style></head><body><div class="wrap">');
h += `<h1>✅ 請老師再看一次（第 2 次）</h1>
<div class="lead">老師看完上一頁的 10 點修改，<b>下面都已經改進去了</b>。另外有 3 題要先問（有兩種意思或要挑圖示）。</div>
<table><tr><th>老師說的</th><th>改成</th></tr>
<tr><td>刪「每一題都看完、聽完才選。」</td><td>平板、表格、獎狀都刪了</td></tr>
<tr><td>刪「你還在 304 班 最認真練習 第 2 名」</td><td>名次沒變 ＝ 什麼都不演、不寫</td></tr>
<tr><td>「這週」和「練習 48 分鐘」空一格</td><td>「這週 練習 48 分鐘」；班級「平均每一個人 練習 35 分鐘」</td></tr>
<tr><td>「這一次 3 分鐘」</td><td>「這一次 練習 3 分鐘。」</td></tr>
<tr><td>「比上週多 4 分鐘」</td><td>「比上週多 練習 4 分鐘。」</td></tr>
<tr><td>太快亂按那三行太囉嗦、加「請」</td><td>「⚠️ 太快亂按，不算時間」＋「請 看完、聽完再選」</td></tr></table>`;
h += `<h2>❓ 第 1 題：⏱ 換成哪一個？（老師說不好看）</h2>`;
h += opt('A', `自己畫的時鐘（紅色指針）　${CLK('90px')}`, 1, '', '看起來就是「時間」，跟網站其他圖示同一種畫法', '');
h += opt('B', '<span style="font-size:80px">⌛</span> 沙漏', 0, '', '', '沙漏比較像「倒數、快沒時間了」，不像「練了多久」');
h += opt('C', '<span style="font-size:80px">🕒</span> 時鐘（電腦內建）', 0, '', '', 'iPad 和教室電腦畫出來的樣子不一樣');
h += opt('D', '不要圖示，只寫字', 0, '', '最乾淨', '');
h += `<h2>❓ 第 2 題：🚪（登出）換成哪一個？（老師說看不懂）</h2>`;
h += opt('A', '<span style="font-size:80px">👋</span> 揮手（再見）＋「登出」', 1, '', '學生一看就懂「再見、我要走了」', '');
h += opt('B', `自己畫的：門＋綠色箭頭往外　${DOOR('90px')}`, 0, '', '', '三四年級不一定看得懂「箭頭往外 ＝ 離開」');
h += opt('C', '不要圖示，只寫字「登出」', 0, '', '最乾淨', '');
h += `<h2>❓ 第 3 題：刪「請問 您還在嗎？」是哪一種？</h2>`;
h += opt('A', '只刪這一句，最後 30 秒的提醒畫面留著', 0, `<div class="mk one">${tab(`<div class="ic">⏳</div><div class="t2">30 秒後自動登出</div><div class="t2">${btn('👆 我還在', G)}</div>`, '3 分鐘沒動作：最後 30 秒')}</div>`, '在看東西、想事情的學生不會突然被登出', '');
h += opt('B', '整個提醒畫面都不要：3 分鐘沒動作，直接登出', 0, '', '最簡單', '正在看東西的學生也會被登出，要重打號碼');
h += `<div class="howto">✍️ 例：「<b>1A 2A 3A</b>」。下面 ①～⑦ 是用建議的圖示畫的。都對 ＝ 打「<b>對</b>」；哪裡不對 ＝ 寫「第幾區＋要改成什麼」。</div>`;

h += sec('①', '學生平板：小華這一次「第一次進榜」', mk(
  tab(`<div class="ic">${MSs}</div><div class="t1">最認真練習</div><div class="t2">304 班 第 2 名</div><div class="t3">這週 練習 48 分鐘</div>`, '學生平板（30412）：班內'),
  tab(`<div class="ic">${MSs}</div><div class="t1">最認真練習</div><div class="t2">三年級 第 4 名</div><div class="t3">這週 練習 48 分鐘</div>`, '學生平板（30412）：全年級')) +
  `<div class="why">名次沒有變（還是第 2 名）的時候：什麼都不演、不寫。</div>`);

h += sec('②', '學生平板：每一個人做完都看得到（不是獎）', mk(
  tab(`<div class="ic">${TI}</div><div class="t1">這週你已經練習 12 分鐘</div><div class="t3">這一次 練習 3 分鐘。</div>`, '學生平板（30412）'),
  tab(`<div class="ic">⚠️</div><div class="t1">太快亂按，不算時間</div><div class="t2">請 看完、聽完再選</div>`, '太快亂按的時候')) +
  mk(tab(`<div class="ic">🎯</div><div class="t1">正確率 80 分</div><div class="t2">${TIs} 這週你已經練習 9 分鐘</div><div class="t3">比上週多 練習 4 分鐘。</div>`, '沒上榜的學生（30720）：不演動畫')));

h += sec('③', '三種最高榮譽（個人、班級都一樣）', `<table><tr><th>獎</th><th>怎麼比</th><th>那一句話（例）</th></tr>
<tr><td>最認真練習</td><td>練習時間最多（太快亂按的不算）</td><td>這週 練習 48 分鐘。</td></tr>
<tr><td>成績最優</td><td>正確率最高（一樣多再比總分）</td><td>正確率 96 分：每一題都看清楚才選。</td></tr>
<tr><td>進步最多</td><td>正確率進步最多</td><td>正確率從 70 分進步到 92 分（多了 22 分）。</td></tr></table>
<div class="why">個人：304 班前 10 名、三年級前 10 名。班級：三年級 3 班（四年級 4 班）互相比。<br>拿掉：努力獎、天天練獎、時間獎、訂正獎、用心獎、成績獎、進步獎（做完幾乎都拿得到的小獎）。</div>`);

h += sec('④', '老師投影（每週一次）', mk(
  pj(`<div class="t1">🏆 本週 榮譽榜</div><div class="t2">304 班 最認真練習</div><div class="lst"><div>🥇 30405 陳小安　52 分鐘</div><div class="me">🥈 30412 小華　48 分鐘</div><div>🥉 30420 林小宇　41 分鐘</div></div>`),
  pj(`<div class="t1">🏆 本週 榮譽榜</div><div class="t2">三年級 最認真練習的班</div><div class="lst"><div class="me">🥇 304 班　平均每一個人 練習 35 分鐘</div><div>🥈 311 班　平均每一個人 練習 31 分鐘</div><div>🥉 307 班　平均每一個人 練習 28 分鐘</div></div>`, '老師投影：班級')));

h += sec('⑤', '印獎狀', mk(
  `<div class="cert"><div class="c1">榮 譽 狀</div><div class="c2">三年級 304 班 30412 小華</div><div class="c2">榮獲 304 班「<b>最認真練習</b>」第 2 名</div><div class="c3">這週 練習 48 分鐘。</div><div class="c3">2026 年 10 月 12 日</div></div>`,
  `<div class="cert"><div class="c1">榮 譽 狀</div><div class="c2">三年級 304 班</div><div class="c2">榮獲 三年級「<b>最認真練習的班</b>」第 1 名</div><div class="c3">平均每一個人 練習 35 分鐘：全班一起努力。</div><div class="c3">2026 年 10 月 12 日</div></div>`));

const hub = `<div style="text-align:left;font-size:24px;color:#B9C4CE;margin-top:8px">🏠 三年級｜四年級｜…（畫面照常，不蓋住）</div>`;
h += sec('⑥', '學生登入', mk(
  tab(bar(`👤 還沒登入 ${btn('🔑 登入', Y)}`) + hub, '總首頁、三年級、四年級首頁：還沒登入'),
  tab(bar(`請問 這是您嗎？<b>30412</b> ${btn('✅ 是', G)}${btn(LO + ' 不是，登出', R)}`) + hub, '登入了')) +
  mk(tab(`<div class="t1">請問 這是您嗎？</div><div class="ic" style="font-size:80px">30412</div><div class="t2">${btn('✅ 是，繼續', G)}${btn(LO + ' 不是，登出', R)}</div>`, '打開網站的第一頁（只問一次）'),
     tab(`<div class="ic">⏳</div><div class="t2">30 秒後自動登出</div><div class="t2">${btn('👆 我還在', G)}</div>`, '3 分鐘沒動作：最後 30 秒（看第 3 題）')) +
  mk(tab(`<div class="ic">${LOb}</div><div class="t1">已經登出了</div><div class="t3">3 分鐘沒有動作</div><div class="t2">${btn('🔑 登入', Y)}</div>`, '時間到'),
     tab(`<div class="ic">${LOb}</div><div class="t2">做完了，記得登出</div><div class="t3">下一個人才不會用到您的號碼</div><div class="t2">${btn(LO + ' 登出', R)}</div>`, '每一個題目、遊戲做完')));

h += sec('⑦', '在家複習：被鎖的主題（不寫哪幾班）', mk(
  tab(`<div class="ic">🔒</div><div class="t1">請先登入</div><div class="t2">${btn('🔑 登入', Y)}</div>`, '沒登入的時候'),
  tab(`<div class="ic">🔒</div><div class="t1">還沒開放</div>`, '登入了，自己的班被鎖')) +
  `<div class="why">沒被鎖的主題：照樣不用登入就能練。</div>`);

h += `<div class="ans">✍️ 都對 ＝ 打「<b>對</b>」。哪裡不對 ＝ 寫「第幾區＋要改成什麼」。</div></div></body></html>`;
fs.writeFileSync(process.argv[2], h);
console.log('ok', h.length);
