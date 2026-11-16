# tools/ph_fix56.py — 2026-11-16 第五十六次：老師 聽 P55 的 回答（第 4 點）
#   字尾 b ＝ A（網站 已經 是 A，不動）；字尾 d ＝ C 但 要 更 柔和；字尾 k ＝ A 但 刪 一開始 的「ㄜ」；
#   字尾 m n ＝ 輕聲（不是 三聲）；str、gr ＝ 舊 的（v53）但 刪 尾音 ㄜ；kitchen 新 的 很 棒（不動）。
#   ⚠ 字母 a 的 聲音 必須 是「ㄝㄚ」（/æ/：嘴巴 比 ㄚ 扁、比 ㄝ 開）；字首 K 必須 是「ㄎ」（現在 像 大聲 的 ㄏ ＝ 吹氣 太 長 太 大聲、爆破 不 清楚）。
#   每 一個 做 A／B（／C）給 老師 選，網站 先 用 A；舊 的 放 v55/。試聽頁 listen/2026-11-16_P56/
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_fix56.py
import os, sys, shutil, json, numpy as np, pyworld as pw
from scipy.signal import butter, sosfilt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_iso import feats, fr2s, SR
from ph_iso50 import fade, level, load, act_rms, lpc
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
P55 = os.path.join(ROOT, 'listen', '2026-11-15_P55'); V53 = os.path.join(P55, 'v53')
LI = os.path.join(ROOT, 'listen', '2026-11-16_P56'); OLD = os.path.join(LI, 'v55'); os.makedirs(OLD, exist_ok=True)
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(OLD, c + '.mp3')
    if os.path.exists(f) and not os.path.exists(d): shutil.copy(f, d)
def put(name, y, tgt, to_site=False):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(LI, name + '.mp3'))
    if to_site: shutil.copy(os.path.join(LI, name + '.mp3'), os.path.join(AU, to_site + '.mp3'))
    return round(len(y) / SR, 3)
def lp(y, hz): return sosfilt(butter(4, hz, 'low', fs=SR, output='sos'), y).astype(np.float32)
def hp(y, hz): return sosfilt(butter(2, hz, 'high', fs=SR, output='sos'), y).astype(np.float32)
def trim(y, thr=0.03):
    a = np.where(np.abs(y) > thr * np.abs(y).max())[0]; return y[a[0]:a[-1] + 1]
def formants(y):
    """母音 中間 的 F1、F2（Praat Burg，女聲 上限 5500 Hz）"""
    import parselmouth
    snd = parselmouth.Sound(y.astype(np.float64), SR); fm = snd.to_formant_burg(maximum_formant=5500)
    t = snd.duration / 2; return (round(fm.get_value_at_time(1, t) or 0), round(fm.get_value_at_time(2, t) or 0))
