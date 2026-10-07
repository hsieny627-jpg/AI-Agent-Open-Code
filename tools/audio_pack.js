/* tools/audio_pack.js — 把要唸的句子做成語音檔，並寫出查表用的 aud.js
 *
 * pack({ texts, dir, lang:'en'|'sv', varName:'AUD', speak })
 *   speak   （可省略）鑰匙不變、只換掉要唸的文字：例 LEGO ➜ Lego（大寫會被唸成一個一個字母）
 *   texts   要唸的每一句（重複的會自動合併）
 *   dir     輸出資料夾（mp3 ＋ aud.js 都放這裡）
 *   varName 網頁上查表的變數名稱（sentences／G3 用 AUD；單字網站的瑞典文用 SVAUD）
 *
 * 兩種聲音（2026-10-03 使用者指定：問句和答句要聽得出是不同人）：
 *   文字前面加 'm:' ＝ 男聲 am_michael（鑰匙也是 'm:' ＋ akey）；沒有加 ＝ 女聲 af_bella。網頁上 say(…,{v:'m'}) 會先查 'm:' 的鑰匙。
 * 模型（2026-10-03 升級 Kokoro v1.0）：檔名的雜湊含模型代號 MODEL，換模型 ➜ 全部重做、舊檔自動刪掉。
 * 查表的「鑰匙」要跟網頁上的 akey() 一模一樣：’ 變 '，拿掉 ＝ ➜ … ＿ 這些不發音的符號，空白收成一個，轉小寫。
 * 已經做過的句子不會重做（檔名 ＝ 鑰匙的 sha1 前 12 碼）；不再用到的舊檔會刪掉。
 * 模型與產生器見 tools/tts_gen.py（要先設好 TTS_MODELS）。
 */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');

function sayText(s) {
  return String(s).replace(/[’]/g, "'")
    .replace(/[=＝≠➜→⇒…＿_　]+/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
const akey = s => sayText(s).toLowerCase();
const MODEL = 'k1c';   /* Kokoro v1.0（英文）＋ 2026-10-03 修好的剪靜音。瑞典文不變 */
/* 2026-10-03 用語音辨識（tools/asr_check.py）比過 11 個美式聲音：句子每個都 100% 聽對；單獨一個字 af_bella 最準
   （af_heart 單字尾巴常多出雜音：pig 聽成 PEG PEG）。男聲 am_michael 單字、句子全對。 */
const VOICE = { '': 2, m: 16 };   /* af_bella、am_michael（tools/tts_gen.py） */
const vOf = k => (/^m:/.test(k) ? 'm' : '');
let LANG = 'en';
let SPEED = 1;
/* 語速（2026-10-04 使用者指定：全站單字卡唸慢一點）：pack({…, speed:0.85})。語速不是 1 的，檔名雜湊多一段，跟原本的分開 */
const fname = k => crypto.createHash('sha1').update(LANG === 'sv' ? k : MODEL + '|' + (SPEED !== 1 ? 's' + SPEED + '|' : '') + k).digest('hex').slice(0, 12);

function pack(o) {
  const dir = o.dir, varName = o.varName || 'AUD';
  LANG = o.lang === 'sv' ? 'sv' : 'en'; SPEED = o.speed || 1;
  fs.mkdirSync(dir, { recursive: true });
  const want = {}, SPOKE = new Set();
  /* 重音記號（2026-09-26）：字前面的 + ＝ 重音、- ＝ 輕讀（見 tools/stress.py）。鑰匙不含記號；有記號的版本優先 */
  /* ~ ＝ 低平（2026-09-27）；^ % ! / ＝ 溫和重音、溫和低平、大聲一點、句尾上揚（2026-10-04）；& ＝ 輕聲（2026-10-07，見 tools/stress.py） */
  const MK = /(^|\s)[+~\-^%!/&](?=[A-Za-z])/g, marked = t => /(^|\s)[+~\-^%!/&][A-Za-z]/.test(t);
  o.texts.forEach(t0 => {
    /* {k:'syl basketball 0', ph:'b ˈ æ s'}：照音標直接唸（音節動畫，2026-10-03）；鑰匙照 k */
    if (t0 && typeof t0 === 'object') { want[akey(t0.k)] = '§' + t0.ph; return; }
    let t = String(t0), v = '';
    if (/^m:/.test(t)) { v = 'm:'; t = t.slice(2); }
    const m = marked(t), s = sayText(t.replace(MK, '$1')); if (!/[A-Za-zÅÄÖåäö]/.test(s)) return;
    const k = v + akey(s); if (!want[k] || (m && !marked(want[k]))) { want[k] = m ? sayText(t) : (o.speak ? o.speak(s) : s); if (!m && want[k] !== s) SPOKE.add(k); else SPOKE.delete(k); }
  });
  const manPath = path.join(dir, 'aud.js');
  let old = {};
  if (fs.existsSync(manPath)) {
    const m = /=\s*(\{[\s\S]*\});/.exec(fs.readFileSync(manPath, 'utf8'));
    if (m) old = JSON.parse(m[1]);
  }
  /* 要記住「實際唸的文字」的：有重音記號、照音標唸、或 speak 換過文字的（2026-10-04：she ➜ She.）；換了文字就重做 */
  const keep3 = k => marked(want[k]) || want[k][0] === '§' || SPOKE.has(k);
  const todo = Object.keys(want).filter(k => !(old[k] && old[k][0] === fname(k) + '.mp3' && fs.existsSync(path.join(dir, old[k][0])) &&
    (!keep3(k) || old[k][2] === want[k] || (old[k][2] === undefined && SPOKE.has(k)))));   /* 舊的 speak 檔（LEGO ➜ Lego）不重做；要重做就刪掉那一個 mp3 */
  if (todo.length) {
    const models = process.env.TTS_MODELS;
    if (!models) throw new Error('要做 ' + todo.length + ' 個新語音檔，但沒有設定 TTS_MODELS（模型資料夾），見 tools/tts_gen.py');
    const tmp = path.join(dir, '_todo.json');
    fs.writeFileSync(tmp, JSON.stringify(todo.map(k => LANG === 'sv' ? [fname(k), want[k]] : [fname(k), want[k], VOICE[vOf(k)], SPEED])));
    cp.execFileSync('python3', [path.join(__dirname, 'tts_gen.py'), o.lang === 'sv' ? 'sv' : 'ko',
      String(o.lang === 'sv' ? 0 : VOICE['']), tmp, dir], { stdio: 'inherit', env: process.env });
    const dur = JSON.parse(fs.readFileSync(path.join(dir, '_dur.json'), 'utf8'));
    todo.forEach(k => { old[k] = [fname(k) + '.mp3', dur[fname(k)]].concat(keep3(k) ? [want[k]] : []); });
    fs.unlinkSync(tmp); fs.unlinkSync(path.join(dir, '_dur.json'));
  }
  const man = {};
  Object.keys(want).sort().forEach(k => { man[k] = old[k]; });
  /* 不再用到的舊檔刪掉，repo 不會越來越大 */
  const keep = new Set(Object.values(man).map(x => x[0]));
  fs.readdirSync(dir).filter(f => /\.mp3$/.test(f) && !keep.has(f)).forEach(f => fs.unlinkSync(path.join(dir, f)));
  fs.writeFileSync(manPath, '/* 由 tools/audio_pack.js 產生，不要手改。鑰匙 ➜ [檔名, 秒數] */\nwindow.' + varName + '=' +
    JSON.stringify(man) + ';\n');
  return { total: Object.keys(man).length, made: todo.length };
}
module.exports = { pack, sayText, akey };
