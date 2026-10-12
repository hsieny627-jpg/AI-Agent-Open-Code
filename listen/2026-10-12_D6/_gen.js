// 產生 listen/2026-10-12_D6/index.html（第 4 件修正：9 題大字選擇題）
const fs = require('fs'), SP = __dirname;
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
const opt = (k, title, rec, body, pro, con) => `<div class="opt${rec ? ' rec' : ''}"><div class="hd"><b class="k">${k}</b>${title}${rec ? ' <span class="tag" style="display:inline-block;background:#3BD16F;color:#05210F;border-radius:999px;padding:0 14px;font-size:22px">建議</span>' : ''}</div>${body}${pro ? `<div class="pro">👍 ${pro}</div>` : ''}${con ? `<div class="con">⚠️ ${con}</div>` : ''}</div>`;
const q = (n, title, lead) => `<h2>第 ${n} 題：${title}</h2>${lead ? `<div class="lead">${lead}</div>` : ''}`;

let h = head.replace('</style>', css + '</style></head><body><div class="wrap">');
h += `<h1>🏆 榮譽榜怎麼給？請老師挑 13 題</h1>
<div class="lead">老師說得對：<b>現在的網站「每一次做完都有獎」</b>，跟老師的意思不一樣。<br>
老師的意思（我的整理）：<b>最高榮譽只給真正付出、真正做到的人和班</b>——班內前 10 名、全年級前 10 名、最努力（最重要）、成績最優、進步最多。</div>
<div class="howto">✍️ 在對話裡打答案，例：「<b>全部照建議</b>」或「<b>1A 2A 3A 4A 5A 6A 7甲 8甲 9A 10A 11A 12A 13A</b>」。都不喜歡就寫老師想要的樣子。<br>
例子一律用 <b>小華（304 班 12 號 ＝ 30412）</b>。<b>學生平板上只有號碼，沒有姓名</b>（平板拿不到名單）；老師投影、獎狀才有姓名。<br>
答完以後，我會用「小華」再對一次給老師看，<b>對了才改網站</b>。</div>

<h2>📚 先看研究（每一篇都打開原文核對過）</h2>
<table class="ev"><tr><th>研究</th><th>發現</th><th>所以</th></tr>
<tr><td>Robinson、Gallus、Lee、Rogers（哈佛等，2018 工作論文；2021 刊登）<br>15,329 個 6～12 年級學生的實驗<br><span class="small">https://www.hks.harvard.edu/publications/demotivating-effect-and-unintended-message-awards</span></td>
<td>發「全勤獎」給學生，<b>學生後來反而更常缺席</b>。原因：獎讓學生以為「這件事大家都做不到，我已經比別人好了」</td>
<td>❌ 不要為「本來就該做的事」發獎（做完一次、沒亂按）➜ 這就是<b>安慰獎</b>的感覺<br>✅ 獎只給<b>真的比別人多</b>的</td></tr>
<tr><td>Gallus（2017，Management Science 63(12)）<br>維基百科新手編輯的實驗<br><span class="small">https://doi.org/10.1287/mnsc.2016.2540</span></td>
<td>沒有錢、只有名字的獎（只發給少數做得好的人），讓新手<b>留下來繼續付出</b>，效果維持一年</td>
<td>✅ 獎要<b>少</b>、要<b>真</b>，名字掛出來就有榮譽感</td></tr>
<tr><td>Corpus & Lepper（2007，Educational Psychology 27(4)）<br>93 個四、五年級學生<br><span class="small">https://doi.org/10.1080/01443410601159852</span></td>
<td>稱讚「<b>做了什麼、怎麼做的</b>」（例：你很仔細）比稱讚「你很棒、你很聰明」好；四、五年級的孩子已經會想「大人為什麼稱讚我」</td>
<td>✅ 那一句話寫<b>具體的事實和做法</b>（練了幾分鐘、從幾分進步到幾分），不寫空泛的好話</td></tr>
<tr><td>（第 4 件已核對）Deci 1999、Henderlong & Lepper 2002、Mueller & Dweck 1998、Sailer & Homner 2020</td>
<td>事先講好「做到就給」會傷害動機；稱讚努力和方法；個人＋班級合作最有效</td>
<td>✅ 班級榮譽照留；稱讚努力和方法</td></tr>
</table>
<div class="small">另外查到 Amemiya & Wang（2018）：國高中生聽到「你好努力」，有時候會以為「我能力不好才要這麼努力」。我只核對到摘要和報導、沒打開全文，所以<b>不拿來當證據</b>；但它也提醒我們：誇努力要寫「你做到了什麼」，不要只寫「你好努力」。</div>
`;

