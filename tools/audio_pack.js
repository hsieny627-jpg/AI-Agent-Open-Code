/* tools/audio_pack.js — 把要唸的句子做成語音檔，並寫出查表用的 aud.js
 *
 * pack({ texts, dir, lang:'en'|'sv', varName:'AUD' })
 *   texts   要唸的每一句（重複的會自動合併）
 *   dir     輸出資料夾（mp3 ＋ aud.js 都放這裡）
 *   varName 網頁上查表的變數名稱（sentences／G3 用 AUD；單字網站的瑞典文用 SVAUD）
 *
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
const fname = k => crypto.createHash('sha1').update(k).digest('hex').slice(0, 12);

function pack(o) {
  const dir = o.dir, varName = o.varName || 'AUD';
  fs.mkdirSync(dir, { recursive: true });
  const want = {};
  o.texts.forEach(t => {
    const s = sayText(t); if (!/[A-Za-zÅÄÖåäö]/.test(s)) return;
    const k = akey(s); if (!want[k]) want[k] = s;
  });
  const manPath = path.join(dir, 'aud.js');
  let old = {};
  if (fs.existsSync(manPath)) {
    const m = /=\s*(\{[\s\S]*\});/.exec(fs.readFileSync(manPath, 'utf8'));
    if (m) old = JSON.parse(m[1]);
  }
  const todo = Object.keys(want).filter(k => !(old[k] && fs.existsSync(path.join(dir, old[k][0]))));
  if (todo.length) {
    const models = process.env.TTS_MODELS;
    if (!models) throw new Error('要做 ' + todo.length + ' 個新語音檔，但沒有設定 TTS_MODELS（模型資料夾），見 tools/tts_gen.py');
    const tmp = path.join(dir, '_todo.json');
    fs.writeFileSync(tmp, JSON.stringify(todo.map(k => [fname(k), want[k]])));
    cp.execFileSync('python3', [path.join(__dirname, 'tts_gen.py'), o.lang === 'sv' ? 'sv' : 'ko',
      String(o.lang === 'sv' ? 0 : 1), tmp, dir], { stdio: 'inherit', env: process.env });
    const dur = JSON.parse(fs.readFileSync(path.join(dir, '_dur.json'), 'utf8'));
    todo.forEach(k => { old[k] = [fname(k) + '.mp3', dur[fname(k)]]; });
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
