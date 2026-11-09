/* g3mid/_gt_data.js — 📝 三年級 成長測驗 25 題 挑戰（2026-11-09 第四十五次 第 1 點；只 在 ⚡ 現場任務 開，set g25）
 *
 * 依據（老師 提供）：
 *   A. 113、114 年 基本學習內容 標準化評量－篩選測驗 三年級 英語科 試卷＋113 年 聽力 錄音（雲端 電腦 聽寫 核對 過：字母 15 題 跟 答案卷 一樣；
 *      常用語 ＝ Thank you.／Close your book.／Sit down.／Listen.）
 *   B. 110 年 國民小學 英語科 基本學習內容「三年級」：① 字母 Aa～Zz 26 個 大小寫（聽懂、口說、認讀、書寫）② 音韻覺識：能 聽出 CVC 的 起始 子音
 *      ③ 常用語（聽懂＋口說）Hi!/Hello!、Good morning.、Good afternoon.、Goodbye./Bye.、Thank you.；（聽懂）Be quiet.、Good job.、Listen!、Look!、
 *      Open/Close your book.、Sit down.、Stand up.（三年級 沒有 字詞、文法 句構）
 *   C. 當年度 錯 最多 的 前 5 題：**老師 還沒 給**（TOP 空 的）➜ 給 了 以後 寫進 TOP，那 幾 種 題目 每 一回 一定 出、而且 多 出。
 *
 * 一回 25 題 ＝ 跟 考卷 一樣 的 三 部分、一樣 的 題數：
 *   第 1 關 🔤 聽寫 字母 15 題（聽 字母 ➜ 先 寫 大寫 ➜ 再 寫 小寫；考卷 第 1～15 題、60%）
 *   第 2 關 👂 開頭 的 音 6 題（聽 兩個 字 ➜ 開頭 的 音 一樣 ⭕ Same、不一樣 ❌ Different；考卷 第 16～21 題、24%）
 *   第 3 關 🖼 聽 常用語 選 圖 4 題（聽 一句 ➜ 三張 圖 選 一張；考卷 第 22～25 題、16%）
 * 每一次 都 不一樣：字母 ＝ 這一位 學生 最近 寫過 的 先 不出（26 個 輪流）；開頭 的 音 48 組（8 回 不 重複）；常用語 13 句 輪流＋三張 圖 每次 重新 配。
 * 考卷 原題 一題 都 不 用：113 的 字 對（電腦 聽寫：sun、soup、jet、gum、dot、mop、map、mat、fat、that、hip、hum、sit、chop）不 用 ➜ build 檢查。
 * 錯 的 選項 跟 答案 相近（🔒 3）：開頭 的 音 一半 是「不一樣」，不一樣 的 一律 是 容易 聽錯 的 一對（b／p、d／t、f／v、m／n、g／k、l／r、s／z、w／v）。
 */
