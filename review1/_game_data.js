/* review1/_game_data.js — Review 1 遊戲的題庫 ＋ 驚喜卡（唯一真相來源；三、四年級共用 review1/games.html）
 *
 * 使用者 2026-10-02 決定：
 *  - 物品 5 種：⚡ 閃電四選一（看圖選字）、🎧 聽力狙擊、🃏 記憶配對（圖↔字）、✏️ 填空高手（I like ___.）、🗂 分類大師
 *    活動 5 種：⚡ 閃電四選一、🎧 聽力狙擊、🃏 記憶配對、🧩 語序大挑戰（I like to ___.）、✏️ 填空高手
 *    物品 1、物品 2、活動 1、活動 2 各一套 ＝ 20 個遊戲，＋ 三年級進階、四年級進階 ＝ 22 個。
 *  - 進階 ＝ 👑 魔王挑戰。三年級只考 I like ___.／I like to ___.；
 *    四年級考 He likes ___.／He can ___, and I can ___.／I can’t ___.，can／can’t 只用「技能」類活動（SKILL）。
 *  - 分類大師：東西（I like ___）vs 動作（I like to ___）。
 *  - 驚喜卡每個遊戲 30 張、全部不重複；物品 1、物品 2 的同一種遊戲共用一副（物品 5 副、活動 5 副、進階 2 副 ＝ 360 張）。
 *
 * 字、中文、圖示、整句中文全部從 review1/_data.js 拿（不另外抄一份）。
 * 每一題 o[0] ＝ 正確答案；錯的選項一定是「確定錯」的（不放其實也對的英文，例：I like swimming.、play piano）。
 * 題目、選項、驚喜卡的順序每一場由引擎重洗。
 */
const { WORDS } = require('./_data');
const { build: buildDeck } = require('../sentences/_surprise');

const G = g => WORDS.filter(w => w.g === g);
const I1 = G('i1'), I2 = G('i2'), A1 = G('a1'), A2 = G('a2');
const ICON = w => w.ic;
const ex = w => w.ex;                               /* 整句中文：我喜歡披薩。 */
const zh0 = w => w.zh.replace(/ /g, '');            /* 片語中文在句子裡不空格（打 籃球 ➜ 打籃球） */
const big = w => '<span class="qic">' + ICON(w) + '</span>';
const small = w => '<span class="qic s">' + ICON(w) + '</span>';
const SAME = (a, b) => a.en.toLowerCase() === b.en.toLowerCase();

/* 固定的「亂數」：同一份資料每次 build 出來一模一樣（題目順序由網頁每一場重洗） */
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const byHash = (key, list) => list.slice().sort((a, b) => hash(key + '|' + (a.f || a)) - hash(key + '|' + (b.f || b)));

/* 錯的選項：同一組、先挑同一類（零食配零食），圖示不可以跟正解或彼此一樣（看圖的人才分得出來） */
function dis(w, list, n) {
  const pool = list.filter(x => !SAME(x, w) && x.ic !== w.ic);
  const same = byHash(w.f, pool.filter(x => x.cat === w.cat)), rest = byHash(w.f, pool.filter(x => x.cat !== w.cat));
  const out = [];
  same.concat(rest).forEach(x => { if (out.length < n && !out.some(y => y.ic === x.ic)) out.push(x); });
  return out;
}

/* ── 第三人稱單數：play ➜ plays（只用在「確定錯」的選項：I like to plays…、He can swims…）── */
const S3 = v => /(s|sh|ch|x|o)$/.test(v) ? v + 'es' : v + 's';
const verb = w => w.en.split(' ')[0];
const rest = w => w.en.split(' ').slice(1).join(' ');
const withV = (w, v) => [v].concat(rest(w) ? [rest(w)] : []).join(' ');

/* ══ 會用到的句子 ══ */
const LIKE = w => 'I like ' + w.en + '.';
const LIKETO = w => 'I like to ' + w.en + '.';

