/* rpg/_build.js — 戰神之路（舊名 🦸 我的英雄；2026-10-18 第十次老師改名）（rpg/index.html）：選英雄、武器、寵物、外觀寶物、經驗值、金幣、商店、圖鑑（2026-10-17 老師看完 C9（第八次）；規格 rpg/CLAUDE.md）
 *   node rpg/_build.js
 * 規則（價錢、稀有度、等級、經驗值、金幣）全部在 score/_calc.js 的 rp…（伺服器、這一頁、量測同一份）；這一頁只負責畫。
 * 圖：rpg/chars/（男 b01～b30、女 g01～g31）、rpg/weapons/w01～w30、rpg/pets/p01～p30（切法 rpg/_crop.py）；🏪 商城 rpg/shop/s0101～（切法 rpg/_crop_shop.py；穿在身上 rpg/_wear_rt.js）。
 * 登入用成績系統同一個（score/_client.js 的 home()）；買東西、換裝都送伺服器（{a:'rpg'}），平板改不了金幣。 */
const fs = require('fs'), path = require('path');
const SC = require('../score/_calc.js'), CL = require('../score/_client.js');
const CAT = { R: SC.RPR, P: SC.RPP, L: SC.RPL, T: SC.RPT, SET: SC.RPSET, HIDE: SC.RPHIDE, X: SC.RPX, C: SC.RPC, S: SC.RPS, SON: SC.RPSON, SP: SC.RPSP, SL: SC.RPSL };
/* 🏪 上架的類：20 張商店卡＋20 張穿在身上的圖都要有 */
Object.keys(SC.RPSON).forEach(c => { for (let n = 1; n <= 20; n++) { const id = 's' + String(c).padStart(2, '0') + String(n).padStart(2, '0');
  ['.jpg', 'i.webp'].forEach(x => { if (!fs.existsSync(path.join(__dirname, 'shop', id + x))) throw new Error('rpg：商城少了圖 ' + id + x + '（python3 -I rpg/_crop_shop.py）'); }); } });