def steady(y, dur):
    """拉長 母音 但 嘴型 不 跑掉：只 用 中間 最 穩 的 那 一段 的 聲音 顏色，一直 重複（pyworld），音高 微微 往 下（第五十六次：舊 的 a 拉長 以後 F2 掉 到 ㄚ）"""
    y = y.astype(np.float64); f0, t = pw.harvest(y, SR, f0_floor=120, f0_ceil=400); sp = pw.cheaptrick(y, f0, t, SR); ap = pw.d4c(y, f0, t, SR)
    v = np.where(f0 > 0)[0]; a, b = v[len(v) // 4], v[len(v) * 3 // 4] + 1
    n = int(dur / (t[1] - t[0])); idx = a + (np.arange(n) % max(1, b - a))
    base = np.median(f0[v]); x = np.linspace(0, 1, n)
    z = pw.synthesize(np.ascontiguousarray(base * np.interp(x, [0, 1], [1.0, 0.9])), np.ascontiguousarray(np.repeat(sp[a:b].mean(0, keepdims=True), n, 0)), np.ascontiguousarray(np.repeat(ap[a:b].mean(0, keepdims=True), n, 0)), SR)
    return fade(z.astype(np.float32), 0.03, 0.12)
def vowel_a():
    """a ＝ ㄝㄚ（/æ/）：F1 高（嘴巴 開）＋F2 高（舌頭 往 前 ＝ 不像 ㄚ）。挑 F2 最 高 而且 F1 ≧ 650 的"""
    C = []
    for ph in ('æ', 'æː', 'ˈæ', 'ɛæ', 'æɛ'):
        for sp in (0.75, 0.85, 1.0):
            y = trim(T.hf_raw(ph, 0, sp * T.HFBASE)); f1, f2 = formants(y)
            C.append((-abs(f2 - 1850) if 650 <= f1 <= 950 else -9999, ph, sp, f1, f2, y))
    C.sort(key=lambda c: -c[0]); print('  a 候選', [(c[1], c[2], c[3], c[4]) for c in C[:5]])
    pick = lambda c: steady(c[5], 0.45)
    return pick(C[0]), steady(C[0][5], 0.32), C[0][3:5], C[0][3:5]
def init_k():
    """字首 k ＝ ㄎ：爆破 清楚＋吹氣 短。A ＝ 真的 kæ 的 開頭（爆破 到 母音 開始 以前），吹氣 只 留 45 毫秒；B ＝ 55 毫秒、去掉 4.5 kHz 以上 的 嘶"""
    best = None
    for ph in ('kʰæ', 'kæ', 'kʰɑː', 'kɪ'):
        for sp in (0.8, 0.9):
            y = T.hf_raw(ph, 0, sp * T.HFBASE); F = feats(y); pk = F[:, 0].max()
            on = np.where(F[:, 0] > 0.08 * pk)[0]
            vo = np.where((F[:, 3] > 0.6) & (F[:, 0] > 0.3 * pk))[0]
            if not len(on) or not len(vo) or vo[0] <= on[0]: continue
            b = fr2s(on[0]) - int(SR * 0.004); seg = y[max(0, b):fr2s(vo[0])]
            sc = len(seg)
            if best is None or abs(sc - SR * 0.07) < abs(best[0] - SR * 0.07): best = (sc, seg, ph, sp)
    print('  k 挑', best[2], best[3], round(best[0] / SR, 3)); s = best[1]
    A = fade(s[:int(SR * 0.045)].copy(), 0.002, 0.02); B = lp(fade(s[:int(SR * 0.055)].copy(), 0.002, 0.025), 4500)
    return A, B
def lead_cut(y):
    """刪 開頭 的「ㄜ」：開頭 那 一小段 帶聲（母音 的 尾巴）＋閉住 都 切掉，從 最後 一段 大聲 的（爆破）開始"""
    F = feats(y); pk = F[:, 0].max(); hi = np.where(F[:, 0] > 0.5 * pk)[0]
    st = hi[0]
    for i in range(1, len(hi)):
        if hi[i] - hi[i - 1] > 2: st = hi[i]
    return y[max(0, fr2s(st) - int(SR * 0.006)):]
def light(y, dur=0.3):
    """輕聲：短、音高 微微 往 下、音量 小 一點、慢慢 收"""
    y = y.astype(np.float64)[:int(SR * dur)]
    f0, t = pw.harvest(y, SR, f0_floor=120, f0_ceil=400); sp = pw.cheaptrick(y, f0, t, SR); ap = pw.d4c(y, f0, t, SR)
    base = np.median(f0[f0 > 0]) if (f0 > 0).any() else 200.0; x = np.linspace(0, 1, len(f0))
    z = pw.synthesize(base * np.interp(x, [0, 1], [0.97, 0.86]), sp, ap, SR).astype(np.float32)
    return fade(z, 0.02, 0.16, 1.6)
def r_tail(y, keep):
    """str gr 的 最後 一段 r：從 r 開始（最後 一段 帶聲）只 留 keep 秒，淡出 ＝ 不 拖 成 ㄜ"""
    F = feats(y); pk = F[:, 0].max(); v = np.where((F[:, 3] > 0.5) & (F[:, 0] > 0.1 * pk))[0]
    k = len(v) - 1
    while k > 0 and v[k - 1] == v[k] - 1: k -= 1
    st = fr2s(v[k]); return fade(y[:st + int(SR * keep)].copy(), 0.003, min(keep * 0.7, 0.08), 1.5)
if __name__ == '__main__':
    out = {}
    for c in ('s_ae', 's_k', 's_ed', 's_ek', 's_em', 's_en', 'cl_strong_0_3', 'cl_angry_1_2'): keep_old(c)
    tg = lambda c: act_rms(load(os.path.join(OLD, c + '.mp3')))
    a1, a2, fa, fb = vowel_a(); out['a'] = [put('s_ae_A', a1, tg('s_ae'), 's_ae'), put('s_ae_B', a2, tg('s_ae')), fa, fb, '舊', formants(trim(load(os.path.join(OLD, 's_ae.mp3'))))]
    kA, kB = init_k(); out['k'] = [put('s_k_A', kA, tg('s_k'), 's_k'), put('s_k_B', kB, tg('s_k') * 0.9)]
    dC = load(os.path.join(P55, 's_ed_C.mp3')); dC = trim(dC, 0.02)
    dA = lp(fade(dC, 0.025, 0.04, 1.4), 2800); dB = lp(fade(dC[:int(len(dC) * 0.8)], 0.03, 0.05, 1.6), 2200)
    out['d'] = [put('s_ed_A', dA, tg('s_ed') * 0.75, 's_ed'), put('s_ed_B', dB, tg('s_ed') * 0.6)]
    kE = lead_cut(trim(load(os.path.join(P55, 's_ek_A.mp3')), 0.02))
    out['ek'] = [put('s_ek_A', fade(kE, 0.003, 0.03), tg('s_ek'), 's_ek'), put('s_ek_B', lp(fade(kE, 0.003, 0.03), 4000), tg('s_ek') * 0.85)]
    for c in 'mn':
        y = trim(load(os.path.join(V53, 's_' + c + '.mp3')), 0.02); t0 = act_rms(y)
        out['e' + c] = [put('s_e' + c + '_A', light(y, 0.3), t0 * 0.75, 's_e' + c), put('s_e' + c + '_B', light(y, 0.22), t0 * 0.65)]
    for nm in ('cl_strong_0_3', 'cl_angry_1_2'):
        y = trim(load(os.path.join(V53, nm + '.mp3')), 0.02); t0 = act_rms(y)
        out[nm] = [put(nm + '_A', r_tail(y, 0.11), t0, nm), put(nm + '_B', r_tail(y, 0.16), t0)]
    for nm in ('s_ae_A', 's_ae_B', 's_k_A', 's_k_B'):
        y = load(os.path.join(LI, nm + '.mp3')); out['聽寫 ' + nm] = asr_lib.norm(asr_lib.hear(np.concatenate([y, np.zeros(SR // 4, np.float32)]), SR))
    json.dump(out, open(os.path.join(LI, '_out.json'), 'w'), ensure_ascii=False); print(json.dumps(out, ensure_ascii=False))
