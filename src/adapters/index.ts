import type { Rule } from '../core/types';
import { exact } from '../core/rules';
import { navigation, placeholders, controls } from '../locales/zh-CN/common';
import { labels, filters, maps, lineupComparison } from '../locales/zh-CN/matches';
import { dateText, relativeTime } from './templates';
import { homeSidebarRules } from './home-sidebar';
import { playerRules } from './players';
import { eventDetailRules } from './event-detail';
import { playerCompareRules } from './player-compare';
import { mapRules, mapName } from './maps';
import { statisticsRules } from './statistics';
import { matchDetailRules, recommendedMatchRules } from './match-detail';
import { rankingRules } from './ranking';
import { valveRankingRules, vrsInviteRules } from './valve-ranking';
import { teamRules } from './teams';
import { hltvRankingDetailRules, valveRankingDetailRules } from './ranking-details';
import { transferRules } from './transfers';
import { fantasyRules } from './fantasy';

/** 选择器来自已抽样 DOM 或旧版；证据与遗漏见 docs/页面覆盖矩阵.md。 */
export const rules: Rule[] = [
  ...homeSidebarRules,
  ...playerRules,
  ...eventDetailRules,
  ...playerCompareRules,
  ...mapRules,
  ...statisticsRules,
  ...matchDetailRules,
  ...recommendedMatchRules,
  ...rankingRules,
  ...valveRankingRules,
  ...vrsInviteRules,
  ...teamRules,
  ...hltvRankingDetailRules,
  ...valveRankingDetailRules,
  ...transferRules,
  ...fantasyRules,
  exact('common.navigation', 'common', '.nav-link, .event-hub-link, .dropdown-link > .text-ellipsis', navigation),
  exact('common.controls', 'common', '.navsignin, .login-button, .remember-me label, .forgot-link, .nav-popup-elm > span, .nav-popup-elm .labelled-checkbox label', controls),
  exact('common.settings-options', 'common', '.nav-popup-elm .slider > span', { Day: '日间', Night: '夜间', Auto: '自动', Yes: '是', No: '否' }),
  exact('common.settings-titles', 'common', '.nav-popup-elm > span[title]', {
    'Choose a website theme.': '选择网站主题。',
    'Show/hide results in results section & on match pages.': '显示或隐藏赛果区与比赛页面的赛果。',
    'Choose timezone to adjust site-wide time displays.': '选择时区以调整全站时间显示。',
  }, 'title'),
  exact('common.placeholders', 'common', 'input[placeholder]', placeholders, 'placeholder'),
  exact('common.sidebar', 'common', '.standard-headline, .sidebar-headline, h1 > a, h1, .stream-box .title', {
    "TODAY'S MATCHES": '今日比赛', RESULTS: '赛果', 'RECENT ACTIVITY': '最新动态',
    'TOP 30 TRANSFERS': 'TOP 30 转会', RANKING: '排名', EVENTS: '赛事', GALLERIES: '图集',
    'TOP STREAMS': '热门直播', 'Now playing': '正在播放',
  }),
  exact('home.headings', 'home', '.newsheader', { "Today's news": '今日新闻', "Yesterday's news": '昨日新闻', 'Previous news': '此前新闻' }),
  { id: 'home.relative', module: 'home', selector: '.newsrecent', translate: relativeTime },
  { id: 'home.comments', module: 'home', selector: '.newstc > div', translate: text => {
    const m = /^(\d+) comments?$/i.exec(text); return m ? `${m[1]} 条评论` : undefined;
  } },
  exact('home.more', 'home', 'a.button-more[href^="/news/archive"], a[href="/transfers"]', { 'More news': '更多新闻', 'All transfers': '全部转会' }),
  exact('common.streams', 'common', '.streams-header, .streams-filter > span:not(.streams-filter-viewers)', {
    'Now playing': '正在播放', 'Top streams': '热门直播', All: '全部', Casters: '解说', Streamers: '主播', Organizers: '主办方',
  }),
  exact('matches.labels', 'matches', '.upcoming-headline, .matches-sidebar-filter-wrapper h3, #clear-all, .matches-sidebar-filter-title, .matches-sidebar-filter-clear-all, .matches-filter-name-text, .matches-filter-close-btn, .matches-quick-filters > *, .match-time, .match-meta, .starred-matches-title, .match-stage', labels),
  exact('matches.sort', 'matches', '.matches-sort-by-toggle, .matches-sort-by > span, .matches-sort-by-container > span', labels),
  exact('matches.calendar', 'matches', '.calendar-month, .calendar-day, [data-time-format="EEE"]', {
    January: '一月', February: '二月', March: '三月', April: '四月', May: '五月', June: '六月',
    July: '七月', August: '八月', September: '九月', October: '十月', November: '十一月', December: '十二月',
    Mon: '周一', Tue: '周二', Wed: '周三', Thu: '周四', Fri: '周五', Sat: '周六', Sun: '周日',
  }),
  exact('matches.why', 'matches', '.starred-matches-description > [data-tooltip-id], .starred-matches-description > [data-tooltip-id] > span', {
    'Why am I seeing': '为什么显示', 'these matches?': '这些比赛？', 'this?': '这些内容？',
  }),
  { id: 'matches.region', module: 'matches', selector: '.matches-filter-name-text', translate: text => {
    const m = /^(Europe|Asia|Americas|Oceania|Africa)\s*\((\d+)\)$/i.exec(text);
    const regions: Record<string, string> = { europe: '欧洲', asia: '亚洲', americas: '美洲', oceania: '大洋洲', africa: '非洲' };
    return m ? `${regions[m[1].toLowerCase()]} (${m[2]})` : undefined;
  } },
  { id: 'matches.date', module: 'matches', selector: '[data-time-format="MMM d"], [data-time-format="MMMM y"], .match-day', translate: dateText },
  exact('results.labels', 'results', '.standard-headline, .sidebar-headline, .filter-column-header, .filter-column-content .sidebar-single-line-item', filters),
  { id: 'results.date', module: 'results', selector: '.standard-headline', translate: dateText },
  { id: 'results.pagination', module: 'results', selector: '.pagination-data', translate: text => {
    const m = /^(\d+)\s*-\s*(\d+) of ([\d,]+)$/.exec(text); return m ? `第 ${m[1]}–${m[2]} 条，共 ${m[3]} 条` : undefined;
  } },
  exact('detail.labels', 'match-detail', '.standard-headline, .headline, .timeAndEvent .countdown, .mapholder .results .results-center, .mapholder .results .results-left .pick, .mapholder .results .results-right .pick, .no-streams, .match-info-box .small-text, .veto-box .padding', labels),
  exact('detail.lineup-comparison', 'match-detail', [
    '#lineups .lineups-compare-container th.table-header', '#lineups .lineups-compare-container th.table-subheader',
    '#lineups .lineups-compare-middle-table-center-stat', '#lineups .lineups-compare-middle-table-center-stat > .gtSmartphone-only',
    '#lineups .lineups-compare-player-link.profile-link[href^="/player/"]',
    '#lineups .lineups-compare-player-link.profile-link[href^="/player/"] > span',
    '#lineups .lineups-compare-player-link.stats-link[href^="/stats/players/"]',
    '#lineups .compare-link[href^="/stats/players/compare/"]',
  ].join(','), lineupComparison),
  { id: 'detail.date', module: 'match-detail', selector: '.timeAndEvent .date', translate: dateText },
  { id: 'detail.countdown', module: 'match-detail', selector: '.timeAndEvent .countdown', translate: text => {
    if (!/^(?:\d+[dhms]\s*(?::\s*)?)+$/i.test(text)) return;
    const units: Record<string, string> = { d: '天', h: '时', m: '分', s: '秒' };
    return text.replace(/(\d+)([dhms])/gi, (_, count: string, unit: string) => count + units[unit.toLowerCase()]);
  } },
  { id: 'detail.veto', module: 'match-detail', selector: '.veto-box .padding > div', translate: (text, settings) => {
    const m = /^(\d+)\. (.+) (removed|picked) ([A-Za-z0-9 ]+)$/.exec(text);
    if (m && maps[m[4].toLowerCase()]) return `${m[1]}. ${m[2]} ${m[3] === 'removed' ? '禁用' : '选择'} ${mapName(m[4], settings) ?? m[4]}`;
    const left = /^(\d+)\. ([A-Za-z0-9 ]+) was left over$/.exec(text);
    if (left && maps[left[2].toLowerCase()]) return `${left[1]}. ${mapName(left[2], settings) ?? left[2]} 剩余`;
  } },
  { id: 'detail.format', module: 'match-detail', selector: '.veto-box .preformatted-text', translate: text => {
    let changed = false;
    const result = text.split('\n').map(line => {
      const ws = /^(\s*)(.*?)(\s*)$/.exec(line)!;
      const m = /^Best of (1|3|5) \((Online|LAN)\)$/.exec(ws[2]);
      const key = ws[2].replace(/^\*\s*/, '');
      const translated = m ? `BO${m[1]}（${m[2] === 'Online' ? '线上赛' : '线下赛'}）` : labels[key as keyof typeof labels];
      if (translated) { changed = true; return ws[1] + (ws[2].startsWith('*') ? '* ' : '') + translated + ws[3]; }
      return line;
    }).join('\n');
    return changed ? result : undefined;
  } },
  exact('events.labels', 'events', '.event-status-headline, .event-status-upcoming-headline, .lan-marker', { 'Ongoing events': '进行中的赛事', 'Upcoming events': '即将开始的赛事', LAN: '线下赛' }),
  { id: 'events.date', module: 'events', selector: '.standard-headline, [data-time-format="MMM do"]', translate: dateText },
];
