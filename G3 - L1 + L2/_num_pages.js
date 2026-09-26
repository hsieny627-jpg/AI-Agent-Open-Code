/* G3 - L1 + L2/_num_pages.js — 🔢 數字單字的「結構／故事／環遊世界」（使用者 2026-09-26 指定改版，第 12～17、21、23、24 點）
 *
 * 教學原則（使用者 2026-09-26，寫給以後的每一個主題）：
 *   看別的國家的字，一定要「幫學生記住英文」，不可以只是多背幾個外國字（認知負荷）。
 *   所以每一張都回答一個問題：這一國的字，為什麼跟英文這麼像？像在哪裡？看到它，英文哪一個字母就記住了？
 *   用的是語言學上真的存在、查得到的「字母密碼」：
 *     英文 t ＝ 德文 z（ten／zehn、two／zwei）……高地德語子音推移（Wikipedia「High German consonant shift」）
 *     英文 th ＝ 德文、荷蘭文 d（three／drei／drie）
 *     英文 gh ＝ 德文、荷蘭文 ch（eight／acht）：英文的 gh 以前會唸，德文到今天還在唸
 *     英文 -teen ＝ 德文 -zehn ＝ 荷蘭文 -tien（都是「十」）；-ty ＝ -zig ＝ -tig（幾個十）
 *   不確定的不放；每一張都有出處（src ➜ 📖 出處直接跳到那一條）。
 */
const { e, warn, ev, I } = require('../words/_sources');
const WD = require('../words/_world');
const F = WD.flag;

/* 字母密碼的小卡：cx(['<b class="e">t</b>en','🇬🇧'],['<b class="d">z</b>ehn','de']) */
const cx = (...xs) => '<span class="cx">' + xs.map(x => '<span>' + x + '</span>').join('<i>⇄</i>') + '</span>';
const E = s => '<b class="e">' + s + '</b>', Dd = s => '<b class="d">' + s + '</b>', N = s => '<b class="n">' + s + '</b>';
/* 一張數字卡：先猜哪一國（遊戲），公布以後出現「為什麼這麼像」的字母密碼（故事） */
const card = (o) => WD.guessMany({ src: o.src || 'w-num', en: o.en, zh: o.zh, tz: o.n, r: o.r, near: o.near || ['de', 'nl', 'sv'],
  why: o.why, story: o.story });
/* 三兄弟坐船：1500 年前，德國北部、荷蘭、丹麥一帶的人坐船到英國（出處 boat） */
const BRO3 = '<div class="bro3"><span class="b3">' + F('de') + '德文</span><span class="sail">⛵➜</span>' +
  '<span class="b3">' + F('nl') + '荷蘭文</span><span class="sail">⛵➜</span><span class="b3">' + F('gb') + '英文</span></div>';
/* 記住這件事：字放大、每一個字底下有中文 */
const rem = (rows, head) => '<table class="rem fo"><tr>' + (head || ['🇬🇧 英文', '德文', '荷蘭文', '中文']).map((h, k) =>
  '<th>' + (k === 1 ? F('de') : k === 2 ? F('nl') : '') + h + '</th>').join('') + '</tr>' +
  rows.map((r, j) => '<tr>' + r.map((x, k) => '<td class="' + (k === 3 ? 'z' : '') + '" style="animation-delay:' + (0.15 + j * 0.12).toFixed(2) + 's">' +
    (k === 3 ? x : '<span class="sp" data-say="' + x.replace(/<[^>]+>/g, '') + '"' + (k === 1 ? ' data-lang="de-DE"' : k === 2 ? ' data-lang="nl-NL"' : '') + '>' + x + '</span>') +
    '</td>').join('') + '</tr>').join('') + '</table>';
const REMLINE = ['1500 年前，<b>德國北部、荷蘭一帶的人坐船到英國</b>', '英文、德文、荷蘭文 ＝ <b>同一家的兄弟姊妹</b>，數字當然像'];

/* ═════════ 出處 ═════════ */
const DICT = 'Duden；Van Dale；SAOL（瑞典學院詞典）；Larousse；RAE（西班牙皇家學院詞典）';
const SRCW = [
  ...require('../words/_sources').P.world.filter(r => ['map', 'why5', 'boat', 'gmc', 'where'].indexOf(r.id) >= 0),
  I('w-num', e('五國的數字', DICT, '每一張卡上的外國數字，都照這五本字典的拼法。')),
  I('help', e('為什麼要看德文、荷蘭文的數字？', 'OED「eight」「two」；Duden「acht」；Van Dale「twee」；Durkin《The Oxford Guide to Etymology》(2009)',
    '德文、荷蘭文是英文的兄弟姊妹。英文裡<b>不唸的字母</b>（eight 的 gh、two 的 w），在兄弟姊妹的字裡<b>還聽得到</b>：acht 的 ch、twee 的 w。')),
  I('t-z', ev('英文 t ＝ 德文 z', 'Wikipedia「High German consonant shift」；Durkin (2009)；Duden「zehn」「zwei」「zwölf」「zwanzig」',
    '大約 1500 年前，德國南部的人把 <b>t</b> 唸成 <b>ts</b>（寫成 z）；英文、荷蘭文沒有跟著變，還是 t。',
    '<div class="ev"><span class="st"><b>ten ➜ zehn</b><em>t ➜ z</em></span><span class="st" style="animation-delay:.5s"><b>two ➜ zwei</b><em>t ➜ z</em></span></div>')),
  I('th-d', e('英文 th ＝ 德文、荷蘭文 d', 'OED「three」「thirty」；Duden「drei」；Van Dale「drie」；Wikipedia「Voiceless dental fricative」',
    '古英文寫 þ（th）；德文、荷蘭文後來唸成 d：three ➜ drei、drie。')),
  I('gh-ch', NUMW_EIGHT()),
  I('v-b', e('seven ＝ sieben ＝ zeven', 'OED「seven」；Duden「sieben」；Van Dale「zeven」',
    '英文 v ＝ 德文 b；荷蘭文開頭的 s 常常寫成 z（zeven、zes）。')),
  I('teen', e('-teen ＝ -zehn ＝ -tien', 'OED「-teen, suffix」；Duden「-zehn」；Van Dale「-tien」；SAOL「-ton」',
    '十三到十九的尾巴，四種語言都是「<b>十</b>」：thir<b>teen</b>、drei<b>zehn</b>、der<b>tien</b>、tret<b>ton</b>。')),
  I('ty', e('-ty ＝ -zig ＝ -tig', 'OED「-ty, suffix2」；Duden「-zig」；Van Dale「-tig」；SAOL「-tio」',
    '幾十的尾巴：古英文 <b>-tig</b> ＝ 幾個十：thir<b>ty</b>、drei<b>ßig</b>、der<b>tig</b>、tret<b>tio</b>。')),
  I('lif', ev('eleven ＝ 10 ＋ 1、twelve ＝ 10 ＋ 2', 'OED「eleven」「twelve」；Kroonen《Etymological Dictionary of Proto-Germanic》(2013)「*ainalif」「*twalif」；Watkins 詞根 leikʷ-（留下）',
    '很久以前 eleven ＝ <b>*ain-lif</b>：ain ＝ 一、lif ＝ <b>剩下</b>（跟 leave、left 同一家）。數完 10，還剩 1 ＝ 11。',
    '<div class="ev"><span class="st"><b>*ain ＋ lif</b><em>一 ＋ 剩下</em></span><span class="st" style="animation-delay:.5s"><b>eleven</b><em>10 ＋ 1</em></span></div>')),
  I('romance', e('法文、西班牙文：從拉丁文來', 'Larousse；RAE；OED「December」「century」',
    '拉丁文 decem ＝ 10 ➜ 法 dix、西 diez、英文 December（以前第 10 個月）；centum ＝ 100 ➜ cent、cien、century。')),
  I('fr20', e('法文 20 個一數', 'Larousse「soixante-dix」「quatre-vingts」「quatre-vingt-dix」；Wikipedia「French numerals」',
    '70 ＝ soixante-dix（60 ＋ 10）、80 ＝ quatre-vingts（4 ✕ 20）、90 ＝ quatre-vingt-dix（4 ✕ 20 ＋ 10）。')),
  I('es16', e('西班牙文 16 ＝ 10 和 6', 'RAE「dieciséis」', 'dieciséis ＝ diez y seis（10 和 6）；17、18、19 也是。')),
  I('rhyme', e('four and twenty ＝ 24', 'Opie & Opie《The Oxford Dictionary of Nursery Rhymes》(1951)「Sing a Song of Sixpence」；Duden「einundzwanzig」',
    '英國童謠：<b>Four and twenty blackbirds</b>（24 隻黑鳥）。以前英文也像德文一樣先說個位：ein-und-zwanzig ＝ 一和二十 ＝ 21。')),
  I('tachtig', e('荷蘭文 80 多一個 t', 'Van Dale「tachtig」；Philippa e.a.《Etymologisch Woordenboek van het Nederlands》(2003–2009)「tachtig」',
    '荷蘭文 80 ＝ <b>t</b>achtig：前面多出來的 t，是古時候說法留下來的尾巴。')),
  I('zero-w', e('zero 家族', 'OED「zero」「cipher」；Duden「Null」；Larousse「zéro」；RAE「cero」',
    '法 zéro、西 cero、英 zero：從阿拉伯文 ṣifr（空的）經過義大利傳來；德、荷、瑞典用拉丁文 nulla（沒有）➜ Null、nul、noll。')),
  warn('瑞典文的聲音', '瑞典文用的是<b>預先做好的語音檔</b>（Piper sv_SE-nst，瑞典母語者錄音 NST 訓練，CC0）；還沒做成語音檔的字用電腦的瑞典文語音。')
];
function NUMW_EIGHT() {
  return e('英文 gh ＝ 德文、荷蘭文 ch', 'OED「eight」「night」；Duden「acht」「Nacht」；Van Dale「acht」',
    '古英文 eahta 的 h 有唸出來（像德文 acht 的 ch）；後來英文不唸了，gh 留著。night ＝ Nacht、light ＝ Licht 也一樣。');
}

