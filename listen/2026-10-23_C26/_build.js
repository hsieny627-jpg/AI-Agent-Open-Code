// listen/2026-10-23_C26/ — 第二十二次第 8 點：女戰士新圖放哪一個號碼、哪一個等級（老師同意才上架）。node listen/2026-10-23_C26/_build.js ➜ index.html
const fs = require('fs'), path = require('path');
const SC = require('../../score/_calc.js');
const RN = ['', '★ 基本', '★★ 稀有', '★★★ 史詩', '★★★★ 傳說', '★★★★★ 神話'];
/* 建議：[新圖, 新號碼, 星等] */
const P = [['C1', 32, 2], ['C2', 33, 2], ['C3', 34, 2], ['C4', 35, 2], ['C5', 36, 2], ['E1', 37, 2], ['E2', 38, 2], ['E3', 39, 2], ['E4', 40, 2], ['E5', 41, 2],
  ['B1', 42, 3], ['B2', 43, 3], ['B3', 44, 3], ['B4', 45, 3], ['B5', 46, 3], ['D1', 47, 3], ['D2', 48, 3], ['D3', 49, 3], ['D4', 50, 3], ['D5', 51, 3],
  ['A1', 52, 4], ['A2', 53, 4], ['A3', 54, 4], ['A4', 55, 4], ['A5', 56, 4]];
const fig = (src, cap, cls) => `<figure${cls ? ' class="' + cls + '"' : ''}><img loading="lazy" src="${src}" alt=""><figcaption>${cap}</figcaption></figure>`;
const keep = { 1: ['g01', 'g02', 'g03', 'g04', 'g05', 'g06', 'g07', 'g08'], 2: ['g09', 'g10'], 3: ['g22', 'g23'], 4: ['g24', 'g25', 'g26', 'g27'], 5: ['g28', 'g29', 'g30', 'g31'] };
const row = s => `<div class="tier t${s}"><div class="th">${RN[s]}<small>🪙 ${SC.RPP[s]}${SC.RPL[s] > 1 ? '・要 Lv ' + SC.RPL[s] : ''}</small></div><div class="gal">` +
  (keep[s] || []).map(id => fig('../../rpg/chars/' + id + '.jpg', '女 ' + id.slice(1) + '（原本）', 'old')).join('') +
  P.filter(p => p[2] === s).map(p => fig('../../rpg/newg/' + p[0] + '.jpg', '<b>女 ' + p[1] + '</b> 🆕 第 ' + ' ABCDE'.indexOf(p[0][0]) + ' 張圖 ' + p[0][1] + ' 號', 'nw')).join('') + '</div></div>';
const html = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex">
<title>女戰士新圖放哪裡</title><style>
:root{color-scheme:dark}*{box-sizing:border-box}
body{margin:0;background:#05070A;color:#fff;font-family:"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 120px;font-size:26px;line-height:1.55;font-weight:700}
.wrap{max-width:1180px;margin:0 auto}h1{font-size:42px;color:#FFD54A;margin:22px 0 6px}
.box{background:#0B0F14;border:3px solid #24303C;border-radius:22px;padding:16px 20px;margin:18px 0}
table{border-collapse:collapse;width:100%;font-size:26px}td,th{border:2px solid #2A3540;padding:8px 12px;text-align:left}th{background:#14202B}
.tier{border:4px solid #2A3540;border-radius:22px;margin:26px 0;padding:12px}
.th{font-size:36px;color:#FFD54A;margin:0 0 10px}.th small{font-size:24px;color:#CFE3F5;margin-left:16px}
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
figure{margin:0;background:#0F151C;border:3px solid #2A3540;border-radius:14px;padding:6px;text-align:center}
figure img{width:100%;height:230px;object-fit:contain;display:block}
figcaption{font-size:20px}figure.nw{border-color:#3BD16F;background:#0D1B12}figure.old{opacity:.8}
.off .gal figure{border-color:#C0392B}.off figcaption{color:#FF9A8A}
</style></head><body><div class="wrap">
<h1>女戰士新圖：放哪一個號碼、哪一個等級？</h1>
<div class="box">老師說：<b>先經過老師同意，才能上架</b>。下面是我的建議，<b>綠框 🆕 ＝ 新圖</b>。<br>
<table><tr><th>建議</th><th>為什麼</th></tr>
<tr><td>第 3 張（太陽少女戰神…）、第 5 張（太陽女戰神…）➜ ★★ 稀有</td><td>盔甲、背景比較簡單</td></tr>
<tr><td>第 2 張（火之女戰神…）、第 4 張（Sunfire Empress…）➜ ★★★ 史詩</td><td>翅膀、魔法、長袍，比較華麗</td></tr>
<tr><td>第 1 張（Pyro Valkyrie…，戰鬥背景）➜ ★★★★ 傳說</td><td>火、水、雷、風、星河整個背景都在爆發，最強</td></tr>
<tr><td>新號碼 女 32～56</td><td>原本的號碼不動：已經買了下架那幾張的學生還可以繼續用（老師的決定）</td></tr></table></div>
${[1, 2, 3, 4, 5].map(row).join('')}
<div class="tier off"><div class="th">🔒 下架（商店不賣；已經買的學生還可以繼續用）</div><div class="gal">${['g11', 'g12', 'g13', 'g14', 'g15', 'g16', 'g17', 'g18', 'g19', 'g20', 'g21'].map(id => fig('../../rpg/chars/' + id + '.jpg', '女 ' + id.slice(1))).join('')}</div></div>
</div></body></html>`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html); console.log('ok');
