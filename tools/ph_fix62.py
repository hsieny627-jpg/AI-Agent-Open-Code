# tools/ph_fix62.py — 2026-11-19 第六十二次：老師 聽 P61 的 回答
#   ㄛ（s_ao：ball 的 a、or 的 o）＝ 老師 錄音 ref/audio/teacher_ao.mp3
#   短 oo（s_oo）＝ 老師 錄音 ref/audio/teacher_oo_short.mp3
#   字母 b（s_b）＝ 老師 錄音 ref/audio/teacher_b.mp3
#   qu（s_kw）＝ P61 的 C，刪 尾音 ㄛ（ㄨ 只 留 前面 穩 的 0.11 秒，快 收尾）
#   字尾 ch：OK（不 動）
# 只 切掉 前後 沒 聲音、短 淡入 淡出、音量 調 成 跟 網站 原本 一樣。試聽 listen/2026-11-19_P62/（原本 的 在 v61/）
import os, sys, shutil, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T
from ph_iso import SR
from ph_iso50 import fade, level, load, act_rms
from ph_fix56 import trim
from ph_fix58 import voiced
from ph_iso import fr2s
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
LI = os.path.join(ROOT, 'listen', '2026-11-19_P62'); OLD = os.path.join(LI, 'v61'); os.makedirs(OLD, exist_ok=True)
def keep_old(c):
    f = os.path.join(AU, c + '.mp3'); d = os.path.join(OLD, c + '.mp3')
    if not os.path.exists(d): shutil.copy(f, d)
def put(name, y, tgt, site):
    y = level(y.astype(np.float32), tgt); T.mp3(y, SR, os.path.join(LI, name + '.mp3'))
    shutil.copy(os.path.join(LI, name + '.mp3'), os.path.join(AU, site + '.mp3')); return round(len(y) / SR, 3)
out = {}
for c in ('s_ao', 's_oo', 's_b', 's_kw'): keep_old(c)
tg = lambda c: act_rms(load(os.path.join(OLD, c + '.mp3')))
for c, f, fi, fo in (('s_ao', 'teacher_ao', .012, .05), ('s_oo', 'teacher_oo_short', .012, .05), ('s_b', 'teacher_b', .002, .04)):
    y = trim(load(os.path.join(ROOT, 'ref', 'audio', f + '.mp3')), 0.02)
    out[c] = put(c + '_T', fade(y, fi, fo), tg(c), c)
q = load(os.path.join(OLD, 's_kw.mp3')); F, pk, vo = voiced(q)
v0 = fr2s(vo[0]) if len(vo) else int(SR * .08)
out['s_kw'] = put('s_kw_D', fade(q[:v0 + int(SR * .11)], 0.002, 0.025), tg('s_kw'), 's_kw')
json.dump(out, open(os.path.join(LI, '_out.json'), 'w')); print(out)
