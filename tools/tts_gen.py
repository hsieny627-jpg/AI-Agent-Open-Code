# tools/tts_gen.py — 把一串文字做成 mp3（離線、神經語音）
#   英文：Kokoro v1.0（2026-10-03 升級：美式女聲 af_bella ＝ sid 2、美式男聲 am_michael ＝ sid 16，Apache-2.0；聲音由 tools/audio_pack.js 的 VOICE 決定）
#         以前是 kokoro-en-v0_19 的 af_bella；舊模型還在的話設 TTS_KOKORO=v0_19 可以退回去
#   瑞典文：Piper sv_SE-nst（KBLab／瑞典國家圖書館用瑞典母語者錄音 NST 訓練，CC0）
# 2026-10-10 起英文用 hf（HiFi-Captain，見下面「第二批 A 組」）；ko 留著可以退回 Kokoro
# 用法：python3 tools/tts_gen.py hf|ko|sv <speaker id> items.json <輸出資料夾>
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
# ── 2026-10-10 第二批 A 組：全站英文改用 HiFi-Captain（Piper／VITS，日本 NICT 專業配音員錄音，CC BY-NC-SA 4.0）────────
#   使用者三次試聽以後選定：女聲 ＝ hfc_female、男聲 ＝ hfc_male（Kokoro 改音高不及格、男聲喉音太重）。
#   這兩個聲音的是非問句句尾**自己會往上**、How about you? 自己會往下 ➜ **不再改音高**：stress.py 的記號（+ - ~ ^ % ! / & @）一律拿掉、照原文唸。
#   語速：試聽用 0.95 ➜ 全站 ✕0.95（單字卡 0.85 再 ✕0.95）。模型資料夾：vits-piper-en_US-hfc_female-medium、vits-piper-en_US-hfc_male-medium
#   a 一律 ㄜ：句子中間的 a，espeak 的音標是 ɐ（模型唸 ㄜ）；句子停在 a（He's a ______.）是 ˈeɪ（ㄟ）➜ 換成 ɐ，再直接把音標送進模型（hf_raw）
#   § 開頭 ＝ 音標直接唸（單字卡音節動畫；Kokoro 的音標字元，同一套 espeak IPA）
HF={}; HFTOK={}; PHZ=None
HFBASE=0.95
HFLEX={'taekwondo':'tˈaɪkwˈɑːndˈoʊ',
       'three':'θθɹˈiː'}   # 2026-10-11 A2：θ 拉長（女聲 three 原本 8 次 6 次聽成 free）
def hf_dir(v): return T+'/vits-piper-en_US-hfc_'+('male' if v==1 else 'female')+'-medium'
def hf(v):
    if v not in HF:
        d=hf_dir(v); onnx=[f for f in os.listdir(d) if f.endswith('.onnx')][0]
        HF[v]=sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(
            model=d+'/'+onnx,tokens=d+'/tokens.txt',data_dir=d+'/espeak-ng-data'),num_threads=4)))
    return HF[v]
def hf_raw(ph,v,spd):
    """音標（字串，一個字元一個音標，空白 ＝ 字和字中間）直接送進同一個 onnx：^ _ p _ p _ … $（Piper 的格式）"""
    import onnxruntime as ort
    if v not in HFTOK:
        d=hf_dir(v); tok={}
        for l in open(d+'/tokens.txt',encoding='utf8'):
            l=l.rstrip('\n')
            if not l: continue
            q=l.rsplit(' ',1); tok[q[0] if q[0] else ' ']=int(q[1])
        onnx=[f for f in os.listdir(d) if f.endswith('.onnx')][0]
        HFTOK[v]=(tok,ort.InferenceSession(d+'/'+onnx))
    tok,S=HFTOK[v]; ids=[tok['^'],tok['_']]
    for c in ph:
        if c in tok: ids+=[tok[c],tok['_']]
    ids.append(tok['$'])
    y=S.run(None,{'input':np.array([ids],dtype=np.int64),'input_lengths':np.array([len(ids)],dtype=np.int64),
        'scales':np.array([0.667,1.0/spd,0.8],dtype=np.float32)})[0]
    return np.asarray(y,dtype=np.float32).ravel()
def phz(text):
    global PHZ
    if PHZ is None:
        import espeakng_loader
        from phonemizer.backend.espeak.wrapper import EspeakWrapper
        EspeakWrapper.set_library(espeakng_loader.get_library_path()); EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
        from phonemizer import phonemize
        PHZ=lambda t: phonemize(t,language='en-us',backend='espeak',with_stress=True,preserve_punctuation=True,strip=True)
    return PHZ(text)
