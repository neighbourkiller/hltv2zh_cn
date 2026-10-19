import { rules } from './adapters';
import { start } from './core/runtime';
import { parseSettings, SETTINGS_KEY } from './features/settings';
import { registerMenu, type MenuCommandId } from './features/menu';

declare const GM_getValue: ((key: string, fallback?: unknown) => unknown) | undefined;
declare const GM_setValue: ((key: string, value: unknown) => void) | undefined;
declare const GM_registerMenuCommand: ((name: string, action: () => void) => MenuCommandId) | undefined;
declare const GM_unregisterMenuCommand: ((id: MenuCommandId) => void) | undefined;

function boot(): void {
  if (window.top !== window.self || /^\/betting(?:\/|$)/.test(location.pathname)) return;
  let stored: unknown;
  try { stored = typeof GM_getValue === 'function' ? GM_getValue(SETTINGS_KEY) : undefined; }
  catch { console.warn('[HLTV 简体中文] 无法读取配置，使用默认设置。'); }
  const settings = parseSettings(stored);
  // 验证页没有站点导航，不接管验证流程；停用时仍保留菜单中的启用入口。
  const runtime = settings.enabled && document.querySelector('.nav-link') ? start(document, rules, settings) : undefined;
  if (typeof GM_registerMenuCommand === 'function' && typeof GM_unregisterMenuCommand === 'function') {
    registerMenu(settings, GM_registerMenuCommand, next => {
      if (typeof GM_setValue !== 'function') throw new Error('油猴配置 API 不可用');
      GM_setValue(SETTINGS_KEY, next);
    }, () => location.reload(), GM_unregisterMenuCommand, runtime ? () => {
      const { visited, writes, errors, throttled } = runtime.engine.metrics;
      const { batches, maxBatchMs, maxPending } = runtime.scheduler.metrics;
      alert([
        `已检查节点：${visited}，已改写字段：${writes}`,
        `处理批次：${batches}，最长批次：${maxBatchMs.toFixed(2)}ms`,
        `最大待处理任务：${maxPending}，限流次数：${throttled}`,
        `限流待重试：${runtime.retries.size}，已重试：${runtime.retries.metrics.retried}，超限丢弃：${runtime.retries.metrics.overflow}`,
        `规则异常：${errors}，规则 ID：${runtime.engine.errors.join(', ') || '无'}`,
      ].join('\n'));
    } : undefined);
  }
  if (!runtime) return;
  window.addEventListener('pagehide', event => { if (!event.persisted) runtime.stop(); });
  // BFCache 冻结期间保留引擎状态，返回时核对文案，不刷新用户正在编辑的页面。
  window.addEventListener('pageshow', event => { if (event.persisted) runtime.refresh(); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
