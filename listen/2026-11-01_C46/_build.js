/* listen/2026-11-01_C46/_build.js — 第三十九次：請老師看 C46（node listen/2026-11-01_C46/_build.js）
 * 語音：tools/bpdt_ab.py 做 的 au/*_A.mp3、au/*_B.mp3、au/_res.json；舊 ＝ 網站 現在 的 midterm/audio/m1 */
const fs = require('fs'), path = require('path');
const D = __dirname, ROOT = path.join(D, '..', '..');
const RES = JSON.parse(fs.readFileSync(path.join(D, 'au', '_res.json'), 'utf8'));
const M = JSON.parse(/=(\{.*\});/.exec(fs.readFileSync(path.join(ROOT, 'midterm', 'audio', 'm1', 'aud.js'), 'utf8'))[1]);
const NB = require(path.join(ROOT, 'sentences', '_nametag.js'));
const ZH = { bag: '包包', bell: '鈴', box: '盒子', ball: '球', dog: '狗', doll: '娃娃', door: '門', desk: '書桌', pen: '筆', pig: '豬', panda: '貓熊', pot: '鍋子', ten: '十', tiger: '老虎', tent: '帳篷', toy: '玩具' };
const yn = b => b ? '<span class="ok2">✅</span>' : '<span class="no2">❌</span>';
const nA = Object.values(RES).filter(r => r.asrAok).length, nB = Object.values(RES).filter(r => r.asrBok).length, n0 = Object.values(RES).filter(r => r.asr0ok).length;
const rows = Object.keys(RES).map(w => { const r = RES[w];
  return `<tr><td><b class="w">${w}</b><br><small>${ZH[w]}</small></td>
<td><audio controls preload="none" src="../../midterm/audio/m1/${M[w][0]}"></audio><br>${yn(r.asr0ok)} <small>${esc(r.asr0)}</small></td>
<td><audio controls preload="none" src="au/${w}_A.mp3"></audio><br>${yn(r.asrAok)} <small>${esc(r.asrA)}</small>${r.votA && r.votA[0] !== r.votA[1] ? `<br><small class="vt">吹氣 ${r.votA[0]} ➜ ${r.votA[1]} 毫秒</small>` : w[0] === 'b' || w[0] === 'd' ? '<br><small class="vt">b、d 不 動（跟 舊 一樣）</small>' : '<br><small class="vt">吹氣 已經 夠（不 動）</small>'}</td>
<td><audio controls preload="none" src="au/${w}_B.mp3"></audio><br>${yn(r.asrBok)} <small>${esc(r.asrB)}</small><br><small class="vt">女聲 慢 ${r.spdB}</small></td></tr>`; }).join('');
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
const SK = [['🚂', '解碼 列車', '格子 ＝ 車廂（有 輪子）、下面 鐵軌、最 前面 火車頭；過關 ＝ 火車頭 跳、冒 💨'], ['🚀', '太空艙 發射', '格子 ＝ 圓 艙門＋小 燈、星空 底；過關 ＝ 🔥 噴 出來'],
  ['💎', '寶石 鑲嵌', '格子 ＝ 金 底座、方塊 ＝ 切面 寶石；過關 ＝ ✨ 閃'], ['⌨️', '魔法 鍵盤', '方塊 ＝ 鍵帽（按 下去 會 凹）；過關 ＝ 🎵'], ['🍣', '迴轉 壽司', '格子 ＝ 盤子、方塊 ＝ 壽司；過關 ＝ 🍙'],
  ['🧱', '積木 城堡', '方塊 ＝ 有 凸點 的 積木；過關 ＝ ⭐'], ['🫧', '海底 泡泡', '格子 ＝ 泡泡、海底 底色；過關 ＝ 🐠 游 出來'], ['🃏', '魔法 卡牌', '方塊 ＝ 紫色 卡牌；過關 ＝ 卡片 翻 一圈']];
