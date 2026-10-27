# 🏰 守城、🎣 釣魚（fun/）— 規格（接手的 Claude 先讀完再動手）

> 2026-10-26 老師第二十九次 第 3 點：C32 遊戲點子「先做 1 🏰 全班 守城、2 🎣 英文 釣魚；放在哪裡 C 兩個都要」。需求檔 `sentences/2026-10-16_C_需求與問題.md` 第四節最下面「第二十九次」。
> 現場任務 版 在 `live/`（`live/CLAUDE.md` 最上面）。
> **⏸ 2026-10-27 第三十一次 老師：兩個 遊戲 暫時 下架**：在家複習 首頁 不放、〔🔒 開關〕不列（`sentences/_review_sites.js` 的 `FUN_ON ＝ false`）、現場任務 大螢幕 不列（`live/_host_rt.js` `GRP`）。網頁 檔案 照樣 build（`node fun/_build.js`），放回來 只 改 那 兩個 地方；`fun/_verify.js` 量「首頁 沒有 連結」（跟著 `FUN_ON`）。根目錄 `AGENTS.md` 第四節 同樣 適用。

| 項目 | 做法 |
|---|---|
| 檔案 | `node fun/_build.js` ➜ `g3-review/castle.html`、`g3-review/fish.html`、`g4-review/castle.html`、`g4-review/fish.html`（在家複習 自己 的 資料夾，回首頁 ＝ `index.html`）＋ `fun/_pool.json`（題庫，老師看板 錯題 分析 用） |
| 題目 | 老師 選擇題 A：自己 年級 的 句型遊戲＋Review 1 遊戲（`live/_qbank.js`）；**🔒 全 英文**：拿掉 中文 提示（`<small>`、`.qz`），題目 或 選項 還有 中文 的 不用（分類大師、變身術、看英文選中文 不用）；聽力 題 ＝「🔊 Which one do you hear?」。三年級 464 題、四年級 454 題 |
| 玩法 | 1 分 30 秒；下面 一題 四個 大 按鈕（≧ 48px、字 ≧ 22px）；答錯 ＝ 正確 答案（每一個 字 下面 中文、整句 翻譯、唸 一次，時間 停住）、那一題 過 4 題 再 出現（Metcalfe 2017）。🏰：怪物 三波＋魔王 一直 走過來，答對 ＝ 大砲 打 最前面 的，連對 3 題 ＝ 砲台（每 6 秒 自己 打），碰到 城牆 少 一顆 ❤（3 顆）。🎣：答對 ＝ 魚餌 ➜ 拋竿 ➜ 浮標 一沉「❗」1.5 秒 內 按〔🎣 收線！〕＝ 釣到（答得 快 ＝ 🌟 稀有、👑 傳說 機會 大）；每一條 魚 ＝ 那一題 的 英文＋中文＋唸 一次；水族箱、圖鑑（這台 平板 `fish_album`） |
| 成績 | 登入（`score/_client.js` home）；題組 `g年級gm_fun-castle`／`fun-fish`（🎮 遊戲）；〔🔒 開關〕代號 `g年級rv_fun-castle`／`fun-fish`（`sentences/_review_sites.js`） |
| 量測 | `node fun/_verify.js`（兩個 年級 ✕ 兩個 遊戲 ✕ 三種 螢幕：全 英文、選項 大小、不 超出、答對、釣魚 收線、答錯頁 時間 停、結束 送 成績、在家複習 首頁 有 連結） |
