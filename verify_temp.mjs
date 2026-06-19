import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
await page.screenshot({ path: 'screenshot_cover.png' });
console.log('Cover saved');

await page.click('.closed-card', { force: true });
await page.waitForTimeout(2500);

// Force IntersectionObserver by small scroll then back
await page.evaluate(() => {
  const v = document.querySelector('.content-view');
  if (v) { v.scrollTop = 1; setTimeout(() => { v.scrollTop = 0; }, 50); }
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshot_inner_top.png' });
console.log('Inner top saved');

await page.evaluate(() => { const v = document.querySelector('.content-view'); if (v) v.scrollTop = 400; });
await page.waitForTimeout(900);
await page.screenshot({ path: 'screenshot_inner_mid.png' });
console.log('Mid saved');

await page.evaluate(() => { const v = document.querySelector('.content-view'); if (v) v.scrollTop = 900; });
await page.waitForTimeout(900);
await page.screenshot({ path: 'screenshot_inner_events.png' });
console.log('Events saved');

await page.evaluate(() => { const v = document.querySelector('.content-view'); if (v) v.scrollTop = 1500; });
await page.waitForTimeout(900);
await page.screenshot({ path: 'screenshot_footer.png' });
console.log('Footer saved');

const checks = await page.evaluate(() => ({
  bodyBg: getComputedStyle(document.body).backgroundColor,
  ivory: getComputedStyle(document.documentElement).getPropertyValue('--ivory').trim(),
  rose: getComputedStyle(document.documentElement).getPropertyValue('--rose').trim(),
  nameText: document.querySelector('.name-asjad')?.textContent,
  eventTitles: [...document.querySelectorAll('.event-title')].map(e => e.textContent),
  hasWalima: document.body.textContent.includes('Walima'),
  countdownLabel: document.querySelector('.countdown-label')?.textContent,
  duaText: document.querySelector('.dua-text')?.textContent?.slice(0, 20),
}));
console.log('Checks:', JSON.stringify(checks, null, 2));
await browser.close();
