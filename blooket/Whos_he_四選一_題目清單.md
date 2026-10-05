# Blooket「Who's he?」19 題 → 四選一誘答版

原題組：https://dashboard.blooket.com/set/626a30cdc8fedb02ba7f48f5（使用者 2026-10-05 截圖 19 張卡）
匯入檔：`blooket_Whos_he_四選一.csv`（Blooket 官方匯入格式，每題 20 秒）
改題目只改 `_make_who.py`，再跑 `python3 _make_who.py`。

## 設計原則（提高鑑別度）
- 每個錯誤選項只錯「一個點」，學生要真的懂才選得對；不放一看就錯的選項。
- 七種常見錯誤輪流考：he／she、He's／His（同音）、Who's／Whose（同音）、漏掉 's 或 a、
  a／an、is／are、直述句／問句，以及字長得像（farmer／father）、家人字（mother／grandmother、brother／sister）。
- 題型交錯：中翻英 13 題、英翻中 3 題、縮寫 3 題。
- 正解平均分在 ①②③④（5／4／5／5）。
- 不用「可能也算對」的選項（例如 grandpa、口語 He is a nurse? 都不放）。

## 19 題
| # | 題目 | ① | ② | ③ | ④ | 答案 | 錯誤選項在考什麼 |
|---|---|---|---|---|---|---|---|
| 1 | 「他是誰？」英文怎麼說？ | **Who's he?** ✔ | Who's she? | Whose he? | Who he's? | ① | he／she 混淆；Who's／Whose 同音；語序錯 |
| 2 | 「他是我的爺爺。」英文怎麼說？ | She's my grandfather. | He's my grandmother. | **He's my grandfather.** ✔ | His my grandfather. | ③ | he／she 混淆；grandfather／grandmother；He's／His 同音 |
| 3 | He's my father. 是什麼意思？ | 他是我的爺爺。 | **他是我的爸爸。** ✔ | 他是我的哥哥。 | 他是我的爸爸嗎？ | ② | father／grandfather；father／brother 都是男生；直述句／問句 |
| 4 | 「他是我的哥哥。」英文怎麼說？ | She's my brother. | He's my sister. | He my brother. | **He's my brother.** ✔ | ④ | he／she 混淆；brother／sister；漏掉 's（is） |
| 5 | 「她是誰？」英文怎麼說？ | Who's he? | **Who's she?** ✔ | Who's her? | Whose she? | ② | she／he 混淆；she／her 混淆；Who's／Whose 同音 |
| 6 | She's my grandmother. 是什麼意思？ | 她是我的媽媽。 | 他是我的爺爺。 | 她是我的奶奶嗎？ | **她是我的奶奶。** ✔ | ④ | 漏看 grand-；she／he＋grandmother／grandfather；直述句／問句 |
| 7 | 「她是我的媽媽。」英文怎麼說？ | **She's my mother.** ✔ | She's my grandmother. | He's my mother. | She my mother. | ① | mother／grandmother；she／he 混淆；漏掉 's（is） |
| 8 | 「她是我的妹妹。」英文怎麼說？ | She's my brother. | He's my sister. | **She's my sister.** ✔ | Her's my sister. | ③ | sister／brother；she／he 混淆；She's／Her 混淆 |
| 9 | Who's 是哪兩個字縮寫成的？ | **Who is** ✔ | Who are | Whose | Who was | ① | is／are；Who's／Whose 同音；is／was |
| 10 | He's 是哪兩個字縮寫成的？ | His | He are | He was | **He is** ✔ | ④ | He's／His 同音；is／are；is／was |
| 11 | She's 是哪兩個字縮寫成的？ | Her | She are | **She is** ✔ | She was | ③ | She's／Her 混淆；is／are；is／was |
| 12 | 「他是一位護理師。」英文怎麼說？ | Is he a nurse? | **He is a nurse.** ✔ | He is nurse. | He is an nurse. | ② | 直述句／問句；漏掉 a；a／an 混淆 |
| 13 | 「他是一位護理師嗎？」英文怎麼說？ | Is she a nurse? | Are he a nurse? | Is he nurse? | **Is he a nurse?** ✔ | ④ | he／she 混淆；is／are；漏掉 a |
| 14 | She is a doctor. 是什麼意思？ | **她是一位醫師。** ✔ | 她是一位護理師。 | 他是一位醫師。 | 她是一位醫師嗎？ | ① | doctor／nurse；she／he 混淆；直述句／問句 |
| 15 | 「她是一位醫師嗎？」英文怎麼說？ | Is he a doctor? | Does she a doctor? | **Is she a doctor?** ✔ | Is she doctor? | ③ | she／he 混淆；Is／Does 混淆；漏掉 a |
| 16 | 「他是一位學生。」英文怎麼說？ | His a student. | **He's a student.** ✔ | He's student. | Is he a student? | ② | He's／His 同音；漏掉 a；直述句／問句 |
| 17 | Is he a student? 是什麼意思？ | 他是一位學生。 | 她是一位學生嗎？ | 他是一位老師嗎？ | **他是一位學生嗎？** ✔ | ④ | 問句／直述句；he／she 混淆；student／teacher |
| 18 | 「她是一位農夫。」英文怎麼說？ | She's a father. | He's a farmer. | **She's a farmer.** ✔ | She's an farmer. | ③ | farmer／father 長得像；she／he 混淆；a／an 混淆 |
| 19 | 「她是一位農夫嗎？」英文怎麼說？ | **Is she a farmer?** ✔ | Is she a father? | Is he a farmer? | Is she farmer? | ① | farmer／father 長得像；she／he 混淆；漏掉 a |
