import { afterEach, expect, it } from 'vitest';
import { rules } from '../../src/adapters';
import { TranslationEngine } from '../../src/core/engine';
import { detectPage } from '../../src/core/types';
import { walk } from '../../src/core/walker';
import { defaults, parseSettings } from '../../src/features/settings';
import { mapRules } from '../../src/adapters/maps';

afterEach(() => { document.body.innerHTML = ''; });

it('地图快速预判排除普通文本及对象原型键，已翻译字段仍可恢复', () => {
  document.body.innerHTML = '<span>constructor</span><span>toString</span><span>ordinary English</span><img title="Train"><span id="map">Ancient</span>';
  const engine = new TranslationEngine(mapRules, 'other', defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); };
  run();
  expect([...document.querySelectorAll('span')].map(e => e.textContent)).toEqual(['constructor', 'toString', 'ordinary English', '远古遗迹']);
  expect(document.querySelector('img')!.title).toBe('列车停放站');
  engine.configure({ ...defaults(), maps: 'en' }); run();
  expect(document.querySelector('#map')!.textContent).toBe('Ancient'); expect(document.querySelector('img')!.title).toBe('Train');
});
function setup(html: string, path = '/unimplemented-page') {
  document.body.innerHTML = html; const engine = new TranslationEngine(rules, detectPage(path), defaults());
  const run = () => { for (const node of walk(document.body)) engine.process(node); }; run(); return { run, engine };
}

it('完整地图名、大小写及全部指定缩写在任意页面翻译，属性/表格/下拉值保持', () => {
  const pairs = [['DUST2','炽热沙城'],['DUST 2','炽热沙城'],['D2','炽热沙城'],['Mirage','荒漠迷城'],['MRG','荒漠迷城'],['Inferno','炼狱小镇'],['INF','炼狱小镇'],['NUKE','核子危机'],['Overpass','死亡游乐园'],['OVP','死亡游乐园'],['Vertigo','殒命大厦'],['VRT','殒命大厦'],['Ancient','远古遗迹'],['ANC','远古遗迹'],['Train','列车停放站'],['TRN','列车停放站'],['Anubis','阿努比斯'],['ANB','阿努比斯'],['Cache','死城之谜'],['Cobblestone','古堡激战'],['CBL','古堡激战'],['Tuscan','托斯卡纳']];
  const { engine } = setup(pairs.map(([source]) => `<div class="arbitrary">${source}</div>`).join('') + '<table><tr><td class="match-table-map-col">MRG</td></tr></table><img alt="Dust 2" title="ANC"><a href="/stats/maps?maps=de_mirage">Mirage</a><select><option>Train</option><option value="de_tuscan">Tuscan</option></select>');
  expect([...document.querySelectorAll('.arbitrary')].map(e => e.textContent)).toEqual(pairs.map(pair => pair[1]));
  expect(document.querySelector('.match-table-map-col')!.textContent).toBe('荒漠迷城');
  expect(document.querySelector('img')!.getAttribute('alt')).toBe('炽热沙城'); expect(document.querySelector('img')!.getAttribute('title')).toBe('远古遗迹');
  expect(document.querySelector('a')!.getAttribute('href')).toBe('/stats/maps?maps=de_mirage');
  expect([...document.querySelectorAll('option')].map(e => e.value)).toEqual(['Train', 'de_tuscan']); expect(engine.metrics.errors).toBe(0);
});

it('不将同名选手/战队/皮肤及正文译成地图，输入和复合内容保持', () => {
  setup('<a href="/team/1/ancient">Ancient</a><a href="/player/1/train">Train</a><a href="/stats/players/1/mirage">Mirage</a><a href="/stats/teams/1/cache">Cache</a><a href="/skins/rifle/1/ancient">Ancient</a><span class="playerNickname">MRG</span><div class="newstext">Mirage</div><div class="thread-message-text">ANC</div><div contenteditable="true">Tuscan</div><input value="Dust2"><div class="sentence">Rate Ancient</div>');
  expect([...document.querySelectorAll('a')].map(e => e.textContent)).toEqual(['Ancient','Train','Mirage','Cache','Ancient']);
  expect(document.querySelector('.playerNickname')!.textContent).toBe('MRG'); expect(document.querySelector('.newstext')!.textContent).toBe('Mirage');
  expect(document.querySelector('.thread-message-text')!.textContent).toBe('ANC'); expect(document.querySelector<HTMLInputElement>('input')!.value).toBe('Dust2');
  expect(document.querySelector('.sentence')!.textContent).toBe('Rate Ancient');
});

it('全局地图独立于公共及页面开关，动态修改/移入保护区/切回英文均恢复最新原文', () => {
  const { run, engine } = setup('<span id="map">D2</span><select><option>MRG</option></select><div class="newstext"></div>');
  const config = defaults(); for (const key of Object.keys(config.modules) as Array<keyof typeof config.modules>) config.modules[key] = key === 'maps';
  engine.configure(config); document.querySelector('#map')!.firstChild!.nodeValue = 'ANB'; run(); expect(document.querySelector('#map')!.textContent).toBe('阿努比斯');
  const map = document.querySelector('#map')!; document.querySelector('.newstext')!.append(map); run(); expect(map.textContent).toBe('ANB');
  const option = document.querySelector('option')!; option.firstChild!.nodeValue = 'CBL'; run(); expect(option.text).toBe('古堡激战'); expect(option.value).toBe('CBL');
  config.maps = 'en'; engine.configure(config); run(); expect(option.text).toBe('CBL'); expect(option.hasAttribute('value')).toBe(false);
});

it('旧配置迁移默认全站中文、其他开关保持；新配置保留显式英文选择', () => {
  const migrated = parseSettings({ schemaVersion: 1, enabled: false, maps: 'en', modules: { common: false, 'match-detail': false } });
  expect(migrated.schemaVersion).toBe(2); expect(migrated.maps).toBe('zh-CN'); expect(migrated.enabled).toBe(false);
  expect(migrated.modules.common).toBe(false); expect(migrated.modules['match-detail']).toBe(false); expect(migrated.modules.maps).toBe(true);
  expect(parseSettings({ schemaVersion: 2, maps: 'en', modules: { maps: false } }).maps).toBe('en');
  expect(parseSettings({ schemaVersion: 2, maps: 'en', modules: { maps: false } }).modules.maps).toBe(false);
});
