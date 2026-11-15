# tools/ph_fix55.py — 2026-11-15 第五十五次：老師 聽 P53 試聽頁 的 回答（第 4 點）＋第 8 點 kitchen
#   字尾 d（s_ed）：「有一點點 接近，但 太 尖銳、太 突兀、太 刻意」／字尾 b（s_eb）：「不像 B」／字尾 k、ck（s_ek）：「像 大聲 的 ㄏ」
#     ➜ 原因：第五十三次 字尾 ＝ 字首 的 聲音（有 很 強 的 爆破、吹氣，高頻 很 多 ＝ 尖銳）。
#     ➜ 這次 每 一個 做 三種 給 老師 選（A 已經 換 進 網站）：
#        A ＝ 真的 字 最後 的 那 一個 音（bed、web、back 唸 完 的 閉住＋輕輕 放開），放開 那 一下 留 長 一點 ＝ 聽得 清楚；去掉 尖銳 的 高頻；音量 ＝ 字首 的 6 成
#        B ＝ 字首 的 聲音，但 去掉 高頻（不 尖銳）、爆破 以後 只 留 很短（k 的 吹氣 只 留 25 毫秒 ＝ 不像 ㄏ），音量 5 成
#        C ＝ A 和 B 中間：閉嘴 的 嗡嗡（b d）30 毫秒 ＋ 柔和 的 放開
#   字尾 m、n（s_em、s_en）：老師「改成 國語 注音 的 三聲」➜ 用 pyworld 只 改 音高：先 往 下 ➜ 最 低 ➜ 再 往 上 一點（ˇ），長度 0.55 秒
#   str、gr 的 r：「刪 尾音 ㄜ、改成 輕聲 的 入」➜ 新 的 r（ɹʊ 的 前 0.2 秒、淡出、音量 6 成）只 用 在 子音 群（cl_strong_0_3、cl_angry_1_2）；單獨 的 R 不 動
#   第 8 點 kitchen 的 kit、chen 音節 走調 ➜ 原因：以前 音節 是 電腦 一個 一個 單獨 唸（chen 被 唸 成 中文 姓 Chen 的 音調）；
#     ➜ 改 成 從 真的 kitchen 整個 字 切 開（音調 跟 整個 字 一樣）：sy_kitchen_0 ＝ ki（到 tch 開始 以前）、sy_kitchen_1 ＝ tchen；電腦 聽寫 檢查
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_fix55.py
import os, sys, shutil, json, numpy as np, pyworld as pw
from scipy.signal import butter, sosfilt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_iso import feats, fr2s, SR
from ph_iso50 import fade, level, load, stop_burst, act_rms
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
LI = os.path.join(ROOT, 'listen', '2026-11-15_P55'); V53 = os.path.join(LI, 'v53'); os.makedirs(V53, exist_ok=True)
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(V53, c + '.mp3')
    if os.path.exists(f) and not os.path.exists(d): shutil.copy(f, d)
def put(name, y, tgt, to_site=False):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(LI, name + '.mp3'))
    if to_site: shutil.copy(os.path.join(LI, name + '.mp3'), os.path.join(AU, to_site + '.mp3'))
    return round(len(y) / SR, 3)
def lp(y, hz):
    return sosfilt(butter(4, hz, 'low', fs=SR, output='sos'), y).astype(np.float32)
def trim(y, thr=0.03):
    a = np.where(np.abs(y) > thr * np.abs(y).max())[0]; return y[a[0]:a[-1] + 1]
def coda_real(c, rel):
    """真的 字 最後 的 b d k：母音 結束 以後 ＝ 閉住 ➜ 放開（rel ＝ 放開 以後 留 幾 秒）"""
    ph = {'b': ['ɛb.', 'æb.', 'ʌb.'], 'd': ['ɛd.', 'æd.', 'ʌd.'], 'k': ['æk.', 'ɪk.', 'ʌk.']}[c]
    best = None
    for p in ph:
        for sp in (0.8, 0.9):
            y = T.hf_raw(p, 0, sp * T.HFBASE); F = feats(y); pk = F[:, 0].max()
            v = np.where((F[:, 0] > 0.3 * pk) & (F[:, 3] > 0.6))[0]
            if not len(v): continue
            ve = v[-1]; k = len(F) - 1
            while k > ve and F[k, 0] < 0.03 * pk: k -= 1
            if k - ve < 4: continue
            z = y[fr2s(ve + 2):fr2s(k) + int(SR * rel)]
            sc = F[ve + 2:k + 1, 0].max() / pk
            if best is None or sc > best[0]: best = (sc, z)
    return best[1]
