import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { fantasySeason, fantasySummary } from '../../src/adapters/fantasy';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults, parseSettings } from '../../src/features/settings';

afterEach(() => { document.body.innerHTML = ''; });
function setup(fixture: string, route: string) {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync(`tests/fixtures/${fixture}.html`, 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage(route), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  return { engine, run };
}
const text = (s: string) => document.querySelector(s)!.textContent!.trim();

it('阶段 D 仅识别已采样路由，旧配置补新模块且保留停用与英文偏好', () => {
  for (const route of ['/transfers','/transfers/']) expect(detectPage(route)).toBe('transfers');
  expect(detectPage('/fantasy')).toBe('fantasy');
  for (const route of ['/fantasy/662/gameredirect','/fantasy/user/1/overview','/fantasy/rules','/transfers/123']) expect(detectPage(route)).toBe('other');
  expect(detectPage('/valve-ranking/teams/event/8295')).toBe('vrs-forecast');
  const migrated = parseSettings({ schemaVersion: 2, maps: 'en', enabled: false, modules: { team: false, maps: false } });
  expect(migrated.modules.transfers).toBe(true); expect(migrated.modules.fantasy).toBe(true);
  expect(migrated.modules.team).toBe(false); expect(migrated.enabled).toBe(false); expect(migrated.maps).toBe('en');
  expect(parseSettings({ ...migrated, modules: { transfers: false, fantasy: false } }).modules).toMatchObject({ transfers: false, fantasy: false });
});

it('转会完整独立 Text 翻译；链接、b、徽标、箭头和原监听器保持', () => {
  const { run, engine } = setup('transfers', '/transfers');
  const nodes = [...document.querySelectorAll('.transfer-row *')];
  const identities = nodes.filter(e => e.matches('a b, img:not([alt="No team"])')).map(e => e.outerHTML);
  const links = [...document.querySelectorAll('a')].map(e=>e.getAttribute('href'));
  let clicked = 0; const link = document.querySelector('.transfer-movement a')!; link.addEventListener('click', e=>{e.preventDefault();clicked++;});
  const sourceNodes = [...document.querySelectorAll('.transfer-movement')].map(e=>[...e.childNodes]); run();
  const movements = [...document.querySelectorAll('.transfer-movement')].map(e=>e.textContent);
  expect(movements.some(t=>t!.includes('从') && t!.includes('转会至'))).toBe(true);
  for (const word of ['加入','离开','转为替补','回归主力阵容','担任教练','（替补）']) expect(movements.some(t=>t!.includes(word))).toBe(true);
  expect(identities).toEqual(nodes.filter(e=>e.matches('a b, img:not([alt="无战队"])')).map(e=>e.outerHTML));
  expect([...document.querySelectorAll('a')].map(e=>e.getAttribute('href'))).toEqual(links);
  expect([...document.querySelectorAll('.transfer-row *')]).toEqual(nodes);
  expect([...document.querySelectorAll('.transfer-movement')].map(e=>[...e.childNodes])).toEqual(sourceNodes);
  link.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); expect(clicked).toBe(1);
  expect(text('.transfer-team-status:not(:empty)')).toBe('替补'); expect(text('.transfer-team-no-team')).toBe('无战队');
  expect(document.querySelector('.no-team img')!.getAttribute('alt')).toBe('无战队');
  expect(text('.transfer-date')).toBe('2026年10月9日'); expect(engine.metrics.errors).toBe(0);
});

it('转会日期/排名选项的隐式 value、data-link、国家输入和年份保持', () => {
  const { run, engine } = setup('transfers','/transfers');
  const options = [...document.querySelectorAll('option')]; const values = options.map(e=>[e.value,e.getAttribute('data-link')]);
  const country = document.querySelector('input.transfer-filter-country') as HTMLInputElement; country.value = 'Ancient';
  run(); expect(options.map(e=>[e.value,e.getAttribute('data-link')])).toEqual(values);
  expect(text('.transfer-filter-time option')).toBe('全部时间'); expect(options.find(e=>e.textContent==='2026')?.value).toBe('2026');
  expect(country.value).toBe('Ancient'); expect(country.getAttribute('placeholder')).toBe('搜索国家…');
  const config = defaults(); config.modules.transfers = false; engine.configure(config); run();
  expect(options.map(e=>[e.value,e.getAttribute('data-link')])).toEqual(values);
  expect(text('.transfer-movement')).toContain('is benched on'); expect(text('.transfer-team-status:not(:empty)')).toBe('BENCH');
  expect(text('.nav-link')).toBe('新闻'); expect(country.value).toBe('Ancient');
});

