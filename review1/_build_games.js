/* review1/_build_games.js — Review 1 遊戲（review1/games.html，三、四年級共用）
 *   node review1/_build_games.js
 *
 * 遊戲引擎、計分、驚喜卡、答錯頁 100% 用 sentences/ 的句型遊戲（sentences/_build_games.js，使用者 2026-10-02 指定，不另寫一套）：
 * 這裡只是設好 SITE_DIR ＝ review1、題庫在 review1/_game_data.js，讓引擎把 games.html 寫進這個資料夾，
 * 然後補上 Review 1 才需要的幾個地方（PATCH：找得到才換，找不到 build 就失敗——引擎改了要回來對一次）：
 *  - 22 個遊戲、5 種玩法：遊戲代號 i1_1、a2_8…（gid），玩法 g1～g10（g）：題庫、驚喜卡、最佳紀錄跟著 gid，畫面跟著 g
 *  - 大廳分五區（物品 1、物品 2、活動 1、活動 2、進階）
 *  - 選項和題目都有圖示（看圖選英文的選項不放圖示，看英文選圖的選項 ＝ 圖示＋中文）
 *  - 記憶配對：圖卡（圖示＋中文）配英文，翻開圖卡唸中文
 *  - 語序：同一句有兩個 to（go to an amusement park）時，先點哪一個 to 都算對
 *  - 填空：句點緊接空格（I like ＿＿.）
 *  - 答錯頁：逐字中文照字卡（play the piano 的 play ＝ 彈、the 下面空白）、Pokémon 的 é 不會掉、
 *    加分題只用「確定錯」的變形（不換名字／職業：cook 在這裡是做菜，不是廚師）
 *  - 發音：英文先查 review1/audio/（Kokoro 美式女聲），查不到才用瀏覽器語音
 */
const fs = require('fs'), path = require('path');
process.env.SITE_DIR = __dirname;
const GD = require('./_game_data');
require('../sentences/_build_games');            /* ← 引擎把 games.html 寫進 review1/ */

const FP = path.join(__dirname, 'games.html');
let h = fs.readFileSync(FP, 'utf8');
const J = JSON.stringify;

/* 一個字放錯以後「其實也對」的句子：加分題的變形不可以出現這些 */
const VALID = ['I like dance.', 'I like to juice.', 'I like to milk.', 'He likes to juice.', 'He likes to milk.'];
const PHR = GD.PHR.slice().sort((a, b) => b[0].length - a[0].length);
const TY = {}; GD.GAMES.forEach(m => { TY[m.id] = m.ty; });

