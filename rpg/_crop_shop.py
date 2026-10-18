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
# 圖上的英文名字要改的：蓋掉原本的字、用同樣的白色粗體重寫
#   2026-10-18 第十次：光環 16「Crimson Blood Lust Aura」➜ Crimson Vortex Aura；第十一次老師換了新的光環圖（16 ＝ Sacred Rune Halo）➜ 不用改了
RENAME = {}
FONT = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'
def relabel(cell, text):
  from PIL import ImageDraw, ImageFont
  a = np.asarray(cell).astype(int); H, W = a.shape[:2]; y0 = int(H * .80)
  band = a[y0:H - int(H * .03), int(W * .06):W - int(W * .06)]
  txt = band.min(2) > 175                                    # 白色的字
  ys, xs = np.where(txt)
  ty0, ty1 = ys.min() + y0, ys.max() + y0; tx0, tx1 = xs.min() + int(W * .06), xs.max() + int(W * .06)
  out = a.copy()
  for y in range(ty0 - 2, ty1 + 3):                           # 每一排用那一排左右兩邊（沒有字的地方）的顏色補起來
    L = a[y, tx0 - 8:tx0 - 3].mean(0); R = a[y, tx1 + 3:tx1 + 8].mean(0)
    for x in range(tx0 - 3, tx1 + 4): t = (x - tx0 + 3) / (tx1 - tx0 + 6); out[y, x] = L * (1 - t) + R * t
  im = Image.fromarray(out.astype('uint8')); d = ImageDraw.Draw(im)
  h = ty1 - ty0 + 1; size = int(h * 1.32); f = ImageFont.truetype(FONT, size)
  while d.textlength(text, font=f) > (tx1 - tx0) * 1.02 and size > 6: size -= 1; f = ImageFont.truetype(FONT, size)
  cx, cy = W / 2, (ty0 + ty1) / 2
  d.text((cx + 1, cy + 1), text, font=f, fill=(0, 0, 0), anchor='mm'); d.text((cx, cy), text, font=f, fill=(255, 255, 255), anchor='mm')
  return im
MODE = {4: 'frame', 5: 'bg'}
# 2026-10-18 第十一次 老師換了 01～04 的新圖：02 披風格子貼得很近、04 名字框沒有格子（框下面一行名字）➜ 自動找不到，直接寫格子的位置（量過）
#   04：rows ＝ 框，LABEL ＝ 框下面那一行名字（商店卡 ＝ 框＋名字；穿在身上 ＝ 只有框）
GRID = {2: ([(7, 203), (210, 406), (413, 609), (617, 813), (820, 1016)], [(2, 146), (147, 289), (290, 432), (433, 568)]),
        4: ([(14, 211), (219, 408), (415, 608), (614, 809), (816, 1009)], [(18, 115), (159, 261), (304, 408), (448, 543)])}
