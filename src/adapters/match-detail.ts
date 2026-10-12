import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { statisticsTitles } from '../locales/zh-CN/statistics';

/** 仅匹配独立 UI Text，倒计时/票数/选手链接不重建。未知句式保持英文。 */
export function voteText(text: string): string | undefined {
  const result = /^won with (\d+(?:\.\d+)?)% of the votes$/i.exec(text);
  if (result) return `以 ${result[1]}% 的得票率获胜`;
  if (/^Vote ends in:$/i.test(text)) return '投票倒计时：';
}

export const matchDetailRules: Rule[] = [
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
