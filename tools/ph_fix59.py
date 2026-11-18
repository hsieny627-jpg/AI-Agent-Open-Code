# tools/ph_fix59.py — 2026-11-18 第五十九次：老師 聽 P58 的 回答
#   K、c（s_k）：B「有一點 接近，ㄎ 要 更 明顯」➜ A ＝ 真的 kʰɑː（ㄎㄚ）開頭 的 k＋吹氣，B ＝ 真的 kʰə 開頭；兩個 都 比 P58 大聲 1.35 倍、吹氣 留 到 母音 開始（網站 用 A）
#   gr ＝ P58 的 B（網站 換 成 B）
#   字尾 d ＝ C，d 要 更 明顯 ➜ A ＝ C 大聲 1.5 倍；B ＝ C＋字首 d 的 爆破 0.06 秒 接 在 後面（網站 用 A）
#   有聲 th ＝ B（P58 已經 是 B，不 動）；blame ＝ 新（P58 已經 換，不 動）
#   ball 的 a、or 的 o（同 一個 檔 s_ao）＝ 嘴巴 張大、接近 ㄛㄚ ➜ A ＝ 真的 ɑː（嘴巴 最 大），B ＝ ɒː（張大＋一點點 圓）（網站 用 A）
#   字母 i（s_ih）＝ 老師 的 錄音 ref/audio/teacher_i.mp3（電腦 聽寫 ＝ /ɪ/），音量 調 成 跟 其他 母音 一樣
# 試聽頁 listen/2026-11-18_P59/（網站 原本 的 放 v58/）。用法：TTS_MODELS=/tmp/models python3 tools/ph_fix59.py
import os, sys, shutil, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T
from ph_iso import feats, fr2s, SR
from ph_iso50 import fade, level, load, act_rms
from ph_fix56 import trim
from ph_fix58 import voiced, onset, hear
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
LI = os.path.join(ROOT, 'listen', '2026-11-18_P59'); OLD = os.path.join(LI, 'v58'); os.makedirs(OLD, exist_ok=True)
P58 = os.path.join(ROOT, 'listen', '2026-11-17_P58')
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(OLD, c + '.mp3')
    if os.path.exists(f) and not os.path.exists(d): shutil.copy(f, d)
def put(name, y, tgt, to_site=False):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(LI, name + '.mp3'))
    if to_site: shutil.copy(os.path.join(LI, name + '.mp3'), os.path.join(AU, to_site + '.mp3'))
    return round(len(y) / SR, 3)
if __name__ == '__main__':
    out = {}
    for c in ('s_k', 'cl_angry_1_2', 's_ed', 's_ao', 's_ih'): keep_old(c)
    tg = lambda c: act_rms(load(os.path.join(OLD, c + '.mp3')))
    sp = 0.85 * T.HFBASE
    def kcut(ph):
        y = T.hf_raw(ph, 0, sp); F, pk, vo = voiced(y); a = max(0, onset(y, 0.03) - int(SR * 0.004))
        return y[a:fr2s(vo[0])] if len(vo) else y[a:a + int(SR * .1)]
    kA = max([kcut('kʰɑː') for _ in range(5)], key=len); kB = max([kcut('kʰə') for _ in range(5)], key=len)
    out['k'] = [put('s_k_A', fade(kA, 0.002, 0.02), tg('s_k') * 1.35, 's_k'), put('s_k_B', fade(kB, 0.002, 0.02), tg('s_k') * 1.35)]
    shutil.copy(os.path.join(P58, 'cl_angry_1_2_B.mp3'), os.path.join(AU, 'cl_angry_1_2.mp3')); shutil.copy(os.path.join(P58, 'cl_angry_1_2_B.mp3'), os.path.join(LI, 'cl_angry_1_2_B.mp3'))
    yc = load(os.path.join(P58, 's_ed_C.mp3')); yd = load(os.path.join(AU, 's_d.mp3')); d0 = onset(yd)
    burst = fade(yd[max(0, d0 - int(SR * .003)):d0 + int(SR * 0.06)], 0.003, 0.03)
    out['d'] = [put('s_ed_A', yc, tg('s_ed') * 1.5, 's_ed'), put('s_ed_B', np.concatenate([yc, np.zeros(int(SR * .03), np.float32), burst]), tg('s_ed') * 1.4)]
    yA = max([trim(T.hf_raw('ɑːːː', 0, 0.55 * T.HFBASE), 0.03) for _ in range(3)], key=len)
    yB = max([trim(T.hf_raw('ɒːːː', 0, 0.55 * T.HFBASE), 0.03) for _ in range(3)], key=len)
    out['ao'] = [put('s_ao_A', fade(yA, 0.02, 0.08), tg('s_ao'), 's_ao'), put('s_ao_B', fade(yB, 0.02, 0.08), tg('s_ao'))]
    yi = trim(load(os.path.join(ROOT, 'ref', 'audio', 'teacher_i.mp3')), 0.02)
    out['ih'] = [put('s_ih_T', fade(yi, 0.01, 0.06), tg('s_ih'), 's_ih'), hear(yi)]
    json.dump(out, open(os.path.join(LI, '_out.json'), 'w'), ensure_ascii=False); print(json.dumps(out, ensure_ascii=False))