['h', 'w', 'p'].forEach(k => Object.keys(SC.RPR[k]).forEach(id => {
  const f = path.join(__dirname, k === 'h' ? 'chars' : k === 'w' ? 'weapons' : 'pets', id + '.jpg');
  if (!fs.existsSync(f)) throw new Error('rpg：少了圖 ' + f);
}));
const html = `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>戰神之路</title>
<style>
@font-face{font-family:Andika;src:url(../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
/* 2026-10-18 第十次（老師：介面粗糙 ➜ 更精緻、更有質感、更簡潔舒適）：深色玻璃面板＋金色細線；一格一件事；字 ≧ 18px、按鈕 ≧ 48px */
:root{color-scheme:dark;--bg:#06080F;--pn:rgba(18,26,42,.78);--pn2:rgba(255,255,255,.045);--bd:rgba(255,255,255,.09);--gold:#FFD54A;--gold2:#F2B33D;--tx:#F3F6FA;--mut:#A8B6C9;--ok:#3BD16F;--line:#2A3A50}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--tx);font-family:Andika,"PingFang TC","Microsoft JhengHei",sans-serif;font-weight:700;-webkit-tap-highlight-color:transparent}
body{padding:0 max(14px,env(safe-area-inset-right)) 48px max(14px,env(safe-area-inset-left));touch-action:manipulation;background:radial-gradient(1200px 600px at 50% -10%,#16223A 0,transparent 70%),var(--bg)}
button{font:inherit;font-weight:700;color:var(--tx);cursor:pointer;touch-action:manipulation}
button:active{transform:scale(.97)}
#rp{max-width:1280px;margin:0 auto}
/* ── 封面（老師的照片 rpg/cover.webp；小圖示 cover_icon.webp，rpg/_cover.py） ── */
.cov{position:relative;margin:10px 0 16px;border-radius:26px;overflow:hidden;height:clamp(170px,27vh,300px);border:1px solid rgba(255,213,74,.35);box-shadow:0 18px 40px rgba(0,0,0,.55)}
.cov>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 32%}
.cov::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,8,15,.15) 0,rgba(6,8,15,.05) 40%,rgba(6,8,15,.85) 100%)}
.cov .home{position:absolute;z-index:2;left:14px;top:14px}
.cov h1{position:absolute;z-index:2;left:0;right:0;bottom:10px;margin:0;text-align:center;line-height:1;font-weight:400}
/* 2026-10-18 第十一次 老師：「戰神之路」字體放大、豪邁書法字體、質感提升、氣勢強大 ➜ 毛筆字 Yuji Boku（SIL OFL，只取這 4 個字 rpg/fonts/zs.woff2，3 KB）
   金屬金漸層＋深色描邊＋橘紅光暈，一道光每 6 秒掃過去一次 */
@font-face{font-family:ZS;src:url(fonts/zs.woff2) format('woff2');font-display:block}
.cov h1 .zs{display:inline-block;font-family:ZS,serif;font-size:clamp(66px,12.5vh,132px);letter-spacing:.06em;padding:0 .1em;
  background:linear-gradient(100deg,#FFF3C4 0,#FFD54A 22%,#B8741A 42%,#FFE58A 50%,#B8741A 58%,#FFD54A 78%,#FFF3C4 100%);background-size:250% 100%;background-position:100% 0;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;-webkit-text-stroke:1.5px rgba(70,28,0,.85);
  filter:drop-shadow(0 4px 0 #3A1600) drop-shadow(0 0 18px rgba(255,120,30,.75)) drop-shadow(0 6px 16px rgba(0,0,0,.95));animation:zsShine 6s ease-in-out infinite}
@keyframes zsShine{0%,55%{background-position:100% 0}85%,100%{background-position:0 0}}
@media (prefers-reduced-motion:reduce){.cov h1 .zs{animation:none}}
.cov h1 small{display:block;font-size:clamp(18px,2.4vh,24px);letter-spacing:.3em;color:#E8EEF7;margin-top:4px;text-shadow:0 2px 6px #000}
.home{display:inline-flex;align-items:center;gap:6px;min-height:52px;padding:6px 18px;border-radius:999px;background:rgba(10,12,20,.72);border:2px solid var(--gold);color:#FFE9A8;text-decoration:none;font-size:clamp(19px,2.4vh,24px);backdrop-filter:blur(6px)}
.tic{height:1.15em;width:2.3em;object-fit:cover;border-radius:.25em;border:1.5px solid var(--gold);vertical-align:-.2em;margin-right:.3em}
#rpout{text-align:center;padding:20px 10px;font-size:clamp(26px,3.6vh,38px)}
#rpout .big{display:inline-block;margin-top:18px;font-size:clamp(30px,4.4vh,44px);padding:12px 44px;border-radius:999px;background:linear-gradient(180deg,#4A3A0C,#2A2006);border:3px solid var(--gold);color:#FFE9A8;min-height:80px;box-shadow:0 0 24px rgba(255,213,74,.35)}
#rpwait{text-align:center;font-size:30px;padding:40px}
/* ── 舞台：英雄（左）＋數字卡（右） ── */
.stage{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:18px;align-items:stretch;background:linear-gradient(160deg,#0F1B2E,#070B14);border:1px solid var(--bd);border-radius:26px;padding:18px;position:relative;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 18px 40px rgba(0,0,0,.45)}
.stage.bg8{background:radial-gradient(ellipse at 30% 20%,#2B1A5A,#060A1E 60%),#060A1E}
.stage.bg8::before{content:'';position:absolute;inset:0;background-image:radial-gradient(2px 2px at 10% 20%,#fff,transparent),radial-gradient(2px 2px at 30% 70%,#cfe,transparent),radial-gradient(1.5px 1.5px at 55% 30%,#fff,transparent),radial-gradient(2px 2px at 80% 60%,#fde,transparent),radial-gradient(1.5px 1.5px at 90% 15%,#fff,transparent),radial-gradient(2px 2px at 65% 85%,#fff,transparent);animation:tw 3s ease-in-out infinite alternate;pointer-events:none}
@keyframes tw{to{opacity:.4}}
@media (max-width:900px){.stage{grid-template-columns:1fr}}
.team{position:relative;isolation:isolate;display:flex;align-items:flex-end;align-self:center;justify-content:center;gap:12px;min-height:clamp(300px,46vh,460px);padding-top:44px}
.team::after{content:'';position:absolute;left:8%;right:8%;bottom:-6px;height:26px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,213,74,.28),transparent);z-index:-3}
.hc{position:relative;isolation:isolate;width:min(62%,320px);border-radius:18px;padding:4px;background:var(--rc,#8A9AAA);box-shadow:0 0 0 2px rgba(0,0,0,.8),0 14px 30px rgba(0,0,0,.6)}
.hc img{display:block;width:100%;border-radius:14px}
.hc .stars{position:absolute;z-index:3;left:0;right:0;top:-20px;text-align:center;font-size:24px;letter-spacing:-2px;text-shadow:0 0 6px #000;color:#FFE07A}
.r3{box-shadow:0 0 18px 2px rgba(90,176,255,.7)}.r4{box-shadow:0 0 26px 4px rgba(181,123,255,.85);animation:glow4 2.4s ease-in-out infinite}
.r5{box-shadow:0 0 34px 8px rgba(255,213,74,.9);animation:glow5 2s ease-in-out infinite}
@keyframes glow4{50%{box-shadow:0 0 36px 10px rgba(181,123,255,.95)}}@keyframes glow5{50%{box-shadow:0 0 50px 16px rgba(255,170,0,1)}}
.rays{position:absolute;inset:-40%;background:conic-gradient(from 0deg,transparent 0 10deg,rgba(255,220,120,.18) 10deg 20deg,transparent 20deg 40deg,rgba(255,220,120,.18) 40deg 50deg,transparent 50deg 70deg,rgba(255,220,120,.18) 70deg 80deg,transparent 80deg);animation:spin 12s linear infinite;pointer-events:none;z-index:-1}
@keyframes spin{to{transform:rotate(360deg)}}
.wc,.pc{position:relative;border-radius:14px;padding:3px;background:var(--rc,#8A9AAA);box-shadow:0 10px 22px rgba(0,0,0,.55)}
.wc{width:min(26%,130px);align-self:center}.wc img,.pc img{display:block;width:100%;border-radius:11px}
.pc{width:min(28%,140px)}.pc.s0{transform:scale(.82);transform-origin:bottom}.pc.s2{animation:evo 2.4s ease-in-out infinite}
@keyframes evo{50%{filter:drop-shadow(0 0 14px #7FD4FF)}}
.pc .pst{position:absolute;left:50%;bottom:-14px;transform:translateX(-50%);white-space:nowrap;background:#0B1830;border:2px solid #7FD4FF;border-radius:999px;padding:0 10px;font-size:18px}
.empty{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;text-align:center;border:2px dashed #4A5A6C;border-radius:16px;color:#B5C4D6;font-size:20px;padding:8px;aspect-ratio:3/4;background:rgba(255,255,255,.03)}
.empty .tic{width:4.6em;height:2.3em;margin:0}
/* 寶物外觀（舊的 10 種） */
.halo{position:absolute;z-index:2;left:50%;top:-40px;width:46%;height:26px;transform:translateX(-50%);border-radius:50%;border:6px solid #FFE07A;box-shadow:0 0 18px #FFE07A;animation:hb 2s ease-in-out infinite}
@keyframes hb{50%{transform:translate(-50%,-6px)}}
.cape{position:absolute;inset:8% -14% 2%;background:linear-gradient(160deg,#C62828,#5A0E0E);clip-path:polygon(20% 0,80% 0,100% 100%,0 100%);z-index:-1;border-radius:12px;animation:cp 3s ease-in-out infinite}
@keyframes cp{50%{clip-path:polygon(18% 0,82% 0,96% 100%,4% 100%)}}
.feet{position:absolute;left:0;right:0;bottom:-6px;height:18px;background:radial-gradient(circle,#FFE07A 30%,transparent 32%) 0 0/36px 18px repeat-x;animation:ft 1.6s linear infinite;opacity:.8}
@keyframes ft{to{background-position:36px 0}}
.fw{position:absolute;inset:0;pointer-events:none}.fw i{position:absolute;width:8px;height:8px;border-radius:50%;left:50%;top:40%;animation:fwb 1.6s ease-out forwards;background:var(--c)}
@keyframes fwb{to{transform:translate(var(--x),var(--y));opacity:0}}
.emo{position:absolute;right:-6%;top:6%;background:#fff;color:#000;border-radius:18px;padding:2px 10px;font-size:34px;animation:hb 2.4s ease-in-out infinite}
.pose{animation:pose 3.2s ease-in-out infinite}@keyframes pose{0%,70%,100%{transform:none}78%{transform:translateY(-22px) rotate(-3deg)}86%{transform:translateY(0) rotate(2deg)}}
.hat{position:absolute;left:50%;top:-30px;transform:translateX(-50%);font-size:40px}
.wglow{animation:wg 1.6s ease-in-out infinite}@keyframes wg{50%{box-shadow:0 0 22px 6px #5AF0FF}}
.team.mt{padding-bottom:clamp(40px,8vh,80px)}
/* ⚔ 出招（2026-10-18 第十次：老師「打得比較痛」太幼稚 ➜ 演給學生看：你的英雄出招、一擊幾點） */
.slash{position:absolute;inset:0;z-index:30;pointer-events:none;overflow:hidden}
.slash i{position:absolute;left:-10%;width:120%;height:7px;border-radius:99px;background:linear-gradient(90deg,transparent,#fff 40%,#FFE07A 60%,transparent);box-shadow:0 0 18px #FFD54A,0 0 40px #FF7A3D;transform-origin:left center;transform:rotate(var(--r)) scaleX(0);animation:sl .5s cubic-bezier(.2,.9,.3,1) forwards;animation-delay:var(--d)}
@keyframes sl{60%{transform:rotate(var(--r)) scaleX(1);opacity:1}100%{transform:rotate(var(--r)) scaleX(1);opacity:0}}
.slash b{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);font-size:clamp(56px,10vh,110px);color:#fff;-webkit-text-stroke:2px #8A2A00;text-shadow:0 0 18px #FF8A3D,0 0 40px #FFD54A;white-space:nowrap;animation:dmg 1.5s ease-out forwards}
@keyframes dmg{0%{transform:translate(-50%,-50%) scale(.2);opacity:0}25%{transform:translate(-50%,-50%) scale(1.25);opacity:1}45%{transform:translate(-50%,-50%) scale(1)}100%{transform:translate(-50%,-90%) scale(1);opacity:0}}
.stage.hit{animation:shake .45s linear}@keyframes shake{20%{transform:translate(-6px,2px)}40%{transform:translate(6px,-2px)}60%{transform:translate(-4px,1px)}80%{transform:translate(3px,0)}}
.stage.hit .hc{animation:lunge .5s cubic-bezier(.3,1.6,.5,1)}@keyframes lunge{40%{transform:translateX(18px) scale(1.06) rotate(2deg)}}
/* 右邊：數字卡 */
.stat{display:flex;flex-direction:column;gap:12px;position:relative;z-index:1}
.tile{background:var(--pn);border:1px solid var(--bd);border-radius:20px;padding:12px 16px;backdrop-filter:blur(8px);box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
.lab{font-size:clamp(18px,2.2vh,22px);color:var(--mut);letter-spacing:.04em}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.idr{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.idl{position:relative;display:inline-block;padding:4px 18px;border-radius:12px;background:rgba(0,0,0,.4);border:1px solid var(--bd);font-size:clamp(22px,2.8vh,28px)}.idl.gf{border:3px solid var(--gold);box-shadow:0 0 12px rgba(255,213,74,.6)}
.lv{display:flex;align-items:baseline;gap:10px;margin:2px 0 8px}.lv b{font-size:clamp(46px,7vh,70px);color:var(--gold);line-height:1}.lv span{font-size:clamp(22px,2.8vh,28px)}
.bar{height:22px;border-radius:999px;background:#0B121D;border:1px solid #2C3A4C;overflow:hidden;box-shadow:inset 0 2px 4px rgba(0,0,0,.6)}.bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#3B7BFF,#7FD4FF);box-shadow:0 0 12px #5AB0FF;transition:width 1.2s ease-out}
.sub{font-size:clamp(18px,2.2vh,22px);color:#C9D6E6;margin-top:6px}
.big2{display:block;font-size:clamp(36px,5.4vh,54px);line-height:1.1;margin-top:2px}.coinT .big2{color:#FFE07A}.powT .big2{color:#FFB3B3}
.atk{border-color:rgba(255,138,61,.45);background:linear-gradient(135deg,rgba(80,24,8,.6),rgba(18,26,42,.78))}
.atkr{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.atkr .big2{color:#fff;text-shadow:0 0 14px #FF8A3D}
.meter{flex:1;min-width:160px}
.mbar{position:relative;height:18px;border-radius:999px;background:#140A06;border:1px solid #5A2A14;overflow:hidden}.mbar i{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:linear-gradient(90deg,#FF7A3D,#FFD54A);box-shadow:0 0 12px #FF8A3D}
.mlab{display:flex;justify-content:space-between;font-size:18px;color:#E9C9B8;margin-top:2px}
.go{min-height:56px;padding:4px 20px;border-radius:999px;border:2px solid #FF9A5A;background:linear-gradient(180deg,#7A2A0C,#3A1406);font-size:clamp(20px,2.6vh,26px);box-shadow:0 0 16px rgba(255,122,61,.35)}
.how1{min-height:56px;padding:4px 20px;border-radius:999px;border:2px solid #5AB0FF;background:rgba(20,40,70,.8);font-size:clamp(20px,2.6vh,24px)}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chips span{display:inline-block;background:rgba(255,213,74,.1);border:1px solid rgba(255,213,74,.5);border-radius:999px;padding:2px 14px;font-size:clamp(18px,2.2vh,22px)}
.note{color:var(--mut);font-size:clamp(18px,2.2vh,22px)}
/* 分頁 */
.tabs{display:flex;flex-wrap:wrap;gap:6px;margin:18px 0 12px;padding:6px;background:var(--pn);border:1px solid var(--bd);border-radius:22px}
.tabs button{flex:1 1 auto;min-height:56px;padding:6px 14px;border-radius:16px;background:transparent;border:0;font-size:clamp(20px,2.5vh,25px);color:#D5DFEC;white-space:nowrap}
.tabs button.on{background:linear-gradient(180deg,#4A3A0C,#2A2006);color:#FFE9A8;box-shadow:inset 0 0 0 2px var(--gold),0 6px 16px rgba(0,0,0,.4)}
.sub2{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}.sub2 button{min-height:52px;padding:4px 18px;border-radius:999px;background:var(--pn2);border:1px solid var(--bd);font-size:20px}.sub2 button.on{border:2px solid #7FD4FF;color:#BFE6FF;background:rgba(40,90,140,.35)}
.free{background:linear-gradient(90deg,rgba(20,70,40,.7),rgba(18,26,42,.6));border:1px solid rgba(59,209,111,.6);border-radius:18px;padding:10px 16px;font-size:clamp(21px,2.7vh,27px);margin-bottom:12px}
.rar{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}.rar span{font-size:18px;padding:2px 12px;border-radius:999px;border:1px solid;background:rgba(0,0,0,.25)}
/* 卡片 */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(46%,170px),1fr));gap:12px}
.it{position:relative;display:flex;flex-direction:column;align-items:stretch;gap:6px;border-radius:18px;padding:6px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(0,0,0,.25));border:1px solid var(--bd);box-shadow:inset 0 3px 0 var(--rc,#34475C),0 8px 18px rgba(0,0,0,.35);min-height:120px;text-align:center;transition:transform .15s}
.it img{width:100%;border-radius:12px;display:block}.it .st{font-size:18px;color:var(--rc,#FFE07A);letter-spacing:-1px}
.it .pr{font-size:20px;border-radius:999px;padding:3px 6px;background:rgba(0,0,0,.45)}.it .pr.lock{color:#FF9F9F}.it .pr.ok{color:#7BF0A8}.it .pr.eq{background:#1B4A2E;color:#fff}.it .pr.fr{background:#0F2A1C;color:#7BF0A8}
.it .pr small{font-size:18px}
.it.dim img{filter:grayscale(.75) brightness(.6)}
.it.eqd{box-shadow:inset 0 3px 0 var(--rc,#34475C),0 0 0 3px #3BD16F,0 0 18px rgba(59,209,111,.5)}
.tre{font-size:44px;line-height:1.3}.tre small{display:block;font-size:20px}
/* 🏪 商城 */
.scat{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(46%,190px),1fr));gap:8px;margin:0 0 12px}
.scat button{display:flex;align-items:center;gap:8px;min-height:60px;padding:4px 10px;border-radius:16px;background:var(--pn2);border:1px solid var(--bd);font-size:clamp(18px,2.2vh,22px);text-align:left;line-height:1.15}
.scat button img{width:48px;height:48px;object-fit:cover;border-radius:10px;flex:none}
.scat button.on{background:linear-gradient(180deg,#4A3A0C,#2A2006);color:#FFE9A8;box-shadow:inset 0 0 0 2px var(--gold)}.scat button.soon{color:#8A9AAA;border-style:dashed}
.scat button em{display:block;font-style:normal;font-size:18px;color:#7F8EA3}
.scat .sic{width:48px;height:48px;flex:none;display:flex;align-items:center;justify-content:center;font-size:30px;border-radius:10px;background:rgba(255,255,255,.04)}
.srow{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:16px 0 8px;font-size:clamp(21px,2.6vh,26px);color:#CFE6FF}.srow b{color:#FFE07A}.srow .stg{font-size:18px;padding:2px 12px;border-radius:999px;background:rgba(255,213,74,.12);border:1px solid rgba(255,213,74,.5);color:#FFE9A8}
.sgrid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}@media (max-width:700px){.sgrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.soon1{background:var(--pn);border:2px dashed #4A5A6C;border-radius:20px;padding:26px 18px;text-align:center;font-size:clamp(24px,3.2vh,32px)}
.how table{border-collapse:separate;border-spacing:0;width:100%;font-size:clamp(20px,2.5vh,25px);border:1px solid var(--bd);border-radius:18px;overflow:hidden;margin-top:14px}.how td,.how th{border-bottom:1px solid var(--bd);padding:10px 14px;text-align:left;vertical-align:middle}.how th{background:rgba(255,255,255,.05)}.how tr:last-child td{border-bottom:0}
.set{display:flex;flex-wrap:wrap;align-items:center;gap:8px;border:1px solid var(--bd);border-radius:16px;padding:8px 12px;margin:8px 0;font-size:22px;background:var(--pn2)}.set.ok{border-color:var(--gold);background:rgba(255,213,74,.08)}
.set img{width:64px;border-radius:8px}.set img.no{filter:grayscale(1) brightness(.4)}
/* ❓ 經驗值、金幣 秒懂動畫（2026-10-18 第十次）：5 幕、一幕一句話；點下面的按鈕跳到那一幕 */
.tut{background:linear-gradient(160deg,#101C30,#070B14);border:1px solid var(--bd);border-radius:24px;padding:14px;box-shadow:0 18px 40px rgba(0,0,0,.45)}
.tst{position:relative;height:clamp(300px,44vh,440px);border-radius:18px;overflow:hidden;background:radial-gradient(ellipse at 50% 100%,rgba(255,213,74,.12),transparent 60%),#0A1220}
.tsc{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:flex-start;padding:16px}
.tsc.on{display:flex}
.cap{font-size:clamp(26px,4vh,42px);text-align:center;line-height:1.3;opacity:0;animation:capIn .5s ease-out .1s forwards}
.cap b{color:#FFE07A}.cap .xp{color:#9FD8FF}
@keyframes capIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.vis{position:relative;flex:1;width:100%;display:flex;align-items:center;justify-content:center;gap:clamp(14px,3vw,40px)}
.tcard{position:relative;background:#F4F1E8;color:#222;border-radius:16px;padding:10px 18px;font-size:clamp(22px,3vh,30px);box-shadow:0 10px 24px rgba(0,0,0,.5);text-align:left}
.tcard i{font-style:normal;display:block;opacity:0;animation:pop .35s ease-out forwards}.tcard i:nth-child(2){animation-delay:.5s}.tcard i:nth-child(3){animation-delay:.9s}.tcard i:nth-child(4){animation-delay:1.3s}
.fly{position:absolute;font-size:clamp(30px,4.4vh,44px);opacity:0;white-space:nowrap;animation:fly 1.1s ease-in forwards;animation-delay:var(--d,1.7s);left:var(--x0,30%);top:var(--y0,40%)}
@keyframes fly{0%{opacity:0;transform:scale(.4)}20%{opacity:1;transform:scale(1.2)}100%{opacity:0;transform:translate(var(--dx,200px),var(--dy,0)) scale(.7)}}
.tbar{width:min(40vw,360px)}.tbar .bar{height:30px}.tbar .bar i{transition:none;animation:fill 1.2s ease-out forwards;animation-delay:var(--d,2.4s);width:var(--a,30%)}
@keyframes fill{to{width:var(--b,85%)}}
.tbar .lab{text-align:center;margin-top:6px}
.lvup{position:absolute;left:50%;top:6%;transform:translateX(-50%);font-size:clamp(34px,5.4vh,56px);color:#FFE07A;text-shadow:0 0 18px #FFB000;opacity:0;animation:boom .8s cubic-bezier(.2,1.6,.4,1) forwards;animation-delay:1.3s;white-space:nowrap}
@keyframes boom{from{opacity:0;transform:translateX(-50%) scale(.2)}to{opacity:1;transform:translateX(-50%) scale(1)}}
.tlock{position:relative;width:clamp(120px,18vh,180px)}.tlock img{width:100%;border-radius:14px;filter:grayscale(1) brightness(.45);animation:unl .6s ease-out forwards;animation-delay:2.4s}
.tlock span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:56px}
.tlock .l1{animation:hideI .2s forwards;animation-delay:2.3s}.tlock .l2{opacity:0;animation:pop .4s forwards;animation-delay:2.3s}
@keyframes unl{to{filter:none;box-shadow:0 0 30px #FFD54A}}@keyframes hideI{to{opacity:0}}
@keyframes pop{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:none}}
.tchips{display:flex;flex-direction:column;gap:12px}.tchips span{font-size:clamp(22px,3.2vh,32px);background:rgba(0,0,0,.4);border:1px solid var(--bd);border-radius:999px;padding:6px 20px;opacity:0;animation:pop .4s ease-out forwards}
.tchips span:nth-child(1){animation-delay:.4s}.tchips span:nth-child(2){animation-delay:1.1s}.tchips span:nth-child(3){animation-delay:1.8s}
.tcoin{font-size:clamp(44px,7vh,72px);color:#FFE07A;text-shadow:0 0 18px rgba(255,213,74,.6)}
.tcoin b{display:inline-block;min-width:2.2em}
.thero{position:relative;width:clamp(120px,22vh,200px);isolation:isolate}.thero>img{width:100%;border-radius:14px;display:block;border:3px solid #8A9AAA}
.thero>img:not(.on2){animation:glowH .8s ease-out 2.8s forwards}@keyframes glowH{to{border-color:#FFD54A;box-shadow:0 0 30px 6px rgba(255,213,74,.8)}}
.thero .on2{position:absolute;left:50%;top:56%;width:175%;transform:translate(-50%,-50%);z-index:-1;opacity:0;animation:wear .8s ease-out forwards;animation-delay:2.2s}
@keyframes wear{from{opacity:0;transform:translate(-50%,-50%) scale(.4)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
.titem{width:clamp(110px,18vh,170px);animation:toHero 1s ease-in forwards;animation-delay:1.3s}.titem img{width:100%;border-radius:14px}
@keyframes toHero{to{transform:translateX(clamp(120px,22vw,300px)) scale(.3);opacity:0}}
.tpay{font-size:clamp(28px,4vh,40px);color:#FFE07A;opacity:0;animation:pop .4s ease-out forwards;animation-delay:.6s}
.tneed{display:flex;flex-direction:column;gap:14px;font-size:clamp(24px,3.4vh,34px)}.tneed span{background:rgba(0,0,0,.4);border:1px solid var(--bd);border-radius:16px;padding:8px 18px;opacity:0;animation:pop .4s ease-out forwards}
.tneed span:nth-child(1){animation-delay:.5s}.tneed span:nth-child(2){animation-delay:1.2s}.tneed span:nth-child(3){animation-delay:2s;border-color:var(--gold);color:#FFE9A8}
.tnav{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;justify-content:center}
.tnav button{min-height:52px;padding:4px 16px;border-radius:999px;background:var(--pn2);border:1px solid var(--bd);font-size:clamp(18px,2.2vh,22px)}.tnav button.on{border:2px solid var(--gold);color:#FFE9A8}
.tnav .re{border:2px solid #5AB0FF}
@media (prefers-reduced-motion:reduce){.tsc *{animation-duration:.01s!important;animation-delay:0s!important}.slash,.stage.hit,.stage.hit .hc{animation:none}}
/* 對話框 */
#rpm{position:fixed;inset:0;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;z-index:50;padding:16px;backdrop-filter:blur(4px)}
#rpm.on{display:flex}
#rpm .box{background:linear-gradient(180deg,#121B2B,#0A0F18);border:2px solid var(--gold);border-radius:26px;padding:22px;max-width:560px;width:100%;text-align:center;font-size:clamp(24px,3vh,32px);position:relative;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.7)}
#rpm .box img{width:min(60%,240px);border-radius:14px}
#rpm .bt{display:flex;gap:12px;justify-content:center;margin-top:16px;flex-wrap:wrap}#rpm .bt button{min-height:64px;padding:6px 28px;border-radius:999px;font-size:clamp(24px,3vh,30px);border:2px solid}
#rpm .yes{background:#0F3323;border-color:var(--ok)}#rpm .no{background:#1B2633;border-color:#4A5A6C}
#rpm.cele .box img{animation:pop2 .8s cubic-bezier(.2,1.6,.4,1)}@keyframes pop2{from{transform:scale(.2) rotate(-20deg);opacity:0}}
</style></head><body>
${CL.home(0, '../', 'home')}
<main id="rp">
 <header class="cov"><img src="cover.webp" alt="戰神之路"><a class="home" href="../index.html">🏠 回首頁</a><h1><span class="zs">戰神之路</span><small>練習 ➜ 升級 ➜ 變強</small></h1></header>
 <div id="rpout" hidden><div>🔑 先 登入 ➜ 才看得到 你的 英雄</div><button class="big" id="rpIn">🔑 登入</button><div class="note" style="margin-top:20px">⭐ 經驗值、🪙 金幣 都是 從 你的 練習 算出來的：練得 愈多、改對 愈多，英雄 就 愈強！</div></div>
 <div id="rpwait" hidden>⏳ 正在拿 你的 英雄…</div>
 <div id="rpin" hidden>
  <section class="stage" id="stage"></section>
  <nav class="tabs" id="tabs"><button data-t="h" class="on"><img class="tic" src="cover_icon.webp" alt="">英雄</button><button data-t="w">⚔ 武器</button><button data-t="p">🐾 寵物</button><button data-t="t">✨ 寶物</button><button data-t="m">🏪 榮耀 商城</button><button data-t="s">📖 圖鑑</button><button data-t="q">❓ 怎麼賺</button></nav>
  <section id="shop"></section>
 </div>
</main>
<div id="rpm"><div class="box" id="rpmb"></div></div>
<script>
var CAT=${JSON.stringify(CAT)};
var RV=null,TAB='h',SEX='b',LAST='',BUSY=false,SCAT=1;
var DIR={h:'chars',w:'weapons',p:'pets'},RC=['#34475C','#8A9AAA','#3BD16F','#5AB0FF','#B57BFF','#FFD54A'],RN=['','基本','稀有','史詩','傳說','神話'];
function sOf(id){var m=/^s(\\d\\d)(\\d\\d)$/.exec(id);return m?{c:+m[1],n:+m[2],row:Math.floor((+m[2]-1)/5),slot:CAT.S[+m[1]-1][0]}:null}
function kOf(id){var S=sOf(id);if(S)return S.slot==='w'||S.slot==='p'?S.slot:'s';return /^[bg]\\d\\d$/.test(id)?'h':/^w/.test(id)?'w':/^p/.test(id)?'p':'t'}
function star(id){var S=sOf(id);if(S)return S.row+2;var k=kOf(id);return k==='t'?0:(CAT.R[k][id]||0)}
function img(id){return sOf(id)?'shop/'+id+'.jpg':DIR[kOf(id)]+'/'+id+'.jpg'}
function stars(n){var s='';for(var i=0;i<n;i++)s+='★';return s}
function tre(id){for(var i=0;i<CAT.T.length;i++)if(CAT.T[i][0]===id)return CAT.T[i];return null}
function price(id){var S=sOf(id);if(S)return CAT.SP[S.row];var k=kOf(id);return k==='t'?tre(id)[2]:CAT.P[star(id)]}
function need(id){var S=sOf(id);if(S)return CAT.SL[S.row];return kOf(id)==='t'?1:CAT.L[star(id)]}
function own(id){return !!RV&&RV.st.own[kOf(id)].indexOf(id)>=0}
function isEq(id){var k=kOf(id);return !!RV&&(k==='s'?(RV.st.eq.s||{})[sOf(id).slot]===id:k==='t'?RV.st.eq.t.indexOf(id)>=0:RV.st.eq[k]===id)}
function freeOk(id){var k=kOf(id);return !!RV&&k!=='t'&&star(id)===1&&!RV.st.free[k]&&!RV.st.own[k].length}
function show(id){document.getElementById(id).hidden=false}function hide(id){document.getElementById(id).hidden=true}
/* ── 舞台 ── */
function nf(x){return (+x||0).toLocaleString()}
function dmgOf(pw){return 10+Math.min(20,Math.floor((+pw||0)/100))}   /* 跟 score/_calc.js rpDmg 一樣：基本 10 ＋ 戰力 ÷ 100，最多 30 */
function drawStage(){var V=RV,e=V.st.eq,T=e.t,ES=e.s||{},has=function(t){return T.indexOf(t)>=0},h='';
  var st=document.getElementById('stage');st.className='stage'+(has('t08')?' bg8':'');st.setAttribute('style',rwBg('../',ES));
  h+='<div class="team'+(ES.mt?' mt':'')+'">';
  if(e.h){var s=star(e.h);h+='<div class="hc rw-host r'+s+(has('t07')?' pose':'')+'" style="--rc:'+RC[s]+'">'+(s>=5?'<div class="rays"></div>':'')+rwBack('../',ES)+(has('t02')?'<div class="cape"></div>':'')+(has('t01')?'<div class="halo"></div>':'')+
    '<div class="stars">'+stars(s)+'</div><img src="'+img(e.h)+'" alt="我的英雄">'+(has('t06')?'<div class="emo">😎</div>':'')+(has('t03')?'<div class="feet"></div>':'')+(has('t04')?fwHTML():'')+rwFront('../',ES)+'</div>'}
  else h+='<div class="hc empty" style="width:min(62%,300px)"><img class="tic" src="cover_icon.webp" alt="">還沒有英雄<br>👇 下面 免費 選 1 個</div>';
  h+='<div style="position:relative;z-index:1;display:flex;flex-direction:column;gap:16px;width:min(30%,150px)">';
  h+=e.w?'<div class="wc r'+star(e.w)+(has('t10')?' wglow':'')+'" style="--rc:'+RC[star(e.w)]+';width:100%"><img src="'+img(e.w)+'" alt="我的武器"></div>':'<div class="empty">⚔<br>還沒有武器</div>';
  h+=e.p?'<div class="pc rw-host s'+V.petStage+'" style="--rc:'+RC[star(e.p)]+';width:100%">'+(has('t09')?'<div class="hat">🎩</div>':'')+rwPo('../',ES)+'<img src="'+img(e.p)+'" alt="我的寵物"><span class="pst">'+['🐣 寶寶','🐥 長大了','🐲 進化了'][V.petStage]+'</span></div>':'<div class="empty">🐾<br>還沒有寵物</div>';
  h+='</div></div>';
  var pct=Math.max(0,Math.min(100,(V.xp-V.lvAt)/(V.lvNext-V.lvAt)*100)),d=dmgOf(V.power);
  h+='<div class="stat"><div class="idr"><span class="idl rw-host'+(has('t05')?' gf':'')+'">'+rwNf('../',ES)+'🪪 '+SCID+'</span><button class="how1" data-go="q">❓ 經驗值、金幣 怎麼來</button></div>'+
    '<div class="tile"><div class="lab">⭐ 等級</div><div class="lv"><b>Lv '+V.lv+'</b><span>經驗值 '+nf(V.xp)+'</span></div><div class="bar"><i id="xpb" data-w="'+pct.toFixed(1)+'"></i></div><div class="sub">再 '+nf(V.lvNext-V.xp)+' ⭐ 升到 Lv '+(V.lv+1)+'</div></div>'+
    '<div class="row2"><div class="tile coinT"><div class="lab">🪙 金幣</div><b class="big2">'+nf(V.coins)+'</b></div><div class="tile powT"><div class="lab">⚔ 戰力</div><b class="big2">'+nf(V.power)+'</b></div></div>'+
    '<div class="tile atk"><div class="lab">💥 你的 一擊（⚡ 現場任務 打魔王）</div><div class="atkr"><b class="big2">'+d+'</b><div class="meter"><div class="mbar"><i style="width:'+((d-10)/20*100).toFixed(0)+'%"></i></div><div class="mlab"><span>基本 10</span><span>最猛 30</span></div></div>'+
      (e.h?'<button class="go" id="atkTry">⚔ 出招！</button>':'')+'</div><div class="sub">答對 1 題 ＝ 你的 英雄 出招 一次<br>裝備 愈強 ➜ 戰力 愈高 ➜ 一擊 愈猛</div></div>'+
    (e.p||V.medal||V.titles.length||V.chests?'<div class="chips">'+(e.p?'<span>🐾 陪你 練了 '+V.petDays+' 天（3 天 長大、7 天 進化）</span>':'')+(V.medal?'<span>🏅 勳章 ✕ '+V.medal+'</span>':'')+
      V.titles.map(function(t){return '<span>🏷 '+t+'</span>'}).join('')+(V.chests?'<span>🎁 保底 寶箱 ✕ '+V.chests+'</span>':'')+'</div>':'')+'</div>';
  st.innerHTML=h;setTimeout(function(){var b=document.getElementById('xpb');if(b)b.style.width=b.getAttribute('data-w')+'%'},60)}
/* ⚔ 出招：英雄往前衝、三道刀光、一擊的數字跳出來；有 💥 必殺特效 就一起放 */
function atk(){var st=document.getElementById('stage');if(!st||!RV||!RV.st.eq.h)return;var d=dmgOf(RV.power),o=document.createElement('div');
  st.classList.remove('hit');void st.offsetWidth;st.classList.add('hit');o.className='slash';o.setAttribute('aria-hidden','true');
  o.innerHTML='<i style="top:28%;--r:14deg;--d:.05s"></i><i style="top:46%;--r:-10deg;--d:.18s"></i><i style="top:36%;--r:4deg;--d:.3s"></i><b>💥 '+d+'</b>';st.appendChild(o);
  var fx=(RV.st.eq.s||{}).fx;if(fx)setTimeout(function(){rwFx('../',fx)},350);setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o);st.classList.remove('hit')},1600)}
function fwHTML(){var h='<div class="fw">',C=['#FFD54A','#FF6B6B','#7FD4FF','#7BF0A8','#D9A8FF'];for(var i=0;i<24;i++){var a=i/24*Math.PI*2,r=90+Math.random()*60;h+='<i style="--c:'+C[i%5]+';--x:'+Math.round(Math.cos(a)*r)+'px;--y:'+Math.round(Math.sin(a)*r)+'px;animation-delay:'+(i%3*.15)+'s"></i>'}return h+'</div>'}
/* ── 商店 ── */
function itemHTML(id){var k=kOf(id),s=star(id),o=own(id),eq=isEq(id),fr=!o&&freeOk(id),lk=!o&&RV.lv<need(id),pr=price(id),poor=!o&&!fr&&RV.coins<pr;
  var tag=eq?'<div class="pr eq">✅ 裝備中</div>':o?'<div class="pr ok">👆 點一下 裝上</div>':fr?'<div class="pr fr">🎁 免費</div>':lk?'<div class="pr lock">🔒 Lv '+need(id)+'</div>':'<div class="pr'+(poor?' lock':'')+'">🪙 '+pr+'</div>';
  if(k==='s'&&eq)tag='<div class="pr eq">✅ 裝備中<br><small>再點 ＝ 拿下來</small></div>';else if(k==='s'&&o)tag='<div class="pr ok">👆 點一下 裝備</div>';
  if(k==='t'){var t=tre(id);return '<button class="it'+(eq?' eqd':'')+'" data-id="'+id+'"><div class="tre">'+t[1].split(' ')[0]+'<small>'+t[1].split(' ').slice(1).join(' ')+'</small></div>'+tag+'</button>'}
  return '<button class="it'+(eq?' eqd':'')+(lk||poor?' dim':'')+'" data-id="'+id+'" style="--rc:'+RC[s]+'"><img loading="lazy" src="'+img(id)+'" alt="'+id+'"><div class="st">'+stars(s)+' '+RN[s]+'</div>'+tag+'</button>'}
function ids(k){var a=Object.keys(CAT.R[k]).filter(function(id){return !CAT.HIDE[id]&&(k!=='h'||id.charAt(0)===SEX)});
  a=a.sort(function(x,y){return (CAT.R[k][x]-CAT.R[k][y])||(x<y?-1:1)});
  return k==='h'?a:a.concat(RV.st.own[k].filter(function(id){return !!sOf(id)}))}   /* 🏪 商城買的魔法武器、新寵物 也放在這裡（換回來用） */
/* 🏪 榮耀 商城：10 類（上架的 ＝ 第 1 種的小圖）、每類 4 排（價錢、等級照排） */
function shopHTML(){var h='<div class="scat">'+CAT.S.map(function(x,i){var c=i+1,on=!!CAT.SON[c],cc=(c<10?'0':'')+c,ic=x[1].split(' ')[0],nm=x[1].split(' ').slice(1).join(' ');
    return '<button data-scat="'+c+'" class="'+(c===SCAT?'on ':'')+(on?'':'soon')+'">'+(on?'<img src="shop/s'+cc+'01.jpg" alt="">':'<span class="sic">'+ic+'</span>')+'<span>'+nm+(on?'':'<em>即將 上架</em>')+'</span></button>'}).join('')+'</div>';
  var X=CAT.S[SCAT-1];
  if(!CAT.SON[SCAT])return h+'<div class="soon1">'+X[1]+'<br>🔜 即將 上架<div class="note" style="margin-top:10px">老師 上傳 圖 以後，就 可以 用 🪙 金幣 換。</div></div>';
  var tip={au:'戴在 英雄 後面 會 轉',cp:'穿在 英雄 後面',fx:'⚔ 出招、答對 現場任務、做完 一次 的 時候 放出來',nf:'圍住 你的 號碼',bg:'換掉 英雄 後面 的 背景',po:'穿在 寵物 身上',w:'換成 你的 武器',p:'換成 你的 寵物',wg:'裝在 英雄 背後',mt:'讓 英雄 騎上去'}[X[0]];
  h+='<div class="note">'+X[1]+'：'+tip+'。只換 外觀（不加 分數）；同一類 身上 只 戴 1 個。</div>';
  for(var r=0;r<4;r++){h+='<div class="srow"><span>第 '+(r+1)+' 排</span><b>🪙 '+CAT.SP[r].toLocaleString()+'</b><span class="stg">'+(CAT.SL[r]>1?'Lv '+CAT.SL[r]:'Lv 1 就 可以')+'</span>'+(r===3?'<span class="stg">🎓 學霸 限定 神裝</span>':'')+'</div><div class="sgrid">';
    for(var n=r*5+1;n<=r*5+5;n++)h+=itemHTML('s'+(SCAT<10?'0':'')+SCAT+(n<10?'0':'')+n);h+='</div>'}
  return h}
/* ❓ 經驗值、金幣 秒懂動畫（2026-10-18 第十次，老師：學生不懂經驗值和金幣的用處、怎麼賺）：5 幕自己往下演，一幕一句話 */
var TUT={tm:0,cn:[]};
function tutHTML(){var hi=RV&&RV.st.eq.h?img(RV.st.eq.h):'chars/b01.jpg';
  var S=[
   ['📝 做完 一次 練習 ➜ <span class="xp">⭐ 經驗值 ＋10</span>','<div class="tcard"><b>📝 練習</b><i>✅ 第 1 題</i><i>✅ 第 2 題</i><i>🎉 做完了！</i></div><div class="tbar"><div class="bar"><i style="--a:30%;--b:80%"></i></div><div class="lab">⭐ 經驗值</div></div><span class="fly" style="--x0:30%;--y0:46%;--dx:clamp(120px,24vw,320px)">⭐ ＋10</span>'],
   ['⭐ 經驗值 存滿 ➜ <b>升級！</b>','<div class="lvup">🎉 Lv 4 ➜ Lv 5</div><div class="tbar"><div class="bar"><i style="--a:80%;--b:100%;--d:.2s"></i></div><div class="lab">等級 愈高 ➜ 打開 愈強 的 裝備</div></div><div class="tlock"><img src="shop/s0106.jpg" alt=""><span class="l1">🔒</span><span class="l2">🔓</span></div>'],
   ['答對、改對、進步 ➜ <b>🪙 金幣</b>','<div class="tchips"><span>✅ 答對 1 題　＋1</span><span>✗➜✓ 改對 1 題　＋3</span><span>⬆ 比 上一次 進步　＋10</span></div><div class="tcoin">🪙 <b id="tcn">0</b></div>'],
   ['🪙 金幣 ＝ 錢：<b>換 裝備</b>，英雄 變帥','<div style="text-align:center"><div class="titem"><img src="shop/s0202.jpg" alt=""></div><div class="tpay">🪙 －500</div></div><div class="thero"><img class="on2" src="shop/s0202i.webp" alt=""><img src="'+hi+'" alt=""></div>'],
   ['<b>Lv 夠</b> ＋ <b>🪙 夠</b> ➜ 換得到！','<div class="tneed"><span>🔓 Lv 10　你 Lv 10 ✅</span><span>🪙 要 2,500　你有 2,600 ✅</span><span>🎉 換到了！⭐ 留著、🪙 用掉</span></div>']];
  return '<div class="tut"><div class="tst" id="tst">'+S.map(function(x){return '<div class="tsc"><div class="cap">'+x[0]+'</div><div class="vis">'+x[1]+'</div></div>'}).join('')+'</div>'+
    '<div class="tnav">'+['1 ⭐ 經驗值','2 升級','3 🪙 金幣','4 換 裝備','5 兩個 都要'].map(function(t,i){return '<button data-tut="'+i+'">'+t+'</button>'}).join('')+'<button class="re" data-tut="0">▶ 再看 一次</button></div></div>'}
function tutStop(){clearTimeout(TUT.tm);TUT.cn.forEach(clearTimeout);TUT.cn=[]}
function tutGo(i){tutStop();var L=document.querySelectorAll('#tst .tsc');if(!L[i])return;
  [].forEach.call(L,function(x){x.classList.remove('on')});void L[i].offsetWidth;L[i].classList.add('on');
  [].forEach.call(document.querySelectorAll('.tnav [data-tut]'),function(b,k){b.classList.toggle('on',k===i)});
  if(i===2)[[600,1],[1300,4],[2000,14]].forEach(function(x){TUT.cn.push(setTimeout(function(){var c=document.getElementById('tcn');if(c)c.textContent=x[1]},x[0]))});
  if(i<L.length-1)TUT.tm=setTimeout(function(){tutGo(i+1)},4800)}
function drawShop(){var S=document.getElementById('shop'),h='';
  if(TAB==='h'||TAB==='w'||TAB==='p'){var k=TAB,nm={h:'英雄',w:'武器',p:'寵物'}[k];
    if(!RV.st.own[k].length&&!RV.st.free[k])h+='<div class="free">🎁 第一個 '+nm+' 免費：選 1 個 ★ 基本 的 '+nm+'！之後 用 🪙 金幣 換 更酷 的。</div>';
    if(k==='h')h+='<div class="sub2"><button data-sex="b" class="'+(SEX==='b'?'on':'')+'">👦 男生 英雄</button><button data-sex="g" class="'+(SEX==='g'?'on':'')+'">👧 女生 英雄</button></div>';
    h+='<div class="rar">'+[1,2,3,4,5].map(function(s){return '<span style="color:'+RC[s]+';border-color:'+RC[s]+'">'+stars(s)+' '+RN[s]+' 🪙 '+nf(CAT.P[s])+(CAT.L[s]>1?'（Lv '+CAT.L[s]+'）':'')+'</span>'}).join('')+'</div>';
    h+='<div class="grid">'+ids(k).map(itemHTML).join('')+'</div>'}
  else if(TAB==='m')h+=shopHTML();
  else if(TAB==='t')h+='<div class="note" style="margin-bottom:8px">✨ 寶物 只換 外觀（不加分數）。買了 會 自動 戴上；再 點一下 ＝ 拿下來／戴上。</div><div class="grid">'+CAT.T.map(function(t){return itemHTML(t[0])}).join('')+'</div>';
  else if(TAB==='s'){var all=RV.st.own.h.concat(RV.st.own.w,RV.st.own.p);
    h+='<div class="note">📖 集滿 一套 ＝ 拿到 稱號（亮起來）：</div>'+CAT.SET.map(function(x){var ok=x[1].every(function(id){return all.indexOf(id)>=0});
      return '<div class="set'+(ok?' ok':'')+'"><b style="min-width:8em">'+(ok?'✅ ':'')+x[0]+'</b>'+x[1].map(function(id){return '<img src="'+img(id)+'" class="'+(all.indexOf(id)>=0?'':'no')+'" alt="'+id+'">'}).join('')+'</div>'}).join('')}
  else h+=tutHTML()+'<div class="how"><table><tr><th style="width:34%">怎麼 拿</th><th>拿到 多少</th></tr>'+
    '<tr><td>📝 做完 一次 題目、遊戲（練習次數 ＋1）</td><td>⭐ 經驗值 ＋'+CAT.X.rec+'</td></tr><tr><td>🎧 聽完 一站 字卡</td><td>⭐ 經驗值 ＋'+CAT.X.rec+'</td></tr><tr><td>📅 那一天 第一次 練</td><td>⭐ 經驗值 ＋'+CAT.X.day+'（天天練 最划算）</td></tr>'+
    '<tr><td>✅ 第一次 就 答對 1 題</td><td>🪙 金幣 ＋1</td></tr><tr><td>✗➜✓ 答錯 以後 改對 1 題</td><td>🪙 金幣 ＋'+CAT.C.fix+'（改錯 最多 金幣！）</td></tr><tr><td>⬆ 同一組 比 自己 上一次 進步</td><td>🪙 金幣 ＋'+CAT.C.prog+'</td></tr>'+
    '<tr><td>🎁 這一週 練了 '+CAT.C.chestDays+' 天 以上</td><td>保底 寶箱 🪙 ＋'+CAT.C.chest+'（每一個 肯練 的 人 都 拿得到）</td></tr>'+
    '<tr><td>⚠️ 太快 亂按</td><td>那一次 沒有 金幣</td></tr><tr><td>🪙 一天 最多</td><td>'+CAT.C.cap+' 金幣（練 太久 不會 一直 賺）</td></tr>'+
    '<tr><td>🏪 榮耀 商城</td><td>第 1 排 🪙 500、第 2 排 1,200（Lv 5）、第 3 排 2,500（Lv 10）、第 4 排 5,000（Lv 20）</td></tr>'+
    '<tr><td>🚫 不可以</td><td>交易、搶 別人 的、抽獎；買到 的 東西 <b>不加 分數、不會 讓 題目 變簡單</b></td></tr></table>'+
    '<p class="note">⭐ 經驗值 只會 升，不會 被 花掉；等級 夠 才 換得到 ★★★ 以上。🐾 寵物 陪你 練 3 天 長大、7 天 進化。</p></div>';
  S.innerHTML=h;if(TAB==='q')tutGo(0);else tutStop()}
function draw(){drawStage();drawShop()}
/* ── 伺服器 ── */
function load(){if(!SCON){hide('rpin');hide('rpwait');show('rpout');return}
  if(!SCID||!scAsked()){RV=null;hide('rpin');hide('rpwait');show('rpout');return}
  hide('rpout');if(!RV)show('rpwait');var id=SCID;
  scFetch('a=rpg&id='+id,null,9000).then(function(j){if(id!==SCID)return;hide('rpwait');if(j&&j.ok){RV=j.v;show('rpin');draw()}else msg('📶 拿不到 你的 英雄，等一下 再 試',1)},function(){hide('rpwait');msg('📶 現在 沒有 網路，等一下 再 試',1)})}
function msg(t,x){var m=document.getElementById('rpm');m.className='on';document.getElementById('rpmb').innerHTML='<div>'+t+'</div><div class="bt"><button class="no" data-m="x">👌 知道了</button></div>'}
function ask(id){var k=kOf(id),fr=freeOk(id),pr=fr?0:price(id),t=k==='t'?tre(id)[1]:'';
  if(RV.lv<need(id)){msg('🔒 要 <b>Lv '+need(id)+'</b> 才 換得到<br><span class="note">現在 Lv '+RV.lv+'：多 練習 就會 升級 ⭐</span>');return}
  if(!fr&&RV.coins<pr){msg('🪙 還差 <b>'+(pr-RV.coins)+'</b> 金幣<br><span class="note">答對、改對、進步 都會 拿到 金幣</span>');return}
  var m=document.getElementById('rpm');m.className='on';
  document.getElementById('rpmb').innerHTML=(k==='t'?'<div class="tre" style="font-size:80px">'+t.split(' ')[0]+'</div><div>'+t+'</div>':'<img src="'+img(id)+'" alt="'+id+'"><div style="color:'+RC[star(id)]+'">'+stars(star(id))+' '+RN[star(id)]+'</div>')+
    '<div style="margin-top:8px">'+(fr?'🎁 免費 選 這一個？':'用 <b>🪙 '+pr+'</b> 換 這一個？')+'</div><div class="bt"><button class="yes" data-m="buy" data-id="'+id+'">✅ 換</button><button class="no" data-m="x">✕ 不要</button></div>'}
function act(op,id){if(BUSY)return;BUSY=true;var me=SCID;
  scFetch('',{a:'rpg',id:me,op:op,item:id},12000).then(function(j){BUSY=false;if(me!==SCID)return;
    if(j&&j.v)RV=j.v;
    if(j&&j.ok){draw();if(op==='buy'){cele(id);if(sOf(id)&&sOf(id).slot==='fx')setTimeout(function(){rwFx('../',id)},700)}else document.getElementById('rpm').className=''}
    else msg(j&&j.err==='coin'?'🪙 金幣 不夠':j&&j.err==='lv'?'🔒 等級 不夠':'❌ 沒有 換成（'+((j&&j.err)||'')+'）')},
   function(){BUSY=false;msg('📶 現在 沒有 網路，沒有 換')})}
function cele(id){var k=kOf(id),m=document.getElementById('rpm');m.className='on cele';
  document.getElementById('rpmb').innerHTML=fwHTML()+(k==='t'?'<div class="tre" style="font-size:90px">'+tre(id)[1].split(' ')[0]+'</div>':'<img src="'+img(id)+'" alt="'+id+'">')+
    '<div style="font-size:1.2em;color:#FFE07A;margin-top:8px">🎉 換到了！已經 裝上</div>'+(sOf(id)&&sOf(id).slot==='fx'?'<div class="note">💥 答對 現場任務、做完 一次 的 時候 會 放出來</div>':'')+'<div class="bt"><button class="yes" data-m="x">👌 好</button></div>'}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#rpIn')){scLogin(function(){SCH.close();scBar();load()});return}
  if((b=c('#tabs button'))){TAB=b.getAttribute('data-t');[].forEach.call(document.querySelectorAll('#tabs button'),function(x){x.classList.toggle('on',x===b)});drawShop();return}
  if((b=c('[data-sex]'))){SEX=b.getAttribute('data-sex');drawShop();return}
  if((b=c('[data-scat]'))){SCAT=+b.getAttribute('data-scat');drawShop();return}
  if(c('#atkTry')){atk();return}
  if((b=c('[data-tut]'))){tutGo(+b.getAttribute('data-tut'));return}
  if(c('[data-go="q"]')){var q=document.querySelector('#tabs [data-t="q"]');if(q)q.click();setTimeout(function(){var u=document.querySelector('.tut');if(u)u.scrollIntoView({behavior:'smooth',block:'start'})},50);return}
  if((b=c('#shop [data-id]'))){var id=b.getAttribute('data-id');if(own(id)){if(kOf(id)==='t'||kOf(id)==='s'||!isEq(id))act('eq',id)}else ask(id);return}
  if((b=c('[data-m]'))){var w=b.getAttribute('data-m');if(w==='buy')act('buy',b.getAttribute('data-id'));else document.getElementById('rpm').className='';return}
  if(t.id==='rpm')document.getElementById('rpm').className='';
});
/* 登入、登出、換人：每 0.8 秒看一次 */
setInterval(function(){var k=(SCID||'')+'|'+(SCID&&scAsked()?1:0);if(k!==LAST){LAST=k;RV=null;load()}},800);
</script>
</body></html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('rpg ok：英雄 ' + Object.keys(SC.RPR.h).filter(x => !SC.RPHIDE[x]).length + '、武器 ' + Object.keys(SC.RPR.w).length + '、寵物 ' + Object.keys(SC.RPR.p).length + '、寶物 ' + SC.RPT.length + '、商城上架 ' + Object.keys(SC.RPSON).length + ' 類');
