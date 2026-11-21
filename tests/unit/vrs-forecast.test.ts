import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { forecastText, forecastTooltip } from '../../src/adapters/vrs-forecast';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults } from '../../src/features/settings';

afterEach(() => { document.body.innerHTML = ''; });
function setup(file = 'vrs-forecast', path = '/valve-ranking/teams/event/8295') {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync(`tests/fixtures/${file}.html`, 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage(path), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  return { engine, run };
}
const text = (s: string) => document.querySelector(s)!.textContent!.trim();

it('普通赛事邀请预测翻译主体、队伍详情、概率解释与假设控件，保留结构/数据/实体', () => {
  const { engine, run } = setup();
  const nodes = [...document.querySelectorAll('*')];
  const links = [...document.querySelectorAll('a')].map(e => e.getAttribute('href'));
  const names = [...document.querySelectorAll('.team-name,.vrs-story-name,.vrs-key-event-name,.vrs-what-if-group > span')].map(e => e.textContent);
  const values = [...document.querySelectorAll('option')].map(e => e.value);
  const numbers = [...document.querySelectorAll('.qualify-text,.qualify-chance,.vrs-standing-value')].map(e => e.textContent!.match(/[<>+−]?\d[\d,.]*(?:%|)/g));
  run();
  expect(text('.regional-ranking-header-text')).toBe('BLAST Bounty 2027 Season 1 邀请排名（2026年11月2日）');
  expect(text('.ranking-description')).toContain('1500 个模拟赛季');
  expect(text('.ranking-description')).toContain('自身拒绝邀请不会降低其获邀概率');
  expect(text('.vrs-what-if-open')).toBe('假设结果…');
  expect(text('.vrs-what-if-pick > option')).toBe('MOUZ 获胜');
  expect(document.querySelector('.vrs-what-if-close')!.getAttribute('aria-label')).toBe('关闭');
  expect(text('.vrs-race')).toBe('12 个名额中已有 8 个基本确定，15 支队伍争夺剩余 4 个名额。');
  expect(text('.qualify-verdict')).toBe('基本锁定');
  expect(text('.vrs-details-title')).toBe('在邀请顺序中的名次');
  expect(text('.vrs-details-more > a')).toBe('HLTV 战队档案');
  expect(text('a.vrs-mover .vrs-mover-text > .vrs-story-faded')).toContain('带来重要机会');
  expect(text('.vrs-points-fact .vrs-tooltip')).toContain('截止日 VRS 积分的中位数');
  expect(text('.vrs-power-ranking-intro')).toContain('过去 18 个月');
  expect(text('.vrs-track-record-intro')).toContain('62 份历史邀请名单');
  expect(text('.vrs-track-record-summary')).toContain('87%');
  expect([...document.querySelectorAll('*')]).toEqual(nodes);
  expect([...document.querySelectorAll('a')].map(e => e.getAttribute('href'))).toEqual(links);
  expect([...document.querySelectorAll('.team-name,.vrs-story-name,.vrs-key-event-name,.vrs-what-if-group > span')].map(e => e.textContent)).toEqual(names);
  expect([...document.querySelectorAll('option')].map(e => e.value)).toEqual(values);
  expect([...document.querySelectorAll('.qualify-text,.qualify-chance,.vrs-standing-value')].map(e => e.textContent!.match(/[<>+−]?\d[\d,.]*(?:%|)/g))).toEqual(numbers);
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes); expect(engine.metrics.errors).toBe(0);
});

it('Major 三赛区、阶段概率、落选和区域邀请顺序说明均翻译', () => {
  const { run } = setup('vrs-forecast-major', '/valve-ranking/teams/event/8302'); run();
  expect([...document.querySelectorAll('.valve-ranking-region-header')].map(e => e.textContent!.trim())).toEqual(['欧洲EU', '美洲AM', '亚洲AS']);
  expect(text('.vrs-simulation th.stage')).toBe('第 3 阶段');
  expect(text('.likely-stage')).toBe('最可能进入第 3 阶段');
  expect(text('.qualify-out')).toBe('基本无缘');
  expect([...document.querySelectorAll('.vrs-details-title')].map(e => e.textContent)).toContain('在亚洲邀请顺序中的名次');
  expect([...document.querySelectorAll('.vrs-tooltip')].some(e => e.textContent!.includes('最后一支获邀队伍积分的中位数'))).toBe(true);
});