def hf_a_fix(text):
    """句子停在 a、或一整句只有 a 的那一格：音標 ˈeɪ ➜ ɐ。回傳要直接唸的音標；不用改就回 None"""
    if not needs_schwa(text): return None
    words=re.sub(r"[^A-Za-z0-9' ]",' ',text).split(); ph=phz(text); gs=ph.split(' ')
    if len(gs)!=len(words): return None
    ch=False
    for n,w in enumerate(words):
        if w.lower()=='a':
            core=''.join(c for c in gs[n] if c not in 'ˈˌ.,?!;:')
            if core=='eɪ': gs[n]=gs[n].replace('ˈ','').replace('ˌ','').replace('eɪ','ɐ'); ch=True
    return ' '.join(gs) if ch else None
# ── 2026-10-11 A2：使用者聽出來的三個字（three 像 free、aunt／auntie 要最精準、She's 的 Sh 像 Ch）─────────────
#   VITS 每次做出來都有一點不同，問題是「有時候對、有時候不對」：電腦聽寫 three 女聲 8 次有 6 次聽成 free；
#   aunt 最後的 t 有一半沒有爆破音（量高頻：0.001 ＝ 完全沒有 t，聽起來像 an／and）；女聲 She's 開頭的嘶聲 0.04 秒就衝到最大，
#   跟 Ch（tʃ）幾乎一樣陡（男聲 0.06 秒）。做法：
#   ① three ＝ θ 拉長（HFLEX 'θθɹˈiː'：8 次 7 次聽成 three），再聽寫確認
#   ② 句子最後是 aunt：多做幾次，挑 t 爆破音最清楚的（a2_burst）；auntie：聽寫要聽成 auntie／anti（美式兩個同音）
#   ③ 句子開頭是 She：多做幾次，挑開頭嘶聲上升最慢的（a2_rise，愈慢愈像 Sh），再在嘶聲開頭加 0.09 秒淡入（試過：真的 Ch 句子 30 次有 8 次被聽成 cheese，淡入 0.06 秒 7 次、0.09 秒 2 次；正常的 She's a nurse 30 次全對、不受影響）；
#      兩句話、第二句才是 She's 的（No, she isn't. She's a cook.）：兩句分開做、中間停 0.3 秒，第二句也照這樣挑
A2N=12          # 最多做幾次來挑
A2SR=22050
def _hfband(y,sr,ms,lo):
    y=np.asarray(y,dtype=np.float32); f=int(ms/1000*sr); n=len(y)//f
    if n<1: return np.zeros(1),np.zeros(1)
    fr=np.fft.rfftfreq(f,1/sr); hb=[];al=[]
    for i in range(n):
        F=np.abs(np.fft.rfft(y[i*f:(i+1)*f])); hb.append(np.sqrt(np.sum(F[fr>lo]**2))); al.append(np.sqrt(np.sum(F**2)))
    return np.array(hb),np.array(al)
def a2_burst(y,sr=A2SR):
    """最後一個音附近（0.15 秒內）3.5kHz 以上的嘶聲最大值 ÷ 整句最大音量：t 有爆破 ≈ 0.2～0.5，沒有 ≈ 0.00x"""
    hb,al=_hfband(y,sr,10,3500); idx=np.where(al>al.max()*.02)[0]
    if not len(idx): return 0.0
    last=idx[-1]; return float(hb[max(0,last-15):last+1].max()/al.max())
def a2_rise(y,sr=A2SR):
    """開頭的嘶聲（2kHz 以上）從開始到 80% 要幾毫秒：Sh 慢慢變大、Ch 一下子衝上來"""
    hb,_=_hfband(y,sr,4,2000)
    if hb.max()<=0: return 0
    i1=int(np.argmax(hb>hb.max()*.05)); w=hb[i1:i1+30]; return int(np.argmax(w>=w.max()*.8))*4
def a2_fade(y,sr=A2SR,ms=90):
    """嘶聲開頭 0.09 秒淡入（升餘弦）：把太陡的開頭磨圓，聽起來是 Sh 不是 Ch"""
    y=np.array(y,dtype=np.float32); hb,_=_hfband(y,sr,4,2000)
    i1=int(np.argmax(hb>hb.max()*.05))*int(.004*sr); n=int(ms/1000*sr)
    if i1+n<len(y): y[i1:i1+n]*=(0.5-0.5*np.cos(np.linspace(0,np.pi,n))).astype(np.float32); y[:i1]=0
    return y
def a2_kind(text):
    t=text.strip()
    if re.match(r"^She\b",t): return 'she'
    if re.search(r"\baunt[.?!]?$",t,re.I): return 'aunt'
    return None
def a2_trim(y,sr):
    a=np.asarray(y,dtype=np.float32); pk=float(np.max(np.abs(a))) if len(a) else 0; idx=np.where(np.abs(a)>max(0.002,pk*0.015))[0]
    return a[max(0,idx[0]-int(.03*sr)):min(len(a),idx[-1]+int(.05*sr))] if len(idx) else a
