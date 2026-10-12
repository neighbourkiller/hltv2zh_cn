import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { voteText } from '../../src/adapters/match-detail';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults } from '../../src/features/settings';

afterEach(() => { document.body.innerHTML = ''; });
function setup(fixture: string, route: string) {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync(`tests/fixtures/${fixture}.html`, 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage(route), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  return { engine, run };
}
const text = (selector: string) => document.querySelector(selector)!.textContent!.trim();

it('比赛双列解释与经济控件生效，统计数值、版本、实体和 Text 节点保持', () => {
  const { engine, run } = setup('match-detail', '/matches/2398751/example');
  const node = document.querySelector('.roundSwing')!.firstChild;
  const values = [...document.querySelectorAll('.player-row td')].map(e => e.textContent);
  const links = [...document.querySelectorAll('a')].map(e => e.getAttribute('href'));
  const count = document.querySelectorAll('*').length; run();
  expect(text('.roundSwing')).toBe('影响力'); expect(document.querySelector('.roundSwing')!.firstChild).toBe(node);
  expect(text('.toggle-eco-adjusted')).toBe('经济调整'); expect(text('.rating')).toBe('Rating3.0');
  expect(text('#all')).toBe('全部地图');
  document.querySelector('#all')!.className = 'all dynamic-map-name-short';
  document.querySelector('#all')!.firstChild!.nodeValue = 'All'; run(); expect(text('#all')).toBe('全部');
  expect(document.querySelector('.adr.eco-adjusted-data')!.getAttribute('title')).toBe('每回合平均伤害，已根据经济进行调整。');
  expect(document.querySelector('.rating')!.getAttribute('title')).toContain('1.00');
  expect(text('.headline > .subtext')).toBe('以 83.9% 的得票率获胜'); expect(text('.header-info')).toBe('(2 张地图)');
  expect(text('.motm-countdown')).toBe('投票倒计时： 1h : 20m : 03s'); expect(text('.no-streams')).toBe('暂无直播');
  expect([...document.querySelectorAll('.player-row td')].map(e => e.textContent)).toEqual(values);
  expect([...document.querySelectorAll('a')].map(e => e.getAttribute('href'))).toEqual(links);
  expect(document.querySelectorAll('*')).toHaveLength(count); expect(text('.thread-message-text .headline')).toBe('Top player in match');
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes); expect(engine.metrics.errors).toBe(0);
});

it('投票回写动态百分比与未知句式不混用，关模块恢复当前英文结果', () => {
  const { engine, run } = setup('match-detail', '/matches/2398751/example'); run();
  const result = document.querySelector('.headline > .subtext')!;
  result.firstChild!.nodeValue = 'won with 9.05% of the votes'; run(); expect(text('.headline > .subtext')).toBe('以 9.05% 的得票率获胜');
  result.firstChild!.nodeValue = 'won with 12 votes in version 4.0'; run(); expect(result.textContent).toBe('won with 12 votes in version 4.0');
  expect(voteText('won with 100% of the votes')).toBe('以 100% 的得票率获胜');
  const config = defaults(); config.modules['match-detail'] = false; engine.configure(config); run();
  expect(text('.roundSwing')).toBe('Swing'); expect(document.querySelector('.adr.eco-adjusted-data')!.getAttribute('title')).toContain('Adjusted');
  expect(text('.nav-link')).toBe('新闻');
});

it('推荐空状态只改 Text，原图标/tooltip 容器及实体保持；跨路由不生效', () => {
  const { run, engine } = setup('match-recommendation', '/matches');
  const icon = document.querySelector('i'); const box = document.querySelector('#why'); run();
  expect(text('#for-you-empty-div > b')).toBe('暂时没有为你推荐的比赛。');
  expect(text('.starred-matches-description-tooltip')).toContain('你关注的选手或战队');
  expect(document.querySelector('i')).toBe(icon); expect(document.querySelector('#why')).toBe(box);
  expect(text('.match-teamname')).toBe('Ancient'); expect(text('.thread-message-text')).toBe('No matches for you yet.');
  const config = defaults(); config.modules.matches = false; engine.configure(config); run();
  expect(text('#for-you-empty-div > b')).toBe('No matches for you yet.');
  setup('match-recommendation', '/team/1/ancient').run(); expect(text('.starred-matches-description-tooltip')).toMatch(/^For you/);
});

it('统计专项表格解释保留分母、版本、分页数、筛选值和实体', () => {
  const { run, engine } = setup('statistics-specialty', '/stats/teams/pistols');
  const values = [...document.querySelectorAll('tbody td')].map(e => e.textContent); run();
  expect(text('th')).toBe('战队'); expect(text('th:nth-child(4)')).toBe('Rating 3.0');
  expect(document.querySelector('th:nth-child(7)')!.getAttribute('title')).toBe('赢得手枪局后，第 2 回合的胜率。');
  expect(text('.pagination-data')).toBe('第 1–50 条，共 1,204 条');
  expect(text('.toggle-fast-multi-kills-only > a')).toBe('仅显示快速多杀');
  expect(text('#fast')).toContain('相邻击杀间隔少于 5 秒'); expect(text('#fast > b')).toBe('快速多杀：');
  expect(text('#unknown')).toBe('Unknown tooltip version 4.0 with 17 rounds.');
  expect([...document.querySelectorAll('tbody td')].map(e => e.textContent)).toEqual(values);
  expect((document.querySelector('#time option:nth-child(2)') as HTMLOptionElement).value).toBe('3');
  expect((document.querySelector('input') as HTMLInputElement).value).toBe('Ancient');
  expect(text('.thread-message-text th')).toBe('Pistol win %'); expect(engine.metrics.errors).toBe(0);
});

it('选手快速多杀嵌套入口和动态 tooltip 生效，停用恢复', () => {
  const { run, engine } = setup('statistics-specialty', '/stats/players/multikills/21167/two/donk'); run();
  expect(text('.toggle-fast-multi-kills-only > a')).toBe('仅显示快速多杀');
  const bold = document.querySelector('#fast > b');
  document.querySelector('#fast')!.lastChild!.nodeValue = 'Unknown tooltip version 4.0 with 17 rounds.'; run();
  expect(document.querySelector('#fast > b')).toBe(bold); expect(text('#fast')).toContain('Unknown tooltip version');
  const config = defaults(); config.modules['player-stats'] = false; engine.configure(config); run();
  expect(text('#fast > b')).toBe('Fast multi-kill:'); expect(text('.toggle-fast-multi-kills-only > a')).toBe('Fast multi-kills only');
});

it('统计 body 挂载的 tooltip 保留 b/span 层级，陌生数字句式和正文反例保持', () => {
  const { run, engine } = setup('statistics-specialty', '/stats/players/multikills/21167/two/donk');
  const tooltip = document.querySelector('#fast')!; const bold = tooltip.firstChild;
  document.body.append(tooltip); run();
  expect(text('#fast > b')).toBe('快速多杀：'); expect(text('#fast')).toContain('相邻击杀间隔少于 5 秒');
  document.querySelector('.thread-message-text')!.append(tooltip); run();
  expect(text('#fast > b')).toBe('Fast multi-kill:'); expect(text('#fast')).toContain('less than 5 seconds');
  document.body.append(tooltip); engine.configure(defaults()); run();
  expect(tooltip.firstChild).toBe(bold); expect(text('#fast > b')).toBe('快速多杀：');
});
