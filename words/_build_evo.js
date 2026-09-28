/* words/_build_evo.js — ⏳ 單字時光機：一次重建 54 頁（使用者 2026-09-28 指定，第 6(4)E 點）
 *   node words/_build_evo.js
 * 家人 17 ＋ 職業 5 ➜ words/；三年級數字 13 ➜ G3/numbers/；Sight Words 19 ➜ G3/sight/
 * 內容在 _evo_data.js，版面在 _evo.js。字卡上的「⏳ 時光機」按鈕由 _build.js 自動加（有資料才加）。
 */
const fs = require('fs'), path = require('path');
const EV = require('./_evo');
const G3 = path.join(__dirname, '..', 'G3 - L1 + L2');
const SVW = fs.existsSync(path.join(__dirname, 'audio', 'sv', 'aud.js')) ? '<script src="audio/sv/aud.js"></script>' : '';
const SVG3 = fs.existsSync(path.join(__dirname, 'audio', 'sv', 'aud.js'))
  ? '<script src="../../words/audio/sv/aud.js"></script><script>window.SVDIR="../../words/audio/sv/"</script>' : '';
const FAM = ['family','parent','mother','father','brother','sister','son','daughter','grandfather','grandmother','uncle','aunt','cousin','nephew','niece','husband','wife'];
const JOB = ['student','teacher','doctor','farmer','nurse'];
const NUM = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
const SIG = ['i','my','you','your','i-am','you-are','name','is','what','whats','how','old','how-old','year','years-old','who','where','when','why'];
const out = [].concat(
  EV.write(__dirname, FAM, { font: 'fonts/', home: '../index.html', whome: 'index.html', suffix: '單字小故事', svjs: SVW }),
  EV.write(__dirname, JOB, { font: 'fonts/', home: '../index.html', whome: 'index.html', suffix: '職業單字', svjs: SVW }),
  EV.write(path.join(G3, 'numbers'), NUM, { font: '../../words/fonts/', home: '../index.html', whome: 'index.html', suffix: '數字單字', svjs: SVG3 }),
  EV.write(path.join(G3, 'sight'), SIG, { font: '../../words/fonts/', home: '../index.html', whome: 'index.html', suffix: 'Sight Words', svjs: SVG3 }));
console.log('⏳ 時光機 ' + out.length + ' 頁');
module.exports = { FAM, JOB, NUM, SIG };