/* ════════ ⚡ 閃電四選一：一半「看圖選英文」、一半「看英文選圖」（兩個方向都有，學生要真的認得這個字）════════
 * 看圖選英文：題目 ＝ 圖示＋中文（同一個圖示有兩個字時靠中文分），選項只有英文（不放圖示，不然一看就知道）
 * 看英文選圖：題目 ＝ 英文，選項 ＝ 圖示＋中文（pic:1）；答錯頁、加分題改用「看圖選英文」（q2） */
function mcq(list) {
  const out = [];
  list.forEach(w => {
    const d = dis(w, list, 3), o = [w.en].concat(d.map(x => x.en));
    out.push({ q: big(w) + '<span class="qz">' + w.zh + '</span>', o, h: w.zh + ' ＝ <b>' + w.en + '</b>', ni: 1 });
    out.push({ q: '<span class="qen">' + w.en + '</span>', q2: big(w) + '<span class="qz">' + w.zh + '</span>', o, h: '<b>' + w.en + '</b> ＝ ' + w.zh, pic: 1, say: w.en });
  });
  return out;
}

/* ════════ 🎧 聽力狙擊：聽整句 I like ___.／I like to ___.，射下那一張（選項 ＝ 圖示＋英文）════════ */
function hear(list, act) {
  return list.map(w => ({ s: act ? LIKETO(w) : LIKE(w), o: [w.en].concat(dis(w, list, 3).map(x => x.en)),
    h: '聽到 <b>' + w.en + '</b> ➜ ' + w.zh }));
}

/* ════════ 🃏 記憶配對：圖（＋小字中文）↔ 英文 ════════ [英文, 圖卡的 HTML, 中文（翻開圖卡時唸）] */
const mem = list => list.map(w => [w.en, '<span class="mpic"><span class="oi">' + ICON(w) + '</span><span class="oz">' + w.zh + '</span></span>', zh0(w)]);

/* ════════ ✏️ 填空高手（物品）：I like ＿＿. ＋ 圖示＋整句中文，選項 ＝ 同一類的字 ════════ */
const fillI = list => list.map(w => ({ b: 'I like', a: '.', zh: small(w) + ex(w),
  o: [w.en].concat(dis(w, list, 3).map(x => x.en)), h: ex(w) + ' ➜ <b>' + LIKE(w) + '</b>', ni: 1 }));

/* ════════ ✏️ 填空高手（活動）：I like to ＿＿ the piano. ── 挖掉動詞（play／do／go…）════════
 * 只有一個字的動作（swim、dance…）整個挖掉，錯的選項 ＝ 別的一個字動作（看整句中文選）。
 * 片語的錯選項是一個一個挑過的：只放「確定錯」的動詞（例：listen to music 不放 dance——dance to music 也對；
 * chat with my friends 不放 play——play with my friends 也對；…in the park／outside／with… 前面只放「一定要接受詞」的動詞：
 * do、make、put，因為 read in the park、eat outside、go with LEGO 其實也對）。 */
