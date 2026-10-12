import { exact } from '../core/rules';
import type { Rule, Settings } from '../core/types';
import { teamLabels, teamTransferLabels } from '../locales/zh-CN/teams';
import { valveRegions } from '../locales/zh-CN/valve-ranking';
import { rankingRegions } from '../locales/zh-CN/ranking';
import { dateText } from './templates';
import { mapName } from './maps';

const headings: Array<[RegExp, (name: string) => string]> = [
  [/^Team photos of (.+)$/, n => `${n} 的战队照片`], [/^All photos of players for (.+)$/, n => `${n} 队员的全部照片`],
  [/^Coach of (.+)$/, n => `${n} 的教练`], [/^Players of (.+)$/, n => `${n} 的队员`],
  [/^Roster timeline of (.+)$/, n => `${n} 的阵容时间线`], [/^Transfers for (.+)$/, n => `${n} 的转会记录`],
  [/^Match stats for (.+)$/, n => `${n} 的比赛数据`], [/^Upcoming matches for (.+)$/, n => `${n} 的近期赛程`],
  [/^Recent results for (.+)$/, n => `${n} 的近期赛果`], [/^See all results for (.+)$/, n => `查看 ${n} 的全部赛果`],
  [/^Ongoing & upcoming events and leagues for (.+)$/, n => `${n} 进行中及即将参加的赛事与联赛`],
  [/^Played events and leagues for (.+)$/, n => `${n} 已参加的赛事与联赛`], [/^All events attended by (.+)$/, n => `${n} 参加的全部赛事`],
  [/^Breakdown of (.+)'s Major achievements$/, n => `${n} 的 Major 成就明细`], [/^Breakdown of (.+)'s LAN achievements$/, n => `${n} 的线下赛成就明细`],
  [/^News posts mentioning (.+)$/, n => `提及 ${n} 的新闻`], [/^All stats for (.+)$/, n => `${n} 的全部数据`],
];
export function teamText(text: string, settings: Settings): string | undefined {
  for (const [pattern, render] of headings) { const m = pattern.exec(text); if (m) return render(m[1]); }
  let m = /^Stickers:\s*(.+)$/.exec(text); if (m) return `贴纸：${m[1]}`;
  m = /^(?:of|for) (.+)$/.exec(text); if (m) return `（${m[1]}）`; // 标题的独立窄屏 span。
  m = /^(.+)'s last (\d+) matches$/.exec(text); if (m) return `${m[1]} 最近 ${m[2]} 场比赛`;
  m = /^News posts from (\d{4})$/.exec(text); if (m) return `${m[1]} 年的新闻`;
  m = /^(\d+) (weeks?|months?|years?|days?)$/.exec(text);
  if (m) return `${m[1]} ${({ week: '周', month: '个月', year: '年', day: '天' } as Record<string, string>)[m[2].replace(/s$/, '')]}`;
  m = /^(\d+)(?:[-–](\d+))?(?:st|nd|rd|th)$/.exec(text); if (m) return `第 ${m[1]}${m[2] ? '–' + m[2] : ''} 名`;
  m = /^Stats history on (.+)$/.exec(text); if (m) return `${mapName(m[1], settings) ?? m[1]} 的数据记录`;
  m = /^(\d+(?:\.\d+)?%) of ([\d,]+)$/.exec(text); if (m) return `${m[2]} 次机会中的 ${m[1]}`;
  // FAQ 按原文本节点翻译；选手/对手链接保留，不合并父容器。
  m = /^Who plays for (.+)\?$/.exec(text); if (m) return `谁效力于 ${m[1]}？`;
  m = /^What is (.+)'s current world rank\?$/.exec(text); if (m) return `${m[1]} 当前的世界排名是多少？`;
  m = /^Upcoming matches for (.+)\?$/.exec(text); if (m) return `${m[1]} 接下来有哪些比赛？`;
  m = /^The main lineup of (.+) is$/.exec(text); if (m) return `${m[1]} 的主力阵容是`;
  m = /^(.+) is currently$/.exec(text); if (m) return `${m[1]} 当前`;
  if (text === 'in our world ranking') return '在我们的世界排名中';
  m = /^ranked #(\d+)$/.exec(text); if (m) return `排名第 ${m[1]} 名`;
  m = /^The next matches for (.+) will be against:$/.exec(text); if (m) return `${m[1]} 接下来将对阵：`;
  if (text === 'vs.' || text === 'vs') return '对阵';
}
const slots = '.teamProfile .tab, .teamProfile .profile-team-stat > b, .teamProfile .regional-name-full, .teamProfile .core-chart, .teamProfile .team-chart, .teamProfile .standard-headline, .teamProfile .standard-headline > h2, .teamProfile .standard-headline > .gtSmartphone-only, .teamProfile .ranking-info .sub-title, .teamProfile th, .teamProfile th > span, .teamProfile .sub-headline, .teamProfile .player-status, .teamProfile .stat-name, .teamProfile .description, .teamProfile .stat-timespan, .teamProfile .sub-navigation-link, .teamProfile .moreButton, .teamProfile .matchpage-button, .teamProfile .stats-button, .teamProfile .achievement, .teamProfile .highlighted-match-status, .teamProfile .map-statistics-extended-sub-header, .teamProfile .map-statistics-extended-highlight-veto-container, .teamProfile .map-statistics-extended-highlight-veto > div, .teamProfile .map-statistics-extended-general-stat > div, .teamProfile .show-all-stickers-button, .teamProfile .toggle, .teamProfile .transfers-tabs > div, .teamProfile .disclaimer';
export const teamRules: Rule[] = [
  exact('team.labels', 'team', slots, teamLabels),
  { id: 'team.templates', module: 'team', selector: slots, translate: teamText },
  { id: 'team.duration', module: 'team', selector: '.teamProfile .ranking-info .value, .teamProfile .players-cell.center-cell.opacity-cell', translate: teamText },
  exact('team.transfer', 'team', '.teamProfile .transfer-movement, .teamProfile .transfer-team-no-team', teamTransferLabels),
  { id: 'team.dates', module: 'team', selector: '.teamProfile .transfer-date, .teamProfile .date-cell, .teamProfile .faq-answer [data-time-format]', translate: dateText },
  { id: 'team.faq', module: 'team', selector: '.teamProfile .faq-question, .teamProfile .faq-answer span, .teamProfile .faq-answer a[href^="/ranking/teams/"]', translate: teamText },
  exact('team.regions', 'team', '.teamProfile .regional-rank-region', valveRegions),
  { id: 'team.nested-heading', module: 'team', selector: '.teamProfile .standard-headline > h2 > .gtSmartphone-only', translate: teamText },
  { id: 'team.timeline-month', module: 'team', selector: '.teamProfile .timeline-month-label > span', translate: text => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const index = months.findIndex(m => m.toLowerCase() === text.toLowerCase()); return index >= 0 ? `${index + 1}月` : undefined;
  } },
  { id: 'team.rank-tooltip', module: 'team', selector: '.teamProfile .regional-rank[title]', target: 'title', translate: text => {
    const m = /^#(\d+) in (.+) on the (Valve|HLTV) ranking$/.exec(text);
    return m ? `${rankingRegions[m[2]] ?? m[2]}${m[3] === 'Valve' ? 'V社' : 'HLTV'}排名第 ${m[1]} 名` : undefined;
  } },
];
