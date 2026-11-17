# tools/ph_gen2_same.py — 從 ph_gen2.py 抽 出來 的「聽寫 聽到 的 ＝ 要 的 字 嗎」（ph_gen57.py 共用）
import re, asr_lib, cmudict
CMU = cmudict.dict()
def prons(w): return {' '.join(re.sub(r'\d', '', x) for x in p) for p in CMU.get(w, [])}
def same(heard, want):
    h = re.sub(r"[^a-z' ]", '', heard.lower()).strip()
    h = asr_lib.NUM.get(h, h) if hasattr(asr_lib, 'NUM') else h
    for k, v in getattr(asr_lib, 'NUM', {}).items():
        if re.sub(r'[^0-9]', '', heard) == k: h = v
    if h == want: return True
    if h and all(x == want for x in h.split()): return True   # 聽寫 重複 兩次（spat spat）＝ 對
    if h.replace(' ', '') == want.replace(' ', ''): return True
    a, b = prons(h), prons(want)
    return bool(a & b)
