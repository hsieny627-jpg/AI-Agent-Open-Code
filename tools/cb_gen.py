# tools/cb_gen.py — Chatterbox（Resemble AI，MIT 授權）試聽用（B3 盲聽，2026-10-11）。安裝：python3 -m venv cb; cb/bin/pip install --index-url https://download.pytorch.org/whl/cpu torch torchaudio; cb/bin/pip install chatterbox-tts
# 用法：cb/bin/python tools/cb_gen.py 清單.json 輸出資料夾 [seed]；清單一格 ＝ [檔名, 英文, 聲音樣本 wav（null ＝ 內建女聲）]。男聲樣本 ＝ HiFi-Captain 男聲唸的兩句（4 核 CPU 一句約 9 秒）
import sys,json,torch,torchaudio as ta
from chatterbox.tts import ChatterboxTTS
torch.manual_seed(int(sys.argv[3]) if len(sys.argv)>3 else 0)
m=ChatterboxTTS.from_pretrained(device='cpu')
items=json.load(open(sys.argv[1])); out=sys.argv[2]
for key,text,prompt in items:
    w=m.generate(text,audio_prompt_path=prompt) if prompt else m.generate(text)
    ta.save(out+'/'+key+'.wav',w,m.sr); print(key,flush=True)
