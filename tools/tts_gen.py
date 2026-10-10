# tools/tts_gen.py — 把一串文字做成 mp3（離線、神經語音）
#   英文：Kokoro v1.0（2026-10-03 升級：美式女聲 af_bella ＝ sid 2、美式男聲 am_michael ＝ sid 16，Apache-2.0；聲音由 tools/audio_pack.js 的 VOICE 決定）
#         以前是 kokoro-en-v0_19 的 af_bella；舊模型還在的話設 TTS_KOKORO=v0_19 可以退回去
#   瑞典文：Piper sv_SE-nst（KBLab／瑞典國家圖書館用瑞典母語者錄音 NST 訓練，CC0）
# 用法：python3 tools/tts_gen.py ko|sv <speaker id> items.json <輸出資料夾>
#   items.json ＝ [[檔名, 文字, (聲音 sid，可省略)], ...]；輸出 <檔名>.mp3 ＋ _dur.json（每個檔幾秒）
# 模型不放進 repo（太大）：環境變數 TTS_MODELS 指到放模型的資料夾，裡面要有
#   kokoro-multi-lang-v1_0/  與  vits-piper-sv_SE-nst-medium/
#   下載：https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models
#   需要：pip install sherpa-onnx lameenc numpy pyworld onnxruntime（pyworld：句子重音，見 stress.py；onnxruntime：音節照音標唸）
import sys, json, sherpa_onnx, numpy as np, lameenc, os, re, tempfile
T=os.environ.get('TTS_MODELS') or os.path.dirname(os.path.abspath(__file__))
def mk_ko(debug=False):
    if os.environ.get('TTS_KOKORO')=='v0_19':
        d=T+'/kokoro-en-v0_19'
        k=sherpa_onnx.OfflineTtsKokoroModelConfig(model=d+'/model.onnx',voices=d+'/voices.bin',tokens=d+'/tokens.txt',data_dir=d+'/espeak-ng-data')
    else:
        d=T+'/kokoro-multi-lang-v1_0'
        k=sherpa_onnx.OfflineTtsKokoroModelConfig(model=d+'/model.onnx',voices=d+'/voices.bin',tokens=d+'/tokens.txt',
            data_dir=d+'/espeak-ng-data',lexicon=d+'/lexicon-us-en.txt',lang='en-us')
    cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(kokoro=k,num_threads=4,debug=debug))
    return sherpa_onnx.OfflineTts(cfg)
def mk_sv():
    d=T+'/vits-piper-sv_SE-nst-medium'
    onnx=[f for f in os.listdir(d) if f.endswith('.onnx')][0]
    cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(
        model=d+'/'+onnx,tokens=d+'/tokens.txt',data_dir=d+'/espeak-ng-data'),num_threads=4))
    return sherpa_onnx.OfflineTts(cfg)
RAW=None
def raw_ph(ph,sid,spd=1.0):
    # 跳過文字轉音標，直接把音標送進 Kokoro 模型（sherpa-onnx 沒有這個入口，所以用 onnxruntime 直接跑同一個 model.onnx）
    global RAW
    import onnxruntime as ort
    if RAW is None:
        d=T+'/kokoro-multi-lang-v1_0/'; tok={}
        for l in open(d+'tokens.txt',encoding='utf8'):
            l=l.rstrip('\n')
            if not l: continue
            p=l.rsplit(' ',1); tok[p[0] if p[0] else ' ']=int(p[1])
        V=np.fromfile(d+'voices.bin',dtype=np.float32).reshape(-1,510,256)
        RAW=(tok,V,ort.InferenceSession(d+'model.onnx'))
    tok,V,S=RAW; ids=[tok[c] for c in (ph if isinstance(ph,list) else ph.split())]   # list ＝ 已經切好的音標（可以有空白 ' '）
    return S.run(None,{'tokens':np.array([[0]+ids+[0]],dtype=np.int64),'style':V[sid][len(ids)][None,:],'speed':np.array([spd],dtype=np.float32)})[0]
# ── a 一律唸 ㄜ（/ə/）＋ 是非問句照模型自己的語調（使用者 2026-10-10 第 1、4 點）──────────────────────────
# 原因：Kokoro 的英文前處理（espeak）把句子中間的 a 唸成 /ɐ/（介於 ㄚ、ㄜ），句子停在 a 的地方（He's a ______. 空格不唸）唸成 /ˈeɪ/（ㄟ）。
#   sherpa-onnx 不給改音標的入口 ➜ 開一個 debug 版，把它印出來的音標序號接下來，word「a」那一段換成 ə，再用 raw 直接送進同一個模型。
#   量過：換成 ə 以後 Is he a teacher? 句尾自己就會往上（不必再用 stress.py 的 / 硬拉高，那一段把 teacher 的 cher 拉成機器聲）。
DBG=None; TOK=None
def toks():
    global TOK
    if TOK is None:
        TOK={}
        for l in open(T+'/kokoro-multi-lang-v1_0/tokens.txt',encoding='utf8'):
            l=l.rstrip('\n')
            if not l: continue
            p=l.rsplit(' ',1); TOK[int(p[1])]=p[0] if p[0] else ' '
    return TOK
