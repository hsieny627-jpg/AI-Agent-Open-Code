// 產生 listen/2026-10-11_B3/index.html（第三輪：R2 註明、R6 建議、R10 按鈕圖示和位置；第一、二輪在 r1.html、r2.html）
const fs=require('fs');const {GIRL,BOY}=require('./_icons');
const css=fs.readFileSync(__dirname+'/r1.html','utf8').match(/<style>([\s\S]*?)<\/style>/)[1]+`
.zh{font-size:34px;font-weight:700;color:#FFE9A8}
.vx{display:inline-flex;border:3px solid #FFD54A;border-radius:16px;overflow:hidden;background:#101820;vertical-align:middle}
.vx b{display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:20px;line-height:1.1;color:#9AA7B3;padding:6px 14px;min-height:64px}
.vx b i{font-size:40px;font-style:normal;line-height:1}
.vx b.on{background:#FFD54A;color:#111}
.ics{display:flex;gap:28px;align-items:center;flex-wrap:wrap;margin:10px 0 0 20px;font-size:80px;line-height:1}
.ics small{font-size:22px;display:block;text-align:center;color:#B9C4CE}
.tx{font-size:30px;font-weight:700;padding:6px 16px;border-radius:12px}
.scr{border:3px solid #3A4650;border-radius:14px;padding:10px;margin:10px 0 0 20px;max-width:640px;background:#000}
.scr .cd{height:150px;border:2px solid #2A3540;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:700;color:#555}
.scr .bar{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:10px;font-size:16px}
.scr .bar span{border:2px solid #3A4650;border-radius:10px;padding:4px 8px;color:#9AA7B3}
.scr .bar span.say{border-color:#CFE6FF;color:#fff;font-size:20px;font-weight:700}
.scr .bar span.vv{border:3px solid #FFD54A;color:#111;background:#FFD54A;font-weight:700}
.scr .tr{display:flex;justify-content:flex-end;margin-bottom:6px}`;
const vx=(on)=>`<span class="vx"><b class="${on?'':'on'}"><i>${GIRL}</i>女聲</b><b class="${on?'on':''}"><i>${BOY}</i>男聲</b></span>`;
const bar=(where)=>`<div class="scr">${where==='tr'?'<div class="tr"><span class="vx" style="transform:scale(.7);transform-origin:right"><b class="on"><i>'+GIRL+'</i>女聲</b><b><i>'+BOY+'</i>男聲</b></span></div>':''}<div class="cd">字卡（中央重點）</div><div class="bar"><span>目次</span><span>音節</span><span>放慢</span>${where==='say'?'<span class="vv">👧👦 女聲｜男聲</span>':''}<span class="say">🔊 唸 1 次</span><span>唸 3 次</span><span>自動播放</span><span>出處</span><span>首頁</span>${where==='end'?'<span class="vv">👧👦 女聲｜男聲</span>':''}</div></div>`;
const Q=(n,t,ops,extra)=>`<h2>${n}　${t}</h2>${extra||''}<div class="q">${ops.map((o,k)=>'<span class="op">'+(k?'':'<span class="rec">⭐ </span>')+'<b>'+'①②③'[k]+'</b> '+o+'</span>').join('')}</div>`;
const h=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>B3 第三輪確認</title><style>${css}</style></head><body>
<h1>B3 第三輪：最後確認</h1>
<p>老師第二輪的回覆已經記下來（R2 ②、R8 加職業單字網站、暖身題／複習題／遊戲不做男聲、其餘照建議）。<br>
還有 4 題要請老師選。可以回覆「全部照建議」，或寫「T3 選 ②」。前兩輪：<a href="r1.html" style="color:#7FD4FF">第一輪</a>、<a href="r2.html" style="color:#7FD4FF">第二輪</a>。</p>
<h2>🎧 先聽男聲</h2>
<p>男聲試聽頁（13 個字和句子，女聲 vs 男聲）：<br><a style="color:#7FD4FF;font-size:28px" href="../2026-10-11_B3m/">https://hsieny627-jpg.github.io/AI-Agent-Open-Code/listen/2026-10-11_B3m/</a></p>
${Q('T1','R2「一般翻譯成『手遊』」寫在哪裡？',[
 '兩個地方：<br>‧ 單字卡第 ② 幕：mobile「手機的」、games「遊戲」，下面括號寫 <span class="zh">一般說：手遊</span><br>‧ 句子裡（單字卡第 ③ 幕、句型卡、選單字頁）：每個字下面放直譯，整句中文寫 <span class="zh">我 喜歡 玩 手遊。</span>（整句就是一般的說法）',
 '每一個出現 mobile games 的地方，字的下面都再多一行小字「一般說：手遊」'])}
