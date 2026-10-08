# 成績紀錄（score/）— 規格（接手的 Claude 先讀完再動手）

> 2026-10-07 對話 C 做的。使用者的需求原文：`sentences/2026-10-06_C_在家複習與成績紀錄_需求.md`；
> 設計、研究證據（21 條）、使用者的決定：`sentences/2026-10-07_C_設計與研究清單.md`（**Q1～Q18 使用者 2026-10-07 全部照建議**）。
> 根目錄 `AGENTS.md` 第四節（最高原則、品質、省額度）同樣適用。

## 這是什麼

兩個教學網站（三年級 `G3 - L1 + L2/`、四年級 `sentences/`）和在家複習（`g3-review/`、`g4-review/`）每一個分頁最後面的〔📝 複習題 5 題〕，
做完把成績存進**老師自己的 Google 試算表**（Google Apps Script），學生看到結束六幕和排行榜，老師用看板 `teacher/index.html` 看全部成績、一鍵下載 Excel。

## 檔案分工

| 檔案 | 說明 |
|---|---|
| `_calc.js` | **怎麼算的唯一真相來源**（正確率、總分百分制、次數、進步、名次、班級、錯題、學生看得到的資料）。Apps Script、老師看板、量測都用這一份；只寫 ES5 |
| `_server.js` | Apps Script 那一半（試算表、密碼、作廢、開關） |
| `Code.gs` | **產物**（`_calc.js` ＋ `_server.js`），老師整份貼進 Apps Script。不要手改 |
| `_client.js` | 學生端畫面（登入、作答中名次、結束六幕、沒網路補送），`sentences/_tq.js` 的 `scJS()` 接進每一頁 |
| `_teacher.js` | 老師看板樣板 ➜ `teacher/index.html`（產物，不要手改） |
| `_xlsx.js` | 自己寫的 .xlsx 產生器（不用外部函式庫） |
| `url.js` | `window.SCORE_URL`：Apps Script 網址。**空白 ＝ 整套關掉**（📝 複習題照 2026-10-04 的樣子） |
| `_build.js` | `node score/_build.js`（`sentences/_build.js`、G3 的 `_build.js` 最後也會跑） |
| `_gas_stub.js` | 在 node 裡假裝成 Apps Script，跑真的 `Code.gs` |
| `_test.js` | `node score/_test.js`：規則＋Apps Script（48 項） |
| `_verify.js` | `node score/_verify.js`：瀏覽器量學生 4 頁＋老師看板 ✕ 3 尺寸（iPad 橫、iPad 直、教室觸控螢幕 1920×1080） |
| `Google部署說明.md` | 給使用者的一步一步部署說明 |
| `_deploy_page.js` ➜ `deploy.html` | **部署步驟大字版**（使用者 2026-10-08：說明看不懂、視力不佳 ➜ 字放大、秒懂圖表、秒懂動畫）：一頁一步共 9 步、示意圖＋👆 手指照順序點、上面一行金色字寫現在按哪裡、〔📋 複製程式〕（Code.gs 放在網頁裡）、A＋／A－、記得做到第幾步。量測 `node score/_verify_deploy.js`（5 種尺寸 ✕ 兩種字級：字 ≧ 24px、標題 ≧ 32px、原本字級一頁放得下、〔下一步〕永遠看得到、手指點在對的地方、複製到整份 Code.gs） |
| 不用 setup | 2026-10-08：部署步驟拿掉「執行 setup」——第一筆成績送進來 `sheet()` 會自己建工作表；授權在部署時按允許 |

## 規則（使用者決定，不要改）

