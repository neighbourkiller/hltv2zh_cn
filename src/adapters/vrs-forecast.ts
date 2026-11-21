import { exact } from '../core/rules';
import type { Rule } from '../core/types';
import { forecastLabels } from '../locales/zh-CN/vrs-forecast';
import { valveRegions } from '../locales/zh-CN/valve-ranking';
import { dateText, relativeTime } from './templates';
import { navigationRules, valveRankingRules } from './valve-ranking';

const regions: Record<string, string> = { Europe: '欧洲', Americas: '美洲', Asia: '亚洲' };
const rank = (text: string) => text.replace(/(\d+)(?:st|nd|rd|th)/g, '$1');
const place = (text: string) => `第 ${rank(text)} 名`;
const probability = '[<>]?\\d+(?:\\.\\d+)?%';

/** 仅处理已采样 UI 槽位中的完整句式；数字、实体和未知表达原样保留。 */
export function forecastText(text: string): string | undefined {
  let m = /^(?:Most likely )?Stage ([1-3])$/.exec(text);
  if (m) return `${text.startsWith('Most') ? '最可能进入' : ''}第 ${m[1]} 阶段`;
  m = /^(\d+)(?:st|nd|rd|th)(?:[–-](\d+)(?:st|nd|rd|th))?(\s*\([<>]?\d+%\))?$/.exec(text);
  if (m) return `第 ${m[1]}${m[2] ? '–' + m[2] : ''} 名${m[3] ?? ''}`;
  m = /^usually (\d+(?:st|nd|rd|th)[–-]\d+(?:st|nd|rd|th))$/.exec(text);
  if (m) return `通常为${place(m[1])}`;
  m = /^Top (\d+)$/i.exec(text); if (m) return `前 ${m[1]} 名`;
  m = /^vs (.+)$/.exec(text); if (m) return `对阵 ${m[1]}`;
  m = /^Updated (.+)$/.exec(text); if (m) { const time = relativeTime(m[1]); return time ? `${time}更新` : undefined; }
  m = /^(.+), (\d{2}:\d{2})$/.exec(text); if (m) { const date = dateText(m[1]); if (date) return `${date} ${m[2]}`; }
  m = /^(\d+) of (\d+) spots are all but settled\. (\d+) teams chase the other (\d+)\.$/.exec(text);
  if (m) return `${m[2]} 个名额中已有 ${m[1]} 个基本确定，${m[3]} 支队伍争夺剩余 ${m[4]} 个名额。`;
  m = /^Every team's chance of an invite, from ([\d,]+) simulated seasons \(([\d,]+) upcoming matches each\) played out to (.+)\. Upcoming events are played out too, with teams not yet announced drawn from the ranking\.( Top teams sometimes turn invites down, and the simulation lets them: the spot passes down the ranking, but a team's own decline does not lower its chance\.)?$/.exec(text);
  if (m) { const date = dateText(m[3]); return date ? `各队获邀概率来自 ${m[1]} 个模拟赛季，每个赛季模拟 ${m[2]} 场后续比赛，直至${date}。后续赛事也会模拟，尚未公布的参赛队伍按排名选取。${m[4] ? '模拟也考虑强队拒绝邀请的情况：名额按排名顺延，但队伍自身拒绝邀请不会降低其获邀概率。' : ''}` : undefined; }
  m = /^This ranking is our prediction of how the (.+) invitations will look like\. The ranking is looking 6 months back from (.+), so time decay is accounted for\. It includes unfinished events that will end before (.+)\. We have removed teams from organizations that already have a higher-ranked team qualified\.$/.exec(text);
  if (m) { const a = dateText(m[2]), b = dateText(m[3]); return a && b ? `此排名预测 ${m[1]} 的邀请名单，以${a}为基准回溯六个月，计入时间衰减，并包含将在${b}之前结束的未完赛赛事。同一俱乐部已有排名更高的队伍获邀时，其余队伍已被移除。` : undefined; }
  m = /^(beat|lost to) (.+) (\d+[–-]\d+)$/.exec(text); if (m) return `${m[1] === 'beat' ? '战胜' : '负于'} ${m[2]} ${m[3]}`;
  m = /^Big chance at (.+)$/.exec(text); if (m) return `${m[1]} 带来重要机会`;
  m = /^(.+) win$/.exec(text); if (m) return `${m[1]} 获胜`;
  m = /^Under way( · .+)?$/.exec(text); if (m) return `进行中${m[1] ?? ''}`;
  m = /^(?:Starts )?([A-Za-z]+ \d+(?:st|nd|rd|th)?)( · .+)?$/.exec(text);
  if (m) { const date = dateText(m[1]); if (date) return `${date}${text.startsWith('Starts') ? '开始' : ''}${m[2] ?? ''}`; }
  m = new RegExp(`^(${probability}) (?:either way|now, (up from|down from|about the same as) (${probability}) a week ago)$`).exec(text);
  if (m) return m[2] ? `当前 ${m[1]}，${({ 'up from': '高于', 'down from': '低于', 'about the same as': '约等于' } as Record<string, string>)[m[2]]}一周前的 ${m[3]}` : `无论胜负均为 ${m[1]}`;
  m = new RegExp(`^Invite chance (${probability}) however they finish$`).exec(text); if (m) return `无论最终名次如何，获邀概率均为 ${m[1]}`;
  m = new RegExp(`^Their chance (${probability})$`).exec(text); if (m) return `对方获邀概率 ${m[1]}`;
  m = /^(.+) · meet in (\d+%) of seasons$/.exec(text); if (m) return `${m[1]} · 在 ${m[2]} 的模拟赛季中交手`;
  m = /^(Where (?:the team finishes|they finish) in )(the|Europe's|Americas'|Asia's) invite order(?:: half the simulations end better, half worse\. "Usually" is the range of 8 in 10 simulations\.)?$/.exec(text);
  if (m) return `在${({ the: '', "Europe's": '欧洲', "Americas'": '美洲', "Asia's": '亚洲' } as Record<string, string>)[m[2]]}邀请顺序中的名次${text.includes(':') ? '：一半模拟结果更好，另一半更差。“通常”表示覆盖八成模拟结果的范围。' : ''}`;
  m = /^Invited in ([\d,]+) of the ([\d,]+) simulated seasons\.$/.exec(text); if (m) return `在 ${m[2]} 个模拟赛季中，有 ${m[1]} 个赛季获邀。`;
  m = /^(\d+(?:st|nd|rd|th))( or lower)? in ([<>]?\d+%) of seasons, (always an invite|no invite|\d+% invited)$/.exec(text);
  if (m) return `${m[3]} 的模拟赛季中为${place(m[1])}${m[2] ? '或更低' : ''}，${m[4] === 'always an invite' ? '均获邀' : m[4] === 'no invite' ? '均未获邀' : m[4].replace(' invited', ' 获邀')}`;
  m = /^([A-Za-z]+ \d+(?:st|nd|rd|th)?): ([<>]?\d+%)$/.exec(text); if (m) { const d = dateText(m[1]); if (d) return `${d}：${m[2]}`; }
  m = /^(.+) decides most: ([<>]?\d+%) if they finish (.+), ([<>]?\d+%) if (.+)\.$/.exec(text);
  if (m && /^\d+(?:st|nd|rd|th)(?:[–-]\d+(?:st|nd|rd|th))?$/.test(m[3]) && /^\d+(?:st|nd|rd|th)(?:[–-]\d+(?:st|nd|rd|th))?$/.test(m[5])) return `${m[1]} 最为关键：获得${place(m[3])}时为 ${m[2]}，${place(m[5])}时为 ${m[4]}。`;
  m = /^No single event, match or rival moves their chance much from ([<>]?\d+%)\.$/.exec(text); if (m) return `单项赛事、比赛或竞争对手的结果都难以使 ${m[1]} 的获邀概率明显变化。`;
  m = /^Their invite is all but certain; the stage is still open: (Stage [1-3] [<>]?\d+(?:\.\d+)?%(?:, Stage [1-3] [<>]?\d+(?:\.\d+)?%)*)\.$/.exec(text);
  if (m) return `获邀已基本确定，但起始阶段尚未确定：${m[1].replace(/Stage ([1-3])/g, '第 $1 阶段')}。`;
  m = /^(.+) is their closest rival: ([<>]?\d+%) if (.+) misses out, ([<>]?\d+%) if it gets in\.$/.exec(text);
  if (m && m[1] === m[3]) return `${m[1]} 是最直接的竞争对手：对方落选时自身获邀概率为 ${m[2]}，对方获邀时为 ${m[4]}。`;
  m = /^They need (.+) to miss the top (\d+) at (.+): ([<>]?\d+%) if so, ([<>]?\d+%) if not\.$/.exec(text);
  if (m) return `需要 ${m[1]} 未能进入 ${m[3]} 的前 ${m[2]} 名：达成时获邀概率为 ${m[4]}，否则为 ${m[5]}。`;
  m = /^They need (.+) not to win (.+): ([<>]?\d+%) if so, ([<>]?\d+%) if not\.$/.exec(text);
  if (m) return `需要 ${m[1]} 未能在 ${m[2]} 夺冠：达成时获邀概率为 ${m[3]}，否则为 ${m[4]}。`;
  m = /^A deep run: (.+)\.$/.exec(text);
  if (m) {
    const parts = m[1].split(', ').map(part => {
      const p = /^a (?:top (\d+)|win) at (.+)$/.exec(part);
      return p ? `在 ${p[2]} ${p[1] ? '进入前 ' + p[1] + ' 名' : '夺冠'}` : undefined;
    });
    if (parts.every(Boolean)) return `取得佳绩：${parts.join('，')}。`;
  }
  m = /^(A deep run at both events|No deep run at either event|\d+(?:st|nd|rd|th)[–-]\d+(?:st|nd|rd|th) at both events) \((\d+%) of seasons\)$/.exec(text);
  if (m) return `${m[1].startsWith('A deep') ? '两项赛事均取得佳绩' : m[1].startsWith('No deep') ? '两项赛事均未取得佳绩' : '两项赛事均获' + place(m[1].split(' at')[0])}（${m[2]} 的模拟赛季）`;
  m = /^Backtest of (.+)\.$/.exec(text); if (m) { const d = dateText(m[1]); if (d) return `${d}回测。`; }
  m = /^We replayed (\d+) past invite lists from (\d{4}) and (\d{4}), hiding every result from (\d+) to (\d+) weeks before each cutoff, and checked the chances shown then against the teams actually invited\.$/.exec(text);
  if (m) return `回测了 ${m[2]} 年和 ${m[3]} 年的 ${m[1]} 份历史邀请名单，隐藏每次截止日前 ${m[4]} 至 ${m[5]} 周的全部赛果，将当时的预测概率与实际获邀队伍对照。`;
  m = /^On the (\d+) lists where few teams turned their invite down, (\d+%) of the teams holding the top spots a week before the cutoff were invited; eight weeks out, (\d+%)\. Chances under (\d+%) have come in within two points; those above (\d+%) a few points low\.$/.exec(text);
  if (m) return `在拒绝邀请较少的 ${m[1]} 份名单中，截止日前一周占据邀请名额的队伍有 ${m[2]} 最终获邀，提前八周时则为 ${m[3]}。低于 ${m[4]} 的预测与实际相差不超过两个百分点，高于 ${m[5]} 的预测则低估了几个百分点。`;
  return dateText(text);
}

