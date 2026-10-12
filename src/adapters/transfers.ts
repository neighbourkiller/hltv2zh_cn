import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { transferLabels, transferMovement, transferStatus } from '../locales/zh-CN/transfers';
import { dateText } from './templates';

/** 2026-10-10 /transfers 实页；不接管筛选导航，不重建跨节点句子。 */
export const transferRules: Rule[] = [
  exact('transfers.labels', 'transfers', '.transfer .standard-headline, .transfer-filters .filter > .title, .transfer-filters option, .transfer-filters label[for="checkbox_free_agent"]', transferLabels),
  exact('transfers.movement', 'transfers', '.transfer .transfer-movement', transferMovement),
  exact('transfers.status', 'transfers', '.transfer .transfer-team-status, .transfer .transfer-team-no-team', transferStatus),
  exact('transfers.no-team-alt', 'transfers', '.transfer .transfer-team-container:not(a) img', transferStatus, 'alt'),
  exact('transfers.no-team-title', 'transfers', '.transfer .transfer-team-container:not(a) img', transferStatus, 'title'),
  exact('transfers.search', 'transfers', '.transfer-filter-country[placeholder]', { 'Search countries...': '搜索国家…' }, 'placeholder'),
  { id: 'transfers.date', module: 'transfers', selector: '.transfer .transfer-date', translate: dateText },
];
