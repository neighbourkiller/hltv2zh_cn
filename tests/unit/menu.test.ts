import { expect, it, vi } from 'vitest';
import { registerMenu, type MenuCommandId } from '../../src/features/menu';
import { defaults } from '../../src/features/settings';

function setup(enabled = true, diagnose = vi.fn()) {
  let nextId = 0;
  const commands = new Map<MenuCommandId, { name: string; action: () => void }>();
  const register = (name: string, action: () => void) => {
    const id = nextId++; commands.set(id, { name, action }); return id;
  };
  const save = vi.fn(), reload = vi.fn();
  const settings = { ...defaults(), enabled };
  registerMenu(settings, register, save, reload, id => { commands.delete(id); }, diagnose);
  const names = () => [...commands.values()].map(c => c.name);
  const click = (text: string) => [...commands.values()].find(c => c.name.startsWith(text))!.action();
  return { names, click, save, reload, settings, diagnose };
}

it('初始仅一个展开入口，反复收起/展开不残留菜单、不保存或刷新页面', () => {
  const menu = setup();
  expect(menu.names()).toEqual(['展开设置']);
  for (let i = 0; i < 3; i++) {
    menu.click('展开设置');
    const names = menu.names();
    expect(names[0]).toBe('收起设置');
    expect(names).toContain('✓ 比赛列表（切换并刷新）');
    expect(names).toContain('查看汉化诊断（不含页面正文）');
    expect(new Set(names).size).toBe(names.length);
    menu.click('收起设置');
    expect(menu.names()).toEqual(['展开设置']);
  }
  expect(menu.save).not.toHaveBeenCalled(); expect(menu.reload).not.toHaveBeenCalled();
});

it('展开后模块开关保留旧偏好并保存刷新，诊断仅在点击时执行', () => {
  const menu = setup(); menu.click('展开设置');
  expect(menu.diagnose).not.toHaveBeenCalled();
  menu.click('查看汉化诊断'); expect(menu.diagnose).toHaveBeenCalledOnce();
  menu.click('✓ 比赛列表');
  expect(menu.save).toHaveBeenCalledExactlyOnceWith({ ...menu.settings, modules: { ...menu.settings.modules, matches: false } });
  expect(menu.reload).toHaveBeenCalledOnce();
});

it('汉化停用后仍可展开重新启用，恢复默认使用原配置结构', () => {
  const menu = setup(false); menu.click('展开设置'); menu.click('启用汉化');
  expect(menu.save).toHaveBeenLastCalledWith({ ...menu.settings, enabled: true });
  menu.click('恢复默认设置'); expect(menu.save).toHaveBeenLastCalledWith(defaults());
});
