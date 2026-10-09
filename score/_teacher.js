/* score/_teacher.js — 老師看板 teacher/index.html 的樣板（score/_build.js 呼叫；不要手改 teacher/index.html）
 *
 * 使用者的決定（sentences/2026-10-07_C_設計與研究清單.md 第四節、Q1～Q18 照建議）：
 *   最上面：年級、班級、期間（本週／上週／這學期全部／自訂）、來源（在校／在家）＋〔⬇ 一鍵下載 Excel〕＋〔🏆 學生排行榜 開／關〕
 *   四個大數字：🎯 正確率、⚡ 總分、🔁 作答次數、👥 有做的人
 *   五個分頁：👤 個人｜🏆 排行榜｜🏫 班際｜❌ 錯題｜🔔 要關心
 *   密碼：網頁裡沒有，送去 Apps Script 比對（指令碼屬性 TEACHER_PW）；這個分頁關掉就要重新輸入（sessionStorage）
 * 算法全部用 score/_calc.js（跟 Apps Script 同一份）。
 * 2026-10-08 對話 D（使用者第 10 題）：加「類別」篩選（📝 複習題／🎮 遊戲／📘 Review 1）；錯題分析看得到遊戲的題目和選項；
 *   🃏 記憶配對（不算正確率、總分）在個人紀錄裡看配完幾對、用幾秒、翻錯幾次。
 */
