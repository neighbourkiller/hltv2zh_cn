import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { expandSettings } from './menu-helpers';

const script = await readFile(process.env.HLTV_SCRIPT_PATH ?? 'dist/hltv-zh-cn.user.js', 'utf8');
const fixture = await readFile('tests/fixtures/match-stats.html', 'utf8');

async function open(page: Page) {
  await page.addInitScript(() => {
    const w = window as any;
    w.menus = []; w.nextMenuId = 0;
    w.GM_getValue = (key: string) => JSON.parse(sessionStorage.getItem(key) ?? 'null') ?? { schemaVersion: 2 };
    w.GM_setValue = (key: string, value: unknown) => sessionStorage.setItem(key, JSON.stringify(value));
    w.GM_registerMenuCommand = (name: string, action: () => void) => { const id = w.nextMenuId++; w.menus.push({ id, name, action }); return id; };
    w.GM_unregisterMenuCommand = (id: number) => { w.menus = w.menus.filter((m: any) => m.id !== id); };
  });
  await page.route('**/*', route => {
    if (new URL(route.request().url()).pathname === '/userscript.js') return route.fulfill({ contentType: 'application/javascript', body: script });
    return route.fulfill({ contentType: 'text/html', body: fixture.replace('</body>', `<script>
      window.originalNodes = [...document.querySelectorAll('.stats-match *')];
      window.originalLinks = [...document.querySelectorAll('a')].map(e => e.getAttribute('href'));
      window.ecoClicks = 0; window.sideClicks = [];
      document.querySelectorAll('.toggle-eco-adjusted').forEach(button => button.addEventListener('click', () => {
        window.ecoClicks++;
        document.querySelectorAll('.traditional-data,.eco-adjusted-data').forEach(e => e.classList.toggle('hidden'));
      }));
      document.querySelectorAll('.all-stats,.t-stats-only,.ct-stats-only').forEach(button => button.addEventListener('click', () => {
        window.sideClicks.push(button.className.split(' ')[0]);
        document.querySelectorAll('.ct-t-stats-container .active').forEach(e => e.classList.remove('active')); button.classList.add('active');
      }));
    </script><script src="/userscript.js"></script></body>`) });
  });
  await page.goto('http://hltv.test/stats/matches/132086/betboom-vs-legacy');
  await expect(page.locator('.match-page-link')).toHaveText('查看比赛详情');
}

test('比赛详细数据的经济/阵营切换保留原监听器、节点、数值和链接', async ({ page }) => {
  await open(page);
  await expect(page.locator('.top-players .most-x-title')).toHaveText(['最多击杀', '最高伤害', '最多助攻', '最多 AWP 击杀', '最多首杀', '最佳 Rating 3.0']);
  await expect(page.locator('.match-info-row > .bold')).toHaveText(['战队 Rating 3.0', '首杀', '残局获胜']);
  await expect(page.locator('.stats-match > .standard-headline').first()).toHaveText('表现 - Rating 3.0');
  await expect(page.locator('.st-clutches')).toHaveAttribute('title', '残局获胜次数');
  await expect(page.locator('.st-assists span')).toHaveAttribute('title', /闪光助攻/);
  const data = await page.locator('tbody td').allTextContents();
  const eco = page.locator('.toggle-eco-adjusted:visible');
  await expect(eco).toHaveText('经济调整'); await eco.click();
  await expect(page.locator('th.eco-adjusted-data')).toBeVisible();
  await expect(page.locator('th.eco-adjusted-data')).toHaveAttribute('title', '每回合平均伤害，已根据经济进行调整。');
  await expect(page.locator('td.eco-adjusted-data')).toHaveText('79.2');
  await page.locator('.t-stats-only').click(); await expect(page.locator('.t-stats-only')).toHaveClass(/active/);
  await page.locator('.ct-stats-only').click(); await expect(page.locator('.ct-stats-only')).toHaveClass(/active/);
  await page.locator('.all-stats').click(); await expect(page.locator('.all-stats')).toHaveText('双方');
  await eco.click();
  expect(await page.evaluate(() => ({ eco: (window as any).ecoClicks, sides: (window as any).sideClicks }))).toEqual({ eco: 2, sides: ['t-stats-only', 'ct-stats-only', 'all-stats'] });
  expect(await page.locator('tbody td').allTextContents()).toEqual(data);
  expect(await page.evaluate(() => [...document.querySelectorAll('.stats-match *')].every((e, i) => e === (window as any).originalNodes[i]))).toBe(true);
  expect(await page.locator('a').evaluateAll(es => es.map(e => e.getAttribute('href')))).toEqual(await page.evaluate(() => (window as any).originalLinks));
  await expect(page.locator('.st-rating')).toHaveText('Rating3.0');
  await expect(page.locator('.team-right a')).toHaveText('Legacy');
});

test('比赛详细数据动态回写、提示插入和统计开关刷新后恢复原文', async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    document.querySelector('.most-x-title')!.firstChild!.nodeValue = 'Most assists';
    document.querySelector('.toggle-eco-adjusted')!.firstChild!.nodeValue = 'Eco-adj';
    const card = document.querySelector('.most-x-box')!.cloneNode(true) as Element;
    card.querySelector('.most-x-title')!.textContent = 'Most first kills';
    document.querySelector('.top-players')!.append(card);
    const tooltip = document.querySelector('.context-tooltip')!.cloneNode(true) as Element;
    tooltip.querySelector('a')!.lastChild!.nodeValue = 'Go to Event';
    document.querySelector('.stats-match')!.append(tooltip);
  });
  await expect(page.locator('.top-players .most-x-title').first()).toHaveText('最多助攻');
  await expect(page.locator('.top-players .most-x-title').last()).toHaveText('最多首杀');
  await expect(page.locator('.stats-match > .context-tooltip a').first()).toHaveText('查看赛事');
  await expect(page.locator('.toggle-eco-adjusted').first()).toHaveText('经济调整');
  await expect(page.locator('.thread-message-text .most-x-title')).toHaveText('Most kills');
  await expandSettings(page);
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('统计数据')).action());
  await expect(page.locator('.match-page-link')).toHaveText('More info on match page');
  await expect(page.locator('.toggle-eco-adjusted').first()).toHaveText('Eco-adjusted');
  await expect(page.locator('.st-clutches')).toHaveAttribute('title', 'Clutches won');
  await expect(page.locator('.nav-link')).toHaveText('数据');
  await expect(page.locator('.dynamic-map-name-full').last()).toHaveText('核子危机');
});
