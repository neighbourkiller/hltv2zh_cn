import { roles } from './players';
import { lastPeriods, matchFilters } from './shared';

/** 完整指标解释；比赛普通/经济调整列来自 2026-10-09 实页。
 * 专项战队表头解释来自 NEXT 1.7.0，当前实页布局验收边界见阶段 C 记录。 */
export const statisticsTitles: Record<string, string> = {
  'Kills minus deaths per 24 rounds.': '每 24 回合的击杀数减去阵亡数。',
  "Actual duel win minus economically expected duel win: the share of duels the player won above what an average player would win from the same duels. Each duel's chance of being won comes from the equipment of the two players in it.": '实际交锋胜率减去基于装备的预期胜率，衡量选手在相同交锋中比平均水平多赢了多少。每次交锋的预期胜率由交锋双方的装备决定。',
  "How much the player moves their team's chance of winning the round, on average per round: the win probability their kills, damage, flash assists and traded deaths add, less what their deaths cost, plus their share of the bomb plants and round ends.": '选手平均每回合为战队胜率带来的变化。计入击杀、伤害、闪光助攻及阵亡后被补枪带来的增益，扣除阵亡造成的损失，再加上分摊给该选手的下包与回合结束贡献。',
  'Ratio between kills and deaths in the match.': '比赛中的击杀与阵亡比率。',
  'Ratio between kills and deaths in the match. Adjusted to compensate for economy.': '比赛中的击杀与阵亡比率，已根据经济进行调整。',
  "How much, on average, a player changed their team's chances of winning a round based on team economy, side, kills, deaths, damage, trading, and flash assists": '衡量选手平均改变战队回合获胜概率的幅度，依据战队经济、阵营、击杀、阵亡、伤害、补枪和闪光助攻。',
  'Average damage per round.': '每回合平均伤害。',
  'Average damage per round': '每回合平均伤害。',
  'Average damage per round. Adjusted to compensate for economy.': '每回合平均伤害，已根据经济进行调整。',
  'Percentage of rounds in which the player either had a kill, assist, survived or was traded.': '选手完成击杀、助攻、存活或阵亡后被队友补枪的回合占比。',
  'Percentage of rounds in which the player either had a kill, assist, survived or was traded': '选手完成击杀、助攻、存活或阵亡后被队友补枪的回合占比。',
  'Percentage of rounds in which the player either had a kill, assist, survived or was traded. Adjusted to compensate for economy.': '选手完成击杀、助攻、存活或阵亡后被队友补枪的回合占比，已根据经济进行调整。',
  'The rating tells us if the player put up above or below average numbers, with 1.00 being the average.': '评分反映选手表现高于还是低于平均水平，1.00 为平均值。',
  'Opening kills:deaths': '首杀与首死。', 'Opening eco-adjusted kills:deaths': '根据经济调整后的首杀与首死。',
  'Rounds with two or more kills': '完成两次及以上击杀的回合数。',
  Kills: '击杀数', 'Eco-adjusted kills': '根据经济调整后的击杀数', Assists: '助攻数', Death: '阵亡数',
  'Eco-adjusted deaths': '根据经济调整后的阵亡数', Headshots: '爆头数', 'Flash assists': '闪光助攻数',
  Traded: '阵亡后被队友补枪的次数', 'Eco-adjusted traded deaths': '根据经济调整后的被补枪阵亡数',
  'Round win %': '回合胜率',
  'Clutches won': '残局获胜次数',
  'Flash assists, a teammate killed an opponent while blinded, or pushed out of position by a flash by this player.': '闪光助攻：队友击杀了被该选手闪光弹致盲或逼离原位的敌人。',
  'Percentage of rounds where the team won the opening duel': '战队赢得首次交锋的回合占比。',
  "Multikills per round by the team's players": '战队选手每回合完成的多杀次数。',
  'Round win % after getting the opening kill': '取得首杀后的回合胜率。',
  'Round win % after giving the opening death': '遭遇首死后的回合胜率。',
  "Percentage of team's deaths that were traded": '战队阵亡后被队友补枪的比例。',
  'Damage per round with HE grenades, Molotovs & Incendiaries': '高爆手雷和燃烧弹造成的每回合伤害。',
  'Flash assists / round (A flash assist happens when an opponent blinded by this player was killed while affected by the flash)': '每回合闪光助攻；敌人在被该选手致盲期间被击杀时计为闪光助攻。',
  'Total number of pistol rounds won and lost': '手枪局获胜和失利的总数。',
  'Percentage of pistol rounds won': '手枪局胜率。',
  'Percentage of 2nd round wins after winning the pistol round': '赢得手枪局后，第 2 回合的胜率。',
  'Percentage of 2nd round wins after losing the pistol round': '输掉手枪局后，第 2 回合的胜率。',
};

