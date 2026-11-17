# tools/ph_c57.py — 2026-11-17 第五十七次：🗺️ 拼音 地圖 ⑧ baby〔➕ 再 看〕的 課本 兩 音節 字（電腦 聽寫 聽 對 才 用）＋單獨 的 oy 聲音
# 用法：TTS_MODELS=<模型> python3 tools/ph_c57.py
import os, sys, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_gen2_same import same
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'phonics', 'au')
W = {'seven': 'ˈsɛvən.', 'letter': 'ˈlɛɾɚ.', 'doctor': 'dˈɑːktɚ.', 'number': 'ˈnʌmbɚ.', 'sister': 'ˈsɪstɚ.', 'farmer': 'fˈɑːɹmɚ.'}
for w, ph in W.items():
    ok = None
    for sp in (0.85, 0.8, 0.9, 0.75, 0.95, 0.7, 1.0, 0.85):
        y = T.hf_raw(ph, 0, sp * T.HFBASE); h = asr_lib.hear(y, 22050)
        if ok is None: ok = (y, h, False)
        if same(h, w): ok = (y, h, True); break
    T.mp3(ok[0], 22050, os.path.join(OUT, 'w_c57_' + w + '.mp3')); print(w, '聽寫：', ok[1], '✔' if ok[2] else '✗')
y = T.hf_raw('ɔɪ.', 0, 0.8 * T.HFBASE); a = np.abs(y); i = np.where(a > a.max() * 0.03)[0]; y = y[i[0]:i[-1]]
T.mp3(y, 22050, os.path.join(OUT, 's_oy.mp3')); print('s_oy', round(len(y) / 22050, 2))
