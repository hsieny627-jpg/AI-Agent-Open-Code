/* vs/_build.js — ⚔️ 左右 對戰 平板 頁（2026-11-14 第五十四次）：node vs/_build.js ➜ vs/index.html
 * 題庫 vs/_data.js；程式 vs/_vs.js；成績 score/_client.js（home：登入＋送 成績）；現場任務 live/_db.js＋live/_xlive_rt.js（⏱ 倒數、時間 到 xForce）。
 * 語音：全部 用 網站 已經 有 的 預錄 語音（HiFi-Captain）；查不到 ＝ build 失敗（不 用 瀏覽器 的 機器 聲音）。 */
const fs = require('fs'), path = require('path'), ROOT = path.join(__dirname, '..');
const D = require('./_data.js'), CL = require('../score/_client.js');
const MAPS = ['midterm/audio/s', 'g3mid/audio', 'midterm/audio', 'sentences/audio', 'G3 - L1 + L2/audio'];
const akey = s => String(s).replace(/[’]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
const AUD = {}, ALL = {};
MAPS.forEach(d => { const o = JSON.parse(fs.readFileSync(path.join(ROOT, d, 'aud.js'), 'utf8').match(/=(\{.*\})/s)[1]);
  Object.keys(o).forEach(k => { if (!ALL[k]) ALL[k] = ['../' + d.split(' ').join('%20') + '/' + o[k][0], o[k][1]]; }); });
const bad = [];
[3, 4].forEach(g => D.BANK[g].forEach((q, i) => {
  const k = akey(q.say); if (!ALL[k]) bad.push(g + '-' + i + ' 沒有 語音：' + q.say); else AUD[k] = ALL[k];
  if (q.o.length !== 4 || new Set(q.o).size !== 4) bad.push(g + '-' + i + ' 選項 要 4 個 不一樣');
  if (q.h.length !== 4 || q.h.slice(1).some(x => !x)) bad.push(g + '-' + i + ' 每 一個 錯 選項 要 有 💡');
  if (/[㐀-鿿]/.test(q.q + q.o.join('') + q.cuet)) bad.push(g + '-' + i + ' 題目／選項 要 全 英文');
  if (!q.ag.length || !q.az) bad.push(g + '-' + i + ' 要 有 逐字 中文、整句 中文');
}));
/* 戊：同 一個 句型 至少 要 有 兩個「正確 答案 不一樣」的 題目（才 能 配對）*/
[3, 4].forEach(g => { const F = {}; D.BANK[g].forEach(q => { (F[q.f] = F[q.f] || new Set()).add(q.o[0]); }); Object.keys(F).forEach(f => { if (F[f].size < 2) bad.push(g + ' ' + f + ' 配不成 對'); }); });
if (bad.length) { console.error('✗ ' + bad.join('\n✗ ')); process.exit(1); }
const J = o => JSON.stringify(o).replace(/</g, '\\u003c');
/* ══ 2026-11-15 第五十五次 第 7 點：任何 一個 主題 都 可以 ⚔️ 左右 對戰 ══
 * 題目 ＝ ⚡ 現場任務 同 一份（live/_qbank.js 的 GR：10 種 句型遊戲＋Review 1 遊戲）➜ vs/t/主題.js（平板 選到 才 載入）。
 * 只 用 四選一（ty mc、2～4 個 選項）；🎧 聽力題 不 用（兩 人 一台 同時 放 聲音 會 互相 干擾）。
 * 成績 ＝ g年級gm_vs-主題（例 g3gm_vs-sg1）、第幾題 ＝ 原本 遊戲 的 第幾題 ➜ 老師看板 錯題 分析 自動 用 原本 遊戲 的 題庫（score/_teacher.js bankOf）。 */
const QB = require('../live/_qbank.js')(), TDIR = path.join(__dirname, 't'), TLIST = { 3: [], 4: [] };
if (!fs.existsSync(TDIR)) fs.mkdirSync(TDIR);
const unI = h => String(h == null ? '' : h).replace(/§i:([^§]+)§/g, (m, k) => QB.ICON[k] || '');
const stripT = h => String(h).replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
[3, 4].forEach(g => QB.LIST[g].forEach(k => { const G = QB.GR[k];
  const qs = G.qs.filter(q => q.ty === 'mc' && !q.ls && !q.al && q.o && q.o.length >= 2 && q.o.length <= 4).map(q => ({
    t: unI(q.t), o: q.o.map(unI), ot: q.ot, h: q.o.map((x, j) => j ? (q.h || '') : ''), ag: (q.ag || []).reduce((o, w) => { if (/^[.?!,]+$/.test(w[0]) && o.length) o[o.length - 1] = [o[o.length - 1][0] + w[0], o[o.length - 1][1]]; else o.push(w); return o; }, []),   /* 句點、問號 接 在 前一個 字 */ az: q.az || (q.ag || []).map(w => w[1]).filter(Boolean).join(' ') || stripT((/<small>([\s\S]*?)<\/small>/.exec(q.t) || ['', ''])[1]),   /* 沒有 整句 翻譯 ＝ 用 逐字 中文 接 起來 */ au: q.au || '', ae: q.ae || q.ot[0], i: q.i }));
  qs.forEach(q => { if (!q.ag.length) q.ag = [[q.ae, q.az]]; });   /* 沒有 逐字 中文 ＝ 整個 答案 ＋ 中文 意思 */
  for (let j = qs.length - 1; j >= 0; j--) if (!/[㐀-鿿]/.test(qs[j].az)) qs.splice(j, 1);   /* 沒有 中文 意思 的 題目（例：哪個 字母 不 發音）不 放 */
  if (qs.length < 4 || new Set(qs.map(q => q.ot[0])).size < 2) return;
  const tk = k.replace(/^[34]/, ''), file = g + '_' + tk + '.js';
  fs.writeFileSync(path.join(TDIR, file), 'VST(' + J({ k: tk, g, nm: G.nm, sec: G.sec, qs }) + ');');
  TLIST[g].push({ k: tk, nm: G.nm, sec: G.sec, n: qs.length }); }));
fs.writeFileSync(path.join(TDIR, 'list.json'), JSON.stringify(TLIST));
const CSS = `
@font-face{font-family:Andika;src:url(../words/fonts/andika-700.woff2) format('woff2');font-weight:700}
:root{--bg:#120B33;--l:#2F6BFF;--r:#FF4F8B;--gold:#FFD24A;--ok:#2BB673;--no:#FF5A5A;--card:#FFFFFF;--ink:#1B1640}
*{box-sizing:border-box}html,body{margin:0;height:100%;overflow:hidden;-webkit-text-size-adjust:100%}
body{background:radial-gradient(120% 90% at 50% 0%,#3A1F8F 0%,var(--bg) 60%);color:#fff;font:700 16px/1.35 system-ui,-apple-system,"PingFang TC","Microsoft JhengHei",sans-serif;-webkit-user-select:none;user-select:none}
.en{font-family:Andika,system-ui,sans-serif}
#vtop{position:fixed;left:0;right:0;top:0;height:clamp(54px,8vh,74px);display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 10px;background:linear-gradient(90deg,rgba(47,107,255,.55),rgba(18,11,51,.9) 40%,rgba(18,11,51,.9) 60%,rgba(255,79,139,.55));border-bottom:2px solid rgba(255,255,255,.18);z-index:5}
.vp{display:flex;align-items:center;gap:10px;font-size:clamp(15px,2.1vw,22px);min-width:0}.vp b{white-space:nowrap}.vp span{background:rgba(0,0,0,.35);border-radius:999px;padding:2px 10px;white-space:nowrap}
#vp1{justify-content:flex-end}
.vmid{display:flex;flex-direction:column;align-items:center;line-height:1.1}.vmid #vrnd{font-size:clamp(16px,2.2vw,24px);color:var(--gold)}.vmid #vmode{font-size:clamp(11px,1.3vw,14px);opacity:.8}
#vsplit{position:fixed;left:0;right:0;bottom:0;top:clamp(54px,8vh,74px);display:grid;grid-template-columns:1fr 1fr}
#vsplit:after{content:'';position:absolute;left:50%;top:0;bottom:0;width:4px;margin-left:-2px;background:linear-gradient(var(--l),var(--gold),var(--r));box-shadow:0 0 18px rgba(255,210,74,.6)}
.vh{position:relative;display:flex;flex-direction:column;gap:clamp(8px,1.4vh,14px);padding:clamp(10px,1.6vh,18px) clamp(10px,1.8vw,22px) clamp(12px,2vh,22px);overflow:hidden}
#h0{background:linear-gradient(180deg,rgba(47,107,255,.22),rgba(47,107,255,0) 60%)}#h1{background:linear-gradient(180deg,rgba(255,79,139,.22),rgba(255,79,139,0) 60%)}
.vh.off{align-items:center;justify-content:center;opacity:.55}.vsolo{font-size:clamp(22px,3vw,34px);text-align:center}
.vtb{height:10px;border-radius:999px;background:rgba(255,255,255,.15);overflow:hidden}.vtb i{display:block;height:100%;width:100%;background:linear-gradient(90deg,var(--ok),var(--gold),var(--no));transition:width .1s linear}
.vrc{align-self:center;background:#7C5CFF;border-radius:999px;padding:4px 16px;font-size:clamp(15px,1.9vw,20px);animation:vpop .5s}
.vcue{display:flex;align-items:center;justify-content:center;gap:14px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.18);border-radius:22px;padding:clamp(6px,1vh,12px)}
.vce{font-size:clamp(52px,9vh,96px);line-height:1;filter:drop-shadow(0 6px 10px rgba(0,0,0,.4))}.vct{font-size:clamp(30px,5.4vh,60px);color:var(--gold);background:rgba(0,0,0,.35);border-radius:16px;padding:0 16px}
.vq{background:var(--card);color:var(--ink);border-radius:20px;padding:clamp(8px,1.4vh,14px) 14px;text-align:center;font-size:clamp(26px,4.6vh,46px);box-shadow:0 6px 0 rgba(0,0,0,.25)}
.vq u{text-decoration:none;border-bottom:4px solid #7C5CFF;display:inline-block;min-width:3em}
.vo{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,1.3vh,14px);min-height:0}
.vb{position:relative;min-height:72px;border:0;border-radius:18px;color:#fff;font-size:clamp(20px,3.4vh,36px);padding:8px 10px 8px 44px;text-align:left;box-shadow:0 6px 0 rgba(0,0,0,.3),inset 0 2px 0 rgba(255,255,255,.35);cursor:pointer;touch-action:manipulation;transition:transform .08s,opacity .2s}
.vb:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(0,0,0,.3)}
.vb em{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-style:normal;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.25);font-size:16px;display:flex;align-items:center;justify-content:center}
.vb:nth-child(1){background:#E21B3C}.vb:nth-child(2){background:#1368CE}.vb:nth-child(3){background:#D89E00}.vb:nth-child(4){background:#26890C}
.vb.dim{opacity:.35}.vb.lock{opacity:1;background:#5A5A7A!important;outline:4px solid #fff}
/* 第五十五次 第 1 點：按了 ＝ 那一格 中間 大大 的 🔒（看不出 選 哪一個 對 不 對）*/.vlk{display:none;font-style:normal}.vb.lock .vlk{display:flex;position:absolute;inset:0;align-items:center;justify-content:center;font-size:clamp(40px,7vh,72px);background:rgba(40,40,70,.82);border-radius:18px;animation:vpop .3s}
/* 第 7 點：主題 題目 有 圖示 */.vq svg,.vb svg,.vme svg{height:1.3em;width:auto;vertical-align:middle}.vb .opic{display:inline-flex;align-items:center;gap:8px}.vb.ok{opacity:1;outline:5px solid var(--ok)}.vb.no{opacity:1;outline:5px solid var(--no)}
.vst{text-align:center;font-size:clamp(16px,2.2vh,22px);opacity:.9}
.vh.fb{justify-content:center;align-items:center;text-align:center;animation:vpop .35s}#h0.good,#h1.good{background:linear-gradient(180deg,#0E5A3A,#0B3A2A)}#h0.bad,#h1.bad{background:linear-gradient(180deg,#14805A,#0E5C40)}
.vh.talk{box-shadow:inset 0 0 0 5px var(--gold)}
.vfh{font-size:clamp(26px,4.2vh,44px)}.vfh b{color:var(--gold);margin-left:10px}.vfh i{display:inline-block;font-style:normal;margin-left:10px;background:#7C5CFF;border-radius:999px;padding:0 12px;font-size:.7em}
.vme{display:flex;align-items:center;gap:10px;justify-content:center;font-size:clamp(20px,3vh,30px)}.vme span{font-family:system-ui,sans-serif;font-size:.7em;opacity:.85}.vme s{color:#FFB3B3;text-decoration-color:var(--no);text-decoration-thickness:3px}
.vwhy{background:rgba(0,0,0,.28);border-radius:14px;padding:6px 14px;font-size:clamp(17px,2.4vh,24px);color:#FFF3B0}
.vok{font-size:clamp(17px,2.3vh,22px);color:#B8FFD8}
.vgl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 14px}.vgl .w{display:flex;flex-direction:column;align-items:center;padding:4px 8px;border-radius:12px;transition:transform .15s,background .15s}
.vgl .w b{font-size:clamp(28px,5vh,52px);line-height:1.1}.vgl .w small{font-family:system-ui,"PingFang TC",sans-serif;font-size:clamp(15px,2.2vh,22px);color:#FFE38A}
.vgl .w.rd{background:rgba(255,210,74,.28);transform:scale(1.12)}
.vaz{font-size:clamp(18px,2.7vh,28px)}.vnext{font-size:clamp(15px,2vh,19px);opacity:.85}
.vh.endh{justify-content:center;gap:clamp(8px,1.4vh,14px)}.vet{text-align:center;font-size:clamp(24px,3.8vh,40px);color:var(--gold)}
.vee{display:grid;grid-template-columns:1fr auto;align-items:center;background:rgba(255,255,255,.1);border-radius:16px;padding:8px 14px}.vee span{font-size:clamp(16px,2.2vh,22px)}.vee b{font-size:clamp(28px,4.6vh,46px);color:#fff}.vee small{grid-column:1/3;font-size:clamp(13px,1.7vh,16px);opacity:.8}
#vcv{position:fixed;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:20px;background:rgba(12,8,40,.96);text-align:center}
#vcv[hidden]{display:none}.vci{font-size:clamp(28px,4.6vh,48px)}.vci b{color:var(--gold)}.vcs{font-size:clamp(18px,2.6vh,26px);opacity:.9}
.vih{color:var(--gold)}.vil{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;width:min(900px,94vw);text-align:left}
.vil li{display:flex;align-items:center;gap:14px;background:#1E2550;border:2px solid #3A4590;border-radius:18px;padding:8px 16px;font-size:clamp(18px,2.6vh,26px);animation:vin .5s both}
.vil li:nth-child(2){animation-delay:.4s}.vil li:nth-child(3){animation-delay:.8s}.vil li:nth-child(4){animation-delay:1.2s}.vil li:nth-child(5){animation-delay:1.6s}
.vil li i{font-style:normal;font-size:1.4em}.vil b{color:#FFE38A}
.vbig{min-height:80px;min-width:300px;padding:8px 30px;border:0;border-radius:24px;background:linear-gradient(180deg,#FFE27A,#F5B800);color:#3A2600;font-size:clamp(24px,3.6vh,36px);font-weight:800;box-shadow:0 6px 0 #B07F00;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
.vbig:disabled{background:#4A5070;color:#A8AFCF;box-shadow:none}.vghost{min-height:60px;padding:6px 24px;border:2px solid rgba(255,255,255,.4);border-radius:20px;background:transparent;color:#fff;font-size:clamp(18px,2.4vh,24px)}
#vmsg{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:8;background:rgba(0,0,0,.75);border:2px solid var(--gold);border-radius:18px;padding:8px 22px;text-align:center;font-size:clamp(18px,2.4vh,24px)}
#vmsg[hidden]{display:none}
@keyframes vpop{0%{transform:scale(.85);opacity:0}100%{transform:none;opacity:1}}@keyframes vin{0%{transform:translateY(18px);opacity:0}100%{transform:none;opacity:1}}
@media (orientation:portrait){.vo{grid-template-columns:1fr}.vb{min-height:60px}.vce{font-size:clamp(44px,6vh,80px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
#xlvT{top:auto!important;bottom:8px}
/* 這 一頁 自己 問 左邊、右邊 登入 ➜ 不 用「請問 這是您嗎？」*/#scwho,#scbar{display:none!important}`;
const html = `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>左右 對戰</title><style>${CSS}</style></head><body>
<script>window.SCLIVE=1;</script>
${CL.home(0, '../', 'school')}
<script src="../live/fb.js"></script>
<div id="vtop"><div class="vp" id="vp0"></div><div class="vmid"><span id="vrnd">⚔️ 左右 對戰</span><span id="vmode"></span></div><div class="vp" id="vp1"></div></div>
<div id="vsplit"><div class="vh" id="h0"></div><div class="vh" id="h1"></div></div>
<div id="vmsg" hidden></div><div id="vcv" hidden></div>
<script>var VSBANK=${J(D.BANK)},VSAUD=${J(AUD)};
${fs.readFileSync(path.join(ROOT, 'live', '_db.js'), 'utf8')}
${fs.readFileSync(path.join(ROOT, 'live', '_xlive_rt.js'), 'utf8')}
${fs.readFileSync(path.join(__dirname, '_vs.js'), 'utf8')}
VS.init();
</script><script>${require('../score/_dsp.js').js()}</script></body></html>`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('vs ok：主題 三年級 ' + TLIST[3].length + ' 個、四年級 ' + TLIST[4].length + ' 個；三年級 ' + D.BANK[3].length + ' 題、四年級 ' + D.BANK[4].length + ' 題；語音 ' + Object.keys(AUD).length + ' 句；' + Math.round(html.length / 1024) + ' KB');
