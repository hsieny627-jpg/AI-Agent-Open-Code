# tools/ph_fix61.py — 2026-11-18 第六十一次：老師 聽 P60 的 回答
#   字尾 d ＝ A（網站 已經 是，不 動）
#   ball 的 a、or 的 o（s_ao）：全部 都 不好 ➜ 堅定、乾淨 的 ㄛ，刪 尾音 ㄜ 和 其他 不 相關 的 聲音
#     做法：唸 長長 的 o／ɔ，只 留「F1、F2 最 穩」的 中間 0.38 秒（不要 開頭 滑進來、不要 結尾 滑 到 ㄜ），快速 淡入 淡出
#     E ＝ 純 o（最 像 ㄛ，網站 用）、F ＝ 圓 的 ɔ
#   qu（s_kw）＝ B（真的 queen 開頭）但 尾音 改成 堅定 的 ㄨ ➜ B 的 kʰ 爆破＋吹氣 ＋ 穩定 的 uː 0.2 秒
#   字尾 ch（s_ech）：聲音 OK，刪 開頭 不 相關 的 聲音 ➜ 從 摩擦 聲 真的 開始 的 那 一刻 才 開始
#   短 oo（s_oo）＝ 堅定 清晰 的 ㄨㄛ（ʊ 穩定 的 中間 0.36 秒）
# 試聽頁 listen/2026-11-18_P61/（網站 原本 的 放 v60/）。用法：TTS_MODELS=/tmp/models python3 tools/ph_fix61.py
import os, sys, shutil, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T
from ph_iso import feats, fr2s, SR
from ph_iso50 import fade, level, load, act_rms
from ph_fix56 import trim
from ph_fix58 import voiced
from ph_fix60 import formants
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
LI = os.path.join(ROOT, 'listen', '2026-11-18_P61'); OLD = os.path.join(LI, 'v60'); os.makedirs(OLD, exist_ok=True)
P60 = os.path.join(ROOT, 'listen', '2026-11-18_P60')
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(OLD, c + '.mp3')
    if os.path.exists(f) and not os.path.exists(d): shutil.copy(f, d)
def put(name, y, tgt, to_site=False):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(LI, name + '.mp3'))
    if to_site: shutil.copy(os.path.join(LI, name + '.mp3'), os.path.join(AU, to_site + '.mp3'))
    return round(len(y) / SR, 3)