/* ═════════ 引子：為什麼看這幾國？（使用者第 15 點）═════════ */
const WHYSEE = {
  tag: '🤔 看別國的數字，對學英文有什麼用？', src: 'help',
  h: '<div class="lk fo">' +
    '<span class="fl" style="animation-delay:.1s">' + F('gb') + '英文</span><span class="fl" style="animation-delay:.1s">' + F('de') + '德文</span><span class="fl" style="animation-delay:.1s">' + F('nl') + '荷蘭文</span>' +
    '<span class="w sp" data-say="eight" style="animation-delay:.3s">ei<span class="e" style="opacity:.35">gh</span>t</span>' +
    '<span class="w sp" data-say="acht" data-lang="de-DE" style="animation-delay:.7s">a<span class="d">ch</span>t</span>' +
    '<span class="w sp" data-say="acht" data-lang="nl-NL" style="animation-delay:1.1s">a<span class="d">ch</span>t</span>' +
    '<span class="w sp" data-say="two" style="animation-delay:.3s">t<span class="e" style="opacity:.35">w</span>o</span>' +
    '<span class="w sp" data-say="zwei" data-lang="de-DE" style="animation-delay:.7s">z<span class="d">w</span>ei</span>' +
    '<span class="w sp" data-say="twee" data-lang="nl-NL" style="animation-delay:1.1s">t<span class="d">w</span>ee</span>' +
    '<span class="zz">英文<b>不唸</b>的字母，兄弟姊妹<b>還在唸</b>！</span></div>',
  lines: ['看一眼兄弟姊妹，<b>灰色的字母就記住了</b>']
};

