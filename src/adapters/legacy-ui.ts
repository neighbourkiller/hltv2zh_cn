import { exact } from '../core/rules';
import type { Rule } from '../core/types';

// NEXT 1.7.0 固定 UI 结构参考；仅覆盖这些槽位，不声明当前实页完整覆盖。
const economy = {
  'Semi-eco': '半经济局', 'Semi-buy': '半起局', 'Full buy': '全起局',
  'Total full eco rounds [0-5k]': '全经济局总数 [0-5k]',
  'Total semi-eco rounds [5-10k]': '半经济局总数 [5-10k]',
  'Total semi-buy rounds [10-20k]': '半起局总数 [10-20k]',
  'Total full buy rounds [20k+]': '全起局总数 [20k+]',
};
const liveTitles: Record<string, string> = { hpCell: '生命值', armorCell: '护甲', weaponCell: '购买武器', moneyCell: '金钱', killCell: '击杀数（爆头数）', assistCell: '助攻数', assistFlashCell: '助攻数（闪光助攻数）', deathCell: '阵亡数（被补枪数）', adrCell: '每回合伤害' };
export const legacyUiRules: Rule[] = [
  exact('forum.headers', 'forum', 'tr.tableheader > th, tr.tableheader > td', { Topic: '主题', Replies: '回复', Author: '作者', Activity: '活跃度' }),
  exact('forecast.headers', 'vrs-forecast', '.vrs-forecast-container .vrs-forecast-header', { before: '赛前', result: '赛果' }),
  ...(['statistics', 'player-stats'] as const).map(module => exact(module + '.economy-chart', module, '.fusioncharts-container text, .fusioncharts-container tspan, .team-economy-stat, .team-economy-stat > span', economy)),
  ...Object.entries(liveTitles).map(([cls, value]): Rule => ({
    id: 'detail.live-title.' + cls, module: 'match-detail', selector: 'td.statCell.' + cls, target: 'title', createMissing: true,
    translate: text => text === '' ? value : undefined,
  })),
];
