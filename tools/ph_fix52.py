# tools/ph_fix52.py — 2026-11-14 第五十二次：老師 聽 P51 試聽頁 的 回答＋第 1 點（字尾 d 太 大聲、太 刻意、太 突兀）
#   ng：刪除 不相關 的 尾音 ➜ 只 留「鼻音 一直 很 穩」的 那 一段（音量 掉 下去 的 尾巴 全部 切掉）
#   r ：刪除 尾音 ㄜ      ➜ 一樣 只 留 穩定 的 ㄖ（舌頭 捲 起來 不 動 的 那 一段），音色 開始 往 母音 走 以前 就 切掉
#   b、g：完全 錯誤（像 關門 聲）➜ 改 用 老師 已經 接受 的 d 的 做法（B：很短 的 閉嘴 嗡嗡＋爆破＋40 毫秒）；
#         試聽頁 也 放 第五十次 的 A（70 毫秒）給 老師 比較
#   top：尾音 像 兩個 p ➜ 原因：第五十一次 的 top 身體 裡面 本來 就 有 一個 p，又 接 了 一個 p ➜ 身體 切 在 母音 結束、只 留 一個 p
#   cl_：str、gr 的 r 刪 尾音 ㄜ ＝ 用 新 的 s_r 重新 接
#   字尾 塞音（老師 第 1 點＋請 檢查 其他 字尾）：字尾 b d g p t k 以前 用 字首 的 聲音（又 大聲 又 有 爆破）➜
#         新 s_eb s_ed s_eg s_ep s_et s_ek ＝ 真的 字 最後 那 一個 音（æb. æd. … 母音 結束 以後 的 閉住＋輕輕 放開），音量 只有 字首 的 一半、淡入 淡出
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_fix52.py
import os, sys, shutil, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
from ph_iso import feats, fr2s, SR
from ph_iso50 import fade, level, load, stop_burst, act_rms
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
LI = os.path.join(ROOT, 'listen', '2026-11-14_P52'); V51 = os.path.join(LI, 'v51'); P50 = os.path.join(ROOT, 'listen', '2026-11-14_P50')
os.makedirs(V51, exist_ok=True)
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(V51, c + '.mp3')
    if os.path.exists(f) and not os.path.exists(d): shutil.copy(f, d)
