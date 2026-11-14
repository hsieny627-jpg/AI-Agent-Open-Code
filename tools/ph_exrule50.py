# tools/ph_exrule50.py — 第五十次（老師 第 3 點）：例外 字 頁〔照 規則 會 唸 成…〕有些 沒有 聲音 ＝ 那些 碼 從來 沒有 做 音檔（字卡 不放 例外 的 規則 唸法）
#   補 做：node 算 出 缺 的 碼＋音標 ➜ HiFi-Captain 女聲（語速 跟 字卡 一樣 0.8）
# 用法：TTS_MODELS=/tmp/models python3 tools/ph_exrule50.py
import os, sys, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); AU = os.path.join(ROOT, 'phonics', 'au')
js = "const PH=require('./phonics/_ph.js');const E=require('./phonics/_excshow.json');const fs=require('fs');const h=new Set(fs.readdirSync('phonics/au'));process.stdout.write(JSON.stringify([...new Set(Object.keys(E).map(k=>k.split('|')[1]))].filter(c=>!h.has(c+'.mp3')).map(c=>[c,PH.ipaOf(c)])))"
L = json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True).stdout)
for c, ph in L: T.mp3(T.hf_raw(ph, 0, 0.8 * T.HFBASE), 22050, os.path.join(AU, c + '.mp3'))
print('補 做', len(L), '個')