it('翻译关闭模拟后的预测说明、积分和未获邀分界，赛事名不变', () => {
  const { run } = setup('vrs-forecast-plain'); run();
  expect(text('.ranking-description')).toContain('计入时间衰减');
  expect(text('.vrs-simulation-toggle')).toBe('模拟后续比赛');
  expect(text('.points')).toContain('V社');
  expect(document.body.textContent).toContain('未获邀');
});

it('动态原节点/tooltip 回写继续翻译，独立模块关闭恢复最新原文', () => {
  const { run, engine } = setup(); run();
  const header = document.querySelector('.header-with-tooltip')!.firstChild!;
  header.nodeValue = 'Projected rank';
  const verdict = document.querySelector('.qualify-verdict')!;
  verdict.firstChild!.nodeValue = 'Out'; verdict.setAttribute('title', 'Invited in 1 of the 1500 simulated seasons.');
  run(); expect(header.nodeValue).toBe('预测排名'); expect(verdict.textContent).toBe('基本无缘');
  expect(verdict.getAttribute('title')).toBe('在 1500 个模拟赛季中，有 1 个赛季获邀。');
  const settings = defaults(); settings.modules['valve-ranking'] = false; settings.modules['vrs-invites'] = false;
  engine.configure(settings); run(); expect(header.nodeValue).toBe('预测排名');
  settings.modules['vrs-forecast'] = false; engine.configure(settings); run();
  expect(header.nodeValue).toBe('Projected rank'); expect(verdict.textContent).toBe('Out');
  expect(verdict.getAttribute('title')).toBe('Invited in 1 of the 1500 simulated seasons.');
});

it('同名实体和正文、输入及无关路由保持原文，UI 移入正文后恢复', () => {
  const { run, engine } = setup();
  document.querySelector('.vrs-story-name')!.textContent = 'Mirage';
  document.querySelector('.vrs-power-name')!.textContent = 'Nuke';
  document.querySelector('.vrs-key-event-name')!.textContent = 'Train';
  document.body.insertAdjacentHTML('beforeend', '<div class="newstext"><div class="vrs-details-more"><a href="/team/1/test" class="moreLink">HLTV Team profile</a></div></div><input value="Show chances">');
  run(); expect(text('.vrs-story-name')).toBe('Mirage'); expect(text('.vrs-power-name')).toBe('Nuke'); expect(text('.vrs-key-event-name')).toBe('Train');
  expect(text('.newstext .moreLink')).toBe('HLTV Team profile'); expect(document.querySelector('input')!.value).toBe('Show chances');
  const label = document.querySelector('.vrs-what-if-title')!.lastChild!; document.querySelector('.newstext')!.append(label); run(); expect(label.nodeValue).toBe('What if…');
  expect(engine.metrics.errors).toBe(0);
  const other = setup('vrs-forecast', '/matches'); other.run();
  expect(text('.vrs-what-if-open')).toBe('What if…');
  expect(text('.ranking-description')).toContain("Every team's chance of an invite");
});

it('数值模板覆盖分布、趋势和关键赛果，未知句式不做局部替换', () => {
  expect(forecastText('usually 2nd–4th')).toBe('通常为第 2–4 名');
  expect(forecastText('They need 1win not to win GLuck Moscow Cyber Games 2026: 23% if so, 11% if not.')).toContain('1win 未能在 GLuck Moscow Cyber Games 2026 夺冠');
  expect(forecastTooltip('23rd in <1% of seasons, no invite')).toBe('<1% 的模拟赛季中为第 23 名，均未获邀');
  expect(forecastText('Their invite is all but certain; the stage is still open: Stage 3 76.6%, Stage 2 23.1%.')).toContain('第 3 阶段 76.6%');
  expect(forecastText('Unknown Stage 4 result')).toBeUndefined();
  expect(forecastText('Updated some time ago')).toBeUndefined();
  expect(forecastTooltip('Unrecognized forecast explanation')).toBeUndefined();
});
