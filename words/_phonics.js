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
 *   不發音的字母是淺灰色（niece 的 i 與 e、wife 的 e、daughter 的 gh、cousin 的 o、
 *   uncle／little 的 e、little 的第二個 t），
 *   au／ou／ie／ew 這種兩個字母一起發一個音的，畫面上本來就是一格。
 *   照畫面數，17 個字全部數得對——所以這條規則對學生是**真的**，不是近似。
 *   音標採**美式**：IPA 用 Cambridge／Oxford 美式標法，KK 用台灣課本的標法
 *   （例：bed 的 e ＝ IPA /e/、KK /ɛ/；boat 的 o ＝ IPA /oʊ/、KK /o/）。
 */

/* 母音的聲音（用來判斷哪一格是音節的核心）。ɚ、əl 都含母音，所以 er、le 也算一格。 */
const VS = 'aæɑʌəɚɜɝeɛɪioɔʊuɒ';

const RAW = {
/* ── 17 張單字卡 ── */
 /* 使用者 2026-09-20 指定切成 fa．mi．ly（開音節切法，母音後面切）。
    辭典的連字號斷法是 fam·i·ly（那是排版斷行用的），出處卡裡兩種都寫清楚。 */
 family:      'f|f|f a|æ|æ / m|m|m i|ə|ə / l|l|l y|i|ɪ',
 parent:      'p|p|p a|e|ɛ r|r|r / e|ə|ə n|n|n t|t|t',
 mother:      'm|m|m o|ʌ|ʌ / th|ð|ð er|ɚ|ɚ',
 father:      'f|f|f a|ɑː|ɑ / th|ð|ð er|ɚ|ɚ',
 brother:     'b|b|b r|r|r o|ʌ|ʌ / th|ð|ð er|ɚ|ɚ',
 sister:      's|s|s i|ɪ|ɪ s|s|s / t|t|t er|ɚ|ɚ',
 son:         's|s|s o|ʌ|ʌ n|n|n',
 daughter:    'd|d|d au|ɔː|ɔ gh|-|- / t|t|t er|ɚ|ɚ',
 grandfather: 'g|ɡ|ɡ r|r|r a|æ|æ n|n|n d|d|d / f|f|f a|ɑː|ɑ / th|ð|ð er|ɚ|ɚ',
 grandmother: 'g|ɡ|ɡ r|r|r a|æ|æ n|n|n d|d|d / m|m|m o|ʌ|ʌ / th|ð|ð er|ɚ|ɚ',
 /* e 不出聲（使用者 2026-09-20 指定）：-cle 的聲音是 /kəl/，母音的聲音落在 l 身上，
    所以 l 自己就是這個音節的核心（letters() 會把它標紅，學生數紅色才數得對）。 */
 uncle:       'u|ʌ|ʌ n|ŋ|ŋ / c|k|k l|əl|əl e|-|-',
 aunt:        'au|æ|æ n|n|n t|t|t',
 /* o 不出聲（使用者 2026-09-20 指定）：ou 拆成 o 淺灰 ＋ u 發 /ʌ/ */
 cousin:      'c|k|k o|-|- u|ʌ|ʌ s|z|z / i|ə|ə n|n|n',
 nephew:      'n|n|n e|e|ɛ ph|f|f / ew|juː|ju',
 /* i 不出聲（使用者 2026-09-20 指定）：ie 的 /iː/ 由 e 出聲，i 淺灰 */
 niece:       'n|n|n i|-|- e|iː|i c|s|s e|-|-',
 husband:     'h|h|h u|ʌ|ʌ s|z|z / b|b|b a|ə|ə n|n|n d|d|d',
 wife:        'w|w|w i|aɪ|aɪ f|f|f e|-|-',

/* ── 哥哥／姊姊／弟弟／妹妹 那一頁要用的字 ── */
 older:       'o|oʊ|o l|l|l / d|d|d er|ɚ|ɚ',
 younger:     'y|j|j ou|ʌ|ʌ n|ŋ|ŋ / g|ɡ|ɡ er|ɚ|ɚ',
 big:         'b|b|b i|ɪ|ɪ g|ɡ|ɡ',
 /* 跟 uncle 同一個 -le：e 不出聲，母音的聲音在 l 身上（兩頁要一致，學生才不會亂） */
 little:      'l|l|l i|ɪ|ɪ t|t|t / t|-|- l|əl|əl e|-|-',
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
 sis:         's|s|s i|ɪ|ɪ s|s|s',
 bro:         'b|b|b r|r|r o|oʊ|o',
 me:          'm|m|m e|iː|i',
 tree:        't|t|t r|r|r ee|iː|i',
 son:         's|s|s o|ʌ|ʌ n|n|n',
 grand:       'g|ɡ|ɡ r|r|r a|æ|æ n|n|n d|d|d',
 house:       'h|h|h ou|aʊ|aʊ s|s|s e|-|-',

/* ── 職業單字（使用者 2026-09-25 指定新增）── */
 student:     's|s|s t|t|t u|uː|u / d|d|d e|ə|ə n|n|n t|t|t',
 teacher:     't|t|t ea|iː|i / ch|tʃ|tʃ er|ɚ|ɚ',
 doctor:      'd|d|d o|ɑː|ɑ c|k|k / t|t|t or|ɚ|ɚ',
 farmer:      'f|f|f ar|ɑːr|ɑr / m|m|m er|ɚ|ɚ',
 nurse:       'n|n|n ur|ɝː|ɝ s|s|s e|-|-',
 teach:       't|t|t ea|iː|i ch|tʃ|tʃ',
 farm:        'f|f|f ar|ɑːr|ɑr m|m|m',
 study:       's|s|s t|t|t u|ʌ|ʌ / d|d|d y|i|ɪ',

/* ── G3 數字單字（使用者 2026-09-25 指定；不發音的字母照使用者列的：one 的 e、three 字尾 e、
      four 的 u、five 的 e、eight 的 gh、nine 的 e、twelve 字尾 e）──
   two 的 w 其實也不唸（/tuː/），使用者的清單沒有列，先照清單不標灰，tw 放同一格、音標只寫 /t/ */
 zero:        'z|z|z e|ɪ|ɪ / r|r|r o|oʊ|o',
 one:         'o|wʌ|wʌ n|n|n e|-|-',
 two:         'tw|t|t o|uː|u',
 three:       'th|θ|θ r|r|r e|iː|i e|-|-',
 four:        'f|f|f o|ɔː|ɔ u|-|- r|r|r',
 five:        'f|f|f i|aɪ|aɪ v|v|v e|-|-',
 six:         's|s|s i|ɪ|ɪ x|ks|ks',
 seven:       's|s|s e|e|ɛ / v|v|v e|ə|ə n|n|n',
 eight:       'ei|eɪ|e gh|-|- t|t|t',
 nine:        'n|n|n i|aɪ|aɪ n|n|n e|-|-',
 ten:         't|t|t e|e|ɛ n|n|n',
 eleven:      'e|ɪ|ɪ / l|l|l e|e|ɛ / v|v|v e|ə|ə n|n|n',
 twelve:      't|t|t w|w|w e|e|ɛ l|l|l v|v|v e|-|-',

/* ── G3 Sight Words 常見字（使用者 2026-09-25 指定；不發音的字母照使用者列的：
      You 的 o、Your 的 o、are 的 e、name 的 e、What 的 h、year 的 a）── */
 i:           'i|aɪ|aɪ',
 my:          'm|m|m y|aɪ|aɪ',
 you:         'y|j|j o|-|- u|uː|u',
 your:        'y|j|j o|-|- u|ʊ|ʊ r|r|r',
 am:          'a|æ|æ m|m|m',
 are:         'ar|ɑːr|ɑr e|-|-',
 name:        'n|n|n a|eɪ|e m|m|m e|-|-',
 is:          'i|ɪ|ɪ s|z|z',
 what:        'w|w|w h|-|- a|ɑː|ɑ t|t|t',
 "what's":    "w|w|w h|-|- a|ɑː|ɑ t|t|t 's|s|s",
 how:         'h|h|h ow|aʊ|aʊ',
 old:         'o|oʊ|o l|l|l d|d|d',
 year:        'y|j|j e|ɪ|ɪ a|-|- r|r|r',
 years:       'y|j|j e|ɪ|ɪ a|-|- r|r|r s|z|z',

/* ── 更多字的故事那一頁 ── */
 tea:         't|t|t ea|iː|i',
 ketchup:     'k|k|k e|e|ɛ tch|tʃ|tʃ / u|ə|ə p|p|p',
 hamburger:   'h|h|h a|æ|æ m|m|m / b|b|b ur|ɜːr|ɝ / g|ɡ|ɡ er|ɚ|ɚ',
 sandwich:    's|s|s a|æ|æ n|n|n d|d|d / w|w|w i|ɪ|ɪ ch|tʃ|tʃ',
 breakfast:   'b|b|b r|r|r ea|e|ɛ k|k|k / f|f|f a|ə|ə s|s|s t|t|t',
 goodbye:     'g|ɡ|ɡ oo|ʊ|ʊ d|d|d / b|b|b y|aɪ|aɪ e|-|-',
 break:       'b|b|b r|r|r ea|eɪ|e k|k|k',
 fast:        'f|f|f a|æ|æ s|s|s t|t|t'
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
.phw .cut{display:inline-flex;flex-direction:column;align-items:center;color:#2B343B;
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

/* 念到哪一個字，那一個字就放大、變亮（使用者 2026-09-25 指定，每一頁都一樣） */
.speak{color:#FFD24A!important;text-shadow:0 0 16px rgba(255,210,74,.8);transform:scale(1.14);display:inline-block;
 transition:transform .15s}
.phw.speak .g i,.phw.speak .g i.v{color:#FFD24A!important}
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
 /* 這一格是音節的核心，但字母裡一個 a/e/i/o/u 都沒有（uncle／little 的 l 自己就發 əl）
    → 整格標紅。不這樣做，學生「數紅色 ＝ 數音節」就會少數一個，規則當場破功。 */
 function noVowelNucleus(u){var k;if(!isNuc(u))return false;
  for(k=0;k<u.L.length;k++)if(V(u.L[k]))return false;return true}
 function letters(u){var h="",L=u.L,k,nv=noVowelNucleus(u);
  for(k=0;k<L.length;k++){
   var red=(!u.s)&&(nv||V(L[k])||(L[k].toLowerCase()==="y"&&isNuc(u)));
   h+='<i class="'+(red?"v":"")+'">'+L[k]+'</i>'}
  return h}
 /* 一個單字的完整元件：字母（母音紅／不發音灰）＋ 正下方對齊的音標 ＋ 音節切分點 */
 /* 查不到音標的字（外語家人單字等）：**不硬掰音標、不硬切音節**，
    只把母音字母標紅，一樣點得下去唸。這是誠實界線，不要拿掉。 */
 function plain(w,lang){
  var h='<span class="phw phplain" data-say="'+w+'"'+(lang?' data-lang="'+lang+'"':'')+
        '><span class="syl"><span class="u"><span class="g">',k;
  for(k=0;k<w.length;k++)h+='<i class="'+(V(w[k])?"v":"")+'">'+w[k]+'</i>';
  return h+'</span></span></span></span>'}
 function word(w,lang){
  /* **這兩個 \\s 一定要寫兩條斜線**：這整段是 JS 模板字串，寫一條會被吃掉，
     變成 /s/ 與 /s+/ ——凡是拼法裡有 s 的字（sister／son／cousin／husband…）
     都會被當成「多個字」從 s 那裡切開，s 不見、發音也唸錯。2026-09-20 訂正。 */
  if(/\\s/.test(w))return w.split(/\\s+/).map(function(x){return word(x,lang)}).join(" ");
  var key=w.toLowerCase().replace(/[\u2019]/g,"'"),d=D[key];
  if(!d)return plain(w,lang);
  /* 字母照原本的大小寫畫（I、My、What 開頭要大寫；資料裡一律小寫） */
  var CS=w.replace(/[\u2019]/g,"\u2019"),cp=0;
  var h='<span class="phw '+MODES[mode]+'" data-say="'+w+'"'+(lang?' data-lang="'+lang+'"':'')+
        ' data-n="'+d.length+'">',si,ui;
  for(si=0;si<d.length;si++){
   if(si)h+='<span class="cut"><span class="g">·</span><span class="p">&nbsp;</span></span>';
   h+='<span class="syl">';
   for(ui=0;ui<d[si].length;ui++){var u=d[si][ui];
    var lu=letters(u).replace(/>([^<])</g,function(m,c){var o=CS.charAt(cp++);return '>'+(o&&o.toLowerCase()===c.toLowerCase()?o:(c==="'"&&o==="\u2019"?o:c))+'<'});
    h+='<span class="u'+(u.s?" mute":"")+'"><span class="g">'+lu+'</span>'+
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
 /* 字卡上**只放單字本身**——切換鈕與說明文字都移到下方 #bar，
    讓學生一眼只看到要學的那個英文單字（使用者 2026-09-20 指定）。 */
 function box(w){return word(w)}
 /* {{單字}} → 畫成單字元件；{{de-DE:Mutter}} → 指定語言（外語家人單字） */
 function expand(h){
  return String(h)
   .replace(/\{\{([a-zA-Z]{2}-[A-Z]{2}):([^{}]+)\}\}/g,function(m,lang,w){return word(w.trim(),lang)})
   .replace(/\{\{([^{}:]+)\}\}/g,function(m,w){return word(w.trim())})}
 function clear(){while(timers.length)clearTimeout(timers.pop())}
 function at(ms,fn){timers.push(setTimeout(fn,ms))}
 function reduced(){return document.body.classList.contains("reduce")}
 /* 說話：全頁共用一個放慢開關。
    瑞典文先查預先做好的語音檔（window.SVAUD，使用者 2026-09-25 指定：要真實正確的瑞典語發音），
    很多電腦沒有瑞典文語音，瀏覽器會用英文腔亂唸。查不到才用瀏覽器語音。
    fin：唸完（或出錯）要做的事；一定會被呼叫，而且只呼叫一次。 */
 var AU=null;
 function akey(t){return String(t).replace(/[\u2019]/g,"'").replace(/\s+/g," ").trim().toLowerCase()}
 function stopAll(){try{speechSynthesis.cancel()}catch(e){}try{if(AU)AU.pause()}catch(e){}}
 function say(t,lang,fin){
  var done=false,end=function(){if(done)return;done=true;if(fin)try{fin()}catch(e){}};
  if(!t){end();return}
  stopAll();
  var A=(lang&&/^sv/i.test(lang)&&window.SVAUD)?SVAUD[akey(t)]:null;
  if(A){try{if(!AU)AU=new Audio();AU.onended=end;AU.onerror=end;
    AU.src=(window.SVDIR||"audio/sv/")+A[0];AU.playbackRate=slow?.7:1;
    var pr=AU.play();if(pr&&pr.catch)pr.catch(end);setTimeout(end,A[1]*1000/(slow?.7:1)+1500);return}catch(e){}}
  try{var u=new SpeechSynthesisUtterance(t);
   u.lang=lang||"en-US";u.rate=slow?.45:.85;u.onend=end;u.onerror=end;speechSynthesis.speak(u)}catch(e){end();return}
  setTimeout(end,1400+String(t).length*(slow?260:140));   /* 瀏覽器不發 onend 也不會卡住 */
 }
 /* 一個字一個字唸：唸到哪一個字，那一個字就放大、變亮（使用者 2026-09-25 指定：每一個單字都要有發音） */
 var chainId=0;
 function sayChain(els,fin){
  var my=++chainId,k=0;stopAll();
  function next(){
   [].forEach.call(document.querySelectorAll(".speak"),function(x){x.classList.remove("speak")});
   if(my!==chainId)return;
   if(k>=els.length){if(fin)fin();return}
   var el=els[k++],t=el.getAttribute("data-say");
   if(!t){next();return}
   el.classList.add("speak");
   say(t,el.getAttribute("data-lang")||"en-US",function(){if(my===chainId)setTimeout(next,160)});
  }
  setTimeout(next,90);
 }
 function chainStop(){chainId++;stopAll();
  [].forEach.call(document.querySelectorAll(".speak"),function(x){x.classList.remove("speak")})}
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
 /* 畫面上的主角單字：#card／#stage 裡字最大的那一個 .phw */
 function main(){
  var all=document.querySelectorAll("#card .phw,#stage .phw"),best=null,bs=0,k;
  for(k=0;k<all.length;k++){var f=parseFloat(getComputedStyle(all[k]).fontSize)||0;
   if(f>bs){bs=f;best=all[k]}}
  return best}
 function setMode(m){mode=((+m||0)%3+3)%3;try{localStorage.setItem("phMode",mode)}catch(e){}apply();return mode}
 return{word:word,box:box,chips:chips,expand:expand,say:say,sayWord:sayWord,sayChain:sayChain,chainStop:chainStop,syl:syl,autoSay:autoSay,apply:apply,setMode:setMode,main:main,
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
 lab();b.addEventListener("click",function(){PH.setMode(PH.mode()+1);lab()});})();
/* #bar 的「✂️ 音節」：動畫跑在單字上，數出來的結果寫回按鈕，字卡保持乾淨 */
(function(){var b=document.getElementById("phsyl");if(!b)return;
 b.addEventListener("click",function(){
  var el=PH.main();if(!el)return;
  var n=+el.getAttribute("data-n")||0;
  if(!n){b.textContent="✂️ 音節";return}
  PH.syl(el,null);
  b.textContent="✂️ 音節";
  setTimeout(function(){b.textContent="✂️ "+n+" 個音節"},220+n*430+120+n*360);});})();`;

/* #bar 上的音標切換鈕（每一頁都放；字卡上不再放 chips，版面要聚焦） */
const btnMode = '<button id="phmode">🔤 音標：無</button>';
/* #bar 上的音節動畫鈕。結果直接寫在按鈕上，不佔字卡版面。 */
const btnSyl  = '<button id="phsyl">✂️ 音節</button>';

module.exports = { DATA, RAW, CSS, JS, btnSlow, btnMode, btnSyl };
