import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { hltvDetailLabels, valveDetailLabels, valveDetailExplanations } from '../locales/zh-CN/ranking-details';
import { rankingRules } from './ranking';
import { valveRankingRules } from './valve-ranking';
import { dateText } from './templates';

export const hltvRankingDetailRules: Rule[] = [
  ...rankingRules.filter(r => ['ranking.filters', 'ranking.months', 'ranking.day'].includes(r.id))
    .map(r => ({ ...r, id: `ranking-detail.${r.id}`, module: 'ranking-detail' as const })),
  exact('ranking-detail.labels', 'ranking-detail', '.ranking-details .standard-headline, .ranking-details .standard-headline > span, .ranking-details .stats-table th, .ranking-details .stats-table td.statsCenterText', hltvDetailLabels),
  { id: 'ranking-detail.heading', module: 'ranking-detail', selector: '.ranking-details > .standard-headline', translate: text => {
    const m = /^Detailed breakdown of ranking calculations for (.+)$/.exec(text); return m ? `${m[1]} 的 HLTV 排名计算明细` : undefined;
  } },
  { id: 'ranking-detail.placement', module: 'ranking-detail', selector: '.ranking-details .stats-table tbody td:first-child', translate: text => {
    if (text === 'vs.') return '对阵';
    const m = /^(\d+)(?:[-–](\d+))?(?:st|nd|rd|th)$/.exec(text); return m ? `第${m[1]}${m[2] ? '–' + m[2] : ''}名` : undefined;
  } },
];

export const valveRankingDetailRules: Rule[] = [
  ...valveRankingRules.filter(r => ['valve-ranking.regions', 'valve-ranking.point-brand', 'valve-ranking.points'].includes(r.id))
    .map(r => ({ ...r, id: `valve-ranking-detail.${r.id}`, module: 'valve-ranking-detail' as const })),
  exact('valve-ranking-detail.labels', 'valve-ranking-detail', [
    '.valve-ranking-details .standard-headline', '.valve-ranking-details .detail-head', '.valve-ranking-details .detail-head > span',
    '.valve-ranking-details .detail-points-text', '.valve-ranking-details th', '.valve-ranking-details td.win', '.valve-ranking-details td.loss',
    '.valve-ranking-details .detail-explain b', '.valve-ranking-details .tooltip-box',
  ].join(','), valveDetailLabels),
  exact('valve-ranking-detail.explanations', 'valve-ranking-detail', '.valve-ranking-details .detail-explain, .valve-ranking-details .detail-explain li', valveDetailExplanations),
  { id: 'valve-ranking-detail.heading', module: 'valve-ranking-detail', selector: '.valve-ranking-details > .standard-headline', translate: text => {
    const m = /^Ranking\s+details for (.+) on (.+)$/.exec(text);
    if (m) { const date = dateText(m[2]); return date ? `${m[1]} 的V社排名详情（${date}）` : undefined; }
  } },
  { id: 'valve-ranking-detail.event-weight', module: 'valve-ranking-detail', selector: '.valve-ranking-details .tooltip-box, .tooltip-box.context-tooltip', translate: text => {
    const m = /^Event weight:\s*(\d+(?:\.\d+)?)$/.exec(text); return m ? `赛事权重：${m[1]}` : undefined;
  } },
  { id: 'valve-ranking-detail.cap-note', module: 'valve-ranking-detail', selector: '.valve-ranking-details .details-matches', translate: text => {
    const m = /^\* Points does not sum up as (.+) has max points for bounty offered, and points are set to 5th best bounty offered score$/.exec(text);
    return m ? `* ${m[1]} 的提供悬赏分项已达到积分上限，因此积分不直接相加，而是按该分项第五高的得分确定。` : undefined;
  } },
];
