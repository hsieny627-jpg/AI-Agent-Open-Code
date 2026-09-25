# tools/tts_gen.py — 把一串文字做成 mp3（離線、神經語音）
#   英文：Kokoro（美式女聲 af_bella，Apache-2.0）
#   瑞典文：Piper sv_SE-nst（KBLab／瑞典國家圖書館用瑞典母語者錄音 NST 訓練，CC0）
# 用法：python3 tools/tts_gen.py ko|sv <speaker id> items.json <輸出資料夾>
#   items.json ＝ [[檔名, 文字], ...]；輸出 <檔名>.mp3 ＋ _dur.json（每個檔幾秒）
# 模型不放進 repo（太大）：環境變數 TTS_MODELS 指到放模型的資料夾，裡面要有
#   kokoro-en-v0_19/  與  vits-piper-sv_SE-nst-medium/
#   下載：https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models
#   需要：pip install sherpa-onnx lameenc numpy
import sys, json, sherpa_onnx, numpy as np, lameenc, os
T=os.environ.get('TTS_MODELS') or os.path.dirname(os.path.abspath(__file__))
def mk_ko():
    d=T+'/kokoro-en-v0_19'
    cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
        model=d+'/model.onnx',voices=d+'/voices.bin',tokens=d+'/tokens.txt',data_dir=d+'/espeak-ng-data'),num_threads=4))
    return sherpa_onnx.OfflineTts(cfg)
def mk_sv():
    d=T+'/vits-piper-sv_SE-nst-medium'
    onnx=[f for f in os.listdir(d) if f.endswith('.onnx')][0]
    cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(
        model=d+'/'+onnx,tokens=d+'/tokens.txt',data_dir=d+'/espeak-ng-data'),num_threads=4))
    return sherpa_onnx.OfflineTts(cfg)
def mp3(samples,sr,path):
    a=np.clip(np.array(samples),-1,1)
    # trim silence
    thr=0.01; idx=np.where(np.abs(a)>thr)[0]
    if len(idx): a=a[max(0,idx[0]-int(.03*sr)):min(len(a),idx[-1]+int(.08*sr))]
    pcm=(a*32767).astype(np.int16).tobytes()
    e=lameenc.Encoder();e.set_bit_rate(48);e.set_in_sample_rate(sr);e.set_channels(1);e.set_quality(2)
    open(path,'wb').write(e.encode(pcm)+e.flush())
    return len(a)/sr
if __name__=='__main__':
    kind,sid,items,outdir=sys.argv[1],int(sys.argv[2]),json.load(open(sys.argv[3])),sys.argv[4]
    tts=mk_ko() if kind=='ko' else mk_sv()
    res={}
    for key,text in items:
        au=tts.generate(text,sid=sid,speed=1.0)
        res[key]=round(mp3(au.samples,au.sample_rate,os.path.join(outdir,key+'.mp3')),3)
    json.dump(res,open(os.path.join(outdir,'_dur.json'),'w'))
    print('done',len(res))
