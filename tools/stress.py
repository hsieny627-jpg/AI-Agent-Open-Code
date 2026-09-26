# tools/stress.py — 句子重音（使用者 2026-09-26 指定）
#   ten 是 content word：音高比較高、比較大聲（stressed）；years old 是 function words：唸得比較輕（unstressed）。
#   神經語音（Kokoro）沒辦法指定哪一個字重音，所以做完以後用 WORLD 聲碼器（pyworld）改音高與音量：
#   文字裡在字前面加 + ＝ 重音（音高 ✕1.25、音量 ✕1.35），加 - ＝ 輕讀（音高 ✕0.86、音量 ✕0.7）。
#   每一個字佔多長：先把每一個字單獨唸一次量長度，照比例分（句尾的字多給一點）。
#   例："I'm +ten -years -old."
import numpy as np, re
def parse(marked):
    words=marked.split()
    plain=' '.join(w.lstrip('+-') if re.match(r'^[+-][A-Za-z]',w) else w for w in words)
    lv=[(1 if w.startswith('+') else -1 if re.match(r'^-[A-Za-z]',w) else 0) for w in words]
    return plain,[w.lstrip('+-') for w in words],lv
def has(marked): return bool(re.search(r'(^|\s)[+-][A-Za-z]',marked))
def apply(tts,sid,a,sr,marked):
    import pyworld as pw
    plain,ws,lv=parse(marked)
    a=np.asarray(a,dtype=np.float64)
    idx=np.where(np.abs(a)>0.01)[0]
    if not len(idx): return a
    s0,s1=idx[0],idx[-1]
    wd=[]
    for w in ws:
        x=np.array(tts.generate(re.sub(r'[^A-Za-z\']','',w) or w,sid=sid,speed=1.0).samples)
        j=np.where(np.abs(x)>0.01)[0]; wd.append((j[-1]-j[0]) if len(j) else len(x))
    wd[-1]*=1.15
    tot=sum(wd); b=[s0]; acc=0
    for d in wd: acc+=d; b.append(s0+int((s1-s0)*acc/tot))
    f0,t=pw.harvest(a,sr,frame_period=5.0); sp=pw.cheaptrick(a,f0,t,sr); ap=pw.d4c(a,f0,t,sr)
    fk=np.ones(len(f0)); gk=np.ones(len(a))
    FF={1:1.25,-1:0.86,0:1.0}; GG={1:1.35,-1:0.7,0:1.0}
    for k,l in enumerate(lv):
        if not l: continue
        lo,hi=b[k],b[k+1]
        fk[int(lo/sr*200):int(hi/sr*200)+1]=FF[l]; gk[lo:hi]=GG[l]
    # 平滑：不要一格一格跳（50 ms）
    fk=np.convolve(fk,np.ones(10)/10,'same'); gk=np.convolve(gk,np.ones(int(sr*.05))/int(sr*.05),'same')
    y=pw.synthesize(f0*fk,sp,ap,sr,frame_period=5.0)[:len(a)]
    if len(y)<len(a): y=np.pad(y,(0,len(a)-len(y)))
    y=y*gk
    m=np.max(np.abs(y)); 
    if m>0.98: y=y*0.98/m
    return y
