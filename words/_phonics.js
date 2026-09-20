/* words/_phonics.js — 單字發音／音標／音節的唯一真相來源（使用者 2026-09-20 指定）
 *
 * 四個產生器共用（_build.js / _build_story.js / _build_quiz.js / 手工頁也可貼）。
 * 改音標或音節切分，只改下面的 RAW 一個地方。
 *
 * 使用者要的五件事：
 *  (1) 母音字母標紅色、不發音的字母標淺灰色
 *  (2) 秒懂動畫呈現音節怎麼切（一個母音的聲音 ＝ 一個音節）
 *  (3) 幫助記憶與正確發音的動畫：唸到哪裡、哪個字母就亮起來（字母↔聲音對起來）
 *  (4) 點任何一個英文單字／補充字詞 → 標準美式英語發音
 *  (5) 放慢語速按鈕 → 同一顆按鈕管全頁所有發音
 *  (6) 每個字母正下方對齊它自己的音標，三段切換：無 ／ IPA ／ KK；**一開始是「無」**
 *
 * ── RAW 的寫法 ──────────────────────────────────────────────
 *   一個單字一行，音節用 " / " 隔開，同一個音節裡的「字母群」用空白隔開。
 *   每個字母群寫成  字母|IPA|KK   ；不發音的字母寫成  字母|-|-
 *   例：daughter → 'd|d|d au|ɔː|ɔ gh|-|- / t|t|t er|ɚ|ɚ'
 *
 *   產生時會自動檢查兩件事，寫錯直接讓 build 失敗（不要拿掉）：
 *     A. 所有字母群接回去必須等於這個單字的拼法
 *     B. 每一個音節必須剛好有一個母音的聲音 —— 這就是要教給學生的規則
 *
 * ── 誠實界線 ────────────────────────────────────────────────
 *   課堂上講「一個母音 ＝ 一個音節」時，**數的是「還在出聲的母音」**：
 *   不發音的字母是淺灰色（niece 的 e、wife 的 e、daughter 的 gh、little 的第二個 t），
 *   au／ou／ie／ew 這種兩個字母一起發一個音的，畫面上本來就是一格。
 *   照畫面數，17 個字全部數得對——所以這條規則對學生是**真的**，不是近似。
 *   音標採**美式**：IPA 用 Cambridge／Oxford 美式標法，KK 用台灣課本的標法
 *   （例：bed 的 e ＝ IPA /e/、KK /ɛ/；boat 的 o ＝ IPA /oʊ/、KK /o/）。
 */

/* 母音的聲音（用來判斷哪一格是音節的核心）。ɚ、əl 都含母音，所以 er、le 也算一格。 */
const VS = 'aæɑʌəɚɜɝeɛɪioɔʊuɒ';