export function forecastTooltip(text: string): string | undefined {
  let m = /^Invite chances now against the first simulation recorded on (.+), with each team's own matches since then, and the events it joined or left\.$/.exec(text);
  if (m) { const d = dateText(m[1]); if (d) return `对比当前获邀概率与${d}首次记录的模拟结果，并列出此后各队自身的比赛及参加或退出的赛事。`; }
  m = /^Invite chance if they (finish top (\d+)|reach the final|win it), and if not$/.exec(text);
  if (m) return `${m[2] ? '进入前 ' + m[2] + ' 名' : m[1] === 'reach the final' ? '进入决赛' : '夺冠'}和未达成时的获邀概率`;
  m = /^Their VRS points at the cutoff in the middle season, usually ([\d,]+[–-][\d,]+)\. They have ([\d,]+) today and ([\d,]+) if nobody plays again\.$/.exec(text);
  if (m) return `截止日 VRS 积分的中位数，通常在 ${m[1]} 之间。当前为 ${m[2]}，若所有队伍均不再比赛则为 ${m[3]}。`;
  m = /^The points of the last team invited(?: from (Europe|Americas|Asia))?, in the middle season\.$/.exec(text);
  if (m) return `${m[1] ? regions[m[1]] : ''}最后一支获邀队伍积分的中位数。`;
  m = /^Enough to finish above the last team invited(?: from (Europe|Americas|Asia))? in 9 seasons of 10\. Their projected points (clear it by ([\d,]+)|are ([\d,]+) short of it)\.$/.exec(text);
  if (m) return `在九成模拟赛季中足以超过${m[1] ? regions[m[1]] : ''}最后一支获邀队伍的积分线。该队预测积分${m[3] ? '高出 ' + m[3] : '还差 ' + m[4]} 分。`;
  m = /^How far their points end above \(\+\) or below \(−\) those of the last team invited(?: from (Europe|Americas|Asia))?, in the middle season\. Usually between ([+−\d,]+) and ([+−\d,]+)\.$/.exec(text);
  if (m) return `截止时相对${m[1] ? regions[m[1]] : ''}最后一支获邀队伍的积分差中位数，正数为领先，负数为落后。通常在 ${m[2]} 至 ${m[3]} 之间。`;
  m = /^Where they would be at the cutoff if no team played another match, with only older results losing weight\.(?: That alone moves them from (\d+(?:st|nd|rd|th)) today to (\d+(?:st|nd|rd|th))\.)?$/.exec(text);
  if (m) return `假设所有队伍均不再比赛，仅计旧成绩权重衰减时的截止日排名。${m[1] ? '仅此变化就使该队从当前' + place(m[1]) + '变为' + place(m[2]) + '。' : ''}`;
  m = /^Their middle finish across the simulated seasons: half end better, half worse\.(?: The matches ahead (take|lift) them to (\d+(?:st|nd|rd|th)): (the teams around them tend to gain more|they tend to gain more than the teams around them)\.)?$/.exec(text);
  if (m) return `模拟赛季最终名次的中位数：一半结果更好，另一半更差。${m[1] ? '后续比赛使该队来到' + place(m[2]) + '：' + (m[3].startsWith('the teams') ? '附近队伍的收益往往更多。' : '该队的收益往往高于附近队伍。') : ''}`;
  m = /^Their chance of beating (.+), the team rated (next strongest|strongest), in a match as the simulation plays it\. Every team's form varies from season to season, so favourites lose more often than the strengths alone say\.$/.exec(text);
  if (m) return `模拟比赛中击败实力${m[2] === 'strongest' ? '第一' : '第二'}的 ${m[1]} 的概率。各队状态随模拟赛季变化，因此强队爆冷失利的频率高于仅按实力计算的结果。`;
  return forecastText(text);
}

