import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const script = await readFile(process.env.HLTV_SCRIPT_PATH ?? 'dist/hltv-zh-cn.user.js', 'utf8');
const fixture = await readFile('tests/fixtures/p0.html', 'utf8');
const sidebar = await readFile('tests/fixtures/home-sidebar.html', 'utf8');
const playerProfile = await readFile('tests/fixtures/player.html', 'utf8');
const playerStats = await readFile('tests/fixtures/player-stats.html', 'utf8');
const eventDetail = await readFile('tests/fixtures/event-detail.html', 'utf8');
const matchLineups = await readFile('tests/fixtures/match-lineups.html', 'utf8');
const playerCompare = await readFile('tests/fixtures/player-compare.html', 'utf8');
const playerComparePicker = await readFile('tests/fixtures/player-compare-picker.html', 'utf8');
const playerCompareSingle = await readFile('tests/fixtures/player-compare-single.html', 'utf8');
const playerCompare2026 = await readFile('tests/fixtures/player-compare-2026.html', 'utf8');
const statisticsOverview = await readFile('tests/fixtures/statistics-overview.html', 'utf8');
const statisticsMaps = await readFile('tests/fixtures/statistics-maps.html', 'utf8');
const ranking = await readFile('tests/fixtures/ranking.html', 'utf8');
const valveRanking = await readFile('tests/fixtures/valve-ranking.html', 'utf8');
const vrsInvites = await readFile('tests/fixtures/vrs-invites.html', 'utf8');
const teamProfile = await readFile('tests/fixtures/team-profile.html', 'utf8');
const hltvRankingDetail = await readFile('tests/fixtures/hltv-ranking-detail.html', 'utf8');
const valveRankingDetail = await readFile('tests/fixtures/valve-ranking-detail.html', 'utf8');
const dynamicState = await readFile('tests/fixtures/dynamic-state.html', 'utf8');
const matchDetailC = await readFile('tests/fixtures/match-detail.html', 'utf8');
const matchRecommendation = await readFile('tests/fixtures/match-recommendation.html', 'utf8');
const statisticsSpecialty = await readFile('tests/fixtures/statistics-specialty.html', 'utf8');
const transfersD = await readFile('tests/fixtures/transfers.html', 'utf8');
const transfersEmptyD = await readFile('tests/fixtures/transfers-empty.html', 'utf8');
const fantasyD = await readFile('tests/fixtures/fantasy.html', 'utf8');
const fantasyCelebrityD = await readFile('tests/fixtures/fantasy-celebrity.html', 'utf8');
const fantasyCustomD = await readFile('tests/fixtures/fantasy-custom.html', 'utf8');

test('阶段 D：转会筛选、嵌套实体、动态换行与真实空结构', async ({ page }) => {
  await open(page, '/transfers', {schemaVersion:2,maps:'zh-CN'}, transfersD);
  await expect(page.locator('.transfer .standard-headline')).toHaveText('Counter-Strike 转会');
  await expect(page.locator('.transfer-team-status').filter({hasText:'替补'}).first()).toHaveText('替补');
  await expect(page.locator('.transfer-movement').filter({hasText:'回归主力阵容'})).toHaveCount(1);
  await expect(page.locator('.transfer-movement').filter({hasText:'担任教练'})).toHaveCount(1);
  await expect(page.locator('.transfer-movement a b').filter({hasText:'Ancient'}).first()).toHaveText('Ancient');
  await expect(page.locator('.transfer-filter-country')).toHaveAttribute('placeholder','搜索国家…');
  const links = await page.locator('option').evaluateAll(options=>options.map(e=>e.getAttribute('data-link')));
  await page.evaluate(()=>{
    const w = window as any; w.filterEvents=[];
    document.querySelector('.transfer-filter-ranking')!.addEventListener('change', e=>w.filterEvents.push((e.target as HTMLSelectElement).value));
    document.querySelector('.transfer-filter-time')!.addEventListener('change', e=>w.filterEvents.push((e.target as HTMLSelectElement).value));
    document.querySelector('.transfer-filter-free-agents')!.addEventListener('change',()=>{
      const group = document.querySelector('.transfers-grouped')!;
      const row = group.querySelector('.transfer-row')!.cloneNode(true) as HTMLElement;
      row.querySelector('.transfer-movement')!.childNodes[1].nodeValue=' joins ';
      group.replaceChildren(row);
    });
  });
  await page.locator('.transfer-filter-ranking').selectOption('Top 5');
  await page.locator('.transfer-filter-time').selectOption('Last month');
  expect(await page.evaluate(()=>(window as any).filterEvents)).toEqual(['Top 5','Last month']);
  expect(await page.locator('option').evaluateAll(options=>options.map(e=>e.getAttribute('data-link')))).toEqual(links);
  await page.locator('.transfer-filter-country').fill('Ancient'); await expect(page.locator('.transfer-filter-country')).toHaveValue('Ancient');
  await page.locator('.transfer-filter-free-agents').check();
  await expect(page.locator('.transfer-movement')).toContainText('加入'); await expect(page.locator('.transfer-row')).toHaveCount(1);
  await open(page, '/transfers?country=Ethiopia', undefined, transfersEmptyD);
  await expect(page.locator('.transfers-grouped')).toBeEmpty();
});

test('阶段 D：Fantasy 原节点展开、三类排行榜替换、数值与实体保持', async ({ page }) => {
  await open(page,'/fantasy',{schemaVersion:2,maps:'zh-CN'},fantasyD);
  await expect(page.locator('.season-headline').first()).toHaveText('Fantasy 2026年秋季赛季');
  await expect(page.locator('.game-name').first()).toHaveText('Ancient');
  await expect(page.locator('.leaderboard-table td.player').first()).toHaveText('Summer');
  const numbers = await page.locator('.points-table td').allTextContents();
  const inputs = page.locator('.admin-input-search input'); await expect(inputs).toHaveAttribute('placeholder','搜索用户…');
  await inputs.fill('Train'); await expect(inputs).toHaveValue('Train');
  await page.evaluate(states=>{
    const w = window as any; w.dStates=states; w.monthClicks=0;
    document.querySelector('.hidden-month-button')!.addEventListener('click',()=>{
      w.monthClicks++; const hidden = document.querySelector('.hidden-month')!; hidden.classList.remove('hidden-month');
      hidden.querySelector('.month-text')!.firstChild!.nodeValue='September 2026';
    });
    document.querySelectorAll('.season-standing-tabs .tab').forEach((tab,i)=>tab.addEventListener('click',()=>{
      if (!i) return;
      const doc = new DOMParser().parseFromString(w.dStates[i-1],'text/html');
      document.querySelector('.tabs-content')!.replaceChildren(doc.querySelector('.season-tab-content')!);
    }));
  },[fantasyCelebrityD,fantasyCustomD]);
  await page.locator('.hidden-month-button').first().click();
  expect(await page.evaluate(()=>(window as any).monthClicks)).toBe(1);
  await expect(page.locator('.month-text').filter({hasText:'2026年9月'})).toHaveCount(1);
  expect(await page.locator('.points-table td').allTextContents()).toEqual(numbers);
  await page.evaluate(()=>{
    const pagination = document.createElement('div'); pagination.className='leaderboard-pagination';
    const link = document.createElement('a'); link.href='/fantasy?offset=0'; link.textContent='To Top'; pagination.append(link);
    document.querySelector('.leaderboard-count')!.append(pagination);
  });
  await expect(page.locator('.leaderboard-pagination > a')).toHaveText('回到榜首');
  await expect(page.locator('.leaderboard-pagination > a')).toHaveAttribute('href','/fantasy?offset=0');
  await page.locator('.season-standing-tabs .tab').nth(1).click();
  await expect(page.locator('.leaderboard-headline')).toContainText('名人排行榜');
  await expect(page.locator('.leaderboard-table td.player').first()).toHaveText('Ancient');
  await page.locator('.season-standing-tabs .tab').nth(2).click();
  await expect(page.locator('.custom-leaderboard-button')).toHaveText('创建自定义排行榜');
  await expect(page.locator('.empty-custom-leaderboard')).toContainText('整个 Fantasy 赛季的积分');
  await page.evaluate(()=>{ document.querySelector('.custom-leaderboard-signin-message')!.textContent='You have to sign in to use the custom leaderboards'; });
  await expect(page.locator('.custom-leaderboard-signin-message')).toHaveText('登录后即可使用自定义排行榜');
});

test('阶段 D：新增菜单独立关闭、配置保存和未采样子路由保持', async ({ page }) => {
  await open(page,'/transfers',{schemaVersion:2,maps:'en',modules:{fantasy:false,team:false}},transfersD);
  await expect(page.locator('.transfer .standard-headline')).toHaveText('Counter-Strike 转会');
  const names = await page.evaluate(()=>(window as any).menus.map((m:any)=>m.name));
  expect(names).toContain('✓ 独立转会（切换并刷新）'); expect(names).toContain('○ Fantasy 总览（切换并刷新）');
  await page.evaluate(()=>(window as any).menus.find((m:any)=>m.name.includes('独立转会')).action());
  await expect(page.locator('.transfer .standard-headline')).toHaveText('Counter-Strike transfers');
  await expect(page.locator('.nav-link')).toHaveText('新闻');
  expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('hltv2zh-cn.settings.v1')!))).toMatchObject({maps:'en',modules:{transfers:false,fantasy:false,team:false}});
  await open(page,'/fantasy/662/gameredirect',undefined,fantasyD);
  await expect(page.locator('.season-headline').first()).toHaveText('Fantasy Fall season 2026');
});