/* ═════════ 🧩 數字的結構（第 12、13、14、16 點）═════════ */
const PARTS = [
  I('cant', e('one～ten 拆不開', 'OED 各詞條', 'one 到 ten 在英文裡<b>拆不出零件</b>，整個背起來。')),
  ...SRCW.filter(r => ['lif', 'teen', 'ty', 'help', 'w-num', 'boat', 'gmc', 'gh-ch', 'where', 'map'].indexOf(r.id) >= 0),
  I('fam', e('one、two 的家人', 'OED「once」「only」「alone」「none」「twin」「twice」「twenty」「between」；Etymonline 同名詞條',
    '<b>once</b>（古英文 ānes）、<b>only</b>（ānlic）、<b>alone</b>（all ＋ one）、<b>none</b>（ne ＋ ān 一個也沒有）都藏著 one；' +
    '<b>twin</b>、<b>twice</b>、<b>twelve</b>、<b>twenty</b>（two ＋ ten）、<b>between</b>（在兩個中間）都藏著 tw（二）。')),
  I('de', e('德文數字', 'Duden「eins」「zwei」「drei」「vier」「fünf」', 'eins zwei drei vier fünf。')),
  I('sv', e('瑞典文數字', 'SAOL「en」「två」「tre」「fyra」「fem」', 'en två tre fyra fem。')),
  SRCW[SRCW.length - 1]
];
const ONEFAM = [['once', 'on', 'ce', '一次'], ['only', 'on', 'ly', '只有一個'], ['alone', 'al', 'one', '單獨一個'], ['none', 'n', 'one', '一個也沒有'], ['eleven', 'e', 'leven', '十一']];
const TWOFAM = [['twin', 'tw', 'in', '雙胞胎'], ['twice', 'tw', 'ice', '兩次'], ['twelve', 'tw', 'elve', '十二'], ['twenty', 'tw', 'enty', '二十'], ['between', 'be', 'tween', '在兩個中間']];
const famBox = (cls, title, rows, hl) => '<div class="nfam ' + cls + '"><div class="nft">' + title + '</div>' + rows.map((r, k) => {
  const w = r[0], i0 = hl(w), a = w.slice(0, i0[0]), b = w.slice(i0[0], i0[1]), c = w.slice(i0[1]);
  return '<div class="nfw" style="animation-delay:' + (0.4 + k * 0.35).toFixed(2) + 's"><span class="sp" data-say="' + w + '">' + a + '<b>' + b + '</b>' + c + '</span><em>' + r[3] + '</em></div>';
}).join('') + '</div>';
const oneAt = w => { const i = w.indexOf('one'); if (i >= 0) return [i, i + 3]; if (w.indexOf('on') === 0) return [0, 2]; return [0, 1]; };
const twoAt = w => { const i = w.indexOf('tw'); return [i, i + 2]; };
const CSS = `
.nfams{display:grid;grid-template-columns:1fr 1fr;gap:clamp(10px,2vw,26px);width:100%;max-width:900px}
.nfam{border-radius:20px;padding:clamp(6px,1.2vh,14px) clamp(10px,1.6vw,20px);display:flex;flex-direction:column;gap:clamp(2px,.5vh,6px)}
.nfam.o{background:#0A1622;border:2px solid #5AD1FF}.nfam.t{background:#1F1406;border:2px solid #FFB35A}
.nft{font-size:clamp(20px,3.4vh,32px);font-weight:700;text-align:center}
.nfam.o .nft{color:#5AD1FF}.nfam.t .nft{color:#FFB35A}
.nfw{display:flex;align-items:baseline;justify-content:space-between;gap:10px;opacity:0;animation:nfIn .6s cubic-bezier(.2,1.3,.4,1) forwards}
.nfw .sp{font-size:clamp(22px,4vh,40px);font-weight:700;border-bottom:0;color:#F2F2F2}
.nfam.o .nfw b{color:#5AD1FF}.nfam.t .nfw b{color:#FFB35A}
.nfw em{font-style:normal;font-size:clamp(15px,2.4vh,23px);color:#D8D3C5;font-weight:700;white-space:nowrap}
@keyframes nfIn{from{opacity:0;transform:translateX(-30px) scale(.8)}to{opacity:1;transform:none}}
/* eleven ＝ 10 ＋ 1：藍色 ＝ 幾個、金色粗體 ＝ 10 */
.ten1{display:grid;grid-template-columns:auto auto auto;align-items:center;justify-content:center;column-gap:clamp(12px,2.4vw,30px);row-gap:clamp(6px,1.4vh,16px)}
.ten1 .w{font-size:clamp(42px,8.4vh,86px);font-weight:700;border-bottom:0;opacity:0;animation:nfIn .6s ease forwards}
.ten1 .w .one{color:#5AD1FF}.ten1 .w .ten{color:#FFD24A;font-weight:800;text-decoration:underline;text-decoration-thickness:.08em;text-underline-offset:.12em}
.ten1 .eq{font-size:clamp(30px,6vh,60px);color:#8E8E8E;opacity:0;animation:nfIn .5s ease forwards}
.ten1 .m{font-size:clamp(36px,7.4vh,74px);font-weight:700;opacity:0;animation:nfIn .6s cubic-bezier(.2,1.5,.4,1) forwards;white-space:nowrap}
.ten1 .m .one{color:#5AD1FF}.ten1 .m .ten{color:#FFD24A}
.leg{display:flex;gap:clamp(10px,2vw,26px);justify-content:center;flex-wrap:wrap;font-size:clamp(19px,3.2vh,30px);font-weight:700}
.leg span{padding:.1em .6em;border-radius:99px}
.leg .one{color:#5AD1FF;background:#0A1622;border:1px solid #29465E}.leg .ten{color:#FFD24A;background:#1D1908;border:1px solid #6B5714}
.fing{font-size:clamp(34px,6.6vh,64px);letter-spacing:.05em}
.fing .p1{display:inline-block;animation:p1 1.2s cubic-bezier(.2,1.6,.4,1) 1.4s both}
@keyframes p1{from{transform:scale(0) rotate(-40deg);opacity:0}to{transform:none;opacity:1}}
/* thirteen／thirty：teen 金色、ty 藍色，粗體 */
.tt{display:grid;grid-template-columns:auto auto auto;align-items:center;justify-content:center;column-gap:clamp(12px,2.4vw,30px);row-gap:clamp(8px,1.6vh,18px)}
.tt .w{font-size:clamp(44px,8.8vh,88px);font-weight:700;border-bottom:0;opacity:0;animation:nfIn .6s ease forwards}
.tt .teen{color:#FFD24A;font-weight:800}.tt .ty{color:#5AD1FF;font-weight:800}
.tt .m{font-size:clamp(26px,5.2vh,52px);font-weight:700;opacity:0;animation:nfIn .6s ease forwards;white-space:nowrap}
.tt .m .teen{color:#FFD24A}.tt .m .ty{color:#5AD1FF}
.fr80{display:flex;align-items:center;justify-content:center;gap:clamp(8px,1.6vw,20px);flex-wrap:wrap;font-size:clamp(34px,7vh,70px);font-weight:700}
.fr80 span{opacity:0;animation:nfIn .6s cubic-bezier(.2,1.5,.4,1) forwards}
.fr80 .x{color:#FF9EC7}.fr80 .v{color:#5AD1FF}
.birds{font-size:clamp(20px,3.6vh,34px);line-height:1.1;max-width:14em;text-align:center}
.birds i{font-style:normal;display:inline-block;opacity:0;animation:nfIn .3s ease forwards}
`;

