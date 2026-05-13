import { test, expect } from '@playwright/test';

test('landing page flow', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check rebranding in nav
  await expect(page.getByText('ASTRONAUT', { exact: true })).toBeVisible();

  // Check main title
  await expect(page.locator('h1')).toContainText('Transcend');

  // Check for navigation links
  await expect(page.getByRole('button', { name: 'Telemetry' })).toBeVisible();

  // Check Briefing Modal
  await page.getByText('Mission Briefing').click();
  await expect(page.getByText('Mission Architecture')).toBeVisible();
  await page.getByText('✕').click();
  await expect(page.getByText('Mission Architecture')).not.toBeVisible();

  // Start sequence
  const launchBtn = page.getByRole('button', { name: 'Engage Drive' });
  await launchBtn.click();

  // Wait for travel state
  await expect(page.getByText('Transcendence Active')).toBeVisible({ timeout: 20000 });

  // Click abort (Disengage)
  await page.getByRole('button', { name: '[ Disengage ]' }).click();
  await expect(page.getByRole('button', { name: 'Engage Drive' })).toBeVisible();
});
