import { defaults, moduleNames } from './settings';
import type { Module, Settings } from '../core/types';
export function registerMenu(settings: Settings, register: (name: string, action: () => void) => void,
  save: (value: Settings) => void, reload: () => void): void {
  const commit = (next: Settings) => { save(next); reload(); };
  register(`${settings.enabled ? '停用' : '启用'}汉化（刷新页面）`, () => commit({ ...settings, enabled: !settings.enabled }));
  register(`地图名称：${settings.maps === 'en' ? '英文' : '中文'}（点击切换并刷新）`, () => commit({ ...settings, maps: settings.maps === 'en' ? 'zh-CN' : 'en' }));
  for (const key of Object.keys(moduleNames) as Module[]) {
    register(`${settings.modules[key] ? '✓' : '○'} ${moduleNames[key]}（切换并刷新）`, () => commit({ ...settings, modules: { ...settings.modules, [key]: !settings.modules[key] } }));
  }
  register('恢复默认设置（刷新页面）', () => commit(defaults()));
}