test('阶段 D：Fantasy 关闭恢复原文，动态未知状态与正文反例保持', async ({ page }) => {
  await open(page,'/fantasy',{schemaVersion:2,maps:'zh-CN'},fantasyD);
  await expect(page.locator('.live-btn')).toHaveText('进行中');
  await page.evaluate(()=>{
    const summary = document.querySelector('.summary')!; summary.firstChild!.nodeValue='17 games (14 cancelled)';
    const forum = document.createElement('div'); forum.className='thread-message-text';
    const clone = document.querySelector('.fantasy-frontpage')!.cloneNode(true) as HTMLElement;
    clone.querySelector('.live-btn')!.lastChild!.nodeValue='LIVE'; forum.append(clone); document.body.append(forum);
  });
  await expect(page.locator('.fantasy-frontpage').first().locator('.summary').first()).toHaveText('17 games (14 cancelled)');
  await expect(page.locator('.thread-message-text .live-btn')).toHaveText('LIVE');
  await page.evaluate(()=>(window as any).menus.find((m:any)=>m.name.includes('Fantasy 总览')).action());
  await expect(page.locator('.season-headline').first()).toHaveText('Fantasy Fall season 2026');
  await expect(page.locator('.admin-input-search input')).toHaveAttribute('placeholder','Search for user ...');
});

test('阶段 C：比赛经济切换保持原监听器、数值、节点和 Rating 版本', async ({ page }) => {
  await open(page, '/matches/2398751/example', undefined, matchDetailC);
  await expect(page.locator('.roundSwing')).toHaveText('影响力');
  await expect(page.locator('.adr.eco-adjusted-data')).toHaveAttribute('title', '每回合平均伤害，已根据经济进行调整。');
  await expect(page.locator('.rating')).toHaveText('Rating3.0');
  await page.evaluate(() => {
    document.querySelector('#all')!.className = 'all dynamic-map-name-short';
    document.querySelector('#all')!.firstChild!.nodeValue = 'All';
  });
  await expect(page.locator('#all')).toHaveText('全部');
  const before = await page.locator('.player-row td').allTextContents();
  await page.evaluate(() => {
    (window as any).cHeader = document.querySelector('.roundSwing');
    document.querySelectorAll('.toggle-eco-adjusted').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('.eco-adjusted-data,.traditional-data').forEach(e => e.classList.toggle('hidden'));
    }));
  });
  await page.locator('.toggle-eco-adjusted:visible').click();
  await expect(page.locator('.header-row .eco-adjusted-data').first()).toBeVisible();
  await expect(page.locator('.header-row .traditional-data').first()).toBeHidden();
  await page.locator('.toggle-eco-adjusted:visible').click();
  await expect(page.locator('.header-row .traditional-data').first()).toBeVisible();
  expect(await page.locator('.player-row td').allTextContents()).toEqual(before);
  expect(await page.evaluate(() => document.querySelector('.roundSwing') === (window as any).cHeader)).toBe(true);
  await page.evaluate(() => document.querySelector('.headline > .subtext')!.firstChild!.nodeValue = 'won with 7.25% of the votes');
  await expect(page.locator('.headline > .subtext').first()).toHaveText('以 7.25% 的得票率获胜');
  await page.evaluate(() => document.querySelector('.headline > .subtext')!.firstChild!.nodeValue = 'unknown 4.0 vote status');
  await expect(page.locator('.headline > .subtext').first()).toHaveText('unknown 4.0 vote status');
  await expect(page.locator('.motm-countdown')).toHaveText('投票倒计时： 1h : 20m : 03s');
});

test('阶段 C：推荐空状态保留图标、动态生成的提示和正文保护', async ({ page }) => {
  await open(page, '/matches', undefined, matchRecommendation);
  await expect(page.locator('#for-you-empty-div > b')).toHaveText('暂时没有为你推荐的比赛。');
  await expect(page.locator('#for-you-empty-div > i')).toHaveCount(1);
  await expect(page.locator('.match-teamname')).toHaveText('Ancient');
  await page.evaluate(() => {
    const tip = document.createElement('div'); tip.className = 'tooltip-box starred-matches-description-tooltip';
    tip.textContent = 'For you are a collection of matches that are either about to start, manually pinned, feature your favorite player(s) or team(s), or are related to your current location.';
    document.body.append(tip);
  });
  await expect(page.locator('body > .starred-matches-description-tooltip')).toHaveText('为你推荐即将开始、手动置顶、包含你关注的选手或战队，或与你当前所在地相关的比赛。');
  await expect(page.locator('.thread-message-text')).toHaveText('No matches for you yet.');
});

test('阶段 C：统计筛选、排序和分页的夹具监听器保持，专项 tooltip 保留数字', async ({ page }) => {
  await open(page, '/stats/teams/pistols', undefined, statisticsSpecialty);
  await expect(page.locator('th').first()).toHaveText('战队');
  await expect(page.locator('th').nth(6)).toHaveAttribute('title', '赢得手枪局后，第 2 回合的胜率。');
  await expect(page.locator('#fast > b')).toHaveText('快速多杀：');
  await expect(page.locator('#fast')).toContainText('相邻击杀间隔少于 5 秒');
  await page.evaluate(() => {
    const detached = document.querySelector('#fast')!.cloneNode(true) as HTMLElement;
    detached.id = 'detached-fast'; detached.innerHTML = '<b>Fast multi-kill:</b>A streak of kills done by a player with less than 5 seconds between each kill. It\'s possible to do more than one fast multi-kill in a single round.';
    document.body.append(detached);
  });
  await expect(page.locator('#detached-fast > b')).toHaveText('快速多杀：');
  await expect(page.locator('#detached-fast')).toContainText('相邻击杀间隔少于 5 秒');
  await expect(page.locator('#unknown')).toHaveText('Unknown tooltip version 4.0 with 17 rounds.');
  await page.evaluate(() => {
    (window as any).sorts = 0;
    document.querySelector('th')!.addEventListener('click', () => (window as any).sorts++);
    document.querySelector('#time')!.addEventListener('change', e => (window as any).filterValue = (e.target as HTMLSelectElement).value);
    document.querySelector('#next')!.addEventListener('click', e => { e.preventDefault(); document.querySelector('.pagination-data')!.firstChild!.nodeValue = '51 - 100 of 1,204'; });
  });
  await page.locator('th').first().click(); expect(await page.evaluate(() => (window as any).sorts)).toBe(1);
  await page.locator('#time').selectOption('3'); expect(await page.evaluate(() => (window as any).filterValue)).toBe('3');
  await page.locator('#next').click(); await expect(page.locator('.pagination-data')).toHaveText('第 51–100 条，共 1,204 条');
  await expect(page.locator('a[href="/stats/teams/1/ancient"]')).toHaveText('Ancient');
  await expect(page.locator('input')).toHaveValue('Ancient');
});

test('阶段 C：选手快速多杀、构建产物模块关闭及英文恢复', async ({ page }) => {
  await open(page, '/stats/players/multikills/21167/two/donk', undefined, statisticsSpecialty);
  await expect(page.locator('.toggle-fast-multi-kills-only > a').first()).toHaveText('仅显示快速多杀');
  await expect(page.locator('#fast > b')).toHaveText('快速多杀：');
  await open(page, '/stats/players/multikills/21167/two/donk', { schemaVersion: 2, maps: 'en', modules: { 'player-stats': false } }, statisticsSpecialty);
  await expect(page.locator('.toggle-fast-multi-kills-only > a').first()).toHaveText('Fast multi-kills only');
  await expect(page.locator('#fast > b')).toHaveText('Fast multi-kill:');
  await expect(page.locator('#fast')).toContainText('less than 5 seconds');
});

test('动态机制：class 状态进出、实体先写入和轮次原监听器保持', async ({ page }) => {
  await open(page, '/events/8244/example', { schemaVersion: 2, maps: 'zh-CN' }, dynamicState);
  await expect(page.locator('.round-header')).toHaveText('四分之一决赛');
  await page.evaluate(() => {
    const header = document.querySelector('.round-header')!;
    (window as any).originalHeader = header;
    header.addEventListener('click', () => {
      const collapsed = header.parentElement!.classList.toggle('collapsed');
      header.firstChild!.nodeValue = collapsed ? 'Quarters' : 'Quarter-finals';
      header.setAttribute('title', collapsed ? 'Expand round' : 'Collapse round');
    });
    document.querySelector('#team')!.classList.add('team-tbd');
  });
  await expect(page.locator('.team-name')).toHaveText('待定');
  await page.evaluate(() => document.querySelector('#team')!.classList.remove('team-tbd'));
  await expect(page.locator('.team-name')).toHaveText('TBD');
  await page.locator('.round-header').click(); await expect(page.locator('.round-header')).toHaveText('八强赛');
  await expect(page.locator('.round-header')).toHaveAttribute('title', '展开本轮');
  await page.locator('.round-header').click(); await expect(page.locator('.round-header')).toHaveText('四分之一决赛');
  expect(await page.evaluate(() => document.querySelector('.round-header') === (window as any).originalHeader)).toBe(true);
  await page.evaluate(() => {
    document.querySelector('#team')!.classList.add('team-tbd');
    document.querySelector('.team-name')!.firstChild!.nodeValue = 'Ancient';
    document.querySelector('#protection')!.className = 'newstext';
  });
  await expect(page.locator('#protection span')).toHaveText('Train'); await expect(page.locator('#protection img')).toHaveAttribute('title', 'Ancient');
  await expect(page.locator('.team-name')).toHaveText('Ancient');
  await page.evaluate(() => document.querySelector('#protection')!.className = '');
  await expect(page.locator('#protection span')).toHaveText('列车停放站'); await expect(page.locator('.score')).toHaveText('2');
});

test('动态机制：停止高频回写后冷却到期自动翻译最终内容', async ({ page }) => {
  await open(page);
  await expect(page.locator('.newsheader')).toHaveText('今日新闻');
  // 浏览器虚拟时钟推进调度/冷却，仍通过实际 MutationObserver 与构建产物。
  await page.clock.install();
  await page.evaluate(() => {
    let i = 0;
    const timer = window.setInterval(() => {
      document.querySelector('.newsheader')!.firstChild!.nodeValue = ++i === 30 ? "Yesterday's news" : "Today's news";
      if (i === 30) clearInterval(timer);
    }, 25);
  });
  await page.clock.runFor(800);
  await expect(page.locator('.newsheader')).toHaveText("Yesterday's news");
  await page.clock.runFor(10500);
  await expect(page.locator('.newsheader')).toHaveText('昨日新闻');
});

