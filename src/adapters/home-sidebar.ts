import type { Rule } from '../core/types';
import { exact } from '../core/rules';
import { dateText } from './templates';

// 2026-10-08 用户已安装脚本的首页 DOM；只处理界面槽位，不处理卡片实体名称。
export const homeSidebarRules: Rule[] = [
  exact('home.sponsors', 'common', '.presented-by-row h1 > a', {
    'AWARD BY': '颁奖给', 'RANKING BY': '排名',
  }),
  exact('home.fpl-heading', 'common', 'h1 > a[href^="https://www.faceit.com/"]', {
    'FPL RANKING': 'FPL 排名',
  }),
  exact('home.sidebar-buttons', 'common', 'a.block.button[href="/ranking/teams"], a.block.button[href^="https://www.faceit.com/"], a.block.button[href="/calendar"]', {
    'Complete ranking': '完整排名', 'Event calendar': '赛事日历',
  }),
  exact('home.ranking-updated-label', 'common', 'a.block.button[href="/ranking/teams"] > .normal-weight', {
    'Last updated:': '最后更新：',
  }),
  { id: 'home.ranking-updated-date', module: 'common',
    selector: 'a.block.button[href="/ranking/teams"] > .normal-weight', translate: dateText },
  exact('home.weekly-player', 'common', '.playerOfTheWeekCategory, .playerOfTheWeekTitle', {
    'Player of the week': '本周最佳选手', 'Most damage / round': '每回合伤害最高',
    'Opening duels won': '首次交锋胜率', 'AWP kills / round': '每回合 AWP 击杀',
    Clutches: '残局获胜',
  }),
  exact('home.event-live', 'common', 'a.event > .live', { Live: '进行中' }),
  { id: 'home.event-countdown', module: 'common', selector: 'a.event > .eventcountdown', translate: source => {
    const match = /^(\d+)\s+days?$/i.exec(source);
    return match ? `${match[1]} 天后` : undefined;
  } },
  { id: 'common.stream-viewers', module: 'common', selector: '.streams-viewers[data-active-stream-viewers]', translate: source => {
    const match = /^(\d[\d,]*)\s+viewers?$/i.exec(source);
    return match ? `${match[1]} 人观看` : undefined;
  } },
  exact('home.new-topic', 'common', 'a.button[href="/forums/create-thread"]', { 'Post new topic': '发布新主题' }),
  exact('home.minigame', 'common', 'h1.minigame-label-new', { MINIGAME: '小游戏' }),
  exact('common.footer-headings', 'common', '.footer-section-header', {
    'HLTV merchandise': 'HLTV 周边', 'Download the HLTV app': '下载 HLTV 应用',
  }),
  exact('common.footer-copy', 'common', '.footer-section-subtext, a.footer-cta-button', {
    'HLTV Community t-shirt and sweatshirt available now': 'HLTV 社区 T 恤及卫衣现已发售',
    'Optimized to keep you up to date on the go': '随时随地掌握最新资讯',
    'Buy HLTV merch': '购买 HLTV 周边',
  }),
  exact('common.footer-links', 'common', 'a.footerlink', {
    Jobs: '招聘', Contact: '联系我们', About: '关于我们', Terms: '使用条款',
    'Privacy policy': '隐私政策', 'Cookie policy': 'Cookie 政策', Disclosures: '披露声明',
    Skins: '皮肤',
  }),
];