const RAW = {
/* ── 17 張單字卡 ── */
 family:      'f|f|f a|æ|æ m|m|m / i|ə|ə / l|l|l y|i|ɪ',
 parent:      'p|p|p a|e|ɛ r|r|r / e|ə|ə n|n|n t|t|t',
 mother:      'm|m|m o|ʌ|ʌ / th|ð|ð er|ɚ|ɚ',
 father:      'f|f|f a|ɑː|ɑ / th|ð|ð er|ɚ|ɚ',
 brother:     'b|b|b r|r|r o|ʌ|ʌ / th|ð|ð er|ɚ|ɚ',
 sister:      's|s|s i|ɪ|ɪ s|s|s / t|t|t er|ɚ|ɚ',
 son:         's|s|s o|ʌ|ʌ n|n|n',
 daughter:    'd|d|d au|ɔː|ɔ gh|-|- / t|t|t er|ɚ|ɚ',
 grandfather: 'g|ɡ|ɡ r|r|r a|æ|æ n|n|n d|d|d / f|f|f a|ɑː|ɑ / th|ð|ð er|ɚ|ɚ',
 grandmother: 'g|ɡ|ɡ r|r|r a|æ|æ n|n|n d|d|d / m|m|m o|ʌ|ʌ / th|ð|ð er|ɚ|ɚ',
 uncle:       'u|ʌ|ʌ n|ŋ|ŋ / c|k|k le|əl|əl',
 aunt:        'au|æ|æ n|n|n t|t|t',
 cousin:      'c|k|k ou|ʌ|ʌ s|z|z / i|ə|ə n|n|n',
 nephew:      'n|n|n e|e|ɛ ph|f|f / ew|juː|ju',
 niece:       'n|n|n ie|iː|i c|s|s e|-|-',
 husband:     'h|h|h u|ʌ|ʌ s|z|z / b|b|b a|ə|ə n|n|n d|d|d',
 wife:        'w|w|w i|aɪ|aɪ f|f|f e|-|-',

/* ── 哥哥／姊姊／弟弟／妹妹 那一頁要用的字 ── */
 older:       'o|oʊ|o l|l|l / d|d|d er|ɚ|ɚ',
 younger:     'y|j|j ou|ʌ|ʌ n|ŋ|ŋ / g|ɡ|ɡ er|ɚ|ɚ',
 big:         'b|b|b i|ɪ|ɪ g|ɡ|ɡ',
 little:      'l|l|l i|ɪ|ɪ t|t|t / t|-|- le|əl|əl',
 elder:       'e|e|ɛ l|l|l / d|d|d er|ɚ|ɚ',

/* ── 常一起出現的補充字 ── */
 parents:     'p|p|p a|e|ɛ r|r|r / e|ə|ə n|n|n t|t|t s|s|s',
 mom:         'm|m|m o|ɑ|ɑ m|m|m',
 mum:         'm|m|m u|ʌ|ʌ m|m|m',
 dad:         'd|d|d a|æ|æ d|d|d',
 sun:         's|s|s u|ʌ|ʌ n|n|n',
 grandpa:     'g|ɡ|ɡ r|r|r a|æ|æ n|n|n d|d|d / p|p|p a|ɑː|ɑ',
 grandma:     'g|ɡ|ɡ r|r|r a|æ|æ n|n|n d|d|d / m|m|m a|ɑː|ɑ',
 auntie:      'au|æ|æ n|n|n / t|t|t ie|i|ɪ',
 grand:       'g|ɡ|ɡ r|r|r a|æ|æ n|n|n d|d|d',
 house:       'h|h|h ou|aʊ|aʊ s|s|s e|-|-'
};

/* 把一行 RAW 解析成 [[單元,…]（音節）,…]，順便把兩件事檢查掉 */
function parse(word, raw) {
 const syls = raw.split('/').map(s => s.trim()).filter(Boolean).map(s =>
  s.split(/\s+/).map(u => {
   const p = u.split('|'), L = p[0], i = p[1], k = p[2];
   const silent = (i === '-');
   return { L: L, i: silent ? '' : i, k: silent ? '' : k,
            s: silent ? 1 : 0,
            n: (!silent && Array.from(i).some(c => VS.indexOf(c) >= 0)) ? 1 : 0 };
  }));
 const flat = [].concat.apply([], syls);
 const spell = flat.map(u => u.L).join('');
 if (spell !== word) throw new Error('_phonics：' + word + ' 的字母接不回去（得到 ' + spell + '）');
 syls.forEach((sy, k) => {
  const n = sy.filter(u => u.n).length;
  if (n !== 1) throw new Error('_phonics：' + word + ' 第 ' + (k + 1) + ' 個音節有 ' + n + ' 個母音，必須剛好 1 個');
 });
 return syls;
}

const DATA = {};
Object.keys(RAW).forEach(w => { DATA[w] = parse(w, RAW[w]); });

