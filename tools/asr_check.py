# tools/asr_check.py — 語音檔「聽寫驗證」（使用者 2026-10-03 指定：發音要 100% 正確）
#
#   python3 tools/asr_check.py <語音檔資料夾> [<語音檔資料夾> ...]
#
# 每一個語音檔交給語音辨識（OpenAI Whisper small.en，sherpa-onnx 離線版）聽一次，
# 聽出來的字要跟鑰匙（畫面上的句子）一模一樣才算過；不一樣的印出來，**只印失敗項和一行總結**。
# 比對前兩邊都：轉小寫、拿掉標點、數字換成英文（10 ➜ ten）、同音字視為一樣（two／to／too、son／sun…）。
# 不驗的：音節（syl …，單獨一段不是英文字）、只有一個字母的（a、I 單獨唸，辨識常常聽成別的）。
# 模型：TTS_MODELS（或 ASR_MODEL）資料夾裡的 sherpa-onnx-whisper-small.en/
import sys, os, json, re, numpy as np, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from asr_lib import hear, norm, english
def decode(path):
    pcm = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout
    return hear(np.frombuffer(pcm, dtype=np.float32), 16000)
bad = 0; n = 0; BAD = {}
for d in sys.argv[1:]:
    if d.startswith('--'): continue
    man = json.loads(re.search(r'=\s*(\{[\s\S]*\});', open(os.path.join(d, 'aud.js'), encoding='utf8').read()).group(1))
    for key, v in man.items():
        k = key[2:] if key.startswith('m:') else key
        if k.startswith('syl ') or not english(k): continue
        if not os.path.exists(os.path.join(d, v[0])): continue
        n += 1
        got = decode(os.path.join(d, v[0]))
        if norm(got) != norm(k):
            bad += 1; BAD.setdefault(d, []).append(key)
            print('✗', d, '|', key, '| 聽到：', got)
if '--save' in sys.argv: json.dump(BAD, open(os.environ.get('ASR_BAD', 'asr_bad.json'), 'w'), ensure_ascii=False)
print('聽寫驗證：%d 個語音檔，%d 個對不上' % (n, bad))
