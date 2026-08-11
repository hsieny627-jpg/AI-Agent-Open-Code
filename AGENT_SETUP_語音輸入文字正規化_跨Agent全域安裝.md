# 語音輸入文字正規化：跨 Agent 全域安裝說明

> 文件用途：把本文件交給任何具備本機檔案讀寫能力的 AI Agent。Agent 讀完後，應自動偵測這台電腦已安裝的 AI Agent，將「語音輸入文字正規化」規則安全加入各工具的使用者層級全域設定，完成備份、驗證並回報。

## 給使用者的一句話

把本文件交給 AI Agent，然後說：

> **「完整讀取這份文件，依照執行協定，把語音輸入文字正規化規則安裝到這台電腦所有已偵測到的 AI Agent 全域設定；保留原設定，完成後逐套驗證並回報。」**

---

# 一、Agent 執行契約

你是安裝 Agent。讀到本文件後，依序完成以下工作，不要只回覆教學步驟。

1. 完整讀取本文件。
2. 判斷目前作業系統與使用者家目錄；不得使用本文件作者的個人絕對路徑。
3. 偵測這台電腦已存在的 AI Agent。
4. 列出預計修改的設定檔及理由。
5. 修改前為每個既有檔案建立帶時間戳記的同目錄備份。
6. 以「受控區塊」方式合併規則，不覆蓋、不刪除使用者原有設定。
7. 已存在相同受控區塊時更新該區塊，不得重複附加。
8. 驗證每套已偵測工具都能載入規則。
9. 回報成功、跳過、需重啟或需使用者手動處理的項目，以及實際檔案位置。

## 執行邊界

- 僅修改「使用者層級／全域」設定，不修改目前專案的設定檔。
- 不安裝未偵測到的 AI Agent。
- 不覆蓋任何完整設定檔。
- 不改動模型、供應商、MCP、連接器、權限或登入設定。
- 不讀出、不複製、不顯示 API Key、Token、Cookie、OAuth 憑證或密碼。
- 若設定檔內含祕密，只進行必要的結構化局部修改；輸出紀錄不得顯示原檔全文。
- 若缺乏檔案寫入權限，停止該工具的修改，回報需要的授權；不要繞過系統安全機制。
- 一般 ChatGPT 網頁聊天或純雲端聊天不會自動讀取本機設定檔；不得假裝已安裝。只有能確認支援本機全域指令的 Agent 才列為成功。

---

# 二、要安裝的標準規則

以下受控區塊是唯一內容來源。安裝時應保留起訖標記。

```markdown
<!-- BEGIN:SENSEBAR_VOICE_INPUT_NORMALIZATION_V1 -->
## 語音輸入文字正規化

使用者可能以語音輸入，文字中可能出現同音錯字、詞界切分錯誤、標點遺失、英文工具名稱音譯，以及路徑或指令辨識錯誤。

- 先依對話上下文理解使用者最合理的原意，不要逐字死讀。
- 明顯且不影響實際行動的小錯字，直接理解並繼續，不要逐項糾正或打斷使用者。
- 工具名稱可能被音譯或誤辨識。例如在 AI Agent 情境中，`Call Desk` 可能是 `Codex`、`Cloud Code` 可能是 `Claude Code`、`scheme` 可能是 `Skill`。這些只是語境提示，不得在所有情況下強制替換。
- 如果模糊內容會影響實際行動，例如人名、檔名、路徑、指令、工具名稱、數字、日期、金額或核心需求，而且無法從上下文可靠判斷，先用一句話確認理解，再執行。
- 不要默默把關鍵資訊改成猜測版本後直接執行。
- 不要捏造使用者沒有說過的數值、路徑、日期、名稱或授權。
- 回覆時使用自然、修正後的語意即可；除非使用者詢問，否則不必列出所有辨識錯字。
<!-- END:SENSEBAR_VOICE_INPUT_NORMALIZATION_V1 -->
```

## 正確行為範例

### 可直接理解

使用者說：

> 「幫我讀一下這個 report 裡面的 Agent 設定。」

如果目前正在討論 GitHub 專案，且上下文清楚，可理解為「讀這個 repo 裡面的 Agent 設定」，直接繼續，不必特別糾正 `report`。

### 必須確認

使用者說：

> 「把七月二十一號的檔案刪掉。」

如果資料夾同時存在七月十二日與七月二十一日的檔案，日期會影響破壞性操作，必須先確認，不能自行猜測。

### 不可過度清洗

使用者說：

> 「請檢查這個 scheme。」

只有在上下文明確討論 Agent Skills 時，才可以理解為 `Skill`。若正在討論資料庫 schema、設計方案或其他領域，應保留原意或先確認。

---

# 三、受控區塊更新規則

對 Markdown 全域設定檔執行以下 upsert：

1. 若檔案不存在，建立父資料夾與檔案。
2. 若檔案存在，先建立備份：`原檔名.bak-YYYYMMDD-HHmmss`。
3. 搜尋起始標記：
   `<!-- BEGIN:SENSEBAR_VOICE_INPUT_NORMALIZATION_V1 -->`
