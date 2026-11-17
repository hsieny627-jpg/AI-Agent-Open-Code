# tools/ph_fix58.py — 2026-11-17 第五十八次：老師 聽 P57 的 回答（第 1 點）＋拼音 地圖 的 聲音
#   字首 K、c（同 一個 檔 s_k）：P57 的 A、B 都 像「噴氣 音」＝ 吹氣 是 電腦 接 上去 的 雜音 ➜ 這次 不 加 任何 雜音：
#       A ＝ 真的 key（kʰiː）開頭 的 k（高 母音 前 的 吹氣 本來 就 比較 長，100% 真的 聲音）
#       B ＝ 真的 coo（kʰuː）開頭 的 k（一樣 100% 真的，嘴型 圓 一點）
#       網站 先 用 A
#   gr：P57 A、B 都 像 ㄍ ＝ r 被 切 太 短 ➜ 真的 grip（ɡɹɪ）開頭 的 g＋r 全部 留 到 母音 開始 前（A），B ＝ A 的 r 再 長 一點（輕輕 淡出）
#   字尾 d：老師 選 C（勉強 接近）➜ 網站 先 用 C；另外 D ＝ 真的 red（ɹɛd）最後 的 d（閉住＋輕輕 放開），E ＝ 字首 d 的 爆破 只 留 0.05 秒＋輕 柔
#   有聲 th（s_dh）：老師「完全 不像」➜ A ＝ 真的 this（ðɪs）開頭 的 ð（到 母音 前），B ＝ 拉長 的 ðː（模型 自己 唸 長）
#   blame 像 bleam ➜ 真的 字 blame（blˈeɪm）重 做，電腦 聽寫 ＝ blame 才 用
#   ball 的 a ＝ ㄛ（s_ao）➜ 真的 ball 的 母音 段（ɔ）
# 試聽頁 listen/2026-11-17_P58/（網站 原本 的 放 v57/）。用法：TTS_MODELS=/tmp/models python3 tools/ph_fix58.py
import os, sys, shutil, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_iso import feats, fr2s, SR
from ph_iso50 import fade, level, load, act_rms
from ph_fix56 import lp, trim
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
LI = os.path.join(ROOT, 'listen', '2026-11-17_P58'); OLD = os.path.join(LI, 'v57'); os.makedirs(OLD, exist_ok=True)
P57 = os.path.join(ROOT, 'listen', '2026-11-17_P57')
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(OLD, c + '.mp3')
    if os.path.exists(f) and not os.path.exists(d): shutil.copy(f, d)
def put(name, y, tgt, to_site=False):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(LI, name + '.mp3'))
    if to_site: shutil.copy(os.path.join(LI, name + '.mp3'), os.path.join(AU, to_site + '.mp3'))
    return round(len(y) / SR, 3)
def voiced(y):
    F = feats(y); pk = F[:, 0].max(); return F, pk, np.where((F[:, 3] > 0.6) & (F[:, 0] > 0.25 * pk))[0]
def onset(y, thr=0.06):
    F = feats(y); pk = F[:, 0].max(); on = np.where(F[:, 0] > thr * pk)[0]; return fr2s(on[0]) if len(on) else 0
def hear(y):
    try: return asr_lib.hear(y, SR)
    except Exception as e: return '?' + str(e)[:30]
