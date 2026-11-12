# 🔤 Phonics Master（phonics/）— 規格（接手 的 Claude 先 讀完 再 動手）

> 2026-11-12 第四十七次 第 2 點：老師 的 Phonics Master（原本 在 claude.ai 字卡 頁 https://claude.ai/artifact/PBkfDY3omYxT4VYRMaH4Yw）加進 網站。
> 根目錄 `AGENTS.md` 第四節 同樣 適用。⚠ 老師：只 說 改 一個 地方 就 只 改 那 一個 地方。

## 2026-11-12 第四十八次（先讀這一節；需求檔 `sentences/2026-10-16_C_需求與問題.md` 第四節 最下面「第四十八次」）

### 老師 的 回答（第四十七次 等 老師 的 4 題）＋ 我 問 的 選擇題
| 問題 | 老師 | 做法 |
|---|---|---|
| 例外 字 | A ＋ 真字 音檔 ＋ 真字 雙語 注音；選擇題：**甲＋乙 都 要** | 甲 ＝ 新 頁 `exceptions.html`（⚠ 例外 字 清單：🔊 真的、照 規則 會 唸 成…）；乙 ＝ 字卡 放回 去：左上角「⚠ 例外：不照 規則」、字母 下面 一排「真的 唸法」（真的 雙語 注音／KK／IPA）、點 卡 ＝ 唸 真的（`au/x_<字>.mp3`）。**只 放 常見 的**（`tools/ph_exc2.py`：CMU 字典 唸法 不一樣＋wordfreq Zipf ≧ 3.3＋一般 字典 web2 有 的 小寫 字＋三個 字母 以上＋不在 人工 挑掉 的 NO 清單：人名、縮寫、罕見、不雅、喝酒）＝ 153 張 卡、150 個 字（said、come、done、good、word、want、was、what、who、four、the…）；不 常見 的 照舊 不放（A）|
| (7) 基礎版、進階版 | 暫時 完全 依 建議；**嚴禁 更動 原本 字卡**，另外 建 | `basic.html`、`advanced.html`（同 一個 樣板 `_card.html`＋`window.DECK`，資料 `_ph2.js` 的 `DECKS`）。原本 `index.html` 的 卡片 一張 都 沒 變（量測：卡片 數、碼 照舊）|
| 字卡 頁 小 按鈕 | 稍微 放大、嚴禁 影響 中間 的 單字 | 按鈕 11→13.5px、英文 按鈕 14→17px、標籤 9.5→12px、頁數 11.5→14px、箭頭 38→46px；中間 字母 的 大小 公式 沒 動（量測：≧ 100px、字卡 沒有 被 切掉）|
| CVC 遊戲 記 成績 | 要 | `g年級gm_ph-遊戲`（年級 看 登入 的 5 碼；類別 ＝ 🎮 遊戲）；送 法 跟 三年級 複習 一樣 `scQAdd`，格式 用「題目」(`m:'q'`) ＝ 做完 5 題 就 算 練習 次數 ＋1（遊戲 格式 要 ≧ 6 題）。老師看板 題庫 `score/_bank.js` 最下面「🔤 自然發音」（26 組，第幾題 ＝ `ITEMS` ＝ `_words.js`＋`_pseudo.json`；課本 ＝ `_book.js` 順序）。**`_calc.js`／`_server.js` 沒 改 ＝ 不用 重新 部署** |
| 部位 新 按鈕 | 選擇題 老師 自己 寫：〔全無〕只 聽；〔字首：無〕〔母音：無〕〔字尾：無〕；〔字首＋母音〕＝ 只 看到 ba、唸 ba；〔母音＋字尾〕＝ 只 看到 ad、唸 ad；最 秒懂 最 簡化 | 部位 自己 一排 10 顆，每 顆 上面 三個 小 方塊（藍 字首、粉 母音、藍 字尾；實心 ＝ 看得到、虛線 ＝ 藏起來、沒有 ＝ 拿掉）。〔全無〕＝ 字母、音標 都 藏，卡片 中間「🎧 聽 聲音，猜 猜看」。聲音：字首＋母音 ＝ `b-ae`、母音＋字尾 ＝ `0-ae-d`（`PH2.partCode`）|
| 拉霸機 題數 | 乙：固定 5 題 | 全部 遊戲 一局 5 題（`NQ`）|
| 新 聲音 | 甲：直接 換＋試聽頁 | https://hsieny627-jpg.github.io/AI-Agent-Open-Code/listen/2026-11-12_P48/ （舊 的 在 `listen/2026-11-12_P48/old/`）|
| i_e 注音 | ㄞ | `_ph2.js` `VOW2.i_e` |
| u_e | 兩種 都 放：/ju/ 寫 一ㄨ、/u/ 寫 ㄨ | 前面 最後 一個 子音 是 r l j ch sh t d n s z th ➜ /u/（rule、flute、tube），其他 /ju/（cute、cube、mule）＝ `PH2.uIsU` |
| ng、nk | ㄥ（nk ＝ ㄥㄎ）| `CONS2.ng`、`CONS2.nk` |