const numP = [
  { emoji: '🔢', mid: '數字單字，拆得開嗎？', lines: ['one 到 ten <b>拆不開</b>，eleven、twelve <b>拆得開</b>'] },
  { tag: '拆不開：整個背', emoji: '✋', src: 'cant',
    h: '<div class="en in d1" style="font-size:clamp(26px,4.8vh,48px);line-height:1.6">{{one}} {{two}} {{three}} {{four}} {{five}}<br>{{six}} {{seven}} {{eight}} {{nine}} {{ten}}</div>',
    lines: ['one 到 ten <b>拆不開</b>，整個背起來'] },
  /* 第 12、16 點：eleven 是不是 1 ＋ 10？是！藍色 ＝ 幾個，金色粗體 ＝ 10 */
  { tag: 'eleven ＝ 10 ＋ 1？', src: 'lif',
    q: { q: '<b>eleven</b> 是 11。它是怎麼組起來的？', o: ['10 ＋ 1', '1 ＋ 1', '5 ＋ 6', '11 ✕ 1'] },
    h: '<div class="fing"><span>🖐🖐</span> <span class="p1">＋ ☝️</span></div>' +
      '<div class="ten1">' +
      '<span class="w sp" data-say="eleven" style="animation-delay:.3s"><span class="one">e</span><span class="ten">leven</span></span><span class="eq" style="animation-delay:.6s">＝</span>' +
      '<span class="m" style="animation-delay:.9s"><span class="ten">10</span> ＋ <span class="one">1</span></span>' +
      '<span class="w sp" data-say="twelve" style="animation-delay:1.3s"><span class="one">tw</span><span class="ten">elve</span></span><span class="eq" style="animation-delay:1.6s">＝</span>' +
      '<span class="m" style="animation-delay:1.9s"><span class="ten">10</span> ＋ <span class="one">2</span></span></div>' +
      '<div class="leg"><span class="one">藍色 ＝ 1、2</span><span class="ten">金色 ＝ 10</span></div>',
    lines: ['<b>對！</b>eleven ＝ <b>10 ＋ 1</b>，twelve ＝ <b>10 ＋ 2</b>'] },
  { tag: '金色的 leven、lve 是什麼？', src: 'lif',
    h: '<div class="lk fo" style="grid-template-columns:auto auto">' +
      '<span class="w sp" data-say="leave" style="animation-delay:.2s"><span class="e">leave</span></span><span class="fl" style="animation-delay:.4s;font-size:clamp(20px,3.4vh,32px)">留下、剩下</span>' +
      '<span class="w sp" data-say="eleven" style="animation-delay:.8s">e<span class="e">leven</span></span><span class="fl" style="animation-delay:1s;font-size:clamp(20px,3.4vh,32px)">數完 10，<b>剩下 1</b></span>' +
      '<span class="w sp" data-say="twelve" style="animation-delay:1.4s">tw<span class="e">elve</span></span><span class="fl" style="animation-delay:1.6s;font-size:clamp(20px,3.4vh,32px)">數完 10，<b>剩下 2</b></span></div>',
    lines: ['很久以前：<b>leven、lve ＝ 剩下</b>（跟 leave 是一家）', '十根手指數完，<b>還剩幾個</b> ➜ 11、12'] },
  /* 第 13 點：one 家族（藍）、two 家族（橘），分門別類、飛進來 */
  { tag: 'one、two 的家人', src: 'fam',
    q: { q: '<b>alone</b>（單獨一個）裡面，藏著哪一個數字？', o: ['one 一', 'two 二', 'ten 十', 'zero 零'] },
    h: '<div class="nfams fo">' + famBox('o', '1️⃣ 藏著 one', ONEFAM, oneAt) + famBox('t', '2️⃣ 藏著 tw（二）', TWOFAM, twoAt) + '</div>',
    lines: ['<b style="color:#5AD1FF">藍色</b> ＝ one 的家人，<b style="color:#FFB35A">橘色</b> ＝ two 的家人'] },
  /* 第 14 點：teen、ty 不同顏色、粗體 */
  { tag: '十三以後：-teen、-ty', src: 'teen',
    q: { q: '<b>thirteen</b> 和 <b>thirty</b>，哪一個是 30？', o: ['thirty', 'thirteen', '兩個都是', '兩個都不是'] },
    h: '<div class="tt fo">' +
      '<span class="w sp" data-say="thirteen" style="animation-delay:.2s">thir<span class="teen">teen</span></span><span class="m" style="animation-delay:.5s">＝</span><span class="m" style="animation-delay:.8s">3 ＋ <span class="teen">10</span> ＝ 13</span>' +
      '<span class="w sp" data-say="thirty" style="animation-delay:1.2s">thir<span class="ty">ty</span></span><span class="m" style="animation-delay:1.5s">＝</span><span class="m" style="animation-delay:1.8s">3 ✕ <span class="ty">10</span> ＝ 30</span></div>',
    lines: ['<b style="color:#FFD24A">-teen</b> ＝ 十幾（加 10），<b style="color:#5AD1FF">-ty</b> ＝ 幾十（乘 10）'] },
  /* 第 15 點：為什麼看這幾國 ➜ 真實的語言故事 ➜ 對英文有什麼幫助 */
  WD.WHERE,
  Object.assign({}, WD.MAPS[2], { lines: ['1500 年前，<b>德國北部、荷蘭一帶的人坐船到英國</b>', '他們說的話，<b>就是英文的祖先</b>'] }),
  WD.TREE,
  WHYSEE,
  Object.assign(WD.guessOne({ c: 'de', tag: '🕵️ 這是哪一國的【數字單字】？', w: [['eins', 'eins', '一', 'one'], ['zwei', 'zwei', '二', 'two'], ['drei', 'drei', '三', 'three'], ['vier', 'vier', '四', 'four'], ['fünf', 'fünf', '五', 'five']],
    lines: ['<b>先聽、先猜</b>：這是哪一國的【數字單字】？'] }), { src: 'de' }),
  Object.assign(WD.guessOne({ c: 'sv', tag: '🕵️ 這又是哪一國的【數字單字】？', w: [['en', 'en', '一', 'one'], ['två', 'två', '二', 'two'], ['tre', 'tre', '三', 'three'], ['fyra', 'fyra', '四', 'four'], ['fem', 'fem', '五', 'five']],
    lines: ['再猜一次：<b>這又是哪一國的【數字單字】？</b>'] }), { src: 'sv' }),
  /* 第 16 點：記住這件事——字放大、顏色、簡潔 */
  { tag: '記住這件事', sayAll: 1, src: 'lif',
    h: '<div class="ten1 fo">' +
      '<span class="w sp" data-say="eleven" style="animation-delay:.2s"><span class="one">e</span><span class="ten">leven</span></span><span class="eq" style="animation-delay:.3s">＝</span><span class="m" style="animation-delay:.4s"><span class="ten">10</span> ＋ <span class="one">1</span></span>' +
      '<span class="w sp" data-say="twelve" style="animation-delay:.6s"><span class="one">tw</span><span class="ten">elve</span></span><span class="eq" style="animation-delay:.7s">＝</span><span class="m" style="animation-delay:.8s"><span class="ten">10</span> ＋ <span class="one">2</span></span></div>' +
      '<div class="leg"><span class="one">藍色 ＝ 1、2</span><span class="ten">金色粗體 ＝ 10</span></div>' +
      '<a class="golink pop" href="numbers-world.html">🌍 下一頁：數字環遊世界 ➜</a>',
    lines: ['其他的數字，<b>整個背起來</b>'] }
];