async function open(page: Page, path = '/', stored?: unknown, html: string | Record<string, string> = fixture) {
  await page.addInitScript((initial) => {
    const w = window as any;
    w.menus = [];
    w.GM_getValue = (key: string) => JSON.parse(sessionStorage.getItem(key) ?? 'null') ?? initial;
    w.GM_setValue = (key: string, value: unknown) => sessionStorage.setItem(key, JSON.stringify(value));
    w.GM_registerMenuCommand = (name: string, action: () => void) => w.menus.push({ name, action });
    w.changes = 0;
    new MutationObserver(records => { w.changes += records.length; }).observe(document, { subtree: true, characterData: true, attributes: true, childList: true });
  }, stored ?? { schemaVersion: 2, maps: 'en' });
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'hltv.test') return route.abort();
    if (url.pathname === '/userscript.js') return route.fulfill({ contentType: 'application/javascript', body: script });
    const body = typeof html === 'string' ? html : (html[url.pathname] ?? fixture);
    return route.fulfill({ contentType: 'text/html', body: body.replace('</body>', '<script src="/userscript.js"></script></body>') });
  });
  await page.goto(`http://hltv.test${path}`);
}

test('战队七标签页/FAQ/关注伪元素、原链接和赛事正文保持，可进入 HLTV 排名详情', async ({ page }) => {
  const teamPath = '/team/7020/spirit', detailPath = '/ranking/teams/2026/october/5/details/7020';
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await open(page, teamPath, { schemaVersion: 2, maps: 'zh-CN', modules: { ranking: false, player: false } }, { [teamPath]: teamProfile, [detailPath]: hltvRankingDetail });
  await expect(page.locator('.teamProfile .tab')).toHaveText(['资料', '阵容', '比赛', '赛事', '成就', '新闻', '数据']);
  await expect(page.locator('.profile-team-name')).toHaveText('Spirit'); await expect(page.locator('.regional-name-full')).toHaveText('V社排名');
  expect(await page.locator('.fanbutton').evaluate(e => getComputedStyle(e, '::after').content)).toContain('取消关注');
  await page.locator('.faq-question').first().click(); await expect(page.locator('.faq-container').first()).toHaveAttribute('open', '');
  await expect(page.locator('.faq-answer').first()).toContainText('Spirit 的主力阵容是'); await expect(page.locator('.faq-answer a[href="/player/16920/sh1ro"]')).toHaveText('sh1ro');
  // 保留实页属性，模拟站点标签切换，验证原节点/监听器可继续使用。
  await page.evaluate(() => document.querySelectorAll('.teamProfile .tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.teamProfile > .tab-content').forEach(e => e.classList.toggle('hidden', e.id !== tab.getAttribute('data-content-id')));
  })));
  const views = [['rosterBox', '首发'], ['matchesBox', 'Spirit 的比赛数据'], ['eventsBox', 'Spirit 进行中及即将参加的赛事与联赛'], ['achievementsBox', 'Spirit 的 Major 成就明细'], ['newsBox', '提及 Spirit 的新闻'], ['statsBox', 'Spirit 最近 5 场比赛']];
  for (const [id, expected] of views) { await page.locator(`.tab[data-content-id="${id}"]`).click(); await expect(page.locator('#' + id)).toBeVisible(); await expect(page.locator('#' + id)).toContainText(expected); }
  await expect(page.locator('#statsBox .moreButton[href*="/map/31/"]')).toHaveText('炽热沙城 的数据记录');
  await page.locator('.tab[data-content-id="infoBox"]').click(); await page.locator('.profile-team-stat a[href="' + detailPath + '"]').click();
  await expect(page).toHaveURL('http://hltv.test' + detailPath); await expect(page.locator('.ranking-details > .standard-headline').first()).toHaveText('Spirit 的 HLTV 排名计算明细');
  await expect(page.locator('.ranking-details table').first().locator('th')).toHaveText(['#', '赛事', '阵容', '相关度']);
  await expect(page.locator('.ranking-details tbody tr').first().locator('td').first()).toHaveText('第1名');
  await expect(page.locator('.ranking-details tbody tr').first().locator('td').first()).toHaveAttribute('data-sort', '1');
  await expect(page.locator('.ranking-details .statsCenterTextHighlighted').first()).toHaveText('85.2%'); expect(errors).toEqual([]);
});

test('从战队 V社排名入口进入详情，五分项切换与说明/表格保持，阵容查询参数不变', async ({ page }) => {
  const teamPath='/team/7020/spirit', detailPath='/valve-ranking/teams/details/2026/october/8';
  await open(page, teamPath, { schemaVersion: 2, maps: 'zh-CN' }, { [teamPath]:teamProfile, '/valve-ranking/teams':valveRanking, [detailPath]:valveRankingDetail });
  await page.locator('.profile-team-stat a[href="/valve-ranking/teams?teamId=7020"]').click(); await expect(page).toHaveURL('http://hltv.test/valve-ranking/teams?teamId=7020');
  await page.locator('.details.moreLink').first().click(); await expect(page).toHaveURL('http://hltv.test'+detailPath+'?lineup=16920%2C18317%2C19808%2C20423%2C21167&isFuture=false');
  await expect(page.locator('.valve-ranking-details > .standard-headline')).toHaveText('Spirit 的V社排名详情（2026年10月8日）');
  await expect(page.locator('.points')).toContainText('(2003 V社 积分)'); await expect(page.locator('td.date').first()).toHaveText('07/10/26');
  await page.evaluate(() => document.querySelectorAll('.detail-box').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.details-matches').forEach(e => e.classList.toggle('hidden',e.getAttribute('detail-matches-id') !== tab.getAttribute('detail-matches-show-id')));
  })));
  for (const [id, expected] of [['lan-wins','最近的线下胜场'],['opponent-network','对手网络计算说明'],['bounty-offered','提供悬赏计算说明'],['bounty-collected','收获悬赏计算说明'],['head-to-head','历史交锋计算说明']]) {
    await page.locator(`.detail-box[detail-matches-show-id="${id}"]`).click(); const section=page.locator(`.details-matches[detail-matches-id="${id}"]`); await expect(section).toBeVisible(); await expect(section).toContainText(expected);
  }
  await expect(page.locator('.details-matches[detail-matches-id="head-to-head"]')).toContainText('每次计算排名时');
  await expect(page.locator('.newstext')).toHaveText('Ranking details for Spirit Event Recency');
});

test('战队及两类排名详情菜单独立持久化，更新标题/实体保护和旧偏好保持', async ({ page }) => {
  const teamPath='/team/7020/spirit', hltvPath='/ranking/teams/2026/october/5/details/7020', valvePath='/valve-ranking/teams/details/2026/october/8';
  await open(page,teamPath,{schemaVersion:2,maps:'en',modules:{ranking:false,'valve-ranking':false}},{[teamPath]:teamProfile,[hltvPath]:hltvRankingDetail,[valvePath]:valveRankingDetail});
  await expect(page.locator('.teamProfile .tab').first()).toHaveText('资料');
  await page.evaluate(() => (window as any).menus.find((m:any)=>m.name.includes('战队资料')).action()); await expect(page.locator('.teamProfile .tab').first()).toHaveText('Info');
  expect(await page.locator('.fanbutton').evaluate(e=>getComputedStyle(e,'::after').content)).toContain('Remove fan');
  await page.goto('http://hltv.test'+hltvPath); await expect(page.locator('.ranking-details > .standard-headline').first()).toHaveText('Spirit 的 HLTV 排名计算明细');
  await page.evaluate(()=>(window as any).menus.find((m:any)=>m.name.includes('HLTV 排名详情')).action()); await expect(page.locator('.ranking-details > .standard-headline').first()).toHaveText('Detailed breakdown of ranking calculations for Spirit');
  await page.goto('http://hltv.test'+valvePath+'?lineup=16920%2C18317%2C19808%2C20423%2C21167&isFuture=false'); await expect(page.locator('.detail-head').first()).toHaveText('线下胜场');
  await page.evaluate(()=>{document.querySelector('.valve-ranking-details > .standard-headline')!.firstChild!.nodeValue='Ranking details for Mirage on 9 Oct 2026';document.querySelector('.teamLine .name')!.textContent='Dust2';});
  await expect(page.locator('.valve-ranking-details > .standard-headline')).toHaveText('Mirage 的V社排名详情（2026年10月9日）'); await expect(page.locator('.teamLine .name')).toHaveText('Dust2');
  await page.evaluate(()=>(window as any).menus.find((m:any)=>m.name.includes('V社排名详情')).action()); await expect(page.locator('.detail-head').first()).toHaveText('LAN wins'); await page.reload(); await expect(page.locator('.detail-head').first()).toHaveText('LAN wins');
  await expect(page.locator('.nav-link')).toHaveText('新闻'); expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('hltv2zh-cn.settings.v1')!).maps)).toBe('en');
});

