export const hltvDetailLabels = {
  'Matches included in Form subranking': '计入状态分项排名的比赛',
  'Events included in Recent LANs subranking': '计入最近线下赛分项排名的赛事',
  Event: '赛事', Lineup: '阵容', Relevance: '相关度', Match: '比赛', Type: '类型', Result: '赛果',
  LAN: '线下赛', Online: '线上赛', 'vs.': '对阵',
};
export const valveDetailLabels = {
  'LAN wins': '线下胜场', 'Opponent network': '对手网络', 'Opp. network': '对手网络',
  'Bounty offered': '提供悬赏', 'Bounty collected': '收获悬赏', 'Head to head': '历史交锋', H2H: '交锋', p: '分',
  'Most recent LAN wins': '最近的线下胜场', 'LAN wins explanation': '线下胜场计算说明',
  'Opponent network, 10 best wins': '对手网络：价值最高的 10 场胜利', 'Opponent network explanation': '对手网络计算说明',
  'Bounty offered, 10 best prize winnings': '提供悬赏：奖金最高的 10 次获奖', 'Bounty offered explanation': '提供悬赏计算说明',
  'Bounty collected, 10 best wins': '收获悬赏：价值最高的 10 场胜利', 'Bounty collected explanation': '收获悬赏计算说明',
  'Head to head matches': '交锋比赛', 'Head to head explanation': '历史交锋计算说明',
  Date: '日期', Opponent: '对手', Event: '赛事', Recency: '时效权重', 'Pts.': '积分',
  'Event value': '赛事价值', 'Prize won': '获得奖金', 'Opp. Bounty': '对手悬赏', 'W/L': '胜/负', W: '胜', L: '负',
  'Recency:': '时效权重：', 'Opponent network:': '对手网络：', 'Event value:': '赛事价值：', 'Prize won:': '获得奖金：',
  'Opponent bounty:': '对手悬赏：', "The two teams' ranking:": '双方排名：',
  'All teams get an additional 400 starting points.': '所有战队额外获得 400 点初始积分。',
};
/** 逐段对应实页解释；仅解释站点已有模型，不重新计算其数据。 */
export const valveDetailExplanations = {
  'The "LAN win" component of the VRS finds the 10 most recent LAN wins. There is only one factor involved:':
    'VRS 的“线下胜场”分项取最近 10 场线下胜利，仅考虑一个因素：',
  'A win counts for 100% if it is within the last month. From there and 5 months back a match will lose its value down to zero.':
    '最近一个月内的胜利按 100% 计入；再往前的五个月内，比赛权重逐步衰减至零。',
  'The "opponent network" component of the VRS finds the 10 best wins by 3 different factors:':
    'VRS 的“对手网络”分项按三个因素选取价值最高的 10 场胜利：',
  "The value of a win depends on the opponents' network. The opponent network represent how many different teams a team has won against recently. The factor is a value between zero and one, where 1 means the team is amongst the most valuable teams to beat.":
    '胜利价值取决于对手网络，即对手近期击败过多少支不同的战队。该系数介于 0 和 1 之间，1 表示击败该对手的价值处于最高的一档。',
  'A win will be worth more if it is won in a valuable event, in regards to prize pool.':
    '按奖金池衡量，在价值更高的赛事中获胜，胜利价值也更高。',
  'The "Bounty offered" component of the VRS finds the 10 best prize money wins and factor in the recency.':
    'VRS 的“提供悬赏”分项取奖金最高的 10 次获奖，并考虑时效权重。',
  'Prize money counts for 100% if it is within the last month. From there and 5 months back the prize money will lose its value down to zero.':
    '最近一个月内获得的奖金按 100% 计入；再往前的五个月内，奖金权重逐步衰减至零。',
  'The more money you win, the better': '获得的奖金越多，该项表现越好。',
  'The "Bounty collected" component of the VRS finds the 10 best wins by 3 different factors:':
    'VRS 的“收获悬赏”分项按三个因素选取价值最高的 10 场胜利：',
  "The value of a win depends on the opponents' bounty. The opponent bounty represent how much money they have won recently. The factor is a value between zero and one, where 1 means the team is amongst the most valuable teams to beat.":
    '胜利价值取决于对手的悬赏，即对手近期获得的奖金。该系数介于 0 和 1 之间，1 表示击败该对手的价值处于最高的一档。',
  'A win counts 100% if it is within the last month. From there and 5 month back a match will lose its value down to zero.':
    '最近一个月内的胜利按 100% 计入；再往前的五个月内，比赛权重逐步衰减至零。',
  'The "Head to head" component of the VRS is a bit different from the other 4 components. First the other 4 components are calculated and all teams get a ranking starting point. Then the head to head calculation will go through all matches from oldest to newest. It will move points from the loser to the winner. The amount of points will be based on:':
    'VRS 的“历史交锋”分项与其他四项略有不同。先计算其他四项，为所有战队确定初始排名分数；再按时间从早到晚处理比赛，将积分从败者转移给胜者。转移量依据：',
  'If a team with a low ranking beat a team with a high ranking, they will earn many points. And on the other hand: if a team with a high ranking beat a team with a low ranking they will only gain little points.':
    '排名较低的战队击败排名较高的战队，会获得较多积分；反之，排名较高的战队击败排名较低的战队，只获得较少积分。',
  'The longer time since the match was player the fewer points will be moved.': '比赛距今越久，转移的积分越少。',
  'Note that the "Head to head" component is recalculated every time the ranking is calculated. This means that if you have beaten an opponent for 3 months ago, and they since then have improved their ranking - your wins will be worth more.':
    '每次计算排名时，“历史交锋”都会重新计算。因此，如果三个月前击败的对手此后排名提高，这场胜利的价值也会提高。',
};