LABEL = {4: [(129, 141), (271, 283), (416, 428), (549, 561)]}
# 穿在身上那一張要擦掉的號碼牌（框裡面的比例 左、上、右、下）：02 左上角、03 右下角
MASK = {2: (0, 0, .22, .2), 3: (.76, .8, 1, 1)}
LOCALBG = {2, 3}
# 穿在身上那一張要切掉的（左、上、右、下 的比例）：02 披風上面有號碼牌；05 背景左上角、下面中間有號碼牌、最下面有名字
INSET = {2: (.05, .04, .05, .2), 3: (.05, .05, .05, .05), 5: (.06, .17, .06, .27)}   # 04 名字框：圖上沒有字、整個框都要；05 背景：不可以變透明
def even(r):
  # 格子一樣大：有一格被旁邊的光暈撐寬（例 03 必殺特效的雷射）➜ 照「寬度正常的那幾格」排成等距
  ws = sorted(b - a for a, b in r); w = ws[len(ws) // 2]
  good = [i for i, (a, b) in enumerate(r) if abs((b - a) - w) <= w * .1]
  if len(good) == len(r) or len(good) < 2: return r
  p = (r[good[-1]][0] - r[good[0]][0]) / (good[-1] - good[0])
  st = sorted(r[i][0] - i * p for i in good); a0 = st[len(st) // 2]
  return [(int(round(a0 + i * p)), int(round(a0 + i * p)) + w) for i in range(len(r))]
done = 0
for src in sorted(glob.glob(os.path.join(D, 'shop_[01][0-9]_*.jpg'))):
  c = int(re.search(r'shop_(\d\d)_', src).group(1))
  im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(int)
  bg = np.median(np.concatenate([a[:3].reshape(-1, 3), a[-3:].reshape(-1, 3)]), 0)   # 底色 ＝ 最上、最下三排的中間值
  d = np.abs(a - bg).sum(2) > 40
  cols = rows = None
  if c in GRID: cols, rows = GRID[c]
  for th in (0.1, 0.15, 0.2, 0.05):   # 找得到 5 欄、4 列為止
    cols = cols or runs(d.mean(0), th, 5); rows = rows or runs(d.mean(1), th, 4)
  if not cols or not rows: raise SystemExit('找不到 5✕4 的框：' + src)
  if c not in GRID: cols, rows = even(cols), even(rows)
  ri = -1
  n = 1
  for (Y0, Y1) in rows:
    ri += 1
    for (X0, X1) in cols:
      x0, y0, x1, y1 = X0, Y0, X1, Y1
      M = MODE.get(c, '')
      if M == 'frame': x0, y0, x1, y1 = max(0, x0 - 6), max(0, y0 - 6), min(im.width - 1, x1 + 6), min(im.height - 1, y1 + 6)
      cy1 = min(im.height - 1, LABEL[c][ri][1] + 6) if c in LABEL else y1   # 商店卡：名字框連下面那一行名字
      cell = im.crop((x0, y0, x1 + 1, cy1 + 1)); w = 240
      if (c, n) in RENAME: cell = relabel(cell, RENAME[(c, n)])
      cell.resize((w, round(cell.height * w / cell.width)), Image.LANCZOS).save(os.path.join(OUT, 's%02d%02d.jpg' % (c, n)), quality=88)
      # 穿在身上：框裡面、名字上面那一塊（框 7%、名字 19%）；接近底色的地方變透明（邊緣慢慢淡掉）
      #   名字框（沒有字）＝ 整個框；背景 ＝ 不透明；號碼牌切掉（INSET）
      W, H = x1 - x0, y1 - y0
      L, T, R, B = INSET.get(c, (.07, .05, .07, .19))
      box = (x0, y0, x1 + 1, y1 + 1) if M == 'frame' else (x0 + int(W * L), y0 + int(H * T), x1 - int(W * R), y1 - int(H * B))
      ic = im.crop(box).convert('RGBA')
      q = np.asarray(ic).astype(float)
      lb = bg
      if c in LOCALBG:   # 格子裡面自己的底色（02 披風、03 必殺：框裡面是深藍灰，不是整張圖的底色）＝ 這一塊最外面一圈的中間值
        hh, ww = q.shape[:2]; k = max(2, int(min(hh, ww) * .04))
        ring = np.concatenate([q[:k, :, :3].reshape(-1, 3), q[-k:, :, :3].reshape(-1, 3), q[:, :k, :3].reshape(-1, 3), q[:, -k:, :3].reshape(-1, 3)])
        lb = np.median(ring, 0)
      dist = np.abs(q[..., :3] - lb).sum(2)
      if M != 'bg': q[..., 3] = np.clip((dist - 30) / 90, 0, 1) * 255
      if c in MASK:
        hh, ww = q.shape[:2]; m = MASK[c]; bx = (x0, y0, x1 + 1, y1 + 1)
        # 號碼牌的位置照「整格」算，換成這一張（已經切掉 INSET）的座標
        X0m = int(x0 + W * m[0]) - box[0]; Y0m = int(y0 + H * m[1]) - box[1]; X1m = int(x0 + W * m[2]) - box[0]; Y1m = int(y0 + H * m[3]) - box[1]
        yy, xx = np.mgrid[0:hh, 0:ww]   # 擦掉號碼牌：離那一塊愈近愈透明（不留一個方方的洞）
        dx = np.maximum(np.maximum(X0m - xx, xx - X1m), 0); dy = np.maximum(np.maximum(Y0m - yy, yy - Y1m), 0)
        q[..., 3] *= np.clip(np.hypot(dx, dy) / (min(hh, ww) * .06), 0, 1)
      if not M:   # 四邊 8% 慢慢淡掉：框的邊角不會跟著光環轉成一條黑線（2026-10-18 第十次量到的）
        hh, ww = q.shape[:2]; e = lambda n: np.clip(np.minimum(np.arange(n), np.arange(n)[::-1]) / (n * .08), 0, 1)
        q[..., 3] *= np.outer(e(hh), e(ww))
      Image.fromarray(q.astype('uint8'), 'RGBA').resize((360, round(ic.height * 360 / ic.width)), Image.LANCZOS).save(os.path.join(OUT, 's%02d%02di.webp' % (c, n)), quality=80, method=4)
      n += 1
  done += 1
print('shop ok：' + str(done) + ' 張圖鑑')