test('V社全球/区域排名、官方日期跳转、积分/旧阵容和拆分节点保持', async ({ page }) => {
  const path = '/valve-ranking/teams/2026/october/8';
  const region = path + '/region/Europe'; const official = '/valve-ranking/teams/2026/october/5';
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await open(page, path, { schemaVersion: 2, modules: { ranking: false }, maps: 'zh-CN' }, {
    [path]: valveRanking,
    [region]: valveRanking.replace('Valve global ranking on October 8th, 2026', 'Valve Team ranking for Europe on October 8th, 2026'),
    [official]: valveRanking.replace('Valve global ranking on October 8th, 2026', 'Valve global ranking on October 5th, 2026'),
  });
  await expect(page.locator('.regional-ranking-header-text')).toHaveText('V社全球排名（2026年10月8日）测试版');
  await expect(page.locator('.regional-beta-icon')).toHaveText('测试版');
  await expect(page.locator('.points').first()).toHaveText('(2003 V社 积分)'); await expect(page.locator('.points').first().locator('span')).toHaveCount(1);
  await expect(page.locator('.details').first()).toHaveText('排名详情'); await expect(page.locator('.details').first()).toHaveAttribute('href', /lineup=16920%2C18317%2C19808%2C20423%2C21167&isFuture=false/);
  await expect(page.locator('.old-roster-symbol .tooltip-box')).toHaveText('这是旧阵容'); await expect(page.locator('.vrs-ranking-button')).toHaveText('官方');
  await expect(page.locator('.description-box')).toContainText('哥本哈根时区');
  await expect(page.locator('.teamLine > .name').filter({ hasText: /^Nuke$/ })).toHaveText('Nuke');
  await page.evaluate(() => document.querySelector('.ranked-team .ranking-header')!.addEventListener('click', () => document.querySelector('.ranked-team .lineup-con')!.classList.toggle('hidden')));
  await page.locator('.ranked-team .ranking-header').first().click(); await expect(page.locator('.lineup-con').first()).toBeHidden();
  await page.locator('.ranked-team .ranking-header').first().click(); await expect(page.locator('.lineup-con').first()).toBeVisible();
  await page.locator('.sub-region-button[href="' + region + '"]').click(); await expect(page).toHaveURL('http://hltv.test' + region);
  await expect(page.locator('.regional-ranking-header-text')).toHaveText('V社欧洲战队排名（2026年10月8日）测试版');
  await page.locator('.sidebar-single-line-item[href="' + official + '"]').click(); await expect(page).toHaveURL('http://hltv.test' + official);
  await expect(page.locator('.regional-ranking-header-text')).toHaveText('V社全球排名（2026年10月5日）测试版');
  expect(errors).toEqual([]);
});

test('VRS 邀请卡片整页汉化、名额数字/赛事实体保持与赛事入口跳转', async ({ page }) => {
  await open(page, '/valve-ranking/invites', { schemaVersion: 2, maps: 'zh-CN', modules: { ranking: false, 'valve-ranking': false } }, vrsInvites);
  await expect(page.locator('h1.regional-ranking-header')).toHaveText('即将进行的 VRS 邀请赛事');
  await expect(page.locator('.ranking-description')).toContainText('此前六个月的 VRS 排名');
  await expect(page.locator('.ranking-vrs-event-header').first()).toHaveText("BLAST Bounty '27 S1");
  await expect(page.locator('.ranking-vrs-event').first().locator('.ranking-grey')).toHaveText(['12 个邀请名额', 'VRS 邀请', '邀请日期']);
  await expect(page.locator('.ranking-vrs-event').last().locator('.ranking-grey')).toHaveText(['暂无邀请', '邀请日期']);
  await expect(page.locator('.ranking-vrs-event-date')).toHaveText(['11月2日', '11月2日', '11月2日', '11月2日']);
  await expect(page.locator('.rank-count > div:not(.count)')).toHaveText(['全球', '欧洲', '美洲', '亚洲', '全球', '欧洲']);
  await expect(page.locator('.rank-count > .count')).toHaveText(['12', '18', '9', '5', '14', '6']);
  await page.evaluate(() => {
    const card = document.querySelector('.ranking-vrs-event')!;
    card.querySelector('.ranking-grey')!.firstChild!.nodeValue = '1 Invite'; card.querySelector('.ranking-vrs-event-date')!.firstChild!.nodeValue = 'Jan 4th';
    const added = card.cloneNode(true) as Element; added.querySelector('.ranking-grey')!.textContent = '5 Invites'; added.querySelector('.ranking-vrs-event-header')!.textContent = 'Nuke'; added.querySelector('img')!.setAttribute('title', 'Dust2'); document.body.append(added);
  });
  await expect(page.locator('.ranking-vrs-event').first().locator('.ranking-grey').first()).toHaveText('1 个邀请名额');
  await expect(page.locator('.ranking-vrs-event-date').first()).toHaveText('1月4日');
  await expect(page.locator('.ranking-vrs-event').last().locator('.ranking-grey').first()).toHaveText('5 个邀请名额');
  await expect(page.locator('.ranking-vrs-event-header').last()).toHaveText('Nuke'); await expect(page.locator('.ranking-vrs-event').last().locator('img')).toHaveAttribute('title', 'Dust2');
  await expect(page.locator('input')).toHaveValue('Invite date'); await expect(page.locator('.newstext')).toHaveText('Valve ranking Global Invites Dust2');
  await page.locator('a.ranking-vrs-event').first().click(); await expect(page).toHaveURL('http://hltv.test/valve-ranking/teams/event/8295');
});

test('Valve/VRS 模块分别持久化，动态日期/积分恢复源文案且旧偏好保持', async ({ page }) => {
  await open(page, '/valve-ranking/teams/2026/october/8', { schemaVersion: 2, maps: 'en', modules: { ranking: false } }, {
    '/valve-ranking/teams/2026/october/8': valveRanking, '/valve-ranking/invites': vrsInvites,
  });
  await page.evaluate(() => {
    document.querySelector('.points')!.firstChild!.nodeValue = '(2010'; document.querySelector('.points')!.lastChild!.nodeValue = ' points)';
    document.querySelector('.regional-ranking-header-text')!.firstChild!.nodeValue = 'Valve global ranking on October 7th, 2026';
  });
  await expect(page.locator('.points').first()).toHaveText('(2010 V社 积分)');
  await expect(page.locator('.regional-ranking-header-text')).toHaveText('V社全球排名（2026年10月7日）测试版');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('V社排名')).action());
  await expect(page.locator('.points').first()).toHaveText('(2003 Valve points)'); await page.reload();
  await expect(page.locator('.regional-beta-icon')).toHaveText('Beta'); await expect(page.locator('.nav-link')).toHaveText('新闻');
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('hltv2zh-cn.settings.v1')!).maps)).toBe('en');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('V社排名')).action()); await expect(page.locator('.regional-beta-icon')).toHaveText('测试版');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('VRS 邀请')).action());
  await expect(page.locator('.regional-beta-icon')).toHaveText('测试版');
  await page.goto('http://hltv.test/valve-ranking/invites'); await expect(page.locator('h1.regional-ranking-header')).toHaveText('Upcoming Events with VRS invite');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('VRS 邀请')).action());
  await expect(page.locator('h1.regional-ranking-header')).toHaveText('即将进行的 VRS 邀请赛事');
});

test('世界排名拆分节点汉化、展开监听器保持、区域菜单跳转及历史日期筛选', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  const path = '/ranking/teams/2026/october/5';
  const regionalPath = path + '/country/Europe';
  await open(page, path, { schemaVersion: 2, maps: 'zh-CN' }, {
    [path]: ranking,
    [regionalPath]: ranking.replace('Counter-Strike World ranking on October 5th, 2026', 'Team ranking for Europe on October 5th, 2026'),
    '/ranking/teams/2026/september/28': ranking.replace('October 5th, 2026', 'September 28th, 2026'),
  });
  await expect(page.locator('.regional-ranking-header-text')).toHaveText('反恐精英世界排名（2026年10月5日）');
  await expect(page.locator('.points')).toHaveText(['(1000 HLTV 积分)', '(686 HLTV 积分)', '(0 HLTV 积分)']);
  await expect(page.locator('.moreLink').first()).toHaveText('HLTV 战队档案'); await expect(page.locator('.details')).toHaveText('排名详情');
  await expect(page.locator('.navItem').first()).toHaveText('世界 排名'); await expect(page.locator('.change.new')).toHaveText('新上榜');
  await expect(page.locator('.teamLine > .name')).toHaveText(['Spirit', 'Vitality', 'Mirage']);
  await expect(page.locator('.playersLine').last()).toHaveText('Ancient');
  await expect(page.locator('.description-box')).toContainText('3 人核心阵容');
  await expect(page.locator('.sidebar-single-line-item')).toHaveText(['2026', '十月', '九月', '5日']);
  // 模拟原站展开事件，验证译文未替换原节点/监听器。
  await page.evaluate(() => {
    document.querySelector('#ranking-open-region-selector')!.addEventListener('click', () => document.querySelector('#ranking-region-selector')!.classList.toggle('closed'));
    document.querySelector('.ranking-header')!.addEventListener('click', () => document.querySelector('.lineup-con')!.classList.toggle('hidden'));
  });
  await page.locator('.ranking-header').first().click(); await expect(page.locator('.lineup-con')).toBeHidden();
  await page.locator('.ranking-header').first().click(); await expect(page.locator('.lineup-con')).toBeVisible();
  await page.locator('#ranking-open-region-selector').click(); await expect(page.locator('#ranking-region-selector')).toBeVisible();
  await page.locator('.sub-region-name').first().click(); await expect(page).toHaveURL('http://hltv.test' + regionalPath);
  await expect(page.locator('.regional-ranking-header-text')).toHaveText('欧洲战队排名（2026年10月5日）');
  await page.locator('.sidebar-single-line-item').filter({ hasText: '九月' }).click();
  await expect(page).toHaveURL('http://hltv.test/ranking/teams/2026/september/28');
  await expect(page.locator('.regional-ranking-header-text')).toHaveText('反恐精英世界排名（2026年9月28日）');
  expect(errors).toEqual([]);
});

