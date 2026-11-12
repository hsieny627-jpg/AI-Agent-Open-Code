# 🔤 Phonics Master（phonics/）— 規格（接手 的 Claude 先 讀完 再 動手）

> 2026-11-12 第四十七次 第 2 點：老師 的 Phonics Master（原本 在 claude.ai 字卡 頁 https://claude.ai/artifact/PBkfDY3omYxT4VYRMaH4Yw）加進 網站。
> 根目錄 `AGENTS.md` 第四節 同樣 適用。⚠ 老師：只 說 改 一個 地方 就 只 改 那 一個 地方。

## 網址
- 字卡 https://hsieny627-jpg.github.io/AI-Agent-Open-Code/phonics/
- 🎮 CVC 遊戲 https://hsieny627-jpg.github.io/AI-Agent-Open-Code/phonics/games.html
- 總首頁 最下面 一區「🔤 自然發音 Phonics Master」（`words/_build_hub.js`）

## 檔案
| 檔案 | 做 什麼 |
|---|---|
| `_ph.js` | 共用 資料（字首、母音、字尾、雙語 注音、KK、IPA）＋**發音 碼**（`code(字首, 母音, 字尾)` 例 `k-ae-d`）＋碼 ➜ 音標（`ipaOf`）＋`BAD`（唸起來 像 不雅 字 的 碼，永遠 不放）＋`skip()` |
| `_card.html` ➜ `index.html` | 字卡 頁（老師 原本 的 版面、顏色、按鈕 **都 沒 改**；只 改：發音、♥、例外 字、右上角〔🎮 遊戲〕〔🏠 總首頁〕；語音 選單 拿掉 ＝ 不再 用 瀏覽器 語音；「語速」0.8／0.95／1 ＝ 播放 速度）|
| `_games.html` ➜ `games.html` | 🎮 四個 遊戲（見 下面）|
| `_words.js` | 遊戲 的 真的 單字 63 個（[字, 中文, 圖示]）；build 檢查：CVC、c／g 在 a o u 前、k 在 e i 前、不是 例外、有 音檔 |
| `_enum.js` | 列出 字卡 會 出現 的 每 一個 組合 ➜ `_all.json` |
| `../tools/ph_exc.py` | 例外 字：CMU 美式 發音 字典 裡 有、而且 唸法 跟 字卡 規則 不一樣 ➜ `_exc.json`（`拼字|碼`，578 個；例 said、word、ward、wad、quad、good、hood、wood、bar（b＋a＋r）、be…）＝ 暫時 不放 |
| `_codes_build.js` | 要 做 語音 的 碼 ➜ `_codes.json`（6,318 個：字卡 的 每 一種 唸法＋單獨 一個 音 `s_b`、`s_ae`…）|
| `../tools/ph_gen.py` | 音標 直接 送進 HiFi-Captain 女聲（`tts_gen.hf_raw`，語速 0.76）➜ `au/<碼>.mp3`；z 開頭 ＝ 電腦 聽寫 聽到 z 才 用 |
| `../tools/ph_zfix.py` | z 開頭 重做：拉長 的 z（zz、zzː、zː），聽寫 是 z 才 換（312 個 裡 308 個；`_zbad.json` 4 個 還是 不像：z-ai-d、z-ar-d、z-eh-z、z-uu-r）|
| `_build.js` | `node phonics/_build.js` ➜ 兩頁 |
| `_verify.js` | `node phonics/_verify.js`（100 項）|

重做 全部：`node phonics/_enum.js && python3 tools/ph_exc.py && node phonics/_codes_build.js && TTS_MODELS=<模型> python3 tools/ph_gen.py && TTS_MODELS=… python3 tools/ph_zfix.py && node phonics/_build.js`
（模型：`vits-piper-en_US-hfc_female-medium`、`sherpa-onnx-whisper-small.en`；**sherpa-onnx 要 1.12.40**，2.0 版 不能 用 Piper 模型）