### 基礎版、進階版（第四十七次 我 的 建議，老師 同意）
| 版 | 字首 | 母音 | 字尾 |
|---|---|---|---|
| 🟢 基礎 | 原本 18 個＋**v（寫 v）、y（寫 一）** | 短 a e i o u | 1：b d g m n p t x／2：s ck |
| 🔵 進階 | 雙子音 bl cl fl pl sl br cr dr fr gr pr tr sk sm sn sp st sw／三子音 scr spl spr str／單子音 | 短 a e i o u、magic e a_e i_e o_e u_e、ai ay ee ea oa ow | 1：無 b d g k l m n p t x／2：nd nt mp st sk ft／3：sh ch th ck tch ng nk |
進階版 只 放 合 英文 拼字 習慣 的（`PH2.fits`）：magic e 後面 只 放 b d k l m n p t（g s r 加 e 會 變 音）、ay ow 只 放 最後（無 字尾）、短 母音 不 配 無／k／l、ck tch ng nk sh 只 跟 短 母音、e＋ng／nk 不放。magic e 的 卡：母音 字母 黃底、最後 的 e 灰色（不 唸）。

### 聲音（`tools/ph_gen2.py`，要做的 清單 `node phonics/_codes2_build.js` ➜ `_codes2.json`）
| 種類 | 做法 |
|---|---|
| r 沒有 意思 的 組合 | 音標 直接 送 HiFi-Captain 女聲（語速 0.8，跟 原本 一樣）|
| w 真的 英文 字（約 2,000 個：照 規則 的 真的 字 `_realreg.json`、例外 字 真的 唸法 `x_<字>`、課本 字 `bk_`）| 做 完 用 電腦 聽寫（Whisper small.en）聽，**聽到 的 ＝ 要 的 字（或 CMU 唸法 一樣 的 同音字）才 用**，不 一樣 換 語速 重做，最多 12 次（老師：big 怪怪 的 ➜ 舊 的 big 聽寫 聽成 beg）。12 次 都 不 對 ＝ 再 重做 30 次（`PH_RETRY=1`）。結果：2,207 個 裡 2,113 個 聽 對；**還是 聽 不 準 的 94 個 記在 `_asrbad.json`**（多 是 人名、罕見 字：moor、geek、than、fume…，只 在 字卡 出現）；遊戲 字 只有 tub 聽成 Tom ➜ **tub 從 遊戲 拿掉**（`_words.js` 剩 62 個，字卡 照舊）|
| t 單獨 一個 音 | 做 完 從 聲音 開始 只 留 N 毫秒＋淡出：b d 75、g 85、p t 95、k 105、j 150、ch 160（**塞音 只 剩 爆破 那 一下 ＝ 幾乎 沒有 ㄜ**）；m n f s z v sh th l 長音 0.42～0.48 秒；**字尾 m ＝ `s_em`（閉嘴 mmm）、字尾 n ＝ `s_en`（嗯）** |
| 部位 | `<字首>-<母音>`、`0-<母音>-<字尾>` |
重做：`node phonics/_enum.js && node phonics/_enum2.js && python3 tools/ph_exc2.py && node phonics/_codes2_build.js && TTS_MODELS=<模型> python3 tools/ph_gen2.py 4 0 &`（0～3 四份 同時）`&& node phonics/_build.js`。套件 `pip install "sherpa-onnx==1.12.40" lameenc onnxruntime espeakng-loader phonemizer-fork cmudict wordfreq english-words`。

