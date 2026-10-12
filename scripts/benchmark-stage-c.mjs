import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// 阶段 C 的活跃模块负载；独立页面、单脚本、本地请求，预热一次后正式五次。
const sources = Object.fromEntries(await Promise.all(Object.entries({
  stageB: 'artifacts/releases/0.1.12/hltv-zh-cn.user.js', current: 'dist/hltv-zh-cn.user.js',
}).map(async ([key, path]) => [key, await readFile(path, 'utf8')])));
const fixtures = {
  match: await readFile('tests/fixtures/match-detail.html', 'utf8'),
  statistics: await readFile('tests/fixtures/statistics-specialty.html', 'utf8'),
};
const rows = []; const browser = await chromium.launch();
try {
  for (let repetition = 0; repetition < 6; repetition++) {
    for (const variant of repetition % 2 ? ['current', 'stageB'] : ['stageB', 'current']) {
      for (const scenario of ['match', 'statistics', 'tooltip']) {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await page.route('**/*', route => new URL(route.request().url()).hostname === 'hltv.test'
          ? route.fulfill({ contentType: 'text/html', body: fixtures[scenario === 'match' ? 'match' : 'statistics'] }) : route.abort());
        await page.goto('http://hltv.test' + (scenario === 'match' ? '/matches/2398751/example' : '/stats/teams/pistols'));
        await page.evaluate(scenario => {
          window.GM_getValue = () => ({ schemaVersion: 2, maps: 'zh-CN' });
          window.GM_setValue = window.GM_registerMenuCommand = () => {};
          const template = document.querySelector(scenario === 'match' ? '.totalstats' : '.stats-section table').outerHTML;
          const target = document.querySelector(scenario === 'match' ? '.match-page' : '.stats-section');
          if (scenario !== 'tooltip') target.insertAdjacentHTML('beforeend', template.repeat(150));
          const b = window.cBench = { start: performance.now(), rafMs: 0, maxRafMs: 0, batches: 0, writes: 0, lastMs: null, longTasks: [] };
          const raf = window.requestAnimationFrame.bind(window);
          window.requestAnimationFrame = callback => raf(timestamp => {
            const start = performance.now(); callback(timestamp); const duration = performance.now() - start;
            b.rafMs += duration; b.maxRafMs = Math.max(b.maxRafMs, duration); b.batches++;
          });
          new MutationObserver(records => {
            const writes = records.filter(r => r.type === 'characterData' || r.type === 'attributes').length;
            b.writes += writes; if (writes) b.lastMs = performance.now() - b.start;
          }).observe(document.body, { subtree: true, characterData: true, attributes: true });
          new PerformanceObserver(list => b.longTasks.push(...list.getEntries().map(e => e.duration))).observe({ type: 'longtask' });
        }, scenario);
        await page.addScriptTag({ content: sources[variant] });
        await page.waitForTimeout(1400);
        if (scenario === 'tooltip') {
          await page.evaluate(() => {
            const b = window.cBench; b.start = performance.now(); b.rafMs = b.maxRafMs = b.batches = b.writes = 0; b.lastMs = null; b.longTasks = [];
            for (let i = 0; i < 100; i++) {
              const tooltip = document.createElement('div'); tooltip.className = 'tooltip-box tooltip-attributes';
              tooltip.innerHTML = '<b>Fast multi-kill:</b>A streak of kills done by a player with less than 5 seconds between each kill. It\'s possible to do more than one fast multi-kill in a single round.';
              document.body.append(tooltip);
            }
          });
          await page.waitForTimeout(1400);
        }
        rows.push({ variant, scenario, repetition, warmup: repetition === 0, ...await page.evaluate(scenario => ({
          ...window.cBench,
          translated: scenario === 'match' ? [...document.querySelectorAll('.roundSwing')].filter(e => e.textContent === '影响力').length
            : scenario === 'statistics' ? [...document.querySelectorAll('th')].filter(e => e.textContent === '第 2 回合转化率').length
            : [...document.querySelectorAll('body > .tooltip-attributes > b')].filter(e => e.textContent === '快速多杀：').length,
          sharedPagination: document.querySelector('.pagination-data')?.textContent,
          entityIntact: scenario === 'match' ? document.querySelector('.teamName').textContent === 'Vitality' : document.querySelector('a[href="/stats/teams/1/ancient"]').textContent === 'Ancient',
        }), scenario) });
        await page.close();
      }
    }
    console.log(`阶段 C 负载完成第 ${repetition} 轮`);
  }
  await writeFile('docs/performance/stage-c-active-0.1.13.json', JSON.stringify({
    browser: browser.version(), node: process.version, measuredAt: new Date().toISOString(),
    hashes: Object.fromEntries(Object.entries(sources).map(([key, code]) => [key, createHash('sha256').update(code).digest('hex')])),
    notes: ['1 warmup + 5 measured repetitions', 'rAF includes only local-fixture script callbacks; not whole browser CPU', 'Different translation coverage: timing is not a same-output speed contest', 'Long tasks include instrumentation; local fixtures, not live-site performance'], rows,
  }, null, 2) + '\n');
} finally { await browser.close(); }
