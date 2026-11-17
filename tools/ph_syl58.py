# tools/ph_syl58.py — 2026-11-17 第五十八次 老師 (6)-1：🪜 多 音節 進階版（3、4 音節 的 字）的 語音
#   整個 字 ＝ HiFi-Captain 女聲 照 音標 唸（hf_raw），電腦 聽寫 ＝ 那個 字 才 用（最多 試 8 次）➜ phonics/au/w_c58_<字>.mp3
#   每 一個 音節 ＝ 從 這個 真的 字 切 出來（跟 第五十五次 kitchen 一樣：音調 跟 整個 字 一樣，不 會 走調）：
#     找 N 個 母音 中心（有 聲音 的 能量 高峰），在 兩個 高峰 中間 最 小聲 的 地方 切 ➜ sy_<字>_<i>.mp3
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_syl58.py
import os, sys, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_iso import feats, fr2s, SR
from ph_iso50 import fade, level, act_rms, load
from ph_fix56 import trim
AU = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'phonics', 'au')
W = [  # 字、音標（重音 ˈ）、音節 數
    ('banana', 'bənˈænə', 3), ('umbrella', 'ʌmbɹˈɛlə', 3), ('tomato', 'təmˈeɪɾoʊ', 3), ('hamburger', 'hˈæmbɜːɡɚ', 3),
    ('fantastic', 'fæntˈæstɪk', 3), ('family', 'fˈæməli', 3), ('animal', 'ˈænəməl', 3), ('elephant', 'ˈɛləfənt', 3),
    ('watermelon', 'wˈɔːɾɚmˌɛlən', 4), ('caterpillar', 'kˈæɾɚpˌɪlɚ', 4), ('alligator', 'ˈælɪɡˌeɪɾɚ', 4), ('helicopter', 'hˈɛlɪkˌɑːptɚ', 4)]
def split(y, n):
    F = feats(y); e = F[:, 0] * (F[:, 3] > 0.4); k = np.ones(5) / 5; e = np.convolve(e, k, 'same')
    peaks = []; order = np.argsort(-e)
    for i in order:
        if e[i] <= 0: break
        if all(abs(i - p) > max(6, int(len(e) / (n + 1) * 0.55)) for p in peaks): peaks.append(i)   # 兩個 母音 中心 至少 隔 平均 音節 長 的 一半 多
        if len(peaks) == n: break
    peaks.sort(); cuts = [0]
    for a, b in zip(peaks, peaks[1:]): cuts.append(fr2s(a + int(np.argmin(e[a:b + 1]))))
    cuts.append(len(y)); return [y[cuts[i]:cuts[i + 1]] for i in range(n)]
if __name__ == '__main__':
    tgt = act_rms(load(os.path.join(AU, 'bk_bathroom.mp3'))); out = {}
    for w, ph, n in W:
        best = None
        if os.path.exists(os.path.join(AU, 'w_c58_' + w + '.mp3')) and os.environ.get('KEEP'):
            y = load(os.path.join(AU, 'w_c58_' + w + '.mp3')); best = (y, '(舊 檔)')
        for t in range(0 if best else 8):
            y = trim(T.hf_raw(ph, 0, (0.85 if t % 2 == 0 else 0.8) * T.HFBASE), 0.02); h = asr_lib.hear(y, SR).lower()
            if w in h: best = (y, h); break
            if best is None: best = (y, h)
        y = best[0]; T.mp3(level(fade(y, 0.005, 0.03), tgt), SR, os.path.join(AU, 'w_c58_' + w + '.mp3'))
        parts = split(y, n)
        for i, p in enumerate(parts): T.mp3(level(fade(p, 0.008, 0.03), tgt), SR, os.path.join(AU, 'sy_' + w + '_' + str(i) + '.mp3'))
        out[w] = [best[1], [round(len(p) / SR, 2) for p in parts]]
    json.dump(out, open(os.path.join(AU, '..', '_syl58.json'), 'w'), ensure_ascii=False, indent=0); print(json.dumps(out, ensure_ascii=False))