test('排名原 Text/新队伍动态更新、输入与正文保持，菜单开关刷新持久化', async ({ page }) => {
  await open(page, '/ranking/teams/2026/october/5', { schemaVersion: 2, maps: 'en', modules: { statistics: false } }, ranking);
  await page.evaluate(() => {
    document.querySelector('.points')!.firstChild!.nodeValue = '(999';
    document.querySelector('.points')!.lastChild!.nodeValue = ' points)';
    const card = document.querySelector('.ranked-team')!.cloneNode(true) as Element;
    card.querySelector('.points')!.textContent = '(33 HLTV points)'; document.body.append(card);
  });
  await expect(page.locator('.points').first()).toHaveText('(999 HLTV 积分)'); await expect(page.locator('.points').last()).toHaveText('(33 HLTV 积分)');
  await expect(page.locator('input')).toHaveValue('World ranking'); await expect(page.locator('.newstext')).toHaveText('World ranking HLTV Team profile NEW TEAM Mirage');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('队伍排名')).action());
  await expect(page.locator('.moreLink').first()).toHaveText('HLTV Team profile'); await expect(page.locator('.points').first()).toHaveText('(1000 HLTV points)');
  await expect(page.locator('.nav-link')).toHaveText('新闻'); await page.reload(); await expect(page.locator('.details')).toHaveText('Ranking details');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('队伍排名')).action());
  await expect(page.locator('.details')).toHaveText('排名详情');
});

test('赛事统计概览/地图页、双侧筛选和导航汉化，赛事上下文及实体数据保持', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await open(page, '/stats?event=8244', { schemaVersion: 1, maps: 'en' }, { '/stats': statisticsOverview, '/stats/maps': statisticsMaps });
  await expect(page.locator('.standard-headline')).toHaveText(['顶尖选手','顶尖战队','常用武器']);
  await expect(page.locator('.tab-title').first()).toHaveText('赛事筛选');
  await expect(page.locator('.top-x-box > .name').first()).toHaveText('ropz');
  await expect(page.locator('.top-x-box .rating').first()).toContainText('Rating 3.0');
  await expect(page.locator('.top-x-box .rating .bold').first()).toHaveText('1.40');
  await expect(page.locator('.stats-sub-map > a[href*="maps=de_ancient"]')).toHaveText('远古遗迹');
  await expect(page.locator('.search-input-con input')).toHaveAttribute('placeholder','加入选手对比…');
  await page.locator('.sidebar-single-line-item[href="/stats/maps?event=8244"]').click();
  await expect(page).toHaveURL('http://hltv.test/stats/maps?event=8244');
  await expect(page.locator('.standard-headline')).toHaveText(['地图','出场地图分布','各地图 T / CT 胜场分布']);
  await expect(page.locator('.maps-navigation-desc').first()).toHaveText('荒漠迷城');
  await expect(page.locator('.maps-navigation-link').first()).toHaveAttribute('href',/\/32\/Mirage\?.*event=8244/);
  await page.locator('.sidebar-single-line-item[href*="maps=de_tuscan"]').click();
  await expect(page).toHaveURL(/event=8244&maps=de_tuscan$/);
  await expect(page.locator('.sidebar-single-line-item[href*="maps=de_tuscan"]')).toHaveText('托斯卡纳');
  expect(errors).toEqual([]);
});

test('全站地图覆盖未适配路由、缩写、属性及动态节点，下拉原值与实体受保护', async ({ page }) => {
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body><a class="nav-link">Stats</a><span id="map">D2</span><span id="alias">CBL</span><img title="TRN" alt="ANB"><select><option>MRG</option><option value="de_tuscan">Tuscan</option></select><a href="/stats/players/123/mirage">Mirage</a><div class="playerNickname">Ancient</div><input value="Nuke"><div class="newstext">Cache</div><div id="dynamic"></div></body></html>';
  await open(page, '/unimplemented-page', { schemaVersion: 2, maps: 'zh-CN', modules: { common: false, statistics: false } }, html);
  await expect(page.locator('#map')).toHaveText('炽热沙城'); await expect(page.locator('#alias')).toHaveText('古堡激战');
  await expect(page.locator('img')).toHaveAttribute('title','列车停放站'); await expect(page.locator('img')).toHaveAttribute('alt','阿努比斯');
  await expect(page.locator('option')).toHaveText(['荒漠迷城','托斯卡纳']); await expect(page.locator('select')).toHaveValue('MRG');
  await page.locator('select').selectOption('de_tuscan'); await expect(page.locator('select')).toHaveValue('de_tuscan');
  await expect(page.locator('a[href^="/stats/players/"]')).toHaveText('Mirage'); await expect(page.locator('.playerNickname')).toHaveText('Ancient');
  await expect(page.locator('.newstext')).toHaveText('Cache'); await expect(page.locator('input')).toHaveValue('Nuke');
  await page.evaluate(() => {
    document.querySelector('#map')!.firstChild!.nodeValue = 'OVP'; document.querySelector('img')!.setAttribute('alt','VRT');
    const span = document.createElement('span'); span.textContent = 'Dust 2'; document.querySelector('#dynamic')!.append(span);
  });
  await expect(page.locator('#map')).toHaveText('死亡游乐园'); await expect(page.locator('img')).toHaveAttribute('alt','殒命大厦');
  await expect(page.locator('#dynamic span')).toHaveText('炽热沙城');
});

test('新默认中文地图，英文偏好和全站地图开关可以保存且互相独立', async ({ page }) => {
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body><a class="nav-link">News</a><div id="map">NUKE</div></body></html>';
  await open(page, '/other', {}, html); await expect(page.locator('#map')).toHaveText('核子危机');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.startsWith('地图名称：')).action());
  await expect(page.locator('#map')).toHaveText('NUKE'); await page.reload(); await expect(page.locator('#map')).toHaveText('NUKE');
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('hltv2zh-cn.settings.v1')!).schemaVersion)).toBe(2);
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.startsWith('地图名称：')).action());
  await expect(page.locator('#map')).toHaveText('核子危机');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('地图名称（全站）')).action());
  await expect(page.locator('#map')).toHaveText('NUKE'); await expect(page.locator('.nav-link')).toHaveText('新闻');
});

test('从完整对比入口进入双选手页面，双侧筛选/指标/走势/表格汉化且移除链接可用', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  const comparisonPath = '/stats/players/compare/19230/m0nesy/21167/donk';
  await open(page, '/matches/2398753/falcons-vs-spirit-esl-pro-league-season-24', { schemaVersion: 1, enabled: true, maps: 'en', modules: { 'player-stats': false } }, {
    '/matches/2398753/falcons-vs-spirit-esl-pro-league-season-24': matchLineups,
    [comparisonPath]: playerCompare, '/stats/players/compare/21167/donk': playerCompareSingle,
  });
  await page.locator('.compare-link').click(); await expect(page).toHaveURL(`http://hltv.test${comparisonPath}`);
  await expect(page.locator('option[value="allTime"]')).toHaveText(['全部时间', '全部时间', '全部时间', '全部时间']);
  await expect(page.locator('.selector-map-count')).toHaveText(['基于 960 张地图', '基于 960 张地图', '基于 813 张地图', '基于 813 张地图']);
  await expect(page.locator('.stats-bar-table .stat-name-col').filter({ hasText: /^存活率$/ })).toHaveCount(1);
  await expect(page.locator('.stat-row-name').filter({ hasText: /^\s*每回合助攻\s*$/ })).toHaveCount(2);
  await expect(page.locator('.stat-row-name').filter({ hasText: /^\s*Rating 2.0\s*$/ })).toHaveCount(4);
  await expect(page.locator('.diagram-info')).toHaveText('Rating 1.0 滑动窗口，每次递进 1 天');
  await expect(page.locator('.filter-text')).toHaveText(['全部时间，全部比赛，全部地图', '全部时间，全部比赛，全部地图']);
  await expect(page.locator('a[href="/player/19230/m0nesy"]')).toHaveText('m0NESY');
  await expect(page.locator('.remove-player-link')).toHaveText(['移除选手', '移除选手']);
  await page.evaluate(() => {
    for (const select of document.querySelectorAll<HTMLSelectElement>('.filter-selector')) select.addEventListener('change', () => {
      location.assign(select.selectedOptions[0].dataset.selectAction!);
    });
  });
  await page.locator('.filter-selector').filter({ visible: true }).first().selectOption('past3months');
  await expect(page).toHaveURL(/p1TimeFilter=past3months&p2TimeFilter=allTime/);
  await expect(page.locator('.selector-map-count').first()).toHaveText('基于 960 张地图');
  await page.locator('.remove-player-link').first().click();
  await expect(page).toHaveURL(/\/stats\/players\/compare\/21167\/donk\?p1TimeFilter=allTime&p1MatchFilter=allMatches&p1MapFilter=allMaps$/);
  await expect(page.locator('.player-and-filter > span')).toHaveText('添加选手');
  await expect(page.locator('a[href="/player/21167/donk"]')).toHaveText('donk');
  expect(errors).toEqual([]);
});

test('对比模块的地图偏好/动态摘要/旧配置与独立开关，输入及数据保持', async ({ page }) => {
  await open(page, '/stats/players/compare/19230/m0nesy/21167/donk', undefined, playerCompare);
  await expect(page.locator('.filter-text').first()).toHaveText('全部时间，全部比赛，全部地图');
  await page.evaluate(() => {
    const w = window as any; w.originalChart = document.querySelector('canvas');
    document.querySelector('.filter-text')!.firstChild!.nodeValue = 'Past 3 months, LAN, Mirage';
    document.querySelector('.selector-map-count')!.firstChild!.nodeValue = 'Based on 1,001 maps';
    const newLabel = document.createElement('span'); newLabel.className = 'stat-row-name'; newLabel.textContent = 'Surviving'; document.querySelector('.stats-player-compare')!.append(newLabel);
  });
  await expect(page.locator('.filter-text').first()).toHaveText('最近 3 个月，线下赛，Mirage');
  await expect(page.locator('.selector-map-count').first()).toHaveText('基于 1,001 张地图');
  await expect(page.locator('.stats-player-compare > .stat-row-name')).toHaveText('存活率');
  expect(await page.evaluate(() => (window as any).originalChart === document.querySelector('canvas'))).toBe(true);
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.startsWith('地图名称')).action());
  await expect(page.locator('option[value="de_mirage"]')).toHaveText(['荒漠迷城', '荒漠迷城', '荒漠迷城', '荒漠迷城']);
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('选手对比')).action());
  await expect(page.locator('.remove-player-link')).toHaveText(['remove player', 'remove player']);
  await expect(page.locator('option[value="de_mirage"]')).toHaveText(['荒漠迷城', '荒漠迷城', '荒漠迷城', '荒漠迷城']);
  await expect(page.locator('.nav-link')).toHaveText('数据');
});

