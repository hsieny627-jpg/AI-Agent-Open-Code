# tools/bpdt_ab.py — 2026-11-01 第三十九次（老師 C45 ⑤ 甲）：四年級 字首音 b／p、d／t 的 16 個 字，做 兩種 新 語音 給 老師 試聽
#   A ＝ 網站 現在 的 男聲 檔（midterm/audio/m1，慢 0.72）原封 不動，只 在 p、t 的 爆破 和 母音 中間 加上「吹氣」（送氣），讓 送氣 大約 85 毫秒（b、d 不 動 ＝ 跟 現在 一樣）
#       量 出來：現在 的 pen、pig 幾乎 沒有 吹氣（只 有 約 30 毫秒、沒有 氣 的 雜音）➜ 不能 只 拉長，要 補上 吹氣：
#       吹氣 ＝ 同一個 男聲 唸「h ＋ 後面 一樣」（pen ➜ hen）裡 的 h（h 就是 送氣 的 那 口 氣），接在 爆破 後面、淡入 母音
#   B ＝ 女聲 慢 0.6（每一個 都 要 電腦 聽寫 聽成 原來 的 字 才 用；聽 錯 ＝ 換 0.58／0.62／0.65 再 試）
#   兩種 都 用 電腦 聽寫（Whisper small.en）各 聽 一次，結果 寫在 試聽頁。
# 研究：英文 字首 p、t 的 送氣（VOT）比 b、d 長 很多（Lisker & Abramson 1964，Word 20(3) 384–422，https://doi.org/10.1080/00437956.1964.11659830；這一次 沒有 打開 原文 核對 數字）
# 用法：TTS_MODELS=放模型的資料夾 python3 tools/bpdt_ab.py 輸出資料夾
#   模型：vits-piper-en_US-hfc_male-medium、vits-piper-en_US-hfc_female-medium、sherpa-onnx-whisper-small.en（https://github.com/k2-fsa/sherpa-onnx/releases）
import sys, os, json, re, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen, asr_lib
W = ['bag', 'bell', 'box', 'ball', 'dog', 'doll', 'door', 'desk', 'pen', 'pig', 'panda', 'pot', 'ten', 'tiger', 'tent', 'toy']
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
def say(w, v, spd):
    t = tts_gen.hf(v); a = t.generate(w, sid=0, speed=spd * tts_gen.HFBASE); return np.array(a.samples, dtype=np.float32), a.sample_rate
def frames(y, sr, ms=5):
    n = int(sr * ms / 1000); k = len(y) // n; f = y[:k * n].reshape(k, n); return f, n
def vot(y, sr):
    """回傳 (爆破 開始, 母音 開始) 的 樣本 位置：爆破 ＝ 第一個 夠 大聲 的 地方；母音 ＝ 爆破 之後 第一個「過零率 低、而且 夠 大聲」的 5 毫秒"""
    pk = np.max(np.abs(y)); f, n = frames(y, sr); en = np.sqrt((f ** 2).mean(1)); zc = (np.abs(np.diff(np.sign(f), axis=1)) > 0).mean(1)
    b = int(np.argmax(en > pk * 0.04))
    for i in range(b + 2, len(en)):
        if zc[i] < 0.12 and en[i] > pk * 0.08: return b * n, i * n
    return b * n, b * n + int(.03 * sr)
import subprocess
MAP = json.loads(re.search(r'=(\{.*\});', open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'midterm', 'audio', 'm1', 'aud.js')).read()).group(1))
HW = {'pen': 'hen', 'pig': 'hig', 'panda': 'handa', 'pot': 'hot', 'ten': 'hen', 'tiger': 'hi', 'tent': 'hent', 'toy': 'hoy'}
def load(w):
    f = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'midterm', 'audio', 'm1', MAP[w][0])
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', '22050', '-'], capture_output=True).stdout
    return np.frombuffer(b, dtype=np.float32).copy(), 22050
