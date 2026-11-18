# tools/ph_fix60.py — 2026-11-18 第六十次：老師 聽 P59 的 回答
#   K、c ＝ A（網站 已經 是 A，不 動）；字母 i ＝ 老師 錄音（不 動）
#   字尾 d ＝ A，但 再 稍微 大聲 ➜ 網站 的 s_ed ✕ 1.25
#   ball 的 a、or 的 o（s_ao）：P59 新 的（ɑ、ɒ）都 不好，舊 的（v58）勉強 接近，一定 要 是 ㄛ
#     ➜ 網站 先 換 回 舊 的（v58）；另外 做 C ＝ ɔ 挑 最 圓（F2 最 低）、D ＝ 純 的 o（不 滑 到 ʊ），給 老師 選
# 試聽頁 listen/2026-11-18_P60/（網站 原本 的 放 v59/）。用法：TTS_MODELS=/tmp/models python3 tools/ph_fix60.py
import os, sys, shutil, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T
from ph_iso import SR
from ph_iso50 import fade, level, load, act_rms
from ph_fix56 import trim
from ph_fix58 import hear
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
LI = os.path.join(ROOT, 'listen', '2026-11-18_P60'); OLD = os.path.join(LI, 'v59'); os.makedirs(OLD, exist_ok=True)
P59 = os.path.join(ROOT, 'listen', '2026-11-18_P59')
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(OLD, c + '.mp3')
    if os.path.exists(f) and not os.path.exists(d): shutil.copy(f, d)
def put(name, y, tgt, to_site=False):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(LI, name + '.mp3'))
    if to_site: shutil.copy(os.path.join(LI, name + '.mp3'), os.path.join(AU, to_site + '.mp3'))
    return round(len(y) / SR, 3)
def formants(y):
    """中間 一半 的 F1、F2（LPC 12 階，10 kHz 以下）"""
    from scipy.signal import resample_poly, lfilter
    x = resample_poly(y, 10000, SR) if SR != 10000 else y; n = len(x); x = x[n // 4: 3 * n // 4]; x = lfilter([1, -0.63], 1, x) * np.hamming(len(x))
    p = 12; r = np.correlate(x, x, 'full')[len(x) - 1:len(x) + p]; a = np.zeros(p + 1); a[0] = 1; e = r[0]
    for i in range(1, p + 1):
        k = -(r[i] + np.dot(a[1:i], r[i - 1:0:-1])) / e; a[1:i] = a[1:i] + k * a[i - 1:0:-1]; a[i] = k; e *= 1 - k * k
    rt = [z for z in np.roots(a) if np.imag(z) > 0]; f = sorted(np.angle(rt) * 10000 / (2 * np.pi)); bw = [-0.5 * 10000 / np.pi * np.log(abs(z)) for z in rt]
    f = [fr for fr, b in sorted(zip(np.angle(rt) * 10000 / (2 * np.pi), bw)) if fr > 250 and b < 400]
    return (round(f[0]), round(f[1])) if len(f) > 1 else (0, 0)
if __name__ == '__main__' and len(sys.argv) == 1:
    out = {}
    for c in ('s_ed', 's_ao'): keep_old(c)
    tg = lambda c: act_rms(load(os.path.join(OLD, c + '.mp3')))
    out['d'] = put('s_ed_A2', load(os.path.join(OLD, 's_ed.mp3')), tg('s_ed') * 1.25, 's_ed')
    old = load(os.path.join(P59, 'v58', 's_ao.mp3')); out['ao_old'] = [put('s_ao_old', old, tg('s_ao'), 's_ao'), formants(old)]
    def cand(ph, k):
        L = []
        for i in range(k):
            y = trim(T.hf_raw(ph, 0, (0.5 + 0.05 * (i % 3)) * T.HFBASE), 0.03)
            if len(y) > SR * .25: L.append((formants(y), y))
        return L
    C = cand('ɔːːː', 8); D = cand('oːːː', 8)
    c = min(C, key=lambda t: t[0][1] + abs(t[0][0] - 560)); d = min(D, key=lambda t: t[0][1] + abs(t[0][0] - 480))
    out['ao_C'] = [put('s_ao_C', fade(c[1], 0.02, 0.08), tg('s_ao')), c[0], [t[0] for t in C]]
    out['ao_D'] = [put('s_ao_D', fade(d[1], 0.02, 0.08), tg('s_ao')), d[0], [t[0] for t in D]]
    json.dump(out, open(os.path.join(LI, '_out.json'), 'w'), ensure_ascii=False, default=int); print(json.dumps(out, ensure_ascii=False, default=int))

# ── 第二 部分（python3 tools/ph_fix60.py qu）：老師 4-(4) 字首 qu ＝ ㄎㄨ（不是 ㄎㄜ）；字尾 ch ＝ ㄔ（不是 ㄕ）
#   qu（s_kw）A ＝ 真的「kʰuː」的 開頭（ㄎ 吹氣＋ㄨ 圓 嘴），0.24 秒 淡出；B ＝ 真的 queen 的 kw（母音 開始 以前）
#   字尾 ch（新 檔 s_ech，只 給 字尾 用；字首 ch 不 動）＝ 真的「bætʃ」最後 的 tʃ（母音 結束 以後：閉住＋爆開＋摩擦 ＝ ㄔ）
def part2():
    from ph_fix58 import voiced
    from ph_iso import fr2s
    out = {}
    for c in ('s_kw', 's_ch'): keep_old(c)
    tg = lambda c: act_rms(load(os.path.join(OLD, c + '.mp3')))
    A = max([trim(T.hf_raw('kʰuː', 0, 0.8 * T.HFBASE), 0.02) for _ in range(4)], key=len)[:int(SR * .26)]
    def qcut():
        y = T.hf_raw('kʰwiːn', 0, 0.8 * T.HFBASE); F, pk, vo = voiced(y); a = max(0, int(np.argmax(np.abs(y) > 0.03 * np.abs(y).max())) - int(SR * .004))
        # 母音 i 開始 ＝ 聲帶 震動 以後 再 0.06 秒（w 是 有聲 的，留 著）
        e = fr2s(vo[0]) + int(SR * .07) if len(vo) else a + int(SR * .2); return y[a:e]
    B = max([qcut() for _ in range(4)], key=len)
    out['kw'] = [put('s_kw_A', fade(A, 0.004, 0.07), tg('s_kw'), 's_kw'), put('s_kw_B', fade(B, 0.004, 0.05), tg('s_kw'))]
    def ccut():
        y = T.hf_raw('bætʃ', 0, 0.8 * T.HFBASE); F, pk, vo = voiced(y); s = fr2s(vo[-1] + 1) if len(vo) else len(y) // 2; return trim(y[s:], 0.02)
    E = max([ccut() for _ in range(5)], key=len)
    out['ech'] = [put('s_ech_A', fade(E, 0.01, 0.05), tg('s_ch'))]
    shutil.copy(os.path.join(LI, 's_ech_A.mp3'), os.path.join(AU, 's_ech.mp3'))
    return out
if __name__ == '__main__' and len(sys.argv) > 1 and sys.argv[1] == 'qu':
    print(json.dumps(part2(), ensure_ascii=False))
