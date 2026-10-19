import { defaults, moduleNames } from './settings';
import type { Module, Settings } from '../core/types';
export type MenuCommandId = string | number;
export function registerMenu(settings: Settings, register: (name: string, action: () => void) => MenuCommandId,
  save: (value: Settings) => void, reload: () => void,
  unregister: (id: MenuCommandId) => void, diagnose?: () => void): void {
  const commit = (next: Settings) => { save(next); reload(); };
  let expanded = false;
  let ids: MenuCommandId[] = [];
  const add = (name: string, action: () => void) => { ids.push(register(name, action)); };
  const render = () => {
    for (const id of ids) unregister(id);
    ids = [];
    add(expanded ? '收起设置' : '展开设置', () => { expanded = !expanded; render(); });
    if (!expanded) return;
    add(`${settings.enabled ? '停用' : '启用'}汉化（刷新页面）`, () => commit({ ...settings, enabled: !settings.enabled }));
    add(`地图名称：${settings.maps === 'en' ? '英文' : '中文'}（点击切换并刷新）`, () => commit({ ...settings, maps: settings.maps === 'en' ? 'zh-CN' : 'en' }));
    for (const key of Object.keys(moduleNames) as Module[]) {
      add(`${settings.modules[key] ? '✓' : '○'} ${moduleNames[key]}（切换并刷新）`, () => commit({ ...settings, modules: { ...settings.modules, [key]: !settings.modules[key] } }));
    }
    add('恢复默认设置（刷新页面）', () => commit(defaults()));
    if (diagnose) add('查看汉化诊断（不含页面正文）', diagnose);
  };
  // 仅维护当前页面的菜单显示状态，不改写汉化配置，也不触发刷新。
  render();
}
