import { expandSettings } from './menu-helpers';
import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const script = await readFile(process.env.HLTV_SCRIPT_PATH ?? 'dist/hltv-zh-cn.user.js', 'utf8');
const html = await readFile('tests/fixtures/matches-layout.html', 'utf8');

async function open(page: Page, path = '/matches', stored?: unknown, markup = html) {
  await page.addInitScript(initial => {
    const w = window as any;
    w.menus = [];
    w.GM_getValue = (key: string) => JSON.parse(sessionStorage.getItem(key) ?? 'null') ?? initial;
    w.GM_setValue = (key: string, value: unknown) => sessionStorage.setItem(key, JSON.stringify(value));
    w.nextMenuId = 0;
    w.GM_registerMenuCommand = (name: string, action: () => void) => { const id = w.nextMenuId++; w.menus.push({ id, name, action }); return id; };
    w.GM_unregisterMenuCommand = (id: number) => { w.menus = w.menus.filter((m: any) => m.id !== id); };
  }, stored ?? { schemaVersion: 2 });
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/userscript.js') return route.fulfill({ contentType: 'application/javascript', body: script });
    return route.fulfill({ contentType: 'text/html', body: markup.replace('</body>', '<script src="/userscript.js"></script></body>') });
  });
  await page.goto(`http://hltv.test${path}`);
}

test('赛事赛程复用比赛列表开关并汉化日期和对阵占位', async ({ page }) => {
  const schedule = `<!doctype html><meta charset="utf-8"><body>
    <a class="nav-link" href="/matches">Matches</a>
    <div class="headline-flex"><h1 class="upcoming-headline">Upcoming Counter-Strike matches</h1><i class="star-filter-btn" title="Enable match filter"></i></div>
    <div class="matches-list eventpage-matches-list">
      <div class="matches-event-page"><span class="event-headline">Saturday - 2026-11-14</span>
        <a href="/matches/1/semifinal"><div class="match-team"><div class="team text-ellipsis">G2/Falcons winner</div></div></a>
        <div class="match-stage">Semifinal</div><button class="match-notification" title="Toggle notificaton"></button>
      </div>
      <div class="matches-event-page"><span class="event-headline">Sunday - 2026-11-15</span>
        <a class="match-no-info" href="/matches/2/final"><span class="line-clamp-3">BLAST Rivals 2026 Season 2 - Grand Final</span></a>
        <div class="match-stage">Grand Final</div><div class="match-meta">BO5</div>
      </div>
    </div>
  </body>`;
  await open(page, '/events/8251/matches', { schemaVersion: 2, modules: { 'event-detail': false } }, schedule);
  await expect(page.locator('.upcoming-headline')).toHaveText('即将开始的 CS 比赛');
  await expect(page.locator('.event-headline')).toHaveText(['周六 - 2026-11-14', '周日 - 2026-11-15']);
  await expect(page.locator('.match-stage')).toHaveText(['半决赛', '总决赛']);
  await expect(page.locator('.match-team > .team')).toHaveText('G2/Falcons 胜者');
  await expect(page.locator('.match-notification')).toHaveAttribute('title', '切换比赛通知');
  const final = page.locator('.match-no-info');
  await expect(final).toHaveText('BLAST Rivals 2026 Season 2 - 总决赛');
  await expect(final).toHaveAttribute('href', '/matches/2/final');
  await expect(page.locator('.match-meta')).toHaveText('BO5');

  await expandSettings(page);
  await page.evaluate(() => (window as any).menus.find((item: any) => item.name.includes('比赛列表')).action());
  await expect(final).toHaveText('BLAST Rivals 2026 Season 2 - Grand Final');
  await expect(page.locator('.match-notification')).toHaveAttribute('title', 'Toggle notificaton');
});

async function labelsFit(page: Page) {
  const sizes = await page.locator('.match-meta-live, .match-stage').evaluateAll(elements => elements.map(el => {
    const range = document.createRange(); range.selectNodeContents(el);
    const box = el.getBoundingClientRect(), css = getComputedStyle(el);
    const rects = [...range.getClientRects()];
    return {
      lines: new Set(rects.map(r => Math.round(r.top))).size,
      inside: rects.every(r => r.left >= box.left + parseFloat(css.paddingLeft) - 0.5 && r.right <= box.right - parseFloat(css.paddingRight) + 0.5),
    };
  }));
  expect(sizes.length).toBeGreaterThan(0);
  for (const size of sizes) expect(size).toEqual({ lines: 1, inside: true });
}

test('比赛列表中文标签单行且文字完整容纳，动态比赛与按钮仍可用', async ({ page }) => {
  await open(page);
  await expect(page.locator('.match-meta-live')).toHaveText('进行中');
  await expect(page.locator('.match-stage').first()).toHaveText('四分之一决赛');
  await labelsFit(page);
  await page.evaluate(() => {
    (window as any).pinClicks = 0;
    document.querySelector('button')!.addEventListener('click', () => (window as any).pinClicks++);
    const live = document.querySelector('.match')!.cloneNode(true) as Element;
    live.querySelector('.match-meta-live')!.textContent = 'LIVE';
    document.querySelector('.matches-chronologically')!.append(live);
  });
  await expect(page.locator('.match-meta-live').last()).toHaveText('进行中');
  await labelsFit(page);
  await page.getByRole('button', { name: 'Pin match' }).click();
  expect(await page.evaluate(() => (window as any).pinClicks)).toBe(1);
  await expect(page.locator('.match-info').first()).toHaveAttribute('href', '/matches/1/live');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/matches-layout-${test.info().project.name}.png` });
});

test('停用比赛模块与全局汉化恢复原站样式，其他页面不注入', async ({ page }) => {
  await open(page);
  await expect(page.locator('#hltv-zh-matches-style')).toHaveCount(1);
  await expandSettings(page); await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('比赛列表')).action());
  await expect(page.locator('#hltv-zh-matches-style')).toHaveCount(0);
  await expect(page.locator('.match-meta-live')).toHaveText('LIVE');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await expect(page.locator('#hltv-zh-matches-style')).toHaveCount(1);
  await expandSettings(page); await page.evaluate(() => (window as any).menus.find((m: any) => m.name.startsWith('停用汉化')).action());
  await expect(page.locator('#hltv-zh-matches-style')).toHaveCount(0);
  await expect(page.locator('.match-meta-live')).toHaveText('LIVE');
  await page.evaluate(() => sessionStorage.clear());
  await page.goto('http://hltv.test/results');
  await expect(page.locator('.nav-link')).toHaveText('比赛');
  await expect(page.locator('#hltv-zh-matches-style')).toHaveCount(0);
});
