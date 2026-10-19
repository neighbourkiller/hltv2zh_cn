import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults, parseSettings } from '../../src/features/settings';

afterEach(() => { document.body.innerHTML = ''; });
function setup(path = '/valve-ranking/teams/2026/october/8', file = 'valve-ranking') {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync(`tests/fixtures/${file}.html`, 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage(path), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  return { engine, run };
}
const text = (selector: string) => document.querySelector(selector)!.textContent!.trim();

it('全球/区域列表与邀请列表独立识别，升级保留偏好并开启新模块', () => {
  for (const path of ['/valve-ranking/teams', '/valve-ranking/teams/', '/valve-ranking/teams/2026/october/8', '/valve-ranking/teams/2026/october/8/region/Europe']) expect(detectPage(path)).toBe('valve-ranking');
  for (const path of ['/valve-ranking/invites', '/valve-ranking/invites/']) expect(detectPage(path)).toBe('vrs-invites');
  for (const path of ['/valve-ranking/invites-other']) expect(detectPage(path)).toBe('other');
  expect(detectPage('/valve-ranking/teams/details/2026/october/8')).toBe('valve-ranking-detail');
  const settings = parseSettings({ schemaVersion: 2, maps: 'en', enabled: false, modules: { ranking: false, common: false } });
  expect(settings.modules['valve-ranking']).toBe(true); expect(settings.modules['vrs-invites']).toBe(true);
  expect(settings.modules.ranking).toBe(false); expect(settings.modules.common).toBe(false); expect(settings.maps).toBe('en'); expect(settings.enabled).toBe(false);
});

it('Valve 实页覆盖拆分标题/积分、区域、官方日期和旧阵容，节点及数据保持', () => {
  const { run, engine } = setup();
  const nodes = [...document.querySelectorAll('*')]; const links = [...document.querySelectorAll('a')].map(e => e.getAttribute('href'));
  const header = document.querySelector('.regional-ranking-header-text')!; const headerNodes = [...header.childNodes];
  const pointNodes = [...document.querySelector('.points')!.childNodes];
  const portraits = [...document.querySelectorAll('img')].map(e => [e.getAttribute('alt'), e.getAttribute('title')]);
  run();
  expect(header.firstChild!.nodeValue).toBe('V社全球排名（2026年10月8日）'); expect(text('.regional-beta-icon')).toBe('测试版'); expect([...header.childNodes]).toEqual(headerNodes);
  expect(text('.nav > .navItem')).toBe('世界 排名'); expect(text('.points')).toBe('(2003 V社 积分)'); expect([...document.querySelector('.points')!.childNodes]).toEqual(pointNodes);
  expect([...document.querySelectorAll('.sub-region-valve-name')].map(e => e.textContent)).toEqual(['欧洲', '美洲', '亚洲']);
  const regions = [...document.querySelectorAll('.teamLine > .region')].map(e => e.textContent); expect(regions).toContain('欧洲'); expect(regions).toContain('美洲'); expect(regions).toContain('亚洲');
  expect(text('.old-roster-symbol .tooltip-box')).toBe('这是旧阵容'); expect(text('.vrs-ranking-button')).toBe('官方');
  expect(text('.sidebar-single-line-item[href="/valve-ranking/teams/2026/october/5"]')).toBe('5日 官方');
  expect(text('.moreLink')).toBe('HLTV 战队档案'); expect(text('.details')).toBe('排名详情');
  expect(text('.description-box')).toContain('哥本哈根时区'); expect(text('.ranking-description')).toContain('已确定获得的奖金');
  expect([...document.querySelectorAll('.filter-column-header')].map(e => e.textContent)).toEqual(['年份', '月份', '日期']);
  expect([...document.querySelectorAll('.teamLine > .name')].map(e => e.textContent)).toContain('Nuke'); expect([...document.querySelectorAll('.playersLine')].map(e => e.textContent)).toContain('Mirage');
  expect(text('.newstext')).toBe('Valve ranking Global Invites Dust2'); expect(document.querySelector<HTMLInputElement>('input')!.value).toBe('Invite date');
  expect([...document.querySelectorAll('*')]).toEqual(nodes); expect([...document.querySelectorAll('a')].map(e => e.getAttribute('href'))).toEqual(links);
  expect([...document.querySelectorAll('img')].map(e => [e.getAttribute('alt'), e.getAttribute('title')])).toEqual(portraits);
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes); expect(engine.metrics.errors).toBe(0);
});