var GTW = {   /* 字：中文、圖（答錯頁 用；題目 只 用 聽）*/
  bag: ['袋子', '👜'], bat: ['蝙蝠', '🦇'], bed: ['床', '🛏️'], bus: ['公車', '🚌'], box: ['盒子', '📦'], bird: ['鳥', '🐦'], ball: ['球', '⚽'],
  cat: ['貓', '🐱'], cup: ['杯子', '🥤'], dog: ['狗', '🐶'], duck: ['鴨子', '🦆'], dad: ['爸爸', '👨'], desk: ['書桌', '🪑'], doll: ['洋娃娃', '🪆'],
  fan: ['扇子', '🪭'], fox: ['狐狸', '🦊'], fish: ['魚', '🐟'], four: ['四', '4️⃣'], five: ['五', '5️⃣'], girl: ['女孩', '👧'], goat: ['山羊', '🐐'],
  hat: ['帽子', '👒'], hen: ['母雞', '🐔'], kite: ['風箏', '🪁'], kid: ['小孩', '🧒'], king: ['國王', '🤴'], leg: ['腿', '🦵'], lion: ['獅子', '🦁'], lamp: ['燈', '💡'],
  mom: ['媽媽', '👩'], monkey: ['猴子', '🐒'], milk: ['牛奶', '🥛'], moon: ['月亮', '🌙'], net: ['網子', '🥅'], nose: ['鼻子', '👃'], nut: ['堅果', '🥜'], nine: ['九', '9️⃣'],
  pen: ['筆', '🖊️'], pig: ['豬', '🐷'], pot: ['鍋子', '🍲'], pin: ['別針', '📌'], panda: ['熊貓', '🐼'], rat: ['老鼠', '🐀'], red: ['紅色', '🟥'], rabbit: ['兔子', '🐰'], ring: ['戒指', '💍'],
  six: ['六', '6️⃣'], sock: ['襪子', '🧦'], seven: ['七', '7️⃣'], ten: ['十', '🔟'], tent: ['帳篷', '⛺'], tub: ['浴缸', '🛁'], tiger: ['老虎', '🐯'], toy: ['玩具', '🧸'],
  van: ['廂型車', '🚐'], vest: ['背心', '🦺'], web: ['蜘蛛網', '🕸️'], window: ['窗戶', '🪟'], wolf: ['狼', '🐺'], zebra: ['斑馬', '🦓'], zoo: ['動物園', '🦁'], zero: ['零', '0️⃣']
};
/* 開頭 的 音：[字 1, 字 2]（第一個 音 一樣 ＝ ⭕；cat／kite、cup／kid ＝ 字母 不同 但是 音 一樣 /k/ ＝ ⭕，答錯頁 說明）*/
var GTS0 = [
  ['bag', 'bus'], ['bat', 'bed'], ['box', 'bird'], ['cat', 'cup'], ['dog', 'duck'], ['dad', 'desk'], ['fan', 'fox'], ['fish', 'four'],
  ['girl', 'goat'], ['hat', 'hen'], ['kite', 'kid'], ['leg', 'lion'], ['mom', 'monkey'], ['milk', 'moon'], ['net', 'nose'], ['nut', 'nine'],
  ['pen', 'pig'], ['pot', 'pin'], ['rat', 'red'], ['rabbit', 'ring'], ['six', 'sock'], ['ten', 'tent'], ['tub', 'tiger'], ['van', 'vest'],
  ['cat', 'kite'], ['cup', 'kid'],
  /* 不一樣（容易 聽錯 的 一對）*/
  ['bag', 'pig'], ['bus', 'pen'], ['bed', 'pot'], ['ball', 'pin'], ['dog', 'ten'], ['dad', 'tub'], ['duck', 'tent'], ['desk', 'tiger'], ['doll', 'toy'],
  ['fan', 'van'], ['fox', 'vest'], ['five', 'van'], ['mom', 'nut'], ['milk', 'net'], ['monkey', 'nose'], ['goat', 'kite'], ['girl', 'king'],
  ['leg', 'red'], ['lion', 'rabbit'], ['lamp', 'rat'], ['six', 'zebra'], ['sock', 'zoo'], ['seven', 'zero'], ['web', 'vest'], ['window', 'van'], ['wolf', 'fox']
];
var SND = { c: 'k', k: 'k' };   /* 音 一樣 的 不同 字母 */
var IPA = { b: '/b/', p: '/p/', d: '/d/', t: '/t/', f: '/f/', v: '/v/', m: '/m/', n: '/n/', g: '/g/', k: '/k/', c: '/k/', l: '/l/', r: '/r/', s: '/s/', z: '/z/', w: '/w/', h: '/h/' };
var EXAM_W = ['sun', 'soup', 'jet', 'gum', 'dot', 'mop', 'map', 'mat', 'fat', 'that', 'hip', 'hum', 'sit', 'chop', 'sam'];
var GS = GTS0.map(function (p) {
  var a = p[0], b = p[1];[a, b].forEach(function (w) { if (!GTW[w]) throw new Error('成長測驗 開頭 的 音：' + w + ' 沒有 中文'); if (EXAM_W.indexOf(w) >= 0) throw new Error('成長測驗 洩題：' + w); });
  var sa = SND[a[0]] || a[0], sb = SND[b[0]] || b[0], same = sa === sb;
  return { a: a, b: b, same: same ? 1 : 0, say: a + '. ' + b + '.', o: same ? ['same', 'diff'] : ['diff', 'same'], en: a + ', ' + b,
    zh: a + '（' + GTW[a][0] + '）的 開頭 是 ' + IPA[a[0]] + '，' + b + '（' + GTW[b][0] + '）的 開頭 是 ' + IPA[b[0]] + ' ➜ ' + (same ? '一樣' : '不一樣') + '。' };
});
/* 常用語：k ＝ 圖（照片 img/k.jpg 或 漫畫 _scenes.js）、near ＝ 相近 的 圖（錯 的 選項 從 這裡 挑 2 張）*/
var PICS = { hello: 'sc', morn: 'sc', aft: 'sc', bye: 'sc', thank: 'sc', goodjob: 'sc', listen: 'sc', look: 'sc', quiet: 'img', openbook: 'img', closebook: 'img', sitdown: 'img', standup: 'img' };
var GC0 = [
  ['Hello!', '哈囉！', 'hello', ['bye', 'thank', 'goodjob']],
  ['Hi!', '嗨！', 'hello', ['bye', 'thank', 'look']],
  ['Good morning.', '早安。', 'morn', ['aft', 'bye']],
  ['Good afternoon.', '午安。', 'aft', ['morn', 'bye']],
  ['Goodbye.', '再見。', 'bye', ['hello', 'thank']],
  ['Bye.', '再見。', 'bye', ['hello', 'goodjob']],
  ['Thank you.', '謝謝 你。', 'thank', ['goodjob', 'hello']],
  ['Be quiet.', '安靜。', 'quiet', ['listen', 'look']],
  ['Good job.', '做得 好。', 'goodjob', ['thank', 'look']],
  ['Listen!', '聽！', 'listen', ['look', 'quiet']],
  ['Look!', '看！', 'look', ['listen', 'goodjob']],
  ['Open your book.', '打開 你的 書。', 'openbook', ['closebook', 'look']],
  ['Close your book.', '闔上 你的 書。', 'closebook', ['openbook', 'sitdown']],
  ['Sit down.', '坐下。', 'sitdown', ['standup', 'quiet']],
  ['Stand up.', '起立。', 'standup', ['sitdown', 'openbook']]
];
var GC = GC0.map(function (c) { [c[2]].concat(c[3]).forEach(function (k) { if (!PICS[k]) throw new Error('成長測驗 常用語 沒有 圖：' + k); });
  return { say: c[0], en: c[0], zh: c[1], k: c[2], near: c[3], o: [c[2]].concat(c[3].slice(0, 2)) }; });
