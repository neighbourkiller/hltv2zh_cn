import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { statisticsFilterLabels } from '../locales/zh-CN/statistics';
import { statsText } from './players';

const filterSlots = [
  '.stats-filter-title > .standard-headline', '.stats-filter-advanced-headline',
  '.stats-filter-chip-label', '.stats-filter-chip-value', '.stats-filter-chip-toggle',
  '.stats-filter-chip-option', '.stats-filter-chip-group-title', '.stats-role-label',
  '.stats-time-field > span', '.stats-time-apply', '.stats-min-maps-hint',
  '.stats-min-maps-option-label', '.stats-min-maps-option-tag', '.stats-min-maps-other > span',
].map(selector => `.stats-filters ${selector}`).join(',');

const countSlots = [
  '.stats-maps-readout', '.stats-min-maps-option-label', '.stats-min-maps-option-rows', '.stats-min-maps-other-max',
  '.stats-round-filter-expand', '.stats-filter-chip-option', '.stats-filter-chip-value',
].map(selector => `.stats-filters ${selector}`).join(',');

const filterUnits: Record<string, string> = {
  map: '张地图', maps: '张地图', player: '名选手', players: '名选手', kill: '杀', kills: '杀',
};

export const statisticsFilterRules: Rule[] = (['statistics', 'player-stats'] as const).flatMap(module => [
  exact(`${module}.filters`, module, filterSlots, statisticsFilterLabels),
  { id: `${module}.filter-numbers`, module, selector: countSlots, translate: (text: string) => {
    const count = /^([\d,]+) (maps?|players?|kills?)$/.exec(text);
    if (count) return `${count[1]} ${filterUnits[count[2]]}`;
    const max = /^max ([\d,]+)$/.exec(text);
    if (max) return `最多 ${max[1]}`;
    const filters = /^(Expand|Collapse) ([\d,]+) filters?$/.exec(text);
    if (filters) return `${filters[1] === 'Expand' ? '展开' : '收起'} ${filters[2]} 项筛选`;
    return statsText(text);
  } },
]);
