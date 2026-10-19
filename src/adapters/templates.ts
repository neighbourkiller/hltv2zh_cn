const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const monthNumber = (value: string) => monthNames.findIndex(month => month === value.toLowerCase() || month.slice(0, 3) === value.toLowerCase()) + 1;
/** 只变更页面已显示的日历表达，不从时间戳重算时区。 */
export function dateText(source: string): string | undefined {
  const value = source.trim();
  let m = /^(?:Results for\s+)?([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,)?(?:\s+(\d{4}))?$/i.exec(value);
  if (m && monthNumber(m[1]) && +m[2] >= 1 && +m[2] <= 31) {
    return `${m[3] ? m[3] + '年' : ''}${monthNumber(m[1])}月${m[2]}日${/^Results for/i.test(value) ? '的赛果' : ''}`;
  }
  m = /^(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?([A-Za-z]+)(?:\s+(\d{4}))?$/i.exec(value);
  if (m && monthNumber(m[2]) && +m[1] >= 1 && +m[1] <= 31) return `${m[3] ? m[3] + '年' : ''}${monthNumber(m[2])}月${m[1]}日`;
  m = /^([A-Za-z]+)\s+(\d{4})$/.exec(value);
  if (m && monthNumber(m[1])) return `${m[2]}年${monthNumber(m[1])}月`;
  return undefined;
}
export function relativeTime(source: string): string | undefined {
  const m = /^(a few|a|an|one|two|\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i.exec(source.trim());
  if (!m) return;
  const count = ({ a: '1', an: '1', one: '1', two: '2', 'a few': '几' } as Record<string, string>)[m[1].toLowerCase()] ?? m[1];
  const unit = ({ second: '秒', minute: '分钟', hour: '小时', day: '天', week: '周', month: '个月', year: '年' } as Record<string, string>)[m[2].toLowerCase()];
  return `${count}${unit}前`;
}

/** 排名日期筛选中的英文序数；保持 1–31 的既有范围。 */
export function ordinalDay(text: string): string | undefined {
  const m = /^(\d{1,2})(?:st|nd|rd|th)$/i.exec(text);
  return m && +m[1] >= 1 && +m[1] <= 31 ? m[1] + '日' : undefined;
}