const DV = {
  'play-basketball': ['do', 'go', 'ride'], 'play-badminton': ['do', 'go', 'make'], 'play-soccer': ['do', 'go', 'kick'],
  'play-baseball': ['do', 'go', 'make'], 'play-dodgeball': ['do', 'go', 'make'], 'ride-my-bike': ['play', 'go', 'read'],
  'go-camping': ['play', 'do', 'make'], 'play-the-piano': ['do', 'go', 'ride'], 'play-the-drums': ['do', 'go', 'ride'],
  'do-taekwondo': ['play', 'go', 'make'], 'speak-english': ['say', 'play', 'go'], 'do-crafts': ['play', 'go', 'ride'],
  'play-in-the-park': ['do', 'make', 'put'], 'play-outside': ['do', 'make', 'put'], 'play-tag': ['do', 'go', 'make'],
  'play-the-guitar': ['do', 'go', 'ride'], 'do-magic-tricks': ['change', 'go', 'ride'],
  'play-video-games': ['do', 'go', 'ride'], 'play-mobile-games': ['do', 'go', 'ride'], 'watch-videos': ['look', 'read', 'go'],
  'watch-tv': ['look', 'read', 'play'], 'play-minecraft': ['do', 'go', 'ride'], 'play-roblox': ['do', 'go', 'ride'],
  'play-mario-kart': ['do', 'go', 'ride'], 'collect-pokemon-cards': ['do', 'go', 'ride'], 'play-beyblade': ['do', 'go', 'ride'],
  'listen-to-music': ['hear', 'make', 'visit'], 'read-comics': ['look', 'play', 'go'], 'chat-with-my-friends': ['say', 'do', 'make'],
  'eat-snacks': ['drink', 'play', 'do'], 'play-with-toys': ['do', 'make', 'put'], 'stay-home': ['play', 'do', 'make'],
  'make-videos': ['go', 'ride', 'read'], 'go-to-an-amusement-park': ['play', 'do', 'make'], 'visit-my-grandparents': ['look', 'go', 'play'],
  'go-shopping': ['play', 'make', 'ride'], 'bake-cakes': ['do', 'play', 'ride'], 'play-with-my-dog': ['do', 'make', 'put'],
  'collect-stickers': ['do', 'go', 'play'], 'write-code': ['play', 'go', 'ride'], 'play-with-lego': ['do', 'make', 'put']
};
const ONE = w => !/ /.test(w.en);
function fillA(list) {
  const ones = WORDS.filter(x => x.g[0] === 'a' && ONE(x));
  return list.map(w => {
    if (ONE(w)) {
      const d = byHash(w.f, ones.filter(x => !SAME(x, w))).slice(0, 3);
      return { b: 'I like to', a: '.', zh: small(w) + ex(w), o: [w.en].concat(d.map(x => x.en)),
        h: ex(w) + ' ➜ <b>' + LIKETO(w) + '</b>', ni: 1 };
    }
    if (!DV[w.f]) throw new Error('填空高手：' + w.f + ' 沒有挑錯的動詞（DV）');
    const t0 = w.tk[0];
    return { b: 'I like to', a: rest(w) + '.', zh: small(w) + ex(w), o: [verb(w)].concat(DV[w.f]),
      h: t0[1] + ' ＝ <b>' + verb(w) + '</b> ➜ ' + LIKETO(w), ni: 1 };
  });
}

/* ════════ 🧩 語序大挑戰（活動）：照順序點 I／like／to／play／the／piano／. ════════ */
const order = list => list.map(w => ({ s: ['I', 'like', 'to'].concat(w.en.split(' ')).concat(['.']), zh: small(w) + ex(w),
  h: 'I like to ＋ 動作：<b>' + LIKETO(w) + '</b>' }));

/* ════════ 🗂 分類大師：東西 ➜ I like ___，動作 ➜ I like to ___ ════════
 * [字, 'n' 東西／'v' 動作, 提示, 正確的整句]（物品 1 配活動 1、物品 2 配活動 2）
 * 不放 dance：dance 也可以當「舞蹈」（I like dance. 也對），兩邊都說得通的字不考。 */
const BOTH = ['dance'];
const sortB = (things, acts) => things.map(w => [w.en, 'n', ICON(w) + ' <b>' + w.en + '</b> 是「東西」➜ I like ' + w.en + '.', LIKE(w)])
  .concat(acts.filter(w => BOTH.indexOf(w.en) < 0).map(w => [w.en, 'v', ICON(w) + ' <b>' + w.en + '</b> 是「動作」➜ I like to ' + w.en + '.', LIKETO(w)]));
const DUO9 = [{ v: 'n', t: 'I like ___', d: '東西　🍕', c: 'st' }, { v: 'v', t: 'I like to ___', d: '動作　🏃', c: 'qu' }];

