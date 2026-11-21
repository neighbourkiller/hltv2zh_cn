import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { statisticsTitles } from '../locales/zh-CN/statistics';
import { matchDetailLabels, matchStreamLabels, simulatedVetoLabels } from '../locales/zh-CN/matches';
import { mapName } from './maps';

/** 仅匹配独立 UI Text，倒计时/票数/选手链接不重建。未知句式保持英文。 */
export function voteText(text: string): string | undefined {
  const result = /^won with (\d+(?:\.\d+)?)% of the votes$/i.exec(text);
  if (result) return `以 ${result[1]}% 的得票率获胜`;
  if (/^Vote ends in:$/i.test(text)) return '投票倒计时：';
}

export const matchDetailRules: Rule[] = [
  exact('detail.upcoming-controls', 'match-detail', [
    '.match-page .headline', '.allstargg-headline-prefix', '.matchpage-analytics-section .match-insight',
    '.analytics-center-button > span', '.analytics-center-button .gtSmartphone-only', '.analytics-center-button .smartphone-only',
    '.pick-a-winner-wrapper .pick-a-winner-pick-btn', '.map-stats-infobox-tab',
    '.past-matches-header .toggle-container > .toggle', '.mapholder .mapname', '.match-page .vrs-popup',
  ].join(','), matchDetailLabels),
  exact('detail.stream-controls', 'match-detail', [
    '.stream-filter-button-label', '.streams .all-streams', '.stream-filter-menu .stream-filter-section-title',
    '.stream-filter-menu .stream-filter-name', '.stream-filter-menu .stream-filter-hint',
    '.stream-filter-menu .stream-filter-no-match', '.stream-filter-menu .stream-filter-menu-footer',
  ].join(','), matchStreamLabels),
  exact('detail.stream-filter-title', 'match-detail', '.stream-filter-button[title]', {
    'Filter streams by platform and country': '按平台和国家/地区筛选直播',
  }, 'title'),
  ...(['placeholder', 'aria-label'] as const).map(target => exact(`detail.stream-search-${target}`, 'match-detail',
    '.stream-filter-menu input[data-stream-country-search]', { 'Search all countries': '搜索国家/地区' }, target)),
  exact('detail.veto-simulation-controls', 'match-detail', [
    '.simulated-veto-toggle', '.simulated-veto-title', '.simulated-veto-tab', '.simulated-veto-title option',
    '.simulated-veto-confidence-header', '.simulated-veto-chances-title',
  ].join(','), simulatedVetoLabels),
  { id: 'detail.veto-simulation-help', module: 'match-detail', selector: '.simulated-veto-tooltip', translate: text => {
    const step = /^How often this step happens just as shown, in ([\d,]+) simulated vetoes that also vary who starts\.?$/.exec(text);
    if (step) return `在 ${step[1]} 次改变先手方的禁选模拟中，该步骤按图示发生的比例。`;
    const maps = /^How likely each map is to be played at all in this match, in any order: the share of ([\d,]+) simulated vetoes that play it\. Unlike the tabs, it counts every way the veto can go\.?$/.exec(text);
    if (maps) return `在 ${maps[1]} 次禁选模拟中，各地图出场的比例。统计涵盖所有禁选方案，出场顺序不限。`;
  } },
  { id: 'detail.veto-simulation-step', module: 'match-detail', selector: '.simulated-veto-step > span:first-child', translate: (text, settings) => {
    const action = /^(removes|picks) (.+)$/.exec(text);
    if (action) return `${action[1] === 'removes' ? '禁用' : '选择'} ${mapName(action[2], settings) ?? action[2]}`;
    const decider = /^(\d+\. )(.+) is left over$/.exec(text);
    if (decider) return `${decider[1]}${mapName(decider[2], settings) ?? decider[2]} 剩余`;
  } },
  { id: 'detail.veto-simulation-summary', module: 'match-detail', selector: '.simulated-veto-maps-line', translate: (text, settings) => {
    const match = /^(.+) played in (\d+(?:\.\d+)?)% of simulations$/.exec(text);
    if (!match) return;
    const names = match[1].split(/,\s+(?:and\s+)?|\s+and\s+/).map(name => mapName(name, settings) ?? name);
    return `${names.join('、')}在 ${match[2]}% 的模拟中出场`;
  } },
  { id: 'detail.veto-simulation-map', module: 'match-detail', selector: '.simulated-map .mapname', translate: (text, settings) => {
    const match = /^(.+?)( - \d+(?:\.\d+)?%)$/.exec(text);
    if (!match) return;
    const translated = mapName(match[1], settings);
    if (translated) return translated + match[2];
  } },
  { id: 'detail.map-stats-period', module: 'match-detail', selector: '.match-page .headline-subtext', translate: text => {
    const match = /^Match lineup core winrate, past (\d+) months?, min\. (\d+) maps? played$/.exec(text);
    if (match) return `最近 ${match[1]} 个月核心阵容胜率，至少打过 ${match[2]} 张地图`;
  } },
  { id: 'detail.map-stats-opportunities', module: 'match-detail', selector: '.map-stats-infobox-maps-played > div', translate: text => {
    const match = /^(\d+) possibilit(?:y|ies)$/.exec(text);
    if (match) return `${match[1]} 次机会`;
  } },
  { id: 'detail.map-stats-opportunities-title', module: 'match-detail', selector: '.map-stats-infobox-maps-played > div[title]', target: 'title', translate: (text, settings) => {
    const match = /^% of (\d+) possibilit(?:y|ies) to (pick|ban) (.+)$/.exec(text);
    if (match) return `${match[1]} 次机会中${match[2] === 'pick' ? '选择' : '禁用'} ${mapName(match[3], settings) ?? match[3]} 的比例`;
  } },
  exact('detail.stats-controls', 'match-detail', '.match-page .toggle-eco-adjusted, .match-page .ct-t-stats-container .description, .match-page .all-stats, .match-page .t-stats-only > span, .match-page .ct-stats-only > span, .match-page .dynamic-map-name-full, .match-page .dynamic-map-name-short, .match-page a[href^="/stats/matches/"]', {
    'Eco-adjusted': '经济调整', 'Eco-adj': '经济调整', Side: '阵营', Both: '双方',
    Terrorist: 'T 方', 'Counter-Terrorist': 'CT 方', 'All maps': '全部地图', All: '全部',
    'Detailed stats': '详细数据', STATS: '数据',
  }),
  exact('detail.stats-headings', 'match-detail', '.match-page .potm-chart-stat', {
    Swing: '回合影响力', 'MK rating': '多杀评分',
  }),
  exact('detail.stats-compact-headings', 'match-detail', '.match-page .header-row > td', { Swing: '影响力' }),
  exact('detail.stats-titles', 'match-detail', '.match-page .header-row > td[title]', statisticsTitles, 'title'),
  exact('detail.top-player', 'match-detail', '.match-page .headline', { 'Top player in match': '本场最佳选手', 'Matches, past 3 months': '最近 3 个月的比赛' }),
  { id: 'detail.vote', module: 'match-detail', selector: '.match-page .headline > .subtext, .match-page .motm-countdown', translate: voteText },
  { id: 'detail.top-player-maps', module: 'match-detail', selector: '.match-page .potm-container .header-info', translate: text => {
    const m = /^\((\d+) maps?\)$/.exec(text); return m ? `(${m[1]} 张地图)` : undefined;
  } },
];

export const recommendedMatchRules: Rule[] = [
  exact('matches.recommendation', 'matches', '.starred-matches-description-tooltip, #for-you-empty-div, #for-you-empty-div > b', {
    'For you are a collection of matches that are either about to start, manually pinned, feature your favorite player(s) or team(s), or are related to your current location.': '为你推荐即将开始、手动置顶、包含你关注的选手或战队，或与你当前所在地相关的比赛。',
    'No matches for you yet.': '暂时没有为你推荐的比赛。',
    'Click the': '点击比赛旁的',
    'icon next to a match to pin them for easier access, or check back later': '图标即可置顶，方便查看；也可以稍后再来。',
  }),
];
