# g34 ── 三年級、四年級共用的「縮寫動畫」「比較」── 規格（接手的 Claude 先讀完再動手）

> 最高原則見根目錄 `AGENTS.md` 第四節。使用者原文：`sentences/2026-10-07_修改清單.md` 第 13、14 點（2026-10-07）。

> **2026-10-10 起全站英文語音 ＝ HiFi-Captain 女聲／男聲**（使用者三次試聽選定，不再改音高；`stress.py` 的記號照原文唸）。
> 重做：`pip install sherpa-onnx lameenc numpy onnxruntime espeakng-loader phonemizer-fork`，下載 `vits-piper-en_US-hfc_female-medium`、`vits-piper-en_US-hfc_male-medium`（sherpa-onnx tts-models）、`sherpa-onnx-whisper-small.en`（asr-models）到 `$TTS_MODELS`，再跑各網站的 `_audio.js`。細節 `sentences/CLAUDE.md` 最上面「2026-10-10 第二批 A 組」。下面寫 Kokoro 的段落是以前的紀錄。

## 這是什麼

兩個年級首頁的第 5、6 個主題。**使用者決定：兩個年級內容一樣**，各自一頁（按鈕回各自的年級首頁）：

| 頁 | 三年級 | 四年級 |
|---|---|---|
| ⚡ 縮寫動畫（10 張） | `G3 - L1 + L2/contract.html` | `sentences/contract.html` |
| ⚖️ 比較（18 張，2026-10-10 加 6 張） | `G3 - L1 + L2/compare.html` | `sentences/compare.html` |

這四頁是產物，**不要手改**。卡片引擎跟兩個句型網站共用（`sentences/_build_cards.js`）；這個資料夾是它自己的「網站」（`SITE_DIR`），只放資料和語音檔。

## 檔案

| 檔案 | 說明 |
|---|---|
| `_data.js` | **唯一真相來源**：`CON`（縮寫動畫 10 張）、`CMP`（比較 12 張）、`SIL`（不發音字母）、`XPAGES`（寫到兩個年級的資料夾，`fix` 換語音檔、頭像路徑） |
| `_audio.js` | 語音檔：`TTS_MODELS=<模型資料夾> node g34/_audio.js`（Kokoro v1.0，女聲 af_bella；Ken 的句子多做男聲） |
| `_build.js` | `node g34/_build.js` 寫出四頁（要先有 `audio/aud.js`） |
| `audio/` | 兩個年級共用的語音檔 |

量測：`node "G3 - L1 + L2/_verify.js" contract.html compare.html`、`node sentences/_verify.js contract.html compare.html`（`_verify.js` 的 `freeDeck()`）。

## 縮寫動畫（第 13 點）

I am／You are／He is／She is／It is／We are／They are／What is／Who is／Where is，每一組一張「縮寫變身」卡（`type:'morph', rows:1`）：
① 唸 I am（念到哪個字哪個字亮）② 紅色的 a 飛走、紅色的 ’ 站上去 ③ 黏成一個字 ④ 唸 I’m ⑤ 亮出兩行
`I am ______.`／`＝ I’m ______.`（**＝ 在第二行第一個字母的左邊**、兩行第一個字母對齊），先唸上面、＝ 放大、再唸下面。英文下面一律有中文和圖示。

- 縮掉的母音（am 的 a、is 的 i、are 的 a）和 ’ 一律紅色。
- 淡灰色（不發音）：are 的 e、’re 的 e、What 的 h、Who 的 W、Where 的 h 和最後的 e（使用者指定）；另外照三年級的規則（name 的 e、you／your 的 o、years 的 a），兩個年級看到的一樣；When、Why 的 h 照四年級「wh 的 h 淡灰」。
- 主詞底色照兩個年級原本的：I 淺粉、You 藍、He 藍、She 淺粉。圖示：It 🧸（東西）、We 👫、They 👨‍👩‍👦、Where 📍。

## 2026-10-10 第二批 A 組第 9 點（比較改成 18 張）

