/* rpg/_build.js — 戰神之路（舊名 🦸 我的英雄；2026-10-18 第十次老師改名）（rpg/index.html）：選英雄、武器、寵物、外觀寶物、經驗值、金幣、商店、圖鑑（2026-10-17 老師看完 C9（第八次）；規格 rpg/CLAUDE.md）
 *   node rpg/_build.js
 * 規則（價錢、稀有度、等級、經驗值、金幣）全部在 score/_calc.js 的 rp…（伺服器、這一頁、量測同一份）；這一頁只負責畫。
 * 圖：rpg/chars/（男 b01～b36（01～08 下架、31～36 ★ 基本，第二十三次）、女 g01～g56；女 11～21 下架，第二十二次）、rpg/weapons/w01～w30、rpg/pets/p01～p30（切法 rpg/_crop.py）；🏪 商城 rpg/shop/s0101～（切法 rpg/_crop_shop.py；穿在身上 rpg/_wear_rt.js）。
 * 登入用成績系統同一個（score/_client.js 的 home()）；買東西、換裝都送伺服器（{a:'rpg'}），平板改不了金幣。 */
const fs = require('fs'), path = require('path');
const SC = require('../score/_calc.js'), CL = require('../score/_client.js');
const CAT = { R: SC.RPR, P: SC.RPP, L: SC.RPL, T: SC.RPT, SET: SC.RPSET, HIDE: SC.RPHIDE, X: SC.RPX, C: SC.RPC, S: SC.RPS, SON: SC.RPSON, SP: SC.RPSP, SL: SC.RPSL, LIM: SC.RPLIM, END: SC.RPEND, MON: SC.RPMON, TIER: SC.RPTIER, TIERC: SC.RPTIERC, TB: SC.RPTB, CW: SC.RPCW, TX: SC.RPTX, QV: SC.RPQV, DILI: SC.DILI, CQV: SC.RPCQV, CH: SC.RPCH };
/* 🏪 上架的類：20 張商店卡＋20 張穿在身上的圖都要有 */
Object.keys(SC.RPSON).forEach(c => { for (let n = 1; n <= 20; n++) { const id = 's' + String(c).padStart(2, '0') + String(n).padStart(2, '0');
  ['.jpg', 'i.webp'].forEach(x => { if (!fs.existsSync(path.join(__dirname, 'shop', id + x))) throw new Error('rpg：商城少了圖 ' + id + x + '（python3 -I rpg/_crop_shop.py）'); }); } });
['h', 'w', 'p'].forEach(k => Object.keys(SC.RPR[k]).forEach(id => {
  const f = path.join(__dirname, k === 'h' ? 'chars' : k === 'w' ? 'weapons' : 'pets', id + '.jpg');
  if (!fs.existsSync(f)) throw new Error('rpg：少了圖 ' + f);
}));
/* 2026-10-20 第十六次：立體 3D 舞台＋全部合體（第十五次 的 眨眼、音效、動物叫聲 老師 要 刪）➜ rpg/life.js、rpg/life.css（GitHub Pages 不給 _ 開頭的檔，所以另外寫一份） */
const LIFEJS = fs.readFileSync(path.join(__dirname, '_life_rt.js'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'life.js'), LIFEJS); fs.writeFileSync(path.join(__dirname, 'life.css'), fs.readFileSync(path.join(__dirname, '_life.css'), 'utf8'));
const TREJPG = {}; SC.RPT.forEach(t => { if (fs.existsSync(path.join(__dirname, 'tre', t[0] + '.jpg'))) TREJPG[t[0]] = 1; else if (!fs.existsSync(path.join(__dirname, 'tre', t[0] + '.svg'))) throw new Error('rpg：少了寶物圖 ' + t[0] + '（node rpg/_tre_art.js）'); });
/* 2026-10-21 第十七次 老師第 1 點：戰神之路的中文說明，中文和中文中間不空格（「再答 5 題問題」：數字、圖示前後的空格留著）。
   build 的時候整頁做一次（DSP）；fx.js、life.js 動態放進來的字 ＝ 這一頁的 MutationObserver 再做一次（只有這一頁） */
