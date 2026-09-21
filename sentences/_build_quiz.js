/* sentences/_build_quiz.js — 暖身 22 題（warmup.html）
 * node sentences/_build_quiz.js
 * 題目改 _quiz_data.js，版面改這裡。
 *
 * 使用者指定的規則，全部實作在這一頁：
 *  - 老師按按鈕決定要不要先做（開場閘門）
 *  - 每題倒數 50 秒，秒數大到最後一排看得見
 *  - 前 20 秒小組討論，選項鎖住；時間到自動解鎖；老師可「✋ 提前作答」
 *  - 老師可以「⏸ 暫停」倒數
 *  - 答錯用秒懂方式說明原因，而且收進錯題庫，最後再考一次（選項順序改變）
 *  - 6 題挑戰題答對 分數 ✕ 2
 *  - 聽力題有 🔊 再聽一次
 */
const fs = require('fs'), DIR = __dirname;
const S = require('./_shared');
const { Q, shuffle } = require('./_quiz_data');

/* 固定種子打散題序與選項，每次 build 出來一樣，老師對答案不會亂 */
const BUILT = shuffle(Q, 20260920).map((q, n) => {
  const idx = shuffle([0, 1, 2, 3], 7717 + n * 13);
  return {
    t: q.t, q: q.q, say: q.say || '', why: q.why, x2: !!q.x2,
    o: idx.map(k => q.o[k]),
    a: idx.indexOf(0)
  };
});