/* ───────────────────── 版面 ───────────────────── */
const CSS = `
/* 單字的音標／音節元件。字級跟著外層 font-size 走，所以字卡與故事頁共用一份。 */
.phw{display:inline-flex;flex-wrap:wrap;align-items:flex-end;justify-content:center;margin:0 .17em;
 line-height:1.04;cursor:pointer;position:relative}
.phw .syl{display:inline-flex;align-items:flex-end}
.phw .u{display:inline-flex;flex-direction:column;align-items:center;transition:color .2s}
.phw .g{display:block;white-space:nowrap}
.phw .g i{font-style:normal}
.phw .g i.v{color:#FF5A5A}            /* 母音字母 ＝ 紅色 */
.phw .u.mute .g i,.phw .u.mute .g i.v{color:#9A9A9A}  /* 不發音 ＝ 淺灰色 */
.phw .p{display:none;font-size:max(.34em,13px);font-weight:400;letter-spacing:0;white-space:nowrap;
 color:#9FB4C8;margin-top:.30em;min-height:1.1em}
.phw.ipa .p,.phw.kk .p{display:block}
.phw .u.mute .p{color:#6A6A6A}
/* 唸到哪一格，哪一格就亮起來（字母 ↔ 聲音） */
.phw .u.lit .g i{color:#FFFFFF;text-shadow:0 0 20px rgba(159,180,200,.95)}
.phw .u.lit .g i.v{color:#FF9090}
.phw .u.lit .p{color:#F2F2F2}
/* 音節之間的切分點，一直都在（學生看得到「這裡可以切」） */
.phw .cut{display:inline-flex;flex-direction:column;align-items:center;color:#3C4A55;
 padding:0 .07em;transition:color .3s,padding .34s cubic-bezier(.2,1.4,.35,1)}
.phw.split .cut{color:#9FB4C8;padding:0 .26em}
.phw .syl.beat .g{animation:phbeat .52s ease-in-out both}
@keyframes phbeat{0%{color:inherit}38%{color:#FFFFFF;text-shadow:0 0 24px rgba(159,180,200,.95)}
 100%{color:inherit;text-shadow:none}}
/* 母音一顆一顆數 */
.phw .u.count .g i.v{animation:phcount .5s ease-in-out both}
@keyframes phcount{0%{text-shadow:none}40%{text-shadow:0 0 26px rgba(255,90,90,.95)}100%{text-shadow:none}}

.phbox{display:flex;flex-direction:column;align-items:center;gap:clamp(4px,.8vh,9px)}
.phnote{font-size:clamp(13px,1.85vh,17px);color:#8E8E8E;letter-spacing:.02em;min-height:1.35em}
.phnote b{color:#F2F2F2;font-weight:700}
.phnote .rv{color:#FF5A5A;font-weight:700}
.phchips{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.phchips button{background:#131313;border:1px solid #333;color:#8E8E8E;border-radius:99px;
 font-family:inherit;font-size:clamp(12px,1.7vh,15px);padding:5px 12px;min-height:32px;cursor:pointer}
.phchips button.on{background:#9FB4C8;border-color:#9FB4C8;color:#0A0A0A;font-weight:700}
.phchips button:active{background:#2A2A2A}
.phchips button.on:active{background:#B4C6D6}

/* 任何一段英文都可以點來聽（補充單字、字詞、用法） */
.sp{cursor:pointer;border-bottom:1px dotted #4F6472}
.sp:active,.sp.ping{color:#9FB4C8;border-bottom-color:#9FB4C8}
.reduce .phw .syl.beat .g,.reduce .phw .u.count .g i.v{animation:none!important}`;

/* #bar 上那顆放慢語速的按鈕（每一頁都放） */
const btnSlow = '<button id="slow">🐢 放慢</button>';

