# rpg/_crop_newg.py — 2026-10-23 第二十二次：老師上傳的 5 張女戰士新圖（每張 5 人）切成 rpg/newg/A1～E5.jpg（寬 300px）
# 用法：python3 -I rpg/_crop_newg.py。框照「暗色的欄、列」量出來的。哪一張放哪一個號碼、哪一個等級 ➜ 老師同意以後才寫進 score/_calc.js
import os
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
SHEETS = [
  ('sheet_q1_A_01_05.jpg', 'A', [(4,201),(208,410),(412,614),(616,815),(822,1020)], (2,570)),
  ('sheet_q2_B_01_05.jpg', 'B', [(17,212),(215,411),(414,610),(613,808),(810,1006)], (91,503)),
  ('sheet_q3_C_06_10.jpg', 'C', [(9,205),(212,409),(416,612),(615,815),(818,1018)], (64,476)),
  ('sheet_q4_D_06_10.jpg', 'D', [(4,204),(206,409),(410,614),(615,820),(822,1021)], (2,570)),
  ('sheet_q5_E_06_10.jpg', 'E', [(4,204),(206,409),(410,614),(615,820),(822,1021)], (2,570)),
]
os.makedirs(os.path.join(D, 'newg'), exist_ok=True)
for sh, k, cols, (y0, y1) in SHEETS:
  im = Image.open(os.path.join(D, sh)).convert('RGB')
  for i, (x0, x1) in enumerate(cols):
    c = im.crop((x0, y0, x1, y1)); w = 300; h = round(c.height * w / c.width)
    c.resize((w, h), Image.LANCZOS).save(os.path.join(D, 'newg', '%s%d.jpg' % (k, i + 1)), quality=88)
print('ok')
