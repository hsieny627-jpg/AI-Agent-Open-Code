# 三年級 L1 ＋ L2 句型網站 — 規格（接手的 Claude 先讀完再動手）

> **最高原則（使用者 2026-09-28 指定，永遠適用）**：見根目錄 `AGENTS.md` 第四節〈最高原則〉——資料查證 100% 正確、iPad 與教室觸控螢幕都要字夠大且流暢、出處一定對應到那一個字（不可只寫通則）、看不懂先問。

使用者是國小英語教師。**這份規格是使用者指定的結果，不要自行「優化」。**
根目錄 `AGENTS.md` 第四節（品質與省額度的固定規則）同樣適用。
**引擎跟 `sentences/` 共用**，所以 `sentences/CLAUDE.md` 裡的字卡規則、發音引擎、答錯獨立頁、
語速六段、音效暫時刪除……全部適用，這一份只寫「這一課不一樣的地方」。


## 2026-10-04 對話 B：每個分頁最後面的「📝 複習題 5 題」

引擎、計分、答錯頁、量測全部寫在 `sentences/CLAUDE.md` 最上面「2026-10-04 第十二次改版」。這一課自己的：
- 題目：`_tq_data.js`（`node tools/tq_from_md.js` 從 `sentences/2026-10-04_B_複習題_題目清單.md` 第三段產生，**不要手改**）：Unit 1、Unit 2 各 7 組（1-1 基礎／進階、1-2、2 基礎／進階、3、4）＋在家複習縮寫動畫 2 組，共 80 題。
- 語音檔：`_audio.js` 收 `_tq_data.js`（這次新做 9 句）。You’re Ken. 聽寫聽成「Your can」，詞典念法 /kɛn/ 正確，保留（理由見 sentences/CLAUDE.md）。

## 2026-10-04 改版（對話 A；引擎改動寫在 `sentences/CLAUDE.md` 最上面「2026-10-04」，單字卡寫在 `words/CLAUDE.md`）

這一課自己的：

| # | 使用者要的 | 做法（在哪裡） |
|---|---|---|
| 16 | 縮寫頁（等句／縮寫）下面列出這個句型全部的替換字（名字、數字） | `_data.js`：Unit 1 的 My name is ___. ＝ I am ___.／I’m ___. 那幾張改成 `slot:'name'`、一開始是 Ken；I am Ken. ＝ I’m Ken.、三句那一張也加 `slot:'name'`；Unit 2 的等號卡全部 `slot:'age'`。What is ___? ＝ What’s ___? 空格是「東西」，沒有替換字 |
| 17 | Unit 2 句型 2 第 7 頁：等句、下面加數字替換字、唸上下兩句 | `U2[7]`（I’m ten years old. ＝ I’m ten.）：`slot:'age'`，左上角自動寫「等句」，兩句都唸 |
| 5 | 句型 2 第 10 頁 I am Alan／Ken／Mike ＝ 男聲 | `BOYS = ['Ken','Alan','Mike']`（引擎 `boyV()`） |
| 6 | 數字音高調低、男聲 old 收尾、女聲 years old 的 old 太弱 | `_audio.js`：`^` 數字、男聲 `%years %old`、`years old` ➜ `years !old.`（`tools/stress.py`） |
| 10・Q12・Q11 | What ➜ is ➜ What is ➜ What’s；Where 圖示 | Sight Words（`_build_words.js`）：`is-2`、`what-is`（新）、`whats`（縮寫動畫 `morph`）、`WHERE`（SVG）。You are、How old、years old 的加號頁刪掉 |
| Q1 | eleven 是「哪兩個英文單字」組成的？ | `_num_pages.js`：✅ one 和 left／one 和 ten／ten 和 one／elf 和 even；揭曉：很久以前的 one（ain）和 left（lif），數完 10 還剩 1 |
| 13・18・19・Q10 | 中英語序上英文下中文、Review 1 全部的句子、to 不放中文、build LEGO 小字 | 見 `sentences/CLAUDE.md` |

## 2026-10-03 改版（使用者 13 點；引擎改動寫在 `sentences/CLAUDE.md` 最上面「2026-10-03」，先讀那一節）

這一課自己的：

