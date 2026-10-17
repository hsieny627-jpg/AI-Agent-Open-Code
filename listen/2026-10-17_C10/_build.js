// listen/2026-10-17_C10/ — 老師看完 C9（第八次）做好以後：要老師聽、看、決定的 4 題（node listen/2026-10-17_C10/_build.js ➜ index.html）
const fs = require('fs'), path = require('path');
const SC = require('../../score/_calc.js');
const opt = (k, hd, why, rec) => `<div class="opt${rec ? ' rec' : ''}"><div class="hd"><span class="k">${k}</span>${hd}${rec ? '<span class="tag">建議</span>' : ''}</div>${why ? '<div class="why">' + why + '</div>' : ''}</div>`;
let QN = 0; const q = (t, body) => `<div class="q"><div class="t"><span class="no">${++QN}</span>${t}</div>${body}</div>`;
/* 5 句：現在的語音檔（C9 那一頁）vs 新做的（a 前面停一下、a 唸清楚的 ㄜ） */
const S5 = [['Is your dad a teacher?', '04595c44cc44', 's1e'], ['Is your dad a student?', 'c1c56860d10c', 's2e'], ['Is my grandpa a cook?', 'f8c5a58b559f', 's3e'], ['Is my grandpa a student?', '4ed77dc02eeb', 's4e'], ['Is your grandpa a cook?', '0146f8eae7ef', 's5e']];
const ASR = JSON.parse(fs.readFileSync(path.join(__dirname, 'au', '_asr.json'), 'utf8'));
const RN = ['', '★ 普通', '★★ 稀有', '★★★ 史詩', '★★★★ 傳說', '★★★★★ 神話'];
const DIR = { h: 'chars', w: 'weapons', p: 'pets' };
const rar = k => [1, 2, 3, 4, 5].map(s => `<div class="rr"><b>${RN[s]}<small>🪙 ${SC.RPP[s]}${SC.RPL[s] > 1 ? '・Lv ' + SC.RPL[s] : ''}</small></b><div class="ri">` +
  Object.keys(SC.RPR[k]).filter(id => SC.RPR[k][id] === s).sort().map(id => `<figure><img loading="lazy" src="../../rpg/${DIR[k]}/${id}.jpg" alt="${id}"${SC.RPHIDE[id] ? ' class="hid"' : ''}><figcaption>${id.replace(/^b/, '男 ').replace(/^g/, '女 ').replace(/^w/, '武器 ').replace(/^p/, '寵物 ')}${SC.RPHIDE[id] ? '（先不放）' : ''}</figcaption></figure>`).join('') + '</div></div>').join('');