/* ════════ 👑 進階：魔王挑戰（看圖＋整句中文，選出正確的英文句子）════════ */
const qBoss = (w, z) => big(w) + '<span class="qz">' + z + '</span>';
/* juice、milk 也可以當動詞（to juice 榨汁、to milk 擠奶），I like to juice. 不一定錯 ➜ 這兩個字換一個「確定錯」的選項 */
const VERBTOO = ['juice', 'milk'];
const X3 = [].concat(
  I1.concat(I2).map(w => ({ q: qBoss(w, ex(w)), o: [LIKE(w), VERBTOO.indexOf(w.en) < 0 ? 'I like to ' + w.en + '.' : 'Me like ' + w.en + '.',
    'I likes ' + w.en + '.', 'I to like ' + w.en + '.'],
    h: '喜歡「東西」：I like ＋ 東西 ➜ <b>' + LIKE(w) + '</b>' })),
  A1.concat(A2).map(w => ({ q: qBoss(w, ex(w)), o: [LIKETO(w), BOTH.indexOf(w.en) < 0 ? 'I like ' + w.en + '.' : 'I to like ' + w.en + '.',
    'I likes to ' + w.en + '.', 'I like to ' + withV(w, S3(verb(w))) + '.'],
    h: '喜歡「做一件事」：I like to ＋ 動作 ➜ <b>' + LIKETO(w) + '</b>' })));

/* can／can’t 只用「技能」類活動（使用者 2026-10-02）：學了才會的運動、樂器、才藝、做菜……
 * 不放 run（人人都會）、play outside／stay home／watch TV／eat snacks 這類「不是技能」的。 */
const { SKILL, CANZH } = require('./_subsets');   /* 跟四年級句型卡的 can 替換字同一套 */
const SK = SKILL.map(f => { const w = WORDS.find(x => x.f === f); if (!w) throw new Error('SKILL 找不到 ' + f); return w; });
const heZ = w => '他喜歡' + w.zh.replace(/ /g, '') + '。';
const zhC = w => CANZH[w.f] || zh0(w);   /* do taekwondo：他會跆拳道（不是「他會學跆拳道」） */
const canZ = w => '他會' + zhC(w) + '，而且我會' + zhC(w) + '。';
const cantZ = w => '我不會' + zhC(w) + '。';
const CAN = w => 'He can ' + w.en + ', and I can ' + w.en + '.';
const CANT = w => 'I can’t ' + w.en + '.';
const X4 = [].concat(
  I1.concat(I2).map(w => ({ q: qBoss(w, heZ(w)), o: ['He likes ' + w.en + '.', 'He like ' + w.en + '.',
    VERBTOO.indexOf(w.en) < 0 ? 'He likes to ' + w.en + '.' : 'Him likes ' + w.en + '.', 'His likes ' + w.en + '.'],
    h: 'He／She 後面的 like 要加 s：<b>He likes ' + w.en + '.</b>' })),
  SK.map(w => ({ q: qBoss(w, canZ(w)), o: [CAN(w), 'He can ' + withV(w, S3(verb(w))) + ', and I can ' + w.en + '.',
    'He cans ' + w.en + ', and I can ' + w.en + '.', 'He can ' + w.en + ', but I can ' + w.en + '.'],
    h: 'can 後面的動作不加 s；兩個人一樣 ➜ <b>and</b>。' })),
  SK.map(w => ({ q: qBoss(w, cantZ(w)), o: [CANT(w), 'I can’t ' + withV(w, S3(verb(w))) + '.', 'I don’t can ' + w.en + '.', 'I can’t to ' + w.en + '.'],
    h: 'can’t ＋ 動作（不加 s、不加 to）➜ <b>' + CANT(w) + '</b>' })));

