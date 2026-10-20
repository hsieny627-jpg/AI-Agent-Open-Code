# rpg/_eyes.py — 戰士、寵物「活起來」用的眼睛位置（2026-10-20 第十五次，老師選 C：先用現在的圖做）
#   python3 -I rpg/_eyes.py   ➜ rpg/_eyes.json（{編號: [[x0,y0,x1,y1,'#皮膚色'], …]}，單位 ％）
# 眼睛的框 ＝ rpg/_eyes_src.json（戰士：mediapipe 臉部辨識；寵物：一張一張找、放大格子對過；每一張都畫圈看過）
# 皮膚色 ＝ 眼睛正下方一小塊的中間值（眨眼的眼皮用這個顏色）。沒有眼睛的（面罩、頭盔、閉著眼睛、很酷的神獸）＝ 不眨眼，只有呼吸、發光、出招
import json, os
import numpy as np
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(D, '_eyes_src.json'))); out = {}
for k, boxes in S.items():
  f = os.path.join(D, 'chars' if k[0] in 'bg' else 'pets' if k[0] == 'p' else 'shop', k + '.jpg')
  q = np.asarray(Image.open(f).convert('RGB')).astype(float); H, W = q.shape[:2]; r = []
  for b in boxes:
    x0, y0, x1, y1 = b; bh = (y1 - y0) / 100 * H
    xa, xb = int((x0 + (x1 - x0) * .25) / 100 * W), int((x1 - (x1 - x0) * .25) / 100 * W)
    ya, yb = int(y1 / 100 * H + bh * .35), int(y1 / 100 * H + bh * 1.1) + 1
    m = np.median(q[ya:yb, xa:xb].reshape(-1, 3), 0)
    r.append([round(v, 1) for v in b] + ['#%02X%02X%02X' % tuple(int(v) for v in m)])
  out[k] = r
json.dump(out, open(os.path.join(D, '_eyes.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
print('eyes ok：' + str(len(out)) + ' 張')
