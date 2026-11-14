# tools/ph_fix51.py — 2026-11-14 第五十一次：老師 聽 P50 試聽頁 的 回答
#   字首：p、t 發音 錯誤 ➜ 改 用「字 最後 放開 的 p／t」（ʌp.、æt. 最後 的 爆破＋吹氣，後面 本來 就 沒有 母音 ＝ 一定 沒有 ㄜ）
#         w、r 刪 尾音 ㄜ ➜ 只 留 前面、提早 淡出；ng 開頭 對、尾巴 錯 ➜ 只 留 前面 0.28 秒
#   b、g ＝ A 但 刪 尾音 ㄜ（爆破 後 的 帶聲 70 ➜ 20 毫秒、很 快 消失）；d ＝ B（老師 選）
#   字尾 g 發音 錯誤＋有 ㄜ ➜ 跟 字首 新 的 g 同 一個 聲音（老師 第五十次 字尾 m n 也 是 這樣 定）
#   top：p 太 大聲、太 刻意 ➜ 最後 的 p 音量 只 留 0.3（電腦 聽寫 要 是 top）
#   rabbit：尾巴 像 ㄅㄧㄝ ➜ 第二 個 母音 挑「F1 最 穩、不 往 ㄝ 滑」的 ɪ（短）
#   strong：o 要「哦」（ㄛ）➜ ɔ／ɒ 候選 挑 F2 最 低、F1 ≈ 600（最 圓 的 ㄛ）；rm_strong_0（ong）同 一套
#   cl_<字>_<音節>_<幾個>：子音 群 一個 一個 加上去（st、str、gr）＝ 已經 做好 的 字母 聲音 緊緊 接 起來（不 加 母音）
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_fix51.py
import os, sys, shutil, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_iso import feats, fr2s, SR
from ph_fix49 import lpc_formants
from ph_iso50 import fade, level, load, stop_burst
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au'); LI = os.path.join(ROOT, 'listen', '2026-11-14_P51')
P50 = os.path.join(ROOT, 'listen', '2026-11-14_P50')
os.makedirs(os.path.join(LI, 'v50'), exist_ok=True)
def save(c, y, tgt):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(AU, c + '.mp3')); return round(len(y) / SR, 3)
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(LI, 'v50', c + '.mp3')
    if os.path.exists(f) and not os.path.exists(d): shutil.copy(f, d)
def final_release(phs, keep):
    """字 最後 放開 的 爆破：找 最後 一段 安靜（閉住）以後 的 爆破，留 keep 秒"""
    best = None
    for ph in phs:
     for sp in (0.8, 0.7, 0.9):
        y = T.hf_raw(ph, 0, sp * T.HFBASE); F = feats(y); pk = F[:, 0].max(); k = len(F) - 1
        while k > 0 and F[k, 0] < 0.06 * pk: k -= 1
        j = k
        while j > 0 and F[j, 0] > 0.04 * pk: j -= 1          # 往前 找 到 閉住 的 安靜
        if j <= 0: continue
        seg = F[j:k + 1, 0]; bi = j + int(np.argmax(seg))
        z = y[max(0, fr2s(bi) - int(SR * .004)):fr2s(bi) + int(SR * keep)]
        Fz = feats(z)
        if (Fz[:, 3] > 0.65).sum() > 1 or k - j < 3: continue              # 有 聲帶 震動 ＝ 不要
        sc = F[bi, 1]
        if best is None or sc > best[0]: best = (sc, z)
    return fade(best[1], 0.002, 0.04)
def head(c, dur, fo):
    y = load(os.path.join(P50, 'old_s_w.mp3') if c == 'w' else os.path.join(LI, 'v50', 's_' + c + '.mp3'))
    a = np.where(np.abs(y) > 0.02 * np.abs(y).max())[0]; y = y[a[0]:]
    return fade(y[:int(SR * dur)], 0.015, fo)
def vowel_runs(y):
    F = feats(y); pk = F[:, 0].max(); v = (F[:, 0] > 0.25 * pk) & (F[:, 3] > 0.6); runs = []; i = 0
    while i < len(v):
        if v[i]:
            j = i
            while j < len(v) and v[j]: j += 1
            if j - i >= 3: runs.append((i, j))
            i = j
        else: i += 1
    return runs
def fm(y, a, b):
    f1, f2 = [], []
    for i in range(a, b):
        r = lpc_formants(y[fr2s(i):fr2s(i) + int(SR * 0.025)])
        if len(r) >= 2: f1.append(r[0]); f2.append(r[1])
    return f1, f2
def rab_score(y):
    r = vowel_runs(y)
    if len(r) < 2: return None
    a, b = r[-1]; f1, f2 = fm(y, a, b)
    if len(f1) < 3: return None
    n = len(f1) // 2; drift = abs(np.median(f1[n:]) - np.median(f1[:n]))
    return -(abs(np.median(f1) - 420) + 1.5 * drift + 0.3 * abs(np.median(f2) - 2100))
