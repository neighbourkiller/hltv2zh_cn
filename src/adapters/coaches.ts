import type { Rule } from '../core/types';
import { exact } from '../core/rules';
import { playerRules, playerText } from './players';
import { profileLabels } from '../locales/zh-CN/players';

/** 2026-10-16 /coach/2154/hally 六标签页 DOM；实体和数据不参与模板替换。 */
const headings: Array<[RegExp, string]> = [
  [/^(.+) coach statistics$/, '$1 的执教数据'],
  [/^Breakdown of teams coached by (.+)$/, '$1 的执教战队履历'],
  [/^Timeline of teams coached by (.+)$/, '$1 的执教战队时间线'],
  [/^Upcoming matches with (.+) as coach$/, '$1 的执教队伍近期赛程'],
  [/^Latest results with (.+) as coach$/, '$1 的执教队伍近期赛果'],
  [/^Major achievements for teams coached by (.+)$/, '$1 的执教队伍 Major 成就'],
  [/^LAN achievements for teams coached by (.+)$/, '$1 的执教队伍线下赛成就'],
  [/^Breakdown of major achievements for teams coached by (.+)$/, '$1 的执教队伍 Major 成就明细'],
  [/^Breakdown of LAN achievements for teams coached by (.+)$/, '$1 的执教队伍线下赛成就明细'],
  [/^Trophy overview for teams coached by (.+)$/, '$1 的执教队伍奖杯概览'],
  [/^All trophies for teams coached by (.+)$/, '$1 的执教队伍全部奖杯'],
];
const labelSlots = '.playerProfile .listLeft, .playerProfile .listRight > span, .playerProfile .player-stat-left > b, .playerProfile .dob-popup-row > span, .playerProfile .person-types .role-name, .playerProfile .person-types .primary-role, .playerProfile .team-detail-map-header > div, .playerProfile .team-detail-map-header > div > span, .playerProfile .sub-headline, .playerProfile .chart-tabs > div, .playerProfile .sub-title';
export const coachRules: Rule[] = [
  { id: 'coach.team-heading', module: 'coach', selector: 'h1, h2, .standard-headline, .sub-headline', translate: text => {
    const m = /^Team stats for (.+) as coach$/.exec(text);
    return m ? m[1] + ' 的执教队伍数据' : undefined;
  } },
  exact('coach.period', 'coach', labelSlots + ', .sub-headline', { 'Stats from entire coach period': '执教期间全队数据' }),
  { id: 'coach.headings', module: 'coach', selector: '.playerProfile .standard-headline', translate: text => {
    for (const [pattern, replacement] of headings) if (pattern.test(text)) return text.replace(pattern, replacement);
    return playerText(text);
  } },
  exact('coach.labels', 'coach', labelSlots, {
    ...profileLabels, 'Coach achievements': '教练成就', '(coach)': '（教练）', 'Primary role': '主要身份',
    'Map winrate': '地图胜率', 'CT round winrate': 'CT 回合胜率', 'T round winrate': 'T 回合胜率',
    'Best map': '最佳地图', 'Worst map': '最差地图', Map: '地图', winrate: '胜率', 'Win-%': '胜率', Played: '场次',
  }),
  { id: 'coach.samples', module: 'coach', selector: '.playerProfile .player-stat-of', translate: text => {
    const m = /^Based on ([\d,]+) (maps?|rounds?)$/.exec(text);
    return m ? '基于 ' + m[1] + (m[2].startsWith('map') ? ' 张地图' : ' 个回合') : undefined;
  } },
  { id: 'coach.period-and-empty', module: 'coach', selector: '.playerProfile .stats-window, .playerProfile .empty-state > span', translate: text => {
    let m = /^\(Past (\d+) months?\)$/.exec(text); if (m) return '（最近 ' + m[1] + ' 个月）';
    m = /^No upcoming matches for (.+), check back later\.$/.exec(text); return m ? m[1] + ' 暂无近期赛程，请稍后查看。' : undefined;
  } },
  exact('coach.pronunciation', 'coach', '.playerProfile .player-pronunciation-box span', {'Press play on the media player to find out': '点击播放器播放按钮，收听教练名字的发音'}),
  ...playerRules.filter(rule => rule.module === 'player').map(rule => ({...rule, id: 'coach.shared.' + rule.id, module: 'coach' as const})),
];