/* ═════════ 📜 數字的故事（第 21、23、24 點：先猜 ➜ 顛覆認知 ➜ 動畫揭曉）═════════ */
const WHYR = [
  I('zero', e('zero 的旅行', 'OED「zero, n.」「cipher, n.」；Ifrah《The Universal History of Numbers》(2000)；Wikipedia「0」「Fibonacci」',
    '把 0 當成一個數字來算，最早在<b>印度</b>（梵文 śūnya ＝ 空的）➜ 阿拉伯文 <b>ṣifr</b> ➜ 1202 年義大利人 <b>Fibonacci</b> 寫進書裡 ➜ 英文 zero。cipher（密碼）也是 ṣifr 變的。')),
  I('months', e('September 是第 7 個月？', 'OED「September, n.」「October」「November」「December」；Wikipedia「Roman calendar」',
    '羅馬人最早的曆法<b>從三月開始算</b>：septem 7、octo 8、novem 9、decem 10。後來一月、二月排到最前面，名字沒改。')),
  ...SRCW.filter(r => ['gh-ch', 'lif', 'rhyme', 'fr20'].indexOf(r.id) >= 0),
  I('two', e('two 的 w', 'OED「two」「twin」「twice」', '古英文 <b>twā</b> 的 w 有唸出來；後來 two 的 w 不唸了，twin、twice 的 w 到今天還在唸。'))
];
const sayR = (w, d) => '<span class="cx" style="animation-delay:' + d + 's"><span>' + w + '</span></span>';
const numW = [
  { emoji: '🔢', mid: '數字，藏著好多故事', lines: ['<b>先猜一猜</b>，再看答案'] },
  { tag: 'zero 的旅行', src: 'zero', say: 'zero',
    q: { q: '把「<b>0</b>」當成數字來算，最早是哪裡的人？', o: ['印度', '英國', '美國', '日本'] },
    h: '<div class="gstory" style="display:flex">' + sayR('🇮🇳 śūnya<em>空的</em>', .2) + sayR('🕌 ṣifr<em>空的</em>', .7) +
      sayR('🇮🇹 zefiro<em>1202 年</em>', 1.2) + sayR('🇬🇧 {{zero}}', 1.7) + '</div>',
    lines: ['「<b>空的</b>」：印度 ➜ 阿拉伯 ➜ 義大利 ➜ 英國', '<b>cipher</b>（密碼）也是 ṣifr 變的'] },
  { tag: '月份的祕密', src: 'months', say: 'September',
    q: { q: '<b>Sept</b>ember 是 9 月。可是 <b>Sept</b> 在拉丁文是幾？', o: ['7', '9', '1', '12'] },
    h: '<div class="en in d1" style="font-size:clamp(24px,4.4vh,42px);line-height:1.6">' +
      '<span class="sp" data-say="September"><span class="hi">Sept</span>ember</span> ＝ 7　<span class="sp" data-say="October"><span class="hi">Oct</span>ober</span> ＝ 8<br>' +
      '<span class="sp" data-say="November"><span class="hi">Nov</span>ember</span> ＝ 9　<span class="sp" data-say="December"><span class="hi">Dec</span>ember</span> ＝ 10</div>',
    lines: ['羅馬人以前一年<b>從三月開始算</b>', '所以 September 原本是<b>第 7 個月</b>'] },
  { tag: 'gh 以前會唸', src: 'gh-ch', say: 'eight',
    q: { q: '<b>eight</b> 的 gh 為什麼不唸？', o: ['以前會唸，後來不唸，字母留下來', '寫錯字了', '為了好看', '只有美國人不唸'] },
    h: '<div class="lk fo" style="grid-template-columns:auto auto">' +
      '<span class="w" style="animation-delay:.2s">ei<span class="e" style="opacity:.35">gh</span>t</span><span class="w sp" data-say="acht" data-lang="de-DE" style="animation-delay:.6s">' + F('de') + ' a<span class="d">ch</span>t</span>' +
      '<span class="w" style="animation-delay:1s">ni<span class="e" style="opacity:.35">gh</span>t</span><span class="w sp" data-say="Nacht" data-lang="de-DE" style="animation-delay:1.4s">' + F('de') + ' Na<span class="d">ch</span>t</span></div>',
    lines: ['英文 gh ＝ 德文 <b>ch</b>：德文到今天<b>還在唸</b>', 'night 晚上 ＝ Nacht，<b>一樣的密碼</b>'] },
  { tag: 'two 的 w', src: 'two', say: 'two',
    q: { q: '<b>two</b> 的 w 不唸。下面哪一個字的 w <b>還在唸</b>？', o: ['twin 雙胞胎', 'write 寫', 'answer 回答', 'sword 劍'] },
    h: '<div class="en in d1" style="font-size:clamp(30px,5.6vh,54px)">{{two}}　{{twin}}　{{twice}}</div>',
    lines: ['以前 two 的 <b>w 有唸</b>', 'twin、twice 的 w <b>到今天還在唸</b>'] },
  { tag: '數手指', src: 'lif', say: 'eleven',
    q: { q: '<b>eleven</b> 最早的意思是？', o: ['數完 10，還剩 1', '兩個 1', '一個人十根手指', '很多很多'] },
    h: '<div class="fing"><span>🖐🖐</span> <span class="p1">＋ ☝️</span></div><div class="en in d1" style="font-size:clamp(30px,5.6vh,54px)">{{eleven}}　{{twelve}}</div>',
    lines: ['數完十根手指，<b>還剩一</b> ➜ eleven', '<b>還剩二</b> ➜ twelve'] },
  { tag: '童謠裡的 24', src: 'rhyme', say: 'four and twenty',
    q: { q: '英國童謠唱「<b>four and twenty</b> blackbirds」，是幾隻鳥？', o: ['24', '420', '4', '6'] },
    h: '<div class="birds">' + Array.from({ length: 24 }, (_, k) => '<i style="animation-delay:' + (0.1 + k * 0.06).toFixed(2) + 's">🐦‍⬛</i>').join('') + '</div>' +
      '<div class="gstory" style="display:flex">' + sayR('four and twenty<em>4 和 20</em>', .4) + sayR(F('de') + ' vierundzwanzig<em>4 和 20</em>', 1) + sayR('＝ 24', 1.6) + '</div>',
    lines: ['以前英文也像德文：<b>先說 4，再說 20</b>', '今天英文改成 <b>twenty-four</b>'] },
  { tag: '法國人怎麼數 80', src: 'fr20', say: 'eighty',
    q: { q: '法文的「<b>80</b>」，直接翻成中文是？', o: ['4 個 20', '8 個 10', '100 少 20', '80'] },
    h: '<div class="fr80"><span style="animation-delay:.2s">' + F('fr') + '</span><span class="x" style="animation-delay:.5s">quatre</span><span style="animation-delay:.8s">✕</span>' +
      '<span class="v" style="animation-delay:1.1s">vingts</span><span style="animation-delay:1.4s">＝</span><span style="animation-delay:1.7s">4 ✕ 20 ＝ 80</span></div>',
    lines: ['法國人 <b>20 個一數</b>：80 ＝ 4 個 20', '英文、德文、荷蘭文：<b>10 個一數</b> ➜ eighty ＝ 8 個 10'] },
  { tag: '所以', emoji: '🗣️⏳', mid: '數字也有故事', lines: ['記住故事，<b>拼字就記得住</b>'] }
];

