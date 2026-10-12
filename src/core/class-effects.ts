import type { Page } from './types';

// 仅跟踪会改变已核对规则归属的 class；不处理 hidden/active 等通用显示状态。
// scope 必须稳定，不能依赖本次被切换的 class；移除目标 class 也要能恢复原文。
const eventClasses = new Set(['team-tbd', 'team-name', 'round-header']);
const protectedClasses = new Set(['newstext', 'thread-message-text', 'playerNickname', 'teamName']);
export function classChangeRoot(element: Element, oldValue: string | null, page: Page): Element | undefined {
  const before = new Set((oldValue ?? '').split(/\s+/).filter(Boolean));
  const after = new Set(element.classList);
  const changed = [...before, ...after].filter(name => before.has(name) !== after.has(name));
  if (!changed.length) return;
  // 正文/实体语义类增加或移除时，后代的已有译文也需要受控恢复。
  if (changed.some(name => protectedClasses.has(name)) && element !== element.ownerDocument.body && element !== element.ownerDocument.documentElement) return element;
  if (page !== 'event-detail' || !element.closest('.event-page')) return;
  if (changed.some(name => eventClasses.has(name))) return element;
  // 实页轮次折叠切换 collapsed；只处理该轮表头，不遍历比赛/比分列表。
  if (changed.includes('collapsed') && element.matches('.round')) return element.querySelector('.round-header') ?? undefined;
}
