import { beforeEach, describe, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { TranslationEngine } from '../../src/core/engine';
import { walk } from '../../src/core/walker';
import { defaults, parseSettings } from '../../src/features/settings';
import { detectPage } from '../../src/core/types';
import { validateRules } from '../../src/core/rules';
import { dateText } from '../../src/adapters/templates';

beforeEach(() => { document.body.innerHTML = ''; });
function translate(html: string, page: Parameters<typeof detectPage>[0] = '/') {
  document.body.innerHTML = html;
  const engine = new TranslationEngine(rules, detectPage(page), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  run();
  return { engine, run };
}
describe('真实结构回归', () => {
  it('导航保留 SVG、URL、事件及节点边界空白', () => {
    const { engine, run } = translate('<a class="nav-link" href="/stats"> Stats <div><svg><path d="M0 0" /></svg></div></a>');
    const anchor = document.querySelector('a')!;
    const svg = document.querySelector('svg');
    let clicks = 0;
    anchor.addEventListener('click', e => { e.preventDefault(); clicks++; });
    const writes = engine.metrics.writes;
    run(); anchor.click();
    expect(anchor.firstChild!.nodeValue).toBe(' 数据 ');
    expect(document.querySelector('svg')).toBe(svg);
    expect(anchor.getAttribute('href')).toBe('/stats');
    expect(clicks).toBe(1); expect(engine.metrics.writes).toBe(writes);
  });
  it('新闻正文、队名、赛事名、输入和编辑区不会因公共词条而误译', () => {
    translate('<div class="newstext"><a class="nav-link">Matches</a></div><a href="/team/1/players" class="nav-link">Players</a><div contenteditable="true"><a class="nav-link">News</a></div><input value="News" placeholder="Search..."><h2 class="newsheader">Today\'s news</h2>');
    expect(document.querySelector('.newstext')!.textContent).toBe('Matches');
    expect(document.querySelector('a[href]')!.textContent).toBe('Players');
    expect(document.querySelector('[contenteditable]')!.textContent).toBe('News');
    expect(document.querySelector('input')!.value).toBe('News');
    expect(document.querySelector('input')!.placeholder).toBe('搜索…');
    expect(document.querySelector('h2')!.textContent).toBe('今日新闻');
  });
  it('同一个 Text 更新后重新翻译，移动到保护区恢复自己的译文', () => {
    const { engine, run } = translate('<h2 class="newsheader">Today\'s news</h2><div class="newstext"></div>');
    const text = document.querySelector('h2')!.firstChild!;
    text.nodeValue = "Yesterday's news"; run();
    expect(text.nodeValue).toBe('昨日新闻');
    document.querySelector('.newstext')!.append(text); run();
    expect(text.nodeValue).toBe("Yesterday's news");
    expect(engine.metrics.errors).toBe(0);
  });
  it('恢复不覆盖网站新的数据，重新启用可翻译', () => {
    const { engine, run } = translate('<h2 class="newsheader">Today\'s news</h2><input placeholder="Search...">');
    document.querySelector('input')!.placeholder = 'Server updated';
    engine.configure({ ...defaults(), enabled: false }); run();
    expect(document.querySelector('h2')!.textContent).toBe("Today's news");
    expect(document.querySelector('input')!.placeholder).toBe('Server updated');
    engine.configure(defaults()); run();
    expect(document.querySelector('h2')!.textContent).toBe('今日新闻');
  });
  it('区域计数与筛选值原样保留', () => {
    translate('<label><div class="matches-filter-name-text">Europe (28)</div><input name="Europe" data-filter-value="Europe" value="28"></label>', '/matches');
    expect(document.querySelector('div')!.textContent).toBe('欧洲 (28)');
    expect(document.querySelector('input')!.getAttribute('data-filter-value')).toBe('Europe');
    expect(document.querySelector('input')!.value).toBe('28');
  });
  it('BP 保留普通英文队名，只翻译地图槽位，赛制换行和链接保持', () => {
    const { engine, run } = translate('<div class="veto-box"><div class="padding preformatted-text">Best of 3 (Online)\n\n* Round of 16\n\nEnglish stream: <a href="https://example.com">watch</a></div><div class="padding"><div>1. Train picked Ancient</div></div></div>', '/matches/123/example');
    expect(document.querySelector('.preformatted-text')!.textContent).toBe('BO3（线上赛）\n\n* 十六强\n\n英语直播： watch');
    expect(document.querySelector('.padding > div')!.textContent).toBe('1. Train 选择 远古遗迹');
    engine.configure({ ...defaults(), maps: 'en' }); run();
    expect(document.querySelector('.padding > div')!.textContent).toBe('1. Train 选择 Ancient');
    expect(document.querySelector('a')!.getAttribute('href')).toBe('https://example.com');
  });
  it('日期不修改 unix，倒计时及比分允许继续更新', () => {
    translate('<div class="timeAndEvent"><div class="date" data-unix="1791450000000">8th of October 2026</div><div class="countdown">1d : 6h : 20m : 44s</div><div class="time">17:00</div></div><span data-livescore-current-map-score="2">2</span>', '/matches/123/example');
    expect(document.querySelector('.date')!.textContent).toBe('2026年10月8日');
    expect(document.querySelector('.date')!.getAttribute('data-unix')).toBe('1791450000000');
    expect(document.querySelector('.countdown')!.textContent).toBe('1天 : 6时 : 20分 : 44秒');
    expect(document.querySelector('.time')!.textContent).toBe('17:00');
    expect(document.querySelector('span')!.textContent).toBe('2');
  });
  it('重复规则和非法选择器会被发现', () => {
    expect(() => validateRules(rules, document)).not.toThrow();
    expect(() => validateRules([rules[0], rules[0]], document)).toThrow('重复规则');
    expect(() => validateRules([{ ...rules[0], selector: '[' }], document)).toThrow();
  });
  it('日期模板严格，配置异常回退默认', () => {
    expect(dateText('Results for October 8th 2026')).toBe('2026年10月8日的赛果');
    expect(dateText('December 31st')).toBe('12月31日');
    expect(dateText('January 2027')).toBe('2027年1月');
    expect(dateText('October 99th')).toBeUndefined();
    expect(dateText('Octopus 8th')).toBeUndefined();
    expect(dateText('the event on October 8th')).toBeUndefined();
    expect(parseSettings({ schemaVersion: 4, enabled: false })).toEqual(defaults());
    expect(parseSettings({ schemaVersion: 1, modules: { home: false, common: 'bad' } }).modules.home).toBe(false);
  });
  it('站点反复覆盖同一文案时限流，保留其新源文案', () => {
    const { engine, run } = translate('<h2 class="newsheader">Today\'s news</h2>');
    const node = document.querySelector('h2')!.firstChild!;
    for (let i = 0; i < 30; i++) { node.nodeValue = "Today's news"; run(); }
    expect(engine.metrics.throttled).toBe(1);
    expect(node.nodeValue).toBe("Today's news");
  });
  it('属性被网站删除后不会复活；模块开关不影响其他模块', () => {
    const { engine, run } = translate('<a class="nav-link">News</a><h2 class="newsheader">Today\'s news</h2><input placeholder="Search...">');
    document.querySelector('input')!.removeAttribute('placeholder');
    const settings = defaults(); settings.modules.home = false; engine.configure(settings); run();
    expect(document.querySelector('h2')!.textContent).toBe("Today's news");
    expect(document.querySelector('a')!.textContent).toBe('新闻');
    expect(document.querySelector('input')!.hasAttribute('placeholder')).toBe(false);
  });
});
