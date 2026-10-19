import { lastPeriods } from './shared';
export const transferLabels = {
  'Counter-Strike transfers': 'Counter-Strike 转会',
  'Date filter': '日期筛选', 'Ranking filter': '排名筛选', 'Country filter': '国家筛选',
  ...lastPeriods, All: '全部',
  'Top 5': '前 5 名', 'Top 10': '前 10 名', 'Top 20': '前 20 名',
  'Top 30': '前 30 名', 'Top 50': '前 50 名', 'Show free agents only': '仅显示自由选手',
};

/** 仅匹配实页中的完整独立 Text，保留中间的选手/队伍链接。 */
export const transferMovement = {
  joins: '加入', 'parts ways with': '离开', 'transfers from': '从', to: '转会至',
  'is benched on': '转为替补，所属队伍：',
  'is moved to the active roster on': '回归主力阵容，所属队伍：',
  'as coach': '担任教练', '(benched)': '（替补）',
};
export const transferStatus = { BENCH: '替补', COACH: '教练', 'NO TEAM': '无战队' };
