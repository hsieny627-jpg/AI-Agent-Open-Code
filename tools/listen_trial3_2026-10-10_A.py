# 第三次試聽（2026-10-10）：女聲 ①（HiFi-Captain）和 ④（LibriTTS-R #588）唸 12 句不同的句子；男聲 ①（HiFi-Captain）唸答句
#   TTS_MODELS=<模型資料夾> python3 tools/listen_trial3_2026-10-10_A.py listen/2026-10-10_A3
#   電腦聽寫聽錯就重做（最多 8 次）；語速 0.95（跟第二次試聽一樣）
import sys, os, json, numpy as np, sherpa_onnx
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import asr_lib, tts_gen as g
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
M = os.environ.get('TTS_MODELS', '.') + '/'
def piper(name):
    d = M + name; onnx = [f for f in os.listdir(d) if f.endswith('.onnx')][0]
    return sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(
        model=d+'/'+onnx, tokens=d+'/tokens.txt', data_dir=d+'/espeak-ng-data'), num_threads=4)))
HF, HM, LIB = piper('vits-piper-en_US-hfc_female-medium'), piper('vits-piper-en_US-hfc_male-medium'), piper('vits-piper-en_US-libritts_r-medium')
F = ["What's your name?", 'My name is Amy.', 'How old are you?', "I'm nine years old.", "Who's she?", "She's my mother.",
     'Is she a nurse?', 'Is he a cook?', 'How about you?', 'I like to play basketball.', 'I like bubble tea.', 'teacher']
MS = ["He's my father.", "I'm ten years old.", 'Yes, he is.', "No, she isn't. She's a doctor.", 'My name is Ken.', 'I like to play dodgeball.']
res = []
def mk(t, sid, s, name):
    for tr in range(8):
        a = t.generate(s, sid=sid, speed=0.95); y = np.array(a.samples, dtype=np.float32)
        h = asr_lib.hear(y, a.sample_rate)
        if asr_lib.norm(h) == asr_lib.norm(s): break
    g.mp3(y, a.sample_rate, os.path.join(OUT, name + '.mp3'))
    res.append([name, s, h, asr_lib.norm(h) == asr_lib.norm(s)]); print(res[-1], flush=True)
for k, s in enumerate(F):
    mk(HF, 0, s, 'F1_%02d' % k); mk(LIB, 588, s, 'F4_%02d' % k)
for k, s in enumerate(MS): mk(HM, 0, s, 'M1_%02d' % k)
json.dump({'F': F, 'M': MS, 'res': res}, open(os.path.join(OUT, 'res3.json'), 'w'), ensure_ascii=False)