const RT = `/* ══ Review 1（review1/_build_games.js 補上的）══ */
var gid=null,TY=${J(TY)},SEC=${J(GD.SEC)},DESC=${J(GD.DESC)},OIC=${J(GD.OIC)},OZH=${J(GD.OZH)},R1PHR=${J(PHR)},R1VALID=${J(VALID)};
/* 選項：看英文選圖 ➜ 圖示＋中文；看圖選英文 ➜ 只有英文；其他 ➜ 圖示＋英文 */
function oX(x){
  if(cur&&cur.pic)return '<span class="opic"><span class="oi">'+(OIC[x]||'')+'</span><span class="oz">'+(OZH[x]||'')+'</span></span>';
  return '<span>'+((cur&&cur.ni)||!OIC[x]?'':'<span class="oi">'+OIC[x]+'</span>')+ap(x)+'</span>'}
/* 整句的選項太長（He can play the piano, and I can play the piano.）➜ 一列一個，字才夠大 */
function oOne(o){for(var i=0;i<o.length;i++)if(String(o[i].x).length>24)return ' one';return ''}
function r1Lab(v){return v==='n'?'I like ___（東西）':'I like to ___（動作）'}
/* 加分題（同一題換個樣子）：Review 1 自己的轉法 */
function r1Mcq(c){
  if(g==='g1'&&c.pic)return {q:c.q2,o:c.o,h:c.h};
  if(g==='g9')return {q:(OIC[c[0]]?'<span class="qic">'+OIC[c[0]]+'</span>':'')+'「'+c[0]+'」<br>要放哪一邊？',say:c[0],
    o:[r1Lab(c[1]),r1Lab(c[1]==='n'?'v':'n')],h:c[2],nm:1};
  if(g==='g8')return {q:ap(c.b)+' <span style="color:var(--be)">＿＿</span>'+(/^[.?!,]/.test(c.a)?'':' ')+ap(c.a)+'<br>'+c.zh,o:c.o,h:c.h};
  if(g==='g3'){ /* 錯的語序只放「確定錯」的三種 */
    var s=c.s.slice(0,-1),p=c.s[c.s.length-1],v=s.slice(3),J=function(a){return joinS(a.concat([p]))};
    var o=[J(s),J(['I','to','like'].concat(v)),J(['I','like'].concat(v).concat(['to']))];
    o.push(v.length>1?J(['I','like','to'].concat(v.slice(1)).concat([v[0]])):J(['I'].concat(v).concat(['like','to'])));
    return {q:c.zh+'<br>哪一句的順序對？',o:o,h:c.h,nm:1}}
  return null}
/* 答錯頁：Pokémon 的 é 也算字母 */
gUnits=function(s){s=String(s);var r=[],re=/[A-Za-z\\u00C0-\\u00FF]+n[\\u2019']t\\b|[A-Za-z\\u00C0-\\u00FF]+|[\\u2019'][A-Za-z]+|[?.!,]/g,m;
  while((m=re.exec(s)))r.push({t:m[0],s:m.index,e:m.index+m[0].length});return r};
/* 答錯頁的逐字中文：片語照字卡（play the piano ➜ 彈／（空白）／鋼琴；play basketball ➜ 打／籃球） */
mGloss=function(ans,bad){
  var gk=gHash(ans),U=gUnits(ans),K=U.map(function(u){return gKey(u.t)}),Z=[],h='',
   hit=function(u){if(!bad)return false;for(var i=0;i<bad.length;i++)if(u.s<bad[i].e&&u.e>bad[i].s)return true;return false};
  R1PHR.forEach(function(p){var L=p[0];for(var i=0;i+L.length<=K.length;i++){var ok=1,j;
    for(j=0;j<L.length;j++)if(K[i+j]!==L[j]||Z[i+j]!=null){ok=0;break}
    if(ok)for(j=0;j<L.length;j++)Z[i+j]=p[1][j]}});
  U.forEach(function(u,i){
    if(/^[?.!,]$/.test(u.t)){h+='<span class="gw gp"><b>'+u.t+'</b><i>&nbsp;</i></span>';return}
    var z=Z[i]!=null?Z[i]:gZh(u.t);
    h+='<span class="gw'+(/^['\\u2019]/.test(u.t)?' gc':'')+'" data-g="'+gk+'" data-s="'+u.s+'" data-e="'+u.e+'"><b'+(hit(u)?' class="f"':'')+'>'+ap(mEsc(u.t))+'</b><i>'+(z?mEsc(z):'&nbsp;')+'</i></span>'});
  return h};
/* 加分題的變形：只換「確定錯」的地方（to 有沒有、like／likes、can 加 s、and／but、can’t 後面），不換名字和職業 */
mSwapIn=function(){return null};
mMuts=function(c){var o=[],R=[[/^I like to /,'I like '],[/^I like (?!to )/,'I like to '],[/^I like /,'I likes '],[/^He likes /,'He like '],
  [/^He likes /,'His likes '],[/^He can /,'He cans '],[/, and I can /,', but I can '],[/^I can\\u2019t /,'I don\\u2019t can '],[/^I can\\u2019t /,'I can\\u2019t to ']];
  R.forEach(function(r){if(r[0].test(c)){var x=c.replace(r[0],r[1]);if(x!==c&&R1VALID.indexOf(x)<0)o.push(x)}});return shuf(o)};
`;

