/* phonics/_snd.js — 🔤 字母 和 聲音（44 音 字卡）的 資料（2026-11-19 第六十二次 老師 2-(3)）
 * 老師：拼音 地圖 操作 以前，學生 一定 要 先 熟悉 每 一個 字母 的 聲音 ↔ 字母（看 e ➜ 唸 ㄝ；聽 一 ➜ ea、ee、e_e）＝ 最 基礎 的 能力。
 * 依據：老師 的「SoR 44 音」兩份 投影片（母音 卡：上面 注音 方塊、下面 字母；b_d 例字 bed bade bad bow／bid bude bede／boot but book bote／bod bard bird；
 *       子音 照 嘴巴 位置 分組 b m f p／d n l t／g h ck ng／s z th th／j sh ch si ge／l r y w h）＋暑輔 課程 規劃（20 母音＋24 子音 ＝ 44 音）。
 * 每 一個 音：k 代號、t 注音 方塊 用 的 碼（TT）、sp 拼法、au 單獨 的 聲音、ex 例字 [spec, 聲音, 字]、cue 嘴巴 一句、cf 容易 搞混 的 音（遊戲 錯 選項）。
 * TH ＝ 13 個 學習 主題（由 基礎 到 進階）：第 1 個 ＝ 動畫 第 1、2 部（44 個 聲音、聲音 ⇄ 字母）；後面 每 張 卡 ＝ 一部 動畫。
 * 研究（建議 依據，沒有 打開 原文 核對 數字）：字母 和 聲音 的 對應 是 認字 的 基礎（Ehri 2014 https://doi.org/10.1080/10888438.2013.819356 ；
 *   Piasta & Wagner 2010 後設分析 https://doi.org/10.1598/RRQ.45.1.2 ；National Reading Panel 2000 https://www.nichd.nih.gov/publications/pubs/nrp/smallbook ）；
 *   拼字 練習 幫 認字（Graham & Santangelo 2014 https://doi.org/10.1007/s11145-014-9517-0 ）；分 小 段 學（Mayer 2009 多媒體 學習 原則 分段）。*/