/* ───────────────────── 頁面內的程式 ───────────────────── */
const JS = `
var PH=(function(){
 var D=${JSON.stringify(DATA)};
 var MODES=["","ipa","kk"],mode=0,slow=false,timers=[];
 try{var m=localStorage.getItem("phMode");if(m!==null)mode=+m||0}catch(e){}
 function V(ch){return "aeiou".indexOf(ch.toLowerCase())>=0}
 function isNuc(u){return u.n===1}
 function letters(u){var h="",L=u.L,k;
  for(k=0;k<L.length;k++){
   var red=(!u.s)&&(V(L[k])||(L[k].toLowerCase()==="y"&&isNuc(u)));
   h+='<i class="'+(red?"v":"")+'">'+L[k]+'</i>'}
  return h}
 /* 一個單字的完整元件：字母（母音紅／不發音灰）＋ 正下方對齊的音標 ＋ 音節切分點 */
 function word(w,opt){
  opt=opt||{};var key=w.toLowerCase(),d=D[key];
  if(!d)return '<span class="phw" data-say="'+w+'"><span class="syl"><span class="u"><span class="g">'+w+'</span></span></span></span>';
  var h='<span class="phw '+MODES[mode]+'" data-say="'+w+'" data-n="'+d.length+'">',si,ui;
  for(si=0;si<d.length;si++){
   if(si)h+='<span class="cut"><span class="g">·</span><span class="p">&nbsp;</span></span>';
   h+='<span class="syl">';
   for(ui=0;ui<d[si].length;ui++){var u=d[si][ui];
    h+='<span class="u'+(u.s?" mute":"")+'"><span class="g">'+letters(u)+'</span>'+
       '<span class="p" data-i="'+(u.s?"–":u.i)+'" data-k="'+(u.s?"–":u.k)+'">'+
       (u.s?"–":(mode===2?u.k:u.i))+'</span></span>'}
   h+='</span>'}
  return h+'</span>'}
 /* 字卡上的三段切換（無／IPA／KK）＋ 音節按鈕 */
 function chips(w){
  return '<div class="phchips" data-for="'+w+'">'+
   '<button data-m="0"'+(mode===0?' class="on"':'')+'>無音標</button>'+
   '<button data-m="1"'+(mode===1?' class="on"':'')+'>IPA</button>'+
   '<button data-m="2"'+(mode===2?' class="on"':'')+'>KK</button>'+
   '<button data-syl="1">✂️ 音節</button></div>'}
 function box(w,note){
  return '<div class="phbox">'+word(w)+chips(w)+
   '<div class="phnote">'+(note||"")+'</div></div>'}
 function clear(){while(timers.length)clearTimeout(timers.pop())}
 function at(ms,fn){timers.push(setTimeout(fn,ms))}
 function reduced(){return document.body.classList.contains("reduce")}
 /* 說話：全頁共用一個放慢開關 */
 function say(t,lang){try{if(!t)return;var u=new SpeechSynthesisUtterance(t);
  u.lang=lang||"en-US";u.rate=slow?.45:.85;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
 /* 唸單字：一格一格亮過去，字母和聲音對起來 */
 function sayWord(el,lang){
  var w=el.getAttribute("data-say");say(w,lang);
  if(reduced())return;
  var us=el.querySelectorAll(".u"),k,step=(slow?300:170);
  clear();
  for(k=0;k<us.length;k++)(function(u,k){
   at(160+k*step,function(){u.classList.add("lit")});
   at(160+k*step+step*1.25,function(){u.classList.remove("lit")})})(us[k],k)}
 /* 音節動畫：先一顆一顆數紅色母音，再把音節拉開 */
 function syl(el,note){
  var n=+el.getAttribute("data-n")||1,vs=el.querySelectorAll(".u"),sy=el.querySelectorAll(".syl"),k,c=0;
  clear();el.classList.remove("split");
  if(note)note.innerHTML="";
  var reds=[];for(k=0;k<vs.length;k++)if(vs[k].querySelector("i.v")&&!/mute/.test(vs[k].className))reds.push(vs[k]);
  reds.forEach(function(u,k){at(120+k*430,function(){
   u.classList.add("count");c=k+1;
   if(note)note.innerHTML='<span class="rv">●</span> 紅色母音 <b>'+c+'</b> 個';
   at(520,function(){u.classList.remove("count")})})});
  var t0=120+reds.length*430+180;
  at(t0,function(){el.classList.add("split")});
  for(k=0;k<sy.length;k++)(function(s,k){at(t0+120+k*360,function(){
   s.classList.remove("beat");void s.offsetWidth;s.classList.add("beat");
   if(note)note.innerHTML='✂️ 切成 <b>'+(k+1)+'</b> 段'})})(sy[k],k);
  at(t0+120+sy.length*360+240,function(){
   if(note)note.innerHTML='<span class="rv">'+n+'</span> 個母音 ＝ <b>'+n+' 個音節</b>'})}
 /* 把說明文字裡的英文字詞變成可以點來聽（補充單字、字詞、用法都算）。
   **只掃說明文字的容器**：.en 這種手工排版（dau<span>gh</span>ter）拆開來會壞掉，
   那種地方改用 {{單字}} 標記，由 PH.word() 直接畫。 */
 var HOSTS=".sub,.mid,.note,.qtext,.big,.parts,.zh";
 function autoSay(root){
  if(!root)return;
  var list=[];
  [].forEach.call(root.querySelectorAll(HOSTS),function(host){
   if(host.closest(".nosay"))return;
   var walk=document.createTreeWalker(host,NodeFilter.SHOW_TEXT,null,false),n;
   while((n=walk.nextNode())){
    var pe=n.parentNode;
    if(!pe||pe.nodeType!==1)continue;
    if(pe.closest(".sp,.phw,.phchips,.nosay,button,a,#src"))continue;
    if(/[A-Za-z]{2}/.test(n.nodeValue))list.push(n)}});
  list.forEach(function(t){
   var s=t.nodeValue,re=/[A-Za-z][A-Za-z'\\u2019-]*(?:[ ][A-Za-z][A-Za-z'\\u2019-]*)*/g,
       frag=document.createDocumentFragment(),last=0,m,any=false;
   while((m=re.exec(s))){
    if(m[0].length<2)continue;
    if(m.index>last)frag.appendChild(document.createTextNode(s.slice(last,m.index)));
    var sp=document.createElement("span");
    sp.className="sp";sp.setAttribute("data-say",m[0]);sp.textContent=m[0];
    frag.appendChild(sp);last=m.index+m[0].length;any=true}
   if(!any)return;
   if(last<s.length)frag.appendChild(document.createTextNode(s.slice(last)));
   t.parentNode.replaceChild(frag,t)})}
 /* 切換音標：直接換掉每個字母下面那一行，不用重畫整幕 */
 function apply(){
  [].forEach.call(document.querySelectorAll(".phw"),function(p){
   p.className="phw "+MODES[mode];
   [].forEach.call(p.querySelectorAll(".u .p"),function(g){
    g.textContent=(mode===2?g.getAttribute("data-k"):g.getAttribute("data-i"))||""})});
  [].forEach.call(document.querySelectorAll(".phchips button[data-m]"),function(b){
   b.classList.toggle("on",(+b.getAttribute("data-m")||0)===mode)})}
 /* 全頁共用：點任何一個英文字詞就唸、切換音標、播音節動畫 */
 document.addEventListener("click",function(e){
  var c=e.target.closest?e.target.closest(".phchips button"):null;
  if(c){
   var box=c.closest(".phbox"),w=box?box.querySelector(".phw"):null;
   if(c.hasAttribute("data-syl")){if(w)syl(w,box.querySelector(".phnote"));return}
   mode=+c.getAttribute("data-m")||0;
   try{localStorage.setItem("phMode",mode)}catch(x){}
   apply();
   return}
  var t=e.target.closest?e.target.closest(".phw,[data-say]"):null;
  if(!t)return;
  if(t.classList.contains("phw"))sayWord(t,t.getAttribute("data-lang"));
  else{say(t.getAttribute("data-say"),t.getAttribute("data-lang"));
   t.classList.add("ping");setTimeout(function(){t.classList.remove("ping")},260)}
 });
 function setMode(m){mode=((+m||0)%3+3)%3;try{localStorage.setItem("phMode",mode)}catch(e){}apply();return mode}
 return{word:word,box:box,chips:chips,say:say,sayWord:sayWord,syl:syl,autoSay:autoSay,apply:apply,setMode:setMode,
  has:function(w){return !!D[(w||"").toLowerCase()]},
  slow:function(v){slow=(v===undefined)?!slow:!!v;return slow},
  isSlow:function(){return slow},
  mode:function(){return mode}};
})();
/* #bar 的「🐢 放慢」：管全頁所有發音（單字、補充字詞、用法） */
(function(){var b=document.getElementById("slow");if(!b)return;
 b.addEventListener("click",function(){
  var on=PH.slow();b.textContent=on?"🐢 放慢：開":"🐢 放慢";
  b.style.background=on?"#9FB4C8":"";b.style.color=on?"#0A0A0A":"";
  b.style.borderColor=on?"#9FB4C8":""});})();
/* #bar 的「🔤 音標」：無 → IPA → KK →（回到）無。字卡是用卡片上的三顆 chips。 */
(function(){var b=document.getElementById("phmode");if(!b)return;
 var N=["無","IPA","KK"];
 function lab(){b.textContent="🔤 音標："+N[PH.mode()]}
 lab();b.addEventListener("click",function(){PH.setMode(PH.mode()+1);lab()});})();`;

/* 故事頁／暖身題頁 #bar 上的音標切換鈕 */
const btnMode = '<button id="phmode">🔤 音標：無</button>';

module.exports = { DATA, RAW, CSS, JS, btnSlow, btnMode };
