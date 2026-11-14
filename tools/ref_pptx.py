import zipfile, re, sys, os, html
decks=[('8b402e83','G3 A～Z 第1份'),('082097b7','G3 A～Z 第2份'),('69410874',"G3 L1 What's your name?"),('792eec4a','G3 L2 How old are you?'),
('2e7ebbea','G3 L3 第1份（tall short strong thin）'),('5e578763','G3 L3 第2份'),('7ca4d546','G3 L4 Are You Happy?'),
('f3ccbe6d',"G4 L1 Who's he?"),('68771ac4','G4 L2 Is he a doctor?'),('00e56b78',"G4 L3 Where's He?"),('fdb7d00f','G4 L4 Do you have a dog?'),
('1de69a0e','SoR 44 個音 第1份'),('df780ce0','SoR 44 個音 第2份'),('b7414c49','Rhythm & Stress')]
U=sys.argv[1]; out=sys.argv[2]
def key(n): return int(re.search(r'(\d+)',n).group(1))
o=open(out,'w')
o.write('# 老師 上課 pptx 逐頁 文字＋備忘稿（給 AI 讀；原始檔 在 老師 Google 雲端硬碟「英語教學網站 原始檔（2026-11-14 第五十三次 對話）」）\n\n')
o.write('> 自動 從 pptx 抽出 每一頁 的 文字（`tools/ref_pptx.py`）。連續 一樣 的 頁 合併 成「第 a～b 頁」。沒有 文字 的 頁（只有 圖 或 動畫）寫「（圖）」。圖 本身 沒有 放 進 網站（有 課本 出版社 的 圖）。\n\n')
for p,name in decks:
    z=zipfile.ZipFile(os.path.join(U,p+'.pptx'))
    sl=sorted([n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$',n)],key=key)
    o.write('## %s（%d 頁）\n\n'%(name,len(sl)))
    prev=None; start=None; rows=[]
    for n in sl:
        x=z.read(n).decode('utf8','ignore')
        paras=[]
        for para in re.findall(r'<a:p>(.*?)</a:p>',x,re.S):
            t=''.join(re.findall(r'<a:t>([^<]*)</a:t>',para)); t=html.unescape(t).strip()
            if t: paras.append(re.sub(r'\s+',' ',t))
        t=' ／ '.join(paras) or '（圖）'
        rel='ppt/slides/_rels/'+n.split('/')[-1]+'.rels'
        if rel in z.namelist():
            m=re.search(r'Target="\.\./notesSlides/(notesSlide\d+\.xml)"',z.read(rel).decode('utf8','ignore'))
            if m:
                nt=' '.join(t2 for t2 in (html.unescape(x).strip() for x in re.findall(r'<a:t>([^<]*)</a:t>',z.read('ppt/notesSlides/'+m.group(1)).decode('utf8','ignore'))) if t2 and not t2.isdigit())
                if nt: t+='　〔備忘稿：'+re.sub(r'\s+',' ',nt)[:600]+'〕'
        if t==prev: rows[-1][1]=key(n); continue
        rows.append([key(n),key(n),t]); prev=t
    for a,b,t in rows:
        o.write('- %s：%s\n'%(('第 %d 頁'%a) if a==b else ('第 %d～%d 頁'%(a,b)), t[:400]))
    o.write('\n')
