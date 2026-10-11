# tools/asr_lib.py — 語音辨識（Whisper small.en，sherpa-onnx 離線）共用的小工具：asr_check.py（驗證）和 tts_gen.py（做語音檔時當場聽一次）都用
import os, re, numpy as np, sherpa_onnx
M = os.environ.get('ASR_MODEL') or os.path.join(os.environ.get('TTS_MODELS', ''), 'sherpa-onnx-whisper-small.en')
def available(): return os.path.exists(os.path.join(M, 'small.en-encoder.int8.onnx'))
_R = None
def rec():
    global _R
    if _R is None:
        _R = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=M + '/small.en-encoder.int8.onnx', decoder=M + '/small.en-decoder.int8.onnx',
                                                        tokens=M + '/small.en-tokens.txt', num_threads=4)
    return _R
def hear(a, sr):
    # 前後各 0.6 秒靜音：一個字太短，辨識會聽不準
    a = np.asarray(a, dtype=np.float32); pad = np.zeros(int(sr * .6), dtype=np.float32)
    st = rec().create_stream(); st.accept_waveform(sr, np.concatenate([pad, a, pad])); rec().decode_stream(st)
    return st.result.text.strip()
NUM = {'0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
       '10': 'ten', '11': 'eleven', '12': 'twelve', '13': 'thirteen', '14': 'fourteen', '15': 'fifteen', '16': 'sixteen', '17': 'seventeen',
       '18': 'eighteen', '19': 'nineteen', '20': 'twenty', '30': 'thirty', '40': 'forty', '50': 'fifty', '60': 'sixty', '70': 'seventy',
       '80': 'eighty', '90': 'ninety', '100': 'one hundred', '24': 'twenty four', '1066': 'ten sixty six'}
SAME = [{'two', 'to', 'too'}, {'son', 'sun'}, {'four', 'for'}, {'eight', 'ate'}, {'one', 'won'}, {'i', 'eye'}, {'you', 'u'},
        {'whos', 'whose'}, {'hi', 'high'}, {'tv', 'tvs'}, {'mom', 'mum'}, {'okay', 'ok'}, {'youre', 'your'},
        {'lego', 'legos'}, {'pokemon', 'pokémon'}, {'write', 'right'}, {'park', 'part'}, {'kart', 'cart'}, {'tea', 't'}, {'see', 'c'},
        {'taekwondo', 'tae kwon do'}, {'by', 'bye'}, {'aunt', 'ant'},
        {'auntie', 'anti'}]   # 2026-10-11：auntie 和 anti 美式同音 /ˈænti/（Merriam-Webster），聽寫寫成 anti 不算錯
CANON = {}
for g in SAME:
    k = sorted(g)[0]
    for w in g: CANON[w] = k
def norm(s):
    s = s.lower().replace('’', "'").replace('-', ' ')
    s = re.sub(r"\d+", lambda m: NUM.get(m.group(0), m.group(0)), s)
    s = re.sub(r"[^a-zé' ]+", ' ', s).replace("'", '')
    s = ' '.join(s.split())
    for k in sorted(CANON, key=len, reverse=True):
        s = re.sub(r'\b' + re.escape(k) + r'\b', CANON[k], s)
    return ' '.join(s.split())
LEX = set()
_lx = os.path.join(os.environ.get('TTS_MODELS', ''), 'kokoro-multi-lang-v1_0', 'lexicon-us-en.txt')
if os.path.exists(_lx):
    for l in open(_lx, encoding='utf8'): LEX.add(l.split(' ', 1)[0])
def english(k):
    # 只驗英文：每一個字都要在 Kokoro 的美式英文字典裡（德文、拉丁文、古英文、拆開的字母群不驗）
    ws = re.sub(r"[^a-zé' ]+", ' ', k.lower().replace('’', "'")).split()
    ok = lambda w: w.strip("'") in LEX or w.split("'")[0] in LEX   # what's、who's：前半在字典裡就算
    return bool(ws) and (not LEX or all(ok(w) for w in ws)) and len(re.sub(r'[^a-z]', '', k.lower())) >= 2
