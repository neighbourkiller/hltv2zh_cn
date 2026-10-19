import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults, parseSettings } from '../../src/features/settings';

afterEach(() => { document.body.innerHTML = ''; });
function setup(path = '/events/8244/esl-pro-league-season-24', fixture = 'event-detail') {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync(`tests/fixtures/${fixture}.html`, 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage(path), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  return { engine, run };
}
const text = (selector: string) => document.querySelector(selector)!.textContent!.trim();

it('Thunderpick 小组轮次、递补、嵌套日期和决赛获邀提示覆盖并可恢复', () => {
  const { run, engine } = setup('/events/8932/thunderpick-world-championship-2026', 'event-thunderpick');
  const original = document.body.innerHTML;
  const nodes = [...document.querySelectorAll('*')];
  run();
  expect(text('#Brackets')).toBe('淘汰赛');
  expect([...document.querySelectorAll('.slotted-bracket-header .name')].map(e => e.textContent)).toEqual(['单败淘汰对阵图', 'A 组', 'B 组']);
  expect([...document.querySelectorAll('.event-page .round-header')].map(e => e.textContent)).toEqual(['半决赛', '首轮', '胜者组比赛', '淘汰赛', '出线决胜战']);
  expect(text('.event-page .time-day-of-week')).toBe('今天');
  expect(text('.event-text')).toBe('递补参赛（VRS 欧洲）');
  expect(text('.transfer-team-status')).toBe('替补');
  expect(text('.transfer-team-no-team')).toBe('无战队');
  expect(text('a.button.colbutton')).toBe('全部转会');
  expect(text('.sidebar-minigames-playnow-btn')).toBe('开始游戏');
  expect(document.querySelector('.transfer-team-container img')!.getAttribute('alt')).toBe('PARIVISION');
  expect(text('.format-data')).toBe('GSL 双败淘汰 BO3');
  expect(text('.eventMeta td span span')).toBe('2026年10月18日');
  expect(text('.eventMeta a')).toBe('计入排名');
  expect(text('.location .text-ellipsis')).toBe('马耳他');
  expect(text('.eventMeta td:has(> img)')).toBe('马耳他');
  expect(text('.vrs-event-stakes-head .vrs-event-stakes-with')).toBe('进入决赛');
  expect(document.querySelector('.vrs-event-stakes-head')!.getAttribute('title')).toBe('在本赛事进入决赛和未进入时的获邀概率');
  expect(text('.thread-message-text')).toBe('Opening roundToday');
  expect(text('.vrs-event-stakes-row[href]')).toBe('BETBOOM98.5%70.2%');
  expect(text('.newsitem')).toBe('FURIA fend off BETBOOM to end day one of TWC');
  expect([...document.querySelectorAll('*')]).toEqual(nodes);
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes);
  engine.configure({ ...defaults(), enabled: false }); run();
  expect(document.body.innerHTML).toBe(original);
});

it('Thunderpick 动态日期和小组更新，未知递补区域及同形实体继续保留', () => {
  const { run } = setup('/events/8932/thunderpick-world-championship-2026', 'event-thunderpick'); run();
  document.querySelectorAll('.slotted-bracket-header .name')[1].firstChild!.nodeValue = 'Group C';
  document.querySelector('.event-page .time-day-of-week')!.firstChild!.nodeValue = 'Tomorrow';
  document.querySelector('.eventMeta td span span')!.firstChild!.nodeValue = 'Oct 19th 2026';
  document.querySelector('.event-text')!.firstChild!.nodeValue = 'Team Replacement (VRS Unknown)';
  document.querySelector('.rounds .team-name')!.firstChild!.nodeValue = 'Group A'; run();
  expect(document.querySelectorAll('.slotted-bracket-header .name')[1].textContent).toBe('C 组');
  expect(text('.event-page .time-day-of-week')).toBe('明天');
  expect(text('.eventMeta td span span')).toBe('2026年10月19日');
  expect(text('.event-text')).toBe('Team Replacement (VRS Unknown)');
  expect(text('.rounds .team-name')).toBe('Group A');
});

it('赛事详情与比赛子页路由独立识别，升级旧设置保留原开关', () => {
  for (const path of ['/events/8244/esl-pro-league-season-24', '/events/1', '/events/8244/matches']) expect(detectPage(path)).toBe('event-detail');
  expect(detectPage('/events')).toBe('events'); expect(detectPage('/events/archive')).toBe('other');
  const config = parseSettings({ schemaVersion: 1, enabled: false, maps: 'zh-CN', modules: { events: false, common: false } });
  expect(config.modules['event-detail']).toBe(true); expect(config.modules.events).toBe(false); expect(config.modules.common).toBe(false);
  expect(config.enabled).toBe(false); expect(config.maps).toBe('zh-CN');
});