### 🎮 遊戲 場（`_games.html`＋`_games.css`＋`_games.js` ➜ `games.html`）— 取代 下面 第四十七次 的 遊戲 表
**共用**（每 一種 都 一樣）：開場 一頁（玩法 一句＋📝 5 題、⏱ 秒數、⚡ 愈 快 愈 高、🔥 連對 2 題 ➜ ✖2、👑 最後 一題 ✖2）➜ 3 2 1 GO ➜ 上面 5 顆 寶石（現在 金框、對 綠 ✔、錯 紅 ✖、第 5 顆 👑）＋⭐ 分數＋🔥 FEVER 提示（「🔥 再 對 N 題 ➜ ✖2」／「🔥 FEVER 這一題 ✖2」整個 畫面 邊 橘光）＋限時 條（剩 ¼ 變亮）。
答對 ＝ 大 字「＋150」＋一排「✅ 答對 100｜⚡ 快 ＋50｜🔥 FEVER ✖2｜👑 最後 一題 ✖2」（老師：加分 學生 看不懂）＋彩帶 ＋「✅ 答對了！」一頁（字母＋正下方 音標＋圖＋一個 一個 唸＋一起 唸）。
答錯／時間 到 ＝ 綠底 答錯頁：你的 答案（劃掉）、✅ 正確 答案（字母＋音標，點 字母 ＝ 聽）、**嘴巴 提示**（b 👄 喉嚨 震動／p 🪶 吹 氣、d／t、m 閉嘴／n 張開、f／v、母音 a 🍎 張 大／e 🥚／i 🐛 扁扁／o 🐙 圓圓／u ☂️ 放鬆）、唸 兩次、〔🔊 再聽一次〕、唸完 才〔▶ 繼續〕。
結果 ＝ S／A／B／C（5／4／3／≦2 題）＋星星＋⭐ 分數＋最佳 紀錄＋📒 錯題 再 聽（自動 一個 一個 唸）＋〔🔁 再 玩〕〔🎮 換 遊戲〕。
上面〔注音｜KK｜IPA〕切換：全部 字母 下面 的 方塊 一起 換（老師：讓 學 過 KK 的 學生、家長 信任）。學生 頁 中文 說明 不 空格（`score/_dsp.js`）。
| 遊戲 | 玩法 | 秒 |
|---|---|---|
| 🎰 CVC 拉霸機 | 金屬 機台：拉 拉桿 ➜ 轉輪 一個 一個 停（停 一個 ＝ 那個 字母 稍微 放大 發亮＋唸 它 的 音＋正下方 出現 音標）➜ 三個 一起 亮「🗣 先 自己 唸」3 秒 ➜ 右邊「🎧 聽 3 個 聲音，選出 拉霸機 上 的 字」（刪 「哪一個聲音是它？」）➜ 答對：一個 一個 唸 ➜ 三個 一起 亮＋唸 整個 字 ➜ 真的 字 ＝「💡 這是 一個 真的 英文 字！ cat ＝ 🐱 貓　👀 圖 告訴 你 它 的 意思　📖 收進 圖鑑」；不是 字 ＝「🔮 魔法 咒語：不是 真的 英文 字（所以 沒有 圖）✨ 但是 你 會 唸 了 ＝ 學會 拼讀 了」（**👽 外星 字 拿掉**）。轉輪 上 的 字母 隨時 點 ＝ 聽 那個 音 | 25 |
| 🛸 聽音 打 飛碟 | 聽 ➜ 打 寫著 那個 字 的 飛碟 | 15 |
| 🔐 聽音 拼字 保險箱 | 聽 ➜ 轉 三個 密碼 輪 ➜ 開鎖；錯 一次：對 的 綠、錯 的 紅＋那一個 下面 寫 嘴巴 提示＋〔👂 比一比〕（先 唸 你 拼 的、再 唸 題目）；〔🐢 一個 音 一個 音 聽〕；只 考 真的 字（聲音 都 聽寫 檢查 過） | 35 |
| 🀄 看字 選 音標 | 看 字 ➜ 三排（注音／KK／IPA 跟著 切換）選 一排；錯 的 只 差 母音 或 字首 | 15 |
| 🎈 字首音 氣球（新）| 聽 ➜ 戳破 第一個 字母 的 氣球（錯 的 是 容易 搞混 的 b／p／d…）| 12 |
| ⚔️ 母音 對決（新）| 聽 ➜ 中間 是 哪 一個 母音；每 張 卡 有 關鍵 字 圖（🍎 apple、🥚 egg、🐛 insect、🐙 octopus、☂️ umbrella）＋〔🔊〕聽 那個 母音（老師：a／e、e／i、u／o 很 難 分）| 15 |
| 🎯 尾音 狙擊（新）| 聽 ➜ 最後 一個 音 是 哪 一個（b／p、d／t、m／n…，靶 下面 寫 嘴巴 提示）（老師：尾音 難 聽辨）| 15 |
| 🪜 換 字母 爬 階梯（新）| 聽 ➜ 只 換 一個 字母 爬 上去（rat ➜ bat ➜ bag…，換 的 字母 金色）| 15 |
| 🖼️ 看字 找圖（新）| 自己 唸（不 給 聽）➜ 點 對 的 圖 | 15 |
| 🚂 聲音 火車（拼字）（新）| 聽 ➜ 字母 照 聲音 順序 放上 3 節 車廂（＝ 聲音 格 Elkonin boxes）；點 車廂 ＝ 拿 下來；全對 火車 開 走 | 25 |
| 📗 課本 單字 拼塊（新）| 聽 課本 的 字 ➜ 一塊 一塊 照 順序 拼（bed＋room）| 30 |
| 📘 課本 單字 找圖（新）| 自己 唸 課本 的 字 ➜ 點 對 的 圖 | 15 |
**🐣 新手 小學堂**（老師 第 6 點：低成就、怕 英文）：5 課（短 a i o e u，一課 5 個 字）。① 母音 聚光燈（大 字母＋關鍵 字 圖＋嘴巴 提示＋唸 兩次）② 每 個 字：字母 一個 一個 出來＋唸（我 做）➜「慢慢 合 起來」字首 和 母音 靠 在 一起 唸 ba（連續 發音）➜ 再 加 字尾 唸 bag ➜ 圖＋中文 ➜「✋ 換 你」點 每 個 字母、按〔🔗 合 起來〕（你 做）③ ⭐ 小 測驗 5 題（聽 ➜ 選 字，前 2 題 二選一、後 3 題 三選一；成績 `ph-ls`）。下面〔⏸️ 暫停〕〔🐢 放慢〕〔🔁 再一次〕。
**📗 從 CVC 到 課本**（老師 第 7 點，課本 截圖 Topic 2 My Home／We Can Help，資料 `_book.js`）：每 個 字 拆 成 一塊 一塊：✔ 你 會 了（CVC：bed、rab、bit、kit、hap）／💡 新 規則（sh、th、oo、ir、ur、or、all、ng、y 在 最後、magic e、tle…一句 話）／⭐ 常見 字（where）➜ 一塊 一塊 亮＋唸 ➜ 合 起來 唸 整個 字 ➜ ＝ 圖＋課本 中文＋💡 一句 話。⏸ 🐢 🔁 ◀ ▶。音標 ＝ CMU 字典 音素 算 的（`PH2.realTiles`）。
**📖 我 的 單字 圖鑑**：進度 條＋卡片 格（圖＋字＋中文；還沒 收集 ＝ 暗 的 圖＋？？？）。
**🔮 魔法 咒語** ＝ `_pseudo.json`（120 個：CVC、一般 字典 沒有、不是 常見 人名、很少 見；不雅 的 拿掉 sux fux）。
量測 `node phonics/_verify.js`（兩種 螢幕：全部 音檔、部位 10 顆 每 一種、said 例外 卡、按鈕 ≧ 13px、中間 字 ≧ 100px、基礎版／進階版 每 一張 都 有 音檔、blake、例外 字 頁、12 種 遊戲＋小學堂＋課本 動畫 每 一題 不 超出 不 太 小、4／5＝A、成績 g3gm_ph-遊戲 5 題）。測試 開關：`__PHFAST`、`__PHAUTO`、`__PHWRONG`、`__PHN`；`window.PHG`。

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

## 等 老師（第四十七次 問了）➜ ✅ 2026-11-12 第四十八次 老師 回答 了（最上面「第四十八次」）