/* ═════════ 🌍 數字環遊世界：基礎 0～10（11 張）、進階 11～20（10 張）、進階 30～100（8 張）（第 17 點）═════════ */
const R = (de, nl, sv, fr, es) => [['de', de], ['nl', nl], ['sv', sv], ['fr', fr], ['es', es]];
const W0 = [
  card({ n: '0', en: 'zero', zh: '零', src: 'zero-w', r: R('Null', 'nul', 'noll', 'zéro', 'cero'), near: ['fr', 'es'],
    why: '法、西 <b>zéro、cero</b> 跟英文一樣，從阿拉伯文「空的」來', story: cx(F('fr') + ' z<b class="e">é</b>ro', F('es') + ' <b class="e">c</b>ero', '🇬🇧 zero') + cx(F('de') + ' Null<em>沒有</em>', '🇬🇧 null<em>無效</em>') }),
  card({ n: '1', en: 'one', zh: '一', r: R('eins', 'een', 'en／ett', 'un', 'uno'),
    why: '六國都是 <b>母音 ＋ n</b>', story: cx('🇬🇧 o<b class="e">n</b>e', F('de') + ' ei<b class="d">n</b>s', F('nl') + ' ee<b class="d">n</b>', F('sv') + ' e<b class="d">n</b>') }),
  card({ n: '2', en: 'two', zh: '二', src: 't-z', r: R('zwei', 'twee', 'två', 'deux', 'dos'), near: ['nl', 'sv'],
    why: '荷蘭文 <b>twee</b> 還在唸 w！德文 t 變 <b>z</b>', story: cx('🇬🇧 ' + E('t') + 'wo', F('de') + ' ' + Dd('z') + 'wei') + cx('🇬🇧 t' + E('w') + 'o<em>w 不唸</em>', F('nl') + ' t' + Dd('w') + 'ee<em>w 還在唸</em>') }),
  card({ n: '3', en: 'three', zh: '三', src: 'th-d', r: R('drei', 'drie', 'tre', 'trois', 'tres'), near: ['de', 'nl', 'sv', 'fr', 'es'],
    why: '六國都像！英文 <b>th</b> ＝ 德、荷 <b>d</b>', story: cx('🇬🇧 ' + E('th') + 'ree', F('de') + ' ' + Dd('d') + 'rei', F('nl') + ' ' + Dd('d') + 'rie') }),
  card({ n: '4', en: 'four', zh: '四', r: R('vier', 'vier', 'fyra', 'quatre', 'cuatro'), near: ['de', 'nl', 'sv'],
    why: '德文 <b>v</b> 唸成 <b>f</b>：vier 聽起來像「fear」', story: cx('🇬🇧 ' + E('f') + 'our', F('de') + ' ' + Dd('v') + 'ier<em>v 唸 f</em>', F('sv') + ' ' + Dd('f') + 'yra') }),
  card({ n: '5', en: 'five', zh: '五', r: R('fünf', 'vijf', 'fem', 'cinq', 'cinco'),
    why: '德、荷、瑞典都是 <b>f／v</b> 開頭', story: cx('🇬🇧 ' + E('f') + 'ive', F('de') + ' ' + Dd('f') + 'ünf', F('nl') + ' ' + Dd('v') + 'ijf', F('sv') + ' ' + Dd('f') + 'em') }),
  card({ n: '6', en: 'six', zh: '六', src: 'v-b', r: R('sechs', 'zes', 'sex', 'six', 'seis'), near: ['de', 'sv', 'fr'],
    why: '法文<b>一模一樣：six</b>！荷蘭文 s 寫成 <b>z</b>', story: cx('🇬🇧 six', F('fr') + ' six<em>一模一樣</em>') + cx('🇬🇧 ' + E('s') + 'ix', F('nl') + ' ' + Dd('z') + 'es') }),
  card({ n: '7', en: 'seven', zh: '七', src: 'v-b', r: R('sieben', 'zeven', 'sju', 'sept', 'siete'), near: ['de', 'nl'],
    why: '英文 <b>v</b> ＝ 德文 <b>b</b>；荷蘭文 <b>zeven</b> 最像', story: cx('🇬🇧 se' + E('v') + 'en', F('de') + ' sie' + Dd('b') + 'en', F('nl') + ' ' + Dd('z') + 'e' + Dd('v') + 'en') }),
  card({ n: '8', en: 'eight', zh: '八', src: 'gh-ch', r: R('acht', 'acht', 'åtta', 'huit', 'ocho'), near: ['de', 'nl'],
    why: '德、荷的 <b>ch</b>，就是英文 <b>gh</b> 以前的聲音', story: cx('🇬🇧 ei' + E('gh') + 't<em>gh 不唸</em>', F('de') + ' a' + Dd('ch') + 't<em>ch 還在唸</em>') }),
  card({ n: '9', en: 'nine', zh: '九', r: R('neun', 'negen', 'nio', 'neuf', 'nueve'), near: ['de', 'nl', 'sv', 'fr', 'es'],
    why: '六國都是 <b>n</b> 開頭！', story: cx('🇬🇧 ' + E('n') + 'ine', F('de') + ' ' + Dd('n') + 'eun', F('nl') + ' ' + Dd('n') + 'egen', F('fr') + ' ' + Dd('n') + 'euf') }),
  card({ n: '10', en: 'ten', zh: '十', src: 't-z', r: R('zehn', 'tien', 'tio', 'dix', 'diez'), near: ['nl', 'sv'],
    why: '荷蘭文 <b>tien</b> 最像；德文 t 變 <b>z</b>：zehn', story: cx('🇬🇧 ' + E('t') + 'en', F('de') + ' ' + Dd('z') + 'ehn', F('nl') + ' ' + Dd('t') + 'ien') + cx(F('fr') + ' dix', '🇬🇧 <b class="x">Dec</b>ember<em>以前第 10 個月</em>') })
];
const W1 = [
  card({ n: '11', en: 'eleven', zh: '十一', src: 'lif', r: R('elf', 'elf', 'elva', 'onze', 'once'),
    why: '德、荷、瑞典也是「<b>數完 10，剩下 1</b>」', story: cx('🇬🇧 e' + E('leven'), F('de') + ' e' + Dd('lf'), F('sv') + ' e' + Dd('lva')) }),
  card({ n: '12', en: 'twelve', zh: '十二', src: 'lif', r: R('zwölf', 'twaalf', 'tolv', 'douze', 'doce'),
    why: '「<b>數完 10，剩下 2</b>」；荷蘭文 <b>tw</b>aalf 最像', story: cx('🇬🇧 ' + E('tw') + 'elve', F('nl') + ' ' + Dd('tw') + 'aalf', F('de') + ' ' + Dd('zw') + 'ölf') }),
  card({ n: '13', en: 'thirteen', zh: '十三', src: 'teen', r: R('dreizehn', 'dertien', 'tretton', 'treize', 'trece'),
    why: '尾巴都是「<b>十</b>」：-teen ＝ -zehn ＝ -tien', story: cx('🇬🇧 thir' + E('teen'), F('de') + ' drei' + Dd('zehn'), F('nl') + ' der' + Dd('tien')) }),
  card({ n: '14', en: 'fourteen', zh: '十四', src: 'teen', r: R('vierzehn', 'veertien', 'fjorton', 'quatorze', 'catorce'),
    why: '4 ＋ <b>10</b>：vier-<b>zehn</b>、veer-<b>tien</b>', story: cx('🇬🇧 four' + E('teen'), F('de') + ' vier' + Dd('zehn'), F('nl') + ' veer' + Dd('tien')) }),
  card({ n: '15', en: 'fifteen', zh: '十五', src: 'teen', r: R('fünfzehn', 'vijftien', 'femton', 'quinze', 'quince'),
    why: '5 ＋ <b>10</b>：英文 five 變成 <b>fif</b>', story: cx('🇬🇧 ' + E('fif') + 'teen', F('de') + ' ' + Dd('fünf') + 'zehn', F('nl') + ' ' + Dd('vijf') + 'tien') }),
  card({ n: '16', en: 'sixteen', zh: '十六', src: 'es16', r: R('sechzehn', 'zestien', 'sexton', 'seize', 'dieciséis'),
    why: '西班牙文：dieci-séis ＝ <b>10 和 6</b>', story: cx('🇬🇧 six' + E('teen') + '<em>6 ＋ 10</em>', F('es') + ' ' + N('dieci') + 'séis<em>10 和 6</em>') }),
  card({ n: '17', en: 'seventeen', zh: '十七', src: 'teen', r: R('siebzehn', 'zeventien', 'sjutton', 'dix-sept', 'diecisiete'), near: ['de', 'nl'],
    why: '法文 <b>dix-sept</b> ＝ 10 ＋ 7：<b>先說 10，再說 7</b>！', story: cx('🇬🇧 seven' + E('teen'), F('de') + ' sieb' + Dd('zehn')) + cx(F('fr') + ' ' + N('dix') + '-sept<em>10、7</em>') }),
  card({ n: '18', en: 'eighteen', zh: '十八', src: 'gh-ch', r: R('achtzehn', 'achttien', 'arton', 'dix-huit', 'dieciocho'), near: ['de', 'nl'],
    why: '德、荷：<b>acht</b> ＋ 十，ch 還在唸', story: cx('🇬🇧 ei' + E('gh') + 't' + E('een'), F('de') + ' a' + Dd('ch') + 't' + Dd('zehn'), F('nl') + ' a' + Dd('ch') + 't' + Dd('tien')) }),
  card({ n: '19', en: 'nineteen', zh: '十九', src: 'teen', r: R('neunzehn', 'negentien', 'nitton', 'dix-neuf', 'diecinueve'),
    why: '9 ＋ <b>10</b>：neun-<b>zehn</b>、negen-<b>tien</b>', story: cx('🇬🇧 nine' + E('teen'), F('de') + ' neun' + Dd('zehn'), F('nl') + ' negen' + Dd('tien')) }),
  card({ n: '20', en: 'twenty', zh: '二十', src: 'rhyme', r: R('zwanzig', 'twintig', 'tjugo', 'vingt', 'veinte'), near: ['de', 'nl'],
    why: '<b>tw</b> ＝ 二、<b>-ty</b> ＝ 幾個十：兩個十 ＝ 20', story: cx('🇬🇧 ' + E('tw') + 'en' + E('ty'), F('nl') + ' ' + Dd('tw') + 'in' + Dd('tig'), F('de') + ' ' + Dd('zw') + 'an' + Dd('zig')) })
];
const W2 = [
  card({ n: '30', en: 'thirty', zh: '三十', src: 'ty', r: R('dreißig', 'dertig', 'trettio', 'trente', 'treinta'),
    why: '英文 <b>th</b> ＝ 德、荷 <b>d</b>；尾巴 -ty ＝ -ßig ＝ -tig', story: cx('🇬🇧 ' + E('th') + 'ir' + E('ty'), F('de') + ' ' + Dd('d') + 'rei' + Dd('ßig'), F('nl') + ' ' + Dd('d') + 'er' + Dd('tig')) }),
  card({ n: '40', en: 'forty', zh: '四十', src: 'ty', r: R('vierzig', 'veertig', 'fyrtio', 'quarante', 'cuarenta'),
    why: 'forty <b>沒有 u</b>！德文 vier-<b>zig</b>', story: cx('🇬🇧 fo' + E('r') + E('ty') + '<em>沒有 u</em>', F('de') + ' vier' + Dd('zig'), F('nl') + ' veer' + Dd('tig')) }),
  card({ n: '50', en: 'fifty', zh: '五十', src: 'ty', r: R('fünfzig', 'vijftig', 'femtio', 'cinquante', 'cincuenta'),
    why: '英文 five 又變成 <b>fif</b>（fifteen、fifty）', story: cx('🇬🇧 ' + E('fif') + 'ty', F('de') + ' ' + Dd('fünf') + 'zig', F('nl') + ' ' + Dd('vijf') + 'tig') }),
  card({ n: '60', en: 'sixty', zh: '六十', src: 'ty', r: R('sechzig', 'zestig', 'sextio', 'soixante', 'sesenta'),
    why: '6 ✕ <b>10</b>：six-<b>ty</b>、zes-<b>tig</b>', story: cx('🇬🇧 six' + E('ty'), F('nl') + ' zes' + Dd('tig'), F('sv') + ' sex' + Dd('tio')) }),
  card({ n: '70', en: 'seventy', zh: '七十', src: 'fr20', r: R('siebzig', 'zeventig', 'sjuttio', 'soixante-dix', 'setenta'), near: ['de', 'nl'],
    why: '法文 70 ＝ soixante-dix ＝ <b>60 ＋ 10</b>！', story: cx('🇬🇧 seven' + E('ty') + '<em>7 ✕ 10</em>', F('fr') + ' ' + N('soixante') + '-' + N('dix') + '<em>60 ＋ 10</em>') }),
  card({ n: '80', en: 'eighty', zh: '八十', src: 'fr20', r: R('achtzig', 'tachtig', 'åttio', 'quatre-vingts', 'ochenta'), near: ['de', 'nl'],
    why: '法文 80 ＝ <b>4 個 20</b>；荷蘭文前面多一個 <b>t</b>', story: cx('🇬🇧 ei' + E('gh') + 'ty', F('de') + ' a' + Dd('ch') + 'tzig') + cx(F('fr') + ' ' + N('quatre') + '-' + N('vingts') + '<em>4 ✕ 20</em>') }),
  card({ n: '90', en: 'ninety', zh: '九十', src: 'fr20', r: R('neunzig', 'negentig', 'nittio', 'quatre-vingt-dix', 'noventa'),
    why: '法文 90 ＝ <b>4 ✕ 20 ＋ 10</b>！英文簡單多了', story: cx('🇬🇧 nine' + E('ty') + '<em>9 ✕ 10</em>', F('fr') + ' ' + N('quatre-vingt-dix') + '<em>4 ✕ 20 ＋ 10</em>') }),
  card({ n: '100', en: 'one hundred', zh: '一百', src: 'romance', r: R('hundert', 'honderd', 'hundra', 'cent', 'cien'),
    why: '日耳曼家族都是 <b>hund</b>；法、西 cent ＝ 100', story: cx('🇬🇧 ' + E('hund') + 'red', F('de') + ' ' + Dd('hund') + 'ert', F('sv') + ' ' + Dd('hund') + 'ra') + cx(F('fr') + ' ' + N('cent'), '🇬🇧 ' + N('cent') + 'ury<em>100 年</em>') })
];
const T_Z = { tag: '🔑 字母密碼：英文 t ＝ 德文 z', src: 't-z',
  h: '<div class="lk fo" style="grid-template-columns:auto auto auto">' +
    [['ten', 'zehn', 'tien'], ['two', 'zwei', 'twee'], ['twelve', 'zwölf', 'twaalf']].map((r, k) =>
      '<span class="w sp" data-say="' + r[0] + '" style="animation-delay:' + (0.2 + k * 0.4) + 's"><span class="e">t</span>' + r[0].slice(1) + '</span>' +
      '<span class="w sp" data-say="' + r[1] + '" data-lang="de-DE" style="animation-delay:' + (0.35 + k * 0.4) + 's"><span class="d">z</span>' + r[1].slice(1) + '</span>' +
      '<span class="w sp" data-say="' + r[2] + '" data-lang="nl-NL" style="animation-delay:' + (0.5 + k * 0.4) + 's"><span class="e">t</span>' + r[2].slice(1) + '</span>').join('') +
    '<span class="zz">🇬🇧 英文　' + F('de') + ' 德文　' + F('nl') + ' 荷蘭文</span></div>',
  lines: ['1500 年前，<b>德國南部的人把 t 唸成 z</b>', '看到德文 <b>z</b>，換成 <b>t</b> 就是英文！'] };
