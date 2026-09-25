# 三年級 L1 ＋ L2 句型網站 — 規格（接手的 Claude 先讀完再動手）

使用者是國小英語教師。**這份規格是使用者指定的結果，不要自行「優化」。**
根目錄 `AGENTS.md` 第四節（品質與省額度的固定規則）同樣適用。
**引擎跟 `sentences/` 共用**，所以 `sentences/CLAUDE.md` 裡的字卡規則、發音引擎、答錯獨立頁、
語速六段、音效暫時刪除……全部適用，這一份只寫「這一課不一樣的地方」。

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
| 19(8) | 名字的頭像照老師的截圖 | **截圖沒有傳進這個對話**。先用 emoji；把圖片放進 `avatars/`（`ken.png`、`mike.png`、`alan.png`、`wendy.png`、`emma.png`）重新 build 就會換成圖片（`av()`） |
| 19(9) | 秒懂重點：英文、中文、等號上下對齊 | 引擎的 `.fgrid`（`eqRow` 的卡都是） |
| 19(10) | 一問一答 My name is Wendy ➜ **Emma** | `U1[13]` |
| 19(11) | 新卡：**My name is Ken. ＝ I am Ken. ＝ I’m Ken.** | `U1[9]`：`eq` 卡多一個 `c`（第三句），`left:1` 三句靠左 |
| 21 | Unit 2 語序：你／幾歲底色太像；點「幾歲」上下一起亮；are 的 e 看不清楚 | 「你」改很淡的粉紅（引擎 `.chip.lp`）；點任何一格上下同色一起放大變亮（引擎 `lnk()`）；底色上的淺灰字母改成半透明深色 |
| 22 | 新卡：**I am ten years old. ＝ I am ten. ＝ I’m ten.**，三句的 I 上下對齊 | `U2[8]`（`left:1`） |
| 23 | Unit 2 秒懂重點 I’m 上下對齊 | 他問他答卡的答句靠左（引擎 `.ebub.a`） |
| 24 | Unit 2 所有句型的數字一律 ten | `W.ten()`；替換字還是 6～12 |
| 18 | **🔢 數字單字** zero～twelve：字卡（母音紅、不發音灰、音節切開）＋ 結構 ＋ 故事 ＋ 環遊世界 ＋ 出處 | `numbers/`，產生器 `_build_words.js`（樣板跟 words/ 家人單字**同一套**：`words/_section.js`） |
| 20 | **👀 Sight Words** I, My, You, Your, I am, You are, name, is, What, What’s, How, old, How old, year, years old | `sight/`，同上 |

卡片數現在是 **Unit 1 16 張、Unit 2 17 張**（複習題照每 4 張一組，最後一組 4～5 張）。

**不發音字母照使用者的清單**：one 的 e、three 字尾 e、four 的 u、five 的 e、eight 的 gh、nine 的 e、twelve 字尾 e；
You／Your 的 o、are 的 e、name 的 e、What 的 h、year 的 a（`words/_phonics.js` 的 `RAW`）。
**two 的 w 其實也不唸**（/tuː/），清單沒有列，**先照清單不標灰**（tw 放同一格、音標寫 /t/），已經問使用者要不要也標灰。

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
| 🩷 淺粉底 | `you` 你 ➜ `I` 我 | Unit 2 他問他答卡（第 11 張）、一問一答卡：粉色的 you 自己飛到 I |

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
