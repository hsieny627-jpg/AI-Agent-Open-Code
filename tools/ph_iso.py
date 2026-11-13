# tools/ph_iso.py — 2026-11-13 第四十九次：單獨 一個 字母 的 聲音（phonics/au/s_*.mp3）重做
#   老師 2026-11-13：舊／新 的 b g p t j m n f s l h 都 不 對（帶 ㄜ、b 像 m、p 像 b、t 聽不到、h 像 ㄍㄜ）。
#   原因（看 頻譜圖）：① 單獨 送 一個 子音 給 VITS，它 一定 自己 補 一個 母音（ㄜ）在 後面；
#   ② 第四十八次 只 從 聲音 開頭 留 N 毫秒：b 開頭 是「嘴巴 閉著 的 嗡嗡 聲」（像 m）、p 的 送氣 太 短（像 b）、t 留 的 全是 靜音。
#   新 做法：讓 VITS 唸「子音＋ɑ」（子音 多 寫 幾次 ＝ 拉長，例 phhɑː、fffɑː），再 用 聲音 的 特徵 找到 母音 開始 的 那一刻，只 留 前面 的 子音：
#     不帶 聲 的（p t k ch f s sh th h）＝ 留 到 聲帶 開始 震動 以前（送氣、摩擦 都 留著，p ＝ ㄆ 不 再 像 ㄅ）
#     帶 聲 的 長音（m n l z v ð）＝ 留 到 母音 的 共鳴（450～2500 Hz）突然 變 大 以前（ㄜ 完全 不 留）
#     b d g ＝ 跳過 前面 的 嗡嗡 聲，從 爆破 那 一下 開始，只 留 爆破＋40 毫秒（g 50）並且 快速 淡出
#     太 短 的 長音 ＝ 把 中間 穩定 的 那 一段 接 長（stretch），不 加 母音
#     w ＝ 老師：單音 ㄨ（短 的 u）
#   每 一個 音 做 很多 次（不同 寫法 × 語速），挑「子音 最 長、而且 沒有 母音」的 那 一次；做 完 量測（沒有 母音 共鳴）＋畫 頻譜圖 檢查。
# 用法：TTS_MODELS=<模型> python3 tools/ph_iso.py [只做 的 碼…]   ➜ phonics/au/s_<碼>.mp3、phonics/_iso_check.json
import os, sys, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T
SR = 22050; ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); OUT = os.path.join(ROOT, 'phonics', 'au')
HOP = 0.005
def feats(y):
    w = int(SR * 0.025); h = int(SR * HOP); n = max(1, (len(y) - w) // h); fr = np.fft.rfftfreq(w, 1 / SR); win = np.hanning(w); o = []
    for i in range(n):
        f = y[i * h:i * h + w]; sp = np.abs(np.fft.rfft(f * win)) ** 2; tot = sp.sum() + 1e-12
        x = f - f.mean(); ac = np.correlate(x, x, 'full')[w - 1:]; ac = ac / (ac[0] + 1e-12)
        o.append((np.sqrt(np.mean(f ** 2)), sp[fr > 3000].sum() / tot, sp[(fr > 450) & (fr < 2500)].sum() / tot, ac[int(SR / 400):int(SR / 75)].max()))
    return np.array(o)
def fr2s(i): return int(i * HOP * SR)
def vowel_on(F, kind):
    """第 一個「母音」frame：連續 4 格 都 是 母音"""
    pk = F[:, 0].max()
    for i in range(len(F) - 4):
        ok = True
        for j in range(i, i + 4):
            r, hf, mid, v = F[j]
            if kind == 'unv': c = v > 0.55 and r > 0.12 * pk and hf < 0.35
            else: c = mid > 0.40 and r > 0.30 * pk and hf < 0.30
            if not c: ok = False; break
        if ok: return i
    return None
def onset(F):
    pk = F[:, 0].max(); idx = np.where(F[:, 0] > 0.03 * pk)[0]; return int(idx[0]) if len(idx) else 0
def stretch(z, want, voiced=False):
    """太 短 的 長音（f th v m…）：把 中間 穩定 的 那 一段 接 上去（每 一次 接 的 地方 對齊 波形＋交叉 淡入），不 加 任何 母音"""
    if len(z) / SR >= want: return z
    a, b = int(len(z) * 0.3), int(len(z) * 0.7)
    if voiced:   # 帶 聲 的：挑 聲帶 震動 最 穩 的 那 一段 來 接
        F = feats(z); wl = max(6, len(F) // 3); bs, bi = -1, 0
        for i in range(1, max(2, len(F) - wl - 1)):
            v = float(np.mean(F[i:i + wl, 3]))
            if v > bs: bs, bi = v, i
        a, b = fr2s(bi), fr2s(bi + wl)
    mid = z[a:b]
    if len(mid) < int(SR * 0.03): return z
    head, tail = z[:b], z[b:]; xf = int(SR * (0.03 if voiced else 0.012)); out = head.copy(); need = int(SR * want) - len(z)
    while need > 0:
        c = mid.copy(); best, bo = -1e9, 0
        ref = out[-xf:]
        for o in range(0, min(int(SR / 75), len(c) - xf)):
            v = float(np.dot(ref, c[o:o + xf]))
            if v > best: best, bo = v, o
        c = c[bo:]; r = np.linspace(0, 1, xf)
        out = np.concatenate([out[:-xf], out[-xf:] * (1 - r) + c[:xf] * r, c[xf:]]); need -= len(c) - xf
    return np.concatenate([out, tail])
def fade(y, fi=0.004, fo=0.03):
    y = y.copy(); a = min(len(y), int(SR * fi)); b = min(len(y), int(SR * fo))
    if a: y[:a] *= np.linspace(0, 1, a)
    if b: y[-b:] *= np.linspace(1, 0, b) ** 1.5
    return y
# 碼 ➜ (種類, 寫法 候選, 目標 長度 秒)
UNV = {'p': ['phhɑː', 'phhhɑː', 'pʰhɑː'], 't': ['thhɑː', 'thhhɑː', 'tʰhɑː'], 'k': ['khhɑː', 'khhhɑː', 'kʰhɑː'], 'ck': ['khhɑː', 'khhhɑː'],
       'ch': ['tʃʃɑː', 'tʃhɑː', 'tʃʃʃɑː'], 'f': ['ffffɑː', 'fffɑː', 'fːːɑː'], 's': ['ssssɑː', 'sssɑː', 'sːːɑː'], 'sh': ['ʃʃʃʃɑː', 'ʃʃʃɑː', 'ʃːːɑː'],
       'th': ['θθθθɑː', 'θθθɑː', 'θːːɑː'], 'h': ['hhhɑː', 'hhhhɑː', 'hhɑː']}
VOI = {'m': ['mmmmɑː', 'mmmɑː', 'mːːɑː'], 'n': ['nnnnɑː', 'nnnɑː', 'nːːɑː'], 'l': ['llllɑː', 'lllɑː', 'lːːɑː'],
       'z': ['zzzzɑː', 'zzzɑː', 'zːːɑː', 'zzɑː', 'zɑː'], 'v': ['vvvvɑː', 'vvvɑː', 'vːːɑː', 'vvɑː', 'vɑː'], 'dh': ['ðððɑː', 'ððððɑː', 'ðːːɑː'],
       'j': ['dʒʒɑː', 'dʒɑː', 'dʒʒʒɑː'],
       'ng': ['ŋŋŋɑː', 'ŋŋŋŋɑː', 'ŋːːɑː'],
       'em': ['mmmmɑː', 'mmmmmɑː', 'mːːːɑː'], 'en': ['nnnnɑː', 'nnnnnɑː', 'nːːːɑː']}
STOP = {'b': ['bɑː', 'bˈɑː', 'bə'], 'd': ['dɑː', 'dˈɑː', 'də'], 'g': ['ɡɑː', 'ɡˈɑː', 'ɡə']}
WANT = {'p': .14, 't': .14, 'k': .15, 'ck': .15, 'ch': .2, 'h': .2, 'f': .42, 's': .42, 'sh': .42, 'th': .42,
        'm': .42, 'n': .42, 'l': .38, 'z': .42, 'v': .4, 'dh': .38, 'j': .16, 'ng': .42, 'em': .5, 'en': .5}
SPDS = [0.8, 0.7, 0.6, 0.9]
def make(code):
    best = None
    if code in STOP:
        for ph in STOP[code]:
            for sp in SPDS:
                y = T.hf_raw(ph, 0, sp * T.HFBASE); F = feats(y); vo = vowel_on(F, 'voi')
                if vo is None: continue
                # 爆破 ＝ 母音 開始 以前 高頻 突然 變 大 的 那 一格（嗡嗡 聲 只有 低頻）
                seg = F[:vo + 1, 1]; bi = int(np.argmax(np.diff(np.r_[0, seg]))) if vo > 1 else vo
                bi = max(0, bi - 1); keep = 0.04 if code != 'g' else 0.05
                z = y[fr2s(bi):fr2s(bi) + int(SR * keep)]
                sc = F[bi, 1]   # 爆破 愈 清楚 愈 好
                if best is None or sc > best[0]: best = (sc, fade(z, 0.002, 0.028), ph, sp)
        return best
    if code == 'w':
        y = T.hf_raw('uː', 0, 0.8 * T.HFBASE); F = feats(y); on = onset(F); z = y[fr2s(on):fr2s(on) + int(SR * 0.26)]
        return (1, fade(z, 0.02, 0.08), 'uː', 0.8)
    kind = 'unv' if code in UNV else 'voi'; L = UNV.get(code) or VOI[code]
    for ph in L:
        for sp in SPDS:
            y = T.hf_raw(ph, 0, sp * T.HFBASE); F = feats(y); vo = vowel_on(F, kind)
            if vo is None: continue
            on = onset(F); end = vo - (1 if kind == 'unv' else 2)
            if end - on < 4: continue
            z = y[fr2s(on):fr2s(end)]; d = len(z) / SR
            sc = -abs(d - WANT[code]) if d < WANT[code] else 0.001 - (d - WANT[code]) * 0.2
            if code in ('z', 'v', 'dh'):   # 帶 聲 的 摩擦音：聲帶 一定 要 震動（不然 z 像 s，老師 第四十七次 說 過 S Z 太 像）
                vz = float(np.mean(F[on:end, 3] > 0.5)); sc = vz * 2 + min(d, 0.25) * 4
            if best is None or sc > best[0]: best = (sc, z, ph, sp)
    if best is None: return None
    z = best[1]
    if len(z) / SR > WANT[code] + 0.05: z = z[:int(SR * (WANT[code] + 0.05))]
    z = stretch(z, WANT[code], code in ('z', 'v', 'dh', 'm', 'n', 'l', 'em', 'en', 'ng'))
    return (best[0], fade(z, 0.006, 0.05 if kind == 'voi' else 0.03), best[2], best[3])
def check(y, code):
    """量測：切 好 的 聲音 裡 不可以 有 母音（連續 4 格：有 聲帶 震動＋母音 共鳴 大 ＋ 夠 大聲）"""
    F = feats(y)
    if code in ('w',) or len(F) < 5: return True
    pk = F[:, 0].max(); n = 0
    for r, hf, mid, v in F:
        if code in STOP: continue
        voweling = v > 0.55 and mid > 0.45 and hf < 0.25 and r > 0.3 * pk
        if code in UNV: voweling = v > 0.6 and mid > 0.4 and r > 0.3 * pk
        n = n + 1 if voweling else 0
        if n >= 6: return False
    return True
if __name__ == '__main__':
    codes = sys.argv[1:] or (list(UNV) + list(VOI) + list(STOP) + ['w'])
    res = {}
    for c in codes:
        r = make(c)
        if r is None: res[c] = {'ok': False, 'why': '找 不 到'}; print(c, '找不到'); continue
        sc, y, ph, sp = r; y = y / (np.abs(y).max() + 1e-9) * 0.9
        ok = check(y, c); T.mp3(y, SR, os.path.join(OUT, 's_' + c + '.mp3'))
        res[c] = {'ok': ok, 'sec': round(len(y) / SR, 3), 'ph': ph, 'spd': sp}
        print(c, '%.2fs' % (len(y) / SR), ph, sp, '' if ok else '⚠ 還 有 母音')
    p = os.path.join(ROOT, 'phonics', '_iso_check.json'); old = json.load(open(p)) if os.path.exists(p) else {}
    old.update(res); json.dump(old, open(p, 'w'), ensure_ascii=False, indent=0)