it('Valve 原节点更新和区域标题继续翻译，停用恢复最新原文且不影响公共导航', () => {
  const { run, engine } = setup(); run();
  const header = document.querySelector('.regional-ranking-header-text')!.firstChild!;
  header.nodeValue = 'Valve Team ranking for Americas on October 7th, 2026';
  document.querySelector('.points')!.firstChild!.nodeValue = '(2100'; document.querySelector('.points')!.lastChild!.nodeValue = ' points)';
  document.querySelector('.region')!.firstChild!.nodeValue = 'AM'; run();
  expect(header.nodeValue).toBe('V社美洲战队排名（2026年10月7日）'); expect(text('.points')).toBe('(2100 V社 积分)'); expect(text('.region')).toBe('美洲');
  const card = document.querySelector('.ranked-team')!.cloneNode(true) as Element; card.querySelector('.points')!.textContent = '(0 Valve points)'; document.body.append(card); run(); expect(card.querySelector('.points')!.textContent).toBe('(0 V社 积分)');
  const config = defaults(); config.modules.ranking = false; engine.configure(config); run(); expect(text('.moreLink')).toBe('HLTV 战队档案');
  config.modules['valve-ranking'] = false; engine.configure(config); run();
  expect(header.nodeValue).toBe('Valve Team ranking for Americas on October 7th, 2026'); expect(text('.points')).toBe('(2100 Valve points)'); expect(text('.region')).toBe('AM'); expect(text('.nav-link')).toBe('新闻');
  expect(text('.regional-beta-icon')).toBe('Beta'); expect(text('.vrs-ranking-button')).toBe('Official');
});

it('VRS 列表翻译各类名额、日期与说明，赛事名/照片/链接/计数保持', () => {
  const { run, engine } = setup('/valve-ranking/invites', 'vrs-invites');
  const nodes = [...document.querySelectorAll('*')]; const links = [...document.querySelectorAll('a')].map(e => e.getAttribute('href'));
  const titles = [...document.querySelectorAll('.ranking-vrs-event-header')].map(e => e.textContent);
  const counts = [...document.querySelectorAll('.rank-count > .count')].map(e => e.textContent);
  run();
  expect(text('h1.regional-ranking-header')).toBe('即将进行的 VRS 邀请赛事'); expect(text('.ranking-description')).toContain('此前六个月的 VRS 排名');
  const grey = [...document.querySelectorAll('.ranking-grey')].map(e => e.textContent); expect(grey).toContain('12 个邀请名额'); expect(grey).toContain('暂无邀请'); expect(grey).toContain('邀请日期'); expect(grey).toContain('VRS 邀请');
  expect([...document.querySelectorAll('.rank-count > div:not(.count)')].map(e => e.textContent)).toEqual(['全球', '欧洲', '美洲', '亚洲', '全球', '欧洲']);
  expect([...document.querySelectorAll('.ranking-vrs-event-date')].map(e => e.textContent)).toEqual(['11月2日', '11月2日', '11月2日', '11月2日']);
  expect([...document.querySelectorAll('.ranking-vrs-event-header')].map(e => e.textContent)).toEqual(titles); expect([...document.querySelectorAll('.rank-count > .count')].map(e => e.textContent)).toEqual(counts);
  expect([...document.querySelectorAll('*')]).toEqual(nodes); expect([...document.querySelectorAll('a')].map(e => e.getAttribute('href'))).toEqual(links);
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes); expect(engine.metrics.errors).toBe(0);
});

it('VRS 动态名额/日期、同名赛事保护和独立开关，移入正文恢复原文', () => {
  const { run, engine } = setup('/valve-ranking/invites', 'vrs-invites'); run();
  const card = document.querySelector('.ranking-vrs-event')!;
  card.querySelector('.ranking-grey')!.firstChild!.nodeValue = '1 Invite'; card.querySelector('.ranking-vrs-event-date')!.firstChild!.nodeValue = 'Jan 4th';
  card.querySelector('.ranking-vrs-event-header')!.textContent = 'Nuke'; card.querySelector('img')!.setAttribute('alt', 'Dust2'); run();
  expect(card.querySelector('.ranking-grey')!.textContent).toBe('1 个邀请名额'); expect(card.querySelector('.ranking-vrs-event-date')!.textContent).toBe('1月4日');
  expect(card.querySelector('.ranking-vrs-event-header')!.textContent).toBe('Nuke'); expect(card.querySelector('img')!.getAttribute('alt')).toBe('Dust2');
  const config = defaults(); config.modules['valve-ranking'] = false; config.modules.ranking = false; engine.configure(config); run(); expect(text('h1.regional-ranking-header')).toBe('即将进行的 VRS 邀请赛事');
  config.modules['vrs-invites'] = false; engine.configure(config); run(); expect(text('h1.regional-ranking-header')).toBe('Upcoming Events with VRS invite'); expect(card.querySelector('.ranking-grey')!.textContent).toBe('1 Invite');
  expect(card.querySelector('.ranking-vrs-event-date')!.textContent).toBe('Jan 4th'); expect(text('.nav-link')).toBe('新闻');
  config.modules['vrs-invites'] = true; engine.configure(config); run(); const date = card.querySelector('.ranking-vrs-event-date')!.firstChild!; document.querySelector('.newstext')!.append(date); run(); expect(date.nodeValue).toBe('Jan 4th');
});

it('未知日期/统计句式不翻译，列表规则不会接管赛事模拟器', () => {
  const { run } = setup(); document.querySelector('.regional-ranking-header-text')!.firstChild!.nodeValue = 'Valve global ranking on Unknown date'; document.querySelector('.points')!.textContent = 'points earned this month'; run();
  expect(document.querySelector('.regional-ranking-header-text')!.firstChild!.nodeValue).toBe('Valve global ranking on Unknown date'); expect(text('.points')).toBe('points earned this month');
  const invites = setup('/valve-ranking/teams/event/8295', 'vrs-invites'); invites.run(); expect(text('h1.regional-ranking-header')).toBe('Upcoming Events with VRS invite');
});
