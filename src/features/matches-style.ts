import type { Page, Settings } from '../core/types';

/** 原站按英文设置固定标签宽度；中文保持单行，并为文字留足内容宽度。 */
export function matchesStyle(doc: Document, page: Page, settings: Settings): void {
  const id = 'hltv-zh-matches-style';
  let style = doc.getElementById(id);
  if (page !== 'matches' || !settings.enabled || !settings.modules.matches) { style?.remove(); return; }
  if (style) return;
  style = doc.createElement('style');
  style.id = id;
  style.setAttribute('data-hltv-zh-owned', '');
  style.textContent = `
    .matches-v4 .match-info > .match-meta-live { white-space: nowrap; min-width: 3em; }
    .matches-v4 .match-stage { white-space: nowrap; min-width: max-content; }
  `;
  doc.head.append(style);
}
