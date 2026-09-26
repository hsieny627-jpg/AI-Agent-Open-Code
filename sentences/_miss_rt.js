/* sentences/_miss_rt.js — 瀏覽器端程式（原封不動塞進網頁，跟 _shared.js 的 MISS 放在一起）
 * 使用者 2026-09-26 指定的三件事：
 *  ① 答錯頁：正確答案的每一個英文字正下方 ＝ 它的中文；下面再一行整句翻譯（mGloss／mTr）
 *  ② 加分題：不是換一題「不像的題目」，而是**同一題換個樣子**（名字／職業／數字換掉、選項換位置、
 *     選項文字稍微變一下），一律**四個選項**，錯的選項都是學生真的會寫錯的樣子（mVar）
 *  ③ 火眼金睛：答對也要看 6 秒（正確句子＋逐字中文＋整句翻譯＋自動唸）才得分（lookShow）
 * GL（字 ➜ 中文）、TR（句 ➜ 中文）由 _gloss.js 在 build 時從這個網站的資料自動收集。
 */
function gKey(s){return String(s).replace(/<[^>]+>/g,'').replace(/[’‘]/g,"'").replace(/\s+/g,' ')
 .replace(/\s+([?.!,])/g,'$1').replace(/\s+'/g,"'").trim().toLowerCase()}
/* 切成一個一個「字」：What's ➜ What ＋ 's（使用者的例子：'s 正下方是「是」）；How old、years old 算一個 */
function gUnits(s){
 s=String(s);var r=[],re=/[A-Za-z]+n[’']t\b|[A-Za-z]+|[’'][A-Za-z]+|[?.!,]/g,m;
 while((m=re.exec(s)))r.push({t:m[0],s:m.index,e:m.index+m[0].length});
 for(var i=0;i+1<r.length;i++){var two=gKey(r[i].t+' '+r[i+1].t);
  if(/[a-z]/.test(r[i+1].t)&&GL[two]&&/^(how old|years old|year old)$/.test(two)){
   r.splice(i,2,{t:s.slice(r[i].s,r[i+1].e),s:r[i].s,e:r[i+1].e})}}
 return r;
}
function gZh(t){var k=gKey(t);if(GL[k]!=null)return GL[k];
 if(/^[a-z]+n't$/.test(k)&&GL[k.replace(/n't$/,'')])return GL[k.replace(/n't$/,'')]+' 不';
 return ''}
/* 名字、數字、職業換掉以後的句子，也翻得出來 */
var GSW=[['Ken','Ken'],['Alan','Alan'],['Wendy','Wendy'],['Mike','Mike'],['Emma','Emma']];
var GSA=[['six','六'],['seven','七'],['eight','八'],['nine','九'],['ten','十'],['eleven','十一'],['twelve','十二']];
var GSJ=[['doctor','醫生'],['teacher','老師'],['student','學生'],['farmer','農夫'],['nurse','護理師'],['cook','廚師']];
function mTr(s){
 var k=gKey(s);if(!k||!/[a-z]/.test(k))return '';
 if(TR[k])return TR[k];
 var sets=[GSW,GSA,GSJ];
 for(var a=0;a<sets.length;a++)for(var i=0;i<sets[a].length;i++){
  var w=sets[a][i],re=new RegExp('\\b'+w[0].toLowerCase()+'\\b');if(!re.test(k))continue;
  for(var j=0;j<sets[a].length;j++){if(j===i)continue;var v=sets[a][j],k2=k.replace(re,v[0].toLowerCase());
   if(TR[k2]&&TR[k2].indexOf(v[1])>=0)return TR[k2].replace(v[1],w[1])}}
 return '';
}
/* 正確答案畫成「英文在上、中文在下」一欄一欄；bad ＝ 要框金色（改對的字）的字元範圍 */
function mGloss(ans,bad){
 var U=gUnits(ans),h='',hit=function(u){if(!bad)return false;for(var i=0;i<bad.length;i++)
  if(u.s<bad[i].e&&u.e>bad[i].s)return true;return false};
 U.forEach(function(u){
  if(/^[?.!,]$/.test(u.t)){h+='<span class="gw gp"><b>'+u.t+'</b><i>&nbsp;</i></span>';return}
  var z=gZh(u.t);
  h+='<span class="gw'+(/^['’]/.test(u.t)?' gc':'')+'"><b'+(hit(u)?' class="f"':'')+'>'+ap(mEsc(u.t))+'</b><i>'+(z?mEsc(z):'&nbsp;')+'</i></span>'});
 return h;
}
function gIsEn(s){s=mStrip(s);return /[A-Za-z]{2,}|^I\b/.test(s)&&!/[一-鿿]/.test(s)}
/* 答案是中文（看英文選中文）：就拿題目裡引號中的英文句子來逐字對照 */
function gSrc(o){var a=mStrip(o.ans);if(gIsEn(a))return {en:a,zh:mTr(a)};
 var q=mStrip(o.q||''),m=q.match(/["“「]([^"”」]*[A-Za-z][^"”」]*)["”」]/);
 if(m&&gIsEn(m[1])&&/[一-鿿]/.test(a))return {en:m[1],zh:a.replace(/^[^一-鿿]+/,'')};
 return null}

/* ── ② 加分題：同一題換個樣子，四個選項 ── */
function gCanon(s){s=gKey(s).replace(/[?.!]$/,'');
 return s.replace(/'s\b/g,' is').replace(/'m\b/g,' am').replace(/'re\b/g,' are').replace(/n't\b/g,' not')
  .replace(/ years old\b/g,'').replace(/^my name is /,'i am ').replace(/\s+/g,' ').trim()}
var MUT=[
 [/\byour\b/,'you'],[/\byou\b/,'your'],[/\bYour\b/,'You'],[/\bYou\b(?![’'])/,'Your'],
 [/\bMy name\b/,'I name'],[/\bI[’']m\b/,'I are'],[/\bI[’']m\b/,'Me'],[/\bYou[’']re\b/,'You is'],[/\bYou[’']re\b/,'You’s'],[/\bYou[’']re\b/,'Your are'],[/\bmy\b/,'I'],[/\bI[’']m\b/,'My'],[/\bI am\b/,'I is'],
 [/\bis\b/,'are'],[/\bare\b/,'is'],[/\bam\b/,'is'],[/([A-Za-z])[’']s\b/,'$1'],[/([A-Za-z])[’']m\b/,'$1'],
 [/\byears old\b/,'year old'],[/\bHow old\b/,'How'],[/\bWhat\b/,'How'],[/\bHow\b(?! old)/,'What'],
 [/\bhe\b/,'she'],[/\bshe\b/,'he'],[/\bHe\b/,'She'],[/\bShe\b/,'He'],[/\bhe\b/,'him'],[/\bHe[’']s\b/,'His'],
 [/\ba ([a-z]+)/,'$1'],[/\bIs (he|she)\b/,'$1 is'],[/\bWho\b/,'What'],[/\bisn[’']t\b/,'not'],[/\bWho[’']s\b/,'Whose'],
 [/他/,'她'],[/她/,'他'],[/你的/,'我的'],[/我的/,'你的'],[/誰/,'什麼'],[/什麼/,'誰'],[/幾歲/,'好嗎'],[/名字/,'年紀']
];
/* 一個字的答案：同一組容易搞混的字 */
var MSET=[['is','are','am','be','was','do'],["'s","'m","'re",'is','are'],['I','My','You','Your','Me'],['my','your','I','you','me'],
 ['he','she','him','his','her'],['He','She','His','Her','Him'],['What','How','Who','Where','When'],['Who','Whose','What','How'],
 ['How old','How','What','How many'],['year','years','old','years old'],['a','an','the','one']];
function mMuts(c){var out=[];MUT.forEach(function(r){if(r[0].test(c)){var x=c.replace(r[0],r[1]);if(x!==c)out.push(x)}});
 MSET.forEach(function(S){if(S.indexOf(c)>=0)S.forEach(function(x){if(x!==c)out.push(x)})});
 /* 中文答案：職業、數字換一個 */
 [GSJ,GSA].forEach(function(S){S.forEach(function(w){if(c.indexOf(w[1])>=0)S.forEach(function(v){
  if(v!==w&&c.indexOf(v[1])<0&&!(S===GSA&&/十[一二]/.test(c)))out.push(c.replace(w[1],v[1]))})})});
 /* 兩個字對調（語序錯），開頭大寫 */
 var w=c.split(' ');if(w.length>=3&&/[A-Za-z]/.test(c)){for(var n=0;n<2;n++){var i=Math.floor(Math.random()*(w.length-1));
  var v=w.slice(),t=v[i];v[i]=v[i+1];v[i+1]=t;if(/[?.!,]$/.test(w[i])||/[?.!,]$/.test(w[i+1]))continue;
  var y=v.join(' ');y=y.charAt(0).toUpperCase()+y.slice(1);out.push(y)}}
 /* 少一個字 */
 if(w.length>=3&&/[A-Za-z]/.test(c)){var d=1+Math.floor(Math.random()*(w.length-2));var z=w.slice();z.splice(d,1);
  if(!/^[?.!]$/.test(z[z.length-1]))out.push(z.join(' '))}
 return shuf(out)}
function gSame(a,b){return gKey(a)===gKey(b)}
function mSwapIn(b){ /* 名字 ➜ 職業 ➜ 數字，換一組（題目、選項、提示一起換，答案還是對的） */
 var all=[b.q].concat(b.o).concat([b.h||'',b.say||'']).join(' ');
 var cjk=/[六七八九十]/.test(all);
 var sets=[GSW,GSJ].concat(cjk?[]:[GSA]);
 for(var a=0;a<sets.length;a++){
  var S=sets[a],had=S.filter(function(w){return new RegExp('\\b'+w[0]+'\\b','i').test(all)});
  if(!had.length)continue;
  var from=pick(had),rest=S.filter(function(w){return !new RegExp('\\b'+w[0]+'\\b','i').test(all)});
  if(!rest.length)continue;var to=pick(rest);
  var rep=function(s){if(s==null)return s;s=String(s).replace(new RegExp('\\b'+from[0]+'\\b','g'),to[0])
    .replace(new RegExp('\\b'+from[0].charAt(0).toUpperCase()+from[0].slice(1)+'\\b','g'),to[0].charAt(0).toUpperCase()+to[0].slice(1));
   if(from[1]!==from[0]&&S!==GSA)s=s.split(from[1]).join(to[1]);return s};
  return {q:rep(b.q),o:b.o.map(rep),h:rep(b.h),say:rep(b.say),sw:1};
 }
 return null;
}
/* base ＝ 原題（{q,o:[正解,...],h,say}）；pick ＝ 學生選錯的那一個 */
function mVar(base,pick){
 if(!base||!base.o||!base.o.length)return base;
 var sw=mSwapIn(base)||{q:base.q,o:base.o.slice(),h:base.h,say:base.say};
 var c=sw.o[0],opts=[c],cc=gCanon(c);
 var ok=function(x){if(!x)return false;x=String(x);if(/<[^>]+>/.test(x)&&!mStrip(x))return false;
  for(var i=0;i<opts.length;i++)if(gSame(opts[i],x))return false;
  if(/[A-Za-z]/.test(x)&&gCanon(x)===cc)return false;return true};
 /* 先放「學生真的會錯」的：原題的錯選項（換過名字的）、學生自己選的那一個、正解改一個地方 */
 var cand=shuf(sw.o.slice(1));
 if(pick&&!sw.sw)cand.unshift(pick);
 var mm=base.nm?[]:mMuts(c);
 /* 原題的錯選項最多留兩個，至少換一個成「正解改一個地方」：選項文字跟原題不一樣，不能背 */
 var keep=cand.filter(ok).slice(0,2);keep.forEach(function(x){if(ok(x))opts.push(x)});
 mm.forEach(function(x){if(opts.length<4&&ok(x))opts.push(x)});
 cand.forEach(function(x){if(opts.length<4&&ok(x))opts.push(x)});
 return {q:sw.q,o:opts,h:sw.h,say:sw.say,v:1};
}

/* ── ③ 火眼金睛：答對也要看 6 秒才得分 ── */
var lookT=null;
function lookShow(en,cb){
 var m=document.getElementById('look');
 if(!m){m=document.createElement('div');m.id='look';document.body.appendChild(m);
  m.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('.say'):null;if(b)say(b.getAttribute('data-say'))})}
 var zh=mTr(en),n=6;
 m.innerHTML='<div class="mbox"><div class="mhd ok">🔍 看清楚，記起來</div>'+
  '<div class="mcmp"><div class="ma gl"><span class="mi">✅</span><span class="mv">'+mGloss(en,null)+'</span></div></div>'+
  (zh?'<div class="mtr">整句：<b>'+mEsc(zh)+'</b></div>':'')+
  '<div class="mft"><button class="say" data-say="'+mEsc(en).replace(/"/g,'&quot;')+'">🔊 發音</button>'+
  '<span class="mcd" id="lcdn">'+n+'</span></div>'+
  '<div class="lk">看完 6 秒 ➜ 才拿得到分數</div></div>';
 m.classList.add('on');
 setTimeout(function(){if(m.classList.contains('on'))say(en)},500);
 if(lookT)clearInterval(lookT);
 lookT=setInterval(function(){n--;var c=document.getElementById('lcdn');
  if(n>0){if(c){c.textContent=n;c.classList.remove('tick');void c.offsetWidth;c.classList.add('tick')}return}
  clearInterval(lookT);lookT=null;m.classList.remove('on');sayStop();if(cb)cb()},1000);
}
function lookHide(){if(lookT){clearInterval(lookT);lookT=null}var m=document.getElementById('look');if(m)m.classList.remove('on')}