def tone3(y, dur=0.55):
    """國語 三聲 ˇ：音高 先 降 ➜ 最 低 ➜ 再 升 一點（只 改 音高，聲音 顏色 不 變）"""
    y = y.astype(np.float64)
    while len(y) < SR * dur:   # 太 短：用 中間 穩定 的 一段 接 長（交叉 淡入 淡出）
        m = y[len(y) // 4: len(y) * 3 // 4]; n = int(SR * 0.03); w = np.linspace(0, 1, n)
        y = np.concatenate([y[:-n], y[-n:] * (1 - w) + m[:n] * w, m[n:]])
    y = y[:int(SR * dur)]
    f0, t = pw.harvest(y, SR, f0_floor=120, f0_ceil=400); sp = pw.cheaptrick(y, f0, t, SR); ap = pw.d4c(y, f0, t, SR)
    base = np.median(f0[f0 > 0]) if (f0 > 0).any() else 200.0; x = np.linspace(0, 1, len(f0))
    curve = np.interp(x, [0, 0.45, 0.7, 1.0], [1.0, 0.8, 0.78, 0.9])   # 半 三聲：降 ➜ 低 ➜ 微微 升
    f1 = base * curve
    z = pw.synthesize(f1, sp, ap, SR).astype(np.float32)
    return fade(z, 0.03, 0.12)
def light_r():
    best = None
    for ph in ('ɹʊ', 'ɹuː', 'ɹʊʊ'):
        for sp in (0.85, 1.0):
            y = trim(T.hf_raw(ph, 0, sp * T.HFBASE))
            z = fade(y[:int(SR * 0.2)].copy(), 0.01, 0.09)
            h = asr_lib.norm(asr_lib.hear(np.concatenate([z, np.zeros(SR // 5, np.float32)]), SR))
            sc = (h[:1] == 'r') + (h[:2] in ('ro', 'ru', 'rw', 'wo'))
            if best is None or sc > best[0]: best = (sc, z, ph, sp, h)
    print('  輕聲 r 挑', best[2], best[3], best[4]); return best[1]
def cl(name, letters, R):
    parts = []
    for c in letters:
        y = R if c == 'r' else trim(load(os.path.join(AU, 's_' + c + '.mp3')), 0.02)
        g = 0.6 if c == 'r' else 1.0
        y = y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.05 * g; parts.append(fade(y, 0.004, 0.01))
    z = np.concatenate([np.concatenate([q, np.zeros(int(SR * 0.012), np.float32)]) for q in parts])
    return put(name, z, 0.065, name)
def kitchen():
    y = trim(load(os.path.join(AU, 'bk_kitchen.mp3')), 0.01); F = feats(y); pk = F[:, 0].max()
    v = np.where((F[:, 0] > 0.25 * pk) & (F[:, 3] > 0.6))[0]
    # 第一個 母音 ＝ 第一段 連續 的 帶聲；它 結束 ＝ tch 的 閉住 開始
    e = v[0]
    while e + 1 < len(F) and F[e + 1, 3] > 0.5 and F[e + 1, 0] > 0.15 * pk: e += 1
    cut = fr2s(e + 1)
    a, b = fade(y[:cut + int(SR * 0.02)], 0.005, 0.04), fade(y[cut:], 0.01, 0.05)
    ha = asr_lib.norm(asr_lib.hear(np.concatenate([a, np.zeros(SR // 4, np.float32)]), SR)); hb = asr_lib.norm(asr_lib.hear(np.concatenate([b, np.zeros(SR // 4, np.float32)]), SR))
    print('  kitchen 切 在', round(cut / SR, 3), '秒；聽寫', ha, '｜', hb)
    return put('sy_kitchen_0', a, 0.08, 'sy_kitchen_0'), put('sy_kitchen_1', b, 0.08, 'sy_kitchen_1'), ha, hb
if __name__ == '__main__':
    out = {}
    for c in ('s_eb', 's_ed', 's_ek', 's_em', 's_en', 'cl_strong_0_3', 'cl_angry_1_2', 'sy_kitchen_0', 'sy_kitchen_1', 's_m', 's_n', 's_b', 's_d', 's_k'): keep_old(c)
    base = {c: act_rms(load(os.path.join(V53, 's_' + c + '.mp3'))) for c in 'bdk'}
    for c in 'bdk':
        A = lp(fade(coda_real(c, 0.07), 0.012, 0.05), 5000)
        Bz = stop_burst(c, 0.03) if c != 'k' else None
        if c == 'k':
            y = trim(load(os.path.join(V53, 's_k.mp3'))); Bz = fade(y[:int(SR * 0.045)], 0.003, 0.025)
        B = lp(fade(Bz, 0.008, 0.02), 4000)
        if c in 'bd':
            Cz = stop_burst(c, 0.035, pre=0.03); C = lp(fade(Cz, 0.015, 0.03), 4500)
        else:
            C = lp(fade(coda_real('k', 0.045), 0.01, 0.03), 4500)
        out['e' + c] = [put('s_e' + c + '_A', A, 0.6 * base[c], 's_e' + c), put('s_e' + c + '_B', B, 0.5 * base[c]), put('s_e' + c + '_C', C, 0.55 * base[c])]
    for c in 'mn':
        y = trim(load(os.path.join(V53, 's_' + c + '.mp3')), 0.02); tg = act_rms(y)
        out['e' + c] = put('s_e' + c, tone3(y), tg, 's_e' + c)
    R = light_r(); put('r_light', R, 0.04)
    out['cl'] = [cl('cl_strong_0_3', ['s', 't', 'r'], R), cl('cl_angry_1_2', ['g', 'r'], R)]
    out['kitchen'] = kitchen()
    print(json.dumps(out, ensure_ascii=False))
