import type { Attribute, Page, Rule, SavedValue, Settings } from './types';
import { protectedElement, protectedMapElement } from './guards';

export class TranslationEngine {
  private texts = new WeakMap<Text, SavedValue>();
  private implicitOptionValues = new WeakMap<HTMLOptionElement, string>();
  private attributes = new WeakMap<Element, Map<Attribute, SavedValue>>();
  private writeWindows = new WeakMap<Node, Map<string, { start: number; count: number; blockedUntil: number }>>();
  readonly metrics = { visited: 0, writes: 0, errors: 0, throttled: 0 };
  readonly errors: string[] = [];
  private active: Rule[];
  private textSelectors: string[] = [];
  private candidateTextRules: Rule[] = [];
  private attributeTargets: Attribute[] = [];
  constructor(private rules: Rule[], private page: Page, private settings: Settings,
    private retry?: (node: Node, due: number) => void) {
    this.active = this.selectRules();
    this.indexRules();
  }
  private selectRules(): Rule[] {
    return this.settings.enabled ? this.rules.filter(r => this.settings.modules[r.module] && (r.module === 'common' || r.module === 'maps' || r.module === this.page)) : [];
  }
  private indexRules(): void {
    // 去重并限制每组长度，避免新增页面后生成超长的联合选择器。
    this.textSelectors = [];
    this.candidateTextRules = this.active.filter(r => !r.target && r.candidate);
    for (const selector of new Set(this.active.filter(r => !r.target && !r.candidate).map(r => r.selector))) {
      const last = this.textSelectors.length - 1;
      if (last >= 0 && this.textSelectors[last].length + selector.length + 1 <= 1800) this.textSelectors[last] += ',' + selector;
      else this.textSelectors.push(selector);
    }
    this.attributeTargets = [...new Set(this.active.flatMap(r => r.target ? [r.target] : []))];
  }
  configure(settings: Settings): void { this.settings = settings; this.active = this.selectRules(); this.indexRules(); }
  private permitWrite(node: Node, target: string): boolean {
    const now = performance.now();
    const fields = this.writeWindows.get(node) ?? new Map();
    let state = fields.get(target) ?? { start: now, count: 0, blockedUntil: 0 };
    if (state.blockedUntil > now) { this.retry?.(node, state.blockedUntil); return false; }
    if (now - state.start > 1000) state = { start: now, count: 0, blockedUntil: 0 };
    state.count++;
    if (state.count > 20) { state.blockedUntil = now + 10000; this.metrics.throttled++; }
    fields.set(target, state); this.writeWindows.set(node, fields);
    if (state.blockedUntil > now) this.retry?.(node, state.blockedUntil);
    return state.blockedUntil <= now;
  }
  private resolve(source: string, element: Element, target?: Attribute): { value: string; ruleId: string } | undefined {
    let protectionChecked = false;
    for (const rule of this.active) {
      if (rule.target !== target || (rule.candidate && !rule.candidate(source, this.settings)) || !element.matches(rule.selector)) continue;
      if (!protectionChecked) {
        if (protectedElement(element)) return;
        protectionChecked = true;
      }
      if (rule.module === 'maps' && protectedMapElement(element)) continue;
      try {
        const translated = rule.translate(source.trim(), this.settings);
        if (translated !== undefined) {
          // 仅替换非空白主体，保留相邻节点之间的空格与原有换行。
          const leading = source.match(/^\s*/)?.[0] ?? '';
          const trailing = source.match(/\s*$/)?.[0] ?? '';
          return { value: leading + translated + trailing, ruleId: rule.id };
        }
      } catch {
        this.metrics.errors++;
        if (this.errors.length < 20 && !this.errors.includes(rule.id)) this.errors.push(rule.id);
      }
    }
  }
  process(node: Node): void {
    this.metrics.visited++;
    if (!node.isConnected) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node as Text;
      if (!text.parentElement) return;
      const current = text.data;
      const saved = this.texts.get(text);
      if (!saved && (!/[a-z]/i.test(current) || !(
        this.candidateTextRules.some(rule => rule.candidate!(current, this.settings) && text.parentElement!.matches(rule.selector))
        || this.textSelectors.some(selector => text.parentElement!.matches(selector))
      ))) return;
      const source = saved && current === saved.rendered ? saved.source : current;
      if (!source.trim() || source.length > 2000) return;
      const result = this.resolve(source, text.parentElement);
      const value = result?.value ?? source;
      // 没有规则或移入保护区时，仅撤销我们自己的旧译文。
      if (current !== value) {
        if (result && !this.permitWrite(text, 'text')) return;
        // option 未显式指定 value 时，浏览器会从文字派生值；汉化不能改变筛选语义。
        if (text.parentElement.tagName === 'OPTION') {
          const option = text.parentElement as HTMLOptionElement;
          const injected = this.implicitOptionValues.get(option);
          if (injected !== undefined && option.getAttribute('value') === injected) {
            option.removeAttribute('value'); this.implicitOptionValues.delete(option);
          }
          if (result && !option.hasAttribute('value')) {
            const originalValue = source.replace(/\s+/g, ' ').trim();
            option.setAttribute('value', originalValue);
            this.implicitOptionValues.set(option, originalValue);
          }
        }
        text.data = value; this.metrics.writes++;
      }
      if (result && value !== source) this.texts.set(text, { source, rendered: value, ruleId: result.ruleId });
      else this.texts.delete(text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const saved = this.attributes.get(element) ?? new Map<Attribute, SavedValue>();
      const targets = new Set<Attribute>([...saved.keys(), ...this.attributeTargets]);
      for (const target of targets) {
        const current = element.getAttribute(target);
        if (current === null) { saved.delete(target); continue; }
        const state = saved.get(target);
        const source = state && current === state.rendered ? state.source : current;
        const result = this.resolve(source, element, target);
        const value = result?.value ?? source;
        if (current !== value) {
          if (result && !this.permitWrite(element, target)) continue;
          element.setAttribute(target, value); this.metrics.writes++;
        }
        if (result && value !== source) saved.set(target, { source, rendered: value, ruleId: result.ruleId });
        else saved.delete(target);
      }
      if (saved.size) this.attributes.set(element, saved); else this.attributes.delete(element);
    }
  }
}