// 第 1 題
h += q(1, '「班際前 10 名」是什麼？', '三年級只有 304、307、311 三班；四年級 402、406、409、410 四班。所以「班際前 10 名」有兩種意思。');
h += opt('A', '全年級所有學生一起排前 10 名＋班級和班級另外比', 1,
  `<div class="mk">${tab(`<div class="ic">🏆</div><div class="t1">三年級 第 4 名</div><div class="t2">最努力</div><div class="t3">全年級約 90 人裡的第 4 名</div>`)}${pj(`<div class="t1">🏫 三年級 最努力的班</div><div class="lst"><div class="me">🥇 304 班　平均每人 35 分鐘</div><div>🥈 311 班　平均每人 31 分鐘</div><div>🥉 307 班　平均每人 28 分鐘</div></div>`, '老師投影（班級和班級比）')}</div>`,
  '小華可以跟全年級的人比；班級也有自己的榜', '');
h += opt('B', '只有班級和班級比（三年級只有 3 班）', 0,
  `<div class="mk one">${pj(`<div class="t1">🏫 三年級 最努力的班</div><div class="lst"><div class="me">🥇 304 班</div><div>🥈 311 班</div><div>🥉 307 班</div></div>`)}</div>`,
  '', '只有 3～4 班，「前 10 名」用不到；小華個人只有「班內前 10 名」');

// 第 2 題
h += q(2, '沒上榜的學生，做完以後看到什麼？', '例：307 班 20 號 ＝ 30720，這週練了 9 分鐘，沒有進任何一個前 10 名。');
h += opt('A', '不演榮譽動畫；看到自己的成績＋「跟上週的自己比」', 1,
  `<div class="mk one">${tab(`<div class="ic">🎯</div><div class="t1">正確率 80 分</div><div class="t2">⏱ 這週你已經練習 9 分鐘</div><div class="t3">比上週多 4 分鐘</div>`, '學生平板（30720）')}</div>`,
  '沒有安慰獎；只寫真的事實；跟自己比不會丟臉（研究：班上排名低的人看到名次會更沒自信）', '');
h += opt('B', '看到自己的成績＋「離本班第 10 名還差幾分鐘」', 0,
  `<div class="mk one">${tab(`<div class="ic">🎯</div><div class="t1">正確率 80 分</div><div class="t2">再練 6 分鐘，就能進 307 班最努力前 10 名！</div>`, '學生平板（30720）')}</div>`,
  '目標很清楚', '差很多的人（例：還差 60 分鐘）看了會想放棄');
h += opt('C', '只看自己的正確率，其他什麼都不寫', 0,
  `<div class="mk one">${tab(`<div class="ic">🎯</div><div class="t1">正確率 80 分</div>`, '學生平板（30720）')}</div>`, '最簡單', '看不到自己付出的時間');

// 第 3 題
h += q(3, '「最努力」怎麼算？', '老師說：努力最重要，例：付出最多練習時間。');
h += opt('A', '練習時間（這週加起來幾分鐘）', 1,
  `<div class="mk one">${pj(`<div class="t1">👤 304 班 最努力</div><div class="lst"><div>🥇 30405 陳小安　52 分鐘</div><div class="me">🥈 30412 小華　48 分鐘</div><div>🥉 30420 林小宇　41 分鐘</div></div>`)}</div>
  <div class="why">現在先算「作答的時間」；第 8 件（用心程度）做好以後，<b>看字卡、按聆聽的時間也加進去</b>。太快亂按的那一次不算。</div>`,
  '跟老師的話一樣；認真看、認真聽的人時間就多', '');
h += opt('B', '練習次數（這週做完幾次）', 0, '', '', '做很快、很短的也算 1 次；學生看不懂「次數」（老師已經說過）');
h += opt('C', '兩個都有：「最努力（時間）」和「練最多次」兩個榜', 0, '', '', '榜變多，獎就沒那麼珍貴');