def ih1_score(y):
    r = vowel_runs(y)
    if not r: return None
    a, b = max(r, key=lambda x: x[1] - x[0]); f1, f2 = fm(y, a, b)
    if len(f1) < 3: return None
    n = len(f1) // 2; drift = abs(np.median(f1[n:]) - np.median(f1[:n]))
    return -(abs(np.median(f1) - 420) + 1.5 * drift + 0.3 * abs(np.median(f2) - 2100))
def oh_score(y):
    r = vowel_runs(y)
    if not r: return None
    a, b = max(r, key=lambda x: x[1] - x[0]); m = (b - a) // 4; f1, f2 = fm(y, a + m, b - m)
    if len(f1) < 2: return None
    return -np.median(f2) - 0.6 * abs(np.median(f1) - 600)
def pick(name, phs, want, score, post=None, n=30, tgt=0.08):
    best = None
    for k in range(n):
        ph = phs[k % len(phs)]; sp = [0.8, 0.75, 0.85, 0.7, 0.9][k % 5]
        y = T.hf_raw(ph, 0, sp * T.HFBASE)
        if post: y = post(y)
        if want and asr_lib.norm(asr_lib.hear(y, SR)) != want: continue
        s = score(y)
        if s is None: continue
        if best is None or s > best[0]: best = (s, y, ph, sp)
    if best is None: print(name, '找 不 到'); return None
    save(name, best[1], tgt); print(name, best[2], best[3], round(float(best[0]), 1)); return best[1]
if __name__ == '__main__':
    for c in ('s_p', 's_t', 's_w', 's_ng', 's_r', 's_b', 's_d', 's_g', 's_eg', 't-aa-p', 'bk_rabbit', 'sy_rabbit_1', 'bk_strong', 'rm_strong_0'): keep_old(c)
    out = {}
    out['p'] = save('s_p', final_release(['æp.', 'ɛp.', 'ɪp.', 'ʌp.'], 0.07), 0.06)
    out['t'] = save('s_t', final_release(['ʌt.', 'æt.', 'ɪt.'], 0.06), 0.06)
    out['w'] = save('s_w', head('w', 0.13, 0.06), 0.065)
    out['r'] = save('s_r', head('r', 0.2, 0.08), 0.065)
    out['ng'] = save('s_ng', head('ng', 0.28, 0.1), 0.065)
    for c in 'bg': out[c] = save('s_' + c, stop_burst(c, 0.012, voiced_tail=0.02, decay=0.008), 0.075)
    shutil.copy(os.path.join(P50, 's_d_B.mp3'), os.path.join(AU, 's_d.mp3')); out['d'] = 'B'
    shutil.copy(os.path.join(AU, 's_g.mp3'), os.path.join(AU, 's_eg.mp3')); out['eg'] = '＝ s_g'
    print(out)
    # top：舊 的 top 身體＋小聲 的 p
    old = load(os.path.join(P50, 'v48_top.mp3')); F = feats(old); pk = F[:, 0].max(); k = len(F) - 1
    while k > 0 and F[k, 0] < 0.02 * pk: k -= 1
    body = old[:fr2s(k + 1)].copy(); p = load(os.path.join(AU, 's_p.mp3'))
    best = None
    for g in (0.25, 0.3, 0.35, 0.4):
        z = np.concatenate([body, np.zeros(int(SR * .05), np.float32), p * np.abs(body).max() * g / (np.abs(p).max() + 1e-9)])
        ok = sum(asr_lib.norm(asr_lib.hear(z * a, SR)) == 'top' for a in (0.7, 1.0, 1.3))
        if best is None or ok > best[0] or (ok == best[0] and g < best[2]): best = (ok, z, g)
    T.mp3(level(best[1], 0.08), SR, os.path.join(AU, 't-aa-p.mp3')); print('top p 音量', best[2], '聽寫 對', best[0], '/ 3')
    from ph_fix50 import soft_t
    pick('bk_rabbit', ['ɹˈæbɪt.', 'ɹˈæbˌɪt.', 'ɹˈæbɪt'], 'rabbit', rab_score, soft_t, n=40)
    pick('sy_rabbit_1', ['bɪt.', 'bˈɪt.'], 'bit', ih1_score, soft_t)
    pick('bk_strong', ['stɹˈɔːŋ.', 'stɹˈɒːŋ.', 'stɹˈɔŋ.', 'stɹˈɒŋ.'], 'strong', oh_score, n=40)
    pick('rm_strong_0', ['ˈɔːŋ.', 'ˈɒːŋ.', 'ˈɔŋ.'], None, oh_score, n=20)
    # 子音 群：字母 聲音 緊緊 接 起來
    def cl(name, letters):
        parts = []
        for c in letters:
            y = load(os.path.join(AU, 's_' + c + '.mp3')); a = np.where(np.abs(y) > 0.02 * np.abs(y).max())[0]; y = y[a[0]:a[-1] + 1]
            y = y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.05; parts.append(fade(y, 0.004, 0.01))
        z = np.concatenate([np.concatenate([q, np.zeros(int(SR * 0.012), np.float32)]) for q in parts])
        return save(name, z, 0.065)
    print('cl', cl('cl_strong_0_2', ['s', 't']), cl('cl_strong_0_3', ['s', 't', 'r']), cl('cl_angry_1_2', ['g', 'r']))