const TEEN = { tag: '🔑 字母密碼：-teen ＝ -zehn ＝ -tien ＝ 十', src: 'teen',
  h: '<div class="tt fo">' + [['thirteen', 'thir', 'teen', '🇬🇧'], ['dreizehn', 'drei', 'zehn', 'de'], ['dertien', 'der', 'tien', 'nl'], ['tretton', 'tret', 'ton', 'sv']].map((r, k) =>
      '<span class="m" style="animation-delay:' + (0.2 + k * 0.4) + 's">' + (r[3].length === 2 ? F(r[3]) : r[3]) + '</span>' +
      '<span class="w sp" data-say="' + r[0] + '"' + (r[3] === 'de' ? ' data-lang="de-DE"' : r[3] === 'nl' ? ' data-lang="nl-NL"' : r[3] === 'sv' ? ' data-lang="sv-SE"' : '') + ' style="animation-delay:' + (0.3 + k * 0.4) + 's">' + r[1] + '<span class="teen">' + r[2] + '</span></span>' +
      '<span class="m" style="animation-delay:' + (0.4 + k * 0.4) + 's">3 ＋ <span class="teen">10</span></span>').join('') + '</div>',
  lines: ['四種語言，十三的尾巴<b>都是「十」</b>'] };
const TY = { tag: '🔑 字母密碼：-ty ＝ -zig ＝ -tig ＝ 幾個十', src: 'ty',
  h: '<div class="tt fo">' + [['thirty', 'thir', 'ty', '🇬🇧'], ['dreißig', 'drei', 'ßig', 'de'], ['dertig', 'der', 'tig', 'nl'], ['trettio', 'tret', 'tio', 'sv']].map((r, k) =>
      '<span class="m" style="animation-delay:' + (0.2 + k * 0.4) + 's">' + (r[3].length === 2 ? F(r[3]) : r[3]) + '</span>' +
      '<span class="w sp" data-say="' + r[0] + '"' + (r[3] === 'de' ? ' data-lang="de-DE"' : r[3] === 'nl' ? ' data-lang="nl-NL"' : r[3] === 'sv' ? ' data-lang="sv-SE"' : '') + ' style="animation-delay:' + (0.3 + k * 0.4) + 's">' + r[1] + '<span class="ty">' + r[2] + '</span></span>' +
      '<span class="m" style="animation-delay:' + (0.4 + k * 0.4) + 's">3 ✕ <span class="ty">10</span></span>').join('') + '</div>',
  lines: ['幾十的尾巴，<b>都是「幾個十」</b>'] };
