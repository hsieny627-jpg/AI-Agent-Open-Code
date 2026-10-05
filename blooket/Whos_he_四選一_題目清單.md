# Blooket「Who's he?」21 題 → 四選一誘答版

原題組：https://dashboard.blooket.com/set/626a30cdc8fedb02ba7f48f5（使用者 2026-10-05 截圖 19 張卡＋使用者加的 20、21 題（廚師 cook））
匯入檔：`blooket_Whos_he_四選一.csv`（Blooket 官方匯入格式，每題 20 秒）
改題目只改 `_make_who.py`，再跑 `python3 _make_who.py`。

## 設計原則（提高鑑別度）
- 每個錯誤選項只錯「一個點」，學生要真的懂才選得對；不放一看就錯的選項。
- 七種常見錯誤輪流考：he／she、He's／His（同音）、Who's／Whose（同音）、漏掉 's 或 a、
  a／an、is／are、直述句／問句，以及字長得像（farmer／father）、家人字（mother／grandmother、brother／sister）。
- 題型交錯：中翻英 14 題、英翻中 4 題、縮寫 3 題。
- 題目只放句子本身（2026-10-05 使用者）：中翻英直接寫中文句、英翻中直接寫英文句、縮寫題寫成 `Who's  =  _______`。
- 正解平均分在 ①②③④（5／4／5／5）。
- 不用「可能也算對」的選項（例如 grandpa、口語 He is a nurse? 都不放）。
- 中文詞與詞之間空一格（2026-10-05 使用者）：他 是 一位 廚師 嗎？／他 是 我的 爺爺。題目和選項都一樣。
- 三年級沒學過的字不放（2026-10-05 使用者：He was／She was 換掉）。每題 20 秒（使用者確認）。

## 21 題
| # | 題目 | ① | ② | ③ | ④ | 答案 | 錯誤選項在考什麼 |
|---|---|---|---|---|---|---|---|
| 1 | 他 是 誰？ | **Who's he?** ✔ | Who's she? | Whose he? | Who he's? | ① | he／she 混淆；Who's／Whose 同音；語序錯 |
| 2 | 他 是 我的 爺爺。 | She's my grandfather. | He's my grandmother. | **He's my grandfather.** ✔ | His my grandfather. | ③ | he／she 混淆；grandfather／grandmother；He's／His 同音 |
| 3 | He's my father. | 他 是 我的 爺爺。 | **他 是 我的 爸爸。** ✔ | 他 是 我的 哥哥。 | 他 是 我的 爸爸 嗎？ | ② | father／grandfather；father／brother 都是男生；直述句／問句 |
| 4 | 他 是 我的 哥哥。 | She's my brother. | He's my sister. | He my brother. | **He's my brother.** ✔ | ④ | he／she 混淆；brother／sister；漏掉 's（is） |
| 5 | 她 是 誰？ | Who's he? | **Who's she?** ✔ | Who's her? | Whose she? | ② | she／he 混淆；she／her 混淆；Who's／Whose 同音 |
| 6 | She's my grandmother. | 她 是 我的 媽媽。 | 他 是 我的 爺爺。 | 她 是 我的 奶奶 嗎？ | **她 是 我的 奶奶。** ✔ | ④ | 漏看 grand-；she／he＋grandmother／grandfather；直述句／問句 |
| 7 | 她 是 我的 媽媽。 | **She's my mother.** ✔ | She's my grandmother. | He's my mother. | She my mother. | ① | mother／grandmother；she／he 混淆；漏掉 's（is） |
| 8 | 她 是 我的 妹妹。 | She's my brother. | He's my sister. | **She's my sister.** ✔ | Her's my sister. | ③ | sister／brother；she／he 混淆；She's／Her 混淆 |
| 9 | Who's  =  _______ | **Who is** ✔ | Who are | Whose | How is | ① | is／are；Who's／Whose 同音；Who／How 字母相似 |
| 10 | He's  =  _______ | His | He are | She is | **He is** ✔ | ④ | He's／His 同音；is／are；he／she 混淆 |
| 11 | She's  =  _______ | Her | She are | **She is** ✔ | He is | ③ | She's／Her 混淆；is／are；she／he 混淆 |
| 12 | 他 是 一位 護理師。 | Is he a nurse? | **He is a nurse.** ✔ | He is nurse. | He is an nurse. | ② | 直述句／問句；漏掉 a；a／an 混淆 |
| 13 | 他 是 一位 護理師 嗎？ | Is she a nurse? | Are he a nurse? | Is he nurse? | **Is he a nurse?** ✔ | ④ | he／she 混淆；is／are；漏掉 a |
| 14 | She is a doctor. | **她 是 一位 醫師。** ✔ | 她 是 一位 護理師。 | 他 是 一位 醫師。 | 她 是 一位 醫師 嗎？ | ① | doctor／nurse；she／he 混淆；直述句／問句 |
| 15 | 她 是 一位 醫師 嗎？ | Is he a doctor? | Does she a doctor? | **Is she a doctor?** ✔ | Is she doctor? | ③ | she／he 混淆；Is／Does 混淆；漏掉 a |
| 16 | 他 是 一位 學生。 | His a student. | **He's a student.** ✔ | He's student. | Is he a student? | ② | He's／His 同音；漏掉 a；直述句／問句 |
| 17 | Is he a student? | 他 是 一位 學生。 | 她 是 一位 學生 嗎？ | 他 是 一位 老師 嗎？ | **他 是 一位 學生 嗎？** ✔ | ④ | 問句／直述句；he／she 混淆；student／teacher |
| 18 | 她 是 一位 農夫。 | She's a father. | He's a farmer. | **She's a farmer.** ✔ | She's an farmer. | ③ | farmer／father 長得像；she／he 混淆；a／an 混淆 |
| 19 | 她 是 一位 農夫 嗎？ | **Is she a farmer?** ✔ | Is she a father? | Is he a farmer? | Is she farmer? | ① | farmer／father 長得像；she／he 混淆；漏掉 a |
| 20 | 她 是 一位 廚師。 | She's a cooker. | **She's a cook.** ✔ | He's a cook. | She's cook. | ② | cook／cooker（cooker 是爐具）；she／he 混淆；漏掉 a |
| 21 | 她 是 一位 廚師 嗎？ | Is she a cooker? | Is he a cook? | Is she cook? | **Is she a cook?** ✔ | ④ | cook／cooker（cooker 是爐具）；she／he 混淆；漏掉 a |