4. 搜尋結束標記：
   `<!-- END:SENSEBAR_VOICE_INPUT_NORMALIZATION_V1 -->`
5. 起訖標記都存在：以本文件「標準規則」完整替換舊受控區塊。
6. 起訖標記都不存在：在檔案結尾保留一個空行後附加標準規則。
7. 只有一個標記存在：視為檔案結構異常，不得猜測範圍；停止修改該檔案並回報。
8. 修改完成後確認起始與結束標記各只有一個。
9. 保留原檔編碼；新建 Markdown 檔使用 UTF-8。

---

# 四、偵測與安裝位置

先以設定資料夾、可執行程式、應用程式安裝資訊等安全方式偵測。只要能確認該 Agent 已存在，就執行對應設定。

| Agent | 偵測線索 | 使用者層級全域設定 | 安裝方式 |
|---|---|---|---|
| ChatGPT 桌面應用中的 Codex／Codex CLI | `~/.codex/`、Codex CLI 或桌面應用的本機 Codex 工作環境 | `~/.codex/AGENTS.md` | 對 Markdown 執行受控區塊 upsert |
| Claude Code | `~/.claude/` 或 `claude` 命令 | 優先 `~/.claude/rules/voice-input-normalization.md` | 建立獨立使用者規則檔；若目前版本不支援使用者 rules，才回退到 `~/.claude/CLAUDE.md` 執行 upsert |
| AntiGravity 2／Gemini Code Assist Agent Mode | `~/.gemini/`、AntiGravity 或 Gemini Code Assist 安裝資訊 | `~/.gemini/GEMINI.md` | 對 Markdown 執行受控區塊 upsert |
| OpenCode／OpenCode Desktop | `~/.config/opencode/`、`opencode` 命令或桌面應用 | 規則檔：`~/.config/opencode/instructions/voice-input-normalization.md`；索引：`~/.config/opencode/opencode.json` | 建立規則檔，並把相對路徑加入 JSON 的 `instructions` 陣列 |

> `~` 代表目前使用者的家目錄。Windows 上應透過 `$HOME` 或系統 API 解析，不得硬編碼 `C:\Users\某人`。

## A. ChatGPT 桌面應用／Codex

1. 確認本機存在 Codex 工作環境；單純安裝一般 ChatGPT 聊天應用不等於支援本機 `AGENTS.md`。
2. 目標檔案：`~/.codex/AGENTS.md`。
3. 依「受控區塊更新規則」合併。
4. 不修改 `config.toml`、登入資訊、記憶資料庫或應用程式狀態檔。
5. 驗證時開啟新的 Codex 工作階段，確認全域 `AGENTS.md` 已載入。

## B. Claude Code

1. 優先建立：`~/.claude/rules/voice-input-normalization.md`。
2. 此檔內容僅放完整受控區塊，不複製本文件的安裝說明。
3. 如果已存在同名檔，依 upsert 規則更新並備份。
4. 若已安裝的 Claude Code 版本無法載入使用者層級 `~/.claude/rules/`，才改為更新 `~/.claude/CLAUDE.md`。
5. 不修改 `settings.json`、Hooks、權限或登入憑證。
6. 驗證可使用 Claude Code 的 `/memory` 或等效診斷，確認規則檔已載入。

## C. AntiGravity 2／Gemini

1. 目標檔案：`~/.gemini/GEMINI.md`。
2. 依「受控區塊更新規則」合併。
3. 不修改 API Key、MCP、模型或登入設定。
4. 若 AntiGravity 版本提供可查詢的 Context／Memory 清單，使用它確認全域 `GEMINI.md` 已載入。
5. 若偵測到的 AntiGravity 版本使用不同官方全域檔案，先以該版本內建說明或官方文件驗證，再套用同一受控區塊；不得臆測路徑。

## D. OpenCode／OpenCode Desktop

1. 建立規則檔：
   `~/.config/opencode/instructions/voice-input-normalization.md`
2. 規則檔內容僅放完整受控區塊。
3. 找到目前實際使用的全域設定檔，優先順序：
   - `~/.config/opencode/opencode.json`
   - 若前者不存在且版本明確支援，再使用 `~/.config/opencode/opencode.jsonc`
4. 修改 JSON 前建立備份。
5. 若頂層沒有 `instructions`，新增為陣列。
6. 若 `instructions` 已存在且是陣列，保留所有項目，只在尚未存在時加入：
   `./instructions/voice-input-normalization.md`
7. 若 `instructions` 不是陣列、JSON 無法解析或檔案結構不明，停止修改並回報；不得覆寫整份設定。
8. 不輸出設定檔全文，避免洩露其中的 Token 或 API Key。
9. 驗證 JSON／JSONC 語法有效，且路徑在 `instructions` 中恰好出現一次。
10. 重新開啟 OpenCode 工作階段後測試規則。

---

