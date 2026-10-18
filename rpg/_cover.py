# rpg/_cover.py — 老師的封面照片 login_cover_dark_B.jpg（左男生、右女生）➜ 小圖示＋大封面（2026-10-18 第十次：🦸 圖示太幼稚，換成這張照片）
# 用法：python3 -I rpg/_cover.py
#   cover_icon.webp ＝ 按鈕、標題用的小圖示（兩張臉並排，中間一條金線，寬 2：高 1）
#   cover.webp      ＝〔戰神之路〕那一頁最上面的大封面
import os
from PIL import Image, ImageDraw
D = os.path.dirname(os.path.abspath(__file__))
im = Image.open(os.path.join(D, 'login_cover_dark_B.jpg')).convert('RGB')
m = im.crop((160, 128, 410, 378)).resize((128, 128), Image.LANCZOS)    # 男生的臉
f = im.crop((620, 142, 870, 392)).resize((128, 128), Image.LANCZOS)    # 女生的臉
o = Image.new('RGB', (256, 128)); o.paste(m, (0, 0)); o.paste(f, (128, 0))
ImageDraw.Draw(o).rectangle((126, 0, 129, 127), fill=(255, 213, 74))
o.save(os.path.join(D, 'cover_icon.webp'), quality=86, method=6)
im.save(os.path.join(D, 'cover.webp'), quality=80, method=6)
print('cover ok')