const G = Array.from({ length: 10 }, (_, i) => 57 + i), GN = ['Forest Warden', 'Lightning Striker', 'Aurora Paladin', 'Amethyst Guard', 'Terra Warden', 'Glacial Knight', 'Astral Sentinel', 'Gale Blade', 'Earth Vanguard', 'Solar Paladin'];
const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第三十九次 請老師看 C46</title><style>
:root{color-scheme:dark}*{box-sizing:border-box}
body{margin:0;background:#05070A;color:#fff;font-family:"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 140px;font-size:26px;line-height:1.6;font-weight:700}
.wrap{max-width:1180px;margin:0 auto}h1{font-size:42px;color:#FFD54A;margin:22px 0 6px}
h2{font-size:36px;color:#FFD54A;margin:56px 0 10px;border-top:4px solid #24303C;padding-top:22px}h3{font-size:30px;color:#7FD4FF;margin:26px 0 6px}
.box{background:#0B0F14;border:3px solid #24303C;border-radius:22px;padding:16px 20px;margin:18px 0}.ok{background:#0D1B12;border-color:#3BD16F}.ask{background:#0B1630;border-color:#7FD4FF}.warn{background:#1B1406;border-color:#FFB300}
table{border-collapse:collapse;width:100%;margin:10px 0}td,th{border:2px solid #2A3540;padding:8px 12px;text-align:left;vertical-align:top;word-break:break-word}th{background:#14202B;color:#CFE6FF}
.src{font-size:20px;color:#BFD3E6;font-weight:400;line-height:1.5}.src a{color:#7FD4FF;word-break:break-all}.big{font-size:32px;color:#FFE07A}
.ok2{color:#5BE38A}.no2{color:#FF9A9A}.w{font-size:34px}.vt{color:#9FB2C4}audio{width:190px;max-width:100%}small{font-size:20px}
.k{display:inline-block;background:#FFD54A;color:#05070A;border-radius:12px;padding:0 12px;margin-right:8px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}.cards div{background:#0B0F14;border:3px solid #24303C;border-radius:16px;padding:8px;text-align:center;font-size:22px}.cards img{width:100%;border-radius:10px;display:block}
.nb{display:flex;gap:40px;align-items:flex-end;justify-content:center;flex-wrap:wrap;font-size:150px;line-height:1;background:#1A1030;border-radius:22px;padding:20px}.nb div{text-align:center}.nb small{display:block;font-size:22px;margin-top:8px}
@media (max-width:700px){body{font-size:22px}h1{font-size:32px}h2{font-size:28px}table{display:block;overflow-x:auto}.nb{font-size:100px}}
.box,.src,p{overflow-wrap:anywhere}
</style></head><body><div class="wrap">
<h1>💡 第三十九次：請老師看、請老師回答（C46）</h1>
<div class="box">這一頁：① b／p、d／t 語音 試聽（C45 ⑤ 甲）　② 突擊 題 拿掉 了＋我 的 建議（第 2 點）　③ 拖曳 題 新 玩法（第 1 點）　④ name 新 圖示（第 3 點）　⑤ 女戰士 ★ 基本（第 4 點）　⑥ C45 ③ 甲 做好 了。</div>

<h2>① b／p、d／t 字首音：舊、A、B 三種 請 老師 戴 耳機 聽</h2>
<div class="box"><span class="k">A</span>網站 <b>現在 的 男聲 檔 不動</b>，只 在 p、t 後面 <b>補上「吹氣」</b>（我 量 了：現在 的 pen、pig 幾乎 沒有 吹氣，只 有 25～40 毫秒）➜ 大約 85 毫秒。b、d 跟 舊 的 一模一樣。<br>
<span class="k">B</span>換 <b>女聲、慢 0.6</b>（電腦 聽寫 聽錯 ＝ 換 速度 再 試）。<br>
電腦 聽寫（Whisper）聽 對 幾個：<b>舊 ${n0} ／ 16　A ${nA} ／ 16　B ${nB} ／ 16</b>（tent 的 舊 和 A 聽寫 寫成「tent, tent, tent…」＝ 電腦 自己 重複，聲音 其實 是 tent）</div>
<table><tr><th>字</th><th>舊（網站 現在）</th><th>A 補 吹氣</th><th>B 女聲 慢</th></tr>${rows}</table>
<div class="box ask"><b>我 建議 A</b>：只 改 p、t 的 那 一口 氣，其他 都 跟 學生 聽慣 的 一樣；B 有 ${16 - nB} 個 電腦 聽錯（例如 toy 聽成 boy、pig 聽成 pay），換 聲音 反而 容易 混。<br>
請 老師 回答：<b>⑤ A</b>／<b>⑤ B</b>／<b>⑤ 舊</b>（也 可以 只 換 幾個 字，例：⑤ A：pen pig）。老師 選了 才 換 進 網站。</div>
<div class="src">研究：英文 字首 p、t 的 送氣（VOT）比 b、d 長 很多，是 聽 出 p／b、t／d 的 主要 線索 ── Lisker & Abramson（1964），Word 20(3), 384–422，<a href="https://doi.org/10.1080/00437956.1964.11659830">https://doi.org/10.1080/00437956.1964.11659830</a>（這一次 沒有 打開 原文 核對 數字，所以 不寫 數字）</div>

<h2>② 第 2 點：秒懂 複習 動畫 的 突擊 題 ── 已經 全部 先 拿掉</h2>
<div class="box ok">✅ 三年級、四年級 的 <b>25 題 闖關、25／50 題、新 25／新 50、⚡ 現場任務</b>：秒懂 動畫 照樣 演（教 重點），<b>一題 突擊 題 都 不 跳出來</b>；開場 不 再 說「會 跳出 突擊 測驗」、看完 不 再 算 答對 幾題、兩人 輪流 的 說明 也 拿掉 那一句。<br>
題目 和 程式 都 留著（一個 開關），以後 要 加 回來 只 要 打開。</div>
<div class="box ask"><b>我 的 建議</b>（請 老師 選，可以 選 好幾個）：<br>
<span class="k">甲</span>（建議）<b>就 這樣 不 加 回來</b>：動畫 後面 的 正式 題目 本身 就是「考考 自己」（提取 練習），學 得 一樣 好；再 加 突擊 題 ＝ 同一個 重點 考 兩次，變長、變 悶。<br>
<span class="k">乙</span>以後 想 加：<b>每 一部 只 1 題、放在 動畫 最後、不 計分</b>（不 打斷、不 緊張）。<br>
<span class="k">丙</span><b>動畫 變短</b>：同一位 學生 第一次 看 ＝ 完整（唸 兩遍）；第二次 以後 ＝ 每一頁 只 唸 一遍（大約 短 一半，沒有 跳過 鍵，還是 看得到 全部 重點）── 會 的 學生 不 用 再 等，低成就 的 學生 第一次 照樣 完整 學。<br>
請 老師 回答：<b>② 甲</b>／<b>② 乙</b>／<b>② 丙</b>／<b>② 甲＋丙</b>。</div>
<div class="src">研究（這一次 都 沒有 打開 原文 核對 數字，所以 不寫 數字）：<br>
・課堂 小考（提取 練習）有效，但 是 加在 學習 之後：Yang 等（2021）系統性 回顧＋後設分析，Psychological Bulletin 147(4), 399–435，<a href="https://doi.org/10.1037/bul0000309">https://doi.org/10.1037/bul0000309</a><br>
・測驗 效應 後設分析：Rowland（2014），Psychological Bulletin 140(6), 1432–1463，<a href="https://doi.org/10.1037/a0037559">https://doi.org/10.1037/a0037559</a><br>
・「已經 會 的 人 再看 一樣 的 詳細 說明，效果 變 差」（專精 反轉 效應）：Kalyuga, Ayres, Chandler & Sweller（2003），Educational Psychologist 38(1), 23–31，<a href="https://doi.org/10.1207/S15326985EP3801_4">https://doi.org/10.1207/S15326985EP3801_4</a></div>

<h2>③ 第 1 點：拖曳 題 不 無聊（已經 做好）</h2>
<div class="box">放在：<b>🔓 句子 解碼</b>（三年級、四年級、25 題 闖關、現場任務）、三年級 <b>🌱 皮克敏 搬字</b>、<b>📋 資料表 小幫手</b>（全部 有 拖曳 的 題目）。秒懂 教學 不 加。</div>
<h3>🎁 神秘 寶箱（每一題 隨機 1 個 方塊 背 寶箱）</h3>
<table><tr><th>寶箱</th><th>多 常 出現</th><th>打開 會 拿到（隨機 一種）</th></tr>
<tr><td>🟫 木頭</td><td>55%</td><td>🪙 ＋200、🪙 ＋300、🔦 透視 一格、🛡 盾牌（放錯 一次 連對 不 斷）</td></tr>
<tr><td>⚪ 銀</td><td>28%</td><td>🪙 ＋400、🔥 這一題 ✖2、🔦 透視 一格、🛡 盾牌</td></tr>
<tr><td>🟡 金</td><td>13%</td><td>🪙 ＋800、🪙 ＋600、🔥 這一題 ✖2</td></tr>
<tr><td>💎 彩虹（一 出現 就 是 彩虹 光）</td><td>4%</td><td>🌈 這一題 ✖3、🪙 ＋1500</td></tr></table>
<div class="box">放對 格子 ＝ 寶箱 <b>搖一搖 ➜ 蓋子 掀開 ➜ 金光 ＋ 金幣 噴 出來 ➜ 大字 獎品</b>（打開 的 1.5 秒 <b>倒數 停住</b>，不 吃 作答 時間）；放錯 ＝ 不 打開。<br>
🔦 透視 ＝ 一個 還沒 放對 的 格子，<b>正確 的 中文 淡淡 出現 1 秒</b>。皮克敏、資料表 只 給 🪙（那兩個 遊戲 沒有 解碼 積分）。<br>
<b>公平</b>：寶箱 只 給 <b>遊戲 積分</b>（🔓 解碼 積分、🎁 寶箱 金幣），<b>老師看板 的 100 分 只 看 放對 幾個</b>，不會 因為 運氣 變多 或 變少。</div>
<h3>🧩 每一題 換 一種 樣子（8 種 輪流，每一回 從 不同 的 一種 開始）</h3>
<table><tr><th>樣子</th><th>學生 看到</th></tr>${SK.map(s => `<tr><td>${s[0]} ${s[1]}</td><td>${s[2]}</td></tr>`).join('')}</table>
<div class="box">放對／放錯 的 <b>綠色／紅色</b> 永遠 最 清楚（樣子 不會 蓋掉）；格子 和 字 的 大小 不變。</div>
<h3>➕ 我 另外 加 的（老師 說「請 再 加上 您 建議 的」）</h3>
<table><tr><th>元素</th><th>學生 看到</th><th>為什麼</th></tr>
<tr><td>👻 跟 自己 的 影子 賽跑</td><td>上面 寫「👻 影子 每格 2.4 秒」（＝ 你 前 5 題 的 平均）；這一題 比 影子 快 ＝「👻 超越 影子！＋200」</td><td>只 跟 自己 比，不 跟 同學 比（低成就 學生 也 能 一直 進步、一直 贏）</td></tr>
<tr><td>💎 寶箱 稀有度</td><td>木 ➜ 銀 ➜ 金 ➜ 彩虹，愈 稀有 獎品 愈 好</td><td>不 知道 會 拿到 什麼 ＝ 每一題 都 有 期待</td></tr>
<tr><td>🎉 每一種 樣子 自己 的 過關 特效</td><td>全部 放對 ＝ 那一種 樣子 的 東西 噴 出來（💨🔥✨🎵🍙⭐🐠🌟）</td><td>每一題 的 驚喜 不一樣，不 膩</td></tr></table>
<div class="src">研究（這一次 都 沒有 打開 原文 核對 數字，所以 不寫 數字）：<br>
・遊戲化 對 學習 的 後設分析（有 故事、有 挑戰 的 效果 比較 好）：Sailer & Homner（2020），Educational Psychology Review 32, 77–112，<a href="https://doi.org/10.1007/s10648-019-09498-w">https://doi.org/10.1007/s10648-019-09498-w</a><br>
・「不 確定 會 拿到 多少」讓 學生 更 投入：Howard-Jones & Demetriou（2009），Instructional Science 37, 519–536，<a href="https://doi.org/10.1007/s11251-008-9073-6">https://doi.org/10.1007/s11251-008-9073-6</a>；Ozcelik, Cagiltay & Ozcelik（2013），Computers & Education 67, 12–20，<a href="https://doi.org/10.1016/j.compedu.2013.02.009">https://doi.org/10.1016/j.compedu.2013.02.009</a><br>
・跟 自己 的 最佳 紀錄 比（personal best）和 投入、成績 有關：Martin & Liem（2010），Learning and Individual Differences 20(3), 265–270，<a href="https://doi.org/10.1016/j.lindif.2010.01.001">https://doi.org/10.1016/j.lindif.2010.01.001</a><br>
・沒有 事先 說好、意外 的 獎勵 不會 降低 內在 動機（後設分析）：Deci, Koestner & Ryan（1999），Psychological Bulletin 125(6), 627–668，<a href="https://doi.org/10.1037/0033-2909.125.6.627">https://doi.org/10.1037/0033-2909.125.6.627</a></div>
<div class="box ask">不 喜歡 哪一個，寫 名字 就 拿掉（例：③ 拿掉 🔦 透視、③ 拿掉 🍣）。都 可以 ＝「③ 都可以」。</div>

<h2>④ 第 3 點：What’s your name? 秒懂 動畫 的 name 圖示</h2>
<div class="nb"><div>📛<small>舊（📛 在 很多 平板 看起來 像 一朵 火焰／鬱金香）</small></div><div>${NB.BADGE('?')}<small>新：問 名字（?）</small></div><div>${NB.BADGE('Chloe')}<small>新：My name is Chloe.</small></div></div>
<div class="box">新 ＝ <b>掛 在 脖子 上 的「HELLO my name is」名牌</b>（藍色 掛繩、金屬 夾子、透明 套子、紅色 HELLO、手寫 名字）。用 在 三年級 秒懂 複習 動畫 3 頁（問名字、my 和 your、問名字 ➜ 說名字）和 🔓 解碼 答對 以後 的「生活 裡 怎麼 用」。其他 地方（句型卡…）照舊 用 您 2026-09-27 選 的 名牌 貼紙。</div>

<h2>⑤ 第 4 點：女戰士 ★ 基本（已經 上架）</h2>
<div class="cards">${G.map((n, i) => `<div><img src="../../rpg/chars/g${n}.jpg" alt=""><b>女 ${n}</b><br>${GN[i]}<br>★ 基本 🎁 免費</div>`).join('')}</div>
<div class="box">女 57～66 ＝ ★ 基本（新 同學 的 第一個 免費 戰士 可以 選）。<b>舊 的 女 01～08（★ 基本）下架</b> ── 跟 男戰士 第二十三次（您 選 的「舊 的 全部 下架」）同 一個 做法：<b>已經 選 了 的 學生 照樣 用</b>、可以 換 回來，商店 不再 賣。<br>
如果 要 舊 的 01～08 也 留著 賣，請 寫「⑤ 留著」。</div>

<h2>⑥ C45 ③ 甲：已經 做好</h2>
<div class="box ok">⚡ 現場任務 大螢幕 即時 排行榜：每 一個 人 旁邊 寫「<b>答 N 題</b> · ✅ 對 幾題」；<b>答不到 5 題 不 排 名次、不上 前 10 名、不上 頒獎台</b>（下面 一行「✍️ 答 滿 5 題 才 排 名次：2 號 答 1 題」；分數 照樣 記）。老師看板 期中 挑戰 的 分數 旁邊 也 寫「答 N 題」，答不到 5 題 有 ⚠。</div>
<div class="box">C45 ① 都可以 ＝ 對話 圖 不 改。</div>
</div></body></html>`;
fs.writeFileSync(path.join(D, 'index.html'), html);
console.log('C46 ok');
