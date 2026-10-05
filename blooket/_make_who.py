# Blooket 題組 626a30cdc8fedb02ba7f48f5（Who's he? 家人／職業 21 題）→ 四選一誘答版
# 每題：題目, 正解, [(錯誤選項, 誘答理由)x3], 正解放第幾格(1-4)
import csv
Q = [
 ("他 是 誰？","Who's he?",[("Who's she?","he／she 混淆"),("Whose he?","Who's／Whose 同音"),("Who he's?","語序錯")],1),
 ("他 是 我的 爺爺。","He's my grandfather.",[("She's my grandfather.","he／she 混淆"),("He's my grandmother.","grandfather／grandmother"),("His my grandfather.","He's／His 同音")],3),
 ("He's my father.","他 是 我的 爸爸。",[("他 是 我的 爺爺。","father／grandfather"),("他 是 我的 哥哥。","father／brother 都是男生"),("他 是 我的 爸爸 嗎？","直述句／問句")],2),
 ("他 是 我的 哥哥。","He's my brother.",[("She's my brother.","he／she 混淆"),("He's my sister.","brother／sister"),("He my brother.","漏掉 's（is）")],4),
 ("她 是 誰？","Who's she?",[("Who's he?","she／he 混淆"),("Who's her?","she／her 混淆"),("Whose she?","Who's／Whose 同音")],2),
 ("She's my grandmother.","她 是 我的 奶奶。",[("她 是 我的 媽媽。","漏看 grand-"),("他 是 我的 爺爺。","she／he＋grandmother／grandfather"),("她 是 我的 奶奶 嗎？","直述句／問句")],4),
 ("她 是 我的 媽媽。","She's my mother.",[("She's my grandmother.","mother／grandmother"),("He's my mother.","she／he 混淆"),("She my mother.","漏掉 's（is）")],1),
 ("她 是 我的 妹妹。","She's my sister.",[("She's my brother.","sister／brother"),("He's my sister.","she／he 混淆"),("Her's my sister.","She's／Her 混淆")],3),
 ("Who's  =  _______","Who is",[("Who are","is／are"),("Whose","Who's／Whose 同音"),("How is","Who／How 字母相似")],1),
 ("He's  =  _______","He is",[("His","He's／His 同音"),("He are","is／are"),("She is","he／she 混淆")],4),
 ("She's  =  _______","She is",[("Her","She's／Her 混淆"),("She are","is／are"),("He is","she／he 混淆")],3),
 ("他 是 一位 護理師。","He is a nurse.",[("Is he a nurse?","直述句／問句"),("He is nurse.","漏掉 a"),("He is an nurse.","a／an 混淆")],2),
 ("他 是 一位 護理師 嗎？","Is he a nurse?",[("Is she a nurse?","he／she 混淆"),("Are he a nurse?","is／are"),("Is he nurse?","漏掉 a")],4),
 ("She is a doctor.","她 是 一位 醫師。",[("她 是 一位 護理師。","doctor／nurse"),("他 是 一位 醫師。","she／he 混淆"),("她 是 一位 醫師 嗎？","直述句／問句")],1),
 ("她 是 一位 醫師 嗎？","Is she a doctor?",[("Is he a doctor?","she／he 混淆"),("Does she a doctor?","Is／Does 混淆"),("Is she doctor?","漏掉 a")],3),
 ("他 是 一位 學生。","He's a student.",[("His a student.","He's／His 同音"),("He's student.","漏掉 a"),("Is he a student?","直述句／問句")],2),
 ("Is he a student?","他 是 一位 學生 嗎？",[("他 是 一位 學生。","問句／直述句"),("她 是 一位 學生 嗎？","he／she 混淆"),("他 是 一位 老師 嗎？","student／teacher")],4),
 ("她 是 一位 農夫。","She's a farmer.",[("She's a father.","farmer／father 長得像"),("He's a farmer.","she／he 混淆"),("She's an farmer.","a／an 混淆")],3),
 ("她 是 一位 農夫 嗎？","Is she a farmer?",[("Is she a father?","farmer／father 長得像"),("Is he a farmer?","she／he 混淆"),("Is she farmer?","漏掉 a")],1),
 ("她 是 一位 廚師。","She's a cook.",[("She's a cooker.","cook／cooker（cooker 是爐具）"),("He's a cook.","she／he 混淆"),("She's cook.","漏掉 a")],2),
 ("她 是 一位 廚師 嗎？","Is she a cook?",[("Is she a cooker?","cook／cooker（cooker 是爐具）"),("Is he a cook?","she／he 混淆"),("Is she cook?","漏掉 a")],4),
]
TIME = 20
rows=[]; md=["| # | 題目 | ① | ② | ③ | ④ | 答案 | 錯誤選項在考什麼 |","|---|---|---|---|---|---|---|---|"]
for i,(q,ok,wr,pos) in enumerate(Q,1):
    opts=[w for w,_ in wr]; opts.insert(pos-1,ok)
    assert len(set(opts))==4
    rows.append([i,q]+opts+[TIME,pos])
    md.append(f"| {i} | {q} | "+" | ".join(("**"+o+"** ✔" if o==ok else o) for o in opts)+f" | {'①②③④'[pos-1]} | "+"；".join(r for _,r in wr)+" |")
with open("blooket_Whos_he_四選一.csv","w",newline="",encoding="utf-8-sig") as f:
    w=csv.writer(f)
    w.writerow(["Blooket\nImport Template","","","","","","",""])
    w.writerow(["Question #","Question Text","Answer 1","Answer 2","Answer 3\n(Optional)","Answer 4\n(Optional)","Time Limit (sec)\n(Max: 300 seconds)","Correct Answer(s)\n(Only include Answer #)"])
    w.writerows(rows)
open("_table.md","w",encoding="utf-8").write("\n".join(md)+"\n")
from collections import Counter; print("正解位置分布", sorted(Counter(r[-1] for r in rows).items()), "共", len(rows), "題")
