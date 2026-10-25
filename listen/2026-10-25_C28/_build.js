// listen/2026-10-25_C28/ — 第二十五次第 1 點：男戰士 ★★ 稀有 新圖放哪一個號碼（老師同意才上架）。node listen/2026-10-25_C28/_build.js ➜ index.html
const fs = require('fs'), path = require('path');
const SC = require('../../score/_calc.js');
const P = [['A1', 37, 'Blazing Valiant'], ['A2', 38, 'Tempest Lancer'], ['B1', 39, 'Crystal Guardian'], ['B2', 40, 'Astral Vanguard（長槍）'], ['C1', 41, 'Astral Vanguard（劍）'], ['C2', 42, 'Terra Champion'], ['E1', 43, 'Earthen Sentinel'], ['E2', 44, 'Astral Knight（稀有，跟基本的男 31 不一樣）']];
const fig = (src, cap, cls) => `<figure${cls ? ' class="' + cls + '"' : ''}><img loading="lazy" src="${src}" alt=""><figcaption>${cap}</figcaption></figure>`;
const old = ['b09', 'b10', 'b11', 'b12', 'b13', 'b14', 'b15', 'b16'];
const html = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex">
<title>男戰士新圖放哪裡</title><style>
:root{color-scheme:dark}*{box-sizing:border-box}
body{margin:0;background:#05070A;color:#fff;font-family:"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 120px;font-size:26px;line-height:1.55;font-weight:700}
.wrap{max-width:1180px;margin:0 auto}h1{font-size:42px;color:#FFD54A;margin:22px 0 6px}
.box{background:#0B0F14;border:3px solid #24303C;border-radius:22px;padding:16px 20px;margin:18px 0}
table{border-collapse:collapse;width:100%;font-size:26px}td,th{border:2px solid #2A3540;padding:8px 12px;text-align:left}th{background:#14202B}
.tier{border:4px solid #2A3540;border-radius:22px;margin:26px 0;padding:12px}
.th{font-size:36px;color:#FFD54A;margin:0 0 10px}.th small{font-size:24px;color:#CFE3F5;margin-left:16px}
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
figure{margin:0;background:#0F151C;border:3px solid #2A3540;border-radius:14px;padding:6px;text-align:center}
figure img{width:100%;height:240px;object-fit:contain;display:block}
figcaption{font-size:21px}figure.nw{border-color:#3BD16F;background:#0D1B12}
.off .gal figure{border-color:#C0392B}.off figcaption{color:#FF9A8A}
</style></head><body><div class="wrap">
<h1>男戰士新圖：★★ 稀有 放這 8 張，可以嗎？</h1>
<div class="box">老師說：<b>先經過老師同意，才能上架</b>。<b>綠框 🆕 ＝ 新圖</b>。<br>
<table><tr><th>現在</th><th>老師同意以後</th></tr>
<tr><td>★★ 稀有 ＝ 男 09～16（8 張舊圖）</td><td>★★ 稀有 ＝ <b>男 37～44（8 張新圖）</b></td></tr>
<tr><td>男 09～16 在商店</td><td>男 09～16 下架：商店看不到；<b>已經選了的學生照舊用舊圖</b></td></tr>
<tr><td>Verdant Warden、Chrono Crusader（2 位女戰士）</td><td>老師說「這次不用」：不上架</td></tr></table></div>
<div class="tier"><div class="th">★★ 稀有<small>🪙 ${SC.RPP[2]}</small></div><div class="gal">${P.map(p => fig('../../rpg/newm2/' + p[0] + '.jpg', '<b>男 ' + p[1] + '</b> 🆕<br>' + p[2], 'nw')).join('')}</div></div>
<div class="tier off"><div class="th">🔒 下架（商店不賣；已經選的學生還可以繼續用）</div><div class="gal">${old.map(id => fig('../../rpg/chars/' + id + '.jpg', '男 ' + id.slice(1))).join('')}</div></div>
</div></body></html>`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html); console.log('ok');