/* 字母：26 個（聽 字母 ➜ 大寫 ➜ 小寫）*/
var GL = 'abcdefghijklmnopqrstuvwxyz'.split('').map(function (c) { var C = c.toUpperCase();
  return { up: C, lo: c, say: c, want: C, show: C, lis: 1, en: C + ' ' + c, o: [C + c, '❌ 寫錯 了'], zh: '聽到 ' + C + '：大寫 ' + C + '、小寫 ' + c + '。' }; });
var TOP = [];   /* C. 當年度 錯 最多 前 5 題（老師 給 了 再 填：[{p:'gl', v:'b'}…]）*/
if (GS.length < 48) throw new Error('成長測驗 開頭 的 音 太 少：' + GS.length);
if (GS.filter(function (q) { return q.same; }).length !== 26) throw new Error('成長測驗：一樣 的 要 26 組');
var GORD = [['gl', 'GL'], ['gs', 'GS'], ['gc', 'GC']];
var GCNT = { gl: 15, gs: 6, gc: 4 };
var GTALL = GL.concat(GS).concat(GC);   /* 題庫 第幾題（老師看板 用；只 可以 接 在 後面 加）*/
var GTSAY = GC.map(function (c) { return c.say; });
var GTWORDS = Object.keys(GTW).filter(function (w) { return GS.some(function (q) { return q.a === w || q.b === w; }); });
module.exports = { IPA: IPA, GTW: GTW, GS: GS, GC: GC, GL: GL, PICS: PICS, TOP: TOP, GORD: GORD, GCNT: GCNT, GTALL: GTALL, GTSAY: GTSAY, GTWORDS: GTWORDS };
