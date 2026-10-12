export type Page = 'home' | 'matches' | 'match-detail' | 'results' | 'events' | 'event-detail' | 'player' | 'player-stats' | 'player-compare' | 'statistics' | 'ranking' | 'valve-ranking' | 'vrs-invites' | 'team' | 'ranking-detail' | 'valve-ranking-detail' | 'transfers' | 'fantasy' | 'other';
export type Module = 'common' | 'maps' | Exclude<Page, 'other'>;
export type Attribute = 'title' | 'placeholder' | 'aria-label' | 'alt';
export interface Settings {
  schemaVersion: 2;
  enabled: boolean;
  maps: 'en' | 'zh-CN';
  modules: Record<Module, boolean>;
}
export interface Rule {
  id: string;
  module: Module;
  selector: string;
  target?: Attribute;
  /** 可选的纯文本快速预判；必须无 DOM 副作用，不能排除可能命中的词条。 */
  candidate?: (source: string, settings: Settings) => boolean;
  /** selector 仅匹配 Text 的直属父元素，防止实体继承容器规则。 */
  translate: (source: string, settings: Settings) => string | undefined;
}
export interface SavedValue { source: string; rendered: string; ruleId?: string }
export function detectPage(path: string): Page {
  // 只接入已采样的列表/总览；Fantasy 阵容、联赛和账号子路由仍属 other。
  if (/^\/transfers\/?$/.test(path)) return 'transfers';
  if (/^\/fantasy\/?$/.test(path)) return 'fantasy';
  if (/^\/team\/\d+(?:\/|$)/.test(path)) return 'team';
  if (/^\/ranking\/teams\/\d{4}\/[^/]+\/\d{1,2}\/details\/\d+\/?$/.test(path)) return 'ranking-detail';
  if (/^\/valve-ranking\/teams\/details\/\d{4}\/[^/]+\/\d{1,2}\/?$/.test(path)) return 'valve-ranking-detail';
  if (/^\/valve-ranking\/invites\/?$/.test(path)) return 'vrs-invites';
  if (/^\/valve-ranking\/teams(?:\/?$|\/\d{4}\/[^/]+\/\d{1,2}(?:\/region\/[^/]+)?\/?$)/.test(path)) return 'valve-ranking';
  if (/^\/ranking\/teams(?:\/|$)/.test(path)) return 'ranking';
  if (/^\/player\/\d+(?:\/|$)/.test(path)) return 'player';
  if (/^\/stats\/players\/compare(?:\/|$)/.test(path)) return 'player-compare';
  if (/^\/stats\/players\/(?:\d+(?:\/|$)|(?:individual|matches|events|career|weapon|clutches|multikills)\/\d+(?:\/|$)|opponents\/(?:team|lineup)\/\d+(?:\/|$))/.test(path)) return 'player-stats';
  if (/^\/stats(?:\/|$)/.test(path)) return 'statistics';
  if (path === '/') return 'home';
  if (/^\/matches\/?$/.test(path)) return 'matches';
  if (/^\/matches\/\d+(?:\/|$)/.test(path)) return 'match-detail';
  if (/^\/results\/?$/.test(path)) return 'results';
  if (/^\/events\/?$/.test(path)) return 'events';
  if (/^\/events\/\d+(?:\/|$)/.test(path)) return 'event-detail';
  return 'other';
}