def save(c, y, tgt, to=AU):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(to, c + '.mp3')); return round(len(y) / SR, 3)
def steady(y, keep, thr=0.55):
    """穩定 的 那 一段：最 大聲 的 地方 往 兩邊 找，音量 掉 到 thr 以下 就 停；最多 留 keep 秒"""
    F = feats(y); e = F[:, 0]; pk = int(np.argmax(e)); a = pk; b = pk
    while a > 0 and e[a - 1] > thr * e[pk]: a -= 1
    while b < len(e) - 1 and e[b + 1] > thr * e[pk]: b += 1
    n = int(keep / 0.005)
    if b - a > n: a = max(a, (a + b) // 2 - n // 2); b = a + n
    return y[fr2s(a):fr2s(b) + int(SR * 0.025)]
def best_sustain(phs, keep, score):
    best = None
    for ph in phs:
        for sp in (0.7, 0.8, 0.9):
            y = T.hf_raw(ph, 0, sp * T.HFBASE)
            if len(y) < SR * 0.1: continue
            z = steady(y, keep); s = score(z)
            if best is None or s > best[0]: best = (s, z, ph, sp)
    print('  挑', best[2], best[3], round(float(best[0]), 3)); return best[1]
def flat(z):
    """愈 穩 愈 好：每 一格 音量 差 愈 小 分數 愈 高；太 短 扣分"""
    e = feats(z)[:, 0]; return -float(np.std(e) / (np.mean(e) + 1e-9)) + min(len(z) / SR, 0.25)
def coda_stop(c):
    """字尾 塞音：真的 字 最後 的 b d g p t k（母音 結束 ➜ 閉住 ➜ 輕輕 放開）"""
    ph = {'b': ['æb.', 'ɛb.', 'ʌb.'], 'd': ['æd.', 'ɛd.', 'ʌd.'], 'g': ['æɡ.', 'ɪɡ.', 'ʌɡ.'], 'p': ['æp.', 'ɪp.', 'ʌp.'],
          't': ['æt.', 'ɪt.', 'ʌt.'], 'k': ['æk.', 'ɪk.', 'ʌk.']}[c]
    best = None
    for p in ph:
        for sp in (0.8, 0.9):
            y = T.hf_raw(p, 0, sp * T.HFBASE); F = feats(y); pk = F[:, 0].max()
            v = np.where((F[:, 0] > 0.3 * pk) & (F[:, 3] > 0.6))[0]
            if not len(v): continue
            ve = v[-1]                                              # 母音 結束
            k = len(F) - 1
            while k > ve and F[k, 0] < 0.03 * pk: k -= 1             # 最後 有 聲音 的 地方
            if k - ve < 4: continue
            st = fr2s(ve + 2)                                      # 母音 結束 以後 一點點 開始（帶聲 塞音 留 一點 嗡嗡）
            z = y[st:fr2s(k) + int(SR * 0.03)]
            if len(z) < SR * 0.03: continue
            Fz = feats(z); vo = (Fz[:, 3] > 0.65).mean() if len(Fz) else 1
            sc = -abs(vo - (0.45 if c in 'bdg' else 0.0)) + 0.5 * Fz[:, 0].max() / pk   # 帶聲 塞音 要 有 一點 嗡嗡、清 塞音 不要
            if best is None or sc > best[0]: best = (sc, z, p, sp)
    print('  字尾', c, best[2], best[3]); return fade(best[1], 0.012, 0.05)
if __name__ == '__main__':
    out = {}
    for c in ('s_ng', 's_r', 's_b', 's_g', 's_eg', 's_d', 't-aa-p', 'cl_strong_0_2', 'cl_strong_0_3', 'cl_angry_1_2', 's_ck', 's_k', 's_p', 's_t'): keep_old(c)
    print('ng'); out['ng'] = save('s_ng', fade(best_sustain(['ŋː', 'ŋŋ', 'ɑːŋ'], 0.3, flat), 0.03, 0.06), 0.065)
    print('r');  out['r'] = save('s_r', fade(best_sustain(['ɹː', 'ɹɹ'], 0.22, flat), 0.025, 0.05), 0.065)
    # b g ＝ d 的 做法 B（老師 接受 了 d）；A（第五十次 70 毫秒）放 試聽頁 比較
    for c in 'bg':
        out[c] = save('s_' + c, stop_burst(c, 0.04, pre=0.03), 0.075)
        shutil.copy(os.path.join(AU, 's_' + c + '.mp3'), os.path.join(LI, 's_' + c + '_B.mp3'))
        if os.path.exists(os.path.join(P50, 's_' + c + '_A.mp3')): shutil.copy(os.path.join(P50, 's_' + c + '_A.mp3'), os.path.join(LI, 's_' + c + '_A.mp3'))
    # 字尾 塞音：只有 字首 的 一半 大聲
    for c in 'bdgptk': out['e' + c] = save('s_e' + c, coda_stop(c), 0.035)
    # top：身體 切 在 母音 結束（舊 身體 的 p 不要）＋一個 小聲 的 p
    old = load(os.path.join(P50, 'v48_top.mp3')); F = feats(old); pk = F[:, 0].max()
    v = np.where((F[:, 0] > 0.2 * pk) & (F[:, 3] > 0.6))[0]; body = fade(old[:fr2s(v[-1] + 3)], 0, 0.03)
    p = load(os.path.join(AU, 's_ep.mp3')); best = None
    for g in (0.25, 0.35, 0.45, 0.6):
        for gap in (0.05, 0.07):
            z = np.concatenate([body, np.zeros(int(SR * gap), np.float32), p * np.abs(body).max() * g / (np.abs(p).max() + 1e-9)])
            ok = sum(asr_lib.norm(asr_lib.hear(z * a, SR)) == 'top' for a in (0.7, 1.0, 1.3))
            if best is None or ok > best[0] or (ok == best[0] and g < best[2]): best = (ok, z, g, gap)
    T.mp3(level(best[1], 0.08), SR, os.path.join(AU, 't-aa-p.mp3')); out['top'] = '聽寫 %d/3 p 音量 %.2f' % (best[0], best[2])
    # 子音 群 重新 接（新 的 r）
    def cl(name, letters):
        parts = []
        for c in letters:
            y = load(os.path.join(AU, 's_' + c + '.mp3')); a = np.where(np.abs(y) > 0.02 * np.abs(y).max())[0]; y = y[a[0]:a[-1] + 1]
            y = y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.05; parts.append(fade(y, 0.004, 0.01))
        z = np.concatenate([np.concatenate([q, np.zeros(int(SR * 0.012), np.float32)]) for q in parts])
        return save(name, z, 0.065)
    out['cl'] = [cl('cl_strong_0_2', ['s', 't']), cl('cl_strong_0_3', ['s', 't', 'r']), cl('cl_angry_1_2', ['g', 'r'])]
    # 試聽頁 用 的 新 聲音 也 放 一份
    for c in ('s_ng', 's_r', 's_eb', 's_ed', 's_eg', 's_ep', 's_et', 's_ek', 't-aa-p', 'cl_strong_0_3', 'cl_angry_1_2'): shutil.copy(os.path.join(AU, c + '.mp3'), os.path.join(LI, c + '.mp3'))
    print(json.dumps(out, ensure_ascii=False))
