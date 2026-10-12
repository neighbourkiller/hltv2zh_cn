import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { compareFilterText } from '../../src/adapters/player-compare';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults, parseSettings } from '../../src/features/settings';

afterEach(() => { document.body.innerHTML = ''; });
function setup(file = 'player-compare', path = '/stats/players/compare/19230/m0nesy/21167/donk') {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync(`tests/fixtures/${file}.html`, 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage(path), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  return { engine, run };
}
const texts = (selector: string) => [...document.querySelectorAll(selector)].map(e => e.textContent!.trim());

it('空白、单选手及双选手对比路由接入独立模块，旧配置默认启用', () => {
  for (const path of ['/stats/players/compare', '/stats/players/compare/', '/stats/players/compare/21167/donk', '/stats/players/compare/19230/m0nesy/21167/donk', '/stats/players/compare/7998/s1mple/11893/zywoo']) expect(detectPage(path)).toBe('player-compare');
  expect(detectPage('/stats/players/comparison')).toBe('statistics'); expect(detectPage('/stats/players/21167/donk')).toBe('player-stats');
  const config = parseSettings({ schemaVersion: 1, enabled: true, maps: 'zh-CN', modules: { 'player-stats': false, 'match-detail': false } });
  expect(config.modules['player-compare']).toBe(true); expect(config.modules['player-stats']).toBe(false); expect(config.maps).toBe('zh-CN');
});

it('真实双侧筛选、指标及底部表格汉化，保留 Rating/缩写/值/链接/图表和节点', () => {
  const { run, engine } = setup();
  const options = [...document.querySelectorAll('option')].map(e => [e.value, e.getAttribute('data-select-action')]);
  const links = [...document.querySelectorAll('a')].map(e => e.getAttribute('href'));
  const styles = [...document.querySelectorAll('.stats-player-compare [style]')].map(e => e.getAttribute('style'));
  const chart = document.querySelector('canvas'); const count = document.querySelectorAll('*').length;
  run();
  expect(texts('option[value="allTime"]')).toEqual(['全部时间', '全部时间', '全部时间', '全部时间']);
  expect(texts('option[value="Majors"]')).toEqual(['Major 赛事', 'Major 赛事', 'Major 赛事', 'Major 赛事']);
  expect(texts('option[value="allMaps"]')).toEqual(['全部地图', '全部地图', '全部地图', '全部地图']);
  expect(texts('.selector-map-count')).toEqual(['基于 960 张地图', '基于 960 张地图', '基于 813 张地图', '基于 813 张地图']);
  expect(texts('.remove-player-link')).toEqual(['移除选手', '移除选手']);
  expect(texts('.stat-name-col').filter(Boolean)).toEqual(['Rating 2.0', '每回合击杀', 'APR', '存活率', '不白给率', '影响力', 'AWP 每回合击杀', '爆头率', '每回合首杀', '闪光助攻']);
  const rowNames = texts('.stat-row-name');
  for (const label of ['Rating 2.0', '每回合击杀', 'APR', '不白给率', '每回合助攻', '存活率', '影响力', 'AWP 每回合击杀', '爆头率', '每回合首杀', '每回合闪光助攻']) expect(rowNames).toContain(label);
  expect(texts('.standard-headline')).toContain('状态走势'); expect(texts('.diagram-info')).toEqual(['Rating 1.0 滑动窗口，每次递进 1 天']);
  expect(texts('.filter-text')).toEqual(['全部时间，全部比赛，全部地图', '全部时间，全部比赛，全部地图']);
  expect(texts('.sidebar-single-line-item > span')).toEqual(['概览', '选手', '战队', '比赛', '赛事', '地图', '排行榜', '选手对比']);
  expect(texts('a[href="/player/19230/m0nesy"]')).toEqual(['m0NESY']);
  expect(texts('a[href="/player/21167/donk"]')).toEqual(['donk']);
  expect(texts('option[value="de_mirage"]')).toEqual(['荒漠迷城', '荒漠迷城', '荒漠迷城', '荒漠迷城']);
  expect([...document.querySelectorAll('option')].map(e => [e.value, e.getAttribute('data-select-action')])).toEqual(options);
  expect([...document.querySelectorAll('a')].map(e => e.getAttribute('href'))).toEqual(links);
  expect([...document.querySelectorAll('.stats-player-compare [style]')].map(e => e.getAttribute('style'))).toEqual(styles);
  expect(document.querySelector('canvas')).toBe(chart); expect(document.querySelectorAll('*')).toHaveLength(count);
  expect(document.querySelector('.stats-bar-table')!.textContent).toContain('40.7%');
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes); expect(engine.metrics.errors).toBe(0);
});

