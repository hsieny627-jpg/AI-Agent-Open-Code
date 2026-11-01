/* tools/c45_page.js ➜ listen/2026-11-01_C45/index.html（第三十八次：給 老師 看、請 老師 回答）
 * node tools/c45_page.js   （語音 對照 表 讀 listen/2026-11-01_C45/au/_log.json，tools/c45_audio.py 做 的）*/
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), OUT = path.join(R, 'listen', '2026-11-01_C45');
const SC = require('../g3mid/_scenes.js'), e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = fs.readFileSync(path.join(R, 'listen', '2026-10-31_C44', 'index.html'), 'utf8'), css = T.slice(T.indexOf('<style>'), T.indexOf('</style>') + 8);
const src = (a, u, chk) => `<div class="src">${a}，<a href="${u}">${u}</a>${chk ? '' : '（這一次 沒有 打開 原文 核對 數字，所以 不寫 數字）'}</div>`;
/* ① 對話 圖：5 張 全部 放大 ＋ 我 審查 的 結果 */
const SAY = { thank: ['Thank you.', "You're welcome."], meet: ['Nice to meet you.', 'Nice to meet you, too.'], help: ["I can't find my dog.", 'I can help you.'], come: ['Come here.'], morn: ['Good morning.', 'Good morning.'] };
const CUE = { thank: '女生 把 🎁 禮物 遞給 男生、男生 冒 愛心', meet: '室內 紫色 牆＋門、兩個人 胸前 名牌、握手＋金色 光圈、兩個 笑臉 對話框', help: '女生 哭（眼淚）、想著 🐶＋紅色 ？、男生 舉手 拿 🔍 放大鏡', come: '男生 招手、張嘴 叫、🐶 從 右邊 跑 過來（速度 線）', morn: '戶外 日出 🌅、⏰ 鬧鐘 7:00、兩個 背 書包 的 小朋友 揮手' };
const RISK = [['meet ↔ morn', '都 是 打招呼', '已經 改過（第三十七次）：meet ＝ 室內＋名牌＋握手、不 揮手；morn ＝ 戶外 日出＋鬧鐘 7:00＋揮手', '🟢 分得出來'],
  ['help ↔ come', '兩張 都 有 🐶', 'help 的 狗 在「想」的 泡泡 裡（狗 不見 了）＋哭＋放大鏡；come 的 狗 真的 在 畫面 上 跑 過來', '🟡 低年級 可能 只看到 狗 ➜ 這 正是 鑑別度（要 聽懂 can’t find／help）'],
  ['thank ↔ meet', '兩個 小朋友 面對面、很 開心', 'thank 有 🎁 禮物 和 愛心；meet 有 握手 和 名牌', '🟢 分得出來'],
  ['morn ↔ 一般 Hello', '揮手 也 可能 是 Hi／Bye', '日出＋鬧鐘 7:00 ＝ 早上；題目 選項 裡 沒有 Hello／Goodbye 的 圖', '🟢 考 的 範圍 裡 不會 搞混']];