| # | 使用者要的 | 做法（在哪裡） |
|---|---|---|
| 1 | Unit 1 上方四個按鈕：一-1 What’s your name?（基礎 11 張／進階 3 張）、一-2 中英語序、二 My name is ___.（基礎 13 張／進階 5 張）、三 一問一答（3 張）、四 原本句型 | `_data.js` 的 `U1T`、`TABS1`。基礎第 5 張 What is your name? ＝ 逐字卡（點一下出一個字、最後唸整句）；第 8 張 What is ______?（空格、?、＝ 不唸）。「沿用原來字卡」＝ 直接用 `U1[n]` |
| 9 | Unit 2 上方四個按鈕：一-1 How old are you?（基礎 7 張／進階 2 張）、一-2 中英語序、二 I’m ten years old.（基礎 8 張／進階 3 張）、三 一問一答（3 張，第 2 張 I’m ten years old. ＝ I’m ten. 新做）、四 原本句型 | `U2T`、`TABS2`。單字卡 How ＝ 如何、old ＝ 老的（👴）、years ＝ 年（📅）；「______ years old.」寫了替換 ➜ 一開始是 ten |
| 6 | 一問一答：答句 Ken／Alan／Mike 男聲、Emma／Wendy 女聲（那一句的問句換男聲） | 引擎 `qaV()`；語音檔 `_audio.js`（收集方法 `sentences/_audio_collect.js`），男聲的鑰匙前面有 `m:`；ten 的重音（`+ten ~years ~old`）男聲也做一份 |
| 7 | 三年級原本的發音也要最高品質 | 全部重做：Kokoro v1.0、女聲 af_bella、男聲 am_michael，修好剪靜音（見 sentences/CLAUDE.md）|
| 12 | 三年級複習（`g3-review/`） | `RPAGES`（u1／u2：進階句型 ①②、中英語序、縮寫動畫 What is ➜ What’s、I am ➜ I’m、You are ➜ You’re），首頁和遊戲 `sentences/_build_review.js`；遊戲：語序大挑戰、聽力狙擊、問名字還是問幾歲；補充：數字、Sight Words 的單字結構和單字故事 |

**語音檔怎麼重做**（2026-10-03 起）：`pip install sherpa-onnx lameenc numpy pyworld onnxruntime`，下載 `kokoro-multi-lang-v1_0`（同一個 tts-models 頁面）到 `$TTS_MODELS`，然後 `TTS_MODELS=<資料夾> node "G3 - L1 + L2/_audio.js"`。聽寫驗證：再下載 `sherpa-onnx-whisper-small.en`（asr-models 頁面）放同一個資料夾，`TTS_MODELS=<資料夾> python3 tools/asr_check.py "G3 - L1 + L2/audio"`。

## 2026-10-02 Review 1 替換字切換（先讀這一節）

- `review1.html` 的 I like ___.／I like to ___. 兩張卡多一排切換：**📘 課本**（原本的 20 個）／🍟 物品 1／🎮 物品 2、📘 課本／⛹️ 活動 1／🎧 活動 2。
  字、中文、圖示都從 `review1/_data.js` 來（`review1/_subsets.js` 的 `SETS`；這裡的 `_data.js` 只寫 `SUB.like.sets`、`SUB.liketo.sets`）。一類一排，小類併成一排。
- 引擎：`sentences/_build_cards.js` 的 `SSPATCH`（只有用到 sets 的頁才放，unit1／unit2 逐位元組不變）。
- 語音：`_audio.js` 也收切換的字換進去的整句（新做 134 句）；**LEGO 唸成 Lego**（`speak`，2026-10-02 起新做的句子適用）。
- 量測：`node "G3 - L1 + L2/_verify.js" review1.html`（每一組都按、點最後一個字、句子和中文都換、整句有語音檔、不溢出、不蓋到句子）。
- Review 1 的物品／活動**遊戲**在 `review1/games.html`（三、四年級共用），規格在 `sentences/CLAUDE.md` 待辦 13。

## 2026-09-28 改版（第二批＋新增 (二)～(五)）——先讀這一節

共用的改動寫在 `sentences/CLAUDE.md`、`words/CLAUDE.md` 最上面「2026-09-28」。這一課自己的：

