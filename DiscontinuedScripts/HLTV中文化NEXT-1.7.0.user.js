// ==UserScript==
// @name         HLTV中文化NEXT
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @license      MIT
// @description  HLTV页面中文翻译 - 重构版 (数据驱动 + 共享映射 + 统一管线)
// @author       YHFZ
// @match        https://www.hltv.org/*
// @grant        none
// @icon         https://www.hltv.org/img/static/favicon/favicon-16x16.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/577605/HLTV%E4%B8%AD%E6%96%87%E5%8C%96NEXT.user.js
// @updateURL https://update.greasyfork.org/scripts/577605/HLTV%E4%B8%AD%E6%96%87%E5%8C%96NEXT.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.location.pathname.startsWith('/betting')) return;

    // =========================================================================
    // 1. 词典 — 静态短语映射
    // =========================================================================
    const dictionary = {
        // ── 主导航 ──
        "NEWS": "新闻", "OVERVIEW": "概览", "MATCHES": "比赛", "RESULTS": "赛果",
        "RANKING": "排名", "EVENTS": "赛事", "PLAYERS": "选手", "STATS": "数据",
        "FORUM": "论坛", "MEDIA": "媒体", "EVENT DATA": "赛事数据",
        "RELATED EVENTS": "相关赛事", "LIVE": "直播", "MAJOR": "Major",
        "TIMELINE GAME": "时间线游戏", "SKINS": "皮肤", "AWARD BY": "颁奖给",
        "RANKING BY": "排名依据", "COMPLETE RANKING": "完整排名",
        "ONGOING & UPCOMING": "进行中及即将进行", "LAST UPDATED:": "最后更新：",
        "MULTI-KILL RATING": "多杀RATING", "FULL COMPARISON": "全面对比",
        "EVENT CALENDAR": "赛事日历", "RECENT ACTIVITY": "最新动态",
        "TOP 30 TRANSFERS": "TOP 30 转会信息", "ONLINE": "在线",
        "ALL TRANSFERS": "全部转会", "PRIZE": "奖赏", "OTHER": "其他",
        "PLAYER SHARE": "选手分成", "CLUB SHARE": "俱乐部分成",
        // ── Events 下拉 ──
        "ALL EVENTS": "所有赛事", "ONGOING": "进行中", "ARCHIVE": "赛事存档",
        "CALENDAR": "赛事日历", "REQUIRE ALL PLAYERS": "请求全部选手",
        "REQUIRE ALL TEAMS": "请求全部战队", "VRS INVITES": "VRS 邀请情况",
        // ── Players 下拉 ──
        "RETIRED PLAYERS": "退役选手", "TRANSFERS": "转会信息",
        "HALL OF FAME": "名人堂",
        // ── Stats 下拉 ──
        "STATS OVERVIEW": "统计总览", "TOP PLAYERS": "顶尖选手",
        "TOP TEAMS": "顶尖队伍", "MAPS": "地图",
        // ── Fantasy 下拉 ──
        "FANTASY OVERVIEW": "Fantasy 总览",
        // ── Forum 下拉 ──
        "COUNTER-STRIKE": "反恐精英", "HARDWARE & TWEAKS": "硬件与优化",
        "BUGS & SUGGESTIONS": "Bug 反馈与建议",
        // ── Media 下拉 ──
        "HLTV CONFIRMED": "HLTV 官方访谈", "GALLERIES": "赛事图集",
        "ANALYTICS": "数据分析",
        // ── 登录/注册 ──
        "REMEMBER ME": "记住我", "FORGOT PASSWORD": "忘记密码",
        "LOGIN": "登录", "SIGN UP": "注册", "SIGN IN": "登录",
        "HLTV TEAM PROFILE": "HLTV 战队档案", "RANKING DETAILS": "排名详情",
        "USERNAME": "用户名", "PASSWORD": "密码",
        "USERNAME OR EMAIL": "用户名或邮箱", "RECOVER": "恢复", "BACK": "返回",
        "PLAYER OF THE WEEK": "本周最佳选手",
        "OPENING DUELS WON": "首次交锋胜率",
        "AWP KILLS / ROUND": "场均 AWP 击杀", "GROUPED EVENTS": "分组赛事",
        "FINISHED": "已结束", "CLUTCHES": "残局获胜",
        "MOST DAMAGE / ROUND": "场均最高伤害", "INVITE DATE": "邀请日期",
        "PRESS PLAY ON THE MEDIA PLAYER TO FIND OUT": "点击播放器上的播放按钮了解详情",
        "BROWSE CS2 SKINS": "浏览CS2皮肤", "SHOW LOADOUT": "显示装备",
        // ── 设置 ──
        "SETTINGS": "设置", "THEME": "主题", "SHOW RESULTS": "显示比赛赛果",
        "AUTOMATIC TIMEZONE": "自动检测时区", "TIMEZONE": "时区",
        "FORCE DESKTOP MODE": "强制桌面模式",
        "MATCH FILTER SETTINGS": "赛事筛选设置", "EXPAND": "展开",
        "ENABLE FILTER": "启用筛选", "RESET FILTER": "重置筛选",
        "MATCH TYPE": "比赛类型", "STAR FILTER": "星级筛选", "CLEAR": "清除",
        "MIN. STARS": "最低星级", "EVENT TYPE": "赛事类型", "LAN": "线下赛",
        "LIVE MATCH": "正在进行的比赛", "SORT BY:": "排序方式:",
        "LIVE COUNTER-STRIKE MATCHES": "正在进行的 CS 比赛",
        "UPCOMING COUNTER-STRIKE MATCHES": "即将进行的 CS 比赛",
        // ── 赛事阶段/赛制/轮次 ──
        "GRAND FINAL": "总决赛", "QUARTERFINAL": "1/4决赛",
        "SEMIFINAL": "半决赛", "PLAYOFFS": "淘汰赛",
        "PLAYOFF STAGE": "淘汰赛阶段", "PLAYOFFS STAGE": "淘汰赛阶段",
        "UPCOMING EVENTS": "即将进行的赛事",
        "INTL. LAN": "国际线下赛", "LOCAL LAN": "本地线下赛",
        "INTERNATIONAL LAN": "国际线下赛", "REGIONAL LAN": "区域线下赛",
        "PLAYOFFS STAGE BEGINS IN": "淘汰赛阶段倒计时",
        "PLAY-IN": "入围赛", "PRE-PLAYOFF": "淘汰赛前",
        "ROSTERMANIA TRACKER": "转会追踪",
        "RATING BASED ON PAST 3 MONTHS": "基于过去3个月的评分",
        "UPCOMING & RECENT MATCHES": "即将进行及近期比赛",
        "MATCH PAGE": "比赛页面", "TBD": "待定",
        "QUARTER-FINAL": "四分之一决赛", "QUARTER-FINALS": "四分之一决赛",
        "QUARTERS": "四分之一决赛", "SEMI-FINAL": "半决赛",
        "SEMI-FINALS": "半决赛", "SEMIS": "半决赛",
        "UPPER QUARTER-FINALS": "胜者组四分之一决赛",
        "U. QUARTERS": "胜者组四分之一决赛",
        "UPPER SEMI-FINALS": "胜者组半决赛",
        "U. SEMIS": "胜者组半决赛",
        "COUNTER-STRIKE TOP TIER CALENDAR": "CS顶级赛事日历",
        "LOAD MORE EVENTS": "加载更多赛事", "NO EVENTS YET": "暂无赛事",
        "LOWER SEMI-FINALS": "败者组半决赛",
        "L. SEMIS": "败者组半决赛",
        "LOWER BRACKET SEMI-FINAL": "败者组半决赛",
        "NEXT IN EVENT": "赛事中下一场", "ALLSTAR HIGHLIGHTS": "全明星精彩集锦",
        // ── 星期 ──
        "MONDAY": "星期一", "TUESDAY": "星期二", "WEDNESDAY": "星期三",
        "THURSDAY": "星期四", "FRIDAY": "星期五", "SATURDAY": "星期六",
        "SUNDAY": "星期日", "MON": "周一", "TUE": "周二", "WED": "周三",
        "THU": "周四", "FRI": "周五", "SAT": "周六", "SUN": "周日",
        // ── 胜者组/败者组 ──
        "UPPER BRACKET": "胜者组", "UPPER BRACKET FINAL": "胜者组决赛",
        "UPPER BRACKET FINAL (ONLINE STAGE)": "胜者组决赛 (线上阶段)",
        "UPPER BRACKET ROUND 1": "胜者组第一轮",
        "UPPER FINAL": "胜者组决赛", "LOWER BRACKET": "败者组",
        "LOWER BRACKET FINAL": "败者组决赛", "LOWER FINAL": "败者组决赛",
        "LOWER BRACKET ROUND": "败者组轮次", "LOWER ROUND": "败者组轮次",
        "L. ROUND": "败者组轮次",
        // ── 小组/瑞士轮 ──
        "GROUP STAGE": "小组赛", "GROUP PLAY": "小组赛",
        "GROUP SWISS": "小组瑞士轮", "SWISS BO1": "瑞士轮BO1",
        "SWISS BO3": "瑞士轮BO3", "GROUP A": "A组", "GROUP B": "B组",
        "GROUP C": "C组", "GROUP D": "D组",
        // ── 单败/双败 ──
        "SINGLE ELIMINATION": "单败淘汰",
        "SINGLE ELIMINATION BRACKET": "单败淘汰赛",
        "DOUBLE ELIMINATION BO3": "双败淘汰BO3",
        "DOUBLE ELIMINATION BRACKET": "双败淘汰赛",
        // ── 其他轮次 ──
        "ROUND OF 16": "16强", "RO16": "16强", "ROUND OF 32": "32强",
        "RO32": "32强", "OPENING RD": "首轮", "OPENING ROUND": "首轮",
        "ELIMINATION MATCH": "淘汰赛", "ELIMINATION MATCHES BO3": "淘汰赛BO3",
        "DECIDER MATCH": "出线决胜战", "DECIDERS": "决胜战",
        "WINNERS' MATCH": "胜者对决赛", "CONSOLIDATION FINAL": "决赛晋级赛",
        "CONS. FINAL": "决赛晋级赛",
        "3RD PLACE DECIDER MATCH": "季军决胜战", "TIEBREAKER": "加赛",
        "LAN FINALS": "线下决赛", "LAN FINALS SPOTS": "线下决赛名额",
        "OPEN QUALIFIER": "公开预选赛", "CLOSED QUALIFIER": "封闭预选赛",
        "PROGRESSION MATCHES BO3": "晋级赛BO3", "STAGE 1": "第一阶段",
        "STAGE 2": "第二阶段", "STAGE 3": "第三阶段",
        "HIGH SEED (OPEN REGISTRATION)": "高顺位组 (公开报名)",
        "NO MATCHES YET": "暂无比赛", "PRIZEPOOL": "奖金池",
        "PREVIOUS IN EVENT": "赛事中上一场", "OTHER UPCOMING": "其他即将进行",
        "HIGHLIGHTS": "精彩集锦", "SCOREBOARD": "记分板",
        "GAME LOG": "比赛日志", "HIDE MINIMAP": "隐藏小地图",
        "VOTE": "投票", "ENDED": "结束", "PLAYER PROFILE": "选手档案",
        "MAP OVER": "地图结束", "QUIT THE GAME": "退出游戏",
        "ROUND OVER - WINNER:": "回合结束 - 获胜方:",
        "ENEMY ELIMINATED": "敌人被消灭", "BOMB DEFUSED": "炸弹被拆除",
        "ROUND STARTED": "回合开始", "COMMITTED SUICIDE": "自杀",
        "JOINED THE GAME": "加入游戏", "PLANTED THE BOMB ON": "把包安置在",
        "TARGET SAVED": "目标已拯救", "TARGET BOMBED": "目标被炸毁",
        "LIVE WIN PROBABILITY": "实时胜率", "MAP STATS": "地图数据",
        "POSSIBILITIES": "可能性", "WINS": "获胜", "OVERTIMES": "加时赛",
        "HEAD TO HEAD": "历史交锋", "SHOW ALL HEAD TO HEADS": "显示全部历史交锋",
        "VRS FORECAST": "VRS 预测", "CURRENT": "当前", "LINEUPS": "阵容",
        "WORLD RANK:": "世界排名:", "BEST OF 1": "BO1", "BEST OF 3": "BO3",
        "BEST OF 5": "BO5", "MATCH WIN STREAK": "比赛连胜",
        "UNRANKED": "不计入排名", "PLAYER OF THE MATCH": "本场MVP",
        "VRS RESULT": "VRS 结果", "NO MATCHES PAST 3 MONTHS": "近3个月无比赛",
        "HIGHLIGHTED STATS": "高亮数据", "MATCH OVER": "比赛结束",
        "REWATCH": "重看", "MATCH STATS": "比赛数据", "PRIZE POOL": "奖金池",
        "DATE": "日期", "LOCATION": "地点", "PRIZE DISTRIBUTION": "奖金分配",
        "BRACKETS": "对阵表", "PICK'EM": "竞猜选择", "DETAILED VIEW": "详细视图",
        "MEDIA DAY": "媒体日", "SIMULATOR": "模拟器",
        "TOURNAMENT STICKERS": "赛事印花", "BROWSE HIGHLIGHTS": "浏览精彩集锦",
        "TEAMS ATTENDING": "参赛战队", "RANKED": "计入排名",
        "ALL MAPS": "所有地图", "ROUND OVER": "回合结束",
        "ALL TIME": "所有时间", "ALL MATCHES": "所有比赛",
        "PAST MONTH": "过去一个月", "PAST 3 MONTHS": "过去三个月",
        "ECO-ADJUSTED": "经济调整后", "TEAMS ATTENDED": "参赛战队",
        "SHOW LINEUPS": "显示阵容", "SHOW VRS WITHOUT EVENT": "显示不含该赛事的VRS",
        "OPENING MATCH": "揭幕战",
        // ── 地图 ──
        "DUST2": "沙漠2", "DUST 2": "沙漠2", "D2": "沙漠2",
        "MIRAGE": "荒漠迷城", "MRG": "荒漠迷城", "INFERNO": "炼狱小镇",
        "INF": "炼狱小镇", "NUKE": "核子危机", "OVERPASS": "死亡游乐园",
        "OVP": "死亡游乐园", "VERTIGO": "殒命大厦", "VRT": "殒命大厦",
        "ANCIENT": "远古遗迹", "ANC": "远古遗迹", "TRAIN": "列车停放站",
        "TRN": "列车停放站", "ANUBIS": "阿努比斯", "ANB": "阿努比斯",
        "CACHE": "死城之谜", "COBBLESTONE": "古堡激战", "CBL": "古堡激战",
        "TUSCAN": "托斯卡纳",
        // ── 晋级/淘汰状态 ──
        "3 : 0 - ADVANCED": "3 : 0 - 晋级",
        "0 : 3 - ELIMINATED": "0 : 3 - 淘汰",
        "3:1 OR 3:2 ADVANCED": "3:1 或 3:2 晋级", "SWISS ROUND": "瑞士轮",
        "DETAILED STATS": "详细数据", "TOP PLAYER IN MATCH": "全场最佳选手",
        "FEATURED RESULTS": "精选赛果", "TBA": "待定",
        "EXPAND ALL": "展开全部", "THIS IS AN OLD ROSTER": "这是旧阵容",
        "ROSTER": "阵容", "ROUND-ROBIN": "单循环",
        "FORMATS": "赛制", "MAP POOL": "地图池"
    };

    // =========================================================================
    // 2. 配置
    // =========================================================================
    const config = {
        skipTags: ["SCRIPT", "STYLE", "TEXTAREA", "CODE", "PRE", "INPUT"],
        skipClasses: ["moment-timestamp"],
        skipSelectors: [
            ".newstext", ".news-block", ".headertext", ".news-read-more-1-bottom",
            ".calendar-page > h2:nth-of-type(1)", ".disclaimer",
            ".calendar-page > p:nth-of-type(1)", ".calendar-page > h2:nth-of-type(2)",
            ".analytics-pick-a-winner", ".calendar-page > p:nth-of-type(2)",
            ".headline-subtext[data-spider-detail-div]",
            ".no-promode.forum > .thread-message > .thread-message-text",
            ".topic.a-default", "h1.headline", ".news-fact-box h2",
            ".forum-middle", ".pickems-cta-index", ".faq-wrapper",
            ".featured-newstext", ".featured-small-newstext",
            "section.side-by-side.align-items-center",
            "td.name a[href*='/forums/threads/']", ".confirmed-show-tagline",
            ".hotmatch-box .placeholderrow", ".eventname", "div.news div.item",
            ".description-box", ".carousel-slider-section.hof",
            ".small-event .text-ellipsis", ".big-event-name", ".hof-text",
            ".trophy-event", ".vrs-legend", ".calendar-entry .calendar-name",
            ".event-tooltip-top .text-ellipsis", ".newsitem.standard-box",
            ".event-hub-title", ".transfer h2", ".transfer p",
            ".regional-ranking-header", ".playerpage-matchbox-bottom.text-ellipsis",
            ".event-name", ".guide-event .strong", ".footerlinks",
            ".match-event > .text-ellipsis", ".no-events", ".line-clamp-3",
            ".ranking-description", ".regional-ranking-header-text",
            "a[href*='/betting']", "span.team", ".match-filter-popup-description"
        ],
        excludedNames: [
            "s1mple", "ZywOo", "m0NESY", "NiKo", "Jordan Manevski", "Jordan ",
            "BORING PLAYERS", "Subtop De France", "Keyd Stars", "Just Players",
            "FaZe Up Next", "device", "train launcher"
        ],
        dynamicRules: []
    };

    // =========================================================================
    // 3. 预编译
    // =========================================================================
    const translatedNodes = new WeakSet();

    function clearTranslatedInElement(element) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) translatedNodes.delete(node);
    }

    function escapeRegExp(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const excludedNamesRegex = config.excludedNames.length > 0
        ? new RegExp(config.excludedNames.map(escapeRegExp).join("|"), "gi")
        : null;

    const sortedDictKeys = Object.keys(dictionary).filter(k => k).sort((a, b) => b.length - a.length);
    const compiledDict = sortedDictKeys.map(key => {
        const isWordBoundary = /^\w.*\w$/.test(key) || /^\w$/.test(key);
        const pattern = isWordBoundary ? "\\b" + escapeRegExp(key) + "\\b" : escapeRegExp(key);
        return { regex: new RegExp(pattern, "gi"), value: dictionary[key] };
    });

    // =========================================================================
    // 4. 共享映射
    // =========================================================================
    const monthNum = {
        "jan": 1, "january": 1, "feb": 2, "february": 2, "mar": 3, "march": 3,
        "apr": 4, "april": 4, "may": 5, "jun": 6, "june": 6, "jul": 7, "july": 7,
        "aug": 8, "august": 8, "sep": 9, "september": 9, "oct": 10, "october": 10,
        "nov": 11, "november": 11, "dec": 12, "december": 12
    };
    const monthAbbrU = { "JAN": "1月","FEB": "2月","MAR": "3月","APR": "4月","MAY": "5月","JUN": "6月","JUL": "7月","AUG": "8月","SEP": "9月","OCT": "10月","NOV": "11月","DEC": "12月" };
    const monthFullU = { "JANUARY": "一月","FEBRUARY": "二月","MARCH": "三月","APRIL": "四月","MAY": "五月","JUNE": "六月","JULY": "七月","AUGUST": "八月","SEPTEMBER": "九月","OCTOBER": "十月","NOVEMBER": "十一月","DECEMBER": "十二月" };
    const monthTitle = { "January": "一月","February": "二月","March": "三月","April": "四月","May": "五月","June": "六月","July": "七月","August": "八月","September": "九月","October": "十月","November": "十一月","December": "十二月" };
    const monthAll = { ...monthAbbrU, ...monthFullU };
    const monthRegexStr = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)";

    const regionsEn = { "Europe": "欧洲", "Asia": "亚洲", "Americas": "美洲", "Oceania": "大洋洲", "Africa": "非洲", "North America": "北美", "South America": "南美" };
    const regionsCode = { "EU": "欧洲", "AM": "美洲", "AS": "亚洲" };
    const regionsValve = { "EUROPE": "欧洲", "AMERICAS": "美洲", "ASIA": "亚洲" };
    const regionsVRS = { "global": "全球", "am": "美洲", "as": "亚洲", "eu": "欧洲" };

    const timePeriods = { "All time": "所有时间", "Last month": "最近一个月", "Last 3 months": "最近三个月", "Last 6 months": "最近六个月", "Last 12 months": "最近十二个月" };
    const matchTypes = { "All matches": "所有比赛", "LAN": "线下赛", "Online": "线上赛", "Both": "全部", "Ranked": "计入排名", "Unranked": "不计入排名", "All": "全部" };
    const eventTypes = { "Major": "Major", "International LAN": "国际线下赛", "Regional LAN": "区域线下赛", "Local LAN": "本地线下赛", "Online": "线上赛", "Other": "其他", "Majors": "Major", "Big events": "大型赛事", "MVP events": "MVP 赛事" };
    const topN = { "Top 5": "前5", "Top 10": "前10", "Top 20": "前20", "Top 30": "前30", "Top 50": "前50" };
    const bestOf = { "Best of 1": "BO1", "Best of 3": "BO3", "Best of 5": "BO5" };
    const sidesCT = { "Counter-Terrorist": "反恐精英", "Terrorist": "恐怖分子", "Both": "双方", "T": "T", "CT": "CT" };

    const sidebarBigMap = {
        ...timePeriods, ...matchTypes, ...eventTypes, ...topN, ...bestOf,
        "Event filter": "赛事筛选", "Navigation": "导航", "Search stats": "搜索数据",
        "Version": "版本", "Filters": "筛选", "Event type": "赛事类型",
        "Time": "时间", "Ranking": "排名筛选", "Best Of X": "赛制",
        "Valve Ranked": "V社排名", "Match type": "比赛类型", "Country": "国家",
        "Gender": "性别", "Age": "年龄", "Maps": "地图",
        "1.6 stats section": "1.6 数据板块", "Prize pool": "奖金池",
        "Attending teams": "参赛战队", "Attending player": "参赛选手",
        "Remove": "移除", "CS2": "CS2", "CSGO": "CSGO",
        "Grand final": "总决赛", "Playoffs": "淘汰赛", "Pre-playoff": "淘汰赛前",
        "Men": "男性", "Women": "女性", "Min age": "最小年龄",
        "Max age": "最大年龄", "Maps in filter": "筛选中的地图",
        "Min. maps:": "最少地图数:", "Overview": "概览", "Players": "选手",
        "Teams": "战队", "Matches": "比赛", "Events": "赛事",
        "Leaderboards": "排行榜", "Aces": "ACE", "Compare": "对比"
    };

    // =========================================================================
    // 5. 上下文精确匹配规则表
    // =========================================================================
    const ctxRules = [
        { ptag: 'H2', pcls: 'newsheader', umap: { "TODAY'S NEWS": "今日新闻", "YESTERDAY'S NEWS": "昨日新闻", "PREVIOUS NEWS": "先前新闻" } },
        { ptag: 'A', pcls: 'button-more', regs: [{ re: /^\s*more\s+news\s*$/i, fn: () => '更多新闻' }] },
        { ptag: 'A', pcls: 'todays-matches', regs: [{ re: /^\s*today'?s\s+matches\s*$/i, fn: () => '今日比赛' }] },
        { ptag: 'A', pcls: 'nav-link', pattr: { name: 'href', value: '/results' }, regs: [{ re: /^\s*results\s*$/i, fn: () => '赛果' }] },
        { regs: [{ re: /^(\d+)\s+comments$/i, fn: m => `${m[1]} 条评论` }] },
        { sel: 'table.eventMeta', ptag: 'TH', map: { "Start date": "开始日期", "End date": "结束日期", "VRS date": "VRS 日期", "VRS weight": "VRS 权重", "Teams": "战队", "Total prize pool": "总奖金", "Player share": "选手分成", "Location": "地点", "Event type": "赛事类型" } },
        { pcls: 'sidebar-headline', map: { "Filters": "筛选", "Event galleries": "赛事图集", "Recent events": "近期赛事" } },
        { pcls: 'filter-column-header', map: { "Stars": "星级", "Time": "时间", "Match type": "比赛类型", "Map": "地图", "Event": "赛事", "Player": "选手", "Team": "战队", "Game": "游戏", "Valve ranked": "V社排名", "Year": "年份", "Month": "月份", "Day": "日期" } },
        { ptag: 'A', pcls: 'sidebar-single-line-item', map: { ...timePeriods, ...matchTypes } },
        { sel: '.sidebar-con', map: sidebarBigMap },
        { sel: '.sidebar-con', pcls: 'sidebar-single-line-item', regs: [{ re: /^Day (\d+)$/i, fn: m => `第${m[1]}天` }] },
        { sel: '.filter-column-content', pcls: 'sidebar-single-line-item', umap: { "ALL": "全部", "MAJOR": "Major", "INTERNATIONAL LAN": "国际线下赛", "REGIONAL LAN": "区域线下赛", "ONLINE": "线上赛", "LOCAL LAN": "本地线下赛", "OTHER": "其他", "MEN": "男性", "WOMEN": "女性" } },
        { pcls: 'sidebar-single-line-item', regs: [{ re: /^\d+(st|nd|rd|th)$/i, fn: (m, full) => full.replace(/\s*(st|nd|rd|th)\s*/i, '日') }] },
        { pcls: 'sidebar-single-line-item', map: monthTitle },
        { sel: '.matches-sidebar-filter-wrapper', ptag: 'H3', map: { "Match filters": "赛事筛选" } },
        { sel: '.matches-sidebar-filter-wrapper', pid: 'clear-all', map: { "Clear all": "清除全部" } },
        { sel: '.matches-sidebar-filter-wrapper', pcls: 'matches-sidebar-filter-title', map: { "Star": "星级", "Ranked": "排名", "Region": "区域", "Tournament": "赛事" } },
        { sel: '.matches-sidebar-filter-wrapper', pcls: 'matches-sidebar-filter-clear-all', map: { "Clear": "清除" } },
        { sel: '.matches-sidebar-filter-wrapper', pcls: 'matches-filter-name-text', map: { "Starred matches only": "仅显示有星级的比赛", "Ranked": "计入排名", "Unranked": "不计入排名" } },
        { sel: '.matches-sidebar-filter-wrapper', pcls: 'matches-filter-name-text', regs: [{ re: /^(Europe|Asia|Americas|Oceania|Africa)\s*\((\d+)\)$/i, fn: m => `${regionsEn[m[1]] || m[1]} (${m[2]})` }] },
        { sel: '.matches-sidebar-filter-wrapper', pcls: 'event-tooltip-bottom-text', map: { "Date": "日期", "Teams": "战队", "Prize pool": "奖金池", "Location": "地点" } },
        { sel: '.matches-sidebar-filter-wrapper', pcls: 'matches-filter-close-btn', map: { "Set filters": "设置筛选" } },
        { sel: '.stats-top-menu', pcls: 'tab-title', map: { "Event filter": "赛事筛选", "Time filter": "时间筛选", "Ranking filter": "排名筛选", "Map filter": "地图筛选", "Version": "版本" } },
        { sel: '.stats-top-menu', ptag: 'OPTION', map: { "All": "全部", ...eventTypes, ...timePeriods, ...topN } },
        { sel: '.stats-top-menu', pcls: 'stats-sub-navigation-simple-filter-map', map: { "All": "全部", ...eventTypes, ...timePeriods, ...topN } },
        { pcls: 'sub-region-name', ptag: 'A', map: regionsEn },
        { sel: '.playerInfoWrapper', map: { "Age": "年龄", "Current team": "当前战队", "Team": "战队", "Prize money": "奖金", "Total team winnings / 5": "战队总奖金 / 5" } },
        { sel: '.playerInfoWrapper', regs: [{ re: /^No team$/i, fn: () => '无战队' }, { re: /^(\d+)\s+years?$/i, fn: m => `${m[1]}岁` }] },
        { sel: '.playerpage-container-attributes', ptag: 'B', map: { "Firepower": "火力", "Entrying": "突破手", "Trading": "补枪手", "Opening": "开局突破", "Clutching": "残局大师", "Sniping": "狙击手", "Utility": "道具手" } },
        { sel: 'table.vrs-holder', ptag: 'TH', pcls: 'table-header', map: { "Team": "战队", "Points": "积分", "Placement": "名次" } },
        { sel: '.profile-team-stats-container', map: { "Valve ranking": "V社排名", "World ranking": "世界排名", "Weeks in top30 for core": "核心阵容在Top30周数", "Average player age": "选手平均年龄", "Coach": "教练" } },
        { pcls: 'core-chart', regs: [{ re: /^\s*For core\s*$/i, fn: () => '核心' }] },
        { pcls: 'team-chart', regs: [{ re: /^\s*For team\s*$/i, fn: () => '队伍' }] },
        { ptag: 'H2', pcls: 'standard-headline', regs: [{ re: /^\s*World ranking development for core\s*$/i, fn: () => '核心队伍世界排名走势' }] },
        { sel: '.ranking-info', pcls: 'sub-title', map: { "Current ranking": "当前排名", "Peak": "最高排名", "Time at peak": "最高排名持续时间" } },
        { sel: '.ranking-info', regs: [{ re: /^(\d+)\s+week(s)?$/i, fn: m => m[1] + '周' }] },
        { sel: '.coach-table', regs: [{ re: /^(\d+)\s+months?$/i, fn: m => `${m[1]}个月` }] },
        { pcls: 'sub-headline', regs: [{ re: /^\s*Stats from entire coach period\s*$/i, fn: () => '执教期间全队数据' }] },
        { sel: '.players-cell', regs: [{ re: /^(\d+)\s+months?$/i, fn: m => `${m[1]}个月` }] },
        { sel: '.player-status', umap: { "STARTER": "首发", "BENCHED": "替补" } },
        { ptag: 'A', pcls: 'standard-headline', regs: [{ re: /^(.+?)\s+Day\s+(\d+)$/i, fn: m => `${m[1]} 第${m[2]}天` }] },
        { pcls: 'timeline-month-label', umap: monthAbbrU },
        { pcls: 'timeline-year-label', umap: { "2026": "2026年", "'26": "2026年" } },
        { ptag: 'H2', pcls: 'calendar-title', umap: monthFullU },
        { pcls: 'calendar-month', umap: monthFullU },
        { pcls: 'calendar-ordinal', regs: [{ re: /^(st|nd|rd|th)$/i, fn: () => '日' }] },
        { sel: 'tr.week-name', ptag: 'TH', map: { "su": "日", "mo": "一", "tu": "二", "we": "三", "th": "四", "fr": "五", "sa": "六" } },
        { pcls: 'calendar-day', map: { "mon": "一", "tue": "二", "wed": "三", "thu": "四", "fri": "五", "sat": "六", "sun": "日" } },
        { sel: '.tab-holder', ptag: 'SPAN', map: { "featured": "精选", "today": "今日", "all": "全部" } },
        { sel: '.tab-holder', pcls: 'tab', map: { "Info": "信息", "Teams": "战队", "Matches": "比赛", "Achievements": "成就", "Trophies": "奖杯", "News": "新闻", "FACEIT": "FACEIT" } },
        { pcls: 'transfer-team-no-team', umap: { "NO TEAM": "无战队" } },
        { pcls: 'transfer-team-status', umap: { "COACH": "教练", "BENCH": "替补" } },
        { sel: '.valve-region-selector', umap: regionsValve },
        { sel: '.ranking-vrs-event-spots-counts', map: regionsVRS },
        { regs: [{ re: /^VRS\s*\((\w+)\)$/i, fn: m => { const r = { "europe": "欧洲", "americas": "美洲", "asia": "亚洲" }[m[1].toLowerCase()]; return r ? `VRS (${r})` : null; } }] },
        { pcls: 'ranking-grey', regs: [{ re: /^\d+\s+invites$/i, fn: (m, full) => full.replace(/\s*invites\s*/i, ' 邀请') }, { re: /^no invites yet$/i, fn: () => '暂无邀请' }] },
        { sel: '.sidebar-box.gtSmartphone-only', map: { "SECTIONS": "章节", "News": "新闻", "Prize distribution": "奖金分配", "MVP": "MVP", "Teams attending": "参赛战队", "Highlights": "精彩集锦", "Galleries": "赛事图集", "Formats": "赛制", "Related events": "相关赛事", "Map pool": "地图池", "Group play": "小组赛", "Brackets": "淘汰赛" } },
        { pcls: 'event-name', pcls2: 'text-ellipsis', regs: [{ re: /^Simulator for /i, fn: (m, full) => full.replace(/^Simulator for /i, '') + ' 模拟器' }] },
        { pcls: 'highlight-group-name', regs: [{ re: /^Day\s+(\d+)$/i, fn: m => `第${m[1]}天` }] },
        { pcls: 'highlight-group-count', regs: [{ re: /^(\d+)\s+highlights$/i, fn: m => `${m[1]}个精彩集锦` }] },
        { pcls: 'gallery-name', regs: [{ re: /^Day\s+(\d+)$/i, fn: m => `第${m[1]}天` }] },
        { pcls: 'table-header', umap: { "M": "场", "RW": "胜回", "RL": "负回", "RD": "差", "RECORD": "记录", "E": "展", "W": "胜", "T": "平", "L": "负", "P": "积分" } },
        { sel: '.placement', regs: [{ re: /^(\d+)(?:-(\d+))?(st|nd|rd|th)$/i, fn: m => m[2] ? `第${m[1]}-${m[2]}名` : `第${m[1]}名` }] },
        { sel: 'tr.stats-table-row', ptag: 'TH', map: { "Player": "选手", "Team": "战队", "Teams": "战队", "Maps": "地图", "Rounds": "回合", "K-D Diff": "K-D差", "K/D": "K/D", "Rating": "评分", "Thrown": "投出", "Blinded": "被闪", "Opp Flashed": "闪敌", "Diff": "差值", "FA": "助攻", "Success": "成功率", "KPR": "首杀/局", "DPR": "首死/局", "Attempts": "参与", "RW%": "胜率%", "OpK": "首杀%", "MultiK": "多杀/局", "5v4%": "5v4%", "4v5%": "4v5%", "Traded%": "补枪%", "Won - Lost": "胜 - 负", "Pistol win %": "手枪局胜率", "Round 2 conv": "第2局转化", "R2 conv": "R2转化", "Round 2 break": "第2局突破", "R2 break": "R2突破", "ADR": "均伤", "Team1": "战队1", "Team2": "战队2", "Date": "日期", "Map": "地图", "Event": "赛事", "Winner": "胜者", "W": "胜", "Event name": "赛事名称", "Opponent lineup": "对手阵容" } },
        { ptag: 'TH', map: { "Firepower": "火力", "Teamwork": "团队", "Utility": "道具" } },
        { pcls: 'smartphone-only', map: { "R2 conv": "R2转化", "R2 break": "R2突破" } },
        { pcls: 'headline', ptag: 'SPAN', map: { "Watch": "观看" } },
        { sel: '.ct-t-stats-container', pcls: 'description', map: { "Side": "阵营" } },
        { sel: '.ct-t-stats-container', pcls: 'all-stats', map: { "Both": "双方" } },
        { sel: '.ct-t-stats-container', ptag: 'SPAN', map: sidesCT },
        { sel: '.vrs-forecast-container', pcls: 'vrs-forecast-header', map: { "before": "赛前", "result": "赛果" } },
        { pcls: 'toggle', map: { "Core": "核心", "Team": "队伍" } },
        { pcls: 'potm-chart-stat', map: { "KPR": "均杀", "DPR": "均死", "KAST": "KAST", "MK rating": "多杀评分", "Swing": "走势影响", "ADR": "均伤" } },
        { pcls: 'most-x-title', map: { "Most kills": "最多击杀", "Most damage": "最高伤害", "Most assists": "最多助攻", "Most AWP kills": "最多AWP击杀", "Most first kills": "最多首杀", "Best": "最佳" } },
        { sel: '.tabs', pcls: 'stats-top-menu-item-link', map: { "Overview": "概览", "Performance": "表现", "Economy": "经济", "Heatmaps": "热力图", "Team": "战队", "Lineup": "阵容" } },
        { sel: '.tabs.standard-box', pcls: 'stats-top-menu-item-link', map: { "Overview": "概览", "Individual": "个人", "Matches": "比赛", "Events": "赛事", "Career": "生涯", "Weapons": "武器", "Clutches": "残局", "Multi-kills": "多杀", "Opponents": "对手" } },
        { sel: '.fusioncharts-container', ptag: 'text', map: { "KPR": "均杀", "DPR": "均死", "KAST": "KAST", "MK rating": "多杀rating", "Swing": "影响力", "ADR": "均伤", "Semi-eco": "半起", "Semi-buy": "半买", "Full buy": "全起" } },
        { sel: '.team-economy-stat', map: { "Total full eco rounds [0-5k]": "全经济局总数 [0-5k]", "Total semi-eco rounds [5-10k]": "半经济局总数 [5-10k]", "Total semi-buy rounds [10-20k]": "半起局总数 [10-20k]", "Total full buy rounds [20k+]": "全起局总数 [20k+]" } },
        { sel: '.sides', pcls: 'settingHeader', map: { "Sides": "阵营" } },
        { sel: '.sides', pcls: 'button', map: sidesCT },
        { pcls: 'primaryRole', map: { "Player": "选手" } },
        { pcls: 'sub-navigation-link', map: { "Trophies": "奖杯", "MVPs": "MVP", "EVPs": "EVP", "Top 20": "Top 20", "Awards": "奖项" } },
        { pcls: 'statsPlayerCareerPeriod', map: { "Career": "生涯" } },
        { sel: '.all-time-stat', pcls: 'description', map: { "Matches": "场次", "Win rate": "胜率", "Win streak": "连胜", "Average KDR": "平均KDR", "Headshots": "爆头率" } },
        { sel: '.fpl-historic-table', ptag: 'TH', map: { "Season": "赛季", "Matches": "场次", "Won": "胜", "Won %": "胜率", "Win streak": "连胜", "Points": "积分", "Position": "排名" } },
        { pcls: 'stat-name-col', map: { "kpr": "每回合首杀", "apr": "每回合助攻", "surviving": "存活", "kast": "KAST", "impact": "影响力", "awp kpr": "AWP 每回合击杀", "hs %": "爆头率", "opening kpr": "每回合首杀", "flash assists": "闪光助攻" } },
        { pcls: 'filter-text', map: { "All Time, All matches, All Maps": "全部时间，全部比赛，全部地图" } },
        { pcls: 'stat-row-name', map: { "kpr": "每回合击杀数", "assists per round": "每回合助攻数", "apr": "每回合助攻数", "surviving": "存活率", "impact": "影响力", "awp kills per round": "AWP 每回合击杀", "hs %": "爆头率", "headshot %": "爆头率", "opening kills per round": "每回合首杀", "flash assists per round": "每回合闪光助攻", "opening kpr": "每回合首杀", "flash assists": "每回合闪光助攻", "awp kpr": "AWP 每回合击杀" } },
        { sel: '.stats-rows.standard-box', ptag: 'SPAN', map: { "awp": "AWP", "ak47": "AK-47", "m4a1_silencer": "M4A1 消音版", "usp_silencer": "USP 消音版", "m4a1": "M4A1", "deagle": "沙漠之鹰", "glock": "格洛克 18 型", "galilar": "加利尔 AR", "p250": "P250", "elite": "双枪", "ssg08": "SSG 08", "mp9": "MP9", "tec9": "Tec-9", "fiveseven": "FN57", "hegrenade": "高爆手雷", "famas": "FAMAS", "mac10": "MAC-10", "inferno": "燃烧弹", "hkp2000": "P2000", "cz75a": "CZ75 自动手枪", "knife_karambit": "爪子刀", "knife_m9_bayonet": "M9刺刀", "smokegrenade": "烟雾弹", "xm1014": "XM1014", "molotov": "燃烧瓶", "taser": "电击枪", "p90": "P90", "sg556": "SG 553", "knife_skeleton": "骷髅刀", "world": "世界", "nova": "新星", "usp_silencer_off": "USP 无消音版", "knife_stiletto": "刺刀", "mp5sd": "MP5-SD", "knife_butterfly": "蝴蝶刀", "knife_flip": "折叠刀", "aug": "AUG", "mp7": "MP7", "mag7": "MAG-7", "ump45": "UMP-45" } },
        { sel: '.toggle-fast-multi-kills-only', ptag: 'A', map: { "Fast multi-kills only": "仅显示快杀多杀", "Fast MK only": "仅快杀" } },
        { ptag: 'OPTION', sel: 'select', umap: { "SEASON": "四季公司" } },
        { map: { "Forum rules": "论坛规则", "Counter-Strike": "反恐精英", "Fantasy": "Fantasy", "Hardware & Tweaks": "硬件与优化", "Bugs & Suggestions": "Bug反馈与建议", "Off Topic": "杂谈" } },
        { map: { "Discussions and questions regarding Counter-Strike and events": "关于反恐精英及相关赛事的讨论与提问", "Discussions and questions about fantasy and shared users tips": "关于 Fantasy 及用户技巧分享的讨论与提问", "Discussions and questions on hardware and tweaks": "关于硬件与优化的讨论与提问", "Inform about bugs and provide suggestions for HLTV": "报告漏洞并为 HLTV 提供建议", "Discussions and questions about everything": "关于各类话题的讨论与提问" } },
        { sel: 'tr.tableheader', map: { "Topic": "主题", "Replies": "回复", "Author": "作者", "Activity": "活跃度" } },
        { sel: '.player-and-filter', map: { "Add player": "添加选手", "Search player": "搜索选手" } },
        { pcls: 'td-mvp-player-name', map: { "Player": "选手", "Total": "总计" } },
        { pcls: 'td-evp-player-name', map: { "Player": "选手", "Total": "总计" } },
        { pcls: 'td-total', map: { "Player": "选手", "Total": "总计" } },
        { sel: '.person-types', pcls: 'role-name', map: { "Player": "选手", "Coach": "执教", "Hall of Fame": "名人堂" } },
        { sel: '.retired-popup-row', map: { "Retired on": "退役日期" } },
        { pcls: 'player-stat-of', regs: [{ re: /^Based on (\d+) maps?$/i, fn: m => `基于 ${m[1]} 场地图` }, { re: /^Based on (\d+) rounds?$/i, fn: m => `基于 ${m[1]} 回合` }] },
        { sel: '.calendar-region', pcls: 'calendar-region', regs: [{ re: /^Region:\s*$/i, fn: () => '地区：' }] },
        { sel: '.calendar-region', pcls: 'calendar-sub-region-name', map: { "all": "全部", "europe": "欧洲", "americas": "美洲", "asia": "亚洲" } },
        { pcls: 'matches-sort-by-toggle-event', umap: { "EVENT": "按赛事" } },
        { pcls: 'matches-sort-by-toggle-time', umap: { "TIME": "按时间" } },
        { sel: '.pro-toggle-holder', pcls: 'pro-toggle', map: { "Normal": "标准", "Advanced": "高级" } },
        { sel: '.rating-description', regs: [{ re: /^vs top (\d+) opponents$/i, fn: m => `对阵前${m[1]}名对手` }] },
        { sel: '.rating-maps', regs: [{ re: /^\((\d+) maps\)$/i, fn: m => `(${m[1]}场地图)` }] },
        { pcls: 'diagram-info', regs: [{ re: /^Sliding window of rating 1\.0 for matches in the past 3 months - 1 day increments$/i, fn: () => '过去3个月比赛评分1.0的滑动窗口 - 1天增量' }, { re: /^Sliding window of rating 1\.0 - 1 day increments$/i, fn: () => '评分1.0的滑动窗口 - 1天增量' }] },
        { sel: '.stats-rows', pcls: 'standard-headline', map: { "Overall stats": "总数据", "Opening stats": "首杀数据", "Round stats": "回合数据", "Weapon stats": "武器数据" } },
        { sel: '.summary-box.standard-box', pcls: 'description', map: { "Avg. Rating": "平均评分", "Maps won": "地图胜场", "Maps with 1+ rating": "评分1+地图占比", "Best 1+ rating streak": "最高连续评分1+记录", "Wins": "胜场", "Losses": "负场", "Difference": "差值" } },
        { sel: '.stats-side-selector-wrapper', ptag: 'DIV', map: { "Side:": "阵营：" } },
        { sel: '.stats-side-selector-wrapper', pcls: 'stats-side-selector', map: { "Both": "全部", "CT": "CT", "T": "T" } },
        { sel: '.stats-side-selector-wrapper', pcls: 'gtSmartphone-only', map: { "Sides": "阵营", "Side": "方" } },
        { sel: '.player-stat-left', ptag: 'B', map: { "map winrate": "地图胜率", "ct round winrate": "CT方回合胜率", "t round winrate": "T方回合胜率", "best map": "最佳地图", "worst map": "最差地图" } },
        { pcls: 'separator-day', regs: [{ re: /^\s*to\s*$/i, fn: (m, full) => full.replace(/\s*to\s*/i, ' 至 ') }] },
        { pcls: 'selected-days', regs: [{ re: /Days/i, fn: (m, full) => full.replace(/\s*Days/i, ' 天') }] },
    ];

    // =========================================================================
    // 6. 动态标题正则表
    // =========================================================================
// ── 6a. 仅限 standard-headline 的标题模式 ──
const headlineTitlePatterns = [
    // h2.standard-headline — 教练相关
    { re: /^Team stats for ([A-Za-z0-9_\-]+) as coach$/i, fn: m => `${m[1]} 的执教队伍数据` },
    { re: /^Breakdown of teams coached by ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 执教队伍详情` },
    { re: /^Upcoming matches with ([A-Za-z0-9_\-]+) as coach$/i, fn: m => `由 ${m[1]} 执教的队伍近期比赛` },
    { re: /^Latest results with ([A-Za-z0-9_\-]+) as coach$/i, fn: m => `由 ${m[1]} 执教的队伍近期赛果` },
    { re: /^Major achievements for teams coached by ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 执教队伍的主要成就` },
    { re: /^Breakdown of major achievements for teams coached by ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 执教队伍主要成就详情` },
    { re: /^Trophy overview for teams coached by ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 执教队伍的奖杯概览` },
    { re: /^LAN achievements for teams coached by ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 执教队伍的线下赛成就` },
    { re: /^All trophies for teams coached by ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 执教队伍的全部奖杯` },
    { re: /^Breakdown of LAN achievements for teams coached by ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 执教队伍线下赛成就详情` },
    // h2.standard-headline — 选手成就
    { re: /^Major achievements for ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的主要成就` },
    { re: /^Breakdown of ([A-Za-z0-9_\-]+)'s major achievements$/i, fn: m => `${m[1]} 的主要成就详情` },
    { re: /^LAN achievements for ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的线下赛成就` },
    { re: /^Achievements for ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的成就` },
    { re: /^Breakdown of ([A-Za-z0-9_\-]+)'s LAN achievements$/i, fn: m => `${m[1]} 的线下赛成就详情` },
    { re: /^Trophy overview for ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的奖杯概览` },
    { re: /^All ([A-Za-z0-9_\-]+)'s trophies$/i, fn: m => `${m[1]} 的全部奖杯` },
    { re: /^MVP overview for ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的 MVP 概览` },
    { re: /^All ([A-Za-z0-9_\-]+)'s MVP medals$/i, fn: m => `${m[1]} 的全部 MVP 奖牌` },
    { re: /^EVP overview for ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的 EVP 概览` },
    { re: /^All events where ([A-Za-z0-9_\-]+) was an EVP$/i, fn: m => `${m[1]} 获得 EVP 的所有赛事` },
    { re: /^Top 20 overview for ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的 Top 20 概览` },
    { re: /^HLTV awards overview for ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的 HLTV 奖项概览` },
    { re: /^All time stats for ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的生涯数据` },
    { re: /^Breakdown of ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的表现详情` },
    { re: /^Breakdown of LAN achievements for ([A-Za-z0-9_\-]+)$/i, fn: m => `${m[1]} 的线下成就表现详情` },
    { re: /^([A-Za-z0-9_\-]+)'s active FPL season$/i, fn: m => `${m[1]} 活跃的FPL赛季` },
    // span.standard-headline
    { re: /^Match history for ([A-Za-z0-9_\-]+)/i, fn: m => `${m[1]} 的比赛历史` },
    { re: /^Event history for ([A-Za-z0-9_\-]+)/i, fn: m => `${m[1]} 的赛事历史` },
    { re: /^Career rating 1\.0 for ([A-Za-z0-9_\-]+)/i, fn: m => `${m[1]} 的生涯评分 1.0` },
    { re: /^All clutch history for ([A-Za-z0-9_\-]+)/i, fn: m => `${m[1]} 的全部残局历史` },
    { re: /^All\s+(fast\s+)?multi-kill history for ([A-Za-z0-9_\-]+)/i, fn: m => `${m[2]} 的全部${m[1] ? '快杀' : ''}多杀历史` },
    { re: /^(\d+)x\s+(fast\s+)?multi-kill history for ([A-Za-z0-9_\-]+)/i, fn: m => `${m[1]}x ${m[2] ? '快杀多杀' : '多杀'}历史 - ${m[3]}` },
    // 新闻标题
    { re: /^News posts mentioning ([A-Za-z0-9_\-]+)$/i, fn: m => `提及 ${m[1]} 的新闻` },
    { re: /^News posts from (\d{4})$/i, fn: m => `${m[1]}年的新闻` },
    // 直播/统计标题
    { re: /^(.+?)\s+is currently playing$/i, fn: m => `${m[1]} 目前正在比赛` },
    { re: /^([A-Za-z0-9_\-]+)\s+coach statistics$/i, fn: m => `${m[1]} 执教数据` },
    { re: /^(.+?)\s+statistics$/i, fn: m => `${m[1]} 的数据` },
];

// ── 6b. 全局动态模式（不限上下文，任何文本节点都可匹配） ──
const globalTitlePatterns = [
    { re: /^MATCH\s+STATS\s+FOR\s+(.+)/i, fn: m => `${m[1].trim()} 的比赛数据` },
    { re: /^UPCOMING\s+MATCHES\s+FOR\s+(.+)/i, fn: m => `${m[1].trim()} 的未来赛程` },
    { re: /^Breakdown\s+of\s+([a-zA-Z0-9_\-]+)'s\s+teams/i, fn: m => `${m[1]} 的战队生涯详情` },
    { re: /^Timeline\s+of\s+teams\s+coached\s+by\s+([a-zA-Z0-9_\-]+)/i, fn: m => `${m[1]} 的执教战队历史时间轴` },
    { re: /^Team\s+stats\s+for\s+([a-zA-Z0-9_\-]+)/i, fn: m => `${m[1]} 的战队数据统计` },
    { re: /^Timeline\s+of\s+([a-zA-Z0-9_\-]+)'s\s+teams/i, fn: m => `${m[1]} 的战队历史时间轴` },
    { re: /^Pictures\s+of\s+([a-zA-Z0-9_\-]+)/i, fn: m => `${m[1]} 的照片` },
    { re: /^Complete\s+statistics\s+for\s+([a-zA-Z0-9_\-]+)/i, fn: m => `${m[1]} 的完整数据统计` },
    { re: /^Latest\s+results\s+for\s+([a-zA-Z0-9_\-]+)/i, fn: m => `${m[1]} 的近期战绩` },
    { re: /^See\s+all\s+results\s+for\s+([a-zA-Z0-9_\-]+)/i, fn: m => `查看 ${m[1]} 的全部战绩` },
    { re: /^Coach\s+of\s+(.+)/i, fn: m => `${m[1].trim()} 的教练` },
    { re: /^Team\s+photos\s+of\s+(.+)/i, fn: m => `${m[1].trim()} 战队的照片` },
    { re: /^All\s+photos\s+of\s+players\s+for\s+(.+)/i, fn: m => `${m[1].trim()} 战队选手的全部照片` },
    { re: /^All\s+photos\s+of\s+([a-zA-Z0-9_\-]+)/i, fn: m => `${m[1]} 的全部照片` },
    { re: /^Not sure how to pronounce ([A-Za-z0-9_\-]+)\?$/i, fn: m => `不知道如何发音${m[1]}？` },
    { re: /^([A-Za-z0-9_\-]+)'s inventory$/i, fn: m => `${m[1]}的库存` },
    { re: /^([A-Za-z0-9_\-]+)'s skins$/i, fn: m => `${m[1]}的皮肤` },
    { re: /^([A-Za-z0-9_\-]+)'s stickers$/i, fn: m => `${m[1]}的印花` },
    { re: /^([A-Za-z0-9_\-]+)'s best matches$/i, fn: m => `${m[1]}的最佳比赛` },
    { re: /^Complete match overview for ([A-Za-z0-9_\-]+)$/i, fn: m => `查看${m[1]}的完整比赛概览` },
    { re: /^Days played for (.+)$/i, fn: m => `在 ${m[1]} 的执教天数` },
    { re: /^No upcoming matches for ([A-Za-z0-9_\-]+), check back later\.$/i, fn: m => `${m[1]} 暂无即将进行的比赛，请稍后再来查看。` },
    { re: /^We have no achievements recorded for ([A-Za-z0-9_\-]+) at the moment\.$/i, fn: m => `目前尚未记录 ${m[1]} 的成就。` },
    { re: /^We have no trophies recorded for ([A-Za-z0-9_\-]+) at the moment\.$/i, fn: m => `目前尚未记录 ${m[1]} 的奖杯。` },
    { re: /^We didn't record any trophies for ([A-Za-z0-9_\-]+) during their career\.$/i, fn: m => `职业生涯中尚未记录${m[1]}的奖杯。` },
    { re: /^We didn't record any achievements for ([A-Za-z0-9_\-]+) during their career\.$/i, fn: m => `职业生涯中尚未记录${m[1]}的成就。` },
    { re: /^([A-Za-z0-9_\-]+) has no stats for the active FPL season, check back later\.$/i, fn: m => `${m[1]} 在当前FPL赛季中尚无数据，请稍后再查看。` },
];

    const leaderboardMap = {
        "Damage per round": "每回合伤害", "Total kills": "总击杀", "Deaths per round": "每回合阵亡",
        "Total assists": "总助攻", "KAST": "KAST", "Clutches (1vsX) won": "残局（1vX）获胜",
        "Headshots per round": "每回合爆头", "Total AWP kills": "AWP 总击杀",
        "Total opening kills": "总首杀", "Success in opening duels": "首杀交锋胜率",
        "Round Swing": "回合影响力", "KD-diff": "KD差", "Damage diff per round": "每回合伤害差",
        "Kills per round": "每回合击杀", "1+ kill rounds": "击杀回合",
        "Assists per round": "每回合助攻", "Support rounds": "辅助回合",
        "Total headshots": "总爆头", "Headshot percentage": "爆头率",
        "AWP kills per round": "每回合 AWP 击杀", "Opening kills per round": "每回合首杀",
        "Impact rating": "影响力评分", "Multi-kill rating": "多杀评分"
    };

    const statsRowsMap = {
        "Kills": "击杀", "Deaths": "阵亡", "Kill / Death": "击杀/阵亡",
        "Kill / Round": "每回合击杀", "Rounds with kills": "击杀回合数",
        "Kill - Death difference": "击杀-阵亡差", "K - D diff.": "K-D差",
        "Total opening kills": "首杀总数", "Total opening deaths": "首死总数",
        "Opening kill ratio": "首杀比率", "Opening kill rating": "首杀评分",
        "Team win percent after first kill": "首杀后队伍胜率",
        "First kill in won rounds": "胜局首杀占比",
        "0 kill rounds": "0杀回合", "1 kill rounds": "1杀回合",
        "2 kill rounds": "2杀回合", "3 kill rounds": "3杀回合",
        "4 kill rounds": "4杀回合", "5 kill rounds": "5杀回合",
        "Rifle kills": "步枪击杀", "Sniper kills": "狙击击杀",
        "SMG kills": "冲锋枪击杀", "Pistol kills": "手枪击杀",
        "Grenade": "投掷物击杀", "Other": "其他击杀",
        "Total kills": "总击杀", "Headshot %": "爆头率",
        "Total deaths": "总阵亡", "K/D Ratio": "K/D 比率",
        "Damage / Round": "每回合伤害", "Grenade dmg / Round": "每回合投掷物伤害",
        "Maps played": "出场地图数", "Rounds played": "出场回合数",
        "Kills / round": "每回合击杀", "Assists / round": "每回合助攻",
        "Deaths / round": "每回合阵亡", "Saved by teammate / round": "每回合被队友救",
        "Saved teammates / round": "每回合救队友", "Impact rating": "影响力评分"
    };

// ── 7. 全局正则管道 ──
const MON = monthRegexStr;
const globalRegexPipeline = [
    { re: new RegExp(`News\\s+from\\s+${MON}\\s*,?\\s+(\\d{4})`, 'i'), replacer: (m, mon, y) => `${y}年${monthNum[mon.toLowerCase()]}月的新闻` },
    { re: new RegExp(`Results\\s+for\\s+${MON}\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,)?\\s+(\\d{4})`, 'i'), replacer: (m, mon, d, y) => `${y}年${monthNum[mon.toLowerCase()]}月${d}日的赛果` },
    { re: /won\s+with\s+([\d.]+%)\s+of\s+the\s+votes/i, replacer: (m, p) => `以${p}的得票率获胜` },
    { re: /\b(Europe|Asia|Americas|Oceania|Africa)\s*\((\d+)\)/gi, replacer: (m, r, c) => `${regionsEn[r] || r} (${c})` },
    { re: new RegExp(`\\b${MON}\\s+(\\d{1,2})(?:st|nd|rd|th)?\\s*[-–—~]\\s*${MON}\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b`, 'gi'), replacer: (m, m1, d1, m2, d2) => `${monthNum[m1.toLowerCase()]}月${d1}日 - ${monthNum[m2.toLowerCase()]}月${d2}日` },
    { re: new RegExp(`\\b${MON}\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,)?\\s+(\\d{4})\\b`, 'gi'), replacer: (m, mon, d, y) => `${y}年${monthNum[mon.toLowerCase()]}月${d}日` },
    // [BUG FIX] 去掉 MON 外层的多余 ()，避免捕获组偏移
    { re: new RegExp(`${MON}\\s+(\\d+)(st|nd|rd|th)`, 'gi'), replacer: (m, mon, d) => `${monthNum[mon.toLowerCase()]}月${d}日` },
    { re: /-\s*maps:\s*(\d+)/i, replacer: (m, c) => `- 地图数: ${c}` },
    { re: new RegExp(`(\\d+)(st|nd|rd|th)\\s+of\\s+${MON}`, 'i'), replacer: (m, d, s, mon) => `${monthNum[mon.toLowerCase()]}月${d}日` },
    { re: new RegExp(`on\\s+${MON}\\s+(\\d+)\\b`, 'i'), replacer: (m, mon, d) => `${monthNum[mon.toLowerCase()]}月${d}日` },
    { re: new RegExp(`\\b${MON}\\s+(\\d{4})\\b`, 'gi'), replacer: (m, mon, y) => `${y}年${monthNum[mon.toLowerCase()]}月` },
    { re: /\b(a few|one|two|\d+|a|an)\s+(second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s+ago\b/i, replacer: (m, numStr, unit) => {
        const numLower = numStr.toLowerCase(); let cnNum = numStr;
        if (['a','an','one'].includes(numLower)) cnNum = '1';
        else if (numLower === 'two') cnNum = '2';
        else if (numLower === 'a few') cnNum = '几';
        const u = { second:'秒',seconds:'秒',minute:'分钟',minutes:'分钟',hour:'小时',hours:'小时',day:'天',days:'天',week:'周',weeks:'周',month:'个月',months:'个月',year:'年',years:'年' }[unit.toLowerCase()];
        return u ? `${cnNum} ${u}前` : m;
    } },
    { re: /transfers\s+from/i, replacer: m => ' 从 ' },
    { re: /joins\b/i, replacer: m => ' 加入 ' },
    { re: /Based\s+on\s+(\d+)\s+maps/i, replacer: (m, c) => `基于 ${c} 场地图的数据` },
    { re: /\(\s*Past\s+3\s+months\s*•\s*(\d+)\s*maps\s*\)/i, replacer: (m, c) => `(近 3 个月 • ${c} 场地图)` },
    { re: /(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/i, replacer: (m, s, e, tl) => `第 ${s} - ${e} 条，共 ${tl} 条` },
];

    // =========================================================================
    // 8. 辅助函数
    // =========================================================================
    function appendSuffix(node, suffix) {
        if (!node.nextSibling) return;
        if (node.nextSibling.nodeType === Node.ELEMENT_NODE)
            node.nextSibling.insertAdjacentHTML("afterend", `<span style="color: inherit;">${suffix}</span>`);
        else
            node.nextSibling.nodeValue = " " + node.nextSibling.nodeValue.trim() + suffix;
    }

    // =========================================================================
    // 9. 核心翻译函数
    // =========================================================================
    function applyDynamicRules(text, node) {
        const parent = node.parentElement;
        const raw = text.trim();
        const cut = raw.toUpperCase();

        // ── 阶段 1: 上下文规则表 ──
        const cache = new Map();
        const inContainer = (sel) => {
            if (!cache.has(sel)) cache.set(sel, !!parent?.closest?.(sel));
            return cache.get(sel);
        };
        const hasPcls = (cls) => !!parent?.classList?.contains(cls);
        const isPtag = (tag) => parent?.nodeName === tag;

        for (const rule of ctxRules) {
            if (rule.sel && !inContainer(rule.sel)) continue;
            if (rule.ptag && !isPtag(rule.ptag)) continue;
            if (rule.pcls && !hasPcls(rule.pcls)) continue;
            if (rule.pcls2 && !hasPcls(rule.pcls2)) continue;
            if (rule.pid && parent?.id !== rule.pid) continue;
            if (rule.pattr && parent?.getAttribute(rule.pattr.name) !== rule.pattr.value) continue;
            if (rule.map) {
                const v = rule.map[raw];
                if (v !== undefined) return v;
                const lv = rule.map[raw.toLowerCase()];
                if (lv !== undefined) return lv;
            }
            if (rule.umap) {
                const v = rule.umap[cut];
                if (v !== undefined) return v;
            }
            if (rule.regs) {
                for (const r of rule.regs) {
                    const m = raw.match(r.re);
                    if (m) { const ret = r.fn(m, raw); if (ret !== null && ret !== undefined) return ret; }
                }
            }
        }

        // ── 模块：.timeAndEvent 容器 — 比赛时间/日期/倒计时 ──
// 利用 data-unix 时间戳直接格式化，避免正则解析英文日期
const timeAndEvent = parent?.closest?.('.timeAndEvent');
if (timeAndEvent) {
    // .date 元素：data-time-format="do 'of' MMMM y"
    // 原文如 "11th of July 2026" → 直接用 data-unix 生成 "2026年7月11日"
    if (parent.classList.contains('date') && parent.hasAttribute('data-unix')) {
        const d = new Date(parseInt(parent.getAttribute('data-unix')));
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
    // .countdown 元素：倒计时单位翻译
    // "1d : 6h : 20m : 44s" → "1天 : 6时 : 20分 : 44秒"
    if (parent.classList.contains('countdown')) {
        return text
            .replace(/(\d+)d\b/gi, '$1天')
            .replace(/(\d+)h\b/gi, '$1时')
            .replace(/(\d+)m\b/gi, '$1分')
            .replace(/(\d+)s\b/gi, '$1秒');
    }
    // .time 元素（HH:mm 如 "18:30"）：纯数字，已被 replaceText 中的
    // /^[0-9\s%:\-\/\.\,\+\(\)\#\|]+$/ 过滤跳过，无需处理
    // .event 元素（赛事名）：不在词典中，保持原文，无需处理
}

        // ── 阶段 2: SVG / tspan 月份 ──
        const isSvgText = node.parentNode?.nodeName === 'text' && node.parentNode.closest?.('svg');
        if (isSvgText) {
            if (monthAbbrU[cut]) return monthAbbrU[cut];
            const mergeMatch = raw.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d+)$/i);
            if (mergeMatch) { const mon = monthAbbrU[mergeMatch[1].toUpperCase()]; if (mon) return mon + mergeMatch[2] + '日'; }
        }

        if (node.parentNode?.nodeName === "tspan") {
            const d = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(2[0-9])\b/gi;
            if (d.test(text)) text = text.replace(d, (m, mon, y) => `${y}年${monthNum[mon.toLowerCase()]}月`);
            const r17 = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i;
            if (r17.test(text) && node.parentNode?.parentNode?.nodeName === "text")
                text = `${monthNum[text.toLowerCase()]}月`;
        }

        // data-unix 时间元素
        if (parent?.hasAttribute?.("data-unix") && parent?.hasAttribute?.("data-time-format")) {
            const fmt = parent.getAttribute("data-time-format");
            const sr = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})$/i;
            if (sr.test(text)) text = text.replace(sr, (m, mon, day) => `${monthNum[mon.toLowerCase()]}月${day}日`);
            const dr = /^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i;
            if (fmt === "d MMM" && dr.test(text)) text = text.replace(dr, (m, day, mon) => `${monthNum[mon.toLowerCase()]}月${day}日`);
            if (fmt === "EEE") { const wm = { "MON":"周一","TUE":"周二","WED":"周三","THU":"周四","FRI":"周五","SAT":"周六","SUN":"周日" }; if (wm[cut]) text = wm[cut]; }
        }

        // 日历日期范围选择器
        const normalTop = parent?.closest?.('.normal-top');
        if (normalTop) {
            if (parent?.nodeName === 'SPAN' && /^Selected:\s*$/i.test(raw)) text = text.replace(/selected:\s*/i, '已选: ');
        }

        const dateRangeContainer = parent?.closest?.('.default-top');
        if (dateRangeContainer) {
            if (parent?.nodeName === 'DIV' && parent.classList.contains('default-top') && /please select a date range/i.test(text))
                return '请选择一个日期范围';
            if (parent?.nodeName === 'INPUT' && parent.classList.contains('apply-btn') && parent.value === 'Close') {
                parent.value = '关闭'; translatedNodes.add(node); return null;
            }
        }

        // ── 阶段 3: 动态标题匹配 ──
        const isH2StdHeadline = isPtag('H2') && hasPcls('standard-headline');
        const isSpanStdHeadline = isPtag('SPAN') && hasPcls('standard-headline');

        if (isH2StdHeadline && (cut === "ROSTER TIMELINE" || cut === "TRANSFERS" || cut === "PLAYERS")) {
            const spanNode = parent.querySelector("span.gtSmartphone-only");
            if (spanNode) {
                let teamName = "";
                const content = spanNode.textContent;
                if (cut === "ROSTER TIMELINE" && content.includes("of ")) teamName = content.replace(/of\s+/i, "").trim();
                else if (cut === "TRANSFERS" && content.includes("for ")) teamName = content.replace(/for\s+/i, "").trim();
                else if (cut === "PLAYERS" && content.includes("of ")) teamName = content.replace(/of\s+/i, "").trim();
                if (teamName) {
                    const suffix = cut === "ROSTER TIMELINE" ? "的阵容时间线" : cut === "TRANSFERS" ? "的转会记录" : "的队员";
                    parent.innerHTML = `${teamName} ${suffix}`;
                    translatedNodes.add(node); return null;
                }
            }
        }

        // [BUG FIX] standard-headline 专属模式
        let m;
        if (isH2StdHeadline || isSpanStdHeadline ||
            (isPtag('H3') && hasPcls('standard-headline') && hasPcls('subTab-newsYear'))) {
            for (const pat of headlineTitlePatterns) {
                m = raw.match(pat.re);
                if (m) return pat.fn(m);
            }
            if (/^All\s+fast\s+multi-kills$/i.test(raw)) return '全部快杀多杀';
            if (/^All\s+multi-kills$/i.test(raw)) return '全部多杀';
            if ((m = raw.match(/^(\d+)x\s+(fast\s+)?multi-kills$/i))) return m[2] ? `${m[1]}x 快杀多杀` : `${m[1]}x 多杀`;
        }

        // [BUG FIX] 排行榜标题 — 用 closest 而非直接 parent，覆盖子元素情况
        const stdHeadlineAncestor = parent?.closest?.('.standard-headline');
        if (stdHeadlineAncestor?.nodeName === 'SPAN' && leaderboardMap[raw]) return leaderboardMap[raw];

        if (parent?.closest('.standard-headline') && raw === 'Forums') return '论坛';

        if (isH2StdHeadline) {
            const fplMap = {
                'Historic FPL CS2 Europe placements': 'FPL CS2 欧洲历史排名',
                'Historic FPL CSGO Europe placements': 'FPL CSGO 欧洲历史排名',
                'Historic FPL CS2 North America placements': 'FPL CS2 北美历史排名',
                'Historic FPL CSGO North America placements': 'FPL CSGO 北美历史排名',
                'Historic FPL CSGO South America placements': 'FPL CSGO 南美历史排名'
            };
            if (fplMap[raw]) return fplMap[raw];
        }

        if (hasPcls('subtext') && parent?.parentElement?.classList.contains('standard-headline')) {
            const st = raw.toLowerCase();
            if (st.includes('last 12 months') || st.includes('top 20 teams')) return ' (最近十二个月，仅前20名战队)';
        }

        // ── 排名导航 ──
        const navContainer = parent?.closest?.('.nav');
        if (navContainer) {
            const navItem = parent?.closest?.('.navItem');
            if (navItem && !navItem.hasAttribute('data-nav-translated')) {
                navItem.setAttribute('data-nav-translated', 'true');
                const ft = navItem.textContent.replace(/\s+/g, ' ').trim();
                const navMap = { "World ranking": "世界排名", "Regional rankings": "区域排名", "Valve ranking": "V社排名", "Regional Valve ranking": "区域V社排名", "VRS Invites": "VRS 邀请" };
                const cn = navMap[ft];
                if (cn) {
                    const imgs = navItem.querySelectorAll('img');
                    navItem.innerHTML = '';
                    imgs.forEach(img => navItem.appendChild(img));
                    navItem.appendChild(document.createTextNode(cn));
                    translatedNodes.add(node); return null;
                }
            }
        }

        // ── Teams/Team 智能翻译 ──
        if (parent) {
            const pTag = parent.nodeName.toLowerCase();
            if (pTag === "th" && parent.classList.contains("teamsNumber")) {
                const nextTd = parent.parentElement.nextElementSibling?.querySelector("td");
                text = (nextTd && /^\d+$/.test(nextTd.textContent.trim())) ? "战队数" : "战队";
            } else if (cut === "TEAMS" && pTag === "span" && parent.parentElement &&
                       (parent.parentElement.classList.contains("sidebar-single-line-item") || parent.parentElement.classList.contains("standard-headline"))) {
                text = "战队";
            } else if (cut === "TEAM" && (pTag === "div" || pTag === "th" || pTag === "span") &&
                       (parent.classList.contains("match-filter-popup-block-header") || parent.classList.contains("th") ||
                        parent.classList.contains("smartphone-only") || parent.classList.contains("format-header") ||
                        parent.classList.contains("description"))) {
                text = "战队";
            } else if (cut === "TEAMS" && (pTag === "td" || pTag === "th" || pTag === "div") &&
                       (parent.classList.contains("col-desc") || parent.classList.contains("format-header") ||
                        parent.classList.contains("description"))) {
                text = "战队";
            } else if (cut.startsWith("TEAMS") && pTag === "div" && parent.classList.contains("matchSidebarInfo")) {
                const match = raw.match(/^Teams\s*\((\d+)\)$/i);
                if (match) text = `战队 (${match[1]})`;
            }
        }

        if (parent?.closest?.(".navpopup") && parent.nodeName === "SPAN") {
            const sm = { "DAY": "白天", "NIGHT": "夜间", "AUTO": "跟随系统", "YES": "是", "NO": "否", "ON": "开", "OFF": "关" };
            if (sm[cut]) text = sm[cut];
        }
        if (parent?.nodeName === "BUTTON" && parent.classList.contains("back-button") && cut === "BACK") text = "返回";

        // ── stats-rows ──
        const statsRowsContainer = parent?.closest?.('.stats-rows');
        if (statsRowsContainer && parent?.nodeName === 'SPAN' && parent.parentElement?.classList.contains('stats-row')) {
            if (statsRowsMap[raw]) return statsRowsMap[raw];
        }

        // ── summary 多杀 ──
        if (parent?.classList.contains('description') && parent.closest('.summary-box.standard-box')) {
            const lowTxt = raw.toLowerCase();
            if (lowTxt === 'all multi-kills') return '全部多杀';
            if (lowTxt === 'all fast multi-kills') return '全部快杀多杀';
            const mMulti = raw.match(/^(\d+)x\s+(fast\s+)?multi-(kills|击杀)$/i);
            if (mMulti) return mMulti[2] ? `${mMulti[1]}x 快杀多杀` : `${mMulti[1]}x 多杀`;
        }

        // ── 特殊元素处理 ──
        const pboxTh = parent?.closest?.('th.playersBox-player, th.playersBox-time, th.playersBox-maps, th.playersBox-trophies, th.playersBox-winrate, th.playersBox-status');
        if (pboxTh && !pboxTh.hasAttribute('data-pbox-done')) {
            pboxTh.setAttribute('data-pbox-done', 'true');
            const pbMap = { 'playersBox-player': '教练', 'playersBox-time': '在队时间', 'playersBox-maps': '执教场次', 'playersBox-trophies': '奖杯', 'playersBox-winrate': '胜率', 'playersBox-status': '状态' };
            for (const [cls, cn] of Object.entries(pbMap)) { if (pboxTh.classList.contains(cls)) { pboxTh.textContent = cn; break; } }
            translatedNodes.add(node); return null;
        }

        const eDiv = parent;
        if (eDiv && (eDiv.id === "for-you-empty-div" || eDiv.parentElement?.id === "for-you-empty-div")) {
            const c = eDiv.id === "for-you-empty-div" ? eDiv : eDiv.parentElement;
            if (!c.hasAttribute("data-translated")) {
                c.innerHTML = "<b>暂无推荐比赛。</b><br>点击比赛旁的 <i class=\"fa fa-thumb-tack\"></i> 图标即可置顶以便快速查看，或稍后再来检查";
                c.setAttribute("data-translated", "true"); return null;
            }
        }

        if (parent?.classList.contains("starred-matches-title") && cut.startsWith("MATCHES FOR YOU"))
            return text.replace(/Matches for you/i, "为你推荐的比赛");
        const pStar = parent;
        if (pStar && (pStar.hasAttribute("data-tooltip-id") || pStar.parentElement?.hasAttribute("data-tooltip-id")) &&
            (pStar.closest(".starred-matches-title, .starred-matches-description") || /WHY|SEEING|THIS\?/i.test(cut))) {
            const tt = pStar.hasAttribute("data-tooltip-id") ? pStar : pStar.parentElement;
            if (!tt.hasAttribute("data-translated")) { tt.innerHTML = "为什么我会看到这些比赛？"; tt.setAttribute("data-translated", "true"); }
            return null;
        }
        if (pStar?.classList.contains("starred-matches-description-tooltip") && cut.startsWith("FOR YOU ARE A COLLECTION"))
            text = "“为你推荐”汇集了即将开始、您手动置顶、包含您喜爱的选手或战队，以及与您当前地区相关的比赛。";

        // ── 转会动词 ──
        if (text.includes("parts ways with")) {
            text = text.replace(/parts\s+ways\s+with/i, " 与 ");
            appendSuffix(node, " 分道扬镳");
        }
        if (text.includes("is benched on")) {
            text = text.replace(/is\s+benched\s+on/i, " 在 ");
            appendSuffix(node, " 沦为替补");
        }
        if (text.includes("is moved to the active roster on")) {
            text = text.replace(/is\s+moved\s+to\s+the\s+active\s+roster\s+on/i, " 被移至 ");
            appendSuffix(node, " 主力阵容");
        }
        if (text.includes("is moved to substitute on")) {
            text = text.replace(/is\s+moved\s+to\s+substitute\s+on/i, " 被移至 ");
            appendSuffix(node, " 替补阵容");
        }
        if (text.trim().toLowerCase() === "to" && parent?.closest?.(".transfer-movement")) text = " 转至 ";
        if (parent?.closest?.('.transfer-movement')) {
            if (/^as\s+coach$/i.test(raw)) text = text.replace(/\s*as\s+coach\s*/i, " (教练)");
            if (/^\(benched\)$/i.test(raw)) text = text.replace(/\s*\(benched\)\s*/i, " (替补)");
        }

        if (raw.toLowerCase() === "team wins" || raw.toLowerCase() === "team loses") {
            text = raw.toLowerCase() === "team wins" ? "战队获胜" : "战队落败";
            if (node.previousSibling && node.previousSibling.textContent.trim().toLowerCase() === "if")
                node.previousSibling.textContent = "若";
        }

        // veto-box
        const vetoBox = parent?.closest?.('.veto-box');
        if (vetoBox) {
            if (/^(\d+)\.\s+(.+)\s+removed\s+(.+)$/i.test(raw)) return raw.replace(/(\d+)\.\s+(.+)\s+removed\s+(.+)/i, '$1. $2 禁用 $3');
            if (/^(\d+)\.\s+(.+)\s+picked\s+(.+)$/i.test(raw)) return raw.replace(/(\d+)\.\s+(.+)\s+picked\s+(.+)/i, '$1. $2 选择 $3');
            if (/^(\d+)\.\s+(.+)\s+was left over$/i.test(raw)) return raw.replace(/(\d+)\.\s+(.+)\s+was left over/i, '$1. $2 剩余');
        }

        const mwParent = parent?.closest?.('.multiple-winners');
        if (mwParent && !mwParent.hasAttribute('data-mw-translated')) {
            mwParent.setAttribute('data-mw-translated', 'true'); mwParent.innerHTML = '多位胜者'; return null;
        }

        const watchNowDiv = parent?.closest?.('.currently-playing-watch');
        if (watchNowDiv && !watchNowDiv.hasAttribute('data-watch-translated')) {
            watchNowDiv.setAttribute('data-watch-translated', 'true'); watchNowDiv.innerHTML = '立即观看'; return null;
        }

        const tipParent = parent?.closest?.(".tooltip-box.tooltip-attributes");
        if (tipParent && !tipParent.hasAttribute("data-tooltip-done") && !tipParent.hasAttribute("data-tooltip-fastdone")) {
            const fullText = tipParent.textContent.trim();
            const roleMap = { "Firepower:": "火力:", "Entrying:": "突破手:", "Trading:": "补枪手:", "Opening:": "开局突破:", "Clutching:": "残局大师:", "Sniping:": "狙击手:", "Utility:": "道具手:" };
            for (const [en, cn] of Object.entries(roleMap)) {
                if (fullText.startsWith(en)) {
                    tipParent.setAttribute("data-tooltip-done", "true");
                    tipParent.innerHTML = tipParent.innerHTML.replace(new RegExp(escapeRegExp(en), 'i'), cn);
                    return null;
                }
            }
        }

        if (tipParent && !tipParent.hasAttribute('data-fasttooltip-done') && /^Fast multi-kill:/i.test(tipParent.textContent.trim())) {
            tipParent.setAttribute('data-fasttooltip-done', 'true');
            tipParent.innerHTML = '<b>快杀多杀：</b>选手在每次击杀间隔小于5秒时获得的多杀。同一回合内可能触发多次快杀。';
            return null;
        }

        // Top20 表头
        if (parent?.nodeName === 'TH') {
            const tr = parent.parentElement;
            if (tr?.querySelector('th.top20-th-position')) {
                if (raw === 'Player') return '选手';
                if (raw === 'Total') return '总计';
                const tm = raw.match(/^(\d+)(?:-(\d+))?(st|nd|rd|th)$/i);
                if (tm) return tm[2] ? `第${tm[1]}-${tm[2]}名` : `第${tm[1]}名`;
            }
            if (tr?.querySelector('th.top20-th-teams') || tr?.querySelector('th.top20-th-placement')) {
                if (raw === 'Player') return '选手';
                if (raw === 'Team(s)') return '战队';
                if (raw === 'Placement') return '名次';
            }
        }

        if (parent?.classList?.contains('primary-role') && raw.startsWith('Inductee '))
            return raw.replace('Inductee ', '入选年份 ');

        if (parent?.nodeName === 'SPAN' && parent.querySelector('a[href*="/team/"]') && raw === '(coach)') return '(执教)';

        // statsPlayer 表头
        const myPlayerTh = parent?.closest?.('th') || parent?.closest?.('td[role="columnheader"]');
        if (myPlayerTh && Array.from(myPlayerTh.classList).some(c => c.startsWith('statsPlayer'))) {
            const hMap = { "Date": "日期", "Player team": "选手队伍", "Opponent": "对手", "T1": "T1", "T2": "T2", "Map": "地图", "K - D": "K - D", "+/-": "+/-", "#": "#", "Event": "赛事", "Team": "战队", "Maps": "地图", "KPR - DPR": "KPR - DPR", "Period": "时期", "All": "全部", "Online": "线上", "LAN": "线下", "Majors": "Major", "Team 1": "战队1", "Team 2": "战队2", "Status": "状态", "Type": "类型", "Round": "回合" };
            if (hMap[raw]) return hMap[raw];
        }

        // SVG 武器名
        const svgText = parent?.closest?.('text');
        if (svgText && svgText.closest('svg') && svgText.childElementCount > 1) {
            const ft = svgText.textContent.replace(/\s+/g, '').toLowerCase();
            const wm = { "usp_silencer": "USP 消音版", "m4a1_silencer": "M4A1 消音版" };
            if (wm[ft]) { svgText.textContent = wm[ft]; return null; }
        }

        if (parent?.classList?.contains('stats-window') && raw === '(Big Events)') return '(大型赛事)';

        if (parent?.matches?.('span.region.region-eu, span.region.region-america, span.region.region-asia')) {
            if (regionsCode[cut]) return regionsCode[cut];
        }

        if (parent?.closest?.('.motm-countdown') && /^Vote ends in:\s*$/i.test(node.textContent.replace(/\u00a0/g, ' ').trim()))
            return '投票结束于：';

        // 阵容对比
        const compareRow = parent?.closest?.('tr.statRow');
        if (compareRow) {
            const centerTd = compareRow.querySelector('.lineups-compare-middle-table-center-stat');
            if (centerTd?.contains(node)) {
                const dm = { "KAST": "KAST", "Multi-kill": "多杀", "Round Swing": "回合影响力" };
                if (dm[raw]) return dm[raw];
                if (parent?.nodeName === 'SPAN') {
                    const sm = { "Kills per round": "每回合击杀", "KPR": "KPR", "Deaths per round": "每回合死亡", "DPR": "DPR", "Average damage per round": "每回合平均伤害", "ADR": "ADR" };
                    if (sm[raw]) return sm[raw];
                }
            }
        }

        // st- 表头
        const stTh = parent?.closest?.('th');
        if (stTh && Array.from(stTh.classList).some(c => c.startsWith('st-'))) {
            if (!stTh.hasAttribute('data-st-title')) {
                stTh.setAttribute('data-st-title', 'true');
                const tm = { "Opening kills:deaths": "首杀:首死", "Opening eco-adjusted kills:deaths": "经济调整首杀:首死", "Rounds with two or more kills": "两杀及以上回合", "Percentage of rounds in which the player either had a kill, assist, survived or was traded": "击杀/助攻/存活/被补回合百分比", "Percentage of rounds in which the player either had a kill, assist, survived or was traded. Adjusted to compensate for economy.": "击杀/助攻/存活/被补回合百分比（经济调整）", "Kills": "击杀数", "Eco-adjusted kills": "经济调整击杀数", "Assists": "助攻数", "Death": "阵亡数", "Eco-adjusted deaths": "经济调整阵亡数", "Average damage per round": "场均伤害", "Average damage per round. Adjusted to compensate for economy.": "场均伤害（经济调整）", "How much, on average, a player changed their team's chances of winning a round based on team economy, side, kills, deaths, damage, trading, and flash assists": "选手场均影响队伍胜率程度" };
                if (stTh.hasAttribute('title')) { const ot = stTh.getAttribute('title').replace(/&amp;/g, '&').trim(); if (tm[ot]) stTh.setAttribute('title', tm[ot]); }
                const stm = { "Headshots": "爆头数", "Flash assists": "闪光助攻数", "Traded": "被补枪数", "Eco-adjusted traded deaths": "经济调整补枪阵亡数" };
                stTh.querySelectorAll('span[title]').forEach(sp => { const sv = sp.getAttribute('title').replace(/&amp;/g, '&').trim(); if (stm[sv]) sp.setAttribute('title', stm[sv]); });
            }
            const thTxtMap = { "MKs": "多杀数", "KAST": "KAST", "eKAST": "eKAST", "1vsX": "1vX", "K": "K", "eK": "eK", "A": "A", "D": "D", "eD": "eD", "ADR": "ADR", "eADR": "eADR", "Swing": "影响力" };
            if (parent === stTh && thTxtMap[raw] !== undefined) return thTxtMap[raw];
            if (parent?.nodeName === 'SPAN' && stTh.contains(parent)) {
                const sTxtMap = { " (hs)": " (爆头)", " (f)": " (闪助)", " (t)": " (补枪)" };
                if (sTxtMap[raw] !== undefined) return sTxtMap[raw];
            }
        }

        if (cut === "SEASON") {
            if (parent?.nodeName === "A" && (parent.getAttribute("href") || "").includes("de_season")) return "四季公司";
            if (parent?.nodeName === "text" && (parent.closest(".highcharts-container, .stats-section, #chartsContainer") || parent.getAttribute("fill"))) return "四季公司";
        }

        if (/^\s*ALL\s*$/i.test(text)) text = "全部";
        if (/^ALL\s*\(\d+\)$/i.test(text)) return "全部";

        // ── 全局正则管道 [BUG FIX: 直接使用 text.replace(gr.re, gr.replacer)] ──
        for (const gr of globalRegexPipeline) {
            text = text.replace(gr.re, gr.replacer);
        }

        if (!/^(Past|Last|Next|Previous)\s/i.test(text)) {
            const tsr = /\b(\d+)\s+(second|seconds|minute|minutes|hour|hours|day|days|week|weeks|year|years)\b/i;
            if (tsr.test(text)) {
                const um = { second:'秒',seconds:'秒',minute:'分钟',minutes:'分钟',hour:'小时',hours:'小时',day:'天',days:'天',week:'周',weeks:'周',year:'年',years:'年' };
                text = text.replace(tsr, (m, n, u) => um[u.toLowerCase()] ? `${n} ${um[u.toLowerCase()]}` : m);
            }
        }

        const acceptedAnswer = parent?.closest?.('[itemprop="acceptedAnswer"]');
        if (acceptedAnswer) { m = raw.match(/^(\d+)\s+years?$/i); if (m) return `${m[1]}岁`; }
        const ageBox = parent?.closest?.('.player-summary-stat-box-left-player-age');
        if (ageBox) { m = raw.match(/^(\d+)\s+years?$/i); if (m) return `${m[1]}岁`; }

        for (const rule of config.dynamicRules) { if (rule.expr.test(text)) { text = text.replace(rule.expr, rule.fn); break; } }

        if ((window.location.pathname.includes('/ranking') || window.location.pathname.includes('/valve-ranking')) &&
            parent?.closest?.('.sidebar-box') && parent?.classList.contains('sidebar-single-line-item') && monthTitle[raw])
            return monthTitle[raw];

        // ── 全局动态模式匹配（不限上下文） ──
        for (const pat of globalTitlePatterns) {
            m = raw.match(pat.re);
            if (m) return pat.fn(m);
        }

        if (cut.startsWith("STATS FROM ENTIRE TEAM PERIOD")) return "统计包含该阵容时期的全队数据 *";

        return text;
    }

    // =========================================================================
    // 10. 文本节点替换
    // =========================================================================
    function replaceText(node) {
        if (node.parentElement?.classList?.contains('match-event')) return;
        if (translatedNodes.has(node)) return;
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim() || !node.parentElement) return;
        if (config.skipTags.includes(node.parentElement.nodeName)) return;
        if (config.skipClasses.some(cls => node.parentElement.classList.contains(cls))) return;
        if (config.skipSelectors.some(sel => node.parentElement.closest(sel))) return;

        const eventDateTd = node.parentElement?.closest("td.eventdate");
        if (eventDateTd && !eventDateTd.hasAttribute("data-daterange-translated")) {
            eventDateTd.setAttribute("data-daterange-translated", "true");
            const spans = eventDateTd.querySelectorAll("span[data-unix]");
            if (spans.length >= 2) {
                const d1 = new Date(parseInt(spans[0].getAttribute("data-unix")));
                const d2 = new Date(parseInt(spans[1].getAttribute("data-unix")));
                const fmt = (y, m, d) => `${y}年${m}月${d}日`;
                const y1=d1.getFullYear(), m1=d1.getMonth()+1, day1=d1.getDate();
                const y2=d2.getFullYear(), m2=d2.getMonth()+1, day2=d2.getDate();
                eventDateTd.textContent = (y1===y2 && m1===m2) ? `${fmt(y1,m1,day1)} - ${day2}日`
                    : (y1===y2) ? `${fmt(y1,m1,day1)} - ${m2}月${day2}日`
                    : `${fmt(y1,m1,day1)} - ${fmt(y2,m2,day2)}`;
                return;
            }
        }

        let text = node.textContent.replace(/[\s\xa0]+/g, " ").trim();

        if (node.parentElement?.classList.contains("date") && node.parentElement.hasAttribute("data-unix")) {
            const dtr = /(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}:\d{2})/;
            if (dtr.test(text)) {
                text = text.replace(dtr, (m, d, mth, y, time) => `${y}-${mth}-${d} ${time}`);
                if (text !== node.textContent.replace(/[\s\xa0]+/g, " ").trim()) node.textContent = text;
                translatedNodes.add(node); return;
            }
        }

        if (!text || text.length < 1 || text.length > 800) return;
        if (/^[0-9\s%:\-\/\.\,\+\(\)\#\|]+$/.test(text)) return;
        if (/[\u4e00-\u9fa5]/.test(text)) { translatedNodes.add(node); return; }

        const originalText = text;
        let processedText = applyDynamicRules(text, node);
        if (processedText === null || processedText === undefined) { translatedNodes.add(node); return; }
        text = processedText;

        let placeholders = [];
        if (excludedNamesRegex) {
            text = text.replace(excludedNamesRegex, (match) => {
                const ph = `__EXCL_${placeholders.length}__`;
                placeholders.push({ ph, match }); return ph;
            });
        }
        for (const item of compiledDict) text = text.replace(item.regex, item.value);
        if (placeholders.length) placeholders.forEach(({ ph, match }) => { text = text.split(ph).join(match); });

        if (text !== originalText) node.textContent = text;
        translatedNodes.add(node);
    }

    // =========================================================================
    // 11. 属性替换
    // =========================================================================
    function replaceElementAttributes(element) {
        if (!element) return;

        if (element.hasAttribute("placeholder")) {
            const ph = element.getAttribute("placeholder").trim();
            const phMap = {
                "Search...": "搜索...", "Search team...": "搜索战队...",
                "Search player": "搜索选手", "Event search": "搜索赛事",
                "Player search": "搜索选手", "Team search": "搜索战队",
                "Add to context..": "加入对比..", "Country search": "国家搜索",
                "Username": "用户名", "Password": "密码",
                "Username or email": "用户名或邮箱",
                "Start date": "开始日期", "End date": "结束日期"
            };
            if (phMap[ph]) { element.setAttribute("placeholder", phMap[ph]); return; }
        }

        if (element.tagName === 'TD' && element.closest('tr.header-row')) {
            const title = element.getAttribute('title');
            const titleMap = {
                "Ratio between kills and deaths in the match.": "比赛中击杀与阵亡的比率。",
                "Ratio between kills and deaths in the match. Adjusted to compensate for economy.": "比赛中击杀与阵亡的比率（经济调整）。",
                "How much, on average, a player changed their team's chances of winning a round based on team economy, side, kills, deaths, damage, trading, and flash assists": "选手场均影响队伍胜率程度，基于经济、阵营、击杀、阵亡、伤害、补枪和闪光助攻。",
                "Average damage per round.": "场均伤害。",
                "Average damage per round. Adjusted to compensate for economy.": "场均伤害（经济调整）。",
                "Percentage of rounds in which the player either had a kill, assist, survived or was traded.": "选手获得击杀、助攻、存活或被补的回合百分比。",
                "Percentage of rounds in which the player either had a kill, assist, survived or was traded. Adjusted to compensate for economy.": "选手获得击杀、助攻、存活或被补的回合百分比（经济调整）。",
                "The rating tells us if the player put up above or below average numbers, with 1.00 being the average.": "评分反映选手是否高于或低于平均水平，1.00为平均值。"
            };
            if (title && titleMap[title]) element.setAttribute('title', titleMap[title]);
        }

        if (element.tagName === 'TD' && element.classList.contains('statCell') && !element.hasAttribute('data-st-title')) {
            const clsList = Array.from(element.classList);
            const targetClass = clsList.find(c =>
                c.startsWith('pro-') || ['weaponCell','hpCell','armorCell','moneyCell','killCell','assistCell','assistFlashCell','deathCell','adrCell'].includes(c));
            if (targetClass) {
                const tt = {
                    'pro-opDuels': '首杀对阵详情', 'pro-1plusKill': '两杀及以上回合',
                    'pro-kast': '击杀/助攻/存活/被补回合百分比', 'pro-1vsX': '残局获胜',
                    'weaponCell': '购买武器', 'hpCell': '生命值', 'armorCell': '护甲',
                    'moneyCell': '金钱', 'killCell': '击杀数 (爆头数)', 'assistCell': '助攻数',
                    'assistFlashCell': '助攻数 (闪光助攻数)', 'deathCell': '阵亡数 (被补枪数)',
                    'adrCell': '场均伤害'
                };
                if (tt[targetClass]) { element.setAttribute('data-st-title', 'true'); element.title = tt[targetClass]; }
            }
        }

        if (element.tagName === 'TH' && element.closest('tr.stats-table-row') && element.hasAttribute('title')) {
            const titleMap = {
                "Round win %": "回合胜率",
                "Percentage of rounds where the team won the opening duel": "首杀胜率百分比",
                "Multikills per round by the team's players": "选手场均多杀",
                "Round win % after getting the opening kill": "首杀后回合胜率",
                "Round win % after giving the opening death": "首死后回合胜率",
                "Percentage of team's deaths that were traded": "队员补枪率",
                "Damage per round with HE grenades, Molotovs & Incendiaries": "高爆、燃烧弹均伤",
                "Flash assists / round (A flash assist happens when an opponent blinded by this player was killed while affected by the flash)": "闪光助攻/局",
                "Total number of pistol rounds won and lost": "手枪局胜负数",
                "Percentage of pistol rounds won": "手枪局胜率百分比",
                "Percentage of 2nd round wins after winning the pistol round": "手枪局胜利后第2局胜率",
                "Percentage of 2nd round wins after losing the pistol round": "手枪局失败后第2局胜率"
            };
            const ot = element.getAttribute('title').replace(/&amp;/g, '&').trim();
            if (titleMap[ot]) element.setAttribute('title', titleMap[ot]);
        }

        if (element.tagName === 'TH' && element.classList.contains('table-header') && element.hasAttribute('title')) {
            const titleMap = { "Matches": "比赛次数", "Rounds won": "胜回合", "Rounds lost": "负回合", "Round difference": "回合差", "Map record": "地图记录", "Matches won": "胜场", "Matches tie": "平局", "Matches lost": "负场", "Points": "积分", "Expand matches": "展开比赛" };
            const ot = element.getAttribute('title').trim();
            if (titleMap[ot]) element.setAttribute('title', titleMap[ot]);
        }
    }

    // =========================================================================
    // 12. DOM 遍历与监听
    // =========================================================================
    function walkDOM(target) {
        if (!target || !target.isConnected) return;
        if (target.nodeType === Node.TEXT_NODE) {
            try { replaceText(target); } catch (e) { /* console.warn('[HLTV翻译] 节点处理错误:', e); */ }
            return;
        }
        if (target.nodeType !== Node.ELEMENT_NODE) return;
        try { replaceElementAttributes(target); } catch (e) { /* ignore */ }
        const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
        let cur;
        while ((cur = walker.nextNode())) {
            try {
                if (cur.nodeType === Node.TEXT_NODE) replaceText(cur);
                else replaceElementAttributes(cur);
            } catch (e) {
                // console.warn('[HLTV翻译] 节点处理错误:', e);
            }
        }
    }

    function flashTranslateHeaders() {
        const qf = document.querySelector(".matches-quick-filters");
        const h = document.querySelector(".upcoming-headline, .headline-flex");
        const tl = document.querySelector(".player-timeline-year-labels");
        if (qf) walkDOM(qf);
        if (h) walkDOM(h);
        if (tl) walkDOM(tl);
    }

    flashTranslateHeaders();
    setTimeout(() => walkDOM(document.body), 10);

    let debounceTimer = null;
    const observer = new MutationObserver((mutations) => {
        let needFlash = false;
        const nodesToProcess = new Set();
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    nodesToProcess.add(node);
                    if (node.classList.contains("headline-flex") || node.classList.contains("player-timeline-year-labels") ||
                        node.querySelector?.(".matches-quick-filters, .player-timeline-year-labels")) needFlash = true;
                } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                    nodesToProcess.add(node.parentElement);
                }
            }
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
                const target = mutation.target;
                const roundEl = target.classList.contains("round") ? target : target.closest?.(".round");
                if (roundEl) {
                    const header = roundEl.querySelector(".round-header");
                    if (header) { clearTranslatedInElement(header); walkDOM(header); }
                }
            }
            if (mutation.type === "attributes" && mutation.attributeName === "title" && mutation.target.nodeType === Node.ELEMENT_NODE) {
                nodesToProcess.add(mutation.target);
            }
        }
        nodesToProcess.forEach(node => walkDOM(node));
        if (needFlash) flashTranslateHeaders();
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => walkDOM(document.body), 600);
    });

    observer.observe(document.body, {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ["title", "class"]
    });
})();