// 第 4 題
h += q(4, '學生平板什麼時候演榮譽動畫？', '');
h += opt('A', '平板：「這一次」讓他第一次進榜或名次往上升，才演一次＋每週老師投影頒一次', 1,
  `<div class="mk">${tab(`<div class="ic">${MSs}</div><div class="t1">你進榜了！</div><div class="t2">304 班 最努力 第 2 名</div><div class="t3">這週練習 48 分鐘</div>`)}${pj(`<div class="t1">🏆 本週榮譽榜</div><div class="t2">304 班 最努力 第 2 名</div><div class="t1">30412 小華</div>`, '老師投影（每週一次，全班一起看）')}</div>
  <div class="why">名次沒變（還是第 2 名）＝ 平板不再演，只寫一行「你還在 304 班最努力第 2 名」。</div>`,
  '真的做到才演，所以每一次都珍貴；全班看的頒獎最隆重', '');
h += opt('B', '只有每週老師投影，平板做完不演', 0, '', '最隆重、最少', '學生做完當下不知道自己進榜了');
h += opt('C', '只要在前 10 名，每一次做完都演', 0, '', '', '同一個人一天看到好幾次，就會覺得獎不值錢');

// 第 5 題
h += q(5, '現在的 7 種小獎怎麼辦？', '現在：努力獎、進步獎、成績獎、訂正獎、天天練獎、時間獎、用心獎（做完幾乎都拿得到 ➜ 學生覺得像安慰獎）。');
h += opt('A', '7 種全部拿掉，只留 3 種最高榮譽（最努力、成績最優、進步最多），個人和班級都一樣', 1,
  `<div class="mk one"><table><tr><th></th><th>最努力</th><th>成績最優</th><th>進步最多</th></tr>
  <tr><td>個人</td><td>班內前 10 名、全年級前 10 名</td><td>班內前 10 名、全年級前 10 名</td><td>班內前 10 名、全年級前 10 名</td></tr>
  <tr><td>班級</td><td>班級和班級比</td><td>班級和班級比</td><td>班級和班級比</td></tr></table></div>
  <div class="why">訂正、天天練、沒有亂按：<b>不發獎</b>，老師看板照樣看得到（成績卡、要關心）。</div>`,
  '獎少才有榮譽感（研究：為本來就該做的事發獎，反而有反效果）', '');
h += opt('B', '拿掉 5 種，留「訂正」和「天天練」改個名字', 0, '', '', '這兩個大部分人都拿得到，還是像安慰獎');

// 第 6 題
h += q(6, '「成績最優」看哪一個？', '現在老師看板有兩個成績：🎯 正確率（答對幾成）、💯 總分（答對 60 ＋ 速度 40）。');
h += opt('A', '🎯 正確率；一樣多的時候再比總分', 1, '', '學生最懂；不會因為「按很快」就贏（不鼓勵亂按）', '');
h += opt('B', '💯 總分', 0, '', '', '速度占 40 分：會讓學生為了快而亂按');
h += opt('C', '兩個都有（兩個榜）', 0, '', '', '榜變多，獎就沒那麼珍貴');

// 第 7 題
const nm7 = (a, b, c, top) => `<div class="mk">${tab(`<div class="ic">${MSs}</div><div class="t1">${a}</div><div class="t2">304 班 第 2 名</div>`)}
${pj(`<div class="t1">🏆 ${b.replace(/ (第 \d 名)/,' <span class="nw">$1</span>')}</div><div class="t1">30412 小華</div>`, '老師投影')}
<div class="cert"><div class="c1">榮 譽 狀</div><div class="c2">三年級 304 班 30412 小華</div><div class="c2">榮獲 <b>${c}</b></div><div class="c3">這週練習 48 分鐘，特頒此狀</div></div>
${tab(`<div class="t2">個人 3 個獎：</div><div class="t1">${top}</div>`, '三個獎的名字')}</div>`;
h += q(7, '獎的名字（學生平板、老師投影、印獎狀三個地方一模一樣）', '要有榮譽感、像真的獎、三四年級一看就懂、不幼稚。');
h += opt('甲', '用老師的話＋名次：「最努力」「成績最優」「進步最多」', 1,
  nm7('最努力', '304 班 最努力 第 2 名', '304 班「最努力」第 2 名', '最努力｜成績最優｜進步最多'),
  '一看就懂做到了什麼；名次是真的，不是誰都拿得到；班級獎一樣叫「三年級最努力的班」', '');