const REM = (rows, next) => ({ tag: '記住這件事', sayAll: 1, src: 'boat', h: rem(rows) + BRO3 + (next ? '<a class="golink pop" href="' + next[0] + '">' + next[1] + '</a>' : ''), lines: next ? [REMLINE[1]] : REMLINE });

const worldPages = [
  { file: 'numbers-world.html', title: '數字環遊世界　基礎 0～10', sayAll: 1, big: 1, srcRows: SRCW, topic: '🌍 環遊世界　基礎',
    back: { href: 'numbers-parts.html', label: '← 字的結構' },
    S: [{ emoji: '🌍', mid: '數字，環遊世界', lines: ['<b>基礎版</b>：別的國家怎麼說 0～10？'] },
      WD.WHERE, WD.SIX, WD.WHY5, WD.TREE, Object.assign({}, WD.MAPS[2], { lines: REMLINE }), T_Z,
      ...W0,
      REM([['o' + E('n') + 'e', 'ei' + Dd('n') + 's', 'ee' + Dd('n'), '一'], [E('t') + 'wo', Dd('z') + 'wei', 't' + Dd('w') + 'ee', '二'],
        [E('th') + 'ree', Dd('d') + 'rei', Dd('d') + 'rie', '三'], ['ei' + E('gh') + 't', 'a' + Dd('ch') + 't', 'a' + Dd('ch') + 't', '八'], [E('t') + 'en', Dd('z') + 'ehn', Dd('t') + 'ien', '十']], ['numbers-world-2.html', '🌍 下一頁：進階 11～20 ➜'])] },
  { file: 'numbers-world-2.html', title: '數字環遊世界　進階 11～20', sayAll: 1, big: 1, srcRows: SRCW, topic: '🌍 環遊世界　進階 1',
    back: { href: 'numbers-world.html', label: '← 基礎 0～10' },
    S: [{ emoji: '🌍', mid: '十幾，環遊世界', lines: ['<b>進階版 1</b>：別的國家怎麼說 11～20？'] }, TEEN,
      ...W1,
      REM([['e' + E('leven'), 'e' + Dd('lf'), 'e' + Dd('lf'), '十一'], [E('tw') + 'elve', Dd('zw') + 'ölf', Dd('tw') + 'aalf', '十二'],
        ['thir' + E('teen'), 'drei' + Dd('zehn'), 'der' + Dd('tien'), '十三'], ['four' + E('teen'), 'vier' + Dd('zehn'), 'veer' + Dd('tien'), '十四'], [E('tw') + 'enty', Dd('zw') + 'anzig', Dd('tw') + 'intig', '二十']], ['numbers-world-3.html', '🌍 下一頁：進階 30～100 ➜'])] },
  { file: 'numbers-world-3.html', title: '數字環遊世界　進階 30～100', sayAll: 1, big: 1, srcRows: SRCW, topic: '🌍 環遊世界　進階 2',
    back: { href: 'numbers-world-2.html', label: '← 進階 11～20' },
    S: [{ emoji: '🌍', mid: '幾十，環遊世界', lines: ['<b>進階版 2</b>：別的國家怎麼說 30、40……100？'] }, TY,
      ...W2,
      REM([['thir' + E('ty'), 'drei' + Dd('ßig'), 'der' + Dd('tig'), '三十'], ['for' + E('ty'), 'vier' + Dd('zig'), 'veer' + Dd('tig'), '四十'],
        ['fif' + E('ty'), 'fünf' + Dd('zig'), 'vijf' + Dd('tig'), '五十'], ['ei' + E('gh') + 'ty', 'a' + Dd('ch') + 'tzig', 't' + Dd('ach') + 'tig', '八十'], [E('hund') + 'red', Dd('hund') + 'ert', Dd('hond') + 'erd', '一百']])] }
];

module.exports = { CSS, PARTS, numP, WHYR, numW, SRCW, worldPages, cx, E, Dd, N, rem, BRO3, REMLINE };
