import type { Rule, Module } from './types';
export const normalize = (text: string) => text.replace(/[\s\u00a0]+/g, ' ').trim().toLowerCase();
// 词库按只读对象使用，同一个词库的多条规则共享规范化查找表。
const compiled = new WeakMap<Readonly<Record<string, string>>, Rule['translate']>();
export function exact(id: string, module: Module, selector: string, entries: Readonly<Record<string, string>>, target?: Rule['target']): Rule {
  const cached = compiled.get(entries);
  if (cached) return { id, module, selector, target, translate: cached };
  const map = new Map<string, string>();
  for (const [source, value] of Object.entries(entries)) {
    const key = normalize(source);
    if (map.has(key)) throw new Error(`重复词条: ${id}/${source}`);
    map.set(key, value);
  }
  const translate: Rule['translate'] = source => map.get(normalize(source));
  compiled.set(entries, translate);
  return { id, module, selector, target, translate };
}
export function validateRules(rules: Rule[], doc: Document): void {
  const ids = new Set<string>();
  for (const rule of rules) {
    if (ids.has(rule.id)) throw new Error(`重复规则 ID: ${rule.id}`);
    ids.add(rule.id);
    doc.querySelector(rule.selector); // 构建/测试阶段校验选择器语法。
  }
}