def gen_hf(text,v,spd,ASR):
    # ③ 兩句話、第二句以 She 開頭：分開做再接起來（第一句、第二句各自照規則挑）
    m=re.match(r"^(.*?[.?!])\s+(She\b.*)$",text.strip())
    if m and not text.startswith('§'):
        a,sr=gen_hf(m.group(1),v,spd,ASR); b,_=gen_hf(m.group(2),v,spd,ASR)
        return np.concatenate([a2_trim(a,sr),np.zeros(int(.3*sr),dtype=np.float32),a2_trim(b,sr)]),sr
    return gen_hf1(text,v,spd,ASR)
def gen_hf1(text,v,spd,ASR):
    import asr_lib
    spd=spd*HFBASE
    if text.startswith('§'):   # 音節：照音標唸
        # Kokoro 的音標有幾個自己的寫法（misaki）：I ＝ aɪ、O ＝ oʊ、A ＝ eɪ、W ＝ aʊ、Y ＝ ɔɪ、ʧ ＝ tʃ、ʤ ＝ dʒ、ᵊ ＝ ə
        KM={'I':'aɪ','O':'oʊ','A':'eɪ','W':'aʊ','Y':'ɔɪ','ʧ':'tʃ','ʤ':'dʒ','ᵊ':'ə'}
        ph=''.join(KM.get(c,c) for c in text[1:].split(' '))
        return hf_raw(ph,v,spd),22050
    import stress
    if stress.has(text): text=stress.parse(text)[0]   # 不改音高：記號拿掉
    # 沒有句點／問號的（單字、片語）：模型最後一個音會被切掉（stuffed 聽成 stuff、pig 0/4 ➜ 加句點 4/4）➜ 唸的時候補一個句點
    if re.search(r"[A-Za-z']$",text): text=text+'.'
    ph=hf_a_fix(text)
    # 字典改音（espeak 唸錯的字）：taekwondo ＝ /ˈtaɪˈkwɑːnˈdoʊ/（Merriam-Webster「tae kwon do」ˈtī-ˈkwän-ˈdō；espeak 唸成 tee-kwun-doh）
    if any(w in text.lower() for w in HFLEX):
        words=re.sub(r"[^A-Za-z0-9' ]",' ',text).split(); gs=(ph or phz(text)).split(' ')
        if len(gs)==len(words):
            for n,w in enumerate(words):
                if w.lower() in HFLEX: gs[n]=HFLEX[w.lower()]+''.join(c for c in gs[n] if c in '.,?!')
            ph=' '.join(gs)
    best=None; kind=a2_kind(text); pick=None
    # 單獨一個 aunt：聽寫一定聽成 and（單獨一個字，and 常見太多；aunt 跟 ant 美式同音），只看 t 的爆破音
    solo=bool(re.fullmatch(r"(?i)aunt[.?!]?",text.strip()))
    for tr in range(A2N if kind else 8):   # VITS 每次做出來會有一點不同：聽寫聽錯就重做（最多 8 次；A2 的字最多 12 次、挑最好的）
        if ph is not None: y,sr=hf_raw(ph,v,spd),22050
        else:
            a=hf(v).generate(text,sid=0,speed=spd); y,sr=np.array(a.samples,dtype=np.float32),a.sample_rate
        if best is None: best=(y,sr)
        ok=solo or (not ASR) or (not asr_lib.english(text)) or asr_lib.norm(asr_lib.hear(y,sr))==asr_lib.norm(text)
        if not kind:
            if ok: return y,sr
            continue
        if not ok: continue
        sc=a2_burst(y,sr) if kind=='aunt' else a2_rise(y,sr)
        if pick is None or sc>pick[0]: pick=(sc,y,sr)
        if (kind=='aunt' and sc>=0.3) or (kind=='she' and sc>=80): break
    if pick is not None:
        y,sr=pick[1],pick[2]
        return (a2_fade(y,sr) if kind=='she' else y),sr
    print('⚠️ 聽寫 '+str(A2N if kind else 8)+' 次都對不上（保留第一次）：'+text)
    return (a2_fade(*best),best[1]) if kind=='she' else best
if __name__=='__main__':
    kind,sid0,items,outdir=sys.argv[1],int(sys.argv[2]),json.load(open(sys.argv[3])),sys.argv[4]
    if kind=='hf':   # 2026-10-10：HiFi-Captain（item 第 3 格：0 ＝ 女聲、1 ＝ 男聲）
        sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
        import asr_lib
        ASR=asr_lib.available(); res={}
        for it in items:
            key,text=it[0],it[1]; v=int(it[2]) if len(it)>2 else 0; spd=float(it[3]) if len(it)>3 else 1.0
            y,sr=gen_hf(text,v,spd,ASR); res[key]=round(mp3(y,sr,os.path.join(outdir,key+'.mp3')),3)
        json.dump(res,open(os.path.join(outdir,'_dur.json'),'w')); print('done',len(res)); sys.exit(0)
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
