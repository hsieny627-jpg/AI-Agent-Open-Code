# tools/stress.py — 句子重音（使用者 2026-09-26 指定）
#   ten 是 content word：音高比較高、比較大聲（stressed）；years old 是 function words：唸得比較輕（unstressed）。
#   神經語音（Kokoro）沒辦法指定哪一個字重音，所以做完以後用 WORLD 聲碼器（pyworld）改音高與音量：
#   文字裡在字前面加 + ＝ 重音（音高 ✕1.25、音量 ✕1.35），加 - ＝ 輕讀（音高 ✕0.86、音量 ✕0.7）。
#   每一個字佔多長：先把每一個字單獨唸一次量長度，照比例分（句尾的字多給一點）。
#   例："I'm +ten -years -old."
#   2026-09-27 使用者：years、old 都是輕聲，接近中文的三聲（低、平）；old 不可以唸成四聲（高往下掉）。
#   ➜ 新記號 ~ ＝ 低平：那一段的音高整段壓到「全句中位數 ✕ 0.80」並拉平（不往下掉）、音量 ✕ 0.75。
#   例："I'm +ten ~years ~old."
#   2026-10-04 使用者：三年級的數字音高稍微調低、男聲 old 收尾不自然、女聲單獨唸 years old 的 old 太弱、
#   四年級 He is my father. 的 my 唸輕、Is he a doctor? 句尾上揚 ➜ 新記號（舊的照舊，舊檔不用重做）：
#     ^ ＝ 溫和的重音（音高 ✕1.12、音量 ✕1.2；數字用這個）
#     % ＝ 溫和的低平（音高拉平到「全句中位數 ✕ 0.92」、音量 ✕0.9；男聲壓到 ✕0.80 會變成氣泡音，聽起來不自然）
#     ! ＝ 大聲一點（音高不變、音量 ✕2.0；女聲單獨唸 years old，old 只有 years 的 1/4 大聲）
#     / ＝ 句尾上揚（那一個字的音高直接畫成「全句中位數 ✕0.95 ➜ ✕1.45」一路往上）
#   2026-10-07 使用者：男聲 years old 的 old 聽起來像「機器人結束的聲音」，要唸得更輕、更接近注音三聲或輕聲
#     原因：% 把 old 的音高「拉平」成一條直線，聲碼器再合成就像機器人。
#     & ＝ 輕聲：保留原本自然的音高起伏（不拉平），整段音高 ✕0.90（低一點，像三聲）、音量 ✕0.55，
#          最後 40% 慢慢收小（不是一下子切掉）
#   2026-10-10 使用者：Is he a teacher? 的 cher 語調不自然（/ 把最後 35% 畫成一條直線拉到 ✕1.45，cher 一下子衝上去、又沒有自然的起伏）
#     Kokoro 自己唸是非問句句尾會往下掉（量過 0.8～0.95），所以還是要改音高，但改成自然的「低升調」：
#     @ ＝ 是非問句的句尾：從最後一個字的開頭（重音 TEA）慢慢往上、愈到後面升得愈快，最後到「全句中位數 ✕1.28」；
#          保留原本音高的小起伏（只改大方向，不畫直線），不會像機器
import numpy as np, re
MK=r'[+~\-^%!/&@]'
CODE={'+':1,'-':-1,'~':2,'^':3,'%':4,'!':5,'/':6,'&':7,'@':8}
def parse(marked):
    words=marked.split()
    lv=[(CODE[w[0]] if re.match(r'^'+MK+r'[A-Za-z]',w) else 0) for w in words]
    plain=' '.join(w[1:] if re.match(r'^'+MK+r'[A-Za-z]',w) else w for w in words)
    return plain,[(w[1:] if re.match(r'^'+MK+r'[A-Za-z]',w) else w) for w in words],lv