def SPACE_ID():
    return [k for k,v in toks().items() if v==' '][0]
def ids_of(text,sid):
    global DBG
    if DBG is None: DBG=mk_ko(debug=True)
    tf=tempfile.TemporaryFile(); fd=os.dup(2); sys.stderr.flush(); os.dup2(tf.fileno(),2)
    try: DBG.generate(text,sid=sid,speed=4.0)
    finally: os.dup2(fd,2); os.close(fd)
    tf.seek(0); out=tf.read().decode('utf8','replace')
    ids=[]
    for l in out.splitlines():
        l=l.strip()
        if re.fullmatch(r'0( \d+)+ 0',l):
            sq=[int(x) for x in l.split()][1:-1]
            if ids and toks().get(ids[-1])!=' ': ids.append(SPACE_ID())   # 兩句之間補一個空白（不然 ? 會黏到下一個字）
            ids+=sq
    return ids
A_WORD=re.compile(r"(^|[^A-Za-z'])[Aa]([^A-Za-z']|$)")
def needs_schwa(text): return bool(A_WORD.search(text))
PUNC=set(list(',.?!;:"')+['—','…'])
def schwa_ph(text,sid):
    """回傳把每一個 a 換成 ə 的音標（list，給 raw_ph）；對不上字數就回 None（照舊用一般的做法）"""
    tk=toks(); ph=[tk[i] for i in ids_of(text,sid)]
    words=[w for w in re.sub(r"[^A-Za-z0-9' ]",' ',text).split()]
    groups=[[]]
    for c in ph:
        if c==' ':
            if groups[-1]: groups.append([])
        else: groups[-1].append(c)
    if not groups[-1]: groups.pop()
    # 找「a」那一段：去掉重音記號和標點以後，音標 ＝ ɐ／ə／eɪ 的那一個字（YouTuber 這種字 espeak 會切成兩段，不靠字數對齊）
    na=sum(1 for w in words if w.lower()=='a'); hit=[]
    for g in groups:
        core=''.join(c for c in g if c not in PUNC and c not in 'ˈˌ')
        if core in ('ɐ','ə','eɪ'): hit.append(g)
    if len(hit)!=na: return None
    for g in hit:
        tail=[c for c in g if c in PUNC]; g[:]=['ə']+tail
    out=[]
    for g in groups: out+= ([' '] if out else [])+g
    return out
def ynq(text): return bool(re.match(r"^(Is|Are|Am|Can|Do|Does|Was|Were)\b.*\?$",text.strip()))
def rise(samples,sr=24000):
    import pyworld as pw
    x=np.array(samples,dtype=np.float64).ravel(); f0,_=pw.harvest(x,sr,frame_period=10); v=f0[f0>0]
    if len(v)<10: return 0
    n=max(4,int(len(v)*.15)); return float(np.median(v[-n:])/np.median(v))
def gen_schwa(text,sid,spd,ASR,post=None):
    """a ➜ ə（直接送音標進模型）；post ＝ 做完要加的語調（stress.py），加完再用 Whisper 聽，聽錯換語速重做"""
    import asr_lib
    ph=schwa_ph(text,sid)
    if ph is None: return None
    tries=(1.0,0.95,1.05,0.9,1.1)
    best=None
    for sp in tries:
        y=np.asarray(raw_ph(ph,sid,sp*spd)).ravel()
        if post: y=post(y,sp*spd)   # 句尾低升調、輕讀…（stress.py）做完再聽
        ok=(not ASR) or (not asr_lib.english(text)) or asr_lib.norm(asr_lib.hear(y,24000))==asr_lib.norm(text)
        if not ok: continue
        best=(0,y); break   # 第一個聽得對的就用（2026-10-10：模型自己不會往上，語調交給 stress.py 的 @）
    if best is None:
        y=np.asarray(raw_ph(ph,sid,spd)).ravel(); best=(0,post(y,spd) if post else y)
    return best[1]
