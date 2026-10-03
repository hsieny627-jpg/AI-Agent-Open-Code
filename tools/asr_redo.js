/* tools/asr_redo.js — 把聽寫驗證對不上的語音檔從 aud.js 拿掉，下一次跑 _audio.js 就會重做（重做時 tts_gen.py 會當場聽、聽錯換語速）
 *   python3 tools/asr_check.py <資料夾…> --save   （ASR_BAD=清單檔）
 *   node tools/asr_redo.js <清單檔>
 */
const fs = require('fs'), path = require('path');
const BAD = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let n = 0;
Object.keys(BAD).forEach(d => {
  const f = path.join(d, 'aud.js'), src = fs.readFileSync(f, 'utf8');
  const m = /=\s*(\{[\s\S]*\});/.exec(src), man = JSON.parse(m[1]), head = src.slice(0, m.index).replace(/\s*$/, '');
  BAD[d].forEach(k => { if (man[k]) { delete man[k]; n++; } });
  fs.writeFileSync(f, src.replace(m[1], JSON.stringify(man)));
});
console.log('拿掉 ' + n + ' 個，下一次跑 _audio.js 會重做');