## 第四十七次 老師 的 話 ➜ 做法
| 老師 | 做法 |
|---|---|
| (1) kad、quad、wad 的 a 像 ㄚ | 音檔 照 碼 做：a ＝ /æ/（ㄚㄝ）。quad、wad 是 真的 字（唸 /ɑ/）＝ 例外 不放 |
| (2) S 和 Z 太 像 | z 開頭 拉長＋電腦 聽寫 挑（見 上表）|
| (3)-A Ced 唸 c, e, d | 不再 用 瀏覽器 語音（它 看 字 猜）；全部 預先 做好 的 音檔 |
| (3)-B #ward 唸 真的 字 | 真的 字、唸法 跟 規則 不一樣 ＝ 暫時 不放（**等 老師 選**：A 不放／B 照 規則 唸＋標「⚠ 例外」／C 唸 真的＋另外 寫 真的 注音）|
| (3)-C 列出 的 字 | 碼 都 對（量測 `want` 表：Ced ＝ s-eh-d、kod ＝ k-aa-d、zoux ＝ z-ou-ks…）|
| (3)-D ㄚ 右上角 ♥ | o、ar 的 `sup` 拿掉 |
| (4)(5)(6) 拉霸機＋三種 遊戲 | 見 下面 |
| (7)(8) 建議 | 寫在 對話；**老師 同意 才 做**（下面「等 老師」）|

## 🎮 CVC 遊戲（games.html）
一場 10 題；〔🟢 簡單：a i o〕〔🔥 全部：a e i o u〕；🪙 金幣、🔥 連對、⭐ 星星、🏆 最佳 紀錄、📖 單字 圖鑑（抽到／答對 的 真 單字 收集 起來，存 在 這台 平板 `phm_book`）；結束 頁 ＝ 答錯 的 字（字＋雙語 注音＋中文＋🔊）。聲音 一律 `au/` 音檔（一個 播放器，iPad 第一次 碰 就 解鎖、每 一次 都 有 保險 計時）。
| 遊戲 | 玩法（聽／說／讀／寫）|
|---|---|
| 🎰 CVC 拉霸機 | 拉 拉桿 ➜ 三個 轉輪 一個 一個 停（停 一格 ＝ 唸 那 一個 音＋出現 雙語 注音）➜ 🗣 先 自己 唸（3 秒）➜ 👂 三個 聲音 A B C 選 一個（錯 的 只 差 一個 音）➜ 真的 字 ＝ JACKPOT（圖＋中文＋收進 圖鑑）、不是 字 ＝ 👽 外星 字（英國 Phonics Screening Check 也 用 外星 字 考 拼讀）|
| 🛸 聽音 打 飛碟 | 聽 一個 字 ➜ 打 寫著 那個 字 的 飛碟（四個，錯 的 只 差 一個 字母）；愈 快 分數 愈 高 |
| 🔐 聽音 拼字 保險箱（進階）| 聽 ➜ 轉 三個 密碼 輪（字首、母音、字尾，選項 是 容易 搞混 的）➜〔🔓 開鎖〕；錯 一次 ＝ 對 的 變 綠 鎖住、可以 再 試；〔🐢 一個 音 一個 音 聽〕＝ 鷹架 |
| 🀄 看字 選 注音 | 看 字 ➜ 三排 雙語 注音 選 一排（錯 的 只 差 一格：母音 或 字首）|
拉霸機／外星 字：c、g 只 在 a o u 前面、k 只 在 e i 前面（英文 拼字 習慣），不 會 出現 例外 字、不雅 字。

## 等 老師（第四十七次 問了，還 沒 回答）
1. 例外 字（said、word、good…）A 不放（現在）／B 照 規則 唸＋標「⚠ 例外」／C 唸 真的＋寫 真的 注音
2. (7) 基礎版、進階版 的 字首、母音、字尾 要 放 哪些（建議 在 對話；Fry 2004 原文 表 核對 過 的 數字 在 需求檔「第四十七次」）
3. 字卡 頁 下面 的 小 按鈕（11～14px）要不要 放大（老師 的 原 設計，沒 動）
4. 遊戲 要不要 記 成績、進 老師看板
