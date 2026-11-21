import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { expandSettings } from './menu-helpers';

const script = await readFile(process.env.HLTV_SCRIPT_PATH ?? 'dist/hltv-zh-cn.user.js', 'utf8');
async function open(page: Page, major = false) {
  const fixture = await readFile(`tests/fixtures/vrs-forecast${major ? '-major' : ''}.html`, 'utf8');
  await page.addInitScript(() => {
    const w = window as any; w.menus = []; w.nextMenuId = 0;
    w.GM_getValue = (key: string) => JSON.parse(sessionStorage.getItem(key) ?? 'null');
    w.GM_setValue = (key: string, value: unknown) => sessionStorage.setItem(key, JSON.stringify(value));
    w.GM_registerMenuCommand = (name: string, action: () => void) => { const id = w.nextMenuId++; w.menus.push({ id, name, action }); return id; };
    w.GM_unregisterMenuCommand = (id: number) => { w.menus = w.menus.filter((m: any) => m.id !== id); };
  });
  await page.route('**/*', route => {
    if (new URL(route.request().url()).pathname === '/userscript.js') return route.fulfill({ contentType: 'application/javascript', body: script });
    return route.fulfill({ contentType: 'text/html', body: fixture.replace('</head>', `<style>
      .hidden,.region-selector,.vrs-team-details{display:none}.vrs-team-details.expanded{display:table-row}
      body{font:13px Arial,sans-serif;margin:16px}.vrs-simulation-table{width:100%;border-collapse:collapse}
      th,td{padding:6px}.vrs-story-grid{display:flex;gap:12px}.vrs-story-name,.team-name{font-weight:bold}
      .vrs-what-if-dialog{max-width:90vw;max-height:80vh}.vrs-what-if-rows{max-height:60vh;overflow:auto}
      .vrs-what-if-row{display:flex;align-items:center;gap:8px;margin:8px 0}.vrs-what-if-team{min-width:70px}
      .vrs-what-if-pick{max-width:160px}.vrs-what-if-dialog::backdrop{background:#0005}
    </style></head>`).replace('</body>', `<script>
      window.originalNodes = [...document.querySelectorAll('*')];
      window.originalLinks = [...document.querySelectorAll('a')].map(e => e.getAttribute('href'));
      window.originalValues = [...document.querySelectorAll('option')].map(e => e.value);
      window.originalNames = [...document.querySelectorAll('.team-name,.vrs-story-name,.vrs-power-name')].map(e => e.textContent);
      window.pickChanges = 0;
      document.querySelector('.vrs-what-if-open').addEventListener('click',()=>document.querySelector('dialog').showModal());
      document.querySelector('.vrs-what-if-close').addEventListener('click',()=>document.querySelector('dialog').close());
      document.querySelectorAll('select').forEach(e=>e.addEventListener('change',()=>window.pickChanges++));
      document.querySelector('.vrs-what-if-form').addEventListener('submit',e=>{e.preventDefault();window.submittedPicks = new FormData(e.target).getAll('picks');});
      document.querySelectorAll('.vrs-simulation-row').forEach(e=>e.addEventListener('click',()=>e.nextElementSibling.classList.toggle('expanded')));
    </script><script src="/userscript.js"></script></body>`) });
  });
  await page.goto(`http://hltv.test/valve-ranking/teams/event/${major ? 8302 : 8295}`);
  await expect(page.locator('.vrs-what-if-open')).toHaveText('假设结果…');
}

for (const major of [false, true]) test(`${major ? 'Major' : '普通赛事'}预测：弹窗、假设提交与展开保留节点、原值和监听器`, async ({ page }) => {
  await open(page, major);
  await expect(page.locator('.ranking-description')).toContainText('1500 个模拟赛季');
  await expect(page.locator('.vrs-simulation-table .header-with-tooltip').first()).toHaveText('获邀概率');
  if (major) {
    await expect(page.locator('.valve-ranking-region-header')).toHaveText(['欧洲EU', '美洲AM', '亚洲AS']);
    await expect(page.locator('.vrs-simulation-table th.stage').first()).toHaveText('第 3 阶段');
  }
  await page.locator('.vrs-what-if-open').click(); await expect(page.locator('dialog')).toBeVisible();
  await expect(page.locator('.vrs-what-if-close')).toHaveAttribute('aria-label', '关闭');
  const picked = (await page.locator('.vrs-what-if-pick > option').first().getAttribute('value'))!;
  await page.locator('.vrs-what-if-pick').first().selectOption(picked);
  await page.locator('.vrs-what-if-apply').click();
  expect(await page.evaluate(() => (window as any).submittedPicks[0])).toBe(picked);
  expect(await page.evaluate(() => (window as any).pickChanges)).toBe(1);
  await page.locator('.vrs-what-if-close').click(); await expect(page.locator('dialog')).not.toBeVisible();
  await page.locator('.vrs-simulation-row').first().click(); await expect(page.locator('.vrs-team-details').first()).toBeVisible();
  await expect(page.locator('.vrs-team-details .vrs-details-more > a').first()).toHaveText('HLTV 战队档案');
  await page.locator('.vrs-power-ranking-title').first().click(); await expect(page.locator('.vrs-power-ranking-intro').first()).toBeVisible();
  expect(await page.evaluate(() => (window as any).originalNodes.every((e: Element) => e.isConnected))).toBe(true);
  expect(await page.locator('a').evaluateAll(es => es.map(e => e.getAttribute('href')))).toEqual(await page.evaluate(() => (window as any).originalLinks));
  expect(await page.locator('option').evaluateAll(es => es.map(e => (e as HTMLOptionElement).value))).toEqual(await page.evaluate(() => (window as any).originalValues));
  expect(await page.locator('.team-name,.vrs-story-name,.vrs-power-name').allTextContents()).toEqual(await page.evaluate(() => (window as any).originalNames));
});

test('预测动态文案/新提示与模块停用刷新，保留假设表单原值', async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    document.querySelector('.vrs-race')!.firstChild!.nodeValue = '9 of 12 spots are all but settled. 10 teams chase the other 3.';
    document.querySelector('.qualify-verdict')!.setAttribute('title', 'Invited in 1400 of the 1500 simulated seasons.');
    const span = document.createElement('span'); span.className = 'vrs-tooltip'; span.textContent = 'How often the team got an invite across the simulated seasons.'; document.body.append(span);
  });
  await expect(page.locator('.vrs-race')).toHaveText('12 个名额中已有 9 个基本确定，10 支队伍争夺剩余 3 个名额。');
  await expect(page.locator('.qualify-verdict').first()).toHaveAttribute('title', '在 1500 个模拟赛季中，有 1400 个赛季获邀。');
  await expect(page.locator('body > .vrs-tooltip')).toHaveText('该队在全部模拟赛季中获邀的比例。');
  await expandSettings(page); await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('VRS 赛事邀请预测')).action());
  await expect(page.locator('.vrs-what-if-open')).toHaveText('What if…');
  await expect(page.locator('.vrs-what-if-pick').first()).toHaveValue('');
  await expect(page.locator('.vrs-what-if-pick > option').first()).toHaveText('MOUZ win');
});