const html = `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>做好了，請看 C10</title>
<style>
@font-face{font-family:Andika;src:url(../../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#05070A;color:#fff;font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;padding:0 16px 140px;font-size:26px;line-height:1.55;font-weight:700}
.wrap{max-width:1180px;margin:0 auto}
h1{font-size:42px;color:#FFD54A;margin:22px 0 6px}
h2{font-size:36px;color:#FFD54A;margin:56px 0 10px;border-top:4px solid #24303C;padding-top:22px}
.done{background:#0D1B12;border:3px solid #3BD16F;border-radius:20px;padding:12px 18px;margin:14px 0}
.done a{color:#7FD4FF}
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
button{font:inherit;font-size:24px;color:#fff;background:#1B2633;border:3px solid #3A4A5C;border-radius:16px;padding:8px 18px;min-height:52px;cursor:pointer;margin:4px}
button.new{border-color:#3BD16F;background:#0D1B12}
.rr{display:grid;grid-template-columns:200px minmax(0,1fr);gap:10px;align-items:start;border-top:2px solid #24303C;padding:8px 0}
.rr b small{display:block;font-size:20px;color:#BFD3E6}
.ri{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px}
.ri figure{margin:0;text-align:center}.ri img{width:100%;border-radius:8px;display:block}.ri img.hid{filter:grayscale(1) brightness(.4)}.ri figcaption{font-size:18px}
@media (max-width:700px){.rr{grid-template-columns:1fr}}
.cmp{display:grid;grid-template-columns:repeat(2,minmax(0,220px));gap:10px}.cmp img{width:100%;border-radius:12px}
</style></head><body><div class="wrap">
<h1>老師，做好了，請看（C10）</h1>
<div class="done">✅ <b>這一次 做好的</b>（網址 直接 點）：
<br>📅 練習報告（打勾清單 每一次 換一種 排法、下面 〔❤ 原本的 愛心〕＋10 種 新愛心）：學生 做完 題目、遊戲 的 成績畫面；老師看板 點一個人 ➜〔📋 細節〕
<br>🦸 <a href="../../rpg/index.html">我的英雄</a>（選 英雄、武器、寵物、寶物、經驗值、金幣、商店、圖鑑）
<br>⚡ <a href="../../live/host.html">現場任務 大螢幕</a>（老師）／ <a href="../../live/index.html">學生</a>／ <a href="../../live/setup.html">大字版 Firebase 設定頁</a>
<br>📅 老師看板〔📅 一鍵設定〕、〔🔒 開關〕可以 設定 開放時間、〔🏆 學生排行榜 開／關〕拿掉了
<br>💼 職業單字網站 36 張 字卡 也 記 成績（看字卡、聽完字卡、老師 派任務）</div>

<h2>一、5 句 語音（a 唸 清楚 一點）</h2>
<p>新的 做法：a 前面 停 一下下，a 唸 清楚 的 ㄜ。電腦 聽寫：新的 5 句 <b>全部 聽對</b>（現在的 5 句 都 聽錯）。</p>
<table><tr><th style="width:40%">句子</th><th>現在</th><th>新的</th></tr>
${S5.map(x => `<tr><td>${x[0]}</td><td><button data-au="../../sentences/audio/${x[1]}.mp3">🔊 現在</button></td><td><button class="new" data-au="au/${x[2]}.mp3">🔊 新的</button><br><small style="font-size:20px;color:#9FB3C8">電腦 聽到：${(ASR[x[2]] || [''])[0]}</small></td></tr>`).join('')}</table>
${q('這 5 句 換成 新的 嗎？', opt('A', '5 句 都 換成 新的', '', true) + opt('B', '留 現在的') + opt('C', '一句 一句 選（請 寫：1 新、2 現在…）'))}

<h2>二、英雄、武器、寵物 的 稀有度</h2>
<p>愈 稀有 愈 貴、看起來 愈 強（★ 星星、光芒、登場特效、⚔ 戰力）；<b>不加 分數</b>。現在 照 號碼 排（★ 普通 8 個、★★ 稀有 8 個、★★★ 史詩 7 個、★★★★ 傳說 4 個、★★★★★ 神話 3 個）。寵物 1～15（可愛）放 ★、★★；16～30（很酷）放 ★★★ 以上。</p>
<h3>🦸 英雄（男、女 一樣：01～08 ★、09～16 ★★、17～23 ★★★、24～27 ★★★★、28～30 ★★★★★）</h3>${rar('h')}
<h3>⚔ 武器</h3>${rar('w')}<h3>🐾 寵物</h3>${rar('p')}
${q('稀有度 這樣 可以 嗎？', opt('A', '可以', '', true) + opt('B', '要改：請 寫「男 05 改 ★★★★★」這樣'))}

<h2>三、⚡ 現場任務 的 成績</h2>
<p>現在：現場任務 結束，老師 按〔🎁 發獎勵〕➜ 每一個人 ⭐ 經驗值 ＋10、答對 1 題 🪙 ＋1、再 加上 抽到的 獎勵（只 進 〔🦸 我的英雄〕）。<b>老師看板 的 練習次數、練了幾天 不算</b>。</p>
${q('現場任務 要不要 也 算進 老師看板 的「練習次數、練了幾天、正確率」？', opt('A', '不算（現在 這樣）', '現場任務 是 全班 一起 玩，有的 題目 被干擾、有人 抽到 刪掉 2 個，正確率 不公平') + opt('B', '算：一場 ＝ 練習次數 ＋1、那一天 算 練了 1 天（正確率 不算）', '肯參加 就有 練習 的 紀錄', true) + opt('C', '全部 都算（含 正確率）'))}

<h2>四、女 29 的 新圖</h2>
<p>老師 上傳的「新的 女 29」跟 <b>女 17</b>（Cyber Valkyrie Pilot）是 <b>同一張</b>（電腦 一個點 一個點 比，完全 一樣），所以 女 29 <b>先 不放</b>（學生 選不到）。女 25 已經 換成 新圖 ✅。</p>
<div class="cmp"><figure style="margin:0"><img src="../../rpg/chars/g17.jpg" alt="女 17"><figcaption>女 17（現在）</figcaption></figure><figure style="margin:0"><img src="../../rpg/chars/g25.jpg" alt="女 25"><figcaption>新的 女 25 ✅</figcaption></figure></div>
${q('女 29', opt('A', '下一個 對話 上傳 新的 女 29（換好 才放）', '', true) + opt('B', '女 29 不要了'))}
<div class="done">回答例：<b>「全部照建議」</b>或<b>「1 A、2 B 男 05 改 ★★★★★…」</b>。</div>
</div>
<script>
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button[data-au]');if(!b)return;try{new Audio(b.getAttribute('data-au')).play()}catch(x){}});
</script>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('C10 ok：' + QN + ' 題');
