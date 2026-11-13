# tools/ph_fix49.py — 2026-11-13 第四十九次：老師 點名 的 真的 字 重做（電腦 聽寫 聽 對＋量 母音 的 共鳴 位置，挑 最 準 的 一個）
#   big 像 beg、kitchen 的 i 像 一 ＝ 母音 ɪ 不 準：量 第一 共鳴（F1）＋第二 共鳴（F2），挑 最 接近 ɪ（F1 ≈ 450、F2 ≈ 2300 Hz，女聲）的；
#     beg 的 ɛ F1 比較 高（≈ 650），一 的 i F1 比較 低（≈ 320）、F2 比較 高（≈ 2800）。
#   ham：最後 的 m 拉長 一點點（閉嘴 的 嗯嗯 聲 ≧ 0.18 秒）；top：最後 的 p 要 有 爆破（聽得 到 p）
#   pig、cat：老師 說 舊 的 對 ➜ 用 回 舊 的（listen/2026-11-12_P48/old/）
import os, sys, shutil, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_iso import feats, fr2s, stretch, SR
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
def lpc_formants(f):
    f = np.append(f[0], f[1:] - 0.97 * f[:-1]) * np.hamming(len(f)); p = 18
    r = np.correlate(f, f, 'full')[len(f) - 1:len(f) + p]
    if r[0] <= 0: return []
    a = np.zeros(p + 1); a[0] = 1; e = r[0]
    for i in range(1, p + 1):
        k = -(r[i] + np.dot(a[1:i], r[i - 1:0:-1])) / e; a[1:i + 1] += k * a[i - 1::-1][:i]; e *= (1 - k * k)
    rt = [z for z in np.roots(a) if z.imag > 0]
    fs = sorted((np.angle(z) * SR / (2 * np.pi), -np.log(abs(z)) * SR / np.pi) for z in rt)
    return [x for x, bw in fs if x > 200 and bw < 400]
def vowel_f(y):
    F = feats(y); pk = F[:, 0].max(); idx = [i for i in range(len(F)) if F[i, 0] > 0.5 * pk and F[i, 3] > 0.6]
    if len(idx) < 4: return None
    a, b = idx[len(idx) // 3], idx[2 * len(idx) // 3]; f1, f2 = [], []
    for i in range(a, b + 1):
        fm = lpc_formants(y[fr2s(i):fr2s(i) + int(SR * 0.025)])
        if len(fm) >= 2: f1.append(fm[0]); f2.append(fm[1])
    return (float(np.median(f1)), float(np.median(f2))) if f1 else None
def pick(code, phs, want, score, n=40):
    best = None
    for k in range(n):
        ph = phs[k % len(phs)]; sp = [0.8, 0.75, 0.85, 0.7, 0.9][k % 5]
        y = T.hf_raw(ph, 0, sp * T.HFBASE); h = asr_lib.hear(y, SR)
        if asr_lib.norm(h) != want: continue
        s = score(y)
        if s is None: continue
        if best is None or s[0] > best[0]: best = (s[0], y, ph, sp, s[1])
    if best is None: print(code, '找 不 到'); return
    y = best[1]; y = y / np.abs(y).max() * 0.9; T.mp3(y, SR, os.path.join(AU, code + '.mp3')); print(code, best[2], best[3], best[4])
def ih_score(y):
    v = vowel_f(y)
    if v is None: return None
    return (-abs(v[0] - 450) - 0.3 * abs(v[1] - 2300), 'F1 %d F2 %d' % v)
def tail_nasal(y):
    F = feats(y); pk = F[:, 0].max(); i = len(F) - 1
    while i > 0 and F[i, 0] < 0.05 * pk: i -= 1
    e = i
    while i > 0 and F[i, 2] < 0.3 and F[i, 3] > 0.5: i -= 1
    return (e - i) * 0.005
def ham_score(y):
    d = tail_nasal(y); return (-abs(d - 0.2), 'm %.2f 秒' % d)
def release(y):
    F = feats(y); pk = F[:, 0].max(); hi = np.where(F[:, 0] > 0.3 * pk)[0]
    if not len(hi): return None
    after = F[hi[-1]:]; b = float(after[:, 0].max() / pk) if len(after) > 3 and (after[:, 1] > 0.3).any() else 0
    tail = F[hi[-1] + 3:]; b = float((tail[:, 0] * (tail[:, 1] > 0.25)).max() / pk) if len(tail) else 0
    return (b, 'p 爆破 %.2f' % b)
if __name__ == '__main__' and len(sys.argv) == 1:
    old = os.path.join(ROOT, 'listen', '2026-11-12_P48', 'old')
    for c in ('p-ih-g', 'k-ae-t'): shutil.copy(os.path.join(old, c + '.mp3'), os.path.join(AU, c + '.mp3')); print(c, '用 回 舊 的')
    pick('b-ih-g', ['bˈɪɡ.', 'bˈɪɪɡ.', 'bˈɪːɡ.'], 'big', ih_score)
    pick('bk_kitchen', ['kˈɪtʃʌn.', 'kˈɪtʃɪn.', 'kˈɪtʃən.'], 'kitchen', ih_score)
    pick('h-ae-m', ['hˈæmm.', 'hˈæmː.', 'hˈæm.'], 'ham', ham_score)
    pick('t-aa-p', ['tˈɑːpʰ.', 'tˈɑːph.', 'tˈɑːp.'], 'top', release)
# big：VITS 女聲 的 big 一直 被 聽 成 beg／vague（量 了 40 次 都 一樣），老師 說 舊 的 pig 是 對 的 ➜
#   big ＝ 新做 的 b（嗡嗡 聲＋爆破）＋ 舊 pig 的「ɪɡ」（把 p 的 送氣 切掉），接 的 地方 交叉 淡入；電腦 聽寫 要 聽 成 big 才 用
def load(p):
    import subprocess
    return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout, dtype=np.float32).copy()