# 五、chezmoi 或其他同步工具

若電腦使用 chezmoi、dotfiles repo、企業設定管理或其他同步工具，直接修改目標檔可能在下次同步時被覆蓋。

1. 先判斷目標檔是否由同步工具管理。
2. 若由 chezmoi 管理，在目標檔修改與驗證成功後，將該檔的最新安全版本納入 chezmoi 來源；不得把憑證或未相關檔案一起加入。
3. 若同步來源有模板，必須更新對應來源或模板，不要只更新生成結果。
4. 修改同步來源前也要備份，並回報來源檔與目標檔位置。
5. 不自動 commit 或 push dotfiles repo，除非使用者另外明確授權。

---

# 六、驗證協定

## 檔案驗證

每套工具至少檢查：

- 目標設定檔或規則檔存在。
- 檔案不是零位元組。
- 起始與結束標記各恰好出現一次。
- 原有內容仍存在，沒有被整檔覆蓋。
- 備份檔存在（新建檔案不要求備份）。
- OpenCode 的設定檔語法有效，`instructions` 路徑恰好出現一次。

## 行為驗證

優先用全新工作階段測試，避免目前對話上下文造成假陽性。

測試提示詞：

> 「我剛才用語音輸入：『請用 Cloud Code 讀這個 report，再檢查裡面的 scheme。』先說明你依目前 AI Agent 語境理解的三個關鍵詞，不要修改任何檔案。」

預期：

- Agent 可以提出 `Claude Code`、`repo`、`Skill` 是合理理解。
- Agent 應說明這是依目前 AI Agent 語境推斷，而不是永久強制替換。
- 若上下文不足，Agent 應先確認，不應直接執行。

## 防止假成功

- 只寫入檔案但沒有驗證載入，不算完成。
- 工具不存在，不算成功，應列為「未偵測，跳過」。
- 一般 ChatGPT 雲端聊天無法由本機 Agent 寫入帳號層級自訂指令時，列為「需使用者在 UI 手動設定」，不得回報已完成。
- 工具需要重新啟動或開新工作階段時，必須明確回報。

---

# 七、完成回報格式

安裝完成後，使用以下格式回報：

```text
語音輸入文字正規化：跨 Agent 安裝結果

[成功／更新／跳過／失敗] ChatGPT 桌面應用／Codex
- 設定檔：<實際路徑>
- 備份：<實際路徑或新建檔案>
- 驗證：<結果>
- 重啟：<是否需要>

[成功／更新／跳過／失敗] Claude Code
- 設定檔：<實際路徑>
- 備份：<實際路徑或新建檔案>
- 驗證：<結果>
- 重啟：<是否需要>

[成功／更新／跳過／失敗] AntiGravity 2／Gemini
- 設定檔：<實際路徑>
- 備份：<實際路徑或新建檔案>
- 驗證：<結果>
- 重啟：<是否需要>

[成功／更新／跳過／失敗] OpenCode
- 規則檔：<實際路徑>
- 全域設定：<實際路徑>
- 備份：<實際路徑或新建檔案>
- 驗證：<結果>
- 重啟：<是否需要>

同步工具：<未偵測／已同步來源／需使用者處理>
未完成事項：<沒有或具體說明>
```

回報中不得顯示任何憑證、Token、Cookie、API Key 或完整敏感設定內容。

---

# 八、解除安裝

使用者要求移除時：

1. 對 Codex、Gemini 或回退使用的 Claude `CLAUDE.md`，只刪除起訖標記及其間內容。
2. Claude 若使用獨立 rules 檔，只移除 `voice-input-normalization.md`，不動其他 rules。
3. OpenCode 移除獨立規則檔，並只從 `instructions` 陣列移除對應路徑；保留其他 instructions。
4. 修改前仍要備份。
5. 驗證沒有殘留標記，也沒有破壞其他設定。

---

# 九、相容性說明

- Codex 的使用者全域指令通常位於 `~/.codex/AGENTS.md`。
- Claude Code 的使用者指令可放在 `~/.claude/CLAUDE.md`，新版也支援 `~/.claude/rules/` 的使用者層級規則。
- Gemini Code Assist Agent Mode 的全域 Context 檔位於 `~/.gemini/GEMINI.md`；AntiGravity 2 若沿用該機制可直接使用。
- OpenCode 可在全域 `opencode.json` 的 `instructions` 陣列載入額外規則檔。
- 各工具可能改版。若實際版本與本表不一致，安裝 Agent 應先使用該工具的內建診斷或官方文件確認，不得猜測後覆寫。

## 官方參考

- Codex `AGENTS.md`：<https://learn.chatgpt.com/docs/agent-configuration/agents-md>
- Claude Code Memory／`CLAUDE.md`／user rules：<https://code.claude.com/docs/en/memory>
- Gemini Code Assist Agent Mode Context：<https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer>
- OpenCode Rules：<https://opencode.ai/docs/rules/>
- OpenCode Config `instructions`：<https://opencode.ai/docs/config/>
