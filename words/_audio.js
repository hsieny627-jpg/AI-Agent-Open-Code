/* words/_audio.js — 單字網站（四年級家人、職業、故事、時光機、環遊世界，三年級數字、Sight Words）會唸到的英文，
 * 全部預先做成語音檔（使用者 2026-10-03 指定：全站單字和句型的發音要最高品質、美式、自然道地）。
 *
 *   TTS_MODELS=<模型資料夾> node words/_audio.js      然後把單字網站全部重建一次（見 words/CLAUDE.md）
 *
 * 怎麼收：用瀏覽器把每一頁打開，一幕一幕翻（show(0)、show(1)…），把畫面上會唸的東西全部記下來：
 *   [data-say]（點了會唸的字、說明裡自動變成可以點的英文）、[data-sent]（整句）、單字卡的 W.now；
 *   再加上原始碼裡的 {{單字}}（要點了或猜完才出現的字），以及每一個字的「音節」（tools/syl_ph.js，音節動畫一段一段唸）。
 * 外國語（data-lang 不是英文）不收：瑞典文另外有 words/audio/sv/，其他語言用瀏覽器語音。
 * Review 1 的字卡有自己的 review1/audio/（review1/_audio.js），這裡不收。 */
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pack } = require('../tools/audio_pack');
const PH = require('./_phonics');
const SYL = require('../tools/syl_ph');
const ROOT = path.join(__dirname, '..');
const G3 = path.join(ROOT, 'G3 - L1 + L2');
const files = [];
const add = d => fs.readdirSync(d).filter(f => /\.html$/.test(f)).forEach(f => files.push(path.join(d, f)));
add(__dirname); add(path.join(G3, 'numbers')); add(path.join(G3, 'sight'));

(async () => {
  const T = new Set();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1024, height: 768 } });
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    if (!/var PH=/.test(src)) continue;
    src.replace(/\{\{([^{}:]+)\}\}/g, (m, w) => { T.add(w.trim()); return m; });
    await p.goto('file://' + f);
    await p.waitForTimeout(150);
    const got = await p.evaluate(async () => {
      const out = new Set();
      const grab = () => {
        document.querySelectorAll('[data-say],[data-sent]').forEach(e => {
          const lang = e.getAttribute('data-lang') || (e.closest('[data-lang]') && e.closest('[data-lang]').getAttribute('data-lang'));
          if (lang && !/^en/i.test(lang)) return;
          const t = e.getAttribute('data-sent') || e.getAttribute('data-say');
          if (t && /[A-Za-z]/.test(t)) out.add(t);
        });
        try { if (window.W && W.now) out.add(W.now); } catch (e) {}
      };
      grab();
      if (typeof show === 'function') {
        const n = (window.SCENES && SCENES.length) || (window.S && S.length) || document.querySelectorAll('#dots i').length || 0;
        for (let k = 0; k < n; k++) { try { show(k); } catch (e) {} grab(); }
      }
      return [...out];
    });
    got.forEach(t => T.add(t));
  }
  await b.close();
  /* 拆開的字母群（twe、lf）、程式碼片段、有 ＋ 的拆解式不收 */
  const texts = [...T].filter(t => /[aeiouy]/i.test(t) && !/[一-鿿+＋{}]/.test(t));
  const syl = SYL.texts(PH.DATA);
  if (process.env.DUMP) fs.writeFileSync(process.env.DUMP, texts.join('\n'));
  /* 2026-10-04 使用者：全站單字卡唸慢一點 ➜ Kokoro 語速參數 0.85（不是播放時放慢，聲音不變調） */
  const r = pack({ texts: texts.concat(syl), dir: path.join(__dirname, 'audio', 'en'), varName: 'ENAUD', speed: 0.85 });
  console.log('單字網站英文語音檔：' + r.total + ' 個（新做 ' + r.made + ' 個；音節 ' + syl.length + ' 段）');
})();
