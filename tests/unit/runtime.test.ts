import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { start } from '../../src/core/runtime';
import { rules } from '../../src/adapters';
import { defaults } from '../../src/features/settings';
import { RetryQueue } from '../../src/core/retry-queue';

let runtime: ReturnType<typeof start> | undefined;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  history.replaceState({}, '', '/');
});
afterEach(() => { runtime?.stop(); runtime = undefined; vi.useRealTimers(); document.body.innerHTML = ''; history.replaceState({}, '', '/'); });
const flush = () => vi.advanceTimersByTimeAsync(200);

it('仅 class 变化即可进入/离开待定队伍规则，保留 Text 和原监听器', async () => {
  history.replaceState({}, '', '/events/8244/example');
  document.body.innerHTML = '<div class="event-page"><div id="team" class="team"><span class="team-name">TBD</span></div></div>';
  const team = document.querySelector('#team')!, text = team.firstChild!.firstChild!;
  const click = vi.fn(); team.addEventListener('click', click);
  runtime = start(document, rules, defaults()); await flush();
  expect(text.nodeValue).toBe('TBD');
  team.classList.add('team-tbd'); await flush(); expect(text.nodeValue).toBe('待定');
  team.classList.remove('team-tbd'); await flush(); expect(text.nodeValue).toBe('TBD');
  team.dispatchEvent(new Event('click')); expect(click).toHaveBeenCalledOnce();
  expect(team.firstChild!.firstChild).toBe(text);
  text.nodeValue = 'Ancient'; team.classList.add('team-tbd'); await flush();
  expect(text.nodeValue).toBe('Ancient');
  // 真队名替换占位符时，不应被全站地图当成地图翻译。
  team.classList.remove('team-tbd'); await flush(); expect(text.nodeValue).toBe('Ancient');
});

it('原有节点只更换目标 class 即重译/恢复；祖先保护类与无关动画类分开处理', async () => {
  history.replaceState({}, '', '/events/8244/example');
  document.body.innerHTML = '<div class="event-page"><div id="parent"><div id="label">Grand final</div><span>Train</span></div><div id="noise">noise</div></div>';
  runtime = start(document, rules, defaults()); await flush();
  const label = document.querySelector('#label')!, parent = document.querySelector('#parent')!;
  label.className = 'round-header'; await flush(); expect(label.textContent).toBe('总决赛');
  label.className = ''; await flush(); expect(label.textContent).toBe('Grand final');
  parent.className = 'newstext'; await flush(); expect(parent.querySelector('span')!.textContent).toBe('Train');
  parent.className = ''; await flush(); expect(parent.querySelector('span')!.textContent).toBe('列车停放站');
  const visited = runtime.engine.metrics.visited;
  for (let i = 0; i < 30; i++) document.querySelector('#noise')!.classList.toggle('flash');
  await flush(); expect(runtime.engine.metrics.visited).toBe(visited);
});

it('轮次折叠只重查表头，连续 class 变更最终状态正确', async () => {
  history.replaceState({}, '', '/events/8244/example');
  document.body.innerHTML = '<div class="event-page"><div class="round"><div class="round-header" title="Collapse round">Quarter-finals</div><div id="score">2</div></div></div>';
  runtime = start(document, rules, defaults()); await flush();
  const round = document.querySelector('.round')!;
  const visited = runtime.engine.metrics.visited;
  round.classList.add('collapsed'); await flush();
  expect(runtime.engine.metrics.visited - visited).toBe(2); // 表头 Element + Text，非整轮。
  const header = document.querySelector('.round-header')!;
  header.className = ''; header.className = 'round-header'; await flush();
  expect(header.textContent).toBe('四分之一决赛'); expect(document.querySelector('#score')!.textContent).toBe('2');
});

function flood(node: Text | Element, attribute?: string) {
  for (let i = 0; i < 25; i++) {
    if (attribute) (node as Element).setAttribute(attribute, 'Search...');
    else (node as Text).data = "Today's news";
    runtime!.engine.process(node);
  }
}