const CSS = `
#stage{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;
 justify-content:center;
 padding:calc(var(--safeT) + clamp(84px,13.5vh,124px)) clamp(14px,3vw,40px)
         calc(var(--barH,60px) + var(--safeB) + clamp(6px,1vh,12px)) clamp(14px,3vw,40px)}

/* 閘門 */
#gate{display:flex;flex-direction:column;align-items:center;gap:clamp(10px,2vh,20px);text-align:center}
#gate h1{margin:0;font-size:clamp(28px,5.6vh,54px);font-weight:700}
#gate p{margin:0;font-size:clamp(14px,2.3vh,22px);color:var(--dim);line-height:1.6;max-width:36ch}
#gate .btns{display:flex;flex-wrap:wrap;gap:clamp(8px,1.6vh,16px);justify-content:center;margin-top:clamp(6px,1.4vh,14px)}
.big{background:var(--btn);border:1px solid var(--line);border-radius:16px;color:var(--fg);
 font-size:clamp(16px,2.8vh,27px);font-weight:700;padding:clamp(11px,2vh,20px) clamp(18px,3vw,38px)}
.big.go{background:#123A26;border-color:var(--ok);color:#EAFFF3}
.big:active{transform:scale(.97)}

/* 上排 HUD */
#hud{position:fixed;top:0;left:0;right:0;z-index:20;display:none;
 align-items:center;justify-content:space-between;
 height:calc(var(--safeT) + clamp(80px,12.5vh,116px));
 padding:var(--safeT) calc(var(--safeR) + clamp(12px,2.6vw,30px)) 0 calc(var(--safeL) + clamp(12px,2.6vw,30px))}
#hud.on{display:flex}
.hcell{display:flex;flex-direction:column;gap:2px;min-width:clamp(88px,15vw,170px)}
.hcell .k{font-size:clamp(10.5px,1.5vh,13px);color:#5C5C5C;letter-spacing:.14em}
.hcell .v{font-size:clamp(17px,2.9vh,28px);font-weight:700}
.hcell.r{align-items:flex-end;text-align:right}
#streak{color:var(--gold)}

/* 倒數：大圓環 ＋ 大數字 */
#ring{position:relative;width:clamp(66px,10.6vh,104px);height:clamp(66px,10.6vh,104px);flex:0 0 auto}
#ring svg{width:100%;height:100%;transform:rotate(-90deg)}
#ring circle{fill:none;stroke-width:7;stroke-linecap:round}
#rbg{stroke:#1C1C1C}
#rfg{stroke:var(--ok);transition:stroke-dashoffset .28s linear,stroke .3s}
#rnum{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
 font-size:clamp(24px,4.1vh,40px);font-weight:700;line-height:1}
#ring.warn #rfg{stroke:var(--be)} #ring.warn #rnum{color:var(--be)}
#ring.dang #rfg{stroke:var(--no)} #ring.dang #rnum{color:var(--no);animation:thump .5s infinite}
#ring.pause #rfg{stroke:#555} #ring.pause #rnum{color:#777;animation:none}
@keyframes thump{0%,100%{transform:scale(1)}50%{transform:scale(1.16)}}

/* 題目 */
#quiz{display:none;flex-direction:column;align-items:center;width:100%;max-width:1080px;gap:clamp(8px,1.6vh,18px)}
#quiz.on{display:flex}
#badge{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center}
.tag{font-size:clamp(11px,1.7vh,15px);letter-spacing:.1em;color:var(--acc);
 border:1px solid #2C3A48;border-radius:999px;padding:4px 12px}
.tag.x2{color:var(--gold);border-color:#5A4A18;background:#1A1508;font-weight:700}
.tag.rev{color:var(--no);border-color:#4A1F1F;background:#1A0A0A}
#qt{font-size:clamp(21px,4vh,38px);font-weight:700;text-align:center;line-height:1.4;
 max-width:30ch}
#qt .ap{color:var(--ap)}
#playQ{background:var(--btn);border:1px solid var(--line);border-radius:999px;color:var(--fg);
 font-size:clamp(15px,2.5vh,24px);font-weight:700;padding:clamp(9px,1.6vh,16px) clamp(16px,2.6vw,32px)}
#playQ:active{transform:scale(.96);border-color:var(--acc)}
#playQ.ping{animation:ping 1.1s infinite}
@keyframes ping{0%,100%{box-shadow:0 0 0 0 rgba(159,180,200,.4)}50%{box-shadow:0 0 0 12px rgba(159,180,200,0)}}

#opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(7px,1.3vh,14px);
 width:100%;margin-top:clamp(2px,.8vh,8px)}
.opt{display:flex;align-items:center;gap:clamp(8px,1.4vw,16px);text-align:left;
 background:#0C0C0C;border:1px solid #262626;border-radius:16px;color:var(--fg);
 font-size:clamp(16px,2.65vh,27px);line-height:1.3;
 padding:clamp(10px,1.85vh,20px) clamp(12px,1.8vw,24px);min-height:clamp(54px,8.4vh,88px);
 transition:background .15s,border-color .15s,opacity .2s}
.opt .sh{font-size:.82em;flex:0 0 auto;width:1.3em;text-align:center}
.opt.s0 .sh{color:#FF5E5E}.opt.s1 .sh{color:#F5B301}.opt.s2 .sh{color:#39D98A}.opt.s3 .sh{color:#5AA9FF}
.opt:active{transform:scale(.985)}
#opts.lock .opt{opacity:.34;pointer-events:none}
.opt.ok{background:#0F3323;border-color:var(--ok)}
.opt.bad{background:#3A1111;border-color:var(--no)}
.opt.dim{opacity:.3}
#lockmsg{font-size:clamp(13px,2.1vh,20px);color:var(--be);letter-spacing:.06em;
 display:none;align-items:center;gap:8px}
#lockmsg.on{display:flex}

/* 回饋 */
#fb{display:none;flex-direction:column;align-items:center;gap:clamp(6px,1.2vh,12px);
 width:100%;max-width:960px}
#fb.on{display:flex}
#fbh{font-size:clamp(19px,3.3vh,32px);font-weight:700}
#fbh.ok{color:var(--ok)}#fbh.no{color:var(--no)}
#why{font-size:clamp(14px,2.35vh,23px);color:var(--body);line-height:1.6;text-align:center;
 background:#0B0B0B;border:1px solid #242424;border-radius:14px;
 padding:clamp(9px,1.7vh,18px) clamp(12px,2vw,24px);max-width:44ch}
#why b{color:var(--gold);font-weight:700}
#why .ap{color:var(--ap)}
.shake{animation:shake .42s}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-11px)}
 40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(4px)}}

/* 結算 */
#end{display:none;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,16px);text-align:center}
#end.on{display:flex}
#end h1{margin:0;font-size:clamp(26px,5vh,48px)}
#end .sc{font-size:clamp(38px,7.6vh,78px);font-weight:700;color:var(--gold);line-height:1}
#end .ln{font-size:clamp(14px,2.3vh,22px);color:var(--dim)}
`;

