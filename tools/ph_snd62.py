# tools/ph_snd62.py — 2026-11-19 第六十二次 老師 2-(3)：44 音 字卡 缺 的 單獨 聲音＋例字
#   單獨：s_zh（ʒ：si／ge，television 的 s）、s_ear（ɪɹ）、s_air（ɛɹ）、s_ax（ə 弱化音）、s_yu（ju：u_e）
#   做法：母音／長音 ＝ 唸 拉長 的 聲音，只 留 最 穩 的 中間 一段（ph_fix61 的 steady）；ear／air ／ yu ＝ 整個 聲音 切掉 前後 沒 聲音
#   例字：television、hear、hair（電腦 聽寫 聽 對 才 用，最多 8 次）
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_snd62.py ；試聽 listen/2026-11-19_P62/（第二 張 表）
import os, sys, json, shutil, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_gen2_same import same
from ph_iso import SR
from ph_iso50 import fade, level, load, act_rms
from ph_fix56 import trim
from ph_fix61 import steady, cand
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au'); LI = os.path.join(ROOT, 'listen', '2026-11-19_P62')
tgV = act_rms(load(os.path.join(AU, 's_eh.mp3'))); tgC = act_rms(load(os.path.join(AU, 's_z.mp3')))
def put(c, y, tg):
    y = level(y.astype(np.float32), tg); T.mp3(y, SR, os.path.join(AU, c + '.mp3')); shutil.copy(os.path.join(AU, c + '.mp3'), os.path.join(LI, c + '.mp3')); return round(len(y) / SR, 3)
if __name__ == '__main__' and len(sys.argv) == 1:
    out = {}
    z = [steady(y, .3) for y in [trim(T.hf_raw(q, 0, sp * T.HFBASE), 0.02) for q in ('ʒʒʒʒʒ', 'ʒːːːː', 'ɪʒʒʒʒ') for sp in (0.4, 0.5)] if len(y) > SR * .32]; out['s_zh'] = put('s_zh', fade(max(z, key=lambda y: act_rms(y)), .02, .06), tgC)
    a = [steady(y, .3) for y in [trim(T.hf_raw(q, 0, sp * T.HFBASE), 0.02) for q in ('əːːːː', 'ʌːːːː') for sp in (0.4, 0.5)] if len(y) > SR * .32]; out['s_ax'] = put('s_ax', fade(a[0], .015, .05), tgV)
    for c, ph in (('s_ear', 'ɪɹ'), ('s_air', 'ɛɹ'), ('s_yu', 'juː')):
        y = max([trim(T.hf_raw(ph, 0, 0.6 * T.HFBASE), 0.03) for _ in range(3)], key=len); out[c] = put(c, fade(y, .015, .06), tgV)
    W = {'television': 'tˈɛlɪvˌɪʒən', 'hear': 'hˈɪɹ', 'hair': 'hˈɛɹ'}; bad = {}
    for w, ph in W.items():
        best = None
        for sp in (0.8, 0.85, 0.75, 0.9, 0.7, 0.95, 0.82, 0.78):
            y = T.hf_raw(ph + '.', 0, sp * T.HFBASE); h = asr_lib.hear(y, 22050)
            if best is None: best = (y, h)
            if same(h, w): best = (y, h); break
        else: bad[w] = best[1]
        T.mp3(best[0], 22050, os.path.join(AU, 'w_c62_' + w + '.mp3'))
    out['bad'] = bad; json.dump(out, open(os.path.join(LI, '_snd.json'), 'w'), ensure_ascii=False); print(out)

# ── 第二 部分（python3 tools/ph_snd62.py zh）：電腦 單獨 唸 的 ʒ 量 起來 像 母音（高頻 只有 12%）➜ 改 從 真的 television 切 出 ʒ（0.48～0.56 秒，高頻 93～96%），
#    中間 穩 的 一小段 用 交叉 淡入 接 長 到 0.3 秒（不 加 母音；ph_iso 的 做法）
def zh_from_word():
    y = load(os.path.join(AU, 'w_c62_television.mp3')); n = int(SR * .02); fr = []
    for i in range(0, len(y) - n, n):
        s = y[i:i + n]; F = np.abs(np.fft.rfft(s)); f = np.fft.rfftfreq(n, 1 / SR); fr.append(F[f > 2500].sum() / (F.sum() + 1e-9))
    idx = [k for k in range(len(fr)) if fr[k] > .7 and k * n > len(y) * .4]
    a, b = idx[0] * n, (idx[-1] + 1) * n; seg = y[a:b]; ch = seg[int(len(seg) * .2):int(len(seg) * .8)]; x = int(SR * .012); out = seg[:int(len(seg) * .5)].copy()
    while len(out) < SR * .3:
        r = np.linspace(0, 1, x); out = np.concatenate([out[:-x], out[-x:] * (1 - r) + ch[:x] * r, ch[x:]])
    return out[:int(SR * .3)]
if __name__ == '__main__' and len(sys.argv) > 1 and sys.argv[1] == 'zh':
    print({'s_zh': put('s_zh', fade(zh_from_word(), .02, .06), tgC)})
