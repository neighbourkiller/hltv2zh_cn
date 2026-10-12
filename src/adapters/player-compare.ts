import { exact, normalize } from '../core/rules';
import type { Rule, Settings } from '../core/types';
import { maps } from '../locales/zh-CN/matches';
import { compareLabels, compareNavigation } from '../locales/zh-CN/player-compare';
import { mapName } from './maps';

const labels = new Map(Object.entries(compareLabels).map(([key, value]) => [normalize(key), value]));
/** 筛选摘要是一个 Text，只有三项均为已知筛选文案时才处理。 */
export function compareFilterText(source: string, settings: Settings): string | undefined {
  const parts = source.split(',').map(part => part.trim());
  if (parts.length !== 3) return;
  const [time, match, map] = parts;
  if (!/^(?:All Time|Past month|Past 3 months|\d{4})$/i.test(time)
    || !/^(?:All matches|Majors|Big events|MVP events|LAN|Online)$/i.test(match)
    || !(normalize(map) === 'all maps' || maps[map.toLowerCase()] || /^(Season|Tuscan)$/i.test(map))) return;
  return [labels.get(normalize(time)) ?? time, labels.get(normalize(match)),
    normalize(map) === 'all maps' ? compareLabels['All Maps'] : (mapName(map, settings) ?? map)].join('，');
}

/** 2026-10-08 完整双选手对比和空白选择页实测 DOM，图表/实体/数值不作为翻译目标。 */
export const playerCompareRules: Rule[] = [
  exact('compare.labels', 'player-compare', [
    '.stats-player-compare .filter-selector > option', '.stats-player-compare .stat-row-name',
    '.stats-player-compare .stat-name-col', '.stats-player-compare .standard-headline',
    '.stats-player-compare .player-and-filter > span', '.stats-player-compare .remove-player-link',
  ].join(','), compareLabels),
  exact('compare.navigation', 'player-compare', '.sidebar-con .sidebar-headline, .sidebar-con .sidebar-single-line-item, .sidebar-con .sidebar-single-line-item > span', compareNavigation),
  exact('compare.placeholder', 'player-compare', '.stats-player-compare .player-search-input', { 'Search player': '搜索选手' }, 'placeholder'),
  { id: 'compare.map-count', module: 'player-compare', selector: '.stats-player-compare .selector-map-count', translate: text => {
    const m = /^Based on (\d[\d,]*) maps?$/.exec(text); return m ? `基于 ${m[1]} 张地图` : undefined;
  } },
  { id: 'compare.filters', module: 'player-compare', selector: '.stats-player-compare .filter-text', translate: compareFilterText },
  { id: 'compare.diagram', module: 'player-compare', selector: '.stats-player-compare .diagram-info', translate: text => {
    const m = /^Sliding window of rating (\d+\.\d+)(?: for matches in the past (\d+) months)? - 1 day increments$/i.exec(text);
    return m ? `${m[2] ? `最近 ${m[2]} 个月比赛的 ` : ''}Rating ${m[1]} 滑动窗口，每次递进 1 天` : undefined;
  } },
];
