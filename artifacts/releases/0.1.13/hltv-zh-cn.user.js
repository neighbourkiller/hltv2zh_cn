// ==UserScript==
// @name HLTV 简体中文
// @namespace hltv2zh-cn
// @description HLTV 界面汉化：导航、比赛/赛果/赛事、选手资料/数据/对比、战队资料、HLTV/V社排名及详情、VRS 邀请；保护实体、正文与数值
// @match https://www.hltv.org/*
// @run-at document-end
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @noframes
// @version 0.1.13
// ==/UserScript==
"use strict";
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

  // src/locales/zh-CN/common.ts
  var navigation = {
    News: "新闻",
    Matches: "比赛",
    Results: "赛果",
    Events: "赛事",
    Players: "选手",
    Stats: "数据",
    Fantasy: "Fantasy",
    Forum: "论坛",
    Media: "媒体",
    Live: "直播",
    Major: "Major",
    "All events": "所有赛事",
    Ongoing: "进行中",
    Archive: "存档",
    Calendar: "日历",
    "VRS Invites": "VRS 邀请",
    "Retired Players": "退役选手",
    Transfers: "转会",
    "Hall of Fame": "名人堂",
    "Stats overview": "数据总览",
    "Top players": "顶尖选手",
    "Top teams": "顶尖战队",
    Maps: "地图",
    "Fantasy overview": "Fantasy 总览",
    "Hardware & Tweaks": "硬件与优化",
    "Bugs & Suggestions": "问题与建议",
    Galleries: "图集",
    Overview: "概览",
    "Sign in": "登录"
  };
  var placeholders = {
    "Search...": "搜索…",
    "Search team...": "搜索战队…",
    "Search player": "搜索选手",
    "Event search": "搜索赛事",
    "Player search": "搜索选手",
    "Team search": "搜索战队",
    "Country search": "搜索国家",
    Username: "用户名",
    Password: "密码",
    "Username or email": "用户名或邮箱",
    "Start date": "开始日期",
    "End date": "结束日期"
  };
  var controls = {
    "Sign in": "登录",
    Login: "登录",
    "Sign up": "注册",
    "Remember me": "记住我",
    "Forgot password": "忘记密码",
    Username: "用户名",
    Password: "密码",
    Settings: "设置",
    Theme: "主题",
    "Show results": "显示赛果",
    Timezone: "时区",
    "Automatic timezone": "自动检测时区",
    "Force desktop mode": "强制桌面模式",
    "Match filter settings": "比赛筛选设置",
    "Enable filter": "启用筛选",
    "Reset filter": "重置筛选",
    "Match type": "比赛类型",
    "Star filter": "星级筛选",
    "Live match": "正在进行的比赛",
    LAN: "线下赛",
    "Min. stars": "最低星级",
    Close: "关闭",
    Save: "保存"
  };

  // src/locales/zh-CN/matches.ts
  var labels = {
    "Live Counter-Strike matches": "正在进行的 CS 比赛",
    "Upcoming Counter-Strike matches": "即将开始的 CS 比赛",
    "Match filters": "比赛筛选",
    "Clear all": "清除全部",
    Clear: "清除",
    Star: "星级",
    Ranked: "计入排名",
    Unranked: "不计入排名",
    Region: "区域",
    Tournament: "赛事",
    "Starred matches only": "仅显示有星级的比赛",
    "Set filters": "应用筛选",
    "Sort by:": "排序方式：",
    Event: "赛事",
    Time: "时间",
    LIVE: "进行中",
    "Matches for you": "为你推荐的比赛",
    "Why am I seeing these matches?": "为什么显示这些比赛？",
    "No matches yet": "暂无比赛",
    "No matches found": "未找到比赛",
    "No streams yet": "暂无直播",
    Maps: "地图",
    Watch: "观看",
    Lineups: "阵容",
    "Head to head": "历史交锋",
    "Match stats": "比赛数据",
    "Match over": "比赛结束",
    "Map stats": "地图数据",
    "Player of the match": "本场最佳选手",
    "World rank:": "世界排名：",
    "Show all head to heads": "查看全部历史交锋",
    Rewatch: "回看",
    Highlights: "精彩集锦",
    "VRS forecast": "VRS 预测",
    "VRS result": "VRS 结果",
    "Pick": "选择",
    "Grand final": "总决赛",
    Semifinal: "半决赛",
    Quarterfinal: "四分之一决赛",
    Playoffs: "淘汰赛",
    "Group stage": "小组赛",
    "Round of 16": "十六强",
    "Upper bracket final": "胜者组决赛",
    "Lower bracket final": "败者组决赛",
    "Elimination match": "淘汰赛",
    "Decider match": "出线决胜战",
    "English stream:": "英语直播：",
    "Russian stream:": "俄语直播："
  };
  var filters = {
    Filters: "筛选",
    Stars: "星级",
    Time: "时间",
    "Match type": "比赛类型",
    Map: "地图",
    Event: "赛事",
    Player: "选手",
    Team: "战队",
    Game: "游戏",
    "Valve ranked": "V社排名",
    All: "全部",
    "All time": "全部时间",
    "Past month": "过去一个月",
    "Past 3 months": "过去三个月",
    "Past 6 months": "过去六个月",
    "Past year": "过去一年",
    "Today": "今天",
    "Yesterday": "昨天",
    Online: "线上赛",
    "International LAN": "国际线下赛",
    "Regional LAN": "区域线下赛",
    "Local LAN": "本地线下赛",
    Other: "其他",
    "Featured results": "精选赛果"
  };
  var maps = {
    dust2: "炽热沙城",
    "dust 2": "炽热沙城",
    d2: "炽热沙城",
    mirage: "荒漠迷城",
    mrg: "荒漠迷城",
    inferno: "炼狱小镇",
    inf: "炼狱小镇",
    nuke: "核子危机",
    overpass: "死亡游乐园",
    ovp: "死亡游乐园",
    vertigo: "殒命大厦",
    vrt: "殒命大厦",
    ancient: "远古遗迹",
    anc: "远古遗迹",
    train: "列车停放站",
    trn: "列车停放站",
    anubis: "阿努比斯",
    anb: "阿努比斯",
    cache: "死城之谜",
    cobblestone: "古堡激战",
    cbl: "古堡激战",
    tuscan: "托斯卡纳"
  };
  var lineupComparison = {
    "Highlighted stats": "重点数据",
    "(Past 3 months)": "(最近 3 个月)",
    "Kills per round": "每回合击杀",
    "Deaths per round": "每回合阵亡",
    "Multi-kill rating": "多杀评分",
    "Round Swing": "回合胜率影响",
    "Average damage per round": "每回合平均伤害",
    "Player profile": "选手资料",
    Profile: "资料",
    Stats: "数据",
    "Full comparison": "完整对比"
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
  function relativeTime(source) {
    const m = /^(a few|a|an|one|two|\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i.exec(source.trim());
    if (!m) return;
    const count = { a: "1", an: "1", one: "1", two: "2", "a few": "几" }[m[1].toLowerCase()] ?? m[1];
    const unit = { second: "秒", minute: "分钟", hour: "小时", day: "天", week: "周", month: "个月", year: "年" }[m[2].toLowerCase()];
    return `${count}${unit}前`;
  }

  // src/adapters/home-sidebar.ts
  var homeSidebarRules = [
    exact("home.sponsors", "common", ".presented-by-row h1 > a", {
      "AWARD BY": "颁奖给",
      "RANKING BY": "排名"
    }),
    exact("home.fpl-heading", "common", 'h1 > a[href^="https://www.faceit.com/"]', {
      "FPL RANKING": "FPL 排名"
    }),
    exact("home.sidebar-buttons", "common", 'a.block.button[href="/ranking/teams"], a.block.button[href^="https://www.faceit.com/"], a.block.button[href="/calendar"]', {
      "Complete ranking": "完整排名",
      "Event calendar": "赛事日历"
    }),
    exact("home.ranking-updated-label", "common", 'a.block.button[href="/ranking/teams"] > .normal-weight', {
      "Last updated:": "最后更新："
    }),
    {
      id: "home.ranking-updated-date",
      module: "common",
      selector: 'a.block.button[href="/ranking/teams"] > .normal-weight',
      translate: dateText
    },
    exact("home.weekly-player", "common", ".playerOfTheWeekCategory, .playerOfTheWeekTitle", {
      "Player of the week": "本周最佳选手",
      "Most damage / round": "每回合伤害最高",
      "Opening duels won": "首次交锋胜率",
      "AWP kills / round": "每回合 AWP 击杀",
      Clutches: "残局获胜"
    }),
    exact("home.event-live", "common", "a.event > .live", { Live: "进行中" }),
    { id: "home.event-countdown", module: "common", selector: "a.event > .eventcountdown", translate: (source) => {
      const match = /^(\d+)\s+days?$/i.exec(source);
      return match ? `${match[1]} 天后` : void 0;
    } },
    { id: "common.stream-viewers", module: "common", selector: ".streams-viewers[data-active-stream-viewers]", translate: (source) => {
      const match = /^(\d[\d,]*)\s+viewers?$/i.exec(source);
      return match ? `${match[1]} 人观看` : void 0;
    } },
    exact("home.new-topic", "common", 'a.button[href="/forums/create-thread"]', { "Post new topic": "发布新主题" }),
    exact("home.minigame", "common", "h1.minigame-label-new", { MINIGAME: "小游戏" }),
    exact("common.footer-headings", "common", ".footer-section-header", {
      "HLTV merchandise": "HLTV 周边",
      "Download the HLTV app": "下载 HLTV 应用"
    }),
    exact("common.footer-copy", "common", ".footer-section-subtext, a.footer-cta-button", {
      "HLTV Community t-shirt and sweatshirt available now": "HLTV 社区 T 恤及卫衣现已发售",
      "Optimized to keep you up to date on the go": "随时随地掌握最新资讯",
      "Buy HLTV merch": "购买 HLTV 周边"
    }),
    exact("common.footer-links", "common", "a.footerlink", {
      Jobs: "招聘",
      Contact: "联系我们",
      About: "关于我们",
      Terms: "使用条款",
      "Privacy policy": "隐私政策",
      "Cookie policy": "Cookie 政策",
      Disclosures: "披露声明",
      Skins: "皮肤"
    })
  ];

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

  // src/locales/zh-CN/events.ts
  var eventLabels = {
    Matches: "比赛",
    Results: "赛果",
    Stats: "数据",
    Sections: "栏目",
    News: "新闻",
    Date: "日期",
    "Prize pool": "奖金池",
    Teams: "参赛队伍",
    Location: "地点",
    Brackets: "对阵图",
    "Group play": "小组赛",
    "Prize distribution": "奖金分配",
    "Teams attending": "参赛队伍",
    Highlights: "精彩集锦",
    Galleries: "图集",
    Formats: "赛制",
    "Related events": "相关赛事",
    "Event data": "赛事信息",
    "Map pool": "地图池",
    "Show lineups": "显示阵容",
    "Hide lineups": "隐藏阵容",
    "More news": "更多新闻",
    Live: "进行中",
    "Detailed view": "详细视图",
    "Compact view": "简洁视图",
    Simulator: "模拟器",
    "Now playing": "正在播放",
    "Browse highlights": "浏览集锦",
    views: "次观看",
    "Start date": "开始日期",
    "End date": "结束日期",
    "VRS date": "VRS 日期",
    "VRS weight": "VRS 权重",
    "Total prize pool": "总奖金池",
    "Player share": "选手分成",
    "Club share": "俱乐部分成",
    "Player Share:": "选手分成：",
    "Club Share:": "俱乐部分成：",
    "Event type": "赛事类型",
    Ranked: "计入排名",
    Unranked: "不计入排名",
    "VRS (Global)": "VRS（全球）",
    "VRS (Europe)": "VRS（欧洲）",
    "VRS (Americas)": "VRS（美洲）",
    "VRS (Asia)": "VRS（亚洲）",
    "VRS invite stakes": "VRS 邀请机会影响",
    Else: "其他情况",
    "Group Swiss": "瑞士轮小组",
    Record: "地图战绩"
  };
  var eventStages = {
    Playoffs: "淘汰赛",
    "Group stage": "小组赛",
    "Quarter-finals": "四分之一决赛",
    Quarters: "八强赛",
    "Semi-finals": "半决赛",
    Semis: "半决赛",
    "Grand final": "总决赛",
    Final: "决赛",
    "3rd Place Decider Match": "季军决胜赛",
    Tiebreaker: "加赛",
    "Round of 16": "十六强",
    "Upper bracket": "胜者组",
    "Lower bracket": "败者组",
    "Upper bracket final": "胜者组决赛",
    "Lower bracket final": "败者组决赛",
    "Upper bracket semi-final": "胜者组半决赛",
    "Lower bracket semi-final": "败者组半决赛"
  };
  var eventWeekdays = {
    Monday: "周一",
    Tuesday: "周二",
    Wednesday: "周三",
    Thursday: "周四",
    Friday: "周五",
    Saturday: "周六",
    Sunday: "周日",
    Mon: "周一",
    Tue: "周二",
    Wed: "周三",
    Thu: "周四",
    Fri: "周五",
    Sat: "周六",
    Sun: "周日"
  };
  var eventTooltips = {
    Collapse: "收起",
    Expand: "展开",
    "Collapse round": "收起本轮",
    "Expand round": "展开本轮",
    "Go to all ranked events": "查看所有计入排名的赛事",
    Matches: "比赛数",
    "Rounds won": "获胜回合",
    "Rounds lost": "失利回合",
    "Round difference": "回合净胜差",
    "Map record": "地图战绩",
    "Expand matches": "展开比赛",
    "The teams whose invite chance hangs most on this event: their chance with a deep run here, and without one, from the invite simulation.": "邀请模拟中，受本赛事影响最大的战队：分别显示取得较好成绩和未取得较好成绩时的获邀概率。"
  };

  // src/adapters/event-detail.ts
  var eventDetailRules = [
    exact("event-detail.sidebar", "event-detail", ".sidebar-con .sidebar-headline, .sidebar-con .sidebar-single-line-item", eventLabels),
    exact("event-detail.labels", "event-detail", [
      ".event-page .section-header",
      ".event-page .section-header > span",
      ".event-header-component th.headline",
      ".event-page .meta-header",
      ".event-page .format-header",
      ".event-page .moneyShare-row-left",
      ".event-page .event-hub-indicator",
      ".event-page .show-lineups",
      ".event-page .toggle-swiss-group-display",
      ".event-page .toggle-group-swiss-simulator",
      ".event-page .team-box .event-text",
      '.event-page a.button-more[href^="/news/archive"]',
      ".event-page .playing-info-flex > span",
      ".event-page .playing-info-flex > div",
      ".event-page .highlight-overview-header",
      ".event-page .vrs-event-stakes-head > span",
      ".event-page .vrs-popup",
      ".event-page .event-groups-container .table-header"
    ].join(","), { ...eventLabels, ...eventTooltips }),
    exact("event-detail.stages", "event-detail", ".event-page .slotted-bracket-header > .name, .event-page .round-header, .event-page .format-header", eventStages),
    exact("event-detail.weekdays", "event-detail", ".event-page .time-day-of-week", eventWeekdays),
    exact("event-detail.placeholder", "event-detail", ".event-page .team-tbd > .team-name", { TBD: "待定" }),
    exact("event-detail.tooltips", "event-detail", ".event-page .round-header, .event-page .slotted-bracket-header .toggle, .event-page td[title]", eventTooltips, "title"),
    { id: "event-detail.date", module: "event-detail", selector: '.event-header-component .eventdate span[data-time-format], .event-page td > [data-time-format="MMM do yyy"]', translate: dateText },
    { id: "event-detail.placement", module: "event-detail", selector: ".event-page .placement > div:not([class])", translate: (text) => {
      const m = /^(\d+)(?:\s*[-–]\s*(\d+))?(?:st|nd|rd|th)$/.exec(text);
      return m ? `第 ${m[1]}${m[2] ? "–" + m[2] : ""} 名` : void 0;
    } },
    { id: "event-detail.club-share", module: "event-detail", selector: ".event-page .club-share", translate: (text) => {
      const m = /^(\+\s*)?Club share:\s*(\$[\d,]+(?:\.\d+)?)$/i.exec(text);
      return m ? `${m[1] ?? ""}俱乐部分成：${m[2]}` : void 0;
    } },
    { id: "event-detail.day", module: "event-detail", selector: ".event-page .highlight-group-name, .event-page .highlight-overview-header > .overview-right, .event-page .gallery-name", translate: (text) => {
      const m = /^Day (\d+)$/.exec(text);
      return m ? `第 ${m[1]} 天` : void 0;
    } },
    { id: "event-detail.counts", module: "event-detail", selector: ".event-page .highlight-group-count, .event-page .thumbnail-view-count", translate: (text) => {
      const m = /^([\d,]+) (highlights?|views?)$/.exec(text);
      return m ? `${m[1]} ${m[2].startsWith("highlight") ? "段集锦" : "次观看"}` : void 0;
    } },
    { id: "event-detail.invite-more", module: "event-detail", selector: ".event-page .vrs-event-stakes-more", translate: (text) => {
      const m = /^(\d+) more invites? (?:is|are) affected$/.exec(text);
      return m ? `另有 ${m[1]} 个邀请名额受影响` : void 0;
    } },
    { id: "event-detail.invite-top", module: "event-detail", selector: ".event-page .vrs-event-stakes-head > .vrs-event-stakes-with", translate: (text) => {
      const m = /^Top (\d+)$/i.exec(text);
      return m ? `前 ${m[1]} 名` : void 0;
    } },
    { id: "event-detail.invite-tooltip", module: "event-detail", selector: ".event-page .vrs-event-stakes-head", target: "title", translate: (text) => {
      const m = /^Invite chance if they finish top (\d+) here, and if not$/.exec(text);
      return m ? `在本赛事进入前 ${m[1]} 名和未进入时的获邀概率` : void 0;
    } },
    { id: "event-detail.format", module: "event-detail", selector: ".event-page .format-data", translate: (text) => {
      const formats = { Swiss: "瑞士轮", "Single elimination": "单败淘汰", "Double elimination": "双败淘汰", "Round robin": "循环赛", "Grand final": "总决赛", "3rd place decider match": "季军决胜赛" };
      let changed = false;
      const value = text.split("\n").map((line) => {
        const m = /^(\s*(?:[-*]\s*)?)(Swiss|Single elimination|Double elimination|Round robin|Grand final|3rd place decider match)\s+Bo(1|3|5|7)(\s*)$/i.exec(line);
        if (!m) return line;
        const key = Object.keys(formats).find((key2) => key2.toLowerCase() === m[2].toLowerCase());
        changed = true;
        return `${m[1]}${formats[key]} BO${m[3]}${m[4]}`;
      }).join("\n");
      return changed ? value : void 0;
    } }
  ];

  // src/locales/zh-CN/player-compare.ts
  var compareLabels = {
    "All Time": "全部时间",
    "Past month": "最近 1 个月",
    "Past 3 months": "最近 3 个月",
    "All matches": "全部比赛",
    Majors: "Major 赛事",
    "Big events": "大型赛事",
    "MVP events": "设有 MVP 的赛事",
    LAN: "线下赛",
    Online: "线上赛",
    "All Maps": "全部地图",
    "Add player": "添加选手",
    "remove player": "移除选手",
    KPR: "每回合击杀",
    KAST: "不白给率",
    "Multi-kill rating": "多杀评分",
    "Round Swing": "回合影响力",
    "Assists per round": "每回合助攻",
    Surviving: "存活率",
    Impact: "影响力",
    "AWP kills per round": "AWP 每回合击杀",
    "AWP KPR": "AWP 每回合击杀",
    "Headshot %": "爆头率",
    "HS %": "爆头率",
    "Opening kills per round": "每回合首杀",
    "Opening KPR": "每回合首杀",
    "Flash assists per round": "每回合闪光助攻",
    "Flash assists": "闪光助攻",
    Form: "状态走势"
  };
  var compareNavigation = {
    Navigation: "导航",
    Overview: "概览",
    Players: "选手",
    Teams: "战队",
    Matches: "比赛",
    Events: "赛事",
    Maps: "地图",
    Leaderboards: "排行榜",
    Compare: "选手对比"
  };

  // src/adapters/maps.ts
  function mapName(text, settings) {
    const key = normalize(text);
    return settings.maps === "zh-CN" && settings.modules.maps && Object.hasOwn(maps, key) ? maps[key] : void 0;
  }
  var candidate = (text, settings) => mapName(text, settings) !== void 0;
  var mapRules = [
    { id: "maps.text", module: "maps", selector: "*", candidate, translate: mapName },
    ...["title", "alt", "aria-label"].map((target) => ({
      id: `maps.${target}`,
      module: "maps",
      selector: `[${target}]`,
      target,
      candidate,
      translate: mapName
    }))
  ];

  // src/adapters/player-compare.ts
  var labels2 = new Map(Object.entries(compareLabels).map(([key, value]) => [normalize(key), value]));
  function compareFilterText(source, settings) {
    const parts = source.split(",").map((part) => part.trim());
    if (parts.length !== 3) return;
    const [time, match, map] = parts;
    if (!/^(?:All Time|Past month|Past 3 months|\d{4})$/i.test(time) || !/^(?:All matches|Majors|Big events|MVP events|LAN|Online)$/i.test(match) || !(normalize(map) === "all maps" || maps[map.toLowerCase()] || /^(Season|Tuscan)$/i.test(map))) return;
    return [
      labels2.get(normalize(time)) ?? time,
      labels2.get(normalize(match)),
      normalize(map) === "all maps" ? compareLabels["All Maps"] : mapName(map, settings) ?? map
    ].join("，");
  }
  var playerCompareRules = [
    exact("compare.labels", "player-compare", [
      ".stats-player-compare .filter-selector > option",
      ".stats-player-compare .stat-row-name",
      ".stats-player-compare .stat-name-col",
      ".stats-player-compare .standard-headline",
      ".stats-player-compare .player-and-filter > span",
      ".stats-player-compare .remove-player-link"
    ].join(","), compareLabels),
    exact("compare.navigation", "player-compare", ".sidebar-con .sidebar-headline, .sidebar-con .sidebar-single-line-item, .sidebar-con .sidebar-single-line-item > span", compareNavigation),
    exact("compare.placeholder", "player-compare", ".stats-player-compare .player-search-input", { "Search player": "搜索选手" }, "placeholder"),
    { id: "compare.map-count", module: "player-compare", selector: ".stats-player-compare .selector-map-count", translate: (text) => {
      const m = /^Based on (\d[\d,]*) maps?$/.exec(text);
      return m ? `基于 ${m[1]} 张地图` : void 0;
    } },
    { id: "compare.filters", module: "player-compare", selector: ".stats-player-compare .filter-text", translate: compareFilterText },
    { id: "compare.diagram", module: "player-compare", selector: ".stats-player-compare .diagram-info", translate: (text) => {
      const m = /^Sliding window of rating (\d+\.\d+)(?: for matches in the past (\d+) months)? - 1 day increments$/i.exec(text);
      return m ? `${m[2] ? `最近 ${m[2]} 个月比赛的 ` : ""}Rating ${m[1]} 滑动窗口，每次递进 1 天` : void 0;
    } }
  ];

  // src/adapters/statistics.ts
  var labels3 = {
    ...statsLabels,
    ...specialtyLabels,
    "Top players": "顶尖选手",
    "Top teams": "顶尖战队",
    "Top weapons": "常用武器",
    "Ranking (both teams)": "排名（双方战队）",
    "Ranking filter": "排名筛选",
    Aces: "五杀",
    "Distribution of maps played": "出场地图分布",
    "Distribution of T / CT wins on maps": "各地图 T / CT 胜场分布",
    "Min. maps:": "最少地图数：",
    "Player": "选手",
    "KPR": "每回合击杀",
    KAST: "不白给率",
    Country: "国家/地区",
    Gender: "性别",
    Age: "年龄",
    Men: "男子",
    Women: "女子",
    "Min age": "最低年龄",
    "Max age": "最高年龄"
  };
  var slots = [
    ".stats-sub-navigation-title > .tab-title",
    ".stats-sub-navigation-title select > option",
    ".stats-sub-navigation-simple-filter-map",
    ".stats-sub-navigation-simple-filter-version > a",
    ".sidebar-con .sidebar-headline",
    ".sidebar-con .sidebar-single-line-item",
    ".sidebar-con .sidebar-single-line-item > span",
    ".sidebar-con .filter-column-header",
    ".sidebar-con .filter-column-map-count-con > .text-ellipsis",
    ".sidebar-con .filter-column-age-con > .text-ellipsis",
    ".sidebar-con .filter-column-min-map-count-con > .text-ellipsis",
    ".legacy-stats-section-button",
    ".stats-section .standard-headline",
    ".top-x-box .average",
    ".stats-section .context-button",
    ".stats-section th",
    ".stats-section th > a",
    ".stats-section th > span",
    ".stats-section .stats-top-menu-item, .stats-section .stats-top-menu-item-link",
    ".stats-section .toggle-fast-multi-kills-only, .stats-section .toggle-fast-multi-kills-only > a",
    ".stats-section .tooltip-attributes > b",
    ".tooltip-box.tooltip-attributes > b"
  ].join(",");
  var statisticsRules = [
    exact("statistics.labels", "statistics", slots, labels3),
    { id: "statistics.templates", module: "statistics", selector: `${slots}, .pagination-data`, translate: (text) => /^Rating\b/i.test(text) ? void 0 : statsText(text) },
    exact("statistics.live", "statistics", ".event-hub-indicator", { Live: "进行中" }),
    exact("statistics.search", "statistics", ".search-input-con input", { "Add to context..": "加入选手对比…" }, "placeholder"),
    exact("statistics.tooltips", "statistics", ".sidebar-single-line-item[title]", playerTooltips, "title"),
    exact("statistics.table-titles", "statistics", ".stats-section th[title], .stats-section th > span[title]", statisticsTitles, "title"),
    exact("statistics.expanded-tooltips", "statistics", ".stats-section .tooltip-box, .stats-section .tooltip-box > span, .tooltip-box.tooltip-attributes, .tooltip-box.tooltip-attributes > span", playerTooltips),
    exact("statistics.search-help", "statistics", ".sidebar-con [title]", {
      "Search the stats section for teams, players and events, from here you can easily add them to your context.": "搜索数据专区的战队、选手和赛事，并将它们加入当前对比。"
    }, "title")
  ];

  // src/adapters/match-detail.ts
  function voteText(text) {
    const result = /^won with (\d+(?:\.\d+)?)% of the votes$/i.exec(text);
    if (result) return `以 ${result[1]}% 的得票率获胜`;
    if (/^Vote ends in:$/i.test(text)) return "投票倒计时：";
  }
  var matchDetailRules = [
    exact("detail.stats-controls", "match-detail", '.match-page .toggle-eco-adjusted, .match-page .ct-t-stats-container .description, .match-page .all-stats, .match-page .t-stats-only > span, .match-page .ct-stats-only > span, .match-page .dynamic-map-name-full, .match-page .dynamic-map-name-short, .match-page a[href^="/stats/matches/"]', {
      "Eco-adjusted": "经济调整",
      "Eco-adj": "经济调整",
      Side: "阵营",
      Both: "双方",
      Terrorist: "T 方",
      "Counter-Terrorist": "CT 方",
      "All maps": "全部地图",
      All: "全部",
      "Detailed stats": "详细数据",
      STATS: "数据"
    }),
    exact("detail.stats-headings", "match-detail", ".match-page .potm-chart-stat", {
      Swing: "回合影响力",
      "MK rating": "多杀评分"
    }),
    exact("detail.stats-compact-headings", "match-detail", ".match-page .header-row > td", { Swing: "影响力" }),
    exact("detail.stats-titles", "match-detail", ".match-page .header-row > td[title]", statisticsTitles, "title"),
    exact("detail.top-player", "match-detail", ".match-page .headline", { "Top player in match": "本场最佳选手", "Matches, past 3 months": "最近 3 个月的比赛" }),
    { id: "detail.vote", module: "match-detail", selector: ".match-page .headline > .subtext, .match-page .motm-countdown", translate: voteText },
    { id: "detail.top-player-maps", module: "match-detail", selector: ".match-page .potm-container .header-info", translate: (text) => {
      const m = /^\((\d+) maps?\)$/.exec(text);
      return m ? `(${m[1]} 张地图)` : void 0;
    } }
  ];
  var recommendedMatchRules = [
    exact("matches.recommendation", "matches", ".starred-matches-description-tooltip, #for-you-empty-div, #for-you-empty-div > b", {
      "For you are a collection of matches that are either about to start, manually pinned, feature your favorite player(s) or team(s), or are related to your current location.": "为你推荐即将开始、手动置顶、包含你关注的选手或战队，或与你当前所在地相关的比赛。",
      "No matches for you yet.": "暂时没有为你推荐的比赛。",
      "Click the": "点击比赛旁的",
      "icon next to a match to pin them for easier access, or check back later": "图标即可置顶，方便查看；也可以稍后再来。"
    })
  ];

  // src/locales/zh-CN/ranking.ts
  var rankingNavigation = {
    "World ranking": "世界排名",
    "Regional rankings": "区域排名",
    "Valve ranking": "V社排名",
    "Regional Valve ranking": "区域V社排名",
    "VRS Invites": "VRS 邀请",
    World: "世界",
    Regional: "区域",
    Valve: "V社",
    ranking: "排名",
    rankings: "排名",
    Invites: "邀请"
  };
  var rankingLabels = {
    "HLTV Team profile": "HLTV 战队档案",
    "Ranking details": "排名详情",
    "NEW TEAM": "新上榜",
    Filters: "筛选",
    Year: "年份",
    Month: "月份",
    Day: "日期"
  };
  var rankingMonths = {
    January: "一月",
    February: "二月",
    March: "三月",
    April: "四月",
    May: "五月",
    June: "六月",
    July: "七月",
    August: "八月",
    September: "九月",
    October: "十月",
    November: "十一月",
    December: "十二月"
  };
  var rankingRegions = {
    "North America": "北美",
    "South America": "南美",
    Europe: "欧洲",
    Asia: "亚洲",
    Americas: "美洲",
    Oceania: "大洋洲",
    Africa: "非洲",
    "United States": "美国",
    Argentina: "阿根廷",
    Brazil: "巴西",
    Denmark: "丹麦",
    Finland: "芬兰",
    Poland: "波兰",
    Portugal: "葡萄牙",
    Romania: "罗马尼亚",
    Russia: "俄罗斯",
    Sweden: "瑞典",
    Türkiye: "土耳其",
    Turkey: "土耳其",
    Ukraine: "乌克兰",
    "United Kingdom": "英国",
    China: "中国",
    Mongolia: "蒙古",
    Australia: "澳大利亚"
  };
  var rankingDescription = {
    "HLTV's world ranking of Counter-Strike Teams": "HLTV 反恐精英战队世界排名",
    "How is the ranking calculated?": "排名如何计算？",
    "HLTV's world ranking ranks the best teams in the competitive field of Counter-Strike. The ranking is updated weekly, and teams move up or down based on their recent performance in competitive matches over the last 2 months.": "HLTV 世界排名对反恐精英职业赛场上的顶尖战队进行排名。排名每周更新，战队根据过去 2 个月的比赛表现上升或下降。",
    "The world ranking is based on teams' achievements over the past year (with severe decay in points throughout each month), recent form over the last 2 months and performance at the last 10 LAN events.": "世界排名依据战队过去一年的成绩（积分每月大幅衰减）、最近 2 个月的状态，以及最近 10 场线下赛事的表现计算。",
    "All of that is predicated around a 3-man core each team is required to have in order to retain their past points. Online matches and tournaments are included, but with a diminishing factor which means they cannot make a big difference among the top teams, and mainly serve to put new teams on the map.": "战队须保留 3 人核心阵容，才能继承此前的积分。线上比赛和赛事也计入排名，但权重较低，对顶尖战队之间的排名影响有限，主要帮助新战队进入排名。"
  };

  // src/adapters/ranking.ts
  var rankingRules = [
    exact("ranking.navigation", "ranking", ".nav > .navItem, .nav > .navItem > .gtSmartphone-only", rankingNavigation),
    exact("ranking.regions", "ranking", "#ranking-region-selector > .sub-region-name, #ranking-region-selector > .ranking-country > a", rankingRegions),
    exact("ranking.buttons", "ranking", '.ranked-team .more > a.moreLink[href^="/team/"], .ranked-team .more > a.moreLink[href^="/ranking/teams/"]', rankingLabels),
    exact("ranking.change", "ranking", ".ranked-team .ranking-header > .change", rankingLabels),
    exact("ranking.filters", "ranking", ".filter-column-headline, .sidebar-headline, .filter-column-header", rankingLabels),
    exact("ranking.months", "ranking", '.filter-column-content a.sidebar-single-line-item[href^="/ranking/teams/"]', rankingMonths),
    exact("ranking.description", "ranking", ".description-box, .description-box > h1, .description-box > h2", rankingDescription),
    { id: "ranking.header", module: "ranking", selector: ".regional-ranking-header-text", translate: (text) => {
      let m = /^Counter-Strike World ranking on (.+)$/.exec(text);
      if (m) {
        const date = dateText(m[1]);
        return date ? `反恐精英世界排名（${date}）` : void 0;
      }
      m = /^Team ranking for (.+) on (.+)$/.exec(text);
      if (m) {
        const date = dateText(m[2]);
        return date ? `${rankingRegions[m[1]] ?? m[1]}战队排名（${date}）` : void 0;
      }
    } },
    { id: "ranking.points", module: "ranking", selector: ".ranked-team .teamLine > .points", translate: (text) => {
      if (/^points\)$/i.test(text)) return "积分)";
      const m = /^(\([\d,]+\s+(?:HLTV\s+)?)points\)$/i.exec(text);
      return m ? `${m[1]}积分)` : void 0;
    } },
    { id: "ranking.day", module: "ranking", selector: '.filter-column-content a.sidebar-single-line-item[href^="/ranking/teams/"]', translate: (text) => {
      const m = /^(\d{1,2})(?:st|nd|rd|th)$/i.exec(text);
      return m && +m[1] >= 1 && +m[1] <= 31 ? `${m[1]}日` : void 0;
    } }
  ];

  // src/locales/zh-CN/valve-ranking.ts
  var valveRegions = { Global: "全球", EU: "欧洲", AM: "美洲", AS: "亚洲", Europe: "欧洲", Americas: "美洲", Asia: "亚洲" };
  var valveLabels = {
    Beta: "测试版",
    Official: "官方",
    Valve: "V社",
    "This is an old roster": "这是旧阵容",
    "This ranking includes matches and secured prize money from unfinished events.": "此排名计入尚未结束的赛事中的比赛和已确定获得的奖金。",
    "Valve ranking of Counter-Strike Teams": "反恐精英战队V社排名",
    "Ranking follows Valve's model for ranking Counter-Strike teams.": "本排名采用V社的反恐精英战队排名模型。",
    "How is the ranking calculated?": "排名如何计算？",
    "The ranking takes into account the accomplishments of teams starting from the chosen date (in Copenhagen timezone), inclusive of that day and extending back over the previous six months.": "排名依据所选日期（哥本哈根时区）及此前六个月内的战队成绩计算，包含所选日期当天。"
  };
  var vrsLabels = {
    "Upcoming Events with VRS invite": "即将进行的 VRS 邀请赛事",
    "VRS Invites": "VRS 邀请",
    "Invite date": "邀请日期",
    "No invites yet": "暂无邀请",
    "Below is a list of upcoming events with publicly announced VRS invite dates. By clicking on an event, you'll see our prediction of the participating teams, based on the VRS standings as of the invite date and the preceding six months.": "以下是已公布 VRS 邀请日期的即将进行的赛事。点击赛事可查看参赛战队预测，预测依据为邀请日期当天及此前六个月的 VRS 排名。"
  };

  // src/adapters/valve-ranking.ts
  function navigationRules(module) {
    return [
      exact(`${module}.navigation`, module, ".nav > .navItem, .nav > .navItem > .gtSmartphone-only", rankingNavigation),
      exact(`${module}.hltv-regions`, module, "#ranking-region-selector > .sub-region-name, #ranking-region-selector > .ranking-country > a", rankingRegions)
    ];
  }
  var valveRankingRules = [
    ...navigationRules("valve-ranking"),
    exact("valve-ranking.regions", "valve-ranking", "#valve-region-selector .sub-region-valve-name, .ranked-team .teamLine > .region", valveRegions),
    exact("valve-ranking.labels", "valve-ranking", ".regional-beta-icon, .filter-column-content .vrs-ranking-button, .ranking-description, .description-box, .description-box > h1, .description-box > h2", valveLabels),
    exact("valve-ranking.old-roster", "valve-ranking", ".old-roster-symbol .tooltip-box, .tooltip-box.tooltip-attributes", valveLabels),
    exact("valve-ranking.buttons", "valve-ranking", '.ranked-team .more > a.moreLink[href^="/team/"], .ranked-team .more > a.moreLink[href^="/valve-ranking/teams/"]', rankingLabels),
    exact("valve-ranking.filters", "valve-ranking", ".sidebar-headline, .filter-column-header", rankingLabels),
    exact("valve-ranking.months", "valve-ranking", '.filter-column-content a.sidebar-single-line-item[href^="/valve-ranking/teams/"]', rankingMonths),
    exact("valve-ranking.point-brand", "valve-ranking", ".ranked-team .teamLine > .points > .gtSmartphone-only", valveLabels),
    { id: "valve-ranking.header", module: "valve-ranking", selector: ".regional-ranking-header-text", translate: (text) => {
      let m = /^Valve global ranking on (.+)$/.exec(text);
      if (m) {
        const date = dateText(m[1]);
        return date ? `V社全球排名（${date}）` : void 0;
      }
      m = /^Valve Team ranking for (.+) on (.+)$/.exec(text);
      if (m) {
        const date = dateText(m[2]);
        return date ? `V社${rankingRegions[m[1]] ?? m[1]}战队排名（${date}）` : void 0;
      }
    } },
    { id: "valve-ranking.points", module: "valve-ranking", selector: ".ranked-team .teamLine > .points", translate: (text) => {
      if (/^points\)$/i.test(text)) return "积分)";
      const m = /^(\([\d,]+\s+)(?:Valve\s+)?points\)$/i.exec(text);
      return m ? `${m[1]}${/Valve/i.test(text) ? "V社 " : ""}积分)` : void 0;
    } },
    { id: "valve-ranking.day", module: "valve-ranking", selector: '.filter-column-content a.sidebar-single-line-item[href^="/valve-ranking/teams/"]', translate: (text) => {
      const m = /^(\d{1,2})(?:st|nd|rd|th)$/i.exec(text);
      return m && +m[1] >= 1 && +m[1] <= 31 ? `${m[1]}日` : void 0;
    } }
  ];
  var vrsInviteRules = [
    ...navigationRules("vrs-invites"),
    exact("vrs-invites.labels", "vrs-invites", "h1.regional-ranking-header, .ranking-description, .ranking-vrs-event .ranking-grey", vrsLabels),
    exact("vrs-invites.regions", "vrs-invites", ".ranking-vrs-event-spots-counts .rank-count > div:not(.count)", valveRegions),
    { id: "vrs-invites.count", module: "vrs-invites", selector: ".ranking-vrs-event .ranking-grey", translate: (text) => {
      const m = /^(\d+) invites?$/i.exec(text);
      return m ? `${m[1]} 个邀请名额` : void 0;
    } },
    { id: "vrs-invites.date", module: "vrs-invites", selector: ".ranking-vrs-event-date", translate: dateText }
  ];

  // src/locales/zh-CN/teams.ts
  var teamLabels = {
    Info: "资料",
    Roster: "阵容",
    Matches: "比赛",
    Events: "赛事",
    Achievements: "成就",
    News: "新闻",
    Stats: "数据",
    "Valve ranking": "V社排名",
    "World ranking": "世界排名",
    "Weeks in top30 for core": "核心阵容在 TOP 30 的周数",
    "Average player age": "选手平均年龄",
    Coach: "教练",
    "For core": "核心",
    "For team": "队伍",
    "World ranking development for core": "核心阵容世界排名走势",
    "World ranking development for team": "战队世界排名走势",
    "Current ranking": "当前排名",
    Peak: "最高排名",
    "Time at peak": "最高排名持续时间",
    FAQ: "常见问题",
    "All Stickers": "全部贴纸",
    Player: "选手",
    Players: "队员",
    Status: "状态",
    Time: "时间",
    "on team": "在队",
    Maps: "地图",
    coached: "执教",
    played: "出场",
    Trophies: "奖杯",
    Winrate: "胜率",
    "Stats from entire coach period": "执教期间全队数据",
    "Stats from entire team period *": "统计包含该阵容时期的全队数据 *",
    STARTER: "首发",
    BENCHED: "替补",
    "Highest Rank": "最高排名",
    "Maps played": "出场地图数",
    "Days in team": "在队天数",
    "Current win streak": "当前连胜",
    "Win rate": "胜率",
    "Last 3 months": "最近 3 个月",
    Date: "日期",
    Match: "比赛",
    "Ongoing & Upcoming": "进行中及即将开始",
    Ended: "已结束",
    LAN: "线下赛",
    Placement: "名次",
    Tournament: "赛事",
    Challengers: "挑战者组",
    "1/4 final": "八强",
    "1/2 final": "四强",
    "1/8 final": "十六强",
    Won: "获胜",
    Lost: "失利",
    "Map win statistics past 3 months": "最近 3 个月地图胜率数据",
    "Biggest win on map": "该图最大比分胜利",
    "Biggest loss on map": "该图最大比分失利",
    "Veto data": "选禁图数据",
    "% of opportunities to pick / ban": "选择 / 禁用机会中的占比",
    Picks: "选择",
    Bans: "禁用",
    "Win / draw / losses": "胜 / 平 / 负",
    Win: "胜",
    Draws: "平",
    Losses: "负",
    "General stats": "基础数据",
    "Round win% after getting first kill": "取得首杀后的回合胜率",
    "Round win% after getting first death": "被首杀后的回合胜率",
    "Pistolround win%": "手枪局胜率",
    "Expand all": "展开全部",
    "Collapse all": "收起全部",
    Core: "核心",
    Team: "队伍",
    "Roster timeline": "阵容时间线",
    Transfers: "转会",
    "Last year": "最近一年",
    "All time": "全部时间",
    "* Will only show stats for a player's current team period.  A player leaving and later rejoining the team will not have their previous period(s) counted.": "仅显示选手本次在队期间的数据。离队后重新加入的选手，此前的效力阶段不计入。"
  };
  var teamTransferLabels = {
    "is benched on": "转为替补于",
    "is moved to the active roster on": "进入首发阵容于",
    joins: "加入",
    "as coach": "担任教练",
    "parts ways with": "离开",
    "(benched)": "（替补）",
    "No team": "暂无战队"
  };

  // src/adapters/teams.ts
  var headings = [
    [/^Team photos of (.+)$/, (n) => `${n} 的战队照片`],
    [/^All photos of players for (.+)$/, (n) => `${n} 队员的全部照片`],
    [/^Coach of (.+)$/, (n) => `${n} 的教练`],
    [/^Players of (.+)$/, (n) => `${n} 的队员`],
    [/^Roster timeline of (.+)$/, (n) => `${n} 的阵容时间线`],
    [/^Transfers for (.+)$/, (n) => `${n} 的转会记录`],
    [/^Match stats for (.+)$/, (n) => `${n} 的比赛数据`],
    [/^Upcoming matches for (.+)$/, (n) => `${n} 的近期赛程`],
    [/^Recent results for (.+)$/, (n) => `${n} 的近期赛果`],
    [/^See all results for (.+)$/, (n) => `查看 ${n} 的全部赛果`],
    [/^Ongoing & upcoming events and leagues for (.+)$/, (n) => `${n} 进行中及即将参加的赛事与联赛`],
    [/^Played events and leagues for (.+)$/, (n) => `${n} 已参加的赛事与联赛`],
    [/^All events attended by (.+)$/, (n) => `${n} 参加的全部赛事`],
    [/^Breakdown of (.+)'s Major achievements$/, (n) => `${n} 的 Major 成就明细`],
    [/^Breakdown of (.+)'s LAN achievements$/, (n) => `${n} 的线下赛成就明细`],
    [/^News posts mentioning (.+)$/, (n) => `提及 ${n} 的新闻`],
    [/^All stats for (.+)$/, (n) => `${n} 的全部数据`]
  ];
  function teamText(text, settings) {
    for (const [pattern, render] of headings) {
      const m2 = pattern.exec(text);
      if (m2) return render(m2[1]);
    }
    let m = /^Stickers:\s*(.+)$/.exec(text);
    if (m) return `贴纸：${m[1]}`;
    m = /^(?:of|for) (.+)$/.exec(text);
    if (m) return `（${m[1]}）`;
    m = /^(.+)'s last (\d+) matches$/.exec(text);
    if (m) return `${m[1]} 最近 ${m[2]} 场比赛`;
    m = /^News posts from (\d{4})$/.exec(text);
    if (m) return `${m[1]} 年的新闻`;
    m = /^(\d+) (weeks?|months?|years?|days?)$/.exec(text);
    if (m) return `${m[1]} ${{ week: "周", month: "个月", year: "年", day: "天" }[m[2].replace(/s$/, "")]}`;
    m = /^(\d+)(?:[-–](\d+))?(?:st|nd|rd|th)$/.exec(text);
    if (m) return `第 ${m[1]}${m[2] ? "–" + m[2] : ""} 名`;
    m = /^Stats history on (.+)$/.exec(text);
    if (m) return `${mapName(m[1], settings) ?? m[1]} 的数据记录`;
    m = /^(\d+(?:\.\d+)?%) of ([\d,]+)$/.exec(text);
    if (m) return `${m[2]} 次机会中的 ${m[1]}`;
    m = /^Who plays for (.+)\?$/.exec(text);
    if (m) return `谁效力于 ${m[1]}？`;
    m = /^What is (.+)'s current world rank\?$/.exec(text);
    if (m) return `${m[1]} 当前的世界排名是多少？`;
    m = /^Upcoming matches for (.+)\?$/.exec(text);
    if (m) return `${m[1]} 接下来有哪些比赛？`;
    m = /^The main lineup of (.+) is$/.exec(text);
    if (m) return `${m[1]} 的主力阵容是`;
    m = /^(.+) is currently$/.exec(text);
    if (m) return `${m[1]} 当前`;
    if (text === "in our world ranking") return "在我们的世界排名中";
    m = /^ranked #(\d+)$/.exec(text);
    if (m) return `排名第 ${m[1]} 名`;
    m = /^The next matches for (.+) will be against:$/.exec(text);
    if (m) return `${m[1]} 接下来将对阵：`;
    if (text === "vs." || text === "vs") return "对阵";
  }
  var slots2 = ".teamProfile .tab, .teamProfile .profile-team-stat > b, .teamProfile .regional-name-full, .teamProfile .core-chart, .teamProfile .team-chart, .teamProfile .standard-headline, .teamProfile .standard-headline > h2, .teamProfile .standard-headline > .gtSmartphone-only, .teamProfile .ranking-info .sub-title, .teamProfile th, .teamProfile th > span, .teamProfile .sub-headline, .teamProfile .player-status, .teamProfile .stat-name, .teamProfile .description, .teamProfile .stat-timespan, .teamProfile .sub-navigation-link, .teamProfile .moreButton, .teamProfile .matchpage-button, .teamProfile .stats-button, .teamProfile .achievement, .teamProfile .highlighted-match-status, .teamProfile .map-statistics-extended-sub-header, .teamProfile .map-statistics-extended-highlight-veto-container, .teamProfile .map-statistics-extended-highlight-veto > div, .teamProfile .map-statistics-extended-general-stat > div, .teamProfile .show-all-stickers-button, .teamProfile .toggle, .teamProfile .transfers-tabs > div, .teamProfile .disclaimer";
  var teamRules = [
    exact("team.labels", "team", slots2, teamLabels),
    { id: "team.templates", module: "team", selector: slots2, translate: teamText },
    { id: "team.duration", module: "team", selector: ".teamProfile .ranking-info .value, .teamProfile .players-cell.center-cell.opacity-cell", translate: teamText },
    exact("team.transfer", "team", ".teamProfile .transfer-movement, .teamProfile .transfer-team-no-team", teamTransferLabels),
    { id: "team.dates", module: "team", selector: ".teamProfile .transfer-date, .teamProfile .date-cell, .teamProfile .faq-answer [data-time-format]", translate: dateText },
    { id: "team.faq", module: "team", selector: '.teamProfile .faq-question, .teamProfile .faq-answer span, .teamProfile .faq-answer a[href^="/ranking/teams/"]', translate: teamText },
    exact("team.regions", "team", ".teamProfile .regional-rank-region", valveRegions),
    { id: "team.nested-heading", module: "team", selector: ".teamProfile .standard-headline > h2 > .gtSmartphone-only", translate: teamText },
    { id: "team.timeline-month", module: "team", selector: ".teamProfile .timeline-month-label > span", translate: (text) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const index = months.findIndex((m) => m.toLowerCase() === text.toLowerCase());
      return index >= 0 ? `${index + 1}月` : void 0;
    } },
    { id: "team.rank-tooltip", module: "team", selector: ".teamProfile .regional-rank[title]", target: "title", translate: (text) => {
      const m = /^#(\d+) in (.+) on the (Valve|HLTV) ranking$/.exec(text);
      return m ? `${rankingRegions[m[2]] ?? m[2]}${m[3] === "Valve" ? "V社" : "HLTV"}排名第 ${m[1]} 名` : void 0;
    } }
  ];

  // src/locales/zh-CN/ranking-details.ts
  var hltvDetailLabels = {
    "Matches included in Form subranking": "计入状态分项排名的比赛",
    "Events included in Recent LANs subranking": "计入最近线下赛分项排名的赛事",
    Event: "赛事",
    Lineup: "阵容",
    Relevance: "相关度",
    Match: "比赛",
    Type: "类型",
    Result: "赛果",
    LAN: "线下赛",
    Online: "线上赛",
    "vs.": "对阵"
  };
  var valveDetailLabels = {
    "LAN wins": "线下胜场",
    "Opponent network": "对手网络",
    "Opp. network": "对手网络",
    "Bounty offered": "提供悬赏",
    "Bounty collected": "收获悬赏",
    "Head to head": "历史交锋",
    H2H: "交锋",
    p: "分",
    "Most recent LAN wins": "最近的线下胜场",
    "LAN wins explanation": "线下胜场计算说明",
    "Opponent network, 10 best wins": "对手网络：价值最高的 10 场胜利",
    "Opponent network explanation": "对手网络计算说明",
    "Bounty offered, 10 best prize winnings": "提供悬赏：奖金最高的 10 次获奖",
    "Bounty offered explanation": "提供悬赏计算说明",
    "Bounty collected, 10 best wins": "收获悬赏：价值最高的 10 场胜利",
    "Bounty collected explanation": "收获悬赏计算说明",
    "Head to head matches": "交锋比赛",
    "Head to head explanation": "历史交锋计算说明",
    Date: "日期",
    Opponent: "对手",
    Event: "赛事",
    Recency: "时效权重",
    "Pts.": "积分",
    "Event value": "赛事价值",
    "Prize won": "获得奖金",
    "Opp. Bounty": "对手悬赏",
    "W/L": "胜/负",
    W: "胜",
    L: "负",
    "Recency:": "时效权重：",
    "Opponent network:": "对手网络：",
    "Event value:": "赛事价值：",
    "Prize won:": "获得奖金：",
    "Opponent bounty:": "对手悬赏：",
    "The two teams' ranking:": "双方排名：",
    "All teams get an additional 400 starting points.": "所有战队额外获得 400 点初始积分。"
  };
  var valveDetailExplanations = {
    'The "LAN win" component of the VRS finds the 10 most recent LAN wins. There is only one factor involved:': "VRS 的“线下胜场”分项取最近 10 场线下胜利，仅考虑一个因素：",
    "A win counts for 100% if it is within the last month. From there and 5 months back a match will lose its value down to zero.": "最近一个月内的胜利按 100% 计入；再往前的五个月内，比赛权重逐步衰减至零。",
    'The "opponent network" component of the VRS finds the 10 best wins by 3 different factors:': "VRS 的“对手网络”分项按三个因素选取价值最高的 10 场胜利：",
    "The value of a win depends on the opponents' network. The opponent network represent how many different teams a team has won against recently. The factor is a value between zero and one, where 1 means the team is amongst the most valuable teams to beat.": "胜利价值取决于对手网络，即对手近期击败过多少支不同的战队。该系数介于 0 和 1 之间，1 表示击败该对手的价值处于最高的一档。",
    "A win will be worth more if it is won in a valuable event, in regards to prize pool.": "按奖金池衡量，在价值更高的赛事中获胜，胜利价值也更高。",
    'The "Bounty offered" component of the VRS finds the 10 best prize money wins and factor in the recency.': "VRS 的“提供悬赏”分项取奖金最高的 10 次获奖，并考虑时效权重。",
    "Prize money counts for 100% if it is within the last month. From there and 5 months back the prize money will lose its value down to zero.": "最近一个月内获得的奖金按 100% 计入；再往前的五个月内，奖金权重逐步衰减至零。",
    "The more money you win, the better": "获得的奖金越多，该项表现越好。",
    'The "Bounty collected" component of the VRS finds the 10 best wins by 3 different factors:': "VRS 的“收获悬赏”分项按三个因素选取价值最高的 10 场胜利：",
    "The value of a win depends on the opponents' bounty. The opponent bounty represent how much money they have won recently. The factor is a value between zero and one, where 1 means the team is amongst the most valuable teams to beat.": "胜利价值取决于对手的悬赏，即对手近期获得的奖金。该系数介于 0 和 1 之间，1 表示击败该对手的价值处于最高的一档。",
    "A win counts 100% if it is within the last month. From there and 5 month back a match will lose its value down to zero.": "最近一个月内的胜利按 100% 计入；再往前的五个月内，比赛权重逐步衰减至零。",
    'The "Head to head" component of the VRS is a bit different from the other 4 components. First the other 4 components are calculated and all teams get a ranking starting point. Then the head to head calculation will go through all matches from oldest to newest. It will move points from the loser to the winner. The amount of points will be based on:': "VRS 的“历史交锋”分项与其他四项略有不同。先计算其他四项，为所有战队确定初始排名分数；再按时间从早到晚处理比赛，将积分从败者转移给胜者。转移量依据：",
    "If a team with a low ranking beat a team with a high ranking, they will earn many points. And on the other hand: if a team with a high ranking beat a team with a low ranking they will only gain little points.": "排名较低的战队击败排名较高的战队，会获得较多积分；反之，排名较高的战队击败排名较低的战队，只获得较少积分。",
    "The longer time since the match was player the fewer points will be moved.": "比赛距今越久，转移的积分越少。",
    'Note that the "Head to head" component is recalculated every time the ranking is calculated. This means that if you have beaten an opponent for 3 months ago, and they since then have improved their ranking - your wins will be worth more.': "每次计算排名时，“历史交锋”都会重新计算。因此，如果三个月前击败的对手此后排名提高，这场胜利的价值也会提高。"
  };

  // src/adapters/ranking-details.ts
  var hltvRankingDetailRules = [
    ...rankingRules.filter((r) => ["ranking.filters", "ranking.months", "ranking.day"].includes(r.id)).map((r) => ({ ...r, id: `ranking-detail.${r.id}`, module: "ranking-detail" })),
    exact("ranking-detail.labels", "ranking-detail", ".ranking-details .standard-headline, .ranking-details .standard-headline > span, .ranking-details .stats-table th, .ranking-details .stats-table td.statsCenterText", hltvDetailLabels),
    { id: "ranking-detail.heading", module: "ranking-detail", selector: ".ranking-details > .standard-headline", translate: (text) => {
      const m = /^Detailed breakdown of ranking calculations for (.+)$/.exec(text);
      return m ? `${m[1]} 的 HLTV 排名计算明细` : void 0;
    } },
    { id: "ranking-detail.placement", module: "ranking-detail", selector: ".ranking-details .stats-table tbody td:first-child", translate: (text) => {
      if (text === "vs.") return "对阵";
      const m = /^(\d+)(?:[-–](\d+))?(?:st|nd|rd|th)$/.exec(text);
      return m ? `第${m[1]}${m[2] ? "–" + m[2] : ""}名` : void 0;
    } }
  ];
  var valveRankingDetailRules = [
    ...valveRankingRules.filter((r) => ["valve-ranking.regions", "valve-ranking.point-brand", "valve-ranking.points"].includes(r.id)).map((r) => ({ ...r, id: `valve-ranking-detail.${r.id}`, module: "valve-ranking-detail" })),
    exact("valve-ranking-detail.labels", "valve-ranking-detail", [
      ".valve-ranking-details .standard-headline",
      ".valve-ranking-details .detail-head",
      ".valve-ranking-details .detail-head > span",
      ".valve-ranking-details .detail-points-text",
      ".valve-ranking-details th",
      ".valve-ranking-details td.win",
      ".valve-ranking-details td.loss",
      ".valve-ranking-details .detail-explain b",
      ".valve-ranking-details .tooltip-box"
    ].join(","), valveDetailLabels),
    exact("valve-ranking-detail.explanations", "valve-ranking-detail", ".valve-ranking-details .detail-explain, .valve-ranking-details .detail-explain li", valveDetailExplanations),
    { id: "valve-ranking-detail.heading", module: "valve-ranking-detail", selector: ".valve-ranking-details > .standard-headline", translate: (text) => {
      const m = /^Ranking\s+details for (.+) on (.+)$/.exec(text);
      if (m) {
        const date = dateText(m[2]);
        return date ? `${m[1]} 的V社排名详情（${date}）` : void 0;
      }
    } },
    { id: "valve-ranking-detail.event-weight", module: "valve-ranking-detail", selector: ".valve-ranking-details .tooltip-box, .tooltip-box.context-tooltip", translate: (text) => {
      const m = /^Event weight:\s*(\d+(?:\.\d+)?)$/.exec(text);
      return m ? `赛事权重：${m[1]}` : void 0;
    } },
    { id: "valve-ranking-detail.cap-note", module: "valve-ranking-detail", selector: ".valve-ranking-details .details-matches", translate: (text) => {
      const m = /^\* Points does not sum up as (.+) has max points for bounty offered, and points are set to 5th best bounty offered score$/.exec(text);
      return m ? `* ${m[1]} 的提供悬赏分项已达到积分上限，因此积分不直接相加，而是按该分项第五高的得分确定。` : void 0;
    } }
  ];

  // src/adapters/index.ts
  var rules = [
    ...homeSidebarRules,
    ...playerRules,
    ...eventDetailRules,
    ...playerCompareRules,
    ...mapRules,
    ...statisticsRules,
    ...matchDetailRules,
    ...recommendedMatchRules,
    ...rankingRules,
    ...valveRankingRules,
    ...vrsInviteRules,
    ...teamRules,
    ...hltvRankingDetailRules,
    ...valveRankingDetailRules,
    exact("common.navigation", "common", ".nav-link, .event-hub-link, .dropdown-link > .text-ellipsis", navigation),
    exact("common.controls", "common", ".navsignin, .login-button, .remember-me label, .forgot-link, .nav-popup-elm > span, .nav-popup-elm .labelled-checkbox label", controls),
    exact("common.settings-options", "common", ".nav-popup-elm .slider > span", { Day: "日间", Night: "夜间", Auto: "自动", Yes: "是", No: "否" }),
    exact("common.settings-titles", "common", ".nav-popup-elm > span[title]", {
      "Choose a website theme.": "选择网站主题。",
      "Show/hide results in results section & on match pages.": "显示或隐藏赛果区与比赛页面的赛果。",
      "Choose timezone to adjust site-wide time displays.": "选择时区以调整全站时间显示。"
    }, "title"),
    exact("common.placeholders", "common", "input[placeholder]", placeholders, "placeholder"),
    exact("common.sidebar", "common", ".standard-headline, .sidebar-headline, h1 > a, h1, .stream-box .title", {
      "TODAY'S MATCHES": "今日比赛",
      RESULTS: "赛果",
      "RECENT ACTIVITY": "最新动态",
      "TOP 30 TRANSFERS": "TOP 30 转会",
      RANKING: "排名",
      EVENTS: "赛事",
      GALLERIES: "图集",
      "TOP STREAMS": "热门直播",
      "Now playing": "正在播放"
    }),
    exact("home.headings", "home", ".newsheader", { "Today's news": "今日新闻", "Yesterday's news": "昨日新闻", "Previous news": "此前新闻" }),
    { id: "home.relative", module: "home", selector: ".newsrecent", translate: relativeTime },
    { id: "home.comments", module: "home", selector: ".newstc > div", translate: (text) => {
      const m = /^(\d+) comments?$/i.exec(text);
      return m ? `${m[1]} 条评论` : void 0;
    } },
    exact("home.more", "home", 'a.button-more[href^="/news/archive"], a[href="/transfers"]', { "More news": "更多新闻", "All transfers": "全部转会" }),
    exact("common.streams", "common", ".streams-header, .streams-filter > span:not(.streams-filter-viewers)", {
      "Now playing": "正在播放",
      "Top streams": "热门直播",
      All: "全部",
      Casters: "解说",
      Streamers: "主播",
      Organizers: "主办方"
    }),
    exact("matches.labels", "matches", ".upcoming-headline, .matches-sidebar-filter-wrapper h3, #clear-all, .matches-sidebar-filter-title, .matches-sidebar-filter-clear-all, .matches-filter-name-text, .matches-filter-close-btn, .matches-quick-filters > *, .match-time, .match-meta, .starred-matches-title, .match-stage", labels),
    exact("matches.sort", "matches", ".matches-sort-by-toggle, .matches-sort-by > span, .matches-sort-by-container > span", labels),
    exact("matches.calendar", "matches", '.calendar-month, .calendar-day, [data-time-format="EEE"]', {
      January: "一月",
      February: "二月",
      March: "三月",
      April: "四月",
      May: "五月",
      June: "六月",
      July: "七月",
      August: "八月",
      September: "九月",
      October: "十月",
      November: "十一月",
      December: "十二月",
      Mon: "周一",
      Tue: "周二",
      Wed: "周三",
      Thu: "周四",
      Fri: "周五",
      Sat: "周六",
      Sun: "周日"
    }),
    exact("matches.why", "matches", ".starred-matches-description > [data-tooltip-id], .starred-matches-description > [data-tooltip-id] > span", {
      "Why am I seeing": "为什么显示",
      "these matches?": "这些比赛？",
      "this?": "这些内容？"
    }),
    { id: "matches.region", module: "matches", selector: ".matches-filter-name-text", translate: (text) => {
      const m = /^(Europe|Asia|Americas|Oceania|Africa)\s*\((\d+)\)$/i.exec(text);
      const regions = { europe: "欧洲", asia: "亚洲", americas: "美洲", oceania: "大洋洲", africa: "非洲" };
      return m ? `${regions[m[1].toLowerCase()]} (${m[2]})` : void 0;
    } },
    { id: "matches.date", module: "matches", selector: '[data-time-format="MMM d"], [data-time-format="MMMM y"], .match-day', translate: dateText },
    exact("results.labels", "results", ".standard-headline, .sidebar-headline, .filter-column-header, .filter-column-content .sidebar-single-line-item", filters),
    { id: "results.date", module: "results", selector: ".standard-headline", translate: dateText },
    { id: "results.pagination", module: "results", selector: ".pagination-data", translate: (text) => {
      const m = /^(\d+)\s*-\s*(\d+) of ([\d,]+)$/.exec(text);
      return m ? `第 ${m[1]}–${m[2]} 条，共 ${m[3]} 条` : void 0;
    } },
    exact("detail.labels", "match-detail", ".standard-headline, .headline, .timeAndEvent .countdown, .mapholder .results .results-center, .mapholder .results .results-left .pick, .mapholder .results .results-right .pick, .no-streams, .match-info-box .small-text, .veto-box .padding", labels),
    exact("detail.lineup-comparison", "match-detail", [
      "#lineups .lineups-compare-container th.table-header",
      "#lineups .lineups-compare-container th.table-subheader",
      "#lineups .lineups-compare-middle-table-center-stat",
      "#lineups .lineups-compare-middle-table-center-stat > .gtSmartphone-only",
      '#lineups .lineups-compare-player-link.profile-link[href^="/player/"]',
      '#lineups .lineups-compare-player-link.profile-link[href^="/player/"] > span',
      '#lineups .lineups-compare-player-link.stats-link[href^="/stats/players/"]',
      '#lineups .compare-link[href^="/stats/players/compare/"]'
    ].join(","), lineupComparison),
    { id: "detail.date", module: "match-detail", selector: ".timeAndEvent .date", translate: dateText },
    { id: "detail.countdown", module: "match-detail", selector: ".timeAndEvent .countdown", translate: (text) => {
      if (!/^(?:\d+[dhms]\s*(?::\s*)?)+$/i.test(text)) return;
      const units = { d: "天", h: "时", m: "分", s: "秒" };
      return text.replace(/(\d+)([dhms])/gi, (_, count, unit) => count + units[unit.toLowerCase()]);
    } },
    { id: "detail.veto", module: "match-detail", selector: ".veto-box .padding > div", translate: (text, settings) => {
      const m = /^(\d+)\. (.+) (removed|picked) ([A-Za-z0-9 ]+)$/.exec(text);
      if (m && maps[m[4].toLowerCase()]) return `${m[1]}. ${m[2]} ${m[3] === "removed" ? "禁用" : "选择"} ${mapName(m[4], settings) ?? m[4]}`;
      const left = /^(\d+)\. ([A-Za-z0-9 ]+) was left over$/.exec(text);
      if (left && maps[left[2].toLowerCase()]) return `${left[1]}. ${mapName(left[2], settings) ?? left[2]} 剩余`;
    } },
    { id: "detail.format", module: "match-detail", selector: ".veto-box .preformatted-text", translate: (text) => {
      let changed = false;
      const result = text.split("\n").map((line) => {
        const ws = /^(\s*)(.*?)(\s*)$/.exec(line);
        const m = /^Best of (1|3|5) \((Online|LAN)\)$/.exec(ws[2]);
        const key = ws[2].replace(/^\*\s*/, "");
        const translated = m ? `BO${m[1]}（${m[2] === "Online" ? "线上赛" : "线下赛"}）` : labels[key];
        if (translated) {
          changed = true;
          return ws[1] + (ws[2].startsWith("*") ? "* " : "") + translated + ws[3];
        }
        return line;
      }).join("\n");
      return changed ? result : void 0;
    } },
    exact("events.labels", "events", ".event-status-headline, .event-status-upcoming-headline, .lan-marker", { "Ongoing events": "进行中的赛事", "Upcoming events": "即将开始的赛事", LAN: "线下赛" }),
    { id: "events.date", module: "events", selector: '.standard-headline, [data-time-format="MMM do"]', translate: dateText }
  ];

  // src/core/types.ts
  function detectPage(path) {
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
    return element.closest(protectedSelector) !== null;
  }
  function protectedMapElement(element) {
    if (element.closest(".team-name")) return true;
    const link = element.closest("a[href]");
    return !!link && /^\/(?:team\/\d+(?:\/|$)|stats\/(?:players|teams)\/\d+(?:\/|$)|skins\/)/.test(link.getAttribute("href") ?? "");
  }

  // src/core/engine.ts
  var TranslationEngine = class {
    constructor(rules2, page, settings, retry) {
      this.rules = rules2;
      this.page = page;
      this.settings = settings;
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
    configure(settings) {
      this.settings = settings;
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
    process(node) {
      this.metrics.visited++;
      if (!node.isConnected) return;
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
            const option = text.parentElement;
            const injected = this.implicitOptionValues.get(option);
            if (injected !== void 0 && option.getAttribute("value") === injected) {
              option.removeAttribute("value");
              this.implicitOptionValues.delete(option);
            }
            if (result && !option.hasAttribute("value")) {
              const originalValue = source.replace(/\s+/g, " ").trim();
              option.setAttribute("value", originalValue);
              this.implicitOptionValues.set(option, originalValue);
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
            continue;
          }
          const state = saved.get(target);
          const source = state && current === state.rendered ? state.source : current;
          const result = this.resolve(source, element, target);
          const value = result?.value ?? source;
          if (current !== value) {
            if (result && !this.permitWrite(element, target)) continue;
            element.setAttribute(target, value);
            this.metrics.writes++;
          }
          if (result && value !== source) saved.set(target, { source, rendered: value, ruleId: result.ruleId });
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
  function playerStyle(doc, page, settings) {
    const id = "hltv-zh-player-style";
    const active = settings.enabled && (page === "player" && settings.modules.player || page === "team" && settings.modules.team);
    let style = doc.getElementById(id);
    if (!active) {
      style?.remove();
      return;
    }
    if (style) return;
    style = doc.createElement("style");
    style.id = id;
    style.setAttribute("data-hltv-zh-owned", "");
    style.textContent = page === "team" ? '.teamProfile .fanbutton.addFan::after { content: "关注战队" !important; } .teamProfile .fanbutton.removeFan::after { content: "取消关注" !important; }' : '.playerProfile .fanbutton.addFan::after { content: "关注选手" !important; }';
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
  var protectedClasses = /* @__PURE__ */ new Set(["newstext", "thread-message-text", "playerNickname", "teamName"]);
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
  function start(doc, rules2, settings) {
    const page = detectPage(doc.location.pathname);
    const retries = new RetryQueue((node) => scheduler.enqueue(node, false));
    const engine = new TranslationEngine(rules2, page, settings, (node, due) => retries.add(node, due));
    playerStyle(doc, page, settings);
    const scheduler = new Scheduler((node) => engine.process(node));
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "childList") {
          for (const node of record.addedNodes) scheduler.enqueue(node);
        } else if (record.type === "attributes" && record.attributeName === "class") {
          const root = classChangeRoot(record.target, record.oldValue, page);
          if (root) scheduler.enqueue(root);
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
      attributeFilter: ["title", "placeholder", "aria-label", "alt", "class"]
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
  var SETTINGS_KEY = "hltv2zh-cn.settings.v1";
  var moduleNames = {
    common: "公共导航",
    home: "首页",
    matches: "比赛列表",
    "match-detail": "比赛详情",
    results: "赛果",
    events: "赛事列表",
    player: "选手资料",
    "player-stats": "选手数据",
    "event-detail": "赛事详情",
    "player-compare": "选手对比",
    statistics: "统计数据",
    ranking: "队伍排名",
    "valve-ranking": "V社排名",
    "vrs-invites": "VRS 邀请",
    maps: "地图名称（全站）",
    team: "战队资料",
    "ranking-detail": "HLTV 排名详情",
    "valve-ranking-detail": "V社排名详情"
  };
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
      "valve-ranking-detail": true
    } };
  }
  function parseSettings(value) {
    const result = defaults();
    if (!value || typeof value !== "object" || !("schemaVersion" in value) || value.schemaVersion !== 1 && value.schemaVersion !== 2) return result;
    const data = value;
    if (typeof data.enabled === "boolean") result.enabled = data.enabled;
    if (value.schemaVersion === 2 && (data.maps === "en" || data.maps === "zh-CN")) result.maps = data.maps;
    if (data.modules && typeof data.modules === "object") {
      for (const key of Object.keys(result.modules)) {
        if (typeof data.modules[key] === "boolean") result.modules[key] = data.modules[key];
      }
    }
    return result;
  }

  // src/features/menu.ts
  function registerMenu(settings, register, save, reload) {
    const commit = (next) => {
      save(next);
      reload();
    };
    register(`${settings.enabled ? "停用" : "启用"}汉化（刷新页面）`, () => commit({ ...settings, enabled: !settings.enabled }));
    register(`地图名称：${settings.maps === "en" ? "英文" : "中文"}（点击切换并刷新）`, () => commit({ ...settings, maps: settings.maps === "en" ? "zh-CN" : "en" }));
    for (const key of Object.keys(moduleNames)) {
      register(`${settings.modules[key] ? "✓" : "○"} ${moduleNames[key]}（切换并刷新）`, () => commit({ ...settings, modules: { ...settings.modules, [key]: !settings.modules[key] } }));
    }
    register("恢复默认设置（刷新页面）", () => commit(defaults()));
  }

  // src/main.ts
  function boot() {
    if (window.top !== window.self || /^\/betting(?:\/|$)/.test(location.pathname)) return;
    let stored;
    try {
      stored = typeof GM_getValue === "function" ? GM_getValue(SETTINGS_KEY) : void 0;
    } catch {
      console.warn("[HLTV 简体中文] 无法读取配置，使用默认设置。");
    }
    const settings = parseSettings(stored);
    if (typeof GM_registerMenuCommand === "function") {
      registerMenu(settings, GM_registerMenuCommand, (next) => {
        if (typeof GM_setValue !== "function") throw new Error("油猴配置 API 不可用");
        GM_setValue(SETTINGS_KEY, next);
      }, () => location.reload());
    }
    if (!settings.enabled || !document.querySelector(".nav-link")) return;
    const runtime = start(document, rules, settings);
    if (typeof GM_registerMenuCommand === "function") {
      GM_registerMenuCommand("查看汉化诊断（不含页面正文）", () => {
        const { visited, writes, errors, throttled } = runtime.engine.metrics;
        const { batches, maxBatchMs, maxPending } = runtime.scheduler.metrics;
        alert([
          `已检查节点：${visited}，已改写字段：${writes}`,
          `处理批次：${batches}，最长批次：${maxBatchMs.toFixed(2)}ms`,
          `最大待处理任务：${maxPending}，限流次数：${throttled}`,
          `限流待重试：${runtime.retries.size}，已重试：${runtime.retries.metrics.retried}，超限丢弃：${runtime.retries.metrics.overflow}`,
          `规则异常：${errors}，规则 ID：${runtime.engine.errors.join(", ") || "无"}`
        ].join("\n"));
      });
    }
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) runtime.stop();
    });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) runtime.refresh();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