it('实页结构覆盖侧栏、日期、奖金、阶段、集锦、赛制和 VRS，实体及节点保持', () => {
  const { run, engine } = setup();
  const date = document.querySelector('.eventdate [data-unix]')!;
  const link = document.querySelector('a[href*="#PrizeDistribution"]')!;
  const originalHref = link.getAttribute('href'); const nodeCount = document.querySelectorAll('*').length;
  run();
  expect([...document.querySelectorAll('.sidebar-headline')].map(e => e.textContent)).toContain('比赛'); expect(link.textContent).toBe('奖金分配'); expect(link.getAttribute('href')).toBe(originalHref);
  expect(text('th.eventdate')).toBe('日期'); expect(text('th.prizepool')).toContain('奖金池');
  expect(date.textContent).toBe('10月3日'); expect(date.getAttribute('data-unix')).toBe('1791021600000');
  expect(text('.eventdate span span')).toBe('2026年10月11日');
  expect(text('.eventMeta td > [data-time-format]')).toBe('2026年10月3日');
  expect(text('.slotted-bracket-header .name')).toBe('淘汰赛'); expect(text('.round-header')).toBe('四分之一决赛');
  expect(document.querySelector('.round-header')!.getAttribute('title')).toBe('收起本轮');
  expect(text('.time-day-of-week')).toBe('周五'); expect(text('.team-tbd .team-name')).toBe('待定');
  expect(text('.placement > div:not([class])')).toBe('第 1 名'); expect(text('.club-share')).toBe('+ 俱乐部分成：$170,000');
  expect(text('.highlight-group-name')).toBe('第 5 天'); expect(text('.highlight-group-count')).toBe('8 段集锦');
  expect(text('.thumbnail-view-count')).toBe('1660 次观看'); expect(text('.highlight-overview-header > .overview-right')).toBe('第 5 天');
  expect(text('.team-box .event-text')).toBe('VRS（全球）');
  expect(text('.playing-info-flex > div')).toBe('1660 次观看'); expect(text('.show-lineups')).toBe('显示阵容');
  expect(text('.format-data')).toBe('瑞士轮 BO3');
  expect([...document.querySelectorAll('.format-data')].map(e => e.textContent)).toContain('单败淘汰 BO3\n- 总决赛 BO5\n季军赛 BO3');
  expect(text('.vrs-event-stakes-with')).toBe('前 4 名'); expect(text('.vrs-event-stakes-more')).toBe('另有 1 个邀请名额受影响');
  expect(text('.event-groups-container .group-name')).toBe('瑞士轮小组');
  expect(document.querySelector('.cell-width-rw')!.getAttribute('title')).toBe('获胜回合');
  expect(text('.event-hub-title')).toBe('ESL Pro League Season 24'); expect(text('.rounds .team-name')).toBe('Vitality');
  expect(text('.prize')).toBe('$125,000'); expect(text('.highlight-description')).toContain('magixx - ACE');
  expect(text('.location .text-ellipsis')).toBe('Katowice, Poland'); expect(text('.thread-message-text')).toBe('Playoffs Prize pool Day 5');
  expect(document.querySelector<HTMLInputElement>('input')!.value).toBe('News'); expect(text('body > .team-name')).toBe('Playoffs');
  expect(document.querySelectorAll('*')).toHaveLength(nodeCount);
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes); expect(engine.metrics.errors).toBe(0);
});

it('更新原 Text、替换 TBD 为真实队伍及移入保护区后使用最新原文', () => {
  const { run } = setup(); run();
  const day = document.querySelector('.time-day-of-week')!.firstChild!;
  day.nodeValue = 'Saturday';
  const placeholder = document.querySelector('.team-tbd .team-name')!;
  placeholder.parentElement!.classList.remove('team-tbd'); placeholder.firstChild!.nodeValue = 'Playoffs';
  const count = document.querySelector('.highlight-group-count')!.firstChild!; count.nodeValue = '12 highlights';
  run(); expect(day.nodeValue).toBe('周六'); expect(placeholder.textContent).toBe('Playoffs'); expect(count.nodeValue).toBe('12 段集锦');
  document.querySelector('.thread-message-text')!.append(day); run(); expect(day.nodeValue).toBe('Saturday');
});

it('地图偏好限定地图槽位，详情开关独立于列表，停用恢复源文案', () => {
  const { run, engine } = setup(); const config = defaults(); config.modules.events = false; config.maps = 'zh-CN';
  engine.configure(config); run(); expect(text('.map-pool-map-name')).toBe('死城之谜'); expect(text('.show-lineups')).toBe('显示阵容');
  config.modules['event-detail'] = false; engine.configure(config); run();
  expect(text('.map-pool-map-name')).toBe('死城之谜'); expect(text('.show-lineups')).toBe('Show lineups');
  config.modules.maps = false; engine.configure(config); run(); expect(text('.map-pool-map-name')).toBe('Cache');
  expect(text('.team-tbd .team-name')).toBe('TBD'); expect(document.querySelector('.round-header')!.getAttribute('title')).toBe('Collapse round');
  expect(text('.nav-link')).toBe('赛事');
});

it('未知赛制行和看似标签的真实实体保留英文，列表页不启用详情规则', () => {
  const { run } = setup();
  document.querySelector('.format-data')!.textContent = 'Swiss Bo3\nWinner plays Spirit in Grand final';
  const realTeam = document.querySelector('.rounds .team-name')!; realTeam.textContent = 'TBD'; run();
  expect(text('.format-data')).toBe('瑞士轮 BO3\nWinner plays Spirit in Grand final'); expect(realTeam.textContent).toBe('TBD');
  const list = setup('/events'); list.run(); expect(text('.show-lineups')).toBe('Show lineups');
});