/* ════════ 22 個遊戲 ════════ */
const BANK = {}, GAMES = [];
const SEC = { i1: '🍟 物品 1　I like ___.', i2: '🎮 物品 2　I like ___.', a1: '⛹️ 活動 1　I like to ___.', a2: '🎧 活動 2　I like to ___.', x: '👑 進階　魔王挑戰' };
const DESC = { i1: '美食、零食、飲料、玩具', i2: '3C、電玩、球類、書和漫畫、生活愛用品', a1: '球類運動、個人運動、才藝、戶外玩耍', a2: '3C 和電玩、競賽、靜態活動、家裡的活動、假日出遊', x: '整句大考驗' };
function add(id, ty, sec, ic, name, rule, deck, st, bank, more) {
  if (bank.length < 20) throw new Error(id + ' 只有 ' + bank.length + ' 題（要 ≧ 20）');
  BANK[id] = bank;
  GAMES.push(Object.assign({ id, ty, sec, ic, name, rule, deck, st, n: bank.length }, more || {}));
}
[['i1', I1, A1], ['i2', I2, A2]].forEach(([k, L, acts]) => {
  add(k + '_1', 'g1', k, '⚡', '閃電四選一', '看圖選英文、看英文選圖，答得快分數高。', 'i_1', '🍭 糖果工廠', mcq(L));
  add(k + '_5', 'g5', k, '🎧', '聽力狙擊', '聽一句 I like ___.，射下正確的那一張。', 'i_5', '🏮 夜市', hear(L, 0));
  add(k + '_6', 'g6', k, '🃏', '記憶配對', '翻開兩張，圖配英文，配對成功就消失。', 'i_6', '🧸 玩具箱', mem(L));
  add(k + '_8', 'g8', k, '✏️', '填空高手', 'I like ＿＿. 選出少掉的那一個字。', 'i_8', '🍔 速食店', fillI(L));
  add(k + '_9', 'g9', k, '🗂', '分類大師', '東西 ➜ I like ___；動作 ➜ I like to ___。', 'i_9', '🛒 超市', sortB(L, acts), { duo: DUO9 });
});
[['a1', A1], ['a2', A2]].forEach(([k, L]) => {
  add(k + '_1', 'g1', k, '⚡', '閃電四選一', '看圖選英文、看英文選圖，答得快分數高。', 'a_1', '🏅 運動會', mcq(L));
  add(k + '_5', 'g5', k, '🎧', '聽力狙擊', '聽一句 I like to ___.，射下正確的那一張。', 'a_5', '🎸 搖滾樂團', hear(L, 1));
  add(k + '_6', 'g6', k, '🃏', '記憶配對', '翻開兩張，圖配英文，配對成功就消失。', 'a_6', '⛺ 露營', mem(L));
  add(k + '_3', 'g3', k, '🧩', '語序大挑戰', '照順序點英文字，排出 I like to ___.', 'a_3', '🎢 遊樂園', order(L));
  add(k + '_8', 'g8', k, '✏️', '填空高手', 'I like to ＿＿ ___. 選出少掉的動作（play、do、go…）。', 'a_8', '🎨 才藝教室', fillA(L));
});
add('x3', 'g10', 'x', '👑', '三年級進階', 'I like ___.／I like to ___. 打倒魔王！', 'x3', '🦖 恐龍探險', X3);
add('x4', 'g10', 'x', '👑', '四年級進階', 'He likes ___.／He can ___, and I can ___.／I can’t ___. 打倒魔王！', 'x4', '🏴‍☠️ 海盜冒險', X4);

