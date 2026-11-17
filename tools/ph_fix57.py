# tools/ph_fix57.py — 2026-11-17 第五十七次：老師 聽 P56 的 回答（第 3 點）
#   a ＝ 用 老師 給 的 音檔（ref/audio/老師_a_2025-09-22.mp3：切掉 前後 安靜、淡入 淡出、音量 跟 其他 母音 一樣）
#   字首 K 像 ㄍ ＝ 吹氣 太 短（第五十六次 只 留 45 毫秒）➜ A 75 毫秒、B 95 毫秒（網站 先 用 A）
#   字尾 d：舊 的（v55）有一點 接近、新 的 都 錯 ➜ 網站 用 回 舊 的（A）；另外 做 B（真的 bæd 最後 的 d）、C（字首 d 小聲＋柔和）給 老師 選
#   字尾 k ＝ B；字尾 m ＝ A（不動）；字尾 n ＝ A 但 小聲 ➜ 音量 ✕ 1.4；str ＝ A（不動）；gr ＝ A 再 刪 尾音 ㄜ（r 只 留 0.06 秒）
# 試聽頁 listen/2026-11-17_P57/（舊 的 放 v56/）。用法：TTS_MODELS=/tmp/models python3 tools/ph_fix57.py
import os, sys, shutil, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_iso import feats, fr2s, SR
from ph_iso50 import fade, level, load, act_rms, noise_like
from ph_fix56 import lp, trim, formants, r_tail
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
P56 = os.path.join(ROOT, 'listen', '2026-11-16_P56'); V55 = os.path.join(P56, 'v55'); V53 = os.path.join(ROOT, 'listen', '2026-11-15_P55', 'v53')
LI = os.path.join(ROOT, 'listen', '2026-11-17_P57'); OLD = os.path.join(LI, 'v56'); os.makedirs(OLD, exist_ok=True)
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(OLD, c + '.mp3')
    if os.path.exists(f) and not os.path.exists(d): shutil.copy(f, d)
def put(name, y, tgt, to_site=False):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(LI, name + '.mp3'))
    if to_site: shutil.copy(os.path.join(LI, name + '.mp3'), os.path.join(AU, to_site + '.mp3'))
    return round(len(y) / SR, 3)
def copy_site(src, c):
    shutil.copy(src, os.path.join(AU, c + '.mp3')); shutil.copy(src, os.path.join(LI, c + '_site.mp3'))
if __name__ == '__main__':
    out = {}
    for c in ('s_ae', 's_k', 's_ed', 's_ek', 's_en', 'cl_angry_1_2'): keep_old(c)
    tg = lambda c: act_rms(load(os.path.join(OLD, c + '.mp3')))
    # a ＝ 老師 的 音檔
    ya = load(os.path.join(ROOT, 'ref', 'audio', '老師_a_2025-09-22.mp3')); ya = trim(ya, 0.04)
    out['a'] = [put('s_ae_A', fade(ya, 0.015, 0.12), tg('s_ae'), 's_ae'), '老師 音檔', formants(ya)]
    # K：吹氣 加長
    best = None
    for ph in ('kʰæ', 'kæ', 'kʰɑː'):
        for sp in (0.8, 0.9, 1.0):
            y = T.hf_raw(ph, 0, sp * T.HFBASE); F = feats(y); pk = F[:, 0].max()
            on = np.where(F[:, 0] > 0.08 * pk)[0]; vo = np.where((F[:, 3] > 0.6) & (F[:, 0] > 0.3 * pk))[0]
            if not len(on) or not len(vo) or vo[0] <= on[0]: continue
            s0 = y[max(0, fr2s(on[0]) - int(SR * 0.004)):fr2s(vo[0])]
            if best is None or len(s0) > len(best[0]): best = (s0, ph, sp)
    s0 = best[0]; print('  k 挑', best[1], best[2], round(len(s0) / SR, 3))
    # 電腦 的 kʰ 吹氣 只有 約 44 毫秒（像 ㄍ）➜ 爆破＋原本 吹氣，後面 接 同 一個 顏色 的 吹氣（noise_like，平穩、不 震動），交叉 淡入
    def asp(total):
        b = s0[:int(SR * 0.03)].copy(); col = s0[int(SR * 0.012):].copy(); ext = noise_like(col, total - 0.03 + 0.01, 0.008, 0.035)
        ext = ext * (np.sqrt(np.mean(col ** 2)) / max(1e-6, np.sqrt(np.mean(ext[:int(SR * 0.02)] ** 2))))
        n = int(SR * 0.01); out = np.concatenate([b[:-n], b[-n:] * np.linspace(1, 0, n) + ext[:n] * np.linspace(0, 1, n), ext[n:]])
        return fade(out.astype(np.float32), 0.002, 0.03)
    kA = asp(0.075); kB = asp(0.095)
    out['k'] = [put('s_k_A', kA, tg('s_k'), 's_k'), put('s_k_B', kB, tg('s_k') * 0.92), round(len(s0) / SR, 3)]
    # 字尾 d：A ＝ 舊 的（v55，老師：有一點 接近）、B ＝ 真的 bæd 的 最後、C ＝ 字首 d 小聲 柔和
    shutil.copy(os.path.join(V55, 's_ed.mp3'), os.path.join(LI, 's_ed_A.mp3')); copy_site(os.path.join(V55, 's_ed.mp3'), 's_ed')
    yb = T.hf_raw('bæd', 0, 0.85 * T.HFBASE); F = feats(yb); pk = F[:, 0].max(); v = np.where((F[:, 3] > 0.5) & (F[:, 0] > 0.15 * pk))[0]
    cut = fr2s(v[-1]) if len(v) else int(len(yb) * 0.7); dB = trim(yb[cut:], 0.02)
    dC = lp(load(os.path.join(AU, 's_d.mp3')), 3500)
    out['d'] = ['A 舊', put('s_ed_B', fade(dB, 0.01, 0.04), tg('s_ed')), put('s_ed_C', fade(dC, 0.01, 0.04), tg('s_ed') * 0.8)]
    # 字尾 k ＝ B
    copy_site(os.path.join(P56, 's_ek_B.mp3'), 's_ek'); out['ek'] = 'P56 B'
    # 字尾 n ＝ A 大聲 一點
    yn = load(os.path.join(P56, 's_en_A.mp3')); out['en'] = [put('s_en_A', yn, act_rms(yn) * 1.4, 's_en')]
    # gr ＝ A 再 刪 尾音 ㄜ
    yg = trim(load(os.path.join(V53, 'cl_angry_1_2.mp3')), 0.02); t0 = act_rms(yg)
    out['gr'] = [put('cl_angry_1_2_A', r_tail(yg, 0.06), t0, 'cl_angry_1_2'), put('cl_angry_1_2_B', r_tail(yg, 0.045), t0)]
    json.dump(out, open(os.path.join(LI, '_out.json'), 'w'), ensure_ascii=False); print(json.dumps(out, ensure_ascii=False))
