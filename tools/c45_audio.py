# tools/c45_audio.py — 2026-11-01 第三十八次 第 11-(10)-7 點：四年級 複習（midterm）
#   ① 第二句 開頭 的 She’s（No, she isn’t. She’s a nurse.）聽起來 像 He ➜ 原因：2026-10-11 A2 為了「Sh 不要 像 Ch」在 嘶聲 開頭 淡入 0.09 秒，淡 太 多 ➜ Sh 不見 了
#      做法：淡入 改成 0.025 秒（只 去掉 爆音），而且 電腦 聽寫（Whisper small.en）一定 要 聽成 She’s 才 用（最多 做 12 次）
#   ② Yes, he is.／Yes, she is. 的 Yes 聽起來 不對 ➜ 重新 做，電腦 聽寫 整句 一字 不差 才 用
#   舊 的 檔 先 放進 listen/2026-11-01_C45/au/（老師 試聽 對照，要 換回來 就 抄回去）；檔名 不變（網站 不用 改），秒數 寫回 aud.js
# 用法：TTS_MODELS=<模型> python3 tools/c45_audio.py
import os, re, json, shutil, sys, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gen as T, asr_lib
_fade = T.a2_fade
T.a2_fade = lambda y, sr=T.A2SR, ms=90: _fade(y, sr, 25)
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'listen', '2026-11-01_C45', 'au'); os.makedirs(OUT, exist_ok=True)
DIRS = [('midterm/audio', 1.0), ('midterm/audio/s', 0.85), ('midterm/audio/rv', 0.85)]
RE = re.compile(r"[.?!] she's |^yes, s?he is", re.I)
def cap(t):
    t = re.sub(r"(^|[.?!]\s+)([a-z])", lambda m: m.group(1) + m.group(2).upper(), t)
    return re.sub(r"\bi\b", 'I', re.sub(r",\s*([a-z]+)\.", lambda m: ', ' + (m.group(1).capitalize() if m.group(1) not in ('too',) else m.group(1)) + '.', t))
log = []
ASR = asr_lib.available()
if not ASR: print('✗ 沒有 電腦 聽寫 模型'); sys.exit(1)
for d, spd in DIRS:
    aj = os.path.join(ROOT, d, 'aud.js'); src = open(aj, encoding='utf8').read(); m = re.search(r'=\s*(\{[\s\S]*\});', src); M = json.loads(m.group(1))
    for k, v in M.items():
        v0 = 1 if k.startswith('m:') else 0; t = k[2:] if v0 else k
        if not RE.search(t): continue
        f = os.path.join(ROOT, d, v[0]); old = os.path.join(OUT, 'old_' + v[0])
        if not os.path.exists(old): shutil.copyfile(f, old)
        text = cap(t)
        ok = False
        for tr in range(6):
            y, sr = T.gen_hf(text, v0, spd, ASR)
            heard = asr_lib.norm(asr_lib.hear(y, sr)); ok = heard == asr_lib.norm(text)
            if ok: break
        dur = T.mp3(y, sr, f); v[1] = round(dur, 3)
        log.append({'d': d, 'k': k, 't': text, 'f': v[0], 'ok': ok, 'heard': heard})
        print(('✓ ' if ok else '✗ ') + d + ' ' + ('男' if v0 else '女') + ' ' + text + ('' if ok else '  ➜ 聽成 ' + heard))
    open(aj, 'w', encoding='utf8').write(src[:m.start(1)] + json.dumps(M, ensure_ascii=False, separators=(',', ':')) + src[m.end(1):])
json.dump(log, open(os.path.join(OUT, '_log.json'), 'w'), ensure_ascii=False, indent=0)
print('做了', len(log), '個，聽寫 對', sum(1 for x in log if x['ok']), '個')
