/** 战队资料的固定 UI；核心、阵容、替补用词参考历史 1.7.0。 */
export const teamLabels: Record<string, string> = {
  Info: '资料', Roster: '阵容', Matches: '比赛', Events: '赛事', Achievements: '成就', News: '新闻', Stats: '数据',
  'Valve ranking': 'V社排名', 'World ranking': '世界排名', 'Weeks in top30 for core': '核心阵容在 TOP 30 的周数',
  'Average player age': '选手平均年龄', Coach: '教练', 'For core': '核心', 'For team': '队伍',
  'World ranking development for core': '核心阵容世界排名走势', 'World ranking development for team': '战队世界排名走势',
  'Current ranking': '当前排名', Peak: '最高排名', 'Time at peak': '最高排名持续时间', FAQ: '常见问题',
  'All Stickers': '全部贴纸', Player: '选手', Players: '队员', Status: '状态', Time: '时间', 'on team': '在队',
  Maps: '地图', coached: '执教', played: '出场', Trophies: '奖杯', Winrate: '胜率',
  'Stats from entire coach period': '执教期间全队数据', 'Stats from entire team period *': '统计包含该阵容时期的全队数据 *',
  STARTER: '首发', BENCHED: '替补', 'Highest Rank': '最高排名', 'Maps played': '出场地图数', 'Days in team': '在队天数',
  'Current win streak': '当前连胜', 'Win rate': '胜率', 'Last 3 months': '最近 3 个月',
  Date: '日期', Match: '比赛', 'Ongoing & Upcoming': '进行中及即将开始', Ended: '已结束', LAN: '线下赛',
  Placement: '名次', Tournament: '赛事', Challengers: '挑战者组', '1/4 final': '八强', '1/2 final': '四强', '1/8 final': '十六强',
  Won: '获胜', Lost: '失利', 'Map win statistics past 3 months': '最近 3 个月地图胜率数据',
  'Biggest win on map': '该图最大比分胜利', 'Biggest loss on map': '该图最大比分失利', 'Veto data': '选禁图数据',
  '% of opportunities to pick / ban': '选择 / 禁用机会中的占比', Picks: '选择', Bans: '禁用',
  'Win / draw / losses': '胜 / 平 / 负', Win: '胜', Draws: '平', Losses: '负', 'General stats': '基础数据',
  'Round win% after getting first kill': '取得首杀后的回合胜率', 'Round win% after getting first death': '被首杀后的回合胜率', 'Pistolround win%': '手枪局胜率',
  'Expand all': '展开全部', 'Collapse all': '收起全部', Core: '核心', Team: '队伍',
  'Roster timeline': '阵容时间线', Transfers: '转会', 'Last year': '最近一年', 'All time': '全部时间',
  "* Will only show stats for a player's current team period.  A player leaving and later rejoining the team will not have their previous period(s) counted.": '仅显示选手本次在队期间的数据。离队后重新加入的选手，此前的效力阶段不计入。',
};
export const teamTransferLabels = {
  'is benched on': '转为替补于', 'is moved to the active roster on': '进入首发阵容于', joins: '加入',
  'as coach': '担任教练', 'parts ways with': '离开', '(benched)': '（替补）', 'No team': '暂无战队',
};