| # | 使用者要的 | 做法（在哪裡） |
|---|---|---|
| (三) | 問名字還是問幾歲：選項英文、位置隨機、不加圖示；答錯頁正確 | `_game_data.js` 的 G9 `duo`（見 sentences/CLAUDE.md） |
| 6(4)E | 每個字的時光機 | `numbers/<字>-evo.html` 13 頁、`sight/<字>-evo.html` 19 頁（`node words/_build_evo.js`），兩個首頁各多一張「⏳ 時光機」 |
| 6(3)(4) | 故事每一張以前 ⚡ 今天、N 年前、自己的出處 | `_num_pages.js` 的 `numW`、`_sight_pages.js` 的 `whyS`：`evo:` 或 `was:`；童謠 four and twenty ＝ 1744 年、法國 80 那一幕加英文 **fourscore**（林肯 1863：Four score and seven years ago） |
| 6(4)C | 德文「年」標題洩題 | `whyS` 標題改「📅 year 的祕密」 |
| 12(2) | zero 的旅行看不懂、字太小 | `numW` 第 2 幕：四站路線（印度 śūnya ➜ 阿拉伯 ṣifr（翻譯）➜ 義大利 zephirum（1202 Fibonacci）➜ 英國 zero），每一站「⏳ 大約 N 年前」，一顆 0 沿著路線走 |
| 12(1)(5) | 放大地圖、英德荷三兄弟 | `sight/map-story.html`、`sight/en-de-nl.html`（內容跟四年級同一份 `words/_pages2.js`，回的是三年級的首頁）；數字首頁也連過去 |
| 9 | 常見字環遊世界：逐字中文、’ 那一幕 | `worldS`（What’s your name? 後面：德荷瑞典問名字用「叫做」，沒有 ’s；法文 t’appelles 的 ’ 藏 e） |

## 2026-09-27 改版（使用者 16 點的第一批）——先讀這一節

引擎的改動（name 名牌圖示、答錯頁唸到哪亮到哪、遊戲 3 分鐘／火眼金睛 4 分鐘、驚喜卡外觀 38 種＋一律二～五選一、選項誘答力）
寫在 `sentences/CLAUDE.md` 最上面「2026-09-27」，**兩個網站共用**。單字頁（數字、Sight Words）的樣板改動寫在 `words/CLAUDE.md`。這一課自己的：

| # | 使用者要的 | 做法（在哪裡） |
|---|---|---|
| 1 | 首頁「三年級」的圖示、Unit 1 的圖示 ➜ 更有質感、更好認的 name 圖示 | `ICON.name`、`_build_home.js` 第 2 張卡、`words/_build_hub.js` 三年級那一列：一律 `sentences/_nametag.js`。舊的 `.nmtag` CSS 刪掉了 |
| 2 | 「三年級 秒懂教室」➜「三年級」 | `_build_home.js` 的 `<h1>` 和分頁名稱 |
| 4 | I’m ten years old.：years、old 都是輕聲、接近中文三聲；old 不是四聲 | `tools/stress.py` 新記號 **`~` ＝ 低平**：那一段音高壓到全句中位數 ✕ 0.80 並**拉平**（不往下掉）、音量 ✕ 0.75。`_audio.js` 改成 `I'm +ten ~years ~old.`（six～twelve、I’m／I am 都做）。`-`（只是壓低 0.86）不用了 |
| 5 | Sight Words 單字結構：’ 一律紅色；I am ＝ I’m：a 和 ’ 一律紅色 | `words/_phonics.js` 的 `apRed()`（見 `words/CLAUDE.md`）＋ 句型卡情境 `hidRed()`（見 `sentences/CLAUDE.md`） |
| 13 | you 的故事看不懂 ➜ 更簡單；暖身題選項刪掉 you們、加 your、提升誘答力 | `_sight_pages.js` 的 `whyS`：標題改「you 的故事」（原本「今天：你、你們 都是 you」**洩題**）；題目「你們怎麼說？」四個選項 **you／your／yours／you’re**（四個都是真的字、長得很像）；動畫只講一件事：👉🧒 you ＝ 你、👉🧒🧒🧒 you ＝ 你們，再一格時光機「以前一個人 ＝ thou ➜ 今天全部 you」 |
| 14 | 選項誘答力（這一課） | `_quiz_data.js` 第 2、3、8、12、16 題；`_game_data.js` G1、G10 幾題（見 `sentences/CLAUDE.md`） |

