# tools/aspirate_g3.py — 2026-11-04 第四十四次 第 6-(2) 點（老師：三年級 字首音 字母 書寫 的 p、t 要 唸 清楚 吹氣）
#   做法 ＝ 第三十九次 四年級 的 A 版（tools/bpdt_ab.py 的 aspirate）：g3mid/audio/m1 男聲 慢 的 pig、ten 原封 不動，
#   在 爆破 和 母音 中間 補上 同一個 男聲 的「h」那 一口 氣，送氣 變成 約 95 毫秒（四年級 85；老師 這次 要 更 清楚）。b、d 不 動。
#   電腦 聽寫（Whisper small.en）一定 要 聽成 原來 的 字 才 用（聽 錯 ＝ 降到 85、75 毫秒 再 試）。
# 用法：TTS_MODELS=放模型的資料夾 python3 tools/aspirate_g3.py
import sys, os, json, re, subprocess, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen, asr_lib
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
M1 = os.path.join(ROOT, 'g3mid', 'audio', 'm1')
MAP = json.loads(re.search(r'=(\{.*\});', open(os.path.join(M1, 'aud.js')).read()).group(1))
HW = {'pig': 'hig', 'ten': 'hen'}
def load(f):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', '22050', '-'], capture_output=True).stdout
    return np.frombuffer(b, dtype=np.float32).copy(), 22050
def frames(y, sr, ms=5):
    n = int(sr * ms / 1000); k = len(y) // n; return y[:k * n].reshape(k, n), n
def onset(y, sr):
    f, n = frames(y, sr); en = np.sqrt((f ** 2).mean(1)); zc = (np.abs(np.diff(np.sign(f), axis=1)) > 0).mean(1); pk = en.max()
    b = int(np.argmax(en > pk * 0.01))
    for i in range(b + 1, len(en)):
        if en[i] > pk * 0.12 and zc[i] < 0.12: return b * n, i * n, pk
    return b * n, b * n + int(.03 * sr), pk
def say(w, spd):
    t = tts_gen.hf(1); a = t.generate(w, sid=0, speed=spd * tts_gen.HFBASE); return np.array(a.samples, dtype=np.float32), a.sample_rate
def aspirate(y, sr, w, target):
    b, v, pk = onset(y, sr); cur = (v - b) / sr
    if cur >= target: target = cur
    h, sr2 = say(HW[w], 0.8); hb, hv, _ = onset(h, sr2); seg = h[hb:hv]
    need = max(int(.005 * sr), int((target - cur) * sr))
    while len(seg) < need: seg = np.concatenate([seg, seg[::-1]])
    seg = seg[len(seg) - need:]; rms = np.sqrt((seg ** 2).mean()) or 1e-6; seg = seg / rms * (pk * 0.08)
    xf = min(int(.006 * sr), len(seg) // 3); win = np.ones(len(seg), dtype=np.float32); win[:xf] = np.linspace(0, 1, xf); win[-xf:] = np.linspace(1, .6, xf)
    y = np.concatenate([y[:v], seg * win, y[v:]]); y[b:v + need] *= 1.6   # 爆破＋吹氣 大聲 1.6 倍（老師：要 清楚）
    return np.clip(y, -0.99, 0.99), cur
OUT = os.path.join(ROOT, 'listen', '2026-11-04_C51', 'au'); res = {}
for w in HW:
    src = os.path.join(M1, MAP[w][0]); old = os.path.join(OUT, w + '_old.mp3'); y0, sr = load(old if os.path.exists(old) else src); ok = False   # 重跑 ＝ 從 原本 的 檔 開始
    for tg in [0.095, 0.085, 0.075]:
        y, c0 = aspirate(y0, sr, w, tg); h = asr_lib.hear(y, sr)
        print(w, 'VOT', round(c0 * 1000), '->', round(tg * 1000), 'ms 聽寫:', h)
        if asr_lib.norm(h) == asr_lib.norm(w): ok = True; break
    if not ok: print('❌', w, '聽寫 一直 不對，不 換'); continue
    tts_gen.mp3(y0, sr, os.path.join(OUT, w + '_old.mp3')); tts_gen.mp3(y, sr, os.path.join(OUT, w + '_new.mp3'))
    tts_gen.mp3(y, sr, src); res[w] = [round(c0 * 1000), round(tg * 1000)]
json.dump(res, open(os.path.join(OUT, '_res.json'), 'w'))
print('done', res)
