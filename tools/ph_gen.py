# tools/ph_gen.py — 2026-11-12 第四十七次 第 2 點：🔤 Phonics Master 每一個 字卡 的 發音 ＝ 照 字卡 下面 的 雙語 注音 唸（不是 瀏覽器 自己 猜）
#   做法：每一張 卡 ＝ 字首 碼＋母音 碼＋字尾 碼（例 k-ae-d），碼 ➜ 音標（IPA）直接 送進 HiFi-Captain 女聲（tts_gen.hf_raw），不 經過 拼字 ➜
#   Ced 不會 唸成 C-E-D、kad 的 a 一定 是 /æ/、kod 的 o 一定 是 /ɑ/、ward 的 ar 一定 是 /ɑr/（跟 字卡 一樣）。
#   碼 一樣 ＝ 唸法 一樣 ＝ 同 一個 檔（c／k、ph／f、ss／s、mb／m…），檔名 phonics/au/<字首>-<母音>-<字尾>.mp3
#   z 開頭：z 拉長 一點（zz），跟 s 分得 出來（老師：S 和 Z 太 像）
# 用法：TTS_MODELS=<模型> python3 tools/ph_gen.py [只做 前 N 個]
import os, sys, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
ASR = asr_lib.available()
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'phonics', 'au'); os.makedirs(OUT, exist_ok=True)
L = json.load(open(os.path.join(ROOT, 'phonics', '_codes.json'), encoding='utf8'))   # [[碼, 音標], …]（node phonics/_build.js 產生）
N = int(sys.argv[1]) if len(sys.argv) > 1 else len(L)
P = int(sys.argv[2]) if len(sys.argv) > 2 else 1; K = int(sys.argv[3]) if len(sys.argv) > 3 else 0   # 分 P 份 平行 做，這是 第 K 份
SPD = 0.8 * T.HFBASE
made = 0
zbad = []
for n, (code, ph) in enumerate(L[:N]):
    if n % P != K: continue
    f = os.path.join(OUT, code + '.mp3')
    if os.path.exists(f): continue
    y = T.hf_raw(ph, 0, SPD)
    # z 開頭：這個 女聲 的 z 常常 不夠 「嗡」，聽起來 像 s ➜ 最多 做 10 次，電腦 聽寫 聽到 z 開頭 才 用
    if ASR and code.startswith('z-'):
        for tr in range(10):
            h = asr_lib.hear(y, 22050).lower().strip(' "\'-.')
            if h.startswith('z') or h.startswith('x'): break
            y = T.hf_raw(ph, 0, SPD)
        else: zbad.append(code)
    T.mp3(y, 22050, f); made += 1
print('phonics 語音：一共', len(L), '個，新做', made, '個；z 開頭 聽寫 一直 不是 z：', len(zbad), zbad[:20])
