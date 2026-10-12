import type { Rule, Settings } from '../core/types';
import { normalize } from '../core/rules';
import { maps } from '../locales/zh-CN/matches';

export function mapName(text: string, settings: Settings): string | undefined {
  const key = normalize(text);
  return settings.maps === 'zh-CN' && settings.modules.maps && Object.hasOwn(maps, key) ? maps[key] : undefined;
}
const candidate = (text: string, settings: Settings) => mapName(text, settings) !== undefined;
/** 全页完整词条匹配，保留引擎的正文/实体保护；不对任意句子做子串替换。 */
export const mapRules: Rule[] = [
  { id: 'maps.text', module: 'maps', selector: '*', candidate, translate: mapName },
  ...(['title', 'alt', 'aria-label'] as const).map(target => ({
    id: `maps.${target}`, module: 'maps' as const, selector: `[${target}]`, target, candidate, translate: mapName,
  })),
];
