// 產生 listen/2026-10-12_D9/index.html（D 組第 8 件 👆 用心程度：有兩種意思的 3 題，先問老師）
const fs = require('fs'), SP = __dirname + '/../2026-10-12_D6';
const head = fs.readFileSync(SP + '/head.html', 'utf8').replace(/\n<style>\n/, '\n');
const css = `
.mk{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}.mk.one{grid-template-columns:1fr}
@media (max-width:900px){.mk{grid-template-columns:1fr}}
.dev{border:6px solid #3A4650;border-radius:26px;background:#000;padding:10px 12px 14px;text-align:center}
.dev.pj{border-color:#5B4A12;border-radius:8px}
.dev .lab{font-size:22px;color:#B9C4CE;text-align:left;margin-bottom:6px}
.dev .t1{font-size:34px;color:#FFE07A;line-height:1.3}.dev .t2{font-size:26px;color:#fff;line-height:1.4}.dev .t3{font-size:22px;color:#CFE3F5;line-height:1.4}
.bars5{display:grid;gap:8px;text-align:left;max-width:560px;margin:8px auto}
.bars5 div{display:grid;grid-template-columns:8.5em 1fr 3.2em;gap:10px;align-items:center;font-size:22px}
.bars5 i{display:block;height:22px;border-radius:999px;background:linear-gradient(90deg,#3BD16F,#9BE7B5)}
.bars5 .lo i{background:linear-gradient(90deg,#FF7A7A,#FFB4B4)}
.ev td,.ev th{font-size:22px;overflow-wrap:anywhere}
@media (max-width:900px){.ev,.ev tbody,.ev tr,.ev td,.ev th{display:block;width:100%}.ev tr:first-child{display:none}.ev tr{margin-bottom:12px}}
.ans{background:#1A1400;border:4px solid #FFD54A;border-radius:20px;padding:14px 20px;margin:30px 0;font-size:28px}
`;
const opt = (k, title, rec, body, pro, con) => `<div class="opt${rec ? ' rec' : ''}"><div class="hd"><b class="k">${k}</b>${title}${rec ? ' <span class="tag" style="display:inline-block;background:#3BD16F;color:#05210F;border-radius:999px;padding:0 14px;font-size:22px">建議</span>' : ''}</div>${body}${pro ? `<div class="pro">👍 ${pro}</div>` : ''}${con ? `<div class="con">⚠️ ${con}</div>` : ''}</div>`;
const dev = (inner, lab) => `<div class="dev"><div class="lab">${lab}</div>${inner}</div>`;
const card5 = `<div class="t1">👆 用心程度 82 分</div><div class="bars5">
<div><span>📅 分天練</span><i style="width:100%"></i><b>20</b></div>
<div><span>📝 自己考自己</span><i style="width:80%"></i><b>16</b></div>
<div class="lo"><span>🐢 不亂按</span><i style="width:40%"></i><b>8</b></div>
<div><span>✨ 訂正</span><i style="width:95%"></i><b>19</b></div>
<div><span>🕒 真的在練</span><i style="width:95%"></i><b>19</b></div></div><div class="t3">🌱 要加油：🐢 不亂按</div>`;
let h = head.replace('<title>榮譽榜怎麼給</title>', '<title>用心程度怎麼做</title>').replace('</style>', css + '</style></head><body><div class="wrap">');
h += `<h1>❓ 第 8 件「👆 用心程度」：先問老師 3 題</h1>
<div class="lead">第 4 件修正、第 6 件學生登入、第 7 件〔🔒 開關〕已經做好了。第 8 件有 3 個地方有兩種意思，<b>老師選好才動手</b>。</div>`;
h += `<h2>❓ 第 1 題：「👆 用心程度」給誰看？</h2>
<div class="why">之前（D17）說「最用心的人上榮譽榜」；後來老師定案「榮譽只有三種：最認真練習、成績最優、進步最多」。兩句話不一樣，所以要問。</div>`;
h += opt('A', '只給老師看（不多一種獎）', 1, `<div class="mk">${dev(card5, '📺 老師看板：點一個學生 ＝ 成績卡多一塊')}${dev('<div class="t2">🔔 要關心：每一格多寫</div><div class="t1">👆 82</div><div class="t3">最弱：🐢 不亂按</div>', '📺 老師看板：🔔 要關心')}</div>`, '榮譽還是只有三種，跟老師定案的一樣', '學生看不到自己的用心分數');
h += opt('B', '多一種最高榮譽「最用心」（班內前 10 名、全年級前 10 名）', 0, `<div class="mk">${dev('<div class="t1">最用心</div><div class="t2">304 班 第 3 名</div><div class="t3">用心程度 92 分</div>', '📱 學生平板＋📺 投影＋🖨 獎狀')}</div>`, '學生也看得到', '榮譽變成四種');
h += `<h2>❓ 第 2 題：看字卡、按 🔊 聆聽，要不要記下來？</h2>
<div class="why">現在「練習時間」只算作答的秒數。老師之前說「真的付出時間：字卡和聽力和答題」都要算。</div>`;
h += opt('A', '要記：登入的學生看句型卡、單字卡，翻一張、按一次 🔊 都記下來', 1, `<table class="ev"><tr><th>記什麼</th><th>算進哪裡</th></tr>
<tr><td>看了幾張卡、按了幾次 🔊、看了幾分鐘（一張卡停超過 2 分鐘只算 2 分鐘，開著不動不算）</td><td>🕒 練習時間（＝ 最認真練習也算進去）、👆 用心程度</td></tr></table>`, '只看卡、聽發音的學生，努力也看得見', '在家複習也要登入才記得到（沒登入照樣能看，只是不記）');
h += opt('B', '不記：練習時間只算作答', 0, '', '最簡單', '只看卡、聽發音的學生，努力看不見');
h += `<h2>❓ 第 3 題：五項（各 20 分，加起來 100 分）這樣算可以嗎？</h2>
<div class="why">D17 原本寫「合格 5 次」；後來老師定案「做完就算，不用對 2/3」，所以「合格」改成「做完」。</div>
<table class="ev"><tr><th>項目</th><th>怎樣拿滿 20 分</th><th>沒滿怎麼算</th></tr>
<tr><td>📅 分天練</td><td>這週有 4 天以上練習</td><td>少 1 天 −5 分</td></tr>
<tr><td>📝 自己考自己</td><td>這週做完 5 次以上（複習題＋遊戲；太快亂按超過一半的不算）</td><td>少 1 次 −4 分</td></tr>
<tr><td>🐢 不亂按</td><td>太快亂按 0%</td><td>每多 5% 扣 4 分</td></tr>
<tr><td>✨ 訂正</td><td>答錯的題目，後來都改對了（沒有答錯 ＝ 20 分）</td><td>改對幾成 ＝ 20 ✕ 幾成</td></tr>
<tr><td>🕒 真的在練</td><td>這週 30 分鐘以上（第 2 題選 A ＝ 看卡、聽發音也算）</td><td>15 分鐘 ＝ 10 分（照比例）</td></tr></table>
<div class="small">每一項的研究證據（Cepeda 2006 分天練、Roediger 2006 自己考自己、Wise & Kong 2005 太快亂按、Hattie & Timperley 2007 訂正、Fredricks 2004 投入時間）動手前會一篇一篇打開原文核對；核對不過的那一項，先拿來問老師再換。</div>`;
h += opt('A', '照上面這張表', 1, '', '', '');
h += opt('B', '我要改（寫「哪一項 ➜ 改成什麼」）', 0, '', '', '');
h += `<div class="ans">✍️ 例：「<b>1A 2A 3A</b>」。看不懂哪一題，直接說「第幾題看不懂」。</div></div></body></html>`;
fs.writeFileSync(process.argv[2], h);
console.log('ok', h.length);
