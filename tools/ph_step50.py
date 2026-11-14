# tools/ph_step50.py — 第五十次：〔🧩 逐步 拼音〕的 聲音（字首＋母音 cv_、母音＋後面 rm_、ir 的 ɜ s_ir）
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_step50.py   （清單 ＝ node tools/ph_step50.js）
import os, sys, json, subprocess, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T
from ph_fix49 import trim
from ph_iso50 import level
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
L = json.loads(subprocess.run(['node', 'tools/ph_step50.js'], cwd=ROOT, capture_output=True, text=True).stdout)
for name, ph in L:
    y = trim(T.hf_raw(ph + '.', 0, 0.8 * T.HFBASE)); y = level(y, 0.065 if name.startswith('s_') else 0.08)
    T.mp3(y, 22050, os.path.join(AU, name + '.mp3'))
print(len(L), '個')
