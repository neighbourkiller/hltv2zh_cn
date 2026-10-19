import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { matchStatsText } from '../../src/adapters/match-stats';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults } from '../../src/features/settings';

afterEach(() => { document.body.innerHTML = ''; });
function setup() {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync('tests/fixtures/match-stats.html', 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage('/stats/matches/132086/betboom-vs-legacy'), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  return { engine, run };
}
const text = (selector: string) => document.querySelector(selector)!.textContent!.trim();

it('详细数据实页槽位覆盖，实体、数值、链接、节点及完整恢复保持', () => {
  const { engine, run } = setup();
  const original = document.body.innerHTML;
  const elements = [...document.querySelectorAll('*')];
  const hrefs = [...document.querySelectorAll('a')].map(e => e.getAttribute('href'));
  const numbers = text('tbody');
  run();
  expect(text('.match-info-box .small-text > .bold')).toBe('地图');
  expect([...document.querySelector('.match-info-box')!.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()).toBe('全部');
  expect([...document.querySelectorAll('.match-info-row > .bold')].map(e => e.textContent)).toEqual(['战队 Rating 3.0', '首杀', '残局获胜']);
  expect([...document.querySelectorAll('.top-players .most-x-title')].map(e => e.textContent)).toEqual(['最多击杀', '最高伤害', '最多助攻', '最多 AWP 击杀', '最多首杀', '最佳 Rating 3.0']);
  expect(text('.stats-match > .standard-headline')).toBe('表现 - Rating 3.0');
  expect(text('.dynamic-map-name-full')).toBe('BO3');
  expect(text('.toggle-eco-adjusted')).toBe('经济调整');
  expect(text('.st-roundSwing')).toBe('影响力');
  expect(document.querySelector('.st-clutches')!.getAttribute('title')).toBe('残局获胜次数');
  expect(document.querySelector('.st-assists span')!.getAttribute('title')).toContain('逼离原位');
  expect(text('.context-button')).toBe('查看赛事');
  expect(text('.new-feature')).toBe('测试版');
  expect(document.querySelector('.sidebar-single-line-item')!.getAttribute('title')).toContain('前 5 名');
  expect(text('.menu-header')).toBe('Thunderpick World Championship 2026');
  expect(text('.team-right a')).toBe('Legacy');
  expect(text('.st-rating')).toBe('Rating3.0');
  expect(text('.thread-message-text')).toBe('Most kills');
  expect(text('tbody')).toBe(numbers);
  expect([...document.querySelectorAll('a')].map(e => e.getAttribute('href'))).toEqual(hrefs);
  expect([...document.querySelectorAll('*')]).toEqual(elements);
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes);
  engine.configure({ ...defaults(), enabled: false }); run();
  expect(document.body.innerHTML).toBe(original);
});

it('统计模块独立控制、网站回写及新插入卡片重新翻译，未知句式保持', () => {
  const { engine, run } = setup(); run();
  const title = document.querySelector('.most-x-title')!;
  title.firstChild!.nodeValue = 'Most assists';
  const card = document.querySelector('.most-x-box')!.cloneNode(true) as Element;
  card.querySelector('.most-x-title')!.textContent = 'Most damage';
  document.querySelector('.top-players')!.append(card);
  document.querySelector('.stats-match > .standard-headline')!.firstChild!.nodeValue = 'Performance - rating unknown';
  run();
  expect(title.textContent).toBe('最多助攻');
  expect(card.querySelector('.most-x-title')!.textContent).toBe('最高伤害');
  expect(text('.stats-match > .standard-headline')).toBe('Performance - rating unknown');
  engine.configure({ ...defaults(), modules: { ...defaults().modules, statistics: false } }); run();
  expect(title.textContent).toBe('Most assists');
  expect(text('.toggle-eco-adjusted')).toBe('Eco-adjusted');
  expect(text('.nav-link')).toBe('数据');
});

it('Rating 版本与 BO 赛制按完整标题匹配', () => {
  expect(matchStatsText('Team rating 2.1')).toBe('战队 Rating 2.1');
  expect(matchStatsText('Best rating 3.0')).toBe('最佳 Rating 3.0');
  expect(matchStatsText('Performance - rating 3.0')).toBe('表现 - Rating 3.0');
  expect(matchStatsText('Best of 5')).toBe('BO5');
  for (const unknown of ['Rating 3.0', 'Best of 7', 'Team rating 3.0 extra', 'Team rating unknown']) expect(matchStatsText(unknown)).toBeUndefined();
});