def has(marked): return bool(re.search(r'(^|\s)'+MK+r'[A-Za-z]',marked))
def apply(tts,sid,a,sr,marked,speed=1.0):
    import pyworld as pw
    plain,ws,lv=parse(marked)
    a=np.asarray(a,dtype=np.float64)
    idx=np.where(np.abs(a)>0.01)[0]
    if not len(idx): return a
    s0,s1=idx[0],idx[-1]
    wd=[]
    for w in ws:
        x=np.array(tts.generate(re.sub(r'[^A-Za-z\']','',w) or w,sid=sid,speed=speed).samples)
        j=np.where(np.abs(x)>0.01)[0]; wd.append((j[-1]-j[0]) if len(j) else len(x))
    wd[-1]*=1.15
    tot=sum(wd); b=[s0]; acc=0
    for d in wd: acc+=d; b.append(s0+int((s1-s0)*acc/tot))
    f0,t=pw.harvest(a,sr,frame_period=5.0); sp=pw.cheaptrick(a,f0,t,sr); ap=pw.d4c(a,f0,t,sr)
    fk=np.ones(len(f0)); gk=np.ones(len(a)); rise=[]; lr=[]
    FF={1:1.25,-1:0.86,0:1.0,3:1.12,5:1.0,7:0.90}; GG={1:1.35,-1:0.7,0:1.0,2:0.75,3:1.2,4:0.9,5:2.0,6:1.0,7:0.55,8:1.0}
    voiced=f0[f0>0]; med=(np.median(voiced) if len(voiced) else 180.0); low=med*0.80
    for k,l in enumerate(lv):
        if not l: continue
        lo,hi=b[k],b[k+1]
        i0,i1=int(lo/sr*200),min(len(f0),int(hi/sr*200)+1)
        if l==2 or l==4:   # 低平：目標音高 ÷ 原本音高 ＝ 這一格要乘多少（原本沒有聲帶振動的格子不動）
            tg=low if l==2 else med*0.92
            seg=f0[i0:i1]; fk[i0:i1]=np.where(seg>0,tg/np.maximum(seg,1),1.0)
        elif l==6:   # 句尾上揚：那一個字的音高直接畫成「全句中位數 ✕0.95 ➜ ✕1.45」一路往上（不管原本往上還往下；下面平滑以後才蓋上去）
            rise.append((i0,i1))
        elif l==8: lr.append((i0,i1))
        else: fk[i0:i1]=FF[l]
        gk[lo:hi]=GG[l]
        if l==7:   # 輕聲：最後 40% 慢慢收小
            n=hi-lo; f=int(n*.4)
            if f>0: gk[hi-f:hi]=GG[l]*np.linspace(1.0,0.35,f)
    # 平滑：不要一格一格跳（50 ms）
    fk=np.convolve(fk,np.ones(10)/10,'same'); gk=np.convolve(gk,np.ones(int(sr*.05))/int(sr*.05),'same')
    f1=f0*fk
    if rise:   # 句尾上揚：用「真的有聲帶振動」的最後一段（不靠估的字長，估的常常差好幾格）：最後 35% 從原本的音高一路升到全句中位數 ✕1.45
        vi=np.where(f0>0)[0]; v0,v1=vi[0],vi[-1]; st=max(v0,v1-max(30,int((v1-v0)*.35)))
        fs=np.median(f1[st:st+6][f1[st:st+6]>0]) if (f1[st:st+6]>0).any() else med
        tg=np.linspace(fs,med*1.45,v1-st+1); f1[st:v1+1]=np.where(f0[st:v1+1]>0,tg,0)
    if lr:   # 低升調：最後一個字開頭的音高 ➜ 全句中位數 ✕1.28；曲線 ＝ 慢慢起步、後面升得快（t^1.6）；原本的小起伏照留
        vi=np.where(f0>0)[0]; i0=lr[0][0]; vv=vi[vi>=i0]
        if len(vv)>4:
            st,en=vv[0],vv[-1]
            sm=np.copy(f1); vz=f1>0
            k=9; tr=np.convolve(np.where(vz,f1,0),np.ones(k),'same')/np.maximum(np.convolve(vz.astype(float),np.ones(k),'same'),1e-6)
            fs=float(np.median(f1[st:st+8][f1[st:st+8]>0])); fs=min(fs,med*1.0)
            x=np.linspace(0,1,en-st+1)**1.6; goal=fs+(med*1.28-fs)*x
            seg=slice(st,en+1); ratio=np.where(vz[seg]&(tr[seg]>0),goal/np.maximum(tr[seg],1),1.0)
            f1[seg]=np.where(vz[seg],f1[seg]*ratio,0)
    y=pw.synthesize(f1,sp,ap,sr,frame_period=5.0)[:len(a)]
    if len(y)<len(a): y=np.pad(y,(0,len(a)-len(y)))
    y=y*gk
    m=np.max(np.abs(y)); 
    if m>0.98: y=y*0.98/m
    return y
