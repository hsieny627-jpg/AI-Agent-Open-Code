/* midterm/_newgames.js — 📝 四年級 複習 新 25／新 50 的 6 種 全新 遊戲（2026-10-29 第三十三次 第 5 件；老師 C36「對」＋第 6 點「比 三年級 更 好玩」）
 *   n1 🚀 字首音 太空 射擊（考卷 A＋B）   n2 🏎️ 聽力 賽車（C）   n3 🐍 英文 貪食蛇（D）
 *   n4 🦘 對話 跳跳樂（E）                n5 🫧 拼字 泡泡龍（F）  n6 🚪 密室 逃脫（G＋H）
 * 題目 ＝ midterm/_data.js 的 XB2（_pool.js 的 NB）。每一種 都 是「選 一個」：學生 操作（射擊、開車、蛇 去 吃、跳、射 泡泡、拿 鑰匙）
 * ➜ 動畫 演完 ➜ 呼叫 原本 的 pick(第幾個)（成績、答錯頁、25／50 題 的 分數 都 照舊）。
 * 這裡 是 網頁 端 的 程式 字串（樣板 裡 的 正規 表示式 一律 兩條 斜線）。 */
exports.HOW = {
  n1: '聽 ➜ ◀ ▶ 移動 太空船 對準 隕石 ➜ 按〔🔥 發射〕（也 可以 直接 點 隕石）',
  n2: '聽 對話 ➜ ◀ ▶ 換 跑道 ➜ 按〔⬆ 衝！〕開進 對 的 拱門（也 可以 直接 點 拱門）',
  n3: '聽 ➜ 方向鍵 讓 蛇 去 吃 對 的 那一個（也 可以 直接 點 它）；撞到 牆 或 自己 ＝ 回到 中間，不算 錯',
  n4: '讀 對話 ➜ 點 寫著 對 的 回答 的 雲，袋鼠 跳 上去 往 上 爬',
  n5: '看 圖 ➜ 點 字母 泡泡 射到 空格（照 順序），拼出 這個 字',
  n6: '讀 牆上 的 對話（或 看 家族樹）➜ 選 對 的 鑰匙 🗝 打開 門'
};
exports.T = { n1: 20, n2: 20, n3: 30, n4: 25, n5: 30, n6: 30 };
exports.COL = { n1: ['#1A237E', '#7C4DFF'], n2: ['#E65100', '#FFB300'], n3: ['#1B5E20', '#76FF03'], n4: ['#0277BD', '#80D8FF'], n5: ['#AD1457', '#FF80AB'], n6: ['#37474F', '#FFD54A'] };
exports.CSS = `
/* ── 👥 兩人 一台（2026-10-29 第 4 件）── */
.duo{display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;font-size:clamp(20px,2.6vh,26px);color:#BFD3E6;margin:14px 0}
.duo button{min-height:60px;padding:6px 22px;border-radius:18px;border:3px solid #4A5A6C;background:#1B2633;font-size:clamp(22px,3vh,28px)}.duo button.on{border-color:#FFD54A;background:#3A3010;color:#FFE38A}
#duob{position:fixed;inset:0;z-index:96;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:rgba(5,8,20,.9);font-size:clamp(40px,7vh,72px);color:#fff;text-align:center;padding:16px}
#duob.on{display:flex;animation:pop .3s}#duob b{font-size:.6em;color:#FFD54A}#duob .p2,.duoe .p2 b{color:#80D8FF}#duob .p1,.duoe .p1 b{color:#FFD54A}
.duot{font-size:clamp(16px,2.2vh,22px);padding:2px 10px;border-radius:999px;border:2px solid #FFD54A;margin-left:8px}.duot.p2{border-color:#80D8FF;color:#80D8FF}.duot.p1{color:#FFE38A}
.duoe{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin:16px 0}.duoe>div{display:flex;flex-direction:column;gap:6px;align-items:center;min-width:260px;padding:16px;border-radius:22px;background:#111A28;border:3px solid #2E4058}
.duoe .big{font-size:clamp(36px,6vh,60px);color:#fff}
/* ── C35 第 1 題 遊戲 元素（2026-10-29 第 7 件）── */
.lmap{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:2px;max-width:min(96vw,1100px);margin-bottom:14px}
.lnd{position:relative;display:inline-flex;align-items:center;justify-content:center;width:clamp(40px,5vw,58px);height:clamp(40px,5vw,58px);border-radius:50%;background:#1B2633;border:3px solid #3F5268;font-size:clamp(20px,2.8vw,30px);opacity:.75;animation:lndIn .4s backwards}
.lnd small{position:absolute;bottom:-1.3em;font-size:18px;color:#9FB4C8}.lnd.ok{background:#14532D;border-color:#2BD46A;color:#BFFFD0;opacity:1}.lnd.cur{border-color:#FFD54A;background:#3A3010;opacity:1;transform:scale(1.2);box-shadow:0 0 18px #FFD54A;animation:lndIn .4s backwards,lndG 1s .5s infinite alternate}
.lnd.bs{border-color:#E040FB}.lnd.bs.cur{box-shadow:0 0 22px #E040FB}
.lpth{display:inline-block;width:clamp(6px,1.2vw,18px);height:6px;border-radius:3px;background:#2E4058}.lpth.on{background:#2BD46A}
@keyframes lndIn{from{transform:scale(0)}}@keyframes lndG{to{box-shadow:0 0 32px #FFD54A}}
.lvs .gi{animation:giIn .7s cubic-bezier(.3,1.6,.5,1)}.lvs .gn{animation:gnIn .6s .25s backwards}.lvs .gh{animation:gnIn .6s .45s backwards}
@keyframes giIn{from{transform:scale(0) rotate(-200deg)}}@keyframes gnIn{from{opacity:0;transform:translateY(24px)}}
.lvs.boss{background:radial-gradient(circle at 50% 50%,rgba(160,30,200,.35),transparent 65%)}.lvs.boss .glv{border-color:#E040FB;color:#F8BBF8;background:#2A0A33}.lvs.boss .gi{animation:giIn .7s cubic-bezier(.3,1.6,.5,1),bshk .5s .7s 3}
@keyframes bshk{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
.flm{display:inline-flex;align-items:center;font-size:clamp(20px,2.8vh,28px);color:#FFB74D;padding:0 8px;animation:flm .6s infinite alternate}.flm.hot{font-size:clamp(26px,3.6vh,36px);color:#FF7043;text-shadow:0 0 12px #FF5722}
@keyframes flm{to{transform:scale(1.12) rotate(-4deg)}}
.bhp{font-size:clamp(18px,2.4vh,24px);white-space:nowrap}.bhp s{text-decoration:none;opacity:.5}
.vs{font-size:clamp(20px,2.6vh,26px);white-space:nowrap}.vs .p1{color:#FFD54A}.vs .p2{color:#80D8FF}
#bossfx{position:fixed;inset:0;pointer-events:none;z-index:70;display:none;align-items:center;justify-content:center;flex-direction:column}#bossfx.on{display:flex}
#bossfx .bm{font-size:clamp(110px,20vh,200px);animation:bshk .3s 2}#bossfx .bx{position:absolute;font-size:clamp(90px,16vh,160px);animation:bxp .6s forwards}#bossfx.ko .bm{animation:bko 1.4s forwards}
#bossfx .bk{font-size:clamp(36px,6vh,60px);color:#FFD54A;text-shadow:0 0 16px #000}
@keyframes bxp{from{transform:scale(.2);opacity:1}to{transform:scale(1.6);opacity:0}}@keyframes bko{to{transform:rotate(90deg) translateY(60px);opacity:0}}
#coop{position:fixed;left:50%;bottom:8px;transform:translateX(-50%);z-index:40;display:none;align-items:center;gap:10px;padding:6px 14px;border-radius:999px;background:rgba(10,20,34,.92);border:2px solid #2E7D32;font-size:clamp(18px,2.2vh,22px);color:#C8E6C9;white-space:nowrap}
#coop.on{display:flex}#coop .cb{width:clamp(120px,18vw,260px);height:14px;border-radius:7px;background:#1B2B1B;overflow:hidden}#coop .cb i{display:block;height:100%;background:linear-gradient(90deg,#66BB6A,#FFD54A);transition:width .6s}
.duoe .win{border-color:#FFD54A;box-shadow:0 0 22px rgba(255,213,74,.5)}.duoe .cr{font-size:48px}
/* ── 🚀 n1 太空 射擊 ── */
.n1{position:relative;width:min(100%,920px);height:clamp(260px,44vh,440px);border-radius:24px;overflow:hidden;background:radial-gradient(ellipse at 50% 120%,#3B1E7A 0,#0B0828 60%,#04030F 100%);border:3px solid #3A2C7A}
.n1 .stars{position:absolute;inset:-50% 0 0;background-image:radial-gradient(2px 2px at 10% 20%,#fff,transparent),radial-gradient(2px 2px at 60% 30%,#fff,transparent),radial-gradient(1px 1px at 30% 70%,#fff,transparent),radial-gradient(2px 2px at 80% 60%,#cfe,transparent),radial-gradient(1px 1px at 45% 45%,#fff,transparent);background-size:220px 220px;animation:stf 6s linear infinite;opacity:.8}
@keyframes stf{to{transform:translateY(220px)}}
.ast{position:absolute;top:10%;transform:translateX(-50%);width:clamp(92px,13vw,130px);height:clamp(92px,13vw,130px);border-radius:46% 54% 52% 48%;border:4px solid #8D6E63;background:radial-gradient(circle at 35% 30%,#BCAAA4,#6D4C41 70%);display:flex;align-items:center;justify-content:center;animation:astf 3.2s ease-in-out infinite alternate}
.ast b{font-size:clamp(46px,8vh,72px);color:#fff;text-shadow:0 3px 0 #3E2723,0 0 12px #000}.ast:nth-of-type(2n){animation-delay:-1.4s}
@keyframes astf{to{top:22%}}
.ast.wide{width:clamp(190px,26vw,270px);border-radius:80px}.ast.wide b{font-size:clamp(36px,6vh,54px)}
.ast.aim{box-shadow:0 0 0 5px #FFD54A,0 0 26px #FFD54A}.ast.ok{background:radial-gradient(circle,#FFF59D,#FF6F00 60%,transparent 70%);border-color:transparent;animation:boom .5s forwards}
.ast.bad{border-color:#FF5A5A;animation:shk .4s}.ast.no{opacity:.35}
@keyframes boom{60%{transform:translateX(-50%) scale(1.5)}to{transform:translateX(-50%) scale(1.25);opacity:.9}}
.ship{position:absolute;bottom:4%;transform:translateX(-50%) rotate(-45deg);font-size:clamp(56px,9vh,84px);transition:left .25s ease;filter:drop-shadow(0 0 10px #7C4DFF)}
.lz{position:absolute;width:10px;border-radius:6px;background:linear-gradient(#FFF,#FF4081);box-shadow:0 0 16px #FF4081;transform:translateX(-50%);opacity:0;pointer-events:none}.lz.on{animation:lz .35s}.lz.big{width:18px}
@keyframes lz{0%{opacity:1;clip-path:inset(100% 0 0 0)}60%{opacity:1;clip-path:inset(0 0 0 0)}100%{opacity:0}}
.ngc{display:flex;gap:14px;justify-content:center;margin-top:8px}.ngc button{min-width:clamp(80px,11vw,120px);min-height:64px;border-radius:18px;border:3px solid #4A5A6C;background:#1B2633;font-size:clamp(26px,3.6vh,36px)}
.ngc .fire{background:linear-gradient(#FF8A65,#E64A19);border-color:#FFAB91;min-width:clamp(150px,20vw,220px)}
/* ── 🏎️ n2 聽力 賽車 ── */
.n2{position:relative;width:min(100%,900px);height:clamp(250px,40vh,420px);border-radius:24px;overflow:hidden;background:linear-gradient(#5DADE2 0,#A9DFBF 26%,#4E5A63 26%,#4E5A63 100%);border:3px solid #2E4058;display:grid;grid-template-columns:repeat(3,1fr)}
.n2 .road{position:absolute;inset:26% 0 0;background:repeating-linear-gradient(to right,transparent 0,transparent calc(33.33% - 4px),#fff calc(33.33% - 4px),#fff 33.33%);mask:repeating-linear-gradient(transparent 0 30px,#000 30px 60px);-webkit-mask:repeating-linear-gradient(transparent 0 30px,#000 30px 60px);animation:rd .5s linear infinite;opacity:.8}
@keyframes rd{to{-webkit-mask-position:0 60px;mask-position:0 60px}}
.lane{position:relative;z-index:1;margin:8px auto 0;align-self:start;width:88%;height:62%;border-radius:22px 22px 6px 6px;border:6px solid #FFB300;background:linear-gradient(#F4F8FF,#D9E6F7);display:flex;align-items:center;justify-content:center;gap:4px}
.lane .pw{font-size:clamp(64px,10vh,100px);line-height:1}.lane .pj{font-size:clamp(40px,6vh,60px);background:#fff;border:4px solid #FFB300;border-radius:50%;width:1.5em;height:1.5em;display:flex;align-items:center;justify-content:center}
.lane.aim{box-shadow:0 0 0 6px #fff,0 0 24px #FFD54A}.lane.ok{border-color:var(--ok);box-shadow:0 0 0 6px var(--ok)}.lane.no{opacity:.35}.lane.bad{border-color:var(--no);animation:shk .4s}
.car{position:absolute;z-index:2;bottom:3%;transform:translateX(-50%) scaleX(-1) rotate(90deg);font-size:clamp(60px,10vh,90px);transition:left .25s ease,bottom .6s cubic-bezier(.5,0,.8,.4)}
.car.go{bottom:46%}.car.spin{animation:spin .7s}@keyframes spin{to{transform:translateX(-50%) scaleX(-1) rotate(450deg)}}
/* ── 🐍 n3 貪食蛇 ── */
.n3w{position:relative;border-radius:18px;background:#123C1E;border:4px solid #2E7D32;background-image:linear-gradient(#174A26 1px,transparent 1px),linear-gradient(90deg,#174A26 1px,transparent 1px);touch-action:none}
.n3w .fr{position:absolute;padding:0;border-radius:16px;border:4px solid #FFD54A;background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center}
.n3w .fr img{width:100%;height:100%;object-fit:cover}.n3w .fr b{font-size:clamp(34px,5.4vh,56px);color:#1B3A1F}
.n3w .fr.ok{border-color:var(--ok);box-shadow:0 0 0 5px var(--ok)}.n3w .fr.no{opacity:.35}.n3w .fr.bad{border-color:var(--no);animation:shk .4s}
.n3w .sg{position:absolute;border-radius:30%;background:radial-gradient(circle at 35% 35%,#B9F6CA,#00C853);box-shadow:inset 0 -3px 0 #1B5E20;transition:left .12s linear,top .12s linear}
.n3w .sg.gold{background:radial-gradient(circle at 35% 35%,#FFF9C4,#FFC400)}
.n3w .sg.hd{z-index:2;background:radial-gradient(circle at 35% 35%,#CCFF90,#64DD17);display:flex;align-items:center;justify-content:center;font-size:.9em}
.n3w .sg.hd.gold{background:radial-gradient(circle at 35% 35%,#FFF59D,#FFAB00)}
.n3w .hit{position:absolute;inset:0;background:rgba(255,80,80,.25);animation:fl .5s}@keyframes fl{to{opacity:0}}
.n3b{display:flex;align-items:center;gap:12px;justify-content:center;flex-wrap:wrap}
.dpad3{display:grid;grid-template-columns:repeat(3,64px);grid-template-rows:repeat(2,64px);gap:6px}.dpad3 button{border-radius:16px;border:3px solid #4A5A6C;background:#1B2633;font-size:30px}
.dpad3 [data-d="u"]{grid-column:2}.dpad3 [data-d="l"]{grid-column:1;grid-row:2}.dpad3 [data-d="d"]{grid-column:2;grid-row:2}.dpad3 [data-d="r"]{grid-column:3;grid-row:2}
/* ── 🦘 n4 跳跳樂 ── */
.n4{position:relative;width:min(100%,960px);display:flex;flex-direction:column;align-items:center;gap:10px}
.n4 .cl{display:flex;gap:clamp(8px,1.4vw,16px);justify-content:center;width:100%}
.cld{flex:1;max-width:320px;min-height:clamp(96px,14vh,130px);border:0;border-radius:60px;background:radial-gradient(circle at 30% 30%,#fff,#DDEBFA);color:#123;font-size:clamp(22px,3vh,30px);padding:10px 16px;box-shadow:0 8px 0 #9FB8D4;line-height:1.25;transition:transform .2s}
.cld.ok{background:radial-gradient(circle at 30% 30%,#fff,#B9F6CA);box-shadow:0 0 0 6px var(--ok)}.cld.no{opacity:.35}.cld.bad{animation:brk .5s forwards}
@keyframes brk{40%{transform:rotate(-4deg)}100%{transform:translateY(40px) rotate(8deg);opacity:.3}}
.n4 .gr{position:relative;width:100%;height:clamp(110px,17vh,160px)}
.roo{position:absolute;left:50%;bottom:0;transform:translateX(-50%);font-size:clamp(64px,10vh,96px);transition:left .45s cubic-bezier(.3,1.5,.6,1),bottom .45s cubic-bezier(.3,1.5,.6,1)}
.roo.up{bottom:115%}.roo.fall{animation:fall .6s}@keyframes fall{50%{bottom:60%}100%{bottom:0}}
.hm{position:absolute;right:0;bottom:0;font-size:clamp(20px,2.6vh,26px);color:#FFD54A;background:#14202E;border:2px solid #3F6386;border-radius:12px;padding:4px 10px}
/* ── 🫧 n5 泡泡龍 ── */
.n5 .tiles button{border-radius:50%;background:radial-gradient(circle at 32% 30%,#fff 0,#FFD1E8 20%,#FF80AB 75%,#AD1457 100%);color:#3A0018;box-shadow:inset -6px -8px 14px rgba(0,0,0,.18),0 4px 0 #880E4F}
.n5 .tiles button.lv{color:#B71C1C}.n5 .tiles button.fly{animation:bfly .35s ease-in forwards}@keyframes bfly{to{transform:translateY(-140px) scale(.4);opacity:0}}
.n5 .slots span{border-radius:50%}
.n5 .sp1 .ic{font-size:clamp(70px,11vh,110px)}
/* ── 🚪 n6 密室 逃脫 ── */
.n6{width:min(100%,980px);display:flex;flex-direction:column;align-items:center;gap:8px}
.door{display:flex;align-items:center;gap:12px;font-size:clamp(20px,2.6vh,26px);color:#FFD54A}
.door .dr{font-size:clamp(44px,7vh,64px);transition:transform .6s}.door.open .dr{transform:perspective(300px) rotateY(-70deg)}
.n6 .opts.keys .o::before{content:'🗝 '}
.tree.jobs button small{display:block;font-size:.42em;line-height:1}
.n6 .tree button{font-size:clamp(44px,6.4vh,66px);width:clamp(96px,11vw,130px);padding:2px 0}.n6 .tree .me{font-size:clamp(36px,5vh,50px)}.n6 .qline{margin:2px 0}
`;
exports.JS = `
/* ══ 四年級 新 25／新 50 的 6 種 全新 遊戲（midterm/_newgames.js）══ */
var NG={n1:1,n2:1,n3:1,n4:1,n5:1,n6:1},NGS=null;
function ngPic(p){var a=String(p).split('|'),w=WHO[a[0]],j=a[1]?JOB[a[1]]:null;return '<span class="pw">'+w[0]+'</span>'+(j?'<span class="pj">'+j[0]+'</span>':'')}
function ngHear(slow){return '<div class="hrow"><button class="hear" id="hear" data-x="hear">🔊 再 聽 一次</button>'+(slow?'<button class="hear slow" id="hslow" data-x="slow">🐢 慢慢 唸</button>':'')+'</div>'}
/* 拼字 泡泡：多 的 2 顆 ＝ 跟 這個 字 的 字母 長得像／聽起來 像（🔒 錯 的 一律 相近）*/
var NEARL={a:['e','o','u'],e:['a','i','o'],i:['e','y','a'],o:['u','a','e'],u:['o','a','e'],b:['d','p'],d:['b','t'],p:['b','q'],t:['d','f'],m:['n','w'],n:['m','h'],r:['l','n'],l:['r','i'],s:['c','z'],c:['k','s'],k:['c','h'],g:['j','q'],h:['n','k'],f:['v','t'],v:['f','w'],w:['v','m'],y:['i','j'],x:['k','z'],j:['g','y'],z:['s','x'],q:['p','g']};
function ngShow(id,q){var h='';NGS={id:id};
  if(id==='n1'){var n=q.o.length;R.aim=Math.floor((n-1)/2);h=ngHear(1)+'<div class="n1" id="n1"><div class="stars"></div>'+R.ord.map(function(i,j){return '<button class="ast'+(q.kind==='S'?' wide':'')+'" data-o="'+i+'" data-c="'+j+'" style="left:'+((j+.5)/n*100)+'%"><b>'+esc(q.o[i])+'</b></button>'}).join('')+
    '<div class="lz" id="lz"></div><div class="ship" id="ship" style="left:'+((R.aim+.5)/n*100)+'%">🚀</div></div><div class="ngc"><button data-x="ngl" aria-label="左">◀</button><button data-x="ngf" class="fire">🔥 發射</button><button data-x="ngr" aria-label="右">▶</button></div>'}
  else if(id==='n2'){R.aim=1;h=ngHear(0)+'<div class="n2" id="n2"><div class="road"></div>'+R.ord.map(function(i,j){return '<button class="lane" data-o="'+i+'" data-c="'+j+'" aria-label="'+esc(q.oz[i])+'">'+ngPic(q.o[i])+'</button>'}).join('')+
    '<div class="car" id="car" style="left:50%">🏎️</div></div><div class="ngc"><button data-x="ngl" aria-label="左">◀</button><button data-x="ngf" class="fire">⬆ 衝！</button><button data-x="ngr" aria-label="右">▶</button></div>'}
  else if(id==='n3')h=ngHear(!q.photo)+'<div class="n3b"><div class="n3w" id="n3w"></div><div class="dpad3"><button data-d="u" aria-label="上">⬆</button><button data-d="l" aria-label="左">⬅</button><button data-d="d" aria-label="下">⬇</button><button data-d="r" aria-label="右">➡</button></div></div>';
  else if(id==='n4'){R.jh=R.jh||0;h='<div class="n4"><div class="chat" id="chat">'+(q.chat==='A'?'<div class="bub a"><span class="who">A</span>'+esc(q.line)+'</div><div class="bub b q"><span class="who">B</span>？</div>':'<div class="bub a q"><span class="who">A</span>？</div><div class="bub b"><span class="who">B</span>'+esc(q.line)+'</div>')+'</div>'+
    '<div class="cl">'+R.ord.map(function(i){return '<button class="cld" data-o="'+i+'">'+esc(q.o[i])+'</button>'}).join('')+'</div><div class="gr"><div class="roo" id="roo">🦘</div><div class="hm" id="hm">🏔 '+R.jh+' m</div></div></div>'}
  else if(id==='n5'){R.pk=[];var w=q.spell,mid=w.slice(1,-1).split(''),ex=[];mid.forEach(function(c){(NEARL[c]||[]).forEach(function(x){if(ex.length<2&&mid.indexOf(x)<0&&ex.indexOf(x)<0)ex.push(x)})});
    'bcdfghklmnprstvwy'.split('').forEach(function(c){if(ex.length<2&&mid.indexOf(c)<0&&ex.indexOf(c)<0)ex.push(c)});R.tiles=shuf(mid.concat(ex));
    h='<div class="n5"><div class="sp1"><span class="ic">'+q.ic+'</span></div><div class="slots" id="slots"></div><div class="tiles">'+R.tiles.map(function(c,i){return '<button data-t="'+i+'"'+(/[aeiou]/.test(c)?' class="lv"':'')+'>'+c+'</button>'}).join('')+'</div><button class="bk" data-x="bk">⌫ 退 一個</button></div>'}
  else if(id==='n6'){var rk=(R.gk||0)+1;h='<div class="n6"><div class="door" id="door"><span class="dr">🚪</span>第 '+rk+' 道 門 · 選 對 的 鑰匙 🗝</div>'+(q.room==='P'?pasHTML(q.pas)+'<div class="pq">'+esc(q.q.replace(/^📖 /,''))+'</div>'+opts(R.ord,'n3 keys'):
    '<div class="qline">'+esc(q.line)+'</div><div class="tree jobs" id="tree">'+ngT('grandpa','r1')+ngT('grandma','r1b')+'<div class="ln"></div>'+ngT('dad','r2')+ngT('mom','r2b')+'<div class="ln"></div>'+ngT('brother','')+'<div class="me">🙋<small>me</small></div>'+ngT('sister','')+'</div>')+'</div>'}
  return h}
function ngT(w,c){var i=R.q.o.indexOf(w);return '<button class="'+c+'" data-o="'+(i<0?3:i)+'" data-w="'+w+'">'+WHO[w][0]+'<small>'+JOB[R.q.jobs[w]][0]+'</small></button>'}
/* 畫好 以後：貪食蛇 開始；泡泡龍 畫 格子 */
function ngAfter(id){if(id==='n5')drawSp();if(id==='n3')snInit()}
/* 太空船、賽車：左右 移動、發射／衝 */
function ngMove(d){if(!R||R.lock||!NGS)return;var id=R.g.id,n=R.q.o.length;R.aim=Math.max(0,Math.min(n-1,R.aim+d));var x=((R.aim+.5)/n*100)+'%';
  if(id==='n1'){$('#ship').style.left=x;$$('.ast').forEach(function(a){a.classList.toggle('aim',+a.getAttribute('data-c')===R.aim)})}
  if(id==='n2'){$('#car').style.left=x;$$('.lane').forEach(function(a){a.classList.toggle('aim',+a.getAttribute('data-c')===R.aim)})}}
function ngFire(){if(!R||R.lock||!NGS||NGS.busy)return;var id=R.g.id,b=$('#stage [data-c="'+R.aim+'"]');if(!b)return;var i=+b.getAttribute('data-o');NGS.busy=1;tPause();
  if(id==='n1'){var z=$('#lz'),s=$('#ship'),n=$('#n1').getBoundingClientRect(),br=b.getBoundingClientRect(),sr=s.getBoundingClientRect();z.style.left=(br.left+br.width/2-n.left)+'px';z.style.top=(br.bottom-n.top)+'px';z.style.height=Math.max(10,sr.top-br.bottom)+'px';
    z.classList.toggle('big',(R.st||0)>=2);z.classList.remove('on');void z.offsetWidth;z.classList.add('on');later(function(){NGS.busy=0;pick(i)},360)}
  if(id==='n2'){var c=$('#car');c.classList.add('go');later(function(){NGS.busy=0;pick(i);if(i!==0)c.classList.add('spin')},620)}}
/* 點 選項：先 演 動畫 再 算 */
function ngTap(b){var id=R.g.id,i=+b.getAttribute('data-o');
  if(id==='n1'||id==='n2'){var c=+b.getAttribute('data-c');ngMove(c-R.aim);later(ngFire,260);return true}
  if(id==='n4'){var r=$('#roo'),g=$('#stage .n4').getBoundingClientRect(),br=b.getBoundingClientRect();tPause();r.style.left=(br.left+br.width/2-g.left)+'px';r.classList.add('up');
    later(function(){if(i===0){R.jh+=10;var m=$('#hm');if(m)m.textContent='🏔 '+R.jh+' m'}else r.classList.add('fall');pick(i)},480);return true}
  if(id==='n6'&&R.q.room==='T')return false;
  return false}
/* 答對 以後 的 小 動畫（pick 裡 呼叫）*/
function ngOk(id){if(id==='n6'){var d=$('#door');if(d)d.classList.add('open')}if(id==='n3')snStop()}
/* ── 🐍 貪食蛇：9 ✕ 5 格；4 個 果實 在 四個 角落 附近；方向鍵 ＝ 一直 走（像 小精靈）；點 果實 ＝ 自己 找 路 ── */
var SN=null;
function snInit(){var w=$('#n3w'),q=R.q,C=9,Rw=5,cs=Math.floor(Math.min(($('#stage').clientWidth-230)/C,(innerHeight-420)/Rw,96));cs=Math.max(cs,54);
  w.style.width=C*cs+'px';w.style.height=Rw*cs+'px';w.style.backgroundSize=cs+'px '+cs+'px';var spots=[[1,0],[7,0],[1,4],[7,4]].slice(0,q.o.length);
  SN={C:C,Rw:Rw,cs:cs,len:3+Math.min(6,R.snk||0),body:[[4,2],[4,3],[4,4]].slice(0,1),dir:null,next:null,path:null,iv:0,fr:[]};
  for(var k=1;k<SN.len;k++)SN.body.push([4,2]);
  w.innerHTML=R.ord.map(function(i,j){var p=spots[j];SN.fr.push({x:p[0],y:p[1],i:i});var o=q.o[i];return '<button class="fr" data-o="'+i+'" style="left:'+(p[0]*cs+3)+'px;top:'+(p[1]*cs+3)+'px;width:'+(cs-6)+'px;height:'+(cs-6)+'px">'+(q.photo?'<img src="img/'+o+'.jpg" alt="">':'<b>'+esc(o)+'</b>')+'</button>'}).join('');
  snDraw();SN.iv=setInterval(snStep,230);var sx,sy;w.onpointerdown=function(e){sx=e.clientX;sy=e.clientY};w.onpointerup=function(e){if(sx==null)return;var dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)+Math.abs(dy)<30)return;snDir(Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u'))}}
function snStop(){if(SN){clearInterval(SN.iv);SN.iv=0}}
function snDir(d){if(!SN||!R||R.lock)return;SN.path=null;var op={u:'d',d:'u',l:'r',r:'l'};if(SN.dir&&op[SN.dir]===d&&SN.body.length>1)return;SN.dir=d}
function snDraw(){var w=$('#n3w');if(!w)return;[].slice.call(w.querySelectorAll('.sg')).forEach(function(x){x.remove()});var gold=(R.snk||0)>=3,cs=SN.cs;
  SN.body.forEach(function(p,k){var e=document.createElement('div');e.className='sg'+(k?'':' hd')+(gold?' gold':'');e.style.left=(p[0]*cs+5)+'px';e.style.top=(p[1]*cs+5)+'px';e.style.width=e.style.height=(cs-10)+'px';if(!k){e.style.fontSize=(cs*.45)+'px';e.textContent=(R.snk||0)>=6?'👑':'👀'}w.appendChild(e)})}
function snStep(){if(!SN||!R||R.lock||!TM.run)return;var d=SN.dir;if(SN.path&&SN.path.length){var nx=SN.path.shift(),h0=SN.body[0];d=nx[0]>h0[0]?'r':nx[0]<h0[0]?'l':nx[1]>h0[1]?'d':'u';SN.dir=d}if(!d)return;
  var h=SN.body[0],m={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]}[d],n=[h[0]+m[0],h[1]+m[1]];
  if(n[0]<0||n[1]<0||n[0]>=SN.C||n[1]>=SN.Rw||SN.body.slice(0,-1).some(function(p){return p[0]===n[0]&&p[1]===n[1]})){var w=$('#n3w'),f=document.createElement('div');f.className='hit';w.appendChild(f);setTimeout(function(){f.remove()},500);
    SN.body=[[4,2]];for(var k=1;k<SN.len;k++)SN.body.push([4,2]);SN.dir=null;SN.path=null;snDraw();return}   /* 撞到 ＝ 回到 中間，不算 錯 */
  SN.body.unshift(n);SN.body.pop();snDraw();
  var hit=SN.fr.filter(function(f){return f.x===n[0]&&f.y===n[1]})[0];if(hit){snStop();if(hit.i===0)R.snk=(R.snk||0)+1;pick(hit.i)}}
function snGo(i){if(!SN)return;var f=SN.fr.filter(function(x){return x.i===i})[0];if(!f)return;var C=SN.C,Rw=SN.Rw,st=SN.body[0],key=function(p){return p[0]+','+p[1]},prev={},Q=[st],seen={};seen[key(st)]=1;
  var blk={};SN.body.slice(1,-1).forEach(function(p){blk[key(p)]=1});
  while(Q.length){var p=Q.shift();if(p[0]===f.x&&p[1]===f.y)break;[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(m){var n=[p[0]+m[0],p[1]+m[1]],k=key(n);if(n[0]<0||n[1]<0||n[0]>=C||n[1]>=Rw||seen[k]||blk[k])return;
    var fr=SN.fr.some(function(x){return x.x===n[0]&&x.y===n[1]&&x.i!==i});if(fr)return;seen[k]=1;prev[k]=p;Q.push(n)})}
  var path=[],c=[f.x,f.y];if(!seen[key(c)])return;while(key(c)!==key(st)){path.unshift(c);c=prev[key(c)]}SN.path=path}
addEventListener('keydown',function(e){if(!R||!R.g||!NG[R.g.id]||R.lock)return;var id=R.g.id,k=e.key;
  if(id==='n3'){var d={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r'}[k];if(d){e.preventDefault();snDir(d)}return}
  if(id==='n1'||id==='n2'){if(k==='ArrowLeft'){e.preventDefault();ngMove(-1)}else if(k==='ArrowRight'){e.preventDefault();ngMove(1)}else if(k===' '||k==='Enter'||k==='ArrowUp'){e.preventDefault();ngFire()}}});
`;