| # | 使用者要的 | 做法 |
|---|---|---|
| 9(1) | 第 3 頁 My、Your 底色不同 | My 淺粉 `lp`（跟 I 一樣）、Your 藍 `b`（跟 You 一樣）（Q8 ①） |
| 9(2) | 第 12 頁（問什麼？）母音字母紅色 | 卡片 `vr:{字:[第幾個字母]}`（引擎 `enV()`，`.fgrid .fa .vw` 紅）：What 的 a、Who 的 o、Where 的第一個 e、When 的 e、**Why 的 y、How 的 ow**（Q7 ①：唸出母音的字母）；淡灰（不發音）優先，Where 最後的 e 照舊淡灰 |
| 9(3) | 最後加 6 頁 | `CMP2`（`cmp` 卡，每個字都是 `kw` ➜ 唸到哪個字那個字和中文一起亮）：13 What ______?（What is your name?／What is this?／What time is it?）14 What’s ______?（What’s your name?／What’s this?／What time is it?）15 What ______?（What is this?／What are these?）16 How ______?（How are you?／How old are you?〔old 黃底：How ＝ 幾、old ＝ 歲〕／How is the weather?／How often do you go to **the** movies?）17 Where ______?（Where are you?／Where is he?／Where is she?／Where is Emma?）18 Where’s ______?（Where are you?／Where’s he?／Where’s she?／Where’s Emma?） |
| 中文（Q9 ①） | | What time ＝ 幾點、How often ＝ 多常、to the movies ＝ 看電影（三個字一格）、go ＝ 去、these ＝ 這些、weather ＝ 天氣；**it、the、do 沒有意思 ➜ 中文空白**（跟 I like to 的 to 一樣） |
| 查證 | How often do you go to movies? | **要加 the**：Longman「the movies」（We took the kids to the movies.）https://www.ldoceonline.com/dictionary/the-movies 、Merriam-Webster「movie」（went to the movies last Friday）https://www.merriam-webster.com/dictionary/movie 、Longman「often」S1（How often do you see your parents?）https://www.ldoceonline.com/dictionary/often 、Google Ngram 美式英文 2010～2019：go to the movies 是 go to movies 的 8 倍 |
| 量測 | 第 16 張一行 1400px，直式 iPad 縮到 0.46 | 英文實際 41px 高 ＝ 橫式比較卡（42px）➜ 比較卡改量「英文實際多高 ≧ 38px」。試過讓長句折行：grid 欄寬會被壓到很窄、折得很醜，不用 |
| 語音 | Emma 單獨唸聽寫成 Amma、the 聽成 though | Kokoro 音標 /ˈɛmə/、/ðə/ 是對的（很短的字單獨唸，聽寫常寫錯），不是唸錯 |

## 比較（第 14 點）

| 張 | 內容 |
|---|---|
| 1 | A. I／My／You／Your（秒懂重點：英文、＝、中文三欄，一次出一個字） |
| 2 | B. I am ______.／You are ______.；例句 I am Ken.／How old are you?（重點字 I am、are you） |
| 3 | C. My name／Your name；例句 My name is Ken.／What’s your name?（重點字 My name、your name） |
| 4 | D. How old ______?／______ years old.；例句 How old are you?／I’m ten years old.（重點字 How old、years old） |
| 5～7 | E. He is ＝ He’s、She is ＝ She’s、It is ＝ It’s（各一張縮寫動畫，跟縮寫動畫第 3～5 張同一張） |
| 8 | E. 比較 He’s／She’s／It’s ______.；例句 He’s my father.／She’s my mother.／It’s my book.（重點字 He、She、It ＝ 他、她、它） |
| 9～10 | F(1). What／Who／How ______?，再一張「💡 問什麼？」動畫 |
| 11～12 | F(2). What／Who／Where／When／Why／How ______?，再一張「💡 問什麼？」動畫（Where 問地方、When 問時間、Why 問原因） |

比較卡（`type:'cmp'`）：一欄靠左（**每一行第一個字母上下對齊**）、一行一行出現、一行一行唸；
**只有重點字（`kw:1`）唸到的時候，那個字和它的中文稍微放大、稍微變亮**，其他字不亮（使用者指定）。

## 語音（2026-10-07 Whisper 聽寫）

一兩個字單獨唸（It is、They、Who’s…）開頭大寫加句點唸，聽寫才聽得出來（`_audio.js` 的 `speak`）。
Kokoro 每次做出來會有一點點不同：`it is` 有一次聽成 Here is，換成聽寫正確的那一次（同一個模型、同一句）。
對不上但**不是唸錯**的（Kokoro 詞典音標是對的）：
- 同音字：they’re ＝ there（/ðɛɹ/）、where’s ＝ wares、who ＝ two；we’re（詞典 /wɪɹ/）被寫成 where。
- 很短的字單獨唸寫成字母：am ➜ M、are ➜ R、he ➜ T；she’s ➜ cheese；Ken（女聲）➜ can；ten ➜ 10 10。
- 一串疑問詞連著唸（What, who, how…）：who 被寫成 to／you；I, my, you, your 被連成 I might use your。