def make_big():
    from ph_iso import vowel_on, onset
    pig = load(os.path.join(ROOT, 'listen', '2026-11-12_P48', 'old', 'p-ih-g.mp3')); Fp = feats(pig); vp = vowel_on(Fp, 'unv'); rest = pig[fr2s(vp):]
    best = None
    for ph in ['bˈɪɡ.', 'bˈɪ.', 'bɪ', 'bˈæ.', 'bə']:
        for sp in (0.8, 0.7, 0.9):
            y = T.hf_raw(ph, 0, sp * T.HFBASE); F = feats(y); vo = vowel_on(F, 'voi')
            if vo is None: continue
            for extra in (1, 2, 3):
                b = y[fr2s(onset(F)):fr2s(vo + extra)]; xf = int(SR * 0.01)
                if len(b) < xf * 2: continue
                b = b / (np.abs(b).max() + 1e-9) * np.abs(rest).max() * 0.6
                r = np.linspace(0, 1, xf); z = np.concatenate([b[:-xf], b[-xf:] * (1 - r) + rest[:xf] * r, rest[xf:]])
                h = asr_lib.norm(asr_lib.hear(z, SR)); ok = sum(asr_lib.norm(asr_lib.hear(z * g, SR)) == 'big' for g in (0.7, 1.0, 1.3))
                if h == 'big' and (best is None or ok > best[0]): best = (ok, z, ph, sp, extra)
    if best: z = best[1] / np.abs(best[1]).max() * 0.9; T.mp3(z, SR, os.path.join(AU, 'b-ih-g.mp3')); print('b-ih-g 接 好', best[2], best[3], best[4], '聽寫 3 次 對', best[0])
    else: print('b-ih-g 接 不 好')
if __name__ == '__main__' and 'big' in sys.argv: make_big()
# top：最後 的 p 聽 不 到（VITS 的 p 沒有 放開）➜ 字 的 最後 ＋ 0.05 秒 閉嘴 ＋ 新 的 p 爆破（s_p 前 0.07 秒、小聲 一點）；電腦 聽寫 要 聽 成 top
def make_top():
    pp = load(os.path.join(AU, 's_p.mp3')); F = feats(pp); i = np.where(F[:, 0] > 0.05 * F[:, 0].max())[0][0]; burst = pp[fr2s(i):fr2s(i) + int(SR * 0.07)].copy()
    burst[-int(SR * 0.03):] *= np.linspace(1, 0, int(SR * 0.03))
    best = None
    for sp in (0.8, 0.75, 0.85, 0.7):
        y = T.hf_raw('tˈɑːp.', 0, sp * T.HFBASE); Fy = feats(y); k = len(Fy) - 1
        while k > 0 and Fy[k, 0] < 0.05 * Fy[:, 0].max(): k -= 1
        body = y[:fr2s(k + 1)]
        for g in (0.35, 0.5):
            z = np.concatenate([body, np.zeros(int(SR * 0.05), np.float32), burst * np.abs(body).max() * g / (np.abs(burst).max() + 1e-9)])
            ok = sum(asr_lib.norm(asr_lib.hear(z * a, SR)) == 'top' for a in (0.7, 1.0, 1.3))
            if best is None or ok > best[0]: best = (ok, z, sp, g)
    z = best[1] / np.abs(best[1]).max() * 0.9; T.mp3(z, SR, os.path.join(AU, 't-aa-p.mp3')); print('t-aa-p 最後 p 加 爆破', best[2], best[3], '聽寫 3 次 對', best[0])
if __name__ == '__main__' and 'top' in sys.argv: make_top()
# 從 CVC 到 課本（第四十九次 第 6 點）：一個 字母 一個 音 的 時候 要 的 單獨 聲音（s_ao ㄛ、s_ii ㄞ）＋ 每 一個 音節 的 聲音 sy_<字>_<第幾個>
def trim(y):
    F = feats(y); pk = F[:, 0].max(); i = np.where(F[:, 0] > 0.04 * pk)[0]; z = y[fr2s(i[0]):fr2s(i[-1] + 5)].copy()
    n = int(SR * .03); z[-n:] *= np.linspace(1, 0, n); return z