const PATCH = [
  /* 發音：英文先查 Review 1 的語音檔 */
  ['<script src="audio/aud.js"></script>\n', '<script src="audio/aud.js"></script>\n<script>window.AUD=window.ENAUD;</script>\n'],
  ['<title>複習遊戲 10 種｜英文句型</title>', '<title>' + GD.R1.title + '</title>'],
  ['<h1>🎮 複習遊戲　10 種玩法</h1>', '<h1>' + GD.R1.h1 + '</h1>'],
  ['<a href="index.html">🏠 首頁</a>', '<a href="index.html">🔤 單字首頁</a>\n <a href="../index.html">🏠 總首頁</a>'],
  ['var BANK=', RT + 'var BANK='],
  /* 遊戲代號 gid ≠ 玩法 g */
  ['function begin(id){\n  g=id;ended=false;', 'function begin(id){\n  gid=id;g=TY[id]||id;ended=false;'],
  ['if(!queue.length)queue=shuf(BANK[g].slice());', 'if(!queue.length)queue=shuf(BANK[gid].slice());'],
  ['simRank(c,BANK[g],itxt,', 'simRank(c,BANK[gid],itxt,'],
  ['var four=shuf(BANK.g6).slice(0,4);', 'var four=shuf(BANK[gid]).slice(0,4);'],
  ['function draw1(){if(!pool.length)pool=shuf((SURP[g]||[]).slice());', 'function draw1(){if(!pool.length)pool=shuf((SURP[gid]||[]).slice());'],
  ["var b=store('best_'+g)||0;\n  if(score>b){store('best_'+g,score);", "var b=store('best_'+gid)||0;\n  if(score>b){store('best_'+gid,score);"],
  ["$('#retry').addEventListener('click',function(){begin(g)});", "$('#retry').addEventListener('click',function(){begin(gid)});"],
  /* 大廳分五區 */
  ["$('#grid').innerHTML=META.map(function(m,n){\n    var b=store('best_'+m.id)||0;\n    return '<button class=\"gcard\"",
   "$('#grid').innerHTML=META.map(function(m,n){\n    var b=store('best_'+m.id)||0;\n    var hd=(!n||META[n-1].sec!==m.sec)?'<h2 class=\"gsec\">'+SEC[m.sec]+'<span>'+DESC[m.sec]+'</span></h2>':'';\n    return hd+'<button class=\"gcard\""],
  /* 分類大師：答錯頁的正確答案 ＝ 整句（I like pizza.） */
  ['if(g===\'g9\')return {q:c[0],pick:PICK,ans:LAB9[c[1]]};', 'if(g===\'g9\')return {q:(OIC[c[0]]?\'<span class="qic">\'+OIC[c[0]]+\'</span>\':\'\')+c[0],pick:PICK,ans:c[3]};'],
  ['function toMcq(c){\n', 'function toMcq(c){\n  var r1=r1Mcq(c);if(r1)return r1;\n'],
  /* 填空：句點緊接空格 */
  ["＿＿</span> '+ap(cur.a)", "＿＿</span>'+(/^[.?!,]/.test(cur.a)?'':' ')+ap(cur.a)"],
  /* 分類大師的字前面放圖示 */
  ["'\">'+ap(cur[0])+'</div>'", "'\">'+(OIC[cur[0]]?'<span class=\"oi\">'+OIC[cur[0]]+'</span>':'')+ap(cur[0])+'</div>'"],
  /* 記憶配對：圖卡翻開唸中文 */
  ['four.forEach(function(p,n){cards.push({k:n,s:p[0],en:1});cards.push({k:n,s:p[1],en:0})});',
   'four.forEach(function(p,n){cards.push({k:n,s:p[0],en:1});cards.push({k:n,s:p[1],en:0,z:p[2]})});'],
  ["'\" data-s=\"'+String(c.s).replace(/\"/g,'&quot;')+'\">？</button>'", "'\" data-z=\"'+(c.z||'')+'\" data-s=\"'+String(c.s).replace(/\"/g,'&quot;')+'\">？</button>'"],
  ["else sayZh(b.getAttribute('data-s'));", "else sayZh(b.getAttribute('data-z')||b.getAttribute('data-s'));"],
  /* 記憶配對的說明：圖配英文 */
  ["'<div class=\"qs\">翻開兩張，英文配中文</div>'", "'<div class=\"qs\">翻開兩張，圖配英文</div>'"],
  /* 語序：兩個一樣的字（to），先點哪一個都算對 */
  ['if(n===got.length){', 'if(n===got.length||need[n]===need[got.length]){']
];
/* 每一種四選一的選項：圖示（oX）、太長就一列一個（oOne） */
const MANY = [
  ["'</span><span>'+ap(t.x)+'</span></button>'", "'</span>'+oX(t.x)+'</button>'", 5],
  ["'<div class=\"opts\">'+o.map(", "'<div class=\"opts'+oOne(o)+'\">'+o.map(", 5]
];

