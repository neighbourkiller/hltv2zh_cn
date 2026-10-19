import { afterEach, expect, it } from 'vitest';
import { TranslationEngine } from '../../src/core/engine';
import { walk } from '../../src/core/walker';
import { detectPage } from '../../src/core/types';
import { rules } from '../../src/adapters';
import { defaults } from '../../src/features/settings';
afterEach(() => { document.body.innerHTML = ''; });
function setup(path: string, html: string) {
  document.body.innerHTML = html;
  const engine = new TranslationEngine(rules, detectPage(path), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); }; run();
  return { engine, run };
}
it('武器代码保留，地图仍翻译；属性和相邻数值保持', () => {
  setup('/stats/players/weapon/1/test', '<div class="stats-rows standard-box"><span title="inferno">inferno</span><span>42</span></div><span class="map">Inferno</span>');
  expect(document.querySelector('.stats-rows')!.textContent).toBe('inferno42');
  expect(document.querySelector('[title]')!.getAttribute('title')).toBe('inferno');
  expect(document.querySelector('.map')!.textContent).toBe('炼狱小镇');
});
it.each([
  ['/coach/1/example', '<h2>Team stats for B1ad3 as coach</h2>', 'B1ad3 的执教队伍数据'],
  ['/forums', '<table><tbody><tr class="tableheader"><td>Replies</td></tr></tbody></table>', '回复'],
  ['/valve-ranking/teams/event/1', '<div class="vrs-forecast-container"><span class="vrs-forecast-header">before</span></div>', '赛前'],
  ['/stats/matches/1/example', '<div class="fusioncharts-container"><svg><text>Semi-eco</text></svg></div>', '半经济局'],
])('固定槽位翻译且停用恢复：%s', (path, html, expected) => {
  const {engine, run} = setup(path, html); expect(document.body.textContent).toBe(expected);
  engine.configure({...defaults(), enabled: false}); run(); expect(document.body.innerHTML).toBe(html);
});
it('补充缺失提示可撤销，网站原提示、数字、节点、监听器保持', () => {
  const {engine, run} = setup('/matches/1/example', '<table><tbody><tr><td class="statCell hpCell">100</td><td class="statCell hpCell" title="Site tooltip">80</td></tr></tbody></table>');
  const cells = [...document.querySelectorAll('td')]; let clicks = 0; cells[0].addEventListener('click', () => clicks++);
  expect(cells[0].title).toBe('生命值'); expect(cells[1].title).toBe('Site tooltip');
  engine.configure({...defaults(), enabled: false}); run(); expect(cells[0].hasAttribute('title')).toBe(false);
  expect(cells[0].textContent).toBe('100'); cells[0].click(); expect(clicks).toBe(1);
});
it('正文与实体内同形 UI 不翻译', () => {
  setup('/coach/1/example', '<div class="newstext"><h2>Team stats for B1ad3 as coach</h2></div>');
  expect(document.querySelector('h2')!.textContent).toBe('Team stats for B1ad3 as coach');
});