const pics = SC.KEYS.map(k => `<div class="pc"><div class="pv">${SC.svg(k)}</div><b>${e(k)}</b><div class="ps">${SAY[k].map(e).join('<br>')}</div><div class="pk">🔎 ${e(CUE[k])}</div></div>`).join('');
/* ⑤ 語音 對照 */
let au = []; try { au = JSON.parse(fs.readFileSync(path.join(OUT, 'au', '_log.json'), 'utf8')); } catch (x) { }
const auRows = au.slice(0, 200).map(x => `<tr><td>${e(x.t)}</td><td><audio controls preload="none" src="au/old_${e(x.f)}"></audio></td><td><audio controls preload="none" src="../../${e(x.d)}/${e(x.f)}"></audio></td><td>${x.ok ? '✅' : '⚠️ ' + e(x.heard)}</td></tr>`).join('');
const page = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第三十八次 請老師看 C45</title>${css}
<style>${SC.CSS}.pics{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}.pc{background:#0B0F14;border:3px solid #24303C;border-radius:18px;padding:10px;text-align:center}.pv svg{width:100%;height:auto;background:#fff;border-radius:12px}.pc b{font-size:28px;color:#FFE07A}.ps{font-size:26px;color:#BFF5D0}.pk{font-size:21px;color:#CFE3F5;font-weight:400}audio{width:180px}</style></head><body><div class="wrap">
<h1>💡 第三十八次：請老師看、請老師回答（C45）</h1>
<div class="box">這一頁：① 三年級 對話 圖 全部 給 您 審查　② 第 6 點：25 題 闖關 最多 幾次 完全 不同　③ 第 7 點：提早 結束 用 正確率 計分 的 細節　④ 第 8 點：5／8／10 分鐘　⑤ 語音（She’s、Yes、b／p、d／t）　⑥ 第 9 點：秒懂 動畫 這一次 照 研究 做 了 什麼。</div>

<h2>① 三年級 對話 圖（全部 5 張）：學生 分不分得出來？</h2>
<div class="pics">${pics}</div>
<table><tr><th>容易 搞混 的 兩張</th><th>為什麼 像</th><th>怎麼 分</th><th>我 審查 的 結果</th></tr>${RISK.map(r => '<tr>' + r.map(x => '<td>' + e(x) + '</td>').join('') + '</tr>').join('')}</table>
<div class="box ask"><span class="big">請 老師 看：</span>哪一張 您 覺得 學生 還是 會 看錯？請 寫 名字（例：help），我 再 改。都 可以 ＝ 寫「① 都可以」。</div>

<h2>② 第 6 點：🏠 25 題 闖關 最多 幾次 題目 完全 不一樣？</h2>
<table><tr><th>年級</th><th>題庫（只 用 全新 題，跟 考卷 100% 不一樣）</th><th>一次 用 幾題</th><th>完全 不一樣 最多</th></tr>
<tr><td>三年級</td><td>🔓 解碼 60 題（Unit 1：28、Unit 2：32）＋ 10 種 遊戲 88 題</td><td>解碼 8 題＋遊戲 17 題</td><td class="big">大約 5 次</td></tr>
<tr><td>四年級</td><td>🔓 解碼 56 題（Unit 1：20、Unit 2：36）＋ 12 種 遊戲 87 題</td><td>解碼 8 題＋遊戲 17 題</td><td class="big">大約 5 次</td></tr></table>
<div class="box">白話：學生 前 4～5 次 每一次 都是 沒 做過 的 題目；第 6 次 起，先出 最久 沒 做 的，才 會 遇到 做過 的（網站 本來 就 「做過 的 先 不出」）。</div>

<h2>③ 第 7 點：現場任務 提早 結束 ＝ 一律 用 正確率（已經 做好，要 重新 部署）</h2>
<table><tr><th>情況</th><th>以前</th><th>現在</th></tr>
<tr><td>25 題 只 答 10 題、對 9 題</td><td>9 ✕ 4 ＝ 36 分</td><td class="ok2">9 ÷ 10 ＝ <b>90 分</b></td></tr>
<tr><td>全部 25 題 答完、對 20 題</td><td>80 分</td><td>80 分（一樣）</td></tr>
<tr><td>兩人 輪流</td><td>各 算 各 的</td><td>各 算 各 的 正確率</td></tr>
<tr><td>排行榜 同分</td><td>—</td><td>正確率 一樣 ＝ <b>答對 比較 多 題 的 排 前面</b>（答 1 題 對 1 題 不會 贏過 答 10 題 對 10 題）</td></tr></table>
<div class="box warn"><span class="big">建議（請 老師 選）：</span>只 答 1～2 題 也 可能 拿 100 分。<br>甲（建議）大螢幕 排行榜、老師看板 旁邊 寫「答 N 題」，<b>答不到 5 題 的 不上 前 10 名 排行榜</b>（分數 照樣 記）。<br>乙 照 現在（不 限 題數）。</div>
${src('Adesope, Trevisan & Sundararajan（2017）練習 測驗 的 後設 分析，Review of Educational Research 87(3), 659–701', 'https://doi.org/10.3102/0034654316689306')}

<h2>④ 第 8 點：〔5 分鐘〕〔8 分鐘〕〔10 分鐘 作答〕（已經 做好）</h2>
<table><tr><th>什麼 時候 按</th><th>會 怎樣</th></tr><tr><td>開始 前</td><td>⚡ 快速 模式：秒懂 動畫 只 演 第 1 關；<b>這一班 最常 錯 的 3 關 先 出</b>（老師看板 錯題 分析 同 一份 資料）；分數 ＝ 正確率</td></tr>
<tr><td>作答 中（排行榜 下面）</td><td>從 現在 起 只 剩 5／8／10 分鐘，還沒 看 的 動畫 不 再 演</td></tr></table>
<div class="box">大約 做得到 幾題：5 分鐘 ≈ 8～10 題、8 分鐘 ≈ 12～15 題、10 分鐘 ≈ 15～20 題。理由：短時間 自己 想 答案（提取 練習）比 再看 一次 記得 久；分好幾天 短短 練 比 一次 練 很久 好。</div>
${src('Roediger & Karpicke（2006）Psychological Science 17(3), 249–255', 'https://doi.org/10.1111/j.1467-9280.2006.01693.x')}${src('Cepeda 等（2006）分散 練習 後設 分析，Psychological Bulletin 132(3), 354–380', 'https://doi.org/10.1037/0033-2909.132.3.354')}

<h2>⑤ 語音</h2>
<h3>She’s（第二句 開頭）、Yes, he is.：已經 重做（電腦 聽寫 一定 要 聽成 She’s／Yes 才 用）</h3>
<div class="box">原因：10/11 為了「Sh 不要 像 Ch」，在 Sh 開頭 淡入 0.09 秒，淡 太 多，Sh 幾乎 聽不到 ➜ 像 He。這一次 只 淡入 0.025 秒，而且 電腦 聽寫 一定 要 聽成 She’s。左邊 舊、右邊 新（已經 換 進 四年級 複習），請 老師 戴 耳機 聽 幾句。</div>
<table><tr><th>句子</th><th>舊</th><th>新（網站 上 的）</th><th>電腦 聽寫</th></tr>${auRows || '<tr><td colspan="4">（語音 還在 做）</td></tr>'}</table>
<h3>b／p、d／t 字首音：這一次 沒有 換（說 實話）</h3>
<div class="box warn">我 量 了：語音 模型 唸 的 p、t 送氣（吹氣）很 短，有時候 電腦 聽寫 把 pat 聽成 hat／pet、pot 聽成 hot；試了 在 音標 加「送氣」記號，結果 時好時壞（pin 變成 bin、ten 變成 Chen）。<b>沒有 把握 比 現在 好，所以 沒有 換。</b><br>
建議（請 老師 選）：<br>甲（建議）我 用 兩種 方法 各 做 一份 試聽頁（A 加長 吹氣 那一小段、B 換 女聲 慢 0.6 ＋ 電腦 聽寫 每一個 都 對），老師 戴 耳機 選 號碼 才 換。<br>乙 老師 自己 錄 p、t、b、d 開頭 的 字（手機 錄音 傳 給 我），我 切好 放進 網站（最 準）。</div>
${src('Lisker & Abramson（1964）英文 p、t、k 送氣（VOT）的 經典 量測，Word 20(3), 384–422', 'https://doi.org/10.1080/00437956.1964.11659830')}

<h2>⑥ 第 9 點：秒懂 複習 動畫 這一次 照 研究 改 了 什麼</h2>
<table><tr><th>改 了 什麼</th><th>研究</th></tr>
<tr><td>突擊 測驗 <b>只 在 那一頁 唸完 兩次</b> 以後 才 出，考 的 就是 剛剛 那一頁（題目 上面 寫「📍 考 剛剛 第 N 頁 的 重點」），不 打斷 學生 看</td><td>分段 呈現（segmenting）：一段 看完 再 停 下來 想，學得 比較 好</td></tr>
<tr><td>英文 What／Who／Is 框 起來 ➜ 箭頭 ➜ 中文「什麼／誰／嗎」框 起來；字首 字母 框 起來 放大；資料表 關鍵字 不同 顏色；唸到 哪 個 字 那個 字 亮</td><td>提示（signaling）：把 重點 標 出來，學習 比較 好</td></tr>
<tr><td><b>答對 也 給 一頁</b>：正確 答案、逐字 中文、整句、唸 一次（猜對 的 學生 也 學到）</td><td>回饋 對「沒 把握 但 答對」的 題目 特別 有用</td></tr>
<tr><td>四線格 一筆 一筆 畫 字母、頂天 立地、大寫 住 一樓 二樓、拒絕屁股歪</td><td>先 見 林（整體 概念）再 見 樹</td></tr></table>
${src('Rey 等（2019）分段 呈現 的 後設 分析，Educational Psychology Review 31, 389–419', 'https://doi.org/10.1007/s10648-018-9456-4')}${src('Schneider, Beege, Nebel & Rey（2018）提示（signaling）的 後設 分析，Educational Research Review 23, 1–24', 'https://doi.org/10.1016/j.edurev.2017.11.001')}${src('Butler, Karpicke & Roediger（2008）回饋 讓「沒 把握 但 答對」的 題目 記得 更 久，JEP: Learning, Memory, and Cognition 34(4), 918–928', 'https://doi.org/10.1037/0278-7393.34.4.918')}${src('Luiten, Ames & Ackerson（1980）前導 組織（先 見 林）的 後設 分析，American Educational Research Journal 17(2), 211–218', 'https://doi.org/10.3102/00028312017002211')}

<div class="box ask"><span class="big">📋 回答 範例（照著 打）</span><br>C45：① 都可以（或 寫 名字）　③ 甲　⑤ 甲（或 乙）</div>
</div></body></html>`;
fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, 'index.html'), page); console.log('listen/2026-11-01_C45/index.html ok（語音 ' + au.length + ' 句）');
