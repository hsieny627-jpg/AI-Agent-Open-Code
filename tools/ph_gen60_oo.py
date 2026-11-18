# tools/ph_gen60_oo.py — 2026-11-18 第六十次：短 oo（good book）新 組合 的 聲音（ph_gen57 一樣，但 電腦 聽寫 不 對 的 ＝ 加進 _asrbad57_3.json，不 蓋掉 舊 的）
#   拼字 是 真的 英文 字（CMU 字典 有）＝ 電腦 聽寫 聽 對 才 用（最多 6 次；都 不 對 ＝ 記在 _asrbad57_K.json）；其他 ＝ 音標 直接 送 HiFi-Captain 女聲（語速 0.8，跟 ph_gen2 一樣）
# 用法：TTS_MODELS=<模型> python3 tools/ph_gen57.py <份數 P> <第 K 份>
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib, cmudict
from ph_gen2_same import same
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); OUT = os.path.join(ROOT, 'phonics', 'au')
L = json.load(open(os.path.join(ROOT, 'phonics', '_codes57.json'), encoding='utf8')); CMU = cmudict.dict()
P = int(sys.argv[1]); K = int(sys.argv[2]); bad = {}; made = 0
for n, (c, ph, w) in enumerate(L):
    if n % P != K: continue
    path = os.path.join(OUT, c + '.mp3')
    if os.path.exists(path): continue
    if w and w in CMU:
        best = None
        for sp in (0.8, 0.85, 0.75, 0.9, 0.7, 0.95):
            y = T.hf_raw(ph, 0, sp * T.HFBASE); h = asr_lib.hear(y, 22050)
            if best is None: best = (y, h)
            if same(h, w): best = (y, h); break
        else: bad[c] = [w, best[1]]
        T.mp3(best[0], 22050, path)
    else: T.mp3(T.hf_raw(ph, 0, 0.8 * T.HFBASE), 22050, path)
    made += 1
BF=os.path.join(ROOT,'phonics','_asrbad57_3.json'); old=json.load(open(BF,encoding='utf8')); old.update(bad); json.dump(old, open(BF,'w',encoding='utf8'), ensure_ascii=False); print(made, bad)
print('第', K, '份：做了', made, '個；聽寫 都 不 對：', len(bad))