## 2026-09-26 改版（使用者 26 點）——先讀這一節

引擎的改動（答錯頁逐字中文、加分題、火眼金睛 6 秒頁、驚喜卡、右上角分數、語序卡唸到哪亮到哪、多排替換字……）
寫在 `sentences/CLAUDE.md` 最上面「2026-09-26」，**兩個網站共用**。單字頁（數字、Sight Words）的樣板改動寫在 `words/CLAUDE.md`。這一課自己的：

| # | 使用者要的 | 做法（在哪裡） |
|---|---|---|
| 1・2 | 總首頁改名「首頁」，分「四年級／三年級」兩區；「三年級句型」改名「三年級」 | `words/_build_hub.js` 的 `GROUPS` |
| 3 | Unit 1 秒懂重點：How ＝ **如何** | `U1[0]` |
| 4 | You／Your 的 Y 上下對齊；Your 的 o 淡灰 | `U1[10]` 加 `left:1`（引擎 `.fgrid.left`）；`SIL.your=[1]` |
| 5 | 一問一答最後一張：What’s your name? ／ My name is Emma. ＝ I’m Emma. | `U1[15]`（`atk` 中間一個 `＝` token，`eqs:1`，不發音）；情境 `SC1` 同步加一幕 |
| 6 | Unit 2 秒懂重點 What／How／How old 第一個字對齊 | `U2[0]` 加 `left:1` |
| 7 | Unit 2 語序：你／you 藍色；後面的卡 you 都藍色；唸到哪一個字，那個字和它的中文一起放大變亮（Unit 1 也一樣） | `W.you`／`W.You` 改 `hl:'b'`；語序卡 `'b'`；他問他答、一問一答 `cls:'b'`。引擎 `sayOrd()`：What’s 先亮 What＋什麼，再亮 ’s＋是 |
| 8・10 | 縮寫卡「唸一次」兩句（三句）都要唸；**ten 重音、years old 輕讀** | 卡片加 `all:1`（`U2[5]`、`U2[8]`）。語調：`tools/stress.py`（WORLD 聲碼器改音高和音量：ten 音高 ✕1.25、years old ✕0.86），`_audio.js` 用 `+ten -years -old` 記號，six～twelve 四種句子都做。**量過**：ten 那一段的音高是全句最高 |
| 9 | I’m ten years old. ＝ I’m ten. 兩句的 I 對齊 | `U2[7]` 加 `left:1` |
| 12・16 | 數字結構看不懂 ➜ 「eleven ＝ 10 ＋ 1？」**對！**藍色 ＝ 1、2，金色粗體 ＝ 10；leven／lve ＝ 剩下（跟 leave 一家） | `_num_pages.js` 的 `numP` |
| 13 | one、two 的家人分兩籃：藍 once only alone none eleven；橘 twin twice twelve twenty between | 同上（每一個都查 OED／Etymonline） |
| 14 | thirteen／thirty：teen 金色、ty 藍色，粗體 | 同上 |
| 15 | 「這是哪一國的【數字單字】？」；為什麼看這幾國、對記英文有什麼幫助 | 猜之前多四幕：在哪裡 ➜ 坐船到英國 ➜ 語言也有家人 ➜「英文不唸的字母，兄弟姊妹還在唸」（eight／acht、two／twee） |
| 17 | 數字環遊世界：基礎 0～10（11 張）、進階 11～20（10 張）、進階 30～100（8 張） | 三頁：`numbers-world.html`／`-2`／`-3`。每一張：先猜（遊戲）➜ 公布後出現**字母密碼**動畫（英文 t ＝ 德文 z、th ＝ d、gh ＝ ch、-teen ＝ -zehn ＝ -tien、-ty ＝ -zig ＝ -tig、法文 80 ＝ 4 ✕ 20）。記住這件事：字放大、每一個字有中文、三兄弟坐船動畫 |
| 18 | Sight Words 加【進階】Who、Where、When、Why；「我 是」中間空一格，每個字正上方是它的圖示（你 是、什麼 是 也一樣） | `SIGHT` 加四張（`adv:1`，音標在 `words/_phonics.js`）；`zhp:[['我','🙋'],['是','＝']]`（`words/_build.js` 第①幕） |
| 19 | 常見字環遊世界加：你、你的、你的名字是什麼？、你幾歲？；別國的「我」也大寫嗎？ | `_sight_pages.js` 的 `worldS`（thou ＝ du、thine ＝ dein、hight ＝ heißen；只有英文的 I 大寫、德文反而名詞大寫） |
| 20・21・23・24 | 故事改成先猜再揭曉、字放大；you：今天你、你們都是 you；德文 Jahr ＝ 年 | `numW`、`whyS`：每一幕 `q:{q,o}`（o[0] 正解），引擎見 `words/CLAUDE.md` |
| 25 | **Review 1**：Hi. ／ My name is ___. ／ I’m ___ years old.（eight nine ten）／ I like ___.（20 個）／ I like to ___.（20 個）／ How about you? | `_data.js` 的 `XPAGES` ➜ `review1.html`（首頁第 4 張卡）。空格一開始是 ______，點替換字才填進去 |

