/* rpg/_build.js — 戰神之路（舊名 🦸 我的英雄；2026-10-18 第十次老師改名）（rpg/index.html）：選英雄、武器、寵物、外觀寶物、經驗值、金幣、商店、圖鑑（2026-10-17 老師看完 C9（第八次）；規格 rpg/CLAUDE.md）
 *   node rpg/_build.js
 * 規則（價錢、稀有度、等級、經驗值、金幣）全部在 score/_calc.js 的 rp…（伺服器、這一頁、量測同一份）；這一頁只負責畫。
 * 圖：rpg/chars/（男 b01～b30、女 g01～g31）、rpg/weapons/w01～w30、rpg/pets/p01～p30（切法 rpg/_crop.py）；🏪 商城 rpg/shop/s0101～（切法 rpg/_crop_shop.py；穿在身上 rpg/_wear_rt.js）。
 * 登入用成績系統同一個（score/_client.js 的 home()）；買東西、換裝都送伺服器（{a:'rpg'}），平板改不了金幣。 */
const fs = require('fs'), path = require('path');
const SC = require('../score/_calc.js'), CL = require('../score/_client.js');
const CAT = { R: SC.RPR, P: SC.RPP, L: SC.RPL, T: SC.RPT, SET: SC.RPSET, HIDE: SC.RPHIDE, X: SC.RPX, C: SC.RPC, S: SC.RPS, SON: SC.RPSON, SP: SC.RPSP, SL: SC.RPSL, LIM: SC.RPLIM, END: SC.RPEND, MON: SC.RPMON, TIER: SC.RPTIER, TIERC: SC.RPTIERC };
/* 🏪 上架的類：20 張商店卡＋20 張穿在身上的圖都要有 */
Object.keys(SC.RPSON).forEach(c => { for (let n = 1; n <= 20; n++) { const id = 's' + String(c).padStart(2, '0') + String(n).padStart(2, '0');
  ['.jpg', 'i.webp'].forEach(x => { if (!fs.existsSync(path.join(__dirname, 'shop', id + x))) throw new Error('rpg：商城少了圖 ' + id + x + '（python3 -I rpg/_crop_shop.py）'); }); } });
