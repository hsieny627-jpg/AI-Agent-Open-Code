# tools/ph_iso50.py — 2026-11-14 第五十次：老師 聽完 第四十九次 試聽頁 以後 的 修正（單獨 字母 的 聲音）
#   老師：B 像 敲門聲、G 像 射擊聲、P 像 很 大聲 的 ㄏ、T 像 很 大聲 的 ㄊㄜ、J 開頭 有「嗯」、F 太 大聲＋持續 震動、S 結尾 有 ㄉ、
#         L 字首 ＝ ㄌ、字尾 ＝ ㄛ、H 不像 ㄏ／太 大聲／震動、W 舊 的 對 但 太 小聲、Z 結尾 有 s、字尾 M N ＝ 新 的 字首 m n、字尾 G 像「的」、ng 像 ning、r（不在 字尾）＝ ㄖㄨ
#   找到 的 原因：
#     ① 太 大聲：第四十九次 把 子音 的 最 大 音量 放到 0.9，子音 比 母音 大聲 3～7 倍（量：母音 RMS ≈ 0.065、子音 0.18～0.45）
#     ② 持續 震動：f h s 太 短，第四十九次 用「接 一段、再 接 一段」拉長 ＝ 每 一次 接 的 地方 都 有 一點點 重複 ＝ 聽起來 在 震動
#   新 做法：
#     f s sh th h ＝ 量 真的 嘶聲／吹氣 的「聲音 顏色」（LPC 頻譜），用 平穩 的 噪音 照 這個 顏色 做 出來（不 重複、不 震動），淡入 25 毫秒、淡出 90 毫秒
#     p t ＝ 爆破＋一點點 吹氣（p 55、t 45 毫秒），聲帶 開始 震動 以前 一定 切掉
#     b d g ＝ 三種 給 老師 選（試聽頁）：A 爆破＋很短 很 輕 的 帶聲（70 毫秒、很 快 變 小）／B 很短 的 閉嘴 嗡嗡＋爆破＋40 毫秒／C 第四十九次
#     j ＝ 從 爆破 開始（開頭 的「嗯」切掉）；z v ð ＝ 只 留 聲帶 一直 震動 的 那 一段（結尾 變成 s 的 切掉）
#     l ＝ ㄌ（l＋一點點 放開）；字尾 l ＝ s_el（ball 最後 的 l，聽起來 ㄛ）；字尾 g ＝ s_eg（bag 最後 的 g，閉住 再 放開）
#     ng ＝ s_ng（sɑŋ 最後 的 ŋ，前面 沒有 n、i）；r ＝ ㄖㄨ（ɹʊ）；w ＝ 第四十八次 舊 的（放大聲）
#     字尾 m n ＝ 直接 用 字首 的 s_m s_n（老師 指定）
#   最後 全部 s_*.mp3 音量 一致：母音、長音 RMS 0.065；嘶聲 0.05；爆破 0.075（量「有 聲音 的 那 一段」）
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_iso50.py        ➜ phonics/au/s_*.mp3＋listen/2026-11-14_P50/ 的 A／B 候選
import os, sys, glob, json, shutil, subprocess, numpy as np
from scipy.signal import lfilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T
from ph_iso import feats, fr2s, vowel_on, onset, SR, make as make49
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au'); LI = os.path.join(ROOT, 'listen', '2026-11-14_P50')
def load(p):
    return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout, dtype=np.float32).copy()
def fade(y, fi, fo, pw=1.0):
    y = y.copy(); a = min(len(y), int(SR * fi)); b = min(len(y), int(SR * fo))
    if a: y[:a] *= (0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a)))
    if b: y[-b:] *= (0.5 + 0.5 * np.cos(np.linspace(0, np.pi, b))) ** pw
    return y
def act_rms(y):
    w = int(SR * .02); fr = np.array([np.sqrt(np.mean(y[i:i + w] ** 2)) for i in range(0, max(1, len(y) - w), w)])
    a = fr[fr > fr.max() * 0.1]; return float(np.sqrt(np.mean(a ** 2))) if len(a) else 1e-9
def level(y, tgt):
    y = y * (tgt / act_rms(y)); pk = np.abs(y).max()
    return y * (0.9 / pk) if pk > 0.9 else y
def lpc(x, p=18):
    x = np.append(x[0], x[1:] - 0.0 * x[:-1]) * np.hanning(len(x)); r = np.correlate(x, x, 'full')[len(x) - 1:len(x) + p + 1]
    a = np.zeros(p + 1); a[0] = 1; e = r[0] + 1e-12
    for i in range(1, p + 1):
        k = -(r[i] + np.dot(a[1:i], r[i - 1:0:-1])) / e; a[1:i + 1] += k * a[i - 1::-1][:i]; e *= (1 - k * k)
    return a, e