**語音檔怎麼重做**多一個套件：`pip install sherpa-onnx lameenc numpy pyworld`（pyworld 做重音）。
模型：`kokoro-en-v0_19`（英文）、`vits-piper-sv_SE-nst-medium`（瑞典文），從 sherpa-onnx 的 tts-models 下載，放同一個資料夾給 `TTS_MODELS`。

## 2026-09-25 改版（使用者指定）——先讀這一節

引擎的改動（答錯頁 8 秒＋加分類似題、遊戲 5 分鐘、驚喜卡、語序卡連動、秒懂重點三欄對齊……）寫在
`sentences/CLAUDE.md` 最上面「2026-09-25 第六次改版」，**兩個網站共用，這裡不重寫**。這一課自己的：

| # | 使用者要的 | 做法 |
|---|---|---|
| 19(1) | Unit 1 第一張：照抄四年級 Unit 1 第一張（暫時刪除 Who） | `U1[0]` ＝ What／How 兩列，用法 `USE` 直接 `require('../sentences/_data.js')`，**四年級改了這裡跟著改** |
| 19(2) | What、name、I／my、you／your 的圖示看不懂 | What ＝ ❓；name ＝ 紅色「HELLO／Ken」名牌（`.nmtag`）；I／My／You／Your ＝ **兩個小朋友**（左邊 🧒 頭上 💬 ＝ 正在說話的「我」，右邊 👧 ＝「你」），亮的那一個就是這個字在說的人，「的」＝ 那個人身邊多一個 🎒（`pi()`）。負的左右邊界：圖示再寬也不會把字推開 |
| 19(3)(4) | 全部句型的語調不自然，要美式英語自然正確的語調 | **全部預先做成語音檔**：`audio/`（Kokoro 神經語音，美式女聲 af_bella，Apache-2.0），`_audio.js` 收集這一課會唸到的每一句、每一個字、每一個答案（316 句）。網頁唸英文先查 `audio/aud.js`，查得到就播音檔，查不到才用瀏覽器語音（引擎：`_shared.js` 的 `aPlay()`，有 `audio/aud.js` 才載入，sentences 沒有）。語速六段照樣管（`playbackRate`） |
| 19(5)(6) | I’m Mike ➜ **I’m Ken**；縮寫卡 **I am Ken. ＝ I’m Ken.** | `U1[6]`、`U1[8]` |
| 19(7) | 名字不翻譯 | 名字的中文那一格就寫英文名字（`W.nm()`、`SUB.name`、遊戲和暖身題的中文句子也一樣） |
| 19(8) | 名字的頭像照老師的截圖 | ✅ 2026-09-26 老師上傳五張全身角色圖（透明底 PNG），已放進 `avatars/`：`ken.png` 格子襯衫男孩、`mike.png` 戴眼鏡男孩、`alan.png` 西裝大人、`emma.png` 黃洋裝女孩、`wendy.png` 紅吊帶褲女孩（**對應是 Claude 依性別與老師列名順序推的，錯了只要互換檔名再 build**）。`.av` 改成不裁圓形、高 1.6em、`contain`（全身圖整個人都看得到）。引擎修正：替換字按鈕的 `data-ic` 要把 `"` 轉成 `&quot;`（`sentences/_build_cards.js`），不然 `<img>` 會把屬性切斷、按鈕上多出 `">` |
| 19(9) | 秒懂重點：英文、中文、等號上下對齊 | 引擎的 `.fgrid`（`eqRow` 的卡都是） |
| 19(10) | 一問一答 My name is Wendy ➜ **Emma** | `U1[13]` |
| 19(11) | 新卡：**My name is Ken. ＝ I am Ken. ＝ I’m Ken.** | `U1[9]`：`eq` 卡多一個 `c`（第三句），`left:1` 三句靠左 |
| 21 | Unit 2 語序：你／幾歲底色太像；點「幾歲」上下一起亮；are 的 e 看不清楚 | 「你」改很淡的粉紅（引擎 `.chip.lp`）；點任何一格上下同色一起放大變亮（引擎 `lnk()`）；底色上的淺灰字母改成半透明深色 |
| 22 | 新卡：**I am ten years old. ＝ I am ten. ＝ I’m ten.**，三句的 I 上下對齊 | `U2[8]`（`left:1`） |
| 23 | Unit 2 秒懂重點 I’m 上下對齊 | 他問他答卡的答句靠左（引擎 `.ebub.a`） |
| 24 | Unit 2 所有句型的數字一律 ten | `W.ten()`；替換字還是 6～12 |
| 18 | **🔢 數字單字** zero～twelve：字卡（母音紅、不發音灰、音節切開）＋ 結構 ＋ 故事 ＋ 環遊世界 ＋ 出處 | `numbers/`，產生器 `_build_words.js`（樣板跟 words/ 家人單字**同一套**：`words/_section.js`） |
| 20 | **👀 Sight Words** I, My, You, Your, I am, You are, name, is, What, What’s, How, old, How old, year, years old | `sight/`，同上 |

