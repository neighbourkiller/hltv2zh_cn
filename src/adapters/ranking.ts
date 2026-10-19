import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { rankingDescription, rankingLabels, rankingMonths, rankingNavigation, rankingRegions } from '../locales/zh-CN/ranking';
import { dateText, ordinalDay } from './templates';

/** 核对于 2026-10-05 世界/欧洲排名实页；保留双端 span、图片和原 Text。 */
export const rankingRules: Rule[] = [
  exact('ranking.navigation', 'ranking', '.nav > .navItem, .nav > .navItem > .gtSmartphone-only', rankingNavigation),
  exact('ranking.regions', 'ranking', '#ranking-region-selector > .sub-region-name, #ranking-region-selector > .ranking-country > a', rankingRegions),
  exact('ranking.buttons', 'ranking', '.ranked-team .more > a.moreLink[href^="/team/"], .ranked-team .more > a.moreLink[href^="/ranking/teams/"]', rankingLabels),
  exact('ranking.change', 'ranking', '.ranked-team .ranking-header > .change', rankingLabels),
  exact('ranking.filters', 'ranking', '.filter-column-headline, .sidebar-headline, .filter-column-header', rankingLabels),
  exact('ranking.months', 'ranking', '.filter-column-content a.sidebar-single-line-item[href^="/ranking/teams/"]', rankingMonths),
  exact('ranking.description', 'ranking', '.description-box, .description-box > h1, .description-box > h2', rankingDescription),
  { id: 'ranking.header', module: 'ranking', selector: '.regional-ranking-header-text', translate: text => {
    let m = /^Counter-Strike World ranking on (.+)$/.exec(text);
    if (m) { const date = dateText(m[1]); return date ? `反恐精英世界排名（${date}）` : undefined; }
    m = /^Team ranking for (.+) on (.+)$/.exec(text);
    if (m) { const date = dateText(m[2]); return date ? `${rankingRegions[m[1]] ?? m[1]}战队排名（${date}）` : undefined; }
  } },
  { id: 'ranking.points', module: 'ranking', selector: '.ranked-team .teamLine > .points', translate: text => {
    if (/^points\)$/i.test(text)) return '积分)';
    const m = /^(\([\d,]+\s+(?:HLTV\s+)?)points\)$/i.exec(text);
    return m ? `${m[1]}积分)` : undefined;
  } },
  { id: 'ranking.day', module: 'ranking', selector: '.filter-column-content a.sidebar-single-line-item[href^="/ranking/teams/"]', translate: ordinalDay },
];