def noise_like(seg, dur, fi=0.025, fo=0.09):
    """真的 嘶聲 的 聲音 顏色 ＋ 平穩 噪音（不 重複 ＝ 不 震動）"""
    m = seg[len(seg) // 4: len(seg) * 3 // 4] if len(seg) > 800 else seg
    a, e = lpc(m.astype(np.float64)); rng = np.random.default_rng(7)
    z = lfilter([1.0], a, rng.standard_normal(int(SR * dur) + 2000))[2000:]
    return fade(z.astype(np.float32), fi, fo)
def unv_seg(code):
    r = make49(code)   # 第四十九次 的 切法（聲帶 震動 以前 的 那 一段）
    return r[1]
def stop_burst(code, keep, voiced_tail=0.0, pre=0.0, decay=0.022):
    """b d g p t：找 爆破，留 pre 秒 嗡嗡＋爆破＋keep 秒；voiced_tail ＝ 爆破 後 再 留 一點點 帶聲、很 快 變 小"""
    ph = {'b': ['bɑː', 'bˈɑː'], 'd': ['dɑː', 'dˈɑː'], 'g': ['ɡɑː', 'ɡˈɑː'], 'p': ['phɑː', 'pʰɑː'], 't': ['thɑː', 'tʰɑː']}[code]
    best = None
    for p in ph:
        for sp in (0.8, 0.7, 0.9):
            y = T.hf_raw(p, 0, sp * T.HFBASE); F = feats(y); vo = vowel_on(F, 'voi')
            if vo is None or vo < 2: continue
            seg = F[:vo + 1, 1]; bi = int(np.argmax(np.diff(np.r_[0, seg])))
            if code in 'pt':   # 不帶聲：爆破 ➜ 聲帶 震動 以前（vowel_on 'unv'）
                vu = vowel_on(F, 'unv') or vo; end = min(fr2s(bi) + int(SR * keep), fr2s(vu) - int(SR * 0.012))
                if end - fr2s(bi) < int(SR * 0.02): continue
                z = y[max(0, fr2s(bi) - int(SR * 0.004)):end]; sc = F[bi, 1]
            else:
                st = max(0, fr2s(bi) - int(SR * pre)); en = fr2s(bi) + int(SR * (keep + voiced_tail)); z = y[st:en].copy()
                if voiced_tail:   # 爆破 以後 的 帶聲 很 快 變 小（不 變成 ㄜ）
                    t0 = fr2s(bi) - st + int(SR * keep); env = np.ones(len(z)); n = len(z) - t0
                    if n > 0: env[t0:] = np.exp(-np.arange(n) / (SR * decay))
                    z = z * env
                sc = F[bi, 1]
            if best is None or sc > best[0]: best = (sc, z)
    return fade(best[1], 0.003 if not pre else 0.012, 0.02)
def coda_of(ph, tail_s, fi=0.05):
    """一個 字 最後 的 那 個 音（字尾 l、g、ŋ）：從 聲音 結束 往前 tail_s 秒"""
    best = None
    for sp in (0.8, 0.7):
        y = T.hf_raw(ph, 0, sp * T.HFBASE); F = feats(y); pk = F[:, 0].max(); k = len(F) - 1
        while k > 0 and F[k, 0] < 0.02 * pk: k -= 1
        e = fr2s(k + 1); z = y[max(0, e - int(SR * tail_s)):e]
        if best is None: best = z
    return fade(best, fi, 0.04)
def nasal_tail(ph):
    """sɑŋ 最後 的 ŋ：從 後面 往前 找「有 聲帶 震動、母音 共鳴 小」的 一段（＝ 只有 ŋ，前面 沒有 n、i）"""
    best = None
    for sp in (0.8, 0.7, 0.6):
        y = T.hf_raw(ph, 0, sp * T.HFBASE); F = feats(y); pk = F[:, 0].max(); k = len(F) - 1
        while k > 0 and F[k, 0] < 0.08 * pk: k -= 1
        e = k; k -= 4   # 最後 幾 格 正在 變 小（聲帶 震動 量 不 到）
        while k > 0 and F[k, 2] < 0.30 and F[k, 3] > 0.5: k -= 1   # ŋ ＝ 母音 共鳴 小（< 30%），往前 找到 母音 為止
        if e - k < 8: continue
        z = y[fr2s(k + 4):fr2s(e + 1)]
        if best is None or len(z) > len(best): best = z
    return best
def voiced_only(z):
    """z v ð：只 留 聲帶 一直 震動 的（結尾 變成 s 的 切掉）"""
    F = feats(z); v = F[:, 3] > 0.45; k = len(F) - 1
    while k > 0 and not v[k]: k -= 1
    return z[:fr2s(k + 1)]
def save(name, y, tgt, dirs=(AU,)):
    y = level(y.astype(np.float32), tgt)
    for d in dirs: os.makedirs(d, exist_ok=True); T.mp3(y, SR, os.path.join(d, name + '.mp3'))
    return round(len(y) / SR, 3)
if __name__ == '__main__':
    out = {}; os.makedirs(LI, exist_ok=True)
    # 嘶聲、吹氣：平穩 噪音（不 震動）
    for c, d in (('f', .36), ('s', .38), ('sh', .38), ('th', .36), ('h', .26)):
        seg = unv_seg(c); out[c] = save('s_' + c, noise_like(seg, d, 0.025, 0.09 if c != 'h' else 0.12), 0.05 if c != 'h' else 0.04)
    # 爆破
    out['p'] = save('s_p', stop_burst('p', 0.055), 0.07); out['t'] = save('s_t', stop_burst('t', 0.045), 0.07)
    for c in 'bdg':
        A = stop_burst(c, 0.012, voiced_tail=0.07, decay=0.022); B = stop_burst(c, 0.04, pre=0.03)
        save('s_' + c + '_A', A, 0.075, (LI,)); save('s_' + c + '_B', B, 0.075, (LI,)); out[c] = save('s_' + c, A, 0.075)
    # j：從 爆破 開始
    y = load(os.path.join(LI, 'v49', 's_j.mp3')); F = feats(y); hi = np.where(F[:, 1] > 0.3)[0]; st = fr2s(hi[0]) if len(hi) else 0
    out['j'] = save('s_j', fade(y[max(0, st - int(SR * .003)):], 0.004, 0.04), 0.06)
    # z v ð：只 留 帶聲 的
    for c in ('z', 'v', 'dh'):
        y = load(os.path.join(LI, 'v49', 's_' + c + '.mp3')); z = voiced_only(y); z = z[:int(SR * .4)]
        out[c] = save('s_' + c, fade(z, 0.02, 0.07), 0.055)
    # l ＝ ㄌ（l＋一點點 放開）；字尾 l ＝ ㄛ
    best = None
    for sp in (0.8, 0.7):
        y = T.hf_raw('llɑː', 0, sp * T.HFBASE); F = feats(y); vo = vowel_on(F, 'voi'); on = onset(F)
        if vo is None: continue
        z = y[fr2s(on):fr2s(vo) + int(SR * 0.035)]
        if best is None or len(z) > len(best): best = z
    out['l'] = save('s_l', fade(best, 0.015, 0.05), 0.065)
    out['el'] = save('s_el', coda_of('bɔːl', 0.24), 0.065)
    # 字尾 g：bag 最後 的 g（閉住 再 放開）
    out['eg'] = save('s_eg', coda_of('bæɡ', 0.11, 0.02), 0.07)
    # ng：只有 ŋ
    z = nasal_tail('sɑːŋŋŋŋ'); out['ng'] = save('s_ng', fade(z[:int(SR * .4)], 0.03, 0.08), 0.065)
    # r ＝ ㄖㄨ
    best = None
    for sp in (0.8, 0.7):
        y = T.hf_raw('ɹʊ', 0, sp * T.HFBASE); F = feats(y); on = onset(F); z = y[fr2s(on):fr2s(on) + int(SR * .3)]
        if best is None: best = z
    out['r'] = save('s_r', fade(best, 0.02, 0.09), 0.065)
    # w：第四十八次 舊 的、放大聲
    out['w'] = save('s_w', load(os.path.join(ROOT, 'listen', '2026-11-14_P50', 'old_s_w.mp3')), 0.065)
    # 字尾 m n ＝ 字首 的 m n（老師 指定）；全部 音量 一致
    for c in ('m', 'n'): y = load(os.path.join(LI, 'v49', 's_' + c + '.mp3')); save('s_' + c, y, 0.065); shutil.copy(os.path.join(AU, 's_' + c + '.mp3'), os.path.join(AU, 's_e' + c + '.mp3'))
    for f in sorted(glob.glob(os.path.join(AU, 's_*.mp3'))):
        c = os.path.basename(f)[2:-4]
        if c in out or c in ('em', 'en', 'm', 'n'): continue
        y = load(f); kind = 0.075 if c in ('k', 'ck', 'ch', 'x') else 0.065; save('s_' + c, y, kind)
    print(json.dumps(out, ensure_ascii=False))