/* ════════ 🎁 驚喜卡：12 副 ✕ 30 張，名字全部不重複（物品和活動完全不同）════════ */
const THEME = {
  i_1: ['g1', '🍭棒棒糖機 🍬水果糖雨 🍫巧克力瀑布 🍩甜甜圈塔 🧁杯子蛋糕 🍰草莓蛋糕 🍪餅乾怪獸 🍯蜂蜜罐 🍮布丁山 🍦霜淇淋機 🍡糖葫蘆 🍓草莓田 🍒紅櫻桃 🍉大西瓜 🍋檸檬汽水 🍇葡萄串 🍑水蜜桃 🍍鳳梨酥 🥥椰子球 🍌香蕉船 🍎蘋果糖 🍐甜梨子 🥧蘋果派 🎂生日大蛋糕 🍿爆米花機 🥨蝴蝶脆餅 🍘仙貝 🥞疊疊鬆餅 🍧剉冰山 🎀糖果禮盒'],
  i_5: ['g5', '🏮紅燈籠 🎯射氣球 🎣撈金魚 🎰彈珠台 🍢關東煮 🥟小籠包 🍜牛肉麵 🍗鹹酥雞 🌽烤玉米 🍠烤地瓜 🦑烤魷魚 🍳蚵仔煎 🥚茶葉蛋 🍙飯糰 🐟鯛魚燒 🎈氣球攤 🧸夾娃娃 🎪套圈圈 🎶街頭藝人 🎟抽獎券 🧧紅包 💰零錢包 🛍提袋滿滿 🌟夜市之星 📣大聲公 🍡麻糬 🥮中秋月餅 🍤炸蝦 🍵熱奶茶 🍲臭豆腐鍋'],
  i_6: ['g6', '🧸絨毛熊 🎎和服娃娃 🚂小火車 🚗玩具車 ✈️紙飛機 🚁直升機 🤖機器人 🧩拼圖盒 🎲大骰子 🃏撲克牌 🖍蠟筆盒 🏰積木城堡 🚀火箭玩具 🛸飛碟 🎹玩具琴 🥁小鼓 🎺小喇叭 ⛵小帆船 🐸跳跳蛙 🦄獨角獸 🎠音樂盒 🧱疊疊積木 🏀小籃框 ⚽小足球 🎈氣球狗 🎁驚喜蛋 🔮玻璃彈珠 🧲磁鐵 🚲滑步車 🐻熊熊玩偶'],
  i_8: ['g8', '🍔大漢堡 🍟薯條山 🌭熱狗堡 🍕披薩派對 🥤可樂杯 🍗炸雞桶 🥪三明治 🌮塔可餅 🌯捲餅 🥗沙拉碗 🍛咖哩飯 🍣壽司船 🍱便當 🥡外帶盒 🧂鹽巴罐 🥫番茄醬 🍳荷包蛋 🥓培根 🧀起司片 🥐可頌 🍞吐司 🥯貝果 🌶辣椒醬 🧃柳橙汁 ☕熱可可 🥛鮮奶杯 🍦甜筒 🍨聖代 🎫兌換券 🍝肉醬麵'],
  i_9: ['g9', '🛒購物車 🧺購物籃 🏷特價標籤 💳會員卡 🧾收據 🥦花椰菜 🥕紅蘿蔔 🍅番茄 🥔馬鈴薯 🍆茄子 🥒小黃瓜 🍄香菇 🥜花生 🌰栗子 🥚雞蛋盒 🧴洗髮精 🧻衛生紙 🧼香皂 🧽海綿 🧹掃把 🛍購物袋 📦大箱子 🚚送貨車 🏪便利商店 🔖折價券 🍎紅蘋果 🍌一串香蕉 🥩牛排 🦐大蝦子 🧊冰塊袋'],
  a_1: ['g1', '🏅金牌 🥇冠軍 🥈亞軍 🥉季軍 🏆大獎盃 🏃大隊接力 🎽接力背心 👟跑鞋 ⏱碼表 🚩終點旗 🏁衝線 🎌加油旗 🤸翻跟斗 🤾手球 🏐排球 🏉橄欖球 🎾網球 🏓桌球 🥏飛盤 🏹射箭 🥅守門員 ⛳高爾夫 🏋舉重 🚴自行車賽 🏊游泳池 ⛸溜冰 🧗攀岩 💪大力士 📣啦啦隊 🎖榮譽勳章'],
  a_5: ['g5', '🎸電吉他 🎹電子琴 🥁爵士鼓 🎤麥克風 🎧耳罩耳機 🎷薩克斯風 🎺小號 🎻小提琴 🎼樂譜 🎵音符 🎶和弦 🔊大音箱 📻收音機 💿唱片 📀黃金唱片 🎙錄音室 🎚混音台 🎛效果器 🎫演唱會門票 🌟巨星 🕺舞台秀 💃伴舞 🎆煙火秀 🎇仙女棒 🔦舞台燈 👑搖滾之王 🎉安可 👏掌聲 🎬MV拍攝 📸簽名照'],
  a_6: ['g6', '⛺帳篷 🏕營地 🔥營火 🌲大松樹 🌙月亮 🌌銀河 🔦夜行燈 🎒登山背包 🧭指南針 🗺藏寶地圖 🌭烤熱狗 🐿松鼠 🦉貓頭鷹 🦌小鹿 🐻大棕熊 🦋蝴蝶 🐞瓢蟲 🐝蜜蜂 🌄日出 🏞湖邊 🛶獨木舟 🎣湖邊釣魚 🍄野菇 🌻向日葵 🍂落葉 ⛰登山 💧清涼溪水 🌈雨後彩虹 🏔雪山 ⭐流星許願'],
  a_3: ['g3', '🎢雲霄飛車 🎡摩天輪 🎠旋轉木馬 🎪馬戲團 🤡小丑 🦁獅子秀 🐘大象表演 🎭面具派對 🎟入場券 🍿爆米花桶 🎈彩色氣球 🚂園區小火車 🏰魔法城堡 🐉噴火龍 🎆夜間煙火 👻鬼屋 🌊激流泛舟 🚀太空飛車 🎯丟飛鏢 🧜美人魚 🧚小仙子 🐬海豚秀 🐧企鵝館 🚤碰碰船 🚗碰碰車 🌀旋轉咖啡杯 📷紀念照 🍭園區糖果 🗺園區地圖 🎊大遊行'],
  a_8: ['g8', '🎨調色盤 🖌水彩筆 🖍粉蠟筆 ✏️素描鉛筆 📐三角尺 ✂️剪紙 🧶毛線球 🧵針線包 📿串珠 🎹鋼琴課 🎻提琴課 🥋黑帶 🎤歌唱課 💃舞蹈課 🤹雜耍 🎩魔術帽 🐇變出兔子 🃏魔術撲克 📚圖書館 🗣英文演講 💻程式課 🍳烹飪課 🎂烘焙課 🖼得獎畫作 🏵獎狀花 📜證書 🎬拍片課 📸攝影課 🥁鼓隊練習 🎸吉他社'],
  x3: ['g10', '🦖暴龍 🦕腕龍 🥚恐龍蛋 🌋火山 ☄️隕石 🦴化石 🔍考古放大鏡 ⛏考古鎬 🗿石像 🌿蕨類森林 🐊鱷魚 🦎蜥蜴 🐢老烏龜 🦅翼龍 🐲龍寶寶 🦷暴龍牙 🐾恐龍腳印 🌴椰子樹 🏝恐龍島 🌊遠古大海 🦈巨齒鯊 🐙大章魚 🦑大王魷魚 🔥熔岩 🧪化石實驗 📏量恐龍 🏺古董罐 🗝神秘鑰匙 🧭探險羅盤 🐘長毛象'],
  x4: ['g10', '🏴‍☠️海盜旗 🦜鸚鵡 ⚓船錨 🚢大帆船 🗺尋寶路線 💎紅寶石 💰金幣箱 👑海盜王冠 🔭望遠鏡 🧭海上羅盤 🐙章魚船長 🦈大白鯊 🐳大鯨魚 🐬海豚護航 🌊乘風破浪 🏝無人島 ⛵順風帆 🦀螃蟹 🐚貝殼 🌅海上日落 🗝寶箱鑰匙 📜古老海圖 🍾瓶中信 ⭐北極星 🌙海上明月 🦑深海怪物 🏰海盜堡壘 💍黃金戒指 🧜人魚公主 🎖海軍勳章']
};
const DECK = {};
Object.keys(THEME).forEach((k, gi) => {
  const names = THEME[k][1].split(' ').map(s => s.replace(/^(\S+?)([一-鿿])/, '$1 $2'));
  DECK[k] = buildDeck(names, gi, THEME[k][0]);
});
const allN = [].concat.apply([], Object.keys(DECK).map(k => DECK[k].map(x => x.t)));
const dupN = allN.filter((t, n) => allN.indexOf(t) !== n);
if (dupN.length) throw new Error('驚喜卡名字重複：' + dupN.join('、'));
const SURP = {};
GAMES.forEach(m => { SURP[m.id] = DECK[m.deck]; });

