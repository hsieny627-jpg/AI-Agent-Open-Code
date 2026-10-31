# tools/c43_page.py ➜ listen/2026-10-31_C43/index.html（第三十六次：給 老師 看 的 建議＋Excel 改寫 清單）
import sys, html, os
R = os.path.join(os.path.dirname(__file__), '..')
sys.path.insert(0, os.path.join(R, 'quiz_xlsx')); import _data as D, _rewrite_c43 as W
e = html.escape
def opt(a, w): return '<b class="ok">' + e(a) + '</b>　' + '　'.join(e(x) for x in w)
rows = {}
for (k, i), q in sorted(W.RW.items()):
    o = getattr(D, k)[i]
    rows.setdefault(k, []).append('<tr><td>' + str(i + 1) + '</td><td>' + e(o[0]).replace('\n', '<br>') + '<div class="src">' + opt(o[1], o[2]) + '</div></td><td>' + e(q[0]) + '<div class="src">' + opt(q[1], q[2]) + '</div></td></tr>')
NM = {'G3A': '三年級 第 1 份', 'G3B': '三年級 第 2 份', 'G4A': '四年級 第 1 份', 'G4B': '四年級 第 2 份'}
tab = ''.join('<h3>' + NM[k] + '（改 ' + str(len(v)) + ' 題）</h3><table><tr><th>第幾題</th><th>現在</th><th>✅ 改成（綠色 ＝ 正確答案）</th></tr>' + ''.join(v) + '</table>' for k, v in rows.items())
T = open(os.path.join(R, 'listen', '2026-10-31_C42', 'index.html'), encoding='utf8').read()
css = T[T.index('<style>'):T.index('</style>') + 8]
body = '''<div class="wrap"><h1>💡 第三十六次：請老師看、請老師回答（C43）</h1>
<div class="box">這一頁 5 個部分：① 加倍時段（老師的問題）② 秒懂複習動畫可不可以有考卷的重點 ③ 現場任務的限時 ④ 大螢幕排行榜前 5 名還是前 10 名 ⑤ Excel 改寫的題目清單。每一個建議下面都有 <b>研究出處和網址</b>，數字都是打開原文核對過的。</div>

<h2>① 加倍時段：我已經幫老師確認了 ✅ 設定成功</h2>
<div class="box ok"><p class="big">我直接問了成績伺服器（只看、不改），伺服器回答：</p>
<table><tr><th>項目</th><th>伺服器現在的設定</th></tr>
<tr><td>🏠 25 題闖關</td><td><b>✖2</b>（金幣、經驗值都 ✖2）</td></tr>
<tr><td>🎮 其他主題和遊戲</td><td><b>✖1.5</b></td></tr>
<tr><td>哪幾班</td><td><b>全部班級</b>（三年級、四年級都查過）</td></tr>
<tr><td>到什麼時候</td><td><b>11 月 1 日（星期日）晚上 11:59</b></td></tr></table>
<p><b>學生看得到嗎？看得到。</b>① 學生打開〔戰神之路〕，最上面有金色橫幅「🎉 你們班加倍中！答對賺的🪙金幣 ✖1.5、⭐經驗值 ✖1.5；🏠 25題闖關 ✖2（到11/1 23:59）」② 在家複習首頁最上面也寫著「⏰ 11月1日（星期日）晚上11:59以前：🏠 25題闖關 ✖2｜🎮 其他主題和遊戲 ✖1.5」。</p></div>
<div class="box warn"><p class="big">為什麼按〔🟢 全開〕就好，下面不用勾？</p>
<table><tr><th>按鈕</th><th>意思</th><th>下面的勾（班級、任務）</th></tr>
<tr><td>🟢 全開</td><td><b>全部班級、全部任務</b>一起加倍</td><td><b>不看</b>（勾不勾都一樣）</td></tr>
<tr><td>🎯 只加倍我勾的</td><td>只有勾的班級、勾的任務加倍</td><td>要勾</td></tr>
<tr><td>⛔ 全關</td><td>都不加倍</td><td>不看</td></tr></table>
<p>老師這一次要「全部班級都加倍」，所以按〔🟢 全開〕最簡單；<b>「幾倍」（✖1.5、25 題闖關 ✖2）和「到什麼時候」還是照老師設定的</b>。上一次我寫「最後按〔🟢 全開〕」沒有說清楚，對不起。</p></div>

<h2>② 秒懂複習動畫：可以有考卷的重點嗎？</h2>
<div class="box ok"><p class="big">我的建議：可以教考卷的「重點」，但是句子、字、人名、形式全部換（現在就是這樣做的）。</p>
<table><tr><th>可以</th><th>不可以</th></tr>
<tr><td>How old ＝ 幾歲、years old ＝ 歲、What’s ＝ What is、b／d 方向、He’s／His…（課本、習作的重點）</td><td>考卷的原句、考卷的人名、考卷的字配考卷的選項（網站 build 的時候自動檢查，有一樣的 ＝ 做不出來）</td></tr></table>
理由：<br>1️⃣ <b>練習的重點和考試一樣、形式接近，效果最好</b>：222 個真實教室研究的後設分析，小考和考試同一種形式 g＝0.531，不同形式 g＝0.399。<br>
2️⃣ <b>影片中間穿插小測驗，學生比較專心、學得比較好</b>（隨機分組實驗，正好就是老師要的「隨時穿插測驗」）：有穿插測驗的學生，分心的比例 <b>19%</b>，沒有測驗的 <b>39%～41%</b>；做筆記 24% 對 7%～9%；最後總測驗 <b>90%</b> 對 76%、68%；而且<b>考試焦慮比較低</b>。
<div class="src">出處：① Yang, Luo, Vadillo, Yu & Shanks（2021）Psychological Bulletin，DOI <a href="https://doi.org/10.1037/bul0000309">https://doi.org/10.1037/bul0000309</a>（全文 <a href="https://gwern.net/docs/spacedrepetition/2021-yang.pdf">https://gwern.net/docs/spacedrepetition/2021-yang.pdf</a>）② Szpunar, Khan & Schacter（2013）Interpolated memory tests reduce mind wandering and improve learning of online lectures. PNAS 110(16), 6313–6317，全文 <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3631699/">https://pmc.ncbi.nlm.nih.gov/articles/PMC3631699/</a>（實驗 2：19% vs 39%、41%；總測驗 90% vs 76%、68%：打開原文核對過）</div></div>

<h2>③ 現場任務：25 題、50 題要限時多久？</h2>
<div class="box"><p>我量了每一部秒懂複習動畫（含 3 題突擊測驗）：<b>一部大約 1 分 10 秒</b>。三年級 25 題有 11 關（11 部動畫 ≈ 13 分鐘），四年級有 13 關（13 部 ≈ 16 分鐘）。再加上原本答題的時間（25 題 5 分鐘、50 題 10 分鐘）：</p>
<table><tr><th></th><th>動畫</th><th>答題</th><th>✅ 建議（我已經先改成這個預設，老師開的時候可以換）</th></tr>
<tr><td>三年級 25 題</td><td>≈ 13 分</td><td>5 分</td><td class="big">20 分鐘</td></tr>
<tr><td>三年級 50 題</td><td>≈ 13 分</td><td>10 分</td><td class="big">25 分鐘</td></tr>
<tr><td>四年級 25 題</td><td>≈ 16 分</td><td>5 分</td><td class="big">25 分鐘</td></tr>
<tr><td>四年級 50 題</td><td>≈ 16 分</td><td>10 分</td><td class="big">30 分鐘</td></tr></table>
<p>可以選的時間改成：5、10、15、20、25、30、40 分鐘。學生按〔🐢 放慢〕會再多大約 6 成時間，所以如果班上很多學生需要放慢，建議再多選 5 分鐘。</p></div>

<h2>④ 大螢幕的即時排行榜：前 5 名還是前 10 名？</h2>
<div class="box ok"><p class="big">我的建議：前 10 名（現在就是前 10 名，不用改）。</p>
1️⃣ 隨機實地實驗：排在<b>第 2～10 名</b>的人，接下來 24 小時多努力 <b>10%</b>；排到 11 名以後的人反而少 <b>8%</b> ➜ 「看得到自己快進前 10」最能激勵人。<br>
2️⃣ 一班大約 25～30 人：前 10 名 ＝ 大約 3 個人裡面 1 個（努力就搆得到）；前 5 名只有 6 個人裡面 1 個，大部分學生覺得不可能，就放棄了。<br>
3️⃣ 公開排名對後段的學生有傷害（公開排行榜讓整體表現掉 24%），所以<b>只列前 10 名、不列最後幾名</b>（現在就是這樣）。<br>
4️⃣ 最後的「⚔ 前 5 名決戰」照舊留著：那是結束以後的頒獎，不是作答中的排行榜。
<div class="src">出處：Leung（2019）CHI，DOI <a href="https://doi.org/10.1145/3290605.3300397">https://doi.org/10.1145/3290605.3300397</a>（全文 <a href="http://library.usc.edu.ph/ACM/CHI2019/1proc/paper167.pdf">http://library.usc.edu.ph/ACM/CHI2019/1proc/paper167.pdf</a>，2026-10-08 打開核對）；Bursztyn & Jensen（2015）QJE，DOI <a href="https://doi.org/10.1093/qje/qjv021">https://doi.org/10.1093/qje/qjv021</a>（2026-10-07 核對）。⚠ 照實寫：找不到研究直接比較「前 5 名 vs 前 10 名」對小學生的影響；Leung 是成人、電影網站。</div></div>

<h2>⑤ Excel：改寫的題目（老師說「對」，我才做 Excel）</h2>
<div class="box warn">改寫的規則：① <b>不靠圖示</b>（Kahoot 不保證顯示）② 「Which word starts with f?」➜「<b>f ➜ ?</b>」③ 看圖拼字 ➜ <b>缺一個字母</b>（z _ b r a）④ 看圖數數 ➜ <b>算式</b>（3 + 4 = ?）⑤ 教室指令圖 ➜ <b>純英文填空</b>、⇄ 相反 ⑥ ✅❌ 圖 ➜ <b>先給一句事實</b>（He’s a cook. ➜ Is he a cook?）⑦ 錯的選項跟答案相近、不可以其實也對（例：Put ___ your hand. 不放 up，因為 Put up your hand. 也對）。兩份之間沒有一樣的題目（檢查過）。</div>
''' + tab + '''
<h2>📋 回答範例（照著打）</h2><div class="box ask big">C43：① 懂了　② 對　③ 對　④ 前10名　⑤ 對</div></div>'''
open(os.path.join(R, 'listen', '2026-10-31_C43', 'index.html'), 'w', encoding='utf8').write('<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第三十六次 請老師選 C43</title>' + css + '<style>b.ok{color:#5BE38A;background:none}</style></head><body>' + body + '</body></html>')
print('ok', sum(len(v) for v in rows.values()))