const CSS = `
/* ── Review 1 ── */
.r1i{width:1em;height:1em;vertical-align:-.12em}
.gsec{grid-column:1/-1;margin:clamp(6px,1.2vh,14px) 0 0;font-size:clamp(20px,3.4vh,32px);font-weight:700;color:var(--gold);
 display:flex;align-items:baseline;gap:.6em;flex-wrap:wrap;border-bottom:1px solid #2A2A2A;padding-bottom:4px}
.gsec span{font-size:.55em;color:var(--dim);font-weight:400}
.qic{display:block;font-size:clamp(70px,15vh,150px);line-height:1.05;text-align:center}
.qic.s{display:inline-block;font-size:1.25em;vertical-align:-.18em;margin-right:.25em}
.qz{display:block;font-size:clamp(24px,4.4vh,44px);color:var(--acc);text-align:center}
.qen{display:block;font-size:clamp(46px,10vh,100px);text-align:center}
.oi{display:inline-block;margin-right:.3em;font-size:1.1em;line-height:1}
.opic{display:flex;align-items:center;gap:.4em}
.opic .oi{font-size:1.6em;margin:0}
.opic .oz{font-size:.85em}
.oi .r1i,.qic .r1i{width:1.2em;height:1.2em}
.mpic{display:flex;flex-direction:column;align-items:center;gap:.15em}
.mc .oi{font-size:2em;margin:0}
.mc .oz{font-size:.8em;color:var(--body)}
/* 魔王題：圖示小一點、整句選項一列一個也要放得下（1024×768 不用捲動） */
#arena .qh{margin:0}   /* h2 預設上下各留 0.83em，魔王題會被擠到按鈕列下面 */
#boss~.qh .qic{font-size:clamp(44px,8vh,90px)}
#boss~.qh .qz{font-size:clamp(20px,3.6vh,38px)}
.opts.one .o{font-size:clamp(20px,4vh,40px);min-height:clamp(46px,7vh,76px);padding-top:clamp(5px,1vh,12px);padding-bottom:clamp(5px,1vh,12px)}
#miss .qic{font-size:clamp(46px,8vh,80px)}
`;

let n = 0;
PATCH.forEach(([a, b]) => {
  const k = h.split(a).length - 1;
  if (k !== 1) throw new Error('review1 遊戲：引擎的程式變了，「' + a.slice(0, 50) + '」出現 ' + k + ' 次（要 1 次）');
  h = h.replace(a, () => b); n++;
});
MANY.forEach(([a, b, c]) => {
  const k = h.split(a).length - 1;
  if (k !== c) throw new Error('review1 遊戲：「' + a.slice(0, 50) + '」出現 ' + k + ' 次（要 ' + c + ' 次）');
  h = h.split(a).join(b); n++;
});
if (h.split('</style>').length - 1 < 1) throw new Error('review1 遊戲：找不到 </style>');
h = h.replace('</style>', () => CSS + '</style>');
fs.writeFileSync(FP, h, 'utf8');
console.log('review1 遊戲：' + GD.GAMES.length + ' 個（' + GD.GAMES.map(g => g.id + ' ' + g.n).join('／') + '），補了 ' + n + ' 處');