const CJK = '\\u3400-\\u9fff\\uff01-\\uff0f\\uff1a-\\uff20\\u3001-\\u303f\\u2026', DSPS = '([' + CJK + ']) +(?=[' + CJK + '])';
const DSP = t => t.replace(new RegExp(DSPS, 'g'), '$1');
let html = `<!DOCTYPE html>
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
.it .trn{font-size:clamp(18px,2.2vh,21px);color:#FFE9A8}
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
/* ══ 2026-10-20 第十四次：🔮 學生專屬的大型魔幻方框（戰士、武器、寵物、商城買到的全部都在裡面）══ */
.mfr{position:relative;isolation:isolate;border-radius:30px;padding:clamp(16px,2.6vh,28px) 12px 64px;overflow:hidden;min-height:clamp(380px,56vh,560px);display:flex;flex-direction:column;justify-content:flex-end}
.mfr::before{content:'';position:absolute;inset:-60%;z-index:-3;background:conic-gradient(from 0deg,#FFD54A,#B57BFF 20%,#5AD8FF 38%,#FFD54A 52%,#FF7A3D 70%,#B57BFF 86%,#FFD54A);animation:spin 7s linear infinite}
.mfr.r5::before{animation-duration:3.5s}.mfr.r1::before,.mfr.r0::before{animation-duration:12s;filter:saturate(.6)}
.mfbg{position:absolute;inset:5px;z-index:-2;border-radius:25px;background:radial-gradient(ellipse at 50% 88%,rgba(130,70,255,.4),transparent 58%),radial-gradient(ellipse at 50% -10%,rgba(255,200,80,.22),transparent 55%),linear-gradient(180deg,#0C1428,#04060D);background-size:cover;background-position:center}
.mfbg.bg8{background:radial-gradient(ellipse at 30% 20%,#2B1A5A,#060A1E 60%),#060A1E}
.mfc{position:absolute;width:clamp(46px,7vh,70px);height:clamp(46px,7vh,70px);z-index:6;pointer-events:none;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23FFD54A' stroke-width='3' stroke-linecap='round'%3E%3Cpath d='M6 60V24Q6 6 24 6h36'/%3E%3Cpath d='M14 60V30q0-16 16-16h30' opacity='.6'/%3E%3Cpath d='M22 6q-2 10 8 14M6 22q10-2 14 8' opacity='.8'/%3E%3C/g%3E%3Ccircle cx='14' cy='14' r='6' fill='%23B57BFF' stroke='%23FFE9A8' stroke-width='2'/%3E%3C/svg%3E") center/contain no-repeat;filter:drop-shadow(0 0 6px rgba(255,213,74,.8))}
.mfc.c1{left:6px;top:6px}.mfc.c2{right:6px;top:6px;transform:scaleX(-1)}.mfc.c3{left:6px;bottom:6px;transform:scaleY(-1)}.mfc.c4{right:6px;bottom:6px;transform:scale(-1)}
.mfrun{position:absolute;left:50%;bottom:52px;width:min(78%,420px);aspect-ratio:1;transform:translateX(-58%) rotateX(72deg);z-index:-1;pointer-events:none;opacity:.9}
.mfrun svg{width:100%;height:100%;animation:spin 16s linear infinite;filter:drop-shadow(0 0 8px var(--rg,#B57BFF))}
.mfpt i{position:absolute;bottom:-10px;width:6px;height:6px;border-radius:50%;background:var(--c,#FFE07A);box-shadow:0 0 10px var(--c,#FFE07A);opacity:0;animation:mfup var(--t,6s) linear infinite;animation-delay:var(--d,0s);z-index:-1}
@keyframes mfup{10%{opacity:.9}100%{transform:translate(var(--x,0),-480px);opacity:0}}
.mfplate{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:7;display:flex;align-items:center;gap:8px;white-space:nowrap}
.mfr .team{min-height:0;padding-top:40px}
.pc{animation:pbob 2.6s ease-in-out infinite}.pc.s2{animation:pbob 2.6s ease-in-out infinite,evo 2.4s ease-in-out infinite}@keyframes pbob{50%{transform:translateY(-8px)}}
.pc.s0{animation:pbob0 2.6s ease-in-out infinite}@keyframes pbob0{0%,100%{transform:scale(.82)}50%{transform:scale(.82) translateY(-8px)}}
.pc.pj{animation:pjmp 1s cubic-bezier(.3,1.5,.5,1)}@keyframes pjmp{40%{transform:translate(-60%,-40px) rotate(-14deg) scale(1.1)}70%{transform:translate(-50%,0) rotate(6deg)}}
.wc.wpw{animation:wpw 1s ease-out}@keyframes wpw{30%{transform:scale(1.12);filter:brightness(1.8);box-shadow:0 0 40px 10px var(--rc)}}
.hc.hpw{animation:hpw 1.1s ease-out}@keyframes hpw{30%{filter:brightness(1.6) drop-shadow(0 0 24px #FFE07A);transform:translateY(-10px) scale(1.04)}}
.wel{display:block;font-size:18px;color:#FFE9A8;margin-top:-2px}
/* 練功幻影（〔⚔ 出招〕的靶：現在那一隻怪物的全息投影，不會真的扣血） */
.fxmon.holo .fxmi{background:linear-gradient(135deg,#0A6CFF,#002040);box-shadow:0 0 26px #42F2FF}.fxmon.holo .fxmi img{filter:grayscale(1) brightness(1.1) sepia(1) hue-rotate(150deg) saturate(3) opacity(.85)}
.fxmon.holo .fxmi::after{background:repeating-linear-gradient(0deg,rgba(66,242,255,.18) 0 2px,transparent 2px 5px);mix-blend-mode:normal}
/* 👾 怪物、👑 寶箱、限量限時 */
.mon{display:flex;align-items:center;gap:12px;border-color:rgba(176,75,255,.5);background:linear-gradient(135deg,rgba(50,10,80,.6),rgba(18,26,42,.78))}
.mon img{width:clamp(70px,10vh,96px);border-radius:12px;filter:grayscale(.55) brightness(.6) contrast(1.35) hue-rotate(250deg) saturate(1.6);box-shadow:0 0 16px #9B30FF}
.mon .mbar{background:#2A0710;border-color:#FF5A6E}.mon .mbar i{background:linear-gradient(90deg,#FF2A4A,#FF8A3D)}
.mon .monv{position:relative;flex:none}.mon .monv img{animation:monHit 2.6s ease-in-out infinite}
.mon .mhit{position:absolute;left:50%;top:6%;transform:translateX(-50%);font-size:clamp(20px,2.8vh,28px);color:#FFE07A;text-shadow:0 0 8px #FF2A4A,0 2px 0 #3A0010;white-space:nowrap;opacity:0;animation:monNum 2.6s ease-out infinite;pointer-events:none}
@keyframes monHit{0%,58%,100%{transform:none;filter:grayscale(.55) brightness(.6) contrast(1.35) hue-rotate(250deg) saturate(1.6)}62%{transform:translateX(-6px) rotate(-6deg);filter:brightness(2.2) saturate(0)}68%{transform:translateX(5px) rotate(4deg)}74%{transform:none}}
@keyframes monNum{0%,58%{opacity:0;transform:translate(-50%,10px) scale(.6)}64%{opacity:1;transform:translate(-50%,-6px) scale(1.15)}90%{opacity:1;transform:translate(-50%,-26px) scale(1)}100%{opacity:0;transform:translate(-50%,-34px)}}
.mon .mhp{color:#FF8A9A;font-size:1.15em}.mon .mrow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0 2px;font-size:clamp(18px,2.3vh,22px);font-weight:800}
.mon .mrow span{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:3px 9px}.mon .mrow i{font-style:normal;color:#FFE07A}
@media (prefers-reduced-motion:reduce){.mon .monv img,.mon .mhit{animation:none}.mon .mhit{opacity:1}}
.chB{min-height:60px;padding:4px 22px;border-radius:999px;border:3px solid #FFD54A;background:linear-gradient(180deg,#5A26A0,#2A0E50);color:#FFE9A8;font-size:clamp(21px,2.7vh,27px);box-shadow:0 0 18px rgba(181,123,255,.6);animation:glow4 2.4s ease-in-out infinite}
.lim{display:block;font-size:18px;border-radius:999px;padding:1px 8px;margin-top:2px;background:#4A0A16;color:#FFC9D2;border:1px solid #FF5A6E}.lim.tm{background:#3A2A06;color:#FFE9A8;border-color:#FFB52E}.lim.out{background:#222;color:#999;border-color:#555}
.it.lmt{box-shadow:inset 0 3px 0 var(--rc,#34475C),0 0 0 2px #FF5A6E,0 0 18px rgba(255,90,110,.45)}.it.tmt{box-shadow:inset 0 3px 0 var(--rc,#34475C),0 0 0 2px #FFB52E,0 0 18px rgba(255,181,46,.45)}
.ltd{background:linear-gradient(135deg,rgba(80,10,24,.55),rgba(60,40,6,.5));border:1px solid rgba(255,138,61,.6);border-radius:20px;padding:10px 12px;margin:0 0 14px}
.ltd h3{margin:2px 4px 10px;font-size:clamp(22px,2.8vh,28px);color:#FFE9A8}
.monset{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(30%,120px),1fr));gap:8px;margin-top:8px}
.monset div{position:relative;border-radius:12px;overflow:hidden;border:2px solid #34475C;text-align:center;font-size:18px;background:#0A0F18}
.monset img{display:block;width:100%}.monset .no img{filter:brightness(0) opacity(.5)}.monset .now img{filter:grayscale(.55) brightness(.6) hue-rotate(250deg) saturate(1.6)}.monset .ok{border-color:#FFE07A;box-shadow:0 0 12px rgba(255,224,122,.6)}
/* 2026-10-20 第十五次：〔🌟 全部 合體 出招！〕、〔❓〕、寵物 陪伴 天數 點點 */
.stage{grid-template-rows:auto auto}.stage>.stat{grid-column:2;grid-row:1/span 2}.stage>.mfr{grid-column:1;grid-row:1;align-self:start}.stage>.blkw{grid-column:1/-1}
@media (max-width:900px){.stage>.stat,.stage>.mfr,.stage>.cbgo{grid-column:1;grid-row:auto}}
/* 2026-10-23 第二十二次 第 5 點：一個 區塊 一個 重點（區塊 標題 .bh） */
.bh{margin:0 0 10px;font-size:clamp(22px,3vh,30px);color:#FFE9A8;letter-spacing:.04em}
.stage>.blkw{background:rgba(8,14,26,.55);border:1px solid var(--bd);border-radius:22px;padding:14px 16px}
.nums .tile{padding:14px 18px}.nums .big2{font-size:clamp(42px,6.4vh,64px)}
.pwr{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.pwr .pwt{font-size:clamp(20px,2.6vh,26px)}
.boban{grid-column:1/-1;width:100%;text-align:center;background:linear-gradient(90deg,#FFB300,#FFE07A,#FFB300);color:#3A2A00;font-weight:900;font-size:clamp(22px,3vh,32px);border-radius:16px;padding:8px 14px;box-shadow:0 0 24px #FFD54A;animation:bobn 1.6s ease-in-out infinite}.boban small{font-size:.7em;margin-left:6px}@keyframes bobn{50%{box-shadow:0 0 6px #FFD54A}}
.monG{display:grid;grid-template-columns:minmax(0,.62fr) minmax(0,2fr);gap:14px}.monB .mon{flex-direction:column;justify-content:center;text-align:center}.monB .mon .monv img{width:clamp(96px,14vh,140px)}.monB .mon .mtxt{width:100%}@media (max-width:900px){.monG{grid-template-columns:1fr}}
.mon .mtxt{flex:1;min-width:0}
.hpb{position:relative;height:30px;border-radius:999px;background:#2A0710;border:2px solid #7A1A2A;overflow:hidden;margin:4px 0}.hpb>i{position:absolute;left:0;top:0;bottom:0;border-radius:999px;transition:width 1s}
.hpb.g>i{background:linear-gradient(90deg,#2ECC71,#9BE15D);box-shadow:0 0 10px #2ECC71}.hpb.y>i{background:linear-gradient(90deg,#F5B700,#FFE066);box-shadow:0 0 10px #F5B700}.hpb.r>i{background:linear-gradient(90deg,#E0182D,#FF5A4E);box-shadow:0 0 10px #FF2A4A}
.hpb>span{position:relative;display:block;text-align:center;line-height:26px;font-size:clamp(18px,2.4vh,22px);color:#fff;text-shadow:0 1px 2px #000,0 0 6px #000}.hpb>span b{color:#fff;font-size:1em}
.hitf{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px 5px;margin:8px 0}
.hf{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:clamp(70px,8vw,96px);padding:6px 6px 8px;border-radius:16px;background:#121C30;border:2px solid #2A3A5A;animation:hfIn 8s ease-in-out infinite both}
.hf img{width:clamp(48px,6.4vh,64px);height:clamp(48px,6.4vh,64px);object-fit:cover;object-position:center 20%;border-radius:10px}.hf b{font-size:clamp(40px,5.6vh,56px);line-height:1.1}
.hf small{font-size:clamp(18px,2.2vh,20px);color:#CFE6FF}.hf em{font-style:normal;font-size:clamp(28px,4vh,40px);font-weight:900;color:#FFE07A;text-shadow:0 0 10px #FF8A3D;line-height:1}
.hf.t{border-color:#FFD54A;background:#3A2A06}.hf.t em{font-size:clamp(34px,5vh,50px)}
.hf.m{min-width:clamp(96px,11vw,130px)}.hf.m .hpb{width:100%;height:16px;margin:4px 0 0;border-width:1px}.hf.m .hpb>i{width:var(--w0);animation:hpDrop 8s ease-in-out infinite}.hf.m img{filter:grayscale(.55) brightness(.6) hue-rotate(250deg) saturate(1.6)}
.hf.m .mm{font-size:clamp(20px,2.6vh,26px);color:#FF8A9A;animation:mmPop 8s ease-out infinite;opacity:0}
.hf.q{animation-delay:0s}.hf.h{animation-delay:-7.2s}.hf.p{animation-delay:-6.4s}.hf.t{animation-delay:-5.6s}.hf.m{animation-delay:-4.8s}
.ha{font-style:normal;font-size:clamp(24px,3.4vh,34px);color:#FFE07A;animation:hfIn 8s ease-in-out infinite both}.ha.a1{animation-delay:-7.6s}.ha.a2{animation-delay:-6.8s}.ha.a3{animation-delay:-6s}.ha.a4{animation-delay:-5.2s}
@keyframes hfIn{0%{opacity:.18;transform:scale(.9)}5%{opacity:1;transform:scale(1.14);box-shadow:0 0 22px rgba(255,213,74,.8)}10%,90%{opacity:1;transform:none}100%{opacity:.18;transform:scale(.9)}}
@keyframes hpDrop{0%,40%{width:var(--w0)}52%,92%{width:var(--w1)}100%{width:var(--w0)}}
@keyframes mmPop{0%,40%{opacity:0;transform:translateY(8px)}46%{opacity:1;transform:translateY(-6px) scale(1.2)}88%{opacity:1;transform:none}100%{opacity:0}}
.hitf.hit .hf.h{box-shadow:0 0 26px #FF8A3D}
.pwup{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;font-size:clamp(19px,2.4vh,23px);color:#E9D8C8}.pwup span{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:2px 10px}.pwup i{font-style:normal;color:#FFE07A}.pwup small{font-size:max(18px,.9em);color:#C9B8A8}
.atb{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:10px}
.helpB .idr{justify-content:center}.helpB .chips{margin-top:10px;justify-content:center}
.nums .chB{align-self:center}
.hallB{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin:10px 0;padding:10px 16px;border-radius:18px;border:3px solid #FFD54A;background:linear-gradient(135deg,#3A2A06,#120C02);font-size:clamp(20px,2.6vh,26px)}.hallB b{color:#FFE07A;width:100%}.hallB span{background:#2A1F05;border-radius:12px;padding:4px 12px}
@media (max-width:900px){.stage>.nums{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.nums .bh,.nums .chB{grid-column:1/-1}.nums .lv{flex-direction:column;gap:2px}.nums .big2{font-size:clamp(34px,5vh,50px)}}
@media (prefers-reduced-motion:reduce){.hf,.ha,.hf.m .hpb>i,.hf.m .mm{animation:none;opacity:1}}
.cbgo{grid-column:1;grid-row:2;align-self:start;justify-self:center;min-height:64px;padding:6px 34px;border-radius:999px;border:3px solid #FFD54A;background:linear-gradient(180deg,#7A3AB0,#2A0E50);color:#FFF3C4;font-size:clamp(22px,3vh,30px);box-shadow:0 0 22px rgba(255,213,74,.55),0 0 40px rgba(181,123,255,.5);animation:glow5 2.2s ease-in-out infinite}
.q1{min-width:48px;min-height:48px;margin-left:6px;border-radius:999px;border:2px solid #5AB0FF;background:rgba(20,40,70,.8);font-size:20px;vertical-align:middle}
.powT .sub .tbI{font-size:1.1em}
.pdots{display:flex;gap:8px;margin:6px 0 2px}.pdots i{width:clamp(22px,3vh,30px);height:clamp(22px,3vh,30px);border-radius:50%;border:2px solid #4A6A8A;background:#0B121D}.pdots i.on{background:radial-gradient(circle at 35% 35%,#BFF5FF,#3BA0FF);border-color:#7FD4FF;box-shadow:0 0 10px #5AB0FF}.pdots i.mk{outline:2px dashed #FFE07A;outline-offset:2px}
.mlab span:nth-child(2){color:#FFD9B8}
/* ❓ 秒懂 動畫（三章）的 分頁 */
.tch{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 10px}.tch button{min-height:56px;padding:4px 18px;border-radius:16px;background:var(--pn2);border:1px solid var(--bd);font-size:clamp(20px,2.5vh,24px)}.tch button.on{background:linear-gradient(180deg,#4A3A0C,#2A2006);color:#FFE9A8;box-shadow:inset 0 0 0 2px var(--gold)}
.tcrd{display:flex;gap:clamp(8px,1.6vw,18px);align-items:flex-end;justify-content:center}.tcrd>div{position:relative;width:clamp(70px,11vh,110px);text-align:center;opacity:0;animation:pop .45s ease-out forwards}
.tcrd img{width:100%;border-radius:12px;border:2px solid #5A6A80}.tcrd b{display:block;font-size:clamp(18px,2.4vh,24px);color:#FFE07A}.tcrd .pl{position:absolute;left:50%;top:-14px;transform:translateX(-50%);font-size:clamp(18px,2.4vh,24px);color:#FFB3B3;white-space:nowrap}
.tgray{filter:grayscale(.7) brightness(.55) hue-rotate(250deg)}
.tbig{font-size:clamp(52px,9vh,96px);line-height:1;color:#FFB3B3;text-shadow:0 0 20px rgba(255,90,90,.7)}.tbig small{display:block;font-size:.32em;color:#E8EEF7;margin-top:.45em;line-height:1.3}
.trow{display:flex;align-items:center;gap:12px;width:min(92%,640px);margin:6px 0;font-size:clamp(20px,2.8vh,28px)}.trow .mbar{flex:1;height:26px}.trow .mbar i{animation:drain var(--t,3s) steps(var(--n,8)) forwards;width:100%}
@keyframes drain{to{width:0}}
.ttier{display:flex;gap:clamp(6px,1.4vw,16px);font-size:clamp(28px,4.6vh,46px)}.ttier.big{gap:clamp(8px,1.4vw,18px);font-size:clamp(54px,9vh,96px);align-items:stretch}.ttier.big>span{opacity:1;padding:12px 8px;border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.05));border:3px solid var(--tc);box-shadow:0 0 22px var(--tc),inset 0 0 18px rgba(255,255,255,.12);animation:ttPop .7s cubic-bezier(.2,1.6,.4,1) both;min-width:clamp(96px,15vw,170px)}
.ttier.big small{font-size:clamp(18px,2.6vh,26px);color:#fff;text-align:center;line-height:1.3}.ttier.big .tbI svg{width:1em;height:1em}
.ttier.big .tc1{--tc:#C8D4E4}.ttier.big .tc2{--tc:#5AB8FF}.ttier.big .tc3{--tc:#FF8A1A}.ttier.big .tc4{--tc:#FFE34A}.ttier.big .tc5{--tc:#FFC21A;background:linear-gradient(180deg,rgba(255,213,74,.35),rgba(255,140,0,.1))}
.ttier.big.up{font-size:clamp(40px,6.4vh,70px)}.ttier.big.up>span{justify-content:flex-start}.ttier.big .lfreg{margin-top:4px;max-width:clamp(96px,15vw,170px)}.ttier.big .lfreg small{display:none}
@keyframes ttPop{from{opacity:0;transform:scale(.4) translateY(30px)}to{opacity:1;transform:none}}.ttier>span{display:flex;flex-direction:column;align-items:center;gap:4px;opacity:.35;transition:all .4s}.ttier>span.on{opacity:1;transform:scale(1.12)}.ttier small{font-size:clamp(16px,2vh,20px);color:#E8EEF7}
.tlb{width:min(90%,520px);display:flex;flex-direction:column;gap:6px}.tlb div{display:flex;gap:10px;align-items:center;background:rgba(0,0,0,.4);border:1px solid var(--bd);border-radius:12px;padding:4px 14px;font-size:clamp(20px,2.8vh,28px);opacity:0;animation:pop .4s ease-out forwards}
.tscale{font-size:clamp(60px,10vh,110px);animation:tilt 2s ease-in-out infinite}@keyframes tilt{50%{transform:rotate(6deg)}}
/* ❓ 經驗值、金幣 怎麼來（2026-10-20 第十六次 老師第 4 點）：一幕 一件事 ＝ 大 圖示 ➜ 拿到 什麼；〔⏸ 暫停〕〔◀ 上一幕〕〔下一幕 ▶〕、進度條 */
.tst{height:clamp(360px,52vh,520px)}
.tdemo.wide .tdh{height:62%;max-height:320px;border-radius:14px;z-index:1;margin-top:8px;box-shadow:0 0 22px rgba(181,123,255,.7)}.tdemo.wide .tdh.g5{box-shadow:0 0 30px #FFD54A,0 0 60px #FF8A1A;animation:tdG5 1.6s ease-in-out infinite}@keyframes tdG5{50%{transform:scale(1.04);filter:brightness(1.2)}}
.tdemo.wide{align-self:stretch;min-height:clamp(260px,46vh,520px);background:radial-gradient(ellipse at 50% 60%,rgba(120,70,220,.5),rgba(20,30,60,.3) 75%)}
.tdemo{position:relative;width:100%;flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:14px;background:radial-gradient(ellipse at 50% 60%,rgba(80,40,160,.35),transparent 70%)}
.tdemo .tdic{font-size:clamp(90px,15vh,150px);line-height:1;z-index:2;animation:tdIn .9s cubic-bezier(.2,1.6,.4,1)}@keyframes tdIn{from{transform:scale(.2) rotate(-30deg);opacity:0}}
.tdemo .tdic .tbI svg{width:1em;height:1em}
.tdemo .tdlab{font-size:clamp(26px,4vh,40px);z-index:2;color:#fff;font-weight:800}.tdemo .tdlab b{color:#FFE07A;letter-spacing:.06em}
.tdemo .tdpw{position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;align-items:center;gap:6px;z-index:2;font-size:clamp(18px,2.4vh,24px)}
.tdemo .tdpw i{width:clamp(26px,4vh,40px);height:14px;border-radius:7px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3)}.tdemo .tdpw i.on{background:linear-gradient(90deg,#FFE07A,#FF8A1A);box-shadow:0 0 10px #FFB14A}
.tst.pz::after{content:'⏸ 暫停 中：慢慢 看';position:absolute;right:12px;top:10px;z-index:9;padding:4px 14px;border-radius:999px;background:rgba(0,0,0,.65);border:2px solid #FFD54A;color:#FFE9A8;font-size:clamp(18px,2.3vh,22px)}
.tprog{height:10px;border-radius:999px;background:rgba(255,255,255,.12);margin-top:10px;overflow:hidden}.tprog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#FFD54A,#FF9A2A);border-radius:inherit}
.tctl{display:flex;gap:12px;justify-content:center;margin-top:12px;flex-wrap:wrap}
.tctl button{min-height:64px;min-width:140px;padding:6px 22px;border-radius:999px;background:var(--pn2);border:2px solid #5AB0FF;color:#E8F6FF;font-size:clamp(22px,2.9vh,28px);font-weight:700}
.tctl .tpz{min-width:190px;border:3px solid #FFD54A;background:linear-gradient(180deg,#4A3A0C,#2A2006);color:#FFE9A8}.tctl .tpz.on{background:linear-gradient(180deg,#0F5A2E,#063A1C);border-color:#3BD16F;color:#E8FFE8}
.teq{display:flex;align-items:center;justify-content:center;gap:clamp(12px,3vw,36px);flex-wrap:nowrap}
.tst.ca .vis{flex-direction:column;gap:clamp(10px,2vh,20px)}
.tic{position:relative;width:clamp(130px,21vh,200px);aspect-ratio:1;border-radius:26px;background:#F4F1E8;color:#222;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;box-shadow:0 12px 28px rgba(0,0,0,.55),inset 0 -6px 0 rgba(0,0,0,.12);opacity:0;animation:pop .5s cubic-bezier(.2,1.5,.4,1) .3s forwards}
.tic .tq{font-size:clamp(56px,9vh,92px);line-height:1}.tic small{font-size:clamp(20px,2.7vh,28px);font-weight:700}
.tck{display:flex;gap:4px;font-size:clamp(24px,3.4vh,34px)}.tck i{font-style:normal;opacity:0;animation:pop .3s ease-out forwards}.tck i:nth-child(1){animation-delay:.9s}.tck i:nth-child(2){animation-delay:1.2s}.tck i:nth-child(3){animation-delay:1.5s}
.tarr{font-size:clamp(48px,8vh,80px);color:#FFE07A;text-shadow:0 0 16px rgba(255,213,74,.7);opacity:0;animation:tar .6s ease-out 1.4s forwards}@keyframes tar{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:none}}
.trw{font-size:clamp(44px,7.6vh,80px);font-weight:800;white-space:nowrap;padding:.08em .4em;border-radius:24px;border:4px solid;opacity:0;animation:trw .7s cubic-bezier(.2,1.7,.4,1) 1.9s forwards}@keyframes trw{from{opacity:0;transform:scale(.2) rotate(-12deg)}to{opacity:1;transform:none}}
.trw.xp{color:#BFE6FF;border-color:#5AB0FF;background:rgba(40,90,160,.4);box-shadow:0 0 26px rgba(90,176,255,.5)}.trw.cn{color:#FFE9A8;border-color:#FFD54A;background:rgba(120,90,10,.45);box-shadow:0 0 26px rgba(255,213,74,.5)}
.trw.no{color:#FFB3B3;border-color:#FF6B6B;background:rgba(120,20,20,.45)}.trw.no s{text-decoration-thickness:6px;text-decoration-color:#FF4040}
.ttot{font-size:clamp(30px,5vh,52px);font-weight:800;opacity:0;animation:capIn .5s ease-out 2.1s forwards}.ttot.xp{color:#BFE6FF}.ttot.cn{color:#FFE07A}.ttot b{display:inline-block;min-width:1.6em;text-align:left}
.tdays{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.tdays span{font-size:clamp(20px,2.7vh,26px);padding:4px 14px;border-radius:999px;border:2px solid #5AB0FF;background:rgba(40,90,160,.3);opacity:0;animation:pop .4s ease-out forwards}
.tfix .tx,.tfix .tv{position:absolute;top:18%;font-size:clamp(64px,10vh,100px);font-weight:900;line-height:1}.tfix .tx{color:#E53935;animation:tfx .5s ease-in 1s forwards}.tfix .tv{color:#2E9E44;opacity:0;animation:pop .5s cubic-bezier(.2,1.6,.4,1) 1.3s forwards}.tfix small{position:absolute;bottom:12%}
@keyframes tfx{to{opacity:0;transform:scale(.3) rotate(90deg)}}
.tup{flex-direction:row;align-items:flex-end;gap:14px;padding:16px 16px 10px}.tcol{display:flex;flex-direction:column;align-items:center;height:78%;justify-content:flex-end;width:34%}.tcol i{display:block;width:100%;height:0;border-radius:8px 8px 0 0;background:#9AA7B8;animation:tcol .8s ease-out .7s forwards}.tcol i.n{background:#2E9E44;animation-delay:1.1s}
.tcol small{font-size:clamp(16px,2.2vh,20px)!important}@keyframes tcol{to{height:var(--h)}}.tua{position:absolute;right:8px;top:6px;font-size:clamp(30px,4.6vh,44px);color:#2E9E44;opacity:0;animation:pop .4s ease-out 1.8s forwards}
.twk{flex-direction:row;flex-wrap:wrap;gap:6px;padding:14px;align-content:center}.twk span{width:28%;aspect-ratio:1;border-radius:10px;background:#D7D2C4;display:flex;align-items:center;justify-content:center;font-size:clamp(18px,2.6vh,26px);font-weight:700}
.twk span.on{animation:twk .4s ease-out forwards}@keyframes twk{to{background:#2E9E44;color:#fff}}
.tfast .tq{animation:tfa .18s linear 1s 8}@keyframes tfa{50%{transform:translateY(10px) scale(.9)}}
.tnote{font-size:clamp(26px,4vh,40px);color:#BFF5C4;opacity:0;animation:capIn .5s ease-out 2.6s forwards}
.t2c{display:flex;gap:clamp(14px,3vw,40px);justify-content:center;align-items:stretch}
.tbox{width:clamp(160px,30vw,260px);border-radius:24px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;animation:pop .5s ease-out forwards}.tbox.xp{border:3px solid #5AB0FF;background:rgba(40,90,160,.25);animation-delay:.3s}.tbox.cn{border:3px solid #FFD54A;background:rgba(120,90,10,.3);animation-delay:1s}
.tbig2{font-size:clamp(56px,9vh,90px);line-height:1}.tb2{width:100%;height:22px}.tb2 i{width:10%;transition:none;animation:fill 1.4s ease-out .9s forwards;--b:100%}
.tlv{font-size:clamp(24px,3.4vh,34px);opacity:0;animation:pop .4s ease-out 2.4s forwards}.tlv b{color:#FFE07A}
.tarr2{font-size:clamp(30px,4.6vh,46px);color:#FFE07A;opacity:0;animation:pop .4s ease-out 1.8s forwards}
.tbuy{position:relative;width:62%}.tbuy img{width:100%;border-radius:14px;filter:grayscale(1) brightness(.5);animation:unl .6s ease-out 2.4s forwards}.tbuy span{position:absolute;left:50%;bottom:-8px;transform:translateX(-50%);white-space:nowrap;font-size:clamp(18px,2.4vh,24px);background:#0F5A2E;border-radius:999px;padding:2px 10px;opacity:0;animation:pop .4s ease-out 2.6s forwards}
@media (prefers-reduced-motion:reduce){.tic,.tarr,.trw,.ttot,.tnote,.tbox,.tlv,.tarr2,.tbuy span,.tdays span{opacity:1}}

/* 對話框 */
#rpm{position:fixed;inset:0;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;z-index:50;padding:16px;backdrop-filter:blur(4px)}
#rpm.on{display:flex}
#rpm .box{background:linear-gradient(180deg,#121B2B,#0A0F18);border:2px solid var(--gold);border-radius:26px;padding:22px;max-width:560px;width:100%;text-align:center;font-size:clamp(24px,3vh,32px);position:relative;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.7)}
#rpm .box img{width:min(60%,240px);border-radius:14px}
#rpm .bt{display:flex;gap:12px;justify-content:center;margin-top:16px;flex-wrap:wrap}#rpm .bt button{min-height:64px;padding:6px 28px;border-radius:999px;font-size:clamp(24px,3vh,30px);border:2px solid}
#rpm .yes{background:#0F3323;border-color:var(--ok)}#rpm .no{background:#1B2633;border-color:#4A5A6C}
#rpm.cele .box img{animation:pop2 .8s cubic-bezier(.2,1.6,.4,1)}@keyframes pop2{from{transform:scale(.2) rotate(-20deg);opacity:0}}
/* 2026-10-21 第十六次 第 5、6 點：📜 獎勵 規則 一章＋5 題 小問題（第一次 打開 一定 要 看懂）＋ ⚔ 階級 能力 */
#rpin.rlock #stage,#rpin.rlock #tabs{display:none}
.rgate{background:linear-gradient(135deg,#3A2A06,#1A1030);border:3px solid #FFD54A;border-radius:18px;padding:14px 18px;margin:0 0 12px;font-size:clamp(22px,3vh,30px);line-height:1.45;text-align:center}
/* 2026-10-25 🎯 全班獎勵 4 幕（2026-10-26 第二十九次 第 10 點：最前面 多 一幕「非上課時間 才算」＝ 5 幕） */
.cwclk{display:flex;align-items:center;justify-content:center;gap:14px;font-size:clamp(26px,3.6vh,40px);font-weight:700;color:#FFE07A;animation:fadeUp .6s both}.cwclk svg{width:clamp(56px,8vh,90px);height:auto}
.cwt{display:grid;grid-template-columns:clamp(110px,14vw,170px) 1fr;align-items:center;gap:12px;width:min(100%,900px);margin:10px auto 0;animation:fadeUp .5s both}.cwd{font-size:clamp(20px,2.6vh,28px);text-align:right}
.cwbar{display:flex;height:clamp(48px,7vh,70px);border-radius:14px;overflow:hidden;box-shadow:0 0 0 3px rgba(255,255,255,.25)}.cwbar span{display:flex;align-items:center;justify-content:center;font-size:clamp(18px,2.2vh,24px);font-weight:700;white-space:nowrap;overflow:hidden;animation:cwFill .7s both;transform-origin:left}
.cwbar .ok{background:linear-gradient(#FFD54A,#E0A800);color:#3A2A00}.cwbar .sch{background:repeating-linear-gradient(45deg,#3A4656 0 12px,#2B3644 12px 24px);color:#B8C4D2}
.cwtick{display:grid;grid-template-columns:clamp(110px,14vw,170px) 1fr;gap:12px;width:min(100%,900px);margin:2px auto 0;font-size:18px;color:#B8C4D2;animation:fadeUp .5s both}.cwtick div{position:relative;height:26px}.cwtick span{position:absolute;transform:translateX(-50%);white-space:nowrap}.cwtick span:first-child{transform:none}.cwtick span:last-child{transform:translateX(-100%)}
.rnote.sm{font-size:clamp(18px,2.2vh,22px);opacity:.85}
@keyframes cwFill{from{transform:scaleX(0)}to{transform:none}}
.cwp{display:grid;grid-template-columns:repeat(10,1fr);gap:6px;width:min(100%,720px);margin:0 auto}.cwp span{display:flex;flex-direction:column;align-items:center;border-radius:12px;padding:6px 0;opacity:0;animation:fadeUp .5s forwards}
.cwp span.ok{background:#164A2A;border:2px solid #5DE89A}.cwp span.no{background:#1A2230;border:2px solid #3A4A5A;filter:grayscale(1)}.cwp b{font-size:clamp(26px,4vh,40px)}.cwp small{font-size:17px;color:#BFFFD8;min-height:1.2em}
.cwbn{display:block;width:100%;margin:0 0 12px;padding:14px 16px;border:3px solid #FFD54A;border-radius:18px;background:linear-gradient(180deg,#5A4410,#3A2A08);color:#FFE9A0;font-size:clamp(20px,2.6vw,28px);font-weight:900;cursor:pointer}
.cw1 b{font-size:clamp(56px,9vh,90px)}.cw1 span{line-height:1.35}
.cwy{display:grid;grid-template-columns:1fr 1fr;gap:14px;width:min(100%,760px);margin:0 auto}.cwy>div{border-radius:18px;padding:14px;text-align:center;opacity:0;animation:fadeUp .6s forwards;display:flex;flex-direction:column;gap:8px}
.cwy b{font-size:clamp(24px,3.6vh,36px)}.cwy span{font-size:clamp(24px,3.6vh,38px);font-weight:900}.cwy .no{background:#3A1218;border:3px solid #E84A5A}.cwy .ok{background:#164A2A;border:3px solid #5DE89A}
.cwb{display:flex;align-items:flex-end;justify-content:center;gap:10px;height:clamp(170px,28vh,280px);width:min(100%,760px);margin:8px auto 0}.cwb>div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;opacity:0;animation:fadeUp .5s forwards}
.cwb i{width:100%;background:linear-gradient(#FFE07A,#C8901A);border-radius:10px 10px 4px 4px;min-height:14px}.cwb em{font-style:normal;font-size:clamp(20px,2.8vh,28px);color:#FFE07A;font-weight:900;text-align:center;line-height:1.15}.cwb em small{font-size:.86em;color:#BFD3FF}.cwb b{font-size:clamp(19px,2.6vh,26px);margin-top:4px}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.rgate b{color:#FFE07A}.rgate .rst{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:.85em}.rgate .rst span{background:#0A1220;border:2px solid #4A5A7A;border-radius:12px;padding:4px 12px}.rgate .rst span.on{border-color:#5DE89A;color:#BFFFD8}
.qzgo{display:block;margin:14px auto 0;min-height:76px;padding:10px 34px;font-size:clamp(26px,3.6vh,36px);border-radius:20px;border:3px solid #FFD54A;background:linear-gradient(#FFD54A,#E8A800);color:#2A1A00;font-weight:900;cursor:pointer;animation:qzp 1.4s ease-in-out infinite}
.qzgo[hidden]{display:none}@keyframes qzp{50%{box-shadow:0 0 0 12px rgba(255,213,74,.25)}}
.rtb{width:min(100%,760px);display:grid;gap:6px}.rtb>div{display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;gap:12px;background:#121C30;border:2px solid #2A3A5A;border-radius:12px;padding:4px 12px;font-size:clamp(18px,2.5vh,26px);opacity:0;animation:capIn .45s ease-out forwards}
.rtb>div.me{border-color:#FFD54A;box-shadow:0 0 14px rgba(255,213,74,.5)}.rtb .tbI{font-size:1.15em}.rtb em{font-style:normal;color:#FFE07A;white-space:nowrap}.rtb small{color:#BFD3FF;white-space:nowrap}
.rwk{display:flex;gap:6px;align-items:flex-end}.rwk>span{display:flex;flex-direction:column;align-items:center;gap:4px;width:clamp(60px,9vw,96px);padding:8px 2px;border-radius:12px;background:#1A2A44;border:2px solid #3A5A8A;font-size:clamp(22px,3vh,32px);opacity:.25;animation:rwkOn .4s ease-out forwards}
.rwk small{font-size:.62em;color:#FFE07A;white-space:nowrap}@keyframes rwkOn{to{opacity:1;background:#1E4A30;border-color:#5DE89A}}
.rnote{font-size:clamp(20px,2.7vh,28px);text-align:center;color:#FFE9A8;opacity:0;animation:capIn .5s ease-out forwards}
.rtl{display:flex;gap:clamp(8px,2vw,22px);align-items:stretch}.rtl>div{display:flex;flex-direction:column;align-items:center;gap:6px;background:#121C30;border:2px solid #2A3A5A;border-radius:14px;padding:10px 14px;font-size:clamp(20px,2.8vh,30px);opacity:0;animation:capIn .5s ease-out forwards;white-space:nowrap}
.rtl b{font-size:1.25em;color:#FFE07A}.rtl .up{border-color:#FFD54A}.rtl s{opacity:.6}
.rab{width:min(100%,720px);display:grid;gap:12px}.rab .ln{display:grid;grid-template-columns:7.5em 1fr 4.2em;align-items:center;gap:10px;font-size:clamp(19px,2.6vh,28px)}
.rab .bar{position:relative;height:30px;border-radius:999px;background:#22304A;overflow:visible}.rab .bar i{display:block;height:100%;border-radius:999px;width:0;animation:rabG 1.4s ease-out forwards;background:linear-gradient(90deg,#3DBA6A,#7DFFB0)}
.rab .bar i.bad{background:linear-gradient(90deg,#E84A5A,#FF9AA8)}.rab .bar::after{content:'90%';position:absolute;left:90%;top:-8px;bottom:-8px;border-left:4px dashed #FFD54A;font-size:15px;color:#FFD54A;padding-left:3px}
@keyframes rabG{to{width:var(--w)}}.rab .ok{color:#7DFFB0}.rab .no{color:#FF9AA8}
.rlist{display:grid;gap:5px;width:min(100%,560px)}.rlist>div{display:flex;align-items:center;gap:12px;background:#121C30;border:2px solid #2A3A5A;border-radius:12px;padding:3px 14px;font-size:clamp(19px,2.6vh,27px);opacity:0;animation:capIn .4s ease-out forwards}
.rlist>div.x{animation:capIn .4s ease-out forwards,rx 1s ease-in 2.6s forwards;border-color:#E84A5A}.rlist>div.in{border-color:#5DE89A}@keyframes rx{to{opacity:.3;text-decoration:line-through}}
.rchest{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:radial-gradient(circle at 50% 55%,#2A2140,#0B1020 75%);border-radius:14px;opacity:0;animation:capIn .5s ease-out 3.8s forwards;pointer-events:none}
.rcq{font-size:clamp(26px,3.8vh,40px);color:#FFE07A;font-weight:900;text-align:center}
.rcb{position:relative;width:min(92%,520px);height:clamp(130px,19vh,190px);display:flex;align-items:center;justify-content:center}
.rcx{font-size:clamp(84px,13vh,130px);line-height:1;animation:rcSh .9s ease-in-out 4.3s 1,rcOp .5s ease-out 5.2s forwards;filter:drop-shadow(0 0 16px #FFD54A)}
@keyframes rcSh{0%,100%{transform:none}20%{transform:rotate(-12deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-9deg)}80%{transform:rotate(9deg)}}
@keyframes rcOp{to{transform:scale(1.25);opacity:.25}}
.rcl{position:absolute;inset:-30% 20%;background:radial-gradient(circle,rgba(255,236,150,.95),rgba(255,213,74,.35) 40%,transparent 70%);opacity:0;animation:rcLt 1.4s ease-out 5.2s forwards}
@keyframes rcLt{0%{opacity:0;transform:scale(.3)}40%{opacity:1;transform:scale(1.2)}100%{opacity:.55;transform:scale(1)}}
.rco{position:absolute;top:50%;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:clamp(22px,3.2vh,32px);font-weight:900;color:#fff;background:#121C30;border:3px solid #FFD54A;border-radius:16px;padding:8px 14px;opacity:0;transform:translate(-50%,-50%) scale(.2);box-shadow:0 0 22px rgba(255,213,74,.6)}
.rco img{width:clamp(54px,8vh,80px);height:clamp(54px,8vh,80px);object-fit:cover;border-radius:10px}
.rco.a{left:50%;animation:rcFa .7s cubic-bezier(.2,1.4,.4,1) 5.5s forwards}.rco.b{left:50%;animation:rcFb .7s cubic-bezier(.2,1.4,.4,1) 5.8s forwards}
@keyframes rcFa{to{opacity:1;left:22%;transform:translate(-50%,-50%) scale(1)}}@keyframes rcFb{to{opacity:1;left:78%;transform:translate(-50%,-50%) scale(1)}}
.rcs{font-size:clamp(20px,2.8vh,28px);color:#BFF5D2;text-align:center;opacity:0;animation:capIn .5s ease-out 6.4s forwards}
u.pn{text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:6px}
.rmul{display:flex;gap:clamp(10px,2vw,26px)}.rmul>div{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 18px;border-radius:16px;background:#121C30;border:3px solid #2A3A5A;font-size:clamp(22px,3vh,32px);opacity:0;animation:capIn .5s ease-out forwards}
.rmul b{font-size:1.5em;color:#FFE07A}.rmul .x2{border-color:#FFD54A;box-shadow:0 0 18px rgba(255,213,74,.5)}
.rgm{display:grid;grid-template-columns:repeat(4,auto);gap:8px}.rgm span{padding:6px 12px;border-radius:12px;background:#1A2A44;border:2px solid #3A5A8A;font-size:clamp(18px,2.4vh,24px);opacity:0;animation:capIn .4s ease-out forwards}.rgm span.pk{border-color:#FFD54A;background:#3A2A06;animation:capIn .4s ease-out forwards,qzp 1.2s ease-in-out 2.4s infinite}
.rex{display:grid;grid-template-columns:repeat(5,auto);gap:8px}.rex>div{position:relative;width:clamp(64px,9vh,92px);opacity:0;animation:capIn .4s ease-out forwards}.rex img{width:100%;border-radius:10px;display:block}.rex .tbI{position:absolute;left:-6px;top:-8px;font-size:22px}
#rqz{position:fixed;inset:0;z-index:90;background:rgba(4,8,18,.96);display:none;align-items:center;justify-content:center;padding:16px}#rqz.on{display:flex}
#rqz .qb{width:min(100%,900px);max-height:100%;overflow:auto;text-align:center}#rqz .qn{font-size:clamp(22px,3vh,30px);color:#BFD3FF}#rqz .qt{font-size:clamp(28px,4vh,44px);line-height:1.35;margin:10px 0 16px;font-weight:900}
#rqz .qo{display:grid;gap:12px}#rqz .qo button{min-height:78px;font-size:clamp(22px,3vh,32px);border-radius:16px;border:3px solid #4A6A9A;background:#16243C;color:#fff;padding:10px 16px;line-height:1.3;cursor:pointer;text-align:left}
#rqz .qo button.ok{border-color:#5DE89A;background:#164A2A}#rqz .qo button.bad{border-color:#E84A5A;background:#4A1620}
#rqz .qr{font-size:clamp(24px,3.4vh,36px);margin-top:14px;line-height:1.4}#rqz .qr button,.qback{min-height:70px;font-size:clamp(22px,3vh,32px);border-radius:16px;border:3px solid #FFD54A;background:#3A2A06;color:#FFE9A8;padding:8px 26px;margin:10px 6px 0;cursor:pointer}
#rqz .qdots{display:flex;justify-content:center;gap:10px;margin-top:6px}#rqz .qdots i{width:22px;height:22px;border-radius:50%;background:#2A3A5A}#rqz .qdots i.ok{background:#5DE89A}#rqz .qdots i.now{background:#FFD54A}
.qback{display:block;margin:12px auto 0}
.tabil{font-size:clamp(18px,2.2vh,22px);color:#BFFFD8;line-height:1.35}
.tic .tbI{font-size:.55em}
/* 2026-10-21 第十七次：規則前 3 幕（⭐／🪙／⚔ 是什麼）、兩個好習慣、10 顆點 */
.iflow{display:flex;align-items:center;gap:clamp(8px,2vw,22px);flex-wrap:nowrap}.iflow>span{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:clamp(96px,14vw,170px);padding:12px 10px;border-radius:18px;background:#121C30;border:3px solid #2A3A5A;opacity:0;animation:capIn .5s ease-out forwards}
.iflow b{font-size:clamp(48px,8vh,80px);line-height:1}.iflow b svg.tmsv{width:clamp(84px,11vh,130px);height:auto;display:block}svg.tmsv .tm{animation:tmJ 1.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}@keyframes tmJ{0%,100%{transform:none}50%{transform:translateY(-5px)}}.iflow b img{width:clamp(60px,9vh,90px);border-radius:12px;display:block}.iflow small{font-size:clamp(20px,2.8vh,28px);color:#E8F0FF;text-align:center;line-height:1.3}
.iflow .xp{border-color:#7FD4FF;box-shadow:0 0 18px rgba(127,212,255,.5)}.iflow .cn{border-color:#FFD54A;box-shadow:0 0 18px rgba(255,213,74,.5)}.iflow .gd{border-color:#FFD54A;background:#3A2A06}
.iflow .ia{font-style:normal;font-size:clamp(30px,5vh,48px);color:#FFE07A;opacity:0;animation:capIn .4s ease-out forwards}
.rhb{display:flex;flex-direction:column;gap:16px}.rhb>div{display:flex;align-items:center;gap:12px;padding:10px 20px;border-radius:18px;background:#121C30;border:3px solid #2A3A5A;font-size:clamp(24px,3.4vh,34px);opacity:0;animation:capIn .5s ease-out forwards;white-space:nowrap}
.rhb>div.ok{border-color:#5DE89A}.rhb>div.no{border-color:#E84A5A}.rhb b{font-size:1.5em}.rhb b.x{color:#FF8A8A}.rhb b.v{color:#7DFFB0}.rhb i{font-style:normal;color:#FFE07A}.rhb em{font-style:normal;font-size:1.2em}
.rsum{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center}.rsum span{padding:8px 16px;border-radius:14px;background:#121C30;border:3px solid #3A5A8A;font-size:clamp(22px,3.2vh,32px);opacity:0;animation:capIn .4s ease-out forwards;white-space:nowrap}
.rsum span.gd{border-color:#FFD54A;background:#3A2A06;font-size:clamp(34px,5vh,50px)}.rsum i{font-style:normal;font-size:clamp(26px,4vh,40px);color:#FFE07A;opacity:0;animation:capIn .3s ease-out forwards}
.rdots{display:flex;gap:6px;margin:12px 0 6px}.rdots i{width:clamp(30px,4.4vh,42px);height:clamp(30px,4.4vh,42px);border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:clamp(18px,2.6vh,26px);font-weight:700;opacity:0;animation:pop .3s ease-out forwards}
.rdots i.ok{background:#1E5A34;border:2px solid #5DE89A;color:#BFFFD8}.rdots i.no{background:#4A1A22;border:2px solid #E84A5A;color:#FFB0B8}
.rtb.s>div{grid-template-columns:auto 1fr auto;font-size:clamp(20px,2.8vh,30px)}
@media (max-width:900px){.rtb>div{gap:6px;padding:3px 8px;font-size:18px}.rtb .tbI.big svg{width:1.2em;height:1.4em}.rtl>div{font-size:20px;padding:6px 8px}.rtl b{font-size:1.1em}
 .rlist>div{font-size:18px;padding:1px 10px}.rnote{font-size:19px}.rab .ln{grid-template-columns:6.4em 1fr 4em;font-size:18px}.rmul>div{font-size:20px;padding:8px 10px}.iflow>span{min-width:84px;padding:8px 6px}.iflow small{font-size:19px}.rhb>div{font-size:22px;padding:8px 12px;white-space:normal}.rsum{gap:6px}.rsum span{font-size:19px;padding:4px 10px}.rsum span.gd{font-size:30px}.rsum i{font-size:24px}.rdots{margin:8px 0 4px;gap:4px}.rdots i{width:28px;height:28px;font-size:17px}}
</style>
<link rel="stylesheet" href="life.css?v=__LFVER__">
<script src="life.js?v=__LFVER__"></script>
</head><body>
${CL.home(0, '../', 'home')}
<main id="rp">
 <header class="cov"><img src="cover.webp" alt="戰神之路"><a class="home" id="rpHome" href="../index.html">🏠 回首頁</a><h1><span class="zs">戰神之路</span><small>練習 ➜ 升級 ➜ 變強</small></h1></header>
 <div id="rpout" hidden><div>🔑 先 登入 ➜ 才看得到 你的 戰士</div><button class="big" id="rpIn">🔑 登入</button><div class="note" style="margin-top:20px">⭐ 經驗值、🪙 金幣 都是 從 你的 練習 算出來的：練得 愈多、改對 愈多，戰士 就 愈強！</div></div>
 <div id="rpwait" hidden>⚔ 召喚你的戰士…</div>
 <div id="rpin" hidden>
  <section class="stage" id="stage"></section>
  <nav class="tabs" id="tabs"><button data-t="h" class="on"><img class="tic" src="cover_icon.webp" alt="">戰士</button><button data-t="w">⚔ 武器</button><button data-t="p">🐾 寵物</button><button data-t="t">✨ 寶物</button><button data-t="m">🏪 榮耀 商城</button><button data-t="s">📖 圖鑑</button><button data-t="q">❓ 怎麼賺、📜 規則</button></nav>
  <section id="shop"></section>
 </div>
</main>
<div id="rpm"><div class="box" id="rpmb"></div></div>
<div id="rqz" role="dialog" aria-label="5 題 小問題"><div class="qb" id="rqzb"></div></div>
<script>
var CAT=${JSON.stringify(CAT)};
var TREJPG=${JSON.stringify(TREJPG)};
/* ⚔ 階級 的 真的 能力（2026-10-26 第二十七次 第 2 點，老師 選 C30 第 4 題「照 表 做」）：不加 分數、不讓 題目 變 簡單 */
/* 2026-10-27 第三十一次（老師）：📅 今日任務 下架（sentences/_build_review.js TODAY_ON），🔥 挑戰關 用不到 ➜ 說明 加「暫時 下架」（放回來 時 拿掉）*/
var ABIL_ON=false;   /* 2026-10-27 第三十二次 第 1 點（老師 選 A）：⚔ 階級 能力 的 說明 暫時 拿掉（升階 金幣 多 5～25% 照舊）；放回來 改 true */
var ABIL=['','','🔥 挑戰關：在家〔📅 今日任務〕，答對 🪙 ✖1.5（暫時 下架）','✍ 出 1 題 給 全班（老師 說 OK 就 上 現場任務）','🧑‍🏫 現場任務 當 小老師','⭐ 一個月 1 次 幫 全班 選 現場任務 遊戲＋🏛 名人堂'];
var RV=null,TAB='h',SEX='b',LAST='',BUSY=false,SCAT=1;
var FMN={slash:'連斬',beam:'光砲',arrow:'箭雨',smash:'重擊',orb:'法球',nova:'爆發',claw:'利爪',pierce:'突刺'},CBP=false;
var DIR={h:'chars',w:'weapons',p:'pets'},RC=['#34475C','#8A9AAA','#3BD16F','#5AB0FF','#B57BFF','#FFD54A'],RN=['','基本','稀有','史詩','傳說','神話'];
function sOf(id){var m=/^s(\\d\\d)(\\d\\d)$/.exec(id);return m?{c:+m[1],n:+m[2],row:Math.floor((+m[2]-1)/5),slot:CAT.S[+m[1]-1][0]}:null}
function kOf(id){var S=sOf(id);if(S)return S.slot==='w'||S.slot==='p'?S.slot:'s';return /^[bg]\\d\\d$/.test(id)?'h':/^w/.test(id)?'w':/^p/.test(id)?'p':'t'}
function star(id){var S=sOf(id);if(S)return S.row+2;var k=kOf(id);return k==='t'?0:(CAT.R[k][id]||0)}
function img(id){return sOf(id)?'shop/'+id+'.jpg':DIR[kOf(id)]+'/'+id+'.jpg'}
function stars(n){var s='';for(var i=0;i<n;i++)s+='★';return s}
/* 舊的 10 種寶物的圖（2026-10-20 第十五次）：老師的圖切好了（tre/tNN.jpg）用老師的，沒有 ＝ 自己畫的 tre/tNN.svg（rpg/_tre_art.js） */
function treImg(id){return 'tre/'+id+(TREJPG[id]?'.jpg':'.svg')}
function tre(id){for(var i=0;i<CAT.T.length;i++)if(CAT.T[i][0]===id)return CAT.T[i];return null}
function price(id){var S=sOf(id);if(S)return CAT.SP[S.row];var k=kOf(id);return k==='t'?tre(id)[2]:CAT.P[star(id)]}
function need(id){var S=sOf(id);if(S)return CAT.SL[S.row];return kOf(id)==='t'?1:CAT.L[star(id)]}
function own(id){return !!RV&&RV.st.own[kOf(id)].indexOf(id)>=0}
function isEq(id){var k=kOf(id);return !!RV&&(k==='s'?(RV.st.eq.s||{})[sOf(id).slot]===id:k==='t'?RV.st.eq.t.indexOf(id)>=0:RV.st.eq[k]===id)}
function freeOk(id){var k=kOf(id);return !!RV&&k!=='t'&&star(id)===1&&!RV.st.free[k]&&!RV.st.own[k].length}
function show(id){document.getElementById(id).hidden=false}function hide(id){document.getElementById(id).hidden=true}
/* ── 舞台 ── */
function PG(n){return window.RPFX?RPFX.pg(n):''}
function nf(x){return (+x||0).toLocaleString()}
function dmgOf(pw){return 10+Math.min(20,Math.floor((+pw||0)/100))}   /* 跟 score/_calc.js rpDmg 一樣：基本 10 ＋ 戰力 ÷ 100，最多 30 */
var STOCK={},NOW0=Date.now(),PIA=0;
function rune(){var h='<svg viewBox="-100 -100 200 200" aria-hidden="true"><g fill="none" stroke="#FFE9A8" stroke-width="1.6"><circle r="94" stroke-dasharray="3 7"/><circle r="84"/><circle r="62" stroke-dasharray="14 6"/>';
  for(var i=0;i<7;i++){var a=i*3/7*Math.PI*2,b=(i+1)*3/7*Math.PI*2;h+='<line x1="'+(Math.cos(a)*62).toFixed(1)+'" y1="'+(Math.sin(a)*62).toFixed(1)+'" x2="'+(Math.cos(b)*62).toFixed(1)+'" y2="'+(Math.sin(b)*62).toFixed(1)+'"/>'}
  for(var k=0;k<12;k++){var c=k/12*Math.PI*2;h+='<rect x="'+(Math.cos(c)*89-3).toFixed(1)+'" y="'+(Math.sin(c)*89-3).toFixed(1)+'" width="6" height="6" transform="rotate(45 '+(Math.cos(c)*89).toFixed(1)+' '+(Math.sin(c)*89).toFixed(1)+')"/>'}
  return h+'</g></svg>'}
function ptHTML(c){var h='<div class="mfpt">';for(var i=0;i<16;i++)h+='<i style="left:'+(4+i*6)+'%;--c:'+c[i%c.length]+';--t:'+(5+(i*37%30)/10)+'s;--d:'+((i*53%60)/10)+'s;--x:'+((i%2?1:-1)*(10+i*3%30))+'px"></i>';return h+'</div>'}
function drawStage(){var V=RV,e=V.st.eq;try{if(e.h)localStorage.setItem('rp_hero',e.h)}catch(x){}e=V.st.eq;var T=e.t,ES=e.s||{},has=function(t){return T.indexOf(t)>=0},h='',hs=e.h?star(e.h):0;
  var st=document.getElementById('stage');st.className='stage';st.removeAttribute('style');
  var W=e.w&&typeof RPFX!=='undefined'?RPFX.wInfo(e.w):null,EC=W?RPFX.EL[W.e].c:['#FFE07A','#B57BFF','#5AD8FF'];
  /* 🔮 學生專屬的大型魔幻方框：戰士、武器、寵物、光環、披風、翅膀、坐騎、名字框、背景 全部在裡面 */
  h+='<div class="mfr r'+hs+'" id="mfr"><div class="mfbg'+(has('t08')?' bg8':'')+'" style="'+rwBg('../',ES)+'"></div><i class="mfc c1"></i><i class="mfc c2"></i><i class="mfc c3"></i><i class="mfc c4"></i>'+
    '<div class="mfrun" style="--rg:'+EC[1]+'">'+rune()+'</div>'+ptHTML(EC);
  h+='<div class="team'+(ES.mt?' mt':'')+'">';
  if(e.h){h+='<div class="hc rw-host r'+hs+(has('t07')?' pose':'')+'" id="hcard" style="--rc:'+RC[hs]+'">'+(hs>=5?'<div class="rays"></div>':'')+rwBack('../',ES)+(has('t02')?'<div class="cape"></div>':'')+(has('t01')?'<div class="halo"></div>':'')+
    '<div class="stars">'+stars(hs)+'</div>'+lw('<img src="'+img(e.h)+'" alt="我的戰士">',e.h)+(has('t06')?'<div class="emo">😎</div>':'')+(has('t03')?'<div class="feet"></div>':'')+(has('t04')?fwHTML():'')+rwFront('../',ES)+'</div>'}
  else h+='<div class="hc empty" style="width:min(62%,300px)"><img class="tic" src="cover_icon.webp" alt="">還沒有戰士<br>👇 下面 免費 選 1 個</div>';
  h+='<div style="position:relative;z-index:1;display:flex;flex-direction:column;gap:16px;width:min(30%,150px)">';
  h+=e.w?'<div class="wc r'+star(e.w)+(has('t10')?' wglow':'')+'" id="wcard" style="--rc:'+RC[star(e.w)]+';width:100%"><img src="'+img(e.w)+'" alt="我的武器"></div>':'<div class="empty">⚔<br>還沒有武器</div>';
  h+=e.p?'<div class="pc rw-host s'+V.petStage+'" id="pcard" style="--rc:'+RC[star(e.p)]+';width:100%">'+(has('t09')?'<div class="hat">🎩</div>':'')+rwPo('../',ES)+''+lw('<img src="'+img(e.p)+'" alt="我的寵物">',e.p)+'<span class="pst">'+PG(V.petStage)+['寶寶','長大了','進化了'][V.petStage]+'</span></div>':'<div class="empty">🐾<br>還沒有寵物</div>';
  h+='</div></div><div class="mfplate"><span class="idl rw-host'+(has('t05')?' gf':'')+'">'+rwNf('../',ES)+'🪪 '+SCID+'</span></div></div>'+(e.h?'<button class="cbgo" id="cbGo">🌟 全部 合體 出招！</button>':'');
  var pct=Math.max(0,Math.min(100,(V.xp-V.lvAt)/(V.lvNext-V.lvAt)*100)),d=V.hit||dmgOf(V.power),pd=V.petHit||0,M=V.mon||{i:0,m:'p16',hp:0,max:80};
  var pgo=e.p?(V.petStage>=2?PG(2)+' 已經 進化':V.petStage===1?'再 練 '+Math.max(1,7-V.petDays)+' 天 ➜ '+PG(2)+' 進化':'再 練 '+Math.max(1,3-V.petDays)+' 天 ➜ '+PG(1)+' 長大'):'';
  /* 2026-10-20 第十五次 老師第 6、7 點（看不懂 戰力、一擊、怪物、寵物 那一塊）：一格 一件事、白話、每一格 都有〔❓〕秒懂動畫 */
  var TM=Math.max(V.tier,V.tmax||0),tn=window.RPFX&&V.tier<5?RPFX.ts(V.tier+1)+' '+RPFX.TN[V.tier+1]:'',tnext=V.tier<5?CAT.TIER[V.tier][0]-V.power:0,pdots='';for(var di=0;di<7;di++)pdots+='<i class="'+(di<V.petDays?'on':'')+(di===2||di===6?' mk':'')+'"></i>';
  /* 2026-10-23 第二十二次 第 5 點（老師：版面 太 凌亂 ➜ 一個 區塊 一個 重點）：
     ① 我的 戰士（左：魔幻方框＋〔🌟 全部 合體 出招！〕）② 📊 我的 數字（右：⭐ 等級、🪙 金幣、⚔ 戰力，一格 一個 數字）
     ③ 👾 打 怪物（整排：怪物＋紅色 血條；💥 一擊 ＝ 秒懂 動畫）④ 🐾 寵物 ⑤ ❓ 看不懂 點 這裡 */
  var mhp=M.max-M.hp,mr=mhp/M.max,hc=mr>.5?'g':mr>.25?'y':'r',hit=d+pd,left=Math.max(1,Math.ceil(mhp/Math.max(1,hit))),hi=e.h?img(e.h):'',pi=e.p?img(e.p):'';
  h+='<div class="stat nums"><h3 class="bh">📊 我的 數字</h3>'+
    '<div class="tile lvT"><div class="lab">⭐ 等級</div><div class="lv"><b>Lv '+V.lv+'</b><span>經驗值 '+nf(V.xp)+'</span></div><div class="bar"><i id="xpb" data-w="'+pct.toFixed(1)+'"></i></div><div class="sub">再 '+nf(V.lvNext-V.xp)+' ⭐ ➜ Lv '+(V.lv+1)+'</div></div>'+
    '<div class="tile coinT"><div class="lab">🪙 金幣</div><b class="big2" id="coinN">'+nf(V.coins)+'</b><div class="sub">＝ 錢：換 裝備</div></div>'+
    '<div class="tile powT"><div class="lab">⚔ 戰力 <button class="q1" data-go="qb" aria-label="戰力 是 什麼">❓</button></div><div class="pwr"><b class="big2">'+nf(V.power)+'</b>'+(TM&&window.RPFX?'<span class="pwt">'+RPFX.tb(TM,1)+'</span>':'')+'</div>'+
      '<div class="sub tabil">✅ <b>現在</b>：'+(V.tnow&&window.RPFX?RPFX.ts(V.tnow)+' '+RPFX.TN[V.tnow]:'還沒有 階級')+'<br>練習 金幣 多 '+V.pct+'%、一天 最多 拿 '+V.cap+' 🪙'+(ABIL_ON?ABIL:[]).slice(2,(V.tnow||0)+1).filter(Boolean).map(function(a){return '<br>'+a}).join('')+'</div>'+(V.tier<5?'<div class="sub">⏫ <b>再 '+nf(tnext)+' ⚔</b> ➜ 升到 '+tn+'<br>以後：練習 金幣 多 '+CAT.TB[V.tier+1][0]+'%、一天 最多 拿 '+CAT.TB[V.tier+1][1]+' 🪙'+(ABIL_ON&&ABIL[V.tier+1]?'<br>＋ '+ABIL[V.tier+1]:'')+'</div>':'<div class="sub">🎉 最高 階級</div>')+'</div>'+
    (V.ch?'<button class="chB" id="chOpen">👑 開 冠軍寶箱 ✕ '+V.ch+'</button>':'')+'</div>'+
    /* 2026-10-26 第二十七次：🏛 名人堂（★★★★★ 傳說戰神，同一個 年級；只 寫 班級＋號碼，不寫 名字） */
    ((V.hall||[]).length?'<div class="hallB"><b>🏛 名人堂：★★★★★ 傳說戰神</b>'+V.hall.map(function(id){return '<span>'+id.slice(0,3)+' 班 '+(+id.slice(3))+' 號</span>'}).join('')+'</div>':'');
  /* 2026-10-25 第二十六次 第 3-2 點（老師選 A：暫時 刪除）：👾 打 怪物、💥 一擊 算式、〔⚔ 出招！〕、🐾 我的 寵物 那一格 拿掉（資料 照 留著，要 加回來 ＝ 從 git 第二十五次 版本 拿回 這兩段） */
  h+='<div class="blkw helpB"><h3 class="bh">❓ 看不懂？點 這裡</h3><div class="idr"><button class="how1" data-go="qa">⭐🪙 經驗值、金幣 怎麼來</button><button class="how1" data-go="qc">🎁 收集 有 什麼 幫助</button>'+(ABIL_ON?'<button class="how1" data-go="qd">⚔ 階級 愈高 能力 愈強</button>':'')+'</div>'+
    (V.medal||V.titles.length||V.chests?'<div class="chips">'+(V.medal?'<span>🏅 勳章 ✕ '+V.medal+'</span>':'')+V.titles.map(function(t){return '<span>🏷 '+t+'</span>'}).join('')+(V.chests?'<span>🎁 保底 寶箱 ✕ '+V.chests+'</span>':'')+'</div>':'')+'</div>';
  /* 🎉 加倍 時段（2026-10-26 第二十六次 第 2-4 點）：老師 開了 ＝ 最上面 金色 橫幅 */
  if(V.bo){var bt=new Date(V.bo.to);h='<div class="boban">🎉 你們 班 加倍 中！答對 賺 的 🪙 金幣 ✖'+V.bo.k+'、⭐ 經驗值 ✖'+V.bo.x+'<small>（到 '+(bt.getMonth()+1)+'/'+bt.getDate()+' '+bt.getHours()+':'+('0'+bt.getMinutes()).slice(-2)+'）</small></div>'+h}
  st.innerHTML=h;if(window.RPLIFE)RPLIFE.stage(document.getElementById('mfr'),{c:EC,tier:hs});setTimeout(function(){var b=document.getElementById('xpb');if(b)b.style.width=b.getAttribute('data-w')+'%'},60)}
function lw(h,id){return window.RPLIFE?RPLIFE.wrap(h,id):h}
/* 🐾 戰士 和 寵物 的 互動（一直換：寵物 跳過去、寵物 幫 武器 充能、戰士 蓄力） */
function petIA(){if(!RV||document.hidden||typeof RPFX==='undefined')return;var m=document.getElementById('mfr'),p=document.getElementById('pcard'),hc=document.getElementById('hcard'),w=document.getElementById('wcard');if(!m||!hc)return;
  /* 2026-10-20 第十五次（老師第 1 點：寵物 對 戰士 的 孺慕之情、撒嬌依偎；戰士 和 寵物 親密 的 互動）：四種 輪流 */
  var e=RV.st.eq,k=(PIA++)%4,pe=e.p?RPFX.pEl(e.p):'light',we=e.w?RPFX.wInfo(e.w).e:'light',L=window.RPLIFE;
  /* 2026-10-25 第二十六次 第 3-2 點（老師：寵物 依偎、撒嬌 看起來 幼稚 ➜ 暫時 刪除）：k 0 依偎（nuzzle）、k 3 跳＋愛心 不演 */
  if(k===0||k===3)return;
  if(k===1&&p&&w){RPFX.beam(m,RPFX.pos(m,p),RPFX.pos(m,w),pe);setTimeout(function(){w.classList.remove('wpw');void w.offsetWidth;w.classList.add('wpw')},250)}
  else if(k===2){hc.classList.remove('hpw');void hc.offsetWidth;hc.classList.add('hpw');if(L)L.charge(m,hc,RPFX.EL[we].c[1]);var a=RPFX.pos(m,hc,.5,.5);RPFX.spark(m,a.x,a.y,we,26)}
  else if(p){p.classList.remove('pj');void p.offsetWidth;p.classList.add('pj');if(L){var r=RPFX.pos(m,p,.5,.2);L.hearts(m,r.x,r.y,4)}}}
setInterval(petIA,6500);
/* ⚔ 出招：照 你的 武器（元素、招式、星等）、寵物、5 碼 ➜ 每一個人 不一樣；每一次 也 不一樣。靶 ＝ 現在 那一隻 怪物 的 練功幻影（不會 真的 扣血） */
function atk(){var m=document.getElementById('mfr'),hc=document.getElementById('hcard');if(!m||!hc||!RV||!RV.st.eq.h||typeof RPFX==='undefined')return;var e=RV.st.eq,M=RV.mon||{m:'p16'};
  var old=m.querySelector('.fxmon');if(old)old.parentNode.removeChild(old);
  var mon=document.createElement('div');mon.className='fxmon holo';mon.innerHTML='<div class="fxmi"><img src="pets/'+M.m+'.jpg" alt="練功幻影"></div><div class="fxmn" style="font-size:clamp(18px,2.2vh,22px)">🎯 練功 幻影</div>';m.appendChild(mon);
  var p=document.getElementById('pcard'),a=RPFX.attack(m,{from:RPFX.pos(m,hc,.6,.4),to:RPFX.pos(m,mon.querySelector('.fxmi')),w:e.w,id:SCID,p:e.p,pImg:e.p?img(e.p):'',pFrom:p?RPFX.pos(m,p):null,dmg:RV.hit||dmgOf(RV.power),pd:RV.petHit||0,hero:hc,shk:document.getElementById('stage'),
    hook:function(x){if(window.RPLIFE)RPLIFE.strike(m,{hero:hc,w:document.getElementById('wcard'),p:p,to:mon.querySelector('.fxmi'),wid:RV.st.eq.w,cls:tierMax(),e:x.e,tier:x.tier,crit:x.crit,ch:x.ch,hit:x.hit})},
    onHit:function(){mon.classList.remove('hit');void mon.offsetWidth;mon.classList.add('hit')}});
  var fx=(e.s||{}).fx;if(fx)setTimeout(function(){rwFx('../',fx)},a.hit+100);
  setTimeout(function(){if(mon.parentNode)mon.parentNode.removeChild(mon)},a.ms+300)}
/* 🌟 全部 合體 出招（老師 C17 第 3、4 點）：戰士 ➜ 光環、翅膀、披風、坐騎 一樣一樣 上身 ➜ 寵物 ➜ 武器 覺醒 ➜ 合體 必殺 ➜ 合體 威力（＝ 戰力） */
function cbAuto(){if(!window.__NOCB)comboGo()}   /* 量測 的 時候 可以 關掉 自動 演（rpg/_verify.js 另外 量 一次） */
function comboGo(){if(!RV||!RV.st.eq.h||!window.RPLIFE)return;var e=RV.st.eq,ES=e.s||{},si=function(x){return x?'shop/'+x+'i.webp':''};
  RPLIFE.combo({base:'',h:img(e.h),hid:e.h,w:e.w?img(e.w):'',wid:e.w,p:e.p?img(e.p):'',pid:e.p,au:si(ES.au),cp:si(ES.cp),wg:si(ES.wg),mt:si(ES.mt),bg:ES.bg?'shop/'+ES.bg+'i.webp':'',
    power:RV.power,tier:RV.tier,cls:tierMax(),ids:{au:ES.au,cp:ES.cp,wg:ES.wg,mt:ES.mt},star:Math.max(star(e.h),e.w?star(e.w):1,e.p?star(e.p):1),id:SCID,grade:cbGrade(),v:cbNext()})}   /* 第十八次：cls ＝ 階級（專屬 特效）、ids ＝ 寶物 編號（每一樣 自己的 必殺） */
/* 2026-10-21 第十七次 老師第 10-(3) 點：合體 等級 G（1～5）＝ 階級×2 ＋ 全身 星等（戰士、武器、寵物）＋ 商城 裝備 幾樣 ➜ 每 7 分 一級；
   主題 v ＝ 這台 平板 第幾次 看 合體（rp_cbn_5碼）＋ 裝備 算 出來 的 數字 ➜ 每一次 換一種、連續 兩次 不一樣 */
function cbScore(){var e=RV.st.eq,ES=e.s||{};return tierMax()*2+star(e.h)+(e.w?star(e.w):0)+(e.p?star(e.p):0)+Object.keys(ES).filter(function(k){return ES[k]}).length}
function cbGrade(){return Math.max(1,Math.min(5,1+Math.floor(cbScore()/7)))}
function cbNext(){var K='rp_cbn_'+SCID,n=0;try{n=+localStorage.getItem(K)||0;localStorage.setItem(K,n+1)}catch(x){n=Math.floor(Math.random()*6)}var e=RV.st.eq,h=0,s=String(e.h)+e.w+e.p+tierMax();for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%997;return (h+n)%6}
function fwHTML(){var h='<div class="fw">',C=['#FFD54A','#FF6B6B','#7FD4FF','#7BF0A8','#D9A8FF'];for(var i=0;i<24;i++){var a=i/24*Math.PI*2,r=90+Math.random()*60;h+='<i style="--c:'+C[i%5]+';--x:'+Math.round(Math.cos(a)*r)+'px;--y:'+Math.round(Math.sin(a)*r)+'px;animation-delay:'+(i%3*.15)+'s"></i>'}return h+'</div>'}
/* ── 商店 ── */
function tierMax(){return RV?Math.max(RV.tier||0,RV.tmax||0):0}
function itemHTML(id){var k=kOf(id),s=star(id),o=own(id),eq=isEq(id),fr=!o&&freeOk(id),lk=!o&&RV.lv<need(id),pr=price(id),poor=!o&&!fr&&RV.coins<pr;
  var tag=eq?'<div class="pr eq">✅ 裝備中</div>':o?'<div class="pr ok">👆 點一下 裝上</div>':fr?'<div class="pr fr">🎁 免費</div>':lk?'<div class="pr lock">🔒 Lv '+need(id)+'</div>':'<div class="pr'+(poor?' lock':'')+'">🪙 '+pr+'</div>';
  if(k==='s'&&eq)tag='<div class="pr eq">✅ 裝備中<br><small>再點 ＝ 拿下來</small></div>';else if(k==='s'&&o)tag='<div class="pr ok">👆 點一下 裝備</div>';
  /* 🏷 限量（全部學生一共 5 個，剩幾個 ＝ 伺服器數的）、⏳ 限時（10 月 31 號 下架）（2026-10-20 第十四次） */
  var lt='',lc='';if(CAT.LIM[id]){var left=STOCK[id];lc=' lmt';if(!o&&left===0){lt='<span class="lim out">已 換完</span>';tag='';poor=true}else lt='<span class="lim">🏷 限量 5 個．剩 '+(left==null?'?':left)+' 個</span>'}
  if(CAT.END[id]){lc=' tmt';if(!o&&nowS()>=CAT.END[id]){lt='<span class="lim out">已 下架</span>';tag='';poor=true}else lt='<span class="lim tm">⏳ 10 月 31 號 下架</span>'}
  /* ⚔ 這一階 才 買得到 的 專屬寶物（2026-10-21 第十六次 第 5 點） */
  if(CAT.TX[id]){lc+=' txm';var tq=CAT.TX[id],th=typeof RPFX!=='undefined'?RPFX.tb(tq)+' '+RPFX.TN[tq]:'★'+tq;lt='<span class="lim tm">'+th+' 專屬</span>'+lt;if(!o&&tierMax()<tq){tag='<div class="pr lock">🔒 要 '+(typeof RPFX!=='undefined'?RPFX.TN[tq]:'')+'</div>';poor=true}}
  if(k==='w'&&typeof RPFX!=='undefined'){var wi=RPFX.wInfo(id);lt='<span class="wel">'+RPFX.EL[wi.e].nm+'．'+{slash:'連斬',beam:'光砲',arrow:'箭雨',smash:'重擊',orb:'法球',nova:'爆發',claw:'利爪',pierce:'突刺'}[wi.f]+'</span>'+lt}
  if(k==='t'){var t=tre(id);return '<button class="it'+(eq?' eqd':'')+'" data-id="'+id+'"><img src="'+treImg(id)+'" alt="'+t[1]+'"><div class="trn">'+t[1].split(' ').slice(1).join(' ')+'</div>'+tag+'</button>'}
  return '<button class="it'+(eq?' eqd':'')+(lk||poor?' dim':'')+lc+'" data-id="'+id+'" style="--rc:'+RC[s]+'"><img loading="lazy" src="'+img(id)+'" alt="'+id+'"><div class="st">'+stars(s)+' '+RN[s]+'</div>'+lt+tag+'</button>'}
function nowS(){return Date.now()+(RV&&RV.dt||0)}
function ids(k){var a=Object.keys(CAT.R[k]).filter(function(id){return (!CAT.HIDE[id]||RV.st.own[k].indexOf(id)>=0)&&(k!=='h'||id.charAt(0)===SEX)});   /* 下架的（第二十二次）：買過的人還看得到、還可以換回來 */
  a=a.sort(function(x,y){return (CAT.R[k][x]-CAT.R[k][y])||(x<y?-1:1)});
  return k==='h'?a:a.concat(RV.st.own[k].filter(function(id){return !!sOf(id)}))}   /* 🏪 商城買的魔法武器、新寵物 也放在這裡（換回來用） */
/* 🏪 榮耀 商城：10 類（上架的 ＝ 第 1 種的小圖）、每類 4 排（價錢、等級照排） */
function shopHTML(){var LT=Object.keys(CAT.LIM).concat(Object.keys(CAT.END)),h='<div class="ltd"><h3>🔥 限量、限時（換完、過了 就 沒有 了）</h3><div class="sgrid">'+LT.map(itemHTML).join('')+'</div></div><div class="scat">'+CAT.S.map(function(x,i){var c=i+1,on=!!CAT.SON[c],cc=(c<10?'0':'')+c,ic=x[1].split(' ')[0],nm=x[1].split(' ').slice(1).join(' ');
    return '<button data-scat="'+c+'" class="'+(c===SCAT?'on ':'')+(on?'':'soon')+'">'+(on?'<img src="shop/s'+cc+'01.jpg" alt="">':'<span class="sic">'+ic+'</span>')+'<span>'+nm+(on?'':'<em>即將 上架</em>')+'</span></button>'}).join('')+'</div>';
  var X=CAT.S[SCAT-1];
  if(!CAT.SON[SCAT])return h+'<div class="soon1">'+X[1]+'<br>🔜 即將 上架<div class="note" style="margin-top:10px">老師 上傳 圖 以後，就 可以 用 🪙 金幣 換。</div></div>';
  var tip={au:'戴在 戰士 後面 會 轉',cp:'穿在 戰士 後面',fx:'⚔ 出招、答對 現場任務、做完 一次 的 時候 放出來',nf:'圍住 你的 號碼',bg:'換掉 戰士 後面 的 背景',po:'穿在 寵物 身上',w:'換成 你的 武器',p:'換成 你的 寵物',wg:'裝在 戰士 背後',mt:'讓 戰士 騎上去'}[X[0]];
  h+='<div class="note">'+X[1]+'：'+tip+'。只換 外觀（不加 分數）；同一類 身上 只 戴 1 個。</div>';
  for(var r=0;r<4;r++){h+='<div class="srow"><span>第 '+(r+1)+' 排</span><b>🪙 '+CAT.SP[r].toLocaleString()+'</b><span class="stg">'+(CAT.SL[r]>1?'Lv '+CAT.SL[r]:'Lv 1 就 可以')+'</span>'+(r===3?'<span class="stg">🎓 學霸 限定 神裝</span>':'')+'</div><div class="sgrid">';
    for(var n=r*5+1;n<=r*5+5;n++)h+=itemHTML('s'+(SCAT<10?'0':'')+SCAT+(n<10?'0':'')+n);h+='</div>'}
  return h}
/* ❓ 經驗值、金幣 秒懂動畫（2026-10-18 第十次，老師：學生不懂經驗值和金幣的用處、怎麼賺）：5 幕自己往下演，一幕一句話 */
var TUT={tm:0,cn:[]},TCH='a';
/* 2026-10-20 第十五次 老師第 2、4、6、7 點：學生 看不懂 經驗值金幣 怎麼來、戰力 是什麼、收集 有 什麼 用 ➜ 三章 秒懂 動畫（一幕 一句話，自己 往下 演；可以 點 跳過去） */
function tutScenes(){var V=RV||{power:0,tier:0,hit:10,petHit:0,lv:1},e=V.st?V.st.eq:{},hi=e.h?img(e.h):'chars/b31.jpg',wi=e.w?img(e.w):'weapons/w03.jpg',pi=e.p?img(e.p):'pets/p03.jpg',
    pw=V.power||0,tb=function(n,b){return window.RPFX?RPFX.tb(n,b):''},hs=e.h?star(e.h):1,ws=e.w?star(e.w):1,ps=e.p?star(e.p):1;
  return {
  /* 2026-10-20 第十六次 老師第 4 點（學生 還是 看不懂、太快）：一幕 只 講 一件事 ＝ 大 圖示 ➜ 拿到 什麼（大字），下面 數字 數上去；〔⏸ 暫停〕〔◀ 上一幕〕〔下一幕 ▶〕 */
  a:[['⭐ 經驗值 ＝ <span class="xp">升級</span>　🪙 金幣 ＝ <b>換 裝備</b>','<div class="t2c"><div class="tbox xp"><div class="tbig2">⭐</div><div class="bar tb2"><i></i></div><div class="tlv">Lv 1 ➜ <b>Lv 2</b> 🔓</div></div><div class="tbox cn"><div class="tbig2">🪙</div><div class="tarr2">⬇</div><div class="tbuy"><img src="shop/s0106.jpg" alt=""><span>✅ 換到 了</span></div></div></div>',function(){}],
     ['📝 做完 1 次 練習 ➜ <span class="xp">⭐ ＋'+CAT.X.rec+'</span>',teq('<div class="tic"><span class="tq">📝</span><span class="tck"><i>✅</i><i>✅</i><i>✅</i></span><small>🎉 做完</small></div>','<span class="trw xp">⭐ ＋'+CAT.X.rec+'</span>','xp'),function(){tcount([[2300,CAT.X.rec]])}],
     ['📅 每天 第一次 練 ➜ <span class="xp">⭐ 再 ＋'+CAT.X.day+'</span>',teq('<div class="tic tcal"><span class="tq">📅</span><small>今天 第 1 次</small></div>','<span class="trw xp">⭐ ＋'+CAT.X.day+'</span>','xp')+'<div class="tdays">'+['一','二','三'].map(function(d,i){return '<span style="animation-delay:'+(2.6+i*.6)+'s">星期'+d+' ⭐ ＋'+CAT.X.day+'</span>'}).join('')+'</div>',function(){tcount([[2300,CAT.X.day],[3200,CAT.X.day*2],[3800,CAT.X.day*3]])}],
     ['✅ 第一次 就 答對 1 題 ➜ <b>🪙 ＋1</b>',teq('<div class="tic"><span class="tq">✅</span><small>答對</small></div>','<span class="trw cn">🪙 ＋1</span>','cn'),function(){tcount([[2300,1]])}],
     ['✗ ➜ ✓ 答錯 以後 改對 ➜ <b>🪙 ＋'+CAT.C.fix+'</b>（最多！）',teq('<div class="tic tfix"><span class="tx">✗</span><span class="tv">✓</span><small>改對 了</small></div>','<span class="trw cn">🪙 ＋'+CAT.C.fix+'</span>','cn'),function(){tcount([[2300,CAT.C.fix]])}],
     ['⬆ 同一組 比 上一次 進步 ➜ <b>🪙 ＋'+CAT.C.prog+'</b>',teq('<div class="tic tup"><div class="tcol"><i style="--h:55%"></i><small>上次</small></div><div class="tcol"><i class="n" style="--h:85%"></i><small>這次</small></div><span class="tua">⬆</span></div>','<span class="trw cn">🪙 ＋'+CAT.C.prog+'</span>','cn'),function(){tcount([[2300,CAT.C.prog]])}],
     ['📅 一週 練 '+CAT.C.chestDays+' 天 ➜ <b>🎁 🪙 ＋'+CAT.C.chest+'</b>',teq('<div class="tic twk">'+['一','二','三','四','五','六','日'].map(function(d,i){return '<span class="'+(i<CAT.C.chestDays?'on':'')+'" style="animation-delay:'+(.5+i*.25)+'s">'+d+'</span>'}).join('')+'</div>','<span class="trw cn">🎁 ＋'+CAT.C.chest+'</span>','cn'),function(){tcount([[2300,CAT.C.chest]])}],
     ['⚡ 太快 亂按（一半 以上）➜ 這一次 <b>沒有</b> ⭐、🪙','<div class="teq"><div class="tic tfast"><span class="tq">👆</span><small>不到 1 秒 就 按</small></div><span class="tarr">➜</span><span class="trw no"><s>⭐</s> <s>🪙</s></span></div><div class="tnote">👀 先 看完、🎧 聽完，再 選</div>',function(){}],
     ['⚡ 現場任務：老師 開〔✖1.5〕或〔✖2〕➜ ⭐、🪙 變多',teq('<div class="tic"><span class="tq">⚡</span><small>答對 5 題</small></div>','<span class="trw cn">🪙 8／10</span>','cn'),function(){tcount([[2300,8],[3600,10]])}],
     ['⚔ 戰力 階級 愈高 ➜ 練習 的 🪙 多 5%～25%（★★★ ＝ 15%：🪙 20 ➜ 23）',teq('<div class="tic">'+tb(3)+'<small>升階</small></div>','<span class="trw cn">🪙 ＋15%</span>','cn'),function(){tcount([[2300,23]])}]],
  b:[['⚔ 戰力 ＝ 你 全身 的 裝備 加 起來','<div class="tcrd"><div style="animation-delay:.2s"><span class="pl">★ ✕ 100</span><img src="'+hi+'" alt=""><b>戰士 '+stars(hs)+'</b></div><div style="animation-delay:.6s"><span class="pl">★ ✕ 100</span><img src="'+wi+'" alt=""><b>武器 '+stars(ws)+'</b></div><div style="animation-delay:1s"><span class="pl">★ ✕ 100</span><img src="'+pi+'" alt=""><b>寵物 '+stars(ps)+'</b></div></div><div class="tbig">⚔ <b class="tcn">0</b><small>＋ 等級、寶物、寵物 長大</small></div>',function(){var n=pw||320;tcount([[1400,Math.round(n*.3)],[1700,Math.round(n*.6)],[2000,Math.round(n*.85)],[2300,n]]);tsp(.5,.7,'light')}],
     ['⚔ 戰力 愈高 ➜ 💥 一擊 愈痛','<div style="text-align:center"><div class="tbig" style="color:#fff">💥 <b class="tcn">10</b><small>戰力 每 多 100 ➜ 一擊 ＋1（最多 30）</small></div><div class="tbar" style="margin:10px auto 0"><div class="bar"><i style="--a:0%;--b:'+Math.min(100,(V.hit-10)/20*100).toFixed(0)+'%;--d:.6s;background:linear-gradient(90deg,#FF7A3D,#FFD54A)"></i></div><div class="lab">10 ➜ 30</div></div></div>',function(){tcount([[700,Math.round(10+(V.hit-10)*.4)],[1100,Math.round(10+(V.hit-10)*.8)],[1500,V.hit]]);tatk(1700)}],
     ['💥 一擊 愈痛 ➜ 👾 怪物 倒 得 愈快','<div style="width:100%;display:flex;flex-direction:column;align-items:center"><div class="trow"><span>💥 10</span><div class="mbar" style="--t:4s;--n:8"><i></i></div><span>8 下</span></div><div class="trow"><span>💥 27</span><div class="mbar" style="--t:1.5s;--n:3"><i></i></div><span>3 下 🎉</span></div><div class="cap" style="font-size:clamp(20px,2.8vh,28px);animation-delay:2s">怪物 血 80：一擊 10 要 打 8 下、一擊 27 只要 3 下</div></div>',function(){}],
     ['⚔ 戰力 到了 ➜ 升 階級 ＋ 🪙 100 ＋ 真的 能力','<div style="text-align:center"><div class="ttier">'+[1,2,3,4,5].map(function(n){return '<span id="tt'+n+'">'+tb(n)+'<small>'+(window.RPFX?RPFX.TN[n]:'')+'</small><small>⚔ '+nf(CAT.TIER[n-1][0])+'</small><small>🪙 ＋'+CAT.TB[n][0]+'%</small></span>'}).join('')+'</div><div class="cap" style="font-size:clamp(22px,3vh,30px);animation-delay:1.6s">'+(V.tier?'你 現在：'+tb(V.tier,1):'你 還沒有 階級')+(V.tier<5?'　再 '+nf(CAT.TIER[V.tier][0]-pw)+' ⚔ ➜ 下一階 🪙＋'+CAT.TIERC:'')+'</div><div class="note" style="margin-top:8px">每 升 一階：🪙＋'+CAT.TIERC+' 一次、練習 金幣 多 5%～25%、一天 最多 120～200、專屬 寶物、現場任務 登場 特效（詳細 ➜ 📜 獎勵 規則）</div></div>',function(){[1,2,3,4,5].forEach(function(n){TUT.cn.push(setTimeout(function(){var x=document.getElementById('tt'+n);if(x)x.classList.add('on');},300+n*260))})}]],
  /* 2026-10-21 第十七次 老師第 9 點：學生 看不懂「收集 有 什麼 用」➜ 一幕 一件事、一條 因果 鏈：收集 ➜ 戰力 ➜ 打怪 快 ➜ 圖鑑；寵物 幫 打；集滿 一套 ＝ 稱號；不加 分數 */
  /* 2026-10-26 第二十七次 第 5 點（老師：收集 有 什麼 幫助 那一段 的 怪物 說明 也 一起 刪掉）：刪「⚔ 戰力 愈高 ➜ 👾 怪物 倒 得 愈快」「👾 打倒 怪物 ➜ 收進 📖 圖鑑」兩幕；最後一幕 拿掉「打怪 更 快」 */
  c:[['🎁 收集 愈多、愈強 ➜ ⚔ 戰力 愈高','<div class="tcrd"><div style="animation-delay:.2s"><img src="'+hi+'" alt=""><b>'+stars(hs)+'</b></div><div style="animation-delay:.6s"><img src="'+wi+'" alt=""><b>'+stars(ws)+'</b></div><div style="animation-delay:1s"><img src="'+pi+'" alt=""><b>'+stars(ps)+'</b></div></div><div class="tbig">⚔ <b class="tcn">0</b><small>★ 愈多 ➜ 戰力 愈高</small></div>',function(){var n=pw||320;tcount([[1400,Math.round(n*.4)],[1800,Math.round(n*.75)],[2200,n]])}],
     ['🐾 寵物 會 幫 你 打，長大 愈 有力','<div class="tcrd"><div style="animation-delay:.2s;width:clamp(100px,16vh,150px)"><img src="'+pi+'" alt=""></div></div><div class="tchips"><span>'+PG(0)+' 寶寶 💥 ＋3</span><span>'+PG(1)+' 長大 💥 ＋5</span><span>'+PG(2)+' 進化 💥 ＋8</span></div>',function(){}],
     ['📖 集滿 一套 ➜ 拿到 稱號','<div class="tcrd">'+CAT.SET[0][1].slice(0,3).map(function(id,i){return '<div style="animation-delay:'+(.2+i*.4)+'s;width:clamp(80px,12vh,120px)"><img src="'+img(id)+'" alt=""><b>✔</b></div>'}).join('')+'</div><div class="tbig" style="animation-delay:1.8s">🏅 <small>'+CAT.SET[0][0]+'</small></div>',function(){tsp(.5,.5,'star')}],
     ['🎯 收集 只 讓 你 更 帥，不會 加 分數','<div class="tchips"><span>🎯 分數 ＝ 你 自己 答 的</span><span>⚔ 裝備 ＝ 戰士 更 帥</span></div>',function(){}]],
  /* 2026-10-21 第十八次 第 4-1 點：學生 事先 秒懂 ── 不一樣 的 階級 不一樣 的 特效、愈 高階 愈 強大；買到 新的、升階 ➜ 合體 愈來愈 華麗、每一次 不一樣。
     第 1～5 幕、第 6、7 幕 在 畫面 裡 真的 演（RPLIFE.demo） */
  /* 2026-10-23 第二十二次 第 3(1)～(4) 點：第 1、10 幕 整個 暗 ➜ 亮的 大卡片（.ttier.big）；第 7、8 幕 畫面 太 窄 ➜ .tdemo.wide 撐滿；第 9 幕 刪掉 */
  d:[['⚔ 戰士 有 5 個 階級：每一階 的 特效 都 不一樣','<div class="ttier big">'+[1,2,3,4,5].map(function(n){return '<span class="tc'+n+'" style="animation-delay:'+(.2+n*.4)+'s">'+tb(n)+'<small>'+(window.RPFX?RPFX.ts(n)+'<br>'+RPFX.TN[n]:'')+'</small></span>'}).join('')+'</div>',function(){}]].concat(
     [[1,'鋼鐵 火花'],[2,'藍色 雙環＋交叉 劍光'],[3,'火柱 沖天＋火星 往上 噴'],[4,'天雷 劈下＋雷電 光翼'],[5,'黃金 光翼＋皇冠 光環＋核彈級 爆炸']].map(function(x){var n=x[0];
       return [(window.RPFX?RPFX.ts(n)+' '+RPFX.TN[n]:'')+'：'+x[1],'<div class="tdemo"><div class="tdic">'+tb(n)+'</div><div class="tdpw"><span>威力</span>'+[1,2,3,4,5].map(function(k){return '<i class="'+(k<=n?'on':'')+'"></i>'}).join('')+'</div></div>',
         function(){tdemo(n)}]}),
     [['🎁 收集 還 不多 ➜ 🌟 合體 等級 ★','<div class="tdemo wide"><div class="tdlab">合體 等級 <b>★</b></div><img class="tdh" src="'+hi+'" alt=""><div class="tdpw"><span>威力</span><i class="on"></i><i></i><i></i><i></i><i></i></div></div>',function(){tdemo(0,{g:1,v:0})}],
      ['🛍 買到 新的、更強 的 ＋ ⏫ 升階 ➜ 🌟 合體 等級 ★★★★★','<div class="tdemo wide"><div class="tdlab">合體 等級 <b>★★★★★</b></div><img class="tdh g5" src="'+hi+'" alt=""><div class="tdpw"><span>威力</span><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div></div>',function(){tdemo(0,{g:5,v:5})}],
      /* 第 3(7) 點：每一階 的 升階 典禮 都 授予 專屬 裝備（愈 高階 愈多 樣）；亮的 大卡片，一階 一階 亮起來 */
      ['⏫ 升到 新 的 階級 ➜ 升階 典禮：授予 專屬 裝備','<div class="ttier big up">'+[1,2,3,4,5].map(function(n,i){return '<span class="tc'+n+'" style="animation-delay:'+(.2+i*.6)+'s">'+tb(n)+'<small>'+(window.RPFX?RPFX.TN[n]:'')+'</small>'+(window.RPLIFE&&RPLIFE.regHTML?RPLIFE.regHTML(n):'')+'</span>'}).join('')+'</div>',function(){}]]),
  /* 2026-10-21 第十六次 第 5、6 點＋老師再加 4 點：📜 獎勵 規則（第一次 打開 一定 要 看完、答對 5 題）。一幕 一件事；數字 全部 讀 CAT（跟 _calc.js 一樣） */
  r:rulesScenes(tb,Math.max(V.tier||0,V.tmax||0)),
  w:cwScenes()
  }}
/* 2026-10-21 第十七次 老師第 2～7 點：先 3 幕講「⭐ 經驗值／🪙 金幣／⚔ 戰力 是什麼」，再講規則；學生看不到 A、B、%：A ➜ 👀 看完才按、B ➜ ✏️ 錯了會改、90% ➜ 10 題至少 9 題；
   冠軍寶箱的例子 ＝ 自己年級（三年級跟三年級比）；每班冠軍 ＝ 老師同意才上台；拿掉家長規則單。一幕一件事，數字全部讀 CAT（跟 _calc.js 一樣） */
function rulesScenes(tb,me){var D=CAT.DILI,ex=Object.keys(CAT.TX),dl=function(i){return 'animation-delay:'+i+'s'},
    V=RV||{},e=V.st?V.st.eq:{},hi=e.h?img(e.h):'chars/b31.jpg',wi=e.w?img(e.w):'weapons/w03.jpg',pi=e.p?img(e.p):'pets/p03.jpg',
    G=String(SCID||'3').charAt(0)==='4'?'4':'3',GN=G==='4'?'四年級':'三年級',
    fl=function(L){return '<div class="iflow">'+L.map(function(x,i){return (i?'<i class="ia" style="'+dl(.5+i*.9-.4)+'">➜</i>':'')+'<span class="'+(x[2]||'')+'" style="'+dl(.5+i*.9)+'"><b>'+x[0]+'</b><small>'+x[1]+'</small></span>'}).join('')+'</div>'},
    dots=function(n,ok){var h='<div class="rdots">';for(var i=0;i<n;i++)h+='<i class="'+(i<ok?'ok':'no')+'" style="'+dl(.4+i*.18)+'">'+(i<ok?'✓':'✗')+'</i>';return h+'</div>'};
  return [
  ['⭐ 經驗值 ＝ 讓你升級',fl([['📝','做完練習'],['⭐','經驗值','xp'],['🔓','Lv 升高<br>開放更酷的']])+'<div class="rnote" style="'+dl(3.2)+'">⭐ 愈多 ➜ Lv 愈高</div>',function(){}],
  ['🪙 金幣 ＝ 拿來換裝備',fl([['✅','答對、改對'],['🪙','金幣','cn'],['<img src="shop/s0106.jpg" alt="">','換戰士、武器、寵物']])+'',function(){}],
  ['⚔ 戰力 ＝ 你全身的裝備加起來','<div class="tcrd"><div style="animation-delay:.2s"><img src="'+hi+'" alt=""><b>戰士</b></div><div style="animation-delay:.6s"><img src="'+wi+'" alt=""><b>武器</b></div><div style="animation-delay:1s"><img src="'+pi+'" alt=""><b>寵物</b></div></div><div class="tbig">⚔ <b class="tcn">0</b><small>裝備愈強 ➜ 戰力愈高</small></div>',function(){var n=V.power||320;tcount([[1400,Math.round(n*.3)],[1800,Math.round(n*.6)],[2200,n]])}],
  ['📅 每個星期一 0:00 重新開始算','<div class="rwk">'+['一','二','三','四','五','六','日'].map(function(d,i){return '<span style="'+dl(.3+i*.35)+'">'+d+(i===0?'<small>0:00 開始</small>':'<small>&nbsp;</small>')+'</span>'}).join('')+'</div><div class="rnote" style="'+dl(3)+'">一週 ＝ 星期一到星期日</div>',function(){}],
  ['⚔ 戰力到了 ➜ 升階級（不會掉）','<div class="rtb s">'+[1,2,3,4,5].map(function(n){return '<div class="'+(n===me?'me':'')+'" style="'+dl(.3+n*.45)+'">'+tb(n,1)+'<small>⚔ '+nf(CAT.TIER[n-1][0])+'</small><em>🪙 ＋'+CAT.TB[n][0]+'%</em></div>'}).join('')+'</div>'+
    '<div class="rnote" style="'+dl(3)+'">階級愈高 ➜ 練習拿到的 🪙 愈多</div>',function(){}],
  ['⏫ 升階以後，🪙 才變多（以前的不補）','<div class="rtl"><div style="'+dl(.3)+'">星期一<span>練習</span><b>🪙 20</b></div><div class="up" style="'+dl(1.2)+'">星期二<span>升到</span>'+tb(2,1)+'</div><div style="'+dl(2.1)+'">星期三<span>練習</span><b>🪙 22</b></div></div><div class="rnote" style="'+dl(3.2)+'">星期一的 🪙 20 還是 20</div>',function(){}],
  ['🛍 每一階有 2 樣專屬寶物','<div class="rex">'+[1,2,3,4,5].map(function(n){return ex.filter(function(id){return CAT.TX[id]===n}).map(function(id,k){return '<div style="'+dl(.2+n*.35+k*.1)+'">'+tb(n)+'<img src="shop/'+id+'.jpg" alt=""></div>'}).join('')}).join('')+'</div><div class="rnote" style="'+dl(2.6)+'">升到那一階，才買得到</div>',function(){}],
  ['👀 好習慣 1：看完才按','<div class="rhb"><div class="ok" style="'+dl(.3)+'"><b>👀</b>看完題目<i>➜</i>再按<em>✅</em></div><div class="no" style="'+dl(1.6)+'"><b>👆</b>不到 1 秒就按<i>➜</i>亂按<em>❌</em></div></div>',function(){}],
  ['✏️ 好習慣 2：錯了會改','<div class="rhb"><div class="ok" style="'+dl(.3)+'"><b class="x">✗</b>答錯<i>➜</i>再做一次<i>➜</i><b class="v">✓</b>改對<em>✅</em></div></div><div class="rnote" style="'+dl(2)+'">一題都沒錯，也算做到 ✅</div>',function(){}],
  ['🏆 最認真練習 ＝ 練最久 ＋ 兩個好習慣','<div class="rsum"><span style="'+dl(.3)+'">練最久</span><i style="'+dl(.8)+'">＋</i><span style="'+dl(1.1)+'">👀 看完才按</span><i style="'+dl(1.6)+'">＋</i><span style="'+dl(1.9)+'">✏️ 錯了會改</span><i style="'+dl(2.4)+'">＝</i><span class="gd" style="'+dl(2.7)+'">🏆</span></div>'+
    dots(10,9)+'<div class="rnote" style="'+dl(2.6)+'">好習慣：10 題裡面，至少 9 題做到</div>',function(){}],
  ['👑 冠軍寶箱 ＝ '+GN+'最認真練習前 5 名','<div class="rlist">'+[['1',G+'0412',''],['2',G+'0205',''],['3',G+'0701','👀 沒做到 ➜ 換下一名','x'],['4',G+'0903',''],['5',G+'1108',''],['6',G+'0417','➜ 補上','in']].map(function(x,i){return '<div class="'+(x[3]||'')+'" style="'+dl(.3+i*.35)+'"><b>'+x[0]+'</b> '+x[1]+' <small>'+x[2]+'</small></div>'}).join('')+'</div>'+
    '<div class="rnote" style="'+dl(3)+'">'+GN+'跟'+GN+'比；每個星期一 0:00 自動發</div>'+
    /* 2026-10-22 第二十一次 第 5 點：👑 冠軍寶箱 有什麼幫助（名單 演完 ➜ 寶箱 抖 ➜ 打開 ➜ 🪙 或 商城寶物 飛出來） */
    '<div class="rchest"><div class="rcq">👑 冠軍寶箱 有什麼幫助？</div><div class="rcb"><span class="rcx">🎁</span><span class="rcl"></span>'+
    '<span class="rco a">🪙 ＋'+CAT.CH.c+'</span><span class="rco b">⭐ ＋'+CAT.CH.x+'</span></div>'+
    '<div class="rcs">打開 ➜ 拿到 🪙 金幣＋⭐ 經驗值 ➜ 換更酷的裝備！</div></div>',function(){}],
  ['👑 各班上一週最認真練習第 1 名 ➜ 上台選遊戲',fl([['⚡','老師開<br>現場任務'],['✅','老師同意'],['👑','冠軍上台<br>點一個遊戲','gd']])+'<div class="rnote" style="'+dl(3.2)+'">老師同意之後，各班冠軍才能上台選遊戲；一週只能選一次。<br>老師決定：是否開啟「現場任務」。</div>',function(){}],
  ['⚡ 現場任務：老師決定：是否〔✖2〕➜ 🪙⭐ 變 2 倍','<div class="rmul"><div style="'+dl(.3)+'">平常<b>🪙 5</b><small>⭐ 10</small></div><div style="'+dl(1)+'">✖1.5<b>🪙 8</b><small>⭐ 15</small></div><div class="x2" style="'+dl(1.7)+'">✖2<b>🪙 10</b><small>⭐ 20</small></div></div><div class="rnote" style="'+dl(2.6)+'">例：答對 5 題；開不開，老師決定</div>'+
    '<div class="rnote" style="'+dl(3.4)+'">最用心且規矩最好的班級，由老師決定：是否幫那一班開啟〔✖2〕。</div>',function(){}],
  /* 2026-10-23 第二十二次 第 2 點：👫 ➜ 自己畫的「全班一起舉手歡呼」（5 個同學並排、手往上，沒有牽手）；「老師決定」刪掉 ➜ 每個星期一自動發；🪙 ＋200、⭐ ＋100（SC.RPCW） */
  /* 2026-10-25 第二十五次：全班獎勵 新規則（全班 8 成練 2 天、照天數多給；細節 ＝ 🎯 全班獎勵 小測驗 cwScenes） */
  ['🎁 全班獎勵：全班'+CAT.CW.pct/10+'成的人這週練'+CAT.CW.d1+'天',fl([[TEAM,'全班'+CAT.CW.pct/10+'成的人<br>這週練'+CAT.CW.d1+'天'],['📅','下星期一<br>自動發'],['🎁','自己練'+CAT.CW.d1+'天以上<br>練愈多天拿愈多','gd']]),function(){}]]}
/* 🎯 全班獎勵 小測驗的 4 幕（2026-10-25 第二十五次，老師：學生要事先真正理解；練愈多天拿愈多；進一步目標 ＝ 全班每一位都練 3 天）。數字全部從 SC.RPCW 來 */
function cwScenes(){var W=CAT.CW,dl=function(i){return 'animation-delay:'+i+'s'},
    ppl=function(n,ok,lab){var h='<div class="cwp">';for(var i=0;i<n;i++)h+='<span class="'+(i<ok?'ok':'no')+'" style="'+dl(.3+i*.15)+'"><b>'+(i<ok?'🙋':'🧍')+'</b><small>'+(i<ok?lab:'')+'</small></span>';return h+'</div>'},
    bars=function(T,top){var ks=Object.keys(T).map(Number),mx=T[ks[ks.length-1]][0];return '<div class="cwb">'+ks.map(function(d,i){var v=T[d];return '<div style="'+dl(.3+i*.35)+'"><em>🪙'+v[0]+'<br><small>⭐'+v[1]+'</small></em><i style="height:'+Math.round(v[0]/mx*100)+'%"></i><b>'+(d===7?'👑':'')+d+'天</b></div>'}).join('')+'</div>'};
  /* 2026-10-26 第二十九次 第 10 點（老師）：秒懂「非上課時間」＝ 每天 下午 4 點 以後、星期六 日 整天（老師 選 B：早上 上學 前 也 算）；課後班 400 ＝ 5:30 以後 */
  var tl=function(lab,seg,d){return '<div class="cwt" style="'+dl(d)+'"><b class="cwd">'+lab+'</b><div class="cwbar">'+seg.map(function(x){return '<span class="'+x[0]+'" style="flex:'+x[1]+';'+dl(d+.4)+'">'+x[2]+'</span>'}).join('')+'</div></div>'};
  return [
  /* 2026-10-27 第三十二次 第 9-(2) 點（老師）：第一幕 字 擠在一起、太多 ➜ 只留 兩張 大卡（✗ 上課 不算／✅ 放學後、週末 算）＋一行 小字 */
  ['🕓 什麼時候練，才算？',
   '<div class="cwy cw1"><div class="no" style="'+dl(.3)+'"><b>🏫</b><span>上課時間<br>❌ 不算</span></div><div class="ok" style="'+dl(1.2)+'"><b>🏠</b><span>放學後、週末<br>✅ 算</span></div></div>'+
   '<div class="rnote" style="'+dl(2.4)+'">上課 ＝ 星期一～五 7:40～16:00</div>',function(){}],
  ['🎯 目標①：全班'+W.pct/10+'成的人練'+W.d1+'天',ppl(10,W.pct/10,W.d1+'天')+'<div class="rnote" style="'+dl(2.2)+'">10個人裡'+W.pct/10+'個（30人 ➜ 24人）這週在 非上課時間 練'+W.d1+'天以上</div><div class="rnote" style="'+dl(3.2)+'">📅 下星期一自動發</div>',function(){}],
  ['🎁 自己練'+W.d1+'天以上，才拿得到','<div class="cwy"><div class="no" style="'+dl(.3)+'"><b>練0天、1天</b><span>❌ 拿不到</span></div><div class="ok" style="'+dl(1.3)+'"><b>練'+W.d1+'天</b><span>🎁 🪙'+W.t1[W.d1][0]+'　⭐'+W.t1[W.d1][1]+'</span></div></div><div class="rnote" style="'+dl(2.4)+'">沒練的人，全班達到也拿不到</div>',function(){}],
  ['📈 練愈多天 ➜ 拿愈多',bars(W.t1)+'<div class="rnote" style="'+dl(2.6)+'">每一天都練 ＝ 拿最多 👑</div>',function(){}],
  ['🚀 目標②：全班每一位都練'+W.d2+'天 ➜ 每個人拿更多','<div class="rnote" style="'+dl(.2)+'">🙋🙋🙋🙋🙋 全班每一位 都練'+W.d2+'天以上</div>'+bars(W.t2)+'<div class="rnote" style="'+dl(2.8)+'">全班一起努力，每個人都拿更多！</div>',function(){}]]}
/* 全班一起：5 個同學並排舉手歡呼（每一個人顏色不一樣，上面一顆大星星；跳一跳） */
var TEAM='<svg class="tmsv" viewBox="0 0 150 90" aria-label="全班一起"><path d="M75 4l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L75 27.6l-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.5z" fill="#FFD54A"/>'+
  [['#FF8A65',15],['#4FC3F7',45],['#FFD54A',75],['#81C784',105],['#BA68C8',135]].map(function(k,i){var x=k[1];return '<g class="tm" style="animation-delay:'+(i*.12)+'s"><circle cx="'+x+'" cy="52" r="8" fill="#FFE0C2"/><path d="M'+(x-10)+' 88v-16a10 10 0 0 1 20 0v16z" fill="'+k[0]+'"/><path d="M'+(x-8)+' 68l-6-20M'+(x+8)+' 68l6-20" stroke="'+k[0]+'" stroke-width="5" stroke-linecap="round"/></g>'}).join('')+'</svg>';

/* 一幕 的 樣子：大 圖示 ➜ 拿到 什麼；下面 ⭐／🪙 數字 數上去 */
function teq(L,R,k){return '<div class="teq">'+L+'<span class="tarr">➜</span>'+R+'</div><div class="ttot '+k+'">'+(k==='xp'?'⭐ 經驗值':'🪙 金幣')+' <b class="tcn">0</b></div>'}
function tsp(x,y,e){if(typeof RPFX==='undefined')return;var t=document.getElementById('tst');if(!t)return;TUT.cn.push(setTimeout(function(){var r=t.getBoundingClientRect();RPFX.spark(t,r.width*x,r.height*y,e,30)},1500))}
function tcount(L){L.forEach(function(x){TUT.cn.push(setTimeout(function(){var c=document.querySelector('#tst .tsc.on .tcn');if(c)c.textContent=nf(x[1])},x[0]))})}
function tatk(ms){if(typeof RPFX==='undefined')return;TUT.cn.push(setTimeout(function(){var t=document.getElementById('tst');if(!t)return;var r=t.getBoundingClientRect(),e=RV&&RV.st.eq;
  RPFX.attack(t,{from:{x:r.width*.3,y:r.height*.55},to:{x:r.width*.72,y:r.height*.5},w:e&&e.w,id:SCID,dmg:RV?RV.hit:10,quick:true,name:false})},ms))}
/* 第十八次：秒懂 動畫 裡 真的 演 特效（n ＝ 階級；o.g ＝ 合體 等級）；換幕、離開 就 停 */
function tdemo(n,o){if(!window.RPLIFE||!RPLIFE.demo)return;var h=document.querySelector('#tst .tsc.on .tdemo');if(h)TUT.dm=RPLIFE.demo(h,n,o)}
function tutHTML(){var S=tutScenes()[TCH]||[];
  return '<div class="tut"><div class="tch">'+(rLocked()?[['r','📜 獎勵 規則']]:wLocked()?[['w','🎯 全班獎勵']]:[['r','📜 獎勵 規則'],['a','⭐🪙 經驗值、金幣怎麼來'],['b','⚔ 戰力 是 什麼'],['c','🎁 收集 有 什麼 幫助'],['d','⚔ 階級 愈高 能力 愈強'],['w','🎯 全班獎勵']].filter(function(x){return ABIL_ON||x[0]!=='d'})).map(function(x){return '<button data-tch="'+x[0]+'" class="'+(TCH===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div>'+
    '<div class="tst c'+TCH+'" id="tst">'+S.map(function(x){return '<div class="tsc"><div class="cap">'+x[0]+'</div><div class="vis">'+x[1]+'</div></div>'}).join('')+'</div>'+
    '<div class="tprog"><i id="tpb"></i></div><div class="tctl"><button id="tPrev" aria-label="上一幕">◀ 上一幕</button><button id="tPause" class="tpz">⏸ 暫停</button><button id="tNext" aria-label="下一幕">下一幕 ▶</button></div>'+
    '<div class="tnav">'+S.map(function(x,i){return '<button data-tut="'+i+'">'+(i+1)+'</button>'}).join('')+'<button class="re" data-tut="0">⟲ 從頭 再看</button></div>'+
    (TCH==='r'||TCH==='w'?(QZ.back!=null?'<button class="qback" id="qzBack">📝 回到 第 '+(QZ.i+1)+' 題</button>':(TCH==='w'?'<button class="qzgo" id="qzGo"'+(wLocked()&&!QZ.seenW?' hidden':'')+'>📝 '+(cwDone()?'再答一次3題（已經領過）':'答對3題 ➜ 🪙＋50 ⭐＋25（只有一次）')+'</button>':'<button class="qzgo" id="qzGo"'+(rLocked()&&!QZ.seenEnd?' hidden':'')+'>📝 '+(rLocked()?'5 題問題（都答對，就可以開始玩）':'再考一次 5 題問題')+'</button>')):'')+'</div>'}
/* 一幕 停 TDUR 毫秒 才 換（第十六次：從 4.8 秒 改 7.5 秒）；〔⏸ 暫停〕＝ 不 換 下一幕（這一幕 的 動畫 照樣 演完，字 留著 慢慢 看），進度條 也 停 */
var TDUR=7500;
function tutStop(){if(TUT.dm){TUT.dm.stop();TUT.dm=null}clearTimeout(TUT.tm);cancelAnimationFrame(TUT.raf||0);TUT.cn.forEach(clearTimeout);TUT.cn=[]}
function tutTick(){var b=document.getElementById('tpb'),L=document.querySelectorAll('#tst .tsc');if(!b||!L.length)return;var now=Date.now();
  if(!TUT.pz){TUT.left-=now-TUT.last;if(TUT.left<=0){if(TUT.i<L.length-1){tutGo(TUT.i+1);return}TUT.left=0;tutPause(true)}}TUT.last=now;
  b.style.width=(100-Math.max(0,TUT.left)/TDUR*100).toFixed(1)+'%';TUT.raf=requestAnimationFrame(tutTick)}
function tutPause(v){TUT.pz=v;var b=document.getElementById('tPause'),L=document.querySelectorAll('#tst .tsc'),end=TUT.i>=L.length-1&&TUT.left<=0;
  if(b){b.textContent=v?(end?'⟲ 從頭 再看':'▶ 繼續'):'⏸ 暫停';b.classList.toggle('on',v)}var t=document.getElementById('tst');if(t)t.classList.toggle('pz',v&&!end)}
function tutGo(i){tutStop();var L=document.querySelectorAll('#tst .tsc');if(!L[i])return;
  [].forEach.call(L,function(x){x.classList.remove('on')});void L[i].offsetWidth;L[i].classList.add('on');
  [].forEach.call(document.querySelectorAll('.tnav [data-tut]'),function(b,k){b.classList.toggle('on',k===i)});
  var F=(tutScenes()[TCH]||[])[i];if(F&&F[2])F[2]();
  TUT.i=i;TUT.left=TDUR;TUT.last=Date.now();tutPause(!!TUT.pz);TUT.raf=requestAnimationFrame(tutTick);
  if((TCH==='r'||TCH==='w')&&i>=L.length-1){if(TCH==='w')QZ.seenW=1;else QZ.seenEnd=1;var qg=document.getElementById('qzGo');if(qg)qg.hidden=false}}
/* 📝 5 題 小問題（2026-10-21：老師 選「5 題，一件 一題」）：答錯 ➜ 回去 看 那一幕（停住），再 回來 答 同一題；5 題 都 對 ➜ 伺服器 記下來（老師看板 看得到）。選項 每次 重洗 */
var QZ={i:0,ok:[],back:null,seenEnd:0,seenW:0,k:'r'};
/* 2026-10-22 第十九次：答對 5 題 ＝ 這台平板也記下來（rp_qz_座號）。伺服器還沒重新部署（還是舊的規則版本）也進得去；之後每次打開再偷偷送一次，部署好了老師看板就看得到 */
function qzLocal(){try{return localStorage.getItem('rp_qz_'+SCID)===String(CAT.QV)}catch(x){return false}}
function qzKeep(){try{localStorage.setItem('rp_qz_'+SCID,String(CAT.QV))}catch(x){}}
function qzSync(){var me=SCID;if(!RV||RV.qz===CAT.QV||!qzLocal())return;scFetch('',{a:'rpg',id:me,op:'qz',v:CAT.QV},20000).then(function(j){if(me===SCID&&j&&j.ok&&j.v&&j.v.qz===CAT.QV){var dt=RV&&RV.dt||0;RV=j.v;RV.dt=dt}},function(){})}
/* 2026-10-22 第二十次：平板 記不住（無痕、空間滿）也 進得去：這一次 打開 記在 記憶裡（QZOK） */
var QZOK='';
function rLocked(){return !!RV&&RV.qz!==CAT.QV&&!qzLocal()&&QZOK!==SCID}
/* 🎯 全班獎勵 小測驗（2026-10-25 第二十五次，老師「獨立一個小測驗」）：看懂獎勵規則以後，還沒答對這 3 題 ➜ 先看 4 幕＋答 3 題才能玩；做法跟 5 題一樣（平板記住 rp_cq_座號、送不到下次再送） */
var CQOK='';
function cwLocal(){try{return localStorage.getItem('rp_cq_'+SCID)===String(CAT.CQV)}catch(x){return false}}
function cwKeep(){try{localStorage.setItem('rp_cq_'+SCID,String(CAT.CQV))}catch(x){}}
function cwDone(){return !!RV&&(RV.cq===CAT.CQV||cwLocal()||CQOK===SCID)}
function wLocked(){return false}   /* 2026-10-27 第三十二次 第 9-(3) 點：全班獎勵 3 題 不強制（鼓勵：答對 ＝ 🪙＋50 ⭐＋25 一次） */
function anyLocked(){return rLocked()||wLocked()}
function cwSync(){var me=SCID;if(!RV||RV.cq===CAT.CQV||!cwLocal())return;scFetch('',{a:'rpg',id:me,op:'cq',v:CAT.CQV},20000).then(function(j){if(me===SCID&&j&&j.ok&&j.v&&j.v.cq===CAT.CQV){var dt=RV&&RV.dt||0;RV=j.v;RV.dt=dt}},function(){})}
/* 2026-10-27 第三十二次 第 9-(3) 點（老師）：3 題 太 囉嗦 ➜ 一句話、兩三個 短 選項；不強制，答對 ＝ 🪙＋50 ⭐＋25（只有一次，伺服器 rpView） */
function cwQs(){var W=CAT.CW;return [
  {q:'在學校上課時練，算天數嗎？',o:['不算','算'],sc:0},
  {q:'全班達到了，你這週沒練。你拿得到嗎？',o:['拿不到','拿得到'],sc:2},
  {q:'練愈多天，拿到的會…？',o:['愈多','一樣','愈少'],sc:3}]}
function qzQs(){if(QZ.k==='w')return cwQs();return [
  {q:'每個星期幾 0:00 重新開始算？',o:['星期一','星期五','星期日'],sc:3},
  {q:'<u class="pn">小華</u>星期二升到 ★★。哪一個對？',o:['星期二以後練習的 🪙 才變多','星期一的 🪙 也會補給他','題目會變簡單'],sc:5},
  {q:'👑 冠軍寶箱給誰？',o:['練最久，而且「👀 看完才按」「✏️ 錯了會改」都做到的前 5 名','練最久的前 5 名（亂按也可以）','正確率最高的 5 個人'],sc:10},
  {q:'最用心且規矩最好的班級，由老師決定：是否幫那一班開啟〔✖2〕。如果老師開啟〔✖2〕，答對 5 題，拿到幾個 🪙？',o:['🪙 10','🪙 5','🪙 7'],sc:12},
  {q:'誰可以上台選現場任務的遊戲？',o:['老師同意以後，各班上一週最認真練習第 1 名','全班投票','自己想選就上台'],sc:11}]}
function qzShuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function qzDraw(){var Q=qzQs()[QZ.i],ord=qzShuf(Q.o.map(function(x,k){return k})),b=document.getElementById('rqzb');
  var N=qzQs().length,ks=[];for(var z=0;z<N;z++)ks.push(z);b.innerHTML='<div class="qn">📝 第 '+(QZ.i+1)+' 題 ／ '+N+' 題</div><div class="qdots">'+ks.map(function(k){return '<i class="'+(k<QZ.i?'ok':k===QZ.i?'now':'')+'"></i>'}).join('')+'</div>'+
    '<div class="qt">'+Q.q+'</div><div class="qo">'+ord.map(function(k){return '<button data-qa="'+k+'">'+'①②③'.charAt(ord.indexOf(k))+' '+Q.o[k]+'</button>'}).join('')+'</div><div class="qr" id="qzr"></div>';
  document.getElementById('rqz').className='on'}
function qzStart(){QZ.k=TCH==='w'?'w':'r';QZ.i=0;QZ.back=null;qzDraw()}
function qzAns(k,btn){var Q=qzQs()[QZ.i],r=document.getElementById('qzr');[].forEach.call(document.querySelectorAll('#rqz .qo button'),function(x){x.disabled=true});
  if(k===0){btn.classList.add('ok');r.innerHTML='✅ 答對 了！';setTimeout(function(){QZ.i++;if(QZ.i<qzQs().length)qzDraw();else qzDone()},900)}
  else{btn.classList.add('bad');r.innerHTML='❌ 還 沒 對：我們 再 看 一次 這一幕<br><button id="qzSee">▶ 再看 這一幕</button>'}}
function qzSee(){var Q=qzQs()[QZ.i];document.getElementById('rqz').className='';QZ.back=QZ.i;TCH=QZ.k;TUT.pz=true;drawShop();tutGo(Q.sc);
  setTimeout(function(){var u=document.querySelector('.tut');if(u)u.scrollIntoView({behavior:'smooth',block:'start'})},50)}
/* 2026-10-22 第二十次：5 題 都 對 ＝ 馬上 解鎖、馬上 出現〔⚔ 開始 戰神之路〕，不用 等 伺服器。
   原因：上課 全班 一起 送，伺服器 一個一個 排隊（鎖）＋ 讀 全部 成績，常常 超過 12 秒 ➜ 以前 會 卡在「📶 沒有 送到」；伺服器 是 舊版（不認得 小考）也 一樣 卡住。
   現在：送 給 老師 在 背後 做；送不到 ＝ 下次 打開 qzSync() 自動 再送 */
function qzDone(){var b=document.getElementById('rqzb'),me=SCID,W=QZ.k==='w',first=W&&!cwDone();if(W){cwKeep();CQOK=me}else{qzKeep();QZOK=me}
  b.innerHTML=fwHTML()+'<div class="qt">'+(W?'✅ 你看懂了全班獎勵！'+(first?'<br>🎁 🪙＋50　⭐＋25':''):'✅ 你 看懂 了 全部 獎勵 規則！')+'</div><div class="qr"><span id="qzSent">⏳ 正在 告訴 老師…</span><br><button id="qzEnd">⚔ 開始 戰神之路</button></div>';
  qzSend(me,0,W)}
function qzSend(me,k,W){scFetch('',{a:'rpg',id:me,op:W?'cq':'qz',v:W?CAT.CQV:CAT.QV},20000).then(function(j){if(me!==SCID)return;
    if(j&&j.ok&&j.v&&(W?j.v.cq===CAT.CQV:j.v.qz===CAT.QV)){var dt=RV&&RV.dt||0;RV=j.v;RV.dt=dt;var t=document.getElementById('qzSent');if(t)t.textContent='老師看得到：你的作答情形'}
    else qzSent2()},function(){if(me!==SCID)return;if(k<2)setTimeout(function(){qzSend(me,k+1,W)},4000);else qzSent2()})}
function qzSent2(){var t=document.getElementById('qzSent');if(t)t.textContent='下次 打開，會 自動 告訴 老師'}
function gateHTML(){var T=tutScenes(),n=T.r.length,m=T.w.length;if(wLocked())return '<div class="rgate">🎯 <b>全班獎勵</b>有新規則：先看完<b>'+m+'幕</b>，再答<b>3題</b>，都答對，就可以開始玩！<div class="rst"><span class="'+(QZ.seenW?'on':'')+'">① 👀 看完'+m+'幕</span><span>② 📝 3題都答對</span><span>③ ⚔ 開始玩</span></div></div>';return rLocked()?'<div class="rgate">📜 第一次打開<b>戰神之路</b>：先看完<b>獎勵規則</b>（'+n+' 幕），再答 <b>5 題問題</b>，都答對，就可以開始玩！<div class="rst"><span class="'+(QZ.seenEnd?'on':'')+'">① 👀 看完 '+n+' 幕</span><span>② 📝 5 題都答對</span><span>③ ⚔ 開始玩</span></div></div>':''}
function drawShop(){var S=document.getElementById('shop'),h='';
  /* 2026-10-27 第三十二次 第 9-(3) 點：不強制，鼓勵：還沒答對 ＝ 最上面 一條 金色 按鈕 */
  if(RV&&!rLocked()&&!cwDone()&&!(TAB==='q'&&TCH==='w'))h+='<button class="cwbn" id="cwBn">🎯 看懂全班獎勵，答對3題 ➜ 🪙＋50 ⭐＋25（只有一次）</button>';
  var rin=document.getElementById('rpin');if(rin)rin.classList.toggle('rlock',anyLocked());
  if(rLocked()){TAB='q';if(TCH!=='r')TCH='r'}else if(wLocked()){TAB='q';if(TCH!=='w')TCH='w'}
  if(TAB==='h'||TAB==='w'||TAB==='p'){var k=TAB,nm={h:'戰士',w:'武器',p:'寵物'}[k];
    if(!RV.st.own[k].length&&!RV.st.free[k])h+='<div class="free">🎁 第一個 '+nm+' 免費：選 1 個 ★ 基本 的 '+nm+'！之後 用 🪙 金幣 換 更酷 的。</div>';
    if(k==='h')h+='<div class="sub2"><button data-sex="b" class="'+(SEX==='b'?'on':'')+'">👦 男生 戰士</button><button data-sex="g" class="'+(SEX==='g'?'on':'')+'">👧 女生 戰士</button></div>';
    h+='<div class="rar">'+[1,2,3,4,5].map(function(s){return '<span style="color:'+RC[s]+';border-color:'+RC[s]+'">'+stars(s)+' '+RN[s]+' 🪙 '+nf(CAT.P[s])+(CAT.L[s]>1?'（Lv '+CAT.L[s]+'）':'')+'</span>'}).join('')+'</div>';
    h+='<div class="grid">'+ids(k).map(itemHTML).join('')+'</div>'}
  else if(TAB==='m')h+=shopHTML();
  else if(TAB==='t'){var TO=CAT.T.filter(function(t){return !CAT.HIDE[t[0]]||RV.st.own.t.indexOf(t[0])>=0});   /* 2026-10-23 第二十二次：舊寶物暫時下架；買過的還可以戴 */
    h+='<div class="note" style="margin-bottom:8px">✨ 寶物 暫時 下架。'+(TO.length?'你 買過的 還 可以 戴：再 點一下 ＝ 拿下來／戴上。':'')+'</div>'+(TO.length?'<div class="grid">'+TO.map(function(t){return itemHTML(t[0])}).join('')+'</div>':'')}
  else if(TAB==='s'){var all=RV.st.own.h.concat(RV.st.own.w,RV.st.own.p),MI=(RV.mon||{i:0}).i;
    /* 👾 怪物圖鑑：打倒 ＝ 淨化（彩色）、現在 這一隻（暗的）、還沒 遇到（影子） */
    h+='<div class="note">👾 怪物圖鑑：打倒 ＝ 淨化 ✨（已經 打倒 '+MI+' 隻）</div><div class="monset">'+CAT.MON.map(function(m,i){var ok=MI>i||MI>=CAT.MON.length,now=!ok&&MI%CAT.MON.length===i;
      return '<div class="'+(ok?'ok':now?'now':'no')+'"><img src="pets/'+m+'.jpg" alt="">'+(ok?'✨ 淨化':now?'⚔ 現在':'？')+'</div>'}).join('')+'</div><br>';
    h+='<div class="note">📖 集滿 一套 ＝ 拿到 稱號（亮起來）：</div>'+CAT.SET.map(function(x){var ok=x[1].every(function(id){return all.indexOf(id)>=0});
      return '<div class="set'+(ok?' ok':'')+'"><b style="min-width:8em">'+(ok?'✅ ':'')+x[0]+'</b>'+x[1].map(function(id){return '<img src="'+img(id)+'" class="'+(all.indexOf(id)>=0?'':'no')+'" alt="'+id+'">'}).join('')+'</div>'}).join('')}
  else if(anyLocked())h+=gateHTML()+tutHTML();
  else h+=tutHTML()+'<div class="how"><table><tr><th style="width:34%">怎麼 拿</th><th>拿到 多少</th></tr>'+
    '<tr><td>📝 做完 一次 題目、遊戲（練習次數 ＋1）</td><td>⭐ 經驗值 ＋'+CAT.X.rec+'</td></tr><tr><td>🎧 聽完 一站 字卡</td><td>⭐ 經驗值 ＋'+CAT.X.rec+'</td></tr><tr><td>📅 那一天 第一次 練</td><td>⭐ 經驗值 ＋'+CAT.X.day+'（天天練 最划算）</td></tr>'+
    '<tr><td>✅ 第一次 就 答對 1 題</td><td>🪙 金幣 ＋1</td></tr><tr><td>✗➜✓ 答錯 以後 改對 1 題</td><td>🪙 金幣 ＋'+CAT.C.fix+'（改錯 最多 金幣！）</td></tr><tr><td>⬆ 同一組 比 自己 上一次 進步</td><td>🪙 金幣 ＋'+CAT.C.prog+'</td></tr>'+
    '<tr><td>🎁 這一週 練了 '+CAT.C.chestDays+' 天 以上</td><td>保底 寶箱 🪙 ＋'+CAT.C.chest+'（每一個 肯練 的 人 都 拿得到）</td></tr>'+
    '<tr><td>⚠️ 太快 亂按</td><td>那一次 沒有 金幣</td></tr><tr><td>🪙 一天 最多</td><td>'+CAT.TB[0][1]+' 金幣；⚔ 階級 愈高 愈多（'+CAT.TB[1][1]+'～'+CAT.TB[5][1]+'）</td></tr>'+
    '<tr><td>⚔ 戰力 階級</td><td>升階 以後 練習 的 🪙 多 '+CAT.TB[1][0]+'%～'+CAT.TB[5][0]+'%、每一階 2 樣 專屬 寶物、現場任務 登場 特效</td></tr>'+
    '<tr><td>🏪 榮耀 商城</td><td>第 1 排 🪙 500、第 2 排 1,200（Lv 5）、第 3 排 2,500（Lv 10）、第 4 排 5,000（Lv 20）</td></tr>'+
    '<tr><td>🚫 不可以</td><td>交易、搶 別人 的、抽獎；<b>買到的東西不加分數、不會讓題目變簡單</b></td></tr></table>'+
    '<p class="note">⭐ 經驗值 只會 升，不會 被 花掉；等級 夠 才 換得到 ★★★ 以上。🐾 寵物 陪你 練 3 天 長大、7 天 進化。</p></div>';
  S.innerHTML=h;if(TAB==='q')tutGo(0);else tutStop()}
function draw(){drawStage();drawShop()}
/* ── 伺服器 ── */
function load(){if(!SCON){hide('rpin');hide('rpwait');show('rpout');return}
  if(!SCID||!scAsked()){RV=null;hide('rpin');hide('rpwait');show('rpout');return}
  hide('rpout');if(!RV)show('rpwait');var id=SCID;
  scFetch('a=rpg&id='+id+'&_='+Date.now(),null,20000).then(function(j){if(id!==SCID)return;hide('rpwait');if(j&&j.ok){RV=j.v;RV.dt=(j.now||Date.now())-Date.now();RV.bo=j.bo||null;RV.hall=j.hall||[];if(j.stock)STOCK=j.stock;show('rpin');draw();seen();qzSync();cwSync()}else msg('📶 拿不到 你的 戰士，等一下 再 試',1)},function(){hide('rpwait');msg('📶 現在 沒有 網路，等一下 再 試',1)})}
function msg(t,x){var m=document.getElementById('rpm');m.className='on';document.getElementById('rpmb').innerHTML='<div>'+t+'</div><div class="bt"><button class="no" data-m="x">👌 知道了</button></div>'}
function ask(id){var k=kOf(id),fr=freeOk(id),pr=fr?0:price(id),t=k==='t'?tre(id)[1]:'';
  if(CAT.LIM[id]&&STOCK[id]===0){msg('🏷 已經 換完 了<br><span class="note">全部 學生 一共 只有 5 個</span>');return}
  if(CAT.END[id]&&nowS()>=CAT.END[id]){msg('⏳ 已經 下架 了（10 月 31 號）');return}
  if(CAT.TX[id]&&tierMax()<CAT.TX[id]){var tq=CAT.TX[id];msg('🔒 這是 <b>'+(typeof RPFX!=='undefined'?RPFX.tb(tq,1):'')+'</b> 專屬 寶物<br><span class="note">⚔ 戰力 到 '+nf(CAT.TIER[tq-1][0])+' 就 升到 這一階（現在 '+nf(RV.power)+'）</span>');return}
  if(RV.lv<need(id)){msg('🔒 要 <b>Lv '+need(id)+'</b> 才 換得到<br><span class="note">現在 Lv '+RV.lv+'：多 練習 就會 升級 ⭐</span>');return}
  if(!fr&&RV.coins<pr){msg('🪙 還差 <b>'+(pr-RV.coins)+'</b> 金幣<br><span class="note">答對、改對、進步 都會 拿到 金幣</span>');return}
  var m=document.getElementById('rpm');m.className='on';
  document.getElementById('rpmb').innerHTML=(k==='t'?'<img src="'+treImg(id)+'" alt=""><div>'+t.split(' ').slice(1).join(' ')+'</div>':'<img src="'+img(id)+'" alt="'+id+'"><div style="color:'+RC[star(id)]+'">'+stars(star(id))+' '+RN[star(id)]+'</div>')+
    '<div style="margin-top:8px">'+(fr?'🎁 免費 選 這一個？':'用 <b>🪙 '+pr+'</b> 換 這一個？')+'</div><div class="bt"><button class="yes" data-m="buy" data-id="'+id+'">✅ 換</button><button class="no" data-m="x">✕ 不要</button></div>'}
function act(op,id){if(BUSY)return;BUSY=true;var me=SCID;
  scFetch('',{a:'rpg',id:me,op:op,item:id},12000).then(function(j){BUSY=false;if(me!==SCID)return;
    if(j&&j.v){var dt=RV&&RV.dt||0;RV=j.v;RV.dt=dt}if(j&&j.stock)STOCK=j.stock;
    if(j&&j.ok){draw();if(op==='open'){chestShow(j.r);return}var kk=kOf(id);CBP=!!(RV&&RV.st.eq.h)&&(op==='buy'||isEq(id));
      if((kk==='h'||kk==='w'||kk==='p')&&typeof RPFX!=='undefined'){document.getElementById('rpm').className='';summonOf(id,op==='buy')}
      else if(op==='buy'){cele(id);if(sOf(id)&&sOf(id).slot==='fx')setTimeout(function(){rwFx('../',id)},700)}else{document.getElementById('rpm').className='';if(CBP){CBP=false;cbAuto()}}}
    else msg(j&&j.err==='coin'?'🪙 金幣 不夠':j&&j.err==='lv'?'🔒 等級 不夠':j&&j.err==='tier'?'🔒 要 升到 這一階 才 買得到':j&&j.err==='sold'?'🏷 已經 換完 了（全部 只有 5 個）':j&&j.err==='end'?'⏳ 已經 下架 了':j&&j.err==='none'?'👑 沒有 寶箱 了':'❌ 沒有 換成（'+((j&&j.err)||'')+'）')},
   function(){BUSY=false;msg('📶 現在 沒有 網路，沒有 換')})}
/* 戰士、武器、寵物 換到 或 裝上 ➜ 震撼 登場（魔法陣、光柱、閃電、卡片 轉出來、星星 一顆一顆 亮） */
function summonOf(id,isNew){var k=kOf(id),s=star(id),nm={h:'戰士',w:'武器',p:'寵物'}[k],W=k==='w'?RPFX.wInfo(id):null;
  RPFX.summon({img:img(id),star:s,kind:k,w:id,title:(isNew?'🎉 ':'⚔ ')+'你的 '+nm+' 登場！',sub:k==='w'?RPFX.EL[W.e].nm+'．'+stars(s)+'　⚔ 出招 打怪 愈強 愈猛':k==='p'?'🐾 陪你 練習：3 天 長大、7 天 進化，跟你 一起 打怪':stars(s)+' '+RN[s]+'　'+(s>=4?'傳說 降臨！':'準備 出發！'),
    done:function(){if(CBP){CBP=false;setTimeout(cbAuto,250)}else if(k==='w'&&RV&&RV.st.eq.h)setTimeout(atk,200)}})}
/* 寵物 長大／進化：上一次 看到 的 階段 記在 這台 平板（換一隻 寵物 重來） */
function seen(){if(!RV||!SCID)return;var e=RV.st.eq,K='rp_seen_'+SCID,o={};try{o=JSON.parse(localStorage.getItem(K)||'{}')||{}}catch(x){}
  if(e.p&&typeof RPFX!=='undefined'){if(o.p===e.p&&(o.ps||0)<RV.petStage)setTimeout(function(){RPFX.evolve({img:img(e.p),w:e.p,to:RV.petStage})},700);o.p=e.p;o.ps=RV.petStage}
  /* 金幣 比 上一次 多 ➜ 金幣 飛進去 */
  if(o.c!=null&&RV.coins>o.c&&typeof RPFX!=='undefined'){var add=RV.coins-o.c,c0=o.c;setTimeout(function(){var to=document.getElementById('coinN'),fr=document.querySelector('.cov');if(to)RPFX.coins(fr,to,add,function(v){to.textContent=nf(c0+v)},0)},900)}
  /* 2026-10-21 第十八次 第 4-1(3) 點 B：升到 新 的 階級 ➜ ⏫ 升階 典禮（每一階 不一樣）➜ 再 演 一次 全部 合體（新 的 合體 等級）；第一次 打開 只 記下來 */
  var tm=tierMax();if(o.tm!=null&&tm>o.tm&&!window.__NOTU&&window.RPLIFE&&RPLIFE.tierUp){var tb=CAT.TB[tm]||[];setTimeout(function(){RPLIFE.tierUp({k:tm,pct:tb[0],cap:tb[1],done:function(){if(RV&&RV.st.eq.h)setTimeout(cbAuto,250)}})},1300)}o.tm=tm;
  o.c=RV.coins;try{localStorage.setItem(K,JSON.stringify(o))}catch(x){}}
/* 👑 冠軍 寶箱 打開 */
function chestShow(r){var h=r&&r.s?'<img src="'+img(r.s)+'" alt="">🎉 '+CAT.S[sOf(r.s).c-1][1]+'（已經 戴上）':'🪙 ＋'+((r&&r.c)||0)+' 金幣'+(r&&r.x?'　⭐ ＋'+r.x+' 經驗值':'');
  if(typeof RPFX!=='undefined')RPFX.chest({html:h});else msg('👑 '+h)}
function cele(id){var k=kOf(id),m=document.getElementById('rpm');m.className='on cele';
  document.getElementById('rpmb').innerHTML=fwHTML()+(k==='t'?'<img src="'+treImg(id)+'" alt="">':'<img src="'+img(id)+'" alt="'+id+'">')+
    '<div style="font-size:1.2em;color:#FFE07A;margin-top:8px">🎉 換到了！已經 裝上</div>'+(sOf(id)&&sOf(id).slot==='fx'?'<div class="note">💥 答對 現場任務、做完 一次 的 時候 會 放出來</div>':'')+'<div class="bt"><button class="yes" data-m="x">👌 好</button></div>'}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#rpIn')){scLogin(function(){SCH.close();scBar();load()});return}
  if((b=c('#tabs button'))){TAB=b.getAttribute('data-t');[].forEach.call(document.querySelectorAll('#tabs button'),function(x){x.classList.toggle('on',x===b)});drawShop();return}
  if((b=c('[data-sex]'))){SEX=b.getAttribute('data-sex');drawShop();return}
  if((b=c('[data-scat]'))){SCAT=+b.getAttribute('data-scat');drawShop();return}
  if(c('#atkTry')){atk();return}
  if(c('#chOpen')){act('open','');return}
  if(c('#evoTry')&&RV&&RV.st.eq.p&&typeof RPFX!=='undefined'){RPFX.evolve({img:img(RV.st.eq.p),w:RV.st.eq.p,to:RV.petStage});return}
  if((b=c('[data-tut]'))){if(b.classList.contains('re'))TUT.pz=false;tutGo(+b.getAttribute('data-tut'));return}
  if(c('#tPause')){var L0=document.querySelectorAll('#tst .tsc');if(TUT.pz&&TUT.i>=L0.length-1&&TUT.left<=0){TUT.pz=false;tutGo(0)}else tutPause(!TUT.pz);return}
  if(c('#tPrev')){tutGo(Math.max(0,(TUT.i||0)-1));return}
  if(c('#tNext')){var L1=document.querySelectorAll('#tst .tsc');tutGo(Math.min(L1.length-1,(TUT.i||0)+1));return}
  if(c('#qzGo')){qzStart();return}
  if(c('#cwBn')){TAB='q';TCH='w';TUT.pz=false;[].forEach.call(document.querySelectorAll('#tabs button'),function(x){x.classList.toggle('on',x.getAttribute('data-t')==='q')});drawShop();return}
  if(c('#qzBack')){QZ.back=null;TUT.pz=false;qzDraw();return}
  if((b=c('[data-qa]'))){qzAns(+b.getAttribute('data-qa'),b);return}
  if(c('#qzSee')){qzSee();return}
  if(c('#qzEnd')){document.getElementById('rqz').className='';TAB='h';TCH='a';[].forEach.call(document.querySelectorAll('#tabs button'),function(x){x.classList.toggle('on',x.getAttribute('data-t')==='h')});draw();return}
  if((b=c('[data-tch]'))){TCH=b.getAttribute('data-tch');TUT.pz=false;drawShop();return}
  if((b=c('[data-go^="q"]'))){TCH=(b.getAttribute('data-go').charAt(1)||'a');var q=document.querySelector('#tabs [data-t="q"]');if(q)q.click();setTimeout(function(){var u=document.querySelector('.tut');if(u)u.scrollIntoView({behavior:'smooth',block:'start'})},50);return}
  if((b=c('#shop [data-id]'))){var id=b.getAttribute('data-id');if(own(id)){if(kOf(id)==='t'||kOf(id)==='s'||!isEq(id))act('eq',id)}else ask(id);return}
  if((b=c('[data-m]'))){var w=b.getAttribute('data-m');if(w==='buy')act('buy',b.getAttribute('data-id'));else{document.getElementById('rpm').className='';if(CBP){CBP=false;setTimeout(cbAuto,200)}}return}
  if(c('#cbGo')){comboGo();return}
  if(c('#pcard')&&RV&&RV.st.eq.p&&window.RPLIFE){var m0=document.getElementById('mfr');RPLIFE.nuzzle(m0,document.getElementById('hcard'),document.getElementById('pcard'));return}
  if(c('#hcard')&&RV&&RV.st.eq.h){atk();return}
  if(t.id==='rpm')document.getElementById('rpm').className='';
});
/* 🏠 回首頁（2026-10-20 第十四次 老師：三年級 ➜ 三年級在家複習、四年級 ➜ 四年級在家複習，不可以回到老師的總首頁）：
   登入了 ＝ 照 5 碼 的 第一碼；還沒登入 ＝ 從哪一個 在家複習 來 就 回 哪裡；都 不是 ＝ 總首頁 */
function homeHref(){var g=SCID?String(SCID).charAt(0):'',r=document.referrer||'';if(!g){var m=/(g[34])-review/.exec(r);if(m)g=m[1].charAt(1)}
  return g==='3'?'../g3-review/index.html':g==='4'?'../g4-review/index.html':'../index.html'}
function homeFix(){var a=document.getElementById('rpHome');if(a)a.setAttribute('href',homeHref())}
/* 第十七次 老師第 1 點：動態放進來的中文（fx.js、life.js、登入框）也不空格 */
var DSPRE=new RegExp(${JSON.stringify(DSPS)},'g');
function dspN(r){if(r.nodeType===3){var t=r.nodeValue;if(t&&t.indexOf(' ')>=0){var u=t.replace(DSPRE,'$1');if(u!==t)r.nodeValue=u}return}if(r.nodeType!==1)return;var w=document.createTreeWalker(r,4),n;while((n=w.nextNode()))dspN(n)}
try{new MutationObserver(function(L){L.forEach(function(m){if(m.type==='characterData')dspN(m.target);else [].forEach.call(m.addedNodes,dspN)})}).observe(document.body,{childList:true,subtree:true,characterData:true})}catch(x){}
homeFix();
/* 登入、登出、換人：每 0.8 秒看一次 */
setInterval(function(){var k=(SCID||'')+'|'+(SCID&&scAsked()?1:0);if(k!==LAST){LAST=k;RV=null;homeFix();load()}},800);
/* 2026-10-22 第二十一次 第 1、2 點：學生 平板 一直 開著 舊的 網頁（第十八次 的 版本：等 伺服器 說 第 2 版 才 放行）➜ 答對 5 題 又 被 鎖回 規則。
   現在：打開、回到 這個 分頁、每 5 分鐘 問一次 ver.txt（不用 快取），有 新版 ＝ 自動 換成 新版（網址 加 ?v＝新版，一定 拿到 新的）；正在 答題 不換 */
var RPVER='__RPVER__';
function verChk(force){try{if(!force&&(document.getElementById('rqz').className==='on'||BUSY))return;
  fetch('ver.txt?_='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.text():''}).then(function(v){v=String(v||'').trim();if(!/^[0-9a-f]{10}$/.test(v)||v===RPVER)return;
    var K='rp_rl_'+v;try{if(sessionStorage.getItem(K))return;sessionStorage.setItem(K,'1')}catch(e){}location.replace(location.pathname+'?v='+v+location.hash)},function(){})}catch(e){}}
verChk(1);document.addEventListener('visibilitychange',function(){if(!document.hidden)verChk()});window.addEventListener('pageshow',function(e){if(e.persisted)verChk(1)});setInterval(verChk,300000);
</script>
</body></html>
`;
{ const lf = require('crypto').createHash('sha1').update(LIFEJS + fs.readFileSync(path.join(__dirname, '_life.css'), 'utf8')).digest('hex').slice(0, 10); html = html.split('__LFVER__').join(lf); }
{ const out0 = DSP(html), ver = require('crypto').createHash('sha1').update(out0).digest('hex').slice(0, 10);   /* 第二十一次：版本號 ＝ 這一版 網頁 的 指紋 */
  fs.writeFileSync(path.join(__dirname, 'index.html'), out0.split('__RPVER__').join(ver)); fs.writeFileSync(path.join(__dirname, 'ver.txt'), ver + '\n'); }
