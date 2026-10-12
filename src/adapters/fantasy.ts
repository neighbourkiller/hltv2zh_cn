import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { fantasyLabels, fantasyDescriptions } from '../locales/zh-CN/fantasy';
import { dateText } from './templates';

const seasonNames: Record<string, string> = { Spring: '春季', Fall: '秋季' };
export function fantasySeason(text: string): string | undefined {
  const m = /^(Fantasy |About )?(Spring|Fall) season (\d{4})( fantasy leaderboard| celebrity leaderboard| leaderboard)?$/.exec(text);
  if (!m) return;
  const season = `${m[3]}年${seasonNames[m[2]]}赛季`;
  if (m[1] === 'About ') return `关于${season}`;
  return `${m[1] === 'Fantasy ' || m[4] === ' fantasy leaderboard' ? 'Fantasy ' : ''}${season}${m[4] ? m[4] === ' celebrity leaderboard' ? '名人排行榜' : '排行榜' : ''}`;
}
export function fantasySummary(text: string): string | undefined {
  const m = /^(\d+) games? \((\d+ (?:upcoming|live|finished)(?:, \d+ (?:upcoming|live|finished))*)\)$/.exec(text);
  if (!m) return;
  const status: Record<string, string> = { upcoming: '即将开始', live: '进行中', finished: '已结束' };
  return `${m[1]} 场游戏（${m[2].replace(/(\d+) (upcoming|live|finished)/g, (_, n: string, s: string) => `${n} 场${status[s]}`).replace(/, /g, '，')}）`;
}

/** 2026-10-10 总览的三类排行榜；比赛、用户、奖金额和积分原值均保持。 */
export const fantasyRules: Rule[] = [
  exact('fantasy.top', 'fantasy', '.fantasy-frontpage .leaderboard-pagination > a[href^="/fantasy?offset="]', { 'To Top': '回到榜首' }),
  exact('fantasy.signin-hint', 'fantasy', '.fantasy-frontpage .custom-leaderboard-signin-message', fantasyLabels),
  exact('fantasy.game-unit', 'fantasy', '.fantasy-frontpage .number-of-games', { games: '场游戏' }),
  exact('fantasy.labels', 'fantasy', '.fantasy-frontpage .season-headline, .fantasy-frontpage .hidden-month-button, .fantasy-frontpage .month-text, .fantasy-frontpage .winner-text, .fantasy-frontpage .live-btn, .fantasy-frontpage .partner-game-headline, .fantasy-frontpage .season-standing-tabs > .tab, .fantasy-frontpage .leaderboard-headline, .fantasy-frontpage .stroke-header, .fantasy-frontpage .leaderboard-table th, .fantasy-frontpage .number-of-games, .fantasy-frontpage .sub-headline, .fantasy-frontpage .compete-text, .fantasy-frontpage .points-table th, .fantasy-frontpage .custom-leaderboard-button, .fantasy-frontpage a[href="/fantasy/rules"]', fantasyLabels),
  { id: 'fantasy.season', module: 'fantasy', selector: '.fantasy-frontpage .season-headline, .fantasy-frontpage .season-standing-tabs > .tab, .fantasy-frontpage .leaderboard-headline, .fantasy-frontpage .about-season > .sub-headline, .fantasy-frontpage .about-season > .stroke-header', translate: fantasySeason },
  { id: 'fantasy.month', module: 'fantasy', selector: '.fantasy-frontpage .month-text', translate: dateText },
  { id: 'fantasy.summary', module: 'fantasy', selector: '.fantasy-frontpage .summary', translate: fantasySummary },
  exact('fantasy.descriptions', 'fantasy', '.fantasy-frontpage .partner-game-text, .fantasy-frontpage .season-info, .fantasy-frontpage .season-info > .bold, .fantasy-frontpage .empty-custom-leaderboard > div', fantasyDescriptions),
  exact('fantasy.search', 'fantasy', '.fantasy-frontpage .admin-input-search > input[placeholder]', { 'Search for user ...': '搜索用户…' }, 'placeholder'),
  { id: 'fantasy.starts', module: 'fantasy', selector: '.fantasy-frontpage .play-btn', translate: text => {
    const m = /^Starts in (\d+) days?$/.exec(text); return m ? `${m[1]} 天后开始` : undefined;
  } },
  { id: 'fantasy.pagination', module: 'fantasy', selector: '.fantasy-frontpage .leaderboard-count', translate: text => {
    const m = /^of ([\d,]+)$/.exec(text); return m ? `共 ${m[1]} 条` : undefined;
  } },
  { id: 'fantasy.prize', module: 'fantasy', selector: '.fantasy-frontpage .prize-placement, .fantasy-frontpage .play-and-win-text', translate: text => {
    let m = /^(1st|2nd|3rd)$/.exec(text); if (m) return `第${m[1][0]}名`;
    m = /^Play and win up to ([\d,]+)$/.exec(text); return m ? `参与游戏，赢取最高 ${m[1]} 的奖励` : undefined;
  } },
];
