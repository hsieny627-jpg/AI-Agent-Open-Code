# tools/ph_fix50.py — 2026-11-14 第五十次：老師 點名 的 單字 聲音
#   top：p 結尾 走音 ➜ 第四十八次 的 top（老師 沒 說 走音）＋ 0.05 秒 閉嘴 ＋ 第五十次 新 的 p（爆破＋一點點 吹氣、小聲）
#   kitchen：老師「改成 舊 的」➜ 第四十八次 的 bk_kitchen
#   rabbit：i 要 接近 一ㄜ（ɪ），不是 ㄜ；最後 的 t 不要 ㄜ、太 大聲 ➜ ɹˈæbɪt，挑 i 最 像 ɪ 的（F1 ≈ 450、F2 ≈ 2300），最後 t 只 留 爆破 30 毫秒、小聲
#   strong：o 要 ㄛ（ɔ）➜ 挑 第二 共鳴 最 低 的（ɔ 比 ɑ 圓、F2 低）
#   電腦 聽寫 要 聽 對 才 用
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_fix50.py
import os, sys, shutil, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_iso import feats, fr2s, SR
from ph_fix49 import vowel_f, load
from ph_iso50 import fade, level
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au'); LI = os.path.join(ROOT, 'listen', '2026-11-14_P50')
def save(c, y, tgt=0.08): y = level(y, tgt); T.mp3(y, SR, os.path.join(AU, c + '.mp3'))
def soft_t(y):
    """最後 的 t：找到 母音 結束 以後 的 爆破，只 留 30 毫秒、音量 一半（不 帶 ㄜ）"""
    F = feats(y); pk = F[:, 0].max(); k = len(F) - 1
    while k > 0 and F[k, 0] < 0.02 * pk: k -= 1
    v = np.where((F[:, 3] > 0.6) & (F[:, 0] > 0.2 * pk))[0]; ve = v[-1] if len(v) else k
    tail = F[ve + 2:k + 1, 1]; bi = ve + 2 + int(np.argmax(tail)) if len(tail) else k
    body = y[:fr2s(ve + 2)].copy(); n = int(SR * .02); body[-n:] *= np.linspace(1, 0, n)
    gap = np.zeros(int(SR * .05), np.float32); b = y[fr2s(bi) - int(SR * .004):fr2s(bi) + int(SR * .03)].copy()
    b = fade(b, 0.002, 0.015) * 0.45
    return np.concatenate([body, gap, b])
def pick(name, phs, want, score, post=None, n=30):
    best = None
    for k in range(n):
        ph = phs[k % len(phs)]; sp = [0.8, 0.75, 0.85, 0.7, 0.9][k % 5]
        y = T.hf_raw(ph, 0, sp * T.HFBASE)
        if post: y = post(y)
        if asr_lib.norm(asr_lib.hear(y, SR)) != want: continue
        s = score(y)
        if s is None: continue
        if best is None or s > best[0]: best = (s, y, ph, sp)
    if best is None: print(name, '找 不 到'); return False
    save(name, best[1]); print(name, best[2], best[3], round(best[0], 1)); return True
def ih(y):
    v = vowel_f(y); return None if v is None else -abs(v[0] - 450) - 0.3 * abs(v[1] - 2300)
def oh(y):
    v = vowel_f(y); return None if v is None else -v[1] - 0.5 * abs(v[0] - 650)
if __name__ == '__main__':
    shutil.copy(os.path.join(LI, 'v48_kitchen.mp3'), os.path.join(AU, 'bk_kitchen.mp3')); print('bk_kitchen 用 回 舊 的')
    old = load(os.path.join(LI, 'v48_top.mp3')); F = feats(old); pk = F[:, 0].max(); v = np.where((F[:, 3] > 0.6) & (F[:, 0] > 0.2 * pk))[0]
    k = len(F) - 1
    while k > 0 and F[k, 0] < 0.02 * pk: k -= 1
    body = old[:fr2s(k + 1)].copy()   # 舊 的 top 整個 留著（電腦 聽寫 ＝ top），最後 再 加 一個 清楚 的 p 放開
    p = load(os.path.join(AU, 's_p.mp3')); Fp = feats(p); i = np.where(Fp[:, 0] > 0.05 * Fp[:, 0].max())[0][0]; b = fade(p[fr2s(i):fr2s(i) + int(SR * .06)], 0.002, 0.02)
    best = None
    for g in (0.5, 0.7, 0.9, 1.1, 1.3):
        z = np.concatenate([body, np.zeros(int(SR * .05), np.float32), b * np.abs(body).max() * g / (np.abs(b).max() + 1e-9)])
        ok = sum(asr_lib.norm(asr_lib.hear(z * a, SR)) == 'top' for a in (0.7, 1.0, 1.3))
        if best is None or ok > best[0]: best = (ok, z, g)
    save('t-aa-p', best[1]); print('t-aa-p 舊 的＋新 p', best[2], '聽寫 對', best[0], '/ 3')
    pick('bk_rabbit', ['ɹˈæbɪt.', 'ɹˈæbɪɪt.', 'ɹˈæbˌɪt.'], 'rabbit', ih, soft_t)
    pick('sy_rabbit_1', ['bɪt.', 'bˈɪt.', 'bɪɪt.'], 'bit', ih, soft_t)
    pick('bk_strong', ['stɹˈɔːŋ.', 'stɹˈɔŋ.', 'stɹˈɔːɔŋ.'], 'strong', oh)
