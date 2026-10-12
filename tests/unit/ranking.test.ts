import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults, parseSettings } from '../../src/features/settings';

afterEach(() => { document.body.innerHTML = ''; });
function setup(path = '/ranking/teams/2026/october/5') {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync('tests/fixtures/ranking.html', 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage(path), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  return { engine, run };
}
const text = (selector: string) => document.querySelector(selector)!.textContent!.trim();

it('识别世界、历史、区域及详情路由，旧配置默认开启新模块且原偏好保持', () => {
  for (const path of ['/ranking/teams', '/ranking/teams/', '/ranking/teams/2026/october/5', '/ranking/teams/2026/october/5/country/Europe']) expect(detectPage(path)).toBe('ranking');
  expect(detectPage('/ranking/teams/2026/october/5/details/7020')).toBe('ranking-detail');
  for (const path of ['/ranking', '/ranking/teams-other']) expect(detectPage(path)).toBe('other');
  const settings = parseSettings({ schemaVersion: 2, enabled: false, maps: 'en', modules: { common: false, statistics: false } });
  expect(settings.modules.ranking).toBe(true); expect(settings.modules.common).toBe(false); expect(settings.modules.statistics).toBe(false);
  expect(settings.enabled).toBe(false); expect(settings.maps).toBe('en');
});

it('翻译实页拆分文本、日期/积分/按钮/筛选/说明并保持原节点、URL和实体', () => {
  const { run, engine } = setup();
  const nodes = [...document.querySelectorAll('*')]; const links = nodes.filter(e => e.hasAttribute('href')).map(e => e.getAttribute('href'));
  const points = document.querySelector('.points')!; const pointNodes = [...points.childNodes];
  run();
  expect(text('.navItem')).toBe('世界 排名'); expect(text('#ranking-open-region-selector')).toBe('区域 排名');
  expect(text('.navItem[href="/valve-ranking/teams"]')).toBe('V社 排名'); expect(text('.navItem[href="/valve-ranking/invites"]')).toBe('VRS 邀请');
  expect(text('.regional-ranking-header-text')).toBe('反恐精英世界排名（2026年10月5日）');
  expect(points.textContent).toBe('(1000 HLTV 积分)'); expect([...points.childNodes]).toEqual(pointNodes);
  expect([...document.querySelectorAll('.points')].map(e => e.textContent)).toEqual(['(1000 HLTV 积分)', '(686 HLTV 积分)', '(0 HLTV 积分)']);
  expect(text('.moreLink')).toBe('HLTV 战队档案'); expect(text('.details')).toBe('排名详情'); expect(text('.change.new')).toBe('新上榜');
  expect([...document.querySelectorAll('.change')].map(e => e.textContent)).toEqual(['-', '+1', '新上榜']);
  expect(text('.sidebar-headline')).toBe('筛选'); expect([...document.querySelectorAll('.filter-column-header')].map(e => e.textContent)).toEqual(['年份', '月份', '日期']);
  expect([...document.querySelectorAll('.sidebar-single-line-item')].map(e => e.textContent)).toEqual(['2026', '十月', '九月', '5日']);
  expect(text('.sub-region-name')).toBe('欧洲'); expect(text('.ranking-country a')).toBe('中国');
  expect(text('.description-box > h2')).toBe('排名如何计算？'); expect(text('.description-box')).toContain('3 人核心阵容');
  expect([...document.querySelectorAll('.teamLine > .name')].map(e => e.textContent)).toEqual(['Spirit', 'Vitality', 'Mirage']);
  expect(text('.playersLine')).toBe('sh1rodonk'); expect(text('.nick')).toBe('donk');
  expect(document.querySelector('.ranking-country img')!.getAttribute('alt')).toBe('China');
  expect(text('.newstext')).toBe('World ranking HLTV Team profile NEW TEAM Mirage'); expect(text('.thread-message-text')).toBe('Ranking details');
  expect(document.querySelector<HTMLInputElement>('input')!.value).toBe('World ranking'); expect(text('body > a[href^="/team/"]')).toBe('World ranking');
  expect([...document.querySelectorAll('*')]).toEqual(nodes); expect(nodes.filter(e => e.hasAttribute('href')).map(e => e.getAttribute('href'))).toEqual(links);
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes); expect(engine.metrics.errors).toBe(0);
});

it('原 Text 更新、新卡片及区域日期标题使用最新原文，未知文案保持', () => {
  const { run } = setup(); run();
  document.querySelector('.points')!.lastChild!.nodeValue = ' points)';
  document.querySelector('.points')!.firstChild!.nodeValue = '(999';
  document.querySelector('.regional-ranking-header-text')!.firstChild!.nodeValue = 'Team ranking for Europe on September 28th, 2026';
  const card = document.querySelector('.ranked-team')!.cloneNode(true) as Element;
  card.querySelector('.points')!.textContent = '(12 HLTV points)'; card.querySelector('.name')!.textContent = 'Nuke'; document.body.append(card); run();
  expect(text('.points')).toBe('(999 HLTV 积分)'); expect(text('.regional-ranking-header-text')).toBe('欧洲战队排名（2026年9月28日）');
  expect(card.querySelector('.points')!.textContent).toBe('(12 HLTV 积分)'); expect(card.querySelector('.name')!.textContent).toBe('Nuke');
  const header = document.querySelector('.regional-ranking-header-text')!; header.textContent = 'Team ranking for New Region on October 5th, 2026'; run(); expect(header.textContent).toBe('New Region战队排名（2026年10月5日）');
  header.textContent = 'Counter-Strike World ranking on Unknown date'; run(); expect(header.textContent).toBe('Counter-Strike World ranking on Unknown date');
  document.querySelector('.points')!.textContent = 'points lost recently'; run(); expect(text('.points')).toBe('points lost recently');
});

it('队名/昵称与地图同名仍保持英文，停用恢复最新原文，移入正文后恢复', () => {
  const { run, engine } = setup(); run();
  expect([...document.querySelectorAll('.name')].map(e => e.textContent)).toContain('Mirage');
  expect([...document.querySelectorAll('.playersLine')].map(e => e.textContent)).toContain('Ancient');
  const header = document.querySelector('.regional-ranking-header-text')!.firstChild!; header.nodeValue = 'Counter-Strike World ranking on October 12th, 2026'; run();
  const config = defaults(); config.modules.ranking = false; engine.configure(config); run();
  expect(header.nodeValue).toBe('Counter-Strike World ranking on October 12th, 2026'); expect(text('.moreLink')).toBe('HLTV Team profile'); expect(text('.points')).toBe('(1000 HLTV points)');
  expect(text('.nav-link')).toBe('新闻'); config.modules.ranking = true; engine.configure(config); run();
  document.querySelector('.newstext')!.append(header); run(); expect(header.nodeValue).toBe('Counter-Strike World ranking on October 12th, 2026');
});

it('其他页面不加载排名规则，完整导航词条与空白保留', () => {
  const { run } = setup('/other'); run(); expect(text('.points')).toBe('(1000 HLTV points)'); expect(text('.moreLink')).toBe('HLTV Team profile');
  const ranking = setup(); document.querySelector('.navItem')!.textContent = ' World ranking '; ranking.run(); expect(document.querySelector('.navItem')!.textContent).toBe(' 世界排名 ');
});