def onset(y, sr):
    f, n = frames(y, sr); en = np.sqrt((f ** 2).mean(1)); zc = (np.abs(np.diff(np.sign(f), axis=1)) > 0).mean(1); pk = en.max()
    b = int(np.argmax(en > pk * 0.01))
    for i in range(b + 1, len(en)):
        if en[i] > pk * 0.12 and zc[i] < 0.12: return b * n, i * n, pk
    return b * n, b * n + int(.03 * sr), pk
def aspirate(w, target=0.085):
    y, sr = load(w); b, v, pk = onset(y, sr); cur = (v - b) / sr
    if cur >= 0.07: return y, sr, cur, cur   # 已經 有 70 毫秒 以上 ＝ 夠 了，不 動（pot 加 了 反而 聽成 hot）
    h, sr2 = say(HW[w], 1, 0.72); hb, hv, hpk = onset(h, sr2); seg = h[hb:hv]
    need = int((target - cur) * sr)
    while len(seg) < need: seg = np.concatenate([seg, seg[::-1]])
    seg = seg[len(seg) - need:]   # 用 h 的 後段（最 接近 母音 的 那 一口 氣）
    rms = np.sqrt((seg ** 2).mean()) or 1e-6; seg = seg / rms * (pk * 0.07)
    xf = min(int(.006 * sr), len(seg) // 3); win = np.ones(len(seg), dtype=np.float32); win[:xf] = np.linspace(0, 1, xf); win[-xf:] = np.linspace(1, .6, xf)
    return np.concatenate([y[:v], seg * win, y[v:]]), sr, cur, target
def stretch(y, sr, b, v, target=0.085):
    """把 爆破 後 10 毫秒 到 母音 前 的 吹氣 雜音 重複（交叉 淡入淡出），讓 送氣 變成 target 秒"""
    cur = (v - b) / sr
    if cur >= target: return y, cur, cur
    s0 = b + int(.01 * sr); seg = y[s0:v]
    if len(seg) < int(.01 * sr): return y, cur, cur
    need = int((target - cur) * sr); out = []; xf = min(int(.004 * sr), len(seg) // 3)
    while sum(len(o) for o in out) < need: out.append(seg.copy())
    add = np.concatenate(out)[:need]
    win = np.ones(len(add), dtype=np.float32); win[:xf] = np.linspace(0, 1, xf); win[-xf:] = np.linspace(1, 0, xf)
    y2 = np.concatenate([y[:v], add * win * 0.9, y[v:]]); return y2, cur, target
res = {}
ok = asr_lib.available()
for w in W:
    r = {}
    # A：男聲 0.72（跟 網站 現在 的 一樣），p、t 加長 吹氣
    if w[0] in 'pt': y, sr, c0, c1 = aspirate(w); r['votA'] = [round(c0 * 1000), round(c1 * 1000)]
    else: y, sr = load(w)
    y0, _ = load(w); r['asr0'] = asr_lib.hear(y0, sr) if ok else ''
    tts_gen.mp3(y, sr, os.path.join(OUT, w + '_A.mp3')); r['asrA'] = asr_lib.hear(y, sr) if ok else ''
    # B：女聲 慢，聽寫 要 對
    for spd in [0.6, 0.58, 0.62, 0.65, 0.55, 0.7, 0.75, 0.8]:   # 慢 的 先 試；都 聽錯 才 用 快 一點 的
        y, sr = say(w, 0, spd); h = asr_lib.hear(y, sr) if ok else ''
        if not ok or asr_lib.norm(h) == asr_lib.norm(w): break
    tts_gen.mp3(y, sr, os.path.join(OUT, w + '_B.mp3')); r['asrB'] = h; r['spdB'] = spd
    b, v, _ = onset(y, sr); r['votB'] = round((v - b) / sr * 1000)
    for k in ['asr0', 'asrA', 'asrB']: r[k + 'ok'] = asr_lib.norm(r[k]) == asr_lib.norm(w)
    res[w] = r; print(w, r)
json.dump(res, open(os.path.join(OUT, '_res.json'), 'w'), ensure_ascii=False, indent=0)