it('2026 年 Rating 3.0 的新增指标及 KPR/KAST 覆盖双侧、双端和底表，数值/样式保持', () => {
  const { run, engine } = setup('player-compare-2026');
  const values = () => [...document.querySelectorAll('.stats-row > span:last-child:not(.status-indicator), .stats-bar-table .player1-col, .stats-bar-table .player2-col')].map(e => e.textContent!.trim()).filter(value => /^[+-]?\d+(?:\.\d+)?%?$/.test(value));
  const statistics = values();
  const styles = [...document.querySelectorAll('[style]')].map(e => e.getAttribute('style'));
  const queryTargets = [...document.querySelectorAll('option')].map(e => [e.getAttribute('value'), e.getAttribute('data-select-action')]);
  expect(texts('.stat-row-name').filter(t => t === 'Multi-kill rating')).toHaveLength(4);
  expect(texts('.stat-row-name').filter(t => t === 'Round Swing')).toHaveLength(4);
  run();
  for (const label of ['多杀评分', '回合影响力', '每回合击杀', '不白给率', 'Rating 3.0']) expect(texts('.stat-row-name').filter(t => t === label)).toHaveLength(4);
  expect(texts('.stat-name-col').filter(Boolean)).toEqual(['Rating 3.0', '每回合击杀', 'APR', '存活率', '不白给率', '多杀评分', '回合影响力', 'AWP 每回合击杀', '爆头率', '每回合首杀', '闪光助攻']);
  expect(texts('.filter-text')).toEqual(['2026，全部比赛，全部地图', '2026，全部比赛，全部地图']);
  expect(values()).toEqual(statistics);
  expect([...document.querySelectorAll('[style]')].map(e => e.getAttribute('style'))).toEqual(styles);
  expect([...document.querySelectorAll('option')].map(e => [e.getAttribute('value'), e.getAttribute('data-select-action')])).toEqual(queryTargets);
  const config = defaults(); config.modules['player-compare'] = false; engine.configure(config); run();
  for (const label of ['Multi-kill rating', 'Round Swing', 'KPR', 'KAST']) expect(texts('.stat-row-name').filter(t => t === label)).toHaveLength(4);
});

it('地图设置只作用于筛选槽位及摘要；未知摘要整体保留', () => {
  const { run, engine } = setup(); const config = defaults(); config.maps = 'zh-CN';
  document.querySelector('.filter-text')!.textContent = '2026, LAN, Mirage'; engine.configure(config); run();
  expect(texts('option[value="de_mirage"]')).toEqual(['荒漠迷城', '荒漠迷城', '荒漠迷城', '荒漠迷城']);
  expect(texts('.filter-text')[0]).toBe('2026，线下赛，荒漠迷城');
  expect(compareFilterText('All Time, All matches, Season', config)).toBe('全部时间，全部比赛，Season');
  for (const source of ['All Time, Unknown event, Mirage', 'Nickname, LAN, Mirage', 'All Time, LAN, Unknown map', 'All Time, LAN, Mirage, donk']) expect(compareFilterText(source, config)).toBeUndefined();
});

it('添加选手的提示与占位符独立汉化，输入和搜索跳转数据保持', () => {
  const { run, engine } = setup('player-compare-picker', '/stats/players/compare');
  const config = defaults(); config.modules.common = false; engine.configure(config);
  const input = document.querySelector<HTMLInputElement>('input')!; input.value = 'Impact'; const redirect = input.dataset.comparePlayerSearchRedirect;
  run(); expect(texts('.player-and-filter > span')).toEqual(['添加选手', '添加选手']); expect(input.placeholder.trim()).toBe('搜索选手');
  expect(input.value).toBe('Impact'); expect(input.dataset.comparePlayerSearchRedirect).toBe(redirect);
  config.modules['player-compare'] = false; engine.configure(config); run(); expect(input.placeholder.trim()).toBe('Search player'); expect(input.value).toBe('Impact');
});

it('动态英文指标/地图数可重译，实体/正文保持原文，停用后恢复最新网站文字', () => {
  const { run, engine } = setup(); run();
  const count = document.querySelector('.selector-map-count')!.firstChild!; count.nodeValue = 'Based on 1,001 maps';
  document.querySelector('.filter-text')!.firstChild!.nodeValue = 'Past 3 months, Online, Ancient';
  const label = document.querySelector('.stat-row-name')!; label.firstChild!.nodeValue = 'Rating 3.0';
  document.querySelector('a[href="/player/19230/m0nesy"]')!.textContent = 'Impact';
  document.body.insertAdjacentHTML('beforeend', '<div class="thread-message-text"><span class="stat-row-name">Surviving</span></div>');
  const dynamic = document.createElement('span'); dynamic.className = 'stat-row-name'; dynamic.textContent = 'Flash assists per round'; document.querySelector('.stats-player-compare')!.append(dynamic);
  run(); expect(count.nodeValue).toBe('基于 1,001 张地图'); expect(dynamic.textContent).toBe('每回合闪光助攻'); expect(label.textContent!.trim()).toBe('Rating 3.0');
  expect(texts('.filter-text')[0]).toBe('最近 3 个月，线上赛，远古遗迹'); expect(texts('a[href="/player/19230/m0nesy"]')).toEqual(['Impact']);
  expect(texts('.thread-message-text')).toEqual(['Surviving']);
  const config = defaults(); config.modules['player-compare'] = false; engine.configure(config); run();
  expect(count.nodeValue).toBe('Based on 1,001 maps'); expect(texts('.filter-text')[0]).toBe('Past 3 months, Online, Ancient'); expect(dynamic.textContent).toBe('Flash assists per round');
  expect(texts('.nav-link')).toEqual(['数据']);
});
