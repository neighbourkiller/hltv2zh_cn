import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { rankingLabels, rankingMonths, rankingNavigation, rankingRegions } from '../locales/zh-CN/ranking';
import { valveLabels, valveRegions, vrsLabels } from '../locales/zh-CN/valve-ranking';
import { dateText } from './templates';

function navigationRules(module: 'valve-ranking' | 'vrs-invites'): Rule[] {
  return [
    exact(`${module}.navigation`, module, '.nav > .navItem, .nav > .navItem > .gtSmartphone-only', rankingNavigation),
    exact(`${module}.hltv-regions`, module, '#ranking-region-selector > .sub-region-name, #ranking-region-selector > .ranking-country > a', rankingRegions),
  ];
}

/** 2026-10-08 全球/欧洲实页；各层均只改直属 Text，不覆盖 Beta 或积分的 span。 */
export const valveRankingRules: Rule[] = [
  ...navigationRules('valve-ranking'),
  exact('valve-ranking.regions', 'valve-ranking', '#valve-region-selector .sub-region-valve-name, .ranked-team .teamLine > .region', valveRegions),
  exact('valve-ranking.labels', 'valve-ranking', '.regional-beta-icon, .filter-column-content .vrs-ranking-button, .ranking-description, .description-box, .description-box > h1, .description-box > h2', valveLabels),
  exact('valve-ranking.old-roster', 'valve-ranking', '.old-roster-symbol .tooltip-box, .tooltip-box.tooltip-attributes', valveLabels),
  exact('valve-ranking.buttons', 'valve-ranking', '.ranked-team .more > a.moreLink[href^="/team/"], .ranked-team .more > a.moreLink[href^="/valve-ranking/teams/"]', rankingLabels),
  exact('valve-ranking.filters', 'valve-ranking', '.sidebar-headline, .filter-column-header', rankingLabels),
  exact('valve-ranking.months', 'valve-ranking', '.filter-column-content a.sidebar-single-line-item[href^="/valve-ranking/teams/"]', rankingMonths),
  exact('valve-ranking.point-brand', 'valve-ranking', '.ranked-team .teamLine > .points > .gtSmartphone-only', valveLabels),
  { id: 'valve-ranking.header', module: 'valve-ranking', selector: '.regional-ranking-header-text', translate: text => {
    let m = /^Valve global ranking on (.+)$/.exec(text);
    if (m) { const date = dateText(m[1]); return date ? `V社全球排名（${date}）` : undefined; }
    m = /^Valve Team ranking for (.+) on (.+)$/.exec(text);
    if (m) { const date = dateText(m[2]); return date ? `V社${rankingRegions[m[1]] ?? m[1]}战队排名（${date}）` : undefined; }
  } },
  { id: 'valve-ranking.points', module: 'valve-ranking', selector: '.ranked-team .teamLine > .points', translate: text => {
    if (/^points\)$/i.test(text)) return '积分)';
    const m = /^(\([\d,]+\s+)(?:Valve\s+)?points\)$/i.exec(text);
    return m ? `${m[1]}${/Valve/i.test(text) ? 'V社 ' : ''}积分)` : undefined;
  } },
  { id: 'valve-ranking.day', module: 'valve-ranking', selector: '.filter-column-content a.sidebar-single-line-item[href^="/valve-ranking/teams/"]', translate: text => {
    const m = /^(\d{1,2})(?:st|nd|rd|th)$/i.exec(text);
    return m && +m[1] >= 1 && +m[1] <= 31 ? `${m[1]}日` : undefined;
  } },
];

/** 邀请列表卡片的正式赛事名称、名额数字与 URL 保持原值。 */
export const vrsInviteRules: Rule[] = [
  ...navigationRules('vrs-invites'),
  exact('vrs-invites.labels', 'vrs-invites', 'h1.regional-ranking-header, .ranking-description, .ranking-vrs-event .ranking-grey', vrsLabels),
  exact('vrs-invites.regions', 'vrs-invites', '.ranking-vrs-event-spots-counts .rank-count > div:not(.count)', valveRegions),
  { id: 'vrs-invites.count', module: 'vrs-invites', selector: '.ranking-vrs-event .ranking-grey', translate: text => {
    const m = /^(\d+) invites?$/i.exec(text); return m ? `${m[1]} 个邀请名额` : undefined;
  } },
  { id: 'vrs-invites.date', module: 'vrs-invites', selector: '.ranking-vrs-event-date', translate: dateText },
];