/* ════════ 答錯頁的逐字中文、整句翻譯（sentences/_gloss.js 讀 GLX／TRX；PHR ＝ 片語裡每一個字的中文，照字卡）════════ */
const GLX = { i: '我', like: '喜歡', likes: '喜歡', to: '', he: '他', can: '會', "can't": '不會', and: '而且', but: '但是', the: '', an: '' };
const TRX = {};
const PHR = [[['i', 'like', 'to'], ['我', '喜歡', '']]];
WORDS.forEach(w => {
  TRX[w.en] = zh0(w);
  TRX[LIKE(w)] = w.g[0] === 'i' ? ex(w) : '我喜歡' + zh0(w) + '。';
  if (w.g[0] === 'a') TRX[LIKETO(w)] = ex(w);
  if (w.g[0] === 'i') TRX['He likes ' + w.en + '.'] = heZ(w);
  /* 片語：每一個字的中文照字卡（play the piano ➜ 彈／（空白）／鋼琴）；一格裡有兩個字的（Mario Kart）中文放第一個字 */
  const ws = [], zs = [];
  w.tk.forEach(t => t[0].split(/\s+/).forEach((x, n) => { ws.push(x.toLowerCase().replace(/[’]/g, "'")); zs.push(n ? '' : t[1]); }));
  PHR.push([ws, zs]);
});
SK.forEach(w => { TRX[CAN(w)] = canZ(w); TRX[CANT(w)] = cantZ(w); });
/* can do taekwondo ＝ 會 跆拳道（do 下面空白，不是「學」） */
PHR.push([['can', 'do', 'taekwondo'], ['會', '', '跆拳道']], [["can't", 'do', 'taekwondo'], ['不會', '', '跆拳道']]);

