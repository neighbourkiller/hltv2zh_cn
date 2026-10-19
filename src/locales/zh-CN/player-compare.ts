import { statsNavigation, recentPeriods, matchFilters } from './shared';
/** 完整对比页与单选手统计页独立；Rating 保留，KPR/KAST 按用户术语翻译。 */
export const compareLabels = {
  ...recentPeriods, ...matchFilters, 'All Maps': '全部地图',
  'Add player': '添加选手', 'remove player': '移除选手',
  KPR: '每回合击杀', KAST: '不白给率',
  'Multi-kill rating': '多杀评分', 'Round Swing': '回合影响力',
  'Assists per round': '每回合助攻', Surviving: '存活率', Impact: '影响力',
  'AWP kills per round': 'AWP 每回合击杀', 'AWP KPR': 'AWP 每回合击杀',
  'Headshot %': '爆头率', 'HS %': '爆头率',
  'Opening kills per round': '每回合首杀', 'Opening KPR': '每回合首杀',
  'Flash assists per round': '每回合闪光助攻', 'Flash assists': '闪光助攻',
  Form: '状态走势',
};

export const compareNavigation = {
  ...statsNavigation, Compare: '选手对比',
};
