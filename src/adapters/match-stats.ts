import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { matchStatsLabels } from '../locales/zh-CN/match-stats';

/** Rating 及版本保留；仅替换已采样的三类标题，未知句式保持原样。 */
export function matchStatsText(text: string): string | undefined {
  const rating = /^(Team rating|Best rating|Performance - rating) (\d+(?:\.\d+)?)$/i.exec(text);
  if (rating) {
    const names: Record<string, string> = {
      'team rating': '战队 Rating', 'best rating': '最佳 Rating', 'performance - rating': '表现 - Rating',
    };
    return `${names[rating[1].toLowerCase()]} ${rating[2]}`;
  }
  const format = /^Best of (1|3|5)$/i.exec(text);
  if (format) return `BO${format[1]}`;
}

const slots = [
  '.stats-match .match-info-box', '.stats-match .match-info-box .small-text > .bold',
  '.stats-match .match-info-row > .bold', '.stats-match .match-page-link',
  '.stats-match .most-x-title', '.stats-match .standard-headline',
  '.stats-match .stats-match-map-result-mapname', '.stats-match .new-feature',
  '.stats-match .toggle-eco-adjusted', '.stats-match .ct-t-stats-container > .description',
  '.stats-match .all-stats', '.stats-match .t-stats-only > span', '.stats-match .ct-stats-only > span',
  '.stats-match th.st-roundSwing', '.stats-match .context-button',
].join(',');

/** 属于 statistics；不能复用只在 /matches/... 启用的 match-detail 模块。 */
export const matchStatsRules: Rule[] = [
  exact('match-stats.labels', 'statistics', slots, matchStatsLabels),
  { id: 'match-stats.templates', module: 'statistics', selector: slots, translate: matchStatsText },
  { id: 'statistics.ranking-filter-title', module: 'statistics', selector: '.sidebar-con .sidebar-single-line-item[title]', target: 'title', translate: text => {
    const m = /^Only maps where both teams were in the top (\d+) within 30 days \(before or after\) of the map$/.exec(text);
    return m ? `仅显示双方战队在该地图比赛前后 30 天内均位列前 ${m[1]} 名的地图` : undefined;
  } },
];