/* 圖示查表：選項、分類大師的字前面放圖示（OIC）；看英文選圖的選項顯示中文（OZH） */
const OIC = {}, OZH = {};
WORDS.forEach(w => { OIC[w.en] = ICON(w); OZH[w.en] = w.zh; });

/* 語音檔要做的句子（review1/_audio.js 讀這裡）：每一題的正確答案、聽力題、語序的每一個字 */
const SAY = [];
Object.keys(BANK).forEach(id => BANK[id].forEach(c => {
  if (Array.isArray(c)) { SAY.push(c[0]); if (c[3]) SAY.push(c[3]); return; }
  if (c.o) SAY.push(c.o[0]);
  if (c.s && typeof c.s === 'string') SAY.push(c.s);
  if (c.s && Array.isArray(c.s)) { c.s.forEach(x => SAY.push(x)); SAY.push(c.s.join(' ').replace(/ ([.?!])/g, '$1')); }
  if (c.say) SAY.push(c.say);
  if (c.b) SAY.push((c.b + ' ' + c.o[0] + (/^[.?!,]/.test(c.a) ? '' : ' ') + c.a));
}));

module.exports = { GAMES, BANK, SURP, THEME, SEC, DESC, DUO9, GLX, TRX, PHR, OIC, OZH, SAY, SKILL, X3, X4,
  R1: { title: 'Review 1 遊戲｜物品・活動', h1: '🎮 Review 1 遊戲　' + GAMES.length + ' 種' } };