console.log('rpg ok：英雄 ' + Object.keys(SC.RPR.h).filter(x => !SC.RPHIDE[x]).length + '、武器 ' + Object.keys(SC.RPR.w).length + '、寵物 ' + Object.keys(SC.RPR.p).length + '、寶物 ' + SC.RPT.length + '、商城上架 ' + Object.keys(SC.RPSON).length + ' 類');
/* 🖨 給 家長 的 規則 單（2026-10-21 第十六次 第 6 點：公平、公正、公開；A4 直式、大字；數字 全部 讀 _calc.js） */
{ const TN = ['', '見習戰士', '精英戰士', '烈焰戰將', '雷霆戰神', '傳說戰神'], st = n => '★'.repeat(n), D = SC.DILI, X = SC.RPX, C = SC.RPC;
  const SN = { s0213: '太陽神 披風', s0912: '冰晶 翅膀', s0118: '雙龍 帝王 光環', s0418: '戰神 名字框', s0813: '太陽 鳳凰 帝王（寵物）', s0913: '熔岩 翅膀', s0318: '雷虎 必殺 特效', s0715: '女武神 光之矛', s0220: '創世 至尊 披風', s0420: '大師 名字框' };
  Object.keys(SC.RPTX).forEach(id => { if (!SN[id]) throw new Error('規則單 少了 專屬寶物 的 名字：' + id); });
  const rows = [1, 2, 3, 4, 5].map(n => `<tr><td class="l">${st(n)} ${TN[n]}</td><td>${SC.RPTIER[n - 1][0].toLocaleString()}</td><td>多 ${SC.RPTB[n][0]}%</td><td>${SC.RPTB[n][1]}</td><td class="l">${Object.keys(SC.RPTX).filter(id => SC.RPTX[id] === n).map(id => SN[id]).join('、')}</td></tr>`).join('');
  const page = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>戰神之路 獎勵規則</title><style>
:root{color-scheme:light}body{margin:0;background:#fff;color:#111;font-family:"Noto Sans TC","Microsoft JhengHei",sans-serif;font-size:19px;line-height:1.55}
.pg{max-width:820px;margin:0 auto;padding:18px 16px 40px}h1{font-size:32px;margin:0 0 4px;text-align:center}.sub{text-align:center;color:#444;margin:0 0 14px}
h2{font-size:23px;margin:18px 0 6px;border-left:8px solid #E8A800;padding-left:10px}table{width:100%;border-collapse:collapse;font-size:18px}td,th{border:1.5px solid #555;padding:5px 7px;text-align:center}th{background:#FFF3C4}td.l{text-align:left}
ul{margin:4px 0;padding-left:1.3em}li{margin:3px 0}.box{border:2px solid #333;border-radius:10px;padding:8px 12px;margin-top:10px}.pb{display:block;margin:0 auto 14px;font-size:22px;min-height:56px;padding:6px 26px;border-radius:12px;border:2px solid #8A5A00;background:#FFD54A;cursor:pointer}
.sig{display:flex;justify-content:space-between;gap:20px;margin-top:22px;font-size:19px}.sig span{flex:1;border-bottom:1.5px solid #333;padding-bottom:22px}
@media print{.pb{display:none}.pg{padding:0}body{font-size:15.5px}table{font-size:14.5px}h1{font-size:26px}h2{font-size:19px;margin-top:10px}@page{size:A4;margin:12mm}}
</style></head><body><div class="pg"><button class="pb" onclick="window.print()">🖨 列印 這一張</button>
<h1>⚔ 戰神之路 獎勵規則（給 家長 看）</h1><p class="sub">英語 在家複習 ‧ 全部 由 電腦 從 孩子 的 練習 紀錄 自動 計算，每一個 人 規則 都 一樣</p>
<h2>📅 「一週」是 什麼 時候</h2><p>星期一 0:00 到 星期日 23:59（台灣 時間）。下一個 星期一 0:00 重新 開始 算。</p>
<h2>⭐ 經驗值、🪙 金幣 怎麼 來</h2><ul><li>做完 一次 練習 ⭐ ＋${X.rec}；那一天 第一次 練 ⭐ ＋${X.day}</li><li>第一次 就 答對 1 題 🪙 ＋1；答錯 以後 改對 1 題 🪙 ＋${C.fix}；比 上一次 進步 🪙 ＋${C.prog}；一週 練 ${C.chestDays} 天 以上 🪙 ＋${C.chest}</li>
<li>太快 亂按（一次 裡面 一半 以上 的 題目 不到 1 秒 就 按）＝ 那一次 沒有 ⭐、🪙</li><li>金幣 只能 在 遊戲 裡 換 裝備；<b>裝備、階級 不加 分數，題目 不會 變 簡單</b></li></ul>
<h2>⚔ 戰力 階級（升了 不會 掉）</h2><table><tr><th>階級</th><th>戰力</th><th>練習 金幣</th><th>一天 最多 金幣</th><th>專屬 寶物（升到 才 買得到）</th></tr>
<tr><td class="l">還沒有 階級</td><td>0～299</td><td>照 原本</td><td>${SC.RPTB[0][1]}</td><td class="l">—</td></tr>${rows}</table>
<p>每 升 一階 另外 🪙 ＋${SC.RPTIERC} 一次。<b>升階 以後 練習 的 金幣 才 多</b>（以前 的 不補）。例：星期二 升到 ★★，星期三 練習 賺 🪙 20 ➜ 22。現場任務 大螢幕 有 這一階 的 登場 特效。</p>
<h2>🏆 最認真練習（榮譽榜）</h2><p>這一週 <b>練習 時間 最多</b>，而且 這一週 到 現在 全部 題目 合起來 兩個 條件 都 做到：</p>
<ul><li><b>A 👀 不是 太快 亂按 ≧ ${D}%</b>：看完、聽完 才 選</li><li><b>B ✗➜✓ 答錯，改對 ≧ ${D}%</b>：答錯 的 題目，後來 同一題 又 答對（遊戲 的 ✨ 訂正 成功 也 算）；一題 都 沒錯 ＝ 100%</li></ul>
<p>例：200 題、太快 15 題 ＝ A 92% ✅；答錯 20 題、改對 18 題 ＝ B 90% ✅。沒有 做到 的 人 不上榜，下一名 補上。這一週 沒有 作答 題目（只 看 字卡）不上榜。</p>
<h2>👑 冠軍寶箱</h2><p>這一週 <b>全年級 最認真練習 前 5 名</b>（A、B 都 要 做到）。不到 的 人 不發，名額 給 下一名（一定 5 個 人，同分 一起）。<b>下一個 星期一 0:00 自動 發</b>，打開 戰神之路 就 拿到。</p>
<h2>⚡ 現場任務（上課）</h2><ul><li>老師 可以 開〔✖1.5〕或〔✖2〕：每一題 的 金幣、經驗值 變 1.5 倍 或 2 倍（例：答對 5 題 ➜ 🪙 5／8／10）</li>
<li><b>每一班 上一週 最認真練習 第 1 名</b>（A、B 都 做到；同 時間 比 正確率）可以 選 1 次 這一週 現場任務 的 遊戲；老師 決定 可以 選 哪幾種，學生 在 大螢幕 上 點，全班 都 看得到</li></ul>
<div class="box">✅ 孩子 第一次 打開 戰神之路，要 先 看完 規則 動畫、答對 5 題 小問題，老師 看得到 誰 已經 看懂。<br>有 任何 問題，請 直接 問 英語 老師。</div>
<div class="sig"><span>學生 班級 座號：</span><span>家長 簽名：</span></div></div></body></html>`;
  fs.writeFileSync(path.join(__dirname, 'rules.html'), page); console.log('rpg/rules.html ok'); }