module.exports = function (CALC, XL, BANK) {
  return `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>老師看板</title>
<!-- 本檔由 score/_build.js 產生，不要手改。 -->
<style>
@font-face{font-family:Andika;font-weight:400;src:url(../words/fonts/andika-400.woff2) format("woff2")}
@font-face{font-family:Andika;font-weight:700;src:url(../words/fonts/andika-700.woff2) format("woff2")}
:root{--bg:#000;--pn:#0B0B0B;--ln:#262626;--tx:#F2F2F2;--dim:#A8A8A8;--acc:#7FBFFF;--gold:#FFD24A;--ok:#5BE39A;--no:#FF7A7A;--bar:#4D8FCC}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;background:var(--bg);color:var(--tx);font-family:Andika,-apple-system,"PingFang TC","Noto Sans TC",sans-serif}
body{padding:calc(env(safe-area-inset-top) + 12px) 16px calc(env(safe-area-inset-bottom) + 24px)}
button,select,input{font-family:inherit;font-size:17px;color:var(--tx)}
button{background:#1A1A1A;border:1px solid #3A3A3A;border-radius:999px;padding:9px 18px;min-height:44px;cursor:pointer;font-weight:700}
button:active{transform:scale(.97)}
button.on{background:#0F2236;border-color:var(--acc)}
select,input{background:#141414;border:1px solid #3A3A3A;border-radius:12px;padding:8px 10px;min-height:44px}
h1{margin:0;font-size:clamp(24px,3.4vw,34px)}
#login{max-width:460px;margin:12vh auto 0;display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center}
#login input{font-size:28px;text-align:center;width:100%;letter-spacing:.2em}
#login button{font-size:22px;padding:12px 40px;background:#0F3323;border-color:var(--ok)}
#lmsg{min-height:1.4em;color:var(--no);font-weight:700;font-size:19px}
#app[hidden],#login[hidden]{display:none}
.top{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:12px}
.top .sp{flex:1}
.grp{display:inline-flex;gap:6px;flex-wrap:wrap;align-items:center}
.grp>span{color:var(--dim);font-weight:700}
#dl{background:#2A2208;border-color:var(--gold);color:#FFE9A8;font-size:19px}
.tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:8px 0 12px}
.tile{background:var(--pn);border:1px solid var(--ln);border-radius:18px;padding:12px 16px}
.tile .k{color:var(--dim);font-weight:700;font-size:17px}
.tile .v{font-size:clamp(32px,4.4vw,48px);font-weight:700;line-height:1.1}
.tile .d{color:var(--dim);font-size:14px}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.tabs button{font-size:19px;padding:10px 20px}
.tabs button.on{background:#2A2208;border-color:var(--gold);color:#FFE9A8}
.pane{background:var(--pn);border:1px solid var(--ln);border-radius:18px;padding:14px}
.note{color:var(--dim);font-size:15px;margin:6px 0}
.tw{overflow-x:auto;-webkit-overflow-scrolling:touch}
table{border-collapse:collapse;width:100%;font-size:16px}
th,td{padding:8px 10px;border-bottom:1px solid #1E1E1E;text-align:right;white-space:nowrap}
th{position:sticky;top:0;background:#151515;color:#DDD;cursor:pointer;user-select:none}
th:first-child,td:first-child{text-align:left}
th.s::after{content:' ▼';color:var(--gold)}
tr.row{cursor:pointer}tr.row:hover td,tr.row:active td{background:#141A20}
td .mb{display:inline-block;height:10px;border-radius:4px;background:var(--bar);vertical-align:middle;margin-left:6px}
td.lo{color:var(--no)}
.bars{display:flex;flex-direction:column;gap:8px;margin:6px 0 18px}
.br{display:grid;grid-template-columns:7.5em 1fr 6.5em;gap:10px;align-items:center;font-size:17px;font-weight:700}
.br .t{height:26px;background:#141414;border-radius:6px;overflow:hidden}
.br .t i{display:block;height:100%;background:var(--bar);border-radius:0 4px 4px 0}
.br.hi .t i{background:var(--gold)}.br.ok .t i{background:var(--ok)}.br.no .t i{background:var(--no)}
.br .v{text-align:right;color:#DDD}
.br .l{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
h3{margin:14px 0 6px;font-size:20px}
.wq{display:grid;grid-template-columns:2.2em 1fr 13em;gap:10px;align-items:center;padding:10px;border:1px solid #1E1E1E;border-radius:14px;margin-bottom:8px;cursor:pointer;font-size:17px}
.wq:active{background:#141A20}
.wq .n{font-size:22px;font-weight:700;color:var(--gold);text-align:center}
.wq .q{min-width:0}.wq .q b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wq .q em{font-style:normal;color:var(--dim);font-size:14px}
.wq .r .t{height:14px;background:#141414;border-radius:6px;overflow:hidden}.wq .r .t i{display:block;height:100%;background:var(--no)}
.wq .r span{font-weight:700}
#modal{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.86);display:none;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto}
#modal.on{display:flex}
#mbox{background:#0B0B0B;border:1px solid #333;border-radius:20px;padding:16px;width:min(900px,100%);margin:auto 0}
#mbox .x{float:right}
.opt{display:grid;grid-template-columns:2.2em 1fr 8em;gap:10px;align-items:center;font-size:19px;font-weight:700;margin:6px 0}
.opt .t{height:24px;background:#141414;border-radius:6px;overflow:hidden}.opt .t i{display:block;height:100%;background:#555}
.opt.ok .t i{background:var(--ok)}.opt.mis .t i{background:var(--no)}
.opt .w{grid-column:2/4;font-size:16px}
.why{background:#141A20;border:1px solid #2A3A4A;border-radius:14px;padding:10px 14px;font-size:18px;margin:10px 0}
#show{position:fixed;inset:0;z-index:60;background:#000;display:none;flex-direction:column;align-items:center;justify-content:center;gap:3vh;padding:4vh 5vw;text-align:center}
#show.on{display:flex}
#show .sq{font-size:clamp(30px,6vh,64px);font-weight:700;line-height:1.3}
#show .so{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2vh 2vw;width:min(1200px,92vw)}
#show .so div{background:#121212;border:3px solid #333;border-radius:22px;padding:2vh 2vw;font-size:clamp(24px,4.4vh,46px);font-weight:700;display:flex;flex-direction:column;gap:1vh}
#show .so div.ok{border-color:var(--ok);background:#0F3323}#show .so div.mis{border-color:var(--no)}
#show .so .pc{font-size:.7em;color:var(--gold)}
#show .sw{font-size:clamp(20px,3.4vh,34px);color:#CFE3F5;max-width:1100px}
#show .sb{display:flex;gap:14px}
#show .sb button{font-size:clamp(20px,3.2vh,30px);padding:12px 32px}
.svgl{width:100%;height:120px;background:#0E0E0E;border-radius:10px}
.att{font-size:15px}.att td,.att th{padding:5px 8px}
.att tr.void td{color:#666;text-decoration:line-through}
.att button{min-height:34px;padding:4px 12px;font-size:14px}
@media (max-width:900px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}.wq{grid-template-columns:2em 1fr}.wq .r{grid-column:2}}
</style></head><body>
<div id="login"><h1>👩‍🏫 老師看板</h1><div class="note">輸入老師密碼（密碼存在你的 Google Apps Script，網頁裡沒有）</div>
 <input id="pw" type="password" inputmode="numeric" autocomplete="current-password" aria-label="密碼"><button id="go">進入</button><div id="lmsg"></div></div>
<div id="app" hidden>
 <div class="top"><h1>👩‍🏫 老師看板</h1><span class="sp"></span>
  <button id="bd">🏆 學生排行榜：開</button><button id="rf">🔄 重新整理</button><button id="dl">⬇ 一鍵下載 Excel</button></div>
 <div class="top">
  <span class="grp" id="fg"><button data-g="3" class="on">三年級</button><button data-g="4">四年級</button></span>
  <span class="grp"><span>班級</span><select id="fc"></select></span>
  <span class="grp"><span>期間</span><select id="fp"><option value="w">本週</option><option value="lw">上週</option><option value="all">這學期全部</option><option value="c">自訂日期</option></select>
   <input type="date" id="f1" hidden><input type="date" id="f2" hidden></span>
  <span class="grp"><span>類別</span><select id="fk"><option value="">全部</option><option value="tq">📝 複習題</option><option value="game">🎮 遊戲</option><option value="r1">📘 Review 1</option></select></span>
  <span class="grp"><span>來源</span><select id="fs"><option value="">全部</option><option value="school">🏫 在校</option><option value="home">🏠 在家</option></select></span>
 </div>
 <div class="tiles" id="tiles"></div>
 <div class="tabs" id="tabs"><button data-t="p" class="on">👤 個人</button><button data-t="b">🏆 排行榜</button><button data-t="c">🏫 班際</button><button data-t="w">❌ 錯題</button><button data-t="k">🔔 要關心</button></div>
 <div class="pane" id="pane"></div>
</div>
<div id="modal"><div id="mbox"></div></div>
<div id="show"></div>
<script src="../score/url.js"></script>
<script>
${CALC}
${XL}
var BANK=${JSON.stringify(BANK)};
var URL0=String(window.SCORE_URL||'').trim(),PW='',DATA=null,ALL=[],SIZES={},F={g:3,cls:'',p:'w',src:'',cat:''},TAB='p',SORT={k:'acc',d:1},BT='acc',BS='grade';
function $(s){return document.querySelector(s)}function $$(s){return [].slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function f1(v){return v==null?'—':(Math.round(v*10)/10)}
function post(o){return fetch(URL0,{method:'POST',body:JSON.stringify(o)}).then(function(r){return r.json()})}
function login(pw){
  $('#lmsg').textContent='⏳ 讀取中…';
  if(!URL0){$('#lmsg').textContent='還沒有貼上 Apps Script 網址（score/url.js）';return}
  post({a:'teacher',pw:pw}).then(function(j){
    if(j.err==='pw'){$('#lmsg').textContent='❌ 密碼不對';try{sessionStorage.removeItem('tpw')}catch(e){}return}
    if(j.err){$('#lmsg').textContent='❌ 伺服器：'+(j.msg||j.err);return}
    PW=pw;try{sessionStorage.setItem('tpw',pw)}catch(e){}
    load(j);$('#login').hidden=true;$('#app').hidden=false;
  },function(){$('#lmsg').textContent='📶 連不到伺服器，請檢查網路'});
}
function load(j){DATA=j;SIZES=j.sizes||{};ALL=j.rows.map(SC.fromRow).filter(function(r){return r.id&&!isNaN(r.t)});
  $('#bd').textContent='🏆 學生排行榜：'+(j.boards?'開':'關');$('#bd').classList.toggle('on',!!j.boards);clsSel();draw()}
function clsSel(){$('#fc').innerHTML='<option value="">全部班</option>'+SC.CLASSES[F.g].map(function(c){return '<option value="'+c+'"'+(F.cls===c?' selected':'')+'>'+c+' 班</option>'}).join('')}
function range(){var now=DATA.now,w=SC.weekStart(now);
  if(F.p==='w')return{from:w,to:null};if(F.p==='lw')return{from:w-7*864e5,to:w};if(F.p==='all')return{from:null,to:null};
  var a=$('#f1').value,b=$('#f2').value;return{from:a?Date.parse(a+'T00:00:00+08:00'):null,to:b?Date.parse(b+'T00:00:00+08:00')+864e5:null}}
function sets(){var r=range(),G=SC.pick(ALL,{g:F.g,from:r.from,to:r.to,src:F.src,cat:F.cat}),C=F.cls?G.filter(function(x){return x.cls===F.cls}):G;return{G:G,C:C}}
/* 名次：班內（每班自己排）、全年級 */
function ranks(psG){var R={};['acc','s','count','prog'].forEach(function(k){
  SC.rank(psG,k).forEach(function(x){(R[x.id]=R[x.id]||{})['g'+k]=x.rk});
  SC.CLASSES[F.g].forEach(function(c){SC.rank(psG.filter(function(p){return p.cls===c}),k).forEach(function(x){(R[x.id]=R[x.id]||{})['c'+k]=x.rk})})});return R}
function draw(){
  var S=sets(),psG=SC.students(S.G),ps=F.cls?psG.filter(function(p){return p.cls===F.cls}):psG,RK=ranks(psG);
  var m=function(k){var a=ps.filter(function(p){return p[k]!=null}).map(function(p){return p[k]});return a.length?a.reduce(function(x,y){return x+y},0)/a.length:null};
  var cnt=0;ps.forEach(function(p){cnt+=p.count});
  var cs=F.cls?[F.cls]:SC.CLASSES[F.g],size=0;cs.forEach(function(c){size+=+SIZES[c]||0});
  $('#tiles').innerHTML=[['🎯 正確率',f1(m('acc')),'分（百分制）'],['⚡ 總分',f1(m('s')),'分（答對 60＋速度 40）'],['🔁 作答次數',cnt,'次（對 2/3 才算；遊戲要答 6 題以上）'],
    ['👥 有做的人',ps.length+(size?'／'+size:''),size?'人（參與率 '+Math.round(ps.length/size*100)+'%）':'人（班級人數在試算表「班級人數」填）']]
    .map(function(t){return '<div class="tile"><div class="k">'+t[0]+'</div><div class="v">'+t[1]+'</div><div class="d">'+t[2]+'</div></div>'}).join('');
  var h='';
  if(TAB==='p')h=paneP(ps,RK);else if(TAB==='b')h=paneB(psG);else if(TAB==='c')h=paneC(psG);else if(TAB==='w')h=paneW(S.C);else h=paneK(ps,S);
  $('#pane').innerHTML=h;
}
var PCOL=[['id','5碼'],['acc','🎯 正確率'],['s','⚡ 總分'],['count','🔁 次數'],['prog','🚀 進步'],['cacc','班內 🎯'],['cs','班內 ⚡'],['ccount','班內 🔁'],['cprog','班內 🚀'],
  ['gacc','年級 🎯'],['gs','年級 ⚡'],['gcount','年級 🔁'],['gprog','年級 🚀'],['sets','做了幾組'],['all','作答幾次'],['fix','✨ 訂正成功'],['fast','⚡ 秒按'],['last','最後作答']];
function rowOf(p,RK){var r=RK[p.id]||{};return{id:p.id,acc:p.acc,s:p.s,count:p.count,prog:p.prog,keep:p.keep,cacc:r.cacc,cs:r.cs,ccount:r.ccount,cprog:r.cprog,
  gacc:r.gacc,gs:r.gs,gcount:r.gcount,gprog:r.gprog,sets:p.sets,all:p.all,fix:p.fix,fast:p.q?Math.round(p.fastQ/p.q*100):0,last:p.last}}
function dt(t){var d=new Date(t+288e5);return (d.getUTCMonth()+1)+'/'+d.getUTCDate()+' '+('0'+d.getUTCHours()).slice(-2)+':'+('0'+d.getUTCMinutes()).slice(-2)}
function paneP(ps,RK){
  if(!ps.length)return '<div class="note">這段期間還沒有人作答。</div>';
  var L=ps.map(function(p){return rowOf(p,RK)}),k=SORT.k,low=/^[cg]/.test(k)&&k!=='count';
  L.sort(function(a,b){var x=a[k],y=b[k];if(x==null&&y==null)return a.id<b.id?-1:1;if(x==null)return 1;if(y==null)return -1;
    var asc=k==='id'||/^[cg](acc|s|count|prog)$/.test(k);return (asc?(x>y?1:x<y?-1:0):(y>x?1:y<x?-1:0))*SORT.d});
  return '<div class="note">點一個人看他每一組每一次的紀錄（可以把冒用的那一次「作廢」）。點欄位標題排序。</div><div class="tw"><table><thead><tr>'+
   PCOL.map(function(c){return '<th data-k="'+c[0]+'"'+(c[0]===k?' class="s"':'')+'>'+c[1]+'</th>'}).join('')+'</tr></thead><tbody>'+
   L.map(function(r){return '<tr class="row" data-id="'+r.id+'">'+PCOL.map(function(c){var v=r[c[0]];
     if(c[0]==='acc'||c[0]==='s')return '<td'+(v!=null&&v<60?' class="lo"':'')+'>'+f1(v)+'<span class="mb" style="width:'+(v||0)*.6+'px"></span></td>';
     if(c[0]==='prog')return '<td>'+(v==null?(r.keep?'🔥 保持滿分':'—'):(v>0?'＋':'')+f1(v)+'%')+'</td>';
     if(c[0]==='fast')return '<td'+(v>30?' class="lo"':'')+'>'+v+'%</td>';
     if(c[0]==='last')return '<td>'+dt(v)+'</td>';
     return '<td>'+(v==null?'—':esc(v))+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>';
}
var BN={acc:'🎯 正確率',s:'⚡ 總分',count:'🔁 作答次數',prog:'🚀 進步'};
function fmt(k,v){return k==='count'?v+' 次':k==='prog'?'＋'+f1(v)+'%':f1(v)+' 分'}
function paneB(psG){
  var h='<div class="top"><span class="grp">'+['acc','s','count','prog'].map(function(k){return '<button data-bt="'+k+'"'+(BT===k?' class="on"':'')+'>'+BN[k]+'</button>'}).join('')+'</span>'+
   '<span class="grp"><button data-bs="cls"'+(BS==='cls'?' class="on"':'')+'>🏫 班內</button><button data-bs="grade"'+(BS==='grade'?' class="on"':'')+'>🏆 全年級</button></span></div>'+
   '<div class="note">老師看得到全部學生的名次；學生只看得到前 10 名（自己不在前 10 名，只看到「再多幾分進前 10」）。</div>';
  var lists=BS==='grade'?[['全年級',SC.rank(psG,BT)]]:(F.cls?[F.cls]:SC.CLASSES[F.g]).map(function(c){return [c+' 班',SC.rank(psG.filter(function(p){return p.cls===c}),BT)]});
  lists.forEach(function(L){var mx=0;L[1].forEach(function(x){mx=Math.max(mx,x.v)});
    h+='<h3>'+L[0]+'</h3>'+(L[1].length?'<div class="bars">'+L[1].map(function(x){return '<div class="br'+(x.rk<=10?' hi':'')+'"><span class="l">第 '+x.rk+' 名　'+x.id+'</span><span class="t"><i style="width:'+(mx?x.v/mx*100:0)+'%"></i></span><span class="v">'+fmt(BT,x.v)+'</span></div>'}).join('')+'</div>':'<div class="note">還沒有人上榜。</div>')});
  return h;
}
function paneC(psG){
  var C=SC.classes(psG,F.g,SIZES),h='<div class="note">只跟同年級的班比（題目不一樣）。平均 ＝ 有做的人的平均；參與率要在試算表「班級人數」填人數。</div>';
  [['acc','🎯 平均正確率',100,function(v){return f1(v)+' 分'}],['s','⚡ 平均總分',100,function(v){return f1(v)+' 分'}],['count','🔁 作答總次數',0,function(v){return v+' 次'}],
   ['rate','👥 參與率',100,function(v){return v==null?'（沒填人數）':Math.round(v)+'%'}],['prog','🚀 平均進步',0,function(v){return v==null?'—':(v>0?'＋':'')+f1(v)+'%'}]].forEach(function(K){
    var vs=C.map(function(c){return K[0]==='rate'?(c.size?c.n/c.size*100:null):c[K[0]]}),mx=K[2]||Math.max.apply(null,vs.map(function(v){return Math.abs(v||0)}).concat([1]));
    h+='<h3>'+K[1]+'</h3><div class="bars">'+C.map(function(c,n){var v=vs[n];return '<div class="br'+(c.cls===F.cls?' hi':'')+'"><span class="l">'+c.cls+' 班（'+c.n+' 人）</span><span class="t"><i style="width:'+(v==null?0:Math.max(0,v)/mx*100)+'%"></i></span><span class="v">'+K[3](v)+'</span></div>'}).join('')+'</div>'});
  return h;
}
/* 題庫：三、四年級共用的（Review 1 遊戲）存成 g*r1_… */
function bankOf(set){return BANK[set]||BANK[String(set).replace(/^g\\d/,'g*')]||null}
function qOf(k){var a=k.split('#'),b=bankOf(a[0]);return b&&b.qs[+a[1]]?{set:b,q:b.qs[+a[1]]}:null}
function kn(q){return q.kn||KN[q.k]||''}
var KN={read:'👀 認讀',listen:'🎧 聽力',zh2en:'看中文選英文',en2zh:'看英文選中文',trap:'⚠️ 易錯'};
function qText(q){return q.k==='g'||q.k==='rv'?q.q:q.k==='read'?'「'+q.show+'」哪一個唸的是它？':q.k==='listen'?'🔊 '+q.say+'　'+q.q:q.q}
function paneW(R){
  var Q=SC.questions(R).filter(function(x){return x.bad>0&&qOf(x.k)}).slice(0,10);
  if(!Q.length)return '<div class="note">這段期間沒有答錯的題目 🎉</div>';
  return '<div class="note">'+(F.cls?F.cls+' 班':'全年級')+'最常錯的 10 題（答錯率高的在前面）。點一題看四個選項各有幾 % 的人選，再按〔📺 全班訂正〕投影。</div>'+
   Q.map(function(x,n){var o=qOf(x.k);return '<div class="wq" data-q="'+x.k+'"><span class="n">'+(n+1)+'</span><span class="q"><b>'+esc(qText(o.q))+'</b><em>'+esc(o.set.name)+'・第 '+(x.i+1)+' 題・'+kn(o.q)+'</em></span>'+
     '<span class="r"><span>答錯 '+x.rate+'%（'+x.bad+'／'+x.n+'）</span><span class="t"><i style="width:'+x.rate+'%"></i></span></span></div>'}).join('');
}
function paneK(ps,S){
  var r=range(),before=SC.students(SC.pick(ALL,{g:F.g,to:r.from,src:F.src}).filter(function(x){return !F.cls||x.cls===F.cls}));
  var now={};ps.forEach(function(p){now[p.id]=1});
  var gone=before.filter(function(p){return !now[p.id]}).map(function(p){return p.id});
  var low=ps.filter(function(p){return p.acc!=null&&p.acc<60}).sort(function(a,b){return a.acc-b.acc});
  var fast=ps.filter(function(p){return p.q&&p.fastQ/p.q>.3}).sort(function(a,b){return b.fastQ/b.q-a.fastQ/a.q});
  var li=function(L,f){return L.length?'<div class="bars">'+L.map(f).join('')+'</div>':'<div class="note">沒有 👍</div>'};
  return '<div class="note">這一頁只有老師看得到。沒有名單，所以「從來沒做過的人」看不到——對照上面的參與率。</div>'+
   '<h3>📭 以前做過、這段期間還沒做（'+gone.length+' 人）</h3>'+(r.from==null?'<div class="note">選「本週」「上週」或自訂日期才看得出來。</div>':(gone.length?'<div class="note" style="font-size:18px;color:#DDD">'+gone.join('、')+'</div>':'<div class="note">沒有 👍</div>'))+
   '<h3>🎯 平均正確率不到 60 分（'+low.length+' 人）</h3>'+li(low,function(p){return '<div class="br no"><span class="l">'+p.id+'</span><span class="t"><i style="width:'+p.acc+'%"></i></span><span class="v">'+f1(p.acc)+' 分</span></div>'})+
   '<h3>⚡ 秒按很多（1 秒內就按的題目超過 3 成）（'+fast.length+' 人）</h3>'+li(fast,function(p){var v=Math.round(p.fastQ/p.q*100);return '<div class="br no"><span class="l">'+p.id+'</span><span class="t"><i style="width:'+v+'%"></i></span><span class="v">'+v+'%</span></div>'});
}
/* 一個人：每一組每一次（折線圖＋表格）；作廢 */
function person(id){
  var r=range(),A=ALL.filter(function(x){return x.id===id&&x.g===F.g&&(r.from==null||x.t>=r.from)&&(r.to==null||x.t<r.to)&&(!F.src||x.src===F.src)}).sort(function(a,b){return a.t-b.t});
  var by={};A.forEach(function(x){if(!F.cat||SC.cat(x.set).k===F.cat)(by[x.set]=by[x.set]||[]).push(x)});
  var h='<button class="x" id="mx">✕ 關閉</button><h3 style="font-size:26px">🪑 '+id+'</h3><div class="note">每一組：正確率的變化（綠點 ＝ 算 1 次；灰色刪除線 ＝ 作廢）。遊戲的正確率只算每一題第一次作答。</div>';
  Object.keys(by).forEach(function(k){var L=by[k],n=L.length,W=600,H=120,pts=L.map(function(x,i){return [n>1?20+i*(W-40)/(n-1):W/2,H-12-((x.acc||0)/100)*(H-24),x]});
    var nm=esc((bankOf(k)||{}).name||L[L.length-1].name||k);
    /* 🃏 記憶配對：沒有正確率，只列配完幾對、用幾秒、翻錯幾次 */
    if(L[0].m==='mem'){h+='<h3>'+nm+'</h3><div class="tw"><table class="att"><tr><th>時間</th><th>✅ 配完幾對</th><th>⏱ 用幾秒</th><th>每對幾秒</th><th>🔁 翻錯幾次</th><th>來源</th><th>平板</th><th></th></tr>'+
      L.map(function(x){return '<tr'+(x.x?' class="void"':'')+'><td>'+dt(x.t)+'</td><td>'+x.mp+'</td><td>'+x.sec+'</td><td>'+(x.mp?f1(x.sec/x.mp):'—')+'</td><td>'+x.mw+'</td><td>'+(x.src==='home'?'🏠 在家':'🏫 在校')+'</td><td>'+esc(x.dev)+'</td>'+
        '<td><button data-void="'+esc(x.u)+'" data-v="'+(x.x?0:1)+'">'+(x.x?'↩ 恢復':'🚫 作廢')+'</button></td></tr>'}).join('')+'</table></div>';return}
    h+='<h3>'+nm+'</h3><svg class="svgl" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><line x1="0" x2="'+W+'" y1="'+(H-12-.6*(H-24))+'" y2="'+(H-12-.6*(H-24))+'" stroke="#333" stroke-dasharray="4 4"/>'+
     '<polyline fill="none" stroke="#7FBFFF" stroke-width="2" points="'+pts.filter(function(p){return !p[2].x}).map(function(p){return p[0]+','+p[1]}).join(' ')+'"/>'+
     pts.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="'+(p[2].x?'#555':SC.counts(p[2].ok,p[2].n,p[2].m)?'#5BE39A':'#FFB86B')+'"/>'}).join('')+'</svg>'+
     '<div class="tw"><table class="att"><tr><th>時間</th><th>正確率</th><th>總分</th><th>答對／題數</th><th>✨ 訂正</th><th>秒按</th><th>來源</th><th>平板</th><th></th></tr>'+
     L.map(function(x){return '<tr'+(x.x?' class="void"':'')+'><td>'+dt(x.t)+'</td><td>'+x.acc+'</td><td>'+f1(x.s)+'</td><td>'+x.ok+'／'+x.n+'</td><td>'+(x.fix||0)+'</td><td>'+x.fast+'／'+x.n+'</td><td>'+(x.src==='home'?'🏠 在家':'🏫 在校')+'</td><td>'+esc(x.dev)+'</td>'+
       '<td><button data-void="'+esc(x.u)+'" data-v="'+(x.x?0:1)+'">'+(x.x?'↩ 恢復':'🚫 作廢')+'</button></td></tr>'}).join('')+'</table></div>'});
  $('#mbox').innerHTML=h;$('#modal').classList.add('on');
}
function qDetail(k){
  var R=sets()[F.cls?'C':'G'],x=SC.questions(R).filter(function(z){return z.k===k})[0],o=qOf(k),q=o.q;
  var mis=-9,mv=0;[1,2,3].forEach(function(i){if((x.p[i]||0)>mv){mv=x.p[i];mis=i}});
  var h='<button class="x" id="mx">✕ 關閉</button><h3 style="font-size:24px">'+esc(qText(q))+'</h3><div class="note">'+esc(o.set.name)+'・第 '+(x.i+1)+' 題・'+kn(q)+'・'+x.n+' 人次作答'+(q.k==='g'?'（只算第一次作答）':'')+'</div>';
  h+=q.o.map(function(t,i){var c=x.p[i]||0,pc=Math.round(c/x.n*100);return '<div class="opt'+(i===0?' ok':i===mis?' mis':'')+'"><span>'+(i===0?'✅':i===mis?'❌':'　')+'</span><span>'+esc(t)+'</span><span>'+pc+'%（'+c+'）</span>'+
    '<span class="t" style="grid-column:2/4"><i style="width:'+pc+'%"></i></span>'+(i===mis?'<span class="w" style="color:var(--no)">最常見的誤會</span>':'')+'</div>'}).join('');
  if(x.p[-1])h+='<div class="note">⏰ 時間到沒有作答：'+x.p[-1]+' 人次</div>';
  h+='<div class="why">💡 為什麼：'+esc(q.h)+'</div><button id="sh" data-q="'+k+'" style="background:#2A2208;border-color:var(--gold);font-size:20px">📺 全班訂正（投影）</button>';
  $('#mbox').innerHTML=h;$('#modal').classList.add('on');
}
/* 📺 全班訂正：① 先讓全班猜 ➜ ② 亮出大家選什麼 ➜ ③ 公布正解並唸 3 次（R19：錯了馬上訂正最好記） */
var SH=null;
function say3(t){try{var s=window.speechSynthesis;s.cancel();for(var i=0;i<3;i++){var u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.85;s.speak(u)}}catch(e){}}
function show(k,st){
  var R=sets()[F.cls?'C':'G'],x=SC.questions(R).filter(function(z){return z.k===k})[0],o=qOf(k),q=o.q;SH={k:k,st:st};
  var mis=-9,mv=0;[1,2,3].forEach(function(i){if((x.p[i]||0)>mv){mv=x.p[i];mis=i}});
  var ord=SH.ord||(SH.ord=q.o.map(function(x,i){return i}).sort(function(){return Math.random()-.5}));
  $('#show').innerHTML='<div class="sq">'+esc(qText(q))+'</div><div class="so">'+ord.map(function(i,n){var pc=Math.round((x.p[i]||0)/x.n*100);
    return '<div class="'+(st>=2&&i===0?'ok':st>=2&&i===mis?'mis':'')+'"><span>'+'①②③④'.charAt(n)+' '+(q.k==='read'&&st<2?'🔊':esc(q.o[i]))+'</span>'+(st>=1?'<span class="pc">'+pc+'% 的人選這個</span>':'')+'</div>'}).join('')+'</div>'+
   (st>=2?'<div class="sw">✅ '+esc(q.o[0])+'　💡 '+esc(q.h)+'</div>':'<div class="sw">'+(st?'哪一個才對？':'先想一想：你會選哪一個？')+'</div>')+
   '<div class="sb">'+(st<2?'<button id="sn" style="background:#0F3323;border-color:var(--ok)">'+(st?'✅ 公布正解':'👀 看大家選什麼')+'</button>':'<button id="ss">🔊 再唸 3 次</button>')+'<button id="sc">✕ 結束</button></div>';
  $('#show').classList.add('on');
  if(st===2&&q.sp!=='')say3(q.sp||q.say||q.o[0]);
}
/* ⬇ 一鍵下載 Excel：五張工作表 */
function excel(){
  var S=sets(),psG=SC.students(S.G),ps=F.cls?psG.filter(function(p){return p.cls===F.cls}):psG,RK=ranks(psG);
  var P=[PCOL.map(function(c){return c[1]})].concat(ps.map(function(p){var r=rowOf(p,RK);return PCOL.map(function(c){var v=r[c[0]];
    return c[0]==='last'?dt(v):c[0]==='fast'?v/100:c[0]==='prog'&&v==null&&r.keep?'保持滿分':v==null?'':v})}));
  var B=[['榜','範圍','名次','5碼','分數']];['acc','s','count','prog'].forEach(function(k){
    SC.rank(psG,k).forEach(function(x){if(!F.cls||x.cls===F.cls)B.push([BN[k],'全年級',x.rk,x.id,x.v])});
    (F.cls?[F.cls]:SC.CLASSES[F.g]).forEach(function(c){SC.rank(psG.filter(function(p){return p.cls===c}),k).forEach(function(x){B.push([BN[k],c+' 班',x.rk,x.id,x.v])})})});
  var C=[['班級','有做的人','班級人數','參與率','平均正確率','平均總分','作答總次數','平均進步']].concat(SC.classes(psG,F.g,SIZES).map(function(c){
    return [c.cls,c.n,c.size||'',c.size?Math.round(c.n/c.size*100)/100:'',c.acc==null?'':c.acc,c.s==null?'':c.s,c.count,c.prog==null?'':c.prog]}));
  var W=[['題組','第幾題','題型','題目','正確答案','答錯率','答錯','作答人次','選正解','選項 2','選項 2 人次','選項 3','選項 3 人次','選項 4','選項 4 人次','時間到','為什麼']];
  SC.questions(S.C).forEach(function(x){var o=qOf(x.k);if(!o)return;var q=o.q;W.push([o.set.name,x.i+1,kn(q),qText(q),q.o[0],x.rate/100,x.bad,x.n,x.p[0]||0,q.o[1],x.p[1]||0,q.o[2],x.p[2]||0,q.o[3],x.p[3]||0,x.p[-1]||0,q.h])});
  var r=range(),RAW=[SC.COLS].concat(ALL.filter(function(x){return x.g===F.g&&(!F.cls||x.cls===F.cls)&&(r.from==null||x.t>=r.from)&&(r.to==null||x.t<r.to)&&(!F.src||x.src===F.src)&&(!F.cat||SC.cat(x.set).k===F.cat)})
    .sort(function(a,b){return a.t-b.t}).map(function(x){var row=SC.toRow(x);row[0]=dt(x.t);row[SC.CI['題組名稱']]=(bankOf(x.set)||{}).name||x.name;
      row[SC.CI['來源']]=x.src==='home'?'在家':'在校';row[SC.CI['作廢']]=x.x?'作廢':'';return row}));
  var b=XLSX.make([{name:'個人',rows:P},{name:'排行榜',rows:B},{name:'班際',rows:C},{name:'錯題',rows:W},{name:'原始紀錄',rows:RAW}]);
  /* 檔名只用英文和數字：有些瀏覽器（量測用的 Chromium）遇到中文檔名會改成 download */
  var pn={w:'week',lw:'lastweek',all:'all',c:'custom'}[F.p],d=new Date(DATA.now+288e5).toISOString().slice(0,10);
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([b],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  a.download='score_G'+F.g+(F.cls?'_'+F.cls:'')+'_'+pn+'_'+d+'.xlsx';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000);
  window.LASTXLSX=b;
}
document.addEventListener('click',function(e){var t=e.target,c=function(s){return t.closest?t.closest(s):null},b;
  if(c('#go')){login($('#pw').value.trim());return}
  if((b=c('#fg button'))){F.g=+b.getAttribute('data-g');F.cls='';$$('#fg button').forEach(function(x){x.classList.toggle('on',x===b)});clsSel();draw();return}
  if((b=c('#tabs button'))){TAB=b.getAttribute('data-t');$$('#tabs button').forEach(function(x){x.classList.toggle('on',x===b)});draw();return}
  if((b=c('th[data-k]'))){var k=b.getAttribute('data-k');SORT={k:k,d:SORT.k===k?-SORT.d:1};draw();return}
  if((b=c('tr.row'))){person(b.getAttribute('data-id'));return}
  if((b=c('[data-bt]'))){BT=b.getAttribute('data-bt');draw();return}
  if((b=c('[data-bs]'))){BS=b.getAttribute('data-bs');draw();return}
  if((b=c('.wq'))){qDetail(b.getAttribute('data-q'));return}
  if(c('#mx')||t.id==='modal'){$('#modal').classList.remove('on');return}
  if((b=c('#sh'))){$('#modal').classList.remove('on');SH={};show(b.getAttribute('data-q'),0);return}
  if(c('#sn')){show(SH.k,SH.st+1);return}
  if(c('#ss')){var o=qOf(SH.k);if(o.q.sp!=='')say3(o.q.sp||o.q.say||o.q.o[0]);return}
  if(c('#sc')){$('#show').classList.remove('on');SH=null;try{speechSynthesis.cancel()}catch(x){}return}
  if((b=c('[data-void]'))){var u=b.getAttribute('data-void'),v=b.getAttribute('data-v')==='1';b.disabled=true;
    post({a:'void',pw:PW,u:u,v:v}).then(function(j){if(j.ok){ALL.forEach(function(x){if(x.u===u)x.x=v});var id=($('#mbox h3')||{}).textContent.replace(/\\D/g,'');draw();person(id)}else b.disabled=false},function(){b.disabled=false});return}
  if(c('#bd')){var on=!DATA.boards;post({a:'set',pw:PW,boards:on}).then(function(j){if(j.ok){DATA.boards=j.boards;$('#bd').textContent='🏆 學生排行榜：'+(j.boards?'開':'關');$('#bd').classList.toggle('on',j.boards)}});return}
  if(c('#rf')){post({a:'teacher',pw:PW}).then(load);return}
  if(c('#dl')){excel();return}
});
$('#fc').addEventListener('change',function(){F.cls=this.value;draw()});
$('#fs').addEventListener('change',function(){F.src=this.value;draw()});
$('#fk').addEventListener('change',function(){F.cat=this.value;draw()});
$('#fp').addEventListener('change',function(){F.p=this.value;$('#f1').hidden=$('#f2').hidden=F.p!=='c';draw()});
$('#f1').addEventListener('change',draw);$('#f2').addEventListener('change',draw);
$('#pw').addEventListener('keydown',function(e){if(e.key==='Enter')login(this.value.trim())});
try{var sp=sessionStorage.getItem('tpw');if(sp)login(sp)}catch(e){}
</script>
</body></html>`;
};
