import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const script = await readFile('dist/hltv-zh-cn.user.js', 'utf8');
test('产物：选项动态值、实体语义变更与武器地图分离', async ({page}) => {
  await page.route('**/*', r => r.fulfill({contentType:'text/html',body:'<a class="nav-link">News</a><select><option id="option">Train</option></select><a id="link" href="/stats/maps">Train</a><span id="nick">Train</span><div class="stats-rows standard-box"><span id="weapon">inferno</span></div>'}));
  await page.goto('http://hltv.test/stats/players/weapon/1/test'); await page.addScriptTag({content:script});
  await expect(page.locator('#option')).toHaveText('列车停放站');
  await expect(page.locator('#weapon')).toHaveText('inferno');
  // 等待自身 MutationObserver 回调排空，避免由初次翻译恰好触发恢复造成假阳性。
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await page.evaluate(() => {
    document.querySelector('#option')!.textContent='All';
    document.querySelector('#link')!.setAttribute('href','/player/1/train');
    document.querySelector('#nick')!.className='player-nick';
  });
  await expect(page.locator('select')).toHaveValue('All');
  await expect(page.locator('#link')).toHaveText('Train'); await expect(page.locator('#nick')).toHaveText('Train');
  await page.evaluate(() => {document.querySelector('#option')!.textContent='Train';});
  await expect(page.locator('#option')).toHaveText('列车停放站');
  await page.evaluate(() => {document.querySelector('#option')!.replaceChildren();});
  await expect(page.locator('select')).toHaveValue('');
});

test('教练页完整产物：六标签、动态统计、关注样式与独立停用', async ({page}) => {
 const html=await readFile('tests/fixtures/coach-hally.html','utf8');
 await page.route('**/*',r=>r.fulfill({contentType:'text/html',body:html}));
 await page.goto('http://hltv.test/coach/2154/hally'); await page.addScriptTag({content:script});
 await expect(page.locator('.tab-holder .tab')).toHaveText(['资料','战队','比赛','成就','奖杯','新闻']);
 await expect(page.locator('#coachInfoBox h2').first()).toHaveText('hally 的执教数据（最近 3 个月）');
 expect(await page.locator('.fanbutton').evaluate(e=>getComputedStyle(e,'::after').content)).toContain('关注教练');
 await page.locator('.player-stat-of').first().evaluate(e=>{e.firstChild!.nodeValue='Based on 99 maps';});
 await expect(page.locator('.player-stat-of').first()).toHaveText('基于 99 张地图');
 await page.reload(); await page.evaluate(()=>{(window as any).GM_getValue=()=>({schemaVersion:2,modules:{coach:false}});}); await page.addScriptTag({content:script});
 await expect(page.locator('.tab-holder .tab').first()).toHaveText('Info');
 await expect(page.locator('#hltv-zh-player-style')).toHaveCount(0);
});
