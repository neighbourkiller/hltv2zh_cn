import { expect, type Page } from '@playwright/test';

export async function expandSettings(page: Page) {
  await expect.poll(() => page.evaluate(() => (window as any).menus?.length ?? 0)).toBeGreaterThan(0);
  await page.evaluate(() => (window as any).menus.find((m: any) => m.name === '展开设置')?.action());
}