test('空白对比页兼容旧设置，搜索提示汉化且保留用户输入和端点', async ({ page }) => {
  await open(page, '/stats/players/compare', { schemaVersion: 1, enabled: true, maps: 'en', modules: { common: false } }, playerComparePicker);
  await expect(page.locator('.player-and-filter > span')).toHaveText(['添加选手', '添加选手']);
  await page.locator('input').first().fill('Impact');
  await expect(page.locator('input').first()).toHaveValue('Impact');
  await expect(page.locator('input').first()).toHaveAttribute('placeholder', ' 搜索选手');
  await expect(page.locator('input').first()).toHaveAttribute('data-compare-player-search-url', '/profile/settings/searchfanplayer?query=');
});

test('筛选两名选手为 2026 后，Rating 3.0 新指标及 KPR/KAST 汉化，侧栏与动态更新保持', async ({ page }) => {
  const path = '/stats/players/compare/19230/m0nesy/21167/donk';
  await open(page, path, undefined, playerCompare);
  await expect(page.locator('.stat-row-name').filter({ hasText: /^\s*每回合击杀\s*$/ })).toHaveCount(4);
  await expect(page.locator('.stat-row-name').filter({ hasText: /^\s*不白给率\s*$/ })).toHaveCount(4);
  await page.unroute('**/*');
  await page.route('**/*', route => {
    const url = new URL(route.request().url()); if (url.hostname !== 'hltv.test') return route.abort();
    if (url.pathname === '/userscript.js') return route.fulfill({ contentType: 'application/javascript', body: script });
    return route.fulfill({ contentType: 'text/html', body: playerCompare2026.replace('</body>', '<script src="/userscript.js"></script></body>') });
  });
  await page.evaluate(() => {
    const select = [...document.querySelectorAll<HTMLSelectElement>('.filter-selector')].find(e => e.offsetParent !== null)!;
    select.addEventListener('change', () => {
      const url = new URL(select.selectedOptions[0].dataset.selectAction!, location.href);
      url.searchParams.set('p2TimeFilter', '2026'); location.assign(url.href);
    });
  });
  await page.locator('.filter-selector').filter({ visible: true }).first().selectOption('2026');
  await expect(page).toHaveURL(/p1TimeFilter=2026&p2TimeFilter=2026/);
  for (const label of ['Rating 3.0', '多杀评分', '回合影响力', '每回合击杀', '不白给率']) {
    await expect(page.locator('.stat-row-name').filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) })).toHaveCount(4);
  }
  await expect(page.locator('.stat-name-col').filter({ hasText: /^多杀评分$/ })).toHaveCount(1);
  await expect(page.locator('.stat-name-col').filter({ hasText: /^回合影响力$/ })).toHaveCount(1);
  await expect(page.locator('.filter-text')).toHaveText(['2026，全部比赛，全部地图', '2026，全部比赛，全部地图']);
  await expect(page.locator('.sidebar-single-line-item > span')).toHaveText(['概览', '选手', '战队', '比赛', '赛事', '地图', '排行榜', '选手对比']);
  await expect(page.locator('a[href="/player/19230/m0nesy"]')).toHaveText('m0NESY');
  await expect(page.locator('.stats-bar-table')).toContainText('+3.36%');
  await page.evaluate(() => {
    const label = [...document.querySelectorAll('.stat-row-name')].find(e => e.textContent!.trim() === '多杀评分')!;
    label.firstChild!.nodeValue = 'MULTI-KILL RATING';
  });
  await expect(page.locator('.stat-row-name').filter({ hasText: /^\s*多杀评分\s*$/ })).toHaveCount(4);
});

test('比赛阵容对比指标及双端按钮汉化，保留 Rating、缩写和跳转参数', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await open(page, '/matches/2398753/falcons-vs-spirit-esl-pro-league-season-24', undefined, matchLineups);
  await expect(page.locator('.lineups-compare-container th.table-header')).toHaveText('重点数据');
  await expect(page.locator('.table-subheader')).toHaveText('(最近 3 个月)');
  await expect(page.locator('.kpr .gtSmartphone-only')).toHaveText('每回合击杀');
  await expect(page.locator('.dpr .gtSmartphone-only')).toHaveText('每回合阵亡');
  await expect(page.locator('.multiKill .lineups-compare-middle-table-center-stat')).toHaveText('多杀评分');
  await expect(page.locator('.roundSwing .lineups-compare-middle-table-center-stat')).toHaveText('回合胜率影响');
  await expect(page.locator('.adr .gtSmartphone-only')).toHaveText('每回合平均伤害');
  await expect(page.locator('.rating .lineups-compare-middle-table-center-stat')).toHaveText('Rating');
  await expect(page.locator('.kast .lineups-compare-middle-table-center-stat')).toHaveText('KAST');
  await expect(page.locator('.kpr .smartphone-only')).toHaveText('KPR');
  await expect(page.locator('.dpr .smartphone-only')).toHaveText('DPR');
  await expect(page.locator('.adr .smartphone-only')).toHaveText('ADR');
  await expect(page.locator('.profile-link > .gtSmartphone-only')).toHaveText(['选手资料', '选手资料']);
  await expect(page.locator('.profile-link > .smartphone-only')).toHaveText(['资料', '资料']);
  await expect(page.locator('.stats-link')).toHaveText(['数据', '数据']);
  await expect(page.locator('.compare-link')).toHaveText('完整对比');
  await expect(page.locator('.lineups-compare-playername')).toHaveText(['m0NESY', 'donk']);
  await expect(page.locator('.kpr .left-stat')).toHaveText('0.85');
  await expect(page.locator('.roundSwing .left-stat')).toHaveText('+3.90%');
  await page.locator('.stats-link').first().click();
  await expect(page).toHaveURL('http://hltv.test/stats/players/19230/m0nesy?startDate=2026-07-08&endDate=2026-10-08');
  await page.goBack(); await expect(page.locator('.compare-link')).toHaveText('完整对比');
  await page.locator('.profile-link').first().click();
  await expect(page).toHaveURL('http://hltv.test/player/19230/m0nesy');
  await page.goBack(); await page.locator('.compare-link').click();
  await expect(page).toHaveURL('http://hltv.test/stats/players/compare/19230/m0nesy/21167/donk');
  expect(errors).toEqual([]);
});

test('阵容切换重新生成英文按钮后继续翻译，原点击事件/数据保留，停用后恢复', async ({ page }) => {
  await open(page, '/matches/1/another-match', undefined, matchLineups);
  await expect(page.locator('.kpr .gtSmartphone-only')).toHaveText('每回合击杀');
  await page.evaluate(() => {
    const w = window as any;
    w.profileText = document.querySelector('.profile-link > .gtSmartphone-only')!.firstChild;
    w.sourceData = document.querySelector('.lineups-compare-container')!.getAttribute('data-team1-players-data');
    document.querySelector('.player-compare.flagAlign[data-player-id="3741"]')!.addEventListener('click', () => {
      w.lineupClicks = (w.lineupClicks ?? 0) + 1;
      document.querySelector('.lineups-compare-playername')!.textContent = 'NiKo';
      document.querySelector('.lineups-compare-player-links')!.innerHTML = '<a class="lineups-compare-player-link profile-link" href="/player/3741/niko"><span class="gtSmartphone-only">Player profile</span><span class="smartphone-only">Profile</span></a><a class="lineups-compare-player-link stats-link" href="/stats/players/3741/niko?startDate=2026-07-08&endDate=2026-10-08">Stats</a>';
      document.querySelector('.kpr .left-stat')!.textContent = '0.71';
      document.querySelector('.kpr .gtSmartphone-only')!.firstChild!.nodeValue = 'KILLS PER ROUND';
    });
  });
  await page.locator('.player-compare.flagAlign[data-player-id="3741"]').click();
  await expect(page.locator('.lineups-compare-playername').first()).toHaveText('NiKo');
  await expect(page.locator('.kpr .gtSmartphone-only')).toHaveText('每回合击杀');
  await expect(page.locator('.profile-link > .gtSmartphone-only')).toHaveText(['选手资料', '选手资料']);
  await expect(page.locator('.stats-link')).toHaveText(['数据', '数据']);
  await expect(page.locator('.profile-link').first()).toHaveAttribute('href', '/player/3741/niko');
  await expect(page.locator('.kpr .left-stat')).toHaveText('0.71');
  expect(await page.evaluate(() => {
    const w = window as any;
    return [w.lineupClicks, w.sourceData === document.querySelector('.lineups-compare-container')!.getAttribute('data-team1-players-data')];
  })).toEqual([1, true]);
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('比赛详情')).action());
  await expect(page.locator('.profile-link > .gtSmartphone-only')).toHaveText(['Player profile', 'Player profile']);
  await expect(page.locator('.stats-link')).toHaveText(['Stats', 'Stats']);
  await expect(page.locator('.kpr .gtSmartphone-only')).toHaveText('Kills per round');
  await expect(page.locator('.rating .lineups-compare-middle-table-center-stat')).toHaveText('Rating');
  await expect(page.locator('.nav-link')).toHaveText('比赛');
});