const labels = [
  '.vrs-simulation-toggle', '.vrs-what-if-open', '.vrs-what-if-title', '.vrs-what-if-hint', '.vrs-what-if-dialog-head > .vrs-story-faded',
  '.vrs-what-if-group', '.vrs-what-if-apply', '.vrs-what-if-pick > option', '.vrs-simulation .team-col',
  '.vrs-simulation .header-with-tooltip', '.vrs-simulation .qualify-verdict', '.vrs-simulation .likely-stage',
  '.vrs-story-title', '.vrs-story-hint', '.vrs-stake-with', '.vrs-stake-without', '.vrs-mover-text > .vrs-story-faded', '.vrs-movers-empty > .vrs-story-faded',
  '.vrs-details-title', '.vrs-details-headline', '.vrs-chart-legend', '.vrs-points-fact > .vrs-story-faded', '.vrs-standing-fact > .vrs-story-faded',
  '.vrs-match-number', '.vrs-finish-table th', '.vrs-finish-table td.vrs-story-faded', '.vrs-details-more > .moreLink',
  '.vrs-power-ranking-title', '.vrs-track-record-title', '.vrs-track-record-table th',
].join(',');
const templates = [
  labels, '.ranking-description', '.vrs-simulation .updated-ago', '.vrs-simulation .updated-at', '.vrs-race', '.vrs-change-result',
  '.vrs-simulation .projected-rank', '.vrs-simulation .projected-range', '.vrs-simulation th.stage', '.vrs-details-stage > .vrs-story-faded',
  '.vrs-mover-positions > span', '.vrs-standing-value', '.vrs-cut-line', '.vrs-details-note', '.vrs-match-date', '.vrs-what-if-when',
  '.vrs-key-event-text > .vrs-story-faded', '.vrs-team-match > div > .vrs-story-faded',
  '.vrs-what-if-when > span',
  '.vrs-combined-line > span', '.vrs-power-ranking-intro', '.vrs-track-record-intro', '.vrs-track-record-summary', '.vrs-track-record-source',
].join(',');

