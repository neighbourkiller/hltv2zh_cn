import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';

// 全部请求在本地拦截；各版本独立页面，使用相同 DOM、操作与时间窗口。
const variants = {
  legacy: 'DiscontinuedScripts/HLTV中文化NEXT-1.7.0.user.js',
  baseline: 'artifacts/releases/0.1.11/hltv-zh-cn.user.js',
  stageB: 'artifacts/releases/0.1.12/hltv-zh-cn.user.js',
  current: 'dist/hltv-zh-cn.user.js',
};
const selected = (process.argv[2] ?? 'legacy,baseline,current').split(',');
const output = process.argv[3] ?? 'docs/performance/latest.json';
const scripts = Object.fromEntries(await Promise.all(selected.map(async key => {
  if (!variants[key]) throw new Error('Unknown variant: ' + key);
  return [key, await readFile(variants[key], 'utf8')];
})));
const browser = await chromium.launch();
const rows = [];
try {
  for (let repetition = 0; repetition < 6; repetition++) {
    // 首轮预热不计入摘要；轮换版本顺序减少固定次序偏差。
    const order = [...selected.slice(repetition % selected.length), ...selected.slice(0, repetition % selected.length)];
    for (const variant of order) for (const scenario of ['initial', 'insert1500', 'textUpdates', 'table', 'idle', 'contention']) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.route('**/*', route => route.request().url() === 'http://hltv.test/'
        ? route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><body><a class="nav-link">News</a><h2 class="newsheader">Today\'s news</h2><div id="target"></div><a href="/team/1/ancient">Ancient</a><div class="newstext">Train</div></body>' }) : route.abort());
      await page.goto('http://hltv.test/');
      await page.evaluate(({ scenario }) => {
        const b = window.bench = { cpuMs: 0, callbacks: 0, visited: 0, writes: 0, firstMs: null, lastMs: null, longTasks: [], phase: 'setup' };
        window.GM_getValue = () => ({ schemaVersion: 2, maps: 'zh-CN' });
        window.GM_setValue = () => {};
        window.GM_registerMenuCommand = () => {};
        const target = document.querySelector('#target');
        const fill = (count, table = false) => {
          target.innerHTML = table
            ? '<table><tbody>' + Array.from({ length: count }, (_, i) => `<tr><td>unmatched content ${i}</td><td>${i}</td><td>Ancient</td></tr>`).join('') + '</tbody></table>'
            : Array.from({ length: count }, (_, i) => `<div class="newsrecent">${i} hours ago</div><span>ordinary English text ${i}</span>`).join('');
        };
        if (scenario === 'initial') fill(1500);
        if (scenario === 'table') fill(1500, true);
        const NativeObserver = MutationObserver;
        window.MutationObserver = class extends NativeObserver {
          constructor(callback) { super((records, observer) => { const start = performance.now(); callback(records, observer); b.cpuMs += performance.now() - start; b.callbacks++; }); }
        };
        const createWalker = document.createTreeWalker.bind(document);
        document.createTreeWalker = (...args) => {
          const walker = createWalker(...args), next = walker.nextNode.bind(walker);
          walker.nextNode = () => { const result = next(); if (result) b.visited++; return result; }; return walker;
        };
        new NativeObserver(records => {
          if (b.phase !== 'measure') return;
          b.writes += records.filter(r => r.type === 'characterData').length;
          const now = performance.now() - b.start;
          if (records.some(r => r.type === 'characterData')) { b.firstMs ??= now; b.lastMs = now; }
        }).observe(document.body, { subtree: true, characterData: true });
        // 长任务包括夹具/测量开销，不能直接声称全部由脚本造成。
        new PerformanceObserver(list => { for (const e of list.getEntries()) if (e.startTime >= b.start) b.longTasks.push(e.duration); }).observe({ type: 'longtask' });
        window.begin = () => { b.cpuMs = b.callbacks = b.visited = b.writes = 0; b.longTasks = []; b.firstMs = b.lastMs = null; b.start = performance.now(); b.phase = 'measure'; };
        window.exercise = () => {
          if (scenario === 'insert1500') fill(1500);
          if (scenario === 'textUpdates' || scenario === 'contention') {
            const node = document.querySelector('h2').firstChild;
            let count = 0;
            const timer = setInterval(() => {
              node.data = ++count % 2 ? "Today's news" : "Yesterday's news";
              if (count === 30) { clearInterval(timer); b.lastSiteWrite = performance.now() - b.start; }
            }, scenario === 'contention' ? 25 : 40);
          }
        };
      }, { scenario });
      if (['initial', 'table'].includes(scenario)) await page.evaluate(() => window.begin());
      await page.addScriptTag({ content: scripts[variant] });
      if (!['initial', 'table'].includes(scenario)) {
        await page.waitForTimeout(1500);
        await page.evaluate(() => { window.begin(); window.exercise(); });
      }
      await page.waitForTimeout(scenario === 'contention' ? 11500 : 2200);
      const metrics = await page.evaluate(({ scenario }) => {
        const b = window.bench;
        const texts = [...document.querySelectorAll('.newsrecent')];
        const heading = document.querySelector('h2').textContent;
        return { ...b, elapsedMs: performance.now() - b.start, headline: heading,
          finalCorrect: heading === (['textUpdates','contention'].includes(scenario) ? '昨日新闻' : '今日新闻'),
          translatedItems: texts.filter(e => /小时/.test(e.textContent)).length,
          mapItems: [...document.querySelectorAll('td')].filter(e => e.textContent === '远古遗迹').length,
          entityIntact: document.querySelector('a[href^="/team/"]').textContent === 'Ancient',
          bodyIntact: document.querySelector('.newstext').textContent === 'Train' };
      }, { scenario });
      rows.push({ variant, scenario, repetition, warmup: repetition === 0, ...metrics });
      await page.close();
      console.log(`${variant}/${scenario} #${repetition}: visited=${metrics.visited}, correct=${metrics.finalCorrect}`);
    }
  }
  const result = { measuredAt: new Date().toISOString(), node: process.version, browser: browser.version(), platform: `${os.platform()} ${os.release()}`, cpu: os.cpus()[0]?.model,
    hashes: Object.fromEntries(Object.entries(scripts).map(([key, script]) => [key, createHash('sha256').update(script).digest('hex')])),
    notes: ['1 warmup + 5 measured repetitions', 'Observer callback time excludes scheduled rAF translation; not total CPU time.', 'Text write counts include 30 site writes in update/contention scenarios.', 'Long tasks include harness overhead. Timings are instrumented local fixtures, not real-site performance.'], rows };
  await mkdir(output.replace(/[/\\][^/\\]+$/, ''), { recursive: true });
  await writeFile(output, JSON.stringify(result, null, 2) + '\n');
  console.log('Saved ' + output);
} finally { await browser.close(); }