test('赛事实页结构：完整栏目、动态对阵及控件监听器与原数据保持', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await open(page, '/events/8244/esl-pro-league-season-24', undefined, eventDetail);
  await expect(page.locator('th.eventdate')).toHaveText('日期');
  await expect(page.locator('.round-header').first()).toHaveText('四分之一决赛');
  await expect(page.locator('.round-header').first()).toHaveAttribute('title', '收起本轮');
  await expect(page.locator('.eventdate span span')).toHaveText('2026年10月11日');
  await expect(page.locator('.eventMeta td > [data-time-format]').first()).toHaveText('2026年10月3日');
  await expect(page.locator('.club-share').first()).toHaveText('+ 俱乐部分成：$170,000');
  await expect(page.locator('.highlight-group-count').first()).toHaveText('8 段集锦');
  await expect(page.locator('.format-data').last()).toHaveText('单败淘汰 BO3\n- 总决赛 BO5\n季军赛 BO3');
  await expect(page.locator('.vrs-event-stakes-more')).toHaveText('另有 1 个邀请名额受影响');
  await expect(page.locator('.team-tbd .team-name').first()).toHaveText('待定');
  await page.evaluate(() => {
    const w = window as any;
    w.originalRound = document.querySelector('.round-header');
    w.originalDate = document.querySelector('.eventdate [data-unix]');
    w.originalRound.addEventListener('click', () => { w.roundClicks = (w.roundClicks ?? 0) + 1; });
    const lineups = document.querySelector('.show-lineups')!;
    lineups.addEventListener('click', () => { lineups.firstChild!.nodeValue = 'Hide lineups'; });
    document.querySelector('.highlight-group-count')!.firstChild!.nodeValue = '9 highlights';
    document.querySelector('.time-day-of-week')!.firstChild!.nodeValue = 'Saturday';
    const placeholder = document.querySelector('.team-tbd .team-name')!;
    placeholder.parentElement!.classList.remove('team-tbd'); placeholder.firstChild!.nodeValue = 'Playoffs';
    const round = document.createElement('div'); round.className = 'round-header'; round.textContent = 'Semi-finals';
    document.querySelector('.rounds')!.append(round);
  });
  await expect(page.locator('.highlight-group-count').first()).toHaveText('9 段集锦');
  await expect(page.locator('.time-day-of-week').first()).toHaveText('周六');
  await expect(page.locator('.rounds .team-name').filter({ hasText: /^Playoffs$/ })).toHaveCount(1);
  await expect(page.locator('.rounds .round-header').filter({ hasText: /^半决赛$/ })).toHaveCount(2);
  await page.locator('.round-header').first().click();
  await page.locator('.show-lineups').click(); await expect(page.locator('.show-lineups')).toHaveText('隐藏阵容');
  expect(await page.evaluate(() => {
    const w = window as any;
    return [w.originalRound === document.querySelector('.round-header'), w.originalDate === document.querySelector('.eventdate [data-unix]'), w.roundClicks];
  })).toEqual([true, true, 1]);
  await expect(page.locator('.eventdate [data-unix]').first()).toHaveAttribute('data-unix', '1791021600000');
  await expect(page.locator('.event-hub-title')).toHaveText('ESL Pro League Season 24');
  await expect(page.locator('.highlight-description')).toContainText('magixx - ACE');
  await expect(page.locator('input')).toHaveValue('News');
  await page.locator('a[href*="#PrizeDistribution"]').click();
  await expect(page).toHaveURL(/#PrizeDistribution$/);
  expect(errors).toEqual([]);
});

test('赛事详情模块兼容旧配置及不同赛事，地图菜单和独立开关持久化', async ({ page }) => {
  await open(page, '/events/1/another-event', { schemaVersion: 1, enabled: true, maps: 'en', modules: { events: false } }, eventDetail);
  await expect(page.locator('.show-lineups')).toHaveText('显示阵容');
  await expect(page.locator('.map-pool-map-name').first()).toHaveText('死城之谜');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.startsWith('地图名称')).action());
  await expect(page.locator('.map-pool-map-name').first()).toHaveText('Cache');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('赛事详情')).action());
  await expect(page.locator('.show-lineups')).toHaveText('Show lineups');
  await expect(page.locator('.map-pool-map-name').first()).toHaveText('Cache');
  await expect(page.locator('.team-tbd .team-name').first()).toHaveText('TBD');
  await expect(page.locator('.nav-link')).toHaveText('赛事');
});

test('选手资料整页、隐藏标签页及完整统计跳转，原节点与实体保持', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await open(page, '/player/21167/donk', undefined, {
    '/player/21167/donk': playerProfile, '/stats/players/21167/donk': playerStats,
  });
  await expect(page.locator('.primaryRole')).toHaveText('选手');
  await expect(page.locator('.stats-window')).toHaveText('(最近 3 个月 • 56 张地图)');
  await expect(page.locator('.majorWinner')).toHaveText('1 次 Major 冠军');
  await expect(page.locator('.skins-inventory-header h2')).toHaveText('donk 的库存');
  await expect(page.locator('.lightbox-title')).toHaveText('AWP 收藏(2)');
  await expect(page.locator('.skins-partner-top')).toHaveText('HLTV 认证合作伙伴');
  await expect(page.locator('#news h3')).toHaveText('2026 年的新闻');
  await expect(page.locator('#faceit .empty-state')).toHaveText('donk 当前 FPL 赛季暂无数据，请稍后查看。');
  expect(await page.locator('.fanbutton').evaluate(e => getComputedStyle(e, '::after').content)).toBe('"关注选手"');
  await page.evaluate(() => {
    for (const tab of document.querySelectorAll<HTMLElement>('.tab[data-content]')) tab.addEventListener('click', () => {
      for (const content of document.querySelectorAll('.tab-content')) content.classList.toggle('hidden', content.id !== tab.dataset.content);
    });
  });
  await page.locator('.tab[data-content="teams"]').click();
  await expect(page.locator('#teams')).toBeVisible();
  await expect(page.locator('#teams h2').first()).toHaveText('donk 的战队数据');
  await expect(page.locator('.time-period-cell')).toHaveText('2023年7月 – 至今');
  await expect(page.locator('.playerNickname')).toHaveText('donk');
  await expect(page.locator('.team-name')).toHaveText('Spirit');
  await expect(page.locator('.subTab-newsArticle')).toHaveText('donk statistics');
  await page.locator('.tab[data-content="info"]').click();
  await page.locator('a.moreButton[href="/stats/players/21167/donk"]').click();
  await expect(page).toHaveURL('http://hltv.test/stats/players/21167/donk');
  await expect(page.locator('.player-summary-stat-box-left-btn')).toHaveText('选手资料');
  await expect(page.locator('.role-stats-section-title').first()).toContainText('火力');
  await expect(page.locator('.stats-row > span').first()).toHaveText('总击杀');
  await page.locator('.player-summary-stat-box-left-btn').click();
  await expect(page).toHaveURL('http://hltv.test/player/21167/donk');
  await expect(page.locator('.primaryRole')).toHaveText('选手');
  expect(errors).toEqual([]);
});

test('统计整页展开指标、筛选值、动态计数与模块菜单兼容旧设置', async ({ page }) => {
  const oldSettings = { schemaVersion: 1, enabled: true, maps: 'en', modules: { common: true, home: false } };
  await open(page, '/stats/players/21167/donk', oldSettings, playerStats);
  await expect(page.locator('.stats-sub-navigation-title > span').first()).toHaveText('赛事筛选');
  await expect(page.locator('.player-summary-stat-box-right-map-count')).toHaveText('813 张地图');
  await expect(page.locator('.stats-side-selector').first()).toHaveText('全部 阵营');
  await expect(page.locator('.role-stats-title').first()).toHaveText('有击杀回合占比');
  await expect(page.locator('.rating-description')).toHaveText('对阵排名前 5 的对手');
  await expect(page.locator('.diagram-info')).toContainText('每次递进 1 天');
  await expect(page.locator('.pagination-data')).toHaveText('第 1–100 条，共 2935 条');
  await page.locator('.showPlayerAverage input').check();
  await expect(page.locator('.showPlayerAverage input')).toBeChecked();
  await page.locator('.search-input-con input').fill('donk');
  await expect(page.locator('.search-input-con input')).toHaveValue('donk');
  await page.evaluate(() => {
    document.querySelector('select')!.addEventListener('change', event => {
      const select = event.target as HTMLSelectElement;
      (window as any).chosenFilter = [select.value, select.selectedOptions[0].dataset.link];
    });
    document.querySelector('.role-stats-section-title')!.addEventListener('click', () => {
      for (const row of document.querySelectorAll('.role-stats-section .role-stats-row')) row.classList.toggle('hidden');
    });
    document.querySelector('.player-summary-stat-box-right-map-count')!.firstChild!.nodeValue = '814 maps';
    const row = document.createElement('div'); row.className = 'role-stats-title'; row.textContent = 'Flash assists per round'; document.querySelector('.stats-section')!.append(row);
  });
  await page.locator('select').first().selectOption('Majors');
  expect(await page.evaluate(() => (window as any).chosenFilter)).toEqual(['Majors', '/stats/players/21167/donk?matchType=Majors']);
  await page.locator('.role-stats-section-title').first().click();
  await expect(page.locator('.role-stats-row[title]')).toBeVisible();
  await expect(page.locator('.role-stats-row[title]')).toHaveAttribute('title', '选手至少完成一次击杀的回合占比。');
  await expect(page.locator('.player-summary-stat-box-right-map-count')).toHaveText('814 张地图');
  await expect(page.locator('.role-stats-title').last()).toHaveText('每回合闪光助攻');
  await expect(page.locator('.stats-row > span').nth(1)).toHaveText('16707');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('选手数据')).action());
  await expect(page.locator('.player-summary-stat-box-right-map-count')).toHaveText('813 maps');
  await expect(page.locator('.nav-link')).toHaveText('数据');
});