def mp3(samples,sr,path):
    a=np.clip(np.array(samples),-1,1)
    # 剪掉前後的靜音（2026-10-03 修：原本門檻 0.01、只留 0.03 秒，f、h、s 這種很輕的開頭音會被剪掉 ➜ fast 聽成 vast、ham 聽成 tam）
    #   門檻改成「最大音量的 1.5%」，前面多留 0.12 秒、後面多留 0.15 秒
    pk=float(np.max(np.abs(a))) if len(a) else 0; thr=max(0.002,pk*0.015); idx=np.where(np.abs(a)>thr)[0]
    if len(idx): a=a[max(0,idx[0]-int(.12*sr)):min(len(a),idx[-1]+int(.15*sr))]
    pcm=(a*32767).astype(np.int16).tobytes()
    e=lameenc.Encoder();e.set_bit_rate(48);e.set_in_sample_rate(sr);e.set_channels(1);e.set_quality(2)
    open(path,'wb').write(e.encode(pcm)+e.flush())
    return len(a)/sr
if __name__=='__main__':
    kind,sid0,items,outdir=sys.argv[1],int(sys.argv[2]),json.load(open(sys.argv[3])),sys.argv[4]
    tts=mk_ko() if kind=='ko' else mk_sv()
    res={}
    sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
    import stress, asr_lib
    ASR=asr_lib.available()
    for it in items:
        key,text=it[0],it[1]; sid=int(it[2]) if len(it)>2 else sid0
        spd=float(it[3]) if len(it)>3 else 1.0   # 語速（2026-10-04：全站單字卡 0.85，比較慢、聲音不變調）
        if kind=='ko' and text.startswith('§'):   # 音標直接唸（音節動畫的一段一段，2026-10-03）：§ 後面是 Kokoro 的音標，空白隔開
            smp=raw_ph(text[1:],sid,spd); res[key]=round(mp3(smp,24000,os.path.join(outdir,key+'.mp3')),3); continue
        if kind=='ko' and (lambda p: needs_schwa(p) or ynq(p))(stress.parse(text)[0] if stress.has(text) else text):   # a 唸 ㄜ、是非問句（2026-10-10）
            plain=stress.parse(text)[0] if stress.has(text) else text
            mk=text
            if ynq(plain) and not stress.has(text): mk=re.sub(r'(\S+)$',r'@\1',text)   # 是非問句句尾低升調（stress.py 的 @）
            y=gen_schwa(plain,sid,spd,ASR,(lambda z,sp: stress.apply(tts,sid,z,24000,mk,sp)) if stress.has(mk) else None)
            if y is not None:
                res[key]=round(mp3(y,24000,os.path.join(outdir,key+'.mp3')),3); continue
            print('⚠️ a 對不上字數，照舊做：'+plain)
        if kind=='ko' and stress.has(text):   # 句子重音：+ten -years -old（tools/stress.py）
            plain,_,_=stress.parse(text)
            au=tts.generate(plain,sid=sid,speed=spd)
            smp=stress.apply(tts,sid,au.samples,au.sample_rate,text,spd)
            # 有記號的也當場聽一次（2026-10-04：句尾上揚的 Is she a cook? 聽成 cock）：聽錯就換語速重做
            if ASR and asr_lib.english(plain) and asr_lib.norm(asr_lib.hear(smp,au.sample_rate))!=asr_lib.norm(plain):
                for sp in (0.95,1.05,0.9,1.1):
                    b=tts.generate(plain,sid=sid,speed=sp*spd); y=stress.apply(tts,sid,b.samples,b.sample_rate,text,sp*spd)
                    if asr_lib.norm(asr_lib.hear(y,b.sample_rate))==asr_lib.norm(plain): smp=y; break
        else:
            au=tts.generate(text,sid=sid,speed=spd); smp=au.samples
            # 當場聽一次（2026-10-03）：Kokoro 偶爾把一個字唸歪（句尾的 cook 唸得像 cock），聽錯就換語速重做，最多 4 次，留聽得對的那一版
            if kind=='ko' and ASR and asr_lib.english(text) and asr_lib.norm(asr_lib.hear(smp,au.sample_rate))!=asr_lib.norm(text):
                for sp in (0.95,1.05,0.9):
                    b=tts.generate(text,sid=sid,speed=sp*spd)
                    if asr_lib.norm(asr_lib.hear(b.samples,b.sample_rate))==asr_lib.norm(text): smp=b.samples; break
        res[key]=round(mp3(smp,au.sample_rate,os.path.join(outdir,key+'.mp3')),3)
    json.dump(res,open(os.path.join(outdir,'_dur.json'),'w'))
    print('done',len(res))