RI = {'B': 'b', 'P': 'p', 'M': 'm', 'F': 'f', 'D': 'd', 'T': 't', 'N': 'n', 'L': 'l', 'K': 'k', 'G': 'ɡ', 'HH': 'h', 'S': 's', 'Z': 'z', 'JH': 'dʒ', 'CH': 'tʃ', 'SH': 'ʃ', 'TH': 'θ', 'DH': 'ð', 'W': 'w', 'R': 'ɹ', 'Y': 'j', 'V': 'v', 'NG': 'ŋ',
      'AE': 'æ', 'EH': 'ɛ', 'IH': 'ɪ', 'AA': 'ɑː', 'AO': 'ɔː', 'AH': 'ʌ', 'AH0': 'ə', 'EY': 'eɪ', 'IY': 'iː', 'IY0': 'i', 'OW': 'oʊ', 'UW': 'uː', 'UH': 'ʊ', 'AW': 'aʊ', 'AY': 'aɪ', 'ER': 'ɜː', 'ER0': 'ɚ'}
def make_book():
    import json, subprocess
    for c, ph in (('s_ao', 'ɔː.'), ('s_ii', 'aɪ.')):
        T.mp3(trim(T.hf_raw(ph, 0, 0.8 * T.HFBASE)) * 0.9, SR, os.path.join(AU, c + '.mp3')); print(c)
    W = json.loads(subprocess.run(['node', '-e', "process.stdout.write(JSON.stringify(require('./phonics/_book.js').W))"], cwd=ROOT, capture_output=True, text=True).stdout)
    for w, x in W.items():
        if 'sy' not in x or '·' not in x['sy']: continue
        G = [t.split(':') for t in x['g'].split(' ')]; S = x['sy'].split('·'); pos = 0; k = 0
        for si, syl in enumerate(S):
            ph = ''; n = 0
            while n < len(syl):
                L, P = G[k]; k += 1; n += len(L)
                if P == '-': continue
                for q in P.split('+'):
                    st = 'ˈ' if q.endswith('1') else ''; b = re.sub(r'[12]', '', q); ph += st + (RI.get(b) or RI[b.rstrip('0')])
            ph = ph.replace('ˈ', '') if 'ˈ' not in ph[:1] and ph.count('ˈ') == 0 else ph
            want = syl.lower() if syl in ('bed', 'room', 'bath') else ''
            best = None
            for sp in (0.8, 0.75, 0.85, 0.7):
                y = T.hf_raw(ph + '.', 0, sp * T.HFBASE)
                if not want: best = y; break
                if asr_lib.norm(asr_lib.hear(y, SR)) == want: best = y; break
                best = best if best is not None else y
            z = trim(best); T.mp3(z / np.abs(z).max() * 0.9, SR, os.path.join(AU, 'sy_%s_%d.mp3' % (w.replace(' ', '_'), si))); print('sy', w, si, syl, ph)
import re
if __name__ == '__main__' and 'book' in sys.argv: make_book()
# fish：最後 的 sh 要 像 ㄕ（嘶聲 慢慢 變大），不 可以 像 ㄔ（先 閉住 再 一下子 衝 出來）➜ 量 母音 後面 那 一段 嘶聲 從 開始 到 80% 要 幾 毫秒，挑 最 慢 的＋聽寫 要 是 fish
def make_fish():
    best = None
    for k in range(24):
        ph = ['fˈɪʃ.', 'fˈɪʃʃ.', 'fˈɪʃː.'][k % 3]; sp = [0.8, 0.75, 0.85, 0.7][k % 4]
        y = T.hf_raw(ph, 0, sp * T.HFBASE)
        if asr_lib.norm(asr_lib.hear(y, SR)) != 'fish': continue
        F = feats(y); pk = F[:, 0].max(); vi = [i for i in range(len(F)) if F[i, 3] > 0.6 and F[i, 0] > 0.3 * pk]
        if not vi: continue
        tail = y[fr2s(vi[-1]):]; r = T.a2_rise(tail, SR)
        gap = float(F[vi[-1]:vi[-1] + 12, 0].min() / pk)   # 母音 和 嘶聲 中間 有沒有「閉住」（ㄔ 會 幾乎 沒 聲音）
        sc = r + gap * 200
        if best is None or sc > best[0]: best = (sc, y, ph, sp, r, gap)
    if best is None: print('fish 找 不 到'); return
    y = best[1] / np.abs(best[1]).max() * 0.9; T.mp3(y, SR, os.path.join(AU, 'bk_fish.mp3')); print('bk_fish', best[2], best[3], '嘶聲 變大 %d 毫秒' % best[4], '中間 %.2f' % best[5])
if __name__ == '__main__' and 'fish' in sys.argv: make_fish()
