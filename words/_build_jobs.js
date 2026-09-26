/* words/_build_jobs.js — 職業單字（使用者 2026-09-25 指定：100% 照家人單字的學習架構）
 *
 *   node words/_build_jobs.js
 *
 * 五個字：student、teacher、doctor、farmer、nurse
 *   A. 單字卡（三幕：中文 ➜ 以前 ➜ 現在）        job-<字>.html 不用前綴，直接 student.html …
 *   B. 單字結構（字首、字根、字尾）               jobs-parts.html
 *   C. 職業故事（字源、單字怎麼變）               jobs-why.html
 *   D. 職業單字環遊世界（猜國家 ＋ 各國比較）     jobs-world.html
 *   E. 出處：每一張卡、每一幕都有「📖 出處」，直接跳到那一條證據
 * 這一組的首頁：jobs.html（根目錄首頁有一張卡連過來）
 *
 * 事實判準跟家人單字一樣：只放查得到的（OED、拉丁文辭典、各國權威辭典），
 * 查不到或學者沒有定論的，畫面上就不寫。
 */
const path = require('path');
const { build } = require('./_section');
const { e, warn, ev, I } = require('./_sources');
const WD = require('./_world');

const WORDS = [
 {f:'student',zh:'學生',icon:'🧑‍🎓',old:'studens',now:'student',src:[0,0,1],
  parts:{href:'jobs-parts.html#3'},
  e1:'📖 很認真學習的人，<b>就是 student</b>',e2:'跟 {{study}} 讀書 是一家人'},
 {f:'teacher',zh:'老師',icon:'👩‍🏫',old:'tǣcan',now:'teacher',src:[0,0,1],
  parts:{href:'jobs-parts.html#1'},
  e1:'👉 {{teach}} 教 ＋ <b>er</b>（做這件事的人）',e2:'教書的人，<b>就是 teacher</b>'},
 {f:'doctor',zh:'醫生',icon:'👨‍⚕️',old:'doctor',now:'doctor',src:[1,0,1],
  parts:{href:'jobs-parts.html#2'},
  e1:'📚 最早的 doctor 是「<b>老師</b>」',e2:'後來才用來叫<b>醫生</b>'},
 {f:'farmer',zh:'農夫',icon:'👨‍🌾',old:'fermier',now:'farmer',src:[1,0,1],
  parts:{href:'jobs-parts.html#1'},
  e1:'🌾 {{farm}} 農場 ＋ <b>er</b>',e2:'在農場工作的人，<b>就是 farmer</b>'},
 {f:'nurse',zh:'護理師',icon:'👩‍⚕️',old:'nurice',now:'nurse',src:[0,0,1],
  e1:'🍼 最早的 nurse 是「<b>餵寶寶喝奶的人</b>」',e2:'後來變成<b>照顧病人</b>的人'}
];

