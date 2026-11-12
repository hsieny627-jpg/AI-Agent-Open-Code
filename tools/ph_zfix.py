# tools/ph_zfix.py — 2026-11-12 第四十七次 2-(2)：z 開頭 的 字 ph_gen 做 10 次 電腦 聽寫 都 不是 z 的，換 拉長 的 z（zz、zzː、zː）再 做，聽到 z 才 換；
#   還是 不行 的 列 出來（_zbad.json），老師 試聽 頁 會 標 出來
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); OUT = os.path.join(ROOT, 'phonics', 'au')
L = dict(json.load(open(os.path.join(ROOT, 'phonics', '_codes.json'), encoding='utf8')))
SPD = 0.8 * T.HFBASE
def hz(y): h = asr_lib.hear(y, 22050).lower().strip(' "\'-.'); return h.startswith('z') or h.startswith('x')
bad = []; fixed = 0
for c, ph in L.items():
    if not c.startswith('z-'): continue
    f = os.path.join(OUT, c + '.mp3')
    import subprocess, numpy as np
    good = None
    for pre in ['zz', 'zzː', 'zː', 'z']:
        for tr in range(6):
            y = T.hf_raw(pre + ph[1:], 0, SPD)
            if hz(y): good = y; break
        if good is not None: break
    if good is None: bad.append(c); continue
    T.mp3(good, 22050, f); fixed += 1
json.dump(bad, open(os.path.join(ROOT, 'phonics', '_zbad.json'), 'w'))
print('z 開頭 重做', fixed, '個 聽寫 是 z；還是 不是 z：', len(bad), bad)