def steady(y, dur):
    """有 聲音 的 那 一段 裡，找 F1／F2 變化 最 小 的 dur 秒（不要 開頭、結尾 滑音）"""
    F, pk, vo = voiced(y)
    if len(vo) < 6: return y
    a, b = fr2s(vo[0]), fr2s(vo[-1]); n = int(SR * dur); best = None
    for s in range(a + int(SR * .04), max(a + int(SR * .04) + 1, b - n - int(SR * .04)), int(SR * .01)):
        seg = y[s:s + n]
        if len(seg) < n: break
        f1 = formants(seg[:n // 2]); f2 = formants(seg[n // 2:])
        d = abs(f1[0] - f2[0]) + abs(f1[1] - f2[1])
        if best is None or d < best[0]: best = (d, s)
    s = best[1] if best else a; return y[s:s + n]
def cand(ph, k, sp=0.5):
    out = []
    for i in range(k):
        y = trim(T.hf_raw(ph, 0, (sp + 0.05 * (i % 3)) * T.HFBASE), 0.03)
        if len(y) > SR * .5: out.append(y)
    return out
if __name__ == '__main__' and len(sys.argv) == 1:
    out = {}
    for c in ('s_ao', 's_kw', 's_ech', 's_oo'): keep_old(c)
    tg = lambda c: act_rms(load(os.path.join(OLD, c + '.mp3')))
    # ㄛ
    E = [steady(y, .38) for y in cand('oːːːː', 8)]; Fc = [steady(y, .38) for y in cand('ɔːːːː', 8)]
    e = min(E, key=lambda y: abs(formants(y)[0] - 480) + abs(formants(y)[1] - 800)); f = min(Fc, key=lambda y: abs(formants(y)[0] - 560) + abs(formants(y)[1] - 850))
    out['ao'] = [put('s_ao_E', fade(e, 0.015, 0.04), tg('s_ao'), 's_ao'), formants(e), put('s_ao_F', fade(f, 0.015, 0.04), tg('s_ao')), formants(f)]
    # qu ＝ B 的 k＋吹氣 ＋ 穩定 的 ㄨ
    B = load(os.path.join(P60, 's_kw_B.mp3')); FB, pk, vo = voiced(B); kcut = B[:fr2s(vo[0])] if len(vo) else B[:int(SR * .08)]
    U = min([steady(y, .2) for y in cand('uːːːː', 5)], key=lambda y: formants(y)[1])
    q = np.concatenate([kcut, fade(U, 0.012, 0.035)])
    out['kw'] = put('s_kw_C', fade(q, 0.002, 0.03), tg('s_kw'), 's_kw')
    # 字尾 ch：從 摩擦 聲 開始
    C = load(os.path.join(P60, 's_ech_A.mp3')); FC = feats(C); pkc = FC[:, 0].max()
    on = [i for i in range(len(FC)) if FC[i, 1] > 0.35 and FC[i, 0] > 0.15 * pkc]
    s0 = max(0, fr2s(on[0]) - int(SR * .012)) if on else 0
    out['ech'] = [put('s_ech_B', fade(C[s0:], 0.004, 0.04), tg('s_ech') if os.path.exists(os.path.join(OLD, 's_ech.mp3')) else act_rms(C), 's_ech'), round(s0 / SR, 3)]
    # 短 oo ＝ ㄨㄛ
    O = [steady(y, .36) for y in cand('ʊːːːː', 8)]; o = min(O, key=lambda y: abs(formants(y)[0] - 440) + abs(formants(y)[1] - 1000))
    out['oo'] = [put('s_oo_B', fade(o, 0.015, 0.04), tg('s_oo'), 's_oo'), formants(o)]
    json.dump(out, open(os.path.join(LI, '_out.json'), 'w'), ensure_ascii=False, default=int); print(json.dumps(out, ensure_ascii=False, default=int))

# ── 第二 部分（python3 tools/ph_fix61.py b）：電腦 唸 的 o 量 起來 不 像 ㄛ（F1 680）➜ ㄛ 用 F（ɔ，F1 517 F2 681），另 做 G ＝ P60 的 D（純 o）取 穩定 中間；
#    短 oo ＝ 老師 說 的「ㄨㄛ」＝ 穩定 的 ㄨ 0.11 秒 滑 進 穩定 的 ㄛ 0.25 秒（交叉 淡入）
def part_b():
    out = {}
    tg = lambda c: act_rms(load(os.path.join(OLD, c + '.mp3')))
    shutil.copy(os.path.join(LI, 's_ao_F.mp3'), os.path.join(AU, 's_ao.mp3'))
    D = steady(load(os.path.join(P60, 's_ao_D.mp3')), .34); out['G'] = [put('s_ao_G', fade(D, 0.015, 0.04), tg('s_ao')), formants(D)]
    U = min([steady(y, .2) for y in cand('uːːːː', 5)], key=lambda y: formants(y)[1])[:int(SR * .13)]
    O = steady(load(os.path.join(LI, 's_ao_F.mp3')), .27); x = int(SR * .03); r = np.linspace(0, 1, x)
    w = np.concatenate([U[:-x], U[-x:] * (1 - r) + O[:x] * r, O[x:]])
    out['oo'] = put('s_oo_C', fade(w, 0.015, 0.04), tg('s_oo'), 's_oo')
    return out
if __name__ == '__main__' and len(sys.argv) > 1 and sys.argv[1] == 'b':
    print(json.dumps(part_b(), ensure_ascii=False, default=int))
