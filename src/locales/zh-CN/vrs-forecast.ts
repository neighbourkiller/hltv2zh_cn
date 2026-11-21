/** 2026-10-26：8295 普通赛事与 8302 Major 实页的固定 UI。 */
export const forecastLabels = {
  'Show the ranking without simulation': '查看未模拟的排名', 'Simulate upcoming matches': '模拟后续比赛',
  'What if…': '假设结果…', 'Pick results and see every chance with them': '选择比赛结果，查看各队在此假设下的获邀概率',
  'Show chances': '查看概率', Close: '关闭', Either: '任意结果', 'Any winner': '任意冠军', 'Event winners': '赛事冠军',
  'Since yesterday': '自昨日以来', 'then → now': '此前 → 现在', 'On the rise': '预计上升', Slipping: '预计下滑',
  'today → projected': '当前 → 预测', 'Events that decide it': '关键赛事',
  "No matches of their own: others' results moved it": '自身未参赛，概率变化来自其他队伍的赛果',
  "Rivals' older results expire": '竞争对手的旧成绩到期', 'Older results expire': '旧成绩到期',
  'Gains in the matches ahead': '后续比赛带来收益', 'Rivals gain more in the matches ahead': '竞争对手在后续比赛中收益更多',
  'No contender is projected to climb 3 or more places by the cutoff.': '预计没有竞争队伍会在截止日前上升 3 名或以上。',
  'No team near the cut is projected to drop 3 or more places by the cutoff.': '预计出线线附近没有队伍会在截止日前下降 3 名或以上。',
  Team: '战队', Teams: '队伍数', 'Qualify %': '获邀概率', 'Without declines': '无递补概率', 'Projected rank': '预测排名',
  Clinched: '基本锁定', Out: '基本无缘', 'Not qualified': '未获邀',
  'Projected points': '预测积分', 'Invite line': '获邀线', 'Safe at': '稳妥积分线', Margin: '积分差', Standing: '排名情况',
  Today: '当前', 'If nobody plays again': '不再比赛时', Projected: '预测', 'Most often': '最常见名次',
  'Strength rank': '实力排名', 'VRS rank': 'VRS 排名', Strength: '实力', 'vs top 10': '对阵前十',
  'How strong we rate them': '战队实力评估', 'How good are these chances?': '概率预测有多准？',
  'Invite chance by day': '每日获邀概率', 'Scheduled matches: invite chance after each result': '后续赛程：不同赛果下的获邀概率',
  'Live now': '进行中的赛事', 'Upcoming events': '后续赛事',
  'Who to root for: invite chance if it happens, and if not': '值得支持的赛果：发生与未发生时的获邀概率',
  'Rivals for a spot: invite chance when each misses out, and when it gets in': '名额竞争对手：对方落选与获邀时的自身概率',
  Invited: '获邀', 'Not invited': '未获邀', Wins: '胜率', 'If won': '获胜时', 'If lost': '失利时',
  'If so': '发生时', 'If not': '未发生时', 'If out': '对方落选', 'If in': '对方获邀',
  Finish: '名次', 'How often': '出现比例', 'Invite chance': '获邀概率',
  Final: '进入决赛', Win: '夺冠', Else: '未达成',
  'HLTV Team profile': 'HLTV 战队档案', 'VRS ranking details': 'VRS 排名详情', 'Link to this team': '本队直达链接',
  'Chance shown': '预测概率', 'Average shown': '平均预测', 'Actually invited': '实际获邀',
  'Their invite is all but certain: nothing ahead moves it much.': '获邀已基本确定，后续赛果对其概率影响很小。',
  'They are all but out of the race: nothing ahead lifts them much.': '已基本无缘获邀，后续赛果也难以明显提升概率。',
  'How often the team got an invite across the simulated seasons.': '该队在全部模拟赛季中获邀的比例。',
  "How often the team ranked into a spot itself, before any team above it turned its invite down or broke up. Qualify % adds the spots passed down to it: the gap between the two is what others' declines give it.":
    '在排名更高的队伍拒绝邀请或解散之前，该队凭自身排名获得名额的比例。“获邀概率”还计入递补名额，两者之差就是其他队伍放弃邀请带来的收益。',
  "Where the simulation rates them among every ranked team. The strength is fitted to the last 18 months' maps and their round scores, month by month: a team that changed is rated by its recent form, a steady one by its whole record, and a rebuilt roster by its players. Every simulated match is played from it.":
    '该队在所有上榜队伍中的模拟实力排名。模型按月份拟合过去 18 个月的地图及回合比分：有变化的队伍侧重近期状态，稳定队伍参考完整记录，重组阵容则依据选手评估。每场模拟比赛均采用此实力。',
  'Their place by VRS points now. The VRS also rewards prize money and the opponents beaten, and keeps results for six months, so it can differ from how strong a team is today.':
    '该队当前按 VRS 积分的排名。VRS 还考虑奖金、击败的对手及过去六个月的成绩，因此可能与当前实力不同。',
  "Their average chance of beating each of the 10 teams rated strongest, other than themselves, in a match as the simulation plays it. Every team's form varies from season to season, so favourites lose more often than the strengths alone say.":
    '模拟比赛中，该队对阵实力前十的各支队伍（不含自身）的平均胜率。各队状态会随模拟赛季变化，因此强队爆冷失利的频率高于仅按实力计算的结果。',
  'The position they end in more often than any other: the tallest bar of the chart. Projected is the middle season, and when no position holds half the seasons the two can differ.':
    '出现次数最多的最终名次，即图中最高的柱。“预测”使用中位数；当没有任何名次占到一半模拟赛季时，两者可能不同。',
  "The teams above, strongest first. The simulation plays every match from these strengths: a fit to the last 18 months' maps that follows each team's form month by month, with a rebuilt roster rated by its players. Invites still go by VRS points, so a team rated well above its VRS rank tends to climb in the simulated seasons, and one rated below it to slip.":
    '以上队伍按实力由强到弱排列。模拟比赛采用根据过去 18 个月地图表现拟合的实力，逐月跟踪各队状态，重组阵容则依据选手评估。邀请仍按 VRS 积分发放，因此实力显著高于 VRS 排名的队伍往往在模拟中上升，反之则下滑。',
};