/* ── 出處：單字卡 ── */
const W = {
student: [
 e('student 的來源', 'OED「student, n.」；Lewis &amp; Short《A Latin Dictionary》「studeo」',
   '拉丁文 <b>studēns</b>（studēre「很認真、很用功」）。今天的 <b>study</b> 讀書也是同一家人。'),
 e('今天的意思', 'Cambridge Dictionary「student」', '在學校、大學<b>學習的人</b>。')],
teacher: [
 e('teach 以前的意思', 'OED「teach, v.」「teacher, n.」',
   '古英文 <b>tǣcan</b>：「<b>指給人看</b>、告訴、教」。teacher ＝ teach ＋ <b>-er</b>（做這件事的人）。'),
 e('-er ＝ 做這件事的人', 'Cambridge Dictionary「-er suffix」', 'teacher、farmer、player、singer：動作 ＋ <b>-er</b> ＝ <b>做這件事的人</b>。')],
doctor: [
 e('doctor 最早是老師', 'OED「doctor, n.」；Lewis &amp; Short「doctor」「doceo」',
   '拉丁文 <b>doctor</b> ＝ <b>老師</b>（docēre「教」）。大約 <b>600 年前</b>才開始叫<b>醫生</b>。'),
 e('今天的意思', 'Cambridge Dictionary「doctor」', '看病的醫生；也可以是<b>博士</b>（還留著「很有學問」的意思）。')],
farmer: [
 e('farm 以前的意思', 'OED「farm, n.1」「farmer, n.」',
   '法文 <b>ferme</b>：<b>固定要付的錢</b>（租金、稅）。最早的 <b>farmer</b> 是「<b>收租金、收稅的人</b>」。'),
 e('後來變成農夫', 'OED「farmer, n.」', '後來指「<b>租一塊地來種田的人</b>」，今天就是<b>農夫</b>；farmer ＝ farm ＋ <b>-er</b>。')],
nurse: [
 e('nurse 最早的意思', 'OED「nurse, n.1」；Lewis &amp; Short「nutrix」',
   '古法文 <b>norrice</b>，來自拉丁文 <b>nūtrīx</b> ＝ <b>餵奶的人</b>（nūtrīre「餵養」）。'),
 e('後來照顧病人', 'OED「nurse, n.1」', '大約 <b>400 多年前</b>，才有「<b>照顧病人的人</b>」這個意思。')]
};