test('不同选手统计子页仍汉化，停用资料模块移除关注按钮译文', async ({ page }) => {
  await open(page, '/stats/players/clutches/7998/all/s1mple', undefined, playerStats.replaceAll('donk', 's1mple'));
  await expect(page.locator('.player-summary-stat-box-left-nickname')).toHaveText('s1mple');
  await expect(page.getByText('s1mple 的全部残局记录', { exact: true })).toHaveCount(1);
  await expect(page.locator('.statsPlayerMatchesDate')).toHaveText('日期');
  await page.unroute('**/*');
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'hltv.test') return route.abort();
    if (url.pathname === '/userscript.js') return route.fulfill({ contentType: 'application/javascript', body: script });
    return route.fulfill({ contentType: 'text/html', body: playerProfile.replace('</body>', '<script src="/userscript.js"></script></body>') });
  });
  await page.goto('http://hltv.test/player/21167/donk');
  await expect(page.locator('.primaryRole')).toHaveText('选手');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.includes('选手资料')).action());
  await expect(page.locator('.primaryRole')).toHaveText('Player');
  expect(await page.locator('.fanbutton').evaluate(e => getComputedStyle(e, '::after').content)).toBe('"Become fan"');
  await expect(page.locator('#hltv-zh-player-style')).toHaveCount(0);
});

test('实页侧栏结构回归：赞助、排名、更新时间、赛事与周最佳', async ({ page }) => {
  await open(page, '/', undefined, sidebar);
  await expect(page.locator('.presented-by-row h1').first()).toHaveText('颁奖给');
  await expect(page.locator('.presented-by-row h1').last()).toHaveText('排名');
  const ranking = page.locator('a.block[href="/ranking/teams"]');
  await expect(ranking).toContainText('完整排名');
  await expect(ranking.locator('span').first()).toHaveText('最后更新：');
  await expect(ranking.locator('span').last()).toHaveText('10月5日');
  await expect(ranking.locator('br')).toHaveCount(1);
  await expect(page.locator('h1 > a[href^="https://www.faceit.com"]')).toHaveText('FPL 排名');
  await expect(page.locator('.playerOfTheWeekCategory')).toHaveText('本周最佳选手');
  await expect(page.locator('.playerOfTheWeekPlayerName')).toHaveText('Spinx');
  await expect(page.locator('.playerOfTheWeekTitle')).toHaveText('Rating 3.0');
  await expect(page.locator('a[href="/calendar"]')).toHaveText('赛事日历');
  await expect(page.locator('.eventcountdown')).toHaveText('6 天后');
  await expect(page.locator('.streams-viewers')).toHaveText('3,541 人观看');
  await page.evaluate(() => {
    document.querySelectorAll('a.block[href="/ranking/teams"] span')[1].firstChild!.nodeValue = '12th of Oct';
    document.querySelector('.eventcountdown')!.firstChild!.nodeValue = '1 day';
    document.querySelector('.streams-viewers')!.firstChild!.nodeValue = '4,200 viewers';
  });
  await expect(ranking.locator('span').last()).toHaveText('10月12日');
  await expect(page.locator('.eventcountdown')).toHaveText('1 天后');
  await expect(page.locator('.streams-viewers')).toHaveText('4,200 人观看');
  await expect(page.locator('.presented-by-img img')).toHaveCount(2);
  await expect(page.locator('.newstext')).toContainText('Complete ranking');
});

test('单文件产物翻译首页，保留图标、内容和计数', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await open(page);
  await expect(page.locator('.newsheader')).toHaveText('今日新闻');
  await expect(page.locator('.newsrecent')).toHaveText('2小时前');
  await expect(page.locator('.newstext')).toHaveText('Players sign for Online');
  await expect(page.locator('.newstc > div').nth(1)).toHaveText('70 条评论');
  await expect(page.locator('.streams-filter')).toHaveText('全部(45)');
  await expect(page.locator('.nav-link svg')).toHaveCount(1);
  await expect(page.locator('.dropdown-link')).toHaveText('所有赛事');
  await expect(page.locator('[contenteditable]')).toHaveText('News');
  await expect(page.locator('textarea')).toHaveValue('News');
  await expect(page.locator('.nav-popup-elm > span[title]')).toHaveAttribute('title', '选择网站主题。');
  expect(errors).toEqual([]);
});

test('原 Text、动态节点与属性更新，空闲后停止写入', async ({ page }) => {
  await open(page);
  await expect(page.locator('.newsheader')).toHaveText('今日新闻');
  await page.evaluate(() => {
    document.querySelector('.newsheader')!.firstChild!.nodeValue = "Yesterday's news";
    const h = document.createElement('h2'); h.className = 'newsheader'; h.textContent = 'Previous news';
    document.querySelector('#dynamic')!.append(h);
    document.querySelector('input[name="username"]')!.setAttribute('placeholder', 'Search team...');
  });
  await expect(page.locator('.newsheader').first()).toHaveText('昨日新闻');
  await expect(page.locator('#dynamic h2')).toHaveText('此前新闻');
  await expect(page.locator('input[name="username"]')).toHaveAttribute('placeholder', '搜索战队…');
  // 有界观察窗口用于证明没有 observer 自激循环。
  const stable = await page.evaluate(async () => {
    await new Promise(r => setTimeout(r, 150));
    const before = (window as any).changes;
    await new Promise(r => setTimeout(r, 250));
    return before === (window as any).changes;
  });
  expect(stable).toBe(true);
});

test('比赛筛选仍可操作，原属性和输入内容保留', async ({ page }) => {
  await open(page, '/matches');
  await expect(page.locator('.matches-filter-name-text')).toHaveText('欧洲 (28)');
  await page.locator('#Europe').check();
  await expect(page.locator('#Europe')).toBeChecked();
  await expect(page.locator('#Europe')).toHaveAttribute('data-filter-value', 'Europe');
  await page.locator('input[name="username"]').fill('Players');
  await expect(page.locator('input[name="username"]')).toHaveValue('Players');
  await expect(page.locator('.calendar-month')).toHaveText('十月');
  await expect(page.locator('.matches-sort-by-toggle')).toHaveText('时间');
  await expect(page.locator('.match-meta')).toHaveText('进行中');
});

test('详情 BP、日期与倒计时翻译，比分不变', async ({ page }) => {
  await open(page, '/matches/123/sample');
  await expect(page.locator('.date')).toHaveText('2026年10月8日');
  await expect(page.locator('.veto-box .padding > div').nth(1)).toHaveText('2. Just Players 选择 Ancient');
  await expect(page.locator('.preformatted-text')).toContainText('英语直播：');
  await expect(page.locator('.time')).toHaveText('17:00');
  await page.evaluate(() => {
    document.querySelector('.countdown')!.firstChild!.nodeValue = '1d : 6h : 20m : 43s';
    document.querySelector('[data-livescore-current-map-score]')!.firstChild!.nodeValue = '3';
  });
  await expect(page.locator('.countdown')).toHaveText('1天 : 6时 : 20分 : 43秒');
  await expect(page.locator('[data-livescore-current-map-score]')).toHaveText('3');
  await expect(page.locator('.date')).toHaveAttribute('data-unix', '1791450000000');
});

test('赛果分页及日期正确，分页链接仍可导航', async ({ page }) => {
  await open(page, '/results');
  await expect(page.locator('#results .standard-headline').last()).toHaveText('2026年10月8日的赛果');
  await expect(page.locator('.pagination-data')).toHaveText('第 1–100 条，共 123863 条');
  await page.locator('.pagination-next').click();
  await expect(page).toHaveURL('http://hltv.test/results?offset=100');
  await expect(page.locator('.pagination-data')).toContainText('123863');
});

test('GM 菜单模拟：保存地图偏好、刷新生效及停用', async ({ page }) => {
  await open(page, '/matches/123/sample');
  await expect(page.locator('.mapname')).toHaveText('Ancient');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.startsWith('地图名称')).action());
  await expect(page.locator('.mapname')).toHaveText('远古遗迹');
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name.startsWith('停用汉化')).action());
  await expect(page.locator('.date')).toHaveText('8th of October 2026');
  await expect(page.locator('.mapname')).toHaveText('Ancient');
});

test('验证页和 betting 路由不执行翻译', async ({ page }) => {
  await open(page, '/betting/analytics');
  await expect(page.locator('.nav-link').first()).toHaveText('News');
  await page.unroute('**/*');
  await page.route('**/*', route => route.fulfill({ contentType: 'text/html', body: '<title>Just a moment...</title><body><h2 class="newsheader">Today\'s news</h2></body>' }));
  await page.goto('http://hltv.test/');
  await page.addScriptTag({ content: script });
  await expect(page.locator('.newsheader')).toHaveText("Today's news");
});

test('赛事日期嵌套节点保持原位，移动已翻译节点后按新区域恢复', async ({ page }) => {
  await open(page, '/events');
  await expect(page.locator('.event-status-headline')).toHaveText('进行中的赛事');
  await expect(page.locator('#events [data-time-format]').first()).toHaveText('10月3日');
  await expect(page.locator('#events [data-time-format]').last()).toHaveText('10月11日');
  await expect(page.locator('#events [data-unix]')).toHaveCount(2);
  await page.evaluate(() => {
    const original = document.querySelector('.nav-link')!.firstChild!;
    document.querySelector('.thread-message-text')!.replaceChildren(original);
  });
  await expect(page.locator('.thread-message-text')).toHaveText('News');
});

test('批量插入处理完整且无重复副作用', async ({ page }) => {
  await open(page);
  await expect(page.locator('.newsheader')).toHaveText('今日新闻');
  await page.evaluate(() => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 1500; i++) {
      const row = document.createElement('div'); row.className = 'newsrecent'; row.textContent = `${i} hours ago`; fragment.append(row);
    }
    document.querySelector('#dynamic')!.append(fragment);
  });
  await expect(page.locator('#dynamic > div').last()).toHaveText('1499小时前');
  await expect(page.locator('#dynamic > div')).toHaveCount(1500);
});