(function (root) {
  var V = [
    { k: 'eh', t: 'eh', sp: ['e'], au: 's_eh', ex: ['b.e.d', 'b-eh-d', 'bed'], cue: '嘴巴 微 開，嘴角 往 兩邊 ＝ ㄝ', cf: ['ae', 'ih', 'ai'] },
    { k: 'ai', t: 'ai', sp: ['a_e', 'ai', 'ay'], au: 's_ai', ex: ['b.a!=ai.d.e~', 'b-ai-d', 'bade'], cue: 'ㄝ 滑 到 一（唸 字母 A 的 名字）', cf: ['eh', 'ee', 'ae'] },
    { k: 'ae', t: 'ae', sp: ['a'], au: 's_ae', ex: ['b.a.d', 'b-ae-d', 'bad'], cue: '嘴巴 張 大，ㄝ 和 ㄚ 一起 ＝ ㄝㄚ', cf: ['eh', 'aa', 'uh'] },
    { k: 'ou', t: 'ou', sp: ['ou', 'ow'], au: 's_ou', ex: ['b.ow=ou', 'b-ou', 'bow'], cue: '嘴巴 張 大 ➜ 慢慢 嘟 起來 ＝ ㄠ', cf: ['oa', 'aa', 'ae'] },
    { k: 'ih', t: 'ih', sp: ['i'], au: 's_ih', ex: ['b.i.d', 'b-ih-d', 'bid'], cue: '短短 的、輕輕 的，一 和 ㄜ 中間', cf: ['ee', 'eh', 'ii'] },
    { k: 'ee', t: 'ee', sp: ['ee', 'ea', 'e_e'], au: 's_ee', ex: ['b.e!=ee.d.e~', 'b-ee-d', 'bede'], cue: '嘴角 拉 開 笑，長長 的 一（唸 字母 E 的 名字）', cf: ['ih', 'ai', 'eh'] },
    { k: 'yu', t: 'yu', sp: ['u_e'], au: 's_yu', ex: ['b.u!=yu.d.e~', 'b-yu-d', 'bude'], cue: '一 滑 到 ㄨ（唸 字母 U 的 名字）', cf: ['uu', 'oa', 'ou'] },
    { k: 'uu', t: 'uu', sp: ['oo'], au: 's_uu', ex: ['b.oo=uu.t', 'b-uu-t', 'boot'], cue: '嘴巴 嘟 圓、長長 的 ㄨ', cf: ['oo', 'oa', 'yu'] },
    { k: 'oo', t: 'oo', sp: ['oo'], au: 's_oo', ex: ['b.oo=oo.k', 'b-oo-k', 'book'], cue: '嘴巴 放鬆、短短 的 ㄨㄛ', cf: ['uu', 'uh', 'oa'], short: 1 },
    { k: 'uh', t: 'uh', sp: ['u'], au: 's_uh', ex: ['b.u.t', 'b-uh-t', 'but'], cue: '嘴巴 放鬆、短短 的 ㄜ', cf: ['aa', 'ae', 'oo'] },
    { k: 'ax', t: 'ah', sp: ['a', 'e', 'i', 'o', 'u'], au: 's_ax', ex: ['s.e|v.e=ah.n', 'w_c57_seven', 'seven'], cue: '沒有 重音 的 母音 變 輕 變 短 ＝ 輕輕 的 ㄜ（弱化音）', cf: ['uh', 'eh', 'ih'], weak: 1 },
    { k: 'oa', t: 'oa', sp: ['o_e', 'oa', 'ow'], au: 's_oa', ex: ['b.o!=oa.t.e~', 'b-oa-t', 'bote'], cue: 'ㄜ 滑 到 ㄨ（唸 字母 O 的 名字）', cf: ['ou', 'or', 'uu'] },
    { k: 'er', t: 'er', sp: ['er', 'ir', 'ur'], au: 's_er', ex: ['b.ir.d', 'b-er-d', 'bird'], cue: 'ㄜ＋舌頭 捲 起來 ㄦ', cf: ['ar', 'or', 'uh'] },
    { k: 'aa', t: 'aa', sp: ['o'], au: 's_aa', ex: ['b.o.d', 'b-aa-d', 'bod'], cue: '嘴巴 張 大、下巴 往 下 ＝ ㄚ', cf: ['uh', 'ae', 'ar'] },
    { k: 'ar', t: 'ar', sp: ['ar'], au: 's_ar', ex: ['b.ar.d', 'b-ar-d', 'bard'], cue: 'ㄚ＋舌頭 捲 起來 ㄦ', cf: ['or', 'er', 'aa'] },
    { k: 'ii', t: 'ii', sp: ['i_e'], au: 's_ii', ex: ['b.i!=ii.d.e~', 'b-ii-d', 'bide'], cue: 'ㄚ 滑 到 一 ＝ ㄞ（唸 字母 I 的 名字）', cf: ['ih', 'ai', 'oy'] },
    { k: 'oy', t: 'oy', sp: ['oi', 'oy'], au: 's_oy', ex: ['b.oy=oy', 'b-oy', 'boy'], cue: 'ㄛ 滑 到 一', cf: ['ii', 'oa', 'or'] },
    { k: 'or', t: 'or', sp: ['or'], au: 's_or', ex: ['f.or.k', 'cx_fork', 'fork'], cue: 'ㄛ＋舌頭 捲 起來 ㄦ', cf: ['ar', 'er', 'aa'] },
    { k: 'ear', t: 'ear', sp: ['ear'], au: 's_ear', ex: ['h.ear=ear', 'w_c62_hear', 'hear'], cue: '一＋舌頭 捲 起來 ㄦ', cf: ['air', 'er', 'ee'] },
    { k: 'air', t: 'air', sp: ['air'], au: 's_air', ex: ['h.air=air', 'w_c62_hair', 'hair'], cue: 'ㄝ＋舌頭 捲 起來 ㄦ', cf: ['ear', 'ar', 'eh'] }];
  var C = [
    { k: 'b', t: 'b', sp: ['b'], au: 's_b', ex: ['b.e.d', 'b-eh-d', 'bed'], cue: '雙唇 閉 起來 再 打開，喉嚨 震動 ＝ ㄅ', cf: ['p', 'm', 'd'] },
    { k: 'p', t: 'p', sp: ['p'], au: 's_p', ex: ['p.i.g', 'p-ih-g', 'pig'], cue: '雙唇 閉 起來 再 打開，吹 一口 氣 ＝ ㄆ', cf: ['b', 'f', 't'] },
    { k: 'm', t: 'm', sp: ['m'], au: 's_m', ex: ['m.a.p', 'm-ae-p', 'map'], cue: '雙唇 閉 起來，鼻子 出 聲 ＝ ㄇ', cf: ['n', 'b', 'ng'] },
    { k: 'f', t: 'f', sp: ['f', 'ph'], au: 's_f', ex: ['f.a.n', 'f-ae-n', 'fan'], cue: '上 牙齒 輕輕 咬 下唇，吹 氣 ＝ ㄈ', cf: ['v', 'p', 'th'] },
    { k: 'v', t: 'v', sp: ['v'], au: 's_v', ex: ['v.a.n', 'v-ae-n', 'van'], cue: '上 牙齒 輕輕 咬 下唇，喉嚨 震動', cf: ['f', 'b', 'w'] },
    { k: 'd', t: 'd', sp: ['d'], au: 's_d', ex: ['d.o.g', 'd-aa-g', 'dog'], cue: '舌尖 頂 上 牙齦 再 放開，喉嚨 震動 ＝ ㄉ', cf: ['t', 'n', 'b'] },
    { k: 't', t: 't', sp: ['t'], au: 's_t', ex: ['t.e.n', 't-eh-n', 'ten'], cue: '舌尖 頂 上 牙齦 再 放開，吹 氣 ＝ ㄊ', cf: ['d', 'p', 'k'] },
    { k: 'n', t: 'n', sp: ['n'], au: 's_n', ex: ['n.e.t', 'n-eh-t', 'net'], cue: '舌尖 頂 上 牙齦，鼻子 出 聲 ＝ ㄋ', cf: ['m', 'ng', 'l'] },
    { k: 'l', t: 'l', sp: ['l'], au: 's_l', ex: ['l.e.g', 'l-eh-g', 'leg'], cue: '舌尖 頂 上 牙齦，聲音 從 舌頭 兩邊 出來 ＝ ㄌ', cf: ['r', 'n', 'd'] },
    { k: 'g', t: 'g', sp: ['g'], au: 's_g', ex: ['g.u.m', 'g-uh-m', 'gum'], cue: '舌根 頂 上面 再 放開，喉嚨 震動 ＝ ㄍ', cf: ['k', 'd', 'ng'] },
    { k: 'k', t: 'k', sp: ['c', 'k', 'ck'], au: 's_k', ex: ['c.a.t', 'k-ae-t', 'cat'], cue: '舌根 頂 上面 再 放開，吹 氣 ＝ ㄎ', cf: ['g', 't', 'h'] },
    { k: 'h', t: 'h', sp: ['h'], au: 's_h', ex: ['h.a.t', 'h-ae-t', 'hat'], cue: '嘴巴 打開，輕輕 哈 一口 氣 ＝ ㄏ', cf: ['f', 'k', 'w'] },
    { k: 'ng', t: 'ng', sp: ['ng'], au: 's_ng', ex: ['r.i.ng', 'r-ih-ng', 'ring'], cue: '舌根 頂 上面，鼻子 出 聲 ＝ ㄥ（ng 兩個 字母 一個 聲音）', cf: ['n', 'm', 'g'] },
    { k: 's', t: 's', sp: ['s'], au: 's_s', ex: ['s.u.n', 's-uh-n', 'sun'], cue: '牙齒 靠 近，嘶～ 吹 氣（喉嚨 不 震動）＝ ㄙ', cf: ['z', 'sh', 'th'] },
    { k: 'z', t: 'z', sp: ['z'], au: 's_z', ex: ['z.i.p', 'z-ih-p', 'zip'], cue: '牙齒 靠 近，嘶～ 喉嚨 會 震動（像 蜜蜂 zzz）', cf: ['s', 'dh', 'zh'] },
    { k: 'th', t: 'th', sp: ['th'], au: 's_th', ex: ['th.i.n', 'th-ih-n', 'thin'], cue: '舌頭 輕輕 咬 在 牙齒 中間，只 吹 氣 💨', cf: ['dh', 's', 'f'] },
    { k: 'dh', t: 'dh', sp: ['th'], au: 's_dh', ex: ['th=dh.a.t', 'dh-ae-t', 'that'], cue: '舌頭 輕輕 咬 在 牙齒 中間，喉嚨 會 震動 📳', cf: ['th', 'z', 'd'], voiced: 1 },
    { k: 'j', t: 'j', sp: ['j'], au: 's_j', ex: ['j.a.m', 'j-ae-m', 'jam'], cue: '嘴巴 嘟 出去，喉嚨 震動 ＝ ㄓ', cf: ['ch', 'zh', 'y'] },
    { k: 'ch', t: 'ch', sp: ['ch'], au: 's_ch', ex: ['ch.i.p', 'ch-ih-p', 'chip'], cue: '嘴巴 嘟 出去，吹 氣 ＝ ㄔ', cf: ['j', 'sh', 't'] },
    { k: 'sh', t: 'sh', sp: ['sh'], au: 's_sh', ex: ['sh.i.p', 'sh-ih-p', 'ship'], cue: '嘴巴 嘟 出去，噓～ ＝ ㄕ', cf: ['s', 'ch', 'zh'] },
    { k: 'zh', t: 'zh', sp: ['si', 'ge'], au: 's_zh', ex: ['t.e|l.e=ah|v.i|s=zh.io=ah.n', 'w_c62_television', 'television'], cue: '嘴巴 嘟 出去，噓～ 喉嚨 會 震動', cf: ['sh', 'j', 'z'] },
    { k: 'r', t: 'r', sp: ['r'], au: 's_r', ex: ['r.e.d', 'r-eh-d', 'red'], cue: '舌頭 捲 起來、嘴巴 嘟 一點 ＝ ㄖㄨ', cf: ['l', 'w', 'y'] },
    { k: 'y', t: 'y', sp: ['y'], au: 's_y', ex: ['y.e.s', 'y-eh-s', 'yes'], cue: '舌頭 靠 上面，滑 出 一', cf: ['j', 'w', 'ee'] },
    { k: 'w', t: 'w', sp: ['w'], au: 's_w', ex: ['w.e.t', 'w-eh-t', 'wet'], cue: '嘴巴 嘟 圓，滑 出 ㄨ', cf: ['r', 'v', 'y'] }];
  /* 13 個 學習 主題（由 基礎 到 進階）。g ＝ 那 一個 主題 的 遊戲 玩法：sort 分類 閘門／catch 拼法 接接樂／shoot 聽音 射擊／pick 看字 選聲 */
  var TH = [
    { n: '44 個 聲音 是 什麼？', ic: '🔤', items: [], g: 'sort', goal: '分 得 出 母音、子音', why: '先 知道 英文 有 44 個 聲音、看字 能 唸、聽音 能 寫 ＝ 拼音 地圖 的 地基' },
    { n: 'ㄝ 組合 母音', ic: '🔴', items: ['eh', 'ai', 'ae', 'ou'], g: 'catch', goal: '聽 ㄝ、ㄝ一、ㄝㄚ、ㄝㄠ ➜ 接住 每 一種 拼法', why: '聽到 ㄝ一 就 知道 可能 是 a_e、ai、ay ＝ 拼字 不 會 漏' },
    { n: '一 組合 母音', ic: '🔴', items: ['ih', 'ee', 'yu'], g: 'shoot', goal: '聽 一ㄜ、一、一ㄨ ➜ 打中 對 的 拼法', why: 'i（一ㄜ）和 ee（一）分 得 清楚 ＝ ship／sheep 不 會 唸 錯' },
    { n: 'ㄨ 組合 母音', ic: '🔴', items: ['uu', 'oo'], g: 'pick', goal: '看 oo ➜ 分 得 出 長 ㄨ（boot）、短 ㄨㄛ（book）', why: '同 一個 oo 有 兩種 聲音 ＝ 看到 字 會 想 兩種 唸法' },
    { n: 'ㄜ 組合 母音', ic: '🔴', items: ['uh', 'ax', 'oa', 'er'], g: 'catch', goal: '聽 ㄜ、ㄜㄨ、ㄜㄦ ➜ 接住 每 一種 拼法', why: 'ㄜㄨ 有 o_e、oa、ow 三種 拼法 ＝ 聽寫 會 想 到 全部' },
    { n: 'ㄚ 組合 母音', ic: '🔴', items: ['aa', 'ar'], g: 'shoot', goal: '聽 ㄚ、ㄚㄦ ➜ 打中 o、ar', why: 'hot 的 o ＝ ㄚ（不是 ㄛ）＝ 唸 得 跟 美國人 一樣' },
    { n: 'ㄞ、ㄛ一、ㄦ 其他 母音', ic: '🔴', items: ['ii', 'oy', 'or', 'ear', 'air'], g: 'pick', goal: '看 i_e、oi、or、ear、air ➜ 選 對 的 聲音', why: '44 音 的 母音 全部 學完 ＝ 看 到 任何 母音 組合 都 唸 得 出來' },
    { n: '子音 ① 嘴唇', ic: '🔵', items: ['b', 'p', 'm', 'f', 'v'], g: 'shoot', goal: '聽 ㄅ ㄆ ㄇ ㄈ v ➜ 打中 對 的 字母', why: 'b／p、f／v 分 得 出來 ＝ 聽寫 不 會 寫 錯' },
    { n: '子音 ② 舌尖', ic: '🔵', items: ['d', 't', 'n', 'l'], g: 'pick', goal: '看 d t n l ➜ 選 對 的 聲音', why: 'd／t、n／l 分 得 出來 ＝ 唸 得 清楚' },
    { n: '子音 ③ 舌根', ic: '🔵', items: ['g', 'k', 'h', 'ng'], g: 'catch', goal: '聽 ㄍ ㄎ ㄏ ㄥ ➜ 接住 每 一種 拼法（c、k、ck）', why: 'ㄎ 有 c、k、ck 三種 拼法 ＝ 拼字 會 選 對' },
    { n: '子音 ④ 嘶嘶 聲', ic: '🔵', items: ['s', 'z', 'th', 'dh'], g: 'pick', goal: '看 s z th ➜ 選 對 的 聲音（th 有 兩種）', why: 'th 不是 ㄙ ＝ thin／sin 不 會 唸 錯' },
    { n: '子音 ⑤ 嘟嘴', ic: '🔵', items: ['j', 'ch', 'sh', 'zh'], g: 'shoot', goal: '聽 ㄓ ㄔ ㄕ ➜ 打中 對 的 字母', why: 'ch／sh 分 得 出來 ＝ chip／ship 不 會 唸 錯' },
    { n: '子音 ⑥ 滑音', ic: '🔵', items: ['r', 'y', 'w'], g: 'pick', goal: '看 r y w ➜ 選 對 的 聲音', why: 'r 不是 ㄌ ＝ red／led 分 得 出來' }];
  var GN = { sort: ['🔀', '母音 子音 分類 閘門', '一個 聲音 方塊 飛 進來 🔊 ➜ 用 手指 <b>拖</b> 進 🔴 母音 門 或 🔵 子音 門'], catch: ['🧺', '拼法 接接樂', '聽 🔊 ➜ 字母 塊 從 天上 掉 下來 ➜ 左右 <b>拖</b> 籃子，<b>接住 每 一個</b> 對 的 拼法、躲開 錯 的'],
    shoot: ['🎯', '聽音 射擊', '聽 🔊 ➜ 字母 靶 在 畫面 上 飛 來 飛 去 ➜ <b>打中</b> 對 的 那 一個'], pick: ['🔊', '看字 選聲', '看 字母 ➜ 點 三顆 聲音 球 聽聽看 ➜ 把 字母 <b>拖</b> 進 聲音 一樣 的 那 一顆'] };
  /* 2026-11-19 第六十三次 老師 2：🃏 聽音 卡牌 6 關（每 關 7～8 個 音）＝ 先〔基礎〕聽 ➜ 選「注音／KK＋字母」卡，再〔進階〕聽 同樣 的 音 ➜ 選「只有 字母」卡（老師 截圖）。
   順序 照 老師 投影片：母音 ① ㄝ／一 組 ➜ 母音 ② ㄨ／ㄜ／ㄚ 組 ➜ 母音 ③ 其他＋複習 ➜ 子音 ① 嘴唇＋舌尖 ➜ 子音 ② 舌尖＋舌根＋嘶嘶 ➜ 子音 ③ 嘟嘴＋滑音。弱化音 ə 不 放（要 在 字 裡 才 聽 得 出來）。*/
  /* 2026-11-19 第六十四次 老師 1、2-B（🔒 永久：一次 只 練 4～5 個 新 的 音；學 A ➜ 學 B ➜ 複習 A＋B ➜ … ➜ 全部 總複習；每 一關 遊戲 完全 不同）
   id ＝ 成績 代號（sc<id><b|a>）；g ＝ 遊戲（_map_snd2.js）；rev 1 ＝ 複習、2 ＝ 總複習。子音 3 關 代號 3～5 跟 第六十三次 一樣（舊 成績 對 得 上）。
   舊 的 0～2（母音 ①②③）不 再 出現（老師看板 題庫 LEGACY 留著 看 舊 成績）。*/
  var V1 = ['ae', 'eh', 'ih', 'aa', 'uh'], V2 = ['ai', 'ee', 'yu', 'ou'], V3 = ['uu', 'oo', 'oa', 'er', 'ar'], V4 = ['ii', 'oy', 'or', 'ear', 'air'];
  var GS = [
    { id: 'v1', n: '母音 ①：CVC 短 母音', items: V1, g: 'card' },
    { id: 'v2', n: '母音 ②：ㄝ一、一、一ㄨ、ㄠ', items: V2, g: 'bow' },
    { id: 'vr1', n: '🔁 複習：母音 ①＋②', items: V1.concat(V2), g: 'run', rev: 1 },
    { id: 'v3', n: '母音 ③：ㄨ、ㄨㄛ、ㄜㄨ、ㄜㄦ、ㄚㄦ', items: V3, g: 'beat' },
    { id: 'v4', n: '母音 ④：ㄞ、ㄛ一、ㄛㄦ、一ㄦ、ㄝㄦ', items: V4, g: 'orb' },
    { id: 'vr2', n: '🔁 複習：母音 ③＋④', items: V3.concat(V4), g: 'orbit', rev: 1 },
    { id: 'va', n: '🏆 母音 總複習（全部 19 個）', items: V1.concat(V2, V3, V4), g: 'jump', rev: 2 },
    { id: '3', n: '子音 ①：嘴唇、舌尖', items: ['b', 'p', 'm', 'f', 'v', 'd', 't', 'n'], g: 'card' },
    { id: '4', n: '子音 ②：舌尖、舌根、嘶嘶 聲', items: ['l', 'g', 'k', 'h', 'ng', 's', 'z', 'th'], g: 'card' },
    { id: '5', n: '子音 ③：有聲 th、嘟嘴、滑音', items: ['dh', 'j', 'ch', 'sh', 'zh', 'r', 'y', 'w'], g: 'card' }];
  /* 第六十三次 的 母音 3 關（成績 代號 sc0～sc2）＝ 只 給 老師看板 看 舊 成績 */
  var GSOLD = [{ id: '0', n: '母音 ①：ㄝ 組、一 組（舊）' }, { id: '1', n: '母音 ②：ㄨ 組、ㄜ 組、ㄚ 組（舊）' }, { id: '2', n: '母音 ③：ㄞ、ㄛ一、ㄦ＋複習（舊）' }];
  var ALL = V.concat(C), BY = {}; ALL.forEach(function (x, i) { x.i = i; x.v = i < V.length; BY[x.k] = x; });
  var M = { V: V, C: C, ALL: ALL, BY: BY, TH: TH, GN: GN, GS: GS, GSOLD: GSOLD };
  if (typeof module !== 'undefined' && module.exports) module.exports = M; else root.SND = M;
})(typeof window !== 'undefined' ? window : this);
