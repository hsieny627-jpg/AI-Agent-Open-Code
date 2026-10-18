# rpg/_crop_shop.py — 🏪 榮耀寶物商城：老師上傳的圖鑑（5 欄 ✕ 4 列）自動找框、切成一張一張（2026-10-18 第九次）
# 用法：python3 -I rpg/_crop_shop.py   （原圖 rpg/shop_01_*.jpg ～ shop_10_*.jpg；切好的放 rpg/shop/）
#   s0101.jpg ＝ 商店卡（整格：框＋圖上的英文名字，寬 240px）、s0101i.webp ＝ 穿在英雄身上用的（只有圖、底色變透明，寬 360px）
# 為什麼不用 CSS 一格一格位移（background-position）：圖的四邊有留白、格子之間有縫，25%／33.333% 一格會切歪；照框切才準。
import os, glob, re
import numpy as np
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(D, 'shop'); os.makedirs(OUT, exist_ok=True)
def runs(v, th, n):
  out = []; s = None
  for i, x in enumerate(v):
    if x > th and s is None: s = i
    if x <= th and s is not None: out.append((s, i - 1)); s = None
  if s is not None: out.append((s, len(v) - 1))
  out = [r for r in out if r[1] - r[0] > 20]
  return out if len(out) == n else None
done = 0
for src in sorted(glob.glob(os.path.join(D, 'shop_[01][0-9]_*.jpg'))):
  c = int(re.search(r'shop_(\d\d)_', src).group(1))
  im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(int)
  bg = np.median(np.concatenate([a[:3].reshape(-1, 3), a[-3:].reshape(-1, 3)]), 0)   # 底色 ＝ 最上、最下三排的中間值
  d = np.abs(a - bg).sum(2) > 40
  cols = rows = None
  for th in (0.1, 0.15, 0.2, 0.05):   # 找得到 5 欄、4 列為止
    cols = cols or runs(d.mean(0), th, 5); rows = rows or runs(d.mean(1), th, 4)
  if not cols or not rows: raise SystemExit('找不到 5✕4 的框：' + src)
  n = 1
  for (y0, y1) in rows:
    for (x0, x1) in cols:
      cell = im.crop((x0, y0, x1 + 1, y1 + 1)); w = 240
      cell.resize((w, round(cell.height * w / cell.width)), Image.LANCZOS).save(os.path.join(OUT, 's%02d%02d.jpg' % (c, n)), quality=88)
      # 穿在身上：框裡面、名字上面那一塊（框 7%、名字 19%）；接近底色的地方變透明（邊緣慢慢淡掉）
      W, H = x1 - x0, y1 - y0
      ic = im.crop((x0 + int(W * .07), y0 + int(H * .05), x1 - int(W * .07), y1 - int(H * .19))).convert('RGBA')
      q = np.asarray(ic).astype(float); dist = np.abs(q[..., :3] - bg).sum(2)
      q[..., 3] = np.clip((dist - 30) / 90, 0, 1) * 255
      Image.fromarray(q.astype('uint8'), 'RGBA').resize((360, round(ic.height * 360 / ic.width)), Image.LANCZOS).save(os.path.join(OUT, 's%02d%02di.webp' % (c, n)), quality=80, method=6)
      n += 1
  done += 1
print('shop ok：' + str(done) + ' 張圖鑑')
