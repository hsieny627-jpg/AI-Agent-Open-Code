// 用 Playwright 錄製 index.html?render=true，輸出 video.webm（無音訊）
// 使用方式：node record.cjs <總秒數> [輸出檔名]
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const totalSec = Number(process.argv[2] || 260);
  const outName = process.argv[3] || 'video.webm';
  const browser = await chromium.launch({
    args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'],
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: path.join(__dirname, 'renders'), size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();
  const fileUrl = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/') + '?render=true';
  console.log('Loading:', fileUrl);
  await page.goto(fileUrl);
  await page.waitForTimeout(1500); // 字型載入
  console.log('Recording ' + totalSec + 's ...');
  await page.waitForTimeout(totalSec * 1000);
  await context.close();
  await browser.close();
  console.log('Done.');
})();
