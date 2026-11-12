# tools/ph_exc.py — 2026-11-12 第四十七次 第 2-(3) 點：Phonics Master 的 字卡 組合 裡，哪些 是「真的 英文 字、但 唸法 跟 字卡 規則 不一樣」
#   （老師 標 # 的：#quad #wad #ward #word #said #good #hood #wood…）。依據 ＝ CMU Pronouncing Dictionary（卡內基美隆大學 美式 發音 字典，pip cmudict）。
#   字典 裡 有 這個 字，而且 字典 的 每 一種 唸法 都 跟 字卡 的 碼 不一樣 ＝ 例外 ➜ phonics/_exc.json（{拼字|碼: 字典 唸法}），字卡、遊戲 暫時 不放。
# 用法：node phonics/_enum.js && python3 tools/ph_exc.py
import json, os, re, cmudict
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
D = cmudict.dict()
ON = {'B': 'b', 'P': 'p', 'M': 'm', 'F': 'f', 'D': 'd', 'T': 't', 'N': 'n', 'L': 'l', 'K': 'k', 'HH': 'h', 'S': 's', 'JH': 'j', 'W': 'w', 'R': 'r', 'Z': 'z', 'G': 'g', 'CH': 'ch', 'SH': 'sh', 'TH': 'th', 'DH': 'dh'}
VO = {'AE': 'ae', 'EH': 'eh', 'IH': 'ih', 'AA': 'aa', 'AH': 'uh', 'EY': 'ai', 'IY': 'ee', 'OW': 'oa', 'UW': 'uu', 'UH': 'oo', 'AW': 'ou', 'ER': 'er', 'AO': 'aa'}   # AO（美式 多數 跟 /ɑ/ 合併）當 o
CO = {'B': 'b', 'P': 'p', 'M': 'm', 'F': 'f', 'D': 'd', 'T': 't', 'N': 'n', 'L': 'l', 'G': 'g', 'K': 'k', 'R': 'r', 'S': 's', 'Z': 'z', 'CH': 'ch', 'SH': 'sh', 'TH': 'th'}
def code(ph):
    p = [re.sub(r'\d', '', x) for x in ph]
    if not p: return None
    i = ''
    if p[:2] == ['K', 'W']: i = 'kw'; p = p[2:]
    elif p[0] in ON: i = ON[p.pop(0)]
    else: return None
    if not p: return None
    v = p.pop(0)
    if v in ('AA', 'AO') and p[:1] == ['R']: vv = 'ar' if v == 'AA' else 'or'; p = p[1:]
    elif v == 'AO' and p[:1] != ['R']: vv = 'aa'
    elif v in VO: vv = VO[v]
    else: return None
    if v == 'OW' and p[:1] == ['R']: vv = 'or'; p = p[1:]
    rest = ''.join(CO.get(x, '?' + x) for x in p)
    rest = {'ks': 'ks', 'mp': 'mp', 'nd': 'nd', 'nt': 'nt', 'shahn': 'shn', 'zhahn': 'zhn'}.get(rest, rest)
    if p in (['SH', 'AH', 'N'],): rest = 'shn'
    if p in (['ZH', 'AH', 'N'],): rest = 'zhn'
    return i + '-' + vv + ('-' + rest if rest else '')
A = json.load(open(os.path.join(ROOT, 'phonics', '_all.json'), encoding='utf8'))
exc = {}
for sp, c in A:
    w = sp.lower()
    k = w + '|' + c   # 同 一個 拼字、不同 的 卡（bar ＝ b＋ar 對、b＋a＋r 不對）分開 看
    if w not in D or k in exc: continue
    cs = [code(x) for x in D[w]]
    if c in cs: continue
    exc[k] = ' '.join(re.sub(r'\d', '', x) for x in D[w][0])
json.dump(exc, open(os.path.join(ROOT, 'phonics', '_exc.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=0, sort_keys=True)
print('真的 字 但是 唸法 不一樣：', len(exc), '個；例：', ', '.join(sorted(exc)[:60]))
