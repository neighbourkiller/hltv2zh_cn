import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { eventLabels, eventStages, eventTooltips, eventWeekdays } from '../locales/zh-CN/events';
import { dateText } from './templates';

/** 核对 ESL Pro League S24 与 Thunderpick 2026 实页，固定文案只匹配直属 Text。 */
export const eventDetailRules: Rule[] = [
  exact('event-detail.sidebar', 'event-detail', '.sidebar-con .sidebar-headline, .sidebar-con .sidebar-single-line-item', eventLabels),
  exact('event-detail.labels', 'event-detail', [
    '.event-page .section-header', '.event-page .section-header > span',
    '.event-header-component th.headline', '.event-page .meta-header', '.event-page .format-header',
    '.event-page .moneyShare-row-left', '.event-page .event-hub-indicator',
    '.event-page .show-lineups', '.event-page .toggle-swiss-group-display', '.event-page .toggle-group-swiss-simulator',
    '.event-page .team-box .event-text', '.event-page a.button-more[href^="/news/archive"]',
    '.event-page .playing-info-flex > span', '.event-page .playing-info-flex > div', '.event-page .highlight-overview-header',
    '.event-page .vrs-event-stakes-head > span', '.event-page .vrs-popup',
    '.event-page .event-groups-container .table-header',
    '.event-page .eventMeta td > a[href^="/events?"]',
  ].join(','), { ...eventLabels, ...eventTooltips }),
  exact('event-detail.stages', 'event-detail', '.event-page .slotted-bracket-header > .name, .event-page .round-header, .event-page .format-header, .event-page .section-header > span', eventStages),
  { id: 'event-detail.group', module: 'event-detail', selector: '.event-page .slotted-bracket-header > .name', translate: text => {
    const m = /^Group ([A-Z])$/.exec(text); return m ? `${m[1]} 组` : undefined;
  } },
  { id: 'event-detail.replacement', module: 'event-detail', selector: '.event-page .team-box .event-text', translate: text => {
    const m = /^Team Replacement(?: \(VRS (EU|Europe|AM|Americas|AS|Asia|Global)\))?$/.exec(text);
    const regions: Record<string, string> = { EU: '欧洲', Europe: '欧洲', AM: '美洲', Americas: '美洲', AS: '亚洲', Asia: '亚洲', Global: '全球' };
    return m ? `递补参赛${m[1] ? `（VRS ${regions[m[1]]}）` : ''}` : undefined;
  } },
  exact('event-detail.location', 'event-detail', '.event-page .event-header-component td.location .text-ellipsis, .event-page .eventMeta td:has(> img.flag)', { Malta: '马耳他' }),
  exact('event-detail.location-title', 'event-detail', '.event-page .eventMeta td:has(> img.flag)', { Malta: '马耳他' }, 'title'),
  exact('event-detail.invite-final', 'event-detail', '.event-page .vrs-event-stakes-head > .vrs-event-stakes-with', { Final: '进入决赛' }),
  exact('event-detail.weekdays', 'event-detail', '.event-page .time-day-of-week', eventWeekdays),
  exact('event-detail.placeholder', 'event-detail', '.event-page .team-tbd > .team-name', { TBD: '待定' }),
  exact('event-detail.tooltips', 'event-detail', '.event-page .round-header, .event-page .slotted-bracket-header .toggle, .event-page td[title], .event-page .vrs-event-stakes-head', eventTooltips, 'title'),
  { id: 'event-detail.date', module: 'event-detail', selector: '.event-header-component .eventdate span[data-time-format], .event-page .eventMeta td [data-time-format="MMM do yyy"]', translate: dateText },
  { id: 'event-detail.placement', module: 'event-detail', selector: '.event-page .placement > div:not([class])', translate: text => {
    const m = /^(\d+)(?:\s*[-–]\s*(\d+))?(?:st|nd|rd|th)$/.exec(text);
    return m ? `第 ${m[1]}${m[2] ? '–' + m[2] : ''} 名` : undefined;
  } },
  { id: 'event-detail.club-share', module: 'event-detail', selector: '.event-page .club-share', translate: text => {
    const m = /^(\+\s*)?Club share:\s*(\$[\d,]+(?:\.\d+)?)$/i.exec(text);
    return m ? `${m[1] ?? ''}俱乐部分成：${m[2]}` : undefined;
  } },
  { id: 'event-detail.day', module: 'event-detail', selector: '.event-page .highlight-group-name, .event-page .highlight-overview-header > .overview-right, .event-page .gallery-name', translate: text => {
    const m = /^Day (\d+)$/.exec(text); return m ? `第 ${m[1]} 天` : undefined;
  } },
  { id: 'event-detail.counts', module: 'event-detail', selector: '.event-page .highlight-group-count, .event-page .thumbnail-view-count', translate: text => {
    const m = /^([\d,]+) (highlights?|views?)$/.exec(text);
    return m ? `${m[1]} ${m[2].startsWith('highlight') ? '段集锦' : '次观看'}` : undefined;
  } },
  { id: 'event-detail.invite-more', module: 'event-detail', selector: '.event-page .vrs-event-stakes-more', translate: text => {
    const m = /^(\d+) more invites? (?:is|are) affected$/.exec(text); return m ? `另有 ${m[1]} 个邀请名额受影响` : undefined;
  } },
  { id: 'event-detail.invite-top', module: 'event-detail', selector: '.event-page .vrs-event-stakes-head > .vrs-event-stakes-with', translate: text => {
    const m = /^Top (\d+)$/i.exec(text); return m ? `前 ${m[1]} 名` : undefined;
  } },
  { id: 'event-detail.invite-tooltip', module: 'event-detail', selector: '.event-page .vrs-event-stakes-head', target: 'title', translate: text => {
    const m = /^Invite chance if they finish top (\d+) here, and if not$/.exec(text);
    return m ? `在本赛事进入前 ${m[1]} 名和未进入时的获邀概率` : undefined;
  } },
  { id: 'event-detail.format', module: 'event-detail', selector: '.event-page .format-data', translate: text => {
    // 按整行的已知赛制匹配，未知说明及其中的实体保留原文。
    const formats: Record<string, string> = { GSL: 'GSL 双败淘汰', Swiss: '瑞士轮', 'Single elimination': '单败淘汰', 'Double elimination': '双败淘汰', 'Round robin': '循环赛', 'Grand final': '总决赛', '3rd place decider match': '季军赛' };
    let changed = false;
    const value = text.split('\n').map(line => {
      const m = /^(\s*(?:[-*]\s*)?)(GSL|Swiss|Single elimination|Double elimination|Round robin|Grand final|3rd place decider match)\s+Bo(1|3|5|7)(\s*)$/i.exec(line);
      if (!m) return line;
      const key = Object.keys(formats).find(key => key.toLowerCase() === m[2].toLowerCase())!;
      changed = true; return `${m[1]}${formats[key]} BO${m[3]}${m[4]}`;
    }).join('\n');
    return changed ? value : undefined;
  } },
];
