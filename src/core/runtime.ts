import type { Rule, Settings } from './types';
import { detectPage } from './types';
import { TranslationEngine } from './engine';
import { Scheduler } from './scheduler';
import { playerStyle } from '../features/player-style';
import { matchesStyle } from '../features/matches-style';
import { RetryQueue } from './retry-queue';
import { classChangeRoot } from './class-effects';

export function start(doc: Document, rules: Rule[], settings: Settings) {
  const page = detectPage(doc.location.pathname);
  const retries = new RetryQueue(node => scheduler.enqueue(node, false));
  const engine = new TranslationEngine(rules, page, settings, (node, due) => retries.add(node, due));
  playerStyle(doc, page, settings);
  matchesStyle(doc, page, settings);
  const scheduler = new Scheduler(node => engine.process(node));
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'childList') {
        if ((record.target as Element).closest?.('option')) scheduler.enqueue(record.target);
        for (const node of record.addedNodes) scheduler.enqueue(node);
      } else if (record.type === 'attributes' && record.attributeName === 'class') {
        const root = classChangeRoot(record.target as Element, record.oldValue, page);
        if (root) scheduler.enqueue(root);
      } else if (record.type === 'attributes' && ['href', 'contenteditable', 'data-hltv-zh-owned', 'data-livescore-current-map-score', 'data-livescore-maps-won-for'].includes(record.attributeName ?? '')) {
        scheduler.enqueue(record.target);
      } else scheduler.enqueue(record.target, false);
    }
    if (retries.size && records.some(record => record.removedNodes.length)) retries.prune();
  });
  observer.observe(doc.body, { childList: true, subtree: true, characterData: true,
    attributes: true, attributeOldValue: true, attributeFilter: ['title', 'placeholder', 'aria-label', 'alt', 'class', 'href', 'contenteditable', 'data-hltv-zh-owned', 'data-livescore-current-map-score', 'data-livescore-maps-won-for'] });
  scheduler.enqueue(doc.body);
  return {
    engine, scheduler, retries,
    refresh() { scheduler.enqueue(doc.body); },
    update(next: Settings) { retries.clear(); engine.configure(next); playerStyle(doc, page, next); matchesStyle(doc, page, next); scheduler.enqueue(doc.body); },
    stop() { observer.disconnect(); retries.stop(); scheduler.stop(); },
  };
}