卡片數現在是 **Unit 1 17 張、Unit 2 17 張、Review 1 6 張**（2026-09-26）；以前是 Unit 1 16 張、Unit 2 17 張（複習題照每 4 張一組，最後一組 4～5 張）。

**不發音字母照使用者的清單**：one 的 e、three 字尾 e、four 的 u、five 的 e、eight 的 gh、nine 的 e、twelve 字尾 e；
You／Your 的 o、are 的 e、name 的 e、What 的 h、year 的 a（`words/_phonics.js` 的 `RAW`）。
**two 的 w 也標灰**（/tuː/，w 不唸）：使用者 2026-09-26 確認。

**語音檔怎麼重做**（改了句子才需要；舊的句子不會重做）：

```bash
pip install sherpa-onnx lameenc numpy
# 下載 kokoro-en-v0_19 到 $TTS_MODELS（https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models）
TTS_MODELS=<模型資料夾> node "G3 - L1 + L2/_audio.js"
node "G3 - L1 + L2/_build.js"
```

## 這是什麼（2026-09-24 使用者指定）

三年級第一冊 Unit 1／Unit 2：

| 課 | 句型 | 替換字 |
|---|---|---|
| Unit 1 | `What's your name?` ➜ `My name is ___.` 或 `I'm ___.` | Ken, Alan, Wendy, Mike, Emma |
| Unit 2 | `How old are you?` ➜ `I'm ___ years old.` 或 `I'm ___.`（years old 可省略） | six ～ twelve |

四個部分：**首頁 → 暖身 24 題 → Unit 1（15 張）／Unit 2（16 張）句型卡（各有 📝 複習）→ 10 種複習遊戲**，
外加 Kahoot 匯入檔 `kahoot_G3_L1L2_24.xlsx`（就在這個資料夾）。
網址：`https://hsieny627-jpg.github.io/AI-Agent-Open-Code/G3%20-%20L1%20+%20L2/`，根目錄首頁第 9 張卡連過來。

## 檔案分工