it('限流结束后没有新变更也重译最新 Text 与属性；同节点预约去重', async () => {
  document.body.innerHTML = '<h2 class="newsheader">Today\'s news</h2><input placeholder="Search...">';
  runtime = start(document, rules, defaults()); await flush();
  const text = document.querySelector('h2')!.firstChild as Text, input = document.querySelector('input')!;
  flood(text); flood(input, 'placeholder'); await flush();
  expect(runtime.retries.size).toBe(2); expect(text.data).toBe("Today's news");
  text.data = "Yesterday's news"; await flush(); expect(runtime.retries.size).toBe(2);
  await vi.advanceTimersByTimeAsync(10000);
  expect(text.data).toBe('昨日新闻'); expect(input.placeholder).toBe('搜索…');
  expect(runtime.retries.size).toBe(0); expect(runtime.retries.metrics.retried).toBe(2);
});

it('恢复不会覆盖网站后来写入的新值或删除的属性；模块停用清理预约', async () => {
  document.body.innerHTML = '<h2 class="newsheader">Today\'s news</h2><input placeholder="Search...">';
  runtime = start(document, rules, defaults()); await flush();
  const text = document.querySelector('h2')!.firstChild as Text, input = document.querySelector('input')!;
  flood(text); flood(input, 'placeholder');
  text.data = 'Server changed this'; input.removeAttribute('placeholder'); await flush();
  await vi.advanceTimersByTimeAsync(11000);
  expect(text.data).toBe('Server changed this'); expect(input.hasAttribute('placeholder')).toBe(false);
  flood(text); await flush(); expect(runtime.retries.size).toBe(1);
  const settings = defaults(); settings.modules.home = false; runtime.update(settings); await flush();
  expect(runtime.retries.size).toBe(0); await vi.advanceTimersByTimeAsync(11000);
  expect(text.data).toBe("Today's news");
});

it('移除节点和停止运行会取消重试，重新争夺会进入新的冷却周期', async () => {
  document.body.innerHTML = '<h2 class="newsheader">Today\'s news</h2>';
  runtime = start(document, rules, defaults()); await flush();
  const text = document.querySelector('h2')!.firstChild as Text;
  flood(text); await vi.advanceTimersByTimeAsync(11000); expect(text.data).toBe('今日新闻');
  flood(text); await flush(); expect(runtime.retries.size).toBe(1); expect(runtime.engine.metrics.throttled).toBe(2);
  const heading = text.parentElement!;
  heading.remove(); await flush(); expect(runtime.retries.size).toBe(0);
  document.body.append(heading); flood(text); expect(runtime.retries.size).toBe(1);
  runtime.stop(); await vi.advanceTimersByTimeAsync(11000);
  expect(runtime.retries.size).toBe(0); expect(text.data).toBe("Today's news");
});

it('延迟任务有容量上限、同节点取最早截止时间，满额先清理断开节点', async () => {
  document.body.innerHTML = '<span>A</span><span>B</span><span>C</span>';
  const nodes = [...document.querySelectorAll('span')]; const retry = vi.fn();
  const queue = new RetryQueue(retry, 2);
  queue.add(nodes[0], 1000); queue.add(nodes[0], 2000); queue.add(nodes[1], 1500); queue.add(nodes[2], 1600);
  expect(queue.size).toBe(2); expect(queue.metrics.overflow).toBe(1); expect(vi.getTimerCount()).toBe(1);
  nodes[1].remove(); queue.add(nodes[2], 1200); expect(queue.size).toBe(2);
  await vi.advanceTimersByTimeAsync(1001); expect(retry).toHaveBeenCalledExactlyOnceWith(nodes[0]);
  await vi.advanceTimersByTimeAsync(200); expect(retry).toHaveBeenLastCalledWith(nodes[2]);
  expect(queue.size).toBe(0); expect(vi.getTimerCount()).toBe(0); queue.stop();
});
