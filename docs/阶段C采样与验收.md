# 阶段 C：0.1.13 采样与验证

日期：2026-10-09（北京时间）。基线：冻结 0.1.12。代码与本地回归完成；Stats 正常实页 DOM 与原站交互的门槛尚未全部通过，不将版本构建等同于阶段 C 全部验收。

## 样本与出处

| 样本 | 本轮读取 | 保留的固定槽位 | 证据边界 |
|---|---|---|---|
| `/matches/2398753/falcons-vs-spirit-esl-pro-league-season-24` | 正常未开始比赛 | 倒计时、直播栏目、阵容、地图、VRS 说明 | 本次不提交预测/投票；不把未知 VRS 说明纳入 D |
| `/matches/2398752/furia-vs-mouz-esl-pro-league-season-24` | 正常进行中比赛 | 阵容对比、直播与地图区域 | 当时没有完整赛后比分表，不补造实时日志样本 |
| `/matches/2398751/vitality-vs-parivision-esl-pro-league-season-24` | 正常已结束比赛 | Rating 3.0 双列、经济调整、阵营、MVP 得票、详细数据入口 | 独立内置浏览器初始为英文，完整构建产物临时运行；无管理器安装 |
| `/matches/2398984/gamerlegion-vs-sinners-1win-private-club-season-2-closed-qualifier` | 正常已结束比赛 | 最佳选手、空 `.subtext` | 空字段保持为空，不添加自创状态 |
| `/matches` | 推荐栏目、隐藏说明/空状态正常读取 | `.starred-matches-description-tooltip`、`#for-you-empty-div > b` 与旁边 Text/icon | 当时列表有推荐比赛；空状态结构真实存在但并未清除用户置顶使其可见 |
| `/stats/teams` | 网页读取工具取得公开导航/表格文本；Chrome/内置浏览器显示站点安全检查 | 战队/地图/K-D Diff/Rating 版本、FTU/手枪局入口及筛选名称 | [公开页面](https://www.hltv.org/stats/teams) 仅可核对文案，不能验证 class/原站事件 |
| `/stats/teams/ftu`、`/stats/teams/pistols` | 入口由公开导航确认，正文抓取未成功 | 首杀/多杀/道具/手枪局表头与完整解释沿用旧版结构参考 | 不登记为本次新实页 DOM；不声明实页排序/筛选已通过 |
| `/stats/matches/131783/vitality-vs-parivision`、选手排行榜 | 比赛/导航中取得真实路由，浏览器显示安全检查 | 既有 Stats 结构、旧版专属表头和长 tooltip | 不绕过站点检查；`.st-*`、`.statCell` 特殊布局仍待采样 |

Chrome 可见样本有既存汉化；因此比赛详细表头、控件、投票结果另在没有已装脚本的内置浏览器核对。夹具中的既有中文标题按已知源文还原，不宣称导出的是原始 HTTP。

## 实现与测试对应

| 迁移项 | 本次实现 | 回归 |
|---|---|---|
| M08 | 推荐长说明、空状态三段 Text；保留图钉图标与 tooltip 容器 | 实页最小结构 `match-recommendation.html`，单元/双视口构建回归 |
| M12 | 当前赛后 `.header-row > td` 普通/经济调整完整解释、控件、Swing；Rating/3.0 和数值缩写保持 | 实页最小结构 `match-detail.html`，节点/实体/数值/属性恢复与原监听器回归 |
| M13 | `Top player in match`、完整百分比模板、地图数；已知独立倒计时 Text 模板 | 百分比为实页；倒计时是旧版参考的合成状态，嵌套计时节点保持 |
| M22/M24 | 共用统计表头、嵌套菜单入口、表头 title、手枪局/首杀/道具完整解释、原有分页数量 | `statistics-specialty.html` 是明确标注的合成夹具；交互监听器由测试建立 |
| M26 | 嵌套快速多杀链接与 b 标签，完整 5 秒说明；支持 body 下生成的 `.tooltip-attributes` | 容器/加粗/Text 保持、动态插入、正文保护和模块关闭恢复；body 挂载属于合成故障序列 |

短缩写继续留在紧凑比赛表头，通过中文 title 提供解释；所有 `per round` 均按每回合翻译，不沿用旧版“场均”。未知完整句式和 FTU 缩写保持原文。没有全局子串管道或生产代码 innerHTML 重建。

## 执行结果

- `npm run check`：类型检查、14 文件/72 项单元与 DOM 测试、0.1.13 构建、76 项桌面/窄屏 Chromium 回归通过。日志：[完整检查](../artifacts/qa/check-0.1.13.log)。
- 基线对照后再次执行最终产物的八项阶段 C 双视口用例，全通过；[最终针对性回归](../artifacts/qa/stage-c-final-0.1.13.log)。
- 冻结 0.1.12 执行新增三项桌面用例均复现预期失败：Swing 未翻译、推荐空状态未翻译、嵌套快速多杀入口未翻译。日志：[基线失败](../artifacts/qa/stage-c-0.1.12-failures.log)。
- 原产物与源码版本一致，0.1.12 [回退产物](../artifacts/releases/0.1.12/README.md) 保留；配置和权限未变。
- 性能：见 [阶段 C 性能记录](阶段C性能结果.md)，正式数据来自最终构建产物。

## 比赛实页临时验证

完整 0.1.13 在独立内置浏览器的 Vitality–PARIVISION 实页临时运行，经济调整解释、影响力表头、最佳选手 `83.9%` 得票显示中文。原站经济切换两次和 T/双方切换正常：初始 ZywOo 的 `33-15 / 31-15 / +7.73% / 85.9 / 79.7 / 81.6% / 80.8% / 1.66` 在切回双方后保持一致，原姓名与链接不变。

原站有 `.dynamic-map-name-full` 与 `.dynamic-map-name-short` 两个地图槽位，短槽位写回 `All`，本次补充“全部”并加入 class/文字回写的本地回归。Swing 最初译为“回合影响力”时，表头 `clientWidth=65 / scrollWidth=70`；收紧为“影响力”后两者均为 65，完整 title 解释保持。截图：[比赛实页预览](screenshots/match-detail-0.1.13-preview.png)。

最终产物也在独立 `/matches` 页临时运行：完整推荐说明和隐藏空状态均显示中文，图钉节点保留。原站鼠标悬停生成的可见 tooltip 保留同样的完整中文说明，未代用户置顶/取消置顶。截图：[推荐实页 tooltip](screenshots/recommended-0.1.13-preview.png)。

最初尝试从本机 HTTP 加载临时脚本未成功，随后直接读取本地构建产物，通过开发接口临时执行。HTTP 尝试不计入通过证据，临时服务已停止。本次未改 Chrome 已安装脚本或网站持久设置。

## 未覆盖与待验收

1. Stats 本次新实页 DOM、原站筛选/排序/分页/tooltip 交互；当前仅有既有结构与合成故障回归。版本可以手动安装，但阶段 C 的完整实页门槛不能据此标记通过。
2. 开放投票倒计时、未登录/已投票/投票截止的完整状态矩阵；本次只取得百分比获胜和空 subtext。不会为了取样代用户投票。
3. 直播真正为空的正常详情页、实时 `.statCell`/`.st-*` 特殊表和游戏日志；既有“暂无直播”规则仍保持，不扩大未采样布局。
4. Stats 特殊空状态、其他句式、canvas 图表文字，以及未知 VRS 长说明。合成夹具的 `Next` 只是测试监听器的触发器，没有新增未经证实的分页按钮选择器。
5. Tampermonkey 持久安装、覆盖升级、刷新重开、回退与分发仍属于阶段 E；本次临时运行不能替代这些证据。