| 檔案 | 說明 |
|---|---|
| `_data.js` | **句型卡的唯一真相來源**：token、替換字、不發音字母 `SIL`、縮寫 `CONTR`、情境 `SC1`／`SC2`、複習題 `RV1`／`RV2`、頁面標題 `PAGES` |
| `_quiz_data.js` | **暖身 24 題**＋ `CFG`（每次重洗、愈快分數愈高）＋ `KAHOOT`（匯入檔名稱、放哪裡） |
| `_game_data.js` | **10 個遊戲題庫＋每個遊戲 30 張驚喜卡**（`THEME` 名字、`FX` 效果）＋ `CFG` |
| `_build_home.js` | 這一課自己的首頁（版面照抄 sentences 首頁） |
| `_build.js` | **一次重建整站**：`node "G3 - L1 + L2/_build.js"`（連 Kahoot 一起） |
| `_verify.js` | 量測：`node "G3 - L1 + L2/_verify.js"`，只量一頁加檔名 `unit1.html` |
| `*.html`、`kahoot_*` | **產物，不要手改** |

引擎在 `sentences/`：`_shared.js`（發音、配色、字體、按鈕列）、`_build_cards.js`、`_build_quiz.js`、
`_build_games.js`、`_build_kahoot.js`、`_verify.js`。它們靠 `sentences/_site.js` 知道要讀哪個資料夾。
**這一課要的新功能都寫成「資料裡有寫才開」**，sentences 沒寫就跟原本一模一樣
（2026-09-24 改完以後 sentences 五頁重建出來和改之前**逐位元組相同**）。

## 這一課的規則（使用者 2026-09-24 指定，不要改回去）

### 不發音的字母 ＝ 淡灰色（`_data.js` 的 `SIL`）

| 字 | 灰的字母 |
|---|---|
| What | h |
| name | e |
| are | e |
| you | o |
| year／years | a |
| eight | gh |
| nine | e |
| twelve | 最後的 e |
| Mike | e |

引擎一個字一個字查 `SIL`（`What’s` 的 What、`name?` 的 name 都查得到）。
`_verify.js` 會把 `SIL` 每一個字丟進 `enHTML()`，**灰的剛好是那幾個字母、不多不少**才算過。
Unit 1 第 15 張、Unit 2 第 16 張是「淺灰色的字母 ＝ 不發音」的秒懂重點卡。

### 縮寫（`CONTR = ['s','m','re']`）

`What is ＝ What’s`、`I am ＝ I’m`、`You are ＝ You’re`：
`'s`／`'m`／`'re` 都是獨立的 token，底下標「是」，唸的時候自動變成「前一個字＋縮寫」
（`I’m`、`You’re`，不會唸成單獨的 m）。三個都有**縮寫變身卡**（五拍）和**等式卡**。

### 兩個顏色 ＝ 全課最容易搞混的地方

| 顏色 | 問 ➜ 答 | 在哪裡演 |
|---|---|---|
| 🔵 藍底 | `your` 你的 ➜ `My` 我的 | Unit 1 他問他答卡（第 11 張）、一問一答卡：藍色的 your 自己飛到 My |
| 🔵 藍底（2026-09-26 改） | `you` 你 ➜ `I` 我 | Unit 2 他問他答卡（第 12 張）、一問一答卡：藍色的 you 自己飛到 I（使用者指定 you 一律藍色） |

另外有：`I 我／My 我的／You 你／Your 你的` 秒懂重點卡（Unit 1 第 10 張）、
`What ＝ 什麼／How ＝ 怎麼樣／How old ＝ 幾歲`（Unit 2 第 1 張）、
**「要答什麼？」卡**（Unit 1 第 12 張、Unit 2 第 12 張：✅ 對的答法 ❌ 常見答錯）、
**「問什麼，就答什麼」卡**（Unit 2 第 13 張）、`years old 可以省略` 等式卡（Unit 2 第 8 張）。

### token 的寫法

- `How old` 是**一個 token**（中文「幾歲」、圖示 🎂）：使用者指定 How old ＝ 問年紀。
- `years old` 是**一個 token**（中文「歲」）：使用者指定 years old ＝ 歲。
- 名字的逐字中文用音譯：Ken 肯恩、Alan 艾倫、Wendy 溫蒂、Mike 麥克、Emma 艾瑪。
- 圖示：I 🙋、My 🙋🎒、you 👉、your 👉🎒（多一個書包 ＝「的」）。

### 暖身題（`_quiz_data.js`，24 題）

