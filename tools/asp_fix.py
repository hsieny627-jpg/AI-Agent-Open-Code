# tools/asp_fix.py — 字首 p、t 的 送氣（aspiration）聽得 出來（2026-11-01 第三十八次 第 11-(10)-5 點）
# 老師：四年級 聽辨 字首音，發音 標準 但是 字首 p 聽不出 送氣、t 聽不出 摩擦（吹氣）➜ b／p、d／t 很難 分。
# 量：美式 英文 重音 音節 開頭 的 p、t 是 送氣 塞音，VOT（爆破 到 聲帶 開始 震動）大約 50～90 毫秒；b、d 大約 0～20 毫秒
#     （Lisker & Abramson 1964, Word 20(3):384–422；這一次 沒有 打開 原文 核對 數字）。
#     我們 的 語音檔（HiFi-Captain 男聲 放慢）量 出來 的 p、t VOT 很多 只有 20～45 毫秒，而且 吹氣 很 小聲 ➜ 聽起來 像 b、d。
# 做法（只 動 開頭 那一小段，後面 的 聲音 一個 樣本 都 不 改）：
#   ① 找 爆破 開始（第一個 超過 最大 音量 3% 的 地方）② 找 聲帶 開始 震動（5 毫秒 一格：低頻 能量 變大、過零率 變低）
#   ③ 中間 ＝ 送氣 段：不到 80 毫秒 ＝ 把 這一段 的 吹氣 聲 重複 接長 到 80 毫秒（交叉 淡入淡出，不會 有 爆音）④ 吹氣 聲 放大 1.8 倍（最多 到 母音 音量 的 35%）
# 用法：python3 tools/asp_fix.py midterm/audio/m1 midterm/audio/m2 ...（只 改 key 開頭 是 p／t、不是 th 的；做過 的 記 在 _asp.json，不 重做）
import sys, os, re, json, subprocess, numpy as np, lameenc
SR = 22050
def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()
def save(y, f):
    e = lameenc.Encoder(); e.set_bit_rate(64); e.set_in_sample_rate(SR); e.set_channels(1); e.set_quality(2)
    pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes(); open(f, 'wb').write(e.encode(pcm) + e.flush())
def frames(y, n):
    k = len(y) // n; return y[:k * n].reshape(k, n)
def voiced(w):
    """這 10 毫秒 有沒有 聲帶 震動：自相關 在 80～400 Hz 的 地方 有 明顯 的 峰"""
    w = w - w.mean(); e = np.dot(w, w)
    if e < 1e-7: return False
    lo, hi = SR // 400, SR // 80; c = [np.dot(w[:-L], w[L:]) / e for L in range(lo, min(hi, len(w) - 1))]
    return max(c) > .45 if c else False
def measure(y):
    mx = np.max(np.abs(y)) or 1; on = int(np.argmax(np.abs(y) > .03 * mx)); W = 441; H = 110   # 20 毫秒 窗、5 毫秒 一步
    vo = on
    for st in range(on, min(len(y) - W, on + SR // 3), H):
        w = y[st:st + W]
        if np.sqrt(np.mean(w ** 2)) > .08 * mx and voiced(w): vo = st; break
    return on, vo, mx
def fix(y, target=.08, gain=1.8):
    on, vo, mx = measure(y); vot = (vo - on) / SR
    if vo <= on: return y, vot, vot
    asp = y[on:vo].copy(); vow = np.sqrt(np.mean(y[vo:vo + SR // 10] ** 2)) or 1
    a_rms = np.sqrt(np.mean(asp ** 2)) or 1e-6; g = min(gain, .35 * vow / a_rms) if a_rms > 0 else 1; g = max(g, 1.0)
    asp = asp * g; need = int(target * SR) - len(asp)
    if need > 0 and len(asp) > 40:
        tail = asp[len(asp) // 3:]; cf = min(60, len(tail) // 3); out = asp.copy()
        while need > 0:
            piece = tail[:min(len(tail), need + cf)].copy()
            r = np.linspace(0, 1, cf); out[-cf:] = out[-cf:] * (1 - r) + piece[:cf] * r; out = np.concatenate([out, piece[cf:]]); need -= len(piece) - cf
        asp = out
    z = np.concatenate([y[:on], asp, y[vo:]]); return z, vot, (vo - on + len(asp) - (vo - on)) / SR
def main():
    for d in sys.argv[1:]:
        aj = os.path.join(d, 'aud.js'); src = open(aj, encoding='utf8').read(); m = re.search(r'=\s*(\{[\s\S]*\});', src); M = json.loads(m.group(1))
        lg = os.path.join(d, '_asp.json'); done = json.load(open(lg)) if os.path.exists(lg) else {}
        rows = []
        for k, v in M.items():
            w = re.sub(r'^m:', '', k)
            if not re.match(r'^[pt]', w) or w.startswith('th') or v[0] in done: continue
            f = os.path.join(d, v[0]); y = load(f); z, a, b = fix(y); save(z, f); v[1] = round(len(z) / SR, 3); done[v[0]] = [w, round(a * 1000), round(b * 1000)]; rows.append((w, round(a * 1000), round(b * 1000)))
        open(aj, 'w', encoding='utf8').write(src[:m.start(1)] + json.dumps(M, ensure_ascii=False, separators=(',', ':')) + src[m.end(1):])
        json.dump(done, open(lg, 'w'), ensure_ascii=False, indent=0)
        for r in rows: print(d, r[0], '送氣', r[1], '➜', r[2], '毫秒')
if __name__ == '__main__': main()