it('转会状态槽位放行不扩大实体/正文范围，迁出后恢复且未知句式原样保留', () => {
  const { run } = setup('transfers','/transfers');
  const status = document.querySelector('.transfer-team-status:not(:empty)')!; const node = status.firstChild!;
  run(); expect(node.nodeValue).toBe('替补');
  const forum = document.createElement('div'); forum.className='thread-message-text'; document.body.append(forum);
  forum.append(document.querySelector('.transfer')!); run(); expect(node.nodeValue).toBe('BENCH');
  document.body.append(document.querySelector('.transfer')!); run(); expect(node.nodeValue).toBe('替补');
  document.querySelector('.transfer-movement')!.append('joins academy next week'); run();
  expect(text('.transfer-movement')).toContain('joins academy next week');
  const entity = document.querySelector('.transfer-movement a b')!; entity.firstChild!.nodeValue='Ancient'; run(); expect(entity.textContent).toBe('Ancient');
  setup('transfers','/team/1/ancient').run(); expect(text('.transfer-movement')).toContain('is benched on');
});

it('Fantasy 标题/月份/数量和跨节点说明生效，实体、积分、奖金、链接与嵌套节点保持', () => {
  const { run, engine } = setup('fantasy','/fantasy');
  const values = [...document.querySelectorAll('td')].filter(e=>!e.querySelector('.number-of-games')).map(e=>e.textContent);
  const entities = [...document.querySelectorAll('.game-name,.winners,td.player')].map(e=>e.textContent);
  const links = [...document.querySelectorAll('a')].map(e=>e.getAttribute('href'));
  const bold = document.querySelector('.about-season .bold'); const count = document.querySelectorAll('*').length; run();
  expect(text('.season-headline')).toBe('Fantasy 2026年秋季赛季'); expect(text('.summary')).toContain('4 场已结束');
  expect(text('.live-btn')).toBe('进行中'); expect(text('.leaderboard-table th.player')).toBe('用户');
  expect(text('.leaderboard-count')).toContain('共 28767 条'); expect(text('.points-system')).toContain('中的队伍计入积分');
  expect(text('.about-season')).toContain('十二月中旬'); expect(document.querySelector('.about-season .bold')).toBe(bold);
  expect([...document.querySelectorAll('td')].filter(e=>!e.querySelector('.number-of-games')).map(e=>e.textContent)).toEqual(values);
  expect([...document.querySelectorAll('.game-name,.winners,td.player')].map(e=>e.textContent)).toEqual(entities);
  expect([...document.querySelectorAll('a')].map(e=>e.getAttribute('href'))).toEqual(links);
  expect(document.querySelectorAll('*')).toHaveLength(count); expect(engine.metrics.errors).toBe(0);
  expect(fantasySummary('17 games (1 upcoming, 2 live, 14 finished)')).toContain('14 场已结束');
  expect(fantasySummary('17 games (14 cancelled)')).toBeUndefined(); expect(fantasySeason('Ancient season 2026')).toBeUndefined();
  const pagination = document.createElement('div'); pagination.className='leaderboard-pagination';
  const link = document.createElement('a'); link.href='/fantasy?offset=0'; link.textContent='To Top'; pagination.append(link);
  document.querySelector('.leaderboard-count')!.append(pagination); run();
  expect(link.textContent).toBe('回到榜首'); expect(link.getAttribute('href')).toBe('/fantasy?offset=0');
});

it('Fantasy 新排行榜/空状态动态插入后翻译，停用恢复当前文本和输入', () => {
  const { run, engine } = setup('fantasy','/fantasy'); run();
  const container = document.querySelector('.tabs-content')!;
  container.innerHTML = new DOMParser().parseFromString(readFileSync('tests/fixtures/fantasy-custom.html','utf8'),'text/html').querySelector('.season-tab-content')!.outerHTML;
  run(); expect(text('.empty-custom-leaderboard')).toContain('整个 Fantasy 赛季的积分');
  expect(text('.custom-leaderboard-button')).toBe('创建自定义排行榜');
  const input = document.querySelector('.admin-input-search input'); // 自定义 tab 替换后不保留旧搜索表单。
  expect(input).toBeNull();
  const config = defaults(); config.modules.fantasy=false; engine.configure(config); run();
  expect(text('.custom-leaderboard-button')).toBe('Create a custom leaderboard'); expect(text('.season-headline')).toBe('Fantasy Fall season 2026');
  setup('fantasy-celebrity','/fantasy').run(); expect(text('.leaderboard-headline')).toContain('名人排行榜');
  const guest = setup('fantasy-custom-guest','/fantasy'); guest.run();
  expect(text('.custom-leaderboard-signin-message')).toBe('登录后即可使用自定义排行榜');
  const disabled = defaults(); disabled.modules.fantasy=false; guest.engine.configure(disabled); guest.run();
  expect(text('.custom-leaderboard-signin-message')).toBe('You have to sign in to use the custom leaderboards');
});

it('转会真实空列表保持空，Fantasy 非总览路由不接入模块', () => {
  setup('transfers-empty','/transfers').run(); expect(document.querySelector('.transfers-grouped')!.childNodes).toHaveLength(0);
  setup('fantasy','/fantasy/662/gameredirect').run(); expect(text('.season-headline')).toBe('Fantasy Fall season 2026');
  expect(text('.game-name')).toBe('Ancient');
});