const JS = `
var QS=__Q__, SHAPE=['▲','◆','●','■'];
var order=[],qi=0,score=0,streak=0,best=0,right=0,wrongBank=[],revRound=false,answered=false;
var T=50,LOCK=20,left=T,locked=true,paused=false,tick=null;

var R=2*Math.PI*46;
$('#rfg').setAttribute('stroke-dasharray',R);

function start(){
  order=QS.map(function(_,n){return n});
  qi=0;score=0;streak=0;best=0;right=0;wrongBank=[];revRound=false;
  $('#gate').style.display='none';$('#hud').classList.add('on');$('#quiz').classList.add('on');
  ask();
}
function cur(){return revRound?wrongBank[qi]:QS[order[qi]]}
function total(){return revRound?wrongBank.length:QS.length}

function ask(){
  answered=false;locked=true;paused=false;left=T;
  var q=cur();
  $('#fb').classList.remove('on');$('#quiz').classList.add('on');
  $('#qn').textContent=(qi+1)+' / '+total();
  $('#sc').textContent=score;
  $('#streak').textContent=streak?'🔥 '+streak:'—';
  var tags='';
  if(revRound)tags+='<span class="tag rev">🔁 錯題再戰</span>';
  if(q.x2)tags+='<span class="tag x2">⭐ 挑戰題　答對 分數 ✕ 2</span>';
  tags+='<span class="tag">'+kindName(q.t)+'</span>';
  $('#badge').innerHTML=tags;
  $('#qt').innerHTML=ap(q.q);
  var isHear=q.t.indexOf('hear')===0;
  $('#playQ').style.display=isHear?'':'none';
  $('#playQ').className=isHear?'ping':'';
  $('#opts').className='lock';
  $('#opts').innerHTML=q.o.map(function(o,n){
    return '<button class="opt s'+n+'" data-n="'+n+'"><span class="sh">'+SHAPE[n]+'</span>'+
      '<span class="ot">'+ap(o)+'</span></button>'}).join('');
  $('#lockmsg').classList.add('on');
  $('#early').style.display='';
  $('#pause').textContent='⏸ 暫停';
  if(isHear)setTimeout(function(){say(q.say)},450);
  run();
}
function kindName(t){
  return t==='hear-en'?'🎧 聽英文，選英文':t==='hear-zh'?'🎧 聽英文，選中文':
   t==='see-en'?'👀 看英文，選中文':t==='see-zh'?'👀 看中文，選英文':'💡 觀念題';
}
function paint(){
  $('#rnum').textContent=left;
  $('#rfg').setAttribute('stroke-dashoffset',R*(1-left/T));
  var r=$('#ring');r.className=paused?'pause':(left<=10?'dang':(left<=20?'warn':''));
}
function run(){
  if(tick)clearInterval(tick);
  paint();
  tick=setInterval(function(){
    if(paused||answered)return;
    left--;
    if(left<=0){left=0;paint();clearInterval(tick);timeUp();return}
    if(locked&&left<=T-LOCK)unlock();
    if(left<=10)sTick();
    paint();
  },1000);
}
function unlock(){
  locked=false;$('#opts').className='';$('#lockmsg').classList.remove('on');
  $('#early').style.display='none';sPop();
}
function timeUp(){ if(!answered){unlock();choose(-1)} }

$('#opts').addEventListener('click',function(e){
  var b=e.target.closest?e.target.closest('.opt'):null;
  if(!b||locked||answered)return;
  choose(parseInt(b.getAttribute('data-n'),10));
});
function choose(n){
  answered=true;if(tick)clearInterval(tick);
  var q=cur(),ok=(n===q.a);
  $$('.opt').forEach(function(b,k){
    if(k===q.a)b.classList.add('ok');
    else if(k===n)b.classList.add('bad');
    else b.classList.add('dim');
  });
  $('#opts').className='lock';
  if(ok){
    right++;streak++;if(streak>best)best=streak;
    var base=100+Math.max(0,left)*2;
    var pts=q.x2?base*2:base;
    score+=pts;sOk();
    $('#fbh').className='ok';
    $('#fbh').textContent=q.x2?('✅ 答對！'+base+' ✕ 2 ＝ +'+pts):('✅ 答對！+'+pts);
    if(q.x2)sWow();
  }else{
    streak=0;sNo();
    $('#fbh').className='no';
    $('#fbh').textContent=n<0?'⏰ 時間到':'❌ 再看一次';
    $('#stage').classList.add('shake');
    setTimeout(function(){$('#stage').classList.remove('shake')},440);
    if(!revRound)wrongBank.push(reshuffle(q));
  }
  $('#why').innerHTML=ap(q.why);
  $('#sc').textContent=score;
  $('#streak').textContent=streak?'🔥 '+streak:'—';
  $('#fb').classList.add('on');
  $('#nextQ').textContent=(qi+1<total())?'下一題 ▶':(revRound?'看結果 ▶':(wrongBank.length?'🔁 錯題再戰（'+wrongBank.length+' 題）▶':'看結果 ▶'));
  $('#pause').textContent='⏸ 暫停';
}
/* 錯題再考一次：選項順序換掉，不能用位置背答案 */
function reshuffle(q){
  var idx=shuf([0,1,2,3]);
  return {t:q.t,q:q.q,say:q.say,why:q.why,x2:q.x2,
          o:idx.map(function(k){return q.o[k]}),a:idx.indexOf(q.a)};
}
$('#nextQ').addEventListener('click',function(){
  if(qi+1<total()){qi++;ask();return}
  if(!revRound&&wrongBank.length){revRound=true;qi=0;ask();return}
  finish();
});
$('#pause').addEventListener('click',function(){
  if(answered)return;
  paused=!paused;$('#pause').textContent=paused?'▶ 繼續':'⏸ 暫停';paint();
});
$('#early').addEventListener('click',function(){if(locked&&!answered)unlock()});
$('#playQ').addEventListener('click',function(){var q=cur();if(q.say)say(q.say)});

function finish(){
  if(tick)clearInterval(tick);
  $('#quiz').classList.remove('on');$('#fb').classList.remove('on');$('#hud').classList.remove('on');
  $('#end').classList.add('on');
  $('#endsc').textContent=score;
  $('#endln').innerHTML='答對 <b>'+right+'</b> 題　最長連對 <b>'+best+'</b> 題';
  sWow();
}
$('#again').addEventListener('click',function(){$('#end').classList.remove('on');start()});
$('#go').addEventListener('click',start);
`;

