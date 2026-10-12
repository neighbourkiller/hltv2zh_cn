import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults } from '../../src/features/settings';

afterEach(() => { document.body.innerHTML = ''; });
function setup(path = '/matches/2398753/falcons-vs-spirit-esl-pro-league-season-24') {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync('tests/fixtures/match-lineups.html', 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage(path), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  return { engine, run };
}
const text = (selector: string) => document.querySelector(selector)!.textContent!.trim();

it('实页阵容对比翻译全部指标/入口，保留 Rating、缩写、数值、实体、数据和节点', () => {
  const { engine, run } = setup();
  const container = document.querySelector('.lineups-compare-container')!;
  const data = container.getAttribute('data-team1-players-data');
  const cells = [...document.querySelectorAll('.lineups-compare-middle-table-stat')].map(e => e.textContent);
  const links = [...document.querySelectorAll('#lineups a')].map(e => e.getAttribute('href'));
  const photos = [...document.querySelectorAll('#lineups img')].map(e => [e.getAttribute('src'), e.getAttribute('alt'), e.getAttribute('title')]);
  const count = document.querySelectorAll('*').length;
  const profileSpan = document.querySelector('.profile-link > .gtSmartphone-only')!;
  const originalText = profileSpan.firstChild;
  run();
  expect(text('.lineups-compare-container th.table-header')).toBe('重点数据');
  expect(text('.table-subheader')).toBe('(最近 3 个月)');
  expect(text('.kpr .gtSmartphone-only')).toBe('每回合击杀');
  expect(text('.dpr .gtSmartphone-only')).toBe('每回合阵亡');
  expect(text('.multiKill .lineups-compare-middle-table-center-stat')).toBe('多杀评分');
  expect(text('.roundSwing .lineups-compare-middle-table-center-stat')).toBe('回合胜率影响');
  expect(text('.adr .gtSmartphone-only')).toBe('每回合平均伤害');
  expect(text('.rating .lineups-compare-middle-table-center-stat')).toBe('Rating');
  expect(text('.kast .lineups-compare-middle-table-center-stat')).toBe('KAST');
  expect(text('.kpr .smartphone-only')).toBe('KPR'); expect(text('.dpr .smartphone-only')).toBe('DPR'); expect(text('.adr .smartphone-only')).toBe('ADR');
  expect([...document.querySelectorAll('.profile-link > .gtSmartphone-only')].map(e => e.textContent)).toEqual(['选手资料', '选手资料']);
  expect([...document.querySelectorAll('.profile-link > .smartphone-only')].map(e => e.textContent)).toEqual(['资料', '资料']);
  expect([...document.querySelectorAll('.stats-link')].map(e => e.textContent)).toEqual(['数据', '数据']);
  expect(text('.compare-link')).toBe('完整对比'); expect(profileSpan.firstChild).toBe(originalText);
  expect(text('.lineups-compare-playername')).toBe('m0NESY'); expect(text('.player-compare .text-ellipsis')).toBe('karrigan');
  expect([...document.querySelectorAll('.lineups-compare-middle-table-stat')].map(e => e.textContent)).toEqual(cells);
  expect([...document.querySelectorAll('#lineups a')].map(e => e.getAttribute('href'))).toEqual(links);
  expect([...document.querySelectorAll('#lineups img')].map(e => [e.getAttribute('src'), e.getAttribute('alt'), e.getAttribute('title')])).toEqual(photos);
  expect(container.getAttribute('data-team1-players-data')).toBe(data); expect(document.querySelectorAll('*')).toHaveLength(count);
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes); expect(engine.metrics.errors).toBe(0);
});

it('切换对比选手时重新处理英文节点，保留新的昵称/链接/数值；关闭模块恢复', () => {
  const { engine, run } = setup(); run();
  const links = document.querySelector('.lineups-compare-player-links')!;
  links.innerHTML = '<a class="lineups-compare-player-link profile-link" href="/player/3741/niko"><span class="gtSmartphone-only">Player profile</span><span class="smartphone-only">Profile</span></a><a class="lineups-compare-player-link stats-link" href="/stats/players/3741/niko?startDate=2026-07-08&amp;endDate=2026-10-08">Stats</a>';
  document.querySelector('.lineups-compare-playername')!.textContent = 'Stats';
  document.querySelector('.kpr .left-stat')!.textContent = '0.71';
  document.querySelector('.roundSwing .lineups-compare-middle-table-center-stat')!.firstChild!.nodeValue = 'ROUND SWING';
  run(); expect(text('.profile-link > .gtSmartphone-only')).toBe('选手资料'); expect(text('.stats-link')).toBe('数据');
  expect(text('.lineups-compare-playername')).toBe('Stats'); expect(text('.kpr .left-stat')).toBe('0.71');
  expect(document.querySelector('.profile-link')!.getAttribute('href')).toBe('/player/3741/niko');
  const config = defaults(); config.modules['match-detail'] = false; engine.configure(config); run();
  expect(text('.profile-link > .gtSmartphone-only')).toBe('Player profile'); expect(text('.stats-link')).toBe('Stats');
  expect(text('.roundSwing .lineups-compare-middle-table-center-stat')).toBe('ROUND SWING'); expect(text('.nav-link')).toBe('比赛');
});

it('资料按钮放行限定于阵容区域，实体和正文中同名词条仍受保护，其他页不启用', () => {
  const { run } = setup();
  document.body.insertAdjacentHTML('beforeend', '<a class="lineups-compare-player-link profile-link" href="/player/1/stats"><span>Player profile</span></a><div class="thread-message-text"><div class="lineups-compare-middle-table-center-stat">Kills per round</div></div>');
  document.querySelector('.lineups-compare-playername')!.textContent = 'Kills per round';
  run(); expect(text('body > a.profile-link')).toBe('Player profile'); expect(text('.thread-message-text')).toBe('Kills per round');
  expect(text('.lineups-compare-playername')).toBe('Kills per round');
  const other = setup('/events/8244/esl-pro-league-season-24'); other.run(); expect(text('.kpr .gtSmartphone-only')).toBe('Kills per round');
});
