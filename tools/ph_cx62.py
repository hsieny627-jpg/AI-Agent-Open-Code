# tools/ph_cx62.py — 2026-11-19 第六十二次 老師 4（其他 課本 字 也 要）：〔✨ 常見 拼字 組合〕的 延伸 字 聲音 cx_<字>（電腦 聽寫 聽 對 才 用，最多 8 次）
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_cx62.py
# 結果 2026-11-19：zoo 電腦 聽寫 聽成 Sue ➜ 不 用（從 延伸 字 拿掉）
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_gen2_same import same
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'phonics', 'au')
W = {'dish': 'dˈɪʃ', 'wish': 'wˈɪʃ', 'me': 'mˈiː', 'we': 'wˈiː', 'go': 'ɡˈoʊ', 'so': 'sˈoʊ', 'moon': 'mˈuːn', 'food': 'fˈuːd', 'zoo': 'zˈuː',
     'math': 'mˈæθ', 'path': 'pˈæθ', 'catch': 'kˈætʃ', 'match': 'mˈætʃ', 'sing': 'sˈɪŋ', 'ring': 'ɹˈɪŋ', 'when': 'wˈɛn', 'white': 'wˈaɪt',
     'girl': 'ɡˈɜːɹl', 'shirt': 'ʃˈɜːɹt', 'nurse': 'nˈɜːɹs', 'hurt': 'hˈɜːɹt', 'funny': 'fˈʌni', 'sunny': 'sˈʌni', 'green': 'ɡɹˈiːn', 'grass': 'ɡɹˈæs'}
bad = {}
for w, ph in W.items():
    best = None
    for sp in (0.8, 0.85, 0.75, 0.9, 0.7, 0.95, 0.82, 0.78):
        y = T.hf_raw(ph + '.', 0, sp * T.HFBASE); h = asr_lib.hear(y, 22050)
        if best is None: best = (y, h)
        if same(h, w): best = (y, h); break
    else: bad[w] = best[1]
    T.mp3(best[0], 22050, os.path.join(OUT, 'cx_' + w + '.mp3'))
print('聽寫 不 對：', bad)
