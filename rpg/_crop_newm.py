# rpg/_crop_newm.py — 2026-10-24 第二十三次：老師上傳的 3 張男戰士新圖（每張 2 人、左上角 01 ＝ ★ 基本）切成 rpg/newm/A1～C2.jpg（寬 300px）
# 用法：python3 -I rpg/_crop_newm.py。框照金框量的。⚠ 老師規則：放哪一個號碼、哪一個等級 ➜ 老師同意以後才複製進 rpg/chars/（APPROVED 改 True）
import os, shutil
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
SHEETS = [('sheet_m1_A.jpg', 'A', [(70,26,448,556),(577,26,955,556)]),
          ('sheet_m1_B.jpg', 'B', [(6,6,504,567),(520,6,1018,567)]),
          ('sheet_m1_C.jpg', 'C', [(6,6,504,567),(520,6,1018,567)])]
os.makedirs(os.path.join(D, 'newm'), exist_ok=True)
for sh, k, boxes in SHEETS:
  im = Image.open(os.path.join(D, sh)).convert('RGB')
  for i, b in enumerate(boxes):
    c = im.crop(b); w = 300; h = round(c.height * w / c.width)
    c.resize((w, h), Image.LANCZOS).save(os.path.join(D, 'newm', '%s%d.jpg' % (k, i + 1)), quality=88)
# 建議的位置（listen/2026-10-24_C27/）：男 31～36 ★ 基本 ＝ A1 A2 B1 B2 C1 C2
APPROVED = True   # 老師 2026-10-24 同意（對話裡選擇題）
if APPROVED:
  for n, k in enumerate(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']):
    shutil.copy(os.path.join(D, 'newm', k + '.jpg'), os.path.join(D, 'chars', 'b%02d.jpg' % (31 + n)))
print('ok')
