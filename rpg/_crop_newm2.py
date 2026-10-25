# rpg/_crop_newm2.py — 2026-10-25 第二十五次：老師上傳的 5 張男戰士新圖（每張 2 人、左上角 02 ＝ ★★ 稀有）切成 rpg/newm2/A1～E2.jpg（寬 300px）
# 用法：python3 -I rpg/_crop_newm2.py。框照「暗色的欄、列」量出來的（B 下面的英文字幕不切進來）。
# D1、D2 是女戰士（Verdant Warden、Chrono Crusader）：老師 2026-10-25「這次不用」➜ 切好存著，不上架。
# ⚠ 老師規則：放哪一個號碼、哪一個等級 ➜ 老師同意以後才複製進 rpg/chars/（APPROVED 改 True）
import os, shutil
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
SHEETS = [('sheet_m2_A.jpg', 'A', [(12,10,505,566),(524,10,1018,566)]),
          ('sheet_m2_B.jpg', 'B', [(113,18,505,512),(573,18,973,512)]),
          ('sheet_m2_C.jpg', 'C', [(12,2,506,567),(512,2,1024,567)]),
          ('sheet_m2_D.jpg', 'D', [(66,27,474,549),(550,27,952,549)]),
          ('sheet_m2_E.jpg', 'E', [(4,7,509,572),(524,7,1012,572)])]
os.makedirs(os.path.join(D, 'newm2'), exist_ok=True)
for sh, k, boxes in SHEETS:
  im = Image.open(os.path.join(D, sh)).convert('RGB')
  for i, b in enumerate(boxes):
    c = im.crop(b); w = 300; h = round(c.height * w / c.width)
    c.resize((w, h), Image.LANCZOS).save(os.path.join(D, 'newm2', '%s%d.jpg' % (k, i + 1)), quality=88)
# 建議的位置（listen/2026-10-25_C28/）：男 37～44 ★★ 稀有 ＝ A1 A2 B1 B2 C1 C2 E1 E2
ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'E1', 'E2']
APPROVED = True   # 老師 2026-10-25 同意（對話裡選擇題）
if APPROVED:
  for n, k in enumerate(ORDER):
    shutil.copy(os.path.join(D, 'newm2', k + '.jpg'), os.path.join(D, 'chars', 'b%02d.jpg' % (37 + n)))
print('ok')
