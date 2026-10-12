import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults } from '../../src/features/settings';
afterEach(() => { document.body.innerHTML = ''; });
function setup(file: string, path: string) {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync(`tests/fixtures/statistics-${file}.html`, 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage(path), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); }; return { engine, run };
}
const text = (selector: string) => document.querySelector(selector)!.textContent!.trim();
it('赛事统计概览的头部/侧栏筛选和卡片标签汉化，昵称/Rating/值/链接保持', () => {
  const { run, engine } = setup('overview', '/stats');
  const options = [...document.querySelectorAll('option')].map(e => [e.value,e.getAttribute('data-link')]);
  const links = [...document.querySelectorAll('a')].map(e => e.getAttribute('href')); const count = document.querySelectorAll('*').length;
  run(); expect(text('.tab-title')).toBe('赛事筛选');
  expect([...document.querySelectorAll('.standard-headline')].map(e => e.textContent)).toEqual(['顶尖选手','顶尖战队','常用武器']);
  expect(text('.top-x-box > .name')).toBe('ropz'); expect(text('.top-x-box .rating')).toContain('Rating 3.0'); expect(text('.top-x-box .rating .bold')).toBe('1.40');
  expect(text('.top-x-box .average')).toContain('地图'); expect(text('.context-button')).toBe('查看选手');
  expect(document.querySelector<HTMLInputElement>('.search-input-con input')!.placeholder).toBe('加入选手对比…');
  expect([...document.querySelectorAll('option')].map(e => [e.value,e.getAttribute('data-link')])).toEqual(options);
  expect([...document.querySelectorAll('a')].map(e => e.getAttribute('href'))).toEqual(links); expect(document.querySelectorAll('*')).toHaveLength(count);
  expect(engine.metrics.errors).toBe(0);
});
it('赛事地图统计的标题、分布说明、导航和地图名生效，图片/URL/地图值保持', () => {
  const { run } = setup('maps', '/stats/maps'); const image = document.querySelector('.maps-navigation-link img'); run();
  expect([...document.querySelectorAll('.standard-headline')].map(e => e.textContent)).toEqual(['地图','出场地图分布','各地图 T / CT 胜场分布']);
  expect(text('.maps-navigation-desc')).toBe('荒漠迷城'); expect(document.querySelector('.maps-navigation-link')!.getAttribute('href')).toContain('/32/Mirage?');
  expect(document.querySelector('.maps-navigation-link img')).toBe(image);
  expect([...document.querySelectorAll('.sidebar-single-line-item > span')].map(e => e.textContent)).toContain('五杀');
  expect(detectPage('/stats/players/19230/m0nesy')).toBe('player-stats'); expect(detectPage('/stats/players/compare')).toBe('player-compare');
});
it('停用统计数据可恢复 UI，而全站地图保持中文，昵称与赛事实体保持原文', () => {
  const { run, engine } = setup('overview', '/stats'); document.querySelector('.top-x-box > .name')!.textContent = 'Ancient'; run();
  const settings = defaults(); settings.modules.statistics = false; engine.configure(settings); run();
  expect(text('.tab-title')).toBe('Event filter'); expect(text('.top-x-box > .name')).toBe('Ancient'); expect(text('.event-hub-title')).toBe('ESL Pro League Season 24');
  expect(text('.stats-sub-map > a[href*="maps=de_ancient"]')).toBe('远古遗迹'); settings.modules.maps = false; engine.configure(settings); run(); expect(text('.stats-sub-map > a[href*="maps=de_ancient"]')).toBe('Ancient');
});