h += opt('乙', '「之星」：「勤學之星」「卓越之星」「進步之星」', 0,
  nm7('勤學之星', '304 班 勤學之星 第 2 名', '304 班「勤學之星」', '勤學之星｜卓越之星｜進步之星'),
  '像學校朝會頒的獎', '「勤學」「卓越」三年級不一定懂；「進步之星」有些學生會覺得是安慰獎');
h += opt('丙', '「榜」：「勤學榜」「精熟榜」「進步榜」，第 1 名叫「榜首」', 0,
  nm7('勤學榜', '304 班 勤學榜 第 2 名', '304 班「勤學榜」第 2 名', '勤學榜｜精熟榜｜進步榜'),
  '像考試放榜，很正式', '「精熟」三年級看不懂');

// 第 8 題
h += q(8, '獎下面那一句話', '用小華的三個例子：這週練習 48 分鐘、正確率 96 分、正確率從 70 分進步到 92 分。');
h += opt('甲', '寫具體的事實＋做法（不寫空泛的好話）', 1,
  `<div class="mk one"><table><tr><th>最努力</th><td>這週練習 48 分鐘，每一題都看完、聽完才選。</td></tr><tr><th>成績最優</th><td>正確率 96 分：每一題都看清楚才選。</td></tr><tr><th>進步最多</th><td>正確率從 70 分進步到 92 分（多了 22 分）。</td></tr><tr><th>班級</th><td>304 班平均每一個人練習 35 分鐘：全班一起努力。</td></tr></table></div>`,
  '研究：稱讚「做了什麼、怎麼做」最有效；學生知道獎是真的', '');
h += opt('乙', '事實＋一句稱讚（例：「這週練習 48 分鐘。你的努力，全年級都看見了！」）', 0, '', '比較熱鬧', '四年級的學生可能覺得是客套話');
h += opt('丙', '只有數字（「48 分鐘」）', 0, '', '最短', '比較冷，沒有說明為什麼得獎');

// 第 9 題
h += q(9, '「練習次數 ＋1」換成什麼？', '學生看不懂「練習次數 ＋1」（之前的「算 1 次」也看不懂）。這一句會出現在<b>每一個人</b>做完的畫面（不是獎）。');
h += opt('A', '寫時間：「⏱ 這週你已經練習 12 分鐘（這一次 3 分鐘）」', 1,
  `<div class="mk">${tab(`<div class="ic">⏱</div><div class="t1">這週你已經練習 12 分鐘</div><div class="t3">這一次 3 分鐘</div>`)}${tab(`<div class="ic">⚠️</div><div class="t2">這一次太快亂按，<br>不算進練習時間</div><div class="t3">每一題看完、聽完再選</div>`, '太快亂按的時候')}</div>`,
  '跟「最努力 ＝ 練習時間」同一個標準；「分鐘」學生一看就懂', '');
h += opt('B', '寫次數：「✅ 這是你這週第 5 次練習」', 0, '', '', '跟最努力的標準（時間）不一樣，學生會搞混');
h += opt('C', '不寫', 0, '', '', '學生不知道自己付出了多少');


h += `<h2 style="color:#7FD4FF">第 10～12 題：第 6 件「學生登入」（已經決定：每個首頁最上面「這是你嗎？」、3 分鐘沒動作自動登出、做完提醒登出）</h2>
<div class="lead">下面三個地方有兩種意思，先問老師。</div>`;
const bar = (inner) => `<div style="background:#1A2A10;border:3px solid #3BD16F;border-radius:14px;padding:8px 12px;font-size:28px;text-align:left">${inner}</div>`;
const hub = `<div style="text-align:left;font-size:24px;color:#B9C4CE;margin-top:8px">🏠 總首頁：三年級｜四年級｜…（老師上課投影的畫面）</div>`;
h += q(10, '總首頁、三年級、四年級首頁「還沒登入」的時候', '這三頁老師上課也會投影。在家複習首頁、遊戲大廳、複習題前照現在：整頁大字「先登入」（在家可以〔👀 先練習〕，不記成績）。');
h += opt('A', '最上面一條大字橫幅，不蓋住畫面（老師照樣可以用）', 1,
  `<div class="mk">${tab(bar('👤 還沒登入　<b style="background:#FFD54A;color:#000;border-radius:10px;padding:2px 12px">🔑 登入</b>') + hub, '還沒登入')}${tab(bar('這是你嗎？<b>30412</b>　<b style="background:#3BD16F;color:#000;border-radius:10px;padding:2px 10px">✅ 是</b> <b style="background:#FF7A7A;color:#000;border-radius:10px;padding:2px 10px">🚪 不是，登出</b>') + hub, '登入了')}</div>`,
  '老師投影不會被擋住；學生一眼看到自己的號碼', '');