- 每題 50 秒、前 20 秒小組討論（跟 sentences 一樣，老師可按「✋ 提前作答」）。
- **`CFG.random`：每一次按開始，題序和選項都重洗**（sentences 是固定順序，因為要對 Kahoot）。
- **`CFG.speed`：分數 ＝ 100 ＋ 剩下秒數 ÷ 50 ✕ 900**（愈快愈高，最多 1000；挑戰題再 ✕ 2）。
- 6 題挑戰題、6 題聽力題。

### 10 個遊戲（每題 15 秒、一場 12 題、愈快分數愈高）

| # | 遊戲 | 這一課考什麼 | 題數 |
|---|---|---|---|
| 1 | ⚡ 閃電四選一 | 縮寫、What／How old、I／My、數字 | 24 |
| 2 | 🙋 **I 還是 My** | 左 I（我）右 My（我的），填進句子 | 24 |
| 3 | 🧩 語序大挑戰 | 排出整句 | 22 |
| 4 | 🪄 **縮寫變身術** | 拆開 ⇄ 縮寫、省略／補回 years old、My name is ⇄ I’m | 20 |
| 5 | 🎧 聽力狙擊 | seven／eleven、ten／Ken 這種聽起來很像的 | 20 |
| 6 | 🃏 記憶配對 | 英文配中文 | 20 對 |
| 7 | 🔍 火眼金睛 | you／your、I／My、year 少 s、What old… | 22 |
| 8 | ✏️ 填空高手 | 少一個字 | 22 |
| 9 | 🗂 **問名字還是問幾歲** | 看答句，判斷它在回答哪一題（`I’m Ken.` vs `I’m ten.`） | 24 |
| 10 | 👑 魔王挑戰 | 混合 | 24 |

第 2、9 個遊戲的兩顆大按鈕寫在 `GAMES` 的 `duo`（引擎讀這個，不用改程式）。

### 驚喜卡：每個遊戲 30 張，300 張全部不一樣（使用者 2026-09-24 指定）

- 十個主題：太空、動物、甜點、魔法、音樂、海洋、尋寶、運動、大自然、勇者（`THEME`）。
- 同一個遊戲的 30 張**效果也都不一樣**（`FX`：10 種加分、4 種**神秘紅包**（翻開才知道幾分）、
  5 種倍率、4 種加秒、3 種快答、3 種連對、1 張護盾）。
- **翻開的那一刻，卡片上的圖示炸滿整個畫面**（四種炸法隨機：爆開、下雨、往上飄、轉圈）＋畫面震一下，
  學生猜不到下一次是哪一張、哪一種炸法（`CFG.burst`）。
- 其他照 sentences：卡片先抖再翻、翻開才生效、只給好事、抽過不再抽、隨時看得到「再答對 N 題翻驚喜卡」。
- `_game_data.js` 載入時就會檢查「每個遊戲 30 張、名字不重複」，少一張或重複就 build 失敗。

## 改完怎麼做（順序固定）

```bash
node "G3 - L1 + L2/_build.js"                 # 重建五頁 ＋ Kahoot
node "G3 - L1 + L2/_build_words.js"           # 數字單字、Sight Words（numbers/、sight/）
node words/_verify.js "../G3 - L1 + L2/numbers/one.html"   # 單字頁用 words 的量測
node "G3 - L1 + L2/_verify.js" unit1.html     # 只量改到的那一頁
node "G3 - L1 + L2/_verify.js"                # 改到引擎（sentences/_*.js）就量全部
```

**改到 `sentences/` 的引擎**，兩個網站都要重建、都要量：
`node sentences/_build.js` ＋ `node sentences/_verify.js`，而且 sentences 的產物應該**不變**
（`git status` 看不到 `sentences/*.html` 被改）。有變就是新功能沒有寫成「有寫才開」。

量測 0 失敗才 commit，推到 `main` 網站才會更新（見 `sentences/CLAUDE.md`「每一次改完就存進 GitHub」）。

## 只有老師做得到的

1. 在真的 iPad Safari 點一遍（發音、淺灰色字母看不看得清楚、驚喜卡炸開會不會太吵）。
2. 開一次線上網址確認（製作環境連不到 github.io）。
3. Kahoot 上架：匯入檔 `kahoot_G3_L1L2_24.xlsx`，步驟與檢驗清單在 `kahoot_G3_L1L2_24_題目與上架說明.md`。
