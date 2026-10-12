/** 导航、档案、详情、区域及筛选术语参考历史 1.7.0；其余按实页完整文案补充。 */
export const rankingNavigation = {
  'World ranking': '世界排名', 'Regional rankings': '区域排名', 'Valve ranking': 'V社排名',
  'Regional Valve ranking': '区域V社排名', 'VRS Invites': 'VRS 邀请',
  World: '世界', Regional: '区域', Valve: 'V社', ranking: '排名', rankings: '排名', Invites: '邀请',
};
export const rankingLabels = {
  'HLTV Team profile': 'HLTV 战队档案', 'Ranking details': '排名详情', 'NEW TEAM': '新上榜',
  Filters: '筛选', Year: '年份', Month: '月份', Day: '日期',
};
export const rankingMonths = {
  January: '一月', February: '二月', March: '三月', April: '四月', May: '五月', June: '六月',
  July: '七月', August: '八月', September: '九月', October: '十月', November: '十一月', December: '十二月',
};
/** 只用于区域筛选 UI 和排名标题，不翻译选手国旗或地点实体。 */
export const rankingRegions: Record<string, string> = {
  'North America': '北美', 'South America': '南美', Europe: '欧洲', Asia: '亚洲', Americas: '美洲', Oceania: '大洋洲', Africa: '非洲',
  'United States': '美国', Argentina: '阿根廷', Brazil: '巴西', Denmark: '丹麦', Finland: '芬兰', Poland: '波兰',
  Portugal: '葡萄牙', Romania: '罗马尼亚', Russia: '俄罗斯', Sweden: '瑞典', Türkiye: '土耳其', Turkey: '土耳其',
  Ukraine: '乌克兰', 'United Kingdom': '英国', China: '中国', Mongolia: '蒙古', Australia: '澳大利亚',
};
export const rankingDescription = {
  "HLTV's world ranking of Counter-Strike Teams": 'HLTV 反恐精英战队世界排名',
  'How is the ranking calculated?': '排名如何计算？',
  "HLTV's world ranking ranks the best teams in the competitive field of Counter-Strike. The ranking is updated weekly, and teams move up or down based on their recent performance in competitive matches over the last 2 months.":
    'HLTV 世界排名对反恐精英职业赛场上的顶尖战队进行排名。排名每周更新，战队根据过去 2 个月的比赛表现上升或下降。',
  "The world ranking is based on teams' achievements over the past year (with severe decay in points throughout each month), recent form over the last 2 months and performance at the last 10 LAN events.":
    '世界排名依据战队过去一年的成绩（积分每月大幅衰减）、最近 2 个月的状态，以及最近 10 场线下赛事的表现计算。',
  'All of that is predicated around a 3-man core each team is required to have in order to retain their past points. Online matches and tournaments are included, but with a diminishing factor which means they cannot make a big difference among the top teams, and mainly serve to put new teams on the map.':
    '战队须保留 3 人核心阵容，才能继承此前的积分。线上比赛和赛事也计入排名，但权重较低，对顶尖战队之间的排名影响有限，主要帮助新战队进入排名。',
};
