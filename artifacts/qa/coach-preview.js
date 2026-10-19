(() => {
  // src/core/rules.ts
  var normalize = (text) => text.replace(/[\s\u00a0]+/g, " ").trim().toLowerCase();
  function exact(id, module, selector, entries, target) {
    const map = /* @__PURE__ */ new Map();
    for (const [source, value] of Object.entries(entries)) {
      const key = normalize(source);
      if (map.has(key)) throw new Error(`重复词条: ${id}/${source}`);
      map.set(key, value);
    }
    return { id, module, selector, target, translate: (source) => map.get(normalize(source)) };
  }

  // src/locales/zh-CN/players.ts
  var roles = {
    Firepower: "火力",
    Entrying: "突破",
    Trading: "补枪",
    Opening: "首杀",
    Clutching: "残局",
    Sniping: "狙击",
    Utility: "道具"
  };
  var profileLabels = {
    Player: "选手",
    Coach: "教练",
    Age: "年龄",
    Born: "出生日期",
    "Current team": "当前战队",
    Team: "战队",
    "No team": "暂无战队",
    "Prize money": "奖金",
    "Top 20": "年度 TOP 20",
    "Player achievements": "选手成就",
    Info: "资料",
    Teams: "战队",
    Matches: "比赛",
    Achievements: "成就",
    Trophies: "奖杯",
    News: "新闻",
    Awards: "奖项",
    "Upcoming & recent matches": "近期赛程与赛果",
    "Time period": "时间段",
    "Days in current team": "当前战队效力天数",
    "Days in teams": "战队效力总天数",
    Rankings: "排名",
    "Current ranking": "当前排名",
    Peak: "最高排名",
    "Time at peak": "最高排名保持时间",
    Date: "日期",
    Match: "比赛",
    Stats: "数据",
    Placement: "名次",
    Tournament: "赛事",
    "1/4 final": "八强",
    "1/2 final": "四强",
    "1/8 final": "十六强",
    "Major won": "Major 冠军数",
    "Majors played": "Major 参赛次数",
    "LANs won": "线下赛冠军数",
    "LANs played": "线下赛参赛次数",
    LAN: "线下赛",
    Trophy: "奖杯",
    "Major trophies": "Major 奖杯数",
    "Notable trophies": "重要赛事奖杯数",
    "Major MVPs": "Major MVP 数",
    "Total MVPs": "MVP 总数",
    "Major EVPs": "Major EVP 数",
    "Total EVPs": "EVP 总数",
    Year: "年份",
    Award: "奖项",
    "Win rate": "胜率",
    "Win streak": "连胜",
    "Average KDR": "平均 K/D",
    Headshots: "爆头率",
    Season: "赛季",
    Won: "获胜",
    "Won %": "胜率",
    Points: "积分",
    Position: "名次",
    "Become fan": "关注选手",
    "Remove fan": "取消关注",
    "Press play on the media player to find out": "点击播放器播放按钮，收听选手名字的发音",
    "Browse CS2 Skins": "浏览 CS2 皮肤",
    "Show loadout": "查看装备",
    "Show inventory": "查看库存",
    "All Stickers": "全部贴纸",
    Pistols: "手枪",
    "Mid-Tier": "中型武器",
    Rifles: "步枪",
    "Match verified skins": "已通过比赛核实的皮肤",
    "Trusted HLTV Partner": "HLTV 认证合作伙伴",
    "All deals are secured with the highest level protection methods": "所有交易均采用最高级别的安全保护措施",
    "Total team winnings / 5": "战队奖金总额 ÷ 5",
    "Historic FPL CS2 Europe placements": "FPL CS2 欧洲赛区历史名次",
    "Historic FPL CSGO Europe placements": "FPL CSGO 欧洲赛区历史名次",
    "Historic FPL CSGO Challenger Europe placements": "FPL CSGO 欧洲挑战者赛区历史名次",
    "Highlight of the Year (Panel Award)": "年度最佳瞬间（评委奖）",
    "Opener of the Year (Panel Award)": "年度最佳首杀选手（评委奖）",
    "Player of the Year (HLTV Award)": "年度最佳选手（HLTV 奖）",
    "Rookie of the Year (HLTV Award)": "年度最佳新人（HLTV 奖）"
  };

  // src/locales/zh-CN/player-stats.ts
  var statsLabels = {
    Overview: "概览",
    Individual: "个人指标",
    Matches: "比赛",
    Events: "赛事",
    Career: "生涯",
    Weapons: "武器",
    Clutches: "残局",
    "Multi-kills": "多杀",
    Opponents: "对手",
    "Player context": "选手对比",
    "Context navigation": "对比导航",
    Navigation: "导航",
    "Search stats": "搜索数据",
    Version: "游戏版本",
    Filters: "筛选",
    Players: "选手",
    Teams: "战队",
    Maps: "地图",
    Flashes: "闪光弹",
    "Opening kills": "首杀",
    "Pistol rounds": "手枪局",
    Leaderboards: "排行榜",
    Compare: "对比",
    "1.6 stats section": "CS 1.6 数据专区",
    "Event filter": "赛事筛选",
    "Time filter": "时间筛选",
    "Opponent ranking": "对手排名",
    "Map filter": "地图筛选",
    All: "全部",
    Both: "全部",
    "Both Sides": "双方",
    "CT Side": "CT 方",
    "T Side": "T 方",
    Sides: "阵营",
    Side: "方",
    "Side:": "阵营：",
    "Stats per:": "统计单位：",
    Round: "每回合",
    "24 rounds": "每 24 回合",
    "Event type": "赛事类型",
    Majors: "Major 赛事",
    "Big events": "大型赛事",
    "MVP events": "设有 MVP 的赛事",
    LAN: "线下赛",
    Online: "线上赛",
    "All matches": "全部比赛",
    Time: "时间",
    "All time": "全部时间",
    "Last month": "最近 1 个月",
    "Last 3 months": "最近 3 个月",
    "Last 6 months": "最近 6 个月",
    "Last 12 months": "最近 12 个月",
    "Best Of X": "比赛赛制",
    "Best of 1": "BO1",
    "Best of 3": "BO3",
    "Best of 5": "BO5",
    "Valve Ranked": "Valve 排名赛事",
    Ranked: "计入排名",
    Unranked: "不计入排名",
    "Match type": "比赛阶段",
    "Grand final": "总决赛",
    Playoffs: "淘汰赛",
    "Pre-playoff": "淘汰赛前阶段",
    "Maps in filter": "筛选内地图数",
    "Show player average": "显示选手平均值",
    "Player profile": "选手资料",
    "Go to Player": "查看选手",
    "Go to Team": "查看战队",
    "Add to context": "加入对比",
    "Create lineup": "创建阵容",
    Good: "优秀",
    Okay: "一般",
    Poor: "较差",
    "N/A": "无数据",
    "Avg.": "平均",
    "Round swing": "回合胜率影响",
    "Multi-kill": "多杀",
    "MK rating": "多杀评分",
    "Multi-kill rating": "多杀评分",
    "T Rating": "T 方评分",
    "CT Rating": "CT 方评分",
    Statistics: "数据统计",
    "Featured ratings": "对不同排名对手的评分",
    Teammates: "队友",
    "Form in filter": "筛选条件下的状态走势",
    "Total kills": "总击杀",
    "Headshot %": "爆头率",
    "Total deaths": "总阵亡",
    "K/D Ratio": "K/D 比率",
    "Damage / Round": "每回合伤害",
    "Grenade dmg / Round": "每回合投掷物伤害",
    "Maps played": "出场地图数",
    "Rounds played": "出场回合数",
    "Kills / round": "每回合击杀",
    "Assists / round": "每回合助攻",
    "Deaths / round": "每回合阵亡",
    "Saved by teammate / round": "每回合被队友救援",
    "Saved teammates / round": "每回合救援队友",
    "Impact rating": "影响力评分",
    "Kills per round": "每回合击杀",
    "Rounds with a kill": "有击杀回合占比",
    "Kills per round win": "每个获胜回合击杀",
    "Damage per round": "每回合伤害",
    "Rounds with a multi-kill": "多杀回合占比",
    "Damage per round win": "每个获胜回合伤害",
    "Pistol round rating": "手枪局评分",
    "Saved by teammate per round": "每回合被队友救援",
    "Traded deaths per round": "每回合阵亡后被补枪",
    "Traded deaths percentage": "阵亡后被补枪比例",
    "Opening deaths traded percentage": "首死后被补枪比例",
    "Assists per round": "每回合助攻",
    "Support rounds": "支援回合占比",
    "Saved teammate per round": "每回合救援队友",
    "Trade kills per round": "每回合补枪击杀",
    "Trade kills percentage": "补枪击杀比例",
    "Assisted kills percentage": "队友先造成伤害的击杀比例",
    "Damage per kill": "每次击杀伤害",
    "Opening kills per round": "每回合首杀",
    "Opening deaths per round": "每回合首死",
    "Opening attempts": "首次交锋参与率",
    "Opening success": "首次交锋胜率",
    "Win% after opening kill": "取得首杀后回合胜率",
    "Attacks per round": "每回合伤害事件数",
    "Clutch points per round": "每回合残局积分",
    "Last alive percentage": "最后存活比例",
    "1on1 win percentage": "1 对 1 残局胜率",
    "Time alive per round": "每回合存活时间",
    "Saves per round loss": "每个失利回合保枪率",
    "Sniper kills per round": "每回合狙击击杀",
    "Sniper kills percentage": "狙击击杀比例",
    "Rounds with sniper kills percentage": "有狙击击杀回合占比",
    "Sniper multi-kill rounds": "狙击多杀回合占比",
    "Sniper opening kills per round": "每回合狙击首杀",
    "Utility damage per round": "每回合道具伤害",
    "Utility kills per 100 rounds": "每 100 回合道具击杀",
    "Flashes thrown per round": "每回合投掷闪光弹",
    "Flash assists per round": "每回合闪光助攻",
    "Time opponent flashed per round": "每回合致盲对手时间",
    "Overall stats": "整体数据",
    "Opening stats": "首杀数据",
    "Round stats": "回合数据",
    "Weapon stats": "武器数据",
    Kills: "击杀",
    Deaths: "阵亡",
    "Kill / Death": "击杀/阵亡",
    "Kill / Round": "每回合击杀",
    "Rounds with kills": "有击杀回合数",
    "Kill - Death difference": "击杀与阵亡差",
    "K - D diff.": "K-D 差",
    "Total opening kills": "总首杀",
    "Total opening deaths": "总首死",
    "Opening kill ratio": "首杀/首死比",
    "Opening kill rating": "首杀评分",
    "Team win percent after first kill": "取得首杀后战队胜率",
    "First kill in won rounds": "获胜回合中的首杀占比",
    "Rifle kills": "步枪击杀",
    "Sniper kills": "狙击击杀",
    "SMG kills": "冲锋枪击杀",
    "Pistol kills": "手枪击杀",
    Grenade: "投掷物击杀",
    Other: "其他",
    "Avg. Rating": "平均评分",
    "Maps won": "地图胜场",
    "Maps with 1+ rating": "评分 1+ 地图占比",
    "Best 1+ rating streak": "最长连续评分 1+ 记录",
    Date: "日期",
    "Player team": "选手战队",
    Opponent: "对手",
    Map: "地图",
    Event: "赛事",
    Team: "战队",
    "Team 1": "战队 1",
    "Team 2": "战队 2",
    Period: "时期",
    Status: "状态",
    Type: "类型",
    Wins: "胜场",
    Losses: "负场",
    Difference: "差值",
    Won: "获胜",
    Lost: "失利",
    Lineup: "阵容",
    Graph: "图表",
    "Extended weapon overview": "武器详细数据",
    "See matches": "查看比赛",
    "Fast multi-kills only": "仅显示快速多杀",
    "Fast MK only": "仅快速多杀",
    "Fast multi-kill:": "快速多杀："
  };

  // src/locales/zh-CN/player-tooltips.ts
  var playerTooltips = {
    "A player's raw output, with a score based on kills, damage, and multi-kills. This is one for the star players — or those on a particularly high hot streak. Survival doesn't matter at all here; this is just the fraggers.": "衡量选手的纯输出，评分依据击杀、伤害和多杀，适用于明星选手或状态火热的选手。此项不考虑存活，只衡量输出能力。",
    "How likely a player is to be the one sacrificed for his teammates. High-scoring players are those who go round risky corners first (often knowing certain death is coming), or into bomb-sites in the mid-round to make space for their star players. The score is based on traded deaths (both % and per round) and how often they are 'saved' by a teammate per round.": "衡量选手为队友牺牲、创造空间的倾向。高分选手会率先探查危险位置，或在回合中段进入包点为主力创造空间。评分依据阵亡后被补枪的比例、每回合次数，以及每回合被队友救援的次数。",
    "The baiters, but that isn't a negative term. Being able to trade your teammates is a crucial skill in pro CS. Trade kills (both % and per round) are key here but so is saving your teammate while they're taking damage.": "衡量跟进队友并完成补枪的能力。补枪是职业 CS 的关键技能，评分主要依据补枪击杀的比例、每回合次数，以及在队友受伤时救援队友的表现。",
    "How likely a player is to make the difference with an early-round opening frag. Given that pros win 5v4s more than 70% of the time on average, aggression is a skillset every team needs. The score is based off of opening kills per round, and opening attempts.": "衡量选手通过回合初期首杀改变局势的能力。职业队伍在 5 对 4 时的平均胜率超过 70%，因此主动争取首杀是重要技能。评分依据每回合首杀和首次交锋参与率。",
    "The late round players and 1vX specialists, players you can rely on in post-plants and retakes to make the difference. The score is based mostly on clutches won with an added stylistic measure in the form of time alive per round to identify late round specialists.": "衡量回合后期和 1 对多残局能力，包括下包后防守和回防。评分主要依据残局获胜，并结合每回合存活时间识别擅长回合后期的选手。",
    "Primary AWPers. Based on kills and multi-kills with the AWP and SSG-08, a low score indicates a rifler, medium a hybrid player, and high a fully fledged full-time sniper.": "衡量主狙能力，依据 AWP 和 SSG-08 的击杀及多杀。低分偏向步枪手，中等分偏向兼用步枪和狙击枪，高分偏向专职狙击手。",
    "The side's grenadier. There's plenty of ways to be 'supportive' in modern CS but utility usage is still a key feature of that. The overall score is a combination of flashbang statistics and grenade damage per round.": "衡量道具支援能力。现代 CS 的支援方式多样，道具使用仍是关键。综合评分结合闪光弹数据和每回合投掷物伤害。",
    "The rating tells us if the player put up above or below average numbers, with 1.00 being the average": "评分反映选手表现高于还是低于平均水平，1.00 为平均值。",
    "How much, on average, a player changed their team's chances of winning a round based on team economy, side, kills, deaths, damage, trading, and flash assists.": "衡量选手平均改变战队回合获胜概率的幅度，依据战队经济、阵营、击杀、阵亡、伤害、补枪和闪光助攻。",
    "Deaths per round": "每回合阵亡",
    "Kills per round": "每回合击杀",
    "Average damage per round": "每回合平均伤害",
    "Percentage of rounds in which the player either had a kill, assist, survived or was traded": "选手完成击杀、助攻、存活或阵亡后被队友补枪的回合占比。",
    "The percentage of rounds where this player posted 2 or more kills": "选手完成两次及以上击杀的回合占比。",
    "Rating of the player's ability to post two or more kills during a round. Adjusted to compensate for economy.": "衡量选手每回合完成两次及以上击杀的能力，已根据经济进行调整。",
    "The percentage of rounds in which the player delivered at least one kill.": "选手至少完成一次击杀的回合占比。",
    "Kills in round wins divided by total round wins.": "获胜回合中的击杀数除以获胜回合总数。",
    "HLTV's in-house formula for performance, taking into account Kills, Damage, Survival, Impact, and round-to-round consistency.": "HLTV 的内部表现评分公式，综合击杀、伤害、存活、影响力和各回合表现的稳定性。",
    "The percentage of rounds in which the player delivered at least two kills.": "选手至少完成两次击杀的回合占比。",
    "Damage in round wins divided by total round wins.": "获胜回合中的伤害除以获胜回合总数。",
    "Rating 2.0 in the first round of each half.": "每个半场首回合的 Rating 2.0 评分。",
    "When a teammate kills the attacker that was damaging this player, within 1 second of the last attack.": "队友在最后一次攻击后 1 秒内击杀正在伤害该选手的敌人。",
    "Deaths where the player's killer was also killed within 5 seconds.": "选手阵亡后，击杀该选手的敌人在 5 秒内也被击杀。",
    "Percentage of deaths where the player's killer was also killed within 5 seconds.": "选手阵亡后，击杀者在 5 秒内也被击杀的比例。",
    "Percentage of opening deaths where the player's killer was also killed within 5 seconds.": "选手首死后，击杀者在 5 秒内也被击杀的比例。",
    "When a player contributes 25 or more damage to an opponent's death. In CS:GO, the threshold was 40 damage.": "选手对最终阵亡的敌人造成至少 25 点伤害；CS:GO 中的门槛为 40 点。",
    "Rounds with an assist, survival, or traded death but no kills.": "没有击杀，但完成助攻、存活或阵亡后被补枪的回合。",
    "Kills on opponents who were attacking a teammate, within 1 second of the last attack.": "在敌人最后一次攻击队友后 1 秒内击杀该敌人。",
    "Kills on opponents within 5 seconds of them killing a teammate.": "在敌人击杀队友后 5 秒内击杀该敌人。",
    "Percentage of kills that were on opponents within 5 seconds of them killing a teammate.": "击杀中，在敌人击杀队友后 5 秒内完成补枪的比例。",
    "Percentage of kills that were on opponents that had already been damaged by teammates.": "击杀中，敌人已被队友造成伤害的比例。",
    "Damage divided by kills. An average below 100 would mean a player is getting more low-damage kills.": "伤害除以击杀数。平均值低于 100 表示选手更常通过较低伤害完成击杀。",
    "The first kill in a round.": "回合中的首次击杀。",
    "The first death in a round.": "回合中的首次阵亡。",
    "Percentage of rounds in which a player is involved in an opening duel, whether successful or not": "选手参与首次交锋的回合占比，无论交锋成功与否。",
    "The percentage of opening duels in which the player got the kill.": "选手在首次交锋中取得击杀的比例。",
    "The round win percentage of 5v4s in which the player found the opener.": "选手取得首杀、形成 5 对 4 后的回合胜率。",
    "Separate damage-dealing incidents per round, including ticks from molotovs.": "每回合独立造成伤害的事件数，包括燃烧弹的持续伤害。",
    "Clutches per round, weighted by the number of opponents. 1v1 is 1 point, 1v2 2, 1v3 4, 1v4 8, and 1v5 16. Be wary of sample size, clutch situations are very rare.": "按对手人数加权的每回合残局积分：1 对 1 为 1 分，1 对 2 为 2 分，1 对 3 为 4 分，1 对 4 为 8 分，1 对 5 为 16 分。残局出现较少，请注意样本量。",
    "The percentage of round where this player is the last alive on the server.": "该选手成为服务器内最后一名存活者的回合占比。",
    "Percentage of 1on1 clutches this player wins. The average is about 60%, not 50%, because 1on1s are only created from 2on1s, leaving an easy trade kill sometimes. Be wary of sample size, clutch situations are very rare.": "选手在 1 对 1 残局中的胜率。平均值约为 60%，因为 1 对 1 是由 2 对 1 转变而来，有时可轻松补枪。残局出现较少，请注意样本量。",
    "The average time per round a player is alive.": "选手每回合的平均存活时间。",
    "The percentage of round losses this player survives in.": "战队失利回合中该选手存活的比例。",
    "Kills with the AWP and SSG-08 snipers.": "使用 AWP 和 SSG-08 完成的击杀。",
    "Percentage of kills that come with the AWP and SSG-08 snipers.": "使用 AWP 和 SSG-08 完成的击杀占比。",
    "Percentage of rounds that the player delivers a kill from the AWP or SSG-08 snipers.": "使用 AWP 或 SSG-08 完成击杀的回合占比。",
    "Percentage of rounds that the player delivers two or more kills from the AWP or SSG-08 snipers.": "使用 AWP 或 SSG-08 完成两次及以上击杀的回合占比。",
    "Percentage of rounds that the player delivers an opening kill from the AWP or SSG-08 snipers.": "使用 AWP 或 SSG-08 取得首杀的回合占比。",
    "Damage that was dealt with utility, usually HE grenades or Molotovs/Incendiaries.": "使用道具造成的伤害，通常来自高爆手雷或燃烧弹。",
    "Kills where the final blow came from utility, usually HE grenades or Molotovs/Incendiaries.": "由道具完成最后一击的击杀，通常来自高爆手雷或燃烧弹。",
    "Flashbangs thrown. A player can buy a maximum of two in each round, but teammates can drop them as well.": "投掷的闪光弹数量。选手每回合最多购买两颗，也可使用队友丢下的闪光弹。",
    "A flash assist happens when an opponent blinded by this player was killed while affected by the flash. This is calculated differently to in-game flash assists from the kill-feed, with different time conditions for how much the player was flashed.": "敌人在被该选手致盲期间被击杀时计为闪光助攻。此处计算与游戏击杀信息中的闪光助攻不同，致盲时长的判定条件也不同。",
    "Average time per round opponents were blinded by flashbangs by this player.": "该选手每回合使对手致盲的平均时间。",
    "Data from 2016 and onward only, be wary of your sample size.": "仅统计 2016 年及之后的数据，请注意样本量。",
    "How many times a teammate killed the attacker that was damaging this player within 1 second of the last attack. Data from 2016 and onward only, be wary of your sample size.": "队友在敌人最后一次攻击该选手后 1 秒内击杀该敌人的次数。仅统计 2016 年及之后的数据，请注意样本量。",
    "How many times this player killed an opponent who was attacking a teammate, within 1 second of the last attack. Data from 2016 and onward only, be wary of your sample size.": "该选手在敌人最后一次攻击队友后 1 秒内击杀该敌人的次数。仅统计 2016 年及之后的数据，请注意样本量。",
    "Measures the impact made from multikills, opening kills, and clutches.": "根据多杀、首杀和残局衡量影响力。",
    "A streak of kills done by a player with less than 5 seconds between each kill. It's possible to do more than one fast multi-kill in a single round.": "连续击杀中，相邻击杀间隔少于 5 秒。一个回合内可完成多组快速多杀。",
    "Only show matches from CS2": "仅显示 CS2 比赛",
    "Only show matches from CSGO": "仅显示 CSGO 比赛",
    "Only show matches from majors": "仅显示 Major 比赛",
    "Only show matches from events classified as a 'Big Event'": "仅显示被归类为大型赛事的比赛",
    "Only show matches from events which have an MVP": "仅显示设有 MVP 的赛事比赛",
    "Only show matches played on LAN": "仅显示线下比赛",
    "Only show matches played online": "仅显示线上比赛",
    "Only show valve ranked events": "仅显示计入 Valve 排名的赛事",
    "Only show unranked events": "仅显示不计入排名的赛事",
    "Only show grand final matches": "仅显示总决赛",
    "Only show playoff matches": "仅显示淘汰赛",
    "Only show pre-playoff matches": "仅显示淘汰赛前阶段的比赛"
  };

  // src/adapters/templates.ts
  var monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  var monthNumber = (value) => monthNames.findIndex((month) => month === value.toLowerCase() || month.slice(0, 3) === value.toLowerCase()) + 1;
  function dateText(source) {
    const value = source.trim();
    let m = /^(?:Results for\s+)?([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,)?(?:\s+(\d{4}))?$/i.exec(value);
    if (m && monthNumber(m[1]) && +m[2] >= 1 && +m[2] <= 31) {
      return `${m[3] ? m[3] + "年" : ""}${monthNumber(m[1])}月${m[2]}日${/^Results for/i.test(value) ? "的赛果" : ""}`;
    }
    m = /^(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?([A-Za-z]+)(?:\s+(\d{4}))?$/i.exec(value);
    if (m && monthNumber(m[2]) && +m[1] >= 1 && +m[1] <= 31) return `${m[3] ? m[3] + "年" : ""}${monthNumber(m[2])}月${m[1]}日`;
    m = /^([A-Za-z]+)\s+(\d{4})$/.exec(value);
    if (m && monthNumber(m[1])) return `${m[2]}年${monthNumber(m[1])}月`;
    return void 0;
  }

  // src/locales/zh-CN/statistics.ts
  var statisticsTitles = {
    "Ratio between kills and deaths in the match.": "比赛中的击杀与阵亡比率。",
    "Ratio between kills and deaths in the match. Adjusted to compensate for economy.": "比赛中的击杀与阵亡比率，已根据经济进行调整。",
    "How much, on average, a player changed their team's chances of winning a round based on team economy, side, kills, deaths, damage, trading, and flash assists": "衡量选手平均改变战队回合获胜概率的幅度，依据战队经济、阵营、击杀、阵亡、伤害、补枪和闪光助攻。",
    "Average damage per round.": "每回合平均伤害。",
    "Average damage per round": "每回合平均伤害。",
    "Average damage per round. Adjusted to compensate for economy.": "每回合平均伤害，已根据经济进行调整。",
    "Percentage of rounds in which the player either had a kill, assist, survived or was traded.": "选手完成击杀、助攻、存活或阵亡后被队友补枪的回合占比。",
    "Percentage of rounds in which the player either had a kill, assist, survived or was traded": "选手完成击杀、助攻、存活或阵亡后被队友补枪的回合占比。",
    "Percentage of rounds in which the player either had a kill, assist, survived or was traded. Adjusted to compensate for economy.": "选手完成击杀、助攻、存活或阵亡后被队友补枪的回合占比，已根据经济进行调整。",
    "The rating tells us if the player put up above or below average numbers, with 1.00 being the average.": "评分反映选手表现高于还是低于平均水平，1.00 为平均值。",
    "Opening kills:deaths": "首杀与首死。",
    "Opening eco-adjusted kills:deaths": "根据经济调整后的首杀与首死。",
    "Rounds with two or more kills": "完成两次及以上击杀的回合数。",
    Kills: "击杀数",
    "Eco-adjusted kills": "根据经济调整后的击杀数",
    Assists: "助攻数",
    Death: "阵亡数",
    "Eco-adjusted deaths": "根据经济调整后的阵亡数",
    Headshots: "爆头数",
    "Flash assists": "闪光助攻数",
    Traded: "阵亡后被队友补枪的次数",
    "Eco-adjusted traded deaths": "根据经济调整后的被补枪阵亡数",
    "Round win %": "回合胜率",
    "Percentage of rounds where the team won the opening duel": "战队赢得首次交锋的回合占比。",
    "Multikills per round by the team's players": "战队选手每回合完成的多杀次数。",
    "Round win % after getting the opening kill": "取得首杀后的回合胜率。",
    "Round win % after giving the opening death": "遭遇首死后的回合胜率。",
    "Percentage of team's deaths that were traded": "战队阵亡后被队友补枪的比例。",
    "Damage per round with HE grenades, Molotovs & Incendiaries": "高爆手雷和燃烧弹造成的每回合伤害。",
    "Flash assists / round (A flash assist happens when an opponent blinded by this player was killed while affected by the flash)": "每回合闪光助攻；敌人在被该选手致盲期间被击杀时计为闪光助攻。",
    "Total number of pistol rounds won and lost": "手枪局获胜和失利的总数。",
    "Percentage of pistol rounds won": "手枪局胜率。",
    "Percentage of 2nd round wins after winning the pistol round": "赢得手枪局后，第 2 回合的胜率。",
    "Percentage of 2nd round wins after losing the pistol round": "输掉手枪局后，第 2 回合的胜率。"
  };
  var specialtyLabels = {
    Team: "战队",
    Teams: "战队",
    Player: "选手",
    Maps: "地图",
    Rounds: "回合",
    "K-D Diff": "K-D 差",
    Thrown: "投掷数",
    Blinded: "致盲",
    "Opp Flashed": "致盲敌人数",
    Diff: "差值",
    FA: "闪光助攻",
    Success: "成功率",
    Attempts: "参与率",
    "RW%": "回合胜率",
    OpK: "首杀率",
    MultiK: "每回合多杀",
    "Traded%": "被补枪率",
    "Won - Lost": "胜 - 负",
    "Pistol win %": "手枪局胜率",
    "Round 2 conv": "第 2 回合转化率",
    "R2 conv": "次回合转化",
    "Round 2 break": "第 2 回合翻盘率",
    "R2 break": "次回合翻盘",
    Team1: "战队1",
    Team2: "战队2",
    Date: "日期",
    Map: "地图",
    Event: "赛事",
    Winner: "胜者",
    W: "胜",
    "Event name": "赛事名称",
    "Opponent lineup": "对手阵容",
    Performance: "表现",
    Economy: "经济",
    Heatmaps: "热力图",
    Lineup: "阵容",
    "Fast multi-kills only": "仅显示快速多杀",
    "Fast MK only": "仅快速多杀",
    "Fast multi-kill:": "快速多杀："
  };

  // src/adapters/players.ts
  var profileHeadings = [
    [/^(.+) statistics$/, (n) => `${n} 的数据`],
    [/^Team stats for (.+)$/, (n) => `${n} 的战队数据`],
    [/^Breakdown of (.+)'s teams$/, (n) => `${n} 的战队履历`],
    [/^Timeline of (.+)'s teams$/, (n) => `${n} 的战队时间线`],
    [/^Upcoming matches for (.+)$/, (n) => `${n} 的近期赛程`],
    [/^Latest results for (.+)$/, (n) => `${n} 的近期赛果`],
    [/^Major achievements for (.+)$/, (n) => `${n} 的 Major 成就`],
    [/^LAN achievements for (.+)$/, (n) => `${n} 的线下赛成就`],
    [/^Breakdown of (.+)'s major achievements$/, (n) => `${n} 的 Major 成就明细`],
    [/^Breakdown of (.+)'s LAN achievements$/, (n) => `${n} 的线下赛成就明细`],
    [/^Trophy overview for (.+)$/, (n) => `${n} 的奖杯概览`],
    [/^All (.+)'s trophies$/, (n) => `${n} 的全部奖杯`],
    [/^MVP overview for (.+)$/, (n) => `${n} 的 MVP 概览`],
    [/^All (.+)'s MVP medals$/, (n) => `${n} 的全部 MVP 奖章`],
    [/^EVP overview for (.+)$/, (n) => `${n} 的 EVP 概览`],
    [/^All events where (.+) was an EVP$/, (n) => `${n} 获得 EVP 的全部赛事`],
    [/^Top 20 overview for (.+)$/, (n) => `${n} 的年度 TOP 20 概览`],
    [/^HLTV awards overview for (.+)$/, (n) => `${n} 的 HLTV 奖项概览`],
    [/^News posts mentioning (.+)$/, (n) => `提及 ${n} 的新闻`],
    [/^All time stats for (.+)$/, (n) => `${n} 的生涯数据`],
    [/^(.+)'s active FPL season$/, (n) => `${n} 当前 FPL 赛季`],
    [/^(.+)'s inventory$/, (n) => `${n} 的库存`],
    [/^(.+)'s skins$/, (n) => `${n} 的皮肤`],
    [/^(.+)'s loadout$/, (n) => `${n} 的装备`],
    [/^Pictures of (.+)$/, (n) => `${n} 的照片`],
    [/^Complete statistics for (.+)$/, (n) => `${n} 的完整数据`],
    [/^All photos of (.+)$/, (n) => `${n} 的全部照片`],
    [/^See all results for (.+)$/, (n) => `查看 ${n} 的全部赛果`],
    [/^Not sure how to pronounce (.+)\?$/, (n) => `不知道 ${n} 的名字如何发音？`]
  ];
  function playerText(text) {
    for (const [pattern, translate] of profileHeadings) {
      const m2 = pattern.exec(text);
      if (m2) return translate(m2[1]);
    }
    let m = /^News posts from (\d{4})$/.exec(text);
    if (m) return `${m[1]} 年的新闻`;
    m = /^Stickers:\s*(.+)$/.exec(text);
    if (m) return `贴纸：${m[1]}`;
    m = /^(.+) Collection$/.exec(text);
    if (m) return `${m[1]} 收藏`;
    m = /^(?:\((?:Past (\d+) months? • )?)(\d[\d,]*) maps\)$/.exec(text);
    if (m) return `(${m[1] ? `最近 ${m[1]} 个月 • ` : ""}${m[2]} 张地图)`;
    m = /^(\d+) years?$/.exec(text);
    if (m) return `${m[1]} 岁`;
    m = /^(\d+) weeks?$/.exec(text);
    if (m) return `${m[1]} 周`;
    m = /^(?:(\d+)\s+)?x Major (winner|MVP)$/.exec(text);
    if (m) return `${m[1] ? `${m[1]} ` : ""}次 Major ${m[2] === "winner" ? "冠军" : "MVP"}`;
    m = /^(\d+)(?:-(\d+))?(?:st|nd|rd|th)$/.exec(text);
    if (m) return `第 ${m[1]}${m[2] ? `–${m[2]}` : ""} 名`;
    m = /^#(\d+) best player in (\d{2})$/.exec(text);
    if (m) return `20${m[2]} 年度第 ${m[1]} 名选手`;
    m = /^(.+) has no stats for the active FPL season, check back later\.$/.exec(text);
    if (m) return `${m[1]} 当前 FPL 赛季暂无数据，请稍后查看。`;
    m = /^We didn't record any (trophies|achievements) for (.+) during their career\.$/.exec(text);
    if (m) return `尚未记录 ${m[2]} 职业生涯中的${m[1] === "trophies" ? "奖杯" : "成就"}。`;
  }
  function statsText(text) {
    let m = /^Rating\s*(\d+\.\d+)?$/i.exec(text);
    if (m) return `评分${m[1] ? ` ${m[1]}` : ""}`;
    m = /^Top (5|10|20|30|50)$/.exec(text);
    if (m) return `前 ${m[1]} 名`;
    m = /^vs top (5|10|20|30|50) opponents$/.exec(text);
    if (m) return `对阵排名前 ${m[1]} 的对手`;
    m = /^(\(?)(\d[\d,]*) maps(\)?)$/.exec(text);
    if (m) return `${m[1]}${m[2]} 张地图${m[3]}`;
    m = /^(\d+) kill rounds$/.exec(text);
    if (m) return `${m[1]} 杀回合数`;
    m = /^1 on ([1-5])$/.exec(text);
    if (m) return `1 对 ${m[1]}`;
    m = /^([2-5])x (fast )?multi-kills$/.exec(text);
    if (m) return `${m[1]} 杀${m[2] ? "快速" : ""}多杀次数`;
    m = /^(\d+)\s*-\s*(\d+) of ([\d,]+)$/.exec(text);
    if (m) return `第 ${m[1]}–${m[2]} 条，共 ${m[3]} 条`;
    m = /^(Match history|Event history|All clutch history|[1-5] on [1-5] clutch history|[2-5]x multi-kill history|All multi-kill history|Career rating [\d.]+) for (.+)$/.exec(text);
    if (m) {
      const title = { "Match history": "比赛记录", "Event history": "赛事记录", "All clutch history": "全部残局记录", "All multi-kill history": "全部多杀记录" }[m[1]] ?? m[1].replace(/^Career rating ([\d.]+)$/, "生涯评分 $1").replace(/^([2-5])x multi-kill history$/, "$1 杀记录").replace(/^([1-5]) on ([1-5]) clutch history$/, "$1 对 $2 残局记录");
      return `${m[2]} 的${title}`;
    }
    m = /^Sliding window of rating (\d+\.\d+)( for matches in the past (\d+) months)? - 1 day increments$/.exec(text);
    if (m) return `${m[3] ? `最近 ${m[3]} 个月比赛的` : ""}评分 ${m[1]} 滑动窗口，每次递进 1 天`;
    m = /^Only maps against an opponent that was in the top (5|10|20|30|50) of the HLTV ranking at the time of the map$/.exec(text);
    if (m) return `仅显示对阵当时 HLTV 排名前 ${m[1]} 对手的地图`;
  }
  var profileSlots = ".playerProfile .primaryRole, .playerProfile .listLeft, .playerProfile .listLeft > span, .playerProfile .tab, .playerProfile .sub-navigation-link, .playerProfile .standard-headline, .playerProfile .description, .playerProfile th, .playerProfile .stats-button, .playerProfile .moreButton, .playerProfile .skins-weapon-column > h3, .skins-link-button > a, .skins-loadout-button, .skins-inventory-button, .show-all-stickers-button, .playerProfile .tooltip-box, .playerProfile .trophy-event";
  var statsSlots = ".stats-sub-navigation-title > .tab-title, .stats-sub-navigation-title select > option, .stats-sub-navigation-simple-filter-map, .stats-sub-map > a, .stats-top-menu-item, .sidebar-headline, .sidebar-single-line-item, .sidebar-single-line-item > span, .sidebar-single-line-item .sub-tab, .filter-column-header, .filter-column-map-count-con > .text-ellipsis, .legacy-stats-section-button, .context-button, .player-summary-stat-box-left-btn, .showPlayerAverage > span, .player-summary-stat-box-side-rating-text, .player-summary-stat-box-rating-text, .player-summary-stat-box-breakdown-description, .player-summary-stat-box-data-text, .player-summary-tooltip > b, .player-summary-avg-text, .stats-side-selector-wrapper > div, .stats-side-selector, .stats-side-selector > span, .stats-round-toggler-wrapper, .stats-round-toggle, .role-stats-section-title, .role-stats-title, .stats-row > span:first-child, .stats-row > span:first-child > span, .stats-section .standard-headline, .stats-section .featured-sub-text, .stats-section .summary-box .description, .stats-section th, .stats-section th > a, .stats-section th > span, .stats-section td.won, .stats-section td.lost, .stats-section .opponents-location, .stats-section .toggle-fast-multi-kills-only";
  var pageRules = [
    exact("stats.specialty-controls", "player-stats", ".stats-section .toggle-fast-multi-kills-only > a, .tooltip-box.tooltip-attributes > b, .stats-top-menu-item-link", specialtyLabels),
    exact("stats.detached-attribute-tooltip", "player-stats", ".tooltip-box.tooltip-attributes, .tooltip-box.tooltip-attributes > span", playerTooltips),
    exact("stats.specialty-titles", "player-stats", ".stats-section th[title], .stats-section th > span[title]", statisticsTitles, "title"),
    exact("player.labels", "player", profileSlots, profileLabels),
    exact("player.roles", "player", ".playerProfile .player-stat-top > b", roles),
    exact("player.placement", "player", ".playerProfile .placement-cell .achievement", profileLabels),
    { id: "player.collection", module: "player", selector: ".playerProfile .lightbox-title", translate: playerText },
    { id: "player.templates", module: "player", selector: `${profileSlots}, .playerProfile .playerAge .listRight > span, .playerProfile .dob-popup-row > span, .playerProfile .stats-window, .playerProfile .majorWinner, .playerProfile .majorMVP, .playerProfile .placement-cell .achievement, .playerProfile .empty-state > span, .playerProfile .player-timeline-stat .value, .playerProfile b`, translate: playerText },
    { id: "player.rating", module: "player", selector: ".playerProfile .player-stat > b", translate: statsText },
    { id: "player.dates", module: "player", selector: ".playerProfile .time-period-cell > span, .playerProfile .dob-popup-row > span, .playerProfile .playerpage-match-date", translate: dateText },
    exact("player.present", "player", ".playerProfile .time-period-cell", { "- Present": "– 至今", Present: "至今" }),
    exact("player.vs", "player", ".playerProfile .playerpage-vs", { vs: "对阵" }),
    exact("player.pronunciation", "player", ".playerProfile .player-pronunciation-box span", profileLabels),
    exact("player.partners", "player", ".playerProfile .skins-partner-top, .playerProfile .skins-partner-bottom > div", profileLabels),
    { id: "player.peak-time", module: "player", selector: ".playerProfile .value.h-rank", translate: playerText },
    exact("stats.labels", "player-stats", statsSlots, statsLabels),
    exact("stats.roles", "player-stats", ".role-stats-section-title", roles),
    { id: "stats.templates", module: "player-stats", selector: `${statsSlots}, .rating-description, .rating-maps, .player-summary-stat-box-right-map-count, .pagination-data, .diagram-info, .stats-section .stats-row > span, .stats-section .stats-top-menu-item`, translate: statsText },
    { id: "stats.age", module: "player-stats", selector: ".player-summary-stat-box-left-player-age", translate: playerText },
    { id: "stats.time-alive", module: "player-stats", selector: ".role-stats-data", translate: (text) => {
      const m = /^(?:(\d+)m )?(\d+)s$/.exec(text);
      return m ? `${m[1] ? `${m[1]} 分 ` : ""}${m[2]} 秒` : void 0;
    } },
    exact("stats.placeholders", "player-stats", ".search-input-con input[placeholder], .sidebar-box input[placeholder]", { "Add to context..": "加入选手对比…", "Search…": "搜索…" }, "placeholder"),
    { id: "stats.calendar-month", module: "player-stats", selector: ".month-name", translate: dateText },
    exact("stats.calendar-days", "player-stats", ".week-name > th", { su: "日", mo: "一", tu: "二", we: "三", th: "四", fr: "五", sa: "六" }),
    ...["player", "player-stats"].flatMap((module) => [
      exact(`${module}.tooltips`, module, module === "player" ? ".playerProfile .tooltip-box" : ".player-summary-tooltip, .role-stats-section .tooltip-box, .stats-section .tooltip-box", playerTooltips),
      exact(`${module}.role-tooltip-labels`, module, ".tooltip-attributes > b", Object.fromEntries(Object.entries(roles).map(([k, v]) => [`${k}:`, `${v}：`]))),
      exact(`${module}.tooltip-titles`, module, ".stats-row[title], .role-stats-row[title], .sidebar-single-line-item[title]", playerTooltips, "title"),
      { id: `${module}.ranking-tooltip`, module, selector: ".sidebar-single-line-item[title]", target: "title", translate: statsText }
    ])
  ];
  var playerRules = pageRules.flatMap((rule) => {
    if (rule.selector.length <= 1800) return [rule];
    const groups = [];
    for (const selector of rule.selector.split(",")) {
      const last = groups.length - 1;
      if (last >= 0 && groups[last].length + selector.length + 1 <= 1800) groups[last] += "," + selector;
      else groups.push(selector);
    }
    return groups.map((selector, index) => ({ ...rule, id: `${rule.id}.${index + 1}`, selector }));
  });

  // src/adapters/coaches.ts
  var headings = [
    [/^(.+) coach statistics$/, "$1 的执教数据"],
    [/^Team stats for (.+) as coach$/, "$1 的执教队伍数据"],
    [/^Breakdown of teams coached by (.+)$/, "$1 的执教战队履历"],
    [/^Timeline of teams coached by (.+)$/, "$1 的执教战队时间线"],
    [/^Upcoming matches with (.+) as coach$/, "$1 的执教队伍近期赛程"],
    [/^Latest results with (.+) as coach$/, "$1 的执教队伍近期赛果"],
    [/^Major achievements for teams coached by (.+)$/, "$1 的执教队伍 Major 成就"],
    [/^LAN achievements for teams coached by (.+)$/, "$1 的执教队伍线下赛成就"],
    [/^Breakdown of major achievements for teams coached by (.+)$/, "$1 的执教队伍 Major 成就明细"],
    [/^Breakdown of LAN achievements for teams coached by (.+)$/, "$1 的执教队伍线下赛成就明细"],
    [/^Trophy overview for teams coached by (.+)$/, "$1 的执教队伍奖杯概览"],
    [/^All trophies for teams coached by (.+)$/, "$1 的执教队伍全部奖杯"]
  ];
  var coachRules = [
    { id: "coach.headings", module: "coach", selector: ".playerProfile .standard-headline", translate: (text) => {
      for (const [pattern, replacement] of headings) if (pattern.test(text)) return text.replace(pattern, replacement);
      return playerText(text);
    } },
    exact("coach.labels", "coach", ".playerProfile .listLeft, .playerProfile .listRight > span, .playerProfile .player-stat-left > b, .playerProfile .dob-popup-row > span, .playerProfile .person-types .role-name, .playerProfile .person-types .primary-role, .playerProfile .team-detail-map-header > div, .playerProfile .team-detail-map-header > div > span, .playerProfile .sub-headline, .playerProfile .chart-tabs > div, .playerProfile .sub-title", {
      ...profileLabels,
      "Coach achievements": "教练成就",
      "(coach)": "（教练）",
      "Primary role": "主要身份",
      "Map winrate": "地图胜率",
      "CT round winrate": "CT 回合胜率",
      "T round winrate": "T 回合胜率",
      "Best map": "最佳地图",
      "Worst map": "最差地图",
      Map: "地图",
      winrate: "胜率",
      "Win-%": "胜率",
      Played: "场次",
      "Stats from entire coach period": "执教期间全队数据"
    }),
    { id: "coach.samples", module: "coach", selector: ".playerProfile .player-stat-of", translate: (text) => {
      const m = /^Based on ([\d,]+) (maps?|rounds?)$/.exec(text);
      return m ? "基于 " + m[1] + (m[2].startsWith("map") ? " 张地图" : " 个回合") : void 0;
    } },
    { id: "coach.period-and-empty", module: "coach", selector: ".playerProfile .stats-window, .playerProfile .empty-state > span", translate: (text) => {
      let m = /^\(Past (\d+) months?\)$/.exec(text);
      if (m) return "（最近 " + m[1] + " 个月）";
      m = /^No upcoming matches for (.+), check back later\.$/.exec(text);
      return m ? m[1] + " 暂无近期赛程，请稍后查看。" : void 0;
    } },
    exact("coach.pronunciation", "coach", ".playerProfile .player-pronunciation-box span", { "Press play on the media player to find out": "点击播放器播放按钮，收听教练名字的发音" }),
    ...playerRules.filter((rule) => rule.module === "player").map((rule) => ({ ...rule, id: "coach.shared." + rule.id, module: "coach" }))
  ];

  // src/core/types.ts
  function detectPage(path) {
    if (/^\/coach\/\d+(?:\/|$)/.test(path)) return "coach";
    if (/^\/forums(?:\/|$)/.test(path)) return "forum";
    if (/^\/valve-ranking\/teams\/event\/\d+(?:\/|$)/.test(path)) return "vrs-forecast";
    if (/^\/transfers\/?$/.test(path)) return "transfers";
    if (/^\/fantasy\/?$/.test(path)) return "fantasy";
    if (/^\/team\/\d+(?:\/|$)/.test(path)) return "team";
    if (/^\/ranking\/teams\/\d{4}\/[^/]+\/\d{1,2}\/details\/\d+\/?$/.test(path)) return "ranking-detail";
    if (/^\/valve-ranking\/teams\/details\/\d{4}\/[^/]+\/\d{1,2}\/?$/.test(path)) return "valve-ranking-detail";
    if (/^\/valve-ranking\/invites\/?$/.test(path)) return "vrs-invites";
    if (/^\/valve-ranking\/teams(?:\/?$|\/\d{4}\/[^/]+\/\d{1,2}(?:\/region\/[^/]+)?\/?$)/.test(path)) return "valve-ranking";
    if (/^\/ranking\/teams(?:\/|$)/.test(path)) return "ranking";
    if (/^\/player\/\d+(?:\/|$)/.test(path)) return "player";
    if (/^\/stats\/players\/compare(?:\/|$)/.test(path)) return "player-compare";
    if (/^\/stats\/players\/(?:\d+(?:\/|$)|(?:individual|matches|events|career|weapon|clutches|multikills)\/\d+(?:\/|$)|opponents\/(?:team|lineup)\/\d+(?:\/|$))/.test(path)) return "player-stats";
    if (/^\/stats(?:\/|$)/.test(path)) return "statistics";
    if (path === "/") return "home";
    if (/^\/matches\/?$/.test(path)) return "matches";
    if (/^\/matches\/\d+(?:\/|$)/.test(path)) return "match-detail";
    if (/^\/results\/?$/.test(path)) return "results";
    if (/^\/events\/?$/.test(path)) return "events";
    if (/^\/events\/\d+(?:\/|$)/.test(path)) return "event-detail";
    return "other";
  }

  // src/core/guards.ts
  var protectedSelector = [
    "script",
    "style",
    "textarea",
    "code",
    "pre",
    "noscript",
    "iframe",
    '[contenteditable]:not([contenteditable="false"])',
    "[data-hltv-zh-owned]",
    ".newstext",
    ".news-block",
    ".newsitem",
    ".news-article",
    ".article-body",
    ".featured-newstext",
    ".featured-small-newstext",
    "h1.headline",
    ".headertext",
    ".thread-message",
    ".thread-message-text",
    ".forum-middle",
    ".topic",
    // 只允许对阵图明确标记为未知战队的 UI 占位词；真实战队及战队链接仍受保护。
    ".teamName",
    ".team-name:not(.event-page .team-tbd > .team-name)",
    ".player-nick",
    ".playerNickname",
    ".matchTeamName",
    ".playerRealname",
    ".player-summary-stat-box-left-nickname",
    ".player-summary-stat-box-left-player-name",
    ".context-item-name",
    ".image-and-label",
    ".subTab-newsArticle",
    ".fantasy-frontpage .game-name",
    ".fantasy-frontpage .winners",
    ".fantasy-frontpage .leaderboard-table td.player",
    ".fantasy-frontpage .autocomplete-items",
    ".lineups-compare-playername",
    ".player-compare .text-ellipsis",
    ".eventname",
    ".event-name",
    ".event-name-small .text-ellipsis",
    ".event-hub-title",
    ".match-event",
    ".match-table-name-col",
    ".top-x-box > .name",
    ".ranked-team .teamLine > .name",
    ".ranked-team .playersLine",
    ".ranked-team .team-logo",
    ".ranking-vrs-event-header",
    ".ranking-vrs-event-logo",
    ".profile-team-name",
    ".team-country",
    ".playersBox-playernick",
    ".highlighted-team-name",
    ".biggest-map-team-container",
    ".teamProfile .profile-team-logo-container",
    ".teamProfile .last-5-matches img",
    ".chart-classic-tooltip",
    ".teamProfile .major-stickers > h2",
    ".teamProfile .sticker-event",
    ".teamProfile .sticker-version",
    '.teamProfile a[href^="/events/"]',
    '.ranking-details a[href^="/events/"]',
    ".valve-ranking-details table.vrs-details tbody td:nth-child(2)",
    ".valve-ranking-details table.vrs-details tbody td:nth-child(3)",
    "[data-livescore-current-map-score]",
    "[data-livescore-maps-won-for]",
    // 资料入口是 UI，仅放行统计页按钮和比赛阵容对比区明确的资料按钮。
    'a[href^="/team/"]:not(.ranked-team .more > a.moreLink)',
    'a[href^="/player/"]:not(.player-summary-stat-box-left-btn):not(#lineups .lineups-compare-player-link.profile-link)',
    'a[href^="/forums/threads/"]',
    'a[href^="/out"]',
    'a[href^="/betting"]',
    'a[href^="/coach/"]'
  ].join(",");
  function protectedElement(element) {
    if (/^\/coach\/\d+(?:\/|$)/.test(element.ownerDocument.location.pathname) && element.matches(".playerProfile .person-types > a.person-type > .role-name, .playerProfile .person-types > a.person-type > .primary-role") && !element.parentElement?.parentElement?.closest(protectedSelector)) return false;
    if (element.matches('.transfer .transfer-team-container[href^="/team/"] > .transfer-team-status') && !element.parentElement?.parentElement?.closest(protectedSelector)) return false;
    return element.closest(protectedSelector) !== null;
  }
  var weaponSelector = ".stats-rows.standard-box";
  var protectionClasses = new Set([...(protectedSelector + "," + weaponSelector).matchAll(/\.([\w-]+)/g)].map((match) => match[1]));
  function protectedMapElement(element) {
    if (element.closest(".team-name, " + weaponSelector)) return true;
    const link = element.closest("a[href]");
    return !!link && /^\/(?:team\/\d+(?:\/|$)|stats\/(?:players|teams)\/\d+(?:\/|$)|skins\/)/.test(link.getAttribute("href") ?? "");
  }

  // src/core/engine.ts
  var TranslationEngine = class {
    constructor(rules, page, settings2, retry) {
      this.rules = rules;
      this.page = page;
      this.settings = settings2;
      this.retry = retry;
      this.active = this.selectRules();
      this.indexRules();
    }
    rules;
    page;
    settings;
    retry;
    texts = /* @__PURE__ */ new WeakMap();
    implicitOptionValues = /* @__PURE__ */ new WeakMap();
    attributes = /* @__PURE__ */ new WeakMap();
    writeWindows = /* @__PURE__ */ new WeakMap();
    metrics = { visited: 0, writes: 0, errors: 0, throttled: 0 };
    errors = [];
    active;
    textSelectors = [];
    candidateTextRules = [];
    attributeTargets = [];
    selectRules() {
      return this.settings.enabled ? this.rules.filter((r) => this.settings.modules[r.module] && (r.module === "common" || r.module === "maps" || r.module === this.page)) : [];
    }
    indexRules() {
      this.textSelectors = [];
      this.candidateTextRules = this.active.filter((r) => !r.target && r.candidate);
      for (const selector of new Set(this.active.filter((r) => !r.target && !r.candidate).map((r) => r.selector))) {
        const last = this.textSelectors.length - 1;
        if (last >= 0 && this.textSelectors[last].length + selector.length + 1 <= 1800) this.textSelectors[last] += "," + selector;
        else this.textSelectors.push(selector);
      }
      this.attributeTargets = [...new Set(this.active.flatMap((r) => r.target ? [r.target] : []))];
    }
    configure(settings2) {
      this.settings = settings2;
      this.active = this.selectRules();
      this.indexRules();
    }
    permitWrite(node, target) {
      const now = performance.now();
      const fields = this.writeWindows.get(node) ?? /* @__PURE__ */ new Map();
      let state = fields.get(target) ?? { start: now, count: 0, blockedUntil: 0 };
      if (state.blockedUntil > now) {
        this.retry?.(node, state.blockedUntil);
        return false;
      }
      if (now - state.start > 1e3) state = { start: now, count: 0, blockedUntil: 0 };
      state.count++;
      if (state.count > 20) {
        state.blockedUntil = now + 1e4;
        this.metrics.throttled++;
      }
      fields.set(target, state);
      this.writeWindows.set(node, fields);
      if (state.blockedUntil > now) this.retry?.(node, state.blockedUntil);
      return state.blockedUntil <= now;
    }
    resolve(source, element, target) {
      let protectionChecked = false;
      for (const rule of this.active) {
        if (rule.target !== target || rule.candidate && !rule.candidate(source, this.settings) || !element.matches(rule.selector)) continue;
        if (!protectionChecked) {
          if (protectedElement(element)) return;
          protectionChecked = true;
        }
        if (rule.module === "maps" && protectedMapElement(element)) continue;
        try {
          const translated = rule.translate(source.trim(), this.settings);
          if (translated !== void 0) {
            const leading = source.match(/^\s*/)?.[0] ?? "";
            const trailing = source.match(/\s*$/)?.[0] ?? "";
            return { value: leading + translated + trailing, ruleId: rule.id };
          }
        } catch {
          this.metrics.errors++;
          if (this.errors.length < 20 && !this.errors.includes(rule.id)) this.errors.push(rule.id);
        }
      }
    }
    /** 网站替换或清空文字后，撤销失效的隐式值；网站显式写入的值不归脚本所有。 */
    reconcileOption(option) {
      const injected = this.implicitOptionValues.get(option);
      if (injected === void 0) return;
      if (option.getAttribute("value") !== injected) {
        this.implicitOptionValues.delete(option);
        return;
      }
      const walker = option.ownerDocument.createTreeWalker(option, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        const saved = this.texts.get(node);
        if (saved && node.nodeValue === saved.rendered) return;
      }
      option.removeAttribute("value");
      this.implicitOptionValues.delete(option);
    }
    process(node) {
      this.metrics.visited++;
      if (!node.isConnected) return;
      const option = node.nodeType === Node.ELEMENT_NODE ? node.closest("option") : node.parentElement?.closest("option");
      if (option) this.reconcileOption(option);
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node;
        if (!text.parentElement) return;
        const current = text.data;
        const saved = this.texts.get(text);
        if (!saved && (!/[a-z]/i.test(current) || !(this.candidateTextRules.some((rule) => rule.candidate(current, this.settings) && text.parentElement.matches(rule.selector)) || this.textSelectors.some((selector) => text.parentElement.matches(selector))))) return;
        const source = saved && current === saved.rendered ? saved.source : current;
        if (!source.trim() || source.length > 2e3) return;
        const result = this.resolve(source, text.parentElement);
        const value = result?.value ?? source;
        if (current !== value) {
          if (result && !this.permitWrite(text, "text")) return;
          if (text.parentElement.tagName === "OPTION") {
            const option2 = text.parentElement;
            const injected = this.implicitOptionValues.get(option2);
            if (injected !== void 0 && option2.getAttribute("value") === injected) {
              option2.removeAttribute("value");
              this.implicitOptionValues.delete(option2);
            }
            if (result && !option2.hasAttribute("value")) {
              const walker = option2.ownerDocument.createTreeWalker(option2, NodeFilter.SHOW_TEXT);
              let part;
              let original = "";
              while (part = walker.nextNode()) {
                const previous = this.texts.get(part);
                original += part === text ? source : previous && part.nodeValue === previous.rendered ? previous.source : part.nodeValue ?? "";
              }
              const originalValue = original.replace(/\s+/g, " ").trim();
              option2.setAttribute("value", originalValue);
              this.implicitOptionValues.set(option2, originalValue);
            }
          }
          text.data = value;
          this.metrics.writes++;
        }
        if (result && value !== source) this.texts.set(text, { source, rendered: value, ruleId: result.ruleId });
        else this.texts.delete(text);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        const saved = this.attributes.get(element) ?? /* @__PURE__ */ new Map();
        const targets = /* @__PURE__ */ new Set([...saved.keys(), ...this.attributeTargets]);
        for (const target of targets) {
          const current = element.getAttribute(target);
          if (current === null) {
            saved.delete(target);
            if (!this.active.some((rule) => rule.target === target && rule.createMissing && element.matches(rule.selector))) continue;
          }
          const state = saved.get(target);
          const source = state && current === state.rendered ? state.source : current ?? "";
          const result = this.resolve(source, element, target);
          const missing = current === null || !!(state?.missing && current === state.rendered);
          const value = result?.value ?? (missing ? null : source);
          if (current !== value) {
            if (result && !this.permitWrite(element, target)) continue;
            if (value === null) element.removeAttribute(target);
            else element.setAttribute(target, value);
            this.metrics.writes++;
          }
          if (result && value !== null && value !== source) saved.set(target, { source, rendered: value, ruleId: result.ruleId, missing });
          else saved.delete(target);
        }
        if (saved.size) this.attributes.set(element, saved);
        else this.attributes.delete(element);
      }
    }
  };

  // src/core/walker.ts
  function* walk(root) {
    if (!root.isConnected) return;
    if (root.nodeType === Node.TEXT_NODE) {
      yield root;
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    const hardSkip = "script, style, noscript, iframe";
    if (root.matches(hardSkip)) return;
    yield root;
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: (node2) => node2.nodeType === Node.ELEMENT_NODE && node2.matches(hardSkip) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    let node;
    while (node = walker.nextNode()) yield node;
  }

  // src/core/scheduler.ts
  var Scheduler = class {
    constructor(process, budgetMs = 6) {
      this.process = process;
      this.budgetMs = budgetMs;
    }
    process;
    budgetMs;
    pending = /* @__PURE__ */ new Map();
    cursor;
    frame;
    timer;
    stopped = false;
    metrics = { batches: 0, maxBatchMs: 0, maxPending: 0 };
    covered(node) {
      for (let parent = node.parentNode; parent; parent = parent.parentNode) {
        if (this.pending.get(parent)) return true;
      }
      return false;
    }
    enqueue(node, subtree = true) {
      if (this.stopped || !node.isConnected) return;
      if (this.covered(node)) return;
      this.pending.set(node, subtree || this.pending.get(node) === true);
      this.metrics.maxPending = Math.max(this.metrics.maxPending, this.pending.size);
      this.schedule();
    }
    schedule() {
      if (this.frame !== void 0 || this.timer !== void 0 || this.stopped) return;
      this.frame = window.requestAnimationFrame(() => this.run());
      this.timer = window.setTimeout(() => this.run(), 100);
    }
    run() {
      this.cancelHandles();
      const start2 = performance.now();
      let count = 0;
      while (!this.stopped) {
        if (!this.cursor) {
          const entry = this.pending.entries().next().value;
          if (!entry) break;
          const [root, subtree] = entry;
          this.pending.delete(root);
          this.cursor = this.covered(root) ? (function* () {
          })() : subtree ? walk(root) : (function* () {
            yield root;
          })();
        }
        const next = this.cursor.next();
        if (next.done) this.cursor = void 0;
        else this.process(next.value);
        if (++count >= 300 || performance.now() - start2 >= this.budgetMs) break;
      }
      this.metrics.batches++;
      this.metrics.maxBatchMs = Math.max(this.metrics.maxBatchMs, performance.now() - start2);
      if (this.cursor || this.pending.size) this.schedule();
    }
    cancelHandles() {
      if (this.frame !== void 0) cancelAnimationFrame(this.frame);
      if (this.timer !== void 0) clearTimeout(this.timer);
      this.frame = this.timer = void 0;
    }
    stop() {
      this.stopped = true;
      this.cancelHandles();
      this.pending.clear();
      this.cursor = void 0;
    }
  };

  // src/features/player-style.ts
  function playerStyle(doc, page, settings2) {
    const id = "hltv-zh-player-style";
    const active = settings2.enabled && (page === "player" && settings2.modules.player || page === "team" && settings2.modules.team || page === "coach" && settings2.modules.coach);
    let style = doc.getElementById(id);
    if (!active) {
      style?.remove();
      return;
    }
    if (style) return;
    style = doc.createElement("style");
    style.id = id;
    style.setAttribute("data-hltv-zh-owned", "");
    style.textContent = page === "team" ? '.teamProfile .fanbutton.addFan::after { content: "关注战队" !important; } .teamProfile .fanbutton.removeFan::after { content: "取消关注" !important; }' : page === "coach" ? '.playerProfile .fanbutton.addFan::after { content: "关注教练" !important; } .playerProfile .fanbutton.removeFan::after { content: "取消关注" !important; }' : '.playerProfile .fanbutton.addFan::after { content: "关注选手" !important; }';
    doc.head.append(style);
  }

  // src/features/matches-style.ts
  function matchesStyle(doc, page, settings2) {
    const id = "hltv-zh-matches-style";
    let style = doc.getElementById(id);
    if (page !== "matches" || !settings2.enabled || !settings2.modules.matches) {
      style?.remove();
      return;
    }
    if (style) return;
    style = doc.createElement("style");
    style.id = id;
    style.setAttribute("data-hltv-zh-owned", "");
    style.textContent = `
    .matches-v4 .match-info > .match-meta-live { white-space: nowrap; min-width: 3em; }
    .matches-v4 .match-stage { white-space: nowrap; min-width: max-content; }
  `;
    doc.head.append(style);
  }

  // src/core/retry-queue.ts
  var RetryQueue = class {
    constructor(enqueue, limit = 512) {
      this.enqueue = enqueue;
      this.limit = limit;
    }
    enqueue;
    limit;
    pending = /* @__PURE__ */ new Map();
    timer;
    stopped = false;
    metrics = { overflow: 0, retried: 0 };
    get size() {
      return this.pending.size;
    }
    add(node, due) {
      if (this.stopped || !node.isConnected) return;
      const previous = this.pending.get(node);
      if (previous !== void 0 && previous <= due) return;
      if (previous === void 0 && this.pending.size >= this.limit) {
        for (const key of this.pending.keys()) if (!key.isConnected) this.pending.delete(key);
        if (this.pending.size >= this.limit) {
          this.metrics.overflow++;
          return;
        }
      }
      this.pending.set(node, due);
      this.schedule();
    }
    prune() {
      for (const node of this.pending.keys()) if (!node.isConnected) this.pending.delete(node);
      this.schedule();
    }
    schedule() {
      if (this.timer !== void 0) window.clearTimeout(this.timer);
      this.timer = void 0;
      if (!this.pending.size || this.stopped) return;
      const due = Math.min(...this.pending.values());
      this.timer = window.setTimeout(() => {
        this.timer = void 0;
        const now = performance.now();
        for (const [node, deadline] of this.pending) {
          if (!node.isConnected) {
            this.pending.delete(node);
            continue;
          }
          if (deadline > now) continue;
          this.pending.delete(node);
          this.metrics.retried++;
          this.enqueue(node);
        }
        this.schedule();
      }, Math.max(1, Math.ceil(due - performance.now())));
    }
    clear() {
      if (this.timer !== void 0) window.clearTimeout(this.timer);
      this.timer = void 0;
      this.pending.clear();
    }
    stop() {
      this.stopped = true;
      this.clear();
    }
  };

  // src/core/class-effects.ts
  var eventClasses = /* @__PURE__ */ new Set(["team-tbd", "team-name", "round-header"]);
  var protectedClasses = /* @__PURE__ */ new Set([...protectionClasses, "statCell", "hpCell", "armorCell", "weaponCell", "moneyCell", "killCell", "assistCell", "assistFlashCell", "deathCell", "adrCell"]);
  function classChangeRoot(element, oldValue, page) {
    const before = new Set((oldValue ?? "").split(/\s+/).filter(Boolean));
    const after = new Set(element.classList);
    const changed = [...before, ...after].filter((name) => before.has(name) !== after.has(name));
    if (!changed.length) return;
    if (changed.some((name) => protectedClasses.has(name)) && element !== element.ownerDocument.body && element !== element.ownerDocument.documentElement) return element;
    if (page !== "event-detail" || !element.closest(".event-page")) return;
    if (changed.some((name) => eventClasses.has(name))) return element;
    if (changed.includes("collapsed") && element.matches(".round")) return element.querySelector(".round-header") ?? void 0;
  }

  // src/core/runtime.ts
  function start(doc, rules, settings2) {
    const page = detectPage(doc.location.pathname);
    const retries = new RetryQueue((node) => scheduler.enqueue(node, false));
    const engine = new TranslationEngine(rules, page, settings2, (node, due) => retries.add(node, due));
    playerStyle(doc, page, settings2);
    matchesStyle(doc, page, settings2);
    const scheduler = new Scheduler((node) => engine.process(node));
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "childList") {
          if (record.target.closest?.("option")) scheduler.enqueue(record.target);
          for (const node of record.addedNodes) scheduler.enqueue(node);
        } else if (record.type === "attributes" && record.attributeName === "class") {
          const root = classChangeRoot(record.target, record.oldValue, page);
          if (root) scheduler.enqueue(root);
        } else if (record.type === "attributes" && ["href", "contenteditable", "data-hltv-zh-owned", "data-livescore-current-map-score", "data-livescore-maps-won-for"].includes(record.attributeName ?? "")) {
          scheduler.enqueue(record.target);
        } else scheduler.enqueue(record.target, false);
      }
      if (retries.size && records.some((record) => record.removedNodes.length)) retries.prune();
    });
    observer.observe(doc.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["title", "placeholder", "aria-label", "alt", "class", "href", "contenteditable", "data-hltv-zh-owned", "data-livescore-current-map-score", "data-livescore-maps-won-for"]
    });
    scheduler.enqueue(doc.body);
    return {
      engine,
      scheduler,
      retries,
      refresh() {
        scheduler.enqueue(doc.body);
      },
      update(next) {
        retries.clear();
        engine.configure(next);
        playerStyle(doc, page, next);
        matchesStyle(doc, page, next);
        scheduler.enqueue(doc.body);
      },
      stop() {
        observer.disconnect();
        retries.stop();
        scheduler.stop();
      }
    };
  }

  // src/features/settings.ts
  function defaults() {
    return { schemaVersion: 2, enabled: true, maps: "zh-CN", modules: {
      common: true,
      home: true,
      matches: true,
      "match-detail": true,
      results: true,
      events: true,
      player: true,
      "player-stats": true,
      "event-detail": true,
      "player-compare": true,
      statistics: true,
      ranking: true,
      "valve-ranking": true,
      "vrs-invites": true,
      maps: true,
      team: true,
      "ranking-detail": true,
      "valve-ranking-detail": true,
      transfers: true,
      fantasy: true,
      coach: true,
      forum: true,
      "vrs-forecast": true
    } };
  }

  // <stdin>
  var settings = defaults();
  settings.modules.maps = false;
  var runtime = start(document, coachRules, settings);
  window.__hltvCoachPreview = runtime;
})();