if __name__ == '__main__':
    out = {}
    for c in ('s_k', 'cl_angry_1_2', 's_ed', 's_dh', 'bl-ai-m', 's_ao'): keep_old(c)
    tg = lambda c: act_rms(load(os.path.join(OLD, c + '.mp3')))
    sp = 0.9 * T.HFBASE
    # ── K／c ──
    def kcut(ph):
        y = T.hf_raw(ph, 0, sp); F, pk, vo = voiced(y); a = max(0, onset(y) - int(SR * 0.004)); return y[a:fr2s(vo[0])] if len(vo) else y[a:a + int(SR * .09)]
    kA = max([kcut('kʰiː') for _ in range(4)], key=len); kB = max([kcut('kʰuː') for _ in range(4)], key=len)   # 真的 key、coo 開頭（高 母音 前 吹氣 自然 比較 長）
    out['k'] = [put('s_k_A', fade(kA, 0.002, 0.025), tg('s_k'), 's_k'), put('s_k_B', fade(kB, 0.002, 0.025), tg('s_k'))]
    # ── gr ──
    def grcut():
        yg = T.hf_raw('ɡɹːɪp', 0, 0.75 * T.HFBASE); F, pk, vo = voiced(yg); g0 = max(0, onset(yg, 0.04) - int(SR * 0.004))
        big = np.where(F[:, 0] > 0.7 * pk)[0]; v1 = fr2s(big[0]) if len(big) else g0 + int(SR * .16); return yg, g0, v1   # 母音 開始 ＝ 第一個 > 0.7 pk 的 框（r 比較 小聲）
    yg, g0, v1 = max([grcut() for _ in range(6)], key=lambda t: t[2] - t[1])   # 挑 g＋r 最 長 的（r 聽得 到）
    grA = yg[g0:v1]; grB = yg[g0:v1 + int(SR * 0.03)]
    out['gr'] = [put('cl_angry_1_2_A', fade(grA, 0.003, 0.04), tg('cl_angry_1_2'), 'cl_angry_1_2'), put('cl_angry_1_2_B', fade(grB, 0.003, 0.06), tg('cl_angry_1_2')), round(len(grA) / SR, 3)]
    # ── 字尾 d ──
    shutil.copy(os.path.join(P57, 's_ed_C.mp3'), os.path.join(LI, 's_ed_C.mp3')); shutil.copy(os.path.join(P57, 's_ed_C.mp3'), os.path.join(AU, 's_ed.mp3'))
    yr = T.hf_raw('ɹɛd', 0, 0.85 * T.HFBASE); F, pk, vo = voiced(yr); cut = fr2s(vo[-1]) if len(vo) else int(len(yr) * .7)
    dD = trim(yr[cut - int(SR * 0.02):], 0.02)
    yd = load(os.path.join(AU, 's_d.mp3')); d0 = onset(yd); dE = lp(yd[max(0, d0 - int(SR * .003)):d0 + int(SR * 0.05)], 3000)
    out['d'] = ['C 網站', put('s_ed_D', fade(dD, 0.01, 0.04), tg('s_ed')), put('s_ed_E', fade(dE, 0.004, 0.03), tg('s_ed') * 0.85)]
    # ── 有聲 th：慢慢 唸、震動 拉長（舊 的 0.47 秒；模型 慢 速 自己 唸 長，不 用 接 雜音）──
    def dhcut(ph, spd):
        y = T.hf_raw(ph, 0, spd * T.HFBASE); F = feats(y); pk = F[:, 0].max(); a = max(0, onset(y, 0.03) - int(SR * 0.003))
        big = np.where(F[:, 0] > 0.6 * pk)[0]; b = fr2s(big[0]) if len(big) else len(y); return y[a:b]
    thA = max([dhcut('ðːːɪs', 0.45) for _ in range(6)], key=len); thB = max([dhcut('ðːːːə', 0.4) for _ in range(6)], key=len)   # 模型 每 次 長短 不一樣 ➜ 挑 最 長 的
    out['dh'] = [put('s_dh_A', fade(thA, 0.02, 0.06), tg('s_dh')), put('s_dh_B', fade(thB, 0.02, 0.06), tg('s_dh'), 's_dh')]
    # ── blame ──
    best = None
    for s in (0.85, 0.9, 0.8, 0.95):
        y = T.hf_raw('blˈeɪm', 0, s * T.HFBASE); h = hear(y)
        if 'blame' in h.lower(): best = (y, s, h); break
        if best is None: best = (y, s, h)
    out['blame'] = [put('bl-ai-m', trim(best[0], 0.02), tg('bl-ai-m'), 'bl-ai-m' if 'blame' in best[2].lower() else False), best[1], best[2]]
    # ── ball 的 a（ɔ）：慢慢 唸 的 ɔː（跟 其他 母音 一樣 約 0.5 秒）──
    yo = trim(T.hf_raw('ɔːː', 0, 0.55 * T.HFBASE), 0.03)
    out['ao'] = [put('s_ao_A', fade(yo, 0.02, 0.08), tg('s_ao'), 's_ao')]
    json.dump(out, open(os.path.join(LI, '_out.json'), 'w'), ensure_ascii=False); print(json.dumps(out, ensure_ascii=False))
