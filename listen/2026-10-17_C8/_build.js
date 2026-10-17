// listen/2026-10-17_C8/ — 老師看完 C6、C7 以後的問題頁（node listen/2026-10-17_C8/_build.js ➜ index.html）
// 頒獎典禮 ＝ 老師看板同一份程式（score/_cer.css、_cer_rt.js）；角色 ＝ 老師上傳的圖切好的 rpg/chars/
const fs = require('fs'), path = require('path'), R = p => fs.readFileSync(path.join(__dirname, '../../score', p), 'utf8');
const CERCSS = R('_cer.css'), CERRT = R('_cer_rt.js'), HONRT = R('_honor_rt.js');
const B = n => 'b' + String(n).padStart(2, '0'), G = n => 'g' + String(n).padStart(2, '0');
const opt = (k, hd, why, rec) => `<div class="opt${rec ? ' rec' : ''}"><div class="hd"><span class="k">${k}</span>${hd}${rec ? '<span class="tag">建議</span>' : ''}</div>${why ? '<div class="why">' + why + '</div>' : ''}</div>`;
let QN = 0; const q = (t, body) => `<div class="q"><div class="t"><span class="no">${++QN}</span>${t}</div>${body}</div>`;
const html = `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>動畫、角色、現場任務 C8</title>
<style>
@font-face{font-family:Andika;src:url(../../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#05070A;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 140px;font-size:26px;line-height:1.55;font-weight:700}
.wrap{max-width:1180px;margin:0 auto}
h1{font-size:42px;color:#FFD54A;margin:22px 0 6px}
h2{font-size:36px;color:#FFD54A;margin:56px 0 10px;border-top:4px solid #24303C;padding-top:22px}
.lead{color:#DDE6EE}
.howto{background:#102016;border:3px solid #3BD16F;border-radius:20px;padding:14px 20px;margin:16px 0}
.done{background:#0D1B12;border:3px solid #3BD16F;border-radius:20px;padding:12px 18px;margin:14px 0}
.q{background:#0B0F14;border:3px solid #24303C;border-radius:22px;padding:18px 20px;margin:26px 0}
.q>.t{font-size:32px;color:#7FD4FF;margin-bottom:8px}
.q>.t .no{display:inline-block;background:#FFD54A;color:#05070A;border-radius:12px;padding:0 14px;margin-right:10px}
.opt{background:#0F151C;border:4px solid #2A3540;border-radius:20px;padding:14px 18px;margin:16px 0}
.opt.rec{border-color:#3BD16F;background:#0D1B12}
.opt .hd{font-size:30px}.opt .k{color:#FFD54A;font-size:40px;margin-right:10px}
.tag{display:inline-block;background:#3BD16F;color:#05210F;border-radius:999px;padding:0 14px;font-size:22px;margin-left:8px;vertical-align:middle}
.why{color:#CFE3F5;font-size:24px;margin-top:6px}
table{border-collapse:collapse;width:100%;margin:10px 0;table-layout:fixed}
td,th{border:2px solid #2A3540;padding:8px 12px;text-align:left;vertical-align:middle;word-break:break-word}
th{background:#14202B;color:#CFE6FF}
a{color:#7FD4FF;word-break:break-all}
button{font:inherit;font-size:24px;color:#fff;background:#1B2633;border:3px solid #3A4A5C;border-radius:16px;padding:8px 18px;min-height:52px;cursor:pointer;margin:4px}
button.on{border-color:#FFD54A;color:#FFD54A}
.sw{display:flex;flex-wrap:wrap;gap:4px;margin:8px 0}
/* ── 愛心 新樣品 ── */
.stage{position:relative;height:min(78vh,620px);border-radius:22px;overflow:hidden;border:3px solid #2A3540;margin:10px 0}
.hp{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:2.4% 2%;gap:1.4%}
.hp .ht{font-size:clamp(30px,5.4vmin,52px);color:#FFE9A8}.hp .ht b{font-size:1.35em;color:#fff}
.hrow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1.4vw;width:100%;max-width:1000px;flex:1;align-items:end}
.hc{position:relative;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
.hc svg{width:92%;max-width:150px;height:auto;overflow:visible}
.hc .hn{font-size:clamp(20px,3.2vmin,30px);line-height:1.15;min-height:2.3em;display:flex;align-items:center;justify-content:center}
.hc .hv{font-size:clamp(26px,4.4vmin,42px)}
.hc .tg{position:absolute;top:0;left:50%;transform:translateX(-50%) scale(0);white-space:nowrap;border-radius:14px;padding:2px 12px;font-size:clamp(22px,3.4vmin,32px);transition:transform .5s cubic-bezier(.2,1.6,.4,1)}
.hc .tg.best{background:#FFD54A;color:#2A1A00}.hc .tg.wk{background:#FF6B3D;color:#fff}
.hc.on .tg{transform:translateX(-50%) scale(1)}
.hc.isw.on{animation:hwk 1s ease-in-out 2}@keyframes hwk{50%{transform:translateY(-10px)}}
.hc.isb.on svg{filter:drop-shadow(0 0 16px rgba(255,213,74,.9))}
.hsum{width:100%;max-width:1000px;display:grid;grid-template-columns:1fr;gap:8px;opacity:0;transform:translateY(20px);transition:all .6s}
.hsum.on{opacity:1;transform:none}
.hsum div{border-radius:16px;padding:6px 16px;font-size:clamp(24px,3.8vmin,38px)}
.hsum .s1{background:#3A2E08;border:3px solid #FFD54A}.hsum .s2{background:#3A1608;border:3px solid #FF6B3D}
.bars{width:100%;max-width:1000px;display:flex;flex-direction:column;gap:1.2vh;flex:1;justify-content:center}
.br{display:grid;grid-template-columns:2.2em minmax(0,7em) minmax(0,1fr) 3.3em 5.4em;align-items:center;gap:10px;font-size:clamp(22px,3.6vmin,36px)}
.br .bt{height:1.2em;border-radius:999px;background:#1B2633;overflow:hidden;border:2px solid #3A4A5C}
.br .bt i{display:block;height:100%;width:0;border-radius:999px;transition:width 1s cubic-bezier(.3,1,.4,1)}
.br .bk{opacity:0;transform:scale(.3);transition:all .5s cubic-bezier(.2,1.6,.4,1);border-radius:12px;padding:0 6px;text-align:center;font-size:.8em}
.br.on .bk{opacity:1;transform:none}.br .bk.best{background:#FFD54A;color:#2A1A00}.br .bk.wk{background:#FF6B3D}
/* ── 頒獎典禮（老師看板同一份） ── */
#cst{position:absolute;inset:0;display:flex}
${CERCSS}
/* ── 角色 ── */
.gal{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
@media (max-width:760px){.gal{grid-template-columns:repeat(3,minmax(0,1fr))}}
.hero{position:relative;border-radius:16px;overflow:hidden;cursor:pointer;aspect-ratio:3/4.3;background:#0A0F18;border:3px solid #2A3A55;--a:#7FD4FF}
.hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:hfl 3.2s ease-in-out infinite;animation-delay:var(--dl,0s)}
@keyframes hfl{50%{transform:translateY(-3%) scale(1.03)}}
.hero::before{content:"";position:absolute;inset:-30%;background:conic-gradient(from 0deg,transparent,var(--a),transparent 30%);animation:hsp 4s linear infinite;opacity:.55;z-index:0}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%);transform:translateX(-120%);animation:hsh 4.5s ease-in-out infinite;animation-delay:var(--dl,0s)}
@keyframes hsp{to{transform:rotate(360deg)}}@keyframes hsh{30%,100%{transform:translateX(120%)}}
.hero .in{position:absolute;inset:4px;border-radius:12px;overflow:hidden;z-index:1;background:#0A0F18}
.hero .pt{position:absolute;bottom:-10px;width:8px;height:8px;border-radius:50%;background:var(--a);box-shadow:0 0 10px var(--a);z-index:2;animation:hpt 2.6s linear infinite}
@keyframes hpt{to{transform:translateY(-36vh);opacity:0}}
.hero.jump{animation:hjp .7s cubic-bezier(.2,1.6,.4,1)}@keyframes hjp{40%{transform:translateY(-14px) scale(1.08) rotate(-3deg)}}
.hero.sel{border-color:#FFD54A;box-shadow:0 0 0 4px #FFD54A,0 0 30px rgba(255,213,74,.7)}
.hero .no{position:absolute;left:6px;top:6px;z-index:3;background:rgba(0,0,0,.7);border-radius:10px;padding:0 8px;font-size:20px}
.slot{aspect-ratio:3/4.3;border:3px dashed #3A4A5C;border-radius:16px;display:flex;align-items:center;justify-content:center;text-align:center;color:#8FA3B5;font-size:20px;padding:8px}
.show{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:16px;align-items:center;background:radial-gradient(circle at 30% 40%,#1C2A44,#05070A 70%);border:3px solid #FFD54A;border-radius:22px;padding:16px}
@media (max-width:760px){.show{grid-template-columns:1fr}}
.show .hero{cursor:default}
.show .sl{font-size:28px;line-height:1.6}
.show .ph{display:inline-block;border:3px dashed #3A4A5C;border-radius:14px;padding:2px 12px;color:#8FA3B5;font-size:22px}
</style></head><body><div class="wrap">
<h1>老師，請看（C8）：動畫、角色、現場任務</h1>
<p class="lead">老師看完 C6、C7 的回答已經寫進需求檔。有<b>兩種意思</b>或<b>跟以前的決定衝突</b>的地方，全部列在這一頁。回答只要寫：<b>「1 A、2 A…」</b>；全部同意寫<b>「全部照建議」</b>。</p>
<div class="howto">✅ <b>這一次已經做好的</b>（不用回答）：<b>🏆 頒獎典禮 10 種風格</b>放上老師看板了——第 1 名的台子 ≈ 第 2 名的 2 倍高、第 3 名的 4 倍高；每一種風格上台的動畫都不一樣；第 3 名 ➜ 第 2 名 ➜ 鼓聲 ➜ 第 1 名最後上台；「8 冠軍遊行」重做。下面第三段可以一種一種看。</div>

<h2>一、📅 練習 的愛心動畫</h2>
<p>老師說：10 種新的都不好——<b>看不出：自己哪裡做得最好、哪裡可以更好、要加強什麼</b>。所以這一次改成<b>「一眼看出三件事」</b>，每一次都一樣排法（秒懂、精準），只換顏色和背景：</p>
<table><tr><th style="width:34%">要看出來的</th><th>畫面上</th></tr>
<tr><td>⭐ 哪裡做得最好</td><td>那一項上面掛金色牌子「⭐ 最好」、會發光</td></tr>
<tr><td>🎯 哪裡可以更好</td><td>最少的那一項上面掛橘色牌子「🎯 加強」、會跳</td></tr>
<tr><td>💡 要加強什麼、怎麼做</td><td>最下面兩行大字：「⭐ 你最棒：…」「🎯 下次加強：… ➜ 怎麼做」</td></tr></table>
<p>例子：小華（30412）這週 4 天、7 次、看完聽完才選 16 分、改對了 16 分、34 分鐘 ＝ <b>92</b>。</p>
<div class="sw" id="swH"><button data-h="0" class="on">甲 五顆愛心</button><button data-h="1">乙 五條長條</button><button data-r="H">🔁 再演一次</button></div>
<div class="stage" id="sH"></div>
${q('愛心動畫改成哪一種？', opt('甲', '五顆愛心（愛心造型留著）＋每一顆下面寫名字和分數＋⭐ 最好／🎯 加強 牌子＋最下面兩行', '老師 C5 說「愛心造型留著」；名字直接寫在愛心下面，不用看圖示猜', true) + opt('乙', '五條長條（像溫度計）＋⭐／🎯 牌子＋最下面兩行', '長短最好比，但是沒有愛心') )}
${q('「10 種新的都不好」——現在網站上的 8 種、C6 留著的 3 種（❤ 大愛心、💞 原本、🤍 簡潔）也一起換掉嗎？', opt('A', '全部換成上面選的那一種排法（老師看板、學生平板都一樣）；「每一次不同風格」只換背景顏色和小裝飾，排法不變', '排法每次都一樣，學生第二次就會看；精準最重要', true) + opt('B', '新的排法加進去，原本的 8 種也留著輪流', '舊的 8 種也一樣看不出「最好／加強」') )}
${q('「這十種新的動畫都不好」是只有愛心，還是<b>故事動畫</b>也包含在內？', opt('A', '只有愛心。16 種故事動畫照老師改的字放上學生平板（📅 練習 的下一幕，約 6 秒、可以跳過）', '老師第二段只改了故事的字，所以猜是要用；但是要老師確定', true) + opt('B', '故事也不好，也要重想') )}

<h2>二、故事動畫（學生平板）的字</h2>
<table><tr><th style="width:34%">老師說的</th><th>現在</th><th>改好以後</th></tr>
<tr><td>給 30412 號 一律改「給 30412」</td><td>給 <b>30412 號</b>：</td><td>給 <b>30412</b>：</td></tr>
<tr><td>老師的信 最後署名</td><td>老師</td><td><b>英文老師</b></td></tr>
<tr><td>老師 看見了 ➜ 老師看見</td><td>老師 看見了：你 …</td><td><b>老師看見</b>：你 …</td></tr></table>
${q('「30412 號 ➜ 30412」是學生平板<b>每一個</b>地方都改嗎（16 種故事、成績卡、榮譽動畫）？', opt('A', '每一個地方都改，平板上不再出現「號」', '老師寫「一律」', true) + opt('B', '只改老師的信「給 30412」那一行'))}
${q('「老師 看見了 ➜ 老師看見」是只改老師的信，還是 16 種故事都改？', opt('A', '16 種故事都改（每一種最後都有「老師 看見了」這一句）', '同一句話要一樣', true) + opt('B', '只改老師的信'))}
${q('老師的信上那一個紅色圓章（現在寫「老師 的章」），也改成「英文老師」嗎？', opt('A', '圓章也改「英文老師」，跟署名一樣', '', true) + opt('B', '圓章不改'))}

<h2>三、🏆 頒獎典禮 10 種風格（已經放上老師看板，請看）</h2>
<p>文字照 C3 一個字都不改。按號碼看；每一種約 9 秒演完。老師看板每按一次〔🏆 開始頒獎典禮〕換一種、跟上一次不一樣（左下角寫第幾種）。</p>
<div class="sw" id="swC"></div>
<div class="stage" id="sC"><div id="cst"></div></div>
<table><tr><th style="width:24%">風格</th><th>領獎台怎麼上台</th></tr>
<tr><td>1 舞台燈光</td><td>台子從地板升上來，第 1 名上台時一束聚光燈打下來</td></tr>
<tr><td>2 星空</td><td>台子是從地上射出的星光柱，第 1 名頭上一顆大星星</td></tr>
<tr><td>3 金色煙火</td><td>台子像火箭衝上來、衝過頭再落下，班級上面放煙火</td></tr>
<tr><td>4 紅毯</td><td>第 3、2 名從兩邊滑進來，第 1 名從天上「咚！」掉下來、整個畫面震一下</td></tr>
<tr><td>5 升旗典禮</td><td>台子像升旗一樣慢慢升高，每個台子插一面旗，第 1 名最高</td></tr>
<tr><td>6 皇家殿堂</td><td>台子是金色樓梯一階一階堆上去，皇冠戴到第 1 名頭上</td></tr>
<tr><td>7 打開信封</td><td>每一個名次先是金色信封 ✉，打開才看到班級，台子才長高</td></tr>
<tr><td>8 冠軍遊行（重做）</td><td>氣球飛上天，三台花車從右邊開進來（輪子在轉），第 1 名花車最高、最後開進來，兩邊彩帶大砲</td></tr>
<tr><td>9 極光</td><td>台子是一根一根長出來的冰柱，第 1 名的冰柱發光</td></tr>
<tr><td>10 水晶光芒</td><td>台子是透明水晶，彩虹光掃過去，第 1 名射出一圈彩虹光</td></tr></table>

<h2>四、角色（老師上傳的 5 張圖：男 30、女 20）</h2>
<p>已經把 5 張圖<b>切成一個一個角色</b>（男 01～30、女 01～20），下面就是切好的樣子，而且<b>會動</b>：身體慢慢上下浮、外框一圈光在轉、一道亮光掃過去、小光點往上飄；點一下會跳起來。女 21～30、武器 30、寵物 30 等老師下一個對話上傳。</p>
<div class="sw" id="swG"><button data-g="b" class="on">帥氣少男 30</button><button data-g="g">唯美少女 20（＋10 待上傳）</button></div>
<div class="gal" id="gal"></div>
<p style="margin-top:18px">👇 點上面一個角色，下面是「英雄誕生展示卡」的樣子：</p>
<div class="show"><div class="hero" id="shH"><div class="in"><img id="shI" alt=""></div></div>
<div class="sl"><div>🦸 英雄：<b id="shN">男 01</b></div><div>⚔️ 武器：<span class="ph">下一個對話上傳</span></div><div>🐾 寵物：<span class="ph">下一個對話上傳</span></div><div>🏷 30412</div></div></div>
${q('「照片改成動畫呈現」是哪一種？', opt('A', '老師的圖本身不變，讓整張圖<b>動起來</b>：上下浮、轉圈的光框、亮光掃過、光點往上飄、點一下跳起來（就是上面的樣子）；答對的時候再加武器特效和寵物助威', '圖的品質完全保留；iPad 跑得動', true) + opt('B', '要角色的手腳真的會動（揮劍、眨眼）', '要每一個角色重畫成很多張圖（像卡通一格一格），老師的圖做不到，要另外畫'))}
${q('切圖的方法', opt('A', '照圖上的框，<b>一個角色切成一張小圖</b>（上面就是這樣切的）', '老師給的做法（整張圖平均切 5 ✕ 2）會切歪：第 1 張上面有標題「ELEMENTAL KNIGHTS」、每一張的框大小和邊都不一樣，平均切會切到頭或切到別人。結果看起來一樣，只是比較準、iPad 開比較快', true) + opt('B', '照老師給的做法，整張圖平均切'))}
${q('圖上原本的英文字和號碼（FIRE KNIGHT、THUNDER ARCHER、01、02…）', opt('A', '留著（上面就是留著的樣子）', '學生看得到英文名字；不過第 3 張有三個都叫 THUNDER ARCHER、第 5 張也有同名的', true) + opt('B', '切掉，網站自己在每一張下面寫一樣格式的號碼（男 01、女 01）'))}
${q('國小學生的服裝（請老師看一下這 3 張）：<b>男 13</b>（衣服打開、露胸）、<b>男 16</b>（沒穿上衣）、<b>女 17</b>（胸口開洞）', opt('A', '這 3 張換掉（老師下一個對話給新的圖）', '學校的網站給 8～10 歲用，家長、同事都會看到', true) + opt('B', '可以用，不用換'))}
${q('學生登入：老師的範例寫「輸入姓名、座號、班級」——跟以前定好的「學生端永遠不打姓名、只用 5 碼（班級＋座號）」衝突', opt('A', '照舊只用 5 碼登入（記住我 7 天），不打姓名；第一次登入以後才選英雄、武器、寵物，以後記住', '學生平板永遠不給姓名（2026-10-09 決定）；打姓名也比較慢', true) + opt('B', '要打姓名'))}
${q('經驗值與金幣：跟 C7 建議的「選角色只換外表、不會變強、不加分（成績公平）」要一起想', opt('A', '有經驗值和金幣，<b>只能換外表</b>（英雄升級光芒、寵物長大、武器發光），<b>不會變強、不加分數</b>；經驗值 ＝ 練習（做完、聽完就有），金幣 ＝ 答對', '有收集的樂趣，成績還是公平', true) + opt('B', '經驗值、金幣可以讓英雄變強（例：多 5 秒、多一次機會）', '會讓練得多的人遊戲更簡單，成績不公平') + opt('C', '不要經驗值和金幣'))}
${q('「奇幻學園闖關 RPG」是另外一個新遊戲，還是把英雄帶進現在的遊戲？', opt('A', '把英雄、武器、寵物<b>帶進現在全部的遊戲和複習題</b>：答對 ➜ 武器特效＋寵物助威；成績照舊進老師看板', '學生玩的還是老師教的題目，不會多一套要管的系統', true) + opt('B', '另外做一個新的 RPG 闖關遊戲（新的關卡地圖）', '要另外出題、另外接成績'))}

<h2>五、現場任務（上課即時對戰）</h2>
<p>老師要：10 種完全不同風格、即時互動、彼此支援、送禮物、連對 5 題抽獎、凍結或干擾。下面是我的建議，<b>老師說「對」才做</b>。</p>
<table><tr><th style="width:28%">遊戲</th><th>怎麼玩（一句話）</th></tr>
<tr><td>1 ⚔️ 全班打魔王</td><td>全班一起答，答對就砍魔王的血；時間內打倒，全班一起贏（合作）</td></tr>
<tr><td>2 🏎 賽車衝刺</td><td>答對車子往前衝，大螢幕看誰先到終點</td></tr>
<tr><td>3 🚀 太空接力（分紅藍隊）</td><td>答對替自己的隊加燃料，火箭先到月球的隊贏</td></tr>
<tr><td>4 🏰 搶地圖</td><td>答對插一面旗佔一格，最後地圖上誰的顏色最多</td></tr>
<tr><td>5 🧗 爬高塔</td><td>答對爬一層；連對 5 題坐電梯跳 3 層</td></tr>
<tr><td>6 🐉 寵物大進化</td><td>答對餵自己的寵物，寵物長大、變身</td></tr>
<tr><td>7 🎯 神射手</td><td>題目出現在靶上，愈快答對射得愈準、分數愈高</td></tr>
<tr><td>8 🗺 尋寶</td><td>答對挖寶箱，寶箱裡有禮物、加速、護盾</td></tr>
<tr><td>9 🌊 衝浪大浪</td><td>連對愈多浪愈高；答錯掉進水裡，爬上來繼續（不扣分）</td></tr>
<tr><td>10 👑 王者擂台</td><td>最後 1 分鐘，前 5 名上擂台決戰；台下的同學可以送「應援」</td></tr></table>
<table><tr><th style="width:28%">驚喜機制</th><th>怎麼做</th></tr>
<tr><td>🎁 送禮物</td><td>答對時可以把「⏱ ＋3 秒」「🛡 護盾」「⭐ 加油貼圖」送給一位同學（只能送好東西）</td></tr>
<tr><td>🤝 支援</td><td>分隊遊戲：答對分一點分數給隊友；隊友答錯可以「拉他一把」</td></tr>
<tr><td>🎰 連對 5 題抽獎</td><td>跟現在的驚喜卡一樣：二～五選一，只抽好東西</td></tr>
<tr><td>❄️ 凍結／干擾</td><td>看下面第 ${QN + 2} 題</td></tr></table>
${q('10 種現場任務遊戲可以嗎？', opt('A', '可以：照上面 10 種做（每一種的大螢幕、結束頒獎台都不一樣風格；學生平板都是同一組老師選的題目）', '', true) + opt('B', '要改：請寫號碼和怎麼改'))}
${q('❄️ 凍結或干擾「某一位或某些同學」（老師請我給建議）', opt('A', '干擾可以有，但<b>不讓學生自己挑人</b>：自動打「排名在你正前面的那一位」；效果好笑不嚇人（泡泡蓋住畫面，點 3 下就破，最多 3 秒）；每個人一場最多被干擾 2 次，被干擾完自動拿到 🛡 護盾', '學生自己挑人，很容易一直打同一位（常常是比較弱、或比較沒有朋友的孩子），老師在台上看不到；凍結 5 秒對答得慢的孩子傷最大。這樣改，還是很刺激，但不會變成欺負', true) + opt('B', '照老師說的原樣：學生自己挑一位或幾位同學凍結 5 秒') + opt('C', '不要干擾，只有送禮物和支援'))}
${q('「即時」要用什麼做？', opt('A', '現場任務改用 <b>Firebase</b>（Google 的即時資料庫）：送禮物、干擾、大螢幕排名 1 秒內就到；成績照舊送進老師的 Google 試算表。老師要多做一次設定（約 10 分鐘，我做大字版一步一步的說明頁）', 'Google 官方：Firebase 免費方案同時 100 個連線，一班 30 人夠用', true) + opt('B', '照 C4：先用現在的 Google 試算表', '每 3～5 秒才更新一次：禮物、干擾要等幾秒才到，「凍結 5 秒」會不準；Apps Script 每個帳號同時最多 30 個執行，大家一直互動會塞車'))}
${q('學生加入現場任務：最快的方法', opt('A', '學生平板已經用 5 碼登入（記住 7 天）➜ 首頁最上面一顆大按鈕〔⚡ 加入現場任務〕（老師開了任務才亮）➜ 第一次選英雄、武器、寵物（以後記住，直接進）➜ 等老師按開始', '一按就進，不用再打號碼', true) + opt('B', '大螢幕顯示 4 個數字的房間號碼，學生打號碼加入'))}
<div class="done">回答例：<b>「全部照建議」</b>或<b>「1 甲、2 A、3 A、9 B…」</b>。老師回答以後，順序：愛心＋故事放上網站 ➜ 角色（等老師上傳另外 5 張）➜ 學生選角色 ➜ 現場任務。</div>
</div>
<script>${HONRT}</script>
<script>${CERRT}</script>
<script>
/* 愛心新樣品：小華 92（20、20、16、16、20） */
var IT=[{n:'練了 4 天',k:'練幾天',v:20,t:'再多練 1 天',ic:'📅'},{n:'做完 7 次',k:'做完幾次',v:20,t:'再做完 1 次',ic:'📝'},{n:'看完聽完 才選',k:'看完聽完',v:16,t:'看完、聽完 再選',ic:'👀'},{n:'答錯的 改對了',k:'改對了',v:16,t:'把答錯的 再做一次',ic:'✗➜✓'},{n:'練了 34 分鐘',k:'練幾分鐘',v:20,t:'再多練幾分鐘',ic:'⏰'}];
var CL=['#2F7BE8','#9B59D0','#00A6A6','#2EB85C','#FF9F1C'],HP='M50 88C20 66 4 48 4 28C4 13 15 4 28 4C38 4 45 10 50 18C55 10 62 4 72 4C85 4 96 13 96 28C96 48 80 66 50 88Z',TM=[],KH=0;
function clr(){TM.forEach(clearTimeout);TM=[]}function later(f,t){TM.push(setTimeout(f,t))}
function ana(){var mx=Math.max.apply(null,IT.map(function(x){return x.v})),mn=Math.min.apply(null,IT.map(function(x){return x.v})),w=-1;IT.forEach(function(x,i){if(w<0&&x.v===mn&&mn<20)w=i});return {best:IT.map(function(x,i){return x.v===mx?i:-1}).filter(function(i){return i>=0}),w:w}}
function sumH(A){return '<div class="hsum"><div class="s1">⭐ 你最棒：'+A.best.map(function(i){return IT[i].n}).join('、')+'</div>'+(A.w>=0?'<div class="s2">🎯 下次加強：'+IT[A.w].k+' ➜ 💡 '+IT[A.w].t+'</div>':'<div class="s1">🎉 五項都滿分</div>')+'</div>'}
function playH(){clr();var s=document.getElementById('sH'),A=ana(),tot=0;s.style.background=['linear-gradient(#2A0E22,#0A0410)','linear-gradient(#0E1E36,#04080F)'][KH];
  if(KH===0){s.innerHTML='<div class="hp"><div class="ht">這週 📅 練習 <b class="nn">0</b> 分</div><div class="hrow">'+IT.map(function(x,i){var y=(84*(1-x.v/20)).toFixed(1);
    return '<div class="hc'+(A.best.indexOf(i)>=0?' isb':'')+(i===A.w?' isw':'')+'" data-i="'+i+'">'+(A.best.indexOf(i)>=0?'<div class="tg best">⭐ 最好</div>':i===A.w?'<div class="tg wk">🎯 加強</div>':'')+
    '<svg viewBox="0 0 100 92"><defs><clipPath id="hc'+i+'"><path d="'+HP+'"/></clipPath></defs><path d="'+HP+'" fill="#1B2633" stroke="#3A4A5C" stroke-width="3"/><rect clip-path="url(#hc'+i+')" class="lq" x="0" y="92" width="100" height="92" fill="'+CL[i]+'" style="transition:y 1s ease-out" data-y="'+y+'"/><path d="'+HP+'" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/><text x="50" y="50" text-anchor="middle" font-size="22" fill="#fff">'+x.ic+'</text></svg>'+
    '<div class="hv">'+x.v+'／20</div><div class="hn">'+x.n+'</div></div>'}).join('')+'</div>'+sumH(A)+'</div>';
    IT.forEach(function(x,i){later(function(){var r=s.querySelector('.hc[data-i="'+i+'"] .lq');r.setAttribute('y',r.getAttribute('data-y'));tot+=x.v;s.querySelector('.nn').textContent=tot},300+i*600)});}
  else{s.innerHTML='<div class="hp"><div class="ht">這週 📅 練習 <b class="nn">0</b> 分</div><div class="bars">'+IT.map(function(x,i){return '<div class="br" data-i="'+i+'"><span>'+x.ic+'</span><span>'+x.k+'</span><span class="bt"><i style="background:'+CL[i]+'"></i></span><span>'+x.v+'／20</span>'+
    (A.best.indexOf(i)>=0?'<span class="bk best">⭐ 最好</span>':i===A.w?'<span class="bk wk">🎯 加強</span>':'<span></span>')+'</div>'}).join('')+'</div>'+sumH(A)+'</div>';
    IT.forEach(function(x,i){later(function(){s.querySelector('.br[data-i="'+i+'"] .bt i').style.width=(x.v*5)+'%';tot+=x.v;s.querySelector('.nn').textContent=tot},300+i*500)});}
  later(function(){[].forEach.call(s.querySelectorAll('.hc,.br'),function(h){h.classList.add('on')})},3500);later(function(){s.querySelector('.hsum').classList.add('on')},4300)}
/* 頒獎典禮：老師看板同一份 */
var KC=0,CD={ribbon:'⏰ 最認真練習',sub:'練最多分鐘',cls:'👑 307 班',say:'🌟 平均每一個人 練習 35 分鐘，全年級最多',pod:[{rk:1,w:'307 班'},{rk:2,w:'304 班'},{rk:3,w:'311 班'}]};
function playC(){var st=document.getElementById('cst');CERX.play(st,KC,CD,{snd:false});document.getElementById('swC').innerHTML=CERX.ST.map(function(x,i){return '<button data-c="'+i+'"'+(i===KC?' class="on"':'')+'>'+(i+1)+' '+x.nm+'</button>'}).join('')+'<button data-r="C">🔁 再演一次</button>'}
/* 角色 */
var GD='b',AC=['#FF6B3D','#5AB0FF','#3BD16F','#FFD54A','#C9A26B','#FFF1C2','#9B59D0','#BFEFFF','#3BD16F','#5A6BFF'];
function pad(n){return (n<10?'0':'')+n}
function gal(){var n=GD==='b'?30:20,h='';for(var i=1;i<=n;i++){var c=AC[(i-1)%10],pts='';for(var k=0;k<3;k++)pts+='<i class="pt" style="left:'+(20+k*30)+'%;animation-delay:'+(k*.8+i%3*.3)+'s"></i>';
  h+='<div class="hero" data-h="'+GD+pad(i)+'" style="--a:'+c+';--dl:'+((i%5)*.4)+'s"><div class="in"><img loading="lazy" src="../../rpg/chars/'+GD+pad(i)+'.jpg" alt="'+(GD==='b'?'男 ':'女 ')+pad(i)+'"></div>'+pts+'<span class="no">'+(GD==='b'?'男 ':'女 ')+pad(i)+'</span></div>'}
  if(GD==='g')for(i=21;i<=30;i++)h+='<div class="slot">女 '+i+'<br>下一個對話上傳</div>';document.getElementById('gal').innerHTML=h}
function pickH(id){document.getElementById('shI').src='../../rpg/chars/'+id+'.jpg';document.getElementById('shN').textContent=(id[0]==='b'?'男 ':'女 ')+id.slice(1);var sh=document.getElementById('shH');sh.style.setProperty('--a',AC[(+id.slice(1)-1)%10]);sh.classList.remove('jump');void sh.offsetWidth;sh.classList.add('jump')}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button,.hero[data-h]');if(!b)return;
  if(b.hasAttribute('data-h')&&b.tagName==='BUTTON'){KH=+b.getAttribute('data-h');[].forEach.call(document.querySelectorAll('#swH [data-h]'),function(x){x.classList.toggle('on',x===b)});playH()}
  else if(b.getAttribute('data-r')==='H')playH();else if(b.getAttribute('data-r')==='C')playC();
  else if(b.hasAttribute('data-c')){KC=+b.getAttribute('data-c');playC()}
  else if(b.hasAttribute('data-g')){GD=b.getAttribute('data-g');[].forEach.call(document.querySelectorAll('#swG button'),function(x){x.classList.toggle('on',x===b)});gal()}
  else if(b.classList.contains('hero')){[].forEach.call(document.querySelectorAll('.gal .hero'),function(x){x.classList.toggle('sel',x===b)});b.classList.remove('jump');void b.offsetWidth;b.classList.add('jump');pickH(b.getAttribute('data-h'))}});
playH();playC();gal();pickH('b01');
</script></body></html>`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('C8 ok，' + QN + ' 題');