const body = `
<div id="hud">
 <span class="hcell"><span class="k">題號</span><span class="v" id="qn">1 / ${BUILT.length}</span></span>
 <span id="ring"><svg viewBox="0 0 100 100"><circle id="rbg" cx="50" cy="50" r="46"></circle>
  <circle id="rfg" cx="50" cy="50" r="46"></circle></svg><span id="rnum">50</span></span>
 <span class="hcell r"><span class="k">分數 ／ 連對</span>
  <span class="v"><span id="sc">0</span>　<span id="streak">—</span></span></span>
</div>

<main id="stage">
 <section id="gate">
  <h1>🎯 暖身 ${BUILT.length} 題</h1>
  <p>四選一。每題倒數 <b>50 秒</b>，前 <b>20 秒</b>小組討論，時間到才可以按答案。<br>
     其中 <b>6 題挑戰題</b>答對 <b>分數 ✕ 2</b>。答錯的題目最後會再考一次。</p>
  <div class="btns">
   <button class="big go" id="go">▶ 開始暖身題</button>
   <a class="big" href="unit1.html" style="text-decoration:none;display:inline-block">⏭ 先不做，直接上句型</a>
  </div>
 </section>

 <section id="quiz">
  <div id="badge"></div>
  <h2 id="qt"></h2>
  <button id="playQ">🔊 再聽一次</button>
  <div id="lockmsg" class="on">👥 小組討論中　時間到才可以作答</div>
  <div id="opts"></div>
 </section>

 <section id="fb">
  <div id="fbh"></div>
  <div id="why"></div>
  <button class="big" id="nextQ">下一題 ▶</button>
 </section>

 <section id="end">
  <h1>🎉 暖身完成</h1>
  <div class="sc" id="endsc">0</div>
  <div class="ln" id="endln"></div>
  <div class="btns" style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
   <button class="big" id="again">🔁 再玩一次</button>
   <a class="big go" href="unit1.html" style="text-decoration:none;display:inline-block">➡ 開始上 Unit 1</a>
  </div>
 </section>
</main>

<nav id="bar">
 <button id="pause">⏸ 暫停</button>
 <button id="early">✋ 提前作答</button>
 ${S.RATEBAR}
 <a href="index.html">🏠 首頁</a>
</nav>

<script>
${S.UTIL}
${S.TTS}
${S.SFX}
${JS.replace('__Q__', () => JSON.stringify(BUILT))}
${S.RATEJS}
</script>
</body>
</html>`;

fs.writeFileSync(DIR + '/warmup.html', S.HEAD('暖身 ' + BUILT.length + ' 題｜英文句型', CSS) + body);
console.log('warmup ok  ' + BUILT.length + ' 題，挑戰題 ' + BUILT.filter(q => q.x2).length + ' 題');
