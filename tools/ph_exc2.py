# tools/ph_exc2.py — 2026-11-12 第四十八次：Phonics Master 例外 字（老師：A 不放 ＋ 真的 音檔 ＋ 真的 雙語 注音；甲＋乙 都 要）
#   依據 ＝ CMU Pronouncing Dictionary（pip cmudict）＋ 常見 程度 wordfreq（Zipf 分數；3 ＝ 每 一百萬 字 出現 約 1 次）
#   輸入：phonics/_all.json（原本 字卡）、phonics/_all2.json（基礎版、進階版）
#   輸出：phonics/_excshow.json  {拼字|碼: [字典 唸法, Zipf]}  ＝ 常見（Zipf ≧ 3.3、一般 字典 有 的 小寫 字、三個 字母 以上、不在 人工 挑掉 的 NO）而且 雙語 注音 寫得 出來 ➜ 字卡 放回去、唸 真的、寫 真的 注音、標 ⚠ 例外；例外 字 清單 頁
#         phonics/_exc2.json    {拼字|碼: 字典 唸法}       ＝ 基礎版、進階版 的 例外 字 但 不 常見（字典 裡 的 人名、罕見 字）➜ 照舊 不放
#         phonics/_realreg.json [[碼, 字, Zipf]]           ＝ 照 規則 唸 的 真的 字（Zipf ≧ 2.5）➜ tools/ph_gen2.py 用 電腦 聽寫 檢查（big 不可以 聽起來 像 beg）
import json, os, re, cmudict
from wordfreq import zipf_frequency
from english_words import get_english_words_set
WEB2 = get_english_words_set(['web2'], lower=False)   # 一般 英文 字典 小寫 的 字（人名、地名 是 大寫，不算）
# 人工 挑掉：罕見、縮寫、外來 字、不雅、喝酒、身體 部位、髒話 邊緣（學生 字卡 不放）
NO = set('bach beer boob breast butch cha che chi cho coo cor coup dar dow foo git kai las loch loo mar mas mir par phi poop quo ruth sha shi sur tai tar tech thee tho thou thug tor wat womb queer wont wan wharf whom boar boon loom sheer per peer hind'.split())
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
D = cmudict.dict()
ON1 = {'B': 'b', 'P': 'p', 'M': 'm', 'F': 'f', 'D': 'd', 'T': 't', 'N': 'n', 'L': 'l', 'K': 'k', 'HH': 'h', 'S': 's', 'JH': 'j', 'W': 'w', 'R': 'r', 'Z': 'z', 'G': 'g',
       'CH': 'ch', 'SH': 'sh', 'TH': 'th', 'DH': 'dh', 'V': 'v', 'Y': 'y'}
ONS = {('K', 'W'): 'kw', ('B', 'L'): 'bl', ('K', 'L'): 'kl', ('F', 'L'): 'fl', ('P', 'L'): 'pl', ('S', 'L'): 'sl', ('B', 'R'): 'br', ('K', 'R'): 'kr', ('D', 'R'): 'dr',
       ('F', 'R'): 'fr', ('G', 'R'): 'gr', ('P', 'R'): 'pr', ('T', 'R'): 'tr', ('S', 'K'): 'sk', ('S', 'M'): 'sm', ('S', 'N'): 'sn', ('S', 'P'): 'sp', ('S', 'T'): 'st',
       ('S', 'W'): 'sw', ('S', 'K', 'R'): 'skr', ('S', 'P', 'L'): 'spl', ('S', 'P', 'R'): 'spr', ('S', 'T', 'R'): 'str'}
VO = {'AE': 'ae', 'EH': 'eh', 'IH': 'ih', 'AA': 'aa', 'AH': 'uh', 'EY': 'ai', 'IY': 'ee', 'OW': 'oa', 'UW': 'uu', 'UH': 'oo', 'AW': 'ou', 'ER': 'er', 'AO': 'aa', 'AY': 'ii'}
CO = {'B': 'b', 'P': 'p', 'M': 'm', 'F': 'f', 'D': 'd', 'T': 't', 'N': 'n', 'L': 'l', 'G': 'g', 'K': 'k', 'R': 'r', 'S': 's', 'Z': 'z', 'CH': 'ch', 'SH': 'sh', 'TH': 'th', 'NG': 'ng'}
CL = {'ks': 'ks', 'mp': 'mp', 'nd': 'nd', 'nt': 'nt', 'st': 'st', 'sk': 'sk', 'ft': 'ft', 'ngk': 'nk'}
def code(ph):
    p = [re.sub(r'\d', '', x) for x in ph]
    k = 0
    while k < len(p) and p[k] not in VO: k += 1
    if k >= len(p): return None
    on, p = tuple(p[:k]), p[k:]
    if not on: i = '0'
    elif len(on) == 1 and on[0] in ON1: i = ON1[on[0]]
    elif on in ONS: i = ONS[on]
    elif len(on) >= 2 and on[-1] == 'Y' and p[0] == 'UW':   # cute ＝ K Y UW T
        rest = on[:-1]; i = ON1.get(rest[0]) if len(rest) == 1 else ONS.get(rest)
        if not i: return None
        p = ['YU'] + p[1:]
    else: return None
    v = p.pop(0)
    if v == 'YU': vv = 'yu'
    elif v in ('AA', 'AO') and p[:1] == ['R']: vv = 'ar' if v == 'AA' else 'or'; p = p[1:]
    elif v == 'OW' and p[:1] == ['R']: vv = 'or'; p = p[1:]
    elif v in VO: vv = VO[v]
    else: return None
    if any(x in VO for x in p): return None
    rest = ''.join(CO.get(x, '?' + x) for x in p)
    rest = CL.get(rest, rest)
    if p in (['SH', 'AH', 'N'],): rest = 'shn'
    if p in (['ZH', 'AH', 'N'],): rest = 'zhn'
    return i + '-' + vv + ('-' + rest if rest else '')