/* ── 出處：三頁 ── */
const PARTS = [
 I('er', e('-er ＝ 做這件事的人', 'Cambridge Dictionary「-er suffix」；OED「-er, suffix1」',
   '<b>teach ＋ er</b> ＝ teacher、<b>farm ＋ er</b> ＝ farmer、<b>play ＋ er</b> ＝ player。')),
 I('or', ev('-or 也是「做這件事的人」', 'OED「-or, suffix」「doctor, n.」；Lewis &amp; Short「doceo」',
   '<b>-or</b> 是拉丁文的尾巴，跟英文的 -er 意思一樣。<b>doc</b> ＝ 教（docēre），所以 doctor 最早 ＝ <b>教書的人</b>。',
   '<div class="ev"><span class="st" style="animation-delay:.2s"><b><span class="new">doc</span></b><em>教</em></span>' +
   '<span class="ar" style="animation-delay:.5s">＋</span>' +
   '<span class="st" style="animation-delay:.8s"><b><span class="new">tor</span></b><em>做這件事的人</em></span>' +
   '<span class="ar" style="animation-delay:1.1s">＝</span>' +
   '<span class="st" style="animation-delay:1.4s"><b>doctor</b><em>最早：老師</em></span></div>')),
 I('ent', e('-ent：正在做這件事的人', 'OED「student, n.」「-ent, suffix」；Lewis &amp; Short「studeo」',
   '拉丁文 <b>studēns</b> ＝「<b>正在很認真的人</b>」。<b>stud-</b> 跟 <b>study</b> 是同一個字根。')),
 I('nurse', e('nurse 拆不開', 'OED「nurse, n.1」',
   '英文的 nurse 已經<b>拆不出零件</b>，整個背起來。它的親戚是 <b>nutrition</b>（營養）。')),
 I('de', e('德文', 'Duden「Student」「Lehrer」「Doktor」「Bauer」「Krankenschwester」',
   '<b>Doktor</b> 是口語；正式的「醫生」是 <b>Arzt</b>。')),
 I('sv', e('瑞典文', 'SAOL（瑞典學院詞表）「student」「lärare」「doktor」「bonde」「sjuksköterska」',
   '<b>doktor</b> 是口語；正式的「醫生」是 <b>läkare</b>。'))
];
const WHY = [
 I('student', e('student', 'OED「student, n.」', '拉丁文 <b>studēre</b> ＝ <b>很認真</b>。')),
 I('teacher', e('teacher', 'OED「teach, v.」', '古英文 <b>tǣcan</b> ＝ <b>指給人看</b>。')),
 I('doctor', e('doctor', 'OED「doctor, n.」', '拉丁文 doctor ＝ <b>老師</b>；約 600 年前才叫醫生。')),
 I('farmer', e('farmer', 'OED「farm, n.1」「farmer, n.」', 'ferme ＝ 租金 ➜ 收租的人 ➜ 租地種田的人 ➜ 農夫。')),
 I('nurse', e('nurse', 'OED「nurse, n.1」', '拉丁文 nūtrīx ＝ 餵奶的人 ➜ 照顧小孩 ➜ 照顧病人。')),
 I('bauer', e('Bauer 和 neighbor', 'OED「neighbour, n.」；Duden「Bauer」「Nachbar」',
   '英文 <b>neighbor</b>（鄰居）＝ <b>near</b>（近）＋ <b>bour</b>（住在那裡的人），bour 跟德文 <b>Bauer</b>（農夫）是同一個字。'))
];
const WORLD = [
 ...require('./_sources').P.world.filter(r => r.id === 'map' || r.id === 'why5'),
 I('w-student', e('student 家族', 'Duden「Student」；Van Dale「student」；SAOL「student」；Larousse「étudiant」；RAE「estudiante」',
   '五國都從<b>拉丁文 studēns</b> 來，所以都很像。')),
 warn('小提醒：德、荷、瑞典、法的 student 多半是大學生', '國小、國中的學生，德文說 <b>Schüler</b>、荷蘭文 <b>leerling</b>、瑞典文 <b>elev</b>、法文 <b>élève</b>（Duden、Van Dale、SAOL、Larousse 各詞條）。英文的 student 兩種都可以。'),
 I('w-teacher', e('teacher 跟大家都不像', 'Duden「Lehrer」「lehren」；Van Dale「leraar」；SAOL「lärare」',
   '德 <b>Lehrer</b>、荷 <b>leraar</b>、瑞典 <b>lärare</b> 都是從「<b>學習、教</b>」那個字來的，跟英文 <b>learn</b> 是親戚。')),
 I('w-doctor', e('doctor 家族', 'Duden「Doktor」；Van Dale「dokter」；SAOL「doktor」；Larousse「docteur」；RAE「doctor」',
   '五國都從<b>拉丁文 doctor</b> 來。')),
 I('w-farmer', e('farmer 跟法文最像', 'OED「farmer, n.」；Larousse「fermier」；Duden「Bauer」；Van Dale「boer」；SAOL「bonde」',
   'farmer 從<b>法文 fermier</b> 來；德、荷、瑞典用的是另一個字（<b>Bauer、boer、bonde</b>）。')),
 I('w-nurse', e('nurse：大家都不一樣', 'Duden「Krankenschwester」；SAOL「sjuksköterska」；RAE「enfermera」；Larousse「infirmière」',
   '德 <b>Kranken-schwester</b> ＝ 照顧<b>病人</b>的<b>姊妹</b>；西 <b>enfermera</b>、法 <b>infirmière</b> 都從「<b>生病</b>」那個字來。')),
 warn('瑞典文的聲音', '瑞典文用的是<b>預先做好的語音檔</b>：瑞典國家圖書館（KBLab）用<b>瑞典母語者的錄音</b>（NST 語料，CC0）訓練的神經語音 Piper sv_SE-nst。')
];

const tw = (a, b, zh, say) => '<span class="tw"><span class="sp" data-say="' + say + '">' + a + '<span class="hi">' + b + '</span></span><em>' + zh + '</em></span>';

