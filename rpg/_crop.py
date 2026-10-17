# rpg/_crop.py — 把老師上傳的圖鑑照每一張卡的框切成一張一張（寬 300px）
# 用法：python3 -I rpg/_crop.py   （原圖放 rpg/sheet_*.jpg；切好的放 rpg/chars/、rpg/pets/、rpg/weapons/）
# 框的位置：用「不是白色」的欄、列量出來的（2026-10-17：女 21～30 ＝ 5✕2、寵物 01～15 ＝ 5✕3）
import os, sys
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
SHEETS = [
  # (原圖, 輸出資料夾, 第一個號碼, 前綴, 欄, 列)
  ('sheet_g21_30.jpg', 'chars', 21, 'g', [(6,197),(211,402),(419,605),(617,816),(824,1019)], [(5,284),(291,568)]),
  ('sheet_p01_15.jpg', 'pets', 1, 'p', [(29,197),(229,397),(428,596),(628,796),(828,996)], [(22,192),(204,379),(390,563)]),
]
for sh, out, n0, pre, cols, rows in SHEETS:
  src = os.path.join(D, sh)
  if not os.path.exists(src): continue
  im = Image.open(src).convert('RGB'); os.makedirs(os.path.join(D, out), exist_ok=True); n = n0
  for (y0, y1) in rows:
    for (x0, x1) in cols:
      c = im.crop((x0, y0, x1, y1)); w = 300; h = round(c.height * w / c.width)
      c.resize((w, h), Image.LANCZOS).save(os.path.join(D, out, '%s%02d.jpg' % (pre, n)), quality=88); n += 1
# 單張換掉的卡（老師 2026-10-17 C8 第 10 題 A：男 13、男 16、女 17 換新圖）
for f in ('b13', 'b16', 'g17'):
  src = os.path.join(D, 'new_%s.jpg' % f)
  if os.path.exists(src):
    c = Image.open(src).convert('RGB'); w = 300; h = round(c.height * w / c.width)
    c.resize((w, h), Image.LANCZOS).save(os.path.join(D, 'chars', f + '.jpg'), quality=88)
print('ok')
