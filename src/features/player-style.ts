import type { Page, Settings } from '../core/types';

/** 实页关注按钮的可见文字来自 ::after，不是 Text；保持按钮和点击事件。 */
export function playerStyle(doc: Document, page: Page, settings: Settings): void {
  const id = 'hltv-zh-player-style';
  const active = settings.enabled && ((page === 'player' && settings.modules.player) || (page === 'team' && settings.modules.team) || (page === 'coach' && settings.modules.coach));
  let style = doc.getElementById(id);
  if (!active) { style?.remove(); return; }
  if (style) return;
  style = doc.createElement('style'); style.id = id; style.setAttribute('data-hltv-zh-owned', '');
  style.textContent = page === 'team'
    ? '.teamProfile .fanbutton.addFan::after { content: "关注战队" !important; } .teamProfile .fanbutton.removeFan::after { content: "取消关注" !important; }'
    : page === 'coach' ? '.playerProfile .fanbutton.addFan::after { content: "关注教练" !important; } .playerProfile .fanbutton.removeFan::after { content: "取消关注" !important; }'
    : '.playerProfile .fanbutton.addFan::after { content: "关注选手" !important; }';
  doc.head.append(style);
}
