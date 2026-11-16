# tools/ph_map56.py — 第五十六次 🗺️ 拼音 地圖 要 的 聲音：
#   ① 真的 字（w_<字>）：ball fall day cake rain car baby＋新 字尾 的 例字（kept fact next help self melt crisp lunch lamb old talk）
#      電腦 聽寫（Whisper）聽 到 ＝ 要 的 字 才 用（最多 12 次）
#   ② 注音（zy_<名>）：ㄅ（唸 ㄅㄛ）、ㄚ、ㄅㄚ（八）＝ melo 中文 女聲（vits-melo-tts-zh_en）
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_map56.py
import os, sys, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib, sherpa_onnx
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
W = ['ball', 'fall', 'day', 'cake', 'rain', 'car', 'baby', 'kept', 'fact', 'next', 'help', 'self', 'melt', 'crisp', 'lunch', 'lamb', 'old', 'talk', 'tin', 'bat', 'song']
bad = []
for w in W:
    f = os.path.join(AU, 'w_' + w + '.mp3')
    if os.path.exists(f): continue
    got = None
    for k in range(12):
        y, sr = T.gen_hf(w.capitalize() + '.', 0, 0.8 + 0.03 * (k % 4), None)
        h = asr_lib.norm(asr_lib.hear(np.concatenate([y, np.zeros(sr // 4, np.float32)]), sr))
        if h == w: got = (y, sr); break
    if got is None: bad.append(w); got = (y, sr)
    T.mp3(got[0], got[1], f)
print('聽寫 不 對：', bad)
M = os.path.join(os.environ['TTS_MODELS'], 'vits-melo-tts-zh_en')
cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=M + '/model.onnx', lexicon=M + '/lexicon.txt', tokens=M + '/tokens.txt', dict_dir=M + '/dict'), num_threads=2))
tts = sherpa_onnx.OfflineTts(cfg)
for nm, txt in [('zy_b', '玻'), ('zy_a', '啊'), ('zy_ba', '八')]:
    a = tts.generate(txt, sid=0, speed=0.85); T.mp3(np.array(a.samples, np.float32), a.sample_rate, os.path.join(AU, nm + '.mp3'))
print('ok')
