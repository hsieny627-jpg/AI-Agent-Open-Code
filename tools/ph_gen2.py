# tools/ph_gen2.py — 2026-11-12 第四十八次：Phonics Master 新 的 聲音（phonics/_codes2.json，node phonics/_codes2_build.js 做 出來 的）
#   r ＝ 音標 直接 送進 HiFi-Captain 女聲（跟 ph_gen.py 一樣，語速 0.8）
#   w ＝ 真的 英文 字：做 完 用 電腦 聽寫（Whisper small.en）聽，聽到 的 字 跟 要 的 字 一樣（或 唸法 一樣 的 同音字：four／for、too／two）才 用；
#       不 一樣 ＝ 換 語速 重做，最多 12 次（老師 2026-11-12：big 聽起來 怪、學生 質疑 公平性 ➜ 第一次 big 就 被 聽成 beg）；12 次 都 不 對 ＝ 記在 _asrbad.json
#   t ＝ 單獨 一個 音：做 完 從 聲音 開始 的 地方 只 留 N 毫秒＋淡出（塞音 只 剩 爆破 那 一下 ＝ 不 帶 ㄜ）
# 用法：TTS_MODELS=<模型> python3 tools/ph_gen2.py <份數 P> <第 K 份> [只做 種類]
import os, sys, json, re, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib, cmudict
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'phonics', 'au')
L = json.load(open(os.path.join(ROOT, 'phonics', '_codes2.json'), encoding='utf8'))
P = int(sys.argv[1]) if len(sys.argv) > 1 else 1; K = int(sys.argv[2]) if len(sys.argv) > 2 else 0; ONLY = sys.argv[3] if len(sys.argv) > 3 else ''
CMU = cmudict.dict()
def prons(w): return {' '.join(re.sub(r'\d', '', x) for x in p) for p in CMU.get(w, [])}
def same(heard, want):
    h = re.sub(r"[^a-z' ]", '', heard.lower()).strip()
    h = asr_lib.NUM.get(h, h) if hasattr(asr_lib, 'NUM') else h
    for k, v in getattr(asr_lib, 'NUM', {}).items():
        if re.sub(r'[^0-9]', '', heard) == k: h = v
    if h == want: return True
    if h.replace(' ', '') == want.replace(' ', ''): return True
    a, b = prons(h), prons(want)
    return bool(a & b)
SPD = [0.8, 0.85, 0.75, 0.9, 0.8, 0.85, 0.7, 0.8, 0.9, 0.85, 0.75, 0.8]
bad, made = {}, 0
for n, (f, ph, kind, want, ms) in enumerate(L):
    if n % P != K or (ONLY and kind != ONLY): continue
    path = os.path.join(OUT, f + '.mp3')
    if kind == 'r':
        if os.path.exists(path): continue
        T.mp3(T.hf_raw(ph, 0, 0.8 * T.HFBASE), 22050, path); made += 1; continue
    if kind == 't':
        y = T.hf_raw(ph, 0, 0.8 * T.HFBASE); a = np.abs(y); pk = float(a.max()); idx = np.where(a > pk * 0.03)[0]
        st = int(idx[0]) if len(idx) else 0; n1 = int(22050 * ms / 1000); y = y[st:st + n1].copy()
        fo = min(len(y), int(22050 * 0.03)); y[-fo:] *= np.linspace(1, 0, fo)
        fi = min(len(y), int(22050 * 0.004)); y[:fi] *= np.linspace(0, 1, fi)
        T.mp3(y, 22050, path); made += 1; continue
    # w
    ok = False; best = None
    for tr, sp in enumerate(SPD):
        y = T.hf_raw(ph, 0, sp * T.HFBASE)
        h = asr_lib.hear(y, 22050)
        if best is None: best = (y, h)
        if same(h, want): ok = True; best = (y, h); break
    if not ok: bad[f] = [want, best[1]]
    T.mp3(best[0], 22050, path); made += 1
json.dump(bad, open(os.path.join(ROOT, 'phonics', '_asrbad_%d.json' % K), 'w', encoding='utf8'), ensure_ascii=False)
print('第', K, '份：做了', made, '個；聽寫 12 次 都 不 對：', len(bad), list(bad.items())[:15])
