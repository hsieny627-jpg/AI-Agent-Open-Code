# rpg/_crop_newf.py — 2026-11-01 第三十九次：老師上傳的 5 張女戰士新圖（每張 2 人、左上角 01 ＝ ★ 基本）切成 rpg/newf/A1～E2.jpg（寬 300px）➜ rpg/chars/g57～g66
# 用法：python3 -I rpg/_crop_newf.py。框照「跟背景不一樣的欄、列」量出來的。
# 老師 2026-11-01：「請您直接上架女生戰士[基本]圖案，除非特殊情形，否則不需先經過我同意」➜ 直接上架（APPROVED = True）
import os, shutil
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
SHEETS = [('sheet_f1_A.jpg', 'A', [(76,15,457,557),(567,16,948,557)]),
          ('sheet_f1_B.jpg', 'B', [(49,8,492,566),(533,8,974,566)]),
          ('sheet_f1_C.jpg', 'C', [(26,19,486,552),(538,19,998,552)]),
          ('sheet_f1_D.jpg', 'D', [(62,26,470,557),(542,14,973,567)]),
          ('sheet_f1_E.jpg', 'E', [(66,13,474,562),(550,12,958,562)])]
os.makedirs(os.path.join(D, 'newf'), exist_ok=True)
for sh, k, boxes in SHEETS:
  im = Image.open(os.path.join(D, sh)).convert('RGB')
  for i, b in enumerate(boxes):
    c = im.crop(b); w = 300; h = round(c.height * w / c.width)
    c.resize((w, h), Image.LANCZOS).save(os.path.join(D, 'newf', '%s%d.jpg' % (k, i + 1)), quality=88)
# 女 57 Forest Warden、58 Lightning Striker、59 Aurora Paladin、60 Amethyst Guard、61 Terra Warden、
# 62 Glacial Knight、63 Astral Sentinel、64 Gale Blade、65 Earth Vanguard、66 Solar Paladin ＝ ★ 基本
ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2']
APPROVED = True
if APPROVED:
  for n, k in enumerate(ORDER):
    shutil.copy(os.path.join(D, 'newf', k + '.jpg'), os.path.join(D, 'chars', 'g%02d.jpg' % (57 + n)))
print('ok')