['h', 'w', 'p'].forEach(k => Object.keys(SC.RPR[k]).forEach(id => {
  const f = path.join(__dirname, k === 'h' ? 'chars' : k === 'w' ? 'weapons' : 'pets', id + '.jpg');
  if (!fs.existsSync(f)) throw new Error('rpg：少了圖 ' + f);
}));
/* 2026-10-20 第十五次：活起來（眨眼、呼吸、寵物撒嬌、揮武器）＋音效＋全部合體 ➜ rpg/life.js、rpg/life.css（GitHub Pages 不給 _ 開頭的檔，所以另外寫一份） */
const PSND = require('./_petsnd.js'), PSOK = {}, PSFB = { dog: 'dog', fox: 'fox', owl: 'owl', deer: 'deer', tiger: 'roar', lion: 'roar', leopard: 'roar', bear: 'roar', snake: 'hiss', bull: 'moo', wolf: 'howl', cat: 'meow', kitten: 'meow', panda: 'squeak', hawk: 'bird' };   /* 錄音檔 還沒有 ➜ 電腦 做 的 相近 叫聲 */
Object.keys(PSND).forEach(k => { const v = PSND[k]; PSOK[k] = v[0] !== 'syn' && !fs.existsSync(path.join(__dirname, 'snd', v[0] + '.mp3')) ? ['syn', PSFB[v[0]] || 'cute'] : v; });
const LIFEJS = 'window.RPEYES=' + fs.readFileSync(path.join(__dirname, '_eyes.json'), 'utf8').trim() + ';\nwindow.RPPETSND=' + JSON.stringify(PSOK) + ';\n' + fs.readFileSync(path.join(__dirname, '_life_rt.js'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'life.js'), LIFEJS); fs.writeFileSync(path.join(__dirname, 'life.css'), fs.readFileSync(path.join(__dirname, '_life.css'), 'utf8'));
const TREJPG = {}; SC.RPT.forEach(t => { if (fs.existsSync(path.join(__dirname, 'tre', t[0] + '.jpg'))) TREJPG[t[0]] = 1; else if (!fs.existsSync(path.join(__dirname, 'tre', t[0] + '.svg'))) throw new Error('rpg：少了寶物圖 ' + t[0] + '（node rpg/_tre_art.js）'); });
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
.chB{min-height:60px;padding:4px 22px;border-radius:999px;border:3px solid #FFD54A;background:linear-gradient(180deg,#5A26A0,#2A0E50);color:#FFE9A8;font-size:clamp(21px,2.7vh,27px);box-shadow:0 0 18px rgba(181,123,255,.6);animation:glow4 2.4s ease-in-out infinite}
.lim{display:block;font-size:18px;border-radius:999px;padding:1px 8px;margin-top:2px;background:#4A0A16;color:#FFC9D2;border:1px solid #FF5A6E}.lim.tm{background:#3A2A06;color:#FFE9A8;border-color:#FFB52E}.lim.out{background:#222;color:#999;border-color:#555}
.it.lmt{box-shadow:inset 0 3px 0 var(--rc,#34475C),0 0 0 2px #FF5A6E,0 0 18px rgba(255,90,110,.45)}.it.tmt{box-shadow:inset 0 3px 0 var(--rc,#34475C),0 0 0 2px #FFB52E,0 0 18px rgba(255,181,46,.45)}
.ltd{background:linear-gradient(135deg,rgba(80,10,24,.55),rgba(60,40,6,.5));border:1px solid rgba(255,138,61,.6);border-radius:20px;padding:10px 12px;margin:0 0 14px}
.ltd h3{margin:2px 4px 10px;font-size:clamp(22px,2.8vh,28px);color:#FFE9A8}
.monset{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(30%,120px),1fr));gap:8px;margin-top:8px}
.monset div{position:relative;border-radius:12px;overflow:hidden;border:2px solid #34475C;text-align:center;font-size:18px;background:#0A0F18}
.monset img{display:block;width:100%}.monset .no img{filter:brightness(0) opacity(.5)}.monset .now img{filter:grayscale(.55) brightness(.6) hue-rotate(250deg) saturate(1.6)}.monset .ok{border-color:#FFE07A;box-shadow:0 0 12px rgba(255,224,122,.6)}
/* 2026-10-20 第十五次：〔🌟 全部 合體 出招！〕、〔❓〕、寵物 陪伴 天數 點點 */
.stage{grid-template-rows:auto 1fr}.stage>.stat{grid-column:2;grid-row:1/span 2}.stage>.mfr{grid-column:1;grid-row:1;align-self:start}
@media (max-width:900px){.stage>.stat,.stage>.mfr,.stage>.cbgo{grid-column:1;grid-row:auto}}
.cbgo{grid-column:1;grid-row:2;align-self:start;justify-self:center;min-height:64px;padding:6px 34px;border-radius:999px;border:3px solid #FFD54A;background:linear-gradient(180deg,#7A3AB0,#2A0E50);color:#FFF3C4;font-size:clamp(22px,3vh,30px);box-shadow:0 0 22px rgba(255,213,74,.55),0 0 40px rgba(181,123,255,.5);animation:glow5 2.2s ease-in-out infinite}
.q1{min-width:48px;min-height:48px;margin-left:6px;border-radius:999px;border:2px solid #5AB0FF;background:rgba(20,40,70,.8);font-size:20px;vertical-align:middle}
.powT .sub .tbI{font-size:1.1em}
.pdots{display:flex;gap:8px;margin:6px 0 2px}.pdots i{width:clamp(22px,3vh,30px);height:clamp(22px,3vh,30px);border-radius:50%;border:2px solid #4A6A8A;background:#0B121D}.pdots i.on{background:radial-gradient(circle at 35% 35%,#BFF5FF,#3BA0FF);border-color:#7FD4FF;box-shadow:0 0 10px #5AB0FF}.pdots i.mk{outline:2px dashed #FFE07A;outline-offset:2px}
.mlab span:nth-child(2){color:#FFD9B8}
/* ❓ 秒懂 動畫（三章）的 分頁 */
.tch{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 10px}.tch button{min-height:56px;padding:4px 18px;border-radius:16px;background:var(--pn2);border:1px solid var(--bd);font-size:clamp(20px,2.5vh,24px)}.tch button.on{background:linear-gradient(180deg,#4A3A0C,#2A2006);color:#FFE9A8;box-shadow:inset 0 0 0 2px var(--gold)}
.tcrd{display:flex;gap:clamp(8px,1.6vw,18px);align-items:flex-end;justify-content:center}.tcrd>div{position:relative;width:clamp(70px,11vh,110px);text-align:center;opacity:0;animation:pop .45s ease-out forwards}
.tcrd img{width:100%;border-radius:12px;border:2px solid #5A6A80}.tcrd b{display:block;font-size:clamp(18px,2.4vh,24px);color:#FFE07A}.tcrd .pl{position:absolute;left:50%;top:-14px;transform:translateX(-50%);font-size:clamp(18px,2.4vh,24px);color:#FFB3B3;white-space:nowrap}
.tbig{font-size:clamp(52px,9vh,96px);line-height:1;color:#FFB3B3;text-shadow:0 0 20px rgba(255,90,90,.7)}.tbig small{display:block;font-size:.32em;color:#E8EEF7;margin-top:.45em;line-height:1.3}
.trow{display:flex;align-items:center;gap:12px;width:min(92%,640px);margin:6px 0;font-size:clamp(20px,2.8vh,28px)}.trow .mbar{flex:1;height:26px}.trow .mbar i{animation:drain var(--t,3s) steps(var(--n,8)) forwards;width:100%}
@keyframes drain{to{width:0}}
.ttier{display:flex;gap:clamp(6px,1.4vw,16px);font-size:clamp(28px,4.6vh,46px)}.ttier>span{display:flex;flex-direction:column;align-items:center;gap:4px;opacity:.35;transition:all .4s}.ttier>span.on{opacity:1;transform:scale(1.12)}.ttier small{font-size:clamp(16px,2vh,20px);color:#E8EEF7}
.tlb{width:min(90%,520px);display:flex;flex-direction:column;gap:6px}.tlb div{display:flex;gap:10px;align-items:center;background:rgba(0,0,0,.4);border:1px solid var(--bd);border-radius:12px;padding:4px 14px;font-size:clamp(20px,2.8vh,28px);opacity:0;animation:pop .4s ease-out forwards}
.tscale{font-size:clamp(60px,10vh,110px);animation:tilt 2s ease-in-out infinite}@keyframes tilt{50%{transform:rotate(6deg)}}
/* 對話框 */
#rpm{position:fixed;inset:0;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;z-index:50;padding:16px;backdrop-filter:blur(4px)}
#rpm.on{display:flex}
#rpm .box{background:linear-gradient(180deg,#121B2B,#0A0F18);border:2px solid var(--gold);border-radius:26px;padding:22px;max-width:560px;width:100%;text-align:center;font-size:clamp(24px,3vh,32px);position:relative;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.7)}
#rpm .box img{width:min(60%,240px);border-radius:14px}
#rpm .bt{display:flex;gap:12px;justify-content:center;margin-top:16px;flex-wrap:wrap}#rpm .bt button{min-height:64px;padding:6px 28px;border-radius:999px;font-size:clamp(24px,3vh,30px);border:2px solid}
#rpm .yes{background:#0F3323;border-color:var(--ok)}#rpm .no{background:#1B2633;border-color:#4A5A6C}
#rpm.cele .box img{animation:pop2 .8s cubic-bezier(.2,1.6,.4,1)}@keyframes pop2{from{transform:scale(.2) rotate(-20deg);opacity:0}}
</style>
<link rel="stylesheet" href="life.css">
<script src="life.js"></script>
</head><body>
${CL.home(0, '../', 'home')}
<main id="rp">
 <header class="cov"><img src="cover.webp" alt="戰神之路"><a class="home" id="rpHome" href="../index.html">🏠 回首頁</a><button class="sndB" id="sndB" style="position:absolute;z-index:2;right:14px;top:14px">🔊 音效 開</button><h1><span class="zs">戰神之路</span><small>練習 ➜ 升級 ➜ 變強</small></h1></header>
 <div id="rpout" hidden><div>🔑 先 登入 ➜ 才看得到 你的 戰士</div><button class="big" id="rpIn">🔑 登入</button><div class="note" style="margin-top:20px">⭐ 經驗值、🪙 金幣 都是 從 你的 練習 算出來的：練得 愈多、改對 愈多，戰士 就 愈強！</div></div>
 <div id="rpwait" hidden>⏳ 正在拿 你的 戰士…</div>
 <div id="rpin" hidden>
  <section class="stage" id="stage"></section>
  <nav class="tabs" id="tabs"><button data-t="h" class="on"><img class="tic" src="cover_icon.webp" alt="">戰士</button><button data-t="w">⚔ 武器</button><button data-t="p">🐾 寵物</button><button data-t="t">✨ 寶物</button><button data-t="m">🏪 榮耀 商城</button><button data-t="s">📖 圖鑑</button><button data-t="q">❓ 怎麼賺</button></nav>
  <section id="shop"></section>
 </div>
</main>
<div id="rpm"><div class="box" id="rpmb"></div></div>
<script>
var CAT=${JSON.stringify(CAT)};
var TREJPG=${JSON.stringify(TREJPG)};
var RV=null,TAB='h',SEX='b',LAST='',BUSY=false,SCAT=1;
var FMN={slash:'連斬',beam:'光砲',arrow:'箭雨',smash:'重擊',orb:'法球',nova:'爆發',claw:'利爪',pierce:'突刺'},CBP=false,PSN=0;
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
function nf(x){return (+x||0).toLocaleString()}
function dmgOf(pw){return 10+Math.min(20,Math.floor((+pw||0)/100))}   /* 跟 score/_calc.js rpDmg 一樣：基本 10 ＋ 戰力 ÷ 100，最多 30 */
var STOCK={},NOW0=Date.now(),PIA=0;
function rune(){var h='<svg viewBox="-100 -100 200 200" aria-hidden="true"><g fill="none" stroke="#FFE9A8" stroke-width="1.6"><circle r="94" stroke-dasharray="3 7"/><circle r="84"/><circle r="62" stroke-dasharray="14 6"/>';
  for(var i=0;i<7;i++){var a=i*3/7*Math.PI*2,b=(i+1)*3/7*Math.PI*2;h+='<line x1="'+(Math.cos(a)*62).toFixed(1)+'" y1="'+(Math.sin(a)*62).toFixed(1)+'" x2="'+(Math.cos(b)*62).toFixed(1)+'" y2="'+(Math.sin(b)*62).toFixed(1)+'"/>'}
  for(var k=0;k<12;k++){var c=k/12*Math.PI*2;h+='<rect x="'+(Math.cos(c)*89-3).toFixed(1)+'" y="'+(Math.sin(c)*89-3).toFixed(1)+'" width="6" height="6" transform="rotate(45 '+(Math.cos(c)*89).toFixed(1)+' '+(Math.sin(c)*89).toFixed(1)+')"/>'}
  return h+'</g></svg>'}
function ptHTML(c){var h='<div class="mfpt">';for(var i=0;i<16;i++)h+='<i style="left:'+(4+i*6)+'%;--c:'+c[i%c.length]+';--t:'+(5+(i*37%30)/10)+'s;--d:'+((i*53%60)/10)+'s;--x:'+((i%2?1:-1)*(10+i*3%30))+'px"></i>';return h+'</div>'}
function drawStage(){var V=RV,e=V.st.eq,T=e.t,ES=e.s||{},has=function(t){return T.indexOf(t)>=0},h='',hs=e.h?star(e.h):0;
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
  h+=e.p?'<div class="pc rw-host s'+V.petStage+'" id="pcard" style="--rc:'+RC[star(e.p)]+';width:100%">'+(has('t09')?'<div class="hat">🎩</div>':'')+rwPo('../',ES)+''+lw('<img src="'+img(e.p)+'" alt="我的寵物">',e.p)+'<span class="pst">'+['🐣 寶寶','🐥 長大了','🐲 進化了'][V.petStage]+'</span></div>':'<div class="empty">🐾<br>還沒有寵物</div>';
  h+='</div></div><div class="mfplate"><span class="idl rw-host'+(has('t05')?' gf':'')+'">'+rwNf('../',ES)+'🪪 '+SCID+'</span></div></div>'+(e.h?'<button class="cbgo" id="cbGo">🌟 全部 合體 出招！</button>':'');
  var pct=Math.max(0,Math.min(100,(V.xp-V.lvAt)/(V.lvNext-V.lvAt)*100)),d=V.hit||dmgOf(V.power),pd=V.petHit||0,M=V.mon||{i:0,m:'p16',hp:0,max:80};
  var pgo=e.p?(V.petStage>=2?'🐲 已經 進化':V.petStage===1?'再 練 '+Math.max(1,7-V.petDays)+' 天 ➜ 🐲 進化':'再 練 '+Math.max(1,3-V.petDays)+' 天 ➜ 🐥 長大'):'';
  /* 2026-10-20 第十五次 老師第 6、7 點（看不懂 戰力、一擊、怪物、寵物 那一塊）：一格 一件事、白話、每一格 都有〔❓〕秒懂動畫 */
  var tn=window.RPFX&&V.tier<5?RPFX.TN[V.tier+1]:'',tnext=V.tier<5?CAT.TIER[V.tier][0]-V.power:0,pdots='';for(var di=0;di<7;di++)pdots+='<i class="'+(di<V.petDays?'on':'')+(di===2||di===6?' mk':'')+'"></i>';
  h+='<div class="stat"><div class="idr"><button class="how1" data-go="qa">❓ 經驗值、金幣怎麼來</button><button class="how1" data-go="qc">❓ 收集 有 什麼 用</button>'+(V.ch?'<button class="chB" id="chOpen">👑 開 冠軍寶箱 ✕ '+V.ch+'</button>':'')+'</div>'+
    '<div class="tile"><div class="lab">⭐ 等級</div><div class="lv"><b>Lv '+V.lv+'</b><span>經驗值 '+nf(V.xp)+'</span></div><div class="bar"><i id="xpb" data-w="'+pct.toFixed(1)+'"></i></div><div class="sub">再 '+nf(V.lvNext-V.xp)+' ⭐ 升到 Lv '+(V.lv+1)+'</div></div>'+
    '<div class="row2"><div class="tile coinT"><div class="lab">🪙 金幣</div><b class="big2" id="coinN">'+nf(V.coins)+'</b><div class="sub">＝ 錢：換 裝備</div></div>'+
      '<div class="tile powT"><div class="lab">⚔ 戰力 <button class="q1" data-go="qb" aria-label="戰力 是 什麼">❓</button></div><b class="big2">'+nf(V.power)+'</b><div class="sub">'+(V.tier&&window.RPFX?RPFX.tb(V.tier,1)+'<br>':'')+(V.tier<5?'再 '+nf(tnext)+' ➜ '+tn:'🎉 最高 階級')+'</div></div></div>'+
    '<div class="tile atk"><div class="lab">💥 一擊：打 怪物、打 魔王 一下 扣 幾 ❤</div><div class="atkr"><b class="big2">'+d+(pd?'<small style="font-size:.5em;color:#BFF5FF"> ＋🐾 '+pd+'</small>':'')+'</b><div class="meter"><div class="mbar"><i style="width:'+((d-10)/20*100).toFixed(0)+'%"></i></div><div class="mlab"><span>10</span><span>⚔ 戰力 多 100 ➜ ＋1</span><span>30</span></div></div>'+
      (e.h?'<button class="go" id="atkTry">⚔ 出招！</button>':'')+'</div>'+(W?'<div class="sub">⚔ 你的 招式：'+RPFX.EL[W.e].nm+'．'+FMN[W.f]+(pd?'　🐾 寵物 跟著 打 ＋'+pd:'')+'</div>':'')+'</div>'+
    '<div class="tile mon"><img src="pets/'+M.m+'.jpg" alt="怪物"><div style="flex:1"><div class="lab">👾 下一隻 怪物（第 '+(M.i+1)+' 隻）：還有 ❤ '+(M.max-M.hp)+'</div><div class="mbar"><i style="width:'+((M.max-M.hp)/M.max*100).toFixed(0)+'%"></i></div>'+
      '<div class="sub">做完 一次 練習：答對 1 題 ＝ 打牠 1 下 💥</div></div></div>'+
    (e.p?'<div class="tile pett"><div class="lab">🐾 寵物 陪你 練了 '+V.petDays+' 天</div><div class="pdots">'+pdots+'</div><div class="sub">'+(V.petStage>=2?'🐲 已經 進化 了！':'3 天 ➜ 🐥 長大　7 天 ➜ 🐲 進化')+(V.petStage?'　<button class="how1" id="evoTry" style="min-height:44px">▶ 看 '+(V.petStage>=2?'進化':'長大')+'</button>':'')+'</div></div>':'')+
    (V.medal||V.titles.length||V.chests?'<div class="chips">'+(V.medal?'<span>🏅 勳章 ✕ '+V.medal+'</span>':'')+V.titles.map(function(t){return '<span>🏷 '+t+'</span>'}).join('')+(V.chests?'<span>🎁 保底 寶箱 ✕ '+V.chests+'</span>':'')+'</div>':'')+'</div>';
  st.innerHTML=h;if(window.RPLIFE)RPLIFE.mount(st);setTimeout(function(){var b=document.getElementById('xpb');if(b)b.style.width=b.getAttribute('data-w')+'%'},60)}
function lw(h,id){return window.RPLIFE?RPLIFE.wrap(h,id):h}
/* 🐾 戰士 和 寵物 的 互動（一直換：寵物 跳過去、寵物 幫 武器 充能、戰士 蓄力） */
function petIA(){if(!RV||document.hidden||typeof RPFX==='undefined')return;var m=document.getElementById('mfr'),p=document.getElementById('pcard'),hc=document.getElementById('hcard'),w=document.getElementById('wcard');if(!m||!hc)return;
  /* 2026-10-20 第十五次（老師第 1 點：寵物 對 戰士 的 孺慕之情、撒嬌依偎；戰士 和 寵物 親密 的 互動）：四種 輪流 */
  var e=RV.st.eq,k=(PIA++)%4,pe=e.p?RPFX.pEl(e.p):'light',we=e.w?RPFX.wInfo(e.w).e:'light',L=window.RPLIFE;
  if(k===0&&p&&L){var snd=Date.now()-PSN>25000;if(snd)PSN=Date.now();L.nuzzle(m,hc,p,{snd:snd,pid:e.p,base:''})}
  else if(k===1&&p&&w){RPFX.beam(m,RPFX.pos(m,p),RPFX.pos(m,w),pe);if(L)L.happy(L.lfo(p),900);setTimeout(function(){w.classList.remove('wpw');void w.offsetWidth;w.classList.add('wpw')},250)}
  else if(k===2){hc.classList.remove('hpw');void hc.offsetWidth;hc.classList.add('hpw');if(L)L.glint(L.lfo(hc),RPFX.EL[we].c[1]);var a=RPFX.pos(m,hc,.5,.5);RPFX.spark(m,a.x,a.y,we,26)}
  else if(p){p.classList.remove('pj');void p.offsetWidth;p.classList.add('pj');if(L){L.blink(L.lfo(p),1);var r=RPFX.pos(m,p,.5,.2);L.hearts(m,r.x,r.y,4)}}}
setInterval(petIA,6500);
/* ⚔ 出招：照 你的 武器（元素、招式、星等）、寵物、5 碼 ➜ 每一個人 不一樣；每一次 也 不一樣。靶 ＝ 現在 那一隻 怪物 的 練功幻影（不會 真的 扣血） */
function atk(){var m=document.getElementById('mfr'),hc=document.getElementById('hcard');if(!m||!hc||!RV||!RV.st.eq.h||typeof RPFX==='undefined')return;var e=RV.st.eq,M=RV.mon||{m:'p16'};
  var old=m.querySelector('.fxmon');if(old)old.parentNode.removeChild(old);
  var mon=document.createElement('div');mon.className='fxmon holo';mon.innerHTML='<div class="fxmi"><img src="pets/'+M.m+'.jpg" alt="練功幻影"></div><div class="fxmn" style="font-size:clamp(18px,2.2vh,22px)">🎯 練功 幻影</div>';m.appendChild(mon);
  var p=document.getElementById('pcard'),a=RPFX.attack(m,{from:RPFX.pos(m,hc,.6,.4),to:RPFX.pos(m,mon.querySelector('.fxmi')),w:e.w,id:SCID,p:e.p,pImg:e.p?img(e.p):'',pFrom:p?RPFX.pos(m,p):null,dmg:RV.hit||dmgOf(RV.power),pd:RV.petHit||0,hero:hc,shk:document.getElementById('stage'),
    hook:function(x){if(window.RPSND)RPSND.atk(x);if(window.RPLIFE)setTimeout(function(){RPLIFE.swing(hc,document.getElementById('wcard'),RPFX.EL[x.e].c[1],900)},Math.max(0,x.ch-260))},
    onHit:function(){mon.classList.remove('hit');void mon.offsetWidth;mon.classList.add('hit')}});
  var fx=(e.s||{}).fx;if(fx)setTimeout(function(){rwFx('../',fx)},a.hit+100);
  setTimeout(function(){if(mon.parentNode)mon.parentNode.removeChild(mon)},a.ms+300)}
/* 🌟 全部 合體 出招（老師 C17 第 3、4 點）：戰士 ➜ 光環、翅膀、披風、坐騎 一樣一樣 上身 ➜ 寵物 ➜ 武器 覺醒 ➜ 合體 必殺 ➜ 合體 威力（＝ 戰力） */
function cbAuto(){if(!window.__NOCB)comboGo()}   /* 量測 的 時候 可以 關掉 自動 演（rpg/_verify.js 另外 量 一次） */
function comboGo(){if(!RV||!RV.st.eq.h||!window.RPLIFE)return;var e=RV.st.eq,ES=e.s||{},si=function(x){return x?'shop/'+x+'i.webp':''};
  RPLIFE.combo({base:'',h:img(e.h),hid:e.h,w:e.w?img(e.w):'',wid:e.w,p:e.p?img(e.p):'',pid:e.p,au:si(ES.au),cp:si(ES.cp),wg:si(ES.wg),mt:si(ES.mt),bg:ES.bg?'shop/'+ES.bg+'i.webp':'',
    power:RV.power,tier:RV.tier,star:Math.max(star(e.h),e.w?star(e.w):1,e.p?star(e.p):1),id:SCID})}
function sndLab(){var b=document.getElementById('sndB');if(!b||!window.RPSND)return;var o=RPSND.on();b.textContent=o?'🔊 音效 開':'🔇 音效 關';b.classList.toggle('off',!o)}
function fwHTML(){var h='<div class="fw">',C=['#FFD54A','#FF6B6B','#7FD4FF','#7BF0A8','#D9A8FF'];for(var i=0;i<24;i++){var a=i/24*Math.PI*2,r=90+Math.random()*60;h+='<i style="--c:'+C[i%5]+';--x:'+Math.round(Math.cos(a)*r)+'px;--y:'+Math.round(Math.sin(a)*r)+'px;animation-delay:'+(i%3*.15)+'s"></i>'}return h+'</div>'}
/* ── 商店 ── */
function itemHTML(id){var k=kOf(id),s=star(id),o=own(id),eq=isEq(id),fr=!o&&freeOk(id),lk=!o&&RV.lv<need(id),pr=price(id),poor=!o&&!fr&&RV.coins<pr;
  var tag=eq?'<div class="pr eq">✅ 裝備中</div>':o?'<div class="pr ok">👆 點一下 裝上</div>':fr?'<div class="pr fr">🎁 免費</div>':lk?'<div class="pr lock">🔒 Lv '+need(id)+'</div>':'<div class="pr'+(poor?' lock':'')+'">🪙 '+pr+'</div>';
  if(k==='s'&&eq)tag='<div class="pr eq">✅ 裝備中<br><small>再點 ＝ 拿下來</small></div>';else if(k==='s'&&o)tag='<div class="pr ok">👆 點一下 裝備</div>';
  /* 🏷 限量（全部學生一共 5 個，剩幾個 ＝ 伺服器數的）、⏳ 限時（10 月 31 號 下架）（2026-10-20 第十四次） */
  var lt='',lc='';if(CAT.LIM[id]){var left=STOCK[id];lc=' lmt';if(!o&&left===0){lt='<span class="lim out">已 換完</span>';tag='';poor=true}else lt='<span class="lim">🏷 限量 5 個．剩 '+(left==null?'?':left)+' 個</span>'}
  if(CAT.END[id]){lc=' tmt';if(!o&&nowS()>=CAT.END[id]){lt='<span class="lim out">已 下架</span>';tag='';poor=true}else lt='<span class="lim tm">⏳ 10 月 31 號 下架</span>'}
  if(k==='w'&&typeof RPFX!=='undefined'){var wi=RPFX.wInfo(id);lt='<span class="wel">'+RPFX.EL[wi.e].nm+'．'+{slash:'連斬',beam:'光砲',arrow:'箭雨',smash:'重擊',orb:'法球',nova:'爆發',claw:'利爪',pierce:'突刺'}[wi.f]+'</span>'+lt}
  if(k==='t'){var t=tre(id);return '<button class="it'+(eq?' eqd':'')+'" data-id="'+id+'"><img src="'+treImg(id)+'" alt="'+t[1]+'"><div class="trn">'+t[1].split(' ').slice(1).join(' ')+'</div>'+tag+'</button>'}
  return '<button class="it'+(eq?' eqd':'')+(lk||poor?' dim':'')+lc+'" data-id="'+id+'" style="--rc:'+RC[s]+'"><img loading="lazy" src="'+img(id)+'" alt="'+id+'"><div class="st">'+stars(s)+' '+RN[s]+'</div>'+lt+tag+'</button>'}
function nowS(){return Date.now()+(RV&&RV.dt||0)}
function ids(k){var a=Object.keys(CAT.R[k]).filter(function(id){return !CAT.HIDE[id]&&(k!=='h'||id.charAt(0)===SEX)});
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
function tutScenes(){var V=RV||{power:0,tier:0,hit:10,petHit:0,lv:1},e=V.st?V.st.eq:{},hi=e.h?img(e.h):'chars/b01.jpg',wi=e.w?img(e.w):'weapons/w03.jpg',pi=e.p?img(e.p):'pets/p03.jpg',
    pw=V.power||0,tb=function(n,b){return window.RPFX?RPFX.tb(n,b):''},hs=e.h?star(e.h):1,ws=e.w?star(e.w):1,ps=e.p?star(e.p):1;
  return {
  a:[['📝 做完 一次 練習 ➜ <span class="xp">⭐ 經驗值 ＋10</span>','<div class="tcard"><b>📝 練習</b><i>✅ 第 1 題</i><i>✅ 第 2 題</i><i>🎉 做完了！</i></div><div class="tbar"><div class="bar"><i style="--a:30%;--b:80%"></i></div><div class="lab">⭐ 經驗值</div></div><span class="fly" style="--x0:30%;--y0:46%;--dx:clamp(120px,24vw,320px)">⭐ ＋10</span>',function(){tsp(.3,.5,'star');tsnd(1700,'ding',0)}],
     ['📅 每一天 第一次 練 ➜ <span class="xp">⭐ 再 ＋20</span>（天天 練 最 划算）','<div class="tchips"><span>📅 星期一 ✅　⭐ ＋20</span><span>📅 星期二 ✅　⭐ ＋20</span><span>📅 星期三 ✅　⭐ ＋20</span></div><div class="tcoin" style="color:#9FD8FF">⭐ <b class="tcn">0</b></div>',function(){tcount([[600,20],[1300,40],[2000,60]]);tsnd(600,'ding',1);tsnd(1300,'ding',2);tsnd(2000,'ding',3)}],
     ['答對、改對、進步 ➜ <b>🪙 金幣</b>（改對 最多！）','<div class="tchips"><span>✅ 答對 1 題　🪙 ＋1</span><span>✗➜✓ 改對 1 題　🪙 ＋3</span><span>⬆ 比 上一次 進步　🪙 ＋10</span></div><div class="tcoin">🪙 <b class="tcn">0</b></div>',function(){tcount([[600,1],[1300,4],[2000,14]]);[600,1300,2000].forEach(function(t,i){tsnd(t,'coin',i)})}],
     ['⚡ 現場任務：老師 開〔✖1.5〕➜ 🪙、⭐ 都 ✖1.5','<div class="tchips"><span>答對 5 題：🪙 5、⭐ 10</span><span style="border-color:#FFD54A;color:#FFE9A8">✖1.5 ➜ 🪙 8、⭐ 15</span></div><div class="tcoin">🪙 <b class="tcn">5</b></div>',function(){tcount([[1500,6],[1700,7],[1900,8]]);tsp(.7,.5,'thunder');tsnd(1500,'coin',0);tsnd(1900,'coin',1)}],
     ['⭐ 存滿 ➜ <b>升級 🔓</b>；🪙 ＝ 錢 ➜ <b>換 裝備</b>','<div class="lvup">🎉 Lv 4 ➜ Lv 5</div><div class="tlock"><img src="shop/s0106.jpg" alt=""><span class="l1">🔒</span><span class="l2">🔓</span></div><div class="thero"><img class="on2" src="shop/s0202i.webp" alt=""><img src="'+hi+'" alt=""></div>',function(){tsnd(1300,'ding',4);tsnd(2300,'ding',5)}]],
  b:[['⚔ 戰力 ＝ 你 全身 的 裝備 加 起來','<div class="tcrd"><div style="animation-delay:.2s"><span class="pl">★ ✕ 100</span><img src="'+hi+'" alt=""><b>戰士 '+stars(hs)+'</b></div><div style="animation-delay:.6s"><span class="pl">★ ✕ 100</span><img src="'+wi+'" alt=""><b>武器 '+stars(ws)+'</b></div><div style="animation-delay:1s"><span class="pl">★ ✕ 100</span><img src="'+pi+'" alt=""><b>寵物 '+stars(ps)+'</b></div></div><div class="tbig">⚔ <b class="tcn">0</b><small>＋ 等級、寶物、寵物 長大</small></div>',function(){var n=pw||320;tcount([[1400,Math.round(n*.3)],[1700,Math.round(n*.6)],[2000,Math.round(n*.85)],[2300,n]]);tsnd(300,'ding',0);tsnd(700,'ding',1);tsnd(1100,'ding',2);tsp(.5,.7,'light')}],
     ['⚔ 戰力 愈高 ➜ 💥 一擊 愈痛','<div style="text-align:center"><div class="tbig" style="color:#fff">💥 <b class="tcn">10</b><small>戰力 每 多 100 ➜ 一擊 ＋1（最多 30）</small></div><div class="tbar" style="margin:10px auto 0"><div class="bar"><i style="--a:0%;--b:'+Math.min(100,(V.hit-10)/20*100).toFixed(0)+'%;--d:.6s;background:linear-gradient(90deg,#FF7A3D,#FFD54A)"></i></div><div class="lab">10 ➜ 30</div></div></div>',function(){tcount([[700,Math.round(10+(V.hit-10)*.4)],[1100,Math.round(10+(V.hit-10)*.8)],[1500,V.hit]]);tatk(1700)}],
     ['💥 一擊 愈痛 ➜ 👾 怪物 倒 得 愈快','<div style="width:100%;display:flex;flex-direction:column;align-items:center"><div class="trow"><span>💥 10</span><div class="mbar" style="--t:4s;--n:8"><i></i></div><span>8 下</span></div><div class="trow"><span>💥 27</span><div class="mbar" style="--t:1.5s;--n:3"><i></i></div><span>3 下 🎉</span></div><div class="cap" style="font-size:clamp(20px,2.8vh,28px);animation-delay:2s">怪物 ❤ 80：一擊 10 要 打 8 下、一擊 27 只要 3 下</div></div>',function(){[0,500,1000].forEach(function(t,i){tsnd(t+200,'hit',i)})}],
     ['⚔ 戰力 到了 ➜ 🛡 升 階級 ＋ 🪙 100','<div style="text-align:center"><div class="ttier">'+[1,2,3,4,5].map(function(n){return '<span id="tt'+n+'">'+tb(n)+'<small>'+CAT.TIER[n-1][0]+'</small></span>'}).join('')+'</div><div class="cap" style="font-size:clamp(22px,3vh,30px);animation-delay:1.6s">'+(V.tier?'你 現在：'+tb(V.tier,1):'你 還沒有 階級')+(V.tier<5?'　再 '+nf(CAT.TIER[V.tier][0]-pw)+' ⚔ ➜ 下一階 🪙＋'+CAT.TIERC:'')+'</div><div class="note" style="margin-top:8px">每 升 一階 🪙＋'+CAT.TIERC+' 一次；徽章 排行榜、現場任務 全班 都 看得到</div></div>',function(){[1,2,3,4,5].forEach(function(n){TUT.cn.push(setTimeout(function(){var x=document.getElementById('tt'+n);if(x)x.classList.add('on');tsnd(0,'ding',n)},300+n*260))})}]],
  c:[['👾 做完 練習 打怪：裝備 愈強 ➜ 打倒 愈快 ➜ 收進 📖 圖鑑','<div class="tcrd"><div style="animation-delay:.2s"><img src="'+hi+'" alt=""><b>⚔</b></div><div style="animation-delay:.8s;width:clamp(90px,14vh,140px)"><img src="pets/p24.jpg" alt="" style="filter:grayscale(.6) brightness(.6) hue-rotate(250deg)"><b>👾 ➜ ✨ 淨化</b></div></div>',function(){tatk(800);tsp(.7,.4,'light')}],
     ['⚡ 現場任務 全班 打 魔王：你的 一擊 愈痛 ➜ 全班 愈快 贏','<div class="tlb" style="max-width:520px"><div style="animation-delay:.3s">👑 魔王 ❤ <span class="mbar" style="flex:1;--t:3s;--n:10;display:block"><i style="animation:drain 3s steps(10) forwards .6s;width:100%"></i></span></div><div style="animation-delay:.8s;white-space:nowrap">💥 ＋12　💥 ＋27　💥 ＋15　💥 ＋20 …</div></div>',function(){[700,1100,1500,1900].forEach(function(t,i){tsnd(t,'hit',i)})}],
     ['🐾 寵物 跟著 打（＋3、＋5、＋8）＋ 🛡 寵物 護盾','<div class="tcrd"><div style="animation-delay:.2s;width:clamp(90px,14vh,140px)"><img src="'+pi+'" alt=""><b>🐾 ＋3 ➜ 🐥 ＋5 ➜ 🐲 ＋8</b></div></div><div class="tchips"><span>🛡 現場任務 一場 一次：答錯 1 題 🔥 連對 不會 斷</span></div>',function(){tsnd(500,'pet',0)}],
     ['🛡 階級 徽章 ＝ 全班 都 看得到','<div class="tlb">'+[[1,'30412',5],[2,'30405',3],[3,'30401',1]].map(function(x,i){return '<div style="animation-delay:'+(.3+i*.4)+'s"><b>'+x[0]+'</b> '+x[1]+' '+tb(x[2],1)+'</div>'}).join('')+'</div>',function(){[300,700,1100].forEach(function(t,i){tsnd(t,'ding',i)})}],
     ['🎯 分數 只 看 你的 答題：裝備 不加 分數（公平！）','<div class="tscale">⚖️</div><div class="tchips"><span>🎯 正確率、分數 ＝ 你 自己 答 的</span><span>⚔ 裝備 ＝ 打怪 更 帥、更 快</span></div>',function(){}]]
  }}
function tsp(x,y,e){if(typeof RPFX==='undefined')return;var t=document.getElementById('tst');if(!t)return;TUT.cn.push(setTimeout(function(){var r=t.getBoundingClientRect();RPFX.spark(t,r.width*x,r.height*y,e,30)},1500))}
function tsnd(ms,k,i){if(!window.RPSND)return;TUT.cn.push(setTimeout(function(){if(TAB!=='q')return;if(k==='ding')RPSND.ding(i);else if(k==='coin')RPSND.coin(0);else if(k==='hit')RPSND.hit(2);else if(k==='pet'&&RV&&RV.st.eq.p)RPSND.pet(RV.st.eq.p,'')},ms))}
function tcount(L){L.forEach(function(x){TUT.cn.push(setTimeout(function(){var c=document.querySelector('#tst .tsc.on .tcn');if(c)c.textContent=nf(x[1])},x[0]))})}
function tatk(ms){if(typeof RPFX==='undefined')return;TUT.cn.push(setTimeout(function(){var t=document.getElementById('tst');if(!t)return;var r=t.getBoundingClientRect(),e=RV&&RV.st.eq;
  RPFX.attack(t,{from:{x:r.width*.3,y:r.height*.55},to:{x:r.width*.72,y:r.height*.5},w:e&&e.w,id:SCID,dmg:RV?RV.hit:10,quick:true,name:false,hook:function(x){if(window.RPSND)RPSND.atk(x)}})},ms))}
function tutHTML(){var S=tutScenes()[TCH]||[];
  return '<div class="tut"><div class="tch">'+[['a','⭐🪙 經驗值、金幣怎麼來'],['b','⚔ 戰力 是 什麼'],['c','🎁 收集 有 什麼 用']].map(function(x){return '<button data-tch="'+x[0]+'" class="'+(TCH===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div>'+
    '<div class="tst" id="tst">'+S.map(function(x){return '<div class="tsc"><div class="cap">'+x[0]+'</div><div class="vis">'+x[1]+'</div></div>'}).join('')+'</div>'+
    '<div class="tnav">'+S.map(function(x,i){return '<button data-tut="'+i+'">'+(i+1)+'</button>'}).join('')+'<button class="re" data-tut="0">▶ 再看 一次</button></div></div>'}
function tutStop(){clearTimeout(TUT.tm);TUT.cn.forEach(clearTimeout);TUT.cn=[]}
function tutGo(i){tutStop();var L=document.querySelectorAll('#tst .tsc');if(!L[i])return;
  [].forEach.call(L,function(x){x.classList.remove('on')});void L[i].offsetWidth;L[i].classList.add('on');
  [].forEach.call(document.querySelectorAll('.tnav [data-tut]'),function(b,k){b.classList.toggle('on',k===i)});
  var F=(tutScenes()[TCH]||[])[i];if(F&&F[2])F[2]();
  if(i<L.length-1)TUT.tm=setTimeout(function(){tutGo(i+1)},4800)}
function drawShop(){var S=document.getElementById('shop'),h='';
  if(TAB==='h'||TAB==='w'||TAB==='p'){var k=TAB,nm={h:'戰士',w:'武器',p:'寵物'}[k];
    if(!RV.st.own[k].length&&!RV.st.free[k])h+='<div class="free">🎁 第一個 '+nm+' 免費：選 1 個 ★ 基本 的 '+nm+'！之後 用 🪙 金幣 換 更酷 的。</div>';
    if(k==='h')h+='<div class="sub2"><button data-sex="b" class="'+(SEX==='b'?'on':'')+'">👦 男生 戰士</button><button data-sex="g" class="'+(SEX==='g'?'on':'')+'">👧 女生 戰士</button></div>';
    h+='<div class="rar">'+[1,2,3,4,5].map(function(s){return '<span style="color:'+RC[s]+';border-color:'+RC[s]+'">'+stars(s)+' '+RN[s]+' 🪙 '+nf(CAT.P[s])+(CAT.L[s]>1?'（Lv '+CAT.L[s]+'）':'')+'</span>'}).join('')+'</div>';
    h+='<div class="grid">'+ids(k).map(itemHTML).join('')+'</div>'}
  else if(TAB==='m')h+=shopHTML();
  else if(TAB==='t')h+='<div class="note" style="margin-bottom:8px">✨ 寶物 只換 外觀（不加分數）。買了 會 自動 戴上；再 點一下 ＝ 拿下來／戴上。</div><div class="grid">'+CAT.T.map(function(t){return itemHTML(t[0])}).join('')+'</div>';
  else if(TAB==='s'){var all=RV.st.own.h.concat(RV.st.own.w,RV.st.own.p),MI=(RV.mon||{i:0}).i;
    /* 👾 怪物圖鑑：打倒 ＝ 淨化（彩色）、現在 這一隻（暗的）、還沒 遇到（影子） */
    h+='<div class="note">👾 怪物圖鑑：打倒 ＝ 淨化 ✨（已經 打倒 '+MI+' 隻）</div><div class="monset">'+CAT.MON.map(function(m,i){var ok=MI>i||MI>=CAT.MON.length,now=!ok&&MI%CAT.MON.length===i;
      return '<div class="'+(ok?'ok':now?'now':'no')+'"><img src="pets/'+m+'.jpg" alt="">'+(ok?'✨ 淨化':now?'⚔ 現在':'？')+'</div>'}).join('')+'</div><br>';
    h+='<div class="note">📖 集滿 一套 ＝ 拿到 稱號（亮起來）：</div>'+CAT.SET.map(function(x){var ok=x[1].every(function(id){return all.indexOf(id)>=0});
      return '<div class="set'+(ok?' ok':'')+'"><b style="min-width:8em">'+(ok?'✅ ':'')+x[0]+'</b>'+x[1].map(function(id){return '<img src="'+img(id)+'" class="'+(all.indexOf(id)>=0?'':'no')+'" alt="'+id+'">'}).join('')+'</div>'}).join('')}
  else h+=tutHTML()+'<div class="how"><table><tr><th style="width:34%">怎麼 拿</th><th>拿到 多少</th></tr>'+
    '<tr><td>📝 做完 一次 題目、遊戲（練習次數 ＋1）</td><td>⭐ 經驗值 ＋'+CAT.X.rec+'</td></tr><tr><td>🎧 聽完 一站 字卡</td><td>⭐ 經驗值 ＋'+CAT.X.rec+'</td></tr><tr><td>📅 那一天 第一次 練</td><td>⭐ 經驗值 ＋'+CAT.X.day+'（天天練 最划算）</td></tr>'+
    '<tr><td>✅ 第一次 就 答對 1 題</td><td>🪙 金幣 ＋1</td></tr><tr><td>✗➜✓ 答錯 以後 改對 1 題</td><td>🪙 金幣 ＋'+CAT.C.fix+'（改錯 最多 金幣！）</td></tr><tr><td>⬆ 同一組 比 自己 上一次 進步</td><td>🪙 金幣 ＋'+CAT.C.prog+'</td></tr>'+
    '<tr><td>🎁 這一週 練了 '+CAT.C.chestDays+' 天 以上</td><td>保底 寶箱 🪙 ＋'+CAT.C.chest+'（每一個 肯練 的 人 都 拿得到）</td></tr>'+
    '<tr><td>⚠️ 太快 亂按</td><td>那一次 沒有 金幣</td></tr><tr><td>🪙 一天 最多</td><td>'+CAT.C.cap+' 金幣（練 太久 不會 一直 賺）</td></tr>'+
    '<tr><td>🏪 榮耀 商城</td><td>第 1 排 🪙 500、第 2 排 1,200（Lv 5）、第 3 排 2,500（Lv 10）、第 4 排 5,000（Lv 20）</td></tr>'+
    '<tr><td>🚫 不可以</td><td>交易、搶 別人 的、抽獎；<b>買到的東西不加分數、不會讓題目變簡單</b></td></tr></table>'+
    '<p class="note">⭐ 經驗值 只會 升，不會 被 花掉；等級 夠 才 換得到 ★★★ 以上。🐾 寵物 陪你 練 3 天 長大、7 天 進化。</p></div>';
  S.innerHTML=h;if(TAB==='q')tutGo(0);else tutStop()}
function draw(){drawStage();drawShop()}
/* ── 伺服器 ── */
function load(){if(!SCON){hide('rpin');hide('rpwait');show('rpout');return}
  if(!SCID||!scAsked()){RV=null;hide('rpin');hide('rpwait');show('rpout');return}
  hide('rpout');if(!RV)show('rpwait');var id=SCID;
  scFetch('a=rpg&id='+id,null,9000).then(function(j){if(id!==SCID)return;hide('rpwait');if(j&&j.ok){RV=j.v;RV.dt=(j.now||Date.now())-Date.now();if(j.stock)STOCK=j.stock;show('rpin');draw();seen()}else msg('📶 拿不到 你的 戰士，等一下 再 試',1)},function(){hide('rpwait');msg('📶 現在 沒有 網路，等一下 再 試',1)})}
function msg(t,x){var m=document.getElementById('rpm');m.className='on';document.getElementById('rpmb').innerHTML='<div>'+t+'</div><div class="bt"><button class="no" data-m="x">👌 知道了</button></div>'}
function ask(id){var k=kOf(id),fr=freeOk(id),pr=fr?0:price(id),t=k==='t'?tre(id)[1]:'';
  if(CAT.LIM[id]&&STOCK[id]===0){msg('🏷 已經 換完 了<br><span class="note">全部 學生 一共 只有 5 個</span>');return}
  if(CAT.END[id]&&nowS()>=CAT.END[id]){msg('⏳ 已經 下架 了（10 月 31 號）');return}
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
    else msg(j&&j.err==='coin'?'🪙 金幣 不夠':j&&j.err==='lv'?'🔒 等級 不夠':j&&j.err==='sold'?'🏷 已經 換完 了（全部 只有 5 個）':j&&j.err==='end'?'⏳ 已經 下架 了':j&&j.err==='none'?'👑 沒有 寶箱 了':'❌ 沒有 換成（'+((j&&j.err)||'')+'）')},
   function(){BUSY=false;msg('📶 現在 沒有 網路，沒有 換')})}
/* 戰士、武器、寵物 換到 或 裝上 ➜ 震撼 登場（魔法陣、光柱、閃電、卡片 轉出來、星星 一顆一顆 亮） */
function summonOf(id,isNew){var k=kOf(id),s=star(id),nm={h:'戰士',w:'武器',p:'寵物'}[k],W=k==='w'?RPFX.wInfo(id):null;if(window.RPSND)RPSND.summon(s);
  RPFX.summon({img:img(id),star:s,kind:k,w:id,title:(isNew?'🎉 ':'⚔ ')+'你的 '+nm+' 登場！',sub:k==='w'?RPFX.EL[W.e].nm+'．'+stars(s)+'　⚔ 出招 打怪 愈強 愈猛':k==='p'?'🐾 陪你 練習：3 天 長大、7 天 進化，跟你 一起 打怪':stars(s)+' '+RN[s]+'　'+(s>=4?'傳說 降臨！':'準備 出發！'),
    done:function(){if(CBP){CBP=false;setTimeout(cbAuto,250)}else if(k==='w'&&RV&&RV.st.eq.h)setTimeout(atk,200);if(k==='p'&&window.RPSND)RPSND.pet(id,'')}})}
/* 寵物 長大／進化：上一次 看到 的 階段 記在 這台 平板（換一隻 寵物 重來） */
function seen(){if(!RV||!SCID)return;var e=RV.st.eq,K='rp_seen_'+SCID,o={};try{o=JSON.parse(localStorage.getItem(K)||'{}')||{}}catch(x){}
  if(e.p&&typeof RPFX!=='undefined'){if(o.p===e.p&&(o.ps||0)<RV.petStage)setTimeout(function(){if(window.RPSND)RPSND.evolve();RPFX.evolve({img:img(e.p),w:e.p,to:RV.petStage})},700);o.p=e.p;o.ps=RV.petStage}
  /* 金幣 比 上一次 多 ➜ 金幣 飛進去 */
  if(o.c!=null&&RV.coins>o.c&&typeof RPFX!=='undefined'){var add=RV.coins-o.c,c0=o.c;setTimeout(function(){var to=document.getElementById('coinN'),fr=document.querySelector('.cov');if(to)RPFX.coins(fr,to,add,function(v){to.textContent=nf(c0+v);if(window.RPSND&&v%3===1)RPSND.coin(0)},0)},900)}
  o.c=RV.coins;try{localStorage.setItem(K,JSON.stringify(o))}catch(x){}}
/* 👑 冠軍 寶箱 打開 */
function chestShow(r){var h=r&&r.s?'<img src="'+img(r.s)+'" alt="">🎉 '+CAT.S[sOf(r.s).c-1][1]+'（已經 戴上）':'🪙 ＋'+((r&&r.c)||0)+' 金幣';
  if(window.RPSND)RPSND.chest();if(typeof RPFX!=='undefined')RPFX.chest({html:h});else msg('👑 '+h)}
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
  if(c('#evoTry')&&RV&&RV.st.eq.p&&typeof RPFX!=='undefined'){if(window.RPSND)RPSND.evolve();RPFX.evolve({img:img(RV.st.eq.p),w:RV.st.eq.p,to:RV.petStage});return}
  if((b=c('[data-tut]'))){tutGo(+b.getAttribute('data-tut'));return}
  if((b=c('[data-tch]'))){TCH=b.getAttribute('data-tch');drawShop();return}
  if((b=c('[data-go^="q"]'))){TCH=(b.getAttribute('data-go').charAt(1)||'a');var q=document.querySelector('#tabs [data-t="q"]');if(q)q.click();setTimeout(function(){var u=document.querySelector('.tut');if(u)u.scrollIntoView({behavior:'smooth',block:'start'})},50);return}
  if((b=c('#shop [data-id]'))){var id=b.getAttribute('data-id');if(own(id)){if(kOf(id)==='t'||kOf(id)==='s'||!isEq(id))act('eq',id)}else ask(id);return}
  if((b=c('[data-m]'))){var w=b.getAttribute('data-m');if(w==='buy')act('buy',b.getAttribute('data-id'));else{document.getElementById('rpm').className='';if(CBP){CBP=false;setTimeout(cbAuto,200)}}return}
  if(c('#cbGo')){comboGo();return}
  if(c('#sndB')){if(window.RPSND)RPSND.set(!RPSND.on());sndLab();return}
  if(c('#pcard')&&RV&&RV.st.eq.p&&window.RPLIFE){var m0=document.getElementById('mfr');RPLIFE.nuzzle(m0,document.getElementById('hcard'),document.getElementById('pcard'),{snd:true,pid:RV.st.eq.p,base:''});return}
  if(c('#hcard')&&RV&&RV.st.eq.h){atk();return}
  if(t.id==='rpm')document.getElementById('rpm').className='';
});
/* 🏠 回首頁（2026-10-20 第十四次 老師：三年級 ➜ 三年級在家複習、四年級 ➜ 四年級在家複習，不可以回到老師的總首頁）：
   登入了 ＝ 照 5 碼 的 第一碼；還沒登入 ＝ 從哪一個 在家複習 來 就 回 哪裡；都 不是 ＝ 總首頁 */
function homeHref(){var g=SCID?String(SCID).charAt(0):'',r=document.referrer||'';if(!g){var m=/(g[34])-review/.exec(r);if(m)g=m[1].charAt(1)}
  return g==='3'?'../g3-review/index.html':g==='4'?'../g4-review/index.html':'../index.html'}
function homeFix(){var a=document.getElementById('rpHome');if(a)a.setAttribute('href',homeHref())}
homeFix();
/* 登入、登出、換人：每 0.8 秒看一次 */
setInterval(function(){var k=(SCID||'')+'|'+(SCID&&scAsked()?1:0);if(k!==LAST){LAST=k;RV=null;homeFix();load()}},800);
</script>
</body></html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('rpg ok：英雄 ' + Object.keys(SC.RPR.h).filter(x => !SC.RPHIDE[x]).length + '、武器 ' + Object.keys(SC.RPR.w).length + '、寵物 ' + Object.keys(SC.RPR.p).length + '、寶物 ' + SC.RPT.length + '、商城上架 ' + Object.keys(SC.RPSON).length + ' 類');
