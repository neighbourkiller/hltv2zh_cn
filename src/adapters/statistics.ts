import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { statsLabels } from '../locales/zh-CN/player-stats';
import { playerTooltips } from '../locales/zh-CN/player-tooltips';
import { statsText } from './players';
import { statisticsTitles, specialtyLabels } from '../locales/zh-CN/statistics';

const labels = {
  ...statsLabels, ...specialtyLabels, 'Top players': '顶尖选手', 'Top teams': '顶尖战队', 'Top weapons': '常用武器',
  'Ranking (both teams)': '排名（双方战队）', 'Ranking filter': '排名筛选',
  Aces: '五杀', 'Distribution of maps played': '出场地图分布',
  'Distribution of T / CT wins on maps': '各地图 T / CT 胜场分布',
  'Min. maps:': '最少地图数：', 'Player': '选手', 'KPR': '每回合击杀', KAST: '不白给率',
  Country: '国家/地区', Gender: '性别', Age: '年龄', Men: '男子', Women: '女子', 'Min age': '最低年龄', 'Max age': '最高年龄',
};
const slots = [
  '.stats-sub-navigation-title > .tab-title', '.stats-sub-navigation-title select > option',
  '.stats-sub-navigation-simple-filter-map', '.stats-sub-navigation-simple-filter-version > a',
  '.sidebar-con .sidebar-headline', '.sidebar-con .sidebar-single-line-item', '.sidebar-con .sidebar-single-line-item > span',
  '.sidebar-con .filter-column-header', '.sidebar-con .filter-column-map-count-con > .text-ellipsis',
  '.sidebar-con .filter-column-age-con > .text-ellipsis', '.sidebar-con .filter-column-min-map-count-con > .text-ellipsis',
  '.legacy-stats-section-button', '.stats-section .standard-headline', '.top-x-box .average', '.stats-section .context-button',
  '.stats-section th', '.stats-section th > a', '.stats-section th > span',
  '.stats-section .stats-top-menu-item, .stats-section .stats-top-menu-item-link',
  '.stats-section .toggle-fast-multi-kills-only, .stats-section .toggle-fast-multi-kills-only > a',
  '.stats-section .tooltip-attributes > b',
  '.tooltip-box.tooltip-attributes > b',
].join(',');
/** 已核对 /stats?event 和 /stats/maps?event；其他统计页复用同结构基础控件。 */
export const statisticsRules: Rule[] = [
  exact('statistics.labels', 'statistics', slots, labels),
  { id: 'statistics.templates', module: 'statistics', selector: `${slots}, .pagination-data`, translate: text => /^Rating\b/i.test(text) ? undefined : statsText(text) },
  exact('statistics.live', 'statistics', '.event-hub-indicator', { Live: '进行中' }),
  exact('statistics.search', 'statistics', '.search-input-con input', { 'Add to context..': '加入选手对比…' }, 'placeholder'),
  exact('statistics.tooltips', 'statistics', '.sidebar-single-line-item[title]', playerTooltips, 'title'),
  exact('statistics.table-titles', 'statistics', '.stats-section th[title], .stats-section th > span[title]', statisticsTitles, 'title'),
  exact('statistics.expanded-tooltips', 'statistics', '.stats-section .tooltip-box, .stats-section .tooltip-box > span, .tooltip-box.tooltip-attributes, .tooltip-box.tooltip-attributes > span', playerTooltips),
  exact('statistics.search-help', 'statistics', '.sidebar-con [title]', {
    'Search the stats section for teams, players and events, from here you can easily add them to your context.': '搜索数据专区的战队、选手和赛事，并将它们加入当前对比。',
  }, 'title'),
];