| # | 規則 | 在哪裡 |
|---|---|---|
| 登入 | 5 碼 ＝ 班級 3 碼＋座號 2 碼；三年級 304／307／311、四年級 402／406／409／410；座號 01～40；三年級網站擋四年級的號碼（Q17） | `_calc.js` `checkId`、`_client.js` `scCheck` |
| 名單 | 預設關（使用者 2026-10-07：只用 5 碼）；指令碼屬性 `ROSTER=on` ＋ 試算表「名單」才問「你是 ○○○ 嗎？」。**名單、姓名永遠不可以寫進 repo** | `_server.js` `who` |
| 密碼 | 只放 Apps Script 指令碼屬性 `TEACHER_PW`；**repo、網頁、說明檔都不可以出現密碼** | `_server.js` `pwOk` |
| 記哪裡（Q5） | 教學網站＋在家複習的〔📝 複習題 5 題〕；暖身、遊戲、Review 1 不記 | — |
| 登入（Q6） | 教學網站一定要登入（平板記住，`localStorage score_id_g3／g4`）；在家可以〔👀 先練習，不記成績〕 | `_client.js` |
| 題組代號 | `g年級u單元_分頁`（例 `g3u1_1-1b`）；在家複習用教學網站同一組題目 ＝ 同一個代號，成績算在一起 | `sentences/_tq.js` `map()` |
| 🎯 正確率 | 答對 ÷ 題數 ✕ 100 | `_calc.js` |
| ⚡ 總分（Q1-A） | 答對 60 ＋ 速度 40（每題 60÷題數，再加 40÷題數 ✕ 剩下秒數÷總秒數）。作答中的大數字照舊 100＋900 | `s100` |
| 個人（Q8-A） | 每一組取最近一次，再平均 | `students` |
| 🔁 次數（Q11-A） | 答對 ≧ 題數 ✕ 2/3 才算（5 題對 4 題）；同一組一天最多算 3 次 | `counts`、`CAP` |
| 🚀 進步（Q3-A） | 每組最近一次 − 上一次（秒按超過一半的那一次不比）；個人 ＝ 平均；100→100 ＝ 🔥 保持滿分 | `students` |
| ⚡ 秒按（Q10-A） | 1 秒內就按；認讀從聽完第一句開始算、其他從題目出來開始算；只給老師看 | `_client.js` `scDone` |
| 名次（Q14-A） | 正確率同分比總分，再同 ＝ 同名次；學生只看到前 10 名，**不在前 10 名不給名次數字**（使用者 2026-10-07） | `rank`、`view` |
| 差距（Q2-A） | 差距小（分數 20、次數 5 以內）才寫「再 N 進前 10」，差太多改寫自己的進步／紀錄 | `scMineHTML` |
| 本週（Q12-A） | 台灣時間星期一 00:00；學生看本週，老師看板可選本週／上週／全部／自訂 | `weekStart` |
| 班際（Q9、Q13） | 只跟同年級比；平均 ＝ 有做的人；參與率要老師在試算表「班級人數」填人數 | `classes` |
| 開關（Q4-A／S8） | 老師看板〔🏆 學生排行榜 開／關〕（指令碼屬性 `BOARDS`）；關掉時學生拿不到任何排行 | `_server.js` |
| 作廢（Q7-A） | 老師看板點人 ➜〔🚫 作廢〕，或試算表最後一欄打 TRUE；看得到哪一台平板（`score_dev`） | `_server.js` `void` |
| 沒網路 | 先存平板（`score_q`），連上網補送；伺服器用「編號」去重複 | `scFlush` |

## 學生結束六幕（`_client.js` `scScene`）

① 🎯 正確率圓圈從 0 長上去 ➜ ② 🚀 跟上一次比（兩條長條＋＋N%／🏅 新紀錄／⭐ 第一次／🔥 保持 100%；退步不寫負數）➜
③ 🔁 算不算 1 次（印章蓋下去；不夠寫「再多對 N 題」；一天滿 3 次寫「明天再來」）➜ ④ 🏫 我幫全班（同年級各班長條，**不寫誰拉低全班**）➜
⑤ 🏆 排行榜（四種 ✕ 本班／全年級，頒獎台）➜ ⑥ 📌 答錯整理＋〔🔁 再挑戰一次〕〔➡ 下一個分頁〕。①～④ 自己換幕，⑤ 等學生按，⏭ 跳過直接到 ⑥。

## 量測

```bash
node score/_test.js                    # 規則＋Apps Script
node score/_verify.js                  # 學生 4 頁＋老師看板 ✕ 3 尺寸
node sentences/_verify.js unit1.html   # 原本的複習題流程（成績紀錄在這裡用 __SCORE_TEST_OFF 關掉）
node sentences/_verify_review.js       # 在家複習
```

改到 `_calc.js`、`_server.js` ➜ 要提醒使用者照部署說明「程式更新以後」重新貼 Code.gs、部署新版本。

2026-10-07 量測：`score/_test.js` 48 項、`score/_verify.js` 699 項、`sentences/_verify.js unit1 unit2` 614 項、`G3 _verify.js unit1 unit2` 544 項、`_verify_review.js` 637 項，全部 0 失敗。
量測抓到改掉的：排行榜那一幕 iPad 橫放多出 98px（`max-height:860px` 時頒獎台變矮、名單 3 欄）；量測用的 Chromium 會把中文下載檔名換成 download ➜ Excel 檔名改成 `score_G3_304_week_2026-10-07.xlsx`。