const PAGES = [
{file:'jobs-parts.html',title:'職業單字拆開來看',sayAll:1,srcRows:PARTS,
 fwd:{href:'jobs-world.html',label:'🌍 環遊世界 →'},
 S:[
 {emoji:'🧩',mid:'職業單字，拆得開嗎？',lines:['看<b>尾巴</b>就知道：這是一個<b>人</b>']},
 {tag:'-er ＝ 做這件事的人',src:'er',
  h:'<div class="tl4 fo" style="grid-template-columns:repeat(3,auto)">' +
    tw('teach', 'er', '老師', 'teacher') + tw('farm', 'er', '農夫', 'farmer') + tw('play', 'er', '玩家', 'player') + '</div>',
  lines:['<b>動作 ＋ er</b> ＝ 做這件事的人']},
 {tag:'-or 也是「人」',src:'or',
  h:'<div class="en in d1"><span class="sp" data-say="doctor"><span class="hi2">doc</span><span class="hi">tor</span></span></div>' +
    '<div class="mean pop" style="font-size:clamp(22px,4vh,40px)">doc ＝ 教　tor ＝ 人</div>',
  lines:['最早的 doctor ＝ <b>教書的人</b>']},
 {tag:'-ent：正在做這件事的人',src:'ent',
  h:'<div class="en in d1"><span class="sp" data-say="student"><span class="hi2">stud</span><span class="hi">ent</span></span></div>' +
    '<div class="en pop" style="animation-delay:1s;font-size:clamp(24px,4.4vh,44px)"><span class="hi2">stud</span> ＝ {{study}}</div>',
  lines:['<b>很認真在讀書</b>的人']},
 {tag:'拆不開的字',emoji:'✋',src:'nurse',
  h:'<div class="en in d1">{{nurse}}</div>',
  lines:['nurse <b>拆不開</b>，整個背起來']},
 Object.assign(WD.guessOne({c:'de',w:[
   ['Student','Student','學生','student'],['Lehrer','Lehrer','老師','teacher'],['Doktor','Doktor','醫生','doctor'],
   ['Bauer','Bauer','農夫','farmer'],['Krankenschwester','Krankenschwester','護理師','nurse']],
   lines:['<b>先聽、先猜</b>：這是哪一國的話？']}),{src:'de'}),
 Object.assign(WD.guessOne({c:'sv',w:[
   ['student','student','學生','student'],['lärare','lärare','老師','teacher'],['doktor','doktor','醫生','doctor'],
   ['bonde','bonde','農夫','farmer'],['sjuksköterska','sjuksköterska','護理師','nurse']],
   lines:['再猜一次：<b>這又是哪一國？</b>']}),{src:'sv'}),
 {tag:'記住這件事',sayAll:1,
  h:'<div class="sumt fo"><table class="st g"><caption>👤 看尾巴 ＝ 看到一個人</caption>' +
    '<tr><th>尾巴</th><th>單字</th></tr>' +
    [['-er', 'teacher farmer'], ['-or', 'doctor'], ['-ent', 'student']].map(r => '<tr><td>' + r[0] + '</td><td>' +
      r[1].split(' ').map(w => '<span class="sp" data-say="' + w + '">' + w + '</span>').join('　') + '</td></tr>').join('') +
    '<tr><td>拆不開</td><td><span class="sp" data-say="nurse">nurse</span></td></tr></table></div>' +
    '<a class="golink pop" href="jobs-world.html">🌍 下一頁：職業單字環遊世界 ➜</a>',
  lines:['<b>-er、-or、-ent</b> ＝ 做這件事的人']}
]},

{file:'jobs-why.html',title:'職業單字的故事',srcRows:WHY,big:1,
 S:[
 {emoji:'🧑‍🎓👩‍🏫👨‍⚕️👨‍🌾👩‍⚕️',mid:'職業單字，以前是什麼意思？',lines:['每一個字，<b>意思都變過</b>']},
 {tag:'很認真的人',emoji:'📖',say:'student',src:'student',q:{q:'student 從拉丁文 <b>studēre</b> 來，它的意思是？',o:['很認真','很會考試','穿制服','住在學校']},
  h:'<div class="en in d1">{{student}}</div>',
  lines:['拉丁文 <b class="nosay">studēre</b> ＝ <b>很認真</b>','很認真學習的人 ➜ <b>student</b>']},
 {tag:'指給你看',emoji:'👉📖',say:'teacher',src:'teacher',q:{q:'以前的 <b>teach</b>，意思是？',o:['指給你看','打分數','罵人','唱歌']},
  h:'<div class="en in d1"><span class="fromL">{{teach}}</span> <span class="ar">＋</span> <span class="fromR hi">er</span></div>' +
    '<div class="en pop" style="animation-delay:1.2s">{{teacher}}</div>',
  lines:['以前的 <b>teach</b> ＝ <b>指給你看</b>','指給你看、教你的人 ➜ <b>teacher</b>']},
 {tag:'以前是老師',emoji:'👨‍🏫<span class="plus">➜ 👨‍⚕️</span>',say:'doctor',src:'doctor',q:{q:'最早的 <b>doctor</b> 是做什麼的？',o:['老師','醫生','廚師','農夫']},
  h:'<div class="en in d1">{{doctor}}</div>',
  lines:['最早的 doctor 是 <b>老師</b>','大約 <b>600 年前</b>，才用來叫<b>醫生</b>']},
 {tag:'以前是收租金的人',emoji:'💰<span class="plus">➜ 🌾</span>',say:'farmer',src:'farmer',q:{q:'最早的 <b>farmer</b> 是做什麼的？',o:['收租金的人','種田的人','養牛的人','賣菜的人']},
  h:'<div class="en in d1">{{farmer}}</div>',
  lines:['最早的 farmer ＝ <b>收租金的人</b>','後來 ＝ <b>租一塊地來種田的人</b> ➜ 農夫']},
 {tag:'以前是餵奶的人',emoji:'🍼<span class="plus">➜ 🏥</span>',say:'nurse',src:'nurse',q:{q:'最早的 <b>nurse</b> 是做什麼的？',o:['餵寶寶喝奶的人','打針的人','醫生的太太','送信的人']},
  h:'<div class="en in d1">{{nurse}}</div>',
  lines:['最早的 nurse ＝ <b>餵寶寶喝奶的人</b>','大約 <b>400 多年前</b> ➜ <b>照顧病人</b>的人']},
 {tag:'加碼：農夫和鄰居',emoji:'🏡',say:'neighbor',src:'bauer',q:{q:'neighbor 的 <b>bor</b>，跟德文哪一個字是同一個字？',o:['Bauer 農夫','Bär 熊','Boot 船','Brot 麵包']},
  h:'<div class="en in d1"><span class="sp" data-say="neighbor">neigh<span class="hi">bor</span></span></div>',
  lines:['<b>neighbor</b> 鄰居 ＝ 住在<b>附近</b>的人','bor 跟德文 <b>Bauer</b>（農夫）是同一個字']},
 {tag:'所以',emoji:'🗣️⏳',mid:'字的意思，會慢慢變',lines:['老師 ➜ 醫生、收租 ➜ 種田、餵奶 ➜ 照顧病人']}
]},

{file:'jobs-world.html',title:'職業單字環遊世界',sayAll:1,srcRows:WORLD,
 back:{href:'jobs-parts.html',label:'← 字的結構'},
 S:[
 {emoji:'🌍',mid:'職業單字，環遊世界',lines:['別的國家的「學生、醫生」，<b>跟英文像不像</b>？']},
 WD.SIX, WD.WHY5,
 WD.guessMany({src:'w-student',en:'student',zh:'學生',r:[['de','Student'],['nl','student'],['sv','student'],['fr','étudiant'],['es','estudiante']],
   near:['de','nl','sv','fr','es'],why:'五國都像！全部從<b>拉丁文 studēns</b> 來'}),
 WD.guessMany({src:'w-doctor',en:'doctor',zh:'醫生',r:[['de','Doktor'],['nl','dokter'],['sv','doktor'],['fr','docteur'],['es','doctor']],
   near:['de','nl','sv','fr','es'],why:'五國都像！全部從<b>拉丁文 doctor（老師）</b>來'}),
 WD.guessMany({src:'w-teacher',en:'teacher',zh:'老師',r:[['de','Lehrer'],['nl','leraar'],['sv','lärare'],['fr','professeur'],['es','profesor']],
   near:['de','nl','sv'],why:'都不像 teacher！德荷瑞典的老師，是從「<b>學習 learn</b>」那個字來的'}),
 WD.guessMany({src:'w-farmer',en:'farmer',zh:'農夫',r:[['de','Bauer'],['nl','boer'],['sv','bonde'],['fr','fermier'],['es','granjero']],
   near:['fr'],why:'farmer 從<b>法文 fermier</b> 來，所以法文最像'}),
 WD.guessMany({src:'w-nurse',en:'nurse',zh:'護理師',r:[['de','Krankenschwester'],['nl','verpleegkundige'],['sv','sjuksköterska'],['fr','infirmière'],['es','enfermera']],
   near:[],why:'大家都不一樣！德文 <b>Kranken-schwester</b> ＝ 照顧<b>病人</b>的<b>姊妹</b>'}),
 {tag:'記住這件事',sayAll:1,
  h:'<div class="sumt fo"><table class="st g"><caption>🏛 五國都像（從拉丁文來）</caption><tr><th>英文</th><th>德文</th><th>法文</th><th>西班牙文</th></tr>' +
    [['student', 'Student', 'étudiant', 'estudiante'], ['doctor', 'Doktor', 'docteur', 'doctor']].map(r => '<tr><td><span class="sp" data-say="' + r[0] + '">' + r[0] + '</span></td>' +
      '<td><span class="sp" data-say="' + r[1] + '" data-lang="de-DE">' + r[1] + '</span></td>' +
      '<td><span class="sp" data-say="' + r[2] + '" data-lang="fr-FR">' + r[2] + '</span></td>' +
      '<td><span class="sp" data-say="' + r[3] + '" data-lang="es-ES">' + r[3] + '</span></td></tr>').join('') + '</table>' +
    '<table class="st l"><caption>🤔 大家都不一樣</caption><tr><th>英文</th><th>德文</th></tr>' +
    [['teacher', 'Lehrer'], ['nurse', 'Krankenschwester']].map(r => '<tr><td><span class="sp" data-say="' + r[0] + '">' + r[0] + '</span></td>' +
      '<td><span class="sp" data-say="' + r[1] + '" data-lang="de-DE">' + r[1] + '</span></td></tr>').join('') + '</table></div>',
  lines:['<b>從拉丁文來的字</b>，很多國家都長得很像']}
]}
];

const files = build({
  dir: __dirname, font: 'fonts/', home: '../index.html', suffix: '職業單字',
  svjs: require('fs').existsSync(path.join(__dirname, 'audio', 'sv', 'aud.js')) ? '<script src="audio/sv/aud.js"></script>' : '',
  head: require('fs').existsSync(path.join(__dirname, 'audio', 'sv', 'aud.js')) ? '<script src="audio/sv/aud.js"></script>' : '',
  words: WORDS, srcW: W, pages: PAGES,
  index: { file: 'jobs.html', title: '💼 職業單字', sub: 'student　teacher　doctor　farmer　nurse',
    links: [
      { ic: '🃏', t: '5 張單字卡', d: '中文 ➜ 以前 ➜ 現在，一個字一張卡', cards: true },
      { ic: '🧩', t: '單字結構', d: '-er、-or、-ent ＝ 做這件事的人', href: 'jobs-parts.html' },
      { ic: '📜', t: '職業故事', d: 'doctor 以前是老師？nurse 以前是餵奶的人？', href: 'jobs-why.html' },
      { ic: '🌍', t: '職業單字環遊世界', d: '猜猜看是哪一國；五國比一比', href: 'jobs-world.html' }
    ] }
});
console.log('職業單字：' + files.join(' '));