export const playerStatisticsTabs: Record<string, string> = {
  Overview: '概览', Entrying: roles.Entrying, Trading: roles.Trading, Opening: roles.Opening,
  Closing: roles.Closing, Sniping: roles.Sniping, Flashbangs: '闪光弹', Grenades: '投掷物',
};

export const playerStatisticsColumns: Record<string, string> = {
  'Net Kills /24': '净击杀 /24', 'Eco Swing': '交锋胜率偏差', 'Rnd Swing': '回合胜率影响',
};

export const statisticsFilterLabels: Record<string, string> = {
  ...matchFilters, ...lastPeriods,
  'Match filters': '比赛筛选', 'Advanced filters': '高级筛选', '+ Add filter': '+ 添加筛选',
  Event: '赛事', 'Match type': '比赛阶段', Time: '时间', 'Opp. rank': '对手排名', Map: '地图', Version: '游戏版本',
  'Min. maps per player': '选手最少地图数', All: '全部', Both: '全部',
  'Grand final': '总决赛', Playoffs: '淘汰赛', 'Pre-playoff': '淘汰赛前阶段',
  Year: '年份', Dates: '日期范围', From: '开始', To: '结束', Apply: '应用',
  'Hides players with fewer maps in this filter': '隐藏地图数低于此门槛的选手',
  'No minimum': '不限', '(default)': '（默认）', Other: '自定义', maps: '张地图',
  Role: '选手位置', 'Compared to': '对比基准', Everyone: '所有选手', AWPers: '狙击手', Riflers: '步枪手', IGLs: '指挥',
  Side: '阵营', 'Own buy': '己方起枪', 'Opponent buy': '对手起枪',
  'Full buy': '全起', 'Half buy': '半起', Eco: '经济局',
  'Round result': '回合结果', 'Won rounds': '获胜回合', 'Lost rounds': '失利回合',
  'Map result': '地图结果', 'Won maps': '获胜地图', 'Lost maps': '失利地图',
  Pistol: '手枪局', 'Pistol rounds': '手枪局', 'After pistol': '手枪局后',
  'After won pistol': '赢下手枪局后', 'After lost pistol': '输掉手枪局后',
  'Opening duel': '首杀交锋', 'Won opening duel': '取得首杀', 'Lost opening duel': '遭遇首死', 'No opening duel': '未参与首杀交锋',
  Segment: '回合阶段', Regulation: '常规时间', Overtime: '加时赛',
  'Team opening': '队伍首杀', 'Team won opening duel': '队伍取得首杀', 'Team lost opening duel': '队伍遭遇首死',
  'Hero gun': '英雄枪', 'Teammate has it': '队友持有英雄枪', 'No hero gun': '无英雄枪',
  'Multi-kill': '多杀', 'No multi-kill': '无多杀', 'Fast multi-kill': '快速多杀', Kills: '击杀数',
};

export const specialtyLabels: Record<string, string> = {
  Team: '战队', Teams: '战队', Player: '选手', Maps: '地图', Rounds: '回合', 'K-D Diff': 'K-D 差',
  Thrown: '投掷数', Blinded: '致盲', 'Opp Flashed': '致盲敌人数', Diff: '差值', FA: '闪光助攻',
  Success: '成功率', Attempts: '参与率', 'RW%': '回合胜率', OpK: '首杀率', MultiK: '每回合多杀',
  'Traded%': '被补枪率', 'Won - Lost': '胜 - 负', 'Pistol win %': '手枪局胜率',
  'Round 2 conv': '第 2 回合转化率', 'R2 conv': '次回合转化',
  'Round 2 break': '第 2 回合翻盘率', 'R2 break': '次回合翻盘',
  Team1: '战队1', Team2: '战队2', Date: '日期', Map: '地图', Event: '赛事', Winner: '胜者', W: '胜',
  'Event name': '赛事名称', 'Opponent lineup': '对手阵容',
  Performance: '表现', Economy: '经济', Heatmaps: '热力图', Lineup: '阵容',
  'Fast multi-kills only': '仅显示快速多杀', 'Fast MK only': '仅快速多杀',
  'Fast multi-kill:': '快速多杀：',
};
