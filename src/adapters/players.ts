import type { Rule } from '../core/types';
import { exact } from '../core/rules';
import { roles, profileLabels } from '../locales/zh-CN/players';
import { statsLabels } from '../locales/zh-CN/player-stats';
import { playerTooltips } from '../locales/zh-CN/player-tooltips';
import { dateText } from './templates';
import { specialtyLabels, statisticsTitles } from '../locales/zh-CN/statistics';

/** 2026-10-08 实页 DOM；所有模板限定界面槽位，捕获的选手名原样保留。 */
const profileHeadings: Array<[RegExp, (name: string) => string]> = [
  [/^(.+) statistics$/, n => `${n} 的数据`],
  [/^Team stats for (.+)$/, n => `${n} 的战队数据`],
  [/^Breakdown of (.+)'s teams$/, n => `${n} 的战队履历`],
  [/^Timeline of (.+)'s teams$/, n => `${n} 的战队时间线`],
  [/^Upcoming matches for (.+)$/, n => `${n} 的近期赛程`],
  [/^Latest results for (.+)$/, n => `${n} 的近期赛果`],
  [/^Major achievements for (.+)$/, n => `${n} 的 Major 成就`],
  [/^LAN achievements for (.+)$/, n => `${n} 的线下赛成就`],
  [/^Breakdown of (.+)'s major achievements$/, n => `${n} 的 Major 成就明细`],
  [/^Breakdown of (.+)'s LAN achievements$/, n => `${n} 的线下赛成就明细`],
  [/^Trophy overview for (.+)$/, n => `${n} 的奖杯概览`],
  [/^All (.+)'s trophies$/, n => `${n} 的全部奖杯`],
  [/^MVP overview for (.+)$/, n => `${n} 的 MVP 概览`],
  [/^All (.+)'s MVP medals$/, n => `${n} 的全部 MVP 奖章`],
  [/^EVP overview for (.+)$/, n => `${n} 的 EVP 概览`],
  [/^All events where (.+) was an EVP$/, n => `${n} 获得 EVP 的全部赛事`],
  [/^Top 20 overview for (.+)$/, n => `${n} 的年度 TOP 20 概览`],
  [/^HLTV awards overview for (.+)$/, n => `${n} 的 HLTV 奖项概览`],
  [/^News posts mentioning (.+)$/, n => `提及 ${n} 的新闻`],
  [/^All time stats for (.+)$/, n => `${n} 的生涯数据`],
  [/^(.+)'s active FPL season$/, n => `${n} 当前 FPL 赛季`],
  [/^(.+)'s inventory$/, n => `${n} 的库存`],
  [/^(.+)'s skins$/, n => `${n} 的皮肤`],
  [/^(.+)'s loadout$/, n => `${n} 的装备`],
  [/^Pictures of (.+)$/, n => `${n} 的照片`],
  [/^Complete statistics for (.+)$/, n => `${n} 的完整数据`],
  [/^All photos of (.+)$/, n => `${n} 的全部照片`],
  [/^See all results for (.+)$/, n => `查看 ${n} 的全部赛果`],
  [/^Not sure how to pronounce (.+)\?$/, n => `不知道 ${n} 的名字如何发音？`],
];
export function playerText(text: string): string | undefined {
  for (const [pattern, translate] of profileHeadings) {
    const m = pattern.exec(text); if (m) return translate(m[1]);
  }
  let m = /^News posts from (\d{4})$/.exec(text);
  if (m) return `${m[1]} 年的新闻`;
  m = /^Stickers:\s*(.+)$/.exec(text); if (m) return `贴纸：${m[1]}`;
  m = /^(.+) Collection$/.exec(text); if (m) return `${m[1]} 收藏`;
  m = /^(?:\((?:Past (\d+) months? • )?)(\d[\d,]*) maps\)$/.exec(text);
  if (m) return `(${m[1] ? `最近 ${m[1]} 个月 • ` : ''}${m[2]} 张地图)`;
  m = /^(\d+) years?$/.exec(text); if (m) return `${m[1]} 岁`;
  m = /^(\d+) weeks?$/.exec(text); if (m) return `${m[1]} 周`;
  m = /^(?:(\d+)\s+)?x Major (winner|MVP)$/.exec(text);
  if (m) return `${m[1] ? `${m[1]} ` : ''}次 Major ${m[2] === 'winner' ? '冠军' : 'MVP'}`;
  m = /^(\d+)(?:-(\d+))?(?:st|nd|rd|th)$/.exec(text);
  if (m) return `第 ${m[1]}${m[2] ? `–${m[2]}` : ''} 名`;
  m = /^#(\d+) best player in (\d{2})$/.exec(text); if (m) return `20${m[2]} 年度第 ${m[1]} 名选手`;
  m = /^(.+) has no stats for the active FPL season, check back later\.$/.exec(text);
  if (m) return `${m[1]} 当前 FPL 赛季暂无数据，请稍后查看。`;
  m = /^We didn't record any (trophies|achievements) for (.+) during their career\.$/.exec(text);
  if (m) return `尚未记录 ${m[2]} 职业生涯中的${m[1] === 'trophies' ? '奖杯' : '成就'}。`;
}
export function statsText(text: string): string | undefined {
  let m = /^Rating\s*(\d+\.\d+)?$/i.exec(text);
  if (m) return `评分${m[1] ? ` ${m[1]}` : ''}`;
  m = /^Top (5|10|20|30|50)$/.exec(text); if (m) return `前 ${m[1]} 名`;
  m = /^vs top (5|10|20|30|50) opponents$/.exec(text); if (m) return `对阵排名前 ${m[1]} 的对手`;
  m = /^(\(?)(\d[\d,]*) maps(\)?)$/.exec(text); if (m) return `${m[1]}${m[2]} 张地图${m[3]}`;
  m = /^(\d+) kill rounds$/.exec(text); if (m) return `${m[1]} 杀回合数`;
  m = /^1 on ([1-5])$/.exec(text); if (m) return `1 对 ${m[1]}`;
  m = /^([2-5])x (fast )?multi-kills$/.exec(text); if (m) return `${m[1]} 杀${m[2] ? '快速' : ''}多杀次数`;
  m = /^(\d+)\s*-\s*(\d+) of ([\d,]+)$/.exec(text); if (m) return `第 ${m[1]}–${m[2]} 条，共 ${m[3]} 条`;
  m = /^(Match history|Event history|All clutch history|[1-5] on [1-5] clutch history|[2-5]x multi-kill history|All multi-kill history|Career rating [\d.]+) for (.+)$/.exec(text);
  if (m) {
    const title = ({ 'Match history': '比赛记录', 'Event history': '赛事记录', 'All clutch history': '全部残局记录', 'All multi-kill history': '全部多杀记录' } as Record<string, string>)[m[1]]
      ?? m[1].replace(/^Career rating ([\d.]+)$/, '生涯评分 $1').replace(/^([2-5])x multi-kill history$/, '$1 杀记录').replace(/^([1-5]) on ([1-5]) clutch history$/, '$1 对 $2 残局记录');
    return `${m[2]} 的${title}`;
  }
  m = /^Sliding window of rating (\d+\.\d+)( for matches in the past (\d+) months)? - 1 day increments$/.exec(text);
  if (m) return `${m[3] ? `最近 ${m[3]} 个月比赛的` : ''}评分 ${m[1]} 滑动窗口，每次递进 1 天`;
  m = /^Only maps against an opponent that was in the top (5|10|20|30|50) of the HLTV ranking at the time of the map$/.exec(text);
  if (m) return `仅显示对阵当时 HLTV 排名前 ${m[1]} 对手的地图`;
}

const profileSlots = '.playerProfile .primaryRole, .playerProfile .listLeft, .playerProfile .listLeft > span, .playerProfile .tab, .playerProfile .sub-navigation-link, .playerProfile .standard-headline, .playerProfile .description, .playerProfile th, .playerProfile .stats-button, .playerProfile .moreButton, .playerProfile .skins-weapon-column > h3, .skins-link-button > a, .skins-loadout-button, .skins-inventory-button, .show-all-stickers-button, .playerProfile .tooltip-box, .playerProfile .trophy-event';
const statsSlots = '.stats-sub-navigation-title > .tab-title, .stats-sub-navigation-title select > option, .stats-sub-navigation-simple-filter-map, .stats-sub-map > a, .stats-top-menu-item, .sidebar-headline, .sidebar-single-line-item, .sidebar-single-line-item > span, .sidebar-single-line-item .sub-tab, .filter-column-header, .filter-column-map-count-con > .text-ellipsis, .legacy-stats-section-button, .context-button, .player-summary-stat-box-left-btn, .showPlayerAverage > span, .player-summary-stat-box-side-rating-text, .player-summary-stat-box-rating-text, .player-summary-stat-box-breakdown-description, .player-summary-stat-box-data-text, .player-summary-tooltip > b, .player-summary-avg-text, .stats-side-selector-wrapper > div, .stats-side-selector, .stats-side-selector > span, .stats-round-toggler-wrapper, .stats-round-toggle, .role-stats-section-title, .role-stats-title, .stats-row > span:first-child, .stats-row > span:first-child > span, .stats-section .standard-headline, .stats-section .featured-sub-text, .stats-section .summary-box .description, .stats-section th, .stats-section th > a, .stats-section th > span, .stats-section td.won, .stats-section td.lost, .stats-section .opponents-location, .stats-section .toggle-fast-multi-kills-only';

const pageRules: Rule[] = [
  exact('stats.specialty-controls', 'player-stats', '.stats-section .toggle-fast-multi-kills-only > a, .tooltip-box.tooltip-attributes > b, .stats-top-menu-item-link', specialtyLabels),
  exact('stats.detached-attribute-tooltip', 'player-stats', '.tooltip-box.tooltip-attributes, .tooltip-box.tooltip-attributes > span', playerTooltips),
  exact('stats.specialty-titles', 'player-stats', '.stats-section th[title], .stats-section th > span[title]', statisticsTitles, 'title'),
  exact('player.labels', 'player', profileSlots, profileLabels),
  exact('player.roles', 'player', '.playerProfile .player-stat-top > b', roles),
  exact('player.placement', 'player', '.playerProfile .placement-cell .achievement', profileLabels),
  { id: 'player.collection', module: 'player', selector: '.playerProfile .lightbox-title', translate: playerText },
  { id: 'player.templates', module: 'player', selector: `${profileSlots}, .playerProfile .playerAge .listRight > span, .playerProfile .dob-popup-row > span, .playerProfile .stats-window, .playerProfile .majorWinner, .playerProfile .majorMVP, .playerProfile .placement-cell .achievement, .playerProfile .empty-state > span, .playerProfile .player-timeline-stat .value, .playerProfile b`, translate: playerText },
  { id: 'player.rating', module: 'player', selector: '.playerProfile .player-stat > b', translate: statsText },
  { id: 'player.dates', module: 'player', selector: '.playerProfile .time-period-cell > span, .playerProfile .dob-popup-row > span, .playerProfile .playerpage-match-date', translate: dateText },
  exact('player.present', 'player', '.playerProfile .time-period-cell', { '- Present': '– 至今', Present: '至今' }),
  exact('player.vs', 'player', '.playerProfile .playerpage-vs', { vs: '对阵' }),
  exact('player.pronunciation', 'player', '.playerProfile .player-pronunciation-box span', profileLabels),
  exact('player.partners', 'player', '.playerProfile .skins-partner-top, .playerProfile .skins-partner-bottom > div', profileLabels),
  { id: 'player.peak-time', module: 'player', selector: '.playerProfile .value.h-rank', translate: playerText },
  exact('stats.labels', 'player-stats', statsSlots, statsLabels),
  exact('stats.roles', 'player-stats', '.role-stats-section-title', roles),
  { id: 'stats.templates', module: 'player-stats', selector: `${statsSlots}, .rating-description, .rating-maps, .player-summary-stat-box-right-map-count, .pagination-data, .diagram-info, .stats-section .stats-row > span, .stats-section .stats-top-menu-item`, translate: statsText },
  { id: 'stats.age', module: 'player-stats', selector: '.player-summary-stat-box-left-player-age', translate: playerText },
  { id: 'stats.time-alive', module: 'player-stats', selector: '.role-stats-data', translate: text => {
    const m = /^(?:(\d+)m )?(\d+)s$/.exec(text); return m ? `${m[1] ? `${m[1]} 分 ` : ''}${m[2]} 秒` : undefined;
  } },
  exact('stats.placeholders', 'player-stats', '.search-input-con input[placeholder], .sidebar-box input[placeholder]', { 'Add to context..': '加入选手对比…', 'Search…': '搜索…' }, 'placeholder'),
  { id: 'stats.calendar-month', module: 'player-stats', selector: '.month-name', translate: dateText },
  exact('stats.calendar-days', 'player-stats', '.week-name > th', { su: '日', mo: '一', tu: '二', we: '三', th: '四', fr: '五', sa: '六' }),
  ...(['player', 'player-stats'] as const).flatMap(module => [
    exact(`${module}.tooltips`, module, module === 'player' ? '.playerProfile .tooltip-box' : '.player-summary-tooltip, .role-stats-section .tooltip-box, .stats-section .tooltip-box', playerTooltips),
    exact(`${module}.role-tooltip-labels`, module, '.tooltip-attributes > b', Object.fromEntries(Object.entries(roles).map(([k, v]) => [`${k}:`, `${v}：`]))),
    exact(`${module}.tooltip-titles`, module, '.stats-row[title], .role-stats-row[title], .sidebar-single-line-item[title]', playerTooltips, 'title'),
    { id: `${module}.ranking-tooltip`, module, selector: '.sidebar-single-line-item[title]', target: 'title' as const, translate: statsText },
  ]),
];

// 本文件槽位列表均为简单的逗号分隔选择器；拆成有界规则供引擎和 DOM 校验使用。
export const playerRules: Rule[] = pageRules.flatMap(rule => {
  if (rule.selector.length <= 1800) return [rule];
  const groups: string[] = [];
  for (const selector of rule.selector.split(',')) {
    const last = groups.length - 1;
    if (last >= 0 && groups[last].length + selector.length + 1 <= 1800) groups[last] += ',' + selector;
    else groups.push(selector);
  }
  return groups.map((selector, index) => ({ ...rule, id: `${rule.id}.${index + 1}`, selector }));
});