export const vrsForecastRules: Rule[] = [
  ...navigationRules('vrs-forecast'),
  // 复用列表中的积分、标记及底部说明规则；标题由本页独立处理，避免误译赛事名。
  ...valveRankingRules.filter(r => ['valve-ranking.labels', 'valve-ranking.old-roster', 'valve-ranking.buttons', 'valve-ranking.point-brand', 'valve-ranking.points'].includes(r.id))
    .map(r => ({ ...r, id: 'forecast.' + r.id, module: 'vrs-forecast' as const })),
  exact('forecast.regions', 'vrs-forecast', '.valve-ranking-region-header, #valve-region-selector .sub-region-valve-name, .ranked-team .teamLine > .region', valveRegions),
  exact('forecast.labels', 'vrs-forecast', labels, forecastLabels),
  exact('forecast.spot-heading', 'vrs-forecast', '.valve-ranking-region-spot-header', forecastLabels),
  exact('forecast.explanations', 'vrs-forecast', '.vrs-tooltip, .vrs-power-ranking-intro', forecastLabels),
  { id: 'forecast.tooltips', module: 'vrs-forecast', selector: '.vrs-tooltip', translate: forecastTooltip },
  { id: 'forecast.titles', module: 'vrs-forecast', selector: '.vrs-story-title, .vrs-stake-head, .vrs-position-column, .vrs-trend-column, .qualify-verdict', target: 'title', translate: forecastTooltip },
  exact('forecast.mover-title-labels', 'vrs-forecast', 'a.vrs-story-team.vrs-mover', forecastLabels, 'title'),
  { id: 'forecast.mover-title', module: 'vrs-forecast', selector: 'a.vrs-story-team.vrs-mover', target: 'title', translate: forecastText },
  exact('forecast.close', 'vrs-forecast', '.vrs-what-if-close', forecastLabels, 'aria-label'),
  { id: 'forecast.title', module: 'vrs-forecast', selector: '.regional-ranking-header-text', translate: text => {
    const m = /^(.+) ranking on (.+)$/.exec(text); if (!m) return;
    const date = dateText(m[2]); return date ? `${m[1]} 邀请排名（${date}）` : undefined;
  } },
  { id: 'forecast.templates', module: 'vrs-forecast', selector: templates, translate: forecastText },
];