<h2>T2　R6 老師問我的建議：暖身題、複習題、遊戲裡的中文句子要不要也空格？</h2>
<table><tr><th>我的建議：② 也要空格</th></tr>
<tr><td>1. <b>一樣才不會混亂</b>：學生在句型卡看到「他 是 我的 爸爸。」，到了遊戲又看到「他是我的爸爸。」，會以為是兩種寫法。</td></tr>
<tr><td>2. <b>空格就是在教英文</b>：一個中文詞對一個英文字，學生做題目時也在練習「他 ＝ He、是 ＝ is、我的 ＝ my」。</td></tr>
<tr><td>3. <b>只改「整句翻譯」</b>：例「他 是 我的 爸爸。」英文是？選項「他 是 一位 醫生。」。<b>說明文字不改</b>（例：問 he 就答 He、意思一模一樣，只是說得比較快）。</td></tr>
<tr><td>4. 要注意：Kahoot 匯入檔（從同一份題目做出來的）也會跟著變成有空格；遊戲畫面每一題都會量過，一行放得下才交。</td></tr></table>
<div class="q"><span class="op"><span class="rec">⭐ </span><b>①</b> 照建議：暖身題、複習題、遊戲（含 Kahoot 匯入檔）裡的<b>整句翻譯</b>也空格，說明文字不改</span><span class="op"><b>②</b> 暖身題、複習題、遊戲都不改</span></div>
<h2>T3　男聲／女聲按鈕的圖示</h2>
<p>👩 在 iPad 上是短頭髮，不像女生。下面三種選一種：</p>
<div class="q">
<span class="op"><span class="rec">⭐ </span><b>①</b> 自己畫的圖（每一台 iPad、觸控螢幕都長一樣）：女生長頭髮＋粉紅蝴蝶結、男生短頭髮<div class="ics"><span>${GIRL}<small>女聲</small></span><span>${BOY}<small>男聲</small></span></div></span>
<span class="op"><b>②</b> 表情符號 👧 👦（每一台機器長得不一樣；iPad 的 👧 是綁兩條辮子）<div class="ics"><span>👧<small>女聲</small></span><span>👦<small>男聲</small></span></div></span>
<span class="op"><b>③</b> 只有字和顏色：<span class="tx" style="background:#FFD6E5;color:#111">女聲</span>　<span class="tx" style="background:#CFE6FF;color:#111">男聲</span></span>
</div>
<h2>T4　按鈕的樣子和位置（不可以擋到字卡中央）</h2>
<p><b>樣子</b>：兩個選項<b>並排</b>，選到的那一個<b>亮黃色</b>，一眼看得出現在是誰在唸：</p>
<div style="margin:6px 0 0 20px">${vx(0)}　➜ 按「男聲」 ➜　${vx(1)}</div>
<p class="small">（不是只有一顆、按了才換圖：那樣看不出來另一個選項在哪裡）</p>
<p><b>位置</b>：</p>
<div class="q">
<span class="op"><span class="rec">⭐ </span><b>①</b> 按鈕列裡、〔🔊 唸 1 次〕的正左邊：跟「唸」的按鈕放在一起，要聽聲音的時候眼睛本來就看這裡；字卡上面完全不放東西${bar('say')}</span>
<span class="op"><b>②</b> 畫面右上角（句型網站上面有一排分頁，iPad 直放時可能會擠在一起）${bar('tr')}</span>
<span class="op"><b>③</b> 按鈕列最右邊${bar('end')}</span>
</div>
<p>每一頁都會用 iPad 橫放、直放兩種大小量過：按鈕 ≧ 48 點、不擋字卡、不擠到別的按鈕。</p>
</body></html>`;
fs.writeFileSync(__dirname+'/index.html',h);
