import { readFileSync } from 'node:fs';
import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults, parseSettings } from '../../src/features/settings';
import { playerStyle } from '../../src/features/player-style';

afterEach(() => { document.body.innerHTML = ''; document.getElementById('hltv-zh-player-style')?.remove(); });
function setup(file: string, path: string) {
  document.body.innerHTML = new DOMParser().parseFromString(readFileSync(`tests/fixtures/${file}.html`, 'utf8'), 'text/html').body.innerHTML;
  const engine = new TranslationEngine(rules, detectPage(path), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  return { engine, run };
}
const text = (selector: string) => document.querySelector(selector)!.textContent!.trim();

it('战队/两类详情独立路由，新模块默认开启且旧设置保留', () => {
  expect(detectPage('/team/7020/spirit')).toBe('team'); expect(detectPage('/team/1')).toBe('team'); expect(detectPage('/teams')).toBe('other');
  expect(detectPage('/ranking/teams/2026/october/5/details/7020')).toBe('ranking-detail');
  expect(detectPage('/valve-ranking/teams/details/2026/october/8')).toBe('valve-ranking-detail'); expect(detectPage('/valve-ranking/teams/event/8295')).toBe('other');
  const config = parseSettings({ schemaVersion: 2, maps: 'en', modules: { ranking: false, 'valve-ranking': false, player: false } });
  expect(config.modules.team).toBe(true); expect(config.modules['ranking-detail']).toBe(true); expect(config.modules['valve-ranking-detail']).toBe(true);
  expect(config.modules.ranking).toBe(false); expect(config.modules['valve-ranking']).toBe(false); expect(config.maps).toBe('en');
});

it('战队七个标签页、FAQ/表格/统计/转会文本汉化，实体与原节点保持', () => {
  const { run, engine } = setup('team-profile', '/team/7020/spirit');
  const nodes = [...document.querySelectorAll('*')]; const urls = [...document.querySelectorAll('[href]')].map(e => e.getAttribute('href'));
  const player = document.querySelector('a[href="/player/16920/sh1ro"]')!; const playerHTML = player.outerHTML;
  const news = document.querySelector('.subTab-newsArticle')!; const newsText = news.textContent;
  run();
  expect([...document.querySelectorAll('.teamProfile .tab')].map(e => e.textContent)).toEqual(['资料', '阵容', '比赛', '赛事', '成就', '新闻', '数据']);
  expect(text('.profile-team-stat > b')).toBe('世界排名'); expect(text('.regional-name-full')).toBe('V社排名');
  expect(text('.ranking-info .sub-title')).toBe('当前排名'); expect(text('.ranking-info .value.h-rank')).toBe('#1');
  expect([...document.querySelectorAll('.ranking-info .value.h-rank')].map(e => e.textContent)).toContain('24 周');
  expect(text('.faq-question')).toBe('谁效力于 Spirit？'); expect(text('.faq-answer')).toContain('Spirit 的主力阵容是');
  expect(text('.major-stickers-header > h2')).toBe('贴纸：IEM Cologne Major 2026');
  expect([...document.querySelectorAll('#rosterBox .standard-headline')].map(e => e.textContent)).toContain('队员 （Spirit）统计包含该阵容时期的全队数据 *');
  expect(text('.player-status')).toBe('首发'); expect(text('.sub-headline')).toBe('执教期间全队数据'); expect(text('.disclaimer')).toContain('此前的效力阶段不计入');
  expect(text('#matchesBox > .standard-headline')).toBe('Spirit 的比赛数据'); expect(text('#eventsBox .standard-headline')).toBe('Spirit 进行中及即将参加的赛事与联赛');
  expect(text('#achievementsBox .standard-headline')).toBe('Spirit 的 Major 成就明细'); expect(text('#newsBox .standard-headline')).toBe('提及 Spirit 的新闻');
  expect(text('#statsBox > .standard-headline')).toBe('Spirit 最近 5 场比赛'); expect(text('.map-statistics-row-map-mapname')).toBe('远古遗迹');
  expect([...document.querySelectorAll('#statsBox .moreButton')].map(e => e.textContent)).toContain('炽热沙城 的数据记录');
  expect(text('.profile-team-name')).toBe('Spirit'); expect(text('.team-country')).toBe('Russia'); expect(player.outerHTML).toBe(playerHTML); expect(news.textContent).toBe(newsText);
  expect(text('.newstext')).toBe('Ranking details for Spirit Event Recency'); expect(document.querySelector<HTMLInputElement>('input')!.value).toBe('Spirit');
  expect([...document.querySelectorAll('*')]).toEqual(nodes); expect([...document.querySelectorAll('[href]')].map(e => e.getAttribute('href'))).toEqual(urls);
  const writes = engine.metrics.writes; run(); expect(engine.metrics.writes).toBe(writes); expect(engine.metrics.errors).toBe(0);
});

it('战队更新、同名实体保护、地图偏好与关注伪元素独立恢复', () => {
  const { run, engine } = setup('team-profile', '/team/7020/spirit'); run();
  document.querySelector('.profile-team-name')!.textContent = 'Mirage'; document.querySelector('.profile-team-name')!.setAttribute('title', 'Dust2');
  document.querySelector('.profile-team-logo-container img')!.setAttribute('alt', 'Nuke');
  const heading = document.querySelector('#statsBox > .standard-headline')!.firstChild!; heading.nodeValue = "Mirage's last 7 matches"; run();
  expect(heading.nodeValue).toBe('Mirage 最近 7 场比赛'); expect(text('.profile-team-name')).toBe('Mirage'); expect(document.querySelector('.profile-team-name')!.getAttribute('title')).toBe('Dust2');
  expect(document.querySelector('.profile-team-logo-container img')!.getAttribute('alt')).toBe('Nuke');
  const config = defaults(); config.maps = 'en'; engine.configure(config); run(); expect([...document.querySelectorAll('#statsBox .moreButton')].map(e => e.textContent)).toContain('Dust2 的数据记录');
  const button = document.querySelector('.fanbutton')!; const url = button.getAttribute('data-url'); playerStyle(document, 'team', config);
  expect(document.getElementById('hltv-zh-player-style')!.textContent).toContain('取消关注'); expect(button.getAttribute('data-url')).toBe(url);
  config.modules.team = false; engine.configure(config); playerStyle(document, 'team', config); run();
  expect(heading.nodeValue).toBe("Mirage's last 7 matches"); expect(text('.teamProfile .tab')).toBe('Info'); expect(document.getElementById('hltv-zh-player-style')).toBeNull(); expect(text('.nav-link')).toBe('新闻');
});

it('HLTV 排名明细标题、分项/表头/名次汉化，数值及排序属性保护', () => {
  const { run, engine } = setup('hltv-ranking-detail', '/ranking/teams/2026/october/5/details/7020');
  const nodes = [...document.querySelectorAll('*')]; const first = document.querySelector('tbody td')!; const sort = first.getAttribute('data-sort');
  const event = document.querySelector('a[href^="/events/"]')!; const original = event.outerHTML;
  run(); expect(text('.ranking-details > .standard-headline')).toBe('Spirit 的 HLTV 排名计算明细');
  expect([...document.querySelectorAll('table:first-of-type th')].map(e => e.textContent)).toEqual(['#', '赛事', '阵容', '相关度']); expect(first.textContent).toBe('第1名'); expect(first.getAttribute('data-sort')).toBe(sort);
  expect(text('.statsCenterTextHighlighted')).toBe('85.2%'); expect(event.outerHTML).toBe(original); expect(text('table.no-sort tbody td')).toContain('Spirit');
  expect([...document.querySelectorAll('.standard-headline')].map(e => e.textContent)).toContain('计入状态分项排名的比赛'); expect([...document.querySelectorAll('*')]).toEqual(nodes);
  const config = defaults(); config.modules.ranking = false; engine.configure(config); run(); expect(first.textContent).toBe('第1名');
  config.modules['ranking-detail'] = false; engine.configure(config); run(); expect(first.textContent).toBe('1st'); expect(text('.nav-link')).toBe('新闻');
});

it('V社五个分项、完整解释及上限说明翻译，日期/数据/实体/初始化属性保持', () => {
  const { run, engine } = setup('valve-ranking-detail', '/valve-ranking/teams/details/2026/october/8');
  const nodes = [...document.querySelectorAll('*')]; const tabs = [...document.querySelectorAll('.detail-box')].map(e => e.getAttribute('detail-matches-show-id'));
  const date = text('td.date'); const opponent = document.querySelector('table.vrs-details tbody td:nth-child(2)')!; const original = opponent.outerHTML;
  run(); expect(text('.valve-ranking-details > .standard-headline')).toBe('Spirit 的V社排名详情（2026年10月8日）'); expect(text('.points')).toContain('(2003 V社 积分)');
  expect([...document.querySelectorAll('.detail-box .detail-head')].map(e => e.textContent)).toEqual(['线下胜场', '对手网络对手网络', '提供悬赏', '收获悬赏', '历史交锋交锋']);
  expect(text('.tooltip-box.tooltip-attributes')).toBe('所有战队额外获得 400 点初始积分。'); expect(text('table.vrs-details th.recency')).toBe('时效权重');
  expect(text('.detail-explain')).toContain('最近 10 场线下胜利'); expect([...document.querySelectorAll('.detail-explain')].map(e => e.textContent).join('')).toContain('每次计算排名时');
  expect([...document.querySelectorAll('.details-matches')].map(e => [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.nodeValue).join('')).join('')).toContain('第五高的得分');
  expect(text('td.date')).toBe(date); expect(opponent.outerHTML).toBe(original); expect([...document.querySelectorAll('.detail-box')].map(e => e.getAttribute('detail-matches-show-id'))).toEqual(tabs); expect([...document.querySelectorAll('*')]).toEqual(nodes);
  const heading = document.querySelector('.valve-ranking-details > .standard-headline')!.firstChild!; heading.nodeValue = 'Ranking details for Mirage on 9 Oct 2026'; run(); expect(heading.nodeValue).toBe('Mirage 的V社排名详情（2026年10月9日）');
  const config = defaults(); config.modules['valve-ranking'] = false; engine.configure(config); run(); expect(text('.detail-head')).toBe('线下胜场');
  config.modules['valve-ranking-detail'] = false; engine.configure(config); run(); expect(heading.nodeValue).toBe('Ranking details for Mirage on 9 Oct 2026'); expect(text('.points')).toContain('(2003 valve points)'); expect(text('.nav-link')).toBe('新闻'); expect(engine.metrics.errors).toBe(0);
});