OKPH = {'B', 'P', 'M', 'F', 'D', 'T', 'N', 'L', 'K', 'G', 'HH', 'S', 'Z', 'JH', 'CH', 'SH', 'TH', 'DH', 'W', 'R', 'Y', 'V', 'NG',
        'AE', 'EH', 'IH', 'AA', 'AO', 'AH', 'EY', 'IY', 'OW', 'UW', 'UH', 'AW', 'AY', 'ER'}
def mappable(ph):
    b = [re.sub(r'\d', '', x) for x in ph]
    return all(x in OKPH for x in b) and sum(1 for x in b if x in VO) == 1
A1 = json.load(open(os.path.join(ROOT, 'phonics', '_all.json'), encoding='utf8'))
A2 = json.load(open(os.path.join(ROOT, 'phonics', '_all2.json'), encoding='utf8'))
show, exc2, reg = {}, {}, {}
for rows, new in ((A1, False), (A2, True)):
    for r in rows:
        sp, c = r[0], r[1]; w = sp.lower(); k = w + '|' + c
        if w not in D: continue
        cs = [code(x) for x in D[w]]
        z = zipf_frequency(w, 'en')
        if c in cs:
            if z >= 2.5 and (c not in reg or reg[c][1] < z): reg[c] = [w, z]
            continue
        ph = ' '.join(D[w][0])
        if z >= 3.3 and w in WEB2 and len(w) >= 3 and w not in NO and mappable(D[w][0]): show[k] = [ph, round(z, 2)]
        elif new: exc2[k] = ph
json.dump(show, open(os.path.join(ROOT, 'phonics', '_excshow.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=0, sort_keys=True)
json.dump(exc2, open(os.path.join(ROOT, 'phonics', '_exc2.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=0, sort_keys=True)
json.dump(sorted([[c, v[0], round(v[1], 2)] for c, v in reg.items()]), open(os.path.join(ROOT, 'phonics', '_realreg.json'), 'w', encoding='utf8'), ensure_ascii=False)
print('例外 字 放回 字卡（常見）：', len(show), '；不 常見 不放（新 字卡）：', len(exc2), '；照 規則 的 真的 字：', len(reg))
print(sorted(show)[:80])
# 🔮 魔法 咒語（沒有 意思 的 練習 字，給 拉霸機 等 遊戲）：子音＋短 母音＋子音，一般 字典（web2）沒有、不是 常見 人名、wordfreq 很少 見（Zipf ＜ 2.5）
#   c、g 只 在 a o u 前面、k 只 在 e i 前面（英文 拼字 習慣）；字尾 b d g m n p t x
ONP = 'b p m f d t n l h j w r s z c g k'.split(); VS5 = 'aeiou'; COP = 'b d g m n p t x'.split()
BADC = set(json.load(open(os.path.join(ROOT, 'phonics', '_badc.json'), encoding='utf8'))) if os.path.exists(os.path.join(ROOT, 'phonics', '_badc.json')) else set()
IC = {'c': 'k', 'g': 'g', 'k': 'k', 'j': 'j'}; VC2 = {'a': 'ae', 'e': 'eh', 'i': 'ih', 'o': 'aa', 'u': 'uh'}; EC = {'x': 'ks'}
pse = []
for i in ONP:
    for v in VS5:
        if i in ('c', 'g') and v not in 'aou': continue
        if i == 'k' and v not in 'ei': continue
        for e in COP:
            w = i + v + e; c = IC.get(i, i) + '-' + VC2[v] + '-' + EC.get(e, e)
            z = zipf_frequency(w, 'en')
            if w in WEB2 or (w.capitalize() in WEB2 and z >= 1.8) or z >= 2.5 or c in BADC: continue   # 一般 字典 的 字、常見 人名、常見 字 都 不算 咒語
            pse.append([w, c])
json.dump(pse, open(os.path.join(ROOT, 'phonics', '_pseudo.json'), 'w', encoding='utf8'))
print('魔法 咒語（不是 真的 字）：', len(pse), '個')
