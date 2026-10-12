/** 排除内容区优先于任何词典。不要用有限人名黑名单识别实体。 */
export const protectedSelector = [
  'script', 'style', 'textarea', 'code', 'pre', 'noscript', 'iframe',
  '[contenteditable]:not([contenteditable="false"])', '[data-hltv-zh-owned]',
  '.newstext', '.news-block', '.newsitem', '.news-article', '.article-body',
  '.featured-newstext', '.featured-small-newstext', 'h1.headline', '.headertext',
  '.thread-message', '.thread-message-text', '.forum-middle', '.topic',
  // 只允许对阵图明确标记为未知战队的 UI 占位词；真实战队及战队链接仍受保护。
  '.teamName', '.team-name:not(.event-page .team-tbd > .team-name)', '.player-nick', '.playerNickname', '.matchTeamName',
  '.playerRealname', '.player-summary-stat-box-left-nickname', '.player-summary-stat-box-left-player-name',
  '.context-item-name', '.image-and-label', '.subTab-newsArticle',
  '.fantasy-frontpage .game-name', '.fantasy-frontpage .winners',
  '.fantasy-frontpage .leaderboard-table td.player', '.fantasy-frontpage .autocomplete-items',
  '.lineups-compare-playername', '.player-compare .text-ellipsis',
  '.eventname', '.event-name', '.event-name-small .text-ellipsis', '.event-hub-title',
  '.match-event', '.match-table-name-col',
  '.top-x-box > .name',
  '.ranked-team .teamLine > .name', '.ranked-team .playersLine', '.ranked-team .team-logo',
  '.ranking-vrs-event-header', '.ranking-vrs-event-logo',
  '.profile-team-name', '.team-country', '.playersBox-playernick', '.highlighted-team-name', '.biggest-map-team-container',
  '.teamProfile .profile-team-logo-container', '.teamProfile .last-5-matches img', '.chart-classic-tooltip',
  '.teamProfile .major-stickers > h2', '.teamProfile .sticker-event', '.teamProfile .sticker-version',
  '.teamProfile a[href^="/events/"]', '.ranking-details a[href^="/events/"]',
  '.valve-ranking-details table.vrs-details tbody td:nth-child(2)', '.valve-ranking-details table.vrs-details tbody td:nth-child(3)',
  '[data-livescore-current-map-score]', '[data-livescore-maps-won-for]',
  // 资料入口是 UI，仅放行统计页按钮和比赛阵容对比区明确的资料按钮。
  'a[href^="/team/"]:not(.ranked-team .more > a.moreLink)', 'a[href^="/player/"]:not(.player-summary-stat-box-left-btn):not(#lineups .lineups-compare-player-link.profile-link)', 'a[href^="/forums/threads/"]',
  'a[href^="/out"]', 'a[href^="/betting"]',
  'a[href^="/coach/"]',
].join(',');
export function protectedElement(element: Element): boolean {
  // 转会卡片的固定状态位嵌在队伍链接中，只放行该直属槽位。
  // 链接、队伍名、徽标以及新闻/论坛内的同形结构继续受保护。
  if (element.matches('.transfer .transfer-team-container[href^="/team/"] > .transfer-team-status')
    && !element.parentElement?.parentElement?.closest(protectedSelector)) return false;
  return element.closest(protectedSelector) !== null;
}

/** 地图词条识别统计页实体链接；不影响其中明确 UI 文案的其他规则。 */
export function protectedMapElement(element: Element): boolean {
  // team-tbd 只放行 TBD 文案；网站先写入真队名、稍后移除占位 class 时仍保护实体。
  if (element.closest('.team-name')) return true;
  const link = element.closest('a[href]');
  return !!link && /^\/(?:team\/\d+(?:\/|$)|stats\/(?:players|teams)\/\d+(?:\/|$)|skins\/)/.test(link.getAttribute('href') ?? '');
}
