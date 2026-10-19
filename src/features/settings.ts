import type { Settings, Module } from '../core/types';
export const SETTINGS_KEY = 'hltv2zh-cn.settings.v1';
export const moduleNames: Record<Module, string> = {
  common: '公共导航', home: '首页', matches: '比赛列表', 'match-detail': '比赛详情', results: '赛果', events: '赛事列表',
  player: '选手资料', 'player-stats': '选手数据', 'event-detail': '赛事详情', 'player-compare': '选手对比',
  statistics: '统计数据', ranking: '队伍排名', 'valve-ranking': 'V社排名', 'vrs-invites': 'VRS 邀请', maps: '地图名称（全站）',
  team: '战队资料', 'ranking-detail': 'HLTV 排名详情', 'valve-ranking-detail': 'V社排名详情',
  transfers: '独立转会', fantasy: 'Fantasy 总览', coach: '教练资料', forum: '论坛界面', 'vrs-forecast': 'VRS 预测标签',
};
export function defaults(): Settings {
  return { schemaVersion: 2, enabled: true, maps: 'zh-CN', modules: {
    common: true, home: true, matches: true, 'match-detail': true, results: true, events: true,
    player: true, 'player-stats': true, 'event-detail': true, 'player-compare': true,
    statistics: true, ranking: true, 'valve-ranking': true, 'vrs-invites': true, maps: true,
    team: true, 'ranking-detail': true, 'valve-ranking-detail': true,
    transfers: true, fantasy: true, coach: true, forum: true, 'vrs-forecast': true,
  } };
}
export function parseSettings(value: unknown): Settings {
  const result = defaults();
  if (!value || typeof value !== 'object' || !('schemaVersion' in value) || (value.schemaVersion !== 1 && value.schemaVersion !== 2)) return result;
  const data = value as Partial<Settings>;
  if (typeof data.enabled === 'boolean') result.enabled = data.enabled;
  // 0.1.7 按用户要求迁移为默认全站中文；新配置的显式英文偏好继续保留。
  if (value.schemaVersion === 2 && (data.maps === 'en' || data.maps === 'zh-CN')) result.maps = data.maps;
  if (data.modules && typeof data.modules === 'object') {
    for (const key of Object.keys(result.modules) as Module[]) {
      if (typeof data.modules[key] === 'boolean') result.modules[key] = data.modules[key];
    }
  }
  return result;
}
