# tools/ph_fix53.py — 2026-11-14 第五十三次：老師 聽 P52 試聽頁 的 回答
#   R：應該 是 ㄖㄨ（接近 中文「入」）➜ 唸「ɹuː」，留 ㄖ＋一小段 圓唇 的 ㄨ（WORDHERO 程式 也 是 r ＝ ㄖ_ㄨ）
#   b、g：老師 選 B ＝ 第五十二次 已經 是 B（不 動）
#   字尾 b d g：新 的 聽不清楚 ➜ 改 用 老師 已經 接受 的 字首 b d g（B 做法：很短 的 閉嘴 嗡嗡＋爆破）＋輕輕 淡入，音量 ＝ 字首 的 7 成
#   字尾 k／ck：新 的 聽起來 像 ㄍ ➜ 改 用 字首 k（有 ㄎ 的 吹氣），音量 ＝ 字首 的 7 成
#   字尾 p t：老師 沒有 說 不對 ➜ 不 動；str、gr：老師 說「r 接近 入」➜ 不 動（問 老師）
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_fix53.py
import os, sys, shutil, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_iso import SR
from ph_iso50 import fade, level, load, act_rms
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
LI = os.path.join(ROOT, 'listen', '2026-11-14_P53'); V52 = os.path.join(LI, 'v52'); os.makedirs(V52, exist_ok=True)
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(V52, c + '.mp3')
    if os.path.exists(f) and not os.path.exists(d): shutil.copy(f, d)
def save(c, y, tgt):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(AU, c + '.mp3')); shutil.copy(os.path.join(AU, c + '.mp3'), os.path.join(LI, c + '.mp3'))
    return round(len(y) / SR, 3), round(float(act_rms(y)), 3)
def trim(y, thr=0.03):
    a = np.where(np.abs(y) > thr * np.abs(y).max())[0]; return y[a[0]:a[-1] + 1]
def ru():
    best = None
    for ph in ('ɹuː', 'ɹˈuː', 'ɹʊ', 'ɹuːuː'):
        for sp in (0.8, 0.9, 1.0):
            y = trim(T.hf_raw(ph, 0, sp * T.HFBASE))
            for keep in (0.24, 0.28, 0.32):
                z = fade(y[:int(SR * keep)].copy(), 0.01, 0.08)
                hits = [asr_lib.norm(asr_lib.hear(z * g, SR)) for g in (0.7, 1.0, 1.3)]
                ok = sum(h in ('ru', 'rue', 'roo', 'rew', 'rule', 'root', 'room', 'ruh', 'rou') or (h.startswith('r') and len(h) <= 4 and 'u' in h or h[:2] in ('ro', 'ru')) for h in hits)
                sc = ok - abs(keep - 0.28)
                if best is None or sc > best[0]: best = (sc, z, ph, sp, keep, hits)
    print('  r 挑', best[2], best[3], best[4], best[5]); return best[1]
if __name__ == '__main__':
    out = {}
    for c in ('s_r', 's_eb', 's_ed', 's_eg', 's_ek', 's_ep', 's_et', 's_b', 's_d', 's_g', 's_k', 'cl_strong_0_3', 'cl_angry_1_2'): keep_old(c)
    out['r'] = save('s_r', ru(), 0.065)
    for c in 'bdgk':
        y = trim(load(os.path.join(AU, 's_' + c + '.mp3')))
        tgt = 0.7 * act_rms(y)
        out['e' + c] = save('s_e' + c, fade(y, 0.008, 0.03), tgt)
    print(json.dumps(out, ensure_ascii=False))
