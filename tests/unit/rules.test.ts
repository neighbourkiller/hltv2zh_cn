import { expect, it } from 'vitest';
import { exact } from '../../src/core/rules';
import { defaults } from '../../src/features/settings';

it('共享词库复用查找表，规则的模块、选择器和属性目标仍独立', () => {
  const entries = Object.freeze({ 'All time': '全部时间' });
  const text = exact('test.text', 'statistics', '.label', entries);
  const title = exact('test.title', 'player-stats', '[title]', entries, 'title');
  expect(text.translate).toBe(title.translate);
  expect(title).toMatchObject({ id: 'test.title', module: 'player-stats', selector: '[title]', target: 'title' });
  expect(text.target).toBeUndefined();
  expect(title.translate(' ALL\u00a0TIME ', defaults())).toBe('全部时间');
  const other = exact('test.other', 'statistics', '.other', { 'All time': '所有时间' });
  expect(other.translate('all time', defaults())).toBe('所有时间');
  expect(text.translate('all time', defaults())).toBe('全部时间');
});

it('规范化冲突仍报错，失败编译不留下缓存', () => {
  const entries: Record<string, string> = { 'All time': '全部时间', ' ALL TIME ': '所有时间' };
  expect(() => exact('first', 'common', 'span', entries)).toThrow('重复词条: first/ ALL TIME ');
  expect(() => exact('second', 'common', 'span', entries)).toThrow('重复词条: second/ ALL TIME ');
  delete entries[' ALL TIME '];
  expect(exact('fixed', 'common', 'span', entries).translate('all time', defaults())).toBe('全部时间');
});
