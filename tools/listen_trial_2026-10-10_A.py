# 試聽檔：Is he a teacher?（女聲、男聲）、How about you?（三年級，you 四聲）
import sys, os, numpy as np, json
sys.path.insert(0, '/home/user/AI-Agent-Open-Code/tools')
import tts_gen as g, stress, asr_lib
import parselmouth as pm
from parselmouth.praat import call
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
tts = g.mk_ko()
SR = 24000

def last_word_start(y, sid, words, spd=1.0):
    # 跟 stress.apply 一樣：每個字單獨唸量長度，照比例分（句尾的字多給一點）
    a = np.asarray(y, dtype=np.float64); idx = np.where(np.abs(a) > 0.01)[0]; s0, s1 = idx[0], idx[-1]
    wd = []
    for w in words:
        x = np.array(tts.generate(w, sid=sid, speed=spd).samples); j = np.where(np.abs(x) > 0.01)[0]
        wd.append((j[-1]-j[0]) if len(j) else len(x))
    wd[-1] *= 1.15
    return (s0 + (s1-s0)*sum(wd[:-1])/sum(wd)) / SR, s1 / SR

def psola(y, fn):
    """Praat 的 PSOLA（overlap-add）改音高：fn(t, f0, med, t0, t1) ➜ 新的 f0；聲音本身不重新合成，比 WORLD 自然"""
    s = pm.Sound(np.asarray(y, dtype=np.float64), sampling_frequency=SR)
    man = call(s, 'To Manipulation', 0.01, 75, 500)
    pt = call(man, 'Extract pitch tier')
    n = call(pt, 'Get number of points')
    pts = [(call(pt, 'Get time from index', k), call(pt, 'Get value at index', k)) for k in range(1, n+1)]
    med = float(np.median([f for _, f in pts])); global TEND; TEND = pts[-1][0]
    call(pt, 'Remove points between', 0, s.duration)
    for t, f in pts: call(pt, 'Add point', t, fn(t, f, med))
    call([pt, man], 'Replace pitch tier')
    return call(man, 'Get resynthesis (overlap-add)').values[0]

def rise_fn(t0, t1, goal=1.28, p=1.6):
    def fn(t, f, med):
        if t < t0: return f
        x = min(1, (t-t0)/max(1e-3, TEND-t0)) ** p
        return f * (1 + (med*goal/f - 1) * x) if f > 0 else f
    return fn

def fall_fn(t0, t1, hi=1.25, lo=0.80):
    # 四聲：you 一開始高（全句中位數 ✕hi），一路往下到 ✕lo；保留原本一點點小起伏
    def fn(t, f, med):
        if t < t0: return f
        x = min(1, (t-t0)/max(1e-3, TEND-t0))
        goal = med*(hi + (lo-hi)*x)
        return goal * 0.85 + f * 0.15 * (goal/med)
    return fn

res = []
def save(name, y, text, note):
    y = np.asarray(y, dtype=np.float32).ravel()
    heard = asr_lib.hear(y, SR)
    g.mp3(y, SR, os.path.join(OUT, name + '.mp3'))
    res.append([name, text, note, heard, round(g.rise(y), 2)])

T = 'Is he a teacher?'; W = ['Is', 'he', 'a', 'teacher']
for sid, who in ((2, 'F'), (16, 'M')):
    plain = np.array(tts.generate(T, sid=sid).samples)
    sch = np.asarray(g.raw_ph(g.schwa_ph(T, sid), sid)).ravel()
    save(who+'1_old', stress.apply(tts, sid, plain, SR, 'Is he a /teacher?'), T, '舊：模型原本的 a ＋ 硬拉高（/）')
    save(who+'2_new', stress.apply(tts, sid, sch, SR, 'Is he a @teacher?'), T, '新：a 唸 ə ＋ 低升調（@，WORLD）')
    save(who+'3_raw', sch, T, '不改音高：a 唸 ə，模型自己唸（句尾往下）')
    t0, t1 = last_word_start(sch, sid, W)
    save(who+'4_psola', psola(sch, rise_fn(t0, t1+0.15, 1.30, 1.6)), T, 'a 唸 ə ＋ Praat 低升調（不重新合成聲音）')
    save(who+'5_psola_hi', psola(sch, rise_fn(t0, t1+0.15, 1.45, 1.2)), T, 'a 唸 ə ＋ Praat 拉高（跟舊的一樣高）')

H = 'How about you?'; HW = ['How', 'about', 'you']
y0 = np.array(tts.generate(H, sid=2).samples)
save('Y1_now', y0, H, '現在三年級的（you 最後往上翹；語音辨識聽成 So about you）')
y1 = np.asarray(g.raw_ph(list('hˈaʊ əbˌaʊt jˈuː?'), 2)).ravel()
save('Y2_stress', y1, H, 'How、you 重音（修好 So），音高不改')
t0, t1 = last_word_start(y1, 2, HW)
save('Y3_fall', psola(y1, fall_fn(t0, 0, 1.25, 0.80)), H, 'How、you 重音 ＋ you 四聲：高 ➜ 低')
save('Y4_fall_soft', psola(y1, fall_fn(t0, 0, 1.15, 0.85)), H, 'How、you 重音 ＋ you 四聲（溫和一點）')
json.dump(res, open(os.path.join(OUT, 'res.json'), 'w'), ensure_ascii=False, indent=0)
for r in res: print(r)