h += opt('B', '整頁蓋住「先登入」，要按〔👀 先看看〕才進得去', 0, '', '', '老師每次投影都要先按一下');

h += q(11, '「每次打開網站先問：這是你嗎？」是什麼時候問？', '');
h += opt('A', '平板打開網站的第一頁問一次（整頁大字）；之後換頁不再問，最上面一直寫「30412〔🚪 登出〕」', 1,
  `<div class="mk one">${tab(`<div class="t1">這是你嗎？</div><div class="ic" style="font-size:80px">30412</div><div class="t2"><b style="background:#3BD16F;color:#000;border-radius:12px;padding:4px 18px">✅ 是，繼續</b>　<b style="background:#FF7A7A;color:#000;border-radius:12px;padding:4px 18px">🚪 不是，登出</b></div><div class="t3">不是你 ＝ 上一個人忘了登出：按登出，再打你的號碼</div>`)}</div>`,
  '換人的時候一定會看到；同一個人換頁不會被一直打斷', '');
h += opt('B', '每換一頁都整頁問一次', 0, '', '', '一節課要按很多次「是」，學生會不看就按');

h += q(12, '「3 分鐘沒動作」自動登出：要不要先提醒？', '「沒動作」＝ 3 分鐘都沒有點、滑、打字（看動畫、聽聲音不算動作）。');
h += opt('A', '最後 30 秒先跳大字「還在嗎？〔👆 我還在〕」倒數，沒按才登出', 1,
  `<div class="mk">${tab(`<div class="ic">⏳</div><div class="t1">還在嗎？</div><div class="t2">30 秒後自動登出</div><div class="t2"><b style="background:#3BD16F;color:#000;border-radius:12px;padding:4px 18px">👆 我還在</b></div>`, '最後 30 秒')}${tab(`<div class="ic">🚪</div><div class="t1">已經登出了</div><div class="t3">3 分鐘沒有動作，保護 30412 的成績</div><div class="t2"><b style="background:#FFD54A;color:#000;border-radius:12px;padding:4px 18px">🔑 登入</b></div>`, '時間到')}</div>`,
  '在看答錯整理、想事情的學生不會突然被登出', '');
h += opt('B', '不提醒，3 分鐘到了直接登出', 0, '', '最簡單', '學生正在看東西也會被登出，要重打號碼');

h += `<h2 style="color:#7FD4FF">第 13 題：第 7 件〔🔒 開關〕（已經決定：一班一班開／鎖、在家複習每一個主題都能鎖、鎖上的連任務也打不開）</h2>`;
h += q(13, '在家複習：學生「沒登入」（按〔👀 先練習〕）的時候，被鎖的主題怎麼辦？', '例：老師只把 304 班的「Unit 2 句型」鎖上。網站要先知道你是哪一班，才知道要不要鎖。');
h += opt('A', '被任何一班鎖住的主題：沒登入就打不開，要先登入（登入後照你的班：304 鎖、307 照樣開）', 1,
  `<div class="mk">${tab(`<div class="ic">🔒</div><div class="t1">先登入</div><div class="t2">老師有鎖一些班的「Unit 2 句型」</div><div class="t3">登入以後就知道你的班能不能練</div><div class="t2"><b style="background:#FFD54A;color:#000;border-radius:12px;padding:4px 18px">🔑 登入</b></div>`, '沒登入')}${tab(`<div class="ic">🔒</div><div class="t1">304 班：老師還沒開放</div><div class="t2">「Unit 2 句型」</div>`, '登入 30412 以後')}</div>`,
  '鎖得住；沒被鎖的主題照樣不用登入就能練', '');
h += opt('B', '沒登入的人不管鎖，只有登入的人才被鎖', 0, '', '', '學生按〔👀 先練習〕就繞過老師的鎖');

h += `<div class="ans">✍️ 答完請打在對話裡，例：「<b>全部照建議</b>」或「<b>1A 2A 3A 4A 5A 6A 7甲 8甲 9A 10A 11A 12A 13A</b>」。<br>我會用小華再對一次，老師說「對」才改網站。</div></div></body></html>`;
fs.writeFileSync(process.argv[2], h);
console.log('ok', h.length);
