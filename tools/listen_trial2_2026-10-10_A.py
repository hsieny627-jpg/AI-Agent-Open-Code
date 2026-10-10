# 第二次試聽：換聲音（Piper：HiFi-Captain、LibriTTS-R 真人朗讀者）＋ Kokoro 參考
import sys, os, json, numpy as np, sherpa_onnx
sys.path.insert(0, '/home/user/AI-Agent-Open-Code/tools')
import asr_lib, tts_gen as g, stress
import parselmouth as pm
from parselmouth.praat import call
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
M = '/tmp/claude-0/models/'
def piper(name):
    d = M + name; onnx = [f for f in os.listdir(d) if f.endswith('.onnx')][0]
    return sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(
        model=d+'/'+onnx, tokens=d+'/tokens.txt', data_dir=d+'/espeak-ng-data'), num_threads=4)))
LIB = piper('vits-piper-en_US-libritts_r-medium')
V = [('F1', piper('vits-piper-en_US-hfc_female-medium'), 0), ('F2', LIB, 12), ('F3', LIB, 228), ('F4', LIB, 588),
     ('M1', piper('vits-piper-en_US-hfc_male-medium'), 0), ('M2', LIB, 738), ('M3', LIB, 678), ('M4', LIB, 684), ('M5', LIB, 6)]
S = [('q', 'Is he a teacher?'), ('s', 'He is a teacher.'), ('h', 'How about you?')]
res = []
for code, t, sid in V:
    for k, s in S:
        for tr in range(8):
            a = t.generate(s, sid=sid, speed=0.95); y = np.array(a.samples, dtype=np.float32)
            h = asr_lib.hear(y, a.sample_rate)
            if asr_lib.norm(h) == asr_lib.norm(s): break
        g.mp3(y, a.sample_rate, os.path.join(OUT, '%s_%s.mp3' % (code, k)))
        res.append([code, s, h, asr_lib.norm(h) == asr_lib.norm(s)])
        print(res[-1], flush=True)
# How about you?：Kokoro ② 再柔和一點（you 的音高峰值低一點、音量小一點）
tts = g.mk_ko(); SR = 24000
y = np.asarray(g.raw_ph(list('hˈaʊ əbˌaʊt jˈuː?'), 2)).ravel()
s = pm.Sound(np.asarray(y, dtype=np.float64), sampling_frequency=SR)
man = call(s, 'To Manipulation', 0.01, 75, 500); pt = call(man, 'Extract pitch tier')
n = call(pt, 'Get number of points'); pts = [(call(pt, 'Get time from index', k), call(pt, 'Get value at index', k)) for k in range(1, n+1)]
t0 = s.duration * 0.62
call(pt, 'Remove points between', 0, s.duration)
for tt, f in pts:
    x = 0 if tt < t0 else min(1, (tt - t0) / (s.duration - t0))
    call(pt, 'Add point', tt, f * (1 - 0.12 * x))
call([pt, man], 'Replace pitch tier')
z = call(man, 'Get resynthesis (overlap-add)').values[0]
i0 = int(t0 * SR); gk = np.ones(len(z)); gk[i0:] = np.linspace(1, 0.72, len(z) - i0); z = z * gk
g.mp3(z, SR, os.path.join(OUT, 'Y5_soft.mp3')); print('Y5', asr_lib.hear(np.asarray(z, dtype=np.float32), SR))
json.dump(res, open(os.path.join(OUT, 'res2.json'), 'w'), ensure_ascii=False)
