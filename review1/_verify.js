/* review1/_verify.js — Review 1 單字卡自己的量測（words/_verify.js 量版面之外，再量這一組特有的）
 *
 *   node review1/_verify.js            量全部
 *   node review1/_verify.js stickers   只量檔名含這幾個字的
 *
 * 兩種尺寸（1024×768、820×1180）：
 *   - 每一幕：片語／句子那一排沒有折行、沒有超出字卡能放字的寬度、字沒有縮到太小（英文 ≧ 30px）
 *   - 每一個字／片語、片語裡的字、整句都有語音檔（audio/aud.js），音檔真的存在
 *   - 出處每一條：一頁放得下（不用捲）；第 1 條一定有小圖表
 * 只印失敗項與一行總結。先跑 words/_verify.js 量一般版面。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), DIR = __dirname;
const only = process.argv.slice(2);
const files = fs.readdirSync(DIR).filter(f => /\.html$/.test(f) && f !== 'index.html' && (!only.length || only.some(o => f.includes(o))));
const AUD = (() => { const t = fs.readFileSync(path.join(DIR, 'audio/aud.js'), 'utf8'); return JSON.parse(/=(\{[\s\S]*\});/.exec(t)[1]); })();
const key = s => String(s).replace(/[’]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
(async () => {
  const b = await chromium.launch(); const bad = []; let n = 0;
  for (const vp of [[1024, 768], [820, 1180]]) {
    const p = await b.newPage({ viewport: { width: vp[0], height: vp[1] } });
    for (const f of files) {
      await p.goto('file://' + path.join(DIR, f)); await p.waitForTimeout(400);
      const tag = f + ' ' + vp.join('×');
      for (let s = 0; s < 3; s++) {
        await p.evaluate(k => show(k), s); await p.waitForTimeout(700);
        const r = await p.evaluate(() => {
          const c = document.getElementById('card'), cs = getComputedStyle(c), f = c.querySelector('.r1ph');
          const out = { say: [] };
          [].forEach.call(c.querySelectorAll('[data-say]'), x => out.say.push(x.getAttribute('data-say')));
          if (f) {
            const av = c.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
            out.over = f.scrollWidth - av;
            /* 折行 ＝ 某一個字的元件高度超過一行（量版面高度，不受「唸到哪裡放大」的動畫影響） */
            out.rows = 1 + [].filter.call(f.querySelectorAll('.c .phw'), x => x.offsetHeight > 1.6 * parseFloat(getComputedStyle(x).fontSize)).length;
            out.px = Math.min.apply(null, [].map.call(f.querySelectorAll('.c .w'), x => parseFloat(getComputedStyle(x).fontSize)));
          }
          return out;
        });
        n++;
        if (r.over > 1) bad.push(tag + ' 幕' + (s + 1) + '：那一排超出 ' + r.over + 'px');
        if (r.rows > 1) bad.push(tag + ' 幕' + (s + 1) + '：那一排折成 ' + r.rows + ' 行');
        if (r.px && r.px < 30) bad.push(tag + ' 幕' + (s + 1) + '：英文縮到 ' + r.px + 'px');
        if (vp[0] === 1024) r.say.forEach(t => { const a = AUD[key(t)];
          if (!a) bad.push(tag + ' 幕' + (s + 1) + '：沒有語音檔「' + t + '」');
          else if (!fs.existsSync(path.join(DIR, 'audio', a[0]))) bad.push(tag + '：語音檔不見了 ' + a[0]); });
      }
      await p.evaluate(() => document.getElementById('srcb').click()); await p.waitForTimeout(300);
      const m = await p.evaluate(() => document.querySelectorAll('#src .sl').length);
      for (let k = 0; k < m; k++) {
        await p.evaluate(k => { const L = document.querySelectorAll('#src .sl'); L.forEach((x, j) => x.classList.toggle('on', j === k)); }, k);
        await p.waitForTimeout(150);
        const r = await p.evaluate(k => { const s = document.querySelector('#src .sbody'), L = document.querySelectorAll('#src .sl')[k];
          return { o: s.scrollHeight - s.clientHeight, w: s.scrollWidth - s.clientWidth, ch: !!L.querySelector('.r1c') }; }, k);
        n++;
        if (r.o > 1 || r.w > 1) bad.push(tag + ' 出處第 ' + (k + 1) + ' 條放不下（' + r.o + 'px）');
        if (k === 0 && !r.ch) bad.push(tag + ' 出處第 1 條沒有小圖表');
      }
    }
    await p.close();
  }
  await b.close();
  bad.forEach(x => console.log('✗ ' + x));
  console.log(bad.length ? '=== ' + bad.length + ' 個失敗' : '=== 全部通過：' + files.length + ' 頁 × 2 尺寸 × 共 ' + n + ' 個檢查點');
  process.exit(bad.length ? 1 : 0);
})();
